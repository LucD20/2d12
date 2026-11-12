// SIM-1 (2026-11-12): one PC turn: its Actions resolved in order (AP, Strikes, Frequencies, Escalation, Linked Actions, effects).
// Moved here from spec.mjs unchanged. What the turn is and whom it hits come from the caller's ctx (the engine and its policy).
import { RULES, C, RR, rng, pick, pickU, rollDamage, avgDamage, mindShare, weaponTier } from "./core.mjs";

/** A turn's step: "move 1", "Weapon Attack", "Weapon Attack (reload shot)", "Weapon Attack (+1 boon)". */
export function stepOf(s) {
  const mv = s.match(/^move\s+(\d+)$/i);
  if (mv) return { kind: "move", ap: Number(mv[1]), how: "move" };
  if (/^advance$/i.test(s)) return { kind: "move", ap: 1, how: "advance" };                        // the Advance Action: up to your Speed
  const ev = s.match(/^evade\s+([12])$/i);                                                        // the Evade Action: 1 AP Evade 1, 2 AP Evade half your Speed
  if (ev) return { kind: "move", ap: Number(ev[1]), how: "evade", sq: ev[1] === "1" ? 1 : "half" };
  const m = s.match(/^(.+?)\s*(?:\((.+)\))?$/), opts = (m[2] ?? "").toLowerCase();
  return { kind: "action", name: m[1].trim().toLowerCase(), alt: opts.match(/else ([^,)]+)/)?.[1]?.trim() ?? null, reloadShot: /reload shot/.test(opts), keep: Number(opts.match(/keep (\d+)/)?.[1] ?? 0), boons: Number(opts.match(/\+(\d+) boon/)?.[1] ?? 0), banes: Number(opts.match(/\+(\d+) bane/)?.[1] ?? 0) };
}


/* ------------------------------------------------------------------ one PC's turn */
export const matches = (eff, a, traits, target, pc) => (!eff.name || a.name.toLowerCase().startsWith(eff.name)) && (eff.traits ?? []).every(t => traits.includes(t)) && (!eff.quarry || (target && target === pc.quarry))
  && (!eff.bloodied || (target && (target.bloodiedRound != null || target.strainedRound != null)))   // pack R-classes: "bloodied" = only against a Bloodied or Strained target (Finisher)
  && (!eff.strained || (target && target.strainedRound != null));   // "strained": only against a Strained target (Reckoning)
export const group = name => name.toLowerCase().replace(/\s+\d+$/, "");   // "Smite 2" and "Smite 3" share their Frequency
export const hasDamage = d => d.dice.length + d.w + d.flat + d.mod > 0;

/**
 * Run one turn. pc: { build, unloaded, spent, quarry, firstThisRound }; turn: { steps }; ctx: { R, escalation, target(): the enemy to hit,
 * others(n): other enemies (an area, a different target), heal(pc, n), defend(pc, n, who) }. Returns { damage, ap, strikes, problems }.
 */
export function runTurn(pc, turn, ctx) {
  const b = pc.build, R = ctx.R, st = { next: [...(ctx.startNext ?? [])], turnFx: [], atWill: {}, used: new Set() }, res = { damage: 0, counted: 0, mind: 0, ap: 0, strikes: 0, problems: [], missed: [], lostAP: 0, lastTier: 0 };
  // Escalation is a resource (the book, Escalation): an Active spends what it costs; a passive works while you have at least its number.
  pc.esc ??= ctx.escalation ?? 3;
  const passives = () => b.passives.filter(p => pc.esc >= p.escalation);
  pc.firstThisRound ??= new Set();
  // A Weapon Action takes Ranged or Melee from the weapon, and Shot when the weapon is Projectile (the book, Traits: Shot).
  const weaponGives = () => [...(b.weapon?.traits ?? []).filter(x => x === "ranged" || x === "melee"), ...((b.weapon?.traits ?? []).includes("projectile") ? ["shot"] : [])];
  const traitsOf = (a, extra = []) => [...new Set([...a.traits, ...extra, ...(a.traits.includes("weapon") ? weaponGives() : [])])];
  const apply = (e, target, a = null) => {
    if (["boon", "bane", "empowered", "favored", "extra"].includes(e.kind)) (e.scope === "turn" ? st.turnFx : e.scope === "encounter" ? (pc.encFx ??= []) : st.next).push(e);
    else if (e.kind === "heal") ctx.heal?.(pc, e.n, e.who);
    else if (e.kind === "mend") { const n = Math.round(a?.allies ?? 1); if (n > 1 && ctx.mendMany) ctx.mendMany(pc, () => rollDamage(R, e.dmg, { mod: b.powerMod }).total, e.who, n, a); else ctx.mend?.(pc, rollDamage(R, e.dmg, { mod: b.powerMod }).total, e.who); }   // `allies N`: the N most hurt (pack R-classes: Hallowed Dawn)
    else if (e.kind === "guard") ctx.guard?.(pc, rollDamage(R, e.dmg, { mod: a && a.vs !== "none" && a.vs !== "wd" ? b.weaponMod : b.powerMod }).total, e.who);   // [Mod] is the Action's Modifier (Smite 3's Guard: the Weapon Modifier)
    else if (e.kind === "surge" && target) target.surge = { dmg: e.dmg, by: pc };
    else if (e.kind === "banes") ctx.zone?.(pc, e, a, target);
    else if (e.kind === "healdice") ctx.zoneHeal?.(pc, e, a);
    else if (e.kind === "debuff") { if (pc.st) pc.st.debuffs[e.name] = (pc.st.debuffs[e.name] ?? 0) + 1; ctx.condition?.(pc, e, target); }
    else if (["push", "pull", "slide"].includes(e.kind)) ctx.condition?.(pc, e, target);   // Forced Movement (the map model)
    else if (e.kind === "cover") pc.ignoreCover = true;                                    // True Shot, Perfect Shot: the next Strike ignores Cover
    else if (e.kind === "defense") ctx.defend?.(pc, e.n, e.who, a);
    else if (e.kind === "evade") { /* moved before the roll */ }
    else if (e.kind === "taunt" && target) target.taunt = { by: pc, n: e.n };
    else if (e.kind === "vulnerable" && target) { if (e.n >= (target.vulnerable ?? 0)) target.vulnBy = pc; target.vulnerable = Math.max(target.vulnerable ?? 0, e.n); if (e.keep) target.vulnKeep = pc; if (pc.st) pc.st.debuffs[`Vulnerable ${e.n}`] = (pc.st.debuffs[`Vulnerable ${e.n}`] ?? 0) + 1; }
    else if (e.kind === "reload") pc.unloaded = false;
  };
  const doAction = (a, opts = {}, extraTraits = [], linked = false, forced = null) => {
    const traits = traitsOf(a, extraTraits);
    if (!linked) for (const e of a.effects) if (e.effect.kind === "evade" && e.min === 1) ctx.move?.(pc, { how: "evade", sq: e.effect.n, free: true });   // "Evade 1, then ...": before the roll (the map model)
    if (traits.includes("weapon") && pc.unloaded && !a.effects.some(e => e.effect.kind === "reload")) { res.missed.push(`${a.name}: the weapon is unloaded`); return; }   // a failed Reload roll: bad luck, not a rule problem
    if (a.does.length) {   // Linked Actions (1A): no AP, no Frequency, no Strike, no At-will Bane
      const each = { boons: a.each.filter(e => e.kind === "boon").reduce((s, e) => s + e.n, 0), empowered: a.each.filter(e => e.kind === "empowered").reduce((s, e) => s + e.n, 0), extra: a.each.filter(e => e.kind === "extra").map(e => e.dmg) };
      const first = ctx.target(), others = a.different ? (ctx.others(a.does.length - 1) ?? []) : [];
      // "Two creatures" with one enemy left: the Action can't be used (no valid target); the player would make Weapon Attacks instead (the same AP), so the repeat takes the At-will Bane.
      a.does.forEach((d, k) => { const repeat = k > 0 && a.different && !others[k - 1]; doAction(b.actions[d.toLowerCase()], { ...each, reloadShot: opts.reloadShot && k === a.does.length - 1, atWillBane: repeat }, a.gives ?? [], true, k === 0 || !a.different ? first : (others[k - 1] ?? first)); });
      for (const e of a.effects) apply(e.effect, first, a);
      return;
    }
    if (a.vs === "none") { for (const e of a.effects) apply(e.effect, ctx.target(), a); return; }
    const reloadShot = opts.reloadShot && traits.includes("weapon") && (b.weapon?.traits ?? []).includes("reload");
    if (opts.reloadShot && !reloadShot) res.problems.push(`${a.name}: a Reload Shot needs a Weapon Action with a Reload weapon`);
    let boons = opts.boons ?? 0, banes = opts.banes ?? 0, favored = reloadShot || !!a.favored, emp = (opts.empowered ?? 0) + (reloadShot ? 2 : 0), bonus = 0;
    const extra = [...(opts.extra ?? [])], anyTier = [], floors = [], firstHit = [], dc = a.vs.match(/^dc\s+(\d+)/)?.[1];
    const target = dc ? null : (forced ?? ctx.target(a));   // the Action goes with the question: a policy can pick by the size of the hit
    if (!dc && !target) return;
    for (const p of passives()) {
      if (!matches(p.effect, a, traits, target, pc)) continue;
      if (p.effect.kind === "boon") boons += p.effect.n;
      if (p.effect.kind === "empowered") emp += p.effect.n;
      if (p.effect.kind === "bonus") bonus += p.effect.n;
      if (p.effect.kind === "extra" && p.effect.scope === "first" && !pc.firstThisRound.has(p.name)) { extra.push(p.effect.dmg); pc.firstThisRound.add(p.name); }
      if (p.effect.kind === "extra" && p.effect.scope === "first-hit" && !pc.firstThisRound.has(p.name)) { extra.push(p.effect.dmg); firstHit.push(p.name); }   // used up only if this Action deals damage
      if (p.effect.kind === "extra" && p.effect.scope === "each") extra.push(p.effect.dmg);   // pack R-classes: on every matching Action (Reckoning: "each ... bloodied")
      if (p.effect.kind === "floor") floors.push(p.effect.dmg);
    }
    for (const x of [...st.turnFx, ...(pc.encFx ?? [])]) if (matches(x, a, traits, target, pc)) { if (x.kind === "empowered") emp += x.n; if (x.kind === "boon") boons += x.n; }
    st.next = st.next.filter(x => {
      if (!matches(x, a, traits, target, pc)) return true;
      if (x.kind === "boon") boons += x.n; else if (x.kind === "bane") banes += x.n; else if (x.kind === "empowered") emp += x.n; else if (x.kind === "favored") favored = true; else if (x.kind === "extra") (x.anyTier ? anyTier : extra).push(x.dmg);
      return false;
    });
    if (a.freq === "at-will" && !linked) { const k = group(a.name); banes += RR.atWillBanes(st.atWill[k] ?? 0); st.atWill[k] = (st.atWill[k] ?? 0) + 1; }
    if (opts.atWillBane) { const k = "weapon attack"; banes += RR.atWillBanes(st.atWill[k] ?? 0); st.atWill[k] = (st.atWill[k] ?? 0) + 1; }   // a Linked attack that had to repeat a target counts as a Weapon Attack (Double Shot with one enemy left)
    if (RULES.bloodiedBanes && (traits.includes("strike") || traits.includes("weapon")) && pc.damage != null && pc.build.bodyHealth && pc.damage >= pc.build.bodyHealth) banes++;   // the book's Bloodied rule
    const mod = a.vs === "wd" ? b.powerMod : b.weaponMod;
    if (dc) {   // a roll against a DC (Reload): no target, no damage
      const tier = pick(R, C.tierProbs(mod, Number(dc), boons, banes, favored ? "favored" : ""));
      for (const e of a.effects) if (tier >= e.min && tier <= e.max) apply(e.effect, null);
      return;
    }
    // SIM-2 (areas): on the grid an Area hits the creatures that stand in it (the engine places it); else the number of creatures its ruler line says.
    const targets = (a.shape && ctx.areaTargets?.(a, target)) || [target, ...(a.area > 1 ? ctx.others(a.area - 1) : [])];
    let mainTier = 1, critShare = 0;
    for (const t of targets) {
      let tier; const dmg0 = t.damage ?? 0;
      const mm = a.vs.startsWith("save") ? null : ctx.mods?.(a, traits, t);   // the map model: range, Engaged, Cover, Flanking, Prone
      if (mm?.skip) continue;
      // The Bestiary's turn budget (2026-11-12): the PC's own conditions from the enemies (Frightened, Taunted, Blinded, Enfeebled, a next-roll Bane or Doomed:
      // ctx.selfMods), and an enemy's Interrupt against the Strike (ctx.beforeStrike: a Defense bonus). Neither exists unless an enemy uses effects.
      const sm = !a.vs.startsWith("save") ? ctx.selfMods?.(pc, t) : null, pre = traits.includes("strike") && !a.vs.startsWith("save") ? ctx.beforeStrike?.(pc, t) : null;
      const mb = mm?.boons ?? 0, mn = (mm?.banes ?? 0) + (sm?.banes ?? 0);
      if (a.vs.startsWith("save")) {   // a Save Action: the target rolls against your DC (11 + Modifier); its Tier 1 is the worst for it
        const attr = a.vs.split(/\s+/)[1] ?? "instinct";
        tier = pick(R, C.tierProbs(t.save?.[attr] ?? 0, 11 + mod, 0, 0, ""));
      } else {
        // One random number for the roll with and without the target's Vulnerable: the difference is credited to whoever made it Vulnerable.
        const u = R(), def = (a.vs === "wd" ? t.wd : t.ad) + (pre?.def ?? 0), st = C.rollState(favored, !!mm?.doomed || !!sm?.doomed, "");   // the catch-up: High cover makes the roll Doomed (Favored and Doomed together: a normal roll)
        const pr = C.tierProbs(mod, def, boons + mb + (t.vulnerable ?? 0), banes + mn, st);
        tier = pickU(u, pr);
        if (t === target) critShare = pr[2] > 0 ? C.critProb(mod, def, boons + mb + (t.vulnerable ?? 0), banes + mn, st) / pr[2] : 0;   // the share of its Tier 3s that are Criticals (calc.mjs, exact)
        if (t.vulnerable && t.vulnBy?.st && a.tiers) {
          const without = pickU(u, C.tierProbs(mod, def, boons + mb, banes + mn, st)), av = k => avgDamage(a.tiers[k - 1], b.weapon, k, mod, emp, extra);
          t.vulnBy.st.vulnCredit += av(tier) - av(without);
        }
      }
      const dmg = a.tiers?.[tier - 1];
      const land = (v, mind) => { res.counted += Math.min(v, Math.max(0, (t.pool ?? Infinity) - (t.damage ?? 0))); t.damage = (t.damage ?? 0) + v;   // counted: the part an enemy's Health could still take (not what goes past its last point)
        t.mindDamage = (t.mindDamage ?? 0) + mind; res.mind += mind; };   // pack R prep: the Mind part is kept for Bloodied / Strained
      if (t === target && tier === 1) for (const x of floors) { const v = rollDamage(R, x, { mod }).total * b.dmgScale; land(v, v * mindShare(x, b.weapon, tier, mod)); res.damage += v; }   // a Tier 1 floor (Marked Quarry)
      if (t === target) for (const x of anyTier) { const v = rollDamage(R, x, { mod, empowered: emp }).total * b.dmgScale; land(v, v * mindShare(x, b.weapon, tier, mod)); res.damage += v; }   // on every Tier, whatever the Action deals
      if (dmg && (dmg.dice.length || dmg.flat || dmg.mod || (dmg.w && hasDamage(weaponTier(b.weapon, tier))))) {   // 1[W] of a weapon that deals 0 on this tier is no damage (and no extra)
        const kb = b.keepBest && b.keepBest.traits.every(x => traits.includes(x)) ? b.keepBest.n : 0;
        let total = rollDamage(R, dmg, { weapon: b.weapon, tier, mod, empowered: emp - (sm?.enf ?? 0), keepBest: kb }).total, mindT = total * mindShare(dmg, b.weapon, tier, mod);
        for (const x of extra) { const v = rollDamage(R, x, { mod, empowered: emp }).total; total += v; mindT += v * mindShare(x, b.weapon, tier, mod); }
        total = (total + bonus) * b.dmgScale; mindT *= b.dmgScale;
        land(total, mindT); res.damage += total;
        if (total > 0) ctx.onDamage?.(pc, t, total);   // pack R-classes: Reactions to an ally's damage (Call the Shot)
        if (t === target) for (const nm of firstHit) pc.firstThisRound.add(nm);
        if (t.surge && t.surge.by !== pc) {   // Divine Surge: an ally's extra damage, credited to the Paladin who gave it (not in anyone's own damage)
          const x = rollDamage(R, t.surge.dmg, { mod }).total; land(x, x * mindShare(t.surge.dmg, b.weapon, tier, mod)); if (t.surge.by.st) t.surge.by.st.surgeCredit += x; t.surge = null;
        }
      }
      ctx.log?.("action", { action: a.name, ap: a.ap, linked, target: t, tier, damage: (t.damage ?? 0) - dmg0, save: a.vs.startsWith("save") ? (a.vs.split(/\s+/)[1] ?? "instinct") : false });   // the log (SIM-1): nothing reads it back
      if (traits.includes("strike") && !a.vs.startsWith("save")) ctx.afterStrike?.(pc, t, tier);   // an enemy's Trigger on the Strike (the Bestiary's turn budget)
      if (t === target) { mainTier = tier; res.critShare = critShare; if (RULES.escHooks && tier === 3 && !a.vs.startsWith("save") && R() < critShare) res.crit = true; }   // a Critical: Doubles on a Tier 3, 20 over the Defense, three of a kind on a Favored roll (before the catch-up: 1 Tier 3 in 12)
    }
    res.lastTier = mainTier;
    if (reloadShot) pc.unloaded = true;
    for (const e of a.effects) if (mainTier >= e.min && mainTier <= e.max) apply(e.effect, target, a);
    for (const t of a.then) doAction(b.actions[t.toLowerCase()], {}, [], true, target);
  };
  for (const s of turn.steps) {
    const step = stepOf(s);
    if (step.kind === "move") {
      if (ctx.apLimit != null && res.ap + step.ap > ctx.apLimit) { res.missed.push(`${s}: no AP left`); continue; }
      if (ctx.move?.(pc, step) !== false) res.ap += step.ap;   // the map model: a move it doesn't need is not made (the AP stay for Reactions)
      continue;
    }
    let a = b.actions[step.name];
    if (step.alt && a.escalation > pc.esc && !(b.overcastFloor && !pc.floorUsed)) a = b.actions[step.alt];   // "(else Weapon Attack)": when the Escalation isn't there
    if (ctx.apLimit != null && res.ap + a.ap > ctx.apLimit) {   // the map model: AP spent moving; a lower Version that fits, else a Weapon Attack, else nothing
      const alt = Object.values(b.actions).filter(x => group(x.name) === group(a.name) && x.ap < a.ap && res.ap + x.ap <= ctx.apLimit).sort((x, y) => y.ap - x.ap)[0]
        ?? (a.traits.includes("strike") && b.actions["weapon attack"] && res.ap + 1 <= ctx.apLimit && res.strikes < RR.STRIKES_PER_TURN ? b.actions["weapon attack"] : null);
      res.lostAP += a.ap - (alt?.ap ?? 0);
      if (!alt) { res.missed.push(`${a.name}: no AP left after moving`); continue; }
      a = alt;
    }
    // Overcast (pack LV): the round-1 floor pays up to its number once a fight; else a lower Version of the same Action that the Escalation left pays for.
    let floor = 0;
    if (a.escalation > pc.esc) {
      const fl = b.overcastFloor && !pc.floorUsed ? b.overcastFloor : 0;
      const low = Object.values(b.actions).filter(x => group(x.name) === group(a.name) && x.escalation <= pc.esc + fl && x.ap <= a.ap).sort((x, y) => y.escalation - x.escalation)[0];
      if (low) { a = low; if (a.escalation > pc.esc) { floor = a.escalation - pc.esc; pc.floorUsed = true; } }
    }
    const g = group(a.name);
    if (a.escalation - floor > pc.esc) { res.missed.push(`${a.name}: costs ${a.escalation} Escalation (you have ${pc.esc})`); continue; }   // not a rule problem: the plan tries it when it can
    if (RULES.escalation === "spent" && step.keep && pc.esc - a.escalation < step.keep) { res.missed.push(`${a.name}: kept ${step.keep} Escalation for a passive`); continue; }   // "(keep 2)": spend only what is above 2
    if (a.freq === "daily" && pc.dailyOK === false) { res.missed.push(`${a.name}: the Daily is kept for a hard fight`); continue; }
    if ((a.freq === "encounter" || a.freq === "daily") && pc.spent?.has(g)) { res.problems.push(`${a.name}: already used this ${a.freq === "encounter" ? "encounter" : "day"}`); continue; }
    if (a.freq === "round" || a.freq === "turn") { if (st.used.has(g)) res.problems.push(`${a.name}: once a ${a.freq}`); st.used.add(g); }
    if (a.freq === "encounter" || a.freq === "daily") { (pc.spent ??= new Set()).add(g); res.nova = true; }
    res.ap += a.ap;
    if (a.traits.includes("strike")) res.strikes++;
    if (RULES.escalation === "spent") pc.esc -= a.escalation - floor;   // pack R: as a level, an Active needs its Escalation and spends nothing
    doAction(a, step);
  }
  if (res.ap > RULES.ap) res.problems.push(`${res.ap} AP (${RULES.ap} a turn)`);
  if (res.strikes > RR.STRIKES_PER_TURN) res.problems.push(`${res.strikes} Strikes (${RR.STRIKES_PER_TURN} a turn)`);
  return res;
}

/** Expected damage of a turn against one creature with this Defense (AD and WD the same): Monte Carlo, n runs. A turn that starts with a Reload starts unloaded. */
export function turnDamage(build, turnName, defense, { n = 20000, seed = 7, escalation = 3, bloodied = false, strained = false } = {}) {   // bloodied (pack R-classes): the target counts as Bloodied (Reckoning)
  const R = rng(seed), turn = build.turns[turnName], first = build.actions[stepOf(turn.steps[0]).name];
  const startsUnloaded = !!first?.effects.some(e => e.effect.kind === "reload");
  let sum = 0, last = null;
  for (let k = 0; k < n; k++) {
    const target = { ad: defense, wd: defense, save: { body: 2, mind: 1, instinct: 1, appeal: 1 }, bloodiedRound: bloodied ? 1 : null, strainedRound: strained ? 1 : null }, pc = { build, quarry: target, unloaded: startsUnloaded, esc: escalation };
    last = runTurn(pc, turn, { R, escalation, target: () => target, others: () => [] });
    sum += last.damage;
  }
  return { avg: sum / n, problems: last.problems, ap: last.ap, strikes: last.strikes };
}

/** The turn a PC takes: its "when unloaded" turn, its "when ally below" turn, else the plan's turn for the round (the last one repeats). */
export function turnFor(pc, round, allies = [], engagedNow = false) {
  const b = pc.build;
  if (pc.unloaded && b.unloadedTurn) return b.unloadedTurn;
  if (b.whenEsc && (pc.esc ?? 0) >= b.whenEsc.esc) { const t = b.turns[b.whenEsc.turn]; if (t.steps.map(stepOf).filter(x => x.kind === "action").every(x => { const a = b.actions[x.name], g = group(a.name); return !(a.freq === "encounter" || a.freq === "daily") || !pc.spent?.has(g); })) return b.whenEsc.turn; }   // pack R-classes: the Apex turn comes first (before the Engaged and ready turns)
  if (engagedNow && b.whenEngaged) return b.whenEngaged;   // the map model: it starts its turn next to an enemy
  if (b.whenReady && pc.readyAP) return b.whenReady;   // pack R-classes: the AP a "ready" Reaction gave it
  if (b.whenSelf && pc.rallyLeft > 0 && (pc.damage ?? 0) >= (1 - b.whenSelf.below) * b.pool) return b.whenSelf.turn;
  for (const w of b.when) if (allies.some(x => x !== pc && !x.down && x.damage >= (1 - w.below) * x.build.pool)) return w.turn;
  const entry = b.plan[Math.min(round - 1, b.plan.length - 1)];
  if (!entry) return Object.keys(b.turns)[0];
  const opts = entry.split("|").map(x => x.trim());   // "A | B": the first whose Encounter and Daily Actions are still unused (a Daily only where it may be used)
  const ready = k => b.turns[k].steps.map(stepOf).filter(x => x.kind === "action").every(x => { const a = b.actions[x.name], g = group(a.name);
    return !(a.freq === "encounter" || a.freq === "daily") || (!pc.spent?.has(g) && !(a.freq === "daily" && pc.dailyOK === false)); });
  return opts.find(ready) ?? opts.at(-1);
}

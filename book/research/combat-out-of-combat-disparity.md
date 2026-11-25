# Combat and out-of-combat disparity: why players push back, and how games handle the seam

**Date:** 2026-11-24. **Asked by Lucas:** *"Out of combat and combat disparity; My system relies on separating both to make it flow well, though my fear is scrutiny of 'why can I do this in combat but not out of it?'"*

**What was read, and how far to trust it.**
- `[read]` Primary rules text opened directly: **Draw Steel** (MCDM printing 1.01b, Tactician *Focus* and *Focus Outside of Combat*), **Pathfinder 2e** (*Exploration Mode*, Archives of Nethys), **13th Age** (*Combat* and the Escalation Die, Roll20 SRD), and **Fabula Ultima** (Ritual rules and never-list, already `[read]` in `out-of-combat-magic.md`).
- `[checked]` Essays and reviews read on their pages: **The Alexandrian** (*Dissociated Mechanics – A Brief Primer*, plus its comment thread), **Cannibal Halfling Gaming** (*Fabula Ultima* review), and **Jama** (*BEACON* review).
- `[lead]` Search snippets and forums that block automated readers (Reddit `r/drawsteel`, `r/Pathfinder2e`, `r/RPGdesign`, `r/rpg`, `r/LancerRPG`; Draw Steel's other classes' *Outside of Combat* resource blocks and *"Bags of Rats Ain't Heroic"* via `steelcompendium.io` search extracts; D&D 4e retrospective discussions). Verify quotes before citing publicly.

**Already in the project:** `out-of-combat-magic.md` (Fabula Ultima's never-list, eight shapes of out-of-combat magic), `helping.md` (Help Action design), `bypass-and-repeat.md` (cost-bypass outside a fight), `escalation-and-guard.md` (13th Age Escalation Die and temp HP).

**Other games' rules and opinions, never 2d12's. Nothing here is decided.**

---

## 1. The spectrum: how games handle the combat / out-of-combat boundary

Every tactical RPG sits somewhere on a three-band spectrum. **Neither end is free of scrutiny** — each side trades one kind of table friction for another.

| Band | Games | How the seam works | What it buys | What players scrutinize |
|---|---|---|---|---|
| **1. Unified rules** | D&D 5e `[memory]`, Pathfinder 2e `[read]` | One ruleset; out-of-combat spells/actions use the same stat blocks, scaled to minutes/exploration activities | High simulation feel; almost never asks *"why can't I do X out of combat?"* | Pre-buffing arms races, door-opening initiative wars, 6-second cantrip/action spam, slow GM adjudication at the seam |
| **2. Bridged / Soft-split** | **Draw Steel** `[read]`, **13th Age** `[read]` | Combat has its own tempo/resource engine (Heroic Resources, Escalation Die), **plus an explicit conversion or cooldown rule** for using combat abilities outside a fight | Fast tactical combat without pre-buffing, while letting cool class features still touch exploration/RP | Edge-case rules-lawyering ("can I punch my friend to enter combat?"), or abilities whose combat wording makes little sense outside rounds |
| **3. Hard-split / Two-mode** | D&D 4e `[lead]`, **Fabula Ultima** `[checked]`, **Lancer** `[lead]`, **ICON** `[lead]`, **BEACON** `[checked]` | Combat and non-combat are explicitly different subsystems with near-zero mechanical overlap | Tightest tactical balance; fastest narrative play; zero combat-math bleed from RP | *"Two games bolted together"*; jarring initiative switch; *"why does my sprint/push/ice wall vanish once initiative ends?"* |

---

## 2. Why "why can I do this in combat and not out of it?" actually happens

### 2.1 Associated vs. dissociated mechanics `[checked]`
Justin Alexander's framework (*Dissociated Mechanics – A Brief Primer*, The Alexandrian) explains the exact psychology behind player scrutiny:
- An **associated mechanic** is one where the player's decision directly equates to the character's decision in the game world. (*"My wizard throws a Fireball because the goblins are clustered"* — fantastical, yet 100% associated.)
- A **dissociated mechanic** requires the player to manipulate a rule that has no corresponding reality in the character's mind. (*"I can't use my martial Encounter power because I already used it in this fight"* or *"I can only do this once we roll initiative."*)
- **Realism ≠ association.** Players happily accept impossible magic if its limits make sense inside the fiction, and push back hard on realistic actions whose limits only exist on the character sheet.

Alexander also names **two classic traps** designers fall into when defending a dissociated split:
1. **"Explaining it all away" fallacy:** Telling players *"just narrate why it didn't work outside combat."* That fixes narration *after* the fact, not the jarring mismatch *when deciding what to do*.
2. **"Reassociating / Rule 0" fallacy:** Inventing a literal in-world physics rule to justify a gamist wall (e.g., *"a magical force only activates when enemies want to kill you"* or *"combat spells feed on cosmic tension"*). The moment a designer makes a meta-rule a literal in-world law, observant players poke at it: *"Can an antimagic field suppress it? What if a duel is nonlethal? What if I genuinely intend to stab this training dummy? What if the assassin doesn't know we see him yet?"* — spawning endless edge-case rulings.

**Alexander's three criteria for when a dissociated rule *is* well-accepted:**
1. It achieves a creative/gameplay agenda that an associated mechanic genuinely cannot (for instance, keeping combat brisk and pre-buff-free).
2. The player's meta-decision is kept clearly distinct from the character's in-world decision.
3. It does not make the player's relationship to the fictional world fundamentally different from their character's.

### 2.2 The four flashpoints where scrutiny actually spikes
Across Alexandrian commenters `[checked]`, 4e post-mortems `[lead]`, and Lancer/BEACON/Draw Steel discussions `[lead]`, players do **not** scrutinize every combat-only rule equally. Scrutiny concentrates sharply on four specific flashpoints:

1. **Mundane / physical actions vs. magic `[checked]` `[lead]`:** Commenters on The Alexandrian note that real humans have everyday intuition for physical acts (running, pushing, helping a friend, bracing a shield, shooting a bow). Restricting a *spell* to combat triggers mild curiosity; telling a swordsman *"you can't help your ally or use your lunge because we aren't in initiative"* triggers immediate disbelief.
2. **Tangible world effects trapped in combat `[lead]`:** The famous D&D 4e flashpoint was *"why can't my frost attack freeze water to plug a ship's hull leak?"* or *"why can't my ice wall hold a doorway shut for five minutes?"* When a combat ability visibly creates fire, ice, light, pits, pushed boulders, or summoned barriers, banning it from obvious environmental interaction feels artificial.
3. **Basic universal verbs working differently `[lead]`:** Players forgive class-specific combat finishers being combat-only far more easily than a **basic shared verb** (like *Help*, *Move*, *Interact*, *Ready*) working one way on a grid and another way off it.
4. **Arbitrary per-ability lockouts vs. shared effort/tempo `[checked]`:** A shared exertion or tempo state (*"you can only keep this pace in a brief sprint"* or *"you're out of Surge/stamina"*) reads much closer to associated fiction than *"you can do Attack A once per fight, and Attack B once per fight, and neither outside a fight."*

**What players almost *never* complain about losing outside combat:**
- Round-by-round tactical buffs/debuffs (Guard / temp HP, `+1 Boon until end of next turn`, Marks, Taunts, flanking, Reactions to an enemy's swing). Everyone intuitively gets that *"guarding against a sword swing"* or *"building combat momentum"* doesn't mean anything while walking down a hallway.

---

## 3. The hidden cost of the *opposite* choice (unifying combat and out-of-combat)

To judge whether 2d12's split is worth defending, it helps to see what happens when a tight-math game **refuses** to split the modes.

### Pathfinder 2e's Exploration Mode `[read]` `[lead]`
PF2e explicitly lets combat actions and spells exist outside combat by converting them into Exploration Activities (roughly 10 actions/minute, or 1 action per 6-second round). Its rulebook even supplies a physiological rationale `[read]`:
> *"Characters can exert themselves to this extent [3 actions every 6 seconds] in combat only because combat lasts such a short time—such exertion isn't sustainable over the longer time frame of exploration."*

Yet PF2e's seam is one of its most frequently argued pain points `[lead, r/Pathfinder2e]`:
- **Pre-buffing arms races:** Players want to cast 1-minute or 10-minute combat spells at every dungeon door before opening it, distorting the tight encounter math unless the GM taxes them with noise, wandering monsters, or wasted slots.
- **The "Ready before the door" fight:** Because *Ready* is a combat action, players constantly ask *"I nock an arrow and Ready to shoot the first monster when the Fighter opens the door."* GMs are forced to say *"No, Readying is an Encounter action"* — which creates the exact *"why can't I hold my bow drawn at a door?!"* scrutiny anyway, just moved to a messier spot!
- **6-second cantrip spam:** *Repeat a Spell* lets casters spam *Shield* or *Guidance* every six seconds down a corridor, turning exploration into a checklist of starting-state optimizations before rolling initiative.
- **Premature initiative:** GMs routinely have to call *"roll initiative"* the moment anyone tries to buff, draw, or listen at a door, slowing exploration to a crawl.

**Takeaway:** Unifying combat and out-of-combat does **not** eliminate player scrutiny. It converts *"why can't I use my combat ability here?"* into *"why can't I pre-buff / Ready / stack actions before we kick the door in?"* — and dumps the policing onto the GM.

---

## 4. Five ways published games defuse or bridge the disparity

### Pattern A: The Explicit "Outside of Combat" Bridge Rule — **Draw Steel** `[read]`
Draw Steel faces the *exact* structural situation 2d12 has: every class runs on a Heroic Resource (Focus, Ferocity, Essence, Insight, Piety, Clarity, Wrath) that is **only generated in combat rounds**. Rather than banning combat abilities outside combat, Draw Steel prints an explicit bridge rule on every class `[read, Tactician Focus]`:
> *"Though you can't gain focus outside of combat, you can use your heroic abilities and effects that cost focus without spending it. Whenever you use an ability or effect outside of combat that costs focus, you can't use that same ability or effect outside of combat again until you earn 1 or more Victories or finish a respite."*

For variable-cost or persistent effects `[lead, steelcompendium.io]`:
- Variable-cost heroic abilities can spend up to the hero's current **Victories** (the exact counterpart to 2d12's Momentum).
- Elementalist persistent magic lasts a number of rounds equal to **Victories** outside combat.
- Talent (*Clarity*) allows repeated out-of-combat use if willing to wait 1 minute or take `1d6` strain damage.
- Draw Steel pairs this with an explicit anti-cheese rule — **"Bags of Rats Ain't Heroic"** `[lead]` — telling players plainly that picking fake fights doesn't trigger combat resources or Victories.

**Reception `[lead, r/drawsteel & reviews]`:** Widely praised for honesty and for letting characters actually *use* cool class powers in exploration without enabling rest-spam or pre-buffing. Remaining friction: some roleplay-heavy players still feel class toolkits are combat-narrow, and a few round-based abilities (like Troubadour performances) still create awkward edge cases.

### Pattern B: Honest Genre Framing Upfront — **Fabula Ultima** `[checked]` & **13th Age** `[read]`
- **Fabula Ultima** splits the game into **Conflict scenes** and **Narrative scenes** and pairs Combat Spells with separate Rituals `[read, out-of-combat-magic.md]`. Reviewers `[checked, Cannibal Halfling Gaming]` note players accept this cleanly because the book owns its premise ("Table Talk JRPG") from page 1: everyone intuitively accepts that *Final Fantasy*'s battle screen and overworld play by different rules.
- **13th Age** `[read]` puts its meta-mechanics front and center: the Escalation Die *"measures the tempo of combat as heroes grit their teeth,"* temporary HP evaporates at fight's end, Recoveries work differently in and out of combat, and a full heal-up happens every 4 battles rather than per night's sleep. Framing it as **game pacing / heroic tempo** rather than simulated physics dramatically lowers rules-lawyering — though hard simulationists still bounce off it `[lead]`.

### Pattern C: Physiological / Temporal Exertion Framing — **PF2e** `[read]`
When a designer *does* want an in-world explanation, **exertion / adrenaline / time-scale** holds up much better than invented metaphysical laws:
- Combat lasts 18–30 seconds of peak adrenaline; you can hold a defensive guard, chain explosive strikes, or surf combat adrenaline during a life-or-death clash, whereas outside combat you operate at sustainable pace.
- **Crucial caveat from The Alexandrian `[checked]`:** Keep this as a *brief genre/tone framing*, NOT a mechanical physics engine with loopholes. The moment the text says *"combat effects literally feed on an in-world energy called Escalation,"* players will ask whether they can bottle Escalation, sense Escalation, or trigger Escalation by sparring.

### Pattern D: Fiction-First Permission Without Combat Math — **BEACON** `[checked]`, **13th Age** `[read]`, **Fabula Ultima** `[read]`
Several split-mode games defuse *"why can't my frost mage freeze a lock?"* by drawing the wall at **numbers and combat-time buffs**, NOT at **fictional capability**:
- **BEACON** `[checked]` includes *"cutscene magic"* / narrative permissions: outside tactical combat, your combat toolkit still establishes *what your character is capable of in the fiction* (letting you attempt a Narrative Action or justify fictional positioning), just without invoking grid math, damage rolls, or turn durations.
- **Fabula Ultima** `[read]` lets Rituals replicate narrative effects (flight, teleportation, lighting a room, freezing water) while its never-list forbids HP/MP changes, damage, status effects, or combat bonuses.
- **13th Age** `[read]` lets casters convert a combat spell into a narrative ritual effect when the fiction calls for it.

### Pattern E: Category Hygiene — Keeping the Split Clean and Predictable `[checked]` `[lead]`
Critics of **Lancer** and **ICON** `[lead, r/RPGdesign, r/LancerRPG]` note that the hardest dissonance occurs when **the same character identity contradicts itself across modes** — e.g., a character who leaps across rooftops and teleports every turn in combat, yet has zero movement/traversal capability the moment initiative drops. Two fixes show up across discussions:
1. **Don't make a universal basic action behave contradictorily across modes** without a clear reason (or give the modes cleanly different verb names).
2. **Keep combat-only rules visibly tied to combat targets/threats** (enemies, attacks, turns, initiative) rather than arbitrary bans on actions that make plain sense in an empty room.

---

## 5. How it applies to 2d12 (observations)

Audit of 2d12's **six current separation points** (from `book/items-economy.md` Part 2, `book/magic-out-of-combat.md`, `book/decided.md`, and `book/roleplay-skills.md`) against the scrutiny patterns above.

### 5.1 Risk map of 2d12's current boundaries

| 2d12 boundary | Current draft rule | Scrutiny risk | Why (from the research) |
|---|---|---|---|
| **1. No pre-buffing / combat durations (EoT, rounds, EoE)** | Effects with turn/round/EoT/EoE durations don't work outside combat; long-duration effects never grant combat numbers | **Low** | Players rarely miss pre-buffing once stated clearly; PF2e shows how ugly the alternative is. **Caveat:** the wording *"combat effects feed on Escalation"* (`items-economy.md` Part 2) risks Alexandrian's *Reassociating Fallacy* if read as literal in-world physics rather than genre/pacing framing. |
| **2. Escalation & Surge split** | Escalation resets to 1 at EoE; outside combat, Surge is a pool equal to Momentum (0–4) refilled on Momentum gain | **Low–Medium** | Very close to Draw Steel's well-received Victory-gated bridge! Players understand *"you don't build battle tempo out of combat, you spend your stored Surge instead."* |
| **3. Battle Spells vs. Out-of-Combat Spells** | Instant battle spells *can* be cast outside for Surge; duration battle spells are combat-only; separate out-of-combat spells (10 min, open a way) | **Medium–High on tangible spells** | Instant battle spells already work (good!). The flashpoint is **duration battle spells that create tangible world things** (walls of ice/stone, clouds, summoned light/terrain, teleports, forced pushes). If a mage can summon an Ice Pillar in a 6-second fight, players *will* ask *"why can't I put an Ice Pillar across this doorway to bar it?"* |
| **4. Help Action asymmetry** | In combat: Help Basic Action gives `1 Support Boon` (no roll). Outside combat: **no Help Action** (best-suited rolls; others change task or make own Check) | **High** | Hits **two** top flashpoints at once: (a) mundane everyday physical action, and (b) same verb behaving oppositely across modes. Players who just helped an ally with a Boon in combat will immediately ask *"why can't I steady the rope or hold the lantern to help her climb now?"* (Note: `helping.md` already covers *why* free Help outside combat breaks skill checks — the risk here is specifically the *naming and symmetry* clash.) |
| **5. Skill Talents vs. Combat Talents (T2)** | Skill Talents give nothing usable during an encounter (may shape pre-fight); combat Talents may have uses outside a fight | **Low–Medium** | Actually *better* than Lancer/ICON's hard wall because combat Talents are explicitly allowed to touch out-of-combat play. Scrutiny only appears if a combat Talent gives a cool physical feat (e.g., giant leap, smashing stone, keen tracking) that gets locked behind *"in an encounter."* |
| **6. Round/Encounter Actions outside combat & Bag of Rats** | Round Actions (e.g. Lay On Hands) work outside (costing Rally Points); Encounter Actions stay spent through next fight; GM defines real encounters | **Low** | Clean, associated, and directly mirrors Draw Steel's *"Bags of Rats Ain't Heroic."* Allowing Lay On Hands outside combat removes the single most common *"punch my friend to heal"* exploit seen in Draw Steel `[lead]`. |

### 5.2 Concrete design options (for Lucas to weigh — none decided)

1. **Reframe the "why" from physics to honest design contract (Alexandrian + 13th Age + Draw Steel):**
   - Instead of claiming Escalation is a literal metaphysical fuel that shuts off spells outside combat, state the design intent plainly in a 3-line sidebar (like Draw Steel / Fabula Ultima): *Encounter rules model split-second life-or-death chaos; outside an encounter, time and pressure work differently, so round-by-round buffs, Guards, and Escalation don't apply — and pre-buffing doesn't exist.* Players respect honest genre rules far more than fragile in-world excuses.
2. **Close the "Ice Pillar / tangible combat ability" flashpoint with a Fiction-Permission line (BEACON + Draw Steel + Fabula Ultima):**
   - Keep the hard ban on *combat numbers, Guard, conditions, and pre-buffing* outside combat, while explicitly clarifying: **if you know a combat spell or martial ability that does something physically obvious (freeze water, smash a wall, leap a chasm, create light), it gives you fictional permission to attempt it outside combat** — resolved via the out-of-combat rules (a Check, or spending Surge via the paired out-of-combat spell), never by tracking rounds or granting combat bonuses.
   - Alternative (Draw Steel's exact rule): allow non-buff combat abilities outside combat once until the next Momentum gain / Rest, strictly with narrative duration (a moment / a scene) and zero carryover into the next fight.
3. **Defuse the Help Action asymmetry without re-enabling free "+1 Boon" dogpiling:**
   - The clash happens because both concepts share the word *"Help."* Two clean ways to dissolve the friction:
     - **Rename the combat Basic Action** to something unmistakably tactical (*Assist*, *Distract*, *Set Up*, *Opening*, *Feint for an Ally*) — setting up an opening in a chaotic fight is visibly different from two people picking one lock.
     - Or explicitly frame the out-of-combat rule as **"Cooperating changes the fiction (circumstance / tools / separate angle), not the die math"** — so players *can* help, just by changing the situation (holding the lantern removes darkness; tying a rope lowers the consequence) rather than pressing a "+1 Boon" button.
4. **Audit combat-worded abilities for accidental "in an encounter" phrasing:**
   - Keep *"during the encounter / EoT / EoE"* strictly on things that are genuinely battle-tempo (Guard, Marks, Taunts, Escalation triggers, combat-math buffs). Avoid stamping *"in an encounter"* onto physical traversal, sensory, or world-altering abilities unless there is a clear reason.

---

## 6. Sources

- `[checked]` The Alexandrian (Justin Alexander), *Dissociated Mechanics – A Brief Primer* (2012-05-31): https://thealexandrian.net/wordpress/17231/roleplaying-games/dissociated-mechanics-a-brief-primer
- `[read]` Draw Steel (MCDM, printing 1.01b), *Tactician — Focus / Focus Outside of Combat*: https://steelcompendium.io/v2/Browse/feature/tactician/level-1/focus/
- `[lead]` Draw Steel (MCDM), other classes' Heroic Resource Outside of Combat rules and *Bags of Rats Ain't Heroic*: https://steelcompendium.io/compendium/main/Rules/Chapters/The%20Basics/ (search snippet)
- `[read]` Pathfinder 2e (Archives of Nethys), *Exploration Mode*: https://2e.aonprd.com/Rules.aspx?ID=521
- `[read]` 13th Age SRD (Roll20), *Combat* (Escalation Die, Recoveries, Temporary Hit Points): https://roll20.net/compendium/13thage/Combat
- `[checked]` Cannibal Halfling Gaming, *Fabula Ultima Review: A Golden Table Talk JRPG* (2023-08-17): https://cannibalhalflinggaming.com/2023/08/17/fabula-ultima-review-a-golden-table-talk-jrpg/
- `[checked]` Jama, *BEACON Review*: https://jama.neocities.org/beacon-review/
- `[checked]` TTRPG Games, *BEACON* overview: https://www.ttrpg-games.com/item/beacon
- `[lead]` Community reception threads (search summaries only; Reddit blocks automated readers): `r/drawsteel`, `r/Pathfinder2e` (Exploration→Encounter pre-buffing and Ready), `r/RPGdesign`, `r/rpg`, `r/LancerRPG` (hard-split mode dissonance; D&D 4e encounter-power scrutiny).

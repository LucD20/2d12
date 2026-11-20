# Talents for the playtest PCs (the restart, T15 and T16)

> **Status (2026-11-20): CURRENT: the four playtest Talents (Take Aim, Cold Domain, Shared Burden, Ricochet), audited and revised; next, the Foundry pack.**

**2026-11-20.** One Talent for each playtest PC (`talents-design.md` section 9, T16), made one at a time with Lucas, priced on its PC's build. Numbering: Talent.Branch.Rank. **Drafts: nothing here is in the book.**

| # | Talent | For | State |
|---|---|---|---|
| 1 | Take Aim | Sylwen (Elf Archer, Quick Shots, Hunting Bow) | revised after the audit: 0 AP, 1 Boon; about +7 a turn (section 6) |
| 2 | Cold Domain (the god's blessing on the weapon; placeholder name) | Aveline (Human Paladin, Smite, Longsword) | revised after the audit: the Power dice at her real Modifiers; combat only (section 6) |
| 3 | Shared Burden (defending allies; placeholder name) | Durgan (Dwarf Paladin, Lay On Hands, Arming Sword) | revised after the audit: Bear the Blow 0R (section 6) |
| 4 | Ricochet | Kaela (Human Archer, Strafe, Recurve Bow) | revised after the audit: 2 squares (section 6) |

---

## 1. Take Aim (Sylwen)

**Lucas (2026-11-20):** "1 ap, you havent left your square; you gain 2 boons on ranged attacks until you leave your square (EoT)."

> **Take Aim** · Talent · Archery · Stage 0
> **Take Aim** · Round · 0 AP
> *You plant your feet, slow your breath, and let the world narrow to the arrowhead.*
> [Self]
> **Requirement:** You haven't left your square this turn.
> **Effect:** Until the end of your turn (EoT), your [Ranged, Strike] Actions gain 1 Boon and take no Bane for the far range (Chapter 15). This ends when you leave your square.

**The price (Sylwen at level 4; Weapon Modifier +2 assumed; Defense 13; 400,000 rolls each):**

| | Tier 1 | Tier 2 | Tier 3 | Critical | Hunting Bow Weapon Attack, average damage |
|---|---:|---:|---:|---:|---:|
| No Boon | 27.9% | 45.4% | 26.7% | 4.5% | 4.59 |
| 2 Boons | 16.7% | 46.4% | 36.9% | 6.4% | 5.37 (+17%) |

| Line | Points (a Weapon Attack = 25; `ruler/pc-budget.md`) | Tag |
|---|---:|---|
| Her full turn with it: Take Aim 1 + Quick Shots 2 (gains 1 AP) + Wounding Shot 1 + Weapon Attack 1 = 5 AP, 3 Strikes | | [judgment] |
| 2 Boons on Quick Shots (about 50 points of damage) | +9 | [judgment, from the odds] |
| 2 Boons on Wounding Shot and on a Weapon Attack | +8 | [judgment, from the odds] |
| Tier 3 riders land more often (Wounding Shot's Lingering 2, Trick Shots' Pushed 2, One More Arrow) | + a few | [not priced] |
| **Gross, a turn** | **about +18** | |
| What the AP would have been: 2 Guard (an unspent AP) | −12 | [SIM: pc-budget section 5] |
| Quick Shots' Evade 2 given up (moving 0 squares keeps Take Aim) | − a little | [not priced] |
| **Net, a turn** | **about +6, every turn** | |

**Analysis**
- **1 Boon would be too weak:** about +9 gross for the 12 of Guard, a loss; 2 Boons is the size that wins the trade, narrowly.
- **A real choice each turn:** accuracy or Guard, and Quick Shots' Evade (safety) or the Boons.
- **Sylwen's default turn from now on; a dead pick for Kaela** (she moves every turn, and Shifting Aim rewards it): a style split, not one best button for everyone.
- **The range of the first idea is left out** (simpler; the far range's Bane stays).
- **Rules:** 2 unnamed Boons are allowed (`cards/README.md`: an unnamed Boon is "1, rarely 2"); with Field and Support Boons she can reach 5 and be Favored. "Leave your square" includes being moved by someone else.

---

## 2. The god's blessing on the weapon (Aveline): "Cold domain" (a placeholder name)

**Lucas (2026-11-20):** "B is the good direction. Cold themed, so a 'Cold domain' (placeholder name). I think a plain attack is lame; lets do an attack (like with Mode, one for weapon another for power) with a special rule, something related to cold, ice, divine. Weapon deals [W], power always just dice, no flat. Same average (or at least very similar)."

**Lucas (2026-11-20), the special rule:** "I mean special effects outside of rules, similar to spells. Talents I feel can do similar to spells, and be more innovative, bend rules, be unique." Then, on the Ice Pillar: "Lasts a minute, it breaks if it takes 5 damage at once (chip damage doesnt break it). DC to hit it is Action DC. Deals damage, looks cool, has niche utility, I think it is in a good spot"; and on Claude's five points: EoE (introduced in the book the same day), one pillar at a time ("Yes, good"), Forced Movement breaks it too, an Area hits it and objects get Tier 1 on Saves (a rule for the objects pass, `rules-backlog.md`), and a creature or an object as the target ("Do it").

> **Cold Domain** · Talent · Faith · Stage 0 *(placeholder name)*
> **Rime Strike** · Round · 1 AP
> *Frost runs down the edge, and the cold bites before the steel does; where it lands, the ice rises.*
> [Divine, Melee, Split, Strike]
> **Target:** One creature or object
> **Ice Pillar:** A pillar of ice rises in a square adjacent to the target that holds no creature or object and that you have Line of Effect to (EoE). You have one Ice Pillar at a time: raising a new one melts the old one.
> - It fills its square as a wall does: it blocks movement and Line of Effect through its square, its corners are solid (Chapter 3, Corners), and it gives Cover as a wall does.
> - Its Defense is your Action DC for that Rime Strike (11 + the Modifier its mode used). Against a Save it gets Tier 1. An Area that covers its square hits it, whoever made the Area.
> - It breaks when one Action deals it 5 or more damage; less does nothing and doesn't add up. A creature that collides with it (Chapter 3, Collision) deals it the damage the creature takes.
>
> **Weapon mode** · **Distance:** Weapon
> **Attack:** Weapon vs. Armor Defense
> **Tier 1:** 0. **Tier 2:** [V] 1[W] + [Mod] Co; an Ice Pillar. **Tier 3:** [V] 1[W] + [Mod] Co; an Ice Pillar.
>
> **Power mode** · **Distance:** Reach
> **Attack:** Power vs. Ward Defense
> **Tier 1:** 0. **Tier 2:** [V] 2d6! Co; an Ice Pillar. **Tier 3:** [V] 2d8! + 1d4! Co; an Ice Pillar.

**The averages** (200,000 rolls each): the Longsword at Weapon Modifier +2 is 11.0 on Tier 2 and 15.0 on Tier 3; the Power Mode's 2d6! + 1d4! is 11.0 and 3d8! is 15.0. (The Arming Sword at +2 is 8.0 and 10.0: with a one-handed weapon the Power Mode is the bigger one.)

**The price (Aveline; the anchor is +6 a turn, T17):**

| Line | Points a turn | Tag |
|---|---:|---|
| Its damage equals a Weapon Attack's (it takes one's place in her turn) | 0 | [judgment, from the averages] |
| Two Modes: she strikes the lower of Armor and Ward Defense (2 lower is worth about 2 Boons: +17% damage on that hit) | +2 to +4 | [judgment, from the odds] |
| The Ice Pillar (72% of uses; one at a time, EoE): blocks a path, cuts Line of Effect, gives Cover | +4 to +8 | [judgment; depends on the map] |
| **Total** | **about +6 to +12** | at or above the anchor |

**Analysis**
- **At or a little above the anchor:** higher on narrow maps, lower on open ones. If it is strong at the table, the first cut is the Tier 2 Ice Pillar (Tier 3 only).
- **The [Divine] trait** gives a character who isn't a Paladin a [Divine] Action (`decided.md`'s open "way into [Divine]"). None of Aveline's cards key on [Divine] Actions; Hallowed Stance does (Durgan's), and T10 is to make it [Paladin, Divine], which a Talent's [Divine] won't reach.
- **[Split]** (Chapter 7): the book's own trait for a Weapon mode and a Power mode, used instead of Modes.
- **The pillar can give the target Cover against Sylwen and Kaela** (Clear Lines removes allies' Cover, not an object's): an unpriced cost.
- **Near, not the same:** Smite (an Encounter nova of Holy dice), Binding Light (Holy and Immobilized), Consecrated Ground and Covering Fire (terrain, never solid).
- **The boss rule holds:** the pillar never stops a creature; a boss walks around it or breaks it with one blow of 5.
- **New rules it needed:** EoE (in the book), and two object rules it writes for itself until the objects pass (Tier 1 on a Save, Collision damage to an object).

---

## 3. Shared Burden (Durgan): defending allies

**Lucas (2026-11-20):** chose the shared burden (5e's Warding Bond, Lancer's Bonded; `research/frontline-protection.md`) among ten families, then wrote it: "0AP - Round [focus] Designate an ally you can Sense, it is your Bound Ally (EoE). You gain the following Action: 1R - Turn - Requirements: Your Bound Ally is adjacent to you; Interrupt: The Bound Ally would take damage; You take half the damage and the Bound Ally take the other half the damage." With two notes: halving halves each subtype on its own (now Chapter 1), and a creature with a big Resistance could abuse it. "Yes to all" on Claude's five points: the Reaction has no [Divine] trait; the rounding; the order; Resistance and Immunity don't reduce Durgan's half; one Bound Ally at a time, and every source of damage counts.

> **Shared Burden** · Talent · Guardian · Stage 0 *(placeholder name)*
> **Oath of Burden** · Round · 0 AP
> *You set your shoulder beside theirs: whatever comes for them comes through you.*
> [Focus]
> **Target:** One ally you perceive
> **Effect:** The target is your **Bound Ally** (EoE). If another creature was your Bound Ally, it no longer is. While you have a Bound Ally, you have the Reaction **Bear the Blow**.
>
> **Bear the Blow** · Turn · 0R
> *You take the blow on the shoulder they would have taken it on.*
> **Requirement:** Your Bound Ally is adjacent to you.
> **Interrupt:** An Action would damage your Bound Ally.
> **Target:** Your Bound Ally.
> **Effect:** You gain 1 Guard. You take half of that damage (rounded up); your Bound Ally takes the rest (Chapter 1, Halving and splitting damage). The split is made before Guard: each of you then applies your own Weakness and Guard to your part; **your Resistance and Immunity don't reduce your part**, your Bound Ally's do reduce theirs.

**Notes**
- **An Action's damage only** (the listed moment, "would damage someone"): Lingering, a fall and a hazard have no triggering Action. **Shield of Faith and Bear the Blow can't both answer one Action** (Chapter 2: "You can react only once to the same Action"): Durgan chooses one.
- **Durgan's two Reaction AP:** Shield of Faith ([Divine, Focus]) is paid by Tireless Vigil's; Bear the Blow (no trait) by his own. Both can happen every round.
- **Why Resistance and Immunity don't count on his part** (Lucas's warning): armor will give Resistance by subtype (Chapter 15's plan: padded, mail, plate), so the bond would erase damage instead of moving it.

**The price (Durgan; the anchor is +6 a turn, T17):**

| Line | Points a turn | Tag |
|---|---:|---|
| Oath of Burden: 0 AP | 0 | |
| Bear the Blow's cost: his own Reaction AP, otherwise idle (Shield of Faith is paid by Tireless Vigil's) | about 0 | [judgment] |
| About half of a Standard's hit moved from the ally to Durgan (about 6 of 12, once a round; more with kept AP) | | [SIM: a Standard deals a Paladin 11.9 a turn, `stage0.md`] |
| Its worth: the party's total damage is the same; who goes Down changes (Durgan has more Health, Heavy armor, and Guard from Armor of Faith each time he uses Shield of Faith) | +4 to +8 | [judgment; the SIM can't price moving damage without new code] |
| **Total** | **about +4 to +8** | near the anchor |

**Analysis**
- **The trade it is about:** Durgan can't Lay On Hands himself (its target is "one willing ally"), so he becomes the one who falls. The Bound Ally must stand next to him: a melee ally (Aveline) or a back-liner he keeps beside him.
- **Visible protection** (the research's warning about invisible defense): every hit on the Bound Ally shows a number moving to Durgan.
- **Near, not the same:** Shield of Faith (reduces), Bulwark of Faith (Guard, then a Slide), Lay On Hands (the ally's Rally Points), Hold the Line's swap. None moves damage.

---

## 4. Ricochet (Kaela)

**Lucas (2026-11-20):** "D, but I think 1 tier lower might be too weak? Maybe half damage? Or we do a fixed damage?" Then, on the computed options: half damage, 3 squares ("Yes").

> **Ricochet** · Talent · Archery · Stage 0
> **Ricochet** · Round · 1 AP
> *You dart wide for the angle, and the arrow skips off one shield into the throat behind it.*
> [Projectile, Ranged, Strike, Weapon]
> **Distance:** Weapon · **Target:** One creature
> **Setup:** You must Advance 2. This Advance doesn't count as leaving your square for other cards.
> **Ricochet:** The arrow can bounce to a second creature within 2 squares of the target that the target has Line of Effect to (you don't need Line of Effect to it). It takes half of the damage dealt to the target, before the target's Resistance, Weakness, Immunity and Guard (Chapter 1, Halving and splitting damage), then applies its own; none of the riders. No roll is made against it, and it isn't hit on a Tier: another card's Tier effects (Opening Shot, One More Arrow) don't apply to it.
> **Attack:** Weapon vs. Armor Defense
> **Tier 1:** 0. **Tier 2:** [V] 1[W] + [Mod]; a ricochet. **Tier 3:** [V] 1[W] + [Mod]; a ricochet.

**The price (Kaela, Recurve Bow, Weapon Modifier +2, Defense 13; 300,000 rolls each):**

| The second creature takes | Average | Points a use (a Weapon Attack = 25) | With a second creature in range about 70% of the time |
|---|---:|---:|---:|
| One Tier lower | 1.60 | +8.7 | about +6 |
| **Half the damage (the card)** | 2.45 | +13.3 | **about +9** |
| The Modifier on Tier 2 or 3 | 1.44 | +7.8 | about +5.5 |

The 70% is [judgment]. **About +9 a turn: a little above the anchor (+6).** The first cut if it plays strong: 2 squares instead of 3.

**Analysis**
- **Half damage over one Tier lower** (Lucas's call, and the odds): one Tier lower does nothing on a Tier 2, the most common hit, so its worth sat on the Tier 3 (the rare-trigger lesson).
- **One roll for two creatures:** the second creature's Defense doesn't matter, and it isn't on a Tier.
- **Watch:** Kaela already deals the most damage at the table (14.5 a round in playtest 5).
- **Near, not the same:** Cleave (the Modifier to adjacent creatures, Chapter 1), One More Arrow (1[W] more to each creature on a Tier: it reaches the second creature only through the half of the target's damage), Volley and Covering Fire (areas).
- **A later branch:** the bank shot (off a wall, at a creature you have no Line of Effect to), once a rule for bouncing off walls is written.

---

## 5. The audit of the four (2026-11-20, an independent reader; Opus)

**Fixed (wording and structure; no decision changed):** every bar reads Frequency · Cost, the traits on their own line, the label "Requirement"; Rime Strike uses the book's [Split] trait and its Ice Pillar sits above the modes; "a square that holds no creature or object"; the pillar blocks Line of Effect through its square; an Area that covers it hits it, whoever made it; Bear the Blow's moment is "An Action would damage your Bound Ally" (Lingering, falls and hazards have no triggering Action); the split comes before Guard; "perceive" for "sense"; Shield of Faith and Bear the Blow can't both answer one Action (Chapter 2); the ricochet is optional, needs no Line of Effect from Kaela, takes half of the damage dealt before the target's Resistance, Weakness, Immunity and Guard, and isn't on a Tier; the Hallowed Stance note corrected (Aveline doesn't have it).

**For Lucas (the prices were wrong):**
1. **Take Aim and the anchor (T17):** Quick Shots gives 1 AP only on a **Critical**, so Sylwen's turn has no spare AP: Take Aim pushes out a Strike. At her real Weapon Modifier (+3 at level 4): her plain turn (Quick Shots, Wounding Shot, a Weapon Attack) deals about 23.0; with Take Aim (2 Boons on Quick Shots and one shot) about 19.6: **about −15 points a turn**, never worth it. The +6 anchor was read from that wrong turn. As a 0 AP Action: 1 Boon on her three shots is about **+7**, 2 Boons about **+13**.
2. **Rime Strike at Aveline's real Modifiers** (Weapon +1, Power +3 at level 4): the Weapon mode averages 7.5 a use, the Power mode 9.9 (+32%): she would always use Power. Power dice of **2d6! on Tier 2 and 2d8! + 1d4! on Tier 3** give 7.9, within 5% of the Weapon mode.
3. **Shared Burden is below the anchor:** Tireless Vigil works only from Escalation 4, so before that Bear the Blow takes Shield of Faith's Reaction AP; one Action's hit is about 4 to 13 (a Standard's 11.9 is a whole turn), so it moves 2 to 4 a use. **About 0 early in a fight, +2 to +4 late.**
4. **Ricochet** (about +9 for no condition) is the better pick for Sylwen too (T6: the obvious pick for every bow user).
5. **Ice Pillar outside a fight:** "about a minute" can be repeated without limit (strike the door again each minute).

---

## 6. Lucas's answers to the audit (2026-11-20), applied to the cards above

"1. A. ... 2. Ok. 3. Ok. 4. Ok. 5. You cant use Actions out of combat right? Isnt that in the rules?"

| # | Card | Now | Price (real level 4 Modifiers: Sylwen Weapon +3, Aveline Weapon +1 / Power +3) |
|---|---|---|---|
| 1 | Take Aim | **0 AP, 1 Boon** on her [Ranged, Strike] Actions (EoT), if she hasn't left her square | Her plain turn (Quick Shots, Wounding Shot, a Weapon Attack) deals about 23.0; with 1 Boon about 24.7: **about +7 a turn** (about 7% of a plain turn; over the SIM's normal fight of 3.5 rounds about +25 points, one Weapon Attack a fight) |
| 2 | Rime Strike | **Power mode: 2d6! Co on Tier 2, 2d8! + 1d4! Co on Tier 3** | Weapon mode (+1, the Longsword) 7.5 a use; Power mode (+3) 7.9: within 5% |
| 3 | Bear the Blow | **0R** (still Turn) | Its cost is now only not using Shield of Faith on that same Action: **about +3 to +6** [judgment] |
| 4 | Ricochet | **2 squares** | **about +7** [judgment: fewer second creatures in range] |
| 5 | Ice Pillar | **combat only** | Lucas's own rule (`items-economy.md` Part 2, item 5, 2026-11-06; not in rules-src yet): "Outside an encounter, effects with a duration in turns or rounds (EoT included), or that last until the end of the encounter, don't work." |

**The anchor (T17) stays +6, a placeholder;** its reading now comes from Take Aim as revised (about +7), not from the 5 AP turn.

**Lucas on the feel check (2026-11-20): B "Ok", C "Ok"** (applied above: Take Aim also lifts the far range's Bane; Rime Strike's Weapon mode deals Cold), **D "Good"** (held: its price, below), **A** answered with his own shape (below).

**Then (2026-11-20): "D2. A - Remove the boon from ricochet. Keep the setup. Rule: Yes."** Applied: Bear the Blow gives Durgan 1 Guard before his part (about +5 to +8 a turn); Ricochet's Setup is "You must Advance 2", and that Advance doesn't count as leaving your square, so Shifting Aim gives the shot no Field Boon for it (about +10 to +12 a turn: the bounce, about +7, and 2 free squares, about +3 to +5; above the anchor and near Strafe, accepted by Lucas); the rule for a movement you must make is in Chapter 3.


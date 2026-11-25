# Escalation's direction: Actions unlocked by Escalation, measured against the alternatives

**Date:** 2026-11-25. **Asked by Lucas:** a research pass before batch 5's first decision. Is the direction he decided on 2026-11-22 right for 2d12? The direction: the Escalation Passives go, and Escalation unlocks Actions (level 1 an Escalation 2 Action, level 2 an Escalation 4 Action with the Encounter Pick merged into it, level 3 nothing, level 4 the Apex at Escalation 6); a gated Action works at full power once it is unlocked; the die dE (Escalation × 2, d4 to d12) goes on Round Actions; casters spend Surge. Claude's open proposal for decision 1 is measured here too: the six Encounter Picks become the Escalation 4 Actions, every Escalation Passive leaves the classes as a Talent idea, each class gets two new Escalation 2 Actions, Reckoning is a candidate for the Paladin's Apex, and Bulwark of Faith is accepted at Escalation 4.

**What was read, and how far to trust it.**
- **Already in the project, read first** (their marks stand): `escalation-and-guard.md` (13th Age, and the 2026-11-22 section: Draw Steel's Growing Ferocity, Sentinel Comics' GYRO, the time value of damage, the "fight ended before I charged up" complaint), `nova-burst.md` (the Censor's slow round 1, finishers, hoarding, Heinsoo's 1 : 1.5 : 2), `tactical-combat.md` (always-on bonuses are invisible), `talents.md` (memory is the budget), `resources-and-recovery.md` (Victories = Momentum), `progression-feel.md`, `famous-picks.md`.
- **New today, opened:** Rob Heinsoo, "Secret Origins of the Escalation Die" (Pelgrane, 2015) [checked]; Sly Flourish, "Transporting 13th Age's Escalation Die" [checked]. **Search summaries only** [lead]: EN World posts on Daggerheart's Hope being hoarded; EN World posts on 4e's big opening rounds and encounter powers that miss. **From memory, no page opened** [memory]: ICON's limit breaks paid with Resolve, Fabula Ultima's Zero Powers (a clock that fills), Lancer's Core Power (once a mission, ungated). A search for ICON's Resolve rule found only a fan tool; treat the ICON line as unverified.
- **Measured today** [mine]: the frozen SIM (`book/ruler/sim/stage0lib.mjs`, the old R builds on the Stage 0 lists, 600 fights a cell). Its normal fight is about 3.0 rounds, shorter than the book's 3.4 to 3.5 and playtest 7's 3.8, so **its numbers are the low end**: in longer fights every gate fires more often. The script is not kept; the method is: `fights()` with `L.build(file, level)`, then each PC's `st.escHist` (turns taken at each Escalation) and each fight's `firstDown` (the round of the first PC Down).

**Other games' opinions and Claude's arithmetic, never 2d12's rules. Nothing here is decided.**

---

## 1. What the ladder actually reaches (the SIM, today's ladder: start 1 + Momentum, +1 a round, +1 once for a Critical, +1 once for the hook at level 2)

**A PC gets at least one turn at the gate** (share of PCs over 600 fights):

| Build, Momentum, fight | Escalation 2+ | Escalation 4+ | Escalation 6 | Mean rounds |
|---|---:|---:|---:|---:|
| Level 1, Momentum 0, normal | 98% | 11% | 0% | 2.9 |
| Level 1, Momentum 0, hard | 96% | 33% | 1% | 3.5 |
| Level 2, Momentum 0, normal | 99% | **41%** | 1% | 3.1 |
| Level 2, Momentum 0, hard | 97% | 68% | 6% | 3.6 |
| Level 2, Momentum 0, Elite + 2 | 98% | 49% | 2% | 3.2 |
| Level 2, Momentum 1, normal | 100% | 75% | 8% | 3.0 |
| Level 2, Momentum 1, hard | 100% | 91% | 23% | 3.5 |
| Level 2, Momentum 2, normal | 100% | 99% | 33% | 2.9 |
| Level 2, Momentum 2, hard | 100% | 97% | 60% | 3.4 |

(Level 1 has no hook, which is why its Escalation 4 share is so low. Level 2 is the level that gets the Escalation 4 Action.)

**Turns spent at each Escalation** (level 2, Momentum 0, normal): Escalation 1 38%, 2 21%, 3 23%, 4 13%, 5 4%, 6 0%. At Momentum 1: 0 / 40 / 22 / 24 / 12 / 3%.

**When the first PC goes Down** (share of all fights): level 2, Momentum 0, hard: round 1 7%, round 2 10%, round 3 2% (a Down in 19%). Level 1, Momentum 0, hard: 9%, 12%, 3%. **About nine first Downs in ten come in rounds 1 and 2**, when a Momentum 0 PC is at Escalation 1 to 3 (3 only if the hook or a Critical has already fired).

**Read plainly:**
- **Escalation 2 is a sure gate:** it fires in almost every fight, from round 2 at Momentum 0 and from round 1 at Momentum 1.
- **Escalation 4 is a coin flip in a first fight:** at Momentum 0, level 2, a normal fight gives a PC a turn at 4 in about two fights of five (more at the book's 3.5 rounds, perhaps half to two thirds); usually one turn, and usually the last round. It becomes reliable from Momentum 1 (75 to 91%).
- **Escalation 6 is a Momentum 2 event:** about 0 to 6% at Momentum 0, 8 to 23% at Momentum 1, 33 to 60% at Momentum 2. (Measured on level 2 builds; level 4 is not built. Fights are fitted to 3.5 rounds at every Stage, so the shape should hold.)
- **The protection gap:** a gate at 4 is closed during the rounds in which focus fire downs a PC.
- **A feedback loop:** everything that adds PC output in later rounds (dE, the gated Actions themselves) shortens fights, and shorter fights reach the gates less often. The Bestiary's refit (batch 7) sets the length again, but the gates' reach must be measured after it, not assumed.

## 2. Takeaways from other games

1. **Threshold Passives are forgotten at real tables, not only in solo play.** Draw Steel's Growing Ferocity tables: GMs tell beginners to "disregard the table for a while", and a VTT module exists only to highlight which rows are on (`escalation-and-guard.md`, 2026-11-22). Designers: "always-on bonuses are invisible", and "nothing slows a game down quite like players tracking a bunch of passive abilities" (`tactical-combat.md` 5, `resources-and-recovery.md`). 2d12's own evidence agrees: the SIM priced an Escalation 6 Passive at about 0, and playtest 7 forgot its unprompted options (Arts used 3 times in 20 PC turns).
2. **A gate that fires is a prompt; a gate that doesn't is a grievance.** Sentinel Comics' GYRO is praised as cinematic ("the biggest moves arrive near the climax") and blamed for "artificial throttling" and "you can't use the really strong moves until the fight is basically over". The builder/spender thread: "if the thing dies the round before you're charged up... that feels real bad". **The working rule across these sources: the gate must be low enough to fire in a normal fight (round 2 or 3), round 1 must still have strong tools, and there must be ways to speed it up** (`escalation-and-guard.md` takeaway 4).
3. **Time value: damage early is worth more than damage late.** "Turn one is the most important turn"; "doing the same action early in a fight is better than doing it later... fights tend not to last that long" (Aestus on the Censor). A late card has to be visibly stronger to pay for arriving late, and **the one kind of late card the essays defend is the finisher** ("it's much more exciting... to end with a bang"; 13th Age's smite that isn't spent when it drops a foe; the Censor's half-Health execute) (`nova-burst.md` 2, 5).
4. **A rising number on every roll speeds fights and is liked, when it belongs only to the PCs.** 13th Age's escalation die began as a "combat blind" that rises "like how the blind keeps increasing in poker"; its designers worried about tracking it until someone said "you could just use a die" [checked, Heinsoo]. "This is a simple way to keep battles moving fast" [checked, Sly Flourish]. The math assumes only PCs get it (Heinsoo). **Its cost is the reverse of 2d12's worry:** 13th Age's players wait to fire dailies until the die is up ("you can use your best attack on turn 1, but probably want to wait until the Escalation Die gets up", `nova-burst.md` 6): **a card that grows with the clock invites holding it.** Smite's cap at 4 dice is exactly that pull, made finite.
5. **A spendable resource gives the timing back to the player, and brings two old costs.** Draw Steel's Heroic Resources (gained each round, lost at the end) make round 1 thin ("+2 Wrath. Not enough to do anything powerful"); Victories carry a start between fights (2d12's Momentum already does this). Daggerheart's Hope: a GM finds his players "almost always flush with Hope" and can't tell whether they hoard it for a big fight [lead]. **The pool works when it is lost at the end of the fight** (no long hoarding) **and when the things to spend it on are few and visible.**
6. **Encounter powers without a gate front-load the fight.** 4e players "start out with big damage and that drops the longer combat goes"; when the encounter powers miss, "that's when the grinding starts" [lead]. The 4e essay asks for the reverse (nothing big on round 1) and admits "we are reducing character effectiveness... taking toys away" (`nova-burst.md` 2). **Ungated Encounter Picks are the 4e shape; gating them is the essay's shape; each has its known cost.**
7. **A gate you can cheat at a price is the commonest fix.** Draw Steel's Talent takes Strain to fire a big power early; Victories start you higher; 13th Age's GM bumps the die when the drama calls for it ("Escalate the Drama"); Fabula Ultima's Zero Powers fill a clock from events, not only time [memory]; ICON's limit breaks are paid with a resource that builds [memory]. 2d12 already has three accelerators (Momentum, the Critical, the class hook) and the GM's valve.
8. **Big once-a-fight abilities without a gate also exist and are liked**, Lancer's Core Power (once a mission, any time) [memory]: the restraint is the Frequency, not the clock. That is today's Encounter Pick.

## 3. The alternatives on 2d12's criteria

| | Threshold Passives (today; Growing Ferocity) | Cards that scale with Escalation (Smite; 13th Age's die; dE) | A spendable pool for everyone (Surge for martials; Heroic Resources; Hope) | Escalation-gated Actions (the direction; GYRO) | Ungated Encounter Picks (today's level 2; 4e; Lancer's Core) |
|---|---|---|---|---|---|
| A 3-round fight | Escalation 2 on from round 2; 4 in the last round at best; 6 never | Works every round, bigger later | Round 1 thin; spent rounds 2 and 3 | Escalation 2 Action from round 2; Escalation 4 in about half of first fights; the Apex rarely | Used round 1 or 2 |
| Turn-1 value | None (Momentum 0) | Small but real | Low (Draw Steel's complaint) | None for gated cards | Highest |
| "Fight ended before it unlocked" | Felt as nothing (silently) | Never | Rare (you spend what you have) | **Yes, at Escalation 4 in first fights and at 6** | Never |
| Hoarding | None | **Pull to wait for the cap** (13th Age; Smite's 4) | Mild, ends with the fight | None past the gate (full power at once) | Only "save it for the right target" (a real choice) |
| Buttons on the HUD | None (the problem: nothing to see) | None new | One number, every card a choice to spend | One per gate, dark until lit: **a lit button is a prompt** | One |
| Memory, solo vs a table | Worst (each roll, ×4 when solo) | Low with Foundry (the die read at the roll) | Medium (a number to watch and plan) | Low (read only when pressed; lights up) | Low |
| Fits Surge and the Apex | Neither | Surge's twin (both grow with Escalation) | **The same currency for casters and martials: Talents can key on one thing** | The Apex is this shape already; Surge stays the casters' gate | The Apex would be the only gated card |
| The horizontal rule | Fine | Fine by its letter: it grows in the fight, not by level, and on damage, not on the roll or a DC | Fine | Fine | Fine |
| The Bestiary (batch 7) | Little to measure | PC output rises each round: measure by round | Measure by round and by spending | The gated cards count only in the fights that reach them; measure by round | Front-loaded: enemies lose their turns early |
| Early focus fire | Nothing | Little | Thin in round 1 | **Gated protection is off when PCs go Down** | Protection is there in round 1 |

## 4. How it applies to 2d12 (Claude's reading; nothing decided)

- **The core of the direction stands on the evidence.** Takeaway 1 removes the Passives for reasons 2d12 measured itself; takeaway 2 says a gated Action that *lights up* is the one form of mid-fight growth that works as a prompt, which answers playtest 7's forgotten options better than any Passive could. The merge keeps the sheet's size: a level 2 PC trades an Encounter Pick and two Passives for two Actions.
- **Escalation 2 is the right gate for every PC's first gated card:** it fires in 96 to 100% of fights, round 1 keeps the Hallmarks, and the Momentum players get it on turn 1.
- **Escalation 4 is the weak rung.** At Momentum 0 it is open in about 40% (SIM) to perhaps two thirds (3.5-round fights) of level 2 fights, usually for one turn, usually the last. A merged Encounter Pick at 4 is worth roughly half its ungated self in a first fight (time value, takeaway 3), and this is where "fight ended before it unlocked" will be heard (takeaway 2). Three fixes from the sources: **a lower gate (Escalation 3: round 3 at Momentum 0, which nearly every fight reaches)**, a price to fire it early (takeaway 7; it would spend Surge, which every PC already has under decision 68), or put on the 4 rung only cards that are *meant* to be late (finishers, takeaway 3).
- **Protection must not be gated high.** Nine first Downs in ten come in rounds 1 and 2 (section 1). Bulwark of Faith at Escalation 4 is open for about the tenth that comes later; the core review's "focus fire downs a PC early" is exactly what it can't answer. Its shape (an Interrupt that turns a blow into Guard) belongs on the Escalation 2 rung or ungated, and **the 4 rung suits the offensive Picks** (Word of Radiance, Volley; a finisher against a Bloodied foe).
- **The Apex at Escalation 6 is a Momentum 2 event** (33 to 60% there, under 10% at Momentum 0). That fits "the boss or high-Momentum climax", but then the level 4 headline appears in a minority of fights: the Apex should not be counted in the PC side the Bestiary is fitted to, and Reckoning (a Push and Daunted, 0 AP) would be a modest Apex for so rare a moment (`tactical-combat.md` 5: a one-off moment "when it becomes 6" is worth more than an ongoing bonus).
- **dE keeps to the horizontal rule's letter** (it grows inside a fight, not with the level, and on damage, never on the roll or a DC: 13th Age's die on the attack roll would have collided with the Tiers). Its real costs are three: it is a number to read (Foundry must print it, as it does Smite's dice); on every Round Action it is a large raise (d4 to d8 is +2.5 to +4.5 a use, against a level 1 PC's 13 to 14 a turn: about a quarter more output in rounds 2 to 4); and it shortens fights, which closes the higher gates (section 1, the feedback loop). **As a named die on a few cards (Smite's way) it is the scaling alternative at its best; as a blanket rule on Round Actions it is a vertical raise that batch 7 must absorb.** It also keeps a mild pull to hold a Round card for a bigger die (takeaway 4), which "full power at once" removes only for the gated cards.
- **Surge for martials stays a tool, not the base.** Decision 68 already lets any card spend Surge. A spend-to-fire-early clause (takeaway 7) is the cheapest way to answer both the unlock complaint and the early Downs, and gives Talents one currency to key on across casters and martials, at the price of a choice every turn: one clause, on a few cards, not a second economy.
- **The Passives as Talent ideas carry their problem with them.** A Talent that is a threshold Passive is forgotten the same way (takeaway 1; `talents.md` 7): the Talent pass should rewrite each as a "when" trigger or an Action, not move it unchanged.
- **The Bestiary (batch 7) should be fitted on the PC side by round,** not as one average a turn: gated Actions, dE and Smite all put PC output into rounds 2 to 4, which changes how much of an enemy's damage lands before it dies.

## 5. Sources

**Opened today:**
- [Pelgrane: 13th Sage, Secret Origins of the Escalation Die (Rob Heinsoo, 2015)](https://pelgranepress.com/index.php/13th-sage-secret-origins-of-the-escalation-die)
- [Sly Flourish: Transporting 13th Age's Escalation Die](https://slyflourish.com/escalation.html)

**Search summaries only [lead]:**
- [EN World: Daggerheart General Thread (players flush with Hope)](https://www.enworld.org/goto/post?id=9855483) · [another post in the thread](https://www.enworld.org/goto/post?id=9706090)
- [Demiplane forums: a Hope cost can't be multiplied](https://forums.demiplane.com/t/some-abilities-that-should-stack-with-themselves-do-not-stack/4948)
- [EN World: Per-Encounter Powers (4e)](https://www.enworld.org/threads/per-encounter-powers.324622/) · [Grading encounter attack powers](https://www.enworld.org/threads/grading-encounter-attack-powers.234118/)
- [ICON rules summary (community)](https://lyssa-rpg-docs.neocities.org/icon/rules-summary): opened, but it says nothing on Resolve or limit breaks; the ICON line above is [memory]

**Earlier notes this one builds on (their sources there):** `escalation-and-guard.md` (Draw Steel's Growing Ferocity, Sentinel Comics' GYRO, the time value of damage, the builder/spender thread, 13th Age), `nova-burst.md` (the Censor, Heinsoo's damage math, the 4e pacing essay, hoarding), `tactical-combat.md`, `talents.md`, `resources-and-recovery.md`.

**Not found:** a survey of round-gated abilities (none exists, as the 2026-11-22 pass also found); ICON's own text on Resolve; a Fabula Ultima page on Zero Powers.

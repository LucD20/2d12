# Escalation-gated abilities, and Guard against healing

## 2026-11-14: for the Card Workbench analyses (Reckoning and Hallowed Stance at Escalation 6; Lay On Hands' and Shield of Faith's Guard)

### Escalation-gated abilities (13th Age's escalation die)

**The question:** how a game whose combat bonus grows each round (13th Age's escalation die, 0 to 6, +1 a round, the closest thing to our Escalation 1 to 6) gates class abilities on it, and at what value.

1. **The gate that matters is 3 or more.** Early rounds give little; around 3 the bonus becomes noticeable, and community advice is to tie the bigger, flashier class abilities to it ("highest spells or X/day abilities unavailable until it reaches 3"). The rules' own examples: a Barbarian starts raging freely at 3+ (an epic feat lowers it to 2+), a consumable adds bonus damage while it is 3+.
2. **The math assumes only the PCs get it** (Rob Heinsoo): it is a PC catch-up and a push to end fights. Monsters get their own triggers instead (an ability on an even value).
3. **The GM can push it** (Pelgrane's "Escalate the Drama"): bump it to 3 when reinforcements arrive.
   - *For 2d12:* our 1 to 6 starts at 1 and gains 1 a round, so their 3+ is roughly our 4+. **Our Escalation 6 is reached later than anything 13th Age gates on**: without Momentum, round 6 (most fights are over by then; the SIM: an Escalation 6 Passive adds 0). An Escalation 6 ability is a rare moment; a one-off "when it becomes 6" effect is worth more than an ongoing bonus, and a big flashy one fits the genre's advice. Our GM valve (+1 Escalation to every PC after a bad turn) is their bump.

### Guard (temporary hit points) against healing

1. **Forum estimates put temporary hit points at about two thirds of healing per point** (one poster: 30 temporary for 20 real), more when the damage is near certain (a front-liner in a fight with enemies left), less when it can land on the wrong target or be wasted at the end of the fight. Temporary hit points don't stack; healing is rarely wasted in combat.
2. **Proactive protection trades efficiency for reliability**: given before the damage, it prevents a Down that a heal afterward can't.
   - *For 2d12:* the PC budget's 6 points a point of Guard (half of new Health's 12; the SIM measured 5.3) is a little under the forums' two thirds (8). Guard doesn't stack either (the higher value), and it ends with the encounter. Keep 6 for Guard on yourself, 6 to 8 for Guard given to the ally who is about to be hit.

### Sources
- [Pelgrane: 13th Sage, Escalation for Everyone?](https://pelgranepress.com/2014/08/07/13th-sage-escalation-for-everyone)
- [Pelgrane: 13th Sage, Escalate the Drama](https://pelgranepress.com/2019/02/01/13th-sage-escalate-the-drama/)
- [Pelgrane: 13th Age class SRD](https://pelgranepress.com/media/SRD/Classes.pdf)
- [Walking Mind: Combat in 13th Age](https://walkingmind.evilhat.com/2013/08/30/combat-in-13th-age)
- [Penny Arcade forums: the escalation die](https://forums.penny-arcade.com/discussion/comment/37633445)
- [EN World: healing to temporary hit points ratio](https://www.enworld.org/goto/post?id=7567076)
- [EN World: Healing Isn't What You Think, the value curve across a fight](https://www.enworld.org/posts/9895727/)
- [EN World: Inspiring Leader feat questions](https://www.enworld.org/threads/inspiring-leader-feat-questions.471537/latest)

---

## 2026-11-22: Passive escalation thresholds vs. unlocking active Actions mid-combat

**The question (Lucas):** Removing passive Escalation effects and instead having Escalation unlock new active Actions per class, because Passives feel forgotten and too small to track (while checking how much of that is solo-playtesting bias).

### Takeaways

1. **Mid-fight threshold passives are genuinely forgotten at real tables, not just in solo playtesting.**
   - *Draw Steel* uses threshold passive tables (*Growing Ferocity* for the Fury, *Discipline Mastery* for the Null: passives turning on at 2 / 4 / 6 / 8 resource). Even with one player per PC, GMs report players struggling to track the table during combat and advise beginners to *"disregard the table for a while"* and just spend the resource on active abilities instead. Players also built dedicated VTT UI modules (`draw-steel-resources-ui`) specifically to highlight active/inactive passive rows so they aren't missed.
   - Solo playtesting (running 4 PCs + all NPCs) multiplies this load by 4×, so a single player *will* remember 1–2 signature passives better than a solo tester—but conditional passives that flip from OFF to ON mid-fight remain the highest-memory-load category in TTRPGs (`research/talents.md` section 4 #7; `research/tactical-combat.md` takeaway 5).
2. **Active abilities scale better in memory than stacked passives.**
   - Design consensus on cognitive load (r/RPGdesign): *"Active abilities could be potentially limitless since you're only doing one at a time, but passives stack up."* You only read an active Action when you choose to press it; a passive demands background monitoring on every relevant roll or turn.
3. **Unlocking active Actions mid-combat works well—with one documented trade-off ("throttling").**
   - *Sentinel Comics RPG*'s **GYRO system** (Green → Yellow → Red) is the clearest printed tabletop precedent: heroes always have Green abilities, unlock Yellow abilities as the scene or their health escalates, and unlock Red abilities near the climax. Reviewers praise it as highly cinematic and thematic (*"the biggest moves arrive near the climax"*), directly curing the "best turn comes first" inverted suspense curve (`research/nova-burst.md` takeaway 1).
   - **Its documented con:** *"artificial throttling of hero power for purposes of tension-building"*—players can feel locked out of their coolest buttons on round 1, especially in short fights (echoing the *Draw Steel* Censor round-1 complaint in `research/nova-burst.md` takeaway 2).
4. **Gating abilities by combat rounds — no formal public surveys exist, but playtest & review consensus is consistent:**
   - *No formal survey/poll* specifically measuring round-gated abilities was found (neither MCDM nor Pelgrane published poll breakdowns on it). Evidence comes from playtest reports, class guides, reviews, and combat theory threads.
   - **The "Time Value of Damage" & Turn-1 primacy:** In 3–5 round TTRPG fights, Turn 1 is mathematically the highest-value turn (r/RPGdesign, *Time Value of Damage*; r/drawsteel *Talent Guide*: *"combats are often decided by crucial decisions in the first two rounds... Turn one is the most important turn"*). Players strongly prize ways to cheat or accelerate round gates (e.g., Draw Steel's *Talent* taking Strain to fire big powers on Round 1; *Victories* carrying into later fights).
   - **The "fight ended before I charged up" complaint:** Across *Sentinel Comics RPG* (*"you can't use the really strong moves until the fight is basically over"*), *Draw Steel*, and GiantITP (*Builder/Spender in TTRPGs*: *"spending 3–4 rounds building up feels bad. And if the thing dies the round before you're charged up... that feels real bad"*), high round gates fail when normal fights end before the button unlocks.
   - **When round-gating works well:** (a) the gate is low enough to fire in normal fights (Round 2–3), (b) Round 1 still has strong active tools so it doesn't feel empty, (c) carryover between fights (*Victories* / **Momentum**) and in-fight triggers (class hooks, Crits, taking damage) let players accelerate the unlock, and (d) the unlocked Action is visibly stronger than Round-1 options to beat the Time Value of Damage.
5. **How this applies to 2d12 (observations, nothing decided):**
   - **What improves:** Active Escalation Actions remove silent mid-fight bookkeeping, light up visibly on the HUD/sheet when unlocked, and match `Reckoning` (already a 0 AP Encounter Action at Escalation 6) and the new **Surge** direction.
   - **What the round-gating evidence says about 2d12's gates:**
     1. *Keep Stage 0 gates at Escalation 2 and 3–4 (not 6):* In 3.5-round fights, Escalation 2 fires almost every fight and Escalation 3–4 fires in normal/hard fights (and Round 1–2 with Momentum). Putting a Stage 0 class pick at **Escalation 6** risks the *"fight ended before it unlocked"* complaint—reserve Escalation 6 strictly for the **Level 4 Apex** (boss/high-Momentum climax).
     2. *Avoid hoarding:* Strictly gated Encounter Actions (100% power when lit) or early-capped scaling (3–4) prevent players from holding cards for Round 6; `dE` (`Escalation × 2`) fits **Round** Actions where early use isn't wasted.
     3. *Button bloat & overlap:* Merging Encounter Picks into the Escalation ladder (Option A) keeps the sheet lean and avoids overlapping Encounter Picks, Escalation Actions, and the Apex.

### Sources (2026-11-22)
- [Steel Compendium: Draw Steel Fury — Growing Ferocity](https://steelcompendium.io/compendium/main/Rules/Classes%20By%20Level/Fury/1st%20Level%20Features/)
- [Reddit r/drawsteel: Difficulty With Growing Ferocity Table](https://www.reddit.com/r/drawsteel/comments/1ox00b7/difficulty_with_growing_ferocity_table/)
- [GitHub: draw-steel-resources-ui (Passive Effect Tables highlighter)](https://github.com/OmerCora/draw-steel-resources-ui)
- [coopgestalt: Sentinel Comics RPG Review (GYRO system pros & cons)](https://coopgestalt.com/2021/01/16/sentinels-comics-rpg-review/)
- [ttrpg-games.com: Sentinel Comics RPG — The Green, Yellow and Red zones](https://www.ttrpg-games.com/item/sentinel-comics-rpg)
- [Reddit r/rpg: Sentinel Comics GYRO review discussion](https://www.reddit.com/r/rpg/comments/1negqo7/sentinel_comics_is_dirt_cheap_get_it_while_you_can/)
- [Reddit r/RPGdesign: How many abilities is too many? (active vs. passive load)](https://www.reddit.com/r/RPGdesign/comments/15hwx49/how_many_abilities_is_too_many/)
- [Reddit r/RPGdesign: The Time Value of Damage (Combat Balance Theory)](https://www.reddit.com/r/RPGdesign/comments/117ru5x/the_time_value_of_damage_combat_balance_theory/)
- [Reddit r/drawsteel: Draw Steel Talent Guide (Turn 1 primacy & Strain)](https://www.reddit.com/r/drawsteel/comments/1w15712/draw_steel_talent_guide/)
- [GiantITP: Examples of builder/spender abilities in TTRPGs?](https://forums.giantitp.com/archive/index.php/t-658150.html)
- [Reddit r/Pathfinder2e: Pathfinder with 13th Age's Escalation Die](https://www.reddit.com/r/Pathfinder2e/comments/1j6zi61/pathfinder_with_13th_ages_escalation_die/)


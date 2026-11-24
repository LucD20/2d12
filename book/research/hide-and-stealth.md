# Hide, Sneak, Seek and Group Stealth in Tactical TTRPGs

**Date:** 2026-11-23. **Asked by Lucas:** "This relies a bit on an unworked feature which is Hide. If necessary, do a Hide research before on things that fit the 2d12 system."

**What was read, and how far to trust it.** Full report with excerpts and links: `raw/2026-11-23-hide-and-stealth.md`. **Rules text read in full [read]:** Pathfinder 2e (*Player Core*: Perception & Detection, Hide, Sneak, Seek, Follow the Expert, Quiet Allies), Draw Steel (*Heroes* 1.01b: Hide & Sneak, Concealment, Group Tests), D&D 4e (post-PHB2/Rules Compendium Stealth), Lancer (Hide, Search, Hidden vs. Invisible). **Essays read in full [checked]:** The Alexandrian ("Stealthy Thoughts"), The Angry GM ("Tactical Infiltration Action"). **Search snippets only [lead]:** D&D 5e 2024 Hide/Invisible controversy, Reddit PF2e/Lancer threads.

**Other games' rules and other people's opinions, never 2d12's. Nothing here is decided.**

---

## 1. Why Hide Breaks So Often in Tactical Games

Four recurring failure modes show up across editions and forums:

1. **Conflating "unseen" with "unlocated" (and calling hiding "Invisible").** D&D 5e 2024 tried to simplify Hide by granting the *Invisible* condition on a DC 15 check `[lead]`. Players immediately hit edge cases (*See Invisibility* spotting someone behind a barrel; losing cover not ending the condition; DC 15 locking non-stealthy PCs out of hiding even from oblivious guards). Games that separate **visual obscuration** from **being unlocated** (PF2e, Draw Steel, Lancer) avoid this completely `[read]`.
2. **The "bush problem" for melee ambushers.** If stepping out of cover immediately strips your stealth bonus *before* your melee attack resolves, melee stealth characters can never ambush without teleporting. Both **D&D 4e** ("you retain the benefits of being hidden until you resolve the action") and **Draw Steel** (edge lasts *until the end of the turn* in which you stop being hidden) explicitly solve this `[read]`.
3. **Rolling to failure.** Asking for a fresh Stealth check against every guard, every turn, mathematically guarantees failure (`[checked]` Alexandrian). Even PF2e's praised stealth rules draw complaints for forcing a new Sneak check on every combat stride (`[checked]` Chibi on Alexandrian).
4. **360° combat awareness vs. sneaking behind a guard.** Tactical grids don't track facing, so "line of sight" is 360°. **D&D 4e** `[read]` solves this with an explicit out-of-combat clause (distracted enemies can be snuck up on without total cover/concealment); **Draw Steel** `[read]` separates *having line of effect* from *observing* (the Director decides outside combat or in crowds) and limits *Sneaking* in the open strictly to out-of-combat play.

---

## 2. How Tactical Systems Do Hide (Side by Side)

| System | States | How you become Hidden | Moving while Hidden | Breaking / Seeking | Tradeoff |
|---|---|---|---|---|---|
| **Pathfinder 2e** `[read]` | Observed · Hidden (know square, DC 11 flat check) · Undetected (unknown square) · Unnoticed (+ Concealed, Invisible) | **Hide** (1 action, secret roll vs. Perception DC) with cover/concealment -> **Hidden** | **Sneak** (1 action, half speed, secret roll) -> **Undetected**; Fail = stays Hidden; Crit Fail = Observed (downgraded if truly unseeable) | **Seek** (1 action, ~30 ft, secret roll) steps up 1 state (2 on crit). Strike keeps foe off-guard, then Observed | Zero ambiguity; graduated fail on Sneak; heavy secret-roll and per-enemy tracking |
| **Draw Steel** `[read]` | Concealed (bane to hit) · **Hidden** (untargetable except Area; edge on rolls until EoT when revealed) | **Hide** (Maneuver): **automatic in combat** if you have cover/concealment and aren't observed; test out of combat | Out of combat only: **Sneak** at half speed (Agility test). In combat, moving out of cover breaks Hidden (edge still lasts EoT) | **Search** (Maneuver, 10 sq., opposed Intuition vs. Hide) + free point-out within 10 sq. | Fast, zero dead combat turns, melee-friendly EoT edge; relies on GM call for "observed" |
| **D&D 4e (errata)** `[read]` | Hidden (silent + invisible to that foe; combat advantage) | End of Move with **Superior Cover / Total Concealment** vs. passive Perception (out of combat: distracted foe) | Stay in **any** cover/concealment; moving >2 sq. = new check at -5 (running -10) | Active Perception vs. stored Stealth total; entering square reveals; keep benefits until revealing action resolves | Asymmetric entry vs. maintenance is clean on a grid; >2 sq. penalty is fussy |
| **Lancer** `[read]` | **Hidden** (untargetable, no engagement) vs. **Invisible** (50% miss; can Hide in plain sight) | **Hide** (Quick Action, no roll) while not Engaged and behind hard/soft cover or Invisible | Stay in cover/Invisible; Boost breaks it. Tokens stay visible on map (no guessing squares) | **Search** (Quick Action, contested). Lost after hostile action, Boost, Reaction, or losing cover | Crisp VTT/grid clarity, no hidden-square bookkeeping; purely a combat defensive tool |
| **Alexandrian (Infinity)** `[checked]` | Revealed · Detected (approx. location) · Hidden (location unknown) | Stealth test when obscured | **Action-severity paradigm:** Silent (no test), Sneaky (test; fail -1 state), Noisy (foe gets free Observation; margin -2) | Let It Ride (one check per approach); spend resource (Momentum) to downgrade action noise by 1 step | Best bridge between grid combat and camp infiltration; avoids laundry-list rules |

---

## 3. The Group Stealth Problem ("The Paladin in Heavy Armor")

When a whole party wants to sneak into a camp, rolling individually means 4–5 rolls where one bad die blows the mission. Five documented solutions exist:

| Model | Source | How it works | Pros / Cons |
|---|---|---|---|
| **Everyone rolls; one fail = caught** | Naive default | Each PC rolls Stealth vs. guards | Mathematically punishes groups; forces "solo scout" play `[checked]` |
| **Lowest modifier rolls once** | PF2e *Follow the Expert* + *Quiet Allies* `[read]` | Expert boosts allies; 1 roll using lowest mod | Fixes multi-roll math, but sidelines the expert's high score; in PF2e, gated behind a skill feat (Lucas's permission/tax trap) |
| **Majority Group Test** | D&D 5e; Draw Steel Group Tests `[read]` | Everyone rolls; half or more succeed = group succeeds (collective reward/consequence) | Fast, inclusive, keeps everyone rolling; criticized by Angry GM `[checked]` for erasing the real tradeoff of heavy armor |
| **Piggybacking (margin cancels fails)** | The Alexandrian `[checked]` | Declare a point person; everyone rolls (followers at lower DC or normal); expert's margin / high tier cancels allies' failures | Rewards the Stealth specialist *and* lets everyone roll; fictionally crisp ("caught the stumbling ally") |
| **Division of Roles (don't all roll Stealth)** | Blades `[read]`; Sly Flourish `[checked]`; RPG.SE `[checked]` | Only the infiltrator(s) roll Stealth; heavy/social/caster PCs create distractions, guard the exit, disable obstacles, or provide utility | Best for full-scene infiltrations; keeps every build useful without handwaving plate armor |

---

## 4. How This Applies to 2d12 (Observations)

2d12's Chapter 3 (`03-movement.md`) **already built the detection ladder** that most games fail to define:

| 2d12 Senses state | Meaning in Chapter 3 | Closest PF2e equivalent |
|---|---|---|
| **Clear** | Seen in Bright light (normal) | Observed |
| **Obscured** | Dim light (1 Field Bane / 1 Field Boon) | Concealed |
| **Hidden** | Unseen, but heard within **10 squares** (Doomed vs. them; Favored by them; two Hidden = both Doomed) | Hidden |
| **Unsensed** | Neither seen nor heard (can't target except `[Area]`; Favored by them) | Undetected |

And two existing rules already hook straight into Hide:
- **Hearing (`03-movement.md`):** *"Creatures in combat make noise, even standing in the same square on their turn. A creature can **Hide** to stop making noise."*
- **Surprise (`items-economy.md` Part 2):** *"A creature is Surprised if, when Initiative is rolled, every enemy acting against it is Hidden or Unsensed to it."*

**Six concrete design choices Hide needs to settle for 2d12 (for Lucas):**
1. **What Hide requires to enter:** 2d12 already has exact 4-corner Cover (`Low / Medium / High / Total`) and `Obscured` (Dim light). Requiring **Total Cover** or **Darkness** (not seen by Sight) makes Hide unambiguous: you are already Hidden (heard within 10 sq.), and Hide silences you -> **Unsensed**. Alternatively, allowing Hide in **High Cover or Obscured (Dim light)** (like PF2e / 4e) lets characters hide behind pillars or in shadows during a bright fight -> moves Clear/Obscured to Hidden (or Unsensed on Tier 3).
2. **Roll vs. Automatic in combat:**
   - *Draw Steel / Lancer way:* Hide (1 AP) is automatic when unseen (Total Cover/Darkness), and enemies must spend AP to **Seek** against your **Action DC** (`11 + Instinct` or `11 + Stealth`). Zero wasted turns, zero stealth-total bookkeeping.
   - *2d12 Tiers way:* Hide (1 AP, Instinct vs. highest observing `12 + Instinct` or DC 13): **Tier 1** fail (still heard/seen), **Tier 2** Hidden/quiet in place, **Tier 3** Unsensed (and maybe silent for 1 Move / free step).
3. **Keeping the bonus when striking out of Hide (the bush problem):** Adopting 4e's / Draw Steel's timing rule — *"when you break Hide by moving out of cover or acting, you keep Favored on your next Action this turn (or until the revealing Action resolves)"* — makes melee ambushes actually work without needing a Talent.
4. **Moving while Hidden in combat vs. out of combat:** In combat, either **Crawl / half-Speed Advance** keeps you silent (with or without a Check) while normal Advance makes noise (10 sq. Hearing), OR like Draw Steel, moving in the open is strictly an out-of-combat Sneak rule.
5. **Seek Basic Action:** Needs a clean counterpart — e.g., 1 AP Instinct Check vs. the hider's **Action DC** (within 10 sq., already 2d12's Hearing distance!), stepping Unsensed -> Hidden -> Clear (if LoE/light allows), plus pointing out to allies (free on success, as in Draw Steel).
6. **Group Stealth:** 2d12 already decided the **Lead Check** (`decided.md` §3: highest modifier rolls; the attempt belongs to the party), while noting *"a group check that everyone rolls may become another mechanic."* Stealth is the #1 test case where **Lead Check alone** feels weird (why can the plate Paladin sneak as well as the Archer?) — making **Piggybacking** (Tier 3 cancels an ally's failure), **Heavy Armor imposes 1 Bane on the Lead Check**, or **Role-based Infiltration** strong candidates.

---

## Sources

- Pathfinder 2e *Player Core* — [Perception and Detection](https://2e.aonprd.com/Rules.aspx?ID=2400) [read], [Stealth](https://2e.aonprd.com/Skills.aspx?ID=15) [read], [Seek](https://2e.aonprd.com/Actions.aspx?ID=2301) [read], [Follow the Expert](https://2e.aonprd.com/Actions.aspx?ID=2625) [read], [Quiet Allies](https://2e.aonprd.com/Feats.aspx?ID=5202) [read].
- Draw Steel *Heroes* 1.01b (Steel Compendium v2) — [Hide and Sneak](https://steelcompendium.io/v2/Browse/rule/test/hide-and-sneak/) [read], [Concealment](https://steelcompendium.io/v2/Browse/rule/combat/concealment/) [read], [Group Tests](https://steelcompendium.io/v2/Browse/rule/test/group-test/) [read].
- D&D 4e (D&D4 Wiki, PHB2/Rules Compendium errata) — [Stealth](https://dnd4.fandom.com/wiki/Stealth) [read].
- Lancer (Community Reference) — [LANCER Rules](https://lancer-rules.carrd.co/) [read].
- The Alexandrian — [Random GM Tips – Stealthy Thoughts](https://thealexandrian.net/wordpress/40062/roleplaying-games/random-gm-tips-stealthy-thoughts) [checked].
- The Angry GM — [Tactical Infiltration Action](https://theangrygm.com/tactical-infiltration-action/) [checked].
- Unopened / snippet-only leads [lead]: D&D 5e 2024 Hide/Invisible threads on Reddit (`r/onednd`, `r/dndnext`, `r/DMAcademy`) and D&D Beyond; Awesome Dice ("How to Run D&D 5e Stealth Encounters", 2024-12-09); Old Dungeon Master (2025-07-25); Giant in the Playground ("The Rules of Hidden Club", 2015).

# Raw research report: Hide, Sneak, Seek and Group Stealth in Tactical TTRPGs

**Date:** 2026-11-23.
**Asked by Lucas:** "This relies a bit on an unworked feature which is Hide. If necessary, do a Hide research before on things that fit the 2d12 system."

**What was read, and how far to trust it.**
Marks: **[read]** = rules text opened and read directly on its page; **[checked]** = opinion, forum thread, or design essay opened and read directly; **[lead]** = search-result snippet only (page refused automated reading or was not opened, notably Reddit); **[memory]** = not used for quoted rules here.
- **Rules text read in full [read]:**
  - Pathfinder 2e *Player Core* (Archives of Nethys): Perception and Detection (Light, Senses, Precise/Imprecise/Vague, Observed/Hidden/Undetected/Unnoticed/Concealed/Invisible), Stealth (Hide, Sneak, Unobservable Stealth), Seek, Follow the Expert, Quiet Allies.
  - Draw Steel *Heroes* printing 1.01b (Steel Compendium v2): Hide and Sneak (Hiding, Searching for Hidden Creatures, Sneaking, "What Does It Mean to Be Observed?"), Concealment (including Invisible Creatures), Group Tests.
  - D&D 4e (D&D4 Wiki, post-PHB2 / Rules Compendium errata): Stealth (Becoming Hidden, Remaining Hidden, Not Remaining Hidden, Enemy Activity, modifiers).
  - Lancer (lancer-rules.carrd.co community compendium): Hide, Search, Hidden status, Invisible status.
- **Essays and discussions opened and read [checked]:**
  - The Alexandrian, "Random GM Tips – Stealthy Thoughts" (2018-06-13) and comments (including Justin Alexander's revised piggybacking procedure and Infinity RPG's three-state / action-severity model).
  - The Angry GM, "Tactical Infiltration Action" (2023-12-18) and comments.
- **Search snippets only [lead]:**
  - D&D 5e 2024 Hide action exact text & Invisible condition controversy (Reddit r/onednd, r/dndnext, r/DMAcademy; D&D Beyond forum snippets; Old Dungeon Master; Awesome Dice).
  - Pathfinder 2e community complaints on stealth tracking and Avoid Notice (Reddit r/Pathfinder2e).
  - Giant in the Playground "The Rules of Hidden Club" (4e stealth summary).
  - Lancer Reddit threads on Hide/Infiltrator/cover edge cases.
- **Other games' rules and other people's opinions, never 2d12's. Nothing here is decided.**

---

## 1. Pathfinder 2e [read]

Sources:
- https://2e.aonprd.com/Rules.aspx?ID=2400 (Perception and Detection, *Player Core* p. 432)
- https://2e.aonprd.com/Skills.aspx?ID=15 (Stealth, *Core Rulebook* p. 251–252)
- https://2e.aonprd.com/Actions.aspx?ID=2301 (Seek, *Player Core* p. 417)
- https://2e.aonprd.com/Actions.aspx?ID=2625 (Follow the Expert, *Player Core* p. 438)
- https://2e.aonprd.com/Feats.aspx?ID=5202 (Quiet Allies, *Player Core* p. 260)

### Senses hierarchy
- **Precise senses** (default: vision): can perceive nuanced detail; required to make a creature **Observed** and target it without drawbacks.
- **Imprecise senses** (default: hearing): automatically detects creatures as **Hidden** (know square, can't see) unless they use Stealth or environment distorts it; at best can upgrade Undetected -> Hidden, never Observed.
- **Vague senses** (default: smell): at best alerts you that an Unnoticed creature is present (Unnoticed -> Undetected).

### Four detection states (relative to each viewer) + two visual conditions
- **Observed:** clear view via a precise sense; targetable normally (may still be Concealed in dim light/mist: DC 5 flat check).
- **Hidden:** viewer knows which space the target occupies, but little else. Viewer is **off-guard** to the hidden creature; targeting the hidden creature requires a **DC 11 flat check** (50% miss chance) before the attack roll; failed flat check wastes actions and resources.
- **Undetected:** viewer does not know which space the target occupies; viewer is off-guard and cannot easily target (must guess a square; GM rolls flat check + attack roll in secret without telling why it missed). Area effects hit normally.
- **Unnoticed:** viewer has no idea the creature is even present (subset of Undetected; gates ambush-only abilities).
- **Invisible:** automatically Undetected to creatures relying only on sight, *unless* already observed when turning invisible (then starts Hidden until it Sneaks).

### The Hide -> Sneak -> Seek loop
- **Hide (1 action, Secret):** requires cover, greater cover, or concealment. GM secretly rolls Stealth vs. Perception DC of each observing creature (cover adds +2/+4 circumstance bonus).
  - *Success:* Observed -> **Hidden** (or keeps Hidden/Undetected).
  - *Breaking Hide:* ceases immediately if you lose cover/concealment, or if you do anything other than Hide, Sneak, or Step. **Strike timing:** *"If you attempt to Strike a creature, the creature remains flat-footed [off-guard] against that attack, and you then become observed."* Other actions reveal you *before* acting unless GM allows an unobtrusive check.
- **Sneak (1 action, Move, Secret):** Stride up to **half Speed** from Hidden or Undetected. At the end of movement, secret Stealth roll vs. Perception DC. Must end with cover/greater cover/concealment against any creature that can see you (otherwise automatically Observed).
  - *Success:* **Undetected** during and at end of movement.
  - *Failure:* telltale sound/sign gives position away, still unseen -> **Hidden** (graduated failure!).
  - *Critical Failure:* spotted -> **Observed** (unless *Unobservable Stealth*: invisible, observer blinded, or darkness without darkvision downgrades Crit Fail to Failure and lets you stay Undetected without cover).
- **Seek (1 action, Concentrate, Secret):** scan an area (typically 30 ft or less). Secret Perception vs. Stealth DC of hidden/undetected creatures in area.
  - *Success:* Undetected -> Hidden; Hidden -> Observed (capped at Hidden if only using imprecise sense or target is invisible).
  - *Critical Success:* Undetected or Hidden -> Observed.

### Group Stealth in PF2e
- **Follow the Expert (Exploration):** ally must be at least Expert in the skill. Followers add their level even if untrained, plus +2/+3/+4 circumstance bonus (Expert/Master/Legendary).
- **Quiet Allies (Level 2 General Skill Feat, prereq Expert in Stealth):** when Avoiding Notice and allies Follow the Expert, the group rolls a **single Stealth check using the lowest modifier** instead of rolling separately (does not apply to Initiative).

### Reception / Critique
- Praised for eliminating table arguments over visibility states (`[checked]` Alexandrian comment by Chibi, 2021-04-01).
- Criticized as a "roll to fail" combat loop because Sneaking requires rolling on every movement (`[checked]` Chibi on Alexandrian); criticized for gating single-roll group stealth behind the *Quiet Allies* feat (`[checked]` Chibi; directly matches Lucas's permission/tax trap); criticized as clunky to track per-enemy states and secret rolls (`[checked]` Jason S Frick comment on Angry GM, 2024-01-01; `[lead]` Reddit r/Pathfinder2e).

---

## 2. Draw Steel [read]

Sources:
- https://steelcompendium.io/v2/Browse/rule/test/hide-and-sneak/ (*Draw Steel: Heroes* printing 1.01b)
- https://steelcompendium.io/v2/Browse/rule/combat/concealment/
- https://steelcompendium.io/v2/Browse/rule/test/group-test/

### Core rules
- **Concealment vs. Hidden:** Darkness, fog, invisibility grant **Concealment** (strikes against them take a bane, but they can still be targeted unless Hidden).
- **Hide (Maneuver):** requires cover or concealment from a creature **who isn't observing you** ("aware of your specific location before you attempt to hide").
  - **In combat:** *"When you use the Hide maneuver to hide during combat while you have cover or concealment from a creature who isn't observing you, you are **automatically hidden** from them unless the Director deems otherwise."* (No roll to become hidden in combat!)
  - **Out of combat:** Director may ask for a Hide test.
  - **Effects of Hidden:**
    1. Target **cannot target you** with abilities that lack the Area keyword (ends as soon as no longer hidden).
    2. You gain an **edge on ability rolls** against that creature — **and this benefit lasts until the end of the turn in which you are no longer hidden!** Explicitly explained: *"This means you can be hidden from another creature at the start of your turn, move out of cover or concealment toward them and use an ability against them, and still gain an edge on ability rolls made against the creature as long as you use the ability before the end of that turn."*
  - **Losing Hidden:** lose cover/concealment, use an ability, interact with an enemy, move without sneaking, or make noise. When revealing yourself via an ability, you resolve it first, then stop being hidden.
- **Searching for Hidden Creatures (Maneuver):** target hidden creatures within **10 squares** with line of effect. Opposed test: Intuition (Search) vs. Agility (Hide) (or other fitting characteristic/skill). Higher total reveals them. **Pointing out:** part of the Search maneuver reveals noticed creatures to allies within 10 squares; if already visible to you, spending a maneuver (no test) points them out.
- **Sneaking (Explicitly out-of-combat only):** *"While you are hidden from another creature and not in combat, you can attempt to sneak—avoiding the senses of other creatures as you move around them in the open—to remain hidden. While sneaking, your speed is halved."* Agility (Sneak) test vs. Director difficulty.
- **What Does It Mean to Be Observed?:** Usually line of effect in combat = observed; explicitly left open to Director outside combat or in crowds.
- **Shadow class features (exceptions):** *Black Ash Teleport* and *Smoke Bomb* explicitly let a stealth specialist Hide *even while observed* (`[read]` search snippet on Steel Compendium v2).
- **Group Tests:** everyone rolls; if **half or more succeed**, the group succeeds. Collective reward if half or more earn a reward; collective consequence if more than half incur a consequence (e.g., camp goes on alert).

---

## 3. D&D 4e (Post-PHB2 / Rules Compendium Errata) [read]

Source: https://dnd4.fandom.com/wiki/Stealth

### Core rules
- **When you roll:** at the end of a move action (or any action involving movement), opposed by each enemy's **passive Perception**.
- **Asymmetric Entry vs. Maintenance (the key 4e innovation after PHB1 errata):**
  - **Becoming Hidden:** requires **Superior Cover**, **Total Concealment**, or being outside the enemy's line of sight. *Outside combat:* DM may allow Stealth against a **distracted enemy** even without superior cover / total concealment.
  - **Remaining Hidden:** requires only **any cover or concealment** (not superior/total), not from creatures, plus keeping quiet (whisper max), not attacking, and if moving >2 squares making a new Stealth check at **-5** (or **-10** if running).
- **Effect:** you are silent and invisible to that enemy (grants Combat Advantage; enemies must guess square with -5 to hit).
- **Action resolution timing ("Not Remaining Hidden"):** *"If you take an action that causes you not to remain hidden, you retain the benefits of being hidden until you resolve the action. You can't become hidden again as part of that same action."* (Allows charging out of cover and keeping Combat Advantage on the strike `[checked]` RPG.SE snippet).
- **Enemy Activity:** active Perception check vs. your stored Stealth total (you don't re-roll); entering your square also reveals you.
- **Errata history:** PHB1 launched with incomplete stealth rules (active vs. active rolls, no partial-cover maintenance rule), causing notorious table confusion until PHB2 and the Rules Compendium rewrote it into the clean state machine above.

---

## 4. Lancer [read]

Source: https://lancer-rules.carrd.co/ (and `[lead]` r/LancerRPG clarifications)

- **Hide (Quick Action):** requires not being Engaged, and being behind hard cover large enough to break LoS, inside soft cover, or Invisible. Grants **Hidden** status (no roll to enter!).
- **Hidden status:** cannot be targeted by hostile actions (AoEs still hit); does not cause engagement (still affected by it). **Tokens stay visible on the map** (no hidden-square guessing game; pure tactical untargetability).
- **Losing Hidden:** lost if seen (loses cover/LoS broken), or after resolving a hostile action, Boost, or Reaction.
- **Search (Quick Action):** contested Systems vs. Agility to remove Hidden.
- **Invisible vs. Hidden:** strictly separated. Invisible = 50% miss chance on all attacks and lets you Hide in plain sight; being Invisible does *not* make you Hidden automatically.

---

## 5. D&D 5e (2014 vs. 2024) [lead]

Sources (snippets only; Reddit and D&D Beyond threads not opened directly):
- Reddit r/onednd ("Fixing Hiding & Invisibility", 2025-02-27; "Summary of D&D 2024 Rules Issues", 2024-08-15; "The New Hide Rule is Broken", 2023-05-12); Reddit r/DungeonMasters (2024-11-28); Awesome Dice (2024-12-09); Old Dungeon Master (2025-07-25).

- **5e 2014:** Deliberately vague ("The DM decides when circumstances are appropriate for hiding"). Constantly generated arguments over facing, moving from cover to melee, dim light vs. darkvision, and invisible creatures' locations.
- **5e 2024:** Fixed **DC 15** Dexterity (Stealth) check while Heavily Obscured or behind 3/4 or Total Cover and out of enemy LoS. On success, grants the **Invisible condition** (check total becomes the DC for enemy Perception checks). Ends on sound louder than whisper, enemy finding you, attack roll, or Verbal spell.
- **Why 2024 sparked immediate backlash [lead]:**
  1. **Naming collision:** reusing the word "Invisible" for mundane hiding behind a crate created absurd raw-text readings (*See Invisibility* spotting mundane hiders; whether walking out from behind cover ends "Invisible" since losing cover isn't in the condition's end list).
  2. **Fixed DC 15 floor:** locks low-Dex / heavy-armor characters out of hiding even from oblivious/low-Perception guards, while making a rogue's 30+ roll nearly unfindable.
  3. **Scattered rules:** split across the Hide glossary entry, Invisible condition, and an unlinked Unseen Attackers sidebar.

---

## 6. Design Essays: The Alexandrian & The Angry GM [checked]

Sources:
- The Alexandrian, "Random GM Tips – Stealthy Thoughts" (2018-06-13): https://thealexandrian.net/wordpress/40062/roleplaying-games/random-gm-tips-stealthy-thoughts
- The Angry GM, "Tactical Infiltration Action" (2023-12-18): https://theangrygm.com/tactical-infiltration-action/

### The Alexandrian [checked]
- **Two rules to make stealth viable:**
  1. *Reduce the number of rolls:* never check against every guard every turn ("rolling to failure"). Use **Let It Ride** — resolve an entire stealth approach in a single check.
  2. *Reduce the number of people rolling:* having 5–7 PCs each roll individually guarantees failure. Using only the lowest modifier punishes the stealth specialist. Instead use **Piggybacking**: declare a point person; everyone rolls (or piggybackers roll at a lower DC), and the leader's margin of success cancels allies' failures ("the dwarf trips, the elf catches him before the clatter").
- **Three Stealth States (Infinity RPG model):**
  - *Revealed:* visible, precise location known.
  - *Detected:* unseen, but presence and approximate location known ("rustle in those bushes").
  - *Hidden:* unseen, unheard, location unknown (even if enemy knows intruders exist).
- **Three Action Severities (paradigm, not a laundry list):**
  - *Silent action:* no state change.
  - *Sneaky action:* Stealth test as part of the action; failure drops state by 1 step.
  - *Noisy action:* opponents automatically get an Observation check (margin can drop 2 steps).
  - Spending a resource (like Momentum) can downgrade a Noisy action to Sneaky, or Sneaky to Silent.

### The Angry GM [checked]
- **"Stealth ain't a button/mode":** Video games trained players to press Crouch and expect a cloaking field. Sneaking is an *action* ("get past the lookout without notice"), which still requires a plan, cover, and timing.
- **Perception is not binary:** distinguish *Inattentive* (sleeping, dicing off-duty) vs. *Alert* (on watch) vs. *Aware* (heard a rustle, knows something's up, must investigate -> creates cat-and-mouse gameplay instead of instant "roll Initiative").
- **Distance matters:** GMs make everything happen within 30 ft, leaving no room to react or sneak. Reference benchmarks (from AD&D 2e / 3.5e): spotting movement ~1 mile, gross shape 1,500 ft, individuals 300 ft, facial cues 30 ft; hearing combat 500 ft, conversation 250 ft, armored movement 150 ft, unarmored movement 100 ft.
- **Counter-argument to Group Stealth checks:** Angry GM explicitly argues *against* group checks hiding armor penalties ("That ain't a bug, kid, that's a feature"): making the party choose between leaving heavy armor behind, splitting up, or managing noise creates real tactical choices.

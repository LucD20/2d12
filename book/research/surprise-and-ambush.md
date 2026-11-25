# Surprise, ambush, and the exploration-to-initiative seam

**Date:** 2026-11-24. **Asked by Lucas:** *"Perfect, now the natural step is the surprise and ambush I think"* — following [combat-out-of-combat-disparity.md](combat-out-of-combat-disparity.md) and [items-economy.md](file:///home/antigravity/LucD20/2d12/book/items-economy.md) Part 2, where the surprise round is marked *"still in the works."*

**What was read, and how far to trust it.**
- `[read]` Primary rules text opened directly: **Draw Steel** (MCDM printing 1.01b, *Determine Surprise* — Steel Compendium), **Nimble v2** (*Initiative* and *Surprise* — Nimble Nexus), **13th Age SRD** (*Combat Rules — Ambushes and Surprise*), and **Pathfinder 2e** (*Initiative*, *Initiative and Stealth*, and *Follow the Expert* — Archives of Nethys, Gamemastery Guide).
- `[checked]` Essays read on their pages: **The Alexandrian** (*Random GM Tip – Standoffs & Surprise*, plus comment discussion).
- `[lead]` Search extracts and forums blocking automated readers: **Draw Steel** *Determine Who Goes First* (`steelcompendium.io` extract); **D&D 5e (2024)** Surprise = Disadvantage on Initiative + Invisible Advantage on Initiative and community reception (`r/DnD`, `r/onednd`, `r/dndnext`, `r/DungeonsAndDragons`); **Pathfinder 2e** *"no surprise round"* monster-ambush edge cases (`r/Pathfinder2e`); **D&D 4e** single-action surprise round (`RPG.SE`, Campaign Mastery); **The Angry GM** (*Roll Initiative!* extracts); **Tabletop Builds** (*Hiding, Surprise, and More* extract); **Daggerheart** *Surprise!* environment feature & **Lancer** (no surprise round); group stealth discussion (`r/RPGdesign`, `r/DMAcademy`). Check any `[lead]` before quoting publicly.
- `[memory]` D&D 5e (2014) Surprised condition & *Pass Without Trace* alpha-strike meta; D&D 4e surprise round action limit.

**Already in the project:** `combat-out-of-combat-disparity.md` (the mode seam and PF2e Ready-at-the-door friction), `conditions-and-senses.md` (Hidden / Unsensed / Darkness), `party-retries.md` (group checks / Lead Check).

**Other games' rules and opinions, never 2d12's. Nothing here is decided.**

---

## 1. The core tension of Surprise in tight-math RPGs

Surprise sits directly on a knife edge between **two opposite failures**:
- **Too strong (the Alpha-Strike / TPK trap):** If an entire side gets a full uncontested turn before the other side can act or react, a well-tuned encounter collapses on Round 0 — trivializing fights when PCs ambush monsters, and **causing uninteractive TPKs** when monsters ambush PCs.
- **Too weak (the "Why Bother?" / Initiative Paradox trap):** If Surprise only nudges Initiative rolls, an ambushed target can still roll higher than the hidden archer, go first with nothing visible to react to, and either meta-game (*"I search that suspicious bush!"*) or awkwardly walk out of ambush range.

Every modern tactical RPG's surprise rule is an attempt to navigate between these two cliffs.

---

## 2. How published games handle Surprise and Ambush

| System | Mechanism | What Surprised targets lose | What Ambushers get | Strengths | Documented weaknesses / reception |
|---|---|---|---|---|---|
| **D&D 5e (2014)** `[memory]` `[lead]` | Surprised condition on Turn 1 | Skip entire Turn 1; no Reactions until Turn 1 ends | Full uncontested party alpha strike (4 vs. 0) | Feels unmistakably huge when PCs pull off an ambush | **Notoriously broken:** trivializes fights (*Pass Without Trace* meta), causes instant TPKs when used on PCs, and creates the **"High-Initiative Paradox"** (rolling higher than the ambusher ends your Surprised condition *before* they jump out, letting you take Reactions!) |
| **D&D 5e (2024)** `[lead]` | Disadvantage on Initiative (no skipped turns) | Disadvantage on Initiative; Invisible/Hidden ambushers also get Advantage on Initiative | High odds of acting before targets + Advantage on first attack from Hidden | Eliminates 4-vs-0 TPK wipes; easy to adjudicate frequently | **Two complaints (`r/DnD`, `r/DungeonsAndDragons`):** (1) **Counter-intuitive** — if a surprised victim still wins Initiative, what are they reacting to? (2) **Lingers all fight** — a bad Initiative roll makes you go last in Rounds 3–5 just because you were startled at second 0 |
| **Pathfinder 2e** `[read]` `[lead]` | **No Surprise Round.** *Avoid Notice* rolls Stealth for Initiative vs. Perception DC | Targets are Off-Guard to Undetected attackers; typically no Reactions before first turn; must spend actions Seeking | Stealth replaces Perception for Initiative; start Undetected | Keeps tight encounter math safe; zero 4-vs-0 TPKs (`r/Pathfinder2e`: *"run two ambushes on the party and they'll thank you for no surprise round"*) | **The "Bush Goblin" edge case (`r/Pathfinder2e`):** if the traveler rolls 22 Perception > Goblin's 20 Stealth, the traveler goes first without knowing a goblin exists — either meta-gaming or striding 75 ft off the map before the goblin can jump out! |
| **D&D 4e** `[lead]` `[memory]` | **Single-Action Surprise Round** | Cannot act, grant Combat Advantage, no Immediate/Opportunity Actions during Surprise Round | **1 single Action** (Standard, Move, or Minor — NOT a full turn) | Cleanly bounded compared to 5e 2014; zero "surprised target goes first" paradox | Still lets 4 PCs drop 4 Standard Actions before anyone moves, and winning Initiative right after still enables a double-tap on one target |
| **13th Age** `[read]` | **Capped 2-Creature Ambush Round** | Cannot act in the ambush round (don't even roll Initiative until after it) | **Only 2 creatures act** (1 nominated ambusher + their highest-Initiative ally); GM chooses whether Escalation Die advances | **Brilliant anti-alpha-strike brake:** an ambush always feels real and punchy without turning into a 5-on-0 wipe | Two-creature cap can feel slightly gamist to players who ask *"why didn't all four of us loose arrows at once?"* |
| **Draw Steel** `[read]` `[lead]` | **Surprised Condition (Round 1) + Automatic First Side** (zipper turns!) | Through end of Round 1: **no Triggered Actions (Reactions)**; ability rolls against them gain an **Edge (`+1 Boon`)** | If *all* enemies are Surprised, the ambushing side **automatically goes first** in the alternating turn order (bypassing the d10 roll) | **Preserves zipper alternation!** Zero TPK alpha strikes, zero Initiative paradox, zero extra Round 0 bookkeeping, handles partial surprise cleanly | Softer than a free attack round — some players expecting Baldur's Gate 3-style free ambush rounds want a sharper tempo swing |
| **Nimble v2** `[read]` | **Turn 1 Action-Point Scaling** (3 Actions/turn) | Roll Initiative with Disadvantage (often starting Turn 1 with only **1 Action** instead of 2–3); extreme cases: auto 1 Action or monsters go first | Advantage on Initiative (or extreme cases: auto **all 3 Actions** on Turn 1 without rolling) | **Native to AP systems!** Reduces a Surprised creature's Turn 1 AP instead of erasing their entire turn or bolting on a Round 0 | Still allows "monsters all go first" in extreme GM calls, which risks swinginess if overused |
| **Daggerheart** `[lead]` | Narrative spotlight + GM Fear (*Surprise!* feature) | GM gains 2 Fear and immediately seizes the spotlight with an ambusher | Narrative opening move before spotlight passes | Smooth fiction-first transition; zero Initiative pause | Built for spotlight combat rather than structured tactical Initiative |
| **Lancer** `[lead]` | **No Surprise Round** | None; tactical combat assumes active sensors/briefing | Positioning + Hidden status only | Protects tight tactical balance completely | Less suited to fantasy dungeon-crawling where stealth ambushes are a staple trope |

---

## 3. Five classic table flashpoints around Surprise and Ambush

Across **The Alexandrian** `[checked]`, **The Angry GM** `[lead]`, **Pathfinder 2e** `[read]`/`[lead]`, and **5e/4e** threads `[lead]`, almost every table argument about surprise comes from **five exact edge cases**:

### 3.1 The "Sucker Punch" / Attacking Mid-Conversation (`items-economy.md` already flags this!)
A player interrupts a parley with *"I shoot the baron mid-sentence!"* or *"I pretend to heal him and cast Fireball!"*
- **Why letting it skip Initiative breaks the game:** The Alexandrian `[checked]` and Reddit threads `[lead, r/DnD, r/Pathfinder2e]` agree that granting a free pre-Initiative attack rewards interrupting every villain speech and turns every social scene into *"whoever shouts 'I attack!' loudest goes first."*
- **The Alexandrian's four-scene distinction (`Standoffs & Surprise` `[checked]`):** Not all surprise is Stealth vs. Perception. Separate four distinct situations:
  1. **Ambush:** Attackers are unseen → Stealth vs. Perception / Senses.
  2. **The Long Knives (Betrayal during peaceful talk):** Everyone sees each other, *nobody expects violence* → Deception/Appeal vs. Insight/Instinct (your *Sudden Strike* Talent in `items-economy.md` L110 already mirrors this!).
  3. **Standoff:** Weapons are drawn and everyone is watching on a hair trigger → **nobody is Surprised**; whoever lunges first just triggers normal Initiative (the tension *is* who reacts fastest).
  4. **Duel:** Formal face-off → zero surprise, pure Initiative.
- **Nimble v2's crisp rulebook warning `[read]`:** *"Merely being hidden or punching first is not sufficient to gain Surprise! If an enemy is on guard or at all aware of your presence, they cannot be surprised."*

### 3.2 The "One Noisy Paladin Ruins the Ambush" (Group Stealth / Partial Ambush)
Under D&D 5e's strict rule — and **2d12's current draft wording** (`items-economy.md` L109: *"every enemy acting against it is Hidden or Unsensed to it"*) — if three PCs sneak brilliantly and one Heavy-Armor ally fails Stealth, **zero enemies are Surprised**.
- **Consequences in play `[lead]`:** Either the Rogue splits the party to solo-ambush (boring for the other 3 players), or Heavy-Armor players feel like a liability and nobody ever tries ambushes.
- **Four ways games solve it:**
  1. **Group / Majority Check or Lead Check** (5e group checks; 2d12's own Lead Check in `decided.md`; PF2e *Follow the Expert* `[read]` lets the Rogue guide the Paladin so the Paladin doesn't auto-fail).
  2. **Separate "Surprised" from "Hidden":** Even if the loud Paladin is spotted (so the goblins aren't Surprised by the Paladin), the **Hidden Archer and Rogue** still start combat **Hidden** and get their Hidden attack benefits against the goblins (`4e`, `PF2e` `[read]`).
  3. **Worst-modifier rolls once / Shared roll** (Forbidden Lands / Year Zero `[lead]` — fast, though still punishes the clanky tank unless helped).
  4. **Capped Ambushers (13th Age `[read]`):** Only 1–2 stealthy ambushers need to stay Hidden to fire the opening beat while the Heavy-Armor fighter waits behind cover to charge in on Round 1!

### 3.3 The "Door-Opening Ready" Exploit
Players listen at a closed dungeon door, know monsters are inside, and say *"We all Ready fireballs and arrows for when the Paladin kicks the door open!"* `[lead, r/DMAcademy]`.
- **Why it happens:** Players are trying to manufacture a free surprise round without rolling Stealth.
- **Standard fix across PF2e and 5e `[lead]`:** You cannot Ready combat actions outside combat; opening the door into an aware/noisy room simply triggers Initiative (or requires an actual Stealth ambush if the monsters don't hear the party stacking up at the door). **2d12's combat/out-of-combat wall already blocks this cleanly** — just state it in one line next to *"Starting a fight."*

### 3.4 The "Surprised Victim Wins Initiative" Paradox
In both **PF2e** `[read]`/`[lead]` and **D&D 2024** `[lead]`, when no turns are skipped and everyone rolls Initiative normally, the ambushed target can still roll higher than the ambusher.
- **Why players hate it:** The GM has to either tell the player *"you go first, but you don't know anyone is here, so walk casually into the ambush"* (feels ridiculous) or let them spend their turn Seeking / buffing / moving off the map (spoils the ambush).
- **How to prevent it completely:** Either (a) the ambushing side **automatically goes first** (Draw Steel `[read]`, 13th Age `[read]`), or (b) Surprised creatures don't take a full turn until the opening beat resolves (4e, Nimble's reduced Turn 1 AP).

### 3.5 The Symmetry Test: PC Ambush vs. Monster Ambush
One of the best rules-of-thumb from `r/Pathfinder2e` `[lead]`: **always test your Surprise rule when monsters use it against the PCs.**
- If an ambush gives 4 enemies `3 AP` + `1 Boon` each before any PC can act or use a Reaction, a Standard or Hard ambush will routinely **drop a PC to 0 Health before they ever touch their dice** — forcing GMs to secretly stop ambushing the party!
- A great tight-math Surprise rule feels **awesome when PCs execute it** AND **tense-but-survivable when monsters pull it on PCs**.

---

## 4. How it applies to 2d12 (observations — Lucas decides)

### 4.1 Audit of 2d12's current draft (`items-economy.md` Part 2 + `02-turns.md`)

2d12 has **three unique mechanics** that change how Surprise behaves compared to D&D/PF2e:
1. **Zipper Initiative (`02-turns.md` L15):** Normally, sides alternate 1 creature at a time — **preventing 4-vs-0 alpha strikes by design**.
2. **4 AP + 1R + Unspent AP → Guard (`02-turns.md` L48–56):** Unused AP left at turn's end becomes **Guard** (2/2/3/4 per AP) when you regain AP next turn.
3. **Start-of-Encounter Stack (`02-turns.md` L26) & Escalation (`expedition-loop.md`):** Abilities like Paladin's *Judge* fire before Turn 1; Escalation starts at `1 + Momentum` (with a **preparation bonus** of `+1 Escalation` when you scout/know what you're facing).

Stress-testing Lucas's current draft (*"no Escalation is gained; only creatures that aren't Surprised regain AP, 2 AP + 1R (or 3 AP and no 1R); a Boon against Surprised targets"*) surfaces **four specific things to watch**:

1. **`3 AP` across a whole party breaks Zipper safety; `2 AP` is much safer.**
   - At `1 AP ≈ 5.8 DE`, giving 4 ambushers **`3 AP` + `1 Boon`** is **12 AP of uncontested alpha strike** (~75% of a full 5e-2014 surprise round!), immediately followed by the fastest ambusher taking a `4 AP` turn if they win Initiative! If 4 Goblins do that to PCs, someone is likely Down before Turn 1.
   - **`2 AP` (no `1R`)** is much closer to D&D 4e's single-action surprise round: enough for **one 2 AP Attack/Spell**, or **Advance (1 AP) + 1 AP Strike**, or **two 1 AP shots** — punchy without wiping the fight.
2. **Watch the Unspent AP → Guard bleed (`02-turns.md` L52):**
   - If a Surprise Round exists, specify explicitly that **unspent Surprise AP does NOT convert to Guard** on Round 1 (otherwise melee ambushers out of range just bank 2–3 AP for free Guard 4–6!).
3. **Watch the Start-of-Encounter Stack (`02-turns.md` L26):**
   - Clarify that **Surprised creatures cannot trigger Start-of-Encounter abilities** (or that the stack resolves at the start of Round 1, after any surprise beat — and requires perceiving the target, so a Surprised Paladin can't *Judge* an Unsensed archer before the arrow flies).
4. **Watch the "Every Enemy Hidden" trap (`items-economy.md` L109):**
   - *"every enemy acting against it is Hidden or Unsensed to it"* lets one loud Heavy-Armor ally ruin Surprise for the whole group. Note: if *"acting against it"* is read literally so the Heavy-Armor ally can stay behind cover outside the opening beat (or if group ambush uses 2d12's **Lead Check** / **Group Stealth**), that fixes the trap cleanly!

### 4.2 Four concrete Surprise models tailored to 2d12

| Model | How it works in 2d12 | Preserves Zipper? | Solves "Victim Wins Init" Paradox? | Math / TPK safety | Complexity |
|---|---|---|---|---|---|
| **A. Tight Mini-Surprise Round** *(refined version of Lucas's draft)* | Round 0: no Escalation; Surprised creatures get **0 AP / 0R**; non-Surprised get **`2 AP` (no `1R`, no Guard carryover)** + `1 Boon` vs. Surprised. Start-of-Encounter stack waits for Round 1 (or only non-Surprised trigger in Round 0). | Broken for 2 AP/actor | **Yes** | **Good** at `2 AP` (swingy at `3 AP`) | Medium (adds a Round 0 with 3 edge-case clarifications) |
| **B. Zipper-Native "Surprised" (Draw Steel + Nimble hybrid)** | **No Round 0!** If *all* foes are Surprised, the ambushing side **automatically takes the first Zipper turn** (bypassing who-goes-first). On **Round 1**, every Surprised creature starts **Slowed 2 (`2 AP` instead of `4 AP`)**, gets **no `1R` until its Turn 1 ends**, and suffers **`1 Boon` on attacks against it** until its Turn 1 ends (or end of Round 1). | **Yes! 100% preserved** | **Yes** (ambusher always opens!) | **Best in class** — terrifying when monsters ambush PCs, yet never a 4-on-1 TPK! | **Lowest** (reuses existing `Slowed`, `Boon`, `0R`, Zipper; zero Guard-bleed or Round 0 stack bugs; handles partial surprise automatically!) |
| **C. Capped Opening Beat (13th Age model)** | Before Round 1, **at most 2 non-Surprised creatures** (the initiator + 1 ally) each take **`2 AP`** (with `1 Boon` vs. Surprised, no Escalation, no Guard bleed). Then normal Zipper Round 1 starts with Surprised creatures having `0R` until they act. | Mostly preserved (capped at 2) | **Yes** | **Very high** (fixed ceiling regardless of party/monster count!) | Low–Medium (solves the "noisy Paladin" problem too — only 2 PCs need to ambush!) |
| **D. Preparation / Escalation Bonus + Boon Only** | No extra round, no AP cut: ambushers auto-win first Zipper slot, gain **+1 Escalation** (your existing preparation bonus from `expedition-loop.md`!), and Surprised targets give `1 Boon` + have `0R` in Round 1. | **Yes** | **Yes** | **Safest** (almost impossible to break Bestiary math) | Lowest — though players used to D&D/BG3 might feel ambush deserves an AP edge (like Model B's `Slowed 2` or Model A's `2 AP`) |

### 4.3 Quick checklist for the final wording (whichever model Lucas picks)
1. **Explicitly block pre-Initiative sucker punches & door-Readying** (already strong in `items-economy.md` L108 — add one sentence blocking "Ready before opening the door").
2. **State how a mixed-Stealth party ambushes** (e.g., Group/Lead Stealth check, or unspotted attackers still begin **Hidden** even if a loud ally broke full Surprise).
3. **Clarify Start-of-Encounter triggers & Unspent-AP Guard** if using a Surprise Round.
4. **Tie cleanly into `expedition-loop.md`:** you already have **Alert 4–5 = *"you can't Surprise them"*** and **Preparation = `+1 Escalation`**, so distinguishing *Preparation* (you scouted them → `+1 Escalation`) from *Surprise* (they didn't perceive you when combat broke out → Model A/B/C/D) makes both rewards stack naturally without duplicating each other.

---

## 5. Sources

- `[read]` Draw Steel (MCDM, printing 1.01b), *Determine Surprise*: https://steelcompendium.io/v2/Browse/rule/combat/surprised/
- `[lead]` Draw Steel (MCDM, printing 1.01b), *Determine Who Goes First* (`Combat` chapter extract): https://steelcompendium.io/v2/Read/heroes/combat/
- `[read]` Nimble v2 (Nimble Nexus), *Initiative* & *Surprise*: https://nimble.nexus/rules/initiative and https://nimble.nexus/rules/surprise
- `[read]` 13th Age SRD, *Combat Rules — Ambushes and Surprise*: https://www.13thagesrd.com/combat-rules/
- `[read]` Pathfinder 2e (Archives of Nethys, Gamemastery Guide), *Initiative* & *Initiative and Stealth*: https://2e.aonprd.com/Rules.aspx?ID=813
- `[checked]` The Alexandrian (Justin Alexander), *Random GM Tip – Standoffs & Surprise* (2023-12-21): https://thealexandrian.net/wordpress/50409/roleplaying-games/random-gm-tip-standoffs-surprise
- `[lead]` The Angry GM, *Roll Initiative!* (2023-05-11, search extracts): https://theangrygm.com/roll-initiative/
- `[lead]` Tabletop Builds, *Rules Refresh: Hiding, Surprise, and More* (2022-03-17, search extracts): https://tabletopbuilds.com/hiding-surprise-and-more/
- `[lead]` Community reception & edge cases (Reddit blocks automated readers): `r/Pathfinder2e` ("Pf2e has no surprise rounds; how to run a monster ambush?", "Yet another surprise round question"), `r/DnD` & `r/DungeonsAndDragons` & `r/onednd` (D&D 2024 Disadvantage on Initiative reception and initiative paradox), `r/DMAcademy` (door-opening Ready exploits), `r/RPGdesign` (group stealth simplification), `r/LancerRPG` (no surprise round), `RPG.SE` (D&D 4e stealth/surprise).
- `[memory]` D&D 5e (2014) Surprised condition & *Pass Without Trace* alpha-strike meta; D&D 4e single-action surprise round.

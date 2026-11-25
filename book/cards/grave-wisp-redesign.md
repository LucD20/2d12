# The Grave Wisp: the first Grunt (the record)

> **Status (2026-11-25): IDEAS SHOWN at Grunt size, waiting for Lucas's review. Nothing is chosen. Design only: no card source, no Foundry (the Foundry pass comes once, when every NPC is done).** The Bestiary's record is `book/bestiary-design.md`; the first creature's, `orc-warrior-redesign.md`.

## Lucas's words (2026-11-25)

- "Push it to the work branch, then lets do the next NPC." Claude proposed the Grave Wisp as a second Standard (the creature that deals only Resolve damage against Ward Defense) and showed ideas at a Standard's size.
- **"Wait, lets do the grave wisp as a grunt."** So the wisp is the first Grunt, and the Grunt's defaults have to exist first: they are below, derived the way the Standard's were.
- **Nothing is copied from the old sheet** (no Chilling Touch, no Dread Whisper, no Daunted or Dazed rider, none of its ratings). "Flies" is left out: Flying isn't written (Chapter 3).

## The Default Grunt (Claude's derivation; his to change)

**A Grunt is half a Standard: CV 50, two of them for a PC** (G2: "weaker than a PC").

| | Default Standard | Default Grunt | Why |
|---|---|---|---|
| Health | 36 | **18** (9 / 9) | Half. About two landed PC Strikes (a landed Strike averages 10) |
| Defenses, Modifiers | 13 / 13, +2 / +2 | **the same** | A rank moves none (decision 12, P3) |
| Damage to Health a turn, at the table | about 8 | **about 4** | The same count (`ruler/fight-identity.mjs`): eight Grunts of 18 Health get about 12.4 turns in a normal fight; 51 ÷ 12.4 = 4.1 |
| On paper, moving / standing | 9 / 12 | **about 4½ / 6** | The same ratios |
| AP | 4 | **3** | Chapter 14's rule, kept (K7): a Grunt's turn is a move and two AP, which is how it deals half without hits too small to matter |
| Basic attack | 1d4! / 2 + 1d6! | **1d4 / 1d6** | Chapter 14's rule, kept: a Minor enemy's dice never explode. 2.4 a use; a move and two of them 4.4; three of them 6.2 |
| Special (2 AP, Round) | 7 / 11 on one, 5 / 8 on each of two | **about 5½ / 8½ on one, 2½ / 4½ on each of two** | 4.8 on one: a little more than the two Basic attacks it replaces (4.4) |

- **Eight Grunts make a longer fight than four Standards** (it ends in round 3.3, not 2.9): more bodies waste more of each PC turn. Grunts are for mixing in (two Orc Warriors and four wisps), not for a fight of their own.
- **A Grunt against a 3-tick Minion** (decision 7): the Grunt has Health, so it can be Bloodied or Strained, takes conditions, has its own turn and can have a Reaction; a big hit kills it at once and three small ones are needed otherwise. A Minion has ticks: any Tier 2 or 3 does the same to it whatever the damage. Grunts reward the heavy hitter, Minions the many attacks.
- **Open, small:** does a Grunt's Basic attack still get the Critical's 1d10! (Chapter 1 says an NPC's Basic attack does; "never explode" is about its own dice)? Assumed yes.

### How many cards on a Grunt's sheet (a choice for Lucas, three ways)

A fight has twice as many Grunts as it would Standards, so each should be lighter to run (the research counts the load by the encounter, not the creature).

- **A. The Standard's sheet** (two Basic attacks, a Special, a Reaction): the richest, the heaviest.
- **B. Its Basic attacks and one more card** (a Special or a Reaction), a Feature if wanted. *Claude's pick.*
- **C. One Basic attack and one more card.**

## Its numbers (Claude's proposal)

- **Health 18: Vigor 6, Resolve 12** (6 is the floor, a third). Any weapon hit Bloodies it; it is hard to Strain.
- **Speed 6**, paid for by Vigor 6: Bloodied takes 2 of it.
- **Mind +1, Instinct +1, Appeal 0, Body -1.** Defenses 13 / 13. Power +2, Weapon +2. 3 AP and the Reaction Point.
- **Every attack is a [Power] Action against Ward Defense and deals [R].** A PC's Resolve is usually its low threshold, so the wisps are what makes a PC Strained.

## The ideas, at Grunt size

### The melee Basic attack (1 AP, At-will; [Power, Melee, Strike]; Reach (1); one creature; Power vs. Ward Defense)

**M1. Hollow Touch** (the plain one). *The light brushes you, and something you were sure of is gone.*
- Tier 2: [R] 1d4 Co. Tier 3: [R] 1d6 Co.

**M2. Slipping Touch** (something on a Tier 1). *It reaches for you and is already somewhere else.*
- Tier 1: the wisp Evades 1. Tier 2: [R] 1d4 Co. Tier 3: [R] 1d6 Co.
- A miss still moves it out of reach: hard to pin without being hard to hit. Free [judgment].

**M3. Unsteadying Touch.** *Your hands forget, for a moment, what they were about to do.*
- Tier 2: [R] 1d4 Co. Tier 3: [R] 1d6 Co; Staggered (EoT).
- No Reactions until the end of your turn. With Strained it is the same theme twice: the wisps take your Reactions.

### The ranged Basic attack (1 AP, At-will; [Power, Ranged, Strike]; 6 sq.; one creature; Power vs. Ward Defense)

**R1. Cold Gleam** (the plain one). *A thread of pale light crosses the room and finds you.*
- Tier 2: [R] 1d4 Ps. Tier 3: [R] 1d4 Ps (no rider: the range is its worth).

**R2. Beckoning Light.** *It bobs just out of reach, and you cannot look anywhere else.*
- Tier 2: [R] 1d4 Ps. Tier 3: [R] 1d4 Ps; Taunted by the wisp (1 round).
- The will-o'-the-wisp: your Actions against anyone else take 1 Bane. It pulls a PC's attention off the orcs, onto a creature worth half as much.

**R3. Guttering Glance.** *The light goes out behind your eyes.*
- Tier 2: [R] 1d4 Ps. Tier 3: [R] 1d4 Ps; Half-Blinded (EoT).
- It hurts a shooter most. The Senses rules are the heaviest in the book to run, and there would be several wisps.

### The Special (2 AP, Round)

**S1. Pass Through.** [Power, Move, Strike]; up to two creatures; Power vs. Ward Defense. *It drifts straight through you, and the cold stays.*
- Setup: the wisp moves up to its Speed in a straight line. This movement can pass through creatures' spaces (it can't end in one). The targets are creatures whose space it passed through.
- Tier 2: [R] 1d4 Co. Tier 3: [R] 1 + 1d6 Co.
- Its signature and its answer to the back line (D8). 2.4 a creature, 4.7 on two, with its move inside. For a 3 AP creature it is nearly the whole turn: through the line, then one touch.

**S2. Unravel.** [Power, Melee, Strike]; Reach (1); one creature; Power vs. Ward Defense. *It pours into you, looking for the thread that holds you together.*
- Tier 2: [R] 2 + 1d6 Ps. Tier 3: [R] 4 + 1d8 Ps.
- **Strained** (after the Tiers): if this makes the target Strained, the target is Staggered (EoT).
- The heavy hit, 4.8 a use. (At a Standard's size the line gave Slowed 1; too much for a Grunt.)

**S3. Lead Astray.** [Power, Ranged, Strike]; 6 sq.; one creature; Power vs. Ward Defense. *You take three steps toward the light before you know you are walking.*
- Tier 2: [R] 1d4 Ps; Slid 2. Tier 3: [R] 1d6 Ps; Slid 3.
- The lure as Forced Movement: the wisp chooses the path, into the orcs' reach, out of Cover, against a wall. It does the most with allies around it.

### The Reaction (1R)

**X1. Wink Out** (Round). *Your blade passes through where it was.*
- Trigger: the target gets a Tier 1 on a [Strike] Action against the wisp. Target: the triggering creature. Effect: the wisp Evades 2.
- With M2 it would be too slippery: one of the two.

**X2. Feed on the Frayed** (Round). *It brightens as you falter.*
- Trigger: the target, within 5 squares of the wisp, becomes Strained. Target: the triggering creature. Effect: the wisp gains Guard 1d6.
- A visible change the players cause, once a PC. With several wisps, each one near brightens.

**X3. Dying Flare** (Encounter). *It goes out the way a lamp does when it is dropped.*
- Interrupt: the wisp would go Down. Area: 1 Emanation. All creatures in the Area. Instinct Save against its Power DC (13).
- Tier 1: [R] 1d4 Ps; Half-Blinded (EoT). Tier 2: [R] 1d4 Ps. Tier 3: no effect. Then the wisp goes Down.
- "Don't be next to it when it dies": Grunts die often, so this would be seen every fight. It hits the orcs beside it too.

### Features (optional)

**F1. Drifting.** The wisp's own movement can pass through creatures' spaces (it can't end in one). Only if the Special isn't Pass Through.

**F2. Weak 3 Holy.** A weakness to find; with 18 Health, 3 more is a lot: it rewards a Paladin without needing one.

**F3. No Feature.**

## Claude's pick (not decided)

**Sheet B. Hollow Touch (M1), Beckoning Light (R2), Pass Through (S1); no Reaction, no Feature.**

- One thing of its own: it goes through the front line. Three cards, because there will be several wisps.
- Its turn (3 AP): Pass Through and a touch. On paper 4.7 when it passes one creature, 7.1 when it passes two; three touches, 6.2. The Default Grunt wants about 4½ moving and 6 standing.
- With the Orc Warrior: two orcs and four wisps is a normal fight for four PCs. The orcs hold the front and howl; the wisps cross to the back and make the PCs Strained.

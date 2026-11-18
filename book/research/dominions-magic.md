# Dominions 6: the magic system, and what 2d12 could take from it

**Date:** 2026-11-18. **Asked by Lucas:** "I want to start to brainstorm magic. [...] I want to try something bold before simplifying. Dominions 6 has many interesting magical mechanics. [...] it is a video game so it won't work like it, but we can likely steal mechanics from here." Small to medium research: Dominions' mechanics, then each compared with 2d12 (does it fit, how well).

**What was read.**
- **[read]** The Dominions 6 manual, the Magic chapter in full (printed pages 73 to 82: paths, schools, combined paths, Empowerment, indirect magic, battle magic, interrupts, penetration, fatigue, rituals, global enchantments, dispel, communions, gems, research, items, divine magic, alchemy) and the key of the spell tables in the appendix.
- **[checked, through a summarizing reader]** Ten illwiki pages: magic, fatigue, communion, magic-resistance, blood-magic, bless, gems, evocation, afflictions. The tool returns a summary of the opened page, not the page: a number that is only in the wiki is marked (wiki). Two numbers differ between the two sources and are given as the manual's: a Sabbath slave's extra fatigue (manual 20%, wiki 25%) and "resists easily" (the manual: -4 to the penetration roll; the wiki: base penetration 7, the same thing).
- **Not read:** the spell lists themselves (hundreds of spells), the forums, players' opinions. This note is the rules, not their reception.

**These are Dominions' rules, not 2d12's. Nothing here is decided.** The fit ratings are Claude's.

**Read with (added 2026-11-18, the same day):** `dominions-paths.md` (the ten Paths in depth, every battle spell read) and `dominions-rules.md` (the rules around the magic). They correct this note in three places: the Sabbath slave's extra fatigue is 25% on the wiki (the manual's 20% is given below); a spell's School research level is the nation's, but every spell does carry both numbers (Fireball: Fire 2, Evocation 3), so row 20's "two lookups for one card" undersold the second axis, which Lucas has since chosen; and Holy has no healing at all.

---

## 1. What Dominions' magic is, in one page

Dominions is a strategy game whose battles play themselves from orders: a mage is a piece with numbers, not a player. Its magic is built from eight parts.

1. **Paths, with levels.** Nine paths (Fire, Air, Water, Earth; Astral, Death, Nature, Glamour; Blood) and Holy for priests. A mage has a level in a few of them: "Fire 2, Air 1". A level is rare and almost fixed: mages are born with them.
2. **A spell asks for a minimum.** "Fireball: Fire 2." Some ask for two paths ("Fire 2, Air 1"): you need both, and **only the first one listed counts** for every bonus.
3. **Being above the minimum pays three times** (the wiki calls the excess **overcast**):
   - **cost:** the spell's fatigue is divided by (1 + excess levels): one level above, half; two above, a third;
   - **strength against resistance:** +1 penetration for every 2 excess levels;
   - **the spell's own growth:** a "+" on a number in the spell's line means it grows with the caster's level in the path, and each spell grows a different number. Fireball: range and damage. Falling Fires: the area. Fire Darts, Flying Shards: the number of projectiles (wiki).
4. **Fatigue is the cost.** No slots, no mana. Every spell adds its fatigue to the caster (5 to 400; an ordinary battle spell 10 to 40, a strong one 100). Fatigue is the same number a soldier builds by swinging a sword. Every 10 points: -1 defence. 50 or more: armor-defeating hits against you are three times as likely. **100: unconscious.** Above 200: the excess becomes real damage. You recover 1 a round, 5 while unconscious. **Armor adds fatigue to every spell**, and skill doesn't reduce that part.
5. **Gems are the second cost.** A consumable of one path. In battle, one gem gives **+1 level in its path for one spell** (never more than +1, and never in a path you have no level in): it lets you reach a spell one level above you, or halves a spell's fatigue. You can burn at most as many gems a round as your level. **A spell of 100 fatigue or more needs a gem to be cast at all**, one per full 100.
6. **Resistance is a contest.** Caster: 11 + roll + half the excess. Target: Magic Resistance (10 for a human, 13 to 18 for mages) + roll **+ half its own level in the spell's path**. "Easily resisted" and "hard to resist" are -4 and +4. Most spells are all or nothing; some are halved when resisted; some have a second effect with its own roll (wiki).
7. **A spell takes time, and can be broken.** Half the casting time is preparation, half recovery. Damage during the preparation can interrupt: the chance is the share of the caster's hit points the blow took, plus 25%. A "combat caster" (the manual's example: a paladin) is interrupted half as often; a monster that casts innately, never.
8. **Things that stay.** A **battlefield enchantment** covers the whole fight and **ends when its caster dies**. A **ritual** is cast outside battle: a month, a laboratory, gems. A **global enchantment** is a ritual on the whole world: only a few slots exist (5 by default), and a new one must beat an old one in a contest where **every extra gem spent is +1 and every excess level +5**.

And three special families:

- **Communion** (Astral; Blood's is the Sabbath). Mages link: **masters** cast, **slaves** do nothing else. A master gains **+1 level in all its paths with 2 slaves, +2 with 4, +3 with 8**. A spell's fatigue is split evenly among the master and the slaves; a slave weaker than the master takes double or four times its share. A master's spell on itself also lands on every slave. If the masters die, the slaves are stunned a round and take heavy fatigue. Slaves pushed past 200 fatigue take damage: a communion can kill its own slaves.
- **Blood.** No gems: its fuel is **blood slaves**, people hunted in your own provinces (which causes unrest), who stand on the battlefield and can be killed before they are used. Its spells drain (Leech: the damage dealt removes your fatigue), bind demons, and some leave a **horror mark** on the caster: each mark makes it likelier that a horror comes for them, for the rest of the game.
- **Holy.** Needs no research, no gems, almost no fatigue: a priest's level is all. The **bless** is built once, at the creation of the god, from the god's path levels, and priests put it on the nation's sacred troops in battle. The god's strongest path (level 4 or more) **replaces the priests' Smite and Banishment** with that path's version (a Fire god: Heavenly Fire, which also burns).

Smaller pieces: **indirect magic** (a level in a path gives passive perks: Fire 3, fire resistance; Earth 3, natural protection; Astral 4, +1 Magic Resistance; Glamour 4, true sight); **path boosters** (items that give +1 to a path, only if you already have 1); **Empowerment** (buy a level with gems: 50 for the first, 15 × the new level after); the **Magic and Drain scales** (land where spells cost 10% less or more fatigue a point, and are easier or harder to resist); **afflictions** that break a caster (Mute: your paths are halved; Feebleminded: no casting, and every enchantment you hold ends); **two axes**: the path says who can cast, the **school** (Evocation, Conjuration...) is what the nation has researched.

---

## 2. What 2d12 has today that magic must plug into

- **The decisions of 2026-10-29** (rules-backlog, "PROGRESSION AND MAGIC"; nothing applied): spells are Power Actions with a [Spell] trait, named, on lists, open through Talents; **"no [P] die and no new casting mechanic"**; each spell has an **Overcast** line; theme chains keyed on traits (Fire Adept → Pyromancer → Wildfire); "spells must not feel bad"; the caster's round 1 at least 90% of the weapon user's. Pack R then changed its base: **nothing spends Escalation** now, and Overcast was noted as "the ladder" (1 / 2 / 3 by Stage). **Lucas's "something bold before simplifying" reopens "no new casting mechanic"**: this note is written as if it were open.
- **The Health Pool is one pool with two thresholds**, Vigor and Resolve; a class gives a high and a low value and the player assigns them. Damage is [V] or [R], Lethal or Nonlethal. **Strained** (Resolve damage ≥ Resolve) and **Bloodied** do nothing by themselves: features use them. Down with half the pool in Nonlethal damage = Unconscious; otherwise Dying or Shattered by the dominant damage, and a Wound from a table whose entries are placeholders.
- **Exhausted N** already exists: -N to rolls and Speed, Resolve lowered by 4 × N; Sleep removes 2.
- **AP:** 4 + 1 Reaction AP; unspent AP become Guard. **Escalation** 1 to 6, rising a round, never spent. **Frequency:** At-will, Turn, Round, Encounter, Daily. Fights last 2.5 to 5 rounds.
- **The Power Modifier** (+1 to +4, never more) rolls Power Actions and sets **Ward Defense** (11 + Power Modifier + Ward value). Saves and DCs exist; Boons and Banes; three Tiers.
- **Traits waiting for rules:** **Focus** ("these Actions require concentration. This is not a mechanic by itself"); creature **Tags** (Profane; the list not written); **Disrupted** Actions and Interrupt Reactions exist; Setup lines exist.
- **Not written:** Skills (D3, planned before Magic: "spells may use skills"), Talents (set aside), the Wound tables, items and their economy.
- **No research file covers** a health cost for abilities, concentration or casting time (searched 2026-11-18).

---

## 3. Mechanic by mechanic: does it fit?

Every mechanic found is listed, the ones Claude would leave included. **Fit:** High / Medium / Low. Nothing is priced: the SIM has no caster.

| # | Dominions' mechanic | What it would be in 2d12 | Fit |
|---|---|---|---|
| 1 | **Fatigue as the cost** (no slots, no mana; unconscious at 100, damage past 200) | **A spell costs Resolve damage to its caster** ("Strain"). See 4.1. | **High, and the bold one** |
| 2 | **Path levels and a spell's minimum** | A path is a trait ([Fire]); your level in it (1 to 3) is the Talent chain already planned (Adept → Pyromancer → Wildfire); a spell writes "Fire 2". | High |
| 3 | **Overcast: excess level makes the spell cheaper** | "For each level above the spell's minimum, it costs 1 less Strain (minimum 1)" or halves. The 2d12 word Overcast already exists and is free again since nothing spends Escalation. | High |
| 4 | **Overcast: each spell grows a different number ("+")** | The spell's Overcast line names the one thing that grows a level: one more dart, a bigger Burst, a longer range. Never the roll. | High |
| 5 | **Overcast: + penetration** | A bonus to the roll or the DC by level. Against "no number bloat" (Modifiers stop at +4). | Low: leave |
| 6 | **Gems** (consumable; +1 level for one spell, at most +1; a limit a round; the biggest spells need one) | The treasure a caster wants: a gem of a path is spent for +1 level on one spell; **a Daily-size spell needs a gem**, so the Daily frequency becomes "as many as you have gems". See 4.3. | Medium to High |
| 7 | **Communion** (masters and slaves; +levels by the number of slaves; the cost shared) | For PCs: a Reaction to carry part of an ally's Strain and raise the spell a level. For NPCs: a boss fed by chanting acolytes. See 4.2. | High for NPCs, Medium for PCs |
| 8 | **A master's spell on itself reaches its slaves** | "While linked, a [Self] spell of the caster also targets the linked creatures." One sentence, a clear reason to link. | Medium |
| 9 | **Casting time, and damage interrupts it** | The rule the **Focus** trait is waiting for; and a second Version of a big spell that resolves at the start of your next turn unless you are broken. See 4.4. | High |
| 10 | **Combat caster** (interrupted half as often) and **innate casters** (never) | A class feature (a Paladin holds Focus better) and an NPC line ("its spells can't be disrupted"). | High, small |
| 11 | **Resistance as an opposed roll** | 2d12 never opposes rolls: Ward Defense and Saves do this. Even the base is the same 11. | Already there |
| 12 | **Easily resisted / hard to resist** (-4 / +4) | A Boon or a Bane written on the spell's roll or Save. | Already there |
| 13 | **Knowing a path protects you from it** (+half your level to resist) | "You gain 1 Boon on Saves against [Fire] spells if you have Fire 2", or Resist Fire equal to your level. | Medium |
| 14 | **Resisted = halved, or a second effect with its own roll** | The three Tiers already do this (Tier 2). A second roll for a rider is against one roll, one result. | Already there / leave the second roll |
| 15 | **Battlefield enchantment: lasts while its caster stands** | A duration 2d12 doesn't have yet and that needs no counting: **"until you go Down or cast another [Enchantment]"**. One at a time for each caster. | High |
| 16 | **Few slots for the biggest spells; a new one must beat an old one** | "A fight holds one battlefield-wide enchantment a side; a new one contests it (Power roll against the holder's Power DC, + 1 Boon a gem spent)". | Medium, later |
| 17 | **Dispel as a contest of what each side invested** | The same contest as an Action: the investment (gems, level) is written on the enchantment, so nobody argues. | Medium, later |
| 18 | **Rituals** (outside battle: time, a place, gems) | The out-of-combat half of magic. Depends on Skills (D3) and on items. The clean split "battle spell / ritual" is worth taking as vocabulary now. | High as a frame; parked |
| 19 | **Two-path spells; only the first path counts for bonuses** | A spell with two path traits needs both levels; "its first path is the one Overcast reads". Removes a question before it is asked. | Medium |
| 20 | **Schools × paths** (two axes) | A second sorting of every spell (Evocation, Conjuration...). Two lookups for one card. The class's list already plays the school's part ("a Wizard knows many"). | Low: leave |
| 21 | **Blood: fuel that is alive** (slaves on the field) | Hirelings as fuel: rejected for tone and for the table. | Low: leave |
| 22 | **Blood: pay with the body** (the idea under it) | **The same cost, in Vigor damage**: a blood caster's Strain is [V]. With "assign your high value to Vigor or Resolve", it is a build choice that already exists. See 4.1. | High |
| 23 | **Drain** (damage dealt removes your fatigue) | "You heal Strain equal to half the damage dealt": the caster who must hit to keep casting. One spell or one path, not a rule. | Medium |
| 24 | **Horror marks** (forbidden spells mark you, for good) | A campaign clock on a caster; could feed the Shattered table or the Profane Tag. Needs the GM side written. | Medium, later |
| 25 | **Holy: no fatigue, no gems, level only** | Divine spells cost no Strain and have a Frequency instead (as the Paladin's cards do now): the two families then *feel* different with no new rule. | High |
| 26 | **The bless, built once from the god's paths** | A Divine caster builds one Blessing from picks. The Art with three Modes is nearly this already. Needs deities. | Medium, later |
| 27 | **The god's path changes Smite and Banishment** | A deity's domain adds one rider to the Paladin's Smite (Fire: Lingering Fi). `divine-profane.md` already warns that an undead-only Banishment is a type gate that fails; the domain rider isn't one. | Medium, later |
| 28 | **Indirect magic** (passives from a path level) | Each level of a chain carries one passive (Fire 2: Resist Fire; Glamour 3: you see through illusions). | High, small |
| 29 | **Path boosters need level 1; a gem never gives a path** | A principle for all magic gear: **an item amplifies a path you have, it never gives one.** Stops gear from making everyone a caster. | High |
| 30 | **Empowerment** (buy a level with gems) | A path level bought with treasure instead of a Talent. Lucas's hoarding fear (the Talent-points note) applies. | Low to Medium |
| 31 | **Armor makes every spell cost more** | "In armor heavier than Light, each spell costs +1 Strain", or only in armor you aren't trained in. Classic, clear, and it gives Armor Training a second job. | Medium |
| 32 | **Magic and Drain scales** (land where magic is cheap or dear) | A terrain for casters, as Light is for archers: "Charged ground: spells cast from it cost 1 less Strain", "Drained ground: 1 more". | Medium |
| 33 | **Fatigue hurts your defence as it climbs** (-1 a 10 points) | A sliding penalty: bookkeeping every spell. The threshold (Strained) is the 2d12 way: one line, crossed once. | Low: use Strained instead |
| 34 | **Fatigue attacks** (spells that tire the enemy's mages) | It comes free with 4.1: any [R] damage on a caster eats their casting. Enemies with [R] attacks become caster-hunters without a rule. | High, free |
| 35 | **Afflictions that break a caster** (Mute, Feebleminded) | Entries for the Shattered table, which is all placeholders: "your path levels count 1 lower until healed", "your enchantments end". | Medium |
| 36 | **Precision; area spells that deviate** | A scatter roll and a placement argument. Against "the least ambiguity possible". | Low: leave |
| 37 | **Armor-piercing and armor-negating spells; elemental resistance** | Armor Defense or Ward Defense as the Vs., and Resist / Weak by subtype. | Already there |
| 38 | **Summons** (most of Conjuration; last the battle) | Extra bodies and turns at a table. Minions (3 AP) exist. Its own topic, not researched here. | Open |
| 39 | **Research** (a nation unlocks spell levels over months) | Downtime learning of spells; the Wizard's "knows many". Depends on Skills and downtime. | Low now |
| 40 | **Legendary spells** (at the top level, you choose one) | The Apex already is this: one big Encounter Action chosen at level 4. | Already there |
| 41 | **Alchemy** (2 gems of one path → 1 of another) | Only if gems exist: a fixed, lossy exchange keeps a "wrong" gem worth something. | Medium, with 6 |
| 42 | **Unique artifacts** | Items; out of scope. | Not now |

---

## 4. The four worth a real discussion

### 4.1 Strain: a spell costs Resolve damage (from fatigue)

**Dominions:** the spell tires the caster; skill makes it cheaper; too far and you faint; much too far and it hurts you.

**The 2d12 shape.** A spell writes a **Strain** number. Casting it deals that much **Nonlethal Resolve damage** to you. That is all the new rule; everything else is already in Chapter 4:

- **The caster's "mana" is their Resolve**, which every character already has and already tracks. No new pool, no slots.
- **Strained is the tipping point for free.** It does nothing by itself, so magic can use it both ways: "while Strained, your spells cost 1 more" (the wall) or "while Strained, your [Fire] spells deal +1d6" (the sorcerer who burns brighter near the edge). Dominions only has the wall; 2d12 could have both, by path or by class.
- **Fainting is already written.** Go Down with half your pool in Nonlethal damage and you fall Unconscious instead of Dying or Shattered: Dominions' "100 fatigue = unconscious" with no new text. A caster who wants to push past safely can't: taking the Bane to make it Lethal has no meaning for a cost, so a "burn yourself" option would be a Talent ("your Strain can be Lethal: the spell gains ...").
- **Enemies can attack your casting** (row 34): Resolve damage from a fear or a psychic attack is casting you no longer have. A frightening monster is a caster's predator, and the Paladin protecting the mage has a reason.
- **Blood magic is the mirror** (row 22): its Strain is Vigor damage. The player's existing choice (high value on Vigor or on Resolve) becomes "which kind of caster can I afford to be".
- **Overcast** (row 3): each path level above the spell's minimum lowers its Strain. A master casts the apprentice's spell almost free: mastery without a bigger number on the roll.
- **Healing is Dominions' Reinvigoration:** a Rally Point removes a quarter of your pool in damage of your choice. Steel Yourself becomes the caster's "catch my breath".

**What must be decided before it works** (each one a real rule, none decided):
1. **Does Guard absorb Strain?** As written, Guard takes any damage first, so unspent AP would pay for spells. Probably "Strain is a cost: nothing reduces or absorbs it".
2. **Does Strain stay after the fight?** If it stays, casters eat the party's Rally Points and the day ends when the mage is tired (a real attrition game, Dominions' long battle). If "Strain ends with the encounter", it is a per-fight budget and much gentler. A middle: half of it ends.
3. **How big?** At level 1 a Health Pool is about 30, a low Resolve 10 to 12, a high one 19 to 20. A fight is 3.5 rounds and about 14 AP. If a 2 AP spell costs 2 to 3 Strain, a Resolve-high caster casts five or six before Strained, a Resolve-low dabbler two or three. That would be the first thing to put in the SIM.
4. **Does every spell cost Strain?** Decision 13 of 2026-10-29 says a spell must not feel bad and the caster's round 1 must reach 90% of a weapon user's. A way through: **cantrip-size spells cost 0** (the caster always has a turn), Strain is for the spells above them.
5. **It makes the caster the easiest PC to drop.** Their own cost fills the same pool the enemy fills. That is the bold part and the risk: it has to be played, not argued.

**Against it.** "Paying hit points to act" is a known feel-bad when it is the only way to do your job; it reads better as fuel for the strong spells than as a tax on all of them. Nothing in `book/research/` covers how other tabletop games fared with a health cost (not searched for this note: it would be the next search if Lucas likes the direction).

### 4.2 Communion: casters linked

**For NPCs it is an encounter in a box.** A cult leader with four chanting acolytes: while 2 stand linked, the leader's spells are a level higher; while 4, two levels. The acolytes take the Strain and do nothing else. Kill the acolytes and the leader weakens at once; kill the leader and the acolytes are Dazed (the backlash). Every number is visible on the map (count the acolytes), which suits "the least ambiguity". The 2 / 4 / 8 ladder is steep on purpose: the third level needs a crowd.

**For PCs,** a slave who does nothing is a player who does nothing. The part worth keeping is the trade: **"Lend Power" as a Reaction** (1 Reaction AP, an ally within 5 casts a spell: you take half its Strain, the spell is cast one level higher). It gives the non-caster's Resolve a use, makes two casters more than two casters, and costs the helper their Reaction for the round, which in 2d12 is a real price. Row 8 (a [Self] spell also reaches the linked) would be its second line.

### 4.3 Gems: a second, consumable cost

One gem of a path = +1 level in that path for one spell (never +2, never in a path you don't have), at most your level in gems a round, and the biggest spells need one to be cast. In 2d12:

- It is **loot with a use the moment it is found**, for one kind of character: the items-and-economy work (`items-economy.md`) has nothing for casters yet.
- It could **replace the Daily frequency for spells**: instead of "once a Sleep", "needs a Fire gem". Then the GM's hand sets how often the big spells come out, and a party can save them for the fight that matters. The same lever is a risk: a GM who gives none has switched the class's top off, and a player who hoards twenty novas a boss. Dominions' two limits answer the second (at most +1 a spell; at most your level a round).
- **Typed by path** keeps it unambiguous (a Fire gem does one thing) and makes row 41 (a lossy exchange) useful.
- The principle of row 29 comes with it: **an item amplifies a path, never gives one.**

### 4.4 Casting time and Focus

2d12 has the Focus trait with no rule, Interrupt Reactions and Disrupted Actions with rules, and no spell that takes time. Dominions gives both halves:

- **Holding a spell (Focus).** "When you take damage while you hold a [Focus] spell, make a Mind Save (DC 11 + ... ) or it ends": Dominions scales the chance with the size of the hit (a quarter, plus the share of your hit points). In 2d12 the cheap version is a threshold: **"it ends if one Action deals you damage equal to or above X"** (X by Stage, as Guard is), no roll, no argument. A class that holds Focus better (row 10) raises X.
- **A spell that takes time.** A big spell's second Version: pay the AP now, it resolves **at the start of your next turn**, and it is disrupted if you lose Focus before then. The whole table sees it coming, the enemy gets one round to stop it, the Paladin gets one round where protecting the mage is the entire fight. `conditions-and-senses.md` (losing a turn) is the warning: the instant Version must exist beside it, so a disrupted channel is a gamble the player chose, never a turn the game took.

---

## 5. A first shape, only to argue with

If the bold version were assembled from the High rows only:

1. A spell is a Power Action with a **path trait and a minimum level** ("Fire 2") and a **Strain** number.
2. Casting deals its Strain to you as Nonlethal Resolve damage (Vigor for a Blood path). Nothing absorbs it.
3. Your **level in a path** (1 to 3, from the Talent chain) above the minimum lowers the Strain and feeds the spell's **Overcast** line, which grows one named thing. Each level also carries one passive.
4. **Divine spells** cost no Strain: they keep Frequencies.
5. **[Focus]** has a rule (a damage threshold breaks it); an **[Enchantment]** lasts until you go Down or cast another.
6. A **gem** gives +1 level for one spell; the largest spells need one.
7. Casters can **link** (a Reaction for PCs; acolytes for NPCs).

What it deliberately leaves out: schools, penetration bonuses, the sliding fatigue penalty, scatter, opposed rolls, living fuel.

**How it fits Lucas's four words.** *Tactical:* the caster's cost is on the map (their health), and so are the acolytes, the channel and the enchantment's owner. *Least ambiguity:* every piece reuses a rule that exists (damage, Strained, Unconscious, Disrupted, traits) and adds six sentences; the open points in 4.1 are exactly where a table would argue, so they must be written first. *Fun, engaging:* unproven: the feel of paying health is the thing to playtest.

---

## 6. Sources

- Dominions 6 manual (Illwinter), Magic chapter, printed pages 73 to 82, and the appendix's spell-table key: https://www.illwinter.com/dom6/dom6manual.pdf [read]
- illwiki (through a summarizing reader) [checked]: https://illwiki.com/magic , /fatigue , /communion , /magic-resistance , /blood-magic , /bless , /gems , /evocation , /afflictions
- Not opened: the wiki's pages for each school but Evocation, /empowerment, /research, /divine-magic, /combat-caster, /scales, /magic-sites; the spell lists. Evocation's last 6,000 characters were not read.

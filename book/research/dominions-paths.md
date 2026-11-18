# Dominions 6: the ten Paths in depth

**Date:** 2026-11-18. **Asked by Lucas:** in the Magic brainstorm (Paths + Schools), Claude had drafted each Path's sentence, rider and borders from a thin first pass. Lucas: "do the proper pass on the Paths first. Very thorough, in-depth, and extensive, really save everything you deem important for this task. You should even see adjacent rules as long as they seem important for my system."

**What was read, and how far to trust it.**
- **[read]** by Claude, as the pages' own text (downloaded raw and converted, not summarized by a tool): the wiki's (illwiki.com) ten Path pages in full (Fire, Air, Water, Earth, Astral, Death, Nature, Glamour, Blood, Holy); **every battle spell** of every Path on the wiki's School pages (Evocation, Alteration, Enchantment, Conjuration, Thaumaturgy, Blood Magic, Divine Magic), with requirements and stats; the names and requirements of every ritual; the bless page; the Smite and Banishment replacement tables; the spell-table notation page; and the adjacent pages listed in `dominions-rules.md`. The manual's Magic chapter was read in full earlier (`dominions-magic.md`).
- **Counts are by script** over the wiki's spell tables: 852 spell entries parsed, 832 with a Path (485 battle spells, the rest rituals and world enchantments). A count can be off by a few (a table row misread, a national spell included); the shapes are solid. The facts of every spell are saved in `raw/2026-11-18-dominions-spells.tsv` (name, School, research level, Paths, battle or ritual, stats).
- **The wiki is a fan wiki**, written with jokes and marked FIXME in a few places. Its numbers come from the game and its mod inspector; its sentences about a Path's character are a fan's reading. Where a sentence below is the wiki's opinion it says so.
- **Not read:** what each ritual does in detail (names and requirements only), the nations, the items, players' strategy guides.

**These are Dominions' rules, not 2d12's. Nothing here is decided.** Lines marked **For 2d12** are Claude's.

**Corrections to what Claude said before this pass** (messages of 2026-11-18 and the draft in rules-backlog.md):
1. "Astral owns the mind, Glamour only the senses" was wrong. **Glamour is the largest mind Path** (sleep, stun, confusion, charm, despair, luck: 20 battle Thaumaturgies); Astral owns the will and the soul (psychic damage, paralysis, enslaving, soul-slaying) and fate.
2. "Fire makes light; Glamour makes darkness and blinds" was half wrong. **Light is Astral's** (with Fire for the sun); **darkness is Death's** (with Glamour's twilight); **blinding is Fire's and Glamour's**.
3. "Holy heals on its own list" has no base in Dominions: **its priests have no healing spell at all.** Healing is Nature's, with Astral second and Blood for itself.
4. The Sabbath slave's extra fatigue is 25% on the wiki (20% in the manual).
5. Glamour is **new in Dominions 6**: its spells were split among Air, Astral and Nature before. Blood was a Sorcery before and is now set apart.

---

## 1. The shape of the whole

**Three families.** The four **Elements** (Fire, Air, Water, Earth), the four **Sorceries** (Astral, Death, Nature, Glamour), and two set apart with their own School each: **Blood** (Blood Magic) and **Holy** (Divine Magic, never researched).

**How the Sorceries are placed against each other** (the wiki's reading, [read]): Astral is above our reality, Nature within it, Death beneath it, Glamour beside it (the "Dreamwild", what exists only when perceived). Death mirrors Nature (death and life) and conflicts with Astral (darkness and light). Astral is "real and true whether or not we perceive it", Glamour is not.

**How the Elements are placed:** each is easy or hard in a School. The wiki: Fire is "the easiest to Evoke and the hardest to Alter"; Air "fairly easy to Evoke"; Water "not particularly easy to Evoke, but fairly easy to Alter"; Earth "among the toughest to Evoke, but one of the easiest to Alter". The four humours give each Element a side in the mind: Fire choleric (rage), Air sanguine, Water phlegmatic (calm), Earth melancholic (will). At level 5 each Element has a ritual that dispels its opposite: **Fire against Water, Air against Earth.**

### 1.1 Battle spells by Path and School (first Path only)

| Path | Evocation | Alteration | Enchantment | Conjuration | Thaumaturgy | Total |
|---|---|---|---|---|---|---|
| Fire | **15** | 14 | 9 | 6 | 7 | 51 |
| Air | 10 | 13 | **19** | 5 | 1 | 48 |
| Water | 16 | **21** | 11 | 6 | 5 | 59 |
| Earth | 9 | **27** | 10 | 4 | 2 | 52 |
| Astral | 11 | 9 | 10 | 2 | **12** | 44 |
| Death | 10 | **13** | 8 | 4 | 9 | 44 |
| Nature | 9 | **28** | 22 | 7 | 13 | 79 |
| Glamour | 14 | 12 | 14 | 5 | **20** | 65 |
| All | 94 | 137 | 103 | 39 | 69 | 442 |

Blood has 30 battle spells in its own School, Holy 10.

**No cell is empty, but the leanings are strong.** The Elements barely touch Thaumaturgy (Air 1, Earth 2); the Sorceries live in it. Conjuration is small in battle (most of it is rituals: 116 of 160).

### 1.2 What a level means

The wiki labels the levels on every Path page: **1 "a dabbler", 2 "average", 3 "mastery", 4 "god-like"**; 5 and above are gods and their greatest servants. Battle spells by the level of their first Path: level 1: 126, level 2: 124, level 3: 98, level 4: 57, level 5: 30, level 6 and above: 10.

Reading every Path's table the same way gives one ladder (Claude's reading of ten tables, [read]):

| Level | What it can do | Examples |
|---|---|---|
| **1** | Itself, a touch, one small bolt, one creature summoned | Personal Barkskin, Shocking Grasp, Fire Darts, Twist Fate, Blink |
| **2** | Another creature, a real ranged attack, a small area | Fireball, Lightning Bolt, Stoneskin on an ally, Sleep, Raise Dead |
| **3** | A group, a wide area, the Path's signature | Group Stoneskin, Falling Fires, Soul Slay, Charm, Regeneration on others |
| **4** | The whole army, the battlefield | Oaken Army, Darkness, Storm, Antimagic |
| **5+** | The battlefield for the whole fight; the world | Fire Storm, Wrathful Skies, Master Enslave (8) |

**For 2d12:** Lucas's cap of 3 matches the wiki's own "mastery". Levels 4 and 5 are army scale, which a party game doesn't need, or are the Apex.

### 1.3 Every Dominions spell already carries two numbers

A spell needs a Path level (the caster's own) and a School research level 0 to 9 (the nation's). Fireball is **Fire 2, Evocation 3**. The wiki groups research in three tiers on every Path page: early (0 to 3), middle (4 to 6), late (7 to 9). Battle spells of the eight Paths:

| Path level | Early research | Middle | Late |
|---|---|---|---|
| 1 | 106 | 19 | 1 |
| 2 | 59 | 55 | 10 |
| 3 | 6 | 78 | 14 |
| 4 | 0 | 19 | 38 |
| 5+ | 0 | 4 | 36 |

**The two numbers rise together.** Only 11 battle spells are low Path (1 or 2) and late research, and only 6 are high Path (3+) and early research. The off-diagonal ones show what each number means when they part:
- **Low Path, high research = a refined trick, not raw power:** Disintegrate (Death 2, Alteration 8: kills one target outright), Pillar of Fire (Fire 2, Evocation 8: unlimited range), Quickening (Water 2, Alteration 8: Quickness on a group), Storm of Thorns (Nature 2, Evocation 7: ten projectiles), Curse of the Frog Prince (Nature 2, Alteration 7).
- **High Path, low research = raw power, simply applied:** Flare (Fire 3, Evocation 2: a big plain bolt), Rain and Mist (Water 3 and Air 3: weather), Regeneration on another (Nature 3, Enchantment 3).

**For 2d12:** Lucas decided (2026-11-18) that a spell writes both minimums and that excess Path level grows the substance and excess School level the form. Dominions supports the two meanings (Path = power, School = technique) but **not their independence**: in its list they climb together. If 2d12 wants a Fire 3 / Evocation 1 caster and a Fire 1 / Evocation 3 caster to both have a full spell list, the off-diagonal cells must be written on purpose; Dominions offers only 17 examples of them.

### 1.4 The scope ladder: one effect, cast five ways

The strongest pattern in the lists. **Most buffs and many debuffs exist as a line of spells with the same effect and a growing scope**, each step asking more Path, more research and more fatigue:

| Step | Scope | Typical cost | Regeneration (Nature) | Barkskin (Nature) | Blur (Glamour) |
|---|---|---|---|---|---|
| Personal | the caster | level 1, 5 to 20 fatigue | Personal Regeneration (N2, Ench 2, 20) | Personal Barkskin (N1, Alt 1, 5) | Blurred Body (G1, Alt 1, 10) |
| One | one square, range 10 to 15 | level 1 or 2, 20 | Regeneration (N3, Ench 3, 40) | Barkskin (N1, Alt 3, 20) | Blur (G1, Alt 2, 20) |
| Group | 3 squares, +1 a level | level 2 or 3, 40 | Group Regeneration (N3, Ench 5, 60) | Group Barkskin (N2, Alt 4, 40) | Group Blur (G2, Alt 3, 40) |
| "Warriors" | 20 squares, +1 a level | level 3 or 4, 100 (a gem) | Mass Regeneration (N4, Ench 7, 100) | Wooden Warriors (N3, Alt 6, 100) | Shadow Warriors (G3, Alt 5, 100) |
| "Army" | the whole battlefield | level 4 or 5, 200 to 300 (2 or 3 gems) | Army Regeneration (N5, Ench 8, 300) | Oaken Army (N4, Alt 7, 300) | Army of Shades (G4, Alt 7, 200) |

The same ladder holds for Stoneskin and Ironskin (Earth), Air Shield, Mistform and Flight (Air), Quickness and Liquid Body (Water), Twist Fate and Magic Resistance (Astral), Luck, Awe and True Sight (Glamour), Strength (Earth), Fury (Fire, Nature), the elemental wards, Flaming and Venomous Arrows, and for debuffs (Burn → Combustion → Conflagration; Sleep → Slumber → Sandman's Blessing; Confusion → Mass Confusion; Tangle Vines → Tangle Thicket → Wild Growth).

**For 2d12:** this is "excess School level grows the form" already written, by a team that has tuned it for twenty years: **one card with a scope ladder (yourself / one creature / a small group / an area) replaces five spells.**

### 1.5 The cost by level

Fatigue of battle spells, by first-Path level: level 1 and 2: median **20** (11% and 16% cost 100 or more); level 3: median 50, **45% cost 100 or more**; level 4: median 100, 89%; level 5: median 200. A spell of 100 fatigue needs a gem, one per full 100. So: **levels 1 and 2 are free magic, level 3 is where gems start, level 4 and up always costs gems.** The commonest values: 20 (170 spells), 100 (101), 10 (40), 200 (34).

### 1.6 What grows with level, by School

Share of battle spells with a "+ per level" on each number:

| School | Range | Area | Damage or amount | Number of effects | Nothing grows |
|---|---|---|---|---|---|
| Evocation (94) | 49 | 20 | 47 | 8 | 22 |
| Alteration (137) | 5 | 29 | 16 | 1 | 76 |
| Enchantment (103) | 1 | 26 | 3 | 2 | 59 |
| Conjuration (39) | 0 | 2 | 1 | 6 | 28 |
| Thaumaturgy (69) | 1 | 18 | 8 | 0 | 36 |

**Only Evocation scales range and damage.** The others scale the area or nothing: their growth is the scope ladder (a different spell). The usual steps: range +5 squares a level, area +1 square a level, damage +1 or +2 a level, projectiles +1 to +3 a level.

### 1.7 How a spell is resolved, by School

Three ways (a spell can use more than one): **aimed** (a Precision roll places it; armor or the damage roll defends), **resisted** (Magic Resistance against the spell's Penetration), **sure hit** (no aiming; usually resisted instead).

| School | Resisted | Sure hit | Aimed |
|---|---|---|---|
| Evocation (94) | 25 | 5 | 41 |
| Alteration (137) | 23 | 21 | 19 |
| Enchantment (103) | 9 | 2 | 9 |
| Conjuration (39) | 0 | 2 | 4 |
| Thaumaturgy (69) | **38** | 21 | 24 |

By Path, battle spells that are resisted: Glamour 26 of 65, Death 21 of 44, Astral 19 of 44, Water 11, Nature 11, Fire 3, Earth 3, **Air 1**.

**For 2d12:** this answers Lucas's Fireball question from Dominions' side. **Evocation holds both kinds**: aimed bolts (Lightning Bolt) and resisted or automatic effects (Shadow Bolt, Stellar Cascades). The School doesn't say Strike or Save. **The Path leans it:** an Element attacks the body (aimed, against armor: a Strike against Armor Defense); a Sorcery attacks the mind or the soul (resisted: a Save or Ward Defense).

### 1.8 Spells that only work on some kinds of creature

Dominions uses kind-gates heavily. Battle spells that a kind negates, or that only affect a kind:

| Path | "Mindless negates" | "Undead negates" | "Inanimate negates" | Only affects |
|---|---|---|---|---|
| Glamour | 14 | 10 | 10 | |
| Astral | 13 | 1 | 2 | Magic Beings (5), Undead (2) |
| Nature | 11 | 8 | 12 | Animals (11), Undead (1) |
| Death | 4 | 8 | 5 | Undead (4) |
| Blood | 2 | 6 | 10 | Demons (2) |
| Water | 2 | 3 | 4 | Undead or Demons (2) |
| Fire | 6 | 1 | 1 | Magic Beings (1) |
| Air, Earth | 0 or 1 | 0 or 1 | 0 or 1 | Earth: Inanimate (1) |
| Holy | 0 | 0 | 0 | Undead (1), Demons (1), Sacred (3) |

**For 2d12:** `divine-profane.md` found that type gates fail at a table ("always works, more against the profane" is what holds). Dominions can gate freely because it fields armies; a party of four can't afford a spell that does nothing. What to keep: **the list of kinds** (it is the missing Tag list: Undead, Demon, Inanimate, Magic Being, Mindless, Animal, Sacred, plus Spiritform and Illusion) and the direction of each Path's gate, as a bonus and never as a lock.

### 1.9 Two-Path spells

188 of 832 spells need two Paths; **none needs three**. The second Path's level is 1 in 118 of them, 2 in 35, 3 or more in 35: **the second Path is almost always a dab.** First Path (rows) with second Path (columns), all spells:

| First \ second | Fire | Air | Water | Earth | Astral | Death | Nature | Glamour | Total |
|---|---|---|---|---|---|---|---|---|---|
| Fire | | 3 | 1 | 4 | 4 | 0 | 2 | 0 | 14 |
| Air | 0 | | 1 | 1 | 1 | 1 | 1 | 0 | 5 |
| Water | 6 | 2 | | 2 | 0 | 4 | 4 | 1 | 19 |
| Earth | 4 | 4 | 3 | | 5 | 3 | 1 | 0 | 20 |
| Astral | 1 | 1 | 1 | 4 | | 8 | 1 | 1 | 17 |
| Death | 5 | 4 | 4 | 2 | 0 | | 0 | 0 | 15 |
| Nature | 1 | 2 | 9 | 4 | 1 | 6 | | 1 | 24 |
| Glamour | 5 | 3 | 3 | 3 | 5 | 4 | 11 | | 34 |
| Blood | 7 | 3 | 4 | 5 | 9 | 3 | 6 | 3 | 40 |

**What a second Path adds** (reading the two-Path battle spells): almost always **one of four things**:
1. **A delivery** (Air): a cloud. Fire + Air: Fire Cloud, Sulphur Haze. Nature + Air: Poison Cloud. Death + Air: Cloud of Death, Wind of Death. Glamour + Air: Cloud of Dreamless Slumber, Wailing Winds. Water + Air: Freezing Mist. **Air as a second Path means "as a cloud".**
2. **A new substance** made of two: Water + Fire = acid (Acid Bolt, Acid Rain) and hot water (Geyser); Earth + Fire = magma (Magma Bolts: 25 Blunt and it burns); Earth + Astral = meteors (Gifts from Heaven); Fire + Astral = the sun (Solar Eclipse) and a fire that burns Magic Beings (Hidden Flame); Death + Fire = bane fire, which ignores Fire Resistance and causes Decay; Astral + Fire = astral fire, likewise.
3. **The second Path's condition as a rider:** Astral + Death: Nether Bolt (damage, and Feeblemind around it); Nature + Death: Venomous Death (poison, then Decay); Glamour + Death: Unending Nightmare (sleep and confusion), Horrible Visage (Dread); Glamour + Fire: Awe; Glamour + Astral: Curse, Mind Blank.
4. **A reach into the second Path's creatures or ground:** Glamour + Nature: the fay; Nature + Water: swamp beasts; Death + Water: Stygian skin (the river Styx); Blood + any Element: that Element's hell.

**For 2d12:** Lucas's "how they can merge and create new spells" has a clean base here. Kinds 1 and 3 are systematic (a rule could do them: "a second Path adds its delivery or its rider"); kinds 2 and 4 are hand-made (written spells). And the second Path at level 1 is Dominions' norm: **a merge asks for a dab, not for mastery of two Paths.**

---

## 2. The Paths

Each entry: what it is, how it hurts, what it does in each School (battle spells, with their requirements as Path level / School research), how it protects, how it holds a creature, its side in the mind, its two-Path spells, what a level gives for free ("indirect magic"), its bless (what it gives holy troops), what it does to the priests' Smite and Banishment, and who counters it. Fatigue in parentheses where it tells something.

### 2.1 Fire

**What it is.** "Fire burns." The wiki: it governs flame and heat, is "dynamic and emotional", the easiest Element to Evoke and the hardest to Alter. Its tricks beyond burning: "bolstering Attack Skill and disorienting foes".

**How it hurts.** Fire damage, **armor-piercing** (armor counts half). It **splashes** and it **stays**: most Fire Evocations leave Heat Clouds (fatigue, then damage, for a few rounds), and its Alterations set creatures **Burning** (damage every round, by the creature's size, until put out).

- **Evocation (15, its strongest School).** Fire Darts (F1 / 1: four darts, +3 a level), Flame Bolt (F2 / 1: 13 +2 a level, range 45), Fire Blast (F2 / 2: short range, 3 squares), **Fireball (F2 / 3: 16 +2 a level in 8 squares, range 35 +5 a level)**, Flare (F3 / 2: one big bolt, 50 fatigue), Falling Fires (F3 / 5: 6 squares +1 a level, imprecise, delayed), Pillar of Fire (F2 / 8: 35, unlimited range), Flame Storm (F5 / 9: 50 squares), Fire Storm (F5 / 7: the battlefield burns for the whole fight, both sides).
- **Alteration (14).** Burn (F1: one target burns), Combustion, Conflagration (10 squares burn); Immolation (F2: an area centered on the caster) and All-consuming Pyre (F5: 40 squares around the caster); Incinerate (F3: 18 fire "internal", it can't miss and ignores armor); **Blindness (F1 / 6: one target Blinded, no resistance roll)**; Phoenix Pyre (F2 / 7: when you die you explode and return, tired; it can happen several times); Cold Resistance in every scope; Solar Eclipse (F3 + Astral 1: darkness on the battlefield).
- **Enchantment (9).** Fire Shield (F1: melee attackers who hit you burn), Ignite Arrows → Flaming Arrows → Hail of Burning Embers (allies' missiles deal +8 fire), Fire Resistance wards in every scope, Heat from Hell (F4: the battlefield fills with heat clouds).
- **Conjuration (6).** Fire elementals (F1, F3, F4 for four), salamanders, will o' the wisps; **Phoenix Power (F2: +1 Fire level for the fight)**.
- **Thaumaturgy (7): rage.** Battle Fury → Furious Warriors → Gift of the Furies (allies +2 attack, +2 morale), Rage and Hydrophobia (enemies Enraged: half their actions are random melee), **Bonds of Fire and Prison of Fire (a cage of flame: a morale check to leave, and leaving burns)**.

**Protects by** punishing: the Fire Shield, exploding on death, courage. It has no real defensive spell. **Holds by** fear of the flame (Bonds of Fire: morale against 21 to escape, 3 fire on escaping). **Mind side:** rage and courage.

**Two-Path spells with Fire first:** Air (burning clouds), Earth (volcanoes, terracotta soldiers), Astral (the sun), Nature (fire ants, the Furies). **Fire as the second Path:** acid (Water), magma (Earth), bane fire (Death), astral fire, false fire and Awe (Glamour), fever (Nature), hellfire (Blood).

**Indirect magic:** Fire Resistance 5 at level 3, 10 at level 4; the only Path that gives ordinary Leadership (+10 a level); a shorter life. **Bless:** Morale (1), Fire Resistance and Attack skill (2), Inspirational (3), Righteous Wrath when a comrade dies (4), exploding on death and a Heat Aura (5), Fire Shield (6), Flaming Weapons (7). **Smite becomes** Heavenly Fire (a second hit of 10 fire); **Banishment** sets the undead burning.

**Countered by** Water (Rain makes Fire spells cost half again more and puts out the burning; fire resistance wards), by itself, by Earth. Fire Resistance "rarely comes in quantities needed".

**For 2d12.** Subtype Fire. Rider: **Lingering Fi** (Burn and the heat clouds are both this). The only Path with no defense of its own: the pure attacker. Its second face is morale (Fury, Rage), which is a real Thaumaturgy cell for an Element.

### 2.2 Air

**What it is.** The intangible gases: clouds, storms, lightning. "Battlefield movement, the weather, Missile Combat, and/or direct damage." It lost "all of its command over the unreal" to Glamour in Dominions 6.

**How it hurts.** **Shock, armor-negating** (armor does nothing), paid for with "either a limited range or a limited area". Shock can **Stun** (a chance that grows with the share of hit points taken). And **wind**: blunt damage against full armor, which Stuns the small and the weak (size and strength negate it).

- **Evocation (10).** Shocking Grasp (A1 / 1: a touch, 18 +3 a level, **3 fatigue, "the cheapest spell in the game"**), Lightning Bolt (A2 / 2: 14, one target, +4 precision, 10 fatigue), Shock Wave (A2: a short burst), Gust of Winds and Storm Wind (A1, A2: Stun in an area), Thunder Strike (A3 / 4: unlimited range, imprecise), **Orb Lightning and Chain Lightning (A2 / 5, A3 / 8: one target, then it jumps 7 or 20 times to adjacent creatures)**, Wrathful Skies (A5: lightning strikes the battlefield all fight, twice as often in a Storm).
- **Alteration (13).** **Air Shield (A1, no research: 80% of missiles miss you)** in every scope; Charge Body (A1: who hits you in melee takes 20 shock, and you take 5); **Mistform (A2: every hit is reduced by 25, or to 1; it ends on a hit of 25 or more, or any magic hit)** in every scope; Mist (A3: precision halved for all, clouds stay), **Storm (A4: precision halved, half of ordinary missiles lost, nobody flies, burning put out)**, Blizzard (A4 + Water 3).
- **Enchantment (19, its largest).** Flight, Levitation, Swiftness (double speed), Trueshot (+4 precision) and Farflight (+50% missile range) for allies, each in every scope; Shock wards; Arrow of the Western Wind (A2 / 3: one arrow, +25 precision); Wind Guide (A3: the army's missiles ignore the Storm).
- **Conjuration (5).** Hawks, air elementals; **Storm Power (A1: +1 Air level, only during a Storm)**.
- **Thaumaturgy (1).** Steal Breath (A1: 40 fatigue to one target, +5 a level; those who don't breathe are immune).

**Protects by** not being hit: missiles turned aside, a body of mist, flying out of reach. **Holds by** nothing lasting: it Stuns for a round. **Mind side:** none in battle.

**Two-Path spells:** very few with Air first (5). **Air is the great second Path: the cloud** (Fire Cloud, Poison Cloud, Cloud of Death, Freezing Mist, Cloud of Dreamless Slumber, Wailing Winds, Rain of Stones).

**Indirect magic:** Shock Resistance 5 at level 3, 10 at 4. **Bless:** Precision (1), Shock Resistance and longer range (2), Awareness: can't be surrounded (3), Swiftness and Defence (4), Air Shield (6), Thunder Weapons (7), Flight (9). **Smite becomes** Heavenly Strike (range 50, +5 shock); **Banishment** a wide wind of small damage.

**Countered by** other Air (Air Shield, Mist, Storm against its archery spells), magical projectiles (they ignore Air Shield), Earth (Shock Resistance, armor against wind).

**For 2d12.** Subtypes Electricity and Thunder. Rider candidates: **a push** (wind), or **Staggered** (the stun, softened: 2d12 has no "lose your turn", see `conditions-and-senses.md`), or **a jump to an adjacent creature** (the chain). Its identity is the **archer's friend and enemy** (it makes and unmakes ranged attacks), mobility, and weather laid on the whole field. As a second Path it is "as a cloud", which in 2d12 is a zone.

### 2.3 Water

**What it is.** Liquids, cold; "flexible and wise", easy to Alter. "It modifies secondary stats around simple damage-dealing and damage reduction." Half its list changes underwater (ignored here).

**How it hurts.** **Cold, armor-piercing, and it tires**: cold spells add fatigue ("Cold Shock"), leave Frost Clouds, and Freeze. With Fire: **acid**, which eats armor. Some spells strike what the armor can't cover (Frozen Heart: "internal").

- **Evocation (16).** Freezing Touch (W1, no research), Cold Bolt (W2 / 1: 13, range 50), Cold Blast (W2: short, 3 squares), Falling Frost (W3 / 5: 10 squares), Ice Strike (W2 / 7), Niefel Flames (W5 / 9: 75 squares); **Slime (W1 / 1: the target is Slowed: -2 attack, -2 defence, half as many actions)**; Cleansing Water (W2: only the undead and demons); Acid Bolt, Acid Spray, Acid Rain (with Fire 1); **Rain (W3: douses fire, makes Fire spells cost 50% more)**.
- **Alteration (21, its largest).** **Quicken Self (W1 / 2: +2 attack, +2 defence, twice as many actions)**, Quickness on another (W2 / 4), Quickening (a group); **Slow (W2 / 4) and Crawl (W3: an area)**; **Freeze (W2 / 3: Slowed, and 2d6 cold fatigue every round)**, Winter's Chill (an area); **Liquid Body (W1 / 4: half damage from slashing, blunt and piercing; -4 Strength)** in every scope; Fire Resistance in every scope; Frozen Heart (W1 / 6: internal cold); Bone Melter (W3 + Nature 2) and Liquify (W4): kill outright, or cripple.
- **Enchantment (14).** Cold wards, Breath of Winter (W1: a chill aura around you), Quagmire (W4: the battlefield a swamp: -1 attack and defence, -20% speed, for all), Grip of Winter (W4: frost clouds all over, all fight), Demon Cleansing (W5).
- **Conjuration (7).** Water elementals (ice elementals where it is cold).
- **Thaumaturgy (5): calm and thirst.** **Calm Emotions and Serenity (W1, W3: ends a berserk rage, lowers strength and attack)**, Desiccation and Curse of the Desert (W2, W3: +2d8 fatigue every round), Sailors' Death (W3: drowns one who breathes air).

**Protects by** yielding: a liquid body, quickness. Its protections "offer nothing significant against the damaging spells of Fire and Air". **Holds by** slowing: Slime, Slow, Freeze (and ice prisons, underwater only). **Mind side:** calm, apathy.

**Two-Path spells with Water first:** Fire (acid, geysers), Death (the river Styx: Stygian skin, an army made invulnerable), Nature (swamp and sea beasts, Bone Melter), Air (frost clouds).

**Indirect magic:** Cold Resistance 5 at level 3, 10 at 4. **Bless:** Cold Resistance, Swimming, Defence skill (2), a Chill Aura and Slowing Weapons (5), Acid Weapons (6, with Fire 2), Quickness (9). **Smite becomes** Watery Death (drowning: a second 10 damage on those who breathe); **Banishment** a wider, weaker water.

**Countered by** high armor (its stat changes do little against Earth's skins), Fire Shields.

**For 2d12.** Subtypes Cold and Acid (with Fire). Rider: **Slowed** or **Hindered**; **Quickened** on allies (2d12 has both conditions, and Dominions gives both to Water: it is the Path of tempo). Fatigue by cold has no 2d12 word yet. It is the Element that answers Fire.

### 2.4 Earth

**What it is.** What is solid: mountains and caverns. "Conservative and stable", "among the toughest to Evoke, but one of the easiest to Alter". **"Earth is well-known for its buffs."**

**How it hurts.** **Not magically.** "Creating rocks and blades is hard enough, let alone enchanting them": its attacks are ordinary blunt or slashing hits against full armor, many at once (which the incorporeal mostly ignore). It breaks armor and it pins.

- **Evocation (9).** Flying Shards (E1, no research: 4 projectiles +2 a level), Blade Wind (E3 / 4: **50 blades**, 80 fatigue), Magma Bolts and Magma Eruption (with Fire: 25 and 22 Blunt, and they burn), Gifts from Heaven (E3 + Astral 1: three meteors of 150), **Earthquake (E4 / 5: the whole battlefield, both sides; a defence roll avoids it; those who fly or float are immune)**.
- **Alteration (27, the most of any cell but Nature's).** **Stoneskin (+10 natural armor, up to 15; -5 Cold Resistance) and Ironskin (+13, up to 20; -5 Shock Resistance)**, each personal, on one, on a group, on the army; Ironskin overrides Stoneskin, which overrides Nature's Barkskin. **Earth Grip (E1 / 1: one target pinned; Strength against 23 to break out; flyers immune)**, Earth Meld (E2: 5 squares), Maws of the Earth (E3: damage and pinned). **Armor of Achilles and Destruction (E1, E3: destroy armor)**, Iron Bane (E3: all iron on the field rusts). Fists of Iron (E1: punches, +1 a level). Temper Flesh (E1: half damage from all three weapon types). Curse of Stones (E3: the enemy army slowed and encumbered). Shatter (E3: only the Inanimate, 35). **Petrify (E5: turned to stone).** Armies of Gold, Lead and Bronze (E5, E6).
- **Enchantment (10).** **Strength of Giants (E2 / 1: +4 Strength)** in every scope; Weapons of Sharpness (E3: an ally's weapon becomes armor-piercing), Earth Shatter Hammers (E2: an ally's hits Stun); Flying Shield (E1 + Air 1: a 50% chance of +20 armor against each hit).
- **Conjuration (4).** Earth elementals; **Earthpower (E2: +1 Earth level, and recover 4 fatigue a round)**.
- **Thaumaturgy (2).** Iron Will (E1: +4 Magic Resistance).

**Protects by** armor, the best in the game, at the price of a weakness (stone skin to cold, iron skin to lightning). **Holds by** gripping the body: a Strength check, and the flyers escape. **Mind side:** will (resistance to magic).

**Two-Path spells with Earth first:** Fire (magma, golden skin), Air (flying stones, gargoyles), Water (rust), Astral (meteors, lead skin against magic), Death (ruined harvests, buried kings).

**Indirect magic:** +3 natural armor at level 3; resistance to lasting injuries at 4. **Bless:** recover fatigue, Strength (2), resistance to lasting injuries (4), larger bodies (4, with Nature 3), hard skin (6), all three weapon resistances (8). **Smite becomes** Word of Stone (it may petrify); **Banishment** grips the undead in place.

**Countered by** Air (flyers and floaters ignore its grip and its quake), cold and lightning against its skins, anything incorporeal.

**For 2d12.** Subtypes Blunt, Slash, Pierce: **the one Path whose Evocations roll against Armor Defense like a weapon.** Rider: **Immobilized** (the grip) or **Prone**; for allies **Guard**. It is the ally-buffer and the armor-breaker. Stoneskin's price (a Weak to cold) is a model for a buff with a cost.

### 2.5 Astral

**What it is.** "In some respects the purest of them all, handling the power and understanding of existence itself." It "typically deals in light and positive energies", and what it uses "is real and true to this order, existing whether or not we perceive it". Stars, fate, the soul, magic itself.

**How it hurts.** **"Pure" magic damage: untyped, often armor-negating, small**, and "the only defense against it is often Magic Resistance". It is the magic against magic: several spells work only on Magic Beings or only on other Astral mages.

- **Evocation (11).** Star Fires (S1 / 1: three bolts of 5), Arcane Bolt (S2: only Magic Beings), Solar Rays (S2: only the undead, needs the sun), **Stellar Cascades (S2 / 5: 25 fatigue in 7 squares; resisting only halves it)**, Astral Geyser (S3: Horror-marks the target), Nether Bolt and Nether Darts (S1 + Death 1: 20 damage, and Feeblemind around it), Healing Light (S1 + Nature 1: heals 15 at range), **Magic Duel (S1 / 3: against another Astral mage: each adds a d6 to their Astral level, the lower dies)**.
- **Alteration (9): fate.** **Twist Fate (S1, no research: the next wound you would take is cancelled)**, on another, a group, the army; **Body Ethereal (S1 / 3: ordinary weapons miss 75% of the time)**; Control (S3: enslave a Magic Being); Doom (S4: the enemy army Cursed); Time Stop (S6).
- **Enchantment (10): against magic.** **Resist Magic (S1 / 1: +4 Magic Resistance)** → Spell Ward (a group) → Antimagic (S3: the army); **Astral Shield (S1 / 3: who hits you in melee may be paralyzed)**; Second Sight (with Death 1); Astral Healing (S3: the whole army heals 2); Opposition (S3: destroys a Magic Being); **Solar Brilliance (S5: the battlefield in blinding light; darkness-users suffer)**.
- **Conjuration (2).** **Power of the Spheres (S1 / 3: +1 level in every Path you have; 100 fatigue, so a pearl)**; Light of the Northern Star (S3: +1 Astral for everyone on the field).
- **Thaumaturgy (12): the mind as a target, and space.** **Blink (S1 / 1: a random teleport, up to 30 squares)**; Communion Master and Slave (S1 / 1); Horror Mark (S2); Returning (S2: teleport home; 7% lost in the Void); **Mind Burn (S2 / 2: 12 damage, unlimited range, can't miss, resisted)**; **Paralyze (S2 / 4)**; **Soul Slay (S3 / 5: death, resisted)**; **Enslave Mind (S4 / 6)**; Master Enslave (S8: the enemy army, 800 fatigue).

**Protects by** fate and unreality: the cancelled wound, the ethereal body, resistance to magic for all. **Holds by** paralysis (resisted). **Mind side:** the will itself: burn it, freeze it, own it. Every one is resisted, and the mindless are immune.

**Two-Path spells with Astral first:** Death (8: nether bolts, spirit sight, gates to dead worlds), Earth (meteors, golems), Fire (astral fire). **Astral as the second Path** is the most used by Blood (9: the Horrors) and by Glamour (5: curses, armor for the mind).

**Indirect magic:** nothing at level 3; +1 Magic Resistance at 4; **20 Magic Leadership a level (double the others)**; sees other Astral mages' scrying. **Bless:** Magic Leadership (1), Magic Resistance (2), Spirit Sight (3, with Death), longer spell range and +1 Penetration (4), Magic Weapons (5), Twist Fate (6), Etherealness (8). **Smite becomes** Word of Power (unlimited range, paralysis); **Banishment** reaches further and stuns.

**Countered by** another Astral mage (the duel; "even a dabbler may find and undo a god-like wizard who isn't careful"), high Magic Resistance, the mindless.

**For 2d12.** Subtype Force (and Psychic for Mind Burn). Rider candidates: **Dazed** (paralysis, softened), or **"the next instance of damage is cancelled"** for allies (Twist Fate is a clean, countable ward). It is the **counter-mage** (the home of the protection School's dispel and counterspell, and of Lucas's communion), **teleport**, and **the Path that boosts the others** (Power of the Spheres).

### 2.6 Death

**What it is.** "Dark magic": darkness, the dead, the Underworld. It "mirrors Nature" and its energies "often come into conflict with the light magic of Astral".

**How it hurts.** "Non-elemental forces, and quite a few have debilitating side effects"; "a few spells punch through even a successful [resistance], either halfway or entirely". It **ages** (Decay), **weakens** (Strength lost), **frightens**, **drains** (the caster heals), and what it kills can **rise** on its side ("Unlife" damage). And it has spells "tailored against the Undead".

- **Evocation (10).** Shadow Bolt (D2 / 3: 7, armor-negating; **resisting only halves it**; a little paralysis), Shadow Blast (an area); Bolt, Blast and Vortex of Unlife (D2 / 4 to D5 / 8: 15 to 20; the slain rise as your zombies); Bane Fire Dart and Bane Fire (with Fire 1: 15 and 55, and Decay around); Cloud of Death and Wind of Death (D4 + Air 1).
- **Alteration (13).** Hand of Dust (D1, no research: a touch, 6), **Hand of Death (D2 / 1: a touch, 40 +5 a level, 5 fatigue)**; **Weakness (D1 / 2: -3 Strength, resisted)** and Enfeeble (an area); Skeletal Body (D1: half piercing damage); **Invulnerability (D3 / 5: ordinary weapons meet at least 25 armor)**; **Drain Life (D4 / 5: 14 drained, healing the caster)**; Soul Vortex (D3: an aura that drains those adjacent); **Darkness (D4 / 6: the battlefield at darkness 6, 400 fatigue)**; **Disintegrate (D2 / 8: death, resisted)**.
- **Enchantment (8): the dead made to move.** Animate Skeleton and Animate Dead (D1 / 1: one), Raise Skeletons (D2 / 3: three), **Raise Dead (D2 / 4: ten zombies, +2 a level)**, Horde of Skeletons; Rigor Mortis (D4: all the living tire, all fight); **Life after Death (D4 / 7: your slain rise as zombies)**.
- **Conjuration (4).** Spirit Curse (D1 / 1: Cursed), Ghost Grip (D1 / 5: five hands, 25 fatigue each), spirits.
- **Thaumaturgy (9).** **Frighten (D1 / 1: morale -5, range 50, 5 fatigue)** and **Terror (D3 / 4: fear in an area, which can rout)**; Decay (D1 / 1: aging 5 years a round); Dust to Dust (D1) and Wither Bones (D3): only the undead; Control the Dead (D2 / 5); Leeching Darkness (D3: a cloud that weakens); Plague (D4: it spreads).

**Protects by** being half dead: armor against ordinary weapons, bones that arrows pass through, life taken from others. **Holds by** nothing: it weakens, tires and routs. **Mind side:** fear, real fear (it works by morale, and the mindless and the undead don't care).

**Two-Path spells with Death first:** Fire (bane fire), Air (death clouds), Water (the Styx), Earth (golems, raising the dead quickly).

**Indirect magic:** fewer injuries of old age at level 3; **+10 Morale at 4** ("no longer fears death"); 50 Undead Leadership a level (and none for Magic Beings). The only Path with **no spell to raise its own level** in battle. **Bless:** Undying: fights on below 0 hit points (1), Withering Weapons: Decay on hit (4), Stygian flesh (5), Reanimators (7), Fear (9). **Smite becomes** Syllable of Death (it may kill the living outright, or exhaust them); **Banishment** bewilders the undead.

**Countered by** the undead and the mindless (immune to much of it), Astral (light, Solar Rays), Nature (the swarm that eats the dead), priests.

**For 2d12.** Subtype Unholy. Rider: **Frightened**, or a lasting weakening (Decay and Weakness have no 2d12 word; Sickened or Exhausted are the nearest), or **"you heal half the damage"** (drain). The line **"making the dead move is an Enchantment, calling something from elsewhere is a Conjuration"** is Dominions' own and sharpens the School sorting. A necromancer with ten zombies is a summons question (`dominions-rules.md` 6).

### 2.7 Nature

**What it is.** "The most Elemental of the four [Sorceries], dealing in things of the world as they are, as long as those things are living"; "its spells are as subtle as snakes". **The longest spell list of the ten Paths.** "Subtle effects that bolster or undermine the body."

**How it hurts.** **Poison**: "it acts slowly but surely", the damage is taken over the following rounds (10% of what remains each round) and nothing stops it once inside. Thorns and vines (ordinary piercing damage) that **entangle**. And it puts to sleep, shrinks, transforms.

- **Evocation (9).** Vine Arrow (N1 / 1: 14 Pierce and entangled), Storm of Thorns (N2 / 7: ten of them); Poison Darts and Poison Arrows (N1 / 3, N2 / 5); Breath of the Dragon (N2 / 4: poison in 4 squares); **Web (N1 / 2: 3 squares pinned; Strength against 22)**; Poison Cloud and Poison Mist (with Air 1); Stream of Life (N3 / 6: too much life: the target is healed, enraged, and may die of it).
- **Alteration (28).** Poison Touch (N1, no research: 10 +5 a level); **Barkskin (N1 / 1: +7 natural armor up to 10; -5 Fire Resistance)** in every scope; Cat Eyes (see in the dark), Eagle Eyes (+4 precision); Poison Resistance; **Enlarge (N2 / 2: +1 size, +30% hit points, +3 Strength, -1 defence)** → Giant Warriors → Army of Giants; **Shrink (N2 / 4: the opposite, for good)**; **Torpor (N2 / 3: 20 fatigue and Asleep)**; Elemental Fortitude (N1 / 4: +5 to fire, shock and cold); Blood Poisoning (N2 / 5: 15 poison, can't miss); Swarm and Creeping Doom (N2, N3: 20 or 70 insects); Animate Tree, Awaken Forest; **Curse of the Frog Prince (N2 / 7) and Polymorph (N3 / 8: an area turned into boars)**.
- **Enchantment (22).** **Healing Touch (N1 / 1: heals 30 +10 a level, by touch) and Heal (N1 / 3: at range 15)**; **Regeneration (N2 personal; N3 on another: 10% of hit points a round)** in every scope; Swiftness (Gift of the Hare, Haste); Envenom Arrows → Serpent Arrows (allies' missiles poison); Proud Steed (mounts); poison wards; **Relief (N5: the army recovers fatigue all fight)**; Gaia's Blessing (N5 + Earth 2: the army resists every element).
- **Conjuration (7).** **Tangle Vines (N1 / 1) → Tangle Thicket → Wild Growth (N4: 10 squares): entangled, Strength against about 19**; Maggots (N1: 50 poison to one undead); Nest of Asps; Howl (N3: wolves arrive all fight); **Strength of Gaia (N3 + Earth 1: +1 Nature level, +4 Strength, regeneration, bark)**.
- **Thaumaturgy (13): the beast.** Beast Fury → Ferocity → Fury of the Wild (animals +2 attack and morale); Touch of Madness (N1: an ally goes Berserk); **Panic (N2 / 3: fear in an area)**; Wildness, **Charm Animal (N2 / 5)**, Beast Mastery (N6: every enemy animal is yours); Seven Year Fever (N1 + Fire 1: Diseased); The Ravenous Swarm (N3: eats the undead).

**Protects by** the body itself: bark, regeneration, size, healing. **Holds by** vines and webs (a Strength check; a little easier or harder by the land). **Mind side:** instinct: fury, panic, command of beasts.

**Two-Path spells with Nature first:** Water (9: swamps and their beasts, Mossbody), Death (extreme poison, asps, corpse-vines), Earth ("Gaia": several buffs at once), Air (poison clouds). **Nature as the second Path** is Glamour's great partner (11: the fay).

**Indirect magic:** Poison Resistance 5 at level 3, 10 at 4; a longer life; feeds an army. **Bless:** +1 hit point, see in the dark (1), Poison Resistance (2), Poison Weapons (4), recovery from lasting injuries and Berserker (5), Barkskin (6), Regeneration (7). **Smite becomes** Word of Thorns (less damage; entangled and bleeding); **Banishment** a gamble that destroys outright.

**Countered by** another Nature mage (poison resistance, turning the beasts), Fire (bark burns: Barkskin's price), the undead and the Inanimate (immune to most of it).

**For 2d12.** Subtype: **poison is missing** from 2d12's twelve (Acid is not it). Rider: **Immobilized** (entangle) or **Lingering** (poison is Dominions' own lingering damage). **The healer of the grid**, and the largest ally-buffer after Earth: where Earth gives armor, Nature gives a living body (regeneration, size, speed). "Entangle is a Conjuration (vines brought), Web an Evocation (thrown)" shows Dominions' sorting isn't strict.

### 2.8 Glamour

**What it is.** New in Dominions 6. "That which is intangible but still impactful, such as emotions and perceptions": things that "wouldn't exist without something to behold them". Illusion, dream, luck, awe. "Somewhat evenly split between the schools, though with a focus on Thaumaturgy."

**How it hurts.** **"Glamour's damaging spells are mostly lies."** **False Damage**: it kills only when false damage plus real damage reaches the target's hit points; it causes no lasting injury; it can't be healed; **it fades (2 a round) once no enemy Glamour mage is left**; the mindless are immune. Otherwise it removes creatures from the fight without hurting them: asleep, stunned, confused, charmed.

- **Evocation (14).** Ephemeral Bolt (G2 / 2: 4 false +1 a level, **10 fatigue**), Ephemeral Blast (G3 / 4), False Fire (G1 + Fire 1), Shimmering Fields (G5: 50 squares); **Bewitching Lights (G1 / 1: Stun in 3 squares, easily resisted)**; Elf Shot (G1 + Nature 1: 100 fatigue: unconscious); **illusions: Warrior Illusion (G1 / 2: one, 10 fatigue), Ghost Wolves (G3), Illusory Army (G3 / 5: twenty), False Horror (G3 / 6)**: bodies with 1 hit point that deal false damage and dissolve without a Glamour mage; Dance of Ephemeral Swords (G2: three extra false attacks a round); Wailing Winds (G4 + Air 1: fear all fight).
- **Alteration (12): not being where you seem.** **Blur (G1 / 1: attackers -2 to hit)** in every scope; **Mirror Image (G1 / 2: two images a level; with n images, n in n+1 hits are lost and pop one)**; **Displacement (G2 / 3: attackers -10 on the first swing, -5 after)**; **Invisibility (G3 / 6: attackers swing blind)**; **Twilight (G3 / 4: dusk on the battlefield; +1 Glamour level for all; -2 precision)** and Nightfall (G3 / 5: darkness 3, needs Twilight). True Sight defeats all of these but Mirror Image.
- **Enchantment (14).** True Sight (G1 / 1) in every scope; **False Fetters (G2 / 1: pinned by chains that aren't there; Magic Resistance against 20)**; **Shroud of Splendor (G1 + Fire 1: Awe: who would strike you must pass a morale check or lose the attack)** in every scope; Shroud of Bewilderment (G2: who attacks you misses and is bewildered); Horrible Visage (G2 + Death 1: Dread, a fear aura that True Sight ignores); **Steal Sight (G1 / 6: Blinded, resisted)**; Mists of Deception (G5 + Air 1: illusions arrive every round).
- **Conjuration (5).** Phantasms (wolves, warriors, a beast, a knight): unlike illusions these are real beings of the Dreamwild "with souls and proper toughness"; sprites.
- **Thaumaturgy (20, its largest).** **Sleep Ray (G1, no research: touch), Sleep (G2 / 2: at range 35, can't miss, resisted), Slumber (an area)**: asleep until harmed; **Fascination (G1 / 1: Stunned a round)**; **Personal Luck (G1 / 1) → Luck → Group Luck → Battle Fortune → Dreamwild Legion: a hit that would kill misses 75% of the time**; **Despair (G2 / 3: fear in 5 squares)**; **Confusion (G2 / 5: half its actions random) and Mass Confusion**; **Visions of Death (G3 / 4: 25 false damage +5 a level, can't miss)**; **Charm (G3 / 7: changes sides)**; Curse and Mind Blank (with Astral 1: +10 Magic Resistance against mind spells); Legion's Demise (G7: 5 false damage to every enemy every round).

**Protects by** not being seen truly: every Alteration is a miss chance, and Luck. **Holds by** belief (False Fetters: Magic Resistance, not Strength) and sleep. **Mind side:** it is the mind Path: emotion and perception.

**Two-Path spells with Glamour first:** the most of the eight (34): Nature (11: the fay), Fire (5: Awe, false fire), Astral (5: curses), Death (4: dread, nightmares), Air (sleep clouds, wailing winds). **Glamour is almost never a second Path** (6 spells).

**Indirect magic:** sheds 1 false damage a round at level 3; **True Sight at 4**. Illusions need a Glamour mage on their side to last. **Bless:** needs no sleep, faster experience (1), stealth (2), True Sight and Blur (3), Awe (6, with Fire 2), Displacement and Dread (7), Luck (8). **Smite becomes** Word of Bewilderment (confusion); **Banishment** haunts undead that have minds.

**Countered by** True Sight (given by any Glamour mage, which the wiki calls dramatic: "disrupting many of the enchantments that keep Glamour's foot soldiers untouched"), the mindless, the undead and the Inanimate (no sleep, no luck, no false death), and killing the Glamour mage.

**For 2d12.** Subtype Psychic. **False Damage is close to things 2d12 already has**: Nonlethal damage (it knocks out, it doesn't kill), or Resolve damage, or Guard turned around. A rule "it ends when its caster goes Down" is exactly the [Standing] idea. Rider candidates: **Half-Blinded**, **Taunted** (Awe is its mirror: "your attack against me is lost"), **Pressed** (Blur: Banes on those who strike). It is the controller and the trickster, and its defense is the opposite of Earth's: Earth makes the hit not hurt, Glamour makes it not land.

### 2.9 Blood

**What it is.** "A fell path", cast out of the Sorceries. "A series of exchanges, trading in the vital forces of living beings" with the Lower Planes. "Most spells in the school of Blood Magic are rituals; the path is just more suited for lab-work." "You can count the number of Blood spells that don't require Blood Slaves on one hand."

**The cost.** Almost every battle spell costs **100 fatigue**, which is one blood slave. Slaves are found by blood-hunting in your own provinces (unrest), are carried as units, stand on the battlefield and can be killed first. No gems, no research in the other Schools: one School of its own.

**How it hurts.** The living only ("most offensive Blood spells don't work on the Inanimate"; the undead are immune to most). **Drain** (the caster heals and loses fatigue), bleeding, pain, fear.

- **Battle spells (30).** Bleed (B1: -5% hit points a round), Blood Burst (B1: 11), Blood Boil (with Fire); **Leeching Touch (B1 / 3: 15 drained, only 20 fatigue), Leech (B1 / 7: 25 drained at range)**, Bloodletting (B4: 1 drained from everyone); **Life for a Life (B3 / 8: 40 +5 a level, unlimited range, 199 fatigue)**; Agony (B2: fear in an area), Harm (B2: chest wounds), Blood Rain (B3); **Blood Heal (B1: the caster heals 50)**; **Reinvigoration (B1: wipes 200 fatigue)**; **Pain Transfer (B2: half the damage the caster takes goes to nearby blood slaves)**; **Damage Reversal (B1 / 8: damage you take is returned to the attacker, resisted)**; Hellbind Heart and Soul Transaction (charm); Blood Lust and Rush of Strength (+4 Strength for demons, for the army); imps, an Illearth, Horrors called (with Astral); Banish Demon; Infernal Prison and Claws of Kokytos (B3: the target is sent to a hell); **Hell Power (B3 / 2: +4 to six stats and +2 to every Path, a Horror Mark, and Horrors come every round)**; Sabbath Master and Slave.
- **Rituals (47).** Almost all bind demons, each second Path opening one hell (Fire: devils; Water: frost fiends; Air: storm demons; Earth: demon knights; Astral: the Horrors, uncontrolled; Death: vampires; Nature: dark vines, cross-breeding; Glamour: succubi).

**Indirect magic:** +5 hit points at level 3, +10 at 4. **Bless:** hit points (1), Strength (2), disease resistance, slow regeneration (3), **Blood Surge: stronger for a while after each kill (4)**, **Blood Bond: half the damage taken is shared among the bonded within 5 squares (5)**, Blood Vengeance: the attacker takes the damage too (7), Vampiric Weapons (8). **Smite becomes** Claim Life (twice the damage, the living only, a chest wound). No Banishment.

**For 2d12.** Lucas's living-fuel class is here almost whole: **health as the cost** (yours, or shared with a bonded creature: Pain Transfer and Blood Bond are the same idea twice), **drain as the income**, a strong self-buff that marks you (Hell Power), and "the living only" as its limit. It needs no School axis: in Dominions it has exactly one.

### 2.10 Holy

**What it is.** "Powered by faith, rather than by the turning of the Spheres." Priests, not mages. No research, no gems, **no fatigue** beyond what armor adds. A god can't use it.

**The whole list (10 spells), by priest level:** 1: **Blessing** (the sacred within 5 squares +5 a level gain the god's bless and +1 morale), **Banishment** (the undead only: 4 +3 a level in 4 squares +2 a level). 2: **Sermon of Courage** (+1 morale in an area), **Smite Demon**, **Holy Word** (Stuns an enemy sacred), **Holy Avenger** (a self-buff: whoever damages the priest is struck by a bolt of 20 the next round). 3: **Divine Blessing** (the whole army), **Smite** (10, range 30, can't miss, resisted). 4: **Fanaticism** (+1 morale, the army). 5: **Divine Channeling** (+1 priest level for all).

**No healing, no protection but morale, no light.** What makes priests matter is the **bless** (designed with the god, from the god's Paths) and that **the god's strongest Path (4 or more) recolors Smite and Banishment** (the table in 3.3).

**For 2d12.** The Paladin already stands here, and wider (Lay On Hands is not Dominions'). What transfers: a divine list is **short, costless, and colored by the deity's Path**; Holy Avenger is a Reaction in all but name.

---

## 3. Across the Paths

### 3.1 The contested ground, with the evidence

| Ground | Who has it in Dominions | Evidence |
|---|---|---|
| **The will and the soul** (damage, paralysis, slavery, death) | **Astral** | Mind Burn, Paralyze, Soul Slay, Enslave Mind; 13 "Mindless negates" |
| **Emotion and perception** (sleep, stun, confusion, charm, despair) | **Glamour** | 20 Thaumaturgies; 14 "Mindless negates" |
| **Rage and courage** | **Fire** (people), **Nature** (beasts, berserk) | Battle Fury, Rage; Beast Fury, Touch of Madness |
| **Calm** | **Water** | Calm Emotions, Serenity |
| **Fear** | **Death** (real: Frighten, Terror), then **Glamour** (Despair; Dread, which True Sight ignores), **Nature** (Panic), **Blood** (Agony) | four Paths frighten; only Death's bless is Fear itself |
| **Light** | **Astral** (Solar Rays, Solar Brilliance, Star Fires; "light and positive energies"), **Fire** for the sun (Second Sun) | |
| **Darkness** | **Death** (Darkness, Utterdark), **Glamour** (Twilight, Nightfall); oddly **Fire + Astral** (Solar Eclipse) | |
| **Blinding** | **Fire** (Blindness, F1), **Glamour** (Steal Sight, G1), **Astral** (Solar Brilliance) | |
| **Seeing truly** | **Glamour** (True Sight), **Astral + Death** (Spirit Sight), **Nature** (the dark) | |
| **Healing** | **Nature** (Healing Touch, Heal, Regeneration), **Astral** (Astral Healing; Healing Light with Nature), **Blood** (itself only). **Holy: none** | |
| **Poison** | **Nature** | its element |
| **Disease, aging, weakness** | **Death** (Decay, Plague, Weakness); disease also **Nature + Fire** (Seven Year Fever) | |
| **Teleport** | **Astral** (Blink in battle; every teleport ritual) | others travel only by ritual |
| **Metal, armor, weapons** | **Earth** (skins, Weapons of Sharpness, armor-breaking); rust is **Earth + Water** | |
| **Missiles** | **Air** (shield against them, precision, range), **Fire** and **Nature** (burning and poisoned arrows) | |
| **Weather** | **Air** (Storm, Mist), **Water** (Rain, swamp, winter), **Fire** (heat) | laid on both sides |
| **Fate and luck** | **Astral** (Twist Fate, curses), **Glamour** (Luck) | Curse needs both |
| **Magic itself** (resisting, dispelling, boosting, linking) | **Astral** | Resist Magic, Antimagic, Dispel, Power of the Spheres, Communion |
| **The dead** | **Death**; against them also Astral, Nature, Water, Holy | |
| **Beasts and plants** | **Nature** | 11 "Animals only" |
| **Size and shape** | **Nature** (Enlarge, Shrink, Polymorph); **Water** (liquid), **Earth** (stone) | |
| **Speed** | **Water** (Quickness: more actions), **Air** and **Nature** (Swiftness: movement) | two different things |

### 3.2 The same job done by each Path

This is the grid working: **one form, eight substances, each with its own way out.**

| Job | Fire | Air | Water | Earth | Astral | Death | Nature | Glamour |
|---|---|---|---|---|---|---|---|---|
| **Hold a creature** | Bonds of Fire (morale; burns on leaving) | (Stun a round) | Slime, Freeze (Slowed) | Earth Grip (Strength; flyers immune) | Paralyze (resisted) | (none) | Tangle Vines, Web (Strength) | False Fetters (resisted) |
| **Punish who hits you** | Fire Shield (burns) | Charge Body (shocks both) | Breath of Winter (chills) | (none) | Astral Shield (paralyzes) | Soul Vortex (drains) | (none) | Shroud of Bewilderment (they miss) |
| **Protect** | (none) | Air Shield, Mistform | Liquid Body, Quickness | Stoneskin, Ironskin | Twist Fate, Ethereal, Resist Magic | Invulnerability, Skeletal Body | Barkskin, Regeneration | Blur, Mirror Image, Luck |
| **Arm an ally** | Flaming Arrows, Fury | Trueshot, Farflight, Flight | Quickness | Strength, Sharpness, stunning hammers | (none) | (none) | Envenom Arrows, Enlarge, Haste | Awe, Luck |
| **Fill the field all fight** | Fire Storm, Heat from Hell | Storm, Mist, Wrathful Skies | Rain, Quagmire, Grip of Winter | Earthquake (once), Rain of Stones | Solar Brilliance, Astral Tempest | Darkness, Rigor Mortis | Relief, Howl, Foul Vapors | Twilight, Wailing Winds |
| **Raise its own level** | Phoenix Power (F2) | Storm Power (A1, in a Storm) | (underwater only) | Earthpower (E2) | Power of the Spheres (S1, all Paths) | **none** | Strength of Gaia (N3 + E1) | Twilight (G3, everyone) |
| **Bodies on the field** | elementals | elementals, hawks | elementals | elementals | (none) | the dead, raised | vines, insects, wolves | illusions, phantasms |

### 3.3 What each Path does to the priests' two spells

Dominions' own statement of **one rider a Path**: the same spell, plus the Path's mark.

| God's Path | Smite (10 damage, range 30) becomes | Banishment (the undead, an area) becomes |
|---|---|---|
| Fire | Heavenly Fire: a second hit, 10 fire | Ashes to Ashes: sets them burning |
| Air | Heavenly Strike: range 50, +5 shock | Sacred Wind: a very wide area, 1 damage |
| Water | Watery Death: drowning, 10 more (not on those who don't breathe) | Purifying Water: wider, and more against the unarmored |
| Earth | Word of Stone: may petrify (a second resistance roll) | Pull of the Grave: held in place |
| Astral | Word of Power: unlimited range, paralysis | Stellar Decree: longer and wider, Stuns |
| Death | Syllable of Death: may kill the living outright, or exhaust | Decree of the Underworld: bewilders |
| Nature | Word of Thorns: 5 damage, entangled and bleeding | Final Rest: small, easily resisted, destroys outright |
| Glamour | Word of Bewilderment: confusion | Return of the Past: wider, extra damage to those with minds |
| Blood | Claim Life: 20 damage, the living only, a chest wound | (none) |

### 3.4 What a level gives for free

| Path | At level 3 | At level 4 |
|---|---|---|
| Fire | Fire Resistance 5 | 10 |
| Air | Shock Resistance 5 | 10 |
| Water | Cold Resistance 5 | 10 |
| Earth | +3 natural armor | resists lasting injuries |
| Astral | nothing | +1 Magic Resistance |
| Death | ages better | +10 Morale |
| Nature | Poison Resistance 5 | 10 |
| Glamour | sheds false damage | True Sight |
| Blood | +5 hit points | +10 |

Nothing at levels 1 and 2: **the passive is the reward of mastery.**

### 3.5 Each Path in one line (Claude's summary of section 2)

| Path | Hurts with | Against | Its mark | Leans to | Its role |
|---|---|---|---|---|---|
| **Fire** | fire that splashes and stays | armor (half) | burning | Evocation | the attacker; rage |
| **Air** | lightning, precise and narrow; wind | nothing (armor ignored) | stun, the jump, the cloud | Enchantment, Evocation | archery, flight, weather |
| **Water** | cold that tires; acid | armor (half) | slowed / quickened | Alteration | tempo; answers Fire |
| **Earth** | stones and blades, ordinary | full armor | pinned; armor broken | Alteration | the armorer |
| **Astral** | pure magic, small | Magic Resistance | paralysis; a wound cancelled | Thaumaturgy, Evocation | the counter-mage; fate; teleport |
| **Death** | decay, drain, fear | Magic Resistance (often only halves) | frightened; weakened | Thaumaturgy, Alteration | the necromancer; attrition |
| **Nature** | poison, slow; thorns | nothing once inside | entangled; poisoned | Alteration, Enchantment | the healer; the living body |
| **Glamour** | lies (false damage) | Magic Resistance; the mindless immune | asleep, confused, charmed | Thaumaturgy | the trickster; control |
| **Blood** | drain, on the living | Magic Resistance | bleeding | its own | pays in life |
| **Holy** | smiting the unholy | Magic Resistance | the god's Path | its own | the bless |

---

## 4. Sources

- illwiki.com [read, raw pages]: /fire /air /water /earth /astral /death /nature /glamour /blood /holy ; /evocation /alteration /enchantment /conjuration /thaumaturgy /blood-magic /divine-magic /construction ; /bless ; /spell-table-notation ; /magic. Pages last modified 2026-10-26 by the wiki's migration.
- Dominions 6 manual (Illwinter), Magic chapter and the damage pages [read]: https://www.illwinter.com/dom6/dom6manual.pdf
- The spell facts: `raw/2026-11-18-dominions-spells.tsv` (832 rows).
- The adjacent rules: `dominions-rules.md`. The first pass: `dominions-magic.md`.

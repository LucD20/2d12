# The layout of an ability block in other games (raw report, 2026-11-15)

**The question.** How do published games lay out the block of one ability / power / spell (what sits on the title line, labeled lines or a grid, where the roll, save or defense is stated and in what words), and what did players and designers say about those layouts?

**How far to trust this.** Other games' rules and other people's opinions, never 2d12's rules.
- **[read]** = rules text I read in full myself, on the page or file linked.
- **[checked]** = an opinion I read on its own page (author and date given when the page shows them).
- **[lead]** = seen only in a search tool's summary; the page was not opened. Not to be quoted to anyone before it is opened.
- Not opened on purpose: Reddit, Giant in the Playground, RPG.net (they refuse automated readers). Most Draw Steel and 5e talk lives on Reddit and Discord, so "no complaint found" below means my searches found none, not that none exists.

Sources of the rules text: the 4e Compendium crawl (github.com/toddcblank/4eitems, `crawled/power-N.html`), Draw Steel as markdown (github.com/SteelCompendium/data-rules-md), Archives of Nethys (2e.aonprd.com, through its search index), SRD 5.1 (5thsrd.org), SRD 5.2.1 as markdown (github.com/oldmanumby/dnd.srd.5.2.1), Lancer (github.com/massif-press/lancer-data), 13th Age SRD (github.com/13vaults/13vaults.com), ICON 1.5 (github.com/zengulus/icon).

---

## 1. D&D 4e (2008)

### The block [read]

The block has a title bar colored by frequency (the Compendium's HTML classes it, e.g. `dailypower`) and then lines. Verbatim (the Compendium's text; the gaps in the two header lines are the original's bullet and spacing):

**Tide of Iron** (power-1000.html, PHB p.77)
```
Tide of Iron                                   Fighter Attack 1
After each swing, you use your shield to shove your foe backward, and then you surge ahead.
At-Will   *   Martial, Weapon
Standard Action      Melee weapon
Requirement: You must be using a shield.
Target: One creature
Attack: Strength vs. AC
Hit: 1[W] + Strength modifier damage, and you can push the target 1 square if it is no larger than one size category larger than you. You can then shift 1 square into the space that the target left.
    Level 21: 2[W] + Strength modifier damage.
```

**Come and Get It** (power-2177.html, PHB p.80; the Compendium's updated text)
```
Come and Get It                                Fighter Attack 7
You brandish your weapon and call out to your foes, luring them close through their overconfidence, and then deliver a spinning strike against them all.
Encounter   *   Martial, Weapon
Standard Action      Close burst 3
Target: Each enemy you can see in the burst
Attack: Strength vs. Will
Hit: You pull the target up to 2 squares, but only if it can end the pull adjacent to you. If the target is adjacent to you after the pull, it takes 1[W] damage.
```

**Vicious Mockery** (power-2780.html, PHB2 p.69)
```
Vicious Mockery                                Bard Attack 1
You unleash a string of insults at your foe, weaving them with bardic magic to send the creature into a blind rage.
At-Will   *   Arcane, Charm, Implement, Psychic
Standard Action      Ranged 10
Target: One creature
Attack: Charisma vs. Will
Hit: 1d6 + Charisma modifier psychic damage, and the target takes a -2 penalty to attack rolls until the end of your next turn.
Level 21: 2d6 + Charisma modifier damage.
```

**Knightly Intercession** (power-7261.html, Divine Power p.88; a triggered power, with a nested attack)
```
Knightly Intercession                          Paladin Attack 9
You command a foe to attack you instead of your companion.
Daily   *   Divine, Weapon
Immediate Interrupt      Close burst 10
Trigger: An enemy within 10 squares of you hits your ally with a melee or a ranged attack
Target: The triggering enemy
Effect: The triggering attack hits you instead of the ally. You pull the target to a square adjacent to you and then make the following attack against it.
  Attack: Strength vs. AC
  Hit: 2[W] + Strength modifier damage, and the target is subject to your divine sanction until the end of the encounter.
```

**Field order.** Title line: name (left) + class, kind and level (right). Flavor (italic). Header line 1: frequency, then keywords. Header line 2: action type, then attack type and range/area. Then one labeled fact per line, always in this order: Requirement / Trigger, Target, Attack, Hit, Miss, Effect, Sustain. In the Compendium's HTML the body lines alternate two paragraph styles (shaded and plain).

**Where the roll/defense is stated and how:** a dedicated labeled line in the body, `Attack: [ability] vs. [defense]`, directly under `Target:`. Never in the header, never a sentence. 4e has no "target makes a save" to avoid an effect: every effect is the attacker's roll against one of four defenses, so one line shape covers everything ("save ends" is a duration tag inside Hit).

---

## 2. Draw Steel (MCDM, 2025)

### The block [read]

Verbatim from the Steel Compendium markdown (the two-row table is the 2x2 header: left column left-aligned, right column right-aligned; the markdown marks distance and target with two emoji, shown here as [ruler] and [target]).

**Fear of the Gods** (Conduit, `Abilities/Conduit/3rd-Level Features/Fear of the Gods.md`; a power roll plus a potency the target resists)
```
###### Fear of the Gods (7 Piety)

*Your divine magic makes a creature appear as what your enemies fear most.*

| **Area, Magic, Ranged** |               **Main action** |
| ----------------------- | ----------------------------: |
| **[ruler] 5 cube within 10** | **[target] Each enemy in the area** |

**Power Roll + Intuition:**

- **≤11:** 6 psychic damage; I < WEAK, frightened (save ends)
- **12-16:** 9 psychic damage; I < AVERAGE, frightened (save ends)
- **17+:** 13 psychic damage; I < STRONG, frightened (save ends)

**Effect:** Each target is frightened of you or a creature you choose within distance.
```

**Judgment** (Censor, `Abilities/Censor/1st-Level Features/Judgment.md`; no roll: the body starts at `Effect:`)
```
###### Judgment

*You utter a prayer that outlines your foe in holy energy.*

| **Magic, Ranged** |     **Maneuver** |
| ----------------- | ---------------: |
| **[ruler] Ranged 10**  | **[target] One enemy** |

**Effect:** The target is judged by you until the end of the encounter, you use this ability again, you willingly end this effect (no action required), or another censor judges the target.
[...]
```

**Lines of Force** (Fury, `Abilities/Fury/1st-Level Features/Lines of Force.md`; a triggered action)
```
###### Lines of Force

*You redirect the energy of motion.*

| **Magic, Melee** |               **Triggered** |
| ---------------- | --------------------------: |
| **[ruler] Melee 1**   | **[target] Self or one creature** |

**Trigger:** The target would be force moved.

**Effect:** You can select a new target of the same size or smaller within distance to be force moved instead. [...]

**Spend 1 Ferocity:** The forced movement distance gains a bonus equal to twice your Might score instead.
```

**Field order.** Title line: name + cost in parentheses. Flavor (italic). 2x2 grid: keywords | action type; distance | target. Then labeled body entries: Trigger, Power Roll + [characteristic] with three tier lines, Effect, Spend.

**The book's own description of the format** (Draw Steel Heroes, "Abilities") [read]: "Abilities are presented in a special format that first describes the ability, then summarizes its mechanical details, and finally breaks out the ability's power roll (if it has one) and effects."

**Where the roll/defense is stated and how:** the roll is a labeled lead-in line at the top of the body, `Power Roll + Intuition:` (never in the header, never against a named defense: the roll has no target number, only three tiers). Resistance is neither a tag nor a sentence: it is an inline code inside a tier line, `I < AVERAGE, frightened (save ends)`. The book explains the code (Heroes, "Potency Presentation") [read]: "Potencies are presented in an abbreviated style in abilities so they don't take up too much space, and so you can read them by saying: 'If the target's [characteristic] is less than [potency value], they [suffer effect].'" A "save" in Draw Steel is only the end-of-turn roll to end an effect, written as the tag "(save ends)". In the hero abilities of this repository I found no sentence of the form "each target makes a [X] test".

---

## 3. Pathfinder 2e (2019 legacy; Remaster 2023)

### The block [read]

In print the title line is: NAME, the action-cost glyph, and at the right end the kind and level ("SPELL 1", "FEAT 2"); under it a row of trait boxes; then one labeled fact per line (bold label, no colon); a rule; the body; the four degrees of success as labeled lines; a rule; Heightened. The Archives of Nethys text below is the same order without the glyph and trait boxes.

**Fear, legacy** (Core Rulebook p.337, https://2e.aonprd.com/Spells.aspx?ID=110)
```
Fear                                                  Spell 1
[Emotion] [Enchantment] [Fear] [Mental]
Traditions arcane, divine, occult, primal
Cast [two-actions] somatic, verbal
Range 30 feet; Target 1 creature
Saving Throw Will; Duration varies
---
You plant fear in the target; it must attempt a Will save.
Critical Success The target is unaffected.
Success The target is frightened 1.
Failure The target is frightened 2.
Critical Failure The target is frightened 3 and fleeing for 1 round.
---
Heightened (3rd) You can target up to five creatures.
```

**Fear, Remaster** (Player Core p.331, https://2e.aonprd.com/Spells.aspx?ID=1524): identical, except the `Cast` line is gone (the glyph moved to the title line) and the label changed:
```
Range 30 feet; Target 1 creature
Defense Will; Duration varies
---
You plant fear in the target; it must attempt a Will save.
```

**Fireball** (legacy ID=119: `Saving Throw basic Reflex`; Remaster ID=1530, Player Core p.331):
```
Range 500 feet; Area 20-foot burst
Defense basic Reflex
---
A roaring blast of fire detonates at a spot you designate, dealing 6d6 fire damage.
---
Heightened (+1) The damage increases by 2d6.
```
Here the field carries the whole rule: the body never mentions the save.

**Ignition, Remaster** (Player Core p.336, https://2e.aonprd.com/Spells.aspx?ID=1565; the new thing the Remaster added: an attack spell also gets the line)
```
Range 30 feet; Target 1 creature
Defense AC
---
You snap your fingers and point at a target, which begins to smolder. Make a spell attack roll against the target's AC, dealing 2d4 fire damage on a hit. [...]
Critical Success The target takes double damage and 1d4 persistent fire damage.
Success The target takes full damage.
```

**Reactive Strike** (action, Player Core p.138, https://2e.aonprd.com/Actions.aspx?ID=2256)
```
Reactive Strike [reaction]
Trigger A creature within your reach uses a manipulate action or a move action, makes a ranged attack, or leaves a square during a move action it's using.
---
You lash out at a foe that leaves an opening. Make a melee Strike against the triggering creature. [...]
```

**Trip** (action, Player Core p.236, https://2e.aonprd.com/Actions.aspx?ID=2382)
```
Trip [one-action]
[Attack]
Requirements You have at least one hand free. Your target can't be more than one size larger than you.
---
You try to knock a creature to the ground. Attempt an Athletics check against the target's Reflex DC.
Critical Success The target falls, lands prone, and takes 1d6 bludgeoning damage.
Success The target falls and lands prone.
Critical Failure You lose your balance, fall, and land prone.
```

**Where the roll/defense is stated and how:** two ways in the same game. A **spell** has a labeled header field (legacy `Saving Throw Will`, only on save spells; Remaster `Defense Will` / `Defense AC` / `Defense basic Reflex`, on attack spells too), and usually ALSO a sentence in the body ("it must attempt a Will save"; "Make a spell attack roll against the target's AC"); when the save is "basic" the field stands alone. An **action or feat** has no such field: the roll is a sentence in the body ("Attempt an Athletics check against the target's Reflex DC."), and Trigger / Requirements are labeled lines above the rule.

---

## 4. D&D 5e: 2014 against 2024

### Spells [read]

**Fireball 2014** (SRD 5.1, https://5thsrd.org/spellcasting/spells/fireball/)
```
Fireball
3rd-level evocation
Casting Time: 1 action
Range: 150 feet
Components: V, S, M (a tiny ball of bat guano and sulfur)
Duration: Instantaneous
A bright streak flashes from your pointing finger to a point you choose within range and then blossoms with a low roar into an explosion of flame. Each creature in a 20-foot-radius sphere centered on that point must make a Dexterity saving throw. A target takes 8d6 fire damage on a failed save, or half as much damage on a successful one.
[...]
```

**Fireball 2024** (SRD 5.2.1, `07_Spells/Spells_All.md`)
```
Fireball
Level 3 Evocation (Sorcerer, Wizard)
Casting Time: Action
Range: 150 feet
Components: V, S, M (a ball of bat guano and sulfur)
Duration: Instantaneous
A bright streak flashes from you to a point you choose within range and then blossoms with a low roar into a fiery explosion. Each creature in a 20-foot-radius Sphere centered on that point makes a Dexterity saving throw, taking 8d6 Fire damage on a failed save or half as much damage on a successful one.
[...]
Using a Higher-Level Spell Slot. The damage increases by 1d6 for each spell slot level above 3.
```

**Hold Person**: 2014 "The target must succeed on a Wisdom saving throw or be paralyzed for the duration."; 2024 "The target must succeed on a Wisdom saving throw or have the Paralyzed condition for the duration."

The spell block did not change shape in 2024: four labeled lines (Casting Time, Range, Components, Duration), then prose. The area, the target and the save are all inside the prose in both editions.

### Monster actions [read]

**Young Red Dragon 2014** (SRD 5.1, https://5thsrd.org/gamemaster_rules/monsters/young_red_dragon/)
```
Claw. Melee Weapon Attack: +10 to hit, reach 5 ft., one target. Hit: 13 (2d6 + 6) slashing damage.
Fire Breath (Recharge 5–6). The dragon exhales fire in a 30-foot cone. Each creature in that area must make a DC 17 Dexterity saving throw, taking 56 (16d6) fire damage on a failed save, or half as much damage on a successful one.
```
**Young Red Dragon 2024** (SRD 5.2.1, `11_Monsters/Monsters_All.md`)
```
Rend. Melee Attack Roll: +10, reach 10 ft. Hit: 13 (2d6 + 6) Slashing damage plus 3 (1d6) Fire damage.
Fire Breath (Recharge 5-6). Dexterity Saving Throw: DC 17, each creature in a 30-foot Cone. Failure: 56 (16d6) Fire damage. Success: Half damage.
```
**Knight's Parry 2014** (https://5thsrd.org/gamemaster_rules/monsters/knight/): "Parry. The knight adds 2 to its AC against one melee attack that would hit it. To do so, the knight must see the attacker and be wielding a melee weapon."
**Parry 2024** (SRD 5.2.1, the Bandit Captain's): "Parry. Trigger: The bandit is hit by a melee attack roll while holding a weapon. Response: The bandit adds 2 to its AC against that attack, possibly causing it to miss."
**A reaction with a save, 2024** (SRD 5.2.1, a devil's Unnerving Gaze): "Trigger: A creature the devil can see starts its turn within 30 feet of the devil and can see the devil. Response--Wisdom Saving Throw: DC 15, the triggering creature. Failure: The target has the Frightened condition until the end of its turn. Success: The target is immune to this devil's Unnerving Gaze for 24 hours."

**Where the save is stated and how:** 2014 spells and monsters: a sentence in the prose ("Each creature in that area must make a DC 17 Dexterity saving throw"). 2024 **spells**: still a sentence (present tense: "makes a Dexterity saving throw"). 2024 **monsters**: the save became an italic labeled lead-in that mirrors the attack's ("Melee Attack Roll: +10" / "Dexterity Saving Throw: DC 17, each creature in a 30-foot Cone."), followed by labeled `Failure:` / `Success:` entries, and reactions got `Trigger:` / `Response:`. So in 2024 the same publisher uses the sentence for the player's spell and the labeled line for the monster.

---

## 5. 13th Age (1e SRD)

### The block [read]

Basic attack as the 13 Vaults SRD holds it (github.com/13vaults/13vaults.com, the paladin class file):
```
Melee Attack
At-Will
---
Target: One enemy
Attack: Strength + Level vs. AC
Hit: WEAPON + Strength damage
Miss: Damage equal to your level
```
Spells and powers follow the same shape in the SRD (a line of range / usage / action, then `Target:`, `Attack: [Ability] + Level vs. PD` or `vs. MD`, `Hit:`, `Miss:`); I did not get a spell file open this time, so only the basic attack above is [read].

**Where the roll/defense is stated and how:** 4e's line kept whole: a labeled `Attack: X + Level vs. AC/PD/MD`, under `Target:`. Like 4e, the attacker always rolls; "save" is only the end-of-effect roll ("save ends", easy/normal/hard).

---

## 6. Lancer (Massif Press, 2019)

### The block [read]

From the game's data (github.com/massif-press/lancer-data, `systems.json`, `actions.json`). The data holds, per system: name; SP cost and tags; per action an activation ("Quick", "Full Tech", "Reaction"), a frequency, a `trigger` field for reactions, and the effect as prose (`detail`).

**Viral Logic Suite: Logic Bomb** (Invade option): "All characters of your choice within burst 2 of your target must succeed on a Systems save or become Slowed until they end one of their turns not adjacent to any character."
**Markerlight** (Full Tech): "Make a tech attack against a character within Sensors and line of sight. On a success, they take 2 heat, Lock On, and cannot benefit from soft cover until the Lock On is cleared; [...]"
**Singularity Motivator: Exposed Singularity** — `Reaction, 1/round` / `Trigger: Your mech takes damage.` / `Effect: You may immediately teleport to a free space within 1d6 spaces.`
**Ram** (Quick Action): "To RAM, make a melee attack against an adjacent character the same SIZE or smaller than you. On a success, your target is knocked PRONE [...]"

**Where the roll/save is stated and how:** always a sentence in the prose ("make a tech attack against...", "must succeed on a Systems save or..."). Only weapons have a stat line (range, damage, tags). No labeled attack or save field.

---

## 7. ICON 1.5 (Massif Press, playtest)

### The block [read]

From the 1.5 text (github.com/zengulus/icon), a Demon Slayer ability, verbatim (line breaks added at the labels):
```
DRAKEN CROSS
2 actions, Attack, Range 3, Small Blast
Fill the air with the flurry of blades.
Attack: On hit: 2[D] + fray. Miss: fray.
Area effect: Fray
Effect: You may rush 1, then target another small blast area in range 3 with area effect: fray damage. The areas cannot overlap.
Charge or Heroic: Gains true strike, and may repeat the effect.
Talent: I. Exceed: Deal fray damage again to all characters in any area created by this ability. II. Charge: Increase range to 5, and all areas may be increased to medium blasts instead.
```
**Field order.** Name; ONE meta-line (action cost, the tag "Attack" if it rolls, range, area, other tags); flavor; then labeled entries (Attack: On hit / Miss, Area effect, Effect, Charge, Talent, Mastery).

**Where the roll is stated and how:** the word "Attack" as a tag on the meta-line, plus a labeled `Attack:` entry that holds only the outcomes. There is one defense, so nothing names it. This is the nearest published case to "a roll tag in the header".

A note on section 3: the Archives of Nethys index gave me the labeled lines, the body and the page; the title line with the action glyph, the row of trait boxes and the "Cast" line are written here as the printed book lays them out (Paizo's own preview blog, quoted in section 8.3, shows the same shape: "Thunderstrike [two-actions] Spell 1 / Concentrate, Electricity, Manipulate, Sonic / Traditions arcane, primal / Range 120 feet; Targets 1 creature / Defense basic Reflex").

A historical note [read, as quoted on EN World by Morrus, 5 May 2012]: D&D 3e already had the header field. Its Sleep reads "Level: Brd 1, Sor/Wiz 1 / Components: V, S, M / Casting Time: 1 round / Range: Medium (100 ft. + 10 ft./level) / Area: One or more living creatures within a 10-ft.-radius burst / Duration: 1 min./level / Saving Throw: Will negates / Spell Resistance: Yes", then prose. So the sequence in D&D is: 3e labeled `Saving Throw:` line -> 4e labeled `Attack: X vs. Will` line -> 5e 2014 sentence in prose -> 5e 2024 sentence for spells, labeled lead-in for monsters. Pathfinder kept 3e's line throughout and widened it in 2023.

---

## 8. What people said

### 8.1 The save as a labeled line against the save as a sentence

**The publisher's reason for the 2024 monster lead-in** [checked] — D&D Beyond, "Preview the New Stat Block Design in the 2024 Monster Manual" (staff article, page tag `author-davyd-atkins`; its first comments are dated 14 Jan 2025), https://www.dndbeyond.com/posts/1890-preview-the-new-stat-block-design-in-the-2024 :
- "Running combat is hard enough without combing monster stat blocks for pertinent information. The design philosophy behind the new stat blocks in the new Monster Manual was to make the information you need to run encounters easy to find while in the heat of battle."
- On the line "Fire Breath (Recharge 5-6). Dexterity Saving Throw: DC 24, each creature in a 90-foot Cone. Failure: 71 (13d10) Fire damage. Success: Half damage": "This new wording is more concise and places the key information upfront. You're immediately told that a saving throw is required and how it targets creatures. The effects of the ability are split into Failure and Success sections, clearly laying out how the action works."
- In the comments (first page, 14-15 Jan 2025) nobody objects to the save lead-in. The complaint is about a number that is NOT printed: ArtemisThuras: "what's the to hit modifier for guiding bolt? Doesn't bode well that got missed in a stat block used for marketing." Generic_Poster: "Yes, you can math it out, but they're bragging about how easy the new stat blocks are. It's pretty glaring." Dissentinel: "I'm really missing the spell attack modifier being right up there".

**The 5e 2014 complaint, at the moment the format appeared** [checked] — EN World, "So why's the spell's saving throw and target in the text block?", started by Obryn, 25 Jun 2014 (4 pages, all read), https://www.enworld.org/threads/so-whys-the-spells-saving-throw-and-target-in-the-text-block.356187/

For a dedicated line:
- Obryn (#1): "I'm really confused as to why there's no Save line and no line about targets. [...] Target: One living, intelligent creature [...] Save: Wisdom. Just kind of wondering; it seems inelegant to me."
- Obryn (#12): "This is information that you'll pretty much need to know every casting, so it'd make sense to call it out. Seems to me, it's even more important than range and VSM components, since this will come up every single casting".
- fba827 (#10): "Because of the way certain players I game with are, I'd prefer it in the header way rather than in the text block. [...] try not to roll my eyes when the players in question try to cast a spell and then have to retread it to catch those key bits of info every single time".
- Ruin Explorer (#16): "If you're reading through the spell for the very first time, then it's faster. If, on the other hand, you know how the spell works, but just need to double-check the save type for 5E, because now it could be any of six [...] then having to read through the spell description is of course slower."
- Ruin Explorer (#18): "probably me or someone else will just slap all the spells with potential saving throws on a sheet with the name of the spell, the save [...] so that we can print that out and look through quickly."
- UngeheuerLich (#17): "I would like saving throw and target part bolded... would be enough... maybe I use a text marker..."
- Shaangor (#22): "parsing the relevant game rules out of the block of text is slow and prone to errors in translation."
- Nikosandros (#26, #30): "it's often a pain to quickly find relevant information about a spell in the thick of a complex combat. Besides, as I previously wrote, even AD&D has a save line for each spell." / "For me, separating the information makes it muck quicker to access it."
- Obryn (#35), on players making their own cheat sheets: "If it's possible to make a workable minimalist cheat sheet, why not make those the basic spell blocks, putting all the extra stuff in the text?"

For the sentence:
- jadrax (#13): "having the type of save in the text, rather than having a reference to a save that you then have to reference three lines up, actually works out much faster in play."
- Jester David (#29): "not having a separate line is easier for non-standard targets, otherwise spells really try and limit spell effects to that one line. It's an artificial limit. It's also easier to read natural language, as you don't need to change your gaze from the text to the save or target line. All the information is in the same place."
- Capricia (#7), who counted the words (113 with the sentence form and the "At Higher Levels" paragraph, 87 with Target and Saving Throw lines) and still preferred the sentence: "Putting the saving throw in the spell text takes up like 3 extra words and does have a more natural feel to it." She gives the publisher's motive as she understood it: "the big emphasis [...] is focus on 'natural language' [...] it should in theory make it easier for a new player to understand what it is that a spell does and [...] they want to get the 3e players who loathe 4e's concise formatting style."
- Olgar Shiverstone (#2): "Perhaps so they don't have to have spells with 'Save: None' lines?" GMMichael (#5): "defender's responses to spells are so various that it would be too confusing to have a Save: entry".
- Agamon (#23): "there's less confusion for me if it's written in prose than point form. [...] 'Dog barking; 30 feet; cat in tree' / 'A dog is barking at a cat that is sitting 30 feet up in a tree.' The former is shorter, but the latter is less confusing."
- Morrus (#20, the site's owner): "a proscribed, identikit 'block', while easy to understand, makes me think about magic in a regimented, technical, numerical way [...] I don't like spellbooks to look like spreadsheets, no matter how easy it makes things."

The middle position, stated twice in the thread:
- Jester David (#31): "I think it's easier to reference one in play when quickly looking for the save, and easier to read the other when just looking at spells."
- MechaPilot (#33): "the perfect way [...] is to have a 4e-style statblock with all of the relevant information either at the beginning or end of the spell entry while keeping the 2e- and 3e-style spell description. [...] a quick-reference tool to expedite looking things up during play."

### 8.2 4e's power block: clear, or samey

[checked] — EN World, "Prose, Terminology, Fluff, & Presentation: Spreadsheets or Haiku?", started by Morrus, 5 May 2012 (page 1's opening post and page 14 read; 16 pages in all), https://www.enworld.org/threads/prose-terminology-fluff-presentation-spreadsheets-or-haiku.322668/
- Morrus (#1): "those who trend towards the 'spreadsheet' end of the scale tend to do so in support of clarity; while those who trend towards the haiku end of the scale tend to do so in support of flavour and immersion." He calls it "a highly contentious topic. The opinions people hold are widespread and diametric".
- Gargoyle (#131), a small test of the block failing: "I showed my 14 year old the sleep spell descriptions and asked him which one he preferred. He chose the 3rd edition one [...] 'Because it actually puts them to sleep, while the 4th edition one just slows them.' So ironically, he didn't read the entire 4th edition description, even though it was shorter, and didn't realize that if they fail their first save, the targets do fall asleep." (The 4e Sleep hides its main effect in the second sentence of the Hit line; the labels did not save it.)
- Dausuul (#132), the mixed form: "I would prefer the mixed approach of earlier editions, which puts standard values like range and AoE into the statblock, while the 'meat' of the spell is in the text description. So: Sleep / Range: 50 feet / Area: 10-foot radius / Attack: Intelligence vs. Will / This spell plunges the subjects into a magical slumber. [...]" Note that his "mixed" version keeps the roll as a labeled line.
- wrecan (#136): "The 4e has all the issues of a 4e block. The description is shunted into a separate section, the mechanical description is dry and clunky. It has to repeat the 'Level 25 or 30' line for formatting reasons."
- wrecan (#138): "I shouldn't have to cross-reference books when playing. It bogs the game down."

[checked] — DEFCON 1, in the 2014 thread above (#25): "Power blocks felt GREAT for martial moves. [...] reading an exploit quickly, then going to the grid [...] the power statblock all helped bring that feeling out. But for spells? Yeah, the power block was quick, concise... but [...] spellcasting just feels to me more artificial when it *is* that quick and concise." And: "With both martial combat maneuvers and spells laid out, presented, and read in the exact same format... for me there is definitely less of a distinction between the two."

[checked] — Justin Alexander, "Does Format Matter? (A Response)", The Alexandrian, 20 Feb 2011, https://thealexandrian.net/wordpress/2724/roleplaying-games/does-format-matter-a-response . He answers 4e designer Robert J. Schwalb, whom he quotes: "Fourth edition's presentation abandoned nearly everything familiar about the game's look. [...] since the game didn't match the visual expectations, it certainly must not match the play experience." and "I wonder if those changes might have been more palpable had we shifted back toward the old presentation, even if doing so meant that the game would be harder to learn." Alexander: "Personally, I think 4th Edition has some great formatting." / "So count me down pretty firmly in the camp of 'I like the format, I don't like the rules'." / "I think 4th Edition's superior formatting has attracted people who would otherwise have stuck with 3rd Edition."
- Commenter Sebastien Roblin (21 Feb 2011): "I actually find it hard to go back to the cluttered format of some of the older 3rd edition products. That said, I do find that the way the powers are listed in the 4th Edition PHB in their color carded and damage formula glory, while very efficient, also has the unfortunate effect of emphasizing how boringly similar all those powers end up being".
- Commenter tussock (21 Feb 2011): "Still can't stand the light-on-dark headers, nor the dark fadeout backgrounds. Colour coding things not great either (especially red/green)." / "Takes up too much page for what it presents too".

[checked] — Justin Alexander, "A History of the Stat Block - Part 2", 27 Apr 2023, https://thealexandrian.net/wordpress/49259/roleplaying-games/a-history-of-the-stat-block-part-2 . On why blocks went wrong: "An early failure to prioritize key information. This didn't matter in early stat blocks because they were only trying to code roughly a dozen pieces of information. When there's only a handful of entries in the stat block, it's easy to find anything you're looking for pretty much instantaneously." On the 2006 and 4e blocks: "The stat blocks were easy to use (everything you need, right at your fingertips!), but they were making everything else more difficult." (they were "HUGE"). This is about monster blocks in adventures, not player powers.

### 8.3 Pathfinder 2e: the save line was asked for by players, then widened to "Defense"

**The rule that explains the field** [read]:
- Legacy (Core Rulebook p.305, https://2e.aonprd.com/Rules.aspx?ID=295): "Spells that require a target to attempt a save to resist some or all of the spell's effects have a Saving Throw entry. This entry presents the type of save for quick reference, and specific details appear in the spell description."
- Remaster (Player Core p.302, https://2e.aonprd.com/Rules.aspx?ID=2246): "If a spell allows the target to attempt a saving throw or use their AC to defend against it, the type of defense is listed in the stat block. Any details on the particular results and timing of the save appear in the text unless the entry specifies a basic saving throw, which follows a standard rule. If a spell allows a defense only under certain circumstances or at a certain time, the Defenses entry is omitted, since the text needs to explain it in more detail."
So Paizo's stated purpose is "quick reference", the field is deliberately a duplicate of the text (except for "basic" saves), and Paizo's own escape hatch is to drop the field when the defense is conditional.

**Players asking for the line, before the 2019 book** [checked] — paizo.com forum, "Spell Description Format Suggestion" (Pathfinder Playtest Prerelease Discussion, May 2018; whole thread read), https://paizo.com/threads/rzs2v5ml . The previewed playtest spells had the save only in the prose ("The effect of the killer is based on the outcome of the target's Will saving throw.").
- sadie (22 May 2018): "the spell save was listed in the text, where - depending on spell complexity - it not be as quick to find. When somebody casts a spell, whether PC or GM, the first question is always 'what do I roll?' so the attack / save / etc needs to be called out. In PF1 spell blocks, there was always an entry at the top of the spell saying 'Fortitude negates', 'Fortitude partial' etc. This should be restored; and to make it clearer the section listing the save results should have a heading with the save type." (She proposes both: a header line "Saving throw Will partial" and a bar "WILL SAVE" above the outcomes.)
- Evershifter (22 May 2018): "Don't care if it adds a line to every spell entry. Having that 'Save:' line streamlines the quick referencing of a spell so much."
- Weather Report (22 May 2018): "I too would like the saving throw type called out more clearly, after the first reading I thought they had omitted it."
- Against, Quandary (22 May 2018): "I do like the idea of putting the type of Saving Throw in bold in header to Save section. I think replicating that info in Save line at top just for sake of similarity to 3.x/P1E will not fly, it just isn't useful once you get used to where/what to look for, and I feel like they want to save space when possible."
- Same thread, on the outcome lines: Mats Öhrman: "Confusing too (especially for a beginner) is the fact that 'Success' means a failure for the one using the spell, and vice versa..." Fuzzypaws proposes labeling by who rolls: "Failed Save: ... / Successful Save: ..." against "Successful Check: ... / Failed Check: ...".
The printed 2019 Core Rulebook has the `Saving Throw` entry (section 3). I found no Paizo statement tying the change to this thread.

**The Remaster's "Defense" label** [checked] — Paizo blog, "Player Core Preview: Spells and Spellcasting, Remastered" (2023), https://paizo.com/community/blog/v5748dyo6siek . The blog shows the new line ("Defense basic Reflex" on Caustic Blast and Thunderstrike) without one word on why the label changed. Its general argument for other changes on the same page: "Making spells look and function more consistently across the board helps in understanding the rules, especially for new players." I found no designer statement on the Defense label itself, and no player reaction to it on the pages I could open (the blog's comment pages did not load beyond the first; Reddit not read).

### 8.4 Draw Steel's ability format

- [checked] dbm, EN World, "Draw Steel General Thread", 21 Sep 2025, https://www.enworld.org/threads/draw-steel-general-thread.715407/ : "The format the the characters reminds me strongly of D&D 4e and it is similarly difficult to parse on first reading, but i am sure it will get easier with practice."
- [checked] Tigris, EN World, "Draw Steel General Thread" (the 2026 one), 23-24 Jun 2026, https://www.enworld.org/threads/draw-steel-general-thread.719620/ : "I find the pdf sooo badly formated and laid out that I stopped reading the book less than halfway through. [...] you say that you are inspired by 4E which made such a good use of layout, space and colours in their books and this is black on white text mostly with almost no layout elements..." / "it just is also the lack of modern layouting tools like boxes, highlighting etc. It feels like this was just a word document made to PDF mostly." / "it has to do with readability and information processing speed." (About the whole book; he does not single out the ability header.)
- [checked] Staffan, same thread, 24 Jun 2026: "There's the Steel Compendium, which uses more colors and iconography. I'm not sure if that's better though, but then again I don't have a problem with the books' basic layout." ffanxii4ever, same day: "the layout is boring or very plain [...] but it is also just a rules reference."
- [checked] zakael19, quoted in the 2025 "Draw Steel General Thread [+]", Aug 2025, https://www.enworld.org/threads/draw-steel-general-thread.714656/page-7 : "The graphic design/layout work is really not that excellent though is it. Colors in the callout boxes and some use of bolding/italics/etc would really help."
- **How a web tool re-rendered the 2x2 header** [checked, as a fact about that page]: the Steel Compendium's monster pages (https://steelcompendium.io/v2/Browse/monster/rival/2nd-echelon/rival-tactician/) print the same four facts as four labeled rows, in this order: "Keywords Ranged, Strike, Weapon / Action Main action / Distance Ranged 10 / Target Two creatures or objects / Power Roll + 3". The grid's cells carry no labels in the book (only position and two icons); the web version added the labels and stacked them. In monster abilities the potency is printed with its number ("M < 2 weakened (save ends)"), not the word.
- I found no complaint and no praise aimed at the potency code ("I < AVERAGE") or at the 2x2 header on any page I could open. No MCDM statement on why the header became a grid was found either.

### 8.5 Essays on layout in general

- [checked] "The Evolution of Dungeons & Dragons' Information Design", Deathtrap Games blog, Aug 2021, https://deathtrap-games.blogspot.com/2021/08/designing-layout-and-information-in.html : "If 4th edition taught the TTRPG community, however, it is that a good layout and information design can vastly improve the play experience. Especially if not overdone." It credits Old-School Essentials' rise to rules "written, structured, and ordered in a way that makes them very easy to learn". (About adventures and rulebooks, not ability blocks.)
- [checked] "What is 'Good' Layout?", Familiar Waves (Substack), https://familiarwaves.substack.com/p/what-is-good-layout : "Old School Essentials is obviously the standard bearer in communicating ideas effectively across a two page spread. While some say it lacks the charm of the original, it more than makes up for it in efficient, 'control panel' two page spreads."
- [lead] EN World threads "Radically shrinking stat blocks", "In Search of 'the' Ideal Monster Presentation", "WotC Considering NPC Stat Format Change": the search summary reports posters saying extra prose makes a mechanic hard to pick out and that labeled abilities are easy to find. Not opened.
- [lead] Paizo blog "Attack the Stat Block" (PF2 playtest): the summary says the monster block is ordered so the middle is for when it is not the monster's turn and the bottom for its turn. Not opened.

---

## 9. Patterns

**A. Where the roll or save is stated: five distinct choices.**

| Choice | Who | Example |
|---|---|---|
| 1. A labeled line in the body, right under Target | D&D 4e, 13th Age | `Attack: Strength vs. Will` |
| 2. A labeled field in the header block, usually repeated as a sentence in the body | D&D 3e, Pathfinder 1e, Pathfinder 2e spells (legacy `Saving Throw Will`, Remaster `Defense Will` / `Defense AC`) | `Defense basic Reflex` |
| 3. A labeled lead-in that opens the body and carries DC and targets too | D&D 2024 monsters; Draw Steel's `Power Roll + Intuition:` | `Dexterity Saving Throw: DC 17, each creature in a 30-foot Cone. Failure: ... Success: ...` |
| 4. A sentence in the prose | D&D 5e 2014 (spells and monsters), D&D 2024 spells, Lancer, Pathfinder 2e actions and feats | "Each creature in that area must make a DC 17 Dexterity saving throw" |
| 5. A tag on the meta-line or an inline code | ICON (`Attack` among the tags), Draw Steel potency (`I < AVERAGE` inside a tier) | `2 actions, Attack, Range 3, Small Blast` |

Evidence, by strength:
- **Strong (a publisher's own stated reason, read on its page):** WotC moved monsters from 4 to 3 in 2024-25: "places the key information upfront. You're immediately told that a saving throw is required and how it targets creatures." Paizo's rule text gives the purpose of choice 2 as "quick reference".
- **Strong (the same request made independently in two communities, each when a sentence-only format was first shown):** Paizo forum May 2018 ("the first question is always 'what do I roll?' so the attack / save / etc needs to be called out") and EN World June 2014 ("This is information that you'll pretty much need to know every casting, so it'd make sense to call it out"). In the Paizo case the printed book then had the line.
- **Medium (individual posters):** for the sentence: one place to look ("you don't need to change your gaze from the text to the save or target line"), no "Save: None" lines, room for irregular cases, a natural read on first contact, and taste (not "spreadsheets"). Against it: slower on the second and later look-ups; players build their own cheat sheets or reach for a highlighter.
- **The split both sides accept:** the sentence reads better the first time, the labeled line is faster every time after ("easier to reference one in play when quickly looking for the save, and easier to read the other when just looking at spells").
- **No publisher found that prints the roll ONLY as a header tag with nothing in the body**, except ICON (one defense, so the tag is only the word "Attack") and PF2e's "basic" saves (where a standard rule stands behind the word). Pathfinder 2e otherwise duplicates: field and sentence.
- **No published game found that words a player ability as "Each target makes an X Save" as the first body line after a tag-free header.** The nearest are 5e's prose (choice 4, the sentence buried mid-paragraph, which is the form that drew the complaints) and 2024 monsters (choice 3, the same content turned into a label: "Wisdom Saving Throw: DC 15, the triggering creature."). Choice 3 is the sentence's information in a labeled, first-position form; it drew no complaint on the pages read.

**B. The shape of the header: three choices.**

| Choice | Who | Notes |
|---|---|---|
| Two fixed header lines, each holding two facts, no labels (position and typography carry the meaning) | D&D 4e (`frequency * keywords` / `action type   range`), Draw Steel (2x2: keywords, action type / distance, target, with two icons) | Draw Steel moves Target up into the header; 4e keeps `Target:` as the first labeled body line |
| One labeled fact per line (or two per line joined by a semicolon) | Pathfinder 2e (`Range 30 feet; Target 1 creature`), D&D 3e and 5e spells, 13th Age body | Pathfinder's title line carries name, action glyph, kind and level; traits are a row of boxes |
| One unlabeled meta-line of comma-separated tags | ICON, Lancer's tag line | Shortest; relies on every tag being a defined term |

Evidence, by strength:
- **Thin.** I found no post or essay that judges the 2x2 grid, 4e's two-line header, or stacked lines against one another. Praise and complaints found are about the whole block: 4e "easy to understand" and "great formatting" (Alexander 2011) against "identikit", "boringly similar", "spreadsheets" (Morrus, Roblin, DEFCON 1) and the light-on-dark color headers (tussock); Draw Steel "similarly difficult to parse on first reading" as 4e (dbm 2025) and a book with too little color and boxing (Tigris, zakael19).
- **One concrete data point on the grid:** the Steel Compendium's web pages replace the unlabeled 2x2 with four labeled stacked rows (Keywords / Action / Distance / Target). That is one third-party tool's choice, with no stated reason on the page.
- **One concrete data point on unlabeled blocks failing:** the 14-year-old who read 4e's Sleep and missed its main effect (EN World 2012). The failure was in the Hit line's second sentence, not in the header.
- No mobile or VTT wrapping complaint was found.

**C. Things every block in the sample does.**
- Name first; flavor directly under the name (4e, Draw Steel, ICON) or as the body's first sentence (PF2e, 5e).
- Trigger and Requirement are labeled lines above the effect in every game that has them (4e, PF2e, Draw Steel, Lancer, D&D 2024 monsters, which added `Trigger:` / `Response:` in place of 2014's prose).
- Outcomes are labeled (Hit / Miss; Critical Success ... Critical Failure; tier lines; Failure / Success) everywhere except 5e spells and Lancer.
- Cost and frequency sit on or beside the title (Draw Steel "(7 Piety)", PF2e's glyph, 4e's colored bar plus the first header word).

---

## 10. Not found / not opened

- **Reddit, Giant in the Playground, RPG.net:** not read (they refuse automated readers). This is where most Draw Steel, PF2e Remaster and 2024 Monster Manual reaction lives; the Giant in the Playground thread "What do you like/dislike about the formatting of 5e monster stat blocks?" came up in searches and was not opened.
- **MCDM / Matt Colville / James Introcaso on why Draw Steel's header is a 2x2 grid, or on stat block design:** nothing found. Their reasoning is likely in videos, Patreon posts and Discord, none of which I could read.
- **A Paizo designer statement on why "Saving Throw" became "Defense":** not found; only the rule text and the preview blog, which shows the line without comment. Player reaction to the label: not found on pages that open.
- **Jeremy Crawford or another named WotC designer on "Saving Throw:" / "Trigger:" / "Response:":** not found as a quote; the D&D Beyond staff article is the only stated reason. Reaction specifically to the save lead-in or to Trigger/Response: none found on the first comment page or in the EN World threads sampled (those argue about lost flavor, "Rend", and the missing spell attack bonus).
- **Sly Flourish, Explorers Design, the Old-School Essentials designers on ability or stat block layout:** nothing specific found (Explorers Design's "Designing Lore Blocks" came up; not opened, not about abilities).
- **Robert J. Schwalb's original "Does Format Matter?" post and its PDF of 4e powers in 3e format:** read only as quoted by Justin Alexander.
- **wrecan's "To Build a Better Stat Block" (WotC community blog, c. 2011):** mentioned in the EN World thread; not found.
- **13th Age spell block:** only the basic attack was read this time (the SRD repository's file paths did not resolve); the `vs. PD` / `vs. MD` statement rests on the earlier report `2026-11-14-B-4e-13th-age.md` and on that one block's shape.
- **Gloomhaven / Frosthaven cards:** not done.
- **Draw Steel monster book in its own print layout:** seen only through the Steel Compendium's web rendering.
- **dungeonsmaster.com "Wizards Delivers a Killer Monster Makeover" (2010, on the 4e Monster Manual 3 block):** server error. **eldamo.org "Compact Steel":** refused (406). **EN World "WotC Considering NPC Stat Format Change":** link dead (404).
- **Mobile / VTT wrapping of grid headers:** no source found.

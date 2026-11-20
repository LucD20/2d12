# Raw: Divinity: Original Sin 2 (and 1) for 2d12's Talents and class options

**Date:** 2026-11-20. Divinity's rules and other people's opinions, never 2d12's.

## The question

Lucas wants ideas to borrow from Divinity: Original Sin 2 (DOS2), and Original Sin 1 (DOS1) where it differs usefully, for Talents and class options: its mechanics, what players love and dislike, and what could work at a real table (dice, paper, a GM, no computer bookkeeping). Surfaces are a topic of their own; here they get only what fits a table.

## What was read and how far to trust it

- **[read], strong:** the Divinity wiki (divinity.fandom.com), read as raw wikitext through its API (the normal pages return 402 to this tool): the pages for Action Points (OS2 and OS1), Armour, Status Effects (OS2 and OS1), Knocked Down, Frozen, Stunned, Chilled, Burning, Bleeding, Wet, the Huntsman ability and every Huntsman skill page that exists (Pin Down, Ricochet, Barrage, Ballistic Shot, Arrow Spray, Arrow Storm, Marksman's Fang, Sky Shot, Elemental Arrowheads, First Aid, Reactive Shot, Farsight, Glitter Dust), Expert Marksman (DOS1's archer school), Arrows (DOS1), Munitions (DOS2 arrows and grenades), Original Sin 2 Talents, Original Sin Talents (DOS1), Torturer, Sourcery, Source Vampirism, Source Orb, Memory, Polymorph, Summoning, Conjure Incarnate, Original Sin 2 Skills.
- **[read], strong:** the official rulebook of *Divinity Original Sin: The Board Game* (Larian, final version, the PDF Larian links from its Kickstarter: `boardgame.divinity.game/DOS_BoardGame_Rulebook.pdf`), read in full text.
- **[checked]:** designer statements as quoted on pages I opened: Nick Pechenin (Larian systems designer, later head of design) in Game Developer (Gamasutra) 2018, Swen Vincke in PC Gamer's "The making of DOS2", Pechenin's 2026 AMA as quoted by PC Gamer (Rory Norris, 9 Jan 2026); opinion pieces: PC Gamer (Ted Litchfield, 11 Jan 2026) for the armor system, RPG Codex's review (through a summarizing reader); board game reviews (GamesRadar, Going Analog, RPG Site, Gaming Trend); about 20 Steam discussion threads read directly (titles in the sources).
- **[lead]:** claims seen only in a search summary.
- **Could not open:** Reddit (blocked to every tool here), Fextralife's skill and talent pages (they came back nearly empty), GameSpot's "12 best skills" (403), GamerJournalist (Cloudflare). **So the "many players" evidence is Steam threads, reviews and designer interviews, not Reddit.** Where a view rests on one or two threads I say so.
- **Version caution:** the wiki mixes Classic (2017) and Definitive Edition (2018, "DE") numbers. Example: Arrow Storm is "16 arrows" on one page and "15" on another; Ricochet is 3 AP Classic, 2 AP DE; Farsight is +3 m on one page, +4 m on another. Where they differ I give DE.

---

## 1. Action Points and Source points

### How it works [read]
- **DOS2:** every player character gains **4 AP** at the start of each turn, **carries unspent AP over**, and holds at most **6** ("Player character can have at most 6 Action Points in one turn"; bosses may have 9). A basic weapon attack costs **2 AP**; skills cost 1 to 4 (most 1 to 3). Movement costs AP by distance (more in heavy armor). Every skill also has a **cooldown** in turns and is usable once per turn.
- AP changers: Haste (+1 start, +1 recovery), Shocked (-1/-1), **Adrenaline** (gain 2 AP now, recover 2 fewer next turn), Flesh Sacrifice (elf: +1 AP, +10% damage), Green Tea (-2 AP cost, minimum 1), and talents (section 4).
- **Source points (SP):** a second cost on the strongest skills (1 to 3 SP). The maximum grows with the story to **3** [lead, two guides and a Steam answer agree]. SP **do not refill on rest** [lead]; you refill them from Source pools and puddles, Source Orbs, and from Source Vampirism (1 AP, drains 1 SP from a target without Magic Armour or from a corpse) [read]. Apotheosis (Polymorph) makes all Source skills cost 0 SP for its duration [read]. Pechenin: the Source system "lets players build up to powerful moves" [checked, PC Gamer making-of].
- **Memory:** a skill must be slotted to be used; 4 slots at base Memory, +1 per point; strong skills take 2 or 3 slots [read]. A loadout limit separate from what you know.
- **DOS1 differed:** no fixed 4. Max AP 7 + Constitution, starting AP 2 + (Perception + Speed)/2, AP per turn 3.5 + Speed/2; bow shots and special arrows cost 4 to 6 AP; no max shown [read]. DOS1 had no Source points; it was "manaless", cooldowns only [read].
- **Board game:** gain your Origin's AP each turn, carry the rest over up to **8** (10 with Haste), never between combats; talents cost 0 AP [read].

### What players love [checked]
- The board game reviews agree the AP + cooldown pair is the most faithful, recognizable piece and "a simple system that translates well to board gaming", "doing away with mana and other meters" (Going Analog); RPG Site: "a solid balance between luck and strategy".
- Steam: the loved talents are almost all AP-economy talents (The Pawn, Executioner, Glass Cannon; section 4). Players clearly value *how* AP is spent more than raw damage.

### What players dislike [checked]
- RPG Codex review: "action points are very limited – base is 4 while the max you can hope for is 6. In practice, this more or less limits you to doing 2 meaningful actions a turn at best." Pechenin (2018): "Reduced action points made two large actions per turn feel right" [lead, search summary of the interview].
- PC Gamer (Norris, 2026) calls the AP system "divisive"; Larian answered only that the new game has "a new action economy and character progression system", "intuitive but deep" [checked].

### Fits a tabletop?
Yes, it already did (the board game). Carrying AP over needs one tracker per character. SP as a tiny, event-refilled pool is table-friendly. Memory slots are a loadout list.

### 2d12 mapping
2d12's 4 AP turn is the same size; DOS2 carries AP over where 2d12 turns it into Guard (2d12's is the richer choice: banking becomes defense, not a bigger next turn). **Adrenaline (2 AP now, 2 fewer next turn)** is a clean, self-tracking Talent or Feature pattern; Surge already plays the Source role (Escalation-fed rather than refilled by kills).

---

## 2. Physical and Magic Armour gating crowd control

### How it works [read]
- Two pools over Vitality. Physical Armour absorbs physical damage (weapons, unenchanted arrows, Warfare, blood Necromancy); Magic Armour absorbs elemental and poison damage. **Piercing damage bypasses both** (Bleeding, Marksman's Fang).
- **A status is blocked while the matching armor is above 0, and lands every time once it is 0.** Knocked Down, Crippled, Bleeding, Atrophy, Decaying are Physical-gated; Burning, Chilled, Frozen, Shocked, Stunned, Poisoned, Charmed, Blinded, Terrified, Madness are Magic-gated. Wet ignores armor entirely. Exceptions: some ground effects (slipping on frozen water or blood can knock you down "regardless"), cursed surfaces, and certain map places [read]. Talents change the gate: **Glass Cannon** (you lose the gate yourself), **Torturer** (your damage-over-time statuses ignore the gate and last 1 turn longer) [read].
- Armour does not regenerate by itself in a fight; spells, potions and blessed surfaces restore it, and it refills after combat [read].
- **DOS1 differed:** armor reduced damage and statuses rolled a **saving throw** (Bodybuilding or Willpower) [read]. Pechenin: "The good part about this was that every encounter felt different... But at the same time it really prevented long-term planning, because you didn't know how many people you'd stun, so you couldn't predict what you'd do next turn" [checked]. The armor gate was the cure: near-deterministic control, with a little damage variance "so there's still some RNG there" [checked].
- **Board game differed again:** armor is flat damage reduction per hit (Physical vs Magical), and statuses are **not** gated by armor; they land on a die's special icon [read].

### What players love [checked]
- Predictability: "you have a high chance that things will go as you want them to" (Pechenin). PC Gamer (Litchfield): "every character... is an important vector for both damage and crowd control"; "Every character has to pull triple duty as a tank, DPS, and controller"; "a highly aggressive form of turn based tactics where you're racing to strip enemy defenses and lock down priority targets". He judges its weaknesses "no more than the genre-standard, random chance-based alternative".
- Steam defenders: "The armor system is fine, otherwise it's DOS 1 all again, cc everyone every turn"; it was meant to stop DOS1's "overpowered mages" who acted first and chain-controlled everyone.

### What players dislike [checked; many voices]
- **The split, more than the gate:** Norris (PC Gamer): you were "generally much better off having your party focus on either physical or magical damage"; "you were often best off saving most of your fun abilities until after you'd broken the enemies' armour". Litchfield concedes the mixed party "struggled in the endgame". Steam: "build variety is non existent... the fights end up being a race to decrease armor values to cc and win"; "stacking your party for entirely one way... is superior".
- **Chain control once armor is down:** Steam "Chain stuned": "If you dont go first you're getting chain stun/froze ect till you die"; requests for "a one turn immunity" after a stun. Vincke: the AI "focused on one character, made sure to destroy their physical and magical armour, and then would start to control it, then kill it... it was a dominant tactic. So we had to nerf it a lot" (designers removed most crowd control from the AI).
- **Feels like extra HP bars:** Codex: armor "straight up gives you an additional health bar", "Armour bars also count as forcefields against negative status effects", combat "very repetitive and predictable", the lost "mesmer-style disruption role". Pechenin himself: "players hate to hit armor"; they hit the unarmored enemy first "for the pure psychological joy of digging into HP", though stripping armor first is right.
- **Exceptions confuse:** "my character took 1 step on it and froze, full Magic Armor" (cursed ice).
- **Larian dropped it:** Pechenin, 2026 AMA: the next Divinity will "not keep the magic armor system from DOS2"; "There will be ways to protect your characters from harm, but you will not have to wait before you can use your fun skills on enemies" [checked, quoted by PC Gamer].
- Mods: Divinity Unleashed and Epic Encounters 2 (EE2 removes stuns, "Its impossible to deny someone a turn") are the most named overhauls [checked, one Steam thread].

### What it does to bosses
Bosses carry very large armor (a Steam example: 14k physical and 11k magic) so they cannot be controlled early, then fall to control once stripped; players report two-rounding a boss with Thunderstorm [checked]. The board game instead gives each Boss a printed immunity list and makes **all Bosses immovable** (immune to Knocked Down and forced movement) [read].

### Fits a tabletop?
The gate is easy (two numbers on a sheet). The cost is a second and third HP track per enemy and the "save your fun for later" pacing. Larian's own board game replaced it with damage reduction plus a die-triggered status, which says something.

### 2d12 mapping
The keepable kernel is **"control is certain once a visible condition is met"**, not the second HP bars. 2d12 can get it with a condition the party builds toward (for example a rider that lands only on a target already Pressed or Staggered), one track for every damage kind so mixed parties are never punished, and a short immunity after hard control so no boss is locked down.

---

## 3. The Huntsman, the ranged skills, special arrows, height

### The skills [read; DE values]
| Skill | Cost, cooldown | What it does |
|---|---|---|
| Elemental Arrowheads | 1 AP, cd 4, range 3 | Target a surface near you; for one turn your ranged attacks and ranged skills add that surface's element as bonus damage. |
| First Aid | 1 AP, cd 4 | Heals; removes Crippled, Knocked Down, Blind, Silenced, Bleeding, Burning, Poisoned, Diseased; sets Rested (which protects from Muted, Blind, Crippled, Knocked Down). |
| Pin Down | 3 AP, cd 3 | Physical damage and **Crippled** 1 turn (cannot move, -30% dodge); Physical-gated. |
| Ricochet | 2 AP, cd 4 | A normal arrow that forks to another target within 5 m, up to 2 times. |
| Barrage | 3 AP, cd 3 | Three arrows at three targets of your choice. |
| Sky Shot | 2 AP, cd 3, range 20 | Leap and shoot; gets the high-ground bonus regardless of elevation. |
| Tactical Retreat | 1 AP | Become Hasted, then teleport. |
| Ballistic Shot | 2 AP, cd 4 | +5% damage per metre of distance to the target. |
| Marksman's Fang | 2 AP, cd 2 | Arrow passes through every enemy in a line, Piercing damage, ignores armor. |
| Reactive Shot | 2 AP, cd 2 | Mark a circle; until your next turn you shoot the first three enemies that move in it. |
| Arrow Spray | 3 AP + 1 SP, cd 5 | 15 arrows in a 60-degree arc. |
| Farsight | 1 AP + 1 SP | A target's ranged attacks and skills gain +3 or +4 m (pages differ). |
| Assassinate | 3 AP | One heavy shot, +50% from Stealth (a player: needs sneaking, not invisibility). |
| Glitter Dust | 1 AP, cd 3 | Marked: -100% dodge, cannot become invisible, **loses the high-ground bonus**, and attackers below it take no low-ground penalty. |
| Arrow Storm | 3 AP + 3 SP, cd 4 | 15 or 16 arrows fall in a target area. |

- The **Huntsman ability** itself adds **+5% high-ground damage per point** (to everything: arrows, spells, special arrows) and reduces the low-ground penalty; skills need 1 to 5 points. Base high ground: +20% damage [lead, one guide] and extra range [checked, Steam]. Skill damage scales with Warfare, not Huntsman [read].
- **Crafted Huntsman skills** (a Huntsman skillbook + an elemental skillbook): Throw Explosive Trap (+Pyro), Throw Dust (+Geo, Blind, clears surfaces), Cryotherapy (+Hydro, eat frozen surfaces for Magic Armour), Erratic Wisp (+Aero, target teleports randomly each time it takes a physical hit); Source versions: Deploy Mass Traps, Dust Blast, Mass Cryotherapy, Evasive Aura [read].
- **DOS1** (Expert Marksman): Ricochet forked up to 4 times; Barrage was a line of arrows; Rain of Arrows (300% weapon damage to each enemy), Splintered Arrow (250% split across enemies in 8 m), Vampiric Arrow, Shrapnel Scatter (explode a corpse or container), Ranged Power Stance and Precision Stance (toggles), and talents **Quickdraw** (-1 AP for a plain bow shot) and **Elemental Ranger** [read].

### Which skills players love [checked; three or four Steam threads, so medium]
- Most named as kept: **Ballistic Shot, Sky Shot, Barrage, Ricochet, Marksman's Fang, First Aid, Tactical Retreat** ("the only ones worth having", one level-23 player). Ricochet: "3 targets from far away with 2 AP is a sweet deal"; Ballistic adds "up to 100% damage for 20m, easy to get on high ground".
- Disliked: "Pin Down... 3 AP cost often felt like an awkward price"; "Reactive Shot is too finicky and unreliable"; Elemental Arrowheads "situationally useful, but I rarely used it" (others: "sweet extra damage", dip it in your own blood pool for physical); Marksman's Fang "seems nice, but mostly wasn't" because ignoring armor did not open control the way stripping armor did; Glitter Dust "too situational".
- The archer's real engine is **height + a big basic shot + extra AP**: "Your basic attack is very strong if you get to a high position, so you don't need fancy attacks- you need AP, and mobility to get to a perch"; "teleport to the high ground and just completely waste the enemy using all that AP you get from Glass Cannon".

### Special arrows [read]
- **DOS2:** 15 arrow types, each a consumable crafted from an arrowhead + shaft (+ an ingredient): Fire, Poison, Water, Shocking, Poisoncloud, Freezing, Explosive, Slowdown, **Charming** (no damage, Charmed 1 turn), Blessed Water (heals an area), Smokescreen, Cursed Fire, Static Cloud, Steamcloud, **Knockdown** (100% damage, Knocked Down 1 turn). Elemental ones deal 70% of a basic attack, physical ones 100%; each sets one status and often a surface; each is gated by the matching armor. Talent **Arrow Recovery**: 33% chance to recover a special arrow.
- **DOS1:** 22 types, including **Silver Arrow** (armor -50 for 2 turns: an armor breaker), stat-lowering arrows (Weakening, Withering, Blinding, Hindering, Slowness, Ignorance, Cursing) and Stunning, Freezing, Charming arrows with a saving throw.
- **Board game:** no ammunition count is in the rules I read; consumables are cards, at most 3 in the backpack [read].

### What players think of special arrows [checked]
- Hoarded: "I horde my arrows, lol. Occasionally the CC arrows are really handy for bosses"; "You can play the Ranger effectively without ever using a special arrow".
- Abundant: "Even without Thievery you get a ridiculous amount of materials... You'll practically never run out of poison or slowdown arrows... you can make a huge stack of charm arrows that it's not even fair". So Arrow Recovery "is pretty bad".
- So counting arrows bought nothing: they were either hoarded (never used) or effectively unlimited.

### Height [read]
High ground: bonus damage and range; low ground: a penalty. Huntsman scales the bonus; **Sky Shot** grants it anywhere; **Glitter Dust** takes it away from the marked target and removes the attacker's low-ground penalty. Cloak and Dagger, Phoenix Dive, Tactical Retreat and wings are how archers reach perches [checked].

### Fits a tabletop?
Most skills are one line of rules (fork to a second target, three targets, a line, distance bonus). Fifteen ammo types with a stock count do not fit; the evidence says they were hoarded or infinite anyway. Height is easy if the map marks elevation.

### 2d12 mapping
2d12's Trick Shots (Pin, Startle, Knock Back) already turn the special arrows into options without stock, which is what the evidence supports. **Elemental Arrowheads** gives a no-bookkeeping way to keep elemental variety: one Action to take a damage subtype from a hazard, Zone or light source in reach, for the rest of the turn. **Sky Shot / Glitter Dust** suggest height as one named Boon kind that a card can grant or deny.

---

## 4. Talents

### How it works [read]
DOS2: a talent point at levels 1, 3, 8, 13, 18 (and 23+, out of reach in DE); a flat list, no tree; some need 1 point in an ability or a race; a few are mutually exclusive (Executioner / The Pawn; Glass Cannon / Lone Wolf; Demon / Ice King). Free respec (Magic Mirror) exists [read; respec cost from the Codex review, checked].

The list as asked, with the wiki text [read]:
- **Lone Wolf:** +2 max AP, +2 recovery, +30% Vitality and armor, doubled invested attribute and ability points (not Polymorph); only with at most 2 characters in the party. DE added caps. DOS1's Lone Wolf: no companion at all, +60% vitality, +1 AP.
- **Glass Cannon:** start every turn at maximum AP, but your armor no longer protects you from statuses. (DOS1: double AP recovery, half vitality.)
- **Executioner:** +2 AP after a killing blow, once per turn (needs 1 Warfare).
- **The Pawn:** 1 AP of free movement each turn.
- **What a Rush:** below 50% Vitality, +1 max AP and +1 recovery.
- **Savage Sortilege:** spells can critically hit (normally only weapons crit).
- **Elemental Ranger:** arrows deal bonus elemental damage from the surface the target stands in (needs 1 Huntsman).
- **Elemental Affinity:** -1 AP on a spell while standing in a surface of its element.
- **Far Out Man:** +2 m to spell and scroll range.
- **Opportunist:** you can make attacks of opportunity (DOS2 gives none by default). **Duck Duck Goose:** you avoid attacks of opportunity.
- **Picture of Health:** +3% Vitality per point of Warfare.
- **Torturer:** your Burning, Poisoned, Bleeding, Necrofire, Acid, Suffocating, Entangled, Death Wish, Ruptured Tendons ignore armor and last 1 turn longer.
- **Ambidextrous:** -1 AP for grenades and scrolls with a free off hand.
- **Hothead:** at maximum Vitality, +10% critical chance and +10% accuracy.
- **Pet Pal:** talk to animals.
- Others worth noting: Comeback Kid (survive a fatal blow at 20% once a combat), Walk It Off (all statuses 1 turn shorter, good ones too), Living Armour (35% of healing also restores Magic Armour), Mnemonic (+3 Memory), Five-Star Diner (double food and potions), Escapist, Unstable (explode on death), Leech, Demon / Ice King (resistance swaps), All Skilled Up / Bigger and Better (raw points).
- Gift Bag "Divine Talents" (optional, DE): **Indomitable** (after Crippled, Frozen, Knocked Down, Petrified or Polymorph, immune to those for 1 turn; once every 3 turns), Sadist, Haymaker (never miss, never crit), Greedy Vessel, Gladiator, Soulcatcher, Magic Cycles.
- **DOS1 extras with a clear rule:** **Bully** (+50% damage to Slowed, Crippled or Knocked Down targets), **Stand Your Ground** (cannot be knocked down), Headstrong, Lightning Rod (stun immunity), **Quickdraw** (-1 AP bow shot), Sidestep, Sidewinder (no flanking penalty).
- **Board game:** 36 talent tiles, **one copy of each in the supply, so no two Origins share a talent**; a talent is either always-on or used **once per location by flipping it face down**; talents cost 0 AP; "training talents" let you learn a school's level 3+ skills and also give a keyword for story checks; Pet Pal survives as a trait [read; Going Analog].

### What players love, and the must-picks [checked; several Steam threads]
- **The Pawn**: "the best talent in the game", "AP for AP I think it delivers more damage output and tactical options than Executioner"; others prefer Executioner. **Executioner**, **Hothead** ("so you don't get Xcom misses at 85%"), **Glass Cannon** (for archers who go first), **Opportunist** ("the best on all melee"), **Far Out Man** ("a must for ranged"), **Savage Sortilege** (for crit mages), **Picture of Health** ("amazing for Warfare characters... a great tank"), Living Armour ("underrated"). One ranger thread lists "Glass Cannon, Hothead, Elemental Ranger, and Executioner as must-have talents" [lead].
- **Lone Wolf** is the "monster" pick: two Lone Wolves were widely treated as easy mode; DE caps were added "because lone wolfs without them become extremely imbalanced"; still "viable" after [checked].
- What the loved ones share: they change **the action economy or a rule** (free movement, AP on a kill, full AP each turn, a reaction you did not have, statuses that ignore armor) or set a **trade or a condition** (Glass Cannon's risk, Hothead's full-health window, What a Rush's low-health window). The flat ones are the scorned ones.

### Traps and complaints [checked]
- "Guerrilla is complete garbage", "Ice King and Demon are both pretty crappy", "Comeback Kid is not very good because it restores you to 20%", "Leech heals you for about 5% HP. That's less effective than a food item"; Bigger and Better and All Skilled Up are "one singular point... not worth a talent"; Arrow Recovery "pretty bad".
- Structure: "The biggest issue with Talents in Divinity (both 1 and 2) are how they have created no real direction with them, but attempted to 'put in some cool stuff'" (Steam); "One of my (few) complaints... is the lack of great talents... they don't seem to make enough difference" (Steam); Codex: talents "already the weakest part of the DOS1's character system, and here they are just as bad, if not even worse... the rest will be either trap options or very minor boosts".
- **Pet Pal shows trap 3 exactly:** "one of the most fun talents in the game... a lot of quests in act 2", but players advise taking it on one character only, or respeccing into it for the animal quests and out again; mods give it free to everyone [checked, one Steam thread + search summary].

### Fits a tabletop?
The good ones are one sentence each and track nothing new (Executioner: once per turn; Hothead: at full HP; The Pawn: 1 free move). The board game's once-per-location flip is a tidy table device.

### 2d12 mapping
The loved pattern, "change the action economy or bend one rule, or open a conditional window", is horizontal and avoids numbers on rolls: a free square of movement each turn, AP back on a kill once per Round (the Archer's Thrill of the Kill is already this shape), a Reaction trigger you did not have, a Condition that ignores one protection. Pet Pal argues again for non-combat Talents on a track of their own.

---

## 5. Skill crafting, mixing schools, "any skill from any school"

### How it works [read]
- No classes: the 14 presets are starting packages; any character learns any school's skillbook if it has the required points in that ability (1 point opens the Starter and Novice skills, up to 5 for Master), and slots it in Memory.
- **Skill crafting:** "Simply combine any elemental book with any non-elemental book to gain a new skill" (Kickstarter update #41, Aug 2017, checked); 48 crafted skills reachable [lead]; each needs 1 point in both schools (some need 2); combining with a Source book gives a Source skill; crafted books cannot be bought, only crafted or found. Examples: Necromancer + Hydro = Blood Rain; Huntsman + Hydro = Cryotherapy; Huntsman + Aero = Erratic Wisp; Necromancer + Pyro = Corpse Explosion.
- **Polymorph** gives +1 free attribute point per point invested instead of a damage bonus; its skills are transformations (wings, tentacles, Chicken Claw, Skin Graft resets all cooldowns, Apotheosis) [read]. **Summoning**: the **Incarnate takes the element of the surface it is summoned on**, and later "Infusion" spells add powers; only one primary summon at a time [read].
- **Board game:** a skill of level 1 or 2 can come from **any of 12 schools**; level 3+ needs that school's training talent; the rulebook tip says to focus a few schools [read]. RPG Site worried that 7 skills per school forces multi-classing [checked].

### What players love [checked]
- The classless freedom: "a mind-boggling array of weird heroes" (PC Gamer review) [lead]; "mixing specialisations in low commitment increments, such as one Scoundrel point on a mage to unlock an Adrenaline skill" (gamecloud) [lead]; build talk on Steam is full of "a point of Geo and Scoundrel... combine a basic skillbook from each for Venom Coating", "2 points in Warfare to get Phoenix Dive", "Polymorph 1 for the Camouflage".
- Larian on crafting: "Experiment away!" (KS #41). Pechenin: players "overwhelmingly and regardless of skill... buy skillbooks over any other item from shops" [checked].
- Polymorph singled out by Codex as "the only skillset in the game that tries to do something more than big explosions".

### What players dislike [checked]
- Codex: switching skillsets is "as easy as putting 1-3 points into its relevant ability"; with free respec "nothing you do with regard to your character has any weight behind it... There is no planning. No differentiation. No crazy builds."
- The armor split narrows real builds to "like 4 different playstyles" (Steam), and hybrids "require a good understanding of the mechanics" [lead].

### Fits a tabletop?
"Two picks unlock a third" is easy on paper (a recipe list). Free respec is a campaign choice. "1 point opens a school's basics" is clean.

### 2d12 mapping
For magic's Paths and Schools, "two traits together open one combined option" is crafting without crafting. The board game's training talent is a **permission gate** (Lucas's trap 1); the DOS2 version that players praise is the cheap dip, where one small pick lends a single tool from another kit.

---

## 6. Surfaces and elemental combinations (only what fits a table)

### How it works [read]
- Surfaces (fire, water, ice, oil, poison, blood, web) and clouds (steam, smoke, poison) set statuses on contact and react: fire ignites oil and poison, water conducts electricity, ice makes characters slip, fire melts ice and evaporates water into steam. Blessed and cursed versions heal or harm more.
- **Board game:** each map space holds **one environment effect**; a new one replaces the old. CHARGED, WET, WARM, OILY each give **+2 damage of one type** (air, water, fire, earth) to anyone there; DIFFICULT TERRAIN costs +1 AP to enter (Bosses ignore it). Effects apply after damage [read].
- Talents and skills that read the ground: Elemental Ranger, Elemental Affinity, Elemental Arrowheads, Conjure Incarnate, Cryotherapy, Oily Carapace [read].

### What players say [checked]
Loved as the series' heart ("The combinations of skills and environmental effects are still alive and kicking", Codex). Disliked: lingering electrified pools that stun your own party, "forcing me to do 'cleanup'"; cursed surfaces "much too common"; elemental combos "weaker across the board due to being blocked by armour" (Codex).

### Fits a tabletop?
The board game's version (one tag per space, a +2 to one damage type, replace on overwrite) is the right size. Free-flowing spread, clouds and durations per tile are not.

### 2d12 mapping
A Zone or space could carry one elemental tag that makes everyone in it Weak (r/w) to one subtype, replaced by the next tag. Archer and Paladin Talents could read it (Elemental Ranger / Arrowheads).

---

## 7. Statuses: how they stack and combine

### How it works [read]
- **DOS2 combinations:** Shocked twice, or Shocked while Wet, makes **Stunned**; Chilled twice, or Chilled while Wet, makes **Frozen**; Burning turns Wet into Warm and removes Enwebbed; fire removes Frozen and Chilled; water removes Burning. Frozen and Stunned grant immunity to a list of other statuses (Frozen: immune to Bleeding, Poisoned, Shocked, Stunned, Taunted, Terrified...), so two hard controls never stack.
- Control statuses: Knocked Down (cannot act, 1 to 2 turns), Frozen (cannot act, -100% dodge), Stunned (cannot act), Crippled (cannot move), Chilled (-35% movement, -30% dodge), Slowed (-50% movement), Shocked (-1 AP), Blinded (shorter range, -35% accuracy, no attacks of opportunity), Charmed, Terrified, Madness. Damage over time: Burning, Poisoned, Bleeding (Piercing, ignores armor), Necrofire, Acid (eats Physical Armour), Suffocating (eats Magic Armour). Cures and counters are listed per status (First Aid, Armour of Frost, Bless, Haste cures Crippled and Slowed) [read].
- **DOS1:** "All statuses have duration stacking but not intensity stacking"; Wet + Chilled = Frozen; Warm + Warm = Burning; saving throws per status [read].
- **Board game, the cleanest table version:** a status is a card placed on the target's **cooldown track** at the slot the attack names (its duration); it slides one slot at the end of each turn and clears when it falls off. **Reapplying never stacks**: if the new duration is higher, slide the existing card up to it. **Durations cap at 5 (3 for minions).** Ongoing skills sit on the same track face up and flip face down at a printed slot. "Start of turn" effects resolve in the owner's chosen order. Bosses list immunities and are immovable [read].

### What players say [checked]
The combos are loved; the complaint is the lock: chain Stun and Freeze once armor is gone, asked-for "one turn immunity", Indomitable added as an optional talent that does exactly that.

### Fits a tabletop?
The board game proves it: one track per creature holds both cooldowns and statuses.

### 2d12 mapping
2d12's Conditions can borrow **"a second matching hit escalates the Condition"** (Slowed then Immobilized, as Chilled then Frozen) and the board game's rules: **refresh to the longer duration, never stack, cap durations, a short immunity after hard control**.

---

## 8. Tabletop and board game adaptations

### The official board game [read; reviews checked]
*Divinity Original Sin: The Board Game* (Larian with Lynnvander, then Larian's own team; Kickstarter Nov 2019; delivered Dec 2023). Co-op, 1 to 4, campaign book "Divine Atlas" as the board, point-to-point spaces.
- **What translated well [checked]:** AP + cooldown track ("instantly recognizable"); dice in three colors (white basic, blue more specials, red more hits), 5 of each at most; Source as a tiny pool refilled at each new location and spent on **a reroll of any dice (any roll, anyone's)** or on Source skills; statuses on the cooldown track; elemental spaces; friendly fire; skills that combo between players (Ifan's sword deals more to a target with any condition; his Bleed spell deals more to a Poisoned target; Fane poisons) (GamesRadar); levelling "gives you lots of options and the chance to plan for combos".
- **What changed:** armor became flat damage reduction, statuses trigger on a die's special icon (no armor gate); bosses are immovable with immunity lists and play a tactics deck that spends AP; minions target by a rolled targeting die (closest, lowest armor, most Source...); levels come at story points, not XP.
- **What did not:** "combat that can drag", "very time-consuming and can feel repetitive", rules edge cases hard to find (GamesRadar); point-to-point map loses positioning ("less open to the precise tactical positioning", Going Analog; "more story-driven than map-based", Gaming Trend).

### Fan conversions
None found: no tabletop or 5e conversion with rules appeared on GM Binder, Homebrewery, DMs Guild or D&D Wiki in two searches [lead, negative result]. DOS2's own Game Master Mode runs tabletop-style campaigns inside the game [lead]. Steam mods change the armor system to saving throws (CON + remaining armor % as a resist chance) or remove stuns [checked].

### 2d12 mapping
The board game's choices are a ready-made answer to "what fits a table": one track per creature, Source as a reroll, one environment tag per space, immovable bosses with listed immunities.

---

## Other observations (not asked, kept short)

- **Pacing by bars:** Larian tunes enemy damage to kill in 4.5 hits so the bar shows "just a sliver" before the fifth; "They want to feel threat piling up, not having their characters one-shotted" (Pechenin) [checked].
- **"OP as they want to be":** Larian embraced player-found exploits but placed Act III fights that counter dominant tactics (Fortified enemies that cannot be teleported) [checked].
- **Sources of control the AI was denied:** Larian removed most crowd control from the AI because focus-strip-lock was "a dominant tactic" [checked].

## Sources

Rules (wiki, read as wikitext through `https://divinity.fandom.com/api.php?action=parse&page=<title>&prop=wikitext`):
- https://divinity.fandom.com/wiki/Original_Sin_2_Action_Points
- https://divinity.fandom.com/wiki/Action_Points_(Original_Sin)
- https://divinity.fandom.com/wiki/Original_Sin_2_Armour
- https://divinity.fandom.com/wiki/Status_Effects_(Original_Sin_2)
- https://divinity.fandom.com/wiki/Status_Effects_(Divinity:_Original_Sin)
- https://divinity.fandom.com/wiki/Knocked_Down_(Status), /Frozen_(Status), /Stunned_(Status), /Chilled_(Status), /Burning_(Status), /Bleeding_(Status), /Wet_(Status)
- https://divinity.fandom.com/wiki/Huntsman
- https://divinity.fandom.com/wiki/Pin_Down, /Ricochet_(Original_Sin_2), /Barrage_(Original_Sin_2), /Ballistic_Shot, /Arrow_Spray, /Arrow_Storm, /Marksman%27s_Fang, /Sky_Shot, /Elemental_Arrowheads, /First_Aid_(Original_Sin_2), /Reactive_Shot, /Farsight, /Glitter_Dust
- https://divinity.fandom.com/wiki/Expert_Marksman
- https://divinity.fandom.com/wiki/Arrows_(Divinity:_Original_Sin)
- https://divinity.fandom.com/wiki/Original_Sin_2_Munitions
- https://divinity.fandom.com/wiki/Original_Sin_2_Talents
- https://divinity.fandom.com/wiki/Original_Sin_Talents
- https://divinity.fandom.com/wiki/Torturer_(Original_Sin_2)
- https://divinity.fandom.com/wiki/Sourcery_(Original_Sin_2), /Source_Vampirism, /Source_Orb, /Memory
- https://divinity.fandom.com/wiki/Original_Sin_2_Polymorph, /Original_Sin_2_Summoning, /Conjure_Incarnate, /Original_Sin_2_Skills
- https://divinity.fandom.com/wiki/Divinity_Original_Sin:_The_Board_Game, /Rulebook_(DOS:Boardgame)

Board game rulebook:
- https://boardgame.divinity.game/DOS_BoardGame_Rulebook.pdf (final rulebook, read in full)
- https://boardgame.divinity.game/DOS_BoardGame_Errata_Faq.pdf (downloaded, not read)

Designers and press:
- https://www.gamedeveloper.com/design/designing-drama-into-the-turn-based-combat-of-i-divinity-original-sin-2-i- (Pechenin, 2018)
- https://gamebanshee.com/k4wac (excerpt of the same interview)
- https://www.pcgamer.com/the-making-of-divinity-original-sin-2/ (Vincke, Pechenin)
- https://www.pcgamer.com/games/rpg/divinity-will-officially-wave-goodbye-to-original-sin-2s-broken-armour-system/ (Norris, 9 Jan 2026; Pechenin AMA quotes)
- https://www.pcgamer.com/games/rpg/divinity-original-sin-2s-brilliant-armor-system-is-one-of-a-kind-in-rpgs-and-im-bummed-well-apparently-never-see-it-again/ (Litchfield, 11 Jan 2026)
- https://rpgcodex.net/content.php?id=10848 (RPG Codex review, through a summarizing reader)
- https://rpgcodex.net/article.php?id=10707 (Kickstarter update #41, skill crafting; through a summarizing reader)
- https://www.gamesradar.com/tabletop-gaming/divinity-original-sin-the-board-game-review/
- https://www.goinganalogshow.com/article/58/how-faithful-is-divinity-original-sin-the-board-game-to-its-video-game-origins
- https://rpgsite.net/preview/15252-divinity-original-sin-the-board-game-early-impressions
- https://gamingtrend.com/feature/previews/divinity-original-sin-hits-the-tabletop-divinity-original-sin-the-board-game-preview

Steam discussions (app 435150, `https://steamcommunity.com/app/435150/discussions/0/<id>/`), read directly:
- 1620600279665127124 "Best and worst talents."
- 1353742967810078010 "Skills/Talents that are meh/useless"
- 1495615865212518687 "Best ranger talents?"
- 1488861734096002580 "Ranger skills to learn?"
- 1692659135912947365 "Is huntsman a joke ability?"
- 1630790987591759042 "Archer or Scroundel?"
- 1495615865224554554 "Ranger build idea's"
- 3223871682630422068 "What skills to pair with a ranged huntsman?"
- discussions/3/1495615865219872700 "Wayfarer/Ranger builds?"
- 1483232961043426495 "Armor system- Party diversity = you work twice as hard?"
- 1483232961050709584 "Wasn't Magic Armor suppose to negate magic Crowd Control?"
- 1495615865208644861 "Getting really annoyed with the armor/magic system."
- 1734338354738887877 "Does Definitive Edition do anything about the Physical/Magical Armor system?"
- 1290691308584602049 "Chain stuned"
- 3192490990765899756 "Best (combat) overhaul mod?"
- 1742220359694847640 "Definitive Edition & Lone Wolf Builds"
- 1642041886374258606 (Pet Pal, through a summarizing reader)

Leads only (search summaries): Source point maximum and refill guides (twinfinite, Steam 1635292137550318543); the 20% base high-ground figure (Fextralife Combat page); the 48 crafted skills (GameSpot gallery); classless praise (PC Gamer review, gamecloud); Lone Wolf "easy mode" threads; no fan tabletop conversions found.

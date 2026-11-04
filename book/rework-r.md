# Pack R: the playtest 2 rework. Part 1: the numbers (2026-11-04)

**Status: the numbers are done; the decision sheet (section 11) is the next session's work (Lucas: "numbers first, stop before the sheet").** Nothing here is applied to rules-src or Foundry. The decisions this prepares were taken on 2026-11-02 (`book/playtest-2.md`, "Decisions"; rules-backlog.md "PLAYTEST 2: THE REWORK"); playtest 3 (`book/playtest-3.md`) is the baseline. Every table below is from **`book/ruler/rework.md`**, written by `node book/ruler/rework.mjs` (about 5 minutes; how it works: `book/ruler/README.md`, "The playtest 2 rework"). Short form: 4 AP = 4 AP + 1 Reaction AP; "the rework" = 4 AP for PCs and NPCs with Escalation as a level; "at its factors" = with the Health factors of section 3.

**How it was measured.** The spec ruler with the map model (positions, Cover, Flanking, Opportunity Attacks), level 1: 2 P1 Smite Paladins + 2 A1 Archers (Double Shot, and the same with Rolling Shot: each number is the mean of the two parties), the book's Health factor (Level + 17) / 16, half the fights starting with Momentum (1 Escalation). The 4 AP builds are `book/ruler/rework/*.txt`: today's cards with the turns cut to 4 AP and a Reaction each (the Paladin's Opportunity Attack, the Archer's Quick Draw as a stand-in for its Hallmark Reaction). The NPCs are the E3 Bestiary at level 1 (Medium, exact averages; the model's NPCs make their 2 Basic attacks a turn and keep 1 AP for moving; Specials are not simulated). What the model leaves out stays out: Body and Mind are one Health Pool for Down (but their damage is now counted apart for Bloodied / Strained), no NPC Specials, no walls.

## 1. The playtests against the ruler

Playtest 3's fight (Ogre Chieftain Elite, Orc Warrior Standard, Bandit Thug Grunt, 2 Goblin Sneaks Minions: CV 400) run 1,000 times in the ruler with today's rules and the P1 / A1 builds:

| | Rounds | PCs dealt a round | NPCs dealt a round | Party Health lost | A PC Down |
|---|---:|---:|---:|---:|---:|
| Playtest 3 (Lucas's table) | 4 | 62 | 36 | 143 of about 123, with the heals (one Down) | 1 of 4 |
| Playtest 2 | 4 | 63 | 47 | 188 of about 123 (three Down, 8 Rally Points) | 3 of 4 |
| The ruler, 2 Smite + 2 Double Shot | 3.7 | 81 | 18 | 34% | 36% |
| The ruler, Smite + Lay On Hands + Double + Rolling | 3.7 | 82 | 18 | 20% | 25% |
| The ruler, the rework at its factors (section 3), 2 Smite + 2 Double | 3.6 | 79 | 18 | 31% | 35% |

- **The PCs dealt three quarters of the ruler's number** (62 against 81): the playtest's builds are not the ruler's (a Dwarf Paladin with Holy Wrath and Aura of Protection, a Human Paladin on Appeal and Mind, two Rally turns, a turn on Aura), and the ruler's plan never wastes an AP. Normal.
- **The NPCs dealt twice the ruler's number** (36 against 18 a round). The ruler's NPCs have no Special Actions and no Weapon Attack; the playtest's used Brutal Swing, Low Blow, Dirty Trick, Ground Slam and Rally the Tribe every round (the Bestiary's Specials are × 1.4 to × 3.5 of a Basic attack, section 10), and the Ogre Chieftain is High in Body. **So the playtests are harder than the book's "a third of the Health" because the Specials are not in the ruler's calibration**, not because of the AP economy. Pack E3's refit was calibrated without them too (bestiary.md said so: "the sim ignores NPC special Actions"). This is the number to remember when the sheet sets the Health cut: the ruler's "a third" is a floor; a GM who uses the Specials as written gets about half.
- The rework at its factors gives the same fight as today (3.6 rounds, 31%): the rework doesn't change the balance by itself; what changes it is what the sheet decides about Specials and Health.

## 2. The AP cut: a turn at 4 AP against 5

Damage a turn against one creature at Defense 13, the plan's main turn, today's build against its 4 AP version (rework.md section 1 has every turn):

| Class | Today (5 AP) | At 4 AP | 4 AP / today | Today's Nova | 4 AP Nova | Nova ratio |
|---|---|---|---:|---|---|---:|
| Paladin (Smite) | Divine Surge + Smite 3 + 2 Weapon Attacks 21.3 | Divine Surge + Smite 2 + 2 Weapon Attacks 21.3 | **100%** | Holy Wrath 3 + Smite 2: 38.9 | Holy Wrath 3 + Weapon Attack: 32.9 | 85% |
| Paladin (Lay On Hands) | Lay On Hands 2 + 3 Weapon Attacks 20.8 | Lay On Hands 2 + 2 Weapon Attacks 16.7 | **80%** | 36.7 | Lay On Hands 2 + Holy Wrath 2: 27.2 | 74% |
| Archer (Double Shot) | Double Shot 3 + Lock & Loose + Pinning Shot 28.3 | Double Shot 2 + Lock & Loose + Pinning Shot 28.3 | **100%** | - | - | - |
| Archer (Rolling Shot) | Rolling Shot 3 + Lock & Loose + Pinning Shot 27.2 | Rolling Shot 2 + Lock & Loose + Pinning Shot 24.6 | **90%** | - | - | - |

**The 5th AP of today's main turns buys no damage.** Smite 3 is Smite 2 plus Guard 1d8 + [Mod]; Double Shot 3 is Double Shot 2 plus an Evade 1. Only Lay On Hands (three Weapon Attacks) and Rolling Shot (the bigger roll) lose a fifth or a tenth, and the Novas lose 15 to 25% (a 3 AP Encounter Action leaves 1 AP). In the fights (section 3) the cut shows where a PC moves: an AP spent on an Advance now drops a Weapon Attack (5.4) that the 5 AP turn absorbed; the party's damage a PC turn goes from 24.5 to 24.0 (−2%). **So "Health about −20%" is not what the fights need** (section 3): the cut in damage is 2 to 10%, and it is the Reaction AP and Escalation as a level that change the fights.

The exchange rate at 4 AP: the baseline turn stays 23.3 (the Bestiary's PC baseline at Defense 13), so **1 AP = 5.8 DE** (was 4.66); a Weapon Attack is still 5.4 (0.93 AP: At-will at 4 AP is a little under its band). Every price in prices.md (DE per AP) moves by ×0.8 when read in AP.

## 3. The fights rule by rule, and the Health factors

The CV 4 encounters (rounds · the party's Health lost · a PC goes Down · won), one piece of the rework added per column; the NPCs keep today's Health and damage:

| Encounter | Today | PCs 4 + 1 AP | + NPCs 4 + 1 AP | + Escalation as a level |
|---|---|---|---|---|
| 4 Standards | 3.5 r · 32% · Down 28% | 3.5 r · 32% · Down 26% | 3.5 r · 30% · Down 22% | 3.5 r · 29% · Down 22% |
| Elite + 2 Standards | 3.6 r · 34% · Down 34% | 3.7 r · 33% · Down 31% | 3.7 r · 32% · Down 28% | 3.6 r · 29% · Down 24% |
| 2 Elites | 3.7 r · 35% · Down 39% | 3.8 r · 37% · Down 40% | 3.8 r · 35% · Down 35% | 3.7 r · 31% · Down 29% |
| 8 Grunts | 3.8 r · 37% · Down 27% | 3.6 r · 34% · Down 20% | 3.5 r · 32% · Down 16% | 3.5 r · 30% · Down 15% |
| 2 Standards + 8 Minions | 4.1 r · 33% · Down 31% | 3.5 r · 27% · Down 17% | 3.5 r · 25% · Down 15% | 3.5 r · 23% · Down 14% |

- **4 + 1 AP alone changes nothing in rounds** (the cut is 2%) and makes the fights a little safer: the Reaction AP gives the party 4 to 5 Reactions a fight (24 damage: Opportunity Attacks on NPCs that walk past, Quick Draws on NPCs closing in), and Grunts and Minions, which walk more, pay for it.
- **NPCs at 4 + 1 AP** take 1 to 2 points off the Health lost: a Standard still strikes twice when it stands next to its target (its 2 Basic attacks are 2 AP), and loses more of a Strike when it has to walk two Advances.
- **Escalation as a level** takes 1 to 4 points more off and cuts the Downs against Elites by a quarter: Hallowed Stance is on from Escalation 2 (today it never is: Divine Surge spends it every round), Divine Surge still fires every round, Killer's Focus is on from round 2 or 3. The PCs' damage doesn't move (24.2 a turn): today's Actives are cheap (Divine Surge 0 AP, Pinning Shot 1 AP), so a level gives defense, not damage.

**The factors.** NPC Health × h for 3.5 rounds, then PC Health × p for a third of the party's Health (bisection; NPC damage stays):

| NPCs | NPC Health × h | PC Health × p | A Standard · the Paladin · the Archer | 4 Standards at these factors |
|---|---:|---:|---|---|
| 4 + 1 AP (the rework) | **0.98** | **0.84** | 61 · 35 · 23 (today 63 · 40 · 27) | 3.5 r · 32% · Down 31% · won 99% |
| 5 AP | 0.98 | 0.89 | | 3.4 r · 32% · Down 30% |

The 20% comes off the PCs, not the NPCs: NPC Health stays (the PCs' damage didn't drop), and the PCs need less Health because they take less (Reactions, Hallowed Stance, Divine Surge's Guard every round). **Note the Down rate:** at p 0.84 a PC goes Down in 31% of the normal fights (today 28%) and 42% against 2 Elites (39%); PC Health is the lever that moves Downs, so the sheet may prefer p about 0.9 and accept 30% lost. Fights by CV at the rework's factors (today in brackets): easy 2.6 r · 21% (2.6 · 20%), normal 3.5-3.7 · 32-36% (the same), hard 4.7 · 49% (4.8 · 48%), deadly 5.6-5.9 · 66-69%, won 67-73% (6.0-6.2 · 70-72%, 69-72%): the Bestiary's targets hold.

## 4. Escalation as a level

**Timing** (4 Standards at the rework's factors, half the fights with Momentum):

| Per PC | all fights | with Momentum (starts at 1) | without |
|---|---:|---:|---:|
| Fights with a turn at Escalation 1 or more · such turns a fight | 96% · 2.4 | 100% · 2.9 | 93% · 2.0 |
| Fights with a turn at Escalation 2 or more · such turns a fight | 87% · 1.4 | 96% · 1.9 | 78% · 1.0 |
| Fights with a turn at Escalation 3 · such turns a fight | **49% · 0.6** | **75% · 0.9** | **22% · 0.2** |

A PC's turns a fight at Escalation 0 / 1 / 2 / 3: 0.5 / 1.0 / 0.9 / 0.6 (today: 0.5 / 2.0 / 0.5 / 0.0: spending keeps everyone at 1). **An Encounter ability that needs Escalation 3 is used in half the fights: three quarters with Momentum, one in five without** (a 3.5-round fight reaches Escalation 3 in its 4th round when it starts at 0). A Round ability from Escalation 2 fires 1.4 times a fight, from Escalation 1 2.4. Momentum is what makes an Escalation 3 ability exist at levels 1-2; the sheet should say so when it writes Momentum into the book.

**What each Passive is worth** (the 4 AP main turn at Escalation 3, Defense 13; the defensive ones per fight):

| Passive (its level today) | Build | Worth | Share of a turn |
|---|---|---:|---:|
| Killer's Focus (2+) | Archer | +2.7 damage a turn | 11% |
| Radiant Zeal (1+) | Paladin | +3.5 damage a turn | 16% |
| Marked Quarry (a Feature: the Boon and the Tier 1 floor) | Archer | +3.9 damage a turn | 16% |
| Divine Surge (an Active, 1, Round, 0 AP) | Paladin | 5.3 allies' damage + 6.2 Guard used a fight | about 4 DE a turn |
| Hallowed Stance (2+) | Paladin | 2.2 damage reduced a fight | 0.8 a turn |
| Font of Mercy (1+, a Feature) | Paladin | 1.1 Health a fight | |
| Elusive (1+) | Archer | 0.7 damage a fight (0.6 Strikes take its Bane) | |

The Archer's Actives as a level (its damage a fight, 4 Standards): Pinning Shot every round from Escalation 2 72.8 (0.8 Immobilized a fight) · Twin Shot every round from Escalation 3 72.6 · Twin Shot once a fight (Encounter) 72.3 · neither (a Weapon Attack) 71.9. **The Actives are worth 1 to 2 damage a fight each: at 1 AP they are Weapon Attacks with a rider**, so making Twin Shot an Encounter ability loses nothing; the Escalation 3 abilities the rework wants can be bigger than today's Actives by a lot (budget: an Encounter band of 1.4 to 2.0 DE per AP at 5.8 DE an AP = 8 to 12 DE per AP, used 0.6 times a fight: about 5 to 7 DE a fight per AP, or 2 to 3 damage a turn for a 2 AP one).

## 5. The Reaction AP

4 Standards at the rework's factors, per fight:

| Reactions | rounds · lost · Down | Paladin: Reactions (damage) | Archer: Reactions (damage) | Blocked (both Paladins) | Party dealt · taken | Worth against none (DE a fight · a PC turn) |
|---|---|---|---|---:|---|---:|
| None | 4.0 r · 37% · Down 42% | 0 | 0 | 0 | 281 · 52 | |
| Opportunity Attack + Quick Draw | 3.5 r · 32% · Down 31% | 0.86 (4.7) | 1.22 (6.9) | 0 | 280 · 46 | 5.7 · 0.5 |
| Shield of Faith as a 1R block + Quick Draw | 3.4 r · 21% · Down 17% | 2.3 blocks | 1.39 (8.0) | 25.5 | 281 · 28 | 24.2 · 2.0 |

- **A Reaction AP with Opportunity Attack or Quick Draw is worth about half an AP a turn** (2.9 DE of a 5.8 DE AP): it fires once every one to two rounds, because NPCs don't move much once the lines meet. That is the price of "one basic Reaction for everyone": modest, and it is what makes 4 + 1 feel like 5.
- **Shield of Faith as a 1R Reaction blocks about 25 damage a fight for two Paladins** (12 each: a block every round, 1d8 + 2 = 6.5 a block): the fight costs the party 21% instead of 32%, and Downs drop from 31% to 17%. That is 3 to 4 times an Opportunity Attack and **about a Weapon Attack's worth of Health every round for 1R**: as the Paladin's Hallmark Reaction at today's dice it is too strong, or it is the whole reason a Paladin exists; the sheet decides its size (1d6, once a round is already the Turn Frequency) and whether Bulwark of Faith (Encounter) is the other choice.
- The Archer's Quick Draw stand-in: 1.2 to 1.4 a fight, 7 to 8 damage: a fair basic Reaction; its Hallmark Reaction can be stronger.

## 6. Overcast as the caster's Passive ladder

Pack LV's stand-ins (progression.mjs: a weapon user and a caster of the same budget; model A) at 4 AP with Escalation as a level: the weapon user's Surge (+1d8 on its next Strike) works every round from Escalation 1 and Killer from 2 (the Paladin's shape); the caster's first Bolt each round is Overcast up to its Escalation level, capped by the tier's limit (1 / 2 / 3). Damage a round at Defense 13, fight = rounds 1-3 + half of round 4:

| Level | Build | r1 | r2 | r3 | r4 | fight | caster / weapon |
|---:|---|---:|---:|---:|---:|---:|---|
| 1 | weapon user | 35.3 | 27.7 | 29.4 | 29.5 | 107.1 | |
| 1 | caster, Overcast up to the tier's limit (1) | 33.1 | 25.9 | 25.9 | 25.9 | 97.9 | 94% · 91% |
| 1 | caster, Overcast up to 3 (no tier limit) | 33.1 | 28.2 | 32.8 | 35.0 | 111.6 | 94% · 104% |
| 1 | caster, no Overcast | 33.2 | 21.4 | 21.6 | 21.2 | 86.8 | 94% · 81% |
| 5 | weapon user | 40.7 | 31.8 | 33.6 | 33.5 | 122.9 | |
| 5 | caster, limit 2 | 36.7 | 32.2 | 34.4 | 34.5 | 120.6 | 90% · 98% |
| 5 | caster, up to 3 | 36.8 | 34.5 | 36.7 | 39.0 | 127.5 | 91% · 104% |
| 8 | weapon user (2[W]) | 53.7 | 49.6 | 51.4 | 51.4 | 180.4 | |
| 8 | caster, limit 3, keep the best | 44.3 | 43.0 | 45.4 | 47.9 | 156.7 | 82% · 87% |

**Overcast as a ladder works:** capped by tier the caster is 91% / 98% / 87% of the weapon user over a fight (LV's check with spent Overcast gave 104% / 104% / 87%); a +1 die at Escalation 1 is the caster's "Surge". Without the tier cap a level 1 caster is ahead from round 3 (104%); the cap stays. Level 8 is low in both checks (the weapon user's 2[W] outgrows keep the best): a question for D4, not pack R. A caster's Escalation 3 ability ("Overcast past your limit once") would be worth about +1 die on one spell: 4 to 5 damage, small; it needs something else.

## 7. Bloodied and Strained as hooks

**The thresholds** (level 1):

| Creature | Body threshold | Mind threshold | Health | Bloodied at | Strained at |
|---|---:|---:|---:|---:|---:|
| Human Paladin (Body 2, Mind 1) | 22 | 18 | 40 | 55% in Body damage | 45% in Mind |
| Dwarf Paladin (Body 2, Mind 2) | 24 | 22 | 46 | 52% | 48% |
| Elf Paladin (Body 1, Mind 2) | 15 | 24 | 39 | 38% | 62% |
| Human Archer (Body 1, Mind 1) | 14 | 13 | 27 | 52% | 48% |
| Dwarf Archer (Body 1, Mind 1) | 16 | 12 | 28 | 57% | 43% |
| Elf Archer (Body −1, Mind 2) | **5** | 17 | 22 | **23%** | 77% |
| Minion · Grunt · Standard · Elite (Medium, Body High) | 4 · 16 · 35 · 73 | 3 · 12 · 28 · 59 | 7 · 28 · 63 · 132 | 55-57% | 43-45% |

**In the fights** (the rework at its factors; arrows and [W] dice are Body, Holy dice are Mind; an NPC's Basic attack is Body):

| NPC | Bloodied before dying (mean round) | Strained before dying (mean round) | Both | Dies (mean round) |
|---|---|---|---:|---:|
| Standard (in 4 Standards) | 93% (2.2) | 21% (1.4) | 14% | 2.4 |
| Standard (with an Elite) | 91% (1.6) | 28% (1.2) | 20% | 1.8 |
| Elite | 98% (2.7-3.2) | 5-8% (1.9-2.4) | 3-5% | 3.1-3.6 |
| Grunt | 90% (2.1) | 30% (1.5) | 20% | 2.1 |

| PC (4 Standards) | Bloodied by the end of round 1 / 2 / 3 | Turns while Bloodied | Mind share of its damage |
|---|---|---:|---:|
| Paladin | 17% / 32% / 34% (2 Elites: 18 / 40 / 47%) | 15% (19%) | 45% |
| Archer | 12% / 25% / 28% | 14% | 7% (Divine Surge's Holy on its hits) |

- **An NPC is nearly always Bloodied, about one round before it dies** (round 2.2 of 2.4): the party focuses one enemy, its Body threshold is 56% of its Health, and three quarters of the party's damage is Body. A "while Bloodied" hook on an enemy has a window of about one round; "when it becomes Bloodied" fires once per enemy, reliably. **Strained is rare** (5 to 30%, early when it happens: a Smite's Holy half lands on a fresh target): the Paladins alone push it, and only when both work on the same creature. For the rework's aim (reward hitting the weak pool) the numbers say: Strained needs more Mind damage in the party (a caster, or the Paladin's Holy riders) before "against a Strained target" is worth a card; today it is a Paladin-only hook that fires on one Standard in five.
- **PCs:** a Paladin takes a fifth of its turns Bloodied in a normal fight (a third against Elites), an Archer a sixth; the Elf Archer (threshold 5) is Bloodied by the first hit and stays so. Today's Banes (a Bane on [Weapon] Actions while Bloodied) would have cost the party about 10% of its Weapon damage on those turns; without them, Bloodied on a PC is free to be a trigger ("when you become Bloodied, once an encounter").

## 8. Slowed, Minions and the Specials at 4 AP

**Slowed** (paired fights with the same dice, the condition put on one creature at the start of round 2, 2 rounds measured; DE = damage dealt more + taken less):

| Condition | Today (5 AP) | 4 + 1 AP | AP taken, as a share of the turn |
|---|---:|---:|---|
| Slowed 1 on a Standard | 2.9 | 1.6 | 20% → 25% |
| Slowed 2 on a Standard | 5.7 | 6.3 | 40% → 50% |
| Slowed 1 on a Paladin (what it costs the party) | 4.8 | 4.8 | 20% → 25% |
| Slowed 1 on an Archer | 5.7 | 6.0 | |

Slowed 1 takes a quarter of a 4 AP turn instead of a fifth, but a Standard that doesn't move loses nothing (its 2 Basic attacks fit in 3 AP), so its measured price even drops (a 3 AP turn next to its target is a full turn); Slowed 2 bites harder (half the turn: one Basic attack when it moves). On a PC it is still about an AP (4 to 6 DE). **Slowed lowers the 4, not the Reaction AP** in these runs (the default); a Slowed creature keeps its Reaction.

**Minions** (2 Standards + 8 Minions at the rework's factors): 3 AP (today's) 3.5 r · 26% · Down 22%; 2 AP + 1 Reaction AP 3.5 r · 22% · Down 18%. A Minion's turn is move and strike: at 3 AP it strikes after up to two Advances, at 2 AP after one. 3 AP is three quarters of a Standard's turn now (three fifths today).

**The Special multipliers** (× 1.4 / 2.2 / 3.5 of the Basic attack for 1 / 2 / 3 AP): a Standard's full turn today is Basic + Basic (1 Bane) + a 2 AP Special + move = 4.1 Basic attacks; at 4 AP with a move it is 3.2 (−22%), without a move 4.1; a 3 AP Special is now the whole turn (3.5 against 4.5). The ruler's NPCs don't use Specials, so section 3's factors carry none of this: **the sheet chooses whether the multipliers stay (an AP is worth the same; NPC turns get 22% shorter when they move, as the PCs' do) or scale × 1.25 (1.75 / 2.75 / 4.4: the turn keeps its damage, and the playtests' "twice the ruler" NPC damage stays)**. Section 1 says the playtests were already harder than the ruler by the Specials' worth.

## 9. The Standard day (the heal loop)

The Double Shot party, 4 fights with no Rest (easy, normal, normal, hard), today against the rework at its factors:

| Rules | Day cleared | A PC Down in the day | Downs a day | Rally Points left | Health at the end | Fight 4 won |
|---|---:|---:|---:|---:|---:|---:|
| Today | 59% | 95% | 3.4 | 34% | 49% | 60% |
| The rework at its factors | 64% | 92% | 3.1 | 39% | 56% | 66% |

The same day, a little easier (the Reactions and Hallowed Stance); Rally Points last 4 fights in both. The playtests' heal loop (a Paladin spending 3 AP a turn on Lay On Hands) is not in these plans (no Lay On Hands in this party; the Lay On Hands Paladin heals an ally below 50%): the 4 AP economy makes a 3 AP heal three quarters of a turn, which is the lever against the loop, and section 2 shows the Lay On Hands Paladin paying 20% of its damage for it.

## 10. What the numbers say, in short

1. **4 + 1 AP costs today's main turns nothing** (the 5th AP bought Guard and an Evade), 10 to 20% on the support turns and Novas, 2% in the fights. The economy change is real for cards built on 5 AP (three Weapon Attacks, 3 AP Encounter Actions + a Strike), not for the main builds.
2. **The Health cut the fights need is PC Health × 0.84 and NPC Health × 0.98**, not −20% on both; the PC cut raises Downs from 28% to 31% a normal fight (39% to 42% against 2 Elites), so × 0.9 is the safer default. Either way the Bestiary's rounds and shares hold at every CV.
3. **The Reaction AP is worth about half an AP with a basic Reaction** (an Opportunity Attack or a Quick Draw once every one or two rounds), and **a 1R Shield of Faith every round is worth about an AP and halves the Downs**: the Hallmark Reactions need a budget (about 6 DE a fight for a basic one; a Hallmark one 10 to 15).
4. **Escalation as a level:** a PC acts at Escalation 3 in half the fights (three quarters with Momentum, one in five without); today's Actives are worth 1 to 2 damage a fight (Weapon Attacks with riders), so the Escalation 3 abilities can be big (5 to 7 DE a fight per AP); the Passives are worth 11 to 16% of a turn each (Killer's Focus, Radiant Zeal, Marked Quarry) or 1 to 2 damage a fight (Hallowed Stance, Elusive, Font of Mercy): the defensive ones are cheap today and can grow on the ladder.
5. **Overcast as a tier-capped ladder keeps the caster at 91 to 98% of the weapon user** at levels 1 and 5 (LV's target); level 8 is 87% in both models.
6. **Bloodied on an enemy comes a round before it dies; Strained comes in one fight of five**, from the Paladins only. The hooks should be "when it becomes" (fires once) rather than "while"; "against a Strained target" needs more Mind damage in the party to be worth a card.
7. **Slowed 1 at 4 AP is a quarter of a turn** but prices lower on a Standard (its 2 attacks fit in 3 AP); Slowed 2 is half a turn. Minions at 2 or 3 AP are both fine (3 is the Bestiary's three-quarters turn).
8. **The playtests' NPCs dealt twice the ruler's damage**: the Specials, which no calibration includes. The sheet's Special multipliers choice decides whether the book's "a third" is honest.

**Not measured, for the sheet to assume:** the Reaction AP spent on NPC Reactions other than Opportunity Attack (Hold the Line); the Specials; Bloodied / Strained phases of Elites; Mending Light and Harrying Shots (no ruler model); the Techniques (14 cards, 1 AP Round: unchanged by 4 AP except as a share of the turn); level 2-3 builds (the ruler's rework builds are level 1).

## 11. The decision sheet (next session; not written)

What it has to decide, each with a default and the number behind it (sections above): (a) 4 AP + 1 Reaction AP: the wording (Chapter 2), unspent AP for more Reactions, Slowed on the 4 (section 8), Minions' AP (8), the Special multipliers (8, 1), Quickened; (b) the Health cut: p and h (section 3) and whether the class multipliers or the species values carry it; (c) one basic Reaction for everyone (5) and the Hallmark Reactions' budget: the Paladin's Shield of Faith size and Bulwark of Faith, the Archer's two; (d) Escalation as a level: the ladder (one Passive per level, which of today's at which level), the Escalation 3 abilities' size and count (4), Momentum's text, what happens to Divine Surge, Pinning Shot, Twin Shot, Vanish, Aura of Protection, Hand of Mercy (an Encounter or a Passive); (e) Overcast as the ladder (6) and D4's share; (f) Bloodied / Strained without Banes: the hook wording (7), Elite phases, "players always see it", the Elf Archer's threshold; (g) NPCs have no Weapon Attack: the book line; (h) what the 14 Techniques and the Talents with 5 AP assumptions (Whirlwind, Cut Through) need; (i) the playtest 4 plan.

**Lucas's inputs for the sheet (2026-11-04, after reading the numbers):**
1. **A Reaction must be worth at least 1 AP, more rather than less**: keeping it risks wasting the AP when the trigger never comes. The ruler's rule for the sheet: a Reaction's worth = its effect when it fires × how often it fires (a basic one fires 0.5-0.6 times a round: section 5), so a Reaction that fires every other round must do about 2 AP of work when it does (Shield of Faith as a block does: 2 AP a turn). **And the unused AP itself must not be a loss** (a friend's point): the sheet proposes a consolation for AP that end a turn-cycle unspent (a Boon on your first roll, an Evade 1, Guard, +1 Escalation...), priced so that AP kept + consolation is about 1 AP's worth.
2. **A standard encounter must be at least 75% in the players' favor**: the playtests' "normal" felt hard. The ruler's normal fight is won 99% but costs a third of the party's Health with a PC Down in 3 of 10 fights, and the real NPCs deal twice the ruler's damage (the Specials, section 1): the book's targets (a third, 3.5 rounds) are the sheet's to lower (about a quarter of the Health and a Down in 1 fight of 10 for "normal"), with the Specials put into the calibration (model a Standard's 2 AP Special as a once-a-round × 2.2 attack) before the Health factors are set.
3. **Ward Defense:** only Word of Radiance rolls against WD today (the Archer's Volley and Rain of Arrows are Instinct Saves; every NPC attack is against AD); the ruler models `vs wd` (the Power Modifier against the target's WD) but never used it in a fight, and the Bestiary's AD and WD tables are the same numbers, so nothing was measured. For the Strained hook (section 7) it matters: Mind damage will mostly come from [Power] Actions against WD; a PC's WD (11 + Power Modifier + ward: 13 for both classes) is 1 under the Paladin's AD 14, so an NPC Power attack is about 8% stronger against it. Pack R's Bestiary pass should give some example NPCs a Vs. WD Basic attack, and the ruler a `ranged`-like `power` tag for NPCs.

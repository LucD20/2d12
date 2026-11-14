# The Paladin redesign: the decisions, one at a time

The running record of the Paladin's redesign (MASTER-PLAN item 5; branch `pack-paladin-redesign`). One decision at a time: Claude proposes or analyses Lucas's draft, **Lucas decides**, the decision is written here. **Nothing here is in the book or in Foundry until Lucas says so.** The card analyses use the format of `paladin-analyses.md` (priced lines tagged [SIM] / [Lucas] / [judgment] / [not priced], a total, then the analysis); the research is in `book/research/`; the charter is `book/class-charter.md`.

## The brief (Lucas, 2026-11-14)

> The paladin is a soft tank, soft support, soft nova class, focusing in divine action against profane forces. The paladin isn't a consistent damage dealer nor can take hits for you, but they can aid you, make sure you don't go down and when they use all they have against an enemy, they can explode before seeing it coming. They stay in front so the squishes can stay back.

**The brief against the research and our rules, in short** (the detail: the five notes of 2026-11-14):

| The brief | What it asks for | Where our rules stand today |
|---|---|---|
| soft tank; "can't take hits for you" | protect by making one hit a round smaller or costly, never by soaking it | Shield of Faith is the right shape at four times its budget (66 points; fires 82% of rounds, on himself too) |
| "they stay in front so the squishies can stay back" | a front line the rules make real: a move that ends or costs more next to him. **And a tension:** a protector by Reaction works on an ally close enough to be hit (Champion players: "works best if someone else is in melee range"), so he needs both a Reaction for the ally beside him and a stop for the enemy heading to the one who stayed back | **nothing**: no Opportunity Attack at Stage 0, no zone of control; only Frightened of you (Difficult Terrain toward him) on Rebuke's Tier 1. Our Reactions reach 5 squares, which covers an Archer a move behind him |
| soft support; "make sure you don't go down" | the cheapest, fastest Rally Point in the party, on the touch or on the hit; big enough before 0 | Lay On Hands 1 AP is worth less than the attack it replaces (-11); Divine Intervention is a Daily (none in Stage 0) |
| soft nova; "use all they have... explode" | one Action, built in the open during the fight, 1.5 to 2.5 times its AP's worth of normal hits (13th Age's designer: 1.5 a battle, 2 a day), a floor on Tier 1, best as a finisher, a visible cost afterwards; a slow build has a price in a 3.5-round fight | **no nova**: Holy Wrath 2 is 50 points, the same as Smite 2; Smite every round is a consistent damage dealer's card |
| "divine action against profane forces" | always works, a little more against the Profane; the player declares whom he judges | Divine Power does nothing without a Profane creature; the Tag list isn't written |
| three roles in one class | one spine of its own; the parts feed each other | the Hallmark choice splits the class in two (the SIM's 115 and 161 points at level 2) |

## The order

1. **The class's numbers** (Modifiers, Health, Rally, Speed): decision 1, below.
2. The level 1 picks, one by one: the two Features, each Hallmark Action, each Hallmark Reaction, the Arts.
3. The Escalation Passives, one by one (2, 4, 6), and the hook.
4. The Encounter Picks.

## Decision 1: the class's numbers (PROPOSED, waiting for Lucas)

**Research first.** The 4e Paladin's split attack stats are remembered as its worst fault (`paladins-other-games.md`, takeaway 10). The closest published match to the brief, Draw Steel's Censor, has a front-liner's Stamina and the most Recoveries: tough across the day, not in the round (`frontline-protection.md`, takeaway 4). High defenses are half of the protector's trap: "attack my allies and take the reaction, or attack durable me" (`paladins-other-games.md`, the Champion). The 4e Paladin's other launch flaw was a duty to chase on the slowest class: the cure was to drop the duty, not to raise the Speed.

| Number | Today | Proposed | Why | Source of the size |
|---|---|---|---|---|
| **Modifiers** | +2 and +1, you choose | **Weapon +1, Power +2, fixed** | "Isn't a consistent damage dealer": his plain Weapon Attack rolls +1, a full step under the Archer's. His divine Actions roll Power +2, and a divine Strike with the [Signature] trait rolls +2 (the higher of the two): the burst hits like a striker's, the everyday swing doesn't. Ward Defense 13. One build, so no card is written for a Modifier half the Paladins don't have. | +1 on a Modifier = a full step of difficulty [Lucas, 2026-11-12]; about 9% of a roll's worth, so a Weapon Attack about 23 points instead of 25 [judgment, from the old price list] |
| **Health** | high 20, low 10 | **keep 20 / 10** | A Human: 35 against the Archer's 29 (+21%). A Standard's turn deals him 11.9: three turns of one Standard's whole attention. Enough to stand in front, not enough to soak for two. | [SIM] `stage0.md` section 2; the old charter's role budget was 120 to 130% |
| **Rally** | 6 (7 Rally Points; each heals 9) | **keep 6 for now; +1 if his own Rally Points pay for allies** | His reserve is 63 Health a day against the Archer's 48: the "depth, not height" of the Censor is already here. Whether Lay On Hands spends his or the ally's is a later decision (`frontline-protection.md`, takeaway 6); if his, Rally becomes his tank stat and 7 is the default. | [judgment] 1 Rally Point = 5 points [Lucas's rate]; about 12 a Health when it lands in a fight [SIM] |
| **Speed Modifier** | +0 | **keep +0** | He holds a place; the Archer (+1) moves. With an Advance in one piece he gets one move a turn: his cards must not ask him to chase ("while you are adjacent to it" is the 4e flaw). Mobility, where he needs it, comes from a card (a step to the ally who is hit). | [SIM] +1 Speed on a Paladin: 0.1 damage-equivalents over 3 rounds on the open field, 1.4 to 1.5 on maps (`maps.md`) |
| **Armor Training** | Heavy (AD 14) | **keep Heavy** | Attacking him is the bad choice; so the enemy attacks his ally, where his Reaction is. | [SIM] a Standard deals 11.9 a turn to AD 14, 13.3 to AD 13 |
| **Attributes** | Body or Appeal +1, Mind or Instinct +1 | unchanged | Attributes are for Skills, Saves and Checks; not part of this pass. | |

**Total [judgment]:** against today's Smite build (Weapon +2) this is about -5 points on a turn of plain attacks and +1 Ward Defense; against today's Lay On Hands build (Power +2) it is the same character. The class's 130 / 140 / 150 comes from its cards.

**Analysis.**
- **The decision it gives the player:** none, on purpose. Today "which Modifier is your Weapon Modifier" is the first choice a Paladin makes, and it decides whether half the class's cards are good for him. With one line, the choices move to the cards.
- **The rules it touches:** Chapter 5's example (Lonny's Paladin: Weapon +2, Power +1) and the Paladin's statblock line. At Stage 1 he still adds +1 to the one he chooses: Weapon +2 / Power +2, or Power +3.
- **Its sibling:** the Archer is Weapon +2, Power +1, fixed. The two classes become mirror images: the Archer's weapon is his constant, the Paladin's Power is.
- **Table feel:** his sword misses more than the Archer's bow. That reads as "not the damage dealer" every round, and makes the turn he calls on his god (a [Signature] Strike at +2, with whatever Boons the party set up) feel different in the dice, not only in the damage. The risk: missing is the least fun result. It is softened by the three Tiers (his big Strikes deal damage on Tier 1) and by giving his turn other jobs than the Weapon Attack.
- **What the checked research adds (second pass):** a protector with no threat gets ignored. A Pathfinder 2e Guardian playtester: the taunt "seemed to work as intended... if the intent was the enemy ignored the taunt", "piddly damage, which means there was not really a reason for the monsters to attack me". One guide's cure is the opposite of your brief ("put down your shield and grab a two-handed weapon"). The 4e Swordmage shows the other cure: he does little damage and is still obeyed, because "preventing 8 damage from my marked target is enough to draw them to me". **So Weapon +1 is safe only if the next decisions give him a punishment or a protection that is certain (no roll) and has a number the table hears.** If you want his threat to come from his sword instead, pick (C).
- **If you'd rather not:** (B) keep "+2 and +1, you choose": two builds stay possible, and every Paladin card must be checked for both. (C) Weapon +2, Power +1, fixed, as the Archer: the plain attack is as good as the Archer's and "isn't a consistent damage dealer" must then come from the cards alone (no bonus damage outside the burst).

**Lucas's answer:**

# Playtest 2 (Lucas, 2026-11-02): the log, what it showed, and the decisions it led to

Discussed in one chat (2026-11-02); nothing applied to rules-src or Foundry. The decisions are logged in `rules-backlog.md`
(item "PLAYTEST 2: THE REWORK") and the order of the work is in MASTER-PLAN.md (section 3, step 0). Pack R starts from this file.

## The fight
Level 1. Paladin 1 (DP) Dwarf; Body, Instinct; Smite, Holy Wrath, Radiant Zeal, Aura of Protection; Heavy Blows.
Paladin 2 (HP) Human (Body, Appeal); Appeal, Mind; Lay on Hands, Word of Radiance, Mending Light, Shield of Faith; Cut Through.
Archer 1 (EA) Elf; Mind, Instinct; Double Shot, Killer's Focus, Pinning Shot; Long Draw.
Archer 2 (HA) Human (Body, Instinct); Instinct, Appeal; Rolling Shot, Elusive, Twin Shot; Aim.
Against: Ogre Chieftain (Elite 200), Orc Warrior (Standard 100), Bandit Thug (Grunt 50), 2 Goblin Sneaks (Minion 25): **CV 400, a normal fight**.
Map: a room with pillars, dark and dim areas. Initiative (zipper): OC 30, HP 15, GS2 15, DP 14, GS1 13, HA 12, OW 12, EA 8, BT 6.

Abbreviations: LoH Lay on Hands, WA Weapon Attack, RK Rusty Knife, DT Dirty Trick, SY Steel Yourself, RS Rolling Shot, BS Brutal Swing,
DS Double Shot, LB Low Blow, ML Mending Light, SoF Shield of Faith, LnL Lock & Loose, CT Cut Through. "T3" = the roll's tier.

Round 1. HA marks BT, EA marks OC.
- OC: Charge, WA vs DP T3; Club vs DP T3; Advance; Club vs DP T3. DP went down, chose to keep fighting.
- HP: Advance; LoH 3A vs DP; WA vs OC T1.
- GS1: Advance; RK vs HA T1; DT vs HA T2.
- DP: SY 3A; Smite vs OC T1.
- GS2: Charge, WA vs HP T1; DT T2.
- HA: RS vs GS1 T3; Aim vs BT T1; WA vs BT T3. GS1 dies.
- OW: Advance 2x; BS vs EA T2; saving 1 AP.
- EA: Advance; DS 3A vs OC and OW, WA vs OW T2, WA vs OC T2; WA vs OW T3.
- BT: Advance; LB vs HP T2; Cudgel vs HP T3; WA vs HP T1.

Round 2.
- OC: Rally the Tribe; Ground Slam vs DP, HP and OW (DP T1, HP and OW T2); Club vs DP T1.
- HP: ML self; SY 1A (no such version: 2 or 3 AP); LoH 3A vs DP.
- DP: Aura of Protection; Holy Wrath 3A T1; Smite 2A T1.
- GS2: Advance; DT vs HA T2; RK vs HA T2.
- HA: RS 3A vs GS2 T2; SY 2A. GS2 dies.
- OW: BS vs EA T1; Cleaver vs EA T3; WA vs HA. **EA** went down, kept fighting (the log said HA; Lucas confirmed EA).
- EA: Evade 2A; DS 2A vs OC and OW, WA vs OW T2, WA vs OC T1. T3 on the Dying check.
- BT: LB vs HP T2, HP uses SoF on self; Cudgel vs HP T2; WA vs HP T2; Cudgel vs HP T2.

Round 3.
- OC: Rally the Tribe; Club vs DP T2 (HP SoF); WA vs DP T1; Club vs DP T1; Club vs DP T2.
- HP: LoH 2A self; Word of Radiance 3A vs OC and BT T1.
- DP: Smite 3A vs OC T2; WA vs OC T3; Trip vs OC T2.
- HA: Aim vs OW T2; RS 3A vs OW T2; WA vs OW T2.
- OW: Charge, WA vs HA T2; BS vs HA T2; Cleaver vs HA T3. HA went down, kept fighting.
- EA: DS 2A vs OC and OW, WA vs OW T2, WA vs OC T3; LnL vs OC T3; WA vs OC T3. T2 on the Dying check.
- BT: LB vs HP T1; Advance; Cudgel vs DP T1; WA T1.

Round 4.
- OC: Club vs DP T1; WA vs DP T2; Club vs DP T2; Club vs DP T1; Club vs DP T2.
- HP: ML self; LoH 3A vs DP; CT vs OC T3.
- DP: Smite vs OC T3; Regrip; WA vs BT T3; WA vs BT T1. OC is down; EA marks BT.
- HA: Evade 1A; WA vs OW T1; Aim vs OW T2; Advance. T1 on the Dying check.
- EA: LnL vs BT T2; WA vs BT T1; WA vs BT T2. All foes are down.

Damage dealt (Foundry's Damage Report, after Half or Block): EA 81 (20.3 a round), OC 79 (19.8), DP 70 (17.5), HA 60 (15), OW 52 (13),
HP 41 (10.3), BT 38 (9.5), Goblin Sneaks 15 and 4.

## What it showed (compared with the book and the ruler)
1. **Harder than the book's normal fight.** 4 rounds (target 3½: fine), but the foes dealt **188** to a party of about **123 Health**
   (estimated: DP 41, HP 35, EA 22, HA 25), three PCs went Down, and **DP used all 8 Rally Points in one fight** (SY 3A + three LoH 3A; the
   ruler expects Rally Points to last about 4 fights). The book says a third of the Health and a PC Down in 1-16% of fights.
2. **NPC damage was near the tables (47 a round against 40.5); the PCs' was not (63 a round against about 100).** HP spent 3 AP almost every
   turn healing DP, DP spent a turn on SY, two Archers fought Down (Slowed 1). The Down-healed-Down loop eats the party's turns.
3. **NPCs used both their Basic attack and Weapon Attack** (OC: Club and WA; BT: Cudgel and WA). Each At-will Action has its own first use,
   so they got two Bane-free attacks a turn (OC rolled 5 attacks in round 4). **Lucas: NPCs have no weapons, so no Weapon Attack** (a mistake
   of the playtest; it likely did a lot). Fixed in pack L; playtest 3 is the baseline without it.
4. **Reactions barely existed.** 2 of 4 PCs had none (DP, HA); the fight had two SoF, one Marked Quarry swap and Hold the Line never
   triggered (OW saved 1 AP for it in round 1). The ruler already said it (ruler/README.md, Positions: "Opportunity Attack is worth 0: the
   Paladin spends all 5 AP every turn"): nobody keeps a sure attack for a maybe.
5. **Escalation: every PC's Active turned off their own Passive.** Aura of Protection (spend 1) vs Radiant Zeal (1+); SoF (spend 1, used on
   OC's turn) vs Mending Light (1+: it didn't fire on HP's round 3); Pinning Shot (spend 2) vs Killer's Focus (2+: never used); Twin Shot
   (spend 3) vs Elusive (1+), and Escalation 3 only comes in round 4 (never used).
6. **Bloodied is not "half Health".** EA (Elf, Body -1) has BDT 5 of 22 Health: Bloodied by the first hit, a Bane on every Weapon Action for
   the fight. DP: 24 of 41. And a creature weak in Mind gets nothing from Strained's Bane if it never uses [Power] Actions.
7. **Dying while out of reach is cheap:** EA fought rounds 2-4 Dying and paid only Slowed 1 (nobody hit it). Abilities must not reward Down.

## Decisions (Lucas, 2026-11-02; to apply in pack R)
- **Action economy: 4 AP + 1 Reaction AP** (the Reaction AP can be spent only on Reactions); unspent AP can still pay for more Reactions.
  Defaults to confirm in pack R: Slowed lowers the 4, not the Reaction AP; Health about -20% so a fight keeps 3½ rounds (shorter turns, same rounds).
- **Each class: a Hallmark Action (a choice of two) and a Hallmark Reaction (a choice of two).** Paladin: from Shield of Faith and Bulwark of
  Faith (out of Escalation and the Encounter list); Archer: two new ones. Default to confirm: also one basic Reaction for everyone (Chapter 6).
- **Escalation is a level, not spent.** Escalation 1 / 2 / 3 = Escalation level 1 / 2 / 3. **One Passive per Escalation level** (it works from
  its level), plus **one (or 2-3) big ability at Escalation 3: Encounter, requires Escalation 3, spends nothing** (Lucas: "No" to spending).
  Momentum (decided in LV: start a fight at 1 at levels 1-2) goes into the book with it, so Escalation 3 arrives in round 3.
- **Overcast must change** (it was "spend 1 Escalation per die"). Proposal for pack R: the caster's Passive ladder, "your first [Spell] each
  round is Overcast up to your Escalation level" (capped by tier 1 / 2 / 3); a caster's Escalation 3 ability can be "Overcast past your limit
  once". The ruler re-runs LV's weapon-user-against-caster check.
- **Bloodied and Strained become hooks, without their Banes** (Lucas: a debuff on a creature's weak side does nothing). Default: no built-in
  effect; abilities read them ("triggers when you become Bloodied", "+X against a Strained target"). The point: **reward targeting the weak
  pool** (Body or Mind) of an enemy. Holy damage is Mind (the Paladin pushes Strained), arrows are Body (the Archer pushes Bloodied).
  **Players always see when an NPC is Bloodied or Strained.** Risks: snowball (prefer effects to raw damage), low-Body PCs (keep "against
  Bloodied" mostly on PCs), each class needs some damage of the other pool. Elites get Bloodied/Strained phases. Never reward going Down;
  once per encounter for triggers (healing can retrigger them).
- **NPCs have no Weapon Attack** (their Basic attack is it). Book: Chapter 6 / Bestiary; Foundry: pack L.

# Reactions in other games: cost, timing, protection without a duty

**The question (Lucas, 2026-11-27, the Reactions' rebuild):** how do the games he likes price and time their Reactions, and how do they let a protector protect without "the necessity to always reduce it"? ("Health is the center point of 2d12, wont Paladin feel the necessity to always reduce it?") Our frame: 4 AP regained at the end of your turn, Reactions paid with AP, no general cap, each card limits itself; his complaint about the old Reactions: "Stopping someone else's turn was the most disrupting part, and the most disrupting were the ones that allowed to move as part of it."

**Sources, how far to trust them.** Read 2026-11-27 by four readers working in parallel, each from the rules text:
- D&D 4e Player's Handbook, 13th Age 2e Heroes' Handbook and DC20 0.10.5 Beta: Markdown in Lucas's private repository (`LucD20/lucd20-personal`). They have no page numbers, so the cites are chapter and section.
- Pathfinder 2e Remaster: Archives of Nethys.
- Draw Steel: Steel Compendium v2.

[read] = rules text read; [checked] = the page read online; [inference] = the reader's or Claude's reading. Gaps:
- The Paizo blog's Champion preview didn't load (403).
- Glimpse of Redemption's wording comes from AoN's causes page, not its own entry.
- **The "never eliminated" quote** our earlier notes give Draw Steel's Censor (`paladins-other-games.md`, Decision 6 of `cards/paladin-redesign.md`) **was not found**. The Censor's level 1 triggered action heals; Draw Steel's damage reducers are the Tactician's, Fury's, Null's and Shadow's, and they halve.

## Takeaways

1. **No game lets a protector use damage prevention on every enemy turn for free.** They all brake it, each in its own place:
   - **4e:** every Reaction that prevents damage to an ally is Encounter or Daily [read]. Examples: Martyr's Blessing (Daily: "You are hit by the attack instead"), Unbreakable (Encounter: 5 + Con), Last Ditch Evasion (Daily; you are stunned).
   - **13th Age:** almost every one is once per battle [read]. Bastion is once a battle plus Con-mod uses an arc; Heavy Warrior and Roll With It are once a battle.
   - **Pathfinder 2e:** one reaction a round, a setup action on your own turn (Raise a Shield), and a shield that breaks [checked].
   - **Draw Steel:** one triggered action a round, a short range (Parry: Melee 2), and you must end next to the ally [checked].
   - **DC20:** the cheap AP defences are small (+5 to a Defense, disadvantage). Real reduction costs a slow second pool: Stamina Points, Mana Points, Grit [read].

   *For 2d12:* our AP price is DC20's half of this. The other half has to come from the card: its Frequency, its trigger, or a setup on the Paladin's turn.
2. **Half is the ceiling, and nobody erases the hit at low level.**
   - Draw Steel's level 1 reducers all halve: Parry, Inertial Shield, Unearthly Reflexes, Defensive Roll [checked].
   - 13th Age: Bastion splits the hit in half, Heavy Warrior halves it, Roll With It halves with Bravado [read].
   - Pathfinder 2e reduces by a flat number: resistance 2 + level, or the shield's Hardness 3 to 5 [checked].
   - A full negation exists only rarely and late: 4e's Last Ditch Evasion (Daily, with a cost), 13th Age's I Say Thee, Nay! (Champion tier, once a battle), DC20's Hand of Salvation (2 AP, and it moves the ally) [read].

   *For 2d12:* "the ally takes half" is the established size.
3. **The protection that has no frequency limit moves the damage instead of making it vanish.** 13th Age's Bastion ("you lose half the damage", which resistance can't reduce) [read]; DC20's Protect and Divine Protection (shared; your share ignores your Damage Reduction) [read]; Pathfinder 2e's Intercept Attack (you take it) [checked]; 4e's Divine Bodyguard [read]. It limits itself through the protector's own Health.

   *For 2d12:* Bear the Blow (a playtest Talent) is this. The Paladin's brief ("can't take hits for you") rules it out as his Hallmark.
4. **The at-will defender tool deters; it doesn't absorb, and it never stops the turn.**
   - 4e's Divine Challenge: a mark, −2 to attacks that don't include him, and automatic radiant damage "the first time it makes an attack that doesn't include you". No action is spent, and the enemy's turn isn't stopped [read].
   - 13th Age's Paladin's Challenge: −4 on both sides [read].
   - Draw Steel's Judgment: holy damage when the judged creature uses a main action, or for 1 wrath a bane, a free strike or a lower potency; Taunted is a double bane [checked].
   - Pathfinder 2e's Guardian Taunt: −1 and off-guard [checked].
   - **The mark also binds the defender** (4e: "you must engage the target" or the mark ends) [read].

   *For 2d12:* this is Judge's family. Shield of Faith's Taunt is a small version of it.
5. **Protection keyed to a choice made on your own turn stops being a reflex.**
   - Pathfinder 2e: Shield Block needs the shield raised, an action on your turn [checked].
   - DC20: Reinforce works only inside the Commander's Aura; Not on my Watch only against creatures you Taunted [read].
   - Draw Steel: Judgment's options fire only on the judged creature [checked].

   [inference] A protect card that answers only the creature the Paladin chose (the one he Judged) fires at most once on that creature's turn. And the enemy decides whether to give it a target.
6. **Decided before or after the roll.**
   - DC20 decides before the result is known ("you must decide to use the Maneuver before the GM says the result of the Check") [read], so some uses land on misses.
   - 4e's ally boosters (Shielding Word, +4 AC) also come before the hit is settled. Its heals come after (Inspiring Reaction) [read].

   [inference] Chosen after the damage is known (ours today), a halving is always the right answer on a big hit. Chosen before the roll, it is a gamble. Either way, the brake has to come from the trigger or the Frequency.
7. **What disrupted, elsewhere too:** the reactions that move the reactor or the ally, or change the turn order.
   - Pathfinder 2e: Intercept Attack, Liberating Step [checked].
   - Draw Steel: Parry's shift, No Dying on My Watch, the Shadow's teleports, Prescient Grace [checked].
   - DC20: Hand of Salvation, Side Step [read].
   - 4e: the interrupt that makes the triggering action "lost", with shifting away as the book's own example [read].

   13th Age pushes its moving reactions to the end of the enemy's turn ("at the end of that turn", Control the Range) [read].

   *For 2d12:* if a Reaction moves anyone, resolving it after the enemy's turn is the known pattern.
8. **The rules of the economy.**
   - 4e: one immediate action a round, never on your own turn [read].
   - 13th Age: one interrupt a round, shared with intercepting ("not something all characters have to think about") [read].
   - Pathfinder 2e: one reaction, regained at the start of your turn and lost if unused [checked].
   - Draw Steel: one triggered action a round, plus free triggered actions [checked].
   - **DC20 is ours** [read]:
     - 4 AP, regained at the end of your turn; a Reaction leaves 3 for the next turn.
     - No cap; "only 1 Reaction per Trigger".
     - If you spent all 4 before your turn, "your turn would immediately end and you'd get your 4 AP back".
     - Enemies can turn Reactions off: Stagger, Shock, Dulled Reactions ("can't take Reactions"). Ours has Staggered.

## How they apply to 2d12

- **Shield of Faith** (`reactions-design.md`, batch 1): the half is right (2); what it lacks is a brake beyond the AP (1). The candidates the research gives:
  - a Frequency (once a round, 13th Age's once a battle);
  - a trigger narrowed to the Paladin's own choice, the creature he Judged (4, 5);
  - a decision before the roll (6).
- **DC20's "0 AP at your turn" rule** answers a gap in our wording: what happens to a creature that owes all four. To propose at the build.
- **Movement in a Reaction:** if a card keeps one, it waits until the triggering creature's turn ends (7).
- **Judge and the Taunt** are the deterrent family (4). A Paladin card that rewards the Judge he placed is the 4e / Draw Steel shape.

## Sources

- D&D 4e Player's Handbook: Ch. 9 Combat (Triggered Action Types, Actions on Other Turns, Opportunity Attack, Ready an Action, Healing Surges, Second Wind); Ch. 4 Classes (Fighter: Combat Challenge, Combat Superiority, Unbreakable, Last Ditch Evasion, No Opening; Paladin: Divine Challenge, Divine Sanction, Lay on Hands, Martyr's Blessing, Noble Shield, Divine Bodyguard; Ranger: Disruptive Strike, Fox's Cunning, Yield Ground, Weave through the Fray; Warlord: Inspiring Word, Inspiring Reaction, Tactical Shift, Villain's Nightmare; Cleric: Shielding Word); Ch. 2 Character Role; Appendix: Marked.
- 13th Age 2e Heroes' Handbook: Combat Rules (Anatomy of Your Turn, Actions, Opportunity attacks, Engaged or Unengaged, Disengaging, Intercepting, Special Initiative Actions, Rally, Recoveries, the escalation die); Paladin (Bastion, Lay on Hands, Smite, Paladin's Challenge, Adjudicating Challenges, Bold); Fighter (Heavy Warrior, Skilled Intercept, Counter-Attack, Defensive Fighting, I Say Thee, Nay!); Rogue (Roll With It, Sly Dodger, Deflection); Ranger (Control the Range, Shadow Slip); Cleric (Respite, Domain: Storm); Cha-cha-cha-Changes; Example of Play.
- DC20 0.10.5 Beta: Combat Resources (Action Points); Advanced Actions (Reactions, Held Actions, Spending Resources, Regaining Resources); Spell Duel (Multiple Reactions, the DC Tip); Types of Reactions (Opportunity Attack); Defense Maneuvers (Side Step, Parry, Brace, Protect, Endure, Body Block, Swap); Grit Points; Champion (Tactical Die, Steadfast Defender, Not on my Watch); Commander (Commanding Aura, Bolster); Cleric (Saving Grace, Hand of Salvation).
- Pathfinder 2e (Archives of Nethys): reactions https://2e.aonprd.com/Rules.aspx?ID=2335 · Raise a Shield https://2e.aonprd.com/Actions.aspx?ID=2316 · Shield Block https://2e.aonprd.com/Feats.aspx?ID=5212 · shields https://2e.aonprd.com/Shields.aspx?ID=2 , ID=3, ID=1 · broken https://2e.aonprd.com/Rules.aspx?ID=212 · Reactive Strike https://2e.aonprd.com/Actions.aspx?ID=2256 · Guardian https://2e.aonprd.com/Classes.aspx?ID=67 · Intercept Attack https://2e.aonprd.com/Actions.aspx?ID=3305 · Champion causes https://2e.aonprd.com/Causes.aspx?Remaster=1 · Nimble Dodge https://2e.aonprd.com/Feats.aspx?ID=4916
- Draw Steel (Steel Compendium): combat https://steelcompendium.io/v2/Read/heroes/combat/ · classes https://steelcompendium.io/v2/Read/heroes/classes/ (Censor: Judgment, My Life for Yours, Prescient Grace; Tactician: Parry, Overwatch, No Dying on My Watch, Mark; Fury; Null: Inertial Shield; Shadow)

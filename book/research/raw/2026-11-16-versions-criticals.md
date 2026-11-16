# Raw: Versions (one ability at several costs) and critical lines on cards

2026-11-16. A quick pass (about 20 tool calls). Other games' opinions, never 2d12's rules. No recommendations.

**Tags.** [read] = rules text read in full on the page named. [checked] = an opinion read on its own page. [lead] = a search snippet only, page not opened. [memory] = from memory, not verified this pass. [mine] = my arithmetic or reading.

**Not repeated here:** `ability-scope.md` (takeaway 5 already says the 1 / 2 / 3 AP Versions make a turn "a budget problem, not a board problem") and `nova-burst.md`.

---

## A. Versions: one ability usable at several action costs

### A1. Rules text (Pathfinder 2e, remaster; source: the Foundry pf2e system's data, `github.com/foundryvtt/pf2e`, branch v13-dev, `packs/pf2e/spells/spells/rank-N/*.json`)

**Heal** [read], quoted exactly:
> "You channel vital energy to heal the living or damage the undead. If the target is a willing living creature, you restore 1d8 Hit Points. If the target is undead, you deal that amount of vitality damage to it, and it gets a basic Fortitude save. The number of actions you spend when Casting this Spell determines its targets, range, area, and other parameters.
> [1 action] The spell has a range of touch.
> [2 actions] (concentrate) The spell has a range of 30 feet. If you're healing a living creature, increase the Hit Points restored by 8.
> [3 actions] (concentrate) You disperse vital energy in a 30-foot emanation. This targets all living and undead creatures in the burst."

**Force Barrage** (the old Magic Missile) [read], quoted exactly:
> "You fire a shard of solidified magic toward a creature that you can see. It automatically hits and deals 1d4+1 force damage. For each additional action you use when Casting the Spell, increase the number of shards you shoot by one, to a maximum of three shards for 3 actions. You choose the target for each shard individually."

The others [read]:
- **Harm**: Heal's mirror, the same three lines.
- **Blazing Bolt** (the old Scorching Ray): 1 action = one ray, 2d6; "For each additional action ... you can fire an additional ray at a different target, to a maximum of three rays"; "If you spend 2 or more actions Casting the Spell, the damage increases to 4d6".
- **Horizon Thunder Sphere**: 2 actions = range 30 feet; 3 actions = range 60 feet "and deals half damage on a failure"; "Two Rounds": 3 actions now and 3 more next turn for an added area explosion. It also carries its own critical line: "On a critical success, the target takes double damage and is Dazzled for 1 round."
- **Inner Radiance Torrent**: 2 actions = a 60-foot line; 3 actions = 120 feet; two rounds = +4d4 and a glowing state.

**The three shapes these take** [mine]:
1. *The cost changes the delivery, not the size* (Heal: touch / range / area).
2. *The cost multiplies the same unit* (Force Barrage, Blazing Bolt: one shard or ray per action).
3. *The cost buys safety or reach* (Horizon Thunder Sphere: range and half damage on a miss).

Martial equivalents: not found as "1 to 3 actions" cards. PF2e martials get fixed-cost compressors instead (Sudden Charge, Quick Jump: already in `ability-scope.md`). [memory]

### A2. What players and designers said

**The format is admired; the complaint is that there is too little of it.**
- [checked] "one of the true innovations in PF2e (IMO) is the introduction of multi-action spells. eg. magic missile and heal. ... the implementation of multi-action spells, is... minimal. there are presently only a handful of spells that take advantage of this awesome bit of mechanical goodness." And, in the same post: "I know this simply blows spell complexity through the roof". (EN World, thread "multi-action spells", post #1, Dec 15, 2020. https://www.enworld.org/threads/multi-action-spells.677069/)
- [checked] "it is nice how modular it is, and I find it's a pity that our pals at Paizo didn't make more spells with a variable casting time ... 98% or so of spells have a 2-action casting time, so anything else is an outlier." (same thread, post #8, Dec 20, 2020; the 98% is the poster's guess.)
- [checked] "'System invents new structures, doesn't really use them' seems to be a core theme of PF2." (same thread, post #3, Dec 16, 2020.)

**The criticism: one version is always best, so there is no choice.**
- [checked] "In our experience the idea to make the choice between 1, 2 or 3 actions interesting is overall not accomplished. First off, you still spend the spell slot even if you cast it as a weak one-action spell. For example, our wizard never casts anything but three-action magic missiles. ... Another spell with variable actions is Heal. But the two-action version is just so much better than the others there's no real choice." His own conclusion: "I think cantrips is where this idea belongs. The issue of 'wasting' slots on one-action casts goes away." (same thread, post #4, Dec 19, 2020.)
- [checked] "I'm wondering how many people have ever actually used Magic Missile with only one action, for example. I'd consider it a huge waste of a valuable spell slot, personally." (mrspaghetti, Paizo forum, "Variable action iconic spells", Dec 26, 2019. https://paizo.com/threads/rzs42vx4)
- [mine] Both complaints come from a second cost on top of the actions (the spell slot): the cheap version spends the same slot as the big one. Heal is the one of the three shapes where posters name different uses, and even there one poster calls 2 actions dominant.

**Why so few (players' reasons; no Paizo designer statement found).**
- [checked] gwynfrid, Paizo forum, Dec 23, 2019 (same thread): "I would very much like to see more variable casting action spells, but I can understand why there are few: - There already exist other ways to tweak spellcasting action cost vs effect, through metamagic feats. - There already are a number of one-action spells ... - Variable casting action spells make the game more complex. - There is always a risk of disrupting game balance by adding this much flexibility. So, if a spell has a variable casting action count, it needs to make sure that the 1-action version isn't stronger than the 1-action Magic Missile, or a 1-action focus spell: ie, not very strong."
- [checked] Castilliano, same thread, Dec 22, 2019: "The playtest, if I recall, had a 3-action Cone of Cold for a larger area, though Paizo said it was unpopular. ... I also think it'd skew balance, since the game would have to account for the most powerful version of the spell despite it being hard to get a 3-action spell off". (His recollection of what Paizo said, not a Paizo quote.)
- [checked] Hill Giant, same thread, Dec 22, 2019: "Part of the 'aesthetic' of PF2 is that each turn martials do lots of small things, while casters do one big thing. Too many one action spells would muddy that. Conversely, metamagic already covers improving a spell by spending an extra action."
- [checked] Temperans, same thread, Dec 23, 2019: "The reason 3-action spells dont seem worth it is that you cant do anything else during your turn. ... There are just too many demerits to a 3 action spell without making it exceedingly good to counteract its lack of versatility."
- [checked] Albatoonoe, same thread: "We don't want the 'martial iterative attack problem' to be repeated in Casters."
- [lead] Mark Seifter, Secrets of Magic playtest report: the team was "leaning toward making Act Together a variable-action activity", with a note that there is "an upper limit on how complex the class can be" (the Summoner; https://paizo.com/community/blog/v5748dyo6shfv). Search summary only; not opened.

### A3. Other games that scale by spend

- **D&D 4e augmentable psionic powers (Player's Handbook 3).** Rules [memory]: an at-will with "Augment 1" and "Augment 2 (or 4, 6)" lines paid in power points that refresh each encounter; the psion, ardent and battlemind have these in place of encounter powers. Reception, EN World thread "Psionic at-will scaling", Apr 13, 2010 (https://www.enworld.org/goto/post?id=5151021):
  - [checked] post #7: "As currently structured, there are very very few psionic powers that are worth augmenting with 6 PP when you can just spam the Level 1 powers at 2 PP augment; e.g., Demoralize."
  - [checked] post #8: "Psionics are a neat concept, but possibly flawed in execution. The biggest issue, IMO, is that (particularly for Ardents and Psions), their Level 1 At-Wills are better than any other At-Wills through Epic."
  - [lead] another poster: "augment 1 powers are too narrow to be considered great utility."
  - [mine] So the answer to "did players spam one mode?" is yes in this thread: the cheapest top augment of the best low-level power, repeated; the middle augment was the one ignored.
- **Lancer** [read, `lancer-data/lib/actions.json`]: the same verb in two sizes. Skirmish (Quick): "you attack with a single weapon." Barrage (Full): "you attack with two weapons, or with one SUPERHEAVY weapon." Quick Tech (Quick): one option; Full Tech (Full): "choose two QUICK TECH options or a single system or tech option that requires FULL TECH". It is a rule of the turn (2 Quick or 1 Full), not text on each card; some gear only works at the bigger size ("SUPERHEAVY weapons can only be fired as part of a BARRAGE").
- **Draw Steel** [read, Censor class page, steelcompendium.io]: scaling is by spending the Heroic Resource inside a fixed-action ability, not by spending actions: "Spend 1 Wrath: You can end one effect on the target ..."; "you can spend 3 wrath to deal holy damage ... then change the target of the strike". One optional line, one price. Reception: not found this pass.
- **13th Age, ICON:** nothing found this pass on scaling by spend. (13th Age 2e removed the Fighter's flexible attacks: see B2.)

### A4. A rule of thumb for how many abilities should be variable-cost

Not found. The only number seen is a player's guess that "98% or so" of PF2e spells are fixed at 2 actions [checked, EN World post #8 above].

### Patterns (A)

1. **Praised as an idea, rare in practice, and the rarity itself is a common complaint** ("awesome bit of mechanical goodness", "a pity", "invents new structures, doesn't really use them").
2. **Where the versions only multiply the same unit, players report one version dominating** (always 3-action Magic Missile; 2-action Heal; the 2 PP augment in 4e). The shape whose versions differ in kind (Heal: touch / range / area) is the one posters describe as a choice.
3. **A second cost shared by all versions kills the cheap one.** PF2e's slot and 4e's power points both made the small version "a waste"; one poster's fix is to put the format on resource-free cantrips.
4. **The top version costs the whole turn, and players price that loss high** ("you cant do anything else during your turn").
5. **Designers on both sides have a cheaper tool for the same job:** a rule of the turn (Lancer's Quick / Full; PF2e's metamagic "add 1 action to any spell") or one optional "Spend N" line (Draw Steel), not three written versions per card. Stated reasons for restraint (players', not Paizo's): complexity, and the 1-action version must stay weak.

### Not found (A)

- Any Paizo designer's own words on why so few variable-action spells exist (only players' reasons and one unopened Seifter lead).
- A stated ratio of variable-cost to fixed-cost abilities, in any game.
- Reception of Draw Steel's "Spend N" lines, of Lancer's Skirmish / Barrage pair, of ICON.
- The exact text of a 4e augmentable power (the sites.google.com 4e mirror did not yield it).
- Analysis-paralysis complaints tied specifically to variable-action cards (none seen; the complexity worry is about text and balance).
- Unread: Reddit (refused), RPG.net and Giant in the Playground (not tried, known to refuse).

---

## B. Critical-hit lines on individual ability cards

### B1. How systems write them

| System | Crit trigger and rate | Where the crit effect is written | Tag |
|---|---|---|---|
| **Draw Steel** | Natural 19-20 on 2d10 on an ability roll made as a main action: 3 in 100 = **3%** [mine] | One global rule, no per-ability lines: "A critical hit allows you to immediately take an additional main action after resolving the power roll, whether or not it's your turn and even if you are dazed". Also: "When you roll a natural 19 or 20 on a power roll, it is always a tier 3 result regardless of any modifiers". The per-ability excitement sits in the tier 3 line of every ability (17+). | [read] steelcompendium.io/v2/Browse/rule/combat/critical-hit/ and /rule/dice/power-roll/ |
| **Pathfinder 2e** | Beat the DC by 10, or a natural 20 steps the result up: about 5% to 30% by target [memory]; "just having a hit chance of 75% gives 25% chance of critical" [checked, Paizo poster, Nov 2018] | On every card that has degrees of success ("Critical Success" line), e.g. Horizon Thunder Sphere: "On a critical success, the target takes double damage and is Dazzled for 1 round" [read]; Inner Radiance Torrent: "On a critical failure, they're also blinded for 1 round" [read]. Plus critical specialization effects per weapon group (sword: off-guard; hammer: prone; and so on) [memory]. | mixed |
| **D&D 4e** | Natural 20 (5%); feats and paths widen it to 19-20 or 18-20 | Per magic weapon: a "Critical:" line, most often +1d6 per plus, sometimes an effect instead ("Some give more, others forgo giving damage and instead make the target prone etc.") | [lead] EN World search summary |
| **13th Age** | Natural 20 (5%); vulnerability widens it ("usually to 18+") | Global: "A natural 20 inflicts a critical hit for double damage." Per-ability excitement goes to natural-roll triggers instead (natural even hit, natural even miss, natural 16+) | [read] roll20.net/compendium/13thage/Combat; triggers [memory] + [checked, the Mazarbul post below] |
| **Lancer** | 20+ total on a melee or ranged attack | Global: "On a Critical Hit, all damage dice are rolled twice (including bonus damage) and the highest result from each source of Damage is used." | [checked] a community rules reference, not the book: lancer-rpg-operation-quiet-glass.vercel.app/mechanics/rolls/critical-hits/ |
| **Warhammer Fantasy 4e, ICON** | not looked up | not looked up | not found |

[mine] Draw Steel is the closest neighbour to a 3% crit: the same rate, and its answer is one global, large reward (an extra main action) with nothing written per ability.

### B2. Reception

**The designer's own account of why crit effects were piled on, and why it went wrong.**
- [checked] Mike Mearls, interview at Gen Con 2010, quoted by Mike Shea (Sly Flourish, "The Problem of Critical Hits", https://slyflourish.com/the_problem_of_critical_hits.html): "Critical hits started out design-wise as it only happens 1 in 20, it's random, players can't control it, let's throw a lot of effects there. But then if you have things like 'hey, you crit more often'. It's the example of two design ideals that come into collision."
- [checked] Mike Shea, same article: at 5% "You'll see it happen, but not all that often. It's low enough that few people would bother to build a character around it." "Stacking on additional powers on a crit isn't so bad when that chance is low. Even a true vorpal sword attack that beheads creatures on a crit can be a lot of fun if it doesn't happen all the time." "Extending crits is easy but it's also boring. Coming up with new and interesting effects on a crit is a better choice." And the failure case: "Rolling a 20 and shouting about a crit is no longer some fun rare occurrence. Instead, increasing critical hit ranges becomes a strategy" (4e's Daggermaster, 18-20).

**Players on crit riders that are rare and uncontrolled (Pathfinder 1e critical feats; Paizo forum, "Are Critical Feats Worthwhile?", Aug 31, 2015, https://paizo.com/threads/rzs2swhn; poster names not captured for these three):**
- [checked] "Critical feats are worth it if you (A) have a high crit chance AND (B) don't outright kill things on a crit." The closest thing found to a stated rule of thumb.
- [checked] "you only use them on a random chance, so you can't purposefully set-up an ally or disable some powerful ability. You'll use them everytime you crit, and it may or may not be an advantageous time for it. Hardly versatility."
- [checked] "They are momentary debuffs only, don't change strategy and barely change tactics."

**Players on PF2e's per-weapon crit effects (Paizo forum, "Crits are a lot more fun with more dice involved, IMO", Nov 2018, playtest era, https://paizo.com/threads/rzs42dlb; poster names not captured):**
- [checked] "I like rolling lots of dice, but I think they are more fun when you have a debuff on a critical hit. Like rendering foes flat-footed or pushing them around the field. That is why I really like critical specialization effects in PF2."
- [checked] "I've only seen a few of them come up but honestly that's mostly because I keep forgetting about it because I'm not used to the new rule. It's been cool when it has come up though."
- [checked] "Critical specializations on anything that isn't a sword probably isn't worth investing into." (answered by: "a lot of people (Myself included) think that the Sword crit effect is easily the least interesting.")
- [checked] On the feel of a crit that is only bigger numbers: "You want to watch a player deflate? Let them roll that crit against the big bad and then get 1s and 2s on their bucket o' dice." The same poster's table swapped double damage for "more cinematic" crits (prone, limbs).
- [lead] Another Paizo thread: against enemies that matter, "your chances of pulling off a crit don't feel worth the investment."

**13th Age's natural-roll triggers (the substitute for crit lines).**
- [checked] The Chamber of Mazarbul blog, Dec 5, 2012, reporting a Pelgrane forum debate (https://thechamberofmazarbuldnd.blogspot.com/2012/12/on-13-age-fighters-flexible-attacks.html): the complaint was that the Fighter "doesn't get to choose how to attack" (HomegrownHydra, Dec 1) and "it's hard to feel narratively empowered when a random dice roll ..." (the blog truncates it). The blogger's defence: the roll resolves the attack and the rider at once, and the player picks from what the die allows; he grants "Others might still take issue with the mechanic, and that's ok too".
- [lead] Pelgrane's "13A Changes from 1e" (2025): in 2nd edition the Fighter "no longer uses flexible attacks. Its maneuvers build on its basic melee attack."
- [lead] A 2018 forum post: two maneuvers both trigger on a natural even miss, so "there's not a lot of point in taking both" (Tapatalk, refused: unread).

### B3. Ways to make the dice exciting more often than 5%

- **Draw Steel tier 3** [read]: "This is the best outcome a power roll can have ... a strike ability deals a lot of damage and has a powerful or lasting effect". Each ability writes its own tier 3 line, so the per-ability payoff happens at tier-3 frequency; the 3% crit adds only the global extra action. Players may also "downgrade it to select the outcome of a lower tier".
- **13th Age natural even / odd / 16+** [memory for the rules; reception in B2]: about half of rolls trigger something; the cost reported is choice after the roll and less authorship, and the edition that followed dropped it for the Fighter.
- **Ironsworn matches (doubles on 2d10, 10% [mine])**: SRD wording per search summary [lead]: on a strong hit a match is "a twist in the narrative, something interesting, or a new opportunity"; on a miss "a heightened negative outcome, a complication, or new danger". One global rule, read by the result's tier, nothing per move. Reception: [checked] "I like the way Ironsworn handles these 'critical' rolls: when you roll doubles on the dice, something unexpected happens. A Strong Hit with a match on the dice is like a critical success, and a Fail with a match is like a critical failure." (Pestevan, itch.io comment, about 2025, https://itch.io/post/7551939). [lead] a fan variant makes matches rarer (only even matches count).
- **Genesys Triumph** (about 8% a Proficiency die [memory]): [checked] EN World, "Grading the Genesys System" (post 9282223): "All three groups were really excited at the beginning; the dice really do provide a cinematic flair to every roll (which, in my opinion, is the problem). For the first few sessions, the dice get a lot of love and praise. It starts to wear thin; the amount of detail that gets added to 'one success, two advantage' slowly fades away until your players, tired, just say, 'ah, I'm gonna give a boost dice to Jim.'" [lead] an FFG forum thread title: "Not a lot of Triumph related talents?" (players asking for more per-talent Triumph triggers).
- **PbtA 12+, Cortex, Sword World doubles:** not found this pass.

### Patterns (B)

1. **Games with rare crits write the crit once, globally, and make it big** (Draw Steel at 3%: an extra main action; 13th Age and Lancer at about 5%: a damage rule). Per-card crit lines belong to games where crits are common (PF2e, up to about 25%) or were meant to be widened (4e).
2. **The per-ability excitement is moved to a result that happens often**: Draw Steel's tier 3 line, PF2e's four degrees, 13th Age's natural-even triggers. Nobody found writes a different effect per ability for a 3% event.
3. **Rare crit riders are liked as moments and discounted as build value.** "Cool when it has come up" / "I keep forgetting about it" / "worth it if you have a high crit chance AND don't outright kill things on a crit" / "random chance, so you can't purposefully set-up an ally".
4. **Rare is also the condition that keeps strong crit effects safe.** Mearls and Shea: effects on a crit are fine, even vorpal, while the rate stays low and uncontrollable; the trouble starts when the rate can be raised (crit fishing).
5. **An effect is liked more than bigger numbers** (debuff or push over doubled dice; low-rolled crit dice "deflate"), and **frequent special results wear out** (Genesys: praised for a few sessions, then routine).

### Not found (B)

- A stated trigger rate at which a rider "starts to matter" (only the Paizo poster's two-part rule and Shea's "few would build around 5%").
- Any designer statement from MCDM on why Draw Steel's crit is an extra action and not damage.
- The 4e "Critical:" item lines read at source, and whether tables forgot them (search summary only).
- PF2e critical specialization text read at source (2e.aonprd.com returned no rules text to curl) and remaster-era opinions of it (the thread read is from the 2018 playtest).
- Warhammer Fantasy 4e critical tables, ICON, PbtA 12+ moves, Cortex and Sword World doubles; reception of doubles mechanics beyond one Ironsworn comment.
- Unread: Reddit (refused), Tapatalk 13th Age forum (403), RPG.net and Giant in the Playground (not tried).

## Sources opened
- https://github.com/foundryvtt/pf2e (v13-dev, spell JSON: heal, harm, force-barrage, blazing-bolt, horizon-thunder-sphere, inner-radiance-torrent)
- https://github.com/massif-press/lancer-data (lib/actions.json)
- https://www.enworld.org/threads/multi-action-spells.677069/
- https://paizo.com/threads/rzs42vx4 (Variable action iconic spells)
- https://www.enworld.org/goto/post?id=5151021 (Psionic at-will scaling)
- https://steelcompendium.io/v2/Browse/rule/combat/critical-hit/ , /rule/dice/power-roll/ , /class/censor/
- https://roll20.net/compendium/13thage/Combat
- https://lancer-rpg-operation-quiet-glass.vercel.app/mechanics/rolls/critical-hits/
- https://slyflourish.com/the_problem_of_critical_hits.html
- https://paizo.com/threads/rzs2swhn (Are Critical Feats Worthwhile?)
- https://paizo.com/threads/rzs42dlb (Crits are a lot more fun with more dice involved)
- https://thechamberofmazarbuldnd.blogspot.com/2012/12/on-13-age-fighters-flexible-attacks.html
- https://itch.io/post/7551939
- https://www.enworld.org/threads/grading-the-genesys-system.702979/post-9282223

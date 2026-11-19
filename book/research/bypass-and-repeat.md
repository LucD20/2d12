# Bypassing a cost outside a fight: unlimited retries and free recovery

**Date:** 2026-11-19. **Asked by Lucas,** setting the rules for Talents (decision T2): "Things shouldn't simply allow you to bypass. Big problem with 2e is the out of combat healing: Garden of Healing from animist is simply broken out of combat and trivializes it; Medic's and Skill feat's 'Treat Condition' makes conditions not last anything out of combat, since each attempt takes actions (so less than 6 seconds) and has no limit, you can attempt non stop. Feel free to make a research about this topic and add to our files."

**What was read, and how far to trust it.** One independent researcher, about 120 searches and page loads; the full report is `raw/2026-11-19-bypass-and-repeat.md`. **This file is Claude's summary of it.** Pathfinder 2e's rules were read on Archives of Nethys. **Every paizo.com page refused, as did Reddit:** no Paizo designer's own words were read (Bulmahn's and Sayre's remarks are leads only). Worlds Without Number, Shadow of the Demon Lord, Fabula Ultima and Forbidden Lands are from memory; Savage Worlds, Lancer, Warhammer 4e and Torchbearer come from fan pages. The Garden of Healing figure (about 25 HP to everyone in range every 10 minutes at rank 1) is the researcher's arithmetic, not a measurement.

**Other games' rules, never 2d12's. Nothing here is decided.**

---

## 1. Lucas's two examples, confirmed from the rules text

- **Pathfinder 2e's limits are all waiting times per patient** [read]: Treat Wounds, 1 hour; Battle Medicine, 1 day. Feats shorten the wait (Continual Recovery: 1 hour to 10 minutes; Godless Healing: a day to an hour) or treat more at once (Ward Medic: up to 8). **None spends anything that time doesn't give back.** Paizo's own text says Treat Wounds is for healing "up between fights".
- **Garden of Healing:** a 10-minute lockout, paid with a Focus Point that a 10-minute Refocus returns. Outside a fight the lockout binds nothing. A strategy site: "Your party should always be at full health before every encounter." [checked]
- **Treat Condition** (Player Core 2) [read]: two actions, no frequency, no immunity. Its critical failure (+1 to the condition) deters nothing when the next try is six seconds away. **Lucas's reading holds.** The wounded condition has the same shape: a 10-minute Treat Wounds clears it.

## 2. Retries in general

- D&D 3.5's Take 20 wrote the unlimited retry down and priced it only in time [read].
- D&D's 2024 guide: skip the roll when retrying costs nothing [read].
- The Alexandrian's "Let It Ride": a new roll only after a change of approach or a big change in the situation [checked].

## 3. What the praised games do

The games praised for keeping attrition alive make recovery spend something slow [read, checked]: D&D 4e's healing surges; 13th Age's full recovery only after four battles; Draw Steel's 24-hour respite; Torchbearer's conditions removed only in camp or town, with earned checks ("Conditions are the stick, checks are the carrot"); D&D 2024's Healer feat, where **the patient spends their own Hit Die**. Daggerheart caps short rests at three in a row and gives the GM a point of Fear each time the party rests.

## 4. A checklist: how an out-of-combat effect bypasses a cost

1. **Unlimited retries:** it can be tried again at once after a failure. A worse result is no limit if the next try is free.
2. **A time cost when time is free:** its only price is minutes or hours outside a fight.
3. **A lockout no longer than the refresh** (10 minutes against a 10-minute Refocus).
4. **A per-fight refresh paying for a per-day effect.**
5. **A cost moved to nobody:** neither the patient nor the helper spends anything slow.
6. **A window that other picks shrink.**
7. **Throughput instead of a limit:** a per-target limit multiplied by more patients or more helpers.
8. **A quick remover for a lasting cost:** it clears in seconds or minutes what was written to cross fights or days.

## 5. The fixes on record

| Fix | Game | Known cost |
|---|---|---|
| A daily pool, spent freely outside a fight, refilled only by a long rest in safety | 4e, 13th Age, Draw Steel | An unexplained daily limit; a number to track |
| Refill by fights, not hours | 13th Age | Count battles; resting early must be a loss |
| The patient pays | 4e's Lay on Hands, 2024's Healer, Worlds Without Number | The patient's pool must exist and be slow |
| A currency for recovery, earned or bought | Torchbearer, Blades, Mothership, Lancer | Too dear and it is skipped |
| A cap on short rests; the GM gains from them | Daggerheart | A resource on the GM's side |
| Recovery only in a place | Draw Steel, Mothership | Judging "safe"; travel |
| A window after an attempt | Pathfinder 2e | Works only if time is scarce and the window outlasts every refresh |
| One attempt per circumstance; let it ride | The Alexandrian, Burning Wheel | A judgment each time |

## 6. How it applies to 2d12 (observations)

**Already applied:**
- **Rally Points return only at a Rest** (24 hours in a safe place); a Sleep and a new encounter don't (Chapter 4): the daily pool of 4e and Draw Steel.
- **The patient pays:** Lay On Hands spends the target's Rally Point; "the resource they spend is the limit" (`items-economy.md` Part 2, item 11).
- **The Breather is deleted** (magic record, 55, 56): line 2 closed for Nonlethal damage.
- **Magic doesn't restore Health** (36): closes Garden of Healing's route for spells.
- **Wounds leave only at a Rest, one Check for each kind** (Chapter 4): one attempt a Rest.
- **Conditions follow how they end; a timer is unchanged outside a fight; an Encounter Action used between fights stays spent; the bag of rats** (`items-economy.md` Part 2, items 5 to 12).
- **"You can try again if you can pay again"** for magic (116); "not the same witness again before a Sleep" (128); repeating an approach in a Challenge takes 1 Bane (`roleplay-skills.md` item 9).
- **Time costs something in a site:** Alert, a Sleep rolled against it (`expedition-loop.md`).
- **Talents T1 and T2** (`talents-design.md`): this checklist is T2's test.

**Three things the researcher flags in the project's own files:**
1. **The rulebook still prints "Take a Breather"** (Chapter 4), deleted by decision 56 but not yet written out; `expedition-loop.md` items 11 and 13 still use it.
2. **Chapter 4's hourly healing while Unconscious** ("every hour you remove damage equal to what one of your Rally Points removes") is a heal priced only in time, and Chapter 4 doesn't say whether a sleeping character is Unconscious; `expedition-loop.md` says "a Sleep heals nothing".
3. **No general retry rule for a plain Check exists** in the rulebook: checklist line 1 is open for skills.

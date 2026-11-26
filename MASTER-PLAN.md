# 2d12: master plan

**Rewritten 2026-11-25 as the current order only** (the cleanup audit, pass 2). The plan as it stood, with every finished pack and the orders of 2026-10-31, 2026-11-11 and 2026-11-18, is in `archive/old-notes/MASTER-PLAN-to-2026-11-25.md`, word for word. How a pack is run, and every standing rule, is in `CLAUDE.md`. **Keep this file short: strike a line when it is done and move it out, don't layer a new order on top.**

Rule of the order (Lucas, 2026-11-11): decide what changes the numbers before building on it; Stage 0 (levels 1 to 3) fun first. Lucas, 2026-11-25: no extra levels until level 1 feels good.

## 1. Now

1. **Playtest 8** (Lucas): the level 1 pregens against the Bestiary's four new creatures, measured by the Encounter Log.
2. **The cleanup audit** (`book/audit-2026-11-25/`): answered and applied (the book, Foundry v0.0.520 and v0.0.521); 6 questions still held for Lucas (`work-order.json`, `do: "hold"`).

## 2. After playtest 8: the Bestiary (`book/bestiary-design.md`)

1. The retune of the four ranks' numbers from the table (decision 16).
2. The Boss (parked; three proposals are in the record).
3. The budget: the CV of the easy, hard and deadly bands, the caps, the party's size, the fights a day.
4. Roles; whether the ratings (Terrible to Extreme) come back; a simple pricing of an NPC's Actions.
5. More creatures; how a level 2 or 3 creature is written (options, never numbers); the list of Tags.
6. Foundry, once the numbers hold: the NPC Builder tab on the new rules; the ruler and the SIM unfrozen.

## 3. The core rework's rest (`book/core-rework.md`, section P)

- Batch 5's other pieces (the level 2 Escalation 3 abilities, the pace, Smite in dE, the Apex): when level 1 runs well at the table.
- Later in its list: the Modes at the class passes (H3), Wounds (C7).

## 4. Then, in this order unless Lucas says otherwise

1. **Talents**, restarted for the four playtest PCs (`book/talents-design.md`, T15).
2. **Magic's playtest kit**: one test caster, a few spells (`book/magic-design.md`).
3. **The weapon line**: the next weapon group, the bows' way (a record, a reading page, one decision at a time).
4. **Skills** (D3; `book/roleplay-skills.md`), then items and economy (`book/items-economy.md`).
5. Progression past Stage 0 (Stage 1 and the Apex at level 4).
6. The chapter reviews; the rest of the expedition loop after real play.
7. Much later: base building, mounts and vehicles, Quick Build.

## 5. Standing work, done when a file is touched

- An old Foundry dialog becomes a pick window or the bottom bar; an old plain chat line becomes a `sysCard` or `sysLine` (the lists: `foundry/foundry-backlog.md`).
- **A card is automated with general settings Lucas can see and edit on the item, never with code that looks for the card's name** (Lucas, 2026-10-30; test t164 fails on a card name in `module/`). A card too specific to automate stays text.

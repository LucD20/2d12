# Deprecated (out of the system since v0.0.413)

Lucas, 2026-11-17: "search what is left over in the system; anything that we haven't done, either delete or put into a deprecated folder for
future reference, including NPCs. I want just thing we worked on to matter or be changed."

What the redesigns didn't touch left the compendium and is kept here. **Nothing here is loaded by Foundry.** The list is
`DEPRECATED` at the end of `twod12/tools/content.mjs`; `node twod12/tools/dump-deprecated.mjs` (from `foundry/`) rewrites `compendium/`.

## What stayed in the system
The Basic Actions, the conditions, the species, the armor, the redesigned Paladin and Archer (their cards, effects and classes), the four
designed weapons (Arming Sword, Longsword, Hunting Bow, Recurve Bow) and their Weapon Techniques, the Dagger (the Archer's Darting Blade needs a
Light weapon; its numbers are still a placeholder and it has no Technique now), the Bestiary's four Stage 0 example NPCs (Goblin Sneak, Orc
Warrior, Grave Wisp, Ogre Chieftain), the eight pregenerated PCs.

## What is here
- `compendium/actions.json`, `effects.json`, `features.json`, `weapons.json`, `npcs.json`: Foundry's own data for each item or actor (name, type,
  img, folder, system, flags; an NPC with its items). To bring one back: move its name out of `DEPRECATED` in content.mjs (its definition is still
  there, or in `book/cards/*.json`), or create it in a world from the console: `Item.create(data)` / `Actor.create(data)`.
  - **Pack R's class cards** (folders "Paladin (old cards)", "Archer (old cards)") and their effects: replaced by the redesigns (F2, F3).
  - **The Talents** (16, and the Actions and effects they grant: Whirlwind, Bloodlust, Aim, Cut Through, Rimebrand...): set aside in the book
    (`book/rules-src/set-aside/16-talents.md`, `book/cards/set-aside.txt`). Brawler and Aim were Mithril.
  - **The placeholder weapons** (Handaxe, Greataxe, Mace, Maul, Spear, Pike, Knuckle Dagger, Hand Crossbow, Crossbow, Pistol, Musket) and the
    placeholder Weapon Techniques (Stick and Slip, Hooking Chop, Rending Chop, Ringing Blow, Bowl Over, Lunge, Keep Them Off, Gut Punch, Sting,
    Lock & Loose, Point Blank, Thunderclap), with "Hindered (until Move)" (Lock & Loose's): the book's Chapter 15 still lists them as placeholders.
  - **Fire Patch (test)** and its Zone: a testing Action.
  - **Divine Connection**: a Paladin Feature no class uses.
  - **The Bandit Thug**: an NPC the book's Bestiary doesn't have.
- `module/targeting.mjs`: the targeting banner, unused since v0.0.392 (the roll dialog's Target button replaced it).
- **v0.0.415 (pack CL, the code cleanup):** `templates-actor-sheet.hbs` (the old actor sheet, unused since v0.0.291) and `styles-old-sheet.css` (its 552 rules, `.twod12.sheet.ns` / `.v44`, out of styles/system.css); `module/versions.mjs` and `templates-versions-editor.hbs` (the Versions editor: no button opened it since the Action sheet); `module/gen-openGenerator.mjs` (the old Action generator, replaced by genaction.mjs).

Characters in an existing world keep any of these they already hold (nothing is deleted from a world); "Update from the compendium" skips them.

## Retired with pack SHEETS-HUD (v0.0.441, 2026-11-18)
- `module/statblock.mjs`: the one-page NPC sheet (`NpcStatBlockSheet`, v0.0.375) and its world setting "New NPCs open with". Lucas: "no need for
  one-page sheet since the npc one is already better anyway". The small NPC sheet replaces it; an NPC that used it opens the NPC sheet (the GM's
  client clears the flag at ready). Its CSS (`.twod12-sb`, system.css's v0.0.375 block) is left in place, unused, for the clean-up pack (CL).

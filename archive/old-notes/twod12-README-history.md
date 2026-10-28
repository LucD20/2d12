# The twod12 README before v0.0.166 (old version notes v0.0.4 to v0.0.111; the changelog is now in docs/reference.md)

# 2d12 System (Draft) for Foundry VTT V14, v0.0.7

Install: copy the `twod12` folder into `Data/systems/`, restart Foundry, create a world with this system.

## Items (create them in the Items directory)
- **Species**: Description / Details. Attribute Values, "Select 2 choices for +1", Body Modifier, Mind Modifier, Walk.
- **Class**: two Attribute Increase Choices, Body/Mind Modifier (the HP multipliers), Rally Modifier, Weapon/Magical Attack Attribute, and a Features list (drop Feature items, set a Level for each).
- **Feature**: Description, and the Actions it grants (drop Action items).
- **Action**: Traits, Targets, Check, and "Edit Versions" (one version per AP cost with Tier 1/2/3 damage instances and Effects).
- **Weapon**: Traits, damage per tier (pool, dice, die, modifier, subtype) and its own Actions.

## Characters
Drop a Species or Class on a sheet: popups ask for the choices (one by one). Dropping a Class grants Features up to the character's level (and again on level up); each Feature brings its Actions. Dropping a Weapon brings its Actions; mark the weapon **Wielded** on the Items tab. The Weapon trait uses the wielded weapon and the class Weapon Attack attribute (modifier = attribute / 2 + 1, rounded up) and adds the attribute to damage on Tier 2 and 3 unless an instance already has [At].

Attributes, species and class values, Walk, Rally Points and thresholds are calculated and read-only. Level, the four damage fields and Wounds are editable.

## Not automated yet
Rally use, AP, conditions other than Bloodied/Strained, Dying/Shattered flow, applying damage to targets, [C] choice, Reload and other trait rules, initiative (placeholder).

## v0.0.4
- Action cards show the check (dice, modifier chips, boons/banes, total) and highlight the tier; damage is rolled with the **Roll Damage** button into a second card with one box per damage type (Body/Mind/Choice) and an icon per subtype (Font Awesome, see `CONFIG.TWOD12.subtypeIcons`). The damage card also stores `flags.twod12.damage` (pool, subtype, total) for future automation.
- Trait tooltips (hover a trait on a card or in the Actions tab). Traits without rules show "TBD"; edit `traitHelp` in `module/config.mjs`.
- Actions and Items tabs use tables. The Versions window can collapse and reorder versions.

## v0.0.7/0.0.8: Effects
- **Effect** item type: Description/Details; Condition checkbox; Duration (None, EoT, Rounds + number); Note (attributes + Title + Note); Token Light (bright/dim in squares, color).
- Drop Effect items on each **Tier of each Version** in the Versions window and choose *Automatically applied* (applied when you click Damage or Half on the damage card) or *Conditional* (an **Apply effects** button appears on the damage card).
- Applying creates a Foundry Active Effect on the target (shown on the token). Light is set on the target's tokens and restored when the effect ends.
- Expiry (GM client): EoT ends at the end of the affected creature's turn; Rounds count down at the end of the origin's turn (not on the turn it was applied). Manual removal always works.
- Effects panel (top right, left of the sidebar) for the controlled token (or your character): hover for info, click for details, right-click to remove.
- The action roll dialog shows, on the right, the Notes of the roller's effects that match the roll's attribute.
- Block on the damage card is a toggle (no mechanics yet).

## v0.0.8
- Effect items use modular **Settings** (Token Light, Note), added from a dropdown; more types can be added in `TWOD12.effectSettings`.
- A version can have effects for the **whole Version** as well as per tier.
- The character **health bar** (Details tab) and the **token resource bar**: set the token's Bar 1 attribute to `health` (it is the default for new tokens). Lethal damage fills from the left (Body red, Mind blue), Nonlethal from the right on a thin bar above; ticks mark the Body and Mind thresholds.
- Actions tab: grouped Class / Basic / Items, sortable, with pictures and icon buttons.

## v0.0.9
- Effects: **Self Applied** option (applies to the origin instead of the target, even with no target); **Boons and Banes** setting with a trait predicate, applied automatically to the roll dialog's Boons/Banes for matching rolls.
- Attribute Roll buttons open the same roll dialog as Actions (DC, boons, banes, effect notes).
- Damage card: the attribute is a chip (e.g. `Body +2`) instead of a row.
- Right-click an effect icon in the effects panel to open its configuration.
- Health bar thresholds move with the damage (see the tooltip on the bar).

## v0.0.10
- Boons and Banes predicates: *All of* (and), *Any of* (or), *None of* (not) over traits. Numeric conditions (gte/lte on AP, level, tier...) are planned.
- Roll dialogs list every boon/bane effect as a toggle (on when its predicate matches, click to force on/off); the chat card names the source effect.
- Drag an Effect item from the sidebar onto a token (or onto a character sheet) to apply it.
- Effects panel: left-click opens the effect, right-click removes it.
- Doubles always get the blue highlight, even on a natural Tier 3.

## v0.0.11
- **Exception to the rules for testing:** the 3 boon / 3 bane limit is removed (no cap on boons or banes, from effects or manual input). Revisit before the full rules.
- Every roll dialog has a **Modifier** field (plus or minus to the total, shown as a chip on the card).
- Damage card: the target button is on the Total line (far left) and the action buttons are larger.

## v0.0.12: inline rolls and templates
Type these in chat (or in descriptions, Effect notes, and the Effects / tier text of Action versions); each becomes a button.
- `@Check[body|dc:14|adj:2|boon:1|bane:2|traits:divine,attack]{optional label}`: opens the roll dialog for each selected token (or your character). DC defaults to 13; omitted values are 0. `traits` decide which boon/bane effects start toggled on.
- `@Damage[(1d4+1)[body,slash],1d6[mind,holy]]`: rolls and posts the damage card. Tags in brackets: pool (`body`, `mind`, `choice`), subtype (`blunt`, `mental`, `pierce`, `slash`, `holy`), `nonlethal` / `lethal`. `|nonlethal` after the list makes every instance nonlethal. Default is lethal.
- `@Save[appeal|dc:13|t1:1d6[mind,holy]|t2:1d4[body,slash]|t3:0]`: a check whose tier rolled decides what happens. Each `tN` holds damage instances, plain text in quotes, and effect items (`Item.xxxx` or `@UUID[Item.xxxx]`), separated by commas. The damage is rolled automatically into a damage card targeting the roller.
- `@Template[emanation|distance:2|targets:enemies|self:no|places:yes]` and `@Template[burst|distance:2]`: click to place (right-click or Esc cancels). Emanation = squares within N by the 1-2-1 diagonal rule from the creature's square(s), centered on a square. Burst = squares whose centers are within N of a square center or a grid corner. Then a dialog asks Targets (All / Allies / Enemies), Target self, and Keep the area on the map; the result is targeted and optionally kept as a Region (GM). Allies/Enemies are relative to the token under the emanation or your selected token, using token dispositions.
- Damage cards now handle lethal and nonlethal per instance. The default grid diagonal rule is set to alternating 1/2/1 once (GM, core setting).

## v0.0.13
See `docs/reference.md` for the full list of chat commands. New: Create Button tool, Save card (chat-balloon button), saves deal damage automatically, template targets replace the current targets.

## v0.0.14
Save card is compact (name | check result | damage taken, colored by tier, with a Retarget button and a check dialog); the Save button and its chat-balloon button are joined; the Template chat button shows only an icon and the distance; buttons are squared (`--twod12-radius`).

## v0.0.15
`|label:` on every chat command; the DC shows on Check/Save buttons when it is not 13; templates can last `rounds:N` and can be `difficult:` terrain (with `difficultFor:`); colored cards (weapon actions have a yellow title and soft gradients; see `cardColors` in `module/config.mjs`); the target names sit at the right of the Target line on action cards.

## v0.0.16
AP costs are shown with the five Action Icons (`icons/ap1.png` to `ap5.png`, colored by the surrounding text). Card titles keep black text on a grey/yellow gradient; cards without a colored trait are grey. Damage-card buttons are round again and fit. Kept areas start when placed; `expire:eot` ends them at the end of the origin's turn. `@Template[emanation]` creates Foundry's native Emanation region when `places`/`rounds`/`difficult` keep the area.

## v0.0.17
Fixed the AP icons (the image path is now resolved with `getRoute`). Save checks calculate every die first and throw check and damage dice together (one Dice So Nice animation). Save card has a Name / Save / Damage header. Traits are chevron tags grouped by family (`traitFamilies` in `module/config.mjs`), with a white underline for traits that have extra rules (`traitRules`). Token bar: thicker nonlethal bar, brighter nonlethal colors (yellow / cyan), thicker threshold ticks. Healing instances.

## v0.0.18
Token health bar: no threshold ticks, slimmer nonlethal bar. Trait chevrons are bold again. The Save card shows the actual dice of each finished save (check dice with boons, banes and doubles, plus the damage dice).

## v0.0.19
NPCs: new `Archetype` item (HP turns T, Body share, granted actions) and an NPC actor with its own sheet (Details, Actions, Items, Effects). NPC Health Pool = ceil(22 x T x share x (level / 10 + 1)) per threshold. Attributes, Walk and Weapon Attack attribute are typed in. Actions and Weapons can be created right on the NPC ("New Action", "New Weapon"). Quick archetype presets: Professional (T 1.2, Body 70%), Mastermind (T 1.0, Body 40%), Brute (T 1.4, Body 80%); presets and the 22 are in `module/config.mjs`.

## v0.0.20
Action Generator and Avg / Exp damage columns on Actions; zipper Initiative as an Attribute Check; AP counter in the combat tracker (reset at the start of a turn, spent when using Actions, changes in the chat); roll dialog with Boons / Banes buttons and condensed Effect chips.

## v0.0.21
Initiative swap: 1 AP, with an ally who has not had a turn this round; the swapper is frozen and carries on with its remaining AP at its new turn.

## v0.0.22
Roll dialog preview; Vs. (DC 13 + target attribute) with Feature defenses; Basic Actions on every creature; `@Move[pushed|distance:N]` with collision and `@Move[walk|distance:N]`; movement charged as AP during a creature's turn; Reset Turn; Initiative button on sheets; EoT and Rounds follow the initiative count, so swapping cannot extend them.

## v0.0.23
Movement tracking uses two routes (preMoveToken and a position-update fallback) and converts grid units to squares; Push is limited to a cone away from the origin and Push/Template previews have an edge around the area; Versions have No Tiers and Use Rally Points; `@Rally[N]`; Self actions always target their user and hide the Target line; healing on damage rolls removed.

## v0.0.24
End movement button; Actions show a RAW rules card (all Versions) on the Description tab; Roll attribute vs Defense; Rest button (Rally Points only, no manual editing); character and NPC sheets restyled like the chat cards.

## v0.0.25
Category and Level on Actions and Features (shown at the far right of the title); class Features take their level from the Feature; Weapon Attack renamed, Traverse and Safe Movement added; `@Move[evade]` with Difficult Terrain check; attribute references in `@Move` distances (`walk/2`, rounded up); generator converts Pushed, Walk, Evade.

## v0.0.26
Speed, Strike, Magic, Focus, Cold, Frequency, Talents, effects that add damage to the next matching action and end after it, Rally card first, single Create Button window, trait highlighting, `game.twod12.seedPaladin()` test content.

## v0.0.27
Speed and Strike are the real internal names (old data is converted on load); Create Button writes to the chat box; Nonlethal trait; Rest completes a day's rest; Body/Mind Wounds; Weapon/Magic Modifier; Magic adds attribute damage; Bloodied/Strained at equal-or-more; NPCs die or fall unconscious at 0 HP; initiative for any number of groups; Round frequency on Strikes.

## v0.0.28
Generator: Saves, Checks, Template rounds, Attribute; blank Generate Action window; RAW card merges damage on one line; weapon card; send-to-chat icons; collapsible Actions sections; Use Rally Points removed from Versions; class sheet changes; Smite and Divine Power categories.

## v0.0.29
NPC weight classes (Minion, Grunt, Standard, Elite) on the NPC sheet; the Archetype only sets the Body/Mind split; generator converts quoted tier text.

## v0.0.30
Generate Weapon, Create Weapon Technique, tier effect per tier, Weapon default Round frequency, NPC basic actions without Rally, Dead overlay, combat strip with AP dots, faded used actions, dragging between windows.

## v0.0.31
Check by trait, Distance, Reach, Advance, Evade not split, movement area, speed and against effect settings, collapsible settings and cards, combat strip buttons, Reload, rules book restructure of cards.

## v0.0.32
Favored and Doomed rolls with toggles and odds, odds on cards, one-line card meta, Talent slots, Archer seeder, strip button fixes.

## v0.0.33
Conditions (@Condition), derived Bloodied/Strained banes, range banes, Empowered, forced tier, initiative group colors, Self card color, catalog command, class sheet fix.

## v0.0.34
Compendiums (classes, features, actions, weapons, effects) built by tools/build-packs.mjs; Cleave button; @Use button and Grant effect; wrong-token fix; seeders removed.

## v0.0.35
Trip/Shove traits and Vs. the rolled attribute, Handle free hand, Interact, hands on weapons, At-will frequency, Reload shot toggle, NPC compendium.

## v0.0.36
General Effects off on Tier 1, AP losses while Down, initiative ties, Wounds per kind, no Rally while Down, Reload grip button, Health labels, compendium updates (Smite, Lay On Hands, Lock & Loose, Opportunity Attack).

## v0.0.37
Rally Action blocked while Down, Evade action, Immobilized blocks Evade, Attribute damage with the weapon's type, Bloodied/Strained on Saves, no double Speed halving, compendium updates (Double Shot, Lay On Hands, Cold (Self), Archer Speed).

## v0.0.38
Two-letter subtypes, Vs. half Attribute, weapon traits on Weapon Actions, Requirements/Trigger/Reaction, Steel Yourself/Stand/Charge, compact Basic Actions, Prototype Token button, one-window class choices, roll dialog layout, strip dots/hide dead, Damage Report, wake-up rule, Unaware removed.

## v0.0.39
Boons and banes 1d3-1, Evade/Advance buttons move the right token, Critical row and detection.

## v0.0.40
Button traits and who moves, Save 'from' traits, Critical 20 above the DC and Critical table row, Talent modifiers, out-of-turn confirmation, Unconscious Doomed, table roll when hit while Down, encounter end check, Charge validation.

## v0.0.41
Line of Effect and Cover (blocked corners), Vague status with Hearing detection (sound wave), Senses rules.

## v0.0.42
Text cost badges, Leaning, Talent choices, Generate Action on Talents/Features, folders, Player Characters pack, Lesser Blessing/Rimebrand, Aim, Ricochet, Lock & Loose.

## v0.0.43
Compact AP badge (1/2/3AP), Talent choices always visible under the Talent, Ricochet distance text, singular they.

## v0.0.44
New card design (frequency colors, D1 tier marks, Version switch) and new sheet (sidebar, Favorites, Granted, condensed view, health bar clicks, weapon cards); book cards in layout A2.

## v0.0.45
Approved card look: trait chips, no faded text, dividers, one-line roll, aligned tiers; book cards the same.

## v0.0.48
Cleanup: unused styles, old sheet code, unused helpers and the AP icon images removed; Update Basic Actions fixed.

## v0.0.49
Fixes after testing: trait chips, card margins, tinted Effects, collapsed cards, DC ranges, retarget on Action cards, Save card look, one Bloodied, Talent slots.
## v0.0.50
Cleanup stages 3 and 1b: old-data conversions removed (start a new world), more dead and overridden styles removed; Create Button damage types updated.

## v0.0.51
Talent slot drops, version badges everywhere, Save row colors, line under the damage total, readable neutral title bars.

## v0.0.52
Documentation rewritten as one current reference (docs/reference.md) with a short changelog; the rules book's stylesheet cleaned and its builder fixed.

## v0.0.53
Sheet: Wounds as two rows (Body with the Dying Table, Mind with the Shattered Table); the health bar parts no longer pick up the button-group style.

## v0.0.54
Talents and Features tab rebuilt as rows like the Actions tab; the whole Attribute box rolls.

## v0.0.55
Talent and Feature cards rebuilt (plain title, grants, choices, slots, modifiers) and shown in the expanded rows of the Talents and Features tab.

## v0.0.56
Flavor: a line for every Action, Talent and Feature (compendiums, Basic Actions, NPC Actions, the book); Flavor fields on Actions (the input was missing), Talents and Features; trait chips keep the card margin; a sheet row shows an error if its card can't load.

## v0.0.57
Fists, Reposition, Barehanded, Size, Area and Setup; Vulnerable and Hanging; the Martial Talents; has(Name) variables in buttons; Empowered effects.

## v0.0.58
Actions can be Talents (no duplicate Talent items for Aim, Ricochet, Opportunity Attack, Cut Through, Whirlwind, Bloodlust); Actions can modify other Actions.

## v0.0.59
Skeleton Archer and Skeleton Swordsman (Minions with three Actions each).

## v0.0.60
Imperiled (was Hanging); Reposition Vs. the Attribute used.

## v0.0.61
Rolls: Bloodied and Strained on every Body/Mind Roll; Imperiled dooms every Roll; @Boon button.

## v0.0.62
Bloodied and Strained by Action traits and Saves; Unconscious dooms every Roll.

## v0.0.63
Basic Action frequencies and traits from the book, Fists needs a free hand, Interact helps others, Daily (purple), compendium text updates.

## v0.0.64
Senses: Vague is now Hidden; Obscured and Unsensed added, both sides applied, Area Actions ignore them.

## v0.0.65
Light levels and automatic perception per pair; Senses button; Hiding status; @Check sight:yes.

## v0.0.66
Light-level overlay in the token controls; roll-dialog options name their cause.

## v0.0.67
Overlay colors; Area trait; Emanation targeting; alphabetical rules-role trait chips; Double Shot text.

## v0.0.68
Area settings on Actions; Apply Area on yourself; card targets from Place Area; bold Area; chip outlines; granted chip names; Recovery button (Breather, Sleep, Rest).

## v0.0.69
Parchment chat cards; Hidden/Unsensed give Favored; Apply Area preview and confirm; sheet and item-sheet layouts; darker no-rule chips.

## v0.0.70
Movement checks creatures on the path; preview, version buttons and inline buttons in parchment; collapsed cards hide dividers.

## v0.0.71
Cleanup: dead and overridden CSS, unused imports and helpers, one damage-type table, Area-text conversion removed (start a new world).

## Tests
`node tools/tests/run.mjs` runs every test (Node 18 or newer, no install needed). A test FAILS if it throws; CHANGED means its printed output differs from `tools/tests/expected/<name>.txt` (check the difference; accept intended changes with `--update`). Run some tests only with their names: `node tools/tests/run.mjs t44 t62`. Foundry never loads this folder.

## v0.0.73
Required Linked Actions: target counts (Double Shot), disrupted Charges.

## v0.0.74
Daily, Sleep, Rest and Exhausted on the world clock (1 round = 10 seconds).

## v0.0.75
The World Clock (token controls): date and time from the world's calendar, GM buttons to move it, Everyone sleeps (8 hours).

## v0.0.76
World Clock window like PF2e's (no redraw), quick time bar above the chat, Count Exhaustion toggle, clickable Exhausted condition.

## v0.0.77
Clock window layout; quick time bar rebuilt at the top of the chat; Exhausted condition: badge, token HUD click and right-click.

## v0.0.78
Tiny quick time bar with page-wide clicks; Exhausted recognized by status, flag or name; + and − on the sheet; 2d12 tab in effect windows; game.twod12.time and game.twod12.exhausted.

## v0.0.79
Exhausted: token icon, Rally Points unchanged, Shift+click settings, Ctrl+click remove, no per-change messages; everyone sleeps = every character; quick bar full width.

## v0.0.80
Floating text on tokens (damage red/blue/green, effects + and −); the quick time bar's buttons are small fixed squares.

## v0.0.81
JRPG damage numbers (the old ones kept as Non-JRPG numbers); removals slide down; Foundry's duplicate effect text switched off.

## v0.0.82
JRPG numbers as rapid-fire bursts on top of the token in Lilita One; slow floating healing; HUD handlers added once; the quick bar as a small card that doesn't cover messages.

## v0.0.83
Thrown JRPG numbers (projectile motion with gravity); Exhausted on the token HUD goes through Foundry's status toggle (one path).

## v0.0.84
Numbers change direction at the top and fade before the ground; Exhausted ignores the HUD's apply/remove flag; HUD conditions (Prone, Hindered...) apply the system's Effects.

## v0.0.85
Linked conditions (Also applies): Prone brings Hindered; the Hiding status removed from the HUD.

## v0.0.86
One roll for several targets: areas are placed before the roll, per-creature DC, cover and modifiers, a row per creature on the card, damage rolled for each creature.

## v0.0.87
Several targets: one damage card with Damage/Half/Double/Block per creature and an All bar; compact roll card (identical creatures share a row, odds per row); target tiles in the roll dialog.

## v0.0.88
Target tiles: portrait with a number, boon and bane dots on top, one caption.

## v0.0.89
Prone (no Evade; only Crawl and Stand), Crawl, Evade rounded down, Engaged and Ranged Combat banes.

## v0.0.90
Unsensed prevents Engagement; floor() in distance expressions; movement area cleared when combat ends; Movement buttons outside combat (setting); GM tools refreshBasics and shadowedEffects.

## v0.0.91
Move buttons show their number (Evade 2 with a calculator); current Speed in expressions; right-click Favorite; colored lines on Talents and Features.

## v0.0.92
Rows can be reordered again; the favorite star after the Action title; Engaged ignores perception.

## v0.0.93
Cleanup: dead CSS, unused code and config entries removed; notes rewritten.

## v0.0.94
Slash icon inline on cards; set the date on the World Clock; Darkness as Difficult Terrain; Save and damage cards in the parchment style; Release as a Basic Action.

## v0.0.95
Damage buttons as a grid; plain total; Save card damage as a number with symbols; Darkness in Foundry's movement cost (ruler).

## v0.0.96
Ruler: Difficult Terrain (Darkness, unwilling creatures' squares) through the movement actions' cost function; rulerInfo reports what Foundry has.

## v0.0.97
Ruler: works around Foundry's read-only movement action settings.

## v0.0.98
Setup before the roll; the kept Emanation error fixed; distances by the 1-2-1-2 rule; the edge of a light counts.

## v0.0.99
Hearing: creatures in combat within the Hearing range (10 squares), through walls; Cut Through's Setup moves through creatures and ignores Difficult Terrain.

## v0.0.100
Scenes no longer start with Global Illumination; token vision follows the Senses; Unsensed stops the noise (no Hiding status).

## v0.0.101
The canvas follows the rules of Light (Global Illumination can stay on; Darkness regions hide creatures); lightInfo.

## v0.0.102
The rules of Light gate every sight mode (Light Perception too); Foundry 13 call shapes; lightInfo lists the detection modes.

## v0.0.103
Flanking boons in the roll dialog; lightInfo/visionInfo accept any shape of detection modes.

## v0.0.104
Flanking is SWADE-style: other flankers minus the target's allies that threaten you; no Flanked status.

## v0.0.105
Empowered N and Enfeebled N (per die), the Speed cap, dark fights, Interrupt and Trigger kinds, Fear, Tags, the same effect keeps the longer duration.

## v0.0.106
Conditions compendium; Empowered and Enfeebled as conditions with a value; two chips in the roll dialog; effects apply conditions; Tags as a selection; who moves for a movement button on a card.

## v0.0.107
The Token HUD icon of a condition with a value raises (click) and lowers (right-click) it, like Exhausted.

## v0.0.108
Every condition with a value works like Exhausted (text on the token with its value); Vulnerable is one condition with a value; Imperiled applies Vulnerable 3.

## v0.0.109
Areas: within N sq., Line of Effect and cover from the Point of Origin; riders that increase a condition's value; the effect editor's value; the light level label; numbered tabs for 10+ targets.

## v0.0.110
The light level is a zoned bar under the Darkness slider (not floating over the scene); game.twod12.sliderInfo().

## v0.0.111
A light level button in the lighting controls with a panel and a slider for the Darkness (GM only); no bar at the bottom.

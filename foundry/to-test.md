# To test in Foundry: the running list

The one list of what Lucas tries in Foundry (since v0.0.425; it replaced the per-version "TO TEST" sections of foundry-backlog.md, which stay as
history). **Foundry shows it:** turn on the world setting **Test checklist** (GM): a bar shows one test at a time (Shift+K shows or hides it),
Pass / Fail / Skip; a Fail asks what happened and keeps the console's errors; the bar's List has every test and **Copy report** (paste it to
Claude). The answers are saved in the world.

**How Claude keeps it** (`foundry/twod12/tools/build-checklist.mjs` builds `foundry/twod12/checklist.json` from this file; t268 fails when they
differ):
- `## Group` = where you meet it in play. `### id · vX · Title`, then `Do:` and `Expect:` (a field can go on over several lines), and `Rev: N`
  when a test's text is rewritten so that it must be tried again (its old answer no longer counts).
- A new version adds its tests here (in the group where they are met), rewrites a test it changes (Rev + 1) and deletes a test it replaces.
- A test Lucas reports as passed is deleted from here in the next version (the report's PASS line); a failed one stays until its fix (Rev + 1).
- Only what the automated tests can't see: how it looks, how it feels, Foundry itself. v0.0.387 to v0.0.406 are not here: Lucas tested them at
  the merge ("All works except momentum").
- **Each test's Do names the creature to test it with** (Lucas, 2026-11-18: "When asking for an action on the checklist, write which PC has it").
- The names: the compendium's PCs Aveline (Paladin, Smite), Durgan (Paladin, Lay On Hands), Sylwen (Archer, Quick Shots), Kaela (Archer,
  Strafe); the NPCs Goblin Sneak, Orc Warrior, Grave Wisp, Ogre Chieftain.

## Characters and sheets

## The HUD

### ui-hud-conds-popover · v0.0.482 · HUD condition polarity pills and +N overflow popover
Do: On Aveline, apply at least 4 active conditions/effects (mix buffs like Empowered / Shield of Faith and debuffs like Prone, Daunted, Hindered), then select Aveline's token and click the +N button on the HUD conditions row.
Expect: Debuffs (including Daunted) show downward debuff styling, buffs show upward buff styling, and past 3 items a +N ▾ button opens a clean popover grouped into Debuffs, Buffs, and Other (clickable to open the Effect).

### ui-hud-sit-urgent · v0.0.482 · HUD Situational tab count badge and Urgent vs. Available split
Do: Make Aveline Prone (Available situational item), then trigger a Reaction or map prompt (e.g. Judge damage reduction or Snap Shot on Sylwen) while viewing Hands/Macros.
Expect: The Situational tab shows a count badge, auto-switches cleanly when an urgent Reaction or prompt arrives (highlighting gold), and places urgent prompts above passive options (Prone / Granted) separated by a hairline.

## Starting a combat

## The roll dialog

### ui-rolldlg-net-cap · v0.0.482 · Roll dialog Net Boons/Banes badge, cap, and Favored/Doomed cancel
Do: With Sylwen targeting the Orc Warrior, open Basic Attack. Add 3 Field Boons (or 2+ named Boons of the same name), add a Bane to inspect the Net badge, then toggle both Favored and Doomed on at the same time.
Expect: The header shows a colored Net +N / Net −N / Net 0 badge (hiding at ±5 when Favored/Doomed takes over). Any named Boon/Bane past the 2-cap shows a dashed strikethrough and a small "cap" badge. Active Favored and Doomed together both show dashed strikethrough as cancelled.

## Chat cards

### ui-chat-modbar-tags · v0.0.482 · Chat card damage modifier strip, post-Apply tags, and dark theme polish
Do: With Aveline (Longsword) targeting an Orc Warrior (give it Resist Slash 2 or Empowered), roll Basic Attack (Tier 2 or 3, and try a Critical) and apply damage. Check both light and Foundry dark theme.
Expect: Under the rolled damage pool, a compact modifier strip lists contributing modifiers (Weapon / Flat / Empowered). After Apply, Resist / Weak / Immune show as compact readable tags after "Took". Critical boxes/labels and 5-Boon/5-Bane tags look crisp in both light and dark themes.

## Conditions and their Tiers

## Movement

## Reactions and Judge

## Areas, light and Cover

## Ending an encounter and resting

## The Encounter Log

## Windows



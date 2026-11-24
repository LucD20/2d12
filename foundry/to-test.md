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

### ui-token-bars-hp · v0.0.499 · Concept A flat token HP bars, overlays & count-down HP on sheets/HUD
Do: Open Aveline and Orc Warrior on the canvas and sheets. Deal Vigor Lethal, Vigor Nonlethal, Resolve damage, Guard, overflow past Vigor threshold (Bloodied), Strained, Down, and Dead (0 HP).
Expect: Token bars show flat matte converging Vigor (crimson, left) & Resolve (cobalt, right) with brass center pin, type-colored Nonlethal hatches, directional overflow hatches across the pin, Guard crown bar above, and crisp rim vignettes + micro-ribbons (Bloodied, Strained, Dying/Shattered/Unconscious, faded Dead — no giant Foundry skull overlay). PC/NPC sheets and HUD count down from max (0 = Bloodied/Strained, negative on overflow).

## The HUD

### ui-cond-icons-marks · v0.0.499 · 32 custom tactical condition SVG icons & Heraldic Portrait Seal marks
Do: Apply several conditions on Orc Warrior via the Token HUD or Actions (e.g. Vulnerable, Daunted, Prone, Empowered, Slowed, Exhausted, Grabbed, Lingering). Have Aveline use Judge and Sylwen use Mark Quarry on the same Orc Warrior.
Expect: All 32 conditions display crisp custom tactical SVG icons across the Token HUD, sheets, and HUD condition pills (with Frightened removed). Judge shows a gilded 8-point starburst Portrait Seal and Mark Quarry shows a crimson broadhead Portrait Seal stacked cleanly along the token's right edge without overlapping.

## Starting a combat

## The roll dialog

### pass3-save-breakdown · v0.0.498 · Save Roll Dialog named chips & live Modifier Breakdown
Do: Put Vulnerable 1 on Orc Warrior, have Aveline use Word of Radiance (or switch it to Nonlethal, or cast while Daunted/Bane) so Orc Warrior is inside with Low or High Cover, then click Orc Warrior's Save button on the chat card.
Expect: Vulnerable 1, Cover (Low/Medium/High), Nonlethal Save, and Caster's Banes appear as named toggleable chips (not anonymous Boon/Bane counters), and a live Modifier Breakdown line appears directly under the roll formula updating as you toggle chips or manual modifiers.

### pass3-setup-reminder · v0.0.498 · Setup-move Actions show "Modifiers before Setup" reminder
Do: On Kaela's turn, open Strafe's Roll Dialog (or Charge on Aveline); compare with opening Basic Attack's Roll Dialog.
Expect: Strafe / Charge shows a subtle bronze-bordered note above the Roll button ("Setup movement runs after Roll: set any manual modifiers now — range, Cover, and Flanking update automatically after you move."); Basic Attack does not show it.

## Chat cards

## Conditions and their Tiers

### pass3-feint-auto · v0.0.498 · Feint T2 (+2 Boons), T3 (Favored) & Critical (no Reactions vs. you)
Do: On Sylwen's turn (GM Force Tier), use Feint on Orc Warrior (target A) with a second enemy (target B) nearby: (1) Force T2 — open Basic Attack vs target B, then vs target A and roll; (2) Force T3 — check Basic Attack vs target A; (3) Force Critical (accept Critical row) — move Sylwen away from Orc Warrior (Opportunity Attack) vs moving Kaela away.
Expect: (1) T2 gives +2 Boons vs target A only and is NOT consumed by striking target B, then expires after striking target A; (2) T3 makes next Strike vs target A Favored; (3) Critical blocks Orc Warrior's Opportunity Attack against Sylwen ("Feinted: no Reactions vs. Sylwen") until EoT, while Kaela still triggers it normally.

## Movement

### pass3-auto-evade · v0.0.498 · Quick Shots & Darting Blade auto-start Evade 2 after rolling
Do: On Sylwen's turn in combat, roll Quick Shots (and try Darting Blade too) against an enemy.
Expect: Immediately after rolling, Evade 2 starts automatically with the movement range and HUD Evade banner (no extra click on the chat card Evade button); Roll Damage works normally; Darting Blade still prompts to stow its Light weapon once Evade ends.

### pass3-moveback-push · v0.0.498 · Reaction "Move back" ruler reset + Large Push aiming & wall slam damage
Do: (a) Trigger an enemy Opportunity Attack by dragging Sylwen away in combat, then click "Move back" on the Reaction card. (b) Use Shove / Push 3 on Large (2×2) Ogre Chieftain — hover squares directly off its right/bottom outer edge and diagonally off its corners; also push a creature standing right next to a wall or another creature by hovering just 1 square into the wall/creature (and compare hovering 1–2 squares in open space).
Expect: (a) Move back refunds 2d12 movement AND resets Foundry's movement ruler/history cleanly; (b) Large 2×2 Push aims smoothly from every outer edge & diagonal (hovering inside the Ogre's own squares does not aim Push 1, and the farthest gold squares are reachable); aiming into an adjacent wall/creature automatically computes full N-square collision damage (while clicking 1–2 squares in open space still allows a short push).

## Reactions and Judge

## Areas, light and Cover

## Ending an encounter and resting

## The Encounter Log

## Windows



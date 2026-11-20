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

### talents-pcs · v0.0.475 · The four playtest Talents on the level 4 PCs
Do: Update Foundry, then take Sylwen, Aveline, Durgan and Kaela (level 4) from the PCs compendium again (the Talents are new items) and open
each one's Talents tab, then the Actions tab.
Expect: an "Extra" row with Take Aim (Sylwen), Cold Domain (Aveline), Shared Burden (Durgan), Ricochet (Kaela); their Actions on the Actions
tab (Take Aim; Rime Strike; Oath of Burden and Bear the Blow; Ricochet), each card in the book's order. The level 1 copies have none.

## The HUD

## Starting a combat

## The roll dialog

## Chat cards

### ricochet-bounce · v0.0.475 · Ricochet's bounce: half of the damage to a second creature
Do: Kaela: Ricochet a Goblin Sneak that has an Orc Warrior within 2 squares of it; on a Tier 2 or 3, Apply the damage.
Expect: a bar "the arrow bounces off Goblin Sneak" with the Orc Warrior to click (and No ricochet); a damage card "Ricochet: the ricochet"
with half of each damage type the Goblin was dealt (rounded up) and no riders; its Apply takes the Orc's own Resistance and Guard. With no
creature in reach, one line says there is no ricochet.

## Conditions and their Tiers

### break-free · v0.0.475 · Break Free rolls its Check
Do: any PC (Kaela): Aveline hits her with Binding Light on a Tier 2 (Immobilized, its Action DC 11 + Aveline's Weapon Modifier), or drop
Immobilized on her by hand (DC 13); on Kaela's turn use Break Free (1 AP).
Expect: a Check card "Break Free: Instinct Check" (her higher of Body and Instinct) against that DC; meeting it posts "Kaela breaks free" and
ends Immobilized (and Grabbed); below it, "Kaela stays Immobilized". Forced Movement against an Immobilized creature still says "Action DC".

## Movement

### take-aim · v0.0.475 · Take Aim: the Boon, the far range, leaving the square
Do: Sylwen, in combat on her turn: use Take Aim (0 AP), then a Weapon Attack with the Hunting Bow at a creature at its far range. Then drag her
token one square, and use Take Aim again.
Expect: the roll dialog counts 1 Boon from Take Aim and no far-range Bane. The drag posts "Sylwen leaves its square: Take Aim ends" and the
effect is gone. The second Take Aim warns about its Requirement (she has left her square this turn) and is used anyway.

### ricochet-setup · v0.0.475 · Ricochet's Setup: a movement you must make
Do: Kaela, in combat on her turn: use Ricochet; in the Setup bar move 1 square, then Continue.
Expect: a warning "the Setup's movement must be made in full (1 of 2 squares left). Used anyway." and the roll goes on. Moving the full 2
squares gives no warning, and Shifting Aim counts no movement for that shot (she hasn't left her square).

## Reactions and Judge

### bound-ally · v0.0.475 · Shared Burden: the Bound Ally and Bear the Blow
Do: Durgan, in combat: target Aveline and use Oath of Burden (0 AP); keep him adjacent to her; the GM has the Orc Warrior hit Aveline. Then
move Durgan away and hit her again.
Expect: a gold ring with Durgan's portrait on Aveline's token (beside a Judge mark if he Judged a foe). The first hit's Reactions message
offers Bear the Blow (with Shield of Faith); Use: Durgan gains Guard 1, a line "Bear the Blow: Durgan takes X of the damage (half, rounded
up...), Aveline the other Y", and each part lands with its own Guard. Not offered when he isn't adjacent; the ring goes when the combat ends.

## Areas, light and Cover

### ice-pillar · v0.0.475 · Rime Strike's Ice Pillar
Do: Aveline: Rime Strike (choose Power mode) on an Orc Warrior; on a Tier 2 or 3 Apply the damage; click a square in the bar. Then drag the Orc
toward the pillar, use the Line of Effect button through it, and use Rime Strike again for a second pillar.
Expect: the damage is Cold; the bar offers only the empty squares next to the Orc that Aveline has Line of Effect to; an Ice Pillar token rises
there with walls on its edges (chat: its Defense = 11 + her Power Modifier). The Orc can't move through it; it blocks Line of Effect behind it
but can itself be targeted. The second pillar melts the first.

### ice-pillar-break · v0.0.475 · The Ice Pillar breaks on 5 from one Action
Do: Sylwen shoots the Ice Pillar twice: one hit dealing 4 or less, one dealing 5 or more. Then end the combat with a pillar standing.
Expect: "Ice Pillar holds: ... does nothing (and doesn't add up)", then "Ice Pillar breaks" and its token and walls go. Ending the combat melts
every pillar left (EoE). Its Tier 1 against a Save and a Collision's damage to it are by hand.

### eoe-text · v0.0.475 · EoE in Foundry's own texts
Do: Aveline: Lantern of Faith, Kindle; open the effect on her (its Details) and hover it.
Expect: its Ends and hover read "until the end of the encounter (EoE)"; Kindle's description says EoE.

## Ending an encounter and resting

## The Encounter Log

## Windows


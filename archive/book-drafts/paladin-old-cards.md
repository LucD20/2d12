# The Paladin's other cards (kept for later reference)

> **Pack OT (2026-10-30, proposed):** where each card below goes (an option, a Talent, folded in, or out) is in `book/options-talents.md`, sections 2 to 5.

These are the Paladin cards that are **not** in the default build (pack P1, 2026-10-29), as the book had them. Lucas: "let's just include the ones we are working on"; they come back, reworked or not, in the Options step (book/class-charter.md, section 7: every other Pick as a sidegrade priced against the default). Their prices before P1 are in `book/ruler/prices.md` (`catalogue/paladin.txt`). Nothing here is in the built book.

**Open for the Options step:**

- **Mercy's Reward** needs both Lay On Hands and Smite ("When you heal an ally with Lay On Hands, your next Smite is Empowered 2"), and a Paladin now has only one of them: rewrite it (for example, for Lay On Hands Paladins: "your next [Strike] Action") or drop it.
- **The Power list** (a Power version of Holy Wrath, riders on [Divine] Actions): Smite → Weapon, Lay On Hands → Power.
- **Champion's Challenge** waits for NPC targeting in the ruler (pack E2).
- **Vow of Enmity** was the example of "increase your Empowered value" in the Stacking rules (Chapter 2 now uses a generic example).

## Paladin Repertoire: Passive

<div class="action" markdown="1">
<div class="action-head"><span>Aegis</span><span class="cat">Paladin Feature 1</span></div>

**Flavor:** Your watchful presence protects one soul above all.

At the start of each encounter, choose one ally. While you are within 3 squares of them, you and they gain 1 Boon on Saves.

</div>

<div class="action" markdown="1">
<div class="action-head"><span>Mercy's Reward</span><span class="cat">Paladin Feature 1</span></div>

**Flavor:** Mercy shown is mercy returned.

When you heal an ally with Lay On Hands, your next Smite is Empowered 2. It is used up by that Smite.

</div>

## Paladin Repertoire: Turn

<div class="action" markdown="1">
<div class="action-head"><span>Rebuke</span><span>1 / 2R</span><span class="cat">Paladin Feature 1</span></div>

**Flavor:** The hand that strikes the faithful is burned for its trouble.

*Divine • Power*

**Frequency:** Turn

**Target:** The triggering creature

**Distance:** Reach

**Vs:** WD

**Trigger:** An enemy within Reach damages an ally.

| | 1R | 2R |
|---|---|---|
| **Tier 1** | [M] 1d4+1 Ho | [M] 1d6+1 Ho; Pushed 1 |
| **Tier 2** | [M] 1d6+1 Ho | [M] 1d8+1 Ho; Pushed 2 |
| **Tier 3** | [M] 1d8+1 Ho | [M] 1d10+1 Ho; Pushed 3 |
| **Critical** | The target is Vulnerable 1 (EoT). | The target is Vulnerable 1 for 1 round. |

</div>

## Paladin Repertoire: Round

<div class="action" markdown="1">
<div class="action-head"><span>Vow of Enmity</span><span>1 / 2 / 3 AP</span><span class="cat">Paladin Feature 1</span></div>

**Flavor:** You name a foe, and your god listens.

*Divine • Power*

**Frequency:** Round

**Target:** One / one / two creatures

**Distance:** 5 sq.

**Vs:** WD

| | 1 AP | 2 AP | 3 AP |
|---|---|---|---|
| **Tier 1** | No effect. | No effect. | No effect. |
| **Tier 2** | Your next [Strike] Action against them gains 1 Boon, and you increase your Empowered value by 1 for that Action. | As 1 AP, and [M] 1d6 Ho. | As 2 AP. |
| **Tier 3** | As Tier 2, and [M] 1d8 Ho. | As Tier 2, and the target is Vulnerable 1 (EoT). | As 2 AP. |

</div>

<div class="action" markdown="1">
<div class="action-head"><span>Sacred Weapon</span><span>1 / 2 AP</span><span class="cat">Paladin Feature 1</span></div>

**Flavor:** You lay a hand on the steel and bless it for what comes next.

*Divine • Focus*

**Frequency:** Round

**Target:** One / two creatures

**Distance:** Reach

| 1 AP | 2 AP |
|---|---|
| You touch a creature (yourself or an ally). If they are not Empowered, they become Empowered 1 for 1 round. If they are Empowered 1 (from any source), they become Empowered 2 for 1 round. If they are Empowered 2 or higher, no effect. | As 1 AP, but you can touch up to two creatures. |

</div>

<div class="action" markdown="1">
<div class="action-head"><span>Champion's Challenge</span><span>1 / 2 AP</span><span class="cat">Paladin Feature 1</span></div>

**Flavor:** You call them out, and they cannot look away.

*Divine • Power*

**Frequency:** Round

**Target:** One / two creatures

**Distance:** 5 sq.

**Vs:** WD

| | 1 AP | 2 AP |
|---|---|---|
| **Tier 1** | No effect. | No effect. |
| **Tier 2** | 1 Bane on [Strike] and [Power] Actions against anyone other than you (EoT). | As 1 AP. |
| **Tier 3** | As Tier 2, but 2 Banes instead of 1. | As 1 AP. |

</div>

## Paladin Repertoire: Encounter

<div class="action" markdown="1">
<div class="action-head"><span>Word of Radiance</span><span>2 / 3 AP</span><span class="cat">Paladin Feature 1</span></div>

**Flavor:** You speak a word, and light pours from your hands across everything that stands against you.

*Area • Divine • Power*

**Frequency:** Encounter

**Target:** All enemies in the Area

**Area:** 2 / 3 Emanation

**Distance:** 5 sq.

**Vs:** WD

| | 2 AP | 3 AP |
|---|---|---|
| **Tier 1** | [M] 1d8 Ho | [M] 2d6 Ho |
| **Tier 2** | [M] 2d6 Ho | [M] 2d8 Ho |
| **Tier 3** | [M] 2d8 Ho; Prone | [M] 2d10 Ho; Prone |

</div>

<div class="action" markdown="1">
<div class="action-head"><span>Divine Retribution</span><span>2 / 3R</span><span class="cat">Paladin Feature 1</span></div>

**Flavor:** They struck you. Your god strikes back.

*Divine • Split • Strike*

**Frequency:** Encounter

**Target:** The triggering creature

**Distance:** Weapon (Weapon mode) or Reach (Power mode)

**Vs:** AD (Weapon mode) or Vs. WD (Power mode)

**Trigger:** You take damage from an enemy within the Distance of this Action.

**Split:** Choose Weapon or Power when you use this Action.

| | Weapon | Power |
|---|---|---|
| **Tier 1** | [B] 1[W] + [M] 1d10 Ho | [M] 2d8 Ho |
| **Tier 2** | [B] 1[W] + [Mod] + [M] 1d12 Ho | [M] 2d10 Ho |
| **Tier 3** | [B] 1[W] + [Mod] + [M] 2d8 Ho | [M] 2d12 Ho |
| **Critical** | The target is Pushed 3. | The target is Pushed 3. |

**3R:** As 2R, and every enemy in an Emanation 2 centered on you, except the triggering creature, must make an Appeal Save: [M] 1d10 Ho; Pushed 2 / [M] 1d8 Ho / 0.

</div>

## Paladin Repertoire: Daily

<div class="action" markdown="1">
<div class="action-head"><span>Miraculous Recovery</span><span>2 / 3 AP</span><span class="cat">Paladin Feature 1</span></div>

**Flavor:** You lay both hands on the wound and call in a debt owed to your god.

*Divine • Focus*

**Frequency:** Daily

**Target:** One creature

**Distance:** Reach

| 2 AP | 3 AP |
|---|---|
| You touch an ally. They heal twice what 1 Rally Point would heal, and you end one non-permanent effect of your choice on them. | As 2 AP, but three times what 1 Rally Point would heal. |

</div>

<div class="action" markdown="1">
<div class="action-head"><span>Divine Intervention</span><span>1 / 2R</span><span class="cat">Paladin Feature 1</span></div>

**Flavor:** You reach out, and your god answers before you finish the prayer.

*Divine*

**Frequency:** Daily

**Target:** One creature

**Distance:** 5 sq.

**Interrupt:** You or an ally within 5 squares would go Down.

| 1R | 2R |
|---|---|
| Instead of going Down, the creature's total damage becomes 1 less than their Health Pool, and they gain 1 Boon on their next Save (EoT). | As 1R, and the creature can use 1 Rally Point at once. |

</div>

## Paladin Escalation: Passives

<div class="action" markdown="1">
<div class="action-head"><span>Divine Vigil</span><span class="cat">Paladin Escalation (Passive)</span></div>

**Flavor:** Your watch does not end when the fighting starts.

While your Escalation is 2 or more, you and your allies in an Aura 3 around you gain 1 Boon on Saves against [Fear] Actions.

</div>

<div class="action" markdown="1">
<div class="action-head"><span>Avenger's Oath</span><span class="cat">Paladin Escalation (Passive)</span></div>

**Flavor:** Every wound your friends take is written in the ledger.

While your Escalation is 2 or more, when an ally within 5 squares becomes Bloodied, you gain 1 Boon on your next [Strike] Action.

</div>

## Paladin Escalation: Actives

<div class="action" markdown="1">
<div class="action-head"><span>Call to Arms</span><span class="cat">Paladin Escalation</span></div>

**Flavor:** Your voice carries further than the fight.

*Divine*

**Escalation:** 1

**Frequency:** Round

**Target:** One Down ally

**Distance:** 3 sq.

| 0 AP |
|---|
| The ally can use 1 Rally Point. |

</div>

<div class="action" markdown="1">
<div class="action-head"><span>Hand of Mercy</span><span class="cat">Paladin Escalation</span></div>

**Flavor:** A single touch undoes what the enemy worked for.

*Divine • Focus*

**Escalation:** 1

**Frequency:** Round

**Target:** One ally

**Distance:** Reach

| 1 AP |
|---|
| You touch the ally and remove one effect of your choice from them that is EoT or has 1 round left. |

</div>

<div class="action" markdown="1">
<div class="action-head"><span>Judgment</span><span class="cat">Paladin Escalation</span></div>

**Flavor:** The verdict is not yours to give, only to deliver.

*Divine • Power*

**Escalation:** 2

**Frequency:** Round

**Target:** One enemy

**Distance:** Reach

**Vs:** WD

| | 1 AP |
|---|---|
| **Tier 1** | No effect. |
| **Tier 2** | [M] 2d6 Ho; Hindered (EoT) |
| **Tier 3** | [M] 2d8 Ho; Hindered (EoT) |

</div>

<div class="action" markdown="1">
<div class="action-head"><span>Sanctified Ground</span><span class="cat">Paladin Escalation</span></div>

**Flavor:** You make a small piece of the world your god's, and it holds.

*Area • Divine*

**Escalation:** 2

**Frequency:** Round

**Area:** 1 Emanation

**Distance:** 5 sq.

| 1 AP |
|---|
| You fill the Emanation with Holy light for 2 rounds. Enemies in it take 1 Bane on [Strike] Actions. |

</div>

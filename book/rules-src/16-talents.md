<!-- doc: talents -->
# Talents

Talents are features that you get as you level up. Use them to customize your character the more powerful they get. You pick a Talent at levels 1 and 2 (your class's level list says when).

Every Talent has a **category**, a **level** and sometimes **Prerequisites**. The card's head shows the category and the level: *Combat Talent 1* is a Combat Talent you can take from level 1.

- **Categories:** **Combat** (fighting with weapons and bare hands), **Mobility** (moving), **Magic** (gifts and spells) and **Skill** (skills; they come with the Skills rules).
- **Level:** you can take the Talent once your level is at least this.
- **Prerequisites:** what you need before you take it. Each one is a Talent ("Brawler"), a level ("Level 5"), an Action with a trait you have ("a [Divine] Action") or an Attribute ("Body 2"). Some Talents form a chain: Brawler, then Kickboxer.

Talents can be Actions. For example, Aim is an Action, while Battering Charge is just a Talent. Effects of the same kind don't stack (see [[Stacking]]): two Talents that make you Empowered give one Empowered.

## Talents That Modify Actions

Some Talents change other Actions instead of (or as well as) giving you a new one. The Talent says which Actions it changes and when, and what it adds: for example a Critical, an effect, or a Boon. Opportunity Attack gives your Weapon Technique Actions a Critical when you use them out of your turn.

## Combat Talents

These Talents are for characters who fight with a weapon or with their bare hands. Any character can choose them if they meet the Prerequisites.

<div class="action" markdown="1">
<div class="action-head"><span>Opportunity Attack</span><span>1R</span><span class="cat">Combat Talent 1</span></div>

**Flavor:** You punish anyone who moves carelessly near you.

**Frequency:** At-will

**Target:** The triggering creature

**Interrupt:** A creature within 3 squares would leave a square during a Move Action or uses the Stand Action.

You can make a Weapon Attack (1A) against the triggering creature, as long as your weapon can target them. Used this way, out of your turn, it has a **Critical:** You disrupt the triggering Action before it happens.

</div>

<div class="action" markdown="1">
<div class="action-head"><span>Challenge</span><span class="cat">Combat Talent 1</span></div>

**Flavor:** You call them out, and they cannot look away.

Once per round, when you deal damage to a creature with a [Melee, Strike] Action, you can challenge them: until the end of their next turn, their [Strike] Actions against creatures other than you take 1 Bane.

</div>

<div class="action" markdown="1">
<div class="action-head"><span>Heavy Blows</span><span class="cat">Combat Talent 1</span></div>

**Flavor:** Every swing carries the whole weight of the steel.

When a [Melee, Strike, Weapon] Action you make with a Two-handed weapon deals damage on a Tier 3, it deals 2 more.

</div>

<div class="action" markdown="1">
<div class="action-head"><span>Whirlwind</span><span>2 AP</span><span class="cat">Combat Talent 1</span></div>

**Flavor:** You spin, and everything within reach feels the blade.

*Area • Melee • Self • Strike • Weapon*

**Prerequisites:** Heavy Blows.

**Frequency:** Encounter

**Target:** All creatures in the Area

**Area:** 1 Emanation

**Vs:** AD

| | 2 AP |
|---|---|
| **Tier 1** | [B] 1[W] + [Mod] |
| **Tier 2** | [B] 1[W] + [Mod] + 4 |
| **Tier 3** | [B] 1[W] + [Mod] + 6 |

</div>

<div class="action" markdown="1">
<div class="action-head"><span>Bloodlust</span><span>1 AP</span><span class="cat">Combat Talent 1</span></div>

**Flavor:** The red haze settles, and you stop caring about pain.

*Self*

**Frequency:** Encounter

| 1 AP |
|---|
| For 1 round, your [Melee, Weapon] Actions are [[Empowered]] 1 and gain 2 Boons, and you take 1 Bane on Saves. |

</div>

<div class="action" markdown="1">
<div class="action-head"><span>Brawler</span><span class="cat">Combat Talent 1</span></div>

**Flavor:** Your hands have won more fights than any blade.

You gain the Pummel Action. Your [[Fists]] don't have the [[Non-threatening]] property: you can flank with them.

</div>

<div class="action" markdown="1">
<div class="action-head"><span>Pummel</span><span>1 AP</span><span class="cat">Brawler</span></div>

**Flavor:** A flurry of blows until something gives.

*Melee • Strike • Weapon*

**Frequency:** At-will

**Target:** One creature

**Distance:** Weapon

**Vs:** AD

**Requirements:** You have a free hand.

| | 1 AP |
|---|---|
| **Tier 1** | [B] [Mod] Bl |
| **Tier 2** | [B] 1d4 + [Mod] Bl |
| **Tier 3** | [B] 1d6 + [Mod] Bl |

</div>

<div class="action" markdown="1">
<div class="action-head"><span>Kickboxer</span><span class="cat">Combat Talent 1</span></div>

**Flavor:** Your legs hit as hard as your fists.

**Prerequisites:** Brawler.

You gain the Leg Sweep Action: a kick, so it needs no free hand. You can use it with your hands full.

</div>

<div class="action" markdown="1">
<div class="action-head"><span>Leg Sweep</span><span>1 AP</span><span class="cat">Kickboxer</span></div>

**Flavor:** A low kick takes their legs out from under them.

*Melee • Strike • Weapon*

**Frequency:** Round

**Target:** One creature

**Distance:** Weapon

**Vs:** AD

This Action uses your [[Fists]] even when you have no free hand.

| | 1 AP |
|---|---|
| **Tier 1** | [B] 1d4 Bl |
| **Tier 2** | [B] 1d4 + [Mod] Bl |
| **Tier 3** | [B] 1d6 + [Mod] Bl; Prone. |

</div>

<div class="action" markdown="1">
<div class="action-head"><span>Aim</span><span>1 AP</span><span class="cat">Combat Talent 1</span></div>

**Flavor:** Patience turns a good shot into a sure one.

*Ranged • Strike • Weapon*

**Frequency:** Round

**Target:** One creature

**Distance:** Weapon

| 1 AP |
|---|
| Make a [Ranged] Weapon Attack (1A) with 1 Boon. It ignores Low Cover. |

</div>

<div class="action" markdown="1">
<div class="action-head"><span>Ricochet</span><span class="cat">Combat Talent 1</span></div>

**Flavor:** Walls, shields and stones are just more angles.

**Prerequisites:** Aim.

Your [Ranged, Weapon] Actions can bounce off one surface on the way. The projectile goes from the surface to the creature, and you calculate Line of Effect, Cover and Sight from the center of the surface. The distance is the total the projectile travels: if you shoot at a surface 5 squares from you and the target is within 6 squares of the surface, that is an 11-square shot. You must still perceive the creature to target them. A bounced shot takes 1 Bane.

</div>

<div class="action" markdown="1">
<div class="action-head"><span>Long Draw</span><span class="cat">Combat Talent 1</span></div>

**Flavor:** You pull a little further, and the arrow flies a little truer.

With a [[Projectile]] weapon, your far range has no Bane and your maximum range has 1 Bane instead of 2.

</div>

<div class="action" markdown="1">
<div class="action-head"><span>Steady Nerves</span><span class="cat">Combat Talent 1</span></div>

**Flavor:** They are in your face. You are still calm.

Your [Ranged] Actions don't take the Banes for being Engaged.

</div>

## Mobility Talents

<div class="action" markdown="1">
<div class="action-head"><span>Battering Charge</span><span class="cat">Mobility Talent 1</span></div>

**Flavor:** Nothing slows you down once you start running.

When you use Charge, your Speed counts as 2 higher for its movement, and its Weapon Attack (1A) is [[Empowered]] 1.

</div>

<div class="action" markdown="1">
<div class="action-head"><span>Cut Through</span><span>2 AP</span><span class="cat">Mobility Talent 1</span></div>

**Flavor:** You drive through the line without stopping, and strike as you pass.

*Melee • Strike • Weapon*

**Frequency:** Round

**Target:** One creature

**Distance:** Weapon

**Vs:** AD

**Setup:** Evade 2. During this Evade you can move through the space of any creature (you can't end in one), and you ignore Difficult Terrain.

| | 2 AP |
|---|---|
| **Tier 1** | [B] [Mod] |
| **Tier 2** | [B] 1[W] + [Mod] |
| **Tier 3** | [B] 1[W] + [Mod] + 2 |
| **Critical** | Relocate (1A) the target, ignoring the Handle trait. |

</div>

## Magic Talents

<div class="action" markdown="1">
<div class="action-head"><span>Lesser Blessing</span><span class="cat">Magic Talent 1</span></div>

**Flavor:** A small gift from the god you follow.

*Divine • Power*

Pick one blessing from the list below, related to a god you follow. You gain its Action. (More blessings will be added.)

</div>

<div class="action" markdown="1">
<div class="action-head"><span>Rimebrand (Cold)</span><span>1 AP</span><span class="cat">Lesser Blessing</span></div>

**Flavor:** Frost creeps along your weapon, a gift from a winter god.

*Divine • Power • Self*

**Frequency:** Round

| 1 AP |
|---|
| Until the end of your turn, your [Weapon] Actions deal an extra [M] 1d4 Co, and the first one that deals damage on a Tier 3 makes the target Hindered (EoT). |

</div>

<div class="action" markdown="1">
<div class="action-head"><span>Sacred Weapon</span><span>1 / 2 AP</span><span class="cat">Magic Talent 1</span></div>

**Flavor:** You lay a hand on the steel and bless it for what comes next.

*Divine • Focus*

**Prerequisites:** Lesser Blessing, or a [Divine] Action.

**Frequency:** Round

**Target:** One / two creatures

**Distance:** Reach

| 1 AP | 2 AP |
|---|---|
| You touch a creature (yourself or an ally). If they are not Empowered, they become Empowered 1 for 1 round. If they are Empowered 1 (from any source), they become Empowered 2 for 1 round. If they are Empowered 2 or higher, no effect. | As 1 AP, but you can touch up to two creatures. |

</div>

## Class Talents

<div class="action" markdown="1">
<div class="action-head"><span>Class Expertise</span><span class="cat">Combat Talent 5</span></div>

**Flavor:** You have studied your craft longer than most.

**Prerequisites:** Level 5.

Choose one Encounter or Daily Action from your class's Repertoire that you don't have. You gain it.

</div>

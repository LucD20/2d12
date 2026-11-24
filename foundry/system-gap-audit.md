# 2d12 Foundry VTT V14 — System & Ecosystem Gap Audit

> **Status:** Saved for future planning — **not to be implemented yet.**

**Audited:** `foundry/twod12/` (`v0.0.474`, branch `ui-strip-dialogs-polish`) · **Benchmarked against:** Foundry VTT V14 (Stable `14.359`–`14.362`), Pathfinder 2e (PF2e), Draw Steel (V14), and D&D 5e.

> [!NOTE]
> **Big-picture verdict:** At `v0.0.474`, `2d12` is already **more deeply automated than ~90% of Foundry VTT systems**—including several commercial ones. Most of what standard Foundry "must-have" modules solve (Token Action HUD, Combat Carousel, Floating Damage Numbers, Flanking/LoE/Cover/Light helpers, Reaction Prompts, Turn Breakdown, World Clock, Undoable Damage Cards, NPC Turn-Budget Builder) is **already built natively** in `2d12` with STYLE-3 theming and 290 automated tests.
>
> The gaps below are **only verified, real omissions** where Foundry V14's newest core APIs or top modern systems (PF2e / Draw Steel / dnd5e) do something genuinely useful that `2d12` doesn't yet handle.

---

## 1. Foundry V14 Native Gaps & Subtle Gotchas

Foundry V14 shipped major core pillars (**Scene Levels**, **Native Pop-Out Applications**, **Scene Regions V2**, **Active Effects V2**, **Placeables Palette & Sidebar**, **Particle/VFX API**). Here is where `2d12` currently diverges or breaks:

### 1.1 Zero Awareness of Foundry V14 Core Scene Levels (`scene.levels` / `token.level`)
V14 built multi-floor vertical maps directly into core (retiring the *Levels* module). Tokens now carry a singular `token.level` ID, while Walls, Lights, and Regions carry a `levels` Set. Across all ~100 modules in `foundry/twod12/module/`, there are **zero references** to `scene.levels`, `token.level`, or `region.levels`.

**Concrete issues on any V14 multi-level Scene:**
- **Creature cover across floors:** `coverBetween` (`foundry/twod12/module/cover.mjs:55-85`) and `coverFromPoint` (`foundry/twod12/module/cover.mjs:92-102`) scan `canvas.tokens.placeables` in 2D without filtering by `level` or vertical overlap—a creature on Floor 2 directly above the line of fire can grant Low Cover on Floor 1.
- **Lighting across floors:** `lightAt` (`foundry/twod12/module/light.mjs:83-101`) iterates `canvas.effects.lightSources` and `darknessSources` checking only `(p.x, p.y)`, without checking whether the light belongs to the target token's `level` (or `elevation` range).
- **Zones hitting tokens on other floors:** `refreshZones` (`foundry/twod12/module/zone.mjs:104-131`) and `areasNow` (`foundry/twod12/module/areafx.mjs:22-48`) test containment solely via 2D grid cells (`z.cells`)—a Consecrated Ground or Hazard placed on Floor 1 affects tokens standing on Floor 2 directly above it. *(Connects cleanly with planned Branch B for 3D Region placement + elevation/level bounds.)*
- **Aura rendering across levels:** `auraPlan` (`foundry/twod12/module/aura.mjs:16-34`) safely uses 3D `tokenDistance`, **but** `redrawAuras` (`foundry/twod12/module/aura.mjs:131-158`) draws all scene Auras onto `canvas.interface` without filtering to `canvas.level`.

### 1.2 Foundry V14 Native Pop-Out Windows (Multi-Monitor Detach)
V14 added native browser window pop-out for all `ApplicationV2` windows (sheets, chat log, dialogs). Two things in `2d12` assume a single `document`:
- **Typography class missing in popped-out windows:** `applyTheme` (`foundry/twod12/module/theme.mjs:11-15`) puts `.twod12-type` only on the main window's `document.documentElement` (`<html>`). When a `twod12` sheet or window is detached to a second browser window, its child `<html>` won't inherit `.twod12-type` unless synced on pop-out/render.
- **Popped-out Chat Log breaks card buttons & inline chips:** In `foundry/twod12/module/twod12.mjs:386-475`, all delegated `click`, `contextmenu`, and `dragstart` listeners for chat cards (`[data-twod12]`, `[data-twod12-inline]`, `[data-cc-toggle]`, `[data-ctx]`) are bound strictly to the main window's `document`. If the GM or a player pops out the Chat Log onto a second monitor, clicking Apply, Undo, Roll Damage, or inline chips in that popped-out chat window will silently fail.

### 1.3 Roll Modes Missing on Saves, Attribute Checks & Dying/Shattered Rolls (+ Minor `CheckRollWindow` Bug)
- Action rolls (`foundry/twod12/module/rolldlg.mjs:625` / `foundry/twod12/module/actions.mjs:1282`) properly offer Foundry's **Roll Mode** selector (`Public`, `Private GM`, `Blind GM`, `Self`) and apply `ChatMessage.applyRollMode(...)`.
- **Gap:** `CheckRollWindow` (`foundry/twod12/module/checkwindow.mjs:97-138`) and `rollCheck` (`foundry/twod12/module/roll.mjs:191-205`, plus `rollTable` at `210-223`) have **no Roll Mode selector and always post publicly**. A GM can't roll a secret NPC Save or ask a player for a **Blind GM Instinct / Mind Check** (one of the most-used features in PF2e and dnd5e for perception, traps, and hidden lore).
- **Small bug caught during audit:** `showOddsEnabled` (`foundry/twod12/module/checkwindow.mjs:12-14`) reads the retired `showOdds` client setting (always `false` on new worlds) instead of `rollDialogStats` (`"all" | "gm" | "none"`), so tier percentages never display in the new Save/Check dialog.

### 1.4 Foundry V14 Region Attachments & Modern Cleanup Opportunities
- **Token-attached Regions:** V14 supports attaching a `RegionDocument` directly to a `Token` (so it moves automatically with the token and respects Scene Levels). Today `aura.mjs:131-158` manually redraws PIXI containers on every move/hover. Keeping `2d12`'s exact square-grid footprint rules is right, **and** token-attached Regions (or `RegionLayer#placeRegion` for Branch B) are worth leveraging where they simplify moving Zones/Auras.
- **Minor legacy hooks/fallbacks:** `twod12.mjs:354` still binds legacy V12 `getChatLogEntryContext` alongside V14's `getChatMessageContextOptions`, and `actions.mjs:321` retains one fallback `DialogV2.prompt` branch inside `askRoll`.

---

## 2. High-Impact GM & Player Features Missing vs. Top VTT Systems

These are **high-leverage tabletop features** present in PF2e, Draw Steel, or dnd5e that fit `2d12`'s current ruleset cleanly (not blocked on unwritten book chapters):

| Priority | Feature | Current State in `2d12` | Why It Matters at the Table |
| :--- | :--- | :--- | :--- |
| **High** | **GM Encounter Builder & Live Combat CV Budget** | `data.mjs:311` & `npcbudget.mjs:51-61` already compute exact per-NPC `cv`, `cvBase`, and `cvSteps`, and the Bestiary defines encounter CV budgets—**but nothing sums them for an encounter**. | Adding (1) a **live CV budget badge** in the Initiative Window / Combat Tracker comparing total hostile CV against party size & level, plus (2) a lightweight **Encounter Builder** (pick Bestiary NPCs → see difficulty → spawn/add to combat) gives GMs instant PF2e-grade encounter prep. |
| **High** | **GM "Request Check / Group Roll" Prompt** | `builder.mjs:1-160` can post a single `@Check` or `@Save` button, which spawns separate chat messages per player. | Like PF2e's check prompts / Monk's TokenBar: let the GM pick Attribute, Check/Save, DC, **Blind GM toggle**, and Party/Selected Tokens to post **one unified interactive card** showing every PC's pending slot, rolled Tiers, and group outcome (great for exploration, stealth, traps, and social scenes). |
| **High** | **Hotbar Drag-and-Drop Macros (`hotbarDrop`)** | `hud.mjs:19` embeds Foundry's macro hotbar right into the HUD, and `drag.mjs:20-48` enables sheet-row dragging—**but `hotbarDrop` is never hooked**. | Dragging an Action, Weapon, Feature, Save, or Condition onto the HUD's hotbar should auto-generate a one-click macro (using a clean `game.twod12.useItem(...)` API). Unlocks full custom hotbars beyond `Alt+1..9` Favorites and Stream Deck / macro-module compatibility. |
| **High** | **Filterable Compendium Browser** | `CharacterSheet.browseItems` (`actor-sheets.mjs:1306-1309`) opens Foundry's bare, unfiltered `twod12.weapons` pack; Quick Insert searches by name only. | A STYLE-3 **Compendium Browser** with tabs (Actions, Weapons/Armor/Gear, Bestiary, Effects/Conditions, Features/Talents) and structured filters (AP cost, Frequency, Traits, Weapon Group, NPC Rank/Role/CV) is consistently rated PF2e's #1 QoL feature for both players and GMs. |
| **Medium–High** | **"Modifiers Matter" Highlight on Roll Cards** | `chatcards.mjs:99-153` displays a clean Boon/Bane/Modifier breakdown, but doesn't indicate whether a modifier actually shifted the Tier. | In `2d12`, every `+1` Boon / `-1` Bane / Flanking / Cover / Marked Quarry can cross `DC`, `DC+7`, or `DC+20` (or trigger 5-Boon Favored). Highlighting decisive modifiers (e.g., `Flanking (+1) → Tier 3!`) rewards tactical play at a glance—PF2e players treat *Modifiers Matter* as mandatory. |
| **Medium** | **Party Sheet / Shared Stash & Group Actions** | `hud.mjs:130-145` has a great read-only **Party Strip**, and NPCs have one-by-one `giveLoot` (`actor-sheets.mjs:1693`). There is no shared Party Stash, Coin Splitter, or Group Rest/Breather action. | Extending the Party Strip (or adding a compact Party Sheet) with **Party Breather / Party Sleep**, **Coin Split**, **Shared Party Loot stash**, and a **Senses / Exhaustion / Wounds glance table** bridges the gap cleanly ahead of the full Town/Economy pack. |

---

## 3. Quality of Life, Feel, Ecosystem & Future-Readiness

### 3.1 Dice So Nice! Special Effects & Tabletop Audio Cues
- **Already works:** `showDice` (`foundry/twod12/module/roll.mjs:49-54`) already combines and animates 3D dice via `game.dice3d`, and `hud.mjs:23` plays a soft Reaction chime (`rxChime`).
- **Missing polish:**
  - Custom **Dice So Nice!** trigger/flair for `2d12`'s signature moments: **Doubles**, **Three-of-a-kind Critical**, and **Exploding 12s** (plus an optional custom `2d12` dice theme).
  - Optional client-toggleable micro-SFX for **Your Turn Started**, **Critical / Doubles**, **Escalation Step Up**, and **Creature Goes Down / Bloodied**.

### 3.2 Interactive Onboarding Tours (`game.tours`)
- Foundry's native `Tour` framework lets systems ship guided 60–90 second interactive spotlights (`Configure Tours`).
- Because `2d12` has rich custom UI (Combat Strip, Action HUD, Hands widget, Reaction Stack, LoE / Cover Height / Area Height / Flanking / Range overlays), shipping two short Tours—**"Player Quickstart"** and **"GM Tactical Tools"**—dramatically lowers onboarding friction for new playtesters compared to reading the 534 KB `reference.md`.

### 3.3 Public Gameplay Macro API & Custom Hooks
- `game.twod12` (`foundry/twod12/module/twod12.mjs:149-175`) currently exposes mostly diagnostic and migration utilities (`lightInfo`, `rulerInfo`, `migrate*`, `time`, `exhausted`, `escalation`).
- Only **one** custom hook exists in the entire system: `twod12.escalationChanged` (`foundry/twod12/module/escalation.mjs:146`).
- Exposing a small, stable gameplay API (`useItem`, `rollCheck`, `rollSave`, `applyCondition`, `requestRoll`) and lifecycle hooks (`twod12.rollCheck`, `twod12.actionUsed`, `twod12.damageApplied`, `twod12.turnStart`) makes user macros, automated tests, and future community modules effortless.

### 3.4 Localization (`lang/en.json`)
- `foundry/twod12/lang/en.json` currently contains **8 lines** (only `TYPES.Actor.*` and `TYPES.Item.*`); all UI strings, tooltips, settings, and chat messages are hardcoded English.
- **Pragmatic take:** Staying hardcoded during rapid playtest iteration is actually *faster* and avoids churn—treat full i18n extraction as a pre-1.0 / public-release milestone rather than an urgent task right now.

---

## 4. Already Tracked (Backlog / Planned / Rulebook-Gated)

For completeness, these are **known items already tracked** in `foundry/foundry-backlog.md`, `foundry/automation-ratings.md`, or prior branch plans—included here only so nothing falls through the cracks:

- **Planned Branch B (3D Canvas Areas):** Live in-canvas 3D Area placement (altitude picker + live 3D hit highlighting) and persisted vertical elevation/level bounds on Zone Regions.
- **Book-Synced Foundry Pack (in backlog lines 789–800):**
  - **Break Free** actual Body/Instinct Check roll against Action DC (currently removes Immobilized without rolling).
  - **EoE** label cleanup (`until the encounter ends` → `EoE`).
  - **Halving & splitting damage** per subtype (for *Bear the Blow* / *Ricochet*) and **forced full-distance movement**.
  - **4 Playtest Talents** (*Take Aim*, *Rime Strike* / *Ice Pillar*, *Bear the Blow*, *Ricochet*).
- **Remaining 5 Bronze Actions (out of 62 rated in `foundry/automation-ratings.md:91-102`):** *Hit and Run*, *Opening Shot*, *Weight of Judgment* (Speed −2 on Judged), *Interact* (draw/stow/swap choices), and *Hide* (awaits book rules).
- **Code Stubs / Future Rulebook Chapters:** `steadiness` bonuses from Features/Talents/Effects (`data.mjs:74`), Fly/Climb/Swim speed modifiers (`fxsheet.mjs:98`), Cones & wider Lines (`book/rules-src/03-movement.md`), Squeezing auto-detection, Items/Economy/Belt/Load/Town Visit (`book/items-economy.md`), Skills & Magic chapters, and updating the opening sections of `docs/reference.md`.

---

## 5. Suggested Next Priorities (Highest Bang-for-Buck)

If you want the cleanest progression from here without conflicting with active rulebook work:

1. **Quick V14 Hardening + Polish Pass (small, high-safety):**
   - Fix `CheckRollWindow` (`foundry/twod12/module/checkwindow.mjs:12-14`) odds setting (`rollDialogStats`) + add **Roll Mode** (`Public / Private GM / Blind GM / Self`) to Saves & Checks.
   - Make `theme.mjs` and chat card event delegation pop-out safe for V14 multi-monitor windows.
   - Add **Scene Levels** filtering (`token.level` / `region.levels` / `canvas.level`) to `cover.mjs`, `light.mjs`, `zone.mjs`, `areafx.mjs`, and `aura.mjs` (pairs naturally with Branch B's 3D area placement).
2. **GM Table-Runner Pack (huge playtest value):**
   - **Live Encounter CV Budget** in the Initiative Window / Combat Tracker + compact **Encounter Builder**.
   - **Request Check / Group Save** prompt (with Blind GM support).
3. **Player Delight & Ecosystem Pack:**
   - **Hotbar Drag-and-Drop Macros** (`hotbarDrop`) + clean `game.twod12` action/roll API.
   - **"Modifiers Matter"** highlight on roll breakdown cards.
   - **Filterable Compendium Browser** (STYLE-3) + optional **Welcome Tours**.

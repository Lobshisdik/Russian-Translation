# Hypernet Explorer — Semilinear Tutorial Outline

This document outlines the tutorial structure for new players. The tutorial uses Switch 75 to enable/disable the hint system (MapTodoList.js). Players can press **H** at any time to open the in-map task list. The tutorial is semilinear: core survival mechanics are gated and must be learned in sequence, while optional systems (cooking, fast travel, minigames, etc.) are unlocked as branches the player can explore at their own pace.

---

## Phase 1 — Preset Character (Switch 33 = ON at start)

**Character creation is skipped for the tutorial.** The player begins with a fixed preset:

| Property | Value |
|---|---|
| Class | Cyborg (Class 66) |
| Variable 42 | `66` |
| Switch 33 | `ON` (set before scene loads) |
| Variable 38 | `0` (Male, default — can be changed in a later menu) |
| Variable 87 | `-1` (None — Cyborg body, no biological reproduction) |
| Archetype | Mechanical / Cyborg (set via `ChangeArchetype` plugin command) |

**Opening premise**: The player's Cyborg character has just re-activated inside a landfill tunnel network, their systems rebooting from ambient electromagical energy seeping through the junk strata. No memory of how they got here. Mechanical limbs operational. Hunger gauge already ticking.

The title screen transitions directly to Phase 2 without opening the ClassSelector scene.

---

## Phase 2 — First Steps: Survival Basics (linear)

**Location**: Landfill tunnel (starting map — underground, tagged `<Interior>` and `<Dark>`)
**Tutorial switch**: Switch 75 ON
**Todo list**: "Awakening" (Switches 1–4)

The player wakes up mid-corridor. Ambient electromagical crackling fades. No NPCs yet — just junk, dim flickering lights, and the sound of distant machinery. Mechanics are introduced one at a time as the player explores the tunnel. Each task must be completed before the next hint appears.

### Task 1 — Hunger (Switch 1)
> "Your power cells are low. Scavenge something to restore your energy."

- **Teach**: The hunger bar drains at 0.05 per step. At 20% the player gets a debuff; at 0% HP drains 1% max HP per step.
- **Action**: Find a scavenged food/fuel item in the tunnel (placed as a pickup event) and use it via the Items menu.
- **Notes**:
  - For the Cyborg, hunger is framed as power draw / cell charge — the mechanical framing is cosmetic; the underlying Variable 88 mechanic is identical.
  - Overeating above 110% applies State 41 (Stuffed / Overcharged). Encourage moderation.
  - Recovery formula: `(calories × 0.10) + (protein × 2.00) + (fat × 1.50)`
- **Completion**: Switch 1 → ON

### Task 2 — Sleep (Switch 2)
> "Your systems need a standby cycle. Find somewhere safe to shut down briefly."

- **Teach**: Sleep bar drains at 0.03 per step. At 0% MP drains 1% max MP per step.
- **Action**: Interact with a makeshift rest spot deeper in the tunnel (a cleared alcove with scrap bedding) to trigger RecoverSleep.
- **Notes**:
  - Sleep is framed as a maintenance/standby cycle for the Cyborg.
  - Sleep loss is slower than hunger — still needs management on long trips.
- **Completion**: Switch 2 → ON

### Task 3 — Health Status (Switch 3)
> "Run a self-diagnostic. Check the condition of your chassis."

- **Teach**: Open the menu → Health Status. Shows individual limb and organ HP.
- **Action**: Open the Health Status screen and inspect at least one body part.
- **Notes**:
  - Damaged limbs apply stat penalties (e.g. damaged arm actuator → ATK down).
  - Cyborg archetype will show mechanical components alongside any remaining organic parts.
  - Prosthetic shop available later (Switch 88) — especially relevant for a Cyborg.
  - Switch between party members with LEFT/RIGHT in the Health Status screen.
  - If Switch 9 (Permadeath) is ON: add a reminder here that destroyed components are permanent.
- **Completion**: Switch 3 → ON

### Task 4 — First Combat (Switch 4)
> "Something in the tunnel is hostile. Engage."

- **Teach**: Basic RPG Maker MZ battle flow. Party attacks, skills, items.
- **Action**: Win a scripted encounter near the tunnel exit (a scavenger or malfunctioning bot).
- **Notes**:
  - Damage in combat distributes to specific limbs, not just overall HP.
  - Victory sets Switch 34 (battle victory flag) — used by BattleSystemEnhanced.
  - The Cyborg's starting skills should reflect their class (mechanical/electric attacks).
- **Completion**: Switch 4 → ON

**Phase 2 complete** → Tunnel exit opens. Player emerges onto the world map (Map 315). Switch 75 remains ON but todo list adapts to current map.

---

## Phase 3 — The World Map (semilinear)

**Location**: World Map (Map 315)
**Variables**: Player X = Var 43, Player Y = Var 44

The world map is the hub for the rest of the tutorial. From here, three branches open simultaneously. The player may complete them in any order.

---

### Branch A — Exploration & Fast Travel

**Todo list**: "Exploration" (Switches 10–12, Forest maps 4–6)

#### A1 — Discover a biome (Switch 10)
> "Walk into the wilderness. Each region of the world is different."

- **Teach**: Stepping off the world map into a tile triggers ProceduralMapBiomeGenerator → transfers to Map 636.
- Generated map matches the biome tile (forest, dungeon, road, village, cave, mountain, etc.).
- **Action**: Enter any procedural map and walk around.

#### A2 — Use fast travel (Switch 11)
> "Long distances are tiring on foot. Find a faster way to travel."

- **Teach**: Fast travel via StartFastTravel plugin command. 28 transport modes available.
- Cost: 10 gold base + 0.15L fuel per distance unit (if using vehicle).
- **Action**: Open a fast travel point and travel to a new destination.

#### A3 — Fuel management (Switch 12) — *optional branch*
> "Your vehicle needs fuel. Keep an eye on the tank."

- Camper: max 100L (Variable 65). Car: max 60L (Variable 71).
- ShowRefuelWindow at any fuel depot.
- **Action**: Refuel a vehicle before the tank hits empty.

---

### Branch B — Cooking & Nutrition

**Trigger**: Player has Items 127 or 128 in inventory (enables Cooking menu).

#### B1 — Open the cooking menu
> "You have the tools to cook. Combine ingredients for better nutrition."

- **Teach**: Main menu → Cooking. Select two food items to combine.
- Result nutrition = first item × 2 + second item values.
- Cannot cause overeating (caps at 100% hunger).
- **Action**: Cook any recipe successfully.

#### B2 — Read a recipe tag — *optional*
> "Some items have recipes listed. Follow the formula."

- Item note format: `<Recipe: 582x2, 583x1, 585x2, 584x1>`
- **Action**: Find an item with a recipe note and cook it exactly.

---

### Branch C — World Events & Status

#### C1 — Check the temperature (Variable 61)
> "The environment affects your body. Check the current temperature."

- **Teach**: WeatherSystem sets temperature (Variable 61) on `<Exterior>` maps.
- Weather changes on exterior maps; interior/covered maps suppress weather.
- **Action**: Step into an exterior map and open the status screen to view temperature.

#### C2 — Observe weather change
> "Weather shifts over time. Shelter can protect you."

- `<ForceWeather:rain>` / `<ForceWeather:snow>` tags on specific maps.
- **Action**: Experience at least one weather transition (rain, storm, or snow).

---

## Phase 4 — Deeper Systems (optional, unlocked post-Phase 3)

These systems have no strict ordering. They are surfaced to the player through NPC dialogue, environmental cues, and the todo list once earlier phases are done.

### 4A — Body Modification: Prosthetics (Switch 88 = ON)
- Prosthetic shop opens after unlocking Switch 88.
- Replace damaged or missing limbs with mechanical prosthetics.
- Different archetypes support different prosthetic types.

### 4B — Biologics Menu
- Health_Core → "Biologics" in menu.
- Manage organ states, reproduction type, and archetype-specific conditions.
- ChangeArchetype plugin command can alter body plan mid-game.

### 4C — Class-Specific Skills (SkillMaster.js)
- Each class has a mastery track. Using skills in combat advances mastery.
- Mastery unlocks enhanced versions of base skills.

### 4D — Crime & Bounty (CrimeSystem.js)
- Committing crimes increments Variable 66 (bounty, displayed in euros).
- High bounty triggers NPC hostility and affects shop prices.
- Bounty can be paid off at specific locations.

### 4E — Minigames
Scattered across locations. No tutorial gating — discovered by interacting with objects.
- Slot machine, Frogger, Snake, Bubble Pop (gambling/arcade districts)
- Bowling, Pool, Chess (recreation venues)
- Horse Racing with betting (track locations)
- Lockpick Tetris (doors requiring lockpicking skill)
- Scratch cards (shops)

### 4F — Vehicles: Camper & Car
- Camper (Switch 51): mobile base, 100L tank, persists map position (Variables 63–65, 67).
- Car (Switch 64): faster, 60L tank (Variables 69–72).
- Both support fast travel with fuel cost.

### 4G — Dungeon Delving
- Enter a dungeon biome to access BSP-generated floors.
- Use goDown plugin command to descend underground (sets `$gameSystem._procGenData.underground = true`).
- FloorListWindow (Variable 17, Switch 29) shows available floors in multi-level dungeons.
- DungeonFloorSystem tracks progress per floor.

### 4H — Galaxy Exploration (GalaxySim.js)
- Accessed from specific map or vehicle.
- Variables 94–97: ship speed, fuel, current star, target star.
- Separate fuel economy from ground travel.

---

## Tutorial Control Reference

| System | Switch / Variable | Notes |
|---|---|---|
| Tutorial on/off | Switch 75 | Toggleable in Options menu |
| Character creation done | Switch 33 | Set ON at game start (tutorial skips ClassSelector) |
| Battle victory | Switch 34 | Set after first combat win |
| Prosthetic shop | Switch 88 | Opens prosthetics branch |
| Camper available | Switch 51 | Unlocks camper travel |
| Car available | Switch 64 | Unlocks car travel |
| Fast travel active | Switch 55 | Set during travel animation |
| Multiplayer | Switch 66 | Separate onboarding flow |
| Player gender | Variable 38 | Set in Phase 1 |
| Player class | Variable 42 | Set in Phase 1 |
| Bounty (euros) | Variable 66 | Displayed in HUD |
| Temperature | Variable 61 | Shown in status/menu |
| Hunger | Variable 88 | Managed by TimeDateSystem |
| Sleep | (internal) | Managed by TimeDateSystem |
| Current biome seed | `$gameSystem._procGenData.currentSeed` | For procedural maps |

---

## Design Notes

- **Semilinearity**: Phase 1 is a fixed preset (no player input required). Phase 2 is strictly linear to ensure survival basics are understood before the open world opens. Phase 3 branches are parallel. Phase 4 is fully freeform.
- **Tutorial toggle**: Players who find the hint system intrusive can turn it off via Options → Tutorial: OFF (Switch 75 = OFF). The H-key task list remains accessible regardless.
- **Language support**: All tutorial text should provide both `en` and `it` strings to match the Hendrix_Localization system used elsewhere in the plugin stack.
- **Input-aware hints**: MapTodoList's ControlTagParser supports `<keyboard: ...><controller: ...>` tags — use these for any tutorial text referencing controls.
- **Permadeath variant**: If Switch 9 is ON, add a visible reminder in Phase 2's Task 3 (Health Status) that body part destruction is permanent.
- **Preset character implementation**: At game start, set Variable 42 = 66, Switch 33 = ON, Variable 87 = -1, Variable 38 = 0, then call `ChangeArchetype` to apply the Cyborg body plan before the opening scene plays. Skip the ClassSelector scene entirely.

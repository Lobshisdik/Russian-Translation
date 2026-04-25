# Procedural Map System - Quick Reference

## Files Updated
1. **CLAUDE.md** - Added comprehensive procedural map plugin documentation
2. **PROCEDURAL_SYSTEM_IMPROVEMENTS.md** - Created detailed consolidation and improvement roadmap

---

## What's Documented in CLAUDE.md

### New Procedural Map Section Includes:

#### Core Architecture
- Pipeline: ProceduralMapUtils → RoadGenerator → StructureGenerator → BiomeGenerator
- Map IDs: 315 (world), 636 (procedural), 1410 (debug)
- Deterministic generation using seeded RNG
- All generation is coordinate-based and reproducible

#### Getting Current Biome & Coordinates
Essential code for plugins needing world data:
```javascript
// Get world coordinates
const worldX = $gameVariables.value(43);
const worldY = $gameVariables.value(44);

// Get current biome
const biomeName = window.ProcGenUtils.getBiomeForWorldTile(
  $gameMap.tileId(worldX, worldY, 0)
);

// Access procedural data
const procData = $gameSystem._procGenData;
```

#### Plugin Breakdown

**ProceduralMapUtils.js** (Foundation)
- Perlin noise, smoothing, FBM
- Biome lookups from world tiles
- Terrain feature parsing (single & multi-tile)
- Coordinate conversions

**ProceduralMapRoadGenerator.js** (Roads)
- Linear roads (horizontal/vertical)
- Intersections (cross, T-junctions, corners)
- Dashed center lines
- 7-tile wide roads with Perlin noise sway

**ProceduralMapStructureGenerator.js** (Structures)
- **Dungeons**: BSP algorithm, 8-16 tile rooms, themed decorations
- **Villages**: Organic roads, building lots 1-3 tiles from roads, branch paths
- **Cities**: Grid-based with dashed lanes, centered building lots

**ProceduralMapBiomeGenerator.js** (Orchestrator)
- Routes to specialized generators (roads, dungeons, structures)
- Cave generation (3 methods: drunken walk, cellular automata, Voronoi)
- Mountain terrain with ceiling/wall tiles
- Biome border blending
- Hardcoded biome overrides at specific coordinates

**ProceduralMapDebugger.js** (Tools)
- F9 overlay showing tile IDs and biome names
- Road direction symbols (↑↓←→✚⊤⊥⌐┐┌┘)
- Resolution-aware font sizing

**ProceduralMapPrefabs.js** (Objects/NPCs)
- Places buildings, treasures, monsters
- Seeded placement based on world coordinates
- Integration with village placement hints

---

## What's in PROCEDURAL_SYSTEM_IMPROVEMENTS.md

### Analysis Section
**Current Strengths**
- Modular, well-designed architecture
- Deterministic and reproducible
- Multiple biome types with specialized generation
- Clean integration system

**Current Limitations**
- Only 2 layers (surface/underground)
- Minimal faction/population systems
- Static villages/cities without evolution
- Limited dungeon theming
- No ecosystem simulation
- No historical simulation

### Three-Phase Improvement Roadmap

#### Phase 1: Foundation (Immediate - 1-2 weeks)
Focus on enriching existing systems without major refactoring
1. Enhanced biome definitions with environment properties
2. Subbiome variants (Forest → Dense Forest, Old Growth, Swamp, Burned)
3. Population system for buildings (roles, counts, schedules)
4. Procedural history events (create timelines of world events)

**Result**: More visual variety, richer NPC interactions, world feels lived-in

#### Phase 2: Settlement Depth (2-3 weeks)
Make settlements unique and varied
1. Multi-stage settlement evolution (outpost → village → town → city)
2. Faction system with territory control
3. Dungeon themes affecting room types (prison, lair, library, shrine)
4. Dynamic monster populations with herd/pack behavior

**Result**: Exploration feels varied, settlements have personality, dungeons tell stories

#### Phase 3: Systems Integration (3-4 weeks)
Connect all systems together
1. Faction relationships affect quest givers
2. World history contexts current encounters
3. Monster populations affect spawn rates
4. Simple politics (alliances, conflicts)

**Result**: World feels reactive, quests have context, emergent storytelling

### Detailed Feature Examples

**1.1 Enhanced Biome Definitions**
- Temperature/humidity ranges
- Flora and fauna lists
- Encounter tables with rarity weights
- Faction structures
- Resource availability

**1.2 Subbiome Variants**
- Use Perlin noise to select variant
- Different encounters per variant
- Visual progression (old growth vs young forest)
- Transitional zones feel natural

**1.3 Population System**
- Buildings define inhabitants (count ranges, roles, classes)
- Time-based behavior schedules
- Faction affiliations for NPCs
- Different appearance based on occupation

**1.4 Historical Events**
- Generate timelines for each biome
- Events affect current state (ruins from disasters, graveyards from plagues)
- Use for encounter weighting and visual cues
- Simple simulation with birth/death rates

**2.1 Settlement Evolution**
```
Outpost (0-20 years) → Village (20-100) → Town (100-300) → City (300+)
Tight clusters      → Road layouts     → Districts       → Complex zones
```

**2.2 Faction System**
- Track controlled territories
- Define relationships (alliances, enemies)
- NPCs affiliate with factions
- Affects available buildings/quests

**2.3 Dungeon Themes**
- Prison: cells, guards, torture rooms
- Lair: nest, feeding grounds, alpha
- Library: shelves, archive, scholar
- Affects encounters and treasure

**2.4 Monster Ecosystems**
- Herds/packs with population dynamics
- Territory definitions
- Predator-prey relationships
- Population fluctuation affects encounter chances

### Real-World Example
A fully-realized biome with all systems:
- Old Growth Forest (subbiome variant)
- 400-year-old town (settlement evolution)
- Woodsmen Cooperative controls it (faction)
- History of plague 60 years ago (visible as graveyards)
- Declining wolf population affecting ecosystem
- Merchant-local friction creating quests
- Ancient treant guarding sacred grove

---

## How to Use These Documents

### For Understanding Current System
1. Read CLAUDE.md "Procedural Map Generation System" section
2. Use the "Getting Current Biome & Coordinates" code snippet to interact
3. Reference plugin breakdowns when debugging or adding features
4. Check the constants and variable storage sections

### For Planning Improvements
1. Read the "Current State Analysis" in IMPROVEMENTS.md
2. Review the "Vision" section to understand long-term goals
3. Choose which Phase 1 features to implement first
4. Use the "Phase" breakdowns to estimate scope
5. Reference the "Example" at the end to see integrated system

### For Implementation
1. Start with Phase 1 (foundation improvements)
2. Pick ONE biome (e.g., Forest) for initial implementation
3. Follow the detailed code examples in each section
4. Test integration with existing systems
5. Document results as you go

---

## Key Takeaways

1. **Current system is solid** - Well-architected and extensible
2. **Path to DF-like depth is clear** - Three phases of structured improvements
3. **Start small** - Phase 1 gives big visual/gameplay benefits with moderate effort
4. **Data-driven** - Most improvements add to biome definitions, not core code
5. **Emergent storytelling** - Systems interact to create narrative naturally

The procedural system is ready for significant expansion. The improvements roadmap shows how to add depth in manageable phases while maintaining the elegant, modular design that already exists.

# Procedural Map System: Consolidation & Improvement Guide

## Current State Analysis

### Strengths
1. **Modular Architecture**: Well-separated concerns (Utils → Roads → Structures → BiomeGenerator)
2. **Deterministic Generation**: Seeded RNG ensures consistency across playthroughs
3. **Feature-Rich**: Supports terrain features, multi-tile objects, biome blending, water handling
4. **Multiple Biome Types**: Roads, dungeons, villages, cities, caves, mountains
5. **Extensible Design**: Clean exports and integration points (window.ProcGen* globals)
6. **Debug Support**: Visualization tools for development

### Current Limitations
1. **Shallow Procedural Depth**: Generation happens only at surface/underground (2 layers)
2. **Limited NPC/Monster Integration**: Prefab system exists but minimal faction/population mechanics
3. **Biome Interactions**: Minimal ecosystem/seasonal variation
4. **Limited Dungeon Features**: BSP generates rooms but lacks theme-specific structures (prison, library, treasury, shrine)
5. **Static Village/City**: No merchant variation, no population density simulation
6. **Weak Procedural Events**: No weather patterns, migration, disasters tied to world generation
7. **Single Generation Pass**: No multi-stage evolution of settlements

---

## Vision: Dwarf Fortress Adventure Mode Complexity

### Layer 1: Foundational Improvements (Immediate)
These strengthen existing systems without major refactoring.

#### 1.1 Enhanced Biome Definition System
**Current**: Biomes defined with name, tileset, features
**Enhancement**: Add rich metadata to biome objects

```javascript
// Extend biome definition:
{
  name: "Forest",
  tilesetId: 42,
  features: [...],

  // NEW: Environment properties
  environmentProperties: {
    temperature: [-10, 25],        // Seasonal range
    humidity: [30, 100],           // Dry to swampy
    flora: ["oak", "pine", "birch"],
    fauna: ["deer", "boar", "wolf"],
    dangerous: ["wolf", "bear"],
  },

  // NEW: Encounter tables
  encounterTable: {
    common: ["Deer", "Boar"],      // 60%
    uncommon: ["Wolf", "Bear"],    // 30%
    rare: ["Sprite", "Dryad"],     // 10%
  },

  // NEW: Structure rules
  structures: {
    villages: { density: "rare", type: "woodsmen" },
    ruins: { density: "uncommon", age: "ancient" },
    dungeons: { density: "rare", inhabitant: "monsters" },
  },

  // NEW: Resource availability
  resources: {
    materials: ["wood", "stone", "clay"],
    food: ["berries", "game", "fish"],
    minerals: [],
  }
}
```

#### 1.2 Subbiome System
**Current**: Biomes are monolithic
**Enhancement**: Each biome can spawn variants based on local conditions

```javascript
// Extend BiomeGenerator
function generateSubbiomeVariant(baseBiome, worldCoords, noise) {
  // Forest can become: Dense Forest, Old Growth, Swamp Forest, Burned Forest
  // Mountain can become: Peak, Foothills, Volcanic, Glacier

  const noiseValue = noise2D(worldCoords.x, worldCoords.y, baseBiome.seed);

  if (baseBiome.name === "Forest") {
    if (noiseValue > 0.7) return "Old Growth Forest";
    if (noiseValue < 0.3) return "Swamp Forest";
    if (checkAdjacentVolcano(worldCoords)) return "Burned Forest";
  }

  return baseBiome.name;
}
```

**Benefits**:
- More visual variety
- Different encounter tables per variant
- Transitional zones feel natural
- Reduced perceived repetition

#### 1.3 Population & Factions System
**Current**: Prefabs place buildings/NPCs statically
**Enhancement**: Buildings contain population with roles/factions

```javascript
// Structure template enhancement:
{
  name: "Village Tavern",
  layout: [...],

  // NEW: Population definition
  population: {
    keeper: { race: "Human", class: "Merchant", count: 1 },
    patrons: {
      races: ["Human", "Dwarf", "Elf"],
      classes: ["Fighter", "Rogue", "Mage"],
      count: [3, 8],  // 3-8 random
    }
  },

  // NEW: Faction alignment
  factions: ["Merchants Guild", "Tavern Keepers"],

  // NEW: Time-based behavior
  schedule: {
    morning: { tavern_activity: 0.2 },
    noon: { tavern_activity: 0.6 },
    evening: { tavern_activity: 0.9 },
    night: { tavern_activity: 0.3 },
  }
}
```

#### 1.4 Procedural History Events
**Current**: No world history simulation
**Enhancement**: Generate world events that affect current state

```javascript
// New function in BiomeGenerator:
function generateBiomeHistory(biome, worldCoords, age = 1000) {
  const timeline = [];
  const rng = createSeededRandom(worldCoords.x * 73856093 ^ worldCoords.y * 19349663);

  // Simulate events over time (in-world years)
  for (let year = 0; year < age; year += 50 + Math.floor(rng() * 100)) {
    const eventType = randomChoice(
      ["settlement_founded", "monster_invasion", "famine", "plague", "discovery"],
      rng
    );

    timeline.push({
      year: $gameMap._procGenData?.worldAge - age + year,
      event: eventType,
      severity: rng(),
      location: { x: worldCoords.x, y: worldCoords.y }
    });
  }

  return timeline;
  // Result: Ruined village has "Plague Year 847" event
  // Result: Forest has "Settlement Founded Year 923" event
}

// Use history to affect current generation:
if (hasRecentEvent(biome.history, "destruction", 50)) {
  // Generate ruins instead of active settlement
  // Spawn undead/monsters instead of villagers
  // Create overgrown structures
}
```

---

### Layer 2: Structural Complexity (Medium-term)

#### 2.1 Multi-Stage Settlement Generation
**Current**: Villages/cities generated in single pass
**Enhancement**: Staged evolution from outpost → village → town → city

```javascript
function generateSettlementEvolution(biome, worldCoords, worldAge) {
  const foundedYear = calculateSettlementFoundation(worldCoords);
  const yearsExisted = worldAge - foundedYear;

  // Stage 1: Outpost (0-20 years) - 1-2 buildings
  // Stage 2: Village (20-100 years) - 5-15 buildings, fences
  // Stage 3: Town (100-300 years) - 20-50 buildings, walls, guard houses
  // Stage 4: City (300+ years) - 50+ buildings, complex districts, fortifications

  if (yearsExisted < 20) return generateOutpost(biome);
  if (yearsExisted < 100) return generateVillage(biome);
  if (yearsExisted < 300) return generateTown(biome);
  return generateCity(biome);
}

// Outpost example - fewer, tighter buildings
function generateOutpost(biome) {
  const buildingCount = 2 + Math.floor(rng() * 2);
  // Place buildings in cluster
  // Add watchtower or stockade
  // Minimal organization
}

// Town example - organized districts
function generateTown(biome) {
  const districts = {
    merchant: { buildings: 15, focus: "shops" },
    residential: { buildings: 20, focus: "houses" },
    industrial: { buildings: 10, focus: "workshops" },
    civic: { buildings: 5, focus: "temples/halls" }
  };
  // Generate each district with appropriate spacing
}
```

#### 2.2 Faction & Territory System
**Current**: NPCs exist independently
**Enhancement**: Factions control territories, compete for influence

```javascript
// New system: Faction territories on world map
$gameSystem._procGenData.factionTerritories = {
  "Merchant Guild": {
    controlled_cities: ["Goldenhearth", "Riverside"],
    controlled_roads: [[100,50], [110,55]],
    relationships: {
      "Thieves Guild": -50,  // Enemies
      "Craftsmen": 30        // Neutral/friendly
    }
  },
  "Thieves Guild": {
    hideouts: [[85,70], [120,80]],
    target_routes: [[100,50], [110,55]],
    relationships: { "Merchant Guild": -50 }
  }
}

// In settlement generation:
function assignSettlementFaction(settlement, worldCoords) {
  const nearbyFactions = getNearbyFactions(worldCoords);
  const dominantFaction = nearbyFactions[0];

  settlement.controlledBy = dominantFaction.name;
  settlement.relationship = dominantFaction.relationship;

  // Affects what buildings/NPCs appear
  if (dominantFaction.name === "Thieves Guild") {
    // Add black market, thieves guild hall
    // Fewer guards, more suspicious NPCs
  }
}
```

#### 2.3 Dungeon Theme System
**Current**: BSP generates generic rooms
**Enhancement**: Dungeons have themes affecting room types and contents

```javascript
// Extend dungeon generation:
const dungeonThemes = {
  prison: {
    rooms: {
      cell: { count: 15, width: [4,6], height: [4,6] },
      guardRoom: { count: 3 },
      tortureRoom: { count: 1 },
      warden: { count: 1 }
    },
    encounters: ["Guard", "Torturer", "Prisoner"],
    treasure: ["Keys", "Weapons"]
  },
  lair: {
    rooms: {
      lair: { count: 1, width: [12,20], height: [12,20] },
      nest: { count: [2,4] },
      feeding: { count: 1 }
    },
    encounters: ["Alpha", "Minions"],
    treasure: ["Bones", "Hoard"]
  },
  library: {
    rooms: {
      shelves: { count: 8 },
      reading: { count: 2 },
      archive: { count: 1 },
      scholar: { count: 1 }
    },
    encounters: ["Librarian", "Golem"],
    treasure: ["Spellbooks", "Manuscripts"]
  }
};

function generateThemedDungeon(biome, theme, seed) {
  const layout = generateBSPLayout(seed);
  const themed = assignThemeToRooms(layout, dungeonThemes[theme]);

  // Populate with theme-specific furniture, encounters, treasure
  populateDungeonRooms(themed);

  return themed;
}
```

#### 2.4 Dynamic Monster Populations
**Current**: Monsters spawned based on encounter tables
**Enhancement**: Monster populations have herd/pack behavior

```javascript
// New layer: Monster ecosystem
function simulateMonsterPopulation(biome, years) {
  const herds = [];

  for (const species of biome.fauna) {
    const herd = {
      species,
      population: 50 + Math.floor(rng() * 100),
      territory: generateHerdTerritory(biome),
      predators: findPredators(species),
    };

    // Simulate population changes
    for (let y = 0; y < years; y++) {
      // Birth rate
      herd.population += Math.floor(herd.population * 0.1);

      // Predation
      for (const predator of herd.predators) {
        const predatorCount = estimatePredatorCount(biome, predator);
        herd.population -= predatorCount * 0.15;
      }

      // Starvation
      herd.population -= Math.floor(herd.population * 0.05);

      // Clamp
      herd.population = Math.max(0, Math.min(500, herd.population));
    }

    herds.push(herd);
  }

  biome.herds = herds;
}

// Use this for encounter probability:
function getEncounterChance(biome, monsterSpecies) {
  const herd = biome.herds.find(h => h.species === monsterSpecies);
  if (!herd) return 0;

  // More monsters → higher encounter chance
  return Math.min(0.9, (herd.population / 500) * 0.3);
}
```

---

### Layer 3: Advanced Features (Long-term)

#### 3.1 Procedural Politics & Diplomacy
- Track relationships between factions
- Generate conflicts (territorial disputes, resource competition)
- Simulate alliances and wars
- Create dynamic quest chains based on political state

#### 3.2 Environmental Simulation
- Seasonal changes to biome visuals/resources
- Weather patterns (rain → floods, drought → wildfires)
- Migration routes for animals and traders
- Magical phenomena affecting terrain

#### 3.3 Economic Systems
- Resource availability fluctuates based on extraction rate
- Trade routes form between settlements
- Prices vary by location and rarity
- Shortages create opportunities/conflicts

#### 3.4 Deep Time Simulation
- Generate multiple ages of history
- Ancient civilizations rise and fall
- Create layered ruins with different architectural styles
- Discover archaeological sites with contextual loot

---

## Implementation Priority

### Phase 1: Foundation (1-2 weeks)
1. Enhanced biome definitions with environment properties
2. Subbiome variants from noise
3. Basic population system for buildings
4. Procedural history events (simple timeline)

**Impact**: More visual variety, richer NPC interactions, world feels "lived-in"

### Phase 2: Settlement Depth (2-3 weeks)
1. Multi-stage settlement generation
2. Faction system (basic territory control)
3. Dungeon themes (affects room types/encounters)
4. Dynamic monster populations

**Impact**: Exploration feels more varied, settlements feel unique, dungeons have personality

### Phase 3: Systems Integration (3-4 weeks)
1. Connect faction relationships to quest givers
2. Tie world history to current encounter tables
3. Integrate monster populations with spawn rates
4. Add simple politics (alliances, conflicts)

**Impact**: World feels reactive, quests have context, emergent storytelling

### Phase 4: Polish & Optimization (Ongoing)
1. Balance encounter difficulties
2. Optimize generation performance
3. Add visual cues for faction/history
4. Create debug tools for designer iteration

---

## Technical Checklist

### Architecture Changes Needed
- [ ] Extend biome object structure (add environmentProperties, history, factions)
- [ ] Create BiomeSubvariant system
- [ ] Create Settlement/Structure population system
- [ ] Create Faction controller
- [ ] Create HistoricalEvent system
- [ ] Create MonsterPopulation simulator

### Integration Points
- [ ] Link prefab system to population definitions
- [ ] Link encounter tables to monster populations
- [ ] Link NPC generation to faction affiliation
- [ ] Link dungeon generation to theme selection
- [ ] Link settlement generation to faction control

### Performance Considerations
- Cache generated populations per biome
- Use deterministic seeding for consistency
- Lazy-load faction relationships
- Limit history simulation to recent events (last 500 years)

### Data Storage
- Extend $gameSystem._procGenData to include:
  - `factionTerritories`: Faction control map
  - `worldHistory`: Timeline of major events
  - `monsterPopulations`: Per-biome herd/pack data
  - `settlementEvolution`: Settlement age/stage tracker

---

## Example: Putting It All Together

### Scenario: Exploring a Dwarf Fortress-like World

**Player enters Forest biome at (100, 50):**

```
1. Generation starts with base biome "Forest"

2. Subbiome selection:
   - Noise check → "Old Growth Forest" (dense, ancient)
   - Encounters weighted toward long-lived creatures
   - Encounters include forest spirits, ancient beasts

3. Settlement generation:
   - History check: Forest settled 400 years ago
   - Evolution stage: Town (20 buildings, organized)
   - Controlling faction: Woodsmen Cooperative
   - Building types reflect faction (logging camps, ranger stations, nature temples)

4. NPC population:
   - Mayor: Old Wood Elf ranger (reputation for fair dealing)
   - Merchant: Human trader (represents Merchant Guild, tension with woodsmen)
   - Blacksmith: Dwarf (refugee from mountain civil war)
   - NPCs react to faction relationships

5. Monster ecosystem:
   - Wolf packs: Population declining (overhunting)
   - Bears: Population stable (in deep forest)
   - Ancient treants: Rare, territorial
   - Encounter chances reflect actual populations

6. Quests emerge naturally:
   - Merchant wants protection on dangerous road (faction conflict)
   - Mayor concerned about wolf decline affecting ecosystem
   - Dwarf blacksmith seeks ore sources (creates dungeon exploration quest)
   - Ancient treant defends forest from loggers

7. Procedural history affects present:
   - 60 years ago: Plague killed many settlers (graveyards visible)
   - 200 years ago: War with neighboring faction (old fortifications)
   - 400 years ago: Settlement founded (oldest buildings date-stamped)
```

This creates a **living, breathing world** where exploration reveals stories, NPCs have motives grounded in faction politics, and the environment tells history through its structure.

---

## Benefits of This Approach

1. **DF-like Depth**: Multiple systems interact to create emergent narratives
2. **Replayability**: Different seeds create genuinely different worlds
3. **Discovery**: Players uncover history and politics through exploration
4. **Designer Control**: Biome definitions + faction rules = predictable but varied results
5. **Scalability**: Add new factions, themes, and events without core changes
6. **Performance**: Deterministic seeding means we don't need to store everything

---

## Next Steps

1. **Start with Phase 1** - Pick one biome (Forest) and implement full system end-to-end
2. **Create BiomeDefinition schema** - Document what fields biomes need
3. **Implement SubbiomeGenerator** - Add noise-based variant selection
4. **Add PopulationSystem** - Extend prefab system with NPC counts/roles
5. **Build EventTimeline** - Create historical event generator
6. **Test integration** - Ensure all systems work together smoothly

This roadmap transforms the procedural system from **terrain generator** into **world simulator**, moving closer to the Dwarf Fortress adventure mode experience you're targeting.

/*:
 * @target MZ
 * @plugindesc Biome-specific procedural map generation: roads, mountains, features
 * @author Omni-Lex
 *
 * @help
 * Procedural Map Biome Generator
 * ==============================
 * Handles biome-specific terrain generation including:
 * - Road generation (linear, cross, T-intersections)
 * - Biome feature distribution (single-tile and multi-tile)
 * - Map loading and procedural map handling
 * - Multi-tile terrain feature placement
 *
 * MULTI-TILE FEATURE SUPPORT
 * ==========================
 * Features can now be defined as grids of tiles. When placing multi-tile features:
 * - The feature is placed with its top-left corner at the selected position
 * - All tiles of the grid must fit within map bounds
 * - None of the grid tiles can overlap water
 * - Variants can be mixed: single-tile and multi-tile variants of the same feature
 *
 * Examples:
 *   <House: [B1, B2],[B3, B4]>      2x2 building
 *   <Bush: [C5]>                    Single tile (compatible with 1x1 grid)
 *   <Bridge: [D1, D2, D3]>          1x3 horizontal bridge
 *
 * Requires ProceduralMapUtils.js to be loaded first
 *
 * BIOME SYSTEM
 * ============
 * - Each biome has a name and associated tileset ID
 * - Tiles on map 315 are associated with biomes via tileset 96 notes
 * - If a tile has no biome association, defaults to "Fields" biome
 * - Procedural maps use the biome's tileset for terrain generation
 *
 * @command startProcGen
 * @text Start Procedural Generation
 * @desc Initiate procedural map 636 generation from current map 315 location
 *
 * @command stopProcGen
 * @text Stop Procedural Generation
 * @desc Return player from map 636 to origin point on map 315
 *
 * @command goDown
 * @text Go Down (Underground Layer)
 * @desc Descend into the underground layer of the current biome
 *
 * @command goUp
 * @text Go Up (Return to Surface)
 * @desc Ascend back to the previous surface biome
 */

(() => {
  "use strict";

  const pluginName = "ProceduralMapBiomeGenerator";

  // Import utilities from ProceduralMapUtils
  const Utils2 = window.ProcGenUtils;
  if (!Utils2) {
    console.error(
      "ProceduralMapBiomeGenerator requires ProceduralMapUtils plugin"
    );
    return;
  }

  const {
    Cache,
    getTileIdToProgressiveId,
    getProgressiveIdToTileId,
    getTileIdFromTypeAndIndex,
    getBiomeForWorldTile,
    getRoadDirectionFromWorldTile,
    getBiomeByName,
    parseTerrainFeatures,
    parseSingleTileString,
    createSeededRandom,
    randomChoice,
    normalizeBiomeForEdge,
    getNonProceduralDestination,
    noise2D,
    smoothNoise,
    fbmNoise,
    calculateIndex,
    getAdjacentBiomesOnWorldMap,
    getAdjacentBiomesFromCache,
    checkAdjacentMapBiomesFromCache,
    checkDiagonalMapBiomesFromCache,
    isWaterTileId,
    getRandomFeatureVariant,
    placeMultiTileFeature,
    generateFeatureNoise,
    generateFeatureScattered,
    generateCaveWithDrunkenWalk,
    generateCaveWithCellularAutomata,
    generateCaveWithVoronoi,
    generateMountainBiomeTerrain,
    getTerrainFeatures,
    getFeaturesByLayer,
    createTileToFeatureMap,
    getFeatureNameFromTileId,
    calculateDirectionalInfluence,
    getWeightedTerrainFeature,
    isInForbiddenZone,
    doesMultiTileFeatureOverlapForbidden,
    clearForbiddenZoneFeatures,
    generateAsciiVisualization,
    getArrowForDirection,
    isTileOccupiedOnLayer,
    log,
    logWarn,
    WORLD_MAP_ID,
    WORLD_TILESET_ID,
    PROC_MAP_ID,
    PROC_MAP_WIDTH,
    PROC_MAP_HEIGHT,
    BORDER_DETECTION_RANGE,
  } = Utils2;

  // Import beach/water generation functions from ProceduralBeachGenerator
  const BeachGen = window.ProcGenBeach;
  if (!BeachGen) {
    console.error(
      "ProceduralMapBiomeGenerator requires ProceduralBeachGenerator plugin"
    );
    return;
  }

  const {
    isWaterBiome,
    drawWaterEdges,
    drawWaterCorners,
  } = BeachGen;

  // Import road generation functions from ProceduralMapRoadGenerator
  const RoadGen = window.ProcGenRoads;
  if (!RoadGen) {
    console.error(
      "ProceduralMapBiomeGenerator requires ProceduralMapRoadGenerator plugin"
    );
    return;
  }

  const {
    isRoadBiome,
    parseRoadConfig,
    getDashedLineTileId,
    isPositionOnRoadTile,
    generateRoadBiome: generateRoadBiomeUtil,
    determineRoadIntersectionType,
  } = RoadGen;

  // Import river generation functions from ProceduralMapRiverGenerator
  const RiverGen = window.ProcGenRivers;
  if (!RiverGen) {
    console.error(
      "ProceduralMapBiomeGenerator requires ProceduralMapRiverGenerator plugin"
    );
    return;
  }

  const {
    isRiverBiome,
    parseRiverConfig,
    getRiverDecorationTileId,
    isPositionOnRiverTile,
    generateRiverBiome: generateRiverBiomeUtil,
    determineRiverIntersectionType,
  } = RiverGen;

  // Import dungeon generation functions from ProceduralMapStructureGenerator
  const DungeonGen = window.ProcGenDungeon;
  if (!DungeonGen) {
    console.error(
      "ProceduralMapBiomeGenerator requires ProceduralMapStructureGenerator plugin"
    );
    return;
  }

  const {
    isDungeonBiome,
    generateDungeonBiome: generateDungeonBiomeUtil,
    isVillageBiome,
    generateVillageBiome: generateVillageBiomeUtil,
    isCityBiome,
    generateCityBiome: generateCityBiomeUtil,
    isBurgBiome,
    generateBurgBiome: generateBurgBiomeUtil,

  } = DungeonGen;

  const { BIOMES, FEATURES, HARDCODED_BIOME_OVERRIDES } =
    window.WorldGen;

  /**
   * Hardcoded biome spawn overrides for specific world coordinates
   * Forces a specific biome and optional road direction at given coordinates
   * The overridden biome is generated and cached just like normal procedural generation
   *
   * FORMAT:
   *   "worldX,worldY": { biome: "BiomeName", roadDirection: "..." (optional) }
   *
   * BIOME NAMES:
   *   - Any biome defined in WorldGen.BIOMES (e.g., "Forest", "Mountain", "Ocean")
   *   - "Road" for road biomes (when using roadDirection)
   *
   * ROAD DIRECTIONS (optional - only for Road biome):
   *   LINEAR:
   *   - "horizontal"  : Horizontal road (left-right)
   *   - "vertical"    : Vertical road (up-down)
   *
   *   INTERSECTIONS:
   *   - "cross"       : 4-way intersection (crossroad)
   *   - "t-up"/"t-north"     : T-junction with stem pointing north (missing south)
   *   - "t-down"/"t-south"   : T-junction with stem pointing south (missing north)
   *   - "t-left"/"t-west"    : T-junction with stem pointing west (missing east)
   *   - "t-right"/"t-east"   : T-junction with stem pointing east (missing west)
   *
   *   CORNERS (L-shaped, connects two perpendicular directions):
   *   - "corner-up-right"     : Connects north and east (⌐ shape)
   *   - "corner-up-left"      : Connects north and west (┐ shape)
   *   - "corner-down-right"   : Connects south and east (┌ shape)
   *   - "corner-down-left"    : Connects south and west (┘ shape)
   *   - "corner-north-east"   : Alias for corner-up-right
   *   - "corner-north-west"   : Alias for corner-up-left
   *   - "corner-south-east"   : Alias for corner-down-right
   *   - "corner-south-west"   : Alias for corner-down-left
   *
   * EXAMPLES:
   *   "100,50": { biome: "Road", roadDirection: "cross" }         // Crossroad
   *   "110,50": { biome: "Road", roadDirection: "horizontal" }    // Horizontal road
   *   "120,50": { biome: "Road", roadDirection: "t-up" }          // T-junction (stem north)
   *   "130,50": { biome: "Road", roadDirection: "vertical" }      // Vertical road
   *   "140,50": { biome: "Road", roadDirection: "corner-up-right" } // Corner (north-east)
   *   "150,60": { biome: "Forest" }                               // Regular biome, no road
   */

  // Create feature lookup tables once at startup
  const FEATURE_LAYERS = {};
  const FEATURE_ASCII = {};
  const FEATURE_LAYER_MAP = {};

  for (const feature of FEATURES) {
    FEATURE_LAYERS[feature.name] = feature.layer;
    FEATURE_ASCII[feature.name] = feature.ascii;
    if (!FEATURE_LAYER_MAP[feature.layer]) {
      FEATURE_LAYER_MAP[feature.layer] = [];
    }
    FEATURE_LAYER_MAP[feature.layer].push(feature.name);
  }

  // ===== HARDCODED OVERRIDES =====

  /**
   * Check if coordinates have a hardcoded biome override
   * Returns { biome, roadDirection } or null if no override exists
   */
  function getHardcodedBiomeOverride(worldX, worldY) {
    const key = `${worldX},${worldY}`;
    if (HARDCODED_BIOME_OVERRIDES[key]) {
      return HARDCODED_BIOME_OVERRIDES[key];
    }
    return null;
  }

  // ===== BIOME DETECTION =====



  /**
   * Check if biome is a cave biome
   */
  function isCaveBiome(biomeName) {
    return biomeName.toLowerCase().includes("cave");
  }

  /**
   * Determine which cave borders are open for global underground connections
   * Uses world coordinates to ensure adjacent caves connect properly
   * Returns object with open borders: { north, south, east, west }
   */
  function getOpenCaveBorders(worldCoords) {
    // Create deterministic seed from world coordinates and direction
    const baseSeed = worldCoords.x * 73856093 ^ worldCoords.y * 19349663;

    // Determine if each border is open (1-2 borders per cave)
    const northSeed = createSeededRandom(baseSeed ^ 1);
    const southSeed = createSeededRandom(baseSeed ^ 2);
    const eastSeed = createSeededRandom(baseSeed ^ 3);
    const westSeed = createSeededRandom(baseSeed ^ 4);

    return {};
  }

  /**
   * Check if biome is a mountain surface biome
   */
  function isMountainBiome(biomeName) {
    return biomeName.toLowerCase().includes("mountain");
  }

  /**
   * Check if Fields biome should display as Beach based on water edges/corners
   */
  function shouldDisplayAsBeach(biomeName, adjacentBiomes, diagonalBiomes) {
    if (biomeName !== "Fields") {
      return false;
    }

    // Check if any adjacent biome is water
    if (adjacentBiomes) {
      if (
        (adjacentBiomes.north && isWaterBiome(adjacentBiomes.north)) ||
        (adjacentBiomes.south && isWaterBiome(adjacentBiomes.south)) ||
        (adjacentBiomes.east && isWaterBiome(adjacentBiomes.east)) ||
        (adjacentBiomes.west && isWaterBiome(adjacentBiomes.west))
      ) {
        return true;
      }
    }

    // Check if any diagonal biome is water
    if (diagonalBiomes) {
      if (
        (diagonalBiomes.topLeft && diagonalBiomes.topLeft.length > 0 &&
          diagonalBiomes.topLeft.some((b) => isWaterBiome(b))) ||
        (diagonalBiomes.topRight && diagonalBiomes.topRight.length > 0 &&
          diagonalBiomes.topRight.some((b) => isWaterBiome(b))) ||
        (diagonalBiomes.bottomLeft && diagonalBiomes.bottomLeft.length > 0 &&
          diagonalBiomes.bottomLeft.some((b) => isWaterBiome(b))) ||
        (diagonalBiomes.bottomRight && diagonalBiomes.bottomRight.length > 0 &&
          diagonalBiomes.bottomRight.some((b) => isWaterBiome(b)))
      ) {
        return true;
      }
    }

    return false;
  }

  /**
   * Check if biome should display as Island (surrounded by 4 Ocean biomes)
   * Virtual biome - affects name, enemies, and battle BG only
   */
  function shouldDisplayAsIsland(biomeName, adjacentBiomes) {
    // Don't display as island if underground (check biomeLayerStack)
    if ($gameSystem._procGenData && $gameSystem._procGenData.biomeLayerStack && $gameSystem._procGenData.biomeLayerStack.length > 0) {
      return false;
    }

    // Only apply to non-water biomes
    if (!adjacentBiomes || isWaterBiome(biomeName)) {
      return false;
    }

    // Check if all 4 cardinal directions are Ocean biomes
    const isNorthOcean = adjacentBiomes.north === "Ocean";
    const isSouthOcean = adjacentBiomes.south === "Ocean";
    const isEastOcean = adjacentBiomes.east === "Ocean";
    const isWestOcean = adjacentBiomes.west === "Ocean";

    if (isNorthOcean && isSouthOcean && isEastOcean && isWestOcean) {
      console.log(`[shouldDisplayAsIsland] Displaying "${biomeName}" as "Island" (surrounded by Ocean)`);
      return true;
    }

    return false;
  }

  // ===== FEATURE FUNCTIONS =====


  /**
   * Fill layer 0 with terrain features based on weighted density distribution
   * If only one terrain feature exists, it covers the entire layer
   * Otherwise, features are distributed according to their density ratios
   */
  function fillTerrainLayer(mapData, biome, allFeatures, width, height, rng, adjacentBiomes) {
    const terrainFeatures = getTerrainFeatures(biome);

    if (terrainFeatures.length === 0) {
      console.log("No terrain features - attempting to borrow from adjacent biomes")

      // Collect terrain features from adjacent biomes
      const borrowedTerrainFeatures = [];

      if (adjacentBiomes) {
        for (const direction of ["north", "south", "east", "west"]) {
          const adjacentBiomeName = adjacentBiomes[direction];
          if (!adjacentBiomeName) continue;

          const adjacentBiome = getBiomeByName(adjacentBiomeName);
          if (!adjacentBiome || !adjacentBiome.features) continue;

          // Get terrain features from adjacent biome
          for (const feature of adjacentBiome.features) {
            const isTerrain = typeof feature === "object" && feature.terrain === true;
            if (!isTerrain) continue;

            const featureName = feature.name;

            // Exclude road and path-related terrain features from borrowing
            const excludedTerrains = ["Road", "DashedLine", "Path", "PathIce", "PathDesert"];
            if (excludedTerrains.includes(featureName)) continue;

            // Avoid duplicates
            if (!borrowedTerrainFeatures.find(f => f.name === featureName)) {
              borrowedTerrainFeatures.push({
                name: featureName,
                density: feature.density || 1
              });
            }
          }
        }
      }

      if (borrowedTerrainFeatures.length > 0) {
        console.log(`Borrowed ${borrowedTerrainFeatures.length} terrain features from adjacent biomes:`, borrowedTerrainFeatures.map(f => f.name));

        // Use borrowed terrain features with weighted distribution
        const totalDensity = borrowedTerrainFeatures.reduce((sum, f) => sum + f.density, 0);
        const weightedFeatures = [];

        for (const feature of borrowedTerrainFeatures) {
          const weight = Math.round((feature.density / totalDensity) * 1000);
          for (let i = 0; i < weight; i++) {
            weightedFeatures.push(feature.name);
          }
        }

        // Pre-build tile arrays for each borrowed feature
        const featureTiles = {};
        for (const featureName of borrowedTerrainFeatures.map(f => f.name)) {
          featureTiles[featureName] = [];
          if (allFeatures[featureName] && allFeatures[featureName].length > 0) {
            allFeatures[featureName].forEach(variant => {
              if (variant.type === "single") {
                featureTiles[featureName].push(variant.tileId);
              }
            });
          }
          // Fallback to default tile if feature has no variants
          if (featureTiles[featureName].length === 0) {
            featureTiles[featureName].push(2816);
          }
        }

        // Fill layer 0 with weighted random selection from borrowed features
        for (let y = 0; y < height; y++) {
          for (let x = 0; x < width; x++) {
            const selectedFeature = randomChoice(weightedFeatures, rng);
            const selectedTile = randomChoice(featureTiles[selectedFeature], rng);
            const idx = calculateIndex(x, y, 0, width, height);
            mapData[idx] = selectedTile;
          }
        }
        return;
      }

      // Final fallback: no adjacent biomes or no terrain features found, fill with Grass or default
      console.log("No terrain features found in adjacent biomes - using Grass fallback")
      const fallbackTiles = [2816];
      if (allFeatures["Grass"] && allFeatures["Grass"].length > 0) {
        allFeatures["Grass"].forEach(variant => {
          if (variant.type === "single") {
            fallbackTiles.push(variant.tileId);
          }
        });
      }
      for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
          const idx = calculateIndex(x, y, 0, width, height);
          mapData[idx] = randomChoice(fallbackTiles, rng);
        }
      }
      return;
    }

    if (terrainFeatures.length === 1) {
      console.log("Single terrain feature")

      // Single terrain feature: covers entire layer
      const featureName = terrainFeatures[0].name;
      const tiles = [];
      if (allFeatures[featureName] && allFeatures[featureName].length > 0) {
        allFeatures[featureName].forEach(variant => {
          if (variant.type === "single") {
            tiles.push(variant.tileId);
          }
        });
      }
      if (tiles.length === 0) tiles.push(2816);

      for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
          const idx = calculateIndex(x, y, 0, width, height);
          mapData[idx] = randomChoice(tiles, rng);
        }
      }
      return;
    }

    // Multiple terrain features: distribute by density
    // Create weighted selection array
    const totalDensity = terrainFeatures.reduce((sum, f) => sum + f.density, 0);
    const weightedFeatures = [];

    for (const feature of terrainFeatures) {
      const weight = Math.round((feature.density / totalDensity) * 1000);
      for (let i = 0; i < weight; i++) {
        weightedFeatures.push(feature.name);
      }
    }

    // Pre-build tile arrays for each feature
    const featureTiles = {};
    for (const featureName of terrainFeatures.map(f => f.name)) {
      featureTiles[featureName] = [];
      if (allFeatures[featureName] && allFeatures[featureName].length > 0) {
        allFeatures[featureName].forEach(variant => {
          if (variant.type === "single") {
            featureTiles[featureName].push(variant.tileId);
          }
        });
      }
      if (featureTiles[featureName].length === 0) {
        featureTiles[featureName].push(2816);
      }
    }

    // Fill layer 0 with weighted random selection
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const selectedFeature = randomChoice(weightedFeatures, rng);
        const selectedTile = randomChoice(featureTiles[selectedFeature], rng);
        const idx = calculateIndex(x, y, 0, width, height);
        mapData[idx] = selectedTile;
      }
    }
  }

  /**
   * Blend terrain features (layer 0) from adjacent biomes across the map
   * Creates organic, non-triangular gradients using global Perlin noise
   * Excludes Ocean biomes from blending
   * For terrain-only blending (features on layers 1-3 are preserved)
   * Skips blending on water and beach tiles to preserve coastlines
   */
  function blendBiomesTerrainOnly(mapData, biome, adjacentBiomes, allFeatures, width, height, seed, rng, worldCoords = {x: 0, y: 0}, waterTiles = []) {
    if (!adjacentBiomes) return;

    // Don't blend Ocean biomes at all
    if (biome.name === "Ocean" || biome.name === "Seabed") return;

    // Build expanded allFeatures to include adjacent biomes' features
    const expandedAllFeatures = { ...allFeatures };
    const allAdjacentBiomes = {};

    for (const [direction, biomeName] of Object.entries(adjacentBiomes)) {
      if (!biomeName || biomeName === "Ocean" || biomeName === "Seabed") continue;

      const adjacentBiome = getBiomeByName(biomeName);
      if (!adjacentBiome) continue;

      allAdjacentBiomes[direction] = adjacentBiome;

      // Add tilesets from adjacent biome to expanded features
      const adjacentTilesetIds = adjacentBiome.tilesetIds || [adjacentBiome.tilesetId];
      for (const tilesetId of adjacentTilesetIds) {
        const adjacentFeatures = Utils2.Cache.getTilesetFeatures(tilesetId);
        for (const [name, tiles] of Object.entries(adjacentFeatures)) {
          if (!expandedAllFeatures[name]) {
            expandedAllFeatures[name] = [];
          }
          expandedAllFeatures[name] = expandedAllFeatures[name].concat(tiles);
        }
      }
    }

    const blendScale = 0.02; // Perlin noise scale for smooth gradients
    const worldX = worldCoords.x || 0;
    const worldY = worldCoords.y || 0;

    // Blend terrain (layer 0) using global Perlin noise for each direction
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        // Calculate blend influence from each adjacent biome direction using global noise
        const influences = [];

        if (allAdjacentBiomes.north) {
          const influence = calculateDirectionalInfluence(x, y, "north", width, height, seed, blendScale, worldX, worldY);
          if (influence > 0) influences.push({ direction: "north", biome: allAdjacentBiomes.north, value: influence });
        }
        if (allAdjacentBiomes.south) {
          const influence = calculateDirectionalInfluence(x, y, "south", width, height, seed, blendScale, worldX, worldY);
          if (influence > 0) influences.push({ direction: "south", biome: allAdjacentBiomes.south, value: influence });
        }
        if (allAdjacentBiomes.east) {
          const influence = calculateDirectionalInfluence(x, y, "east", width, height, seed, blendScale, worldX, worldY);
          if (influence > 0) influences.push({ direction: "east", biome: allAdjacentBiomes.east, value: influence });
        }
        if (allAdjacentBiomes.west) {
          const influence = calculateDirectionalInfluence(x, y, "west", width, height, seed, blendScale, worldX, worldY);
          if (influence > 0) influences.push({ direction: "west", biome: allAdjacentBiomes.west, value: influence });
        }

        // Sort by influence strength (highest first)
        influences.sort((a, b) => b.value - a.value);

        // Blend from the strongest adjacent biome if influence is high enough
        if (influences.length > 0 && rng() < influences[0].value) {
          blendTerrainTileFromAdjacentBiome(mapData, x, y, influences[0].biome, expandedAllFeatures, width, height, rng, waterTiles);
        }
      }
    }
  }

  /**
   * Blend a single terrain tile (layer 0 only) from an adjacent biome
   * Only modifies layer 0 (terrain), preserves features on other layers
   * Excludes road-related terrain features (Road, Path, Sidewalk, DashedLine)
   * Skips blending on water and beach tiles to preserve coastlines
   */
  function blendTerrainTileFromAdjacentBiome(mapData, x, y, adjacentBiome, expandedAllFeatures, width, height, rng, waterTiles = []) {
    // Skip blending on beach tiles to preserve coastlines
    // Check if current tile matches any protected beach/water tile IDs
    const baseIdx = calculateIndex(x, y, 0, width, height);
    const baseTile = mapData[baseIdx];

    if (waterTiles.length > 0 && waterTiles.includes(baseTile)) {
      return;
    }

    // Also check beach coordinates as a fallback
    const beachCoordinates = window.ProcGenUtils?.beachCoordinates;
    if (beachCoordinates && beachCoordinates.has(`${x},${y}`)) {
      return;
    }

    const terrainFeatures = getTerrainFeatures(adjacentBiome);

    if (terrainFeatures.length === 0) return;

    // Filter out road-related terrain features from blending
    const excludedTerrains = ["Road", "Path", "Sidewalk", "DashedLine"];
    const blendableTerrains = terrainFeatures.filter(f => !excludedTerrains.includes(f.name));

    if (blendableTerrains.length === 0) return;

    // Select a random terrain feature from the adjacent biome (excluding road features)
    const selectedTerrain = getWeightedTerrainFeature(blendableTerrains, expandedAllFeatures, rng);
    if (!selectedTerrain) return;

    // Apply to layer 0 only
    mapData[baseIdx] = selectedTerrain;
  }

  /**
   * Blend biomes across entire map using global Perlin noise for smooth transitions
   * Creates organic, non-triangular gradients from adjacent biomes
   * Does NOT blend from Road or Ocean biomes
   * For Road and River biomes: allow blending from Fields biomes (both terrain and features)
   * Ensures no empty tiles are placed
   * Road biomes get terrain blending AND feature placement (B sheet features only)
   * Skips blending on water and beach tiles to preserve coastlines
   */
  function blendBiomeBorders(mapData, biome, adjacentBiomes, allFeatures, width, height, seed, rng, worldCoords = {x: 0, y: 0}, waterTiles = []) {
    if (!adjacentBiomes) return;

    const blendScale = 0.02; // Perlin noise scale for smooth gradients
    const isCurrentBiomeRoad = isRoadBiome(biome.name);
    const isCurrentBiomeRiver = isRiverBiome(biome.name);
    const worldX = worldCoords.x || 0;
    const worldY = worldCoords.y || 0;

    // Road and Ocean are excluded for all biomes
    // Fields is excluded for normal biomes but allowed for Road and River biomes
    const excludedBiomes = ["Road", "Ocean"];
    if (!isCurrentBiomeRoad && !isCurrentBiomeRiver) {
      excludedBiomes.push("Fields");
    }

    // Iterate through entire map
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        // Calculate blend influence from each adjacent biome direction using global noise
        const northInfluence = calculateDirectionalInfluence(x, y, "north", width, height, seed, blendScale, worldX, worldY);
        const southInfluence = calculateDirectionalInfluence(x, y, "south", width, height, seed, blendScale, worldX, worldY);
        const eastInfluence = calculateDirectionalInfluence(x, y, "east", width, height, seed, blendScale, worldX, worldY);
        const westInfluence = calculateDirectionalInfluence(x, y, "west", width, height, seed, blendScale, worldX, worldY);

        // Total influence from all directions
        const totalInfluence = northInfluence + southInfluence + eastInfluence + westInfluence;

        // Determine which adjacent biome to blend from based on weighted influence
        if (totalInfluence > 0 && rng() < Math.min(totalInfluence, 1)) {
          const influences = [
            { direction: "north", value: northInfluence, biomeName: adjacentBiomes.north },
            { direction: "south", value: southInfluence, biomeName: adjacentBiomes.south },
            { direction: "east", value: eastInfluence, biomeName: adjacentBiomes.east },
            { direction: "west", value: westInfluence, biomeName: adjacentBiomes.west },
          ];

          // Sort by influence to use strongest adjacent biome
          influences.sort((a, b) => b.value - a.value);

          // Find first valid adjacent biome (not excluded and matching tileset)
          // For road/river biomes: allow blending from any adjacent biome including Fields (tileset check skipped)
          for (const inf of influences) {
            if (inf.value > 0 && inf.biomeName && !excludedBiomes.includes(inf.biomeName)) {
              const adjacentBiome = getBiomeByName(inf.biomeName);
              // For road/river biomes, skip tileset check since we want to blend from all neighbors
              if (adjacentBiome && (isCurrentBiomeRoad || isCurrentBiomeRiver || adjacentBiome.tilesetId === biome.tilesetId)) {
                blendTileFromAdjacentBiome(mapData, x, y, adjacentBiome, allFeatures, width, height, rng, isCurrentBiomeRoad, waterTiles);
                break;
              }
            }
          }
        }
      }
    }
  }


  /**
   * Check if a tile ID belongs to the B sheet (common across all tilesets)
   * B sheet tiles range from 0-255 (B1-B256)
   */
  function isBSheetTile(tileId) {
    return tileId >= 0 && tileId < 256;
  }

  /**
   * Blend a single tile from an adjacent biome
   * Ensures a valid tile is always placed (never empty)
   * Features from adjacent biomes are placed with reduced density
   * For road biomes: blend features everywhere except ON the road tiles
   * For road biomes: only blend B sheet non-terrain features (common across all tilesets)
   * Skips blending on water and beach tiles to preserve coastlines
   */
  function blendTileFromAdjacentBiome(mapData, x, y, adjacentBiome, allFeatures, width, height, rng, isCurrentBiomeRoad = false, waterTiles = []) {
    // For road biomes, check if this position is ON the road - if so, skip blending entirely
    if (isCurrentBiomeRoad && isPositionOnRoadTile(x, y, width, height)) {
      return;
    }

    // Skip blending on beach tiles to preserve coastlines
    // Check if current tile matches any protected beach/water tile IDs
    const baseIdx = calculateIndex(x, y, 0, width, height);
    const baseTile = mapData[baseIdx];

    if (waterTiles.length > 0 && waterTiles.includes(baseTile)) {
      return;
    }

    // Also check beach coordinates as a fallback
    const beachCoordinates = window.ProcGenUtils?.beachCoordinates;
    if (beachCoordinates && beachCoordinates.has(`${x},${y}`)) {
      return;
    }

    const terrainFeatures = getTerrainFeatures(adjacentBiome);

    // 40% chance to blend terrain (layer 0) - but ONLY on road maps if not on road tile
    if (terrainFeatures.length > 0 && rng() < 0.4) {
      const selectedTerrain = getWeightedTerrainFeature(terrainFeatures, allFeatures, rng);
      if (selectedTerrain) {
        const idx = calculateIndex(x, y, 0, width, height);
        mapData[idx] = selectedTerrain;
        return;
      }
    }

    // Blend features from layer 2 (objects) with reduced density
    const regularFeatures = getFeaturesByLayer(adjacentBiome, allFeatures, 2, FEATURE_LAYERS);

    // Filter out road-related features from adjacent biomes
    const excludedFeatures = ["Road", "Path", "Sidewalk", "DashedLine"];
    const blendableFeatures = regularFeatures.filter(f => !excludedFeatures.includes(f.name));

    if (blendableFeatures.length > 0) {
      // Only 25% chance to even attempt feature blending (much less dense than original)
      if (rng() < 0.25) {
        const selectedFeature = randomChoice(blendableFeatures, rng);
        const featureVariants = allFeatures[selectedFeature.name];

        if (featureVariants && featureVariants.length > 0) {
          const variant = getRandomFeatureVariant(featureVariants, rng);
          if (variant && variant.type === "single" && variant.tileId) {
            // For road biomes: only place B sheet tiles (common across all tilesets)
            if (isCurrentBiomeRoad && !isBSheetTile(variant.tileId)) {
              return; // Skip non-B sheet features on road biomes
            }

            const idx = calculateIndex(x, y, 2, width, height);
            const currentTile = mapData[idx];

            // Check if tile is already occupied by a feature on the same layer
            const tileOccupied = isTileOccupiedOnLayer(mapData, x, y, 2, width, height);

            // Only place if no feature exists, or 30% chance to overwrite (reduced from 60%)
            if (!tileOccupied && (currentTile === 0 || rng() < 0.3)) {
              mapData[idx] = variant.tileId;
            }
          }
        }
      }
    }
  }



  // ===== ROAD GENERATION WRAPPER =====

  /**
   * Generate procedural terrain for a road biome
   * Uses road generation utilities from ProceduralMapRoadGenerator
   * Handles water edge drawing and biome blending
   */
  function generateRoadBiome(biome, seed, allFeatures, roadDirection, adjacentBiomes, cacheInfo, worldCoords, cache) {
    const width = PROC_MAP_WIDTH;
    const height = PROC_MAP_HEIGHT;
    const mapData = new Array(width * height * 4).fill(0);
    const rng = createSeededRandom(seed);

    let roadTileId = 2816;
    const roadConfig = parseRoadConfig(biome.name);

    if (roadConfig) {
      roadTileId = roadConfig.tileId;
    } else if (allFeatures["Road"] && allFeatures["Road"].length > 0) {
      // Extract first single-tile variant from Road feature
      for (const variant of allFeatures["Road"]) {
        if (variant.type === "single") {
          roadTileId = variant.tileId;
          break;
        }
      }
    }

    // Get DashedLine tile ID for road markings
    const dashedLineTileId = getDashedLineTileId(allFeatures);

    // Build expanded allFeatures to include features from adjacent biomes
    // This allows road biomes to blend terrain from adjacent biomes even if they use different tilesets
    const expandedAllFeatures = { ...allFeatures };
    if (adjacentBiomes) {
      for (const biomeName of Object.values(adjacentBiomes)) {
        if (!biomeName) continue;

        const adjacentBiome = getBiomeByName(biomeName);
        if (!adjacentBiome) continue;

        // Add tilesets from adjacent biome to expanded features
        const adjacentTilesetIds = adjacentBiome.tilesetIds || [adjacentBiome.tilesetId];
        for (const tilesetId of adjacentTilesetIds) {
          const adjacentFeatures = Utils2.Cache.getTilesetFeatures(tilesetId);
          for (const [name, tiles] of Object.entries(adjacentFeatures)) {
            if (!expandedAllFeatures[name]) {
              expandedAllFeatures[name] = [];
            }
            expandedAllFeatures[name] = expandedAllFeatures[name].concat(tiles);
          }
        }
      }
    }

    // Store adjacent biome terrain data for use AFTER road generation
    // This ensures terrain blending doesn't overwrite the roads themselves
    const adjacentTerrainTiles = {
      north: [],
      south: [],
      east: [],
      west: [],
    };

    // Collect terrain features from each adjacent biome
    if (adjacentBiomes) {
      for (const [direction, biomeName] of Object.entries(adjacentBiomes)) {
        if (!biomeName) continue;

        const adjacentBiome = getBiomeByName(biomeName);
        if (!adjacentBiome || !adjacentBiome.features) continue;

        // Get terrain features from adjacent biome
        for (const feature of adjacentBiome.features) {
          const featureName = typeof feature === "string" ? feature : feature.name;
          const isTerrain = typeof feature === "object" && feature.terrain === true;

          // Exclude road-related terrain features from blending
          const excludedTerrains = ["Road", "Path", "Sidewalk", "DashedLine"];

          // Only include terrain features (not road-related)
          // Use expandedAllFeatures so we can access tiles from adjacent biomes' tilesets
          if (isTerrain && !excludedTerrains.includes(featureName) && expandedAllFeatures[featureName]) {
            for (const variant of expandedAllFeatures[featureName]) {
              if (variant.type === "single" && variant.tileId) {
                adjacentTerrainTiles[direction].push(variant.tileId);
              }
            }
          }
        }
      }
    }

    // Initialize map with fallback terrain before drawing roads
    // This will be visible only in areas outside the road
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const idx = calculateIndex(x, y, 0, width, height);

        const distFromTop = y;
        const distFromBottom = height - 1 - y;
        const distFromLeft = x;
        const distFromRight = width - 1 - x;

        // Determine which adjacent biome is closest based on position
        // North edge: top rows
        if (distFromTop <= distFromBottom && distFromTop <= distFromLeft && distFromTop <= distFromRight && adjacentTerrainTiles.north.length > 0) {
          mapData[idx] = randomChoice(adjacentTerrainTiles.north, rng);
        }
        // South edge: bottom rows
        else if (distFromBottom <= distFromTop && distFromBottom <= distFromLeft && distFromBottom <= distFromRight && adjacentTerrainTiles.south.length > 0) {
          mapData[idx] = randomChoice(adjacentTerrainTiles.south, rng);
        }
        // East edge: right columns
        else if (distFromRight <= distFromTop && distFromRight <= distFromBottom && distFromRight <= distFromLeft && adjacentTerrainTiles.east.length > 0) {
          mapData[idx] = randomChoice(adjacentTerrainTiles.east, rng);
        }
        // West edge: left columns
        else if (distFromLeft <= distFromTop && distFromLeft <= distFromBottom && distFromLeft <= distFromRight && adjacentTerrainTiles.west.length > 0) {
          mapData[idx] = randomChoice(adjacentTerrainTiles.west, rng);
        }
        // Center: use a mix of all available terrains, or fallback to Grass
        else {
          let availableTiles = [];
          for (const tiles of Object.values(adjacentTerrainTiles)) {
            availableTiles = availableTiles.concat(tiles);
          }

          if (availableTiles.length > 0) {
            mapData[idx] = randomChoice(availableTiles, rng);
          } else {
            // Fallback to Grass if no terrain features found
            const grassTiles = [];
            if (allFeatures["Grass"] && allFeatures["Grass"].length > 0) {
              for (const variant of allFeatures["Grass"]) {
                if (variant.type === "single") {
                  grassTiles.push(variant.tileId);
                }
              }
            }
            mapData[idx] = grassTiles.length > 0 ? randomChoice(grassTiles, rng) : 2816;
          }
        }
      }
    }

    // Draw water edges if adjacent to water biomes
    let waterTiles = [];
    for (const featureName of ["Water", "Ocean", "Beach"]) {
      if (allFeatures[featureName] && allFeatures[featureName].length > 0) {
        for (const variant of allFeatures[featureName]) {
          if (variant.type === "single") {
            waterTiles.push(variant.tileId);
          }
        }
        if (waterTiles.length > 0) break;
      }
    }

    // Only draw water edges on non-cave biomes
    if (
      !isCaveBiome(biome.name) &&
      adjacentBiomes &&
      Object.values(adjacentBiomes).some((b) => b && isWaterBiome(b))
    ) {
      if (waterTiles.length > 0) {
        drawWaterEdges(
          mapData,
          waterTiles,
          adjacentBiomes,
          seed,
          width,
          height,
          rng,
          cacheInfo,
          allFeatures,
          biome.name
        );
      }
    }

    // Draw water corners if adjacent diagonals contain water biomes (only on non-cave biomes)
    if (!isCaveBiome(biome.name) && cacheInfo && cache) {
      const diagonalBiomes = checkDiagonalMapBiomesFromCache(
        worldCoords?.x || 0,
        worldCoords?.y || 0,
        cache
      );
      if (
        waterTiles.length > 0 &&
        (diagonalBiomes.topLeft.length > 0 ||
          diagonalBiomes.topRight.length > 0 ||
          diagonalBiomes.bottomLeft.length > 0 ||
          diagonalBiomes.bottomRight.length > 0)
      ) {
        drawWaterCorners(
          mapData,
          waterTiles,
          width,
          height,
          seed,
          rng,
          diagonalBiomes,
          allFeatures,
          biome.name
        );
      }
    }

    // After drawing water edges and corners, collect actual beach/water tile IDs
    // Only collect tiles that are at beach coordinates to avoid blocking all terrain blending
    const actualWaterAndBeachTiles = new Set();
    const beachCoords = window.ProcGenUtils?.beachCoordinates;
    if (beachCoords) {
      for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
          // Only protect tiles that are specifically at beach coordinates
          if (beachCoords.has(`${x},${y}`)) {
            const baseIdx = calculateIndex(x, y, 0, width, height);
            const tileId = mapData[baseIdx];
            if (tileId > 0) {
              actualWaterAndBeachTiles.add(tileId);
            }
          }
        }
      }
    }
    const actualWaterTilesArray = Array.from(actualWaterAndBeachTiles);

    // Use road drawing utilities from ProceduralMapRoadGenerator
    generateRoadBiomeUtil(mapData, biome, roadTileId, roadDirection, dashedLineTileId, width, height, adjacentBiomes);

    // Blend terrain from adjacent biomes into road borders
    // Use the actual water tiles to avoid overwriting beaches
    blendBiomesTerrainOnly(mapData, biome, adjacentBiomes, expandedAllFeatures, width, height, seed, rng, worldCoords, actualWaterTilesArray);

    // Blend non-terrain features from adjacent biomes (only B sheet tiles)
    // Use the actual water tiles collected from the map after drawWaterEdges
    blendBiomeBorders(mapData, biome, adjacentBiomes, expandedAllFeatures, width, height, seed, rng, worldCoords, actualWaterTilesArray);

    // Create region data for water tile detection in MovementInteractionSystem
    const regiondata = new Array(width * height).fill(0);

    // Identify water tile IDs from the biome features
    let waterTileIds = new Set();
    for (const featureName of ["Water", "Ocean", "Beach"]) {
      if (allFeatures[featureName] && allFeatures[featureName].length > 0) {
        for (const variant of allFeatures[featureName]) {
          if (variant.type === "single") {
            waterTileIds.add(variant.tileId);
          }
        }
      }
    }

    // Mark all water tiles with region ID 99 for MovementInteractionSystem detection
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const baseIdx = calculateIndex(x, y, 0, width, height);
        const tileId = mapData[baseIdx];

        if (waterTileIds.has(tileId)) {
          const regionIdx = y * width + x;
          regiondata[regionIdx] = 99;
        }
      }
    }

    // Attach region data to map data for $gameMap.regionId() calls
    mapData.regiondata = regiondata;

    return mapData;
  }

  // ===== RIVER GENERATION WRAPPER =====

  /**
   * Generate procedural terrain for a river biome
   * Uses river generation utilities from ProceduralMapRiverGenerator
   * Handles water edge drawing and biome blending
   */
  function generateRiverBiome(biome, seed, allFeatures, riverDirection, adjacentBiomes, cacheInfo, worldCoords, cache) {
    const width = PROC_MAP_WIDTH;
    const height = PROC_MAP_HEIGHT;
    const mapData = new Array(width * height * 4).fill(0);
    const rng = createSeededRandom(seed);

    let riverTileId = 2816;
    const riverConfig = parseRiverConfig(biome.name);

    if (riverConfig) {
      riverTileId = riverConfig.tileId;
    } else if (allFeatures["Water"] && allFeatures["Water"].length > 0) {
      // Extract first single-tile variant from Water feature
      for (const variant of allFeatures["Water"]) {
        if (variant.type === "single") {
          riverTileId = variant.tileId;
          break;
        }
      }
    }

    // Get RiverEdge tile ID for river decorations (reeds, rocks)
    const riverDecorationTileId = getRiverDecorationTileId(allFeatures);

    // Get terrain features from adjacent biomes (north, south, east, west)
    // Terrain features are those with terrain: true
    const adjacentTerrainTiles = {
      north: [],
      south: [],
      east: [],
      west: [],
    };

    // Collect terrain features from each adjacent biome
    if (adjacentBiomes) {
      for (const [direction, biomeName] of Object.entries(adjacentBiomes)) {
        if (!biomeName) continue;

        const adjacentBiome = getBiomeByName(biomeName);
        if (!adjacentBiome || !adjacentBiome.features) continue;

        // Get terrain features from adjacent biome
        for (const feature of adjacentBiome.features) {
          const featureName = typeof feature === "string" ? feature : feature.name;
          const isTerrain = typeof feature === "object" && feature.terrain === true;

          // Exclude road-related terrain features and water features from blending
          const excludedTerrains = ["Road", "Path", "Sidewalk", "DashedLine", "Water", "RiverEdge"];

          // Only include terrain features (not road-related or water features)
          if (isTerrain && !excludedTerrains.includes(featureName) && allFeatures[featureName]) {
            for (const variant of allFeatures[featureName]) {
              if (variant.type === "single" && variant.tileId) {
                adjacentTerrainTiles[direction].push(variant.tileId);
              }
            }
          }
        }
      }
    }

    // Fill terrain layer with adjacent biome terrain based on distance from edge
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const idx = calculateIndex(x, y, 0, width, height);

        // Determine which adjacent biome is closest based on position
        // North edge: top rows
        if (y < height / 4 && adjacentTerrainTiles.north.length > 0) {
          mapData[idx] = randomChoice(adjacentTerrainTiles.north, rng);
        }
        // South edge: bottom rows
        else if (y >= (height * 3) / 4 && adjacentTerrainTiles.south.length > 0) {
          mapData[idx] = randomChoice(adjacentTerrainTiles.south, rng);
        }
        // East edge: right columns
        else if (x >= (width * 3) / 4 && adjacentTerrainTiles.east.length > 0) {
          mapData[idx] = randomChoice(adjacentTerrainTiles.east, rng);
        }
        // West edge: left columns
        else if (x < width / 4 && adjacentTerrainTiles.west.length > 0) {
          mapData[idx] = randomChoice(adjacentTerrainTiles.west, rng);
        }
        // Center: use a mix of all available terrains, or fallback to Grass
        else {
          let availableTiles = [];
          for (const tiles of Object.values(adjacentTerrainTiles)) {
            availableTiles = availableTiles.concat(tiles);
          }

          if (availableTiles.length > 0) {
            mapData[idx] = randomChoice(availableTiles, rng);
          } else {
            // Fallback to Grass if no terrain features found
            const grassTiles = [];
            if (allFeatures["Grass"] && allFeatures["Grass"].length > 0) {
              for (const variant of allFeatures["Grass"]) {
                if (variant.type === "single") {
                  grassTiles.push(variant.tileId);
                }
              }
            }
            mapData[idx] = grassTiles.length > 0 ? randomChoice(grassTiles, rng) : 2816;
          }
        }
      }
    }

    // Use river drawing utilities from ProceduralMapRiverGenerator
    generateRiverBiomeUtil(mapData, biome, riverTileId, riverDirection, riverDecorationTileId, width, height);

    // After drawing river, collect actual beach/water tile IDs
    // Only collect tiles that are at beach coordinates to avoid blocking all terrain blending
    const actualWaterAndBeachTiles = new Set();
    const beachCoords = window.ProcGenUtils?.beachCoordinates;
    if (beachCoords) {
      for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
          // Only protect tiles that are specifically at beach coordinates
          if (beachCoords.has(`${x},${y}`)) {
            const baseIdx = calculateIndex(x, y, 0, width, height);
            const tileId = mapData[baseIdx];
            if (tileId > 0) {
              actualWaterAndBeachTiles.add(tileId);
            }
          }
        }
      }
    }
    const actualWaterTilesArray = Array.from(actualWaterAndBeachTiles);

    // Blend terrain from adjacent biomes into river borders
    // Use the actual water tiles to avoid overwriting beaches
    blendBiomesTerrainOnly(mapData, biome, adjacentBiomes, allFeatures, width, height, seed, rng, worldCoords, actualWaterTilesArray);

    // Blend non-terrain features from adjacent biomes (excluding road features)
    // Use the actual water tiles collected from the map after river generation
    blendBiomeBorders(mapData, biome, adjacentBiomes, allFeatures, width, height, seed, rng, worldCoords, actualWaterTilesArray);

    // Create region data for water tile detection in MovementInteractionSystem
    const regiondata = new Array(width * height).fill(0);

    // Identify water tile IDs from the biome features
    let waterTileIds = new Set();
    for (const featureName of ["Water", "Ocean", "Beach"]) {
      if (allFeatures[featureName] && allFeatures[featureName].length > 0) {
        for (const variant of allFeatures[featureName]) {
          if (variant.type === "single") {
            waterTileIds.add(variant.tileId);
          }
        }
      }
    }

    // Mark all water tiles with region ID 99 for MovementInteractionSystem detection
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const baseIdx = calculateIndex(x, y, 0, width, height);
        const tileId = mapData[baseIdx];

        if (waterTileIds.has(tileId)) {
          const regionIdx = y * width + x;
          regiondata[regionIdx] = 99;
        }
      }
    }

    // Attach region data to map data for $gameMap.regionId() calls
    mapData.regiondata = regiondata;

    return mapData;
  }

  // ===== MAIN TERRAIN GENERATION =====

  /**
   * Generate procedural terrain for a biome
   */

  /**
   * Select feature variants for cave biome
   * For features appearing multiple times, randomly selects 1-4 variants to use
   * Only processes features listed in the biome definition
   * Returns map of feature name to array of selected variants
   */
  function selectCaveFeatureVariants(biome, allFeatures, seed) {
    const selectedVariants = {};
    const rng = createSeededRandom(seed);

    // Get only the features specified in the biome definition
    const biomeFeatureNames = biome.features
      .map(f => typeof f === 'string' ? f : f.name)
      .filter(name => !["CaveFloor", "CaveCeiling", "CaveWall"].includes(name));

    // For each feature in the biome, select 1-4 variants
    for (const featureName of biomeFeatureNames) {
      const variants = allFeatures[featureName];
      if (!variants || variants.length === 0) continue;

      // Determine number of variants to use (1-4, or all if less than 4)
      const maxVariants = Math.min(variants.length, 4);
      const numVariantsToUse = Math.floor(rng() * maxVariants) + 1;

      // Shuffle variants and select top N
      const shuffled = [...variants];
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(rng() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }

      selectedVariants[featureName] = shuffled.slice(0, numVariantsToUse);
    }

    return selectedVariants;
  }

  function selectMountainFeatureVariants(biome, allFeatures, seed) {
    const selectedVariants = {};
    const rng = createSeededRandom(seed);

    // Get only the features specified in the biome definition
    const biomeFeatureNames = biome.features
      .map(f => typeof f === 'string' ? f : f.name)
      .filter(name => !["MountainCeiling", "MountainWall"].includes(name));

    // For each feature in the biome, select 1-4 variants
    for (const featureName of biomeFeatureNames) {
      const variants = allFeatures[featureName];
      if (!variants || variants.length === 0) continue;

      // Determine number of variants to use (1-4, or all if less than 4)
      const maxVariants = Math.min(variants.length, 4);
      const numVariantsToUse = Math.floor(rng() * maxVariants) + 1;

      // Shuffle variants and select top N
      const shuffled = [...variants];
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(rng() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }

      selectedVariants[featureName] = shuffled.slice(0, numVariantsToUse);
    }

    return selectedVariants;
  }

  /**
   * Generate cave biome terrain - uses separate rendering path without scattered terrain features
   * Only generates cave structure (floor, ceiling, walls) and places features on floor tiles
   */
  function generateCaveBiomeTerrain(
    biome,
    seed,
    allFeatures,
    worldCoords
  ) {
    const width = PROC_MAP_WIDTH;
    const height = PROC_MAP_HEIGHT;
    const mapData = new Array(width * height * 4).fill(0);

    const rng = createSeededRandom(seed);

    // Get CaveFloor and CaveCeiling tiles
    const caveFloorTiles = allFeatures["CaveFloor"] || [];
    const caveWallTiles = allFeatures["CaveCeiling"] || [];

    // Select a single CaveFloor variant seeded by world coordinates
    const caveFloorRng = createSeededRandom(worldCoords.x * 73856093 ^ worldCoords.y * 19349663);
    const selectedFloorVariant = caveFloorTiles.length > 0 ?
      caveFloorTiles[Math.floor(caveFloorRng() * caveFloorTiles.length)] :
      null;

    const caveFloorTile = selectedFloorVariant ?
      (selectedFloorVariant.type === "single" ? selectedFloorVariant.tileId : selectedFloorVariant.tiles[0][0]) :
      0;
    const caveWallTile = caveWallTiles.length > 0 ?
      (caveWallTiles[0].type === "single" ? caveWallTiles[0].tileId : caveWallTiles[0].tiles[0][0]) :
      0;

    // Select cave generation method based on world coordinates
    let caveData;
    // Hash world coordinates to pick generation method (0, 1, or 2)
    const methodHash = Math.abs((worldCoords.x * 73856093) ^ (worldCoords.y * 19349663));
    const generationMethod = methodHash % 3;

    switch (generationMethod) {
      case 0:
        // Drunken walk: Creates linear passages (carve ~40% of map)
        caveData = generateCaveWithDrunkenWalk(
          width,
          height,
          width,
          0.4,
          seed,
          caveFloorTile,
          caveWallTile
        );
        break;
      case 1:
        // Cellular automata: Natural-looking interconnected chambers
        caveData = generateCaveWithCellularAutomata(
          width,
          height,
          width,
          seed,
          caveFloorTile,
          caveWallTile
        );
        break;
      case 2:
        // Voronoi: Geometric crystal-like chambers
        caveData = generateCaveWithVoronoi(
          width,
          height,
          width,
          seed,
          caveFloorTile,
          caveWallTile
        );
        break;
    }

    // Copy cave data to main mapData
    for (let i = 0; i < caveData.length; i++) {
      mapData[i] = caveData[i];
    }

    // Place CaveWall tiles below each CaveCeiling (3 tiles south)
    // Only if CaveCeiling is directly above CaveFloor
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const idx = calculateIndex(x, y, 0, width, height);
        // If this is a CaveCeiling tile
        if (mapData[idx] === caveWallTile) {
          // Check if tile directly below is CaveFloor
          const belowIdx = calculateIndex(x, y + 1, 0, width, height);
          if (y + 1 < height && mapData[belowIdx] === caveFloorTile) {
            // Place 3 CaveWall tiles below (south) if they're not CaveCeiling
            for (let dy = 1; dy <= 3; dy++) {
              const wallY = y + dy;
              if (wallY < height) {
                const wallIdx = calculateIndex(x, wallY, 0, width, height);
                // Only place if it's not already a CaveCeiling
                if (mapData[wallIdx] !== caveWallTile) {
                  // Get CaveWall tile from features
                  const caveWallFeatureTiles = allFeatures["CaveWall"] || [];
                  const wallTile = caveWallFeatureTiles.length > 0 ?
                    (caveWallFeatureTiles[0].type === "single" ? caveWallFeatureTiles[0].tileId : caveWallFeatureTiles[0].tiles[0][0]) :
                    caveWallTile;
                  mapData[wallIdx] = wallTile;
                }
              }
            }
          }
        }
      }
    }

    // Seal cave borders with CaveCeiling tiles (3 tiles thick from each edge)
    const borderThickness = 5;  // 3 tiles from edge

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        let shouldSeal = false;

        // Seal all borders
        if (y < borderThickness || y >= height - borderThickness || x < borderThickness || x >= width - borderThickness) {
          shouldSeal = true;
        }

        if (shouldSeal) {
          const idx = calculateIndex(x, y, 0, width, height);
          mapData[idx] = caveWallTile;
        }
      }
    }

    // Create safe spawn area in center (7x7 cleared area)
    const centerX = Math.floor(width / 2);
    const centerY = Math.floor(height / 2);
    const spawnAreaRadius = 3; // Creates 7x7 area (radius 3 = 7 tiles diameter)

    for (let dy = -spawnAreaRadius; dy <= spawnAreaRadius; dy++) {
      for (let dx = -spawnAreaRadius; dx <= spawnAreaRadius; dx++) {
        const x = centerX + dx;
        const y = centerY + dy;
        if (x >= 0 && x < width && y >= 0 && y < height) {
          const idx = calculateIndex(x, y, 0, width, height);
          mapData[idx] = caveFloorTile;
        }
      }
    }

    // Find a valid destination in the cave for the tunnel (not in spawn area, not a wall)
    // Search for cave floor tiles outside the spawn area
    const potentialDestinations = [];
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const idx = calculateIndex(x, y, 0, width, height);
        const distanceFromCenter = Math.sqrt(Math.pow(x - centerX, 2) + Math.pow(y - centerY, 2));

        // Must be outside spawn area (distance > 10) and be a floor tile
        if (distanceFromCenter > 10 && mapData[idx] === caveFloorTile) {
          potentialDestinations.push({ x, y });
        }
      }
    }

    // Generate tunnel from spawn area to a random cave location
    if (potentialDestinations.length > 0) {
      // Pick a random destination
      const destination = potentialDestinations[Math.floor(rng() * potentialDestinations.length)];

      // Carve tunnel using a simple line algorithm with some width
      const tunnelWidth = 2; // 5 tiles wide tunnel (2 radius)
      let currentX = centerX;
      let currentY = centerY;
      const destX = destination.x;
      const destY = destination.y;

      // Use Bresenham's line algorithm to create tunnel path
      const dx = Math.abs(destX - currentX);
      const dy = Math.abs(destY - currentY);
      const sx = currentX < destX ? 1 : -1;
      const sy = currentY < destY ? 1 : -1;
      let err = dx - dy;

      // Store tunnel positions for wall placement
      const tunnelPositions = [];

      while (true) {
        // Carve tunnel with width
        for (let ty = -tunnelWidth; ty <= tunnelWidth; ty++) {
          for (let tx = -tunnelWidth; tx <= tunnelWidth; tx++) {
            const nx = currentX + tx;
            const ny = currentY + ty;
            if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
              const idx = calculateIndex(nx, ny, 0, width, height);
              mapData[idx] = caveFloorTile;
              tunnelPositions.push({ x: nx, y: ny });
            }
          }
        }

        // Check if we reached destination
        if (currentX === destX && currentY === destY) break;

        const e2 = 2 * err;
        if (e2 > -dy) {
          err -= dy;
          currentX += sx;
        }
        if (e2 < dx) {
          err += dx;
          currentY += sy;
        }
      }

      // Add CaveWall tiles below tunnel ceiling edges (same pattern as rest of cave)
      // Scan entire tunnel area to find all ceiling tiles that are directly above floor tiles
      // Then place 3 CaveWall tiles below those floor positions
      const processedPositions = new Set();

      for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
          const idx = calculateIndex(x, y, 0, width, height);

          // If this is a CaveCeiling tile
          if (mapData[idx] === caveWallTile) {
            // Check if tile directly below is CaveFloor (tunnel floor or cave floor)
            const belowIdx = calculateIndex(x, y + 1, 0, width, height);
            if (y + 1 < height && mapData[belowIdx] === caveFloorTile) {
              const posKey = `${x},${y + 1}`;

              // Avoid processing same position multiple times
              if (!processedPositions.has(posKey)) {
                processedPositions.add(posKey);

                // Place 3 CaveWall tiles below (south) if they're not CaveCeiling
                for (let dy = 1; dy <= 3; dy++) {
                  const wallY = y + 1 + dy;
                  if (wallY < height) {
                    const wallIdx = calculateIndex(x, wallY, 0, width, height);
                    // Only place if it's not already a CaveCeiling
                    if (mapData[wallIdx] !== caveWallTile) {
                      // Get CaveWall tile from features
                      const caveWallFeatureTiles = allFeatures["CaveWall"] || [];
                      const wallTile = caveWallFeatureTiles.length > 0 ?
                        (caveWallFeatureTiles[0].type === "single" ? caveWallFeatureTiles[0].tileId : caveWallFeatureTiles[0].tiles[0][0]) :
                        caveWallTile;
                      mapData[wallIdx] = wallTile;
                    }
                  }
                }
              }
            }
          }
        }
      }
    }

    // Select which feature variants to use in this cave (1-4 variants per feature type)
    // Only features listed in the biome definition are used
    const selectedFeatures = selectCaveFeatureVariants(biome, allFeatures, seed);

    // Build list of tiles to block (all cave structure tiles)
    // This ensures features only spawn on CaveFloor tiles
    const blockedTiles = [caveWallTile];

    // Add all CaveWall variants
    for (const variant of caveWallTiles) {
      if (variant.type === "single") {
        blockedTiles.push(variant.tileId);
      } else if (variant.type === "grid") {
        for (const row of variant.tiles) {
          for (const tileId of row) {
            blockedTiles.push(tileId);
          }
        }
      }
    }

    // Add CaveWall feature tiles
    const caveWallFeatureTiles = allFeatures["CaveWall"] || [];
    for (const variant of caveWallFeatureTiles) {
      if (variant.type === "single") {
        blockedTiles.push(variant.tileId);
      } else if (variant.type === "grid") {
        for (const row of variant.tiles) {
          for (const tileId of row) {
            blockedTiles.push(tileId);
          }
        }
      }
    }

    // Manually place features on CaveFloor tiles only with strict control
    // Find all CaveFloor tile positions
    const caveFloorPositions = [];
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const idx = calculateIndex(x, y, 0, width, height);
        if (mapData[idx] === caveFloorTile) {
          caveFloorPositions.push({ x, y });
        }
      }
    }

    if (caveFloorPositions.length > 0) {
      // Shuffle positions for random selection
      for (let i = caveFloorPositions.length - 1; i > 0; i--) {
        const j = Math.floor(rng() * (i + 1));
        [caveFloorPositions[i], caveFloorPositions[j]] = [caveFloorPositions[j], caveFloorPositions[i]];
      }

      // Select only 1-3% of available floor tiles for feature placement
      const featureTilesToPlace = Math.max(1, Math.floor(caveFloorPositions.length * 0.02));
      const selectedPositions = caveFloorPositions.slice(0, featureTilesToPlace);

      // Get all features in flat array for random selection
      const allSelectedVariants = [];
      for (const variants of Object.values(selectedFeatures)) {
        allSelectedVariants.push(...variants);
      }

      if (allSelectedVariants.length > 0) {
        // Place one feature per selected position
        for (const pos of selectedPositions) {
          // Randomly choose a variant
          const variant = allSelectedVariants[Math.floor(rng() * allSelectedVariants.length)];

          if (variant) {
            if (variant.type === "single") {
              // Check both layer 1 and 2 are empty before placing
              const idx1 = calculateIndex(pos.x, pos.y, 1, width, height);
              const idx2 = calculateIndex(pos.x, pos.y, 2, width, height);
              if (mapData[idx1] === 0 && mapData[idx2] === 0) {
                // Randomly choose which layer to place on
                const layer = rng() < 0.7 ? 1 : 2;
                const idx = calculateIndex(pos.x, pos.y, layer, width, height);
                mapData[idx] = variant.tileId;
              }
            } else if (variant.type === "grid") {
              // Check if multi-tile feature would overlap forbidden zones
              if (!doesMultiTileFeatureOverlapForbidden(variant.grid, pos.x, pos.y, width, height)) {
                // Safe to place - try to place multi-tile feature
                placeMultiTileFeature(
                  mapData,
                  variant.grid,
                  pos.x,
                  pos.y,
                  1,
                  width,
                  height,
                  new Set(blockedTiles)
                );
              }
            }
          }
        }
      }
    }

    // Clear any features in forbidden zones (borders and center)
    clearForbiddenZoneFeatures(mapData, width, height);

    // Create region data for water tile detection in MovementInteractionSystem
    const regiondata = new Array(width * height).fill(0);

    // Identify water tile IDs from the biome features
    let waterTileIds = new Set();
    for (const featureName of ["Water", "Ocean", "Beach"]) {
      if (allFeatures[featureName] && allFeatures[featureName].length > 0) {
        for (const variant of allFeatures[featureName]) {
          if (variant.type === "single") {
            waterTileIds.add(variant.tileId);
          }
        }
      }
    }

    // Mark all water tiles with region ID 99 for MovementInteractionSystem detection
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const baseIdx = calculateIndex(x, y, 0, width, height);
        const tileId = mapData[baseIdx];

        if (waterTileIds.has(tileId)) {
          const regionIdx = y * width + x;
          regiondata[regionIdx] = 99;
        }
      }
    }

    // Attach region data to map data for $gameMap.regionId() calls
    mapData.regiondata = regiondata;

    return mapData;
  }

  /**
   * Generate mountain biome terrain using Perlin noise
   * Creates cliff walls and peaks with variable heights based on noise elevation
   * This is a wrapper that prepares data for the core mountain terrain generator
   */
  function generateMountainSurfaceTerrainForBiome(
    biome,
    seed,
    allFeatures,
    adjacentBiomes,
    cacheInfo,
    worldCoords,
    cache
  ) {
    const width = PROC_MAP_WIDTH;
    const height = PROC_MAP_HEIGHT;

    // Get MountainCeiling and MountainWall tiles
    const mountainCeilingTiles = allFeatures["MountainCeiling"] || [];
    const mountainWallTiles = allFeatures["MountainWall"] || [];

    const mountainCeilingTile = mountainCeilingTiles.length > 0 ?
      (mountainCeilingTiles[0].type === "single" ? mountainCeilingTiles[0].tileId : mountainCeilingTiles[0].tiles[0][0]) :
      0;
    const mountainWallTile = mountainWallTiles.length > 0 ?
      (mountainWallTiles[0].type === "single" ? mountainWallTiles[0].tileId : mountainWallTiles[0].tiles[0][0]) :
      0;

    // First, generate base terrain (normal biome terrain)
    const baseMapData = new Array(width * height * 4).fill(0);
    fillTerrainLayer(baseMapData, biome, allFeatures, width, height, createSeededRandom(seed), adjacentBiomes);

    // Apply mountain terrain on top of base terrain
    // Pass worldCoords to randomize generation parameters for regional variety
    const mapData = generateMountainBiomeTerrain(
      width,
      height,
      width,
      seed,
      mountainCeilingTile,
      mountainWallTile,
      baseMapData,
      worldCoords
    );

    // Collect all water tile IDs for feature placement checks
    let waterTiles = [];
    for (const featureName of ["Water", "Ocean", "Beach"]) {
      if (allFeatures[featureName] && allFeatures[featureName].length > 0) {
        for (const variant of allFeatures[featureName]) {
          if (variant.type === "single") {
            waterTiles.push(variant.tileId);
          }
        }
        if (waterTiles.length > 0) break;
      }
    }

    // Create RNG for water and feature placement
    const rng = createSeededRandom(seed + 100);

    // Draw water edges and beaches BEFORE placing features
    // This ensures features won't be placed where water will be drawn
    if (adjacentBiomes && Object.values(adjacentBiomes).some((b) => b && isWaterBiome(b))) {
      if (waterTiles.length > 0) {
        drawWaterEdges(
          mapData,
          waterTiles,
          adjacentBiomes,
          seed,
          width,
          height,
          rng,
          cacheInfo,
          allFeatures,
          biome.name
        );
      }
    }

    // Draw water corners if adjacent diagonals contain water biomes
    if (cacheInfo && cache) {
      const diagonalBiomes = checkDiagonalMapBiomesFromCache(
        worldCoords?.x || 0,
        worldCoords?.y || 0,
        cache
      );
      if (
        waterTiles.length > 0 &&
        (diagonalBiomes.topLeft.length > 0 ||
          diagonalBiomes.topRight.length > 0 ||
          diagonalBiomes.bottomLeft.length > 0 ||
          diagonalBiomes.bottomRight.length > 0)
      ) {
        drawWaterCorners(
          mapData,
          waterTiles,
          diagonalBiomes,
          seed,
          width,
          height,
          cacheInfo,
          allFeatures
        );
      }
    }

    // Now collect ALL water tile IDs actually placed on the map
    // This includes water edges, beaches, and seashells that were just drawn
    let waterTileIdsSet = new Set();
    for (const featureName of ["Water", "Ocean", "Beach", "Seashell"]) {
      if (allFeatures[featureName] && allFeatures[featureName].length > 0) {
        for (const variant of allFeatures[featureName]) {
          if (variant.type === "single") {
            waterTileIdsSet.add(variant.tileId);
          }
        }
      }
    }

    // Scan the map and add any actual water tiles that were placed
    const actualWaterTiles = [];
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const baseIdx = calculateIndex(x, y, 0, width, height);
        const tileId = mapData[baseIdx];
        if (waterTileIdsSet.has(tileId)) {
          actualWaterTiles.push(tileId);
        }
      }
    }

    // Block mountain tiles and all water-related tiles from feature placement
    let blockedWaterTiles = [...new Set([...actualWaterTiles, ...waterTiles, mountainCeilingTile, mountainWallTile])];

    // Collect path tiles to NEVER overwrite them (Path, PathDesert, PathIce, Road)
    let pathTiles = [];
    for (const featureName of ["Path", "PathDesert", "PathIce", "Road", "DashedLine"]) {
      if (allFeatures[featureName] && allFeatures[featureName].length > 0) {
        for (const variant of allFeatures[featureName]) {
          if (variant.type === "single") {
            pathTiles.push(variant.tileId);
          }
        }
      }
    }

    // Place biome-specific features (exclude mountains, water, and beach areas)
    const featuresToUse = selectMountainFeatureVariants(biome, allFeatures, seed);
    for (const [featureName, variants] of Object.entries(featuresToUse)) {
      // Determine scatter density based on biome
      const baseDensity = 0.02;
      const density = baseDensity * (biome.featureDensity || 1);

      generateFeatureScattered(
        mapData,
        variants,
        1,  // layer
        width,
        height,
        seed + Object.keys(featuresToUse).indexOf(featureName),
        density,
        rng,
        blockedWaterTiles,
        pathTiles
      );
    }

    // Clear any features in forbidden zones (borders and center)
    clearForbiddenZoneFeatures(mapData, width, height);

    // Create region data for water tile detection in MovementInteractionSystem
    const regiondata = new Array(width * height).fill(0);

    // Identify water tile IDs from the biome features
    let waterTileIds = new Set();
    for (const featureName of ["Water", "Ocean", "Beach"]) {
      if (allFeatures[featureName] && allFeatures[featureName].length > 0) {
        for (const variant of allFeatures[featureName]) {
          if (variant.type === "single") {
            waterTileIds.add(variant.tileId);
          }
        }
      }
    }

    // Mark all water tiles with region ID 99 for MovementInteractionSystem detection
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const baseIdx = calculateIndex(x, y, 0, width, height);
        const tileId = mapData[baseIdx];

        if (waterTileIds.has(tileId)) {
          const regionIdx = y * width + x;
          regiondata[regionIdx] = 99;
        }
      }
    }

    // Attach region data to map data for $gameMap.regionId() calls
    mapData.regiondata = regiondata;

    return mapData;
  }

  function generateProceduralTerrain(
    biome,
    seed,
    roadDirection,
    adjacentBiomes,
    cacheInfo,
    worldCoords,
    cache
  ) {
    // Don't generate roads in cave biomes (roads are surface-only)
    if (isRoadBiome(biome.name) && !isCaveBiome(biome.name)) {
      const tilesetIds = biome.tilesetIds || [biome.tilesetId];
      const allFeatures = {};
      for (const tilesetId of tilesetIds) {
        const features = Cache.getTilesetFeatures(tilesetId);
        for (const [name, tiles] of Object.entries(features)) {
          if (!allFeatures[name]) {
            allFeatures[name] = [];
          }
          allFeatures[name] = allFeatures[name].concat(tiles);
        }
      }

      // Auto-determine road intersection type from adjacent biomes
      // This takes priority over hardcoded directions to ensure proper intersections
      let finalRoadDirection = roadDirection;
      if (adjacentBiomes) {
        const autoDetectedDirection = determineRoadIntersectionType(adjacentBiomes, isRoadBiome);
        console.log(`[ProceduralMapBiomeGenerator] Auto-detected road direction: ${autoDetectedDirection}`);
        // Always use auto-detected direction for roads to ensure proper intersections
        finalRoadDirection = autoDetectedDirection;
      } else if (finalRoadDirection) {
        console.log(`[ProceduralMapBiomeGenerator] Using hardcoded road direction (no adjacent biomes available): ${finalRoadDirection}`);
      }
      // Fallback to horizontal if still not determined
      if (!finalRoadDirection) {
        finalRoadDirection = "horizontal";
        console.log(`[ProceduralMapBiomeGenerator] Using fallback road direction: horizontal`);
      }

      return generateRoadBiome(biome, seed, allFeatures, finalRoadDirection, adjacentBiomes, cacheInfo, worldCoords, cache);
    }

    // Don't generate rivers in cave biomes (rivers are surface-only)
    if (isRiverBiome(biome.name) && !isCaveBiome(biome.name)) {
      const tilesetIds = biome.tilesetIds || [biome.tilesetId];
      const allFeatures = {};
      for (const tilesetId of tilesetIds) {
        const features = Cache.getTilesetFeatures(tilesetId);
        for (const [name, tiles] of Object.entries(features)) {
          if (!allFeatures[name]) {
            allFeatures[name] = [];
          }
          allFeatures[name] = allFeatures[name].concat(tiles);
        }
      }

      // Auto-determine river intersection type from adjacent biomes
      let finalRiverDirection = roadDirection;
      if (adjacentBiomes) {
        const autoDetectedDirection = determineRiverIntersectionType(adjacentBiomes, isRiverBiome);
        console.log(`[ProceduralMapBiomeGenerator] Auto-detected river direction: ${autoDetectedDirection}`);
        // Always use auto-detected direction for rivers to ensure proper intersections
        finalRiverDirection = autoDetectedDirection;
      } else if (finalRiverDirection) {
        console.log(`[ProceduralMapBiomeGenerator] Using hardcoded river direction (no adjacent biomes available): ${finalRiverDirection}`);
      }
      // Fallback to horizontal if still not determined
      if (!finalRiverDirection) {
        finalRiverDirection = "horizontal";
        console.log(`[ProceduralMapBiomeGenerator] Using fallback river direction: horizontal`);
      }

      return generateRiverBiome(biome, seed, allFeatures, finalRiverDirection, adjacentBiomes, cacheInfo, worldCoords, cache);
    }

    const tilesetIds = biome.tilesetIds || [biome.tilesetId];

    const allFeatures = {};
    for (const tilesetId of tilesetIds) {
      const features = Cache.getTilesetFeatures(tilesetId);
      for (const [name, tiles] of Object.entries(features)) {
        if (!allFeatures[name]) {
          allFeatures[name] = [];
        }
        allFeatures[name] = allFeatures[name].concat(tiles);
      }
    }

    // For cave biomes, use separate cave-only rendering (no scattered terrain features)
    if (isCaveBiome(biome.name)) {
      return generateCaveBiomeTerrain(biome, seed, allFeatures, worldCoords);
    }

    // For mountain biomes, generate Perlin noise-based cliff terrain
    if (isMountainBiome(biome.name)) {
      return generateMountainSurfaceTerrainForBiome(biome, seed, allFeatures, adjacentBiomes, cacheInfo, worldCoords, cache);
    }

    // For Seabed biome, generate underwater cliffs with water tiles as base
    if (biome.name === "Seabed") {
      if (BeachGen && BeachGen.generateSeabedBiomeTerrain) {
        return BeachGen.generateSeabedBiomeTerrain(biome, seed, allFeatures, adjacentBiomes, cacheInfo, worldCoords, cache);
      }
    }

    // For dungeon biomes, use BSP-based dungeon generation
    if (isDungeonBiome(biome.name)) {
      return generateDungeonBiomeUtil(biome, seed, allFeatures, adjacentBiomes, { worldCoords });
    }

    // For village biomes, use village path and house generation
    if (isVillageBiome(biome.name)) {
      const mapData = generateVillageBiomeUtil(biome, seed, allFeatures, adjacentBiomes, { worldCoords });

      // After village generation, scatter terrain features on layers 1 and 2
      const rng = createSeededRandom(seed);

      // Collect water tiles to avoid placing features on them
      let waterTiles = [];
      for (const featureName of ["Water", "Ocean", "Beach"]) {
        if (allFeatures[featureName] && allFeatures[featureName].length > 0) {
          for (const variant of allFeatures[featureName]) {
            if (variant.type === "single") {
              waterTiles.push(variant.tileId);
            }
          }
        }
      }

      // Collect path tiles to NEVER overwrite them (Path, PathDesert, PathIce, Road)
      let pathTiles = [];
      for (const featureName of ["Path", "PathDesert", "PathIce", "Road", "DashedLine"]) {
        if (allFeatures[featureName] && allFeatures[featureName].length > 0) {
          for (const variant of allFeatures[featureName]) {
            if (variant.type === "single") {
              pathTiles.push(variant.tileId);
            }
          }
        }
      }

      // Scatter features on layer 1 (noise-based)
      for (const feature of getFeaturesByLayer(biome, allFeatures, 1, FEATURE_LAYERS)) {
        generateFeatureNoise(
          mapData,
          allFeatures[feature.name],
          1,
          PROC_MAP_WIDTH,
          PROC_MAP_HEIGHT,
          seed,
          0.15 * feature.density,
          rng,
          waterTiles,
          pathTiles
        );
      }

      // Scatter features on layer 2 (scattered)
      for (const feature of getFeaturesByLayer(biome, allFeatures, 2, FEATURE_LAYERS)) {
        generateFeatureScattered(
          mapData,
          allFeatures[feature.name],
          2,
          PROC_MAP_WIDTH,
          PROC_MAP_HEIGHT,
          seed,
          0.05 * feature.density,
          rng,
          waterTiles,
          pathTiles
        );
      }

      return mapData;
    }

    // For city biomes, use grid-based city generation with roads and building lots
    if (isCityBiome(biome.name)) {
      return generateCityBiomeUtil(biome, seed, allFeatures, adjacentBiomes, { worldCoords });
    }

    // For city biomes, use grid-based city generation with roads and building lots
    if (isBurgBiome(biome.name)) {
      return generateBurgBiomeUtil(biome, seed, allFeatures, adjacentBiomes, { worldCoords });
    }

    const width = PROC_MAP_WIDTH;
    const height = PROC_MAP_HEIGHT;
    const mapData = new Array(width * height * 4).fill(0);

    const rng = createSeededRandom(seed);

    // Normal biome terrain generation (non-cave)
    // Fill layer 0 with terrain features (those with terrain: true)
    // Uses weighted distribution based on density values
    fillTerrainLayer(mapData, biome, allFeatures, width, height, rng, adjacentBiomes);

    // Collect all water tiles (single-tile variants only) for feature placement checks
    let waterTiles = [];
    for (const featureName of ["Water", "Ocean", "Beach"]) {
      if (allFeatures[featureName] && allFeatures[featureName].length > 0) {
        for (const variant of allFeatures[featureName]) {
          if (variant.type === "single") {
            waterTiles.push(variant.tileId);
          }
        }
        if (waterTiles.length > 0) break;
      }
    }

    // Collect path tiles to NEVER overwrite them (Path, PathDesert, PathIce, Road)
    let pathTiles = [];
    for (const featureName of ["Path", "PathDesert", "PathIce", "Road", "DashedLine"]) {
      if (allFeatures[featureName] && allFeatures[featureName].length > 0) {
        for (const variant of allFeatures[featureName]) {
          if (variant.type === "single") {
            pathTiles.push(variant.tileId);
          }
        }
      }
    }

    // For cave biomes, add CaveCeiling and CaveWall to blocked tiles (don't place features on them)
    let blockedTiles = [...waterTiles];
    if (isCaveBiome(biome.name)) {
      // Get the actual CaveCeiling and CaveWall tiles used in generation
      const caveFloorTiles = allFeatures["CaveFloor"] || [];
      const caveWallTiles = allFeatures["CaveCeiling"] || [];
      const caveWallFeatures = allFeatures["CaveWall"] || [];

      // Block CaveCeiling tiles
      for (const variant of caveWallTiles) {
        if (variant.type === "single") {
          blockedTiles.push(variant.tileId);
        } else if (variant.type === "multi") {
          for (const row of variant.tiles) {
            for (const tileId of row) {
              blockedTiles.push(tileId);
            }
          }
        }
      }

      // Block CaveWall tiles
      for (const variant of caveWallFeatures) {
        if (variant.type === "single") {
          blockedTiles.push(variant.tileId);
        } else if (variant.type === "multi") {
          for (const row of variant.tiles) {
            for (const tileId of row) {
              blockedTiles.push(tileId);
            }
          }
        }
      }
    }

    // Only draw water edges on non-cave biomes (road biome path)
    if (
      !isCaveBiome(biome.name) &&
      adjacentBiomes &&
      Object.values(adjacentBiomes).some((b) => b && isWaterBiome(b))
    ) {
      if (waterTiles.length > 0) {
        drawWaterEdges(
          mapData,
          waterTiles,
          adjacentBiomes,
          seed,
          width,
          height,
          rng,
          cacheInfo,
          allFeatures,
          biome.name
        );
      }
    }

    // Draw water corners if adjacent diagonals contain water biomes (only on non-cave biomes)
    if (!isCaveBiome(biome.name) && cacheInfo && cache) {
      const diagonalBiomes = checkDiagonalMapBiomesFromCache(
        worldCoords?.x || 0,
        worldCoords?.y || 0,
        cache
      );
      if (
        waterTiles.length > 0 &&
        (diagonalBiomes.topLeft.length > 0 ||
          diagonalBiomes.topRight.length > 0 ||
          diagonalBiomes.bottomLeft.length > 0 ||
          diagonalBiomes.bottomRight.length > 0)
      ) {
        drawWaterCorners(
          mapData,
          waterTiles,
          width,
          height,
          seed,
          rng,
          diagonalBiomes,
          allFeatures,
          biome.name
        );
      }
    }

    // After drawing water edges and corners, collect actual beach/water tile IDs
    // Only collect tiles that are at beach coordinates to avoid blocking all terrain blending
    const actualWaterAndBeachTiles = new Set();
    const beachCoords = window.ProcGenUtils?.beachCoordinates;
    if (beachCoords) {
      for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
          // Only protect tiles that are specifically at beach coordinates
          if (beachCoords.has(`${x},${y}`)) {
            const baseIdx = calculateIndex(x, y, 0, width, height);
            const tileId = mapData[baseIdx];
            if (tileId > 0) {
              actualWaterAndBeachTiles.add(tileId);
            }
          }
        }
      }
    }
    const actualWaterTilesArray = Array.from(actualWaterAndBeachTiles);

    for (const feature of getFeaturesByLayer(biome, allFeatures, 1, FEATURE_LAYERS)) {
      generateFeatureNoise(
        mapData,
        allFeatures[feature.name],
        1,
        width,
        height,
        seed,
        0.15 * feature.density,
        rng,
        blockedTiles,
        pathTiles
      );
    }

    for (const feature of getFeaturesByLayer(biome, allFeatures, 2, FEATURE_LAYERS)) {
      generateFeatureScattered(
        mapData,
        allFeatures[feature.name],
        2,
        width,
        height,
        seed,
        0.05 * feature.density,
        rng,
        blockedTiles,
        pathTiles
      );
    }

    // For cave biomes, remove any features that overlap with CaveCeiling or CaveWall
    if (isCaveBiome(biome.name)) {
      const caveWallTiles = allFeatures["CaveCeiling"] || [];
      const caveWallFeatures = allFeatures["CaveWall"] || [];

      // Build set of blocked tile IDs
      const blockedTileSet = new Set();

      // Add CaveCeiling tiles
      for (const variant of caveWallTiles) {
        if (variant.type === "single") {
          blockedTileSet.add(variant.tileId);
        } else if (variant.type === "multi") {
          for (const row of variant.tiles) {
            for (const tileId of row) {
              blockedTileSet.add(tileId);
            }
          }
        }
      }

      // Add CaveWall tiles
      for (const variant of caveWallFeatures) {
        if (variant.type === "single") {
          blockedTileSet.add(variant.tileId);
        } else if (variant.type === "multi") {
          for (const row of variant.tiles) {
            for (const tileId of row) {
              blockedTileSet.add(tileId);
            }
          }
        }
      }

      // Second pass: remove features on CaveCeiling or CaveWall tiles
      for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
          const baseIdx = calculateIndex(x, y, 0, width, height);
          // If base layer is CaveCeiling or CaveWall
          if (blockedTileSet.has(mapData[baseIdx])) {
            // Clear any features on layers 1-3
            for (let z = 1; z <= 3; z++) {
              const idx = calculateIndex(x, y, z, width, height);
              mapData[idx] = 0;
            }
          }
        }
      }
    }

    // Blend terrain from adjacent biomes at map borders for seamless transitions
    // Uses global Perlin noise for organic, non-triangular blending
    // Use the actual water tiles to avoid overwriting beaches
    blendBiomesTerrainOnly(mapData, biome, adjacentBiomes, allFeatures, width, height, seed, rng, worldCoords, actualWaterTilesArray);

    // Clear any features in forbidden zones (borders and center)
    if ((biome.name !== "Ocean")&&(biome.name !== "Seabed")) {
      clearForbiddenZoneFeatures(mapData, width, height);

    }
  

    const tileToFeature = createTileToFeatureMap(allFeatures);
    const asciiMap = generateAsciiVisualization(
      mapData,
      width,
      height,
      tileToFeature
    );

    // Create region data for water tile detection in MovementInteractionSystem
    const regiondata = new Array(width * height).fill(0);

    // Identify water tile IDs from the biome features
    let waterTileIds = new Set();
    for (const featureName of ["Water", "Ocean", "Beach"]) {
      if (allFeatures[featureName] && allFeatures[featureName].length > 0) {
        for (const variant of allFeatures[featureName]) {
          if (variant.type === "single") {
            waterTileIds.add(variant.tileId);
          }
        }
      }
    }

    // Mark all water tiles with region ID 99 for MovementInteractionSystem detection
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const baseIdx = calculateIndex(x, y, 0, width, height);
        const tileId = mapData[baseIdx];

        if (waterTileIds.has(tileId)) {
          const regionIdx = y * width + x;
          regiondata[regionIdx] = 99;
        }
      }
    }

    // Attach region data to map data for $gameMap.regionId() calls
    mapData.regiondata = regiondata;

    return mapData;
  }

  // ===== GAME SYSTEM EXTENSIONS =====

  /**
   * Initialize procedural generation data on Game_System
   */
  const _Game_System_initialize = Game_System.prototype.initialize;
  Game_System.prototype.initialize = function () {
    _Game_System_initialize.call(this);
    this._procGenData = {
      originX: 0,
      originY: 0,
      currentBiome: null,
      currentRoadDirection: null,
      currentBiomeTileset: null,
      generatedMapData: null,
      biomeToTileset: {},
      mapPreloaded: false,
      seed: 12345,
      biomeCoordinateCache: {},
      lastLoadedProcMapX: null,
      lastLoadedProcMapY: null,
      displayAsBeach: false,
      biomeLayerStack: [],
    };
  };

  /**
   * Build a cache of biome coordinates for all biomes on the world map
   */
  Game_System.prototype.buildBiomeCoordinateCache = function () {
    if (!$gameMap || $gameMap.mapId() !== WORLD_MAP_ID) {
      console.log(`[buildBiomeCoordinateCache] Cannot build: mapId=${$gameMap ? $gameMap.mapId() : 'null'}, WORLD_MAP_ID=${WORLD_MAP_ID}`);
      return;
    }

    const cache = {};
    const mapWidth = $gameMap.width();
    const mapHeight = $gameMap.height();

    for (const biome of BIOMES) {
      cache[biome.name] = [];
    }

    let coordsAdded = 0;
    for (let y = 0; y < mapHeight; y++) {
      for (let x = 0; x < mapWidth; x++) {
        const biomeName = this.getBiomeFromWorldCoordinates(x, y);
        if (biomeName) {
          if (!cache[biomeName]) {
            cache[biomeName] = [];
          }
          cache[biomeName].push({ x, y });
          coordsAdded++;
        }
      }
    }

    this._procGenData.biomeCoordinateCache = cache;

    const totalCoords = Object.values(cache).reduce(
      (sum, arr) => sum + arr.length,
      0
    );
    console.log(`[buildBiomeCoordinateCache] Built cache: scanned ${mapWidth}x${mapHeight}=${mapWidth*mapHeight} tiles, added ${coordsAdded} coordinates to ${Object.keys(cache).length} biomes`);

    // Log sample biomes in cache
    for (const [biomeName, coords] of Object.entries(cache)) {
      if (coords.length > 0) {
        console.log(`  ${biomeName}: ${coords.length} coords, samples: (${coords.slice(0, 3).map(c => `${c.x},${c.y}`).join(") (")})`);
      }
    }
  };

  /**
   * Get biome from world tile using highest priority layer
   */
  Game_System.prototype.getBiomeFromWorldCoordinates = function (x, y) {
    let selectedTileId = 0;
    for (let z = 3; z >= 0; z--) {
      const tileId = $gameMap.tileId(x, y, z);
      if (tileId && tileId !== 0) {
        selectedTileId = tileId;
        break;
      }
    }

    if (selectedTileId === 0) {
      return "Fields";
    }

    return getBiomeForWorldTile(selectedTileId);
  };

  /**
   * Get biome name from cache for given world coordinates
   */
  Game_System.prototype.getBiomeFromCache = function (x, y) {
    const cache = this._procGenData.biomeCoordinateCache;
    for (const [biomeName, coordinates] of Object.entries(cache)) {
      if (coordinates.some((coord) => coord.x === x && coord.y === y)) {
        return biomeName;
      }
    }

    if ($gameMap.mapId() === WORLD_MAP_ID) {
      return this.getBiomeFromWorldCoordinates(x, y);
    }

    return "Fields";
  };

  /**
   * Get road direction from world coordinates via cache lookup
   */
  Game_System.prototype.getRoadDirectionFromCache = function (x, y) {
    for (let z = 3; z >= 0; z--) {
      const tileId = $gameMap.tileId(x, y, z);
      if (tileId && tileId !== 0) {
        const direction = getRoadDirectionFromWorldTile(tileId);
        if (direction) {
          return direction;
        }
      }
    }
    return null;
  };

  /**
   * Generate procedural map from world map coordinates
   */
  Game_System.prototype.generateProceduralMap = function () {
    const VAR_WORLD_X = 43;
    const VAR_WORLD_Y = 44;

    let originX = $gameVariables.value(VAR_WORLD_X);
    let originY = $gameVariables.value(VAR_WORLD_Y);

    if (originX === 0 && originY === 0) {
      if ($gameMap.mapId() === WORLD_MAP_ID) {
        originX = $gamePlayer.x;
        originY = $gamePlayer.y;

        $gameVariables.setValue(VAR_WORLD_X, originX);
        $gameVariables.setValue(VAR_WORLD_Y, originY);

        this.buildBiomeCoordinateCache();
      } else {
        return false;
      }
    }

    this._procGenData.originX = originX;
    this._procGenData.originY = originY;

    let biomeName = "Fields";
    let roadDirection = null;

    // Check for hardcoded biome overrides first
    const hardcodedOverride = getHardcodedBiomeOverride(originX, originY);

    if (hardcodedOverride) {
      // Use hardcoded biome and optional road direction
      biomeName = hardcodedOverride.biome;
      roadDirection = hardcodedOverride.roadDirection || null;
    } else {
      // Fall back to auto-detection from world map
      const worldTileBiome = this.getBiomeFromWorldCoordinates(originX, originY);

      let lookupBiomeName = worldTileBiome;

      if (worldTileBiome.startsWith("Road ")) {
        roadDirection = worldTileBiome.substring(5).toLowerCase();
        lookupBiomeName = "Road";
      }

      biomeName = lookupBiomeName;
    }

    const biome = getBiomeByName(biomeName);

    if (!biome) {
      logWarn(`Biome not found: ${biomeName}, using Fields`);
      const defaultBiome = getBiomeByName("Fields");
      if (!defaultBiome) {
        logWarn(`Critical: Fields biome not defined`);
        return false;
      }
      biomeName = "Fields";
    }

    // Check if biome has specialBiomes and apply 25% chance to override
    if (biome && biome.specialBiomes && biome.specialBiomes.length > 0) {
      const coordinateSeed = this._procGenData.seed + (originX * 73856093) ^ (originY * 19349663);
      const rng = createSeededRandom(coordinateSeed);

      // 25% chance to use a special biome variant
      if (rng() < 0.25) {
        const specialBiomeName = biome.specialBiomes[Math.floor(rng() * biome.specialBiomes.length)];
        const specialBiome = getBiomeByName(specialBiomeName);

        if (specialBiome) {
          console.log(`[ProceduralMap] Assigning special biome "${specialBiomeName}" to coordinates (${originX}, ${originY})`);

          // Update cache to reflect the special biome override
          if (this._procGenData.biomeCoordinateCache) {
            // Remove from old biome's coordinate list
            if (this._procGenData.biomeCoordinateCache[biomeName]) {
              this._procGenData.biomeCoordinateCache[biomeName] =
                this._procGenData.biomeCoordinateCache[biomeName].filter(
                  coord => !(coord.x === originX && coord.y === originY)
                );
            }

            // Add to new special biome's coordinate list
            if (!this._procGenData.biomeCoordinateCache[specialBiomeName]) {
              this._procGenData.biomeCoordinateCache[specialBiomeName] = [];
            }
            this._procGenData.biomeCoordinateCache[specialBiomeName].push({ x: originX, y: originY });

            console.log(`[ProceduralMap] Cache updated: moved (${originX}, ${originY}) from "${biomeName}" to "${specialBiomeName}"`);
          }

          biomeName = specialBiomeName;
        } else {
          logWarn(`Special biome "${specialBiomeName}" not found, using parent biome "${biomeName}"`);
        }
      }
    }

    this._procGenData.currentBiome = biomeName;
    this._procGenData.currentRoadDirection = roadDirection;

    const tilesetId = biome.tilesetId;
    this._procGenData.currentBiomeTileset = tilesetId;

    // Store biome temperature data for weather system
    this._procGenData.biomeDayTemperature = biome.dayTemperature || 20;
    this._procGenData.biomeNightTemperature = biome.nightTemperature || 10;

    const seed = this._procGenData.seed + originX + originY;

    let adjacentBiomes = null;
    let diagonalBiomes = null;
    let cacheInfo = null;
    if ($gameMap.mapId() === WORLD_MAP_ID) {
      adjacentBiomes = getAdjacentBiomesOnWorldMap(originX, originY);

      // Override with cache results to get actual biome assignments (roads placed on fields, etc.)
      if (
        this._procGenData.biomeCoordinateCache &&
        Object.keys(this._procGenData.biomeCoordinateCache).length > 0
      ) {
        const cachedAdjacent = getAdjacentBiomesFromCache(
          originX,
          originY,
          this._procGenData.biomeCoordinateCache
        );
        // Use cache values if they exist (they're more accurate for overridden biomes)
        adjacentBiomes.north = cachedAdjacent.north || adjacentBiomes.north;
        adjacentBiomes.south = cachedAdjacent.south || adjacentBiomes.south;
        adjacentBiomes.east = cachedAdjacent.east || adjacentBiomes.east;
        adjacentBiomes.west = cachedAdjacent.west || adjacentBiomes.west;
      }

      adjacentBiomes = {
        north: normalizeBiomeForEdge(adjacentBiomes.north),
        south: normalizeBiomeForEdge(adjacentBiomes.south),
        east: normalizeBiomeForEdge(adjacentBiomes.east),
        west: normalizeBiomeForEdge(adjacentBiomes.west),
      };
      const waterCount = Object.values(adjacentBiomes).filter(
        (b) => b && isWaterBiome(b)
      ).length;

      if (
        this._procGenData.biomeCoordinateCache &&
        Object.keys(this._procGenData.biomeCoordinateCache).length > 0
      ) {
        cacheInfo = checkAdjacentMapBiomesFromCache(
          originX,
          originY,
          this._procGenData.biomeCoordinateCache
        );
        diagonalBiomes = checkDiagonalMapBiomesFromCache(
          originX,
          originY,
          this._procGenData.biomeCoordinateCache
        );
      }
    }

    // Check if Fields biome should display as Beach
    this._procGenData.displayAsBeach = shouldDisplayAsBeach(biomeName, adjacentBiomes, diagonalBiomes);

    // Check if biome should display as Island (virtual biome - name, enemies, battle BG only)
    this._procGenData.displayAsIsland = shouldDisplayAsIsland(biomeName, adjacentBiomes);

    const worldCoords = { x: originX, y: originY };
    this._procGenData.generatedMapData = generateProceduralTerrain(
      biome,
      seed,
      roadDirection,
      adjacentBiomes,
      cacheInfo,
      worldCoords,
      this._procGenData.biomeCoordinateCache
    );

    // Play biome BGS if defined (night or day version)
    const finalBiome = getBiomeByName(biomeName);
    if (finalBiome) {
      // Determine if it's nighttime
      const dateStr = $gameVariables.value(113) || "01 JAN 2001 12:00";
      const parts = dateStr.split(" ");
      const timeParts = parts[3] ? parts[3].split(":") : ["12", "00"];
      const currentHour = parseInt(timeParts[0]) || 12;

      // Night is from 20:00 to 6:00
      const isNightTime = currentHour >= 20 || currentHour < 6;

      // Choose appropriate BGS array based on time of day
      let bgsArray = isNightTime && finalBiome.bgsNight ? finalBiome.bgsNight : finalBiome.bgs;

      if (bgsArray && bgsArray.length > 0) {
        const rng = createSeededRandom(seed + originX * 7 + originY * 13);
        const bgsName = bgsArray[Math.floor(rng() * bgsArray.length)];
        AudioManager.playBgs({ name: bgsName, volume: 80, pitch: 100, pan: 0 });
      } else {
        AudioManager.stopBgs();
      }
    } else {
      AudioManager.stopBgs();
    }

    return true;
  };

  // NOTE: DataManager.loadMapData override and Game_System map transfer methods have been moved to ProceduralMapTransfer.js
  // Includes: getReturnCoordinates, getAdjacentWorldCoordinates, getEdgeCoordinateForDirection, clearProcGenData, getBiomeTilesetId

  // ===== GAME MAP EXTENSIONS =====
  // NOTE: Game_Map overrides (initialize, setup, tileset) and border detection have been moved to ProceduralMapTransfer.js

  // ===== PLUGIN COMMAND HANDLERS =====
  // NOTE: Plugin commands (startProcGen, stopProcGen, goDown, goUp) have been moved to ProceduralMapTransfer.js

  // ===== PUBLIC ACCESSORS =====

  Game_System.prototype.isProceduralMapActive = function () {
    return $gameVariables.value(110) === 1;
  };

  Game_System.prototype.isInsideProceduralMap = function () {
    return $gameVariables.value(111) === 1;
  };

  Game_System.prototype.getProcGenData = function () {
    return this._procGenData;
  };

  /**
   * Check if car events should be deleted for this biome
   */
  function shouldDeleteCarsForBiome(biomeName) {
    if (!biomeName) return true; // No biome = delete cars
    const lowerBiome = biomeName.toLowerCase();
    const allowedKeywords = ["road", "bridge", "city", "burg", "tunnel"];
    return !allowedKeywords.some(keyword => lowerBiome.includes(keyword));
  }

  /**
   * Check if NPC events should be deleted for this biome
   */
  function shouldDeleteNPCsForBiome(biomeName) {
    if (!biomeName) return true; // No biome = delete NPCs
    const lowerBiome = biomeName.toLowerCase();
    const allowedKeywords = ["city", "burg", "village"];
    return !allowedKeywords.some(keyword => lowerBiome.includes(keyword));
  }

  // ===== EDGE DETECTION & AUTO-RETURN =====
  // NOTE: Border arrow visualization, Game_Player overrides, and Scene_Map hooks have been moved to ProceduralMapTransfer.js
  // Includes: Sprite_BorderArrow, getProcGenBorderTiles, displayProcGenBorderArrows, clearProcGenBorderArrows
  // updateProcGenBorderArrows, Game_Player.update override, performTransfer override, moveStraight override, Scene_Map.onMapLoaded

  /**
   * Update visibility of GoDown and GoUp events based on underground state
   */
/**
   * Update visibility of GoDown, GoUp, and Chest events based on underground state
   */
function updateEventVisibility() {
  const procGenData = $gameSystem._procGenData;
  if (!procGenData) return;

  // Check if player is underground
  const isUnderground = procGenData.biomeLayerStack && procGenData.biomeLayerStack.length > 0;
  const chestNames = ["RandomItemChest", "RandomArmorChest", "RandomWeaponChest"];

  // Check if current biome is Ocean or Seabed (hide GoUp/GoDown events)
  const currentBiome = procGenData.currentBiome || "";
  const isWaterBiome = currentBiome === "Ocean" || currentBiome === "Seabed";

  for (const event of $gameMap._events) {
    if (!event || !$dataMap.events[event._eventId]) continue;

    const eventName = $dataMap.events[event._eventId].name;

    // Handle GoDown (Show Overground, Hide Underground or Water Biomes)
    if (eventName === "GoDown") {
      const shouldHide = isUnderground || isWaterBiome;
      event.setOpacity(shouldHide ? 0 : 255);
      // Also move off map if in water biome
      if (isWaterBiome && (event.x !== 0 || event.y !== 0)) {
        event.setPosition(0, 0);
      }
    }
    // Handle GoUp (Hide Overground, Show Underground, Hide in Water Biomes)
    else if (eventName === "GoUp") {
      const shouldShow = isUnderground && !isWaterBiome;
      event.setOpacity(shouldShow ? 255 : 0);
      // Also move off map if in water biome
      if (isWaterBiome && (event.x !== 0 || event.y !== 0)) {
        event.setPosition(0, 0);
      }
    }
    // Handle Chests (Hide Overground, Show Underground)
    else if (chestNames.includes(eventName)) {
      event.setOpacity(isUnderground ? 255 : 0);
    }
  }
}
  /**
   * Place the GoDown event at a seeded random position on the procedural map
   * If the tile is impassable, find the first passable tile nearby
   */
  function placeGoDownEvent() {
    const procGenData = $gameSystem._procGenData;
    if (!procGenData) return;

    // Check if current biome is Ocean or Seabed - hide GoDown in these biomes
    const currentBiome = procGenData.currentBiome || "";
    const isWaterBiome = currentBiome === "Ocean" || currentBiome === "Seabed";

    // Find the GoDown event
    let goDownEvent = null;
    for (const event of $gameMap._events) {
      if (event && $dataMap.events[event._eventId] && $dataMap.events[event._eventId].name === "GoDown") {
        goDownEvent = event;
        break;
      }
    }

    if (!goDownEvent) {
      console.warn(`[ProceduralMap] GoDown event not found on map ${$gameMap.mapId()}`);
      return;
    }

    // If in water biome, hide the event by moving it off map
    if (isWaterBiome) {
      goDownEvent.setPosition(0, 0);
      procGenData.goDownEventX = 0;
      procGenData.goDownEventY = 0;
      console.log(`[ProceduralMap] GoDown event hidden (water biome: ${currentBiome})`);
      return;
    }

    const worldX = procGenData.worldX || $gameVariables.value(43) || 0;
    const worldY = procGenData.worldY || $gameVariables.value(44) || 0;
    const seed = procGenData.currentSeed || 0;

    // Create seeded random function using world coordinates and current seed
    const seededRandom = ProcGenUtils.createSeededRandom(seed + worldX * 1000 + worldY);

    // Generate random position on 128x128 map
    let startX = Math.floor(seededRandom() * (PROC_MAP_WIDTH - 2)) + 1;
    let startY = Math.floor(seededRandom() * (PROC_MAP_HEIGHT - 2)) + 1;

    // Try to find passable tile: first check the selected position, then search nearby
    let finalX = startX;
    let finalY = startY;
    let found = false;

    // Check if starting position is passable
    if ($gameMap.isPassable(startX, startY, 2)) {
      found = true;
    } else {
      // Search in expanding squares around the initial position
      const maxRange = 10;
      outerLoop: for (let range = 1; range <= maxRange; range++) {
        for (let dx = -range; dx <= range; dx++) {
          for (let dy = -range; dy <= range; dy++) {
            // Only check the perimeter of the current square
            if (Math.abs(dx) !== range && Math.abs(dy) !== range) continue;

            const testX = startX + dx;
            const testY = startY + dy;

            // Bounds check
            if (testX < 0 || testX >= PROC_MAP_WIDTH || testY < 0 || testY >= PROC_MAP_HEIGHT) continue;

            if ($gameMap.isPassable(testX, testY, 2)) {
              finalX = testX;
              finalY = testY;
              found = true;
              break outerLoop;
            }
          }
        }
      }
    }

    // Move the GoDown event to the determined position
    goDownEvent.setPosition(finalX, finalY);

    // Store the GoDown event position for use when calling GoUp command
    procGenData.goDownEventX = finalX;
    procGenData.goDownEventY = finalY;

    console.log(`[ProceduralMap] GoDown event placed at (${finalX}, ${finalY}) - Found passable: ${found}`);
  }

  /**
   * Place the GoUp event - hide it when overground or in Ocean/Seabed biomes
   */
  function placeGoUpEvent() {
    const procGenData = $gameSystem._procGenData;
    if (!procGenData) return;

    // Check if player is underground
    const isUnderground = procGenData.biomeLayerStack && procGenData.biomeLayerStack.length > 0;

    // Check if current biome is Ocean or Seabed
    const currentBiome = procGenData.currentBiome || "";
    const isWaterBiome = currentBiome === "Ocean" || currentBiome === "Seabed";

    // Find the GoUp event
    let goUpEvent = null;
    for (const event of $gameMap._events) {
      if (event && $dataMap.events[event._eventId] && $dataMap.events[event._eventId].name === "GoUp") {
        goUpEvent = event;
        break;
      }
    }

    if (!goUpEvent) {
      // GoUp event doesn't exist (normal for surface maps)
      return;
    }

    // Hide GoUp when overground OR in water biomes
    if (!isUnderground || isWaterBiome) {
      goUpEvent.setPosition(0, 0);
      goUpEvent.setOpacity(0);
      console.log(`[ProceduralMap] GoUp event hidden (underground: ${isUnderground}, waterBiome: ${isWaterBiome})`);
    } else {
      // Show GoUp when underground and NOT in water biome
      // Position it near the player's entry point if available
      const playerX = $gamePlayer.x;
      const playerY = $gamePlayer.y;
      goUpEvent.setPosition(playerX, playerY);
      goUpEvent.setOpacity(255);
      console.log(`[ProceduralMap] GoUp event shown at (${playerX}, ${playerY})`);
    }
  }

  /**
   * Place Random Chests when underground, or move them out of bounds when overground.
   * Handles: RandomItemChest, RandomArmorChest, RandomWeaponChest
   */
  function placeChestEvents() {
    const procGenData = $gameSystem._procGenData;
    if (!procGenData) return;

    // Check if player is underground
    const isUnderground = procGenData.biomeLayerStack && procGenData.biomeLayerStack.length > 0;
    const chestNames = ["RandomItemChest", "RandomArmorChest", "RandomWeaponChest"];

    const worldX = procGenData.worldX || $gameVariables.value(43) || 0;
    const worldY = procGenData.worldY || $gameVariables.value(44) || 0;
    const seed = procGenData.currentSeed || 0;
    // Add layer depth to seed so chests move if you go deeper
    const layerDepth = procGenData.biomeLayerStack ? procGenData.biomeLayerStack.length : 0;

    // Iterate over all events to find the chests
    for (const event of $gameMap._events) {
      if (!event || !$dataMap.events[event._eventId]) continue;

      const eventName = $dataMap.events[event._eventId].name;

      if (chestNames.includes(eventName)) {
        if (!isUnderground) {
          // OVERGROUND: Move out of play (0,0) to prevent collision
          event.setPosition(0, 0);
        } else {
          // UNDERGROUND: Scatter randomly
          // Create a unique seed based on World Coords + Layer + EventID so it's deterministic but unique per chest
          const uniqueSeed = seed + (worldX * 1000) + (worldY * 100) + (layerDepth * 10) + event._eventId;
          const seededRandom = Utils2.createSeededRandom(uniqueSeed);

          let finalX = 0;
          let finalY = 0;
          let found = false;

          // Attempt to find a passable tile (try 15 times)
          for (let attempt = 0; attempt < 15; attempt++) {
             // Generate random position inside map bounds (padding of 2)
            const tryX = Math.floor(seededRandom() * (PROC_MAP_WIDTH - 4)) + 2;
            const tryY = Math.floor(seededRandom() * (PROC_MAP_HEIGHT - 4)) + 2;

            // Check passability and ensure we aren't spawning on top of the player
            if ($gameMap.isPassable(tryX, tryY, 2) && 
                (tryX !== $gamePlayer.x || tryY !== $gamePlayer.y) &&
                !$gameMap.eventsXy(tryX, tryY).length) { // Don't stack on other events
              finalX = tryX;
              finalY = tryY;
              found = true;
              break;
            }
          }

          // If valid spot found, place it. If not, dump it at 0,0 (hidden)
          if (found) {
            event.setPosition(finalX, finalY);
            // console.log(`[ProceduralMap] Placed ${eventName} at ${finalX}, ${finalY}`);
          } else {
            event.setPosition(0, 0);
          }
        }
      }
    }
  }
  /**
   * Hook into Scene_Map update to ensure tilemap is continuously refreshed
   */
  const _Scene_Map_updateTilemap = Scene_Map.prototype.updateTilemap;
  Scene_Map.prototype.updateTilemap = function () {
    _Scene_Map_updateTilemap.call(this);

    if (
      $gameMap.mapId() === PROC_MAP_ID &&
      this._tilemap &&
      $gameSystem._procGenData &&
      $gameSystem._procGenData.generatedMapData
    ) {
      if (!this._procGenMapRefreshScheduled) {
        this._tilemap._needsRender = true;
        this._procGenMapRefreshScheduled = true;
      }
    }
  };

  // ===== EXPORTS FOR OTHER PLUGINS =====
  window.generateProceduralTerrain = generateProceduralTerrain;
  window.shouldDisplayAsBeach = shouldDisplayAsBeach;
  window.shouldDisplayAsIsland = shouldDisplayAsIsland;
  window.getHardcodedBiomeOverride = getHardcodedBiomeOverride;
  window.placeGoDownEvent = placeGoDownEvent;
  window.placeGoUpEvent = placeGoUpEvent;
  window.placeChestEvents = placeChestEvents;
})();

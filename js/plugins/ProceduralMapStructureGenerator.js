/*:
 * @target MZ
 * @plugindesc Procedural dungeon biome generation using BSP algorithm
 * @author Omni-Lex
 *
 * @help
 * Procedural Map Dungeon Generator
 * =================================
 * Generates structured dungeon biomes using Binary Space Partition (BSP) algorithm
 * Creates interconnected rooms and corridors with multiple feature types:
 * - DungeonFloor (walkable areas)
 * - DungeonWall (impassable walls)
 * - DungeonCeiling (decorative ceiling)
 *
 * ALGORITHM: Binary Space Partition (BSP)
 * =======================================
 * 1. Starts with entire map as single space
 * 2. Recursively splits space horizontally/vertically
 * 3. Creates rooms within each partition
 * 4. Connects rooms with corridors
 * 5. Results in structured, connected dungeon layouts
 *
 * FEATURES USED:
 * - DungeonFloor: Walkable floor tiles
 * - DungeonWall: Impassable wall tiles
 * - DungeonCeiling: Overhead tiles/decoration
 *
 * Requires ProceduralMapUtils.js to be loaded first
 * Integrates with ProceduralMapBiomeGenerator.js for biome generation
 */

(() => {
  "use strict";

  const pluginName = "ProceduralMapStructureGenerator";

  // Import utilities from ProceduralMapUtils
  const Utils2 = window.ProcGenUtils;
  if (!Utils2) {
    console.error(
      "ProceduralMapStructureGenerator requires ProceduralMapUtils plugin"
    );
    return;
  }

  const {
    createSeededRandom,
    randomChoice,
    calculateIndex,
    generateDungeonWithBSP,
    PROC_MAP_WIDTH,
    PROC_MAP_HEIGHT,
  } = Utils2;

  // ===== DUNGEON FEATURE DETECTION =====

  /**
   * Determine which directions have water adjacent biomes
   * Returns object with north, south, east, west boolean flags
   */
  function getWaterDirections(adjacentBiomes) {
    if (!adjacentBiomes) {
      return { north: false, south: false, east: false, west: false };
    }

    const isWaterBiome = (biomeName) => {
      if (!biomeName) return false;
      const name = biomeName.toLowerCase();
      return name.includes("ocean") || name.includes("water") || name.includes("sea");
    };

    return {
      north: isWaterBiome(adjacentBiomes.north),
      south: isWaterBiome(adjacentBiomes.south),
      east: isWaterBiome(adjacentBiomes.east),
      west: isWaterBiome(adjacentBiomes.west)
    };
  }

  /**
   * Add full directional beach layout with water, sand, and seashells
   * where water biomes are adjacent
   */
  function addDirectionalBeach(mapData, width, height, adjacentBiomes, allFeatures, rng) {
    if (!adjacentBiomes) return;

    const waterDirs = getWaterDirections(adjacentBiomes);
    const beachTiles = getFeatureTiles("Beach", allFeatures);
    const waterTiles = getFeatureTiles("Water", allFeatures);
    const seashellTiles = getFeatureTiles("Seashell", allFeatures);

    if (!beachTiles || beachTiles.length === 0) return;

    const beachTile = beachTiles[0];
    const waterTile = waterTiles ? waterTiles[0] : beachTile;
    const maxEdgeDepth = 12; // Depth of water/beach gradient from edge
    const beachSandWidth = 4; // Width of sandy beach area

    // Helper to place seashells on a beach tile
    function placeSeashell(x, y) {
      if (seashellTiles && seashellTiles.length > 0 && rng() < 0.08) {
        const idx = calculateIndex(x, y, 1, width, height);
        if (idx >= 0 && idx < mapData.length) {
          mapData[idx] = seashellTiles[Math.floor(rng() * seashellTiles.length)];
        }
      }
    }

    // North edge (water from top, land below)
    if (waterDirs.north) {
      for (let x = 0; x < width; x++) {
        // Create natural variance in coastline depth
        const variance = Math.sin(x / 20) * 3 + Math.sin(x / 7) * 2;
        const coastlineDepth = Math.max(3, Math.floor(6 + variance));
        const actualDepth = Math.min(maxEdgeDepth, coastlineDepth);

        for (let y = 0; y < actualDepth; y++) {
          const idx = calculateIndex(x, y, 0, width, height);
          if (y < actualDepth - beachSandWidth) {
            // Water area
            mapData[idx] = waterTile;
          } else {
            // Beach sand area
            mapData[idx] = beachTile;
            placeSeashell(x, y);
          }
        }
      }
    }

    // South edge (water from bottom, land above)
    if (waterDirs.south) {
      for (let x = 0; x < width; x++) {
        const variance = Math.sin(x / 20 + 100) * 3 + Math.sin(x / 7 + 100) * 2;
        const coastlineDepth = Math.max(3, Math.floor(6 + variance));
        const actualDepth = Math.min(maxEdgeDepth, coastlineDepth);
        const startY = Math.max(0, height - actualDepth);

        for (let y = startY; y < height; y++) {
          const idx = calculateIndex(x, y, 0, width, height);
          if (y > height - actualDepth + beachSandWidth) {
            // Water area
            mapData[idx] = waterTile;
          } else {
            // Beach sand area
            mapData[idx] = beachTile;
            placeSeashell(x, y);
          }
        }
      }
    }

    // East edge (water from right, land left)
    if (waterDirs.east) {
      for (let y = 0; y < height; y++) {
        const variance = Math.sin(y / 20 + 200) * 3 + Math.sin(y / 7 + 200) * 2;
        const coastlineDepth = Math.max(3, Math.floor(6 + variance));
        const actualDepth = Math.min(maxEdgeDepth, coastlineDepth);
        const startX = Math.max(0, width - actualDepth);

        for (let x = startX; x < width; x++) {
          const idx = calculateIndex(x, y, 0, width, height);
          if (x > width - actualDepth + beachSandWidth) {
            // Water area
            mapData[idx] = waterTile;
          } else {
            // Beach sand area
            mapData[idx] = beachTile;
            placeSeashell(x, y);
          }
        }
      }
    }

    // West edge (water from left, land right)
    if (waterDirs.west) {
      for (let y = 0; y < height; y++) {
        const variance = Math.sin(y / 20 + 300) * 3 + Math.sin(y / 7 + 300) * 2;
        const coastlineDepth = Math.max(3, Math.floor(6 + variance));
        const actualDepth = Math.min(maxEdgeDepth, coastlineDepth);

        for (let x = 0; x < actualDepth; x++) {
          const idx = calculateIndex(x, y, 0, width, height);
          if (x < actualDepth - beachSandWidth) {
            // Water area
            mapData[idx] = waterTile;
          } else {
            // Beach sand area
            mapData[idx] = beachTile;
            placeSeashell(x, y);
          }
        }
      }
    }

    // Corners: blend where two water directions meet
    const hasNorth = waterDirs.north;
    const hasSouth = waterDirs.south;
    const hasEast = waterDirs.east;
    const hasWest = waterDirs.west;

    // Northeast corner
    if (hasNorth && hasEast) {
      const cornerSize = 8;
      for (let y = 0; y < cornerSize; y++) {
        const variance = Math.sin(y / 8) * 2;
        const depth = Math.max(2, Math.floor(4 + variance));
        const limit = Math.min(cornerSize, depth);
        for (let x = width - limit; x < width; x++) {
          const idx = calculateIndex(x, y, 0, width, height);
          if (y + (width - x) < 3) {
            mapData[idx] = waterTile;
          } else {
            mapData[idx] = beachTile;
            placeSeashell(x, y);
          }
        }
      }
    }

    // Northwest corner
    if (hasNorth && hasWest) {
      const cornerSize = 8;
      for (let y = 0; y < cornerSize; y++) {
        const variance = Math.sin(y / 8 + 50) * 2;
        const depth = Math.max(2, Math.floor(4 + variance));
        for (let x = 0; x < depth; x++) {
          const idx = calculateIndex(x, y, 0, width, height);
          if (y + x < 3) {
            mapData[idx] = waterTile;
          } else {
            mapData[idx] = beachTile;
            placeSeashell(x, y);
          }
        }
      }
    }

    // Southeast corner
    if (hasSouth && hasEast) {
      const cornerSize = 8;
      for (let y = height - cornerSize; y < height; y++) {
        const variance = Math.sin((height - y) / 8) * 2;
        const depth = Math.max(2, Math.floor(4 + variance));
        const limit = Math.min(cornerSize, depth);
        for (let x = width - limit; x < width; x++) {
          const idx = calculateIndex(x, y, 0, width, height);
          if ((height - y) + (width - x) < 3) {
            mapData[idx] = waterTile;
          } else {
            mapData[idx] = beachTile;
            placeSeashell(x, y);
          }
        }
      }
    }

    // Southwest corner
    if (hasSouth && hasWest) {
      const cornerSize = 8;
      for (let y = height - cornerSize; y < height; y++) {
        const variance = Math.sin((height - y) / 8 + 50) * 2;
        const depth = Math.max(2, Math.floor(4 + variance));
        for (let x = 0; x < depth; x++) {
          const idx = calculateIndex(x, y, 0, width, height);
          if ((height - y) + x < 3) {
            mapData[idx] = waterTile;
          } else {
            mapData[idx] = beachTile;
            placeSeashell(x, y);
          }
        }
      }
    }
  }

  /**
   * Check if biome is a dungeon biome
   */
  function isDungeonBiome(biomeName) {
    return (
      biomeName.toLowerCase() === "dungeon" ||
      biomeName.toLowerCase().startsWith("dungeon")||     
       biomeName.toLowerCase() === "crypt" ||
      biomeName.toLowerCase().startsWith("crypt")
    );
  }

  /**
   * Check if biome is a village biome
   */
  function isVillageBiome(biomeName) {
    return (
      biomeName.toLowerCase() === "village" ||
      biomeName.toLowerCase().startsWith("village")
    );
  }

  /**
   * Check if biome is a city biome
   */
  function isCityBiome(biomeName) {
    return (
      biomeName.toLowerCase() === "city" ||
      biomeName.toLowerCase().startsWith("city")
    );
  }

  function isBurgBiome(biomeName) {
    return (
      biomeName.toLowerCase() === "burg" ||
      biomeName.toLowerCase().startsWith("burg")
    );
  }

  // ===== DUNGEON FEATURE EXTRACTION =====

  /**
   * Get tiles for a specific feature from feature , ay
   * Extracts single-tile variants for features like DungeonFloor, DungeonWall, DungeonCeiling
   */
  function getFeatureTiles(featureName, allFeatures) {
    const tiles = [];
    if (allFeatures[featureName] && allFeatures[featureName].length > 0) {
      for (const variant of allFeatures[featureName]) {
        if (variant.type === "single" && variant.tileId) {
          tiles.push(variant.tileId);
        }
      }
    }
    return tiles.length > 0 ? tiles : null;
  }

  /**
   * Get random tile from feature tiles
   */
  function getRandomFeatureTile(tiles, rng) {
    if (!tiles || tiles.length === 0) return 0;
    return tiles[Math.floor(rng() * tiles.length)];
  }

  /**
   * Place 3-tile wide sidewalks around roads
   * Scans for road tiles and places sidewalk tiles 1-3 tiles away from roads
   * IMPORTANT: Does not overwrite Path/PathDesert/PathIce tiles
   */function placeSidewalksAroundRoads(mapData, width, height, roadSet, sidewalkTiles, rng, pathTileIds, baseTile) {
    if (!sidewalkTiles || sidewalkTiles.length === 0) return;

    const sidewalkTile = sidewalkTiles[0];
    const placedSidewalks = new Set();
    const pathTileSet = new Set(pathTileIds || []);

    for (const roadKey of roadSet) {
      const [rx, ry] = roadKey.split(',').map(Number);

      for (let dy = -3; dy <= 3; dy++) {
        for (let dx = -3; dx <= 3; dx++) {
          const sx = rx + dx;
          const sy = ry + dy;
          const sidewalkKey = `${sx},${sy}`;

          if (placedSidewalks.has(sidewalkKey) || roadSet.has(sidewalkKey)) continue;
          if (sx < 1 || sx >= width - 1 || sy < 1 || sy >= height - 1) continue;

          const dist = Math.max(Math.abs(dx), Math.abs(dy));

          if (dist >= 2 && dist <= 3) {
            const idx = calculateIndex(sx, sy, 0, width, height);
            const currentTile = mapData[idx];

            // 1. Never overwrite existing paths
            if (pathTileSet.has(currentTile)) continue;

            // 2. SAFETY CHECK: Only place sidewalk if the tile is Base Terrain or Empty.
            // If it is anything else (e.g., a prefab wall or floor), DO NOT TOUCH IT.
            // We treat 0 as valid to overwrite, and baseTile as valid.
            if (currentTile !== 0 && currentTile !== baseTile) continue;

            mapData[idx] = sidewalkTile;
            placedSidewalks.add(sidewalkKey);
          }
        }
      }
    }
  }

  // ===== DUNGEON GENERATION =====

  /**
   * Generate procedural dungeon biome using BSP algorithm
   * Uses DungeonFloor, DungeonWall, DungeonCeiling features
   * Supports optional feature placement and biome blending
   */
  function generateDungeonBiome(biome, seed, allFeatures, adjacentBiomes, allOtherData = {}) {
    const width = PROC_MAP_WIDTH;
    const height = PROC_MAP_HEIGHT;
    const rng = createSeededRandom(seed);

    // Get dungeon feature tiles
    const dungeonFloorTiles = getFeatureTiles("DungeonFloor", allFeatures);
    const dungeonWallTiles = getFeatureTiles("DungeonWall", allFeatures);
    const dungeonCeilingTiles = getFeatureTiles("DungeonCeiling", allFeatures);

    // Fallback tiles if features not found
    const floorTile = dungeonFloorTiles ? dungeonFloorTiles[0] : 2816;
    const wallTile = dungeonWallTiles ? dungeonWallTiles[0] : 1536;
    const ceilingTile = dungeonCeilingTiles ? dungeonCeilingTiles[0] : 2816;

    // BSP dungeon generation parameters
    const minRoomSize = 8;
    const maxRoomSize = 16;

    // Generate dungeon layout
    const mapData = generateDungeonWithBSP(width, height, width, seed, minRoomSize, maxRoomSize, floorTile, wallTile);

    // Place ceiling tiles randomly as decorative overlays in wall areas
    const ceilingPlacementChance = 0.15; // 15% chance to place ceiling tile in wall areas
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const idx = calculateIndex(x, y, 0, width, height);

        // If this is a wall tile and random chance succeeds, place ceiling
        if (mapData[idx] === wallTile && rng() < ceilingPlacementChance) {
          const ceilingIdx = calculateIndex(x, y, 1, width, height);
          mapData[ceilingIdx] = getRandomFeatureTile(dungeonCeilingTiles, rng);
        }
      }
    }

    // Add variety to floor tiles
    if (dungeonFloorTiles && dungeonFloorTiles.length > 1) {
      for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
          const idx = calculateIndex(x, y, 0, width, height);

          // If this is a floor tile, 30% chance to use alternate floor tile
          if (mapData[idx] === floorTile && rng() < 0.3) {
            mapData[idx] = getRandomFeatureTile(dungeonFloorTiles, rng);
          }
        }
      }
    }

    // Add variety to wall tiles
    if (dungeonWallTiles && dungeonWallTiles.length > 1) {
      for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
          const idx = calculateIndex(x, y, 0, width, height);

          // If this is a wall tile, 20% chance to use alternate wall tile
          if (mapData[idx] === wallTile && rng() < 0.2) {
            mapData[idx] = getRandomFeatureTile(dungeonWallTiles, rng);
          }
        }
      }
    }

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

    // Apply prefabs to the dungeon map if biome has prefabs defined
    if (biome && biome.prefabs && biome.prefabs.length > 0) {
      console.log(`[DungeonGenerator] Applying prefabs to dungeon biome: ${biome.name}`);

      // Get world coordinates from allOtherData if available
      const worldCoords = allOtherData?.worldCoords || { x: 0, y: 0 };

      // Call the prefab system to apply prefabs
      if (window.ProceduralMapPrefabs && window.ProceduralMapPrefabs.applyPrefabsToMap) {
        try {
          window.ProceduralMapPrefabs.applyPrefabsToMap(mapData, biome.name, worldCoords);
          console.log(`[DungeonGenerator] Prefabs applied successfully to ${biome.name}`);
        } catch (e) {
          console.warn(`[DungeonGenerator] Error applying prefabs to ${biome.name}: ${e.message}`);
        }
      } else {
        console.warn(`[DungeonGenerator] ProceduralMapPrefabs not available or applyPrefabsToMap not exported`);
      }
    }

    return mapData;
  }

  // ===== VILLAGE GENERATION =====


/**
   * Generate procedural village biome with prefabs placed near path features first.
   * Includes Lot proximity checks to prevent overlapping hints.
   */
function generateVillageBiome(biome, seed, allFeatures, adjacentBiomes, allOtherData = {}) {
    const width = PROC_MAP_WIDTH;
    const height = PROC_MAP_HEIGHT;
    const rng = createSeededRandom(seed);

    // 1. Initialize map with terrain
    const mapData = new Array(width * height * 4).fill(0);

    let baseTile = 0;
    if (biome && biome.features && biome.features.length > 0) {
      const terrainFeature = biome.features.find(f => f.terrain === true);
      if (terrainFeature && allFeatures[terrainFeature.name]) {
        const featureVariants = allFeatures[terrainFeature.name];
        for (const variant of featureVariants) {
          if (variant.type === "single") {
            baseTile = variant.tileId;
            break;
          }
        }
      }
    }

    for (let i = 0; i < width * height; i++) {
      mapData[i] = baseTile;
    }

    let pathFeatureName = "Path";
    if (biome.name === "VillageIce") pathFeatureName = "PathIce";
    else if (biome.name === "VillageDesert") pathFeatureName = "PathDesert";

    const pathTiles = getFeatureTiles(pathFeatureName, allFeatures);
    if (!pathTiles || pathTiles.length === 0) return mapData;
    const pathTile = pathTiles[0];

    const roadFeatureTiles = getFeatureTiles("Road", allFeatures);
    const cardinalRoadTile = roadFeatureTiles ? roadFeatureTiles[0] : pathTile;

    // --- STEP 0: Draw cardinal border roads ---
    const borderDirs = getCityBorderRoadDirections(adjacentBiomes);
    const hasCardinalRoads = borderDirs.north || borderDirs.south || borderDirs.east || borderDirs.west;
    const borderRoadOccupied = new Array(width * height).fill(false);

    if (hasCardinalRoads) {
      const dashedLineTiles = getFeatureTiles("DashedLine", allFeatures);
      const dashedLineTile = dashedLineTiles ? dashedLineTiles[0] : null;

      applyBorderRoadConnections(mapData, width, height, adjacentBiomes, cardinalRoadTile, dashedLineTile);

      // ... (Border road marking logic kept identical to previous version) ...
      const centerX = Math.floor(width / 2);
      const centerY = Math.floor(height / 2);
      const borderRoadWidth = 7;
      const borderHalfRoad = Math.floor(borderRoadWidth / 2);
      if (borderDirs.north) { for (let y = 0; y <= centerY; y++) { for (let x = centerX - borderHalfRoad; x < centerX - borderHalfRoad + borderRoadWidth; x++) { if (x>=0 && x<width) borderRoadOccupied[y * width + x] = true; } } }
      if (borderDirs.south) { for (let y = centerY; y < height; y++) { for (let x = centerX - borderHalfRoad; x < centerX - borderHalfRoad + borderRoadWidth; x++) { if (x>=0 && x<width) borderRoadOccupied[y * width + x] = true; } } }
      if (borderDirs.east) { for (let x = centerX; x < width; x++) { for (let y = centerY - borderHalfRoad; y < centerY - borderHalfRoad + borderRoadWidth; y++) { if (y>=0 && y<height) borderRoadOccupied[y * width + x] = true; } } }
      if (borderDirs.west) { for (let x = 0; x <= centerX; x++) { for (let y = centerY - borderHalfRoad; y < centerY - borderHalfRoad + borderRoadWidth; y++) { if (y>=0 && y<height) borderRoadOccupied[y * width + x] = true; } } }
    }

    // --- STEP 1: Scatter path seeds ---
    const pathSeeds = [];
    const roadSet = new Set();
    if (hasCardinalRoads) {
      for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
          if (borderRoadOccupied[y * width + x]) roadSet.add(`${x},${y}`);
        }
      }
    }

    const pathSeedCount = 4 + Math.floor(rng() * 5);
    for (let i = 0; i < pathSeedCount; i++) {
      const x = 10 + Math.floor(rng() * (width - 20));
      const y = 10 + Math.floor(rng() * (height - 20));
      const idx = calculateIndex(x, y, 0, width, height);
      mapData[idx] = pathTile;
      pathSeeds.push({ x, y });
    }

    // --- STEP 2: Identify prefab placement locations ---
    const prefabLots = [];
    for (const seed of pathSeeds) {
      const lotsPerSeed = 1 + Math.floor(rng() * 2);
      for (let i = 0; i < lotsPerSeed; i++) {
        const distance = 8 + Math.floor(rng() * 11);
        const angle = rng() * Math.PI * 2;
        const lotX = Math.floor(seed.x + Math.cos(angle) * distance);
        const lotY = Math.floor(seed.y + Math.sin(angle) * distance);

        if (lotX >= 2 && lotX < width - 2 && lotY >= 2 && lotY < height - 2) {
           // Strict distance check to prevent hint overlap
           let isTooClose = false;
           for (const existingLot of prefabLots) {
             const dist = Math.abs(existingLot.x - lotX) + Math.abs(existingLot.y - lotY);
             if (dist < 14) { isTooClose = true; break; }
           }
           if (!isTooClose) prefabLots.push({ x: lotX, y: lotY, dist: 1 });
        }
      }
    }

    const validPrefabLots = prefabLots.filter(lot => {
      const checkRadius = 4;
      for (let dy = -checkRadius; dy <= checkRadius; dy++) {
        for (let dx = -checkRadius; dx <= checkRadius; dx++) {
          const checkX = lot.x + dx;
          const checkY = lot.y + dy;
          if (checkX >= 0 && checkX < width && checkY >= 0 && checkY < height) {
            if (borderRoadOccupied[checkY * width + checkX]) return false;
          }
        }
      }
      return true;
    });

    // --- STEP 3: Apply prefabs ---
    // Prefabs are placed NOW. Any code after this must respect the tiles they placed.
    allOtherData.placementHints = validPrefabLots;
    if (biome && biome.prefabs && biome.prefabs.length > 0) {
      const worldCoords = allOtherData?.worldCoords || { x: 0, y: 0 };
      if (window.ProceduralMapPrefabs && window.ProceduralMapPrefabs.applyPrefabsToMap) {
        try {
          window.ProceduralMapPrefabs.applyPrefabsToMap(mapData, biome.name, worldCoords, allOtherData);
        } catch (e) { console.warn(e); }
      }
    }

    // --- STEP 4: Draw connecting roads ---
    // Add existing paths to roadSet
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const idx = calculateIndex(x, y, 0, width, height);
        if (mapData[idx] === pathTile && !borderRoadOccupied[y * width + x]) {
          roadSet.add(`${x},${y}`);
        }
      }
    }

    /**
     * UPDATED SETROAD: Checks if target tile is valid terrain before writing.
     * Prevents roads from cutting through Prefab walls/floors.
     */
    function setRoad(x, y) {
      if (x < 1 || x >= width - 1 || y < 1 || y >= height - 1) return;
      if (borderRoadOccupied[y * width + x]) return;
      
      const idx = calculateIndex(x, y, 0, width, height);
      const currentTile = mapData[idx];

      // PROTECTION CHECK:
      // If the tile is occupied by something that is NOT base terrain, 
      // NOT an existing path, and NOT empty (0), it is a Prefab. 
      // Do not overwrite it.
      if (currentTile !== baseTile && currentTile !== 0 && currentTile !== pathTile) {
          return; 
      }

      mapData[idx] = pathTile;
      roadSet.add(`${x},${y}`);
    }

    function drawBrush(cx, cy, radius = 1) {
      for (let y = cy - radius; y <= cy + radius; y++) {
        for (let x = cx - radius; x <= cx + radius; x++) {
          if (Math.abs(x - cx) + Math.abs(y - cy) <= radius + 0.5) {
            setRoad(x, y);
          }
        }
      }
    }

    function drawOrganicPath(x1, y1, x2, y2, brushSize = 1) {
      let cx = x1, cy = y1;
      while (Math.abs(cx - x2) > 2 || Math.abs(cy - y2) > 2) {
        const dx = x2 - cx, dy = y2 - cy;
        const dist = Math.sqrt(dx * dx + dy * dy);
        let vx = dx / dist, vy = dy / dist;
        if (rng() < 0.3) { vx += (rng() - 0.5) * 0.6; vy += (rng() - 0.5) * 0.6; }
        cx += vx; cy += vy;
        drawBrush(Math.floor(cx), Math.floor(cy), brushSize);
      }
      return { x: Math.floor(cx), y: Math.floor(cy) };
    }

    // Connect seeds
    for (let i = 0; i < pathSeeds.length - 1; i++) {
      drawOrganicPath(pathSeeds[i].x, pathSeeds[i].y, pathSeeds[i+1].x, pathSeeds[i+1].y, 1);
    }
    // Extra loops
    const extraConnections = Math.max(1, Math.floor(pathSeeds.length / 5));
    for (let i = 0; i < extraConnections; i++) {
      const idx1 = Math.floor(rng() * pathSeeds.length);
      const idx2 = Math.floor(rng() * pathSeeds.length);
      if (idx1 !== idx2) drawOrganicPath(pathSeeds[idx1].x, pathSeeds[idx1].y, pathSeeds[idx2].x, pathSeeds[idx2].y, 0);
    }
    // Connect lots
    for (const lot of validPrefabLots) {
      let nearestSeed = pathSeeds[0], minDist = Infinity;
      for (const seed of pathSeeds) {
        const dist = Math.sqrt((lot.x - seed.x) ** 2 + (lot.y - seed.y) ** 2);
        if (dist < minDist) { minDist = dist; nearestSeed = seed; }
      }
      if (minDist > 12 && minDist < 40) drawOrganicPath(lot.x, lot.y, nearestSeed.x, nearestSeed.y, 0);
    }

    // --- Sidewalks ---
    // UPDATED Call: Passes baseTile to ensure sidewalks don't overwrite prefabs
    const sidewalkTiles = getFeatureTiles(pathFeatureName, allFeatures);
    if (sidewalkTiles) {
      const tilesToProtect = [...pathTiles];
      if (hasCardinalRoads && cardinalRoadTile !== pathTile) tilesToProtect.push(cardinalRoadTile);
      // Pass baseTile as the last argument
      placeSidewalksAroundRoads(mapData, width, height, roadSet, sidewalkTiles, rng, tilesToProtect, baseTile);
    }

    addDirectionalBeach(mapData, width, height, adjacentBiomes, allFeatures, rng);
    
    // Region Data
    const regiondata = new Array(width * height).fill(0);
    let waterTileIds = new Set();
    ["Water", "Ocean", "Beach"].forEach(f => {
      if(allFeatures[f]) allFeatures[f].forEach(v => {if(v.type==='single') waterTileIds.add(v.tileId)});
    });
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        if (waterTileIds.has(mapData[calculateIndex(x, y, 0, width, height)])) regiondata[y * width + x] = 99;
      }
    }
    mapData.regiondata = regiondata;

    return mapData;
  }

  // ===== CITY BORDER ROAD CONNECTIONS =====

  /**
   * Draw a single cardinal road from the center of a city/burg to its border
   * This road is drawn down the center to snap with drawHighwayExitIntersection roads
   * @param {Array} mapData - Map tile data
   * @param {number} centerX - Center X coordinate
   * @param {number} centerY - Center Y coordinate
   * @param {string} direction - Direction to draw ("north", "south", "east", "west")
   * @param {number} roadTile - Road tile ID
   * @param {number} dashedLineTile - Dashed line tile ID
   * @param {number} width - Map width
   * @param {number} height - Map height
   */
  function drawBorderConnectionRoad(mapData, centerX, centerY, direction, roadTile, dashedLineTile, width, height) {
    const roadWidth = 7;  // Single 7-tile wide road centered on border
    const halfRoad = Math.floor(roadWidth / 2);
    const DASH_LENGTH = 3;
    const DASH_GAP = 1;
    const DASH_CYCLE = DASH_LENGTH + DASH_GAP;

    if (direction === "north") {
      // Draw single vertical road from center upward to north edge
      const startX = centerX - halfRoad;
      const endX = startX + roadWidth;
      const centerLineX = centerX;

      for (let y = 0; y <= centerY; y++) {
        // Draw road
        for (let x = startX; x < endX; x++) {
          if (x >= 0 && x < width) {
            const idx = calculateIndex(x, y, 0, width, height);
            mapData[idx] = roadTile;
          }
        }
        // Draw dashed center line
        if (dashedLineTile) {
          const cyclePos = y % DASH_CYCLE;
          if (cyclePos < DASH_LENGTH) {
            const idx = calculateIndex(centerLineX, y, 1, width, height);
            mapData[idx] = dashedLineTile;
          }
        }
      }
    } else if (direction === "south") {
      // Draw single vertical road from center downward to south edge
      const startX = centerX - halfRoad;
      const endX = startX + roadWidth;
      const centerLineX = centerX;

      for (let y = centerY; y < height; y++) {
        // Draw road
        for (let x = startX; x < endX; x++) {
          if (x >= 0 && x < width) {
            const idx = calculateIndex(x, y, 0, width, height);
            mapData[idx] = roadTile;
          }
        }
        // Draw dashed center line
        if (dashedLineTile) {
          const cyclePos = (y - centerY) % DASH_CYCLE;
          if (cyclePos < DASH_LENGTH) {
            const idx = calculateIndex(centerLineX, y, 1, width, height);
            mapData[idx] = dashedLineTile;
          }
        }
      }
    } else if (direction === "east") {
      // Draw single horizontal road from center rightward to east edge
      const startY = centerY - halfRoad;
      const endY = startY + roadWidth;
      const centerLineY = centerY;

      for (let x = centerX; x < width; x++) {
        // Draw road
        for (let y = startY; y < endY; y++) {
          if (y >= 0 && y < height) {
            const idx = calculateIndex(x, y, 0, width, height);
            mapData[idx] = roadTile;
          }
        }
        // Draw dashed center line
        if (dashedLineTile) {
          const cyclePos = (x - centerX) % DASH_CYCLE;
          if (cyclePos < DASH_LENGTH) {
            const idx = calculateIndex(x, centerLineY, 1, width, height);
            mapData[idx] = dashedLineTile;
          }
        }
      }
    } else if (direction === "west") {
      // Draw single horizontal road from center leftward to west edge
      const startY = centerY - halfRoad;
      const endY = startY + roadWidth;
      const centerLineY = centerY;

      for (let x = 0; x <= centerX; x++) {
        // Draw road
        for (let y = startY; y < endY; y++) {
          if (y >= 0 && y < height) {
            const idx = calculateIndex(x, y, 0, width, height);
            mapData[idx] = roadTile;
          }
        }
        // Draw dashed center line
        if (dashedLineTile) {
          const cyclePos = (centerX - x) % DASH_CYCLE;
          if (cyclePos < DASH_LENGTH) {
            const idx = calculateIndex(x, centerLineY, 1, width, height);
            mapData[idx] = dashedLineTile;
          }
        }
      }
    }
  }

  /**
   * Determine which directions have adjacent city/burg/road/village biomes
   * Returns object with directions that should have connecting roads
   */
  function getCityBorderRoadDirections(adjacentBiomes) {
    if (!adjacentBiomes) {
      return { north: false, south: false, east: false, west: false };
    }

    const isConnectableBiome = (biomeName) => {
      if (!biomeName) return false;
      const name = biomeName.toLowerCase();
      return (
        name.includes("city") ||
        name.includes("burg") ||
        name.includes("road") ||
        name.includes("highway") ||
        name.includes("village")
      );
    };

    return {
      north: isConnectableBiome(adjacentBiomes.north),
      south: isConnectableBiome(adjacentBiomes.south),
      east: isConnectableBiome(adjacentBiomes.east),
      west: isConnectableBiome(adjacentBiomes.west)
    };
  }

  /**
   * Apply border road connections to city/burg map
   * Draws roads from center to edges where adjacent cities/burgs/roads exist
   * Uses dual road style with dashed center lines matching city streets
   */
  function applyBorderRoadConnections(mapData, width, height, adjacentBiomes, roadTile, dashedLineTile) {
    const centerX = Math.floor(width / 2);
    const centerY = Math.floor(height / 2);
    const borderDirs = getCityBorderRoadDirections(adjacentBiomes);

    if (borderDirs.north) {
      drawBorderConnectionRoad(mapData, centerX, centerY, "north", roadTile, dashedLineTile, width, height);
    }
    if (borderDirs.south) {
      drawBorderConnectionRoad(mapData, centerX, centerY, "south", roadTile, dashedLineTile, width, height);
    }
    if (borderDirs.east) {
      drawBorderConnectionRoad(mapData, centerX, centerY, "east", roadTile, dashedLineTile, width, height);
    }
    if (borderDirs.west) {
      drawBorderConnectionRoad(mapData, centerX, centerY, "west", roadTile, dashedLineTile, width, height);
    }

    console.log(
      `[BorderRoads] Applied connections - N:${borderDirs.north} S:${borderDirs.south} E:${borderDirs.east} W:${borderDirs.west}`
    );
  }

  /**
   * Generate internal roads sprouting from cardinal border roads
   * Creates secondary roads that branch from the main cardinal roads
   * @param {Array} mapData - Map tile data
   * @param {number} width - Map width
   * @param {number} height - Map height
   * @param {Object} borderDirs - Border directions with boolean values (north, south, east, west)
   * @param {number} roadTile - Road tile ID
   * @param {number} dashedLineTile - Dashed line tile ID (for center lines)
   * @param {Array} occupiedMap - Occupied map tracking array
   * @param {Function} rng - Seeded random function
   */
  function generateInternalRoadsFromBorders(mapData, width, height, borderDirs, roadTile, dashedLineTile, occupiedMap, rng) {
    const centerX = Math.floor(width / 2);
    const centerY = Math.floor(height / 2);
    const roadWidth = 3;  // Thinner roads for internal branching
    const halfRoad = Math.floor(roadWidth / 2);
    const DASH_LENGTH = 3;
    const DASH_GAP = 1;
    const DASH_CYCLE = DASH_LENGTH + DASH_GAP;

    /**
     * Draw a single road tile and mark it as occupied
     */
    function setRoad(x, y) {
      if (x >= 0 && x < width && y >= 0 && y < height) {
        const idx = calculateIndex(x, y, 0, width, height);
        mapData[idx] = roadTile;
        occupiedMap[y * width + x] = 1;
      }
    }

    /**
     * Draw an internal branching road from a cardinal road
     * Draws perpendicular roads from cardinal directions with some organic sway
     */
    function drawBranchingRoad(startX, startY, dirX, dirY, maxLength) {
      let x = startX;
      let y = startY;

      for (let step = 0; step < maxLength; step++) {
        // Draw road tile
        for (let dy = -halfRoad; dy <= halfRoad; dy++) {
          for (let dx = -halfRoad; dx <= halfRoad; dx++) {
            setRoad(Math.floor(x) + dx, Math.floor(y) + dy);
          }
        }

        // Draw dashed center line
        if (dashedLineTile && step % DASH_CYCLE < DASH_LENGTH) {
          const centerIdx = calculateIndex(Math.floor(x), Math.floor(y), 1, width, height);
          if (centerIdx >= 0 && centerIdx < mapData.length) {
            mapData[centerIdx] = dashedLineTile;
          }
        }

        // Move in direction with slight organic sway
        x += dirX;
        y += dirY;

        // Add occasional sway for organic look (20% chance)
        if (rng() < 0.2) {
          x += (rng() - 0.5) * 0.5;
          y += (rng() - 0.5) * 0.5;
        }
      }
    }

    // Generate branching roads from each cardinal direction
    // These branch perpendicular to the cardinal roads
    // Spaced far apart to leave room for prefabs

    if (borderDirs.north) {
      // North border road is vertical; create horizontal branches going east/west
      const branchCount = 1 + Math.floor(rng() * 2); // 1-2 branches
      for (let i = 0; i < branchCount; i++) {
        // Branches spawn at different Y positions, well-spaced from each other
        const branchY = Math.floor(centerY * 0.2 + (i + 0.5) * (centerY * 0.3));
        const maxBranchLen = Math.floor(centerX * 0.25); // Shorter branches

        // Branch east (70% chance)
        if (rng() < 0.7) {
          drawBranchingRoad(centerX + 5, branchY, 1, 0, maxBranchLen);
        }
        // Branch west (70% chance)
        if (rng() < 0.7) {
          drawBranchingRoad(centerX - 5, branchY, -1, 0, maxBranchLen);
        }
      }
    }

    if (borderDirs.south) {
      // South border road is vertical; create horizontal branches going east/west
      const branchCount = 1 + Math.floor(rng() * 2); // 1-2 branches
      for (let i = 0; i < branchCount; i++) {
        // Branches spawn at different Y positions, well-spaced from each other
        const branchY = Math.floor(centerY + centerY * 0.2 + (i + 0.5) * (centerY * 0.3));
        const maxBranchLen = Math.floor(centerX * 0.25); // Shorter branches

        // Branch east (70% chance)
        if (rng() < 0.7) {
          drawBranchingRoad(centerX + 5, branchY, 1, 0, maxBranchLen);
        }
        // Branch west (70% chance)
        if (rng() < 0.7) {
          drawBranchingRoad(centerX - 5, branchY, -1, 0, maxBranchLen);
        }
      }
    }

    if (borderDirs.east) {
      // East border road is horizontal; create vertical branches going north/south
      const branchCount = 1 + Math.floor(rng() * 2); // 1-2 branches
      for (let i = 0; i < branchCount; i++) {
        // Branches spawn at different X positions, well-spaced from each other
        const branchX = Math.floor(centerX + centerX * 0.2 + (i + 0.5) * (centerX * 0.3));
        const maxBranchLen = Math.floor(centerY * 0.25); // Shorter branches

        // Branch north (70% chance)
        if (rng() < 0.7) {
          drawBranchingRoad(branchX, centerY - 5, 0, -1, maxBranchLen);
        }
        // Branch south (70% chance)
        if (rng() < 0.7) {
          drawBranchingRoad(branchX, centerY + 5, 0, 1, maxBranchLen);
        }
      }
    }

    if (borderDirs.west) {
      // West border road is horizontal; create vertical branches going north/south
      const branchCount = 1 + Math.floor(rng() * 2); // 1-2 branches
      for (let i = 0; i < branchCount; i++) {
        // Branches spawn at different X positions, well-spaced from each other
        const branchX = Math.floor(centerX * 0.2 + (i + 0.5) * (centerX * 0.3));
        const maxBranchLen = Math.floor(centerY * 0.25); // Shorter branches

        // Branch north (70% chance)
        if (rng() < 0.7) {
          drawBranchingRoad(branchX, centerY - 5, 0, -1, maxBranchLen);
        }
        // Branch south (70% chance)
        if (rng() < 0.7) {
          drawBranchingRoad(branchX, centerY + 5, 0, 1, maxBranchLen);
        }
      }
    }

    console.log("[InternalRoads] Internal branching roads generated from cardinal borders");
  }

  // ===== CITY GENERATION =====

  /**
   * Generate procedural city biome with grid-based roads matching RoadGenerator style.
   * Uses wider areas with fewer grid blocks.
   * Draws dual roads (7-tile wide with 3-tile separation) with dashed center lines.
   * Places prefabs in building lots within grid blocks.
   *//**
   * Generate procedural city biome with grid-based roads matching RoadGenerator style.
   * Uses wider areas with fewer grid blocks.
   * Draws dual roads (7-tile wide with 3-tile separation) with dashed center lines.
   * Places prefabs in building lots within grid blocks.
   */
  function generateCityBiome(biome, seed, allFeatures, adjacentBiomes, allOtherData = {}) {
    const width = PROC_MAP_WIDTH;
    const height = PROC_MAP_HEIGHT;
    const rng = createSeededRandom(seed);

    // 1. Initialize map with base terrain
    const mapData = new Array(width * height * 4).fill(0);

    // Get the terrain feature from the biome definition
    let baseTile = 0;
    if (biome && biome.features && biome.features.length > 0) {
      // Find the first terrain feature in the biome
      const terrainFeature = biome.features.find(f => f.terrain === true);
      if (terrainFeature && allFeatures[terrainFeature.name]) {
        // Get the first tile variant of this terrain feature
        const featureVariants = allFeatures[terrainFeature.name];
        for (const variant of featureVariants) {
          if (variant.type === "single") {
            baseTile = variant.tileId;
            break;
          }
        }
      }
    }

    // Fill entire map with base terrain
    for (let i = 0; i < width * height; i++) {
      mapData[i] = baseTile;
    }

    // Get Road Tiles
    const roadTiles = getFeatureTiles("Road", allFeatures);
    const dashedLineTiles = getFeatureTiles("DashedLine", allFeatures);
    if (!roadTiles || roadTiles.length === 0) return mapData;

    const roadTile = roadTiles[0];
    const dashedLineTile = dashedLineTiles ? dashedLineTiles[0] : roadTile;

    // --- Road Configuration (matching RoadGenerator style) ---
    const normalRoadWidth = 7;  // Matches ProceduralMapRoadGenerator
    const thinRoadWidth = 3;    // Thinner road variant
    const separation = 3;       // Separation between dual roads
    const DASH_LENGTH = 3;      // Dashes: 3 on, 1 off pattern
    const DASH_GAP = 1;
    const DASH_CYCLE = DASH_LENGTH + DASH_GAP;

    // Track occupied areas for building placement and border roads
    // DEFINED HERE
    const occupiedMap = new Array(width * height).fill(0); 
    const borderRoadOccupied = new Array(width * height).fill(false);
    const zoningBlocks = [];

    // --- STEP 0: Draw border roads FIRST, mark them as occupied ---
    applyBorderRoadConnections(mapData, width, height, adjacentBiomes, roadTile, dashedLineTile);

    // Mark all border road tiles as occupied to prevent grid roads from overlapping
    const centerX = Math.floor(width / 2);
    const centerY = Math.floor(height / 2);
    const borderDirs = getCityBorderRoadDirections(adjacentBiomes);
    const borderRoadWidth = 7; // Single road width
    const borderHalfRoad = Math.floor(borderRoadWidth / 2);

    // Mark border road tiles (single centered road only)
    if (borderDirs.north) {
      const startX = centerX - borderHalfRoad;
      const endX = startX + borderRoadWidth;
      for (let y = 0; y <= centerY; y++) {
        for (let x = startX; x < endX; x++) {
          if (x >= 0 && x < width && y >= 0 && y < height) {
            borderRoadOccupied[y * width + x] = true;
            occupiedMap[y * width + x] = 1;
          }
        }
      }
    }
    if (borderDirs.south) {
      const startX = centerX - borderHalfRoad;
      const endX = startX + borderRoadWidth;
      for (let y = centerY; y < height; y++) {
        for (let x = startX; x < endX; x++) {
          if (x >= 0 && x < width && y >= 0 && y < height) {
            borderRoadOccupied[y * width + x] = true;
            occupiedMap[y * width + x] = 1;
          }
        }
      }
    }
    if (borderDirs.east) {
      const startY = centerY - borderHalfRoad;
      const endY = startY + borderRoadWidth;
      for (let x = centerX; x < width; x++) {
        for (let y = startY; y < endY; y++) {
          if (x >= 0 && x < width && y >= 0 && y < height) {
            borderRoadOccupied[y * width + x] = true;
            occupiedMap[y * width + x] = 1;
          }
        }
      }
    }
    if (borderDirs.west) {
      const startY = centerY - borderHalfRoad;
      const endY = startY + borderRoadWidth;
      for (let x = 0; x <= centerX; x++) {
        for (let y = startY; y < endY; y++) {
          if (x >= 0 && x < width && y >= 0 && y < height) {
            borderRoadOccupied[y * width + x] = true;
            occupiedMap[y * width + x] = 1;
          }
        }
      }
    }

    console.log("[CityGenerator] Border roads marked as occupied");

    // --- STEP 0.5: Generate internal roads sprouting from border roads ---
    generateInternalRoadsFromBorders(mapData, width, height, borderDirs, roadTile, dashedLineTile, occupiedMap, rng);

    // --- Road Configuration (matching RoadGenerator style) ---
    // Fewer, larger blocks (50-66 tiles for less density)
    const minBlockSize = 80;
    const maxBlockSize = 90;
    const maxRoadWidth = normalRoadWidth; // Use max width for block calculations to ensure proper spacing

    // --- Step A: Grid-based road layout with wider blocks, avoiding border roads ---

    const border = 12;  // Increased border spacing to keep grid away from edges
    let blockQueue = [{ x: border, y: border, w: width - border*2, h: height - border*2 }];
    const roadsToDraw = [];

    while (blockQueue.length > 0) {
      const block = blockQueue.shift();

      // Check if block overlaps with border roads - skip if it does
      let overlapsBorderRoad = false;
      for (let y = block.y; y < block.y + block.h && !overlapsBorderRoad; y++) {
        for (let x = block.x; x < block.x + block.w && !overlapsBorderRoad; x++) {
          if (borderRoadOccupied[y * width + x]) {
            overlapsBorderRoad = true;
          }
        }
      }

      if (overlapsBorderRoad) {
        continue;
      }

      let splitVert = false;
      let splitHorz = false;

      // Force split if too big
      if (block.w > maxBlockSize) splitVert = true;
      if (block.h > maxBlockSize) splitHorz = true;

      // Random split if big enough
      if (!splitVert && !splitHorz) {
        if (block.w > minBlockSize * 2 && block.h > minBlockSize * 2) {
          if (rng() < 0.5) splitVert = true; else splitHorz = true;
        } else if (block.w > minBlockSize * 2) splitVert = true;
        else if (block.h > minBlockSize * 2) splitHorz = true;
      }

      if (splitVert) {
        const splitRange = block.w - (minBlockSize * 2) - maxRoadWidth;
        const splitOffset = Math.floor(rng() * splitRange);
        const splitX = block.x + minBlockSize + splitOffset;

        // Check if vertical road would overlap border road
        let roadOverlapsBorder = false;
        for (let y = block.y; y < block.y + block.h; y++) {
          for (let x = splitX; x < splitX + maxRoadWidth; x++) {
            if (borderRoadOccupied[y * width + x]) {
              roadOverlapsBorder = true;
              break;
            }
          }
          if (roadOverlapsBorder) break;
        }

        if (!roadOverlapsBorder) {
          roadsToDraw.push({ x: splitX, y: block.y, len: block.h, type: 'vert' });
          blockQueue.push({ x: block.x, y: block.y, w: splitX - block.x, h: block.h });
          blockQueue.push({ x: splitX + maxRoadWidth, y: block.y, w: (block.x + block.w) - (splitX + maxRoadWidth), h: block.h });
        } else {
          zoningBlocks.push(block);
        }
      } else if (splitHorz) {
        const splitRange = block.h - (minBlockSize * 2) - maxRoadWidth;
        const splitOffset = Math.floor(rng() * splitRange);
        const splitY = block.y + minBlockSize + splitOffset;

        // Check if horizontal road would overlap border road
        let roadOverlapsBorder = false;
        for (let x = block.x; x < block.x + block.w; x++) {
          for (let y = splitY; y < splitY + maxRoadWidth; y++) {
            if (borderRoadOccupied[y * width + x]) {
              roadOverlapsBorder = true;
              break;
            }
          }
          if (roadOverlapsBorder) break;
        }

        if (!roadOverlapsBorder) {
          roadsToDraw.push({ x: block.x, y: splitY, len: block.w, type: 'horz' });
          blockQueue.push({ x: block.x, y: block.y, w: block.w, h: splitY - block.y });
          blockQueue.push({ x: block.x, y: splitY + maxRoadWidth, w: block.w, h: (block.y + block.h) - (splitY + maxRoadWidth) });
        } else {
          zoningBlocks.push(block);
        }
      } else {
        zoningBlocks.push(block);
      }
    }

    // --- Step B: Draw dual roads with dashed center lines (RoadGenerator style) ---

    function markOccupied(mx, my) {
      if (mx >= 0 && mx < width && my >= 0 && my < height) {
        occupiedMap[my * width + mx] = 1;
      }
    }

    function drawRoadRect(rx, ry, rw, rh) {
      for (let y = ry; y < ry + rh && y < height; y++) {
        for (let x = rx; x < rx + rw && x < width; x++) {
          if (x >= 0 && y >= 0) {
            const idx = calculateIndex(x, y, 0, width, height);
            mapData[idx] = roadTile;
            markOccupied(x, y);
          }
        }
      }
    }

    function drawDualVerticalRoads(rx, startY, len) {
      const roadWidth = rng() < 0.7 ? normalRoadWidth : thinRoadWidth;
      const halfRoad = Math.floor(roadWidth / 2);
      const leftRoadX = rx - halfRoad - roadWidth - separation;
      const rightRoadX = rx + halfRoad + separation;

      // Left and right roads
      drawRoadRect(leftRoadX, startY, roadWidth, len);
      drawRoadRect(rightRoadX, startY, roadWidth, len);

      // Dashed center lines
      const leftCenterX = leftRoadX + halfRoad;
      const rightCenterX = rightRoadX + halfRoad;
      for (let y = startY; y < startY + len && y < height; y++) {
        const cyclePos = y % DASH_CYCLE;
        if (cyclePos < DASH_LENGTH) {
          const idx1 = calculateIndex(leftCenterX, y, 1, width, height);
          const idx2 = calculateIndex(rightCenterX, y, 1, width, height);
          mapData[idx1] = dashedLineTile;
          mapData[idx2] = dashedLineTile;
        }
      }
    }

    function drawDualHorizontalRoads(startX, ry, len) {
      const roadWidth = rng() < 0.7 ? normalRoadWidth : thinRoadWidth;
      const halfRoad = Math.floor(roadWidth / 2);
      const topRoadY = ry - halfRoad - roadWidth - separation;
      const bottomRoadY = ry + halfRoad + separation;

      // Top and bottom roads
      drawRoadRect(startX, topRoadY, len, roadWidth);
      drawRoadRect(startX, bottomRoadY, len, roadWidth);

      // Dashed center lines
      const topCenterY = topRoadY + halfRoad;
      const bottomCenterY = bottomRoadY + halfRoad;
      for (let x = startX; x < startX + len && x < width; x++) {
        const cyclePos = x % DASH_CYCLE;
        if (cyclePos < DASH_LENGTH) {
          const idx1 = calculateIndex(x, topCenterY, 1, width, height);
          const idx2 = calculateIndex(x, bottomCenterY, 1, width, height);
          mapData[idx1] = dashedLineTile;
          mapData[idx2] = dashedLineTile;
        }
      }
    }

    // Draw internal roads (grid roads that don't overlap border roads)
    for (const r of roadsToDraw) {
      if (r.type === 'vert') {
        drawDualVerticalRoads(r.x, r.y, r.len);
      } else {
        drawDualHorizontalRoads(r.x, r.y, r.len);
      }
    }

    // --- Step C: Building lot placement - ONE prefab per grid tile ---
    const buildingLots = [];

    function hasRoadCollision(x, y, w, h) {
      for (let py = y; py < y + h; py++) {
        for (let px = x; px < x + w; px++) {
          if (px < 0 || px >= width || py < 0 || py >= height) return true;
          if (occupiedMap[py * width + px] === 1) return true;
        }
      }
      return false;
    }

    function findLargestSquareInBlock(block) {
      const maxSize = Math.min(block.w, block.h);
      for (let size = maxSize; size >= 3; size--) {
        const centerX = Math.floor(block.x + block.w / 2);
        const centerY = Math.floor(block.y + block.h / 2);

        let x = centerX - Math.floor(size / 2);
        let y = centerY - Math.floor(size / 2);

        x = Math.max(block.x, Math.min(x, block.x + block.w - size));
        y = Math.max(block.y, Math.min(y, block.y + block.h - size));

        if (!hasRoadCollision(x, y, size, size)) {
          return { x, y, size };
        }

        const positions = [
          { x: block.x + 1, y: block.y + 1 },
          { x: block.x + block.w - size - 1, y: block.y + 1 },
          { x: block.x + 1, y: block.y + block.h - size - 1 },
          { x: block.x + block.w - size - 1, y: block.y + block.h - size - 1 }
        ];

        for (const pos of positions) {
          const px = Math.max(block.x, Math.min(pos.x, block.x + block.w - size));
          const py = Math.max(block.y, Math.min(pos.y, block.y + block.h - size));
          if (!hasRoadCollision(px, py, size, size)) {
            return { x: px, y: py, size };
          }
        }
      }
      return null;
    }

    for (const block of zoningBlocks) {
      const placement = findLargestSquareInBlock(block);

      if (placement) {
        buildingLots.push({
          x: placement.x,
          y: placement.y,
          w: placement.size,
          h: placement.size
        });

        // Mark as occupied so no future placements overlap
        for (let py = placement.y; py < placement.y + placement.size; py++) {
          for (let px = placement.x; px < placement.x + placement.size; px++) {
            if (px >= 0 && px < width && py >= 0 && py < height) {
              occupiedMap[py * width + px] = 2; // Building
            }
          }
        }
      }
    }

    // --- Step D: Prefab Application - one prefab per lot ---
    if (biome && biome.prefabs && biome.prefabs.length > 0) {
      const worldCoords = allOtherData?.worldCoords || { x: 0, y: 0 };
      allOtherData.blockHints = buildingLots;
      allOtherData.singlePrefabPerBlock = true;
      allOtherData.strictNoRoadOverlap = true;

      if (window.ProceduralMapPrefabs && window.ProceduralMapPrefabs.applyPrefabsToMap) {
        try {
          window.ProceduralMapPrefabs.applyPrefabsToMap(mapData, biome.name, worldCoords, allOtherData);
        } catch (e) { console.warn(`[CityGenerator] Error: ${e.message}`); }
      }
    }

    // --- Step B.5: Place sidewalks around roads (AFTER Prefabs to avoid overwrite) ---
    // UPDATED: Now includes checks to ensure it DOES NOT overwrite Prefabs (baseTile check)
    const sidewalkTiles = getFeatureTiles("Sidewalk", allFeatures);
    if (sidewalkTiles) {
      const sidewalkTile = sidewalkTiles[0];
      const roadTileIds = getFeatureTiles("Road", allFeatures) || [];
      const pathTileSet = new Set(roadTileIds);

      for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
          
          // Only look for roads
          if (occupiedMap[y * width + x] === 1) {
            
            // Place sidewalks in cardinal and diagonal directions
            for (let dy = -3; dy <= 3; dy++) {
              for (let dx = -3; dx <= 3; dx++) {
                const sx = x + dx;
                const sy = y + dy;

                if (sx < 1 || sx >= width - 1 || sy < 1 || sy >= height - 1) continue;
                if (occupiedMap[sy * width + sx] === 1) continue; // Skip if it's already a road

                const dist = Math.max(Math.abs(dx), Math.abs(dy));

                if (dist >= 2 && dist <= 3) {
                  const sidx = calculateIndex(sx, sy, 0, width, height);
                  const currentTile = mapData[sidx];

                  // 1. Never overwrite road/path tiles
                  if (pathTileSet.has(currentTile)) continue;

                  // 2. CRITICAL FIX: Never overwrite Prefab tiles
                  // If the tile is NOT base terrain and NOT empty (0), assume it is a Prefab.
                  if (currentTile !== baseTile && currentTile !== 0) continue;

                  // 3. Ensure we aren't writing over a building slot (even if empty)
                  if (occupiedMap[sy * width + sx] !== 0) continue;

                  mapData[sidx] = sidewalkTile;
                }
              }
            }
          }
        }
      }
      console.log("[CityGenerator] Sidewalks placed safely.");
    }

    // --- Step E.1: Directional Beach Generation ---
    addDirectionalBeach(mapData, width, height, adjacentBiomes, allFeatures, rng);

    // --- Step E: Water/Region Data ---
    const regiondata = new Array(width * height).fill(0);
    let waterTileIds = new Set();
    ["Water", "Ocean", "Beach"].forEach(f => {
      if (allFeatures[f]) allFeatures[f].forEach(v => { if(v.type==='single') waterTileIds.add(v.tileId); });
    });

    for (let i = 0; i < width * height; i++) {
      if (waterTileIds.has(mapData[i])) regiondata[i] = 99;
    }
    mapData.regiondata = regiondata;

    return mapData;
  }


/* Reworked generateBurgBiome for Circular European-style City */

function generateBurgBiome(biome, seed, allFeatures, adjacentBiomes, allOtherData = {}) {
  const width = PROC_MAP_WIDTH;
  const height = PROC_MAP_HEIGHT;
  const rng = createSeededRandom(seed);

  // 1. Initialize map with base terrain
  const mapData = new Array(width * height * 4).fill(0);

  // Get the terrain feature from the biome definition
  let baseTile = 0;
  if (biome && biome.features && biome.features.length > 0) {
    // Find the first terrain feature in the biome
    const terrainFeature = biome.features.find(f => f.terrain === true);
    if (terrainFeature && allFeatures[terrainFeature.name]) {
      // Get the first tile variant of this terrain feature
      const featureVariants = allFeatures[terrainFeature.name];
      for (const variant of featureVariants) {
        if (variant.type === "single") {
          baseTile = variant.tileId;
          break;
        }
      }
    }
  }

  // Fill entire map with base terrain
  for (let i = 0; i < width * height; i++) {
    mapData[i] = baseTile;
  }

  // Get Road Tiles
  const roadTiles = getFeatureTiles("Road", allFeatures);
  const dashedLineTiles = getFeatureTiles("DashedLine", allFeatures);
  if (!roadTiles || roadTiles.length === 0) return mapData;
  const roadTile = roadTiles[0];
  const dashedLineTile = dashedLineTiles ? dashedLineTiles[0] : null;

  // --- STEP 0: Draw border roads FIRST, mark them as occupied ---
  applyBorderRoadConnections(mapData, width, height, adjacentBiomes, roadTile, dashedLineTile);

  const centerX = Math.floor(width / 2);
  const centerY = Math.floor(height / 2);
  const borderRoadOccupied = new Array(width * height).fill(false);
  const borderRoadWidth = 7;  // Single road width
  const borderHalfRoad = Math.floor(borderRoadWidth / 2);
  const borderDirs = getCityBorderRoadDirections(adjacentBiomes);

  // Mark border road tiles as occupied (single centered road only)
  if (borderDirs.north) {
    const startX = centerX - borderHalfRoad;
    const endX = startX + borderRoadWidth;
    for (let y = 0; y <= centerY; y++) {
      for (let x = startX; x < endX; x++) {
        if (x >= 0 && x < width && y >= 0 && y < height) {
          borderRoadOccupied[y * width + x] = true;
        }
      }
    }
  }
  if (borderDirs.south) {
    const startX = centerX - borderHalfRoad;
    const endX = startX + borderRoadWidth;
    for (let y = centerY; y < height; y++) {
      for (let x = startX; x < endX; x++) {
        if (x >= 0 && x < width && y >= 0 && y < height) {
          borderRoadOccupied[y * width + x] = true;
        }
      }
    }
  }
  if (borderDirs.east) {
    const startY = centerY - borderHalfRoad;
    const endY = startY + borderRoadWidth;
    for (let x = centerX; x < width; x++) {
      for (let y = startY; y < endY; y++) {
        if (x >= 0 && x < width && y >= 0 && y < height) {
          borderRoadOccupied[y * width + x] = true;
        }
      }
    }
  }
  if (borderDirs.west) {
    const startY = centerY - borderHalfRoad;
    const endY = startY + borderRoadWidth;
    for (let x = 0; x <= centerX; x++) {
      for (let y = startY; y < endY; y++) {
        if (x >= 0 && x < width && y >= 0 && y < height) {
          borderRoadOccupied[y * width + x] = true;
        }
      }
    }
  }

  console.log("[BurgGenerator] Border roads marked as occupied");

  // --- Generate internal roads sprouting from border roads ---
  const occupiedMapBurg = new Array(width * height).fill(0);
  // Mark border roads in occupied map
  if (borderDirs.north) {
    const startX = centerX - borderHalfRoad;
    const endX = startX + borderRoadWidth;
    for (let y = 0; y <= centerY; y++) {
      for (let x = startX; x < endX; x++) {
        if (x >= 0 && x < width && y >= 0 && y < height) {
          occupiedMapBurg[y * width + x] = 1;
        }
      }
    }
  }
  if (borderDirs.south) {
    const startX = centerX - borderHalfRoad;
    const endX = startX + borderRoadWidth;
    for (let y = centerY; y < height; y++) {
      for (let x = startX; x < endX; x++) {
        if (x >= 0 && x < width && y >= 0 && y < height) {
          occupiedMapBurg[y * width + x] = 1;
        }
      }
    }
  }
  if (borderDirs.east) {
    const startY = centerY - borderHalfRoad;
    const endY = startY + borderRoadWidth;
    for (let x = centerX; x < width; x++) {
      for (let y = startY; y < endY; y++) {
        if (x >= 0 && x < width && y >= 0 && y < height) {
          occupiedMapBurg[y * width + x] = 1;
        }
      }
    }
  }
  if (borderDirs.west) {
    const startY = centerY - borderHalfRoad;
    const endY = startY + borderRoadWidth;
    for (let x = 0; x <= centerX; x++) {
      for (let y = startY; y < endY; y++) {
        if (x >= 0 && x < width && y >= 0 && y < height) {
          occupiedMapBurg[y * width + x] = 1;
        }
      }
    }
  }
  generateInternalRoadsFromBorders(mapData, width, height, borderDirs, roadTile, dashedLineTile, occupiedMapBurg, rng);

  // --- Configuration for Circular Layout ---
  const maxRadius = Math.min(centerX, centerY) - 5; // Max radius for roads
  const roadWidth = 3;                             // Single-tile road width for dense burgs
  const ringCount = 3 + Math.floor(rng() * 2);      // 3 to 4 main ring roads
  const spokeCount = 8 + Math.floor(rng() * 4) * 2; // 8, 10, or 12 main spokes
  const ringSpacing = maxRadius / (ringCount + 1); // Space rings evenly

  // Track occupied areas (roads)
  const roadSet = new Set();
  // Populate roadSet from internal roads marked in occupiedMapBurg
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      if (occupiedMapBurg[y * width + x] === 1) {
        roadSet.add(`${x},${y}`);
      }
    }
  }

  function setRoad(x, y) {
    if (x < 1 || x >= width - 1 || y < 1 || y >= height - 1) return;
    // Don't overwrite border roads
    if (borderRoadOccupied[y * width + x]) return;
    const idx = calculateIndex(x, y, 0, width, height);
    mapData[idx] = roadTile;
    roadSet.add(`${x},${y}`);
  }

  // --- Step A: Draw Concentric Ring Roads ---
  console.log(`[BurgGenerator] Drawing ${ringCount} concentric rings.`);
  const ringRadii = [];

  for (let i = 1; i <= ringCount; i++) {
    const radius = Math.floor(i * ringSpacing);
    ringRadii.push(radius);

    for (let angle = 0; angle < 360; angle += 1) {
      const rad = (angle * Math.PI) / 180;
      const x = centerX + radius * Math.cos(rad);
      const y = centerY + radius * Math.sin(rad);
      
      // Use a brush to draw the road wider
      for (let dy = -1; dy <= 1; dy++) {
        for (let dx = -1; dx <= 1; dx++) {
          setRoad(Math.floor(x + dx), Math.floor(y + dy));
        }
      }
    }
  }

  // --- Step B: Draw Radial Spokes ---
  console.log(`[BurgGenerator] Drawing ${spokeCount} radial spokes.`);
  const spokeAngles = [];

  for (let i = 0; i < spokeCount; i++) {
    const angle = (i * 360) / spokeCount + (rng() - 0.5) * 10; // Add slight randomness
    spokeAngles.push(angle);
    const rad = (angle * Math.PI) / 180;

    for (let r = 0; r < maxRadius; r++) {
      const x = centerX + r * Math.cos(rad);
      const y = centerY + r * Math.sin(rad);

      // Draw the road
      for (let dy = -1; dy <= 1; dy++) {
        for (let dx = -1; dx <= 1; dx++) {
          setRoad(Math.floor(x + dx), Math.floor(y + dy));
        }
      }
    }
  }

  // --- Step C: Identify Curved Building Lots (Zoning Blocks) ---
  const buildingLots = [];
  const minLotSize = 5; // Minimum size for a building lot
  const lotOverlap = new Array(width * height).fill(false); // To prevent lot overlap

  /**
   * Finds a spot within a region defined by two radii and two angles.
   * Tries to center a lot between roads without overlapping.
   */
  function findLotInSegment(r1, r2, a1, a2) {
    // Calculate angular and radial center
    const avgRadius = (r1 + r2) / 2;
    const avgAngleRad = ((a1 + a2) / 2) * (Math.PI / 180);
    
    // Calculate lot center position
    const cx = centerX + avgRadius * Math.cos(avgAngleRad);
    const cy = centerY + avgRadius * Math.sin(avgAngleRad);
    
    const lotSize = minLotSize + Math.floor(rng() * 5); // 5x5 to 9x9

    // Check the lot area for road or existing lot overlap
    const halfSize = Math.floor(lotSize / 2);
    const startX = Math.floor(cx - halfSize);
    const startY = Math.floor(cy - halfSize);
    
    // Strict Road/Overlap Check
    for (let y = startY; y < startY + lotSize; y++) {
      for (let x = startX; x < startX + lotSize; x++) {
        const key = `${x},${y}`;
        if (roadSet.has(key) || lotOverlap[y * width + x]) {
          return null; // Overlaps with road or another lot
        }
      }
    }
    
    // Mark as occupied by a lot
    for (let y = startY; y < startY + lotSize; y++) {
      for (let x = startX; x < startX + lotSize; x++) {
        lotOverlap[y * width + x] = true;
      }
    }

    // Lot found
    return { x: startX, y: startY, w: lotSize, h: lotSize };
  }


  // 1. Center Lot (Town Square/Castle)
  const centerLotSize = 12 + Math.floor(rng() * 4);
  const centerLotX = centerX - Math.floor(centerLotSize / 2);
  const centerLotY = centerY - Math.floor(centerLotSize / 2);
  
  // Check for road collision in center
  let centerRoadCollision = false;
  for (let y = centerLotY; y < centerLotY + centerLotSize; y++) {
      for (let x = centerLotX; x < centerLotX + centerLotSize; x++) {
          if (roadSet.has(`${x},${y}`)) {
              centerRoadCollision = true;
              break;
          }
      }
  }
  
  if (!centerRoadCollision) {
       buildingLots.push({
          x: centerLotX,
          y: centerLotY,
          w: centerLotSize,
          h: centerLotSize,
          isCenter: true // Flag for placing key prefabs (castle/town hall)
      });
      
      // Mark center as occupied by a lot
      for (let y = centerLotY; y < centerLotY + centerLotSize; y++) {
          for (let x = centerLotX; x < centerLotX + centerLotSize; x++) {
              lotOverlap[y * width + x] = true;
          }
      }
  }


  // 2. Ring Segments (The main city)
  const allAngles = spokeAngles.sort((a, b) => a - b);

  for (let r = 0; r < ringRadii.length; r++) {
    const r1 = r === 0 ? roadWidth + 2 : ringRadii[r - 1] + roadWidth + 2; // Inner radius (start of segment)
    const r2 = ringRadii[r] - roadWidth - 2; // Outer radius (end of segment)
    
    // Ensure segment is wide enough
    if (r2 <= r1 + minLotSize) continue;

    for (let a = 0; a < allAngles.length; a++) {
      const a1 = allAngles[a];
      let a2 = allAngles[(a + 1) % allAngles.length];
      
      // Handle wrap-around case (360 -> 0)
      if (a2 < a1) a2 += 360; 

      // Divide the segment into 1-2 lots radially
      const segmentRadialLength = r2 - r1;
      const lotGap = 2; 

      // Try two lots
      const rMid = r1 + Math.floor(segmentRadialLength * 0.5) - lotGap;
      
      // Lot 1 (Inner)
      const lot1 = findLotInSegment(r1 + lotGap, rMid, a1, a2);
      if (lot1) buildingLots.push(lot1);

      // Lot 2 (Outer)
      const lot2 = findLotInSegment(rMid + lotGap*2, r2, a1, a2);
      if (lot2) buildingLots.push(lot2);
    }
  }

  // --- Step D: Prefab Application ---

  if (biome && biome.prefabs && biome.prefabs.length > 0) {
    console.log(`[BurgGenerator] Applying prefabs to burg with ${buildingLots.length} circular lots.`);
    const worldCoords = allOtherData?.worldCoords || { x: 0, y: 0 };

    // Pass building lots as placement hints
    allOtherData.blockHints = buildingLots;
    allOtherData.singlePrefabPerBlock = true; // Place exactly 1 prefab per lot
    allOtherData.strictNoRoadOverlap = true; // Enforce: no overlap with roads

    if (window.ProceduralMapPrefabs && window.ProceduralMapPrefabs.applyPrefabsToMap) {
      try {
        window.ProceduralMapPrefabs.applyPrefabsToMap(mapData, biome.name, worldCoords, allOtherData);
        console.log(`[BurgGenerator] Prefabs applied.`);
      } catch (e) {
        console.warn(`[BurgGenerator] Error: ${e.message}`);
      }
    }
  }

  // --- Step E.1: Directional Beach Generation ---
  addDirectionalBeach(mapData, width, height, adjacentBiomes, allFeatures, rng);

  // --- Step E: Water/Region Data ---
  const regiondata = new Array(width * height).fill(0);
  let waterTileIds = new Set();
  ["Water", "Ocean", "Beach"].forEach(f => {
    if (allFeatures[f]) allFeatures[f].forEach(v => { if(v.type==='single') waterTileIds.add(v.tileId); });
  });

  for (let i = 0; i < width * height; i++) {
    if (waterTileIds.has(mapData[i])) regiondata[i] = 99;
  }
  mapData.regiondata = regiondata;

  return mapData;
}

  // ===== EXPORT DUNGEON FUNCTIONS =====

  window.ProcGenDungeon = {
    isDungeonBiome,
    isVillageBiome,
    isCityBiome,
    isBurgBiome,
    getFeatureTiles,
    getRandomFeatureTile,
    generateDungeonBiome,
    generateVillageBiome,
    generateCityBiome,
    generateBurgBiome
  };
})();
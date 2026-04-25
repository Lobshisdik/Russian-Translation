/*:
 * @target MZ
 * @plugindesc Procedural prefab placement system: loads and places prefab maps into procedural biomes. OPTIMIZED VERSION (Conditional Roads).
 * @author Omni-Lex
 *
 * @help
 * Procedural Map Prefabs (Optimized)
 * ==================================
 * Places prefab maps (32x32) into procedurally generated maps.
 *
 * PREFAB SYSTEM
 * =============
 * - Biomes can define a `prefabs` array with map IDs (e.g., [453, 457, 234])
 * - Each biome randomly places 0-4 prefabs during generation
 * - Prefabs are placed at random seeded positions
 * - Uses Summed Area Table (SAT) for O(1) collision detection against roads
 * - Caches loaded maps to prevent disk I/O thrashing
 * - OPTIMIZATION: Only scans for road collisions in "City" or "Road" biomes
 *
 * Requires ProceduralMapBiomeGenerator.js and ProceduralMapUtils.js
 */

(() => {
  "use strict";

  const pluginName = "ProceduralMapPrefabs";

  // Import utilities
  const Utils2 = window.ProcGenUtils;
  if (!Utils2) {
    console.error("ProceduralMapPrefabs requires ProceduralMapUtils plugin");
    return;
  }

  const { createSeededRandom, randomChoice, calculateIndex, isWaterTileId } = Utils2;

  // Import beach/water utilities
  const BeachGen = window.ProcGenBeach;
  if (!BeachGen) {
    console.error("ProceduralMapPrefabs requires ProceduralBeachGenerator plugin");
    return;
  }

  const { isWaterBiome } = BeachGen;

  // Get BIOMES from ProceduralMapDB
  function getBiomes() {
    if (window.WorldGen && window.WorldGen.BIOMES) {
      return window.WorldGen.BIOMES;
    }
    return [];
  }

  const PROC_MAP_WIDTH = 128;
  const PROC_MAP_HEIGHT = 128;
  const PROC_MAP_ID = 636; // Procedural map ID
  const GRID_UNIT = 8; // Base grid unit
  
  // OPTIMIZATION: In-memory cache for map data to avoid disk reads
  const prefabCache = new Map();

  /**
   * Get biome by name
   */
  function getBiomeByName(biomeName) {
    const BIOMES = getBiomes();
    return BIOMES.find(b => b.name === biomeName);
  }

  /**
   * Load a map file synchronously (Optimized with Cache)
   */
  function loadPrefabSync(mapId) {
    // Check cache first
    if (prefabCache.has(mapId)) {
      // Return a deep copy to ensure the cache isn't accidentally mutated
      return JSON.parse(JSON.stringify(prefabCache.get(mapId)));
    }

    try {
      const xhr = new XMLHttpRequest();
      const mapIdStr = String(mapId).padStart(3, '0');
      const url = `data/prefabs/Map${mapIdStr}.json`;

      xhr.open('GET', url, false); // Synchronous
      xhr.send();

      if (xhr.status === 200 || xhr.status === 0) {
        const mapData = JSON.parse(xhr.responseText);
        // Save to cache
        prefabCache.set(mapId, mapData);
        return mapData;
      }
      return null;
    } catch (e) {
      return null;
    }
  }

  /**
   * Builds a Summed Area Table (Integral Image) for O(1) collision checks
   * Returns a 1D Int32Array representing a 2D grid where cell [y][x] 
   * contains the sum of all occupied pixels above and to the left.
   */
  function buildSummedAreaTable(occupiedMapData, width, height) {
    // SAT dimensions are (width + 1) * (height + 1) to handle edge cases easily
    const satWidth = width + 1;
    const satHeight = height + 1;
    const sat = new Int32Array(satWidth * satHeight).fill(0);
    
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const isOccupied = occupiedMapData[y * width + x] === 1 ? 1 : 0;
        
        // Formula: SAT[y+1][x+1] = pixel + Left + Top - TopLeft
        const left = sat[(y + 1) * satWidth + x];
        const top = sat[y * satWidth + (x + 1)];
        const topLeft = sat[y * satWidth + x];

        sat[(y + 1) * satWidth + (x + 1)] = isOccupied + left + top - topLeft;
      }
    }
    return sat;
  }

  /**
   * Extract all non-terrain feature tile IDs that should be cleared
   */
  function getNonTerrainFeatureTileIds(biome, allFeatures) {
    if (!biome || !biome.features) return [];

    const terrainFeatureNames = new Set(
      biome.features
        .filter(f => f.terrain === true)
        .map(f => f.name)
    );

    const nonTerrainTileIds = [];

    for (const feature of biome.features) {
      if (terrainFeatureNames.has(feature.name)) continue;

      const featureTiles = allFeatures[feature.name] || [];
      for (const variant of featureTiles) {
        if (variant.type === "single") {
          nonTerrainTileIds.push(variant.tileId);
        } else if (variant.type === "multi") {
          for (const row of variant.tiles) {
            for (const tileId of row) {
              nonTerrainTileIds.push(tileId);
            }
          }
        }
      }
    }
    return nonTerrainTileIds;
  }

  /**
   * Determine random prefab count based on biome type
   */
  function getPrefabCount(rng, biomeName, allowReuse) {
    if (biomeName && biomeName.toLowerCase().includes("city")) {
      return 15 + Math.floor(rng() * 6);
    } else if (biomeName && biomeName.toLowerCase().includes("village")) {
      return 8 + Math.floor(rng() * 8);
    } else {
      return 4 + Math.floor(rng() * 11);
    }
  }

  /**
   * Optimized canPlacePrefabAt using Summed Area Table (SAT)
   * SAT allows us to check a rectangular area for roads in 4 lookups instead of W*H lookups.
   * Also checks for water tile overlap (unless in Ocean biome).
   */
function canPlacePrefabAt(x, y, prefabWidth, prefabHeight, occupiedAreas, satData, SPACING, waterSatData) {
    // 1. Bounds Check
    if (x < 0 || y < 0 || x + prefabWidth > PROC_MAP_WIDTH || y + prefabHeight > PROC_MAP_HEIGHT) {
      return false;
    }

    // 2. Road Collision Check (O(1) using SAT)
    if (satData) {
      const satWidth = PROC_MAP_WIDTH + 1;
      const x2 = x + prefabWidth;
      const y2 = y + prefabHeight;

      if (x2 >= satWidth || y2 > PROC_MAP_HEIGHT) return false;

      const D = satData[y2 * satWidth + x2];
      const B = satData[y * satWidth + x2];
      const C = satData[y2 * satWidth + x];
      const A = satData[y * satWidth + x];

      if ((D - B - C + A) > 0) return false; // Contains at least 1 road tile
    }

    // 2b. Water Collision Check (O(1) using SAT)
    if (waterSatData) {
      const satWidth = PROC_MAP_WIDTH + 1;
      const x2 = x + prefabWidth;
      const y2 = y + prefabHeight;

      if (x2 >= satWidth || y2 > PROC_MAP_HEIGHT) return false;

      const D = waterSatData[y2 * satWidth + x2];
      const B = waterSatData[y * satWidth + x2];
      const C = waterSatData[y2 * satWidth + x];
      const A = waterSatData[y * satWidth + x];

      if ((D - B - C + A) > 0) return false; // Contains at least 1 water tile
    }

    // 3. Strict Prefab Overlap Check (AABB)
    if (occupiedAreas && occupiedAreas.length > 0) {
      const spacing = SPACING !== undefined ? SPACING : 1;
      
      for (let i = 0; i < occupiedAreas.length; i++) {
        const other = occupiedAreas[i];
        
        // Check if the two rectangles overlap (including spacing buffer)
        // We add spacing to both sides of the check to ensure a clear gap
        const noOverlap = (
            x >= other.x + other.width + spacing ||    // To the right
            x + prefabWidth + spacing <= other.x ||    // To the left
            y >= other.y + other.height + spacing ||   // Below
            y + prefabHeight + spacing <= other.y      // Above
        );

        if (!noOverlap) {
            return false; // Collision detected
        }
      }
    }

    return true;
  }

  /**
   * Generate random positions for prefabs
   * Uses SAT data for road and water checking if available
   */
  function generatePrefabPositions(prefabCount, rng, prefabSizes, biomeName, blockHints, satData, waterSatData, placementHints) {
    if (prefabCount <= 0 || !prefabSizes || prefabSizes.length === 0) {
      return [];
    }

    const positions = [];
    const isCity = biomeName && biomeName.toLowerCase().includes("city");
    const isVillage = biomeName && biomeName.toLowerCase().includes("village");
    
    // STRICT SPACING: Ensure at least 1 tile gap between all prefabs
    const SPACING = 1; 
    const allPlacedRects = [];

    // Village biomes use placement hints from structure generator
    if (isVillage && placementHints && placementHints.length > 0) {
      console.log(`[PrefabGenerator] Village prefab placement: ${placementHints.length} hints, ${prefabCount} desired prefabs`);
      let skippedDueToOverlap = 0;

      for (let hintIndex = 0; hintIndex < placementHints.length && positions.length < prefabCount; hintIndex++) {
        const hint = placementHints[hintIndex];
        const prefabIndex = hintIndex % prefabSizes.length;
        const prefab = prefabSizes[prefabIndex];

        // Strategy: Try to center logic first
        let finalX = null;
        let finalY = null;

        const centerX = Math.floor(hint.x - prefab.width / 2);
        const centerY = Math.floor(hint.y - prefab.height / 2);

        if (canPlacePrefabAt(centerX, centerY, prefab.width, prefab.height, allPlacedRects, satData, SPACING, waterSatData)) {
          finalX = centerX;
          finalY = centerY;
        } else {
          // Strategy 2: Wiggle room (Reduced radius to prevent erratic jumps)
          const searchRadius = 3;
          for (let dy = -searchRadius; dy <= searchRadius && finalX === null; dy++) {
            for (let dx = -searchRadius; dx <= searchRadius; dx++) {
              const tryX = centerX + dx;
              const tryY = centerY + dy;

              if (canPlacePrefabAt(tryX, tryY, prefab.width, prefab.height, allPlacedRects, satData, SPACING, waterSatData)) {
                finalX = tryX;
                finalY = tryY;
                break;
              }
            }
          }
        }

        if (finalX !== null) {
          positions.push({
            x: finalX,
            y: finalY,
            width: prefab.width,
            height: prefab.height,
            mapId: prefab.mapId
          });
          allPlacedRects.push({
            x: finalX,
            y: finalY,
            width: prefab.width,
            height: prefab.height
          });
        } else {
          skippedDueToOverlap++;
        }
      }

      console.log(`[PrefabGenerator] Village prefabs placed: ${positions.length}, skipped overlap: ${skippedDueToOverlap}`);
      return positions;
    }

    // City biomes use building lot hints from structure generator
    if (isCity && blockHints && blockHints.length > 0) {
      for (let lotIndex = 0; lotIndex < blockHints.length && prefabSizes.length > 0; lotIndex++) {
        const lot = blockHints[lotIndex];
        const prefabIndex = lotIndex % prefabSizes.length;
        const prefab = prefabSizes[prefabIndex];

        let finalX = null;
        let finalY = null;

        // Strategy 1: Center in lot
        const centerX = Math.floor(lot.x + (lot.w - prefab.width) / 2);
        const centerY = Math.floor(lot.y + (lot.h - prefab.height) / 2);

        if (canPlacePrefabAt(centerX, centerY, prefab.width, prefab.height, allPlacedRects, satData, SPACING, waterSatData)) {
          finalX = centerX;
          finalY = centerY;
        } else {
          // Strategy 2: Try corners, but ensure they don't overlap existing placements
          // We strictly validate candidates using canPlacePrefabAt which checks allPlacedRects
          const corners = [
            { x: lot.x, y: lot.y },
            { x: lot.x + lot.w - prefab.width, y: lot.y },
            { x: lot.x, y: lot.y + lot.h - prefab.height },
            { x: lot.x + lot.w - prefab.width, y: lot.y + lot.h - prefab.height }
          ];

          for (const corner of corners) {
            // Constrain to map bounds
            if (corner.x < 0 || corner.y < 0) continue;
            
            // Constrain corner logic to be relatively close to the lot
            const cx = Math.max(lot.x - 2, Math.min(corner.x, lot.x + lot.w - prefab.width + 2));
            const cy = Math.max(lot.y - 2, Math.min(corner.y, lot.y + lot.h - prefab.height + 2));

            if (canPlacePrefabAt(cx, cy, prefab.width, prefab.height, allPlacedRects, satData, SPACING, waterSatData)) {
              finalX = cx;
              finalY = cy;
              break;
            }
          }
        }

        if (finalX !== null) {
          positions.push({
            x: finalX,
            y: finalY,
            width: prefab.width,
            height: prefab.height,
            mapId: prefab.mapId
          });
          allPlacedRects.push({
            x: finalX,
            y: finalY,
            width: prefab.width,
            height: prefab.height
          });
        }
      }
      return positions;
    }

    // Fallback grid-based placement for non-city biomes
    const gridWidth = Math.floor(PROC_MAP_WIDTH / GRID_UNIT);
    const gridHeight = Math.floor(PROC_MAP_HEIGHT / GRID_UNIT);
    const sectorOccupied = new Uint8Array(gridWidth * gridHeight);

    for (let i = 0; i < prefabCount; i++) {
      const prefabIndex = i % prefabSizes.length;
      const size = prefabSizes[prefabIndex];
      const gridUnitsWide = Math.ceil(size.width / GRID_UNIT);
      const gridUnitsTall = Math.ceil(size.height / GRID_UNIT);

      for (let attempt = 0; attempt < 15; attempt++) {
        if (gridWidth > gridUnitsWide && gridHeight > gridUnitsTall) {
          const gridX = Math.floor(rng() * (gridWidth - gridUnitsWide));
          const gridY = Math.floor(rng() * (gridHeight - gridUnitsTall));
          
          if (sectorOccupied[gridY * gridWidth + gridX] === 1) continue;

          const tileX = gridX * GRID_UNIT;
          const tileY = gridY * GRID_UNIT;

          // Pass 0 as spacing here if needed, but safer to use SPACING (1)
          if (canPlacePrefabAt(tileX, tileY, size.width, size.height, allPlacedRects, satData, SPACING, waterSatData)) {
            
            for (let gy = gridY; gy < gridY + gridUnitsTall; gy++) {
               for (let gx = gridX; gx < gridX + gridUnitsWide; gx++) {
                 if(gy < gridHeight && gx < gridWidth) {
                   sectorOccupied[gy * gridWidth + gx] = 1;
                 }
               }
            }

            positions.push({
              x: tileX,
              y: tileY,
              width: size.width,
              height: size.height,
              mapId: size.mapId
            });

            allPlacedRects.push({
              x: tileX,
              y: tileY,
              width: size.width,
              height: size.height
            });

            break; // Success
          }
        }
      }
    }

    return positions;
  }

  /**
   * Place a single prefab map into the procedural map
   */
  function placePrefab(mapData, prefabMap, position, nonTerrainTileIds) {
    if (!prefabMap || !prefabMap.data) return;

    const prefabData = prefabMap.data;
    const prefabWidth = prefabMap.width;
    const prefabHeight = prefabMap.height;

    if (position.x + prefabWidth > PROC_MAP_WIDTH ||
        position.y + prefabHeight > PROC_MAP_HEIGHT) {
      return;
    }

    const nonTerrainSet = new Set(nonTerrainTileIds);

    // Single pass: process prefab tiles
    for (let py = 0; py < prefabHeight; py++) {
      for (let px = 0; px < prefabWidth; px++) {
        const mapX = position.x + px;
        const mapY = position.y + py;

        let hasPrefabContent = false;
        const prefabTilesAtPosition = [];

        for (let layer = 0; layer < 4; layer++) {
          const srcIdx = calculateIndex(px, py, layer, prefabWidth, prefabHeight);
          if (srcIdx < prefabData.length) {
            const tile = prefabData[srcIdx];
            prefabTilesAtPosition[layer] = tile;
            if (tile !== 0) {
              hasPrefabContent = true;
            }
          }
        }

        if (hasPrefabContent) {
          // Clear non-terrain features
          for (let layer = 0; layer < 4; layer++) {
            const idx = calculateIndex(mapX, mapY, layer, PROC_MAP_WIDTH, PROC_MAP_HEIGHT);
            const tileId = mapData[idx];
            if (nonTerrainSet.has(tileId)) {
              mapData[idx] = 0;
            }
          }

          // Copy prefab tiles
          for (let layer = 0; layer < 4; layer++) {
            const dstIdx = calculateIndex(mapX, mapY, layer, PROC_MAP_WIDTH, PROC_MAP_HEIGHT);
            const tile = prefabTilesAtPosition[layer];

            if (dstIdx < mapData.length) {
              if (layer === 0 && tile === 0) continue;
              mapData[dstIdx] = tile;
            }
          }
        }
      }
    }
  }

  /**
   * Process a generated map to add prefabs
   */
  function applyPrefabsToMap(mapData, biomeName, worldCoords, allOtherData) {
    const biome = getBiomeByName(biomeName);

    if (!biome || !biome.prefabs || biome.prefabs.length === 0) {
      return mapData;
    }

    // Flatten the nested prefab arrays into a single array
    const availablePrefabs = biome.prefabs.flat();
    if (availablePrefabs.length === 0) {
      return mapData;
    }

    // RNG Setup
    const coordSeed = (worldCoords.x * 73856093) ^ (worldCoords.y * 19349663);
    const biomeSeed = biomeName.charCodeAt(0) * 73856093 ^
                      biomeName.charCodeAt(Math.min(1, biomeName.length - 1)) * 19349663;
    const seed = coordSeed ^ biomeSeed;
    const rng = createSeededRandom(seed);

    let prefabCount = getPrefabCount(rng, biomeName, allOtherData?.allowPrefabReuse);

    if (prefabCount === 0) return mapData;

    const allowReuse = allOtherData?.allowPrefabReuse === true;

    // Load unique prefabs (Cached)
    const prefabsWithSizes = [];
    const selectedMapIds = new Set();
    let attempts = 0;
    const maxAttempts = (allowReuse ? 3 : prefabCount) * 20;
    const targetCount = allowReuse ? Math.min(availablePrefabs.length, 6) : prefabCount;

    while (prefabsWithSizes.length < targetCount && attempts < maxAttempts) {
      attempts++;
      const prefabMapId = randomChoice(availablePrefabs, rng);

      if (selectedMapIds.has(prefabMapId)) continue;

      const prefabMap = loadPrefabSync(prefabMapId);

      if (prefabMap) {
        if (prefabMap.width > 0 && prefabMap.height > 0 &&
            prefabMap.width <= PROC_MAP_WIDTH && prefabMap.height <= PROC_MAP_HEIGHT) {
          prefabsWithSizes.push({
            mapId: prefabMapId,
            width: prefabMap.width,
            height: prefabMap.height,
            data: prefabMap
          });
          selectedMapIds.add(prefabMapId);
        }
      }
    }

    if (prefabsWithSizes.length === 0) return mapData;

    // --- CONDITIONAL ROAD DETECTION ---
    // We only scan for roads if the biome is "City" or "Road"
    const lowerBiome = biomeName.toLowerCase();
    const shouldCheckRoads = lowerBiome.includes("city") || lowerBiome.includes("road");

    let satData = null;

    if (shouldCheckRoads) {
        // Optimization: Use Int8Array for lower memory footprint
        const occupiedMapData = new Int8Array(PROC_MAP_WIDTH * PROC_MAP_HEIGHT);
        const roadTileIds = new Set();

        // Identify tiles (Logic preserved)
        const tilesetIds = biome.tilesetIds || [biome.tilesetId];
        try {
          const Cache = window.ProcGenUtils && window.ProcGenUtils.Cache;
          if (Cache) {
            for (const tilesetId of tilesetIds) {
              try {
                const features = Cache.getTilesetFeatures(tilesetId);
                if (features) {
                  for (const [name, featureList] of Object.entries(features)) {
                    const lowerName = name.toLowerCase();
                    if (lowerName.includes("road") || lowerName.includes("dashed")) {
                      if (Array.isArray(featureList)) {
                        featureList.forEach(v => {
                          if (v.type === "single") {
                            roadTileIds.add(v.tileId);
                          } else if (v.type === "multi" && v.tiles) {
                            v.tiles.forEach(row => row.forEach(id => roadTileIds.add(id)));
                          }
                        });
                      }
                    }
                  }
                }
              } catch (e) {}
            }
          }
        } catch (e) {}

        // OPTIMIZED ROAD SCANNING LOOP
        const layerSize = PROC_MAP_WIDTH * PROC_MAP_HEIGHT;
        for (let i = 0; i < layerSize; i++) {
            // Check Layer 0, 1, 2, 3 directly
            if (roadTileIds.has(mapData[i]) || 
                roadTileIds.has(mapData[i + layerSize]) || 
                roadTileIds.has(mapData[i + layerSize * 2]) || 
                roadTileIds.has(mapData[i + layerSize * 3])) {
                occupiedMapData[i] = 1;
            }
        }

        // Build the Summed Area Table (SAT)
        satData = buildSummedAreaTable(occupiedMapData, PROC_MAP_WIDTH, PROC_MAP_HEIGHT);
    }

    // --- CONDITIONAL WATER DETECTION ---
    // We scan for water tiles UNLESS the biome is "Ocean" (where prefabs can overlap water)
    const isOceanBiome = isWaterBiome(biomeName) && lowerBiome.includes("ocean");
    let waterSatData = null;

    if (!isOceanBiome) {
        // Optimization: Use Int8Array for lower memory footprint
        const waterOccupiedMapData = new Int8Array(PROC_MAP_WIDTH * PROC_MAP_HEIGHT);
        const waterTileIds = new Set();

        // Identify water tiles
        const tilesetIds = biome.tilesetIds || [biome.tilesetId];
        try {
          const Cache = window.ProcGenUtils && window.ProcGenUtils.Cache;
          if (Cache) {
            for (const tilesetId of tilesetIds) {
              try {
                const features = Cache.getTilesetFeatures(tilesetId);
                if (features) {
                  for (const [name, featureList] of Object.entries(features)) {
                    const lowerName = name.toLowerCase();
                    // Check for water-related features
                    if (lowerName.includes("water") || lowerName.includes("ocean") || lowerName.includes("beach")) {
                      if (Array.isArray(featureList)) {
                        featureList.forEach(v => {
                          if (v.type === "single") {
                            waterTileIds.add(v.tileId);
                          } else if (v.type === "multi" && v.tiles) {
                            v.tiles.forEach(row => row.forEach(id => waterTileIds.add(id)));
                          }
                        });
                      }
                    }
                  }
                }
              } catch (e) {}
            }
          }
        } catch (e) {}

        // OPTIMIZED WATER SCANNING LOOP
        const layerSize = PROC_MAP_WIDTH * PROC_MAP_HEIGHT;
        for (let i = 0; i < layerSize; i++) {
            // Check Layer 0, 1, 2, 3 directly
            if (waterTileIds.has(mapData[i]) ||
                waterTileIds.has(mapData[i + layerSize]) ||
                waterTileIds.has(mapData[i + layerSize * 2]) ||
                waterTileIds.has(mapData[i + layerSize * 3])) {
                waterOccupiedMapData[i] = 1;
            }
        }

        // Build the Summed Area Table (SAT) for water
        waterSatData = buildSummedAreaTable(waterOccupiedMapData, PROC_MAP_WIDTH, PROC_MAP_HEIGHT);
    }

    const blockHints = allOtherData?.blockHints;
    const placementHints = allOtherData?.placementHints;

    // Generate positions (satData is null if not in City/Road biome, waterSatData is null if in Ocean biome)
    const positions = generatePrefabPositions(prefabCount, rng, prefabsWithSizes, biomeName, blockHints, satData, waterSatData, placementHints);

    // Build feature lookup for current biome (to find non-terrain features to clear)
    const allFeatures = {};
    let hasFeatures = false;
    const tilesetIds = biome.tilesetIds || [biome.tilesetId];

    try {
      const Cache = window.ProcGenUtils && window.ProcGenUtils.Cache;
      if (Cache) {
        for (const tilesetId of tilesetIds) {
          try {
            const features = Cache.getTilesetFeatures(tilesetId);
            if (features) {
              hasFeatures = true;
              for (const [name, tiles] of Object.entries(features)) {
                if (!allFeatures[name]) {
                  allFeatures[name] = [];
                }
                allFeatures[name] = allFeatures[name].concat(tiles);
              }
            }
          } catch (e) {}
        }
      }
    } catch (e) {}

    const nonTerrainTileIds = hasFeatures ? getNonTerrainFeatureTileIds(biome, allFeatures) : [];

    // Place each prefab
    for (let i = 0; i < positions.length; i++) {
      const position = positions[i];
      const prefabInfo = prefabsWithSizes.find(p => p.mapId === position.mapId);

      if (prefabInfo && prefabInfo.data) {
        placePrefab(mapData, prefabInfo.data, position, nonTerrainTileIds);
      }
    }

    return mapData;
  }

  /**
   * Hook into the map data loading process
   */
  const _DataManager_loadMapData = DataManager.loadMapData;
  DataManager.loadMapData = function (mapId) {
    _DataManager_loadMapData.call(this, mapId);

    if (mapId === PROC_MAP_ID) {
      if ($gameSystem && $gameSystem._procGenData) {
        if ($gameSystem._procGenData.generatedMapData) {
          const biomeName = $gameSystem._procGenData.currentBiome;
          const worldX = $gameVariables.value(43) || 0;
          const worldY = $gameVariables.value(44) || 0;
          const worldCoords = { x: worldX, y: worldY };

          if (biomeName) {
            applyPrefabsToMap($gameSystem._procGenData.generatedMapData, biomeName, worldCoords);
            if ($dataMap) {
              $dataMap.data = $gameSystem._procGenData.generatedMapData;
            }
          }
        }
      }
    }
  };

  // Expose functions for debugging
  window.ProceduralMapPrefabs = {
    applyPrefabsToMap,
    loadPrefabSync,
    canPlacePrefabAt,
    loadMapDataSync: loadPrefabSync, // Alias for backward compatibility
    getPrefabCount,
    generatePrefabPositions,
    placePrefab,
    buildSummedAreaTable,
  };
})();
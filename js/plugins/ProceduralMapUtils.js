/*:
 * @target MZ
 * @plugindesc Utility functions for procedural map generation: noise, tile conversion, coordinates
 * @author Omni-Lex
 *
 * @help
 * Procedural Map Utilities
 * ========================
 * Provides core utility functions for procedural generation:
 * - Perlin noise and smoothing
 * - Tile ID to progressive ID conversions
 * - World coordinate management
 * - Seeded random number generation
 * - Cache management
 * - Multi-tile terrain feature support
 *
 * TERRAIN FEATURE FORMATS
 * =======================
 * Single Tile:
 *   <FeatureName: B10>      (B-E sheets, no space)
 *   <FeatureName: B 10>     (B-E sheets, with space - legacy)
 *   <FeatureName: A1 2>     (A-sheets: A1 sheet, index 2)
 *
 * Multi-Tile Grid (2x2):
 *   <Castle: [B34, B45],[B65, B66]>
 *   Places a 2x2 grid of tiles at the feature location
 *
 * Multi-Tile Grid (1x2 - vertical):
 *   <Cactus: [E34],[B60]>
 *   Places a 1 wide, 2 tall grid
 *
 * Multi-Tile Grid (3x2):
 *   <Feature: [B10, B11, B12],[B20, B21, B22]>
 *   Places a 3 wide, 2 tall grid
 *
 * This plugin must be loaded before ProceduralMapBiomeGenerator.js
 */

(() => {
  "use strict";

  const pluginName = "ProceduralMapUtils";

  // ===== CONSTANTS =====
  const WORLD_MAP_ID = 315;
  const WORLD_TILESET_ID = 96;
  const PROC_MAP_ID = 636;
  const PROC_MAP_WIDTH = 128;
  const PROC_MAP_HEIGHT = 128;
  const DEBUG_MODE = Utils.isOptionValid("test");
  const BORDER_DETECTION_RANGE = 3;
  const { BIOMES, NON_PROCEDURAL_COORDINATES } =
    window.WorldGen;

  // ===== PERFORMANCE CACHE =====
  const Cache = {
    tilesetFeatures: {},
    biomeNameCache: {},
    noiseCache: new Map(),
    maxNoiseCacheSize: 1000,

    getTilesetFeatures(tilesetId) {
      if (!this.tilesetFeatures[tilesetId]) {
        this.tilesetFeatures[tilesetId] = parseTerrainFeatures(tilesetId);
      }
      return this.tilesetFeatures[tilesetId];
    },

    getNoise(x, y, seed) {
      const key = `${Math.floor(x)},${Math.floor(y)},${seed}`;
      if (!this.noiseCache.has(key)) {
        if (this.noiseCache.size > this.maxNoiseCacheSize) {
          const firstKey = this.noiseCache.keys().next().value;
          this.noiseCache.delete(firstKey);
        }
        this.noiseCache.set(key, noise2D(x, y, seed));
      }
      return this.noiseCache.get(key);
    },

    clear() {
      this.tilesetFeatures = {};
      this.biomeNameCache = {};
      this.noiseCache.clear();
    },
  };

  // ===== LOGGING UTILITY =====
  function log(message) {
    if (DEBUG_MODE) {
      console.log(`[ProcGen] ${message}`);
    }
  }

  function logWarn(message) {
    if (DEBUG_MODE) {
      console.warn(`[ProcGen] ${message}`);
    }
  }

  // ===== TILE ID CONVERSION FUNCTIONS =====

  /**
   * Convert tile ID to progressive ID
   * Progressive ID system:
   * A1: 0-15, A2: 16-31, A3: 32-47, A4: 48-63, A5: 64-79
   * B: 80-335, C: 336-591, D: 592-847, E: 848-1103
   * Also handles extended tilesets
   */
  function getTileIdToProgressiveId(tileId) {
    const ranges = [
      { max: 256, base: 80, sub: 0 },
      { max: 512, base: 336, sub: 256 },
      { max: 768, base: 592, sub: 512 },
      { max: 1024, base: 848, sub: 768 },
    ];

    for (const r of ranges) {
      if (tileId < r.max) return r.base + (tileId - r.sub);
    }

    if (tileId >= 2048) {
      const offset = tileId - 2048;
      const sectionIndex = Math.floor(offset / 48);
      const indexInSection = offset % 48;

      if (sectionIndex <= 4) {
        const validIndex = Math.floor(indexInSection / 3);
        if (validIndex < 16) return sectionIndex * 16 + validIndex;
      }
      return sectionIndex * 16 + Math.floor(indexInSection / 3);
    }

    return -1;
  }

  /**
   * Convert progressive ID to tile ID
   */
  function getProgressiveIdToTileId(pId) {
    const ranges = [
      [
        0,
        80,
        (id) => {
          const sect = Math.floor(id / 16);
          const idx = id % 16;
          return 2048 + sect * 48 + idx * 3;
        },
      ],
      [80, 336, (id) => id - 80],
      [336, 592, (id) => 256 + (id - 336)],
      [592, 848, (id) => 512 + (id - 592)],
      [848, 1104, (id) => 768 + (id - 848)],
    ];

    for (const [min, max, calc] of ranges) {
      if (pId >= min && pId < max) return calc(pId);
    }
    return 0;
  }

  /**
   * Convert tile type (A1-E) and index to tile ID
   * Special handling for A4 cliff tags (1-16):
   * - Tags 1-8: First row of ceilings/walls
   * - Tags 9-16: Second row of ceilings/walls
   */
  function getTileIdFromTypeAndIndex(tileType, index) {
    const type = tileType.toUpperCase();

    if (type.startsWith("A")) {
      const typeNum = parseInt(type.substring(1)) || 1;

      // Standard RPG Maker MZ autotiles
      // A5: 1536-1663 (128 autotile variants)
      if (typeNum === 5) {
        return 1536 + (index - 0); // index 0-127 maps to 1536-1663
      }

      // Extended A-sheets in 2048+ range (A1, A2, A3, A4)
      if (typeNum === 4 && index >= 1 && index <= 16) {
        const baseA4 = 2048 + 3 * 48;
        return baseA4 + (index - 1);
      }

      return 2048 + (typeNum - 1) * 48 + (index - 1) * 48;
    } else if (type === "B") {
      return index - 1;
    } else if (type === "C") {
      return 256 + (index - 1);
    } else if (type === "D") {
      return 512 + (index - 1);
    } else if (type === "E") {
      return 768 + (index - 1);
    }

    return 0;
  }

  // ===== BIOME LOOKUP FUNCTIONS =====

  /**
   * Get biome for tile position on world map using biomeIds from BIOMES
   */
  function getBiomeForWorldTile(worldTileId) {
    const progressiveId = getTileIdToProgressiveId(worldTileId);
    if (progressiveId < 0) {
      return "Fields";
    }

    for (const biome of BIOMES) {
      if (biome.biomeIds && biome.biomeIds.includes(progressiveId)) {
        return biome.name;
      }
    }

    return "Fields";
  }

  /**
   * Get road direction from world tile using biomeIds from BIOMES
   */
  function getRoadDirectionFromWorldTile(worldTileId) {
    const progressiveId = getTileIdToProgressiveId(worldTileId);

    if (progressiveId < 0) {
      return null;
    }

    for (const biome of BIOMES) {
      if (biome.biomeIds && biome.biomeIds.includes(progressiveId) && biome.name.startsWith("Road ")) {
        const direction = biome.name.substring(5).toLowerCase();
        return direction;
      }
    }

    return null;
  }

  /**
   * Get biome object by name (with caching)
   */
  function getBiomeByName(biomeName) {
    if (!Cache.biomeNameCache[biomeName]) {
      Cache.biomeNameCache[biomeName] =
        BIOMES.find((b) => b.name === biomeName) || null;
    }
    return Cache.biomeNameCache[biomeName];
  }

  // ===== TERRAIN FEATURE PARSING =====

  /**
   * Parse a single tile from format like: B10, B 10, A1 2, A12
   */
  function parseSingleTileString(tileStr) {
    const trimmed = tileStr.trim();

    // B-E sheet format: B10 or B 10
    const bcdeMatch = trimmed.match(/^([B-E])\s*(\d+)$/i);
    if (bcdeMatch) {
      const type = bcdeMatch[1].toUpperCase();
      const index = parseInt(bcdeMatch[2]);
      return getTileIdFromTypeAndIndex(type, index);
    }

    // A-sheet format: A1 2 or A12
    const aSheetMatch = trimmed.match(/^A([1-5])\s*(\d+)$/i);
    if (aSheetMatch) {
      const sheetNum = parseInt(aSheetMatch[1]);
      const index = parseInt(aSheetMatch[2]);
      return getTileIdFromTypeAndIndex(`A${sheetNum}`, index);
    }

    return 0;
  }

  /**
   * Parse terrain feature definitions from tileset notes
   * Supports:
   * - Multi-tile grids: <Feature: [B10, B11],[B20, B21]>
   * - Single tiles: <Feature: B10> or <Feature: B 10> or <Feature: A1 2>
   */
  function parseTerrainFeatures(tilesetId) {
    const tileset = $dataTilesets[tilesetId];
    if (!tileset || !tileset.note) {
      return {};
    }

    const features = {};
    const noteLines = tileset.note.split("\n");

    for (const line of noteLines) {
      // Try multi-tile format first: <FeatureName: [tile1, tile2],[tile3, tile4]>
      const multiTileMatch = line.match(/<(\w+):\s*(\[.*\](?:\s*,\s*\[.*\])*)>/);
      if (multiTileMatch) {
        const featureName = multiTileMatch[1];
        const gridString = multiTileMatch[2];

        const rows = gridString.match(/\[([^\]]*)\]/g);
        if (rows && rows.length > 0) {
          const grid = rows.map((row) => {
            const tileStrings = row.slice(1, -1).split(",");
            const tiles = tileStrings
              .map((t) => parseSingleTileString(t))
              .filter((t) => t > 0);
            return tiles;
          });

          if (grid.length > 0 && grid[0].length > 0) {
            if (!features[featureName]) {
              features[featureName] = [];
            }

            // Store multi-tile feature variant
            const maxWidth = Math.max(...grid.map((r) => r.length));
            features[featureName].push({
              type: "grid",
              grid: grid,
              width: maxWidth,
              height: grid.length,
            });
            continue;
          }
        }
      }

      // Try single-tile format: <FeatureName: B10> or <FeatureName: B 10> or <FeatureName: A1 2>
      const singleTileMatch = line.match(
        /<(\w+):\s*([A-E]\d+\s*\d*|[B-E]\d+)>/i
      );
      if (singleTileMatch) {
        const featureName = singleTileMatch[1];
        const tileStr = singleTileMatch[2];
        const tileId = parseSingleTileString(tileStr);

        if (tileId > 0) {
          if (!features[featureName]) {
            features[featureName] = [];
          }
          // Store single-tile feature variant
          features[featureName].push({
            type: "single",
            tileId: tileId,
          });
        }
      }
    }

    return features;
  }

  // ===== RANDOM NUMBER GENERATION =====

  /**
   * Seeded random number generator (Mulberry32)
   */
  function createSeededRandom(seed) {
    return function () {
      seed = (seed + 0x6d2b79f5) >>> 0;
      let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296.0;
    };
  }

  /**
   * Get random element from array using seeded RNG
   */
  function randomChoice(array, rng) {
    if (array.length === 0) return 0;
    return array[Math.floor(rng() * array.length)];
  }

  // ===== HELPER FUNCTIONS =====

  /**
   * Normalize biome name for edge detection
   */
  function normalizeBiomeForEdge(biomeName) {
    if (biomeName && biomeName.startsWith("Road ")) {
      return "Road";
    }
    return biomeName;
  }

  /**
   * Check if a world coordinate has a non-procedural destination
   * Now supports multiple coordinate pairs in coords array.
   * First coord is the main position, others are for directional border transitions.
   */
  function getNonProceduralDestination(worldX, worldY, exitDirection) {
    for (const [key, location] of Object.entries(
      NON_PROCEDURAL_COORDINATES
    )) {
      // Check if worldX, worldY matches ANY coordinate pair in the array
      const foundCoord = location.coords.some(
        (coord) => coord[0] === worldX && coord[1] === worldY
      );

      if (foundCoord) {
        // Determine direction from exit direction
        let direction = null;
        switch (exitDirection) {
          case 2:
            direction = "south";
            break;
          case 4:
            direction = "west";
            break;
          case 6:
            direction = "east";
            break;
          case 8:
            direction = "north";
            break;
        }

        if (direction && location[direction]) {
          const dest = location[direction];
          return {
            exists: true,
            destination: { mapId: dest.id, x: dest.x, y: dest.y },
          };
        }

        return { exists: true, destination: null };
      }
    }

    return { exists: false, destination: null };
  }

  // ===== NOISE FUNCTIONS =====

  /**
   * Perlin-style noise function for terrain generation
   */
  function noise2D(x, y, seed = 0) {
    const n = x + y * 57 + seed * 131;
    let noise = (n << 13) ^ n;
    return (
      1.0 -
      ((noise * (noise * noise * 15731 + 789221) + 1376312589) & 0x7fffffff) /
        1073741824.0
    );
  }

  /**
   * Smooth noise with interpolation
   */
  function smoothNoise(x, y, seed) {
    const corners =
      (Cache.getNoise(x - 1, y - 1, seed) +
        Cache.getNoise(x + 1, y - 1, seed) +
        Cache.getNoise(x - 1, y + 1, seed) +
        Cache.getNoise(x + 1, y + 1, seed)) /
      16;
    const sides =
      (Cache.getNoise(x - 1, y, seed) +
        Cache.getNoise(x + 1, y, seed) +
        Cache.getNoise(x, y - 1, seed) +
        Cache.getNoise(x, y + 1, seed)) /
      8;
    const center = Cache.getNoise(x, y, seed) / 4;
    return corners + sides + center;
  }

  // ===== COORDINATE MANAGEMENT =====

  /**
   * Calculate tile index in map data array
   */
  function calculateIndex(x, y, z, width, height) {
    return z * width * height + y * width + x;
  }

  /**
   * Get adjacent biomes on world map (north, south, east, west)
   */
  function getAdjacentBiomesOnWorldMap(originX, originY) {
    const adjacent = { north: null, south: null, east: null, west: null };

    if ($gameMap.mapId() !== WORLD_MAP_ID) {
      return adjacent;
    }

    const mapW = $gameMap.width();
    const mapH = $gameMap.height();

    const dirs = [
      ["north", 0, -1, () => originY > 0],
      ["south", 0, 1, () => originY < mapH - 1],
      ["east", 1, 0, () => originX < mapW - 1],
      ["west", -1, 0, () => originX > 0],
    ];

    dirs.forEach(([key, dx, dy, isValid]) => {
      if (isValid()) {
        const tx = originX + dx;
        const ty = originY + dy;
        const tileId = [0, 1, 2, 3].reduce(
          (acc, z) => acc || $gameMap.tileId(tx, ty, z),
          0
        );
        const biomeName = getBiomeForWorldTile(tileId);
        adjacent[key] = biomeName;
      }
    });

    console.log(`[getAdjacentBiomesOnWorldMap] At (${originX}, ${originY}): N=${adjacent.north}, S=${adjacent.south}, E=${adjacent.east}, W=${adjacent.west}`);
    return adjacent;
  }

  /**
   * Get adjacent biome names from cache
   */
  function getAdjacentBiomesFromCache(worldX, worldY, cache) {
    const adjacent = {
      north: null,
      south: null,
      east: null,
      west: null,
    };

    if (!cache || Object.keys(cache).length === 0) {
      return adjacent;
    }

    const mapWidth = 512;
    const mapHeight = 512;

    // Check only immediate cardinal neighbors
    if (worldY > 0) {
      for (const [biomeName, coordinates] of Object.entries(cache)) {
        if (
          coordinates.some(
            (coord) => coord.x === worldX && coord.y === worldY - 1
          )
        ) {
          adjacent.north = biomeName;
          break;
        }
      }
    }

    if (worldY < mapHeight - 1) {
      for (const [biomeName, coordinates] of Object.entries(cache)) {
        if (
          coordinates.some(
            (coord) => coord.x === worldX && coord.y === worldY + 1
          )
        ) {
          adjacent.south = biomeName;
          break;
        }
      }
    }

    if (worldX < mapWidth - 1) {
      for (const [biomeName, coordinates] of Object.entries(cache)) {
        if (
          coordinates.some(
            (coord) => coord.x === worldX + 1 && coord.y === worldY
          )
        ) {
          adjacent.east = biomeName;
          break;
        }
      }
    }

    if (worldX > 0) {
      for (const [biomeName, coordinates] of Object.entries(cache)) {
        if (
          coordinates.some(
            (coord) => coord.x === worldX - 1 && coord.y === worldY
          )
        ) {
          adjacent.west = biomeName;
          break;
        }
      }
    }

    return adjacent;
  }

  /**
   * Check biome composition at the borders of an adjacent world map tile (cardinal directions only)
   */
  function checkAdjacentMapBiomesFromCache(worldX, worldY, cache) {
    const mapW = $gameMap.mapId() === 315 ? $gameMap.width() : 512;
    const mapH = $gameMap.mapId() === 315 ? $gameMap.height() : 512;
    const borderBiomes = { north: [], south: [], east: [], west: [] };

    if (!cache || Object.keys(cache).length === 0) return borderBiomes;

    // Check only immediate cardinal neighbors
    const checks = [
      [worldY > 0, worldX, worldY - 1, "north"],
      [worldY < mapH - 1, worldX, worldY + 1, "south"],
      [worldX < mapW - 1, worldX + 1, worldY, "east"],
      [worldX > 0, worldX - 1, worldY, "west"],
    ];

    for (const [isValid, checkX, checkY, dir] of checks) {
      if (!isValid) continue;

      for (const [biomeName, coords] of Object.entries(cache)) {
        if (coords.some((c) => c.x === checkX && c.y === checkY)) {
          if (!borderBiomes[dir].includes(biomeName)) {
            borderBiomes[dir].push(biomeName);
          }
        }
      }
    }
    return borderBiomes;
  }

  /**
   * Check biome composition at the diagonal neighbors of a world map tile
   * Returns object with diagonal biome arrays: topLeft, topRight, bottomLeft, bottomRight
   */
  function checkDiagonalMapBiomesFromCache(worldX, worldY, cache) {
    const mapW = $gameMap.mapId() === 315 ? $gameMap.width() : 512;
    const mapH = $gameMap.mapId() === 315 ? $gameMap.height() : 512;
    const diagonalBiomes = {
      topLeft: [],
      topRight: [],
      bottomLeft: [],
      bottomRight: [],
    };

    if (!cache || Object.keys(cache).length === 0) return diagonalBiomes;

    // Check diagonal neighbors
    const diagonalChecks = [
      [worldX > 0 && worldY > 0, worldX - 1, worldY - 1, "topLeft"],
      [worldX < mapW - 1 && worldY > 0, worldX + 1, worldY - 1, "topRight"],
      [worldX > 0 && worldY < mapH - 1, worldX - 1, worldY + 1, "bottomLeft"],
      [worldX < mapW - 1 && worldY < mapH - 1, worldX + 1, worldY + 1, "bottomRight"],
    ];

    for (const [isValid, checkX, checkY, dir] of diagonalChecks) {
      if (!isValid) continue;

      for (const [biomeName, coords] of Object.entries(cache)) {
        if (coords.some((c) => c.x === checkX && c.y === checkY)) {
          if (!diagonalBiomes[dir].includes(biomeName)) {
            diagonalBiomes[dir].push(biomeName);
          }
        }
      }
    }
    return diagonalBiomes;
  }

  /**
   * Check if a tile ID is a water tile
   * This is a simple utility used by feature placement functions
   */
  function isWaterTileId(tileId, waterTileSet) {
    if (!tileId || tileId === 0 || !waterTileSet) {
      return false;
    }
    return waterTileSet.has(tileId);
  }

  /**
   * Get a random feature variant from a feature array
   * Handles both single-tile and multi-tile variants
   */
  function getRandomFeatureVariant(featureArray, rng) {
    if (!featureArray || featureArray.length === 0) return null;

    const variant = randomChoice(featureArray, rng);
    return variant;
  }

  /**
   * Check if a tile position is already occupied by a feature on the current layer
   * Returns true if the tile is occupied, false if it's empty
   */
  function isTileOccupiedOnLayer(mapData, x, y, layer, width, height) {
    // Only check the same layer being filled for occupation
    const idx = calculateIndex(x, y, layer, width, height);
    return mapData[idx] !== 0;
  }

  /**
   * Place a multi-tile feature on the map
   * Checks water collision, beach placement, path tiles, occupied tiles, and bounds
   * Avoids placing if any tile would overlap water, beach, path tiles, or existing features
   * IMPORTANT: Never overwrites Path, PathDesert, or PathIce tiles
   */
  function placeMultiTileFeature(
    mapData,
    grid,
    startX,
    startY,
    layer,
    width,
    height,
    waterTileSet,
    pathTileSet
  ) {
    const beachCoordinates = window.ProcGenUtils?.beachCoordinates;

    // Check if placement is valid (no water collision, no beach, no path tiles, no occupied tiles, and within bounds)
    for (let gy = 0; gy < grid.length; gy++) {
      const row = grid[gy];
      for (let gx = 0; gx < row.length; gx++) {
        const mapX = startX + gx;
        const mapY = startY + gy;

        // Check bounds
        if (mapX < 0 || mapX >= width || mapY < 0 || mapY >= height) {
          return false;
        }

        // Check if base layer has water
        const baseIdx = calculateIndex(mapX, mapY, 0, width, height);
        const baseTile = mapData[baseIdx];

        if (isWaterTileId(baseTile, waterTileSet)) {
          return false;
        }

        // Check if on beach
        if (beachCoordinates && beachCoordinates.has(`${mapX},${mapY}`)) {
          return false;
        }

        // NEVER overwrite path tiles (Path, PathDesert, PathIce)
        if (pathTileSet && pathTileSet.has(baseTile)) {
          return false;
        }

        // Check if tile is already occupied by a feature on the same layer
        const occupiedIdx = calculateIndex(mapX, mapY, layer, width, height);
        if (mapData[occupiedIdx] !== 0) {
          return false;
        }
      }
    }

    // Placement is valid, place all tiles
    for (let gy = 0; gy < grid.length; gy++) {
      const row = grid[gy];
      for (let gx = 0; gx < row.length; gx++) {
        const mapX = startX + gx;
        const mapY = startY + gy;
        const idx = calculateIndex(mapX, mapY, layer, width, height);
        mapData[idx] = row[gx];
      }
    }

    return true;
  }

  /**
   * Generate noise features while avoiding water tiles and path tiles
   * Supports both single-tile and multi-tile feature variants
   * IMPORTANT: Never overwrites Path, PathDesert, or PathIce tiles
   */
  function generateFeatureNoise(
    mapData,
    featureVariants,
    layer,
    width,
    height,
    seed,
    threshold,
    rng,
    waterTiles,
    pathTiles
  ) {
    const scale = 0.05;
    const waterTileSet = waterTiles ? new Set(waterTiles) : null;
    const pathTileSet = pathTiles ? new Set(pathTiles) : null;
    const beachCoordinates = window.ProcGenUtils?.beachCoordinates;

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const noiseValue = smoothNoise(x * scale, y * scale, seed);
        if (noiseValue > threshold) {
          const baseIdx = calculateIndex(x, y, 0, width, height);
          const baseTile = mapData[baseIdx];

          // Skip water tiles, beach tiles, and path tiles
          if (!isWaterTileId(baseTile, waterTileSet) &&
              !(beachCoordinates && beachCoordinates.has(`${x},${y}`)) &&
              !(pathTileSet && pathTileSet.has(baseTile))) {
            const variant = getRandomFeatureVariant(featureVariants, rng);

            if (variant) {
              if (variant.type === "single") {
                // Check if this tile is already occupied by a feature on the same layer
                if (!isTileOccupiedOnLayer(mapData, x, y, layer, width, height)) {
                  const idx = calculateIndex(x, y, layer, width, height);
                  mapData[idx] = variant.tileId;
                }
              } else if (variant.type === "grid") {
                placeMultiTileFeature(
                  mapData,
                  variant.grid,
                  x,
                  y,
                  layer,
                  width,
                  height,
                  waterTileSet,
                  pathTileSet
                );
              }
            }
          }
        }
      }
    }
  }

  /**
   * Generate scattered features (trees, rocks, etc) with seeded RNG
   * Supports both single-tile and multi-tile feature variants
   * IMPORTANT: Never overwrites Path, PathDesert, or PathIce tiles
   */
  function generateFeatureScattered(
    mapData,
    featureVariants,
    layer,
    width,
    height,
    seed,
    density,
    rng,
    waterTiles,
    pathTiles
  ) {
    const waterTileSet = waterTiles ? new Set(waterTiles) : null;
    const pathTileSet = pathTiles ? new Set(pathTiles) : null;
    const beachCoordinates = window.ProcGenUtils?.beachCoordinates;

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        if (rng() < density) {
          const baseIdx = calculateIndex(x, y, 0, width, height);
          const baseTile = mapData[baseIdx];

          // Skip water tiles, beach tiles, and path tiles
          if (!isWaterTileId(baseTile, waterTileSet) &&
              !(beachCoordinates && beachCoordinates.has(`${x},${y}`)) &&
              !(pathTileSet && pathTileSet.has(baseTile))) {
            const variant = getRandomFeatureVariant(featureVariants, rng);

            if (variant) {
              if (variant.type === "single") {
                // Check if this tile is already occupied by a feature on the same layer
                if (!isTileOccupiedOnLayer(mapData, x, y, layer, width, height)) {
                  const idx = calculateIndex(x, y, layer, width, height);
                  mapData[idx] = variant.tileId;
                }
              } else if (variant.type === "grid") {
                placeMultiTileFeature(
                  mapData,
                  variant.grid,
                  x,
                  y,
                  layer,
                  width,
                  height,
                  waterTileSet,
                  pathTileSet
                );
              }
            }
          }
        }
      }
    }
  }

  /**
   * Fractional Brownian Motion for complex coastline patterns
   * Creates jagged, realistic coastlines by layering multiple noise octaves
   */
  function fbmNoise(x, y, seed, octaves = 4, lacunarity = 2.0, persistence = 0.6) {
    let amplitude = 1.0;
    let frequency = 1.0;
    let value = 0.0;
    let maxValue = 0.0;

    for (let i = 0; i < octaves; i++) {
      value += smoothNoise(x * frequency, y * frequency, seed + i * 1000) * amplitude;
      maxValue += amplitude;
      amplitude *= persistence;
      frequency *= lacunarity;
    }

    return value / maxValue;
  }



  /**
   * Drunken walk cave carving algorithm
   * Fills a map with walls then carves passages using random walk
   */
  function generateCaveWithDrunkenWalk(width, height, tileWidth, tileCarvingPercentage, seed, caveFloorTile, caveCeilingTile) {
    const rng = createSeededRandom(seed);

    // Calculate number of steps to carve based on percentage
    const totalTiles = width * height;
    const targetCarvedTiles = Math.floor(totalTiles * tileCarvingPercentage);
    let carvedCount = 0;

    // Create a boolean grid to track carved areas
    const carved = Array(height).fill(null).map(() => Array(width).fill(false));

    // Start from a random position
    let x = Math.floor(rng() * width);
    let y = Math.floor(rng() * height);

    // Directions: up, down, left, right
    const directions = [
      { dx: 0, dy: -1 }, // up
      { dx: 0, dy: 1 },  // down
      { dx: -1, dy: 0 }, // left
      { dx: 1, dy: 0 }   // right
    ];

    // Drunken walk
    while (carvedCount < targetCarvedTiles) {
      // Randomly choose a direction
      const dir = directions[Math.floor(rng() * directions.length)];

      // Take a step
      x = (x + dir.dx + width) % width;
      y = (y + dir.dy + height) % height;

      // Mark as carved if not already
      if (!carved[y][x]) {
        carved[y][x] = true;
        carvedCount++;
      }
    }

    // Create the map data array (4 layers)
    const mapData = new Array(tileWidth * height * 4);
    mapData.fill(0);

    // Fill the map with wall/floor tiles based on carved areas
    for (let ty = 0; ty < height; ty++) {
      for (let tx = 0; tx < width; tx++) {
        const tileValue = carved[ty][tx] ? caveFloorTile : caveCeilingTile;

        // Layer 0 (main terrain)
        mapData[calculateIndex(tx, ty, 0, width, height)] = tileValue;
      }
    }

    return mapData;
  }

  /**
   * Cellular automata cave generation algorithm
   * Creates cave systems using cellular automata rules - ideal for flooded caves with natural caverns
   * Starts with ~50% random floor tiles and iterates rules to create connected chambers
   */
  function generateCaveWithCellularAutomata(width, height, tileWidth, seed, caveFloorTile, caveCeilingTile) {
    const rng = createSeededRandom(seed);
    const iterations = 4;  // Number of cellular automata iterations
    const initialFloorChance = 0.48;  // Initial floor probability

    // Initialize grid with random floor/wall tiles
    let grid = Array(height).fill(null).map(() =>
      Array(width).fill(null).map(() => rng() < initialFloorChance)
    );

    // Apply cellular automata rules for specified iterations
    for (let iter = 0; iter < iterations; iter++) {
      const newGrid = Array(height).fill(null).map(() => Array(width).fill(false));

      for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
          // Count floor neighbors (including diagonals)
          let floorNeighbors = 0;
          for (let dy = -1; dy <= 1; dy++) {
            for (let dx = -1; dx <= 1; dx++) {
              if (dx === 0 && dy === 0) continue;  // Skip self
              const ny = (y + dy + height) % height;
              const nx = (x + dx + width) % width;
              if (grid[ny][nx]) floorNeighbors++;
            }
          }

          // Apply cellular automata rules
          // A tile becomes floor if it has 4+ floor neighbors, otherwise wall
          // This creates connected cave systems
          newGrid[y][x] = floorNeighbors >= 4;
        }
      }

      grid = newGrid;
    }

    // Create the map data array (4 layers)
    const mapData = new Array(tileWidth * height * 4);
    mapData.fill(0);

    // Fill the map with wall/floor tiles
    for (let ty = 0; ty < height; ty++) {
      for (let tx = 0; tx < width; tx++) {
        const tileValue = grid[ty][tx] ? caveFloorTile : caveCeilingTile;
        mapData[calculateIndex(tx, ty, 0, width, height)] = tileValue;
      }
    }

    return mapData;
  }

  /**
   * Voronoi diagram cave generation algorithm
   * Creates cave systems using Voronoi diagrams - ideal for ice caves with geometric chambers
   * Generates seed points and carves floor tiles near those points, creating distinct chambers
   * Also carves diagonal geometric tunnels connecting nearby rooms for traversability
   * Ensures tunnels reach open map edges for global connectivity
   */
  function generateCaveWithVoronoi(width, height, tileWidth, seed, caveFloorTile, caveCeilingTile) {
    const rng = createSeededRandom(seed);
    const numSeeds = Math.floor(width * height / 1500);  // Roughly 1 chamber per 1500 tiles
    const carvingThreshold = 5.5;  // Distance threshold for carving (lower = more carving)
    const tunnelWidth = 1.5;  // Width of connecting tunnels

    // Generate random seed points
    const seeds = [];
    for (let i = 0; i < numSeeds; i++) {
      seeds.push({
        x: Math.floor(rng() * width),
        y: Math.floor(rng() * height),
        index: i
      });
    }

    // Create the map data array (4 layers)
    const mapData = new Array(tileWidth * height * 4);
    mapData.fill(0);

    // For each tile, find nearest seed and determine if it should be carved
    for (let ty = 0; ty < height; ty++) {
      for (let tx = 0; tx < width; tx++) {
        let minDistance = Infinity;

        // Find distance to nearest seed point
        for (const seed of seeds) {
          const dx = tx - seed.x;
          const dy = ty - seed.y;
          // Use toroidal wrapping for seamless maps
          const wrappedDx = Math.min(Math.abs(dx), width - Math.abs(dx));
          const wrappedDy = Math.min(Math.abs(dy), height - Math.abs(dy));
          const distance = Math.sqrt(wrappedDx * wrappedDx + wrappedDy * wrappedDy);

          if (distance < minDistance) {
            minDistance = distance;
          }
        }

        // Carve if close to a seed point (creating Voronoi cells)
        const tileValue = minDistance <= carvingThreshold ? caveFloorTile : caveCeilingTile;
        mapData[calculateIndex(tx, ty, 0, width, height)] = tileValue;
      }
    }

    // Carve diagonal tunnels connecting nearby rooms
    // Build adjacency graph of nearest neighbors for each seed
    for (let i = 0; i < seeds.length; i++) {
      const currentSeed = seeds[i];
      const neighbors = [];

      // Find closest neighbors to this seed
      for (let j = 0; j < seeds.length; j++) {
        if (i === j) continue;

        const otherSeed = seeds[j];
        const dx = otherSeed.x - currentSeed.x;
        const dy = otherSeed.y - currentSeed.y;
        // Use toroidal distance
        const wrappedDx = Math.abs(dx) < width / 2 ? dx : (dx > 0 ? dx - width : dx + width);
        const wrappedDy = Math.abs(dy) < height / 2 ? dy : (dy > 0 ? dy - height : dy + height);
        const distance = Math.sqrt(wrappedDx * wrappedDx + wrappedDy * wrappedDy);

        neighbors.push({ seed: otherSeed, distance });
      }

      // Sort by distance and keep only closest neighbors
      neighbors.sort((a, b) => a.distance - b.distance);
      // Connect to more neighbors for denser tunnel networks (4-6 instead of 2-3)
      const maxConnections = Math.min(6, Math.ceil(seeds.length / 4));
      const closestNeighbors = neighbors.slice(0, maxConnections);

      // Carve tunnels to closest neighbors (only from lower-index seeds to avoid duplicates)
      for (const neighbor of closestNeighbors) {
        if (i < neighbor.seed.index) {
          carveDiagonalTunnel(
            mapData,
            currentSeed.x,
            currentSeed.y,
            neighbor.seed.x,
            neighbor.seed.y,
            width,
            height,
            caveFloorTile,
            tunnelWidth
          );
        }
      }

      // Add random cross-tunnels to increase connectivity (30% chance per seed)
      if (rng() < 0.3 && neighbors.length > maxConnections) {
        // Pick a random neighbor that wasn't already connected
        const unconnectedNeighbors = neighbors.slice(maxConnections);
        const randomNeighbor = unconnectedNeighbors[Math.floor(rng() * unconnectedNeighbors.length)];

        if (randomNeighbor) {
          carveDiagonalTunnel(
            mapData,
            currentSeed.x,
            currentSeed.y,
            randomNeighbor.seed.x,
            randomNeighbor.seed.y,
            width,
            height,
            caveFloorTile,
            tunnelWidth
          );
        }
      }
    }


    return mapData;
  }

  /**
   * Carve a diagonal tunnel between two points using line rasterization
   * Creates a geometric passage between rooms with specified width
   */
  function carveDiagonalTunnel(mapData, x1, y1, x2, y2, width, height, floorTile, tunnelWidth) {
    // Handle toroidal wrapping - choose shortest path
    let dx = x2 - x1;
    let dy = y2 - y1;

    if (Math.abs(dx) > width / 2) {
      dx = dx > 0 ? dx - width : dx + width;
    }
    if (Math.abs(dy) > height / 2) {
      dy = dy > 0 ? dy - height : dy + height;
    }

    // Calculate actual end point considering wrapping
    let endX = (x1 + dx + width) % width;
    let endY = (y1 + dy + height) % height;

    // Use Bresenham-like line algorithm to carve the tunnel
    const steps = Math.max(Math.abs(dx), Math.abs(dy));
    if (steps === 0) return;

    for (let step = 0; step <= steps; step++) {
      const t = steps > 0 ? step / steps : 0;
      const currentX = Math.round(x1 + dx * t);
      const currentY = Math.round(y1 + dy * t);

      // Carve a small area around the tunnel line
      const radius = Math.ceil(tunnelWidth);
      for (let ty = currentY - radius; ty <= currentY + radius; ty++) {
        for (let tx = currentX - radius; tx <= currentX + radius; tx++) {
          // Wrap coordinates toroidally
          const wrappedX = (tx % width + width) % width;
          const wrappedY = (ty % height + height) % height;
          const distance = Math.sqrt((tx - currentX) ** 2 + (ty - currentY) ** 2);

          // Carve with falloff for smooth tunnel edges
          if (distance <= tunnelWidth) {
            const idx = calculateIndex(wrappedX, wrappedY, 0, width, height);
            mapData[idx] = floorTile;
          }
        }
      }
    }
  }

  /**
   * Generate mountain terrain using inverted cellular automata
   * Creates mountain peaks and cliff formations using inverted cellular automata
   * Reuses the cellular automata algorithm but inverts the result:
   * - CA floor becomes MountainCeiling (peaks)
   * - CA walls become open terrain (valleys)
   * Places MountainWall tiles below each ceiling for visual depth
   * Parameters are randomized by world coordinates for regional variation
   */

  /**
   * Generate a random seeded safe zone in the middle of the map
   * Creates either a circular or square safe zone (randomly chosen based on seed)
   * Safe zone prevents mountains from spawning, creating a landing area for teleported players
   * @param {Array<Array<boolean>>} grid - Mountain CA grid to modify
   * @param {number} width - Map width
   * @param {number} height - Map height
   * @param {number} seed - Seed for randomization
   */
  function applyMountainCenterSafeZone(grid, width, height, seed) {
    const rng = createSeededRandom(seed);

    // Determine safe zone parameters based on seed
    const isCircular = rng() < 0.5;  // 50% chance of circular vs square
    const minRadius = 12;  // Minimum safe zone radius (12-18 tiles)
    const maxRadius = 18;
    const radius = Math.floor(rng() * (maxRadius - minRadius + 1)) + minRadius;

    const centerX = Math.floor(width / 2);
    const centerY = Math.floor(height / 2);

    if (isCircular) {
      // Create circular safe zone
      const radiusSquared = radius * radius;
      for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
          const dx = x - centerX;
          const dy = y - centerY;
          const distSquared = dx * dx + dy * dy;

          // Force to floor (true) if within circle
          if (distSquared <= radiusSquared) {
            grid[y][x] = true;  // true = floor (no mountain)
          }
        }
      }
    } else {
      // Create square safe zone
      const halfRadius = Math.floor(radius / 2);
      for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
          // Check if within square bounds
          const inX = Math.abs(x - centerX) <= halfRadius;
          const inY = Math.abs(y - centerY) <= halfRadius;

          // Force to floor (true) if within square
          if (inX && inY) {
            grid[y][x] = true;  // true = floor (no mountain)
          }
        }
      }
    }
  }

  function generateMountainBiomeTerrain(width, height, tileWidth, seed, mountainCeilingTile, mountainWallTile, baseTerrainData, worldCoords) {
    const rng = createSeededRandom(seed);

    // Randomize parameters based on world coordinates for regional mountain variety
    const coordSeed = (worldCoords?.x || 0) * 73856093 ^ (worldCoords?.y || 0) * 19349663;
    const coordRng = createSeededRandom(coordSeed);

    // Randomize iterations (2-4): affects how smoothed/carved the mountains are
    // Lower iterations = rougher, more jagged peaks
    // Higher iterations = smoother, more eroded formations
    const iterations = Math.floor(coordRng() * 3) + 2;

    // Randomize initial floor chance (0.55-0.75): affects mountain density
    // Lower = denser mountains with fewer valleys
    // Higher = sparse mountains with more terrain
    const initialFloorChance = 0.55 + (coordRng() * 0.20);

    // Randomize CA threshold (4-5): affects how connected mountains are
    // 4 = more connected mountain ranges
    // 5 = more isolated peaks with deeper valleys
    const caThreshold = coordRng() < 0.5 ? 4 : 5;

    // Randomize wall heights (1-4 for min, minWallHeight-8 for max)
    // This creates regional variety in cliff steepness
    const minWallHeight = Math.floor(coordRng() * 4) + 1;  // 1-4 tiles minimum
    const maxWallHeight = Math.floor(coordRng() * (8 - minWallHeight + 1)) + minWallHeight;  // minWallHeight-8 tiles maximum

    // Initialize grid with random floor/wall tiles
    let grid = Array(height).fill(null).map(() =>
      Array(width).fill(null).map(() => rng() < initialFloorChance)
    );

    // Apply cellular automata rules for specified iterations
    for (let iter = 0; iter < iterations; iter++) {
      const newGrid = Array(height).fill(null).map(() => Array(width).fill(false));

      for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
          // Count floor neighbors (including diagonals)
          let floorNeighbors = 0;
          for (let dy = -1; dy <= 1; dy++) {
            for (let dx = -1; dx <= 1; dx++) {
              if (dx === 0 && dy === 0) continue;  // Skip self
              const ny = (y + dy + height) % height;
              const nx = (x + dx + width) % width;
              if (grid[ny][nx]) floorNeighbors++;
            }
          }

          // Apply cellular automata rules
          // A tile becomes floor if it has caThreshold+ floor neighbors, otherwise wall
          // Lower threshold (4) = more connected mountains
          // Higher threshold (5) = more isolated peaks with deeper valleys
          newGrid[y][x] = floorNeighbors >= caThreshold;
        }
      }

      grid = newGrid;
    }

    // Apply varying border safe zones (3-6 tiles) with smooth noise
    // This prevents mountains from appearing at the boundaries where adjacent biomes connect
    // Create a seeded RNG for border noise
    const borderNoiseRng = createSeededRandom(seed + 42);

    // Generate noise-based border widths for all 4 edges (3-6 tiles, varying smoothly)
    // Use subtle multi-frequency harmonics for organic shapes without extreme variations
    const getBorderWidth = (position, borderLength) => {
      const normalizedPos = position / borderLength;

      // Subtle multi-frequency harmonic oscillation
      // Primary wave at 2 cycles - main undulation
      const primaryWave = Math.sin(normalizedPos * Math.PI * 2) * 0.15;
      // Secondary wave at 5 cycles - small jagged detail
      const secondaryWave = Math.sin(normalizedPos * Math.PI * 5) * 0.08;

      // Combine harmonics (total range -0.23 to 0.23)
      const harmonicNoise = primaryWave + secondaryWave;
      const normalizedHarmonic = (harmonicNoise + 0.23) / 0.46;  // Normalize to 0-1

      return 3 + Math.floor(normalizedHarmonic * 3);  // 3-6 tile range
    };

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        let isInSafeZone = false;

        // North border - varies based on x position
        const northBorderWidth = getBorderWidth(x, width);
        if (y < northBorderWidth) {
          isInSafeZone = true;
        }

        // South border - varies based on x position
        const southBorderWidth = getBorderWidth(x, width);
        if (y >= height - southBorderWidth) {
          isInSafeZone = true;
        }

        // West border - varies based on y position
        const westBorderWidth = getBorderWidth(y, height);
        if (x < westBorderWidth) {
          isInSafeZone = true;
        }

        // East border - varies based on y position
        const eastBorderWidth = getBorderWidth(y, height);
        if (x >= width - eastBorderWidth) {
          isInSafeZone = true;
        }

        // Force safe zone tiles to be floor (true) - no mountains
        if (isInSafeZone) {
          grid[y][x] = true;  // true = floor (no mountain)
        }
      }
    }

    // Apply random seeded safe zone in the middle of the map
    // Creates circular or square landing area for teleported players
    applyMountainCenterSafeZone(grid, width, height, seed);

    // Create the map data array (4 layers) - start with base terrain
    const mapData = new Array(tileWidth * height * 4);
    mapData.fill(0);

    // Copy base terrain data (biome floor tiles)
    if (baseTerrainData) {
      for (let i = 0; i < baseTerrainData.length; i++) {
        mapData[i] = baseTerrainData[i];
      }
    }

    // Track which positions have mountain ceilings for wall placement
    const mountainPositions = [];

    // First pass: place mountain ceilings (INVERT the cellular automata result)
    // CA walls (false) become mountains (ceiling), CA floors (true) become valleys (base terrain)
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        // Invert: if CA says it's a wall, place mountain ceiling
        if (!grid[y][x]) {
          const idx = calculateIndex(x, y, 0, width, height);
          mapData[idx] = mountainCeilingTile;
          mountainPositions.push({ x, y });
        }
      }
    }

    // Convert MountainCeilings at varying border edges to MountainWalls for cleaner edge appearance
    // This uses the same noise-based border widths as the safe zone
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        // Get border widths for this position
        const northBorderWidth = getBorderWidth(x, width);
        const southBorderWidth = getBorderWidth(x, width);
        const westBorderWidth = getBorderWidth(y, height);
        const eastBorderWidth = getBorderWidth(y, height);

        let shouldConvertToWall = false;

        // Convert ceilings at the outer edge of each border (innermost safe zone row)
        // North border: at y = northBorderWidth - 1
        if (y === northBorderWidth - 1) {
          shouldConvertToWall = true;
        }
        // South border: at y = height - southBorderWidth
        if (y === height - southBorderWidth) {
          shouldConvertToWall = true;
        }
        // West border: at x = westBorderWidth - 1
        if (x === westBorderWidth - 1) {
          shouldConvertToWall = true;
        }
        // East border: at x = width - eastBorderWidth
        if (x === width - eastBorderWidth) {
          shouldConvertToWall = true;
        }

        if (shouldConvertToWall) {
          const idx = calculateIndex(x, y, 0, width, height);
          if (mapData[idx] === mountainCeilingTile) {
            mapData[idx] = mountainWallTile;
            // Remove this position from mountainPositions since it's now a wall
            const posIndex = mountainPositions.findIndex(pos => pos.x === x && pos.y === y);
            if (posIndex !== -1) {
              mountainPositions.splice(posIndex, 1);
            }
          }
        }
      }
    }

    // Second pass: place walls below each mountain ceiling
    // Ensure every ceiling has at least one wall below it
    for (const pos of mountainPositions) {
      // Create deterministic height based on position for consistency in clusters
      // Use floor division to group nearby tiles: every 2x2 area gets same height
      const heightRegionX = Math.floor(pos.x / 2);
      const heightRegionY = Math.floor(pos.y / 2);
      const heightSeed = createSeededRandom(seed + heightRegionX * 73856093 ^ heightRegionY * 19349663);

      // Determine wall height using region's min/max - same for all ceilings in 2x2 region
      const heightRange = maxWallHeight - minWallHeight + 1;
      const wallHeight = Math.floor(heightSeed() * heightRange) + minWallHeight;

      // Place wall tiles below the ceiling
      let wallPlaced = false;
      for (let dy = 1; dy <= wallHeight; dy++) {
        const wallY = pos.y + dy;
        if (wallY < height) {
          // Skip wall placement if it would be in varying border safe zone
          const northBorderWidth = getBorderWidth(pos.x, width);
          const southBorderWidth = getBorderWidth(pos.x, width);
          const westBorderWidth = getBorderWidth(wallY, height);
          const eastBorderWidth = getBorderWidth(wallY, height);

          const isNearNorthEdge = wallY < northBorderWidth;
          const isNearSouthEdge = wallY >= height - southBorderWidth;
          const isNearWestEdge = pos.x < westBorderWidth;
          const isNearEastEdge = pos.x >= width - eastBorderWidth;

          if (!(isNearNorthEdge || isNearSouthEdge || isNearWestEdge || isNearEastEdge)) {
            const idx = calculateIndex(pos.x, wallY, 0, width, height);
            const currentTile = mapData[idx];

            // Only place wall if the position isn't occupied by another mountain ceiling
            // Walls can overwrite base terrain to ensure ceiling always has support
            if (currentTile !== mountainCeilingTile) {
              mapData[idx] = mountainWallTile;
              wallPlaced = true;
            }
          }
        }
      }

      // Guarantee at least one wall below ceiling if none was placed
      // (e.g., if ceiling is at bottom edge or surrounded by other ceilings)
      // Also respect the varying border safe zones around border
      if (!wallPlaced && pos.y + 1 < height) {
        const wallY = pos.y + 1;
        const northBorderWidth = getBorderWidth(pos.x, width);
        const southBorderWidth = getBorderWidth(pos.x, width);
        const westBorderWidth = getBorderWidth(wallY, height);
        const eastBorderWidth = getBorderWidth(wallY, height);

        const isNearNorthEdge = wallY < northBorderWidth;
        const isNearSouthEdge = wallY >= height - southBorderWidth;
        const isNearWestEdge = pos.x < westBorderWidth;
        const isNearEastEdge = pos.x >= width - eastBorderWidth;

        // Only place guarantee wall if it's not in the safe zone
        if (!(isNearNorthEdge || isNearSouthEdge || isNearWestEdge || isNearEastEdge)) {
          const idx = calculateIndex(pos.x, wallY, 0, width, height);
          if (mapData[idx] !== mountainCeilingTile) {
            mapData[idx] = mountainWallTile;
          }
        }
      }
    }

    return mapData;
  }

  // ===== BSP DUNGEON GENERATOR =====

  /**
   * Binary Space Partition dungeon generator
   * Creates structured dungeons with rooms and corridors
   * Returns a 2D grid where true = carving (floor/corridor), false = wall
   */
  function generateDungeonBSP(width, height, seed, minRoomSize = 8, maxRoomSize = 16) {
    const rng = createSeededRandom(seed);
    const carved = Array(height).fill(null).map(() => Array(width).fill(false));
    const rooms = [];

    class BSPNode {
      constructor(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.left = null;
        this.right = null;
        this.room = null;
      }
    }

    /**
     * Create a room at this node
     */
    function createRoom(node) {
      const minW = Math.max(3, minRoomSize);
      const maxW = Math.min(node.width - 2, maxRoomSize);
      const minH = Math.max(3, minRoomSize);
      const maxH = Math.min(node.height - 2, maxRoomSize);

      const roomWidth = minW + Math.floor(rng() * (maxW - minW + 1));
      const roomHeight = minH + Math.floor(rng() * (maxH - minH + 1));
      const roomX = node.x + 1 + Math.floor(rng() * (node.width - roomWidth - 2));
      const roomY = node.y + 1 + Math.floor(rng() * (node.height - roomHeight - 2));

      node.room = { x: roomX, y: roomY, width: roomWidth, height: roomHeight };
      return node.room;
    }

    /**
     * Carve room into the grid
     */
    function carveRoom(room) {
      for (let y = room.y; y < room.y + room.height; y++) {
        for (let x = room.x; x < room.x + room.width; x++) {
          if (y >= 0 && y < height && x >= 0 && x < width) {
            carved[y][x] = true;
          }
        }
      }
    }

    /**
     * Carve a corridor between two points
     */
    function carveCorridor(x1, y1, x2, y2) {
      // Random walk horizontally first or vertically first
      if (rng() > 0.5) {
        // Horizontal first
        const minX = Math.min(x1, x2);
        const maxX = Math.max(x1, x2);
        for (let x = minX; x <= maxX; x++) {
          if (y1 >= 0 && y1 < height && x >= 0 && x < width) {
            carved[y1][x] = true;
          }
        }
        const minY = Math.min(y1, y2);
        const maxY = Math.max(y1, y2);
        for (let y = minY; y <= maxY; y++) {
          if (y >= 0 && y < height && x2 >= 0 && x2 < width) {
            carved[y][x2] = true;
          }
        }
      } else {
        // Vertical first
        const minY = Math.min(y1, y2);
        const maxY = Math.max(y1, y2);
        for (let y = minY; y <= maxY; y++) {
          if (y >= 0 && y < height && x1 >= 0 && x1 < width) {
            carved[y][x1] = true;
          }
        }
        const minX = Math.min(x1, x2);
        const maxX = Math.max(x1, x2);
        for (let x = minX; x <= maxX; x++) {
          if (y2 >= 0 && y2 < height && x >= 0 && x < width) {
            carved[y2][x] = true;
          }
        }
      }
    }

    /**
     * Recursively split the dungeon
     */
    function split(node, depth = 0) {
      if (node.width < minRoomSize * 2 || node.height < minRoomSize * 2) {
        createRoom(node);
        carveRoom(node.room);
        rooms.push(node.room);
        return;
      }

      // Choose split direction
      const splitVertical = node.width > node.height || (node.width === node.height && rng() > 0.5);

      if (splitVertical) {
        const splitX = node.x + minRoomSize + Math.floor(rng() * (node.width - minRoomSize * 2));
        node.left = new BSPNode(node.x, node.y, splitX - node.x, node.height);
        node.right = new BSPNode(splitX, node.y, node.x + node.width - splitX, node.height);
      } else {
        const splitY = node.y + minRoomSize + Math.floor(rng() * (node.height - minRoomSize * 2));
        node.left = new BSPNode(node.x, node.y, node.width, splitY - node.y);
        node.right = new BSPNode(node.x, splitY, node.width, node.y + node.height - splitY);
      }

      split(node.left, depth + 1);
      split(node.right, depth + 1);

      // Connect rooms with corridors
      if (node.left && node.right && node.left.room && node.right.room) {
        const leftRoom = node.left.room;
        const rightRoom = node.right.room;
        const leftCenterX = leftRoom.x + Math.floor(leftRoom.width / 2);
        const leftCenterY = leftRoom.y + Math.floor(leftRoom.height / 2);
        const rightCenterX = rightRoom.x + Math.floor(rightRoom.width / 2);
        const rightCenterY = rightRoom.y + Math.floor(rightRoom.height / 2);

        carveCorridor(leftCenterX, leftCenterY, rightCenterX, rightCenterY);
      }
    }

    // Generate the dungeon
    const root = new BSPNode(0, 0, width, height);
    split(root);

    return { carved, rooms };
  }

  /**
   * Generate dungeon from BSP layout and map it to tiles
   * Returns mapData array with dungeon layout
   */
  function generateDungeonWithBSP(width, height, mapWidth, seed, minRoomSize, maxRoomSize, dungeonFloorTile, dungeonWallTile) {
    const { carved } = generateDungeonBSP(width, height, seed, minRoomSize, maxRoomSize);

    // Create the map data array (4 layers)
    const mapData = new Array(mapWidth * height * 4);
    mapData.fill(0);

    // Fill the map with wall/floor tiles based on carved areas
    for (let ty = 0; ty < height; ty++) {
      for (let tx = 0; tx < width; tx++) {
        const tileValue = carved[ty][tx] ? dungeonFloorTile : dungeonWallTile;
        // Layer 0 (main terrain)
        mapData[calculateIndex(tx, ty, 0, width, height)] = tileValue;
      }
    }

    return mapData;
  }

  // ===== FEATURE MANAGEMENT UTILITIES =====

  /**
   * Get terrain features (terrain: true) from biome
   * Returns array of {name, density} objects
   */
  function getTerrainFeatures(biome) {
    return biome.features
      .filter(f => {
        const isTerrainFeature = typeof f === 'object' && f.terrain === true;
        return isTerrainFeature;
      })
      .map(f => {
        const density = typeof f === 'object' && f.density ? f.density : 1;
        return { name: f.name, density };
      });
  }

  /**
   * Get features by layer efficiently
   * Handles both old (string) and new (object) feature formats for compatibility
   * Returns array of {name, density} objects
   * Excludes terrain features (those with terrain: true)
   * Requires FEATURE_LAYERS to be defined
   */
  function getFeaturesByLayer(biome, allFeatures, layer, featureLayers) {
    return biome.features
      .map(f => {
        // Support both old string format and new object format
        const featureName = typeof f === 'string' ? f : f.name;
        const density = typeof f === 'object' && f.density ? f.density : 1;
        const isTerrainFeature = typeof f === 'object' && f.terrain === true;
        return { name: featureName, density, terrain: isTerrainFeature };
      })
      .filter(f => featureLayers[f.name] === layer && allFeatures[f.name] && !f.terrain);
  }

  /**
   * Create a mapping from tile IDs to feature names
   * Handles both single-tile and multi-tile feature variants
   */
  function createTileToFeatureMap(allFeatures) {
    const tileToFeature = {};
    for (const [featureName, variants] of Object.entries(allFeatures)) {
      if (!Array.isArray(variants)) continue;

      for (const variant of variants) {
        if (variant.type === "single" && variant.tileId) {
          tileToFeature[variant.tileId] = featureName;
        } else if (variant.type === "grid" && variant.grid) {
          // For grid features, map all tiles in the grid
          for (const row of variant.grid) {
            for (const tileId of row) {
              tileToFeature[tileId] = featureName;
            }
          }
        }
      }
    }
    return tileToFeature;
  }

  /**
   * Get feature name from tile ID, including A5 autotile recognition
   */
  function getFeatureNameFromTileId(tileId, tileToFeature) {
    // First check if it's in the feature map
    if (tileToFeature[tileId]) {
      return tileToFeature[tileId];
    }

    // Recognize A5 autotiles by ID range (1536-1663)
    if (tileId >= 1536 && tileId <= 1663) {
      const index = tileId - 1536;
      return `A5 ${index}`;
    }

    // Recognize other extended tiles
    if (tileId >= 2048) {
      const progressiveId = getTileIdToProgressiveId(tileId);
      if (progressiveId >= 0) {
        return `Extended ${progressiveId}`;
      }
    }

    return "Unknown";
  }

  // ===== SPATIAL & MATH UTILITIES =====

  /**
   * Calculate how much a specific adjacent biome should influence a position
   * Uses global Perlin noise based on world coordinates for organic, non-triangular blending
   */
  function calculateDirectionalInfluence(x, y, direction, width, height, seed, blendScale, worldX = 0, worldY = 0) {
    // Calculate global coordinates (world tile position + local position within map)
    const globalX = worldX * width + x;
    const globalY = worldY * height + y;

    // Use global Perlin noise to create organic blend patterns across the entire world
    // Different noise layers for different directions to avoid correlation
    const directionSeed = seed + direction.charCodeAt(0) * 1000;
    const noiseValue = smoothNoise(globalX * blendScale, globalY * blendScale, directionSeed);

    // Map noise from [-1, 1] to [0, 1]
    const normalizedNoise = (noiseValue + 1) / 2;

    // Calculate distance from edge to determine blend zone
    let distFromEdge;
    switch (direction) {
      case "north":
        distFromEdge = y;
        break;
      case "south":
        distFromEdge = height - 1 - y;
        break;
      case "east":
        distFromEdge = width - 1 - x;
        break;
      case "west":
        distFromEdge = x;
        break;
      default:
        return 0;
    }

    // Blend zone: only blend in outer 40% of map from this edge
    const blendDepth = Math.floor(width * 0.4);
    if (distFromEdge >= blendDepth) {
      return 0; // Outside blend zone
    }

    // Edge falloff: stronger influence closer to edge
    const edgeFalloff = 1 - (distFromEdge / blendDepth);

    // Combine noise with edge falloff for final influence
    // Noise determines IF we blend, edge falloff determines HOW MUCH
    const influence = normalizedNoise * edgeFalloff;

    // Scale to reasonable blending rate (0.3 factor makes blending more subtle)
    return influence * 0.3;
  }

  /**
   * Select a terrain feature from adjacent biome using weighted density
   * Returns a tile ID or null
   */
  function getWeightedTerrainFeature(terrainFeatures, allFeatures, rng) {
    if (terrainFeatures.length === 0) return null;

    const totalDensity = terrainFeatures.reduce((sum, f) => sum + f.density, 0);
    const weightedFeatures = [];

    // Create weighted selection array
    for (const feature of terrainFeatures) {
      const weight = Math.round((feature.density / totalDensity) * 1000);
      for (let i = 0; i < weight; i++) {
        weightedFeatures.push(feature.name);
      }
    }

    // Select a feature by weight
    const selectedFeatureName = randomChoice(weightedFeatures, rng);

    // Get single-tile variants for this feature
    const featureVariants = allFeatures[selectedFeatureName];
    if (!featureVariants || featureVariants.length === 0) return null;

    const singleTileVariants = featureVariants.filter(v => v.type === "single" && v.tileId);
    if (singleTileVariants.length === 0) return null;

    return randomChoice(singleTileVariants, rng).tileId;
  }

  // ===== FORBIDDEN ZONE UTILITIES =====

  /**
   * Check if a tile position is in a forbidden zone (borders or center)
   * Border: 1 tile from edge
   * Center: 6x6 square around map center (61-66, 61-66 on 128x128 map)
   */
  function isInForbiddenZone(x, y, width, height) {
    // Border check (1 tile from edge)
    if (x <= 0 || x >= width - 1 || y <= 0 || y >= height - 1) {
      return true;
    }

    // Center 6x6 square check
    const centerX = Math.floor(width / 2);
    const centerY = Math.floor(height / 2);
    const centerRange = 3; // 6x6 square = 3 tiles in each direction from center

    if (x >= centerX - centerRange && x <= centerX + centerRange &&
        y >= centerY - centerRange && y <= centerY + centerRange) {
      return true;
    }

    return false;
  }

  /**
   * Check if a multi-tile feature would fit entirely in allowed zones
   * Returns true if ANY part of the feature overlaps forbidden zones
   */
  function doesMultiTileFeatureOverlapForbidden(grid, startX, startY, width, height) {
    if (!grid || grid.length === 0) return false;

    const gridHeight = grid.length;
    const gridWidth = grid[0].length;

    // Check all tiles in the feature grid
    for (let dy = 0; dy < gridHeight; dy++) {
      for (let dx = 0; dx < gridWidth; dx++) {
        const checkX = startX + dx;
        const checkY = startY + dy;

        // Check if this feature tile would be in a forbidden zone
        if (isInForbiddenZone(checkX, checkY, width, height)) {
          return true; // Overlaps forbidden zone
        }
      }
    }

    return false; // Safe to place
  }

  /**
   * Remove features from forbidden zones in the map
   */
  function clearForbiddenZoneFeatures(mapData, width, height) {
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        if (isInForbiddenZone(x, y, width, height)) {
          // Clear all layers except base terrain (layer 0)
          for (let z = 1; z <= 3; z++) {
            const idx = calculateIndex(x, y, z, width, height);
            mapData[idx] = 0;
          }
        }
      }
    }
  }

  // ===== DEBUG & VISUALIZATION UTILITIES =====

  /**
   * Generate ASCII visualization of the map
   * featureAscii is optional; if not provided, uses '?' for all features
   */
  function generateAsciiVisualization(mapData, width, height, tileToFeature, featureAscii) {
    const asciiMap = [];
    const previewWidth = Math.min(width, 128);
    const previewHeight = Math.min(height, 64);
    const ascii = featureAscii || {}; // Default to empty object if not provided

    for (let y = 0; y < previewHeight; y++) {
      let row = "";
      for (let x = 0; x < previewWidth; x++) {
        const idx = calculateIndex(x, y, 0, width, height);
        const tileId = mapData[idx];
        const featureName = getFeatureNameFromTileId(tileId, tileToFeature);
        row += ascii[featureName] || "?";
      }
      asciiMap.push(row);
    }

    return asciiMap;
  }

  /**
   * Get arrow character for direction(s)
   */
  function getArrowForDirection(directions) {
    if (!directions || directions.length === 0) return "·";
    if (directions.length === 1) {
      switch (directions[0]) {
        case "north": return "↑";
        case "south": return "↓";
        case "east": return "→";
        case "west": return "←";
      }
    }
    if (directions.length === 2) {
      const dirs = new Set(directions);
      if (dirs.has("north") && dirs.has("east")) return "↗";
      if (dirs.has("north") && dirs.has("west")) return "↖";
      if (dirs.has("south") && dirs.has("east")) return "↘";
      if (dirs.has("south") && dirs.has("west")) return "↙";
      if (dirs.has("north") && dirs.has("south")) return "↕";
      if (dirs.has("east") && dirs.has("west")) return "↔";
    }
    if (directions.length === 3) return "⊕";
    if (directions.length === 4) return "✦";
    return "?";
  }

  /**
   * Build a complete biome coordinate cache for all biomes on world map
   * @param {Object} gameSystem - Reference to $gameSystem
   * @param {Object} gameMap - Reference to $gameMap
   * @param {number} worldMapId - ID of the world map
   * @returns {Object} Cache object mapping biome names to coordinate arrays
   */
  function buildBiomeCoordinateCache(gameSystem, gameMap, worldMapId) {
    if (!gameMap || gameMap.mapId() !== worldMapId) {
      logWarn("buildBiomeCoordinateCache: Not on world map, skipping cache build");
      return {};
    }

    const cache = {};
    const mapWidth = gameMap.width();
    const mapHeight = gameMap.height();

    // Initialize cache for all known biomes
    for (const biome of BIOMES) {
      cache[biome.name] = [];
    }

    // Iterate through all world coordinates
    for (let y = 0; y < mapHeight; y++) {
      for (let x = 0; x < mapWidth; x++) {
        const biomeName = getBiomeFromWorldCoordinates(gameMap, x, y);
        if (biomeName) {
          if (!cache[biomeName]) {
            cache[biomeName] = [];
          }
          cache[biomeName].push({ x, y });
        }
      }
    }

    // Store cache in game system
    if (gameSystem && gameSystem._procGenData) {
      gameSystem._procGenData.biomeCoordinateCache = cache;
    }

    const totalCoords = Object.values(cache).reduce(
      (sum, arr) => sum + arr.length,
      0
    );
    log(`buildBiomeCoordinateCache: Built cache with ${totalCoords} total coordinates`);

    return cache;
  }

  /**
   * Get biome from world coordinates by checking tile layers
   * @param {Object} gameMap - Reference to $gameMap
   * @param {number} x - World X coordinate
   * @param {number} y - World Y coordinate
   * @returns {string} Biome name
   */
  function getBiomeFromWorldCoordinates(gameMap, x, y) {
    let selectedTileId = 0;
    for (let z = 3; z >= 0; z--) {
      const tileId = gameMap.tileId(x, y, z);
      if (tileId && tileId !== 0) {
        selectedTileId = tileId;
        break;
      }
    }

    if (selectedTileId === 0) {
      return "Fields";
    }

    return getBiomeForWorldTile(selectedTileId);
  }

  /**
   * Get biome from cache with proper fallback to world map lookup
   * @param {Object} cache - The biome coordinate cache
   * @param {number} x - World X coordinate
   * @param {number} y - World Y coordinate
   * @param {Object} gameMap - Reference to $gameMap
   * @param {number} worldMapId - ID of the world map
   * @returns {string} Biome name
   */
  function getBiomeFromCacheWithFallback(cache, x, y, gameMap, worldMapId) {
    // First, try to find the coordinate in the cache
    if (cache && Object.keys(cache).length > 0) {
      for (const [biomeName, coordinates] of Object.entries(cache)) {
        if (coordinates.some((coord) => coord.x === x && coord.y === y)) {
          return biomeName;
        }
      }
    }

    // If not in cache and we're on the world map, look up from world map directly
    if (gameMap && gameMap.mapId() === worldMapId) {
      return getBiomeFromWorldCoordinates(gameMap, x, y);
    }

    // Final fallback to Fields
    return "Fields";
  }

  // ===== EXPORT UTILITIES TO GLOBAL NAMESPACE =====
  window.ProcGenUtils = {
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
    isWaterTileId,
    getRandomFeatureVariant,
    placeMultiTileFeature,
    generateFeatureNoise,
    generateFeatureScattered,
    checkDiagonalMapBiomesFromCache,
    generateCaveWithDrunkenWalk,
    generateCaveWithCellularAutomata,
    generateCaveWithVoronoi,
    generateMountainBiomeTerrain,
    generateDungeonBSP,
    generateDungeonWithBSP,
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
    buildBiomeCoordinateCache,
    getBiomeFromCacheWithFallback,
    WORLD_MAP_ID,
    WORLD_TILESET_ID,
    PROC_MAP_ID,
    PROC_MAP_WIDTH,
    PROC_MAP_HEIGHT,
    BORDER_DETECTION_RANGE,
  };
})();

/*:
 * @target MZ
 * @plugindesc Procedural Beach & Water Generation System
 * @author OmniLex
 * @url https://github.com/yourusername/hypernet-explorer
 *
 * @help ProceduralBeachGenerator.js
 *
 * This plugin handles all water and beach-related procedural generation:
 * - Water edge drawing with autotiling
 * - Beach placement along coastlines
 * - Water corners with diagonal coastlines
 * - Tide system for dynamic water levels
 * - Seashell placement on beaches
 *
 * Requires: ProceduralMapUtils.js
 *
 * @command none
 */

(() => {
  "use strict";

  // ===== CONSTANTS =====

  /**
   * Water autotile offsets for different edge configurations
   * These offsets are added to the base A1 Water Tile ID (usually 2048+)
   */
  const WATER_OFFSETS = {
    Center: 0,                    // Water surrounded on all sides
    WaterTop_LandBottom: 11,      // Water above, land below (north edge)
    WaterBottom_LandTop: 13,      // Water below, land above (south edge)
    WaterRight_LandLeft: 12,      // Water on right, land on left (east edge)
    WaterLeft_LandRight: 14,      // Water on left, land on right (west edge)
    WaterTL_Corner: 7,            // Water in top-left corner
    WaterTR_Corner: 8,            // Water in top-right corner
    WaterBL_Corner: 9,            // Water in bottom-left corner
    WaterBR_Corner: 10,           // Water in bottom-right corner
  };

  // ===== HELPER FUNCTIONS =====

  /**
   * Check if a biome is water-based
   */
  function isWaterBiome(biomeName) {
    const waterBiomes = ["Ocean", "Beach", "CaveFlooded", "Docks", "Water"];
    return waterBiomes.some((water) =>
      biomeName.toLowerCase().includes(water.toLowerCase())
    );
  }

  // ===== TIDE SYSTEM =====

  /**
   * Get game date and time from Variable 113
   * Format: "01 JAN 2001 12:00"
   */
  function getGameDateFromVariable() {
    const dateStr = $gameVariables.value(113) || '01 JAN 2001 12:00';
    const parts = dateStr.split(' ');
    if (parts.length < 4) {
      return { day: 1, month: 0, year: 2001, hours: 8, minutes: 0 };
    }

    const day = parseInt(parts[0]);
    const monthStr = parts[1].toUpperCase();
    const year = parseInt(parts[2]);
    const timeStr = parts[3].split(':');
    const hours = parseInt(timeStr[0]);
    const minutes = parseInt(timeStr[1]);

    const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
    const month = months.indexOf(monthStr);

    return { day, month, year, hours, minutes };
  }

  /**
   * Calculate tide state (0.0 to 1.0, where 0.5 is neutral)
   * Tide cycles every 12.42 hours (lunar-like)
   */
  function calculateTideState() {
    const date = getGameDateFromVariable();
    const totalMinutes = date.hours * 60 + date.minutes;
    const tidePhase = (totalMinutes / (12.42 * 60)) % 1.0;
    // Use sine wave for smooth tide transitions
    // 0 = low tide, 0.5 = high tide, 1 = low tide again
    return (Math.sin(tidePhase * Math.PI * 2) + 1) / 2;
  }

  /**
   * Get tide offset multiplier for water depth
   * High tide (1.0): water advances more (multiply coastlineDepth by 1.3)
   * Low tide (0.0): water recedes more (multiply coastlineDepth by 0.7)
   */
  function getTideMultiplier() {
    const tideState = calculateTideState();
    // Map tide state [0, 1] to multiplier [0.7, 1.3]
    return 0.7 + (tideState * 0.6);
  }

  /**
   * Get a tide-dependent seed for randomization
   * Changes every hour (when tide phase shifts significantly)
   */
  function getTideDependentSeed() {
    const date = getGameDateFromVariable();
    return date.day * 10000 + date.month * 1000 + date.hours;
  }

  // ===== WATER TILE DETECTION =====

  /**
   * Calculate autotile index based on surrounding water tiles
   * Returns offset 0-15 for water autotile variant selection
   */
  function getWaterAutotileIndex(x, y, mapData, width, height, waterTileSet) {
    let pattern = 0;
    const neighbors = [
      { dx: 0, dy: -1 },  // N
      { dx: 1, dy: -1 },  // NE
      { dx: 1, dy: 0 },   // E
      { dx: 1, dy: 1 },   // SE
      { dx: 0, dy: 1 },   // S
      { dx: -1, dy: 1 },  // SW
      { dx: -1, dy: 0 },  // W
      { dx: -1, dy: -1 }  // NW
    ];

    neighbors.forEach((neighbor, index) => {
      const nx = x + neighbor.dx;
      const ny = y + neighbor.dy;
      if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
        const idx = window.ProcGenUtils.calculateIndex(nx, ny, 0, width, height);
        if (window.ProcGenUtils.isWaterTileId(mapData[idx], waterTileSet)) {
          pattern |= (1 << index);
        }
      }
    });

    return mapWaterPatternToAutotileOffset(pattern);
  }

  /**
   * Map 8-directional water pattern to autotile offset (0-15)
   */
  function mapWaterPatternToAutotileOffset(pattern) {
    const hasN = (pattern & 1) !== 0;
    const hasNE = (pattern & 2) !== 0;
    const hasE = (pattern & 4) !== 0;
    const hasSE = (pattern & 8) !== 0;
    const hasS = (pattern & 16) !== 0;
    const hasSW = (pattern & 32) !== 0;
    const hasW = (pattern & 64) !== 0;
    const hasNW = (pattern & 128) !== 0;

    if (hasN && hasE && hasS && hasW) return 0;
    if (hasN && hasE && hasS && !hasW) return 1;
    if (hasN && hasE && hasW && !hasS) return 2;
    if (hasN && hasS && hasW && !hasE) return 3;
    if (hasE && hasS && hasW && !hasN) return 4;
    if (hasN && hasS && !hasE && !hasW) return 5;
    if (hasE && hasW && !hasN && !hasS) return 6;
    if (hasN && hasE && !hasS && !hasW) return 7;
    if (hasE && hasS && !hasN && !hasW) return 8;
    if (hasS && hasW && !hasN && !hasE) return 9;
    if (hasW && hasN && !hasS && !hasE) return 10;
    if (hasN && !hasE && !hasS && !hasW) return 11;
    if (hasE && !hasN && !hasS && !hasW) return 12;
    if (hasS && !hasN && !hasE && !hasW) return 13;
    if (hasW && !hasN && !hasE && !hasS) return 14;
    return 15;
  }

  /**
   * Get water tile with proper autotile variant
   */
  function getWaterTileForAutotiling(waterTiles, autotileIndex) {
    if (!waterTiles || waterTiles.length === 0) return 0;
    return waterTiles[0] + (autotileIndex || 0);
  }

  // ===== WATER EDGE DRAWING =====

  /**
   * Draw jagged coastlines with correct directional autotiling for Water
   */
  function drawWaterEdges(
    mapData,
    waterTiles,
    adjacentBiomes,
    seed,
    width,
    height,
    rng,
    cacheInfo,
    allFeatures,
    biomeName
  ) {
    if (!waterTiles || waterTiles.length === 0) {
      return;
    }

    // =========================================================================
    // MANUAL REPLACEMENT ARRAY
    // Change these numbers to swap tile directions manually.
    // These are offsets added to the base A1 Water Tile ID (usually 2048+)
    // =========================================================================

    // =========================================================================

    const maxEdgeDepth = 35;
    const beachWidth = 8;
    const cornerSize = 20;
    const isOceanBiome = biomeName === "Ocean";

    // Pre-calculate which edges have water to detect corner situations
    function checkEdgeHasWater(direction, adjBiomeName) {
      if (adjBiomeName && isWaterBiome(adjBiomeName)) return true;
      if (cacheInfo && cacheInfo[direction] && cacheInfo[direction].length > 0) {
        return cacheInfo[direction].some((b) => isWaterBiome(b));
      }
      return false;
    }
    
    const hasWaterNorth = checkEdgeHasWater("north", adjacentBiomes?.north);
    const hasWaterSouth = checkEdgeHasWater("south", adjacentBiomes?.south);
    const hasWaterEast = checkEdgeHasWater("east", adjacentBiomes?.east);
    const hasWaterWest = checkEdgeHasWater("west", adjacentBiomes?.west);
    
    // Detect corners based on adjacent edges both having water
    const hasCornerTL = hasWaterNorth && hasWaterWest;
    const hasCornerTR = hasWaterNorth && hasWaterEast;
    const hasCornerBL = hasWaterSouth && hasWaterWest;
    const hasCornerBR = hasWaterSouth && hasWaterEast;
    
    // Store edge-based corners globally so drawWaterCorners can skip them
    if (!window.ProcGenBeach) window.ProcGenBeach = {};
    window.ProcGenBeach._edgeBasedCorners = {
      topLeft: hasCornerTL,
      topRight: hasCornerTR,
      bottomLeft: hasCornerBL,
      bottomRight: hasCornerBR
    };

    // Apply tide system to water advancement
    const tideMultiplier = getTideMultiplier();
    const tideDependentRng = window.ProcGenUtils.createSeededRandom(getTideDependentSeed());

    // Specific water IDs to apply autotiling to
    const waterFeatureIds = new Set();
    if (allFeatures && allFeatures["Water"]) {
      allFeatures["Water"].forEach((v) => {
        if (v.type === "single") waterFeatureIds.add(v.tileId);
      });
    }

    // Helper to get correct tile ID using the Replacement Array
    function getWaterTile(baseTileId, shapeKey) {
      // Only apply autotile logic if it's explicitly the "Water" feature and an A1 tile (>= 2048)
      if (
        waterFeatureIds.has(baseTileId) &&
        baseTileId >= 2048 &&
        WATER_OFFSETS[shapeKey] !== undefined
      ) {
        return baseTileId + WATER_OFFSETS[shapeKey];
      }
      return baseTileId;
    }

    // Extract beach/seashell features...
    let beachTiles = [];
    let seashellTiles = [];
    let beachCoordinates = new Set();

    if (!isOceanBiome) {
      if (allFeatures && allFeatures["Beach"]) {
        for (const variant of allFeatures["Beach"]) {
          if (variant.type === "single") beachTiles.push(variant.tileId);
        }
      }
      if (allFeatures && allFeatures["Seashell"]) {
        for (const variant of allFeatures["Seashell"]) {
          if (variant.type === "single") seashellTiles.push(variant.tileId);
        }
      }
    }

    function shouldDrawWaterEdge(direction, biomeName) {
      if (biomeName && isWaterBiome(biomeName)) return true;
      if (
        cacheInfo &&
        cacheInfo[direction] &&
        cacheInfo[direction].length > 0
      ) {
        return cacheInfo[direction].some((b) => isWaterBiome(b));
      }
      return false;
    }

    // =========================================================================
    // CORNER FILL: When two perpendicular edges meet, fill the corner with water
    // =========================================================================
    
    if (hasCornerTL) {
      for (let y = 0; y < cornerSize; y++) {
        for (let x = 0; x < cornerSize; x++) {
          const idx = window.ProcGenUtils.calculateIndex(x, y, 0, width, height);
          const baseTile = window.ProcGenUtils.randomChoice(waterTiles, rng);
          mapData[idx] = getWaterTile(baseTile, "Center");
        }
      }
    }
    
    if (hasCornerTR) {
      for (let y = 0; y < cornerSize; y++) {
        for (let x = width - cornerSize; x < width; x++) {
          const idx = window.ProcGenUtils.calculateIndex(x, y, 0, width, height);
          const baseTile = window.ProcGenUtils.randomChoice(waterTiles, rng);
          mapData[idx] = getWaterTile(baseTile, "Center");
        }
      }
    }
    
    if (hasCornerBL) {
      for (let y = height - cornerSize; y < height; y++) {
        for (let x = 0; x < cornerSize; x++) {
          const idx = window.ProcGenUtils.calculateIndex(x, y, 0, width, height);
          const baseTile = window.ProcGenUtils.randomChoice(waterTiles, rng);
          mapData[idx] = getWaterTile(baseTile, "Center");
        }
      }
    }
    
    if (hasCornerBR) {
      for (let y = height - cornerSize; y < height; y++) {
        for (let x = width - cornerSize; x < width; x++) {
          const idx = window.ProcGenUtils.calculateIndex(x, y, 0, width, height);
          const baseTile = window.ProcGenUtils.randomChoice(waterTiles, rng);
          mapData[idx] = getWaterTile(baseTile, "Center");
        }
      }
    }

    // =========================================================================
    // EDGE DRAWING: Excludes corner regions to avoid overlap
    // =========================================================================

    // NORTH SECTION (Water fills from Top, Land is at Bottom)
    if (shouldDrawWaterEdge("north", adjacentBiomes?.north)) {
      const startX = hasCornerTL ? cornerSize : 0;
      const endX = hasCornerTR ? width - cornerSize : width;
      for (let x = startX; x < endX; x++) {
        const coarse = Math.sin(x / 48 + seed * 0.005) * 0.5 + 0.5;
        const medium = Math.sin(x / 16 + seed * 0.01 + 100) * 0.5 + 0.5;
        const fine = Math.sin(x / 4 + seed * 0.02 + 200) * 0.5 + 0.5;
        const weighted = coarse * 0.6 + medium * 0.25 + fine * 0.15;
        const baseCoastlineDepth = Math.floor(10 + weighted * 15);
        const coastlineDepth = Math.floor(baseCoastlineDepth * tideMultiplier);
        const actualDepth = Math.min(maxEdgeDepth, coastlineDepth);

        for (let y = 0; y < actualDepth; y++) {
          const idx = window.ProcGenUtils.calculateIndex(x, y, 0, width, height);
          const baseTile = window.ProcGenUtils.randomChoice(waterTiles, rng);

          // If it's the very last tile (the shore), use Edge shape. Otherwise Center.
          const shape =
            y === actualDepth - 1 ? "WaterTop_LandBottom" : "Center";
          mapData[idx] = getWaterTile(baseTile, shape);
        }

        // Draw beach...
        if (
          beachTiles.length > 0 &&
          coastlineDepth < maxEdgeDepth - beachWidth
        ) {
          for (
            let beachY = coastlineDepth;
            beachY < Math.min(coastlineDepth + beachWidth, maxEdgeDepth);
            beachY++
          ) {
            // Layer 0: Sand
            const idx = window.ProcGenUtils.calculateIndex(x, beachY, 0, width, height);
            mapData[idx] = window.ProcGenUtils.randomChoice(beachTiles, rng);
            beachCoordinates.add(`${x},${beachY}`);

            // Layer 2: Seashells (Z=1) - Use tide-dependent RNG for randomization
            if (seashellTiles.length > 0 && tideDependentRng() < 0.05) {
              const layer2Idx = window.ProcGenUtils.calculateIndex(x, beachY, 1, width, height);
              mapData[layer2Idx] = window.ProcGenUtils.randomChoice(seashellTiles, tideDependentRng);
            }
          }
        }
      }
    }

    // SOUTH SECTION (Water fills from Bottom, Land is at Top)
    if (shouldDrawWaterEdge("south", adjacentBiomes?.south)) {
      const startX = hasCornerBL ? cornerSize : 0;
      const endX = hasCornerBR ? width - cornerSize : width;
      for (let x = startX; x < endX; x++) {
        const coarse = Math.sin(x / 48 + seed * 0.005 + 1000) * 0.5 + 0.5;
        const medium = Math.sin(x / 16 + seed * 0.01 + 1100) * 0.5 + 0.5;
        const fine = Math.sin(x / 4 + seed * 0.02 + 1200) * 0.5 + 0.5;
        const baseCoastlineDepth = Math.floor(
          10 + (coarse * 0.6 + medium * 0.25 + fine * 0.15) * 15
        );
        const coastlineDepth = Math.floor(baseCoastlineDepth * tideMultiplier);
        const startY = Math.max(0, height - coastlineDepth);

        for (let y = startY; y < height; y++) {
          const idx = window.ProcGenUtils.calculateIndex(x, y, 0, width, height);
          const baseTile = window.ProcGenUtils.randomChoice(waterTiles, rng);

          const shape = y === startY ? "WaterBottom_LandTop" : "Center";
          mapData[idx] = getWaterTile(baseTile, shape);
        }

        if (
          beachTiles.length > 0 &&
          coastlineDepth < maxEdgeDepth - beachWidth
        ) {
          for (
            let beachY = Math.max(0, height - coastlineDepth - beachWidth);
            beachY < Math.max(0, height - coastlineDepth);
            beachY++
          ) {
            // Layer 0: Sand
            const idx = window.ProcGenUtils.calculateIndex(x, beachY, 0, width, height);
            mapData[idx] = window.ProcGenUtils.randomChoice(beachTiles, rng);
            beachCoordinates.add(`${x},${beachY}`);

            // Layer 2: Seashells (Z=1) - Use tide-dependent RNG for randomization
            if (seashellTiles.length > 0 && tideDependentRng() < 0.05) {
               const layer2Idx = window.ProcGenUtils.calculateIndex(x, beachY, 1, width, height);
               mapData[layer2Idx] = window.ProcGenUtils.randomChoice(seashellTiles, tideDependentRng);
            }
          }
        }
      }
    }

    // EAST SECTION (Water fills from Right, Land is at Left)
    if (shouldDrawWaterEdge("east", adjacentBiomes?.east)) {
      const startY = hasCornerTR ? cornerSize : 0;
      const endY = hasCornerBR ? height - cornerSize : height;
      for (let y = startY; y < endY; y++) {
        const coarse = Math.sin(y / 48 + seed * 0.005 + 2000) * 0.5 + 0.5;
        const medium = Math.sin(y / 16 + seed * 0.01 + 2100) * 0.5 + 0.5;
        const fine = Math.sin(y / 4 + seed * 0.02 + 2200) * 0.5 + 0.5;
        const baseCoastlineDepth = Math.floor(
          10 + (coarse * 0.6 + medium * 0.25 + fine * 0.15) * 15
        );
        const coastlineDepth = Math.floor(baseCoastlineDepth * tideMultiplier);
        const startX = Math.max(0, width - coastlineDepth);

        for (let x = startX; x < width; x++) {
          const idx = window.ProcGenUtils.calculateIndex(x, y, 0, width, height);
          const baseTile = window.ProcGenUtils.randomChoice(waterTiles, rng);

          const shape = x === startX ? "WaterRight_LandLeft" : "Center";
          mapData[idx] = getWaterTile(baseTile, shape);
        }

        if (
          beachTiles.length > 0 &&
          coastlineDepth < maxEdgeDepth - beachWidth
        ) {
          for (
            let beachX = Math.max(0, width - coastlineDepth - beachWidth);
            beachX < Math.max(0, width - coastlineDepth);
            beachX++
          ) {
            // Layer 0: Sand
            const idx = window.ProcGenUtils.calculateIndex(beachX, y, 0, width, height);
            mapData[idx] = window.ProcGenUtils.randomChoice(beachTiles, rng);
            beachCoordinates.add(`${beachX},${y}`);

            // Layer 2: Seashells (Z=1) - Use tide-dependent RNG for randomization
            if (seashellTiles.length > 0 && tideDependentRng() < 0.05) {
               const layer2Idx = window.ProcGenUtils.calculateIndex(beachX, y, 1, width, height);
               mapData[layer2Idx] = window.ProcGenUtils.randomChoice(seashellTiles, tideDependentRng);
            }
          }
        }
      }
    }

    // WEST SECTION (Water fills from Left, Land is at Right)
    if (shouldDrawWaterEdge("west", adjacentBiomes?.west)) {
      const startY = hasCornerTL ? cornerSize : 0;
      const endY = hasCornerBL ? height - cornerSize : height;
      for (let y = startY; y < endY; y++) {
        const coarse = Math.sin(y / 48 + seed * 0.005 + 3000) * 0.5 + 0.5;
        const medium = Math.sin(y / 16 + seed * 0.01 + 3100) * 0.5 + 0.5;
        const fine = Math.sin(y / 4 + seed * 0.02 + 3200) * 0.5 + 0.5;
        const baseCoastlineDepth = Math.floor(
          10 + (coarse * 0.6 + medium * 0.25 + fine * 0.15) * 15
        );
        const coastlineDepth = Math.floor(baseCoastlineDepth * tideMultiplier);
        const actualDepth = Math.min(maxEdgeDepth, coastlineDepth);

        for (let x = 0; x < actualDepth; x++) {
          const idx = window.ProcGenUtils.calculateIndex(x, y, 0, width, height);
          const baseTile = window.ProcGenUtils.randomChoice(waterTiles, rng);

          const shape = x === actualDepth - 1 ? "WaterLeft_LandRight" : "Center";
          mapData[idx] = getWaterTile(baseTile, shape);
        }

        if (
          beachTiles.length > 0 &&
          coastlineDepth < maxEdgeDepth - beachWidth
        ) {
          for (
            let beachX = Math.min(maxEdgeDepth, coastlineDepth);
            beachX < Math.min(maxEdgeDepth, coastlineDepth + beachWidth);
            beachX++
          ) {
            // Layer 0: Sand
            const idx = window.ProcGenUtils.calculateIndex(beachX, y, 0, width, height);
            mapData[idx] = window.ProcGenUtils.randomChoice(beachTiles, rng);
            beachCoordinates.add(`${beachX},${y}`);

            // Layer 2: Seashells (Z=1) - Use tide-dependent RNG for randomization
            if (seashellTiles.length > 0 && tideDependentRng() < 0.05) {
               const layer2Idx = window.ProcGenUtils.calculateIndex(beachX, y, 1, width, height);
               mapData[layer2Idx] = window.ProcGenUtils.randomChoice(seashellTiles, tideDependentRng);
            }
          }
        }
      }
    }

    if (!window.ProcGenUtils) window.ProcGenUtils = {};
    window.ProcGenUtils.beachCoordinates = beachCoordinates;
  }

  // ===== WATER CORNER DRAWING =====

  /**
   * Draw water corners with customizable directional autotiling
   */
  function drawWaterCorners(
    mapData,
    waterTiles,
    width,
    height,
    seed,
    rng,
    diagonalCacheInfo,
    allFeatures,
    biomeName
  ) {
    if (!waterTiles || waterTiles.length === 0 || !diagonalCacheInfo) {
      return;
    }

    // =========================================================================
    // MANUAL REPLACEMENT ARRAY (CORNERS)
    // =========================================================================

    // =========================================================================

    const cornerSize = 20;
    const beachWidth = 8;
    const isOceanBiome = biomeName === "Ocean";

    // Apply tide system to water advancement
    const tideMultiplier = getTideMultiplier();
    const tideDependentRng = window.ProcGenUtils.createSeededRandom(getTideDependentSeed());

    const waterFeatureIds = new Set();
    if (allFeatures && allFeatures["Water"]) {
      allFeatures["Water"].forEach((v) => {
        if (v.type === "single") waterFeatureIds.add(v.tileId);
      });
    }

    function getWaterTile(baseTileId, shapeKey) {
      if (
        waterFeatureIds.has(baseTileId) &&
        baseTileId >= 2048 &&
        WATER_OFFSETS[shapeKey] !== undefined
      ) {
        return baseTileId + WATER_OFFSETS[shapeKey];
      }
      return baseTileId;
    }

    // Extract beach features...
    let beachTiles = [];
    let seashellTiles = [];
    let beachCoordinates = window.ProcGenUtils?.beachCoordinates || new Set();

    if (!isOceanBiome) {
      if (allFeatures && allFeatures["Beach"]) {
        for (const variant of allFeatures["Beach"]) {
          if (variant.type === "single") beachTiles.push(variant.tileId);
        }
      }
      if (allFeatures && allFeatures["Seashell"]) {
        for (const variant of allFeatures["Seashell"]) {
          if (variant.type === "single") seashellTiles.push(variant.tileId);
        }
      }
    }

    function shouldDrawWaterCorner(diagonalBiomes) {
      if (!diagonalBiomes || diagonalBiomes.length === 0) return false;
      return diagonalBiomes.some((biomeName) => isWaterBiome(biomeName));
    }
    
    // Check if edge-based corners were already handled by drawWaterEdges
    const edgeCorners = window.ProcGenBeach?._edgeBasedCorners || {};

    // Top-left corner (Water @ TL) - skip if already handled by edge-based corner
    if (shouldDrawWaterCorner(diagonalCacheInfo.topLeft) && !edgeCorners.topLeft) {
      for (let y = 0; y < cornerSize; y++) {
        const baseDepthAtY = Math.floor(
          5 + (Math.sin(y / 10 + seed) * 0.5 + 0.5) * 10
        );
        const depthAtY = Math.floor(baseDepthAtY * tideMultiplier);
        const limit = Math.min(cornerSize, depthAtY);
        for (let x = 0; x < limit; x++) {
          const idx = window.ProcGenUtils.calculateIndex(x, y, 0, width, height);
          const baseTile = window.ProcGenUtils.randomChoice(waterTiles, rng);
          const shape = x === limit - 1 ? "WaterTL_Corner" : "Center";
          mapData[idx] = getWaterTile(baseTile, shape);
        }
        // Beach...
        if (beachTiles.length > 0 && depthAtY < cornerSize - beachWidth) {
          for (
            let beachX = depthAtY;
            beachX < Math.min(depthAtY + beachWidth, cornerSize);
            beachX++
          ) {
            const idx = window.ProcGenUtils.calculateIndex(beachX, y, 0, width, height);
            mapData[idx] = window.ProcGenUtils.randomChoice(beachTiles, rng);
            beachCoordinates.add(`${beachX},${y}`);

            // Layer 2: Seashells (Z=1) - Use tide-dependent RNG for randomization
            if (seashellTiles.length > 0 && tideDependentRng() < 0.05) {
              const layer2Idx = window.ProcGenUtils.calculateIndex(beachX, y, 1, width, height);
              mapData[layer2Idx] = window.ProcGenUtils.randomChoice(seashellTiles, tideDependentRng);
            }
          }
        }
      }
    }

    // Top-right corner (Water @ TR) - skip if already handled by edge-based corner
    if (shouldDrawWaterCorner(diagonalCacheInfo.topRight) && !edgeCorners.topRight) {
      for (let y = 0; y < cornerSize; y++) {
        const baseDepthAtY = Math.floor(
          5 + (Math.sin(y / 10 + seed) * 0.5 + 0.5) * 10
        );
        const depthAtY = Math.floor(baseDepthAtY * tideMultiplier);
        const startX = Math.max(0, width - depthAtY);
        for (let x = startX; x < width; x++) {
          const idx = window.ProcGenUtils.calculateIndex(x, y, 0, width, height);
          const baseTile = window.ProcGenUtils.randomChoice(waterTiles, rng);
          const shape = x === startX ? "WaterTR_Corner" : "Center";
          mapData[idx] = getWaterTile(baseTile, shape);
        }
        // Beach...
        if (beachTiles.length > 0 && depthAtY < cornerSize - beachWidth) {
          for (
            let beachX = Math.max(0, width - depthAtY - beachWidth);
            beachX < Math.max(0, width - depthAtY);
            beachX++
          ) {
            const idx = window.ProcGenUtils.calculateIndex(beachX, y, 0, width, height);
            mapData[idx] = window.ProcGenUtils.randomChoice(beachTiles, rng);
            beachCoordinates.add(`${beachX},${y}`);

            // Layer 2: Seashells (Z=1) - Use tide-dependent RNG for randomization
            if (seashellTiles.length > 0 && tideDependentRng() < 0.05) {
              const layer2Idx = window.ProcGenUtils.calculateIndex(beachX, y, 1, width, height);
              mapData[layer2Idx] = window.ProcGenUtils.randomChoice(seashellTiles, tideDependentRng);
            }
          }
        }
      }
    }

    // Bottom-left corner (Water @ BL) - skip if already handled by edge-based corner
    if (shouldDrawWaterCorner(diagonalCacheInfo.bottomLeft) && !edgeCorners.bottomLeft) {
      for (let y = Math.max(0, height - cornerSize); y < height; y++) {
        const baseDepthAtY = Math.floor(
          5 + (Math.sin(y / 10 + seed) * 0.5 + 0.5) * 10
        );
        const depthAtY = Math.floor(baseDepthAtY * tideMultiplier);
        const limit = Math.min(cornerSize, depthAtY);
        for (let x = 0; x < limit; x++) {
          const idx = window.ProcGenUtils.calculateIndex(x, y, 0, width, height);
          const baseTile = window.ProcGenUtils.randomChoice(waterTiles, rng);
          const shape = x === limit - 1 ? "WaterBL_Corner" : "Center";
          mapData[idx] = getWaterTile(baseTile, shape);
        }
        // Beach...
        if (beachTiles.length > 0 && depthAtY < cornerSize - beachWidth) {
          for (
            let beachX = depthAtY;
            beachX < Math.min(depthAtY + beachWidth, cornerSize);
            beachX++
          ) {
            const idx = window.ProcGenUtils.calculateIndex(beachX, y, 0, width, height);
            mapData[idx] = window.ProcGenUtils.randomChoice(beachTiles, rng);
            beachCoordinates.add(`${beachX},${y}`);

            // Layer 2: Seashells (Z=1) - Use tide-dependent RNG for randomization
            if (seashellTiles.length > 0 && tideDependentRng() < 0.05) {
              const layer2Idx = window.ProcGenUtils.calculateIndex(beachX, y, 1, width, height);
              mapData[layer2Idx] = window.ProcGenUtils.randomChoice(seashellTiles, tideDependentRng);
            }
          }
        }
      }
    }

    // Bottom-right corner (Water @ BR) - skip if already handled by edge-based corner
    if (shouldDrawWaterCorner(diagonalCacheInfo.bottomRight) && !edgeCorners.bottomRight) {
      for (let y = Math.max(0, height - cornerSize); y < height; y++) {
        const baseDepthAtY = Math.floor(
          5 + (Math.sin(y / 10 + seed) * 0.5 + 0.5) * 10
        );
        const depthAtY = Math.floor(baseDepthAtY * tideMultiplier);
        const startX = Math.max(0, width - depthAtY);
        for (let x = startX; x < width; x++) {
          const idx = window.ProcGenUtils.calculateIndex(x, y, 0, width, height);
          const baseTile = window.ProcGenUtils.randomChoice(waterTiles, rng);
          const shape = x === startX ? "WaterBR_Corner" : "Center";
          mapData[idx] = getWaterTile(baseTile, shape);
        }
        // Beach...
        if (beachTiles.length > 0 && depthAtY < cornerSize - beachWidth) {
          for (
            let beachX = Math.max(0, width - depthAtY - beachWidth);
            beachX < Math.max(0, width - depthAtY);
            beachX++
          ) {
            const idx = window.ProcGenUtils.calculateIndex(beachX, y, 0, width, height);
            mapData[idx] = window.ProcGenUtils.randomChoice(beachTiles, rng);
            beachCoordinates.add(`${beachX},${y}`);

            // Layer 2: Seashells (Z=1) - Use tide-dependent RNG for randomization
            if (seashellTiles.length > 0 && tideDependentRng() < 0.05) {
              const layer2Idx = window.ProcGenUtils.calculateIndex(beachX, y, 1, width, height);
              mapData[layer2Idx] = window.ProcGenUtils.randomChoice(seashellTiles, tideDependentRng);
            }
          }
        }
      }
    }

    if (!window.ProcGenUtils) window.ProcGenUtils = {};
    window.ProcGenUtils.beachCoordinates = beachCoordinates;
  }

  // ===== SEABED GENERATION =====

  /**
   * Generate Seabed biome terrain using mountain generation but keeping water tiles
   * Creates underwater cliffs with MountainCeiling and MountainWall
   * Similar to generateMountainBiomeTerrain but doesn't replace floor with terrain
   */
  function generateSeabedBiomeTerrain(
    biome,
    seed,
    allFeatures,
    adjacentBiomes,
    cacheInfo,
    worldCoords,
    cache
  ) {
    if (!window.ProcGenUtils) {
      console.error("ProceduralBeachGenerator requires ProceduralMapUtils");
      return null;
    }

    const {
      calculateIndex,
      createSeededRandom,
      PROC_MAP_WIDTH,
      PROC_MAP_HEIGHT,
      getBiomeByName,
    } = window.ProcGenUtils;

    const width = PROC_MAP_WIDTH;
    const height = PROC_MAP_HEIGHT;

    // Get MountainCeiling and MountainWall tiles from features
    const mountainCeilingTiles = allFeatures["MountainCeiling"] || [];
    const mountainWallTiles = allFeatures["MountainWall"] || [];

    const mountainCeilingTile = mountainCeilingTiles.length > 0 ?
      (mountainCeilingTiles[0].type === "single" ? mountainCeilingTiles[0].tileId : mountainCeilingTiles[0].tiles[0][0]) :
      0;
    const mountainWallTile = mountainWallTiles.length > 0 ?
      (mountainWallTiles[0].type === "single" ? mountainWallTiles[0].tileId : mountainWallTiles[0].tiles[0][0]) :
      0;

    // Get water tiles from features
    const waterTiles = allFeatures["Water"] || [];
    const waterTile = waterTiles.length > 0 ?
      (waterTiles[0].type === "single" ? waterTiles[0].tileId : waterTiles[0].tiles[0][0]) :
      0;

    if (!mountainCeilingTile || !mountainWallTile || !waterTile) {
      console.warn("Seabed generation missing required tiles (MountainCeiling, MountainWall, or Water)");
      return null;
    }

    // Initialize base map with water tiles
    const baseMapData = new Array(width * height * 4).fill(0);
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const idx = calculateIndex(x, y, 0, width, height);
        baseMapData[idx] = waterTile;
      }
    }

    // Use generateMountainBiomeTerrain from Utils to create cliffs
    if (!window.ProcGenUtils.generateMountainBiomeTerrain) {
      console.error("generateMountainBiomeTerrain not found in ProcGenUtils");
      return baseMapData;
    }

    const mapData = window.ProcGenUtils.generateMountainBiomeTerrain(
      width,
      height,
      width,
      seed,
      mountainCeilingTile,
      mountainWallTile,
      baseMapData,
      worldCoords
    );

    // Check if we're underground (has biomeLayerStack)
    const procGenData = $gameSystem?._procGenData;
    const isUnderground = procGenData && procGenData.biomeLayerStack && procGenData.biomeLayerStack.length > 0;

    // Seal borders with MountainWall when bordering non-Seabed underground biomes
    if (isUnderground && adjacentBiomes) {
      const borderThickness = 5; // Same as cave biomes

      // Helper function to check if we should seal a border
      const shouldSealBorder = (direction) => {
        if (!adjacentBiomes[direction]) return false;

        // Get the adjacent surface biome name
        const adjacentSurfaceBiomeName = adjacentBiomes[direction];

        // Don't seal if adjacent surface is also Ocean (Seabed's surface equivalent)
        if (adjacentSurfaceBiomeName === "Ocean") {
          return false;
        }

        // Get the adjacent surface biome object
        const adjacentSurfaceBiomeObj = getBiomeByName ? getBiomeByName(adjacentSurfaceBiomeName) : null;

        if (!adjacentSurfaceBiomeObj) return false;

        // Get what underground biome the adjacent surface would become
        const adjacentUndergroundBiomeName = adjacentSurfaceBiomeObj.lowerLayer;

        if (!adjacentUndergroundBiomeName) {
          // Adjacent surface has no underground layer, seal the border
          return true;
        }

        // Don't seal if adjacent underground is also Seabed
        if (adjacentUndergroundBiomeName === "Seabed") {
          return false;
        }

        // Seal if adjacent underground is a different biome (Cave, CaveFlooded, etc.)
        return true;
      };

      // Check which borders should be sealed
      const sealNorth = shouldSealBorder("north");
      const sealSouth = shouldSealBorder("south");
      const sealEast = shouldSealBorder("east");
      const sealWest = shouldSealBorder("west");

      // Seal the borders with MountainWall tiles
      for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
          let shouldSeal = false;

          // North border
          if (sealNorth && y < borderThickness) {
            shouldSeal = true;
          }
          // South border
          if (sealSouth && y >= height - borderThickness) {
            shouldSeal = true;
          }
          // West border
          if (sealWest && x < borderThickness) {
            shouldSeal = true;
          }
          // East border
          if (sealEast && x >= width - borderThickness) {
            shouldSeal = true;
          }

          if (shouldSeal) {
            const idx = calculateIndex(x, y, 0, width, height);
            mapData[idx] = mountainWallTile;
          }
        }
      }
    }

    return mapData;
  }

  // ===== EXPORTS =====

  if (!window.ProcGenBeach) window.ProcGenBeach = {};
  window.ProcGenBeach = {
    isWaterBiome,
    getWaterAutotileIndex,
    getWaterTileForAutotiling,
    drawWaterEdges,
    drawWaterCorners,
    getGameDateFromVariable,
    calculateTideState,
    getTideMultiplier,
    getTideDependentSeed,
    generateSeabedBiomeTerrain,
  };
})();
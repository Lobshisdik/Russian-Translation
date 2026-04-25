/*:
 * @target MZ
 * @plugindesc Procedural river generation system: linear, cross, T-intersections, and corners
 * @author Omni-Lex
 *
 * @help
 * Procedural Map River Generator
 * ==============================
 * Handles all river-related terrain generation including:
 * - River detection and biome classification
 * - Linear river generation (horizontal, vertical)
 * - Intersection rivers (cross, T-junctions, corners)
 * - River blending with neighbouring biomes like roads
 * - River edge decorations (reeds, rocks)
 * - River configuration parsing
 *
 * RIVER DIRECTIONS:
 * ===============
 * LINEAR:
 *   - "horizontal"  : Horizontal river (left-right)
 *   - "vertical"    : Vertical river (up-down)
 *
 * INTERSECTIONS:
 *   - "cross"       : 4-way intersection (river confluence)
 *   - "t-up"/"t-north"     : T-junction with stem pointing north (missing south)
 *   - "t-down"/"t-south"   : T-junction with stem pointing south (missing north)
 *   - "t-left"/"t-west"    : T-junction with stem pointing west (missing east)
 *   - "t-right"/"t-east"   : T-junction with stem pointing east (missing west)
 *
 * CORNERS (L-shaped, connects two perpendicular directions):
 *   - "corner-up-right"     : Connects north and east (⌐ shape)
 *   - "corner-up-left"      : Connects north and west (┐ shape)
 *   - "corner-down-right"   : Connects south and east (┌ shape)
 *   - "corner-down-left"    : Connects south and west (┘ shape)
 *   - "corner-north-east"   : Alias for corner-up-right
 *   - "corner-north-west"   : Alias for corner-up-left
 *   - "corner-south-east"   : Alias for corner-down-right
 *   - "corner-south-west"   : Alias for corner-down-left
 *
 * Requires ProceduralMapUtils.js to be loaded first
 */

(() => {
  "use strict";

  const pluginName = "ProceduralMapRiverGenerator";

  // Import utilities from ProceduralMapUtils
  const Utils2 = window.ProcGenUtils;
  if (!Utils2) {
    console.error(
      "ProceduralMapRiverGenerator requires ProceduralMapUtils plugin"
    );
    return;
  }

  const {
    createSeededRandom,
    randomChoice,
    calculateIndex,
    PROC_MAP_WIDTH,
    PROC_MAP_HEIGHT,
  } = Utils2;

  // ===== RIVER DETECTION =====

  /**
   * Check if biome is a river biome
   */
  function isRiverBiome(biomeName) {
    return (
      biomeName.toLowerCase().startsWith("river ") ||
      biomeName.toLowerCase() === "river" ||
      biomeName.toLowerCase() === "stream" ||
      parseRiverConfig(biomeName) !== null
    );
  }

  // ===== RIVER CONFIGURATION =====

  /**
   * Parse river configuration from biome name
   */
  function parseRiverConfig(biomeName) {
    const riverMatch = biomeName.match(/<River:\s*(\d+)\s+(\w+-?\w*)>/i);
    if (riverMatch) {
      return {
        tileId: parseInt(riverMatch[1]),
        direction: riverMatch[2].toLowerCase(),
        isCross: riverMatch[2].toLowerCase() === "cross",
        isT: riverMatch[2].toLowerCase().startsWith("t-"),
      };
    }
    return null;
  }

  /**
   * Get river decoration tile ID from features (reeds, rocks, etc.)
   * Returns the first single-tile variant of RiverEdge, or null if not found
   */
  function getRiverDecorationTileId(allFeatures) {
    if (allFeatures["RiverEdge"] && allFeatures["RiverEdge"].length > 0) {
      for (const variant of allFeatures["RiverEdge"]) {
        if (variant.type === "single") {
          return variant.tileId;
        }
      }
    }
    return null;
  }

  // ===== RIVER TILE DETECTION =====

  /**
   * Check if a position is on a river tile (center 5-tile wide river)
   * Rivers are narrower than roads to make them more organic
   */
  function isPositionOnRiverTile(x, y, width, height) {
    const riverWidth = 5;
    const centerX = Math.floor(width / 2);
    const centerY = Math.floor(height / 2);
    const halfRiver = Math.floor(riverWidth / 2);

    const riverStartX = Math.max(0, centerX - halfRiver);
    const riverEndX = Math.min(width, riverStartX + riverWidth);
    const riverStartY = Math.max(0, centerY - halfRiver);
    const riverEndY = Math.min(height, riverStartY + riverWidth);

    // Check if position is within the river area (both horizontally and vertically)
    const onRiverX = x >= riverStartX && x < riverEndX;
    const onRiverY = y >= riverStartY && y < riverEndY;

    // Position is ON river if it's in the intersection or main river area
    return onRiverX && onRiverY;
  }

  // ===== RIVER DECORATION DRAWING =====

  /**
   * Draw decorative river edge elements (reeds, rocks)
   * Places decoration on the edges of linear rivers only
   */
  function drawRiverDecorations(
    mapData,
    decorationTileId,
    direction,
    width,
    height,
    riverWidth
  ) {
    if (!decorationTileId) return;

    const centerX = Math.floor(width / 2);
    const centerY = Math.floor(height / 2);
    const halfRiver = Math.floor(riverWidth / 2);

    const riverStartX = centerX - halfRiver;
    const riverEndX = riverStartX + riverWidth;
    const riverStartY = centerY - halfRiver;
    const riverEndY = riverStartY + riverWidth;

    // Decoration frequency (every 3 tiles)
    const DECORATION_SPACING = 3;

    if (direction === "up" || direction === "vertical") {
      // Left edge decorations
      for (let y = 0; y < height; y += DECORATION_SPACING) {
        if (riverStartX > 0) {
          const idx = calculateIndex(riverStartX - 1, y, 2, width, height);
          mapData[idx] = decorationTileId;
        }
      }

      // Right edge decorations
      for (let y = 0; y < height; y += DECORATION_SPACING) {
        if (riverEndX < width) {
          const idx = calculateIndex(riverEndX, y, 2, width, height);
          mapData[idx] = decorationTileId;
        }
      }
    } else {
      // Top edge decorations
      for (let x = 0; x < width; x += DECORATION_SPACING) {
        if (riverStartY > 0) {
          const idx = calculateIndex(x, riverStartY - 1, 2, width, height);
          mapData[idx] = decorationTileId;
        }
      }

      // Bottom edge decorations
      for (let x = 0; x < width; x += DECORATION_SPACING) {
        if (riverEndY < height) {
          const idx = calculateIndex(x, riverEndY, 2, width, height);
          mapData[idx] = decorationTileId;
        }
      }
    }
  }

  // ===== RIVER DRAWING =====

  /**
   * Draw a rectangle for river segments
   */
  function drawRect(mapData, tileId, x, y, w, h, mapW, mapH) {
    const startX = Math.max(0, x);
    const endX = Math.min(mapW, x + w);
    const startY = Math.max(0, y);
    const endY = Math.min(mapH, y + h);

    for (let cy = startY; cy < endY; cy++) {
      for (let cx = startX; cx < endX; cx++) {
        const idx = cy * mapW + cx;
        mapData[idx] = tileId;
      }
    }
  }

  /**
   * Draw a linear river (single centered river)
   */
  function drawLinearRiver(mapData, tileId, direction, width, height, decorationTileId) {
    const riverWidth = 5;
    const centerX = Math.floor(width / 2);
    const centerY = Math.floor(height / 2);
    const halfRiver = Math.floor(riverWidth / 2);

    if (direction === "up" || direction === "vertical") {
      // Vertical river
      const riverX = centerX - halfRiver;

      for (let y = 0; y < height; y++) {
        for (let x = riverX; x < riverX + riverWidth; x++) {
          if (x >= 0 && x < width) {
            const idx = calculateIndex(x, y, 0, width, height);
            mapData[idx] = tileId;
          }
        }
      }
    } else if (direction === "down" || direction === "horizontal") {
      // Horizontal river
      const riverY = centerY - halfRiver;

      for (let y = riverY; y < riverY + riverWidth; y++) {
        if (y >= 0 && y < height) {
          for (let x = 0; x < width; x++) {
            const idx = calculateIndex(x, y, 0, width, height);
            mapData[idx] = tileId;
          }
        }
      }
    }

    // Draw edge decorations
    drawRiverDecorations(mapData, decorationTileId, direction, width, height, riverWidth);
  }

  /**
   * Draw a river cross (4-way confluence)
   */
  function drawCrossRiver(mapData, tileId, width, height, decorationTileId) {
    const riverWidth = 5;
    const centerX = Math.floor(width / 2);
    const centerY = Math.floor(height / 2);
    const halfRiver = Math.floor(riverWidth / 2);

    const riverX = centerX - halfRiver;
    const riverY = centerY - halfRiver;

    // Horizontal river
    for (let y = riverY; y < riverY + riverWidth; y++) {
      if (y >= 0 && y < height) {
        for (let x = 0; x < width; x++) {
          const idx = calculateIndex(x, y, 0, width, height);
          mapData[idx] = tileId;
        }
      }
    }

    // Vertical river
    for (let y = 0; y < height; y++) {
      for (let x = riverX; x < riverX + riverWidth; x++) {
        if (x >= 0 && x < width) {
          const idx = calculateIndex(x, y, 0, width, height);
          mapData[idx] = tileId;
        }
      }
    }
  }

  /**
   * Draw a T-shaped river junction
   */
  function drawTRiver(mapData, tileId, direction, width, height, decorationTileId) {
    const riverWidth = 5;
    const centerX = Math.floor(width / 2);
    const centerY = Math.floor(height / 2);
    const halfRiver = Math.floor(riverWidth / 2);

    const riverX = centerX - halfRiver;
    const riverY = centerY - halfRiver;

    if (direction === "t-up" || direction === "t-north") {
      // Horizontal river + vertical stem pointing up
      // Horizontal river
      drawRect(mapData, tileId, 0, riverY, width, riverWidth, width, height);
      // Vertical stem (from top to center)
      drawRect(mapData, tileId, riverX, 0, riverWidth, riverY + riverWidth, width, height);
    } else if (direction === "t-down" || direction === "t-south") {
      // Horizontal river + vertical stem pointing down
      // Horizontal river
      drawRect(mapData, tileId, 0, riverY, width, riverWidth, width, height);
      // Vertical stem (from center to bottom)
      drawRect(mapData, tileId, riverX, riverY, riverWidth, height - riverY, width, height);
    } else if (direction === "t-left" || direction === "t-west") {
      // Vertical river + horizontal stem pointing left
      // Vertical river
      drawRect(mapData, tileId, riverX, 0, riverWidth, height, width, height);
      // Horizontal stem (from left to center)
      drawRect(mapData, tileId, 0, riverY, riverX + riverWidth, riverWidth, width, height);
    } else if (direction === "t-right" || direction === "t-east") {
      // Vertical river + horizontal stem pointing right
      // Vertical river
      drawRect(mapData, tileId, riverX, 0, riverWidth, height, width, height);
      // Horizontal stem (from center to right)
      drawRect(mapData, tileId, riverX, riverY, width - riverX, riverWidth, width, height);
    }
  }

  /**
   * Draw a corner river (L-shaped)
   */
  function drawCornerRiver(mapData, tileId, direction, width, height, decorationTileId) {
    const riverWidth = 5;
    const centerX = Math.floor(width / 2);
    const centerY = Math.floor(height / 2);
    const halfRiver = Math.floor(riverWidth / 2);

    const riverX = centerX - halfRiver;
    const riverY = centerY - halfRiver;

    // Normalize direction aliases
    let normalizedDir = direction.toLowerCase();
    normalizedDir = normalizedDir.replace("north", "up").replace("south", "down");
    normalizedDir = normalizedDir.replace("east", "right").replace("west", "left");

    if (normalizedDir === "corner-up-right" || normalizedDir === "corner-right-up") {
      // Up and Right (North -> East)
      // Vertical river from top to center
      drawRect(mapData, tileId, riverX, 0, riverWidth, riverY + riverWidth, width, height);
      // Horizontal river from center to right
      drawRect(mapData, tileId, riverX, riverY, width - riverX, riverWidth, width, height);
    } else if (normalizedDir === "corner-up-left" || normalizedDir === "corner-left-up") {
      // Up and Left (North -> West)
      // Vertical river from top to center
      drawRect(mapData, tileId, riverX, 0, riverWidth, riverY + riverWidth, width, height);
      // Horizontal river from left to center
      drawRect(mapData, tileId, 0, riverY, riverX + riverWidth, riverWidth, width, height);
    } else if (normalizedDir === "corner-down-right" || normalizedDir === "corner-right-down") {
      // Down and Right (South -> East)
      // Vertical river from center to bottom
      drawRect(mapData, tileId, riverX, riverY, riverWidth, height - riverY, width, height);
      // Horizontal river from center to right
      drawRect(mapData, tileId, riverX, riverY, width - riverX, riverWidth, width, height);
    } else if (normalizedDir === "corner-down-left" || normalizedDir === "corner-left-down") {
      // Down and Left (South -> West)
      // Vertical river from center to bottom
      drawRect(mapData, tileId, riverX, riverY, riverWidth, height - riverY, width, height);
      // Horizontal river from left to center
      drawRect(mapData, tileId, 0, riverY, riverX + riverWidth, riverWidth, width, height);
    }
  }

  /**
   * Generate procedural terrain for a river biome
   * Requires blendBiomeBorders from ProceduralMapBiomeGenerator to be called separately
   */
  function generateRiverBiome(mapData, biome, riverTileId, riverDirection, decorationTileId, width = PROC_MAP_WIDTH, height = PROC_MAP_HEIGHT) {
    let direction = riverDirection || "horizontal";
    const riverConfig = parseRiverConfig(biome.name);

    if (riverConfig) {
      if (riverConfig.isCross) {
        drawCrossRiver(mapData, riverTileId, width, height, decorationTileId);
      } else if (riverConfig.isT) {
        drawTRiver(mapData, riverTileId, riverConfig.direction, width, height, decorationTileId);
      } else {
        drawLinearRiver(
          mapData,
          riverTileId,
          riverConfig.direction,
          width,
          height,
          decorationTileId
        );
      }
    } else {
      if (direction.includes("cross")) {
        drawCrossRiver(mapData, riverTileId, width, height, decorationTileId);
      } else if (direction.includes("t-")) {
        drawTRiver(mapData, riverTileId, direction, width, height, decorationTileId);
      } else if (direction.includes("corner-")) {
        drawCornerRiver(mapData, riverTileId, direction, width, height, decorationTileId);
      } else {
        drawLinearRiver(mapData, riverTileId, direction, width, height, decorationTileId);
      }
    }
  }

  // ===== INTERSECTION TYPE DETECTION =====

  /**
   * Determine river intersection type based on adjacent biomes
   * Returns the appropriate river direction based on which adjacent biomes are rivers
   *
   * @param {Object} adjacentBiomes - Object with north, south, east, west biome names
   * @param {Function} isRiverBiomeFn - Function to check if biome is a river (default: isRiverBiome)
   * @returns {string} River direction type (horizontal, vertical, cross, t-north, corner-up-right, etc.)
   */
  function determineRiverIntersectionType(adjacentBiomes, isRiverBiomeFn = isRiverBiome) {
    if (!adjacentBiomes) {
      return "horizontal"; // Default fallback
    }

    // Check which directions have adjacent river biomes
    const hasNorth = adjacentBiomes.north && isRiverBiomeFn(adjacentBiomes.north);
    const hasSouth = adjacentBiomes.south && isRiverBiomeFn(adjacentBiomes.south);
    const hasEast = adjacentBiomes.east && isRiverBiomeFn(adjacentBiomes.east);
    const hasWest = adjacentBiomes.west && isRiverBiomeFn(adjacentBiomes.west);

    // Debug logging
    console.log(
      `[River Intersection] N:${hasNorth} S:${hasSouth} E:${hasEast} W:${hasWest}`
    );

    // Count adjacent rivers
    const riverCount = [hasNorth, hasSouth, hasEast, hasWest].filter(Boolean).length;

    // 4-way intersection (confluence)
    if (hasNorth && hasSouth && hasEast && hasWest) {
      return "cross";
    }

    // 3-way intersections (T-junctions)
    if (hasNorth && hasSouth && hasEast && !hasWest) {
      return "t-east";
    }
    if (hasNorth && hasSouth && hasWest && !hasEast) {
      return "t-west";
    }
    if (hasNorth && hasEast && hasWest && !hasSouth) {
      return "t-north";
    }
    if (hasSouth && hasEast && hasWest && !hasNorth) {
      return "t-south";
    }

    // 2-way intersections (corners)
    if (hasNorth && hasEast && !hasSouth && !hasWest) {
      return "corner-up-right";
    }
    if (hasNorth && hasWest && !hasSouth && !hasEast) {
      return "corner-up-left";
    }
    if (hasSouth && hasEast && !hasNorth && !hasWest) {
      return "corner-down-right";
    }
    if (hasSouth && hasWest && !hasNorth && !hasEast) {
      return "corner-down-left";
    }

    // Linear rivers (only 1 or 2 parallel connections)
    if ((hasNorth && hasSouth && !hasEast && !hasWest) ||
        (!hasNorth && !hasSouth && hasEast && hasWest)) {
      return hasNorth || hasSouth ? "vertical" : "horizontal";
    }

    // Single direction (dead-end river facing one direction)
    if (hasNorth && !hasSouth && !hasEast && !hasWest) {
      return "vertical";
    }
    if (hasSouth && !hasNorth && !hasEast && !hasWest) {
      return "vertical";
    }
    if (hasEast && !hasWest && !hasNorth && !hasSouth) {
      return "horizontal";
    }
    if (hasWest && !hasEast && !hasNorth && !hasSouth) {
      return "horizontal";
    }

    // Default fallback
    return "horizontal";
  }

  // ===== EXPORT FUNCTIONS =====

  window.ProcGenRivers = {
    isRiverBiome,
    parseRiverConfig,
    getRiverDecorationTileId,
    isPositionOnRiverTile,
    drawRiverDecorations,
    drawRect,
    drawLinearRiver,
    drawCrossRiver,
    drawTRiver,
    drawCornerRiver,
    generateRiverBiome,
    determineRiverIntersectionType,
  };
})();

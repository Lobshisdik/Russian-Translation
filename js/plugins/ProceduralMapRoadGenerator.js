/*:
 * @target MZ
 * @plugindesc Procedural road generation system: linear, cross, T-intersections, and corners
 * @author Omni-Lex
 *
 * @help
 * Procedural Map Road Generator
 * ==============================
 * Handles all road-related terrain generation including:
 * - Road detection and biome classification
 * - Linear road generation (horizontal, vertical)
 * - Intersection roads (cross, T-junctions, corners)
 * - Dashed road center line markings
 * - Road configuration parsing
 * - Water edge integration with roads
 *
 * ROAD DIRECTIONS:
 * ===============
 * LINEAR:
 *   - "horizontal"  : Horizontal road (left-right)
 *   - "vertical"    : Vertical road (up-down)
 *
 * INTERSECTIONS:
 *   - "cross"       : 4-way intersection (crossroad)
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

  const pluginName = "ProceduralMapRoadGenerator";

  // Import utilities from ProceduralMapUtils
  const Utils2 = window.ProcGenUtils;
  if (!Utils2) {
    console.error(
      "ProceduralMapRoadGenerator requires ProceduralMapUtils plugin"
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

  // ===== ROAD DETECTION =====

  /**
   * Check if biome is a road/highway biome
   */
  function isRoadBiome(biomeName) {
    return (
      biomeName.toLowerCase().startsWith("road ") ||
      biomeName.toLowerCase() === "road" ||
      biomeName.toLowerCase() === "highway" ||
      parseRoadConfig(biomeName) !== null
    );
  }

  /**
   * Check if biome is a city biome
   */
  function isCityBiome(biomeName) {
    return biomeName && biomeName.toLowerCase().includes("city");
  }

  /**
   * Check if biome is a village biome
   */
  function isVillageBiome(biomeName) {
    return biomeName && biomeName.toLowerCase().includes("village");
  }

  // ===== ROAD CONFIGURATION =====

  /**
   * Parse road configuration from biome name
   */
  function parseRoadConfig(biomeName) {
    const roadMatch = biomeName.match(/<Road:\s*(\d+)\s+(\w+-?\w*)>/i);
    if (roadMatch) {
      return {
        tileId: parseInt(roadMatch[1]),
        direction: roadMatch[2].toLowerCase(),
        isCross: roadMatch[2].toLowerCase() === "cross",
        isT: roadMatch[2].toLowerCase().startsWith("t-"),
      };
    }
    return null;
  }

  /**
   * Get DashedLine tile ID from features
   * Returns the first single-tile variant of DashedLine, or null if not found
   */
  function getDashedLineTileId(allFeatures) {
    if (allFeatures["DashedLine"] && allFeatures["DashedLine"].length > 0) {
      for (const variant of allFeatures["DashedLine"]) {
        if (variant.type === "single") {
          return variant.tileId;
        }
      }
    }
    return null;
  }

  // ===== ROAD TILE DETECTION =====

  /**
   * Check if a position is on a road tile (center 7-tile wide road)
   * Used to prevent features from being placed ON the road itself
   */
  function isPositionOnRoadTile(x, y, width, height) {
    const roadWidth = 7;
    const centerX = Math.floor(width / 2);
    const centerY = Math.floor(height / 2);
    const halfRoad = Math.floor(roadWidth / 2);

    const roadStartX = Math.max(0, centerX - halfRoad);
    const roadEndX = Math.min(width, roadStartX + roadWidth);
    const roadStartY = Math.max(0, centerY - halfRoad);
    const roadEndY = Math.min(height, roadStartY + roadWidth);

    // Check if position is within the road area (both horizontally and vertically)
    const onRoadX = x >= roadStartX && x < roadEndX;
    const onRoadY = y >= roadStartY && y < roadEndY;

    // Position is ON road if it's in the intersection or main road area
    return onRoadX && onRoadY;
  }

  // ===== DASHED LINE DRAWING =====

  /**
   * Draw dashed lines for dual highway roads
   * Draws center line in each of the two parallel roads
   */
  function drawDashedCenterLine(
    mapData,
    dashedLineTileId,
    direction,
    width,
    height,
    roadWidth
  ) {
    if (!dashedLineTileId) return;

    const separation = 3;
    const roadCenterX = Math.floor(width / 2);
    const roadCenterY = Math.floor(height / 2);
    const halfRoad = Math.floor(roadWidth / 2);
    const roadCenter = Math.floor(roadWidth / 2);

    const DASH_LENGTH = 3;
    const DASH_GAP = 1;
    const DASH_CYCLE = DASH_LENGTH + DASH_GAP;

    if (direction === "up" || direction === "vertical") {
      // Two vertical roads with dashed center lines
      const leftRoadX = roadCenterX - halfRoad - roadWidth - separation + roadCenter;
      const rightRoadX = roadCenterX + halfRoad + separation + roadCenter;

      // Left road dashed line
      for (let y = 0; y < height; y++) {
        const cyclePos = y % DASH_CYCLE;
        if (cyclePos < DASH_LENGTH) {
          const idx = calculateIndex(leftRoadX, y, 1, width, height);
          mapData[idx] = dashedLineTileId;
        }
      }

      // Right road dashed line
      for (let y = 0; y < height; y++) {
        const cyclePos = y % DASH_CYCLE;
        if (cyclePos < DASH_LENGTH) {
          const idx = calculateIndex(rightRoadX, y, 1, width, height);
          mapData[idx] = dashedLineTileId;
        }
      }
    } else {
      // Two horizontal roads with dashed center lines
      const topRoadY = roadCenterY - halfRoad - roadWidth - separation + roadCenter;
      const bottomRoadY = roadCenterY + halfRoad + separation + roadCenter;

      // Top road dashed line
      for (let x = 0; x < width; x++) {
        const cyclePos = x % DASH_CYCLE;
        if (cyclePos < DASH_LENGTH) {
          const idx = calculateIndex(x, topRoadY, 1, width, height);
          mapData[idx] = dashedLineTileId;
        }
      }

      // Bottom road dashed line
      for (let x = 0; x < width; x++) {
        const cyclePos = x % DASH_CYCLE;
        if (cyclePos < DASH_LENGTH) {
          const idx = calculateIndex(x, bottomRoadY, 1, width, height);
          mapData[idx] = dashedLineTileId;
        }
      }
    }
  }

  /**
   * Draw dashed lines for dual highway cross roads
   * Avoids drawing in the center intersection areas
   */
  function drawDashedCrossLines(
    mapData,
    dashedLineTileId,
    width,
    height,
    roadWidth
  ) {
    if (!dashedLineTileId) return;

    const separation = 3;
    const centerX = Math.floor(width / 2);
    const centerY = Math.floor(height / 2);
    const halfRoad = Math.floor(roadWidth / 2);
    const roadCenter = Math.floor(roadWidth / 2);

    const DASH_LENGTH = 3;
    const DASH_GAP = 1;
    const DASH_CYCLE = DASH_LENGTH + DASH_GAP;

    // Horizontal roads (top and bottom)
    const topRoadY = centerY - halfRoad - roadWidth - separation;
    const bottomRoadY = centerY + halfRoad + separation;
    const topRoadCenterY = topRoadY + roadCenter;
    const bottomRoadCenterY = bottomRoadY + roadCenter;

    // Vertical roads (left and right)
    const leftRoadX = centerX - halfRoad - roadWidth - separation;
    const rightRoadX = centerX + halfRoad + separation;
    const leftRoadCenterX = leftRoadX + roadCenter;
    const rightRoadCenterX = rightRoadX + roadCenter;

    // Intersection margin
    const intersectionMargin = roadWidth / 2;

    // Top horizontal dashed line
    for (let x = 0; x < width; x++) {
      if ((x >= leftRoadX - intersectionMargin && x < leftRoadX + roadWidth + intersectionMargin) ||
          (x >= rightRoadX - intersectionMargin && x < rightRoadX + roadWidth + intersectionMargin)) {
        continue;
      }
      const cyclePos = x % DASH_CYCLE;
      if (cyclePos < DASH_LENGTH) {
        const idx = calculateIndex(x, topRoadCenterY, 1, width, height);
        mapData[idx] = dashedLineTileId;
      }
    }

    // Bottom horizontal dashed line
    for (let x = 0; x < width; x++) {
      if ((x >= leftRoadX - intersectionMargin && x < leftRoadX + roadWidth + intersectionMargin) ||
          (x >= rightRoadX - intersectionMargin && x < rightRoadX + roadWidth + intersectionMargin)) {
        continue;
      }
      const cyclePos = x % DASH_CYCLE;
      if (cyclePos < DASH_LENGTH) {
        const idx = calculateIndex(x, bottomRoadCenterY, 1, width, height);
        mapData[idx] = dashedLineTileId;
      }
    }

    // Left vertical dashed line
    for (let y = 0; y < height; y++) {
      if ((y >= topRoadY - intersectionMargin && y < topRoadY + roadWidth + intersectionMargin) ||
          (y >= bottomRoadY - intersectionMargin && y < bottomRoadY + roadWidth + intersectionMargin)) {
        continue;
      }
      const cyclePos = y % DASH_CYCLE;
      if (cyclePos < DASH_LENGTH) {
        const idx = calculateIndex(leftRoadCenterX, y, 1, width, height);
        mapData[idx] = dashedLineTileId;
      }
    }

    // Right vertical dashed line
    for (let y = 0; y < height; y++) {
      if ((y >= topRoadY - intersectionMargin && y < topRoadY + roadWidth + intersectionMargin) ||
          (y >= bottomRoadY - intersectionMargin && y < bottomRoadY + roadWidth + intersectionMargin)) {
        continue;
      }
      const cyclePos = y % DASH_CYCLE;
      if (cyclePos < DASH_LENGTH) {
        const idx = calculateIndex(rightRoadCenterX, y, 1, width, height);
        mapData[idx] = dashedLineTileId;
      }
    }
  }

  /**
   * Draw dashed lines for dual highway T-shaped roads
   * Draws center lines for each road in the junction
   */
  function drawDashedTLines(
    mapData,
    dashedLineTileId,
    direction,
    width,
    height,
    roadWidth
  ) {
    if (!dashedLineTileId) return;

    const separation = 3;
    const centerX = Math.floor(width / 2);
    const centerY = Math.floor(height / 2);
    const halfRoad = Math.floor(roadWidth / 2);
    const roadCenter = Math.floor(roadWidth / 2);

    const DASH_LENGTH = 3;
    const DASH_GAP = 1;
    const DASH_CYCLE = DASH_LENGTH + DASH_GAP;

    const topRoadY = centerY - halfRoad - roadWidth - separation;
    const bottomRoadY = centerY + halfRoad + separation;
    const leftRoadX = centerX - halfRoad - roadWidth - separation;
    const rightRoadX = centerX + halfRoad + separation;

    const topRoadCenterY = topRoadY + roadCenter;
    const bottomRoadCenterY = bottomRoadY + roadCenter;
    const leftRoadCenterX = leftRoadX + roadCenter;
    const rightRoadCenterX = rightRoadX + roadCenter;

    if (direction === "t-up" || direction === "t-north") {
      // Horizontal roads (top and bottom) + vertical stems pointing UP
      const vertEndY = topRoadY;

      // Top horizontal dashed line
      for (let px = 0; px < width; px++) {
        if ((px >= leftRoadX && px < leftRoadX + roadWidth) || (px >= rightRoadX && px < rightRoadX + roadWidth)) {
          continue;
        }
        const cyclePos = px % DASH_CYCLE;
        if (cyclePos < DASH_LENGTH) {
          const idx = calculateIndex(px, topRoadCenterY, 1, width, height);
          mapData[idx] = dashedLineTileId;
        }
      }

      // Bottom horizontal dashed line
      for (let px = 0; px < width; px++) {
        if ((px >= leftRoadX && px < leftRoadX + roadWidth) || (px >= rightRoadX && px < rightRoadX + roadWidth)) {
          continue;
        }
        const cyclePos = px % DASH_CYCLE;
        if (cyclePos < DASH_LENGTH) {
          const idx = calculateIndex(px, bottomRoadCenterY, 1, width, height);
          mapData[idx] = dashedLineTileId;
        }
      }

      // Left vertical dashed line (stem going up)
      for (let py = 0; py < vertEndY; py++) {
        const cyclePos = py % DASH_CYCLE;
        if (cyclePos < DASH_LENGTH) {
          const idx = calculateIndex(leftRoadCenterX, py, 1, width, height);
          mapData[idx] = dashedLineTileId;
        }
      }

      // Right vertical dashed line (stem going up)
      for (let py = 0; py < vertEndY; py++) {
        const cyclePos = py % DASH_CYCLE;
        if (cyclePos < DASH_LENGTH) {
          const idx = calculateIndex(rightRoadCenterX, py, 1, width, height);
          mapData[idx] = dashedLineTileId;
        }
      }
    } else if (direction === "t-down" || direction === "t-south") {
      // Horizontal roads (top and bottom) + vertical stems pointing DOWN
      const vertStartY = bottomRoadY + roadWidth;

      // Top horizontal dashed line
      for (let px = 0; px < width; px++) {
        if ((px >= leftRoadX && px < leftRoadX + roadWidth) || (px >= rightRoadX && px < rightRoadX + roadWidth)) {
          continue;
        }
        const cyclePos = px % DASH_CYCLE;
        if (cyclePos < DASH_LENGTH) {
          const idx = calculateIndex(px, topRoadCenterY, 1, width, height);
          mapData[idx] = dashedLineTileId;
        }
      }

      // Bottom horizontal dashed line
      for (let px = 0; px < width; px++) {
        if ((px >= leftRoadX && px < leftRoadX + roadWidth) || (px >= rightRoadX && px < rightRoadX + roadWidth)) {
          continue;
        }
        const cyclePos = px % DASH_CYCLE;
        if (cyclePos < DASH_LENGTH) {
          const idx = calculateIndex(px, bottomRoadCenterY, 1, width, height);
          mapData[idx] = dashedLineTileId;
        }
      }

      // Left vertical dashed line (stem going down)
      for (let py = vertStartY; py < height; py++) {
        const cyclePos = (py - vertStartY) % DASH_CYCLE;
        if (cyclePos < DASH_LENGTH) {
          const idx = calculateIndex(leftRoadCenterX, py, 1, width, height);
          mapData[idx] = dashedLineTileId;
        }
      }

      // Right vertical dashed line (stem going down)
      for (let py = vertStartY; py < height; py++) {
        const cyclePos = (py - vertStartY) % DASH_CYCLE;
        if (cyclePos < DASH_LENGTH) {
          const idx = calculateIndex(rightRoadCenterX, py, 1, width, height);
          mapData[idx] = dashedLineTileId;
        }
      }
    } else if (direction === "t-left" || direction === "t-west") {
      // Vertical roads (left and right) + horizontal stems pointing LEFT
      const horizEndX = leftRoadX;

      // Left vertical dashed line
      for (let py = 0; py < height; py++) {
        if ((py >= topRoadY && py < topRoadY + roadWidth) || (py >= bottomRoadY && py < bottomRoadY + roadWidth)) {
          continue;
        }
        const cyclePos = py % DASH_CYCLE;
        if (cyclePos < DASH_LENGTH) {
          const idx = calculateIndex(leftRoadCenterX, py, 1, width, height);
          mapData[idx] = dashedLineTileId;
        }
      }

      // Right vertical dashed line
      for (let py = 0; py < height; py++) {
        if ((py >= topRoadY && py < topRoadY + roadWidth) || (py >= bottomRoadY && py < bottomRoadY + roadWidth)) {
          continue;
        }
        const cyclePos = py % DASH_CYCLE;
        if (cyclePos < DASH_LENGTH) {
          const idx = calculateIndex(rightRoadCenterX, py, 1, width, height);
          mapData[idx] = dashedLineTileId;
        }
      }

      // Top horizontal dashed line (stem going left)
      for (let px = 0; px < horizEndX; px++) {
        const cyclePos = px % DASH_CYCLE;
        if (cyclePos < DASH_LENGTH) {
          const idx = calculateIndex(px, topRoadCenterY, 1, width, height);
          mapData[idx] = dashedLineTileId;
        }
      }

      // Bottom horizontal dashed line (stem going left)
      for (let px = 0; px < horizEndX; px++) {
        const cyclePos = px % DASH_CYCLE;
        if (cyclePos < DASH_LENGTH) {
          const idx = calculateIndex(px, bottomRoadCenterY, 1, width, height);
          mapData[idx] = dashedLineTileId;
        }
      }
    } else if (direction === "t-right" || direction === "t-east") {
      // Vertical roads (left and right) + horizontal stems pointing RIGHT
      const horizStartX = rightRoadX + roadWidth;

      // Left vertical dashed line
      for (let py = 0; py < height; py++) {
        if ((py >= topRoadY && py < topRoadY + roadWidth) || (py >= bottomRoadY && py < bottomRoadY + roadWidth)) {
          continue;
        }
        const cyclePos = py % DASH_CYCLE;
        if (cyclePos < DASH_LENGTH) {
          const idx = calculateIndex(leftRoadCenterX, py, 1, width, height);
          mapData[idx] = dashedLineTileId;
        }
      }

      // Right vertical dashed line
      for (let py = 0; py < height; py++) {
        if ((py >= topRoadY && py < topRoadY + roadWidth) || (py >= bottomRoadY && py < bottomRoadY + roadWidth)) {
          continue;
        }
        const cyclePos = py % DASH_CYCLE;
        if (cyclePos < DASH_LENGTH) {
          const idx = calculateIndex(rightRoadCenterX, py, 1, width, height);
          mapData[idx] = dashedLineTileId;
        }
      }

      // Top horizontal dashed line (stem going right)
      for (let px = horizStartX; px < width; px++) {
        const cyclePos = (px - horizStartX) % DASH_CYCLE;
        if (cyclePos < DASH_LENGTH) {
          const idx = calculateIndex(px, topRoadCenterY, 1, width, height);
          mapData[idx] = dashedLineTileId;
        }
      }

      // Bottom horizontal dashed line (stem going right)
      for (let px = horizStartX; px < width; px++) {
        const cyclePos = (px - horizStartX) % DASH_CYCLE;
        if (cyclePos < DASH_LENGTH) {
          const idx = calculateIndex(px, bottomRoadCenterY, 1, width, height);
          mapData[idx] = dashedLineTileId;
        }
      }
    }
  }

  /**
   * Draw dashed lines for dual highway corner roads
   * Draws center lines for each road in the corner junction
   */
/**
   * Draw dashed lines for dual highway corner roads
   * FIX: Extends dashed lines to meet in the center of the corner turn
   */
function drawDashedCornerLines(
  mapData,
  dashedLineTileId,
  direction,
  width,
  height,
  roadWidth
) {
  if (!dashedLineTileId) return;

  const separation = 3;
  const centerX = Math.floor(width / 2);
  const centerY = Math.floor(height / 2);
  const halfRoad = Math.floor(roadWidth / 2);
  const roadCenter = Math.floor(roadWidth / 2);

  const DASH_LENGTH = 3;
  const DASH_GAP = 1;
  const DASH_CYCLE = DASH_LENGTH + DASH_GAP;

  const topRoadY = centerY - halfRoad - roadWidth - separation;
  const bottomRoadY = centerY + halfRoad + separation;
  const leftRoadX = centerX - halfRoad - roadWidth - separation;
  const rightRoadX = centerX + halfRoad + separation;

  const topRoadCenterY = topRoadY + roadCenter;
  const bottomRoadCenterY = bottomRoadY + roadCenter;
  const leftRoadCenterX = leftRoadX + roadCenter;
  const rightRoadCenterX = rightRoadX + roadCenter;

  // Normalize direction
  let normalizedDir = direction.toLowerCase();
  normalizedDir = normalizedDir.replace("north", "up").replace("south", "down");
  normalizedDir = normalizedDir.replace("east", "right").replace("west", "left");

  // Helper to draw dashes
  const drawDash = (idx, pos) => {
    if (pos % DASH_CYCLE < DASH_LENGTH) {
      mapData[idx] = dashedLineTileId;
    }
  };

  if (normalizedDir === "corner-up-right" || normalizedDir === "corner-right-up") {
    // OUTER LANE: Left Vert -> Bottom Horiz
    // Vertical: from top to BottomCenterY
    for (let py = 0; py <= bottomRoadCenterY; py++) {
      drawDash(calculateIndex(leftRoadCenterX, py, 1, width, height), py);
    }
    // Horizontal: from LeftCenterX to right edge
    for (let px = leftRoadCenterX; px < width; px++) {
      drawDash(calculateIndex(px, bottomRoadCenterY, 1, width, height), px);
    }

    // INNER LANE: Right Vert -> Top Horiz
    // Vertical: from top to TopCenterY
    for (let py = 0; py <= topRoadCenterY; py++) {
      drawDash(calculateIndex(rightRoadCenterX, py, 1, width, height), py);
    }
    // Horizontal: from RightCenterX to right edge
    for (let px = rightRoadCenterX; px < width; px++) {
      drawDash(calculateIndex(px, topRoadCenterY, 1, width, height), px);
    }

  } else if (normalizedDir === "corner-up-left" || normalizedDir === "corner-left-up") {
    // INNER LANE: Left Vert -> Top Horiz
    // Vertical: from top to TopCenterY
    for (let py = 0; py <= topRoadCenterY; py++) {
      drawDash(calculateIndex(leftRoadCenterX, py, 1, width, height), py);
    }
    // Horizontal: from left edge to LeftCenterX
    for (let px = 0; px <= leftRoadCenterX; px++) {
      drawDash(calculateIndex(px, topRoadCenterY, 1, width, height), px);
    }

    // OUTER LANE: Right Vert -> Bottom Horiz
    // Vertical: from top to BottomCenterY
    for (let py = 0; py <= bottomRoadCenterY; py++) {
      drawDash(calculateIndex(rightRoadCenterX, py, 1, width, height), py);
    }
    // Horizontal: from left edge to RightCenterX
    for (let px = 0; px <= rightRoadCenterX; px++) {
      drawDash(calculateIndex(px, bottomRoadCenterY, 1, width, height), px);
    }

  } else if (normalizedDir === "corner-down-right" || normalizedDir === "corner-right-down") {
    // OUTER LANE: Left Vert -> Top Horiz
    // Vertical: from TopCenterY to bottom
    for (let py = topRoadCenterY; py < height; py++) {
      drawDash(calculateIndex(leftRoadCenterX, py, 1, width, height), py);
    }
    // Horizontal: from LeftCenterX to right edge
    for (let px = leftRoadCenterX; px < width; px++) {
      drawDash(calculateIndex(px, topRoadCenterY, 1, width, height), px);
    }

    // INNER LANE: Right Vert -> Bottom Horiz
    // Vertical: from BottomCenterY to bottom
    for (let py = bottomRoadCenterY; py < height; py++) {
      drawDash(calculateIndex(rightRoadCenterX, py, 1, width, height), py);
    }
    // Horizontal: from RightCenterX to right edge
    for (let px = rightRoadCenterX; px < width; px++) {
      drawDash(calculateIndex(px, bottomRoadCenterY, 1, width, height), px);
    }

  } else if (normalizedDir === "corner-down-left" || normalizedDir === "corner-left-down") {
    // INNER LANE: Left Vert -> Bottom Horiz
    // Vertical: from BottomCenterY to bottom
    for (let py = bottomRoadCenterY; py < height; py++) {
      drawDash(calculateIndex(leftRoadCenterX, py, 1, width, height), py);
    }
    // Horizontal: from left edge to LeftCenterX
    for (let px = 0; px <= leftRoadCenterX; px++) {
      drawDash(calculateIndex(px, bottomRoadCenterY, 1, width, height), px);
    }

    // OUTER LANE: Right Vert -> Top Horiz
    // Vertical: from TopCenterY to bottom
    for (let py = topRoadCenterY; py < height; py++) {
      drawDash(calculateIndex(rightRoadCenterX, py, 1, width, height), py);
    }
    // Horizontal: from left edge to RightCenterX
    for (let px = 0; px <= rightRoadCenterX; px++) {
      drawDash(calculateIndex(px, topRoadCenterY, 1, width, height), px);
    }
  }
}

  // ===== ROAD DRAWING =====

  /**
   * Draw a rectangle for road segments
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
   * Draw a dual highway (two roads separated by 3 tiles)
   */
  function drawLinearRoad(mapData, tileId, direction, width, height, dashedLineTileId) {
    const roadWidth = 7;
    const separation = 3;
    const roadCenterX = Math.floor(width / 2);
    const roadCenterY = Math.floor(height / 2);
    const halfRoad = Math.floor(roadWidth / 2);

    if (direction === "up" || direction === "vertical") {
      // Two vertical roads separated by 3 tiles
      const leftRoadX = roadCenterX - halfRoad - roadWidth - separation;
      const rightRoadX = roadCenterX + halfRoad + separation;

      // Left road
      for (let y = 0; y < height; y++) {
        for (let x = leftRoadX; x < leftRoadX + roadWidth; x++) {
          if (x >= 0 && x < width) {
            const idx = calculateIndex(x, y, 0, width, height);
            mapData[idx] = tileId;
          }
        }
      }

      // Right road
      for (let y = 0; y < height; y++) {
        for (let x = rightRoadX; x < rightRoadX + roadWidth; x++) {
          if (x >= 0 && x < width) {
            const idx = calculateIndex(x, y, 0, width, height);
            mapData[idx] = tileId;
          }
        }
      }
    } else if (direction === "down" || direction === "horizontal") {
      // Two horizontal roads separated by 3 tiles
      const topRoadY = roadCenterY - halfRoad - roadWidth - separation;
      const bottomRoadY = roadCenterY + halfRoad + separation;

      // Top road
      for (let y = topRoadY; y < topRoadY + roadWidth; y++) {
        if (y >= 0 && y < height) {
          for (let x = 0; x < width; x++) {
            const idx = calculateIndex(x, y, 0, width, height);
            mapData[idx] = tileId;
          }
        }
      }

      // Bottom road
      for (let y = bottomRoadY; y < bottomRoadY + roadWidth; y++) {
        if (y >= 0 && y < height) {
          for (let x = 0; x < width; x++) {
            const idx = calculateIndex(x, y, 0, width, height);
            mapData[idx] = tileId;
          }
        }
      }
    }

    // Draw center dashed lines
    drawDashedCenterLine(mapData, dashedLineTileId, direction, width, height, roadWidth);
  }

  /**
   * Draw a dual highway cross road (4-way intersection with two roads in each direction)
   */
  function drawCrossRoad(mapData, tileId, width, height, dashedLineTileId) {
    const roadWidth = 7;
    const separation = 3;
    const centerX = Math.floor(width / 2);
    const centerY = Math.floor(height / 2);
    const halfRoad = Math.floor(roadWidth / 2);

    // Horizontal roads (top and bottom)
    const topRoadY = centerY - halfRoad - roadWidth - separation;
    const bottomRoadY = centerY + halfRoad + separation;

    // Top horizontal road
    for (let y = topRoadY; y < topRoadY + roadWidth; y++) {
      if (y >= 0 && y < height) {
        for (let x = 0; x < width; x++) {
          const idx = calculateIndex(x, y, 0, width, height);
          mapData[idx] = tileId;
        }
      }
    }

    // Bottom horizontal road
    for (let y = bottomRoadY; y < bottomRoadY + roadWidth; y++) {
      if (y >= 0 && y < height) {
        for (let x = 0; x < width; x++) {
          const idx = calculateIndex(x, y, 0, width, height);
          mapData[idx] = tileId;
        }
      }
    }

    // Vertical roads (left and right)
    const leftRoadX = centerX - halfRoad - roadWidth - separation;
    const rightRoadX = centerX + halfRoad + separation;

    // Left vertical road
    for (let y = 0; y < height; y++) {
      for (let x = leftRoadX; x < leftRoadX + roadWidth; x++) {
        if (x >= 0 && x < width) {
          const idx = calculateIndex(x, y, 0, width, height);
          mapData[idx] = tileId;
        }
      }
    }

    // Right vertical road
    for (let y = 0; y < height; y++) {
      for (let x = rightRoadX; x < rightRoadX + roadWidth; x++) {
        if (x >= 0 && x < width) {
          const idx = calculateIndex(x, y, 0, width, height);
          mapData[idx] = tileId;
        }
      }
    }

    // Draw dashed lines with intersection avoidance
    drawDashedCrossLines(mapData, dashedLineTileId, width, height, roadWidth);
  }

  /**
   * Draw a dual highway T-shaped road with rotation
   */
  function drawTRoad(mapData, tileId, direction, width, height, dashedLineTileId) {
    const roadWidth = 7;
    const separation = 3;
    const centerX = Math.floor(width / 2);
    const centerY = Math.floor(height / 2);
    const halfRoad = Math.floor(roadWidth / 2);

    const topRoadY = centerY - halfRoad - roadWidth - separation;
    const bottomRoadY = centerY + halfRoad + separation;
    const leftRoadX = centerX - halfRoad - roadWidth - separation;
    const rightRoadX = centerX + halfRoad + separation;

    if (direction === "t-up" || direction === "t-north") {
      // Horizontal roads (top and bottom) + vertical stem pointing up
      // Top horizontal
      drawRect(mapData, tileId, 0, topRoadY, width, roadWidth, width, height);
      // Bottom horizontal
      drawRect(mapData, tileId, 0, bottomRoadY, width, roadWidth, width, height);
      // Left vertical stem (from top to center)
      drawRect(mapData, tileId, leftRoadX, 0, roadWidth, topRoadY, width, height);
      // Right vertical stem (from top to center)
      drawRect(mapData, tileId, rightRoadX, 0, roadWidth, topRoadY, width, height);
    } else if (direction === "t-down" || direction === "t-south") {
      // Horizontal roads (top and bottom) + vertical stem pointing down
      // Top horizontal
      drawRect(mapData, tileId, 0, topRoadY, width, roadWidth, width, height);
      // Bottom horizontal
      drawRect(mapData, tileId, 0, bottomRoadY, width, roadWidth, width, height);
      // Left vertical stem (from center to bottom)
      drawRect(mapData, tileId, leftRoadX, bottomRoadY + roadWidth, roadWidth, height - (bottomRoadY + roadWidth), width, height);
      // Right vertical stem (from center to bottom)
      drawRect(mapData, tileId, rightRoadX, bottomRoadY + roadWidth, roadWidth, height - (bottomRoadY + roadWidth), width, height);
    } else if (direction === "t-left" || direction === "t-west") {
      // Vertical roads (left and right) + horizontal stem pointing left
      // Left vertical
      drawRect(mapData, tileId, leftRoadX, 0, roadWidth, height, width, height);
      // Right vertical
      drawRect(mapData, tileId, rightRoadX, 0, roadWidth, height, width, height);
      // Top horizontal stem (from left to center)
      drawRect(mapData, tileId, 0, topRoadY, leftRoadX, roadWidth, width, height);
      // Bottom horizontal stem (from left to center)
      drawRect(mapData, tileId, 0, bottomRoadY, leftRoadX, roadWidth, width, height);
    } else if (direction === "t-right" || direction === "t-east") {
      // Vertical roads (left and right) + horizontal stem pointing right
      // Left vertical
      drawRect(mapData, tileId, leftRoadX, 0, roadWidth, height, width, height);
      // Right vertical
      drawRect(mapData, tileId, rightRoadX, 0, roadWidth, height, width, height);
      // Top horizontal stem (from center to right)
      drawRect(mapData, tileId, rightRoadX + roadWidth, topRoadY, width - (rightRoadX + roadWidth), roadWidth, width, height);
      // Bottom horizontal stem (from center to right)
      drawRect(mapData, tileId, rightRoadX + roadWidth, bottomRoadY, width - (rightRoadX + roadWidth), roadWidth, width, height);
    }

    // Draw dashed lines with T-junction avoidance
    drawDashedTLines(mapData, dashedLineTileId, direction, width, height, roadWidth);
  }

  /**
   * Draw a dual highway corner road (L-shaped, connects two perpendicular directions)
   * Two road segments in each direction meet at the center
   * Examples: up-right, down-left, etc.
   */
 /**
   * Draw a dual highway corner road (L-shaped, connects two perpendicular directions)
   * Two road segments in each direction meet at the center
   * FIX: Extends outer lanes to fill the corner gap
   */
 function drawCornerRoad(mapData, tileId, direction, width, height, dashedLineTileId) {
  const roadWidth = 7;
  const separation = 3;
  const centerX = Math.floor(width / 2);
  const centerY = Math.floor(height / 2);
  const halfRoad = Math.floor(roadWidth / 2);

  const topRoadY = centerY - halfRoad - roadWidth - separation;
  const bottomRoadY = centerY + halfRoad + separation;
  const leftRoadX = centerX - halfRoad - roadWidth - separation;
  const rightRoadX = centerX + halfRoad + separation;

  // Normalize direction aliases
  let normalizedDir = direction.toLowerCase();
  normalizedDir = normalizedDir.replace("north", "up").replace("south", "down");
  normalizedDir = normalizedDir.replace("east", "right").replace("west", "left");

  if (normalizedDir === "corner-up-right" || normalizedDir === "corner-right-up") {
    // Up and Right (North -> East)
    // Outer Lane: Left Vertical & Bottom Horizontal

    // Left vertical road (Outer): Extend down to the bottom edge of the bottom road
    drawRect(mapData, tileId, leftRoadX, 0, roadWidth, bottomRoadY + roadWidth, width, height);
    // Right vertical road (Inner): Standard length to top road
    drawRect(mapData, tileId, rightRoadX, 0, roadWidth, topRoadY + roadWidth, width, height);
    
    // Top horizontal road (Inner): Standard start from right road
    drawRect(mapData, tileId, rightRoadX, topRoadY, width - rightRoadX, roadWidth, width, height);
    // Bottom horizontal road (Outer): Start from left road (closing the gap)
    drawRect(mapData, tileId, leftRoadX, bottomRoadY, width - leftRoadX, roadWidth, width, height);

  } else if (normalizedDir === "corner-up-left" || normalizedDir === "corner-left-up") {
    // Up and Left (North -> West)
    // Outer Lane: Right Vertical & Bottom Horizontal

    // Left vertical road (Inner): Standard length to top road
    drawRect(mapData, tileId, leftRoadX, 0, roadWidth, topRoadY + roadWidth, width, height);
    // Right vertical road (Outer): Extend down to the bottom edge of the bottom road
    drawRect(mapData, tileId, rightRoadX, 0, roadWidth, bottomRoadY + roadWidth, width, height);

    // Top horizontal road (Inner): Standard end at left road
    drawRect(mapData, tileId, 0, topRoadY, leftRoadX + roadWidth, roadWidth, width, height);
    // Bottom horizontal road (Outer): End at right road (closing the gap)
    drawRect(mapData, tileId, 0, bottomRoadY, rightRoadX + roadWidth, roadWidth, width, height);

  } else if (normalizedDir === "corner-down-right" || normalizedDir === "corner-right-down") {
    // Down and Right (South -> East)
    // Outer Lane: Left Vertical & Top Horizontal

    // Left vertical road (Outer): Start at top edge of top road
    drawRect(mapData, tileId, leftRoadX, topRoadY, roadWidth, height - topRoadY, width, height);
    // Right vertical road (Inner): Standard start at bottom road
    drawRect(mapData, tileId, rightRoadX, bottomRoadY, roadWidth, height - bottomRoadY, width, height);

    // Top horizontal road (Outer): Start from left road (closing the gap)
    drawRect(mapData, tileId, leftRoadX, topRoadY, width - leftRoadX, roadWidth, width, height);
    // Bottom horizontal road (Inner): Standard start from right road
    drawRect(mapData, tileId, rightRoadX, bottomRoadY, width - rightRoadX, roadWidth, width, height);

  } else if (normalizedDir === "corner-down-left" || normalizedDir === "corner-left-down") {
    // Down and Left (South -> West)
    // Outer Lane: Right Vertical & Top Horizontal

    // Left vertical road (Inner): Standard start at bottom road
    drawRect(mapData, tileId, leftRoadX, bottomRoadY, roadWidth, height - bottomRoadY, width, height);
    // Right vertical road (Outer): Start at top edge of top road
    drawRect(mapData, tileId, rightRoadX, topRoadY, roadWidth, height - topRoadY, width, height);

    // Top horizontal road (Outer): End at right road (closing the gap)
    drawRect(mapData, tileId, 0, topRoadY, rightRoadX + roadWidth, roadWidth, width, height);
    // Bottom horizontal road (Inner): Standard end at left road
    drawRect(mapData, tileId, 0, bottomRoadY, leftRoadX + roadWidth, roadWidth, width, height);
  }

  // Draw dashed lines for corner
  drawDashedCornerLines(mapData, dashedLineTileId, normalizedDir, width, height, roadWidth);
}

  /**
   * Generate procedural terrain for a road biome
   * Checks for highway exits to cities before generating normal roads
   * Requires blendBiomeBorders from ProceduralMapBiomeGenerator to be called separately
   */
  function generateRoadBiome(mapData, biome, roadTileId, roadDirection, dashedLineTileId, width = PROC_MAP_WIDTH, height = PROC_MAP_HEIGHT, adjacentBiomes = null) {
    let direction = roadDirection || "horizontal";
    const roadConfig = parseRoadConfig(biome.name);

    // First, draw the regular dual highway
    if (roadConfig) {
      if (roadConfig.isCross) {
        drawCrossRoad(mapData, roadTileId, width, height, dashedLineTileId);
      } else if (roadConfig.isT) {
        drawTRoad(mapData, roadTileId, roadConfig.direction, width, height, dashedLineTileId);
      } else {
        drawLinearRoad(
          mapData,
          roadTileId,
          roadConfig.direction,
          width,
          height,
          dashedLineTileId
        );
      }
    } else {
      if (direction.includes("cross")) {
        drawCrossRoad(mapData, roadTileId, width, height, dashedLineTileId);
      } else if (direction.includes("t-")) {
        drawTRoad(mapData, roadTileId, direction, width, height, dashedLineTileId);
      } else if (direction.includes("corner-")) {
        drawCornerRoad(mapData, roadTileId, direction, width, height, dashedLineTileId);
      } else {
        drawLinearRoad(mapData, roadTileId, direction, width, height, dashedLineTileId);
      }
    }

    // Then, if bordering a city, overlay the highway exit intersection
    const exitDirection = getHighwayExitDirection(adjacentBiomes);
    if (exitDirection) {
      drawHighwayExitIntersection(mapData, roadTileId, exitDirection, width, height, dashedLineTileId);
    }
  }

  // ===== HIGHWAY EXIT SYSTEM =====

  /**
   * Draw a highway exit intersection: overlays a single centered exit road
   * pointing toward the city biome border on top of the dual highway
   * Creates a T-junction where the exit road extends only toward the city border
   * @param {Array} mapData - Map tile data
   * @param {number} tileId - Road tile ID
   * @param {string} exitDirection - Direction to city biome ("north", "south", "east", "west")
   * @param {number} width - Map width
   * @param {number} height - Map height
   * @param {number} dashedLineTileId - Dashed line tile ID for road marking
   */
  function drawHighwayExitIntersection(mapData, tileId, exitDirection, width, height, dashedLineTileId) {
    const roadWidth = 7;
    const separation = 3;
    const centerX = Math.floor(width / 2);
    const centerY = Math.floor(height / 2);
    const halfRoad = Math.floor(roadWidth / 2);

    // Calculate where the dual highway vertical roads are positioned
    const topRoadY = centerY - halfRoad - roadWidth - separation;
    const bottomRoadY = centerY + halfRoad + separation;
    const leftRoadX = centerX - halfRoad - roadWidth - separation;
    const rightRoadX = centerX + halfRoad + separation;

    // Draw a single centered exit road only to the border facing the city
    if (exitDirection === "north") {
      // Single centered road extending north, stop at topRoadY
      for (let y = 0; y < topRoadY; y++) {
        for (let x = centerX - halfRoad; x <= centerX + halfRoad; x++) {
          if (x >= 0 && x < width) {
            const idx = calculateIndex(x, y, 0, width, height);
            mapData[idx] = tileId;
          }
        }
      }
      // Draw dashed center line
      if (dashedLineTileId) {
        const DASH_LENGTH = 3;
        const DASH_GAP = 1;
        const DASH_CYCLE = DASH_LENGTH + DASH_GAP;
        for (let y = 0; y < topRoadY; y++) {
          const cyclePos = y % DASH_CYCLE;
          if (cyclePos < DASH_LENGTH) {
            const idx = calculateIndex(centerX, y, 1, width, height);
            mapData[idx] = dashedLineTileId;
          }
        }
      }
    } else if (exitDirection === "south") {
      // Single centered road extending south, start at bottomRoadY + roadWidth
      for (let y = bottomRoadY + roadWidth; y < height; y++) {
        for (let x = centerX - halfRoad; x <= centerX + halfRoad; x++) {
          if (x >= 0 && x < width) {
            const idx = calculateIndex(x, y, 0, width, height);
            mapData[idx] = tileId;
          }
        }
      }
      // Draw dashed center line
      if (dashedLineTileId) {
        const DASH_LENGTH = 3;
        const DASH_GAP = 1;
        const DASH_CYCLE = DASH_LENGTH + DASH_GAP;
        for (let y = bottomRoadY + roadWidth; y < height; y++) {
          const cyclePos = (y - (bottomRoadY + roadWidth)) % DASH_CYCLE;
          if (cyclePos < DASH_LENGTH) {
            const idx = calculateIndex(centerX, y, 1, width, height);
            mapData[idx] = dashedLineTileId;
          }
        }
      }
    } else if (exitDirection === "east") {
      // Single centered road extending east, start at rightRoadX + roadWidth
      for (let x = rightRoadX + roadWidth; x < width; x++) {
        for (let y = centerY - halfRoad; y <= centerY + halfRoad; y++) {
          if (y >= 0 && y < height) {
            const idx = calculateIndex(x, y, 0, width, height);
            mapData[idx] = tileId;
          }
        }
      }
      // Draw dashed center line
      if (dashedLineTileId) {
        const DASH_LENGTH = 3;
        const DASH_GAP = 1;
        const DASH_CYCLE = DASH_LENGTH + DASH_GAP;
        for (let x = rightRoadX + roadWidth; x < width; x++) {
          const cyclePos = (x - (rightRoadX + roadWidth)) % DASH_CYCLE;
          if (cyclePos < DASH_LENGTH) {
            const idx = calculateIndex(x, centerY, 1, width, height);
            mapData[idx] = dashedLineTileId;
          }
        }
      }
    } else if (exitDirection === "west") {
      // Single centered road extending west, stop at leftRoadX
      for (let x = 0; x < leftRoadX; x++) {
        for (let y = centerY - halfRoad; y <= centerY + halfRoad; y++) {
          if (y >= 0 && y < height) {
            const idx = calculateIndex(x, y, 0, width, height);
            mapData[idx] = tileId;
          }
        }
      }
      // Draw dashed center line
      if (dashedLineTileId) {
        const DASH_LENGTH = 3;
        const DASH_GAP = 1;
        const DASH_CYCLE = DASH_LENGTH + DASH_GAP;
        for (let x = 0; x < leftRoadX; x++) {
          const cyclePos = (leftRoadX - 1 - x) % DASH_CYCLE;
          if (cyclePos < DASH_LENGTH) {
            const idx = calculateIndex(x, centerY, 1, width, height);
            mapData[idx] = dashedLineTileId;
          }
        }
      }
    }
  }

  /**
   * Determine exit direction for road bordering a city or village
   * Returns the direction from road to city/village biome
   * @param {Object} adjacentBiomes - Adjacent biome names
   * @returns {string|null} Exit direction ("north", "south", "east", "west") or null if no city/village borders
   */
  function getHighwayExitDirection(adjacentBiomes) {
    if (!adjacentBiomes) return null;

    if (adjacentBiomes.north && (isCityBiome(adjacentBiomes.north) || isVillageBiome(adjacentBiomes.north))) return "north";
    if (adjacentBiomes.south && (isCityBiome(adjacentBiomes.south) || isVillageBiome(adjacentBiomes.south))) return "south";
    if (adjacentBiomes.east && (isCityBiome(adjacentBiomes.east) || isVillageBiome(adjacentBiomes.east))) return "east";
    if (adjacentBiomes.west && (isCityBiome(adjacentBiomes.west) || isVillageBiome(adjacentBiomes.west))) return "west";

    return null;
  }

  // ===== INTERSECTION TYPE DETECTION =====

  /**
   * Determine road intersection type based on adjacent biomes
   * Returns the appropriate road direction (horizontal, vertical, cross, t-*, corner-*)
   * based on which adjacent biomes are roads
   * Also saves the intersection type to $gameSystem._procGenData for use by other systems
   *
   * @param {Object} adjacentBiomes - Object with north, south, east, west biome names
   * @param {Function} isRoadBiomeFn - Function to check if biome is a road (default: isRoadBiome)
   * @returns {string} Road direction type (horizontal, vertical, cross, t-north, corner-up-right, etc.)
   */
  function determineRoadIntersectionType(adjacentBiomes, isRoadBiomeFn = isRoadBiome) {
    if (!adjacentBiomes) {
      return "horizontal"; // Default fallback
    }

    // Check which directions have adjacent road biomes
    const hasNorth = adjacentBiomes.north && isRoadBiomeFn(adjacentBiomes.north);
    const hasSouth = adjacentBiomes.south && isRoadBiomeFn(adjacentBiomes.south);
    const hasEast = adjacentBiomes.east && isRoadBiomeFn(adjacentBiomes.east);
    const hasWest = adjacentBiomes.west && isRoadBiomeFn(adjacentBiomes.west);

    // Debug logging
    console.log(
      `[Road Intersection] N:${hasNorth} S:${hasSouth} E:${hasEast} W:${hasWest} (N:${adjacentBiomes.north} S:${adjacentBiomes.south} E:${adjacentBiomes.east} W:${adjacentBiomes.west})`
    );

    // Count adjacent roads
    const roadCount = [hasNorth, hasSouth, hasEast, hasWest].filter(Boolean).length;

    let result = "horizontal"; // Default

    // 4-way intersection (cross)
    if (hasNorth && hasSouth && hasEast && hasWest) {
      result = "cross";
    }
    // 3-way intersections (T-junctions)
    // Named by the direction the stem POINTS (opposite of missing direction)
    else if (hasNorth && hasSouth && hasEast && !hasWest) {
      result = "t-east"; // Stem points east (missing west connection)
      console.log(`[Road Intersection] T-junction detected: ${result}`);
    }
    else if (hasNorth && hasSouth && hasWest && !hasEast) {
      result = "t-west"; // Stem points west (missing east connection)
      console.log(`[Road Intersection] T-junction detected: ${result}`);
    }
    else if (hasNorth && hasEast && hasWest && !hasSouth) {
      result = "t-north"; // Stem points north (missing south connection)
      console.log(`[Road Intersection] T-junction detected: ${result}`);
    }
    else if (hasSouth && hasEast && hasWest && !hasNorth) {
      result = "t-south"; // Stem points south (missing north connection)
      console.log(`[Road Intersection] T-junction detected: ${result}`);
    }
    // 2-way intersections (corners)
    else if (hasNorth && hasEast && !hasSouth && !hasWest) {
      result = "corner-up-right"; // North and East
    }
    else if (hasNorth && hasWest && !hasSouth && !hasEast) {
      result = "corner-up-left"; // North and West
    }
    else if (hasSouth && hasEast && !hasNorth && !hasWest) {
      result = "corner-down-right"; // South and East
    }
    else if (hasSouth && hasWest && !hasNorth && !hasEast) {
      result = "corner-down-left"; // South and West
    }
    // Linear roads (only 1 or 2 parallel connections)
    else if ((hasNorth && hasSouth && !hasEast && !hasWest) ||
        (!hasNorth && !hasSouth && hasEast && hasWest)) {
      // Vertical (north-south) or horizontal (east-west)
      // If no east/west roads, use vertical; if no north/south roads, use horizontal
      result = hasNorth || hasSouth ? "vertical" : "horizontal";
    }
    // Single direction (dead-end road facing one direction)
    else if (hasNorth && !hasSouth && !hasEast && !hasWest) {
      result = "vertical"; // Road continues north
    }
    else if (hasSouth && !hasNorth && !hasEast && !hasWest) {
      result = "vertical"; // Road continues south
    }
    else if (hasEast && !hasWest && !hasNorth && !hasSouth) {
      result = "horizontal"; // Road continues east
    }
    else if (hasWest && !hasEast && !hasNorth && !hasSouth) {
      result = "horizontal"; // Road continues west
    }
    else {
      // Default fallback
      console.log(`[Road Intersection] Returning fallback: ${result}`);
    }

    // Save the intersection type to game system for use by RoadCarAI
    if (!$gameSystem._procGenData) {
      $gameSystem._procGenData = {};
    }
    $gameSystem._procGenData.roadIntersectionType = result;
    console.log(`[Road Intersection] Saved intersection type to $gameSystem: ${result}`);

    return result;
  }

  // ===== EXPORT FUNCTIONS =====

  window.ProcGenRoads = {
    isRoadBiome,
    isCityBiome,
    isVillageBiome,
    parseRoadConfig,
    getDashedLineTileId,
    isPositionOnRoadTile,
    drawDashedCenterLine,
    drawDashedCrossLines,
    drawDashedTLines,
    drawDashedCornerLines,
    drawRect,
    drawLinearRoad,
    drawCrossRoad,
    drawTRoad,
    drawCornerRoad,
    drawHighwayExitIntersection,
    getHighwayExitDirection,
    generateRoadBiome,
    determineRoadIntersectionType,
  };
})();

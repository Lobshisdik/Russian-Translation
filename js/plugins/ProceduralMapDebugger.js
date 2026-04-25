/*:
 * @target MZ
 * @plugindesc Debug overlay for Procedural Map Generator - shows tile IDs directly on map
 * @author Omni-Lex (Reworked by OmniLex)
 *
 * @help
 * Procedural Map Debugger - Tile Overlay
 * =======================================
 *
 * When playtesting (F9), this plugin displays the progressive ID of each tile
 * directly as an overlay on the map. The overlay shows the ID from the highest
 * available layer for each tile.
 *
 * WORLD MAP (Map 315):
 * - Shows progressive ID overlay for all visible tiles
 * - IDs are drawn at the top-left of each tile
 * - Only tiles with content are shown
 * - Biomes with specialBiomes variants display the actual assigned biome
 *
 * PROCEDURAL MAP (Map 636):
 * - Shows progressive ID overlay for all visible tiles
 * - Highlights the highest layer for each tile position
 * - Updates in real-time as player moves
 * - Displays current biome (including specialBiomes variants)
 *
 * RESOLUTION SUPPORT:
 * - Automatically adapts to 16:9 and other widescreen resolutions
 * - Font size scales down on wider screens for better tile visibility
 *
 * CONFIGURATION:
 * @param debugMode
 * @text Enable Debug Mode
 * @desc Only show debug info during playtesting
 * @type boolean
 * @default true
 *
 * @param displayOnScreen
 * @text Display On Screen
 * @desc Show debug overlay on game screen
 * @type boolean
 * @default true
 *
 * @param textColor
 * @text Debug Text Color
 * @desc Color for debug text overlay (hex color)
 * @type string
 * @default #00ff00
 *
 * @param fontSize
 * @text Debug Font Size
 * @desc Font size for debug text (smaller = less cluttered)
 * @type number
 * @default 14
 * @min 8
 * @max 24
 *
 * @param outlineColor
 * @text Text Outline Color
 * @desc Color for text outline for readability (hex color)
 * @type string
 * @default #000000
 */

(() => {
  'use strict';

  const pluginName = 'ProceduralMapDebugger';

  // Get parameters
  const params = PluginManager.parameters(pluginName);
  const DEBUG_MODE = params['debugMode'] === 'true';
  const DISPLAY_ON_SCREEN = params['displayOnScreen'] === 'true';
  const TEXT_COLOR = params['textColor'] || '#00ff00';
  const OUTLINE_COLOR = params['outlineColor'] || '#000000';
  const FONT_SIZE = parseInt(params['fontSize'] || 14);

  // Calculate resolution-aware font size
  function getResolutionAwareFontSize() {
    // For 16:9 (wider), use slightly smaller font to fit more tiles
    const aspectRatio = Graphics.boxWidth / Graphics.boxHeight;
    if (aspectRatio > 1.7) {
      // 16:9 resolution - use smaller font
      return Math.max(8, FONT_SIZE - 2);
    }
    return FONT_SIZE;
  }

  // Only active during playtesting
  const IS_PLAYTEST = Utils.isOptionValid('test');
  const ACTIVE = DEBUG_MODE && IS_PLAYTEST;

  const WORLD_MAP_ID = 315;
  const PROC_MAP_ID = 0;
  const DEBUG_MAP_ID = 1410;

  // Get biomes and features from WorldGen
  const { BIOMES, FEATURES, HARDCODED_BIOME_OVERRIDES } = window.WorldGen || { BIOMES: [], FEATURES: [], HARDCODED_BIOME_OVERRIDES: {} };

  /**
   * Get biome object by name
   */
  function getBiomeByName(biomeName) {
    for (const biome of BIOMES) {
      if (biome.name === biomeName) {
        return biome;
      }
    }
    return null;
  }

  /**
   * Create a seeded random number generator
   * Uses same algorithm as ProceduralMapUtils for consistency
   */
  function createSeededRandom(seed) {
    return function () {
      seed = (seed + 0x6d2b79f5) >>> 0;
      let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296.0;
    };
  }

  // ===== ROAD DIRECTION SYMBOLS =====
  const DIRECTION_SYMBOLS = {
    'up': '↑',
    'down': '↓',
    'left': '←',
    'right': '→',
    'vertical': '↕',
    'horizontal': '↔',
    'cross': '✚',
    't-up': '⊤',
    't-down': '⊥',
    't-left': '⊣',
    't-right': '⊢',
    't-north': '⊤',
    't-south': '⊥',
    't-west': '⊣',
    't-east': '⊢',
    'corner-up-right': '⌐',
    'corner-up-left': '┐',
    'corner-down-right': '┌',
    'corner-down-left': '┘',
    'corner-north-east': '⌐',
    'corner-north-west': '┐',
    'corner-south-east': '┌',
    'corner-south-west': '┘',
    'corner-right-up': '⌐',
    'corner-left-up': '┐',
    'corner-right-down': '┌',
    'corner-left-down': '┘'
  };

  // ===== ROAD PARSING FUNCTION =====
  /**
   * Parse road configuration from biome name
   * Supports format: <Road: tileId direction>
   * Examples: <Road: 602 up>, <Road: 602 cross>, <Road: 602 t-up>, <Road: 602 corner-up-right>
   */
  function parseRoadConfig(biomeName) {
    const roadMatch = biomeName.match(/<Road:\s*(\d+)\s+(\w+(?:-\w+)*)>/i);
    if (roadMatch) {
      return {
        tileId: parseInt(roadMatch[1]),
        direction: roadMatch[2].toLowerCase()
      };
    }
    return null;
  }

  /**
   * Get directional symbol for road type
   */
  function getRoadDirectionSymbol(biomeName) {
    const roadConfig = parseRoadConfig(biomeName);
    if (roadConfig) {
      return DIRECTION_SYMBOLS[roadConfig.direction] || '•';
    }
    return '';
  }

  // ===== RIVER PARSING FUNCTION =====
  /**
   * Parse river configuration from biome name
   * Supports format: <River: direction>
   * Examples: <River: horizontal>, <River: cross>, <River: t-up>, <River: corner-up-right>
   */
  function parseRiverConfig(biomeName) {
    const riverMatch = biomeName.match(/<River:\s*(\w+(?:-\w+)*)>/i);
    if (riverMatch) {
      return {
        direction: riverMatch[1].toLowerCase()
      };
    }
    return null;
  }

  /**
   * Get directional symbol for river type
   */
  function getRiverDirectionSymbol(biomeName) {
    const riverConfig = parseRiverConfig(biomeName);
    if (riverConfig) {
      return DIRECTION_SYMBOLS[riverConfig.direction] || '•';
    }
    return '';
  }

  // ===== PERFORMANCE CACHE FOR DEBUG =====
  const DebugCache = {
    tileToFeatureMap: {},
    lastTilesetId: null,

    getTileToFeatureMap(tilesetId) {
      if (!this.tileToFeatureMap[tilesetId]) {
        this.tileToFeatureMap[tilesetId] = createTileToFeatureMap(tilesetId);
      }
      return this.tileToFeatureMap[tilesetId];
    },

    clear() {
      this.tileToFeatureMap = {};
      this.lastTilesetId = null;
    }
  };

  // ===== PROGRESSIVE ID FUNCTIONS =====

  /**
   * Convert tile ID to progressive ID
   * More robust - handles extended tilesets
   */
  function getTileIdToProgressiveId(tileId) {
    // A5 autotiles (1536-1663) - standard RPG Maker MZ autotiles
    if (tileId >= 1536 && tileId <= 1663) {
      // Special case: use index directly to preserve A5 tile numbering
      // Return a special marker: use negative range to distinguish from other sheets
      return -(tileId - 1536 + 1); // -1 to -128
    }
    // B sheet (0-255)
    else if (tileId < 256) {
      return 80 + tileId;
    }
    // C sheet (256-511)
    else if (tileId < 512) {
      return 336 + (tileId - 256);
    }
    // D sheet (512-767)
    else if (tileId < 768) {
      return 592 + (tileId - 512);
    }
    // E sheet (768-1023)
    else if (tileId < 1024) {
      return 848 + (tileId - 768);
    }
    // A-sheet tiles (2048+)
    else if (tileId >= 2048) {
      const offset = tileId - 2048;
      const sectionIndex = Math.floor(offset / 48);
      const indexInSection = offset % 48;

      // Standard A-sheet (A1-A5)
      if (sectionIndex <= 4) {
        const validIndex = Math.floor(indexInSection / 3);
        if (validIndex < 16) {
          return (sectionIndex * 16) + validIndex;
        }
      }

      // Extended A-sheet or custom tilesets
      // Just calculate based on the offset pattern
      const estimatedIndex = Math.floor(indexInSection / 3);
      return (sectionIndex * 16) + estimatedIndex;
    }

    return -1;
  }

  /**
   * Get human-readable sheet/position from progressive ID
   */
  function getProgressiveIdLabel(progressiveId) {
    // A5 autotiles - special negative range (-1 to -128)
    if (progressiveId <= -1 && progressiveId >= -128) {
      const a5Index = Math.abs(progressiveId) - 1;
      return `A5 ${a5Index}`;
    }
    // Standard progressive IDs
    else if (progressiveId >= 0 && progressiveId < 16) {
      return `A1[${progressiveId}]`;
    } else if (progressiveId >= 16 && progressiveId < 32) {
      return `A2[${progressiveId - 16}]`;
    } else if (progressiveId >= 32 && progressiveId < 48) {
      return `A3[${progressiveId - 32}]`;
    } else if (progressiveId >= 48 && progressiveId < 64) {
      return `A4[${progressiveId - 48}]`;
    } else if (progressiveId >= 64 && progressiveId < 80) {
      return `A5[${progressiveId - 64}]`;
    } else if (progressiveId >= 80 && progressiveId < 336) {
      return `B[${progressiveId - 80}]`;
    } else if (progressiveId >= 336 && progressiveId < 592) {
      return `C[${progressiveId - 336}]`;
    } else if (progressiveId >= 592 && progressiveId < 848) {
      return `D[${progressiveId - 592}]`;
    } else if (progressiveId >= 848 && progressiveId < 1104) {
      return `E[${progressiveId - 848}]`;
    }
    return `Invalid(${progressiveId})`;
  }

  /**
   * Get sheet letter and index for tile ID (for debug map 1410)
   * Returns format like "A5 9" or "B6" or "A5 {index}"
   */
  function getTileSheetLabel(tileId) {
    // A5 autotiles (1536-1663)
    if (tileId >= 1536 && tileId <= 1663) {
      const a5Index = tileId - 1536;
      return `A5 ${a5Index}`;
    }
    // A sheet tiles (2048+)
    else if (tileId >= 2048) {
      const offset = tileId - 2048;
      const sectionIndex = Math.floor(offset / 48);
      const indexInSection = offset % 48;
      const validIndex = Math.floor(indexInSection / 3);

      // Standard A-sheet (A1-A5)
      if (sectionIndex <= 4) {
        const sectionName = String.fromCharCode(65 + sectionIndex); // A, B, C, D, E -> convert to letters
        return `A${sectionIndex + 1} ${validIndex}`;
      }
      return `A${sectionIndex + 1} ${validIndex}`;
    }
    // B sheet (0-255)
    else if (tileId < 256) {
      return `B${tileId}`;
    }
    // C sheet (256-511)
    else if (tileId < 512) {
      return `C${tileId - 256}`;
    }
    // D sheet (512-767)
    else if (tileId < 768) {
      return `D${tileId - 512}`;
    }
    // E sheet (768-1023)
    else if (tileId < 1024) {
      return `E${tileId - 768}`;
    }

    return `?${tileId}`;
  }


  /**
   * Get biome name for world tile using biomeIds from BIOMES array
   */
  function getBiomeForWorldTile(worldTileId) {
    const progressiveId = getTileIdToProgressiveId(worldTileId);
    if (progressiveId < 0) {
      return 'Fields';
    }

    // Look through BIOMES to find matching biome by biomeIds
    for (const biome of BIOMES) {
      if (biome.biomeIds && biome.biomeIds.includes(progressiveId)) {
        return biome.name;
      }
    }

    return 'Fields';
  }

  /**
   * Get the actual biome for world coordinates, including specialBiomes variants
   * Uses coordinate-based seeding to match the logic in generateProceduralMap
   */
  function getActualBiomeForWorldCoordinates(worldTileId, worldX, worldY) {
    const baseBiomeName = getBiomeForWorldTile(worldTileId);
    const baseBiome = getBiomeByName(baseBiomeName);

    // Check if biome has specialBiomes and apply 25% chance to override
    if (baseBiome && baseBiome.specialBiomes && baseBiome.specialBiomes.length > 0) {
      // Use same seeding as generateProceduralMap for consistency
      const procGenData = $gameSystem._procGenData || {};
      const seed = procGenData.seed || 0;
      const coordinateSeed = seed + (worldX * 73856093) ^ (worldY * 19349663);
      const rng = createSeededRandom(coordinateSeed);

      // 25% chance to use a special biome variant
      if (rng() < 0.25) {
        const specialBiomeName = baseBiome.specialBiomes[Math.floor(rng() * baseBiome.specialBiomes.length)];
        const specialBiome = getBiomeByName(specialBiomeName);

        if (specialBiome) {
          return specialBiomeName;
        }
      }
    }

    return baseBiomeName;
  }

  /**
   * Get directional symbol for a biome name (if it's a road or river)
   * Ex: 'Road up' -> '↑', 'Road t-left' -> '⊣', 'Road corner-up-right' -> '⌐'
   * Ex: 'River horizontal' -> '↔', 'River vertical' -> '↕', 'River cross' -> '✚'
   */
  function getRoadSymbolForBiome(biomeName) {
    // Check for road
    const roadMatch = biomeName.match(/^Road\s+(\w+(?:-\w+)*)/i);
    if (roadMatch) {
      const direction = roadMatch[1].toLowerCase();
      return DIRECTION_SYMBOLS[direction] || '•';
    }

    // Check for river
    const riverMatch = biomeName.match(/^River\s+(\w+(?:-\w+)*)/i);
    if (riverMatch) {
      const direction = riverMatch[1].toLowerCase();
      return DIRECTION_SYMBOLS[direction] || '•';
    }

    return null;
  }


  /**
   * Create lookup for feature names by tile ID (with caching)
   */
  function createTileToFeatureMap(tilesetId) {
    const tileToFeature = {};
    const tileset = $dataTilesets[tilesetId];

    if (!tileset || !tileset.note) {
      return tileToFeature;
    }

    const noteLines = tileset.note.split('\n');
    for (const line of noteLines) {
      // Parse feature definitions (any sheet): <FeatureName: description>
      // This function just creates a mapping of tile IDs to feature names
      // The actual feature definitions with progressive IDs are handled in ProceduralMapGenerator

      // For now, any tile can be tagged with a feature name
      let featureName, tileId;

      // Try progressive ID format: <FeatureName: 42>
      const progressiveMatch = line.match(/<(\w+):\s*(\d+)>/i);
      if (progressiveMatch) {
        featureName = progressiveMatch[1];
        const progressiveId = parseInt(progressiveMatch[2]);
        // Store both ways for lookup
        tileToFeature[featureName] = progressiveId;
      }
    }

    return tileToFeature;
  }

  /**
   * Get the highest layer tile ID at a position
   * Returns both the tile ID and the layer number
   */
  function getHighestLayerTile(x, y) {
    for (let z = 3; z >= 0; z--) {
      const tileId = $gameMap.tileId(x, y, z);
      if (tileId && tileId !== 0) {
        return { tileId, layer: z };
      }
    }
    return null;
  }

  /**
   * Check if there's a hardcoded biome override at world coordinates
   */
  function getHardcodedBiomeOverrideInfo(worldX, worldY) {
    const key = `${worldX},${worldY}`;
    if (HARDCODED_BIOME_OVERRIDES && HARDCODED_BIOME_OVERRIDES[key]) {
      const override = HARDCODED_BIOME_OVERRIDES[key];
      return {
        biome: override.biome,
        roadDirection: override.roadDirection || null,
        isOverride: true
      };
    }
    return null;
  }

  /**
   * Get biome information for a tile based on map type
   * Includes checking for hardcoded biome overrides on world map
   */
  function getTileBiomeInfo(tileId, mapId, worldX, worldY) {
    if (mapId === WORLD_MAP_ID) {
      // Check for hardcoded biome override first
      const override = getHardcodedBiomeOverrideInfo(worldX, worldY);
      if (override) {
        return {
          biome: override.biome,
          roadDirection: override.roadDirection,
          associated: true,
          isOverride: true
        };
      }

      // World map: get actual biome from tileset notes (including specialBiomes variants)
      const biomeName = getActualBiomeForWorldCoordinates(tileId, worldX, worldY);
      if (biomeName && biomeName !== 'Fields') {
        return {
          biome: biomeName,
          associated: true,
          isOverride: false
        };
      }
      return {
        biome: 'None',
        associated: false,
        isOverride: false
      };
    } else if (mapId === PROC_MAP_ID) {
      // For procedural map, check if origin has a hardcoded override
      const procGenData = $gameSystem._procGenData;
      if (!procGenData) {
        return {
          biome: 'None',
          associated: false,
          isOverride: false
        };
      }

      const override = getHardcodedBiomeOverrideInfo(procGenData.originX, procGenData.originY);
      if (override) {
        return {
          biome: override.biome,
          roadDirection: override.roadDirection,
          associated: true,
          isOverride: true
        };
      }

      const currentBiome = procGenData.currentBiome || 'Unknown';
      const tilesetId = procGenData.currentBiomeTileset;
      const tileToFeature = DebugCache.getTileToFeatureMap(tilesetId);

      // Check if tile is in the feature map (meaning it's associated with this biome)
      if (tileToFeature && tileToFeature[tileId]) {
        return {
          biome: currentBiome,
          associated: true,
          isOverride: false
        };
      }

      return {
        biome: currentBiome,
        associated: false,
        isOverride: false
      };
    }

    return {
      biome: 'None',
      associated: false,
      isOverride: false
    };
  }

  //=============================================================================
  // Sprite_TileDebugOverlay
  //=============================================================================
  // Sprite that draws progressive IDs directly over map tiles using canvas
  //=============================================================================
  class Sprite_TileDebugOverlay extends Sprite {
    constructor() {
      super();
      this._bitmap = null;
      this._canvas = null;
      this._ctx = null;
      this._lastMapId = -1;
      this._lastDrawnX = -999;
      this._lastDrawnY = -999;
      this.z = 8;
    }

    update() {
      super.update();

      if (!ACTIVE || !DISPLAY_ON_SCREEN) {
        this.visible = false;
        return;
      }

      const mapId = $gameMap.mapId();
      const isValidMap = (mapId === WORLD_MAP_ID || mapId === DEBUG_MAP_ID || mapId === PROC_MAP_ID);

      this.visible = isValidMap;

      if (isValidMap) {
        // Recreate bitmap if map changed
        if (!this._bitmap || mapId !== this._lastMapId) {
          this._lastMapId = mapId;
          this.createBitmap();
        }

        // Redraw overlay with current display position
        const displayX = $gameMap.displayX();
        const displayY = $gameMap.displayY();

        this.redrawOverlay(displayX, displayY);
      }
    }

    createBitmap() {
      const tileWidth = $gameMap.tileWidth();
      const tileHeight = $gameMap.tileHeight();

      if (this._bitmap) {
        this._bitmap.destroy();
      }

      // Create bitmap covering the screen
      const width = Graphics.boxWidth;
      const height = Graphics.boxHeight;

      this._bitmap = new Bitmap(width, height);
      this.bitmap = this._bitmap;
      this.setFrame(0, 0, width, height);

      // Get canvas context for direct drawing
      this._canvas = this._bitmap.canvas;
      this._ctx = this._canvas.getContext('2d');
    }

    redrawOverlay(displayX, displayY) {
      if (!this._bitmap || !this._ctx) return;

      // Only redraw if position changed
      const drawnX = Math.floor(displayX * 100);
      const drawnY = Math.floor(displayY * 100);

      if (drawnX === this._lastDrawnX && drawnY === this._lastDrawnY) {
        return;
      }

      this._lastDrawnX = drawnX;
      this._lastDrawnY = drawnY;

      // Clear canvas
      this._ctx.clearRect(0, 0, this._canvas.width, this._canvas.height);

      const tileWidth = $gameMap.tileWidth();
      const tileHeight = $gameMap.tileHeight();

      // Calculate visible tile range
      const startX = Math.floor(displayX);
      const startY = Math.floor(displayY);
      const endX = startX + Math.ceil(Graphics.boxWidth / tileWidth) + 1;
      const endY = startY + Math.ceil(Graphics.boxHeight / tileHeight) + 1;

      const mapWidth = $gameMap.width();
      const mapHeight = $gameMap.height();

      // Setup text rendering with resolution-aware font size
      const fontSize = getResolutionAwareFontSize();
      this._ctx.font = `${fontSize}px GameFont`;
      this._ctx.textAlign = 'left';
      this._ctx.textBaseline = 'top';

      // Draw each visible tile
      const mapId = $gameMap.mapId();
      const isDebugMap = (mapId === DEBUG_MAP_ID|| mapId === PROC_MAP_ID);

      for (let mapX = startX; mapX < endX && mapX < mapWidth; mapX++) {
        for (let mapY = startY; mapY < endY && mapY < mapHeight; mapY++) {
          const tile = getHighestLayerTile(mapX, mapY);

          if (tile && tile.tileId !== 0) {
            const screenX = (mapX - displayX) * tileWidth + 2;
            const screenY = (mapY - displayY) * tileHeight + 2;

            if (isDebugMap) {
              // Debug map 1410: Show sheet labels (A1-A5, B, C, D, E)
              const sheetLabel = getTileSheetLabel(tile.tileId);
              this.drawDebugMapInfo(this._ctx, sheetLabel, screenX, screenY);
            } else {
              // World map: Show progressive ID and biome info
              const progressiveId = getTileIdToProgressiveId(tile.tileId);

              if (progressiveId >= 0) {
                const biomeInfo = getTileBiomeInfo(tile.tileId, mapId, mapX, mapY);

                const idText = `${progressiveId}`;
                const roadSymbol = getRoadSymbolForBiome(biomeInfo.biome);
                const biomeText = !roadSymbol && biomeInfo.biome !== 'None' ? biomeInfo.biome.substring(0, 4) : '';

                this.drawTileDebugInfo(this._ctx, idText, biomeText, roadSymbol, screenX, screenY, biomeInfo.associated, biomeInfo.isOverride, biomeInfo.roadDirection);
              }
            }
          }
        }
      }

      // Mark bitmap as dirty
      this._bitmap._baseTexture.update();
    }

    drawDebugMapInfo(ctx, sheetLabel, x, y) {
      // For debug map 1410: Show sheet labels in cyan/light blue
      const textColor = '#00ffff'; // Cyan for sheet labels
      this.drawTextWithOutline(ctx, sheetLabel, x, y, textColor);
    }

    drawTileDebugInfo(ctx, idText, biomeText, roadSymbol, x, y, isAssociated, isOverride, roadDirection) {
      const fontSize = getResolutionAwareFontSize();
      const lineHeight = fontSize + 2;
      // Yellow if associated, orange/red if override, white if not
      let textColor = '#ffffff';
      if (isOverride) {
        textColor = '#ff8800'; // Orange for overrides
      } else if (isAssociated) {
        textColor = '#ffff00'; // Yellow for associated
      }

      // Draw ID (first line)
      this.drawTextWithOutline(ctx, idText, x, y, textColor);

      // Draw second line: road symbol (if override has road direction), or "OVR", or regular road symbol, or biome abbreviation
      let lineOffset = lineHeight;
      if (isOverride && roadDirection) {
        // Show road direction symbol for override
        const dirSymbol = DIRECTION_SYMBOLS[roadDirection.toLowerCase()] || '•';
        this.drawTextWithOutline(ctx, dirSymbol, x, y + lineOffset, textColor);
      } else if (isOverride) {
        // Show "OVR" for override without road direction
        this.drawTextWithOutline(ctx, 'OVR', x, y + lineOffset, textColor);
      } else if (roadSymbol) {
        this.drawTextWithOutline(ctx, roadSymbol, x, y + lineOffset, textColor);
      } else if (biomeText) {
        this.drawTextWithOutline(ctx, biomeText, x, y + lineOffset, textColor);
      }
    }

    drawTextWithOutline(ctx, text, x, y, color) {
      // Draw outline
      ctx.fillStyle = OUTLINE_COLOR;

      for (let ox = -1; ox <= 1; ox++) {
        for (let oy = -1; oy <= 1; oy++) {
          if (ox === 0 && oy === 0) continue;
          ctx.fillText(text, x + ox, y + oy);
        }
      }

      // Draw main text
      ctx.fillStyle = color;
      ctx.fillText(text, x, y);
    }
  }


//=============================================================================
  // Scene_Map Hooks
  //=============================================================================
  // Inject debug overlay sprite into the map scene
  //=============================================================================
  
  /**
   * Get all child maps of a parent map ID
   */
  function getChildMaps(parentId) {
    const childMaps = [];
    for (const mapInfo of $dataMapInfos) {
      if (mapInfo && mapInfo.parentId === parentId) {
        childMaps.push(mapInfo.id);
      }
    }
    return childMaps;
  }

  /**
   * Log child maps when entering a child of map 1410
   */
  function logPrefabMapsIfNeeded() {
    const currentMapId = $gameMap.mapId();

    // Check if current map is a child of 1410
    const currentMapInfo = $dataMapInfos[currentMapId];
    if (currentMapInfo && currentMapInfo.parentId === 1410) {
      const childMaps = getChildMaps(1410);
      const currentMapChildren = getChildMaps(currentMapId);

      console.log('[Prefabs]');
      console.log(childMaps);
      console.log('[Prefabs] ' + JSON.stringify(childMaps));

      if (currentMapChildren.length > 0) {
        console.log('[Prefabs - Current Map Children]');
        console.log(currentMapChildren);
        console.log('[Prefabs - Current Map Children] ' + JSON.stringify(currentMapChildren));
      }
    }
  }

  /**
   * Hook into Scene_Map to add debug overlay sprite
   */
  const _Scene_Map_createSpriteset = Scene_Map.prototype.createSpriteset;
  Scene_Map.prototype.createSpriteset = function() {
    _Scene_Map_createSpriteset.call(this);

    if (ACTIVE && DISPLAY_ON_SCREEN) {
      this._debugOverlay = new Sprite_TileDebugOverlay();
      this._spriteset.addChild(this._debugOverlay);
    }

    // Log prefab maps when on a child of 1410
    logPrefabMapsIfNeeded();
  };

  /**
   * Hook into scene termination to clean up
   */
  const _Scene_Map_terminate = Scene_Map.prototype.terminate;
  Scene_Map.prototype.terminate = function() {
    _Scene_Map_terminate.call(this);

    // Clear the cache when the map scene ends
    DebugCache.clear();
  };

})();
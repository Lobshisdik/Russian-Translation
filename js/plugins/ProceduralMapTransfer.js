/*:
 * @target MZ
 * @plugindesc Procedural map transfer system: handles map loading, transitions, borders, and up/down navigation
 * @author Omni-Lex
 *
 * @help
 * Procedural Map Transfer System
 * ==============================
 * Handles all map loading, changing, and transfer logic for procedural maps:
 * - Map loading and data initialization
 * - Procedural map entry (startProcGen)
 * - Procedural map exit (stopProcGen)
 * - Underground layer navigation (goDown/goUp)
 * - Border detection and seamless transitions
 * - Visual border indicators (arrows)
 *
 * Requires ProceduralMapUtils.js and ProceduralMapBiomeGenerator.js to be loaded first
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

  const pluginName = "ProceduralMapTransfer";

  // Import utilities from ProceduralMapUtils
  const Utils2 = window.ProcGenUtils;
  if (!Utils2) {
    console.error(
      "ProceduralMapTransfer requires ProceduralMapUtils plugin"
    );
    return;
  }

  const {
    Cache,
    getBiomeByName,
    getAdjacentBiomesOnWorldMap,
    getAdjacentBiomesFromCache,
    checkAdjacentMapBiomesFromCache,
    checkDiagonalMapBiomesFromCache,
    normalizeBiomeForEdge,
    getNonProceduralDestination,
    createSeededRandom,
    getArrowForDirection,
    buildBiomeCoordinateCache,
    getBiomeFromCacheWithFallback,
    logWarn,
    WORLD_MAP_ID,
    PROC_MAP_ID,
    PROC_MAP_WIDTH,
    PROC_MAP_HEIGHT,
    BORDER_DETECTION_RANGE,
  } = Utils2;

  // Import biome generation from ProceduralMapBiomeGenerator
  const generateProceduralTerrain = window.generateProceduralTerrain;
  const shouldDisplayAsBeach = window.shouldDisplayAsBeach;
  const shouldDisplayAsIsland = window.shouldDisplayAsIsland;
  const getHardcodedBiomeOverride = window.getHardcodedBiomeOverride;
  const placeGoDownEvent = window.placeGoDownEvent;
  const placeGoUpEvent = window.placeGoUpEvent;
  const placeChestEvents = window.placeChestEvents;

  if (!generateProceduralTerrain) {
    console.error(
      "ProceduralMapTransfer requires ProceduralMapBiomeGenerator plugin"
    );
    return;
  }

  const { isRoadBiome, determineRoadIntersectionType } = window.ProcGenRoads || {};
  const { isCaveBiome } = window.worldGenHelper || {};

  // ===== HELPER CLASSES & SPRITES =====

  /**
   * Sprite_BorderArrow - Animated directional arrow sprite, styled like RentSystem.js
   */
  class Sprite_BorderArrow extends Sprite {
    constructor(mapX, mapY, arrowChar, color = '#ffff66') {
      super();
      this._mapX = mapX;
      this._mapY = mapY;
      this._color = color;
      this._rotAngle = this._angleFromChar(arrowChar);
      this.createBitmap();
      this.anchor.set(0.5, 0.5);
      this.updatePosition();
    }

    _angleFromChar(ch) {
      const map = {
        '\u2191': 0,                    // ↑ north
        '\u2197': Math.PI / 4,          // ↗ north-east
        '\u2192': Math.PI / 2,          // → east
        '\u2198': 3 * Math.PI / 4,      // ↘ south-east
        '\u2193': Math.PI,              // ↓ south
        '\u2199': -3 * Math.PI / 4,     // ↙ south-west
        '\u2190': -Math.PI / 2,         // ← west
        '\u2196': -Math.PI / 4,         // ↖ north-west
      };
      return map[ch] !== undefined ? map[ch] : 0;
    }

    createBitmap() {
      // Same dimensions and style as the RentSystem room arrow
      const aw = 32, ah = 22;
      const bitmap = new Bitmap(aw, ah);
      const ctx = bitmap.context;
      ctx.fillStyle = this._color;
      ctx.strokeStyle = '#000000';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(aw / 2, 1);       // tip at top center (pointing up = north)
      ctx.lineTo(1,       ah - 1); // bottom-left
      ctx.lineTo(aw - 1,  ah - 1); // bottom-right
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      bitmap._baseTexture.update();
      this.bitmap = bitmap;
    }

    updatePosition() {
      const tileSize = $gameMap.tileWidth();
      const screenX = $gameMap.adjustX(this._mapX) * tileSize + tileSize / 2;
      const screenY = $gameMap.adjustY(this._mapY) * tileSize + tileSize / 2;
      // Same speed and amplitude as RentSystem (tick * 0.12, amplitude 7)
      const bounce = Math.sin(Graphics.frameCount * 0.12) * 7;
      // Shift along the pointing direction
      const bx = Math.sin(this._rotAngle) * bounce;
      const by = -Math.cos(this._rotAngle) * bounce;
      this.x = Math.round(screenX + bx);
      this.y = Math.round(screenY + by);
      this.rotation = this._rotAngle;
    }

    update() {
      super.update();
      this.updatePosition();
    }
  }

  // Expose shared class so WorldMapReturn.js (and other plugins) can reuse it
  window.Sprite_BorderArrow = Sprite_BorderArrow;

  // ===== HELPER FUNCTIONS =====

  /**
   * Update BGS based on current biome and time of day
   */
  function updateBiomeBGS() {
    const procGenData = $gameSystem._procGenData;
    if (!procGenData || !procGenData.currentBiome) return;

    // Check for virtual biomes first (Beach, Island)
    let biomeName = procGenData.currentBiome;
    if (procGenData.displayAsIsland) {
      biomeName = "Island";
    } else if (procGenData.displayAsBeach) {
      biomeName = "Beach";
    }

    const biome = getBiomeByName(biomeName);
    if (!biome) {
      AudioManager.stopBgs();
      return;
    }

    // Determine if it's nighttime (from Variable 113 - date/time string)
    const dateStr = $gameVariables.value(113) || "01 JAN 2001 12:00";
    const parts = dateStr.split(" ");
    const timeParts = parts[3] ? parts[3].split(":") : ["12", "00"];
    const currentHour = parseInt(timeParts[0]) || 12;

    // Night is from 20:00 to 6:00
    const isNightTime = currentHour >= 20 || currentHour < 6;

    // Choose appropriate BGS array based on time of day
    let bgsArray = isNightTime && biome.bgsNight ? biome.bgsNight : biome.bgs;

    if (bgsArray && bgsArray.length > 0) {
      const seed = procGenData.seed || 0;
      const originX = procGenData.originX || 0;
      const originY = procGenData.originY || 0;
      const rng = createSeededRandom(seed + originX * 7 + originY * 13);
      const bgsName = bgsArray[Math.floor(rng() * bgsArray.length)];
      AudioManager.playBgs({ name: bgsName, volume: 80, pitch: 100, pan: 0 });
      console.log(`[updateBiomeBGS] Playing BGS: ${bgsName} for biome: ${biomeName} (base: ${procGenData.currentBiome}, isNight: ${isNightTime})`);
    } else {
      AudioManager.stopBgs();
      console.log(`[updateBiomeBGS] No BGS defined for biome: ${biomeName}`);
    }
  }

  /**
   * Update visibility of GoDown/GoUp events and chests based on layer depth
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
      // Handle Chests (Hide Overground, Show Underground, Hide in Seabed)
      else if (chestNames.includes(eventName)) {
        const shouldShow = isUnderground && currentBiome !== "Seabed";
        event.setOpacity(shouldShow ? 255 : 0);
        // Also move off map if in Seabed
        if (currentBiome === "Seabed" && (event.x !== 0 || event.y !== 0)) {
          event.setPosition(0, 0);
        }
      }
    }
  }

  /**
   * Refresh enemies on the current procedural map based on biome
   * Re-spawns enemies matching the current biome without erasing events
   * This preserves event touch/collision properties
   */
  function refreshEnemiesForBiome() {
    if ($gameMap.mapId() !== PROC_MAP_ID) {
      console.log(`[refreshEnemiesForBiome] Not on procedural map (${$gameMap.mapId()}), skipping`);
      return;
    }

    const procGenData = $gameSystem._procGenData;
    if (!procGenData || !procGenData.currentBiome) {
      console.warn(`[refreshEnemiesForBiome] No current biome found`);
      return;
    }

    console.log(`[refreshEnemiesForBiome] Refreshing enemies for biome: ${procGenData.currentBiome}`);

    // Find all existing Enemy events
    const enemyEvents = $gameMap.events().filter(ev => {
      const eventData = ev.event();
      return eventData && eventData.name === "Enemy";
    });

    console.log(`[refreshEnemiesForBiome] Found ${enemyEvents.length} existing enemy events`);

    // Clear their troop assignments
    for (const ev of enemyEvents) {
      ev._fixedTroopId = 0;
      ev._isAquaticEnemy = undefined;
      ev.setOpacity(0);  // Hide temporarily
      ev.setThrough(true);  // Make passable temporarily
    }

    // Call the battle system's spawn function to create new enemies for this biome
    if (SceneManager._scene && SceneManager._scene.spawnEnemiesFromEncounters) {
      console.log(`[refreshEnemiesForBiome] Re-spawning enemies for current biome`);
      SceneManager._scene.spawnEnemiesFromEncounters();
    } else {
      console.warn(`[refreshEnemiesForBiome] Could not find spawnEnemiesFromEncounters method`);
    }
  }

  // NOTE: placeGoDownEvent is imported from ProceduralMapBiomeGenerator.js

  // ===== GAME SYSTEM METHODS =====

  /**
   * Get the origin coordinates to return player to on map 315
   */
  Game_System.prototype.getReturnCoordinates = function (exitDirection) {
    return { x: this._procGenData.originX, y: this._procGenData.originY };
  };

  /**
   * Calculate adjacent world tile coordinates based on exit direction
   */
  Game_System.prototype.getAdjacentWorldCoordinates = function (exitDirection) {
    const VAR_WORLD_X = 43;
    const VAR_WORLD_Y = 44;

    let newX = $gameVariables.value(VAR_WORLD_X);
    let newY = $gameVariables.value(VAR_WORLD_Y);

    switch (exitDirection) {
      case 2:
        newY += 1;
        break;
      case 4:
        newX -= 1;
        break;
      case 6:
        newX += 1;
        break;
      case 8:
        newY -= 1;
        break;
    }

    return { x: newX, y: newY };
  };

  /**
   * Calculate opposite edge position for seamless transition
   */
  Game_System.prototype.getEdgeCoordinateForDirection = function (
    exitDirection,
    playerX,
    playerY
  ) {
    const mapWidth = PROC_MAP_WIDTH;
    const mapHeight = PROC_MAP_HEIGHT;

    let x = playerX !== undefined ? playerX : Math.floor(mapWidth / 2);
    let y = playerY !== undefined ? playerY : Math.floor(mapHeight / 2);

    switch (exitDirection) {
      case 2:
        y = 1;
        break;
      case 4:
        x = mapWidth - 2;
        break;
      case 6:
        x = 1;
        break;
      case 8:
        y = mapHeight - 2;
        break;
      default:
        x = Math.floor(mapWidth / 2);
        y = Math.floor(mapHeight / 2);
    }

    x = Math.max(1, Math.min(x, mapWidth - 2));
    y = Math.max(1, Math.min(y, mapHeight - 2));

    return { x, y };
  };

  /**
   * Clear procedural map data
   */
  Game_System.prototype.clearProcGenData = function () {
    this._procGenData.generatedMapData = null;
    this._procGenData.currentBiome = null;
    this._procGenData.currentRoadDirection = null;
    this._procGenData.lastLoadedProcMapX = null;
    this._procGenData.lastLoadedProcMapY = null;
    Cache.clear();
    $gameVariables.setValue(110, 0);
    $gameVariables.setValue(111, 0);
  };

  // ===== DATA MANAGER OVERRIDES =====

  /**
   * Override map data loading for procedural map
   */
  const _DataManager_loadMapData = DataManager.loadMapData;
  DataManager.loadMapData = function (mapId) {
    if (
      mapId === PROC_MAP_ID &&
      $gameSystem &&
      $gameSystem._procGenData &&
      $gameSystem._procGenData.generatedMapData
    ) {
      const VAR_WORLD_X = 43;
      const VAR_WORLD_Y = 44;
      const currentWorldX = $gameVariables.value(VAR_WORLD_X);
      const currentWorldY = $gameVariables.value(VAR_WORLD_Y);

      // Only update map data if coordinates have changed
      if (
        $gameSystem._procGenData.lastLoadedProcMapX !== currentWorldX ||
        $gameSystem._procGenData.lastLoadedProcMapY !== currentWorldY
      ) {
        _DataManager_loadMapData.call(this, mapId);

        if ($dataMap) {
          $dataMap.data = $gameSystem._procGenData.generatedMapData;
          $dataMap.width = PROC_MAP_WIDTH;
          $dataMap.height = PROC_MAP_HEIGHT;
          $dataMap.tilesetId = $gameSystem._procGenData.currentBiomeTileset;
          // Display as Island (virtual biome) or Beach if applicable
          let displayName = $gameSystem._procGenData.currentBiome;
          if ($gameSystem._procGenData.displayAsIsland) {
            displayName = "Island";
          } else if ($gameSystem._procGenData.displayAsBeach) {
            displayName = "Beach";
          }
          $dataMap.displayName = displayName;
        }

        // Track that we've loaded for these coordinates
        $gameSystem._procGenData.lastLoadedProcMapX = currentWorldX;
        $gameSystem._procGenData.lastLoadedProcMapY = currentWorldY;
      }

      return;
    }

    _DataManager_loadMapData.call(this, mapId);
  };

  // ===== GAME MAP OVERRIDES =====

  /**
   * Override Game_Map.initialize to clear events for procedural maps
   */
  const _Game_Map_initialize = Game_Map.prototype.initialize;
  Game_Map.prototype.initialize = function () {
    _Game_Map_initialize.call(this);
  };

  /**
   * Override Game_Map.setup to clear events for procedural maps
   */
  const _Game_Map_setup = Game_Map.prototype.setup;
  Game_Map.prototype.setup = function (mapId) {
    _Game_Map_setup.call(this, mapId);
  };

  /**
   * Override Game_Map.tileset to return correct tileset for procedural maps
   */
  const _Game_Map_tileset = Game_Map.prototype.tileset;
  Game_Map.prototype.tileset = function () {
    // For procedural maps, get tileset from current biome
    if ($gameMap.mapId() === PROC_MAP_ID && $gameSystem._procGenData) {
      const procGenData = $gameSystem._procGenData;
      const biomeObj = getBiomeByName(procGenData.currentBiome);
      if (biomeObj && biomeObj.tilesetId) {
        const tilesetData = $dataTilesets[biomeObj.tilesetId];
        if (tilesetData) {
          return tilesetData;
        }
      }
    }
    // Fall back to default behavior
    return _Game_Map_tileset.call(this);
  };

  /**
   * Get nearby border tiles for procedural map
   */
  Game_Map.prototype.getProcGenBorderTiles = function (playerX, playerY) {
    const nearbyBorders = [];
    const width = this.width();
    const height = this.height();

    // Check if current biome is a cave biome
    const system = $gameSystem;
    const procGenData = system._procGenData;
    const currentBiome = procGenData.currentBiome || "";
    const caveBiomes = ["Cave", "CaveFlooded", "CaveIce", "Crypt", "Dungeon", "Underdark"];
    const isCaveBiomeFn = caveBiomes.some(name => currentBiome.toLowerCase().includes(name.toLowerCase()));

    for (let dx = -BORDER_DETECTION_RANGE; dx <= BORDER_DETECTION_RANGE; dx++) {
      for (
        let dy = -BORDER_DETECTION_RANGE;
        dy <= BORDER_DETECTION_RANGE;
        dy++
      ) {
        if (dx === 0 && dy === 0) continue;

        const x = playerX + dx;
        const y = playerY + dy;

        if (x < 0 || y < 0 || x >= width || y >= height) continue;

        if (x === 0 || y === 0 || x === width - 1 || y === height - 1) {
          // Skip tiles the player cannot actually reach (wall tiles, etc.)
          let passable = false;
          if (x === 0 && $gameMap.isValid(1, y))
            passable = passable || $gameMap.isPassable(1, y, 4);
          if (x === width - 1 && $gameMap.isValid(width - 2, y))
            passable = passable || $gameMap.isPassable(width - 2, y, 6);
          if (y === 0 && $gameMap.isValid(x, 1))
            passable = passable || $gameMap.isPassable(x, 1, 8);
          if (y === height - 1 && $gameMap.isValid(x, height - 2))
            passable = passable || $gameMap.isPassable(x, height - 2, 2);
          if (!passable) continue;
          if (this.terrainTag(x, y) === 4 || this.terrainTag(x, y) === 7) continue;
          // Check if the border tile itself is passable (not a wall)
          if (!this.isPassable(x, y, 2) && !this.isPassable(x, y, 4) && 
              !this.isPassable(x, y, 6) && !this.isPassable(x, y, 8)) continue;

          const directions = [];

          // Show arrows on all borders
          if (x === 0) directions.push("west");
          if (x === width - 1) directions.push("east");
          if (y === 0) directions.push("north");
          if (y === height - 1) directions.push("south");

          // Only add border if it has at least one direction (cave biomes may have none)
          if (directions.length > 0) {
            let ax = x, ay = y;
            if (x === 0) ax = 1;
            else if (x === width - 1) ax = width - 2;
            if (y === 0) ay = 1;
            else if (y === height - 1) ay = height - 2;

            // Never draw arrows directly over any Transfer event
            const hasTransferAtTarget = this.eventsXy(ax, ay).some(ev => {
              const evData = $dataMap.events[ev._eventId];
              return evData && evData.name && evData.name.includes("Transfer");
            });
            if (hasTransferAtTarget) continue;

            // Never draw arrows on unpassable tiles or if their terrain tag is 4 or 7
            if (this.terrainTag(ax, ay) === 4 || this.terrainTag(ax, ay) === 7) continue;
            if (!this.isPassable(ax, ay, 2) && !this.isPassable(ax, ay, 4) && 
                !this.isPassable(ax, ay, 6) && !this.isPassable(ax, ay, 8)) continue;

            const arrow = getArrowForDirection(directions);
            nearbyBorders.push({ x: ax, y: ay, directions, arrow });
          }
        }
      }
    }

    return nearbyBorders;
  };

  // ===== GAME PLAYER BORDER VISUALIZATION =====

  let procGenBorderArrows = [];

  /**
   * Display border arrows on procedural map edges
   */
  Game_Player.prototype.displayProcGenBorderArrows = function (borderTiles) {
    this.clearProcGenBorderArrows();

    for (const border of borderTiles) {
      const sprite = new Sprite_BorderArrow(border.x, border.y, border.arrow, '#66ff66');
      SceneManager._scene._spriteset.addChild(sprite);
      procGenBorderArrows.push(sprite);
    }
  };

  /**
   * Clear all procedural map border arrows
   */
  Game_Player.prototype.clearProcGenBorderArrows = function () {
    for (const sprite of procGenBorderArrows) {
      if (sprite && sprite.parent) {
        sprite.parent.removeChild(sprite);
      }
    }
    procGenBorderArrows = [];
  };

  /**
   * Update procedural map border arrows
   */
  Game_Player.prototype.updateProcGenBorderArrows = function () {
    if ($gameMap.mapId() !== PROC_MAP_ID) {
      this.clearProcGenBorderArrows();
      return;
    }

    const nearbyBorders = $gameMap.getProcGenBorderTiles(this.x, this.y);
    this.displayProcGenBorderArrows(nearbyBorders);
  };

  // ===== TELEPORT EVENT ARROWS =====

  let teleportEventArrows = [];

  Game_Player.prototype.updateTeleportEventArrows = function() {
    this.clearTeleportEventArrows();

    if ($gameMap.mapId() === WORLD_MAP_ID) return;
    if (!(SceneManager._scene instanceof Scene_Map)) return;

    const px = this.x;
    const py = this.y;

    for (const event of $gameMap.events()) {
      if (!event || !$dataMap.events[event._eventId]) continue;
      const name = $dataMap.events[event._eventId].name || "";
      if (!name.includes("Transfer")) continue;

      const ex = event.x;
      const ey = event.y;
      const dx = Math.abs(px - ex);
      const dy = Math.abs(py - ey);
      if (dx > 2 || dy > 2) continue;
      if (dx === 0 && dy === 0) continue;

      const mapWidth = $gameMap.width();
      const mapHeight = $gameMap.height();

      const onWestEdge  = ex === 0;
      const onEastEdge  = ex === mapWidth - 1;
      const onNorthEdge = ey === 0;
      const onSouthEdge = ey === mapHeight - 1;
      const isOnEdge = onWestEdge || onEastEdge || onNorthEdge || onSouthEdge;

      let ax, ay, char;
      if (isOnEdge) {
        // Draw arrow one tile inward from the edge to avoid overlapping the Transfer event
        if (onWestEdge)       { ax = ex + 1; ay = ey; char = "\u2190"; } // ←
        else if (onEastEdge)  { ax = ex - 1; ay = ey; char = "\u2192"; } // →
        else if (onNorthEdge) { ax = ex; ay = ey + 1; char = "\u2191"; } // ↑
        else                  { ax = ex; ay = ey - 1; char = "\u2193"; } // ↓
      } else {
        const dx = px - ex;
        const dy = py - ey;
        if (Math.abs(dx) >= Math.abs(dy)) {
          ax = ex + (dx > 0 ? 1 : -1);
          ay = ey;
          char = dx > 0 ? "\u2190" : "\u2192"; // ← or →
        } else {
          ax = ex;
          ay = ey + (dy > 0 ? 1 : -1);
          char = dy > 0 ? "\u2191" : "\u2193"; // ↑ or ↓
        }

        if (!$gameMap.isValid(ax, ay)) continue;
        // Skip if the arrow tile is blocked (player can't walk there)
        const passDir = Math.abs(dx) >= Math.abs(dy)
          ? (dx > 0 ? 6 : 4)
          : (dy > 0 ? 2 : 8);
        if (!$gameMap.isPassable(ex, ey, passDir)) continue;
      }

      // Safeguard: Never draw arrows directly over any Transfer event
      const hasTransferAtTarget = $gameMap.eventsXy(ax, ay).some(ev => {
          const evData = $dataMap.events[ev._eventId];
          return evData && evData.name && evData.name.includes("Transfer");
      });
      if (hasTransferAtTarget) continue;

      // Never draw arrows on unpassable tiles or if their terrain tag is 4 or 7
      if ($gameMap.terrainTag(ax, ay) === 4 || $gameMap.terrainTag(ax, ay) === 7) continue;
      if (!$gameMap.isPassable(ax, ay, 2) && !$gameMap.isPassable(ax, ay, 4) && 
          !$gameMap.isPassable(ax, ay, 6) && !$gameMap.isPassable(ax, ay, 8)) continue;

      const sprite = new Sprite_BorderArrow(ax, ay, char);
      SceneManager._scene._spriteset.addChild(sprite);
      teleportEventArrows.push(sprite);
    }
  };

  Game_Player.prototype.clearTeleportEventArrows = function() {
    for (const sprite of teleportEventArrows) {
      if (sprite && sprite.parent) sprite.parent.removeChild(sprite);
    }
    teleportEventArrows = [];
  };

  // ===== GAME PLAYER OVERRIDES =====

  /**
   * Override player update to show border arrows on procedural map
   */
  const _Game_Player_update_orig = Game_Player.prototype.update;
  Game_Player.prototype.update = function (sceneActive) {
    _Game_Player_update_orig.call(this, sceneActive);

    if (SceneManager._scene instanceof Scene_Map) {
      if ($gameMap.mapId() === PROC_MAP_ID) {
        this.updateProcGenBorderArrows();
      }
      this.updateTeleportEventArrows();
    }
  };

  /**
   * Override performTransfer to set procedural map data and clear when leaving
   */
  const _Game_Player_performTransfer = Game_Player.prototype.performTransfer;
  Game_Player.prototype.performTransfer = function () {
    const currentMapId = $gameMap.mapId();
    const newMapId = this._newMapId;

    // Clear procedural data when leaving procedural map
    if (currentMapId === PROC_MAP_ID && newMapId !== PROC_MAP_ID) {
      if ($gameSystem._procGenData) {
        $gameSystem.clearProcGenData();
      }
    }

    if (
      this._transferring &&
      newMapId === PROC_MAP_ID &&
      $gameSystem._procGenData &&
      $gameSystem._procGenData.generatedMapData
    ) {
      if (!$dataMap || !$dataMap.data) {
        DataManager.loadMapData(PROC_MAP_ID);
      }

      if ($dataMap) {
        $dataMap.data = $gameSystem._procGenData.generatedMapData;
        $dataMap.width = PROC_MAP_WIDTH;
        $dataMap.height = PROC_MAP_HEIGHT;
        $dataMap.tilesetId = $gameSystem._procGenData.currentBiomeTileset;
        // Display as Island (virtual biome) or Beach if applicable
        let displayName = $gameSystem._procGenData.currentBiome;
        if ($gameSystem._procGenData.displayAsIsland) {
          displayName = "Island";
        } else if ($gameSystem._procGenData.displayAsBeach) {
          displayName = "Beach";
        }
        $dataMap.displayName = displayName;
      }
    }

    _Game_Player_performTransfer.call(this);
  };

  /**
   * Override player movement to detect map edges on procedural map
   */
  const _Game_Player_moveStraight = Game_Player.prototype.moveStraight;
  Game_Player.prototype.moveStraight = function (d) {
    if ($gameMap.mapId() !== PROC_MAP_ID) {
      _Game_Player_moveStraight.call(this, d);
      return;
    }

    const x = this.x;
    const y = this.y;
    const mapWidth = $gameMap.width();
    const mapHeight = $gameMap.height();

    let wouldLeaveMap = false;
    let exitDirection = 0;

    switch (d) {
      case 2:
        if (y + 1 >= mapHeight) {
          wouldLeaveMap = true;
          exitDirection = 2;
        }
        break;
      case 4:
        if (x - 1 < 0) {
          wouldLeaveMap = true;
          exitDirection = 4;
        }
        break;
      case 6:
        if (x + 1 >= mapWidth) {
          wouldLeaveMap = true;
          exitDirection = 6;
        }
        break;
      case 8:
        if (y - 1 < 0) {
          wouldLeaveMap = true;
          exitDirection = 8;
        }
        break;
    }

    if (wouldLeaveMap) {
      const system = $gameSystem;
      const VAR_WORLD_X = 43;
      const VAR_WORLD_Y = 44;

      // Start fade immediately to hide lag during terrain generation
      console.log(`[ProceduralMapTransfer-Edge] Border touched, starting fade out`);
      $gameScreen.startFadeOut(10); // 10 frame fade

      // Store variables for use in deferred computation
      const storedExitDirection = exitDirection;
      const storedPlayerX = x;
      const storedPlayerY = y;

      // Schedule heavy computation after fade is fully complete
      // We need to defer until after the fade duration in game frames, not milliseconds
      system._procGenData._edgeTransitionScheduled = true;
      system._procGenData._edgeTransitionCallback = () => {
        if (!system._procGenData._edgeTransitionScheduled) return;
        system._procGenData._edgeTransitionScheduled = false;

        console.log(`[ProceduralMapTransfer-Edge] Fade complete, starting heavy computation`);

        const currentWorldX = $gameVariables.value(VAR_WORLD_X);
        const currentWorldY = $gameVariables.value(VAR_WORLD_Y);

        console.log(`[ProceduralMapTransfer-Edge] Player exiting map edge. Current world coords: (${currentWorldX}, ${currentWorldY}), Exit direction: ${storedExitDirection}`);

        const nonProcCheck = getNonProceduralDestination(
          currentWorldX,
          currentWorldY,
          exitDirection
        );

        if (nonProcCheck.exists && nonProcCheck.destination) {
          const dest = nonProcCheck.destination;
          console.log(`[ProceduralMapTransfer-Edge] Non-procedural destination found at current coords: Map ${dest.mapId} (${dest.x}, ${dest.y})`);
          $gamePlayer.clearProcGenBorderArrows();
          system.clearProcGenData();
          $gamePlayer.reserveTransfer(dest.mapId, dest.x, dest.y, d, 0);
          return;
        }

        const adjacentCoords = system.getAdjacentWorldCoordinates(storedExitDirection);
        console.log(`[ProceduralMapTransfer-Edge] Adjacent world coords: (${adjacentCoords.x}, ${adjacentCoords.y})`);

        const nonProcCheckAdjacent = getNonProceduralDestination(
          adjacentCoords.x,
          adjacentCoords.y,
          storedExitDirection
        );

        if (nonProcCheckAdjacent.exists && nonProcCheckAdjacent.destination) {
          const dest = nonProcCheckAdjacent.destination;
          console.log(`[ProceduralMapTransfer-Edge] Non-procedural destination found at adjacent coords: Map ${dest.mapId} (${dest.x}, ${dest.y})`);
          $gamePlayer.clearProcGenBorderArrows();
          system.clearProcGenData();
          $gamePlayer.reserveTransfer(dest.mapId, dest.x, dest.y, d, 0);
          return;
        }

        let roadDirection = null;
        let biomeName = "Fields";

      // Check for hardcoded overrides at adjacent coordinates first
      const hardcodedAdjacentOverride = window.getHardcodedBiomeOverride ?
        window.getHardcodedBiomeOverride(adjacentCoords.x, adjacentCoords.y) : null;

      if (hardcodedAdjacentOverride) {
        // Use hardcoded biome and optional road direction
        biomeName = hardcodedAdjacentOverride.biome;
        roadDirection = hardcodedAdjacentOverride.roadDirection || null;
        console.log(`[ProceduralMapTransfer-Edge] Hardcoded override found: biome="${biomeName}", roadDirection="${roadDirection}"`);
      } else {
        // Use the pre-built cache from world map scan
        let worldTileBiome = null;

        if (system._procGenData.biomeCoordinateCache &&
            Object.keys(system._procGenData.biomeCoordinateCache).length > 0) {
          // Search cache for the coordinate
          for (const [biomeName, coordinates] of Object.entries(system._procGenData.biomeCoordinateCache)) {
            if (coordinates.some((coord) => coord.x === adjacentCoords.x && coord.y === adjacentCoords.y)) {
              worldTileBiome = biomeName;
              console.log(`[ProceduralMapTransfer-Edge] Found in cache: "${biomeName}"`);
              break;
            }
          }

          if (!worldTileBiome) {
            console.log(`[ProceduralMapTransfer-Edge] WARNING: Coordinate (${adjacentCoords.x}, ${adjacentCoords.y}) NOT found in cache!`);
          }
        } else {
          console.log(`[ProceduralMapTransfer-Edge] ERROR: Cache is empty!`);
        }

        // Fallback - should not happen if cache was built properly
        if (!worldTileBiome) {
          worldTileBiome = "Fields";
          console.warn(`[ProceduralMapTransfer-Edge] Defaulting to Fields for (${adjacentCoords.x}, ${adjacentCoords.y})`);
        }

        console.log(`[ProceduralMapTransfer-Edge] Final lookup result: "${worldTileBiome}"`);

        let lookupBiomeName = worldTileBiome;

        // Check if the biome is a road variant
        if (worldTileBiome && worldTileBiome.startsWith("Road ")) {
          roadDirection = worldTileBiome.substring(5).toLowerCase();
          lookupBiomeName = "Road";
          console.log(`[ProceduduralMapTransfer-Edge] Road detected: direction="${roadDirection}"`);
        }

        biomeName = lookupBiomeName;
      }

      if (!biomeName) {
        biomeName = "Fields";
      }

      console.log(`[ProceduralMapTransfer-Edge] Resolved biome name: "${biomeName}"`);

      let biome = getBiomeByName(biomeName);

        if (!biome) {
          console.error(`[ProceduralMapTransfer-Edge] ERROR: Biome "${biomeName}" not found in biome definitions`);
          const returnCoords = system.getReturnCoordinates(storedExitDirection);
          $gamePlayer.clearProcGenBorderArrows();
          system.clearProcGenData();
          $gamePlayer.reserveTransfer(
            WORLD_MAP_ID,
            returnCoords.x,
            returnCoords.y,
            storedExitDirection,
            0
          );
          return;
        }

        // If player is in an underground layer, use the adjacent biome's lower layer instead
        if (system._procGenData.biomeLayerStack && system._procGenData.biomeLayerStack.length > 0) {
          if (biome.lowerLayer) {
            biomeName = biome.lowerLayer;
            biome = getBiomeByName(biomeName);
            if (!biome) {
              const returnCoords = system.getReturnCoordinates(storedExitDirection);
              $gamePlayer.clearProcGenBorderArrows();
              system.clearProcGenData();
              $gamePlayer.reserveTransfer(
                WORLD_MAP_ID,
                returnCoords.x,
                returnCoords.y,
                storedExitDirection,
                0
              );
              return;
            }
          }
        }

      system._procGenData.currentBiome = biomeName;

      $gameVariables.setValue(VAR_WORLD_X, adjacentCoords.x);
      $gameVariables.setValue(VAR_WORLD_Y, adjacentCoords.y);
      system._procGenData.originX = adjacentCoords.x;
      system._procGenData.originY = adjacentCoords.y;

      const tilesetId = biome.tilesetId;
      system._procGenData.currentBiomeTileset = tilesetId;

      // Store biome temperature data for weather system
      system._procGenData.biomeDayTemperature = biome.dayTemperature || 20;
      system._procGenData.biomeNightTemperature = biome.nightTemperature || 10;

      const seed =
        system._procGenData.seed + adjacentCoords.x + adjacentCoords.y;

      let adjacentBiomesForNewTile = getAdjacentBiomesOnWorldMap(
        adjacentCoords.x,
        adjacentCoords.y
      );

      console.log(`[ProceduralMapTransfer-Edge] Initial adjacent biomes from world map:`, adjacentBiomesForNewTile);

      // Override with cache results to get actual biome assignments (roads placed on fields, etc.)
      if (
        system._procGenData.biomeCoordinateCache &&
        Object.keys(system._procGenData.biomeCoordinateCache).length > 0
      ) {
        const cacheBiomes = getAdjacentBiomesFromCache(
          adjacentCoords.x,
          adjacentCoords.y,
          system._procGenData.biomeCoordinateCache
        );
        console.log(`[ProceduralMapTransfer-Edge] Cache biomes found:`, cacheBiomes);
        // Use cache values if they exist (they're more accurate for overridden biomes)
        adjacentBiomesForNewTile.north =
          cacheBiomes.north || adjacentBiomesForNewTile.north;
        adjacentBiomesForNewTile.south =
          cacheBiomes.south || adjacentBiomesForNewTile.south;
        adjacentBiomesForNewTile.east =
          cacheBiomes.east || adjacentBiomesForNewTile.east;
        adjacentBiomesForNewTile.west =
          cacheBiomes.west || adjacentBiomesForNewTile.west;
        console.log(`[ProceduralMapTransfer-Edge] Adjacent biomes after cache override:`, adjacentBiomesForNewTile);
      }

      adjacentBiomesForNewTile = {
        north: normalizeBiomeForEdge(adjacentBiomesForNewTile.north),
        south: normalizeBiomeForEdge(adjacentBiomesForNewTile.south),
        east: normalizeBiomeForEdge(adjacentBiomesForNewTile.east),
        west: normalizeBiomeForEdge(adjacentBiomesForNewTile.west),
      };

      console.log(`[ProceduralMapTransfer-Edge] Adjacent biomes after normalization:`, adjacentBiomesForNewTile);

      // Auto-determine road intersection type from adjacent biomes
      // This takes priority over hardcoded directions to ensure proper intersections
      if (isRoadBiome(biomeName)) {
        const autoDetectedDirection = determineRoadIntersectionType(adjacentBiomesForNewTile, isRoadBiome);
        console.log(`[ProceduralMapTransfer-Transition] Auto-detected road direction: ${autoDetectedDirection}`);
        // Always use auto-detected direction for roads to ensure proper intersections
        roadDirection = autoDetectedDirection;
      } else if (roadDirection) {
        console.log(`[ProceduralMapTransfer-Transition] Using hardcoded road direction (non-road biome): ${roadDirection}`);
      }
      // Fallback to horizontal if still not determined
      if (isRoadBiome(biomeName) && !roadDirection) {
        roadDirection = "horizontal";
      }

      system._procGenData.currentRoadDirection = roadDirection;
      console.log(`[ProceduralMapTransfer-Edge] Final biome setup: name="${biomeName}", roadDirection="${roadDirection}"`);

      let adjacentBiomesForCheck = null;
      let diagonalBiomesForCheck = null;
      let cacheInfoForCheck = null;

      if (
        system._procGenData.biomeCoordinateCache &&
        Object.keys(system._procGenData.biomeCoordinateCache).length > 0
      ) {
        cacheInfoForCheck = checkAdjacentMapBiomesFromCache(
          adjacentCoords.x,
          adjacentCoords.y,
          system._procGenData.biomeCoordinateCache
        );
        diagonalBiomesForCheck = checkDiagonalMapBiomesFromCache(
          adjacentCoords.x,
          adjacentCoords.y,
          system._procGenData.biomeCoordinateCache
        );
        console.log(`[ProceduralMapTransfer-Edge] Cache info and diagonal biomes retrieved`);
      }

      system._procGenData.displayAsBeach = shouldDisplayAsBeach(biomeName, adjacentBiomesForNewTile, diagonalBiomesForCheck);
      console.log(`[ProceduralMapTransfer-Edge] Display as beach: ${system._procGenData.displayAsBeach}`);

      // Check if biome should display as Island (virtual biome - name, enemies, battle BG only)
      system._procGenData.displayAsIsland = shouldDisplayAsIsland ? shouldDisplayAsIsland(biomeName, adjacentBiomesForNewTile) : false;
      console.log(`[ProceduralMapTransfer-Edge] Display as island: ${system._procGenData.displayAsIsland}`);

      const worldCoords = { x: adjacentCoords.x, y: adjacentCoords.y };
      console.log(`[ProceduralMapTransfer-Edge] Starting terrain generation for coords (${adjacentCoords.x}, ${adjacentCoords.y})`);
      system._procGenData.generatedMapData = generateProceduralTerrain(
        biome,
        seed,
        roadDirection,
        adjacentBiomesForNewTile,
        cacheInfoForCheck,
        worldCoords,
        system._procGenData.biomeCoordinateCache
      );
      console.log(`[ProceduralMapTransfer-Edge] Terrain generation complete. Map data length: ${system._procGenData.generatedMapData ? system._procGenData.generatedMapData.length : 'null'}`);

        // Calculate position on opposite edge
        const edgePos = system.getEdgeCoordinateForDirection(storedExitDirection, storedPlayerX, storedPlayerY);
        console.log(`[ProceduralMapTransfer-Edge] Edge position calculated: (${edgePos.x}, ${edgePos.y})`);
        placeGoDownEvent();
        placeGoUpEvent();

        // Update BGS for new biome
        updateBiomeBGS();

        console.log(`[ProceduralMapTransfer-Edge] Transferring to procedural map at (${edgePos.x}, ${edgePos.y})`);

        // Fade is already started from border touch detection above
        // Just reserve the transfer - screen will be black during terrain generation

        $gamePlayer.reserveTransfer(PROC_MAP_ID, edgePos.x, edgePos.y, storedExitDirection, 0);
      }; // Store callback for execution when fade completes

      // Call the edge transition callback when fade completes
      // The callback will be called by Game_Screen update when fade is done
      return;
    }

    _Game_Player_moveStraight.call(this, d);
  };

  // ===== SCREEN UPDATE HOOK =====

  /**
   * Override Game_Screen update to trigger edge transition callback when fade completes
   */
  const _Game_Screen_update = Game_Screen.prototype.update;
  Game_Screen.prototype.update = function() {
    _Game_Screen_update.call(this);

    // Check if we have a pending edge transition callback
    if ($gameSystem._procGenData && $gameSystem._procGenData._edgeTransitionScheduled &&
        $gameSystem._procGenData._edgeTransitionCallback) {
      // Check if fade out is complete (fade === 0 means fully faded)
      if (this._brightness === 0) {
        console.log(`[Game_Screen.update] Screen is fully black, delaying heavy computation by 10ms`);
        // Delay by 10ms to ensure screen render completes before heavy computation
        setTimeout(() => {
          console.log(`[Game_Screen.update] Executing heavy computation after 10ms delay`);
          $gameSystem._procGenData._edgeTransitionCallback();
        }, 13);
      }
    }
  };

  // ===== SCENE MAP HOOKS =====

  /**
   * Build biome cache on world map load, refresh on procedural map load
   */
  const _Scene_Map_onMapLoaded = Scene_Map.prototype.onMapLoaded;
  Scene_Map.prototype.onMapLoaded = function () {
    _Scene_Map_onMapLoaded.call(this);

    // Build complete biome cache when world map is loaded
    if ($gameMap.mapId() === WORLD_MAP_ID && $gameSystem._procGenData) {
      if (!$gameSystem._procGenData.biomeCoordinateCache ||
          Object.keys($gameSystem._procGenData.biomeCoordinateCache).length === 0) {
        console.log(`[Scene_Map.onMapLoaded] World map loaded, building complete biome cache...`);
        buildBiomeCoordinateCache($gameSystem, $gameMap, WORLD_MAP_ID);
        console.log(`[Scene_Map.onMapLoaded] Biome cache built successfully`);
      }
    }

    if (
      $gameMap.mapId() === PROC_MAP_ID &&
      $gameSystem._procGenData &&
      $gameSystem._procGenData.generatedMapData
    ) {
      if (this._tilemap) {
        // Get the correct tileset for the current biome
        const procGenData = $gameSystem._procGenData;
        const biomeObj = getBiomeByName(procGenData.currentBiome);
        const tilesetId = biomeObj ? biomeObj.tilesetId : 1;
        const tilesetData = $dataTilesets[tilesetId];
        const tilesetName = tilesetData ? tilesetData.name : $gameMap.tileset().name;

        this._tilemap.setTileBitmap(
          0,
          ImageManager.loadTileset(tilesetName)
        );
        this._tilemap.refresh();
      }

      if (this._spriteset) {
        this._spriteset.update();
      }

      // Position GoDown event at seeded random location
      if (placeGoDownEvent) {
        placeGoDownEvent();
      }

      // Position GoUp event (hide when overground or in water biomes)
      if (placeGoUpEvent) {
        placeGoUpEvent();
      }

      // Position Chests (Scatter if underground, hide if overground)
      if (placeChestEvents) {
        placeChestEvents();
      }

      // Update event visibility based on underground state
      updateEventVisibility();

      // Refresh enemies for the current biome
      console.log(`[Scene_Map.onMapLoaded] Procedural map loaded, refreshing enemies for biome`);
      refreshEnemiesForBiome();

      // Setup NPC controllers for the current biome
      console.log(`[Scene_Map.onMapLoaded] Setting up NPC controllers for biome`);
      if ($gameMap && $gameMap.setupNPCControllers) {
        $gameMap.setupNPCControllers();
      }

      // Fade in screen after map is fully loaded
      // Use setTimeout to ensure map is rendered first
      setTimeout(() => {
        $gameScreen.startFadeIn(10); // 10 frames fade in (faster for edge transitions)
        console.log(`[Scene_Map.onMapLoaded] Fading in screen for new biome`);
      }, 100);
    }

    if ($gamePlayer) {
      $gamePlayer.clearProcGenBorderArrows();
    }
  };

  // ===== PLUGIN COMMANDS =====

  PluginManager.registerCommand(pluginName, "startProcGen", (args) => {
    const system = $gameSystem;

    if (system.generateProceduralMap()) {
      const mapWidth = PROC_MAP_WIDTH;
      const mapHeight = PROC_MAP_HEIGHT;
      const playerDirection = $gamePlayer.direction();
      let startX = Math.floor(mapWidth / 2);
      let startY = Math.floor(mapHeight / 2);

      switch (playerDirection) {
        case 2:
          startY = 1;
          break;
        case 4:
          startX = mapWidth - 2;
          break;
        case 6:
          startX = 1;
          break;
        case 8:
          startY = mapHeight - 2;
          break;
      }

      $gameVariables.setValue(110, 1);
      $gameVariables.setValue(111, 1);

      $gamePlayer.reserveTransfer(
        PROC_MAP_ID,
        startX,
        startY,
        playerDirection,
        0
      );
    }
  });

  PluginManager.registerCommand(pluginName, "stopProcGen", (args) => {
    const system = $gameSystem;
    const returnCoords = system.getReturnCoordinates($gamePlayer.direction());

    system.clearProcGenData();
    $gamePlayer.reserveTransfer(
      WORLD_MAP_ID,
      returnCoords.x,
      returnCoords.y,
      2,
      0
    );
  });

  PluginManager.registerCommand(pluginName, "goDown", (args) => {
    const system = $gameSystem;
    const procGenData = system._procGenData;

    // Only allow GoDown on surface level (not underground)
    if (procGenData.biomeLayerStack && procGenData.biomeLayerStack.length > 0) {
      logWarn("GoDown: Already underground. Use GoUp to return to surface.");
      return;
    }

    if (!procGenData.currentBiome) {
      logWarn("GoDown: No current biome found, defaulting to Cave");
      procGenData.currentBiome = "Cave";
    }

    const currentBiome = getBiomeByName(procGenData.currentBiome);
    if (!currentBiome || !currentBiome.lowerLayer) {
      logWarn(`GoDown: Biome "${procGenData.currentBiome}" has no lower layer`);
      return;
    }

    // Push current biome to stack for returning later
    procGenData.biomeLayerStack.push(procGenData.currentBiome);

    // If the current biome is displayed as Beach, use CaveFlooded as the lower layer
    let lowerBiomeName = currentBiome.lowerLayer;
    if (procGenData.displayAsBeach) {
      lowerBiomeName = "CaveFlooded";
    }

    const lowerBiome = getBiomeByName(lowerBiomeName);

    if (!lowerBiome) {
      logWarn(`GoDown: Lower biome "${lowerBiomeName}" not found`);
      procGenData.biomeLayerStack.pop();
      return;
    }

    // Regenerate the map with the lower biome
    procGenData.currentBiome = lowerBiomeName;
    procGenData.currentBiomeTileset = lowerBiome.tilesetId;

    // Store biome temperature data for weather system
    procGenData.biomeDayTemperature = lowerBiome.dayTemperature || 20;
    procGenData.biomeNightTemperature = lowerBiome.nightTemperature || 10;

    const seed = procGenData.seed + procGenData.originX + procGenData.originY + procGenData.biomeLayerStack.length;

    let adjacentBiomes = null;
    let diagonalBiomes = null;
    let cacheInfo = null;

    if ($gameMap.mapId() === PROC_MAP_ID) {
      // For underground layers, use simplified adjacent biome detection
      adjacentBiomes = {
        north: lowerBiomeName,
        south: lowerBiomeName,
        east: lowerBiomeName,
        west: lowerBiomeName,
      };
    }

    procGenData.displayAsBeach = false;

    const worldCoords = { x: procGenData.originX, y: procGenData.originY };
    procGenData.generatedMapData = generateProceduralTerrain(
      lowerBiome,
      seed,
      null,
      adjacentBiomes,
      cacheInfo,
      worldCoords,
      procGenData.biomeCoordinateCache
    );

    // Stop any weather when transitioning underground
    $gameScreen.clearWeather();

    // Fade out screen to hide tileset/terrain change
    $gameScreen.startFadeOut(10);

    // Teleport to center of underground map (64, 64)
    const centerX = Math.floor(PROC_MAP_WIDTH / 2);
    const centerY = Math.floor(PROC_MAP_HEIGHT / 2);
    const playerDir = $gamePlayer.direction();
    $gamePlayer.reserveTransfer(PROC_MAP_ID, centerX, centerY, playerDir, 0);

    // Update event visibility after map transition
    setTimeout(() => updateEventVisibility(), 100);

    // Refresh enemies for the underground biome
    setTimeout(() => refreshEnemiesForBiome(), 100);

    // Setup NPC controllers for the underground biome
    setTimeout(() => {
      if ($gameMap && $gameMap.setupNPCControllers) {
        $gameMap.setupNPCControllers();
      }
    }, 100);

    // Update BGS for underground biome
    setTimeout(() => {
      updateBiomeBGS();
    }, 100);

    // Fade in screen after map is fully loaded
    setTimeout(() => {
      $gameScreen.startFadeIn(10);
      console.log(`[goDown] Fading in screen for underground biome`);
    }, 150);
  });

  PluginManager.registerCommand(pluginName, "goUp", (args) => {
    const system = $gameSystem;
    const procGenData = system._procGenData;

    // Only allow GoUp when underground (biomeLayerStack not empty)
    if (!procGenData.biomeLayerStack || procGenData.biomeLayerStack.length === 0) {
      logWarn("GoUp: Not underground. Use GoDown to enter a cave.");
      return;
    }

    // Pop the previous biome from the stack
    const previousBiomeName = procGenData.biomeLayerStack.pop();
    const previousBiome = getBiomeByName(previousBiomeName);

    if (!previousBiome) {
      logWarn(`GoUp: Previous biome "${previousBiomeName}" not found`);
      return;
    }

    // Regenerate the map with the previous biome
    procGenData.currentBiome = previousBiomeName;
    procGenData.currentBiomeTileset = previousBiome.tilesetId;

    // Store biome temperature data for weather system
    procGenData.biomeDayTemperature = previousBiome.dayTemperature || 20;
    procGenData.biomeNightTemperature = previousBiome.nightTemperature || 10;

    const seed = procGenData.seed + procGenData.originX + procGenData.originY + procGenData.biomeLayerStack.length;

    let adjacentBiomes = null;
    let diagonalBiomes = null;
    let cacheInfo = null;

    if ($gameMap.mapId() === WORLD_MAP_ID) {
      adjacentBiomes = getAdjacentBiomesOnWorldMap(procGenData.originX, procGenData.originY);
      adjacentBiomes = {
        north: normalizeBiomeForEdge(adjacentBiomes.north),
        south: normalizeBiomeForEdge(adjacentBiomes.south),
        east: normalizeBiomeForEdge(adjacentBiomes.east),
        west: normalizeBiomeForEdge(adjacentBiomes.west),
      };

      if (procGenData.biomeCoordinateCache && Object.keys(procGenData.biomeCoordinateCache).length > 0) {
        cacheInfo = checkAdjacentMapBiomesFromCache(
          procGenData.originX,
          procGenData.originY,
          procGenData.biomeCoordinateCache
        );
        diagonalBiomes = checkDiagonalMapBiomesFromCache(
          procGenData.originX,
          procGenData.originY,
          procGenData.biomeCoordinateCache
        );
      }
    }

    procGenData.displayAsBeach = shouldDisplayAsBeach(previousBiomeName, adjacentBiomes, diagonalBiomes);

    // Check if biome should display as Island (virtual biome - name, enemies, battle BG only)
    procGenData.displayAsIsland = shouldDisplayAsIsland ? shouldDisplayAsIsland(previousBiomeName, adjacentBiomes) : false;

    const worldCoords = { x: procGenData.originX, y: procGenData.originY };
    procGenData.generatedMapData = generateProceduralTerrain(
      previousBiome,
      seed,
      null,
      adjacentBiomes,
      cacheInfo,
      worldCoords,
      procGenData.biomeCoordinateCache
    );

    // Stop any weather when transitioning to surface
    $gameScreen.clearWeather();

    // Fade out screen to hide tileset/terrain change
    $gameScreen.startFadeOut(10);

    // Teleport to the location of the GoDown event
    const goDownX = procGenData.goDownEventX || 64;
    const goDownY = procGenData.goDownEventY || 64;
    const playerDir = $gamePlayer.direction();
    $gamePlayer.reserveTransfer(PROC_MAP_ID, goDownX, goDownY, playerDir, 0);

    // Update event visibility after map transition
    setTimeout(() => updateEventVisibility(), 100);

    // Refresh enemies for the surface biome
    setTimeout(() => refreshEnemiesForBiome(), 100);

    // Setup NPC controllers for the surface biome
    setTimeout(() => {
      if ($gameMap && $gameMap.setupNPCControllers) {
        $gameMap.setupNPCControllers();
      }
    }, 100);

    // Update BGS for surface biome
    setTimeout(() => {
      updateBiomeBGS();
    }, 100);

    // Fade in screen after map is fully loaded
    setTimeout(() => {
      $gameScreen.startFadeIn(10);
      console.log(`[goUp] Fading in screen for surface biome`);
    }, 150);
  });
})();

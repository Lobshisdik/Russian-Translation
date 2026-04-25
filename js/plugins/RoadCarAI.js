//=============================================================================
// RoadCarAI.js
// Version: 2.9.1 - Vehicle Collision Update
//=============================================================================

/*:
 * @target MZ
 * @plugindesc Road Car AI System - Handles Linear/Corner paths + Player Collision
 * @author Omni-Lex
 * @version 2.9.1
 *
 * @help
 * Road Car AI System v2.9.1
 * =========================
 * Customized for Map 636 specific traffic flows.
 *
 * FEATURES:
 * - Detects intersection type (Linear or Corner) from procedural generation data.
 * - Supports "L" shaped turns for all 4 corner types.
 * - Maintains distributed spawning along the curved paths.
 * - Automatically respawns cars when they leave the map.
 * - COLLISION: Player bounces back diagonally on impact.
 *
 * UPDATES v2.9.1:
 * - Added specific collision logic for vehicles:
 * - Boat (Car): Triggers CE 167.
 * - Ship (Camper): Triggers CE 168.
 * - On Foot: Triggers CE 163.
 */

(() => {
  "use strict";

  const pluginName = "RoadCarAI";
  const PROC_MAP_ID = 636;
  const PROC_MAP_WIDTH = 128;
  const PROC_MAP_HEIGHT = 128;
  const MAX_CARS = 16;
  const GAME_TIME_VARIABLE = 114;
  
  // Distance between cars when map first loads
  const SPAWN_SPACING = 14; 

  // Coordinates for the road lanes
  const LANE_X_LEFT = 51;
  const LANE_X_RIGHT = 75;
  const LANE_Y_TOP = 53;
  const LANE_Y_BOTTOM = 75;

  const RoadGen = window.ProcGenRoads;
  if (!RoadGen) {
    console.warn("RoadCarAI: ProceduralMapRoadGenerator not loaded (using defaults)");
  }

  // ==========================================================================
  //  CONFIGURATION & COORDINATES
  // ==========================================================================

  function isCityOrBurgBiome(biomeName) {
    if (!biomeName) return false;
    const lower = biomeName.toLowerCase();
    return lower.includes("city") || lower.includes("burg");
  }

  function getCardinalLaneConfig(laneId) {
    // For city/burg biomes, use 4 cardinal directions (N, S, E, W)
    // Each direction has opposing traffic with 3 tile distance between lanes
    // Vertical traffic (N/S) shifted 6 tiles right then 5 tiles left, Horizontal traffic (E/W) shifted 3 tiles down and 1 tile north
    const cardinalLanes = [
      // Northbound lane (moving North, entering from South) - X: 62 (67-5)
      { type: "linear", startX: 62, startY: 127, moveDir: 8, label: "Northbound" },
      // Southbound lane (moving South, entering from North) - X: 65 (70-5)
      { type: "linear", startX: 65, startY: 0, moveDir: 2, label: "Southbound" },
      // Eastbound lane (moving East, entering from West) - Y: 63 (61+3-1)
      { type: "linear", startX: 0, startY: 63, moveDir: 6, label: "Eastbound" },
      // Westbound lane (moving West, entering from East) - Y: 66 (64+3-1)
      { type: "linear", startX: 127, startY: 66, moveDir: 4, label: "Westbound" }
    ];

    return cardinalLanes[laneId % cardinalLanes.length] || cardinalLanes[0];
  }

  function getLaneConfig(intersectionType, laneId) {
    // Normalize intersection type string
    let type = intersectionType.toLowerCase();
    
    // Alias handling
    if (type.includes("corner-north-east")) type = "corner-up-right";
    if (type.includes("corner-north-west")) type = "corner-up-left";
    if (type.includes("corner-south-east")) type = "corner-down-right";
    if (type.includes("corner-south-west")) type = "corner-down-left";

    // --- LINEAR ROADS ---
    if (type === "horizontal" || type === "linear-horizontal") {
      if (laneId === 0) {
        // Westbound (Top Lane)
        return { 
          type: "linear", 
          startX: 127, startY: LANE_Y_TOP, moveDir: 4, 
          label: "Westbound" 
        }; 
      } else {
        // Eastbound (Bottom Lane)
        return { 
          type: "linear", 
          startX: 1, startY: LANE_Y_BOTTOM, moveDir: 6, 
          label: "Eastbound" 
        };
      }
    } 
    else if (type === "vertical" || type === "linear-vertical") {
      if (laneId === 0) {
        // Northbound (Right Lane)
        return { 
          type: "linear", 
          startX: LANE_X_RIGHT, startY: 125, moveDir: 8, 
          label: "Northbound" 
        };
      } else {
        // Southbound (Left Lane)
        return { 
          type: "linear", 
          startX: LANE_X_LEFT, startY: 1, moveDir: 2, 
          label: "Southbound" 
        };
      }
    }

    // --- CORNER ROADS (L-SHAPED) ---
    else if (type === "corner-up-right" || type === "corner-right-up") {
      if (laneId === 0) {
        // North -> East
        return {
          type: "corner",
          startX: LANE_X_LEFT, startY: 1, startDir: 2,
          turnX: LANE_X_LEFT, turnY: LANE_Y_BOTTOM,
          endDir: 6,
          label: "North to East"
        };
      } else {
        // East -> North
        return {
          type: "corner",
          startX: 127, startY: LANE_Y_TOP, startDir: 4,
          turnX: LANE_X_RIGHT, turnY: LANE_Y_TOP,
          endDir: 8,
          label: "East to North"
        };
      }
    }
    else if (type === "corner-up-left" || type === "corner-left-up") {
      if (laneId === 0) {
        // North -> West
        return {
          type: "corner",
          startX: LANE_X_LEFT, startY: 1, startDir: 2,
          turnX: LANE_X_LEFT, turnY: LANE_Y_TOP,
          endDir: 4,
          label: "North to West"
        };
      } else {
        // West -> North
        return {
          type: "corner",
          startX: 1, startY: LANE_Y_BOTTOM, startDir: 6,
          turnX: LANE_X_RIGHT, turnY: LANE_Y_BOTTOM,
          endDir: 8,
          label: "West to North"
        };
      }
    }
    else if (type === "corner-down-right" || type === "corner-right-down") {
      if (laneId === 0) {
        // South -> East
        return {
          type: "corner",
          startX: LANE_X_RIGHT, startY: 127, startDir: 8,
          turnX: LANE_X_RIGHT, turnY: LANE_Y_BOTTOM,
          endDir: 6,
          label: "South to East"
        };
      } else {
        // East -> South
        return {
          type: "corner",
          startX: 127, startY: LANE_Y_TOP, startDir: 4,
          turnX: LANE_X_LEFT, turnY: LANE_Y_TOP,
          endDir: 2,
          label: "East to South"
        };
      }
    }
    else if (type === "corner-down-left" || type === "corner-left-down") {
      if (laneId === 0) {
        // South -> West
        return {
          type: "corner",
          startX: LANE_X_RIGHT, startY: 127, startDir: 8,
          turnX: LANE_X_RIGHT, turnY: LANE_Y_TOP,
          endDir: 4,
          label: "South to West"
        };
      } else {
        // West -> South
        return {
          type: "corner",
          startX: 1, startY: LANE_Y_BOTTOM, startDir: 6,
          turnX: LANE_X_LEFT, turnY: LANE_Y_BOTTOM,
          endDir: 2,
          label: "West to South"
        };
      }
    }

    // Default Fallback
    return { 
      type: "linear", 
      startX: 1, startY: LANE_Y_BOTTOM, moveDir: 6, 
      label: "Default-Eastbound" 
    };
  }

  // ==========================================================================
  //  UTILITIES
  // ==========================================================================

  function shouldDeleteCarsForBiome(biomeName) {
    if (!biomeName) return true; // No biome = delete cars
    const lowerBiome = biomeName.toLowerCase();
    const allowedKeywords = ["road", "bridge", "city", "burg", "tunnel"];
    return !allowedKeywords.some(keyword => lowerBiome.includes(keyword));
  }

  function getGameTimeMinutes() {
    return $gameVariables.value(GAME_TIME_VARIABLE) || 0;
  }

  function getHourFromMinutes(minutes) {
    const date = new Date(2001, 0, 1, 12, 0, 0);
    date.setMinutes(date.getMinutes() + minutes);
    return date.getHours();
  }

  function getTrafficDensityMultiplier() {
    const hour = getHourFromMinutes(getGameTimeMinutes());
    if ((hour >= 7 && hour < 9) || (hour >= 17 && hour < 19)) return 1.0;
    if (hour >= 22 || hour < 6) return 0.25;
    return 0.6;
  }

  function getTargetCarCount() {
    return Math.max(1, Math.round(MAX_CARS * getTrafficDensityMultiplier()));
  }

  function getCurrentIntersectionType() {
    if ($gameSystem._procGenData && $gameSystem._procGenData.roadIntersectionType) {
      return $gameSystem._procGenData.roadIntersectionType;
    }
    const currentBiomeName = $gameSystem._procGenData?.currentBiome || "";
    if (RoadGen && RoadGen.isRoadBiome(currentBiomeName)) {
      const parsed = RoadGen.parseRoadConfig(currentBiomeName);
      if (parsed) return parsed.direction;
    }
    return "horizontal";
  }

  // ==========================================================================
  //  MOVEMENT LOGIC
  // ==========================================================================

  function createRoute(config, skipSteps = 0) {
    const speed = 6; // Real Fast
    const list = [];
    list.push({ code: 29, parameters: [speed] });
    list.push({ code: 45, parameters: [] }); // Frequency Highest

    // Helper to get move code from direction
    const getMoveCode = (d) => {
        if (d === 2) return 1; // Down
        if (d === 4) return 2; // Left
        if (d === 6) return 3; // Right
        if (d === 8) return 4; // Up
        return 1;
    };

    if (config.type === "linear") {
      const moveCode = getMoveCode(config.moveDir);
      for (let i = 0; i < 10; i++) {
        list.push({ code: moveCode, parameters: [] });
      }
      return { list: list, repeat: true, skippable: true, wait: false };
    } 
    else if (config.type === "corner") {
      const leg1DistX = Math.abs(config.turnX - config.startX);
      const leg1DistY = Math.abs(config.turnY - config.startY);
      let leg1Steps = leg1DistX + leg1DistY;

      // Ensure they go well off screen
      const leg2Steps = 150; 

      const moveCode1 = getMoveCode(config.startDir);
      const moveCode2 = getMoveCode(config.endDir);

      if (skipSteps < leg1Steps) {
        const remainingLeg1 = leg1Steps - skipSteps;
        for (let i = 0; i < remainingLeg1; i++) {
          list.push({ code: moveCode1, parameters: [] });
        }
        for (let i = 0; i < leg2Steps; i++) {
          list.push({ code: moveCode2, parameters: [] });
        }
      } else {
        for (let i = 0; i < leg2Steps; i++) {
          list.push({ code: moveCode2, parameters: [] });
        }
      }

      list.push({ code: 0, parameters: [] }); 
      return { list: list, repeat: false, skippable: true, wait: false };
    }
  }

  function checkBoundary(event) {
    const margin = 2; // Increased margin
    const x = event.x;
    const y = event.y;
    const dir = event.direction();

    // Only check the boundary we are moving TOWARDS
    if (dir === 4 && x <= margin) return true; // Moving Left, hit Left wall
    if (dir === 6 && x >= PROC_MAP_WIDTH - 1 - margin) return true; // Moving Right, hit Right wall
    if (dir === 8 && y <= margin) return true; // Moving Up, hit Top wall
    if (dir === 2 && y >= PROC_MAP_HEIGHT - 1 - margin) return true; // Moving Down, hit Bottom wall

    return false;
  }

  function respawnCar(event) {
    if (!event._laneConfig) return;

    const cfg = event._laneConfig;
    
    event.setPosition(cfg.startX, cfg.startY);
    
    if (cfg.type === "linear") {
        event.setDirection(cfg.moveDir);
    } else {
        event.setDirection(cfg.startDir);
    }

    const route = createRoute(cfg, 0); 
    event.forceMoveRoute(route);
    event._moveRouteIndex = 0;
  }

  // ==========================================================================
  //  CORE OVERRIDES
  // ==========================================================================

  const _Game_Event_initialize = Game_Event.prototype.initialize;
  Game_Event.prototype.initialize = function (mapId, eventId) {
    _Game_Event_initialize.call(this, mapId, eventId);
    this._isRoadCar = this.event().name === "Car";
  };

  const _Game_Event_update = Game_Event.prototype.update;
  Game_Event.prototype.update = function () {
    _Game_Event_update.call(this);

    if (this._isRoadCar && $gameMap.mapId() === PROC_MAP_ID) {
      
      const targetCount = getTargetCarCount();
      const activeCarIndex = this._carIndex !== undefined ? this._carIndex : 99;
      const shouldBeActive = activeCarIndex < targetCount;

      if (!shouldBeActive) {
        if (!this._hidden) {
           this._hidden = true;
           this.setOpacity(0);
        }
        return; 
      } else {
        if (this._hidden) {
           this._hidden = false;
           this.setOpacity(255);
           respawnCar(this); 
        }
      }

      // --- COLLISION DETECTION ---
      // If car overlaps player and player isn't already jumping (to avoid double hits)
      if (this.x === $gamePlayer.x && this.y === $gamePlayer.y && !$gamePlayer.isJumping()) {
          this.performPlayerHit();
      }

      // Check boundary / route finish
      if (!this.isMoveRouteForcing() || checkBoundary(this)) {
        respawnCar(this);
      }
    }
  };

  // Handle Player Collision
  Game_Event.prototype.performPlayerHit = function() {
      const carDir = this.direction();
      let jx = 0;
      let jy = 0;
      const jumpPower = 3; // "More dramatic" distance
      
      // Calculate random sway (Left or Right relative to movement)
      const sway = Math.random() < 0.5 ? 1 : -1;

      // Calculate vector: Bounce back + Sway sideways
      // MZ directions: 2=Down, 4=Left, 6=Right, 8=Up
      switch (carDir) {
          case 2: // Car Down -> Jump Up (Y-3) + Sway X
              jy = -jumpPower;
              jx = sway;
              break;
          case 4: // Car Left -> Jump Right (X+3) + Sway Y
              jx = jumpPower;
              jy = sway;
              break;
          case 6: // Car Right -> Jump Left (X-3) + Sway Y
              jx = -jumpPower;
              jy = sway;
              break;
          case 8: // Car Up -> Jump Down (Y+3) + Sway X
              jy = jumpPower;
              jx = sway;
              break;
      }

      // 1. Execute Jump (Bounce back + Sway)
      $gamePlayer.jump(jx, jy);

      // 2. Call Common Event based on Vehicle Type
      if ($gamePlayer.isInShip()) {
          // Riding Ship -> Camper Accident
          $gameTemp.reserveCommonEvent(168);
      } 
      else if ($gamePlayer.isInBoat()) {
          // Riding Boat -> Car Accident
          $gameTemp.reserveCommonEvent(167);
      } 
      else {
          // On Foot -> Normal Get Hit Handler
          $gameTemp.reserveCommonEvent(163);
      }
  };

  // ==========================================================================
  //  INITIALIZATION
  // ==========================================================================

  // FIX: Use onMapLoaded instead of create + timeout
  const _Scene_Map_onMapLoaded = Scene_Map.prototype.onMapLoaded;
  Scene_Map.prototype.onMapLoaded = function() {
    _Scene_Map_onMapLoaded.call(this);
    if ($gameMap.mapId() === PROC_MAP_ID) {
       this.initializeRoadCars();
    }
  };

  Scene_Map.prototype.initializeRoadCars = function () {
    const biomeName = $gameSystem._procGenData?.currentBiome || "";

    const allCarEvents = $gameMap.events().filter(e => e.event().name === "Car");

    // Delete car events if biome doesn't allow them
    if (shouldDeleteCarsForBiome(biomeName)) {
      allCarEvents.forEach(event => {
        event.erase();
      });
      console.log("[RoadCarAI] Cars deleted for biome:", biomeName);
      return;
    }

    // Unhide and initialize cars if biome allows them
    allCarEvents.forEach(event => {
      if (event._erased) {
        event._erased = false;
      }
    });

    const intersectionType = getCurrentIntersectionType();
    console.log("[RoadCarAI] Initializing flow for:", intersectionType);

    const events = allCarEvents;
    let carCount = 0;

    if (events.length === 0) {
      console.warn("[RoadCarAI] No cars found to initialize! Events might not be ready.");
      // Last resort retry if for some reason procedural gen is still lagging
      setTimeout(() => this.initializeRoadCars(), 500);
      return;
    }
    
    const laneCounters = {}; 

    events.forEach((event, index) => {
      event._isRoadCar = true;
      event._carIndex = carCount;

      let cfg;
      let laneKey;

      // Use cardinal lanes for city/burg biomes
      if (isCityOrBurgBiome(biomeName)) {
        const laneId = index % 4; // 4 cardinal lanes total
        cfg = getCardinalLaneConfig(laneId);
        laneKey = "cardinal_" + laneId;
      } else {
        // Use intersection-based lanes for regular roads
        let specificType = intersectionType;

        if (specificType === 'cross' || specificType.startsWith('t-')) {
            specificType = (Math.floor(index / 2) % 2 === 0) ? "horizontal" : "vertical";
        }

        const laneId = index % 2;
        laneKey = specificType + "_" + laneId;
        cfg = getLaneConfig(specificType, laneId);
      }

      if (!laneCounters[laneKey]) laneCounters[laneKey] = 0;
      event._laneConfig = cfg;

      const offsetAmount = laneCounters[laneKey] * SPAWN_SPACING;
      let spawnX = cfg.startX;
      let spawnY = cfg.startY;
      let spawnDir = (cfg.type === "linear") ? cfg.moveDir : cfg.startDir;
      let skipSteps = 0;

      if (cfg.type === "linear") {
          if (cfg.moveDir === 4) spawnX -= offsetAmount;      
          else if (cfg.moveDir === 6) spawnX += offsetAmount; 
          else if (cfg.moveDir === 8) spawnY -= offsetAmount; 
          else if (cfg.moveDir === 2) spawnY += offsetAmount; 
      } 
      else if (cfg.type === "corner") {
          const leg1Len = Math.abs(cfg.turnX - cfg.startX) + Math.abs(cfg.turnY - cfg.startY);
          
          if (offsetAmount < leg1Len) {
              if (cfg.startDir === 4) spawnX -= offsetAmount;
              else if (cfg.startDir === 6) spawnX += offsetAmount;
              else if (cfg.startDir === 8) spawnY -= offsetAmount;
              else if (cfg.startDir === 2) spawnY += offsetAmount;
              
              spawnDir = cfg.startDir;
              skipSteps = offsetAmount;
          } else {
              const leg2Offset = offsetAmount - leg1Len;
              spawnX = cfg.turnX;
              spawnY = cfg.turnY;
              
              if (cfg.endDir === 4) spawnX -= leg2Offset;
              else if (cfg.endDir === 6) spawnX += leg2Offset;
              else if (cfg.endDir === 8) spawnY -= leg2Offset;
              else if (cfg.endDir === 2) spawnY += leg2Offset;
              
              spawnDir = cfg.endDir;
              skipSteps = offsetAmount; 
          }
      }

      spawnX = Math.max(0, Math.min(PROC_MAP_WIDTH - 1, spawnX));
      spawnY = Math.max(0, Math.min(PROC_MAP_HEIGHT - 1, spawnY));

      laneCounters[laneKey]++;

      event.setPosition(spawnX, spawnY);
      event.setDirection(spawnDir);
      event.setPriorityType(1);
      event.setMoveSpeed(6); 
      event.setStepAnime(true);

      const route = createRoute(cfg, skipSteps);
      event.forceMoveRoute(route);

      carCount++;
    });

    console.log(`[RoadCarAI] ${carCount} cars initialized.`);
  };

})();
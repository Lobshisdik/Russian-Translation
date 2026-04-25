/*:
 * @target MZ
 * @plugindesc Enhanced Autonomous NPC System v2.1.0 - TreasureRoom Integration
 * @author Omni-Lex
 * @help
 * ============================================================================
 * Enhanced Autonomous NPC System - TreasureRoom Integration
 * ============================================================================
 * This plugin makes NPCs come alive with autonomous behavior including
 * pathfinding, interactions, dynamic spawning, and zone-based activities.
 *
 * HOUSE INTEGRATION (v2.1.0+):
 * When visiting a house via TreasureRoomSystem's "Visit House" command:
 * - Houses that are children of house pool parent IDs (1132-1137, 1394, 1156-1157)
 *   will automatically spawn NPCs from their associated MapGroup
 * - Add <MapGroup: GroupName> tag to house map notes to specify which group's
 *   NPCs to spawn (e.g., <MapGroup: Ghent>)
 * - Maximum 3 NPCs will spawn in houses (vs. 8 in regular maps)
 * - NPCs will NOT spawn in treasure room maps (children of map 133)
 * - Multifloor buildings are fully supported; NPCs won't spawn in treasure areas
 *
 * Setup:
 * 1. Add <NPC> to the map notes to enable the AI system on that map.
 * 2. Add "AI" into the notes of any event you wish to control (case-insensitive).
 * 3. Name exit events starting with "House", "Transfer", or "Door (" (case-sensitive)
 * 4. Name enemies starting with "Enemy"
 * 5. Set Region ID 5 as always passable
 * 6. Set Region ID 10 as blocking
 * 7. NPCs are placed on tiles with terrain tags 1, 2, 5, or 7 only
 * * Exit System:
 * - NPCs will exit the map when touching events named with "House", "Transfer", or "Door ("
 * - These names must match the case exactly
 * Zone Region IDs:
 * - Region 100: Bench/Chair (rest zones)
 * - Region 101: Social zones (attract groups)
 * - Region 102: Market zones (shopping/browsing)
 * - Region 103: Avoidance zones (NPCs avoid) - also used for treasure room protection
 * * @param debugMode
 * @text Debug Mode
 * @desc Enable console logging for debugging
 * @type boolean
 * @default false
 * * @param interactionTime
 * @text Interaction Duration
 * @desc How long NPCs interact (in milliseconds)
 * @type number
 * @min 3000
 * @max 10000
 * @default 5000
 * * @param spawnChance
 * @text Spawn Chance
 * @desc Chance per second for absent NPCs to spawn (0.01 = 1%)
 * @type number
 * @decimals 2
 * @min 0.01
 * @max 0.1
 * @default 0.02
 * * @param playerAwarenessRange
 * @text Player Awareness Range
 * @desc How many tiles away NPCs notice the player
 * @type number
 * @min 2
 * @max 8
 * @default 4
 * * @param flockingEnabled
 * @text Enable Flocking
 * @desc Enable flocking behavior for NPCs
 * @type boolean
 * @default true
 *
 * @param gameHourVariable
 * @text Game Hour Variable
 * @desc Which game variable stores the current hour (0-23)
 * @type variable
 * @default 23
 *
 * @param nightStartHour
 * @text Night Start Hour
 * @desc Hour when NPCs start staying in houses (0-23)
 * @type number
 * @min 0
 * @max 23
 * @default 23
 *
 * @param nightEndHour
 * @text Night End Hour
 * @desc Hour when NPCs return to city (0-23)
 * @type number
 * @min 0
 * @max 23
 * @default 6
 */

(() => {
  "use strict";

  const pluginName = "EnhancedAutonomousNPCSystem";
  const parameters = PluginManager.parameters(pluginName);
  const debugMode = parameters["debugMode"] === "true";
  const interactionTime = Number(parameters["interactionTime"]) || 5000;
  const spawnChance = Number(parameters["spawnChance"]) || 0.02;
  const playerAwarenessRange = Number(parameters["playerAwarenessRange"]) || 4;
  const flockingEnabled = parameters["flockingEnabled"] === "true";
  const gameHourVariable = 23;
  const nightStartHour = Number(parameters["nightStartHour"]) || 23;
  const nightEndHour = Number(parameters["nightEndHour"]) || 6;
  const EXIT_CHANCE_AFTER_ACTIVITY = 0.3;
  // Zone constants
  const ZONE_BENCH = 100;
  const ZONE_SOCIAL = 101;
  const ZONE_MARKET = 102;
  const ZONE_AVOID = 103;

  // Global house absence probability system
  let lastAbsenceUpdateTime = 0;
  let currentHouseAbsenceProbability = 0.5; // 50% chance to be home by default
  const ABSENCE_UPDATE_INTERVAL = 300000; // 5 minutes
  const NIGHT_HOME_PROBABILITY = 0.85; // 85% chance to be home at night
  const DAY_HOME_PROBABILITY = 0.3; // 30% chance to be home during day

  // NPC presence on regular maps (inverse of house system)
  const NIGHT_OUTSIDE_PROBABILITY = 0.2; // 20% chance to be outside at night (rare)
  const DAY_OUTSIDE_PROBABILITY = 0.8; // 80% chance to be outside during day (common)

  // Map groups
  const mapGroups = {
    Ghent: {
      id: 618,
      type: "City",
      maps: [ 
        689, 704, 708, 709, 710, 715, 827, 1078, 1036, 1022, 1040, 1092, 1095, 1096,
        1098, 1099, 1100, 1114, 1115, 1074, 1071, 1006
      ],
    },
    GhentFields: {
      id: 1408,
      type: "Village",
      maps: [1035, 1037, 1038, 1041, 1042],
    },
    Antwerpen: {
      id: 1407,
      type: "Village",
      maps: [397, 1043, 1017, 1018, 1044, 1020, 1414], //TODO: remove 1414 after defined new pool
    },
    OmegaTower: {
      id: 536,
      type: "City",
      maps: [
        1, 102, 141, 313, 349, 503, 508, 532, 533, 540, 541, 631, 635, 686,
        1129, 1130, 1131, 721
      ],
    },
  };

  // Treasure room parent IDs - maps under these should not get NPCs
  const treasureRoomParentIds = [133];

  // House pool parent IDs - used to identify house maps
  const housePoolParentIds = [
    1132, 1133, 1134, 1135, 1136, 1137, 1394, 1156, 1157,
  ];

  // Helper functions
  function debug(message) {
    console.log(`[NPC System] ${message}`);
  }

  function getMapName(mapId) {
    if ($dataMapInfos && $dataMapInfos[mapId]) {
      return $dataMapInfos[mapId].name || `Map ${mapId}`;
    }
    return `Map ${mapId}`;
  }

  function setCurrentMapGroup(mapGroup) {
    if (!$gameSystem) return;
    $gameSystem._npcSystemCurrentMapGroup = mapGroup;
    if (mapGroup) {
      const groupName =
        Object.keys(mapGroups).find((k) => mapGroups[k] === mapGroup) ||
        "Unknown";
      debug(`Current MapGroup set to: ${groupName}`);
    } else {
      debug(`Current MapGroup cleared`);
    }
  }

  function getCurrentMapGroup() {
    if (!$gameSystem) return null;
    return $gameSystem._npcSystemCurrentMapGroup;
  }

  function clearCurrentMapGroup() {
    if (!$gameSystem) return;
    $gameSystem._npcSystemCurrentMapGroup = null;
    debug(`Current MapGroup cleared`);
  }

  // === DEFENSIVE PATCH FOR GAME_EVENT.FINDPROPERPAGE ===
  // Prevents "Cannot read property 'pages' of undefined" error during map transitions
  const _Game_Event_findProperPageIndex =
    Game_Event.prototype.findProperPageIndex;
  Game_Event.prototype.findProperPageIndex = function () {
    try {
      return _Game_Event_findProperPageIndex.call(this);
    } catch (error) {
      // Only return -1 if we actually get an error, don't preemptively block valid events
      return -1;
    }
  };

  function isMapChild(mapId, parentIds) {
    // Ensure mapId is valid
    if (!mapId || typeof mapId !== "number") return false;
    if (!$dataMapInfos || !$dataMapInfos[mapId]) return false;
    const mapInfo = $dataMapInfos[mapId];
    return parentIds.includes(mapInfo.parentId);
  }

  function isTreasureRoom(mapId) {
    return isMapChild(mapId, treasureRoomParentIds);
  }

  function isHouseMap(mapId) {
    return isMapChild(mapId, housePoolParentIds);
  }

  function isMultiFloorBuilding() {
    // Check if TreasureRoomSystem is active and we're in a building
    return (
      window.TreasureRoomSystem &&
      window.TreasureRoomSystem.currentMultiBuilding !== undefined
    );
  }

  function getNPCSpawnLimit() {
    // Houses get max 3 NPCs, regular maps get max 8
    if (isHouseMap($gameMap.mapId())) {
      return 3;
    }
    return 8;
  }

  // Update global house absence probability every 5 minutes based on time of day
  function updateGlobalHouseAbsenceProbability() {
    const currentTime = Date.now();

    // Only update every 5 minutes
    if (currentTime - lastAbsenceUpdateTime < ABSENCE_UPDATE_INTERVAL) {
      return;
    }

    const gameHour = getGameHour();
    const nightTime = isNightTime(gameHour);

    // Determine base probability based on time
    const baseProbability = nightTime
      ? NIGHT_HOME_PROBABILITY
      : DAY_HOME_PROBABILITY;

    // Add some variance (±10%) to make it less static
    const variance = (Math.random() - 0.5) * 0.2; // -10% to +10%
    currentHouseAbsenceProbability = Math.max(
      0.1,
      Math.min(0.9, baseProbability + variance)
    );

    lastAbsenceUpdateTime = currentTime;

    debug(
      `[House Probability Update] Time: ${gameHour}:00 (${
        nightTime ? "NIGHT" : "DAY"
      }) | Home probability: ${(currentHouseAbsenceProbability * 100).toFixed(
        1
      )}%`
    );
  }

  // Get current global house home probability
  function getHouseHomeProbability() {
    updateGlobalHouseAbsenceProbability();
    return currentHouseAbsenceProbability;
  }

  // Get NPC presence probability for regular maps (outside)
  function getOutsidePresenceProbability() {
    const gameHour = getGameHour();
    const nightTime = isNightTime(gameHour);

    // At night: 20% presence (rare) | During day: 80% presence (common)
    const baseProbability = nightTime
      ? NIGHT_OUTSIDE_PROBABILITY
      : DAY_OUTSIDE_PROBABILITY;

    // Add variance (±10%)
    const variance = (Math.random() - 0.5) * 0.2;
    return Math.max(0.05, Math.min(0.95, baseProbability + variance));
  }

  function getMapGroup() {
    if (!$dataMap || !$dataMap.note) return null;

    // Skip MapGroup checking for house maps
    const mapId = $dataMap.id;
    if (mapId && isHouseMap(mapId)) {
      return null; // Houses don't have MapGroup tags
    }

    const note = $dataMap.note;
    const match = note.match(/<MapGroup:\s*(\w+)>/i);

    if (match && match[1]) {
      const groupName = match[1];
      const mapGroup = mapGroups[groupName];
      debug(
        `Found MapGroup tag: "${groupName}" -> Pool Map ID: ${
          mapGroup?.id || "NOT FOUND"
        }`
      );
      return mapGroup || null;
    }

    return null;
  }

  /**
   * Get the current biome object for procedural maps or world maps
   * Returns biome object with hasNPC, name, and other properties
   * Returns null if biome not found or not on procedural/world map
   */
  function getCurrentBiome() {
    const mapId = $gameMap.mapId();

    // Only works for procedural map (636) or world map (315)
    if (mapId !== 636 && mapId !== 315) {
      return null;
    }

    let biomeName = null;

    // For procedural map 636: get from world coordinates stored in variables
    if (mapId === 636) {
      const VAR_WORLD_X = 43;
      const VAR_WORLD_Y = 44;
      const worldX = $gameVariables.value(VAR_WORLD_X);
      const worldY = $gameVariables.value(VAR_WORLD_Y);

      // Try to get from game system methods (if available)
      if ($gameSystem && typeof $gameSystem.getBiomeFromCache === "function") {
        biomeName = $gameSystem.getBiomeFromCache(worldX, worldY);
      } else if (
        window.ProcGenUtils &&
        typeof window.ProcGenUtils.getBiomeForWorldTile === "function"
      ) {
        // Fallback: get from world tile directly
        let selectedTileId = 0;
        for (let z = 3; z >= 0; z--) {
          const tileId = $gameMap.tileId(worldX, worldY, z);
          if (tileId && tileId !== 0) {
            selectedTileId = tileId;
            break;
          }
        }
        if (selectedTileId !== 0) {
          biomeName = window.ProcGenUtils.getBiomeForWorldTile(selectedTileId);
        }
      }
    }
    // For world map 315: get from player position
    else if (mapId === 315) {
      if (
        $gameSystem &&
        typeof $gameSystem.getBiomeFromWorldCoordinates === "function"
      ) {
        biomeName = $gameSystem.getBiomeFromWorldCoordinates(
          $gamePlayer.x,
          $gamePlayer.y
        );
      }
    }

    // If we got a biome name, look it up in the BIOMES array
    if (biomeName && window.WorldGen && window.WorldGen.BIOMES) {
      const biome = window.WorldGen.BIOMES.find((b) => b.name === biomeName);
      if (biome) {
        return biome;
      }
    }

    return null;
  }

  /**
   * Check if the current biome allows NPCs
   * Returns true if biome.hasNPC is true, false otherwise
   */
  function currentBiomeHasNPC() {
    const biome = getCurrentBiome();
    if (biome && typeof biome.hasNPC === "boolean") {
      return biome.hasNPC;
    }
    // Default to true if biome not found (for non-procedural maps)
    return true;
  }

  function getNPCPool(poolMapId) {
    if (!$dataMap || typeof $dataMap !== "object") {
      debug("NPC Pool: Map data not available");
      return [];
    }

    const poolMap = $dataMap._npcPoolCache && $dataMap._npcPoolCache[poolMapId];
    if (poolMap) {
      return poolMap;
    }

    // This would require loading the map data from the database
    // For now, return empty and rely on alternative approach
    return [];
  }

  // Load map data - tries multiple approaches
  function loadMapData(mapId) {
    // If the map is currently loaded in $dataMap, return it
    if ($dataMap && $dataMap.id === mapId) {
      return $dataMap;
    }

    const mapFileName = `Map${String(mapId).padStart(3, "0")}.json`;

    // Approach 1: Try synchronous load via StorageManager (Electron/NW.js)
    try {
      if (typeof StorageManager !== "undefined" && StorageManager.fileExists) {
        const basePath = StorageManager.isLocalMode ? "data/" : "data/";
        const fullPath = basePath + mapFileName;

        if (StorageManager.fileExists(fullPath)) {
          const data = JSON.parse(StorageManager.fileRead(fullPath));
          debug(`✓ Loaded pool map ${mapId} from StorageManager`);
          return data;
        }
      }
    } catch (e) {
      debug(`StorageManager load failed for map ${mapId}: ${e.message}`);
    }

    // Approach 2: Try using fetch API (web builds)
    try {
      // Use XMLHttpRequest for synchronous loading (deprecated but works)
      // Note: This is blocking and should only be used during initialization
      const xhr = new XMLHttpRequest();
      xhr.open("GET", `data/${mapFileName}`, false); // false = synchronous
      xhr.send();

      if (xhr.status === 200) {
        const data = JSON.parse(xhr.responseText);
        debug(`✓ Loaded pool map ${mapId} from fetch API`);
        return data;
      }
    } catch (e) {
      debug(`Fetch API load failed for map ${mapId}: ${e.message}`);
    }

    // Approach 3: Check if map was already loaded into $data
    try {
      // In some RPG Maker configurations, maps are preloaded
      if (window.$dataMap && window.$dataMap.id === mapId) {
        debug(`✓ Found pool map ${mapId} in $dataMap`);
        return window.$dataMap;
      }
    } catch (e) {
      // Silently fail
    }

    return null;
  }

  function buildNPCPoolFromMap(mapData) {
    const pool = [];
    if (!mapData || !mapData.events) return pool;

    for (const event of mapData.events) {
      if (!event) continue;

      const hasAI = event.note && event.note.toLowerCase().includes("ai");
      const hasPages = event.pages && event.pages.length > 0 &&
        event.pages.some(p => p && p.list && p.list.length > 1);

      if (hasAI && hasPages) {
        pool.push({
          eventData: event,
          eventId: event.id,
        });
      }
    }

    return pool;
  }

  // ─── NPC PERSISTENCE & DISTRIBUTION SYSTEM (v3.0+) ───────────────────────────
  // Initialize NPC persistence data structure
  function initializeNPCMapData() {
    if (!$gameSystem) return null;
    if (!$gameSystem._npcMapData) {
      $gameSystem._npcMapData = {
        npcPositions: {}, // { eventName: { mapId, x, y, lastSeen } }
        mapAssignments: {}, // { mapGroupName: { mapId: [eventNames] } }
        visitedMaps: {}, // { mapGroupName: Set of visited mapIds }
        lastMigrationTime: {}, // { mapGroupName: timestamp }
        recentMaps: [], // Array of last 2 maps: [{ mapId, npcs: [{name, x, y, isAbsent, ...}] }]
      };
    }
    return $gameSystem._npcMapData;
  }

  // Get maps list from a mapgroup
  function getMapGroupMaps(mapGroupName) {
    const group = mapGroups[mapGroupName];
    return group ? group.maps || [] : [];
  }

  // Find which mapgroup a map belongs to
  function findMapGroupByMap(mapId) {
    for (const [groupName, group] of Object.entries(mapGroups)) {
      if (group.maps && group.maps.includes(mapId)) {
        return groupName;
      }
    }
    return null;
  }

  // Calculate approximate map size from map data
  function estimateMapSize(mapId) {
    // Try to get actual size from data if available
    // Default estimate: 32x28 tiles
    if ($dataMapInfos && $dataMapInfos[mapId]) {
      // Use width/height from the actual map data
      // For safety, cap between min/max realistic sizes
      return { width: 32, height: 28, area: 32 * 28 };
    }
    return { width: 32, height: 28, area: 32 * 28 };
  }


  // Save NPC positions for last 2 maps visited
  function saveNPCPositions() {
    if (!$gameSystem || !$gameSystem.npcControllers || $gameSystem.npcControllers.length === 0) return;

    const npcData = initializeNPCMapData();
    if (!npcData) return;

    const mapId = $gameMap.mapId();

    // Build snapshot of current NPCs
    const npcSnapshot = [];
    for (const controller of $gameSystem.npcControllers) {
      if (!controller.event || !controller.eventName) continue;

      // Safety check: ensure event data exists
      const eventData = controller.event.event();
      if (!eventData) continue;

      npcSnapshot.push({
        name: controller.eventName,
        x: controller.event.x,
        y: controller.event.y,
        isAbsent: controller.isAbsent || false,
        characterName: eventData.characterName,
        characterIndex: eventData.characterIndex,
      });
    }

    // Initialize recentMaps if it doesn't exist (for old save games)
    if (!npcData.recentMaps) {
      npcData.recentMaps = [];
    }

    // Remove this map from recent maps if it already exists
    npcData.recentMaps = npcData.recentMaps.filter(m => m.mapId !== mapId);

    // Add current map to the front
    npcData.recentMaps.unshift({
      mapId: mapId,
      npcs: npcSnapshot,
      timestamp: Date.now()
    });

    // Keep only last 2 maps
    if (npcData.recentMaps.length > 2) {
      npcData.recentMaps = npcData.recentMaps.slice(0, 2);
    }

    debug(`[Save] Saved ${npcSnapshot.length} NPCs for map ${mapId} (recent maps: ${npcData.recentMaps.map(m => m.mapId).join(', ')})`);
  }

  // Restore NPC data from recent maps (last 2 visited)
  function getRecentMapNPCs(mapId) {
    const npcData = initializeNPCMapData();
    if (!npcData || !npcData.recentMaps) return null;

    // Find this map in recent maps
    const recentMap = npcData.recentMaps.find(m => m.mapId === mapId);
    if (!recentMap) return null;

    debug(`[Restore] Found ${recentMap.npcs.length} saved NPCs for map ${mapId}`);
    return recentMap.npcs;
  }


  // Trigger NPC migration within a mapgroup based on time
  function triggerNPCMigration(mapGroupName) {
    const npcData = initializeNPCMapData();
    if (!npcData) return;

    const currentTime = Date.now();
    const lastMigration = npcData.lastMigrationTime[mapGroupName] || 0;
    const migrationInterval = 300000; // 5 minutes (300 seconds)

    if (currentTime - lastMigration < migrationInterval) {
      return; // Not enough time has passed
    }

    const mapIds = getMapGroupMaps(mapGroupName);
    const assignments = npcData.mapAssignments[mapGroupName];

    if (!assignments || mapIds.length < 2) return;

    debug(`\n=== NPC Migration in ${mapGroupName} ===`);

    // Get all NPCs in this mapgroup
    const allNPCs = new Set();
    for (const mapId of mapIds) {
      const npcList = assignments[mapId] || [];
      npcList.forEach((npc) => allNPCs.add(npc));
    }

    // Randomly migrate 15-25% of NPCs
    const migrateCount = Math.ceil(allNPCs.size * (0.15 + Math.random() * 0.1));
    const npcArray = Array.from(allNPCs);

    for (let i = 0; i < migrateCount && npcArray.length > 0; i++) {
      const randomIdx = Math.floor(Math.random() * npcArray.length);
      const npcName = npcArray[randomIdx];
      npcArray.splice(randomIdx, 1);

      const currentPos = npcData.npcPositions[npcName];
      if (!currentPos) continue;

      const currentMapId = currentPos.mapId;
      const otherMaps = mapIds.filter((m) => m !== currentMapId);

      if (otherMaps.length === 0) continue;

      const newMapId = randomElement(otherMaps);
      const newMapNPCCount = (assignments[newMapId] || []).length;

      // Only migrate if destination isn't at max capacity
      if (newMapNPCCount >= 8) continue;

      // Update assignments
      if (assignments[currentMapId]) {
        const idx = assignments[currentMapId].indexOf(npcName);
        if (idx > -1) {
          assignments[currentMapId].splice(idx, 1);
        }
      }

      if (!assignments[newMapId]) {
        assignments[newMapId] = [];
      }
      assignments[newMapId].push(npcName);

      // Update position
      npcData.npcPositions[npcName].mapId = newMapId;
      npcData.npcPositions[npcName].x = Math.floor(Math.random() * 20);
      npcData.npcPositions[npcName].y = Math.floor(Math.random() * 15);

      const fromMapName = getMapName(currentMapId);
      const toMapName = getMapName(newMapId);
      debug(
        `  ${npcName}: ${currentMapId} (${fromMapName}) → ${newMapId} (${toMapName})`
      );
    }

    npcData.lastMigrationTime[mapGroupName] = currentTime;
    debug(`Migrated ${migrateCount} NPCs\n`);
  }

  // Character graphics list for procedural map NPCs
  const CHARACTER_GRAPHICS = [
    "Actor1",
    "Actor1RMVX",
    "Actor2",
    "Actor2RMVX",
    "Actor3",
    "Actor3RMVX",
    "Dungeon_Monsters1",
    "Evil01",
    "Evil01Color",
    "Fantasy_Characters1",
    "Fantasy_Characters3",
    "Fantasy_Characters4",
    "FarmCharacters01RM",
    "GrayHeroes01",
    "GrayEvil01",
    "GrayHeroes02",
    "GrayNPCs01",
    "Heroes01Color",
    "NPCs01Color",
    "NPCs02Color",
    "NPCs03Color",
    "Occult_Characters",
    "School01RM",
    "School01RM-GB",
    "School01RM-Gray",
  ];

  // Skab character graphics - single sheet sprites from characters/Skab
  const SKAB_CHARACTER_GRAPHICS = [
    "Skab/!$KillerBot",
    "Skab/!$2",
    "Skab/!$3",
    "Skab/!$AirlinePilot",
    "Skab/!$AlienDargos",
    "Skab/!$AlienGrey",
    "Skab/!$AlienTrucker",
    "Skab/!$AlpineGuide",
    "Skab/!$Anarchist",
    "Skab/!$AnarchistSamurai",
    "Skab/!$11",
    "Skab/!$AndroidArchpriest",
    "Skab/!$AndroidExperiment",
    "Skab/!$14",
    "Skab/!$Archivist",
    "Skab/!$ArchivistBackpacker",
    "Skab/!$AvianCommando",
    "Skab/!$ArchivistGuard",
    "Skab/!$19",
    "Skab/!$AvianNoble",
    "Skab/!$21",
    "Skab/!$Farmer",
    "Skab/!$GoblinRecruit",
    "Skab/!$GoblinShogun",
    "Skab/!$BotSpaceman",
    "Skab/!$BotGuardian",
    "Skab/!$GnomeExplorer",
    "Skab/!$28",
    "Skab/!$Catboy",
    "Skab/!$CatCourier",
    "Skab/!$ElvenPirate",
    "Skab/!$32",
    "Skab/!$33",
    "Skab/!$VoidPerson",
    "Skab/!$Witch1",
    "Skab/!$SwordInstructor",
    "Skab/!$Samurai",
    "Skab/!$SchoolTeacher",
    "Skab/!$PirateAdventurer",
    "Skab/!$OrcSamurai",
    "Skab/!$AncientWitch",
    "Skab/!$BotSamurai",
    "Skab/!$DesertPunk",
    "Skab/!$Doctor2",
    "Skab/!$ElvenSpacer",
    "Skab/!$ExoticBard",
    "Skab/!$Fisherman",
    "Skab/!$GoblinIllusionist",
    "Skab/!$HighCommand",
    "Skab/!$LeatherDaddy",
    "Skab/!$Lich",
    "Skab/!$Madman",
    "Skab/!$Mafia",
    "Skab/!$Nurse2",
    "Skab/!$PrimaryDoctor",
    "Skab/!$WastelandParamedic"
  ];

  // Mixed pool of all character graphics
  const MIXED_CHARACTER_POOL = [...CHARACTER_GRAPHICS, ...SKAB_CHARACTER_GRAPHICS];

  // Text database IDs for name generation (from TextDatabase.js)
  const NAME_DATABASES = [
    "entomologist",
    "perifery",
    "temporal_drift",
    "petro_vessel",
    "wannabe_wizard",
    "inmate",
    "girlboss",
    "fortune_teller",
    "rapper",
    "cleaner",
    "priest",
    "guide",
    "farmer",
    "taxi",
    "blacksmith",
    "steelworker",
    "artist",
    "hypernet_worker",
    "politician",
    "elven_ambassador",
    "dungeon_explorer",
    "mailman",
    "communist_preacher",
    "shy_vampire",
    "decadent_noble",
    "goth",
    "thug",
    "scribe",
    "zombie_alien",
    "commuter",
    "fae_queen",
    "caveman",
    "fisherman",
    "semiwild_goblin",
    "botique",
    "icecream",
  ];

  /**
   * Seeded random number generator based on seed value
   * Produces consistent pseudo-random values for a given seed
   */
  function seededRandom(seed) {
    const x = Math.sin(seed) * 10000;
    return x - Math.floor(x);
  }

  /**
   * Initialize NPCs on procedural map 636
   * Finds 26 NPC events and assigns random character graphics based on seeded world coordinates and event ID
   */
  function setupProceduralMapNPCs() {
    //console.log('🔍 setupProceduralMapNPCs called');
    if (!$gameMap || !$dataMap) {
      //console.log('❌ Cannot setup procedural NPCs: Map data not available');
      return;
    }

    // Get world coordinates from variables
    const worldX = $gameVariables.value(43) || 1;
    const worldY = $gameVariables.value(44) || 1;

    // Create seed from world coordinates
    const seed = (worldX * 73856093) ^ (worldY * 19349663);

    //console.log(`[Procedural Map] World coords: (${worldX}, ${worldY}), Seed: ${seed}`);

    // Check current biome's hasNPC flag from procedural generation data
    let currentBiomeName = "Fields";
    let currentBiomeHasNPC = true;

    // Get the biome name for this procedural map location
    if (
      $gameSystem &&
      $gameSystem._procGenData &&
      $gameSystem._procGenData.currentBiome
    ) {
      currentBiomeName = $gameSystem._procGenData.currentBiome;
      //console.log(`✅ Got biome from _procGenData: "${currentBiomeName}"`);
    } else {
      //console.log(`⚠️  _procGenData.currentBiome not available, defaulting to "Fields"`);
      //console.log(`   $gameSystem exists: ${!!$gameSystem}`);
      //console.log(`   _procGenData exists: ${!!($gameSystem && $gameSystem._procGenData)}`);
    }

    // Get the biome object to check hasNPC flag
    //console.log(`   Checking for getBiomeByName in window.ProcGenUtils: ${!!window.ProcGenUtils}`);
    if (window.ProcGenUtils) {
      //console.log(`   window.ProcGenUtils keys:`, Object.keys(window.ProcGenUtils || {}));
    }

    if (window.ProcGenUtils && window.ProcGenUtils.getBiomeByName) {
      const biomeObj = window.ProcGenUtils.getBiomeByName(currentBiomeName);
      //console.log(`   Retrieved biome object:`, biomeObj);
      if (biomeObj && biomeObj.hasNPC !== undefined) {
        currentBiomeHasNPC = biomeObj.hasNPC;
        //console.log(`✅ Biome object found for "${currentBiomeName}", hasNPC: ${currentBiomeHasNPC}`);
      } else {
        //console.log(`⚠️  Biome object not found for "${currentBiomeName}" or hasNPC is undefined`);
        //console.log(`   biomeObj:`, biomeObj);
      }
    } else {
      //console.log(`⚠️  ProcGenUtils.getBiomeByName not available, keeping default hasNPC: ${currentBiomeHasNPC}`);
    }

    //console.log(`[Procedural Map] Final decision - Current biome: "${currentBiomeName}", hasNPC: ${currentBiomeHasNPC}`);

    //console.log(`✅ Biome "${currentBiomeName}" allows NPCs (hasNPC: true). Proceeding with initialization.`);

    // Find all NPC events on the map
    const npcEvents = $gameMap.events().filter((e) => {
      if (!e || !e.event()) return false;
      const name = e.event().name;
      return name.startsWith("NPC") || name.startsWith("Player");
    });

    //console.log(`🔍 Found ${npcEvents.length} NPC events on map`);

    // If no NPCs found, exit early
    if (npcEvents.length === 0) {
      //console.log(`⚠️  No NPC events found on procedural map`);
      return;
    }

    // Check if this is a City biome - cities should not cull NPCs
    const isCityBiome = currentBiomeName.toLowerCase().includes("city");
    let npcEventsToInitialize = npcEvents;

    if (!isCityBiome) {
      // Cull NPCs based on seeded random number from world coordinates
      // This ensures the same NPCs are culled at the same location every time
      // NOTE: City biomes skip culling to maintain full NPC populations
      const cullSeed = (worldX * 73856093) ^ (worldY * 19349663) ^ 0xdeadbeef; // Different seed for culling
      const cullRng = seededRandom(cullSeed);
      const cullPercentage = 0.3 + cullRng * 0.4; // Random 30-70% of NPCs will spawn
      const npcsToShow = Math.max(
        1,
        Math.ceil(npcEvents.length * cullPercentage)
      );

      //console.log(`🎲 Culling NPCs: ${npcEvents.length} total → ${npcsToShow} to show (${Math.round(cullPercentage * 100)}%)`);

      // Determine which NPCs to cull based on seeded random selection
      const npcIndices = Array.from({ length: npcEvents.length }, (_, i) => i);
      const npcsToCull = [];

      // Fisher-Yates shuffle with seeded RNG to select which NPCs to delete
      for (
        let i = npcIndices.length - 1;
        i > npcEvents.length - npcsToShow - 1;
        i--
      ) {
        const shuffleSeed =
          (worldX * 73856093) ^ (worldY * 19349663) ^ (i * 12345);
        const shuffleRng = seededRandom(shuffleSeed);
        const j = Math.floor(shuffleRng * (i + 1));

        // Swap
        [npcIndices[i], npcIndices[j]] = [npcIndices[j], npcIndices[i]];
        npcsToCull.push(npcIndices[i]);
      }

      // Delete the culled NPC events
      for (const indexToCull of npcsToCull) {
        const eventToCull = npcEvents[indexToCull];
        const eventId = eventToCull.eventId();
        $gameMap.eraseEvent(eventId);
        //console.log(`   Culled NPC event ${eventId}`);
      }

      // Filter npcEvents to only include the ones we're keeping
      npcEventsToInitialize = npcEvents.filter(
        (_, idx) => !npcsToCull.includes(idx)
      );
      //console.log(`✅ Keeping ${npcEventsToInitialize.length} NPCs for initialization`);
    } else {
      //console.log(`🏙️ City biome detected - skipping NPC culling. Keeping all ${npcEvents.length} NPCs`);
    }

    // Find all passable A1/A2/A5 tiles for NPC placement
    const passableTerrainTiles = findPassableTerrainTiles();
    let availableTiles = [...passableTerrainTiles];

    if (availableTiles.length > 0) {
      //console.log(`🗺️  Found ${availableTiles.length} passable terrain tiles for NPC placement`);

      // Fisher-Yates shuffle for random tile positions (seeded)
      for (let i = availableTiles.length - 1; i > 0; i--) {
        const shuffleSeed =
          (worldX * 73856093) ^ (worldY * 19349663) ^ (i * 54321);
        const shuffleRng = seededRandom(shuffleSeed);
        const j = Math.floor(shuffleRng * (i + 1));
        [availableTiles[i], availableTiles[j]] = [
          availableTiles[j],
          availableTiles[i],
        ];
      }
    } else {
      //console.log(`⚠️  No passable terrain tiles found for NPC placement`);
    }

    // Initialize each NPC with seeded graphics, names, AI, and position
    for (let i = 0; i < npcEventsToInitialize.length; i++) {
      const event = npcEventsToInitialize[i];
      const eventData = event.event();
      const eventId = event.eventId();

      // Randomize position to passable terrain tile if available
      if (i < availableTiles.length) {
        const tile = availableTiles[i];
        event.locate(tile.x, tile.y);
        //console.log(`   Event ${eventId}: Positioned at passable terrain tile (${tile.x}, ${tile.y})`);
      }

      // Generate deterministic character graphic and index based on seed + world coords + event ID
      const graphicSeed =
        (worldX * 73856093) ^ (worldY * 19349663) ^ (eventId * 83492791);
      const rng1 = seededRandom(graphicSeed);
      const rng2 = seededRandom(graphicSeed * 2);

      const characterName =
        MIXED_CHARACTER_POOL[Math.floor(rng1 * MIXED_CHARACTER_POOL.length)];
      const characterIndex = Math.floor(rng2 * 8); // 0-7 character indices

      // Update ALL pages with the seeded graphics
      if (eventData.pages && eventData.pages.length > 0) {
        for (const page of eventData.pages) {
          page.image = page.image || {};
          page.image.characterName = characterName;
          page.image.characterIndex = characterIndex;
        }
      }

      // Also update the main event data as fallback
      eventData.characterName = characterName;
      eventData.characterIndex = characterIndex;

      // Refresh the event to apply graphics immediately
      event.setImage(characterName, characterIndex);
      event.refresh();

      // Generate seeded name using Markov chain
      let generatedName = "NPC";
      try {
        // Use the character-based Markov name generator with actual database names
        // Select database based on seed to ensure consistency per location
        const dbSeed =
          (worldX * 73856093) ^ (worldY * 19349663) ^ (eventId * 83492791);
        const dbRng = seededRandom(dbSeed);
        const databaseId =
          NAME_DATABASES[Math.floor(dbRng * NAME_DATABASES.length)];

        if (window.generateSeededMarkovName) {
          generatedName = window.generateSeededMarkovName(
            worldX,
            worldY,
            eventId,
            databaseId,
            2,
            4,
            12
          );
          debug(
            `[Procedural Map] Generated name for Event ${eventId} from DB "${databaseId}": ${generatedName}`
          );
        } else {
          debug(
            `[Procedural Map] ⚠️  generateSeededMarkovName not available, using default name`
          );
        }
      } catch (error) {
        debug(`[Procedural Map] Error generating name: ${error.message}`);
      }

      // Update event name with generated name
      eventData.name = generatedName;

      // Initialize AI controller with the new name
      const controller = new NPCController(generatedName);
      controller.lastUpdateTime = performance.now();
      controller.nextMoveTime = performance.now();
      controller.stateEndTime = performance.now();

      // Add controller to system
      if (!$gameSystem.npcControllers) {
        $gameSystem.npcControllers = [];
      }
      $gameSystem.npcControllers.push(controller);

      // Let the NPC decide their initial behavior based on their AI notes
      controller.decideNextGoal();

      debug(
        `[Procedural Map] Event ${eventId}: ${generatedName} → ${characterName}:${characterIndex}`
      );
    }

    //console.log(`[Procedural Map] ✓ Initialized ${npcEventsToInitialize.length} NPCs (culled from ${npcEvents.length} total) with seeded graphics and names`);
  }

  function replacePlayerEventsWithNPCs(mapGroup, seed = null) {
    if (!mapGroup || !$gameMap || !$gameMap.events) {
      debug(`❌ replacePlayerEventsWithNPCs: Missing mapGroup or $gameMap`);
      return;
    }

    // Skip if this is a treasure room map
    if (isTreasureRoom($gameMap.mapId())) {
      debug(`Skipping NPC spawn in treasure room map ${$gameMap.mapId()}`);
      return;
    }

    const poolMapId = mapGroup.id;
    const currentMapId = $gameMap.mapId();
    let groupName =
      Object.keys(mapGroups).find((k) => mapGroups[k] === mapGroup) ||
      "Unknown";

    // Generate seed if not provided (use player position)
    if (!seed) {
      seed = createSeed(currentMapId, $gamePlayer.x, $gamePlayer.y);
    }

    debug(
      `=== Attempting to load NPC pool from MapGroup "${groupName}" (Pool Map: ${poolMapId}) ===`
    );
    debug(`Current map ID: ${currentMapId}, MapGroup ID: ${mapGroup.id}`);
    debug(`Seed for NPC selection: ${seed}`);

    // 1. Load Pool Data
    debug(`Loading pool map ${poolMapId}...`);
    let poolMapData = null;
    if ($dataMap && $dataMap.id === poolMapId) {
      debug(`✓ Pool map already loaded in $dataMap`);
      poolMapData = $dataMap;
    } else {
      debug(`Pool map not in $dataMap, attempting to load from storage...`);
      poolMapData = loadMapData(poolMapId);
      if (!poolMapData) {
        debug(`❌ Failed to load pool map ${poolMapId} from storage`);
        debug(`   Tried map ID: ${poolMapId}`);
        debug(`   $dataMapInfos available: ${!!$dataMapInfos}`);
        return;
      }
      debug(`✓ Successfully loaded pool map from storage`);
    }

    // 2. Build Pool
    debug(`Building NPC pool from pool map...`);
    const npcPool = buildNPCPoolFromMap(poolMapData);
    debug(`Pool contains ${npcPool.length} NPCs with <AI> tag`);
    if (npcPool.length === 0) {
      debug(`❌ No NPCs (with <AI> tag) available in pool map ${poolMapId}`);
      return;
    }

    // Simple random NPC selection - no complex distribution needed

    // 3. Find NPC Placeholder Events
    // Look for events that can be used as placeholders for NPCs
    // First try Player1-Player8, then look for generic "NPC" events
    const allPlaceholders = [];

    // Try standard Player placeholders first
    for (let i = 1; i <= 8; i++) {
      const playerEvent = $gameMap
        .events()
        .find((e) => e && e.event().name === `Player${i}`);
      if (playerEvent) {
        allPlaceholders.push({
          event: playerEvent,
          originalX: playerEvent.x,
          originalY: playerEvent.y,
        });
      }
    }

    // If no Player events, look for events named "NPC" or similar
    if (allPlaceholders.length === 0) {
      const npcLikeEvents = $gameMap.events().filter((e) => {
        if (!e || !e.event()) return false;
        const name = e.event().name;
        return name.startsWith("NPC") || name.startsWith("Placeholder");
      });

      for (const event of npcLikeEvents) {
        allPlaceholders.push({
          event: event,
          originalX: event.x,
          originalY: event.y,
        });
      }
    }

    if (allPlaceholders.length === 0) {
      debug(`⚠️  No NPC placeholder events found (Player1-8 or NPC*)`);
      return;
    }

    // 4. Check if this map was recently visited and restore NPCs
    const isHouse = isHouseMap(currentMapId);
    const recentNPCs = getRecentMapNPCs(currentMapId);
    let selectedNPCs = [];
    let actualCount = 0;
    let restoringFromRecent = false;

    if (recentNPCs && recentNPCs.length > 0) {
      // Restore NPCs from recent visit
      restoringFromRecent = true;
      actualCount = Math.min(recentNPCs.length, allPlaceholders.length);

      // Find matching NPCs from pool
      for (let i = 0; i < actualCount; i++) {
        const recentNPC = recentNPCs[i];
        const npcData = npcPool.find(n => n.eventData.name === recentNPC.name);
        if (npcData) {
          selectedNPCs.push({
            ...npcData,
            savedPosition: { x: recentNPC.x, y: recentNPC.y },
            isAbsent: recentNPC.isAbsent
          });
        }
      }

      const mapName = getMapName(currentMapId);
      debug(`[Restore] Restoring ${actualCount} NPCs from recent visit to map ${currentMapId} (${mapName})`);
    } else {
      // No recent data - spawn new random NPCs
      const MAX_NPCS = getNPCSpawnLimit(); // Dynamic based on context (3 for houses, 8 for regular)
      const mapArea = $gameMap.width() * $gameMap.height();
      const DENSITY_FACTOR = 120; // 1 NPC per 120 tiles

      // Calculate max NPCs based on map size
      let maxNPCsForMap = Math.floor(mapArea / DENSITY_FACTOR);
      maxNPCsForMap = Math.min(maxNPCsForMap, MAX_NPCS);

      // Random number from 0 to max (can spawn 0 NPCs)
      const randomNPCCount = Math.floor(Math.random() * (maxNPCsForMap + 1));

      // Limit by available placeholders and NPCs in pool
      actualCount = Math.min(
        randomNPCCount,
        allPlaceholders.length,
        npcPool.length
      );

      // Randomly select NPCs from pool
      const poolCopy = [...npcPool];

      for (let i = 0; i < actualCount; i++) {
        const randomIndex = Math.floor(Math.random() * poolCopy.length);
        selectedNPCs.push(poolCopy[randomIndex]);
        poolCopy.splice(randomIndex, 1); // Remove to avoid duplicates
      }

      const mapName = getMapName(currentMapId);
      debug(
        `Map: ${currentMapId} (${mapName}) | Area: ${mapArea} tiles | Max NPCs: ${maxNPCsForMap} | Random Count: ${randomNPCCount} | Spawning: ${actualCount}`
      );
      if (actualCount > 0) {
        const npcNames = selectedNPCs.map((npc) => npc.eventData.name).join(", ");
        debug(`Selected NPCs: ${npcNames}`);
      } else {
        debug(`No NPCs will spawn on this map`);
      }
    }

    // 5. Prepare Tiles (A1/A2/A5 only) - avoid treasure rooms
    const passableTerrainTiles = findPassableTerrainTiles();

    // Filter out tiles in treasure room areas if in a multifloor building
    const filteredTiles = passableTerrainTiles.filter((tile) => {
      // Don't spawn in regions marked as treasure rooms (region 103 is avoidance zone)
      if ($gameMap.regionId(tile.x, tile.y) === ZONE_AVOID) return false;
      return true;
    });

    const shuffledTiles = [...filteredTiles];
    for (let i = shuffledTiles.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledTiles[i], shuffledTiles[j]] = [
        shuffledTiles[j],
        shuffledTiles[i],
      ];
    }

    // If Spawner events exist on the map, restrict spawn tiles to near them only
    const spawnerEvents = $gameMap.events().filter(ev => {
      const data = $dataMap.events[ev._eventId];
      return data && data.name === "Spawner";
    });
    if (spawnerEvents.length > 0) {
      const SPAWNER_RADIUS = 8;
      const nearPool = shuffledTiles.filter(tile =>
        spawnerEvents.some(ev =>
          Math.abs(ev.x - tile.x) + Math.abs(ev.y - tile.y) <= SPAWNER_RADIUS
        )
      );
      if (nearPool.length > 0) {
        shuffledTiles.length = 0;
        nearPool.forEach(t => shuffledTiles.push(t));
        debug(`Spawner restriction active: ${spawnerEvents.length} spawner(s), ${nearPool.length} near tiles`);
      }
    }

    // Shuffle Placeholders so we don't always fill in order
    for (let i = allPlaceholders.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [allPlaceholders[i], allPlaceholders[j]] = [
        allPlaceholders[j],
        allPlaceholders[i],
      ];
    }

    const activePlaceholders = allPlaceholders.slice(0, actualCount);
    const unusedPlaceholders = allPlaceholders.slice(actualCount);

    // Get current game hour for time-based absence logic
    const gameHour = getGameHour();
    const nightTime = isNightTime(gameHour);

    debug(`Current game hour: ${gameHour} (${nightTime ? "NIGHT" : "DAY"})`);

    // 6. Spawn Active NPCs with Position Restoration
    for (let i = 0; i < activePlaceholders.length; i++) {
      const placeholder = activePlaceholders[i];
      const targetEvent = placeholder.event;
      const npcDataItem = selectedNPCs[i];

      if (!targetEvent) continue;
      if (!npcDataItem || !npcDataItem.eventData) {
        targetEvent.erase();
        continue;
      }

      // --- DATA TRANSPLANT ---
      const originalData = targetEvent.event();
      const npcOriginalData = npcDataItem.eventData;

      originalData.pages = JSON.parse(JSON.stringify(npcOriginalData.pages));
      originalData.name = npcOriginalData.name || `NPC${i + 1}`;
      originalData.characterName = npcOriginalData.characterName;
      originalData.characterIndex = npcOriginalData.characterIndex;
      originalData.note = npcOriginalData.note;

      // Strip all pool-map-specific conditions so findProperPageIndex() always
      // finds an active page on any map. selfSwitchValid must also be stripped:
      // self-switch keys are [mapId, eventId, ch] — a switch set on the pool map
      // event will not match the transplanted event's [newMapId, newEventId].
      // Keeping it causes the dialog page to never activate here.
      for (const page of originalData.pages) {
        if (!page.conditions) continue;
        page.conditions.switch1Valid = false;
        page.conditions.switch2Valid = false;
        page.conditions.variableValid = false;
        page.conditions.actorValid = false;
        page.conditions.itemValid = false;
        page.conditions.selfSwitchValid = false;
      }

      // Propagate character image to any page that has an empty image.
      // Pool NPCs often store the visual on page 0 and leave dialog pages
      // (previously self-switch gated) with a blank characterName.  Now that
      // all conditions are stripped the highest-index page wins; if its image
      // is empty the NPC becomes invisible on spawn.
      const referenceImage = originalData.pages
        .map(p => p && p.image)
        .find(img => img && img.characterName);
      if (referenceImage) {
        for (const page of originalData.pages) {
          if (page && page.image && !page.image.characterName) {
            page.image.characterName = referenceImage.characterName;
            page.image.characterIndex = referenceImage.characterIndex;
          }
        }
      }

      // --- VISUAL REFRESH ---
      targetEvent.refresh();
      targetEvent.setupPage();

      // If no page is active after transplant, the event is uninteractable — skip it
      if (!targetEvent.page()) {
        targetEvent.erase();
        debug(`⚠️ ${originalData.name} has no active page after transplant, erasing`);
        continue;
      }

      // --- POSITIONING (RESTORE OR RANDOM) ---
      // Use saved position if restoring from recent visit, otherwise random
      if (npcDataItem.savedPosition) {
        targetEvent.locate(npcDataItem.savedPosition.x, npcDataItem.savedPosition.y);
        debug(`${originalData.name} restored to saved position (${npcDataItem.savedPosition.x}, ${npcDataItem.savedPosition.y})`);
      } else if (i < shuffledTiles.length) {
        const tile = shuffledTiles[i];
        targetEvent.locate(tile.x, tile.y);
        debug(`${originalData.name} spawned at random tile (${tile.x}, ${tile.y})`);
      }

      // --- BRAIN INJECTION (ONLY IF EVENT HAS <AI> TAG) ---
      // Check if this event has <AI> in its notes
      const hasAI = originalData.note && originalData.note.includes('<AI>');

      if (hasAI) {
        const controller = new NPCController(originalData.name);
        targetEvent.setMoveSpeed(controller.moveSpeed);
        targetEvent.setMoveFrequency(5);

        controller.lastUpdateTime = performance.now();
        controller.nextMoveTime = performance.now();
        controller.stateEndTime = performance.now();

        // TIME-BASED ABSENCE LOGIC
        const timeOfDay = nightTime ? "NIGHT" : "DAY";

        // Restore isAbsent state if this NPC was restored from recent visit
        if (npcDataItem.isAbsent !== undefined) {
          controller.isAbsent = npcDataItem.isAbsent;
          debug(`   [${timeOfDay}] ${originalData.name} - Restored absence state: ${controller.isAbsent ? "Absent" : "Present"}`);
        } else if (isHouse) {
          // HOUSES: Use global home probability (NPCs more present at night)
          const globalHomeProbability = getHouseHomeProbability();
          controller.isAbsent = Math.random() >= globalHomeProbability; // Inverse: if random >= home prob, they're absent
          const homeChance = (globalHomeProbability * 100).toFixed(1);
          debug(
            `   [${timeOfDay}] ${originalData.name} - ${
              controller.isAbsent ? "Absent" : "Home"
            } in house (${homeChance}% home chance)`
          );

          // If absent, move to border and hide
          if (controller.isAbsent) {
            // Use valid border tiles (A1/A2/A5 only) for houses
            const borderTiles = isHouse
              ? getValidBorderTiles()
              : getBorderTiles();
            if (borderTiles.length > 0) {
              const hidingSpot = randomElement(borderTiles);
              targetEvent.locate(hidingSpot.x, hidingSpot.y);
            }
            targetEvent.setOpacity(0);
            targetEvent.setThrough(true);
            debug(`   ${originalData.name} - Set to ABSENT mode (opacity=0, through=true)`);
          } else {
            // Ensure present NPCs are visible and interactable
            targetEvent.setOpacity(255);
            targetEvent.setThrough(false);
            debug(`   ${originalData.name} - Set to PRESENT mode (opacity=255, through=false, interactable)`);
          }
        } else {
          // REGULAR MAPS: Use outside presence probability (NPCs rarer at night)
          const outsidePresence = getOutsidePresenceProbability();
          controller.isAbsent = Math.random() >= outsidePresence; // Inverse: if random >= presence prob, they're absent
          const outsideChance = (outsidePresence * 100).toFixed(1);
          debug(
            `   [${timeOfDay}] ${originalData.name} - ${
              controller.isAbsent ? "Indoors/Absent" : "Outside"
            } (${outsideChance}% presence chance)`
          );

          // If absent, move to border and hide
          if (controller.isAbsent) {
            const borderTiles = getBorderTiles();
            if (borderTiles.length > 0) {
              const hidingSpot = randomElement(borderTiles);
              targetEvent.locate(hidingSpot.x, hidingSpot.y);
            }
            targetEvent.setOpacity(0);
            targetEvent.setThrough(true);
            debug(`   ${originalData.name} - Set to ABSENT mode (opacity=0, through=true)`);
          } else {
            // Ensure present NPCs are visible and interactable
            targetEvent.setOpacity(255);
            targetEvent.setThrough(false);
            debug(`   ${originalData.name} - Set to PRESENT mode (opacity=255, through=false, interactable)`);
          }
        }

        if (!$gameSystem.npcControllers) $gameSystem.npcControllers = [];
        $gameSystem.npcControllers.push(controller);
        controller.decideNextGoal();

        const mapName = getMapName(currentMapId);
        debug(
          `✓ Spawned ${originalData.name} with AI controller on map ${currentMapId} (${mapName})`
        );

        // Debug interaction properties
        const currentPage = targetEvent.page();
        if (currentPage) {
          debug(`   Interaction: trigger=${currentPage.trigger}, priority=${currentPage.priorityType}, through=${targetEvent._through}`);
        }
      } else {
        // NPCs without AI should also be interactable
        targetEvent.setOpacity(255);
        targetEvent.setThrough(false);

        const mapName = getMapName(currentMapId);
        debug(
          `✓ Spawned ${originalData.name} (no AI controller) on map ${currentMapId} (${mapName})`
        );

        // Debug interaction properties
        const currentPage = targetEvent.page();
        if (currentPage) {
          debug(`   Interaction: trigger=${currentPage.trigger}, priority=${currentPage.priorityType}, through=${targetEvent._through}`);
        } else {
          debug(`   ⚠️ WARNING: No active event page! NPC will not be interactable.`);
        }
      }
    }

    // 7. Clean up Unused Placeholders
    for (const unused of unusedPlaceholders) {
      unused.event.erase();
    }
  }

  function distance(a, b) {
    return Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
  }

  function euclideanDistance(a, b) {
    const dx = a.x - b.x;
    const dy = a.y - b.y;
    return Math.sqrt(dx * dx + dy * dy);
  }

  function randomElement(array) {
    return array[Math.floor(Math.random() * array.length)];
  }
  // ─── Helper functions ──────────────────────────────────────────────────────────────
  function isExitEvent(name) {
    return name.startsWith("House") ||
           name.startsWith("Transfer") ||
           name.startsWith("Door (");
  }

  function isValidTileType(x, y) {
    const tileId = $gameMap.tileId(x, y, 0);
    return (tileId >= 1536 && tileId < 1664) ||  // A5
           (tileId >= 2048 && tileId < 2816) ||  // A1
           (tileId >= 2816 && tileId < 4352);    // A2
  }

  // onlyValid = true restricts to A1/A2/A5 tiles (used for houses)
  function getBorderTiles(onlyValid = false) {
    const tiles = [];
    const w = $gameMap.width();
    const h = $gameMap.height();

    for (let x = 0; x < w; x++) {
      if ($gameMap.isPassable(x, 0, 2) && (!onlyValid || isValidTileType(x, 0)))
        tiles.push({ x, y: 0 });
      if ($gameMap.isPassable(x, h - 1, 8) && (!onlyValid || isValidTileType(x, h - 1)))
        tiles.push({ x, y: h - 1 });
    }
    for (let y = 0; y < h; y++) {
      if ($gameMap.isPassable(0, y, 6) && (!onlyValid || isValidTileType(0, y)))
        tiles.push({ x: 0, y });
      if ($gameMap.isPassable(w - 1, y, 4) && (!onlyValid || isValidTileType(w - 1, y)))
        tiles.push({ x: w - 1, y });
    }
    return tiles;
  }

  function getValidBorderTiles() { return getBorderTiles(true); }

  function randBetween(min, max) {
    return min + Math.random() * (max - min);
  }

  function createSeed(mapId, x, y) {
    return mapId * 1000000 + x * 1000 + y;
  }

  function getSeededRandomFromArray(array, seed) {
    if (array.length === 0) return null;
    const index = Math.floor(seededRandom(seed) * array.length);
    return array[index];
  }

  function getSeededRandomInt(min, max, seed) {
    return Math.floor(seededRandom(seed) * (max - min + 1)) + min;
  }

  // Get current time of day
  function getGameHour() {
    if (!$gameVariables) return 12; // Default to noon if no variable system
    return $gameVariables.value(gameHourVariable) || 0;
  }

  function isNightTime(hour) {
    // Night: from nightStartHour (e.g., 23:00) to nightEndHour (e.g., 6:00)
    if (nightStartHour > nightEndHour) {
      // Normal case: night wraps around midnight (e.g., 23 to 6)
      return hour >= nightStartHour || hour < nightEndHour;
    } else {
      // Edge case: night is within same day (shouldn't happen normally)
      return hour >= nightStartHour && hour < nightEndHour;
    }
  }

  function isDayTime(hour) {
    return !isNightTime(hour);
  }
  // Helper function to find all passable tiles with terrain tags 1, 2, 5, or 7
  // Helper function to find all passable tiles that are strictly A1, A2, or A5
  function findPassableTerrainTiles() {
    const passableTiles = [];
    const mapWidth = $gameMap.width();
    const mapHeight = $gameMap.height();

    for (let x = 0; x < mapWidth; x++) {
      for (let y = 0; y < mapHeight; y++) {
        // 1. Check Basic Passability (Collision)
        // Must be passable in at least one direction
        const isPassable =
          $gameMap.isPassable(x, y, 2) ||
          $gameMap.isPassable(x, y, 4) ||
          $gameMap.isPassable(x, y, 6) ||
          $gameMap.isPassable(x, y, 8);

        if (!isPassable) continue;

        // 2. Check for Region Blocks (Region 10 is blocking)
        if ($gameMap.regionId(x, y) === 10) continue;
        if ($gameMap.regionId(x, y) === ZONE_AVOID) continue;

        // 3. Check for existing Events (Prevent stacking)
        const eventsHere = $gameMap.eventsXy(x, y);
        if (eventsHere.length > 0) continue;

        // 4. Check Tile Type (A1, A2, or A5)
        // We check Layer 0 (Z=0) which is typically the ground layer
        const tileId = $gameMap.tileId(x, y, 0);

        // Tile ID Ranges for RPG Maker MV/MZ:
        // A5: 1536 - 1663
        // A1: 2048 - 2815
        // A2: 2816 - 4351

        const isA5 = tileId >= 1536 && tileId < 1664;
        const isA1 = tileId >= 2048 && tileId < 2816;
        const isA2 = tileId >= 2816 && tileId < 4352;

        if (isA1 || isA2 || isA5) {
          passableTiles.push({ x: x, y: y });
        }
      }
    }

    return passableTiles;
  }

  function hasLineOfSight(x1, y1, x2, y2) {
    const dx = Math.abs(x2 - x1);
    const dy = Math.abs(y2 - y1);
    const sx = x1 < x2 ? 1 : -1;
    const sy = y1 < y2 ? 1 : -1;
    let err = dx - dy;
    let x = x1;
    let y = y1;

    while (x !== x2 || y !== y2) {
      if (!$gameMap.isPassable(x, y, 2)) return false;

      const e2 = 2 * err;
      if (e2 > -dy) {
        err -= dy;
        x += sx;
      }
      if (e2 < dx) {
        err += dx;
        y += sy;
      }
    }
    return true;
  }

  // Enhanced A* Pathfinding
  class Pathfinder {
    constructor(character) {
      this.character = character;
    }

    isPassable(x, y, d) {
      if ($gameMap.regionId(x, y) === 5) return true;
      if ($gameMap.regionId(x, y) === 10) return false;
      if ($gameMap.regionId(x, y) === ZONE_AVOID) return false;

      const events = $gameMap.eventsXyNt(x, y);
      for (const event of events) {
        if (event && !event.isThrough() && event !== this.character) {
          // Check if this is a door event - if so, ignore it (consider it passable)
          if (event.event().name.startsWith("door_")) {
            continue; // Skip this event, don't block movement
          }
          return false;
        }
      }

      if (d) {
        return this.character.canPass(x, y, d);
      }
      return (
        $gameMap.isPassable(x, y, 2) ||
        $gameMap.isPassable(x, y, 4) ||
        $gameMap.isPassable(x, y, 6) ||
        $gameMap.isPassable(x, y, 8)
      );
    }

    findPath(
      startX,
      startY,
      goalX,
      goalY,
      avoidEnemies = true,
      avoidNPCs = true
    ) {
      const openSet = [];
      const closedSet = new Set();
      const cameFrom = new Map();
      const gScore = new Map();
      const fScore = new Map();

      const start = `${startX},${startY}`;
      const goal = `${goalX},${goalY}`;

      openSet.push(start);
      gScore.set(start, 0);
      fScore.set(
        start,
        distance({ x: startX, y: startY }, { x: goalX, y: goalY })
      );

      let iterations = 0;
      const maxIterations = 500;

      while (openSet.length > 0 && iterations < maxIterations) {
        iterations++;
        openSet.sort(
          (a, b) => (fScore.get(a) || Infinity) - (fScore.get(b) || Infinity)
        );
        const current = openSet.shift();

        if (current === goal) {
          return this.reconstructPath(cameFrom, current);
        }

        closedSet.add(current);
        const [x, y] = current.split(",").map(Number);

        const neighbors = [
          { x: x, y: y - 1, dir: 8 },
          { x: x, y: y + 1, dir: 2 },
          { x: x - 1, y, dir: 4 },
          { x: x + 1, y, dir: 6 },
        ];

        for (const neighbor of neighbors) {
          const nx = neighbor.x;
          const ny = neighbor.y;
          const nKey = `${nx},${ny}`;

          if (!$gameMap.isValid(nx, ny) || closedSet.has(nKey)) {
            continue;
          }

          if (!this.character.canPass(x, y, neighbor.dir)) {
            continue;
          }

          if (!this.isPassable(nx, ny)) {
            continue;
          }

          // Avoid enemies if requested
          if (avoidEnemies) {
            const enemyNearby = $gameMap.events().some((event) => {
              if (!event || !event.event().name.startsWith("Enemy"))
                return false;
              return distance({ x: nx, y: ny }, { x: event.x, y: event.y }) < 3;
            });
            if (enemyNearby) continue;
          }

          // Avoid other NPCs if requested
          if (avoidNPCs && $gameSystem.npcControllers) {
            const npcNearby = $gameSystem.npcControllers.some((controller) => {
              if (!controller.event || controller.event === this.character)
                return false;
              return controller.event.x === nx && controller.event.y === ny;
            });
            if (npcNearby) continue;

            // Also check for door events and allow passage through them
            const eventsAtPosition = $gameMap.eventsXyNt(nx, ny);
            const blockingEvent = eventsAtPosition.some((event) => {
              if (!event || event === this.character) return false;
              // Don't consider door events as blocking
              if (event.event().name.startsWith("door_")) return false;
              return !event.isThrough();
            });
            if (blockingEvent) continue;
          }

          const tentativeGScore = (gScore.get(current) || 0) + 1;

          if (!openSet.includes(nKey)) {
            openSet.push(nKey);
          } else if (tentativeGScore >= (gScore.get(nKey) || Infinity)) {
            continue;
          }

          cameFrom.set(nKey, { pos: current, dir: neighbor.dir });
          gScore.set(nKey, tentativeGScore);
          fScore.set(
            nKey,
            tentativeGScore + distance({ x: nx, y: ny }, { x: goalX, y: goalY })
          );
        }
      }

      return null;
    }

    reconstructPath(cameFrom, current) {
      const path = [];
      while (cameFrom.has(current)) {
        const node = cameFrom.get(current);
        path.unshift(node.dir);
        current = node.pos;
      }
      return path;
    }
  }

  // Enhanced NPC Controller
  class NPCController {
    constructor(eventName) {
      this.eventName = eventName;
      this.event = this.findEventByName(eventName);
      this.eventId = this.event ? this.event.eventId() : null;
      this.pathfinder = new Pathfinder(this.event);

      // State management
      this.state = "idle";
      this.target = null;
      this.path = [];
      this.isAbsent = false;
      this.interactionPartner = null;

      // Time-based movement
      this.lastUpdateTime = performance.now();
      this.nextMoveTime = performance.now() + randBetween(2000, 5000);
      this.stateEndTime = performance.now() + randBetween(3000, 6000);

      // Behavior properties
      this.moveSpeed = 3;
      this.originalThrough = false;
      this.currentGoal = null;
      this.goalPriority = 0;

      // Player awareness
      this.playerAware = false;
      this.lastPlayerReaction = 0;

      // Flocking properties
      this.velocity = { x: 0, y: 0 };
      this.desiredSeparation = 1.5;
      this.neighborDistance = 3;
      this.maxForce = 0.05;
      this.maxSpeed = 1;
    }

    findEventByName(name) {
      return $gameMap
        .events()
        .find((e) => e && e.event() && e.event().name === name);
    }

    refreshEvent() {
      this.event = this.findEventByName(this.eventName);
      this.eventId = this.event ? this.event.eventId() : null;
      if (this.event) {
        this.pathfinder = new Pathfinder(this.event);
      }
    }

    update() {
      const currentTime = performance.now();
      const deltaTime = currentTime - this.lastUpdateTime;
      this.lastUpdateTime = currentTime;

      if (!this.event || this.isAbsent) {
        this.handleAbsence(currentTime);
        return;
      }

      // Check if the player is interacting with this specific NPC event.
      if (
        $gameMap.isEventRunning() &&
        $gameMap._interpreter.eventId() === this.eventId
      ) {
        // If interaction just started, change state and stop movement.
        if (this.state !== "talkingToPlayer") {
          this.state = "talkingToPlayer";
          this.path = []; // Clear any existing path
          debug(`NPC ${this.eventName} is now talking to the player.`);
        }
        // Continuously face the player during interaction.
        this.turnTowardCharacter($gamePlayer);
        return; // Pause all other autonomous behaviors.
      }

      // If the conversation has just ended, decide what to do next.
      if (this.state === "talkingToPlayer") {
        debug(`NPC ${this.eventName} finished talking to the player.`);
        this.decideNextGoal();
        // The decideNextGoal function will set a new state, so we can continue to the switch.
      }

      if (this.checkForExit()) {
        return;
      }
      // Check player awareness
      this.updatePlayerAwareness(currentTime);

      // Update based on state
      switch (this.state) {
        case "idle":
          this.updateIdle(currentTime);
          break;
        case "wandering":
          this.updateWandering(currentTime);
          break;
        case "goingToZone":
          this.updateGoingToZone(currentTime);
          break;
        case "inZone":
          this.updateInZone(currentTime);
          break;
        case "interacting":
          this.updateInteracting(currentTime);
          break;
        case "resting":
          this.updateResting(currentTime);
          break;
        case "shopping":
          this.updateShopping(currentTime);
          break;
        case "socializing":
          this.updateSocializing(currentTime);
          break;
        case "exiting":
          this.updateExiting(currentTime);
          break;
      }

      // Apply flocking if enabled and wandering
      if (flockingEnabled && this.state === "wandering") {
        const flockDir = this.applyFlocking();
        if (flockDir && this.event && !this.event.isMoving()) {
          this.event.moveStraight(flockDir);
        }
      }
    }

    handleAbsence(currentTime) {
      if (Math.random() < spawnChance * 0.016) {
        // Convert to per-frame chance
        this.spawn();
      }
    }

    spawn() {
      // Use valid border tiles (A1/A2/A5 only) for houses, regular border tiles for other maps
      const isInHouse = isHouseMap($gameMap.mapId());
      const spawnPoints = isInHouse ? getValidBorderTiles() : getBorderTiles();
      if (!spawnPoints.length) return;

      const pt = randomElement(spawnPoints);
      this.refreshEvent();

      if (this.event) {
        // Restore character graphic if it was saved
        if (this._savedCharacterName !== undefined) {
          this.event.setImage(
            this._savedCharacterName,
            this._savedCharacterIndex
          );
        }

        // Restore movement type if it was saved
        if (this._savedMoveType !== undefined) {
          this.event._moveType = this._savedMoveType;
        }

        // Restore normal event settings
        this.event.setThrough(false);
        this.event.locate(pt.x, pt.y);
        this.event.setOpacity(0);
        this.event.fadeIn();
        this.isAbsent = false;
        this.decideNextGoal();
        debug(
          `NPC ${this.eventName} spawned at border tile (${pt.x}, ${pt.y})`
        );
      }
    }
    updatePlayerAwareness(currentTime) {
      if (!this.event) return;

      const playerDist = distance(
        { x: this.event.x, y: this.event.y },
        { x: $gamePlayer.x, y: $gamePlayer.y }
      );

      const wasAware = this.playerAware;
      // shrink awareness radius to half and only if very close
      this.playerAware = playerDist <= playerAwarenessRange * 0.5;

      // React far less often: 20 seconds cooldown instead of 5
      const reactionCooldown = 20000;

      // Only 25% chance to actually react when the conditions hit
      const shouldReact = Math.random() < 0.25;

      if (
        this.playerAware &&
        !wasAware &&
        currentTime - this.lastPlayerReaction > reactionCooldown &&
        shouldReact
      ) {
        this.lastPlayerReaction = currentTime;
        this.reactToPlayer();
      }
    }

    reactToPlayer() {
      if (!this.event) return;

      const reactions = [
        () => {
          // Wave
          $gameTemp.requestBalloon(this.event, 1);
          this.turnTowardCharacter($gamePlayer);
        },
        () => {
          // Exclamation
          $gameTemp.requestBalloon(this.event, 11);
          this.turnTowardCharacter($gamePlayer);
        },
        () => {
          // Heart
          $gameTemp.requestBalloon(this.event, 4);
        },
        () => {
          // Question
          $gameTemp.requestBalloon(this.event, 3);
        },
      ];

      randomElement(reactions)();
      debug(`NPC ${this.eventName} reacted to player`);
    }

    updateIdle(currentTime) {
      if (!this.event) return;

      if (currentTime >= this.nextMoveTime) {
        this.decideNextGoal();
      }

      // Occasionally turn
      if (Math.random() < 0.02) {
        this.event.setDirection(2 + Math.floor(Math.random() * 4) * 2);
      }
    }

    updateWandering(currentTime) {
      if (!this.event) return;

      if (currentTime >= this.stateEndTime) {
        this.decideNextGoal();
        return;
      }

      if (!this.event.isMoving() && currentTime >= this.nextMoveTime) {
        // Check for zone tiles nearby
        const nearbyZone = this.checkNearbyZones();
        if (nearbyZone && Math.random() < 0.3) {
          this.setGoal(nearbyZone.type, nearbyZone);
          return;
        }

        // Wander with purpose
        const dir = this.getSmartWanderDirection();
        if (dir && this.event.canPass(this.event.x, this.event.y, dir)) {
          this.event.moveStraight(dir);
        }

        this.nextMoveTime = currentTime + randBetween(1000, 3000);
      }
    }

    updateGoingToZone(currentTime) {
      if (!this.event) return;

      if (!this.target || currentTime >= this.stateEndTime) {
        this.decideNextGoal();
        return;
      }

      if (this.path.length === 0) {
        // Reached zone
        this.enterZone();
        return;
      }

      if (!this.event.isMoving()) {
        const dir = this.path.shift();
        if (dir && this.event.canPass(this.event.x, this.event.y, dir)) {
          this.event.moveStraight(dir);
        } else {
          // Recalculate path
          this.calculatePathToTarget();
        }
      }
    }

    updateInZone(currentTime) {
      if (!this.event) return;

      const regionId = $gameMap.regionId(this.event.x, this.event.y);
      if ([ZONE_BENCH, ZONE_MARKET].includes(regionId)) {
        const dirs = [2, 4, 6, 8]; // down, left, right, up
        for (const dir of dirs) {
          const nx = $gameMap.roundXWithDirection(this.event.x, dir);
          const ny = $gameMap.roundYWithDirection(this.event.y, dir);
          if (
            $gameMap.regionId(nx, ny) === regionId &&
            $gameMap.isCounter(nx, ny)
          ) {
            this.event.setDirection(dir);
            return; // we’ve re‑faced, so bail out
          }
        }
      }
      switch (regionId) {
        case ZONE_BENCH:
          this.updateResting(currentTime);
          break;
        case ZONE_SOCIAL:
          this.updateSocializing(currentTime);
          break;
        case ZONE_MARKET:
          this.updateShopping(currentTime);
          break;
        default:
          if (currentTime >= this.stateEndTime) {
            this.decideNextGoal();
          }
      }
    }

    updateResting(currentTime) {
      if (!this.event) return;

      if (currentTime >= this.stateEndTime) {
        if (Math.random() < EXIT_CHANCE_AFTER_ACTIVITY) {
          this.startExiting();
        } else {
          this.decideNextGoal();
        }
      } else if (Math.random() < 0.01) {
        $gameTemp.requestBalloon(this.event, 10);
      }
    }

    updateShopping(currentTime) {
      if (!this.event) return;

      if (currentTime >= this.stateEndTime) {
        if (Math.random() < EXIT_CHANCE_AFTER_ACTIVITY) {
          this.startExiting();
        } else {
          this.decideNextGoal();
        }
        return;
      }

      // Browse around market zone
      if (!this.event.isMoving() && Math.random() < 0.05) {
        const dir = 2 + Math.floor(Math.random() * 4) * 2;
        const newX = $gameMap.roundXWithDirection(this.event.x, dir);
        const newY = $gameMap.roundYWithDirection(this.event.y, dir);

        // Stay in market zone
        if ($gameMap.regionId(newX, newY) === ZONE_MARKET) {
          this.event.moveStraight(dir);
        }
      }

      // Show shopping reactions
      if (Math.random() < 0.02) {
        const balloons = [1, 3, 4, 7]; // Happy, question, heart, music
        $gameTemp.requestBalloon(this.event, randomElement(balloons));
      }
    }

    updateSocializing(currentTime) {
      if (!this.event) return;

      if (currentTime >= this.stateEndTime) {
        if (Math.random() < EXIT_CHANCE_AFTER_ACTIVITY) {
          this.startExiting();
          return;
        } else {
          this.decideNextGoal();
          return;
        }
      }
      // … your existing roaming code …
    }

    updateInteracting(currentTime) {
      if (!this.event) return;

      if (currentTime >= this.stateEndTime) {
        this.endInteraction();
        return;
      }

      // Show interaction balloons
      const progress =
        (currentTime - (this.stateEndTime - interactionTime)) / interactionTime;
      if (progress > 0.2 && progress < 0.25) {
        $gameTemp.requestBalloon(this.event, 1); // Exclamation
      } else if (progress > 0.5 && progress < 0.55) {
        $gameTemp.requestBalloon(this.event, 4); // Heart
      } else if (progress > 0.8 && progress < 0.85) {
        $gameTemp.requestBalloon(this.event, 7); // Music
      }

      // Face partner
      if (this.interactionPartner && this.interactionPartner.event) {
        this.turnTowardCharacter(this.interactionPartner.event);
      }
    }

    updateExiting(currentTime) {
      if (!this.event) return;

      if (this.path.length === 0 || this.checkForExit()) {
        return;
      }

      if (!this.event.isMoving()) {
        const dir = this.path.shift();
        if (dir) {
          this.event.moveStraight(dir);
        }
      }
    }

    decideNextGoal() {
      const currentTime = performance.now();
      const goals = [];

      // Add weighted goals based on context
      goals.push({ type: "wander", weight: 30 });
      goals.push({ type: "exit", weight: 10 });

      // Check available zones
      const zones = this.findZonesOnMap();
      if (zones.bench.length > 0) goals.push({ type: "rest", weight: 15 });
      if (zones.social.length > 0)
        goals.push({ type: "socialize", weight: 25 });
      if (zones.market.length > 0) goals.push({ type: "shop", weight: 20 });

      // Weight selection
      const totalWeight = goals.reduce((sum, g) => sum + g.weight, 0);
      let random = Math.random() * totalWeight;

      for (const goal of goals) {
        random -= goal.weight;
        if (random <= 0) {
          this.setGoal(goal.type);
          break;
        }
      }
    }

    setGoal(type, target = null) {
      const currentTime = performance.now();

      switch (type) {
        case "wander":
          this.state = "wandering";
          this.stateEndTime = currentTime + randBetween(10000, 20000);
          this.moveSpeed = Math.random() < 0.7 ? 3 : 4;
          break;

        case "rest":
          const benches = this.findZonesOnMap().bench;
          if (benches.length > 0) {
            this.target = randomElement(benches);
            this.state = "goingToZone";
            this.calculatePathToTarget();
          }
          break;

        case "socialize":
          const socialZones = this.findZonesOnMap().social;
          if (socialZones.length > 0) {
            this.target = randomElement(socialZones);
            this.state = "goingToZone";
            this.calculatePathToTarget();
          }
          break;

        case "shop":
          const markets = this.findZonesOnMap().market;
          if (markets.length > 0) {
            this.target = randomElement(markets);
            this.state = "goingToZone";
            this.calculatePathToTarget();
          }
          break;

        case "exit":
          this.startExiting();
          break;
      }

      if (this.event) this.event.setMoveSpeed(this.moveSpeed);
      debug(`NPC ${this.eventName} goal: ${type}`);
    }

    calculatePathToTarget() {
      if (!this.event) return;

      if (!this.target) return;

      this.path = this.pathfinder.findPath(
        this.event.x,
        this.event.y,
        this.target.x,
        this.target.y,
        true,
        true
      );

      if (!this.path || this.path.length === 0) {
        this.decideNextGoal();
      }
    }

    enterZone() {
      if (!this.event) return;

      const regionId = $gameMap.regionId(this.event.x, this.event.y);
      const currentTime = performance.now();

      switch (regionId) {
        case ZONE_BENCH:
          this.state = "resting";
          this.stateEndTime = currentTime + randBetween(8000, 15000);
          break;
        case ZONE_SOCIAL:
          this.state = "socializing";
          this.stateEndTime = currentTime + randBetween(10000, 20000);
          break;
        case ZONE_MARKET:
          this.state = "shopping";
          this.stateEndTime = currentTime + randBetween(8000, 12000);
          break;
        default:
          this.state = "inZone";
          this.stateEndTime = currentTime + randBetween(5000, 10000);
      }
    }

    checkNearbyZones() {
      if (!this.event) return null;

      const checkRadius = 5;
      const zones = [];

      for (let dx = -checkRadius; dx <= checkRadius; dx++) {
        for (let dy = -checkRadius; dy <= checkRadius; dy++) {
          const x = this.event.x + dx;
          const y = this.event.y + dy;

          if (!$gameMap.isValid(x, y)) continue;

          const regionId = $gameMap.regionId(x, y);
          if ([ZONE_BENCH, ZONE_SOCIAL, ZONE_MARKET].includes(regionId)) {
            const dist = Math.abs(dx) + Math.abs(dy);
            zones.push({
              x: x,
              y: y,
              type: this.getZoneType(regionId),
              distance: dist,
            });
          }
        }
      }

      zones.sort((a, b) => a.distance - b.distance);
      return zones[0] || null;
    }

    findZonesOnMap() {
      const zones = {
        bench: [],
        social: [],
        market: [],
      };

      for (let x = 0; x < $gameMap.width(); x++) {
        for (let y = 0; y < $gameMap.height(); y++) {
          const regionId = $gameMap.regionId(x, y);
          switch (regionId) {
            case ZONE_BENCH:
              zones.bench.push({ x, y });
              break;
            case ZONE_SOCIAL:
              zones.social.push({ x, y });
              break;
            case ZONE_MARKET:
              zones.market.push({ x, y });
              break;
          }
        }
      }

      return zones;
    }

    getZoneType(regionId) {
      switch (regionId) {
        case ZONE_BENCH:
          return "rest";
        case ZONE_SOCIAL:
          return "socialize";
        case ZONE_MARKET:
          return "shop";
        default:
          return "none";
      }
    }

    getSmartWanderDirection() {
      if (!this.event) return null;

      const directions = [2, 4, 6, 8];
      const weights = [];

      for (const dir of directions) {
        let weight = 1;
        const newX = $gameMap.roundXWithDirection(this.event.x, dir);
        const newY = $gameMap.roundYWithDirection(this.event.y, dir);

        // Check if passable
        if (!this.event.canPass(this.event.x, this.event.y, dir)) {
          weight = 0;
        } else {
          // Prefer unexplored areas
          const regionId = $gameMap.regionId(newX, newY);

          // Avoid avoidance zones
          if (regionId === ZONE_AVOID) {
            weight = 0;
          } else if (
            [ZONE_BENCH, ZONE_SOCIAL, ZONE_MARKET].includes(regionId)
          ) {
            weight *= 1.5; // Slightly prefer zones
          }

          // Avoid other NPCs
          const npcAt = $gameSystem.npcControllers.some(
            (c) =>
              c.event &&
              c.event !== this.event &&
              c.event.x === newX &&
              c.event.y === newY
          );
          if (npcAt) weight *= 0.3;
        }

        weights.push(weight);
      }

      // Weighted random selection
      const totalWeight = weights.reduce((a, b) => a + b, 0);
      if (totalWeight === 0) return null;

      let random = Math.random() * totalWeight;
      for (let i = 0; i < directions.length; i++) {
        random -= weights[i];
        if (random <= 0) return directions[i];
      }

      return null;
    }

    findNearbyNPCs(range = 3) {
      if (!this.event) return [];

      const nearby = [];

      for (const controller of $gameSystem.npcControllers || []) {
        if (controller === this || !controller.event || controller.isAbsent)
          continue;

        const dist = distance(
          { x: this.event.x, y: this.event.y },
          { x: controller.event.x, y: controller.event.y }
        );

        if (dist <= range) {
          nearby.push(controller);
        }
      }

      return nearby;
    }

    startInteraction(partner) {
      if (!this.event || !partner || !partner.event) return;

      const currentTime = performance.now();

      this.state = "interacting";
      this.stateEndTime = currentTime + interactionTime;
      this.interactionPartner = partner;
      this.path = [];

      partner.state = "interacting";
      partner.stateEndTime = currentTime + interactionTime;
      partner.interactionPartner = this;
      partner.path = [];

      // Face each other
      this.turnTowardCharacter(partner.event);
      partner.turnTowardCharacter(this.event);

      debug(`NPCs ${this.eventName} and ${partner.eventName} interacting`);
    }

    endInteraction() {
      if (!this.event) return;

      $gameTemp.requestBalloon(this.event, 0);

      if (this.interactionPartner) {
        $gameTemp.requestBalloon(this.interactionPartner.event, 0);
        this.interactionPartner.interactionPartner = null;
        this.interactionPartner.decideNextGoal();
      }

      this.interactionPartner = null;
      this.decideNextGoal();
    }

    turnTowardCharacter(character) {
      if (!this.event || !character) return;

      const sx = this.event.deltaXFrom(character.x);
      const sy = this.event.deltaYFrom(character.y);

      if (Math.abs(sx) > Math.abs(sy)) {
        this.event.setDirection(sx > 0 ? 4 : 6);
      } else if (sy !== 0) {
        this.event.setDirection(sy > 0 ? 8 : 2);
      }
    }

    startExiting() {
      if (!this.event) return;

      // Find all exit-triggering events (House, Transfer, Door ()
      const exitEvents = $gameMap.events().filter((e) => {
        if (!e || !e.event()) return false;
        return isExitEvent(e.event().name);
      });

      if (!exitEvents.length) {
        this.decideNextGoal();
        return;
      }

      // Choose a random exit event to path toward
      const dest = randomElement(exitEvents);
      this.path = this.pathfinder.findPath(
        this.event.x,
        this.event.y,
        dest.x,
        dest.y
      );
      if (this.path && this.path.length) {
        this.state = "exiting";
      } else {
        this.decideNextGoal();
      }
    }

    checkForExit() {
      if (!this.event) return false;

      // Check if NPC is on the same tile as an exit event
      const eventsHere = $gameMap.eventsXy(this.event.x, this.event.y);
      for (const event of eventsHere) {
        if (!event) continue;
        if (isExitEvent(event.event().name)) {
          this.exitMap();
          return true;
        }
      }

      // Check if NPC is on a bordering tile facing an exit event
      const direction = this.event.direction();
      let adjacentX = this.event.x;
      let adjacentY = this.event.y;

      // Calculate the tile in front based on direction
      switch (direction) {
        case 2: // Down
          adjacentY = this.event.y + 1;
          break;
        case 4: // Left
          adjacentX = this.event.x - 1;
          break;
        case 6: // Right
          adjacentX = this.event.x + 1;
          break;
        case 8: // Up
          adjacentY = this.event.y - 1;
          break;
        default:
          return false; // No valid direction
      }

      // Check if the adjacent tile is valid
      if (!$gameMap.isValid(adjacentX, adjacentY)) {
        return false;
      }

      // Check for exit events on the adjacent tile
      const adjacentEvents = $gameMap.eventsXy(adjacentX, adjacentY);
      for (const event of adjacentEvents) {
        if (!event) continue;
        if (isExitEvent(event.event().name)) {
          this.exitMap();
          return true;
        }
      }

      return false;
    }

    exitMap() {
      if (!this.event) return;

      // Save current character graphic before removing it
      this._savedCharacterName = this.event._characterName;
      this._savedCharacterIndex = this.event._characterIndex;
      this._savedMoveType = this.event._moveType;

      // Set character graphic to null (empty) and movement to static
      this.event.setImage("", 0);
      this.event._moveType = 0; // Static movement

      // Start fade out
      this.event.fadeOut();

      // Calculate border position BEFORE the timeout
      // Use valid border tiles (A1/A2/A5 only) for houses
      const isInHouse = isHouseMap($gameMap.mapId());
      const borderTiles = isInHouse ? getValidBorderTiles() : getBorderTiles();

      if (borderTiles.length > 0) {
        const hidingSpot = randomElement(borderTiles);

        // Use a timeout to move after fade starts but before it completes
        setTimeout(() => {
          // Additional safety check: ensure event and map still exist
          if (this.event && $gameMap && $gameMap.width) {
            this.event.locate(hidingSpot.x, hidingSpot.y);
            // Make sure they're invisible and non-interactable
            this.event.setOpacity(0);
            this.event.setThrough(true);
          }
        }, 500);
      }

      this.isAbsent = true;
      this.state = "idle";
      debug(`NPC ${this.eventName} exited map and moved to border`);
    }

    // Flocking behavior implementation
    applyFlocking() {
      if (!flockingEnabled) return;

      const neighbors = this.findNearbyNPCs(this.neighborDistance);

      const separation = this.calculateSeparation(neighbors);
      const alignment = this.calculateAlignment(neighbors);
      const cohesion = this.calculateCohesion(neighbors);

      // Weight the forces
      separation.x *= 2.0;
      separation.y *= 2.0;
      alignment.x *= 1.0;
      alignment.y *= 1.0;
      cohesion.x *= 1.0;
      cohesion.y *= 1.0;

      // Apply forces
      this.velocity.x += separation.x + alignment.x + cohesion.x;
      this.velocity.y += separation.y + alignment.y + cohesion.y;

      // Limit speed
      const speed = Math.sqrt(
        this.velocity.x * this.velocity.x + this.velocity.y * this.velocity.y
      );
      if (speed > this.maxSpeed) {
        this.velocity.x = (this.velocity.x / speed) * this.maxSpeed;
        this.velocity.y = (this.velocity.y / speed) * this.maxSpeed;
      }

      // Convert to direction
      if (Math.abs(this.velocity.x) > Math.abs(this.velocity.y)) {
        if (this.velocity.x > 0.1) return 6;
        if (this.velocity.x < -0.1) return 4;
      } else {
        if (this.velocity.y > 0.1) return 2;
        if (this.velocity.y < -0.1) return 8;
      }

      return null;
    }

    calculateSeparation(neighbors) {
      if (!this.event) return { x: 0, y: 0 };

      const steer = { x: 0, y: 0 };
      let count = 0;

      for (const neighbor of neighbors) {
        const d = euclideanDistance(
          { x: this.event.x, y: this.event.y },
          { x: neighbor.event.x, y: neighbor.event.y }
        );

        if (d > 0 && d < this.desiredSeparation) {
          const diff = {
            x: this.event.x - neighbor.event.x,
            y: this.event.y - neighbor.event.y,
          };

          // Normalize and weight by distance
          const mag = Math.sqrt(diff.x * diff.x + diff.y * diff.y);
          if (mag > 0) {
            diff.x = diff.x / mag / d;
            diff.y = diff.y / mag / d;
          }

          steer.x += diff.x;
          steer.y += diff.y;
          count++;
        }
      }

      if (count > 0) {
        steer.x /= count;
        steer.y /= count;

        // Normalize and scale
        const mag = Math.sqrt(steer.x * steer.x + steer.y * steer.y);
        if (mag > 0) {
          steer.x = (steer.x / mag) * this.maxSpeed;
          steer.y = (steer.y / mag) * this.maxSpeed;

          steer.x -= this.velocity.x;
          steer.y -= this.velocity.y;

          // Limit force
          const forceMag = Math.sqrt(steer.x * steer.x + steer.y * steer.y);
          if (forceMag > this.maxForce) {
            steer.x = (steer.x / forceMag) * this.maxForce;
            steer.y = (steer.y / forceMag) * this.maxForce;
          }
        }
      }

      return steer;
    }

    calculateAlignment(neighbors) {
      const sum = { x: 0, y: 0 };
      let count = 0;

      for (const neighbor of neighbors) {
        sum.x += neighbor.velocity.x;
        sum.y += neighbor.velocity.y;
        count++;
      }

      if (count > 0) {
        sum.x /= count;
        sum.y /= count;

        // Normalize and scale
        const mag = Math.sqrt(sum.x * sum.x + sum.y * sum.y);
        if (mag > 0) {
          sum.x = (sum.x / mag) * this.maxSpeed;
          sum.y = (sum.y / mag) * this.maxSpeed;
        }

        const steer = {
          x: sum.x - this.velocity.x,
          y: sum.y - this.velocity.y,
        };

        // Limit force
        const forceMag = Math.sqrt(steer.x * steer.x + steer.y * steer.y);
        if (forceMag > this.maxForce) {
          steer.x = (steer.x / forceMag) * this.maxForce;
          steer.y = (steer.y / forceMag) * this.maxForce;
        }

        return steer;
      }

      return { x: 0, y: 0 };
    }

    calculateCohesion(neighbors) {
      if (!this.event) return { x: 0, y: 0 };

      const sum = { x: 0, y: 0 };
      let count = 0;

      for (const neighbor of neighbors) {
        sum.x += neighbor.event.x;
        sum.y += neighbor.event.y;
        count++;
      }

      if (count > 0) {
        sum.x /= count;
        sum.y /= count;

        // Steer towards center
        const desired = {
          x: sum.x - this.event.x,
          y: sum.y - this.event.y,
        };

        // Normalize and scale
        const mag = Math.sqrt(desired.x * desired.x + desired.y * desired.y);
        if (mag > 0) {
          desired.x = (desired.x / mag) * this.maxSpeed;
          desired.y = (desired.y / mag) * this.maxSpeed;
        }

        const steer = {
          x: desired.x - this.velocity.x,
          y: desired.y - this.velocity.y,
        };

        // Limit force
        const forceMag = Math.sqrt(steer.x * steer.x + steer.y * steer.y);
        if (forceMag > this.maxForce) {
          steer.x = (steer.x / forceMag) * this.maxForce;
          steer.y = (steer.y / forceMag) * this.maxForce;
        }

        return steer;
      }

      return { x: 0, y: 0 };
    }
  }

  // System extensions
  const _Game_System_initialize = Game_System.prototype.initialize;
  Game_System.prototype.initialize = function () {
    _Game_System_initialize.call(this);
    this.npcControllers = [];
    this._npcSystemCurrentMapGroup = null;
    // Initialize persistence data directly
    if (!this._npcMapData) {
      this._npcMapData = {
        npcPositions: {}, // { eventName: { mapId, x, y, lastSeen } }
        mapAssignments: {}, // { mapGroupName: { mapId: [eventNames] } }
        visitedMaps: {}, // { mapGroupName: Set of visited mapIds }
        lastMigrationTime: {}, // { mapGroupName: timestamp }
      };
    }
    // Reset global house absence probability on new game
    lastAbsenceUpdateTime = 0;
    currentHouseAbsenceProbability = 0.5;
  };

  // Fix for save/load - restore NPCController instances
  const _Game_System_onAfterLoad = Game_System.prototype.onAfterLoad;
  Game_System.prototype.onAfterLoad = function () {
    if (_Game_System_onAfterLoad) {
      _Game_System_onAfterLoad.call(this);
    }
    this.restoreNPCControllers();
  };
  Game_System.prototype.restoreNPCControllers = function () {
    // Wait for map data to be fully loaded
    if (!$dataMap || !$gameMap || !$gameMap.events) {
      // Schedule restoration for next frame
      setTimeout(() => {
        this.restoreNPCControllers();
      }, 100);
      return;
    }

    if (this.npcControllers && Array.isArray(this.npcControllers)) {
      for (let i = 0; i < this.npcControllers.length; i++) {
        const data = this.npcControllers[i];
        if (data && typeof data.update !== "function") {
          // Restore as proper NPCController instance
          const controller = new NPCController(data.eventName);

          // Copy over saved state
          Object.keys(data).forEach((key) => {
            if (key !== "event" && key !== "pathfinder") {
              controller[key] = data[key];
            }
          });

          // Refresh event reference
          controller.refreshEvent();

          this.npcControllers[i] = controller;
        }
      }
    }
  };
  const _Game_Map_setup = Game_Map.prototype.setup;
  Game_Map.prototype.setup = function (mapId) {
    // Save NPC positions BEFORE changing maps
    if ($gameMap && $gameMap._mapId !== mapId) {
      saveNPCPositions();
    }
    _Game_Map_setup.call(this, mapId);
  };

  const _Scene_Map_onMapLoaded = Scene_Map.prototype.onMapLoaded;
  Scene_Map.prototype.onMapLoaded = function () {
    _Scene_Map_onMapLoaded.call(this);
    if ($gameMap) {
      $gameMap.setupNPCControllers();
    }
  };

  Game_Map.prototype.setupNPCControllers = function () {
    $gameSystem.npcControllers = [];

    // Safety checks to prevent the error
    if (!$dataMap || !$dataMap.note || !$gameMap) {
      debug("Map data not ready or no note field available");
      return;
    }

    const note = $dataMap.note;
    // Use $gameMap.mapId() which is more reliable than $dataMap.id
    const currentMapId = $gameMap.mapId();
    debug(`=== Setting up NPC Controllers for Map ${currentMapId} ===`);

    // PROCEDURAL MAP 636: Special initialization with seeded graphics
    // Must check this BEFORE the general biome check since procedural maps have their own biome handling
    if (currentMapId === 636 && currentBiomeHasNPC()) {
      debug(
        `🎲 Procedural map 636 detected - initializing NPCs with seeded graphics`
      );
      setupProceduralMapNPCs();
      return;
    }

    // CHECK BIOME: If current biome has hasNPC = false, delete all NPC events (for non-procedural maps)

    /*
        if (!currentBiomeHasNPC()) {
            const biomeName = getCurrentBiome()?.name || "unknown biome";
            debug(`⚠️ Biome "${biomeName}" has hasNPC = false. Deleting all NPC events from this map.`);

            // Find and delete all events with "AI" tag (NPC events)
            for (const event of $gameMap.events()) {
                if (event && event.event().note.toLowerCase().includes('ai')) {
                    event.erase();
                    debug(`Deleted NPC event: ${event.event().name}`);
                }
            }
            // Early return - don't spawn any NPCs on this biome
            return;
        }*/

    // HOUSE INTEGRATION: When visiting a house, spawn NPCs from the player's current mapgroup
    // This happens when TreasureRoomSystem sends us to a house
    // Check FIRST before processing regular map logic
    const isHouse = currentMapId && isHouseMap(currentMapId);

    if (isHouse) {
      debug(
        `Map ${currentMapId} is a house map - checking for stored MapGroup`
      );

      // Use the mapgroup the player was in before entering the house
      const houseMapGroup = getCurrentMapGroup();
      if (houseMapGroup) {
        const groupName = Object.keys(mapGroups).find(
          (k) => mapGroups[k] === houseMapGroup
        );
        debug(
          `✓ House detected - spawning up to 3 NPCs from player's current MapGroup: ${groupName}`
        );
        debug(`  Current MapGroup Object:`, houseMapGroup);
        replacePlayerEventsWithNPCs(houseMapGroup);
      } else {
        debug(
          `⚠️ House map detected but player has no current MapGroup - no NPCs will spawn`
        );
        debug(
          `  Hint: Player must visit a MapGroup map (with <MapGroup: GroupName> tag) BEFORE entering house`
        );
      }
      // IMPORTANT: Return here to skip regular map processing for houses
      return;
    }

    // REGULAR MAP: Check if this map ID is in any mapGroup's maps array
    // Only process this if NOT a house map
    const groupName = findMapGroupByMap(currentMapId);
    if (groupName) {
      const mapGroupData = mapGroups[groupName];
      // Update tracked mapgroup when player is in a mapgroup area
      setCurrentMapGroup(mapGroupData);
      debug(
        `Map ${currentMapId} found in MapGroup: ${groupName} (Pool Map ID: ${mapGroupData.id})`
      );
      replacePlayerEventsWithNPCs(mapGroupData);
    } else {
      debug(`⚠️ Map ${currentMapId} is not configured in any mapGroup's maps array`);
      debug(`   NPCs will not spawn - add this map ID to a mapGroup in the plugin configuration`);
    }

    // Only proceed if the simple <NPC> tag exists on the map.
    if (note.includes("<NPC>")) {
      const npcNames = [];

      // Scan all events on the map and add any with "AI" (case-insensitive) in their notes.
      for (const event of $gameMap.events()) {
        try {
          if (
            event &&
            event.event() &&
            event.event().pages &&
            event.event().note
          ) {
            if (event.event().note.toLowerCase().includes("ai")) {
              npcNames.push(event.event().name);
            }
          }
        } catch (error) {
          debug(`Skipping event with invalid data: ${error.message}`);
        }
      }

      if (npcNames.length > 0) {
        const npcEvents = [];

        for (const name of npcNames) {
          try {
            const event = $gameMap.events().find((e) => {
              if (!e || !e.event() || !e.event().pages) return false;
              return e.event().name === name;
            });
            if (event) {
              npcEvents.push({
                event: event,
                name: name,
                originalX: event.x,
                originalY: event.y,
              });
            }
          } catch (error) {
            debug(`Error finding event "${name}": ${error.message}`);
          }
        }

        // Find all passable tiles with valid terrain tags (1, 2, 5, 7) for placement
        const passableTerrainTiles = findPassableTerrainTiles();

        if (passableTerrainTiles.length > 0) {
          // Place NPCs on random terrain-tagged tiles
          const shuffledTiles = [...passableTerrainTiles];

          // Fisher-Yates shuffle for tile positions
          for (let i = shuffledTiles.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffledTiles[i], shuffledTiles[j]] = [
              shuffledTiles[j],
              shuffledTiles[i],
            ];
          }

          // Place each NPC on a random terrain-tagged tile
          npcEvents.forEach((npc, index) => {
            if (index < shuffledTiles.length) {
              const tile = shuffledTiles[index];
              npc.event.locate(tile.x, tile.y);
              debug(
                `NPC ${npc.name} placed on terrain tile at ${tile.x},${tile.y}`
              );
            } else {
              debug(
                `NPC ${npc.name} kept at original position (no more terrain tiles available)`
              );
            }
          });
        } else {
          debug(
            "No passable terrain tiles (tags 1, 2, 5, 7) found for NPC placement, using original positions"
          );
        }

        // Create controllers for all NPCs
        for (const npc of npcEvents) {
          // Initialize event settings
          npc.event.setMoveSpeed(3);
          npc.event.setMoveFrequency(3);
          npc.event.setThrough(false);
          npc.event.setPriorityType(1); // Same as characters

          const controller = new NPCController(npc.name);
          $gameSystem.npcControllers.push(controller);
          //debug(`Initialized NPC controller for ${npc.name}`);
        }

        // Randomly make 1-2 NPCs absent at start, only if there are NPCs to make absent
        if (npcEvents.length > 1) {
          const absentCount = Math.min(
            Math.floor(Math.random() * 2) + 1,
            npcEvents.length - 1
          );
          for (let i = 0; i < absentCount; i++) {
            const controller = randomElement($gameSystem.npcControllers);
            if (controller && !controller.isAbsent) {
              controller.isAbsent = true;
              controller.event.setOpacity(0);
              controller.event.locate(0, 0); // Move off map
              debug(`NPC ${controller.eventName} starts absent`);
            }
          }
        }
      }
    }
  };

  const _Game_Map_update = Game_Map.prototype.update;
  Game_Map.prototype.update = function (sceneActive) {
    _Game_Map_update.call(this, sceneActive);

    if (sceneActive && $gameSystem.npcControllers) {
      for (const controller of $gameSystem.npcControllers) {
        controller.update();
      }
    }
  };

  // Event extensions for fading
  Game_CharacterBase.prototype.fadeIn = function () {
    this._fadeType = "in";
    this._fadeSpeed = 10;
  };

  Game_CharacterBase.prototype.fadeOut = function () {
    this._fadeType = "out";
    this._fadeSpeed = 10;
  };

  const _Game_CharacterBase_update = Game_CharacterBase.prototype.update;
  Game_CharacterBase.prototype.update = function () {
    _Game_CharacterBase_update.call(this);
    this.updateFade();
  };

  Game_CharacterBase.prototype.updateFade = function () {
    if (this._fadeType === "in") {
      this.setOpacity(Math.min(this.opacity() + this._fadeSpeed, 255));
      if (this.opacity() >= 255) {
        this._fadeType = null;
      }
    } else if (this._fadeType === "out") {
      this.setOpacity(Math.max(this.opacity() - this._fadeSpeed, 0));
      if (this.opacity() <= 0) {
        this._fadeType = null;
      }
    }
  };

  // Plugin commands
  const _Game_Interpreter_pluginCommand =
    Game_Interpreter.prototype.pluginCommand;
  Game_Interpreter.prototype.pluginCommand = function (command, args) {
    _Game_Interpreter_pluginCommand.call(this, command, args);

    if (command === "ReplacePlayerEvents") {
      const mapGroup = getMapGroup();
      if (mapGroup) {
        replacePlayerEventsWithNPCs(mapGroup);
        debug("Manually triggered Player event replacement");
      } else {
        debug("Current map does not belong to a MapGroup");
      }
    }

    if (command === "NPC") {
      switch (args[0]) {
        case "state":
          const npc = $gameSystem.npcControllers.find(
            (c) => c.eventName === args[1]
          );
          if (npc) {
            //console.log(`NPC ${args[1]} state: ${npc.state}`);
          }
          break;
        case "spawn":
          const controller = $gameSystem.npcControllers.find(
            (c) => c.eventName === args[1]
          );
          if (controller && controller.isAbsent) {
            controller.spawn();
          }
          break;
        case "exit":
          const exitController = $gameSystem.npcControllers.find(
            (c) => c.eventName === args[1]
          );
          if (exitController && !exitController.isAbsent) {
            exitController.exitMap();
          }
          break;
      }
    }

    // MapGroup management commands
    if (command === "SetMapGroup") {
      const groupName = args[0];
      if (mapGroups[groupName]) {
        setCurrentMapGroup(mapGroups[groupName]);
        debug(`Plugin command: MapGroup set to ${groupName}`);
      } else {
        debug(`Plugin command: MapGroup "${groupName}" not found`);
      }
    }

    if (command === "ClearMapGroup") {
      clearCurrentMapGroup();
      debug(`Plugin command: MapGroup cleared`);
    }

    if (command === "GetMapGroup") {
      const currentGroup = getCurrentMapGroup();
      if (currentGroup) {
        const groupName = Object.keys(mapGroups).find(
          (k) => mapGroups[k] === currentGroup
        );
        //console.log(`Current MapGroup: ${groupName}`);
      } else {
        //console.log(`Current MapGroup: None`);
      }
    }
  };
})();

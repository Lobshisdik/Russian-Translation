/*:
 * @target MZ
 * @plugindesc Handles a system of treasure rooms and houses that can be accessed randomly from specific locations.
 * @author Omni-Lex
 * @url [Your Website URL]
 *
 * @param treasureRooms
 * @text Treasure Rooms
 * @desc Comma-separated list of map IDs to use as treasure rooms
 * @default 5,6,7,8,9
 *
 * @param treasureRoomAssociations
 * @text Treasure Room Associations
 * @desc Maps that always lead to specific treasure rooms (format: sourceMapID:treasureMapID,...)
 * @default 1:5,2:6,3:7
 *
 * @param housePools
 * @text House Pools
 * @desc Define pools of houses in JSON format
 * @type string
 * @default {"abandoned":[656,641,640],"houses":[656,641,640,642,643,644,648,651,653],"huts":[673,670,669,665,646],"skyscrapers":[649,672,671],"villas":[644,666,662,657,658,668,661,655,652,650,647],"skyfloors":[1143,1144,1145,1146,1147,1148,1149,1150,1151],"floors":[1138,1139,1140,1141,1142,1152,1153,1154,1155]}
 *
 * @param spawnRegionId
 * @text Spawn Region ID
 * @desc Region ID to spawn player at in treasure room/house (default: 13)
 * @type number
 * @default 13
 *
 * @command visitTreasureRoom
 * @text Visit Treasure Room
 * @desc Transports the player to a random unique treasure room
 *
 * @command exitTreasureRoom
 * @text Exit Treasure Room
 * @desc Transports the player back to where they were before entering the treasure room
 *
 * @command visitHouse
 * @text Visit House
 * @desc Transports the player to a house with modified NPCs
 *
 * @arg poolName
 * @text Pool Name
 * @desc The name of the house pool to use (leave empty for random from all pools)
 * @type string
 * @default
 *
 * @arg facing
 * @text Use Facing Direction
 * @desc When true, uses the tile the player is facing instead of event location
 * @type boolean
 * @default false
 *
 * @command exitHouse
 * @text Exit House
 * @desc Transports the player back to where they were before entering the house
 *
 * @command enterMultiBuilding
 * @text Enter Multi-Floor Building
 * @desc Transports the player to a procedurally generated multi-floor building.
 *
 * @arg baseFloorPool
 * @text Base Floor Pool
 * @desc The name of the house pool to use for the ground floor.
 * @type string
 *
 * @arg upperFloorsPool
 * @text Upper Floors Pool
 * @desc The name of the house pool to use for all other floors.
 * @type string
 *
 * @arg numFloors
 * @text Number of Floors
 * @desc The total number of floors in the building.
 * @type number
 * @min 1
 * @default 3
 *
 * @arg facing
 * @text Use Facing Direction
 * @desc When true, uses the tile the player is facing instead of event location
 * @type boolean
 * @default false
 *
 * @command NextFloor
 * @text Go to Next Floor
 * @desc Moves the player to the next floor in a multi-floor building.
 *
 * @command PreviousFloor
 * @text Go to Previous Floor
 * @desc Moves the player to the previous floor in a multi-floor building.
 *
 * @help
 * ============================================================================
 * Treasure Room and House System
 * ============================================================================
 *
 * This plugin allows you to create a system of treasure rooms and houses that
 * the player can visit.
 *
 * TREASURE ROOMS:
 * When the player activates a "Visit Treasure Room" event, they will be
 * transported to a randomly selected treasure room. Each activation point
 * consistently leads to the same treasure room.
 *
 * AUTOMATIC CONFIGURATION:
 * Treasure rooms are automatically detected as child maps of parent ID 133.
 * Any map that is a child of map 133 will be included as a treasure room.
 *
 * HOUSES:
 * When the player activates a "Visit House" event, they will be transported
 * to a house map. You can now organize house maps into different pools
 * (e.g., houses, skyscrapers, huts).
 *
 * When entering a treasure room or house, the player will be placed on a tile
 * with Region ID 13 (configurable in plugin parameters).
 *
 * ============================================================================
 * Multi-Floor Buildings
 * ============================================================================
 *
 * This plugin also supports procedurally generated multi-floor buildings.
 * When a player uses the "Enter Multi-Floor Building" command, a building
 * is generated based on the entrance location.
 *
 * The ground floor is selected from a "base floor" pool, and all upper
 * floors are selected from an "upper floors" pool. The building's layout
 * is consistent for that specific entrance.
 *
 * MAP REQUIREMENTS:
 * Maps used in multi-floor buildings should have two events named:
 * - "Upstairs"
 * - "Downstairs"
 *
 * These events will be used as teleport points for the "Next Floor" and
 * "Previous Floor" commands. Their visibility is handled automatically:
 * - The "Downstairs" event is hidden on the ground floor.
 * - The "Upstairs" event is hidden on the top floor.
 * - Both events are hidden if the map is entered via the "Visit House" command.
 *
 * Event Setup:
 * For the visibility to work, the "Upstairs" and "Downstairs" events should
 * have two pages. Page 1 is the visible event. Page 2 should be blank and
 * require "Self Switch A" to be ON. The plugin will toggle Self Switch A
 * to control visibility.
 */

(() => {
  "use strict";
  const pluginName = "TreasureRoomSystem";

  //=============================================================================
  // Plugin Parameters
  //=============================================================================
  window.TreasureRoomSystem = {
      currentHouseSeed: null,
      getCurrentHouseSeed() {
          return this.currentHouseSeed;
      }
  };
  const parameters = PluginManager.parameters(pluginName);
  
  // Parent map ID for treasure rooms
  const treasureRoomParentId = 133;
  
  // Fallback treasure rooms (used if automatic generation fails)
  const treasureRoomListFallback = [142,143,144,145,146,137,148,149,150,151,152,153,154,155,156,157,158,159,160,161,162,163,302];
  
  let treasureRoomList = null;
  let treasureRoomListInitialized = false;
  
  const treasureRoomAssociationsRaw = "";
  
  // Define parent map IDs for automatic pool generation
  const parentMapConfig = {
    "houses": 1132,
    "skyscrapers": 1133,
    "huts": 1134,
    "villas": 1135,
    "floors": 1136,
    "skyfloors": 1137,
    "abandoned": 1394,
    "inns": 1156,
    "shops": 1157
  };
  
  // Fallback house pools (used if automatic generation fails)
  const housePoolsJSON = {
    "abandoned": [1395, 1396, 1397],
    "houses": [638, 640, 641, 642, 643, 644, 648, 649, 651, 653, 653, 656],
    "huts": [646, 665, 669, 670, 673],
    "skyscrapers": [649, 671, 672],
    "villas": [644, 647, 650, 652, 655, 657, 658, 661, 662, 666, 668],
    "skyfloors": [1143, 1144, 1145, 1146, 1147, 1148, 1149, 1150, 1151],
    "floors": [1138, 1139, 1140, 1141, 1142, 1152, 1153, 1154, 1155],
    "inns": [1390,1391],
    "shops": [1392,1393]
  };
  
  let housePools = null;
  let housePoolsInitialized = false;

  function parseHousePools(jsonString) {
    try {
      if (!jsonString || jsonString.trim() === "") {
        return null;
      }
      
      const parsed = JSON.parse(jsonString);
      
      // Validate that it's an object with array values
      if (typeof parsed !== 'object' || parsed === null) {
        return null;
      }
      
      // Validate and filter the pools
      const validPools = {};
      for (const [poolName, mapIds] of Object.entries(parsed)) {
        if (Array.isArray(mapIds)) {
          validPools[poolName] = mapIds.filter(id => typeof id === 'number' && id > 0);
        } else {
        }
      }
      
      return Object.keys(validPools).length > 0 ? validPools : null;
    } catch (error) {
      return null;
    }
  }

  function getChildMapsOfParent(parentId) {
    const childMaps = [];
    
    if (!$dataMapInfos) {
      return childMaps;
    }
    
    // Iterate through all map infos
    for (let i = 1; i < $dataMapInfos.length; i++) {
      const mapInfo = $dataMapInfos[i];
      if (mapInfo && mapInfo.parentId === parentId) {
        childMaps.push(i);
      }
    }
    
    return childMaps.sort((a, b) => a - b);
  }

  function generateAutomaticHousePools() {
    const pools = {};
    
    
    for (const [poolName, parentId] of Object.entries(parentMapConfig)) {
      const childMaps = getChildMapsOfParent(parentId);
      pools[poolName] = childMaps;
      
  
    }
    
    return pools;
  }

  function generateAutomaticTreasureRooms() {
    
    const childMaps = getChildMapsOfParent(treasureRoomParentId);
    
    if (childMaps.length > 0) {
      return childMaps;
    } else {
      return treasureRoomListFallback;
    }
  }

  function initializeTreasureRooms() {
    // Try automatic generation
    if ($dataMapInfos) {
      const autoRooms = generateAutomaticTreasureRooms();
      
      if (autoRooms.length > 0) {
        return autoRooms;
      }
    }
    
    // Fallback to hardcoded list
    return treasureRoomListFallback;
  }

  function ensureTreasureRoomsInitialized() {
    if (!treasureRoomListInitialized) {
      treasureRoomList = initializeTreasureRooms();
      treasureRoomListInitialized = true;
    }
  }

  function initializeHousePools() {
    // Try to parse from plugin parameters first
    const manualPools = parseHousePools(parameters["housePools"]);
    if (manualPools) {
      return manualPools;
    }
    
    // Try automatic generation
    if ($dataMapInfos) {
      const autoPools = generateAutomaticHousePools();
      const hasValidPools = Object.values(autoPools).some(maps => maps.length > 0);
      
      if (hasValidPools) {
        return autoPools;
      }
    }
    
    // Fallback to hardcoded pools
    return housePoolsJSON;
  }

  function ensureHousePoolsInitialized() {
    if (!housePoolsInitialized) {
      housePools = initializeHousePools();
      housePoolsInitialized = true;
    }
  }

  const treasureRoomAssociations = {};
  if (treasureRoomAssociationsRaw) {
    treasureRoomAssociationsRaw.split(",").forEach((pair) => {
      const [sourceMap, treasureMap] = pair.split(":").map(Number);
      treasureRoomAssociations[sourceMap] = treasureMap;
    });
  }

  // Storage
  const visitedTreasureRooms = {};
  const treasureRoomReturnPoints = {};
  const houseReturnPoints = {};
  const multiBuildingStructures = {};

  // Session tracking
  let currentHouseSessionId = null;
  let currentMultiBuilding = null;
  let _postTransferActions = null;

  //=============================================================================
  // Plugin Commands
  //=============================================================================

  PluginManager.registerCommand(pluginName, "visitTreasureRoom", (args) => {
    visitTreasureRoom();
  });

  PluginManager.registerCommand(pluginName, "exitTreasureRoom", (args) => {
    exitTreasureRoom();
  });

  PluginManager.registerCommand(pluginName, "visitHouse", (args) => {
    const poolName = args.poolName || "";
    const useFacing = args.facing === "true" || args.facing === true;
    visitHouse(poolName, useFacing);
  });

  PluginManager.registerCommand(pluginName, "exitHouse", (args) => {
    exitHouse();
  });

  PluginManager.registerCommand(pluginName, "enterMultiBuilding", (args) => {
    const baseFloorPool = args.baseFloorPool;
    const upperFloorsPool = args.upperFloorsPool;
    const numFloors = Number(args.numFloors);
    const useFacing = args.facing === "true" || args.facing === true;
    enterMultiBuilding(baseFloorPool, upperFloorsPool, numFloors, useFacing);
  });

  PluginManager.registerCommand(pluginName, "NextFloor", (args) => {
    changeFloor('next');
  });

  PluginManager.registerCommand(pluginName, "PreviousFloor", (args) => {
    changeFloor('previous');
  });

  //=============================================================================
  // Utility Functions
  //=============================================================================

  function createLocationKey() {
    return `${$gameMap.mapId()}_${$gamePlayer.x}_${$gamePlayer.y}`;
  }

  function seededRandom(seed) {
    const x = Math.sin(seed) * 10000;
    return x - Math.floor(x);
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

  function getSeededRandomFloat(min, max, seed) {
    return seededRandom(seed) * (max - min) + min;
  }

  //=============================================================================
  // Treasure Room Functions
  //=============================================================================

  function saveReturnPoint(treasureRoomId) {
    treasureRoomReturnPoints[treasureRoomId] = {
      mapId: $gameMap.mapId(),
      x: $gamePlayer.x,
      y: $gamePlayer.y,
      direction: $gamePlayer.direction(),
    };
  }

  function selectTreasureRoom() {
    // Ensure treasure rooms are initialized
    ensureTreasureRoomsInitialized();
    
    const currentMapId = $gameMap.mapId();
    const locationKey = createLocationKey();

    if (treasureRoomAssociations[currentMapId]) {
      return treasureRoomAssociations[currentMapId];
    }
    if (visitedTreasureRooms[locationKey]) {
      return visitedTreasureRooms[locationKey];
    }

    const usedRoomIds = Object.values(visitedTreasureRooms);
    const availableRooms = treasureRoomList.filter(
      (roomId) => !usedRoomIds.includes(roomId)
    );

    let selectedRoom;
    if (availableRooms.length > 0) {
      selectedRoom = availableRooms[Math.floor(Math.random() * availableRooms.length)];
    } else {
      selectedRoom = treasureRoomList[Math.floor(Math.random() * treasureRoomList.length)];
    }
    visitedTreasureRooms[locationKey] = selectedRoom;

    if (window.NetworkManager && NetworkManager.instance && NetworkManager.instance.isMultiplayer()) {
      NetworkManager.instance.broadcastTreasureRoomVisit(locationKey, selectedRoom);
    }
    return selectedRoom;
  }

  //=============================================================================
  // House Functions
  //=============================================================================

  function getEventCoordinates(useFacing = false) {
    let eventX = $gamePlayer.x;
    let eventY = $gamePlayer.y;

    // Calculate the tile in front of the player
    const frontX = $gamePlayer.x + ($gamePlayer.direction() === 6 ? 1 : $gamePlayer.direction() === 4 ? -1 : 0);
    const frontY = $gamePlayer.y + ($gamePlayer.direction() === 2 ? 1 : $gamePlayer.direction() === 8 ? -1 : 0);

    if (useFacing) {
      // Use the tile the player is facing
      eventX = frontX;
      eventY = frontY;
    } else {
      // Try to find the event the player is interacting with
      const event = $gameMap.eventIdXy(frontX, frontY);
      if (event > 0) {
        eventX = frontX;
        eventY = frontY;
      }
    }

    return { x: eventX, y: eventY };
  }

  function getHouseList(poolName, excludeFloorPools = false) {
    // Ensure pools are initialized (lazy loading)
    ensureHousePoolsInitialized();
    
    // Define pools to exclude when excludeFloorPools is true
    const excludedPools = ['skyfloors', 'floors'];
    
    // If no pool name specified, return all unique houses from all pools
    if (!poolName || poolName === "") {
      const allHouses = new Set();
      Object.entries(housePools).forEach(([poolKey, poolMaps]) => {
        // Skip excluded pools if flag is set
        if (excludeFloorPools && excludedPools.includes(poolKey)) {
          return;
        }
        poolMaps.forEach(mapId => allHouses.add(mapId));
      });
      return Array.from(allHouses);
    }
    
    // If specific pool requested, check if it's in the excluded list
    if (excludeFloorPools && excludedPools.includes(poolName)) {
      return getHouseList("", true); // Return all non-excluded pools
    }
    
    // If specific pool requested, return that pool
    if (housePools[poolName]) {
      return [...housePools[poolName]];
    }
    
    // Pool not found, warn and return all houses (excluding floors if flag set)
    const availablePools = excludeFloorPools 
      ? Object.keys(housePools).filter(p => !excludedPools.includes(p))
      : Object.keys(housePools);
    console.warn(`House pool "${poolName}" not found. Available pools: ${availablePools.join(', ')}`);
    return getHouseList("", excludeFloorPools);
  }

  function saveHouseReturnPoint(useFacing = false) {
    // Get the event coordinates (or facing coordinates if useFacing is true)
    const eventCoords = getEventCoordinates(useFacing);

    const returnPoint = {
      mapId: $gameMap.mapId(),
      eventX: eventCoords.x,
      eventY: eventCoords.y,
      direction: $gamePlayer.direction(),
    };
    const sessionId = Date.now() + "_" + Math.random();
    houseReturnPoints[sessionId] = returnPoint;
    currentHouseSessionId = sessionId;
    return sessionId;
  }

  function selectHouse(seed, poolName) {
    const houseList = getHouseList(poolName, true); // Pass true to exclude floor pools
    if (houseList.length === 0) return null;
    return getSeededRandomFromArray(houseList, seed);
  }


  //=============================================================================
  // Multi-Building Functions
  //=============================================================================

  function findEventByName(name) {
    return $gameMap.events().find(event => event && event.event().name === name);
  }

  function setEventVisibility(eventName, isVisible) {
    const event = findEventByName(eventName);
    if (event) {
      const key = [$gameMap.mapId(), event.eventId(), 'A'];
      $gameSelfSwitches.setValue(key, !isVisible);
    }
  }
  
  function updateStairVisibility() {
    if (!currentMultiBuilding) return;
  
    const floor = currentMultiBuilding.currentFloorIndex;
    const total = currentMultiBuilding.structure.totalFloors;
  
    const upstairsEvent = findEventByName("Upstairs");
    const downstairsEvent = findEventByName("Downstairs");
  
    // Erase Upstairs on the last floor
    if (upstairsEvent) {
      if (floor >= total - 1) {
        $gameMap.event(upstairsEvent.eventId()).erase();
      }
    }
    
    // Erase Downstairs on the ground floor
    if (downstairsEvent) {
      if (floor <= 0) {
        $gameMap.event(downstairsEvent.eventId()).erase();
      }
    }
    
    $gameMap.refresh();
  }

  function generateMultiBuildingStructure(seed, basePool, upperPool, numFloors) {
    // numFloors now represents upper floors only
    // Total floors = 1 (base) + numFloors (upper)
    const totalFloors = 1 + numFloors;
    const structure = { floors: [], totalFloors: totalFloors };
    
    const baseFloorList = getHouseList(basePool);
    const upperFloorsList = getHouseList(upperPool);
    
    if (baseFloorList.length === 0 || upperFloorsList.length === 0) {
      console.error("One or more map pools for the multi-building are empty.");
      return null;
    }
  
    // Ground floor (index 0)
    structure.floors.push(getSeededRandomFromArray(baseFloorList, seed));
    
    // Upper floors (indices 1+)
    for (let i = 0; i < numFloors; i++) {
      structure.floors.push(getSeededRandomFromArray(upperFloorsList, seed + (i + 1) * 777));
    }
    
    return structure;
  }

  //=============================================================================
  // Common Functions
  //=============================================================================

  function findPositionWithRegionId(regionId) {
    if (!$dataMap) return { x: 0, y: 0 };
    for (let y = 0; y < $dataMap.height; y++) {
      for (let x = 0; x < $dataMap.width; x++) {
        if ($gameMap.regionId(x, y) === regionId) return { x, y };
      }
    }
    return { x: 0, y: 0 };
  }

  function getMapDirection(tagName) {
    if ($dataMap && $dataMap.note) {
      const match = $dataMap.note.match(new RegExp(`<${tagName}:(\\w+)>`, "i"));
      if (match) {
        switch (match[1].toLowerCase()) {
          case "down": return 2;
          case "left": return 4;
          case "right": return 6;
          case "up": return 8;
        }
      }
    }
    return null;
  }

  //=============================================================================
  // Main Visit & Exit Functions
  //=============================================================================

  function visitTreasureRoom() {
    // Ensure treasure rooms are initialized
    ensureTreasureRoomsInitialized();
    
    if (treasureRoomList.length === 0) {
      console.error("No treasure rooms defined.");
      return;
    }
    const treasureRoomId = selectTreasureRoom();
    saveReturnPoint(treasureRoomId);
    _postTransferActions = {
        type: 'treasureRoom',
        spawnRegionId: Number(parameters["spawnRegionId"] || 13),
        originalDirection: $gamePlayer.direction()
    };
    $gamePlayer.reserveTransfer(treasureRoomId, 0, 0, $gamePlayer.direction(), 0);
  }

  function visitHouse(poolName = "", useFacing = false) {
    const houseList = getHouseList(poolName, true); // Pass true to exclude floor pools
    if (houseList.length === 0) {
      console.error(`No houses in pool "${poolName || 'default'}"`);
      return;
    }

    // Get event coordinates (or facing coordinates if useFacing is true)
    const eventCoords = getEventCoordinates(useFacing);
    const seed = createSeed($gameMap.mapId(), eventCoords.x, eventCoords.y);

    const sessionId = saveHouseReturnPoint(useFacing);
    const houseId = selectHouse(seed, poolName);
    if (!houseId) return;

    // If entering from procedural map 636, save the biome data for proper restoration
    if ($gameMap.mapId() === 636 && $gameSystem._procGenData) {
      const procGenData = $gameSystem._procGenData;

      // Save biome data to the return point
      houseReturnPoints[sessionId].savedBiomeData = {
        currentBiome: procGenData.currentBiome,
        currentRoadDirection: procGenData.currentRoadDirection,
        currentBiomeTileset: procGenData.currentBiomeTileset,
        originX: procGenData.originX,
        originY: procGenData.originY,
        seed: procGenData.seed,
        displayAsBeach: procGenData.displayAsBeach,
        biomeDayTemperature: procGenData.biomeDayTemperature,
        biomeNightTemperature: procGenData.biomeNightTemperature
      };

      console.log(`[TreasureRoomSystem] Saved biome data for house visit: ${procGenData.currentBiome}`);
    }

    // Store seed for FurnitureSystem integration
    window.TreasureRoomSystem.currentHouseSeed = seed;

    _postTransferActions = {
        type: 'house',
        spawnRegionId: Number(parameters["spawnRegionId"] || 13),
        originalDirection: $gamePlayer.direction(),
        seed: seed
    };
    $gamePlayer.reserveTransfer(houseId, 0, 0, $gamePlayer.direction(), 0);
  }

  function enterMultiBuilding(baseFloorPool, upperFloorsPool, numFloors, useFacing = false) {
    if (numFloors < 1) return;

    // Use default pools if not specified
    if (!baseFloorPool || baseFloorPool === "") {
      baseFloorPool = "skyscrapers";
    }
    if (!upperFloorsPool || upperFloorsPool === "") {
      upperFloorsPool = "skyfloors";
    }

    const locationKey = createLocationKey();

    // Get event coordinates (or facing coordinates if useFacing is true)
    const eventCoords = getEventCoordinates(useFacing);
    const seed = createSeed($gameMap.mapId(), eventCoords.x, eventCoords.y);

    let structure = multiBuildingStructures[locationKey] || generateMultiBuildingStructure(seed, baseFloorPool, upperFloorsPool, numFloors);
    if (!structure) return;
    multiBuildingStructures[locationKey] = structure;

    saveHouseReturnPoint(useFacing);
    currentMultiBuilding = {
        entranceKey: locationKey,
        currentFloorIndex: 0,
        structure: structure,
        baseSeed: seed
    };
    
    _postTransferActions = {
        type: 'multiBuildingEnter',
        spawnRegionId: Number(parameters["spawnRegionId"] || 13),
        originalDirection: $gamePlayer.direction(),
        seed: seed
    };
    $gamePlayer.reserveTransfer(structure.floors[0], 0, 0, $gamePlayer.direction(), 0);
  }

  function changeFloor(direction) {
    if (!currentMultiBuilding) return;
    const current = currentMultiBuilding.currentFloorIndex;
    const total = currentMultiBuilding.structure.totalFloors;
    const nextIndex = direction === 'next' ? current + 1 : current - 1;

    if (nextIndex >= 0 && nextIndex < total) {
        currentMultiBuilding.currentFloorIndex = nextIndex;
        const floorSeed = currentMultiBuilding.baseSeed + nextIndex * 5000;
        _postTransferActions = { 
            type: 'floorChange', 
            direction: direction,
            seed: floorSeed
        };
        $gamePlayer.reserveTransfer(currentMultiBuilding.structure.floors[nextIndex], 0, 0, $gamePlayer.direction(), 0);
    }
  }

  function exitTreasureRoom() {
    const returnPoint = treasureRoomReturnPoints[$gameMap.mapId()];
    if (returnPoint) {
      $gamePlayer.reserveTransfer(returnPoint.mapId, returnPoint.x, returnPoint.y, 2, 0);
    } else {
      console.error("No return point for treasure room " + $gameMap.mapId());
    }
  }

  function exitHouse() {
    const returnPoint = houseReturnPoints[currentHouseSessionId];
    if (returnPoint) {
      // If returning to procedural map 636, force regeneration using saved biome
      if (returnPoint.mapId === 636 && returnPoint.savedBiomeData && $gameSystem._procGenData) {
        console.log("[TreasureRoomSystem] Exiting to procedural map 636, forcing regeneration with saved biome");

        const procGenData = $gameSystem._procGenData;
        const savedBiome = returnPoint.savedBiomeData;

        // Get saved biome data
        const biomeName = savedBiome.currentBiome || "Fields";
        const roadDirection = savedBiome.currentRoadDirection || null;
        const originX = savedBiome.originX || $gameVariables.value(43);
        const originY = savedBiome.originY || $gameVariables.value(44);
        const seed = savedBiome.seed + originX + originY;

        console.log(`[TreasureRoomSystem] Regenerating with biome: ${biomeName}, road: ${roadDirection}, coords: (${originX}, ${originY})`);

        // Get biome object using ProcGenUtils
        const biomeObj = window.ProcGenUtils ? window.ProcGenUtils.getBiomeByName(biomeName) : null;

        if (biomeObj && window.generateProceduralTerrain) {
          // Get adjacent biomes for proper edge blending
          let adjacentBiomes = null;
          let cacheInfo = null;

          if (window.ProcGenUtils && window.ProcGenUtils.getAdjacentBiomesFromCache && procGenData.biomeCoordinateCache) {
            adjacentBiomes = window.ProcGenUtils.getAdjacentBiomesFromCache(
              originX,
              originY,
              procGenData.biomeCoordinateCache
            );

            if (window.ProcGenUtils.checkAdjacentMapBiomesFromCache) {
              cacheInfo = window.ProcGenUtils.checkAdjacentMapBiomesFromCache(
                originX,
                originY,
                procGenData.biomeCoordinateCache
              );
            }
          }

          // Regenerate the map data with the saved biome
          const worldCoords = { x: originX, y: originY };
          procGenData.generatedMapData = window.generateProceduralTerrain(
            biomeObj,
            seed,
            roadDirection,
            adjacentBiomes,
            cacheInfo,
            worldCoords,
            procGenData.biomeCoordinateCache
          );

          // Restore all biome data to procGenData
          procGenData.currentBiome = savedBiome.currentBiome;
          procGenData.currentRoadDirection = savedBiome.currentRoadDirection;
          procGenData.currentBiomeTileset = savedBiome.currentBiomeTileset;
          procGenData.originX = savedBiome.originX;
          procGenData.originY = savedBiome.originY;
          procGenData.seed = savedBiome.seed;
          procGenData.displayAsBeach = savedBiome.displayAsBeach;
          procGenData.biomeDayTemperature = savedBiome.biomeDayTemperature;
          procGenData.biomeNightTemperature = savedBiome.biomeNightTemperature;

          // Reset the loaded coordinates to force map reload
          procGenData.lastLoadedProcMapX = null;
          procGenData.lastLoadedProcMapY = null;

          console.log("[TreasureRoomSystem] Map regeneration complete, biome data restored");
        } else {
          console.warn("[TreasureRoomSystem] Could not regenerate - missing biome or generation function");
        }
      }

      // Teleport to tile south of the event that triggered the house visit
      $gamePlayer.reserveTransfer(returnPoint.mapId, returnPoint.eventX, returnPoint.eventY + 1, 2, 0);
      delete houseReturnPoints[currentHouseSessionId];
      currentHouseSessionId = null;
      currentMultiBuilding = null;
      // Clear house seed when exiting
      window.TreasureRoomSystem.currentHouseSeed = null;
    } else {
      console.error("No return point for current session.");
    }
  }

  //=============================================================================
  // Scene_Map Overrides for Post-Transfer Logic
  //=============================================================================
  const _Scene_Map_onMapLoaded = Scene_Map.prototype.onMapLoaded;
  Scene_Map.prototype.onMapLoaded = function() {
      _Scene_Map_onMapLoaded.call(this);

      if (_postTransferActions) {
          const actions = _postTransferActions;
          
          switch(actions.type) {
              case 'treasureRoom':
              case 'house':
              case 'multiBuildingEnter':
                  const pos = findPositionWithRegionId(actions.spawnRegionId);
                  const dirTag = actions.type === 'treasureRoom' ? 'treasureRoomDirection' : 'houseDirection';
                  const mapDir = getMapDirection(dirTag);

                  $gamePlayer.locate(pos.x, pos.y);
                  $gamePlayer.setDirection(mapDir !== null ? mapDir : actions.originalDirection);

                  if (actions.type === 'house') {
                    // Hide both stair events when visiting a house normally
                    const upstairsEvent = findEventByName("Upstairs");
                    const downstairsEvent = findEventByName("Downstairs");
                    if (upstairsEvent) {
                        $gameMap.event(upstairsEvent.eventId()).erase();
                    }
                    if (downstairsEvent) {
                        $gameMap.event(downstairsEvent.eventId()).erase();
                    }
                    $gameMap.refresh();

                    // Generate house-appropriate furniture
                    if ($gameSystem.generateHouseFurniture) {
                        $gameSystem.generateHouseFurniture(actions.seed);
                    }

                    currentMultiBuilding = null;
                } else if (actions.type === 'multiBuildingEnter') {
                      updateStairVisibility();

                      // Generate house-appropriate furniture for multi-building floors
                      if ($gameSystem.generateHouseFurniture) {
                          $gameSystem.generateHouseFurniture(actions.seed);
                      }
                  }
                  break;

              case 'floorChange':
                  const eventName = actions.direction === 'next' ? "Downstairs" : "Upstairs";
                  const event = findEventByName(eventName);
                  if (event) {
                      $gamePlayer.locate(event.x, event.y);
                  }
                  updateStairVisibility();

                  // Generate house-appropriate furniture for the new floor
                  if ($gameSystem.generateHouseFurniture) {
                      $gameSystem.generateHouseFurniture(actions.seed);
                  }
                  break;
          }
          _postTransferActions = null;
      }
  };

  //=============================================================================
  // DataManager Hooks - Initialize pools after data is loaded
  //=============================================================================
  const _DataManager_onLoad = DataManager.onLoad;
  DataManager.onLoad = function(object) {
    _DataManager_onLoad.call(this, object);
    
    // When MapInfos is loaded, initialize house pools and treasure rooms
    if (object === $dataMapInfos) {
      if (!housePoolsInitialized) {
        console.log("TreasureRoomSystem: MapInfos loaded, initializing house pools...");
        ensureHousePoolsInitialized();
      }
      if (!treasureRoomListInitialized) {
        console.log("TreasureRoomSystem: MapInfos loaded, initializing treasure rooms...");
        ensureTreasureRoomsInitialized();
      }
    }
  };

  //=============================================================================
  // Save & Load Management
  //=============================================================================

  const _DataManager_setupNewGame = DataManager.setupNewGame;
  DataManager.setupNewGame = function () {
    _DataManager_setupNewGame.call(this);
    Object.keys(visitedTreasureRooms).forEach(k => delete visitedTreasureRooms[k]);
    Object.keys(treasureRoomReturnPoints).forEach(k => delete treasureRoomReturnPoints[k]);
    Object.keys(houseReturnPoints).forEach(k => delete houseReturnPoints[k]);
    Object.keys(multiBuildingStructures).forEach(k => delete multiBuildingStructures[k]);
    currentHouseSessionId = null;
    currentMultiBuilding = null;
    window.TreasureRoomSystem.currentHouseSeed = null;
  };

  const _DataManager_makeSaveContents = DataManager.makeSaveContents;
  DataManager.makeSaveContents = function () {
    const contents = _DataManager_makeSaveContents.call(this);
    contents.treasureRoomSystem = {
      visitedTreasureRooms: visitedTreasureRooms,
      treasureRoomReturnPoints: treasureRoomReturnPoints,
      houseReturnPoints: houseReturnPoints,
      multiBuildingStructures: multiBuildingStructures,
      currentHouseSessionId: currentHouseSessionId,
      currentMultiBuilding: currentMultiBuilding,
    };
    return contents;
  };

  const _DataManager_extractSaveContents = DataManager.extractSaveContents;
  DataManager.extractSaveContents = function (contents) {
    _DataManager_extractSaveContents.call(this, contents);
    if (contents.treasureRoomSystem) {
        const system = contents.treasureRoomSystem;
        Object.assign(visitedTreasureRooms, system.visitedTreasureRooms || {});
        Object.assign(treasureRoomReturnPoints, system.treasureRoomReturnPoints || {});
        Object.assign(houseReturnPoints, system.houseReturnPoints || {});
        Object.assign(multiBuildingStructures, system.multiBuildingStructures || {});
        currentHouseSessionId = system.currentHouseSessionId || null;
        currentMultiBuilding = system.currentMultiBuilding || null;
    }
  };

  //=============================================================================
  // Network Synchronization (Example integration)
  //=============================================================================
  window.TreasureRoomSystem.getNetworkData = function () {
    return {
      visitedTreasureRooms: visitedTreasureRooms,
    };
  };

  window.TreasureRoomSystem.syncFromNetwork = function (data) {
    if (data.visitedTreasureRooms) {
      Object.assign(visitedTreasureRooms, data.visitedTreasureRooms);
    }
  };

  window.TreasureRoomSystem.handlePeerVisit = function (data) {
    if (!visitedTreasureRooms[data.locationKey]) {
      visitedTreasureRooms[data.locationKey] = data.treasureRoomId;
    }
  };
})();
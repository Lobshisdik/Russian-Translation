/*:
 * @target MZ
 * @plugindesc World Map Visualizer v1.4.1 (VRAM Optimized)
 * @author Omni-Lex (with VRAM optimizations)
 * @url
 * @help
 * ============================================================================
 * World Map Visualizer Plugin for RPG Maker MZ (VRAM Optimized)
 * ============================================================================
 *
 * This plugin creates an interactive world map that shows all game maps
 * and their connections.
 *
 * v1.4.1 (VRAM Optimizations):
 * - Compass only created when needed (destination is set)
 * - Pre-calculates waypoint coordinates to avoid constant event searching
 * - Compass only active on maps that are part of the current path
 * - Significantly reduced VRAM usage and processing overhead
 *
 * v1.4.0 (Enhancements):
 * - Click a map node to select it as a destination. The shortest path from
 * your current location will be highlighted in green.
 * - When a destination is selected, an in-game compass will appear on the
 * top-right of the screen, pointing to the nearest event on your path.
 * - Compass is hidden when you reach the destination or deselect the map.
 * - Destination selection is remembered when you close and reopen the map.
 *
 * Features:
 * - Zoomable and pannable world map
 * - Uniformly sized map nodes
 * - Auto-centering on the current map
 * - Reads Transfer Player events and events starting with "Door"
 * - Menu command integration
 * - Display depth limit from current map
 * - Special "Teleport Hub" view for a designated map
 * - Shortest path highlighting
 * - Memory-efficient in-game destination compass
 *
 * @param menuCommandName
 * @text Menu Command Name
 * @desc Name of the command in the main menu
 * @type string
 * @default World Map
 *
 * @param enableMenuCommand
 * @text Enable Menu Command
 * @desc Add world map command to main menu
 * @type boolean
 * @default true
 *
 * @param nodeWidth
 * @text Map Node Width
 * @desc The width of each map node on the visualizer.
 * @type number
 * @default 180
 *
 * @param nodeHeight
 * @text Map Node Height
 * @desc The height of each map node on the visualizer.
 * @type number
 * @default 180
 *
 * @param unvisitedMapName
 * @text Unvisited Map Name
 * @desc Text shown for unvisited maps
 * @type string
 * @default ???
 *
 * @param backgroundColor
 * @text Background Color
 * @desc Background color of the world map (hex)
 * @type string
 * @default #1a1a1a
 *
 * @param gridColor
 * @text Grid Color
 * @desc Color of the background grid (hex)
 * @type string
 * @default #2a2a2a
 *
 * @param displayDepth
 * @text Display Depth
 * @desc The depth of connections to show from the current map. 0 for all.
 * @type number
 * @default 2
 *
 * @param ignoredMaps
 * @text Ignored Maps
 * @desc Comma-separated list of Map IDs to ignore for connections.
 * @type string
 * @default 3,315
 *
 * @param teleportHubId
 * @text Teleport Hub ID
 * @desc The ID of the map that acts as a special teleport hub.
 * @type number
 * @default 315
 *
 * @param useHardcodedConnections
 * @text Use Hardcoded Connections
 * @desc Use pre-generated connection data instead of runtime analysis
 * @type boolean
 * @default false
 *
 * @command generateConnectionsJSON
 * @text Generate Connections JSON
 * @desc Analyzes all maps and outputs complete connection data to console
 *
 * @command clearConnectionCache
 * @text Clear Connection Cache
 * @desc Clears cached connection data to force rebuild on next use
 *
 * @command showConnectionStats
 * @text Show Connection Statistics
 * @desc Displays connection statistics and performance information
 *
 * @command openWorldMap
 * @text Open World Map
 * @desc Opens the world map visualizer
 */

(() => {
  "use strict";

  const pluginName = "MZ_WorldMapVisualizer";
  const parameters = PluginManager.parameters(pluginName);
  const requiredItemIds = [111, 324, 366]; 
  const menuCommandName = parameters["menuCommandName"] || "World Map";
  const enableMenuCommand = parameters["enableMenuCommand"] === "true";
  const nodeWidth = Number(parameters["nodeWidth"]) || 180;
  const nodeHeight = Number(parameters["nodeHeight"]) || 180;
  const unvisitedMapName = parameters["unvisitedMapName"] || "???";
  const backgroundColor = parameters["backgroundColor"] || "#1a1a1a";
  const gridColor = parameters["gridColor"] || "#2a2a2a";
  const displayDepth = Number(parameters["displayDepth"]) || 0;
  const ignoredMapIds = (parameters["ignoredMaps"] || "")
    .split(",")
    .map(Number)
    .filter((id) => id > 0);
  const teleportHubId = Number(parameters["teleportHubId"]) || 0;
  const useHardcodedConnections =
    parameters["useHardcodedConnections"] === "true";

  // Add this hardcoded connections data structure (replace with your generated JSON):
  const HARDCODED_CONNECTIONS = {
    1: [1, 7, 101, 102, 138, 141, 303, 315, 532],
    3: [7, 102, 300],
    4: [103],
    7: [1, 3, 7, 102, 136, 303, 314, 349, 497],
    9: [3],
    12: [3, 139, 477, 634, 635],
    13: [3, 347, 437],
    14: [3, 337, 431, 432],
    15: [3, 140, 348, 543, 546],
    16: [3, 16, 429, 476, 550, 552],
    17: [3],
    18: [3, 339, 433, 479, 555],
    19: [3, 332, 408],
    20: [3, 344],
    21: [3, 21, 334, 335, 336, 440, 482],
    22: [3, 333, 436, 696],
    23: [3, 346, 350],
    24: [3, 76],
    25: [3],
    26: [3, 340],
    27: [3, 326],
    28: [3],
    29: [3, 443],
    30: [3, 316],
    31: [3, 164, 425, 426],
    32: [3, 345, 428],
    33: [3, 299],
    34: [3, 328, 674, 683],
    35: [3, 35],
    36: [3],
    37: [3],
    38: [3],
    39: [3],
    40: [3],
    41: [3],
    42: [3],
    43: [3],
    44: [3],
    45: [3],
    46: [3],
    47: [3],
    48: [3],
    49: [3],
    50: [3],
    51: [3],
    52: [3],
    53: [3],
    54: [3],
    55: [3],
    56: [3, 56, 351],
    57: [3],
    58: [3],
    59: [3],
    60: [3],
    63: [622, 626],
    76: [24],
    99: [3, 99, 329, 330, 478],
    101: [3, 324, 325, 404, 405],
    102: [1, 3, 7, 102, 506, 508, 558, 566, 567, 568, 569, 570, 572],
    111: [3],
    112: [3],
    113: [3],
    114: [3],
    115: [3],
    116: [3],
    117: [3],
    118: [3],
    119: [3],
    120: [3],
    121: [3],
    122: [3],
    123: [3],
    124: [3],
    125: [3],
    136: [7, 315],
    137: [141],
    138: [1, 300, 304, 319, 320, 321, 322, 323],
    139: [12],
    140: [15, 348],
    141: [1, 141, 313, 314, 498, 503, 563],
    143: [301],
    148: [148],
    155: [155],
    164: [31],
    299: [33],
    300: [3, 138],
    301: [143],
    302: [7, 138],
    303: [1, 7, 305, 307, 308, 309, 310, 311, 312, 635],
    304: [138],
    305: [303],
    306: [3],
    307: [303, 501, 502],
    308: [303],
    309: [303],
    310: [303],
    311: [303],
    312: [303],
    313: [141],
    314: [7, 141],
    315: [
      1, 136, 300, 302, 303, 352, 397, 619, 689, 704, 715, 722, 727, 1023, 1036,
    ],
    316: [30],
    317: [102, 352],
    319: [138],
    320: [138, 320],
    321: [138],
    322: [138],
    323: [138],
    324: [101],
    325: [101],
    326: [27],
    328: [34],
    329: [99],
    330: [99],
    331: [12],
    332: [19, 697],
    333: [22],
    334: [21, 334],
    335: [21],
    336: [21, 481],
    337: [14],
    339: [18],
    340: [26, 445],
    344: [20, 407],
    345: [32, 345],
    346: [23],
    347: [13],
    348: [15, 140, 406, 543, 548],
    349: [7, 631, 632],
    350: [23],
    351: [56],
    356: [357, 359],
    357: [356],
    359: [356],
    397: [1044],
    402: [3, 138, 315],
    404: [101],
    405: [101],
    406: [348, 406],
    407: [344],
    408: [19],
    421: [3],
    425: [31],
    426: [31, 427],
    427: [426, 685],
    428: [32],
    429: [16, 429],
    431: [14],
    432: [14],
    433: [18],
    436: [22, 436],
    437: [13],
    440: [21],
    443: [29],
    445: [340, 690],
    474: [548],
    476: [16],
    477: [12],
    478: [99],
    479: [18, 480],
    480: [479],
    481: [336],
    482: [21],
    483: [23],
    497: [7, 531, 532],
    498: [141],
    501: [307],
    502: [307],
    503: [141, 504, 505, 541],
    504: [503, 538],
    505: [503, 505, 539],
    506: [102, 569, 575, 577, 584],
    508: [102],
    529: [532],
    531: [7, 497],
    532: [1, 497, 533],
    533: [532, 535],
    535: [533],
    538: [504],
    539: [505],
    540: [563, 635],
    541: [503],
    543: [15, 348],
    546: [15, 546, 547],
    547: [546, 547],
    548: [348, 474],
    550: [16],
    551: [16],
    552: [16],
    553: [16, 552, 554],
    554: [553],
    555: [18, 556],
    556: [555],
    557: [708],
    558: [102, 559, 560, 561, 562, 563, 564],
    559: [558],
    560: [558],
    561: [558],
    562: [558],
    563: [141, 540, 558, 563, 630],
    564: [558],
    566: [102, 315, 571, 572, 573],
    567: [102],
    568: [102, 675, 677],
    569: [102, 506, 576],
    570: [102],
    571: [566],
    572: [102, 566],
    573: [566],
    574: [3, 352],
    575: [506],
    576: [569],
    577: [506],
    578: [3, 4, 7, 9, 10],
    579: [7],
    580: [7],
    581: [7],
    583: [4],
    584: [506, 585],
    585: [584, 586],
    586: [585],
    620: [621],
    621: [620],
    622: [623, 629],
    623: [622],
    624: [63, 624],
    625: [141, 558, 563],
    626: [63],
    629: [622],
    630: [563, 631, 679],
    631: [349, 630, 635],
    632: [349],
    634: [12],
    635: [303, 540, 631],
    674: [34, 674],
    675: [568, 676],
    676: [675],
    677: [568],
    679: [630, 680, 681],
    680: [679],
    681: [679, 680],
    683: [34],
    685: [427],
    688: [621],
    689: [
      315, 700, 701, 702, 703, 704, 705, 711, 712, 714, 715, 716, 724, 725, 726,
      991, 1003, 1006, 1011, 1023, 1035, 1036,
    ],
    690: [445],
    693: [694],
    694: [693],
    696: [22],
    697: [332, 698],
    698: [697],
    700: [689],
    701: [689],
    702: [689],
    703: [689, 1009],
    704: [689, 704, 708, 715, 723, 1010, 1023, 1033, 1035, 1036, 1040],
    705: [689, 706],
    706: [705],
    708: [704, 709, 710, 1022, 1034],
    709: [708, 1022],
    710: [708, 1040],
    711: [689, 712, 713],
    712: [689, 711],
    713: [711],
    714: [689, 715],
    715: [164, 689, 714, 992, 995],
    716: [689],
    722: [722, 728, 988],
    723: [704, 723],
    724: [689],
    725: [689],
    726: [689],
    728: [722],
    988: [722],
    989: [722],
    990: [722],
    991: [689],
    992: [715, 992],
    993: [715],
    994: [715],
    995: [715],
    996: [715],
    1003: [689],
    1006: [689],
    1009: [703],
    1010: [704],
    1011: [689],
    1022: [708, 709, 1022],
    1023: [689, 704, 715, 1035, 1036],
    1033: [704, 1035, 1051, 1058],
    1034: [708, 1039, 1045],
    1035: [689, 704, 715, 1023, 1033, 1036, 1041, 1042],
    1036: [689, 1023, 1050, 1053, 1055],
    1037: [1035],
    1038: [1035],
    1039: [1034, 1040],
    1040: [704, 710, 1039],
    1041: [1035],
    1042: [1035],
    1043: [1044],
    1044: [397, 1043],
    1045: [1034],
    1050: [1036],
    1051: [1033, 1058],
    1053: [1036],
    1055: [1036],
    1058: [1033, 1051],
  };
  // ============================================================================
  // NEW: Enhanced Game System for Compass Optimization
  // ============================================================================

  const _Game_System_initialize = Game_System.prototype.initialize;
  Game_System.prototype.initialize = function () {
    _Game_System_initialize.call(this);
    this._visitedMaps = this._visitedMaps || new Set();
    this._worldMapDestinationId = this._worldMapDestinationId || null;

    // Clear cached graph when switching between hardcoded/runtime modes
    this._mapConnectionGraph = null;

    // NEW: Compass optimization data
    this._compassWaypoints = this._compassWaypoints || new Map();
    this._compassActiveMaps = this._compassActiveMaps || new Set();
  };

  // NEW: Enhanced player transfer with compass management
  // Replace the existing Game_Player.performTransfer method with this fixed version:

  const _Game_Player_performTransfer = Game_Player.prototype.performTransfer;
  Game_Player.prototype.performTransfer = function () {
    const oldMapId = this._newMapId;
    _Game_Player_performTransfer.call(this);

    // Ensure _visitedMaps is properly initialized as a Set
    if (
      !$gameSystem._visitedMaps ||
      !($gameSystem._visitedMaps instanceof Set)
    ) {
      $gameSystem._visitedMaps = new Set();
    }

    $gameSystem._visitedMaps.add($gameMap.mapId());

    // NEW: Update compass when map changes
    this.updateCompassOnMapChange();
  };

  // NEW: Compass update logic
  // Replace the existing updateCompassOnMapChange method with this fixed version:

  Game_Player.prototype.updateCompassOnMapChange = function () {
    const scene = SceneManager._scene;
    if (!(scene instanceof Scene_Map)) return;

    const currentMapId = $gameMap.mapId();

    // Ensure _compassActiveMaps is properly initialized as a Set
    if (
      !$gameSystem._compassActiveMaps ||
      !($gameSystem._compassActiveMaps instanceof Set)
    ) {
      $gameSystem._compassActiveMaps = new Set();
    }

    const shouldShowCompass =
      $gameSystem._compassActiveMaps.has(currentMapId) &&
      $gameSystem._worldMapDestinationId &&
      $gameSystem._worldMapDestinationId !== currentMapId;

    if (shouldShowCompass && !scene._compassSprite) {
      scene.createCompassSprite();
    } else if (!shouldShowCompass && scene._compassSprite) {
      scene.removeCompassSprite();
    }

    if (scene._compassSprite) {
      scene._compassSprite.onMapChange();
    }
  };
  function generateCompleteConnectionsJSON() {
    const connections = {};

    // Iterate through all map data
    for (let i = 1; i < $dataMapInfos.length; i++) {
      if (!$dataMapInfos[i]) continue;

      console.log(`Analyzing Map ${i}: ${$dataMapInfos[i].name}`);

      const mapData = loadMapDataForGraph(i);
      if (mapData && mapData.events) {
        const mapConnections = [];

        for (const event of mapData.events) {
          if (!event || !event.pages) continue;

          for (const page of event.pages) {
            if (!page.list) continue;

            for (const command of page.list) {
              if (command.code === 201 && command.parameters[0] === 0) {
                const targetMapId = command.parameters[1];

                // Skip ignored maps and invalid targets
                if (
                  !ignoredMapIds.includes(targetMapId) &&
                  $dataMapInfos[targetMapId] &&
                  !mapConnections.includes(targetMapId)
                ) {
                  mapConnections.push(targetMapId);
                }
              }
            }
          }
        }

        if (mapConnections.length > 0) {
          connections[i] = mapConnections.sort((a, b) => a - b); // Sort for consistency
          console.log(`Map ${i} connects to: [${mapConnections.join(", ")}]`);
        }
      }
    }

    console.log(
      `Total maps with connections: ${Object.keys(connections).length}`
    );
    return connections;
  }

  // UPDATED: Enhanced buildCompleteConnectionGraph to use hardcoded data
  function buildCompleteConnectionGraph() {
    if ($gameSystem._mapConnectionGraph) {
      return $gameSystem._mapConnectionGraph;
    }
  
    console.log("Building connection graph...");
  
    let sourceConnections;
  
    if (useHardcodedConnections && HARDCODED_CONNECTIONS) {
      console.log("Using hardcoded connection data");
      sourceConnections = HARDCODED_CONNECTIONS;
    } else {
      console.log("Generating connections at runtime (slower)");
      sourceConnections = generateCompleteConnectionsJSON();
    }
  
    // Convert to bidirectional graph
    const graph = new Map();
  
    // Initialize all maps
    for (let i = 1; i < $dataMapInfos.length; i++) {
      if ($dataMapInfos[i]) {
        graph.set(i, new Set());
      }
    }
  
    // Add connections (bidirectional) with filtering
    for (const [mapIdStr, connections] of Object.entries(sourceConnections)) {
      const mapId = parseInt(mapIdStr);
  
      if (!graph.has(mapId)) continue;
  
      for (const targetMapId of connections) {
        if (!graph.has(targetMapId)) continue;
  
        // Skip connections between maps 3 and 315
        if ((mapId === 3 && targetMapId === 315) || (mapId === 315 && targetMapId === 3)) {
          continue;
        }
  
        // Add bidirectional connections
        graph.get(mapId).add(targetMapId);
        graph.get(targetMapId).add(mapId);
      }
    }
  
    // Convert Sets to Arrays for final storage
    const finalGraph = new Map();
    for (const [mapId, connections] of graph) {
      if (connections.size > 0) {
        finalGraph.set(mapId, Array.from(connections));
      }
    }
  
    console.log("Built connection graph:", finalGraph);
    console.log(
      `Performance: Using ${
        useHardcodedConnections ? "hardcoded" : "runtime"
      } connection analysis`
    );
  
    $gameSystem._mapConnectionGraph = finalGraph;
    return finalGraph;
  }
  // ============================================================================
  // Pathfinding and Graph Logic (unchanged)
  // ============================================================================

  function loadMapDataForGraph(mapId) {
    const filename = "Map%1.json".format(String(mapId).padZero(3));
    try {
      const xhr = new XMLHttpRequest();
      xhr.open("GET", "data/" + filename, false);
      xhr.overrideMimeType("application/json");
      xhr.send();
      if (xhr.status === 200) {
        return JSON.parse(xhr.responseText);
      }
    } catch (e) {
      // Error loading is fine, just means no connections from that map
    }
    return null;
  }

  function buildCompleteConnectionGraph() {
    if ($gameSystem._mapConnectionGraph) {
      return $gameSystem._mapConnectionGraph;
    }

    const graph = new Map();

    for (let i = 1; i < $dataMapInfos.length; i++) {
      if ($dataMapInfos[i]) {
        graph.set(i, new Set());
      }
    }

    for (let i = 1; i < $dataMapInfos.length; i++) {
      if (!$dataMapInfos[i]) continue;

      const mapData = loadMapDataForGraph(i);
      if (mapData && mapData.events) {
        for (const event of mapData.events) {
          if (!event || !event.pages) continue;
          for (const page of event.pages) {
            if (!page.list) continue;
            for (const command of page.list) {
              if (command.code === 201 && command.parameters[0] === 0) {
                const targetMapId = command.parameters[1];
                if (
                  !ignoredMapIds.includes(targetMapId) &&
                  $dataMapInfos[targetMapId]
                ) {
                  if (!graph.has(i)) graph.set(i, new Set());
                  if (!graph.has(targetMapId))
                    graph.set(targetMapId, new Set());

                  graph.get(i).add(targetMapId);
                  graph.get(targetMapId).add(i);
                }
              }
            }
          }
        }
      }
    }

    const finalGraph = new Map();
    for (const [mapId, connections] of graph) {
      if (connections.size > 0) {
        finalGraph.set(mapId, Array.from(connections));
      }
    }

    console.log("Built connection graph:", finalGraph);
    $gameSystem._mapConnectionGraph = finalGraph;
    return finalGraph;
  }

  function findShortestPath(startId, endId) {
    console.log(`Finding shortest path from ${startId} to ${endId}`);

    if (startId === endId) {
      return [startId];
    }

    const completeGraph = buildCompleteConnectionGraph();
    console.log("Using graph:", completeGraph);

    const queue = [[startId]];
    const visited = new Set([startId]);

    while (queue.length > 0) {
      const path = queue.shift();
      const currentMapId = path[path.length - 1];

      if (currentMapId === endId) {
        console.log("Found path:", path);
        return path;
      }

      const neighbors = completeGraph.get(currentMapId) || [];
      console.log(`Neighbors of ${currentMapId}:`, neighbors);

      for (const neighbor of neighbors) {
        if (!visited.has(neighbor)) {
          visited.add(neighbor);
          const newPath = [...path, neighbor];
          queue.push(newPath);
        }
      }
    }

    console.log("No path found");
    return [];
  }

  // NEW: Optimized waypoint calculation - collapses multiple transfers to same map
  // Replace the existing calculateCompassWaypoints function with this fixed version:

  function calculateCompassWaypoints(path) {
    // Ensure proper initialization as Map and Set
    if (
      !$gameSystem._compassWaypoints ||
      !($gameSystem._compassWaypoints instanceof Map)
    ) {
      $gameSystem._compassWaypoints = new Map();
    }
    if (
      !$gameSystem._compassActiveMaps ||
      !($gameSystem._compassActiveMaps instanceof Set)
    ) {
      $gameSystem._compassActiveMaps = new Set();
    }

    const waypoints = new Map();
    const activeMaps = new Set();

    if (!path || path.length < 2) {
      $gameSystem._compassWaypoints = waypoints;
      $gameSystem._compassActiveMaps = activeMaps;
      return;
    }

    // For each map in the path (except the last), find the optimal transfer to the next map
    for (let i = 0; i < path.length - 1; i++) {
      const currentMapId = path[i];
      const nextMapId = path[i + 1];
      activeMaps.add(currentMapId);

      const mapData = loadMapDataForGraph(currentMapId);
      if (mapData && mapData.events) {
        // Collapse all transfers to the same destination into groups
        const transferGroups = new Map(); // targetMapId -> [{x, y, distance}, ...]

        for (const event of mapData.events) {
          if (!event || !event.pages) continue;

          for (const page of event.pages) {
            if (!page.list) continue;

            for (const command of page.list) {
              if (command.code === 201 && command.parameters[0] === 0) {
                const targetMapId = command.parameters[1];

                // Only process if this transfer leads to our next destination
                if (targetMapId === nextMapId) {
                  const distance = Math.sqrt(
                    event.x * event.x + event.y * event.y
                  );

                  if (!transferGroups.has(targetMapId)) {
                    transferGroups.set(targetMapId, []);
                  }

                  transferGroups.get(targetMapId).push({
                    x: event.x,
                    y: event.y,
                    distance: distance,
                  });
                }
              }
            }
          }
        }

        // For each destination, find the nearest transfer event
        for (const [targetMapId, transfers] of transferGroups) {
          if (transfers.length === 0) continue;

          // Find the transfer with minimum distance (closest to map origin/center)
          const nearestTransfer = transfers.reduce((nearest, current) => {
            return current.distance < nearest.distance ? current : nearest;
          });

          // Only store waypoint for our intended next map
          if (targetMapId === nextMapId) {
            waypoints.set(currentMapId, {
              x: nearestTransfer.x,
              y: nearestTransfer.y,
              targetMapId: targetMapId,
            });

            console.log(
              `Map ${currentMapId}: Collapsed ${transfers.length} transfers to map ${targetMapId} into waypoint at (${nearestTransfer.x}, ${nearestTransfer.y})`
            );
            break; // Found our waypoint for this map, move to next
          }
        }
      }
    }

    console.log("Optimized compass waypoints:", waypoints);
    console.log("Active compass maps:", activeMaps);
    console.log(
      `Waypoint optimization: Reduced from potential ${
        path.length - 1
      } maps to ${waypoints.size} actual waypoints`
    );

    $gameSystem._compassWaypoints = waypoints;
    $gameSystem._compassActiveMaps = activeMaps;
  }

  // Plugin command registration
  PluginManager.registerCommand(pluginName, "openWorldMap", () => {
    SceneManager.push(Scene_WorldMap);
  });
  PluginManager.registerCommand(pluginName, "generateConnectionsJSON", () => {
    console.log("=== GENERATING MAP CONNECTIONS JSON ===");
    console.log("Analyzing all maps in the game...");

    const allConnections = generateCompleteConnectionsJSON();

    console.log("=== COPY THIS JSON TO HARDCODED_CONNECTIONS ===");
    console.log(JSON.stringify(allConnections, null, 2));
    console.log("=== END OF JSON DATA ===");

    $gameMessage.add("Map connections JSON generated in console!");
    $gameMessage.add(
      "Check the developer console (F12) for the complete JSON."
    );
  });
  PluginManager.registerCommand(pluginName, "clearConnectionCache", () => {
    $gameSystem._mapConnectionGraph = null;
    console.log(
      "Connection cache cleared. Next map analysis will rebuild from source."
    );
    $gameMessage.add("Connection cache cleared!");
  });
  PluginManager.registerCommand(pluginName, "showConnectionStats", () => {
    const graph = buildCompleteConnectionGraph();

    let totalMaps = 0;
    let totalConnections = 0;
    let maxConnections = 0;
    let maxConnectionsMap = 0;

    for (const [mapId, connections] of graph) {
      totalMaps++;
      const connectionCount = connections.length;
      totalConnections += connectionCount;

      if (connectionCount > maxConnections) {
        maxConnections = connectionCount;
        maxConnectionsMap = mapId;
      }
    }

    console.log("=== CONNECTION STATISTICS ===");
    console.log(`Total maps with connections: ${totalMaps}`);
    console.log(`Total connection pairs: ${totalConnections / 2}`); // Divide by 2 since bidirectional
    console.log(
      `Average connections per map: ${(totalConnections / totalMaps).toFixed(
        2
      )}`
    );
    console.log(
      `Most connected map: ${maxConnectionsMap} (${maxConnections} connections)`
    );
    console.log(
      `Using ${useHardcodedConnections ? "hardcoded" : "runtime"} analysis`
    );

    $gameMessage.add(
      `Map Stats: ${totalMaps} maps, ${Math.floor(
        totalConnections / 2
      )} connections`
    );
    $gameMessage.add(
      `Most connected: Map ${maxConnectionsMap} (${maxConnections} links)`
    );
    $gameMessage.add(
      `Mode: ${useHardcodedConnections ? "Hardcoded" : "Runtime"} analysis`
    );
  });
  // Add menu command if enabled
if (enableMenuCommand) {
  const _Window_MenuCommand_addOriginalCommands =
    Window_MenuCommand.prototype.addOriginalCommands;
  Window_MenuCommand.prototype.addOriginalCommands = function () {
    _Window_MenuCommand_addOriginalCommands.call(this);
    
    // Check if player has any of the required items
    const hasRequiredItem = requiredItemIds.some(itemId => {
      const item = $dataItems[itemId];
      return item && $gameParty.hasItem(item);
    });
    
    if (hasRequiredItem) {
      this.addCommand(menuCommandName, "worldMap", true, 190);
    }
  };

  const _Scene_Menu_createCommandWindow =
    Scene_Menu.prototype.createCommandWindow;
  Scene_Menu.prototype.createCommandWindow = function () {
    _Scene_Menu_createCommandWindow.call(this);
    this._commandWindow.setHandler(
      "worldMap",
      this.commandWorldMap.bind(this)
    );
  };

  Scene_Menu.prototype.commandWorldMap = function () {
    SceneManager.push(Scene_WorldMap);
  };
}

  // World Map Scene (most unchanged, key additions marked with NEW)
  class Scene_WorldMap extends Scene_Base {
    create() {
      super.create();
      this.createBackground();
      this.createWorldMapSprite();
      this.createWindowLayer();
      this.createInfoWindow();
      this.createHelpWindow();

      this._currentDepth = displayDepth;
      this._highlightedPath = [];
      this._isDragging = false;
      this._lastX = 0;
      this._lastY = 0;
      this._dragStartX = 0;
      this._dragStartY = 0;

      this._highlightedPath = [];

      if ($gameMap && $gameMap.mapId() > 0) {
        this.analyzeMapConnections();

        if ($gameSystem._worldMapDestinationId) {
          this.updateAndHighlightPath();
        }

        this.centerOnCurrentMap();
        this.setupZoomAndPan();
      } else {
        this._helpWindow.setText(
          "Cannot display map. No map is currently loaded."
        );
      }
    }

    // NEW: Enhanced to calculate compass waypoints
    updateAndHighlightPath() {
      console.log("=== UPDATE AND HIGHLIGHT PATH ===");
      const destinationId = $gameSystem._worldMapDestinationId;
      console.log("Destination ID:", destinationId);

      if (destinationId) {
        const currentMapId = $gameMap.mapId();
        console.log(`Finding path from ${currentMapId} to ${destinationId}`);

        $gameSystem._mapConnectionGraph = null;
        const path = findShortestPath(currentMapId, destinationId);
        console.log("Found path:", path);
        this._highlightedPath = path;

        // NEW: Calculate compass waypoints
        calculateCompassWaypoints(path);

        // NEW: Update compass in current scene if needed
        if (SceneManager._scene instanceof Scene_Map) {
          $gamePlayer.updateCompassOnMapChange();
        }
      } else {
        console.log("No destination, clearing path");
        this._highlightedPath = [];

        // NEW: Clear compass data
        $gameSystem._compassWaypoints = new Map();
        $gameSystem._compassActiveMaps = new Set();

        // NEW: Remove compass if it exists
        if (
          SceneManager._scene instanceof Scene_Map &&
          SceneManager._scene._compassSprite
        ) {
          SceneManager._scene.removeCompassSprite();
        }
      }

      console.log("Current highlighted path:", this._highlightedPath);
      this.drawWorldMap();
    }

    // Rest of the Scene_WorldMap methods remain unchanged...
    centerOnCurrentMap() {
      const currentMapId = $gameMap.mapId();
      if (this._mapPositions && this._mapPositions.has(currentMapId)) {
        const pos = this._mapPositions.get(currentMapId);
        const nodeCenterX = pos.x + pos.width / 2;
        const nodeCenterY = pos.y + pos.height / 2;
        const bitmapCenterX = this._worldMapSprite.bitmap.width / 2;
        const bitmapCenterY = this._worldMapSprite.bitmap.height / 2;
        this._offsetX = -(nodeCenterX - bitmapCenterX);
        this._offsetY = -(nodeCenterY - bitmapCenterY);
        this.updateWorldMapPosition();
      }
    }

    createWindowLayer() {
      this._windowLayer = new WindowLayer();
      this._windowLayer.x = (Graphics.width - Graphics.boxWidth) / 2;
      this._windowLayer.y = (Graphics.height - Graphics.boxHeight) / 2;
      this.addChild(this._windowLayer);
    }

    createBackground() {
      this._backgroundSprite = new Sprite();
      this._backgroundSprite.bitmap = new Bitmap(
        Graphics.width,
        Graphics.height
      );
      this._backgroundSprite.bitmap.fillAll(backgroundColor);
      this.addChild(this._backgroundSprite);
    }

    createWorldMapSprite() {
      this._worldMapSprite = new Sprite();
      this._worldMapSprite.bitmap = new Bitmap(8000, 8000);
      this._worldMapSprite.anchor.x = 0.5;
      this._worldMapSprite.anchor.y = 0.5;
      this._worldMapSprite.x = Graphics.width / 2;
      this._worldMapSprite.y = Graphics.height / 2;
      this.addChild(this._worldMapSprite);
      this._scale = 1.0;
      this._offsetX = 0;
      this._offsetY = 0;
    }

    createInfoWindow() {
      const rect = new Rectangle(Graphics.width - 320, 56, 320, 400);
      this._infoWindow = new Window_MapInfo(rect);
      this._infoWindow.hide();
      this._windowLayer.addChild(this._infoWindow);
    }

    createHelpWindow() {
      const lineHeight = 36;
      const padding = 18;
      const height = lineHeight + padding * 2;
      const rect = new Rectangle(0, 0, Graphics.width, height);
      this._helpWindow = new Window_Help(rect);
      this._helpWindow.setText(
        "Mouse: Pan | Wheel: Zoom | Click: Select/Deselect | Esc: Exit"
      );
      this._windowLayer.addChild(this._helpWindow);
    }

    analyzeMapConnections() {
      const startTime = performance.now();

      this._mapData = new Map();
      this._connections = new Map();
      this._clusters = [];

      const currentMapId = $gameMap.mapId();
      if (teleportHubId > 0 && currentMapId === teleportHubId) {
        this.analyzeTeleportHub();
      } else {
        this.analyzeNormalMaps(currentMapId);
      }
      this.findClusters();
      this.positionMaps();
      this.drawWorldMap();

      const endTime = performance.now();
      console.log(
        `Map analysis completed in ${(endTime - startTime).toFixed(
          2
        )}ms using ${
          useHardcodedConnections ? "hardcoded" : "runtime"
        } connections`
      );
    }

    analyzeTeleportHub() {
      const hubMapInfo = $dataMapInfos[teleportHubId];
      const hubMapData = this.loadMapData(teleportHubId);
      if (hubMapInfo && hubMapData) {
        this._mapData.set(teleportHubId, {
          id: teleportHubId,
          name: hubMapInfo.name,
          visited: true,
        });
        const hubConnections = [];
        if (hubMapData.events) {
          for (const event of hubMapData.events) {
            if (event && event.name.startsWith("Teleport")) {
              const destinationName = event.name
                .replace(/Teleport\s*-\s*/, "")
                .trim();
              const fakeMapId = `teleport_${event.id}`;
              this._mapData.set(fakeMapId, {
                id: fakeMapId,
                name: destinationName,
                visited: true,
              });
              hubConnections.push({
                targetMapId: fakeMapId,
                eventName: event.name,
                isDoor: true,
              });
            }
          }
        }
        if (hubConnections.length > 0)
          this._connections.set(teleportHubId, hubConnections);
      }
    }

    analyzeNormalMaps(currentMapId) {
      const mapsToShow = this.getMapsInDepth(currentMapId, displayDepth);
      for (const mapId of mapsToShow) {
        const mapInfo = $dataMapInfos[mapId];
        if (!mapInfo) continue;
        this._mapData.set(mapId, {
          id: mapId,
          name: mapInfo.name,
          visited:
            $gameSystem._visitedMaps && $gameSystem._visitedMaps.has(mapId),
        });
        const mapData = this.loadMapData(mapId);
        if (mapData) {
          const transfers = this.findTransferEvents(mapData);
          const validTransfers = transfers.filter(
            (t) => !ignoredMapIds.includes(t.targetMapId)
          );
          if (validTransfers.length > 0)
            this._connections.set(mapId, validTransfers);
        }
      }
    }

    getMapsInDepth(startMapId, maxDepth) {
      // If maxDepth is 0, return all reachable maps regardless of depth
      if (maxDepth <= 0) {
        const allReachableMaps = new Set();
        const visited = new Set();
        const queue = [startMapId];
        
        while (queue.length > 0) {
          const currentMapId = queue.shift();
          if (visited.has(currentMapId)) continue;
          
          visited.add(currentMapId);
          allReachableMaps.add(currentMapId);
          
          const mapData = this.loadMapData(currentMapId);
          if (mapData) {
            const transfers = this.findTransferEvents(mapData);
            for (const transfer of transfers) {
              if (!visited.has(transfer.targetMapId) && 
                  !ignoredMapIds.includes(transfer.targetMapId) &&
                  $dataMapInfos[transfer.targetMapId]) {
                queue.push(transfer.targetMapId);
              }
            }
          }
        }
        
        return allReachableMaps;
      }
      
      // Original depth-limited logic for when maxDepth > 0
      const queue = [{ mapId: startMapId, depth: 0 }];
      const visited = new Set([startMapId]);
      let head = 0;
      while (head < queue.length) {
        const { mapId, depth } = queue[head++];
        if (depth >= maxDepth) continue;
        const mapData = this.loadMapData(mapId);
        if (mapData) {
          const transfers = this.findTransferEvents(mapData);
          for (const transfer of transfers) {
            if (ignoredMapIds.includes(transfer.targetMapId)) continue;
            if (!visited.has(transfer.targetMapId)) {
              visited.add(transfer.targetMapId);
              queue.push({ mapId: transfer.targetMapId, depth: depth + 1 });
            }
          }
        }
      }
      return visited;
    }

    loadMapData(mapId) {
      const filename = "Map%1.json".format(String(mapId).padZero(3));
      try {
        const xhr = new XMLHttpRequest();
        xhr.open("GET", "data/" + filename, false);
        xhr.overrideMimeType("application/json");
        xhr.send();
        if (xhr.status === 200) {
          const mapData = JSON.parse(xhr.responseText);
          mapData.mapId = mapId;
          return mapData;
        }
      } catch (e) {
        console.warn(
          "Could not load map data for Map" + String(mapId).padZero(3)
        );
      }
      return null;
    }

    findTransferEvents(mapData) {
      const transfers = [];
      if (!mapData || !mapData.events) return transfers;
      for (const event of mapData.events) {
        if (!event || !event.pages) continue;
        for (const page of event.pages) {
          if (!page.list) continue;
          for (const command of page.list) {
            if (command.code === 201 && command.parameters[0] === 0) {
              const targetMapId = command.parameters[1];
              
              // Skip all ignored connections, including 3<->315
              if (
                (mapData.mapId === 3 && targetMapId === 315) ||
                (mapData.mapId === 315 && targetMapId === 3) ||
                ignoredMapIds.includes(targetMapId)
              ) {
                continue;
              }
              
              transfers.push({ targetMapId: targetMapId });
            }
          }
        }
      }
      return transfers;
    }
    

    findClusters() {
      const visited = new Set();
      const dfs = (mapId, cluster) => {
        if (visited.has(mapId)) return;
        visited.add(mapId);
        cluster.add(mapId);
        const connections = this._connections.get(mapId) || [];
        for (const conn of connections) {
          if (this._mapData.has(conn.targetMapId))
            dfs(conn.targetMapId, cluster);
        }
        for (const [otherId, otherConns] of this._connections) {
          if (otherId !== mapId && this._mapData.has(otherId)) {
            for (const conn of otherConns) {
              if (conn.targetMapId === mapId) dfs(otherId, cluster);
            }
          }
        }
      };
      for (const [mapId] of this._mapData) {
        if (!visited.has(mapId)) {
          const cluster = new Set();
          dfs(mapId, cluster);
          if (cluster.size > 0) this._clusters.push(cluster);
        }
      }
      this._clusters.sort((a, b) => b.size - a.size);
    }

    positionMaps() {
      const positions = new Map();
      const GRID_SIZE = Math.max(nodeWidth, nodeHeight) + 40;
      const CANVAS_CENTER_X = this._worldMapSprite.bitmap.width / 2;
      const CANVAS_CENTER_Y = this._worldMapSprite.bitmap.height / 2;
      const clusterColors = [
        "#4a90e2",
        "#e94b4b",
        "#50c878",
        "#ffa500",
        "#9b59b6",
        "#f39c12",
        "#1abc9c",
        "#e74c3c",
        "#3498db",
        "#2ecc71",
      ];
      const occupiedCells = new Set();
      const gridToWorld = (gridX, gridY) => ({
        x: CANVAS_CENTER_X + gridX * GRID_SIZE - nodeWidth / 2,
        y: CANVAS_CENTER_Y + gridY * GRID_SIZE - nodeHeight / 2,
      });
      const isCellAvailable = (gridX, gridY) =>
        !occupiedCells.has(`${gridX},${gridY}`);
      const occupyCell = (gridX, gridY) =>
        occupiedCells.add(`${gridX},${gridY}`);
      const findBestPositionNear = (
        referenceGridX,
        referenceGridY,
        preferredDirections = []
      ) => {
        const searchRadius = 8;
        const allDirections = [
          { dx: 1, dy: 0 },
          { dx: -1, dy: 0 },
          { dx: 0, dy: 1 },
          { dx: 0, dy: -1 },
          { dx: 1, dy: 1 },
          { dx: -1, dy: -1 },
          { dx: 1, dy: -1 },
          { dx: -1, dy: 1 },
          ...preferredDirections,
        ];
        for (let radius = 1; radius <= searchRadius; radius++) {
          for (const dir of allDirections) {
            const gridX = referenceGridX + dir.dx * radius;
            const gridY = referenceGridY + dir.dy * radius;
            if (isCellAvailable(gridX, gridY)) return { gridX, gridY };
          }
          for (let dx = -radius; dx <= radius; dx++) {
            for (let dy = -radius; dy <= radius; dy++) {
              if (Math.abs(dx) === radius || Math.abs(dy) === radius) {
                const gridX = referenceGridX + dx;
                const gridY = referenceGridY + dy;
                if (isCellAvailable(gridX, gridY)) return { gridX, gridY };
              }
            }
          }
        }
        return this.findAnyAvailablePosition(occupiedCells);
      };
      let clusterOffsetX = 0;
      this._clusters.forEach((cluster, clusterIndex) => {
        const clusterMaps = Array.from(cluster);
        const clusterColor = clusterColors[clusterIndex % clusterColors.length];
        if (clusterMaps.length === 1) {
          const gridX = clusterOffsetX;
          const gridY = 0;
          const worldPos = gridToWorld(gridX, gridY);
          positions.set(clusterMaps[0], {
            x: worldPos.x,
            y: worldPos.y,
            width: nodeWidth,
            height: nodeHeight,
            color: clusterColor,
            clusterIndex: clusterIndex,
            previewImage: null,
          });
          occupyCell(gridX, gridY);
          clusterOffsetX += 3;
        } else {
          const placedMaps = new Map();
          const unplacedMaps = new Set(clusterMaps);
          let startMap = clusterMaps[0];
          let maxConnections = 0;
          for (const mapId of clusterMaps) {
            const connections = this._connections.get(mapId) || [];
            const inClusterConnections = connections.filter((conn) =>
              clusterMaps.includes(conn.targetMapId)
            ).length;
            if (inClusterConnections > maxConnections) {
              maxConnections = inClusterConnections;
              startMap = mapId;
            }
          }
          const startGridX = clusterOffsetX;
          const startGridY = 0;
          placedMaps.set(startMap, { gridX: startGridX, gridY: startGridY });
          unplacedMaps.delete(startMap);
          occupyCell(startGridX, startGridY);
          const queue = [startMap];
          while (queue.length > 0 && unplacedMaps.size > 0) {
            const currentMap = queue.shift();
            const currentPos = placedMaps.get(currentMap);
            const connections = this._connections.get(currentMap) || [];
            const unplacedConnections = connections.filter((conn) =>
              unplacedMaps.has(conn.targetMapId)
            );
            for (const conn of unplacedConnections) {
              const targetMap = conn.targetMapId;
              const bestPos = findBestPositionNear(
                currentPos.gridX,
                currentPos.gridY
              );
              if (bestPos) {
                placedMaps.set(targetMap, bestPos);
                unplacedMaps.delete(targetMap);
                occupyCell(bestPos.gridX, bestPos.gridY);
                queue.push(targetMap);
              }
            }
            for (const mapId of Array.from(unplacedMaps)) {
              const mapConnections = this._connections.get(mapId) || [];
              const connectsToCurrentMap = mapConnections.some(
                (conn) => conn.targetMapId === currentMap
              );
              if (connectsToCurrentMap) {
                const bestPos = findBestPositionNear(
                  currentPos.gridX,
                  currentPos.gridY
                );
                if (bestPos) {
                  placedMaps.set(mapId, bestPos);
                  unplacedMaps.delete(mapId);
                  occupyCell(bestPos.gridX, bestPos.gridY);
                  queue.push(mapId);
                }
              }
            }
          }
          for (const mapId of unplacedMaps) {
            const availablePos = this.findAnyAvailablePosition(occupiedCells);
            if (availablePos) {
              placedMaps.set(mapId, availablePos);
              occupyCell(availablePos.gridX, availablePos.gridY);
            }
          }
          for (const [mapId, gridPos] of placedMaps) {
            const worldPos = gridToWorld(gridPos.gridX, gridPos.gridY);
            positions.set(mapId, {
              x: worldPos.x,
              y: worldPos.y,
              width: nodeWidth,
              height: nodeHeight,
              color: clusterColor,
              clusterIndex: clusterIndex,
              previewImage: null,
            });
          }
          const clusterBounds = this.getClusterBounds(placedMaps);
          clusterOffsetX = clusterBounds.maxX + 4;
        }
      });
      this._mapPositions = positions;
    }

    findAnyAvailablePosition(occupiedCells) {
      const maxRadius = 20;
      for (let radius = 0; radius <= maxRadius; radius++) {
        for (let dx = -radius; dx <= radius; dx++) {
          for (let dy = -radius; dy <= radius; dy++) {
            if (
              radius === 0 ||
              Math.abs(dx) === radius ||
              Math.abs(dy) === radius
            ) {
              const key = `${dx},${dy}`;
              if (!occupiedCells.has(key)) return { gridX: dx, gridY: dy };
            }
          }
        }
      }
      return {
        gridX: Math.floor(Math.random() * 40) - 20,
        gridY: Math.floor(Math.random() * 40) - 20,
      };
    }

    getClusterBounds(placedMaps) {
      let minX = Infinity,
        maxX = -Infinity,
        minY = Infinity,
        maxY = -Infinity;
      for (const pos of placedMaps.values()) {
        minX = Math.min(minX, pos.gridX);
        maxX = Math.max(maxX, pos.gridX);
        minY = Math.min(minY, pos.gridY);
        maxY = Math.max(maxY, pos.gridY);
      }
      return { minX, maxX, minY, maxY };
    }

    drawWorldMap() {
      const bitmap = this._worldMapSprite.bitmap;
      bitmap.clear();
      this.drawGrid(bitmap);

      console.log(
        "Drawing world map with highlighted path:",
        this._highlightedPath
      );

      for (const [mapId, connections] of this._connections) {
        const fromPos = this._mapPositions.get(mapId);
        if (!fromPos) continue;
        for (const conn of connections) {
          const toPos = this._mapPositions.get(conn.targetMapId);
          if (!toPos) continue;
          const fromX = fromPos.x + fromPos.width / 2;
          const fromY = fromPos.y + fromPos.height / 2;
          const toX = toPos.x + toPos.width / 2;
          const toY = toPos.y + toPos.height / 2;

          const path = this._highlightedPath;
          let lineColor = "#666666",
            lineWidth = 2,
            arrowColor = "#666666";

          if (path && path.length > 1) {
            const fromIndex = path.indexOf(mapId);
            const toIndex = path.indexOf(conn.targetMapId);
            console.log(
              `Checking connection ${mapId} -> ${conn.targetMapId}, fromIndex: ${fromIndex}, toIndex: ${toIndex}`
            );

            if (
              fromIndex > -1 &&
              toIndex > -1 &&
              Math.abs(fromIndex - toIndex) === 1
            ) {
              console.log("Highlighting connection");
              lineColor = "#33ff33";
              arrowColor = "#33ff33";
              lineWidth = 4;
            }
          }

          drawLine(bitmap, fromX, fromY, toX, toY, lineColor, lineWidth);
          const angle = Math.atan2(toY - fromY, toX - fromX);
          const arrowX = toX - Math.cos(angle) * (toPos.width / 2 + 5);
          const arrowY = toY - Math.sin(angle) * (toPos.height / 2 + 5);
          drawArrow(bitmap, arrowX, arrowY, angle, arrowColor, 10);
        }
      }

      for (const [mapId, mapInfo] of this._mapData) {
        const pos = this._mapPositions.get(mapId);
        if (pos) this.drawMapNode(bitmap, mapId, mapInfo, pos);
      }
    }

    drawMapNode(bitmap, mapId, mapInfo, pos) {
      const mapIdStr = String(mapId).padZero(3);
      const imagePath = `img/maps/Map${mapIdStr}.png`;
      try {
        const previewImg = new Image();
        previewImg.onload = () => {
          clearRect(bitmap, pos.x, pos.y, pos.width, pos.height);
          const context = bitmap.context;
          context.save();
          context.beginPath();
          context.rect(pos.x, pos.y, pos.width, pos.height);
          context.clip();
          const scale = Math.max(
            pos.width / previewImg.width,
            pos.height / previewImg.height
          );
          const scaledWidth = previewImg.width * scale;
          const scaledHeight = previewImg.height * scale;
          const drawX = pos.x + (pos.width - scaledWidth) / 2;
          const drawY = pos.y + (pos.height - scaledHeight) / 2;
          const shouldReveal =
            mapInfo.visited ||
            ($gameVariables && $gameVariables.value(2) === 100);
          if (!shouldReveal) context.filter = "grayscale(100%) brightness(0.6)";
          context.drawImage(
            previewImg,
            drawX,
            drawY,
            scaledWidth,
            scaledHeight
          );
          context.restore();
          this.drawNodeOverlay(bitmap, mapInfo, pos, shouldReveal);
        };
        previewImg.onerror = () => this.drawFallbackNode(bitmap, mapInfo, pos);
        previewImg.src = imagePath;
      } catch (e) {
        this.drawFallbackNode(bitmap, mapInfo, pos);
      }
    }

    drawFallbackNode(bitmap, mapInfo, pos) {
      const shouldReveal =
        mapInfo.visited || ($gameVariables && $gameVariables.value(2) === 100);
      if (shouldReveal) {
        bitmap.fillRect(pos.x, pos.y, pos.width, pos.height, pos.color);
      } else {
        bitmap.fillRect(
          pos.x,
          pos.y,
          pos.width,
          pos.height,
          this.darkenColor(pos.color)
        );
      }
      this.drawNodeOverlay(bitmap, mapInfo, pos, shouldReveal);
    }

    drawNodeOverlay(bitmap, mapInfo, pos, shouldReveal = true) {
      const isInPath =
        this._highlightedPath && this._highlightedPath.includes(mapInfo.id);
      const isDestination = $gameSystem._worldMapDestinationId === mapInfo.id;
      const isHighlighted = isInPath || isDestination;

      console.log(
        `Drawing node ${mapInfo.id}: inPath=${isInPath}, isDestination=${isDestination}, highlighted=${isHighlighted}`
      );

      const borderColor = isHighlighted ? "#33ff33" : "#ffffff";
      const borderWidth = isHighlighted ? 6 : 3;
      drawRect(
        bitmap,
        pos.x,
        pos.y,
        pos.width,
        pos.height,
        borderColor,
        borderWidth
      );

      if (isDestination) {
        console.log("Drawing destination highlight for", mapInfo.id);
        drawRect(
          bitmap,
          pos.x - 4,
          pos.y - 4,
          pos.width + 8,
          pos.height + 8,
          "#ffff00",
          4
        );
      }

      const context = bitmap.context;
      context.save();
      context.fillStyle = shouldReveal
        ? "rgba(0, 0, 0, 0.7)"
        : "rgba(0, 0, 0, 0.9)";
      context.fillRect(pos.x, pos.y + pos.height - 30, pos.width, 30);
      context.restore();

      const displayName = shouldReveal ? mapInfo.name : unvisitedMapName;
      bitmap.fontSize = 16;
      bitmap.textColor = shouldReveal ? "#ffffff" : "#888888";
      bitmap.drawText(
        displayName,
        pos.x + 4,
        pos.y + pos.height - 26,
        pos.width - 8,
        22,
        "center"
      );
    }

    darkenColor(hexColor) {
      const hex = hexColor.replace("#", "");
      const r = Math.floor(parseInt(hex.substr(0, 2), 16) * 0.3);
      const g = Math.floor(parseInt(hex.substr(2, 2), 16) * 0.3);
      const b = Math.floor(parseInt(hex.substr(4, 2), 16) * 0.3);
      return `#${r.toString(16).padStart(2, "0")}${g
        .toString(16)
        .padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
    }

    drawGrid(bitmap) {
      const gridSize = 100;
      bitmap.fillAll(backgroundColor);
      for (let x = 0; x < bitmap.width; x += gridSize)
        bitmap.fillRect(x, 0, 1, bitmap.height, gridColor);
      for (let y = 0; y < bitmap.height; y += gridSize)
        bitmap.fillRect(0, y, bitmap.width, 1, gridColor);
    }

    setupZoomAndPan() {
      this._isDragging = false;
      this._lastX = 0;
      this._lastY = 0;
    }

    update() {
      super.update();
      this.updateInput();
      this.updateWorldMapPosition();
    }

    updateInput() {
      if (Input.isTriggered("cancel")) this.popScene();

      let depthChanged = false;
      if (Input.isTriggered("up")) {
        this._currentDepth = Math.max(0, this._currentDepth - 1);
        depthChanged = true;
      }
      if (Input.isTriggered("down")) {
        this._currentDepth = Math.min(10, this._currentDepth + 1);
        depthChanged = true;
      }

      if (depthChanged) {
        this.updateHelpText();
        this.analyzeMapConnections();
        if ($gameSystem._worldMapDestinationId) {
          this.updateAndHighlightPath();
        }
        this.centerOnCurrentMap();
      }

      const currentWheelY = TouchInput.wheelY;
      if (currentWheelY !== 0) {
        const zoomFactor = 1.05;
        const mouseX = TouchInput.x;
        const mouseY = TouchInput.y;
        const point = new Point(mouseX, mouseY);
        this._worldMapSprite.worldTransform.applyInverse(point, point);
        const worldXBefore =
          point.x +
          this._worldMapSprite.bitmap.width * this._worldMapSprite.anchor.x;
        const worldYBefore =
          point.y +
          this._worldMapSprite.bitmap.height * this._worldMapSprite.anchor.y;
        const oldScale = this._scale;
        this._scale =
          currentWheelY > 0
            ? Math.max(this._scale / zoomFactor, 0.3)
            : Math.min(this._scale * zoomFactor, 3.0);
        if (this._scale !== oldScale) {
          this._worldMapSprite.scale.x = this._scale;
          this._worldMapSprite.scale.y = this._scale;
          const pointAfter = new Point(mouseX, mouseY);
          this._worldMapSprite.worldTransform.applyInverse(
            pointAfter,
            pointAfter
          );
          const worldXAfter =
            pointAfter.x +
            this._worldMapSprite.bitmap.width * this._worldMapSprite.anchor.x;
          const worldYAfter =
            pointAfter.y +
            this._worldMapSprite.bitmap.height * this._worldMapSprite.anchor.y;
          this._offsetX -= (worldXAfter - worldXBefore) * this._scale;
          this._offsetY -= (worldYAfter - worldYBefore) * this._scale;
        }
      }

      if (TouchInput.isPressed()) {
        if (!this._isDragging) {
          this._isDragging = true;
          this._lastX = TouchInput.x;
          this._lastY = TouchInput.y;
          this._dragStartX = TouchInput.x;
          this._dragStartY = TouchInput.y;
        } else {
          const deltaX = TouchInput.x - this._lastX;
          const deltaY = TouchInput.y - this._lastY;
          this._offsetX += deltaX;
          this._offsetY += deltaY;
          this._lastX = TouchInput.x;
          this._lastY = TouchInput.y;
        }
      } else {
        if (this._isDragging) {
          this._isDragging = false;
          const totalDragDistance = Math.sqrt(
            Math.pow(TouchInput.x - this._dragStartX, 2) +
              Math.pow(TouchInput.y - this._dragStartY, 2)
          );

          if (totalDragDistance < 10) {
            this.checkMapClick(TouchInput.x, TouchInput.y);
          }
        } else if (TouchInput.isTriggered()) {
          this.checkMapClick(TouchInput.x, TouchInput.y);
        }
      }

      if (Input.isTriggered("pageup")) {
        this._scale = Math.min(this._scale * 1.2, 3.0);
        this._worldMapSprite.scale.x = this._scale;
        this._worldMapSprite.scale.y = this._scale;
      }
      if (Input.isTriggered("pagedown")) {
        this._scale = Math.max(this._scale / 1.2, 0.3);
        this._worldMapSprite.scale.x = this._scale;
        this._worldMapSprite.scale.y = this._scale;
      }
    }

    updateWorldMapPosition() {
      this._worldMapSprite.scale.x = this._scale;
      this._worldMapSprite.scale.y = this._scale;
      this._worldMapSprite.x = Graphics.width / 2 + this._offsetX;
      this._worldMapSprite.y = Graphics.height / 2 + this._offsetY;
    }

    checkMapClick(screenX, screenY) {
      if (!this._mapPositions || this._mapPositions.size === 0) return;

      const point = new Point(screenX, screenY);
      this._worldMapSprite.worldTransform.applyInverse(point, point);
      const worldX =
        point.x +
        this._worldMapSprite.bitmap.width * this._worldMapSprite.anchor.x;
      const worldY =
        point.y +
        this._worldMapSprite.bitmap.height * this._worldMapSprite.anchor.y;

      let clickedOnNode = false;
      const positions = Array.from(this._mapPositions.entries()).reverse();

      for (const [mapId, pos] of positions) {
        const isInside =
          worldX >= pos.x &&
          worldX <= pos.x + pos.width &&
          worldY >= pos.y &&
          worldY <= pos.y + pos.height;

        if (isInside) {
          const clickedMapId =
            typeof mapId === "string" && mapId.startsWith("teleport_")
              ? mapId
              : Number(mapId);
          const currentDestination = $gameSystem._worldMapDestinationId;

          if (currentDestination === clickedMapId) {
            $gameSystem._worldMapDestinationId = null;
          } else {
            if (typeof clickedMapId === "number") {
              $gameSystem._worldMapDestinationId = clickedMapId;
            }
          }

          this.updateAndHighlightPath();
          this.selectMap(mapId);
          clickedOnNode = true;
          return;
        }
      }

      if (!clickedOnNode && $gameSystem._worldMapDestinationId) {
        $gameSystem._worldMapDestinationId = null;
        this.updateAndHighlightPath();
        this._infoWindow.hide();
      }
    }

    selectMap(mapId) {
      const mapInfo = this._mapData.get(mapId);
      if (!mapInfo) return;
      const pos = this._mapPositions.get(mapId);
      const connections = this._connections.get(mapId) || [];
      this._infoWindow.setMapInfo(mapInfo, pos, connections);
      this._infoWindow.show();
    }
  }

  // Map Info Window (unchanged)
  class Window_MapInfo extends Window_Base {
    initialize(rect) {
      super.initialize(rect);
    }
    setMapInfo(mapInfo, position, connections) {
      this.contents.clear();
      const lineHeight = this.lineHeight();
      let y = 0;
      this.changeTextColor(ColorManager.systemColor());
      this.drawText("Map Info", 0, y, this.contentsWidth(), "center");
      y += lineHeight;
      this.changeTextColor(ColorManager.normalColor());
      this.drawText(
        `Name: ${mapInfo.visited ? mapInfo.name : unvisitedMapName}`,
        0,
        y,
        this.contentsWidth()
      );
      y += lineHeight;
      this.drawText(`ID: ${mapInfo.id}`, 0, y, this.contentsWidth());
      y += lineHeight;
      if (position) {
        this.drawText(
          `Cluster: ${position.clusterIndex + 1}`,
          0,
          y,
          this.contentsWidth()
        );
        y += lineHeight;
      }
      this.drawText(
        `Status: ${mapInfo.visited ? "Visited" : "Not Visited"}`,
        0,
        y,
        this.contentsWidth()
      );
      y += lineHeight * 2;
      this.changeTextColor(ColorManager.systemColor());
      this.drawText("Connections:", 0, y, this.contentsWidth());
      y += lineHeight;
      this.changeTextColor(ColorManager.normalColor());
      if (connections.length > 0) {
        const scene = SceneManager._scene;
        if (scene instanceof Scene_WorldMap) {
          for (const conn of connections) {
            if (scene._mapData.has(conn.targetMapId)) {
              const targetMapData = scene._mapData.get(conn.targetMapId);
              const targetName = targetMapData.name;
              this.drawText(`→ ${targetName}`, 0, y, this.contentsWidth());
              y += lineHeight;
            }
          }
        }
      } else {
        this.drawText("No connections found.", 0, y, this.contentsWidth());
      }
    }
  }

  // ============================================================================
  // LOCAL Drawing Helper Functions (Isolated from Global Bitmap Prototype)
  // ============================================================================

  // Local drawing functions to avoid conflicts with other plugins
  function drawLine(bitmap, x1, y1, x2, y2, color, width) {
    const context = bitmap.context;
    context.save();
    context.strokeStyle = color;
    context.lineWidth = width;
    context.beginPath();
    context.moveTo(x1, y1);
    context.lineTo(x2, y2);
    context.stroke();
    context.restore();
  }

  function drawArrow(bitmap, x, y, angle, color, size) {
    const context = bitmap.context;
    context.save();
    context.translate(x, y);
    context.rotate(angle);
    context.fillStyle = color;
    context.beginPath();
    context.moveTo(0, 0);
    context.lineTo(-size, -size / 2);
    context.lineTo(-size, size / 2);
    context.closePath();
    context.fill();
    context.restore();
  }

  function drawRect(bitmap, x, y, width, height, color, lineWidth) {
    const context = bitmap.context;
    context.save();
    context.strokeStyle = color;
    context.lineWidth = lineWidth;
    context.strokeRect(x, y, width, height);
    context.restore();
  }

  function clearRect(bitmap, x, y, width, height) {
    bitmap.context.clearRect(x, y, width, height);
  }

  function drawCircle(bitmap, x, y, radius, color) {
    const context = bitmap.context;
    context.save();
    context.fillStyle = color;
    context.beginPath();
    context.arc(x, y, radius, 0, 2 * Math.PI);
    context.fill();
    context.restore();
  }

  // ============================================================================
  // NEW: VRAM-Optimized Compass Sprite and Scene_Map integration
  // ============================================================================

  // NEW: Optimized Compass Sprite - only created when needed
  class Sprite_Compass extends Sprite {
    constructor() {
      super();
      this._currentMapId = 0;
      this._targetCoords = null; // Pre-calculated coordinates
      this.createBase();
      this.createHand();
      this.x = Graphics.boxWidth - 74;
      this.y = 10;
      this.zIndex = 10;
      this.onMapChange();
    }

    createBase() {
      this.bitmap = new Bitmap(64, 64);
      drawCircle(this.bitmap, 32, 32, 30, "rgba(0, 0, 0, 0.5)");
      drawCircle(this.bitmap, 32, 32, 28, "#FFD700");
      drawCircle(this.bitmap, 32, 32, 25, "#B8860B");
    }

    createHand() {
      this._handSprite = new Sprite();
      this._handSprite.bitmap = new Bitmap(64, 64);
      const handBitmap = this._handSprite.bitmap;
      handBitmap.context.fillStyle = "#FF4136";
      handBitmap.context.beginPath();
      handBitmap.context.moveTo(32, 8);
      handBitmap.context.lineTo(26, 32);
      handBitmap.context.lineTo(38, 32);
      handBitmap.context.closePath();
      handBitmap.context.fill();
      this._handSprite.anchor.x = 0.5;
      this._handSprite.anchor.y = 0.5;
      this._handSprite.x = 32;
      this._handSprite.y = 32;
      this.addChild(this._handSprite);
    }

    // NEW: Optimized map change handler
    onMapChange() {
      this._currentMapId = $gameMap.mapId();

      // Use pre-calculated waypoint data instead of searching events
      if (
        $gameSystem._compassWaypoints &&
        $gameSystem._compassWaypoints.has(this._currentMapId)
      ) {
        this._targetCoords = $gameSystem._compassWaypoints.get(
          this._currentMapId
        );
        console.log(
          `Compass target coords for map ${this._currentMapId}:`,
          this._targetCoords
        );
      } else {
        this._targetCoords = null;
        console.log(`No compass waypoint for map ${this._currentMapId}`);
      }
    }

    update() {
      super.update();
      // Only update if we have target coordinates
      if (this._targetCoords) {
        this.updateRotation();
      }
    }

    // NEW: Highly optimized rotation using pre-calculated coordinates
    updateRotation() {
      if (!this._targetCoords) return;

      // Get player position in tiles
      const playerX = $gamePlayer.x;
      const playerY = $gamePlayer.y;

      // Calculate direct tile distance (much faster than screen coordinates)
      const deltaX = this._targetCoords.x - playerX;
      const deltaY = this._targetCoords.y - playerY;

      // Calculate angle directly from tile coordinates
      const angle = Math.atan2(deltaY, deltaX);
      this._handSprite.rotation = angle + Math.PI / 2; // Offset for upward-pointing sprite

      // Optional: Check if player reached the waypoint (for automatic path progression)
      const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
      if (distance < 1.5) {
        // Within 1.5 tiles of the waypoint
        console.log(
          "Player reached waypoint, checking for path progression..."
        );
        // Could trigger path progression logic here if needed
      }
    }
  }

  // NEW: Enhanced Scene_Map with conditional compass creation
  // Replace the existing Scene_Map createDisplayObjects override with this fixed version:

  const _Scene_Map_createDisplayObjects =
    Scene_Map.prototype.createDisplayObjects;
  Scene_Map.prototype.createDisplayObjects = function () {
    _Scene_Map_createDisplayObjects.call(this);

    // Only create compass if needed
    const currentMapId = $gameMap.mapId();

    // Ensure _compassActiveMaps is properly initialized as a Set
    if (
      !$gameSystem._compassActiveMaps ||
      !($gameSystem._compassActiveMaps instanceof Set)
    ) {
      $gameSystem._compassActiveMaps = new Set();
    }

    const shouldShowCompass =
      $gameSystem._compassActiveMaps.has(currentMapId) &&
      $gameSystem._worldMapDestinationId &&
      $gameSystem._worldMapDestinationId !== currentMapId;

    if (shouldShowCompass) {
      this.createCompassSprite();
    }
  };

  // NEW: Conditional compass creation
  Scene_Map.prototype.createCompassSprite = function () {
    if (!this._compassSprite) {
      console.log("Creating compass sprite");
      this._compassSprite = new Sprite_Compass();
      this.addChild(this._compassSprite);
    }
  };

  // NEW: Safe compass removal
  Scene_Map.prototype.removeCompassSprite = function () {
    if (this._compassSprite) {
      console.log("Removing compass sprite");
      this.removeChild(this._compassSprite);
      this._compassSprite = null;
    }
  };

  const _Scene_Map_terminate = Scene_Map.prototype.terminate;
  Scene_Map.prototype.terminate = function () {
    this.removeCompassSprite();
    _Scene_Map_terminate.call(this);
  };
})();

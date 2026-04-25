/*:
 * @target MZ
 * @plugindesc v1.2.0 Generates procedural dungeons with various algorithms
 * @author Omni-Lex + Nocoldiz
 * @url https://nocoldiz.itch.io/hypernet-explorer
 *
 * @param defaultAlgorithm
 * @text Default Generation Algorithm
 * @type select
 * @option Binary Space Partitioning (BSP)
 * @value bsp
 * @option Cellular Automata
 * @value cellular
 * @option Drunkard's Walk
 * @value drunkard
 * @option Random Rooms
 * @value random
 * @default bsp
 * @desc The default algorithm to use for dungeon generation.
 *
 * @param roomMinWidth
 * @text Minimum Room Width
 * @type number
 * @min 5
 * @max 20
 * @default 6
 * @desc Minimum width for rooms (at least 5 for player spawn area).
 *
 * @param roomMaxWidth
 * @text Maximum Room Width
 * @type number
 * @min 6
 * @max 30
 * @default 12
 * @desc Maximum width for rooms.
 *
 * @param roomMinHeight
 * @text Minimum Room Height
 * @type number
 * @min 5
 * @max 20
 * @default 6
 * @desc Minimum height for rooms (at least 5 for player spawn area).
 *
 * @param roomMaxHeight
 * @text Maximum Room Height
 * @type number
 * @min 6
 * @max 30
 * @default 12
 * @desc Maximum height for rooms.
 *
 * @param corridorWidth
 * @text Corridor Width
 * @type number
 * @min 1
 * @max 3
 * @default 2
 * @desc Width of corridors between rooms.
 *
 * @param regionProbability
 * @text Region ID 13 Probability
 * @type number
 * @decimals 2
 * @min 0
 * @max 1
 * @default 0.05
 * @desc Probability (0-1) of placing a Region ID 13 tile in floor areas.
 *
 * @param tilesetID
 * @text Dungeon Tileset ID
 * @type number
 * @min 1
 * @default 1
 * @desc The ID of the tileset to use for the dungeon (default is 1).
 *
 * @param transferFirst
 * @text Transfer Player First
 * @type boolean
 * @on Transfer then Generate
 * @off Generate then Transfer
 * @default true
 * @desc True: Transfer player then generate dungeon. False: Generate dungeon then transfer player.
 *
 * @param fadeTime
 * @text Fade Duration
 * @type number
 * @min 1
 * @max 120
 * @default 24
 * @desc Duration of the fade in/out effect in frames.
 *
 * @param dungeonMapID
 * @text Dungeon Map ID
 * @type number
 * @min 1
 * @default 5
 * @desc The ID of the map to use for the dungeon.
 *
 * @param dungeonWidth
 * @text Dungeon Width
 * @type number
 * @min 20
 * @max 100
 * @default 50
 * @desc Width of the dungeon map.
 *
 * @param dungeonHeight
 * @text Dungeon Height
 * @type number
 * @min 20
 * @max 100
 * @default 50
 * @desc Height of the dungeon map.
 *
 * @param propsData
 * @text Props Data
 * @type struct<PropData>[]
 * @default ["{\"tileID\":\"10\",\"probability\":\"0.03\"}"]
 * @desc Data for props that can be scattered through the dungeon.
 *
 * @command generateDungeon
 * @text Generate Dungeon
 * @desc Generates a new dungeon and transfers the player to it.
 *
 * @arg algorithm
 * @text Algorithm
 * @type select
 * @option Binary Space Partitioning (BSP)
 * @value bsp
 * @option Cellular Automata
 * @value cellular
 * @option Drunkard's Walk
 * @value drunkard
 * @option Random Rooms
 * @value random
 * @default bsp
 * @desc The algorithm to use for this dungeon generation.
 *
 * @arg playerStartPosition
 * @text Player Start Position
 * @type select
 * @option Random Room
 * @value random
 * @option First Room
 * @value first
 * @option Last Room
 * @value last
 * @default random
 * @desc Where to place the player in the dungeon.
 *
 * @help
 * =============================================================================
 * Procedural Dungeon Generator
 * =============================================================================
 * 
 * This plugin generates procedural dungeons using various algorithms.
 * Each generation creates a unique layout while following the parameters
 * you've configured.
 * 
 * Features:
 * - Multiple generation algorithms (BSP, Cellular Automata, Drunkard's Walk, Random)
 * - Customizable room sizes and corridor widths
 * - Automatic placement of Region ID 13 tiles based on probability
 * - Customizable tileset and tile IDs for walls and floors
 * - Configurable prop placement throughout the dungeon
 * - Option to transfer player before or after generation
 * - Smooth fade transitions when entering dungeons
 * 
 * Usage:
 * 1. Create an empty map with the ID specified in the plugin parameters
 * 2. Use the plugin command "Generate Dungeon" to create and transfer to dungeon
 * 3. Or call via script: $gameSystem.generateDungeon()
 * 
 * Note: Make sure your map is at least as large as the dungeonWidth and 
 * dungeonHeight parameters specified.
 * 
 * =============================================================================
 */

/*~struct~PropData:
 * @param tileID
 * @text Prop Tile ID
 * @type number
 * @min 0
 * @default 10
 * @desc The ID of the prop tile in the tileset.
 *
 * @param probability
 * @text Placement Probability
 * @type number
 * @decimals 2
 * @min 0
 * @max 1
 * @default 0.03
 * @desc Probability (0-1) of placing this prop on floor tiles.
 */

(() => {
    'use strict';
    
    const pluginName = "ProceduralDungeonGenerator";
    
    //=============================================================================
    // Plugin Parameters
    //=============================================================================
    
    const parameters = PluginManager.parameters(pluginName);
    
    const defaultAlgorithm = String(parameters['defaultAlgorithm'] || 'bsp');
    const roomMinWidth = Number(parameters['roomMinWidth'] || 6);
    const roomMaxWidth = Number(parameters['roomMaxWidth'] || 12);
    const roomMinHeight = Number(parameters['roomMinHeight'] || 6);
    const roomMaxHeight = Number(parameters['roomMaxHeight'] || 12);
    const corridorWidth = Number(parameters['corridorWidth'] || 2);
    const regionProbability = Number(parameters['regionProbability'] || 0.05);
    const tilesetID = Number(parameters['tilesetID'] || 1); // Changed to default to tileset 1
    const transferFirst = parameters['transferFirst'] === 'true';
    const fadeTime = Number(parameters['fadeTime'] || 24);
    const dungeonMapID = Number(parameters['dungeonMapID'] || 5);
    const dungeonWidth = Number(parameters['dungeonWidth'] || 50);
    const dungeonHeight = Number(parameters['dungeonHeight'] || 50);
    
    // Parse props data
    const propsData = JSON.parse(parameters['propsData'] || '[]').map(propJson => {
        const propData = JSON.parse(propJson);
        return {
            tileID: Number(propData.tileID || 10),
            probability: Number(propData.probability || 0.03)
        };
    });
    
    // Floor and wall tile definitions (for random selection)
    const floorTileOptions = [
        { id: 2048, probability: 0.4 },  // Basic floor tile 1
        { id: 2049, probability: 0.3 },  // Basic floor tile 2
        { id: 2050, probability: 0.2 },  // Basic floor tile 3
        { id: 2051, probability: 0.1 }   // Basic floor tile 4
    ];
    
    const wallTileOptions = [
        { id: 1536, probability: 0.4 },  // Basic wall tile 1
        { id: 1537, probability: 0.3 },  // Basic wall tile 2
        { id: 1538, probability: 0.2 },  // Basic wall tile 3
        { id: 1539, probability: 0.1 }   // Basic wall tile 4
    ];
    
    //=============================================================================
    // Plugin Commands
    //=============================================================================
    
    PluginManager.registerCommand(pluginName, "generateDungeon", args => {
        const algorithm = args.algorithm || defaultAlgorithm;
        const playerStartPosition = args.playerStartPosition || 'random';
        
        $gameSystem.generateDungeon(algorithm, playerStartPosition);
    });
    
    //=============================================================================
    // Room Class - Represents a single room in the dungeon
    //=============================================================================
    
    class Room {
        constructor(x, y, width, height) {
            this.x = x;
            this.y = y;
            this.width = width;
            this.height = height;
            this.centerX = Math.floor(x + width / 2);
            this.centerY = Math.floor(y + height / 2);
            this.connected = false;
        }
        
        intersects(room, padding = 0) {
            return !(
                this.x + this.width + padding < room.x ||
                this.x > room.x + room.width + padding ||
                this.y + this.height + padding < room.y ||
                this.y > room.y + room.height + padding
            );
        }
        
        containsPoint(x, y) {
            return x >= this.x && x < this.x + this.width &&
                   y >= this.y && y < this.y + this.height;
        }
    }
    
    //=============================================================================
    // Game_System Extensions - Add dungeon generation functionality
    //=============================================================================
    
    const _Game_System_initialize = Game_System.prototype.initialize;
    Game_System.prototype.initialize = function() {
        _Game_System_initialize.call(this);
        this._dungeonRooms = [];
        this._dungeonGrid = null;
    };
    
    Game_System.prototype.generateDungeon = function(algorithm = defaultAlgorithm, playerStartPosition = 'random') {
        if (transferFirst) {
            // Transfer first, then generate
            this.transferPlayerToDungeon();
            this.createDungeon(algorithm, playerStartPosition);
        } else {
            // Generate first, then transfer
            this.createDungeon(algorithm, playerStartPosition);
            this.transferPlayerToDungeon(playerStartPosition);
        }
    };
    
    Game_System.prototype.transferPlayerToDungeon = function(playerStartPosition = 'random') {
        // Default position, will be adjusted later
        $gamePlayer.reserveTransfer(dungeonMapID, 1, 1, 2, 2); 
        
        if (playerStartPosition !== undefined && this._dungeonRooms.length > 0) {
            // Find suitable rooms (with at least 6x6 size for 4x4 spawn area)
            const suitableRooms = this._dungeonRooms.filter(room => 
                room.width >= 6 && room.height >= 6);
            
            // If no suitable rooms found, use all rooms
            const roomPool = suitableRooms.length > 0 ? suitableRooms : this._dungeonRooms;
            
            let targetRoom;
            
            switch (playerStartPosition) {
                case 'first':
                    targetRoom = roomPool[0];
                    break;
                case 'last':
                    targetRoom = roomPool[roomPool.length - 1];
                    break;
                case 'random':
                default:
                    targetRoom = roomPool[Math.floor(Math.random() * roomPool.length)];
                    break;
            }
            
            if (targetRoom) {
                // Find a 4x4 passable area within the room
                const spawnX = targetRoom.x + Math.floor(targetRoom.width / 2) - 2;
                const spawnY = targetRoom.y + Math.floor(targetRoom.height / 2) - 2;
                
                // Verify the 4x4 area is all floor tiles
                let isValid = true;
                for (let y = spawnY; y < spawnY + 4; y++) {
                    for (let x = spawnX; x < spawnX + 4; x++) {
                        if (x < 0 || y < 0 || x >= dungeonWidth || y >= dungeonHeight || 
                            this._dungeonGrid[y][x] !== 1) {
                            isValid = false;
                            break;
                        }
                    }
                    if (!isValid) break;
                }
                
                // If 4x4 area is valid, use it; otherwise use center of room
                if (isValid) {
                    $gamePlayer.reserveTransfer(dungeonMapID, spawnX + 2, spawnY + 2, 2, 2);
                } else {
                    $gamePlayer.reserveTransfer(dungeonMapID, targetRoom.centerX, targetRoom.centerY, 2, 2);
                }
                
                // Clear any props in the 4x4 spawn area to ensure passability
                if ($gameMap && $gameMap.mapId() === dungeonMapID) {
                    for (let y = spawnY; y < spawnY + 4; y++) {
                        for (let x = spawnX; x < spawnX + 4; x++) {
                            if (x >= 0 && y >= 0 && x < dungeonWidth && y < dungeonHeight) {
                                // Clear any props on upper layers
                                for (let z = 1; z < 4; z++) {
                                    $gameMap.setTileId(x, y, z, 0);
                                }
                            }
                        }
                    }
                }
            }
        }
        
        // Apply fade effect
        $gameScreen.startFadeOut(fadeTime);
        setTimeout(() => {
            $gameScreen.startFadeIn(fadeTime);
        }, fadeTime * 17); // Approximate milliseconds per frame
    };
    
    Game_System.prototype.createDungeon = function(algorithm = defaultAlgorithm, playerStartPosition = 'random') {
        // Initialize grid
        this._dungeonGrid = Array(dungeonHeight).fill().map(() => Array(dungeonWidth).fill(0));
        this._dungeonRooms = [];
        
        // Generate the dungeon layout using the selected algorithm
        switch (algorithm) {
            case 'bsp':
                this.generateBSPDungeon();
                break;
            case 'cellular':
                this.generateCellularDungeon();
                break;
            case 'drunkard':
                this.generateDrunkardWalkDungeon();
                break;
            case 'random':
                this.generateRandomRoomsDungeon();
                break;
            default:
                this.generateBSPDungeon();
                break;
        }
        
        // Apply the generated dungeon to the map
        this.applyDungeonToMap();
    };
    
    Game_System.prototype.applyDungeonToMap = function() {
        // Make sure we have a valid map
        if (!$gameMap || $gameMap.mapId() !== dungeonMapID) {
            return;
        }
        
        // Set the tileset
        if ($dataMap) {
            $dataMap.tilesetId = tilesetID;
            
            // Set map looping in both directions
            $dataMap.scrollType = 3; // 3 means loop both horizontally and vertically
        }
        
        // Select random floor and wall tile types based on probability
        const selectedFloorTile = this.selectRandomTileType(floorTileOptions);
        const selectedWallTile = this.selectRandomTileType(wallTileOptions);
        
        // Clear the current map
        for (let y = 0; y < dungeonHeight; y++) {
            for (let x = 0; x < dungeonWidth; x++) {
                // Clear all layers
                for (let z = 0; z < 4; z++) {
                    $gameMap.setTileId(x, y, z, 0);
                }
                // Reset regions
                $gameMap.setRegionId(x, y, 0);
            }
        }
        
        // Apply the dungeon grid to the map
        for (let y = 0; y < dungeonHeight; y++) {
            for (let x = 0; x < dungeonWidth; x++) {
                if (x >= dungeonWidth || y >= dungeonHeight) continue;
                
                if (this._dungeonGrid[y][x] === 1) {
                    // Floor tile
                    $gameMap.setTileId(x, y, 0, selectedFloorTile);
                    
                    // Randomly place region ID 13
                    if (Math.random() < regionProbability) {
                        $gameMap.setRegionId(x, y, 13);
                    }
                    
                    // Randomly place props
                    this.placeRandomProp(x, y);
                } else {
                    // Wall tile
                    $gameMap.setTileId(x, y, 0, selectedWallTile);
                }
            }
        }
        
        // Refresh the map
        $gameMap.refresh();
    };
    
    Game_System.prototype.selectRandomTileType = function(tileOptions) {
        const randomValue = Math.random();
        let cumulativeProbability = 0;
        
        for (const option of tileOptions) {
            cumulativeProbability += option.probability;
            if (randomValue <= cumulativeProbability) {
                return option.id;
            }
        }
        
        // Default to first option if something goes wrong
        return tileOptions[0].id;
    };
    
    Game_System.prototype.placeRandomProp = function(x, y) {
        for (const prop of propsData) {
            if (Math.random() < prop.probability) {
                // Place prop on the upper layer (1)
                $gameMap.setTileId(x, y, 1, prop.tileID);
                break; // Only place one prop per tile
            }
        }
    };
    
    //=============================================================================
    // Dungeon Generation Algorithms
    //=============================================================================
    
    // 1. Binary Space Partitioning (BSP) Algorithm
    Game_System.prototype.generateBSPDungeon = function() {
        // Fill the grid with walls
        for (let y = 0; y < dungeonHeight; y++) {
            for (let x = 0; x < dungeonWidth; x++) {
                this._dungeonGrid[y][x] = 0; // 0 = wall
            }
        }
        
        // Start with the entire map as a single container
        const containers = [{ x: 1, y: 1, width: dungeonWidth - 2, height: dungeonHeight - 2 }];
        const minContainerSize = Math.max(roomMaxWidth, roomMaxHeight) + 2;
        
        // Recursively split containers
        let iterations = 0;
        const maxIterations = 100; // Prevent infinite loops
        
        while (containers.length > 0 && iterations < maxIterations) {
            iterations++;
            const container = containers.shift();
            
            // If container is too small to split further, create a room inside it
            if (container.width < minContainerSize * 2 || container.height < minContainerSize * 2) {
                this.createRoomInContainer(container);
                continue;
            }
            
            // Decide split direction (horizontal or vertical)
            const splitHorizontally = container.width > container.height;
            
            if (splitHorizontally) {
                // Split vertically (into left and right containers)
                const splitX = Math.floor(container.x + container.width / 2);
                
                containers.push({
                    x: container.x,
                    y: container.y,
                    width: splitX - container.x,
                    height: container.height
                });
                
                containers.push({
                    x: splitX,
                    y: container.y,
                    width: container.x + container.width - splitX,
                    height: container.height
                });
            } else {
                // Split horizontally (into top and bottom containers)
                const splitY = Math.floor(container.y + container.height / 2);
                
                containers.push({
                    x: container.x,
                    y: container.y,
                    width: container.width,
                    height: splitY - container.y
                });
                
                containers.push({
                    x: container.x,
                    y: splitY,
                    width: container.width,
                    height: container.y + container.height - splitY
                });
            }
        }
        
        // Connect all rooms
        this.connectRooms();
    };
    
    Game_System.prototype.createRoomInContainer = function(container) {
        // Create a room of random size within the container
        const roomWidth = Math.floor(Math.random() * (Math.min(roomMaxWidth, container.width - 2) - roomMinWidth + 1)) + roomMinWidth;
        const roomHeight = Math.floor(Math.random() * (Math.min(roomMaxHeight, container.height - 2) - roomMinHeight + 1)) + roomMinHeight;
        
        // Random position inside container (with at least 1 tile padding)
        const roomX = container.x + Math.floor(Math.random() * (container.width - roomWidth - 1)) + 1;
        const roomY = container.y + Math.floor(Math.random() * (container.height - roomHeight - 1)) + 1;
        
        // Create room object
        const room = new Room(roomX, roomY, roomWidth, roomHeight);
        this._dungeonRooms.push(room);
        
        // Carve out the room
        for (let y = room.y; y < room.y + room.height; y++) {
            for (let x = room.x; x < room.x + room.width; x++) {
                if (x >= 0 && x < dungeonWidth && y >= 0 && y < dungeonHeight) {
                    this._dungeonGrid[y][x] = 1; // 1 = floor
                }
            }
        }
    };
    
    Game_System.prototype.connectRooms = function() {
        if (this._dungeonRooms.length < 2) return;
        
        // Sort rooms by x position to get a natural flow
        const sortedRooms = [...this._dungeonRooms].sort((a, b) => a.centerX - b.centerX);
        
        // Mark first room as connected
        sortedRooms[0].connected = true;
        
        // Connect each unconnected room to the closest connected room
        let allConnected = false;
        
        while (!allConnected) {
            allConnected = true;
            
            for (let i = 1; i < sortedRooms.length; i++) {
                const room = sortedRooms[i];
                
                if (!room.connected) {
                    allConnected = false;
                    
                    // Find closest connected room
                    let closestRoom = null;
                    let closestDistance = Infinity;
                    
                    for (let j = 0; j < sortedRooms.length; j++) {
                        const otherRoom = sortedRooms[j];
                        
                        if (otherRoom.connected) {
                            const distance = Math.abs(room.centerX - otherRoom.centerX) + 
                                           Math.abs(room.centerY - otherRoom.centerY);
                            
                            if (distance < closestDistance) {
                                closestDistance = distance;
                                closestRoom = otherRoom;
                            }
                        }
                    }
                    
                    // Connect this room to the closest connected room
                    if (closestRoom) {
                        this.createCorridor(room, closestRoom);
                        room.connected = true;
                    }
                }
            }
        }
    };
    
    Game_System.prototype.createCorridor = function(roomA, roomB) {
        // Connect the centers of the two rooms with L-shaped corridor
        const startX = roomA.centerX;
        const startY = roomA.centerY;
        const endX = roomB.centerX;
        const endY = roomB.centerY;
        
        // Random decision: horizontal first or vertical first
        const horizontalFirst = Math.random() < 0.5;
        
        if (horizontalFirst) {
            // Horizontal then vertical
            this.createHorizontalCorridor(startX, endX, startY);
            this.createVerticalCorridor(startY, endY, endX);
        } else {
            // Vertical then horizontal
            this.createVerticalCorridor(startY, endY, startX);
            this.createHorizontalCorridor(startX, endX, endY);
        }
    };
    
    Game_System.prototype.createHorizontalCorridor = function(x1, x2, y) {
        const startX = Math.min(x1, x2);
        const endX = Math.max(x1, x2);
        
        // Account for corridor width
        const halfWidth = Math.floor(corridorWidth / 2);
        
        for (let x = startX; x <= endX; x++) {
            for (let w = -halfWidth; w < corridorWidth - halfWidth; w++) {
                const corridorY = y + w;
                
                if (corridorY >= 0 && corridorY < dungeonHeight && x >= 0 && x < dungeonWidth) {
                    this._dungeonGrid[corridorY][x] = 1; // Floor
                }
            }
        }
    };
    
    Game_System.prototype.createVerticalCorridor = function(y1, y2, x) {
        const startY = Math.min(y1, y2);
        const endY = Math.max(y1, y2);
        
        // Account for corridor width
        const halfWidth = Math.floor(corridorWidth / 2);
        
        for (let y = startY; y <= endY; y++) {
            for (let w = -halfWidth; w < corridorWidth - halfWidth; w++) {
                const corridorX = x + w;
                
                if (corridorX >= 0 && corridorX < dungeonWidth && y >= 0 && y < dungeonHeight) {
                    this._dungeonGrid[y][corridorX] = 1; // Floor
                }
            }
        }
    };
    
    // 2. Cellular Automata Algorithm
    Game_System.prototype.generateCellularDungeon = function() {
        // Initialize grid with random walls and floors
        for (let y = 0; y < dungeonHeight; y++) {
            for (let x = 0; x < dungeonWidth; x++) {
                // Create borders
                if (x === 0 || y === 0 || x === dungeonWidth - 1 || y === dungeonHeight - 1) {
                    this._dungeonGrid[y][x] = 0; // Wall
                } else {
                    // Random fill (45% walls, 55% floors)
                    this._dungeonGrid[y][x] = Math.random() < 0.45 ? 0 : 1;
                }
            }
        }
        
        // Apply cellular automata rules multiple times
        const iterations = 5;
        for (let i = 0; i < iterations; i++) {
            this.applyCellularAutomataRules();
        }
        
        // Find and extract rooms
        this.extractRoomsFromCellular();
        
        // Connect all rooms
        this.connectRooms();
    };
    
    Game_System.prototype.applyCellularAutomataRules = function() {
        // Create a copy of the grid to read from while we modify the original
        const copyGrid = JSON.parse(JSON.stringify(this._dungeonGrid));
        
        // Apply cellular automata rules (Conway's Game of Life variant)
        for (let y = 1; y < dungeonHeight - 1; y++) {
            for (let x = 1; x < dungeonWidth - 1; x++) {
                // Count neighboring walls
                let wallCount = 0;
                
                for (let ny = -1; ny <= 1; ny++) {
                    for (let nx = -1; nx <= 1; nx++) {
                        if (nx === 0 && ny === 0) continue; // Skip center (current cell)
                        
                        if (copyGrid[y + ny][x + nx] === 0) {
                            wallCount++;
                        }
                    }
                }
                
                // Apply rules
                if (copyGrid[y][x] === 1) {
                    // Floor becomes wall if 5 or more neighbors are walls
                    if (wallCount >= 5) {
                        this._dungeonGrid[y][x] = 0;
                    }
                } else {
                    // Wall becomes floor if 3 or fewer neighbors are walls
                    if (wallCount <= 3) {
                        this._dungeonGrid[y][x] = 1;
                    }
                }
            }
        }
    };
    
    Game_System.prototype.extractRoomsFromCellular = function() {
        // Create a visited array to track cells we've examined
        const visited = Array(dungeonHeight).fill().map(() => Array(dungeonWidth).fill(false));
        
        // Find all connected floor regions
        for (let y = 1; y < dungeonHeight - 1; y++) {
            for (let x = 1; x < dungeonWidth - 1; x++) {
                if (this._dungeonGrid[y][x] === 1 && !visited[y][x]) {
                    // Found a new potential room, flood fill to find its size and bounds
                    const roomTiles = [];
                    this.floodFill(x, y, visited, roomTiles);
                    
                    // Ignore small areas (less than 20 tiles)
                    if (roomTiles.length >= 20) {
                        // Find bounds
                        let minX = dungeonWidth;
                        let minY = dungeonHeight;
                        let maxX = 0;
                        let maxY = 0;
                        
                        for (const tile of roomTiles) {
                            minX = Math.min(minX, tile.x);
                            minY = Math.min(minY, tile.y);
                            maxX = Math.max(maxX, tile.x);
                            maxY = Math.max(maxY, tile.y);
                        }
                        
                        // Create a room object
                        const width = maxX - minX + 1;
                        const height = maxY - minY + 1;
                        
                        // Only add as a room if it's not too narrow
                        if (width >= roomMinWidth && height >= roomMinHeight) {
                            const room = new Room(minX, minY, width, height);
                            this._dungeonRooms.push(room);
                        }
                    }
                }
            }
        }
    };
    
    Game_System.prototype.floodFill = function(x, y, visited, roomTiles) {
        // Out of bounds or already visited or not a floor
        if (x < 0 || y < 0 || x >= dungeonWidth || y >= dungeonHeight ||
            visited[y][x] || this._dungeonGrid[y][x] !== 1) {
            return;
        }
        
        // Mark as visited
        visited[y][x] = true;
        roomTiles.push({ x, y });
        
        // Recursively flood fill in all four directions
        this.floodFill(x + 1, y, visited, roomTiles);
        this.floodFill(x - 1, y, visited, roomTiles);
        this.floodFill(x, y + 1, visited, roomTiles);
        this.floodFill(x, y - 1, visited, roomTiles);
    };
    
    // 3. Drunkard's Walk Algorithm
    Game_System.prototype.generateDrunkardWalkDungeon = function() {
        // Fill the grid with walls
        for (let y = 0; y < dungeonHeight; y++) {
            for (let x = 0; x < dungeonWidth; x++) {
                this._dungeonGrid[y][x] = 0; // 0 = wall
            }
        }
        
        // Start from the center
        const startX = Math.floor(dungeonWidth / 2);
        const startY = Math.floor(dungeonHeight / 2);
        
        // Place an initial room at the center
        const initialRoom = new Room(
            startX - Math.floor(roomMinWidth / 2),
            startY - Math.floor(roomMinHeight / 2),
            roomMinWidth,
            roomMinHeight
        );
        
        this._dungeonRooms.push(initialRoom);
        
        // Carve out the initial room
        for (let y = initialRoom.y; y < initialRoom.y + initialRoom.height; y++) {
            for (let x = initialRoom.x; x < initialRoom.x + initialRoom.width; x++) {
                if (x >= 0 && x < dungeonWidth && y >= 0 && y < dungeonHeight) {
                    this._dungeonGrid[y][x] = 1; // 1 = floor
                }
            }
        }
        
        // Perform the drunkard's walk
        let floorTiles = initialRoom.width * initialRoom.height;
        const targetFloorTiles = Math.floor(dungeonWidth * dungeonHeight * 0.3); // Target 30% of map as floor
        
        let x = startX;
        let y = startY;
        const maxIterations = dungeonWidth * dungeonHeight * 10;
        let iterations = 0;
        
        // Directions: 0 = up, 1 = right, 2 = down, 3 = left
        while (floorTiles < targetFloorTiles && iterations < maxIterations) {
            iterations++;
            
            // Random direction
            const direction = Math.floor(Math.random() * 4);
            
            // Move the drunkard
            switch (direction) {
                case 0: y = Math.max(1, y - 1); break;
                case 1: x = Math.min(dungeonWidth - 2, x + 1); break;
                case 2: y = Math.min(dungeonHeight - 2, y + 1); break;
                case 3: x = Math.max(1, x - 1); break;
            }
            
            // If this tile wasn't already a floor, convert it and increment counter
            if (this._dungeonGrid[y][x] === 0) {
                this._dungeonGrid[y][x] = 1;
                floorTiles++;
            }
            
            // Occasionally (1 in 50 chance) create a small room
            if (Math.random() < 0.02) {
                const roomWidth = Math.floor(Math.random() * (roomMaxWidth - roomMinWidth + 1)) + roomMinWidth;
                const roomHeight = Math.floor(Math.random() * (roomMaxHeight - roomMinHeight + 1)) + roomMinHeight;
                
                const roomX = Math.max(1, Math.min(dungeonWidth - roomWidth - 1, x - Math.floor(roomWidth / 2)));
                const roomY = Math.max(1, Math.min(dungeonHeight - roomHeight - 1, y - Math.floor(roomHeight / 2)));
                
                const room = new Room(roomX, roomY, roomWidth, roomHeight);
                
                // Check if the room overlaps with existing rooms
                let overlaps = false;
                for (const existingRoom of this._dungeonRooms) {
                    if (room.intersects(existingRoom, 1)) {
                        overlaps = true;
                        break;
                    }
                }
                
                if (!overlaps) {
                    this._dungeonRooms.push(room);
                    
                    // Carve out the room
                    for (let ry = room.y; ry < room.y + room.height; ry++) {
                        for (let rx = room.x; rx < room.x + room.width; rx++) {
                            if (this._dungeonGrid[ry][rx] === 0) {
                                this._dungeonGrid[ry][rx] = 1;
                                floorTiles++;
                            }
                        }
                    }
                }
            }
        }
        
        // Find and extract rooms from the open areas
        this.extractRoomsFromCellular();
    };
    
    // 4. Random Rooms Algorithm
    Game_System.prototype.generateRandomRoomsDungeon = function() {
        // Fill the grid with walls
        for (let y = 0; y < dungeonHeight; y++) {
            for (let x = 0; x < dungeonWidth; x++) {
                this._dungeonGrid[y][x] = 0; // 0 = wall
            }
        }
        
        // Try to place rooms
        const maxRooms = 30;
        const maxAttempts = 300;
        let attempts = 0;
        
        while (this._dungeonRooms.length < maxRooms && attempts < maxAttempts) {
            attempts++;
            
            // Random room size
            const roomWidth = Math.floor(Math.random() * (roomMaxWidth - roomMinWidth + 1)) + roomMinWidth;
            const roomHeight = Math.floor(Math.random() * (roomMaxHeight - roomMinHeight + 1)) + roomMinHeight;
            
            // Random position (with 1 tile border)
            const roomX = Math.floor(Math.random() * (dungeonWidth - roomWidth - 2)) + 1;
            const roomY = Math.floor(Math.random() * (dungeonHeight - roomHeight - 2)) + 1;
            
            const newRoom = new Room(roomX, roomY, roomWidth, roomHeight);
            
            // Check if this room intersects with any existing room
            let intersects = false;
            for (const room of this._dungeonRooms) {
                if (newRoom.intersects(room, 1)) {
                    intersects = true;
                    break;
                }
            }
            
            // If no intersection, add the room
            if (!intersects) {
                this._dungeonRooms.push(newRoom);
                
                // Carve out the room
                for (let y = newRoom.y; y < newRoom.y + newRoom.height; y++) {
                    for (let x = newRoom.x; x < newRoom.x + newRoom.width; x++) {
                        this._dungeonGrid[y][x] = 1; // 1 = floor
                    }
                }
            }
        }
        
        // Connect all rooms
        this.connectRooms();
    };
    
    //=============================================================================
    // Scene_Map Extensions - Handle fades and transitions
    //=============================================================================
    
    const _Scene_Map_onMapLoaded = Scene_Map.prototype.onMapLoaded;
    Scene_Map.prototype.onMapLoaded = function() {
        _Scene_Map_onMapLoaded.call(this);
        
        // If this is the dungeon map and it's not already generated, generate it
        if ($gameMap.mapId() === dungeonMapID && transferFirst && !$gameSystem._dungeonGrid) {
            // Set the tileset ID properly in $dataMap
            if ($dataMap) {
                $dataMap.tilesetId = tilesetID;
                // Set map looping in both directions
                $dataMap.scrollType = 3; // 3 means loop both horizontally and vertically
                // Force tileset refresh
                const tilesetTab = $gameParty.members().length > 0 ? $gameParty.battleMembers()[0].actorId() : 1;
                $gameMap.changeTileset(tilesetID);
            }
            
            $gameSystem.createDungeon(defaultAlgorithm);
        }
    };
    
    // Add a tileset change method to Game_Map
    Game_Map.prototype.changeTileset = function(tilesetId) {
        if ($dataMap) {
            $dataMap.tilesetId = tilesetId;
            this.refresh();
        }
    };
    
})();
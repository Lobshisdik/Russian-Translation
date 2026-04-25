/*:
 * @plugindesc v3.6 High-performance fog of war system with vision cones and smooth transitions (Optimized, Persistent, Configurable).
 * @author Omni-Lex (Modified)
 * 
 * @param Vision Angle
 * @desc Default vision angle for the player in degrees (360 for full circle)
 * @default 120
 * @type number
 * @min 1
 * @max 360
 * 
 * @param Exempt Event Names
 * @desc Events with these names will always be visible (comma-separated)
 * @default NPC,Chest,Trigger
 * @type text
 * 
 * @param Vision Blocking Event Names
 * @desc Events with these names will block vision (comma-separated)
 * @default Wall,Pillar,Column,Obstacle
 * @type text
 * 
 * @param Update Frequency
 * @desc How often to update fog of war (1 = every frame, 2 = every other frame, etc.)
 * @default 3
 * @type number
 * @min 1
 * 
 * @param Ray Count
 * @desc Number of rays to cast for vision (higher = more accurate but slower)
 * @default 60
 * @type number
 * @min 10
 * @max 360
 * 
 * @param Reset On New Game
 * @desc Reset fog of war data when starting a new game
 * @default true
 * @type boolean
 * 
 * @param Chunk Size
 * @desc Size of each fog of war rendering chunk in tiles (smaller = more responsive, larger = better performance)
 * @default 8
 * @type number
 * @min 4
 * @max 32
 * 
 * @param Never Seen Color
 * @desc Color for tiles never seen (CSS format)
 * @default #000000
 * @type string
 * 
 * @param Previously Seen Color
 * @desc Color for tiles seen before but not currently visible (CSS format)
 * @default rgba(0,0,0,0.6)
 * @type string
 * 
 * @param Vision Smoothing
 * @desc How smoothly vision follows the player (0-1, higher is smoother)
 * @default 0.8
 * @type number
 * @decimals 2
 * @min 0.1
 * @max 1.0
 * 
 * @param Transition Duration
 * @desc Duration of transition between visible and previously seen (in frames)
 * @default 30
 * @type number
 * @min 1
 * @max 120
 * 
 * @param Edge Feathering
 * @desc How much to soften the edges of visible area (0-1, higher is softer)
 * @default 0.3
 * @type number
 * @decimals 2
 * @min 0
 * @max 1
 * 
 * @param Add To Options Menu
 * @desc Add Fog of War toggle to options menu
 * @default true
 * @type boolean
 * 
 * @param Options Menu Text
 * @desc Text to display in the options menu
 * @default Fog of War
 * @type string
 * 
 * @command toggleFogOfWar
 * @text Toggle Fog of War
 * @desc Enables or disables the fog of war system
 * 
 * @param enable
 * @text Enable
 * @desc Enable or disable fog of war
 * @type boolean
 * @default true
 * 
 * @command resetFogOfWar
 * @text Reset Fog of War
 * @desc Resets fog of war data for the current map or all maps
 * 
 * @param target
 * @text Target
 * @desc Reset current map or all maps
 * @type select
 * @option Current Map
 * @value current
 * @option All Maps
 * @value all
 * @default current
 * 
 * @param Reveal Transition Duration
 * @desc Duration of transition when revealing tiles (in frames). Lower values = faster transition.
 * @default 10
 * @type number
 * @min 1
 * @max 60
 * 
 * @command revealEntireMap
 * @text Reveal Entire Map
 * @desc Reveals the entire current map
 * 
 * @help
 * FOG_OF_WAR.js
 * 
 * This plugin adds a high-performance fog of war system to your RPG Maker MZ game,
 * inspired by Dwarf Fortress's adventure mode.
 * 
 * Features:
 * - Unexplored tiles appear black
 * - Previously seen tiles appear grayscale
 * - Currently visible tiles appear normal
 * - Enemies outside vision are hidden
 * - Non-enemy events outside vision appear in black and white
 * - Vision cone system (configurable angle and distance)
 * - Persistent fog of war data across map visits
 * - Properly handles looping maps
 * - High-performance chunked rendering system
 * - Reveals wall tiles above the player when standing below terrain tag 4
 * - Smooth vision cone movement for fluid exploration
 * - In-game option to toggle Fog of War in the Options menu
 * - NEW: Smooth transition between visible and previously seen tiles
 * - NEW: Edge feathering for more natural vision boundaries
 * 
 * To determine if an event is an enemy:
 * - Add a number in the event's note field (e.g., "22", "55")
 * - Events with names like "NPC-33" or "Chest" won't be hidden
 * 
 * Plugin Commands:
 * - Toggle Fog of War: Enable or disable the entire system
 * - Reset Fog of War: Reset fog data for current map or all maps
 * - Reveal Entire Map: Makes the entire current map visible
 * 
 * Map Notes:
 * - To set a custom vision range for a specific map, add this to the map's notes:
 *   <VisionRange:15>
 * - If no vision range is specified in the map notes, the default of 10 will be used
 * 
 * Vision Blocking:
 * - Events with names listed in "Vision Blocking Event Names" parameter will block vision rays
 * - Use terrain tag 4 for tiles that should block vision
 * - When standing below terrain tag 4 (wall), the plugin will reveal 3 tiles above
 * 
 * Performance Tips:
 * - Increase the "Chunk Size" parameter for better performance (at cost of responsiveness)
 * - Increase the "Update Frequency" parameter to reduce CPU usage
 * - Decrease the "Ray Count" parameter if you experience lag
 * - For larger maps, consider using a smaller Vision Range
 * 
 * Version 3.6 Changes:
 * - Added smooth transition effect between visible and previously seen tiles
 * - Implemented edge feathering for more natural vision boundaries
 * - Enhanced tile state system to track transition progress
 * - Optimized rendering for better performance with transitions
 */

(function() {
    'use strict';
    
    const pluginName = "FOG_OF_WAR";
    const parameters = PluginManager.parameters(pluginName);
    
    const DEFAULT_VISION_RANGE = 10;
    const DEFAULT_VISION_ANGLE = 160;
    const EXEMPT_EVENT_NAMES = (parameters['Exempt Event Names'] || "NPC,Chest,Trigger").split(',').map(s => s.trim());
    const VISION_BLOCKING_EVENT_NAMES = ("locked_key,door_i,locked,Wall,Pillar,Door,Column,Room,Obstacle").split(',').map(s => s.trim());
    const UPDATE_FREQUENCY = Number(parameters['Update Frequency'] || 3);
    const RAY_COUNT = Number(parameters['Ray Count'] || 60);
    const RESET_ON_NEW_GAME = parameters['Reset On New Game'] !== 'false';
    const CHUNK_SIZE = Number(parameters['Chunk Size'] || 8);
    const NEVER_SEEN_COLOR = parameters['Never Seen Color'] || '#000000';
    const PREVIOUSLY_SEEN_COLOR = parameters['Previously Seen Color'] || 'rgba(0,0,0,0.4)';
    const VISION_SMOOTHING = Number(parameters['Vision Smoothing'] || 0.8);
    const REVEAL_TRANSITION_DURATION = Number(parameters['Reveal Transition Duration'] || 10);
    // New parameters for transitions
    const TRANSITION_DURATION = Number(parameters['Transition Duration'] || 30);
    const EDGE_FEATHERING = Number(parameters['Edge Feathering'] || 0.3);
    
    // New parameters for options menu
    const ADD_TO_OPTIONS_MENU = parameters['Add To Options Menu'] !== 'false';
    const OPTIONS_MENU_TEXT = parameters['Options Menu Text'] || 'Fog of War';
    
    let fogOfWarEnabled = true;
    let updateCounter = 0;
    
    // Register plugin commands
    PluginManager.registerCommand(pluginName, "toggleFogOfWar", args => {
        fogOfWarEnabled = args.enable === "true";
        
        // Save this setting to config if options menu is enabled
        if (ADD_TO_OPTIONS_MENU) {
            ConfigManager.fogOfWar = fogOfWarEnabled;
            ConfigManager.save();
        }
        
        if (SceneManager._scene instanceof Scene_Map) {
            SceneManager._scene._spriteset.refreshFogOfWar();
        }
    });

    
// Register the new plugin command
PluginManager.registerCommand(pluginName, "disableFogForMap", args => {
    const disable = args.disable === "true";
    if (disable) {
        // Store in map metadata that this map should have fog disabled
        $gameMap._fogOfWarDisabled = true;
        
        // Hide the fog container if we're in a map scene
        if (SceneManager._scene instanceof Scene_Map) {
            SceneManager._scene._spriteset._fogContainer.visible = false;
        }
    } else {
        // Re-enable fog for this map
        $gameMap._fogOfWarDisabled = false;
        
        // Show the fog container if we're in a map scene and fog is globally enabled
        if (SceneManager._scene instanceof Scene_Map && fogOfWarEnabled) {
            SceneManager._scene._spriteset._fogContainer.visible = true;
            SceneManager._scene._spriteset.refreshFogOfWar(true);
        }
    }
});
    
    // Command to reset fog of war data
    PluginManager.registerCommand(pluginName, "resetFogOfWar", args => {
        const target = args.target || "current";
        if (target === "current") {
            // Reset current map only
            $gameSystem.resetFogOfWarForMap($gameMap.mapId());
            $gameMap.initializeFogOfWar();
        } else if (target === "all") {
            // Reset all maps
            $gameSystem.resetAllFogOfWar();
            $gameMap.initializeFogOfWar();
        }
        if (SceneManager._scene instanceof Scene_Map) {
            SceneManager._scene._spriteset.refreshFogOfWar();
        }
    });
    
    // Command to reveal the entire map
    PluginManager.registerCommand(pluginName, "revealEntireMap", args => {
        if ($gameMap && $gameMap._fogOfWarData) {
            // Set all tiles to "visible" state (2) with a reveal transition
            for (let i = 0; i < $gameMap._fogOfWarData.length; i++) {
                const oldState = $gameMap._fogOfWarData[i];
                if (oldState !== 2) { // Only transition if not already visible
                    $gameMap._fogOfWarData[i] = 2;
                    // Apply reveal transition
                    $gameMap._fogTransitionTimers[i] = -REVEAL_TRANSITION_DURATION;
                } else {
                    $gameMap._fogTransitionTimers[i] = 0;
                }
            }
            
            // Mark all chunks as dirty for refresh
            $gameMap.markAllChunksDirty();
            
            // Save the updated fog data
            $gameSystem.setFogOfWarData($gameMap.mapId(), {
                states: Array.from($gameMap._fogOfWarData),
                timers: Array.from($gameMap._fogTransitionTimers)
            });
            
            // Refresh the fog of war display
            if (SceneManager._scene instanceof Scene_Map) {
                SceneManager._scene._spriteset.refreshFogOfWar();
            }
        }
    });
    // Add reset functionality on new game
    const _DataManager_setupNewGame = DataManager.setupNewGame;
    DataManager.setupNewGame = function() {
        _DataManager_setupNewGame.call(this);

        // Reset fog of war data when starting a new game
        if (RESET_ON_NEW_GAME) {
            if ($gameSystem) {
                $gameSystem.resetAllFogOfWar();
            }
        }
    };

    // Add method to Game_System to handle full lighting reload
    Game_System.prototype.reloadFogOfWarLighting = function() {
        if (!$gameMap) return;

        // Reset lighting state
        $gameMap._lastUpdateTime = 0;
        $gameMap._playerIdleTime = 0;
        $gameMap._playerWasMoving = false;

        // Clear terrain cache to force recalculation
        if ($gameMap._terrainCache) {
            $gameMap._terrainCache.clear();
        }

        // Reset all transitions to clean state
        if ($gameMap._fogTransitionTimers) {
            for (let i = 0; i < $gameMap._fogTransitionTimers.length; i++) {
                $gameMap._fogTransitionTimers[i] = 0;
            }
        }

        // Clear active transitions
        if ($gameMap._activeTransitions) {
            $gameMap._activeTransitions.clear();
        }

        // Force all chunks to be dirty and redrawn
        $gameMap.markAllChunksDirty();

        // Trigger immediate vision update
        if ($gamePlayer) {
            $gameMap.updateFogOfWar();
        }
    };
    
    //=============================================================================
    // ConfigManager - Handle options menu
    //=============================================================================
    
    // Add FOG_OF_WAR to ConfigManager
    ConfigManager.fogOfWar = true;
    
    // Save FOG_OF_WAR setting
    const _ConfigManager_makeData = ConfigManager.makeData;
    ConfigManager.makeData = function() {
        const config = _ConfigManager_makeData.call(this);
        config.fogOfWar = this.fogOfWar;
        return config;
    };
    
    // Load FOG_OF_WAR setting
    const _ConfigManager_applyData = ConfigManager.applyData;
    ConfigManager.applyData = function(config) {
        _ConfigManager_applyData.call(this, config);
        this.fogOfWar = this.readFlag(config, 'fogOfWar', true);
        
        // Apply the loaded setting
        fogOfWarEnabled = this.fogOfWar;
    };
    
    //=============================================================================
    // Window_Options - Add FOG_OF_WAR option
    //=============================================================================
    
    if (ADD_TO_OPTIONS_MENU) {
        const _Window_Options_addGeneralOptions = Window_Options.prototype.addGeneralOptions;
        Window_Options.prototype.addGeneralOptions = function() {
            _Window_Options_addGeneralOptions.call(this);
            this.addCommand(OPTIONS_MENU_TEXT, 'fogOfWar');
        };
    }
    
    //=============================================================================
    // Game_System
    //=============================================================================
    
    const _Game_System_initialize = Game_System.prototype.initialize;
    Game_System.prototype.initialize = function() {
        _Game_System_initialize.call(this);
        this._fogOfWarData = {}; // Store fog data for each map
    };
    
    Game_System.prototype.getFogOfWarData = function(mapId) {
        if (!this._fogOfWarData) this._fogOfWarData = {};
        return this._fogOfWarData[mapId] || null;
    };
    
    Game_System.prototype.setFogOfWarData = function(mapId, data) {
        if (!this._fogOfWarData) this._fogOfWarData = {};
        this._fogOfWarData[mapId] = data;
    };
    
    Game_System.prototype.resetFogOfWarForMap = function(mapId) {
        if (this._fogOfWarData && this._fogOfWarData[mapId]) {
            delete this._fogOfWarData[mapId];
        }
    };
    
    Game_System.prototype.resetAllFogOfWar = function() {
        this._fogOfWarData = {};
    };
    
    //=============================================================================
    // Game_Map
    //=============================================================================
    
    const _Game_Map_initialize = Game_Map.prototype.initialize;
    Game_Map.prototype.initialize = function() {
        _Game_Map_initialize.call(this);
        this._fogOfWarData = null;
        this._fogTransitionTimers = null;
        this._dirtyChunks = new Set();
        this._activeTransitions = new Set(); // Add this line
        this._playerLastX = -1;
        this._playerLastY = -1;
        this._playerLastDir = -1;
        this._lastUpdateTime = 0;
        this._visionRange = DEFAULT_VISION_RANGE;
        this._visionX = 0;
        this._visionY = 0;
        
        // New variables for idle detection
        this._playerIdleTime = 0;
        this._playerIdleThreshold = 10;
        this._playerWasMoving = false;
    };
    
    
    const _Game_Map_setup = Game_Map.prototype.setup;
    Game_Map.prototype.setup = function(mapId) {
        _Game_Map_setup.call(this, mapId);


        // Check if this map should have fog disabled based on notes
        this._fogOfWarDisabled = false;
        this._visibleFogOfWar = false; // NEW: Flag for persistent visibility
        if ($dataMap && $dataMap.note) {
            this._fogOfWarDisabled = $dataMap.note.includes("<DisableFogOfWar>");
            this._visibleFogOfWar = $dataMap.note.includes("<VisibleFogOfWar>"); // NEW: Check for visible fog tag
        }

        // Always reset fog of war for procedural map (map 636) on every visit
        // This ensures fog regenerates even when teleporting to the same map
        if (mapId === 636) {
            $gameSystem.resetFogOfWarForMap(mapId);
        }

        this.initializeFogOfWar();
        this.loadVisionRangeFromMapNotes(); // Load custom vision range from map notes

        // Initialize vision coordinates to player position
        this._visionX = $gamePlayer.x;
        this._visionY = $gamePlayer.y;
    };

    
    // New method to load vision range from map notes
    Game_Map.prototype.loadVisionRangeFromMapNotes = function() {
        this._visionRange = DEFAULT_VISION_RANGE; // Reset to default
        
        if ($dataMap && $dataMap.note) {
            const match = $dataMap.note.match(/<VisionRange:(\d+)>/i);
            if (match) {
                const value = parseInt(match[1]);
                if (!isNaN(value) && value > 0) {
                    this._visionRange = value;
                }
            }
        }
    };
    Game_Map.prototype.revealBorderingTiles = function(centerX, centerY) {
        // Define the 8 directions around the player (including diagonals)
        const cardinalDirections = [
            [-1, 0], [1, 0], [0, -1], [0, 1]  // Left, Right, Up, Down
        ];
        const diagonalDirections = [
            [-1, -1], [-1, 1], [1, -1], [1, 1]  // Top-left, Top-right, Bottom-left, Bottom-right
        ];

        // Always reveal the player's current tile
        this.setFogOfWarState(centerX, centerY, 2);

        // Reveal cardinal direction tiles (only if they don't block vision)
        for (const [dx, dy] of cardinalDirections) {
            const x = centerX + dx;
            const y = centerY + dy;

            // Always reveal the adjacent tile (including walls/doors so you can see them)
            this.setFogOfWarState(x, y, 2);

            // Mark events on these tiles as bordering player
            const events = this.eventsXy(x, y);
            if (events.length > 0) {
                for (const event of events) {
                    event.updateFogOfWarVisibility(true);
                    event._fogOfWarBorderingPlayer = true;
                }
            }
        }

        // For diagonal tiles, only reveal if the path isn't blocked
        for (const [dx, dy] of diagonalDirections) {
            const x = centerX + dx;
            const y = centerY + dy;

            // Check if the two cardinal tiles that lead to this diagonal are blocking
            const horizontalBlocked = this.isVisionBlocking(centerX + dx, centerY);
            const verticalBlocked = this.isVisionBlocking(centerX, centerY + dy);

            // Only reveal diagonal tile if at least one path is clear
            if (!horizontalBlocked || !verticalBlocked) {
                this.setFogOfWarState(x, y, 2);

                // Mark events on these tiles as bordering player
                const events = this.eventsXy(x, y);
                if (events.length > 0) {
                    for (const event of events) {
                        event.updateFogOfWarVisibility(true);
                        event._fogOfWarBorderingPlayer = true;
                    }
                }
            }
        }
    };
    
    // Method to get current vision range
    Game_Map.prototype.visionRange = function() {
        return this._visionRange;
    };
    
    Game_Map.prototype.initializeFogOfWar = function() {
        const size = this.width() * this.height();
        
        // Check if we have saved data for this map
        const savedData = $gameSystem.getFogOfWarData(this._mapId);
        
        if (savedData && savedData.states && savedData.timers) {
            // Use saved data if it exists and dimensions match
            if (savedData.states.length === size && savedData.timers.length === size) {
                this._fogOfWarData = new Uint8Array(savedData.states);
                this._fogTransitionTimers = new Uint8Array(savedData.timers);
            } else {
                // If dimensions don't match (map was changed), create new data
                this._fogOfWarData = new Uint8Array(size);
                this._fogTransitionTimers = new Uint8Array(size);
            }
        } else if (savedData && !savedData.states && !savedData.timers && savedData.length === size) {
            // Backward compatibility with old format (before transitions)
            this._fogOfWarData = new Uint8Array(savedData);
            this._fogTransitionTimers = new Uint8Array(size);
        } else {
            // Create new fog data if none exists
            this._fogOfWarData = new Uint8Array(size);
            this._fogTransitionTimers = new Uint8Array(size);
        }
        
        // Ensure _activeTransitions and _terrainCache are properly initialized
        this._activeTransitions = new Set();
        this._terrainCache = new Map();
        
        // Mark all chunks as dirty for initial render
        this._dirtyChunks = new Set();
        const chunksX = Math.ceil(this.width() / CHUNK_SIZE);
        const chunksY = Math.ceil(this.height() / CHUNK_SIZE);
        
        for (let cy = 0; cy < chunksY; cy++) {
            for (let cx = 0; cx < chunksX; cx++) {
                this._dirtyChunks.add(`${cx},${cy}`);
            }
        }
        
        this._playerLastX = -1;
        this._playerLastY = -1;
        this._playerLastDir = -1;
        this._lastUpdateTime = 0;
    };
    
    Game_Map.prototype.fogOfWarState = function(x, y) {
        if (this._fogOfWarDisabled || !fogOfWarEnabled) return 2;        // Handle map looping
        if (this.isLoopHorizontal()) {
            x = (x + this.width()) % this.width();
        }
        if (this.isLoopVertical()) {
            y = (y + this.height()) % this.height();
        }
        
        // Check boundaries after adjusting for looping
        if (x < 0 || y < 0 || x >= this.width() || y >= this.height()) return 0;
        
        return this._fogOfWarData[y * this.width() + x] || 0;
    };
    
    // New method to get transition timer for a tile
    Game_Map.prototype.fogTransitionTimer = function(x, y) {
        // Handle map looping
        if (this.isLoopHorizontal()) {
            x = (x + this.width()) % this.width();
        }
        if (this.isLoopVertical()) {
            y = (y + this.height()) % this.height();
        }
        
        // Check boundaries after adjusting for looping
        if (x < 0 || y < 0 || x >= this.width() || y >= this.height()) return 0;
        
        return this._fogTransitionTimers[y * this.width() + x] || 0;
    };
    Game_Map.prototype.setFogOfWarState = function(x, y, state) {
        // Handle map looping
        if (this.isLoopHorizontal()) {
            x = (x + this.width()) % this.width();
        }
        if (this.isLoopVertical()) {
            y = (y + this.height()) % this.height();
        }
        
        // Check boundaries
        if (x >= 0 && y >= 0 && x < this.width() && y < this.height()) {
            const index = y * this.width() + x;
            const oldState = this._fogOfWarData[index];
            
            // Only update if the state has changed
            if (oldState !== state) {
                // Ensure _activeTransitions is properly initialized as a Set
                if (!this._activeTransitions || typeof this._activeTransitions.add !== 'function') {
                    this._activeTransitions = new Set();
                }
                
                // Ensure _fogTransitionTimers is initialized
                if (!this._fogTransitionTimers) {
                    this._fogTransitionTimers = new Uint8Array(this.width() * this.height());
                }
                
                if (oldState === 2 && state === 1) {
                    this._fogTransitionTimers[index] = TRANSITION_DURATION;
                    this._activeTransitions.add(index);
                } else if ((oldState === 1 || oldState === 0) && state === 2) {
                    this._fogTransitionTimers[index] = -REVEAL_TRANSITION_DURATION;
                    this._activeTransitions.add(index);
                } else {
                    this._fogTransitionTimers[index] = 0;
                    this._activeTransitions.delete(index);
                }
                
                this._fogOfWarData[index] = state;
                
                // Mark chunk as dirty
                const chunkX = Math.floor(x / CHUNK_SIZE);
                const chunkY = Math.floor(y / CHUNK_SIZE);
                if (!this._dirtyChunks || !(this._dirtyChunks instanceof Set)) {
                    this._dirtyChunks = new Set();
                }
                this._dirtyChunks.add(`${chunkX},${chunkY}`);
            }
        }
    };
    // New method to update transition timers
// New method to update transition timers
Game_Map.prototype.updateTransitionTimers = function() {
    const width = this.width();
    const size = width * this.height();
    
    // Only check tiles that are likely to have active transitions
    // Keep track of active transition indices for faster updates
    if (!this._activeTransitions || typeof this._activeTransitions.values !== 'function') {
        this._activeTransitions = new Set();
        return; // Exit early if we just initialized
    }
    
    // Update existing active transitions
    // Create array copy to avoid modification during iteration
    const activeIndices = Array.from(this._activeTransitions);
    for (const i of activeIndices) {
        if (i >= size) {
            this._activeTransitions.delete(i);
            continue;
        }
        
        const timer = this._fogTransitionTimers[i];
        if (timer > 0) {
            this._fogTransitionTimers[i]--;
            if (this._fogTransitionTimers[i] === 0) {
                this._activeTransitions.delete(i);
            }
        } else if (timer < 0) {
            this._fogTransitionTimers[i]++;
            if (this._fogTransitionTimers[i] === 0) {
                this._activeTransitions.delete(i);
            }
        } else {
            this._activeTransitions.delete(i);
            continue;
        }
        
        // Mark chunk as dirty
        const x = i % width;
        const y = Math.floor(i / width);
        const chunkX = Math.floor(x / CHUNK_SIZE);
        const chunkY = Math.floor(y / CHUNK_SIZE);
        this._dirtyChunks.add(`${chunkX},${chunkY}`);
    }
};
    
    Game_Map.prototype.markAllChunksDirty = function() {
        this._dirtyChunks = new Set();
        const chunksX = Math.ceil(this.width() / CHUNK_SIZE);
        const chunksY = Math.ceil(this.height() / CHUNK_SIZE);
        
        for (let cy = 0; cy < chunksY; cy++) {
            for (let cx = 0; cx < chunksX; cx++) {
                this._dirtyChunks.add(`${cx},${cy}`);
            }
        }
    };
    
    Game_Map.prototype.getDirtyChunks = function() {
        return Array.from(this._dirtyChunks);
    };
    
    Game_Map.prototype.clearDirtyChunks = function() {
        this._dirtyChunks.clear();
    };
    
    Game_Map.prototype.isPositionVisible = function(x, y) {
        return this.fogOfWarState(x, y) === 2;
    };
    
    // Updated to use smooth vision position and handle transitions
    Game_Map.prototype.updateFogOfWar = function() {
        if (!ConfigManager.fogOfWar) {
            fogOfWarEnabled = false;
            return;
        } else {
            fogOfWarEnabled = true;
        }
        if (this._fogOfWarDisabled) return;
        
        const player = $gamePlayer;
        
        // Initialize vision coordinates if needed
        if (this._visionX === undefined) this._visionX = player.x;
        if (this._visionY === undefined) this._visionY = player.y;
        
        // Only update vision if player moved significantly or direction changed
        const positionChanged = Math.abs(player.x - this._playerLastX) > 0.1 || 
                               Math.abs(player.y - this._playerLastY) > 0.1;
        const directionChanged = player.direction() !== this._playerLastDir;
        
        // Always update transition timers for smooth fading
        this.updateTransitionTimers();
        
        // REMOVED THE CONDITION - Always update vision to detect moving enemies
        // Smoothly update vision coordinates with higher precision
        const realX = player.x + (player._realX - player.x);
        const realY = player.y + (player._realY - player.y);
        
        this._visionX += (realX - this._visionX) * VISION_SMOOTHING;
        this._visionY += (realY - this._visionY) * VISION_SMOOTHING;
        
        // Only update last position if it actually changed
        if (positionChanged || directionChanged) {
            this._playerLastX = player.x;
            this._playerLastY = player.y;
            this._playerLastDir = player.direction();
            
            // Clear terrain cache when player moves to new position
            if (this._terrainCache) {
                this._terrainCache.clear();
            }
        }
        
        if (!this._visibleFogOfWar && (positionChanged || directionChanged)) {
            // Optimized fog reset - only reset in a smaller radius
            const resetRange = this.visionRange() + 1;
            const centerX = Math.floor(this._visionX);
            const centerY = Math.floor(this._visionY);
            
            for (let dy = -resetRange; dy <= resetRange; dy++) {
                for (let dx = -resetRange; dx <= resetRange; dx++) {
                    const x = centerX + dx;
                    const y = centerY + dy;
                    
                    if (this.isValid(x, y)) {
                        const index = y * this.width() + x;
                        if (this._fogOfWarData[index] === 2) {
                            this._fogOfWarData[index] = 1;
                            this._fogTransitionTimers[index] = TRANSITION_DURATION;
                            
                            const chunkX = Math.floor(x / CHUNK_SIZE);
                            const chunkY = Math.floor(y / CHUNK_SIZE);
                            this._dirtyChunks.add(`${chunkX},${chunkY}`);
                        }
                    }
                }
            }
        }
        
        // Always calculate vision to detect moving enemies
        this.calculateVision(this._visionX, this._visionY, player.direction());
        this.updateEventVisibility();
        
        // Batch save fog data less frequently
        if (!this._fogSaveTimer) this._fogSaveTimer = 0;
        this._fogSaveTimer++;
        
        if (this._fogSaveTimer >= 10) { // Save every 10 updates instead of every update
            $gameSystem.setFogOfWarData(this._mapId, {
                states: Array.from(this._fogOfWarData),
                timers: Array.from(this._fogTransitionTimers)
            });
            this._fogSaveTimer = 0;
        }
    };
    
    // Updated to work with fractional coordinates, extended behind player, and edge feathering
    Game_Map.prototype.calculateVision = function(centerX, centerY, direction) {
        let range = this.visionRange(); // Use map-specific vision range

        // Check if player is standing on a roof tile (terrain tag 7)
        const playerX = Math.floor(centerX);
        const playerY = Math.floor(centerY);
        const playerOnRoof = this.terrainTag(playerX, playerY) === 7;

        // Double vision range if player is standing on a roof tile
        if (playerOnRoof) {
            range = range * 2;
        }

        const angleInDegrees = DEFAULT_VISION_ANGLE;
        const angleInRadians = angleInDegrees * Math.PI / 180;

        // Always make the player's tile and adjacent tiles visible for smoother experience
        const cX = Math.floor(centerX);
        const cY = Math.floor(centerY);

        // NEW: Always reveal bordering tiles and their events
        this.revealBorderingTiles(cX, cY);

        // Check if player is standing below a terrain tag 4 (wall) to reveal wall tiles above
        this.revealWallTilesAbovePlayer(cX, cY);
        
        // Calculate the direction vectors
        const dirVectors = {
            2: [0, 1],   // Down
            4: [-1, 0],  // Left
            6: [1, 0],   // Right
            8: [0, -1]   // Up
        };
        
        // Get the direction vector for the current direction
        const dirVector = dirVectors[direction] || [0, 0];
        
        // Reveal tiles behind the player, but stop at vision blockers
        let blocked = false;
        for (let i = 1; i <= 3 && !blocked; i++) {
            const behindX = cX - dirVector[0] * i;
            const behindY = cY - dirVector[1] * i;

            // Check if this tile blocks vision
            if (this.isVisionBlocking(behindX, behindY)) {
                // Reveal the blocker itself but stop here
                this.setFogOfWarState(behindX, behindY, 2);
                blocked = true;
                break;
            }

            // Set this tile as visible
            this.setFogOfWarState(behindX, behindY, 2);

            // Also reveal adjacent tiles to the "behind" line, but check for blockers
            if (i <= 2) { // Only for the first 2 tiles to avoid excessive width
                if (direction === 2 || direction === 8) { // Up or Down
                    const leftX = behindX - 1;
                    const rightX = behindX + 1;
                    // Only reveal if not blocking
                    if (!this.isVisionBlocking(leftX, behindY)) {
                        this.setFogOfWarState(leftX, behindY, 2);
                    }
                    if (!this.isVisionBlocking(rightX, behindY)) {
                        this.setFogOfWarState(rightX, behindY, 2);
                    }
                } else { // Left or Right
                    const aboveY = behindY - 1;
                    const belowY = behindY + 1;
                    // Only reveal if not blocking
                    if (!this.isVisionBlocking(behindX, aboveY)) {
                        this.setFogOfWarState(behindX, aboveY, 2);
                    }
                    if (!this.isVisionBlocking(behindX, belowY)) {
                        this.setFogOfWarState(behindX, belowY, 2);
                    }
                }
            }
        }
        
        // Direction to base angle conversion
        const baseAngle = {
            2: Math.PI / 2,  // Down
            4: Math.PI,      // Left
            6: 0,            // Right
            8: Math.PI * 3/2 // Up
        }[direction] || 0;

        // Check if there's a vision blocker directly behind the player
        const behindX = cX - dirVector[0];
        const behindY = cY - dirVector[1];
        const blockerBehind = this.isVisionBlocking(behindX, behindY);

        // Only shift origin if there's no blocker behind player
        // This prevents casting rays through walls when turning
        let visionOriginX, visionOriginY, effectiveRange;
        if (!blockerBehind) {
            // Safe to shift - no wall behind player
            visionOriginX = centerX - dirVector[0] * 1.5;
            visionOriginY = centerY - dirVector[1] * 1.5;
            effectiveRange = range + 1.5;
        } else {
            // Don't shift - cast from player position to avoid seeing through walls
            visionOriginX = centerX;
            visionOriginY = centerY;
            effectiveRange = range;
        }

        // Cast rays in a cone shape from the origin
        const halfAngle = angleInRadians / 2;
        const rayCount = RAY_COUNT; // Configurable ray count

        for (let i = 0; i < rayCount; i++) {
            const angle = baseAngle - halfAngle + (angleInRadians * i / rayCount);
            this.castRay(visionOriginX, visionOriginY, angle, effectiveRange, playerOnRoof);
        }
    };
    
    // New method to reveal wall tiles above the player
    Game_Map.prototype.revealWallTilesAbovePlayer = function(playerX, playerY) {
        // Check if the tile above the player has terrain tag 4 (wall)
        const wallY = playerY - 1; // The tile immediately above
        
        if (this.isValid(playerX, wallY) && this.terrainTag(playerX, wallY) === 4) {
            // Reveal the wall and 2 tiles above it
            for (let y = 1; y <= 3; y++) {
                const tileY = playerY - y;
                if (this.isValid(playerX, tileY)) {
                    this.setFogOfWarState(playerX, tileY, 2);
                    
                    // Also reveal adjacent wall tiles for continuous walls
                    if (this.isValid(playerX - 1, tileY) && this.terrainTag(playerX - 1, tileY) === 4) {
                        this.setFogOfWarState(playerX - 1, tileY, 2);
                    }
                    if (this.isValid(playerX + 1, tileY) && this.terrainTag(playerX + 1, tileY) === 4) {
                        this.setFogOfWarState(playerX + 1, tileY, 2);
                    }
                }
            }
        }
        
        // Also check the tiles to the left and right if they have terrain tag 4
        const leftX = playerX - 1;
        const rightX = playerX + 1;
        
        if (this.isValid(leftX, playerY) && this.terrainTag(leftX, playerY) === 4) {
            // Reveal the wall above the left tile
            for (let y = 1; y <= 3; y++) {
                const tileY = playerY - y;
                if (this.isValid(leftX, tileY)) {
                    this.setFogOfWarState(leftX, tileY, 2);
                }
            }
        }
        
        if (this.isValid(rightX, playerY) && this.terrainTag(rightX, playerY) === 4) {
            // Reveal the wall above the right tile
            for (let y = 1; y <= 3; y++) {
                const tileY = playerY - y;
                if (this.isValid(rightX, tileY)) {
                    this.setFogOfWarState(rightX, tileY, 2);
                }
            }
        }
    };
    
    // Modified to prevent seeing through walls/doors - check blocking BEFORE revealing tile
Game_Map.prototype.castRay = function(startX, startY, angle, maxDistance) {
    const dx = Math.cos(angle);
    const dy = Math.sin(angle);
    const width = this.width();
    const height = this.height();
    const isLoopHorizontal = this.isLoopHorizontal();
    const isLoopVertical = this.isLoopVertical();

    let currentX = startX;
    let currentY = startY;
    let distance = 0;
    let lastTileX = Math.floor(startX);
    let lastTileY = Math.floor(startY);

    // Use DDA-like algorithm for more efficient tile traversal
    const stepSize = 0.5; // Fixed step size for better performance
    const maxSteps = Math.ceil(maxDistance / stepSize);

    for (let step = 0; step < maxSteps; step++) {
        currentX += dx * stepSize;
        currentY += dy * stepSize;
        distance += stepSize;

        if (distance >= maxDistance) break;

        let tileX = Math.floor(currentX);
        let tileY = Math.floor(currentY);

        // Skip if we're still on the same tile
        if (tileX === lastTileX && tileY === lastTileY) {
            continue;
        }

        // Handle map looping
        if (isLoopHorizontal) {
            tileX = (tileX + width) % width;
        }
        if (isLoopVertical) {
            tileY = (tileY + height) % height;
        }

        // Check boundaries
        if (tileX < 0 || tileY < 0 || tileX >= width || tileY >= height) {
            break;
        }

        lastTileX = tileX;
        lastTileY = tileY;

        // Check for vision blocking BEFORE revealing tile to prevent seeing through walls
        if (this.isVisionBlocking(tileX, tileY)) {
            // Reveal the blocking tile itself (so you can see walls/doors)
            this.setFogOfWarState(tileX, tileY, 2);
            // Do NOT apply edge feathering - this prevents revealing tiles behind walls
            break;
        }

        // Mark tile as visible only if it doesn't block
        this.setFogOfWarState(tileX, tileY, 2);

        // Apply edge feathering only near max distance AND only for non-blocking tiles
        if (distance > maxDistance - 1) {
            this.applyEdgeFeathering(tileX, tileY);
        }
    }
};
    // New method to apply edge feathering - improved to not reveal tiles behind blockers
    Game_Map.prototype.applyEdgeFeathering = function(centerX, centerY) {
        // Only apply edge feathering if enabled
        if (EDGE_FEATHERING <= 0) return;

        // Don't apply feathering if the center tile itself is a vision blocker
        // This prevents revealing tiles on the other side of walls/doors
        if (this.isVisionBlocking(centerX, centerY)) {
            return;
        }

        // Process adjacent tiles with special transition effects
        // This creates a subtle gradient at the edge of vision
        const adjacentOffsets = [
            [-1, 0], [1, 0], [0, -1], [0, 1]  // Four cardinal directions
        ];

        for (const [dx, dy] of adjacentOffsets) {
            const adjX = centerX + dx;
            const adjY = centerY + dy;

            // Skip if out of bounds
            if (!this.isValid(adjX, adjY)) continue;

            // IMPORTANT: Don't feather tiles that are vision blockers themselves
            // This prevents revealing what's behind walls/doors
            if (this.isVisionBlocking(adjX, adjY)) {
                continue;
            }

            // Get the current state of this adjacent tile
            const index = adjY * this.width() + adjX;
            const currentState = this._fogOfWarData[index];

            // Only apply feathering to tiles not currently visible
            if (currentState !== 2) {
                // If the tile is in never-seen state, switch it to previously-seen
                if (currentState === 0) {
                    this._fogOfWarData[index] = 1;
                }

                // Apply a transition timer based on distance to create a wave effect
                // if the tile isn't already transitioning
                if (this._fogTransitionTimers[index] === 0) {
                    this._fogTransitionTimers[index] = Math.floor(TRANSITION_DURATION * 0.8);
                }

                // Mark the corresponding chunk as dirty
                const chunkX = Math.floor(adjX / CHUNK_SIZE);
                const chunkY = Math.floor(adjY / CHUNK_SIZE);
                if (!this._dirtyChunks || !(this._dirtyChunks instanceof Set)) {
                    this._dirtyChunks = new Set();
                }
                this._dirtyChunks.add(`${chunkX},${chunkY}`);
            }
        }
    };
    
// Optimized refreshFogOfWar function to load a circular area around the player on map load
Spriteset_Map.prototype.refreshFogOfWar = function(fullRefresh = false) {
    if (!fogOfWarEnabled) {
        this._fogContainer.visible = false;
        return;
    }
    if ($gameMap && $gameMap._fogOfWarDisabled) {
        this._fogContainer.visible = false;
        return;
    }
    this._fogContainer.visible = true;
    
    if (fullRefresh) {
        // Clear all existing chunks
        for (const key in this._fogChunks) {
            if (this._fogChunks[key]) {
                this._fogContainer.removeChild(this._fogChunks[key]);
            }
        }
        this._fogChunks = {};
        
        // If this is a full refresh on map load, reveal a circular area around the player
        if ($gamePlayer && $gameMap) {
            const playerX = $gamePlayer.x;
            const playerY = $gamePlayer.y;
            const playerDirection = $gamePlayer.direction();
            
            // Initialize vision coordinates to player position
            $gameMap._visionX = playerX;
            $gameMap._visionY = playerY;
            
            // Calculate and reveal the current vision cone
            $gameMap.calculateVision(playerX, playerY, playerDirection);
            
            // Force an immediate update of fog and transitions
            $gameMap.updateTransitionTimers();
        }
        
        // Mark all chunks as dirty for a full refresh
        $gameMap.markAllChunksDirty();
    }
    
    // Update all dirty chunks
    const dirtyChunks = $gameMap.getDirtyChunks();
    this.updateDirtyChunks(dirtyChunks);
    $gameMap.clearDirtyChunks();
};

// New helper method to reveal a circular area around a point
Spriteset_Map.prototype.revealCircularArea = function(centerX, centerY, radius) {
    // Calculate the square of the radius for faster distance checks
    const radiusSquared = radius * radius;
    
    // Calculate bounds with extra buffer
    const startX = Math.max(0, centerX - radius - 1);
    const endX = Math.min($gameMap.width() - 1, centerX + radius + 1);
    const startY = Math.max(0, centerY - radius - 1);
    const endY = Math.min($gameMap.height() - 1, centerY + radius + 1);
    
    // Loop through tiles in a square and check if they're in the circle
    for (let y = startY; y <= endY; y++) {
        for (let x = startX; x <= endX; x++) {
            // Calculate squared distance to center (faster than using Math.sqrt)
            const distanceSquared = (x - centerX) * (x - centerX) + (y - centerY) * (y - centerY);
            
            // If within circle, set to visible state
            if (distanceSquared <= radiusSquared) {
                // Use state 2 for visible, with a reveal transition
                $gameMap.setFogOfWarState(x, y, 2);
                
                // Set a small transition timer for a nice reveal effect
                const distance = Math.sqrt(distanceSquared);
                const transitionDelay = Math.round((distance / radius) * REVEAL_TRANSITION_DURATION);
                
                // Store negative timer value for reveal transition (fade in)
                const index = y * $gameMap.width() + x;
                $gameMap._fogTransitionTimers[index] = -Math.max(1, REVEAL_TRANSITION_DURATION - transitionDelay);
            }
        }
    }
    
    // Save the updated fog data
    $gameSystem.setFogOfWarData($gameMap.mapId(), {
        states: Array.from($gameMap._fogOfWarData),
        timers: Array.from($gameMap._fogTransitionTimers)
    });
};

// Optimized raycast function for better performance - prevents seeing through walls/doors
Game_Map.prototype.castRay = function(startX, startY, angle, maxDistance, playerOnRoof = false) {
    // Use adaptive step size - smaller near player, larger far away
    const baseStepSize = 0.2;
    const maxStepSize = 0.8;

    // Pre-calculate constants for better performance
    const dx = Math.cos(angle);
    const dy = Math.sin(angle);
    const width = this.width();
    const height = this.height();
    const isLoopHorizontal = this.isLoopHorizontal();
    const isLoopVertical = this.isLoopVertical();

    let currentX = startX;
    let currentY = startY;
    let distance = 0;
    let lastTileX = Math.floor(startX);
    let lastTileY = Math.floor(startY);

    // Adaptive step size - increase with distance
    let stepSizeFactor = 1.0;

    // Use a fast while loop with break conditions
    while (distance < maxDistance) {
        // Calculate adaptive step size - larger steps when further from player
        const stepSize = Math.min(maxStepSize, baseStepSize * stepSizeFactor);

        // Move along the ray
        currentX += dx * stepSize;
        currentY += dy * stepSize;
        distance += stepSize;

        // Increase step size for next iteration (adaptive stepping)
        stepSizeFactor = Math.min(4.0, stepSizeFactor + 0.05);

        // Get the tile coordinates
        let tileX = Math.floor(currentX);
        let tileY = Math.floor(currentY);

        // Skip if we're still on the same tile
        if (tileX === lastTileX && tileY === lastTileY) {
            continue;
        }

        // Handle map looping for ray casting
        if (isLoopHorizontal) {
            tileX = (tileX + width) % width;
        }
        if (isLoopVertical) {
            tileY = (tileY + height) % height;
        }

        // Check boundaries after adjusting for looping
        if (tileX < 0 || tileY < 0 || tileX >= width || tileY >= height) {
            break;
        }

        // Update last tile coordinates
        lastTileX = tileX;
        lastTileY = tileY;

        // Check for vision blocking BEFORE revealing tile to prevent seeing through walls/doors
        // When player is on roof, can see through walls (tag 4) and roofs (tag 7)
        if (this.isVisionBlocking(tileX, tileY, playerOnRoof)) {
            // Reveal the blocking tile itself (so you can see walls/doors)
            this.setFogOfWarState(tileX, tileY, 2);
            // Do NOT apply edge feathering - this prevents revealing tiles behind walls/doors
            break;
        }

        // Mark tile as visible only if it doesn't block
        this.setFogOfWarState(tileX, tileY, 2);

        // Apply edge feathering at the edges of the vision range ONLY for non-blocking tiles
        if (distance > maxDistance - (maxDistance * EDGE_FEATHERING)) {
            this.applyEdgeFeathering(tileX, tileY);
        }
    }
};

// Optimized method to check if a tile blocks vision
// Optimized method to check if a tile blocks vision
Game_Map.prototype.isVisionBlocking = function(x, y, playerOnRoof = false) {
    // When player is on roof, terrain tags 4 and 7 don't block vision
    // Check non-caching path first if on roof
    if (playerOnRoof) {
        // Only region and event blocks apply when on roof
        const regionBlocks = this.regionId(x, y) === 10;

        // Check events
        let eventBlocks = false;
        const events = this.eventsXy(x, y);
        if (events.length > 0) {
            for (const event of events) {
                if (this.isVisionBlockingEvent(event)) {
                    eventBlocks = true;
                    break;
                }
            }
        }

        return regionBlocks || eventBlocks;
    }

    // Use cached terrain data if available (when not on roof)
    if (!this._terrainCache || !(this._terrainCache instanceof Map)) {
        this._terrainCache = new Map();
    }

    const key = `${x},${y}`;
    let cached = this._terrainCache.get(key);

    if (cached === undefined) {
        // Cache terrain tag check for walls (tag 4) and roofs (tag 7)
        const terrainTag = this.terrainTag(x, y);
        const terrainBlocks = terrainTag === 4 || terrainTag === 7;

        // Cache region ID check - NEW: Region ID 10 blocks vision
        const regionBlocks = this.regionId(x, y) === 10;

        // Cache event check
        let eventBlocks = false;
        const events = this.eventsXy(x, y);
        if (events.length > 0) {
            for (const event of events) {
                if (this.isVisionBlockingEvent(event)) {
                    eventBlocks = true;
                    break;
                }
            }
        }

        cached = terrainBlocks || regionBlocks || eventBlocks;
        this._terrainCache.set(key, cached);

        // Clear cache after 100 entries to prevent memory bloat
        if (this._terrainCache.size > 100) {
            const firstKey = this._terrainCache.keys().next().value;
            this._terrainCache.delete(firstKey);
        }
    }

    return cached;
};

// Updated method to check if an event is vision blocking
Game_Map.prototype.isVisionBlockingEvent = function(event) {
    if (!event || !event.event) return false;
    try {
        const eventName = event.event().name.toLowerCase();
        // Check for events containing "door" or any name from VISION_BLOCKING_EVENT_NAMES
        return eventName.includes("door") || VISION_BLOCKING_EVENT_NAMES.some(blocking => eventName.includes(blocking.toLowerCase()));
    } catch (error) {
        return false; // If there's any error, assume it's not a vision blocking event
    }
};
    
    Game_Map.prototype.isEnemyEvent = function(event) {
        if (!event || !event.event) return false;
        try {
            const note = event.event().note;
            return note && /^\d+$/.test(note.trim());
        } catch (error) {
            return false; // If there's any error, assume it's not an enemy event
        }
    };
    
    Game_Map.prototype.isExemptEventName = function(event) {
        if (!event || !event.event) return false;
        try {
            const eventName = event.event().name;
            return EXEMPT_EVENT_NAMES.some(exempt => eventName.includes(exempt));
        } catch (error) {
            return false; // If there's any error, assume it's not exempt
        }
    };
    // Also update the map change handling to initialize the circular reveal
const _Scene_Map_onMapLoaded = Scene_Map.prototype.onMapLoaded;
Scene_Map.prototype.onMapLoaded = function() {
    _Scene_Map_onMapLoaded.call(this);
    
    // Schedule a circular reveal around the player's starting position
    if (this._spriteset && fogOfWarEnabled) {
        // Small delay to ensure everything is loaded properly
        setTimeout(() => {
            // Do a full refresh with circular reveal
            this._spriteset.refreshFogOfWar(true);
        }, 100);
    }
};
    //=============================================================================
    // Game_Event
    //=============================================================================
    // Add this new initialization override
    const _Game_Event_initialize = Game_Event.prototype.initialize;
    Game_Event.prototype.initialize = function(mapId, eventId) {
        _Game_Event_initialize.call(this, mapId, eventId);
        this._fogOfWarVisible = true;
        this._fogOfWarTransitioning = false;
        this._fogOfWarTransitionTimer = 0;
        this._isEnemy = false;
        this._fogOfWarBorderingPlayer = false; // NEW: Flag to track if bordering player
    };
    // Add a new method to Game_Event to control fog of war visibility
    Game_Event.prototype.updateFogOfWarVisibility = function(isVisible) {
        // If this event is bordering the player, force it to be visible
        if (this._fogOfWarBorderingPlayer) {
            isVisible = true;
        }
        
        if (this._fogOfWarVisible !== isVisible) {
            // Check if this is an enemy event
            this._isEnemy = $gameMap.isEnemyEvent(this);
            const isExempt = $gameMap.isExemptEventName(this);
            
            // If becoming invisible
            if (!isVisible) {
                this._fogOfWarVisible = false;
                
                if (this._isEnemy && !isExempt && !this._fogOfWarBorderingPlayer) {
                    // Enemies disappear when not visible (unless bordering player)
                    this._fogOfWarTransitioning = true;
                    this._fogOfWarTransitionTimer = 80; // 0.5 seconds fade-out
                } else {
                    // Non-enemy events remain visible but in grayscale
                    // OR events bordering player stay fully visible
                    this._fogOfWarTransitioning = false;
                    this._fogOfWarTransitionTimer = 0;
                    this._opacity = 255; // Keep full opacity
                    this._transparent = false;
                    
                    // Grayscale effect will be applied by the sprite (unless bordering player)
                }
            } 
            // If becoming visible
            else {
                this._fogOfWarVisible = true;
                this._fogOfWarTransitioning = false;
                this._fogOfWarTransitionTimer = 0;
                
                // Make fully visible and in color
                this._opacity = 255;
                this._transparent = false;
            }
        }
    };
    
    
Game_Map.prototype.updateEventVisibility = function() {
    // Update only every few frames for better performance
    if (!this._eventVisibilityCounter) this._eventVisibilityCounter = 0;
    this._eventVisibilityCounter++;
    
    if (this._eventVisibilityCounter < 3) return; // Update every 3 frames
    this._eventVisibilityCounter = 0;
    
    const playerX = $gamePlayer.x;
    const playerY = $gamePlayer.y;
    const events = this.events();
    
    // Use for loop instead of forEach for better performance
    for (let i = 0; i < events.length; i++) {
        const event = events[i];
        const dx = Math.abs(event.x - playerX);
        const dy = Math.abs(event.y - playerY);
        const isBordering = dx <= 1 && dy <= 1;
        
        let isVisible = this.isPositionVisible(event.x, event.y);
        
        if (this._visibleFogOfWar && this.fogOfWarState(event.x, event.y) >= 1) {
            isVisible = true;
        }
        
        if (isBordering) {
            isVisible = true;
            event._fogOfWarBorderingPlayer = true;
        } else {
            event._fogOfWarBorderingPlayer = false;
        }
        
        event.updateFogOfWarVisibility(isVisible);
    }
};
    
    Game_Event.prototype.updateFogOfWarTransition = function() {
        if (this._fogOfWarTransitioning) {
            this._fogOfWarTransitionTimer--;
            
            // Fade out enemies gradually
            if (this._isEnemy && !$gameMap.isExemptEventName(this)) {
                const fadeRatio = Math.max(0, this._fogOfWarTransitionTimer / 240);
                this._opacity = Math.floor(255 * fadeRatio);
                
                if (this._fogOfWarTransitionTimer <= 0) {
                    // Transition complete - hide enemy events completely
                    this._fogOfWarTransitioning = false;
                    this._opacity = 0;
                    this._transparent = true;
                }
            }
        }
    };
    
    // Flag to track if this event is in grayscale mode
    Game_Event.prototype.isFogOfWarGrayscale = function() {
        // Don't apply grayscale to events bordering the player
        if (this._fogOfWarBorderingPlayer) {
            return false;
        }
        
        // Only apply grayscale to non-enemies that are not currently visible
        return !this._fogOfWarVisible && !this._isEnemy && !$gameMap.isExemptEventName(this);
    };
    
    
    // Flag to track if this event is transitioning (fading out)
    Game_Event.prototype.isFogOfWarTransitioning = function() {
        return this._fogOfWarTransitioning;
    };
    
    const _Game_Event_update = Game_Event.prototype.update;
    Game_Event.prototype.update = function() {
        _Game_Event_update.call(this);
        
        // Update fog of war transition if needed
        this.updateFogOfWarTransition();
    };

    //=============================================================================
    // Game_Player
    //=============================================================================
    
    const _Game_Player_update = Game_Player.prototype.update;
    Game_Player.prototype.update = function(sceneActive) {
        _Game_Player_update.call(this, sceneActive);
        
        if (sceneActive) {
            // Track if player is moving
            const isMoving = this.isMoving();
            
            // Reset idle timer if player is moving
            if (isMoving) {
                $gameMap._playerIdleTime = 0;
                $gameMap._playerWasMoving = true;
            } 
            // Increment idle timer if player has stopped
            else if ($gameMap._playerWasMoving) {
                $gameMap._playerIdleTime++;
                
                // If player just stopped moving, update fog one more time
                if ($gameMap._playerIdleTime === 1) {
                    $gameMap.updateFogOfWar();
                }
                
                // If idle timer is below threshold, continue updating fog
                // This ensures fog updates for a short time after player stops moving
                if ($gameMap._playerIdleTime < $gameMap._playerIdleThreshold) {
                    updateCounter = (updateCounter + 1) % UPDATE_FREQUENCY;
                    if (updateCounter === 0) {
                        $gameMap.updateFogOfWar();
                    }
                }
            }
        }
    };
    
    // Update fog immediately when player completes movement
    const _Game_Player_updateNonmoving = Game_Player.prototype.updateNonmoving;
    Game_Player.prototype.updateNonmoving = function(wasMoving, sceneActive) {
        _Game_Player_updateNonmoving.call(this, wasMoving, sceneActive);
        
        // If player just finished moving, update fog immediately
        if (wasMoving && sceneActive) {
            $gameMap._playerIdleTime = 0; // Reset idle timer
            $gameMap._playerWasMoving = true; // Set flag that player was moving
            $gameMap.updateFogOfWar(); // Update fog immediately
        }
    };
    // Add this to Scene_Map to check for the refresh flag
const _Scene_Map_start = Scene_Map.prototype.start;
Scene_Map.prototype.start = function() {
    _Scene_Map_start.call(this);

    // Check if we need to refresh fog of war after loading
    if ($gameSystem && $gameSystem._needsFogOfWarRefresh) {
        // Wait a few frames to ensure everything is loaded
        setTimeout(() => {
            if (this._spriteset && $gameMap) {
                // If force reload is set, completely reinitialize the lighting system
                if ($gameSystem._forceFogReload) {
                    // Use the dedicated lighting reload method
                    $gameSystem.reloadFogOfWarLighting();

                    // Reinitialize fog of war data from scratch
                    $gameMap.initializeFogOfWar();

                    // Reset player position tracking
                    $gameMap._playerLastX = -1;
                    $gameMap._playerLastY = -1;
                    $gameMap._playerLastDir = -1;

                    // Reset vision position
                    if ($gamePlayer) {
                        $gameMap._visionX = $gamePlayer.x;
                        $gameMap._visionY = $gamePlayer.y;
                    }

                    $gameSystem._forceFogReload = false;
                }

                // Do a full refresh of fog of war with complete chunk rebuild
                this._spriteset.refreshFogOfWar(true);

                // Force an immediate update of the lighting system
                if ($gameMap) {
                    // Ensure all chunks are marked dirty before redraw
                    $gameMap.markAllChunksDirty();

                    // Update fog of war to recalculate vision
                    $gameMap.updateFogOfWar();

                    // Update transitions one more time to ensure clean state
                    $gameMap.updateTransitionTimers();
                }

                // Update all event visibility
                this._spriteset.updateEventVisibility();
            }

            // Clear the flag
            $gameSystem._needsFogOfWarRefresh = false;
        }, 100); // Small delay to ensure everything is loaded
    }
};
    // Continuously update fog during player movement for smooth transitions
    const _Game_Player_updateMove = Game_Player.prototype.updateMove;
    Game_Player.prototype.updateMove = function() {
        _Game_Player_updateMove.call(this);
        
        // Update the fog container position every frame during movement
        if (SceneManager._scene instanceof Scene_Map && SceneManager._scene._spriteset) {
            const spriteset = SceneManager._scene._spriteset;
            spriteset._fogContainer.x = -Math.round($gameMap.displayX() * $gameMap.tileWidth());
            spriteset._fogContainer.y = -Math.round($gameMap.displayY() * $gameMap.tileHeight());
            
            // Update fog of war during movement for smoother transitions
            updateCounter = (updateCounter + 1) % Math.max(1, Math.floor(UPDATE_FREQUENCY / 2));
            if (updateCounter === 0) {
                $gameMap.updateFogOfWar();
            }
        }
    };
    const _Scene_Load_onLoadSuccess = Scene_Load.prototype.onLoadSuccess;
    Scene_Load.prototype.onLoadSuccess = function() {
        _Scene_Load_onLoadSuccess.call(this);

        // Flag to indicate we need to fully reload and refresh fog of war after loading
        $gameSystem._needsFogOfWarRefresh = true;
        $gameSystem._forceFogReload = true;
    };
    //=============================================================================
    // Spriteset_Map
    //=============================================================================
    
const _Spriteset_Map_createLowerLayer = Spriteset_Map.prototype.createLowerLayer;
Spriteset_Map.prototype.createLowerLayer = function() {
    _Spriteset_Map_createLowerLayer.call(this);
    // Remove the old fog creation from here if it exists
};
 const _Spriteset_Map_createUpperLayer = Spriteset_Map.prototype.createUpperLayer;
Spriteset_Map.prototype.createUpperLayer = function() {
    _Spriteset_Map_createUpperLayer.call(this);
    // Create fog of war layer after everything else is created
    this.createFogOfWarLayer();
};   
Spriteset_Map.prototype.createFogOfWarLayer = function() {
    // Create a container for fog chunks
    this._fogContainer = new PIXI.Container();
    
    // Instead of adding to tilemap, add directly to the main spriteset
    // This ensures it renders on top of everything including overlays
    this.addChild(this._fogContainer);
    
    // Initialize chunk containers
    this._fogChunks = {};
    
    // Track last display position
    this._lastDisplayX = -999;
    this._lastDisplayY = -999;
    
    // Prepare colors
    this._neverSeenColor = NEVER_SEEN_COLOR;
    this._previouslySeenColor = PREVIOUSLY_SEEN_COLOR;
    
    this.refreshFogOfWar(true); // Initial full refresh
};

    
    const _Spriteset_Map_update = Spriteset_Map.prototype.update;
    Spriteset_Map.prototype.update = function() {
        _Spriteset_Map_update.call(this);
            // If fog is disabled for this specific map, ensure container is hidden
        if ($gameMap && $gameMap._fogOfWarDisabled) {
            this._fogContainer.visible = false;
        }
        const displayX = $gameMap.displayX();
        const displayY = $gameMap.displayY();
        
        // Always update fog container position every frame to prevent lag
        this._fogContainer.x = -Math.round(displayX * $gameMap.tileWidth());
        this._fogContainer.y = -Math.round(displayY * $gameMap.tileHeight());
        
        // Check if display position changed significantly
        if (Math.abs(displayX - this._lastDisplayX) >= 0.25 || 
            Math.abs(displayY - this._lastDisplayY) >= 0.25) {
            this._lastDisplayX = displayX;
            this._lastDisplayY = displayY;
            
            // Update fog of war during scrolling for better smoothness - REMOVED CONDITION
            $gameMap.updateFogOfWar();
            
            // Check if there are any dirty chunks to update
            const dirtyChunks = $gameMap.getDirtyChunks();
            if (dirtyChunks.length > 0) {
                this.updateDirtyChunks(dirtyChunks);
                $gameMap.clearDirtyChunks();
            }
        } else {
            // UPDATE EVEN WHEN PLAYER IS STATIONARY
            $gameMap.updateFogOfWar();
            
            // Check if there are any dirty chunks to update
            const dirtyChunks = $gameMap.getDirtyChunks();
            if (dirtyChunks.length > 0) {
                this.updateDirtyChunks(dirtyChunks);
                $gameMap.clearDirtyChunks();
            }
        }
        
        // Update event visibility
        this.updateEventVisibility();
    };
    
    Spriteset_Map.prototype.refreshFogOfWar = function(fullRefresh = false) {
        if (!fogOfWarEnabled) {
            this._fogContainer.visible = false;
            return;
        }
        
        this._fogContainer.visible = true;
        
        if (fullRefresh) {
            // Clear all existing chunks
            for (const key in this._fogChunks) {
                if (this._fogChunks[key]) {
                    this._fogContainer.removeChild(this._fogChunks[key]);
                }
            }
            this._fogChunks = {};
            
            // If this is a full refresh on map load, reveal a circular area around the player
            if ($gamePlayer && $gameMap) {
                const playerX = $gamePlayer.x;
                const playerY = $gamePlayer.y;
                const playerDirection = $gamePlayer.direction();
                
                // Initialize vision coordinates to player position
                $gameMap._visionX = playerX;
                $gameMap._visionY = playerY;
                
                // Calculate and reveal the current vision cone
                $gameMap.calculateVision(playerX, playerY, playerDirection);
                
                // Force an immediate update of fog and transitions
                $gameMap.updateTransitionTimers();
            }
            
            
            // Mark all chunks as dirty for a full refresh
            $gameMap.markAllChunksDirty();
        }
        
        // Update all dirty chunks
        const dirtyChunks = $gameMap.getDirtyChunks();
        this.updateDirtyChunks(dirtyChunks);
        $gameMap.clearDirtyChunks();
    };


    // New helper method to reveal a circular area around a point
Spriteset_Map.prototype.revealCircularArea = function(centerX, centerY, radius) {
    // Calculate the square of the radius for faster distance checks
    const radiusSquared = radius * radius;
    
    // Calculate bounds with extra buffer
    const startX = Math.max(0, centerX - radius - 1);
    const endX = Math.min($gameMap.width() - 1, centerX + radius + 1);
    const startY = Math.max(0, centerY - radius - 1);
    const endY = Math.min($gameMap.height() - 1, centerY + radius + 1);
    
    // Loop through tiles in a square and check if they're in the circle
    for (let y = startY; y <= endY; y++) {
        for (let x = startX; x <= endX; x++) {
            // Calculate squared distance to center (faster than using Math.sqrt)
            const distanceSquared = (x - centerX) * (x - centerX) + (y - centerY) * (y - centerY);
            
            // If within circle, set to visible state
            if (distanceSquared <= radiusSquared) {
                // Use state 2 for visible, with a reveal transition
                $gameMap.setFogOfWarState(x, y, 2);
                
                // Set a small transition timer for a nice reveal effect
                const distance = Math.sqrt(distanceSquared);
                const transitionDelay = Math.round((distance / radius) * REVEAL_TRANSITION_DURATION);
                
                // Store negative timer value for reveal transition (fade in)
                const index = y * $gameMap.width() + x;
                $gameMap._fogTransitionTimers[index] = -Math.max(1, REVEAL_TRANSITION_DURATION - transitionDelay);
            }
        }
    }
    
    // Save the updated fog data
    $gameSystem.setFogOfWarData($gameMap.mapId(), {
        states: Array.from($gameMap._fogOfWarData),
        timers: Array.from($gameMap._fogTransitionTimers)
    });
};
    // Enhanced to support smooth transitions between visibility states
Spriteset_Map.prototype.updateDirtyChunks = function(dirtyChunkKeys) {
    if (dirtyChunkKeys.length === 0) return;
    
    const tileWidth = $gameMap.tileWidth();
    const tileHeight = $gameMap.tileHeight();
    
    // Pre-parse colors once
    const neverSeenColor = this.parseColor(this._neverSeenColor);
    const previouslySeenColor = this.parseColor(this._previouslySeenColor);
    const baseAlpha = this.extractAlpha(this._previouslySeenColor);
    
    // Batch process chunks
    for (let i = 0; i < dirtyChunkKeys.length; i++) {
        const key = dirtyChunkKeys[i];
        const [chunkX, chunkY] = key.split(',').map(Number);
        
        // Create or get the chunk graphics object
        if (!this._fogChunks[key]) {
            this._fogChunks[key] = new PIXI.Graphics();
            this._fogContainer.addChild(this._fogChunks[key]);
        }
        
        const chunk = this._fogChunks[key];
        chunk.clear();
        
        // Position the chunk
        chunk.x = chunkX * CHUNK_SIZE * tileWidth;
        chunk.y = chunkY * CHUNK_SIZE * tileHeight;
        
        // Calculate chunk bounds
        const startX = chunkX * CHUNK_SIZE;
        const startY = chunkY * CHUNK_SIZE;
        const endX = Math.min(startX + CHUNK_SIZE, $gameMap.width());
        const endY = Math.min(startY + CHUNK_SIZE, $gameMap.height());
        
        // Group consecutive tiles of same state for batch drawing
        let currentState = -1;
        let currentAlpha = -1;
        let rectStartX = 0;
        let rectStartY = 0;
        let rectWidth = 0;
        
        for (let y = startY; y < endY; y++) {
            for (let x = startX; x < endX; x++) {
                const fogState = $gameMap.fogOfWarState(x, y);
                const transitionTimer = $gameMap.fogTransitionTimer(x, y);
                
                let drawState = fogState;
                let alpha = 1.0;
                
                if (fogState === 1) {
                    alpha = baseAlpha;
                    if (transitionTimer > 0) {
                        const transitionProgress = 1 - (transitionTimer / TRANSITION_DURATION);
                        alpha = baseAlpha * transitionProgress;
                    }
                } else if (fogState === 2 && transitionTimer < 0) {
                    drawState = 1; // Draw as previously seen during reveal
                    const transitionProgress = -transitionTimer / REVEAL_TRANSITION_DURATION;
                    alpha = baseAlpha * transitionProgress;
                }
                
                // Only draw if there's something to draw
                if (drawState === 0 || (drawState === 1 && alpha > 0.01)) {
                    if (drawState === 0) {
                        chunk.beginFill(neverSeenColor, 1.0);
                    } else {
                        chunk.beginFill(previouslySeenColor, alpha);
                    }
                    
                    chunk.drawRect(
                        (x - startX) * tileWidth,
                        (y - startY) * tileHeight,
                        tileWidth,
                        tileHeight
                    );
                    chunk.endFill();
                }
            }
        }
    }
};
    
    
    // Helper method to parse CSS color to PIXI color
    Spriteset_Map.prototype.parseColor = function(cssColor) {
        // Handle hex format
        if (cssColor.startsWith('#')) {
            return parseInt(cssColor.slice(1), 16);
        }
        
        // Handle rgba format - extract just the color part
        if (cssColor.startsWith('rgba')) {
            const parts = cssColor.match(/rgba\((\d+),\s*(\d+),\s*(\d+),\s*([\d.]+)\)/);
            if (parts) {
                const r = parseInt(parts[1]);
                const g = parseInt(parts[2]);
                const b = parseInt(parts[3]);
                return (r << 16) | (g << 8) | b;
            }
        }
        
        // Handle rgb format
        if (cssColor.startsWith('rgb')) {
            const parts = cssColor.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
            if (parts) {
                const r = parseInt(parts[1]);
                const g = parseInt(parts[2]);
                const b = parseInt(parts[3]);
                return (r << 16) | (g << 8) | b;
            }
        }
        
        // Default to black if parsing fails
        return 0x000000;
    };
    
    // Helper method to extract alpha from CSS color
    Spriteset_Map.prototype.extractAlpha = function(cssColor) {
        if (cssColor.startsWith('rgba')) {
            const parts = cssColor.match(/rgba\((\d+),\s*(\d+),\s*(\d+),\s*([\d.]+)\)/);
            if (parts) {
                return parseFloat(parts[4]);
            }
        }
        return 1.0; // Default to fully opaque
    };
    
    // Updated to apply grayscale effect to non-enemy events outside of vision
    Spriteset_Map.prototype.updateEventVisibility = function() {
        for (const sprite of this._characterSprites) {
            if (sprite._character instanceof Game_Event) {
                const event = sprite._character;
                
                // Update sprite opacity based on event opacity
                sprite.opacity = event.opacity();
                
                // Apply grayscale filter for non-enemy events outside vision
                if (event.isFogOfWarGrayscale()) {
                    // Create a color matrix filter for grayscale effect if not already created
                    if (!sprite._fogColorFilter) {
                        sprite._fogColorFilter = new PIXI.filters.ColorMatrixFilter();
                        sprite.filters = sprite.filters || [];
                        sprite.filters.push(sprite._fogColorFilter);
                    }
                    
                    // Set to grayscale
                    sprite._fogColorFilter.saturate(-1);
                } 
                // Apply grayscale with fading for transitioning enemy events
                else if (event.isFogOfWarTransitioning && event.isFogOfWarTransitioning()) {
                    // Create a color matrix filter for grayscale effect if not already created
                    if (!sprite._fogColorFilter) {
                        sprite._fogColorFilter = new PIXI.filters.ColorMatrixFilter();
                        sprite.filters = sprite.filters || [];
                        sprite.filters.push(sprite._fogColorFilter);
                    }
                    
                    // Set to grayscale during transition
                    sprite._fogColorFilter.saturate(-1);
                }
                // Remove filter if event is visible or exempt
                else if (sprite._fogColorFilter) {
                    // Remove color filter when event is visible
                    if (sprite.filters) {
                        const index = sprite.filters.indexOf(sprite._fogColorFilter);
                        if (index !== -1) {
                            sprite.filters.splice(index, 1);
                        }
                        if (sprite.filters.length === 0) {
                            sprite.filters = null;
                        }
                    }
                    sprite._fogColorFilter = null;
                }
            }
        }
    };
    
})();
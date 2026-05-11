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
 * @default 0.5
 * @type number
 * @decimals 2
 * @min 0.1
 * @max 1.0
 * 
 * @param Transition Duration
 * @desc Duration of transition between visible and previously seen (in frames)
 * @default 15
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
 */

(function () {
    'use strict';

    const pluginName = "FOG_OF_WAR";
    const parameters = PluginManager.parameters(pluginName);

    // Constants & Configuration
    const DEFAULT_VISION_RANGE = 10;
    const EXEMPT_EVENT_NAMES = (parameters['Exempt Event Names'] || "NPC,Chest,Trigger").split(',').map(s => s.trim());
    const VISION_BLOCKING_EVENT_NAMES = ("locked_key,door_i,locked,Wall,Pillar,Door,Column,Room,Obstacle").split(',').map(s => s.trim());
    const UPDATE_FREQUENCY = Number(parameters['Update Frequency'] || 3);
    const RAY_COUNT = Number(parameters['Ray Count'] || 120);
    const RESET_ON_NEW_GAME = parameters['Reset On New Game'] !== 'false';
    const CHUNK_SIZE = Number(parameters['Chunk Size'] || 8);
    const NEVER_SEEN_COLOR = parameters['Never Seen Color'] || '#000000';
    const PREVIOUSLY_SEEN_COLOR = parameters['Previously Seen Color'] || 'rgba(0,0,0,0.4)';
    const REVEAL_TRANSITION_DURATION = Number(parameters['Reveal Transition Duration'] || 16);
    const BASE_ALPHA = (function () {
        const css = parameters['Previously Seen Color'] || 'rgba(0,0,0,0.4)';
        const match = css.match(/rgba\(\d+,\s*\d+,\s*\d+,\s*([\d.]+)\)/);
        return match ? parseFloat(match[1]) : 0.4;
    })();
    const VISION_ANGLE = 110;
    const VISION_SMOOTHING = Number(parameters['Vision Smoothing'] || 0.9);
    const EDGE_FEATHERING = 0;
    const ADD_TO_OPTIONS_MENU = parameters['Add To Options Menu'] !== 'false';
    const OPTIONS_MENU_TEXT = parameters['Options Menu Text'] || 'Fog of War';

    // Map Feature Constants
    const TERRAIN_WALL = 4;
    const TERRAIN_ROOF = 7;
    const REGION_BLOCK = 10;
    const REGION_EXTENDED_VIEW = 11;

    let fogOfWarEnabled = true;
    let updateCounter = 0;

    //=============================================================================
    // Plugin Commands
    //=============================================================================

    PluginManager.registerCommand(pluginName, "toggleFogOfWar", args => {
        fogOfWarEnabled = args.enable === "true";
        if (ADD_TO_OPTIONS_MENU) {
            ConfigManager.fogOfWar = fogOfWarEnabled;
            ConfigManager.save();
        }
        if (SceneManager._scene instanceof Scene_Map) {
            SceneManager._scene._spriteset.refreshFogOfWar();
        }
    });

    PluginManager.registerCommand(pluginName, "disableFogForMap", args => {
        const disable = args.disable === "true";
        $gameMap._fogOfWarDisabled = disable;
        if (SceneManager._scene instanceof Scene_Map) {
            const container = SceneManager._scene._spriteset._fogContainer;
            if (container) {
                container.visible = !disable && fogOfWarEnabled;
                if (!disable && fogOfWarEnabled) {
                    SceneManager._scene._spriteset.refreshFogOfWar(true);
                }
            }
        }
    });

    PluginManager.registerCommand(pluginName, "resetFogOfWar", args => {
        const target = args.target || "current";
        if (target === "current") {
            $gameSystem.resetFogOfWarForMap($gameMap.mapId());
        } else {
            $gameSystem.resetAllFogOfWar();
        }
        $gameMap.initializeFogOfWar();
        if (SceneManager._scene instanceof Scene_Map) {
            SceneManager._scene._spriteset.refreshFogOfWar();
        }
    });

    PluginManager.registerCommand(pluginName, "revealEntireMap", args => {
        if ($gameMap && $gameMap._fogOfWarData) {
            for (let i = 0; i < $gameMap._fogOfWarData.length; i++) {
                $gameMap.setFogOfWarStateByIndex(i, 2);
            }
            $gameMap._forceVisionUpdate = true;
            $gameMap.markAllChunksDirty();
            $gameSystem.saveCurrentFogData();
            if (SceneManager._scene instanceof Scene_Map) {
                SceneManager._scene._spriteset.refreshFogOfWar();
            }
        }
    });

    //=============================================================================
    // DataManager & ConfigManager
    //=============================================================================

    const _DataManager_setupNewGame = DataManager.setupNewGame;
    DataManager.setupNewGame = function () {
        _DataManager_setupNewGame.call(this);
        if (RESET_ON_NEW_GAME && $gameSystem) {
            $gameSystem.resetAllFogOfWar();
        }
    };

    ConfigManager.fogOfWar = true;

    const _ConfigManager_makeData = ConfigManager.makeData;
    ConfigManager.makeData = function () {
        const config = _ConfigManager_makeData.call(this);
        config.fogOfWar = this.fogOfWar;
        return config;
    };

    const _ConfigManager_applyData = ConfigManager.applyData;
    ConfigManager.applyData = function (config) {
        _ConfigManager_applyData.call(this, config);
        this.fogOfWar = this.readFlag(config, 'fogOfWar', true);
        fogOfWarEnabled = this.fogOfWar;
    };

    if (ADD_TO_OPTIONS_MENU) {
        const _Window_Options_addGeneralOptions = Window_Options.prototype.addGeneralOptions;
        Window_Options.prototype.addGeneralOptions = function () {
            _Window_Options_addGeneralOptions.call(this);
            this.addCommand(OPTIONS_MENU_TEXT, 'fogOfWar');
        };
    }

    //=============================================================================
    // Game_System
    //=============================================================================

    const _Game_System_initialize = Game_System.prototype.initialize;
    Game_System.prototype.initialize = function () {
        _Game_System_initialize.call(this);
        this._fogOfWarData = {};
    };

    Game_System.prototype.getFogOfWarData = function (mapId) {
        return this._fogOfWarData?.[mapId] || null;
    };

    Game_System.prototype.setFogOfWarData = function (mapId, data) {
        if (!this._fogOfWarData) this._fogOfWarData = {};
        this._fogOfWarData[mapId] = data;
    };

    Game_System.prototype.saveCurrentFogData = function () {
        if ($gameMap) {
            this.setFogOfWarData($gameMap.mapId(), {
                states: Array.from($gameMap._fogOfWarData),
                timers: Array.from($gameMap._fogTransitionTimers)
            });
        }
    };

    Game_System.prototype.resetFogOfWarForMap = function (mapId) {
        if (this._fogOfWarData && this._fogOfWarData[mapId]) {
            delete this._fogOfWarData[mapId];
        }
    };

    Game_System.prototype.resetAllFogOfWar = function () {
        this._fogOfWarData = {};
    };

    Game_System.prototype.reloadFogOfWarLighting = function () {
        if (!$gameMap) return;
        $gameMap._lastUpdateTime = 0;
        $gameMap._playerIdleTime = 0;
        $gameMap._playerWasMoving = false;
        $gameMap._terrainCacheDirty = true;

        if ($gameMap._fogTransitionTimers) {
            $gameMap._fogTransitionTimers.fill(0);
        }
        if ($gameMap._activeTransitions) {
            $gameMap._activeTransitions.clear();
        }

        $gameMap.markAllChunksDirty();
        if ($gamePlayer) $gameMap.updateFogOfWar();
    };

    //=============================================================================
    // Game_Map
    //=============================================================================

    const _Game_Map_initialize = Game_Map.prototype.initialize;
    Game_Map.prototype.initialize = function () {
        _Game_Map_initialize.call(this);
        this._fogOfWarData = null;
        this._fogTransitionTimers = null;
        this._dirtyChunks = null;
        this._activeTransitions = new Set();
        this._playerLastX = -1;
        this._playerLastY = -1;
        this._playerLastDir = -1;
        this._player2LastX = -1;
        this._player2LastY = -1;
        this._player2LastDir = -1;
        this._lastUpdateTime = 0;
        this._visionRange = DEFAULT_VISION_RANGE;
        this._visionX = 0;
        this._visionY = 0;
        this._visionX2 = 0;
        this._visionY2 = 0;
        this._playerIdleTime = 0;
        this._playerIdleThreshold = 10;
        this._playerWasMoving = false;
        this._terrainCache = null;
        this._eventMap = [];
        this._visibleIndices = [];
        this._lastVisibleIndices = [];
        this._currentFrameVisible = null;
        this._forceVisionUpdate = true;
    };

    const _Game_Map_setup = Game_Map.prototype.setup;
    Game_Map.prototype.setup = function (mapId) {
        _Game_Map_setup.call(this, mapId);

        this._fogOfWarDisabled = false;
        this._visibleFogOfWar = false;
        if ($dataMap && $dataMap.note) {
            this._fogOfWarDisabled = $dataMap.note.includes("<DisableFogOfWar>");
            this._visibleFogOfWar = $dataMap.note.includes("<VisibleFogOfWar>");
        }

        // Procedural map force clear
        if (mapId === 636) {
            $gameSystem.resetFogOfWarForMap(mapId);
        }

        this.initializeFogOfWar();
        this.loadVisionRangeFromMapNotes();

        this._visionX = $gamePlayer.x;
        this._visionY = $gamePlayer.y;
        if (window.$gameSplitScreen && window.$gameSplitScreen.active && window.$gameSplitScreen.p2Event) {
            this._visionX2 = window.$gameSplitScreen.p2Event.x;
            this._visionY2 = window.$gameSplitScreen.p2Event.y;
        } else {
            this._visionX2 = this._visionX;
            this._visionY2 = this._visionY;
        }
    };

    Game_Map.prototype.normalizePos = function (x, y) {
        if (this.isLoopHorizontal()) x = (x + this.width()) % this.width();
        if (this.isLoopVertical()) y = (y + this.height()) % this.height();
        return { x, y, isValid: x >= 0 && y >= 0 && x < this.width() && y < this.height() };
    };

    Game_Map.prototype.loadVisionRangeFromMapNotes = function () {
        this._visionRange = DEFAULT_VISION_RANGE;
        if ($dataMap && $dataMap.note) {
            const match = $dataMap.note.match(/<VisionRange:(\d+)>/i);
            if (match) {
                const value = parseInt(match[1], 10);
                if (!isNaN(value) && value > 0) this._visionRange = value;
            }
        }
    };

    Game_Map.prototype.visionRange = function () {
        return this._visionRange;
    };

    Game_Map.prototype.initializeFogOfWar = function () {
        const size = this.width() * this.height();
        const savedData = $gameSystem.getFogOfWarData(this._mapId);

        if (savedData && savedData.states && savedData.states.length === size) {
            this._fogOfWarData = new Uint8Array(savedData.states);
            this._fogTransitionTimers = new Int16Array(savedData.timers);
        } else {
            this._fogOfWarData = (savedData && savedData.length === size) ? new Uint8Array(savedData) : new Uint8Array(size);
            this._fogTransitionTimers = new Int16Array(size);
            for (let i = 0; i < size; i++) {
                const state = this._fogOfWarData[i];
                if (state === 0) this._fogTransitionTimers[i] = 255;
                else if (state === 1) this._fogTransitionTimers[i] = Math.floor(BASE_ALPHA * 255);
                else this._fogTransitionTimers[i] = 0;
            }
        }

        this._activeTransitions = new Set();
        this._terrainCache = new Uint8Array(size);
        this._terrainCacheDirty = true;

        const chunksX = Math.ceil(this.width() / CHUNK_SIZE);
        const chunksY = Math.ceil(this.height() / CHUNK_SIZE);
        this._dirtyChunks = new Uint8Array(chunksX * chunksY).fill(1);

        this.refreshEventMap();

        this._visibleIndices = [];
        this._currentFrameVisible = new Uint8Array(size);
        this._lastVisibleIndices = [];

        for (let i = 0; i < size; i++) {
            if (this._fogOfWarData[i] === 2) this._lastVisibleIndices.push(i);
        }

        this._playerLastX = -1;
        this._playerLastY = -1;
        this._playerLastDir = -1;
        this._player2LastX = -1;
        this._player2LastY = -1;
        this._player2LastDir = -1;
        this._lastUpdateTime = 0;
        this._forceVisionUpdate = true;
    };

    Game_Map.prototype.refreshEventMap = function () {
        const width = this.width();
        const size = width * this.height();
        this._eventMap = new Array(size);

        const events = this.events();
        for (let i = 0; i < events.length; i++) {
            const event = events[i];
            if (this.isValid(event.x, event.y)) {
                const index = event.y * width + event.x;
                if (!this._eventMap[index]) this._eventMap[index] = [];
                this._eventMap[index].push(event);
            }
        }
    };

    Game_Map.prototype.fogOfWarState = function (x, y) {
        if (this._fogOfWarDisabled || !fogOfWarEnabled) return 2;
        const pos = this.normalizePos(x, y);
        if (!pos.isValid) return 0;
        return this._fogOfWarData[pos.y * this.width() + pos.x] || 0;
    };

    Game_Map.prototype.fogTransitionTimer = function (x, y) {
        const pos = this.normalizePos(x, y);
        if (!pos.isValid) return 0;
        return this._fogTransitionTimers[pos.y * this.width() + pos.x] || 0;
    };

    Game_Map.prototype.setFogOfWarState = function (x, y, state) {
        const pos = this.normalizePos(x, y);
        if (pos.isValid) {
            this.setFogOfWarStateByIndex(pos.y * this.width() + pos.x, state);
        }
    };

    Game_Map.prototype.setFogOfWarStateByIndex = function (index, state) {
        if (this._fogOfWarData[index] !== state) {
            this._fogOfWarData[index] = state;
            this._activeTransitions.add(index);

            const width = this.width();
            this.markChunkDirty(index % width, (index / width) | 0);
        }

        if (state === 2 && this._currentFrameVisible && !this._currentFrameVisible[index]) {
            this._currentFrameVisible[index] = 1;
            this._visibleIndices.push(index);
        }
    };

    Game_Map.prototype.markChunkDirty = function (x, y) {
        const chunkX = (x / CHUNK_SIZE) | 0;
        const chunkY = (y / CHUNK_SIZE) | 0;
        const chunksX = Math.ceil(this.width() / CHUNK_SIZE);
        const chunksY = Math.ceil(this.height() / CHUNK_SIZE);
        if (chunkX >= 0 && chunkY >= 0 && chunkX < chunksX && chunkY < chunksY) {
            this._dirtyChunks[chunkY * chunksX + chunkX] = 1;
        }
    };

    Game_Map.prototype.updateTransitionTimers = function () {
        if (!this._activeTransitions || this._activeTransitions.size === 0) return;

        const width = this.width();
        const frames = Math.max(1, REVEAL_TRANSITION_DURATION);
        const toDelete = [];
        const step = Math.ceil(255 / frames);

        for (const index of this._activeTransitions) {
            const state = this._fogOfWarData[index];
            let target = 0;
            if (state === 0) target = 255;
            else if (state === 1) target = Math.floor(BASE_ALPHA * 255);
            else if (state === 2) target = 0;

            const current = this._fogTransitionTimers[index];
            if (current < target) {
                this._fogTransitionTimers[index] = Math.min(target, current + step);
                this.markChunkDirty(index % width, (index / width) | 0);
            } else if (current > target) {
                this._fogTransitionTimers[index] = Math.max(target, current - step);
                this.markChunkDirty(index % width, (index / width) | 0);
            }

            if (this._fogTransitionTimers[index] === target) {
                toDelete.push(index);
            }
        }

        for (const index of toDelete) {
            this._activeTransitions.delete(index);
        }
    };

    Game_Map.prototype.markAllChunksDirty = function () {
        if (this._dirtyChunks) this._dirtyChunks.fill(1);
    };

    Game_Map.prototype.getDirtyChunks = function () {
        const result = [];
        if (!this._dirtyChunks) return result;
        const chunksX = Math.ceil(this.width() / CHUNK_SIZE);
        for (let i = 0; i < this._dirtyChunks.length; i++) {
            if (this._dirtyChunks[i]) {
                result.push(`${i % chunksX},${(i / chunksX) | 0}`);
            }
        }
        return result;
    };

    Game_Map.prototype.clearDirtyChunks = function () {
        if (this._dirtyChunks) this._dirtyChunks.fill(0);
    };

    Game_Map.prototype.isPositionVisible = function (x, y) {
        return this.fogOfWarState(x, y) === 2;
    };

    Game_Map.prototype.updateFogOfWar = function () {
        if (!ConfigManager.fogOfWar) {
            fogOfWarEnabled = false;
            return;
        }
        fogOfWarEnabled = true;

        if (this._fogOfWarDisabled) return;

        // Vision sources (P1 and P2)
        const players = [{ char: $gamePlayer, id: 1 }];
        if (window.$gameSplitScreen && window.$gameSplitScreen.active && window.$gameSplitScreen.p2Event) {
            players.push({ char: window.$gameSplitScreen.p2Event, id: 2 });
        }

        const isInitial = this._forceVisionUpdate;
        let needsVisionUpdate = isInitial;

        this.updateTransitionTimers();

        // Process movement and smoothing for all vision sources
        for (const p of players) {
            const char = p.char;
            const lastX = p.id === 1 ? this._playerLastX : this._player2LastX;
            const lastY = p.id === 1 ? this._playerLastY : this._player2LastY;
            const lastDir = p.id === 1 ? this._playerLastDir : this._player2LastDir;
            const visionX = p.id === 1 ? this._visionX : this._visionX2;
            const visionY = p.id === 1 ? this._visionY : this._visionY2;

            const positionChanged = Math.abs(char.x - lastX) > 0.2 || Math.abs(char.y - lastY) > 0.2;
            const directionChanged = char.direction() !== lastDir;

            const realX = char.x + (char._realX - char.x);
            const realY = char.y + (char._realY - char.y);
            const isSmoothing = Math.abs(visionX - realX) > 0.05 || Math.abs(visionY - realY) > 0.05;

            if (positionChanged || directionChanged || isSmoothing) needsVisionUpdate = true;

            // Update vision smoothing coords for this source
            if (directionChanged || isInitial || Math.abs(realX - visionX) > 2 || Math.abs(realY - visionY) > 2) {
                if (p.id === 1) { this._visionX = realX; this._visionY = realY; }
                else { this._visionX2 = realX; this._visionY2 = realY; }
            } else if (positionChanged) {
                if (p.id === 1) {
                    this._visionX += (realX - this._visionX) * VISION_SMOOTHING;
                    this._visionY += (realY - this._visionY) * VISION_SMOOTHING;
                } else {
                    this._visionX2 += (realX - this._visionX2) * VISION_SMOOTHING;
                    this._visionY2 += (realY - this._visionY2) * VISION_SMOOTHING;
                }
            } else {
                if (p.id === 1) { this._visionX = realX; this._visionY = realY; }
                else { this._visionX2 = realX; this._visionY2 = realY; }
            }

            if (positionChanged || directionChanged) {
                if (p.id === 1) {
                    this._playerLastX = char.x;
                    this._playerLastY = char.y;
                    this._playerLastDir = char.direction();
                } else {
                    this._player2LastX = char.x;
                    this._player2LastY = char.y;
                    this._player2LastDir = char.direction();
                }
            }
        }

        if (needsVisionUpdate) {
            this._forceVisionUpdate = false;
            if (this._currentFrameVisible) this._currentFrameVisible.fill(0);
            this._visibleIndices = [];
            this.refreshEventMap();

            // Calculate vision for all sources
            for (const p of players) {
                const visionX = p.id === 1 ? this._visionX : this._visionX2;
                const visionY = p.id === 1 ? this._visionY : this._visionY2;
                this.calculateVision(visionX, visionY, p.char.direction(), p.char);
            }

            if (isInitial) {
                for (let i = 0; i < this._visibleIndices.length; i++) {
                    const index = this._visibleIndices[i];
                    this._fogTransitionTimers[index] = 0;
                    this._activeTransitions.delete(index);
                }
            }

            const size = this._fogOfWarData.length;
            const fogData = this._fogOfWarData;
            const currentVisible = this._currentFrameVisible;

            for (let i = 0; i < size; i++) {
                if (fogData[i] === 2 && !currentVisible[i]) {
                    this.setFogOfWarStateByIndex(i, 1);
                }
            }
            this._lastVisibleIndices = this._visibleIndices;
        }

        this.updateEventVisibility(isInitial);

        this._fogSaveTimer = (this._fogSaveTimer || 0) + 1;
        if (this._fogSaveTimer >= 10) {
            $gameSystem.saveCurrentFogData();
            this._fogSaveTimer = 0;
        }
    };

    Game_Map.prototype.calculateVision = function (centerX, centerY, direction, character) {
        let range = this.visionRange();
        const char = character || $gamePlayer;
        const charActualX = Math.round(char._realX);
        const charActualY = Math.round(char._realY);
        const playerOnRoof = this.terrainTag(charActualX, charActualY) === TERRAIN_ROOF || this.regionId(charActualX, charActualY) === REGION_EXTENDED_VIEW;

        if (playerOnRoof) range *= 1.5;

        this.setFogOfWarState(charActualX, charActualY, 2);

        const frontX = this.roundXWithDirection(charActualX, direction);
        const frontY = this.roundYWithDirection(charActualY, direction);
        if (this.isValid(frontX, frontY)) {
            this.setFogOfWarState(frontX, frontY, 2);
        }

        const backX = this.roundXWithDirection(charActualX, 10 - direction);
        const backY = this.roundYWithDirection(charActualY, 10 - direction);
        if (this.isValid(backX, backY)) {
            this.setFogOfWarState(backX, backY, 2);
        }

        this.revealWallTilesAbovePlayer(charActualX, charActualY);

        const baseAngle = { 2: Math.PI / 2, 4: Math.PI, 6: 0, 8: Math.PI * 3 / 2 }[direction] || 0;
        const offsetDist = 1.0;
        const dx = direction === 6 ? -offsetDist : direction === 4 ? offsetDist : 0;
        const dy = direction === 2 ? -offsetDist : direction === 8 ? offsetDist : 0;

        const visionOriginX = centerX + 0.5 + dx;
        const visionOriginY = centerY + 0.5 + dy;
        const effectiveRange = range + offsetDist;

        const angleInRadians = VISION_ANGLE * Math.PI / 180;
        const halfAngle = angleInRadians / 2;

        for (let i = 0; i < RAY_COUNT; i++) {
            const angle = baseAngle - halfAngle + (angleInRadians * (i + 0.5) / RAY_COUNT);
            this.castRay(visionOriginX, visionOriginY, angle, effectiveRange, playerOnRoof);
        }
    };

    Game_Map.prototype.revealWallTilesAbovePlayer = function (playerX, playerY) {
        const checkAndReveal = (x, basePathY) => {
            if (this.isValid(x, basePathY) && this.terrainTag(x, basePathY) === TERRAIN_WALL) {
                for (let y = 1; y <= 3; y++) {
                    const tileY = basePathY + 1 - y;
                    if (this.isValid(x, tileY)) this.setFogOfWarState(x, tileY, 2);
                }
            }
        };

        checkAndReveal(playerX, playerY - 1);
        checkAndReveal(playerX - 1, playerY);
        checkAndReveal(playerX + 1, playerY);

        const wallY = playerY - 1;
        if (this.isValid(playerX, wallY) && this.terrainTag(playerX, wallY) === TERRAIN_WALL) {
            for (let y = 1; y <= 3; y++) {
                const tileY = playerY - y;
                if (this.isValid(playerX - 1, tileY) && this.terrainTag(playerX - 1, tileY) === TERRAIN_WALL) {
                    this.setFogOfWarState(playerX - 1, tileY, 2);
                }
                if (this.isValid(playerX + 1, tileY) && this.terrainTag(playerX + 1, tileY) === TERRAIN_WALL) {
                    this.setFogOfWarState(playerX + 1, tileY, 2);
                }
            }
        }
    };

    Game_Map.prototype.applyEdgeFeathering = function (centerX, centerY) {
        // Feature intentionally disabled
        return;
    };

    Game_Map.prototype.castRay = function (startX, startY, angle, maxDistance, playerOnRoof = false) {
        const baseStepSize = 0.2;
        const maxStepSize = 0.8;
        const dx = Math.cos(angle);
        const dy = Math.sin(angle);
        const width = this.width();
        const height = this.height();
        const isLoopH = this.isLoopHorizontal();
        const isLoopV = this.isLoopVertical();

        let currentX = startX;
        let currentY = startY;
        let distance = 0;
        let lastTileX = Math.floor(startX);
        let lastTileY = Math.floor(startY);
        let stepSizeFactor = 1.0;

        while (distance < maxDistance) {
            const stepSize = Math.min(maxStepSize, baseStepSize * stepSizeFactor);
            currentX += dx * stepSize;
            currentY += dy * stepSize;
            distance += stepSize;
            stepSizeFactor = Math.min(4.0, stepSizeFactor + 0.05);

            let tileX = Math.floor(currentX);
            let tileY = Math.floor(currentY);

            if (tileX === lastTileX && tileY === lastTileY) continue;

            if (isLoopH) tileX = (tileX + width) % width;
            if (isLoopV) tileY = (tileY + height) % height;

            if (tileX < 0 || tileY < 0 || tileX >= width || tileY >= height) break;

            lastTileX = tileX;
            lastTileY = tileY;

            if (this.isVisionBlocking(tileX, tileY, playerOnRoof)) {
                this.setFogOfWarState(tileX, tileY, 2);
                break;
            }

            this.setFogOfWarState(tileX, tileY, 2);
            if (distance > maxDistance - (maxDistance * EDGE_FEATHERING)) {
                this.applyEdgeFeathering(tileX, tileY);
            }
        }
    };

    Game_Map.prototype.refreshTerrainCache = function () {
        const width = this.width();
        const height = this.height();
        const size = width * height;

        if (!this._terrainCache || this._terrainCache.length !== size) {
            this._terrainCache = new Uint8Array(size);
        }

        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                const tag = this.terrainTag(x, y);
                const region = this.regionId(x, y);

                let blockType = 0;
                if (region === REGION_BLOCK) blockType = 3;
                else if (tag === TERRAIN_WALL) blockType = 1;
                else if (tag === TERRAIN_ROOF) blockType = 2;

                this._terrainCache[y * width + x] = blockType;
            }
        }
        this._terrainCacheDirty = false;
    };

    Game_Map.prototype.isVisionBlocking = function (x, y, playerOnRoof = false) {
        if (x < 0 || y < 0 || x >= this.width() || y >= this.height()) return true;
        if (this._terrainCacheDirty) this.refreshTerrainCache();

        const staticBlocks = this._terrainCache[y * this.width() + x];
        if (playerOnRoof ? (staticBlocks === 3) : (staticBlocks > 0)) return true;

        if (this._eventMap) {
            const events = this._eventMap[y * this.width() + x];
            if (events) {
                for (let i = 0; i < events.length; i++) {
                    if (this.isVisionBlockingEvent(events[i])) return true;
                }
            }
        }
        return false;
    };

    Game_Map.prototype.isVisionBlockingEvent = function (event) {
        if (!event || typeof event.event !== 'function') return false;
        const data = event.event();
        if (!data || (typeof event.priorityType === 'function' && event.priorityType() !== 1)) return false;

        const name = (data.name || "").toLowerCase();
        if (name.includes("door")) return true;
        return VISION_BLOCKING_EVENT_NAMES.some(blocker => blocker && name.includes(blocker.toLowerCase()));
    };

    Game_Map.prototype.isEnemyEvent = function (event) {
        if (!event || typeof event.event !== 'function') return false;
        const data = event.event();
        return data && data.note && /^\d+$/.test(data.note.trim());
    };

    Game_Map.prototype.isExemptEventName = function (event) {
        if (!event || typeof event.event !== 'function') return false;
        const data = event.event();
        return data && EXEMPT_EVENT_NAMES.some(exempt => (data.name || "").includes(exempt));
    };

    Game_Map.prototype.updateEventVisibility = function (snap = false) {
        this._eventVisibilityCounter = (this._eventVisibilityCounter || 0) + 1;
        if (this._eventVisibilityCounter < 3 && !snap) return;
        this._eventVisibilityCounter = 0;

        const players = [$gamePlayer];
        if (window.$gameSplitScreen && window.$gameSplitScreen.active && window.$gameSplitScreen.p2Event) {
            players.push(window.$gameSplitScreen.p2Event);
        }

        const events = this.events();

        for (let i = 0; i < events.length; i++) {
            const event = events[i];

            // Proximity to ANY player reveals the event
            const isBordering = players.some(p => Math.abs(event.x - p.x) <= 1 && Math.abs(event.y - p.y) <= 1);
            let isVisible = this.isPositionVisible(event.x, event.y);

            if (this._visibleFogOfWar && this.fogOfWarState(event.x, event.y) >= 1) {
                isVisible = true;
            }

            event._fogOfWarBorderingPlayer = isBordering;
            event.updateFogOfWarVisibility(isBordering || isVisible, snap);
        }
    };

    //=============================================================================
    // Game_Event
    //=============================================================================

    const _Game_Event_initialize = Game_Event.prototype.initialize;
    Game_Event.prototype.initialize = function (mapId, eventId) {
        _Game_Event_initialize.call(this, mapId, eventId);
        this._fogOfWarVisible = true;
        this._fogOfWarTransitioning = false;
        this._fogOfWarTransitionTimer = 0;
        this._isEnemy = false;
        this._fogOfWarBorderingPlayer = false;
    };

    Game_Event.prototype.updateFogOfWarVisibility = function (isVisible, snap = false) {
        if (this._fogOfWarBorderingPlayer) isVisible = true;

        if (this._fogOfWarVisible !== isVisible) {
            this._isEnemy = $gameMap.isEnemyEvent(this);
            const isExempt = $gameMap.isExemptEventName(this);

            this._fogOfWarVisible = isVisible;

            if (snap) {
                this._fogOfWarTransitioning = false;
                this._fogOfWarTransitionTimer = 0;
                if (!isVisible) {
                    if (this._isEnemy && !isExempt && !this._fogOfWarBorderingPlayer) {
                        this._opacity = 0;
                        this._transparent = true;
                    } else {
                        this._opacity = 255;
                        this._transparent = false;
                    }
                } else {
                    this._opacity = 255;
                    this._transparent = false;
                }
            } else {
                this._fogOfWarTransitioning = true;
                this._fogOfWarTransitionTimer = REVEAL_TRANSITION_DURATION;

                if (!isVisible) {
                    if (this._isEnemy && !isExempt && !this._fogOfWarBorderingPlayer) {
                        // Start fading out
                    } else {
                        this._opacity = 255;
                        this._transparent = false;
                        this._fogOfWarTransitioning = false;
                    }
                } else {
                    this._opacity = 255;
                    this._transparent = false;
                    // Fade in logic if needed
                    this._fogOfWarTransitioning = true;
                }
            }
        }
    };

    Game_Event.prototype.updateFogOfWarTransition = function () {
        if (this._fogOfWarTransitioning) {

            this._fogOfWarTransitionTimer--;
            const duration = REVEAL_TRANSITION_DURATION;

            if (this._isEnemy && !$gameMap.isExemptEventName(this)) {
                if (!this._fogOfWarVisible) {
                    // Fading out
                    const fadeRatio = Math.max(0, this._fogOfWarTransitionTimer / duration);
                    this._opacity = Math.floor(255 * fadeRatio);
                    if (this._fogOfWarTransitionTimer <= 0) {
                        this._fogOfWarTransitioning = false;
                        this._opacity = 0;
                        this._transparent = true;
                    }
                } else {
                    // Fading in
                    const fadeRatio = Math.max(0, 1 - (this._fogOfWarTransitionTimer / duration));
                    this._opacity = Math.floor(255 * fadeRatio);
                    this._transparent = false;
                    if (this._fogOfWarTransitionTimer <= 0) {
                        this._fogOfWarTransitioning = false;
                        this._opacity = 255;
                    }
                }
            } else {
                if (this._fogOfWarTransitionTimer <= 0) {
                    this._fogOfWarTransitioning = false;
                }
            }
        }
    };

    Game_Event.prototype.isFogOfWarGrayscale = function () {
        if (this._fogOfWarBorderingPlayer) return false;
        return !this._fogOfWarVisible && !this._isEnemy && !$gameMap.isExemptEventName(this);
    };

    Game_Event.prototype.isFogOfWarTransitioning = function () {
        return this._fogOfWarTransitioning;
    };

    const _Game_Event_update = Game_Event.prototype.update;
    Game_Event.prototype.update = function () {
        _Game_Event_update.call(this);
        this.updateFogOfWarTransition();
    };

    //=============================================================================
    // Game_Player
    //=============================================================================

    const _Game_Player_update = Game_Player.prototype.update;
    Game_Player.prototype.update = function (sceneActive) {
        _Game_Player_update.call(this, sceneActive);
        if (sceneActive) {
            if (this.isMoving()) {
                $gameMap._playerIdleTime = 0;
                $gameMap._playerWasMoving = true;
            } else if ($gameMap._playerWasMoving) {
                $gameMap._playerIdleTime++;
                if ($gameMap._playerIdleTime === 1) {
                    $gameMap.updateFogOfWar();
                }
                if ($gameMap._playerIdleTime < $gameMap._playerIdleThreshold) {
                    updateCounter = (updateCounter + 1) % UPDATE_FREQUENCY;
                    if (updateCounter === 0) $gameMap.updateFogOfWar();
                }
            }
        }
    };

    const _Game_Player_updateNonmoving = Game_Player.prototype.updateNonmoving;
    Game_Player.prototype.updateNonmoving = function (wasMoving, sceneActive) {
        _Game_Player_updateNonmoving.call(this, wasMoving, sceneActive);
        if (wasMoving && sceneActive) {
            $gameMap._playerIdleTime = 0;
            $gameMap._playerWasMoving = true;
            $gameMap.updateFogOfWar();
        }
    };

    const _Game_Player_performTransfer = Game_Player.prototype.performTransfer;
    Game_Player.prototype.performTransfer = function () {
        const sameMap = this._newMapId === $gameMap.mapId();
        _Game_Player_performTransfer.call(this);
        if (sameMap && fogOfWarEnabled && $gameMap) {
            $gameMap._forceVisionUpdate = true;
            $gameMap.updateFogOfWar();
        }
    };

    const _Game_Player_updateMove = Game_Player.prototype.updateMove;
    Game_Player.prototype.updateMove = function () {
        _Game_Player_updateMove.call(this);
        if (SceneManager._scene instanceof Scene_Map && SceneManager._scene._spriteset) {
            const container = SceneManager._scene._spriteset._fogContainer;
            container.x = -Math.round($gameMap.displayX() * $gameMap.tileWidth());
            container.y = -Math.round($gameMap.displayY() * $gameMap.tileHeight());

            updateCounter = (updateCounter + 1) % Math.max(1, Math.floor(UPDATE_FREQUENCY / 2));
            if (updateCounter === 0) $gameMap.updateFogOfWar();
        }
    };

    //=============================================================================
    // Scene_Map & Scene_Load
    //=============================================================================

    const _Scene_Map_onMapLoaded = Scene_Map.prototype.onMapLoaded;
    Scene_Map.prototype.onMapLoaded = function () {
        _Scene_Map_onMapLoaded.call(this);
        if (this._spriteset && fogOfWarEnabled) {
            setTimeout(() => this._spriteset.refreshFogOfWar(true), 100);
        }
    };

    const _Scene_Map_start = Scene_Map.prototype.start;
    Scene_Map.prototype.start = function () {
        _Scene_Map_start.call(this);
        if ($gameSystem && $gameSystem._needsFogOfWarRefresh) {
            setTimeout(() => {
                if (this._spriteset && $gameMap) {
                    if ($gameSystem._forceFogReload) {
                        $gameSystem.reloadFogOfWarLighting();
                        $gameMap.initializeFogOfWar();
                        $gameMap._playerLastX = -1;
                        $gameMap._playerLastY = -1;
                        $gameMap._playerLastDir = -1;
                        if ($gamePlayer) {
                            $gameMap._visionX = $gamePlayer.x;
                            $gameMap._visionY = $gamePlayer.y;
                        }
                        $gameSystem._forceFogReload = false;
                    }
                    this._spriteset.refreshFogOfWar(true);
                    if ($gameMap) {
                        $gameMap.markAllChunksDirty();
                        $gameMap.updateFogOfWar();
                        $gameMap.updateTransitionTimers();
                    }
                    this._spriteset.updateEventVisibility();
                }
                $gameSystem._needsFogOfWarRefresh = false;
            }, 100);
        }
    };

    const _Scene_Load_onLoadSuccess = Scene_Load.prototype.onLoadSuccess;
    Scene_Load.prototype.onLoadSuccess = function () {
        _Scene_Load_onLoadSuccess.call(this);
        $gameSystem._needsFogOfWarRefresh = true;
        $gameSystem._forceFogReload = true;
    };

    //=============================================================================
    // Spriteset_Map
    //=============================================================================

    const _Spriteset_Map_createLowerLayer = Spriteset_Map.prototype.createLowerLayer;
    Spriteset_Map.prototype.createLowerLayer = function () {
        _Spriteset_Map_createLowerLayer.call(this);
    };

    const _Spriteset_Map_createUpperLayer = Spriteset_Map.prototype.createUpperLayer;
    Spriteset_Map.prototype.createUpperLayer = function () {
        _Spriteset_Map_createUpperLayer.call(this);
        this.createFogOfWarLayer();
    };

    Spriteset_Map.prototype.createFogOfWarLayer = function () {
        this._fogContainer = new PIXI.Container();
        this.addChild(this._fogContainer);
        this._fogChunks = {};
        this._lastDisplayX = -999;
        this._lastDisplayY = -999;
        this.refreshFogOfWar(true);
    };

    const _Spriteset_Map_update = Spriteset_Map.prototype.update;
    Spriteset_Map.prototype.update = function () {
        _Spriteset_Map_update.call(this);
        if ($gameMap && $gameMap._fogOfWarDisabled) {
            this._fogContainer.visible = false;
        }

        const displayX = $gameMap.displayX();
        const displayY = $gameMap.displayY();

        this._fogContainer.x = -Math.round(displayX * $gameMap.tileWidth());
        this._fogContainer.y = -Math.round(displayY * $gameMap.tileHeight());

        if (Math.abs(displayX - this._lastDisplayX) >= 0.25 || Math.abs(displayY - this._lastDisplayY) >= 0.25) {
            this._lastDisplayX = displayX;
            this._lastDisplayY = displayY;
        }

        $gameMap.updateFogOfWar();

        const dirtyChunks = $gameMap.getDirtyChunks();
        if (dirtyChunks.length > 0) {
            this.updateDirtyChunks(dirtyChunks);
            $gameMap.clearDirtyChunks();
        }

        this.updateEventVisibility();
    };

    Spriteset_Map.prototype.refreshFogOfWar = function (fullRefresh = false) {
        if (!fogOfWarEnabled || ($gameMap && $gameMap._fogOfWarDisabled)) {
            this._fogContainer.visible = false;
            return;
        }
        this._fogContainer.visible = true;

        if (fullRefresh) {
            for (const key in this._fogChunks) {
                if (this._fogChunks[key]) {
                    this._fogContainer.removeChild(this._fogChunks[key]);
                }
            }
            this._fogChunks = {};

            if ($gameMap) {
                const players = [$gamePlayer];
                if (window.$gameSplitScreen && window.$gameSplitScreen.active && window.$gameSplitScreen.p2Event) {
                    players.push(window.$gameSplitScreen.p2Event);
                }

                players.forEach((p, i) => {
                    if (i === 0) {
                        $gameMap._visionX = p.x;
                        $gameMap._visionY = p.y;
                    } else {
                        $gameMap._visionX2 = p.x;
                        $gameMap._visionY2 = p.y;
                    }
                    $gameMap.calculateVision(p.x, p.y, p.direction(), p);
                });
                $gameMap.updateTransitionTimers();
            }
            $gameMap.markAllChunksDirty();
        }

        const dirtyChunks = $gameMap.getDirtyChunks();
        this.updateDirtyChunks(dirtyChunks);
        $gameMap.clearDirtyChunks();
    };

    Spriteset_Map.prototype.updateDirtyChunks = function (dirtyChunkKeys) {
        if (!dirtyChunkKeys.length || !$gameMap || !$gameMap._fogOfWarData) return;

        const tileWidth = $gameMap.tileWidth();
        const tileHeight = $gameMap.tileHeight();
        const mapWidth = $gameMap.width();
        const mapHeight = $gameMap.height();

        if (this._neverSeenColorValue === undefined) {
            this._neverSeenColorValue = this.parseColor(NEVER_SEEN_COLOR);
            this._previouslySeenColorValue = this.parseColor(PREVIOUSLY_SEEN_COLOR);
            this._baseAlphaValue = this.extractAlpha(PREVIOUSLY_SEEN_COLOR);
        }

        const neverSeenColor = this._neverSeenColorValue;
        const previouslySeenColor = this._previouslySeenColorValue;
        const baseAlpha = this._baseAlphaValue;

        for (let i = 0; i < dirtyChunkKeys.length; i++) {
            const key = dirtyChunkKeys[i];
            const [chunkX, chunkY] = key.split(',').map(Number);

            if (!this._fogChunks[key]) {
                this._fogChunks[key] = new PIXI.Graphics();
                this._fogContainer.addChild(this._fogChunks[key]);
            }

            const chunk = this._fogChunks[key];
            chunk.clear();
            chunk.x = chunkX * CHUNK_SIZE * tileWidth;
            chunk.y = chunkY * CHUNK_SIZE * tileHeight;

            const startX = chunkX * CHUNK_SIZE;
            const startY = chunkY * CHUNK_SIZE;
            const endX = Math.min(startX + CHUNK_SIZE, mapWidth);
            const endY = Math.min(startY + CHUNK_SIZE, mapHeight);

            const blackAlphaBatches = Array.from({ length: 11 }, () => []);
            const grayAlphaBatches = Array.from({ length: 11 }, () => []);

            for (let y = startY; y < endY; y++) {
                const rowOffset = y * mapWidth;
                for (let x = startX; x < endX; x++) {
                    const index = rowOffset + x;
                    const vAlpha = $gameMap._fogTransitionTimers[index] / 255;

                    if (vAlpha <= 0.01) continue;

                    const bucket = Math.min(10, Math.round(vAlpha * 10));
                    if (vAlpha > BASE_ALPHA + 0.05) {
                        blackAlphaBatches[bucket].push((x - startX) * tileWidth, (y - startY) * tileHeight);
                    } else {
                        grayAlphaBatches[bucket].push((x - startX) * tileWidth, (y - startY) * tileHeight);
                    }
                }
            }

            for (let a = 0; a <= 10; a++) {
                if (blackAlphaBatches[a].length > 0) {
                    chunk.beginFill(neverSeenColor, a / 10);
                    for (let r = 0; r < blackAlphaBatches[a].length; r += 2) {
                        chunk.drawRect(blackAlphaBatches[a][r], blackAlphaBatches[a][r + 1], tileWidth, tileHeight);
                    }
                    chunk.endFill();
                }
                if (grayAlphaBatches[a].length > 0) {
                    chunk.beginFill(previouslySeenColor, a / 10);
                    for (let r = 0; r < grayAlphaBatches[a].length; r += 2) {
                        chunk.drawRect(grayAlphaBatches[a][r], grayAlphaBatches[a][r + 1], tileWidth, tileHeight);
                    }
                    chunk.endFill();
                }
            }
        }
    };

    Spriteset_Map.prototype.parseColor = function (cssColor) {
        if (cssColor.startsWith('#')) return parseInt(cssColor.slice(1), 16);
        const rgbaMatch = cssColor.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
        if (rgbaMatch) return (parseInt(rgbaMatch[1]) << 16) | (parseInt(rgbaMatch[2]) << 8) | parseInt(rgbaMatch[3]);
        return 0x000000;
    };

    Spriteset_Map.prototype.extractAlpha = function (cssColor) {
        const match = cssColor.match(/rgba\(\d+,\s*\d+,\s*\d+,\s*([\d.]+)\)/);
        return match ? parseFloat(match[1]) : 1.0;
    };

    Spriteset_Map.prototype.updateEventVisibility = function () {
        for (let i = 0; i < this._characterSprites.length; i++) {
            const sprite = this._characterSprites[i];
            if (sprite._character instanceof Game_Event) {
                const event = sprite._character;
                sprite.opacity = event.opacity();

                const isGrayscale = event.isFogOfWarGrayscale() || (event.isFogOfWarTransitioning && event.isFogOfWarTransitioning());

                if (isGrayscale) {
                    if (!sprite._fogColorFilter) {
                        sprite._fogColorFilter = new PIXI.filters.ColorMatrixFilter();
                        sprite.filters = sprite.filters || [];
                        sprite.filters.push(sprite._fogColorFilter);
                        sprite._fogColorFilter.saturate(-1);
                    }
                } else if (sprite._fogColorFilter) {
                    if (sprite.filters) {
                        sprite.filters = sprite.filters.filter(f => f !== sprite._fogColorFilter);
                        if (!sprite.filters.length) sprite.filters = null;
                    }
                    sprite._fogColorFilter = null;
                }
            }
        }
    };

})();
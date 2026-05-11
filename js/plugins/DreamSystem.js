//=============================================================================
// DreamSystem.js
//=============================================================================

/*:
 * @target MZ
 * @plugindesc Dream System v1.1.0
 * @author Omni-Lex
 * @version 1.1.0
 * @description A dream system that teleports players to random maps with special effects
 *
 * @param dreamMaps
 * @text Dream Maps
 * @desc List of map IDs for dream sequences (comma separated)
 * @type string
 * @default 1,2,3
 *
 * @param flashChance
 * @text Wall Flash Chance
 * @desc Chance (0-100) of flash effect when hitting walls
 * @type number
 * @min 0
 * @max 100
 * @default 30
 *
 * @param flashColors
 * @text Flash Colors
 * @desc Hex colors for flash effect (comma separated, no #)
 * @type string
 * @default FF0000,00FF00,0000FF,FFFF00,FF00FF,00FFFF
 *
 * @command StartDream
 * @text Start Dream
 * @desc Begin the dream sequence
 *
 * @command changeDream
 * @text Change Dream
 * @desc Trigger wall collision effect (flash and teleport)
 *
 * @help DreamSystem.js
 * 
 * Plugin Commands:
 * StartDream - Begins the dream sequence
 * changeDream - Triggers wall collision effect (flash and teleport)
 * 
 * This plugin creates a dream system where:
 * - Player is teleported to random maps from the specified list
 * - Walking into walls has a chance to trigger screen flash and teleport
 * - Action button makes player jump forward (in dreams only)
 * - Cancel button shows dream-specific menu (in dreams only)
 * - Player collisions are disabled during dreams
 * 
 * ============================================================================
 */

(() => {
    'use strict';

    const pluginName = 'DreamSystem';
    const parameters = PluginManager.parameters(pluginName);

    const dreamMaps = parameters['dreamMaps'].split(',').map(id => parseInt(id.trim()));
    const flashChance = parseInt(parameters['flashChance']);
    const flashColors = parameters['flashColors'].split(',').map(color => color.trim());

    let dreamActive = false;
    let originalMapId = null;
    let originalX = null;
    let originalY = null;
    let originalDirection = null;
    let lastWallHitTime = 0;
    const wallHitCooldown = 500; // Prevent spam triggering
    let dreamMenuActive = false;
    let originalThroughState = false; // Store original through state
    let originalEventGraphics = new Map(); // Store original event graphics
    let originalTilesets = new Map(); // Store original tilesets for dream maps

    // Parallax background files list (ignoring folders and some file extensions)
    const dreamParallaxFiles = [
        '!Brickland', '!brit', '!cave', '!chaos', '!Condominium_Design_2_layer_1_48x48',
        '!Condominium_Design_layer_1_48x48', '!decay', '!FigureParty', '!Figures',
        '!Fuji', '!FujiRoad', '!OmniLex_Generated_Image_fglckdfglckdfglc', '!Generic_Home_1_Layer_1_48x48',
        '!GhentDusk', '!Gym_2_layer_1_48x48', '!Inside_C', '!Messina', '!Musdge',
        '!NorthDocs', '!PcRoom', '!PurpleROcks', '!Sludge', '!Tv_Studio_Design_layer_1_48x48',
        '!xample_church', '!xample_cliffs', '!xample_cottage', '!xample_fishmarket',
        '!xample_palisades', '!xample_prison', '1122', 'AllScenes', 'assssddff', 'assssssddd',
        'Blueprint', 'Clouds', 'cloud_panorama_3', 'DarkSpace', 'defolk', 'dffdfdfdssss',
        'Elevator', 'Example (6)', 'ffhhfhfdhdfhdffdh', 'File (17)', 'File (18)',
        'File (20)', 'File (3)', 'File (6)', 'Gent', 'Gym_layer_1_48x48',
        'Ice_Cream_Shop_Design_layer_1_48x48', 'Ice_Cream_Shop_Design_layer_3_48x48',
        'Japanese_Home_1_Layer_1_48x48', 'LAOFCxadOCsykYPPLhaV', 'Maya', 'Mountains1',
        'Mountains1_transparent', 'Mountains2', 'Mountains2_transparent', 'Mountains3',
        'Mountains3_transparent', 'Museum_entrance_layer_1_48x48', 'Museum_room_1_layer_1_48x48',
        'Museum_room_2_layer_1_48x48', 'Museum_room_3_layer_1_48x48', 'Museum_room_4_layer_1_48x48',
        'Ocean', 'RedSky', 'River', 'SandyBalcony', 'Screenshot_3_4', 'Screenshot_4 (23)',
        'Screenshot_4_4', 'Screenshot_7', 'Screenshot_8 (1)', 'Screenshot_90',
        'sddffdffds (2) - Copy', 'Shooting_Range_Design_layer_1_48x48',
        'Skyscraper_Buildings _pack_OldNinjaCat_v1', 'Space', 'StarlitSky', 'thhhuuusss',
        'Tv_Studio_Design_layer_3_48x48', 'Twilight', 'Universe', 'unknown (1)',
        'uoAnJNksovlbOfjuzTLz', 'xample_apartment', 'xample_morgue', 'xample_roofs',
        'yttyttytyt', 'yttyttytytff'
    ];

    // Object files list (ignoring numbers before !) - located in characters\Objects folder
    const dreamObjectFiles = [
        'Lights/!$Barracks_Brazier', 'Objects/!$Bathtub', 'Objects/!$Bathtub2', 'Chests/!$Box_1', 'Chests/!$Box_2', 'Chests/!$Box_3', 'Chests/!$Box_4',
        'Chests/!$Box_5', 'Chests/!$Box_6', 'Lights/!$Campfire', 'Lights/!$Camp_BigFlame', 'Lights/!$Camp_Flame', 'Lights/!$Camp_Flame2',
        'Lights/!$Camp_Torch', 'Vehicles/!$Car', 'Vehicles/!$Car_large', 'Objects/!$Chests2', 'Objects/!$Christmas_chimney',
        'Lights/!$Cottage_Lamp', 'Lights/!$Cottage_Lamp2',
        'Doors/!$Creature', 'Doors/!$door', 'Doors/!$doorA_3', 'Doors/!$Doors1', 'Doors/!$Doors2',
        'Doors/!$Doors_bathroom_emergency_exit_cold_room', 'Doors/!$Doors_vertical_left', 'Doors/!$Doors_vertical_right',
        'Doors/!$Door_Gas_Station', 'Doors/!$Door_jail_cell', 'Objects/!$Dumpster_1', 'Objects/!$Dumpster_2', 'Objects/!$Dumpster_3',
        'Objects/!$Dumpster_4', 'Doors/!$Dungeon2_Doors1', 'Doors/!$Dungeon2_Doors2', 'Doors/!$Dungeons2_DoubleDoors1',
        'Doors/!$Dungeons2_DoubleDoors2', 'Doors/!$Dungeons2_GiantDoors1', 'Doors/!$Dungeons2_GiantDoors2',
        'Doors/!$Fantasy_Gate', 'Objects/!$Fishcutting_table_sink', 'Lights/!$Flame_Extra', 'Dungeon/!$floatingrocks_3',
        'Objects/!$Fountains', 'Objects/!$FuelPump', 'Doors/!$Grocery_store_fridge_glass', 'Doors/!$Grocery_store_fridge_glass.png',
        'Objects/!$Industrial_Oven_Fridge', 'Objects/!$Iron_Cage', 'Objects/!$Kitchen_BBQ', 'Objects/!$Kitchen_drawers',
        'Objects/!$Kitchen_fridge', 'Objects/!$Kitchen_kneader', 'Objects/!$Kitchen_oven', 'Objects/!$Lobster_Tank',
        'Animals/!$Pigeon', 'Objects/!$Portable_Toilet_1',
        'Objects/!$Portable_Toilet_2', 'Lights/!$Prison_Brazier', 'Lights/!$Prison_Torch',
        'Lights/!$Rituals_Flame1', 'Objects/!$Security_camera', 'Lights/!$Smithy_Flame', 'Lights/!$Street_Lamp', 'Doors/!$Trapdoors',
        'Vehicles/!$RV', 'Vehicles/!$RV_large', 'Objects/!$Waterfall', 'Objects/!$WorldBuildings',
        'Chests/!Chest3',
        'Doors/!Door1', 'Doors/!Doors_mp', 'Objects/!Flame', 'Doors/!$GrayGate_1',
        'Dungeon/!Other1', 'Dungeon/!Other2',
        'Dungeon/!SF_Switch1',
        'Doors/!Small_doors_and_others', 'Stairs/!Stairs', 'Dungeon/!Switch1', 'Dungeon/!Switch2', 'Lights/$Candles_300%',
        'Objects/$Sink', 'Objects/$Treadmill', 'Lights/Candles.png', 'Objects/char_bubbles',
        'Chests/Chests_mp', 'Doors/Cloudcity_chars_3', 'Dungeon/Dungeon_Minecart',
        'Dungeon/Dungeon_ObjectsBig', 'Dungeon/ObjectsDungeon',
        'Lights/Light_mp', 'Dungeon/Occult_ObjectsBig', 'Dungeon/Occult_ObjectsDungeon', 'Lights/WallCandles'
    ];

    // Randomize Event Graphics
    function randomizeEventGraphics() {
        if (!$gameMap || !$gameMap._events) {
            console.log('Dream: No map or events available for randomization');
            return;
        }

        let randomizedCount = 0;

        // Randomize each event's graphic
        $gameMap._events.forEach((event, index) => {
            if (event && event._characterName && event._characterName !== '') {
                // Store original graphic data (only if not already stored)
                if (!originalEventGraphics.has(index)) {
                    originalEventGraphics.set(index, {
                        characterName: event._characterName,
                        characterIndex: event._characterIndex,
                        direction: event._direction,
                        pattern: event._pattern,
                        directionFix: event._directionFix,
                        stepAnime: event._stepAnime
                    });
                }

                // Set random object graphic
                const randomObjectFile = dreamObjectFiles[Math.floor(Math.random() * dreamObjectFiles.length)];
                event.setImage(randomObjectFile, 0);

                // Set fixed direction and no stepping
                event._directionFix = true;
                event._stepAnime = false;

                // Randomize direction and pattern for variety
                event.setDirection(2 + Math.floor(Math.random() * 4) * 2); // 2, 4, 6, 8
                event.setPattern(Math.floor(Math.random() * 3)); // 0, 1, 2

                randomizedCount++;
            }
        });

        console.log('Dream: Randomized graphics for', randomizedCount, 'events on map', $gameMap.mapId());
    }

    // Restore Event Graphics
    function restoreEventGraphics() {
        if (!$gameMap || !$gameMap._events || originalEventGraphics.size === 0) return;

        // Restore each event's original graphic
        originalEventGraphics.forEach((originalData, index) => {
            const event = $gameMap._events[index];
            if (event && originalData) {
                event.setImage(originalData.characterName, originalData.characterIndex);
                event.setDirection(originalData.direction);
                event.setPattern(originalData.pattern);
                event._directionFix = originalData.directionFix;
                event._stepAnime = originalData.stepAnime;
            }
        });

        console.log('Dream: Restored graphics for', originalEventGraphics.size, 'events');
        originalEventGraphics.clear();
    }

    // Randomize Map Tileset
    function randomizeMapTileset() {
        if (!$gameMap || !$dataMap) {
            console.log('Dream: No map data available for tileset randomization');
            return;
        }

        const currentMapId = $gameMap.mapId();

        // Store original tileset (only if not already stored)
        if (!originalTilesets.has(currentMapId)) {
            originalTilesets.set(currentMapId, $dataMap.tilesetId);
            console.log('Dream: Stored original tileset for map', currentMapId, ':', $dataMap.tilesetId);
        }

        // Generate random tileset ID (1-150)
        const randomTilesetId = Math.floor(Math.random() * 150) + 1;

        // Apply random tileset
        $dataMap.tilesetId = randomTilesetId;
        $gameMap._tilesetId = randomTilesetId;

        // Refresh the tileset
        if ($gameMap._tileset) {
            $gameMap._tileset = $dataTilesets[randomTilesetId];
        }

        // Force refresh the map display
        if (SceneManager._scene && SceneManager._scene._spriteset) {
            SceneManager._scene._spriteset._tilemap.refresh();
        }

        console.log('Dream: Randomized tileset for map', currentMapId, 'to tileset', randomTilesetId);
    }

    // Restore Map Tileset
    function restoreMapTileset(mapId) {
        if (!originalTilesets.has(mapId) || !$dataMap) {
            return;
        }

        const originalTilesetId = originalTilesets.get(mapId);

        // Restore original tileset
        $dataMap.tilesetId = originalTilesetId;
        $gameMap._tilesetId = originalTilesetId;

        // Refresh the tileset
        if ($gameMap._tileset) {
            $gameMap._tileset = $dataTilesets[originalTilesetId];
        }

        // Force refresh the map display
        if (SceneManager._scene && SceneManager._scene._spriteset) {
            SceneManager._scene._spriteset._tilemap.refresh();
        }

        console.log('Dream: Restored tileset for map', mapId, 'to original tileset', originalTilesetId);
        originalTilesets.delete(mapId);
    }

    // Plugin Command Registration
    PluginManager.registerCommand(pluginName, "StartDream", args => {
        startDream();
    });

    PluginManager.registerCommand(pluginName, "changeDream", args => {
        changeDream();
    });

    // Change Dream Function - Triggers wall collision effect
    function changeDream() {
        if (!dreamActive) {
            console.log('changeDream: Not currently in a dream, command ignored');
            return;
        }

        // Trigger the same effect as hitting a wall
        createDreamFlash();

        // Teleport after flash effect
        setTimeout(() => {
            if (dreamActive) { // Make sure dream is still active
                teleportToRandomDreamMap();
            }
        }, 1000); // Wait for flash to be visible
    }

    // Start Dream Function
    function startDream() {
        if (dreamActive) return;

        // Store original position and through state
        originalMapId = $gameMap.mapId();
        originalX = $gamePlayer._x;
        originalY = $gamePlayer._y;
        originalDirection = $gamePlayer._direction;
        originalThroughState = $gamePlayer._through;

        // Debug log to verify values are stored
        console.log('Dream started - Original position:', {
            mapId: originalMapId,
            x: originalX,
            y: originalY,
            direction: originalDirection,
            throughState: originalThroughState
        });

        dreamActive = true;

        // Enable through mode for dream state
        $gamePlayer.setThrough(true);

        // Teleport to random dream map
        teleportToRandomDreamMap();
    }

    // End Dream Function
    function endDream() {
        if (!dreamActive) return;

        dreamActive = false;
        dreamMenuActive = false;

        // Store current map ID before restoration
        const currentDreamMap = $gameMap ? $gameMap.mapId() : null;

        // Restore original through state
        $gamePlayer.setThrough(originalThroughState);

        // Restore event graphics and tileset on current map before leaving
        if (currentDreamMap === $gameMap.mapId()) {
            restoreEventGraphics();
            restoreMapTileset(currentDreamMap);
        }

        // Clean up any remaining stored data from dream maps
        originalTilesets.clear();

        // Debug log to verify values before transfer
        console.log('Dream ending - Returning to:', {
            mapId: originalMapId,
            x: originalX,
            y: originalY,
            direction: originalDirection,
            throughState: originalThroughState
        });

        // Validate original position data before transfer
        if (originalMapId !== null && originalX !== null && originalY !== null && originalDirection !== null) {
            // Return to original position
            $gamePlayer.reserveTransfer(originalMapId, originalX, originalY, originalDirection, 0);

            // Show wake up message after a short delay
            setTimeout(() => {
                window.skipLocalization = true;
                $gameMessage.add("You woke up");
                window.skipLocalization = false;
            }, 1000);
        } else {
            console.error('Dream System: Original position data is invalid!', {
                mapId: originalMapId,
                x: originalX,
                y: originalY,
                direction: originalDirection
            });

            // Fallback: just show wake up message without transfer
            window.skipLocalization = true;
            $gameMessage.add("You woke up");
            window.skipLocalization = false;
        }

        // Reset original position variables
        originalMapId = null;
        originalX = null;
        originalY = null;
        originalDirection = null;
        originalThroughState = false;
    }

    // Teleport to Random Dream Map with random position
    function teleportToRandomDreamMap() {
        if (dreamMaps.length === 0) return;

        const randomMapId = dreamMaps[Math.floor(Math.random() * dreamMaps.length)];

        // Get map width and height
        // We'll use default values if map data isn't loaded yet
        const mapWidth = $dataMapInfos[randomMapId] ? 50 : 20; // Default fallback
        const mapHeight = $dataMapInfos[randomMapId] ? 50 : 20; // Default fallback

        // Generate completely random position
        const x = Math.floor(Math.random() * mapWidth);
        const y = Math.floor(Math.random() * mapHeight);

        // Random direction
        const directions = [2, 4, 6, 8]; // Down, Left, Right, Up
        const randomDirection = directions[Math.floor(Math.random() * directions.length)];

        console.log('Dream: Teleporting to map', randomMapId, 'at position (', x, ',', y, ') facing direction', randomDirection);

        $gamePlayer.reserveTransfer(randomMapId, x, y, randomDirection, 0);
    }

    // Screen Flash Effect
    function createDreamFlash() {
        const randomColor = flashColors[Math.floor(Math.random() * flashColors.length)];

        // Create flash effect
        $gameScreen.startFlash([
            parseInt(randomColor.substr(0, 2), 16), // R
            parseInt(randomColor.substr(2, 2), 16), // G
            parseInt(randomColor.substr(4, 2), 16), // B
            128 // Alpha
        ], 60); // Duration in frames (60 frames = 1 second at 60fps)
    }

    // Dream Jump Function - Using RPG Maker's jump command
    function performDreamJump() {
        const player = $gamePlayer;
        const direction = player.direction();
        let jumpX = 0;
        let jumpY = 0;

        // Calculate jump direction based on player's facing direction
        switch (direction) {
            case 2: // Down
                jumpY = 1;
                break;
            case 4: // Left
                jumpX = -1;
                break;
            case 6: // Right
                jumpX = 1;
                break;
            case 8: // Up
                jumpY = -1;
                break;
        }

        // Use RPG Maker's built-in jump command
        // Parameters: (xPlus, yPlus)
        player.jump(jumpX, jumpY);
    }

    // Dream Menu Scene
    function Scene_DreamMenu() {
        this.initialize(...arguments);
    }

    Scene_DreamMenu.prototype = Object.create(Scene_MenuBase.prototype);
    Scene_DreamMenu.prototype.constructor = Scene_DreamMenu;

    Scene_DreamMenu.prototype.initialize = function () {
        Scene_MenuBase.prototype.initialize.call(this);
    };

    Scene_DreamMenu.prototype.create = function () {
        Scene_MenuBase.prototype.create.call(this);
        this.createCommandWindow();
    };

    Scene_DreamMenu.prototype.createCommandWindow = function () {
        const rect = this.commandWindowRect();
        this._commandWindow = new Window_DreamCommand(rect);
        this._commandWindow.setHandler('pinch', this.commandPinch.bind(this));
        this._commandWindow.setHandler('cancel', this.commandCancel.bind(this));
        this.addWindow(this._commandWindow);
    };

    Scene_DreamMenu.prototype.commandWindowRect = function () {
        const ww = 240;
        const wh = this.calcWindowHeight(2, true);
        const wx = (Graphics.boxWidth - ww) / 2;
        const wy = (Graphics.boxHeight - wh) / 2;
        return new Rectangle(wx, wy, ww, wh);
    };

    Scene_DreamMenu.prototype.commandPinch = function () {
        dreamMenuActive = false;
        endDream();
        SceneManager.pop();
    };

    Scene_DreamMenu.prototype.commandCancel = function () {
        dreamMenuActive = false;
        SceneManager.pop();
    };

    // Dream Command Window
    function Window_DreamCommand() {
        this.initialize(...arguments);
    }

    Window_DreamCommand.prototype = Object.create(Window_Command.prototype);
    Window_DreamCommand.prototype.constructor = Window_DreamCommand;

    Window_DreamCommand.prototype.makeCommandList = function () {
        this.addCommand("Pinch cheeks", 'pinch');
        this.addCommand("Cancel", 'cancel');
    };

    // Override Game_Player movement to detect wall collisions
    const _Game_Player_executeMove = Game_Player.prototype.executeMove;
    Game_Player.prototype.executeMove = function (direction) {
        const wasMovementSuccessful = this.canPass(this._x, this._y, direction);

        _Game_Player_executeMove.call(this, direction);

        // Check for wall collision during dream (only if through mode is disabled for this check)
        if (dreamActive && !wasMovementSuccessful) {
            const currentTime = Date.now();

            // Check cooldown to prevent spam
            if (currentTime - lastWallHitTime > wallHitCooldown) {
                lastWallHitTime = currentTime;

                // Random chance for flash and teleport
                if (Math.random() * 100 < flashChance) {
                    createDreamFlash();

                    // Teleport after flash effect
                    setTimeout(() => {
                        if (dreamActive) { // Make sure dream is still active
                            teleportToRandomDreamMap();
                        }
                    }, 1000); // Wait for flash to be visible
                }
            }
        }
    };

    // Override Input handling for dream-specific behavior - FIXED VERSION
    const _Scene_Map_updateCallMenu = Scene_Map.prototype.updateCallMenu;
    Scene_Map.prototype.updateCallMenu = function () {
        if (dreamActive) {
            // Check if cancel button is triggered and menu isn't already active
            if (this.isMenuCalled() && !dreamMenuActive) {
                dreamMenuActive = true;
                SoundManager.playOk();
                SceneManager.push(Scene_DreamMenu);
            }
        } else {
            _Scene_Map_updateCallMenu.call(this);
        }
    };

    // Override Scene_Map input handling for action button
    const _Scene_Map_updateScene = Scene_Map.prototype.updateScene;
    Scene_Map.prototype.updateScene = function () {
        _Scene_Map_updateScene.call(this);

        if (dreamActive && !$gameMap.isEventRunning() && !$gamePlayer.isMoving() && !$gamePlayer.isJumping()) {
            if (Input.isTriggered('ok')) {
                // Check if there's an event to interact with first
                if (!$gamePlayer.checkEventTriggerThere([0])) {
                    // If no interaction, perform dream jump
                    performDreamJump();
                }
            }
        }
    };

    // Ensure through mode is maintained during dreams
    const _Game_Player_update = Game_Player.prototype.update;
    Game_Player.prototype.update = function (sceneActive) {
        _Game_Player_update.call(this, sceneActive);

        // Force through mode during dreams
        if (dreamActive && !this._through) {
            this.setThrough(true);
        }
    };

    // Override map setup to randomize tileset and events when entering dream maps
    const _Game_Map_setup = Game_Map.prototype.setup;
    Game_Map.prototype.setup = function (mapId) {
        _Game_Map_setup.call(this, mapId);

        // Randomize tileset and events if we're in dream mode
        if (dreamActive) {
            // Randomize tileset immediately
            setTimeout(() => {
                if (dreamActive && $gameMap && $gameMap.mapId() === mapId) {
                    randomizeMapTileset();
                }
            }, 100);

            // Randomize events after a longer delay to ensure initialization
            setTimeout(() => {
                if (dreamActive && $gameMap && $gameMap.mapId() === mapId) {
                    randomizeEventGraphics();
                }
            }, 300);
        }
    };

    // Clean up when transferring maps (safety measure)
    const _Game_Player_performTransfer = Game_Player.prototype.performTransfer;
    Game_Player.prototype.performTransfer = function () {
        _Game_Player_performTransfer.call(this);

        // Reset wall hit cooldown on map transfer
        lastWallHitTime = 0;

        // Ensure through mode is maintained after map transfer during dreams
        if (dreamActive) {
            this.setThrough(true);
        }
    };

})();
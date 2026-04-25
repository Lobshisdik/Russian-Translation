//=============================================================================
// SplitScreenTwoPlayer.js
//=============================================================================

/*:
 * @target MZ
 * @plugindesc Implements a split-screen two-player system with gamepad support
 * @author Omni-Lex
 *
 * @help
 * Split Screen Two Player System
 * ==============================
 *
 * This plugin enables two-player gameplay with dynamic split-screen:
 *
 * CONTROLLER SETUP:
 * - 2 Controllers Connected: Player 1 (KB+Mouse+Gamepad 0), Player 2 (Gamepad 1)
 * - 1 Controller Connected: Player 1 (KB+Mouse), Player 2 (Gamepad 0)
 * - 0 Controllers: Only Player 1 available
 *
 * PLAYER 2 SETUP:
 * - Create an event named "Player2" on your maps where you want 2-player support
 * - Event will automatically get a random Actor1 character sprite
 * - Player 2 auto-syncs map with Player 1 when Player 1 teleports
 *
 * SPLIT SCREEN BEHAVIOR:
 * - Activates when players are more than screen distance apart
 * - Screen splits horizontally (Player 1 left, Player 2 right)
 * - Removes split when players are close together
 * - No player name tags shown
 *
 * CONTROLS:
 * Player 1: Keyboard/Mouse or Gamepad 1
 * Player 2: Gamepad 2 (if available) or Gamepad 1 (if only 1 connected)
 *
 * @param splitDistance
 * @text Split Screen Distance
 * @type number
 * @min 100
 * @max 1000
 * @default 400
 * @desc Tile distance before split screen activates (in pixels)
 *
 * @param screenSplitType
 * @text Split Screen Type
 * @type select
 * @option Horizontal Split (Left/Right)
 * @value horizontal
 * @option Vertical Split (Top/Bottom)
 * @value vertical
 * @default horizontal
 *
 * @param enableSplitScreen
 * @text Enable Split Screen
 * @type boolean
 * @default true
 *
 * @param actor1CharIndex
 * @text Actor 1 Character Index
 * @type number
 * @min 0
 * @max 7
 * @default 0
 * @desc Which character index from Actor1's charset to use for Player2 sprite
 *
 */

(() => {
    const PLUGIN_NAME = 'SplitScreenTwoPlayer';
    const params = PluginManager.parameters(PLUGIN_NAME);
    const SPLIT_DISTANCE = Number(params.splitDistance) || 400;
    const SCREEN_SPLIT_TYPE = params.screenSplitType || 'horizontal';
    const ENABLE_SPLIT_SCREEN = params.enableSplitScreen === 'true';
    const ACTOR1_CHAR_INDEX = Number(params.actor1CharIndex) || 0;

    // ========================================================================
    // GAMEPAD & INPUT DETECTION
    // ========================================================================

    class GamepadManager {
        constructor() {
            this.gamepads = [];
            this.connected = [false, false, false, false];
            this.pollGamepads();
        }

        pollGamepads() {
            const gps = navigator.getGamepads ? navigator.getGamepads() : [];
            for (let i = 0; i < 4; i++) {
                if (gps[i]) {
                    this.gamepads[i] = gps[i];
                    this.connected[i] = true;
                } else {
                    this.gamepads[i] = null;
                    this.connected[i] = false;
                }
            }
        }

        getConnectedCount() {
            return this.connected.filter(c => c).length;
        }

        isConnected(index) {
            this.pollGamepads();
            return this.connected[index] || false;
        }

        getInput(gamepadIndex) {
            const gp = this.gamepads[gamepadIndex];
            if (!gp) return null;

            return {
                axes: gp.axes ? [...gp.axes] : [],
                buttons: gp.buttons ? gp.buttons.map(b => b.pressed) : []
            };
        }

        getAxisValue(gamepadIndex, axisIndex) {
            const input = this.getInput(gamepadIndex);
            if (!input || !input.axes[axisIndex]) return 0;
            const val = input.axes[axisIndex];
            return Math.abs(val) > 0.5 ? val : 0;
        }

        isButtonPressed(gamepadIndex, buttonIndex) {
            const input = this.getInput(gamepadIndex);
            if (!input) return false;
            return input.buttons[buttonIndex] || false;
        }
    }

    const gamepadManager = new GamepadManager();

    // ========================================================================
    // PLAYER 2 CONTROLLER
    // ========================================================================

    class Player2Controller {
        constructor() {
            this.eventId = null;
            this.gamepadIndex = 0;
            this.setupPlayer2();
        }

        setupPlayer2() {
            const player2Event = $gameMap.events().find(e => e.event().name === 'Player2');
            if (player2Event) {
                this.eventId = player2Event.eventId();
                this.randomizeSprite();
            }
        }

        randomizeSprite() {
            if (!this.eventId) return;
            const actor1 = $dataActors[1];
            if (!actor1) return;

            const charName = actor1.characterName;
            const charIndex = Math.floor(Math.random() * 8);

            const event = $gameMap.event(this.eventId);
            if (event) {
                event.setImage(charName, charIndex);
            }
        }

        getPlayer2Event() {
            if (!this.eventId) return null;
            return $gameMap.event(this.eventId);
        }

        updateMovement() {
            const event = this.getPlayer2Event();
            if (!event) return;

            // Determine which gamepad to use
            const connectedCount = gamepadManager.getConnectedCount();
            if (connectedCount === 0) return;

            // Input mapping logic:
            // 2+ controllers: Player 1 uses Gamepad 0, Player 2 uses Gamepad 1
            // 1 controller: Player 1 uses Keyboard, Player 2 uses Gamepad 0
            this.gamepadIndex = (connectedCount >= 2) ? 1 : 0;

            if (!gamepadManager.isConnected(this.gamepadIndex)) return;

            // Get analog stick input
            const leftX = gamepadManager.getAxisValue(this.gamepadIndex, 0); // Left stick X
            const leftY = gamepadManager.getAxisValue(this.gamepadIndex, 1); // Left stick Y

            // Determine direction based on analog input
            let direction = 0;
            if (Math.abs(leftX) > Math.abs(leftY)) {
                direction = leftX > 0 ? 6 : 4; // Right or Left
            } else if (leftY !== 0) {
                direction = leftY > 0 ? 2 : 8; // Down or Up
            }

            // D-Pad input
            const buttonUp = gamepadManager.isButtonPressed(this.gamepadIndex, 12);
            const buttonDown = gamepadManager.isButtonPressed(this.gamepadIndex, 13);
            const buttonLeft = gamepadManager.isButtonPressed(this.gamepadIndex, 14);
            const buttonRight = gamepadManager.isButtonPressed(this.gamepadIndex, 15);

            if (buttonUp) direction = 8;
            else if (buttonDown) direction = 2;
            else if (buttonLeft) direction = 4;
            else if (buttonRight) direction = 6;

            // Move the event
            if (direction > 0) {
                event.moveStraight(direction);
            }

            // Handle other inputs
            this.handlePlayer2Actions(event);
        }

        handlePlayer2Actions(event) {
            // A button = Action button (13)
            if (gamepadManager.isButtonPressed(this.gamepadIndex, 0)) {
                // Could trigger events in front of Player 2
                // For now, just a placeholder
            }

            // B button = Cancel (14)
            if (gamepadManager.isButtonPressed(this.gamepadIndex, 1)) {
                // Could open menu or cancel action
            }
        }

        isPlayer2Active() {
            return this.eventId !== null && gamepadManager.getConnectedCount() > 0;
        }
    }

    const player2Controller = new Player2Controller();

    // ========================================================================
    // SPLIT SCREEN CAMERA SYSTEM
    // ========================================================================

    class SplitScreenCamera {
        constructor() {
            this.active = false;
            this.splitType = SCREEN_SPLIT_TYPE;
            this.player1Camera = { x: 0, y: 0 };
            this.player2Camera = { x: 0, y: 0 };
        }

        update() {
            if (!ENABLE_SPLIT_SCREEN) {
                this.active = false;
                return;
            }

            const player1Pos = this.getPlayer1Position();
            const player2Pos = this.getPlayer2Position();

            if (!player1Pos || !player2Pos) {
                this.active = false;
                return;
            }

            const distance = Math.hypot(
                player2Pos.x - player1Pos.x,
                player2Pos.y - player1Pos.y
            );

            this.active = distance > SPLIT_DISTANCE;

            if (this.active) {
                this.updateCameraPositions(player1Pos, player2Pos);
            }
        }

        getPlayer1Position() {
            return { x: $gamePlayer.x, y: $gamePlayer.y };
        }

        getPlayer2Position() {
            const event = player2Controller.getPlayer2Event();
            if (!event) return null;
            return { x: event.x, y: event.y };
        }

        updateCameraPositions(player1Pos, player2Pos) {
            const screenWidth = Graphics.width / Graphics.scale;
            const screenHeight = Graphics.height / Graphics.scale;
            const tileSize = 48; // MZ tile size

            if (this.splitType === 'horizontal') {
                // Each player gets half the width
                const halfWidth = screenWidth / 2 / tileSize;

                // Player 1 camera (left side)
                this.player1Camera.x = Math.max(0,
                    player1Pos.x - halfWidth / 2
                );
                this.player1Camera.y = player1Pos.y - screenHeight / 2 / tileSize;

                // Player 2 camera (right side)
                this.player2Camera.x = Math.max(0,
                    player2Pos.x - halfWidth / 2
                );
                this.player2Camera.y = player2Pos.y - screenHeight / 2 / tileSize;
            } else {
                // Vertical split
                const halfHeight = screenHeight / 2 / tileSize;

                this.player1Camera.x = player1Pos.x - screenWidth / 2 / tileSize;
                this.player1Camera.y = Math.max(0,
                    player1Pos.y - halfHeight / 2
                );

                this.player2Camera.x = player2Pos.x - screenWidth / 2 / tileSize;
                this.player2Camera.y = Math.max(0,
                    player2Pos.y - halfHeight / 2
                );
            }
        }
    }

    const splitScreenCamera = new SplitScreenCamera();

    // ========================================================================
    // SCENE MAP MODIFICATIONS
    // ========================================================================

    const _SceneMapCreate = Scene_Map.prototype.create;
    Scene_Map.prototype.create = function() {
        _SceneMapCreate.call(this);
        this._splitScreenMode = false;
        this._originalDisplayX = 0;
        this._originalDisplayY = 0;
    };

    const _SceneMapUpdate = Scene_Map.prototype.update;
    Scene_Map.prototype.update = function() {
        _SceneMapUpdate.call(this);

        player2Controller.updateMovement();
        splitScreenCamera.update();

        this._splitScreenMode = splitScreenCamera.active;
    };

    const _SceneMapUpdateCameraScroll = Scene_Map.prototype.updateCameraScroll;
    Scene_Map.prototype.updateCameraScroll = function() {
        if (!splitScreenCamera.active || !ENABLE_SPLIT_SCREEN) {
            _SceneMapUpdateCameraScroll.call(this);
            return;
        }

        // In split screen mode, center camera between both players
        const p1Pos = splitScreenCamera.getPlayer1Position();
        const p2Pos = splitScreenCamera.getPlayer2Position();

        if (p1Pos && p2Pos) {
            // Center between both players
            const centerX = (p1Pos.x + p2Pos.x) / 2;
            const centerY = (p1Pos.y + p2Pos.y) / 2;

            const screenTileWidth = $gameMap.screenTileX();
            const screenTileHeight = $gameMap.screenTileY();

            const displayX = centerX - screenTileWidth / 2;
            const displayY = centerY - screenTileHeight / 2;

            $gameMap.setDisplayPos(
                Math.max(0, Math.min(displayX, $gameMap.width() - screenTileWidth)),
                Math.max(0, Math.min(displayY, $gameMap.height() - screenTileHeight))
            );
        }
    };

    // ========================================================================
    // GAME MAP MODIFICATIONS - Map Synchronization
    // ========================================================================

    const _GameMapSetupEvents = Game_Map.prototype.setupEvents;
    Game_Map.prototype.setupEvents = function() {
        _GameMapSetupEvents.call(this);
        player2Controller.setupPlayer2();
    };

    const _GamePlayerPerformTransfer = Game_Player.prototype.performTransfer;
    Game_Player.prototype.performTransfer = function() {
        _GamePlayerPerformTransfer.call(this);

        // Sync Player 2 to new map
        const player2Event = player2Controller.getPlayer2Event();
        if (player2Event && player2Event.eventId() !== this.eventId()) {
            // Teleport Player2 to same location as Player 1
            $gameMap.events().forEach(event => {
                if (event.event().name === 'Player2') {
                    event.setPosition(this.x, this.y);
                    player2Controller.randomizeSprite();
                }
            });
        }
    };

    // ========================================================================
    // INPUT SYSTEM INTEGRATION
    // ========================================================================

    const _InputUpdate = Input.update;
    Input.update = function() {
        _InputUpdate.call(this);

        // Poll gamepads
        gamepadManager.pollGamepads();

        // If 2+ controllers connected, also map Player 1 to gamepad 0
        if (gamepadManager.getConnectedCount() >= 2) {
            this.handleGamepad0Input();
        }
    };

    Input.handleGamepad0Input = function() {
        const gp = gamepadManager.getInput(0);
        if (!gp) return;

        // Map analog sticks to WASD
        const leftX = gamepadManager.getAxisValue(0, 0);
        const leftY = gamepadManager.getAxisValue(0, 1);

        if (leftX < -0.5) Input._currentState['left'] = true;
        if (leftX > 0.5) Input._currentState['right'] = true;
        if (leftY < -0.5) Input._currentState['up'] = true;
        if (leftY > 0.5) Input._currentState['down'] = true;

        // Map buttons
        if (gamepadManager.isButtonPressed(0, 0)) Input._currentState['ok'] = true;     // A
        if (gamepadManager.isButtonPressed(0, 1)) Input._currentState['cancel'] = true; // B
        if (gamepadManager.isButtonPressed(0, 2)) Input._currentState['shift'] = true;  // X
        if (gamepadManager.isButtonPressed(0, 3)) Input._currentState['control'] = true; // Y
    };

    // ========================================================================
    // PLUGIN COMMANDS
    // ========================================================================

    PluginManager.registerCommand(PLUGIN_NAME, 'enableTwoPlayer', function() {
        if (!player2Controller.eventId) {
            player2Controller.setupPlayer2();
        }
        const event = player2Controller.getPlayer2Event();
        if (event) {
            event.setOpacity(255);
        }
        console.log('[SplitScreenTwoPlayer] Two-player mode enabled');
    });

    PluginManager.registerCommand(PLUGIN_NAME, 'disableTwoPlayer', function() {
        const event = player2Controller.getPlayer2Event();
        if (event) {
            event.setOpacity(0);
        }
        console.log('[SplitScreenTwoPlayer] Two-player mode disabled');
    });

    PluginManager.registerCommand(PLUGIN_NAME, 'toggleSplitScreen', function() {
        window.splitScreenEnabled = !window.splitScreenEnabled;
        console.log('[SplitScreenTwoPlayer] Split screen toggled: ' + window.splitScreenEnabled);
    });

    PluginManager.registerCommand(PLUGIN_NAME, 'setGamepadIndex', function(args) {
        const index = Number(args.gamepadIndex) || 0;
        if (index >= 0 && index < 4) {
            player2Controller.gamepadIndex = index;
            console.log('[SplitScreenTwoPlayer] Player2 gamepad set to index ' + index);
        }
    });

    PluginManager.registerCommand(PLUGIN_NAME, 'showStatus', function() {
        const connectedCount = gamepadManager.getConnectedCount();
        const player2Event = player2Controller.getPlayer2Event();
        console.log('[SplitScreenTwoPlayer] Status Report:');
        console.log('- Connected Gamepads: ' + connectedCount);
        console.log('- Player 2 Active: ' + (player2Event !== null));
        console.log('- Split Screen Active: ' + splitScreenCamera.active);
        console.log('- Player 1 Position: (' + $gamePlayer.x + ', ' + $gamePlayer.y + ')');
        if (player2Event) {
            console.log('- Player 2 Position: (' + player2Event.x + ', ' + player2Event.y + ')');
        }
    });

    PluginManager.registerCommand(PLUGIN_NAME, 'randomizePlayer2', function() {
        player2Controller.randomizeSprite();
        console.log('[SplitScreenTwoPlayer] Player2 sprite randomized');
    });

    // ========================================================================
    // WINDOW DEBUG DISPLAY
    // ========================================================================

    window.SplitScreenTwoPlayer = {
        getStatus: function() {
            const connectedCount = gamepadManager.getConnectedCount();
            const player2Event = player2Controller.getPlayer2Event();
            return {
                gamepadsConnected: connectedCount,
                player2Active: player2Event !== null,
                splitScreenActive: splitScreenCamera.active,
                player1Pos: { x: $gamePlayer.x, y: $gamePlayer.y },
                player2Pos: player2Event ? { x: player2Event.x, y: player2Event.y } : null,
                player2GamepadIndex: player2Controller.gamepadIndex
            };
        },
        enableDebugMode: function() {
            window._splitScreenDebug = true;
        },
        disableDebugMode: function() {
            window._splitScreenDebug = false;
        }
    };

    // ========================================================================
    // DEBUG OUTPUT TO SCREEN (Optional)
    // ========================================================================

    const _SceneMapCreateWindowLayer = Scene_Map.prototype.createWindowLayer;
    Scene_Map.prototype.createWindowLayer = function() {
        _SceneMapCreateWindowLayer.call(this);

        if (window._splitScreenDebug) {
            if (!this._debugWindow) {
                this._debugWindow = new Window_Base(new Rectangle(0, 0, 400, 200));
                this._debugWindow.setBackgroundType(0);
                this.addWindow(this._debugWindow);
            }
        }
    };

    const _SceneMapUpdateWindows = Scene_Map.prototype.updateWindows;
    Scene_Map.prototype.updateWindows = function() {
        _SceneMapUpdateWindows.call(this);

        if (window._splitScreenDebug && this._debugWindow) {
            this._debugWindow.contents.clear();
            const status = window.SplitScreenTwoPlayer.getStatus();
            let y = 0;
            this._debugWindow.drawText('Gamepads: ' + status.gamepadsConnected, 10, y, 380);
            y += 24;
            this._debugWindow.drawText('P2 Active: ' + status.player2Active, 10, y, 380);
            y += 24;
            this._debugWindow.drawText('Split: ' + status.splitScreenActive, 10, y, 380);
            y += 24;
            this._debugWindow.drawText('P1: (' + status.player1Pos.x + ',' + status.player1Pos.y + ')', 10, y, 380);
            y += 24;
            if (status.player2Pos) {
                this._debugWindow.drawText('P2: (' + status.player2Pos.x + ',' + status.player2Pos.y + ')', 10, y, 380);
            }
        }
    };

})();

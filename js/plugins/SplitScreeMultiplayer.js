/*:
 * @target MZ
 * @plugindesc [v1.0.0] Local Split-Screen Multiplayer - Adds a second player 
 * controlled via keyboard/gamepad with split-screen camera and automatic 
 * merging when players are close together.
 * @author OmniLex
 *
 * @param ---General---
 * @default
 *
 * @param Player2EventName
 * @text Player 2 Event Name
 * @desc The name of the event on the map that marks Player 2's spawn point.
 * @type text
 * @default Player 2
 *
 * @param ProximityThreshold
 * @text Proximity Threshold (tiles)
 * @desc How close (in tiles) players must be to merge into single-screen.
 * @type number
 * @min 1
 * @max 30
 * @default 8
 *
 * @param SplitOrientation
 * @text Split Orientation
 * @desc How the screen is split for two players.
 * @type select
 * @option Vertical (Left/Right)
 * @value vertical
 * @option Horizontal (Top/Bottom)
 * @value horizontal
 * @default vertical
 *
 * @param ---Character Pool---
 * @default
 *
 * @param CharacterPool
 * @text Character Image Pool
 * @desc JSON array of character image names for random P2 selection.
 * Example: ["Actor1","Actor2","Actor3"]
 * @type text
 * @default ["Actor1","Actor2","Actor3"]
 *
 * @param CharacterIndexPool
 * @text Character Index Pool
 * @desc JSON array of character indexes (0-7) matching the pool above.
 * Example: [0,1,2]
 * @type text
 * @default [0,1,2]
 *
 * @param ---Keyboard Controls---
 * @default
 *
 * @param P2KeyUp
 * @text P2 Key Up
 * @desc Key code for Player 2 Up movement.
 * @type text
 * @default w
 *
 * @param P2KeyDown
 * @text P2 Key Down
 * @desc Key code for Player 2 Down movement.
 * @type text
 * @default s
 *
 * @param P2KeyLeft
 * @text P2 Key Left
 * @desc Key code for Player 2 Left movement.
 * @type text
 * @default a
 *
 * @param P2KeyRight
 * @text P2 Key Right
 * @desc Key code for Player 2 Right movement.
 * @type text
 * @default d
 *
 * @param P2KeyAction
 * @text P2 Key Action (OK)
 * @desc Key code for Player 2 action/confirm button.
 * @type text
 * @default e
 *
 * @param ---Gamepad Controls---
 * @default
 *
 * @param P2GamepadIndex
 * @text P2 Gamepad Index
 * @desc Gamepad index for Player 2 (0 = first controller, 1 = second, etc.)
 * @type number
 * @min 0
 * @max 7
 * @default 1
 *
 * @param P2PadUp
 * @text P2 Gamepad D-Pad Up
 * @desc Gamepad button index for Up. (12 = standard d-pad up)
 * @type number
 * @default 12
 *
 * @param P2PadDown
 * @text P2 Gamepad D-Pad Down
 * @desc Gamepad button index for Down. (13 = standard d-pad down)
 * @type number
 * @default 13
 *
 * @param P2PadLeft
 * @text P2 Gamepad D-Pad Left
 * @desc Gamepad button index for Left. (14 = standard d-pad left)
 * @type number
 * @default 14
 *
 * @param P2PadRight
 * @text P2 Gamepad D-Pad Right
 * @desc Gamepad button index for Right. (15 = standard d-pad right)
 * @type number
 * @default 15
 *
 * @param P2PadAction
 * @text P2 Gamepad Action Button
 * @desc Gamepad button index for action. (0 = A button on Xbox)
 * @type number
 * @default 0
 *
 * @param P2StickDeadzone
 * @text P2 Left Stick Deadzone
 * @desc Deadzone threshold for the left analog stick (0.0-1.0).
 * @type text
 * @default 0.25
 *
 * @param ---Menu---
 * @default
 *
 * @param MenuCommandName
 * @text Menu Command Name
 * @desc The label shown in the title/pause menu for multiplayer.
 * @type text
 * @default Multiplayer
 *
 * @param TeleportOnMapChange
 * @text Teleport P2 on Map Transfer
 * @desc If true, Player 2 is teleported near Player 1 when the map changes.
 * @type boolean
 * @default true
 *
 * @help
 * ============================================================================
 * Split-Screen Local Multiplayer Plugin for RPG Maker MZ
 * ============================================================================
 *
 * This plugin adds local split-screen multiplayer to your RPG Maker MZ game.
 *
 * SETUP:
 * 1. Place an event named "Player 2" (configurable) on any map where you want
 *    multiplayer to be available. This event marks the spawn location.
 * 2. The plugin adds a "Multiplayer" option to the title menu.
 * 3. When activated, Player 2 gets a random character from the configured pool.
 *
 * HOW IT WORKS:
 * - When players are far apart (beyond the proximity threshold), the screen
 *   splits into two viewports — each following their respective player.
 * - When players are close together on the same map, the view merges into a
 *   single camera centered between both players.
 * - If the map changes (transfer event), Player 2 is teleported near Player 1
 *   automatically (configurable).
 *
 * CONTROLS:
 * Player 1 uses the default RPG Maker controls (arrows / gamepad 0).
 * Player 2 defaults to WASD + E on keyboard, or the second gamepad.
 * All P2 keys and gamepad buttons are configurable via plugin parameters.
 *
 * PLUGIN COMMANDS: None currently. Activation is via the menu.
 *
 * NOTE ON MULTIPLE MAPS:
 * RPG Maker MZ loads only one map at a time by design. Loading two separate
 * maps simultaneously would require duplicating the entire game state and is
 * not feasible. Therefore, when Player 1 transfers maps, Player 2 is
 * teleported alongside them automatically.
 * ============================================================================
 */

(() => {
    "use strict";

    // =========================================================================
    // Plugin Parameters
    // =========================================================================
    const pluginName = "SplitScreenMultiplayer";
    const params = PluginManager.parameters(pluginName);

    const P2_EVENT_NAME = String(params["Player2EventName"] || "Player 2");
    const PROXIMITY = Number(params["ProximityThreshold"] || 8);
    const SPLIT_DIR = String(params["SplitOrientation"] || "vertical");
    const MENU_NAME = String(params["MenuCommandName"] || "Multiplayer");
    const TELEPORT_ON_TRANSFER = String(params["TeleportOnMapChange"]) !== "false";

    let CHAR_POOL, INDEX_POOL;
    try {
        CHAR_POOL = JSON.parse(params["CharacterPool"] || '["Actor1","Actor2","Actor3"]');
        INDEX_POOL = JSON.parse(params["CharacterIndexPool"] || "[0,1,2]");
    } catch (e) {
        CHAR_POOL = ["Actor1", "Actor2", "Actor3"];
        INDEX_POOL = [0, 1, 2];
    }

    // Keyboard
    const P2_KEY_UP = String(params["P2KeyUp"] || "w").toLowerCase();
    const P2_KEY_DOWN = String(params["P2KeyDown"] || "s").toLowerCase();
    const P2_KEY_LEFT = String(params["P2KeyLeft"] || "a").toLowerCase();
    const P2_KEY_RIGHT = String(params["P2KeyRight"] || "d").toLowerCase();
    const P2_KEY_ACTION = String(params["P2KeyAction"] || "e").toLowerCase();

    // Gamepad
    const P2_PAD_INDEX = Number(params["P2GamepadIndex"] || 1);
    const P2_PAD_UP = Number(params["P2PadUp"] || 12);
    const P2_PAD_DOWN = Number(params["P2PadDown"] || 13);
    const P2_PAD_LEFT = Number(params["P2PadLeft"] || 14);
    const P2_PAD_RIGHT = Number(params["P2PadRight"] || 15);
    const P2_PAD_ACTION = Number(params["P2PadAction"] || 0);
    const P2_STICK_DEAD = parseFloat(params["P2StickDeadzone"] || "0.25");

    // =========================================================================
    // Global Multiplayer State
    // =========================================================================
    const MP = {
        active: false,
        p2CharName: "",
        p2CharIndex: 0,
        p2Event: null,       // reference to the Game_Event used for P2
        isSplit: false,       // currently in split-screen mode?
        p2Input: { up: false, down: false, left: false, right: false, action: false },
        _prevP2Input: { up: false, down: false, left: false, right: false, action: false },
    };

    window.$gameMultiplayer = MP;

    // =========================================================================
    // P2 Character Resolution
    // =========================================================================
    // If the party has 2+ members, use the second party member's appearance.
    // Otherwise fall back to a random pick from the character pool.
    function resolveP2Character() {
        if ($gameParty && $gameParty.members().length >= 2) {
            const actor = $gameParty.members()[1]; // second member (index 1)
            MP.p2CharName = actor.characterName();
            MP.p2CharIndex = actor.characterIndex();
        } else {
            const idx = Math.floor(Math.random() * CHAR_POOL.length);
            MP.p2CharName = CHAR_POOL[idx];
            MP.p2CharIndex = INDEX_POOL[idx] || 0;
        }
    }

    // =========================================================================
    // Player 2 Input System
    // =========================================================================
    // Keyboard listener for P2
    const _p2Keys = {};

    const _onKeyDown_P2 = (event) => {
        const k = event.key.toLowerCase();
        _p2Keys[k] = true;
    };
    const _onKeyUp_P2 = (event) => {
        const k = event.key.toLowerCase();
        _p2Keys[k] = false;
    };

    document.addEventListener("keydown", _onKeyDown_P2);
    document.addEventListener("keyup", _onKeyUp_P2);

    function pollP2Input() {
        // Save previous frame
        MP._prevP2Input.up = MP.p2Input.up;
        MP._prevP2Input.down = MP.p2Input.down;
        MP._prevP2Input.left = MP.p2Input.left;
        MP._prevP2Input.right = MP.p2Input.right;
        MP._prevP2Input.action = MP.p2Input.action;

        // Keyboard
        let up = !!_p2Keys[P2_KEY_UP];
        let down = !!_p2Keys[P2_KEY_DOWN];
        let left = !!_p2Keys[P2_KEY_LEFT];
        let right = !!_p2Keys[P2_KEY_RIGHT];
        let action = !!_p2Keys[P2_KEY_ACTION];

        // Gamepad
        const gp = navigator.getGamepads ? navigator.getGamepads()[P2_PAD_INDEX] : null;
        if (gp) {
            if (gp.buttons[P2_PAD_UP] && gp.buttons[P2_PAD_UP].pressed) up = true;
            if (gp.buttons[P2_PAD_DOWN] && gp.buttons[P2_PAD_DOWN].pressed) down = true;
            if (gp.buttons[P2_PAD_LEFT] && gp.buttons[P2_PAD_LEFT].pressed) left = true;
            if (gp.buttons[P2_PAD_RIGHT] && gp.buttons[P2_PAD_RIGHT].pressed) right = true;
            if (gp.buttons[P2_PAD_ACTION] && gp.buttons[P2_PAD_ACTION].pressed) action = true;
            // Left stick
            if (gp.axes && gp.axes.length >= 2) {
                if (gp.axes[1] < -P2_STICK_DEAD) up = true;
                if (gp.axes[1] > P2_STICK_DEAD) down = true;
                if (gp.axes[0] < -P2_STICK_DEAD) left = true;
                if (gp.axes[0] > P2_STICK_DEAD) right = true;
            }
        }

        MP.p2Input.up = up;
        MP.p2Input.down = down;
        MP.p2Input.left = left;
        MP.p2Input.right = right;
        MP.p2Input.action = action;
    }

    function isP2Triggered(key) {
        return MP.p2Input[key] && !MP._prevP2Input[key];
    }

    // =========================================================================
    // Title Menu – Add "Multiplayer" Command
    // =========================================================================
    const _Window_TitleCommand_makeCommandList =
        Window_TitleCommand.prototype.makeCommandList;
    Window_TitleCommand.prototype.makeCommandList = function () {
        _Window_TitleCommand_makeCommandList.call(this);
        // Insert before "Options" if it exists, otherwise at end
        const optIdx = this._list.findIndex((c) => c.symbol === "options");
        const cmd = { name: MENU_NAME, symbol: "multiplayer", enabled: true, ext: null };
        if (optIdx >= 0) {
            this._list.splice(optIdx, 0, cmd);
        } else {
            this._list.push(cmd);
        }
    };

    const _Scene_Title_createCommandWindow =
        Scene_Title.prototype.createCommandWindow;
    Scene_Title.prototype.createCommandWindow = function () {
        _Scene_Title_createCommandWindow.call(this);
        this._commandWindow.setHandler("multiplayer", this.commandMultiplayer.bind(this));
    };

    Scene_Title.prototype.commandMultiplayer = function () {
        // Activate multiplayer, then start a new game
        MP.active = true;
        // Same flow as "New Game"
        DataManager.setupNewGame();
        // Resolve P2 character (party is now set up after setupNewGame)
        resolveP2Character();
        this._commandWindow.close();
        this.fadeOutAll();
        SceneManager.goto(Scene_Map);
    };

    // =========================================================================
    // Pause Menu – Also add "Multiplayer" toggle
    // =========================================================================
    const _Window_MenuCommand_addOriginalCommands =
        Window_MenuCommand.prototype.addOriginalCommands;
    Window_MenuCommand.prototype.addOriginalCommands = function () {
        _Window_MenuCommand_addOriginalCommands.call(this);
        const label = MP.active ? "Disable " + MENU_NAME : MENU_NAME;
        this.addCommand(label, "multiplayer", true);
    };

    const _Scene_Menu_createCommandWindow =
        Scene_Menu.prototype.createCommandWindow;
    Scene_Menu.prototype.createCommandWindow = function () {
        _Scene_Menu_createCommandWindow.call(this);
        this._commandWindow.setHandler("multiplayer", this.commandMultiplayer.bind(this));
    };

    Scene_Menu.prototype.commandMultiplayer = function () {
        if (MP.active) {
            // Disable multiplayer
            MP.active = false;
            MP.p2Event = null;
            MP.isSplit = false;
        } else {
            // Enable multiplayer
            MP.active = true;
            resolveP2Character();
        }
        this._commandWindow.activate();
        this._commandWindow.refresh();
    };

    // =========================================================================
    // Game_Event Extension – Movement for P2 controlled event
    // =========================================================================

    // Find or create the P2 event whenever map is loaded
    const _Scene_Map_onMapLoaded = Scene_Map.prototype.onMapLoaded;
    Scene_Map.prototype.onMapLoaded = function () {
        _Scene_Map_onMapLoaded.call(this);
        if (MP.active) {
            findOrCreateP2Event();
        }
    };

    function findOrCreateP2Event() {
        MP.p2Event = null;
        if (!$gameMap) return;

        // Re-resolve P2 character in case party changed since last check
        resolveP2Character();

        const events = $gameMap.events();
        for (const ev of events) {
            if (ev && ev.event() && ev.event().name === P2_EVENT_NAME) {
                MP.p2Event = ev;
                break;
            }
        }
        if (MP.p2Event) {
            // Assign the random character graphic
            MP.p2Event.setImage(MP.p2CharName, MP.p2CharIndex);
            MP.p2Event._isPlayer2 = true;
            MP.p2Event._moveSpeed = $gamePlayer.realMoveSpeed();
            MP.p2Event.setThrough(false);
            MP.p2Event.setPriorityType(1); // Same as characters
            // If teleport-on-transfer is enabled, move near P1
            if (TELEPORT_ON_TRANSFER && $gamePlayer) {
                const px = $gamePlayer.x;
                const py = $gamePlayer.y;
                // Try to place near P1
                const offsets = [
                    [1, 0], [-1, 0], [0, 1], [0, -1],
                    [1, 1], [-1, -1], [1, -1], [-1, 1],
                ];
                let placed = false;
                for (const [ox, oy] of offsets) {
                    const nx = px + ox;
                    const ny = py + oy;
                    if ($gameMap.isPassable(nx, ny, 2)) {
                        MP.p2Event.locate(nx, ny);
                        placed = true;
                        break;
                    }
                }
                if (!placed) {
                    MP.p2Event.locate(px, py);
                }
            }
        }
    }

    // =========================================================================
    // P2 Movement – Drive the event each frame
    // =========================================================================
    const _Game_Map_updateEvents = Game_Map.prototype.updateEvents;
    Game_Map.prototype.updateEvents = function () {
        _Game_Map_updateEvents.call(this);
        if (MP.active && MP.p2Event && !MP.p2Event.isMoving()) {
            updateP2Movement();
        }
    };

    function updateP2Movement() {
        const ev = MP.p2Event;
        if (!ev) return;

        // Match P1 move speed
        ev._moveSpeed = $gamePlayer.realMoveSpeed();

        const input = MP.p2Input;

        // Determine direction (priority: last pressed approximation)
        let dir = 0;
        if (input.up) dir = 8;
        if (input.down) dir = 2;
        if (input.left) dir = 4;
        if (input.right) dir = 6;

        if (dir > 0) {
            ev.moveStraight(dir);
        }

        // Action button – trigger events facing P2
        if (isP2Triggered("action")) {
            triggerP2Action(ev);
        }
    }

    function triggerP2Action(ev) {
        // Check the tile P2 is facing for triggerable events
        const d = ev.direction();
        const x2 = $gameMap.roundXWithDirection(ev.x, d);
        const y2 = $gameMap.roundYWithDirection(ev.y, d);

        const events = $gameMap.eventsXy(x2, y2);
        for (const target of events) {
            if (target && target !== ev && target.isTriggerIn([0])) {
                // Trigger Action Button events
                target.start();
            }
        }
        // Also check events on P2's own tile (touch triggers)
        const eventsHere = $gameMap.eventsXy(ev.x, ev.y);
        for (const target of eventsHere) {
            if (target && target !== ev && target.isTriggerIn([1, 2])) {
                target.start();
            }
        }
    }

    // =========================================================================
    // Poll P2 Input every frame
    // =========================================================================
    const _SceneManager_updateInputData = SceneManager.updateInputData;
    SceneManager.updateInputData = function () {
        _SceneManager_updateInputData.call(this);
        if (MP.active) {
            pollP2Input();
        }
    };

    // =========================================================================
    // Split-Screen Rendering
    // =========================================================================
    // We override Spriteset_Map to render two viewports when split, or a
    // single merged viewport when players are close.

    // Distance calculation
    function playersDistance() {
        if (!MP.p2Event || !$gamePlayer) return 0;
        const dx = $gamePlayer.x - MP.p2Event.x;
        const dy = $gamePlayer.y - MP.p2Event.y;
        return Math.sqrt(dx * dx + dy * dy);
    }

    // Override Scene_Map to manage split-screen rendering
    const _Scene_Map_createSpriteset = Scene_Map.prototype.createSpriteset;
    Scene_Map.prototype.createSpriteset = function () {
        _Scene_Map_createSpriteset.call(this);
        if (MP.active) {
            this._splitScreenActive = false;
            this._splitDivider = null;
            this._p2DisplayX = 0;
            this._p2DisplayY = 0;
        }
    };

    const _Scene_Map_update = Scene_Map.prototype.update;
    Scene_Map.prototype.update = function () {
        _Scene_Map_update.call(this);
        if (MP.active && MP.p2Event) {
            this.updateSplitScreen();
        }
    };

    Scene_Map.prototype.updateSplitScreen = function () {
        const dist = playersDistance();
        const shouldSplit = dist > PROXIMITY;

        if (shouldSplit && !this._splitScreenActive) {
            this.activateSplitScreen();
        } else if (!shouldSplit && this._splitScreenActive) {
            this.deactivateSplitScreen();
        }

        if (this._splitScreenActive) {
            this.updateSplitViewports();
        } else if (MP.active && MP.p2Event) {
            // Merged mode: center camera between both players
            this.updateMergedCamera();
        }
    };

    Scene_Map.prototype.activateSplitScreen = function () {
        this._splitScreenActive = true;
        MP.isSplit = true;

        const spriteset = this._spriteset;
        if (!spriteset) return;

        const gw = Graphics.width;
        const gh = Graphics.height;

        // Create a clipping mask for P1 viewport (the main spriteset)
        if (SPLIT_DIR === "vertical") {
            // P1 = left half
            const mask1 = new PIXI.Graphics();
            mask1.beginFill(0xffffff);
            mask1.drawRect(0, 0, Math.floor(gw / 2), gh);
            mask1.endFill();
            spriteset.mask = mask1;
            spriteset.addChild(mask1);
            this._p1Mask = mask1;
        } else {
            // P1 = top half
            const mask1 = new PIXI.Graphics();
            mask1.beginFill(0xffffff);
            mask1.drawRect(0, 0, gw, Math.floor(gh / 2));
            mask1.endFill();
            spriteset.mask = mask1;
            spriteset.addChild(mask1);
            this._p1Mask = mask1;
        }

        // Create P2 spriteset (clone of the map rendering)
        this._p2Spriteset = new Spriteset_Map();
        if (SPLIT_DIR === "vertical") {
            this._p2Spriteset.x = Math.floor(gw / 2);
            const mask2 = new PIXI.Graphics();
            mask2.beginFill(0xffffff);
            mask2.drawRect(0, 0, Math.floor(gw / 2), gh);
            mask2.endFill();
            this._p2Spriteset.mask = mask2;
            this._p2Spriteset.addChild(mask2);
            this._p2Mask = mask2;
        } else {
            this._p2Spriteset.y = Math.floor(gh / 2);
            const mask2 = new PIXI.Graphics();
            mask2.beginFill(0xffffff);
            mask2.drawRect(0, 0, gw, Math.floor(gh / 2));
            mask2.endFill();
            this._p2Spriteset.mask = mask2;
            this._p2Spriteset.addChild(mask2);
            this._p2Mask = mask2;
        }
        this.addChild(this._p2Spriteset);

        // Draw divider line
        this._splitDivider = new PIXI.Graphics();
        this._splitDivider.lineStyle(2, 0x000000, 0.8);
        if (SPLIT_DIR === "vertical") {
            const cx = Math.floor(gw / 2);
            this._splitDivider.moveTo(cx, 0);
            this._splitDivider.lineTo(cx, gh);
        } else {
            const cy = Math.floor(gh / 2);
            this._splitDivider.moveTo(0, cy);
            this._splitDivider.lineTo(gw, cy);
        }
        this.addChild(this._splitDivider);

        // Store initial P2 display coords
        this._p2DisplayX = $gameMap.displayX();
        this._p2DisplayY = $gameMap.displayY();
    };

    Scene_Map.prototype.deactivateSplitScreen = function () {
        this._splitScreenActive = false;
        MP.isSplit = false;

        const spriteset = this._spriteset;
        if (spriteset && this._p1Mask) {
            spriteset.removeChild(this._p1Mask);
            spriteset.mask = null;
            this._p1Mask = null;
        }

        if (this._p2Spriteset) {
            this.removeChild(this._p2Spriteset);
            this._p2Spriteset.destroy({ children: true });
            this._p2Spriteset = null;
        }

        if (this._p2Mask) {
            this._p2Mask = null;
        }

        if (this._splitDivider) {
            this.removeChild(this._splitDivider);
            this._splitDivider.destroy();
            this._splitDivider = null;
        }
    };

    Scene_Map.prototype.updateSplitViewports = function () {
        // P1 viewport: default scroll follows $gamePlayer (already handled by engine)
        // P2 viewport: we need to scroll the P2 spriteset to follow the P2 event

        if (!this._p2Spriteset || !MP.p2Event) return;

        const ev = MP.p2Event;
        const tw = $gameMap.tileWidth();
        const th = $gameMap.tileHeight();
        const gw = Graphics.width;
        const gh = Graphics.height;

        // Calculate the viewport dimensions for P2
        let vpW, vpH;
        if (SPLIT_DIR === "vertical") {
            vpW = Math.floor(gw / 2);
            vpH = gh;
        } else {
            vpW = gw;
            vpH = Math.floor(gh / 2);
        }

        // Target display position centered on P2 event
        const halfScreenTilesX = vpW / tw / 2;
        const halfScreenTilesY = vpH / th / 2;

        let targetX = ev._realX - halfScreenTilesX + 0.5;
        let targetY = ev._realY - halfScreenTilesY + 0.5;

        // Clamp to map boundaries
        const maxX = $gameMap.width() - vpW / tw;
        const maxY = $gameMap.height() - vpH / th;

        if (!$gameMap.isLoopHorizontal()) {
            targetX = Math.max(0, Math.min(targetX, maxX));
        }
        if (!$gameMap.isLoopVertical()) {
            targetY = Math.max(0, Math.min(targetY, maxY));
        }

        // Smooth scrolling
        const speed = 0.15;
        this._p2DisplayX += (targetX - this._p2DisplayX) * speed;
        this._p2DisplayY += (targetY - this._p2DisplayY) * speed;

        // Calculate offset relative to the main spriteset's display position
        const mainDX = $gameMap.displayX();
        const mainDY = $gameMap.displayY();
        const offsetX = (mainDX - this._p2DisplayX) * tw;
        const offsetY = (mainDY - this._p2DisplayY) * th;

        // The P2 spriteset is a duplicate of the map. We shift it to show
        // the P2 camera's perspective. The base position handles the split offset.
        if (SPLIT_DIR === "vertical") {
            // The P2 spriteset already has x = gw/2 for the split.
            // We adjust the internal tilemap offset.
            this._p2Spriteset.x = Math.floor(gw / 2) + Math.round(offsetX);
            this._p2Spriteset.y = Math.round(offsetY);
        } else {
            this._p2Spriteset.x = Math.round(offsetX);
            this._p2Spriteset.y = Math.floor(gh / 2) + Math.round(offsetY);
        }
    };

    Scene_Map.prototype.updateMergedCamera = function () {
        // Center the camera between P1 and P2
        if (!MP.p2Event) return;

        const midX = ($gamePlayer._realX + MP.p2Event._realX) / 2;
        const midY = ($gamePlayer._realY + MP.p2Event._realY) / 2;

        const tw = $gameMap.tileWidth();
        const th = $gameMap.tileHeight();
        const gw = Graphics.width;
        const gh = Graphics.height;

        const halfW = gw / tw / 2;
        const halfH = gh / th / 2;

        let targetX = midX - halfW + 0.5;
        let targetY = midY - halfH + 0.5;

        const maxX = $gameMap.width() - gw / tw;
        const maxY = $gameMap.height() - gh / th;

        if (!$gameMap.isLoopHorizontal()) {
            targetX = Math.max(0, Math.min(targetX, maxX));
        }
        if (!$gameMap.isLoopVertical()) {
            targetY = Math.max(0, Math.min(targetY, maxY));
        }

        // Smoothly move display
        const speed = 0.12;
        const curX = $gameMap.displayX();
        const curY = $gameMap.displayY();
        const newX = curX + (targetX - curX) * speed;
        const newY = curY + (targetY - curY) * speed;

        // Override the game map display position
        $gameMap._displayX = newX;
        $gameMap._displayY = newY;
    };

    // =========================================================================
    // Handle Map Transfers – Teleport P2 with P1
    // =========================================================================
    const _Game_Player_performTransfer = Game_Player.prototype.performTransfer;
    Game_Player.prototype.performTransfer = function () {
        _Game_Player_performTransfer.call(this);
        if (MP.active && TELEPORT_ON_TRANSFER) {
            // The map has just loaded; P2 event will be re-found in onMapLoaded
            // We just need to flag that we need to re-initialize
            MP.p2Event = null;
            MP.isSplit = false;
        }
    };

    // =========================================================================
    // Cleanup on Scene Exit
    // =========================================================================
    const _Scene_Map_terminate = Scene_Map.prototype.terminate;
    Scene_Map.prototype.terminate = function () {
        if (this._splitScreenActive) {
            this.deactivateSplitScreen();
        }
        _Scene_Map_terminate.call(this);
    };

    // =========================================================================
    // Prevent P1 default input from also moving P2, and vice versa
    // =========================================================================
    // Override Input to not respond to P2 keys for P1 actions
    const _Input_onKeyDown = Input._onKeyDown;
    Input._onKeyDown = function (event) {
        const k = event.key.toLowerCase();
        const p2Keys = [P2_KEY_UP, P2_KEY_DOWN, P2_KEY_LEFT, P2_KEY_RIGHT, P2_KEY_ACTION];
        if (MP.active && p2Keys.includes(k)) {
            // Don't pass P2 keys to the default input handler
            return;
        }
        _Input_onKeyDown.call(this, event);
    };

    const _Input_onKeyUp = Input._onKeyUp;
    Input._onKeyUp = function (event) {
        const k = event.key.toLowerCase();
        const p2Keys = [P2_KEY_UP, P2_KEY_DOWN, P2_KEY_LEFT, P2_KEY_RIGHT, P2_KEY_ACTION];
        if (MP.active && p2Keys.includes(k)) {
            return;
        }
        _Input_onKeyUp.call(this, event);
    };

    // =========================================================================
    // P2 Indicator Sprite (draws a "P2" label above the event)
    // =========================================================================
    const _Sprite_Character_update = Sprite_Character.prototype.update;
    Sprite_Character.prototype.update = function () {
        _Sprite_Character_update.call(this);
        if (this._character && this._character._isPlayer2 && MP.active) {
            if (!this._p2Label) {
                this._p2Label = new PIXI.Text("P2", {
                    fontFamily: "GameFont, sans-serif",
                    fontSize: 14,
                    fontWeight: "bold",
                    fill: 0x00ccff,
                    stroke: 0x000000,
                    strokeThickness: 3,
                    align: "center",
                });
                this._p2Label.anchor.set(0.5, 1);
                this.addChild(this._p2Label);
            }
            this._p2Label.y = -this.height - 4;
            this._p2Label.visible = true;
        } else if (this._p2Label) {
            this._p2Label.visible = false;
        }
    };

    // Similarly show "P1" on the player character when multiplayer is active
    const _Sprite_Character_update2 = Sprite_Character.prototype.update;
    Sprite_Character.prototype.update = function () {
        _Sprite_Character_update2.call(this);
        if (this._character === $gamePlayer && MP.active) {
            if (!this._p1Label) {
                this._p1Label = new PIXI.Text("P1", {
                    fontFamily: "GameFont, sans-serif",
                    fontSize: 14,
                    fontWeight: "bold",
                    fill: 0xff4444,
                    stroke: 0x000000,
                    strokeThickness: 3,
                    align: "center",
                });
                this._p1Label.anchor.set(0.5, 1);
                this.addChild(this._p1Label);
            }
            this._p1Label.y = -this.height - 4;
            this._p1Label.visible = true;
        } else if (this._p1Label) {
            this._p1Label.visible = false;
        }
    };

    // =========================================================================
    // Save/Load Support – Persist MP state
    // =========================================================================
    const _DataManager_makeSaveContents = DataManager.makeSaveContents;
    DataManager.makeSaveContents = function () {
        const contents = _DataManager_makeSaveContents.call(this);
        contents.multiplayer = {
            active: MP.active,
            p2CharName: MP.p2CharName,
            p2CharIndex: MP.p2CharIndex,
        };
        return contents;
    };

    const _DataManager_extractSaveContents = DataManager.extractSaveContents;
    DataManager.extractSaveContents = function (contents) {
        _DataManager_extractSaveContents.call(this, contents);
        if (contents.multiplayer) {
            MP.active = contents.multiplayer.active;
            MP.p2CharName = contents.multiplayer.p2CharName;
            MP.p2CharIndex = contents.multiplayer.p2CharIndex;
        }
    };

})();
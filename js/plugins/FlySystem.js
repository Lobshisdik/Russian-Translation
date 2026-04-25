//=============================================================================
// FlySystem.js
//=============================================================================

/*:
 * @target MZ
 * @plugindesc Allows player to fly like an airship when Fly command is called
 * @author Generated with OmniLex Code
 *
 * @command Fly
 * @desc Start flying mode - player moves like airship until landing
 *
 * @command Land
 * @desc Land the airship (stop flying mode)
 *
 * @help
 * FlySystem v1.0
 *
 * When the "Fly" plugin command is called, the player will switch to airship
 * movement mode, allowing free movement in all directions. Press the confirm
 * button (usually Enter/Z) to land and return to normal movement.
 *
 * Plugin Commands:
 * - Fly: Start flying mode
 * - Land: Stop flying mode and land
 */

(() => {
    const pluginName = 'FlySystem';
    const PLUGIN_PARAMS = PluginManager.parameters(pluginName);

    // Global state for flying
    let isFlying = false;
    let originalTiltValue = 0;

    // Plugin command: Fly
    PluginManager.registerCommand(pluginName, 'Fly', function() {
        $gamePlayer._flying = true;
        $gameMap._airshipFly = true;
    });

    // Plugin command: Land
    PluginManager.registerCommand(pluginName, 'Land', function() {
        $gamePlayer._flying = false;
        $gameMap._airshipFly = false;
    });

    // Override Game_Player.prototype.moveDiagonally to allow 8-directional movement when flying
    const _Game_Player_moveDiagonally = Game_Player.prototype.moveDiagonally;
    Game_Player.prototype.moveDiagonally = function(horz, vert) {
        if ($gamePlayer._flying) {
            // Allow diagonal movement when flying
            this.setMovementSuccess(this.canPass(this._x, this._y, 2) && this.canPass(this._x, this._y, 4));
            if (this.isMovementSucceeded() || this.isOnLadder()) {
                this._x += horz;
                this._y += vert;
                this.setDirection(this.direction());
                this.increaseSteps();
            } else {
                this.setDirection(2);
            }
        } else {
            _Game_Player_moveDiagonally.call(this, horz, vert);
        }
    };

    // Override Game_Player.prototype.canPass to allow flying over obstacles
    const _Game_Player_canPass = Game_Player.prototype.canPass;
    Game_Player.prototype.canPass = function(x, y, d) {
        if ($gamePlayer._flying) {
            // When flying, allow passage over most tiles (airship mode)
            return true;
        } else {
            return _Game_Player_canPass.call(this, x, y, d);
        }
    };

    // Check for landing input every frame
    const _Scene_Map_updateInputData = Scene_Map.prototype.updateInputData;
    Scene_Map.prototype.updateInputData = function() {
        _Scene_Map_updateInputData.call(this);

        // If flying and confirm button pressed, land
        if ($gamePlayer._flying && Input.isTriggered('ok')) {
            $gamePlayer._flying = false;
            $gameMap._airshipFly = false;
        }
    };

    // Track flying state in Game_Player
    const _Game_Player_initialize = Game_Player.prototype.initialize;
    Game_Player.prototype.initialize = function() {
        _Game_Player_initialize.call(this);
        this._flying = false;
    };
})();

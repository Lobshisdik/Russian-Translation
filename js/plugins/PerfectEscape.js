/*:
 * @plugindesc Makes player escape from battle 100% successful.
 * @author Omni-Lex
 * @target MZ MV
 * @help PerfectEscape.js
 * 
 * This plugin ensures that player escape attempts from battle
 * always succeed (100% success rate).
 * 
 * No plugin parameters are needed.
 * Just install the plugin and enable it in your project.
 * 
 * Compatible with RPG Maker MV and MZ.
 */

(function() {
    // Override the escape success rate calculation
    Game_BattlerBase.prototype.makeEscapeRatio = function() {
        return 1.0; // 100% success rate
    };
    
    // Alternative approach: directly modify BattleManager's processEscape function
    var _BattleManager_processEscape = BattleManager.processEscape;
    BattleManager.processEscape = function() {
        // Set the success flag to true without any calculations
        $gameParty.performEscape();
        SoundManager.playEscape();
        this._escaped = true;
        this._escapeRatio = 1.0;
        
        // Process aftermath of successful escape
        this.processAbort();
        
        return true; // Always return true for successful escape
    };
})();

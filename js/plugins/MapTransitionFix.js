/*:
 * @target MZ
 * @plugindesc v1.0.0 Fixes null reference error during procedural map transitions
 * @author Fix for hypernet-explorer
 * @help
 * Fixes the "Cannot read property 'scrollType' of null" error that occurs
 * when transitioning between procedural maps at borders.
 *
 * Root cause: Game_Map.isLoopHorizontal() and isLoopVertical() methods
 * access $dataMap.scrollType without null-checking $dataMap first.
 */

(() => {
    'use strict';

    // Fix Game_Map.isLoopHorizontal - add null check on $dataMap
    const _Game_Map_isLoopHorizontal = Game_Map.prototype.isLoopHorizontal;
    Game_Map.prototype.isLoopHorizontal = function() {
        if (!$dataMap) {
            return false; // Return false during map transitions when $dataMap is null
        }
        return _Game_Map_isLoopHorizontal.call(this);
    };

    // Fix Game_Map.isLoopVertical - add null check on $dataMap
    const _Game_Map_isLoopVertical = Game_Map.prototype.isLoopVertical;
    Game_Map.prototype.isLoopVertical = function() {
        if (!$dataMap) {
            return false; // Return false during map transitions when $dataMap is null
        }
        return _Game_Map_isLoopVertical.call(this);
    };

})();

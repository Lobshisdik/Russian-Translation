/*:
 * @target MZ
 * @pluginname ParallelBattleAnimations
 * @author Omni-Lex
 * @desc Allows battle animations to play in parallel while battle continues
 * @help 
 * This plugin modifies the battle system to allow animations to play
 * in parallel with other actions, rather than waiting for each animation
 * to complete before continuing to the next turn.
 * 
 * No plugin parameters needed.
 */

(function() {
    // Store the original method
    const _Window_BattleLog_waitForAnimation = Window_BattleLog.prototype.waitForAnimation;
    
    // Override the waitForAnimation method to not wait
    Window_BattleLog.prototype.waitForAnimation = function() {
        // We don't want to set wait mode for animations
        // But we still need to keep track of animations that are playing
        this._animationCount = 0;
    };
    
    // We need to make sure animations still start properly
    const _Window_BattleLog_startAnimation = Window_BattleLog.prototype.startAnimation;
    Window_BattleLog.prototype.startAnimation = function(
        targets, animationId, mirror, delay
    ) {
        // Call the original method to properly set up and start the animation
        _Window_BattleLog_startAnimation.call(this, targets, animationId, mirror, delay);
        
        // Increment animation count but don't wait
        this._animationCount++;
    };
    
    // Don't modify isPlaying this time as we want animations to play normally
    // Just don't want the battle system to wait for them
})();
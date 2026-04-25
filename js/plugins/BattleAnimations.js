/*:
 * @target MZ
 * @plugindesc Play battle animations in parallel (non-blocking) with a fixed 0.8s delay.
 * @help This plugin makes battle animations play in the background.
 * When an animation starts, the system waits 0.8 seconds and then
 * immediately continues to the next action, allowing the animation
 * to finish on its own. Works for both actors and enemies.
 */

(() => {
    // Store original methods for later calls
    const _WBLog_showAttackAnimation = Window_BattleLog.prototype.showAttackAnimation;
    const _WBLog_waitForEffect = Window_BattleLog.prototype.waitForEffect;

    // Override showAttackAnimation to add a fixed delay after triggering the animation
    Window_BattleLog.prototype.showAttackAnimation = function(subject, targets) {
        // Call original to actually display the animation
        _WBLog_showAttackAnimation.call(this, subject, targets);
        // Insert a 48-frame wait (~0.8 sec) before continuing with the log queue
        this.push('wait', 48);
    };

    // Override waitForEffect to enforce exactly 48 frames of wait
    Window_BattleLog.prototype.waitForEffect = function() {
        // Call original (might set up animation), then override the wait count
        _WBLog_waitForEffect.call(this);
        // Force waitCount to 48 (0.8 seconds at 60fps)
        this._waitCount = 48;
    };

    // Override Spriteset_Battle.isBusy to ignore ongoing animations.
    // We only consider actual sprite movements (like movement or transitions) as busy.
    Spriteset_Battle.prototype.isBusy = function() {
        return this.isAnyoneMoving();
    };
})();

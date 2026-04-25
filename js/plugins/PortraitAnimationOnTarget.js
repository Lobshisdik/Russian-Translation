//=============================================================================
// PortraitAnimationOnTarget.js
//=============================================================================

/*:
 * @target MZ
 * @plugindesc Plays all animation sounds when selecting a target character
 * @author Omni-Lex
 * @version 1.0.0
 *
 * @help PortraitAnimationOnTarget.js
 *
 * This plugin plays ALL sound effects from the skill or item animation
 * when a character is selected as a target. The original selection 
 * behavior is preserved.
 *
 * --- FEATURES ---
 * - Plays all animation sound effects with proper timing
 * - Maintains original target selection behavior
 * - Works with both skills and items
 * - Compatible with battle and menu contexts
 *
 */

(() => {
    'use strict';

    //=============================================================================
    // Window_BattleActor - Play All Animation Sounds
    //=============================================================================

    const _Window_BattleActor_initialize = Window_BattleActor.prototype.initialize;
    Window_BattleActor.prototype.initialize = function(rect) {
        _Window_BattleActor_initialize.call(this, rect);
        this._soundTimers = [];
    };

    const _Window_BattleActor_update = Window_BattleActor.prototype.update;
    Window_BattleActor.prototype.update = function() {
        _Window_BattleActor_update.call(this);
        this.updateSoundTimers();
    };

    Window_BattleActor.prototype.updateSoundTimers = function() {
        for (let i = this._soundTimers.length - 1; i >= 0; i--) {
            const timer = this._soundTimers[i];
            timer.frame--;
            if (timer.frame <= 0) {
                AudioManager.playSe(timer.se);
                this._soundTimers.splice(i, 1);
            }
        }
    };

    const _Window_BattleActor_processOk = Window_BattleActor.prototype.processOk;
    Window_BattleActor.prototype.processOk = function() {
        const actor = this.actor(this.index());
        if (actor && this.active) {
            this.playAllTargetSounds();
        }
        _Window_BattleActor_processOk.call(this);
    };

    Window_BattleActor.prototype.playAllTargetSounds = function() {
        const action = BattleManager.inputtingAction();
        if (!action) return;

        const item = action.item();
        if (!item) return;

        const animationId = item.animationId;
        if (animationId > 0) {
            const animation = $dataAnimations[animationId];
            if (animation && animation.soundTimings) {
                for (const timing of animation.soundTimings) {
                    if (timing.frame === 0) {
                        // Play immediately
                        AudioManager.playSe(timing.se);
                    } else {
                        // Schedule for later
                        this._soundTimers.push({
                            frame: timing.frame,
                            se: timing.se
                        });
                    }
                }
            }
        }
    };

    const _Window_BattleActor_hide = Window_BattleActor.prototype.hide;
    Window_BattleActor.prototype.hide = function() {
        this._soundTimers = [];
        _Window_BattleActor_hide.call(this);
    };

    //=============================================================================
    // Window_MenuActor - Menu Support
    //=============================================================================

    const _Window_MenuActor_initialize = Window_MenuActor.prototype.initialize;
    Window_MenuActor.prototype.initialize = function(rect) {
        _Window_MenuActor_initialize.call(this, rect);
        this._soundTimers = [];
    };

    const _Window_MenuActor_update = Window_MenuActor.prototype.update;
    Window_MenuActor.prototype.update = function() {
        _Window_MenuActor_update.call(this);
        this.updateSoundTimers();
    };

    Window_MenuActor.prototype.updateSoundTimers = Window_BattleActor.prototype.updateSoundTimers;

    const _Window_MenuActor_processOk = Window_MenuActor.prototype.processOk;
    Window_MenuActor.prototype.processOk = function() {
        const actor = this.actor(this.index());
        if (actor && this.active && SceneManager._scene._itemWindow) {
            const item = SceneManager._scene._itemWindow.item();
            if (item && item.animationId > 0) {
                const animation = $dataAnimations[item.animationId];
                if (animation && animation.soundTimings) {
                    for (const timing of animation.soundTimings) {
                        if (timing.frame === 0) {
                            // Play immediately
                            AudioManager.playSe(timing.se);
                        } else {
                            // Schedule for later
                            this._soundTimers.push({
                                frame: timing.frame,
                                se: timing.se
                            });
                        }
                    }
                }
            }
        }
        _Window_MenuActor_processOk.call(this);
    };

    const _Window_MenuActor_hide = Window_MenuActor.prototype.hide;
    Window_MenuActor.prototype.hide = function() {
        this._soundTimers = [];
        _Window_MenuActor_hide.call(this);
    };

})();
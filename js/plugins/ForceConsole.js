//=============================================================================
// ForceConsole.js
//=============================================================================

/*:
 * @target MZ
 * @plugindesc Forces the developer console to open in deployed games
 * @author Assistant
 *
 * @help ForceConsole.js
 *
 * This plugin forces the developer console (DevTools) to open automatically
 * when the game starts, even in deployed builds.
 *
 * Useful for debugging deployed games or testing in production-like environments.
 *
 * @param autoOpen
 * @text Auto-Open Console
 * @desc Automatically open the console when the game starts
 * @type boolean
 * @default true
 *
 * @param openDetached
 * @text Open Detached
 * @desc Open the console in a separate window
 * @type boolean
 * @default false
 */

(() => {
    const pluginName = "ForceConsole";
    const parameters = PluginManager.parameters(pluginName);
    const autoOpen = parameters['autoOpen'] === 'true';
    const openDetached = parameters['openDetached'] === 'true';

    // Enable test mode to make console accessible
    const _SceneManager_initialize = SceneManager.initialize;
    SceneManager.initialize = function() {
        _SceneManager_initialize.call(this);

        // Force isNwjs to return true to enable console
        Utils.isNwjs = function() {
            return true;
        };
    };

    // Open the console when the game starts
    if (autoOpen) {
        const _SceneManager_run = SceneManager.run;
        SceneManager.run = function(sceneClass) {
            _SceneManager_run.call(this, sceneClass);

            // Open the developer console
            if (typeof nw !== 'undefined' && nw.Window) {
                const win = nw.Window.get();
                if (openDetached) {
                    win.showDevTools('', () => {});
                } else {
                    win.showDevTools();
                }
            } else if (typeof require !== 'undefined') {
                // Alternative method using require
                try {
                    const gui = require('nw.gui');
                    const win = gui.Window.get();
                    if (openDetached) {
                        win.showDevTools('', () => {});
                    } else {
                        win.showDevTools();
                    }
                } catch (e) {
                    console.warn('Could not open DevTools:', e);
                }
            }
        };
    }

    // Add F8 key binding to toggle console
    const _SceneManager_onKeyDown = SceneManager.onKeyDown;
    SceneManager.onKeyDown = function(event) {
        if (_SceneManager_onKeyDown) {
            _SceneManager_onKeyDown.call(this, event);
        }

        if (!event.ctrlKey && !event.altKey && event.keyCode === 119) { // F8
            if (typeof nw !== 'undefined' && nw.Window) {
                const win = nw.Window.get();
                try {
                    if (win.isDevToolsOpen && win.isDevToolsOpen()) {
                        win.closeDevTools();
                    } else {
                        if (openDetached) {
                            win.showDevTools('', () => {});
                        } else {
                            win.showDevTools();
                        }
                    }
                } catch (e) {
                    console.warn('Could not toggle DevTools:', e);
                }
            }
        }
    };

})();

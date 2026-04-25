//=============================================================================
// RealtimeDebugWindow.js
//=============================================================================

/*:
 * @target MZ
 * @plugindesc Realtime Debug Window v1.0.0
 * @author Omni-Lex
 * @url https://nocoldiz.itch.io/hypernet-explorer
 * @help RealtimeDebugWindow.js
 * 
 * @param refreshRate
 * @text Refresh Rate (ms)
 * @desc How often to update the debug window (milliseconds)
 * @type number
 * @min 100
 * @max 5000
 * @default 500
 * 
 * @param maxSwitches
 * @text Max Switches to Show
 * @desc Maximum number of switches to display (0 = show all)
 * @type number
 * @min 0
 * @max 9999
 * @default 100
 * 
 * @param maxVariables
 * @text Max Variables to Show
 * @desc Maximum number of variables to display (0 = show all)
 * @type number
 * @min 0
 * @max 9999
 * @default 100
 * 
 * This plugin creates a debug window that shows all switches and variables
 * in real-time. Press F9 to open/close the debug window.
 * 
 * The window will automatically update to show current values of switches
 * and variables as they change during gameplay.
 */

(() => {
    'use strict';
    
    const pluginName = 'RealtimeDebugWindow';
    const parameters = PluginManager.parameters(pluginName);
    const refreshRate = parseInt(parameters['refreshRate']) || 500;
    const maxSwitches = parseInt(parameters['maxSwitches']) || 100;
    const maxVariables = parseInt(parameters['maxVariables']) || 100;
    
    let debugWindow = null;
    let updateInterval = null;
    let isWindowOpen = false;
    
    // Create the debug window
    function createDebugWindow() {
        if (debugWindow && !debugWindow.closed) {
            debugWindow.focus();
            return;
        }
        
        const windowFeatures = 'width=800,height=600,scrollbars=yes,resizable=yes';
        debugWindow = window.open('', 'RPGMakerDebug', windowFeatures);
        
        if (!debugWindow) {
            $gameMessage.add('Unable to open debug window. Please check popup blocker settings.');
            return;
        }
        
        // Set up the debug window HTML
        debugWindow.document.write(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>RPG Maker MZ - Debug Window</title>
                <style>
                    body {
                        font-family: 'Courier New', monospace;
                        margin: 0;
                        padding: 20px;
                        background-color: #1e1e1e;
                        color: #ffffff;
                        font-size: 12px;
                    }
                    .header {
                        background-color: #2d2d30;
                        padding: 10px;
                        margin: -20px -20px 20px -20px;
                        border-bottom: 2px solid #007acc;
                    }
                    .section {
                        margin-bottom: 30px;
                        border: 1px solid #3e3e42;
                        border-radius: 5px;
                        padding: 15px;
                        background-color: #252526;
                    }
                    .section-title {
                        color: #4ec9b0;
                        font-weight: bold;
                        font-size: 16px;
                        margin-bottom: 10px;
                        border-bottom: 1px solid #3e3e42;
                        padding-bottom: 5px;
                    }
                    .item {
                        padding: 2px 0;
                        border-bottom: 1px solid #2d2d30;
                    }
                    .item:last-child {
                        border-bottom: none;
                    }
                    .switch-true {
                        color: #4fc1ff;
                    }
                    .switch-false {
                        color: #808080;
                    }
                    .variable {
                        color: #ce9178;
                    }
                    .id {
                        color: #9cdcfe;
                        font-weight: bold;
                    }
                    .name {
                        color: #dcdcaa;
                    }
                    .value {
                        color: #b5cea8;
                        font-weight: bold;
                    }
                    .controls {
                        position: fixed;
                        top: 10px;
                        right: 20px;
                        background-color: #2d2d30;
                        padding: 5px 10px;
                        border-radius: 3px;
                        border: 1px solid #3e3e42;
                    }
                    .refresh-rate {
                        color: #569cd6;
                        font-size: 10px;
                    }
                </style>
            </head>
            <body>
                <div class="header">
                    <h1 style="margin: 0; color: #007acc;">RPG Maker MZ - Debug Window</h1>
                    <div class="controls">
                        <span class="refresh-rate">Refresh Rate: ${refreshRate}ms</span>
                    </div>
                </div>
                <div id="content">
                    <div class="section">
                        <div class="section-title">🔧 Loading...</div>
                    </div>
                </div>
            </body>
            </html>
        `);
        
        debugWindow.document.close();
        isWindowOpen = true;
        
        // Start the update interval
        startUpdateInterval();
        
        // Handle window close
        debugWindow.addEventListener('beforeunload', () => {
            stopUpdateInterval();
            isWindowOpen = false;
            debugWindow = null;
        });
    }
    
    // Update the debug window content
    function updateDebugWindow() {
        if (!debugWindow || debugWindow.closed) {
            stopUpdateInterval();
            isWindowOpen = false;
            debugWindow = null;
            return;
        }
        
        try {
            const contentDiv = debugWindow.document.getElementById('content');
            if (!contentDiv) return;
            
            let html = '';
            
            // Switches section
            html += '<div class="section"><div class="section-title">🔘 Switches</div>';
            const switchLimit = maxSwitches > 0 ? Math.min(maxSwitches, $dataSystem.switches.length - 1) : $dataSystem.switches.length - 1;
            
            for (let i = 1; i <= switchLimit; i++) {
                const switchName = $dataSystem.switches[i] || `Switch ${i}`;
                const switchValue = $gameSwitches.value(i);
                const statusClass = switchValue ? 'switch-true' : 'switch-false';
                const statusText = switchValue ? 'ON' : 'OFF';
                
                html += `<div class="item ${statusClass}">`;
                html += `<span class="id">[${i.toString().padStart(3, '0')}]</span> `;
                html += `<span class="name">${switchName}</span>: `;
                html += `<span class="value">${statusText}</span>`;
                html += `</div>`;
            }
            html += '</div>';
            
            // Variables section
            html += '<div class="section"><div class="section-title">📊 Variables</div>';
            const variableLimit = maxVariables > 0 ? Math.min(maxVariables, $dataSystem.variables.length - 1) : $dataSystem.variables.length - 1;
            
            for (let i = 1; i <= variableLimit; i++) {
                const variableName = $dataSystem.variables[i] || `Variable ${i}`;
                const variableValue = $gameVariables.value(i);
                
                html += `<div class="item variable">`;
                html += `<span class="id">[${i.toString().padStart(3, '0')}]</span> `;
                html += `<span class="name">${variableName}</span>: `;
                html += `<span class="value">${variableValue}</span>`;
                html += `</div>`;
            }
            html += '</div>';
            
            // Game info section
            html += '<div class="section"><div class="section-title">ℹ️ Game Info</div>';
            html += `<div class="item"><span class="name">Map ID</span>: <span class="value">${$gameMap.mapId()}</span></div>`;
            html += `<div class="item"><span class="name">Player X</span>: <span class="value">${$gamePlayer.x}</span></div>`;
            html += `<div class="item"><span class="name">Player Y</span>: <span class="value">${$gamePlayer.y}</span></div>`;
            html += `<div class="item"><span class="name">Direction</span>: <span class="value">${$gamePlayer.direction()}</span></div>`;
            html += `<div class="item"><span class="name">Party Gold</span>: <span class="value">${$gameParty.gold()}</span></div>`;
            html += `<div class="item"><span class="name">Playtime</span>: <span class="value">${$gameSystem.playtimeText()}</span></div>`;
            html += '</div>';
            
            contentDiv.innerHTML = html;
        } catch (error) {
            console.error('Debug window update error:', error);
        }
    }
    
    // Start the update interval
    function startUpdateInterval() {
        if (updateInterval) clearInterval(updateInterval);
        updateInterval = setInterval(updateDebugWindow, refreshRate);
        updateDebugWindow(); // Initial update
    }
    
    // Stop the update interval
    function stopUpdateInterval() {
        if (updateInterval) {
            clearInterval(updateInterval);
            updateInterval = null;
        }
    }
    
    // Toggle debug window
    function toggleDebugWindow() {
        if (isWindowOpen && debugWindow && !debugWindow.closed) {
            debugWindow.close();
            stopUpdateInterval();
            isWindowOpen = false;
            debugWindow = null;
        } else {
            createDebugWindow();
        }
    }
    
    // Input handling
    const _Input_onKeyDown = Input._onKeyDown;
    Input._onKeyDown = function(event) {
        _Input_onKeyDown.call(this, event);
        
        // F9 key
        if (event.keyCode === 120) { // F9
            event.preventDefault();
            toggleDebugWindow();
        }
    };
    
    // Clean up when game is closed
    const _Scene_Base_terminate = Scene_Base.prototype.terminate;
    Scene_Base.prototype.terminate = function() {
        _Scene_Base_terminate.call(this);
        if (debugWindow && !debugWindow.closed) {
            debugWindow.close();
            stopUpdateInterval();
        }
    };
})();
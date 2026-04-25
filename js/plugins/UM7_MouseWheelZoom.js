//=============================================================================
// UM7_MouseWheelZoom.js
//=============================================================================

/*:
 * @target MZ
 * @plugindesc Ultra Mode 7 Mouse Wheel Zoom & Pan v1.2.0
 * @author Omni-Lex
 * @url https://nocoldiz.itch.io/hypernet-explorer
 * @help UM7_MouseWheelZoom.js
 * 
 * @param targetMapId
 * @text Target Map ID
 * @desc Map ID where mouse wheel zoom should be active
 * @type number
 * @default 315
 * 
 * @param zoomStep
 * @text Zoom Step
 * @desc Distance change per mouse wheel step
 * @type number
 * @default 10
 * 
 * @param animationFrames
 * @text Animation Frames
 * @desc Number of frames for zoom animation
 * @type number
 * @default 1
 * 
 * @param minDistance
 * @text Minimum Distance
 * @desc Minimum camera distance (closest zoom)
 * @type number
 * @default 50
 * 
 * @param maxDistance
 * @text Maximum Distance
 * @desc Maximum camera distance (farthest zoom)
 * @type number
 * @default 1000
 * 
 * @param optionName
 * @text Option Menu Name
 * @desc Name displayed in options menu
 * @type string
 * @default 3D Worldmap
 * 
 * @param defaultEnabled
 * @text Default Setting
 * @desc Default state of 3D worldmap option
 * @type boolean
 * @default true
 * 
 * @param panSensitivity
 * @text Pan Sensitivity
 * @desc Mouse pan sensitivity (higher = more sensitive)
 * @type number
 * @decimals 2
 * @default 0.5
 * 
 * @param enablePan
 * @text Enable Mouse Pan
 * @desc Enable middle mouse button pan functionality
 * @type boolean
 * @default true
 * 
 * This plugin adds mouse wheel zoom functionality to Ultra Mode 7 and
 * includes an option menu to enable/disable Mode 7 on the target map.
 * 
 * Features:
 * - Mouse wheel up: Zoom in (decrease camera distance)
 * - Mouse wheel down: Zoom out (increase camera distance)
 * - Middle mouse button + drag: Pan the camera view
 * - Options menu toggle for "3D Worldmap" (ON/OFF)
 * - Only active on specified map ID when enabled
 * - Configurable zoom limits and step size
 * - Configurable pan sensitivity
 * - Smooth animation support
 * 
 * Requirements:
 * - Ultra Mode 7 plugin must be installed and active
 * - Map must have Ultra Mode 7 enabled
 * 
 * License:
 * Free for commercial and non-commercial use.
 */

(() => {
    'use strict';
    
    const pluginName = 'UM7_MouseWheelZoom';
    const parameters = PluginManager.parameters(pluginName);
    
    const TARGET_MAP_ID = parseInt(parameters['targetMapId']) || 315;
    const ZOOM_STEP = parseInt(parameters['zoomStep']) || 10;
    const ANIMATION_FRAMES = parseInt(parameters['animationFrames']) || 1;
    const MIN_DISTANCE = parseInt(parameters['minDistance']) || 50;
    const MAX_DISTANCE = parseInt(parameters['maxDistance']) || 1000;
    const OPTION_NAME = parameters['optionName'] || '3D Worldmap';
    const DEFAULT_ENABLED = parameters['defaultEnabled'] === 'true';
    const PAN_SENSITIVITY = parseFloat(parameters['panSensitivity']) || 0.5;
    const ENABLE_PAN = parameters['enablePan'] === 'true';
    
    // Game option symbol
    const OPTION_SYMBOL = 'um7WorldmapEnabled';
    
    // Track if we're currently on the target map
    let isOnTargetMap = false;
    let mouseWheelHandler = null;
    let mouseDownHandler = null;
    let mouseMoveHandler = null;
    let mouseUpHandler = null;
    
    // Pan state tracking
    let isPanning = false;
    let lastMouseX = 0;
    let lastMouseY = 0;
    
    // Check if we're on the target map and the option is enabled
    function checkTargetMap() {
        return $gameMap && $gameMap.mapId() === TARGET_MAP_ID && isMode7Enabled();
    }
    
    // Check if Mode 7 is enabled in options
    function isMode7Enabled() {
        return ConfigManager[OPTION_SYMBOL];
    }
    
    // Check if Mode 7 should be active (option enabled and on target map)
    function shouldMode7BeActive() {
        return $gameMap && $gameMap.mapId() === TARGET_MAP_ID && isMode7Enabled();
    }
    
    // Handle Mode 7 state changes
    function handleMode7StateChange() {
        if (!$gameMap || $gameMap.mapId() !== TARGET_MAP_ID) return;
        
        const shouldBeActive = shouldMode7BeActive();
        const currentlyActive = isCurrentlyInMode7();
        
        if (shouldBeActive !== currentlyActive) {
            // State change needed - reload the map
            const x = $gamePlayer.x;
            const y = $gamePlayer.y;
            const direction = $gamePlayer.direction();
            
            if (shouldBeActive) {
                // Ensure map has Mode 7 tag before transfer
                if ($dataMap && !$dataMap.note.includes('<UltraMode7>')) {
                    $dataMap.note += '\n<UltraMode7>';
                }
            } else {
                // Temporarily remove Mode 7 tag
                if ($dataMap && $dataMap.note.includes('<UltraMode7>')) {
                    $dataMap._originalNote = $dataMap.note;
                    $dataMap.note = $dataMap.note.replace(/<UltraMode7>/gi, '');
                }
            }
            
            // Reload map to apply changes
            setTimeout(() => {
                $gamePlayer.reserveTransfer(TARGET_MAP_ID, x, y, direction, 0);
            }, 100);
        }
    }
    
    // Check if currently in Mode 7
    function isCurrentlyInMode7() {
        return typeof UltraMode7 !== 'undefined' && 
               UltraMode7.isActive && 
               UltraMode7.isActive();
    }
    
    // Handle mouse wheel events
    function handleMouseWheel(event) {
        // Only process if we're on the target map, option is enabled, and Ultra Mode 7 is available
        if (!isOnTargetMap || typeof UltraMode7 === 'undefined' || !isMode7Enabled()) {
            return;
        }
        
        // Prevent default scroll behavior
        event.preventDefault();
        
        try {
            // Get current camera distance
            const currentDistance = UltraMode7.getCameraDistance();
            let newDistance;
            
            // Determine zoom direction based on wheel delta
            if (event.deltaY < 0) {
                // Mouse wheel up - zoom in (decrease distance)
                newDistance = Math.max(currentDistance - ZOOM_STEP, MIN_DISTANCE);
            } else {
                // Mouse wheel down - zoom out (increase distance)
                newDistance = Math.min(currentDistance + ZOOM_STEP, MAX_DISTANCE);
            }
            
            // Only animate if distance actually changed
            if (newDistance !== currentDistance) {
                UltraMode7.animateCameraDistance(newDistance, ANIMATION_FRAMES);
            }
        } catch (error) {
            console.warn('Ultra Mode 7 Mouse Wheel Zoom Error:', error);
        }
    }
    
    // Handle mouse down events (for pan start)
    function handleMouseDown(event) {
        if (!ENABLE_PAN || !isOnTargetMap || typeof UltraMode7 === 'undefined' || !isMode7Enabled()) {
            return;
        }
        
        // Check if middle mouse button (button 1) is pressed
        if (event.button === 1) {
            event.preventDefault();
            isPanning = true;
            lastMouseX = event.clientX;
            lastMouseY = event.clientY;
            document.body.style.cursor = 'grabbing';
        }
    }
    
    // Handle mouse move events (for panning)
    function handleMouseMove(event) {
        if (!ENABLE_PAN || !isPanning || !isOnTargetMap || typeof UltraMode7 === 'undefined' || !isMode7Enabled()) {
            return;
        }
        
        event.preventDefault();
        
        try {
            const deltaX = event.clientX - lastMouseX;
            const deltaY = event.clientY - lastMouseY;
            
            // Get current camera position
            const currentCameraX = UltraMode7.getCameraX ? UltraMode7.getCameraX() : 0;
            const currentCameraY = UltraMode7.getCameraY ? UltraMode7.getCameraY() : 0;
            
            // Calculate new camera position based on mouse movement
            const newCameraX = currentCameraX - (deltaX * PAN_SENSITIVITY);
            const newCameraY = currentCameraY + (deltaY * PAN_SENSITIVITY);
            
            // Apply new camera position
            if (UltraMode7.setCameraPosition) {
                UltraMode7.setCameraPosition(newCameraX, newCameraY);
            } else if (UltraMode7.setCameraX && UltraMode7.setCameraY) {
                UltraMode7.setCameraX(newCameraX);
                UltraMode7.setCameraY(newCameraY);
            }
            
            lastMouseX = event.clientX;
            lastMouseY = event.clientY;
        } catch (error) {
            console.warn('Ultra Mode 7 Mouse Pan Error:', error);
        }
    }
    
    // Handle mouse up events (for pan end)
    function handleMouseUp(event) {
        if (!ENABLE_PAN) return;
        
        // Check if middle mouse button (button 1) is released
        if (event.button === 1) {
            isPanning = false;
            document.body.style.cursor = 'default';
        }
    }
    
    // Handle context menu (prevent it when middle clicking)
    function handleContextMenu(event) {
        if (!ENABLE_PAN || !isOnTargetMap) return;
        
        // Prevent context menu on middle mouse button
        if (isPanning) {
            event.preventDefault();
        }
    }
    
    // Add mouse event listeners
    function addMouseEventListeners() {
        if (mouseWheelHandler) return; // Already added
        
        mouseWheelHandler = handleMouseWheel;
        mouseDownHandler = handleMouseDown;
        mouseMoveHandler = handleMouseMove;
        mouseUpHandler = handleMouseUp;
        
        document.addEventListener('wheel', mouseWheelHandler, { passive: false });
        
        if (ENABLE_PAN) {
            document.addEventListener('mousedown', mouseDownHandler);
            document.addEventListener('mousemove', mouseMoveHandler);
            document.addEventListener('mouseup', mouseUpHandler);
            document.addEventListener('contextmenu', handleContextMenu);
            
            // Prevent middle mouse button default behavior (auto-scroll)
            document.addEventListener('auxclick', (event) => {
                if (event.button === 1 && isOnTargetMap) {
                    event.preventDefault();
                }
            });
        }
    }
    
    // Remove mouse event listeners
    function removeMouseEventListeners() {
        if (mouseWheelHandler) {
            document.removeEventListener('wheel', mouseWheelHandler);
            mouseWheelHandler = null;
        }
        
        if (mouseDownHandler) {
            document.removeEventListener('mousedown', mouseDownHandler);
            mouseDownHandler = null;
        }
        
        if (mouseMoveHandler) {
            document.removeEventListener('mousemove', mouseMoveHandler);
            mouseMoveHandler = null;
        }
        
        if (mouseUpHandler) {
            document.removeEventListener('mouseup', mouseUpHandler);
            mouseUpHandler = null;
        }
        
        // Reset pan state
        isPanning = false;
        document.body.style.cursor = 'default';
    }
    
    // Update target map status
    function updateTargetMapStatus() {
        const newStatus = checkTargetMap();
        
        if (newStatus !== isOnTargetMap) {
            isOnTargetMap = newStatus;
            
            if (isOnTargetMap) {
                addMouseEventListeners();
            } else {
                removeMouseEventListeners();
            }
        }
    }
    
    // Hook into map setup
    const _Game_Map_setup = Game_Map.prototype.setup;
    Game_Map.prototype.setup = function(mapId) {
        _Game_Map_setup.call(this, mapId);
        updateTargetMapStatus();
        
        // Handle Mode 7 state if we're on the target map
        if (mapId === TARGET_MAP_ID) {
            setTimeout(() => {
                handleMode7StateChange();
            }, 100); // Small delay to ensure map is fully loaded
        }
    };
    
    // Hook into scene map start
    const _Scene_Map_start = Scene_Map.prototype.start;
    Scene_Map.prototype.start = function() {
        _Scene_Map_start.call(this);
        updateTargetMapStatus();
    };
    
    // Hook into scene map terminate to clean up
    const _Scene_Map_terminate = Scene_Map.prototype.terminate;
    Scene_Map.prototype.terminate = function() {
        removeMouseEventListeners();
        isOnTargetMap = false;
        _Scene_Map_terminate.call(this);
    };
    
    // Plugin command for manual zoom control
    PluginManager.registerCommand(pluginName, "setZoom", args => {
        if (typeof UltraMode7 !== 'undefined' && isOnTargetMap && isMode7Enabled()) {
            const distance = parseInt(args.distance) || 100;
            const frames = parseInt(args.frames) || ANIMATION_FRAMES;
            const clampedDistance = Math.max(MIN_DISTANCE, Math.min(MAX_DISTANCE, distance));
            UltraMode7.animateCameraDistance(clampedDistance, frames);
        }
    });
    
    PluginManager.registerCommand(pluginName, "zoomIn", args => {
        if (typeof UltraMode7 !== 'undefined' && isOnTargetMap && isMode7Enabled()) {
            const currentDistance = UltraMode7.getCameraDistance();
            const step = parseInt(args.step) || ZOOM_STEP;
            const frames = parseInt(args.frames) || ANIMATION_FRAMES;
            const newDistance = Math.max(currentDistance - step, MIN_DISTANCE);
            UltraMode7.animateCameraDistance(newDistance, frames);
        }
    });
    
    PluginManager.registerCommand(pluginName, "zoomOut", args => {
        if (typeof UltraMode7 !== 'undefined' && isOnTargetMap && isMode7Enabled()) {
            const currentDistance = UltraMode7.getCameraDistance();
            const step = parseInt(args.step) || ZOOM_STEP;
            const frames = parseInt(args.frames) || ANIMATION_FRAMES;
            const newDistance = Math.min(currentDistance + step, MAX_DISTANCE);
            UltraMode7.animateCameraDistance(newDistance, frames);
        }
    });
    
    // Plugin command for manual pan control
    PluginManager.registerCommand(pluginName, "panTo", args => {
        if (typeof UltraMode7 !== 'undefined' && isOnTargetMap && isMode7Enabled()) {
            const x = parseFloat(args.x) || 0;
            const y = parseFloat(args.y) || 0;
            
            if (UltraMode7.setCameraPosition) {
                UltraMode7.setCameraPosition(x, y);
            } else if (UltraMode7.setCameraX && UltraMode7.setCameraY) {
                UltraMode7.setCameraX(x);
                UltraMode7.setCameraY(y);
            }
        }
    });
    
    // =============================================================================
    // Options Menu Integration
    // =============================================================================
    
    // Add the option to ConfigManager
    Object.defineProperty(ConfigManager, OPTION_SYMBOL, {
        get: function() {
            return this._um7WorldmapEnabled;
        },
        set: function(value) {
            this._um7WorldmapEnabled = value;
            // Apply the setting immediately if we're on the target map
            if ($gameMap && $gameMap.mapId() === TARGET_MAP_ID) {
                handleMode7StateChange();
                updateTargetMapStatus();
            }
        },
        configurable: true
    });
    
    // Set default value
    ConfigManager._um7WorldmapEnabled = DEFAULT_ENABLED;
    
    // Hook into makeData to save the option
    const _ConfigManager_makeData = ConfigManager.makeData;
    ConfigManager.makeData = function() {
        const config = _ConfigManager_makeData.call(this);
        config[OPTION_SYMBOL] = this[OPTION_SYMBOL];
        return config;
    };
    
    // Hook into applyData to load the option
    const _ConfigManager_applyData = ConfigManager.applyData;
    ConfigManager.applyData = function(config) {
        _ConfigManager_applyData.call(this, config);
        this[OPTION_SYMBOL] = this.readFlag(config, OPTION_SYMBOL, DEFAULT_ENABLED);
    };
    
    // Hook into options window to add our option
    const _Window_Options_makeCommandList = Window_Options.prototype.makeCommandList;
    Window_Options.prototype.makeCommandList = function() {
        _Window_Options_makeCommandList.call(this);
        this.addCommand(OPTION_NAME, OPTION_SYMBOL);
    };
    
    // Hook into status text to show ON/OFF
    const _Window_Options_statusText = Window_Options.prototype.statusText;
    Window_Options.prototype.statusText = function(index) {
        const symbol = this.commandSymbol(index);
        if (symbol === OPTION_SYMBOL) {
            return this.booleanStatusText(this.getConfigValue(symbol));
        }
        return _Window_Options_statusText.call(this, index);
    };
    
    // Hook into processOk to handle boolean toggle
    const _Window_Options_processOk = Window_Options.prototype.processOk;
    Window_Options.prototype.processOk = function() {
        const index = this.index();
        const symbol = this.commandSymbol(index);
        if (symbol === OPTION_SYMBOL) {
            const value = this.getConfigValue(symbol);
            this.changeValue(symbol, !value);
            return;
        }
        _Window_Options_processOk.call(this);
    };
    
    // Hook into cursorRight for boolean options
    const _Window_Options_cursorRight = Window_Options.prototype.cursorRight;
    Window_Options.prototype.cursorRight = function() {
        const index = this.index();
        const symbol = this.commandSymbol(index);
        if (symbol === OPTION_SYMBOL) {
            this.changeValue(symbol, true);
            return;
        }
        _Window_Options_cursorRight.call(this);
    };
    
    // Hook into cursorLeft for boolean options
    const _Window_Options_cursorLeft = Window_Options.prototype.cursorLeft;
    Window_Options.prototype.cursorLeft = function() {
        const index = this.index();
        const symbol = this.commandSymbol(index);
        if (symbol === OPTION_SYMBOL) {
            this.changeValue(symbol, false);
            return;
        }
        _Window_Options_cursorLeft.call(this);
    };
    
})();
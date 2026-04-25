//=============================================================================
// MapTodoList.js
//=============================================================================

/*:
 * @target MZ
 * @plugindesc Map-based To-Do List system controlled by switches v1.4
 * @author Omni-Lex
 * @url https://your-url.com
 *
 * @help MapTodoList.js
 *
 * This plugin displays a to-do list on the top right of the screen.
 * Each to-do item is controlled by a switch. To-do lists are assigned
 * to specific maps and will change when the player enters those maps.
 * If a map has no assigned to-do list, the current list persists.
 *
 * Press H key to toggle between the hint window and the todo list.
 * The hint window says "Press H to open tutorial" and appears on maps
 * that have a TODO_LIST configured.
 *
 * Switch 75 controls the tutorial system:
 * - When Switch 75 is ON, both the hint and todo list are visible
 * - When Switch 75 is OFF, the hint is hidden but the todo list can still
 *   be opened with the H key (tooltip hidden)
 * 
 * On game load, the hint window will be shown by default on compatible maps
 * (if Switch 75 is ON).
 *
 * ============================================================================
 * Configuration
 * ============================================================================
 * You can change which switch controls the tutorial system by editing
 * the TUTORIAL_SWITCH_ID constant in the code (default: 75).
 * 
 * Edit the TODO_LISTS object in the code to configure your to-do lists.
 * Format:
 * "ListKey": {
 * title: { en: "English Title", it: "Italian Title" },
 * maps: [mapId1, mapId2, ...],
 * image: "ImageName", // Optional, from img/pictures/
 * tasks: [
 * { 
 * title: { en: "Task", it: "Compito" },
 * switchId: 1 
 * }
 * ]
 * }
 *
 * @param windowWidth
 * @text Window Width
 * @type number
 * @min 100
 * @max 600
 * @default 500
 * @desc Width of the to-do list window
 *
 * @param windowOpacity
 * @text Window Opacity
 * @type number
 * @min 0
 * @max 255
 * @default 220
 * @desc Opacity of the to-do list window (0-255)
 *
 * @param fontSize
 * @text Font Size
 * @type number
 * @min 12
 * @max 32
 * @default 18
 * @desc Font size for to-do list items
 *
 * @param showCompletedTasks
 * @text Show Completed Tasks
 * @type boolean
 * @default true
 * @desc Show tasks that have been completed (switch ON)
 *
 * @param completedTaskColor
 * @text Completed Task Color
 * @type number
 * @min 0
 * @max 31
 * @default 3
 * @desc Text color for completed tasks (system color index)
 *
 * @param incompleteTaskColor
 * @text Incomplete Task Color
 * @type number
 * @min 0
 * @max 31
 * @default 0
 * @desc Text color for incomplete tasks (system color index)
 *
 * @param showImages
 * @text Show List Images
 * @type boolean
 * @default true
 * @desc Show images above to-do lists
 *
 * @param imageHeight
 * @text Image Height
 * @type number
 * @min 50
 * @max 300
 * @default 100
 * @desc Height of the image displayed above the list
 *
 * @param tutorialOptionText
 * @text Tutorial Option Text
 * @type struct<TutorialText>
 * @default {"en":"Tutorial","it":"Tutorial"}
 * @desc Text for the tutorial option in the options menu
 *
 * @param tutorialOnText
 * @text Tutorial ON Text
 * @type struct<TutorialText>
 * @default {"en":"ON","it":"ATTIVO"}
 * @desc Text displayed when tutorial is ON
 *
 * @param tutorialOffText
 * @text Tutorial OFF Text
 * @type struct<TutorialText>
 * @default {"en":"OFF","it":"DISATTIVO"}
 * @desc Text displayed when tutorial is OFF
 *
 */

/*~struct~TutorialText:
 * @param en
 * @text English
 * @type text
 * @desc English text
 *
 * @param it
 * @text Italian
 * @type text
 * @desc Italian text
 */

/*:
 * @command showTodoList
 * @text Show Todo List
 * @desc Show the todo list window
 *
 * @command hideTodoList
 * @text Hide Todo List
 * @desc Hide the todo list window
 *
 * @command toggleTodoList
 * @text Toggle Todo List
 * @desc Toggle the visibility of the todo list window
 *
 * @command changeTodoList
 * @text Change Todo List
 * @desc Manually change to a specific todo list
 *
 * @arg listKey
 * @text List Key
 * @type text
 * @desc The key of the todo list to display (e.g., villageQuests, forestExploration, castleMissions)
 */

(() => {
    'use strict';
    
    const pluginName = "MapTodoList";
    const parameters = PluginManager.parameters(pluginName);
    const { TODO_LISTS } = window.HelpData;

    // Helper function to parse multilingual parameters
    function parseMultilingualParam(paramString, defaultValue) {
        if (!paramString) return defaultValue;
        try {
            return JSON.parse(paramString);
        } catch (e) {
            return defaultValue;
        }
    }

    // Parse parameters with proper defaults
    const config = {
        windowWidth: 380,
        windowOpacity: 240,
        fontSize: Number(parameters['fontSize']) || 18,
        showCompletedTasks: parameters['showCompletedTasks'] !== 'false',
        completedTaskColor: 1,
        incompleteTaskColor: Number(parameters['incompleteTaskColor']) || 0,
        showImages: parameters['showImages'] !== 'false',
        imageHeight: Number(parameters['imageHeight']) || 100,
        tutorialOptionText: parseMultilingualParam(parameters['tutorialOptionText'], {en: "Map hints", it: "Suggerimenti nella mappa"}),
        tutorialOnText: parseMultilingualParam(parameters['tutorialOnText'], {en: "ON", it: "ATTIVI"}),
        tutorialOffText: parseMultilingualParam(parameters['tutorialOffText'], {en: "OFF", it: "DISATTIVI"})
    };

    // CONFIGURATION: Change this to use a different switch for the tutorial system
    const TUTORIAL_SWITCH_ID = 75;


    //=========================================================================
    // CONFIGURATION - Edit your to-do lists here
    //=========================================================================


    //=========================================================================
    // TodoListManager - Core management system
    //=========================================================================
    //=========================================================================
    // ControlTagParser - Parse and display control tags based on input method
    //=========================================================================
    const ControlTagParser = {
        getCurrentInputMethod: function() {
            // Check if gamepad/controller input is being used
            const gamepads = navigator.getGamepads ? navigator.getGamepads() : [];
            for (let i = 0; i < gamepads.length; i++) {
                const gamepad = gamepads[i];
                if (gamepad) {
                    // Check if any gamepad buttons are pressed
                    for (let j = 0; j < gamepad.buttons.length; j++) {
                        if (gamepad.buttons[j].pressed) {
                            // Gamepad detected - lock in this input method
                            _detectedInputMethod = 'gamepad';
                            return 'gamepad';
                        }
                    }
                    // Check if any axes have significant movement
                    for (let j = 0; j < gamepad.axes.length; j++) {
                        if (Math.abs(gamepad.axes[j]) > 0.5) {
                            // Gamepad detected - lock in this input method
                            _detectedInputMethod = 'gamepad';
                            return 'gamepad';
                        }
                    }
                }
            }
            // Return the locked input method (don't revert to keyboard once gamepad is detected)
            return _detectedInputMethod;
        },

        parseControlText: function(text) {
            const inputMethod = this.getCurrentInputMethod();

            // Pattern: <keyboard: ... > <controller: ... >
            // Use non-greedy matching to get text between tags
            const pattern = /<keyboard:\s*(.+?)>\s*<controller:\s*(.+?)>/g;

            return text.replace(pattern, (match, keyboardText, controllerText) => {
                if (inputMethod === 'gamepad') {
                    return controllerText.trim();
                } else {
                    return keyboardText.trim();
                }
            });
        }
    };

    // Track detected input method globally (persists until reload)
    let _detectedInputMethod = 'keyboard';

    const TodoListManager = {
        _currentList: null,
        _showingTodoList: false, // false = showing hint, true = showing todo list
        _completedLists: new Set(), // Track which lists have been completed

        initialize: function() {
            this._currentList = null;
            this._showingTodoList = false;
            this._completedLists = new Set();
            // Don't reset _detectedInputMethod on initialize - it persists until reload
        },

        updateForMap: function(mapId) {
            // Find if this map has a todo list
            for (const key in TODO_LISTS) {
                if (TODO_LISTS[key].maps.includes(mapId)) {
                    this._currentList = key;
                    return;
                }
            }
            // Map doesn't have a list, clear current one
            this._currentList = null;
        },

        getCurrentList: function() {
            return this._currentList;
        },

        getCurrentListData: function() {
            return this._currentList ? TODO_LISTS[this._currentList] : null;
        },

        isTutorialActive: function() {
            return $gameSwitches && $gameSwitches.value(TUTORIAL_SWITCH_ID);
        },

        isShowingTodoList: function() {
            return this._showingTodoList;
        },

        isShowingHint: function() {
            return !this._showingTodoList;
        },

        // Check if current map has a todo list configured
        hasListForCurrentMap: function() {
            return this._currentList !== null;
        },

        // Check if all tasks in the current list are completed
        isCurrentListComplete: function() {
            if (!this._currentList) return false;

            const listData = TODO_LISTS[this._currentList];
            if (!listData || !listData.tasks) return false;

            // Check if all tasks have their switches ON
            return listData.tasks.every(task => {
                return $gameSwitches && $gameSwitches.value(task.switchId);
            });
        },

        // Mark a list as completed (so icon doesn't show again)
        markListAsCompleted: function(listKey) {
            this._completedLists.add(listKey);
        },

        // Check if a list has been marked as completed
        isListCompleted: function(listKey) {
            return this._completedLists.has(listKey);
        },

        toggle: function() {
            // Allow toggle if there's a list for this map (regardless of tutorial switch)
            if (this.hasListForCurrentMap()) {
                this._showingTodoList = !this._showingTodoList;
            }
        },

        show: function() {
            // Allow showing if there's a list for this map (regardless of tutorial switch)
            if (this.hasListForCurrentMap()) {
                this._showingTodoList = true;
            }
        },

        hide: function() {
            // Allow hiding if there's a list for this map (regardless of tutorial switch)
            if (this.hasListForCurrentMap()) {
                this._showingTodoList = false;
            }
        },

        manuallyChangeList: function(listKey) {
            if (TODO_LISTS[listKey]) {
                this._currentList = listKey;
                return true;
            }
            return false;
        },

        syncStateWithSwitch: function() {
            // On game load, default to showing hint (not todo list)
            this._showingTodoList = false;
        }
    };

    //=========================================================================
    // Window_TodoList - Display todo list
    //=========================================================================
    class Window_TodoList extends Window_Base {
        initialize() {
            const x = Graphics.boxWidth - config.windowWidth - 10;
            const y = 46;
            const width = config.windowWidth;
            const height = Graphics.boxHeight - 20;
            const rect = new Rectangle(x, y, width, height);
            super.initialize(rect);
            this.opacity = 0; // Remove background
            this.backOpacity = 0; // Remove background
            this._frameSprite.visible = false; // Hide border/frame
            this._currentListKey = null;
            this._imageSprite = null;
            this._refreshCounter = 0; // Counter for refresh timing
            this.visible = false; // Start hidden, let update() control visibility
            this._wasMenuOpen = false; // Track menu state transitions
            this.refresh();
        }

        update() {
            super.update();
            
            // Check if pause menu is open (menu scene is active)
            const menuOpen = SceneManager._scene && SceneManager._scene.constructor.name === 'Scene_Menu';

            // Track menu state transitions
            const menuJustClosed = this._wasMenuOpen && !menuOpen;
            this._wasMenuOpen = menuOpen;

            // If menu is open, hide immediately and skip all other logic
            if (menuOpen) {
                this.visible = false;
                return;
            }

            // Menu just closed - wait one frame before showing to prevent flicker
            if (menuJustClosed) {
                this.visible = false;
                return;
            }

            // Normal operation - determine visibility
            const shouldBeVisible = TodoListManager.isShowingTodoList() &&
                                   TodoListManager.hasListForCurrentMap();
            
            // Apply visibility state
            this.visible = shouldBeVisible;

            // Auto-refresh every 3 seconds (180 frames at 60fps)
            this._refreshCounter++;
            if (this._refreshCounter >= 60) {
                this._refreshCounter = 0;
                this.refresh();
            }
        }

        // Public methods for showing/hiding todo list from other plugins
        showTodoList() {
            this.visible = true;
            TodoListManager.show();
            this.refresh();
        }

        hideTodoList() {
            this.visible = false;
            TodoListManager.hide();
        }

        toggleTodoListVisibility() {
            if (this.visible) {
                this.hideTodoList();
            } else {
                this.showTodoList();
            }
        }

        refresh() {
            this.contents.clear();
            if (this._imageSprite) {
                this.removeChild(this._imageSprite);
                this._imageSprite = null;
            }

            const listKey = TodoListManager.getCurrentList();
            if (!listKey) return;

            const listData = TODO_LISTS[listKey];
            if (!listData) return;

            const lang = ConfigManager.language || 'en';
            let y = 0;

            // Draw tasks
            this.contents.fontSize = config.fontSize;
            for (const task of listData.tasks) {
                const isComplete = $gameSwitches ? $gameSwitches.value(task.switchId) : false;

                // Skip completed tasks if not showing them
                if (isComplete && !config.showCompletedTasks) continue;

                // Set color based on completion - only apply color 1 to completed tasks
                if (isComplete) {
                    this.changeTextColor(ColorManager.textColor(config.completedTaskColor));
                } else {
                    this.changeTextColor(ColorManager.textColor(config.incompleteTaskColor));
                }

                // Draw task text with wrapping
                let taskText = task.title[lang] || task.title.en;
                // Replace * with gender-based letter
                taskText = this.replaceGenderWildcard(taskText);
                // Parse control tags based on input method
                taskText = ControlTagParser.parseControlText(taskText);
                const textWidth = this.contents.width - 40;
                const wrappedLines = this.wrapText(taskText, textWidth);

                // Calculate the total height needed for this task (checkbox + text)
                const taskStartY = y;
                const taskEndY = y + (wrappedLines.length * this.lineHeight());

                // Draw semi-transparent black background for checkbox and text
                this.drawBackgroundRect(0, taskStartY, this.contents.width, taskEndY - taskStartY);

                // Draw checkbox on top of background
                const checkbox = isComplete ? "☑" : "☐";
                this.drawText(checkbox, 0, y, 30, 'left');

                for (let i = 0; i < wrappedLines.length; i++) {
                    this.drawText(wrappedLines[i], 40, y, textWidth);
                    y += this.lineHeight();
                }

                y += 5;
            }

            this.resetTextColor();
            this.contents.fontSize = this.standardFontSize();

            // Check if all tasks in this list are completed
            if (TodoListManager.isCurrentListComplete()) {
                // Mark this list as completed so icon doesn't show again
                TodoListManager.markListAsCompleted(listKey);
            }

            this._currentListKey = listKey;
        }

        drawBackgroundRect(x, y, width, height) {
            const bitmap = this.contents;
            const color = 'rgba(0, 0, 0, 0.9)'; // Black with 90% opacity

            // Save current fill style
            const previousFillStyle = bitmap._context.fillStyle;

            // Set fill style to semi-transparent black
            bitmap._context.fillStyle = color;

            // Draw rectangle
            bitmap._context.fillRect(x, y, width, height);

            // Restore previous fill style
            bitmap._context.fillStyle = previousFillStyle;
        }
        
        loadAndDisplayImage(imageName) {
            const bitmap = ImageManager.loadPicture(imageName);
            this._imageSprite = new Sprite(bitmap);
            
            bitmap.addLoadListener(() => {
                const scale = Math.min(
                    this.contents.width / bitmap.width,
                    config.imageHeight / bitmap.height
                );
                this._imageSprite.scale.x = scale;
                this._imageSprite.scale.y = scale;
                this._imageSprite.x = (this.contents.width - bitmap.width * scale) / 2;
                this._imageSprite.y = 0;
            });
            
            this.addChild(this._imageSprite);
        }
        
        lineHeight() {
            return config.fontSize + 8;
        }
        
        standardFontSize() {
            return config.fontSize;
        }

        wrapText(text, maxWidth) {
            const lines = [];
            const words = text.split(' ');
            let currentLine = '';

            for (const word of words) {
                const testLine = currentLine ? currentLine + ' ' + word : word;
                const textWidth = this.textWidth(testLine);

                if (textWidth > maxWidth && currentLine) {
                    lines.push(currentLine);
                    currentLine = word;
                } else {
                    currentLine = testLine;
                }
            }

            if (currentLine) {
                lines.push(currentLine);
            }

            return lines;
        }

        replaceGenderWildcard(text) {
            if (!text.includes('*')) {
                return text;
            }

            // Get gender from Variable 38
            const genderValue = $gameVariables ? $gameVariables.value(38) : 0;
            let replacement = '*';

            if (genderValue === 0) {
                replacement = 'o';
            } else if (genderValue === 1) {
                replacement = 'a';
            }
            // If genderValue >= 2, keep replacement as '*'

            return text.replace(/\*/g, replacement);
        }
    }

    //=========================================================================
    // Window_TodoHint - Display input method icon (keyboard or gamepad)
    //=========================================================================
    class Window_TodoHint extends Window_Base {
        initialize() {
            const width = 100;
            const height = 100;
            const x = Graphics.boxWidth - width - 10;
            const y = 10;
            const rect = new Rectangle(x, y, width, height);
            super.initialize(rect);
            this.opacity = 0; // Remove background
            this.backOpacity = 0; // Remove background
            this._frameSprite.visible = false; // Hide border/frame
            this._iconSprite = null;
            this._lastInputMethod = null; // Track last input method
            this.visible = false; // Start hidden, let update() control visibility
            this._wasMenuOpen = false; // Track menu state transitions
            this.refresh();
        }

        update() {
            super.update();
            
            // Check if pause menu is open (menu scene is active)
            const menuOpen = SceneManager._scene && SceneManager._scene.constructor.name === 'Scene_Menu';

            // Track menu state transitions
            const menuJustClosed = this._wasMenuOpen && !menuOpen;
            this._wasMenuOpen = menuOpen;

            // If menu is open, hide immediately and skip all other logic
            if (menuOpen) {
                this.visible = false;
                return;
            }

            // Menu just closed - wait one frame before showing to prevent flicker
            if (menuJustClosed) {
                this.visible = false;
                return;
            }

            // Normal operation - determine visibility
            const currentList = TodoListManager.getCurrentList();
            const shouldBeVisible = TodoListManager.hasListForCurrentMap() &&
                                   TodoListManager.isShowingHint() &&
                                   !TodoListManager.isListCompleted(currentList);
            
            // Apply visibility state
            this.visible = shouldBeVisible;

            // Check if input method has changed and refresh if needed
            const currentInputMethod = this.getCurrentInputMethod();
            if (currentInputMethod !== this._lastInputMethod) {
                this._lastInputMethod = currentInputMethod;
                this.refresh();
            }
        }

        getCurrentInputMethod() {
            // Check if gamepad/controller input is being used
            if (typeof Input !== 'undefined') {
                const gamepads = navigator.getGamepads ? navigator.getGamepads() : [];
                for (let i = 0; i < gamepads.length; i++) {
                    const gamepad = gamepads[i];
                    if (gamepad) {
                        // Check if any gamepad buttons are pressed
                        for (let j = 0; j < gamepad.buttons.length; j++) {
                            if (gamepad.buttons[j].pressed) {
                                // Gamepad detected - lock in this input method
                                _detectedInputMethod = 'gamepad';
                                return 'gamepad';
                            }
                        }
                        // Check if any axes have significant movement
                        for (let j = 0; j < gamepad.axes.length; j++) {
                            if (Math.abs(gamepad.axes[j]) > 0.5) {
                                // Gamepad detected - lock in this input method
                                _detectedInputMethod = 'gamepad';
                                return 'gamepad';
                            }
                        }
                    }
                }
            }

            // Return the locked input method (don't revert to keyboard once gamepad is detected)
            return _detectedInputMethod;
        }

        refresh() {
            this.contents.clear();
            if (this._iconSprite) {
                this.removeChild(this._iconSprite);
                this._iconSprite = null;
            }

            const inputMethod = this.getCurrentInputMethod();
            const imageName = inputMethod === 'gamepad' ? 'TodoIconPad' : 'TodoIconKeyboard';

            // Load and display the appropriate icon
            this.loadAndDisplayInputIcon(imageName);
        }

        loadAndDisplayInputIcon(imageName) {
            try {
                const bitmap = ImageManager.loadPicture(imageName);
                this._iconSprite = new Sprite(bitmap);

                bitmap.addLoadListener(() => {
                    // Scale icon to fit the window
                    const maxWidth = this.contents.width - 10;
                    const maxHeight = this.contents.height - 10;

                    const scale = Math.min(
                        maxWidth / bitmap.width,
                        maxHeight / bitmap.height,
                        1 // Don't scale up, only down
                    );

                    this._iconSprite.scale.x = scale;
                    this._iconSprite.scale.y = scale;

                    // Center the icon in the window
                    this._iconSprite.x = (this.contents.width - bitmap.width * scale) / 2;
                    this._iconSprite.y = (this.contents.height - bitmap.height * scale) / 2;
                });

                this.addChild(this._iconSprite);
            } catch (e) {
                console.log(`Failed to load icon ${imageName}:`, e);
                // Fallback: show text if icon fails to load
                this.drawFallbackText();
            }
        }

        drawFallbackText() {
            // Fallback text if icon images don't exist
            const lang = ConfigManager.language || 'en';
            const text = lang === 'it' ? "H - To do" : "H - To do list";

            this.changeTextColor(ColorManager.systemColor());
            const textWidth = this.textWidth(text);
            const x = (this.contents.width - textWidth) / 2;
            const y = (this.contents.height - this.lineHeight()) / 2;
            this.drawText(text, x, y, textWidth, 'center');
            this.resetTextColor();
        }
    }

    //=========================================================================
    // Window_Options - Add tutorial option
    //=========================================================================
    const _Window_Options_makeCommandList = Window_Options.prototype.makeCommandList;
    Window_Options.prototype.makeCommandList = function() {
        _Window_Options_makeCommandList.call(this);
        this.addTutorialOptions();
    };

    Window_Options.prototype.addTutorialOptions = function() {
        const lang = ConfigManager.language || 'en';
        const tutorialText = config.tutorialOptionText[lang] || config.tutorialOptionText.en;
        this.addCommand(tutorialText, 'tutorial');
    };

    const _Window_Options_statusText = Window_Options.prototype.statusText;
    Window_Options.prototype.statusText = function(index) {
        const symbol = this.commandSymbol(index);
        if (symbol === 'tutorial') {
            const lang = ConfigManager.language || 'en';
            const value = this.getConfigValue(symbol);
            return value 
                ? (config.tutorialOnText[lang] || config.tutorialOnText.en)
                : (config.tutorialOffText[lang] || config.tutorialOffText.en);
        }
        return _Window_Options_statusText.call(this, index);
    };

    const _Window_Options_booleanStatusText = Window_Options.prototype.booleanStatusText;
    Window_Options.prototype.booleanStatusText = function(value) {
        return _Window_Options_booleanStatusText.call(this, value);
    };

    //=========================================================================
    // ConfigManager - Handle tutorial option
    //=========================================================================
    const _ConfigManager_makeData = ConfigManager.makeData;
    ConfigManager.makeData = function() {
        const config = _ConfigManager_makeData.call(this);
        config.tutorial = this.tutorial;
        return config;
    };

    const _ConfigManager_applyData = ConfigManager.applyData;
    ConfigManager.applyData = function(config) {
        _ConfigManager_applyData.call(this, config);
        this.tutorial = this.readFlag(config, 'tutorial', false); // Default OFF
        // Sync tutorial option with the tutorial switch
        if ($gameSwitches) {
            $gameSwitches.setValue(TUTORIAL_SWITCH_ID, this.tutorial);
        }
    };

    ConfigManager.tutorial = false; // Default value

    // Intercept when tutorial option changes
    const _Window_Options_changeValue = Window_Options.prototype.changeValue;
    Window_Options.prototype.changeValue = function(symbol, value) {
        _Window_Options_changeValue.call(this, symbol, value);
        if (symbol === 'tutorial') {
            // Update the tutorial switch when tutorial option changes
            $gameSwitches.setValue(TUTORIAL_SWITCH_ID, value);
            // Refresh todo windows if they exist
            if (SceneManager._scene && SceneManager._scene._todoListWindow) {
                SceneManager._scene._todoListWindow.refresh();
            }
            if (SceneManager._scene && SceneManager._scene._todoHintWindow) {
                SceneManager._scene._todoHintWindow.refresh();
            }
        }
    };

    //=========================================================================
    // Input - Add custom key mapping for H key and Gamepad R1 button
    //=========================================================================
    Input.keyMapper[72] = 'todoToggle'; // H key

    // Map gamepad R1 button to todoToggle
    // Button 5 = R1 on standard gamepad layout
    if (!Input.gamepadMapper) {
        Input.gamepadMapper = {};
    }
    Input.gamepadMapper[5] = 'todoToggle';

    //=========================================================================
    // Scene_Map Integration
    //=========================================================================
    const _Scene_Map_start = Scene_Map.prototype.start;
    Scene_Map.prototype.start = function() {
        _Scene_Map_start.call(this);
        this.createTodoListWindow();
        this.createTodoHintWindow();
    };

    Scene_Map.prototype.createTodoListWindow = function() {
        if (!this._todoListWindow) {
            this._todoListWindow = new Window_TodoList();
            // Add to the windowLayer (standard windows)
            this.addWindow(this._todoListWindow);
            // Set z-index to be below other windows by placing behind in the layer
            this._windowLayer.setChildIndex(this._todoListWindow, 0);
        }
    };

    Scene_Map.prototype.createTodoHintWindow = function() {
        if (!this._todoHintWindow) {
            this._todoHintWindow = new Window_TodoHint();
            // Add to the windowLayer (standard windows)
            this.addWindow(this._todoHintWindow);
            // Set z-index to be below other windows by placing behind in the layer
            this._windowLayer.setChildIndex(this._todoHintWindow, 0);
        }
    };

    const _Scene_Map_update = Scene_Map.prototype.update;
    Scene_Map.prototype.update = function() {
        _Scene_Map_update.call(this);
        this.updateTodoListToggle();
    };

    Scene_Map.prototype.updateTodoListToggle = function() {
        // Toggle between hint and todo list with H key or gamepad R1 button
        let shouldToggle = false;

        // Check for H key press
        if (Input.isTriggered('todoToggle')) {
            shouldToggle = true;
        }

        // Also check for gamepad R1 button press directly (button 5)
        // This ensures it works even if gamepadMapper isn't properly set up
        const gamepads = navigator.getGamepads ? navigator.getGamepads() : [];
        let r1ButtonPressed = false;

        for (let i = 0; i < gamepads.length; i++) {
            const gamepad = gamepads[i];
            if (gamepad && gamepad.buttons[5] && gamepad.buttons[5].pressed) {
                r1ButtonPressed = true;
                // Store the last pressed state to detect transitions
                if (!this._lastGamepadR1Pressed) {
                    shouldToggle = true;
                }
                this._lastGamepadR1Pressed = true;
                break;
            }
        }

        // Reset the pressed state when button is released
        if (!r1ButtonPressed) {
            this._lastGamepadR1Pressed = false;
        }

        // Toggle if either input was triggered
        if (shouldToggle) {
            TodoListManager.toggle();
            if (this._todoListWindow) {
                this._todoListWindow.refresh();
            }
            if (this._todoHintWindow) {
                this._todoHintWindow.refresh();
            }
        }
    };

    //=========================================================================
    // Scene_Map - Ensure window persists on map change
    //=========================================================================
    const _Scene_Map_onMapLoaded = Scene_Map.prototype.onMapLoaded;
    Scene_Map.prototype.onMapLoaded = function() {
        _Scene_Map_onMapLoaded.call(this);
        if (this._todoListWindow) {
            this._todoListWindow.refresh();
        }
        if (this._todoHintWindow) {
            this._todoHintWindow.refresh();
        }
    };

    //=========================================================================
    // Game_Map - Update list when map changes
    //=========================================================================
    const _Game_Map_setup = Game_Map.prototype.setup;
    Game_Map.prototype.setup = function(mapId) {
        _Game_Map_setup.call(this, mapId);
        TodoListManager.updateForMap(mapId);
    };

    //=========================================================================
    // DataManager - Initialize on game start/load
    //=========================================================================
    const _DataManager_createGameObjects = DataManager.createGameObjects;
    DataManager.createGameObjects = function() {
        _DataManager_createGameObjects.call(this);
        TodoListManager.initialize();
    };

    const _DataManager_setupNewGame = DataManager.setupNewGame;
    DataManager.setupNewGame = function() {
        _DataManager_setupNewGame.call(this);
        TodoListManager.initialize();
        // Set tutorial switch based on tutorial config (default OFF)
        $gameSwitches.setValue(TUTORIAL_SWITCH_ID, ConfigManager.tutorial || false);
        
        // Initialize to show hint by default (not todo list)
        TodoListManager.syncStateWithSwitch();
        
        if ($gameMap) {
            TodoListManager.updateForMap($gameMap.mapId());
        }
    };

    const _DataManager_loadGame = DataManager.loadGame;
    DataManager.loadGame = function(savefileId) {
        const result = _DataManager_loadGame.call(this, savefileId);
        if (result) {
            TodoListManager.initialize();
            // Sync tutorial switch with tutorial config
            if ($gameSwitches && ConfigManager.tutorial !== undefined) {
                $gameSwitches.setValue(TUTORIAL_SWITCH_ID, ConfigManager.tutorial);
            }

            // Initialize to show hint by default (not todo list)
            TodoListManager.syncStateWithSwitch();
            
            if ($gameMap) {
                TodoListManager.updateForMap($gameMap.mapId());
            }
        }
        return result;
    };

    //=========================================================================
    // Plugin Commands
    //=========================================================================
    PluginManager.registerCommand(pluginName, "showTodoList", args => {
        TodoListManager.show();
        if (SceneManager._scene && SceneManager._scene._todoListWindow) {
            SceneManager._scene._todoListWindow.refresh();
        }
        if (SceneManager._scene && SceneManager._scene._todoHintWindow) {
            SceneManager._scene._todoHintWindow.refresh();
        }
    });

    PluginManager.registerCommand(pluginName, "hideTodoList", args => {
        TodoListManager.hide();
        if (SceneManager._scene && SceneManager._scene._todoListWindow) {
            SceneManager._scene._todoListWindow.refresh();
        }
        if (SceneManager._scene && SceneManager._scene._todoHintWindow) {
            SceneManager._scene._todoHintWindow.refresh();
        }
    });

    PluginManager.registerCommand(pluginName, "toggleTodoList", args => {
        TodoListManager.toggle();
        if (SceneManager._scene && SceneManager._scene._todoListWindow) {
            SceneManager._scene._todoListWindow.refresh();
        }
        if (SceneManager._scene && SceneManager._scene._todoHintWindow) {
            SceneManager._scene._todoHintWindow.refresh();
        }
    });

    PluginManager.registerCommand(pluginName, "changeTodoList", args => {
        const listKey = args.listKey;
        if (listKey && TodoListManager.manuallyChangeList(listKey)) {
            if (SceneManager._scene && SceneManager._scene._todoListWindow) {
                SceneManager._scene._todoListWindow.refresh();
            }
        }
    });

    // Debug command to manually show list (F8 console)
    window.showTodoList = function(listKey) {
        if (TODO_LISTS[listKey]) {
            TodoListManager.manuallyChangeList(listKey);
            if (SceneManager._scene._todoListWindow) {
                SceneManager._scene._todoListWindow.refresh();
            }
            console.log(`Manually activated: ${listKey}`);
        } else {
            console.log(`List "${listKey}" not found. Available:`, Object.keys(TODO_LISTS));
        }
    };

    window.hideTodoList = function() {
        TodoListManager.hide();
        if (SceneManager._scene._todoListWindow) {
            SceneManager._scene._todoListWindow.refresh();
        }
        if (SceneManager._scene._todoHintWindow) {
            SceneManager._scene._todoHintWindow.refresh();
        }
        console.log("TodoList hidden (showing hint)");
    };

    window.toggleTodoList = function() {
        TodoListManager.toggle();
        if (SceneManager._scene._todoListWindow) {
            SceneManager._scene._todoListWindow.refresh();
        }
        if (SceneManager._scene._todoHintWindow) {
            SceneManager._scene._todoHintWindow.refresh();
        }
        console.log(`TodoList ${TodoListManager.isShowingTodoList() ? 'shown' : 'hidden (showing hint)'}`);
    };

    // Expose window methods for other plugins
    window.getTodoListWindow = function() {
        return SceneManager._scene ? SceneManager._scene._todoListWindow : null;
    };

    window.showTodoListWindow = function() {
        const todoWindow = window.getTodoListWindow();
        if (todoWindow) {
            todoWindow.showTodoList();
            console.log("Todo list window shown");
        }
    };

    window.hideTodoListWindow = function() {
        const todoWindow = window.getTodoListWindow();
        if (todoWindow) {
            todoWindow.hideTodoList();
            console.log("Todo list window hidden");
        }
    };

    window.toggleTodoListWindow = function() {
        const todoWindow = window.getTodoListWindow();
        if (todoWindow) {
            todoWindow.toggleTodoListVisibility();
            console.log(`Todo list window ${todoWindow.visible ? 'shown' : 'hidden'}`);
        }
    };

 
})();
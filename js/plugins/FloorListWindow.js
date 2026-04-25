/*:
 * @target MZ
 * @plugindesc v1.5 Adds a "Floor List" window for selecting generated dungeon floors and setting variable #1. Shows floor display on map 3. <FloorListWindow>
 * @author OmniLex
 *
 * @command showFloorList
 * @text Show Floor List
 * @desc Opens a window listing all generated dungeon floors. Selecting one sets Variable 1 to that floor; cancel closes the window.
 *
 * @help
 * • Place this plugin **below** DungeonFloorSystem.  
 * • Call the plugin command "Show Floor List" or via script:
 *   `PluginManager.callCommand(null, "FloorListWindow", "showFloorList", {});`
 *
 * Behavior:
 * - Shows F0 - Hypernet point at the top (sets variable 17 to 0 when selected).
 * - Shows Hypermetro (sets variable 17 to -1 when selected).
 * - If no dungeon is generated yet, shows only "you are not worthy" (select to close).
 * - Floors ≤ max explored show as "F12 – Meadows" (map display name).
 * - Floors > max show as "???" (greyed out, skipped when navigating).
 * - Selecting a floor sets game variable #1 to that floor number.
 * - Uses display name from map data if available, otherwise falls back to map name.
 * - When on map 3, displays "Floor: X" in top right corner (X = variable 1).
 */

(() => {
    const PLUGIN_NAME   = "FloorListWindow";
    const MAX_FLOOR_VAR = window.DungeonFloorSystemParams?.maxFloorVariable || 0;
    const FLOOR_DISPLAY_MAP = 3; // Map ID where floor display appears
    const FLOOR_VARIABLE = 1;    // Variable that stores current floor
  
    PluginManager.registerCommand(PLUGIN_NAME, "showFloorList", () => {
        SceneManager.push(Scene_FloorList);
    });
  
    //--------------------------------------------------------------------------
    // Helper function to extract first map ID from comma-separated string
    //--------------------------------------------------------------------------
    function getFirstMapId(mapIdValue) {
        if (typeof mapIdValue === 'string' && mapIdValue.includes(',')) {
            return parseInt(mapIdValue.split(',')[0]);
        }
        return parseInt(mapIdValue);
    }

    //--------------------------------------------------------------------------
    // Helper function to load map display name
    //--------------------------------------------------------------------------
    function getMapDisplayName(mapId, callback) {
        // Extract first map ID if it's a comma-separated string
        const actualMapId = getFirstMapId(mapId);
        const filename = 'Map%1.json'.format(String(actualMapId).padZero(3));
        const xhr = new XMLHttpRequest();
        const url = 'data/' + filename;
        xhr.open('GET', url);
        xhr.overrideMimeType('application/json');
        xhr.onload = function() {
            if (xhr.status < 400) {
                const data = JSON.parse(xhr.responseText);
                callback(data.displayName || null);
            } else {
                callback(null);
            }
        };
        xhr.onerror = function() {
            callback(null);
        };
        xhr.send();
    }

    //--------------------------------------------------------------------------
    // Window_FloorDisplay - Always visible floor indicator
    //--------------------------------------------------------------------------
    class Window_FloorDisplay extends Window_Base {
        initialize() {
            const width = 200;
            const height = this.fittingHeight(1);
            const x = Graphics.boxWidth - width - 10;
            const y = 10;
            const rect = new Rectangle(x, y, width, height);
            Window_Base.prototype.initialize.call(this, rect);
            this.refresh();
        }

        refresh() {
            this.contents.clear();
            const floorNum = $gameVariables.value(FLOOR_VARIABLE);
            const text = `Floor: ${floorNum}`;
            this.drawText(text, 0, 0, this.contentsWidth(), "right");
        }

        update() {
            Window_Base.prototype.update.call(this);
            // Refresh if variable changed
            if (this._lastFloor !== $gameVariables.value(FLOOR_VARIABLE)) {
                this._lastFloor = $gameVariables.value(FLOOR_VARIABLE);
                this.refresh();
            }
        }
    }

    //--------------------------------------------------------------------------
    // Scene_Map - Add floor display window on map 3
    //--------------------------------------------------------------------------
    const _Scene_Map_createAllWindows = Scene_Map.prototype.createAllWindows;
    Scene_Map.prototype.createAllWindows = function() {
        _Scene_Map_createAllWindows.call(this);
        this.createFloorDisplayWindow();
    };

    Scene_Map.prototype.createFloorDisplayWindow = function() {
        if ($gameMap.mapId() === FLOOR_DISPLAY_MAP) {
            this._floorDisplayWindow = new Window_FloorDisplay();
            this.addWindow(this._floorDisplayWindow);
        }
    };

    const _Scene_Map_update = Scene_Map.prototype.update;
    Scene_Map.prototype.update = function() {
        _Scene_Map_update.call(this);
        // Check if we need to add/remove floor display window
        if ($gameMap.mapId() === FLOOR_DISPLAY_MAP && !this._floorDisplayWindow) {
            this.createFloorDisplayWindow();
        } else if ($gameMap.mapId() !== FLOOR_DISPLAY_MAP && this._floorDisplayWindow) {
            this.removeChild(this._floorDisplayWindow);
            this._floorDisplayWindow = null;
        }
    };

    //--------------------------------------------------------------------------
    // Window_FloorList
    //--------------------------------------------------------------------------
    class Window_FloorList extends Window_Selectable {
        initialize() {
            const ww = Graphics.boxWidth * 0.5;
            const wh = Graphics.boxHeight * 0.8;
            const wx = (Graphics.boxWidth - ww) / 2;
            const wy = (Graphics.boxHeight - wh) / 2;
            const rect = new Rectangle(wx, wy, ww, wh);
            Window_Selectable.prototype.initialize.call(this, rect);
            this._displayNamesLoaded = false;
            this.makeItemList();
            this.loadDisplayNames();
        }

        loadDisplayNames() {
            if (!$gameSystem.isDungeonGenerated()) {
                this._displayNamesLoaded = true;
                this.refresh();
                this.select(0);
                this.activate();
                return;
            }

            const floors = $gameSystem._dungeonFloors || [];
            const maxFloor = $gameVariables.value(MAX_FLOOR_VAR) || 0;
            let loadCount = 0;
            let totalToLoad = 0;

            // Count how many maps we need to load
            for (let i = 1; i < floors.length && i <= maxFloor; i++) {
                totalToLoad++;
            }

            if (totalToLoad === 0) {
                this._displayNamesLoaded = true;
                this.refresh();
                this.select(0);
                this.activate();
                return;
            }

            // Load display names for each floor
            for (let i = 1; i < floors.length && i <= maxFloor; i++) {
                const mapId = floors[i];
                const actualMapId = getFirstMapId(mapId); // Extract first map ID
                const dataIndex = this._data.findIndex(item => item.floor === i);
                
                getMapDisplayName(mapId, (displayName) => {
                    if (dataIndex >= 0 && displayName) {
                        this._data[dataIndex].label = `F${i} - ${displayName}`;
                    } else if (dataIndex >= 0 && !displayName) {
                        // Fallback: try to get map name from $dataMapInfos
                        const info = $dataMapInfos[actualMapId] || {};
                        const mapName = info.name || "Unknown";
                        this._data[dataIndex].label = `F${i} - ${mapName}`;
                    }
                    
                    loadCount++;
                    if (loadCount >= totalToLoad) {
                        this._displayNamesLoaded = true;
                        this.refresh();
                        this.select(0);
                        this.activate();
                    }
                });
            }
        }

        processOk() {
            const item = this._data[this.index()];
            if (item) {
                if (item.floor === 0) {
                    // F0 - Hypernet point
                    $gameVariables.setValue(17, 0);
                    $gameSwitches.setValue(29, true);

                } else if (item.floor === -1) {
                    // Hypermetro
                    $gameVariables.setValue(17, -1);
                    $gameSwitches.setValue(29, true);

                } 
                else if (item.floor === -22) {
                    // Omega city
                    $gameVariables.setValue(17, -22);
                    $gameSwitches.setValue(29, true);

                }
                else if (item.floor !== null) {
                    // Regular floors: set both variables and turn on switch 29
                    $gameVariables.setValue(17, item.floor);
                    $gameSwitches.setValue(29, true);
                }
            }
            SceneManager.pop();
        }

        makeItemList() {
            this._data = [];
            // Always add Hypermetro
            this._data.push({ floor: -22, label: "F-22 Hypermetro", isOmegaCity: true });
            this._data.push({ floor: -1, label: "F-1 Hypermetro", isHypermetro: true });

            // Always add F0 - Hypernet point at the top
            this._data.push({ floor: 0, label: "F0 - Hypernet point", isHypernet: true });
            
            
            if (!$gameSystem.isDungeonGenerated()) {
                this._data.push({ floor: null, label: "No other floors discovered" });
            } else {
                const maxFloor = $gameVariables.value(MAX_FLOOR_VAR) || 0;
                const floors   = $gameSystem._dungeonFloors || [];
                for (let i = 1; i < floors.length; i++) {
                    if (i <= maxFloor) {
                        const mapId = floors[i];
                        const actualMapId = getFirstMapId(mapId); // Extract first map ID
                        const info  = $dataMapInfos[actualMapId] || {};
                        
                        // Initially use map name, will be replaced with display name after loading
                        const name = info.name || "Unknown";
                        
                        this._data.push({ floor: i, label: `F${i} - ${name}` });
                    } else {
                        this._data.push({ floor: i, label: "???" });
                    }
                }
            }
        }
  
        maxItems() {
            return this._data ? this._data.length : 0;
        }
  
        itemHeight() {
            return this.lineHeight();
        }
  
        drawItem(index) {
            const item = this._data[index];
            const rect = this.itemRect(index);
            this.changePaintOpacity(this.isEnabled(index));
            this.drawText(item.label, rect.x, rect.y, rect.width, "left");
            this.changePaintOpacity(true);
        }
  
        isEnabled(index) {
            const item = this._data[index];
            if (!item) return false;
            if (item.floor === null) return true;
            if (item.floor === 0 && item.isHypernet) return true; // F0 is always enabled
            if (item.floor === -1 && item.isHypermetro) return true; // Hypermetro is always enabled
            if (item.floor === -22 && item.isOmegaCity) return true; // Hypermetro is always enabled

            const maxFloor = $gameVariables.value(MAX_FLOOR_VAR) || 0;
            return item.floor <= maxFloor;
        }
  
        // Ensure cursor never lands on disabled entries
        select(index) {
            let idx       = index;
            const last    = this.maxItems() - 1;
            const current = this.index();
            const dir     = idx > current ? 1 : -1;
            while (idx >= 0 && idx <= last && !this.isEnabled(idx)) {
                idx += dir;
            }
            if (idx >= 0 && idx <= last && this.isEnabled(idx)) {
                Window_Selectable.prototype.select.call(this, idx);
            }
        }
  
        currentFloor() {
            const item = this._data[this.index()];
            return item ? item.floor : null;
        }
  
        currentItem() {
            return this._data[this.index()];
        }
    }
  
    //--------------------------------------------------------------------------
    // Scene_FloorList
    //--------------------------------------------------------------------------
    class Scene_FloorList extends Scene_MenuBase {
        create() {
            super.create();
            this._window = new Window_FloorList();
            this._window.setHandler("ok",     this.onOk.bind(this));
            this._window.setHandler("cancel", this.onCancel.bind(this));
            this.addWindow(this._window);
        }
  
        onOk() {
            this._window.processOk();
        }
  
        onCancel() {
            this.popScene();
        }
    }
})();
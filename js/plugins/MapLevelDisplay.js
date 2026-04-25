/*:
 * @plugindesc Displays the median level of map encounters in the map name display.
 * @author Omni-Lex
 * @version 1.3.0
 * @target MZ
 * @help
 * ============================================================================
 * OmniLex - Map Level Display
 * ============================================================================
 *
 * This plugin automatically displays a median level for the current map
 * based on the random encounters defined for it.
 *
 * When the player enters a map, the plugin will calculate the median level
 * of all troop encounters and display it next to the map's name,
 * for example: "Whispering Woods Lv. 15".
 *
 * If a map has no display name set, the plugin will use the map's actual
 * name with any numeric prefix removed (e.g., "700 - Hardware store" 
 * becomes "Hardware store").
 *
 * --- How to Set Up Troop Levels ---
 *
 * To set a level for a troop, you must follow a specific rule:
 *
 * 1. For a given Troop ID (e.g., Troop #5 in the database), you must define
 * its level in the note box of the ENEMY with the SAME ID (e.g., Enemy #5).
 *
 * 2. The format in the enemy's note box must be:
 * <Level:XX>
 * (Where XX is the level number)
 *
 * For example, in the note box for Enemy #5:
 * <Level:17>
 *
 * The plugin will read this number. If a troop encounter on the map
 * (e.g., Troop #5) does not have a corresponding enemy with the same ID
 * (Enemy #5) or that enemy does not have a valid <Level:X> tag, it will be
 * ignored in the median calculation.
 *
 * If no valid troop levels can be found for a map, no level will be
 * displayed.
 *
 */

(() => {
    'use strict';

    // Alias Game_Map.setup to calculate the median level on map load.
    const _Game_Map_setup = Game_Map.prototype.setup;
    Game_Map.prototype.setup = function(mapId) {
        _Game_Map_setup.call(this, mapId);
        this.calculateMedianEncounterLevel();
    };

    // Add a new method to Game_Map to perform the calculation.
    Game_Map.prototype.calculateMedianEncounterLevel = function() {
        this._medianEncounterLevel = null;
        const encounterList = this.encounterList();
        if (!encounterList || encounterList.length === 0) {
            return;
        }

        const troopLevels = [];
        const levelRegex = /<Level:\s*(\d+)>/i;

        // Use a Set to only process unique troop IDs, as the median should be
        // based on the variety of troops, not encounter frequency.
        const uniqueTroopIds = new Set(encounterList.map(encounter => encounter.troopId));

        for (const troopId of uniqueTroopIds) {
            // Per the request, check the enemy with the same ID as the troop.
            const enemy = $dataEnemies[troopId];
            if (enemy && enemy.note) {
                const match = enemy.note.match(levelRegex);
                if (match && match[1]) {
                    troopLevels.push(parseInt(match[1], 10));
                }
            }
        }

        if (troopLevels.length > 0) {
            troopLevels.sort((a, b) => a - b);
            const mid = Math.floor(troopLevels.length / 2);
            let median;
            if (troopLevels.length % 2 === 0) {
                // Even number of levels: average the two middle ones and round.
                median = Math.round((troopLevels[mid - 1] + troopLevels[mid]) / 2);
            } else {
                // Odd number of levels: take the middle one.
                median = troopLevels[mid];
            }
            this._medianEncounterLevel = median;
        }
    };

    // Helper method to get the map name without numeric prefix
    Game_Map.prototype.getCleanMapName = function() {
        const mapInfo = $dataMapInfos[this._mapId];
        if (!mapInfo || !mapInfo.name) {
            return '';
        }
        // Remove numeric prefix pattern like "700 - " or "12 - " etc.
        return mapInfo.name.replace(/^\d+\s*-\s*/, '');
    };

    // Alias Game_Map.displayName to append the calculated level.
    const _Game_Map_displayName = Game_Map.prototype.displayName;
    Game_Map.prototype.displayName = function() {
        let mapName = _Game_Map_displayName.call(this);

        // If display name is empty, fallback to cleaned map name
        if (!mapName || mapName.trim() === '') {
            mapName = this.getCleanMapName();
        }

        // Check for hardcoded biome name overrides for procedural maps
        if (window.WorldGen && window.WorldGen.HARDCODED_BIOME_NAMES) {
            const procGenData = $gameSystem._procGenData;
            if (procGenData && procGenData.originX !== undefined && procGenData.originY !== undefined) {
                const coordKey = `${procGenData.originX},${procGenData.originY}`;
                if (window.WorldGen.HARDCODED_BIOME_NAMES[coordKey]) {
                    mapName = window.WorldGen.HARDCODED_BIOME_NAMES[coordKey];
                }
            }
        }

        // Check if the map has a name and a median level was calculated.
        if (mapName && this._medianEncounterLevel !== null) {
            return `${mapName} Lv. ${this._medianEncounterLevel}`;
        }
        return mapName;
    };

    //-----------------------------------------------------------------------------
    // Scene_Map
    //
    // Override the map name window creation to use our custom window.

    const _Scene_Map_createMapNameWindow = Scene_Map.prototype.createMapNameWindow;
    Scene_Map.prototype.createMapNameWindow = function() {
        // Use our custom window instead of the default one
        const rect = this.mapNameWindowRect();
        this._mapNameWindow = new Window_MapNameWithBorder(rect);
        this.addChild(this._mapNameWindow);
    };

    //-----------------------------------------------------------------------------
    // Window_MapNameWithBorder
    //
    // A custom window that displays the map name with proper window border.

    class Window_MapNameWithBorder extends Window_MapName {
        initialize(rect) {
            super.initialize(rect);
            this.opacity = 0;
            this.contentsOpacity = 0;
            this._showCount = 0;
        }

        update() {
            super.update();
            if (this._showCount > 0 && this.contentsOpacity < 255) {
                this.updateFadeIn();
            } else if (this._showCount <= 0 && this.contentsOpacity > 0) {
                this.updateFadeOut();
            }
        }

        updateFadeIn() {
            this.contentsOpacity += 16;
            this.opacity += 16;
        }

        updateFadeOut() {
            this.contentsOpacity -= 16;
            this.opacity -= 16;
        }

        open() {
            const text = $gameMap.displayName();
            if (text) {
                // Measure text width first with proper font settings
                this.resetFontSettings();
                const bitmap = new Bitmap(1, 1);
                bitmap.fontSize = this.contents.fontSize;
                const textWidth = bitmap.measureTextWidth(text);
                
                // Measure a sample word to get average word width
                const sampleWordWidth = bitmap.measureTextWidth("Sample");
                bitmap.destroy();
                
                // Calculate new window dimensions: add space for one extra word
                const padding = this.padding * 2;
                const oneWordSpace = sampleWordWidth + 100; // One word + spacing
                const newWidth = textWidth + padding + oneWordSpace;
                const x = 20;
                
                // Resize the window
                this.move(x, this.y, newWidth, this.height);
                
                // CRITICAL: Recreate contents bitmap after resizing
                this.createContents();
            }
            
            // Now refresh to draw the text
            this.refresh();
            this._showCount = 150;
            super.open();
        }

        close() {
            this._showCount = 0;
            super.close();
        }

        drawBackground(x, y, width, height) {
            // Use default RPG Maker MZ window background (drawn by base Window class)
            // The window skin will be applied automatically
        }

        refresh() {
            this.contents.clear();
            if (!$gameMap.displayName()) {
                return;
            }
            const text = $gameMap.displayName();
            const width = this.contentsWidth();
            const leftPadding = 6; // Small padding from the left edge
            this.drawText(text, leftPadding, 0, width - leftPadding, "left");
        }
    }

    // Make the class globally accessible
    window.Window_MapNameWithBorder = Window_MapNameWithBorder;

})();
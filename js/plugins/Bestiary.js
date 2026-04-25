
/*:
 * @target MZ
 * @plugindesc v1.4.0 - bestiary-style Monster Collection with complete bestiary.
 * @author Omni-Lex (Modified by OmniLex)
 * @url
 *
 * @help
 * =============================================================================
 * Monster CD Collection System (bestiary Style by OmniLex)
 * =============================================================================
 * * This plugin adds a bestiary-style collection system to track monsters encountered.
 * * Features:
 * - A bestiary-style menu showing a list of encountered monsters.
 * - Monster sprites are displayed fully, with their name underneath.
 * - Detailed monster information is shown in a separate panel.
 * - CD case accessible from main menu.
 * - Use monster abilities in battle from your CD collection.
 * - Each monster can be used once per battle.
 * * Plugin Commands:
 * - OpenCDCase - Opens the CD collection menu.
 * * =============================================================================
 * Terms of Use:
 * Free for both commercial and non-commercial use.
 * Credit is appreciated but not required.
 * =============================================================================
 * * @param menuText
 * @text CD Case Menu Text
 * @desc Text displayed in the main menu for the CD Case option
 * @default bestiary
 * * @command OpenCDCase
 * @text Open bestiary
 * @desc Opens the monster collection menu
 * */

(() => {
    'use strict';
    
    const pluginName = "Bestiary";
    
    //=============================================================================
    // Plugin Parameters
    //=============================================================================
    const requiredItemIds = [286, 600];
    //=============================================================================
    // Custom Parameter Names
    //=============================================================================
    const getShortParamName = function (paramId) {
        var shortParamNames = [
          "HP", "MP", "STR", "INT", "CON", "WIS", "DEX", "PSI",
        ];
        if (ConfigManager.language === "it") {
          shortParamNames = [
            "HP", "MP", "FRZ", "INT", "COS", "SAG", "DES", "PSI",
          ];
        }
        return shortParamNames[paramId] || "???";
    };
    
    //=============================================================================
    // Game_System - For storing encountered monsters
    //=============================================================================
    const _Game_System_initialize = Game_System.prototype.initialize;
    Game_System.prototype.initialize = function() {
        _Game_System_initialize.call(this);
        this._usedMonstersInBattle = [];
        this._encounteredMonsters = []; // Track which monsters have been seen in battle
    };
    
    Game_System.prototype.encounteredMonsters = function() {
        if (!this._encounteredMonsters) this._encounteredMonsters = [];
        return this._encounteredMonsters;
    };
    
    Game_System.prototype.markMonsterAsEncountered = function(enemyId) {
        if (!this._encounteredMonsters) this._encounteredMonsters = [];
        if (!this._encounteredMonsters.includes(enemyId)) {
            this._encounteredMonsters.push(enemyId);
        }
    };
    
    Game_System.prototype.isMonsterEncountered = function(enemyId) {
        return this.encounteredMonsters().includes(enemyId);
    };
    
    Game_System.prototype.resetUsedMonstersInBattle = function() {
        this._usedMonstersInBattle = [];
    };
    
    Game_System.prototype.markMonsterAsUsed = function(index) {
        if (!this._usedMonstersInBattle) this._usedMonstersInBattle = [];
        this._usedMonstersInBattle.push(index);
    };
    
    Game_System.prototype.isMonsterUsedInBattle = function(index) {
        if (!this._usedMonstersInBattle) this._usedMonstersInBattle = [];
        return this._usedMonstersInBattle.includes(index);
    };
    
    //=============================================================================
    // Register Plugin Commands
    //=============================================================================
    PluginManager.registerCommand(pluginName, "OpenCDCase", () => {
        SceneManager.push(Scene_CDCollection);
    });
    
    //=============================================================================
    // Add bestiary to Main Menu
    //=============================================================================
    const _Window_MenuCommand_addOriginalCommands = Window_MenuCommand.prototype.addOriginalCommands;
    Window_MenuCommand.prototype.addOriginalCommands = function() {
        _Window_MenuCommand_addOriginalCommands.call(this);
        
        // Check if player has any of the required items
        const hasRequiredItem = requiredItemIds.some(itemId => {
            const item = $dataItems[itemId];
            return item && $gameParty.hasItem(item);
        });
        
        this.addCommand(ConfigManager.language === 'it' ? "Bestiario" : "Bestiary", 'cdCase', hasRequiredItem, 43);
    };
        
    const _Scene_Menu_createCommandWindow = Scene_Menu.prototype.createCommandWindow;
    Scene_Menu.prototype.createCommandWindow = function() {
        _Scene_Menu_createCommandWindow.call(this);
        this._commandWindow.setHandler('cdCase', this.commandCDCase.bind(this));
    };
    
    Scene_Menu.prototype.commandCDCase = function() {
        SceneManager.push(Scene_CDCollection);
    };
    
    //=============================================================================
    // Track enemy encounters to mark them as seen
    //=============================================================================
    const _Game_Troop_setup = Game_Troop.prototype.setup;
    Game_Troop.prototype.setup = function(troopId) {
        _Game_Troop_setup.call(this, troopId);
        this.members().forEach(enemy => {
            if (enemy && enemy.isAlive()) {
                $gameSystem.markMonsterAsEncountered(enemy.enemyId());
            }
        });
    };
    
    //=============================================================================
    // CD Collection Scene (bestiary Scene)
    //=============================================================================
    function Scene_CDCollection() {
        this.initialize(...arguments);
    }
    
    Scene_CDCollection.prototype = Object.create(Scene_MenuBase.prototype);
    Scene_CDCollection.prototype.constructor = Scene_CDCollection;
    
    Scene_CDCollection.prototype.initialize = function() {
        Scene_MenuBase.prototype.initialize.call(this);
    };
    
    Scene_CDCollection.prototype.create = function() {
        Scene_MenuBase.prototype.create.call(this);
        this.createCDGridWindow();
        this.createCDDetailWindow();
    };
    
    Scene_CDCollection.prototype.createCDGridWindow = function() {
        const rect = this.cdGridWindowRect();
        this._cdGridWindow = new Window_CDGrid(rect);
        this._cdGridWindow.setHandler('ok', this.onCDSelect.bind(this));
        this._cdGridWindow.setHandler('cancel', this.popScene.bind(this));
        this.addWindow(this._cdGridWindow);
    };
    
    Scene_CDCollection.prototype.createCDDetailWindow = function() {
        const rect = this.cdDetailWindowRect();
        this._cdDetailWindow = new Window_CDDetail(rect);
        this.addWindow(this._cdDetailWindow);
        this._cdGridWindow.setDetailWindow(this._cdDetailWindow);
    };

    Scene_CDCollection.prototype.cdGridWindowRect = function () {
        const helpHeight = this.helpAreaHeight ? this.helpAreaHeight() : 0;
        const ww = Graphics.boxWidth;
        const wh = Graphics.boxHeight - helpHeight;
        const gridW = Math.floor(ww * 0.33);
        const wx = 0;
        const wy = helpHeight;
        return new Rectangle(wx, wy, gridW, wh);
    };

    Scene_CDCollection.prototype.cdDetailWindowRect = function () {
        const helpHeight = this.helpAreaHeight ? this.helpAreaHeight() : 0;
        const ww = Graphics.boxWidth;
        const wh = Graphics.boxHeight - helpHeight;
        const gridW = Math.floor(ww * 0.33);
        const detailW = ww - gridW;
        const wx = gridW;
        const wy = helpHeight;
        return new Rectangle(wx, wy, detailW, wh);
    };
    
    Scene_CDCollection.prototype.onCDSelect = function() {
        SoundManager.playOk();
        this._cdGridWindow.activate();
    };
    
    //=============================================================================
    // CD Grid Window -> Now a bestiary-style List Window
    //=============================================================================
    function Window_CDGrid() {
        this.initialize(...arguments);
    }
    
    Window_CDGrid.prototype = Object.create(Window_Selectable.prototype);
    Window_CDGrid.prototype.constructor = Window_CDGrid;
    
    Window_CDGrid.prototype.initialize = function(rect) {
        Window_Selectable.prototype.initialize.call(this, rect);
        this._data = [];
        this.refresh();
        this.select(0);
        this.activate();
    };
    
    Window_CDGrid.prototype.maxCols = function() {
        return 1;
    };
    
    Window_CDGrid.prototype.maxItems = function() {
        return this._data ? this._data.length : 0;
    };
    
    // MODIFIED: Increased item height to fit sprite and name underneath.
    Window_CDGrid.prototype.itemHeight = function() {
        return 52 + this.lineHeight();
    };
    
    Window_CDGrid.prototype.refresh = function() {
        this.makeItemList();
        Window_Selectable.prototype.refresh.call(this);
    };
    
    Window_CDGrid.prototype.makeItemList = function() {
        this._data = [];
        const allEnemies = $dataEnemies.filter(enemy => enemy && enemy.id > 0);
        
        allEnemies.forEach(enemy => {
            if ($gameSystem.isMonsterEncountered(enemy.id)) {
                this._data.push({
                    id: enemy.id,
                    name: enemy.name,
                    battlerName: enemy.battlerName,
                    enemy: enemy
                });
            }
        });
    };
    
    // MODIFIED: Draw name under the battler sprite.
    Window_CDGrid.prototype.drawItem = function(index) {
        const monster = this._data[index];
        if (monster) {
            const rect = this.itemRect(index);
            this.contents.clearRect(rect.x, rect.y, rect.width, rect.height);
    
            const spriteSize = 48;
            const spriteX = rect.x + (rect.width - spriteSize) / 2;
            const spriteY = rect.y + 4;
    
            if (monster.battlerName) {
                const bitmap = ImageManager.loadEnemy(monster.battlerName);
                bitmap.addLoadListener(() => {
                    this.contents.blt(
                        bitmap, 0, 0, bitmap.width, bitmap.height,
                        spriteX, spriteY, spriteSize, spriteSize
                    );
                });
            } else {
                this.drawDefaultMonsterIcon(spriteX + spriteSize / 2 - 16, spriteY + spriteSize / 2 - 16);
            }
    
            this.resetFontSettings();
            const nameY = spriteY + spriteSize;
            this.drawText(monster.name, rect.x, nameY, rect.width, 'center');
        }
    };
    
    Window_CDGrid.prototype.drawDefaultMonsterIcon = function(x, y) {
        const radius = 16;
        this.contents.fillRect(x, y, radius * 2, radius * 2, 'rgba(100, 200, 100, 0.8)');
    };
    
    Window_CDGrid.prototype.setDetailWindow = function(detailWindow) {
        this._detailWindow = detailWindow;
        this.callUpdateHelp();
    };
    
    Window_CDGrid.prototype.callUpdateHelp = function() {
        if (this.active && this._detailWindow) {
            this.updateHelp();
        }
    };
    
    Window_CDGrid.prototype.updateHelp = function() {
        if (this._detailWindow) {
            const monster = this._data[this.index()];
            this._detailWindow.setMonster(monster);
        }
    };
    
    Window_CDGrid.prototype.select = function(index) {
        Window_Selectable.prototype.select.call(this, index);
        this.callUpdateHelp();
    };
    
    Window_CDGrid.prototype.selectedMonster = function() {
        return this._data[this.index()];
    };
    
    //=============================================================================
    // CD Detail Window - Shows details of the selected CD
    //=============================================================================
    function Window_CDDetail() {
        this.initialize(...arguments);
    }
    
    Window_CDDetail.prototype = Object.create(Window_Base.prototype);
    Window_CDDetail.prototype.constructor = Window_CDDetail;
    
    Window_CDDetail.prototype.initialize = function(rect) {
        Window_Base.prototype.initialize.call(this, rect);
        this._monster = null;
        this.refresh();
    };
    
    Window_CDDetail.prototype.setMonster = function(monster) {
        if (this._monster !== monster) {
            this._monster = monster;
            this.refresh();
        }
    };
    
    // MODIFIED: Refactored drawing logic for Archetype and Biome to fix clipping and layout issues.
    Window_CDDetail.prototype.refresh = function () {
        this.contents.clear();
    
        if (!this._monster) {
          this.drawText("Select a monster to view details", 0, 0, this.innerWidth, "center");
          return;
        }
    
        const lineHeight = this.lineHeight();
        let y = 0;
        const x = 10;
        const width = this.innerWidth - x * 2;
    
        const noteData = this.parseMonsterNotes(this._monster.enemy.note);
    
        // Header
        let headerText = this._monster.enemy.name;
        if (noteData.level) headerText += ` (LV: ${noteData.level})`;
        this.drawText(headerText, 0, y, this.innerWidth, "center");
        y += lineHeight;
    
        this.drawHorzLine(y);
        y += 8;
    
        // Description
        if (noteData.description) {
            const textLines = this.wrapText(noteData.description, width);
            textLines.forEach(line => {
                this.drawText(line, x, y, width);
                y += lineHeight;
            });
            y += 8;
        }
    
        // Archetype and Biome
        const labelValueX = 120;
        const valueWidth = width - labelValueX;
    
        if (noteData.archetype) {
            this.changeTextColor(ColorManager.systemColor());
            this.drawText("Archetype:", x, y, labelValueX - x);
            this.resetTextColor();
            this.drawText(noteData.archetype, labelValueX+50, y, valueWidth);
            y += lineHeight;
        }
        
        if (noteData.biome) {
            this.changeTextColor(ColorManager.systemColor());
            this.drawText("Biome:", x, y, width); // Label on its own line
            this.resetTextColor();
            y += lineHeight;

            const biomeX = x + 20; // Indent biome list
            const biomeListWidth = width - 20;
            const textLines = this.wrapText(noteData.biome, biomeListWidth);
            textLines.forEach(line => {
                this.drawText(line, biomeX, y, biomeListWidth);
                y += lineHeight;
            });
        }
    
        y += lineHeight / 2;
        this.drawMonsterStats(y);
    };
    
    Window_CDDetail.prototype.parseMonsterNotes = function(notes) {
        const result = {
            level: null, description: null, character: null, archetype: null, biome: null
        };
        if (!notes) return result;

        // Extract level from <Level:X> tag
        const levelPattern = /<Level:\s*(\d+)>/i;
        const levelMatch = notes.match(levelPattern);
        if (levelMatch) {
            result.level = levelMatch[1];
        }

        // Handle description based on language
        if (ConfigManager.language === 'it') {
            // Italian description (takes priority)
            const itPattern = /<It:\s*([^>]+)>/i;
            const itMatch = notes.match(itPattern);
            if (itMatch) {
                result.description = itMatch[1].trim();
            }
        } else {
            // English description
            const enPattern = /<En:\s*([^>]+)>/i;
            const enMatch = notes.match(enPattern);
            if (enMatch) {
                result.description = enMatch[1].trim();
            }
        }

        // Extract character name (without the $ prefix in the capture group)
        const charPattern = /<Char:\$([^>]+)>/i;
        const charMatch = notes.match(charPattern);
        if (charMatch) result.character = charMatch[1].trim();

        // Extract archetype
        const archetypePattern = /<Archetype:\s*([^>]+)>/i;
        const archetypeMatch = notes.match(archetypePattern);
        if (archetypeMatch) result.archetype = archetypeMatch[1].trim();

        // Extract biome
        const biomePattern = /<Biome:\s*([^>]+)>/i;
        const biomeMatch = notes.match(biomePattern);
        if (biomeMatch) result.biome = biomeMatch[1].trim();

        return result;
    };

    Window_CDDetail.prototype.wrapText = function(text, width) {
        const result = [];
        if (!text) return result;
        let line = "";
        const words = text.split(" ");
        
        for (const word of words) {
            const testLine = line + (line.length > 0 ? " " : "") + word;
            const testWidth = this.textWidth(testLine);
            
            if (testWidth > width && line.length > 0) {
                result.push(line);
                line = word;
            } else {
                line = testLine;
            }
        }
        
        if (line.length > 0) result.push(line);
        return result;
    };
    
    Window_CDDetail.prototype.drawMonsterStats = function(y) {
        if (!this._monster) return y;
        
        const lineHeight = this.lineHeight();
        const enemy = this._monster.enemy;
        const params = enemy.params;
        
        if (params) {
            this.drawHorzLine(y);
            y += 8;
            
            this.changeTextColor(ColorManager.systemColor());
            this.drawText("Stats", 0, y, this.innerWidth, "center");
            this.resetTextColor();
            y += lineHeight;
            
            const colWidth = Math.floor((this.innerWidth - 40) / 2);
            const x1 = 20;
            const x2 = x1 + colWidth + 20;
            
            this.drawStatLine(getShortParamName(0), params[0], x1, y, colWidth);
            this.drawStatLine(getShortParamName(1), params[1], x2, y, colWidth);
            y += lineHeight;
            
            this.drawStatLine(getShortParamName(2), params[2], x1, y, colWidth);
            this.drawStatLine(getShortParamName(3), params[3], x2, y, colWidth);
            y += lineHeight;
            
            this.drawStatLine(getShortParamName(4), params[4], x1, y, colWidth);
            this.drawStatLine(getShortParamName(5), params[5], x2, y, colWidth);
            y += lineHeight;
            
            this.drawStatLine(getShortParamName(6), params[6], x1, y, colWidth);
            this.drawStatLine(getShortParamName(7), params[7], x2, y, colWidth);
            y += lineHeight;
        }
        
        return y;
    };
    
    Window_CDDetail.prototype.drawStatLine = function(label, value, x, y, width) {
        this.changeTextColor(ColorManager.systemColor());
        this.drawText(label + ":", x, y, width * 0.4);
        this.resetTextColor();
        this.drawText(value, x + width * 0.4, y, width * 0.6, 'right');
    };
    
    Window_CDDetail.prototype.drawHorzLine = function(y) {
        const lineY = y + this.lineHeight() / 2 - 1;
        this.contents.fillRect(0, lineY, this.innerWidth, 2, ColorManager.normalColor());
    };
    
    //=============================================================================
    // Battle Integration
    //=============================================================================
    const _BattleManager_initMembers = BattleManager.initMembers;
    BattleManager.initMembers = function() {
        _BattleManager_initMembers.call(this);
        $gameSystem.resetUsedMonstersInBattle();
    };
    
})();
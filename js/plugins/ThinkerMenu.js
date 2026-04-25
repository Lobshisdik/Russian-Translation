/*:
 * @target MZ
 * @plugindesc ThinkerMenu v1.2.0
 * @author Omni-Lex
 * @help
 * ============================================================================
 * ThinkerMenu Plugin for RPGMaker MZ
 * ============================================================================
 *
 * This plugin adds a crafting menu accessible from the main menu with
 * Assemble and Disassemble options.
 *
 * Items can have recipes defined in their note tags:
 * <Recipe: 575x2, 573x1>
 *
 * Items can have categories defined in their note tags:
 * <Category: Food>
 *
 * Items can be excluded from crafting with:
 * <Uncraftable>
 *
 * Where 575 is the item ID and x2 is the quantity required.
 *
 * NOTE: Items without a <Recipe> tag or with the <Uncraftable> tag cannot
 * be assembled or disassembled.
 *
 * @param menuName
 * @text Menu Name
 * @desc The name displayed in the main menu
 * @default Thinker
 * 
 * @param showInMenu
 * @text Show in Menu
 * @desc Show the Thinker option in the main menu
 * @type boolean
 * @default true
 * 
 * @command openThinkerMenu
 * @text Open Thinker Menu
 * @desc Opens the Thinker crafting menu
 * 
 */

(() => {
    'use strict';
    
    const pluginName = 'ThinkerMenu';
    const parameters = PluginManager.parameters(pluginName);
    const menuName = parameters['menuName'] || 'Thinker';
    const showInMenu = parameters['showInMenu'] === 'true';
    const requiredItemIds = [275, 6]; // Replace with your desired item IDs
    // Material definitions

    // Category icon mapping
    function getCategoryIcon(category) {
        switch(category) {
            case "Arctic": return 67;
            case "Artisan": return 188;
            case "Combat": return 334;
            case "Collectibles": return 210;
            case "Counterfeits": return 306;
            case "Enhancers": return 179;
            case "Espionage": return 130;
            case "Essentials": return 83;
            case "Food": return 265;
            case "Homeopathy": return 273;
            case "Jungle": return 277;
            case "Lifestyle": return 84;
            case "Magic": return 176;
            case "Medical": return 32;
            case "Monsters": return 293;
            case "Plants": return 182;
            case "Recovery": return 180;
            case "Survival": return 208;
            case "Trash": return 289;
            case "Misc": return 245;
            default: return 245; // Default to Misc icon
        }
    }
    
    // Parse recipe from item note
    function parseRecipe(item) {
        if (!item || !item.note) return null;
        const match = item.note.match(/<Recipe:\s*(.+?)>/i);
        if (!match) return null;
        
        const recipe = {};
        const parts = match[1].split(',');
        
        for (const part of parts) {
            const [id, qty] = part.trim().split('x');
            recipe[parseInt(id)] = parseInt(qty) || 1;
        }
        
        return recipe;
    }
    
    // Parse category from item note
    function parseCategory(item) {
        if (!item || !item.note) return "Misc";
        const match = item.note.match(/<Category:\s*(.+?)>/i);
        return match ? match[1].trim() : "Misc";
    }

    // Check if item is uncraftable
    function isUncraftable(item) {
        if (!item || !item.note) return false;
        return /<Uncraftable>/i.test(item.note);
    }
    
    // Check if player has materials for recipe
    function canCraft(recipe) {
        if (!recipe) return false;
        
        for (const [itemId, required] of Object.entries(recipe)) {
            if ($gameParty.numItems($dataItems[itemId]) < required) {
                return false;
            }
        }
        return true;
    }
    
    // Get all available categories with craftable counts
    function getAvailableCategories() {
        const categories = {};

        // Get all items with recipes
        for (const item of $dataItems) {
            if (!item || !parseRecipe(item) || isUncraftable(item)) continue;

            const category = parseCategory(item);
            if (!categories[category]) {
                categories[category] = {
                    total: 0,
                    craftable: 0
                };
            }

            categories[category].total++;
            if (canCraft(parseRecipe(item))) {
                categories[category].craftable++;
            }
        }

        return categories;
    }
    
    // Text localization
    function getText(key) {
        const texts = {
            'assemble': ConfigManager.language === 'it' ? 'Assembla' : 'Assemble',
            'disassemble': ConfigManager.language === 'it' ? 'Smonta' : 'Disassemble',
            'obtained': ConfigManager.language === 'it' ? 'Ottenuto:' : 'Obtained:',
            'selectItem': ConfigManager.language === 'it' ? 'Seleziona un oggetto da creare' : 'Select an item to craft',
            'craftableItems': ConfigManager.language === 'it' ? 'oggetti creabili' : 'craftable items'
        };
        return texts[key] || key;
    }
    
    // Plugin command
    PluginManager.registerCommand(pluginName, 'openThinkerMenu', args => {
        SceneManager.push(Scene_Thinker);
    });
    
    // Add to main menu
    if (showInMenu) {
        const _Window_MenuCommand_addMainCommands = Window_MenuCommand.prototype.addMainCommands;
        Window_MenuCommand.prototype.addMainCommands = function() {
            _Window_MenuCommand_addMainCommands.call(this);
            
            // Check if player has any of the required items
            const hasRequiredItem = requiredItemIds.some(itemId => {
                const item = $dataItems[itemId];
                return item && $gameParty.hasItem(item);
            });
            
            this.addCommand(menuName, 'thinker', hasRequiredItem, 151);
        };
        
        const _Scene_Menu_createCommandWindow = Scene_Menu.prototype.createCommandWindow;
        Scene_Menu.prototype.createCommandWindow = function() {
            _Scene_Menu_createCommandWindow.call(this);
            this._commandWindow.setHandler('thinker', this.commandThinker.bind(this));
        };
        
        Scene_Menu.prototype.commandThinker = function() {
            SceneManager.push(Scene_Thinker);
        };
    }
        
    // Save crafted items
    const _Game_System_initialize = Game_System.prototype.initialize;
    Game_System.prototype.initialize = function() {
        _Game_System_initialize.call(this);
        this._craftedItems = [];
    };
    
    Game_System.prototype.addCraftedItem = function(itemId) {
        if (!this._craftedItems) this._craftedItems = [];
        if (!this._craftedItems.includes(itemId)) {
            this._craftedItems.push(itemId);
        }
    };
    
    Game_System.prototype.hasCrafted = function(itemId) {
        if (!this._craftedItems) this._craftedItems = [];
        return this._craftedItems.includes(itemId);
    };
    
    // Make sure crafted items are loaded on save game load
    const _DataManager_extractSaveContents = DataManager.extractSaveContents;
    DataManager.extractSaveContents = function(contents) {
        _DataManager_extractSaveContents.call(this, contents);
        if ($gameSystem && !$gameSystem._craftedItems) {
            $gameSystem._craftedItems = [];
        }
    };
    
    // Scene_Thinker
    class Scene_Thinker extends Scene_MenuBase {
        create() {
            super.create();
            this.createHelpWindow();
            this.createCommandWindow();
            this.createCategoryWindow();
            this.createItemWindow();
            this.createResultWindow();
        }
        
        createCommandWindow() {
            const rect = this.commandWindowRect();
            this._commandWindow = new Window_ThinkerCommand(rect);
            this._commandWindow.setHandler('assemble', this.commandAssemble.bind(this));
            this._commandWindow.setHandler('disassemble', this.commandDisassemble.bind(this));
            this._commandWindow.setHandler('cancel', this.popScene.bind(this));
            this.addWindow(this._commandWindow);
        }
        
        createCategoryWindow() {
            const rect = this.categoryWindowRect();
            this._categoryWindow = new Window_ThinkerCategory(rect);
            this._categoryWindow.setHelpWindow(this._helpWindow);
            this._categoryWindow.setHandler('ok', this.onCategoryOk.bind(this));
            this._categoryWindow.setHandler('cancel', this.onCategoryCancel.bind(this));
            this._categoryWindow.hide();
            this._categoryWindow.deactivate();
            this.addWindow(this._categoryWindow);
        }
        
        createItemWindow() {
            const rect = this.itemWindowRect();
            this._itemWindow = new Window_ThinkerItem(rect);
            this._itemWindow.setHelpWindow(this._helpWindow);
            this._itemWindow.setHandler('ok', this.onItemOk.bind(this));
            this._itemWindow.setHandler('cancel', this.onItemCancel.bind(this));
            this._itemWindow.hide();
            this._itemWindow.deactivate();
            this.addWindow(this._itemWindow);
        }
        
        createResultWindow() {
            const rect = this.resultWindowRect();
            this._resultWindow = new Window_ThinkerResult(rect);
            this._resultWindow.hide();
            this._resultWindow.setHandler('ok', this.onResultOk.bind(this));
            this._resultWindow.setHandler('cancel', this.onResultOk.bind(this));
            this.addWindow(this._resultWindow);
        }
        
        resultWindowRect() {
            const width = 700;
            const height = this.calcWindowHeight(3, false);
            const x = (Graphics.boxWidth - width) / 2;
            const y = (Graphics.boxHeight - height) / 2;
            return new Rectangle(x, y, width, height);
        }
        
        commandWindowRect() {
            const wx = 0;
            const wy = this.mainAreaTop();
            const ww = Graphics.boxWidth;
            const wh = this.calcWindowHeight(2, true);
            return new Rectangle(wx, wy, ww, wh);
        }
        
        categoryWindowRect() {
            const wx = 0;
            const wy = this._commandWindow.y + this._commandWindow.height;
            const ww = Graphics.boxWidth;
            const wh = Graphics.boxHeight - wy;
            return new Rectangle(wx, wy, ww, wh);
        }
        
        itemWindowRect() {
            const wx = 0;
            const wy = this._commandWindow.y + this._commandWindow.height;
            const ww = Graphics.boxWidth;
            const wh = Graphics.boxHeight - wy;
            return new Rectangle(wx, wy, ww, wh);
        }
        
        commandAssemble() {
            this._mode = 'assemble';
            this._categoryWindow.setMode('assemble');
            this._categoryWindow.refresh();
            this._categoryWindow.show();
            this._categoryWindow.activate();
            this._categoryWindow.select(0);
        }
        
        commandDisassemble() {
            this._mode = 'disassemble';
            this._itemWindow.setMode('disassemble');
            this._itemWindow.setCategory(null);
            this._itemWindow.refresh();
            this._itemWindow.show();
            this._itemWindow.activate();
            this._itemWindow.selectLast();
        }
        
        onCategoryOk() {
            const category = this._categoryWindow.currentSymbol();
            this._itemWindow.setMode('assemble');
            this._itemWindow.setCategory(category);
            this._itemWindow.refresh();
            this._categoryWindow.hide();
            this._categoryWindow.deactivate();
            this._itemWindow.show();
            this._itemWindow.activate();
            this._itemWindow.selectLast();
        }
        
        onCategoryCancel() {
            this._categoryWindow.hide();
            this._categoryWindow.deactivate();
            this._commandWindow.activate();
        }
        
        onItemOk() {
            const item = this._itemWindow.item();
            if (!item) return;
            
            if (this._itemWindow._mode === 'assemble') {
                this.assembleItem(item);
            } else {
                this.disassembleItem(item);
            }
        }
        
        onItemCancel() {
            this._itemWindow.hide();
            this._itemWindow.deactivate();
            
            if (this._mode === 'assemble') {
                this._categoryWindow.show();
                this._categoryWindow.activate();
            } else {
                this._commandWindow.activate();
            }
        }
        
        assembleItem(item) {
            const recipe = parseRecipe(item);
            if (!recipe || !canCraft(recipe)) return;
            
            // Remove materials
            for (const [itemId, required] of Object.entries(recipe)) {
                $gameParty.loseItem($dataItems[itemId], required);
            }
            
            // Add crafted item
            $gameParty.gainItem(item, 1);
            $gameSystem.addCraftedItem(item.id);
            
            // Show result
            this._resultWindow.showCraftResult(item);
            this._itemWindow.deactivate();
            this._resultWindow.activate();
            
            // Play sound
            SoundManager.playUseItem();
        }
        
        disassembleItem(item) {
            if ($gameParty.numItems(item) <= 0) return;

            const recipe = parseRecipe(item);
            // Cannot disassemble items without recipes
            if (!recipe) return;

            // Cannot disassemble uncraftable items
            if (isUncraftable(item)) return;

            // Remove item
            $gameParty.loseItem(item, 1);
            
            // Return random materials
            const materials = Object.keys(recipe);
            const numReturned = Math.floor(Math.random() * 2) + 1; // 1-2 materials
            const returnedItems = [];
            
            for (let i = 0; i < numReturned && i < materials.length; i++) {
                const materialId = materials[Math.floor(Math.random() * materials.length)];
                const materialItem = $dataItems[materialId];
                $gameParty.gainItem(materialItem, 1);
                returnedItems.push(materialItem);
            }
            
            // Show result
            this._resultWindow.showDisassembleResult(item, returnedItems);
            this._itemWindow.deactivate();
            this._resultWindow.activate();
            
            // Play sound
            SoundManager.playUseItem();
        }
        
        onResultOk() {
            this._resultWindow.hide();
            this._resultWindow.deactivate();
            this._itemWindow.refresh();
            this._categoryWindow.refresh(); // Refresh category counts
            this._itemWindow.activate();
        }
    }
    
    // Window_ThinkerCommand
    class Window_ThinkerCommand extends Window_HorzCommand {
        maxCols() {
            return 2;
        }
        
        makeCommandList() {
            this.addCommand(getText('assemble'), 'assemble');
            this.addCommand(getText('disassemble'), 'disassemble');
        }
    }
    
    // Window_ThinkerCategory
    class Window_ThinkerCategory extends Window_Command {
        initialize(rect) {
            super.initialize(rect);
            this._mode = 'assemble';
        }
        
        setMode(mode) {
            this._mode = mode;
        }
        
        makeCommandList() {
            const categories = getAvailableCategories();
            
            // Sort categories alphabetically
            const sortedCategories = Object.keys(categories).sort();
            
            for (const category of sortedCategories) {
                const data = categories[category];
                const enabled = data.craftable > 0;
                this.addCommand(category, category, enabled, data);
            }
        }
        
        drawItem(index) {
            const rect = this.itemLineRect(index);
            const command = this._list[index];
            const category = command.name;
            const data = command.ext;
            
            this.changePaintOpacity(this.isCommandEnabled(index));
            
            // Draw icon
            const iconIndex = getCategoryIcon(category);
            this.drawIcon(iconIndex, rect.x, rect.y);
            
            // Draw category name
            const textX = rect.x + ImageManager.iconWidth + 4;
            const textWidth = rect.width - ImageManager.iconWidth - 4 - 80; // Reserve space for count
            this.drawText(category, textX, rect.y, textWidth);
            
            // Draw craftable count
            const countText = `${data.craftable}/${data.total}`;
            const countColor = data.craftable > 0 ? ColorManager.normalColor() : ColorManager.textColor(8);
            this.changeTextColor(countColor);
            this.drawText(countText, rect.x + rect.width - 80, rect.y, 80, 'right');
            
            this.changePaintOpacity(1);
            this.changeTextColor(ColorManager.normalColor());
        }
        
        updateHelp() {
            if (this.currentData()) {
                const category = this.currentSymbol();
                const data = this.currentData().ext;
                this._helpWindow.setText(`${category}: ${data.craftable}/${data.total} ${getText('craftableItems')}`);
            }
        }
    }
    
    // Window_ThinkerItem
    class Window_ThinkerItem extends Window_ItemList {
        initialize(rect) {
            super.initialize(rect);
            this._mode = 'assemble';
            this._category = null;
        }
        
        setMode(mode) {
            this._mode = mode;
        }
        
        setCategory(category) {
            this._category = category;
        }
        
        makeItemList() {
            if (this._mode === 'assemble') {
                // Get all items with recipes in the selected category
                this._data = $dataItems.filter(item => this.includes(item));
                // Sort by craftable first
                this._data.sort((a, b) => {
                    const canCraftA = canCraft(parseRecipe(a));
                    const canCraftB = canCraft(parseRecipe(b));
                    if (canCraftA && !canCraftB) return -1;
                    if (!canCraftA && canCraftB) return 1;
                    return 0;
                });
            } else {
                super.makeItemList();
            }
        }
        
        includes(item) {
            // Check if it's an item (not weapon or armor)
            if (!item || !DataManager.isItem(item)) return false;

            // Exclude uncraftable items
            if (isUncraftable(item)) return false;

            const recipe = parseRecipe(item);
            // Items without recipes cannot be crafted or disassembled
            if (!recipe) return false;

            if (this._mode === 'assemble') {
                // Check category filter
                if (this._category && parseCategory(item) !== this._category) {
                    return false;
                }
                return true;
            } else {
                // Show only owned items that have recipes (for disassembly)
                return $gameParty.numItems(item) > 0;
            }
        }
        
        isEnabled(item) {
            if (this._mode === 'assemble') {
                return canCraft(parseRecipe(item));
            } else {
                return $gameParty.numItems(item) > 0;
            }
        }
        
        maxCols() {
            return 1;
        }
        
        itemHeight() {
            if (this._mode === 'assemble') {
                // Increased height to accommodate 4x4 grid with padding
                return this.lineHeight() * 6; // Name + grid space + padding
            }
            return super.itemHeight();
        }
        
        drawItem(index) {
            const item = this.itemAt(index);
            if (item) {
                const rect = this.itemLineRect(index);
                this.changePaintOpacity(this.isEnabled(item));
                
                if (this._mode === 'assemble') {
                    this.drawAssembleItem(item, rect);
                } else {
                    this.drawItemName(item, rect.x, rect.y, rect.width);
                    this.drawItemNumber(item, rect.x, rect.y, rect.width);
                }
                
                this.changePaintOpacity(1);
            }
        }
        
        drawAssembleItem(item, rect) {
            const recipe = parseRecipe(item);
            const hasCrafted = $gameSystem.hasCrafted(item.id);
            const canCraftThis = canCraft(recipe);
            
            // Start drawing from the very top of the rect
            const topY = rect.y + 4; // Small padding from the very top
            
            // Draw item name or ??? at the top, spanning full width
            if (hasCrafted) {
                this.drawItemName(item, rect.x + 4, topY, rect.width - 8);
            } else {
                this.drawText('???', rect.x + 4, topY, rect.width - 8);
            }
            
            // Calculate ingredient list area - positioned below the item name
            const ingredientStartX = rect.x + rect.width / 2; // Right half of the rect
            const ingredientStartY = topY + this.lineHeight(); // One line below the item name
            const ingredientWidth = rect.width / 2 - 20; // Leave some margin
            
            // Draw recipe materials vertically, one below the other
            const materials = Object.entries(recipe);
            
            // Save current font size for material text
            const originalFontSize = this.contents.fontSize;
            this.contents.fontSize = Math.floor(originalFontSize * 0.75); // Slightly smaller font
            
            for (let i = 0; i < materials.length && i < 4; i++) { // Max 4 ingredients
                const [itemId, qty] = materials[i];
                const material = $dataItems[itemId];
                if (!material) continue;
                
                // Use smaller line height for ingredients to reduce spacing
                const ingredientLineHeight = Math.floor(this.lineHeight() * 0.8);
                const y = ingredientStartY + i * ingredientLineHeight;
                
                // Check if player has enough materials
                const owned = $gameParty.numItems(material);
                const hasEnough = owned >= qty;
                
                // Set color based on availability
                const materialColor = hasEnough ? ColorManager.normalColor() : ColorManager.textColor(2);
                this.changeTextColor(materialColor);
                
                // Draw material name and quantity
                const materialText = `${window.translateText(material.name)}: ${owned}/${qty}`;
                this.drawText(materialText, ingredientStartX, y, ingredientWidth);
            }
            
            // Restore original font size and color
            this.contents.fontSize = originalFontSize;
            this.changeTextColor(ColorManager.normalColor());
        }
        
        updateHelp() {
            if (this._mode === 'assemble') {
                const item = this.item();
                if (item && $gameSystem.hasCrafted(item.id)) {
                    this.setHelpWindowItem(item);
                } else {
                    this._helpWindow.setText(getText('selectItem'));
                }
            } else {
                this.setHelpWindowItem(this.item());
            }
        }
    }
    
    // Window_ThinkerResult
    class Window_ThinkerResult extends Window_Selectable {
        initialize(rect) {
            super.initialize(rect);
            this._data = [];
            this._showTimer = 0;
        }
        
        showCraftResult(item) {
            this._mode = 'craft';
            this._item = item;
            this._data = [item];
            this._showTimer = 90; // 1.5 seconds at 60fps
            this.refresh();
            this.show();
        }
        
        showDisassembleResult(item, materials) {
            this._mode = 'disassemble';
            this._item = item;
            this._data = materials;
            this._showTimer = 90; // 1.5 seconds at 60fps
            this.refresh();
            this.show();
        }
        
        update() {
            super.update();
            if (this._showTimer > 0) {
                this._showTimer--;
                if (this._showTimer === 0) {
                    this.callOkHandler();
                }
            }
        }
        
        refresh() {
            this.contents.clear();
            
            this.drawText(getText('obtained'), 0, 0, this.innerWidth, 'center');
            
            for (let i = 0; i < this._data.length; i++) {
                this.drawItemName(this._data[i], 0, this.lineHeight() * (i + 1), this.innerWidth);
            }
        }
        
        processOk() {
            // Do nothing - window auto-closes
        }
        
        processCancel() {
            // Do nothing - window auto-closes
        }
    }
    
    window.Scene_Thinker = Scene_Thinker;
})();
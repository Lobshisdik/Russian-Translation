/*:
 * @target MZ
 * @plugindesc Implements a cooking system that allows combining two recovery items for enhanced effects.
 * @author Omni-Lex
 * 
 * @param Play Recovery Sound
 * @type boolean
 * @desc Play recovery sound when cooking effect is applied
 * @default true
 * 
 * @param Recovery Sound
 * @type file
 * @dir audio/se/
 * @desc Sound effect to play when cooking effect is applied
 * @default Recovery
 * @parent Play Recovery Sound
 * 
 * @command openCookingMenu
 * @text Open Cooking Menu
 * @desc Opens the cooking menu where players can combine items
 * 
 * @command cookItems
 * @text Cook Items
 * @desc Combines two items from the player's inventory
 * @arg item1Id
 * @type number
 * @text First Item ID
 * @desc ID of the first item to combine
 * @arg item2Id
 * @type number
 * @text Second Item ID
 * @desc ID of the second item to combine
 * 
 * @help 
 * CookingSystem.js
 * 
 * This plugin implements a cooking system that allows players to combine
 * two recovery items (HP or MP) for enhanced effects. The first item's
 * recovery value is doubled, then the second item's recovery is added.
 * 
 * When cooking the same item with itself, a random adjective will be applied
 * with a bonus or penalty to the healing effect.
 * 
 * The cooked item name will be a combination of the first and second item names.
 * If an item has multiple words, it takes the first word of the first item and
 * the last word of the second item.
 * 
 * If two of the same item are used, the name will be "Random Adjective Item"
 * where the adjective determines if there's a bonus or penalty effect.
 * 
 * Plugin Commands:
 * - openCookingMenu: Opens the cooking menu interface
 * - cookItems: Directly combine specified items by their IDs
 * 
 * You can call these commands from event pages using the plugin command feature.
 */

(() => {
    'use strict';
    
    const pluginName = "CookingSystem";
    
    //=============================================================================
    // Plugin Parameters
    //=============================================================================
    const parameters = PluginManager.parameters(pluginName);
    const playRecoverySound = parameters['Play Recovery Sound'] === 'true';
    const recoverySoundName = parameters['Recovery Sound'] || 'Recovery';
    const requiredItemIds = [127,128]; // Replace with your desired item IDs

    //=============================================================================
    // i18n
    //=============================================================================
    let _cookingI18n = null;

    const _loadCookingI18n = async () => {
        const lang = ConfigManager.language || 'en';
        const url = `js/plugins/i18n/${lang}/cooking.json`;
        try {
            const response = await fetch(url);
            _cookingI18n = await response.json();
        } catch (e) {
            console.error('CookingSystem: Failed to load i18n data from ' + url, e);
        }
    };

    // Resolve a dot-path into _cookingI18n (e.g. 'cooking.ui.cookButton')
    const _ci18n = (path, vars) => {
        const parts = ('cooking.' + path).split('.');
        let val = _cookingI18n;
        for (const p of parts) { if (val) val = val[p]; }
        if (typeof val !== 'string') return path;
        if (vars) {
            val = val.replace(/\{(\w+)\}/g, (_, k) => (vars[k] !== undefined ? vars[k] : `{${k}}`));
        }
        return val;
    };

    // Load on boot
    _loadCookingI18n();
    //=============================================================================
    // Plugin Commands
    //=============================================================================
    PluginManager.registerCommand(pluginName, "openCookingMenu", args => {
        SceneManager.push(Scene_Cooking);
    });
    
    PluginManager.registerCommand(pluginName, "cookItems", args => {
        const item1Id = Number(args.item1Id);
        const item2Id = Number(args.item2Id);
        
        const item1 = $dataItems[item1Id];
        const item2 = $dataItems[item2Id];
        
        if (item1 && item2 && $gameParty.hasItem(item1) && $gameParty.hasItem(item2)) {
            CookingSystem.cookItems(item1, item2);
        } else {
            console.error("CookingSystem: Invalid items or not enough items in inventory");
        }
    });
    
    //=============================================================================
    // CookingSystem
    //=============================================================================
    const CookingSystem = {
        _item1: null,
        _item2: null,
        
        isFoodItem: function(item) {
            if (!item) return false;
            return item && item.meta && item.meta.category === "Food";
        },
        
        getRecoveryValues: function(item) {
            let hunger = 0;
            let tp = 0;
            let mp = 0;
            
            if (!item || !item.meta) return { hunger, tp, mp };
            
            // Extract food stats from meta tags
            const calories = item.meta.calories ? parseInt(item.meta.calories) : 0;
            const protein = item.meta.protein ? parseInt(item.meta.protein) : 0;
            const fat = item.meta.fat ? parseInt(item.meta.fat) : 0;
            
            hunger = calories;
            tp = protein;
            mp = fat;
            
            return { hunger, tp, mp };
        },
        
        createCookedItemName: function(item1, item2) {
            console.log("##",item1, item2)
            // If items are the same, use a random adjective
            if (item1 === item2) {
                return this.getRandomAdjectiveForSameItem() + " " + window.translateText(item1.name);
            }
            // Otherwise combine names as before
            
            const firstWord = window.translateText(item1.name).split(' ')[0];
            const lastWord = window.translateText(item2.name).split(' ').pop();
            return firstWord + " " + lastWord;
        },
        
        getRandomAdjectiveForSameItem: function() {
            // Randomly choose which type of adjective to use (positive, neutral, negative)
            const rand = Math.random();
            let adjectiveKey;

            if (rand < 0.35) {
                adjectiveKey = 'positive'; // 35% chance
                this._lastAdjectiveEffect = 'positive';
            } else if (rand < 0.75) {
                adjectiveKey = 'neutral';  // 40% chance
                this._lastAdjectiveEffect = 'neutral';
            } else {
                adjectiveKey = 'negative'; // 25% chance
                this._lastAdjectiveEffect = 'negative';
            }

            // Pull adjective list from i18n JSON
            const list = _cookingI18n &&
                _cookingI18n.cooking &&
                _cookingI18n.cooking.adjectives &&
                _cookingI18n.cooking.adjectives[adjectiveKey];

            if (list && list.length > 0) {
                return list[Math.floor(Math.random() * list.length)];
            }

            // Fallback plain labels if JSON not loaded yet
            return adjectiveKey;
        },
        
        getMultiplierForSameItem: function() {
            // Use the last adjective effect to determine the multiplier
            if (this._lastAdjectiveEffect === "positive") {
                return 1.5; // 50% bonus
            } else if (this._lastAdjectiveEffect === "neutral") {
                return 0.75; // 25% penalty
            } else {
                return 0.25; // 75% penalty
            }
        },
        
        cookItems: function(item1, item2) {

            // Remove items from inventory
            $gameParty.loseItem(item1, 1);
            $gameParty.loseItem(item2, 1);
            
            // Get plugin parameters from TimeDateSystem
            const params = PluginManager.parameters('TimeDateSystem');
            const maxHunger = Number(params['maxHunger'] || 100);
            const overeatMaxHunger = Number(params['overeatMaxHunger'] || 150);
            const overeatStateId = Number(params['overeatStateId'] || 41);
            const calorieFactor = Number(params['calorieFactor'] || 0.10);
            const proteinFactor = Number(params['proteinFactor'] || 2.00);
            const fatFactor = Number(params['fatFactor'] || 1.50);
            
            // Calculate nutritional values (hunger = calories, tp = protein, mp = fat)
            const item1Nutrition = this.getRecoveryValues(item1);
            const item2Nutrition = this.getRecoveryValues(item2);
            
            // Check if same item is used twice
            const isSameItem = item1 === item2;
            let multiplier = 1.0;
            
            if (isSameItem) {
                // For same item, use random adjective effect multiplier
                multiplier = this.getMultiplierForSameItem();
            }
            
            // Double first item's nutrition and add second item's nutrition (with potential modifier)
            let totalCalories = item1Nutrition.hunger * 2;
            let totalProtein = item1Nutrition.tp * 2;
            let totalFat = item1Nutrition.mp * 2;
            
            if (isSameItem) {
                totalCalories += item2Nutrition.hunger * multiplier;
                totalProtein += item2Nutrition.tp * multiplier;
                totalFat += item2Nutrition.mp * multiplier;
            } else {
                totalCalories += item2Nutrition.hunger;
                totalProtein += item2Nutrition.tp;
                totalFat += item2Nutrition.mp;
            }
            
            // Calculate hunger recovery using the same formula as TimeDateSystem
            const totalHungerRecovery = 
                (totalCalories * calorieFactor) + 
                (totalProtein * proteinFactor) + 
                (totalFat * fatFactor);
            
            // Split by party size
            const partySize = $gameParty.members().length;
            const hungerPerMember = totalHungerRecovery / partySize;
            
            // Apply recovery to all party members
            $gameParty.members().forEach(actor => {
                if (!actor) return;
                
                // Initialize hunger if not exists
                if (actor._hunger === undefined) {
                    actor._hunger = maxHunger;
                }
                
                const currentHunger = actor._hunger;
                let newHunger = currentHunger + hungerPerMember;
                
                // Cap at 100% - cooking never causes overeating
                newHunger = Math.min(maxHunger, newHunger);
                
                actor._hunger = newHunger;
            });
            
            // Create the cooked item name
            const cookedName = this.createCookedItemName(item1, item2);
            
            // Show message with recovery amounts and flavor text for same-item cooking
            let recoverMsg = _ci18n('messages.prepared', { name: cookedName });
            
            // Add flavor text for same item cooking
            if (isSameItem) {
                if (this._lastAdjectiveEffect === 'positive') {
                    recoverMsg += _ci18n('messages.sameItemPositive');
                } else if (this._lastAdjectiveEffect === 'neutral') {
                    recoverMsg += _ci18n('messages.sameItemNeutral');
                } else {
                    recoverMsg += _ci18n('messages.sameItemNegative');
                }
            }
            
            // Convert hunger to percentage (per member, after split)
            const hungerPercent = Math.floor((hungerPerMember / maxHunger) * 100);
            
            if (hungerPercent > 0) {
                recoverMsg += _ci18n('messages.recoveredHunger', { percent: hungerPercent });
            }
            
            recoverMsg += _ci18n('messages.splitAmong', { count: partySize });
            window.skipLocalization = true;

            $gameMessage.add(recoverMsg);
            window.skipLocalization = false;

            
            // Play recovery sound if enabled
            if (playRecoverySound) {
                AudioManager.playSe({
                    name: recoverySoundName,
                    pan: 0,
                    pitch: 100,
                    volume: 90
                });
            }
            
            // Clear selected items
            this._item1 = null;
            this._item2 = null;
            
            // Refresh the screen - corrected to use proper RPG Maker MZ method
            $gameMap.requestRefresh();
            
            // If we're in a scene with refreshStatus, call it
            if (SceneManager._scene && SceneManager._scene.refreshStatus) {
                SceneManager._scene.refreshStatus();
            }
        },
        
        getAvailableRecoveryItems: function() {
            return $gameParty.items().filter(item => this.isFoodItem(item));
        },
        
        setFirstItem: function(item) {
            this._item1 = item;
        },
        
        setSecondItem: function(item) {
            this._item2 = item;
        },
        
        clearSelectedItems: function() {
            this._item1 = null;
            this._item2 = null;
        },
        
        getFirstItem: function() {
            return this._item1;
        },
        
        getSecondItem: function() {
            return this._item2;
        }
    };
    
    window.CookingSystem = CookingSystem;
    
    //=============================================================================
    // Scene_Cooking
    //=============================================================================
    function Scene_Cooking() {
        this.initialize(...arguments);
    }
    
    Scene_Cooking.prototype = Object.create(Scene_MenuBase.prototype);
    Scene_Cooking.prototype.constructor = Scene_Cooking;
    
    Scene_Cooking.prototype.initialize = function() {
        Scene_MenuBase.prototype.initialize.call(this);
        CookingSystem.clearSelectedItems();
    };
    
    Scene_Cooking.prototype.create = function() {
        Scene_MenuBase.prototype.create.call(this);
        this.createHelpWindow();
        this.createItemListWindow();
        this.createConfirmWindow();
    };
    
    Scene_Cooking.prototype.createHelpWindow = function() {
        this._helpWindow = new Window_Help(new Rectangle(0, 0, Graphics.boxWidth, this.calcWindowHeight(2, false)));
        this.addWindow(this._helpWindow);
        this.updateHelpMessage();
    };
    
    Scene_Cooking.prototype.createItemListWindow = function() {
        const y = this._helpWindow.height;
        const height = Graphics.boxHeight - y - this.calcWindowHeight(2, false);
        
        this._itemListWindow = new Window_CookingItemList(new Rectangle(0, y, Graphics.boxWidth, height));
        this._itemListWindow.setHandler("ok", this.onItemOk.bind(this));
        this._itemListWindow.setHandler("cancel", this.onItemCancel.bind(this));
        this._itemListWindow.refresh();
        this._itemListWindow.activate();
        this._itemListWindow.select(0);
        this.addWindow(this._itemListWindow);
    };
    
    Scene_Cooking.prototype.createConfirmWindow = function() {
        const y = Graphics.boxHeight - this.calcWindowHeight(2, false);
        this._confirmWindow = new Window_CookingConfirm(new Rectangle(0, y, Graphics.boxWidth, this.calcWindowHeight(2, false)));
        this._confirmWindow.setHandler("cook", this.onCookOk.bind(this));
        this._confirmWindow.setHandler("cancel", this.onCookCancel.bind(this));
        this._confirmWindow.deactivate();
        this.addWindow(this._confirmWindow);
    };
    
    Scene_Cooking.prototype.onItemOk = function() {
        const selectedItem = this._itemListWindow.item();
        
        if (!CookingSystem.getFirstItem()) {
            // First item selection
            CookingSystem.setFirstItem(selectedItem);
            this.updateHelpMessage();
            this._itemListWindow.refresh();
            this._itemListWindow.activate();
        } else {
            // Second item selection
            CookingSystem.setSecondItem(selectedItem);
            
            // Check if we have enough of the same item if selecting it twice
            if (CookingSystem.getFirstItem() === selectedItem && $gameParty.numItems(selectedItem) < 2) {
                SoundManager.playBuzzer();
                this._itemListWindow.activate();
                return;
            }
            
            // Update confirm window and activate it
            this._confirmWindow.refresh();
            this._itemListWindow.deactivate();
            this._confirmWindow.activate();
            this._confirmWindow.select(0);
            this.updateHelpMessage();
        }
    };
    
    Scene_Cooking.prototype.onItemCancel = function() {
        if (CookingSystem.getFirstItem()) {
            // If we've selected the first item, clear it
            CookingSystem.clearSelectedItems();
            this.updateHelpMessage();
            this._itemListWindow.refresh();
            this._itemListWindow.activate();
        } else {
            // Otherwise, exit the scene
            this.popScene();
        }
    };
    
    Scene_Cooking.prototype.updateHelpMessage = function() {
        if (!CookingSystem.getFirstItem()) {
            this._helpWindow.setText(_ci18n('ui.selectFirstIngredient'));
        } else if (!CookingSystem.getSecondItem()) {
            this._helpWindow.setText(_ci18n('ui.selectSecondIngredient', { name: CookingSystem.getFirstItem().name }));
        } else {
            const item1 = CookingSystem.getFirstItem();
            const item2 = CookingSystem.getSecondItem();
            const cookedName = CookingSystem.createCookedItemName(item1, item2);
            this._helpWindow.setText(_ci18n('ui.confirmCook', { item1: item1.name, item2: item2.name, result: cookedName }));
        }
    };
    
    Scene_Cooking.prototype.refreshStatus = function() {
        if (this._itemListWindow) this._itemListWindow.refresh();
    };
    
    Scene_Cooking.prototype.onCookOk = function() {
        const item1 = CookingSystem.getFirstItem();
        const item2 = CookingSystem.getSecondItem();
        
        if (item1 && item2 && 
            $gameParty.hasItem(item1) && 
            $gameParty.hasItem(item2)) {
            
            // Check if both items are the same and we have at least 2
            if (item1 === item2 && $gameParty.numItems(item1) < 2) {
                SoundManager.playBuzzer();
                this._confirmWindow.activate();
                return;
            }
            
            // Cook the items
            CookingSystem.cookItems(item1, item2);
            
            // Clear selections and close all menus to return to map
            CookingSystem.clearSelectedItems();
            SceneManager.pop();
            SceneManager.pop();
        } else {
            SoundManager.playBuzzer();
            this._confirmWindow.activate();
        }
    };
    
    Scene_Cooking.prototype.onCookCancel = function() {
        this._confirmWindow.deactivate();
        CookingSystem.setSecondItem(null);
        this.updateHelpMessage();
        this._itemListWindow.activate();
    };
    
    //=============================================================================
    // Window_CookingItemList
    //=============================================================================
    function Window_CookingItemList() {
        this.initialize(...arguments);
    }
    
    Window_CookingItemList.prototype = Object.create(Window_ItemList.prototype);
    Window_CookingItemList.prototype.constructor = Window_CookingItemList;
    
    Window_CookingItemList.prototype.initialize = function(rect) {
        Window_ItemList.prototype.initialize.call(this, rect);
        this._category = "item";
        this.refresh();
    };
    
    Window_CookingItemList.prototype.includes = function(item) {
        return item && item.itypeId === 1 && CookingSystem.isFoodItem(item) 
    };
    
    Window_CookingItemList.prototype.isEnabled = function(item) {
        if (!item) return false;
        
        const firstItem = CookingSystem.getFirstItem();
        if (!firstItem) return true;
        
        // If selecting the same item, check if we have enough
        if (item === firstItem) {
            return $gameParty.numItems(item) >= 2;
        }
        
        return true;
    };
    
    Window_CookingItemList.prototype.drawItem = function(index) {
        const item = this.itemAt(index);
        if (item) {
            const rect = this.itemLineRect(index);
            const firstItem = CookingSystem.getFirstItem();
            
            // Highlight the first selected item
            if (item === firstItem) {
                this.changePaintOpacity(true);
                this.contents.fillRect(rect.x, rect.y, rect.width, rect.height, 'rgba(255, 255, 128, 0.3)');
            }
            
            this.changePaintOpacity(this.isEnabled(item));
            this.drawItemName(item, rect.x, rect.y, rect.width);
            this.drawItemNumber(item, rect.x, rect.y, rect.width);
        }
    };
    
    Window_CookingItemList.prototype.needsNumber = function() {
        return true;
    };
    
    Window_CookingItemList.prototype.maxCols = function() {
        return 1;
    };
    
    //=============================================================================
    // Window_CookingConfirm
    //=============================================================================
    function Window_CookingConfirm() {
        this.initialize(...arguments);
    }
    
    Window_CookingConfirm.prototype = Object.create(Window_HorzCommand.prototype);
    Window_CookingConfirm.prototype.constructor = Window_CookingConfirm;
    
    Window_CookingConfirm.prototype.initialize = function(rect) {
        Window_HorzCommand.prototype.initialize.call(this, rect);
        this.refresh();
    };
    
    Window_CookingConfirm.prototype.makeCommandList = function() {
        const item1 = CookingSystem.getFirstItem();
        const item2 = CookingSystem.getSecondItem();
        this.addCommand(_ci18n('ui.cookButton'),   'cook',   item1 && item2);
        this.addCommand(_ci18n('ui.cancelButton'), 'cancel');
    };
    
    Window_CookingConfirm.prototype.maxCols = function() {
        return 2;
    };
    
    // =============================================================================
    // ASCII Mode Compatibility
    // =============================================================================
    
    const _Scene_Cooking_start = Scene_Cooking.prototype.start;
    Scene_Cooking.prototype.start = function() {
        if (_Scene_Cooking_start) _Scene_Cooking_start.call(this);
        else Scene_MenuBase.prototype.start.call(this);
        
        if (window.AsciiMode && window.AsciiMode.active !== 0) {
            window.AsciiMode.createCanvas();
            if (window.AsciiMode.canvas) window.AsciiMode.canvas.style.display = 'block';
            
            // Deactivate and hide normal windows
            if (this._helpWindow) { this._helpWindow.deactivate(); this._helpWindow.hide(); }
            if (this._itemListWindow) { this._itemListWindow.deactivate(); this._itemListWindow.hide(); }
            if (this._confirmWindow) { this._confirmWindow.deactivate(); this._confirmWindow.hide(); }
            
            this._selectedIndex = 0;
            this._activeWindow = 'list'; // 'list', 'confirm'
            this._selectedConfirmIndex = 0; // 0: Cook, 1: Cancel
        }
    };
    
    const _Scene_Cooking_update = Scene_Cooking.prototype.update;
    Scene_Cooking.prototype.update = function() {
        if (window.AsciiMode && window.AsciiMode.active !== 0) {
            this.updateAsciiCookingInput();
            this.renderAsciiCooking();
            Scene_Base.prototype.update.call(this);
            return;
        }
        if (_Scene_Cooking_update) _Scene_Cooking_update.call(this);
        else Scene_MenuBase.prototype.update.call(this);
    };
    
    const _Scene_Cooking_terminate = Scene_Cooking.prototype.terminate;
    Scene_Cooking.prototype.terminate = function() {
        if (window.AsciiMode && window.AsciiMode.canvas) {
            window.AsciiMode.canvas.style.display = 'none';
        }
        if (_Scene_Cooking_terminate) _Scene_Cooking_terminate.call(this);
        else Scene_MenuBase.prototype.terminate.call(this);
    };
    
    Scene_Cooking.prototype.updateAsciiCookingInput = function() {
        const list = CookingSystem.getAvailableRecoveryItems();
        
        if (this._activeWindow === 'list') {
            if (list.length === 0) {
                if (Input.isTriggered('cancel')) {
                    SceneManager.pop();
                    SoundManager.playCancel();
                }
                return;
            }
            if (Input.isRepeated('down')) {
                this._selectedIndex = (this._selectedIndex + 1) % list.length;
                SoundManager.playCursor();
            }
            if (Input.isRepeated('up')) {
                this._selectedIndex = (this._selectedIndex - 1 + list.length) % list.length;
                SoundManager.playCursor();
            }
            if (Input.isTriggered('ok')) {
                const selectedItem = list[this._selectedIndex];
                
                if (!CookingSystem.getFirstItem()) {
                    CookingSystem.setFirstItem(selectedItem);
                    SoundManager.playOk();
                } else {
                    CookingSystem.setSecondItem(selectedItem);
                    
                    if (CookingSystem.getFirstItem() === selectedItem && $gameParty.numItems(selectedItem) < 2) {
                        SoundManager.playBuzzer();
                        CookingSystem.setSecondItem(null);
                    } else {
                        this._activeWindow = 'confirm';
                        this._selectedConfirmIndex = 0;
                        SoundManager.playOk();
                    }
                }
            }
            if (Input.isTriggered('cancel')) {
                if (CookingSystem.getFirstItem()) {
                    CookingSystem.clearSelectedItems();
                    SoundManager.playCancel();
                } else {
                    SceneManager.pop();
                    SoundManager.playCancel();
                }
            }
        } else if (this._activeWindow === 'confirm') {
            if (Input.isRepeated('right') || Input.isRepeated('left')) {
                this._selectedConfirmIndex = (this._selectedConfirmIndex + 1) % 2;
                SoundManager.playCursor();
            }
            if (Input.isTriggered('ok')) {
                if (this._selectedConfirmIndex === 0) { // Cook
                    const item1 = CookingSystem.getFirstItem();
                    const item2 = CookingSystem.getSecondItem();
                    if (item1 && item2 && $gameParty.hasItem(item1) && $gameParty.hasItem(item2)) {
                        if (item1 === item2 && $gameParty.numItems(item1) < 2) {
                            SoundManager.playBuzzer();
                        } else {
                            CookingSystem.cookItems(item1, item2);
                            CookingSystem.clearSelectedItems();
                            SceneManager.pop();
                            SceneManager.pop();
                        }
                    } else {
                        SoundManager.playBuzzer();
                    }
                } else { // Cancel
                    this._activeWindow = 'list';
                    CookingSystem.setSecondItem(null);
                    SoundManager.playCancel();
                }
            }
            if (Input.isTriggered('cancel')) {
                this._activeWindow = 'list';
                CookingSystem.setSecondItem(null);
                SoundManager.playCancel();
            }
        }
    };
    
    Scene_Cooking.prototype.renderAsciiCooking = function() {
        const ctx = window.AsciiMode.context;
        const canvas = window.AsciiMode.canvas;
        if (!ctx || !canvas) return;

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#000000';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        const fontSize = window.AsciiMode.fontSize;
        ctx.font = `${fontSize}px ${window.AsciiMode.fontFamily}`;

        // Header
        ctx.fillStyle = '#FFD700';
        ctx.textAlign = 'center';
        ctx.fillText("--- COOKING ---", canvas.width / 2, 30);

        // Help Text
        ctx.fillStyle = '#FFFFFF';
        let helpText = "Select ingredients.";
        const item1 = CookingSystem.getFirstItem();
        const item2 = CookingSystem.getSecondItem();
        
        if (!item1) {
            helpText = _ci18n('ui.selectFirstIngredient');
        } else if (!item2) {
            helpText = _ci18n('ui.selectSecondIngredient', { name: item1.name });
        } else {
            const resultName = CookingSystem.createCookedItemName(item1, item2);
            helpText = _ci18n('ui.confirmCook', { item1: item1.name, item2: item2.name, result: resultName });
        }
        ctx.fillText(helpText, canvas.width / 2, 70);

        // List
        const list = CookingSystem.getAvailableRecoveryItems();
        const listY = 120;
        const listX = 50;

        ctx.textAlign = 'left';
        for (let i = 0; i < list.length; i++) {
            const item = list[i];
            const y = listY + i * (fontSize + 10);

            const isSelected = this._selectedIndex === i && this._activeWindow === 'list';
            const isFirstSelected = item1 === item;
            
            if (isSelected) {
                ctx.fillStyle = '#FF0000';
                ctx.fillText(`> ${item.name}`, listX, y);
            } else if (isFirstSelected) {
                ctx.fillStyle = '#00FFFF';
                ctx.fillText(`* ${item.name}`, listX, y);
            } else {
                ctx.fillStyle = '#FFFFFF';
                ctx.fillText(`  ${item.name}`, listX, y);
            }

            ctx.fillStyle = '#FFFF00';
            ctx.fillText(`x${$gameParty.numItems(item)}`, listX + 300, y);
        }

        // Details
        const selectedItem = list[this._selectedIndex];
        if (selectedItem) {
            this.renderCookingItemDetails(selectedItem, 450, listY);
        }

        // Confirm Box
        if (this._activeWindow === 'confirm') {
            const boxWidth = 400;
            const boxHeight = 100;
            const bX = (canvas.width - boxWidth) / 2;
            const bY = (canvas.height - boxHeight) / 2;

            ctx.fillStyle = 'rgba(0, 0, 0, 0.9)';
            ctx.fillRect(bX, bY, boxWidth, boxHeight);
            ctx.strokeStyle = '#FFFFFF';
            ctx.strokeRect(bX, bY, boxWidth, boxHeight);

            ctx.fillStyle = '#FFFFFF';
            ctx.textAlign = 'center';
            ctx.fillText("Cook these items?", canvas.width / 2, bY + 30);

            const options = [
                `[ ${_ci18n('ui.cookButton')} ]`,
                `[ ${_ci18n('ui.cancelButton')} ]`
            ];
            for (let i = 0; i < options.length; i++) {
                const x = bX + (i + 1) * (boxWidth / 3);
                if (this._selectedConfirmIndex === i) {
                    ctx.fillStyle = '#FF0000';
                } else {
                    ctx.fillStyle = '#FFFF00';
                }
                ctx.fillText(options[i], x, bY + 70);
            }
        }
    };
    
    Scene_Cooking.prototype.renderCookingItemDetails = function(item, x, y) {
        const ctx = window.AsciiMode.context;
        const fontSize = window.AsciiMode.fontSize;
        const lineHeight = fontSize + 6;
        let currentY = y;

        ctx.fillStyle = '#FFD700';
        ctx.textAlign = 'left';
        ctx.fillText(item.name, x, currentY);
        currentY += lineHeight;

        ctx.strokeStyle = '#FFFFFF';
        ctx.beginPath();
        ctx.moveTo(x, currentY);
        ctx.lineTo(x + 300, currentY);
        ctx.stroke();
        currentY += 10;

        ctx.fillStyle = '#FFFFFF';

        const calories = item.meta.calories ? item.meta.calories : "0";
        const protein = item.meta.protein ? item.meta.protein : "0";
        const fat = item.meta.fat ? item.meta.fat : "0";

        this.drawCookingKeyValue("Calories", calories, x, currentY);
        currentY += lineHeight;
        this.drawCookingKeyValue("Protein", protein, x, currentY);
        currentY += lineHeight;
        this.drawCookingKeyValue("Fat", fat, x, currentY);
        currentY += lineHeight;
    };
    
    Scene_Cooking.prototype.drawCookingKeyValue = function(key, value, x, y) {
        const ctx = window.AsciiMode.context;
        ctx.fillStyle = '#00FFFF';
        ctx.fillText(key + ":", x, y);
        ctx.fillStyle = '#FFFFFF';
        ctx.fillText(value, x + 100, y);
    };

    //=============================================================================
    // Scene_Menu additions
    //=============================================================================
    const _Scene_Menu_createCommandWindow = Scene_Menu.prototype.createCommandWindow;
    Scene_Menu.prototype.createCommandWindow = function() {
        _Scene_Menu_createCommandWindow.call(this);
        this._commandWindow.setHandler("cooking", this.commandCooking.bind(this));
    };
    
    Scene_Menu.prototype.commandCooking = function() {
        SceneManager.push(Scene_Cooking);
    };
    
    //=============================================================================
    // Window_MenuCommand additions to add cooking to the menu
    //=============================================================================
    const _Window_MenuCommand_addOriginalCommands = Window_MenuCommand.prototype.addOriginalCommands;
    Window_MenuCommand.prototype.addOriginalCommands = function() {
        _Window_MenuCommand_addOriginalCommands.call(this);
        
        // Check if player has any of the required items
        const hasRequiredItem = requiredItemIds.some(itemId => {
            const item = $dataItems[itemId];
            return item && $gameParty.hasItem(item);
        });
        
        this.addCommand(_ci18n('ui.menuLabel'), 'cooking', hasRequiredItem, 265);
    };
})();
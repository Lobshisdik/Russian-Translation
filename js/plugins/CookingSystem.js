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
        
        // Adjective lists for same-item cooking
        _positiveAdjectives: [
            "Well-Cooked", "Delicious", "Gourmet", "Masterful", "Mystic", 
            "Divine", "Perfect", "Succulent", "Extraordinary", "Magical"
        ],
        
        _neutralAdjectives: [
            "Plain", "Simple", "Ordinary", "Basic", "Standard", 
            "Regular", "Common", "Modest", "Unassuming", "Everyday"
        ],
        
        _negativeAdjectives: [
            "Charred", "Ruined", "Overcooked", "Burnt", "Spoiled", 
            "Questionable", "Dubious", "Suspicious", "Failed", "Disastrous"
        ],
        _positiveAdjectivesIt: [
            "Ben cucinato",
            "Delizioso",
            "Gourmet",
            "Magistrale",
            "Mistico",
            "Divino",
            "Perfetto",
            "Succulento",
            "Straordinario",
            "Magico"
        ],
        
        _neutralAdjectivesIt: [
            "Anodino",
            "Semplice",
            "Ordinario",
            "Di base",
            "Standard",
            "Regolare",
            "Comune",
            "Modesto",
            "Discreto",
            "Quotidiano"
        ],
        
        _negativeAdjectivesIt: [
            "Carbonizzato",
            "Rovinato",
            "Stracotto",
            "Bruciato",
            "Avariato",
            "Dubbio",
            "Dubitoso",
            "Sospetto",
            "Fallito",
            "Disastroso"
        ],
        
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
            let adjective;
            const useTranslation = ConfigManager.language === 'it'

            if (rand < 0.35) {
                // Positive adjective (35% chance)
                if(useTranslation){
                    adjective = this._positiveAdjectivesIt[Math.floor(Math.random() * this._positiveAdjectives.length)];

                }else{
                    adjective = this._positiveAdjectives[Math.floor(Math.random() * this._positiveAdjectives.length)];

                }
                this._lastAdjectiveEffect = "positive";
            } else if (rand < 0.75) {
                // Neutral adjective (40% chance)
                if(useTranslation){
                    adjective = this._neutralAdjectivesIt[Math.floor(Math.random() * this._neutralAdjectives.length)];

                }else{
                    adjective = this._neutralAdjectives[Math.floor(Math.random() * this._neutralAdjectives.length)];

                }
                this._lastAdjectiveEffect = "neutral";
            } else {
                // Negative adjective (25% chance)
                if(useTranslation){
                    adjective = this._negativeAdjectivesIt[Math.floor(Math.random() * this._negativeAdjectives.length)];

                }else{
                    adjective = this._negativeAdjectives[Math.floor(Math.random() * this._negativeAdjectives.length)];

                }
                this._lastAdjectiveEffect = "negative";
            }
            
            return adjective;
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
            const useTranslation = ConfigManager.language === 'it'

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
            let recoverMsg = useTranslation?"Hai preparato "+ cookedName + "!":"You prepared " + cookedName + "!";
            
            // Add flavor text for same item cooking
            if (isSameItem) {
                if (this._lastAdjectiveEffect === "positive") {
                    recoverMsg += useTranslation?"\nÈ venuto eccezionalmente bene!":"\nIt turned out exceptionally well!";
                } else if (this._lastAdjectiveEffect === "neutral") {
                    recoverMsg += useTranslation?"\nNon è niente di speciale, ma commestibile.":"\nIt's nothing special, but edible.";
                } else {
                    recoverMsg += useTranslation?"\nForse non avresti dovuto provarlo...":"\nPerhaps you shouldn't have tried that...";
                }
            }
            
            // Convert hunger to percentage (per member, after split)
            const hungerPercent = Math.floor((hungerPerMember / maxHunger) * 100);
            
            if (hungerPercent > 0) {
                recoverMsg += useTranslation?"\nRecuperati " + hungerPercent + "% Fame per membro":"\nRecovered " + hungerPercent + "% Hunger per member";
            }
            

            recoverMsg += useTranslation?" (diviso tra " + partySize + " membri)":" (split among " + partySize + " members)";
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
        const useTranslation = ConfigManager.language === 'it'

        if (!CookingSystem.getFirstItem()) {
            this._helpWindow.setText(useTranslation?"Seleziona il primo ingrediente da cucinare":"Select first ingredient to cook");
        } else if (!CookingSystem.getSecondItem()) {
            this._helpWindow.setText(useTranslation?"Seleziona il secondo ingrediente da cucinare":"Select second ingredient to cook with " + CookingSystem.getFirstItem().name);
        } else {
            const item1 = CookingSystem.getFirstItem();
            const item2 = CookingSystem.getSecondItem();
            const cookedName = CookingSystem.createCookedItemName(item1, item2);
            if(useTranslation){
                this._helpWindow.setText("Cucini " + item1.name + " e " + item2.name + " ed ottieni " + cookedName + "?");

            }else{
                this._helpWindow.setText("Cook " + item1.name + " and " + item2.name + " into " + cookedName + "?");

            }
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
        const useTranslation = ConfigManager.language === 'it'

        const item1 = CookingSystem.getFirstItem();
        const item2 = CookingSystem.getSecondItem();
        this.addCommand(useTranslation?"Cucina":"Cook", "cook", item1 && item2);
        this.addCommand(useTranslation?"Annulla":"Cancel", "cancel");
    };
    
    Window_CookingConfirm.prototype.maxCols = function() {
        return 2;
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
        const useTranslation = ConfigManager.language === 'it';
        
        _Window_MenuCommand_addOriginalCommands.call(this);
        
        // Check if player has any of the required items
        const hasRequiredItem = requiredItemIds.some(itemId => {
            const item = $dataItems[itemId];
            return item && $gameParty.hasItem(item);
        });
        
        this.addCommand(useTranslation ? "Cucina" : "Cooking", "cooking", hasRequiredItem, 265);
    };
})();
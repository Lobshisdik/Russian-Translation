//=============================================================================
// Stealing System Plugin
// Version: 1.0.1
//=============================================================================

/*:
 * @target MZ
 * @plugindesc Advanced stealing system that scans shop events and calculates steal chances
 * @author Omni-Lex
 *
 * @command openStealWindow
 * @text Open Steal Window
 * @desc Opens the stealing window to steal from nearby shops
 *
 * @help
 * This plugin creates a stealing system for RPG Maker MZ.
 *
 * Features:
 * - Scans current map for shop events
 * - Calculates steal percentage based on player agility, item value, and weight
 * - Shows stealable items with success percentages
 * - Handles steal attempts and stores results
 * - Italian translation support
 * - Compatible with RandomDailyShop plugin: automatically generates daily item lists
 *   for events within 5 tiles using the RandomDailyShop OpenDailyShop command
 *
 * Item Note Tags:
 * <Weight: X> - Sets item weight in grams (e.g., <Weight: 500>)
 *
 * Plugin Command:
 * openStealWindow - Opens the stealing interface
 *
 * The system will:
 * - Store stolen item value in Variable 79
 * - Call Common Event 125 after steal attempt
 *
 * Proximity Rules:
 * - Standard shops (Shop Processing command): Scanned entire map
 * - RandomDailyShop merchants: Only scanned if within 5 tiles of player
 *
 * RandomDailyShop Integration:
 * If an event uses the RandomDailyShop plugin command (OpenDailyShop) and is within
 * 5 tiles of the player, the stealing system will automatically detect it and generate
 * the daily random items for that event's location based on coordinates and current date.
 * This allows stealing from dynamic shop inventory at nearby locations.
 */

(() => {
    const pluginName = "StealingSystem";

    //=============================================================================
    // Translation System
    //=============================================================================
    
    const Translations = {
        weight: {
            en: "Weight",
            it: "Peso"
        },
        value: {
            en: "Value",
            it: "Valore"
        },
        stealSuccess: {
            en: "You successfully stole",
            it: "Hai rubato con successo"
        },
        stealFailed: {
            en: "You failed to steal",
            it: "Non sei riuscito a rubare"
        }
    };

    function translate(key) {
        const useTranslation = ConfigManager.language === 'it';
        const lang = useTranslation ? 'it' : 'en';
        return Translations[key] ? Translations[key][lang] : key;
    }

    function goldToEuros(gold) {
        const useTranslation = ConfigManager.language === 'it';
        // 100 gold = 1 euro
        const euros = gold / 100;
        return useTranslation ? `€${euros.toFixed(2)}` : `${gold}G`;
    }

    PluginManager.registerCommand(pluginName, "openStealWindow", args => {
        SceneManager.push(Scene_Steal);
    });

    //=============================================================================
    // DataManager - Extract item weight from notes
    //=============================================================================
    
    DataManager.getItemWeight = function(item) {
        if (!item || !item.note) return 100; // Default weight
        const match = item.note.match(/<Weight:\s*(\d+)>/i);
        return match ? parseInt(match[1]) : 100;
    };

    //=============================================================================
    // Game_System - Store shop data
    //=============================================================================
    
    const _Game_System_initialize = Game_System.prototype.initialize;
    Game_System.prototype.initialize = function() {
        _Game_System_initialize.call(this);
        this._lastStealValue = 0;
    };

    //=============================================================================
    // Steal Calculator
    //=============================================================================
    
    class StealCalculator {
        static calculateStealChance(item, agility) {
            const baseChance = 50;
            const agilityBonus = agility * 0.5; // 0.5% per point of agility
            const value = item.price || 0;
            const weight = DataManager.getItemWeight(item);
            
            // Penalties
            const valuePenalty = Math.min(value / 100, 30); // Max 30% penalty
            const weightPenalty = Math.min(weight / 100, 30); // Max 30% penalty
            
            let chance = baseChance + agilityBonus - valuePenalty - weightPenalty;
            
            // Clamp between 5% and 95%
            return Math.max(5, Math.min(95, Math.floor(chance)));
        }

        static performSteal(chance) {
            return Math.random() * 100 < chance;
        }
    }

    //=============================================================================
    // Shop Scanner - Finds shops on current map
    //=============================================================================
    
    class ShopScanner {
        static DAILY_SHOP_PROXIMITY = 5; // Tiles

        static scanMapForShops() {
            const items = [];
            const events = $gameMap.events();
            const playerX = $gamePlayer.x;
            const playerY = $gamePlayer.y;

            for (const event of events) {
                if (!event) continue;
                const shopItems = this.extractShopItems(event, playerX, playerY);
                items.push(...shopItems);
            }

            // Remove duplicates
            const uniqueItems = [];
            const seen = new Set();

            for (const item of items) {
                const key = `${item.type}_${item.id}`;
                if (!seen.has(key)) {
                    seen.add(key);
                    uniqueItems.push(item);
                }
            }

            return uniqueItems;
        }

        static isWithinProximity(eventX, eventY, playerX, playerY, distance) {
            // Manhattan distance
            const dist = Math.abs(eventX - playerX) + Math.abs(eventY - playerY);
            return dist <= distance;
        }

        static extractShopItems(event, playerX, playerY) {
            const items = [];
            const pages = event.event().pages;
            let hasStandardShop = false;
            let hasDailyShop = false;

            // First pass: Check what types of shops this event has
            for (const page of pages) {
                const list = page.list;
                for (const command of list) {
                    if (command.code === 302) {
                        hasStandardShop = true;
                    }
                    if (command.code === 357) {
                        const params = command.parameters;
                        if (params && params[0] === 'RandomDailyShop' && params[1] === 'OpenDailyShop') {
                            hasDailyShop = true;
                        }
                    }
                }
            }

            // For daily shops, check proximity
            if (hasDailyShop && !this.isWithinProximity(event.x, event.y, playerX, playerY, this.DAILY_SHOP_PROXIMITY)) {
                // Daily shop exists but player is too far - skip it
                hasDailyShop = false;
            }

            // Second pass: Extract items based on proximity rules
            for (const page of pages) {
                const list = page.list;
                for (let i = 0; i < list.length; i++) {
                    const command = list[i];

                    // Command 302 is Shop Processing - scan entire map
                    if (command.code === 302) {
                        // Start scanning for item additions (command 605)
                        let j = i + 1;
                        while (j < list.length && list[j].code === 605) {
                            const goods = list[j].parameters;
                            if (goods && goods.length >= 2) {
                                const type = goods[0];
                                const id = goods[1];
                                let itemData = null;
                                let itemType = '';

                                if (type === 0 && id > 0) { // Item
                                    itemData = $dataItems[id];
                                    itemType = 'item';
                                } else if (type === 1 && id > 0) { // Weapon
                                    itemData = $dataWeapons[id];
                                    itemType = 'weapon';
                                } else if (type === 2 && id > 0) { // Armor
                                    itemData = $dataArmors[id];
                                    itemType = 'armor';
                                }

                                if (itemData) {
                                    items.push({
                                        type: itemType,
                                        id: id,
                                        data: itemData
                                    });
                                }
                            }
                            j++;
                        }
                    }

                    // Command 357 is Plugin Command - only if within proximity
                    if (command.code === 357 && hasDailyShop) {
                        const params = command.parameters;
                        // params[0] is the plugin name, params[1] is the command name
                        if (params && params[0] === 'RandomDailyShop' && params[1] === 'OpenDailyShop') {
                            // Generate daily shop items for this event's location
                            const dailyItems = this.getDailyShopItems(event);
                            items.push(...dailyItems);
                        }
                    }
                }
            }

            return items;
        }

        static getDailyShopItems(event) {
            const items = [];

            // Check if RandomDailyShop plugin is loaded
            if (!window.getRandomDailyShopItems) {
                console.warn("StealingSystem: RandomDailyShop plugin not found for daily shop integration.");
                return items;
            }

            try {
                const mapId = $gameMap.mapId();
                const x = event.x;
                const y = event.y;

                // Get the daily shop items from RandomDailyShop
                const dailyShopItems = window.getRandomDailyShopItems(mapId, x, y);

                // Convert items to stealing system format
                if (dailyShopItems && Array.isArray(dailyShopItems)) {
                    for (const item of dailyShopItems) {
                        if (item && item.name) {
                            let itemType = '';

                            if (DataManager.isItem(item)) {
                                itemType = 'item';
                            } else if (DataManager.isWeapon(item)) {
                                itemType = 'weapon';
                            } else if (DataManager.isArmor(item)) {
                                itemType = 'armor';
                            }

                            if (itemType) {
                                items.push({
                                    type: itemType,
                                    id: item.id,
                                    data: item
                                });
                            }
                        }
                    }
                }
            } catch (e) {
                console.error("StealingSystem: Error generating daily shop items:", e);
            }

            return items;
        }
    }

    //=============================================================================
    // Window_StealList - Shows stealable items
    //=============================================================================
    
    class Window_StealList extends Window_Selectable {
        initialize(rect) {
            super.initialize(rect);
            this._data = [];
            this._agility = $gameParty.leader() ? $gameParty.leader().agi : 1;
            this.refresh();
        }

        maxCols() {
            return 1;
        }

        maxItems() {
            return this._data ? this._data.length : 0;
        }

        item() {
            return this._data[this.index()];
        }

        makeItemList() {
            this._data = ShopScanner.scanMapForShops();
        }

        drawItem(index) {
            const useTranslation = ConfigManager.language === 'it';
            
            const item = this._data[index];
            if (!item) return;
            
            const rect = this.itemLineRect(index);
            const itemData = item.data;
            const chance = StealCalculator.calculateStealChance(itemData, this._agility);
            
            this.changePaintOpacity(true);
            this.drawItemName(itemData, rect.x, rect.y, rect.width - 100);
            this.drawText(chance + "%", rect.x + rect.width - 80, rect.y, 80, "right");
        }

        refresh() {
            this.makeItemList();
            super.refresh();
        }

        updateHelp() {
            const useTranslation = ConfigManager.language === 'it';
            
            const item = this.item();
            if (item) {
                const weight = DataManager.getItemWeight(item.data);
                const weightText = translate('weight');
                const valueText = translate('value');
                const priceDisplay = goldToEuros(item.data.price);
                const helpText = `${item.data.description}\n${weightText}: ${weight}g | ${valueText}: ${priceDisplay}`;
                this.setHelpWindowText(helpText);
            }
        }

        setHelpWindowText(text) {
            if (this._helpWindow) {
                this._helpWindow.setText(text);
            }
        }
    }

    //=============================================================================
    // Scene_Steal - Main stealing scene
    //=============================================================================
    
    class Scene_Steal extends Scene_MenuBase {
        create() {
            super.create();
            this.createHelpWindow();
            this.createListWindow();
        }

        createHelpWindow() {
            const rect = this.helpWindowRect();
            this._helpWindow = new Window_Help(rect);
            this.addWindow(this._helpWindow);
        }

        helpWindowRect() {
            const wx = 0;
            const wy = 0;
            const ww = Graphics.boxWidth;
            const wh = this.calcWindowHeight(2, false);
            return new Rectangle(wx, wy, ww, wh);
        }

        createListWindow() {
            const rect = this.listWindowRect();
            this._listWindow = new Window_StealList(rect);
            this._listWindow.setHelpWindow(this._helpWindow);
            this._listWindow.setHandler("ok", this.onItemOk.bind(this));
            this._listWindow.setHandler("cancel", this.popScene.bind(this));
            this.addWindow(this._listWindow);
            this._listWindow.activate();
            this._listWindow.select(0);
        }

        listWindowRect() {
            const wx = 0;
            const wy = this._helpWindow.height;
            const ww = Graphics.boxWidth;
            const wh = Graphics.boxHeight - wy;
            return new Rectangle(wx, wy, ww, wh);
        }

        onItemOk() {
            const useTranslation = ConfigManager.language === 'it';
            
            const item = this._listWindow.item();
            if (!item) {
                this._listWindow.activate();
                return;
            }

            const agility = $gameParty.leader() ? $gameParty.leader().agi : 1;
            const chance = StealCalculator.calculateStealChance(item.data, agility);
            const success = StealCalculator.performSteal(chance);
            
            // Store item value in variable 79
            $gameVariables.setValue(79, item.data.price || 0);
            
            if (success) {
                // Add item to inventory
                if (item.type === 'item') {
                    $gameParty.gainItem(item.data, 1);
                } else if (item.type === 'weapon') {
                    $gameParty.gainItem(item.data, 1, false);
                } else if (item.type === 'armor') {
                    $gameParty.gainItem(item.data, 1, false);
                }
                window.skipLocalization = true;
                const successText = translate('stealSuccess');
                $gameMessage.add(`${successText} ${item.data.name}!`);
                window.skipLocalization = false;

            } else {
                $gameTemp.reserveCommonEvent(125);

                /*
                window.skipLocalization = true;

                const failText = translate('stealFailed');
                $gameMessage.add(`${failText} ${item.data.name}.`);
                window.skipLocalization = false;
                */
            }
            
            // Call common event 125
            
            this.popScene();
        }
    }

    // Export classes to global scope
    window.Scene_Steal = Scene_Steal;
    window.Window_StealList = Window_StealList;
    window.StealCalculator = StealCalculator;
    window.ShopScanner = ShopScanner;
})();
/*:
 * @target MZ
 * @plugindesc Real Estate Management System v1.0.0
 * @author Omni-Lex
 * @url https://nocoldiz.itch.io/hypernet-explorer
 * @help
 * ============================================================================
 * Real Estate Management Plugin for RPG Maker MZ
 * ============================================================================
 * 
 * This plugin adds a comprehensive real estate system to your game where
 * players can buy, sell, and rent out properties across Europe.
 * 
 * IMPORTANT: This plugin requires NewsSystem.js to be installed and loaded
 * BEFORE this plugin in the plugin manager.
 * 
 * Features:
 * - 30 randomized properties across Europe
 * - Star rating system (1-5 stars)
 * - Real-time rent collection at midnight
 * - Market fluctuations based on news events
 * - Different property types with varying capacities
 * - Currency conversion: 100 gold = 1 euro
 * 
 * Plugin Commands:
 * - Open Real Estate Menu
 * - Check Daily Income
 * - Force Market Update (for testing)
 * 
 * @param menuCommand
 * @text Menu Command Name
 * @desc Name of the real estate command in the menu
 * @default Real Estate
 * 
 * @command openRealEstateMenu
 * @text Open Real Estate Menu
 * @desc Opens the real estate management interface
 * 
 * @command checkDailyIncome
 * @text Check Daily Income
 * @desc Shows today's rental income summary
 * 
 * @command forceMarketUpdate
 * @text Force Market Update
 * @desc Forces a market update (for testing)
 */

(() => {
    'use strict';
    
    const pluginName = 'RealEstateMarket';

    // --- Helper Function to Parse Game Date from Variable 113 ---
    function getGameDateFromVariable() {
        const dateStr = $gameVariables.value(113) || '01 JAN 2001 12:00';
        // Format: "01 JAN 2001 12:00"
        const parts = dateStr.split(' ');
        if (parts.length < 4) {
            return { day: 1, month: 0, year: 2001, hours: 8, minutes: 0 };
        }

        const day = parseInt(parts[0]);
        const monthStr = parts[1].toUpperCase();
        const year = parseInt(parts[2]);
        const timeStr = parts[3].split(':');
        const hours = parseInt(timeStr[0]);
        const minutes = parseInt(timeStr[1]);

        const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
        const month = months.indexOf(monthStr);

        return { day, month, year, hours, minutes };
    }

    // --- Helper Function to Get Current Game Date as JavaScript Date ---
    function getGameDateAsJSDate() {
        const gameDate = getGameDateFromVariable();
        return new Date(gameDate.year, gameDate.month, gameDate.day, gameDate.hours, gameDate.minutes, 0);
    }

    // Import utilities from News System
    const t = window.NewsSystemUtils.t;
    const getLocations = window.NewsSystemUtils.getLocations;
    const isItalian = window.NewsSystemUtils.isItalian;
    
    // Property types with their characteristics
    const PROPERTY_TYPES = {
        'Simple House': { minCap: 1, maxCap: 4, basePrice: [15000, 25000, 40000, 60000, 85000] },
        'Apartment': { minCap: 1, maxCap: 6, basePrice: [20000, 35000, 55000, 80000, 110000] },
        'Villa': { minCap: 2, maxCap: 8, basePrice: [40000, 70000, 120000, 180000, 250000] },
        'Hotel': { minCap: 10, maxCap: 150, basePrice: [200000, 400000, 700000, 1200000, 2000000] },
        'Hostel': { minCap: 8, maxCap: 80, basePrice: [80000, 150000, 250000, 400000, 600000] },
        'Castle': { minCap: 5, maxCap: 30, basePrice: [300000, 600000, 1000000, 1800000, 3000000] },
        'Yacht': { minCap: 2, maxCap: 12, basePrice: [150000, 300000, 500000, 800000, 1500000] },
        'Restaurant': { minCap: 0, maxCap: 60, basePrice: [100000, 200000, 350000, 550000, 850000] },
        'Camper Van': { minCap: 1, maxCap: 4, basePrice: [25000, 40000, 60000, 85000, 120000] },
        'B&B': { minCap: 2, maxCap: 16, basePrice: [60000, 120000, 200000, 320000, 500000] }
    };
    
    // Real Estate Manager Class
    class RealEstateManager {
        constructor() {
            this.properties = [];
            this.ownedProperties = [];
            this.lastUpdateTime = null;
            this.dailyIncome = 0;
            this.totalIncome = 0;
        }
        
        initialize() {
            this.generateProperties();
            this.lastUpdateTime = getGameDateAsJSDate();
            this.startDailyUpdates();
            console.log("## test")

            // Register with News System for market effects
            this.registerWithNewsSystem();
        }
        
        registerWithNewsSystem() {
            if (window.$newsManager) {
                window.$newsManager.registerListener((news, duration) => {
                    this.handleNewsEvent(news, duration);
                });
            }
        }
        
        handleNewsEvent(news, duration) {
            // Apply immediate occupancy effects to affected properties
            this.properties.forEach(property => {
                if (property.location === news.location) {
                    if (news.occupancyEffect < 1) {
                        // Negative effect - people leave
                        const reduction = Math.floor(property.currentOccupants * (1 - news.occupancyEffect));
                        property.currentOccupants = Math.max(0, property.currentOccupants - reduction);
                    } else if (news.occupancyEffect > 1 && property.isForRent) {
                        // Positive effect - people arrive
                        const increase = Math.floor(property.maxOccupants * (news.occupancyEffect - 1) * 0.3);
                        property.currentOccupants = Math.min(property.maxOccupants, property.currentOccupants + increase);
                    }
                    
                    // Update market trend
                    property.marketTrend = Math.max(-1, Math.min(1, property.marketTrend + (news.priceEffect - 1)));
                }
            });
        }
        
        generateProperties() {
            const usedCombinations = new Set();
            
            for (let i = 0; i < 30; i++) {
                let property;
                do {
                    property = this.createRandomProperty(i);
                } while (usedCombinations.has(`${property.type}-${property.location}`));
                
                usedCombinations.add(`${property.type}-${property.location}`);
                this.properties.push(property);
            }
        }
        
        createRandomProperty(id) {
            const types = Object.keys(PROPERTY_TYPES);
            const type = types[Math.floor(Math.random() * types.length)];
            const locations = getLocations();
            const location = locations[Math.floor(Math.random() * locations.length)];
            const stars = Math.floor(Math.random() * 5) + 1;
            const typeData = PROPERTY_TYPES[type];
            const basePrice = typeData.basePrice[stars - 1];
            const priceVariation = 0.8 + Math.random() * 0.4; // ±20% variation
            
            return {
                id: id,
                name: this.generatePropertyName(type, location, stars),
                type: type,
                location: location,
                stars: stars,
                price: Math.floor(basePrice * priceVariation),
                maxOccupants: typeData.maxCap,
                currentOccupants: 0,
                rentPerOccupant: Math.floor((basePrice * priceVariation * 0.001) / 30), // ~0.1% daily
                isOwned: false,
                isForSale: true,
                isForRent: true,
                marketTrend: 0 // -1 to 1, affects occupancy changes
            };
        }
        
        generatePropertyName(type, location, stars) {
            const starNames = t('starLevels');
            const prefix = starNames[stars - 1];
            
            const suffixes = t('propertySuffixes');
            const suffix = suffixes[type][Math.floor(Math.random() * suffixes[type].length)];
            return `${prefix} ${suffix}`;
        }
        
        buyProperty(propertyId) {
            const property = this.properties.find(p => p.id === propertyId);
            if (!property || property.isOwned) return false;
            
            const effectivePrice = this.calculateEffectivePrice(property);
            const goldCost = effectivePrice * 100; // Convert euros to gold
            if ($gameParty.gold() < goldCost) return false;
            
            $gameParty.loseGold(goldCost);
            property.isOwned = true;
            property.isForSale = false;
            property.isForRent = true;
            property.currentOccupants = Math.floor(Math.random() * property.maxOccupants * 0.3);
            this.ownedProperties.push(property.id);
            
            return true;
        }
        
        sellProperty(propertyId) {
            const property = this.properties.find(p => p.id === propertyId);
            if (!property || !property.isOwned) return false;
            
            const effectivePrice = this.calculateEffectivePrice(property);
            const salePrice = Math.floor(effectivePrice * 0.9); // 90% of current market price
            const goldGain = salePrice * 100;
            
            $gameParty.gainGold(goldGain);
            property.isOwned = false;
            property.isForSale = true;
            property.isForRent = false;
            property.currentOccupants = 0;
            
            const index = this.ownedProperties.indexOf(property.id);
            if (index > -1) this.ownedProperties.splice(index, 1);
            
            return true;
        }
        
        toggleRentStatus(propertyId) {
            const property = this.properties.find(p => p.id === propertyId);
            if (!property || !property.isOwned) return false;
            
            property.isForRent = !property.isForRent;
            if (!property.isForRent) {
                property.currentOccupants = 0;
            }
            
            return true;
        }
        
        getActiveEffectsForLocation(location) {
            if (window.$newsManager) {
                return window.$newsManager.getActiveEffectsForLocation(location);
            }
            return [];
        }
        
        calculateEffectivePrice(property) {
            const effects = this.getActiveEffectsForLocation(property.location);
            let priceMultiplier = 1;
            
            effects.forEach(effect => {
                priceMultiplier *= effect.priceEffect;
            });
            
            return Math.floor(property.price * priceMultiplier);
        }
        
        startDailyUpdates() {
            // For real game, you'd want to tie this to the game's time system
            // This is just a placeholder
        }
        
        processDailyUpdate() {
            this.dailyIncome = 0;
            
            // Update market trends
            this.properties.forEach(property => {
                property.marketTrend = (Math.random() - 0.5) * 2; // -1 to 1
            });
            
            // Process owned properties
            this.ownedProperties.forEach(propertyId => {
                const property = this.properties.find(p => p.id === propertyId);
                if (!property || !property.isForRent) return;
                
                // Update occupancy based on market and property characteristics
                this.updateOccupancy(property);
                
                // Collect rent
                const dailyRent = property.currentOccupants * property.rentPerOccupant;
                this.dailyIncome += dailyRent;
                this.totalIncome += dailyRent;
            });
            
            // Convert euros to gold and add to party
            const goldIncome = Math.floor(this.dailyIncome * 100);
            $gameParty.gainGold(goldIncome);
            
            // Save the update
            this.save();
        }
        
        updateOccupancy(property) {
            const occupancyRate = property.currentOccupants / property.maxOccupants;
            let changeChance = 0.1; // Base 10% chance of change
            
            // Higher occupancy = higher turnover
            changeChance += occupancyRate * 0.3;
            
            // Property size affects stability (smaller = more stable)
            const sizeModifier = property.maxOccupants / 150;
            changeChance *= (0.5 + sizeModifier * 0.5);
            
            // Star rating affects attractiveness
            const starModifier = property.stars / 5;
            
            if (Math.random() < changeChance) {
                // Determine if occupants move in or out
                const marketInfluence = property.marketTrend * 0.3;
                const attractiveness = starModifier * 0.5 + marketInfluence;
                
                if (Math.random() < 0.5 + attractiveness) {
                    // Occupants move in
                    const maxIncrease = Math.ceil(property.maxOccupants * 0.2);
                    const increase = Math.floor(Math.random() * maxIncrease) + 1;
                    property.currentOccupants = Math.min(
                        property.currentOccupants + increase,
                        property.maxOccupants
                    );
                } else {
                    // Occupants move out
                    const maxDecrease = Math.ceil(property.currentOccupants * 0.3);
                    const decrease = Math.floor(Math.random() * maxDecrease) + 1;
                    property.currentOccupants = Math.max(
                        property.currentOccupants - decrease,
                        0
                    );
                }
            }
        }
        
        calculateDailyIncome() {
            let income = 0;
            this.ownedProperties.forEach(propertyId => {
                const property = this.properties.find(p => p.id === propertyId);
                if (property && property.isForRent) {
                    income += property.currentOccupants * property.rentPerOccupant;
                }
            });
            return income;
        }
        
        save() {
            $gameSystem.realEstateData = {
                properties: this.properties,
                ownedProperties: this.ownedProperties,
                lastUpdateTime: this.lastUpdateTime,
                dailyIncome: this.dailyIncome,
                totalIncome: this.totalIncome
            };
        }
        
        load() {
            const data = $gameSystem.realEstateData;
            if (data) {
                this.properties = data.properties || [];
                this.ownedProperties = data.ownedProperties || [];
                this.lastUpdateTime = data.lastUpdateTime ? new Date(data.lastUpdateTime) : getGameDateAsJSDate();
                this.dailyIncome = data.dailyIncome || 0;
                this.totalIncome = data.totalIncome || 0;

                // If no properties exist, initialize
                if (this.properties.length === 0) {
                    this.initialize();
                } else {
                    // Re-register with news system
                    this.registerWithNewsSystem();
                }
            } else {
                this.initialize();
            }
        }
    }
    
    // Scene_RealEstate - Main UI Scene
    class Scene_RealEstate extends Scene_MenuBase {
        create() {
            super.create();
            this.createHelpWindow();
            this.createGoldWindow();
            this.createPropertyListWindow();
            this.createPropertyDetailsWindow();
            this.createCommandWindow();
        }
        
        createHelpWindow() {
            const rect = this.helpWindowRect();
            this._helpWindow = new Window_Help(rect);
            this._helpWindow.setText(t('menuTitle'));
            this.addWindow(this._helpWindow);
        }
        
        createGoldWindow() {
            const rect = this.goldWindowRect();
            this._goldWindow = new Window_Gold(rect);
            this.addWindow(this._goldWindow);
        }
        
        goldWindowRect() {
            const ww = this.mainCommandWidth();
            const wh = this.calcWindowHeight(1, true);
            const wx = Graphics.boxWidth - ww;
            const wy = this.mainAreaTop();
            return new Rectangle(wx, wy, ww, wh);
        }
        
        createPropertyListWindow() {
            const rect = this.propertyListWindowRect();
            this._propertyListWindow = new Window_PropertyList(rect);
            this._propertyListWindow.setHandler('ok', this.onPropertyOk.bind(this));
            this._propertyListWindow.setHandler('cancel', this.popScene.bind(this));
            this._propertyListWindow.setHelpWindow(this._helpWindow);
            this.addWindow(this._propertyListWindow);
        }
        
        propertyListWindowRect() {
            const wx = 0;
            const wy = this.mainAreaTop() + this._goldWindow.height;
            const ww = Graphics.boxWidth / 2;
            const wh = this.mainAreaHeight() - this._goldWindow.height;
            return new Rectangle(wx, wy, ww, wh);
        }
        
        createPropertyDetailsWindow() {
            const rect = this.propertyDetailsWindowRect();
            this._propertyDetailsWindow = new Window_PropertyDetails(rect);
            this.addWindow(this._propertyDetailsWindow);
        }
        
        propertyDetailsWindowRect() {
            const wx = this._propertyListWindow.width;
            const wy = this.mainAreaTop() + this._goldWindow.height;
            const ww = Graphics.boxWidth - wx;
            const wh = this.mainAreaHeight() - this._goldWindow.height - this.calcWindowHeight(1, true);
            return new Rectangle(wx, wy, ww, wh);
        }
        
        createCommandWindow() {
            const rect = this.commandWindowRect();
            this._commandWindow = new Window_PropertyCommand(rect);
            this._commandWindow.setHandler('buy', this.commandBuy.bind(this));
            this._commandWindow.setHandler('sell', this.commandSell.bind(this));
            this._commandWindow.setHandler('info', this.commandInfo.bind(this));
            this._commandWindow.setHandler('cancel', this.onCommandCancel.bind(this));
            this._commandWindow.close();
            this._commandWindow.deactivate();
            this.addWindow(this._commandWindow);
        }
        
        commandWindowRect() {
            const wx = this._propertyDetailsWindow.x;
            const wy = this._propertyDetailsWindow.y + this._propertyDetailsWindow.height;
            const ww = this._propertyDetailsWindow.width;
            const wh = this.calcWindowHeight(1, true);
            return new Rectangle(wx, wy, ww, wh);
        }
        
        start() {
            super.start();
            ensureRealEstateManager();
            this._propertyListWindow.setDetailsWindow(this._propertyDetailsWindow);
            this._propertyListWindow.refresh();
            this._propertyListWindow.activate();
            this._propertyListWindow.select(0);
        }
        
        onPropertyOk() {
            const property = this._propertyListWindow.property();
            if (property) {
                this._commandWindow.setProperty(property);
                this._commandWindow.refresh();
                this._commandWindow.open();
                this._commandWindow.activate();
                this._commandWindow.select(0);
            }
        }
        
        commandBuy() {
            const property = this._propertyListWindow.property();
            if ($realEstateManager.buyProperty(property.id)) {
                SoundManager.playShop();
                this.refreshAllWindows();
                this.returnToPropertyList();
            } else {
                SoundManager.playBuzzer();
                this.returnToPropertyList();
            }
        }
        
        commandInfo() {
            const property = this._propertyListWindow.property();
            if (property) {
                $gameTemp.newsReturnScene = 'realEstate';
                $gameTemp.newsFilterLocation = property.location;
                
                // Use the News History scene from News System
                if (window.Scene_NewsHistory) {
                    SceneManager.push(window.Scene_NewsHistory);
                }
            }
        }
        
        commandSell() {
            const property = this._propertyListWindow.property();
            if ($realEstateManager.sellProperty(property.id)) {
                SoundManager.playShop();
                this.refreshAllWindows();
                this.returnToPropertyList();
            } else {
                SoundManager.playBuzzer();
            }
        }

        onCommandCancel() {
            this.returnToPropertyList();
        }
        
        returnToPropertyList() {
            this._commandWindow.close();
            this._commandWindow.deactivate();
            this._propertyListWindow.activate();
        }
        
        refreshAllWindows() {
            this._propertyListWindow.refresh();
            this._propertyDetailsWindow.refresh();
            this._goldWindow.refresh();
        }
    }
    
    // Window_PropertyList
    class Window_PropertyList extends Window_Selectable {
        initialize(rect) {
            super.initialize(rect);
            this._data = [];
            this._detailsWindow = null;
            this.refresh();
            this.select(0);
        }
        
        setDetailsWindow(detailsWindow) {
            this._detailsWindow = detailsWindow;
            this.updateDetails();
        }
        
        maxItems() {
            return this._data ? this._data.length : 0;
        }
        
        property() {
            return this._data && this.index() >= 0 ? this._data[this.index()] : null;
        }
        
        makeItemList() {
            ensureRealEstateManager();
            this._data = $realEstateManager ? $realEstateManager.properties : [];
        }
        
        drawItem(index) {
            const property = this._data[index];
            if (property) {
                const rect = this.itemLineRect(index);
                this.resetTextColor();
                if (property.isOwned) {
                    this.changeTextColor(ColorManager.powerUpColor());
                }
                this.drawText(property.name, rect.x, rect.y, rect.width - 60);
                this.drawText(this.getStars(property.stars), rect.x + rect.width - 60, rect.y, 60);
            }
        }
        
        getStars(rating) {
            return '★'.repeat(rating) + '☆'.repeat(5 - rating);
        }
        
        refresh() {
            this.makeItemList();
            super.refresh();
        }
        
        updateHelp() {
            if (this._helpWindow && this.property()) {
                const property = this.property();
                const status = property.isOwned ? t('owned') : t('available');
                this._helpWindow.setText(`${property.location} - ${status}`);
            }
        }
        
        select(index) {
            super.select(index);
            this.updateDetails();
        }
        
        updateDetails() {
            if (this._detailsWindow) {
                this._detailsWindow.setProperty(this.property());
            }
        }
    }
    
    // Window_PropertyDetails
    class Window_PropertyDetails extends Window_Base {
        initialize(rect) {
            super.initialize(rect);
            this._property = null;
        }
        
        setProperty(property) {
            if (this._property !== property) {
                this._property = property;
                this.refresh();
            }
        }
        
        refresh() {
            this.contents.clear();
            if (this._property) {
                this.drawPropertyDetails();
            }
        }
        
        drawPropertyDetails() {
            const lineHeight = this.lineHeight();
            const property = this._property;
            let y = 0;
            
            // Property name and type
            this.drawText(property.name, 0, y, this.innerWidth, 'center');
            y += lineHeight;
            
            this.drawText(`${t('type')}: ${t('propertyTypes')[property.type]}`, 0, y, this.innerWidth);
            y += lineHeight;
            
            // Location
            this.drawText(`${t('location')}: ${property.location}`, 0, y, this.innerWidth);
            y += lineHeight;
            
            // Stars
            this.drawText(`${t('rating')}: ` + this.getStars(property.stars), 0, y, this.innerWidth);
            y += lineHeight;
            
            // Price with market effects
            const effectivePrice = $realEstateManager.calculateEffectivePrice(property);
            this.changeTextColor(ColorManager.systemColor());
            this.drawText(`${t('price')}:`, 0, y, 120);
            this.resetTextColor();
            if (effectivePrice !== property.price) {
                this.drawText(`€${effectivePrice.toLocaleString()}`, 120, y, this.innerWidth - 240);
                this.changeTextColor(effectivePrice > property.price ? ColorManager.powerUpColor() : ColorManager.deathColor());
                const percentChange = Math.round(((effectivePrice - property.price) / property.price) * 100);
                this.drawText(`(${percentChange > 0 ? '+' : ''}${percentChange}%)`, this.innerWidth - 120, y, 120, 'right');
            } else {
                this.drawText(`€${property.price.toLocaleString()}`, 120, y, this.innerWidth - 120);
            }
            y += lineHeight;
            
            // Occupancy
            if (property.isOwned) {
                this.changeTextColor(ColorManager.systemColor());
                this.drawText(`${t('occupancy')}:`, 0, y, 120);
                this.resetTextColor();
                this.drawText(`${property.currentOccupants}/${property.maxOccupants}`, 120, y, this.innerWidth - 120);
                y += lineHeight;
                
                // Daily income
                this.changeTextColor(ColorManager.systemColor());
                this.drawText(`${t('dailyIncome')}:`, 0, y, 120);
                this.resetTextColor();
                const dailyIncome = property.currentOccupants * property.rentPerOccupant;
                this.drawText(`€${dailyIncome.toLocaleString()}`, 120, y, this.innerWidth - 120);
                y += lineHeight;
            }
            
            // Market trend and active effects
            this.changeTextColor(ColorManager.systemColor());
            this.drawText(`${t('market')}:`, 0, y, 120);
            const trend = property.marketTrend;
            const effects = $realEstateManager.getActiveEffectsForLocation(property.location);
            
            if (effects.length > 0) {
                this.changeTextColor(ColorManager.textColor(17)); // Light blue
                this.drawText(`${effects.length} ${t('activeEvents')}`, 120, y, this.innerWidth - 120);
            } else if (trend > 0.5) {
                this.changeTextColor(ColorManager.powerUpColor());
                this.drawText(t('hot'), 120, y, this.innerWidth - 120);
            } else if (trend < -0.5) {
                this.changeTextColor(ColorManager.deathColor());
                this.drawText(t('cold'), 120, y, this.innerWidth - 120);
            } else {
                this.resetTextColor();
                this.drawText(t('stable'), 120, y, this.innerWidth - 120);
            }
        }
        
        getStars(rating) {
            return '★'.repeat(rating) + '☆'.repeat(5 - rating);
        }
    }
    
    // Window_PropertyCommand
    class Window_PropertyCommand extends Window_HorzCommand {
        initialize(rect) {
            super.initialize(rect);
            this._property = null;
        }
        
        setProperty(property) {
            this._property = property;
            this.refresh();
        }
        
        makeCommandList() {
            if (this._property) {
                if (this._property.isOwned) {
                    this.addCommand(t('sell'), 'sell');
                } else {
                    this.addCommand(t('buy'), 'buy');
                }
                
                if ($realEstateManager) {
                    const effects = $realEstateManager.getActiveEffectsForLocation(this._property.location);
                    if (effects.length > 0) {
                        this.addCommand(t('info'), 'info');
                    }
                }
            }
        }
        
        maxCols() {
            if (this._property && $realEstateManager) {
                const effects = $realEstateManager.getActiveEffectsForLocation(this._property.location);
                const baseCommands = this._property.isOwned ? 2 : 1;
                return effects.length > 0 ? baseCommands + 1 : baseCommands;
            }
            return 2;
        }
    }

    const _Scene_RealEstate_start = Scene_RealEstate.prototype.start;
Scene_RealEstate.prototype.start = function() {
    ensureRealEstateManager();
    _Scene_RealEstate_start.call(this);
};
    
    // Global instance
    let $realEstateManager = null;
    
    // Ensure Real Estate Manager exists
    function ensureRealEstateManager() {
        if (!$realEstateManager) {
            $realEstateManager = new RealEstateManager();
            $realEstateManager.load();
        }
    }

    
    // Plugin commands
    PluginManager.registerCommand(pluginName, 'openRealEstateMenu', args => {
        ensureRealEstateManager();
        SceneManager.push(Scene_RealEstate);
    });
    

    PluginManager.registerCommand(pluginName, 'checkDailyIncome', args => {
        ensureRealEstateManager();
        const income = $realEstateManager.calculateDailyIncome();
        const goldIncome = Math.floor(income * 100);
        $gameMessage.add(t('dailyIncomeMsg', { income: income, gold: goldIncome }));
        $gameMessage.add(t('propertiesOwnedMsg', { count: $realEstateManager.ownedProperties.length }));
    });
    

    
    PluginManager.registerCommand(pluginName, 'forceMarketUpdate', args => {
        ensureRealEstateManager();
        $realEstateManager.processDailyUpdate();
        $gameMessage.add(t('marketUpdatedMsg'));
    });
    

    // Save/Load
    const _DataManager_makeSaveContents = DataManager.makeSaveContents;
    DataManager.makeSaveContents = function() {
        const contents = _DataManager_makeSaveContents.call(this);
        if ($realEstateManager) {
            $realEstateManager.save();
        }
        return contents;
    };
    const _DataManager_extractSaveContents = DataManager.extractSaveContents;
    DataManager.extractSaveContents = function(contents) {
        _DataManager_extractSaveContents.call(this, contents);
        // Don't automatically create manager - let ensureRealEstateManager() handle it
        $realEstateManager = null;
    };
    
    // Export Scene for compatibility
    window.Scene_RealEstate = Scene_RealEstate;
    
})();
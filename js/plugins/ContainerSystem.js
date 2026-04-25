/*:
 * @target MZ
 * @plugindesc Container System v2.0.0
 * @author Omni-Lex
 * @url https://nocoldiz.itch.io/hypernet-explorer
 * @help
 * ============================================================================
 * Container System Plugin for RPG Maker MZ
 * ============================================================================
 * 
 * This plugin provides a comprehensive container system that allows you to
 * create storage containers throughout your game world with automatic item
 * generation based on categories and rarity.
 * 
 * Features:
 * - Unlimited containers with infinite storage capacity
 * - Store and retrieve items with quantity selection
 * - Containers are unique per map and event
 * - Automatic item generation based on categories and rarity
 * - Extradimensional container accessible from anywhere
 * - Single column item display with rarity colors
 * - Italian translation support
 * 
 * Item Setup:
 * - Add <category:CategoryName> in item notes to assign categories
 * - Item price determines rarity and spawn chance
 * 
 * Rarity Tiers (based on item price):
 * - Common (White): 0-999 gold
 * - Uncommon (Green): 1,000-9,999 gold  
 * - Rare (Blue): 10,000-99,999 gold
 * - Epic (Purple): 100,000-999,999 gold
 * - Legendary (Orange): 1,000,000+ gold
 * 
 * ============================================================================
 * Plugin Commands
 * ============================================================================
 * 
 * Open Container
 * - Opens a container at the current event location
 * 
 * Open Extradimensional Container
 * - Opens a special container that can be accessed from anywhere
 * 
 * Generate Container Items
 * - Generates items for container based on categories
 * - Format: Food,Weapon,Potion (comma-separated categories)
 * - Higher rarity items have lower spawn chances
 * 
 * ============================================================================
 * 
 * @command openContainer
 * @text Open Container
 * @desc Opens a container at the current event location
 * 
 * @command openExtradimensionalContainer
 * @text Open Extradimensional Container
 * @desc Opens the extradimensional container accessible from anywhere
 * 
 * @command openCamperContainer
 * @text Open Camper Container
 * @desc Opens the camper container accessible from anywhere
 * 
 * @command openCarContainer
 * @text Open Car Container
 * @desc Opens the car container accessible from anywhere
 * 
 * @command generateContainerItems
 * @text Generate Container Items
 * @desc Generates items based on categories and rarity
 * 
 * @arg categories
 * @text Item Categories
 * @desc Comma-separated list of categories (e.g., Food,Weapon,Potion)
 * @type string
 * @default Food
 * 
 * @arg itemCount
 * @text Number of Items
 * @desc How many different items to generate (1-20)
 * @type number
 * @min 1
 * @max 20
 * @default 3
 * 
 */

(() => {
    'use strict';
    
    const pluginName = 'ContainerSystem';
    
    // Translation system
    const translations = {
        en: {
            containerTitle: 'Container Storage',
            extradimensionalTitle: 'Extradimensional Container',
            storeItems: 'Store Items',
            retrieveItems: 'Retrieve Items',
            exit: 'Exit',
            store: 'Store:',
            retrieve: 'Retrieve:',
            common: 'Common',
            uncommon: 'Uncommon',
            rare: 'Rare',
            epic: 'Epic',
            legendary: 'Legendary'
        },
        it: {
            containerTitle: 'Deposito Contenitore',
            extradimensionalTitle: 'Contenitore Extradimensionale',
            storeItems: 'Riponi Oggetti',
            retrieveItems: 'Preleva Oggetti',
            exit: 'Esci',
            store: 'Riponi:',
            retrieve: 'Preleva:',
            common: 'Comune',
            uncommon: 'Non Comune',
            rare: 'Raro',
            epic: 'Epico',
            legendary: 'Leggendario'
        }
    };
    
    function getText(key) {
        const useTranslation = ConfigManager.language === 'it';
        const lang = useTranslation ? 'it' : 'en';
        return translations[lang][key] || translations.en[key] || key;
    }
    
    // Rarity configuration
    const RARITY_TIERS = [
        { name: "Common", colorCode: "#FFFFFF", minPrice: 0, maxPrice: 999, weight: 50 },
        { name: "Uncommon", colorCode: "#1AFF1A", minPrice: 1000, maxPrice: 9999, weight: 30 },
        { name: "Rare", colorCode: "#0080FF", minPrice: 10000, maxPrice: 99999, weight: 15 },
        { name: "Epic", colorCode: "#8000FF", minPrice: 100000, maxPrice: 999999, weight: 4 },
        { name: "Legendary", colorCode: "#FF8000", minPrice: 1000000, maxPrice: Infinity, weight: 1 }
    ];
    
    // Item utility functions
    class ItemUtils {
        static getItemCategory(item) {
            if (!item || !item.note) return null;
            const match = item.note.match(/<category:\s*([^>]+)>/i);
            return match ? match[1].trim() : null;
        }
        
        static getItemRarity(item) {
            if (!item) return RARITY_TIERS[0];
            const price = item.price || 0;
            return RARITY_TIERS.find(tier => price >= tier.minPrice && price <= tier.maxPrice) || RARITY_TIERS[0];
        }
        
        static getItemsByCategory(category) {
            const items = [];
            for (let i = 1; i < $dataItems.length; i++) {
                const item = $dataItems[i];
                if (item && this.getItemCategory(item) === category) {
                    items.push(item);
                }
            }
            return items;
        }
        
        static generateRandomQuantity(rarity) {
            // Generate quantity - most items should be 1-2, with 3 being rare
            const rand = Math.random();
            
            // Base chances: 60% for 1, 35% for 2, 5% for 3
            // Adjust slightly based on rarity
            switch (rarity.name) {
                case "Common":
                    if (rand < 0.55) return 1;      // 55% chance for 1
                    if (rand < 0.90) return 2;      // 35% chance for 2  
                    return 3;                       // 10% chance for 3
                    
                case "Uncommon":
                    if (rand < 0.60) return 1;      // 60% chance for 1
                    if (rand < 0.93) return 2;      // 33% chance for 2
                    return 3;                       // 7% chance for 3
                    
                case "Rare":
                    if (rand < 0.65) return 1;      // 65% chance for 1
                    if (rand < 0.95) return 2;      // 30% chance for 2
                    return 3;                       // 5% chance for 3
                    
                case "Epic":
                    if (rand < 0.75) return 1;      // 75% chance for 1
                    if (rand < 0.97) return 2;      // 22% chance for 2
                    return 3;                       // 3% chance for 3
                    
                case "Legendary":
                    if (rand < 0.80) return 1;      // 80% chance for 1
                    if (rand < 0.98) return 2;      // 18% chance for 2
                    return 3;                       // 2% chance for 3
                    
                default: 
                    return 1;
            }
        }
        
        static selectItemsByRarity(items, count) {
            if (items.length === 0) return [];
            
            const selectedItems = [];
            const maxAttempts = count * 10; // Prevent infinite loops
            let attempts = 0;
            
            while (selectedItems.length < count && attempts < maxAttempts) {
                attempts++;
                
                // Calculate total weight for weighted random selection
                let totalWeight = 0;
                for (const item of items) {
                    const rarity = this.getItemRarity(item);
                    totalWeight += rarity.weight;
                }
                
                // Select random item based on weight
                let randomValue = Math.random() * totalWeight;
                let selectedItem = null;
                
                for (const item of items) {
                    const rarity = this.getItemRarity(item);
                    randomValue -= rarity.weight;
                    if (randomValue <= 0) {
                        selectedItem = item;
                        break;
                    }
                }
                
                // Add item if not already selected
                if (selectedItem && !selectedItems.find(si => si.item.id === selectedItem.id)) {
                    const rarity = this.getItemRarity(selectedItem);
                    const quantity = this.generateRandomQuantity(rarity);
                    selectedItems.push({ item: selectedItem, quantity: quantity, rarity: rarity });
                }
            }
            
            return selectedItems;
        }
    }
    
    // Container Manager
    class ContainerManager {
        static initialize() {
            this._containers = {};
            this._extradimensionalContainer = {};
            this.load();
        }
        
        static getContainerId(mapId, eventId) {
            return `${mapId}_${eventId}`;
        }
        
        static getContainer(containerId) {
            if (!this._containers[containerId]) {
                this._containers[containerId] = {};
            }
            return this._containers[containerId];
        }
        
        static getExtradimensionalContainer() {
            return this._extradimensionalContainer;
        }
        
        static generateContainerItems(containerId, categories, itemCount) {
            const container = this.getContainer(containerId);
            
            // Only generate if container is empty
            if (!this.isContainerEmpty(containerId)) {
                return;
            }
            
            const categoryList = categories.split(',').map(cat => cat.trim()).filter(cat => cat.length > 0);
            const allItems = [];
            
            // Collect all items from specified categories
            for (const category of categoryList) {
                const categoryItems = ItemUtils.getItemsByCategory(category);
                allItems.push(...categoryItems);
            }
            
            if (allItems.length === 0) {
                console.warn(`No items found for categories: ${categories}`);
                return;
            }
            
            // Select items based on rarity
            const selectedItems = ItemUtils.selectItemsByRarity(allItems, itemCount);
            
            // Add selected items to container (convert item.id to string for consistency)
            for (const selection of selectedItems) {
                container[selection.item.id.toString()] = selection.quantity;
            }
            
            this.save();
        }
        
        static isContainerEmpty(containerId) {
            const container = this._containers[containerId];
            if (!container) return true;
            
            for (const itemId in container) {
                if (container[itemId] > 0) {
                    return false;
                }
            }
            return true;
        }
        
        static addItem(containerId, itemId, amount, isExtradimensional = false) {
            const container = isExtradimensional ? 
                this._extradimensionalContainer : 
                this.getContainer(containerId);
            
            const itemKey = itemId.toString(); // Ensure consistent string keys
            if (!container[itemKey]) {
                container[itemKey] = 0;
            }
            container[itemKey] += amount;
            this.save();
        }
        
        static removeItem(containerId, itemId, amount, isExtradimensional = false) {
            const container = isExtradimensional ? 
                this._extradimensionalContainer : 
                this.getContainer(containerId);
            
            const itemKey = itemId.toString(); // Ensure consistent string keys
            if (container[itemKey]) {
                container[itemKey] -= amount;
                if (container[itemKey] <= 0) {
                    delete container[itemKey];
                }
                this.save();
            }
        }
        
        static getItemAmount(containerId, itemId, isExtradimensional = false) {
            const container = isExtradimensional ? 
                this._extradimensionalContainer : 
                this.getContainer(containerId);
            const itemKey = itemId.toString(); // Ensure consistent string keys
            return container[itemKey] || 0;
        }
        
        static save() {
            $gameSystem._containerData = {
                containers: this._containers,
                extradimensional: this._extradimensionalContainer
            };
        }
        
        static load() {
            if ($gameSystem._containerData) {
                this._containers = $gameSystem._containerData.containers || {};
                this._extradimensionalContainer = $gameSystem._containerData.extradimensional || {};
            }
        }
    }
    
    // Container Scene
    class Scene_Container extends Scene_MenuBase {
        constructor() {
            super();
            this._containerId = null;
            this._isExtradimensional = false;
        }
        
        prepare(containerId, isExtradimensional = false) {
            this._containerId = containerId;
            this._isExtradimensional = isExtradimensional;
        }
        
        create() {
            super.create();
            this.createHelpWindow();
            this.createCommandWindow();
            this.createInventoryWindow();
            this.createContainerWindow();
            this.createNumberWindow();
        }
        
        createHelpWindow() {
            this._helpWindow = new Window_Help(this.helpWindowRect());
            this._helpWindow.setText(this._isExtradimensional ? 
                getText('extradimensionalTitle') : 
                getText('containerTitle'));
            this.addWindow(this._helpWindow);
        }
        
        createCommandWindow() {
            const rect = this.commandWindowRect();
            this._commandWindow = new Window_ContainerCommand(rect);
            this._commandWindow.setHandler('store', this.commandStore.bind(this));
            this._commandWindow.setHandler('retrieve', this.commandRetrieve.bind(this));
            this._commandWindow.setHandler('cancel', this.popScene.bind(this));
            this.addWindow(this._commandWindow);
        }
        
        createInventoryWindow() {
            const rect = this.inventoryWindowRect();
            this._inventoryWindow = new Window_ContainerInventory(rect);
            this._inventoryWindow.setHandler('ok', this.onInventoryOk.bind(this));
            this._inventoryWindow.setHandler('cancel', this.onInventoryCancel.bind(this));
            this._inventoryWindow.hide();
            this.addWindow(this._inventoryWindow);
        }
        
        createContainerWindow() {
            const rect = this.containerWindowRect();
            this._containerWindow = new Window_ContainerContents(rect);
            this._containerWindow.setContainerId(this._containerId, this._isExtradimensional);
            this._containerWindow.setHandler('ok', this.onContainerOk.bind(this));
            this._containerWindow.setHandler('cancel', this.onContainerCancel.bind(this));
            this._containerWindow.hide();
            this.addWindow(this._containerWindow);
        }
        
        createNumberWindow() {
            const rect = this.numberWindowRect();
            this._numberWindow = new Window_ContainerNumber(rect);
            this._numberWindow.setHandler('ok', this.onNumberOk.bind(this));
            this._numberWindow.setHandler('cancel', this.onNumberCancel.bind(this));
            this._numberWindow.hide();
            this.addWindow(this._numberWindow);
        }
        
        helpWindowRect() {
            const wx = 0;
            const wy = 0;
            const ww = Graphics.boxWidth;
            const wh = this.calcWindowHeight(1, false);
            return new Rectangle(wx, wy, ww, wh);
        }
        
        commandWindowRect() {
            const wx = 0;
            const wy = this.helpWindowRect().y + this.helpWindowRect().height;
            const ww = Graphics.boxWidth;
            const wh = this.calcWindowHeight(3, true);
            return new Rectangle(wx, wy, ww, wh);
        }
        
        inventoryWindowRect() {
            const wx = 0;
            const wy = this.commandWindowRect().y + this.commandWindowRect().height;
            const ww = Graphics.boxWidth / 2;
            const wh = Graphics.boxHeight - wy;
            return new Rectangle(wx, wy, ww, wh);
        }
        
        containerWindowRect() {
            const wx = Graphics.boxWidth / 2;
            const wy = this.commandWindowRect().y + this.commandWindowRect().height;
            const ww = Graphics.boxWidth / 2;
            const wh = Graphics.boxHeight - wy;
            return new Rectangle(wx, wy, ww, wh);
        }
        
        numberWindowRect() {
            const wx = Graphics.boxWidth / 4;
            const wy = Graphics.boxHeight / 2 - 100;
            const ww = Graphics.boxWidth / 2;
            const wh = this.calcWindowHeight(3, true);
            return new Rectangle(wx, wy, ww, wh);
        }
        
        commandStore() {
            this._commandWindow.deactivate();
            this._inventoryWindow.activate();
            this._inventoryWindow.show();
            this._inventoryWindow.refresh();
            this._inventoryWindow.select(0);
            this._containerWindow.show();
            this._containerWindow.refresh();
        }
        
        commandRetrieve() {
            this._commandWindow.deactivate();
            this._containerWindow.activate();
            this._containerWindow.show();
            this._containerWindow.refresh();
            this._containerWindow.select(0);
            this._inventoryWindow.show();
            this._inventoryWindow.refresh();
        }
        
        onInventoryOk() {
            const item = this._inventoryWindow.item();
            if (item) {
                const max = $gameParty.numItems(item);
                
                // If quantity is 1, directly store without showing number window
                if (max === 1) {
                    $gameParty.loseItem(item, 1);
                    ContainerManager.addItem(
                        this._containerId, 
                        item.id, 
                        1, 
                        this._isExtradimensional
                    );
                    this._inventoryWindow.refresh();
                    this._containerWindow.refresh();
                    this._inventoryWindow.activate();
                } else {
                    // Show number window for quantities > 1
                    this._numberWindow.setup(item, max, 'store');
                    this._numberWindow.show();
                    this._numberWindow.activate();
                    this._inventoryWindow.deactivate();
                }
            }
        }
        
        
        onInventoryCancel() {
            this._inventoryWindow.deactivate();
            this._inventoryWindow.hide();
            this._containerWindow.hide();
            this._commandWindow.activate();
        }
        
        onContainerOk() {
            const item = this._containerWindow.item();
            if (item) {
                const max = ContainerManager.getItemAmount(
                    this._containerId, 
                    item.id, 
                    this._isExtradimensional
                );
                
                // If quantity is 1, directly retrieve without showing number window
                if (max === 1) {
                    $gameParty.gainItem(item, 1);
                    ContainerManager.removeItem(
                        this._containerId, 
                        item.id, 
                        1, 
                        this._isExtradimensional
                    );
                    this._containerWindow.refresh();
                    this._inventoryWindow.refresh();
                    this._containerWindow.activate();
                } else {
                    // Show number window for quantities > 1
                    this._numberWindow.setup(item, max, 'retrieve');
                    this._numberWindow.show();
                    this._numberWindow.activate();
                    this._containerWindow.deactivate();
                }
            }
        }
        
        onContainerCancel() {
            this._containerWindow.deactivate();
            this._containerWindow.hide();
            this._inventoryWindow.hide();
            this._commandWindow.activate();
        }
        
        onNumberOk() {
            const number = this._numberWindow.number();
            const item = this._numberWindow._item;
            const mode = this._numberWindow._mode;
            
            if (mode === 'store') {
                $gameParty.loseItem(item, number);
                ContainerManager.addItem(
                    this._containerId, 
                    item.id, 
                    number, 
                    this._isExtradimensional
                );
                this._inventoryWindow.refresh();
                this._inventoryWindow.activate();
            } else {
                $gameParty.gainItem(item, number);
                ContainerManager.removeItem(
                    this._containerId, 
                    item.id, 
                    number, 
                    this._isExtradimensional
                );
                this._containerWindow.refresh();
                this._containerWindow.activate();
            }
            
            this._containerWindow.refresh();
            this._inventoryWindow.refresh();
            this._numberWindow.hide();
            this._numberWindow.deactivate();
        }
        
        onNumberCancel() {
            this._numberWindow.hide();
            this._numberWindow.deactivate();
            
            if (this._numberWindow._mode === 'store') {
                this._inventoryWindow.activate();
            } else {
                this._containerWindow.activate();
            }
        }
    }
    
    // Container Command Window
    class Window_ContainerCommand extends Window_Command {
        makeCommandList() {
            this.addCommand(getText('retrieveItems'), 'retrieve');
            this.addCommand(getText('storeItems'), 'store');
            this.addCommand(getText('exit'), 'cancel');
        }
    }
    
    // Container Inventory Window - Single column with rarity colors
    class Window_ContainerInventory extends Window_ItemList {
        initialize(rect) {
            super.initialize(rect);
            this.setCategory('all');
        }
        
        maxCols() {
            return 1;
        }
        
        includes(item) {
            return item && $gameParty.numItems(item) > 0;
        }
        
        isEnabled(item) {
            return item && $gameParty.numItems(item) > 0;
        }
        
        makeItemList() {
            this._data = $gameParty.allItems().filter(item => this.includes(item));
        }
        
        drawItem(index) {
            const item = this.itemAt(index);
            if (item) {
                const rect = this.itemLineRect(index);
                this.changePaintOpacity(this.isEnabled(item));
                
                // Get item rarity for color
                const rarity = ItemUtils.getItemRarity(item);
                
                // Draw item icon
                this.drawIcon(item.iconIndex, rect.x, rect.y);
                
                // Draw item name with rarity color and truncation
                const nameX = rect.x + ImageManager.iconWidth + 4;
                const nameWidth = rect.width - ImageManager.iconWidth - 60;
                this.changeTextColor(rarity.colorCode);
                
                // Truncate name if longer than 12 characters
                let displayName = item.name;
                if (displayName.length > 12) {
                    displayName = displayName.substring(0, 12) + '...';
                }
                
                this.drawText(displayName, nameX, rect.y, nameWidth);
                this.resetTextColor();
                
                // Draw quantity
                const quantity = $gameParty.numItems(item);
                this.drawText('×' + quantity, rect.x, rect.y, rect.width - 4, 'right');
                
                this.changePaintOpacity(1);
            }
        }
    }
    
    // Container Contents Window - Single column with rarity colors
    class Window_ContainerContents extends Window_ItemList {
        initialize(rect) {
            super.initialize(rect);
            this._containerId = null;
            this._isExtradimensional = false;
        }
        
        maxCols() {
            return 1;
        }
        
        setContainerId(containerId, isExtradimensional) {
            this._containerId = containerId;
            this._isExtradimensional = isExtradimensional;
            this.refresh();
        }
        
        makeItemList() {
            this._data = [];
            if (!this._containerId && !this._isExtradimensional) return;
            
            const container = this._isExtradimensional ? 
                ContainerManager.getExtradimensionalContainer() :
                ContainerManager.getContainer(this._containerId);
            
            // Add items from database that exist in container
            for (const itemId in container) {
                const item = $dataItems[parseInt(itemId)]; // Parse itemId to ensure it's a number
                if (item && container[itemId] > 0) {
                    this._data.push(item);
                }
            }
            
            // Sort items by rarity (legendary first) then by name
            this._data.sort((a, b) => {
                const rarityA = ItemUtils.getItemRarity(a);
                const rarityB = ItemUtils.getItemRarity(b);
                
                // First sort by rarity (higher rarity first)
                const rarityOrder = ['Legendary', 'Epic', 'Rare', 'Uncommon', 'Common'];
                const rarityIndexA = rarityOrder.indexOf(rarityA.name);
                const rarityIndexB = rarityOrder.indexOf(rarityB.name);
                
                if (rarityIndexA !== rarityIndexB) {
                    return rarityIndexA - rarityIndexB;
                }
                
                // Then sort by name
                return a.name.localeCompare(b.name);
            });
        }
        
        isEnabled(item) {
            if (!item) return false;
            const amount = ContainerManager.getItemAmount(
                this._containerId, 
                item.id, 
                this._isExtradimensional
            );
            return amount > 0;
        }
        
        drawItem(index) {
            const item = this.itemAt(index);
            if (item) {
                const rect = this.itemLineRect(index);
                this.changePaintOpacity(this.isEnabled(item));
                
                // Get item rarity for color
                const rarity = ItemUtils.getItemRarity(item);
                
                // Draw item icon
                this.drawIcon(item.iconIndex, rect.x, rect.y);
                
                // Draw item name with rarity color and truncation
                const nameX = rect.x + ImageManager.iconWidth + 4;
                const nameWidth = rect.width - ImageManager.iconWidth - 60;
                this.changeTextColor(rarity.colorCode);
                
                // Truncate name if longer than 12 characters
                let displayName = item.name;
                if (displayName.length > 12) {
                    displayName = displayName.substring(0, 12) + '...';
                }
                
                this.drawText(displayName, nameX, rect.y, nameWidth);
                this.resetTextColor();
                
                // Draw quantity
                const amount = ContainerManager.getItemAmount(
                    this._containerId, 
                    item.id, 
                    this._isExtradimensional
                );
                this.drawText('×' + amount, rect.x, rect.y, rect.width - 4, 'right');
                
                this.changePaintOpacity(1);
            }
        }
    }
    
    // Container Number Window
    class Window_ContainerNumber extends Window_Selectable {
        initialize(rect) {
            super.initialize(rect);
            this._item = null;
            this._max = 1;
            this._number = 1;
            this._mode = 'store';
        }
        
        setup(item, max, mode) {
            this._item = item;
            this._max = max;
            this._number = 1;
            this._mode = mode;
            this.refresh();
        }
        
        number() {
            return this._number;
        }
        
        refresh() {
            this.contents.clear();
            
            // Draw item name with rarity color
            const rarity = ItemUtils.getItemRarity(this._item);
            this.changeTextColor(rarity.colorCode);
            this.drawItemName(this._item, 0, 0);
            this.resetTextColor();
            
            this.drawNumber();
        }
        
        drawNumber() {
            const x = this.itemPadding();
            const y = this.lineHeight();
            const width = this.innerWidth - x * 2;
            this.changeTextColor(ColorManager.systemColor());
            this.drawText(this._mode === 'store' ? getText('store') : getText('retrieve'), x, y, width);
            this.resetTextColor();
            this.drawText(this._number, x, y, width, 'right');
        }
        
        update() {
            super.update();
            if (this.active) {
                if (Input.isRepeated('right')) {
                    this.changeNumber(1);
                }
                if (Input.isRepeated('left')) {
                    this.changeNumber(-1);
                }
                if (Input.isRepeated('up')) {
                    this.changeNumber(10);
                }
                if (Input.isRepeated('down')) {
                    this.changeNumber(-10);
                }
            }
        }
        
        changeNumber(amount) {
            this._number = (this._number + amount).clamp(1, this._max);
            SoundManager.playCursor();
            this.refresh();
        }
        
        isOkEnabled() {
            return this._number > 0;
        }
        
        processOk() {
            if (this.isOkEnabled()) {
                this.playOkSound();
                this.updateInputData();
                this.deactivate();
                this.callOkHandler();
            } else {
                this.playBuzzerSound();
            }
        }
    }
    
    // Plugin Commands
    PluginManager.registerCommand(pluginName, 'openContainer', args => {
        const mapId = $gameMap.mapId();
        const eventId = $gameMap._interpreter.eventId();
        const containerId = ContainerManager.getContainerId(mapId, eventId);
        
        SceneManager.push(Scene_Container);
        SceneManager.prepareNextScene(containerId, false);
    });
    
    PluginManager.registerCommand(pluginName, 'openExtradimensionalContainer', args => {
        SceneManager.push(Scene_Container);
        SceneManager.prepareNextScene(null, true);
    });

    PluginManager.registerCommand(pluginName, 'openCamperContainer', args => {
        SceneManager.push(Scene_Container);
        SceneManager.prepareNextScene(null, true);
    });
    PluginManager.registerCommand(pluginName, 'openCarContainer', args => {
        SceneManager.push(Scene_Container);
        SceneManager.prepareNextScene(null, true);
    });
    
    PluginManager.registerCommand(pluginName, 'generateContainerItems', args => {
        const mapId = $gameMap.mapId();
        const eventId = $gameMap._interpreter.eventId();
        const containerId = ContainerManager.getContainerId(mapId, eventId);
        const categories = args.categories || 'Food';
        const itemCount = parseInt(args.itemCount) || 3;
        
        ContainerManager.generateContainerItems(containerId, categories, itemCount);
    });
    
    // Initialize on game load
    const _DataManager_createGameObjects = DataManager.createGameObjects;
    DataManager.createGameObjects = function() {
        _DataManager_createGameObjects.call(this);
        ContainerManager.initialize();
    };
    
    const _DataManager_makeSaveContents = DataManager.makeSaveContents;
    DataManager.makeSaveContents = function() {
        const contents = _DataManager_makeSaveContents.call(this);
        ContainerManager.save();
        return contents;
    };
    
    const _DataManager_extractSaveContents = DataManager.extractSaveContents;
    DataManager.extractSaveContents = function(contents) {
        _DataManager_extractSaveContents.call(this, contents);
        ContainerManager.load();
    };
    
})();
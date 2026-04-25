/*:
 * @target MZ
 * @plugindesc Shop Management System v2.1.1
 * @author Omni-Lex
 * @url
 * @help
 * ============================================================================
 * Shop Management Plugin for RPG Maker MZ
 * ============================================================================
 *
 * This plugin creates a comprehensive shop management system with support
 * for multiple shops, role-based gameplay, production, delivery, and inventory.
 *
 * Setup Instructions:
 * 1. Tag items with <Category: [YourCategory]> in their note box
 * 2. Add recipes to items: <Recipe: 582x2, 583x1, 585x2, 584x1>
 * 3. Create "Delivery" events on maps where deliveries can be made
 * 4. Material items should be in the ID range 565-587
 * 5. Initialize shops with initializeShop command before use
 *
 * Price Display:
 * - Prices are displayed in euros using conversion: 1200 gold = 12€
 * - Example: 1212 gold = 12.12€
 *
 * @param defaultPriceMultiplier
 * @text Default Price Multiplier
 * @desc Multiplier for base item prices
 * @type number
 * @decimals 2
 * @default 1.5
 *
 * @param producingInterval
 * @text NPC Producing Interval
 * @desc Frames between automatic NPC production attempts
 * @type number
 * @default 300
 *
 * @param deliveryMinGold
 * @text Minimum Delivery Gold
 * @desc Minimum gold earned from deliveries
 * @type number
 * @default 10000
 *
 * @param deliveryMaxGold
 * @text Maximum Delivery Gold
 * @desc Maximum gold earned from deliveries
 * @type number
 * @default 40000
 *
 * @param materialStartId
 * @text Material Start ID
 * @desc Starting item ID for materials
 * @type number
 * @default 565
 *
 * @param materialEndId
 * @text Material End ID
 * @desc Ending item ID for materials
 * @type number
 * @default 587
 *
 * @param producingTileId
 * @text Producing Tile ID
 * @desc Tile ID where NPC must stand to produce (default: 108)
 * @type number
 * @default 108
 *
 * @param npcProducerEventId
 * @text NPC Producer Event ID
 * @desc Event ID of the NPC producer on the current map
 * @type number
 * @default 1
 *
 * @param randomQuantityMin
 * @text Random Quantity Minimum
 * @desc Minimum random starting quantity for event items
 * @type number
 * @default 1
 *
 * @param defaultStockItems
 * @text Default Stock Items Count
 * @desc Number of random category items to add to starting stock (3-8)
 * @type number
 * @default 5
 *
 * @command initializeShop
 * @text Initialize Shop
 * @desc Initialize a new shop with category and switch
 *
 * @arg shopId
 * @text Shop ID
 * @type text
 * @default shop1
 *
 * @arg category
 * @text Item Category
 * @type text
 * @default Food
 * @desc Category tag for items this shop can produce/sell
 *
 * @arg switchId
 * @text Control Switch ID
 * @type switch
 * @default 1
 * @desc Switch that controls this shop's operation
 *
 * @arg eventIds
 * @text Event IDs for Random Stock
 * @type text
 * @default
 * @desc Comma-separated list of item IDs to add random starting quantities (e.g., 1,2,3,4)
 *
 * @command setCurrentShop
 * @text Set Current Shop
 * @desc Set the active shop for operations
 *
 * @arg shopId
 * @text Shop ID
 * @type text
 * @default shop1
 *
 * @command openShopManagement
 * @text Open Shop Management
 * @desc Opens the shop management interface
 *
 * @command closeShopPermanently
 * @text Close Shop Permanently
 * @desc Permanently close a shop and reset its data
 *
 * @arg shopId
 * @text Shop ID
 * @type text
 * @default shop1
 *
 * @command startWork
 * @text Start Work
 * @desc Removes actors 2 & 3, activates job systems
 *
 * @command stopWork
 * @text Stop Work
 * @desc Re-adds actors 2 & 3, deactivates job systems
 *
 * @command switchRole
 * @text Switch Role
 * @desc Switch between Manager, Cook, and Rider roles
 *
 * @arg role
 * @text Role
 * @type select
 * @option Manager
 * @option Producer
 * @option Rider
 * @default Manager
 *
 * @command newDelivery
 * @text New Delivery
 * @desc Start a new delivery to a random visited map
 *
 * @command completeDelivery
 * @text Complete Delivery
 * @desc Complete current delivery and earn gold
 *
 * @command orderMaterials
 * @text Order Materials
 * @desc Order materials from warehouse
 *
 * @arg materialId
 * @text Material Item ID
 * @type number
 * @min 565
 * @max 587
 * @default 565
 *
 * @arg amount
 * @text Amount
 * @type number
 * @min 1
 * @default 10
 *
 * @command setMenuPrice
 * @text Set Menu Price
 * @desc Set price for a food item
 *
 * @arg itemId
 * @text Item ID
 * @type item
 * @default 1
 *
 * @arg price
 * @text Price
 * @type number
 * @min 1
 * @default 100
 *
 * @command produceItem
 * @text Produce Item
 * @desc Manually produce an item
 *
 * @arg shopId
 * @text Shop ID
 * @type text
 * @default shop1
 *
 * @arg itemId
 * @text Item ID
 * @type item
 * @default 1
 *
 * @command startProducingMiniGame
 * @text Start Producing Mini-Game
 * @desc Start the producing mini-game (placeholder)
 *
 * @command showDeliveryInfo
 * @text Show Delivery Info
 * @desc Shows current delivery destination, NPC info and timer
 *
 * @param deliveryTimeLimit
 * @text Delivery Time Limit
 * @desc Time limit for deliveries in seconds
 * @type number
 * @default 120
 */

(() => {
  "use strict";

  const pluginName = "ShopManagement";
  const parameters = PluginManager.parameters(pluginName);

  const defaultPriceMultiplier = Number(
    parameters["defaultPriceMultiplier"] || 1.5
  );
  const producingInterval = Number(parameters["producingInterval"] || 300);
  const deliveryMinGold = Number(parameters["deliveryMinGold"] || 10000);
  const deliveryMaxGold = Number(parameters["deliveryMaxGold"] || 40000);
  const materialStartId = Number(parameters["materialStartId"] || 565);
  const materialEndId = Number(parameters["materialEndId"] || 587);
  const deliveryTimeLimit = Number(parameters["deliveryTimeLimit"] || 120);
  const producingTileId = Number(parameters["producingTileId"] || 108);
  const npcProducerEventId = Number(parameters["npcProducerEventId"] || 1);
  const randomQuantityMin = Number(parameters["randomQuantityMin"] || 1);
  const randomQuantityMax = Number(parameters["randomQuantityMax"] || 10);
  const defaultStockItems = Number(parameters["defaultStockItems"] || 5);
  function refreshEconomy() {
    const currentShop = getCurrentShop();
    if (currentShop && currentShop.isAutoOperating) {
        currentShop.refreshEconomy();
    }
    
    // Optionally refresh all shops
    for (const shopId in shopData.shops) {
        const shop = shopData.shops[shopId];
        if (shop.isAutoOperating && shop !== currentShop) {
            shop.refreshEconomy();
        }
    }
}

  // Helper function to convert gold to euros
  function goldToEuros(goldAmount) {
    return (goldAmount / 100).toFixed(2);
  }

  // Helper function to format price in euros
  function formatEuroPrice(goldAmount) {
    return `€${goldToEuros(goldAmount)}`;
  }

  // Plugin Data Structure - Now supports multiple shops
  let shopData = {
    shops: {},
    currentShopId: null,
    globalData: {
      visitedMaps: [],
      currentDelivery: null,
      deliveryNPC: {
        name: "",
        spriteIndex: 0,
        spriteName: "",
      },
    },
  };

  // Helper function to generate random warehouse materials
  function generateRandomWarehouseMaterials() {
    const materials = {};
    const numMaterials = Math.floor(Math.random() * 8) + 5; // 5-12 different materials
    const availableMaterialIds = [];

    // Create array of available material IDs
    for (let id = materialStartId; id <= materialEndId; id++) {
      if ($dataItems[id]) {
        availableMaterialIds.push(id);
      }
    }

    // Shuffle and select random materials
    const shuffledIds = [...availableMaterialIds].sort(
      () => Math.random() - 0.5
    );
    const selectedIds = shuffledIds.slice(
      0,
      Math.min(numMaterials, availableMaterialIds.length)
    );

    // Assign random quantities to selected materials
    for (const materialId of selectedIds) {
      const randomQuantity = Math.floor(Math.random() * 30) + 10; // 10-39 quantity
      materials[materialId] = randomQuantity;
    }

    return materials;
  }

  // Shop class structure
  class Shop {
    constructor(id, category, switchId, eventIds = "") {
      this.id = id;
      this.category = category;
      this.switchId = switchId;
      this.isWorking = false;
      this.currentRole = "Manager";
      this.menuPrices = {};
      this.stockInventory = {};
      this.warehouseInventory = {};
      this.npcProducingTimer = 0;
      this.productionQueue = [];
      this.balance = 200000; // Starting balance: 2000.00€
      this.lastUpdateTime = Date.now();
      this.isAutoOperating = true; // Shop operates automatically
      this.salesPerHour = 12; // Average sales per hour
      this.productionPerHour = 8; // Average production per hour
      this.restockThreshold = 3; // Restock when materials drop below this
      this.maxMaterialStock = 50; // Maximum materials to keep in warehouse
      // Initialize with default items
      this.initializeDefaultInventory();

      // Add random quantities for specified event IDs
      if (eventIds && eventIds.trim()) {
        this.addRandomEventItems(eventIds);
      }
    }
    // NEW METHOD: Main economy refresh function
    refreshEconomy() {
        const currentTime = Date.now();
        const timeDifference = currentTime - this.lastUpdateTime;
        const hoursElapsed = timeDifference / (1000 * 60 * 60); // Convert to hours
        
        if (hoursElapsed < 0.1) return; // Skip if less than 6 minutes passed
        
        console.log(`Refreshing economy for ${this.id}: ${hoursElapsed.toFixed(2)} hours elapsed`);
        
        // Process automatic operations
        this.simulateSales(hoursElapsed);
        this.simulateProduction(hoursElapsed);
        this.simulateRestocking(hoursElapsed);
        
        // Update last update time
        this.lastUpdateTime = currentTime;
        
        console.log(`${this.id} balance after refresh: ${formatEuroPrice(this.balance)}`);
    }
    
    // NEW METHOD: Simulate sales over time
    simulateSales(hoursElapsed) {
        const expectedSales = Math.floor(this.salesPerHour * hoursElapsed * (0.5 + Math.random()));
        let actualSales = 0;
        
        // Get available stock items
        const availableSlots = [];
        for (let slotIndex = 1; slotIndex <= 7; slotIndex++) {
            const slot = this.stockInventory[slotIndex];
            if (slot && slot.amount > 0) {
                availableSlots.push({
                    slotIndex: slotIndex,
                    itemId: slot.itemId,
                    amount: slot.amount,
                    price: this.menuPrices[slot.itemId] || 1000
                });
            }
        }
        
        if (availableSlots.length === 0) {
            console.log(`${this.id}: No items available for sale`);
            return;
        }
        
        // Simulate sales
        for (let i = 0; i < expectedSales && availableSlots.length > 0; i++) {
            // Select random item to sell (weighted by availability)
            const randomSlot = availableSlots[Math.floor(Math.random() * availableSlots.length)];
            
            // Sell one unit
            this.stockInventory[randomSlot.slotIndex].amount--;
            this.balance += randomSlot.price;
            actualSales++;
            
            // Remove from available slots if sold out
            if (this.stockInventory[randomSlot.slotIndex].amount <= 0) {
                this.stockInventory[randomSlot.slotIndex] = null;
                const slotIndex = availableSlots.indexOf(randomSlot);
                if (slotIndex > -1) {
                    availableSlots.splice(slotIndex, 1);
                }
            } else {
                // Update amount in availableSlots
                randomSlot.amount = this.stockInventory[randomSlot.slotIndex].amount;
            }
        }
        
        if (actualSales > 0) {
            const revenue = actualSales * 1200; // Average price estimate
            console.log(`${this.id}: Sold ${actualSales} items, earned ${formatEuroPrice(revenue)}`);
        }
    }
    
    // NEW METHOD: Simulate production over time
    simulateProduction(hoursElapsed) {
        const expectedProduction = Math.floor(this.productionPerHour * hoursElapsed * (0.7 + Math.random() * 0.6));
        let actualProduction = 0;
        
        // Get category items that can be produced
        const categoryItems = $dataItems.filter(item => 
            item && isItemInCategory(item, this.category));
        
        if (categoryItems.length === 0) return;
        
        // Attempt production
        for (let i = 0; i < expectedProduction; i++) {
            const randomItem = categoryItems[Math.floor(Math.random() * categoryItems.length)];
            const recipe = getRecipe(randomItem);
            
            if (recipe && hasIngredients(recipe, this)) {
                consumeIngredients(recipe, this);
                if (addToStock(randomItem.id, 1, this)) {
                    actualProduction++;
                }
            } else if (!recipe) {
                // Items without recipes can be produced for free
                if (addToStock(randomItem.id, 1, this)) {
                    actualProduction++;
                }
            }
        }
        
        if (actualProduction > 0) {
            console.log(`${this.id}: Produced ${actualProduction} items`);
        }
    }
    
    // NEW METHOD: Simulate automatic restocking
    simulateRestocking(hoursElapsed) {
        let totalRestockCost = 0;
        
        // Check each material type and restock if needed
        for (let materialId = materialStartId; materialId <= materialEndId; materialId++) {
            const item = $dataItems[materialId];
            if (!item) continue;
            
            const currentStock = this.warehouseInventory[materialId] || 0;
            
            // Restock if below threshold
            if (currentStock < this.restockThreshold) {
                const restockAmount = this.maxMaterialStock - currentStock;
                const costPerUnit = Math.floor(item.price * 0.8); // Materials cost 80% of base price
                const totalCost = restockAmount * costPerUnit;
                
                // Check if shop can afford restocking
                if (this.balance >= totalCost) {
                    this.warehouseInventory[materialId] = (this.warehouseInventory[materialId] || 0) + restockAmount;
                    this.balance -= totalCost;
                    totalRestockCost += totalCost;
                    
                    console.log(`${this.id}: Restocked ${restockAmount}x ${item.name} for ${formatEuroPrice(totalCost)}`);
                } else {
                    console.log(`${this.id}: Cannot afford to restock ${item.name} (need ${formatEuroPrice(totalCost)})`);
                }
            }
        }
        
        if (totalRestockCost > 0) {
            console.log(`${this.id}: Total restocking cost: ${formatEuroPrice(totalRestockCost)}`);
        }
    }
    
    // NEW METHOD: Get shop financial status
    getFinancialStatus() {
        return {
            balance: this.balance,
            balanceFormatted: formatEuroPrice(this.balance),
            lastUpdate: new Date(this.lastUpdateTime).toLocaleString(),
            hoursInactive: (Date.now() - this.lastUpdateTime) / (1000 * 60 * 60)
        };
    }
    
    // NEW METHOD: Manual balance adjustment (for debugging/events)
    adjustBalance(amount, reason = "Manual adjustment") {
        this.balance += amount;
        console.log(`${this.id}: ${reason} - Balance changed by ${formatEuroPrice(amount)} to ${formatEuroPrice(this.balance)}`);
    }
    // Replace the Shop constructor's initializeDefaultInventory method
    initializeDefaultInventory() {
      // Initialize warehouse with random materials from 565-587 range
      this.warehouseInventory = generateRandomWarehouseMaterials();

      // Initialize stock as 7 slots with max 9 items each
      this.stockInventory = {};
      this.stockSlots = 7;
      this.maxItemsPerSlot = 9;

      // Find all items with matching category tag for stock
      const categoryItems = [];
      for (let i = 1; i < $dataItems.length; i++) {
        const item = $dataItems[i];
        if (item && isItemInCategory(item, this.category)) {
          categoryItems.push(item);
        }
      }

      // If no category items found, use fallback items
      if (categoryItems.length === 0) {
        console.warn(
          `No items found with category "${this.category}". Using fallback items.`
        );
        // Add some basic fallback items to first 2 slots
        this.stockInventory[1] = {
          itemId: 1,
          amount: Math.floor(Math.random() * 2) + 1,
        };
        this.stockInventory[2] = {
          itemId: 2,
          amount: Math.floor(Math.random() * 2) + 1,
        };
      } else {
        // Randomly select 7 items from category items (or less if not enough available)
        const shuffledItems = [...categoryItems].sort(
          () => Math.random() - 0.5
        );
        const selectedItems = shuffledItems.slice(
          0,
          Math.min(7, categoryItems.length)
        );

        // Initialize each slot with a random item and 1-2 copies
        for (let slotIndex = 1; slotIndex <= 7; slotIndex++) {
          if (selectedItems[slotIndex - 1]) {
            const item = selectedItems[slotIndex - 1];
            const randomAmount = Math.floor(Math.random() * 2) + 1; // 1-2 copies

            this.stockInventory[slotIndex] = {
              itemId: item.id,
              amount: randomAmount,
            };

            console.log(
              `Slot ${slotIndex}: Added ${randomAmount}x ${item.name} (Category: ${this.category})`
            );
          } else {
            // Empty slot
            this.stockInventory[slotIndex] = null;
          }
        }
      }

      // Set default prices for all items in slots
      for (let slotIndex = 1; slotIndex <= 7; slotIndex++) {
        const slot = this.stockInventory[slotIndex];
        if (slot) {
          const item = $dataItems[slot.itemId];
          if (item) {
            this.menuPrices[slot.itemId] = Math.floor(
              item.price * defaultPriceMultiplier
            );
          }
        }
      }
    }

    addRandomEventItems(eventIds) {
      const idList = eventIds
        .split(",")
        .map((id) => id.trim())
        .filter((id) => id);

      // Check if these are material IDs (565-587) for warehouse override
      const materialIds = idList.filter((id) => {
        const itemId = Number(id);
        return itemId >= materialStartId && itemId <= materialEndId;
      });

      const stockIds = idList.filter((id) => {
        const itemId = Number(id);
        return itemId < materialStartId || itemId > materialEndId;
      });

      // If material IDs are provided, replace warehouse inventory
      if (materialIds.length > 0) {
        console.log(
          `Overriding warehouse with specified materials: ${materialIds.join(
            ", "
          )}`
        );
        this.warehouseInventory = {}; // Clear existing warehouse

        for (const itemIdStr of materialIds) {
          const itemId = Number(itemIdStr);

          // Validate item exists
          if (!$dataItems[itemId]) {
            console.warn(
              `Material ID ${itemId} not found in database, skipping.`
            );
            continue;
          }

          // Generate random quantity for warehouse materials
          const randomQuantity = Math.floor(Math.random() * 30) + 10; // 10-39 quantity
          this.warehouseInventory[itemId] = randomQuantity;

          console.log(
            `Added ${randomQuantity}x ${$dataItems[itemId].name} to ${this.id} warehouse`
          );
        }
      }

      // Add non-material IDs to stock
      for (const itemIdStr of stockIds) {
        const itemId = Number(itemIdStr);

        // Validate item exists
        if (!$dataItems[itemId]) {
          console.warn(`Item ID ${itemId} not found in database, skipping.`);
          continue;
        }

        // Generate random quantity for stock items
        const randomQuantity =
          Math.floor(
            Math.random() * (randomQuantityMax - randomQuantityMin + 1)
          ) + randomQuantityMin;

        // Add to stock inventory
        this.stockInventory[itemId] =
          (this.stockInventory[itemId] || 0) + randomQuantity;

        // Set default price if not already set
        if (!this.menuPrices[itemId]) {
          const item = $dataItems[itemId];
          this.menuPrices[itemId] = Math.floor(
            item.price * defaultPriceMultiplier
          );
        }

        console.log(
          `Added ${randomQuantity}x ${$dataItems[itemId].name} to ${this.id} stock`
        );
      }
    }
  }

  // Save/Load System
  const _DataManager_makeSaveContents = DataManager.makeSaveContents;
  DataManager.makeSaveContents = function () {
    const contents = _DataManager_makeSaveContents.call(this);
    contents.shopManagement = shopData;
    return contents;
  };

  const _DataManager_extractSaveContents = DataManager.extractSaveContents;
  DataManager.extractSaveContents = function (contents) {
    _DataManager_extractSaveContents.call(this, contents);
    if (contents.shopManagement) {
      shopData = contents.shopManagement;
    }
  };

  // Get current shop
  function getCurrentShop() {
    if (!shopData.currentShopId) return null;
    return shopData.shops[shopData.currentShopId];
  }

  // Track visited maps
  const _Game_Player_performTransfer = Game_Player.prototype.performTransfer;
  Game_Player.prototype.performTransfer = function () {
    _Game_Player_performTransfer.call(this);
    if (!shopData.globalData.visitedMaps.includes($gameMap.mapId())) {
      shopData.globalData.visitedMaps.push($gameMap.mapId());
    }
  };

  // Helper Functions
  function isItemInCategory(item, category) {
    if (!item) return false;
    const regex = new RegExp(`<Category:\\s*${category}>`, "i");
    return regex.test(item.note);
  }

  function getRecipe(item) {
    if (!item || !item.note) return null;
    const match = item.note.match(/<Recipe:\s*(.+)>/i);
    if (!match) return null;

    const recipe = {};
    const ingredients = match[1].split(",");
    ingredients.forEach((ing) => {
      const [itemId, amount] = ing
        .trim()
        .split("x")
        .map((n) => parseInt(n));
      recipe[itemId] = amount;
    });
    return recipe;
  }

  function hasIngredients(recipe, shop) {
    for (const [itemId, amount] of Object.entries(recipe)) {
      const currentAmount = shop.warehouseInventory[itemId] || 0;
      if (currentAmount < amount) return false;
    }
    return true;
  }

  function consumeIngredients(recipe, shop) {
    for (const [itemId, amount] of Object.entries(recipe)) {
      shop.warehouseInventory[itemId] =
        (shop.warehouseInventory[itemId] || 0) - amount;
      if (shop.warehouseInventory[itemId] <= 0) {
        delete shop.warehouseInventory[itemId];
      }
    }
  }

  function addToStock(itemId, amount = 1, shop, specificSlot = null) {
    // If specific slot is provided, add to that slot only
    if (specificSlot !== null && specificSlot >= 1 && specificSlot <= 7) {
      const slot = shop.stockInventory[specificSlot];
      if (!slot) {
        // Empty slot - create new entry
        shop.stockInventory[specificSlot] = {
          itemId: itemId,
          amount: Math.min(amount, shop.maxItemsPerSlot),
        };
        return true;
      } else if (slot.itemId === itemId) {
        // Same item - add amount up to max
        const newAmount = Math.min(slot.amount + amount, shop.maxItemsPerSlot);
        slot.amount = newAmount;
        return true;
      }
      return false; // Slot occupied by different item
    }

    // Find existing slot with same item
    for (let slotIndex = 1; slotIndex <= 7; slotIndex++) {
      const slot = shop.stockInventory[slotIndex];
      if (
        slot &&
        slot.itemId === itemId &&
        slot.amount < shop.maxItemsPerSlot
      ) {
        const spaceAvailable = shop.maxItemsPerSlot - slot.amount;
        const amountToAdd = Math.min(amount, spaceAvailable);
        slot.amount += amountToAdd;
        return true;
      }
    }

    // Find empty slot
    for (let slotIndex = 1; slotIndex <= 7; slotIndex++) {
      if (!shop.stockInventory[slotIndex]) {
        shop.stockInventory[slotIndex] = {
          itemId: itemId,
          amount: Math.min(amount, shop.maxItemsPerSlot),
        };
        return true;
      }
    }

    return false; // No space available
  }

  // Replace the removeFromStock function
  function removeFromStock(itemId, amount = 1, shop, specificSlot = null) {
    if (specificSlot !== null && specificSlot >= 1 && specificSlot <= 7) {
      const slot = shop.stockInventory[specificSlot];
      if (!slot || slot.itemId !== itemId) return false;

      if (slot.amount >= amount) {
        slot.amount -= amount;
        if (slot.amount <= 0) {
          shop.stockInventory[specificSlot] = null;
        }
        return true;
      }
      return false;
    }

    // Find slot with the item
    for (let slotIndex = 1; slotIndex <= 7; slotIndex++) {
      const slot = shop.stockInventory[slotIndex];
      if (slot && slot.itemId === itemId) {
        if (slot.amount >= amount) {
          slot.amount -= amount;
          if (slot.amount <= 0) {
            shop.stockInventory[slotIndex] = null;
          }
          return true;
        }
      }
    }

    return false;
  }

  function findDeliveryMaps() {
    const validMaps = [];
    for (const mapId of shopData.globalData.visitedMaps) {
      validMaps.push(mapId);
    }
    return validMaps;
  }

  function getMapDisplayName(mapId) {
    let mapName = `Map ${mapId}`;

    if (window.$dataMapInfos && $dataMapInfos[mapId]) {
      const mapInfo = $dataMapInfos[mapId];
      mapName = mapInfo.name;

      if ($gameMap.mapId() === mapId) {
        mapName = $gameMap.displayName() || mapInfo.name;
      }
    }

    return mapName;
  }

  // Plugin Commands
  PluginManager.registerCommand(pluginName, "initializeShop", (args) => {
    refreshEconomy(); // ADD THIS LINE
    const shopId = args.shopId;
    const category = args.category;
    const switchId = Number(args.switchId);
    const eventIds = args.eventIds || "";

    // Create new shop with event IDs
    shopData.shops[shopId] = new Shop(shopId, category, switchId, eventIds);

    // Set as current shop if none selected
    if (!shopData.currentShopId) {
      shopData.currentShopId = shopId;
    }

    // Turn on the switch
    $gameSwitches.setValue(switchId, true);
    window.skipLocalization = true;
    $gameMessage.add(`\\C[3]Shop "${shopId}" initialized!`);
    $gameMessage.add(`\\C[1]Category: ${category}`);
    $gameMessage.add(
      `\\C[2]Random category items added to stock and materials to warehouse.`
    );

    // Show information about added event items
    if (eventIds && eventIds.trim()) {
      $gameMessage.add(
        `\\C[4]Additional random quantities added for items: ${eventIds}`
      );
    }
    window.skipLocalization = false;

  });

  PluginManager.registerCommand(pluginName, "setCurrentShop", (args) => {
    refreshEconomy(); // ADD THIS LINE
    const shopId = args.shopId;
    window.skipLocalization = true;

    if (!shopData.shops[shopId]) {
      $gameMessage.add(`\\C[2]Shop "${shopId}" not found!`);
      return;
    }

    shopData.currentShopId = shopId;
    $gameMessage.add(`\\C[3]Current shop set to: ${shopId}`);
    window.skipLocalization = false;

  });

  PluginManager.registerCommand(pluginName, "openShopManagement", (args) => {
    refreshEconomy(); // ADD THIS LINE
    SceneManager.push(Scene_ShopManagement);
  });

  PluginManager.registerCommand(pluginName, "closeShopPermanently", (args) => {
    refreshEconomy(); // ADD THIS LINE
    const shopId = args.shopId;
    const shop = shopData.shops[shopId];
    window.skipLocalization = true;

    if (!shop) {
      $gameMessage.add(`\\C[2]Shop "${shopId}" not found!`);
      return;
    }
    window.skipLocalization = false;

    // Turn off the switch
    $gameSwitches.setValue(shop.switchId, false);

    // Delete shop data
    delete shopData.shops[shopId];

    // Clear current shop if it was this one
    if (shopData.currentShopId === shopId) {
      shopData.currentShopId = null;
    }
    window.skipLocalization = true;

    $gameMessage.add(`\\C[2]Shop "${shopId}" permanently closed!`);
    window.skipLocalization = false;

  });

  PluginManager.registerCommand(pluginName, "startWork", (args) => {
    refreshEconomy(); // ADD THIS LINE
    const shop = getCurrentShop();
    if (!shop) {
      $gameMessage.add("\\C[2]No shop selected! Initialize a shop first.");
      return;
    }

    shop.isWorking = true;

    // Remove actors 2 and 3 from party
    if ($gameParty._actors.includes(2)) {
      $gameParty.removeActor(2);
    }
    if ($gameParty._actors.includes(3)) {
      $gameParty.removeActor(3);
    }

    // Start NPC systems
    shop.npcProducingTimer = 0;
    window.skipLocalization = true;

    $gameMessage.add(`\\C[3]${shop.id} is now open for business!`);
    window.skipLocalization = false;

  });

  PluginManager.registerCommand(pluginName, "stopWork", (args) => {
    refreshEconomy(); // ADD THIS LINE
    const shop = getCurrentShop();
    if (!shop) return;

    shop.isWorking = false;

    // Re-add actors 2 and 3 to party
    $gameParty.addActor(2);
    $gameParty.addActor(3);

    // Stop NPC systems
    shop.npcProducingTimer = 0;
    shopData.globalData.currentDelivery = null;

    $gameMessage.add("\\C[2]Work shift ended. Time to rest!");
  });

  PluginManager.registerCommand(pluginName, "switchRole", (args) => {
    refreshEconomy(); // ADD THIS LINE
    const shop = getCurrentShop();
    if (!shop) return;

    shop.currentRole = args.role;
    $gameMessage.add(`\\C[1]Switched to ${args.role} role!`);
  });

  PluginManager.registerCommand(pluginName, "newDelivery", (args) => {
    refreshEconomy(); // ADD THIS LINE
    const validMaps = findDeliveryMaps();
    if (validMaps.length === 0) {
      $gameMessage.add("\\C[2]No delivery locations available!");
      return;
    }

    const randomMap = validMaps[Math.floor(Math.random() * validMaps.length)];

    // Generate random NPC details
    const npcNames = [
      "Sarah",
      "Mike",
      "Emma",
      "John",
      "Lisa",
      "David",
      "Amy",
      "Tom",
      "Jessica",
      "Robert",
    ];
    const npcSprites = [
      "Actor1",
      "Actor2",
      "Actor3",
      "People1",
      "People2",
      "People3",
      "People4",
    ];

    shopData.globalData.currentDelivery = {
      mapId: randomMap,
      startTime: Date.now(),
    };

    shopData.globalData.deliveryNPC = {
      name: npcNames[Math.floor(Math.random() * npcNames.length)],
      spriteName: npcSprites[Math.floor(Math.random() * npcSprites.length)],
      spriteIndex: Math.floor(Math.random() * 8),
    };

    // Start the 2-minute timer
    $gameTimer.start(deliveryTimeLimit * 60);

    // This would activate the Delivery event's self switch A
    $gameSelfSwitches.setValue([randomMap, 1, "A"], true);

    // Get map name
    const mapName = getMapDisplayName(randomMap);

    $gameMessage.add(`\\C[3]New delivery order!`);
    $gameMessage.add(`\\C[1]Customer: ${shopData.globalData.deliveryNPC.name}`);
    $gameMessage.add(`\\C[1]Location: ${mapName}`);
    $gameMessage.add(
      `\\C[2]Time Limit: ${Math.floor(deliveryTimeLimit / 60)}:${(
        deliveryTimeLimit % 60
      )
        .toString()
        .padStart(2, "0")}`
    );
  });

  PluginManager.registerCommand(pluginName, "completeDelivery", (args) => {
    refreshEconomy(); // ADD THIS LINE
    if (!shopData.globalData.currentDelivery) {
      $gameMessage.add("\\C[2]No active delivery!");
      return;
    }

    // Stop the timer
    $gameTimer.stop();

    // Check if delivery was on time
    const timeLeft = $gameTimer.seconds();
    const onTime = timeLeft > 0 || !$gameTimer.isWorking();

    // Turn off delivery event switch
    const mapId = shopData.globalData.currentDelivery.mapId;
    $gameSelfSwitches.setValue([mapId, 1, "A"], false);

    // Calculate gold based on time
    let gold =
      Math.floor(Math.random() * (deliveryMaxGold - deliveryMinGold + 1)) +
      deliveryMinGold;

    if (!onTime) {
      gold = Math.floor(gold * 0.5);
      $gameMessage.add(`\\C[2]Delivery was late!`);
    } else {
      $gameMessage.add(`\\C[3]Delivery complete!`);
    }

    $gameParty.gainGold(gold);
    $gameMessage.add(`\\C[3]Earned ${gold} gold (${formatEuroPrice(gold)})!`);

    // Reset and start new delivery
    shopData.globalData.currentDelivery = null;
    PluginManager.callCommand(this, pluginName, "newDelivery", {});
  });

  PluginManager.registerCommand(pluginName, "orderMaterials", (args) => {
    refreshEconomy(); // ADD THIS LINE
    const shop = getCurrentShop();
    if (!shop) {
      $gameMessage.add("\\C[2]No shop selected!");
      return;
    }

    const itemId = Number(args.materialId);
    const amount = Number(args.amount);

    if (itemId < materialStartId || itemId > materialEndId) {
      $gameMessage.add("\\C[2]Invalid material ID!");
      return;
    }

    shop.warehouseInventory[itemId] =
      (shop.warehouseInventory[itemId] || 0) + amount;

    const item = $dataItems[itemId];
    $gameMessage.add(`\\C[3]Ordered ${amount}x ${item.name}!`);
  });

  PluginManager.registerCommand(pluginName, "showDeliveryInfo", (args) => {
    refreshEconomy(); // ADD THIS LINE
    if (!shopData.globalData.currentDelivery) {
      $gameMessage.add("\\C[2]No active delivery!");
      return;
    }

    const mapName = getMapDisplayName(
      shopData.globalData.currentDelivery.mapId
    );
    const npc = shopData.globalData.deliveryNPC;

    $gameMessage.add("\\C[3]=== Current Delivery ===");
    $gameMessage.add(`\\C[1]Customer: ${npc.name}`);
    $gameMessage.add(
      `\\C[1]Character: ${npc.spriteName} (${npc.spriteIndex + 1})`
    );
    $gameMessage.add(`\\C[1]Location: ${mapName}`);

    if ($gameTimer.isWorking()) {
      const seconds = Math.floor($gameTimer.seconds());
      const minutes = Math.floor(seconds / 60);
      const secs = seconds % 60;
      $gameMessage.add(
        `\\C[2]Time Remaining: ${minutes}:${secs.toString().padStart(2, "0")}`
      );
    } else {
      $gameMessage.add(`\\C[2]Timer not active`);
    }
  });

  // NPC Production System (runs in background)
  /*
  const _Scene_Map_update = Scene_Map.prototype.update;
  Scene_Map.prototype.update = function () {
    _Scene_Map_update.call(this);

    const shop = getCurrentShop();
    if (shop && shop.isWorking) {
      updateNPCProducing(shop);
    }
  };
*/
  function updateNPCProducing(shop) {
    // Check if NPC producer event exists and is on the producing tile
    const producerEvent = $gameMap.event(npcProducerEventId);
    if (!producerEvent) return;

    // Get the tile ID at the producer's position
    const x = producerEvent.x;
    const y = producerEvent.y;

    // Check all layers for the producing tile
    let isOnProducingTile = false;
    for (let z = 0; z < 4; z++) {
      const tileId = $gameMap.tileId(x, y, z);
      if (tileId === producingTileId) {
        isOnProducingTile = true;
        break;
      }
    }

    // Only proceed with production if on the correct tile
    if (!isOnProducingTile) {
      shop.npcProducingTimer = 0;
      return;
    }

    // Increment producing timer
    shop.npcProducingTimer++;

    if (shop.npcProducingTimer >= producingInterval) {
      shop.npcProducingTimer = 0;

      // Try to produce random item from shop's category
      const categoryItems = $dataItems.filter(
        (item) => item && isItemInCategory(item, shop.category)
      );

      if (categoryItems.length > 0) {
        const randomItem =
          categoryItems[Math.floor(Math.random() * categoryItems.length)];
        const recipe = getRecipe(randomItem);

        if (recipe && hasIngredients(recipe, shop)) {
          consumeIngredients(recipe, shop);
          addToStock(randomItem.id, 1, shop);

          // Visual feedback for production
          $gameTemp.requestAnimation([producerEvent], 1);

          console.log(
            `NPC produced ${randomItem.name} at tile ${producingTileId}`
          );
        }
      }
    }
  }

  // Window for Shop Management Status
  class Window_ShopStatus extends Window_Base {
    constructor(rect) {
      super(rect);
      this.refresh();
    }

    refresh() {
      this.contents.clear();
      const shop = getCurrentShop();

      if (!shop) {
        this.drawText("No shop selected", 0, 0, this.innerWidth);
        return;
      }

      this.drawText(`Shop: ${shop.id}`, 0, 0, this.innerWidth);
      this.drawText(
        `Category: ${shop.category}`,
        0,
        this.lineHeight(),
        this.innerWidth
      );
      this.drawText(
        `Role: ${shop.currentRole}`,
        0,
        this.lineHeight() * 2,
        this.innerWidth
      );
      this.drawText(
        `Status: ${shop.isWorking ? "Working" : "Off Duty"}`,
        0,
        this.lineHeight() * 3,
        this.innerWidth
      );

      // Show producer status if working
      if (shop.isWorking) {
        const producerEvent = $gameMap.event(npcProducerEventId);
        if (producerEvent) {
          const x = producerEvent.x;
          const y = producerEvent.y;
          let isOnProducingTile = false;

          for (let z = 0; z < 4; z++) {
            if ($gameMap.tileId(x, y, z) === producingTileId) {
              isOnProducingTile = true;
              break;
            }
          }

          const producerStatus = isOnProducingTile ? "Producing" : "Idle";
          this.drawText(
            `Producer Status: ${producerStatus}`,
            0,
            this.lineHeight() * 4,
            this.innerWidth
          );
        }
      }

      if (shopData.globalData.currentDelivery) {
        this.drawText(
          `Active Delivery: ${getMapDisplayName(
            shopData.globalData.currentDelivery.mapId
          )}`,
          0,
          this.lineHeight() * 5,
          this.innerWidth
        );

        if ($gameTimer.isWorking()) {
          const seconds = Math.floor($gameTimer.seconds());
          const minutes = Math.floor(seconds / 60);
          const secs = seconds % 60;
          this.drawText(
            `Time Left: ${minutes}:${secs.toString().padStart(2, "0")}`,
            0,
            this.lineHeight() * 6,
            this.innerWidth
          );
        }
      }
    }
  }

  // Window for Stock Inventory (Read-only)
  // Window for Stock Inventory (Read-only) - With Icons

  class Window_CategoryItems extends Window_Selectable {
    constructor(rect) {
      super(rect);
      this._categoryItems = this.buildCategoryItems();
      this._recipeWindow = null;
      this.refresh();
    }

    setRecipeWindow(recipeWindow) {
      this._recipeWindow = recipeWindow;
      this.updateRecipeDisplay();
    }

    buildCategoryItems() {
      const shop = getCurrentShop();
      if (!shop) return [];

      const categoryItems = [];
      for (let i = 1; i < $dataItems.length; i++) {
        const item = $dataItems[i];
        if (item && isItemInCategory(item, shop.category)) {
          categoryItems.push(item);
        }
      }

      return categoryItems;
    }

    maxItems() {
      return this._categoryItems.length;
    }

    item() {
      return this._categoryItems[this.index()];
    }

    select(index) {
      super.select(index);
      this.updateRecipeDisplay();
    }

    updateRecipeDisplay() {
      if (this._recipeWindow) {
        const item = this.item();
        this._recipeWindow.setItem(item);
      }
    }

    drawItem(index) {
      const item = this._categoryItems[index];
      if (!item) return;

      const rect = this.itemLineRect(index);
      const iconWidth = ImageManager.iconWidth + 8;
      const priceWidth = 120;

      // Draw item icon
      this.drawIcon(item.iconIndex, rect.x, rect.y);

      // Draw item name
      this.drawText(
        item.name,
        rect.x + iconWidth,
        rect.y,
        rect.width - priceWidth - iconWidth
      );

      // Draw base price in euros
      const shop = getCurrentShop();
      const price =
        shop.menuPrices[item.id] ||
        Math.floor(item.price * defaultPriceMultiplier);
      this.drawText(
        formatEuroPrice(price),
        rect.x + rect.width - priceWidth,
        rect.y,
        priceWidth,
        "right"
      );
    }

    refresh() {
      this.contents.clear();
      for (let i = 0; i < this.maxItems(); i++) {
        this.drawItem(i);
      }
    }

    update() {
      super.update();
      // Update recipe display when cursor moves
      if (this.index() !== this._lastIndex) {
        this._lastIndex = this.index();
        this.updateRecipeDisplay();
      }
    }
  }

  class Scene_ChangeProduction extends Scene_MenuBase {
    constructor() {
      super();
      this._slotIndex = 1;
    }

    setSlotIndex(slotIndex) {
      this._slotIndex = slotIndex;
    }

    create() {
      super.create();
      this.createHelpWindow();
      this.createCategoryItemsWindow();
      this.createRecipeWindow();
    }

    start() {
      super.start();
      this._categoryItemsWindow.activate();
      this._categoryItemsWindow.select(0);
    }

    createHelpWindow() {
      const rect = this.helpWindowRect();
      this._helpWindow = new Window_Help(rect);
      this._helpWindow.setText(
        `Change Production for Slot ${this._slotIndex} - Select New Item Type`
      );
      this.addWindow(this._helpWindow);
    }

    createCategoryItemsWindow() {
      const rect = this.categoryItemsWindowRect();
      this._categoryItemsWindow = new Window_CategoryItems(rect);
      this._categoryItemsWindow.setHandler("ok", this.onItemOk.bind(this));
      this._categoryItemsWindow.setHandler("cancel", this.popScene.bind(this));
      this.addWindow(this._categoryItemsWindow);
    }

    createRecipeWindow() {
      const rect = this.recipeWindowRect();
      this._recipeWindow = new Window_RecipeDisplay(rect);
      this.addWindow(this._recipeWindow);

      // Link windows
      this._categoryItemsWindow.setRecipeWindow(this._recipeWindow);
    }

    helpWindowRect() {
      const wx = 0;
      const wy = 0;
      const ww = Graphics.boxWidth;
      const wh = this.calcWindowHeight(2, false);
      return new Rectangle(wx, wy, ww, wh);
    }

    categoryItemsWindowRect() {
      const wx = 0;
      const wy = this.helpWindowRect().height;
      const ww = Graphics.boxWidth;
      const wh = Math.floor((Graphics.boxHeight - wy) * 0.6); // 60% of remaining space
      return new Rectangle(wx, wy, ww, wh);
    }

    recipeWindowRect() {
      const categoryRect = this.categoryItemsWindowRect();
      const wx = 0;
      const wy = categoryRect.y + categoryRect.height;
      const ww = Graphics.boxWidth;
      const wh = Graphics.boxHeight - wy;
      return new Rectangle(wx, wy, ww, wh);
    }

    onItemOk() {
      const item = this._categoryItemsWindow.item();
      if (item) {
        const shop = getCurrentShop();

        // Discard existing items in the slot
        shop.stockInventory[this._slotIndex] = null;

        // Set new production type for the slot (start with 0 items)
        shop.stockInventory[this._slotIndex] = {
          itemId: item.id,
          amount: 0,
        };

        // Set default price if not already set
        if (!shop.menuPrices[item.id]) {
          shop.menuPrices[item.id] = Math.floor(
            item.price * defaultPriceMultiplier
          );
        }

        $gameMessage.add(
          `\\C[3]Slot ${this._slotIndex} production changed to ${item.name}!`
        );
        $gameMessage.add(`\\C[2]Previous items were discarded.`);

        this.popScene();
      }
    }
  }
  class Window_StockInventory extends Window_Selectable {
    constructor(rect) {
      super(rect);
      this._recipeWindow = null;
      this.refresh();
    }

    setRecipeWindow(recipeWindow) {
      this._recipeWindow = recipeWindow;
      this.updateRecipeDisplay();
    }

    maxItems() {
      return 7; // Always 7 slots
    }

    itemAt(index) {
      const shop = getCurrentShop();
      if (!shop) return null;

      const slotIndex = index + 1;
      const slot = shop.stockInventory[slotIndex];

      if (!slot) {
        return {
          slotIndex: slotIndex,
          id: null,
          amount: 0,
          item: null,
          isEmpty: true,
        };
      }

      return {
        slotIndex: slotIndex,
        id: slot.itemId,
        amount: slot.amount,
        item: $dataItems[slot.itemId],
        isEmpty: false,
      };
    }

    drawItem(index) {
      const itemData = this.itemAt(index);
      if (!itemData) return;

      const rect = this.itemLineRect(index);
      const iconWidth = ImageManager.iconWidth + 8;
      const priceWidth = 120;
      const amountWidth = 100;

      if (itemData.isEmpty) {
        // Draw empty slot
        this.changeTextColor(ColorManager.textColor(8)); // Gray color
        this.drawText(
          `Slot ${itemData.slotIndex}: [Empty]`,
          rect.x,
          rect.y,
          this.innerWidth
        );
        this.resetTextColor();
      } else {
        // Draw item icon
        this.drawIcon(itemData.item.iconIndex, rect.x, rect.y);

        // Draw slot number and item name
        this.drawText(
          `${itemData.slotIndex}: ${itemData.item.name}`,
          rect.x + iconWidth,
          rect.y,
          rect.width - priceWidth - amountWidth - iconWidth
        );

        // Draw amount with max indicator
        this.drawText(
          `${itemData.amount}/${getCurrentShop().maxItemsPerSlot}`,
          rect.x + rect.width - priceWidth - amountWidth,
          rect.y,
          amountWidth,
          "right"
        );

        // Draw price in euros if set
        const shop = getCurrentShop();
        const price = shop.menuPrices[itemData.id];
        if (price) {
          this.drawText(
            formatEuroPrice(price),
            rect.x + rect.width - priceWidth,
            rect.y,
            priceWidth,
            "right"
          );
        }
      }
    }

    refresh() {
      this.contents.clear();
      for (let i = 0; i < this.maxItems(); i++) {
        this.drawItem(i);
      }
    }

    select(index) {
      super.select(index);
      this.updateRecipeDisplay();
    }

    updateRecipeDisplay() {
      if (this._recipeWindow) {
        const itemData = this.itemAt(this.index());
        this._recipeWindow.setItem(
          itemData && !itemData.isEmpty ? itemData.item : null
        );
      }
    }

    processOk() {
      const itemData = this.itemAt(this.index());
      if (itemData) {
        this.playOkSound();
        SceneManager.push(Scene_ChangeProduction);
        Scene_ChangeProduction.prototype.setSlotIndex(itemData.slotIndex);
      }
    }

    isOkEnabled() {
      return true; // Allow selection of any slot
    }

    update() {
      super.update();
      // Update recipe display when cursor moves
      if (this.index() !== this._lastIndex) {
        this._lastIndex = this.index();
        this.updateRecipeDisplay();
      }
    }
  }
  // Add new Window_RecipeDisplay class
  class Window_RecipeDisplay extends Window_Base {
    constructor(rect) {
      super(rect);
      this._item = null;
      this._recipe = null;
      this.refresh();
    }

    setItem(item) {
      if (this._item !== item) {
        this._item = item;
        this._recipe = item ? getRecipe(item) : null;
        this.refresh();
      }
    }

    refresh() {
      this.contents.clear();

      if (!this._item) {
        this.drawText("No item selected", 4, 4, this.innerWidth);
        return;
      }

      if (!this._recipe) {
        this.drawText(
          `${this._item.name} - No recipe required`,
          4,
          4,
          this.innerWidth
        );
        return;
      }

      // Draw recipe header
      this.drawText(`Recipe for ${this._item.name}:`, 4, 4, this.innerWidth);

      let yOffset = this.lineHeight() + 8;
      const shop = getCurrentShop();

      // Draw required materials
      for (const [materialId, requiredAmount] of Object.entries(this._recipe)) {
        const material = $dataItems[Number(materialId)];
        if (!material) continue;

        const currentAmount = shop
          ? shop.warehouseInventory[materialId] || 0
          : 0;
        const hasEnough = currentAmount >= requiredAmount;

        // Draw material icon
        this.drawIcon(material.iconIndex, 4, yOffset);

        // Set text color based on availability
        if (hasEnough) {
          this.changeTextColor(ColorManager.textColor(3)); // Green
        } else {
          this.changeTextColor(ColorManager.textColor(2)); // Red
        }

        // Draw material name and amounts
        const iconWidth = ImageManager.iconWidth + 8;
        this.drawText(
          `${material.name}`,
          iconWidth,
          yOffset,
          this.innerWidth - iconWidth - 100
        );
        this.drawText(
          `${currentAmount}/${requiredAmount}`,
          this.innerWidth - 100,
          yOffset,
          100,
          "right"
        );

        this.resetTextColor();
        yOffset += this.lineHeight();
      }

      // Draw production status
      yOffset += 8;
      const canProduce =
        shop && this._recipe && hasIngredients(this._recipe, shop);

      if (canProduce) {
        this.changeTextColor(ColorManager.textColor(3)); // Green
        this.drawText("✓ Can produce", 4, yOffset, this.innerWidth);
      } else {
        this.changeTextColor(ColorManager.textColor(2)); // Red
        this.drawText("✗ Insufficient materials", 4, yOffset, this.innerWidth);
      }
      this.resetTextColor();
    }

    lineHeight() {
      return 36;
    }
  }
  // Window for Warehouse Inventory (Read-only)
  class Window_WarehouseInventory extends Window_Selectable {
    constructor(rect) {
      super(rect);
      this.refresh();
    }

    maxItems() {
      const shop = getCurrentShop();
      if (!shop) return 0;
      return Object.keys(shop.warehouseInventory).length;
    }

    itemAt(index) {
      const shop = getCurrentShop();
      if (!shop) return null;

      const itemIds = Object.keys(shop.warehouseInventory);
      const itemId = itemIds[index];
      return {
        id: Number(itemId),
        amount: shop.warehouseInventory[itemId],
        item: $dataItems[Number(itemId)],
      };
    }

    drawItem(index) {
      const item = this.itemAt(index);
      if (!item || !item.item) return;

      const rect = this.itemLineRect(index);
      const iconWidth = ImageManager.iconWidth + 8; // Icon width + padding
      const amountWidth = 80;

      // Draw item icon
      this.drawIcon(item.item.iconIndex, rect.x, rect.y);

      // Draw item name (shifted right for icon)
      this.drawText(
        item.item.name,
        rect.x + iconWidth,
        rect.y,
        rect.width - amountWidth - iconWidth
      );

      // Draw amount
      this.drawText(
        `×${item.amount}`,
        rect.x + rect.width - amountWidth,
        rect.y,
        amountWidth,
        "right"
      );
    }

    refresh() {
      this.contents.clear();
      for (let i = 0; i < this.maxItems(); i++) {
        this.drawItem(i);
      }
    }

    update() {
      super.update();
      if (this.active) {
        // Allow scrolling but no selection action
      }
    }
  }
  // Scene for Stock Management

  // Replace the Scene_StockManagement class to include recipe display
  class Scene_StockManagement extends Scene_MenuBase {
    create() {
      super.create();
      this.createStockWindow();
      this.createRecipeWindow();
    }

    start() {
      super.start();
      this._stockWindow.activate();
      this._stockWindow.select(0);
    }

    createStockWindow() {
      const rect = this.stockWindowRect();
      this._stockWindow = new Window_StockInventory(rect);
      this._stockWindow.setHandler("cancel", this.popScene.bind(this));
      this.addWindow(this._stockWindow);
    }

    createRecipeWindow() {
      const rect = this.recipeWindowRect();
      this._recipeWindow = new Window_RecipeDisplay(rect);
      this.addWindow(this._recipeWindow);

      // Link windows
      this._stockWindow.setRecipeWindow(this._recipeWindow);
    }

    helpWindowRect() {
      const wx = 0;
      const wy = 0;
      const ww = Graphics.boxWidth;
      const wh = this.calcWindowHeight(2, false);
      return new Rectangle(wx, wy, ww, wh);
    }

    stockWindowRect() {
      const wx = 0;
      const wy = 0;
      const ww = Graphics.boxWidth;
      const wh = Math.floor((Graphics.boxHeight - wy) * 0.6); // 60% of remaining space
      return new Rectangle(wx, wy, ww, wh);
    }

    recipeWindowRect() {
      const stockRect = this.stockWindowRect();
      const wx = 0;
      const wy = stockRect.y + stockRect.height;
      const ww = Graphics.boxWidth;
      const wh = Graphics.boxHeight - wy;
      return new Rectangle(wx, wy, ww, wh);
    }
  }
  // Scene for Warehouse Management
  class Scene_WarehouseManagement extends Scene_MenuBase {
    create() {
      super.create();
      this.createHelpWindow();
      this.createWarehouseWindow();
    }

    start() {
      super.start();
      this._warehouseWindow.activate();
      this._warehouseWindow.select(0);
    }

    createHelpWindow() {
      const rect = this.helpWindowRect();
      this._helpWindow = new Window_Help(rect);
      this._helpWindow.setText(
        "Warehouse Inventory - Materials for Production"
      );
      this.addWindow(this._helpWindow);
    }

    createWarehouseWindow() {
      const rect = this.warehouseWindowRect();
      this._warehouseWindow = new Window_WarehouseInventory(rect);
      this._warehouseWindow.setHandler("cancel", this.popScene.bind(this));
      this.addWindow(this._warehouseWindow);
    }

    helpWindowRect() {
      const wx = 0;
      const wy = 0;
      const ww = Graphics.boxWidth;
      const wh = this.calcWindowHeight(2, false);
      return new Rectangle(wx, wy, ww, wh);
    }

    warehouseWindowRect() {
      const wx = 0;
      const wy = this.helpWindowRect().height;
      const ww = Graphics.boxWidth;
      const wh = Graphics.boxHeight - wy;
      return new Rectangle(wx, wy, ww, wh);
    }
  }
  class Window_ShopManagementCommand extends Window_Command {
    makeCommandList() {
      const shop = getCurrentShop();
      if (shop) {
        this.addCommand("View Stock", "stock", true);
        this.addCommand("View Warehouse", "warehouse", true);
        this.addCommand("Delivery Info", "delivery", true);
        this.addCommand("Start Production", "production", true);
      } else {
        this.addCommand("No Shop Selected", "cancel", false);
      }
    }
  }
  // Enhanced Scene for Shop Management
  class Scene_ShopManagement extends Scene_MenuBase {
    create() {
      super.create();
      this.createStatusWindow();
      this.createCommandWindow();
    }

    createStatusWindow() {
      const rect = this.statusWindowRect();
      this._statusWindow = new Window_ShopStatus(rect);
      this.addWindow(this._statusWindow);
    }

    createCommandWindow() {
      const rect = this.commandWindowRect();
      this._commandWindow = new Window_ShopManagementCommand(rect);

      // Set handlers
      this._commandWindow.setHandler("stock", this.commandStock.bind(this));
      this._commandWindow.setHandler(
        "warehouse",
        this.commandWarehouse.bind(this)
      );
      this._commandWindow.setHandler(
        "delivery",
        this.commandDelivery.bind(this)
      );
      this._commandWindow.setHandler(
        "production",
        this.commandProduction.bind(this)
      );
      this._commandWindow.setHandler("cancel", this.popScene.bind(this));

      this.addWindow(this._commandWindow);
    }

    statusWindowRect() {
      const wx = 0;
      const wy = 0;
      const ww = Graphics.boxWidth;
      const wh = this.calcWindowHeight(8, false);
      return new Rectangle(wx, wy, ww, wh);
    }

    commandWindowRect() {
      const wx = 0;
      const wy = this.calcWindowHeight(8, false);
      const ww = Graphics.boxWidth;
      const wh = Graphics.boxHeight - wy;
      return new Rectangle(wx, wy, ww, wh);
    }

    commandStock() {
      SceneManager.push(Scene_StockManagement);
    }

    commandWarehouse() {
      SceneManager.push(Scene_WarehouseManagement);
    }

    commandMenu() {
      const shop = getCurrentShop();
      if (shop) {
        $gameMessage.add("\\C[3]=== Menu Prices (€) ===");
        for (const [itemId, price] of Object.entries(shop.menuPrices)) {
          const item = $dataItems[Number(itemId)];
          if (item) {
            $gameMessage.add(`${item.name}: ${formatEuroPrice(price)}`);
          }
        }
      }
      this._commandWindow.activate();
    }

    commandDelivery() {
      PluginManager.callCommand(this, pluginName, "showDeliveryInfo", {});
      this._commandWindow.activate();
    }

    commandProduction() {
      PluginManager.callCommand(this, pluginName, "startProducingMiniGame", {});
      this._commandWindow.activate();
    }

    start() {
      super.start();
      this._commandWindow.activate();
      this._commandWindow.select(0);
    }

    update() {
      super.update();
      if (Graphics.frameCount % 60 === 0) {
        this._statusWindow.refresh();
      }
    }
  }

  // Add plugin command for starting producing mini-game
  PluginManager.registerCommand(
    pluginName,
    "startProducingMiniGame",
    (args) => {
      const shop = getCurrentShop();
      if (!shop) {
        $gameMessage.add("\\C[2]No shop selected!");
        return;
      }

      if (!shop.isWorking) {
        $gameMessage.add("\\C[2]Shop must be open for business first!");
        return;
      }

      $gameMessage.add("\\C[1]Production Mini-Game Started!");
      $gameMessage.add("\\C[2](Mini-game implementation pending)");

      // For now, simulate successful production
      setTimeout(() => {
        const categoryItems = $dataItems.filter(
          (item) => item && isItemInCategory(item, shop.category)
        );

        if (categoryItems.length > 0) {
          const randomItem =
            categoryItems[Math.floor(Math.random() * categoryItems.length)];
          const recipe = getRecipe(randomItem);

          if (recipe && hasIngredients(recipe, shop)) {
            consumeIngredients(recipe, shop);
            addToStock(randomItem.id, 1, shop);
            $gameMessage.add(`\\C[3]Successfully produced ${randomItem.name}!`);
          } else {
            $gameMessage.add("\\C[2]Not enough materials for production!");
          }
        }
      }, 1000);
    }
  );

  // Enhanced plugin commands for stock and warehouse
  PluginManager.registerCommand(pluginName, "openStock", (args) => {
    SceneManager.push(Scene_StockManagement);
  });

  PluginManager.registerCommand(pluginName, "openWarehouse", (args) => {
    SceneManager.push(Scene_WarehouseManagement);
  });

  // Debugging function to add items to shop inventories
  function addItemToShop(shopId, itemId, amount, isStock = true) {
    const shop = shopData.shops[shopId];
    if (!shop) {
      console.log(`Shop ${shopId} not found!`);
      return false;
    }

    if (isStock) {
      shop.stockInventory[itemId] = (shop.stockInventory[itemId] || 0) + amount;
    } else {
      shop.warehouseInventory[itemId] =
        (shop.warehouseInventory[itemId] || 0) + amount;
    }

    return true;
  }

  // Global access to shop data and helper functions for debugging
  window.$shopData = shopData;
  window.$addItemToShop = addItemToShop;
  window.$getCurrentShop = getCurrentShop;
  window.$goldToEuros = goldToEuros;
  window.$formatEuroPrice = formatEuroPrice;
})();

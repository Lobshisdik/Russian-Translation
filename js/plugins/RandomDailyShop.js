/*:
 * @target MZ
 * @plugindesc Opens a shop with random items seeded by map coordinates and date.
 * @author OmniLex
 *
 * @param shopSize
 * @text Shop Size
 * @type number
 * @min 1
 * @max 20
 * @default 5
 * @desc Number of random items in each shop.
 *
 * @command OpenDailyShop
 * @text Open Daily Shop
 * @desc Opens the randomized shop based on event location and date. Excludes food items.
 *
 * @command randomDailyTavern
 * @text Open Daily Tavern
 * @desc Opens the randomized tavern with only food items based on event location and date.
 *
 * @command openDailyArmor
 * @text Open Daily Armor Shop
 * @desc Opens the randomized armor shop with only armor items based on event location and date.
 *
 * @command openDailyWeapon
 * @text Open Daily Weapon Shop
 * @desc Opens the randomized weapon shop with only weapon items based on event location and date.
 *
 * @command openDailyPharmacy
 * @text Open Daily Pharmacy
 * @desc Opens the randomized pharmacy with only medical category items based on event location and date.
 *
 * @command openDailyMagicShop
 * @text Open Daily Magic Shop
 * @desc Opens the randomized magic shop with only potion, magic, and monster category items based on event location and date.
 *
 * @command openDailyLuxury
 * @text Open Daily Luxury Shop
 * @desc Opens the randomized luxury shop with artisan category items or high-price items (>300000 gold) based on event location and date.
 *
 * @command openDailyAdventurer
 * @text Open Daily Adventurer Shop
 * @desc Opens the randomized adventurer shop with medical, food, weapons, armor, counterfeits, and magic category items based on event location and date.
 *
 * @command openDailyLibrary
 * @text Open Daily Library Shop
 * @desc Opens the randomized adventurer shop with book items based on event location and date.
 *
 * @command openDailyTools
 * @text Open Daily Tools Shop
 * @desc Opens the randomized tools shop with items tagged <Category: Essential> based on event location and date.
*/

(() => {
  const pluginName = "RandomDailyShop";
  const parameters = PluginManager.parameters(pluginName);
  const shopSize = Number(parameters['shopSize'] || 5);

  // Items always stocked in the tavern, regardless of the daily random selection
  const TAVERN_FIXED_IDS = [172, 171, 175, 10, 11, 7, 370, 368, 383, 385, 388, 394, 390, 41, 594, 595, 596, 597];

  // Parse game date from variable 113
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

  // Utility to get game date string (YYYY-MM-DD) from variable 113
  function getCurrentDateKey() {
    const gameDate = getGameDateFromVariable();
    // Format to YYYY-MM-DD (e.g., "2001-01-01")
    const yearStr = gameDate.year.toString();
    const monthStr = String(gameDate.month + 1).padStart(2, '0');
    const dayStr = String(gameDate.day).padStart(2, '0');
    return `${yearStr}-${monthStr}-${dayStr}`;
  }

  // Simple seeded random number generator
  function seededRandom(seed) {
    const x = Math.sin(seed++) * 10000;
    return x - Math.floor(x);
  }

  // Generate seed from map ID, x, y coordinates, and date
  function generateSeed(mapId, x, y, dateKey) {
    const dateNum = parseInt(dateKey.replace(/-/g, ''), 10);
    return mapId * 10000000 + x * 10000 + y * 100 + (dateNum % 10000);
  }

  // Seeded shuffle using the generated seed
  function seededShuffle(array, seed) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      seed = (seed * 9301 + 49297) % 233280;
      const j = Math.floor((seed / 233280) * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }

  // Category detection functions
  function isFoodItem(item) {
    if (!item || !item.note) return false;
    return item.note.toLowerCase().includes('<category: food>') ||
           item.note.toLowerCase().includes('<category:food>');
  }

  function isMedicalItem(item) {
    if (!item || !item.note) return false;
    return item.note.toLowerCase().includes('<category: medical>') ||
           item.note.toLowerCase().includes('<category:medical>');
  }

  function isPotionItem(item) {
    if (!item || !item.note) return false;
    return item.note.toLowerCase().includes('<category: potion>') ||
           item.note.toLowerCase().includes('<category:potion>');
  }

  function isMagicItem(item) {
    if (!item || !item.note) return false;
    return item.note.toLowerCase().includes('<category: magic>') ||
           item.note.toLowerCase().includes('<category:magic>');
  }

  function isMonsterItem(item) {
    if (!item || !item.note) return false;
    return item.note.toLowerCase().includes('<category: monsters>') ||
           item.note.toLowerCase().includes('<category:monsters>');
  }

  function isArtisanItem(item) {
    if (!item || !item.note) return false;
    return item.note.toLowerCase().includes('<category: artisan>') ||
           item.note.toLowerCase().includes('<category:artisan>');
  }

  function isCounterfeitItem(item) {
    if (!item || !item.note) return false;
    return item.note.toLowerCase().includes('<category: counterfeits>') ||
           item.note.toLowerCase().includes('<category:counterfeits>');
  }
  function isBookItem(item) {
    if (!item || !item.note) return false;
    return item.note.toLowerCase().includes('<category: books>') ||
           item.note.toLowerCase().includes('<category:books>');
  }
  function isEssentialItem(item) {
    if (!item || !item.note) return false;
    return item.note.toLowerCase().includes('<category: tools>') ||
           item.note.toLowerCase().includes('<category:tools>');
  }
  function isHighValueItem(item) {
    return item && item.price && item.price > 300000;
  }

  // Get all available items from database
  function getAllItems(excludeFood = false) {
    const allItems = [];

    // Collect all valid item entries
    for (let i = 1; i < $dataItems.length; i++) {
      const item = $dataItems[i];
      if (item && item.name) {
        if (excludeFood && isFoodItem(item)) continue;
        allItems.push(item);
      }
    }
    for (let i = 1; i < $dataWeapons.length; i++) {
      const weapon = $dataWeapons[i];
      if (weapon && weapon.name) allItems.push(weapon);
    }
    for (let i = 1; i < $dataArmors.length; i++) {
      const armor = $dataArmors[i];
      if (armor && armor.name) allItems.push(armor);
    }

    return allItems;
  }

  // Get only food items from database
  function getFoodItems() {
    const foodItems = [];

    // Collect all valid food item entries
    for (let i = 1; i < $dataItems.length; i++) {
      const item = $dataItems[i];
      if (item && item.name && isFoodItem(item)) {
        foodItems.push(item);
      }
    }

    return foodItems;
  }
  function getFoodItems() {
    const foodItems = [];

    // Collect all valid food item entries
    for (let i = 1; i < $dataItems.length; i++) {
      const item = $dataItems[i];
      if (item && item.name && isFoodItem(item)) {
        foodItems.push(item);
      }
    }

    return foodItems;
  }
  function getBookItems() {
    const bookItems = [];

    // Collect all valid medical item entries
    for (let i = 1; i < $dataItems.length; i++) {
      const item = $dataItems[i];
      if (item && item.name && isBookItem(item)) {
        bookItems.push(item);
      }
    }

    return bookItems;
  }

  function getMedicalItems() {
    const medicalItems = [];

    // Collect all valid medical item entries
    for (let i = 1; i < $dataItems.length; i++) {
      const item = $dataItems[i];
      if (item && item.name && isMedicalItem(item)) {
        medicalItems.push(item);
      }
    }

    return medicalItems;
  }

  function getMagicShopItems() {
    const magicItems = [];

    // Collect all valid potion, magic, and monster items
    for (let i = 1; i < $dataItems.length; i++) {
      const item = $dataItems[i];
      if (item && item.name && (isPotionItem(item) || isMagicItem(item) || isMonsterItem(item))) {
        magicItems.push(item);
      }
    }

    return magicItems;
  }

  // Store the shop inventory in a cache by location and date
  const shopInventoryCache = {};
  const tavernInventoryCache = {};
  const libraryInventoryCache = {};

  const armorShopCache = {};
  const weaponShopCache = {};
  const pharmacyCache = {};
  const magicShopCache = {};
  const luxuryShopCache = {};
  const adventurerShopCache = {};
  const toolsShopCache = {};

  function getShopItems(mapId, x, y) {
    const dateKey = getCurrentDateKey();
    const cacheKey = `${mapId}_${x}_${y}_${dateKey}`;

    if (!shopInventoryCache[cacheKey]) {
      const allItems = getAllItems(true); // Exclude food items
      const seed = generateSeed(mapId, x, y, dateKey);
      const shuffled = seededShuffle(allItems, seed);
      shopInventoryCache[cacheKey] = shuffled.slice(0, shopSize * 2);
    }

    return shopInventoryCache[cacheKey];
  }

  function getTavernItems(mapId, x, y) {
    const dateKey = getCurrentDateKey();
    const cacheKey = `${mapId}_${x}_${y}_${dateKey}`;

    if (!tavernInventoryCache[cacheKey]) {
      // Exclude fixed items from the random pool to avoid duplicates
      const fixedSet = new Set(TAVERN_FIXED_IDS);
      const foodItems = getFoodItems().filter(item => !fixedSet.has(item.id));
      const seed = generateSeed(mapId, x, y, dateKey);
      const shuffled = seededShuffle(foodItems, seed);
      tavernInventoryCache[cacheKey] = shuffled.slice(0, shopSize * 2);
    }

    return tavernInventoryCache[cacheKey];
  }


  
  function getLibraryItems(mapId, x, y) {
    const dateKey = getCurrentDateKey();
    const cacheKey = `${mapId}_${x}_${y}_${dateKey}`;

    if (!libraryInventoryCache[cacheKey]) {
      const foodItems = getBookItems();
      const seed = generateSeed(mapId, x, y, dateKey);
      const shuffled = seededShuffle(foodItems, seed);
      libraryInventoryCache[cacheKey] = shuffled.slice(0, shopSize * 2);
    }

    return libraryInventoryCache[cacheKey];
  }

  function getArmorShopItems(mapId, x, y) {
    const dateKey = getCurrentDateKey();
    const cacheKey = `${mapId}_${x}_${y}_${dateKey}`;

    if (!armorShopCache[cacheKey]) {
      const allArmors = [];
      for (let i = 1; i < $dataArmors.length; i++) {
        const armor = $dataArmors[i];
        if (armor && armor.name) allArmors.push(armor);
      }
      const seed = generateSeed(mapId, x, y, dateKey);
      const shuffled = seededShuffle(allArmors, seed);
      armorShopCache[cacheKey] = shuffled.slice(0, shopSize * 2);
    }

    return armorShopCache[cacheKey];
  }

  function getWeaponShopItems(mapId, x, y) {
    const dateKey = getCurrentDateKey();
    const cacheKey = `${mapId}_${x}_${y}_${dateKey}`;

    if (!weaponShopCache[cacheKey]) {
      const allWeapons = [];
      for (let i = 1; i < $dataWeapons.length; i++) {
        const weapon = $dataWeapons[i];
        if (weapon && weapon.name) allWeapons.push(weapon);
      }
      const seed = generateSeed(mapId, x, y, dateKey);
      const shuffled = seededShuffle(allWeapons, seed);
      weaponShopCache[cacheKey] = shuffled.slice(0, shopSize * 2);
    }

    return weaponShopCache[cacheKey];
  }

  function getPharmacyItems(mapId, x, y) {
    const dateKey = getCurrentDateKey();
    const cacheKey = `${mapId}_${x}_${y}_${dateKey}`;

    if (!pharmacyCache[cacheKey]) {
      const medicalItems = getMedicalItems();
      const seed = generateSeed(mapId, x, y, dateKey);
      const shuffled = seededShuffle(medicalItems, seed);
      pharmacyCache[cacheKey] = shuffled.slice(0, shopSize * 2);
    }

    return pharmacyCache[cacheKey];
  }

  function getMagicShopInventory(mapId, x, y) {
    const dateKey = getCurrentDateKey();
    const cacheKey = `${mapId}_${x}_${y}_${dateKey}`;

    if (!magicShopCache[cacheKey]) {
      const magicItems = getMagicShopItems();
      const seed = generateSeed(mapId, x, y, dateKey);
      const shuffled = seededShuffle(magicItems, seed);
      magicShopCache[cacheKey] = shuffled.slice(0, shopSize * 2);
    }

    return magicShopCache[cacheKey];
  }



  function getLuxuryShopItems(mapId, x, y) {
    const dateKey = getCurrentDateKey();
    const cacheKey = `${mapId}_${x}_${y}_${dateKey}`;

    if (!luxuryShopCache[cacheKey]) {
      const luxuryItems = [];

      // Collect artisan items and high-value items from all sources
      for (let i = 1; i < $dataItems.length; i++) {
        const item = $dataItems[i];
        if (item && item.name && (isArtisanItem(item) || isHighValueItem(item))) {
          luxuryItems.push(item);
        }
      }
      for (let i = 1; i < $dataWeapons.length; i++) {
        const weapon = $dataWeapons[i];
        if (weapon && weapon.name && isHighValueItem(weapon)) {
          luxuryItems.push(weapon);
        }
      }
      for (let i = 1; i < $dataArmors.length; i++) {
        const armor = $dataArmors[i];
        if (armor && armor.name && isHighValueItem(armor)) {
          luxuryItems.push(armor);
        }
      }

      const seed = generateSeed(mapId, x, y, dateKey);
      const shuffled = seededShuffle(luxuryItems, seed);
      luxuryShopCache[cacheKey] = shuffled.slice(0, shopSize * 2);
    }

    return luxuryShopCache[cacheKey];
  }

  function getAdventurerShopItems(mapId, x, y) {
    const dateKey = getCurrentDateKey();
    const cacheKey = `${mapId}_${x}_${y}_${dateKey}`;

    if (!adventurerShopCache[cacheKey]) {
      const adventurerItems = [];

      // Collect medical, food, counterfeits, potion, magic, monster items
      for (let i = 1; i < $dataItems.length; i++) {
        const item = $dataItems[i];
        if (item && item.name && (isMedicalItem(item) || isFoodItem(item) ||
            isCounterfeitItem(item) || isPotionItem(item) ||
            isMagicItem(item) || isMonsterItem(item))) {
          adventurerItems.push(item);
        }
      }

      // Also add all weapons and armor for adventurer shop
      for (let i = 1; i < $dataWeapons.length; i++) {
        const weapon = $dataWeapons[i];
        if (weapon && weapon.name) {
          adventurerItems.push(weapon);
        }
      }
      for (let i = 1; i < $dataArmors.length; i++) {
        const armor = $dataArmors[i];
        if (armor && armor.name) {
          adventurerItems.push(armor);
        }
      }

      const seed = generateSeed(mapId, x, y, dateKey);
      const shuffled = seededShuffle(adventurerItems, seed);
      adventurerShopCache[cacheKey] = shuffled.slice(0, shopSize * 2);
    }

    return adventurerShopCache[cacheKey];
  }

  // Open the shop with location-based random inventory (excluding food)
  function openDailyShop() {
    // Get the event's coordinates
    const eventId = $gameMap._interpreter.eventId();
    const event = $gameMap.event(eventId);

    if (!event) {
      console.warn("RandomDailyShop: Could not find event to determine location.");
      return;
    }

    const mapId = $gameMap.mapId();
    const x = event.x;
    const y = event.y;

    const items = getShopItems(mapId, x, y);

    const goods = items.map(item => {
      let type;
      if (DataManager.isItem(item)) type = 0;
      else if (DataManager.isWeapon(item)) type = 1;
      else if (DataManager.isArmor(item)) type = 2;
      else return null;
      return [type, item.id, 0, 0];
    }).filter(Boolean);

    SceneManager.push(Scene_Shop);
    SceneManager.prepareNextScene(goods, false);
  }

  // Open the tavern with location-based random food inventory
  function openDailyTavern() {
    // Get the event's coordinates
    const eventId = $gameMap._interpreter.eventId();
    const event = $gameMap.event(eventId);

    if (!event) {
      console.warn("RandomDailyShop: Could not find event to determine location.");
      return;
    }

    const mapId = $gameMap.mapId();
    const x = event.x;
    const y = event.y;

    const randomItems = getTavernItems(mapId, x, y);

    // Fixed items always appear first
    const fixedGoods = TAVERN_FIXED_IDS
      .map(id => $dataItems[id])
      .filter(item => item && item.name)
      .map(item => [0, item.id, 0, 0]);

    const randomGoods = randomItems.map(item => {
      let type;
      if (DataManager.isItem(item)) type = 0;
      else if (DataManager.isWeapon(item)) type = 1;
      else if (DataManager.isArmor(item)) type = 2;
      else return null;
      return [type, item.id, 0, 0];
    }).filter(Boolean);

    const goods = [...fixedGoods, ...randomGoods];

    SceneManager.push(Scene_Shop);
    SceneManager.prepareNextScene(goods, false);
  }

  // Open the armor shop with location-based random armor
  function openDailyArmor() {
    const eventId = $gameMap._interpreter.eventId();
    const event = $gameMap.event(eventId);

    if (!event) {
      console.warn("RandomDailyShop: Could not find event to determine location.");
      return;
    }

    const mapId = $gameMap.mapId();
    const x = event.x;
    const y = event.y;

    const items = getArmorShopItems(mapId, x, y);

    const goods = items.map(item => {
      let type = 2; // Armor type
      return [type, item.id, 0, 0];
    }).filter(Boolean);

    SceneManager.push(Scene_Shop);
    SceneManager.prepareNextScene(goods, false);
  }

  // Open the weapon shop with location-based random weapons
  function openDailyWeapon() {
    const eventId = $gameMap._interpreter.eventId();
    const event = $gameMap.event(eventId);

    if (!event) {
      console.warn("RandomDailyShop: Could not find event to determine location.");
      return;
    }

    const mapId = $gameMap.mapId();
    const x = event.x;
    const y = event.y;

    const items = getWeaponShopItems(mapId, x, y);

    const goods = items.map(item => {
      let type = 1; // Weapon type
      return [type, item.id, 0, 0];
    }).filter(Boolean);

    SceneManager.push(Scene_Shop);
    SceneManager.prepareNextScene(goods, false);
  }

  // Open the pharmacy with location-based random medical items
  function openDailyPharmacy() {
    const eventId = $gameMap._interpreter.eventId();
    const event = $gameMap.event(eventId);

    if (!event) {
      console.warn("RandomDailyShop: Could not find event to determine location.");
      return;
    }

    const mapId = $gameMap.mapId();
    const x = event.x;
    const y = event.y;

    const items = getPharmacyItems(mapId, x, y);

    const goods = items.map(item => {
      let type = 0; // Item type
      return [type, item.id, 0, 0];
    }).filter(Boolean);

    SceneManager.push(Scene_Shop);
    SceneManager.prepareNextScene(goods, false);
  }

  // Open the magic shop with location-based random potions, magic, and monster items
  function openDailyMagicShop() {
    const eventId = $gameMap._interpreter.eventId();
    const event = $gameMap.event(eventId);

    if (!event) {
      console.warn("RandomDailyShop: Could not find event to determine location.");
      return;
    }

    const mapId = $gameMap.mapId();
    const x = event.x;
    const y = event.y;

    const items = getMagicShopInventory(mapId, x, y);

    const goods = items.map(item => {
      let type = 0; // Item type
      return [type, item.id, 0, 0];
    }).filter(Boolean);

    SceneManager.push(Scene_Shop);
    SceneManager.prepareNextScene(goods, false);
  }

    function openDailyLibrary() {
    const eventId = $gameMap._interpreter.eventId();
    const event = $gameMap.event(eventId);

    if (!event) {
      console.warn("RandomDailyShop: Could not find event to determine location.");
      return;
    }

    const mapId = $gameMap.mapId();
    const x = event.x;
    const y = event.y;

    const items = getLibraryItems(mapId, x, y);

    const goods = items.map(item => {
      let type = 0; // Item type
      return [type, item.id, 0, 0];
    }).filter(Boolean);

    SceneManager.push(Scene_Shop);
    SceneManager.prepareNextScene(goods, false);
  }


  // Open the luxury shop with location-based random luxury items
  function openDailyLuxury() {
    const eventId = $gameMap._interpreter.eventId();
    const event = $gameMap.event(eventId);

    if (!event) {
      console.warn("RandomDailyShop: Could not find event to determine location.");
      return;
    }

    const mapId = $gameMap.mapId();
    const x = event.x;
    const y = event.y;

    const items = getLuxuryShopItems(mapId, x, y);

    const goods = items.map(item => {
      let type;
      if (DataManager.isItem(item)) type = 0;
      else if (DataManager.isWeapon(item)) type = 1;
      else if (DataManager.isArmor(item)) type = 2;
      else return null;
      return [type, item.id, 0, 0];
    }).filter(Boolean);

    SceneManager.push(Scene_Shop);
    SceneManager.prepareNextScene(goods, false);
  }

  function getToolsShopItems(mapId, x, y) {
    const dateKey = getCurrentDateKey();
    const cacheKey = `${mapId}_${x}_${y}_${dateKey}`;

    if (!toolsShopCache[cacheKey]) {
      const toolsItems = [];
      for (let i = 1; i < $dataItems.length; i++) {
        const item = $dataItems[i];
        if (item && item.name && isEssentialItem(item)) {
          toolsItems.push(item);
        }
      }
      const seed = generateSeed(mapId, x, y, dateKey);
      const shuffled = seededShuffle(toolsItems, seed);
      toolsShopCache[cacheKey] = shuffled.slice(0, shopSize * 2);
    }

    return toolsShopCache[cacheKey];
  }

  // Open the adventurer shop with location-based random adventurer supplies
  function openDailyAdventurer() {
    const eventId = $gameMap._interpreter.eventId();
    const event = $gameMap.event(eventId);

    if (!event) {
      console.warn("RandomDailyShop: Could not find event to determine location.");
      return;
    }

    const mapId = $gameMap.mapId();
    const x = event.x;
    const y = event.y;

    const items = getAdventurerShopItems(mapId, x, y);

    const goods = items.map(item => {
      let type;
      if (DataManager.isItem(item)) type = 0;
      else if (DataManager.isWeapon(item)) type = 1;
      else if (DataManager.isArmor(item)) type = 2;
      else return null;
      return [type, item.id, 0, 0];
    }).filter(Boolean);

    SceneManager.push(Scene_Shop);
    SceneManager.prepareNextScene(goods, false);
  }

  function openDailyTools() {
    const eventId = $gameMap._interpreter.eventId();
    const event = $gameMap.event(eventId);

    if (!event) {
      console.warn("RandomDailyShop: Could not find event to determine location.");
      return;
    }

    const mapId = $gameMap.mapId();
    const x = event.x;
    const y = event.y;

    const items = getToolsShopItems(mapId, x, y);

    const goods = items.map(item => {
      return [0, item.id, 0, 0]; // All tools are items
    }).filter(Boolean);

    SceneManager.push(Scene_Shop);
    SceneManager.prepareNextScene(goods, false);
  }

  // Plugin command registration
  PluginManager.registerCommand(pluginName, "OpenDailyShop", () => {
    openDailyShop();
  });

  PluginManager.registerCommand(pluginName, "randomDailyTavern", () => {
    openDailyTavern();
  });

  PluginManager.registerCommand(pluginName, "openDailyArmor", () => {
    openDailyArmor();
  });

  PluginManager.registerCommand(pluginName, "openDailyWeapon", () => {
    openDailyWeapon();
  });

  PluginManager.registerCommand(pluginName, "openDailyPharmacy", () => {
    openDailyPharmacy();
  });

  PluginManager.registerCommand(pluginName, "openDailyMagicShop", () => {
    openDailyMagicShop();
  });

  PluginManager.registerCommand(pluginName, "openDailyLuxury", () => {
    openDailyLuxury();
  });

  PluginManager.registerCommand(pluginName, "openDailyAdventurer", () => {
    openDailyAdventurer();
  });

    PluginManager.registerCommand(pluginName, "openDailyLibrary", () => {
    openDailyLibrary();
  });

  PluginManager.registerCommand(pluginName, "openDailyTools", () => {
    openDailyTools();
  });


  // Optional: script call for events
  window.openRandomDailyShop = openDailyShop;
  window.openRandomDailyTavern = openDailyTavern;
  window.openRandomDailyArmor = openDailyArmor;
  window.openRandomDailyWeapon = openDailyWeapon;
  window.openRandomDailyPharmacy = openDailyPharmacy;
  window.openRandomDailyMagicShop = openDailyMagicShop;
  window.openRandomDailyLuxury = openDailyLuxury;
  window.openRandomDailyAdventurer = openDailyAdventurer;
  window.openRandomDailyLibrary = openDailyLibrary;
  window.openRandomDailyTools = openDailyTools;

  // Expose getShopItems for compatibility with other plugins (e.g., StealingSystem)
  window.getRandomDailyShopItems = getShopItems;
  window.getRandomDailyTavernItems = getTavernItems;
  window.getRandomLibraryItems = getLibraryItems;

  window.getRandomDailyArmorItems = getArmorShopItems;
  window.getRandomDailyWeaponItems = getWeaponShopItems;
  window.getRandomDailyPharmacyItems = getPharmacyItems;
  window.getRandomDailyMagicItems = getMagicShopInventory;
  window.getRandomDailyLuxuryItems = getLuxuryShopItems;
  window.getRandomDailyAdventurerItems = getAdventurerShopItems;
  window.getRandomDailyToolsItems = getToolsShopItems;

})();
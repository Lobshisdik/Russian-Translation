/*:
 * @plugindesc v2.1 Random Loot System - Loot quality scales with Party Median Level + Variable.
 * @author Omni-Lex (Modified)
 * @target MZ MV
 * @filename RandomLootSystem.js
 * @orderAfter PluginManager
 *
 * @command getItem
 * @text Get Random Item
 * @desc Adds a random item to the player's inventory.
 *
 * @command getArmor
 * @text Get Random Armor
 * @desc Adds a random armor to the player's inventory.
 *
 * @command getWeapon
 * @text Get Random Weapon
 * @desc Adds a random weapon to the player's inventory.
 *
 * @help
 * This plugin adds commands to randomly generate loot with rarity tiers.
 * * Plugin Commands (MV Style):
 * getItem                # Get a random item
 * getArmor               # Get a random armor
 * getWeapon              # Get a random weapon
 * * --- HOW RARITY IS CALCULATED ---
 * The plugin calculates a "Rarity Score" (0-100).
 * Formula: (Game Variable 2) + (Party Median Level)
 * * 1. Party Median Level:
 * As your party levels up, loot automatically improves.
 * * 2. Game Variable 2 (Modifier):
 * Use this variable to add "Map Difficulty" or "Luck".
 * - Set to 0: Loot is based purely on party level.
 * - Set to 20: Loot is equivalent to a party 20 levels higher.
 * - Set to -20: Loot is worse (good for low-level areas).
 * * Score Benchmarks:
 * - 0-20: Almost all Common items
 * - 25-45: Mix of Common and Uncommon
 * - 50: Balanced distribution
 * - 75: More Epic and Legendary items
 * - 100: Almost all Legendary items
 * * Rarity Tiers (based on item price):
 * - Common (White): 8000-19999 gold
 * - Uncommon (Green): 20000-59999 gold
 * - Rare (Blue): 60000-99999 gold
 * - Epic (Purple): 100000-999999 gold
 * - Legendary (Orange): 1000000+ gold
 */

(function() {
    
    // Define rarity tiers and their colors
    const RARITY_TIERS = [
        { name: "Common", colorCode: "#FFFFFF", minPrice: 8000, maxPrice: 19999 },
        { name: "Uncommon", colorCode: "#1AFF1A", minPrice: 20000, maxPrice: 59999 },
        { name: "Rare", colorCode: "#0080FF", minPrice: 60000, maxPrice: 99999 },
        { name: "Epic", colorCode: "#8000FF", minPrice: 100000, maxPrice: 999999 },
        { name: "Legendary", colorCode: "#FF8000", minPrice: 1000000, maxPrice: Infinity }
    ];
    
    // The variable ID that acts as a modifier (0-100)
    const RARITY_VARIABLE_ID = 2;
    
    // Calculate the rarity tier based on item price
    function getItemRarityTier(price) {
        for (let tier of RARITY_TIERS) {
            if (price >= tier.minPrice && price <= tier.maxPrice) {
                return tier;
            }
        }
        return RARITY_TIERS[0]; // Default to Common if something goes wrong
    }

    // --- NEW: Calculate Party Median Level ---
    function getPartyMedianLevel() {
        // Get battle members
        const members = $gameParty.battleMembers();
        if (members.length === 0) return 1;

        // Extract levels and sort numerically
        const levels = members.map(actor => actor.level).sort((a, b) => a - b);
        
        const mid = Math.floor(levels.length / 2);

        // Calculate median
        if (levels.length % 2 !== 0) {
            // Odd number of members, pick middle
            return levels[mid];
        } else {
            // Even number of members, average the two middle ones
            return Math.floor((levels[mid - 1] + levels[mid]) / 2);
        }
    }
    
    // WEIGHT CALCULATION
    function calculateItemWeight(itemPrice, rarityInfluence) {
        // Determine which tier this item belongs to
        let tierIndex = 0;
        for (let i = 0; i < RARITY_TIERS.length; i++) {
            if (itemPrice >= RARITY_TIERS[i].minPrice && itemPrice <= RARITY_TIERS[i].maxPrice) {
                tierIndex = i;
                break;
            }
        }
        
        // Normalize influence to 0-1 range
        const influence = rarityInfluence / 100;
        
        // Calculate tier position (0 = Common, 1 = Legendary)
        const tierPower = tierIndex / (RARITY_TIERS.length - 1);
        
        // Use smooth power curve for weight calculation
        let weight = Math.pow(influence, tierPower * 3) * Math.pow(1 - influence, (1 - tierPower) * 3) * 1000;
        
        // Boost Uncommon items by 50% to make them more common
        if (tierIndex === 1) {
            weight *= 1.5;
        }
        
        return Math.max(1, weight);
    }
    
    // Get random item based on rarity influence
    function getRandomItem(itemList) {
        if (!itemList || itemList.length === 0) return null;
        
        // Filter out null items
        const validItems = itemList.filter(item => item);
        if (validItems.length === 0) return null;
        
        // --- UPDATED LOGIC START ---
        // Get modifier from variable (Luck/Difficulty)
        const variableModifier = $gameVariables.value(RARITY_VARIABLE_ID);
        // Get party median level
        const partyLevel = getPartyMedianLevel();
        
        // Combine them, ensuring the result is between 0 and 100
        let rarityInfluence = variableModifier + partyLevel;
        rarityInfluence = Math.max(0, Math.min(100, rarityInfluence));
        // --- UPDATED LOGIC END ---
        
        // Calculate weighted probability for each item
        let weightedItems = [];
        let totalWeight = 0;
        
        for (let item of validItems) {
            // Skip items with price of 0 (usually key items)
            if (item.price === 0) continue;
            
            // Calculate weight using new algorithm
            const weight = calculateItemWeight(item.price, rarityInfluence);
            
            weightedItems.push({
                item: item,
                weight: weight
            });
            
            totalWeight += weight;
        }
        
        // If no valid weighted items, return random item
        if (weightedItems.length === 0 || totalWeight === 0) {
            return validItems[Math.floor(Math.random() * validItems.length)];
        }
        
        // Select random item based on weight
        let random = Math.random() * totalWeight;
        let currentWeight = 0;
        
        for (let weightedItem of weightedItems) {
            currentWeight += weightedItem.weight;
            if (random <= currentWeight) {
                return weightedItem.item;
            }
        }
        
        // Fallback
        return validItems[Math.floor(Math.random() * validItems.length)];
    }
    
    // Create the notification window
    function showLootMessage(item) {
        if (!item) return;
        const rarityTier = getItemRarityTier(item.price);
        const colorCode = rarityTier.colorCode;
        const message = ConfigManager.language === 'it'? `\\c[0]Hai trovato \\c[${colorToCode(colorCode)}]${ window.translateText(item.name)}` :`\\c[0]You found \\c[${colorToCode(colorCode)}]${item.name}`;
        window.skipLocalization = true
        $gameMessage.add(message);
        window.skipLocalization = false
    }
    
    // Convert hex color to RPG Maker color code
    function colorToCode(hexColor) {
        const colorMap = {
            "#FFFFFF": 0, // White
            "#1AFF1A": 3, // Green
            "#0080FF": 4, // Blue
            "#8000FF": 10, // Purple
            "#FF8000": 6  // Orange
        };
        
        return colorMap[hexColor] || 0;
    }
    
    // Extend the plugin command interpreter for MV
    const _Game_Interpreter_pluginCommand = Game_Interpreter.prototype.pluginCommand;
    Game_Interpreter.prototype.pluginCommand = function(command, args) {
        _Game_Interpreter_pluginCommand.call(this, command, args);
        
        switch (command.toLowerCase()) {
            case 'getitem':
                const randomItem = getRandomItem($dataItems);
                if (randomItem) {
                    $gameParty.gainItem(randomItem, 1);
                    showLootMessage(randomItem);
                }
                break;
                
            case 'getarmor':
                const randomArmor = getRandomItem($dataArmors);
                if (randomArmor) {
                    $gameParty.gainItem(randomArmor, 1);
                    showLootMessage(randomArmor);
                }
                break;
                
            case 'getweapon':
                const randomWeapon = getRandomItem($dataWeapons);
                if (randomWeapon) {
                    $gameParty.gainItem(randomWeapon, 1);
                    showLootMessage(randomWeapon);
                }
                break;
        }
    };
    
    // Register plugin commands for MZ
    if (Utils.RPGMAKER_NAME === "MZ") {
        PluginManager.registerCommand("RandomLootSystem", "getItem", args => {
            const randomItem = getRandomItem($dataItems);
            if (randomItem) {
                $gameParty.gainItem(randomItem, 1);
                showLootMessage(randomItem);
            }
        });
        
        PluginManager.registerCommand("RandomLootSystem", "getArmor", args => {
            const randomArmor = getRandomItem($dataArmors);
            if (randomArmor) {
                $gameParty.gainItem(randomArmor, 1);
                showLootMessage(randomArmor);
            }
        });
        
        PluginManager.registerCommand("RandomLootSystem", "getWeapon", args => {
            const randomWeapon = getRandomItem($dataWeapons);
            if (randomWeapon) {
                $gameParty.gainItem(randomWeapon, 1);
                showLootMessage(randomWeapon);
            }
        });
    }
})();
/*:
 * @target MZ
 * @plugindesc [v1.1.0] Playtest Boost
 * @author Omni-Lex
 * @version 1.1.0
 * @description Gives player bonus resources when player name is "test"
 *
 * @param goldAmount
 * @text Gold Amount
 * @desc Amount of gold to give in playtest mode
 * @type number
 * @default 10000
 *
 * @param itemCount
 * @text Random Items Count
 * @desc Number of random items to give
 * @type number
 * @default 20
 *
 * @param skillCount
 * @text Random Skills Count
 * @desc Number of random skills to give
 * @type number
 * @default 30
 *
 * @help PlaytestBoost.js
 * 
 * This plugin automatically gives the player bonus resources when starting
 * a new game if the player name is "test":
 * - 10000 gold (configurable)
 * - 20 random items (configurable)
 * - 30 random skills to the main character (configurable)
 * 
 * Additionally, on game start, common event 149 will be called if the
 * starting map is not map 557.
 * 
 * The bonuses are only applied when the player name is "test".
 * 
 * Place this plugin in your js/plugins folder and activate it in the
 * Plugin Manager.
 * 
 * Version History:
 * v1.1.0 - Added player name check and common event call
 * v1.0.0 - Initial release
 */

(() => {
    'use strict';
    
    // Get plugin parameters
    const pluginName = 'PlaytestBoost';
    const parameters = PluginManager.parameters(pluginName);
    const goldAmount = parseInt(parameters['goldAmount'] || 10000);
    const itemCount = parseInt(parameters['itemCount'] || 20);
    const skillCount = parseInt(parameters['skillCount'] || 30);
    
    // Function to check if player name is "test"
    function isTestPlayer() {
        if ($gameParty.allMembers().length > 0) {
            const actor = $gameParty.allMembers()[0];
            return actor.name().toLowerCase() === 'test';
        }
        return false;
    }
    
    // Function to get random items from the database
    function getRandomItems(count) {
        const items = [];
        const maxItems = $dataItems.length - 1;
        const maxWeapons = $dataWeapons.length - 1;
        const maxArmors = $dataArmors.length - 1;
        
        for (let i = 0; i < count; i++) {
            const itemType = Math.floor(Math.random() * 3); // 0: item, 1: weapon, 2: armor
            let itemId;
            let amount = Math.floor(Math.random() * 5) + 1; // 1-5 of each item
            
            switch (itemType) {
                case 0: // Items
                    itemId = Math.floor(Math.random() * maxItems) + 1;
                    if ($dataItems[itemId] && $dataItems[itemId].name) {
                        items.push({ type: 0, id: itemId, amount: amount });
                    }
                    break;
                case 1: // Weapons
                    itemId = Math.floor(Math.random() * maxWeapons) + 1;
                    if ($dataWeapons[itemId] && $dataWeapons[itemId].name) {
                        items.push({ type: 1, id: itemId, amount: 1 }); // Weapons usually 1 each
                    }
                    break;
                case 2: // Armors
                    itemId = Math.floor(Math.random() * maxArmors) + 1;
                    if ($dataArmors[itemId] && $dataArmors[itemId].name) {
                        items.push({ type: 2, id: itemId, amount: 1 }); // Armors usually 1 each
                    }
                    break;
            }
        }
        
        return items;
    }
    
    // Function to get random skills
    function getRandomSkills(count) {
        const skills = [];
        const maxSkills = $dataSkills.length - 1;
        
        for (let i = 0; i < count; i++) {
            const skillId = Math.floor(Math.random() * maxSkills) + 1;
            if ($dataSkills[skillId] && $dataSkills[skillId].name && !skills.includes(skillId)) {
                skills.push(skillId);
            }
        }
        
        return skills;
    }
    
    // Function to apply playtest bonuses
    function applyPlaytestBonuses() {
        if (!isTestPlayer()) return; // Only when player name is "test"

        console.log('Applying playtest bonuses for player "test"...');

        // Give gold
        $gameParty.gainGold(goldAmount);

        // Give random items
        const randomItems = getRandomItems(itemCount);
        randomItems.forEach(item => {
            switch (item.type) {
                case 0: // Items
                    $gameParty.gainItem($dataItems[item.id], item.amount);
                    break;
                case 1: // Weapons
                    $gameParty.gainItem($dataWeapons[item.id], item.amount);
                    break;
                case 2: // Armors
                    $gameParty.gainItem($dataArmors[item.id], item.amount);
                    break;
            }
        });

        // Give specific starting skills to the first actor
        if ($gameParty.allMembers().length > 0) {
            const actor = $gameParty.allMembers()[0];
            const startingSkills = [2, 3, 4, 10, 836, 837, 838, 839];

            // Learn all starting skills
            startingSkills.forEach(skillId => {
                if ($dataSkills[skillId]) {
                    actor.learnSkill(skillId);
                }
            });

            // Additionally give random skills
            const randomSkills = getRandomSkills(skillCount);
            randomSkills.forEach(skillId => {
                if (!startingSkills.includes(skillId)) {
                    actor.learnSkill(skillId);
                }
            });
        }

        console.log(`Playtest bonuses applied: ${goldAmount} gold, ${randomItems.length} items, ${skillCount} random skills + 8 starting skills`);
    }
    
    // Function to call common event 149 if not in map 557
    function callCommonEventIfNeeded() {
        if ($gameMap.mapId() !== 557) {
            console.log('Waiting 2 seconds before calling common event 149...');
            // Wait 2 seconds (120 frames at 60fps)
            setTimeout(() => {
                console.log('Calling common event 149 (not in map 557)...');
                $gameTemp.reserveCommonEvent(149);
            }, 2000); // 2000ms = 2 seconds
        }
    }
    
    // Hook into the new game start
    const _DataManager_setupNewGame = DataManager.setupNewGame;
    DataManager.setupNewGame = function() {
        _DataManager_setupNewGame.call(this);
        
        // Mark that this is a new game
        setTimeout(() => {
            if ($gameSystem) {
                $gameSystem._playtestIsNewGame = true;
            }
        }, 50);
    };
    
    // Hook into map setup
    const _Scene_Map_onMapLoaded = Scene_Map.prototype.onMapLoaded;
    Scene_Map.prototype.onMapLoaded = function() {
        _Scene_Map_onMapLoaded.call(this);

        // Apply bonuses and call common event only once at the very beginning of a NEW game
        // Only if:
        // 1. NOT starting on map 557 (which is likely a special area without bonuses)
        // 2. Player name is "Test" (case-insensitive)
        if (!$gameSystem._playtestBonusApplied && $gameSystem._playtestIsNewGame) {
            // If starting on map 557, disable the system for the rest of the game
            if ($gameMap.mapId() === 557) {
                $gameSystem._playtestDisabled = true;
                console.log('PlaytestBoost: System disabled (started on map 557)');
            }

            // Wait 2 seconds before applying bonuses and common event to avoid timing issues
            setTimeout(() => {
                // Apply bonuses only if player name is "Test" and not on map 557
                if (!$gameSystem._playtestDisabled && isTestPlayer()) {
                    applyPlaytestBonuses();
                    callCommonEventIfNeeded();
                    console.log('PlaytestBoost: Bonuses and events applied');
                } else if ($gameSystem._playtestDisabled) {
                    console.log('PlaytestBoost: System disabled, no bonuses applied');
                } else {
                    console.log('PlaytestBoost: Player name is not "Test", no bonuses applied');
                }

                $gameSystem._playtestBonusApplied = true;
                $gameSystem._playtestIsNewGame = false;
            }, 2000); // Wait 2 seconds (2000ms) to avoid command 355 errors
        }
    };
    
    // Initialize the flags
    const _Game_System_initialize = Game_System.prototype.initialize;
    Game_System.prototype.initialize = function() {
        _Game_System_initialize.call(this);
        this._playtestBonusApplied = false;
        this._playtestIsNewGame = false;
        this._playtestDisabled = false; // Flag to disable system if started on map 557
    };
})();
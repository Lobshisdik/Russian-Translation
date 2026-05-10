// ============================================================================
// Battle System Enhanced
// For RPG Maker MZ
// ============================================================================

/*:
 * @target MZ
 * @plugindesc Combines persistent battles, respawn, and a dynamic event-based encounter system.
 * @author Combined by Claude, modified by OmniLex
 * @pluginName BattleSystemEnhanced
 *
 * @param respawnMapVar
 * @text Respawn Map Variable ID
 * @desc Game variable ID to store respawn map ID
 * @type variable
 * @default 1
 *
 * @param respawnXVar
 * @text Respawn X Variable ID
 * @desc Game variable ID to store respawn X coordinate
 * @type variable
 * @default 2
 *
 * @param respawnYVar
 * @text Respawn Y Variable ID
 * @desc Game variable ID to store respawn Y coordinate
 * @type variable
 * @default 3
 *
 * @command startBattle
 * @text Start Event Battle
 * @desc Start a battle with the event's fixed troop and maintain HP state
 *
 * @arg eventId
 * @text Event ID
 * @desc The ID of the event to battle with (use 0 for event running this command)
 * @type number
 * @default 0
 *
 * @command setRespawnPoint
 * @text Set Respawn Point
 * @desc Set the map ID and coordinates where the player will respawn
 *
 * @arg mapId
 * @text Map ID
 * @desc The ID of the map to respawn on
 * @type number
 * @default 1
 *
 * @arg x
 * @text X Coordinate
 * @desc The X coordinate to respawn at
 * @type number
 * @default 21
 *
 * @arg y
 * @text Y Coordinate
 * @desc The Y coordinate to respawn at
 * @type number
 * @default 26
 *
 * @command restore
 * @text Restore Inventory
 * @desc Restores the player's gold and inventory from their last death point and removes the gravestone data.
 *
 * @help
 * This plugin combines several features into one system.
 *
 * NEW ENCOUNTER SYSTEM:
 * - Disables default random encounters.
 * - Instead, finds all events named "Enemy" on the map.
 * - Assigns a troop to each "Enemy" event from the map's encounter list.
 * - This assignment is based on the event's regionId and the troop's weight.
 * - The event's sprite is automatically updated to match the first enemy in the troop.
 * (Requires <Char:SpriteName> notetag in the enemy's notes).
 * - Spawns are refreshed when the player changes maps.
 *
 * BATTLE & RESPAWN FEATURES:
 * 1. Maintains enemy HP between battles if player escapes.
 * 2. Hides battle messages (battle start, escape, victory).
 * 3. Shows a reward popup after battle instead of victory messages.
 * 4. Deletes the calling event if player wins the battle.
 * 5. Temporarily stops event movement for 60 frames if player flees.
 * 6. When actor 1 dies, ends battle, cures them, and respawns the player.
 * 7. When other actors die, they are removed from the party after battle.
 * 8. Health Protection: Each actor gets one-time protection per battle that prevents
 *    death on first lethal hit, keeping them at 1 HP instead.
 *
 * GRAVESTONE & RESTORE FEATURE:
 * - If the player dies while Switch 9 is ON:
 * - The player's current Map ID, X, and Y coordinates are saved.
 * - All of the player's gold and unequipped items are saved.
 * - The party loses all gold and unequipped items. Equipped items are lost.
 * - Each time the player dies, the previous gravestone data is overwritten.
 * - If the player enters the map where they last died, an event named "Gravestone"
 * on that map will be moved to the death coordinates. If no such event
 * exists, nothing happens.
 * - Use the "Restore" plugin command to get back the saved gold and items. This
 * also clears the saved data, so the gravestone will no longer appear unless
 * the player dies again.
 *
 * Usage:
 * 1. To use the new encounter system, create events and name them "Enemy".
 * 2. Set up your map's encounter list with troops, weights, and region IDs.
 * 3. In the Enemies database, add a note tag like: <Char:YourSprite>
 * This will make events use img/characters/Monsters/YourSprite.png
 * 4. Use the "Start Event Battle" command to initiate combat with these events.
 *
 * Terms of Use:
 * Free for use in both commercial and non-commercial projects.
 */

(() => {
    const pluginName = "BattleSystemEnhanced";

    // Get plugin parameters
    const parameters = PluginManager.parameters(pluginName);
    const respawnMapVar = 25;
    const respawnXVar = 26;
    const respawnYVar = 27;
    const respawnCountryIDVar = 112;

    let _lastSpawnedMapId = null; // Changed from _lastShuffledMapId
    let _battleCooldownTimer = 0;
    const BATTLE_COOLDOWN_FRAMES = 120; // 2 seconds at 60fps
    // Aquatic Enemy Archetype List - Only spawn in water, move freely in water at normal speed
    const AQUATIC_ENEMY_ARCHETYPES = [
        'Octopus',
        'AquaticFish',
        'SeaCreature',
        'TentacledCreature', //TODO remove this
        'DeepSea',
        'Coral',
        'Whale',
        'Shark',
        'Jellyfish',
        'Crab',
        'Lobster',
        'Seahorse',
        'Starfish',
        'Eel',
        'Dolphin',
        'Manta',
        'Squid',
        'Kraken',
        'Leviathan',
        'Merfolk',
        'Siren',
        'WaterElemental',
    ];

    // Amphibious Enemy Archetype List - Spawn on land, faster in water, slower on land
    const AMPHIBIOUS_ENEMY_ARCHETYPES = [
        'Crocodile',
        'Penguin',
        'Frog',
        'SeaTurtle',
    ];

    // Flying Enemy Archetype List - Ignore terrain restrictions, move freely everywhere at normal speed
    const FLYING_ENEMY_ARCHETYPES = [
        'Bird',
        'Elemental',
        'Ghost',
    ];

    //=============================================================================
    // Persistent Battle System - Core Variables
    //=============================================================================

    const _persistentEnemyData = {};
    let _currentBattleEventId = null;
    let _currentEventId = null;
    let _currentMapId = null;
    let _battleRewards = { exp: 0, gold: 0, items: [] };
    let _needsRespawn = false;
    const _enemyCharSprites = {};

    //=============================================================================
    // i18n
    //=============================================================================
    let _battleI18n = null;

    const _loadBattleI18n = async () => {
        const lang = ConfigManager.language || 'en';
        const url = `js/plugins/i18n/${lang}/battle.json`;
        try {
            const response = await fetch(url);
            _battleI18n = await response.json();
        } catch (e) {
            console.error('BattleSystemEnhanced: Failed to load i18n data from ' + url, e);
        }
    };

    // Return a list (array) from a dot-path under battle.*
    const _bi18nList = (path) => {
        const parts = ('battle.' + path).split('.');
        let val = _battleI18n;
        for (const p of parts) { if (val) val = val[p]; }
        return Array.isArray(val) ? val : null;
    };

    _loadBattleI18n();

    //=============================================================================
    // NEW: Health Protection System
    //=============================================================================

    // Track which actors have used their protection this battle
    let _healthProtectionUsed = {};

    /**
     * Resets health protection for all actors at battle start
     */
    function resetHealthProtection() {
        _healthProtectionUsed = {};
        $gameParty.members().forEach((actor, index) => {
            _healthProtectionUsed[actor.actorId()] = false;
        });
    }

    /**
     * Checks if actor has health protection available
     */
    function hasHealthProtection(actorId) {
        return !_healthProtectionUsed[actorId];
    }

    /**
     * Uses health protection for an actor
     */
    function useHealthProtection(actorId) {
        _healthProtectionUsed[actorId] = true;
    }

    /**
     * Shows health protection message
     */
    function showHealthProtectionMessage(actorName) {
        const protectionMessages = [
            " narrowly avoided death!",
            " was saved by divine intervention!",
            " clung to life with determination!",
            " refused to give up!",
            " survived through sheer willpower!",
            " was protected by fate!"
        ];

        const message = actorName + protectionMessages[Math.floor(Math.random() * protectionMessages.length)];
        window.skipLocalization = true;
        $gameMessage.add(message);
        window.skipLocalization = false;
    }

    // Add this function near the top of the plugin, after the helper functions

    /**
     * Shows a warning dialogue if the enemy is too dangerous for the party
     */
    function checkAndShowDangerousEnemyWarning() {
        if (!$gameTroop || !$gameTroop.members().length) return;

        const party = $gameParty.members();
        if (!party.length) return;

        // Get median party level
        const partyMedian = getMedianLevel(party);

        // Get highest enemy level in the troop
        const highestEnemyLevel = Math.max(...$gameTroop.members().map(enemy => {
            const enemyData = $dataEnemies[enemy.enemyId()];
            return enemyData ? getEnemyLevel(enemyData.note) : 0;
        }));

        // Check if enemy is more than 13 levels above party median
        if (highestEnemyLevel > partyMedian + 13) {
            showDangerWarning(party);
        }
    }

    /**
     * Shows the actual warning message
     */
    /**
     * Shows the actual warning message
     */
    function showDangerWarning(party) {
        let message;

        if (party.length === 1) {
            // Single party member
            const list = _bi18nList('dangerWarning.single');
            const pool = list || ["I'm outmatched! I should retreat!"];
            message = party[0].name() + ": " + pool[Math.floor(Math.random() * pool.length)];
        } else {
            // Multiple party members - pick random one
            const randomMember = party[Math.floor(Math.random() * party.length)];
            const list = _bi18nList('dangerWarning.party');
            const pool = list || ["We're outmatched! We should retreat!"];
            message = randomMember.name() + ": " + pool[Math.floor(Math.random() * pool.length)];
        }

        // Check if switch 45 is on - if so, show at top of screen
        // In ASCII mode, always use standard message so it renders on ASCII canvas
        if ($gameSwitches.value(45) && (!window.AsciiMode || !window.AsciiMode.active)) {
            showTopScreenMessage(message);
        } else {
            window.skipLocalization = true;
            $gameMessage.add(message);
            window.skipLocalization = false;
        }
    }
    /**
     * Shows a message at the top of the screen
     */
    function showTopScreenMessage(message) {
        // Create a temporary window at the top of the screen
        if (SceneManager._scene && SceneManager._scene.constructor === Scene_Battle) {
            // We're in battle scene
            const scene = SceneManager._scene;

            // Create a custom window for top screen message
            if (!scene._topWarningWindow) {
                scene._topWarningWindow = new Window_TopWarning();
                scene.addWindow(scene._topWarningWindow);
            }

            scene._topWarningWindow.showMessage(message);
        }
    }
    Game_Player.prototype.executeEncounter = function () {
    }

    const _Scene_Map_stopAudioOnBattleStart = Scene_Map.prototype.stopAudioOnBattleStart;
    Scene_Map.prototype.stopAudioOnBattleStart = function () {
        // Safety check: ensure battleBgm is not being called as a function
        if ($gameSystem && typeof $gameSystem.battleBgm === 'function') {
            // If it's somehow a function, replace it with default
            $gameSystem._battleBgm = {
                name: ConfigManager.battleMusicName || 'RandomMind/Battle',
                volume: 90,
                pitch: 100,
                pan: 0
            };
        }
        _Scene_Map_stopAudioOnBattleStart.call(this);
    };
    //=============================================================================
    // Window_TopWarning - Custom window for top screen messages
    //=============================================================================
    function Window_TopWarning() {
        this.initialize(...arguments);
    }

    Window_TopWarning.prototype = Object.create(Window_Base.prototype);
    Window_TopWarning.prototype.constructor = Window_TopWarning;

    Window_TopWarning.prototype.initialize = function () {
        const width = Graphics.boxWidth;
        const height = this.fittingHeight(2); // 2 lines height
        const x = 0;
        const y = 0; // Top of screen
        Window_Base.prototype.initialize.call(this, new Rectangle(x, y, width, height));
        this.openness = 0;
        this._displayTimer = 0;
        this._message = "";
    };

    Window_TopWarning.prototype.showMessage = function (message) {
        this._message = message;
        this._displayTimer = 180; // Show for 3 seconds (60fps * 3)
        this.refresh();
        this.open();
    };

    Window_TopWarning.prototype.refresh = function () {
        this.contents.clear();
        if (this._message) {
            // Set text color to red for warning
            this.changeTextColor(ColorManager.textColor(2)); // Red color
            this.drawText(this._message, 0, 0, this.contentsWidth(), 'center');
            this.resetTextColor();
        }
    };

    Window_TopWarning.prototype.update = function () {
        Window_Base.prototype.update.call(this);

        if (this._displayTimer > 0) {
            this._displayTimer--;
            if (this._displayTimer <= 0) {
                this.close();
            }
        }
    };
    // ==========================
    // Enemy Level Display System
    // ==========================
    ////console.log("!!! ENEMY LEVEL DISPLAY SYSTEM LOADED !!!");

    // ==========================
    // Enemy Level Display System - FULL DEBUG
    // ==========================
    //console.log("!!! ENEMY LEVEL DISPLAY SYSTEM LOADED !!!");

    // Helper function to get enemy level from event
    function getEnemyLevelFromEvent(event) {

        if (!event._fixedTroopId || event._fixedTroopId === 0) {
            return 0;
        }

        const troop = $dataTroops[event._fixedTroopId];

        if (!troop || !troop.members.length) {
            return 0;
        }

        // Get the highest level enemy in the troop
        let maxLevel = 0;
        for (const member of troop.members) {
            const enemyData = $dataEnemies[member.enemyId];
            if (enemyData && enemyData.note) {
                const level = getEnemyLevel(enemyData.note);
                if (level > maxLevel) {
                    maxLevel = level;
                }
            }
        }
        return maxLevel;
    }

    // Override Sprite_Character update
    const _Sprite_Character_update_EnemyLevel = Sprite_Character.prototype.update;
    Sprite_Character.prototype.update = function () {
        _Sprite_Character_update_EnemyLevel.call(this);
        this.updateEnemyLevelLabel();
    };

    Sprite_Character.prototype.updateEnemyLevelLabel = function () {
        const character = this._character;
        if (!character) return;

        const eventId = character.eventId ? character.eventId() : null;
        if (!eventId) return;

        const event = $gameMap.event(eventId);
        if (!event) return;

        const eventData = event.event();
        if (!eventData) return;

        // Check if fixedTroopId has been assigned (works for any event name, not just "Enemy")
        if (!event._fixedTroopId || event._fixedTroopId === 0) {
            return; // Wait for spawning system to assign it
        }

        // Check if troopId changed (or label doesn't exist yet)
        if (this._lastEnemyTroopId !== event._fixedTroopId) {
            //console.log("TROOP ID CHANGED OR NEW! Old:", this._lastEnemyTroopId, "New:", event._fixedTroopId);
            this._lastEnemyTroopId = event._fixedTroopId;

            // Remove old label if exists
            if (this._enemyLevelLabel) {
                this.removeChild(this._enemyLevelLabel);
                this._enemyLevelLabel = null;
            }

            // Get enemy level
            const enemyLevel = getEnemyLevelFromEvent(event);
            //console.log("Got enemy level:", enemyLevel);

            if (enemyLevel > 0) {
                //console.log("CREATING LABEL NOW!");
                this.createEnemyLevelLabel(enemyLevel);
            }
        }
    };

    Sprite_Character.prototype.createEnemyLevelLabel = function (level) {
        //console.log("=== createEnemyLevelLabel START ===");
        //console.log("Level:", level);

        const party = $gameParty.members();
        //console.log("Party members:", party.length);

        const medianLevel = party.length > 0 ? getMedianLevel(party) : 1;
        //console.log("Median level:", medianLevel);

        const levelDiff = level - medianLevel;
        //console.log("Level diff:", levelDiff);

        let color = '#FFFFFF';
        if (levelDiff > 30) {
            color = '#FF0000';
        } else if (levelDiff > 15) {
            color = '#FFFF00';
        }
        //console.log("Color:", color);

        this._enemyLevelLabel = new Sprite();
        //console.log("Created sprite:", this._enemyLevelLabel);

        this._enemyLevelLabel.bitmap = new Bitmap(80, 30);
        //console.log("Created bitmap:", this._enemyLevelLabel.bitmap);

        this._enemyLevelLabel.anchor.x = 0.5;
        this._enemyLevelLabel.anchor.y = 1;
        //console.log("Set anchors");

        const bitmap = this._enemyLevelLabel.bitmap;
        bitmap.fontFace = 'GameFont';
        bitmap.fontSize = 18;
        bitmap.textColor = color;
        bitmap.outlineColor = 'rgba(0, 0, 0, 0.8)';
        bitmap.outlineWidth = 4;
        //console.log("Set font properties");

        const text = `L. ${level}`;
        //console.log("Drawing text:", text);
        bitmap.drawText(text, 0, 0, 80, 30, 'center');

        this._enemyLevelLabel.y = -50;
        //console.log("Set Y position:", this._enemyLevelLabel.y);

        //console.log("Adding child to sprite. Current children:", this.children.length);
        this.addChild(this._enemyLevelLabel);
        //console.log("After add. Children:", this.children.length);

        //console.log("=== createEnemyLevelLabel END ===");
    };

    //=============================================================================
    // NEW: Gravestone System Helper Function
    //=============================================================================
    function saveDeathData() {
        if ($gameSwitches.value(9)) {
            const savedData = {
                mapId: $gameMap.mapId(),
                x: $gamePlayer.x,
                y: $gamePlayer.y,
                gold: $gameParty.gold(),
                items: {}
            };

            // Save and then remove standard items
            $gameParty.items().forEach(item => {
                const count = $gameParty.numItems(item);
                savedData.items['i' + item.id] = count;
                $gameParty.loseItem(item, count, false);
            });

            // Save and then remove unequipped weapons
            $gameParty.weapons().forEach(weapon => {
                const isEquipped = $gameParty.members().some(actor => actor.isEquipped(weapon));
                if (!isEquipped) {
                    const count = $gameParty.numItems(weapon);
                    savedData.items['w' + weapon.id] = count;
                    $gameParty.loseItem(weapon, count, false);
                }
            });

            // Save and then remove unequipped armors
            $gameParty.armors().forEach(armor => {
                const isEquipped = $gameParty.members().some(actor => actor.isEquipped(armor));
                if (!isEquipped) {
                    const count = $gameParty.numItems(armor);
                    savedData.items['a' + armor.id] = count;
                    $gameParty.loseItem(armor, count, false);
                }
            });

            $gameParty.loseGold($gameParty.gold());
            $gameSystem.setDeathData(savedData);
        }
    }

    // ——— Helper to pull the level from <Level:X> tag in enemy's note ———
    function getEnemyLevel(note) {
        const m = note.match(/<Level:\s*(\d+)>/i);
        return m ? parseInt(m[1], 10) : 0;
    }

    function getMedianLevel(party) {
        const levels = party.map(m => m.level).sort((a, b) => a - b);
        const mid = Math.floor(levels.length / 2);
        return levels.length % 2
            ? levels[mid]
            : (levels[mid - 1] + levels[mid]) / 2;
    }

    /**
     * Extract biome from map note or procedural map data
     * Returns the biome string or null if not found
     */
    function getMapBiome() {
        // Check if this is the procedural map (636)
        if ($gameMap && $gameMap.mapId() === 636) {
            if ($gameSystem && $gameSystem._procGenData && $gameSystem._procGenData.currentBiome) {
                // Check for virtual biome overrides (Island takes priority over Beach)
                if ($gameSystem._procGenData.displayAsIsland) {
                    return "Island";
                }
                if ($gameSystem._procGenData.displayAsBeach) {
                    return "Beach";
                }
                return $gameSystem._procGenData.currentBiome;
            }
        }

        // Check map note for biome tag
        if (!$dataMap || !$dataMap.note) return null;
        const biomeMatch = $dataMap.note.match(/<Biome:\s*(.+?)>/i);
        return biomeMatch ? biomeMatch[1].trim() : null;
    }

    /**
     * Simple seeded random number generator
     * @param {number} seed - The seed value
     * @returns {function} - A function that returns a random number between 0 and 1
     */
    function createSeededRandom(seed) {
        return function () {
            seed = (seed * 9301 + 49297) % 233280;
            return seed / 233280;
        };
    }

    /**
     * Get world coordinates from procedural map data
     * Returns {x, y} for procedural maps, or null for regular maps
     */
    function getWorldCoordinates() {
        if ($gameMap && $gameMap.mapId() === 636) {
            if ($gameSystem && $gameSystem._procGenData) {
                return {
                    x: $gameSystem._procGenData.originX || 0,
                    y: $gameSystem._procGenData.originY || 0
                };
            }
        }
        return null;
    }

    /**
     * Check if currently underground
     * @returns {boolean} - True if player is in an underground layer
     */
    function isUnderground() {
        if ($gameSystem && $gameSystem._procGenData && $gameSystem._procGenData.biomeLayerStack) {
            return $gameSystem._procGenData.biomeLayerStack.length > 0;
        }
        return false;
    }

    /**
     * Get all boss troops (containing at least one enemy level 70+)
     * Filtered by biome if applicable
     * @param {string} targetBiome - Optional biome to filter by
     * @returns {number[]} - Array of boss troop IDs
     */
    function getBossTroops(targetBiome = null) {
        const bossTroops = [];

        for (let i = 1; i < $dataTroops.length; i++) {
            const troop = $dataTroops[i];
            if (!troop || !troop.members.length) continue;

            // Check if any enemy in this troop is level 70+
            const hasHighLevelEnemy = troop.members.some(member => {
                const enemyData = $dataEnemies[member.enemyId];
                if (!enemyData) return false;
                const level = getEnemyLevel(enemyData.note);
                return level >= 70;
            });

            if (!hasHighLevelEnemy) continue;

            // If a biome is specified, check if troop matches it
            if (targetBiome) {
                if (!troopMatchesBiome(i, targetBiome)) continue;
            }

            bossTroops.push(i);
        }

        return bossTroops;
    }

    /**
     * Get a seeded boss troop for the first enemy event
     * Selection is deterministic based on world coordinates and underground state
     * @param {string} targetBiome - Optional biome to filter by
     * @returns {number|null} - The boss troop ID, or null if no boss troops available
     */
    function getSeededBossTroop(targetBiome = null) {
        const bossTroops = getBossTroops(targetBiome);
        if (bossTroops.length === 0) return null;

        // Get world coordinates
        const worldCoords = getWorldCoordinates();
        let seed = 12345; // Default seed for non-procedural maps

        if (worldCoords) {
            // For procedural maps, seed from coordinates and underground state
            const underground = isUnderground() ? 1 : 0;
            seed = worldCoords.x + worldCoords.y * 1000 + underground * 1000000;
        }

        // Use seeded RNG to select a boss troop
        const seededRandom = createSeededRandom(seed);
        const randomIndex = Math.floor(seededRandom() * bossTroops.length);
        return bossTroops[randomIndex];
    }

    /**
     * Check if a troop has any enemies that match the given biome
     * @param {number} troopId - The troop ID to check
     * @param {string} targetBiome - The biome to match against
     * @returns {boolean} - True if any enemy in the troop has a matching biome
     */
    function troopMatchesBiome(troopId, targetBiome) {
        if (!targetBiome) return false;

        const troop = $dataTroops[troopId];
        if (!troop || !troop.members.length) return false;

        const targetBiomeLower = targetBiome.toLowerCase().trim();

        // Check each enemy in the troop
        for (const member of troop.members) {
            const enemyData = $dataEnemies[member.enemyId];
            if (!enemyData || !enemyData.note) continue;

            // Extract biome tags from enemy note
            const biomeMatch = enemyData.note.match(/<Biome:\s*(.+?)>/i);
            if (!biomeMatch) continue;

            // Split by comma and check each biome
            const enemyBiomes = biomeMatch[1].split(',').map(b => b.trim().toLowerCase());

            // If any biome matches, this troop is valid for the map
            if (enemyBiomes.includes(targetBiomeLower)) {
                return true;
            }
        }

        return false;
    }

    /** * Fills the `troops` array with up to 4 troop‐IDs whose
     * highest enemy‐level is < 70 (non-boss enemies)
     * Uses weighted distribution: 60% (1-30), 30% (31-50), 10% (51-69)
     */
    function ensureTroops(troops, party, dataEnemies) {
        // find all troop IDs in $dataTroops whose highest member level is < 70
        const pool = $dataTroops
            .slice(1)
            .map((t, i) => ({ troop: t, id: i + 1 }))
            .filter(x => {
                // pick the highest‐level member in that troop
                const maxLv = Math.max(...x.troop.members.map(m => getEnemyLevel(dataEnemies[m.enemyId].note)));
                return maxLv < 70; // Exclude boss-level enemies (70+)
            })
            .map(x => {
                // Add weight based on level: 60% (1-30), 30% (31-50), 10% (51-69)
                const maxLv = Math.max(...x.troop.members.map(m => getEnemyLevel(dataEnemies[m.enemyId].note)));
                let weight = 1;
                if (maxLv >= 1 && maxLv <= 30) {
                    weight = 60;
                } else if (maxLv >= 31 && maxLv <= 50) {
                    weight = 30;
                } else if (maxLv >= 51 && maxLv <= 69) {
                    weight = 10;
                }
                return { ...x, weight: weight };
            });
        if (!pool.length) throw new Error(`No troops < level 70 found`);

        // Weighted random selection for 4 troops
        for (let i = 0; i < 4 && pool.length > 0; i++) {
            const totalWeight = pool.reduce((sum, x) => sum + x.weight, 0);
            let random = Math.random() * totalWeight;

            for (let j = 0; j < pool.length; j++) {
                random -= pool[j].weight;
                if (random <= 0) {
                    troops.push(pool[j].id);
                    pool.splice(j, 1); // Remove selected troop to avoid duplicates
                    break;
                }
            }
        }
    }
    function getEnemyArchetype(enemyData) {
        if (!enemyData || !enemyData.note) return null;
        const archetypeMatch = enemyData.note.match(/<Archetype:\s*(.+?)>/i);
        return archetypeMatch ? archetypeMatch[1].trim() : null;
    }

    function getEventArchetype(event) {
        if (!event || !event._fixedTroopId) return null;
        const troop = $dataTroops[event._fixedTroopId];
        if (!troop || !troop.members.length) return null;
        const enemy = $dataEnemies[troop.members[0].enemyId];
        if (!enemy) return null;
        return getEnemyArchetype(enemy);
    }


    // Check if archetype is an aquatic enemy (can only spawn in region 3)
    function getAcquaticEnemyArchetype(archetype) {
        if (!archetype) return false;
        return AQUATIC_ENEMY_ARCHETYPES.includes(archetype);
    }

    // Check if archetype is amphibious (fast in water, slow on land)
    function getAmphibiousEnemyArchetype(archetype) {
        if (!archetype) return false;
        return AMPHIBIOUS_ENEMY_ARCHETYPES.includes(archetype);
    }

    // Check if archetype is flying (ignores terrain penalties, moves freely)
    function getFlyingEnemyArchetype(archetype) {
        if (!archetype) return false;
        return FLYING_ENEMY_ARCHETYPES.includes(archetype);
    }

    // Helper function to check if troop can spawn at coordinates
    function canTroopSpawnInRegion(troopId, regionId, x, y) {
        const troop = $dataTroops[troopId];
        if (!troop || !troop.members.length) return true; // Default to allowing spawn

        // Get the first enemy in the troop
        const firstMember = troop.members[0];
        if (!firstMember) return true;

        const enemyData = $dataEnemies[firstMember.enemyId];
        if (!enemyData) return true;

        const archetype = getEnemyArchetype(enemyData);
        if (!archetype) return true; // No archetype restriction

        // If archetype is aquatic, it can ONLY spawn in region 99 OR terrain tag 3
        if (getAcquaticEnemyArchetype(archetype)) {
            if (regionId === 99) return true;
            // Also check if tile has terrain tag 3
            if ($gameMap && $gameMap.terrainTag && x !== undefined && y !== undefined) {
                const terrainTag = $gameMap.terrainTag(x, y);
                return terrainTag === 3;
            }
            return false;
        }

        return true; // Non-aquatic enemies can spawn anywhere
    }

    // ========================================================================
    // TIME-BASED ENEMY SPAWNING SYSTEM
    // ========================================================================

    /**
     * Get current game time in 24-hour format
     * Returns {hour, minute} from game variable 114 (total minutes elapsed)
     */
    function getCurrentGameTime() {
        const totalMinutes = $gameVariables.value(114) || 0;
        const hour = Math.floor((totalMinutes / 60) % 24);
        const minute = Math.floor(totalMinutes % 60);
        return { hour, minute, totalMinutes };
    }

    /**
     * Determine time period and return applicable activity patterns
     * Dawn: 5-7, Dusk: 17-19, Day: 7-17, Night: 19-5
     */
    function getTimeOfDay() {
        const { hour } = getCurrentGameTime();

        if (hour >= 5 && hour < 7) return 'dawn';
        if (hour >= 7 && hour < 17) return 'day';
        if (hour >= 17 && hour < 19) return 'dusk';
        if (hour >= 19 || hour < 5) return 'night';
    }

    /**
     * Get which activity patterns should spawn at current time
     * Returns array of activity patterns that can spawn
     */
    function getApplicableActivityPatterns() {
        const timeOfDay = getTimeOfDay();

        switch (timeOfDay) {
            case 'day':
                // Day: prefer Diurnal, always allow Crepuscular
                return ['Diurnal', 'Crepuscular'];
            case 'night':
                // Night: prefer Nocturnal, always allow Crepuscular
                return ['Nocturnal', 'Crepuscular'];
            case 'dawn':
            case 'dusk':
                // Dawn/Dusk: prefer Crepuscular, chance for Diurnal (dawn) or Nocturnal (dusk)
                if (timeOfDay === 'dawn') {
                    // 70% Crepuscular, 30% Diurnal
                    const rand = Math.random();
                    return rand < 0.7 ? ['Crepuscular'] : ['Crepuscular', 'Diurnal'];
                } else {
                    // 70% Crepuscular, 30% Nocturnal
                    const rand = Math.random();
                    return rand < 0.7 ? ['Crepuscular'] : ['Crepuscular', 'Nocturnal'];
                }
        }
        return ['Crepuscular']; // Fallback
    }

    /**
     * Get activity pattern from enemy note
     * Returns 'Nocturnal', 'Diurnal', 'Crepuscular', or null
     */
    function getEnemyActivityPattern(enemyData) {
        if (!enemyData || !enemyData.note) return null;

        if (enemyData.note.includes('<Nocturnal>')) return 'Nocturnal';
        if (enemyData.note.includes('<Diurnal>')) return 'Diurnal';
        if (enemyData.note.includes('<Crepuscular>')) return 'Crepuscular';

        return null;
    }

    /**
     * Check if a troop can spawn at current time
     * Returns true if at least one enemy in troop matches current time
     */
    function canTroopSpawnAtCurrentTime(troopId) {
        const troop = $dataTroops[troopId];
        if (!troop || !troop.members.length) return true; // Default to allowing spawn

        const applicablePatterns = getApplicableActivityPatterns();

        // Check if any enemy in the troop has an applicable activity pattern
        for (const member of troop.members) {
            const enemyData = $dataEnemies[member.enemyId];
            if (!enemyData) continue;

            const activityPattern = getEnemyActivityPattern(enemyData);
            if (activityPattern && applicablePatterns.includes(activityPattern)) {
                return true;
            }
        }

        // If no enemies have activity patterns, allow spawning (legacy support)
        return true;
    }

    /**
     * Filter encounter list by current time
     * Prioritizes applicable patterns, falls back to all if none match
     */
    function filterEncountersByTime(encounterList) {
        if (!encounterList || !encounterList.length) return encounterList;

        const applicablePatterns = getApplicableActivityPatterns();

        // Filter troops that can spawn at current time
        const validTroops = encounterList.filter(encounter =>
            canTroopSpawnAtCurrentTime(encounter.troopId)
        );

        // If no valid troops, return all (fallback for legacy encounters)
        return validTroops.length > 0 ? validTroops : encounterList;
    }

    /**
     * Spawns enemies by assigning troops to events named "Enemy" based on the
     * map's encounter list, region, and weight.
     */
    // Replace the existing spawnEnemiesFromEncounters method with this updated version
    Scene_Map.prototype.spawnEnemiesFromEncounters = function () {
        let encounterList = $gameMap.encounterList();
        if (!encounterList || !encounterList.length) {
            const fallbackIds = [];
            const party = $gameParty.members();
            ensureTroops(fallbackIds, party, $dataEnemies);
            encounterList = fallbackIds.map(id => ({ troopId: id, weight: 1 }));
        }


        const allEnemyEvents = $gameMap.events().filter(ev => {
            const eventData = ev.event();
            return eventData && eventData.name === "Enemy";
        });

        let enemyEvents = allEnemyEvents;
        if ($gameMap.mapId() === 636) {
            if ($gameSystem._procGenDefeatedEnemies) {
                enemyEvents = allEnemyEvents.filter(ev => !$gameSystem._procGenDefeatedEnemies.includes(ev.eventId()));
                const defeatedEvents = allEnemyEvents.filter(ev => $gameSystem._procGenDefeatedEnemies.includes(ev.eventId()));
                defeatedEvents.forEach(ev => ev.erase());
            }
        }

        if (!enemyEvents.length) return;
        // ========================================================================
        // NEW: Urban Biome Population Cap
        // ========================================================================
        const currentBiome = getMapBiome();
        if (currentBiome) {
            const lowerBiome = currentBiome.toLowerCase();
            // Check if biome contains specific keywords
            if (lowerBiome.includes('city') || lowerBiome.includes('burg') || lowerBiome.includes('village')) {
                // If there are more than 3 enemies, remove the excess
                if (enemyEvents.length > 3) {
                    ////console.log(`[BattleSystemEnhanced] Urban biome detected (${currentBiome}). Limiting enemies to 3.`);

                    // Splice changes the array in-place, removing elements from index 3 onwards
                    // It returns the removed elements, which we then erase from the map
                    const excessEvents = enemyEvents.splice(3);

                    excessEvents.forEach(ev => {
                        ev.erase(); // Erase from map immediately
                    });
                }
            }
        }
        // ========================================================================
        // NEW: If map has only 1 encounter and has enemy events, generate random encounter list
        if (encounterList.length === 1 && enemyEvents.length > 0) {
            const party = $gameParty.members();
            if (party.length > 0) {
                // Check if map has a biome
                const mapBiome = getMapBiome();

                // Find all troops - exclude level 70+ (bosses only)
                const biomeTroops = [];
                const nonBiomeTroops = [];

                for (let i = 1; i < $dataTroops.length; i++) {
                    const troop = $dataTroops[i];
                    if (!troop || !troop.members.length) continue;

                    // Get highest level enemy in this troop
                    const maxEnemyLevel = Math.max(...troop.members.map(member => {
                        const enemyData = $dataEnemies[member.enemyId];
                        return enemyData ? getEnemyLevel(enemyData.note) : 0;
                    }));

                    // Exclude boss-level enemies (70+)
                    if (maxEnemyLevel >= 70) continue;

                    // Check if troop matches map biome
                    const matchesBiome = mapBiome && troopMatchesBiome(i, mapBiome);

                    if (matchesBiome) {
                        biomeTroops.push(i);
                    } else {
                        nonBiomeTroops.push(i);
                    }
                }

                // If a biome is present, only use biome-matched enemies
                // Otherwise, use all available enemies
                if (mapBiome && biomeTroops.length > 0) {
                    // BIOME MODE: Only biome-specific enemies (level 1-69)
                    encounterList = [];

                    biomeTroops.forEach(id => {
                        // Calculate weight based on enemy level
                        const troop = $dataTroops[id];
                        const maxEnemyLevel = Math.max(...troop.members.map(member => {
                            const enemyData = $dataEnemies[member.enemyId];
                            return enemyData ? getEnemyLevel(enemyData.note) : 0;
                        }));

                        // Weighted distribution: 60% (1-30), 30% (31-50), 10% (51-69)
                        let weight = 1;
                        if (maxEnemyLevel >= 1 && maxEnemyLevel <= 30) {
                            weight = 60;
                        } else if (maxEnemyLevel >= 31 && maxEnemyLevel <= 50) {
                            weight = 30;
                        } else if (maxEnemyLevel >= 51 && maxEnemyLevel <= 69) {
                            weight = 10;
                        }

                        encounterList.push({
                            troopId: id,
                            weight: weight,
                            regionId: 0
                        });
                    });

                    ////console.log(`[BattleSystemEnhanced] Generated ${encounterList.length} biome-specific encounters for map ${$gameMap.mapId()} [Biome: ${mapBiome}] - Total: ${biomeTroops.length}`);
                } else if (!mapBiome) {
                    // NO BIOME MODE: Use all available enemies (level 1-69)
                    if (nonBiomeTroops.length > 0) {
                        encounterList = [];

                        nonBiomeTroops.forEach(id => {
                            // Calculate weight based on enemy level
                            const troop = $dataTroops[id];
                            const maxEnemyLevel = Math.max(...troop.members.map(member => {
                                const enemyData = $dataEnemies[member.enemyId];
                                return enemyData ? getEnemyLevel(enemyData.note) : 0;
                            }));

                            // Weighted distribution: 60% (1-30), 30% (31-50), 10% (51-69)
                            let weight = 1;
                            if (maxEnemyLevel >= 1 && maxEnemyLevel <= 30) {
                                weight = 60;
                            } else if (maxEnemyLevel >= 31 && maxEnemyLevel <= 50) {
                                weight = 30;
                            } else if (maxEnemyLevel >= 51 && maxEnemyLevel <= 69) {
                                weight = 10;
                            }

                            encounterList.push({
                                troopId: id,
                                weight: weight,
                                regionId: 0
                            });
                        });

                        ////console.log(`[BattleSystemEnhanced] Generated ${encounterList.length} random encounters for map ${$gameMap.mapId()} - Total: ${nonBiomeTroops.length}`);
                    }
                }
            }
        }

        // ========================================================================
        // Apply time-based filtering to encounter list
        // ========================================================================
        const originalEncounterCount = encounterList.length;
        encounterList = filterEncountersByTime(encounterList);

        if (encounterList.length < originalEncounterCount) {
            const timeOfDay = getTimeOfDay();
            const applicablePatterns = getApplicableActivityPatterns();
            ////console.log(`[BattleSystemEnhanced] Time-based filtering: ${originalEncounterCount} → ${encounterList.length} encounters [${timeOfDay.toUpperCase()}, Patterns: ${applicablePatterns.join(', ')}]`);
        }

        const criticalEventLocations = $gameMap.events()
            .filter(ev => {
                const eventData = ev.event();
                return eventData && (eventData.name === "Transfer" || eventData.name === "Door");
            })
            .map(ev => ({ x: ev.x, y: ev.y }));
        const exclusionRadius = 3;

        const spawnTiles = [];
        const w = $gameMap.width(), h = $gameMap.height();
        let waterTileCount = 0;
        let landTileCount = 0;

        for (let x = 0; x < w; x++) {
            for (let y = 0; y < h; y++) {
                // Skip region ID 10
                if ($gameMap.regionId(x, y) === 10) continue;

                // Check distance from critical events
                let tooClose = false;
                for (const loc of criticalEventLocations) {
                    const distance = Math.sqrt(Math.pow(x - loc.x, 2) + Math.pow(y - loc.y, 2));
                    if (distance <= exclusionRadius) {
                        tooClose = true;
                        break;
                    }
                }
                if (tooClose) continue;

                // Check if tile is passable (but allow water tiles for aquatic spawning)
                const terrainTag = $gameMap.terrainTag(x, y);
                const regionId = $gameMap.regionId(x, y);
                const isWaterTile = (terrainTag === 3 || regionId === 99);

                if (!isWaterTile && !$gameMap.isPassable(x, y, 2)) continue;

                // Check terrain tag - only allow spawning on specific terrain tags
                // Terrain tags 0, 4 and 7 = do not spawn
                // Terrain tags 1, 2, 3, 5, 6 = allow spawn (tag 3 reserved for aquatic)
                if (terrainTag === 0 || terrainTag === 4 || terrainTag === 7) continue;

                // Check if another event exists at this location
                if ($gameMap.events().some(ev => ev.x === x && ev.y === y && !enemyEvents.includes(ev))) continue;

                // Add any passable tile
                spawnTiles.push({ x, y, regionId: $gameMap.regionId(x, y) });
                if (isWaterTile) waterTileCount++;
                else landTileCount++;
            }
        }

        ////console.log(`[BattleSystemEnhanced] Spawn tiles - Water: ${waterTileCount}, Land: ${landTileCount}, Total: ${spawnTiles.length}`);

        const selectWeightedRandom = list => {
            const total = list.reduce((sum, it) => sum + it.weight, 0);
            let rnd = Math.random() * total;
            for (const it of list) {
                rnd -= it.weight;
                if (rnd <= 0) return it;
            }
            return list[0];
        };

        // Track if we've assigned the first boss enemy
        let isFirstEnemyEvent = true;

        for (const ev of enemyEvents) {
            if (spawnTiles.length) {
                const isProcGenMap = $gameMap.mapId() === 636;
                let loc;
                let idx = -1;

                if (isProcGenMap) {
                    if (!$gameSystem._procGenEnemyPositions) {
                        $gameSystem._procGenEnemyPositions = {};
                    }
                    const savedPos = $gameSystem._procGenEnemyPositions[ev.eventId()];
                    if (savedPos) {
                        idx = spawnTiles.findIndex(tile => tile.x === savedPos.x && tile.y === savedPos.y);
                    }
                }

                if (idx !== -1) {
                    loc = spawnTiles.splice(idx, 1)[0];
                } else {
                    const randomIdx = Math.floor(Math.random() * spawnTiles.length);
                    loc = spawnTiles.splice(randomIdx, 1)[0];
                    if (isProcGenMap) {
                        if (!$gameSystem._procGenEnemyPositions) {
                            $gameSystem._procGenEnemyPositions = {};
                        }
                        $gameSystem._procGenEnemyPositions[ev.eventId()] = { x: loc.x, y: loc.y };
                    }
                }

                ev.locate(loc.x, loc.y);

                const currentRegion = loc.regionId;
                const terrainTagAtLoc = $gameMap.terrainTag(loc.x, loc.y);
                const isWaterLocation = (terrainTagAtLoc === 3 || currentRegion === 99);

                let validTroops = encounterList.filter(encounter =>
                    canTroopSpawnInRegion(encounter.troopId, currentRegion, loc.x, loc.y)
                );

                ////console.log(`[BattleSystemEnhanced] Event at (${loc.x},${loc.y}) - Region: ${currentRegion}, TerrainTag: ${terrainTagAtLoc}, IsWater: ${isWaterLocation}, ValidTroops: ${validTroops.length}/${encounterList.length}`);

                let chosenTroopId = null;
                if (isProcGenMap) {
                    if (!$gameSystem._procGenEnemyTroops) {
                        $gameSystem._procGenEnemyTroops = {};
                    }
                    const savedTroopId = $gameSystem._procGenEnemyTroops[ev.eventId()];
                    if (savedTroopId && $dataTroops[savedTroopId]) {
                        chosenTroopId = savedTroopId;
                    }
                }

                if (chosenTroopId === null) {
                    if (isProcGenMap && isFirstEnemyEvent && !isWaterLocation) {
                        const bossTroopId = getSeededBossTroop(currentBiome);
                        if (bossTroopId !== null) {
                            chosenTroopId = bossTroopId;
                            ////console.log(`[BattleSystemEnhanced] Assigning boss troop ${bossTroopId} to first enemy event at (${loc.x},${loc.y})`);
                        }
                    }

                    if (chosenTroopId === null) {
                        if (validTroops.length === 0) {
                            if (isWaterLocation) {
                                ////console.log(`[BattleSystemEnhanced] No aquatic troops available for water tile at (${loc.x},${loc.y}), erasing event`);
                                ev.erase();
                                continue;
                            } else {
                                ////console.log(`[BattleSystemEnhanced] No valid troops for region ${currentRegion}, using all troops`);
                                validTroops = encounterList;
                            }
                        }

                        if (validTroops.length > 0) {
                            const chosen = selectWeightedRandom(validTroops);
                            chosenTroopId = chosen.troopId;
                        }
                    }

                    if (isProcGenMap && chosenTroopId !== null) {
                        if (!$gameSystem._procGenEnemyTroops) {
                            $gameSystem._procGenEnemyTroops = {};
                        }
                        $gameSystem._procGenEnemyTroops[ev.eventId()] = chosenTroopId;
                    }
                }
                isFirstEnemyEvent = false;

                if (chosenTroopId !== null) {
                    ev._fixedTroopId = chosenTroopId;
                    ev._isAquaticEnemy = undefined; // Invalidate cache so it recalculates
                    const troop = $dataTroops[chosenTroopId];

                    if (troop && troop.members.length > 0) {
                        const firstEnemy = $dataEnemies[troop.members[0].enemyId];
                        const archetype = getEnemyArchetype(firstEnemy);
                        const isAquatic = getAcquaticEnemyArchetype(archetype);
                        ////console.log(`[BattleSystemEnhanced] Assigned troop ${chosenTroopId} (${firstEnemy.name}, Archetype: ${archetype}, Aquatic: ${isAquatic}) to water location: ${isWaterLocation}`);

                        if (firstEnemy && firstEnemy.note) {
                            const note = firstEnemy.note;

                            const speedMatch = note.match(/<Speed:\s*([1-6])>/i);
                            if (speedMatch) {
                                ev.setMoveSpeed(Number(speedMatch[1]));
                            }

                            const moveMatch = note.match(/<Movement:\s*(Approach|Random|Fixed|Fleeing)>/i);
                            if (moveMatch) {
                                const type = moveMatch[1].toLowerCase();
                                if (type === 'fixed') ev._moveType = 0;
                                else if (type === 'random') ev._moveType = 1;
                                else if (type === 'approach') ev._moveType = 2;
                            }
                        }
                    }

                    ev.updateCharacterSprite();
                    ev.setOpacity(255);
                    ev.setThrough(false);
                } else {
                    ev.erase();
                }
            } else {
                ev.erase();
            }
        }
    };
    // Add this new method to Game_Event prototype
    Game_Event.prototype.setupFleeingMovement = function () {
        // Create a custom move route for fleeing behavior
        const route = {
            list: [
                { code: 32 }, // Move away from player
                { code: 0 }   // End
            ],
            repeat: true,
            skippable: true,
            wait: false
        };

        this.forceMoveRoute(route);
        this._fleeingMovement = true;
    };

    // Add this new method to check if event is using fleeing movement
    Game_Event.prototype.isFleeingMovement = function () {
        return this._fleeingMovement || false;
    };



    //=============================================================================
    // Scene_Map - Handle Spawning, Rewards, and Respawn
    //=============================================================================

    const _Scene_Map_start = Scene_Map.prototype.start;
    Scene_Map.prototype.start = function () {
        const currMap = $gameMap.mapId();

        // --- Spawning Logic (unchanged) ---
        if (!$gameSystem.isBattleEnded() && currMap !== _lastSpawnedMapId) {
            _battleCooldownTimer = BATTLE_COOLDOWN_FRAMES;
            this.spawnEnemiesFromEncounters();
            _lastSpawnedMapId = currMap;
        }

        _Scene_Map_start.call(this); // Call original start method

        // --- Gravestone Logic (unchanged) ---
        const deathData = $gameSystem.getDeathData();
        const gravestoneEvent = $gameMap.events().find(event => event.event().name === "Gravestone");

        if (gravestoneEvent) {
            // If death data exists, switch 9 is ON, and we're on the death map, position the gravestone
            if (deathData && deathData.mapId === $gameMap.mapId() && $gameSwitches.value(9)) {
                gravestoneEvent.locate(deathData.x, deathData.y);
                gravestoneEvent.setOpacity(255);
            } else {
                // Otherwise, hide the gravestone by moving it off-map and making it invisible
                gravestoneEvent.locate(0, 0);
                gravestoneEvent.setOpacity(0);
                gravestoneEvent.setThrough(true);
            }
        }


        // If returning from a battle, handle post-battle logic
        if ($gameSystem.isBattleEnded()) {
            let hasRespawned = false;
            $gameSystem.setBattleCooldown(120); // 2 seconds at 60fps

            const _tutorialRespawnMaps = [1414, 1415, 1416, 1417];
            const _inTutorialRespawn = $gameSwitches.value(75) && _tutorialRespawnMaps.includes($gameMap.mapId());

            if (_inTutorialRespawn && $gameSystem.isFullPartyWipe()) {
                // Tutorial area: always respawn at tutorial checkpoint
                this.handleActor1Respawn();
                hasRespawned = true;
            } else if ($gameSwitches.value(9)) {
                // Permadeath ON
                if ($gameSystem.isFullPartyWipe()) {
                    // All 3 dead → full respawn mechanic
                    this.handleActor1Respawn();
                    hasRespawned = true;
                } else {
                    // Partial deaths → remove each dead actor (including actor 1) from party
                    if ($gameSystem.isActor1Died()) {
                        const actor1 = $gameParty.members()[0];
                        const actor1Name = actor1 ? actor1.name() : "";
                        this.handlePartyMemberDeath(1, actor1Name);
                    }
                    if ($gameSystem.isActor2Died()) {
                        this.handlePartyMemberDeath(2, $gameSystem.getActor2Name());
                    }
                    if ($gameSystem.isActor3Died()) {
                        this.handlePartyMemberDeath(3, $gameSystem.getActor3Name());
                    }
                }
            } else if ($gameSystem.isActor1Died()) {
                // Permadeath OFF, non-tutorial: respawn at saved point
                const actor1 = $gameParty.members()[0];
                if (actor1) actor1.recoverAll();
                // Restore limbs, hunger and sleep for all party members
                for (const member of $gameParty.members()) {
                    if (window.HealthCore && window.HealthCore.restoreAllBodyParts) {
                        window.HealthCore.restoreAllBodyParts(member);
                    }
                    const maxHunger = (window.TimeDateSystem && window.TimeDateSystem.maxHunger) || 100;
                    const maxSleep = (window.TimeDateSystem && window.TimeDateSystem.maxSleep) || 100;
                    if (member._hunger !== undefined) member._hunger = maxHunger;
                    if (member._sleep !== undefined) member._sleep = maxSleep;
                }
                this.handleActor1Respawn();
                hasRespawned = true;
            }
            // Permadeath OFF: no other actors are removed from the party

            // Handle event deletion/locking    
            const eventToDelete = $gameSystem.getEventToDelete();
            if (eventToDelete && eventToDelete.mapId === $gameMap.mapId()) {
                const event = $gameMap.event(eventToDelete.eventId);
                if (event) {
                    $gameMap.eraseEvent(eventToDelete.eventId);
                }
                $gameSystem.clearEventToDelete();
            }

            const eventToLock = $gameSystem.getEventToLock();
            if (eventToLock) {
                const event = $gameMap.event(eventToLock.eventId);
                if (event) {
                    event.lockMovement(160);
                }
                $gameSystem.clearEventToLock();
            }

            // Show rewards popup if no respawn occurred
            if (!hasRespawned) {
                // Restore Positions
                if ($gameSystem._p1PreBattlePos && $gameSystem._p1PreBattlePos.mapId === $gameMap.mapId()) {
                    $gamePlayer.locate($gameSystem._p1PreBattlePos.x, $gameSystem._p1PreBattlePos.y);
                    $gamePlayer.setDirection($gameSystem._p1PreBattlePos.d);
                }
                if ($gameSystem._p2PreBattlePos && $gameSystem._p2PreBattlePos.mapId === $gameMap.mapId()) {
                    const p2Name = (window.$gameSplitScreen && window.$gameSplitScreen.p2EventName) || "Player 2";
                    const p2 = $gameMap.events().find(ev => ev && ev.event().name === p2Name);
                    if (p2) {
                        p2.locate($gameSystem._p2PreBattlePos.x, $gameSystem._p2PreBattlePos.y);
                        p2.setDirection($gameSystem._p2PreBattlePos.d);
                    }
                }
                this.createRewardsPopup();
            }

            $gameSystem.setBattleEnded(false);
            $gameSystem.setFullPartyWipe(false);

            // Reset death flags after handling them
            $gameSystem.setActor1Died(false);
            $gameSystem.setActor2Died(false, "");
            $gameSystem.setActor3Died(false, "");
        } else {
            $gamePlayer.setThrough(false);
        }
    };

    const _Scene_Map_update_BSE = Scene_Map.prototype.update;
    Scene_Map.prototype.update = function () {
        _Scene_Map_update_BSE.call(this);
        if (this.isActive()) { // Only update when map is active
            this.updateEnemyVsEnemyCombat();
        }
    };

    Scene_Map.prototype.updateEnemyVsEnemyCombat = function () {
        if (!$gameSystem._enemyFights) {
            $gameSystem._enemyFights = {};
        }

        const enemyEvents = $gameMap.events().filter(ev => ev.event() && ev.event().name === "Enemy" && ev._fixedTroopId > 0 && !ev._erased);

        const positions = {};
        for (const event of enemyEvents) {
            const key = `${event.x},${event.y}`;
            if (!positions[key]) {
                positions[key] = [];
            }
            positions[key].push(event);
        }

        // Start new fights
        for (const key in positions) {
            if (positions[key].length > 1) {
                if (!$gameSystem._enemyFights[key]) {
                    const event1 = positions[key][0];
                    const event2 = positions[key][1];

                    const archetype1 = getEventArchetype(event1);
                    const archetype2 = getEventArchetype(event2);

                    if (archetype1 && archetype2 && archetype1 !== archetype2) {
                        // Initialize HP for fighters if not present
                        if (event1.enemyHp === undefined) event1.enemyHp = event1.getMaxHpForEvent();
                        if (event2.enemyHp === undefined) event2.enemyHp = event2.getMaxHpForEvent();

                        $gameSystem._enemyFights[key] = {
                            fighters: [event1.eventId(), event2.eventId()],
                            timer: 120 // 2 seconds
                        };
                    }
                }
            }
        }

        // Update existing fights
        for (const key in $gameSystem._enemyFights) {
            const fight = $gameSystem._enemyFights[key];
            fight.timer--;

            if (fight.timer <= 0) {
                fight.timer = 120; // Reset timer

                const event1 = $gameMap.event(fight.fighters[0]);
                const event2 = $gameMap.event(fight.fighters[1]);

                if (!event1 || !event2 || event1._erased || event2._erased || event1.x !== event2.x || event1.y !== event2.y) {
                    delete $gameSystem._enemyFights[key];
                    continue;
                }

                // Combat logic
                const level1 = getEnemyLevelFromEvent(event1) || 1;
                const level2 = getEnemyLevelFromEvent(event2) || 1;

                let defender, attacker;
                const prob_event1_defends = level2 / (level1 + level2);
                if (Math.random() < prob_event1_defends) {
                    defender = event1;
                    attacker = event2;
                } else {
                    defender = event2;
                    attacker = event1;
                }

                const damage = 5 + Math.floor(getEnemyLevelFromEvent(attacker) / 2);
                if (defender.enemyHp === undefined) defender.enemyHp = defender.getMaxHpForEvent();
                defender.enemyHp -= damage;

                const spriteset = SceneManager._scene._spriteset;
                if (spriteset) {
                    const defenderSprite = spriteset._characterSprites.find(s => s._character === defender);
                    if (defenderSprite) {
                        defenderSprite.setBlendColor([255, 128, 128, 128]);
                        defenderSprite._flashDuration = 12; // 200ms at 60fps
                    }
                }

                if (defender.enemyHp <= 0) {
                    $gameMap.eraseEvent(defender.eventId());
                    delete $gameSystem._enemyFights[key];
                }
            }
        }
    };


    //=============================================================================
    // Game_Event - Modified to accommodate the new spawning system
    //=============================================================================

    const _Game_Event_initialize = Game_Event.prototype.initialize;
    Game_Event.prototype.initialize = function (mapId, eventId) {
        _Game_Event_initialize.call(this, mapId, eventId);

        // This now only applies to non-"Enemy" events that use note-tags.
        this.selectFixedTroopIdFromNote();

        this._movementLocked = false;
        this._movementLockTimer = 0;
        this._fleeingMovement = false; // Initialize fleeing movement flag
        this._isAquaticEnemy = false; // Cache aquatic status for performance
        this.updateCharacterSprite(); // Initial sprite update
    };

    Game_Event.prototype.getMaxHpForEvent = function () {
        if (!this._fixedTroopId) return 100;
        const troop = $dataTroops[this._fixedTroopId];
        if (!troop || !troop.members.length) return 100;
        const enemy = $dataEnemies[troop.members[0].enemyId];
        return enemy ? enemy.params[0] : 100; // params[0] is Max HP
    };

    // Renamed from selectFixedTroopId to be more specific
    Game_Event.prototype.selectFixedTroopIdFromNote = function () {
        // --- MODIFIED: This logic is now ignored for "Enemy" events ---
        if (this.event().name === "Enemy") {
            this._fixedTroopId = 0; // It will be set by the new spawning system.
            return;
        }
        // --- END MODIFICATION ---

        const note = this.event().note || "";
        if (note.includes('mz3d')) {
            return null

        }
        if (note.includes('?')) {
            const validTroopIds = $dataTroops.slice(1).map((t, i) => t ? i + 1 : 0).filter(id => id > 0);
            if (validTroopIds.length > 0) {
                this._fixedTroopId = validTroopIds[Math.floor(Math.random() * validTroopIds.length)];
            }
        } else {
            const troopIds = note.split(',').map(id => parseInt(id.trim())).filter(id => id > 0);
            if (troopIds.length > 0) {
                this._fixedTroopId = troopIds[Math.floor(Math.random() * troopIds.length)];
            } else {
                this._fixedTroopId = 0;
            }
        }

        // Handle movement settings for note-tagged events
        if (this._fixedTroopId > 0) {
            const enemyData = $dataEnemies[this._fixedTroopId];
            if (enemyData && enemyData.note) {
                const enemyNote = enemyData.note;

                // Movement: Approach | Random | Fixed | Fleeing
                const moveMatch = enemyNote.match(/<Movement:\s*(Approach|Random|Fixed|Fleeing)>/i);
                if (moveMatch) {
                    const type = moveMatch[1].toLowerCase();
                    if (type === 'fixed') this._moveType = 0;
                    else if (type === 'random') this._moveType = 1;
                    else if (type === 'approach') this._moveType = 2;
                    else if (type === 'fleeing') {
                        //this._moveType = 3; // Custom movement
                        //this.setupFleeingMovement();
                    }
                }
            }
        }

        // Persistent data setup for note-tagged enemies
        if (this._fixedTroopId > 0) {
            const persistentId = `${this._mapId}_${this._eventId}`;
            if (!_persistentEnemyData[persistentId]) {
                _persistentEnemyData[persistentId] = {
                    troopId: this._fixedTroopId,
                    enemyHp: {}
                };
            }
        }
    };

    // Check if this event's troop contains an aquatic enemy (cached for performance)
    Game_Event.prototype.isAquaticEnemy = function () {
        // Return cached value if available
        if (this._isAquaticEnemy !== undefined && this._isAquaticEnemy !== false) {
            return this._isAquaticEnemy === true;
        }

        if (!this._fixedTroopId || this._fixedTroopId <= 0) {
            this._isAquaticEnemy = false;
            return false;
        }

        const troop = $dataTroops[this._fixedTroopId];
        if (!troop || !troop.members.length) {
            this._isAquaticEnemy = false;
            return false;
        }

        const firstMember = troop.members[0];
        const enemyData = $dataEnemies[firstMember.enemyId];
        if (!enemyData) {
            this._isAquaticEnemy = false;
            return false;
        }

        const archetype = getEnemyArchetype(enemyData);
        const result = getAcquaticEnemyArchetype(archetype);
        this._isAquaticEnemy = result; // Cache the result
        return result;
    };

    // Helper function to check if tile is aquatic (region 99 or terrain tag 3)
    function isAquaticTile(x, y) {
        if (!$gameMap) return false;
        const regionId = $gameMap.regionId(x, y);
        if (regionId === 99) return true;
        const terrainTag = $gameMap.terrainTag(x, y);
        return terrainTag === 3;
    }

    // Override canPass to handle different enemy types with terrain restrictions
    const _Game_Event_canPass = Game_Event.prototype.canPass;
    Game_Event.prototype.canPass = function (x, y, d) {
        // Check if this is an enemy event
        if (this.event().name === "Enemy") {
            if (this._fixedTroopId && this._fixedTroopId > 0) {
                const troop = $dataTroops[this._fixedTroopId];
                if (troop && troop.members.length > 0) {
                    const firstMember = troop.members[0];
                    const enemyData = $dataEnemies[firstMember.enemyId];
                    if (enemyData) {
                        const archetype = getEnemyArchetype(enemyData);
                        const destRegionId = $gameMap.regionId(x, y);

                        // Flying enemies ignore all terrain restrictions
                        if (getFlyingEnemyArchetype(archetype)) {
                            const canPassTile = !$gameMap.events().some(ev => {
                                return ev !== this && ev.x === x && ev.y === y && !ev.isThrough();
                            });
                            return canPassTile;
                        }

                        // Enemies currently on a water tile bypass the player-swim-gated isPassable
                        const srcTerrainTag = $gameMap.terrainTag(x, y);
                        const srcRegionId = $gameMap.regionId(x, y);
                        const srcIsWater = (srcRegionId === 99 || srcTerrainTag === 3);

                        if (srcIsWater) {
                            const x2 = $gameMap.roundXWithDirection(x, d);
                            const y2 = $gameMap.roundYWithDirection(y, d);
                            if (!$gameMap.isValid(x2, y2)) return false;

                            const destTerrainTag2 = $gameMap.terrainTag(x2, y2);
                            const destRegionId2 = $gameMap.regionId(x2, y2);
                            const destIsWater = (destRegionId2 === 99 || destTerrainTag2 === 3);

                            // Purely aquatic enemies stay in water
                            if (getAcquaticEnemyArchetype(archetype) && !destIsWater) {
                                return false;
                            }
                            // Non-aquatic enemies can only leave water if amphibious, otherwise stay in water
                            if (!destIsWater && !getAmphibiousEnemyArchetype(archetype)) {
                                return false;
                            }
                            return !$gameMap.events().some(ev => {
                                return ev !== this && ev.x === x2 && ev.y === y2 && !ev.isThrough();
                            });
                        }

                        // Non-flying enemies cannot enter region 7
                        if (destRegionId === 7) {
                            return false;
                        }

                        // Check for Climb tag - if enemy doesn't have it and region is 4, they cannot pass
                        const hasClimbTag = enemyData.note && enemyData.note.includes('<Climb>');
                        if (!hasClimbTag && destRegionId === 4) {
                            return false; // Cannot pass region 4 without Climb tag
                        }
                    }
                }
            }
        }
        // For non-enemy events, or enemies that don't hit a special rule, use original logic.
        return _Game_Event_canPass.call(this, x, y, d);
    };

    // Add speed modifier for different enemy types
    const _Game_Event_realMoveSpeed = Game_Event.prototype.realMoveSpeed;
    Game_Event.prototype.realMoveSpeed = function () {
        let speed = _Game_Event_realMoveSpeed.call(this);

        if (this.event() && this.event().name === "Enemy" && this._fixedTroopId && this._fixedTroopId > 0) {
            const troop = $dataTroops[this._fixedTroopId];
            if (troop && troop.members.length > 0) {
                const firstMember = troop.members[0];
                const enemyData = $dataEnemies[firstMember.enemyId];
                if (enemyData) {
                    const archetype = getEnemyArchetype(enemyData);
                    const currentIsWater = isAquaticTile(this.x, this.y);
                    const regionId = $gameMap.regionId(this.x, this.y);

                    // Flying enemies ignore all terrain and region penalties
                    if (getFlyingEnemyArchetype(archetype)) {
                        return speed; // Normal speed everywhere
                    }

                    // Aquatic enemies move at normal speed everywhere (they spawn only in water anyway)
                    if (getAcquaticEnemyArchetype(archetype)) {
                        return speed; // Normal speed in water
                    }

                    // Amphibious enemies: faster in water (1.5x), slower on land (0.67x)
                    if (getAmphibiousEnemyArchetype(archetype)) {
                        if (currentIsWater) {
                            return speed * 1.5; // 50% faster in water
                        } else {
                            return speed * 0.67; // ~33% slower on land
                        }
                    }

                    // Climbing enemies: slow in region 4 (0.33x)
                    const hasClimbTag = enemyData.note && enemyData.note.includes('<Climb>');
                    if (hasClimbTag && regionId === 4) {
                        return speed * 0.33; // 67% slower when climbing
                    }

                    // Regular enemies: slow in water (0.5x), normal on land
                    if (currentIsWater) {
                        return speed * 0.5; // 50% slower in water
                    }
                }
            }
        }

        return speed;
    };

    // Unchanged: This function works perfectly with the new system.
    Game_Event.prototype.updateCharacterSprite = function () {
        if (this._fixedTroopId && this._fixedTroopId > 0) {
            const troop = $dataTroops[this._fixedTroopId];
            if (!troop) return;
            const member = troop.members[0];
            const enemyId = member ? member.enemyId : null;
            if (!enemyId) return;

            if (_enemyCharSprites[enemyId]) {
                const charSpriteName = _enemyCharSprites[enemyId];
                this.setImage("Monsters/" + charSpriteName, this._characterIndex);

                const hue = ($dataEnemies[enemyId] && $dataEnemies[enemyId].battlerHue) || 0;
                this._characterHue = hue;
            }
        }
    };

    //=============================================================================
    // DataManager - Load Enemy Note Tags for Character Sprites
    //=============================================================================

    const _DataManager_isDatabaseLoaded = DataManager.isDatabaseLoaded;
    DataManager.isDatabaseLoaded = function () {
        if (!_DataManager_isDatabaseLoaded.call(this)) return false;

        if (!this._enemyCharSpritesLoaded) {
            this.loadEnemyCharSprites($dataEnemies);
            this._enemyCharSpritesLoaded = true;
        }

        return true;
    };

    DataManager.loadEnemyCharSprites = function (data) {
        for (let i = 1; i < data.length; i++) {
            const enemy = data[i];
            if (enemy && enemy.note) {
                const charMatch = enemy.note.match(/<Char:(.+?)>/i);
                if (charMatch) {
                    _enemyCharSprites[i] = charMatch[1];
                }
            }
        }
    };

    //=============================================================================
    // Game_Map - Setup events (minor change for clarity)
    //=============================================================================

    const _Game_Map_setupEvents = Game_Map.prototype.setupEvents;
    Game_Map.prototype.setupEvents = function () {
        _Game_Map_setupEvents.call(this);

        // This ensures non-"Enemy" events with notes get their sprites set correctly on map load.
        // "Enemy" events are handled by spawnEnemiesFromEncounters.
        this.events().forEach(event => {
            if (event.event().name !== "Enemy") {
                event.selectFixedTroopIdFromNote();
                event.updateCharacterSprite();
            }
        });
    };

    // (The rest of the original plugin code continues below, largely unchanged)
    // ... [existing code for battles, respawn, popups, etc.] ...

    //=============================================================================
    // Sprite_Character – Apply Enemy Hue
    //=============================================================================
    (function () {
        const _SC_update = Sprite_Character.prototype.update;
        Sprite_Character.prototype.update = function () {
            _SC_update.call(this);

            if (this._flashDuration > 0) {
                this._flashDuration--;
                if (this._flashDuration === 0) {
                    this.setBlendColor([0, 0, 0, 0]);
                }
            }

            const char = this._character;
            const hue = char && char._characterHue;
            if (hue) {
                if (!this._hueFilter) {
                    this._hueFilter = new PIXI.filters.ColorMatrixFilter();
                    this.filters = [this._hueFilter];
                }
                this._hueFilter.reset();
                this._hueFilter.hue(hue, false);
            } else if (this._hueFilter) {
                this.filters = null;
                this._hueFilter = null;
            }
        };
    })();

    //=============================================================================
    // BattleManager - Hide Battle Messages and Manage Battle Flow
    //=============================================================================

    // Reset health protection when battle starts
    const _BattleManager_setup = BattleManager.setup;
    BattleManager.setup = function (troopId, canEscape, canLose) {
        _BattleManager_setup.call(this, troopId, canEscape, canLose);
        resetHealthProtection();

        // Apply wet status if battle starts on water tile (skip during battle test)
        if ($gameMap && $gameMap._mapId) {
            const playerX = $gamePlayer.x;
            const playerY = $gamePlayer.y;
            const terrainTag = $gameMap.terrainTag(playerX, playerY);
            const regionId = $gameMap.regionId(playerX, playerY);
            const isWaterTile = (terrainTag === 3 || regionId === 99);

            if (isWaterTile) {
                // Apply wet status (ID 28) to all party members
                for (let i = 0; i < $gameParty.members().length; i++) {
                    $gameParty.members()[i].addState(28);
                }
                // Apply wet status to all enemies
                for (let i = 0; i < $gameTroop.members().length; i++) {
                    $gameTroop.members()[i].addState(28);
                }
            }
        }
    };

    // Also check deaths during update (to catch deaths outside of turn ends)
    const _BattleManager_update = BattleManager.update;
    BattleManager.update = function () {
        _BattleManager_update.call(this);

        // Only check during battle phase
        if (this._phase === 'action' || this._phase === 'turn') {
            this.checkActorDeaths();
        }
    };
    let _battleTurnCount = 0;

    // Modify the BattleManager.displayStartMessages to include the warning check
    BattleManager.displayStartMessages = function () {
        _battleTurnCount = 0;

        // Check for dangerous enemy and show warning if needed
        checkAndShowDangerousEnemyWarning();
    };
    BattleManager.displayEscapeFailureMessage = function () { };

    BattleManager.displayEscapeSuccessMessage = function () { };

    const _BattleManager_makeEscapeRatio = BattleManager.makeEscapeRatio;
    BattleManager.makeEscapeRatio = function () {
        _BattleManager_makeEscapeRatio.call(this);
        if (_battleTurnCount <= 1) {
            this._escapeRatio = 1.0;
        }
    };

    const _BattleManager_makeRewards = BattleManager.makeRewards;
    BattleManager.makeRewards = function () {
        _BattleManager_makeRewards.call(this);
        if (!_battleRewards) {
            _battleRewards = { exp: 0, gold: 0, items: [] };
        }
        _battleRewards.exp = this._rewards.exp || 0;
        _battleRewards.gold = this._rewards.gold || 0;
        _battleRewards.items = this._rewards.items ? this._rewards.items.slice() : [];
    };

    // Knowledge points: earned on victory based on enemy level vs party median
    const _BattleManager_processVictory_BSE = BattleManager.processVictory;
    BattleManager.processVictory = function () {
        const party = $gameParty.members();
        if (party.length && $gameTroop && $gameTroop.members().length) {
            const partyMedian = getMedianLevel(party);
            const maxEnemyLevel = Math.max(...$gameTroop.members().map(e => {
                const data = $dataEnemies[e.enemyId()];
                return data ? getEnemyLevel(data.note) : 0;
            }));
            const diff = maxEnemyLevel - partyMedian;
            const knowledge = diff > 0 ? Math.max(3, diff) : 2;
            $gameSystem.addKnowledge(knowledge);
        }
        _BattleManager_processVictory_BSE.call(this);
    };

    BattleManager.displayVictoryMessage = function () { };

    BattleManager.displayRewards = function () {
        this.gainRewards();
    };

    const _BattleManager_endTurn = BattleManager.endTurn;
    BattleManager.endTurn = function () {
        this.checkActorDeaths();
        _BattleManager_endTurn.call(this);
    };

    const _BattleManager_startTurn = BattleManager.startTurn;
    BattleManager.startTurn = function () {
        _BattleManager_startTurn.call(this);
        _battleTurnCount++;
    };

    BattleManager.processActor1Death = function () {
        if ($gameSwitches.value(9)) {
            saveDeathData();
            $gameSwitches.setValue(34, true);
        }

        // Set flag for respawn
        _needsRespawn = true;

        // Mark current event for deletion
        if (_currentMapId && _currentEventId) {
            $gameSystem.setEventToDelete(_currentMapId, _currentEventId);
        }

        // End the battle immediately (with escape result to avoid game over)
        this._escaped = true;
        this.updateBattleEnd();
    };
    // Reset enemy HP when defeated
    const _Game_Enemy_die = Game_Enemy.prototype.die;
    Game_Enemy.prototype.die = function () {
        _Game_Enemy_die.call(this);

        // If this is in a persistent battle, mark this enemy as dead
        if (_currentBattleEventId && _persistentEnemyData[_currentBattleEventId]) {
            const index = $gameTroop.members().indexOf(this);
            if (index >= 0) {
                _persistentEnemyData[_currentBattleEventId].enemyHp[index] = 0;
            }
        }
    };

    // Alias the BattleManager.updateBattleEnd method to set a flag when battle is ending
    const _BattleManager_updateBattleEnd = BattleManager.updateBattleEnd;
    BattleManager.updateBattleEnd = function () {
        console.log('[DEBUG] BattleManager.updateBattleEnd CALLED');
        console.log('[DEBUG] - _escaped:', this._escaped);
        console.log('[DEBUG] - party all dead:', $gameParty.isAllDead());
        console.log('[DEBUG] - troop all dead:', $gameTroop.isAllDead());

        // Store party member states BEFORE calling the original method
        const partyStates = $gameParty.members().map(actor => ({
            actor: actor,
            isDead: actor.isDead(),
            actorId: actor.actorId(),
            name: actor.name()
        }));

        console.log('[DEBUG] - party states:', partyStates);

        _BattleManager_updateBattleEnd.call(this);

        console.log('[DEBUG] BattleManager.updateBattleEnd AFTER original call');

        if (this._escaped || $gameParty.isAllDead() || $gameTroop.isAllDead()) {
            $gameSystem.setBattleEnded(true);

            // Check each party member's death state
            partyStates.forEach((state, index) => {
                if (state.isDead) {
                    if (index === 0) {
                        // Actor 1 (main character) - handle respawn
                        $gameSystem.setActor1Died(true);
                    } else if (index === 1) {
                        // Actor 2 - mark for removal
                        $gameSystem.setActor2Died(true, state.name);
                    } else if (index === 2) {
                        // Actor 3 - mark for removal
                        $gameSystem.setActor3Died(true, state.name);
                    }
                }
            });
        }
    };

    BattleManager.checkActorDeaths = function () {
        let deathOccurred = false;
        const members = $gameParty.members();
        if (members[0] && members[0].isDead() && !$gameSystem.isActor1Died()) {
            $gameSystem.setActor1Died(true);
            deathOccurred = true;
        }
        if (members[1] && members[1].isDead() && !$gameSystem.isActor2Died()) {
            $gameSystem.setActor2Died(true, members[1].name());
            deathOccurred = true;
        }
        if (members[2] && members[2].isDead() && !$gameSystem.isActor3Died()) {
            $gameSystem.setActor3Died(true, members[2].name());
            deathOccurred = true;
        }
        return deathOccurred;
    };

    BattleManager.processDefeat = function () {
        // Never show game over — always respawn
        const _tutorialMaps = [1414, 1415, 1416, 1417];
        const inTutorial = $gameSwitches.value(75) && _tutorialMaps.includes($gameMap.mapId());

        // Stop battle music
        AudioManager.stopBgm();

        if ($gameSwitches.value(9) && !inTutorial) {
            // Permadeath ON: save death data and set permadeath flag
            saveDeathData();
            $gameSwitches.setValue(34, true);
        }
        $gameSystem.setActor1Died(true);
        $gameSystem.setFullPartyWipe(true);
        _needsRespawn = true;
        const actor1 = $gameParty.members()[0];
        if (actor1) actor1.recoverAll();
        this._escaped = true;
        this.updateBattleEnd();
    };

    const _Game_Troop_setup = Game_Troop.prototype.setup;
    Game_Troop.prototype.setup = function (troopId) {
        _Game_Troop_setup.call(this, troopId);
        if (_currentBattleEventId && _persistentEnemyData[_currentBattleEventId]) {
            const storedHp = _persistentEnemyData[_currentBattleEventId].enemyHp;
            this.members().forEach((enemy, index) => {
                if (storedHp[index] !== undefined) {
                    enemy.setHp(storedHp[index]);
                }
            });
        }
    };

    const _BattleManager_endBattle = BattleManager.endBattle;
    BattleManager.endBattle = function (result) {
        console.log('[DEBUG] BattleManager.endBattle CALLED');
        console.log('[DEBUG] - result:', result, '(0=victory, 1=escape, 2=defeat)');

        const members = $gameParty.members();

        console.log('[DEBUG] - Checking death states for', members.length, 'party members');

        // Double-check death states right before battle ends
        members.forEach((actor, index) => {
            if (actor.isDead()) {
                console.log('[DEBUG] - Actor', index, 'is dead:', actor.name());
                if (index === 0 && !$gameSystem.isActor1Died()) {
                    $gameSystem.setActor1Died(true);
                } else if (index === 1 && !$gameSystem.isActor2Died()) {
                    $gameSystem.setActor2Died(true, actor.name());
                } else if (index === 2 && !$gameSystem.isActor3Died()) {
                    $gameSystem.setActor3Died(true, actor.name());
                }
            }
        });

        // Handle persistent enemy data
        if (result === 1 && _currentBattleEventId && $gameTroop) { // Flee
            console.log('[DEBUG] - Handling escape (result=1), saving enemy data');
            const persistentData = _persistentEnemyData[_currentBattleEventId] || { enemyHp: {} };
            $gameTroop.members().forEach((enemy, index) => {
                persistentData.enemyHp[index] = enemy.hp;
            });
            _persistentEnemyData[_currentBattleEventId] = persistentData;
            $gameSystem.setEventToLock(_currentMapId, _currentEventId);

            // Clear rewards when fleeing
            _battleRewards = { exp: 0, gold: 0, items: [] };

        } else if (result === 0 && _currentBattleEventId) { // Win
            console.log('[DEBUG] - Handling victory (result=0), clearing enemy data');
            if (_persistentEnemyData[_currentBattleEventId]) {
                delete _persistentEnemyData[_currentBattleEventId];
            }
            $gameSystem.setEventToDelete(_currentMapId, _currentEventId);
            if ($gameMap.mapId() === 636) {
                if (!$gameSystem._procGenDefeatedEnemies) {
                    $gameSystem._procGenDefeatedEnemies = [];
                }
                if (!$gameSystem._procGenDefeatedEnemies.includes(_currentEventId)) {
                    $gameSystem._procGenDefeatedEnemies.push(_currentEventId);
                }
            }
        } else {
            console.log('[DEBUG] - No special handling for result:', result);
        }

        console.log('[DEBUG] - Setting battle ended flag');
        $gameSystem.setBattleEnded(true);
        _currentBattleEventId = null;

        console.log('[DEBUG] - Calling original _BattleManager_endBattle with result:', result);
        _BattleManager_endBattle.call(this, result);

        console.log('[DEBUG] BattleManager.endBattle COMPLETED');

    };

    //=============================================================================
    // Health Protection System - Actor HP Management
    //=============================================================================

    // Override Game_Actor setHp to implement health protection
    //=============================================================================
    // Health Protection System - Actor HP Management
    //=============================================================================

    // Override Game_Actor setHp to implement health protection
    const _Game_Actor_setHp = Game_Actor.prototype.setHp;
    Game_Actor.prototype.setHp = function (hp) {
        const oldHp = this.hp;
        const wasAlive = !this.isDead();

        // Call original setHp first
        _Game_Actor_setHp.call(this, hp);

        // Check if actor would die and has protection available
        // BUT don't apply protection if they were already at 1HP (to avoid wasting protection on minimal damage)
        if (wasAlive && this.isDead() && hasHealthProtection(this.actorId()) && oldHp > 1) {
            // Use protection and set HP to 1
            useHealthProtection(this.actorId());
            _Game_Actor_setHp.call(this, 1);

            // Show protection message only in battle
            if ($gameParty.inBattle()) {

                // Play a special sound effect if available
                if ($dataCommonEvents[1]) { // Assuming common event 1 has protection sound
                    // You can add a sound effect here if desired
                    // AudioManager.playSe({name: "Bell3", volume: 90, pitch: 100, pan: 0});
                }
            }
        }

        // Handle map deaths (existing code)
        if (oldHp > 0 && this.hp <= 0 && !$gameParty.inBattle()) {
            // If this is actor1 (index 0), trigger death process
            if (this === $gameParty.members()[0]) {
                this.processMapDeath();
            }
            // If this is actor2, mark for potential removal
            else if (this === $gameParty.members()[1]) {
                $gameSystem.setActor2Died(true, this.name());

                // Update party to handle actor2 death on map
                $gameMap.requestRefresh();
            }
        }
    };

    //=============================================================================
    // Game_System - Store Battle States
    //=============================================================================

    const _Game_System_initialize = Game_System.prototype.initialize;
    Game_System.prototype.initialize = function () {
        _Game_System_initialize.call(this);
        this._battleEnded = false;
        this._actor1Died = false;
        this._actor2Died = false;
        this._actor3Died = false;
        this._actor2Name = "";
        this._actor3Name = "";
        this._eventToDelete = null;
        this._eventToLock = null;
        this._deathData = null; // For gravestone system
        this._battleEnded = false;
        this._battleCooldownTimer = 0; // Add this line
    };
    const _DataManager_setupNewGame = DataManager.setupNewGame;
    DataManager.setupNewGame = function () {
        _DataManager_setupNewGame.call(this);
        $gameVariables.setValue(25, 708);
        $gameVariables.setValue(26, 24);
        $gameVariables.setValue(27, 12);
        $gameVariables.setValue(112, 121);
    };

    Game_System.prototype.setBattleCooldown = function (frames) { this._battleCooldownTimer = frames; };
    Game_System.prototype.getBattleCooldown = function () { return this._battleCooldownTimer || 0; };
    Game_System.prototype.updateBattleCooldown = function () {
        if (this._battleCooldownTimer > 0) this._battleCooldownTimer--;
    };
    Game_System.prototype.setBattleEnded = function (value) { this._battleEnded = value; };
    Game_System.prototype.isBattleEnded = function () { return this._battleEnded; };
    Game_System.prototype.setFullPartyWipe = function (value) { this._fullPartyWipe = value; };
    Game_System.prototype.isFullPartyWipe = function () { return this._fullPartyWipe; };
    Game_System.prototype.setActor1Died = function (value) { this._actor1Died = value; };
    Game_System.prototype.isActor1Died = function () { return this._actor1Died; };
    Game_System.prototype.setActor2Died = function (value, name) { this._actor2Died = value; this._actor2Name = name || ""; };
    Game_System.prototype.isActor2Died = function () { return this._actor2Died; };
    Game_System.prototype.getActor2Name = function () { return this._actor2Name; };
    Game_System.prototype.setActor3Died = function (value, name) { this._actor3Died = value; this._actor3Name = name || ""; };
    Game_System.prototype.isActor3Died = function () { return this._actor3Died; };
    Game_System.prototype.getActor3Name = function () { return this._actor3Name; };
    Game_System.prototype.setEventToDelete = function (mapId, eventId) { this._eventToDelete = { mapId, eventId }; };
    Game_System.prototype.getEventToDelete = function () { return this._eventToDelete; };
    Game_System.prototype.clearEventToDelete = function () { this._eventToDelete = null; };
    Game_System.prototype.setEventToLock = function (mapId, eventId) { this._eventToLock = { mapId, eventId }; };
    Game_System.prototype.getEventToLock = function () { return this._eventToLock; };
    Game_System.prototype.clearEventToLock = function () { this._eventToLock = null; };

    // --- NEW: Game_System methods for Gravestone data ---
    Game_System.prototype.setDeathData = function (data) { this._deathData = data; };
    Game_System.prototype.getDeathData = function () { return this._deathData; };
    Game_System.prototype.clearDeathData = function () { this._deathData = null; };
    // --- END NEW ---

    //=============================================================================
    // Actor and Scene Handlers for Death and Respawn
    //=============================================================================
    const _Game_Actor_onBattleEnd = Game_Actor.prototype.onBattleEnd;
    Game_Actor.prototype.onBattleEnd = function () {
        _Game_Actor_onBattleEnd.call(this);
        // Only recover actor 1 on a full party wipe (for the respawn path).
        // On partial death with permadeath ON, actor 1 remains dead so they can be removed.
        if (this === $gameParty.members()[0] && $gameSystem.isActor1Died() && $gameSystem.isFullPartyWipe()) {
            this.recoverAll();
        }
    };

    // Replace the existing handleActor1Respawn method with this updated version:
    Scene_Map.prototype.handleActor1Respawn = function () {
        $gameVariables.setValue(1, 0); // Set variable 1 to 0
        $gamePlayer.setThrough(true);

        let respawnMapId = $gameVariables.value(respawnMapVar) || 25;
        let respawnX = $gameVariables.value(respawnXVar) || 26;
        let respawnY = $gameVariables.value(respawnYVar) || 27;
        let respawnCountryID = $gameVariables.value(respawnCountryIDVar) || 112;

        // Permadeath respawn
        if ($gameSwitches.value(34)) {
            // Set character created switch to false
            $gameSwitches.setValue(13, false);

            respawnMapId = 557;
            respawnX = 13;
            respawnY = 5;
            // Set region ID as ghent
            $gameVariables.setValue(86, 102);
            $gameVariables.setValue(respawnCountryIDVar, 102);

            // Remove pregenerated character from the preset pool if it was a preset
            if ($gameSystem._currentPresetId && window.removePresetById) {
                window.removePresetById($gameSystem._currentPresetId);
                ////console.log(`Pregenerated character (ID: ${$gameSystem._currentPresetId}) died and has been removed from the preset pool.`);
            }

            // Remove party members 2 and 3
            const party = $gameParty.members();
            if (party[1]) {
                $gameParty.removeActor(party[1].actorId());
            }
            if (party[2]) {
                $gameParty.removeActor(party[2].actorId());
            }
        } else {
            $gameVariables.setValue(86, respawnCountryID);
            $gameVariables.setValue(respawnCountryIDVar, respawnCountryID);

        }

        // Tutorial area respawn: if switch 75 is on and player died on maps 1414-1417, respawn at map 1415 (14,18)
        const _tutorialMaps = [1414, 1415, 1416, 1417];
        if ($gameSwitches.value(75) && _tutorialMaps.includes($gameMap.mapId())) {
            respawnMapId = 1414;
            respawnX = 61;
            respawnY = 7;
        }

        $gameScreen.startFadeOut(30);
        setTimeout(() => {
            $gamePlayer.reserveTransfer(respawnMapId, respawnX, respawnY, 2, 0);
            _needsRespawn = false;

            // Schedule weather update after map transfer completes
            const weatherUpdateInterval = setInterval(() => {
                if ($gameMap.mapId() === respawnMapId && $gameWeather) {
                    // Update weather and temperature based on respawn map's country
                    $gameWeather.updateTimeAndWeather();
                    $gameWeather.updateTimeOfDayTint();
                    clearInterval(weatherUpdateInterval);
                }
            }, 100);
        }, 500);
    };

    const _Game_Player_performTransfer = Game_Player.prototype.performTransfer;
    Game_Player.prototype.performTransfer = function () {
        _Game_Player_performTransfer.call(this);
        // After any transfer, ensure the player is not stuck in 'through' mode unless intended.
        if (this.isTransferring() && !_needsRespawn) {
            this.setThrough(false);
        }
    };

    Scene_Map.prototype.handlePartyMemberDeath = function (actorIndex, actorName) {
        // Get the actual actor at the specified index (1-based to 0-based conversion)
        const actor = $gameParty.members()[actorIndex - 1];

        if (actor) {
            // Only remove if the actor is actually dead
            if (actor.isDead()) {
                const actorId = actor.actorId();
                $gameParty.removeActor(actorId);

                // Show death message
                const useTranslation = ConfigManager.language === 'it';
                window.skipLocalization = true;
                $gameMessage.add(actorName + (useTranslation ? " è morto" : " has died."));
                window.skipLocalization = false;

                ////console.log(`Removed dead party member: ${actorName} (Actor ID: ${actorId})`);
            } else {
                // Actor is alive, don't remove but reset the death flag
                ////console.log(`Actor ${actorName} survived, not removing from party`);
            }
        } else {
            ////console.log(`No actor found at index ${actorIndex} for removal`);
        }
    };

    Scene_Map.prototype.createRewardsPopup = function () {
        if (!_battleRewards || (_battleRewards.exp <= 0 && _battleRewards.gold <= 0 && _battleRewards.items.length === 0)) {
            return;
        }
        this._rewardsPopupWindow = new Window_BattleRewardsPopup();
        this.addWindow(this._rewardsPopupWindow);
        this._rewardsPopupWindow.open();
        this._rewardsPopupCloseTimer = 180;

        // Clear the rewards after showing them
        _battleRewards = { exp: 0, gold: 0, items: [] };
    };

    const _Scene_Map_update = Scene_Map.prototype.update;
    Scene_Map.prototype.update = function () {
        _Scene_Map_update.call(this);
        // Update battle cooldown timer
        $gameSystem.updateBattleCooldown();
        if (this._rewardsPopupWindow && this._rewardsPopupCloseTimer > 0) {
            this._rewardsPopupCloseTimer--;
            if (this._rewardsPopupCloseTimer <= 0) {
                this._rewardsPopupWindow.close();
                this._rewardsPopupWindow = null;
            }
        }
    };

    Scene_Gameover.prototype.start = function () {
        // Stop battle music before transitioning
        AudioManager.stopBgm();
        SceneManager.goto(Scene_Map);
    };

    // Add update method to Scene_Battle to handle the warning window
    const _Scene_Battle_update_topWarning = Scene_Battle.prototype.update;
    Scene_Battle.prototype.update = function () {
        _Scene_Battle_update_topWarning.call(this);

        if (this._topWarningWindow) {
            this._topWarningWindow.update();
        }
    };
    //=============================================================================
    // Window_BattleRewardsPopup
    //=============================================================================
    function Window_BattleRewardsPopup() {
        this.initialize(...arguments);
    }

    Window_BattleRewardsPopup.prototype = Object.create(Window_Base.prototype);
    Window_BattleRewardsPopup.prototype.constructor = Window_BattleRewardsPopup;

    Window_BattleRewardsPopup.prototype.initialize = function () {
        const width = 240;
        const height = this.fittingHeight(1);
        const x = (Graphics.boxWidth - width) / 2;
        const y = 0;
        Window_Base.prototype.initialize.call(this, new Rectangle(x, y, width, height));
        this.openness = 0;
        this.refresh();
    };

    Window_BattleRewardsPopup.prototype.refresh = function () {
        this.contents.clear();
        if (!_battleRewards) return;

        // convert gold (integer "G") into euros
        const gold = _battleRewards.gold || 0;
        const euros = (gold / 100).toFixed(2) + "€";

        const rewardText = `${_battleRewards.exp || 0} EXP, ${euros}`;
        this.drawText(rewardText, 0, 0, this.contentsWidth(), 'center');
    };

    //=============================================================================
    // Register Plugin Commands
    //=============================================================================
    function startPersistentBattle(troopId, persistentId, eventId, mapId) {
        if (!_persistentEnemyData[persistentId]) {
            _persistentEnemyData[persistentId] = {
                troopId: troopId,
                enemyHp: {}
            };
        }
        if ($gameSystem.getBattleCooldown() > 0) {
            return;
        }

        $gameMessage._eventActivator = $gameMessage._eventActivator || window._battleActivatorOverride || "p1";
        window._battleActivatorOverride = null;

        // Save Positions for restoration
        $gameSystem._p1PreBattlePos = { mapId: $gameMap.mapId(), x: $gamePlayer.x, y: $gamePlayer.y, d: $gamePlayer.direction() };
        if (window.$gameSplitScreen && window.$gameSplitScreen.active && window.$gameSplitScreen.p2Event) {
            const p2 = window.$gameSplitScreen.p2Event;
            $gameSystem._p2PreBattlePos = { mapId: $gameMap.mapId(), x: p2.x, y: p2.y, d: p2.direction() };
        } else {
            $gameSystem._p2PreBattlePos = null;
        }

        _currentBattleEventId = persistentId;
        _currentEventId = eventId;
        _currentMapId = mapId;
        _needsRespawn = false;

        BattleManager.setup(troopId, false, false);
        SceneManager.push(Scene_Battle);
    }

    PluginManager.registerCommand(pluginName, "startBattle", function (args) {
        // Check if battle is on cooldown
        if ($gamePlayer.isInVehicle()) {
            return false; // No encounters while in vehicle
        }
        if ($gameSystem.getBattleCooldown() > 0) {
            ////console.log("Battle on cooldown:", $gameSystem.getBattleCooldown()); // Debug line
            return;
        }
        $gameSwitches.setValue(115, true);

        const eventId = Number(args.eventId) || this._eventId;
        const event = $gameMap.event(eventId);
        if (event && event._fixedTroopId > 0) {
            const persistentId = `${$gameMap.mapId()}_${eventId}`;
            startPersistentBattle(event._fixedTroopId, persistentId, eventId, $gameMap.mapId());
        }
    });

    PluginManager.registerCommand(pluginName, "setRespawnPoint", function (args) {
        $gameVariables.setValue(respawnMapVar, Number(args.mapId));
        $gameVariables.setValue(respawnXVar, Number(args.x));
        $gameVariables.setValue(respawnYVar, Number(args.y));
    });

    PluginManager.registerCommand(pluginName, "restore", function (args) {
        const deathData = $gameSystem.getDeathData();
        if (deathData) {
            $gameParty.gainGold(deathData.gold);
            for (const key in deathData.items) {
                const amount = deathData.items[key];
                let item = null;
                const id = parseInt(key.substring(1));
                if (key.startsWith('i')) {
                    item = $dataItems[id];
                } else if (key.startsWith('w')) {
                    item = $dataWeapons[id];
                } else if (key.startsWith('a')) {
                    item = $dataArmors[id];
                }

                if (item) {
                    $gameParty.gainItem(item, amount, false);
                }
            }
            $gameSystem.clearDeathData();
        }
    });

    //=============================================================================
    // Data Save/Load Handling
    //=============================================================================


    const _DataManager_extractSaveContents = DataManager.extractSaveContents;
    DataManager.extractSaveContents = function (contents) {
        _DataManager_extractSaveContents.call(this, contents);
        if (contents.persistentEnemyData) {
            Object.assign(_persistentEnemyData, contents.persistentEnemyData);
        }
        if (contents.enemyCharSprites) {
            Object.assign(_enemyCharSprites, contents.enemyCharSprites);
        }
        // Load health protection data
        if (contents.healthProtectionUsed) {
            Object.assign(_healthProtectionUsed, contents.healthProtectionUsed);
        }
    };

    // Add enemy data to save contents
    const _DataManager_makeSaveContents = DataManager.makeSaveContents;
    DataManager.makeSaveContents = function () {
        const contents = _DataManager_makeSaveContents.call(this);
        contents.persistentEnemyData = _persistentEnemyData;
        contents.enemyCharSprites = _enemyCharSprites;
        // Save health protection state
        contents.healthProtectionUsed = _healthProtectionUsed;
        return contents;
    };

    const _Game_Map_setupEvents_RandomEnemies = Game_Map.prototype.setupEvents;
    Game_Map.prototype.setupEvents = function () {
        _Game_Map_setupEvents_RandomEnemies.call(this);

        // Update all events that need resprite after load
        this.events().forEach(event => {
            const persistentId = `${this._mapId}_${event._eventId}`;
            if (_persistentEnemyData[persistentId] && _persistentEnemyData[persistentId].needsResprite) {
                // If this was a random enemy and needs resprite, update it
                event._fixedTroopId = _persistentEnemyData[persistentId].troopId;
                event.updateCharacterSprite();
                // Clear the resprite flag
                _persistentEnemyData[persistentId].needsResprite = false;
            }
        });
    };

    // Add movement locking functionality
    Game_Event.prototype.lockMovement = function (duration) {
        this._movementLocked = true;
        this._movementLockTimer = duration || 60;
    };

    // Override the updateSelfMovement to respect movement lock
    const _Game_Event_updateSelfMovement = Game_Event.prototype.updateSelfMovement;
    Game_Event.prototype.updateSelfMovement = function () {
        if (this._movementLocked) {
            // Don't allow movement while locked
            return;
        }
        _Game_Event_updateSelfMovement.call(this);
    };

    // Add a method to update movement lock timer
    Game_Event.prototype.updateMovementLock = function () {
        if (this._movementLocked && this._movementLockTimer > 0) {
            this._movementLockTimer--;
            if (this._movementLockTimer <= 0) {
                this._movementLocked = false;
            }
        }
    };

    // Extend the update method to handle movement lock timer
    const _Game_Event_update = Game_Event.prototype.update;
    Game_Event.prototype.update = function () {
        _Game_Event_update.call(this);
        this.updateMovementLock();

        if (window.$gameSplitScreen && window.$gameSplitScreen.active) {
            const p2Name = (window.$gameSplitScreen.p2EventName || "Player 2").trim();
            const myName = (this.event().name || "").trim();

            if (myName === p2Name) {
                this.updateP2EncounterCheck();
            } else if (myName === "Enemy" && this._fixedTroopId > 0) {
                this.updateEnemyTouchP2Check();
            }
        }
    };

    Game_Event.prototype.updateP2EncounterCheck = function () {
        if ($gameSystem.getBattleCooldown() > 0) return;
        if ($gameMap.isEventRunning() || SceneManager.isSceneChanging()) return;

        const x = this.x;
        const y = this.y;
        const d = this.direction();
        const x2 = $gameMap.roundXWithDirection(x, d);
        const y2 = $gameMap.roundYWithDirection(y, d);

        // Check current tile and the tile we are facing/moving into
        const targets = [...$gameMap.eventsXy(x, y), ...$gameMap.eventsXy(x2, y2)];

        for (const target of targets) {
            if (target !== this && (target.event().name || "").trim() === "Enemy" && target._fixedTroopId > 0) {
                const persistentId = `${$gameMap.mapId()}_${target.eventId()}`;
                window._battleActivatorOverride = "p2";
                startPersistentBattle(target._fixedTroopId, persistentId, target.eventId(), $gameMap.mapId());
                break;
            }
        }
    };

    Game_Event.prototype.updateEnemyTouchP2Check = function () {
        if ($gameSystem.getBattleCooldown() > 0) return;
        if ($gameMap.isEventRunning() || SceneManager.isSceneChanging()) return;

        const p2 = window.$gameSplitScreen.p2Event;
        if (!p2) return;

        // Trigger if on the same tile as P2
        if (this.x === p2.x && this.y === p2.y) {
            const persistentId = `${$gameMap.mapId()}_${this.eventId()}`;
            window._battleActivatorOverride = "p2";
            startPersistentBattle(this._fixedTroopId, persistentId, this.eventId(), $gameMap.mapId());
        }
    };


    // New method to handle actor1 death on map
    Game_Actor.prototype.processMapDeath = function () {
        // Only proceed if this is actor1
        if (this !== $gameParty.members()[0]) return;

        if ($gameSwitches.value(9)) {
            saveDeathData();
        }

        // Set variable 001 to 0 on player's death
        $gameVariables.setValue(1, 0);

        // Set relevant flags
        $gameSystem.setActor1Died(true);
        _needsRespawn = true;

        // Fully heal actor1 (will respawn at full health)
        this.recoverAll();
        let respawnMapId = $gameVariables.value(respawnMapVar);
        let respawnX = $gameVariables.value(respawnXVar);
        let respawnY = $gameVariables.value(respawnYVar);


        // Get respawn coordinates from variables

        // Use default values if any are 0
        if (respawnMapId <= 0) respawnMapId = 1;
        if (respawnX <= 0) respawnX = 21;
        if (respawnY <= 0) respawnY = 23;

        if ($gameSwitches.value(34)) {
            respawnMapId = 557;
            respawnX = 13
            respawnY = 5
        }
        // Tutorial area respawn: if switch 75 is on and player died on maps 1414-1417, respawn at map 1415 (14,18)
        const _tutorialMaps = [1414, 1415, 1416, 1417];
        if ($gameSwitches.value(75) && _tutorialMaps.includes($gameMap.mapId())) {
            respawnMapId = 1415;
            respawnX = 14;
            respawnY = 18;
        }
        // Set player to lower priority temporarily and disable touch events
        $gamePlayer._priorityType = 0; // Below characters
        $gamePlayer._through = true;   // Pass through (no collision/interaction)

        // Fade out first
        $gameScreen.startFadeOut(30);

        // Show death animation on player if available
        if ($dataAnimations[11]) { // Assuming animation ID 11 is a death animation
            $gameTemp.requestAnimation([$gamePlayer], 11); // Play death animation on player
        }

        // Wait for fade to complete before transferring
        setTimeout(() => {
            // Transfer player to respawn point with fade in
            $gamePlayer.reserveTransfer(respawnMapId, respawnX, respawnY, 2, 0);

            // Wait until map transfer is complete, then restore normal player settings
            const mapLoadInterval = setInterval(() => {
                if ($gameMap.mapId() === respawnMapId) {
                    // Restore normal priority and collision after transfer completes
                    $gamePlayer._priorityType = 1; // Same as characters (normal)
                    $gamePlayer._through = false;  // Normal collision/interaction

                    // Reset death flags
                    $gameSystem.setActor1Died(false);
                    _needsRespawn = false;

                    // Update weather and temperature based on respawn map's country
                    if ($gameWeather) {
                        $gameWeather.updateTimeAndWeather();
                        $gameWeather.updateTimeOfDayTint();
                    }

                    clearInterval(mapLoadInterval);

                    // Optional: Show resurrection message
                    //$gameMessage.add($gameParty.members()[0].name() + " has been revived!");
                }
            }, 100); // Check every 100ms
        }, 500); // 500ms should be adequate for 30-frame fade
    };

    // Add new plugin command to damage actor on map
    PluginManager.registerCommand(pluginName, "damageActor", function (args) {
        const actorId = parseInt(args.actorId) || 1;
        const amount = parseInt(args.damage) || 0;

        if (amount > 0 && $gameActors.actor(actorId)) {
            const actor = $gameActors.actor(actorId);
            actor.gainHp(-amount);

            // Show damage popup if on map
            if (!$gameParty.inBattle()) {
                $gameTemp.requestAnimation([$gamePlayer], 1); // Damage animation ID

                // Flash the screen red briefly
                $gameScreen.startFlash([255, 0, 0, 128], 30);
            }
        }
    });

    //=============================================================================
    // Health Protection Debug Commands (Optional)
    //=============================================================================

    // Add plugin command to reset health protection for testing
    PluginManager.registerCommand(pluginName, "resetHealthProtection", function (args) {
        resetHealthProtection();
        window.skipLocalization = true;
        $gameMessage.add("Health protection reset for all actors!");
        window.skipLocalization = false;
    });

    // Add plugin command to check protection status
    PluginManager.registerCommand(pluginName, "checkHealthProtection", function (args) {
        const party = $gameParty.members();
        party.forEach((actor, index) => {
            const hasProtection = hasHealthProtection(actor.actorId());
            const status = hasProtection ? "Available" : "Used";
            window.skipLocalization = true;
            $gameMessage.add(`${actor.name()}: Protection ${status}`);
            window.skipLocalization = false;
        });
    });

    window.getEnemyEventsJSON = function () {
        const enemyEvents = $gameMap.events().filter(ev => {
            const eventData = ev.event();
            return eventData && eventData.name === "Enemy";
        });

        const enemyData = enemyEvents.map(event => {
            return {
                eventId: event.eventId(),
                troopId: event._fixedTroopId || 0,
                x: event.x,
                y: event.y,
                mapId: $gameMap.mapId()
            };
        });

        const result = {
            mapId: $gameMap.mapId(),
            mapName: $dataMap.displayName || $dataMap.name || "Unknown Map",
            enemyCount: enemyData.length,
            enemies: enemyData
        };

        ////console.log("Enemy Events JSON:", JSON.stringify(result, null, 2));
        return JSON.stringify(result, null, 2);
    };

    // Restrict Party Command (Fight/Escape) to the battle activator
    const _Window_PartyCommand_processHandling = Window_PartyCommand.prototype.processHandling;
    Window_PartyCommand.prototype.processHandling = function () {
        if (window.$gameSplitScreen && window.$gameSplitScreen.active && $gameMessage._eventActivator) {
            const activatorId = $gameMessage._eventActivator === "p2" ? 2 : 1;
            if (activatorId === 2) {
                this.processP2Handling();
                return;
            }
        }
        _Window_PartyCommand_processHandling.call(this);
    };

})();

/* =========================
 * BattleSystemEnhanced - Safe Monster Image Loader
 * Adds try/catch when loading images from img/characters/Monsters
 * If loading fails, it logs the error and uses a placeholder bitmap.
 * ========================= */
(function () {
    'use strict';
    if (typeof Sprite_Character !== 'undefined') {
        const _Sprite_Character_setCharacterBitmap = Sprite_Character.prototype.setCharacterBitmap;
        Sprite_Character.prototype.setCharacterBitmap = function () {
            const name = this._characterName || "";
            if (/^Monsters\//i.test(name)) {
                try {
                    _Sprite_Character_setCharacterBitmap.call(this);
                } catch (e) {
                    console.error("[BattleSystemEnhanced] Failed to load character image:", name, e);
                    // Fallback: create a 3x4 placeholder sheet (48x48 frames)
                    const fw = 48, fh = 48;
                    const w = fw * 3, h = fh * 4;
                    const bmp = new Bitmap(w, h);
                    bmp.fillRect(0, 0, w, h, "#222222");
                    bmp.drawText("MISSING", 0, Math.floor(h / 2) - 12, w, 24, "center");
                    this.bitmap = bmp;
                    this._isBigCharacter = false;
                    this.setFrame(0, 0, fw, fh);
                }
            } else {
                _Sprite_Character_setCharacterBitmap.call(this);
            }
        };
    }

    if (typeof ImageManager !== 'undefined') {
        // Also protect direct bitmap loads for Monsters folder, if used elsewhere
        const _loadBitmap = ImageManager.loadBitmap;
        ImageManager.loadBitmap = function (folder, filename) {
            try {
                return _loadBitmap.call(this, folder, filename);
            } catch (e) {
                if (typeof folder === "string" && /img\/characters\/Monsters\/?$/i.test(folder)) {
                    console.error("[BattleSystemEnhanced] Failed to load bitmap:", folder, filename, e);
                    // Fallback to a blank placeholder to avoid crashes
                    const bmp = new Bitmap(144, 192); // 3x4 frames
                    bmp.fillRect(0, 0, 144, 192, "#222222");
                    bmp.drawText("MISSING", 0, 84, 144, 24, "center");
                    return bmp;
                }
                throw e;
            }
        };
    }
})();
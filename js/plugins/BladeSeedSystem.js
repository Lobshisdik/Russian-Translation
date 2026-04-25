/*:
 * @target MZ
 * @plugindesc Blade Seed System v1.3.0
 * @author Omni-Lex
 * @help
 * ============================================================================
 * Blade Seed System Plugin
 * ============================================================================
 * 
 * This plugin implements a spirit weapon binding system where players can
 * create and bind a spirit weapon that levels up with the party.
 * 
 * Features:
 * - Bind a spirit weapon with procedural name generation
 * - Spirit companion with random stats that level up
 * - Spirit evolution at levels 10 and 30 with new images
 * - Elemental spirits with visual indicators
 * - Spirit skill learning system with learning points
 * - Sealed equipment slot (cannot change weapon once bound)
 * - Custom menu command for spirit management
 * - Class-based weapon compatibility filtering
 * - Reshuffle name and spirit before binding
 * 
 * Plugin Commands:
 * - Bind Blade Seed: Opens the binding menu
 * - Unbind Blade Seed: Removes the spirit and unseals equipment
 * 
 * @command bindBladeSeed
 * @text Bind Blade Seed
 * @desc Opens the blade seed binding menu
 * 
 * @command unbindBladeSeed
 * @text Unbind Blade Seed
 * @desc Removes the blade seed and unseals weapon slot
 * 

 * 

 */

(() => {
    'use strict';
    
    const pluginName = 'BladeSeedSystem';
    const parameters = PluginManager.parameters(pluginName);
    
    // Hardcoded weapon types list with starting skills
    const weaponTypes = [
        {"id": 1, "name": "Dagger", "weaponId": "529", "startingSkill": 34}, // Dual Attack or similar
        {"id": 2, "name": "Sword", "weaponId": "530", "startingSkill": 35}, // Slash
        {"id": 3, "name": "Mace", "weaponId": "531", "startingSkill": 36}, // Crush
        {"id": 4, "name": "Axe", "weaponId": "532", "startingSkill": 37}, // Cleave
        {"id": 5, "name": "Whip", "weaponId": "533", "startingSkill": 38}, // Lash
        {"id": 6, "name": "Staff", "weaponId": "534", "startingSkill": 7}, // Heal
        {"id": 7, "name": "Bow", "weaponId": "535", "startingSkill": 39}, // Aimed Shot
        {"id": 8, "name": "Grimoire", "weaponId": "536", "startingSkill": 8}, // Fire
        {"id": 9, "name": "Gun", "weaponId": "537", "startingSkill": 40}, // Rapid Fire
        {"id": 10, "name": "Claw", "weaponId": "538", "startingSkill": 41}, // Rend
        {"id": 11, "name": "Glove", "weaponId": "539", "startingSkill": 42}, // Power Punch
        {"id": 12, "name": "Spear", "weaponId": "540", "startingSkill": 43} // Thrust
    ];
    
    // Hardcoded spirit evolution sets
    const spiritSets = [
        {"element": 1, "name": "Warrior Spirit", "image1": "Ifrit 4 4X", "image2": "Jelly A 4 4X", "image3": "The Slime 9 4X"},
        {"element": 2, "name": "Fire Spirit","image1": "Ifrit 4 4X", "image2": "Jelly A 4 4X", "image3": "The Slime 9 4X"},
        {"element": 3, "name": "Ice Spirit", "image1": "Ifrit 4 4X", "image2": "Jelly A 4 4X", "image3": "The Slime 9 4X"},
        {"element": 4, "name": "Thunder Spirit","image1": "Ifrit 4 4X", "image2": "Jelly A 4 4X", "image3": "The Slime 9 4X"},
        {"element": 5, "name": "Water Spirit", "image1": "Ifrit 4 4X", "image2": "Jelly A 4 4X", "image3": "The Slime 9 4X"},
        {"element": 6, "name": "Metal Spirit","image1": "Ifrit 4 4X", "image2": "Jelly A 4 4X", "image3": "The Slime 9 4X"},
        {"element": 7, "name": "Wind Spirit", "image1": "Ifrit 4 4X", "image2": "Jelly A 4 4X", "image3": "The Slime 9 4X"},
        {"element": 8, "name": "Sacred Spirit", "image1": "Ifrit 4 4X", "image2": "Jelly A 4 4X", "image3": "The Slime 9 4X"},
        {"element": 9, "name": "Cursed Spirit", "image1": "Ifrit 4 4X", "image2": "Jelly A 4 4X", "image3": "The Slime 9 4X"}
    ];
    
    // Element names mapping
    const elementNames = {
        1: 'Physical',
        2: 'Fire',
        3: 'Ice',
        4: 'Thunder',
        5: 'Water',
        6: 'Metal',
        7: 'Wind',
        8: 'Sacred',
        9: 'Cursed'
    };
    
    // Spirit skill sets - hardcoded skill IDs by element
    const spiritSkills = {
        1: [ // Physical
            {skillId: 1, name: "Attack", cost: 0, learned: true}, // Basic attack, always known
            {skillId: 2, name: "Guard", cost: 0, learned: true}, // Basic guard, always known
            {skillId: 7, name: "Heal", cost: 15},
            {skillId: 8, name: "Fire", cost: 20},
            {skillId: 44, name: "Escape", cost: 25}
        ],
        2: [ // Fire
            {skillId: 1, name: "Attack", cost: 0, learned: true},
            {skillId: 2, name: "Guard", cost: 0, learned: true},
            {skillId: 8, name: "Fire", cost: 10},
            {skillId: 9, name: "Fire II", cost: 30},
            {skillId: 10, name: "Fire III", cost: 60},
            {skillId: 17, name: "Burn", cost: 25}
        ],
        3: [ // Ice
            {skillId: 1, name: "Attack", cost: 0, learned: true},
            {skillId: 2, name: "Guard", cost: 0, learned: true},
            {skillId: 11, name: "Ice", cost: 10},
            {skillId: 12, name: "Ice II", cost: 30},
            {skillId: 13, name: "Ice III", cost: 60},
            {skillId: 18, name: "Freeze", cost: 25}
        ],
        4: [ // Thunder
            {skillId: 1, name: "Attack", cost: 0, learned: true},
            {skillId: 2, name: "Guard", cost: 0, learned: true},
            {skillId: 14, name: "Thunder", cost: 10},
            {skillId: 15, name: "Thunder II", cost: 30},
            {skillId: 16, name: "Thunder III", cost: 60},
            {skillId: 19, name: "Shock", cost: 25}
        ],
        5: [ // Water
            {skillId: 1, name: "Attack", cost: 0, learned: true},
            {skillId: 2, name: "Guard", cost: 0, learned: true},
            {skillId: 7, name: "Heal", cost: 12},
            {skillId: 22, name: "Heal II", cost: 35},
            {skillId: 23, name: "Heal III", cost: 65},
            {skillId: 20, name: "Water Bolt", cost: 18}
        ],
        6: [ // Metal
            {skillId: 1, name: "Attack", cost: 0, learned: true},
            {skillId: 2, name: "Guard", cost: 0, learned: true},
            {skillId: 24, name: "Barrier", cost: 20},
            {skillId: 25, name: "Iron Skin", cost: 35},
            {skillId: 26, name: "Metal Strike", cost: 25}
        ],
        7: [ // Wind
            {skillId: 1, name: "Attack", cost: 0, learned: true},
            {skillId: 2, name: "Guard", cost: 0, learned: true},
            {skillId: 27, name: "Wind Slash", cost: 15},
            {skillId: 28, name: "Tornado", cost: 40},
            {skillId: 29, name: "Haste", cost: 30}
        ],
        8: [ // Sacred
            {skillId: 1, name: "Attack", cost: 0, learned: true},
            {skillId: 2, name: "Guard", cost: 0, learned: true},
            {skillId: 7, name: "Heal", cost: 8},
            {skillId: 22, name: "Heal II", cost: 25},
            {skillId: 23, name: "Heal III", cost: 50},
            {skillId: 30, name: "Holy Light", cost: 45}
        ],
        9: [ // Cursed
            {skillId: 1, name: "Attack", cost: 0, learned: true},
            {skillId: 2, name: "Guard", cost: 0, learned: true},
            {skillId: 31, name: "Dark Strike", cost: 18},
            {skillId: 32, name: "Curse", cost: 30},
            {skillId: 33, name: "Drain", cost: 35}
        ]
    };
    
    // Name generation components
    const nameComponents = {
        prefixes: ['Shard', 'Edge', 'Soul', 'Dark', 'Light', 'Storm', 'Flame', 'Frost', 
                  'Steel', 'Void', 'Dawn', 'Dusk', 'Shadow', 'Star', 'Moon', 'Sun'],
        suffixes: ['bane', 'fang', 'claw', 'blade', 'edge', 'heart', 'soul', 'wing', 
                  'strike', 'pierce', 'cut', 'rend', 'tear', 'break', 'sever', 'cleave'],
        elementPrefixes: {
            1: ['Iron', 'Steel', 'War'],
            2: ['Flame', 'Ember', 'Blaze'],
            3: ['Frost', 'Ice', 'Chill'],
            4: ['Storm', 'Spark', 'Bolt'],
            5: ['Flow', 'Wave', 'Tide'],
            6: ['Metal', 'Forge', 'Alloy'],
            7: ['Wind', 'Gale', 'Zephyr'],
            8: ['Holy', 'Divine', 'Sacred'],
            9: ['Curse', 'Hex', 'Blight']
        }
    };
    const loadBladeSeedImage = (filename) => {
        return ImageManager.loadBitmap('img/enemies/BladeSeeds/', filename);
    };
    // Generate procedural weapon name
    const generateWeaponName = (element, weaponType) => {
        const elementPrefixes = nameComponents.elementPrefixes[element] || nameComponents.prefixes;
        const allPrefixes = [...elementPrefixes, ...nameComponents.prefixes];
        const prefix = allPrefixes[Math.floor(Math.random() * allPrefixes.length)];
        const suffix = nameComponents.suffixes[Math.floor(Math.random() * nameComponents.suffixes.length)];
        
        let name = prefix + suffix;
        
        // Ensure max 10 characters
        if (name.length > 10) {
            // Try shorter combinations
            const shortPrefixes = allPrefixes.filter(p => p.length <= 5);
            const shortSuffixes = nameComponents.suffixes.filter(s => s.length <= 5);
            
            if (shortPrefixes.length > 0 && shortSuffixes.length > 0) {
                const shortPrefix = shortPrefixes[Math.floor(Math.random() * shortPrefixes.length)];
                const shortSuffix = shortSuffixes[Math.floor(Math.random() * shortSuffixes.length)];
                name = shortPrefix + shortSuffix;
                
                if (name.length > 10) {
                    name = name.substring(0, 10);
                }
            } else {
                name = name.substring(0, 10);
            }
        }
        
        return name;
    };
    
    // Initialize blade seed data
    const initializeBladeSeedData = () => {
        if (!$gameSystem._bladeSeed) {
            $gameSystem._bladeSeed = {
                bound: false,
                weaponName: '',
                weaponId: 0,
                weaponTypeId: 0,
                spirit: null,
                level: 1,
                experience: 0,
                learningPoints: 0
            };
        }
        // Ensure learningPoints exists for older saves
        if ($gameSystem._bladeSeed && typeof $gameSystem._bladeSeed.learningPoints === 'undefined') {
            $gameSystem._bladeSeed.learningPoints = 0;
        }
    };
    
    // Override weapon name display for Blade Seed weapons
    const getBladeSeedWeaponName = (weaponId) => {
        if ($gameSystem._bladeSeed && $gameSystem._bladeSeed.bound && 
            $gameSystem._bladeSeed.weaponId === weaponId) {
            return $gameSystem._bladeSeed.weaponName;
        }
        return null;
    };
    
    // Get compatible weapon types for actor
    const getCompatibleWeaponTypes = (actor) => {
        const compatibleTypes = [];
        
        for (const weaponType of weaponTypes) {
            const weaponData = $dataWeapons[parseInt(weaponType.weaponId)];
            if (weaponData) {
                // Use the actor's canEquip method which properly checks class and actor restrictions
                if (actor.canEquip(weaponData)) {
                    compatibleTypes.push(weaponType);
                }
            }
        }
        
        // If no compatible weapons, default to gloves
        if (compatibleTypes.length === 0) {
            const gloveType = weaponTypes.find(wt => wt.name === "Glove");
            if (gloveType) {
                const gloveData = $dataWeapons[parseInt(gloveType.weaponId)];
                // Even if gloves aren't normally equippable, add them as fallback
                compatibleTypes.push(gloveType);
            }
        }
        
        return compatibleTypes;
    };
    
    // Calculate skill learning cost based on MP + TP cost
    const calculateSkillLearningCost = (skillId) => {
        const skill = $dataSkills[skillId];
        if (!skill) return 0;
        
        let cost = skill.mpCost || 0;
        cost += skill.tpCost || 0;
        
        // If both costs are 0, use a base cost of 10
        if (cost === 0) cost = 10;
        
        return cost;
    };
    
    // Spirit class
    class SpiritCompanion {
        constructor() {
            this.name = this.generateName();
            this.spiritSet = this.selectSpiritSet();
            this.element = this.spiritSet.element;
            this.level = 1;
            this.experience = 0;
            this.baseStats = this.generateRandomStats();
            this.currentStats = {...this.baseStats};
            this.skills = this.initializeSkills();
        }
        
        generateName() {
            const prefixes = ['Ancient', 'Mystic', 'Shadow', 'Light', 'Storm', 'Fire', 'Ice', 'Earth'];
            const suffixes = ['Spirit', 'Guardian', 'Essence', 'Soul', 'Wisp', 'Phantom'];
            return prefixes[Math.floor(Math.random() * prefixes.length)] + ' ' + 
                   suffixes[Math.floor(Math.random() * suffixes.length)];
        }
        
        selectSpiritSet() {
            if (spiritSets.length === 0) {
                return {
                    element: 1,
                    name: "Default Spirit",
                    image1: "Actor1_1",
                    image2: "Actor1_2",
                    image3: "Actor1_3"
                };
            }
            return spiritSets[Math.floor(Math.random() * spiritSets.length)];
        }
        
        initializeSkills() {
            const elementSkills = spiritSkills[this.element] || spiritSkills[1];
            return elementSkills.map(skill => ({
                skillId: skill.skillId,
                name: skill.name,
                cost: skill.cost > 0 ? skill.cost : calculateSkillLearningCost(skill.skillId),
                learned: skill.learned || false,
                source: skill.learned ? 'spirit' : 'unlearned' // Track source
            }));
        }
        
        addWeaponSkill(weaponType) {
            if (weaponType.startingSkill) {
                // Check if skill already exists in spirit skills
                const existingSkillIndex = this.skills.findIndex(skill => skill.skillId === weaponType.startingSkill);
                
                if (existingSkillIndex >= 0) {
                    // If skill exists, mark it as learned and update source
                    this.skills[existingSkillIndex].learned = true;
                    this.skills[existingSkillIndex].source = 'weapon';
                } else {
                    // Add new weapon skill
                    const skillData = $dataSkills[weaponType.startingSkill];
                    const skillName = skillData ? skillData.name : `Weapon Skill ${weaponType.startingSkill}`;
                    
                    this.skills.push({
                        skillId: weaponType.startingSkill,
                        name: skillName,
                        cost: 0,
                        learned: true,
                        source: 'weapon'
                    });
                }
            }
        }
        
        getCurrentImage() {
            if (this.level >= 30) {
                return this.spiritSet.image3;
            } else if (this.level >= 10) {
                return this.spiritSet.image2;
            } else {
                return this.spiritSet.image1;
            }
        }
        
        getEvolutionStage() {
            if (this.level >= 30) return 3;
            if (this.level >= 10) return 2;
            return 1;
        }
        
        generateRandomStats() {
            return {
                atk: Math.floor(Math.random() * 5) + 1,
                def: Math.floor(Math.random() * 5) + 1,
                mat: Math.floor(Math.random() * 5) + 1,
                mdf: Math.floor(Math.random() * 5) + 1,
                agi: Math.floor(Math.random() * 5) + 1,
                luk: Math.floor(Math.random() * 5) + 1,
                mhp: Math.floor(Math.random() * 20) + 10,
                mmp: Math.floor(Math.random() * 10) + 5
            };
        }
        
        levelUp() {
            const oldStage = this.getEvolutionStage();
            this.level++;
            const newStage = this.getEvolutionStage();
            
            // Increase stats randomly on level up
            Object.keys(this.currentStats).forEach(stat => {
                const growth = Math.floor(Math.random() * 3) + 1;
                this.currentStats[stat] += growth;
            });
            
            // Return true if evolved
            return newStage > oldStage;
        }
        
        getExpForNextLevel() {
            return this.level * 100;
        }
        
        gainExperience(amount) {
            this.experience += amount;
            const needed = this.getExpForNextLevel();
            if (this.experience >= needed) {
                this.experience -= needed;
                const evolved = this.levelUp();
                return { levelUp: true, evolved: evolved };
            }
            return { levelUp: false, evolved: false };
        }
        
        canLearnSkill(skillIndex) {
            const skill = this.skills[skillIndex];
            if (!skill || skill.learned) return false;
            
            const learningPoints = $gameSystem._bladeSeed.learningPoints || 0;
            return learningPoints >= skill.cost;
        }
        
        learnSkill(skillIndex) {
            const skill = this.skills[skillIndex];
            if (!skill || skill.learned) return false;
            
            const learningPoints = $gameSystem._bladeSeed.learningPoints || 0;
            if (learningPoints >= skill.cost) {
                skill.learned = true;
                $gameSystem._bladeSeed.learningPoints -= skill.cost;
                
                // Add skill to actor 1
                const actor = $gameActors.actor(1);
                if (actor && !actor.hasSkill(skill.skillId)) {
                    actor.learnSkill(skill.skillId);
                }
                
                return true;
            }
            return false;
        }
        
        getLearnedSkills() {
            return this.skills.filter(skill => skill.learned);
        }
        
        getUnlearnedSkills() {
            return this.skills.filter(skill => !skill.learned);
        }
    }
    
    // Binding Scene with Preview
    class Scene_BladeSeedBind extends Scene_MenuBase {
        create() {
            super.create();
            this._phase = 'weaponSelect'; // 'weaponSelect' or 'preview'
            this._currentSpirit = null;
            this._currentWeaponName = '';
            this._selectedWeaponType = null;
            this._isShuffling = false; // Prevent rapid shuffling
            
            this.createBackground();
            this.createWindowLayer();
            this.createWarningWindow();
            this.createWeaponTypeWindow();
            this.createPreviewWindow();
            this.createCommandWindow();
            
            this.showWeaponSelection();
        }
        
        start() {
            super.start();
            this._weaponTypeWindow.activate();
            this._weaponTypeWindow.select(0);
        }
        
        createBackground() {
            this._backgroundSprite = new Sprite();
            this._backgroundSprite.bitmap = SceneManager.backgroundBitmap();
            this.addChild(this._backgroundSprite);
        }
        
        createWarningWindow() {
            const width = 700;
            const height = 120;
            const x = (Graphics.boxWidth - width) / 2;
            const y = 50;
            
            this._warningWindow = new Window_Base(new Rectangle(x, y, width, height));
            this._warningWindow.drawTextEx('\\c[2]Warning:\\c[0] The binding process with a\nblade seed is \\c[10]irreversible\\c[0]!', 0, 0);
            this.addWindow(this._warningWindow);
        }
        
        createWeaponTypeWindow() {
            const width = 400;
            const height = 400;
            const x = Graphics.boxWidth - width - 50;
            const y = 170;
            
            this._weaponTypeWindow = new Window_BladeSeedWeaponType(new Rectangle(x, y, width, height));
            this._weaponTypeWindow.setHandler('ok', this.onWeaponTypeOk.bind(this));
            this._weaponTypeWindow.setHandler('cancel', this.onCancel.bind(this));
            this.addWindow(this._weaponTypeWindow);
        }
        
        createPreviewWindow() {
            const width = 650;
            const height = 400;
            const x = 50;
            const y = 170;
            
            this._previewWindow = new Window_BladeSeedPreview(new Rectangle(x, y, width, height));
            this._previewWindow.hide();
            this.addWindow(this._previewWindow);
        }
        
        createCommandWindow() {
            const width = 250;
            const height = 150;
            const x = Graphics.boxWidth - width - 50;
            const y = Graphics.boxHeight - height - 50;
            
            this._commandWindow = new Window_BladeSeedCommand(new Rectangle(x, y, width, height));
            this._commandWindow.setHandler('confirm', this.onConfirm.bind(this));
            this._commandWindow.setHandler('reshuffle', this.onReshuffle.bind(this));
            this._commandWindow.setHandler('back', this.onBack.bind(this));
            this._commandWindow.setHandler('cancel', this.onCancel.bind(this));
            this._commandWindow.deactivate();
            this.addWindow(this._commandWindow);
        }
        
        showWeaponSelection() {
            this._phase = 'weaponSelect';
            this._weaponTypeWindow.show();
            this._weaponTypeWindow.activate();
            this._previewWindow.hide();
            this._commandWindow.deactivate();
            this._commandWindow.setupForWeaponSelect();
        }
        
        showPreview() {
            this._phase = 'preview';
            this._isShuffling = false; // Reset shuffling state
            this._weaponTypeWindow.hide();
            this._weaponTypeWindow.deactivate();
            this._previewWindow.show();
            this._previewWindow.setupPreview(this._selectedWeaponType, this._currentSpirit, this._currentWeaponName);
            this._commandWindow.activate();
            this._commandWindow.setupForPreview();
            this._commandWindow.select(0);
        }
        
        onWeaponTypeOk() {
            this._selectedWeaponType = this._weaponTypeWindow.currentWeaponType();
            if (this._selectedWeaponType) {
                this.generateNewSpirit();
                this.showPreview();
            }
        }
        
        generateNewSpirit() {
            // Create new spirit
            this._currentSpirit = new SpiritCompanion();
            // Add weapon skill to spirit
            this._currentSpirit.addWeaponSkill(this._selectedWeaponType);
            // Generate weapon name based on spirit element and weapon type
            this._currentWeaponName = generateWeaponName(this._currentSpirit.element, this._selectedWeaponType);
        }
        
        onConfirm() {
            if (this._phase === 'preview') {
                this.bindBladeSeed(this._currentWeaponName, this._selectedWeaponType, this._currentSpirit);
                this.popScene();
            }
        }
        
        onReshuffle() {
            if (this._phase === 'preview') {
                this.generateNewSpirit();
                this._previewWindow.setupPreview(this._selectedWeaponType, this._currentSpirit, this._currentWeaponName);
                SoundManager.playCursor();
            }
        }
        
        onBack() {
            if (this._phase === 'preview') {
                this.showWeaponSelection();
            }
        }
        
        bindBladeSeed(name, weaponType, spirit) {
            initializeBladeSeedData();
            
            const weaponId = parseInt(weaponType.weaponId);
            
            // Save blade seed data
            $gameSystem._bladeSeed = {
                bound: true,
                weaponName: name,
                weaponId: weaponId,
                weaponTypeId: $dataWeapons[weaponId].wtypeId,
                spirit: spirit,
                level: 1,
                experience: 0,
                learningPoints: 0,
                originalWeaponName: $dataWeapons[weaponId].name // Store original name
            };
            
            // Create a copy of the weapon data and modify its name
            const originalWeapon = $dataWeapons[weaponId];
            const modifiedWeapon = JSON.parse(JSON.stringify(originalWeapon));
            modifiedWeapon.name = name;
            
            // Store the modified weapon data temporarily
            $gameSystem._bladeSeedWeaponData = modifiedWeapon;
            
            // Add weapon to inventory
            $gameParty.gainItem($dataWeapons[weaponId], 1);
            
            // Equip to actor 1
            const actor = $gameActors.actor(1);
            actor.changeEquip(0, $dataWeapons[weaponId]);
            
            // Seal the weapon slot
            actor._sealedSlots = actor._sealedSlots || {};
            actor._sealedSlots[0] = true;
            
            // Apply spirit stats to actor and learn initial skills
            this.applySpiritStats();
            this.learnInitialSkills();
            
            SoundManager.playEquip();
            
            if (typeof window !== 'undefined') {
                window.skipLocalization = true;
            }
            $gameMessage.add(`\\c[14]${name}\\c[0] has been bound to your soul!`);
            $gameMessage.add(`Spirit Element: \\c[3]${elementNames[spirit.element]}\\c[0]`);
            if (typeof window !== 'undefined') {
                window.skipLocalization = false;
            }
        }
        
        applySpiritStats() {
            const actor = $gameActors.actor(1);
            const spirit = $gameSystem._bladeSeed.spirit;
            
            if (spirit && spirit.currentStats) {
                // Store original params if not stored
                if (!actor._originalParams) {
                    actor._originalParams = {};
                    for (let i = 0; i < 8; i++) {
                        actor._originalParams[i] = actor.param(i);
                    }
                }
                
                // Apply spirit bonuses
                actor._bladeSeedBonus = {
                    0: spirit.currentStats.mhp,
                    1: spirit.currentStats.mmp,
                    2: spirit.currentStats.atk,
                    3: spirit.currentStats.def,
                    4: spirit.currentStats.mat,
                    5: spirit.currentStats.mdf,
                    6: spirit.currentStats.agi,
                    7: spirit.currentStats.luk
                };
            }
        }
        
        learnInitialSkills() {
            const actor = $gameActors.actor(1);
            const spirit = $gameSystem._bladeSeed.spirit;
            
            if (spirit && actor) {
                // Learn all initially learned skills
                const learnedSkills = spirit.getLearnedSkills();
                learnedSkills.forEach(skill => {
                    if (!actor.hasSkill(skill.skillId)) {
                        actor.learnSkill(skill.skillId);
                    }
                });
            }
        }
        
        onCancel() {
            this.popScene();
        }
    }
    
    // Weapon type selection window
    class Window_BladeSeedWeaponType extends Window_Selectable {
        initialize(rect) {
            this._compatibleWeapons = getCompatibleWeaponTypes($gameActors.actor(1));
            super.initialize(rect);
            this.refresh();
        }
        
        maxItems() {
            return this._compatibleWeapons.length;
        }
        
        currentWeaponType() {
            return this._compatibleWeapons[this.index()];
        }
        
        drawItem(index) {
            const rect = this.itemLineRect(index);
            const weaponType = this._compatibleWeapons[index];
            const weaponData = $dataWeapons[parseInt(weaponType.weaponId)];
            
            // Show weapon type name and basic info
            this.drawText(`${weaponType.name}`, rect.x, rect.y, rect.width);
            
            // Show weapon stats if available
            if (weaponData) {
                const atkText = `ATK: ${weaponData.params[2]}`;
                this.drawText(atkText, rect.x, rect.y, rect.width, 'right');
            }
            
            // Show starting skill on second line
            if (weaponType.startingSkill) {
                const skillData = $dataSkills[weaponType.startingSkill];
                const skillName = skillData ? skillData.name : `Skill ${weaponType.startingSkill}`;
                const skillRect = new Rectangle(rect.x, rect.y + this.lineHeight() * 0.6, rect.width, this.lineHeight());
                this.contents.fontSize = Math.floor($gameSystem.mainFontSize() * 0.8);
                this.changeTextColor(ColorManager.systemColor());
                this.drawText(`Skill: ${skillName}`, skillRect.x, skillRect.y, skillRect.width);
                this.resetTextColor();
                this.contents.fontSize = $gameSystem.mainFontSize();
            }
        }
        
        drawAllItems() {
            super.drawAllItems();
            
            // Draw header
            const headerRect = new Rectangle(this.itemPadding(), 0, this.contents.width - this.itemPadding() * 2, this.lineHeight());
            this.contents.fontSize = 18;
            this.drawText('Select Weapon Type:', headerRect.x, headerRect.y, headerRect.width, 'center');
            this.contents.fontSize = $gameSystem.mainFontSize();
        }
        
        itemRect(index) {
            const rect = super.itemRect(index);
            rect.y += this.lineHeight(); // Offset for header
            return rect;
        }
        
        itemLineRect(index) {
            const rect = super.itemLineRect(index);
            rect.y += this.lineHeight(); // Offset for header
            return rect;
        }
        
        maxCols() {
            return 1;
        }
        
        spacing() {
            return 8;
        }
        
        itemHeight() {
            return this.lineHeight() * 1.6; // Increased height to accommodate skill info
        }
    }
    
    // Preview window showing generated name, spirit, and image
    class Window_BladeSeedPreview extends Window_Base {
        initialize(rect) {
            super.initialize(rect);
            this._weaponType = null;
            this._spirit = null;
            this._weaponName = '';
            this._currentImageBitmap = null;
        }
        
        setupPreview(weaponType, spirit, weaponName) {
            this._weaponType = weaponType;
            this._spirit = spirit;
            this._weaponName = weaponName;
            
            // Clear any existing image bitmap to prevent conflicts
            if (this._currentImageBitmap) {
                this._currentImageBitmap = null;
            }
            
            this.refresh();
        }
        
        refresh() {
            this.contents.clear();
            
            if (!this._spirit || !this._weaponType) return;
            
            // Draw header
            this.contents.fontSize = 20;
            this.drawText('Blade Seed Preview', 0, 0, this.contents.width, 'center');
            this.contents.fontSize = $gameSystem.mainFontSize();
            
            let y = this.lineHeight() * 2;
            
            // Draw weapon info
            this.drawTextEx(`\\c[14]Weapon Name: ${this._weaponName}\\c[0]`, 0, y);
            y += this.lineHeight();
            
            this.drawText(`Type: ${this._weaponType.name}`, 0, y, this.contents.width);
            y += this.lineHeight() * 1.5;
            
            // Draw element info (without spirit name)
            this.drawText(`Element: ${elementNames[this._spirit.element]}`, 0, y, this.contents.width);
            y += this.lineHeight() * 1.5;
            
            // Draw spirit stats preview
            this.drawText('Spirit Stats:', 0, y, this.contents.width);
            y += this.lineHeight();
            
            const stats = this._spirit.currentStats;
            const statNames = ['ATK', 'DEF', 'MAT', 'MDF', 'AGI', 'LUK'];
            const statKeys = ['atk', 'def', 'mat', 'mdf', 'agi', 'luk'];
            
            // Draw stats in a 2x3 grid with proper spacing
            const colWidth = 120;
            const col1X = 0;
            const col2X = 150;
            
            for (let i = 0; i < statNames.length; i++) {
                const statName = statNames[i];
                const statValue = stats[statKeys[i]];
                const x = (i % 2 === 0) ? col1X : col2X;
                const rowY = y + Math.floor(i / 2) * this.lineHeight();
                this.drawText(`${statName}: +${statValue}`, x, rowY, colWidth);
            }
            
            y += Math.ceil(statNames.length / 2) * this.lineHeight();
            y += this.lineHeight() * 0.5;
            
            this.drawText(`HP: +${stats.mhp}`, col1X, y, colWidth);
            this.drawText(`MP: +${stats.mmp}`, col2X, y, colWidth);
            
            // Draw initial skills info
            y += this.lineHeight() * 1.5;
            this.drawText('Initial Skills:', 0, y, this.contents.width);
            y += this.lineHeight();
            
            const learnedSkills = this._spirit.getLearnedSkills();
            if (learnedSkills.length > 0) {
                learnedSkills.forEach(skill => {
                    let skillText = `• ${skill.name}`;
                    if (skill.source === 'weapon') {
                        skillText += ' \\c[3](Weapon)\\c[0]';
                    }
                    this.drawTextEx(skillText, 0, y, this.contents.width);
                    y += this.lineHeight() * 0.8;
                });
            }
            
            // Draw spirit image
            this.drawSpiritImage();
        }
        
        drawSpiritImage() {
            if (!this._spirit) return;
            
            const imageName = this._spirit.getCurrentImage();
            
            if (imageName && imageName !== '') {
                try {
                    const bitmap = loadBladeSeedImage(imageName);                    
                    this._currentImageBitmap = bitmap;
                    
                    if (bitmap && bitmap.isReady()) {
                        // Image is already loaded
                        this.drawLoadedImage(bitmap);
                    } else if (bitmap) {
                        // Add load listener for when image finishes loading
                        bitmap.addLoadListener(() => {
                            // Only draw if this is still the current bitmap (prevents conflicts)
                            if (this._currentImageBitmap === bitmap) {
                                this.drawLoadedImage(bitmap);
                            }
                        });
                    }
                } catch (e) {
                    // Fallback if image doesn't exist
                    this.drawText('No Image', this.contents.width - 140, 80, 120, 'center');
                }
            }
        }
        
        drawLoadedImage(bitmap) {
            const x = this.contents.width - 140;
            const y = 80;
            const scale = 1.2;
            const sw = Math.min(bitmap.width, 64);
            const sh = Math.min(bitmap.height, 64);
            this.contents.blt(bitmap, 0, 0, sw, sh, x, y, sw * scale, sh * scale);
        }
    }
    
    // Command window with different states
    class Window_BladeSeedCommand extends Window_Command {
        initialize(rect) {
            this._mode = 'weaponSelect';
            super.initialize(rect);
        }
        
        setupForWeaponSelect() {
            this._mode = 'weaponSelect';
            this.refresh();
            this.deactivate();
        }
        
        setupForPreview() {
            this._mode = 'preview';
            this.refresh();
        }
        
        makeCommandList() {
            if (this._mode === 'preview') {
                this.addCommand('Confirm', 'confirm');
                this.addCommand('Reshuffle', 'reshuffle');
                this.addCommand('Back', 'back');
                this.addCommand('Cancel', 'cancel');
            } else {
                this.addCommand('Cancel', 'cancel');
            }
        }
    }
    
    // Spirit Status Scene
    class Scene_BladeSeedStatus extends Scene_MenuBase {
        create() {
            super.create();
            this.createBackground();
            this.createWindowLayer();
            this.createSpiritWindow();
            this.createStatsWindow();
            this.createSkillWindow();
            this.createSkillListWindow();
            this.createHelpWindow();
        }
        
        start() {
            super.start();
            this._skillWindow.activate();
            this._skillWindow.select(0);
        }
        
        createBackground() {
            this._backgroundSprite = new Sprite();
            this._backgroundSprite.bitmap = SceneManager.backgroundBitmap();
            this.addChild(this._backgroundSprite);
        }
        
        createSpiritWindow() {
            const width = 400;
            const height = 200;
            const x = 50;
            const y = 50;
            
            this._spiritWindow = new Window_BladeSeedSpirit(new Rectangle(x, y, width, height));
            this.addWindow(this._spiritWindow);
        }
        
        createStatsWindow() {
            const width = 300;
            const height = 200;
            const x = Graphics.boxWidth - width - 50;
            const y = 50;
            
            this._statsWindow = new Window_BladeSeedStats(new Rectangle(x, y, width, height));
            this.addWindow(this._statsWindow);
        }
        
        createSkillWindow() {
            const width = 300;
            const height = 150;
            const x = Graphics.boxWidth - width - 50;
            const y = 260;
            
            this._skillWindow = new Window_BladeSeedSkillCommand(new Rectangle(x, y, width, height));
            this._skillWindow.setHandler('learnSkill', this.onLearnSkill.bind(this));
            this._skillWindow.setHandler('viewSkills', this.onViewSkills.bind(this));
            this._skillWindow.setHandler('cancel', this.onCancel.bind(this));
            this.addWindow(this._skillWindow);
        }
        
        createSkillListWindow() {
            const width = 450;
            const height = 300;
            const x = 50;
            const y = 260;
            
            this._skillListWindow = new Window_BladeSeedSkillList(new Rectangle(x, y, width, height));
            this._skillListWindow.setHandler('ok', this.onSkillListOk.bind(this));
            this._skillListWindow.setHandler('cancel', this.onSkillListCancel.bind(this));
            this._skillListWindow.setHelpWindow(this._helpWindow);
            this._skillListWindow.hide();
            this._skillListWindow.deactivate();
            this.addWindow(this._skillListWindow);
        }
        
        createHelpWindow() {
            const width = Graphics.boxWidth - 100;
            const height = 80;
            const x = 50;
            const y = Graphics.boxHeight - height - 20;
            
            this._helpWindow = new Window_Help(new Rectangle(x, y, width, height));
            this._helpWindow.hide();
            this.addWindow(this._helpWindow);
        }
        
        onLearnSkill() {
            this._skillListWindow.setMode('learn');
            this._skillListWindow.refresh();
            this._skillListWindow.show();
            this._skillListWindow.activate();
            this._skillListWindow.select(0);
            this._skillWindow.deactivate();
            this._helpWindow.show();
        }
        
        onViewSkills() {
            this._skillListWindow.setMode('view');
            this._skillListWindow.refresh();
            this._skillListWindow.show();
            this._skillListWindow.activate();
            this._skillListWindow.select(0);
            this._skillWindow.deactivate();
            this._helpWindow.show();
        }
        
        onSkillListOk() {
            if (this._skillListWindow._mode === 'learn') {
                const skill = this._skillListWindow.currentSkill();
                if (skill && !skill.learned) {
                    const spirit = $gameSystem._bladeSeed.spirit;
                    const skillIndex = spirit.skills.findIndex(s => s.skillId === skill.skillId);
                    
                    if (skillIndex >= 0 && spirit.canLearnSkill(skillIndex)) {
                        spirit.learnSkill(skillIndex);
                        
                        SoundManager.playUseSkill();
                        if (typeof window !== 'undefined') {
                            window.skipLocalization = true;
                        }
                        $gameMessage.add(`Learned skill: ${skill.name}!`);
                        if (typeof window !== 'undefined') {
                            window.skipLocalization = false;
                        }
                        
                        this._spiritWindow.refresh();
                        this._skillListWindow.refresh();
                    } else {
                        SoundManager.playBuzzer();
                    }
                }
            }
        }
        
        onSkillListCancel() {
            this._skillListWindow.hide();
            this._skillListWindow.deactivate();
            this._skillWindow.activate();
            this._helpWindow.hide();
        }
        
        onCancel() {
            this.popScene();
        }
        
        update() {
            super.update();
            if (Input.isTriggered('cancel') && this._skillWindow.active) {
                this.onCancel();
            }
        }
    }
    
    // Spirit display window
    class Window_BladeSeedSpirit extends Window_Base {
        initialize(rect) {
            super.initialize(rect);
            this.refresh();
        }
        
        refresh() {
            this.contents.clear();
            
            if (!$gameSystem._bladeSeed || !$gameSystem._bladeSeed.bound) {
                this.drawText('No Blade Seed bound', 0, 0, this.contents.width, 'center');
                return;
            }
            
            const data = $gameSystem._bladeSeed;
            const spirit = data.spirit;
            
            // Draw weapon name
            this.drawTextEx(`\\c[14]${data.weaponName}\\c[0]`, 0, 0);
            
            // Draw spirit info
            this.drawText(`Spirit: ${spirit.name}`, 0, this.lineHeight(), this.contents.width);
            this.drawTextEx(`Element: \\c[3]${elementNames[spirit.element]}\\c[0]`, 0, this.lineHeight() * 2);
            this.drawText(`Level: ${spirit.level} (Stage ${spirit.getEvolutionStage()})`, 0, this.lineHeight() * 3, this.contents.width);
            
            // Draw learning points
            this.drawTextEx(`\\c[6]Learning Points: ${data.learningPoints}\\c[0]`, 0, this.lineHeight() * 4, this.contents.width);
            
            // Draw exp bar
            const expRate = spirit.experience / spirit.getExpForNextLevel();
            const gaugeWidth = 200;
            const gaugeHeight = 12;
            const gaugeX = 0;
            const gaugeY = this.lineHeight() * 5 + 10;
            
            this.drawGauge(gaugeX, gaugeY, gaugeWidth, expRate, '#44ff44', '#22aa22');
            this.drawText(`EXP: ${spirit.experience}/${spirit.getExpForNextLevel()}`, 
                         gaugeX, gaugeY + 20, gaugeWidth, 'center');
            
            // Draw evolution milestones
            let milestoneY = this.lineHeight() * 7 + 30;
            if (spirit.level < 10) {
                this.drawText('Next Evolution: Level 10', 0, milestoneY, this.contents.width);
            } else if (spirit.level < 30) {
                this.drawText('Next Evolution: Level 30', 0, milestoneY, this.contents.width);
            } else {
                this.drawText('\\c[3]Fully Evolved\\c[0]', 0, milestoneY, this.contents.width);
            }
            
            // Draw spirit image
            this.drawSpiritImage();
        }
        
        drawSpiritImage() {
            if (!$gameSystem._bladeSeed || !$gameSystem._bladeSeed.spirit) return;
            
            const spirit = $gameSystem._bladeSeed.spirit;
            const imageName = spirit.getCurrentImage();
            
            if (imageName && imageName !== '') {
                try {
                    const bitmap = loadBladeSeedImage(imageName);                    
                    if (bitmap) {
                        bitmap.addLoadListener(() => {
                            const x = 250;
                            const y = 50;
                            const scale = 0.8;
                            const sw = Math.min(bitmap.width, 64);
                            const sh = Math.min(bitmap.height, 64);
                            this.contents.blt(bitmap, 0, 0, sw, sh, x, y, sw * scale, sh * scale);
                        });
                    }
                } catch (e) {
                    // Fallback if image doesn't exist
                    this.drawText('No Image', 250, 50, 100, 'center');
                }
            }
        }
    }
    
    // Stats display window
    class Window_BladeSeedStats extends Window_Base {
        initialize(rect) {
            super.initialize(rect);
            this.refresh();
        }
        
        refresh() {
            this.contents.clear();
            
            if (!$gameSystem._bladeSeed || !$gameSystem._bladeSeed.bound) {
                return;
            }
            
            const spirit = $gameSystem._bladeSeed.spirit;
            const stats = spirit.currentStats;
            
            this.drawTextEx('\\c[14]Spirit Stats\\c[0]', 0, 0);
            
            let y = this.lineHeight() * 2;
            
            const statNames = {
                mhp: 'Max HP',
                mmp: 'Max MP',
                atk: 'Attack',
                def: 'Defense',
                mat: 'M.Attack',
                mdf: 'M.Defense',
                agi: 'Agility',
                luk: 'Luck'
            };
            
            for (const [key, value] of Object.entries(stats)) {
                this.drawText(statNames[key] + ':', 0, y, 150);
                this.drawText(`+${value}`, 150, y, 100, 'right');
                y += this.lineHeight();
            }
        }
    }
    
    // Skill command window
    class Window_BladeSeedSkillCommand extends Window_Command {
        makeCommandList() {
            this.addCommand('Learn Skills', 'learnSkill');
            this.addCommand('View Skills', 'viewSkills');
            this.addCommand('Back', 'cancel');
        }
    }
    
    // Skill list window
    class Window_BladeSeedSkillList extends Window_Selectable {
        initialize(rect) {
            super.initialize(rect);
            this._mode = 'learn'; // 'learn' or 'view'
            this._skills = [];
            this.refresh();
        }
        
        setMode(mode) {
            this._mode = mode;
        }
        
        maxItems() {
            return this._skills.length;
        }
        
        currentSkill() {
            return this._skills[this.index()];
        }
        
        refresh() {
            if (!$gameSystem._bladeSeed || !$gameSystem._bladeSeed.spirit) {
                this._skills = [];
            } else {
                const spirit = $gameSystem._bladeSeed.spirit;
                if (this._mode === 'learn') {
                    this._skills = spirit.getUnlearnedSkills();
                } else {
                    this._skills = spirit.getLearnedSkills();
                }
            }
            super.refresh();
        }
        
        drawItem(index) {
            const rect = this.itemLineRect(index);
            const skill = this._skills[index];
            if (!skill) return;
            
            const learningPoints = $gameSystem._bladeSeed.learningPoints || 0;
            const canAfford = learningPoints >= skill.cost;
            
            // Change text color based on affordability (only for learn mode)
            if (this._mode === 'learn') {
                this.changeTextColor(canAfford ? ColorManager.normalColor() : ColorManager.deathColor());
            }
            
            // Draw skill name with source indicator
            let skillName = skill.name;
            if (skill.source === 'weapon') {
                skillName += ' (Weapon)';
                this.changeTextColor(ColorManager.systemColor());
            }
            
            this.drawText(skillName, rect.x, rect.y, rect.width - 80);
            
            // Draw cost (only for unlearned skills in learn mode)
            if (this._mode === 'learn') {
                this.changeTextColor(ColorManager.systemColor());
                this.drawText(`${skill.cost} LP`, rect.x, rect.y, rect.width, 'right');
            }
            
            this.resetTextColor();
        }
        
        drawAllItems() {
            // Draw header
            const headerText = this._mode === 'learn' ? 'Available Skills' : 'Learned Skills';
            this.contents.fontSize = 18;
            this.drawText(headerText, 0, 0, this.contents.width, 'center');
            this.contents.fontSize = $gameSystem.mainFontSize();
            
            super.drawAllItems();
        }
        
        itemRect(index) {
            const rect = super.itemRect(index);
            rect.y += this.lineHeight(); // Offset for header
            return rect;
        }
        
        itemLineRect(index) {
            const rect = super.itemLineRect(index);
            rect.y += this.lineHeight(); // Offset for header
            return rect;
        }
        
        updateHelp() {
            const skill = this.currentSkill();
            if (skill && this._helpWindow) {
                const skillData = $dataSkills[skill.skillId];
                if (skillData) {
                    let helpText = skillData.description;
                    if (this._mode === 'learn') {
                        const learningPoints = $gameSystem._bladeSeed.learningPoints || 0;
                        const canAfford = learningPoints >= skill.cost;
                        helpText += `\nCost: ${skill.cost} Learning Points`;
                        if (!canAfford) {
                            helpText += ` (Need ${skill.cost - learningPoints} more)`;
                        }
                    }
                    this._helpWindow.setText(helpText);
                } else {
                    this._helpWindow.clear();
                }
            } else if (this._helpWindow) {
                this._helpWindow.clear();
            }
        }
        
        isOkEnabled() {
            if (this._mode === 'view') return false;
            
            const skill = this.currentSkill();
            if (!skill) return false;
            
            const spirit = $gameSystem._bladeSeed.spirit;
            const skillIndex = spirit.skills.findIndex(s => s.skillId === skill.skillId);
            return skillIndex >= 0 && spirit.canLearnSkill(skillIndex);
        }
    }
    
    // Plugin Commands
    PluginManager.registerCommand(pluginName, 'bindBladeSeed', args => {
        initializeBladeSeedData();
        if ($gameSystem._bladeSeed && $gameSystem._bladeSeed.bound) {
            if (typeof window !== 'undefined') {
                window.skipLocalization = true;
            }
            $gameMessage.add('A Blade Seed is already bound!');
            if (typeof window !== 'undefined') {
                window.skipLocalization = false;
            }
            return;
        }
        SceneManager.push(Scene_BladeSeedBind);
    });
    
    PluginManager.registerCommand(pluginName, 'unbindBladeSeed', args => {
        initializeBladeSeedData();
        if (!$gameSystem._bladeSeed || !$gameSystem._bladeSeed.bound) {
            return;
        }
        
        // Remove weapon from inventory
        const weaponId = $gameSystem._bladeSeed.weaponId;
        const actor = $gameActors.actor(1);
        
        // Remove learned spirit skills from actor
        const spirit = $gameSystem._bladeSeed.spirit;
        if (spirit) {
            const learnedSkills = spirit.getLearnedSkills();
            learnedSkills.forEach(skill => {
                if (actor.hasSkill(skill.skillId)) {
                    actor.forgetSkill(skill.skillId);
                }
            });
        }
        
        // Unequip weapon
        actor.changeEquip(0, null);
        
        // Unlock weapon slot
        if (actor._sealedSlots) {
            delete actor._sealedSlots[0];
        }
        
        // Remove weapon from inventory
        $gameParty.loseItem($dataWeapons[weaponId], 1);
        
        // Remove spirit stats
        if (actor._bladeSeedBonus) {
            delete actor._bladeSeedBonus;
        }
        
        // Clear blade seed data
        $gameSystem._bladeSeed = {
            bound: false,
            weaponName: '',
            weaponId: 0,
            weaponTypeId: 0,
            spirit: null,
            level: 1,
            experience: 0,
            learningPoints: 0
        };
        
        // Clear modified weapon data
        if ($gameSystem._bladeSeedWeaponData) {
            delete $gameSystem._bladeSeedWeaponData;
        }
    });
    
    // Override weapon name display system
    const _Window_Base_drawItemName = Window_Base.prototype.drawItemName;
    Window_Base.prototype.drawItemName = function(item, x, y, width) {
        if (item && DataManager.isWeapon(item)) {
            const customName = getBladeSeedWeaponName(item.id);
            if (customName) {
                // Create temporary item with custom name
                const tempItem = Object.assign({}, item);
                tempItem.name = customName;
                return _Window_Base_drawItemName.call(this, tempItem, x, y, width);
            }
        }
        return _Window_Base_drawItemName.call(this, item, x, y, width);
    };
    
    // Override for status windows and equipment displays
    const _Window_Status_drawItemName = Window_Status ? Window_Status.prototype.drawItemName : null;
    if (Window_Status && _Window_Status_drawItemName) {
        Window_Status.prototype.drawItemName = function(item, x, y, width) {
            if (item && DataManager.isWeapon(item)) {
                const customName = getBladeSeedWeaponName(item.id);
                if (customName) {
                    const tempItem = Object.assign({}, item);
                    tempItem.name = customName;
                    return _Window_Status_drawItemName.call(this, tempItem, x, y, width);
                }
            }
            return _Window_Status_drawItemName.call(this, item, x, y, width);
        };
    }
    
    // Override for equipment window
    const _Window_EquipItem_drawItemName = Window_EquipItem ? Window_EquipItem.prototype.drawItemName : null;
    if (Window_EquipItem && _Window_EquipItem_drawItemName) {
        Window_EquipItem.prototype.drawItemName = function(item, x, y, width) {
            if (item && DataManager.isWeapon(item)) {
                const customName = getBladeSeedWeaponName(item.id);
                if (customName) {
                    const tempItem = Object.assign({}, item);
                    tempItem.name = customName;
                    return _Window_EquipItem_drawItemName.call(this, tempItem, x, y, width);
                }
            }
            return _Window_EquipItem_drawItemName.call(this, item, x, y, width);
        };
    }
    
    // Override item name in text processing
    const _Game_Message_allText = Game_Message.prototype.allText;
    Game_Message.prototype.allText = function() {
        let text = _Game_Message_allText.call(this);
        
        // Replace weapon names in text if Blade Seed is bound
        if ($gameSystem._bladeSeed && $gameSystem._bladeSeed.bound) {
            const originalName = $dataWeapons[$gameSystem._bladeSeed.weaponId].name;
            const customName = $gameSystem._bladeSeed.weaponName;
            text = text.replace(new RegExp(originalName, 'g'), customName);
        }
        
        return text;
    };
    
    // Add menu command
    const _Window_MenuCommand_addOriginalCommands = Window_MenuCommand.prototype.addOriginalCommands;
    Window_MenuCommand.prototype.addOriginalCommands = function() {
        _Window_MenuCommand_addOriginalCommands.call(this);
        initializeBladeSeedData();
        if ($gameSystem._bladeSeed && $gameSystem._bladeSeed.bound) {
            this.addCommand('Blade Seed', 'bladeSeed', true);
        }
    };
    
    const _Scene_Menu_createCommandWindow = Scene_Menu.prototype.createCommandWindow;
    Scene_Menu.prototype.createCommandWindow = function() {
        _Scene_Menu_createCommandWindow.call(this);
        this._commandWindow.setHandler('bladeSeed', this.commandBladeSeed.bind(this));
    };
    
    Scene_Menu.prototype.commandBladeSeed = function() {
        SceneManager.push(Scene_BladeSeedStatus);
    };
    
    // Extend Game_Actor to include blade seed bonuses
    const _Game_Actor_paramBase = Game_Actor.prototype.paramBase;
    Game_Actor.prototype.paramBase = function(paramId) {
        let value = _Game_Actor_paramBase.call(this, paramId);
        if (this._bladeSeedBonus && this._bladeSeedBonus[paramId]) {
            value += this._bladeSeedBonus[paramId];
        }
        return value;
    };
    
    // Handle experience gain for spirit
    const _Game_Actor_gainExp = Game_Actor.prototype.gainExp;
    Game_Actor.prototype.gainExp = function(exp) {
        _Game_Actor_gainExp.call(this, exp);
        
        if (this.actorId() === 1 && $gameSystem._bladeSeed && $gameSystem._bladeSeed.bound) {
            const spirit = $gameSystem._bladeSeed.spirit;
            const spiritExp = Math.floor(exp * 0.5); // Spirit gains 50% of actor exp
            
            const result = spirit.gainExperience(spiritExp);
            if (result.levelUp) {
                if (typeof window !== 'undefined') {
                    window.skipLocalization = true;
                }
                $gameMessage.add(`${spirit.name} leveled up to ${spirit.level}!`);
                
                if (result.evolved) {
                    $gameMessage.add(`\\c[3]${spirit.name} evolved to Stage ${spirit.getEvolutionStage()}!\\c[0]`);
                }
                
                if (typeof window !== 'undefined') {
                    window.skipLocalization = false;
                }
                
                // Reapply stats
                const actor = $gameActors.actor(1);
                actor._bladeSeedBonus = {
                    0: spirit.currentStats.mhp,
                    1: spirit.currentStats.mmp,
                    2: spirit.currentStats.atk,
                    3: spirit.currentStats.def,
                    4: spirit.currentStats.mat,
                    5: spirit.currentStats.mdf,
                    6: spirit.currentStats.agi,
                    7: spirit.currentStats.luk
                };
            }
        }
    };
    
    // Track normal attacks to gain learning points
    const _Game_Action_apply = Game_Action.prototype.apply;
    Game_Action.prototype.apply = function(target) {
        _Game_Action_apply.call(this, target);
        
        // Check if this is a normal attack by actor 1 with blade seed bound
        if (this.subject().isActor() && this.subject().actorId() === 1) {
            if ($gameSystem._bladeSeed && $gameSystem._bladeSeed.bound) {
                if (this.isAttack() && !this.isSkill()) {
                    // Add 1 learning point for normal attacks
                    $gameSystem._bladeSeed.learningPoints = ($gameSystem._bladeSeed.learningPoints || 0) + 1;
                }
            }
        }
    };
    
    // Equipment lock system - using custom sealed slots approach
    const _Game_Actor_isEquipChangeOk = Game_Actor.prototype.isEquipChangeOk;
    Game_Actor.prototype.isEquipChangeOk = function(slotId) {
        if (this._sealedSlots && this._sealedSlots[slotId]) {
            return false;
        }
        return _Game_Actor_isEquipChangeOk.call(this, slotId);
    };
    
    // Initialize on game load
    const _DataManager_createGameObjects = DataManager.createGameObjects;
    DataManager.createGameObjects = function() {
        _DataManager_createGameObjects.call(this);
        initializeBladeSeedData();
    };
    
    const _DataManager_makeSaveContents = DataManager.makeSaveContents;
    DataManager.makeSaveContents = function() {
        const contents = _DataManager_makeSaveContents.call(this);
        contents.bladeSeed = $gameSystem._bladeSeed;
        return contents;
    };
    
    const _DataManager_extractSaveContents = DataManager.extractSaveContents;
    DataManager.extractSaveContents = function(contents) {
        _DataManager_extractSaveContents.call(this, contents);
        $gameSystem._bladeSeed = contents.bladeSeed || null;
        
        // Initialize if data doesn't exist
        initializeBladeSeedData();
        
        // Reconstruct spirit methods if spirit exists
        if ($gameSystem._bladeSeed && $gameSystem._bladeSeed.spirit) {
            Object.setPrototypeOf($gameSystem._bladeSeed.spirit, SpiritCompanion.prototype);
        }
    };
})();
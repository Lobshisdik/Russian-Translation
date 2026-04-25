/*:
 * @target MZ
 * @plugindesc Procedural Tech Tree v1.0.0
 * @author Omni-Lex
 * @url https://nocoldiz.itch.io/hypernet-explorer
 * @help
 * ============================================================================
 * Procedural Tech Tree Plugin
 * ============================================================================
 * 
 * This plugin creates a procedural tech tree with 12 discoverable technologies.
 * Each technology requires specific materials and time to complete.
 * 
 * Plugin Commands:
 * - Open Tech Tree: Opens the tech tree interface
 * - Generate New Tree: Generates a new random tech tree
 * 
 * @command openTechTree
 * @text Open Tech Tree
 * @desc Opens the tech tree interface
 * 
 * @command generateNewTree
 * @text Generate New Tree
 * @desc Generates a new random tech tree (warning: resets progress)
 * 
 * @param baseExpReward
 * @text Base EXP Reward
 * @desc Base EXP reward for completing tech (multiplied by tier)
 * @type number
 * @default 500
 * 
 * @param baseGoldReward
 * @text Base Gold Reward
 * @desc Base gold reward for completing tech (multiplied by tier)
 * @type number
 * @default 1000
 */

(() => {
    'use strict';
    
    const pluginName = 'ProceduralTechTree';
    const parameters = PluginManager.parameters(pluginName);
    
    // Tech tree configuration
    const TECH_CONFIG = {
        baseExpReward: Number(parameters.baseExpReward) || 500,
        baseGoldReward: Number(parameters.baseGoldReward) || 1000,
        maxTechs: 12,
        tiers: 3, // 4 techs per tier
        baseTime: 3600, // 1 hour in seconds
        maxTime: 604800, // 7 days in seconds
    };
    
    // Material categories
    const MATERIAL_CATEGORIES = {
        metals: [565, 566, 567], // Steel, Titanium, Varlenia
        mystical: [568, 579, 580], // Crystal, Arcane Essence, Ethereal Shard
        organic: [570, 571, 572, 573, 574, 575], // Wood, Leather, Cloth, Bone, Meat, Plant
        alchemical: [576, 577, 578], // Herb extract, Oil, Acidic Solution
        tech: [581, 582, 583, 584], // Quantum Core, Circuit Board, Microchip, Battery
        synthetic: [569, 585, 586, 587], // Glass, Plastic, Composite, Nanotube
    };
    
    // Tech name components
    const TECH_PREFIXES = [
        "Theory of", "Mastery of", "Discovery of", "Essence of", "Principles of",
        "Art of", "Science of", "Understanding of", "Awakening of", "Evolution of"
    ];
    
    const TECH_THEMES = {
        physical: ["Strength", "Endurance", "Vitality", "Resilience", "Fortitude"],
        mental: ["Wisdom", "Intelligence", "Focus", "Clarity", "Insight"],
        magical: ["Aether", "Mana", "Arcana", "Mysticism", "Enchantment"],
        spiritual: ["Spirit", "Soul", "Harmony", "Balance", "Transcendence"],
        technological: ["Automation", "Synthesis", "Integration", "Optimization", "Innovation"],
        elemental: ["Fire", "Water", "Earth", "Wind", "Lightning", "Ice"],
    };
    
    const TECH_SUFFIXES = [
        "Manipulation", "Control", "Enhancement", "Amplification", "Convergence",
        "Transmutation", "Cultivation", "Resonance", "Infusion", "Manifestation"
    ];
    
    // Stat buff types
    const STAT_BUFFS = ['mhp', 'mmp', 'atk', 'def', 'mat', 'mdf', 'agi', 'luk'];
    
    class TechTree {
        constructor() {
            this.technologies = [];
            this.completed = [];
            this.inProgress = null;
            this.lastSaveTime = Date.now();
            this.initialize();
        }
        
        initialize() {
            this.load();
            if (this.technologies.length === 0) {
                this.generate();
            }
            this.updateProgress();
        }
        
        generate() {
            this.technologies = [];
            const usedNames = new Set();
            
            for (let tier = 0; tier < TECH_CONFIG.tiers; tier++) {
                for (let i = 0; i < 4; i++) {
                    let tech = this.generateTech(tier, usedNames);
                    this.technologies.push(tech);
                }
            }
            
            this.save();
        }
        
        generateTech(tier, usedNames) {
            let name, attempts = 0;
            do {
                name = this.generateTechName();
                attempts++;
            } while (usedNames.has(name) && attempts < 100);
            
            usedNames.add(name);
            
            const tech = {
                id: this.technologies.length,
                name: name,
                description: this.generateDescription(name, tier),
                tier: tier,
                requirements: this.generateRequirements(tier),
                time: this.calculateTime(tier),
                rewards: this.generateRewards(tier),
                buffs: this.generateBuffs(tier),
                completed: false,
                progress: 0,
                startTime: null
            };
            
            return tech;
        }
        
        generateTechName() {
            const prefix = TECH_PREFIXES[Math.floor(Math.random() * TECH_PREFIXES.length)];
            const themeKeys = Object.keys(TECH_THEMES);
            const themeKey = themeKeys[Math.floor(Math.random() * themeKeys.length)];
            const theme = TECH_THEMES[themeKey][Math.floor(Math.random() * TECH_THEMES[themeKey].length)];
            const suffix = TECH_SUFFIXES[Math.floor(Math.random() * TECH_SUFFIXES.length)];
            
            return `${prefix} ${theme} ${suffix}`;
        }
        
        generateDescription(name, tier) {
            const descriptions = [
                `A ${tier === 0 ? 'fundamental' : tier === 1 ? 'advanced' : 'masterful'} understanding that unlocks new potential.`,
                `Through dedication and research, gain insight into the mysteries of ${name.split(' ').slice(-2).join(' ')}.`,
                `Discover the hidden connections between mind, body, and ${name.includes('Spirit') || name.includes('Soul') ? 'spirit' : 'matter'}.`,
                `${tier === 2 ? 'The pinnacle of' : 'An important milestone in'} your journey toward mastery.`
            ];
            
            return descriptions[Math.floor(Math.random() * descriptions.length)];
        }
        
        generateRequirements(tier) {
            const requirements = [];
            const numMaterials = 2 + tier; // 2-4 materials based on tier
            const quantities = [3 + tier * 2, 5 + tier * 3, 8 + tier * 4]; // Increasing quantities
            
            // Select material categories based on tech theme
            const categoryKeys = Object.keys(MATERIAL_CATEGORIES);
            const selectedCategories = [];
            
            for (let i = 0; i < Math.min(numMaterials, categoryKeys.length); i++) {
                let category;
                do {
                    category = categoryKeys[Math.floor(Math.random() * categoryKeys.length)];
                } while (selectedCategories.includes(category));
                selectedCategories.push(category);
            }
            
            // Pick specific materials from selected categories
            selectedCategories.forEach((category, index) => {
                const materials = MATERIAL_CATEGORIES[category];
                const material = materials[Math.floor(Math.random() * materials.length)];
                const quantity = quantities[Math.min(index, quantities.length - 1)];
                
                requirements.push({
                    itemId: material,
                    quantity: quantity,
                    baseQuantity: quantity
                });
            });
            
            return requirements;
        }
        
        calculateTime(tier) {
            // Tier 0: 1-6 hours, Tier 1: 6-24 hours, Tier 2: 1-7 days
            const minTime = TECH_CONFIG.baseTime * Math.pow(4, tier);
            const maxTime = minTime * 6;
            return Math.floor(minTime + Math.random() * (maxTime - minTime));
        }
        
        generateRewards(tier) {
            return {
                exp: TECH_CONFIG.baseExpReward * (tier + 1) * (1.5 + Math.random()),
                gold: TECH_CONFIG.baseGoldReward * (tier + 1) * (1.5 + Math.random())
            };
        }
        
        generateBuffs(tier) {
            const buffs = {};
            const numBuffs = 2 + tier; // 2-4 buffs based on tier
            const selectedStats = [];
            
            for (let i = 0; i < numBuffs; i++) {
                let stat;
                do {
                    stat = STAT_BUFFS[Math.floor(Math.random() * STAT_BUFFS.length)];
                } while (selectedStats.includes(stat));
                
                selectedStats.push(stat);
                
                // Buff values increase with tier
                let value;
                if (stat === 'mhp' || stat === 'mmp') {
                    value = (50 + tier * 50) * (1 + Math.random());
                } else {
                    value = (5 + tier * 5) * (1 + Math.random());
                }
                
                buffs[stat] = Math.floor(value);
            }
            
            return buffs;
        }
        
        getCurrentTier() {
            // Find the lowest incomplete tier
            for (let tier = 0; tier < TECH_CONFIG.tiers; tier++) {
                const tierStart = tier * 4;
                const tierEnd = tierStart + 4;
                
                for (let i = tierStart; i < tierEnd; i++) {
                    if (!this.technologies[i].completed) {
                        return tier;
                    }
                }
            }
            
            // All tiers completed, show the highest tier
            return TECH_CONFIG.tiers - 1;
        }
        
        getCurrentTierTechs() {
            const currentTier = this.getCurrentTier();
            const tierStart = currentTier * 4;
            const tierEnd = tierStart + 4;
            return this.technologies.slice(tierStart, tierEnd);
        }
        
        canStartTech(techId) {
            const tech = this.technologies[techId];
            if (!tech || tech.completed || this.inProgress !== null) return false;
            
            // Check tier requirements (must complete previous tier)
            if (tech.tier > 0) {
                const previousTierStart = (tech.tier - 1) * 4;
                const previousTierEnd = previousTierStart + 4;
                
                for (let i = previousTierStart; i < previousTierEnd; i++) {
                    if (!this.technologies[i].completed) return false;
                }
            }
            
            return true;
        }
        
        hasRequiredMaterials(tech) {
            for (const req of tech.requirements) {
                const currentQuantity = this.calculateCurrentRequirement(req, tech.progress);
                if ($gameParty.numItems($dataItems[req.itemId]) < currentQuantity) {
                    return false;
                }
            }
            return true;
        }
        
        calculateCurrentRequirement(requirement, progress) {
            // Reduce material cost based on progress (min 1)
            const reduction = 1 - (progress / 100) * 0.75; // Up to 75% reduction
            return Math.max(1, Math.floor(requirement.baseQuantity * reduction));
        }
        
        startTech(techId) {
            if (!this.canStartTech(techId)) return false;
            
            const tech = this.technologies[techId];
            
            // Check if has materials for instant completion
            if (this.hasRequiredMaterials(tech)) {
                // Consume materials
                for (const req of tech.requirements) {
                    const quantity = this.calculateCurrentRequirement(req, tech.progress);
                    $gameParty.loseItem($dataItems[req.itemId], quantity);
                }
                
                // Complete instantly
                this.completeTech(techId);
                return true;
            } else {
                // Start timed progression
                this.inProgress = techId;
                tech.startTime = Date.now();
                this.save();
                return true;
            }
        }
        
        updateProgress() {
            if (this.inProgress === null) return;
            
            const tech = this.technologies[this.inProgress];
            if (!tech || tech.completed) {
                this.inProgress = null;
                return;
            }
            
            const now = Date.now();
            const elapsed = (now - tech.startTime) / 1000; // Convert to seconds
            tech.progress = Math.min(100, (elapsed / tech.time) * 100);
            
            if (tech.progress >= 100) {
                this.completeTech(this.inProgress);
            }
            
            this.save();
        }
        
        completeTech(techId) {
            const tech = this.technologies[techId];
            if (!tech || tech.completed) return;
            
            tech.completed = true;
            tech.progress = 100;
            this.completed.push(techId);
            
            // Apply rewards
            $gameParty.gainGold(Math.floor(tech.rewards.gold));
            $gameActors.actor(1).gainExp(Math.floor(tech.rewards.exp));
            
            // Apply permanent buffs
            for (const [stat, value] of Object.entries(tech.buffs)) {
                $gameActors.actor(1).addParam(STAT_BUFFS.indexOf(stat), value);
            }
            
            // Show completion message
            $gameMessage.add(`\\C[3]Technology Discovered!\\C[0]`);
            $gameMessage.add(`${tech.name}`);
            $gameMessage.add(`\\C[6]Rewards:\\C[0] ${Math.floor(tech.rewards.exp)} EXP, ${Math.floor(tech.rewards.gold)} Gold`);
            
            if (this.inProgress === techId) {
                this.inProgress = null;
            }
            
            this.save();
        }
        
        save() {
            const saveData = {
                technologies: this.technologies,
                completed: this.completed,
                inProgress: this.inProgress,
                lastSaveTime: Date.now()
            };
            
            $gameSystem.techTreeData = saveData;
        }
        
        load() {
            const saveData = $gameSystem.techTreeData;
            if (saveData) {
                this.technologies = saveData.technologies || [];
                this.completed = saveData.completed || [];
                this.inProgress = saveData.inProgress;
                this.lastSaveTime = saveData.lastSaveTime || Date.now();
                
                // Calculate offline progress
                if (this.inProgress !== null) {
                    const tech = this.technologies[this.inProgress];
                    if (tech && !tech.completed) {
                        const now = Date.now();
                        const offlineTime = (now - this.lastSaveTime) / 1000;
                        const totalElapsed = ((now - tech.startTime) / 1000);
                        tech.progress = Math.min(100, (totalElapsed / tech.time) * 100);
                        
                        if (tech.progress >= 100) {
                            this.completeTech(this.inProgress);
                        }
                    }
                }
            }
        }
    }
    
    // Window for displaying tech tree
    class Window_TechTree extends Window_Selectable {
        constructor(rect) {
            super(rect);
            this.techTree = new TechTree();
            this.currentTierTechs = [];
            this.refresh();
        }
        
        maxItems() {
            return this.currentTierTechs.length;
        }
        
        itemHeight() {
            return 180; // Increased height to accommodate ingredients list
        }
        
        refresh() {
            this.currentTierTechs = this.techTree.getCurrentTierTechs();
            super.refresh();
        }
        
        drawItem(index) {
            const tech = this.currentTierTechs[index];
            const rect = this.itemRect(index);
            
            // Draw background based on status
            if (tech.completed) {
                const color = ColorManager.itemBackColor1();
                this.contents.paintOpacity = 64;
                this.contents.fillRect(rect.x, rect.y, rect.width, rect.height, color);
                this.contents.paintOpacity = 255;
            } else if (this.techTree.inProgress === tech.id) {
                const color = ColorManager.pendingColor();
                this.contents.paintOpacity = 64;
                this.contents.fillRect(rect.x, rect.y, rect.width, rect.height, color);
                this.contents.paintOpacity = 255;
            } else if (!this.techTree.canStartTech(tech.id)) {
                const color = ColorManager.itemBackColor2();
                this.contents.paintOpacity = 128;
                this.contents.fillRect(rect.x, rect.y, rect.width, rect.height, color);
                this.contents.paintOpacity = 255;
            }
            
            // Draw tier indicator
            this.changeTextColor(ColorManager.systemColor());
            this.drawText(`Tier ${tech.tier + 1}`, rect.x, rect.y, rect.width, 'right');
            
            // Draw name
            this.changeTextColor(tech.completed ? ColorManager.powerUpColor() : ColorManager.normalColor());
            this.drawText(tech.name, rect.x + 10, rect.y, rect.width - 20);
            
            // Draw description
            this.changeTextColor(ColorManager.normalColor());
            this.contents.fontSize = 20;
            this.drawTextEx(tech.description, rect.x + 10, rect.y + 30, rect.width - 20);
            this.contents.fontSize = 26;
            
            // Draw progress bar if in progress
            if (this.techTree.inProgress === tech.id && !tech.completed) {
                const barY = rect.y + 65;
                const barWidth = rect.width - 40;
                const fillWidth = barWidth * (tech.progress / 100);
                
                this.contents.fillRect(rect.x + 20, barY, barWidth, 8, ColorManager.gaugeBackColor());
                this.contents.fillRect(rect.x + 20, barY, fillWidth, 8, ColorManager.powerUpColor());
                
                // Draw time remaining
                const remaining = tech.time * (1 - tech.progress / 100);
                const timeStr = this.formatTime(remaining);
                this.contents.fontSize = 18;
                this.drawText(`Time: ${timeStr}`, rect.x + 20, barY + 10, barWidth, 'center');
                this.contents.fontSize = 26;
            }
            
            // Draw requirements (moved below description)
            if (!tech.completed) {
                let reqY = rect.y + 90;
                this.contents.fontSize = 20;
                this.changeTextColor(ColorManager.systemColor());
                this.drawText('Requirements:', rect.x + 10, reqY, rect.width);
                reqY += 25;
                
                // Draw each requirement on its own line
                tech.requirements.forEach((req, i) => {
                    const item = $dataItems[req.itemId];
                    const currentQty = this.techTree.calculateCurrentRequirement(req, tech.progress);
                    const hasQty = $gameParty.numItems(item);
                    const hasItem = hasQty >= currentQty;
                    
                    this.changeTextColor(hasItem ? ColorManager.normalColor() : ColorManager.deathColor());
                    this.drawText(`• ${item.name}: ${hasQty}/${currentQty}`, rect.x + 20, reqY + (i * 20), rect.width - 30);
                });
                this.contents.fontSize = 26;
            }
        }
        
        formatTime(seconds) {
            if (seconds < 3600) {
                return `${Math.floor(seconds / 60)}m`;
            } else if (seconds < 86400) {
                return `${Math.floor(seconds / 3600)}h ${Math.floor((seconds % 3600) / 60)}m`;
            } else {
                return `${Math.floor(seconds / 86400)}d ${Math.floor((seconds % 86400) / 3600)}h`;
            }
        }
        
        isCurrentItemEnabled() {
            if (this.index() < 0 || this.index() >= this.currentTierTechs.length) return false;
            const tech = this.currentTierTechs[this.index()];
            return this.techTree.canStartTech(tech.id);
        }
        
        playOkSound() {
            if (this.isCurrentItemEnabled()) {
                super.playOkSound();
            } else {
                SoundManager.playBuzzer();
            }
        }
        
        processOk() {
            if (this.isCurrentItemEnabled()) {
                const tech = this.currentTierTechs[this.index()];
                const success = this.techTree.startTech(tech.id);
                if (success) {
                    SoundManager.playOk();
                    this.refresh();
                } else {
                    SoundManager.playBuzzer();
                }
            }
        }
        
        update() {
            super.update();
            if (Graphics.frameCount % 60 === 0) { // Update every second
                const oldTier = this.techTree.getCurrentTier();
                this.techTree.updateProgress();
                const newTier = this.techTree.getCurrentTier();
                
                // Refresh if tier changed or every second for progress updates
                if (oldTier !== newTier) {
                    this.refresh();
                    this.select(0); // Reset selection when tier changes
                } else {
                    this.refresh();
                }
            }
        }
    }
    
    // Scene for tech tree
    class Scene_TechTree extends Scene_MenuBase {
        create() {
            super.create();
            this.createHelpWindow();
            this.createTechTreeWindow();
            this.createCommandWindow();
        }
        
        createHelpWindow() {
            const rect = this.helpWindowRect();
            this._helpWindow = new Window_Help(rect);
            const currentTier = this._techTreeWindow ? this._techTreeWindow.techTree.getCurrentTier() + 1 : 1;
            this._helpWindow.setText(`Tech Tree - Tier ${currentTier}. Select a technology to research. Complete all techs to unlock the next tier.`);
            this.addWindow(this._helpWindow);
        }
        
        helpWindowRect() {
            const wx = 0;
            const wy = 0;
            const ww = Graphics.boxWidth;
            const wh = this.calcWindowHeight(2, false);
            return new Rectangle(wx, wy, ww, wh);
        }
        
        createTechTreeWindow() {
            const rect = this.techTreeWindowRect();
            this._techTreeWindow = new Window_TechTree(rect);
            this._techTreeWindow.setHandler('cancel', this.popScene.bind(this));
            this.addWindow(this._techTreeWindow);
        }
        
        techTreeWindowRect() {
            const wx = 0;
            const wy = this._helpWindow.y + this._helpWindow.height;
            const ww = Graphics.boxWidth;
            const wh = Graphics.boxHeight - wy - this.calcWindowHeight(1, true);
            return new Rectangle(wx, wy, ww, wh);
        }
        
        createCommandWindow() {
            const rect = this.commandWindowRect();
            this._commandWindow = new Window_HorzCommand(rect);
            this._commandWindow.deactivate();
            this._commandWindow.visible = false;
            this.addWindow(this._commandWindow);
        }
        
        commandWindowRect() {
            const wx = 0;
            const wy = Graphics.boxHeight - this.calcWindowHeight(1, true);
            const ww = Graphics.boxWidth;
            const wh = this.calcWindowHeight(1, true);
            return new Rectangle(wx, wy, ww, wh);
        }
        
        update() {
            super.update();
            // Update help window text when tier changes
            if (this._techTreeWindow && Graphics.frameCount % 60 === 0) {
                const currentTier = this._techTreeWindow.techTree.getCurrentTier() + 1;
                this._helpWindow.setText(`Tech Tree - Tier ${currentTier}. Select a technology to research. Complete all techs to unlock the next tier.`);
            }
        }
    }
    
    // Plugin commands
    PluginManager.registerCommand(pluginName, 'openTechTree', args => {
        SceneManager.push(Scene_TechTree);
    });
    
    PluginManager.registerCommand(pluginName, 'generateNewTree', args => {
        if ($gameSystem.techTreeData) {
            $gameSystem.techTreeData = null;
            const tree = new TechTree();
            tree.generate();
            $gameMessage.add('\\C[3]New tech tree generated!\\C[0]');
        }
    });
    
    // Save/Load integration
    const _Game_System_initialize = Game_System.prototype.initialize;
    Game_System.prototype.initialize = function() {
        _Game_System_initialize.call(this);
        this.techTreeData = null;
    };
    
    // Add permanent stat modifications
    const _Game_Actor_paramBase = Game_Actor.prototype.paramBase;
    Game_Actor.prototype.paramBase = function(paramId) {
        let value = _Game_Actor_paramBase.call(this, paramId);
        if (this._permanentParamBonus && this._permanentParamBonus[paramId]) {
            value += this._permanentParamBonus[paramId];
        }
        return value;
    };
    
    Game_Actor.prototype.addParam = function(paramId, value) {
        if (!this._permanentParamBonus) {
            this._permanentParamBonus = {};
        }
        if (!this._permanentParamBonus[paramId]) {
            this._permanentParamBonus[paramId] = 0;
        }
        this._permanentParamBonus[paramId] += value;
        this.refresh();
    };
})();
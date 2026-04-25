/*:
 * @target MZ
 * @plugindesc v3.0.0 Unified skill encyclopedia with training, progression, and fusion system.
 * @author Omni-Lex
 *
 * @param Variable ID
 * @desc ID of the variable to store the selected skill ID
 * @type variable
 * @default 1
 *
 * @param Encyclopedia Command
 * @desc Command name for the skill system in the menu
 * @type string
 * @default Skill Master
 *
 * @param Add to Menu
 * @desc Add the skill system to the main menu?
 * @type boolean
 * @on Yes
 * @off No
 * @default true
 *
 * @param Battle Progress Points
 * @desc Points gained after winning a battle with the skill selected
 * @type number
 * @min 1
 * @default 3
 *
 * @command openSkillEncyclopedia
 * @desc Opens the unified skill encyclopedia interface.
 *
 * @command openWithSkill
 * @text Open With Skill
 * @desc Opens the encyclopedia and highlights a specific skill
 * @arg skillId
 * @type skill
 * @text Skill
 * @desc The skill to highlight in the encyclopedia
 *
 * @command increaseSkillProgress
 * @desc Manually increases the progress of the currently selected skill.
 * @arg amount
 * @type number
 * @text Amount
 * @desc The amount of progress to add
 * @default 1
 * @min 1
 *
 * @help
 * ============================================================================
 * Skill Master v3.0 - Unified Encyclopedia Interface
 * ============================================================================
 *
 * This plugin provides a comprehensive skill management system with:
 * - Browse all skills organized by category (grid view)
 * - Select skills for training per party member
 * - Track progression individually per actor
 * - Fuse compatible skills to create new ones
 * - Actor-specific category bonuses
 *
 * ============================================================================
 * Actor Bonuses
 * ============================================================================
 *
 * For Actor 1, you can define Primary and Secondary skill categories in
 * their CLASS notebox (not actor notebox). Skills from these categories
 * will gain progression points at an accelerated rate.
 *
 * Add these tags to Actor 1's CLASS note field:
 * <Primary: CategoryName1, CategoryName2>
 * <Secondary: CategoryName3, CategoryName4>
 *
 * - Primary categories get a 3x multiplier on progression points.
 * - Secondary categories get a 1.5x multiplier on progression points.
 *
 * ============================================================================
 * Skill Categorization
 * ============================================================================
 *
 * To categorize skills, add a category tag to skill notes:
 * <category:EnhancementMagic>
 *
 * ============================================================================
 * Skill Progression
 * ============================================================================
 *
 * Select a skill in the encyclopedia to track its progression per actor.
 * Each party member can train a different skill simultaneously.
 * Progress is gained by:
 * 1. Winning battles (3 points per battle, per actor)
 * 2. Using skills from the same category in battle (2 points per use)
 * 3. Using the increaseSkillProgress plugin command
 *
 * ============================================================================
 * Skill Fusion
 * ============================================================================
 *
 * Skill fusions are hardcoded in the plugin file. The format for each
 * fusion is: SkillA ID, SkillB ID, Result Skill ID
 *
 * Fusion is accessible directly from the skill detail view when viewing
 * a skill that can be used in fusion recipes.
 *
 * ============================================================================
*/

(() => {
    'use strict';

    const pluginName = "SkillMaster";

    // Plugin parameters
    const parameters = PluginManager.parameters(pluginName);
    const variableId = Number(parameters['Variable ID'] || 1);
    const encyclopediaCommand = String(parameters['Encyclopedia Command'] || 'Skill Master');
    const addToMenu = parameters['Add to Menu'] !== 'false';
    const battleProgressPoints = Number(parameters['Battle Progress Points'] || 3);
    const tr = (en, it) => ConfigManager.language === "it" ? it : en;

    // Italian translations for category names
    const ITALIAN_TRANSLATIONS = {
        'Aeromancy': 'Aeromanzia',
        'AntiMagic': 'Anti-Magia',
        'Arcanism': 'Arcanismo',
        'AstralMagic': 'Magia Astrale',
        'Basic': 'Base',
        'Bestial': 'Bestiale',
        'Boxing': 'Pugilato',
        'CEO': 'CEO',
        'ChaosMagic': 'Magia del Caos',
        'ChemicalArts': 'Arti Chimiche',
        'Chronomancy': 'Cronomazia',
        'Convokation': 'Convocazione',
        'Cooking': 'Cucina',
        'CosmicMagic': 'Magia Cosmica',
        'Cryomancy': 'Criomanzia',
        'VoidMagic': 'Magia del Vuoto',
        'Divination': 'Divinazione',
        'Divine': 'Divino',
        'Electromancy': 'Elettromanzia',
        'EnhancementMagic': 'Magia di Potenziamento',
        'Firefighting': 'Vigili del Fuoco',
        'ForbiddenMagic': 'Magia Proibita',
        'Geomancy': 'Geomanzia',
        'HolyMagic': 'Magia Sacra',
        'Firearms': 'Armi da Fuoco',
        'Hydromancy': 'Idromanzia',
        'Idromancy': 'Idromanzia',
        'Journalism': 'Giornalismo',
        'LawEnforcement': 'Forze dell\'Ordine',
        'Leadership': 'Leadership',
        'MartialArts': 'Arti Marziali',
        'MinorMagic': 'Magia Minore',
        'Natural': 'Naturale',
        'Performance': 'Performance',
        'PlantMagic': 'Magia delle Piante',
        'PsychicAbilities': 'Abilità Psichiche',
        'Pyromancy': 'Piromanzia',
        'Roguery': 'Furfanteria',
        'SelfDestructive': 'Autodistruttivo',
        'StatusMagic': 'Magia di Status',
        'Swordsmanship': 'Arte della Spada',
        'Technomancy': 'Tecnomanzia',
        'TerrorMagic': 'Magia del Terrore',
        'Training': 'Allenamento',
        'Uncategorized': 'Non Categorizzato',
        'UnholyMagic': 'Magia Empia',
        'Wrestling': 'Lotta',
        'General': 'Generale',
        'All': 'Tutti'
    };

    // Category icon mapping
    const CATEGORY_ICONS = {
        'Aeromancy': 69,
        'AntiMagic': 75,
        'Arcanism': 133,
        'AstralMagic': 87,
        'Basic': 96,
        'Bestial': 293,
        'Boxing': 106,
        'CEO': 248,
        'ChaosMagic': 75,
        'ChemicalArts': 180,
        'Chronomancy': 159,
        'Convokation': 79,
        'Cooking': 219,
        'CosmicMagic': 87,
        'Cryomancy': 65,
        'VoidMagic': 241,
        'Divination': 408,
        'Divine': 243,
        'Electromancy': 66,
        'EnhancementMagic': 73,
        'Firefighting': 347,
        'ForbiddenMagic': 191,
        'Geomancy': 68,
        'HolyMagic': 70,
        'Firearms': 104,
        'Hydromancy': 67,
        'Idromancy': 67,
        'Journalism': 234,
        'LawEnforcement': 131,
        'Leadership': 246,
        'MartialArts': 77,
        'MinorMagic': 88,
        'Natural': 276,
        'Performance': 199,
        'PlantMagic': 276,
        'PsychicAbilities': 247,
        'Pyromancy': 64,
        'Roguery': 336,
        'SelfDestructive': 85,
        'StatusMagic': 74,
        'Swordsmanship': 97,
        'Technomancy': 99,
        'TerrorMagic': 190,
        'Training': 230,
        'Uncategorized': 245,
        'UnholyMagic': 179,
        'Wrestling': 77,
        'General': 245,
        'All': 160
    };

    function uncamelCase(str) {
        // "ChemicalArts" → "Chemical arts", "CEO" stays "CEO"
        return str
            .replace(/([a-z])([A-Z])/g, '$1 $2')
            .replace(/([A-Z]+)([A-Z][a-z])/g, '$1 $2')
            .replace(/ (.)/g, (_, c) => ' ' + c.toLowerCase());
    }

    function getCategoryDisplayName(categoryName) {
        const isItalian = ConfigManager.language === 'it';
        if (isItalian && ITALIAN_TRANSLATIONS[categoryName]) {
            return ITALIAN_TRANSLATIONS[categoryName];
        }
        return uncamelCase(categoryName);
    }

    function getCategoryIcon(categoryName) {
        return CATEGORY_ICONS[categoryName] || 245;
    }

    function getSkillCategory(skillId) {
        if (!skillId) return null;
        const skill = $dataSkills[skillId];
        if (!skill) return null;
        const match = skill.note.match(/<category:\s*(.+?)\s*>/i);
        return match ? match[1].trim() : null;
    }

    const actorCategoryManager = {
        _primary: [],
        _secondary: [],
        _initialized: false,

        initialize: function() {
            if (this._initialized || typeof $dataActors === 'undefined' || !$dataActors || typeof $dataClasses === 'undefined' || !$dataClasses) return;

            const actor1 = $dataActors[1];
            if (!actor1) return;

            const actorClass = $dataClasses[actor1.classId];
            if (!actorClass) return;

            const note = actorClass.note;

            const primaryMatch = note.match(/<Primary:\s*(.+?)>/i);
            const secondaryMatch = note.match(/<Secondary:\s*(.+?)>/i);

            if (primaryMatch) {
                this._primary = primaryMatch[1].split(',').map(cat => cat.trim());
            }
            if (secondaryMatch) {
                this._secondary = secondaryMatch[1].split(',').map(cat => cat.trim());
            }
            this._initialized = true;
        },

        isPrimary: function(category) {
            if (!this._initialized) this.initialize();
            return this._primary.includes(category);
        },

        isSecondary: function(category) {
            if (!this._initialized) this.initialize();
            return this._secondary.includes(category);
        },

        getMultiplier: function(skillId) {
            if (!this._initialized) this.initialize();

            const category = getSkillCategory(skillId);
            if (!category) return 1;

            if (this.isPrimary(category)) {
                return 3;
            }
            if (this.isSecondary(category)) {
                return 1.5;
            }
            return 1;
        }
    };

    // Hardcoded fusion recipes
    const fusionRecipes = [
        { skillA: 4, skillB: 6, result: 52 }, { skillA: 7, skillB: 113, result: 310 }, { skillA: 46, skillB: 50, result: 218 },
        { skillA: 48, skillB: 78, result: 359 }, { skillA: 44, skillB: 63, result: 68 }, { skillA: 56, skillB: 129, result: 192 },
        { skillA: 53, skillB: 47, result: 60 }, { skillA: 61, skillB: 181, result: 219 }, { skillA: 4, skillB: 6, result: 52 },
        { skillA: 7, skillB: 113, result: 310 }, { skillA: 12, skillB: 13, result: 64 }, { skillA: 13, skillB: 14, result: 46 },
        { skillA: 17, skillB: 18, result: 78 }, { skillA: 19, skillB: 20, result: 44 }, { skillA: 21, skillB: 25, result: 56 },
        { skillA: 27, skillB: 30, result: 97 }, { skillA: 32, skillB: 34, result: 432 }, { skillA: 37, skillB: 38, result: 553 },
        { skillA: 42, skillB: 43, result: 49 }, { skillA: 46, skillB: 50, result: 218 }, { skillA: 48, skillB: 78, result: 359 },
        { skillA: 44, skillB: 63, result: 68 }, { skillA: 56, skillB: 129, result: 192 }, { skillA: 53, skillB: 47, result: 60 },
        { skillA: 61, skillB: 181, result: 219 }, { skillA: 54, skillB: 179, result: 291 }, { skillA: 58, skillB: 74, result: 297 },
        { skillA: 79, skillB: 180, result: 345 }, { skillA: 181, skillB: 182, result: 183 }, { skillA: 183, skillB: 184, result: 64 },
        { skillA: 216, skillB: 217, result: 218 }, { skillA: 42, skillB: 181, result: 182 }, { skillA: 44, skillB: 63, result: 68 },
        { skillA: 101, skillB: 103, result: 186 }, { skillA: 107, skillB: 109, result: 188 }, { skillA: 113, skillB: 114, result: 117 },
        { skillA: 113, skillB: 117, result: 119 }, { skillA: 114, skillB: 115, result: 118 }, { skillA: 121, skillB: 122, result: 125 },
        { skillA: 122, skillB: 123, result: 126 }, { skillA: 129, skillB: 130, result: 133 }, { skillA: 130, skillB: 131, result: 134 },
        { skillA: 137, skillB: 138, result: 140 }, { skillA: 143, skillB: 144, result: 146 }, { skillA: 149, skillB: 150, result: 152 },
        { skillA: 155, skillB: 156, result: 158 }, { skillA: 161, skillB: 162, result: 164 }, { skillA: 167, skillB: 168, result: 170 },
        { skillA: 86, skillB: 87, result: 88 }, { skillA: 88, skillB: 89, result: 330 }, { skillA: 90, skillB: 91, result: 92 },
        { skillA: 92, skillB: 93, result: 94 }, { skillA: 101, skillB: 105, result: 186 }, { skillA: 101, skillB: 186, result: 366 },
        { skillA: 102, skillB: 104, result: 367 }, { skillA: 167, skillB: 168, result: 170 }, { skillA: 169, skillB: 170, result: 171 },
        { skillA: 12, skillB: 20, result: 291 }, { skillA: 13, skillB: 19, result: 44 }, { skillA: 14, skillB: 21, result: 56 },
        { skillA: 16, skillB: 24, result: 47 }, { skillA: 19, skillB: 26, result: 443 }, { skillA: 20, skillB: 43, result: 73 },
        { skillA: 22, skillB: 23, result: 95 }, { skillA: 24, skillB: 54, result: 79 }, { skillA: 25, skillB: 112, result: 483 },
        { skillA: 28, skillB: 30, result: 99 }, { skillA: 31, skillB: 34, result: 432 }, { skillA: 32, skillB: 33, result: 587 },
        { skillA: 35, skillB: 39, result: 146 }, { skillA: 36, skillB: 40, result: 147 }, { skillA: 41, skillB: 42, result: 64 },
        { skillA: 43, skillB: 45, result: 49 }, { skillA: 44, skillB: 49, result: 68 }, { skillA: 47, skillB: 48, result: 60 },
        { skillA: 52, skillB: 53, result: 61 }, { skillA: 54, skillB: 55, result: 69 }, { skillA: 56, skillB: 57, result: 58 },
        { skillA: 59, skillB: 69, result: 74 }, { skillA: 61, skillB: 62, result: 76 }, { skillA: 63, skillB: 67, result: 80 },
        { skillA: 65, skillB: 66, result: 77 }, { skillA: 68, skillB: 70, result: 71 }, { skillA: 72, skillB: 78, result: 316 },
        { skillA: 84, skillB: 85, result: 86 }, { skillA: 87, skillB: 88, result: 89 }, { skillA: 93, skillB: 94, result: 364 },
        { skillA: 95, skillB: 96, result: 97 }, { skillA: 98, skillB: 99, result: 100 }, { skillA: 105, skillB: 107, result: 188 },
        { skillA: 106, skillB: 108, result: 644 }, { skillA: 109, skillB: 110, result: 647 }, { skillA: 111, skillB: 112, result: 315 },
        { skillA: 115, skillB: 117, result: 119 }, { skillA: 123, skillB: 125, result: 127 }, { skillA: 131, skillB: 133, result: 135 },
        { skillA: 140, skillB: 140, result: 141 }, { skillA: 146, skillB: 146, result: 147 }, { skillA: 152, skillB: 152, result: 153 },
        { skillA: 158, skillB: 158, result: 159 }, { skillA: 164, skillB: 164, result: 165 }, { skillA: 170, skillB: 170, result: 171 },
        { skillA: 7, skillB: 113, result: 310 }, { skillA: 12, skillB: 113, result: 115 }, { skillA: 15, skillB: 211, result: 396 },
        { skillA: 17, skillB: 111, result: 314 }, { skillA: 18, skillB: 722, result: 725 }, { skillA: 19, skillB: 625, result: 626 }
    ];

    //=============================================================================
    // Game_System - Shared Knowledge Points
    //=============================================================================

    const _Game_System_initialize = Game_System.prototype.initialize;
    Game_System.prototype.initialize = function() {
        _Game_System_initialize.call(this);
        this._knowledgePoints = 0;
    };

    Game_System.prototype.getKnowledge = function() {
        if (this._knowledgePoints === undefined) this._knowledgePoints = 0;
        return this._knowledgePoints;
    };

    Game_System.prototype.addKnowledge = function(amount) {
        if (this._knowledgePoints === undefined) this._knowledgePoints = 0;
        this._knowledgePoints += amount;
    };

    Game_System.prototype.spendKnowledge = function(amount) {
        if (this._knowledgePoints === undefined) this._knowledgePoints = 0;
        this._knowledgePoints = Math.max(0, this._knowledgePoints - amount);
    };

    // Base cost derived from skill MP/TP cost; Primary = 50% off, Secondary = 25% off
    Game_System.prototype.getSkillKnowledgeCost = function(skillId, actorId) {
        const skill = $dataSkills[skillId];
        if (!skill) return 10;
        const base = Math.max(10, Math.floor((skill.mpCost + skill.tpCost) / 2));
        const category = getSkillCategory(skillId);
        if (category && actorId) {
            if (actorCategoryManager.isPrimary(category)) return Math.max(1, Math.floor(base * 0.5));
            if (actorCategoryManager.isSecondary(category)) return Math.max(1, Math.floor(base * 0.75));
        }
        return base;
    };

    //=============================================================================
    // Utility Functions
    //=============================================================================

    function getAllSkillCategories() {
        const categories = new Set();
        categories.add("All");

        for (const skill of $dataSkills) {
            if (!skill) continue;
            const categoryMatch = skill.note.match(/<category:(.+?)>/i);
            if (categoryMatch) {
                categories.add(categoryMatch[1]);
            }
        }

        return Array.from(categories);
    }

    function getSkillsByCategory(category) {
        const skills = [];

        for (const skill of $dataSkills) {
            if (!skill || !skill.name) continue;

            if (category === "All" || skill.note.match(new RegExp(`<category:${category}>`, 'i'))) {
                skills.push(skill);
            }
        }

        return skills;
    }

    function getAvailableFusions(skillId) {
        const actor = $gameParty.leader();
        if (!actor) return [];

        const fusions = [];

        for (const recipe of fusionRecipes) {
            if (recipe.skillA === skillId || recipe.skillB === skillId) {
                if (!actor.hasSkill(recipe.result)) {
                    const otherSkillId = recipe.skillA === skillId ? recipe.skillB : recipe.skillA;
                    fusions.push({
                        recipe: recipe,
                        hasOtherSkill: actor.hasSkill(otherSkillId),
                        otherSkillId: otherSkillId
                    });
                }
            }
        }

        return fusions;
    }

    //=============================================================================
    // Window_SkillCategory - Grid Layout
    //=============================================================================

    function Window_SkillCategory() {
        this.initialize(...arguments);
    }

    Window_SkillCategory.prototype = Object.create(Window_Command.prototype);
    Window_SkillCategory.prototype.constructor = Window_SkillCategory;

    Window_SkillCategory.prototype.initialize = function(rect) {
        Window_Command.prototype.initialize.call(this, rect);
    };

    Window_SkillCategory.prototype.maxCols = function() {
        return 4;
    };

    Window_SkillCategory.prototype.itemHeight = function() {
        return 110;
    };

    Window_SkillCategory.prototype.makeCommandList = function() {
        actorCategoryManager.initialize();
        const categories = getAllSkillCategories();
        for (const category of categories) {
            let commandName = getCategoryDisplayName(category);
            if (category !== "All") {
                if (actorCategoryManager.isPrimary(category)) {
                    commandName += " (3x)";
                } else if (actorCategoryManager.isSecondary(category)) {
                    commandName += " (1.5x)";
                }
            }
            const icon = getCategoryIcon(category);
            this.addCommand(commandName, 'category', true, { category: category, icon: icon });
        }
    };

    Window_SkillCategory.prototype.drawItem = function(index) {
        const rect = this.itemRect(index);
        const data = this.commandData(index);

        // Highlight category if any party member knows at least one skill from it
        const members = $gameParty.members();
        let isSelectedCategory = false;
        const categorySkills = getSkillsByCategory(data.ext ? data.ext.category : "All");
        for (const actor of members) {
            if (categorySkills.some(s => actor.isLearnedSkill(s.id))) {
                isSelectedCategory = true;
                break;
            }
        }

        const icon = data && data.ext && data.ext.icon ? data.ext.icon : 245;
        const iconSize = ImageManager.iconWidth; // 32
        const iconX = rect.x + Math.floor((rect.width - iconSize) / 2);
        const iconY = rect.y + 18;

        if (isSelectedCategory) {
            this.changeTextColor(ColorManager.textColor(1));
        } else {
            this.resetTextColor();
        }

        this.drawIcon(icon, iconX, iconY);
        this.contents.fontSize = 18;
        this.drawText(data.name, rect.x, rect.y + 18 + iconSize + 10, rect.width, 'center');
        this.contents.fontSize = $gameSystem.mainFontSize();
        this.resetTextColor();
    };

    Window_SkillCategory.prototype.commandData = function(index) {
        return this._list[index];
    };

    Window_SkillCategory.prototype.currentCategory = function() {
        const ext = this.currentExt();
        if (ext && ext.category) {
            return ext.category;
        }
        return this.currentData() ? this.currentData().name : "All";
    };

    //=============================================================================
    // Window_SkillMasterList
    //=============================================================================

    function Window_SkillMasterList() {
        this.initialize(...arguments);
    }

    Window_SkillMasterList.prototype = Object.create(Window_Selectable.prototype);
    Window_SkillMasterList.prototype.constructor = Window_SkillMasterList;

    Window_SkillMasterList.prototype.initialize = function(rect) {
        Window_Selectable.prototype.initialize.call(this, rect);
        this._category = "All";
        this._data = [];
        this.refresh();
    };

    Window_SkillMasterList.prototype.maxCols = function() {
        return 2;
    };

    Window_SkillMasterList.prototype.maxItems = function() {
        return this._data ? this._data.length : 0;
    };

    Window_SkillMasterList.prototype.setCategory = function(category) {
        if (this._category !== category) {
            this._category = category;
            this.refresh();
            this.scrollTo(0, 0);
            this.select(0);
        }
    };

    Window_SkillMasterList.prototype.currentSkill = function() {
        return this._data && this.index() >= 0 ? this._data[this.index()] : null;
    };

    Window_SkillMasterList.prototype.selectSkillById = function(skillId) {
        for (let i = 0; i < this._data.length; i++) {
            if (this._data[i] && this._data[i].id === skillId) {
                this.select(i);
                this.scrollTo(0, Math.max(0, (i - 4) * this.itemHeight()));
                return true;
            }
        }
        return false;
    };

    Window_SkillMasterList.prototype.refresh = function() {
        this._data = getSkillsByCategory(this._category);
        this.createContents();
        this.drawAllItems();
    };

    Window_SkillMasterList.prototype.drawItem = function(index) {
        const skill = this._data[index];
        if (skill) {
            const rect = this.itemLineRect(index);
            // Green if any party member already knows this skill
            const isLearned = $gameParty.members().some(a => a.isLearnedSkill(skill.id));
            if (isLearned) {
                this.changeTextColor(ColorManager.textColor(3));
            } else {
                this.resetTextColor();
            }

            this.drawItemName(skill, rect.x, rect.y, rect.width);
            this.resetTextColor();
        }
    };

    Window_SkillMasterList.prototype.drawItemName = function(skill, x, y, width) {
        if (skill) {
            const iconBoxWidth = ImageManager.iconWidth + 4;
            this.drawIcon(skill.iconIndex, x, y + 2);

            let skillName = skill.name;
            if (skillName.length > 20) {
                skillName = skillName.substring(0, 20) + "...";
            }

            this.drawText(skillName, x + iconBoxWidth, y, width - iconBoxWidth);
        }
    };

    //=============================================================================
    // Window_SkillDetail
    //=============================================================================

    function Window_SkillDetail() {
        this.initialize(...arguments);
    }

    Window_SkillDetail.prototype = Object.create(Window_Selectable.prototype);
    Window_SkillDetail.prototype.constructor = Window_SkillDetail;

    Window_SkillDetail.prototype.initialize = function(rect) {
        Window_Selectable.prototype.initialize.call(this, rect);
        this._skill = null;
        this._showMessage = false;
        this._messageTimer = 0;
        this._messageText = "";
        this._actions = [];
        this.refresh();
    };

    Window_SkillDetail.prototype.maxItems = function() {
        return this._actions.length;
    };

    Window_SkillDetail.prototype.setSkill = function(skill) {
        if (this._skill !== skill) {
            this._skill = skill;
            this._showMessage = false;
            this._messageTimer = 0;
            this.buildActions();
            this.refresh();
            this.select(0);
        }
    };

    Window_SkillDetail.prototype.buildActions = function() {
        this._actions = [];
        if (!this._skill) return;

        const knowledge = $gameSystem.getKnowledge();

        // One "Learn" action per party member who doesn't already know the skill
        for (const actor of $gameParty.members()) {
            const actorId = actor.actorId();
            if (actor.isLearnedSkill(this._skill.id)) continue;
            const cost = $gameSystem.getSkillKnowledgeCost(this._skill.id, actorId);
            const canAfford = knowledge >= cost;
            this._actions.push({
                name: tr(`Teach ${actor.name()} (${cost} KP)`, `Insegna a ${actor.name()} (${cost} KC)`),
                symbol: 'learn',
                enabled: canAfford,
                actorId: actorId,
                cost: cost
            });
        }

        // Fusion options
        const fusions = getAvailableFusions(this._skill.id);
        if (fusions.length > 0) {
            this._actions.push({
                name: tr("View Fusions", "Vedi fusioni"),
                symbol: 'fusion',
                enabled: true,
                fusions: fusions
            });
        }
    };

    Window_SkillDetail.prototype.currentAction = function() {
        return this._actions[this.index()];
    };

    Window_SkillDetail.prototype.showMessage = function(text) {
        this._showMessage = true;
        this._messageText = text;
        this._messageTimer = 120;
        this.refresh();
    };

    Window_SkillDetail.prototype.update = function() {
        Window_Selectable.prototype.update.call(this);

        if (this._showMessage && this._messageTimer > 0) {
            this._messageTimer--;
            if (this._messageTimer === 0) {
                this._showMessage = false;
                this.refresh();
            }
        }
    };

    Window_SkillDetail.prototype.itemRect = function(index) {
        const rect = Window_Selectable.prototype.itemRect.call(this, index);
        const baseY = this.contentsHeight() - (this._actions.length * this.lineHeight()) - 60;
        rect.y = baseY + (index * this.lineHeight());
        return rect;
    };

    Window_SkillDetail.prototype.refresh = function() {
        this.contents.clear();
        if (!this._skill) {
            const text = tr("Select a skill to view details", "Seleziona una skill per vederne i dettagli");
            this.drawText(text, 0, this.contentsHeight() / 2 - this.lineHeight(), this.contentsWidth(), "center");
            return;
        }

        const padding = 20;
        const halfWidth = (this.contentsWidth() - padding * 3) / 2;
        let leftY = padding;
        let rightY = padding;

        // LEFT COLUMN
        this.contents.fontSize = 32;
        this.drawIcon(this._skill.iconIndex || 0, padding, leftY);
        this.drawText(this._skill.name || "Unknown", padding + ImageManager.iconWidth + 8, leftY, halfWidth - ImageManager.iconWidth - 8, "left");
        this.resetFontSize();
        leftY += 42;

        // Show message if any
        if (this._showMessage) {
            this.changeTextColor(ColorManager.textColor(14));
            this.drawText("✓ " + this._messageText, padding, leftY, halfWidth);
            this.resetTextColor();
            leftY += this.lineHeight();
        }

        leftY += 8;
        this.drawHorzLine(leftY, padding, halfWidth);
        leftY += 15;

        // Costs
        this.contents.fontSize = 24;
        if (this._skill.mpCost > 0) {
            this.changeTextColor(ColorManager.systemColor());
            this.drawText(tr("MP:", "PM:"), padding, leftY, 80);
            this.resetTextColor();
            this.drawText(this._skill.mpCost, padding + 80, leftY, halfWidth - 80, "right");
            leftY += this.lineHeight();
        }

        if (this._skill.tpCost > 0) {
            this.changeTextColor(ColorManager.systemColor());
            this.drawText(tr("AP:", "PA:"), padding, leftY, 80);
            this.resetTextColor();
            this.drawText(this._skill.tpCost, padding + 80, leftY, halfWidth - 80, "right");
            leftY += this.lineHeight();
        }
        this.resetFontSize();

        leftY += 10;
        this.drawHorzLine(leftY, padding, halfWidth);
        leftY += 20;

        // Scale
        if (this._skill.damage && this._skill.damage.formula) {
            const isItalian = ConfigManager.language === 'it';
            this.changeTextColor(ColorManager.systemColor());
            this.drawText(isItalian ? "Scala:" : "Scale:", padding, leftY, halfWidth);
            this.resetTextColor();
            leftY += this.lineHeight();

            const scaleText = this.getSimplifiedFormula(this._skill.damage.formula, isItalian);
            this.contents.fontSize = 28;
            this.drawText(scaleText, padding + 20, leftY, halfWidth - 20);
            this.resetFontSize();
            leftY += this.lineHeight() + 10;
        }

        // Effect
        const damageText = this.getDamageTypeText(this._skill);
        if (damageText) {
            this.changeTextColor(ColorManager.systemColor());
            this.drawText(tr("Effect:", "Effetto:"), padding, leftY, halfWidth);
            this.resetTextColor();
            leftY += this.lineHeight();

            const wrappedLines = this.wrapText(damageText, halfWidth - 20);
            for (let i = 0; i < wrappedLines.length; i++) {
                this.drawText(wrappedLines[i], padding + 20, leftY, halfWidth - 20);
                leftY += this.lineHeight();
            }
        }

        // RIGHT COLUMN
        const rightX = padding * 2 + halfWidth;

        // Description
        this.changeTextColor(ColorManager.systemColor());
        this.drawText(tr("Description", "Descrizione"), rightX, rightY, halfWidth);
        this.resetTextColor();
        rightY += this.lineHeight();

        this.drawHorzLine(rightY, rightX, halfWidth);
        rightY += 10;

        let description = this._skill.description || tr("No description", "Nessuna descrizione");
        if (window.translateText) {
            description = window.translateText(description);
        }

        const descSize = this.textSizeEx(description);
        const maxDescHeight = 120;
        const descHeight = Math.min(maxDescHeight, descSize.height + 10);
        this.drawTextEx("\\c[0]" + description, rightX, rightY, halfWidth);
        rightY += descHeight + 10;

        // Knowledge balance
        this.drawHorzLine(rightY, rightX, halfWidth);
        rightY += 10;

        const knowledge = $gameSystem.getKnowledge();
        this.changeTextColor(ColorManager.systemColor());
        this.drawText(tr("Knowledge", "Conoscenza"), rightX, rightY, halfWidth * 0.6);
        this.resetTextColor();
        this.changeTextColor(ColorManager.textColor(knowledge > 0 ? 3 : 7));
        this.contents.fontSize = 22;
        this.drawText(`${knowledge} KP`, rightX + halfWidth * 0.6, rightY, halfWidth * 0.4, 'right');
        this.resetFontSize();
        this.resetTextColor();
        rightY += this.lineHeight() + 6;

        // Per-actor status
        for (const actor of $gameParty.members()) {
            const hasSkill = actor.isLearnedSkill(this._skill.id);
            const cost = $gameSystem.getSkillKnowledgeCost(this._skill.id, actor.actorId());

            this.contents.fontSize = 20;
            if (hasSkill) {
                this.changeTextColor(ColorManager.textColor(3));
                this.drawText(actor.name() + " ✓", rightX, rightY, halfWidth);
            } else {
                this.resetTextColor();
                this.drawText(actor.name(), rightX, rightY, halfWidth * 0.55);
                this.changeTextColor(knowledge >= cost ? ColorManager.textColor(1) : ColorManager.textColor(7));
                this.drawText(`${cost} KP`, rightX + halfWidth * 0.55, rightY, halfWidth * 0.45, 'right');
            }
            this.resetTextColor();
            this.resetFontSize();
            rightY += 24;
        }

        // Draw actions at bottom
        this.drawAllItems();
    };

    Window_SkillDetail.prototype.drawItem = function(index) {
        const action = this._actions[index];
        if (!action) return;

        const rect = this.itemRect(index);
        const isSelected = this.index() === index;

        if (isSelected) {
            this.contents.fillRect(rect.x, rect.y, rect.width, rect.height, ColorManager.itemBackColor1());
        }

        this.resetTextColor();
        if (!action.enabled) {
            this.changeTextColor(ColorManager.dimColor1());
        }

        this.drawText("▶ " + action.name, rect.x + 10, rect.y, rect.width - 10);
        this.resetTextColor();
    };

    Window_SkillDetail.prototype.wrapText = function(text, maxWidth) {
        const words = text.split(' ');
        const lines = [];
        let currentLine = '';

        for (let i = 0; i < words.length; i++) {
            const testLine = currentLine ? currentLine + ' ' + words[i] : words[i];
            const testWidth = this.textWidth(testLine);

            if (testWidth > maxWidth && currentLine) {
                lines.push(currentLine);
                currentLine = words[i];
            } else {
                currentLine = testLine;
            }
        }

        if (currentLine) {
            lines.push(currentLine);
        }

        return lines;
    };

    Window_SkillDetail.prototype.getSimplifiedFormula = function(formula, isItalian) {
        const statNames = {
            'a.atk': isItalian ? 'FRZ' : 'STR',
            'a.def': 'CON',
            'a.agi': isItalian ? 'DES' : 'DEX',
            'a.mat': 'INT',
            'a.mdf': 'SAG',
            'a.luk': 'PSI'
        };

        let mainStat = null;
        let maxMultiplier = 0;

        for (const [stat, name] of Object.entries(statNames)) {
            const regex = new RegExp(stat.replace('.', '\\.') + '\\s*\\*\\s*([\\d.]+)', 'i');
            const match = formula.match(regex);

            if (match) {
                const multiplier = parseFloat(match[1]);
                if (multiplier > maxMultiplier) {
                    maxMultiplier = multiplier;
                    mainStat = name;
                }
            } else if (formula.includes(stat)) {
                if (maxMultiplier === 0) {
                    mainStat = name;
                }
            }
        }

        if (!mainStat) return formula;

        let grade = 'F';
        if (maxMultiplier === 0) {
            grade = 'F';
        } else if (maxMultiplier < 1) {
            grade = 'F';
        } else if (maxMultiplier < 2) {
            grade = 'E';
        } else if (maxMultiplier < 3) {
            grade = 'D';
        } else if (maxMultiplier < 5) {
            grade = 'C';
        } else if (maxMultiplier < 7) {
            grade = 'B';
        } else if (maxMultiplier < 9) {
            grade = 'A';
        } else {
            grade = 'S';
        }

        return `${mainStat} (${grade})`;
    };

    Window_SkillDetail.prototype.getDamageTypeText = function(skill) {
        const isItalian = ConfigManager.language === 'it';
        const damage = skill.damage;
        let text = "";

        if (damage.type === 1) {
            text = isItalian ? "Danno PS" : "HP Damage";
        } else if (damage.type === 2) {
            text = isItalian ? "Danno PM" : "MP Damage";
        } else if (damage.type === 3) {
            text = isItalian ? "Recupero PS" : "HP Recovery";
        } else if (damage.type === 4) {
            text = isItalian ? "Recupero PM" : "MP Recovery";
        } else if (damage.type === 5) {
            text = isItalian ? "Assorbimento PS" : "HP Drain";
        } else if (damage.type === 6) {
            text = isItalian ? "Assorbimento PM" : "MP Drain";
        }

        if (damage.variance > 0 && text) {
            text += ` (±${damage.variance}%)`;
        }

        const effects = skill.effects;
        const buffEffects = effects.filter(e => e.code === 31 || e.code === 32);
        if (buffEffects.length > 0) {
            const buffTexts = buffEffects.map(e => {
                const paramName = TextManager.param(e.dataId);
                const type = e.code === 31 ?
                    (isItalian ? "Potenzia" : "Buff") :
                    (isItalian ? "Riduce" : "Debuff");
                return `${type} ${paramName}`;
            });
            if (text) text += ", ";
            text += buffTexts.join(", ");
        }

        const stateEffects = effects.filter(e => e.code === 21 || e.code === 22);
        if (stateEffects.length > 0) {
            const stateTexts = stateEffects.map(e => {
                const state = $dataStates[e.dataId];
                return `${state ? state.name : (isItalian ? "Stato" : "State")}`;
            });
            if (text) text += ", ";
            text += stateTexts.join(", ");
        }

        return text || (isItalian ? "Nessuno" : "None");
    };

    Window_SkillDetail.prototype.drawHorzLine = function(y, x, width) {
        x = x || 16;
        width = width || (this.contentsWidth() - 32);
        this.contents.paintOpacity = 48;
        this.contents.fillRect(x, y, width, 2, ColorManager.normalColor());
        this.contents.paintOpacity = 255;
    };

    Window_SkillDetail.prototype.resetFontSize = function() {
        this.contents.fontSize = this.standardFontSize();
    };

    Window_SkillDetail.prototype.processOk = function() {
        const action = this.currentAction();
        if (action && action.enabled) {
            this.playOkSound();
            this.updateInputData();
            this.deactivate();
            this.callOkHandler();
        } else {
            this.playBuzzerSound();
        }
    };

    //=============================================================================
    // Window_ActorSelect - Pick a party member for skill training
    // Uses drawActorFace which is overridden by CustomBustFaceSystemjs to show busts
    //=============================================================================

    function Window_ActorSelect() {
        this.initialize(...arguments);
    }

    Window_ActorSelect.prototype = Object.create(Window_Selectable.prototype);
    Window_ActorSelect.prototype.constructor = Window_ActorSelect;

    Window_ActorSelect.prototype.initialize = function(rect) {
        Window_Selectable.prototype.initialize.call(this, rect);
        this._skill = null;
        this._actors = [];
        this.refresh();
    };

    Window_ActorSelect.prototype.setSkill = function(skill) {
        this._skill = skill;
        this._actors = $gameParty.members();
        this.refresh();
        this.select(0);
    };

    Window_ActorSelect.prototype.maxItems = function() {
        return this._actors.length;
    };

    Window_ActorSelect.prototype.itemHeight = function() {
        return 80;
    };

    Window_ActorSelect.prototype.currentActor = function() {
        return this._actors[this.index()] || null;
    };

    Window_ActorSelect.prototype.drawItem = function(index) {
        const actor = this._actors[index];
        if (!actor) return;

        const rect = this.itemRect(index);
        const skillId = this._skill ? this._skill.id : 0;
        const hasSkill = skillId > 0 && actor.isLearnedSkill(skillId);
        const cost = skillId > 0 ? $gameSystem.getSkillKnowledgeCost(skillId, actor.actorId()) : 0;
        const canAfford = $gameSystem.getKnowledge() >= cost;

        const faceSize = 72;
        const faceX = rect.x + 4;
        const faceY = rect.y + Math.floor((rect.height - faceSize) / 2);
        this.drawActorFace(actor, faceX, faceY, faceSize, faceSize);

        const textX = faceX + faceSize + 10;
        const textW = rect.width - faceSize - 22;
        const nameY = rect.y + 10;
        const statusY = nameY + this.lineHeight();

        if (hasSkill) {
            this.changeTextColor(ColorManager.textColor(3));
        } else if (!canAfford) {
            this.changeTextColor(ColorManager.textColor(7));
        } else {
            this.resetTextColor();
        }
        this.contents.fontSize = 22;
        this.drawText(actor.name(), textX, nameY, textW);
        this.contents.fontSize = $gameSystem.mainFontSize();
        this.resetTextColor();

        this.contents.fontSize = 18;
        if (hasSkill) {
            this.changeTextColor(ColorManager.textColor(3));
            this.drawText(tr("Learned ✓", "Imparata ✓"), textX, statusY, textW);
        } else {
            this.changeTextColor(canAfford ? ColorManager.textColor(1) : ColorManager.textColor(7));
            this.drawText(tr(`Cost: ${cost} KP`, `Costo: ${cost} KC`), textX, statusY, textW);
        }
        this.resetTextColor();
        this.contents.fontSize = $gameSystem.mainFontSize();
    };

    Window_ActorSelect.prototype.refresh = function() {
        this.createContents();
        this.drawAllItems();
    };

    //=============================================================================
    // Window_FusionList
    //=============================================================================

    function Window_FusionList() {
        this.initialize(...arguments);
    }

    Window_FusionList.prototype = Object.create(Window_Selectable.prototype);
    Window_FusionList.prototype.constructor = Window_FusionList;

    Window_FusionList.prototype.initialize = function(rect) {
        Window_Selectable.prototype.initialize.call(this, rect);
        this._fusions = [];
        this.refresh();
    };

    Window_FusionList.prototype.setFusions = function(fusions, currentSkillId) {
        this._fusions = fusions;
        this._currentSkillId = currentSkillId;
        this.refresh();
        this.select(0);
    };

    Window_FusionList.prototype.maxItems = function() {
        return this._fusions.length;
    };

    Window_FusionList.prototype.currentFusion = function() {
        return this._fusions[this.index()];
    };

    Window_FusionList.prototype.isCurrentItemEnabled = function() {
        const fusion = this.currentFusion();
        return fusion && fusion.hasOtherSkill;
    };

    Window_FusionList.prototype.drawItem = function(index) {
        const fusion = this._fusions[index];
        if (!fusion) return;

        const rect = this.itemLineRect(index);
        const recipe = fusion.recipe;

        if (!fusion.hasOtherSkill) {
            this.changeTextColor(ColorManager.dimColor1());
        } else {
            this.resetTextColor();
        }

        const skillA = $dataSkills[recipe.skillA];
        const skillB = $dataSkills[recipe.skillB];
        const result = $dataSkills[recipe.result];

        if (skillA && skillB && result) {
            const text = `${skillA.name} + ${skillB.name} = ${result.name}`;
            this.drawText(text, rect.x, rect.y, rect.width);
        }

        this.resetTextColor();
    };

    Window_FusionList.prototype.refresh = function() {
        this.createContents();
        this.drawAllItems();
    };

    //=============================================================================
    // Scene_SkillEncyclopedia - Unified Interface
    //=============================================================================

    function Scene_SkillEncyclopedia() {
        this.initialize(...arguments);
    }

    Scene_SkillEncyclopedia.prototype = Object.create(Scene_MenuBase.prototype);
    Scene_SkillEncyclopedia.prototype.constructor = Scene_SkillEncyclopedia;

    Scene_SkillEncyclopedia.prototype.initialize = function() {
        Scene_MenuBase.prototype.initialize.call(this);
        this._viewMode = 'category';
        this._preselectedSkillId = $gameVariables.value(variableId);
    };

    Scene_SkillEncyclopedia.prototype.create = function() {
        Scene_MenuBase.prototype.create.call(this);
        this.createCategoryWindow();
        this.createSkillListWindow();
        this.createSkillDetailWindow();
        this.createFusionWindow();
    };

    Scene_SkillEncyclopedia.prototype.createCategoryWindow = function() {
        const rect = this.categoryWindowRect();
        this._categoryWindow = new Window_SkillCategory(rect);
        this._categoryWindow.setHandler("ok", this.onCategoryOk.bind(this));
        this._categoryWindow.setHandler("cancel", this.popScene.bind(this));
        this.addWindow(this._categoryWindow);
    };

    Scene_SkillEncyclopedia.prototype.createSkillListWindow = function() {
        const rect = this.skillListWindowRect();
        this._skillListWindow = new Window_SkillMasterList(rect);
        this._skillListWindow.setHandler("ok", this.onSkillListOk.bind(this));
        this._skillListWindow.setHandler("cancel", this.onSkillListCancel.bind(this));
        this._skillListWindow.hide();
        this._skillListWindow.deactivate();
        this.addWindow(this._skillListWindow);
    };

    Scene_SkillEncyclopedia.prototype.createSkillDetailWindow = function() {
        const rect = this.skillDetailWindowRect();
        this._skillDetailWindow = new Window_SkillDetail(rect);
        this._skillDetailWindow.setHandler("ok", this.onDetailOk.bind(this));
        this._skillDetailWindow.setHandler("cancel", this.onDetailCancel.bind(this));
        this._skillDetailWindow.hide();
        this._skillDetailWindow.deactivate();
        this.addWindow(this._skillDetailWindow);
    };


    Scene_SkillEncyclopedia.prototype.createFusionWindow = function() {
        const rect = this.fusionWindowRect();
        this._fusionWindow = new Window_FusionList(rect);
        this._fusionWindow.setHandler("ok", this.onFusionOk.bind(this));
        this._fusionWindow.setHandler("cancel", this.onFusionCancel.bind(this));
        this._fusionWindow.hide();
        this._fusionWindow.deactivate();
        this.addWindow(this._fusionWindow);
    };

    Scene_SkillEncyclopedia.prototype.categoryWindowRect = function() {
        return new Rectangle(0, this.mainAreaTop(), Graphics.boxWidth, this.mainAreaHeight());
    };

    Scene_SkillEncyclopedia.prototype.skillListWindowRect = function() {
        return new Rectangle(0, this.mainAreaTop(), Graphics.boxWidth, this.mainAreaHeight());
    };

    Scene_SkillEncyclopedia.prototype.skillDetailWindowRect = function() {
        return new Rectangle(0, this.mainAreaTop(), Graphics.boxWidth, Graphics.boxHeight - this.mainAreaTop());
    };


    Scene_SkillEncyclopedia.prototype.fusionWindowRect = function() {
        return new Rectangle(0, this.mainAreaTop(), Graphics.boxWidth, this.mainAreaHeight());
    };

    Scene_SkillEncyclopedia.prototype.onCategoryOk = function() {
        this._selectedCategory = this._categoryWindow.currentCategory();
        this._categoryWindow.hide();
        this._skillListWindow.setCategory(this._selectedCategory);

        if (this._preselectedSkillId > 0) {
            this._skillListWindow.selectSkillById(this._preselectedSkillId);
            this._preselectedSkillId = 0;
        }

        this._viewMode = 'list';
        this._skillListWindow.show();
        this._skillListWindow.activate();
    };

    Scene_SkillEncyclopedia.prototype.onSkillListOk = function() {
        const skill = this._skillListWindow.currentSkill();
        if (!skill) return;

        this._viewMode = 'detail';
        this._skillListWindow.hide();
        this._skillListWindow.deactivate();

        this._skillDetailWindow.setSkill(skill);
        this._skillDetailWindow.show();
        this._skillDetailWindow.activate();
    };

    Scene_SkillEncyclopedia.prototype.onDetailOk = function() {
        const action = this._skillDetailWindow.currentAction();
        if (!action) return;

        if (action.symbol === 'learn') {
            const actor = $gameActors.actor(action.actorId);
            const skill = this._skillDetailWindow._skill;
            if (!actor || !skill || !action.enabled) {
                SoundManager.playBuzzer();
                this._skillDetailWindow.activate();
                return;
            }
            $gameSystem.spendKnowledge(action.cost);
            actor.learnSkill(skill.id);
            SoundManager.playRecovery();
            this._skillDetailWindow.showMessage(
                tr(`${actor.name()} learned ${skill.name}!`, `${actor.name()} ha imparato ${skill.name}!`)
            );
            this._skillDetailWindow.buildActions();
            this._skillDetailWindow.refresh();
            this._skillDetailWindow.activate();
        } else if (action.symbol === 'fusion') {
            this._fusionWindow.setFusions(action.fusions, this._skillDetailWindow._skill.id);
            this._skillDetailWindow.hide();
            this._skillDetailWindow.deactivate();
            this._fusionWindow.show();
            this._fusionWindow.activate();
        }
    };

    Scene_SkillEncyclopedia.prototype.onFusionOk = function() {
        const fusion = this._fusionWindow.currentFusion();
        if (!fusion || !fusion.hasOtherSkill) {
            SoundManager.playBuzzer();
            this._fusionWindow.activate();
            return;
        }

        const recipe = fusion.recipe;
        const actor = $gameParty.leader();

        actor.forgetSkill(recipe.skillA);
        actor.forgetSkill(recipe.skillB);
        actor.learnSkill(recipe.result);

        SoundManager.playRecovery();

        const resultSkill = $dataSkills[recipe.result];
        window.skipLocalization = true;
        $gameMessage.add(tr(`Fusion successful! Learned ${resultSkill.name}!`, `Fusione riuscita! Imparato ${resultSkill.name}!`));
        window.skipLocalization = false;

        this._fusionWindow.hide();
        this._fusionWindow.deactivate();
        this._skillDetailWindow.buildActions();
        this._skillDetailWindow.refresh();
        this._skillDetailWindow.show();
        this._skillDetailWindow.activate();
    };

    Scene_SkillEncyclopedia.prototype.onFusionCancel = function() {
        this._fusionWindow.hide();
        this._fusionWindow.deactivate();
        this._skillDetailWindow.show();
        this._skillDetailWindow.activate();
    };

    Scene_SkillEncyclopedia.prototype.onDetailCancel = function() {
        this._viewMode = 'list';
        this._skillDetailWindow.hide();
        this._skillDetailWindow.deactivate();

        this._skillListWindow.refresh();
        this._skillListWindow.show();
        this._skillListWindow.activate();
    };

    Scene_SkillEncyclopedia.prototype.onSkillListCancel = function() {
        this._skillListWindow.hide();
        this._categoryWindow.show();
        this._categoryWindow.activate();
        this._categoryWindow.refresh();
        this._viewMode = 'category';
    };

    //=============================================================================
    // Plugin Commands
    //=============================================================================

    PluginManager.registerCommand(pluginName, "openSkillEncyclopedia", args => {
        SceneManager.push(Scene_SkillEncyclopedia);
    });

    PluginManager.registerCommand(pluginName, "openWithSkill", args => {
        const skillId = Number(args.skillId || 0);
        $gameVariables.setValue(variableId, skillId);
        SceneManager.push(Scene_SkillEncyclopedia);
    });

    PluginManager.registerCommand(pluginName, "increaseSkillProgress", args => {
        // Legacy command: now adds Knowledge points instead
        const amount = Number(args.amount || 1);
        $gameSystem.addKnowledge(amount);
        window.skipLocalization = true;
        $gameMessage.add(tr(`+${amount} Knowledge (total: ${$gameSystem.getKnowledge()})`, `+${amount} Conoscenza (totale: ${$gameSystem.getKnowledge()})`));
        window.skipLocalization = false;
    });

    //=============================================================================
    // Menu Integration
    //=============================================================================

    if (addToMenu) {
        const _Window_MenuCommand_addOriginalCommands = Window_MenuCommand.prototype.addOriginalCommands;
        Window_MenuCommand.prototype.addOriginalCommands = function() {
            _Window_MenuCommand_addOriginalCommands.call(this);
            if (!$gameSwitches.value(45)) {
                this.addCommand(ConfigManager.language === 'it' ? "Allenamento" : "Training", 'skillEncyclopedia', true, 77);
            }
        };

        const _Scene_Menu_createCommandWindow = Scene_Menu.prototype.createCommandWindow;
        Scene_Menu.prototype.createCommandWindow = function() {
            _Scene_Menu_createCommandWindow.call(this);
            this._commandWindow.setHandler('skillEncyclopedia', this.commandSkillEncyclopedia.bind(this));
        };

        Scene_Menu.prototype.commandSkillEncyclopedia = function() {
            SceneManager.push(Scene_SkillEncyclopedia);
        };
    }

    // Register classes globally
    window.Scene_SkillEncyclopedia = Scene_SkillEncyclopedia;
    window.Window_SkillCategory = Window_SkillCategory;
    window.Window_SkillMasterList = Window_SkillMasterList;
    window.Window_SkillDetail = Window_SkillDetail;
    window.Window_ActorSelect = Window_ActorSelect;
    window.Window_FusionList = Window_FusionList;

})();

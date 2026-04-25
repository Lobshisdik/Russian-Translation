/*:
 * @target MZ
 * @plugindesc Extends specified classes with special skill learning mechanics and adds new battle commands.
 * @author Omni-Lex (Reworked by OmniLex)
 * @version 2.1.0
 * @help
 * ============================================================================
 * Description
 * ============================================================================
 *
 * This plugin provides special mechanics for designated classes:
 * 1. Learn a random skill from a defined pool upon leveling up.
 * 2. A chance to learn a skill used by an enemy when hit by it.
 *
 * It also adds a new Plugin Command that can be used in battle to temporarily
 * copy all skills from the enemy troop.
 *
 * ============================================================================
 * How to Use
 * ============================================================================
 *
 * 1. Go to the Plugin Manager and add this plugin.
 * 2. Configure the parameters to choose which classes are "special", the
 * skill pool they learn from, and the absorb chance.
 *
 * 3. To use the skill-copying feature:
 * - Create a new skill in the database (e.g., "Mirror Force").
 * - In the skill's "Effects", add a "Common Event".
 * - In that Common Event, use the "Plugin Command" event command.
 * - Select this plugin ("EnhancedClassMechanics") and then the
 * "Mirror Enemy Skills" command.
 *
 * Now, when an actor uses the skill in battle, the command will run.
 *
 * ============================================================================
 * Plugin Commands
 * ============================================================================
 *
 * @command mirrorSkills
 * @text Mirror Enemy Skills
 * @desc (Battle Only) The user of the skill temporarily learns all skills from all enemies in the current battle.
 *
 * ============================================================================
 * Parameters
 * ============================================================================
 *
 * @param specialClasses
 * @text Special Classes
 * @type class[]
 * @desc The classes that will have the random and absorbed skill learning abilities.
 *
 * @param skillPoolStart
 * @text Skill Pool Start ID
 * @type number
 * @min 1
 * @desc The starting ID for the pool of learnable skills.
 * @default 1
 *
 * @param skillPoolEnd
 * @text Skill Pool End ID
 * @type number
 * @min 1
 * @desc The ending ID for the pool of learnable skills.
 * @default 100
 *
 * @param learnChance
 * @text Learn Chance from Hits
 * @type number
 * @min 0
 * @max 100
 * @desc Percentage chance to learn a skill when hit (0-100).
 * @default 25
 */

(() => {
    'use strict';

    const pluginName = "EnhancedClassMechanics";
    const parameters = PluginManager.parameters(pluginName);

    const SPECIAL_CLASS_IDS = JSON.parse(parameters['specialClasses'] || '[]').map(Number);
    const SKILL_POOL_START = Number(parameters['skillPoolStart'] || 1);
    const SKILL_POOL_END = Number(parameters['skillPoolEnd'] || 100);
    const LEARN_CHANCE = Number(parameters['learnChance'] || 25);

    let learnableSkillIds = [];

    //-----------------------------------------------------------------------------
    // Helper Functions
    //-----------------------------------------------------------------------------

    const isSpecialClass = (actor) => {
        return actor && actor.isActor() && SPECIAL_CLASS_IDS.includes(actor.currentClass().id);
    };
    
    /**
     * @description This function contains the logic for the "Mirror Enemy Skills" plugin command.
     * It is called when the command is executed from the game.
     */
    const handleMirrorSkillsCommand = () => {
        if (!$gameParty.inBattle() || !BattleManager._subject) {
            return;
        }

        const user = BattleManager._subject;
        if (!user.isActor()) {
            return;
        }

        user._tempLearnedSkills = user._tempLearnedSkills || [];
        const allEnemySkillIds = new Set();

        $gameTroop.members().forEach(enemy => {
            if (enemy.isAlive()) {
                enemy.enemy().actions.forEach(action => {
                    const skillId = action.skillId;
                    if (skillId > 0 && $dataSkills[skillId] && !user.isLearnedSkill(skillId)) {
                        allEnemySkillIds.add(skillId);
                    }
                });
            }
        });

        if (allEnemySkillIds.size > 0) {
            allEnemySkillIds.forEach(skillId => {
                user.learnSkill(skillId);
                user._tempLearnedSkills.push(skillId);
            });
            const message = user.name() + ' mirrored the enemy\'s abilities!';
            BattleManager._logWindow.push('addText', message);
        }
    };


    //-----------------------------------------------------------------------------
    // Plugin Command Registration
    //-----------------------------------------------------------------------------
    
    PluginManager.registerCommand(pluginName, "mirrorSkills", handleMirrorSkillsCommand);


    //-----------------------------------------------------------------------------
    // DataManager
    //-----------------------------------------------------------------------------

    const _DataManager_isDatabaseLoaded = DataManager.isDatabaseLoaded;
    DataManager.isDatabaseLoaded = function() {
        if (!_DataManager_isDatabaseLoaded.call(this)) {
            return false;
        }
        if (learnableSkillIds.length === 0) {
            for (let i = SKILL_POOL_START; i <= SKILL_POOL_END; i++) {
                if ($dataSkills[i] && $dataSkills[i].name && !$dataSkills[i].name.includes('[HIDDEN]')) {
                    learnableSkillIds.push(i);
                }
            }
        }
        return true;
    };

    //-----------------------------------------------------------------------------
    // Game_Actor
    //-----------------------------------------------------------------------------

    const _Game_Actor_initMembers = Game_Actor.prototype.initMembers;
    Game_Actor.prototype.initMembers = function() {
        _Game_Actor_initMembers.call(this);
        this._tempLearnedSkills = [];
    };

    const _Game_Actor_levelUp = Game_Actor.prototype.levelUp;
    Game_Actor.prototype.levelUp = function() {
        _Game_Actor_levelUp.call(this);
        if (isSpecialClass(this)) {
            learnRandomSkill(this);
        }
    };

    function learnRandomSkill(actor) {
        const unknownSkills = learnableSkillIds.filter(skillId => !actor.isLearnedSkill(skillId));
        if (unknownSkills.length > 0) {
            const skillId = unknownSkills[Math.floor(Math.random() * unknownSkills.length)];
            actor.learnSkill(skillId);
            $gameMessage.add(actor.name() + ' has learned ' + $dataSkills[skillId].name + '!');
        }
    }

    Game_Actor.prototype.getLearnableSkillsCount = function() {
        if (!isSpecialClass(this)) {
            return 0;
        }
        return learnableSkillIds.filter(skillId => !this.isLearnedSkill(skillId)).length;
    };

    //-----------------------------------------------------------------------------
    // Game_Action
    //-----------------------------------------------------------------------------

    const _Game_Action_apply = Game_Action.prototype.apply;
    Game_Action.prototype.apply = function(target) {
        _Game_Action_apply.call(this, target);

        if (this.isSkill() && this.subject().isEnemy() && isSpecialClass(target)) {
            const skillId = this.item().id;

            const isLearnable = skillId >= SKILL_POOL_START &&
                skillId <= SKILL_POOL_END &&
                !target.isLearnedSkill(skillId) &&
                $dataSkills[skillId]?.name.trim() !== '';

            if (isLearnable && Math.randomInt(100) < LEARN_CHANCE) {
                target.learnSkill(skillId);
                let message = `${target.name()} learned ${$dataSkills[skillId].name} from the enemy!`;
                if (typeof ConfigManager !== 'undefined' && ConfigManager.language === 'it') {
                     message = `${target.name()} ha imparato ${$dataSkills[skillId].name} dal nemico!`;
                }
                BattleManager._logWindow.push('addText', message);
            }
        }
    };

    //-----------------------------------------------------------------------------
    // BattleManager
    //-----------------------------------------------------------------------------

    const _BattleManager_endBattle = BattleManager.endBattle;
    BattleManager.endBattle = function(result) {
        $gameParty.allMembers().forEach(actor => {
            if (actor._tempLearnedSkills && actor._tempLearnedSkills.length > 0) {
                actor._tempLearnedSkills.forEach(skillId => actor.forgetSkill(skillId));
                actor._tempLearnedSkills = [];
            }
        });
        _BattleManager_endBattle.call(this, result);
    };

    //-----------------------------------------------------------------------------
    // Window_Status
    //-----------------------------------------------------------------------------

    const _Window_Status_drawProfile = Window_Status.prototype.drawProfile;
    Window_Status.prototype.drawProfile = function(x, y) {
        _Window_Status_drawProfile.call(this, x, y);

        if (isSpecialClass(this._actor)) {
            const learnableCount = this._actor.getLearnableSkillsCount();
            const y2 = y + this.lineHeight() * 2; 
            this.changeTextColor(ColorManager.systemColor());
            this.drawText("Learnable Skills:", x, y2, 200);
            this.resetTextColor();
            this.drawText(learnableCount.toString(), x + 160, y2, 60, "right");
        }
    };

})();
/*:
 * @target MZ
 * @plugindesc Summon System v1.0.0
 * @author Omni-Lex
 * @version 1.0.0
 * @description v1.0.0 Advanced summon system that replaces party with summoned creatures
 *
 * @param summonVariableId
 * @text Summon Counter Variable
 * @desc Variable ID that stores summon uses (default: 52)
 * @type variable
 * @default 52
 *
 * @param summonActorId
 * @text Summon Actor ID
 * @desc Actor ID used as summon base (default: 4)
 * @type actor
 * @default 4
 *
 * @command startSummon
 * @text Start Summon
 * @desc Summon a creature based on enemy data
 *
 * @arg enemyId
 * @text Enemy ID
 * @desc ID of the enemy to use as summon template
 * @type enemy
 * @default 1
 *
 * @command addSoftSummon
 * @text Add Soft Summon
 * @desc Add 1 temporary summon use that expires at battle end
 *
 * @help SummonSystem.js
 * 
 * ============================================================================
 * Summon System Plugin
 * ============================================================================
 * 
 * This plugin creates a summon system where:
 * - Variable 52 (configurable) tracks summon uses
 * - Actor 4 (configurable) becomes the summoned creature
 * - Party members are temporarily replaced during summon
 * - Summoned creature copies enemy stats and skills
 * - Battle ends restore the original party
 * 
 * Plugin Commands:
 * - Start Summon: Initiates summon with specified enemy ID
 * 
 * ============================================================================
 */

(() => {
    'use strict';
    
    const pluginName = 'SummonSystem';
    const parameters = PluginManager.parameters(pluginName);
    const summonVariableId = Number(parameters['summonVariableId'] || 52);
    const summonActorId = Number(parameters['summonActorId'] || 4);
    
    // Store original party data
    let originalParty = [];
    let isSummonActive = false;
    let currentSummonEnemyId = 0;
    
    // Register plugin commands
    PluginManager.registerCommand(pluginName, "startSummon", args => {
        const enemyId = Number(args.enemyId || 1);
        startSummon(enemyId);
    });
    
    PluginManager.registerCommand(pluginName, "addSoftSummon", args => {
        addSoftSummon();
    });
    
    // Main summon function
    function startSummon(enemyId) {
        // Check if in battle
        if (!$gameParty.inBattle()) {
            $gameMessage.add("Summons can only be used in battle!");
            return;
        }
        
        // Check if summon is already active
        if (isSummonActive) {
            $gameMessage.add("A summon is already active!");
            return;
        }
        
        // Check summon counter (variable + soft summons)
        const variableSummons = $dataSystem.variables[summonVariableId] || $gameVariables.value(summonVariableId);
        const totalSummons = variableSummons + window._summonSystemSoftUses;
        
        if (totalSummons <= 0) {
            $gameMessage.add("No summons remaining!");
            return;
        }
        
        // Prioritize using soft summons first, then variable summons
        if (window._summonSystemSoftUses > 0) {
            window._summonSystemSoftUses--;
            $gameMessage.add("Used temporary summon!");
        } else {
            $gameVariables.setValue(summonVariableId, variableSummons - 1);
            $gameMessage.add("Used permanent summon!");
        }
        
        // Store original party
        originalParty = $gameParty._actors.slice();
        
        // Setup summon
        setupSummonActor(enemyId);
        
        // Replace party with summon actor
        $gameParty._actors = [summonActorId];
        $gameParty.refresh();
        
        // Set summon flags
        isSummonActive = true;
        currentSummonEnemyId = enemyId;
        
        // Refresh battle display
        if ($gameParty.inBattle()) {
            BattleManager.refreshStatus();
            $gameTemp.requestBattleRefresh();
        }
        
        $gameMessage.add(`Summoned ${$dataEnemies[enemyId].name}!`);
    }
    
    // Add soft summon function
    function addSoftSummon() {
        window._summonSystemSoftUses++;
        $gameMessage.add(`Added temporary summon! (${window._summonSystemSoftUses} available)`);
    }
    
    // Store original face data
    let originalFaceName = '';
    let originalFaceIndex = 0;
    
    // Setup the summon actor with enemy data
    function setupSummonActor(enemyId) {
        const actor = $gameActors.actor(summonActorId);
        const enemy = $dataEnemies[enemyId];
        
        if (!actor || !enemy) return;
        
        // Store original face data before changing
        originalFaceName = actor._faceName;
        originalFaceIndex = actor._faceIndex;
        
        // Replace face with enemy battler
        actor._faceName = enemy.battlerName;
        actor._faceIndex = 0; // Use first face index
        
        // Fully restore actor
        actor.recoverAll();
        actor.removeAllStates();
        
        // Remove all equipment
        for (let i = 0; i < actor._equips.length; i++) {
            actor._equips[i].setObject(null);
        }
        
        // Copy basic parameters (ATK, DEF, MAT, MDF, AGI, LUK)
        for (let i = 0; i < 8; i++) {
            actor._params[i] = enemy.params[i];
        }
        
        // Copy special parameters (hit rate, evasion, etc.)
        // Note: Enemies don't have sparam in the same way, so we'll set reasonable defaults
        // or you can modify this based on your needs
        
        // Copy enemy skills to actor
        actor._skills = [];
        if (enemy.actions) {
            enemy.actions.forEach(action => {
                if (action.skillId && action.skillId > 0) {
                    if (!actor._skills.includes(action.skillId)) {
                        actor._skills.push(action.skillId);
                    }
                }
            });
        }
        
        // Set HP and MP to maximum based on new params
        actor._hp = actor.mhp;
        actor._mp = actor.mmp;
        
        // Copy enemy traits if needed
        // This is more complex and depends on your specific needs
        
        actor.refresh();
    }
    
    // End summon and restore party
    function endSummon() {
        if (!isSummonActive) return;
        
        // Restore original face data
        const actor = $gameActors.actor(summonActorId);
        if (actor) {
            actor._faceName = originalFaceName;
            actor._faceIndex = originalFaceIndex;
            actor.refresh();
        }
        
        // Restore original party
        $gameParty._actors = originalParty.slice();
        $gameParty.refresh();
        
        // Reset flags
        isSummonActive = false;
        currentSummonEnemyId = 0;
        originalParty = [];
        originalFaceName = '';
        originalFaceIndex = 0;
        
        // Refresh battle display
        if ($gameParty.inBattle()) {
            BattleManager.refreshStatus();
            $gameTemp.requestBattleRefresh();
        }
        
        $gameMessage.add("Summon ended. Party restored.");
    }
    
    // Hook into battle end
    const _BattleManager_endBattle = BattleManager.endBattle;
    BattleManager.endBattle = function(result) {
        if (isSummonActive) {
            endSummon();
        }
        
        // Clear soft summons at battle end
        if (window._summonSystemSoftUses > 0) {
            $gameMessage.add(`${window._summonSystemSoftUses} temporary summon(s) expired.`);
            window._summonSystemSoftUses = 0;
        }
        
        _BattleManager_endBattle.call(this, result);
    };
    
    // Hook into actor death check
    const _Game_Actor_die = Game_Actor.prototype.die;
    Game_Actor.prototype.die = function() {
        _Game_Actor_die.call(this);
        
        // If summon actor dies, end summon
        if (isSummonActive && this.actorId() === summonActorId) {
            setTimeout(() => {
                endSummon();
            }, 1000); // Small delay to allow death animation
        }
    };
    
    // Hook into victory check
    const _BattleManager_checkBattleEnd = BattleManager.checkBattleEnd;
    BattleManager.checkBattleEnd = function() {
        if (isSummonActive && $gameTroop.isAllDead()) {
            // Victory with summon - end summon before processing victory
            endSummon();
        }
        return _BattleManager_checkBattleEnd.call(this);
    };
    
    // Prevent summon actor from being removed from party outside of our control
    const _Game_Party_removeActor = Game_Party.prototype.removeActor;
    Game_Party.prototype.removeActor = function(actorId) {
        if (isSummonActive && actorId === summonActorId) {
            return; // Prevent removal of summon actor
        }
        _Game_Party_removeActor.call(this, actorId);
    };
    
    // Save/Load support
    const _Game_System_onAfterLoad = Game_System.prototype.onAfterLoad;
    Game_System.prototype.onAfterLoad = function() {
        _Game_System_onAfterLoad.call(this);
        // Reset summon state on load to prevent issues
        isSummonActive = false;
        originalParty = [];
        currentSummonEnemyId = 0;
        originalFaceName = '';
        originalFaceIndex = 0;
        window._summonSystemSoftUses = 0; // Reset soft summons on load
    };
    
    // Utility function to get total summons available
    window.getTotalSummons = function() {
        const variableSummons = $gameVariables.value(summonVariableId);
        return variableSummons + summonState.getSoftSummons();
    };
    
    // Utility function to get soft summons available
    window.getSoftSummons = function() {
        return summonState.getSoftSummons();
    };
    
    // Utility function to manually add soft summons (for other plugins/events)
    window.addSoftSummon = function() {
        addSoftSummon();
    };
    // Utility function to check if summon is active (for other plugins/events)
    window.isSummonActive = function() {
        return isSummonActive;
    };
    
    // Utility function to manually end summon (for events/other plugins)
    window.endSummon = function() {
        endSummon();
    };
    
})();
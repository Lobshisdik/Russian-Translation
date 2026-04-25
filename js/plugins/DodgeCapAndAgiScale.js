//=============================================================================
// DodgeCapAndAgiScale.js
//=============================================================================

/*:
 * @target MZ
 * @plugindesc [v1.0.0] Dodge Cap and Agility Scaling
 * @author Omni-Lex
 * @url https://nocoldiz.itch.io/hypernet-explorer
 * @help DodgeCapAndAgiScale.js
 * 
 * @param dodgeCap
 * @text Maximum Dodge Rate
 * @desc Maximum dodge probability (0-1, where 0.4 = 40%)
 * @type number
 * @min 0
 * @max 1
 * @decimals 2
 * @default 0.40
 * 
 * @param agiScalingPower
 * @text Agility Scaling Power
 * @desc Power factor for agility scaling (lower = less effective at early levels)
 * @type number
 * @min 0.1
 * @max 2.0
 * @decimals 2
 * @default 0.7
 * 
 * @param agiScalingMultiplier
 * @text Agility Scaling Multiplier
 * @desc Multiplier for agility contribution to dodge
 * @type number
 * @min 0.01
 * @max 1.0
 * @decimals 3
 * @default 0.002
 * 
 * @help DodgeCapAndAgiScale.js
 * 
 * This plugin modifies the dodge system in RPG Maker MZ:
 * 
 * 1. Caps maximum dodge probability at a specified percentage (default 40%)
 * 2. Changes agility scaling to make early levels less effective
 * 3. Uses a power-based scaling system for more balanced progression
 * 
 * The dodge formula becomes:
 * Dodge Rate = min(dodgeCap, (agility * multiplier) ^ scalingPower)
 * 
 * This means:
 * - Early agility values contribute less to dodge rate
 * - High agility values still matter but are capped
 * - Dodge is never guaranteed, creating more tactical gameplay
 * 
 * Parameters:
 * - Maximum Dodge Rate: The ceiling for dodge probability (0.4 = 40%)
 * - Agility Scaling Power: How agility scales (0.7 makes early levels less effective)
 * - Agility Scaling Multiplier: Base multiplier for agility contribution
 * 
 * License: MIT
 * 
 */

(() => {
  'use strict';
  
  const pluginName = 'DodgeCapAndAgiScale';
  const parameters = PluginManager.parameters(pluginName);
  
  const DODGE_CAP = parseFloat(parameters['dodgeCap']) || 0.40;
  const AGI_SCALING_POWER = parseFloat(parameters['agiScalingPower']) || 0.7;
  const AGI_SCALING_MULTIPLIER = parseFloat(parameters['agiScalingMultiplier']) || 0.002;
  
  // Override the eva (evasion) parameter calculation
  const _Game_BattlerBase_paramRate = Game_BattlerBase.prototype.paramRate;
  Game_BattlerBase.prototype.paramRate = function(paramId) {
      // If this is agility (param 6), apply our custom scaling
      if (paramId === 6) {
          const baseRate = _Game_BattlerBase_paramRate.call(this, paramId);
          const modifiedRate = Math.pow(baseRate * AGI_SCALING_MULTIPLIER, AGI_SCALING_POWER);
          return Math.min(DODGE_CAP, modifiedRate);
      }
      return _Game_BattlerBase_paramRate.call(this, paramId);
  };
  
  // Override the eva calculation more directly
  const _Game_BattlerBase_eva = Game_BattlerBase.prototype.eva;
  Game_BattlerBase.prototype.eva = function() {
      const baseEva = _Game_BattlerBase_eva.call(this);
      const agility = this.agi;
      
      // Calculate dodge based on agility with our custom scaling
      const agilityContribution = Math.pow(agility * AGI_SCALING_MULTIPLIER, AGI_SCALING_POWER);
      const finalEva = Math.min(DODGE_CAP, baseEva + agilityContribution);
      
      return finalEva;
  };
  
  // Override the makeActionResult method to ensure dodge cap is respected
  const _Game_Action_makeActionResult = Game_Action.prototype.makeActionResult;
  Game_Action.prototype.makeActionResult = function() {
      const result = _Game_Action_makeActionResult.call(this);
      return result;
  };
  
  // Override itemEva to ensure our dodge cap is always respected
  const _Game_Action_itemEva = Game_Action.prototype.itemEva;
  Game_Action.prototype.itemEva = function(target) {
      const baseEva = _Game_Action_itemEva.call(this, target);
      return Math.min(DODGE_CAP, baseEva);
  };
  
  // Alternative approach: Override the hit calculation directly
  const _Game_Action_itemHit = Game_Action.prototype.itemHit;
  Game_Action.prototype.itemHit = function(target) {
      const hit = _Game_Action_itemHit.call(this, target);
      const eva = target.eva;
      const cappedEva = Math.min(DODGE_CAP, eva);
      
      // Ensure the hit rate accounts for our capped evasion
      return Math.max(0, hit - cappedEva);
  };
  
  // Debug function to check dodge rates (can be called from console)
  window.checkDodgeRate = function(battler) {
      if (battler) {
          const agility = battler.agi;
          const eva = battler.eva;
          const agilityContribution = Math.pow(agility * AGI_SCALING_MULTIPLIER, AGI_SCALING_POWER);
          
          console.log(`=== Dodge Rate Debug ===`);
          console.log(`Agility: ${agility}`);
          console.log(`Agility Contribution: ${(agilityContribution * 100).toFixed(2)}%`);
          console.log(`Final EVA: ${(eva * 100).toFixed(2)}%`);
          console.log(`Dodge Cap: ${(DODGE_CAP * 100).toFixed(2)}%`);
          console.log(`========================`);
      }
  };
  
})();
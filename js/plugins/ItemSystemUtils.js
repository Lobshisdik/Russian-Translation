/*:
 * @target MZ
 * @plugindesc v1.0.0 Item System Utilities - Common functions for item systems
 * @author Omni-Lex
 * @help ItemSystemUtils.js
 *
 * This plugin provides shared utility functions for item systems.
 * It should be loaded BEFORE ItemSystemInventory and ItemSystemShop.
 *
 * Provides:
 * - Weight system calculations
 * - Item category checking
 * - Nutrition value extraction
 * - Text formatting utilities
 * - Actor bust image paths
 *
 * Terms of Use:
 * Free for use in both commercial and non-commercial projects.
 */

(function () {
  "use strict";

  //=============================================================================
  // Plugin Parameters
  //=============================================================================
  const BASE_CARRY_WEIGHT = 60000; // 60kg in grams
  const COS_WEIGHT_BONUS = 300; // 300g per COS point
  const OVERENCUMBERED_SPEED_PENALTY = 0.5; // 50% movement speed
  const FOOD_HP_RECOVERY_VARIABLE_ID = 28;
  const FOOD_COMMON_EVENT_ACTOR1 = 23;
  const FOOD_COMMON_EVENT_ACTOR2 = 24;
  const FOOD_COMMON_EVENT_ACTOR3 = 25;
  const { SPRITES_ASSOCIATION } = window.Sprites || {};

  //=============================================================================
  // Global Item System Utilities
  //=============================================================================

  window.ItemSystemUtils = {
    // Export constants
    BASE_CARRY_WEIGHT,
    COS_WEIGHT_BONUS,
    OVERENCUMBERED_SPEED_PENALTY,
    FOOD_HP_RECOVERY_VARIABLE_ID,
    FOOD_COMMON_EVENT_ACTOR1,
    FOOD_COMMON_EVENT_ACTOR2,
    FOOD_COMMON_EVENT_ACTOR3,

    /**
     * Get item weight from note tag
     */
    getItemWeight: function(item) {
      if (!item || !item.note) return 1; // Minimum 1 gram

      const match = item.note.match(/<weight:\s*(\d+)>/i);
      if (match) {
        return Math.max(1, parseInt(match[1]));
      }
      return 1; // Default 1 gram
    },

    /**
     * Calculate total inventory weight (only unequipped items)
     */
    calculateTotalWeight: function() {
      let totalWeight = 0;

      // 1. Regular items
      const items = $gameParty.items();
      for (const item of items) {
        totalWeight += this.getItemWeight(item) * $gameParty.numItems(item);
      }

      // 2. Get a copy of weapon and armor counts
      const weapons = Object.assign({}, $gameParty._weapons);
      const armors = Object.assign({}, $gameParty._armors);

      // 3. Subtract equipped items
      for (const actor of $gameParty.members()) {
        for (const equip of actor.equips()) {
          if (equip) {
            if (DataManager.isWeapon(equip)) {
              if (weapons[equip.id]) {
                weapons[equip.id]--;
              }
            } else if (DataManager.isArmor(equip)) {
              if (armors[equip.id]) {
                armors[equip.id]--;
              }
            }
          }
        }
      }

      // 4. Calculate weight of unequipped weapons
      for (const weaponId in weapons) {
        if (weapons[weaponId] > 0) {
          const weapon = $dataWeapons[weaponId];
          totalWeight += this.getItemWeight(weapon) * weapons[weaponId];
        }
      }

      // 5. Calculate weight of unequipped armors
      for (const armorId in armors) {
        if (armors[armorId] > 0) {
          const armor = $dataArmors[armorId];
          totalWeight += this.getItemWeight(armor) * armors[armorId];
        }
      }

      return totalWeight;
    },

    /**
     * Calculate max carry weight for party leader
     */
    calculateMaxCarryWeight: function() {
      const leader = $gameParty.leader();
      if (!leader) return BASE_CARRY_WEIGHT;

      const cosBonus = leader.param(3) * COS_WEIGHT_BONUS; // COS

      return BASE_CARRY_WEIGHT + cosBonus;
    },

    /**
     * Check if party is overencumbered
     */
    isOverencumbered: function() {
      return this.calculateTotalWeight() > this.calculateMaxCarryWeight();
    },

    /**
     * Format weight for display
     */
    formatWeight: function(grams) {
      if (grams < 1000) {
        return grams + "g";
      } else {
        return (grams / 1000).toFixed(1) + "kg";
      }
    },

    /**
     * Get nutrition value from item note tag
     */
    getNutritionValue: function(item, nutrient) {
      if (!item || !item.note) return 0;
      const regex = new RegExp(`<${nutrient}:\\s*(\\d+)>`, "i");
      const match = item.note.match(regex);
      return match ? parseInt(match[1]) : 0;
    },

    /**
     * Check if item has Food category
     */
    isFoodItem: function(item) {
      if (!item || !item.note) return false;
      return /<category:Food>/i.test(item.note);
    },

    /**
     * Check if item has Tools category
     */
    isToolsItem: function(item) {
      if (!item || !item.note) return false;
      return /<category:Tools>/i.test(item.note);
    },

    /**
     * Check if item has Medical category
     */
    isMedicalItem: function(item) {
      if (!item || !item.note) return false;
      return /<category:Medical>/i.test(item.note);
    },

    /**
     * Count items in each category
     */
    countMedicalItems: function() {
      return $gameParty.allItems().filter((item) => DataManager.isItem(item) && this.isMedicalItem(item)).length;
    },

    countFoodItems: function() {
      return $gameParty.allItems().filter((item) => DataManager.isItem(item) && this.isFoodItem(item)).length;
    },

    countToolsItems: function() {
      return $gameParty.allItems().filter((item) => DataManager.isItem(item) && this.isToolsItem(item)).length;
    },

    countWeapons: function() {
      return $gameParty.weapons().length;
    },

    countArmors: function() {
      return $gameParty.armors().length;
    },

    countMaterials: function() {
      return $gameParty.allItems().filter((item) => DataManager.isItem(item) && item.itypeId === 2).length;
    },

    countTrash: function() {
      return $gameParty.allItems().filter((item) => item && (!DataManager.isItem(item) || item.itypeId !== 2)).length;
    },

    /**
     * Get the raw category name from item note tag
     */
    getRawCategoryFromNote: function(item) {
      if (!item || !item.note) return null;
      const match = item.note.match(/<category:\s*(\w+)>/i);
      return match ? match[1] : null;
    },

    /**
     * Get item category name for display
     */
    getItemCategoryName: function(item) {
      if (!item) return null;

      // First, check if item has a category tag in notes
      const rawCategory = this.getRawCategoryFromNote(item);
      if (rawCategory) {
        return rawCategory; // Return the exact category name from the tag
      }

      // If no category tag, return general item type
      const useTranslation = ConfigManager.language === "it";
      if (DataManager.isItem(item)) {
        if (item.itypeId === 2) {
          return useTranslation ? "Materiali" : "Materials";
        }
        return useTranslation ? "Oggetto" : "Item";
      }
      if (DataManager.isWeapon(item)) {
        // Return the actual weapon type name (Light, Sword, Heavy, etc.)
        let weaponTypeName = $dataSystem.weaponTypes[item.wtypeId];
        if (window.translateText && typeof window.translateText === "function") {
          weaponTypeName = window.translateText(weaponTypeName);
        }
        return weaponTypeName;
      }
      if (DataManager.isArmor(item)) {
        // Return the actual armor type name (Helmet, Armor, Shield, etc.)
        let armorTypeName = $dataSystem.armorTypes[item.atypeId];
        if (window.translateText && typeof window.translateText === "function") {
          armorTypeName = window.translateText(armorTypeName);
        }
        return armorTypeName;
      }

      if (this.isFoodItem(item)) {
        return useTranslation ? "Cibo" : "Food";
      }
      if (this.isToolsItem(item)) {
        return useTranslation ? "Strumenti" : "Tools";
      }

      // Return general item type for all other items
      if (DataManager.isItem(item)) {
        if (item.itypeId === 2) {
          return useTranslation ? "Materiali" : "Materials";
        }
        return useTranslation ? "Oggetto" : "Item";
      }

      return null;
    },

    /**
     * Get bust image path based on actor ID and custom variables
     */
    getActorBustImagePath: function(actor) {
      if (!actor) return null;

      const actorId = actor.actorId && actor.actorId();
      const characterName = actor.characterName();

      // Player 1 (Actor 1) special handling
      if (actorId === 1) {
        // Priority 1: Check Variable 109 (Player 1 bust name)
        const player1BustName = $gameVariables.value(109);
        if (player1BustName && player1BustName !== "") {
          return "img/busts/" + player1BustName;
        }

        // Priority 2: If Switch 77 is ON, use Variable 106 for monster form
        if ($gameSwitches.value(77)) {
          const player1MonsterName = $gameVariables.value(106);
          if (player1MonsterName && player1MonsterName !== "") {
            return "img/enemies/" + player1MonsterName;
          }
        }

        // Priority 3: Fall back to SPRITES_ASSOCIATION
        if (characterName && SPRITES_ASSOCIATION) {
          const spritesheetName = characterName.split('.')[0];
          const characterIndex = actor.characterIndex();

          if (SPRITES_ASSOCIATION[spritesheetName] &&
              SPRITES_ASSOCIATION[spritesheetName][characterIndex]) {
            const bustName = SPRITES_ASSOCIATION[spritesheetName][characterIndex];
            return "img/busts/" + bustName;
          }
        }

        return "img/busts/7";
      }

      // Players 2 & 3: Check Variables 107 and 108 first, then SPRITES_ASSOCIATION
      if (actorId === 2) {
        const player2BustName = $gameVariables.value(107);
        if (player2BustName && player2BustName !== "") {
          return "img/busts/" + player2BustName;
        }
      } else if (actorId === 3) {
        const player3BustName = $gameVariables.value(108);
        if (player3BustName && player3BustName !== "") {
          return "img/busts/" + player3BustName;
        }
      }

      // Fallback to SPRITES_ASSOCIATION for actors 2 & 3
      if (characterName && SPRITES_ASSOCIATION) {
        const spritesheetName = characterName.split('.')[0];
        const characterIndex = actor.characterIndex();

        if (SPRITES_ASSOCIATION[spritesheetName] &&
            SPRITES_ASSOCIATION[spritesheetName][characterIndex]) {
          const bustName = SPRITES_ASSOCIATION[spritesheetName][characterIndex];
          return "img/busts/" + bustName;
        }
      }

      // Final fallback to default bust path structure
      return "img/busts/7";
    },

    /**
     * Truncate text and add ellipsis if needed
     */
    truncateTextWithEllipsis: function(text, maxLength) {
      if (text.length > maxLength) {
        return text.substring(0, maxLength - 3) + "...";
      }
      return text;
    },

    /**
     * Check if item has specific category
     */
    hasItemCategory: function(item, category) {
      if (!item || !item.note) return false;
      const regex = new RegExp(`<category:${category}>`, "i");
      return regex.test(item.note);
    }
  };

  //=============================================================================
  // Game_Player Movement Speed Override
  //=============================================================================

  const _Game_Player_realMoveSpeed = Game_Player.prototype.realMoveSpeed;
  Game_Player.prototype.realMoveSpeed = function () {
    let speed = _Game_Player_realMoveSpeed.call(this);

    // Apply encumbrance penalty
    if (window.ItemSystemUtils && window.ItemSystemUtils.isOverencumbered()) {
      speed = Math.max(1, speed * OVERENCUMBERED_SPEED_PENALTY);
    }

    return speed;
  };

})();

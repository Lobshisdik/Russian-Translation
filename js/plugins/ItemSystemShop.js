/*:
 * @target MZ
 * @plugindesc v1.0.0 Shop System - Unified item details and shop enhancements
 * @author Omni-Lex
 * @help ItemSystemShop.js
 *
 * This plugin provides the shared item detail window (Window_ItemDetail) used by both inventory and shop systems,
 * plus shop-specific enhancements.
 * Requires ItemSystemUtils.js to be loaded first.
 *
 * Features:
 * - Unified item detail display showing stats, effects, and compatibility
 * - Enhanced shop buy/sell windows with better item names and details
 * - Weight display in shop sell list
 * - Detailed weapon and armor stat displays
 * - Full effect and trait descriptions
 * - Stat scaling information for weapons
 *
 * Terms of Use:
 * Free for use in both commercial and non-commercial projects.
 */

(function () {
  "use strict";

  //=============================================================================
  // Dependency Check
  //=============================================================================
  if (!window.ItemSystemUtils) {
    throw new Error("ItemSystemShop requires ItemSystemUtils.js to be loaded first!");
  }

  const utils = window.ItemSystemUtils;

  //=============================================================================
  // MASTER Item Detail Window - SHARED by both Shop and Inventory
  //=============================================================================

  function Window_ItemDetail() {
    this.initialize(...arguments);
  }

  Window_ItemDetail.prototype = Object.create(Window_Base.prototype);
  Window_ItemDetail.prototype.constructor = Window_ItemDetail;

  Window_ItemDetail.prototype.initialize = function (rect) {
    Window_Base.prototype.initialize.call(this, rect);
    this._item = null;
    this.refresh();
  };

  Window_ItemDetail.prototype.setItem = function (item) {
    if (this._item !== item) {
      this._item = item;
      this.refresh();
    }
  };

  Window_ItemDetail.prototype.refresh = function () {
    this.contents.clear();
    if (this._item) {
      this.drawItemDetails();
    }
  };

  Window_ItemDetail.prototype.getWeaponScalingType = function(weapon) {
    if (!weapon || !DataManager.isWeapon(weapon)) {
        return null;
    }
    const attackSkills = weapon.traits.filter(trait => trait.code === 35); // Trait code 35 is Attack Skill
    if (attackSkills.length === 0) {
        return 'FOR'; // STR
    }
    for (let i = 0; i < attackSkills.length; i++) {
        const skillId = attackSkills[i].dataId;
        switch (skillId) {
            case 840: return 'DES'; // DEX
            case 841: return 'MIS'; // MIX
            case 842: return 'PSI'; // PSI
            case 843: return 'INT'; // INT
            case 844: return 'COS'; // CON
            case 845: return 'SAG'; // WIS
        }
    }
    return null;
  };

  Window_ItemDetail.prototype.drawItemDetails = function () {
    const item = this._item;
    const lineHeight = this.lineHeight();
    const contentWidth = this.width - this.padding * 2;
    let y = 0;

    const originalName = item.name;
    if (window.translateText && typeof window.translateText === "function") {
      item.name = window.translateText(item.name);
    }
    this.drawItemName(item, 0, y, contentWidth);
    item.name = originalName;
    y += lineHeight;

    this.drawHorzLine(y);
    y += 16;

    // Only draw description if NOT in shop
    const isInShop = SceneManager._scene instanceof Scene_Shop;
    if (!isInShop && item.description) {
      let translatedDescription = item.description;
      if (window.translateText && typeof window.translateText === "function") {
        translatedDescription = window.translateText(item.description);
      }
      const descLines = this.wrapText(translatedDescription, contentWidth - 4);
      for (const line of descLines) {
        this.drawTextEx("\\c[6]" + line, 0, y, contentWidth);
        y += lineHeight;
      }
      y += 16;
    }

    if (DataManager.isItem(item)) {
      this.drawItemStats(item, y);
    } else if (DataManager.isWeapon(item)) {
      this.drawWeaponStats(item, y);
    } else if (DataManager.isArmor(item)) {
      this.drawArmorStats(item, y);
    }
  };

  Window_ItemDetail.prototype.drawItemStats = function (item, y) {
    const lineHeight = this.lineHeight();
    let currentY = y;
    const useTranslation = ConfigManager.language === "it";

    // Draw category/type if item has one (show as "Type" for normal items)
    const categoryName = utils.getItemCategoryName(item);
    if (categoryName) {
      this.drawKeyValue(useTranslation ? "Tipo" : "Type", categoryName, 0, currentY);
      currentY += lineHeight;
    }

    // Draw weight
    const weight = utils.getItemWeight(item);
    this.drawKeyValue(useTranslation ? "Peso" : "Weight", utils.formatWeight(weight), 0, currentY);
    currentY += lineHeight;

    // Check if this is a food item
    const isFood = utils.isFoodItem(item);

    if (isFood) {
      // Draw nutrition stats for food items
      const calories = utils.getNutritionValue(item, "calories");
      const protein = utils.getNutritionValue(item, "protein");
      const fat = utils.getNutritionValue(item, "fat");

      if (calories > 0) {
        this.drawKeyValue(useTranslation ? "Calorie" : "Calories", calories.toString(), 0, currentY);
        currentY += lineHeight;
      }
      if (protein > 0) {
        this.drawKeyValue(useTranslation ? "Proteine" : "Protein", protein + "g", 0, currentY);
        currentY += lineHeight;
      }
      if (fat > 0) {
        this.drawKeyValue(useTranslation ? "Grassi" : "Fat", fat + "g", 0, currentY);
        currentY += lineHeight;
      }
    } else {
      // Draw normal item stats (non-food items)

      // Draw consumable info
      if (item.consumable !== undefined && item.occasion !== 3) {
        this.drawKeyValue(
          useTranslation ? "Uso" : "Use",
          item.consumable ? (useTranslation ? "Singolo" : "Single") : (useTranslation ? "Illimitato" : "Unlimited"),
          0, currentY
        );
        currentY += lineHeight;
      }

      // Draw scope/target
      this.drawKeyValue("Target", this.getScopeName(item.scope), 0, currentY);
      currentY += lineHeight;

      // Draw combat stats
      const hasCombatStats =
        (item.speed !== undefined && item.speed !== 0) ||
        (item.successRate !== undefined && item.successRate < 100) ||
        (item.repeats && item.repeats > 1) ||
        (item.tpGain !== undefined && item.tpGain !== 0) ||
        (item.damage && item.damage.type > 0);

      if (hasCombatStats) {
        if (item.repeats && item.repeats > 1) {
          this.drawKeyValue(
            useTranslation ? "Colpi" : "Hits",
            item.repeats + (useTranslation ? " volte" : " times"), 0, currentY
          );
          currentY += lineHeight;
        }
        if (item.tpGain !== undefined && item.tpGain !== 0) {
          this.drawKeyValue(useTranslation ? "AP" : "AP", item.tpGain.toString(), 0, currentY);
          currentY += lineHeight;
        }
        if (item.damage && item.damage.type > 0) {
          if (item.damage.elementId > 1) {
            const elementName = this.getElementName(item.damage.elementId);
            if (elementName) {
              this.drawKeyValue(useTranslation ? "Elemento" : "Element", elementName, 0, currentY);
              currentY += lineHeight;
            }
          }
          if (item.damage.critical !== undefined) {
            this.drawKeyValue(
              useTranslation ? "Crit." : "Crit.",
              item.damage.critical ? (useTranslation ? "Si" : "Yes") : "No", 0, currentY
            );
            currentY += lineHeight;
          }
        }
      }

      // Draw effects (only for non-food items)
      if (item.effects && item.effects.length > 0) {
        for (const effect of item.effects) {
          const effectText = this.getEffectDescription(effect);
          if (effectText) {
            const parts = effectText.split(": ");
            if (parts.length > 1) {
              this.drawKeyValue(parts[0], parts[1], 0, currentY);
            } else {
              this.drawTextEx("\\c[6]" + effectText, 0, currentY, this.width - this.padding * 2);
            }
            currentY += lineHeight;
          }
        }
      }
    }
  };

  Window_ItemDetail.prototype.drawWeaponStats = function (item, y) {
    const lineHeight = this.lineHeight();
    let currentY = y;
    const useTranslation = ConfigManager.language === "it";

    // Draw category type (weapon type)
    const categoryName = utils.getItemCategoryName(item);
    if (categoryName) {
      this.drawKeyValue(useTranslation ? "Tipo" : "Type", categoryName, 0, currentY);
      currentY += lineHeight;
    }

    // Draw weapon scaling
    const scalingType = this.getWeaponScalingType(item);
    if (scalingType) {
      this.drawKeyValue("Scale", scalingType, 0, currentY);
      currentY += lineHeight;
    }

    // Draw weight
    const weight = utils.getItemWeight(item);
    this.drawKeyValue(useTranslation ? "Peso" : "Weight", utils.formatWeight(weight), 0, currentY);
    currentY += lineHeight;

    // Show equip compatibility
    currentY = this.drawEquipCompatibility(item, currentY);

    // Draw price
    if (item.price > 0) {
      const euroPrice = (item.price / 100).toFixed(2);
      this.drawKeyValue(useTranslation ? "Prezzo" : "Price", euroPrice + " €", 0, currentY);
      currentY += lineHeight;
    }

    // Draw params
    var params = [
        ["STR", item.params[2]], ["COS", item.params[3]], ["INT", item.params[4]],
        ["WIS", item.params[5]], ["DEX", item.params[6]], ["PSI", item.params[7]]
    ];
    if(useTranslation){
        params = [
            ["FRZ", item.params[2]], ["COS", item.params[3]], ["INT", item.params[4]],
            ["SAG", item.params[5]], ["DES", item.params[6]], ["PSI", item.params[7]]
        ];
    }
    for (const param of params) {
        if (param[1] !== 0) {
            const sign = param[1] > 0 ? "+" : "";
            this.drawKeyValue(param[0], sign + param[1], 0, currentY);
            currentY += lineHeight;
        }
    }

    // Draw traits
    if (item.traits && item.traits.length > 0) {
      for (const trait of item.traits) {
        const traitText = this.getTraitDescription(trait);
        if (traitText) {
          const parts = traitText.split(": ");
          if (parts.length > 1) {
            this.drawKeyValue(parts[0], parts[1], 0, currentY);
          } else {
            this.drawTextEx("\\c[6]" + traitText, 0, currentY, this.width - this.padding * 2);
          }
          currentY += lineHeight;
        }
      }
    }
  };

  Window_ItemDetail.prototype.drawArmorStats = function (item, y) {
    const lineHeight = this.lineHeight();
    let currentY = y;
    const useTranslation = ConfigManager.language === "it";

    // Draw category type (armor type)
    const categoryName = utils.getItemCategoryName(item);
    if (categoryName) {
      this.drawKeyValue(useTranslation ? "Tipo" : "Type", categoryName, 0, currentY);
      currentY += lineHeight;
    }

    // Draw equip type
    let equipTypeName = $dataSystem.equipTypes[item.etypeId];
    if (window.translateText && typeof window.translateText === "function") {
      equipTypeName = window.translateText(equipTypeName);
    }
    this.drawKeyValue("Slot", equipTypeName, 0, currentY);
    currentY += lineHeight;

    // Draw weight
    const weight = utils.getItemWeight(item);
    this.drawKeyValue(useTranslation ? "Peso" : "Weight", utils.formatWeight(weight), 0, currentY);
    currentY += lineHeight;

    // Show equip compatibility
    currentY = this.drawEquipCompatibility(item, currentY);

    // Draw price
    if (item.price > 0) {
      const euroPrice = (item.price / 100).toFixed(2);
      this.drawKeyValue(useTranslation ? "Prezzo" : "Price", euroPrice + " €", 0, currentY);
      currentY += lineHeight;
    }

    // Draw params
    var params = [
        ["STR", item.params[2]], ["COS", item.params[3]], ["INT", item.params[4]],
        ["WIS", item.params[5]], ["DEX", item.params[6]], ["PSI", item.params[7]]
    ];
    if(useTranslation){
        params = [
            ["FRZ", item.params[2]], ["COS", item.params[3]], ["INT", item.params[4]],
            ["SAG", item.params[5]], ["DES", item.params[6]], ["PSI", item.params[7]]
        ];
    }
    for (const param of params) {
        if (param[1] !== 0) {
            const sign = param[1] > 0 ? "+" : "";
            this.drawKeyValue(param[0], sign + param[1], 0, currentY);
            currentY += lineHeight;
        }
    }

    // Draw traits
    if (item.traits && item.traits.length > 0) {
      for (const trait of item.traits) {
        const traitText = this.getTraitDescription(trait);
        if (traitText) {
          const parts = traitText.split(": ");
          if (parts.length > 1) {
            this.drawKeyValue(parts[0], parts[1], 0, currentY);
          } else {
            this.drawTextEx("\\c[6]" + traitText, 0, currentY, this.width - this.padding * 2);
          }
          currentY += lineHeight;
        }
      }
    }
  };

  Window_ItemDetail.prototype.drawEquipCompatibility = function (item, y) {
    const lineHeight = this.lineHeight();
    let currentY = y;
    const useTranslation = ConfigManager.language === "it";

    this.changeTextColor(ColorManager.systemColor());
    this.drawText(
      useTranslation ? "Equip. da:" : "Equip. by:",
      0, currentY, this.width - this.padding * 2
    );
    currentY += lineHeight;

    const party = $gameParty.members();
    let equipInfoShown = false;

    // This version shows all party members who can equip
    for (let i = 0; i < party.length; i++) {
      const actor = party[i];
      const canEquip = actor.canEquip(item);

      this.resetTextColor();

      const translatedName = window.translateText ? window.translateText(actor.name()) : actor.name();

      if (canEquip) {
        this.drawText(translatedName, 20, currentY, this.width - this.padding * 2 - 20);
        currentY += lineHeight;
        equipInfoShown = true;
      }
    }

    if (!equipInfoShown) {
      this.resetTextColor();
      this.drawText(
        useTranslation ? "Nessuno nel party" : "No one in party",
        20, currentY, this.width - this.padding * 2 - 20
      );
      currentY += lineHeight;
    }

    return currentY;
  };

  Window_ItemDetail.prototype.drawKeyValue = function (key, value, x, y) {
    const width = this.width - this.padding * 2;
    const isInShop = SceneManager._scene instanceof Scene_Shop;

    // Use wider spacing in shop for better readability
    const keyWidth = isInShop ? Math.floor(width / 2.5) : Math.floor(width / 3);

    this.changeTextColor(ColorManager.systemColor());
    this.drawText(key, x, y, keyWidth);
    this.resetTextColor();
    this.drawText(value, x + keyWidth, y, width - keyWidth, "left");
  };

  Window_ItemDetail.prototype.drawHorzLine = function (y) {
    const lineY = y + this.lineHeight() / 2 - 1;
    const width = this.width - this.padding * 2;
    this.contents.fillRect(0, lineY, width, 2, ColorManager.systemColor());
  };

  Window_ItemDetail.prototype.wrapText = function (text, maxWidth) {
    if (!text) return [];
    const result = [];
    const words = text.split(" ");
    let currentLine = "";

    for (const word of words) {
      const testLine = currentLine ? currentLine + " " + word : word;
      const testWidth = this.textSizeEx(testLine).width;
      if (testWidth > maxWidth && currentLine) {
        result.push(currentLine);
        currentLine = word;
      } else {
        currentLine = testLine;
      }
    }
    if (currentLine) {
      result.push(currentLine);
    }

    const finalResult = [];
    for (const line of result) {
      const subLines = line.split("\n");
      for (const subLine of subLines) {
        finalResult.push(subLine);
      }
    }
    return finalResult;
  };

  //=============================================================================
  // Helper Methods for Item Details
  //=============================================================================

  Window_ItemDetail.prototype.getItemTypeName = function (item) {
    const useTranslation = ConfigManager.language === "it";
    if (DataManager.isItem(item)) {
      return item.itypeId === 1
        ? (useTranslation ? "Oggetto" : "Regular Item")
        : (useTranslation ? "Oggetto chiave" : "Key Item");
    } else if (DataManager.isWeapon(item)) {
      return useTranslation ? "Arma" : "Weapon";
    } else if (DataManager.isArmor(item)) {
      return useTranslation ? "Armatura" : "Armor";
    }
    return useTranslation ? "Sconosciuto" : "Unknown";
  };

  Window_ItemDetail.prototype.getScopeName = function (scope) {
    const useTranslation = ConfigManager.language === "it";
    if (useTranslation) {
      switch (scope) {
        case 0: return "Nessuno";
        case 1: return "Nemico";
        case 2: return "Nemici";
        case 3: return "Casuale";
        case 4: return "2 nemici casuali";
        case 5: return "3 nemici casuali";
        case 6: return "4 nemici casuali";
        case 7: return "Alleato";
        case 8: return "Party";
        case 9: return "Cadavere";
        case 10: return "Cadaveri";
        case 11: return "Utilizzatore";
        default: return "Sconosciuto";
      }
    } else {
      switch (scope) {
        case 0: return "None";
        case 1: return "Enemy";
        case 2: return "Enemies";
        case 3: return "1 random enemy";
        case 4: return "2 random enemies";
        case 5: return "3 random enemies";
        case 6: return "4 random enemies";
        case 7: return "Ally";
        case 8: return "All allies";
        case 9: return "Corpse";
        case 10: return "Corpses";
        case 11: return "User";
        default: return "Unknown";
      }
    }
  };

  Window_ItemDetail.prototype.getOccasionName = function (occasion) {
    const useTranslation = ConfigManager.language === "it";
    if (useTranslation) {
      switch (occasion) {
        case 0: return "Sempre";
        case 1: return "Battaglia";
        case 2: return "Menu";
        case 3: return "Mai";
        default: return "Sconosciuto";
      }
    } else {
      switch (occasion) {
        case 0: return "Always";
        case 1: return "Battle Only";
        case 2: return "Menu Only";
        case 3: return "Never";
        default: return "Unknown";
      }
    }
  };

  Window_ItemDetail.prototype.getDamageTypeName = function (type) {
    const useTranslation = ConfigManager.language === "it";
    if (useTranslation) {
      switch (type) {
        case 1: return "-HP";
        case 2: return "-MP";
        case 3: return "HP";
        case 4: return "MP";
        case 5: return "Assorbi HP";
        case 6: return "Assorbi MP";
        default: return "Nessun danno";
      }
    } else {
      switch (type) {
        case 1: return "HP Damage";
        case 2: return "MP Damage";
        case 3: return "HP Recovery";
        case 4: return "MP Recovery";
        case 5: return "HP Drain";
        case 6: return "MP Drain";
        default: return "No Damage";
      }
    }
  };

  Window_ItemDetail.prototype.getElementName = function (elementId) {
    if (!elementId || elementId <= 1) return null;
    if ($dataSystem && $dataSystem.elements && $dataSystem.elements[elementId]) {
      let elementName = $dataSystem.elements[elementId];
      if (window.translateText && typeof window.translateText === "function") {
        elementName = window.translateText(elementName);
      }
      return elementName;
    }
    return "Element " + elementId;
  };

  Window_ItemDetail.prototype.getFormulaPreview = function (formula) {
    const useTranslation = ConfigManager.language === "it";
    if (!formula) return "?";
    let display = formula;

    if (useTranslation) {
      display = display.replace(/a\.atk/g, "FRZ").replace(/b\.def/g, "COS")
                       .replace(/a\.mat/g, "INT").replace(/b\.mdf/g, "SAG")
                       .replace(/a\.agi/g, "DES").replace(/b\.luk/g, "PSI");
    } else {
      display = display.replace(/a\.atk/g, "STR").replace(/b\.def/g, "COS")
                       .replace(/a\.mat/g, "INT").replace(/b\.mdf/g, "WIS")
                       .replace(/a\.agi/g, "DEX").replace(/b\.luk/g, "PSI");
    }

    if (display.length > 30) {
      display = display.substring(0, 27) + "...";
    }
    return display;
  };

  Window_ItemDetail.prototype.getEffectDescription = function (effect) {
    if (!effect) return null;
    const useTranslation = ConfigManager.language === "it";

    switch (effect.code) {
      case Game_Action.EFFECT_RECOVER_HP:
        const hpPercent = effect.value1 * 100;
        const hpFlat = effect.value2;
        if (hpPercent === 0 && hpFlat === 0) return null;
        if (hpPercent === 0) return (useTranslation ? "HP: " : "HP: ") + hpFlat;
        if (hpFlat === 0) return (useTranslation ? "HP: " : "HP: ") + hpPercent + "%";
        const hpSign = hpFlat > 0 ? "+ " : "";
        return (useTranslation ? "HP: " : "HP: ") + hpPercent + "% " + hpSign + hpFlat;
      case Game_Action.EFFECT_RECOVER_MP:
        const mpPercent = effect.value1 * 100;
        const mpFlat = effect.value2;
        if (mpPercent === 0 && mpFlat === 0) return null;
        if (mpPercent === 0) return (useTranslation ? "MP: " : "MP: ") + mpFlat;
        if (mpFlat === 0) return (useTranslation ? "MP: " : "MP: ") + mpPercent + "%";
        const mpSign = mpFlat > 0 ? "+ " : "";
        return (useTranslation ? "MP: " : "MP: ") + mpPercent + "% " + mpSign + mpFlat;
      case Game_Action.EFFECT_GAIN_TP:
        if (effect.value1 === 0) return null;
        return (useTranslation ? "AP: " : "AP: ") + effect.value1;
      case Game_Action.EFFECT_ADD_STATE:
        if (effect.value1 === 0) return null;
        return (
          (useTranslation ? "Status: " : "Status: ") +
          this.getStateName(effect.dataId)
        );
      case Game_Action.EFFECT_REMOVE_STATE:
        if (effect.value1 === 0) return null;
        return (useTranslation ? "Cure: " : "Cura: ") + this.getStateName(effect.dataId);
      case Game_Action.EFFECT_ADD_BUFF:
        if (effect.value1 === 0) return null;
        return (
          (useTranslation ? "+Buff: " : "+Buff: ") +
          this.getParameterName(effect.dataId) + " (" + effect.value1 + (useTranslation ? " turni)" : " turns)")
        );
      case Game_Action.EFFECT_ADD_DEBUFF:
        if (effect.value1 === 0) return null;
        return (
          (useTranslation ? "+Debuff: " : "+Debuff: ") +
          this.getParameterName(effect.dataId) + " (" + effect.value1 + (useTranslation ? " turni)" : " turns)")
        );
      case Game_Action.EFFECT_REMOVE_BUFF:
        return (useTranslation ? "-Buff: " : "-Buff: ") + this.getParameterName(effect.dataId);
      case Game_Action.EFFECT_REMOVE_DEBUFF:
        return (useTranslation ? "-Debuff: " : "-Debuff: ") + this.getParameterName(effect.dataId);
      case Game_Action.EFFECT_SPECIAL:
        return useTranslation ? "Speciale" : "Special";
      case Game_Action.EFFECT_GROW:
        if (effect.value1 === 0) return null;
        return (
          (useTranslation ? "Aumenta: " : "Grow: ") +
          this.getParameterName(effect.dataId) + " +" + effect.value1
        );
      case Game_Action.EFFECT_LEARN_SKILL:
        return (useTranslation ? "Impara: " : "Learn: ") + this.getSkillName(effect.dataId);
      case Game_Action.EFFECT_COMMON_EVENT:
        return useTranslation ? "Evento" : "Event";
      default:
        return null;
    }
  };

  Window_ItemDetail.prototype.getTraitDescription = function (trait) {
    if (!trait) return null;
    const useTranslation = ConfigManager.language === "it";

    const code = trait.code;
    const dataId = trait.dataId;
    const value = trait.value;

    switch (code) {
      case Game_BattlerBase.TRAIT_ELEMENT_RATE:
        if (value === 1) return null;
        return "Elem: " + this.getElementName(dataId) + " x" + Math.floor(value * 100) + "%";
      case Game_BattlerBase.TRAIT_DEBUFF_RATE:
        if (value === 1) return null;
        return "Debuff: " + this.getParameterName(dataId) + " x" + Math.floor(value * 100) + "%";
      case Game_BattlerBase.TRAIT_STATE_RATE:
        if (value === 1) return null;
        return (useTranslation ? "Stato: " : "State: ") + this.getStateName(dataId) + " x" + Math.floor(value * 100) + "%";
      case Game_BattlerBase.TRAIT_STATE_RESIST:
        return (useTranslation ? "Resisti: " : "Resist: ") + this.getStateName(dataId);
      case Game_BattlerBase.TRAIT_PARAM:
        if (value === 1) return null;
        return (useTranslation ? "Stat: " : "Stat: ") + this.getParameterName(dataId) + " x" + Math.floor(value * 100) + "%";
      case Game_BattlerBase.TRAIT_XPARAM:
        if (value === 0) return null;
        return (useTranslation ? "Abilità: " : "Skill: ") + this.getXParameterName(dataId) + " +" + Math.floor(value * 100) + "%";
      case Game_BattlerBase.TRAIT_SPARAM:
        if (value === 0 || value === 1) return null;
        return (useTranslation ? "Abilità: " : "Skill: ") + this.getSParameterName(dataId) + " x" + Math.floor(value * 100) + "%";
      case Game_BattlerBase.TRAIT_ATTACK_ELEMENT:
        return (useTranslation ? "Elem.: " : "Element: ") + this.getElementName(dataId);
      case Game_BattlerBase.TRAIT_ATTACK_STATE:
        if (value === 0) return null;
        return (useTranslation ? "Status: " : "State: ") + this.getStateName(dataId) + " " + Math.floor(value * 100) + "%";
      case Game_BattlerBase.TRAIT_ATTACK_SPEED:
        if (value === 0) return null;
        return (useTranslation ? "Velocità: " : "Speed: ") + value;
      case Game_BattlerBase.TRAIT_ATTACK_TIMES:
        if (value === 0) return null;
        return (useTranslation ? "Volte:" : "Times: ") + value;
      case Game_BattlerBase.TRAIT_STYPE_ADD:
        return (useTranslation ? "+ Type: " : "+Type: ") + this.getSkillTypeName(dataId);
      case Game_BattlerBase.TRAIT_STYPE_SEAL:
        return (useTranslation ? "Sigilla: " : "Seal: ") + this.getSkillTypeName(dataId);
      case Game_BattlerBase.TRAIT_SKILL_ADD:
        return (useTranslation ? "Abilità: " : "Skill: ") + this.getSkillName(dataId);
      case Game_BattlerBase.TRAIT_SKILL_SEAL:
        return (useTranslation ? "Sigilla: " : "Seal: ") + this.getSkillName(dataId);
      case Game_BattlerBase.TRAIT_EQUIP_WTYPE:
        return "Equip: " + this.getWeaponTypeName(dataId);
      case Game_BattlerBase.TRAIT_EQUIP_ATYPE:
        return "Equip: " + this.getArmorTypeName(dataId);
      case Game_BattlerBase.TRAIT_EQUIP_LOCK:
        return (useTranslation ? "Blocca: " : "Lock: ") + this.getEquipTypeName(dataId);
      case Game_BattlerBase.TRAIT_EQUIP_SEAL:
        return (useTranslation ? "Sigilla: " : "Seal: ") + this.getEquipTypeName(dataId);
      case Game_BattlerBase.TRAIT_SLOT_TYPE:
        return "Slot: " + dataId;
      case Game_BattlerBase.TRAIT_ACTION_PLUS:
        if (value === 0) return null;
        return (useTranslation ? "Extra: " : "Extra: ") + Math.floor(value * 100) + "%";
      case Game_BattlerBase.TRAIT_SPECIAL_FLAG:
        return (useTranslation ? "Speciale: " : "Special: ") + this.getSpecialFlagName(dataId);
      case Game_BattlerBase.TRAIT_COLLAPSE_TYPE:
        return (useTranslation ? "Collasso: " : "Collapse: ") + dataId;
      case Game_BattlerBase.TRAIT_PARTY_ABILITY:
        return (useTranslation ? "Party: " : "Party: ") + this.getPartyAbilityName(dataId);
      default:
        return null;
    }
  };

  Window_ItemDetail.prototype.getStateName = function (stateId) {
    const useTranslation = ConfigManager.language === "it";
    if (!$dataStates || !$dataStates[stateId])
      return (useTranslation ? "Status " : "State ") + stateId;
    let stateName = $dataStates[stateId].name;
    if (window.translateText && typeof window.translateText === "function") {
      stateName = window.translateText(stateName);
    }
    return stateName;
  };

  Window_ItemDetail.prototype.getParameterName = function (paramId) {
    const useTranslation = ConfigManager.language === "it";
    const params = useTranslation
      ? ["MaxHP", "MaxMP", "FRZ", "COS", "INT", "SAG", "DES", "PSI"]
      : ["MaxHP", "MaxMP", "STR", "COS", "INT", "WIS", "DEX", "PSI"];
    return params[paramId] || "Param " + paramId;
  };

  Window_ItemDetail.prototype.getXParameterName = function (xparamId) {
    const useTranslation = ConfigManager.language === "it";
    const xparams = useTranslation
      ? ["% Colpire", "Evasione", "Critico", "Ev. Critica", "Ev. Magica", "Riflesso", "Contrattacco", "Rig. HP", "Rig. MP", "Rig. AP"]
      : ["Hit %", "Evasion", "Critical Rate", "Critical Evasion", "Magic Evasion", "Magic Reflection", "Counter", "HP Regen.", "MP Regen.", "AP Regen."];
    return xparams[xparamId] || "XParam " + xparamId;
  };

  Window_ItemDetail.prototype.getSParameterName = function (sparamId) {
    const useTranslation = ConfigManager.language === "it";
    const sparams = useTranslation
      ? ["% Target", "Guardia", "Recupero", "Farmacologia", "Costo MP", "Carica AP", "Fisico", "Magico", "Ambientale", "Tasso EXP"]
      : ["Target Rate", "Guard", "Recovery", "Pharmacology", "MP Cost", "AP Charge", "Physical", "Magical", "Ambience", "EXP Rate"];
    return sparams[sparamId] || "SParam " + sparamId;
  };

  Window_ItemDetail.prototype.getSpecialFlagName = function (flagId) {
    const useTranslation = ConfigManager.language === "it";
    const flags = useTranslation
      ? ["Auto", "Guardia", "Sostituto", "Preserva AP"]
      : ["Auto", "Guard", "Substitute", "Preserve AP"];
    return flags[flagId] || "Flag " + flagId;
  };

  Window_ItemDetail.prototype.getPartyAbilityName = function (abilityId) {
    const useTranslation = ConfigManager.language === "it";
    const abilities = useTranslation
      ? ["Incontri Dimezzati", "Nessun Incontro", "No Imboscate", "Aumenta Iniziativa", "Raddoppia Euro", "Raddoppia Drop"]
      : ["Encounter Half", "Encounter None", "Cancel Surprise", "Raise Preemptive", "Double Euro", "Item Double"];
    return abilities[abilityId] || "Ability " + abilityId;
  };

  Window_ItemDetail.prototype.getSkillName = function (skillId) {
    if (!$dataSkills || !$dataSkills[skillId]) return "Skill " + skillId;
    let skillName = $dataSkills[skillId].name;
    if (window.translateText && typeof window.translateText === "function") {
      skillName = window.translateText(skillName);
    }
    return skillName;
  };

  Window_ItemDetail.prototype.getSkillTypeName = function (stypeId) {
    const useTranslation = ConfigManager.language === "it";
    if (!$dataSystem || !$dataSystem.skillTypes || !$dataSystem.skillTypes[stypeId]) {
      return (useTranslation ? "Tipo Abilità " : "Skill Type ") + stypeId;
    }
    let skillTypeName = $dataSystem.skillTypes[stypeId];
    if (window.translateText && typeof window.translateText === "function") {
      skillTypeName = window.translateText(skillTypeName);
    }
    return skillTypeName;
  };

  Window_ItemDetail.prototype.getWeaponTypeName = function (wtypeId) {
    const useTranslation = ConfigManager.language === "it";
    if (!$dataSystem || !$dataSystem.weaponTypes || !$dataSystem.weaponTypes[wtypeId]) {
      return (useTranslation ? "Tipo Arma " : "Weapon Type ") + wtypeId;
    }
    let weaponTypeName = $dataSystem.weaponTypes[wtypeId];
    if (window.translateText && typeof window.translateText === "function") {
      weaponTypeName = window.translateText(weaponTypeName);
    }
    return weaponTypeName;
  };

  Window_ItemDetail.prototype.getArmorTypeName = function (atypeId) {
    const useTranslation = ConfigManager.language === "it";
    if (!$dataSystem || !$dataSystem.armorTypes || !$dataSystem.armorTypes[atypeId]) {
      return (useTranslation ? "Tipo Armatura " : "Armor Type ") + atypeId;
    }
    let armorTypeName = $dataSystem.armorTypes[atypeId];
    if (window.translateText && typeof window.translateText === "function") {
      armorTypeName = window.translateText(armorTypeName);
    }
    return armorTypeName;
  };

  Window_ItemDetail.prototype.getEquipTypeName = function (etypeId) {
    const useTranslation = ConfigManager.language === "it";
    if (!$dataSystem || !$dataSystem.equipTypes || !$dataSystem.equipTypes[etypeId]) {
      return (useTranslation ? "Tipo Equip " : "Equip Type ") + etypeId;
    }
    let equipTypeName = $dataSystem.equipTypes[etypeId];
    if (window.translateText && typeof window.translateText === "function") {
      equipTypeName = window.translateText(equipTypeName);
    }
    return equipTypeName;
  };

  //=============================================================================
  // SHOP-SPECIFIC CODE
  //=============================================================================

  //=============================================================================
  // Modify Window_ShopStatus to act as a bridge
  //=============================================================================

  const _Window_ShopStatus_initialize = Window_ShopStatus.prototype.initialize;
  Window_ShopStatus.prototype.initialize = function(rect) {
      _Window_ShopStatus_initialize.call(this, rect);
      this._detailWindow = null;
  };

  Window_ShopStatus.prototype.setDetailWindow = function(detailWindow) {
      this._detailWindow = detailWindow;
  };

  const _Window_ShopStatus_setItem = Window_ShopStatus.prototype.setItem;
  Window_ShopStatus.prototype.setItem = function(item) {
      _Window_ShopStatus_setItem.call(this, item);
      if (this._detailWindow) {
          this._detailWindow.setItem(item);
      }
  };

  // Make the status window invisible
  const _Window_ShopStatus_refresh = Window_ShopStatus.prototype.refresh;
  Window_ShopStatus.prototype.refresh = function() {
      this.contents.clear();
      this.hideBackgroundDimmer();
      this.hide();
  };

  //=============================================================================
  // Modify Scene_Shop to add our detail window
  //=============================================================================

  const _Scene_Shop_create = Scene_Shop.prototype.create;
  Scene_Shop.prototype.create = function() {
      _Scene_Shop_create.call(this);
      this.createItemDetailWindow();
  };

  Scene_Shop.prototype.createItemDetailWindow = function() {
      const rect = this.statusWindowRect();
      this._itemDetailWindow = new Window_ItemDetail(rect);
      this.addWindow(this._itemDetailWindow);
      this._statusWindow.setDetailWindow(this._itemDetailWindow);
  };

  //=============================================================================
  // Modify Window_ShopBuy to work with our detail window
  //=============================================================================

  const _Window_ShopBuy_updateHelp = Window_ShopBuy.prototype.updateHelp;
  Window_ShopBuy.prototype.updateHelp = function() {
      _Window_ShopBuy_updateHelp.call(this);
      if (this._statusWindow) {
          this._statusWindow.setItem(this.item());
      }
  };

  // Override Window_ShopBuy to fix name truncation
  const _Window_ShopBuy_drawItem = Window_ShopBuy.prototype.drawItem;
  Window_ShopBuy.prototype.drawItem = function(index) {
      const item = this.itemAt(index);
      const price = this.price(item);
      const rect = this.itemLineRect(index);
      const priceWidth = this.textWidth(price);
      const iconWidth = ImageManager.iconWidth + 4;
      const nameWidth = rect.width - iconWidth - priceWidth - this.textPadding() * 2;

      this.changePaintOpacity(this.isEnabled(item));
      this.drawIcon(item.iconIndex, rect.x, rect.y + (rect.height - ImageManager.iconHeight) / 2);

      const maxNameLength = "Pasticcio di cervo".length;
      const displayName = utils.truncateTextWithEllipsis(item.name, maxNameLength);

      this.drawText(displayName, rect.x + iconWidth, rect.y, nameWidth);
      this.drawText(price, rect.x + rect.width - priceWidth, rect.y, priceWidth, "right");
      this.changePaintOpacity(true);
  };

  //=============================================================================
  // Modify Window_ShopSell to work with our detail window
  //=============================================================================

  const _Window_ShopSell_updateHelp = Window_ShopSell.prototype.updateHelp;
  Window_ShopSell.prototype.updateHelp = function() {
      _Window_ShopSell_updateHelp.call(this);
      if (SceneManager._scene._statusWindow) {
          SceneManager._scene._statusWindow.setItem(this.item());
      }
  };

  //=============================================================================
  // Fix for the Sell window
  //=============================================================================

  const _Window_ShopSell_maxCols = Window_ShopSell.prototype.maxCols;
  Window_ShopSell.prototype.maxCols = function() {
      return 1; // Force single column display
  };

  const _Window_ShopSell_itemHeight = Window_ShopSell.prototype.itemHeight;
  Window_ShopSell.prototype.itemHeight = function() {
      return this.lineHeight(); // Use standard line height
  };

  // Override drawItem for Sell window
  const _Window_ShopSell_drawItem = Window_ShopSell.prototype.drawItem;
  Window_ShopSell.prototype.drawItem = function(index) {
      const item = this._data[index];
      if (!item) return;
      const rect = this.itemLineRect(index);
      const x = rect.x + this.textPadding();
      const y = rect.y;
      const width = rect.width - this.textPadding() * 2;
      const priceY = y;

      let priceWidth = 0;
      let priceText = "";
      if (this._price) {
          const price = this._price(item);
          priceText = price + " €";
          priceWidth = this.textWidth(priceText) + 10;
      }

      const nameWidth = width - 60 - priceWidth;
      this.changePaintOpacity(this.isEnabled(item));
      const maxNameLength = "Pasticcio di cervo".length;
      const displayName = utils.truncateTextWithEllipsis(item.name, maxNameLength);
      this.drawItemName(item, x, y, nameWidth, displayName);
      this.resetPaintOpacity();

      if (this._price) {
          this.drawText(priceText, x + width - this.textWidth(priceText), priceY, this.textWidth(priceText), 'right');
      }

      // Use the master weight functions from ItemSystemUtils
      const grams = utils.getItemWeight(item);
      if (grams > 1) { // Only show weight if it's more than the 1g default
          const weightStr = utils.formatWeight(grams);
          const weightY = y + this.lineHeight();
          const weightWidth = this.textWidth(weightStr);
          this.drawText(weightStr, x + width - weightWidth, weightY, weightWidth, 'right');
      }

      this.changePaintOpacity(true);
  };

  // Custom drawItemName for Sell window
  Window_ShopSell.prototype.drawItemName = function(item, x, y, width, displayName) {
      if (item) {
          const iconY = y + (this.lineHeight() - ImageManager.iconHeight) / 2;
          const textMargin = ImageManager.iconWidth + 4;
          const itemWidth = Math.max(0, width - textMargin);
          this.resetTextColor();
          this.drawIcon(item.iconIndex, x, iconY);
          this.drawText(displayName || item.name, x + textMargin, y, itemWidth);
      }
  };

  const _Scene_Shop_sellWindowRect = Scene_Shop.prototype.sellWindowRect;
  Scene_Shop.prototype.sellWindowRect = function() {
      const rect = _Scene_Shop_sellWindowRect.call(this);
      return rect;
  };

  //=============================================================================
  // Export Window_ItemDetail globally so inventory can use it
  //=============================================================================
  window.Window_ItemDetail = Window_ItemDetail;

})();

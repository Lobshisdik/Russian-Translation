/*:
 * @target MZ
 * @plugindesc Shared utilities for character creation system (localization, gender, traits, constants)
 * @author Omni-Lex
 * @orderAfter DB
 * @orderAfter TraitSelector
 * @orderBefore StartingEquipment
 * @orderBefore CharacterPresets
 * @orderBefore ClassSelection
 * @orderBefore CharacterCreation
 *
 * @help
 * This plugin provides shared utilities for the character creation system:
 * - Localization helpers (getLocalizedText, getLocalizedChoice)
 * - Gender and reproductive type management
 * - Trait application system (integrates with TraitSelector)
 * - Shared constants (variable IDs, gender/reproduction types)
 * - Parameter modification helpers
 *
 * Dependencies:
 * - DB.js (for localization support)
 * - TraitSelector.js (for trait integration)
 * - Health_Core.js (for archetype system)
 *
 * DO NOT call this plugin directly. It provides utilities for other plugins.
 */

(() => {
  const pluginName = "CharacterCreationShared";

  //=============================================================================
  // Constants - Variable IDs
  //=============================================================================
  const VAR_PLAYER1_GENDER = 38;
  const VAR_PLAYER2_GENDER = 39;
  const VAR_PLAYER3_GENDER = 40;
  const VAR_PLAYER1_REPRODUCTIVE_TYPE = 87;
  const VAR_PLAYER2_REPRODUCTIVE_TYPE = 115;
  const VAR_PLAYER3_REPRODUCTIVE_TYPE = 116;

  //=============================================================================
  // Constants - Gender & Reproduction Types
  //=============================================================================
  const GENDER_TYPES = {
    MALE: 0,
    FEMALE: 1,
    NON_BINARY: 2,
    COCOON: 3
  };

  const REPRODUCTION_TYPES = {
    NONE: -1,
    TESTICLES: 0,    // Male
    UTERUS: 1,       // Female
    OVIPAROUS: 2,    // Egg-laying
    PLANT: 3,        // Spore-based
    MITOSIS: 4       // Asexual (Cocoon)
  };

  //=============================================================================
  // Localization Helpers
  //=============================================================================

  /**
   * Get localized text based on current language setting
   * @param {string} englishText - English version
   * @param {string} italianText - Italian version
   * @returns {string} Localized text
   */
  function getLocalizedText(englishText, italianText) {
    return ConfigManager.language === "it" ? italianText : englishText;
  }

  /**
   * Get localized choice object for menus
   * @param {string} englishName - English name
   * @param {string} italianName - Italian name
   * @param {string} symbol - Choice symbol
   * @param {string} englishDesc - English description
   * @param {string} italianDesc - Italian description
   * @param {*} value - Optional value
   * @param {string} bgImage - Optional background image
   * @returns {object} Choice object
   */
  function getLocalizedChoice(
    englishName,
    italianName,
    symbol,
    englishDesc,
    italianDesc,
    value = null,
    bgImage = ""
  ) {
    return {
      name: getLocalizedText(englishName, italianName),
      symbol: symbol,
      description: getLocalizedText(englishDesc, italianDesc),
      value: value,
      bgImage: bgImage
    };
  }

  //=============================================================================
  // Gender & Reproduction System
  //=============================================================================

  /**
   * Get gender variable ID for party member index
   * @param {number} memberIndex - Party member index (0, 1, 2)
   * @returns {number} Gender variable ID
   */
  function getGenderVariableId(memberIndex) {
    switch (memberIndex) {
      case 0: return VAR_PLAYER1_GENDER;
      case 1: return VAR_PLAYER2_GENDER;
      case 2: return VAR_PLAYER3_GENDER;
      default:
        console.warn(`Invalid party member index: ${memberIndex}`);
        return VAR_PLAYER1_GENDER;
    }
  }

  /**
   * Get reproductive type variable ID for party member index
   * @param {number} memberIndex - Party member index (0, 1, 2)
   * @returns {number} Reproductive type variable ID
   */
  function getReproductiveVariableId(memberIndex) {
    switch (memberIndex) {
      case 0: return VAR_PLAYER1_REPRODUCTIVE_TYPE;
      case 1: return VAR_PLAYER2_REPRODUCTIVE_TYPE;
      case 2: return VAR_PLAYER3_REPRODUCTIVE_TYPE;
      default:
        console.warn(`Invalid party member index: ${memberIndex}`);
        return VAR_PLAYER1_REPRODUCTIVE_TYPE;
    }
  }

  /**
   * Apply gender selection and set reproductive type
   * @param {number} memberIndex - Party member index (0, 1, 2)
   * @param {number} genderValue - Gender value (0=Male, 1=Female, 2=Non-binary, 3=Cocoon)
   */
  function applyGenderAndReproduction(memberIndex, genderValue) {
    const genderVar = getGenderVariableId(memberIndex);
    const reproductiveVar = getReproductiveVariableId(memberIndex);

    // Set gender variable
    $gameVariables.setValue(genderVar, genderValue);

    // Set reproduction type based on gender
    switch (genderValue) {
      case GENDER_TYPES.MALE:
        $gameVariables.setValue(reproductiveVar, REPRODUCTION_TYPES.TESTICLES);
        break;
      case GENDER_TYPES.FEMALE:
        $gameVariables.setValue(reproductiveVar, REPRODUCTION_TYPES.UTERUS);
        break;
      case GENDER_TYPES.NON_BINARY:
        // Random (0-4: Testicles, Uterus, Oviparous, Plant, Mitosis)
        $gameVariables.setValue(reproductiveVar, Math.floor(Math.random() * 5));
        break;
      case GENDER_TYPES.COCOON:
        $gameVariables.setValue(reproductiveVar, REPRODUCTION_TYPES.MITOSIS);
        break;
      default:
        console.warn(`Unknown gender value: ${genderValue}`);
        $gameVariables.setValue(reproductiveVar, REPRODUCTION_TYPES.NONE);
    }
  }

  /**
   * Set random gender for a party member
   * @param {number} memberIndex - Party member index (0, 1, 2)
   */
  function applyRandomGender(memberIndex) {
    const randomGender = Math.floor(Math.random() * 4); // 0-3
    applyGenderAndReproduction(memberIndex, randomGender);
  }

  /**
   * Get gender choices for selection menu
   * @returns {array} Array of gender choice objects
   */
  function getGenderChoices() {
    return [
      {
        name: getLocalizedText("Male", "Maschio"),
        symbol: "gender",
        value: GENDER_TYPES.MALE
      },
      {
        name: getLocalizedText("Female", "Femmina"),
        symbol: "gender",
        value: GENDER_TYPES.FEMALE
      },
      {
        name: getLocalizedText("Non binary", "Non binario"),
        symbol: "gender",
        value: GENDER_TYPES.NON_BINARY
      },
      {
        name: getLocalizedText("Cocoon", "Bozzolo"),
        symbol: "gender",
        value: GENDER_TYPES.COCOON
      }
    ];
  }

  //=============================================================================
  // Trait Application System
  //=============================================================================

  /**
   * Apply traits to an actor using trait IDs from TraitSelector
   * @param {Game_Actor} actor - Actor to apply traits to
   * @param {array} traitIds - Array of trait IDs
   */
  function applyTraitsToActor(actor, traitIds) {
    if (!actor || !traitIds || traitIds.length === 0) return;

    // Try to use TraitSelector's applyTraitsByIds method if available
    const TraitSelectorScene = window.Scene_TraitSelector;
    if (TraitSelectorScene && TraitSelectorScene.prototype.applyTraitsByIds) {
      try {
        const tempScene = new TraitSelectorScene();
        tempScene.applyTraitsByIds(traitIds, actor.actorId());
        return;
      } catch (e) {
        console.error('Error using TraitSelector.applyTraitsByIds:', e);
        // Fall through to manual application
      }
    }

    // Fallback: manual trait application if TraitSelector not available
    console.warn('TraitSelector plugin not fully loaded, using fallback trait application');
    const TraitsArray = window.ProstheticsData && window.ProstheticsData.Traits;
    if (!TraitsArray) {
      console.error('Cannot apply traits: TraitSelector/DB not loaded');
      return;
    }

    // Store selected traits on the actor
    if (!actor._selectedTraits) {
      actor._selectedTraits = [];
    }

    const selectedTraits = [];

    // Collect trait objects by ID
    traitIds.forEach((traitId) => {
      const trait = TraitsArray.find((t) => t.id === traitId);
      if (trait) {
        selectedTraits.push(trait);
      } else {
        console.warn(`Trait with ID ${traitId} not found in TraitSelector data`);
      }
    });

    // Apply each selected trait
    selectedTraits.forEach((trait) => {
      // Apply positive bonuses
      Object.keys(trait.positive || {}).forEach((param) => {
        addParamToActor(actor, param, trait.positive[param]);
      });

      // Apply negative bonuses
      Object.keys(trait.negative || {}).forEach((param) => {
        addParamToActor(actor, param, trait.negative[param]);
      });

      // Learn skills
      (trait.skills || []).forEach((skillId) => {
        if ($dataSkills[skillId]) {
          actor.learnSkill(skillId);
        }
      });

      // Add items
      (trait.items || []).forEach((itemId) => {
        if ($dataItems[itemId]) {
          $gameParty.gainItem($dataItems[itemId], 1);
        }
      });

      // Add equipment
      (trait.equipment || []).forEach((itemId) => {
        if ($dataWeapons[itemId]) {
          $gameParty.gainItem($dataWeapons[itemId], 1);
        } else if ($dataArmors[itemId]) {
          $gameParty.gainItem($dataArmors[itemId], 1);
        }
      });

      // Set switches
      (trait.switches || []).forEach((switchId) => {
        $gameSwitches.setValue(switchId, true);
      });
    });

    // Store selected traits and refresh
    actor._selectedTraits = selectedTraits;
    actor.refresh();
  }

  /**
   * Add parameter modification to actor
   * @param {Game_Actor} actor - Actor to modify
   * @param {string} paramName - Parameter name (hp, mp, atk, def, mat, mdf, agi, luk, eva)
   * @param {number} value - Value to add
   */
  function addParamToActor(actor, paramName, value) {
    const paramMap = {
      hp: 0,
      mp: 1,
      atk: 2,
      def: 3,
      mat: 4,
      mdf: 5,
      agi: 6,
      luk: 7
    };

    const paramId = paramMap[paramName];
    if (typeof paramId === 'number') {
      if (!actor._paramPlus) {
        actor._paramPlus = [0, 0, 0, 0, 0, 0, 0, 0];
      }
      actor._paramPlus[paramId] = (actor._paramPlus[paramId] || 0) + value;
    } else if (paramName === 'eva') {
      console.log(`Evasion modifier: ${value} (implement via traits if needed)`);
    }
  }

  //=============================================================================
  // Exports to Global Namespace
  //=============================================================================

  window.CharacterCreationUtils = {
    // Constants
    VAR_PLAYER1_GENDER,
    VAR_PLAYER2_GENDER,
    VAR_PLAYER3_GENDER,
    VAR_PLAYER1_REPRODUCTIVE_TYPE,
    VAR_PLAYER2_REPRODUCTIVE_TYPE,
    VAR_PLAYER3_REPRODUCTIVE_TYPE,
    GENDER_TYPES,
    REPRODUCTION_TYPES,

    // Localization
    getLocalizedText,
    getLocalizedChoice,

    // Gender & Reproduction
    getGenderVariableId,
    getReproductiveVariableId,
    applyGenderAndReproduction,
    applyRandomGender,
    getGenderChoices,

    // Traits
    applyTraitsToActor,
    addParamToActor
  };

  console.log(`${pluginName} loaded successfully.`);
})();

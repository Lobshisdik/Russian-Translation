/*:
 * @target MZ
 * @plugindesc Starting equipment and weapon management system for character creation
 * @author Omni-Lex
 * @orderAfter CharacterCreationShared
 * @orderBefore CharacterPresets
 * @orderBefore CharacterCreation
 *
 * @help
 * This plugin manages starting equipment for characters:
 * - Weapon type to weapon ID mapping (weapon pools)
 * - Weapon type icon mapping
 * - Compatible weapon detection for classes
 * - Random weapon selection and equipment
 * - Global starter skills
 *
 * Dependencies:
 * - CharacterCreationShared.js
 *
 * Functions exported to global namespace:
 * - window.StartingEquipment.equipRandomCompatibleWeapon(actor, classId)
 * - window.StartingEquipment.getCompatibleWeapons(compatibleTypes)
 * - window.StartingEquipment.getCompatibleWeaponTypes(classId)
 * - window.StartingEquipment.GLOBAL_STARTER_SKILLS
 * - window.StartingEquipment.weaponTypeIcons
 */

(() => {
  const pluginName = "StartingEquipment";

  //=============================================================================
  // Constants - Global Starter Skills
  //=============================================================================

  // Skills that all characters learn on creation
  const GLOBAL_STARTER_SKILLS = [2, 836, 837, 838, 839, 847];

  //=============================================================================
  // Constants - Weapon Type Icons
  //=============================================================================

  const weaponTypeIcons = {
    1: 96,   // Dagger / Light
    2: 97,   // Sword
    3: 98,   // Flail / Heavy
    4: 99,   // Axe
    5: 100,  // Whip
    6: 101,  // Staff
    7: 102,  // Bow
    8: 114,  // Crossbow / Projectile
    9: 104,  // Gun
    10: 105, // Claw
    11: 106, // Glove
    12: 107  // Spear
  };

  //=============================================================================
  // Constants - Weapon Pools by Type
  //=============================================================================

  // Weapon pool for each weapon type - limited selection of weapon IDs
  // Maps weapon type ID to array of available weapon IDs for that type
  const weaponsForType = {
    1: [43, 44, 173],      // Dagger
    2: [1, 2],             // Sword
    3: [13, 172],          // Heavy
    4: [171, 19],          // Axe
    5: [211],              // Whip
    6: [7],                // Staff
    7: [37],               // Bow
    8: [39, 64],           // Projectile
    9: [58, 59, 62],       // Gun
    10: [12],              // Claw
    11: [31],              // Glove
    12: [25, 26]           // Spear
  };

  //=============================================================================
  // Weapon Functions
  //=============================================================================

  /**
   * Get compatible weapon type IDs for a class
   * @param {number} classId - Class ID
   * @returns {array} Array of weapon type IDs
   */
  function getCompatibleWeaponTypes(classId) {
    const classData = $dataClasses[classId];
    if (!classData) {
      console.warn(`Class with ID ${classId} not found in database`);
      return [];
    }

    // Get the weapon type array from the class data
    // In RPG Maker MZ, this is stored in classData.traits as type code 51 (Weapon Equip)
    const weaponTypes = [];

    if (classData.traits && Array.isArray(classData.traits)) {
      classData.traits.forEach((trait) => {
        // Trait code 51 is weapon equip type
        if (trait.code === 51) {
          weaponTypes.push(trait.dataId);
        }
      });
    }

    return weaponTypes;
  }

  /**
   * Get weapons for compatible types from the limited pool
   * @param {array} compatibleTypes - Array of weapon type IDs
   * @returns {array} Array of weapon objects
   */
  function getCompatibleWeapons(compatibleTypes) {
    if (!compatibleTypes || compatibleTypes.length === 0) {
      console.warn('No compatible weapon types provided');
      return [];
    }

    const compatibleWeapons = [];

    // For each compatible weapon type, get weapons from the pool
    compatibleTypes.forEach((typeId) => {
      const weaponsOfType = weaponsForType[typeId];
      if (weaponsOfType && Array.isArray(weaponsOfType)) {
        // Add valid weapons from this type's pool to the compatible list
        weaponsOfType.forEach((weaponId) => {
          const weapon = $dataWeapons[weaponId];
          if (weapon) {
            compatibleWeapons.push(weapon);
          }
        });
      }
    });

    return compatibleWeapons;
  }

  /**
   * Equip random compatible weapon for a class
   * @param {Game_Actor} actor - Actor to equip
   * @param {number} classId - Class ID
   * @returns {boolean} Success status
   */
  function equipRandomCompatibleWeapon(actor, classId) {
    if (!actor || !classId) {
      console.warn('Invalid actor or class ID');
      return false;
    }

    // Get compatible weapon types from the class
    const compatibleTypes = getCompatibleWeaponTypes(classId);
    if (compatibleTypes.length === 0) {
      console.warn(`No compatible weapon types found for class ${classId}`);
      return false;
    }

    // Get weapons from the limited pool that match compatible types
    const compatibleWeapons = getCompatibleWeapons(compatibleTypes);
    if (compatibleWeapons.length === 0) {
      console.warn(`No weapons found in pool for compatible types [${compatibleTypes.join(', ')}] for class ${classId}`);
      return false;
    }

    // Select a random weapon from the compatible list
    const randomWeapon = compatibleWeapons[Math.floor(Math.random() * compatibleWeapons.length)];

    if (!randomWeapon) {
      console.warn(`Failed to select random weapon for class ${classId}`);
      return false;
    }

    // Add weapon to party inventory
    $gameParty.gainItem(randomWeapon, 1);

    // Equip weapon to actor (slot 0 is weapon slot)
    try {
      actor.changeEquip(0, randomWeapon);
      console.log(`Equipped ${randomWeapon.name} (Type: ${randomWeapon.wtypeId}) to ${actor.name()} (Class: ${classId})`);
      return true;
    } catch (e) {
      console.error(`Failed to equip weapon: ${e}`);
      return false;
    }
  }

  /**
   * Learn global starter skills for an actor
   * @param {Game_Actor} actor - Actor to teach skills to
   */
  function learnStarterSkills(actor) {
    if (!actor) {
      console.warn('Invalid actor for learning starter skills');
      return;
    }

    GLOBAL_STARTER_SKILLS.forEach((skillId) => {
      if ($dataSkills[skillId]) {
        actor.learnSkill(skillId);
      } else {
        console.warn(`Starter skill ${skillId} not found in database`);
      }
    });
  }

  /**
   * Apply starting gear to an actor (weapon + skills)
   * @param {Game_Actor} actor - Actor to equip
   * @param {number} classId - Class ID
   */
  function applyStartingGear(actor, classId) {
    if (!actor || !classId) {
      console.warn('Invalid actor or class ID for starting gear');
      return;
    }

    // Equip random weapon
    equipRandomCompatibleWeapon(actor, classId);

    // Learn starter skills
    learnStarterSkills(actor);

    console.log(`Applied starting gear to ${actor.name()} (Class: ${classId})`);
  }

  //=============================================================================
  // Exports to Global Namespace
  //=============================================================================

  window.StartingEquipment = {
    // Constants
    GLOBAL_STARTER_SKILLS,
    weaponTypeIcons,
    weaponsForType,

    // Functions
    getCompatibleWeaponTypes,
    getCompatibleWeapons,
    equipRandomCompatibleWeapon,
    learnStarterSkills,
    applyStartingGear
  };

  console.log(`${pluginName} loaded successfully.`);
})();

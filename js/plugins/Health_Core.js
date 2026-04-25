/*:
 * @plugindesc Dwarf Fortress-inspired limb and organ damage system for Actors 1, 2, and 3
 * @author Omni-Lex
 * @help
 * This plugin implements a detailed limb and organ damage system
 * inspired by Dwarf Fortress. Features include:
 * - Individual health for limbs and organs
 * - Damage distribution to body parts
 * - Special effects for damaged body parts
 * - Health menu integration for body part status
 * - Recovery functionality
 * - Stat penalties for fully damaged body parts
 * - Support for multiple party members (Actors 1, 2, 3)
 * - Switch between players with LEFT/RIGHT arrow keys in Health Status menu
 *
 * Plugin Commands:
 *   HealBodyParts [actorId] [amount] - Heals body parts for specified actor
 *   ChangeArchetype [actorId] [archetypeName] - Changes actor's body archetype
 *   CreateCreature [actorId] - Opens UI to create a creature for specified actor
 *
 * @param Menu Command Name
 * @desc The name of the command in the menu
 * @default Health Status
 *
 * @command HealBodyParts
 * @desc Heals all body parts by specified amount
 * @arg actorId
 * @type number
 * @min 1
 * @max 3
 * @default 1
 * @desc Actor ID (1, 2, or 3)
 * @arg amount
 * @type number
 * @default 100
 * @desc Amount of HP to heal body parts
 *
 * @command ChangeArchetype
 * @desc Changes actor's body archetype (Reptilian, Mushroom, etc.)
 * @arg actorId
 * @type number
 * @min 1
 * @max 3
 * @default 1
 * @desc Actor ID (1, 2, or 3)
 * @arg archetypeName
 * @type string
 * @default Humanoid
 * @desc Name of the archetype (must match EnemyArchetypes key)
 *
 * @command CreateCreature
 * @desc Opens creature creator UI (archetype, battler, character sprite selection)
 * @arg actorId
 * @type number
 * @min 1
 * @max 3
 * @default 1
 * @desc Actor ID (1, 2, or 3)
 *
 */

(function () {
  var pluginName = "Health_BiologicSimulation";
  var parameters = {};

  // Get parameters based on RPG Maker version
  if (Utils.RPGMAKER_NAME === "MZ") {
    parameters = PluginManager.parameters(pluginName);
  } else {
    // MV style
    var params = PluginManager.parameters(pluginName);
    parameters = params;
  }
  // Check if we're in MZ and load required window classes
  if (Utils.RPGMAKER_NAME === "MZ") {
    // In MZ, Window_StatusBase is required for actor-related drawing methods
    // Make sure it's loaded before creating our custom window
    if (!window.Window_StatusBase) {
      throw new Error(
        "Window_StatusBase is required for this plugin to work in RPG Maker MZ"
      );
    }
  }

  // Plugin parameters - Handle both MV and MZ
  var pluginName = "Health_Core";
  var parameters = {};

  // Get parameters based on RPG Maker version
  if (Utils.RPGMAKER_NAME === "MZ") {
    parameters = PluginManager.parameters(pluginName);
  } else {
    // MV style
    var params = PluginManager.parameters(pluginName);
    parameters = params;
  }

  var menuCommandName = "Health Status";

  // Helper function to get current body parts based on language

  // Helper function to get translated text
  function getTranslatedText(englishText, italianText) {
    return ConfigManager.language === "it" ? italianText : englishText;
  }

  // Define body parts structure
  const { BodyParts } =
    window.ProstheticsData;
  // Centralized UI Translations
  const UI_TRANSLATIONS = {
    healthStatusMenu: { en: "Health Status", it: "Status Salute" },
    healthWindowHeaders: {
      head: { en: "Head", it: "Testa" },
      torso: { en: "Torso", it: "Corpo" },
      arms: { en: "Arms", it: "Braccia" },
      legs: { en: "Legs", it: "Gambe" },
    },
    paramNames: {
      en: ["Max HP", "Max MP", "ATK", "HIT", "INT", "DEF", "AGI", "LUK"],
      it: ["PV Max", "PM Max", "ATT", "PREC", "INT", "DIF", "AGI", "FOR"],
    },
    windowInstructions: {
      en: "↑↓: Navigate   ESC: Exit",
      it: "↑↓: Naviga   ESC: Esci",
    },
    damagedStatus: { en: "DAMAGED", it: "DANNEGGIATO" },
    battleLogFormat: {
      en: (name, msg, param, amount) =>
        `${name}'s ${msg}${param && amount ? `, ${param} ${amount}!` : "!"}`,
      it: (name, msg, param, amount) =>
        `${name} ${msg}${param && amount ? `, ${param} ${amount}!` : "!"}`,
    },
  };

  // Hit location groups for random targeting
  var HitLocations = {
    HEAD: {
      weight: 10,
      parts: [
        "HEAD",
        "BRAIN",
        "LEFT_EYE",
        "RIGHT_EYE",
        "NOSE",
        "LEFT_EAR",
        "RIGHT_EAR",
        "MOUTH",
        "TEETH",
      ],
    },
    TORSO: {
      weight: 40,
      parts: [
        "TORSO",
        "HEART",
        "LEFT_LUNG",
        "RIGHT_LUNG",
        "LIVER",
        "STOMACH",
        "SPLEEN",
        "INTESTINES",
      ],
    },
    LEFT_ARM: { weight: 15, parts: ["LEFT_ARM", "LEFT_HAND", "LEFT_FINGERS"] },
    RIGHT_ARM: {
      weight: 15,
      parts: ["RIGHT_ARM", "RIGHT_HAND", "RIGHT_FINGERS"],
    },
    LEFT_LEG: { weight: 10, parts: ["LEFT_LEG", "LEFT_FOOT", "LEFT_TOES"] },
    RIGHT_LEG: { weight: 10, parts: ["RIGHT_LEG", "RIGHT_FOOT", "RIGHT_TOES"] },
  };
  /**
   * Retrieves a translated property from a data object.
   */
  function getTranslated(dataObject, propertyName) {
    const lang = ConfigManager.language;
    const langKey = `${propertyName}_${lang}`;
    return lang !== "en" && dataObject[langKey]
      ? dataObject[langKey]
      : dataObject[propertyName];
  }

  /**
   * Retrieves a translated UI string from the UI_TRANSLATIONS object.
   */
  function getTranslatedUI(key) {
    const lang = ConfigManager.language || "en";
    const entry = UI_TRANSLATIONS[key];
    return entry ? entry[lang] || entry["en"] : "";
  }

  // Initialize actor body parts
  function initializeBodyParts(actor) {
    if (actor && !actor._bodyParts) {
      actor._bodyParts = {};
      actor._statModifiers = {};

      const { EnemyArchetypes } = window.ProstheticsData;
      const humanoid = EnemyArchetypes && EnemyArchetypes.Humanoid;
      const sourceParts = humanoid ? humanoid.parts : {};

      for (const partKey in sourceParts) {
        const archetypePart = sourceParts[partKey];
        const hpPercentage = archetypePart.hpPercent / 100;

        actor._bodyParts[partKey] = {
          name: ConfigManager.language === "it" && archetypePart.name_it
            ? archetypePart.name_it
            : archetypePart.name,
          maxHp: Math.round(actor.mhp * hpPercentage),
          currentHp: Math.round(actor.mhp * hpPercentage),
          vital: archetypePart.vital,
          damaged: false,
          equipSlot: archetypePart.equipSlot || null,
          multiple: archetypePart.multiple || false,
          statEffect: archetypePart.statEffect || null,
          damageMsg: ConfigManager.language === "it" && archetypePart.msg_it
            ? archetypePart.msg_it
            : archetypePart.msg || null,
          appliedStatEffect: false,
          hpPercent: archetypePart.hpPercent,
        };
      }

      // Initialize HitLocations from the humanoid archetype
      if (humanoid && humanoid.hitLocations) {
        HitLocations = {};
        for (const locationKey in humanoid.hitLocations) {
          if (actor._bodyParts[locationKey]) {
            HitLocations[locationKey] = {
              weight: humanoid.hitLocations[locationKey].weight,
              parts: [locationKey],
            };
          }
        }
      }
    }
  }

  // Change actor's archetype to a different body structure
  function changeArchetype(actor, archetypeName) {
    if (!actor) return false;
    
    // Get EnemyArchetypes from ProstheticsData
    const { EnemyArchetypes } = window.ProstheticsData;
    
    if (!EnemyArchetypes || !EnemyArchetypes[archetypeName]) {
      console.warn(`Archetype "${archetypeName}" not found in EnemyArchetypes`);
      return false;
    }
    
    const archetype = EnemyArchetypes[archetypeName];
    
    // Clear existing stat modifiers
    if (actor._statModifiers) {
      for (const param in actor._statModifiers) {
        actor._statModifiers[param] = 0;
      }
    } else {
      actor._statModifiers = {};
    }
    
    // Initialize new body parts from archetype
    actor._bodyParts = {};
    actor._currentArchetype = archetypeName;
    
    for (const partKey in archetype.parts) {
      const archetypePart = archetype.parts[partKey];
      const hpPercentage = archetypePart.hpPercent / 100;
      
      actor._bodyParts[partKey] = {
        name: ConfigManager.language === "it" && archetypePart.name_it 
          ? archetypePart.name_it 
          : archetypePart.name,
        maxHp: Math.round(actor.mhp * hpPercentage),
        currentHp: Math.round(actor.mhp * hpPercentage),
        vital: false, // Players don't have vital parts that cause instant death
        damaged: false,
        canCutoff: archetypePart.canCutoff || false,
        statEffect: archetypePart.statEffect || null,
        damageMsg: ConfigManager.language === "it" && archetypePart.msg_it
          ? archetypePart.msg_it
          : archetypePart.msg,
        specialEffect: archetypePart.specialEffect || null,
        appliedStatEffect: false,
      };
    }
    
    // Update HitLocations to match archetype
    if (archetype.hitLocations) {
      HitLocations = {};
      for (const locationKey in archetype.hitLocations) {
        HitLocations[locationKey] = {
          weight: archetype.hitLocations[locationKey].weight,
          parts: [locationKey] // Each location maps to itself as the main part
        };
      }
    }
    
    // Set game variable for reproduction based on actor ID
    // Actor 1 = Variable 87, Actor 2 = Variable 115, Actor 3 = Variable 116
    if ($gameVariables) {
      var reproductionValue = archetype.reproduction !== undefined ? archetype.reproduction : 0;
      var actorId = actor.actorId();
      if (actorId === 1) {
        $gameVariables.setValue(87, reproductionValue);
      } else if (actorId === 2) {
        $gameVariables.setValue(115, reproductionValue);
      } else if (actorId === 3) {
        $gameVariables.setValue(116, reproductionValue);
      }
    }

    // Clear all learned skills and add archetype's base skills
    if (archetype.skills && archetype.skills.length > 0) {
      // Clear all current skills by removing them
      const currentSkills = actor.skills().slice(); // Create a copy of current skills
      currentSkills.forEach(skillId => {
        actor.forgetSkill(skillId);
      });

      // Learn all base skills from the archetype
      archetype.skills.forEach(skillId => {
        if ($dataSkills[skillId]) {
          actor.learnSkill(skillId);
        }
      });

      console.log(`Changed archetype to ${archetypeName}. Cleared skills and added skills:`, archetype.skills);
    }

    // Refresh actor parameters to apply any changes
    actor.refresh();

    return true;
  }
  // Get a random hit location based on weights
  function getRandomHitLocation() {
    var totalWeight = 0;
    var locations = [];

    for (var loc in HitLocations) {
      totalWeight += HitLocations[loc].weight;
      locations.push({
        name: loc,
        weight: HitLocations[loc].weight,
        cumulative: totalWeight,
      });
    }

    var roll = Math.random() * totalWeight;

    for (var i = 0; i < locations.length; i++) {
      if (roll <= locations[i].cumulative) {
        return HitLocations[locations[i].name];
      }
    }

    return HitLocations.TORSO; // Default to torso if something goes wrong
  }

  // Select random body parts from a hit location
  function selectRandomBodyParts(hitLocation, count) {
    var parts = hitLocation.parts.slice();
    var selected = [];

    // Shuffle the parts array
    for (var i = parts.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var temp = parts[i];
      parts[i] = parts[j];
      parts[j] = temp;
    }

    // Select the first 'count' parts or all if there are fewer
    for (var i = 0; i < Math.min(count, parts.length); i++) {
      selected.push(parts[i]);
    }

    return selected;
  }

  // Calculate damage to a body part
  function applyDamageToBodyPart(actor, partKey, damage) {
    var part = actor._bodyParts[partKey];

    if (!part || part.damaged) return 0;

    // Check if actor has more than 60% health, keep limbs at minimum 1hp if so
    var healthPercentage = actor.hp / actor.mhp;
    if (healthPercentage > 0.6) {
      var appliedDamage = Math.min(part.currentHp - 1, damage);
      if (appliedDamage <= 0) return 0;

      part.currentHp -= appliedDamage;
      return appliedDamage;
    } else {
      // Normal damage application if health is 60% or lower
      var appliedDamage = Math.min(part.currentHp, damage);
      part.currentHp -= appliedDamage;

      // Check if the part is now completely damaged
      if (part.currentHp <= 0) {
        part.damaged = true;
        handleDamagedBodyPart(actor, partKey);
      }

      return appliedDamage;
    }
  }

  // Apply stat effect for a fully damaged part
  function applyStatEffect(actor, partKey) {
    var part = actor._bodyParts[partKey];
    
    if (part.appliedStatEffect || !part.statEffect) return;

    // Apply the stat effect from the part's statEffect property
    var paramId = part.statEffect.param;
    var amount = part.statEffect.amount;

    // Track the stat modifier
    if (!actor._statModifiers[paramId]) {
      actor._statModifiers[paramId] = 0;
    }
    actor._statModifiers[paramId] += amount;

    // Mark as applied
    part.appliedStatEffect = true;

    // Refresh actor to apply stat changes
    actor.refresh();
  }

  // Get parameter name for display
  function getParamName(paramId) {
    var paramNames_en = [
      "Max HP",
      "Max MP",
      "STR",
      "Hit Rate",
      "INT",
      "COS",
      "DEX",
      "PSI",
    ];
    var paramNames_it = [
      "PV Max",
      "PM Max",
      "FOR",
      "Precisione",
      "INT",
      "COS",
      "DES",
      "PSI",
    ];
    var paramNames =
      ConfigManager.language === "it" ? paramNames_it : paramNames_en;
    return paramNames[paramId] || "Stat";
  }

  // Handle effects of a damaged body part
  function handleDamagedBodyPart(actor, partKey) {
    var part = actor._bodyParts[partKey];

    // Apply stat effect if part has one and not already applied
    // But exclude any effects on max HP (param 0)
    if (
      !part.appliedStatEffect &&
      part.statEffect &&
      part.statEffect.param !== 0
    ) {
      applyStatEffect(actor, partKey);
    }

    // Unequip items if an equip slot is affected
    /*
    if (part.equipSlot) {
      unequipItemFromSlot(actor, part.equipSlot);
    }*/

    // Mark all child parts as damaged
    if (part.childParts && part.childParts.length > 0) {
      part.childParts.forEach(function (childKey) {
        if (actor._bodyParts[childKey] && !actor._bodyParts[childKey].damaged) {
          actor._bodyParts[childKey].currentHp = 0;
          actor._bodyParts[childKey].damaged = true;
          handleDamagedBodyPart(actor, childKey);
        }
      });
    }

    // Add to battlelog if in battle
    if ($gameParty.inBattle()) {
      $gameTemp.limbDamageLog = {
        name: actor.name(),
        partName: part.name,
        damageMsg: part.damageMsg || (part.name + " damaged!"),
        paramName:
          part.statEffect && part.statEffect.param !== 0
            ? getParamName(part.statEffect.param)
            : null,
        amount:
          part.statEffect && part.statEffect.param !== 0
            ? part.statEffect.amount
            : null,
      };
    }
  }
  // Unequip an item from a slot
  function unequipItemFromSlot(actor, slotName) {
    if (slotName === "leftHand" || slotName === "rightHand") {
      var weapons = actor.weapons();
      if (weapons.length > 0) {
        // Just remove the first weapon for simplicity
        // In a full implementation, you would need to track which weapon is in which hand
        actor.changeEquip(0, null);
      }
    }
  }

  // Restore all body parts function - used for respawn
  function restoreAllBodyParts(actor) {
    if (!actor._bodyParts) return;

    // Reset all stat modifiers
    actor._statModifiers = {};

    for (var part in actor._bodyParts) {
      var bodyPart = actor._bodyParts[part];

      // Fully restore the part
      bodyPart.currentHp = bodyPart.maxHp;
      bodyPart.damaged = false;
      bodyPart.appliedStatEffect = false;
    }

    // Refresh actor to update stats
    actor.refresh();
  }

  // Apply damage to actor with limb damage system
  function applyLimbDamage(actor, damage) {
    if (!actor._bodyParts) initializeBodyParts(actor);

    // Get a random hit location
    var hitLocation = getRandomHitLocation();

    // Select 1-3 random body parts to damage
    var partsToHit = selectRandomBodyParts(
      hitLocation,
      Math.floor(Math.random() * 3) + 1
    );

    // Distribute damage among the selected parts
    var totalDamageApplied = 0;
    var damagePerPart = Math.floor(damage / partsToHit.length);

    partsToHit.forEach(function (partKey) {
      totalDamageApplied += applyDamageToBodyPart(
        actor,
        partKey,
        damagePerPart
      );
    });

    // Apply any remaining damage to the main part of the hit location
    var remainingDamage = damage - totalDamageApplied;
    if (remainingDamage > 0) {
      applyDamageToBodyPart(actor, hitLocation.parts[0], remainingDamage);
    }

    // We no longer show hit location in battlelog
  }

  // Heal body parts function - used by healing items/spells
  function healBodyParts(actor, amount) {
    if (!actor._bodyParts) return;

    // Reset stat modifiers for fully healed parts
    var needsRefresh = false;

    for (var part in actor._bodyParts) {
      var bodyPart = actor._bodyParts[part];

      // If part is damaged and has a stat effect
      if (bodyPart.damaged && bodyPart.appliedStatEffect) {
        // Heal the part
        bodyPart.currentHp = Math.min(
          bodyPart.maxHp,
          bodyPart.currentHp + amount
        );

        // If substantially healed, remove the damage status and stat effect
        if (bodyPart.currentHp >= bodyPart.maxHp / 2) {
          bodyPart.damaged = false;
          bodyPart.appliedStatEffect = false;

          // Reset the stat modifier if it exists and it's not affecting max HP
          if (basePart.statEffect && basePart.statEffect.param !== 0) {
            var paramId = basePart.statEffect.param;
            if (actor._statModifiers[paramId]) {
              actor._statModifiers[paramId] -= basePart.statEffect.amount;
              if (actor._statModifiers[paramId] === 0) {
                delete actor._statModifiers[paramId];
              }
            }
          }

          needsRefresh = true;
        }
      }
      // Regular healing for undamaged parts
      else if (!bodyPart.damaged) {
        bodyPart.currentHp = Math.min(
          bodyPart.maxHp,
          bodyPart.currentHp + amount
        );
      }
    }

    // Refresh actor to update stats if needed
    if (needsRefresh) {
      actor.refresh();
    }
  }

  // Override param calculation to apply body part damage effects
  var _Game_Actor_param = Game_Actor.prototype.param;
  Game_Actor.prototype.param = function (paramId) {
    var value = _Game_Actor_param.call(this, paramId);

    // Apply limb damage modifiers for Actors 1, 2, or 3, but exclude max HP (paramId 0)
    if (
      (this.actorId() === 1 || this.actorId() === 2 || this.actorId() === 3) &&
      this._statModifiers &&
      this._statModifiers[paramId] &&
      paramId !== 0
    ) {
      value += this._statModifiers[paramId];
    }

    return Math.max(1, value);
  };
  // Define Window_HealthStatus class BEFORE it's used
  function Window_HealthStatus() {
    this.initialize(...arguments);
  }

  if (Utils.RPGMAKER_NAME === "MZ") {
    Window_HealthStatus.prototype = Object.create(Window_StatusBase.prototype);
  } else {
    Window_HealthStatus.prototype = Object.create(Window_Selectable.prototype);
  }

  Window_HealthStatus.prototype.constructor = Window_HealthStatus;

  Window_HealthStatus.prototype.initialize = function () {
    if (Utils.RPGMAKER_NAME === "MZ") {
      // MZ style initialization with Rectangle
      Window_StatusBase.prototype.initialize.call(
        this,
        new Rectangle(0, 0, Graphics.boxWidth, Graphics.boxHeight)
      );
    } else {
      // MV style initialization
      Window_Selectable.prototype.initialize.call(
        this,
        0,
        0,
        Graphics.boxWidth,
        Graphics.boxHeight
      );
    }

    this._currentActorIndex = 0; // Start with first party member
    this.setupBodyPartsList();
    this.refresh();
    this.activate();
    this.select(0);
  };

  Window_HealthStatus.prototype.setupBodyPartsList = function () {
    this._actor = $gameParty.members()[this._currentActorIndex];
    if (!this._actor) return;

    if (!this._actor._bodyParts) initializeBodyParts(this._actor);

    // Create list of body parts for display - dynamically from actor's current parts
    this._bodyPartsList = [];

    // Simply list all parts that exist on the actor
    for (var partKey in this._actor._bodyParts) {
      var part = this._actor._bodyParts[partKey];
      if (part) {
        this._bodyPartsList.push({
          isHeader: false,
          key: partKey,
          part: part,
          indent: false, // No indentation for archetype parts
        });
      }
    }
  };

  Window_HealthStatus.prototype.addPartsToList = function (partKeys) {
    for (var i = 0; i < partKeys.length; i++) {
      var partKey = partKeys[i];
      var part = this._actor._bodyParts[partKey];

      if (part) {
        // Add part to list with reference to its key
        this._bodyPartsList.push({
          isHeader: false,
          key: partKey,
          part: part,
          // Determine indentation level
          indent:
            partKey !== "HEAD" &&
            partKey !== "TORSO" &&
            partKey !== "LEFT_ARM" &&
            partKey !== "RIGHT_ARM" &&
            partKey !== "LEFT_LEG" &&
            partKey !== "RIGHT_LEG",
        });
      }
    }
  };

  Window_HealthStatus.prototype.maxItems = function () {
    return this._bodyPartsList ? this._bodyPartsList.length : 0;
  };

  Window_HealthStatus.prototype.refresh = function () {
    this.contents.clear();
    this._actor = $gameParty.members()[this._currentActorIndex];

    if (this._actor) {
      if (!this._actor._bodyParts) initializeBodyParts(this._actor);

      var lineHeight = this.lineHeight();

      // Draw player switcher indicator at top
      this.drawPlayerSwitcher(0, 0);

      // Draw actor name and HP using compatible methods
      if (Utils.RPGMAKER_NAME === "MZ") {
        this.drawActorName(this._actor, 6, lineHeight, 150);
        this.drawActorHp(this._actor, 220, lineHeight, 180);
      } else {
        // MV style
        this.drawActorName(this._actor, 6, lineHeight);
        this.drawActorHp(this._actor, 220, lineHeight);
      }

      this.drawHorzLine(lineHeight * 2);

      // Items are drawn by drawItem when the window refreshes
      this.drawAllItems();
    }
  };

  // Draw player switcher indicator showing current actor and navigation hint
  Window_HealthStatus.prototype.drawPlayerSwitcher = function(x, y) {
    var width = this.contentsWidth();
    var partySize = $gameParty.members().length;

    // Draw navigation hint
    var navText = getTranslatedText("← → Switch Player", "← → Cambia Giocatore");
    this.changeTextColor(this.systemColor());
    this.drawText(navText, x, y, width, 'center');
    this.resetTextColor();

    // Draw player indicators (dots)
    if (partySize > 1) {
      var dotSpacing = 24;
      var totalWidth = (partySize - 1) * dotSpacing;
      var startX = x + (width - totalWidth) / 2;

      for (var i = 0; i < partySize; i++) {
        var dotX = startX + i * dotSpacing;
        var dotY = y + this.lineHeight() / 2 + 16;
        var dotSize = 8;

        if (i === this._currentActorIndex) {
          // Active player - filled circle
          this.contents.fillRect(dotX - dotSize / 2, dotY - dotSize / 2, dotSize, dotSize, this.systemColor());
        } else {
          // Inactive player - empty circle
          this.contents.strokeRect(dotX - dotSize / 2, dotY - dotSize / 2, dotSize, dotSize, this.normalColor());
        }
      }
    }
  };

  // Update Window_HealthStatus drawItem method for damaged body parts
  Window_HealthStatus.prototype.drawItem = function (index) {
    if (
      !this._bodyPartsList ||
      index < 0 ||
      index >= this._bodyPartsList.length
    )
      return;

    var item = this._bodyPartsList[index];
    var rect = this.itemRect(index);

    // Clear the item area
    this.contents.clearRect(rect.x, rect.y, rect.width, rect.height);

    if (item.isHeader) {
      // Draw section header
      this.changeTextColor(this.systemColor());
      this.drawText(item.name, rect.x + 6, rect.y, rect.width - 12);
      this.resetTextColor();
    } else {
      // Draw body part
      var part = item.part;
      var x = rect.x + (item.indent ? 30 : 10);
      var width = rect.width - (item.indent ? 40 : 20);
      var gaugeWidth = 120;
      var textWidth = width - gaugeWidth - 10;

      // Draw part name
      this.drawText(part.name, x, rect.y, textWidth);

      // Draw HP gauge
      if (part.damaged) {
        var damagedText = getTranslatedText("DAMAGED", "DANNEGGIATO");
        this.drawText(damagedText, x + textWidth + 10, rect.y, gaugeWidth);

        if (Utils.RPGMAKER_NAME === "MZ") {
          this.changeTextColor(ColorManager.deathColor());
        } else {
          this.changeTextColor(this.deathColor());
        }

        // Draw stat effect if applied
        if (part.appliedStatEffect && part.statEffect) {
          var statEffect = part.statEffect;
          var paramName = getParamName(statEffect.param);
          var statText = paramName + " " + statEffect.amount;
          this.drawText(
            statText,
            x,
            rect.y + this.lineHeight() - 4,
            width,
            "right"
          );
        }
      } else {
        this.drawBodyPartGauge(
          x + textWidth + 10,
          rect.y,
          gaugeWidth,
          part.currentHp / part.maxHp
        );
        this.drawText(
          part.currentHp + "/" + part.maxHp,
          x + textWidth + 10,
          rect.y,
          gaugeWidth,
          "right"
        );
      }

      this.resetTextColor();
    }
  };

  // Define item height for scrolling
  Window_HealthStatus.prototype.itemHeight = function () {
    return this.lineHeight();
  };

  // Item width is the full width of the window
  Window_HealthStatus.prototype.itemWidth = function () {
    return this.contents.width;
  };

  // Handle window item visibility
  Window_HealthStatus.prototype.topRow = function () {
    return Math.floor(this._scrollY / this.itemHeight());
  };

  Window_HealthStatus.prototype.setTopRow = function (row) {
    var scrollY =
      Math.max(0, Math.min(row, this.maxTopRow())) * this.itemHeight();
    if (this._scrollY !== scrollY) {
      this._scrollY = scrollY;
      this.refresh();
      this.refreshCursor(); // Changed from updateCursor to refreshCursor
    }
  };

  Window_HealthStatus.prototype.maxTopRow = function () {
    return Math.max(0, this.maxItems() - this.maxPageRows());
  };

  Window_HealthStatus.prototype.maxPageRows = function () {
    var pageHeight = this.height - this.padding * 2;
    // Reserve space for player switcher, actor info at top, and instructions at bottom
    pageHeight -= this.lineHeight() * 4;
    return Math.floor(pageHeight / this.itemHeight());
  };

  // Override cursor movement methods
  Window_HealthStatus.prototype.cursorDown = function (wrap) {
    var index = this.index();
    var maxItems = this.maxItems();
    var maxPageRows = this.maxPageRows();

    if (index < maxItems - 1) {
      this.select((index + 1) % maxItems);
    } else if (wrap) {
      this.select(0);
    }
  };

  Window_HealthStatus.prototype.cursorUp = function (wrap) {
    var index = this.index();
    var maxItems = this.maxItems();

    if (index > 0) {
      this.select((index - 1 + maxItems) % maxItems);
    } else if (wrap) {
      this.select(maxItems - 1);
    }
  };

  Window_HealthStatus.prototype.isCursorVisible = function () {
    var row = this.row();
    return row >= this.topRow() && row <= this.bottomRow();
  };

  Window_HealthStatus.prototype.ensureCursorVisible = function () {
    var row = this.row();
    if (row < this.topRow()) {
      this.setTopRow(row);
    } else if (row > this.bottomRow()) {
      this.setTopRow(row - (this.maxPageRows() - 1));
    }
  };

  // Add mouse wheel support for scrolling
  Window_HealthStatus.prototype.processWheel = function () {
    if (this.isOpenAndActive()) {
      var threshold = 20;
      if (TouchInput.wheelY >= threshold) {
        this.scrollDown(1);
      }
      if (TouchInput.wheelY <= -threshold) {
        this.scrollUp(1);
      }
    }
  };

  Window_HealthStatus.prototype.scrollDown = function (num) {
    var newTopRow = Math.min(this.topRow() + num, this.maxTopRow());
    this.setTopRow(newTopRow);
  };

  Window_HealthStatus.prototype.scrollUp = function (num) {
    var newTopRow = Math.max(this.topRow() - num, 0);
    this.setTopRow(newTopRow);
  };
  Window_HealthStatus.prototype.update = function () {
    if (Utils.RPGMAKER_NAME === "MZ") {
      Window_StatusBase.prototype.update.call(this);
    } else {
      Window_Selectable.prototype.update.call(this);
    }

    // Process mouse wheel scrolling
    this.processWheel();

    // Process left/right keys for player switching
    this.processPlayerSwitch();
  };

  // Handle left/right input for switching between party members
  Window_HealthStatus.prototype.processPlayerSwitch = function() {
    if (!this.isOpenAndActive()) return;

    var partySize = $gameParty.members().length;
    if (partySize <= 1) return;

    if (Input.isRepeated('right')) {
      this.switchToNextActor();
    } else if (Input.isRepeated('left')) {
      this.switchToPreviousActor();
    }
  };

  Window_HealthStatus.prototype.switchToNextActor = function() {
    var partySize = $gameParty.members().length;
    this._currentActorIndex = (this._currentActorIndex + 1) % partySize;
    SoundManager.playCursor();
    this.setupBodyPartsList();
    this.select(0); // Reset selection to top
    this.refresh();
  };

  Window_HealthStatus.prototype.switchToPreviousActor = function() {
    var partySize = $gameParty.members().length;
    this._currentActorIndex = (this._currentActorIndex - 1 + partySize) % partySize;
    SoundManager.playCursor();
    this.setupBodyPartsList();
    this.select(0); // Reset selection to top
    this.refresh();
  };

  // Override selection handling
  Window_HealthStatus.prototype.select = function (index) {
    if (Utils.RPGMAKER_NAME === "MZ") {
      Window_StatusBase.prototype.select.call(this, index);
    } else {
      Window_Selectable.prototype.select.call(this, index);
    }
    this.ensureCursorVisible();
    this.refreshCursor();
  };

  Window_HealthStatus.prototype.refreshCursor = function () {
    if (this._cursorAll) {
      this.refreshCursorForAll();
    } else if (this.index() >= 0) {
      var rect = this.itemRect(this.index());
      this.setCursorRect(rect.x, rect.y, rect.width, rect.height);
    } else {
      this.setCursorRect(0, 0, 0, 0);
    }
  };

  Window_HealthStatus.prototype.bottomRow = function () {
    return Math.max(0, this.topRow() + this.maxPageRows() - 1);
  };

  Window_HealthStatus.prototype.row = function () {
    return Math.floor(this.index() / this.maxCols());
  };

  Window_HealthStatus.prototype.maxCols = function () {
    return 1;
  };

  // Helper method for drawing body part gauges
  Window_HealthStatus.prototype.drawBodyPartGauge = function (
    x,
    y,
    width,
    rate
  ) {
    var fillW = Math.floor(width * rate);
    var gaugeY = y + this.lineHeight() - 8;
    var gaugeHeight = 6;

    // Get colors based on RPG Maker version
    var backColor, color1, color2;

    if (Utils.RPGMAKER_NAME === "MZ") {
      backColor = ColorManager.gaugeBackColor();
      color1 = ColorManager.hpGaugeColor1();
      color2 = ColorManager.hpGaugeColor2();
    } else {
      backColor = this.gaugeBackColor();
      color1 = this.hpGaugeColor1();
      color2 = this.hpGaugeColor2();
    }

    this.contents.fillRect(x, gaugeY, width, gaugeHeight, backColor);
    this.contents.gradientFillRect(
      x,
      gaugeY,
      fillW,
      gaugeHeight,
      color1,
      color2
    );
  };

  Window_HealthStatus.prototype.drawHorzLine = function (y) {
    var lineY = y + this.lineHeight() / 2 - 1;
    this.contents.paintOpacity = 48;
    var color =
      Utils.RPGMAKER_NAME === "MZ"
        ? ColorManager.normalColor()
        : this.normalColor();
    this.contents.fillRect(0, lineY, this.contentsWidth(), 2, color);
    this.contents.paintOpacity = 255;
  };

  Window_HealthStatus.prototype.processCancel = function () {
    // Don't call parent processCancel to avoid double scene popping
    SceneManager.pop();
  };
  Scene_HealthStatus.prototype.popScene = function () {
    SceneManager.pop();
  };

  // Helper methods for color compatibility between MV and MZ
  Window_HealthStatus.prototype.systemColor = function () {
    return Utils.RPGMAKER_NAME === "MZ"
      ? ColorManager.systemColor()
      : Window_Base.prototype.systemColor.call(this);
  };

  Window_HealthStatus.prototype.normalColor = function () {
    return Utils.RPGMAKER_NAME === "MZ"
      ? ColorManager.normalColor()
      : Window_Base.prototype.normalColor.call(this);
  };

  Window_HealthStatus.prototype.hpGaugeColor1 = function () {
    return Utils.RPGMAKER_NAME === "MZ"
      ? ColorManager.hpGaugeColor1()
      : Window_Base.prototype.hpGaugeColor1.call(this);
  };

  Window_HealthStatus.prototype.hpGaugeColor2 = function () {
    return Utils.RPGMAKER_NAME === "MZ"
      ? ColorManager.hpGaugeColor2()
      : Window_Base.prototype.hpGaugeColor2.call(this);
  };

  Window_HealthStatus.prototype.deathColor = function () {
    return Utils.RPGMAKER_NAME === "MZ"
      ? ColorManager.deathColor()
      : Window_Base.prototype.deathColor.call(this);
  };

  Window_HealthStatus.prototype.resetTextColor = function () {
    if (Utils.RPGMAKER_NAME === "MZ") {
      this.changeTextColor(ColorManager.normalColor());
    } else {
      Window_Base.prototype.resetTextColor.call(this);
    }
  };

  Window_HealthStatus.prototype.changeTextColor = function (color) {
    if (Utils.RPGMAKER_NAME === "MZ") {
      this.contents.textColor = color;
    } else {
      Window_Base.prototype.changeTextColor.call(this, color);
    }
  };

  // Add compatibility methods for MV if running in MZ
  if (Utils.RPGMAKER_NAME === "MZ") {
    // These methods need to be added for MV compatibility if they don't exist
    if (!Window_HealthStatus.prototype.drawActorName) {
      Window_HealthStatus.prototype.drawActorName = function (
        actor,
        x,
        y,
        width
      ) {
        width = width || 168;
        this.changeTextColor(ColorManager.hpColor(actor));
        this.drawText(actor.name(), x, y, width);
      };
    }

    if (!Window_HealthStatus.prototype.drawActorHp) {
      Window_HealthStatus.prototype.drawActorHp = function (
        actor,
        x,
        y,
        width
      ) {
        width = width || 186;
        const color1 = ColorManager.hpGaugeColor1();
        const color2 = ColorManager.hpGaugeColor2();
        this.drawGauge(x, y, width, actor.hpRate(), color1, color2);
        this.changeTextColor(ColorManager.systemColor());
        this.drawText(TextManager.hpA, x, y, 44);
        this.drawCurrentAndMax(
          actor.hp,
          actor.mhp,
          x,
          y,
          width,
          this.hpColor(actor),
          ColorManager.normalColor()
        );
      };
    }

    if (!Window_HealthStatus.prototype.drawCurrentAndMax) {
      Window_HealthStatus.prototype.drawCurrentAndMax = function (
        current,
        max,
        x,
        y,
        width,
        color1,
        color2
      ) {
        const labelWidth = this.textWidth("HP");
        const valueWidth = this.textWidth("0000");
        const slashWidth = this.textWidth("/");
        const x1 = x + width - valueWidth;
        const x2 = x1 - slashWidth;
        const x3 = x2 - valueWidth;
        this.changeTextColor(color1);
        this.drawText(current, x3, y, valueWidth, "right");
        this.changeTextColor(ColorManager.normalColor());
        this.drawText("/", x2, y, slashWidth, "right");
        this.changeTextColor(color2);
        this.drawText(max, x1, y, valueWidth, "right");
      };
    }

    if (!Window_HealthStatus.prototype.hpColor) {
      Window_HealthStatus.prototype.hpColor = function (actor) {
        if (actor.isDead()) {
          return ColorManager.deathColor();
        } else if (actor.isDying()) {
          return ColorManager.crisisColor();
        } else {
          return ColorManager.normalColor();
        }
      };
    }
  }

  // Create the health status scene class
  function Scene_HealthStatus() {
    this.initialize(...arguments);
  }

  Scene_HealthStatus.prototype = Object.create(Scene_MenuBase.prototype);
  Scene_HealthStatus.prototype.constructor = Scene_HealthStatus;

  Scene_HealthStatus.prototype.initialize = function () {
    Scene_MenuBase.prototype.initialize.call(this);
    // Set switch 127 when health status menu is opened
    $gameSwitches.setValue(127, true);
  };

  Scene_HealthStatus.prototype.create = function () {
    Scene_MenuBase.prototype.create.call(this);
    this.createHealthStatusWindow();
    // Add this line to make sure cancel handling is set up
    this._healthStatusWindow.setHandler("cancel", this.popScene.bind(this));
  };

  Scene_HealthStatus.prototype.start = function () {
    Scene_MenuBase.prototype.start.call(this);
    // Refresh body parts list when scene starts (in case archetype changed)
    this._healthStatusWindow.setupBodyPartsList();
    this._healthStatusWindow.refresh();
  };

  Scene_HealthStatus.prototype.createHealthStatusWindow = function () {
    this._healthStatusWindow = new Window_HealthStatus();
    this.addWindow(this._healthStatusWindow);
  };

  // Add health status to the menu - DISABLED (moved to CustomSceneStatus.js)

  /*
  var _Window_MenuCommand_addOriginalCommands =
    Window_MenuCommand.prototype.addOriginalCommands;
  Window_MenuCommand.prototype.addOriginalCommands = function () {
    _Window_MenuCommand_addOriginalCommands.call(this);

    var menuText = getTranslatedText(menuCommandName, "Status Salute");
    this.addCommand(menuText, "healthStatus", true, 84);
    var menuText2 = getTranslatedText("Biologics", "Biologia");
    this.addCommand(menuText2, "biologics", true, 81);
  };

  var _Scene_Menu_createCommandWindow =
    Scene_Menu.prototype.createCommandWindow;
  Scene_Menu.prototype.createCommandWindow = function () {
    _Scene_Menu_createCommandWindow.call(this);
    this._commandWindow.setHandler(
      "healthStatus",
      this.commandHealthStatus.bind(this)
    );
    this._commandWindow.setHandler(
      "biologics",
      this.commandBiologics.bind(this)
    );
  };

  Scene_Menu.prototype.commandHealthStatus = function () {
    SceneManager.push(Scene_HealthStatus);
  };
  */

  // Keep only the Biologics menu command
  var _Window_MenuCommand_addOriginalCommands =
    Window_MenuCommand.prototype.addOriginalCommands;
  Window_MenuCommand.prototype.addOriginalCommands = function () {
    _Window_MenuCommand_addOriginalCommands.call(this);

    var menuText2 = getTranslatedText("Biologics", "Biologia");
    this.addCommand(menuText2, "biologics", true, 81);
  };

  var _Scene_Menu_createCommandWindow =
    Scene_Menu.prototype.createCommandWindow;
  Scene_Menu.prototype.createCommandWindow = function () {
    _Scene_Menu_createCommandWindow.call(this);
    this._commandWindow.setHandler(
      "biologics",
      this.commandBiologics.bind(this)
    );
  };

  // Override damage application
  var _Game_Action_executeHpDamage = Game_Action.prototype.executeHpDamage;
  Game_Action.prototype.executeHpDamage = function (target, value) {
    _Game_Action_executeHpDamage.call(this, target, value);

    // Apply limb damage system to Actors 1, 2, and 3
    if (target.isActor() && (target.actorId() === 1 || target.actorId() === 2 || target.actorId() === 3) && value > 0) {
      applyLimbDamage(target, value);

      // Check if HP is zero or less and restore body parts if so
      if (target.hp <= 0) {
        restoreAllBodyParts(target);
      }
    }
  };
  // Add hooks for BattleLog to display limb damage
  var _Window_BattleLog_displayHpDamage =
    Window_BattleLog.prototype.displayHpDamage;
  Window_BattleLog.prototype.displayHpDamage = function (target) {
    _Window_BattleLog_displayHpDamage.call(this, target);

    // Check for limb damage logs - only when body parts are fully damaged
    if ($gameTemp.limbDamageLog && target.isActor() &&
        (target.actorId() === 1 || target.actorId() === 2 || target.actorId() === 3)) {
      var log = $gameTemp.limbDamageLog;

      // Show specific damage message and stat effect if applied
      if (log.paramName && log.amount) {
        if (ConfigManager.language === "it") {
          this.push(
            "addText",
            log.name +
              " " +
              log.damageMsg +
              ", " +
              log.paramName +
              " " +
              log.amount +
              "!"
          );
        } else {
          this.push(
            "addText",
            log.name +
              "'s " +
              log.damageMsg +
              ", " +
              log.paramName +
              " " +
              log.amount +
              "!"
          );
        }
      } else {
        if (ConfigManager.language === "it") {
          this.push("addText", log.name + " " + log.damageMsg + "!");
        } else {
          this.push("addText", log.name + "'s " + log.damageMsg + "!");
        }
      }

      $gameTemp.limbDamageLog = null;
    }
  };

  // Override HP and MP recovery effects to also heal body parts
  var _Game_Action_itemEffectRecoverHp =
    Game_Action.prototype.itemEffectRecoverHp;
  Game_Action.prototype.itemEffectRecoverHp = function (target, effect) {
    _Game_Action_itemEffectRecoverHp.call(this, target, effect);

    // Apply to Actors 1, 2, and 3
    if (target.isActor() && (target.actorId() === 1 || target.actorId() === 2 || target.actorId() === 3)) {
      var value = Math.floor(target.mhp * effect.value1 + effect.value2);
      healBodyParts(target, value);
    }
  };

  var _Game_Action_itemEffectRecoverMp =
    Game_Action.prototype.itemEffectRecoverMp;
  Game_Action.prototype.itemEffectRecoverMp = function (target, effect) {
    _Game_Action_itemEffectRecoverMp.call(this, target, effect);

    // Apply to Actors 1, 2, and 3
    if (target.isActor() && (target.actorId() === 1 || target.actorId() === 2 || target.actorId() === 3)) {
      var value = Math.floor(target.mmp * effect.value1 + effect.value2);
      healBodyParts(target, Math.floor(value / 2)); // MP recovery items/skills heal body parts at half rate
    }
  };

  // MV/MZ compatibility for plugin commands
  if (Utils.RPGMAKER_NAME === "MZ") {
    PluginManager.registerCommand("Health_Core", "HealBodyParts", (args) => {
      var actorId = Number(args.actorId) || 1;
      var actor = $gameActors.actor(actorId);
      var amount = Number(args.amount) || (actor ? actor.mhp / 2 : 100);
      if (actor) {
        healBodyParts(actor, amount);
      }
    });

    PluginManager.registerCommand("Health_Core", "ChangeArchetype", (args) => {
      var actorId = Number(args.actorId) || 1;
      var actor = $gameActors.actor(actorId);
      var archetypeName = String(args.archetypeName || "Humanoid");
      if (actor) {
        var success = changeArchetype(actor, archetypeName);
        if (success) {
          console.log(`Successfully changed ${actor.name()}'s archetype to ${archetypeName}`);

          // Update reproduction variable based on actor ID
          if (actorId === 1) {
            // Variable 87 already set by changeArchetype
          } else if (actorId === 2) {
            // Set variable 115 for player 2
            const { EnemyArchetypes } = window.ProstheticsData;
            const archetype = EnemyArchetypes[archetypeName];
            if (archetype && $gameVariables) {
              var reproductionValue = archetype.reproduction !== undefined ? archetype.reproduction : 0;
              $gameVariables.setValue(115, reproductionValue);
            }
          } else if (actorId === 3) {
            // Set variable 116 for player 3
            const { EnemyArchetypes } = window.ProstheticsData;
            const archetype = EnemyArchetypes[archetypeName];
            if (archetype && $gameVariables) {
              var reproductionValue = archetype.reproduction !== undefined ? archetype.reproduction : 0;
              $gameVariables.setValue(116, reproductionValue);
            }
          }
        } else {
          console.warn(`Failed to change archetype to ${archetypeName}. Check that it exists in EnemyArchetypes.`);
        }
      }
    });

    PluginManager.registerCommand("Health_Core", "CreateCreature", (args) => {
      var actorId = Number(args.actorId) || 1;
      // The Scene_CreateCreature is now provided by CharacterCreationCreature.js
      if (typeof Scene_CreateCreature !== 'undefined' && Scene_CreateCreature.setTargetActorId) {
        Scene_CreateCreature.setTargetActorId(actorId);
        SceneManager.push(Scene_CreateCreature);
      } else {
        console.warn('Scene_CreateCreature not found. Make sure CharacterCreationCreature.js is loaded.');
      }
    });
  }

  // Expose functions globally for use by other plugins
  window.changeArchetypeForActor = changeArchetype;
  window.initializeBodyParts = initializeBodyParts;
  window.HealthCore = window.HealthCore || {};
  window.HealthCore.restoreAllBodyParts = restoreAllBodyParts;

})();
/*:
 * @plugindesc Enhanced monster limb and organ damage system with targeted attacks
 * @author Inspired by Health_Core
 * @help
 * This plugin implements a detailed limb and organ damage system
 * for enemy monsters. Features include:
 * - Individual health for limbs and organs based on monster archetype
 * - Damage distribution to body parts
 * - Special effects for damaged body parts
 * - Permanent debuffs for destroyed parts during battle
 * - Dynamic enemy archetypes defined in enemy notes
 * - Part severing system for finishing blows
 * - "Check" command to view monster body parts and their HP
 * - NEW: Hit percentage calculation for each body part
 * - NEW: Target specific body parts with calculated hit chance
 * - NEW: Weapon type influences hit chance based on user stats
 * - NEW: Random +/-10% modifier to hit chance for each part
 * - NEW: Bypass vital part protection with targeted attacks
 * - NEW: Persistent targeting when reopening the window
 *
 * Enemy Note Tag Format:
 * <Archetype: Humanoid>
 * <Archetype: Slime>
 * <Archetype: Dragon>
 * etc.
 *
 * Add custom archetypes by extending the EnemyArchetypes object.
 *
 * @param Decapitation Sound
 * @desc Sound effect to play when decapitation occurs
 * @default Monster5
 * @type file
 * @dir audio/se/
 *
 * @param Part Severing Message
 * @desc Message to display when a part is severed
 * @default %1's %2 has been severed!
 *
 * @param Part Destruction Message
 * @desc Message to display when a part is destroyed
 * @default %1's %2 has been destroyed!
 *
 * @param Show Hit Location
 * @desc Show hit location in battle log
 * @type boolean
 * @default true
 *
 * @param Check Command Name
 * @desc Name of the command to check monster body parts
 * @default Check
 *
 * @param Target Command Name
 * @desc Name of the command to target specific body parts
 * @default Target
 * 
 * @command OpenEnemyDetails
 * @text Open Enemy Details
 * @desc Opens the enemy body parts detail window during battle
 *
 * @command OpenTargeting
 * @text Open Targeting Window
 * @desc Opens the targeting window to select a specific body part to attack
 */

(function () {
  // Plugin parameters
  var pluginName = "Health_Monsters";
  var parameters = PluginManager.parameters(pluginName);
  var it = ConfigManager.language === "it";
  var decapitationSound = parameters["Decapitation Sound"] || "Monster5";

  var showHitLocation = String(parameters["Show Hit Location"]) === "true";
  var checkCommandName = parameters["Check Command Name"] || "Check";
  var targetCommandName = parameters["Target Command Name"] || "Target";

  // Initialize $gameTemp if it doesn't exist
  if (!$gameTemp) {
    $gameTemp = {};
  }

  // Global variables to track targeting state
  $gameTemp.targetedBodyPart = null;

  // ===========================================================================
  // Enemy Archetypes Definition
  // ===========================================================================
  // Each archetype defines a set of body parts with their properties
  // ===========================================================================
  // Enemy Archetypes Definition
  // ===========================================================================
  // Each archetype defines a set of body parts with their properties

  const { EnemyArchetypes } = window.ProstheticsData;

  const msgTranslations = {
    "Torso has been crushed into pulp!":
      "Il torso è stato ridotto in poltiglia!",
    "Left Arm has been ripped off!": "Il braccio sinistro è stato strappato!",
    "Right Arm has been ripped off!": "Il braccio destro è stato strappato!",
    "Left Leg has been cut off!!": "La gamba sinistra è stata amputata!!",
    "Right Leg has been cut off!!": "La gamba destra è stata amputata!!",
    "Body has been crushed into pulp!":
      "Il corpo è stato ridotto in poltiglia!",
    "Front Left Leg has been cut off!!":
      "La zampa anteriore sinistra è stata amputata!!",
    "Front Right Leg has been cut off!!":
      "La zampa anteriore destra è stata amputata!!",
    "Rear Left Leg has been cut off!!":
      "La zampa posteriore sinistra è stata amputata!!",
    "Rear Right Leg has been cut off!!":
      "La zampa posteriore destra è stata amputata!!",
    "Tail has been hacked off!": "La coda è stata recisa!",
    "Thorax has been punctured!": "Il torace è stato perforato!",
    "Abdomen has burst open!": "L'addome è esploso!",
    "Middle Left Leg has been cut off!!":
      "La zampa centrale sinistra è stata amputata!!",
    "Middle Right Leg has been cut off!!":
      "La zampa centrale destra è stata amputata!!",
    "Mandibles have been pulverized!": "Le mandibole sono state polverizzate!",
    "Fire Breath Organ has burst into gore!":
      "L'organo del soffio di fuoco è esploso in gore!",
    "Neck has been twisted till it snapped!":
      "Il collo è stato torcigliato finché non si è spezzato!",
    "Core has violently collapsed!": "Il nucleo è crollato violentemente!",
    "Upper Body has been crushed into pulp!":
      "La parte superiore del corpo è stata ridotta in poltiglia!",
    "Lower Body has been crushed into pulp!":
      "La parte inferiore del corpo è stata ridotta in poltiglia!",
    "Pseudopod 1 has been melted into sludge!":
      "Il pseudopode 1 è stato fuso in melma!",
    "Pseudopod 2 has been melted into sludge!":
      "Il pseudopode 2 è stato fuso in melma!",
    "Skull has been obliterated!": "Il cranio è stato obliterato!",
    "Ribcage has caved into gore!":
      "La gabbia toracica è crollata in un ammasso di carne!",
    "Flower has withered to rot!": "Il fiore è appassito e marcito!",
    "Stem has twisted till it split!":
      "Il gambo si è torcito finché non si è spaccato!",
    "Roots have been ripped out!": "Le radici sono state estirpate!",
    "Vine 1 has been ripped into gore!": "La vite 1 è stata fatta a brandelli!",
    "Vine 2 has been ripped into gore!": "La vite 2 è stata fatta a brandelli!",
    "Upper Form has unraveled!": "La forma superiore si è disfatta!",
    "Lower Form has unraveled!": "La forma inferiore si è disfatta!",
    "Left Appendage has been liquefied on impact!":
      "L'appendice sinistra è stata liquefatta all'impatto!",
    "Right Appendage has been liquefied on impact!":
      "L'appendice destra è stata liquefatta all'impatto!",
    "Tail Fin has been sliced off!": "La pinna caudale è stata recisa!",
    "Dorsal Fin has been ripped into gore!":
      "La pinna dorsale è stata fatta a brandelli!",
    "Left Pectoral Fin has been torn to ribbons!":
      "La pinna pettorale sinistra è stata fatta a strisce!",
    "Right Pectoral Fin has been torn to ribbons!":
      "La pinna pettorale destra è stata fatta a strisce!",
    "Mantle has been crushed into pulp!":
      "Il mantello è stato ridotto in poltiglia!",
    "Tentacle 1 has been ripped off!": "Il tentacolo 1 è stato strappato!",
    "Tentacle 2 has been ripped off!": "Il tentacolo 2 è stato strappato!",
    "Tentacle 3 has been ripped off!": "Il tentacolo 3 è stato strappato!",
    "Tentacle 4 has been ripped off!": "Il tentacolo 4 è stato strappato!",
    "Left Arm has been detached!": "Il braccio sinistro è stato sganciato!",
    "Right Arm has been detached!": "Il braccio destro è stato sganciato!",
    "Beak has been obliterated!": "Il becco è stato obliterato!",
    "Talons have been ripped off!": "Gli artigli sono stati strappati!",
    "Cap has been ripped into gore!": "Il cappello è stato fatto a brandelli!",
    "Spore Sacs have burst open!": "Le sacche di spore sono esplose!",
    "Crown has been ripped into gore!": "La chioma è stata fatta a brandelli!",
    "Trunk has cleaved brutally!": "Il tronco è stato spaccato brutalmente!",
    "Branch 1 has been broken off!": "Il ramo 1 è stato spezzato!",
    "Branch 2 has been broken off!": "Il ramo 2 è stato spezzato!",
    "Nucleus has burst open!": "Il nucleo è esploso!",
    "Membrane has melted into sludge!": "La membrana si è fusa in melma!",
    "Flagellum has been torn to ribbons!":
      "Il flagello è stato fatto a strisce!",
    "Toxin Sacs have burst!": "Le sacche di veleno sono esplose!",
    "Head Left has been torn apart!":
      "La testa sinistra è stata fatta a pezzi!",
    "Head Right has been torn apart!": "La testa destra è stata fatta a pezzi!",
    "Stitched Torso has torn down the middle!":
      "Il torace cucito si è lacerato al centro!",
    "Power Stitch has erupted messily!":
      "Il punto di potenza è esploso in modo caotico!",
    "Horns have been shattered!": "Le corna sono state frantumate!",
    "Wings have been shredded!": "Le ali sono state sbrindellate!",
    "Fangs have been shattered!": "Le zanne sono state frantumate!",
    "Body Segment 1 has ruptured!": "Il segmento corporeo 1 si è rotto!",
    "Body Segment 2 has ruptured!": "Il segmento corporeo 2 si è rotto!",
    "Shifting Mass has unraveled!": "La massa mutevole si è disfatta!",
    "Extra Limb 1 has fallen off!": "L'arto extra 1 si è staccato!",
    "Extra Limb 2 has fallen off!": "L'arto extra 2 si è staccato!",
    "Eye Cluster has burst!": "Il cluster di occhi è esploso!",
    "Tail Spike has wrenched free!": "La spina caudale si è sfilata!",
    "Crystal Core has cracked!": "Il nucleo di cristallo si è incrinato!",
    "Left Spire has obliterated!": "La guglia sinistra è stata obliterata!",
    "Right Spire has obliterated!": "La guglia destra è stata obliterata!",
    "Focus Gem has snuffed out!": "Il cristallo focale si è spento!",
    "Shield Crystal has shattered to shards!":
      "Il cristallo di scudo è esploso in schegge!",
    "Tongue has been ripped off!": "La lingua è stata strappata!",
    "Bull Legs have been cut off!": "Le gambe bovine sono state amputate!",
    "Face has disintegrated into vapor!":
      "Il volto si è disintegrato in vapore!",
    "Essence Core has unraveled!": "Il nucleo d'essenza si è disfatto!",
    "Left Wisp has been dispersed!": "La scintilla sinistra è stata dispersa!",
    "Right Wisp has been dispersed!": "La scintilla destra è stata dispersa!",
    "Sensor Array has been wrecked completely!":
      "La matrice di sensori è stata completamente distrutta!",
    "Chassis has been crushed into pulp!":
      "Il telaio è stato ridotto in poltiglia!",
    "Left Propeller has been smashed into wreckage!":
      "L'elica sinistra è stata frantumata in rottami!",
    "Right Propeller has been smashed into wreckage!":
      "L'elica destra è stata frantumata in rottami!",
    "Abyssal Eye has been pierced!": "L'occhio abissale è stato perforato!",
    "Maw has been split open!": "La mascella è stata squarciata!",
    "Void Tendril 1 has withered!": "Il tentacolo del vuoto 1 è appassito!",
    "Void Tendril 2 has withered!": "Il tentacolo del vuoto 2 è appassito!",
    "Core Shard has fractured!": "La scheggia del nucleo si è fratturata!",
  };

  // Weapon type definitions for hit chance calculations
  var WeaponTypes = {
    DAGGER: { id: 1, primaryStat: 6 }, // Agility
    SWORD: { id: 2, primaryStat: 2 }, // Attack
    AXE: { id: 3, primaryStat: 2 }, // Attack
    MACE: { id: 4, primaryStat: 2 }, // Attack
    SPEAR: { id: 5, primaryStat: 6 }, // Agility
    BOW: { id: 6, primaryStat: 6 }, // Agility
    CROSSBOW: { id: 7, primaryStat: 2 }, // Attack
    GUN: { id: 8, primaryStat: 6 }, // Agility
    STAFF: { id: 9, primaryStat: 3 }, // Magic
    HEAVY: { id: 10, primaryStat: 4 }, // Defense
    // Add more as needed
  };

  // Initialize enemy body parts based on enemy notes
  function initializeEnemyBodyParts(enemy) {
    if (enemy._bodyParts) return; // Already initialized

    // Find the enemy's archetype from its notes
    var archetypeRegex = /<Archetype:\s*(\w+)>/i;
    var archetypeMatch = enemy.enemy().note.match(archetypeRegex);

    // Default to Humanoid if no valid archetype is found
    var archetypeName = archetypeMatch ? archetypeMatch[1] : "Humanoid";
    var archetype = EnemyArchetypes[archetypeName];

    if (!archetype) {
      console.error(
        "Invalid archetype: " +
          archetypeName +
          " for enemy " +
          enemy.name() +
          ". Defaulting to Humanoid."
      );
      archetypeName = "Humanoid";
      archetype = EnemyArchetypes.Humanoid;

      // If Humanoid still doesn't exist, this is a critical error
      if (!archetype) {
        console.error(
          "CRITICAL ERROR: Humanoid archetype not defined. This plugin requires a Humanoid archetype to be defined."
        );
        // Create a basic fallback archetype to prevent crashes
        EnemyArchetypes.Humanoid = {
          parts: {
            BODY: {
              name: "Body",
              hpPercent: 100,
              vital: true,
              canCutoff: false,
              statEffect: { param: 0, amount: -20 },
              hitDifficulty: 1,
            },
          },
          hitLocations: {
            BODY: { weight: 100 },
          },
        };
        archetype = EnemyArchetypes.Humanoid;
      }
    }

    // Store the archetype name for reference
    enemy._archetypeName = archetypeName;
    enemy._bodyParts = {};
    enemy._statModifiers = {}; // Track stat modifiers from damaged parts
    enemy._disabledActions = []; // Track actions disabled by body part damage

    // Initialize body parts based on the archetype
    for (var partKey in archetype.parts) {
      var basePart = archetype.parts[partKey];
      var hpPercentage = basePart.hpPercent / 100;

      // Generate random hit chance modifier for this part (+/- 10%)
      var randomHitModifier = (Math.random() * 20 - 10) / 100; // -10% to +10%

      enemy._bodyParts[partKey] = {
        name: basePart.name,
        maxHp: Math.max(1, Math.round(enemy.mhp * hpPercentage)),
        currentHp: Math.max(1, Math.round(enemy.mhp * hpPercentage)),
        vital: basePart.vital || false,
        canCutoff: basePart.canCutoff || false,
        regenerates: basePart.regenerates || false,
        destroyed: false,
        specialEffect: basePart.specialEffect || null,
        appliedStatEffect: false,
        hitDifficulty: basePart.hitDifficulty || 1,
        randomHitModifier: randomHitModifier,
      };
    }
  }

  // Get a random hit location based on weights for an enemy's archetype
  // Fix for getRandomHitLocation function
  function getRandomHitLocation(enemy) {
    try {
      // Ensure we're using enemy1 if targeting system is enabled
      if (enemy !== $gameTroop.members()[0]) {
        console.warn("Warning: enemy is not enemy1, using enemy1 instead");
        enemy = $gameTroop.members()[0];
      }

      // If there's a targeted body part and the hit check succeeds, use that instead
      if (
        $gameTemp &&
        $gameTemp.targetedBodyPart &&
        enemy._bodyParts[$gameTemp.targetedBodyPart]
      ) {
        var hitChance = calculateHitChance(enemy, $gameTemp.targetedBodyPart);
        var roll = Math.random() * 100;

        console.log(
          "Target attempt:",
          $gameTemp.targetedBodyPart,
          "Chance:",
          hitChance,
          "Roll:",
          roll
        );

        if (roll < hitChance) {
          console.log("Target hit successful!");
          return { key: $gameTemp.targetedBodyPart, targeted: true };
        }

        // Important: Log that the targeted attack missed its specific target
        if ($gameTemp) {
          $gameTemp.targetMissMessage = "The targeted attack missed its mark!";
          console.log("Target miss, using random location instead");
        }
      }

      // Otherwise use normal random hit location
      var archetype = EnemyArchetypes[enemy._archetypeName];

      // If archetype doesn't exist, use Humanoid as fallback
      if (!archetype) {
        console.error(
          "Archetype not found: " +
            enemy._archetypeName +
            ". Using Humanoid as fallback."
        );
        archetype = EnemyArchetypes.Humanoid;
        enemy._archetypeName = "Humanoid";
      }

      var hitLocations = archetype.hitLocations;

      var totalWeight = 0;
      var locations = [];

      for (var loc in hitLocations) {
        // Skip already destroyed parts
        if (enemy._bodyParts[loc].destroyed) continue;

        totalWeight += hitLocations[loc].weight;
        locations.push({
          key: loc,
          weight: hitLocations[loc].weight,
          cumulative: totalWeight,
        });
      }

      // If all parts are destroyed or no valid locations, default to the first part
      if (locations.length === 0) {
        var fallbackKey = Object.keys(hitLocations)[0];
        return { key: fallbackKey };
      }

      var roll = Math.random() * totalWeight;

      for (var i = 0; i < locations.length; i++) {
        if (roll <= locations[i].cumulative) {
          return { key: locations[i].key };
        }
      }

      // Failsafe
      return { key: locations[0].key };
    } catch (e) {
      console.error("Error in getRandomHitLocation:", e);
      // Emergency fallback
      return { key: Object.keys(enemy._bodyParts)[0] };
    }
  }

  // Calculate hit chance for a specific body part
  // Calculate hit chance for a specific body part - simplified to always use actor1
  function calculateHitChance(enemy, partKey) {
    var part = enemy._bodyParts[partKey];

    // Guard against missing part or destroyed parts
    if (!part || part.destroyed) return 0;

    // Always use actor1 as the user
    var user = $gameActors.actor(1);

    // Base chance is 80%
    var baseChance = 80;

    // Adjust for part difficulty
    baseChance -= (part.hitDifficulty - 1) * 25;

    // Adjust for vital parts (harder to hit)
    if (part.vital) {
      baseChance -= 10;
    }

    // Get weapon type and adjust based on appropriate user stat
    var weaponType = getWeaponType(user);
    var userStat = 0;
    var enemyStat = 0;

    // Determine which stats to use based on weapon type
    if (weaponType) {
      switch (weaponType.primaryStat) {
        case 2: // Attack
          userStat = user.atk;
          enemyStat = enemy.def;
          break;
        case 3: // Magic
          userStat = user.mat;
          enemyStat = enemy.mdf;
          break;
        case 4: // Defense
          userStat = user.def;
          enemyStat = enemy.def;
          break;
        case 6: // Agility
          userStat = user.agi;
          enemyStat = enemy.agi;
          break;
        default:
          userStat = user.atk;
          enemyStat = enemy.def;
      }
    } else {
      // Default to ATK if no weapon type found
      userStat = user.atk;
      enemyStat = enemy.def;
    }

    // Adjust based on user vs enemy stats
    var statRatio = userStat / Math.max(1, enemyStat);
    baseChance += Math.min(15, Math.floor((statRatio - 1) * 20)); // Max +15% for high stat ratio

    // Apply random modifier for this part (set at battle start)
    baseChance += (part.randomHitModifier || 0) * 100;

    // Clamp the final chance between 5% and 95%
    return Math.max(5, Math.min(95, baseChance));
  }
  // Get the weapon type for an actor
  function getWeaponType(actor) {
    if (!actor || !actor.weapons()[0]) return null;

    var weapon = actor.weapons()[0];
    var wtypeId = weapon.wtypeId;

    // Map game's weapon type ID to our defined types
    for (var key in WeaponTypes) {
      if (WeaponTypes[key].id === wtypeId) {
        return WeaponTypes[key];
      }
    }

    return null;
  }

  // Get the appropriate message for destroyed body part
  function getElementalMessage(elementId) {
    // Map element IDs to descriptive messages
    var elementalMessages = {
      2: "burned", // Fire
      3: "frozen", // Ice
      4: "electrocuted", // Thunder
      5: "soaked", // Water
      6: "sliced", // Earth
      7: "blown away", // Wind
      8: "smithed", // Poison
      9: "corrupted", // Holy
      // Add more elements as needed
    };

    if (ConfigManager.language === "it") {
      var elementalMessages = {
        2: "bruciato", // Fire
        3: "congelato", // Ice
        4: "folgorato", // Thunder
        5: "inzuppato", // Water
        6: "spaccato", // Earth
        7: "spazzato via", // Wind
        8: "disintegrato", // Poison
        9: "corrotto", // Holy
        // Add more elements as needed
      };

      return elementalMessages[elementId] || "distrutto";
    } else {
      return elementalMessages[elementId] || "destroyed";
    }
  }

  // Apply damage to an enemy body part
  function applyDamageToBodyPart(enemy, partKey, damage, isTargeted) {
    try {
      if (!enemy || !enemy._bodyParts) {
        console.error(
          "Enemy or body parts not initialized in applyDamageToBodyPart"
        );
        return 0;
      }
  
      var part = enemy._bodyParts[partKey];
      if (!part) {
        console.error(
          "Part not found: " +
            partKey +
            " for enemy: " +
            (enemy.name ? enemy.name() : "Unknown")
        );
        return 0;
      }
  
      if (part.destroyed) return 0;
  
      // Find the archetype data
      var archetype = EnemyArchetypes[enemy._archetypeName];
      if (!archetype) {
        console.error("Archetype not found: " + enemy._archetypeName);
        return 0;
      }
  
      var basePart = archetype.parts[partKey];
      if (!basePart) {
        console.error(
          "Base part data not found: " +
            partKey +
            " in archetype: " +
            enemy._archetypeName
        );
        return 0;
      }
  
      // Parts can always take damage
      var appliedDamage = Math.min(part.currentHp, damage);
      part.currentHp -= appliedDamage;
  
      // Check if part can be destroyed/severed
      // Vital parts can only be destroyed when enemy HP is below 50%
      // Non-vital parts can only be severed/destroyed when enemy HP is below 50%
      var canBeDestroyed = enemy.hpRate() <= 0.5;
      
      // For vital parts with targeted attacks, allow destruction at 50% or below
      if (basePart.vital && isTargeted && enemy.hpRate() > 0.5) {
        canBeDestroyed = false;
      }
  
      // Check if part is now destroyed
      if (part.currentHp <= 0) {
        part.currentHp = 0;
        
        if (canBeDestroyed) {
          part.destroyed = true;
          handleDestroyedBodyPart(enemy, partKey);
        } else {
          // Keep part at 1 HP if enemy health is too high
          part.currentHp = 1;
          
          // Show message that the part can't be fully destroyed yet
          if ($gameTemp && showHitLocation) {
            if (ConfigManager.language === "it") {
              $gameTemp.hitLocationMessage = 
                part.name + " gravemente danneggiato, ma il mostro è ancora troppo forte!";
            } else {
              $gameTemp.hitLocationMessage = 
                part.name + " severely damaged, but the monster is still too strong!";
            }
          }
        }
      }
  
      return appliedDamage;
    } catch (e) {
      console.error("Error in applyDamageToBodyPart: " + e.message);
      console.error(e.stack);
      return 0;
    }
  }
  
  // Replace the commandTarget handler (around line 1150)
  Scene_Battle.prototype.commandTarget = function () {
    var enemy = $gameTroop.members()[0];
  
    if (enemy && enemy._bodyParts) {
      this._actorCommandWindow.deactivate();
  
      // Create info window (left side)
      this._monsterInfoWindow = new Window_MonsterInfo(enemy);
      this.addWindow(this._monsterInfoWindow);
  
      // Create targeting body parts list window (right side)
      this._bodyPartsWindow = new Window_MonsterBodyPartsList(enemy, true);
      this.addWindow(this._bodyPartsWindow);
      this._bodyPartsWindow.setHandler("ok", this.onTargetingOk.bind(this));
      this._bodyPartsWindow.setHandler("cancel", this.onTargetingCancel.bind(this));
      
      $gameTemp.checkWindowActive = true;
    } else {
      this._actorCommandWindow.activate();
    }
  };

  // Apply stat effect for a destroyed part
  function applyStatEffect(enemy, partKey) {
    var part = enemy._bodyParts[partKey];
    var archetype = EnemyArchetypes[enemy._archetypeName];
    var basePart = archetype.parts[partKey];

    if (part.appliedStatEffect || !basePart.statEffect) return;

    // Apply the stat effect
    var paramId = basePart.statEffect.param;
    var amount = basePart.statEffect.amount;

    // Track the stat modifier
    if (!enemy._statModifiers[paramId]) {
      enemy._statModifiers[paramId] = 0;
    }
    enemy._statModifiers[paramId] += amount;

    // Mark as applied
    part.appliedStatEffect = true;

    // Apply special effects if any
    if (basePart.specialEffect) {
      applySpecialEffect(enemy, basePart.specialEffect);
    }

    // Refresh enemy to apply stat changes
    enemy.refresh();
  }

  // Get the appropriate destruction message based on the part and damage type
  function getDestructionMessage(enemy, partKey, elementalType) {
    var part = enemy._bodyParts[partKey];

    // For elemental damage, always use the elemental message
    if (elementalType && elementalType !== 1) {
      // Skip physical element (ID 1)
      // Map element IDs to descriptive messages
      var elementalMessages = {
        2: "burned", // Fire
        3: "frozen", // Ice
        4: "electrocuted", // Thunder
        5: "drenched", // Water
        6: "crushed", // Earth
        7: "blown away", // Wind
        8: "melted", // Poison
        9: "corrupted", // Holy
        10: "cursed", // Dark
        // Add more elements as needed
      };

      var elementId = elementalType;
      var elementMessage = elementalMessages[elementId] || "destroyed";
      if (ConfigManager.language === "it") {
        var elementalMessages = {
          2: "bruciato", // Fire
          3: "congelato", // Ice
          4: "folgorato", // Thunder
          5: "inzuppato", // Water
          6: "spaccato", // Earth
          7: "spazzato via", // Wind
          8: "sciolto", // Poison
          9: "corrotto", // Holy
          10: "maledetto", // Dark
          // Add more elements as needed
        };

        return (
          enemy.name() + " " + part.name + " è stato " + elementMessage + "!"
        );
      } else {
        return (
          enemy.name() + "'s " + part.name + " has been " + elementMessage + "!"
        );
      }
    }

    // For physical attacks or when no element is specified
    var archetype = EnemyArchetypes[enemy._archetypeName];
    var basePart = archetype.parts[partKey];

    // Use custom message if available
    if (basePart.msg) {
      return enemy.name() + "'s " + basePart.msg;
    }

    // For parts that can be cut off with physical attacks
    if (basePart.canCutoff) {
      var it = ConfigManager.language === "it";
      var partSeveringMessage = it
        ? "%1 %2 recisa!"
        : "%1's %2 has been severed!";
      return partSeveringMessage.format(enemy.name(), part.name);
    }
    var partDestructionMessage = it
      ? "%1 %2 distrutto!"
      : "%1's %2 has been destroyed!";

    // Default destruction message
    return partDestructionMessage.format(enemy.name(), part.name);
  }

  // Handle effects of a destroyed body part
  function handleDestroyedBodyPart(enemy, partKey) {
    try {
      if (!enemy || !enemy._bodyParts) {
        console.error(
          "Enemy or body parts not initialized in handleDestroyedBodyPart"
        );
        return;
      }

      var part = enemy._bodyParts[partKey];
      if (!part) {
        console.error(
          "Part not found: " +
            partKey +
            " for enemy: " +
            (enemy.name ? enemy.name() : "Unknown")
        );
        return;
      }

      // Find the archetype data
      var archetype = EnemyArchetypes[enemy._archetypeName];
      if (!archetype) {
        console.error("Archetype not found: " + enemy._archetypeName);
        return;
      }

      var basePart = archetype.parts[partKey];
      if (!basePart) {
        console.error(
          "Base part data not found: " +
            partKey +
            " in archetype: " +
            enemy._archetypeName
        );
        return;
      }

      // Apply stat effect if not already applied
      if (!part.appliedStatEffect) {
        applyStatEffect(enemy, partKey);
      }

      // Prepare message based on element type
      var elementId = $gameTemp ? $gameTemp.lastElementalType : null;
      var message = "";

      // Check if it's an elemental attack (and not physical)
      if (elementId && elementId > 1) {
        // Use elemental message format
        var elementalEffect = getElementalMessage(elementId);
        message =
          enemy.name() +
          "'s " +
          part.name +
          " has been " +
          elementalEffect +
          "!";
      } else {
        // For physical or non-elemental attacks
        if (basePart.msg) {
          // Custom message if available
          if (ConfigManager.language === "it") {
            basePart.msg_it = basePart.msg_it || basePart.msg;
            message = enemy.name() + " " + basePart.msg_it;
          } else {
            message = enemy.name() + "'s " + basePart.msg;
          }
        } else if (basePart.canCutoff) {
          // Severing message for parts that can be cut off
          if (ConfigManager.language === "it") {
            part.name = part.name_it || part.name;
          }
          var partSeveringMessage = it
            ? "%1 %2 recisa!"
            : "%1's %2 has been severed!";

          message = partSeveringMessage.format(enemy.name(), part.name);

          // Play severing sound
          AudioManager.playSe({
            name: decapitationSound,
            volume: 90,
            pitch: 100,
            pan: 0,
          });
        } else {
          // Default destruction message
          if (ConfigManager.language === "it") {
            part.name = part.name_it || part.name;
          }
          var partDestructionMessage =
            ConfigManager.language === "it"
              ? "%1 %2 distrutto!"
              : "%1's %2 has been destroyed!";

          message = partDestructionMessage.format(enemy.name(), part.name);
        }
      }

      // Store the message in battle log
      if ($gameTemp) {
        $gameTemp.limbDamageBattleLog = {
          type: "custom",
          text: message,
          isVital: basePart.vital,
        };

        // If vital part is destroyed, schedule delayed death
        if (basePart.vital) {
          $gameTemp.vitalPartDestroyedEnemy = enemy;
        }

        // Add stat effect info to the battle log
        if (basePart.statEffect) {
          $gameTemp.statEffectMessage = {
            enemyName: enemy.name(),
            paramName: getParamName(basePart.statEffect.param),
            amount: Math.abs(basePart.statEffect.amount),
          };
        }
      }
    } catch (e) {
      console.error("Error in handleDestroyedBodyPart: " + e.message);
      console.error(e.stack);
    }
  }

  // Apply special effects based on destroyed parts
  function applySpecialEffect(enemy, effect) {
    switch (effect) {
      case "disableFireBreath":
        // Find skills that involve fire breath
        var fireBreathSkillIds = [];
        enemy.enemy().actions.forEach(function (action) {
          var skill = $dataSkills[action.skillId];
          if (
            skill &&
            (skill.name.includes("Fire") || skill.name.includes("Breath"))
          ) {
            fireBreathSkillIds.push(action.skillId);
          }
        });

        // Add these skill IDs to disabled actions
        enemy._disabledActions =
          enemy._disabledActions.concat(fireBreathSkillIds);
        break;

      // Add more special effects as needed
    }
  }

  // Get parameter name for display
  function getParamName(paramId) {
    var paramNames = [
      "Max HP",
      "Max MP",
      "Attack",
      "Magic",
      "Defense",
      "M.Defense",
      "Agility",
      "Luck",
    ];
    return paramNames[paramId] || "Stat";
  }

  // Apply limb damage to enemy
  // Apply limb damage to enemy
// Apply limb damage to enemy - FIXED VERSION
function applyLimbDamage(enemy, damage, elementalType) {
  try {
    // Ensure we're using enemy1
    if (enemy !== $gameTroop.members()[0]) {
      console.warn("Warning: enemy is not enemy1, using enemy1 instead");
      enemy = $gameTroop.members()[0];
    }

    // Make sure enemy has body parts initialized
    if (!enemy._bodyParts) initializeEnemyBodyParts(enemy);

    // Make sure $gameTemp exists
    if (!$gameTemp) {
      $gameTemp = {};
    }

    // Get a random hit location
    var hitLocation = getRandomHitLocation(enemy);
    if (!hitLocation || !hitLocation.key) {
      console.error("Failed to get hit location for enemy: " + enemy.name());
      return;
    }

    var partKey = hitLocation.key;
    if (!enemy._bodyParts[partKey]) {
      console.error(
        "Body part not found: " + partKey + " for enemy: " + enemy.name()
      );
      return;
    }

    var part = enemy._bodyParts[partKey];
    var isTargeted = hitLocation.targeted || false;

    // Show hit location in battle log if enabled
    if (showHitLocation && $gameParty.inBattle()) {
      if (isTargeted) {
        // Show precise strike message for targeted hits
        if (ConfigManager.language === "it") {
          $gameTemp.hitLocationMessage =
            "Un colpo preciso a " + part.name + "!";
        } else {
          $gameTemp.hitLocationMessage =
            "A precise strike to the " + part.name + "!";
        }
      } else if ($gameTemp.targetMissMessage) {
        // Show the miss message if a targeted attack missed
        $gameTemp.hitLocationMessage = $gameTemp.targetMissMessage;
        $gameTemp.targetMissMessage = null; // Clear the message after use
      } else {
        // Default hit message
        if (ConfigManager.language === "it") {
          $gameTemp.hitLocationMessage =
            enemy.name() + "'s " + part.name + " colpito!";
        } else {
          $gameTemp.hitLocationMessage =
            enemy.name() + "'s " + part.name + " was hit!";
        }
      }
    }

    // Apply damage to the part
    applyDamageToBodyPart(enemy, partKey, damage, isTargeted);

    // Store the elemental type for displaying the correct message later
    $gameTemp.lastElementalType = elementalType;

    // Reset targeted body part after use
    if (isTargeted) {
      $gameTemp.targetedBodyPart = null;
    }
  } catch (e) {
    console.error(e.stack);
  }
}
  // Override Game_Enemy.param to apply body part damage effects
  var _Game_Enemy_param = Game_Enemy.prototype.param;
  Game_Enemy.prototype.param = function (paramId) {
    var value = _Game_Enemy_param.call(this, paramId);

    // Apply limb damage modifiers
    if (this._statModifiers && this._statModifiers[paramId]) {
      value += this._statModifiers[paramId];
    }

    return Math.max(1, value);
  };

  // Override action list to disable actions from destroyed parts
  var _Game_Enemy_actions = Game_Enemy.prototype.actions;
  Game_Enemy.prototype.actions = function () {
    var actions = _Game_Enemy_actions.call(this);

    // Filter out disabled actions
    if (this._disabledActions && this._disabledActions.length > 0) {
      return actions.filter(function (action) {
        return !this._disabledActions.includes(action.skillId);
      }, this);
    }

    return actions;
  };

  // Override damage application for enemies
  var _Game_Action_executeHpDamage = Game_Action.prototype.executeHpDamage;
  Game_Action.prototype.executeHpDamage = function (target, value) {
    _Game_Action_executeHpDamage.call(this, target, value);

    // Only apply limb damage system to enemies
    if (target.isEnemy() && value > 0) {
      // Get the elemental type if applicable
      var elementalType = null;
      if (
        this.item() &&
        this.item().damage &&
        this.item().damage.elementId > 0
      ) {
        elementalType = this.item().damage.elementId;
      }

      // Store elemental type for later use
      $gameTemp.lastElementalType = elementalType;

      applyLimbDamage(target, value);
    }
  };

  // Add hooks for BattleLog to display limb damage
  var _Window_BattleLog_displayHpDamage =
    Window_BattleLog.prototype.displayHpDamage;
  Window_BattleLog.prototype.displayHpDamage = function (target) {
    _Window_BattleLog_displayHpDamage.call(this, target);

    // Make sure $gameTemp exists
    if (!$gameTemp) {
      $gameTemp = {};
      return;
    }

    // Show hit location if enabled
    if (showHitLocation && $gameTemp.hitLocationMessage && target.isEnemy()) {
      this.push("addText", $gameTemp.hitLocationMessage);
      $gameTemp.hitLocationMessage = null;
    }

    // Check for limb damage logs
    if ($gameTemp.limbDamageBattleLog && target.isEnemy()) {
      var log = $gameTemp.limbDamageBattleLog;

      // Show the appropriate message
      this.push("addText", log.text);

      // Show stat effect if applicable
      /*
            if ($gameTemp.statEffectMessage) {
                var statMsg = $gameTemp.statEffectMessage;
                this.push('addText', statMsg.enemyName + "'s " + statMsg.paramName + " reduced by " + statMsg.amount + "!");
                $gameTemp.statEffectMessage = null;
            }*/

      // Handle delayed death for vital part destruction
      if (log.isVital && $gameTemp.vitalPartDestroyedEnemy) {
        // Push wait commands to delay the death
        this.push("wait");
        this.push("wait");
        this.push("wait");

        // Schedule enemy death on next update
        $gameTemp.scheduleEnemyDeath = true;
      }

      $gameTemp.limbDamageBattleLog = null;
      $gameTemp.lastElementalType = null;
    }
  };

  // Setup for when battle starts
  var _BattleManager_setup = BattleManager.setup;
  BattleManager.setup = function (troopId, canEscape, canLose) {
    _BattleManager_setup.call(this, troopId, canEscape, canLose);

    // Make sure $gameTemp exists
    if (!$gameTemp) {
      $gameTemp = {};
    }

    // Initialize body parts for all enemies
    $gameTroop.members().forEach(function (enemy) {
      initializeEnemyBodyParts(enemy);
    });

    // Initialize temp variables for vital part destruction
    $gameTemp.vitalPartDestroyedEnemy = null;
    $gameTemp.scheduleEnemyDeath = false;
    $gameTemp.checkTargetSelection = false;
    $gameTemp.checkWindowActive = false;
    $gameTemp.targetedBodyPart = null;
    $gameTemp.hitLocationMessage = null;
    $gameTemp.limbDamageBattleLog = null;
    $gameTemp.lastElementalType = null;
    $gameTemp.statEffectMessage = null;
  };
// ============================================================================
// NEW: Window_MonsterInfo - Left side information window
// ============================================================================

function Window_MonsterInfo() {
  this.initialize.apply(this, arguments);
}

Window_MonsterInfo.prototype = Object.create(Window_Base.prototype);
Window_MonsterInfo.prototype.constructor = Window_MonsterInfo;

Window_MonsterInfo.prototype.initialize = function (enemy) {
  var width = Graphics.boxWidth * 0.55; // Left half
  var height = 520; // Increased from 440 to 520
  var x = 0;
  var y = (Graphics.boxHeight - height) / 2 + 88;
  var rect = new Rectangle(x, y, width, height);
  Window_Base.prototype.initialize.call(this, rect);
  this._enemy = enemy;
  this._monsterDescription = this.extractMonsterDescription(enemy);
  this.refresh();
  this.show();
  this.z = 9999;
};

Window_MonsterInfo.prototype.extractMonsterDescription = function (enemy) {
  if (!enemy || !enemy.enemy() || !enemy.enemy().note) return "";
  const noteText = enemy.enemy().note;
  if (ConfigManager.language === "it") {
    const itMatch = noteText.match(/<It:\s*([^>]+)>/i);
    if (itMatch && itMatch[1]) {
      return this.addLineBreaks(itMatch[1].trim(), 20);
    }
  } else {
    const enMatch = noteText.match(/<En:\s*([^>]+)>/i);
    if (enMatch && enMatch[1]) {
      return this.addLineBreaks(enMatch[1].trim(), 20);
    }
  }
  return "";
};

Window_MonsterInfo.prototype.addLineBreaks = function (text, maxLength) {
  if (!text || text.length <= maxLength) return text;
  var result = "";
  var currentLine = "";
  var words = text.split(" ");
  for (var i = 0; i < words.length; i++) {
    var word = words[i];
    if (currentLine.length + word.length + 1 > maxLength) {
      result += currentLine.trim() + "\n";
      currentLine = word + " ";
    } else {
      currentLine += word + " ";
    }
  }
  if (currentLine.length > 0) {
    result += currentLine.trim();
  }
  return result;
};
Window_MonsterInfo.prototype.refresh = function () {
  this.contents.clear();
  if (!this._enemy || !this._enemy._bodyParts) return;
  var lineHeight = this.lineHeight();
  var y = 0;
  
  // Draw monster description FIRST
  if (this._monsterDescription && this._monsterDescription.length > 0) {
    this.resetTextColor();
    var descLines = this._monsterDescription.split("\n");
    for (var i = 0; i < descLines.length; i++) {
      this.drawText(descLines[i], 10, y, this.contentsWidth() - 20);
      y += lineHeight;
    }
    y += lineHeight / 2; // Add some space after description
  }
  
  // Then draw element info
  this.drawElementInfo(y);
  y += lineHeight * 2; // Two lines for element info
  
  y += lineHeight / 2;
  this.drawHorzLine(y - lineHeight / 2);
  this.drawEnemyStats(y);
  y += lineHeight * 2;
  
  this.drawHorzLine(y - lineHeight / 2);
  this.drawAppliedStates(y);
  this.changeTextColor(this.systemColor());
};

Window_MonsterInfo.prototype.drawHorzLine = function (y) {
  var lineY = y + this.lineHeight() / 2 - 1;
  this.contents.fillRect(0, lineY, this.contentsWidth(), 2, this.systemColor());
};

Window_MonsterInfo.prototype.drawElementInfo = function (y) {
  const useTranslation = ConfigManager.language === "it";
  const lineHeight = this.lineHeight();
  const enemy = this._enemy;
  
  let attackElement = "Normal";
  const traits = enemy.enemy().traits;
  for (let i = 0; i < traits.length; i++) {
    const trait = traits[i];
    if (trait.code === Game_BattlerBase.TRAIT_ATTACK_ELEMENT && trait.dataId > 0) {
      attackElement = $dataSystem.elements[trait.dataId];
      break;
    }
  }
  
  const weaknesses = [];
  for (let i = 1; i < $dataSystem.elements.length; i++) {
    const rate = enemy.elementRate(i) * 100;
    if (rate > 100) {
      weaknesses.push({ name: $dataSystem.elements[i], rate: rate });
    }
  }
  weaknesses.sort((a, b) => b.rate - a.rate);
  
  this.changeTextColor(this.systemColor());
  this.drawText(useTranslation ? "Elemento" : "Element:", 0, y, 140);
  this.resetTextColor();
  this.drawText(attackElement, 140, y, this.contentsWidth() - 140);
  y += lineHeight;
  
  this.changeTextColor(this.systemColor());
  this.drawText(useTranslation ? "Debole a" : "Weak to:", 0, y, 120);
  this.resetTextColor();
  
  if (weaknesses.length > 0) {
    let weaknessText = "";
    for (let i = 0; i < weaknesses.length; i++) {
      const weakness = weaknesses[i];
      if (i > 0) weaknessText += ", ";
      weaknessText += weakness.name + " " + weakness.rate + "%";
    }
    this.drawText(weaknessText, 140, y, this.contentsWidth() - 140);
  } else {
    this.drawText("None", 140, y, this.contentsWidth() - 140);
  }
};

Window_MonsterInfo.prototype.drawEnemyStats = function (y) {
  const useTranslation = ConfigManager.language === "it";
  const enemy = this._enemy;
  const paramNames = useTranslation ? 
    ["FRZ", "INT", "COS", "SAG", "DES"] :
    ["STR", "INT", "COS", "SAG", "DEX"];
  
  const baseValues = [];
  for (let i = 2; i < 7; i++) {
    baseValues.push(enemy.enemy().params[i]);
  }
  
  const currentValues = [];
  for (let i = 2; i < 7; i++) {
    currentValues.push(enemy.param(i));
  }
  
  const startX = 10;
  const availableWidth = this.contentsWidth() - startX - 10;
  const colWidth = Math.floor(availableWidth / 6);
  
  for (let i = 0; i < 5; i++) {
    const x = startX + i * colWidth;
    const current = currentValues[i];
    const base = baseValues[i];
    const diff = current - base;
    
    this.changeTextColor(this.systemColor());
    this.drawText(paramNames[i], x, y, colWidth - 5, 'center');
    
    if (diff < 0) {
      this.changeTextColor(this.powerDownColor());
    } else if (diff > 0) {
      this.changeTextColor(this.powerUpColor());
    } else {
      this.resetTextColor();
    }
    
    this.drawText(current, x, y + this.lineHeight(), colWidth - 5, 'center');
  }
  this.resetTextColor();
};

Window_MonsterInfo.prototype.drawAppliedStates = function (y) {
  const useTranslation = ConfigManager.language === "it";
  const enemy = this._enemy;
  const states = enemy.states();
  
  this.changeTextColor(this.systemColor());
  this.drawText(useTranslation ? "Stati:" : "States:", 0, y, 120);
  this.resetTextColor();
  
  if (states.length === 0) {
    this.drawText(useTranslation ? "Nessuno" : "None", 120, y, this.contentsWidth() - 120);
    return;
  }
  
  let x = 120;
  const iconWidth = 32;
  
  for (let i = 0; i < states.length; i++) {
    const state = states[i];
    if (x + iconWidth + this.textWidth(state.name) > this.contentsWidth()) {
      y += this.lineHeight();
      x = 120;
    }
    if (state.iconIndex > 0) {
      this.drawIcon(state.iconIndex, x, y);
      x += iconWidth;
    }
    const stateNameWidth = Math.min(150, this.textWidth(state.name) + 10);
    this.drawText(state.name, x, y, stateNameWidth);
    x += stateNameWidth + 10;
  }
};
// ============================================================================
// NEW: Window_MonsterBodyPartsList - Right side parts list window
// ============================================================================

function Window_MonsterBodyPartsList() {
  this.initialize.apply(this, arguments);
}

Window_MonsterBodyPartsList.prototype = Object.create(Window_Selectable.prototype);
Window_MonsterBodyPartsList.prototype.constructor = Window_MonsterBodyPartsList;

Window_MonsterBodyPartsList.prototype.initialize = function (enemy, isTargeting) {
  var width = Graphics.boxWidth * 0.50;
  var height = 520;
  var x = Graphics.boxWidth * 0.45;
  var y = (Graphics.boxHeight - height) / 2 + 88;
  var rect = new Rectangle(x, y, width, height);
  Window_Selectable.prototype.initialize.call(this, rect);
  this._enemy = enemy;
  this._isTargeting = isTargeting || false;
  this._data = [];

  if (!$gameTemp) {
    $gameTemp = {};
  }
  if (!$gameTemp.lastTargetSelections) {
    $gameTemp.lastTargetSelections = {};
  }

  var enemyId = enemy.enemyId();

  if (enemy && enemy._bodyParts) {
    for (var partKey in enemy._bodyParts) {
      this._data.push({
        key: partKey,
        part: enemy._bodyParts[partKey],
        selectable: !(this._isTargeting && enemy._bodyParts[partKey].destroyed),
      });
    }
  }
  this.refresh();

  var indexToSelect = 0;
  
  // If in targeting mode, try to restore last selected index
  if (this._isTargeting && $gameTemp.lastTargetSelections[enemyId] !== undefined) {
    var lastIndex = $gameTemp.lastTargetSelections[enemyId];
    if (lastIndex >= 0 && lastIndex < this._data.length && this._data[lastIndex].selectable !== false) {
      indexToSelect = lastIndex;
    }
  }

  this.select(indexToSelect);
  this.activate();
  this.show();
  this.z = 9999;
  
  if (this.parent) {
    this.parent.removeChild(this);
    this.parent.addChild(this);
  }
};

Window_MonsterBodyPartsList.prototype.maxItems = function () {
  return this._data.length;
};

Window_MonsterBodyPartsList.prototype.itemHeight = function () {
  return this.lineHeight();
};

Window_MonsterBodyPartsList.prototype.refresh = function () {
  this.contents.clear();
  if (!this._enemy || !this._enemy._bodyParts) return;

  var lineHeight = this.lineHeight();
  var y = 0;
  var useTranslation = ConfigManager.language === "it";
  
  this.changeTextColor(this.systemColor());
  this.drawText(useTranslation ? "Parti del Corpo" : "Body Parts", 0, y, this.contentsWidth(), 'center');
  this.resetTextColor();
  this.itemY = lineHeight * 2;

  this.drawAllItems();
};

Window_MonsterBodyPartsList.prototype.drawItem = function (index) {
  if (index < 0 || index >= this._data.length) return;

  var item = this._data[index];
  var part = item.part;
  var rect = this.itemRect(index);
  var useTranslation = ConfigManager.language === "it";
  
  var hpPercent = Math.floor((part.currentHp / part.maxHp) * 100);
  
  // Highlight if this is the currently targeted part (in targeting mode)
  var enemyId = this._enemy.enemyId();
  var isCurrentTarget = this._isTargeting && 
                        $gameTemp.lastTargetSelections && 
                        $gameTemp.lastTargetSelections[enemyId] === index;
  
  if (isCurrentTarget && index === this.index()) {
    // Draw selection background with special color
    this.contents.fillRect(rect.x, rect.y, rect.width, rect.height, 'rgba(255, 255, 0, 0.2)');
  }
  
  if (part.destroyed) {
    this.changeTextColor(ColorManager.deathColor());
  } else if (hpPercent <= 25) {
    this.changeTextColor(ColorManager.crisisColor());
  } else if (hpPercent <= 50) {
    this.changeTextColor(ColorManager.textColor(17));
  } else {
    this.resetTextColor();
  }
  
  var partName = useTranslation && part.name_it ? part.name_it : part.name;
  this.drawText(partName, rect.x + 4, rect.y, rect.width - 60);
  
  var hpText = part.destroyed ? "X" : hpPercent + "%";
  this.drawText(hpText, rect.x + rect.width - 70, rect.y, 66, 'right');
  
  this.resetTextColor();
  
  if (this._isTargeting && index === this.index()) {
    this.changePaintOpacity(true);
  }
};

Window_MonsterBodyPartsList.prototype.itemRect = function (index) {
  var rect = new Rectangle();
  rect.width = this.contentsWidth();
  rect.height = this.lineHeight();
  rect.x = 0;
  rect.y = this.itemY + index * rect.height - this._scrollY;
  return rect;
};

Window_MonsterBodyPartsList.prototype.update = function () {
  Window_Selectable.prototype.update.call(this);
  if (this._isTargeting && this.active && this._data.length > 0) {
    if (!this.isCurrentItemEnabled() && this._index >= 0) {
      this.selectNextAvailable();
    }
  }
};

Window_MonsterBodyPartsList.prototype.selectNextAvailable = function () {
  var currentIndex = this.index();
  var maxItems = this._data.length;
  for (var i = 1; i < maxItems; i++) {
    var index = (currentIndex + i) % maxItems;
    if (this._data[index].selectable !== false) {
      this.select(index);
      return;
    }
  }
  this.select(-1);
};

Window_MonsterBodyPartsList.prototype.isCurrentItemEnabled = function () {
  if (this.index() < 0 || this.index() >= this._data.length) return false;
  var item = this._data[this.index()];
  return item.selectable !== false;
};

Window_MonsterBodyPartsList.prototype.processOk = function () {
  if (this._isTargeting && this.index() >= 0 && this.isCurrentItemEnabled()) {
    if (!$gameTemp) {
      $gameTemp = {};
    }
    if (!$gameTemp.lastTargetSelections) {
      $gameTemp.lastTargetSelections = {};
    }
    var enemyId = this._enemy.enemyId();
    $gameTemp.lastTargetSelections[enemyId] = this.index();
    $gameTemp.targetedBodyPart = this._data[this.index()].key;
    SoundManager.playOk();
  }
  this.close();
};

Window_MonsterBodyPartsList.prototype.close = function () {
  $gameTemp.checkWindowActive = false;
  if (!this._isTargeting) {
    SoundManager.playCancel();
  }
  Window_Selectable.prototype.close.call(this);
  setTimeout(
    function () {
      if (this.parent) this.parent.removeChild(this);
    }.bind(this),
    100
  );
};
Window_MonsterInfo.prototype.powerUpColor = function() {
  return ColorManager.powerUpColor ? ColorManager.powerUpColor() : ColorManager.textColor(24);
};

Window_MonsterInfo.prototype.powerDownColor = function() {
  return ColorManager.powerDownColor ? ColorManager.powerDownColor() : ColorManager.textColor(25);
};
  // Scene_Battle modifications
// REPLACE THIS HOOK:
var _Scene_Battle_update = Scene_Battle.prototype.update;
Scene_Battle.prototype.update = function () {
  if ($gameTemp.checkWindowActive) {
    if (this._bodyPartsWindow) {
      this._bodyPartsWindow.update();
    }
    if (this._monsterInfoWindow) {
      this._monsterInfoWindow.update();
    }
  } else {
    _Scene_Battle_update.call(this);
  }
};

  // Check command handler
// REPLACE THIS METHOD:
Scene_Battle.prototype.commandCheck = function () {
  var enemy = $gameTroop.members()[0];

  if (enemy && enemy._bodyParts) {
    this._actorCommandWindow.deactivate();

    // Create info window (left side)
    this._monsterInfoWindow = new Window_MonsterInfo(enemy);
    this.addWindow(this._monsterInfoWindow);

    // Create body parts list window (right side)
    this._bodyPartsWindow = new Window_MonsterBodyPartsList(enemy, false);
    this.addWindow(this._bodyPartsWindow);
    this._bodyPartsWindow.setHandler("ok", this.onBodyPartsOk.bind(this));
    this._bodyPartsWindow.setHandler("cancel", this.onBodyPartsCancel.bind(this));
    
    $gameTemp.checkWindowActive = true;
  } else {
    this._actorCommandWindow.activate();
  }
};

  // Target command handler
// REPLACE THIS METHOD:
Scene_Battle.prototype.commandTarget = function () {
  var enemy = $gameTroop.members()[0];

  if (enemy && enemy._bodyParts) {
    this._actorCommandWindow.deactivate();

    // Create info window (left side)
    this._monsterInfoWindow = new Window_MonsterInfo(enemy);
    this.addWindow(this._monsterInfoWindow);

    // Create targeting body parts list window (right side)
    this._bodyPartsWindow = new Window_MonsterBodyPartsList(enemy, true);
    this.addWindow(this._bodyPartsWindow);
    this._bodyPartsWindow.setHandler("ok", this.onTargetingOk.bind(this));
    this._bodyPartsWindow.setHandler("cancel", this.onTargetingCancel.bind(this));
    
    $gameTemp.checkWindowActive = true;
  } else {
    this._actorCommandWindow.activate();
  }
};
  // Handler for closing check window
  Scene_Battle.prototype.onBodyPartsOk = function () {
    this.closeBodyPartsWindow();
  };

  Scene_Battle.prototype.onBodyPartsCancel = function () {
    this.closeBodyPartsWindow();
  };

  // Handler for targeting window
// Replace the onTargetingOk handler
Scene_Battle.prototype.onTargetingOk = function () {
  // Store the selected index for this enemy
  if (this._bodyPartsWindow && this._bodyPartsWindow._enemy) {
    var enemyId = this._bodyPartsWindow._enemy.enemyId();
    if (!$gameTemp.lastTargetSelections) {
      $gameTemp.lastTargetSelections = {};
    }
    $gameTemp.lastTargetSelections[enemyId] = this._bodyPartsWindow.index();
  }
  
  // Close BOTH windows (body parts list and monster info)
  if (this._bodyPartsWindow) {
    this._bodyPartsWindow.close();
    this._bodyPartsWindow = null;
  }

  if (this._monsterInfoWindow) {
    this._monsterInfoWindow.close();
    setTimeout(
      function () {
        if (this._monsterInfoWindow && this._monsterInfoWindow.parent) {
          this._monsterInfoWindow.parent.removeChild(this._monsterInfoWindow);
        }
        this._monsterInfoWindow = null;
      }.bind(this),
      100
    );
  }

  if ($gameTemp) {
    $gameTemp.checkWindowActive = false;
  }
  
  // After targeting, return to the actor command window and select Attack
  this._actorCommandWindow.activate();
  this._actorCommandWindow.selectSymbol("attack");
};

  Scene_Battle.prototype.onTargetingCancel = function () {
    // Clear targeted part if $gameTemp exists
    if ($gameTemp) {
      $gameTemp.targetedBodyPart = null;
    }
    
    // Clear the last target selection for this enemy
    if (this._bodyPartsWindow && this._bodyPartsWindow._enemy) {
      var enemyId = this._bodyPartsWindow._enemy.enemyId();
      if ($gameTemp.lastTargetSelections) {
        delete $gameTemp.lastTargetSelections[enemyId];
      }
    }
    
    this.closeBodyPartsWindow();
  };

// REPLACE THIS METHOD:
Scene_Battle.prototype.closeBodyPartsWindow = function () {
  // Close both windows
  if (this._bodyPartsWindow) {
    this._bodyPartsWindow.close();
    this._bodyPartsWindow = null;
  }

  if (this._monsterInfoWindow) {
    this._monsterInfoWindow.close();
    setTimeout(
      function () {
        if (this._monsterInfoWindow && this._monsterInfoWindow.parent) {
          this._monsterInfoWindow.parent.removeChild(this._monsterInfoWindow);
        }
        this._monsterInfoWindow = null;
      }.bind(this),
      100
    );
  }

  if ($gameTemp) {
    $gameTemp.checkWindowActive = false;
  }

  this._actorCommandWindow.activate();
};

  // Add a hook to BattleManager.update to handle delayed enemy death
  var _BattleManager_update = BattleManager.update;
  BattleManager.update = function () {
    _BattleManager_update.call(this);

    // Make sure $gameTemp exists
    if (!$gameTemp) {
      $gameTemp = {};
      return;
    }

    // Handle scheduled enemy death after battle log has had time to display
    if ($gameTemp.scheduleEnemyDeath && $gameTemp.vitalPartDestroyedEnemy) {
      // Only apply death if battle log is done processing
      if (!this._logWindow || this._logWindow._methods.length === 0) {
        $gameTemp.vitalPartDestroyedEnemy.addState(
          $gameTemp.vitalPartDestroyedEnemy.deathStateId()
        );
        $gameTemp.vitalPartDestroyedEnemy = null;
        $gameTemp.scheduleEnemyDeath = false;
      }
    }
  };

  // 1) Init storage
  const _GS_initialize = Game_System.prototype.initialize;
  Game_System.prototype.initialize = function () {
    _GS_initialize.call(this);
    this._troopLimbData = {}; // { "mapId_troopId": [deep copies of each enemy._bodyParts] }
  };

  // 2) Tag the current troopId on Game_Troop
  const _GT_setup = Game_Troop.prototype.setup;
  Game_Troop.prototype.setup = function (troopId) {
    _GT_setup.call(this, troopId);
    this._troopId = troopId;
  };

  // 3) On BattleManager.setup, load any saved bodyParts
  const _BM_setup = BattleManager.setup;
  BattleManager.setup = function (troopId, canEscape, canLose) {
    _BM_setup.call(this, troopId, canEscape, canLose);
    const mapId = $gameMap.mapId();
    const key = `${mapId}_${troopId}`;
    const saved = $gameSystem._troopLimbData[key];
    if (saved) {
      $gameTroop.members().forEach((enemy, idx) => {
        if (saved[idx]) {
          // deep‐copy to avoid reference bleed
          enemy._bodyParts = JsonEx.makeDeepCopy(saved[idx]);
        }
      });
    }
  };

  // 4) Every time we apply limb damage, snapshot & save
  function saveLimbData() {
    const mapId = $gameMap.mapId();
    const troopId = $gameTroop._troopId;
    const key = `${mapId}_${troopId}`;
    // deep‐clone each enemy._bodyParts
    $gameSystem._troopLimbData[key] = $gameTroop
      .members()
      .map((enemy) => JsonEx.makeDeepCopy(enemy._bodyParts));
  }

  // Monkey-patch the existing applyDamageToBodyPart function
  const _orig_applyDamage = applyDamageToBodyPart;
  applyDamageToBodyPart = function (enemy, partKey, damage, isTargeted) {
    const result = _orig_applyDamage.call(
      this,
      enemy,
      partKey,
      damage,
      isTargeted
    );
    saveLimbData();
    return result;
  };

  // 5) On map change, wipe all saved data
  const _GM_setup = Game_Map.prototype.setup;
  Game_Map.prototype.setup = function (mapId) {
    _GM_setup.call(this, mapId);
    $gameSystem._troopLimbData = {};
  };


  // Add this section after the plugin parameters definition, around line 70

// Register plugin command for opening enemy detail window
if (PluginManager.registerCommand) {
  PluginManager.registerCommand(pluginName, "OpenEnemyDetails", args => {
    if ($gameParty.inBattle()) {
      const scene = SceneManager._scene;
      if (scene instanceof Scene_Battle) {
        scene.commandCheck();
      }
    }
  });

  PluginManager.registerCommand(pluginName, "OpenTargeting", args => {
    if ($gameParty.inBattle()) {
      const scene = SceneManager._scene;
      if (scene instanceof Scene_Battle) {
        scene.commandTarget();
      }
    }
  });
}
})();
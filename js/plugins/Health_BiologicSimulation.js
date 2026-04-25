/*:
 * @plugindesc [Add-on] A deep, real-time biologic simulation for Actor 1.
 * @author Omni-Lex
 * @help
 * This plugin is an add-on for the Core Limb Damage System.
 * It has a soft dependency; it will function without the core system,
 * but some features (like Ley Vein blockages) will not work.
 *
 * This plugin simulates vital signs, hormones, brain activity, and more.
 * It adds a "Biologics" command to the main menu.
 *
 * @command OpenBiologicSimulation
 * @desc Opens the biologic simulation window.
 * 
 * @command MakePregnant
 * @desc Makes the player pregnant (requires Switch 69 ON for uterus).
 *
 * @command ShortenPregnancy
 * @desc Reduces pregnancy timer by 1 month (30 days).
 * 
 * @command BirthSeed
 * @desc Plants one seed from stockpile (Plant-type reproduction only).
 *
 */

(function () {
  "use strict";
  // Biologic Simulation Scene
  function Scene_BiologicSimulation() {
    this.initialize(...arguments);
  }
  function getTranslatedText(englishText, italianText) {
    return ConfigManager.language === "it" ? italianText : englishText;
  }

  function getGameDateFromVariable() {
    const dateStr = $gameVariables.value(113) || '01 JAN 2001 12:00';
    // Format: "01 JAN 2001 12:00"
    const parts = dateStr.split(' ');
    if (parts.length < 4) {
      return { day: 1, month: 0, year: 2001, hours: 8, minutes: 0 };
    }

    const day = parseInt(parts[0]);
    const monthStr = parts[1].toUpperCase();
    const year = parseInt(parts[2]);
    const timeStr = parts[3].split(':');
    const hours = parseInt(timeStr[0]);
    const minutes = parseInt(timeStr[1]);

    const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
    const month = months.indexOf(monthStr);

    return { day, month, year, hours, minutes };
  }

  function convertGameDateToTimestamp(dateObj) {
    // Convert game date object to a comparable timestamp (days since epoch)
    // Using a base date to calculate days
    const baseYear = 2001;
    let days = (dateObj.year - baseYear) * 365;

    // Add days for each complete month
    const daysPerMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    for (let i = 0; i < dateObj.month; i++) {
      days += daysPerMonth[i];
    }

    // Add remaining days of the month
    days += dateObj.day;

    // Add fractional day for hours/minutes
    days += (dateObj.hours * 60 + dateObj.minutes) / (24 * 60);

    return days;
  }

  const { BRAIN_REGIONS,PersonalityData } = window.ProstheticsData;

  Scene_BiologicSimulation.prototype = Object.create(Scene_MenuBase.prototype);
  Scene_BiologicSimulation.prototype.constructor = Scene_BiologicSimulation;

  Scene_BiologicSimulation.prototype.initialize = function () {
    Scene_MenuBase.prototype.initialize.call(this);
    // Set switch 128 when biologic simulation menu is opened
    $gameSwitches.setValue(128, true);
  };

  Scene_BiologicSimulation.prototype.create = function () {
    Scene_MenuBase.prototype.create.call(this);
    this.createBiologicWindow();
  };

  Scene_BiologicSimulation.prototype.createBiologicWindow = function () {
    this._biologicWindow = new Window_BiologicSimulation();
    this._biologicWindow.setHandler("cancel", this.popScene.bind(this));
    this.addWindow(this._biologicWindow);
  };

  Scene_BiologicSimulation.prototype.terminate = function () {
    Scene_MenuBase.prototype.terminate.call(this);
    Input.clear();
    TouchInput.clear();
  };
  // State Reaction System for Biologic Simulation
  Window_BiologicSimulation.prototype.applyStateReactions = function () {
    if (!this._actor || !this._actor._biologicData) return;

    var states = this._actor._states;
    var bio = this._actor._biologicData;

    // Reset to base values first
    this.resetBiologicToBase();

    // Apply state effects
    for (var i = 0; i < states.length; i++) {
      var stateId = states[i];
      this.applyStateEffect(stateId, bio);
    }
  };

  Window_BiologicSimulation.prototype.resetBiologicToBase = function () {
    var bio = this._actor._biologicData;

    // Reset vital signs to normal ranges
    bio.vitalSigns.heartRate = Math.max(
      60,
      Math.min(100, bio.vitalSigns.heartRate)
    );
    bio.vitalSigns.bloodPressure.systolic = Math.max(
      110,
      Math.min(140, bio.vitalSigns.bloodPressure.systolic)
    );
    bio.vitalSigns.bodyTemperature = Math.max(
      36.0,
      Math.min(37.5, bio.vitalSigns.bodyTemperature)
    );
    bio.vitalSigns.cortisol = Math.max(
      10,
      Math.min(25, bio.vitalSigns.cortisol)
    );

    // Reset immune system
    bio.immuneSystem.whiteBloodCells = Math.max(
      4000,
      Math.min(11000, bio.immuneSystem.whiteBloodCells)
    );
    bio.immuneSystem.antibodies = Math.max(
      700,
      Math.min(1600, bio.immuneSystem.antibodies)
    );

    // Clear temporary infections and pathogens
    bio.immuneSystem.viruses = bio.immuneSystem.viruses.filter(function (v) {
      return !v.temporary;
    });
    bio.immuneSystem.bacteria = bio.immuneSystem.bacteria.filter(function (b) {
      return !b.temporary;
    });

    // Reset ley vein activity to normal
    for (var meridian in bio.leyVeins.meridians) {
      if (bio.leyVeins.meridians[meridian].status === "Normal") {
        bio.leyVeins.meridians[meridian].magicalActivity = 100;
      }
    }

    // Reset brain activity to normal
    if (bio.brainActivity) {
      for (var region in bio.brainActivity.regions) {
        var regionData = bio.brainActivity.regions[region];
        if (regionData.normalActivity) {
          regionData.activity = regionData.normalActivity;
        }
      }
    }
  };

  Window_BiologicSimulation.prototype.applyStateEffect = function (
    stateId,
    bio
  ) {
    switch (stateId) {
      case 1: // Dead
        bio.vitalSigns.heartRate = 0;
        bio.vitalSigns.bloodPressure.systolic = 0;
        bio.vitalSigns.bloodPressure.diastolic = 0;
        bio.vitalSigns.bodyTemperature = 20.0;
        bio.vitalSigns.oxygenSaturation = 0;
        bio.immuneSystem.whiteBloodCells = 0;
        if (bio.brainActivity) {
          for (var region in bio.brainActivity.regions) {
            bio.brainActivity.regions[region].activity = 0;
          }
          bio.brainActivity.neurons.firing = 0;
          bio.brainActivity.overallActivity = 0;
        }
        for (var meridian in bio.leyVeins.meridians) {
          bio.leyVeins.meridians[meridian].magicalActivity = 0;
        }
        break;

      case 2: // Guard
        bio.immuneSystem.whiteBloodCells += 2000;
        bio.immuneSystem.antibodies += 300;
        bio.vitalSigns.cortisol += 5;
        bio.hormones.adrenaline += 10;
        if (bio.brainActivity) {
          bio.brainActivity.regions.prefrontalCortex.activity += 20;
          bio.brainActivity.regions.sensoryCortex.activity += 15;
        }
        break;

      case 3: // Immortal
        bio.vitalSigns.heartRate = 45; // Slow, efficient heartbeat
        bio.hormones.growth += 2;
        bio.immuneSystem.whiteBloodCells += 5000;
        bio.immuneSystem.antibodies += 500;
        if (bio.brainActivity) {
          for (var region in bio.brainActivity.regions) {
            bio.brainActivity.regions[region].activity = Math.min(
              100,
              bio.brainActivity.regions[region].activity + 25
            );
          }
        }
        for (var meridian in bio.leyVeins.meridians) {
          bio.leyVeins.meridians[meridian].magicalActivity = 150;
        }
        break;

      case 4: // Poison
        bio.vitalSigns.heartRate += 20;
        bio.vitalSigns.bodyTemperature += 1.0;
        bio.immuneSystem.whiteBloodCells += 3000;
        bio.vitalSigns.cortisol += 10;
        bio.immuneSystem.bacteria.push({
          name: "Toxin-producing bacteria",
          type: "Pathogenic",
          count: 50000 + Math.floor(Math.random() * 50000),
          temporary: true,
        });
        if (bio.brainActivity) {
          bio.brainActivity.regions.brainstem.activity -= 15;
          bio.brainActivity.regions.prefrontalCortex.activity -= 20;
        }
        break;

      case 5: // Blind
        bio.vitalSigns.cortisol += 8;
        bio.hormones.adrenaline += 15;
        if (bio.brainActivity) {
          bio.brainActivity.regions.occipitalLobe.activity -= 60; // Visual processing severely reduced
          bio.brainActivity.regions.sensoryCortex.activity += 10; // Other senses compensate
        }
        // Affect head meridian
        if (bio.leyVeins.meridians.head) {
          bio.leyVeins.meridians.head.magicalActivity = Math.max(
            50,
            bio.leyVeins.meridians.head.magicalActivity - 30
          );
        }
        break;

      case 6: // Silence
        bio.vitalSigns.cortisol += 5;
        if (bio.brainActivity) {
          bio.brainActivity.regions.temporalLobe.activity -= 30; // Language processing affected
        }
        // Reduce magical flow
        bio.leyVeins.flow = Math.max(30, bio.leyVeins.flow - 20);
        break;

      case 7: // Rage
        bio.vitalSigns.heartRate += 40;
        bio.vitalSigns.bloodPressure.systolic += 30;
        bio.vitalSigns.bloodPressure.diastolic += 20;
        bio.vitalSigns.bodyTemperature += 0.8;
        bio.hormones.adrenaline += 50;
        bio.hormones.testosterone += 100;
        bio.vitalSigns.cortisol += 15;
        if (bio.brainActivity) {
          bio.brainActivity.regions.amygdala.activity += 60; // Fear/emotion center highly active
          bio.brainActivity.regions.prefrontalCortex.activity -= 25; // Reduced rational thinking
          bio.brainActivity.waves.beta += 15; // Increased beta waves
        }
        break;

      case 8: // Confusion
        bio.vitalSigns.cortisol += 12;
        bio.hormones.adrenaline += 20;
        if (bio.brainActivity) {
          bio.brainActivity.regions.prefrontalCortex.activity -= 40;
          bio.brainActivity.regions.hippocampus.activity -= 25; // Memory affected
          bio.brainActivity.waves.theta += 10; // Increased theta waves (confusion)
          bio.brainActivity.regions.head.magicalActivity = Math.max(
            40,
            bio.brainActivity.regions.head.magicalActivity - 40
          );
        }
        break;

      case 9: // Charm
        bio.hormones.estrogen += 50;
        bio.vitalSigns.heartRate += 10;
        bio.vitalSigns.cortisol -= 5;
        if (bio.brainActivity) {
          bio.brainActivity.regions.amygdala.activity -= 20; // Reduced fear response
          bio.brainActivity.regions.prefrontalCortex.activity += 15; // Enhanced social processing
        }
        break;

      case 10: // Sleep
        bio.vitalSigns.heartRate -= 15;
        bio.vitalSigns.bloodPressure.systolic -= 20;
        bio.vitalSigns.bloodPressure.diastolic -= 15;
        bio.vitalSigns.bodyTemperature -= 0.5;
        bio.vitalSigns.cortisol -= 8;
        bio.hormones.growth += 1;
        if (bio.brainActivity) {
          bio.brainActivity.waves.delta += 10; // Increased delta waves
          bio.brainActivity.waves.theta += 5;
          bio.brainActivity.waves.beta -= 15;
          bio.brainActivity.overallActivity -= 30;
          for (var region in bio.brainActivity.regions) {
            bio.brainActivity.regions[region].activity *= 0.6; // Reduced activity across all regions
          }
        }
        break;

      case 11: // Freeze
        bio.vitalSigns.heartRate -= 25;
        bio.vitalSigns.bodyTemperature -= 5.0;
        bio.vitalSigns.bloodPressure.systolic -= 30;
        if (bio.brainActivity) {
          bio.brainActivity.regions.motorCortex.activity -= 70; // Severely reduced motor function
          bio.brainActivity.regions.cerebellum.activity -= 60; // Balance/coordination affected
          bio.brainActivity.overallActivity -= 40;
        }
        for (var meridian in bio.leyVeins.meridians) {
          bio.leyVeins.meridians[meridian].magicalActivity = Math.max(
            20,
            bio.leyVeins.meridians[meridian].magicalActivity - 60
          );
        }
        break;

      case 12: // Paralysis
        bio.vitalSigns.heartRate -= 10;
        bio.vitalSigns.cortisol += 20;
        bio.hormones.adrenaline += 30;
        if (bio.brainActivity) {
          bio.brainActivity.regions.motorCortex.activity -= 80; // Motor control severely affected
          bio.brainActivity.regions.cerebellum.activity -= 70;
          bio.brainActivity.regions.prefrontalCortex.activity += 10; // Increased awareness of paralysis
        }
        // Affect limb meridians
        if (bio.leyVeins.meridians.arms) {
          bio.leyVeins.meridians.arms.magicalActivity = Math.max(
            10,
            bio.leyVeins.meridians.arms.magicalActivity - 70
          );
        }
        if (bio.leyVeins.meridians.legs) {
          bio.leyVeins.meridians.legs.magicalActivity = Math.max(
            10,
            bio.leyVeins.meridians.legs.magicalActivity - 70
          );
        }
        break;

      case 13: // Stun
        bio.vitalSigns.heartRate += 25;
        bio.vitalSigns.cortisol += 15;
        bio.hormones.adrenaline += 40;
        if (bio.brainActivity) {
          bio.brainActivity.regions.prefrontalCortex.activity -= 50;
          bio.brainActivity.regions.sensoryCortex.activity -= 30;
          bio.brainActivity.waves.alpha -= 10;
          bio.brainActivity.waves.beta += 20; // Chaotic brain activity
          bio.brainActivity.regions.head.magicalActivity = Math.max(
            30,
            bio.brainActivity.regions.head.magicalActivity - 50
          );
        }
        break;

      // Continue with more states...
      case 15: // HP Regeneration
        bio.vitalSigns.heartRate += 5;
        bio.hormones.growth += 3;
        bio.immuneSystem.whiteBloodCells += 1500;
        bio.vitalSigns.nutrients.protein += 20;
        if (bio.brainActivity) {
          bio.brainActivity.regions.brainstem.activity += 10; // Enhanced vital functions
        }
        if (bio.cellularActivity) {
          bio.cellularActivity.cellsForming *= 1.5; // Increased cell formation
          bio.cellularActivity.mitosisRate *= 1.3;
        }
        break;

      case 16: // MP Regeneration
        for (var meridian in bio.leyVeins.meridians) {
          bio.leyVeins.meridians[meridian].magicalActivity = Math.min(
            200,
            bio.leyVeins.meridians[meridian].magicalActivity + 50
          );
        }
        bio.leyVeins.flow = Math.min(150, bio.leyVeins.flow + 30);
        if (bio.brainActivity) {
          bio.brainActivity.regions.prefrontalCortex.activity += 15; // Enhanced mental focus
        }
        break;

      case 44: // Infected
        bio.vitalSigns.heartRate += 30;
        bio.vitalSigns.bodyTemperature += 2.5;
        bio.immuneSystem.whiteBloodCells += 6000;
        bio.vitalSigns.cortisol += 20;

        if (bio.brainActivity) {
          bio.brainActivity.overallActivity -= 20; // Reduced brain function due to infection
          bio.brainActivity.regions.brainstem.activity += 15; // Fighting infection
        }

        // Count total persistent infections (not temporary)
        var persistentInfections = 0;
        bio.immuneSystem.bacteria.forEach(function (bacterium) {
          if (!bacterium.temporary) persistentInfections++;
        });
        bio.immuneSystem.viruses.forEach(function (virus) {
          if (!virus.temporary) persistentInfections++;
        });

        // Only add new infection if less than 3 persistent infections
        if (persistentInfections < 3) {
          var pathogenTypes = ["bacteria", "virus"];
          var chosenType = pathogenTypes[Math.floor(Math.random() * pathogenTypes.length)];

          if (chosenType === "bacteria") {
            var bacteriaNames = [
              "Staphylococcus aureus",
              "Streptococcus pyogenes",
              "Escherichia coli",
              "Pseudomonas aeruginosa",
              "Clostridium difficile"
            ];
            var randomBacteria = bacteriaNames[Math.floor(Math.random() * bacteriaNames.length)];
            bio.immuneSystem.bacteria.push({
              name: randomBacteria,
              type: "Pathogenic",
              count: 100000 + Math.floor(Math.random() * 300000),
              temporary: false, // Persistent infection
              infectionStartDate: convertGameDateToTimestamp(getGameDateFromVariable()) // Track infection start date for gradual reduction
            });
          } else {
            var virusNames = [
              "Influenza Virus",
              "Rhinovirus",
              "Inflammatory Virus",
              "Herpesvirus",
              "Coronavirus"
            ];
            var randomVirus = virusNames[Math.floor(Math.random() * virusNames.length)];
            bio.immuneSystem.viruses.push({
              name: randomVirus,
              type: "Pathogenic",
              count: 30000 + Math.floor(Math.random() * 100000),
              temporary: false, // Persistent infection
              infectionStartDate: convertGameDateToTimestamp(getGameDateFromVariable()) // Track infection start date for gradual reduction
            });
          }
        }
        break;

      case 48: // Bleeding
        bio.vitalSigns.heartRate += 35;
        bio.vitalSigns.bloodPressure.systolic -= 20;
        bio.vitalSigns.bloodPressure.diastolic -= 15;
        bio.immuneSystem.whiteBloodCells += 2500;
        bio.vitalSigns.cortisol += 15;

        if (bio.brainActivity) {
          bio.brainActivity.overallActivity -= 15; // Reduced due to blood loss
          bio.brainActivity.regions.brainstem.activity += 20; // Compensating for blood loss
        }

        if (bio.cellularActivity) {
          bio.cellularActivity.cellsDying *= 1.3; // Increased cell death due to bleeding
        }

        bio.immuneSystem.bacteria.push({
          name: "Hemolytic bacteria",
          type: "Opportunistic",
          count: 40000 + Math.floor(Math.random() * 60000),
          temporary: true,
        });
        break;

      case 20: // Provoked
        bio.vitalSigns.heartRate += 30;
        bio.vitalSigns.bloodPressure.systolic += 20;
        bio.hormones.adrenaline += 40;
        bio.vitalSigns.cortisol += 12;
        if (bio.brainActivity) {
          bio.brainActivity.regions.amygdala.activity += 50; // Heightened emotion
          bio.brainActivity.regions.motorCortex.activity += 25; // Increased motor readiness
          bio.brainActivity.waves.beta += 20; // Increased alertness
        }
        break;

      case 23: // Status Ailment Block
        bio.immuneSystem.whiteBloodCells += 3000;
        bio.immuneSystem.antibodies += 400;
        bio.vitalSigns.cortisol += 5;
        // Increase overall immune system strength
        for (var pathogen in bio.immuneSystem.viruses) {
          if (bio.immuneSystem.viruses[pathogen].count > 0) {
            bio.immuneSystem.viruses[pathogen].count *= 0.7; // Reduce virus count
          }
        }
        for (var bacterium in bio.immuneSystem.bacteria) {
          if (bio.immuneSystem.bacteria[bacterium].count > 0) {
            bio.immuneSystem.bacteria[bacterium].count *= 0.7; // Reduce bacteria count
          }
        }
        break;

      case 25: // Hot
        bio.vitalSigns.bodyTemperature += 2.5; // Increase temperature
        bio.vitalSigns.heartRate += 15;
        bio.vitalSigns.sweatRate = (bio.vitalSigns.sweatRate || 0) + 30;
        bio.vitalSigns.cortisol += 5;
        break;

      case 26: // Cold
        bio.vitalSigns.bodyTemperature -= 2.5; // Decrease temperature
        bio.vitalSigns.heartRate -= 10;
        bio.vitalSigns.cortisol += 8;
        if (bio.brainActivity) {
          bio.brainActivity.regions.motorCortex.activity -= 30; // Reduced motor control in cold
          bio.brainActivity.overallActivity -= 15;
        }
        break;

      case 27: // Static
        bio.leyVeins.flow = Math.min(200, bio.leyVeins.flow + 60);
        bio.vitalSigns.heartRate += 20;
        bio.vitalSigns.bodyTemperature += 1.5;
        for (var meridian in bio.leyVeins.meridians) {
          bio.leyVeins.meridians[meridian].magicalActivity = Math.min(
            250,
            bio.leyVeins.meridians[meridian].magicalActivity + 40
          );
        }
        if (bio.brainActivity) {
          bio.brainActivity.waves.gamma += 30; // High frequency brain activity
        }
        break;

      case 31: // Berserk
        bio.vitalSigns.heartRate += 50;
        bio.vitalSigns.bodyTemperature += 1.5;
        bio.vitalSigns.bloodPressure.systolic += 40;
        bio.hormones.adrenaline += 80;
        bio.hormones.testosterone += 150;
        bio.vitalSigns.cortisol += 20;
        if (bio.brainActivity) {
          bio.brainActivity.regions.amygdala.activity = 100; // Maximum fear/rage
          bio.brainActivity.regions.prefrontalCortex.activity = 10; // Minimal rational control
          bio.brainActivity.regions.motorCortex.activity += 40;
          bio.brainActivity.waves.beta = 100;
        }
        break;

      case 36: // Arcane Surge
        // Increase all meridians to very high levels (max 999%)
        for (var meridian in bio.leyVeins.meridians) {
          bio.leyVeins.meridians[meridian].magicalActivity = 999;
        }
        bio.leyVeins.flow = 300;
        bio.vitalSigns.heartRate += 25;
        if (bio.brainActivity) {
          bio.brainActivity.regions.prefrontalCortex.activity += 35;
          bio.brainActivity.waves.gamma += 50;
        }
        break;

      case 40: // Vulnerability
        bio.immuneSystem.whiteBloodCells = Math.max(500, bio.immuneSystem.whiteBloodCells - 3000);
        bio.immuneSystem.antibodies = Math.max(100, bio.immuneSystem.antibodies - 300);
        bio.vitalSigns.cortisol += 15;
        bio.hormones.adrenaline += 20;
        break;

      case 41: // Nausea
        bio.vitalSigns.heartRate += 10;
        bio.vitalSigns.cortisol += 8;
        if (bio.brainActivity) {
          bio.brainActivity.regions.cerebellum.activity -= 25; // Balance center affected
          bio.brainActivity.regions.brainstem.activity += 15; // Nausea processing
        }
        // Slight temperature fluctuation from nausea
        bio.vitalSigns.bodyTemperature += 0.3;
        break;

      case 42: // Drunk
        bio.vitalSigns.heartRate += 20;
        bio.vitalSigns.bodyTemperature += 1.0;
        bio.vitalSigns.bloodPressure.systolic += 15;
        bio.vitalSigns.cortisol -= 5; // Reduced stress due to alcohol
        bio.hormones.dopamine = (bio.hormones.dopamine || 50) + 30;
        if (bio.brainActivity) {
          bio.brainActivity.regions.prefrontalCortex.activity -= 50; // Severe impairment of judgment
          bio.brainActivity.regions.motorCortex.activity -= 35; // Reduced motor control
          bio.brainActivity.regions.cerebellum.activity -= 40; // Balance severely affected
          bio.brainActivity.waves.theta += 25; // Increased theta (confusion/drowsiness)
          bio.brainActivity.overallActivity -= 30;
        }
        break;

      case 43: // Burned
        bio.vitalSigns.bodyTemperature += 3.0; // Significant temperature increase
        bio.vitalSigns.heartRate += 40;
        bio.vitalSigns.bloodPressure.systolic += 25;
        bio.vitalSigns.cortisol += 20;
        bio.immuneSystem.whiteBloodCells += 4000; // Immune response to burns
        if (bio.brainActivity) {
          bio.brainActivity.regions.sensoryCortex.activity += 60; // Heightened pain sensation
          bio.brainActivity.regions.amygdala.activity += 50; // Fear response
        }
        if (bio.cellularActivity) {
          bio.cellularActivity.cellsDying *= 1.5; // Cell death from burns
        }
        break;
    }

    // Ensure values stay within reasonable bounds
    bio.vitalSigns.heartRate = Math.max(
      0,
      Math.min(200, bio.vitalSigns.heartRate)
    );
    bio.vitalSigns.bloodPressure.systolic = Math.max(
      0,
      Math.min(300, bio.vitalSigns.bloodPressure.systolic)
    );
    bio.vitalSigns.bloodPressure.diastolic = Math.max(
      0,
      Math.min(200, bio.vitalSigns.bloodPressure.diastolic)
    );
    bio.vitalSigns.bodyTemperature = Math.max(
      15.0,
      Math.min(45.0, bio.vitalSigns.bodyTemperature)
    );
    bio.vitalSigns.oxygenSaturation = Math.max(
      0,
      Math.min(100, bio.vitalSigns.oxygenSaturation)
    );
    bio.immuneSystem.whiteBloodCells = Math.max(
      0,
      Math.min(50000, bio.immuneSystem.whiteBloodCells)
    );
    bio.immuneSystem.antibodies = Math.max(
      0,
      Math.min(5000, bio.immuneSystem.antibodies)
    );
    bio.vitalSigns.cortisol = Math.max(
      0,
      Math.min(100, bio.vitalSigns.cortisol)
    );

    // Bound brain activity values
    if (bio.brainActivity) {
      for (var region in bio.brainActivity.regions) {
        bio.brainActivity.regions[region].activity = Math.max(
          0,
          Math.min(100, bio.brainActivity.regions[region].activity)
        );
      }
      bio.brainActivity.overallActivity = Math.max(
        0,
        Math.min(100, bio.brainActivity.overallActivity)
      );
    }
  };
  // Override the refresh method to include state reactions
  var _Window_BiologicSimulation_refresh =
    Window_BiologicSimulation.prototype.refresh;
  Window_BiologicSimulation.prototype.refresh = function () {
    if (this._actor) {
      this.applyStateReactions();
    }
    _Window_BiologicSimulation_refresh.call(this);
  };

  // Enhanced drawImmuneSystem to show viruses and bacteria
  Window_BiologicSimulation.prototype.drawImmuneSystem = function (startY) {
    var data = this._actor._biologicData.immuneSystem;
    var y = startY;
    var lineHeight = this.lineHeight();

    this.drawText(
      "White Blood Cells: " + data.whiteBloodCells + "/μL",
      6,
      y,
      300
    );
    y += lineHeight;

    this.drawText("Antibodies: " + data.antibodies + " mg/dL", 6, y, 300);
    y += lineHeight * 2;

    // Active Infections
    this.changeTextColor(this.systemColor());
    this.drawText("Active Infections:", 6, y, 200);
    this.resetTextColor();
    y += lineHeight;

    if (data.infections.length === 0) {
      this.drawText("None detected", 20, y, 300);
      y += lineHeight;
    } else {
      for (var i = 0; i < data.infections.length; i++) {
        var infection = data.infections[i];
        var severityText = ["Mild", "Moderate", "Severe"][
          infection.severity - 1
        ];
        var text =
          infection.location +
          ": " +
          infection.type +
          " (" +
          severityText +
          ")";

        if (infection.severity >= 2) {
          this.changeTextColor(this.textColor(2)); // Red for moderate/severe
        }

        this.drawText(text, 20, y, 400);
        this.resetTextColor();
        y += lineHeight;
      }
    }

    y += lineHeight;

    // Viruses
    this.changeTextColor(this.systemColor());
    this.drawText("Active Viruses:", 6, y, 200);
    this.resetTextColor();
    y += lineHeight;

    if (data.viruses.length === 0) {
      this.drawText("None detected", 20, y, 300);
      y += lineHeight;
    } else {
      for (var i = 0; i < Math.min(data.viruses.length, 5); i++) {
        var virus = data.viruses[i];
        var typeColor =
          virus.type === "Pathogenic"
            ? this.textColor(2)
            : virus.type === "Beneficial"
            ? this.textColor(3)
            : this.normalColor();

        this.drawText(virus.name + ":", 20, y, 200);
        this.changeTextColor(typeColor);
        this.drawText(virus.type + " (" + virus.count + ")", 230, y, 200);
        this.resetTextColor();
        y += lineHeight;
      }
      if (data.viruses.length > 5) {
        this.drawText(
          "... and " + (data.viruses.length - 5) + " more",
          20,
          y,
          200
        );
        y += lineHeight;
      }
    }

    y += lineHeight;

    // Bacteria
    this.changeTextColor(this.systemColor());
    this.drawText("Active Bacteria:", 6, y, 200);
    this.resetTextColor();
    y += lineHeight;

    if (data.bacteria.length === 0) {
      this.drawText("None detected", 20, y, 300);
    } else {
      for (var i = 0; i < Math.min(data.bacteria.length, 5); i++) {
        var bacteria = data.bacteria[i];
        var typeColor =
          bacteria.type === "Pathogenic"
            ? this.textColor(2)
            : bacteria.type === "Beneficial"
            ? this.textColor(3)
            : this.normalColor();

        this.drawText(bacteria.name + ":", 20, y, 200);
        this.changeTextColor(typeColor);
        this.drawText(bacteria.type + " (" + bacteria.count + ")", 230, y, 200);
        this.resetTextColor();
        y += lineHeight;
      }
      if (data.bacteria.length > 5) {
        this.drawText(
          "... and " + (data.bacteria.length - 5) + " more",
          20,
          y,
          200
        );
      }
    }
  };

  Scene_BiologicSimulation._targetActorIndex = 0;

  Scene_Menu.prototype.commandBiologics = function () {
    if ($gameParty.size() <= 1) {
      Scene_BiologicSimulation._targetActorIndex = 0;
      SceneManager.push(Scene_BiologicSimulation);
    } else {
      SceneManager.push(Scene_BiologicActorSelect);
    }
  };

  function Scene_BiologicActorSelect() {
    this.initialize(...arguments);
  }

  Scene_BiologicActorSelect.prototype = Object.create(Scene_MenuBase.prototype);
  Scene_BiologicActorSelect.prototype.constructor = Scene_BiologicActorSelect;

  Scene_BiologicActorSelect.prototype.create = function () {
    Scene_MenuBase.prototype.create.call(this);
    const members = $gameParty.members();
    const ww = 300;
    const wh = this.calcWindowHeight(members.length, true);
    const wx = (Graphics.boxWidth - ww) / 2;
    const wy = (Graphics.boxHeight - wh) / 2;
    this._selectWindow = new Window_BiologicActorList(new Rectangle(wx, wy, ww, wh));
    this._selectWindow.setHandler("ok", this.onActorOk.bind(this));
    this._selectWindow.setHandler("cancel", this.popScene.bind(this));
    this.addWindow(this._selectWindow);
  };

  Scene_BiologicActorSelect.prototype.onActorOk = function () {
    Scene_BiologicSimulation._targetActorIndex = this._selectWindow.index();
    SceneManager.push(Scene_BiologicSimulation);
  };

  function Window_BiologicActorList() {
    this.initialize(...arguments);
  }

  Window_BiologicActorList.prototype = Object.create(Window_Command.prototype);
  Window_BiologicActorList.prototype.constructor = Window_BiologicActorList;

  Window_BiologicActorList.prototype.makeCommandList = function () {
    const members = $gameParty.members();
    for (let i = 0; i < members.length; i++) {
      this.addCommand(members[i].name(), "ok");
    }
  };
  var _Game_Interpreter_pluginCommand_pregnancy =
  Game_Interpreter.prototype.pluginCommand;
Game_Interpreter.prototype.pluginCommand = function (command, args) {
  _Game_Interpreter_pluginCommand_pregnancy.call(this, command, args);

  if (command === "MakePregnant") {
    Window_BiologicSimulation.makePregnant();
  }

  if (command === "ShortenPregnancy") {
    Window_BiologicSimulation.shortenPregnancy();
  }
};
  var _Game_Interpreter_pluginCommand_biologic =
    Game_Interpreter.prototype.pluginCommand;
  Game_Interpreter.prototype.pluginCommand = function (command, args) {
    _Game_Interpreter_pluginCommand_biologic.call(this, command, args);

    if (command === "OpenBiologicSimulation") {
      SceneManager.push(Scene_BiologicSimulation);
    }
  };
  if (Utils.RPGMAKER_NAME === "MZ") {
    PluginManager.registerCommand(
      "Health_BiologicSimulation",
      "MakePregnant",
      (args) => {
        Window_BiologicSimulation.makePregnant();
      }
    );
  }
  // MZ compatibility for biologic simulation command
  if (Utils.RPGMAKER_NAME === "MZ") {
    PluginManager.registerCommand(
      "Health_Core",
      "OpenBiologicSimulation",
      (args) => {
        SceneManager.push(Scene_BiologicSimulation);
      }
    );
  }
  
  PluginManager.registerCommand(
    "Health_BiologicSimulation",
    "ShortenPregnancy",
    (args) => {
      Window_BiologicSimulation.shortenPregnancy();
    }
  );
  // Biologic Simulation System
  function Window_BiologicSimulation() {
    this.initialize(...arguments);
  }

  if (Utils.RPGMAKER_NAME === "MZ") {
    Window_BiologicSimulation.prototype = Object.create(
      Window_StatusBase.prototype
    );
  } else {
    Window_BiologicSimulation.prototype = Object.create(
      Window_Selectable.prototype
    );
  }

  Window_BiologicSimulation.prototype.constructor = Window_BiologicSimulation;

  Window_BiologicSimulation.prototype.determinePersonality = function (name) {
    if (!PersonalityData || !PersonalityData.list) {
      console.error("PersonalityData is not loaded!");
      return {
        name: "Default",
        name_it: "Default",
        modifiers: {},
        thoughts: { en: ["..."], it: ["..."] },
      };
    }
    var hash = 0;
    for (var i = 0; i < name.length; i++) {
      hash = ((hash << 5) - hash + name.charCodeAt(i)) & 0xffffffff;
    }
    var personalityList = PersonalityData.list;
    var index = Math.abs(hash) % personalityList.length;
    return JSON.parse(JSON.stringify(personalityList[index]));
  };

  Window_BiologicSimulation.prototype.initialize = function () {
    if (Utils.RPGMAKER_NAME === "MZ") {
      Window_StatusBase.prototype.initialize.call(
        this,
        new Rectangle(0, 0, Graphics.boxWidth, Graphics.boxHeight)
      );
    } else {
      Window_Selectable.prototype.initialize.call(
        this,
        0,
        0,
        Graphics.boxWidth,
        Graphics.boxHeight
      );
    }
    this._brainScrollY = 0;
    this._maxBrainScroll = 0;
    this._vitalScrollY = 0;
    this._maxVitalScroll = 0;
    this._partsScrollY = 0;
    this._maxPartsScroll = 0;
    this._augmentsScrollY = 0;
    this._maxAugmentsScroll = 0;
    this._actor = $gameParty.members()[Scene_BiologicSimulation._targetActorIndex] || $gameParty.members()[0];
    this._category = 0; // 0: Home, 1: Vital Signs, 2: Hormones, 3: Immune System, 4: Ley Veins, 5: Brain Activity, 6: Reproduction
    this._categories = [
      { name: "Home", name_it: "Panoramica" },
      { name: "Vital Signs", name_it: "Segni Vitali" },
      { name: "Hormones", name_it: "Ormoni" },
      { name: "Immune System", name_it: "Sistema Immunitario" },
      { name: "Ley Veins", name_it: "Vene Magiche" },
      { name: "Brain Activity", name_it: "Attività Cerebrale" },
      { name: "Reproduction", name_it: "Riproduzione" },
      { name: "Augments", name_it: "Aumenti" }
    ];

    this.initializeBiologicData();
    this.refresh();
    this.activate();
    this.select(0);

    // Initialize thought system
    this._currentThought = "";
    this._thoughtStartTime = 0;
    this._thoughtDuration = 0;

    // Start real-time simulation
    this.startBiologicSimulation();
  };

  // Override cursor movement for brain tab
  Window_BiologicSimulation.prototype.cursorUp = function (wrap) {
    if (this._category === 5) {
      // Brain Activity tab
      this._brainScrollY = Math.max(0, this._brainScrollY - this.lineHeight());
      this.refresh();
    } else if (this._category === 1) {
      // Vital Signs tab
      this._vitalScrollY = Math.max(0, this._vitalScrollY - this.lineHeight());
      this.refresh();
    } else if (this._category === 0) {
      // Home / Body Parts tab
      this._partsScrollY = Math.max(0, this._partsScrollY - this.lineHeight());
      this.refresh();
    } else if (this._category === 7) {
      // Augments tab
      this._augmentsScrollY = Math.max(0, this._augmentsScrollY - this.lineHeight());
      this.refresh();
    } else {
      // Normal cursor behavior for other tabs
      Window_Selectable.prototype.cursorUp.call(this, wrap);
    }
  };

  Window_BiologicSimulation.prototype.cursorDown = function (wrap) {
    if (this._category === 5) {
      // Brain Activity tab
      this._brainScrollY = Math.min(
        this._maxBrainScroll,
        this._brainScrollY + this.lineHeight()
      );
      this.refresh();
    } else if (this._category === 1) {
      // Vital Signs tab
      this._vitalScrollY = Math.min(
        this._maxVitalScroll,
        this._vitalScrollY + this.lineHeight()
      );
      this.refresh();
    } else if (this._category === 0) {
      // Home / Body Parts tab
      this._partsScrollY = Math.min(
        this._maxPartsScroll,
        this._partsScrollY + this.lineHeight()
      );
      this.refresh();
    } else if (this._category === 7) {
      // Augments tab
      this._augmentsScrollY = Math.min(
        this._maxAugmentsScroll,
        this._augmentsScrollY + this.lineHeight()
      );
      this.refresh();
    } else {
      // Normal cursor behavior for other tabs
      Window_Selectable.prototype.cursorDown.call(this, wrap);
    }
  };

  // Add scroll wheel support
  Window_BiologicSimulation.prototype.processWheel = function () {
    if (this.isCursorMovable()) {
      const threshold = 20;
      if (Input.wheelY >= threshold) {
        // Scroll down with mouse wheel
        this.cursorDown(false);
      } else if (Input.wheelY <= -threshold) {
        // Scroll up with mouse wheel
        this.cursorUp(false);
      }
    }
  };

  Window_BiologicSimulation.prototype.startBiologicSimulation = function () {
    var self = this;
    this._simulationInterval = setInterval(function () {
      self.updateBiologicActivity();
      self.refresh();
    }, 1000); // Update every second
  };

  Window_BiologicSimulation.prototype.stopBiologicSimulation = function () {
    if (this._simulationInterval) {
      clearInterval(this._simulationInterval);
      this._simulationInterval = null;
    }
  };
  Window_BiologicSimulation.prototype.updateBiologicActivity = function () {
    if (!this._actor || !this._actor._biologicData) return;

    var bio = this._actor._biologicData;
    var hungerRate = $gameVariables.value(54) || 50; // 0-100, 0 = very hungry
    var sleepRate = $gameVariables.value(55) || 50; // 0-100, 0 = very sleepy

    // Update vital signs with natural fluctuation
    this.updateVitalSigns(bio, hungerRate, sleepRate);

    // Update hormones
    this.updateHormones(bio, hungerRate, sleepRate);

    // Update immune system activity
    this.updateImmuneSystem(bio, hungerRate, sleepRate);

    // Update brain activity
    this.updateBrainActivity(bio, hungerRate, sleepRate);

    // Update ley veins
    this.updateLeyVeinsActivity(bio);

    // Update cellular activity
    this.updateCellularActivity(bio, hungerRate, sleepRate);
    this.updatePregnancy();
  };

  Window_BiologicSimulation.prototype.updateVitalSigns = function (
    bio,
    hunger,
    sleep
  ) {
    var vitalMods = bio.personality.modifiers?.vitals || {};

    var baseHeart = 70 * (vitalMods.heartRate || 1.0);
    var baseTemp = 36.8; // Temperature is usually stable
    var baseBP = {
      systolic: 120 * (vitalMods.bloodPressure || 1.0),
      diastolic: 80 * (vitalMods.bloodPressure || 1.0),
    };

    // Hunger effects (0 = very hungry)
    var hungerMultiplier = (100 - hunger) / 100; // Higher when hungry
    baseHeart += hungerMultiplier * 15; // Heart rate increases when hungry
    baseTemp -= hungerMultiplier * 0.5; // Temperature drops when hungry

    // Sleep effects (0 = very sleepy)
    var sleepMultiplier = (100 - sleep) / 100; // Higher when tired
    baseHeart += sleepMultiplier * 20; // Heart rate increases when tired
    baseTemp += sleepMultiplier * 0.3; // Temperature rises when tired
    baseBP.systolic += sleepMultiplier * 15;

    // Natural fluctuation
    bio.vitalSigns.heartRate += (Math.random() - 0.5) * 4;
    bio.vitalSigns.heartRate = Math.max(
      40,
      Math.min(120, baseHeart + (Math.random() - 0.5) * 10)
    );

    bio.vitalSigns.bodyTemperature += (Math.random() - 0.5) * 0.1;
    bio.vitalSigns.bodyTemperature = Math.max(
      35.0,
      Math.min(38.5, baseTemp + (Math.random() - 0.5) * 0.5)
    );

    bio.vitalSigns.bloodPressure.systolic += (Math.random() - 0.5) * 2;
    bio.vitalSigns.bloodPressure.systolic = Math.max(
      90,
      Math.min(160, baseBP.systolic + (Math.random() - 0.5) * 15)
    );

    bio.vitalSigns.bloodPressure.diastolic += (Math.random() - 0.5) * 2;
    bio.vitalSigns.bloodPressure.diastolic = Math.max(
      60,
      Math.min(100, baseBP.diastolic + (Math.random() - 0.5) * 10)
    );

    bio.vitalSigns.oxygenSaturation += (Math.random() - 0.5) * 1;
    bio.vitalSigns.oxygenSaturation = Math.max(
      90,
      Math.min(100, bio.vitalSigns.oxygenSaturation)
    );

    // Update nutrients based on hunger
    if (hunger < 30) {
      // Very hungry
      bio.vitalSigns.nutrients.calories = Math.max(
        0,
        bio.vitalSigns.nutrients.calories - Math.random() * 5
      );
      bio.vitalSigns.nutrients.protein = Math.max(
        0,
        bio.vitalSigns.nutrients.protein - Math.random() * 2
      );
      bio.vitalSigns.nutrients.carbs = Math.max(
        0,
        bio.vitalSigns.nutrients.carbs - Math.random() * 3
      );
      bio.vitalSigns.nutrients.fats = Math.max(
        0,
        bio.vitalSigns.nutrients.fats - Math.random() * 1
      );
    }

    // Cortisol increases with hunger and sleep deprivation
    var baseCortisol = 15 * (vitalMods.cortisol || 1.0);
    var stressLevel = (100 - hunger + (100 - sleep)) / 2;
    bio.vitalSigns.cortisol = Math.max(
      5,
      Math.min(
        50,
        baseCortisol + (stressLevel / 100) * 20 + (Math.random() - 0.5) * 3
      )
    );
  };

  Window_BiologicSimulation.prototype.updateHormones = function (
    bio,
    hunger,
    sleep
  ) {
    var hormoneMods = bio.personality.modifiers?.hormones || {};

    // Hormones fluctuate based on circadian rhythm, hunger, and sleep
    var currentGender = $gameVariables.value(38) || 0;

    // Growth hormone increases during sleep deprivation (body trying to compensate)
    if (sleep < 40) {
      bio.hormones.growth += Math.random() * 0.5;
    } else {
      bio.hormones.growth += (Math.random() - 0.5) * 0.2;
    }
    bio.hormones.growth = Math.max(0.5, Math.min(8, bio.hormones.growth));

    // Insulin fluctuates with hunger
    if (hunger < 50) {
      bio.hormones.insulin += Math.random() * 2; // Increases when hungry
    } else {
      bio.hormones.insulin += (Math.random() - 0.5) * 1;
    }
    bio.hormones.insulin = Math.max(2, Math.min(20, bio.hormones.insulin));

    // Adrenaline increases with stress (hunger/sleep deprivation)
    var stressLevel = (100 - hunger + (100 - sleep)) / 2;
    bio.hormones.adrenaline +=
      (stressLevel / 100) * 5 + (Math.random() - 0.5) * 10;
    var adrMod = hormoneMods.adrenaline || 1.0;
    bio.hormones.adrenaline = Math.max(
      10 * adrMod,
      Math.min(100 * adrMod, bio.hormones.adrenaline)
    );

    // Sex hormones fluctuate naturally
    bio.hormones.testosterone += (Math.random() - 0.5) * 20;
    bio.hormones.estrogen += (Math.random() - 0.5) * 15;
    bio.hormones.progesterone += (Math.random() - 0.5) * 1;

    // Keep within gender-appropriate ranges (modified by personality)
    var testMod = hormoneMods.testosterone || 1.0;
    var estMod = hormoneMods.estrogen || 1.0;

    if (currentGender === 0) {
      // Male
      bio.hormones.testosterone = Math.max(
        250 * testMod,
        Math.min(1000 * testMod, bio.hormones.testosterone)
      );
      bio.hormones.estrogen = Math.max(
        10 * estMod,
        Math.min(50 * estMod, bio.hormones.estrogen)
      );
    } else if (currentGender === 1) {
      // Female
      bio.hormones.testosterone = Math.max(
        10 * testMod,
        Math.min(80 * testMod, bio.hormones.testosterone)
      );
      bio.hormones.estrogen = Math.max(
        20 * estMod,
        Math.min(400 * estMod, bio.hormones.estrogen)
      );
    }

    bio.hormones.progesterone = Math.max(
      0.1,
      Math.min(25, bio.hormones.progesterone)
    );

    // Thyroid fluctuates slightly
    bio.hormones.thyroid += (Math.random() - 0.5) * 0.3;
    bio.hormones.thyroid = Math.max(0.5, Math.min(5.0, bio.hormones.thyroid));
  };
  Window_BiologicSimulation.prototype.updateBrainActivity = function (
    bio,
    hunger,
    sleep
  ) {
    if (!bio.brainActivity) {
      this.initializeBrainActivity(bio);
    }

    var brain = bio.brainActivity;
    var alertnessLevel = (hunger + sleep) / 200; // 0-1 scale

    // Update brain wave patterns
    brain.waves.alpha += (Math.random() - 0.5) * 5;
    brain.waves.beta += (Math.random() - 0.5) * 8;
    brain.waves.theta += (Math.random() - 0.5) * 3;
    brain.waves.delta += (Math.random() - 0.5) * 2;
    brain.waves.gamma += (Math.random() - 0.5) * 10;

    // Adjust based on sleep level
    if (sleep < 30) {
      // Very tired
      brain.waves.delta += 5; // Increase delta waves
      brain.waves.theta += 3;
      brain.waves.beta -= 5;
      brain.waves.gamma -= 3;
    } else if (sleep > 70) {
      // Well rested
      brain.waves.beta += 3;
      brain.waves.gamma += 2;
      brain.waves.alpha += 2;
    }

    // Keep waves in realistic ranges
    brain.waves.alpha = Math.max(0, Math.min(30, brain.waves.alpha));
    brain.waves.beta = Math.max(0, Math.min(40, brain.waves.beta));
    brain.waves.theta = Math.max(0, Math.min(20, brain.waves.theta));
    brain.waves.delta = Math.max(0, Math.min(15, brain.waves.delta));
    brain.waves.gamma = Math.max(0, Math.min(25, brain.waves.gamma));

    // Update brain regions activity
    for (var region in brain.regions) {
      var regionData = brain.regions[region];

      // Base activity changes
      regionData.activity += (Math.random() - 0.5) * 10;

      // Apply alertness effects
      if (alertnessLevel < 0.3) {
        // Low alertness
        regionData.activity *= 0.7;
      } else if (alertnessLevel > 0.8) {
        // High alertness
        regionData.activity *= 1.2;
      }

      // Keep activity in range
      regionData.activity = Math.max(10, Math.min(100, regionData.activity));

      // Update status based on activity
      if (regionData.activity > 80) {
        regionData.status = "Highly Active";
      } else if (regionData.activity > 60) {
        regionData.status = "Active";
      } else if (regionData.activity > 40) {
        regionData.status = "Moderate";
      } else if (regionData.activity > 20) {
        regionData.status = "Low Activity";
      } else {
        regionData.status = "Minimal";
      }

      // Update oxygen consumption based on activity
      regionData.oxygenConsumption =
        (regionData.activity / 100) * regionData.maxOxygen;

      // Update neurotransmitter levels with fluctuation
      for (var nt in regionData.neurotransmitters) {
        regionData.neurotransmitters[nt] += (Math.random() - 0.5) * 2;
        regionData.neurotransmitters[nt] = Math.max(
          0,
          Math.min(100, regionData.neurotransmitters[nt])
        );
      }
    }

    // Update overall brain stats
    var totalActivity = 0;
    var activeRegions = 0;

    for (var region in brain.regions) {
      totalActivity += brain.regions[region].activity;
      if (brain.regions[region].activity > 50) activeRegions++;
    }

    brain.overallActivity = totalActivity / Object.keys(brain.regions).length;
    brain.activeRegions = activeRegions;
    brain.totalRegions = Object.keys(brain.regions).length;

    // Update neuron activity
    brain.neurons.firing += Math.floor((Math.random() - 0.5) * 1000000);
    brain.neurons.firing = Math.max(
      50000000,
      Math.min(200000000, brain.neurons.firing)
    );

    brain.neurons.connections += Math.floor((Math.random() - 0.5) * 100000);
    brain.neurons.connections = Math.max(
      100000000000,
      Math.min(150000000000, brain.neurons.connections)
    );
  };

  Window_BiologicSimulation.prototype.initializeBrainActivity = function (bio) {
    // Deep copy the BRAIN_REGIONS data to avoid modifying the global constant
    var regions = JSON.parse(JSON.stringify(BRAIN_REGIONS));

    // Apply personality modifiers
    var personality = bio.personality;
    if (personality && personality.modifiers?.brain) {
      var brainMods = personality.modifiers?.brain;
      for (var regionKey in regions) {
        if (regions.hasOwnProperty(regionKey) && brainMods[regionKey]) {
          var mod = brainMods[regionKey];
          var regionData = regions[regionKey];
          // Apply modifier and clamp
          regionData.activity = Math.max(
            10,
            Math.min(100, regionData.activity * mod)
          );
          // Set this modified value as the new 'normal' for resets
          regionData.normalActivity = regionData.activity;
        }
      }
    }

    bio.brainActivity = {
      overallActivity: 65 + Math.random() * 20,
      activeRegions: 0,
      totalRegions: 0,

      waves: {
        alpha: 8 + Math.random() * 5, // 8-13 Hz (relaxed awareness)
        beta: 15 + Math.random() * 15, // 13-30 Hz (active thinking)
        theta: 4 + Math.random() * 4, // 4-8 Hz (drowsy)
        delta: 1 + Math.random() * 3, // 0.5-4 Hz (deep sleep)
        gamma: 30 + Math.random() * 20, // 30-100 Hz (consciousness)
      },

      neurons: {
        total: 86000000000, // ~86 billion neurons
        firing: 100000000 + Math.floor(Math.random() * 50000000),
        connections: 125000000000, // ~125 trillion connections
        activeConnections: 0,
      },

      regions: regions, // Use the modified regions object
    };

    // Initialize oxygen consumption
    for (var region in bio.brainActivity.regions) {
      var regionData = bio.brainActivity.regions[region];
      regionData.oxygenConsumption =
        (regionData.activity / 100) * regionData.maxOxygen;
    }
  };

  Window_BiologicSimulation.prototype.updateLeyVeinsActivity = function (bio) {
    // Ley veins fluctuate with magical energy
    var mpRatio = this._actor.mp / this._actor.mmp;
    bio.leyVeins.flow =
      Math.floor(mpRatio * 100) + Math.floor((Math.random() - 0.5) * 10);
    bio.leyVeins.flow = Math.max(0, Math.min(150, bio.leyVeins.flow));

    // Meridians fluctuate slightly
    for (var meridian in bio.leyVeins.meridians) {
      var meridianData = bio.leyVeins.meridians[meridian];
      if (meridianData.status === "Normal") {
        meridianData.flow += (Math.random() - 0.5) * 5;
        meridianData.flow = Math.max(80, Math.min(120, meridianData.flow));

        if (meridianData.magicalActivity) {
          meridianData.magicalActivity += (Math.random() - 0.5) * 10;
          meridianData.magicalActivity = Math.max(
            90,
            Math.min(110, meridianData.magicalActivity)
          );
        }
      }
    }
  };
  Window_BiologicSimulation.prototype.updateCellularActivity = function (
    bio,
    hunger,
    sleep
  ) {
    if (!bio.cellularActivity) {
      bio.cellularActivity = {
        cellsDying: Math.floor(Math.random() * 100000) + 50000,
        cellsForming: Math.floor(Math.random() * 100000) + 60000,
        mitosisRate: Math.random() * 100,
        apoptosisRate: Math.random() * 100,
        totalCells: 37200000000000, // Approximate human cell count
      };
    }

    var activity = bio.cellularActivity;
    var healthMultiplier = (hunger + sleep) / 200; // 0-1 scale

    // Cells forming (mitosis)
    var baseFormation = 100000 * healthMultiplier;
    activity.cellsForming = Math.floor(
      baseFormation * (0.8 + Math.random() * 0.4)
    );

    // Cells dying (apoptosis)
    var baseDeath = 80000 * (2 - healthMultiplier); // Dies more when unhealthy
    activity.cellsDying = Math.floor(baseDeath * (0.8 + Math.random() * 0.4));

    // Update rates
    activity.mitosisRate =
      (activity.cellsForming / activity.totalCells) * 100000000;
    activity.apoptosisRate =
      (activity.cellsDying / activity.totalCells) * 100000000;

    // Net change in cell count
    var netChange = activity.cellsForming - activity.cellsDying;
    activity.totalCells = Math.max(
      30000000000000,
      activity.totalCells + netChange
    );
  };

  Window_BiologicSimulation.prototype.updateImmuneSystem = function (
    bio,
    hunger,
    sleep
  ) {
    // Immune system weakens with poor nutrition and sleep
    var immuneEfficiency = (hunger + sleep) / 200; // 0-1 scale

    // White blood cells fluctuate
    bio.immuneSystem.whiteBloodCells += (Math.random() - 0.5) * 500;
    var baseWBC = 7500 * immuneEfficiency;
    bio.immuneSystem.whiteBloodCells = Math.max(
      2000,
      Math.min(15000, baseWBC + (Math.random() - 0.5) * 2000)
    );

    // Antibodies fluctuate
    bio.immuneSystem.antibodies += (Math.random() - 0.5) * 50;
    var baseAntibodies = 1200 * immuneEfficiency;
    bio.immuneSystem.antibodies = Math.max(
      400,
      Math.min(2000, baseAntibodies + (Math.random() - 0.5) * 200)
    );

    // Cellular death and regeneration
    if (!bio.cellularActivity) {
      bio.cellularActivity = {
        cellsDying: 0,
        cellsForming: 0,
        mitosisRate: 0,
        apoptosisRate: 0,
      };
    }

    // Update cellular activity
    this.updateCellularActivity(bio, hunger, sleep);

    // Gradually reduce persistent infections over time using game date
    var reductionRate = immuneEfficiency * 500; // Reduced based on immune efficiency
    var currentGameDate = convertGameDateToTimestamp(getGameDateFromVariable());

    // Process bacteria
    for (var i = bio.immuneSystem.bacteria.length - 1; i >= 0; i--) {
      var bacterium = bio.immuneSystem.bacteria[i];
      if (!bacterium.temporary && bacterium.infectionStartDate !== undefined) {
        // Calculate days elapsed since infection started
        var daysInfected = Math.max(0, currentGameDate - bacterium.infectionStartDate);

        // Gradually reduce persistent infection count based on immune efficiency and days infected
        var dailyReduction = reductionRate / (daysInfected + 1); // Earlier infections reduce faster with good immunity
        bacterium.count = Math.max(0, bacterium.count - dailyReduction);

        // Remove infection if count reaches 0 or after 30 days of infection
        if (bacterium.count <= 0 || daysInfected > 30) {
          bio.immuneSystem.bacteria.splice(i, 1);
        }
      }
    }

    // Process viruses
    for (var j = bio.immuneSystem.viruses.length - 1; j >= 0; j--) {
      var virus = bio.immuneSystem.viruses[j];
      if (!virus.temporary && virus.infectionStartDate !== undefined) {
        // Calculate days elapsed since infection started
        var daysInfected = Math.max(0, currentGameDate - virus.infectionStartDate);

        // Gradually reduce persistent infection count based on immune efficiency and days infected
        var dailyReduction = reductionRate / (daysInfected + 1); // Earlier infections reduce faster with good immunity
        virus.count = Math.max(0, virus.count - dailyReduction);

        // Remove infection if count reaches 0 or after 14 days of infection (viruses clear faster)
        if (virus.count <= 0 || daysInfected > 14) {
          bio.immuneSystem.viruses.splice(j, 1);
        }
      }
    }
  };

  Window_BiologicSimulation.prototype.initializeBiologicData = function () {
    if (!this._actor._biologicData) {
      this._actor._biologicData = {};
      // Determine personality first, as it affects baselines
      this._actor._biologicData.personality = this.determinePersonality(
        this._actor.name()
      );
      var personality = this._actor._biologicData.personality;
    var vitalMods = personality.modifiers?.vitals || {};
    var hormoneMods = personality.modifiers?.hormones || {};
      // Initialize vital signs
      var baseHP = this._actor.mhp;
      var baseMP = this._actor.mmp;

      this._actor._biologicData.vitalSigns = {
        heartRate: 60 + Math.floor(Math.random() * 40), // 60-100 BPM
        bloodPressure: {
          systolic: 110 + Math.floor(Math.random() * 30), // 110-140
          diastolic: 70 + Math.floor(Math.random() * 20), // 70-90
        },
        bodyTemperature: 36.0 + Math.random() * 1.5, // 36.0-37.5°C
        oxygenSaturation: 95 + Math.floor(Math.random() * 5), // 95-100%
        nutrients: {
          calories: 1800 + Math.floor(Math.random() * 400), // 1800-2200
          protein: 50 + Math.floor(Math.random() * 30), // 50-80g
          carbs: 200 + Math.floor(Math.random() * 100), // 200-300g
          fats: 60 + Math.floor(Math.random() * 40), // 60-100g
          water: 2000 + Math.floor(Math.random() * 500), // 2000-2500ml
        },
        cortisol: 10 + Math.floor(Math.random() * 15), // 10-25 μg/dL
      };

      // Initialize hormones with gender consideration
      var currentGender = $gameVariables.value(38) || 0;
      this._actor._biologicData.hormones = {
        testosterone: this.getInitialTestosterone(currentGender),
        estrogen: this.getInitialEstrogen(currentGender),
        progesterone: this.getInitialProgesterone(currentGender),
        cortisol: 10 + Math.floor(Math.random() * 15),
        adrenaline: 20 + Math.floor(Math.random() * 30),
        insulin: 5 + Math.floor(Math.random() * 10),
        growth: 1 + Math.random() * 4,
        thyroid: 1.0 + Math.random() * 3.0,
      };

      // Initialize immune system
      this._actor._biologicData.immuneSystem = {
        whiteBloodCells: 4000 + Math.floor(Math.random() * 7000), // 4000-11000/μL
        antibodies: 700 + Math.floor(Math.random() * 900), // 700-1600 mg/dL
        viruses: [],
        bacteria: [],
        infections: this.checkForInfections(),
      };

      // Initialize ley veins (magical system)
      this._actor._biologicData.leyVeins = {
        flow: Math.floor((this._actor.mp / this._actor.mmp) * 100), // Based on current MP
        meridians: {
          head: { status: "Normal", flow: 100, blockage: 0 },
          heart: { status: "Normal", flow: 100, blockage: 0 },
          lungs: { status: "Normal", flow: 100, blockage: 0 },
          liver: { status: "Normal", flow: 100, blockage: 0 },
          kidneys: { status: "Normal", flow: 100, blockage: 0 },
          arms: { status: "Normal", flow: 100, blockage: 0 },
          legs: { status: "Normal", flow: 100, blockage: 0 },
        },
      };

      // Initialize brain activity
      this.initializeBrainActivity(this._actor._biologicData);
      this.initializeUterusData();
      // Set blood type based on character name
      this._actor._biologicData.bloodType = this.determineBloodType(
        this._actor.name()
      );

      this.updateLeyVeinsFromDamage();
      
    }
  };
  Window_BiologicSimulation.prototype.initializeUterusData = function () {
    if (!this._actor._uterusData) {
      var pregnancyType = $gameVariables.value(87) || 0;
          // If male (pregnancyType === 0), initialize testes data instead
          if (pregnancyType === 0) {
            if (!this._actor.testesData) {
                var bio = this._actor._biologicData;
                this._actor.testesData = {
                    spermCount: 200000000 + Math.floor(Math.random() * 300000000),
                    spermMotility: 50 + Math.random() * 30,
                    spermMorphology: 4 + Math.random() * 10,
                    testosteroneProduction: bio.hormones.testosterone,
                    fertilityRate: 0,
                    dailySpermProduction: 0,
                    lastUpdate: convertGameDateToTimestamp(getGameDateFromVariable())
                };
            }
            return; // Exit early for male
        }
      this._actor._uterusData = {
        pregnancyType: pregnancyType, // 0=testicles, 1=uterus, 2=oviparous, 3=plant, 4=mitosis
        isPregnant: false,
        conceptionDate: null,
        dueDate: null,
        gestationalAge: 0,
        fetus: null,
        // Uterus-specific data
        ovulationCycle: {
          dayInCycle: Math.floor(Math.random() * 28) + 1,
          cycleLength: 28,
          ovulationDay: 14,
          fertile: false,
        },
        eggCount: 300000 + Math.floor(Math.random() * 200000),
        // Oviparous-specific data
        eggDevelopment: 0, // 0-100%
        eggsToLay: 0,
        // Plant-specific data
        seedDevelopment: 0, // 0-100%
        seedsReady: 0,
        // Mitosis-specific data
        mitosisDevelopment: 0, // 0-100%
        lastStatusCheck: convertGameDateToTimestamp(getGameDateFromVariable()),
        lastCycleUpdate: convertGameDateToTimestamp(getGameDateFromVariable()),
        birthReady: false,
      };
    }
    
    // Always sync with variable 87
    this._actor._uterusData.pregnancyType = $gameVariables.value(87) || 0;
  };
  Window_BiologicSimulation.prototype.updatePregnancy = function () {
    if (!this._actor._uterusData) return;
  
    var uterus = this._actor._uterusData;
    var pregnancyType = $gameVariables.value(87) || 0;
  
    if (!uterus.isPregnant) {
      // Update ovulation cycle for uterus type when not pregnant
      if (pregnancyType === 1) {
        this.updateOvulationCycle();
      }
      return;
    }
  
    if (uterus.conceptionDate) {
      var now = convertGameDateToTimestamp(getGameDateFromVariable());
      var elapsed = now - uterus.conceptionDate;  // elapsed is in days
      uterus.gestationalAge = Math.floor(elapsed);

      switch (pregnancyType) {
        case 1: // Uterus
          if (uterus.gestationalAge >= 270) {
            this.giveBirth();
            return;
          }
          this.updateFetusData();
          this.applyPregnancyEffects();
          break;

        case 2: // Oviparous
          uterus.eggDevelopment = Math.min(100, (elapsed / 270) * 100);
          if (uterus.eggDevelopment >= 100) {
            this.layEggs();
            return;
          }
          this.applyOviparousEffects();
          break;

        case 3: // Plant seeds
          uterus.seedDevelopment = Math.min(100, (elapsed / 7) * 100);
          if (uterus.seedDevelopment >= 100) {
            this.produceSeed();
            return;
          }
          this.applyPlantEffects();
          break;

        case 4: // Mitosis
          uterus.mitosisDevelopment = Math.min(100, (elapsed / 1) * 100);
          if (uterus.mitosisDevelopment >= 100) {
            this.completeMitosis();
            return;
          }
          this.applyMitosisEffects();
          break;
      }

      // Random status effects (check every 1 day in game time)
      if (now - uterus.lastStatusCheck > 1) {
        this.applyPregnancyStatuses();
        uterus.lastStatusCheck = now;
      }
    }
  };
  
  Window_BiologicSimulation.prototype.updateFetusData = function () {
    var age = this._actor._uterusData.gestationalAge;
    var fetus = {
      stage: "",
      week: Math.floor(age / 7),
      description: "",
      size: "",
      weight: "",
      developments: [],
    };
  
    if (age < 14) {
      // Weeks 0-2
      fetus.stage = "Fertilization & Implantation";
      fetus.size = "0.1-0.2 mm";
      fetus.weight = "< 1 mg";
      fetus.description = "Zygote dividing and traveling to uterus";
      fetus.developments = [
        "Rapid cell division",
        "Traveling through fallopian tube",
        "Implanting into uterine wall",
      ];
    } else if (age < 56) {
      // Weeks 2-8
      fetus.stage = "Embryonic Stage";
      var sizeProgress = ((age - 14) / 42) * 15;
      fetus.size = (0.5 + sizeProgress).toFixed(1) + " mm";
      fetus.weight = "< 1 g";
      fetus.description = "Major organs beginning to form";
      fetus.developments = [
        "Neural tube developing",
        "Heart beginning to beat (week 5-6)",
        "Limb buds forming",
        "Brain and spinal cord forming",
        "Basic facial features emerging",
      ];
    } else if (age < 84) {
      // Weeks 8-12
      fetus.stage = "Early Fetal Stage";
      var sizeProgress = ((age - 56) / 28) * 45;
      fetus.size = (16 + sizeProgress).toFixed(1) + " mm";
      var weightProgress = ((age - 56) / 28) * 14;
      fetus.weight = weightProgress.toFixed(1) + " g";
      fetus.description = "All major organs now present";
      fetus.developments = [
        "Fingers and toes separating",
        "Sex organs developing",
        "Bones beginning to harden",
        "Spontaneous movements",
        "Vocal cords forming",
      ];
    } else if (age < 168) {
      // Weeks 12-24
      fetus.stage = "Mid Fetal Stage";
      var sizeProgress = ((age - 84) / 84) * 239;
      fetus.size = (61 + sizeProgress).toFixed(0) + " mm";
      var weightProgress = ((age - 84) / 84) * 586;
      fetus.weight = (14 + weightProgress).toFixed(0) + " g";
      fetus.description = "Rapid growth and sensory development";
      fetus.developments = [
        "Hearing developing",
        "Eyes can open and close",
        "Fingerprints forming",
        "Responding to sounds",
        "Lungs developing (not yet functional)",
        "Can hiccup",
        "Developing sleep patterns",
      ];
    } else {
      // Weeks 24-38+
      fetus.stage = "Late Fetal Stage";
      var sizeProgress = ((age - 168) / 102) * 200;
      fetus.size = (300 + sizeProgress).toFixed(0) + " mm";
      var weightProgress = ((age - 168) / 102) * 2700;
      fetus.weight = (600 + weightProgress).toFixed(0) + " g";
      fetus.description = "Final maturation and preparing for birth";
      fetus.developments = [
        "Lungs maturing rapidly",
        "Brain development accelerating",
        "Accumulating body fat",
        "Immune system strengthening",
        "Practicing breathing movements",
        "Moving into birth position",
        "Fully developed organs",
      ];
    }
  
    this._actor._uterusData.fetus = fetus;
  };
  
  Window_BiologicSimulation.prototype.applyPregnancyEffects = function () {
    if (!this._actor._biologicData) return;
  
    var bio = this._actor._biologicData;
    var age = this._actor._uterusData.gestationalAge;
    var trimester = age < 84 ? 1 : age < 196 ? 2 : 3;
  
    // Heart rate increases during pregnancy
    bio.vitalSigns.heartRate += 10 + trimester * 5;
  
    // Blood pressure changes
    if (trimester === 1 || trimester === 2) {
      bio.vitalSigns.bloodPressure.systolic -= 5;
    } else {
      bio.vitalSigns.bloodPressure.systolic += 10;
    }
  
    // Slightly elevated body temperature
    bio.vitalSigns.bodyTemperature += 0.3;
  
    // Dramatic hormone changes
    bio.hormones.progesterone = 20 + trimester * 5;
    bio.hormones.estrogen = 300 + (age / 270) * 300;
  
    // Increased caloric needs
    bio.vitalSigns.nutrients.calories -= 5 * trimester;
    bio.vitalSigns.nutrients.protein -= 2 * trimester;
  };
  Window_BiologicSimulation.prototype.applyOviparousEffects = function () {
    if (!this._actor._biologicData) return;
    
    var bio = this._actor._biologicData;
    var development = this._actor._uterusData.eggDevelopment;
    
    // Increased metabolic rate
    bio.vitalSigns.heartRate += 5 + (development / 100) * 10;
    bio.vitalSigns.bodyTemperature += 0.5;
    
    // Increased calcium needs for shell formation
    bio.vitalSigns.nutrients.protein -= 3;
    bio.vitalSigns.nutrients.calories -= 10;
  };
  
  Window_BiologicSimulation.prototype.applyPlantEffects = function () {
    if (!this._actor._biologicData) return;
    
    var bio = this._actor._biologicData;
    var development = this._actor._uterusData.seedDevelopment;
    
    // Increased photosynthesis-like activity
    bio.vitalSigns.oxygenSaturation += 2;
    bio.vitalSigns.bodyTemperature -= 0.3; // Cooler
    
    // Need more water and nutrients
    bio.vitalSigns.nutrients.water -= 5;
    bio.vitalSigns.nutrients.carbs -= 2;
  };
  
  Window_BiologicSimulation.prototype.applyMitosisEffects = function () {
    if (!this._actor._biologicData) return;
    
    var bio = this._actor._biologicData;
    var development = this._actor._uterusData.mitosisDevelopment;
    
    // Extreme cellular activity
    bio.vitalSigns.heartRate += 15 + (development / 100) * 25;
    bio.vitalSigns.bodyTemperature += 1.0 + (development / 100) * 0.5;
    
    if (bio.cellularActivity) {
      bio.cellularActivity.cellsForming *= 2.0 + (development / 100);
      bio.cellularActivity.mitosisRate *= 3.0;
    }
    
    // High energy demands
    bio.vitalSigns.nutrients.calories -= 15;
    bio.vitalSigns.nutrients.protein -= 5;
    bio.vitalSigns.nutrients.carbs -= 8;
  };
  Window_BiologicSimulation.prototype.applyPregnancyStatuses = function () {
    var age = this._actor._uterusData.gestationalAge;
    var trimester = age < 84 ? 1 : age < 196 ? 2 : 3;
  
    // First trimester: 40% chance of nausea
    if (trimester === 1 && Math.random() < 0.4) {
      if (!this._actor.isStateAffected(41)) {
        this._actor.addState(41); // Nausea
      }
    }
  
    // Random hot/cold flashes (20% chance)
    if (Math.random() < 0.2) {
      if (Math.random() < 0.5) {
        if (!this._actor.isStateAffected(25)) {
          this._actor.addState(25); // Hot
        }
      } else {
        if (!this._actor.isStateAffected(26)) {
          this._actor.addState(26); // Cold
        }
      }
    }
  };
  
  Window_BiologicSimulation.prototype.updateOvulationCycle = function () {
    var now = convertGameDateToTimestamp(getGameDateFromVariable());
    var uterus = this._actor._uterusData;
    var ovulation = uterus.ovulationCycle;

    // Progress cycle by one day every game day
    if (now - uterus.lastCycleUpdate > 1) {
      var daysPassed = Math.floor(now - uterus.lastCycleUpdate);
      for (var i = 0; i < daysPassed; i++) {
        ovulation.dayInCycle = (ovulation.dayInCycle % ovulation.cycleLength) + 1;

        // Decrease egg count with each cycle
        if (ovulation.dayInCycle === 1) {
          uterus.eggCount = Math.max(0, uterus.eggCount - 1);
        }
      }
      uterus.lastCycleUpdate = now;
    }

    // Determine fertile window (days 12-16)
    ovulation.fertile =
      ovulation.dayInCycle >= 12 && ovulation.dayInCycle <= 16;
  };
  
  Window_BiologicSimulation.prototype.giveBirth = function () {
    var uterus = this._actor._uterusData;
    uterus.isPregnant = false;
    uterus.conceptionDate = null;
    uterus.dueDate = null;
    uterus.gestationalAge = 0;
    uterus.fetus = null;
    uterus.birthReady = true;
  };
  Window_BiologicSimulation.prototype.layEggs = function () {
    var uterus = this._actor._uterusData;
    uterus.eggsToLay = Math.floor(Math.random() * 4) + 1; // 1-4 eggs
    uterus.isPregnant = false;
    uterus.conceptionDate = null;
    uterus.dueDate = null;
    uterus.gestationalAge = 0;
    uterus.eggDevelopment = 0;
    uterus.birthReady = true;
    
    var message = getTranslatedText(
      "Eggs ready to lay! You have " + uterus.eggsToLay + " egg(s).",
      "Uova pronte da deporre! Hai " + uterus.eggsToLay + " uovo/a."
    );
    $gameMessage.add(message);
  };
  
  Window_BiologicSimulation.prototype.produceSeed = function () {
    var uterus = this._actor._uterusData;
    uterus.seedsReady += 1;

    // Don't stop pregnancy, just reset the timer to produce another seed
    uterus.conceptionDate = convertGameDateToTimestamp(getGameDateFromVariable());
    uterus.dueDate = uterus.conceptionDate + 7; // Next seed in 7 game days
    uterus.gestationalAge = 0;
    uterus.seedDevelopment = 0;
    // Keep isPregnant = true so it continues producing
    
    var message = getTranslatedText(
      "Seed produced! Total seeds ready: " + uterus.seedsReady,
      "Seme prodotto! Totale semi pronti: " + uterus.seedsReady
    );
    $gameMessage.add(message);
  };
  
  Window_BiologicSimulation.prototype.completeMitosis = function () {
    var uterus = this._actor._uterusData;
    uterus.isPregnant = false;
    uterus.conceptionDate = null;
    uterus.dueDate = null;
    uterus.gestationalAge = 0;
    uterus.mitosisDevelopment = 0;
    uterus.birthReady = true;
    
    var message = getTranslatedText(
      "Mitosis complete! A perfect clone has been created.",
      "Mitosi completa! Un clone perfetto à¨ stato creato."
    );
    $gameMessage.add(message);
  };
  // 4. ADD the drawing method for the uterus tab
  Window_BiologicSimulation.prototype.drawUterus = function (startY) {
    var uterus = this._actor._uterusData;
    var pregnancyType = $gameVariables.value(87) || 0;
    var y = startY;
    var lineHeight = this.lineHeight();
  
    if (pregnancyType === -1) {
      this.changeTextColor(this.textColor(18));
      this.drawText(getTranslatedText("No reproductive system present", "Nessun sistema riproduttivo presente"), 6, y, 400);
      this.resetTextColor();
      return;
    }
  
  if (pregnancyType === 0) {
      // Display Testes information
      this.drawTestes(y, lineHeight);
      return;
  }

    // Ensure uterus data is initialized
    if (!uterus) {
      this.initializeUterusData();
      uterus = this._actor._uterusData;
    }

    // Check if birth/completion just happened (only trigger event for uterus type)
    if (uterus && uterus.birthReady) {
      uterus.birthReady = false;
      this.stopBiologicSimulation();
      SceneManager.pop();
      if (pregnancyType === 1) { // Only for uterus type
        $gameTemp.reserveCommonEvent(139);
      }
      return;
    }
  
    var typeNames = [
      { en: "None", it: "Nessuno" },
      { en: "Mammalian (Uterus)", it: "Mammifero (Utero)" },
      { en: "Oviparous (Egg-laying)", it: "Oviparo (Ovidotto)" },
      { en: "Plant-based (Seed production)", it: "Vegetale (Semi)" },
      { en: "Mitosis (Cell division)", it: "Mitosi (Divisione cellulare)" }
    ];
    
    this.changeTextColor(this.systemColor());
    this.drawText(
      getTranslatedText("Type:", "Tipo:"),
      6,
      y,
      200
    );
    this.resetTextColor();
    this.changeTextColor(this.textColor(3));
    if(pregnancyType < 0 || pregnancyType > 4  ){
      pregnancyType = 0;
    }
    var typeName = getTranslatedText(typeNames[pregnancyType].en, typeNames[pregnancyType].it);
    this.drawText(typeName, 250, y, 400);
    this.resetTextColor();
    y += lineHeight * 2;
  
    if (uterus.isPregnant) {
      // === PREGNANCY MODE ===
      this.changeTextColor(this.textColor(3));
      var statusText = "";
      
      switch (pregnancyType) {
        case 1:
          statusText = getTranslatedText("PREGNANCY IN PROGRESS", "GRAVIDANZA IN CORSO");
          break;
        case 2:
          statusText = getTranslatedText("EGG DEVELOPMENT IN PROGRESS", "SVILUPPO UOVA IN CORSO");
          break;
        case 3:
          statusText = getTranslatedText("SEED GENERATION IN PROGRESS", "GENERAZIONE SEMI IN CORSO");
          break;
        case 4:
          statusText = getTranslatedText("MITOSIS IN PROGRESS", "MITOSI IN CORSO");
          break;
      }
      
      this.drawText(statusText, 6, y, 400);
      this.resetTextColor();
      y += lineHeight * 2;
  
      // Display based on type
      switch (pregnancyType) {
        case 1: // Uterus - existing code
          var daysRemaining = 270 - uterus.gestationalAge;
          var totalSeconds = daysRemaining * 24 * 60 * 60;
          var days = Math.floor(totalSeconds / 86400);
          var hours = Math.floor((totalSeconds % 86400) / 3600);
          var minutes = Math.floor((totalSeconds % 3600) / 60);
          var seconds = totalSeconds % 60;
  
          this.changeTextColor(this.systemColor());
          this.drawText(
            getTranslatedText("Time Until Birth:", "Tempo alla Nascita:"),
            6,
            y,
            200
          );
          this.resetTextColor();
          this.changeTextColor(this.textColor(2));
          this.drawText(
            days + "d " + hours + "h " + minutes + "m " + seconds + "s",
            300,
            y,
            380
          );
          this.resetTextColor();
          y += lineHeight;
  
          var ageText = getTranslatedText(
            "Gestational Age: " + uterus.gestationalAge + " days (" + Math.floor(uterus.gestationalAge / 7) + " weeks)",
            "Età  Gestazionale: " + uterus.gestationalAge + " giorni (" + Math.floor(uterus.gestationalAge / 7) + " settimane)"
          );
          this.drawText(ageText, 6, y, 500);
          y += lineHeight;
  
          var trimester =
            uterus.gestationalAge < 84
              ? getTranslatedText("First Trimester", "Primo Trimestre")
              : uterus.gestationalAge < 196
              ? getTranslatedText("Second Trimester", "Secondo Trimestre")
              : getTranslatedText("Third Trimester", "Terzo Trimestre");
          this.changeTextColor(this.textColor(6));
          this.drawText(trimester, 6, y, 300);
          this.resetTextColor();
          y += lineHeight * 2;
  
          // Fetus information
          if (uterus.fetus) {
            this.changeTextColor(this.systemColor());
            this.drawText(
              getTranslatedText("Fetal Development:", "Sviluppo Fetale:"),
              6,
              y,
              200
            );
            this.resetTextColor();
            y += lineHeight;
  
            this.changeTextColor(this.textColor(3));
            this.drawText("Stage: " + uterus.fetus.stage, 20, y, 500);
            this.resetTextColor();
            y += lineHeight;
  
            this.drawText("Week: " + uterus.fetus.week, 20, y, 300);
            y += lineHeight;
  
            this.drawText("Size: " + uterus.fetus.size, 20, y, 300);
            this.drawText("Weight: " + uterus.fetus.weight, 300, y, 200);
            y += lineHeight * 2;
  
            this.changeTextColor(this.textColor(6));
            this.drawText(uterus.fetus.description, 20, y, 550);
            this.resetTextColor();
            y += lineHeight * 2;
  
            this.changeTextColor(this.systemColor());
            this.drawText(
              getTranslatedText("Current Developments:", "Sviluppi Attuali:"),
              6,
              y,
              200
            );
            this.resetTextColor();
            y += lineHeight;
  
            for (var i = 0; i < uterus.fetus.developments.length; i++) {
              this.drawText("• " + uterus.fetus.developments[i], 20, y, 550);
              y += lineHeight;
            }
          }
          break;
  
        case 2: // Oviparous
          this.changeTextColor(this.systemColor());
          this.drawText(
            getTranslatedText("Egg Development:", "Sviluppo Uova:"),
            6,
            y,
            200
          );
          this.resetTextColor();
          y += lineHeight;
  
          this.changeTextColor(this.textColor(3));
          this.drawText(
            getTranslatedText("Progress: ", "Progresso: ") + uterus.eggDevelopment.toFixed(1) + "%",
            20,
            y,
            300
          );
          this.resetTextColor();
          y += lineHeight;
  
          var eggsCount = Math.floor((uterus.eggDevelopment / 25)) + 1;
          eggsCount = Math.min(4, eggsCount);
          this.drawText(
            getTranslatedText("Eggs Forming: ", "Uova in Formazione: ") + eggsCount,
            20,
            y,
            300
          );
          y += lineHeight * 2;
  
          this.changeTextColor(this.systemColor());
          this.drawText(
            getTranslatedText("Development Stage:", "Stadio di Sviluppo:"),
            6,
            y,
            200
          );
          this.resetTextColor();
          y += lineHeight;
  
          var eggStage = "";
          var eggDesc = "";
          if (uterus.eggDevelopment < 25) {
            eggStage = getTranslatedText("Fertilization", "Fertilizzazione");
            eggDesc = getTranslatedText("Initial cell division beginning", "Inizio divisione cellulare iniziale");
          } else if (uterus.eggDevelopment < 50) {
            eggStage = getTranslatedText("Shell Formation", "Formazione Guscio");
            eggDesc = getTranslatedText("Calcium deposits forming protective shell", "Depositi di calcio formano guscio protettivo");
          } else if (uterus.eggDevelopment < 75) {
            eggStage = getTranslatedText("Embryo Development", "Sviluppo Embrione");
            eggDesc = getTranslatedText("Embryo growing inside protective shell", "Embrione cresce dentro guscio protettivo");
          } else {
            eggStage = getTranslatedText("Ready to Lay", "Pronto per Deposizione");
            eggDesc = getTranslatedText("Eggs fully formed and ready for laying", "Uova completamente formate e pronte");
          }
  
          this.changeTextColor(this.textColor(6));
          this.drawText(eggStage, 20, y, 300);
          this.resetTextColor();
          y += lineHeight;
  
          this.drawText(eggDesc, 20, y, 550);
          y += lineHeight;
          break;
  
        case 3: // Plant seeds
        case 3: // Plant
        this.changeTextColor(this.systemColor());
        this.drawText(
          getTranslatedText("Seed Storage:", "Deposito Semi:"),
          6,
          y,
          200
        );
        this.resetTextColor();
        y += lineHeight;
      
        this.changeTextColor(this.textColor(3));
        this.drawText(
          getTranslatedText("Seeds Available: ", "Semi Disponibili: ") + uterus.seedsReady,
          20,
          y,
          400
        );
        this.resetTextColor();
        y += lineHeight;
      
        this.drawText(
          getTranslatedText("Ready to generate new seed", "Pronta per generare nuovo seme"),
          20,
          y,
          400
        );
        break;
  
        case 4: // Mitosis
          this.changeTextColor(this.systemColor());
          this.drawText(
            getTranslatedText("Mitosis Progress:", "Progresso Mitosi:"),
            6,
            y,
            200
          );
          this.resetTextColor();
          y += lineHeight;
  
          this.changeTextColor(this.textColor(3));
          this.drawText(
            getTranslatedText("Progress: ", "Progresso: ") + uterus.mitosisDevelopment.toFixed(1) + "%",
            20,
            y,
            300
          );
          this.resetTextColor();
          y += lineHeight;
  
          var minutesRemaining = Math.ceil(((100 - uterus.mitosisDevelopment) / 100) * 60);
          this.drawText(
            getTranslatedText("Time Remaining: ~", "Tempo Rimanente: ~") + minutesRemaining + getTranslatedText(" minutes", " minuti"),
            20,
            y,
            300
          );
          y += lineHeight * 2;
  
          this.changeTextColor(this.systemColor());
          this.drawText(
            getTranslatedText("Division Phase:", "Fase di Divisione:"),
            6,
            y,
            200
          );
          this.resetTextColor();
          y += lineHeight;
  
          var mitosisStage = "";
          var mitosisDesc = "";
          if (uterus.mitosisDevelopment < 20) {
            mitosisStage = getTranslatedText("Interphase", "Interfase");
            mitosisDesc = getTranslatedText("DNA replication in progress", "Replicazione DNA in corso");
          } else if (uterus.mitosisDevelopment < 40) {
            mitosisStage = getTranslatedText("Prophase", "Profase");
            mitosisDesc = getTranslatedText("Chromosomes condensing", "Cromosomi si condensano");
          } else if (uterus.mitosisDevelopment < 60) {
            mitosisStage = getTranslatedText("Metaphase", "Metafase");
            mitosisDesc = getTranslatedText("Chromosomes aligning", "Cromosomi si allineano");
          } else if (uterus.mitosisDevelopment < 80) {
            mitosisStage = getTranslatedText("Anaphase", "Anafase");
            mitosisDesc = getTranslatedText("Chromosomes separating", "Cromosomi si separano");
          } else {
            mitosisStage = getTranslatedText("Telophase & Cytokinesis", "Telofase e Citocinesi");
            mitosisDesc = getTranslatedText("Cells dividing into two identical copies", "Cellule si dividono in due copie identiche");
          }
  
          this.changeTextColor(this.textColor(6));
          this.drawText(mitosisStage, 20, y, 300);
          this.resetTextColor();
          y += lineHeight;
  
          this.drawText(mitosisDesc, 20, y, 550);
          y += lineHeight;
          break;
      }
    } else {
      // === NOT PREGNANT MODE ===
      this.changeTextColor(this.systemColor());
      this.drawText(
        getTranslatedText("Reproductive Status:", "Stato Riproduttivo:"),
        6,
        y,
        200
      );
      this.resetTextColor();
      y += lineHeight;
  
      this.drawText(
        getTranslatedText("Status: Not pregnant", "Stato: Non incinta"),
        20,
        y,
        300
      );
      y += lineHeight * 2;
  
      // Type-specific idle information
      switch (pregnancyType) {
        case 1: // Uterus
          var ovulation = uterus.ovulationCycle;
          this.changeTextColor(this.systemColor());
          this.drawText(
            getTranslatedText("Ovulation Cycle:", "Ciclo Ovulatorio:"),
            6,
            y,
            200
          );
          this.resetTextColor();
          y += lineHeight;
  
          var cycleText = getTranslatedText(
            "Day " + ovulation.dayInCycle + " of " + ovulation.cycleLength,
            "Giorno " + ovulation.dayInCycle + " di " + ovulation.cycleLength
          );
          this.drawText(cycleText, 20, y, 300);
          y += lineHeight;
  
          var fertileStatus = ovulation.fertile
            ? getTranslatedText("Fertile Window", "Finestra Fertile")
            : getTranslatedText("Not Fertile", "Non Fertile");
          var fertileColor = ovulation.fertile ? this.textColor(3) : this.normalColor();
          this.changeTextColor(fertileColor);
          this.drawText("Status: " + fertileStatus, 20, y, 300);
          this.resetTextColor();
          y += lineHeight;
  
          var nextOvText = getTranslatedText(
            "Next Ovulation: Day " + ovulation.ovulationDay,
            "Prossima Ovulazione: Giorno " + ovulation.ovulationDay
          );
          this.drawText(nextOvText, 20, y, 300);
          y += lineHeight * 2;
  
          this.changeTextColor(this.systemColor());
          this.drawText(
            getTranslatedText("Egg Reserve:", "Riserva Ovociti:"),
            6,
            y,
            200
          );
          this.resetTextColor();
          y += lineHeight;
  
          var eggText = getTranslatedText(
            "Remaining Eggs: " + uterus.eggCount.toLocaleString(),
            "Ovociti Rimanenti: " + uterus.eggCount.toLocaleString()
          );
          this.drawText(eggText, 20, y, 400);
          break;
  
        case 2: // Oviparous
          this.changeTextColor(this.systemColor());
          this.drawText(
            getTranslatedText("Egg Production:", "Produzione Uova:"),
            6,
            y,
            200
          );
          this.resetTextColor();
          y += lineHeight;
  
          if (uterus.eggsToLay > 0) {
            this.changeTextColor(this.textColor(3));
            this.drawText(
              getTranslatedText("Eggs Ready to Lay: ", "Uova Pronte da Deporre: ") + uterus.eggsToLay,
              20,
              y,
              400
            );
            this.resetTextColor();
          } else {
            this.drawText(
              getTranslatedText("Ready for new clutch", "Pronta per nuova covata"),
              20,
              y,
              400
            );
          }
          break;
  
        case 3: // Plant
          this.changeTextColor(this.systemColor());
          this.drawText(
            getTranslatedText("Seed Storage:", "Deposito Semi:"),
            6,
            y,
            200
          );
          this.resetTextColor();
          y += lineHeight;
  
          this.changeTextColor(this.textColor(3));
          this.drawText(
            getTranslatedText("Seeds Available: ", "Semi Disponibili: ") + uterus.seedsReady,
            20,
            y,
            400
          );
          this.resetTextColor();
          y += lineHeight;
  
          this.drawText(
            getTranslatedText("Ready to generate new seed", "Pronta per generare nuovo seme"),
            20,
            y,
            400
          );
          break;
  
        case 4: // Mitosis
          this.changeTextColor(this.systemColor());
          this.drawText(
            getTranslatedText("Cellular Status:", "Stato Cellulare:"),
            6,
            y,
            200
          );
          this.resetTextColor();
          y += lineHeight;
  
          this.drawText(
            getTranslatedText("Ready for cellular division", "Pronta per divisione cellulare"),
            20,
            y,
            400
          );
          y += lineHeight;
  
          this.drawText(
            getTranslatedText("Process takes approximately 1 hour", "Il processo richiede circa 1 ora"),
            20,
            y,
            400
          );
          break;
      }
    }
  };
  Window_BiologicSimulation.prototype.getInitialTestosterone = function (
    gender
  ) {
    if (gender === 0) {
      // Male
      return 300 + Math.floor(Math.random() * 700); // 300-1000 ng/dL
    } else if (gender === 1) {
      // Female
      return 15 + Math.floor(Math.random() * 55); // 15-70 ng/dL
    } else {
      // Non-binary
      return 150 + Math.floor(Math.random() * 400); // 150-550 ng/dL
    }
  };
  Window_BiologicSimulation.prototype.drawTestes = function(startY, lineHeight) {
    var y = startY;
    var bio = this._actor._biologicData;
    
    // Initialize testes data if it doesn't exist
    if (!this._actor.testesData) {
        this._actor.testesData = {
            spermCount: 200000000 + Math.floor(Math.random() * 300000000), // 200-500 million per mL
            spermMotility: 50 + Math.random() * 30, // 50-80% (WHO normal: >40%)
            spermMorphology: 4 + Math.random() * 10, // 4-14% normal forms (WHO: >4%)
            testosteroneProduction: bio.hormones.testosterone,
            fertilityRate: 0,
            dailySpermProduction: 0,
            lastUpdate: Date.now()
        };
    }
    
    var testes = this._actor.testesData;
    
    // Update testes data based on hormones and health
    var now = Date.now();
    if (now - testes.lastUpdate > 3600000) { // Update every hour
        testes.testosteroneProduction = bio.hormones.testosterone;
        testes.lastUpdate = now;
    }
    
    // Calculate fertility rate based on sperm parameters
    var motilityScore = (testes.spermMotility / 80) * 100;
    var morphologyScore = (testes.spermMorphology / 14) * 100;
    var countScore = Math.min(100, (testes.spermCount / 500000000) * 100);
    testes.fertilityRate = ((motilityScore + morphologyScore + countScore) / 3).toFixed(1);
    
    // Daily sperm production (millions)
    testes.dailySpermProduction = Math.floor((testes.testosteroneProduction / 500) * 100); // Based on testosterone
    
    // Display section title
    this.changeTextColor(this.systemColor());
    this.drawText(getTranslatedText("Type", "Tipo"), 6, y, 200);
    this.resetTextColor();
    this.changeTextColor(this.textColor(3));
    this.drawText(getTranslatedText("(Testes)", "(Testicoli)"), 250, y, 400);
    this.resetTextColor();
    y += lineHeight * 2;
    
    // Sperm Production Section
    this.changeTextColor(this.systemColor());
    this.drawText(getTranslatedText("Sperm Production", "Produzione Spermatozoi"), 6, y, 200);
    this.resetTextColor();
    y += lineHeight;
    
    // Sperm Count
    this.drawText(getTranslatedText("Sperm Count: ", "Conta Spermatozoi: ") + testes.spermCount.toLocaleString() + " /mL", 20, y, 450);
    y += lineHeight;
    
    var countStatus = testes.spermCount >= 15000000 ? 
        getTranslatedText("Normal", "Normale") : 
        getTranslatedText("Low (Oligospermia)", "Basso (Oligospermia)");
    var countColor = testes.spermCount >= 15000000 ? this.textColor(3) : this.textColor(2);
    this.changeTextColor(countColor);
    this.drawText(getTranslatedText("Status: ", "Stato: ") + countStatus, 20, y, 450);
    this.resetTextColor();
    y += lineHeight * 2;
    
    // Sperm Motility
    this.drawText(getTranslatedText("Sperm Motility: ", "Motilità Spermatica: ") + testes.spermMotility.toFixed(1) + "%", 20, y, 450);
    y += lineHeight;
    
    var motilityStatus = testes.spermMotility >= 40 ? 
        getTranslatedText("Normal", "Normale") : 
        getTranslatedText("Low (Asthenospermia)", "Basso (Astenospermia)");
    var motilityColor = testes.spermMotility >= 40 ? this.textColor(3) : this.textColor(18);
    this.changeTextColor(motilityColor);
    this.drawText(getTranslatedText("Status: ", "Stato: ") + motilityStatus, 20, y, 450);
    this.resetTextColor();
    y += lineHeight * 2;
    
    // Sperm Morphology
    this.drawText(getTranslatedText("Normal Morphology: ", "Morfologia Normale: ") + testes.spermMorphology.toFixed(1) + "%", 20, y, 450);
    y += lineHeight;
    
    var morphologyStatus = testes.spermMorphology >= 4 ? 
        getTranslatedText("Normal", "Normale") : 
        getTranslatedText("Low (Teratospermia)", "Basso (Teratospermia)");
    var morphologyColor = testes.spermMorphology >= 4 ? this.textColor(3) : this.textColor(18);
    this.changeTextColor(morphologyColor);
    this.drawText(getTranslatedText("Status: ", "Stato: ") + morphologyStatus, 20, y, 450);
    this.resetTextColor();
    y += lineHeight * 2;
    
    // Daily Production
    this.changeTextColor(this.systemColor());
    this.drawText(getTranslatedText("Daily Sperm Production", "Produzione Giornaliera"), 6, y, 300);
    this.resetTextColor();
    y += lineHeight;
    
    this.drawText(testes.dailySpermProduction.toLocaleString() + getTranslatedText(" million sperm cells", " milioni di spermatozoi"), 20, y, 450);
    y += lineHeight * 2;
    
    // Fertility Rate
    this.changeTextColor(this.systemColor());
    this.drawText(getTranslatedText("Overall Fertility Rate", "Tasso di Fertilità Generale"), 6, y, 300);
    this.resetTextColor();
    y += lineHeight;
    
    var fertilityColor = testes.fertilityRate >= 70 ? this.textColor(3) : 
                         testes.fertilityRate >= 50 ? this.textColor(18) : this.textColor(2);
    this.changeTextColor(fertilityColor);
    this.drawText(testes.fertilityRate + "%", 20, y, 200);
    this.resetTextColor();
    y += lineHeight;
    
    var fertilityStatus = testes.fertilityRate >= 70 ? 
        getTranslatedText("High fertility", "Fertilità alta") :
        testes.fertilityRate >= 50 ? 
        getTranslatedText("Moderate fertility", "Fertilità moderata") :
        getTranslatedText("Low fertility", "Fertilità bassa");
    this.changeTextColor(this.textColor(6));
    this.drawText(fertilityStatus, 20, y, 450);
    this.resetTextColor();
    y += lineHeight * 2;
    
    // Testosterone Production
    this.changeTextColor(this.systemColor());
    this.drawText(getTranslatedText("Testosterone Production", "Produzione Testosterone"), 6, y, 300);
    this.resetTextColor();
    y += lineHeight;
    
    this.drawText(Math.floor(testes.testosteroneProduction) + " ng/dL", 20, y, 300);
    y += lineHeight;
    
    var testStatus = testes.testosteroneProduction >= 300 ? 
        getTranslatedText("Normal range", "Range normale") : 
        getTranslatedText("Below normal (Hypogonadism)", "Sotto il normale (Ipogonadismo)");
    var testColor = testes.testosteroneProduction >= 300 ? this.textColor(3) : this.textColor(2);
    this.changeTextColor(testColor);
    this.drawText(testStatus, 20, y, 450);
    this.resetTextColor();
};

  Window_BiologicSimulation.prototype.getInitialEstrogen = function (gender) {
    if (gender === 0) {
      // Male
      return 10 + Math.floor(Math.random() * 30); // 10-40 pg/mL
    } else if (gender === 1) {
      // Female
      return 30 + Math.floor(Math.random() * 370); // 30-400 pg/mL
    } else {
      // Non-binary
      return 50 + Math.floor(Math.random() * 200); // 50-250 pg/mL
    }
  };

  Window_BiologicSimulation.prototype.getInitialProgesterone = function (
    gender
  ) {
    if (gender === 0) {
      // Male
      return 0.1 + Math.random() * 0.4; // 0.1-0.5 ng/mL
    } else if (gender === 1) {
      // Female
      return 0.5 + Math.random() * 19.5; // 0.5-20 ng/mL
    } else {
      // Non-binary
      return 0.3 + Math.random() * 10; // 0.3-10.3 ng/mL
    }
  };

  Window_BiologicSimulation.prototype.determineBloodType = function (name) {
    // Use character name as seed for consistent blood type
    var hash = 0;
    for (var i = 0; i < name.length; i++) {
      hash = ((hash << 5) - hash + name.charCodeAt(i)) & 0xffffffff;
    }

    var bloodTypes = [
      { type: "O+", rarity: "Common", percent: 37.4 },
      { type: "A+", rarity: "Common", percent: 35.7 },
      { type: "B+", rarity: "Common", percent: 8.5 },
      { type: "AB+", rarity: "Uncommon", percent: 3.4 },
      { type: "O-", rarity: "Uncommon", percent: 6.6 },
      { type: "A-", rarity: "Uncommon", percent: 6.3 },
      { type: "B-", rarity: "Rare", percent: 1.5 },
      { type: "AB-", rarity: "Rare", percent: 0.6 },
      { type: "Rh-null", rarity: "Ultra Rare", percent: 0.0001 },
      { type: "Duffy-", rarity: "Very Rare", percent: 0.01 },
      { type: "Diego(b-)", rarity: "Very Rare", percent: 0.001 },
      { type: "Kidd(b-)", rarity: "Very Rare", percent: 0.001 },
    ];

    // Weighted random selection based on rarity
    var rand = Math.abs(hash) % 10000;
    var cumulative = 0;

    for (var i = 0; i < bloodTypes.length; i++) {
      cumulative += bloodTypes[i].percent * 100;
      if (rand < cumulative) {
        return bloodTypes[i];
      }
    }

    return bloodTypes[0]; // Default to O+ if something goes wrong
  };

  Window_BiologicSimulation.prototype.checkForInfections = function () {
    var infections = [];

    // Check damaged body parts for potential infections
    if (this._actor._bodyParts) {
      for (var partKey in this._actor._bodyParts) {
        var part = this._actor._bodyParts[partKey];
        if (part.damaged) {
          // 30% chance of infection in damaged parts
          if (Math.random() < 0.3) {
            infections.push({
              location: part.name,
              type: Math.random() < 0.7 ? "Bacterial" : "Viral",
              severity: Math.floor(Math.random() * 3) + 1, // 1-3
            });
          }
        }
      }
    }

    return infections;
  };

  Window_BiologicSimulation.prototype.updateLeyVeinsFromDamage = function () {
    if (!this._actor._bodyParts || !this._actor._biologicData) return;

    var leyVeins = this._actor._biologicData.leyVeins;
    var mpRatio = this._actor.mmp > 0 ? this._actor.mp / this._actor.mmp : 0;
    var overallFlow = Math.floor(mpRatio * 100);
    leyVeins.flow = overallFlow;

    // Rebuild meridians from actual body parts, distributing mana flow per part.
    // Broken parts (damaged=true) receive 0 flow; their share is redistributed
    // to healthy parts. This is purely cosmetic — actual MP is unchanged.
    var bodyParts = this._actor._bodyParts;
    var newMeridians = {};

    var numParts = Object.keys(bodyParts).length;
    var healthyCount = 0;
    for (var k in bodyParts) {
      if (!bodyParts[k].damaged) healthyCount++;
    }

    // Per-part base flow if all parts were healthy (equal share of total)
    var basePerPart = numParts > 0 ? overallFlow : 0;
    // Redistributed flow for each healthy part (broken parts' shares funnelled here)
    var healthyFlow = healthyCount > 0
      ? Math.min(150, Math.round(overallFlow * numParts / healthyCount))
      : 0;

    for (var partKey in bodyParts) {
      var part = bodyParts[partKey];
      var flow, status;

      if (part.damaged) {
        flow = 0;
        status = "Blocked";
      } else {
        flow = healthyFlow;
        status = "Normal";
      }

      // Preserve magicalActivity from previous tick if it exists
      var prev = leyVeins.meridians[partKey];
      var magicalActivity = prev
        ? prev.magicalActivity
        : 85 + Math.floor(Math.random() * 30);

      newMeridians[partKey] = {
        name: part.name,
        status: status,
        flow: flow,
        // blockage kept for reference: % of parts that are broken
        blockage: numParts > 0 ? Math.round((numParts - healthyCount) / numParts * 100) : 0,
        magicalActivity: magicalActivity,
      };
    }

    leyVeins.meridians = newMeridians;
  };

  Window_BiologicSimulation.prototype.updateGenderFromHormones = function () {
    if (!this._actor._biologicData) return;

    var hormones = this._actor._biologicData.hormones;
    var testosterone = hormones.testosterone;
    var estrogen = hormones.estrogen;

    // Normalize hormone levels to comparable scales
    var testosteroneNorm = testosterone / 1000; // Max ~1000 ng/dL
    var estrogenNorm = estrogen / 400; // Max ~400 pg/mL

    var difference = Math.abs(testosteroneNorm - estrogenNorm);
    var average = (testosteroneNorm + estrogenNorm) / 2;
    var tolerance = average * 0.1; // 10% tolerance

    var currentGender = $gameVariables.value(38);
    var newGender = currentGender;

    if (difference <= tolerance) {
      // Balanced hormones = non-binary
      newGender = 2;
    } else if (testosteroneNorm > estrogenNorm) {
      // Higher testosterone = male
      newGender = 0;
    } else {
      // Higher estrogen = female
      newGender = 1;
    }

    if (newGender !== currentGender) {
      $gameVariables.setValue(38, newGender);
      var genderNames = ["male", "female", "non-binary"];
      var genderNames_it = ["maschio", "femmina", "non-binario"];
      var genderName =
        ConfigManager.language === "it"
          ? genderNames_it[newGender]
          : genderNames[newGender];

      var message =
        ConfigManager.language === "it"
          ? "I tuoi ormoni hanno causato un cambio di genere in " +
            genderName +
            "!"
          : "Your hormones have caused a gender change to " + genderName + "!";
      $gameMessage.add(message);
    }
  };

  Window_BiologicSimulation.prototype.maxItems = function () {
    return this._categories.length;
  };

  Window_BiologicSimulation.prototype.drawAugments = function (startY) {
    var actor = this._actor;
    var lineHeight = this.lineHeight();
    var contentWidth = this.contents.width - 12;
    var contentHeight = this.contents.height - startY - lineHeight * 2;
    var visibleAreaTop = startY;
    var visibleAreaBottom = startY + contentHeight;
    var useTranslation = ConfigManager.language === "it";

    var { ProstheticTypes } = window.ProstheticsData || {};

    // Build list: body part augments (archetype parts with skillId or statEffect)
    // plus prosthetic implants
    var entries = [];

    // --- Installed prosthetic implants ---
    if (actor._prosthetics && ProstheticTypes) {
      for (var partKey in actor._prosthetics) {
        var prostheticKey = actor._prosthetics[partKey];
        var prosthetic = ProstheticTypes[prostheticKey];
        var partData = actor._bodyParts && actor._bodyParts[partKey];
        var partName = partData ? partData.name : partKey;
        var prostheticName = prosthetic
          ? (useTranslation && prosthetic.name_it ? prosthetic.name_it : prosthetic.name_en || prostheticKey)
          : prostheticKey;

        var effectLines = [];
        if (prosthetic && prosthetic.effects) {
          for (var paramId in prosthetic.effects) {
            effectLines.push(getParamNameLocal(parseInt(paramId)) + " +" + prosthetic.effects[paramId]);
          }
        }
        entries.push({ type: "implant", partName: partName, augName: prostheticName, effects: effectLines });
      }
    }


    if (entries.length === 0) {
      this.drawText(useTranslation ? "Nessun aumento installato." : "No augments installed.", 6, startY, contentWidth);
      this._maxAugmentsScroll = 0;
      return;
    }

    // Calculate total height: each entry takes 1 header line + effect lines
    var totalH = 0;
    for (var ei = 0; ei < entries.length; ei++) {
      totalH += lineHeight + entries[ei].effects.length * lineHeight + 4;
    }
    this._maxAugmentsScroll = Math.max(0, totalH - contentHeight);

    var y = startY - this._augmentsScrollY;

    for (var i = 0; i < entries.length; i++) {
      var entry = entries[i];
      var entryH = lineHeight + entry.effects.length * lineHeight + 4;

      if (y + entryH < visibleAreaTop) { y += entryH; continue; }
      if (y > visibleAreaBottom) break;

      // Header line: part name [→ augment name if implant]
      this.changeTextColor(this.systemColor ? this.systemColor() : ColorManager.systemColor());
      var headerText = entry.partName;
      if (entry.augName) headerText += "  →  " + entry.augName;
      this.drawText(headerText, 6, y, contentWidth);
      y += lineHeight;

      // Effect lines
      this.resetTextColor();
      for (var j = 0; j < entry.effects.length; j++) {
        if (y >= visibleAreaTop && y <= visibleAreaBottom) {
          this.changeTextColor(this.textColor(3));
          this.drawText(entry.effects[j], 24, y, contentWidth - 24);
          this.resetTextColor();
        }
        y += lineHeight;
      }

      // Divider
      if (y >= visibleAreaTop && y <= visibleAreaBottom) {
        this.contents.paintOpacity = 48;
        this.contents.fillRect(6, y, contentWidth - 6, 1, ColorManager.normalColor());
        this.contents.paintOpacity = 255;
      }
      y += 4;
    }

    // Scroll indicator
    if (this._maxAugmentsScroll > 0) {
      var scrollPercent = this._augmentsScrollY / this._maxAugmentsScroll;
      var indicatorY = visibleAreaTop + contentHeight * scrollPercent;
      var indicatorHeight = Math.max(10, contentHeight * (contentHeight / (contentHeight + this._maxAugmentsScroll)));
      this.contents.fillRect(this.contents.width - 8, indicatorY, 4, indicatorHeight, this.textColor(7));
    }

    this.resetTextColor();
  };

  function getParamNameLocal(paramId) {
    var en = ["Max HP","Max MP","STR","Hit Rate","INT","COS","DEX","PSI"];
    var it = ["PV Max","PM Max","FOR","Precisione","INT","COS","DES","PSI"];
    return (ConfigManager.language === "it" ? it : en)[paramId] || "Stat";
  }

  Window_BiologicSimulation.prototype.drawBodyPartsGrid = function (startY) {
    var actor = this._actor;
    if (!actor) return;
    var useTranslation = ConfigManager.language === "it";
    var lineHeight = this.lineHeight();
    var contentWidth = this.contents.width - 12;
    var contentHeight = this.contents.height - startY - lineHeight * 2;

    if (!actor._bodyParts) {
      if (typeof window.initializeBodyParts === 'function') {
        window.initializeBodyParts(actor);
      } else {
        this.drawText(useTranslation ? "Nessun dato" : "No data", 6, startY, contentWidth);
        return;
      }
    }

    var bodyPartsArray = [];
    for (var partKey in actor._bodyParts) {
      if (actor._bodyParts[partKey]) bodyPartsArray.push(actor._bodyParts[partKey]);
    }

    if (bodyPartsArray.length === 0) {
      this.drawText(useTranslation ? "Nessun dato" : "No data", 6, startY, contentWidth);
      return;
    }

    var cols = 3;
    var gap = 6;
    var cellW = Math.floor((contentWidth - gap * (cols - 1)) / cols);
    var gaugeH = 5;
    var cellH = lineHeight + gaugeH + 6;
    var startX = 6;
    var visibleAreaTop = startY;
    var visibleAreaBottom = startY + contentHeight;

    // Calculate total content height for scrolling
    var totalRows = Math.ceil(bodyPartsArray.length / cols);
    var totalContentH = totalRows * (cellH + gap);
    this._maxPartsScroll = Math.max(0, totalContentH - contentHeight);

    for (var i = 0; i < bodyPartsArray.length; i++) {
      var part = bodyPartsArray[i];
      var col = i % cols;
      var row = Math.floor(i / cols);
      var cx = startX + col * (cellW + gap);
      var cy = startY + row * (cellH + gap) - this._partsScrollY;

      if (cy + cellH < visibleAreaTop) continue;
      if (cy > visibleAreaBottom) break;

      var rate = (part.maxHp > 0 && !part.damaged) ? part.currentHp / part.maxHp : 0;
      var barY = cy + cellH - gaugeH - 1;

      // Cell background
      this.contents.fillRect(cx, cy, cellW, cellH, ColorManager.gaugeBackColor());

      // HP bar
      var fillW = Math.floor(cellW * rate);
      if (fillW > 0) {
        this.contents.gradientFillRect(cx, barY, fillW, gaugeH, ColorManager.hpGaugeColor1(), ColorManager.hpGaugeColor2());
      }

      // Cell border
      this.contents.strokeRect(cx, cy, cellW, cellH, ColorManager.outlineColor());

      // Part name
      this.contents.fontSize = 13;
      if (part.damaged) {
        this.changeTextColor(ColorManager.deathColor());
        this.drawText(part.name, cx + 3, cy + 1, cellW - 6);
        var tw = this.textWidth(part.name);
        var strikeY = cy + 1 + Math.floor(lineHeight / 2);
        this.contents.fillRect(cx + 3, strikeY, Math.min(tw, cellW - 6), 2, ColorManager.deathColor());
      } else {
        this.resetTextColor();
        this.drawText(part.name, cx + 3, cy + 1, cellW - 6);
      }
    }

    // Draw scroll indicator if needed
    if (this._maxPartsScroll > 0) {
      var scrollPercent = this._partsScrollY / this._maxPartsScroll;
      var indicatorY = visibleAreaTop + contentHeight * scrollPercent;
      var indicatorHeight = Math.max(
        10,
        contentHeight * (contentHeight / (contentHeight + this._maxPartsScroll))
      );
      this.contents.fillRect(
        this.contents.width - 8,
        indicatorY,
        4,
        indicatorHeight,
        this.textColor(7)
      );
    }

    this.resetFontSettings();
  };

  Window_BiologicSimulation.prototype.refresh = function () {
    this.contents.clear();

    if (!this._actor) return;

    this.initializeBiologicData();
    this.updateLeyVeinsFromDamage();
    this.updateGenderFromHormones();

    var lineHeight = this.lineHeight();

    // Draw actor name and current category
    if (Utils.RPGMAKER_NAME === "MZ") {
      this.drawActorName(this._actor, 6, 0, 200);
    } else {
      this.drawActorName(this._actor, 6, 0);
    }

    var categoryName =
      ConfigManager.language === "it"
        ? this._categories[this._category].name_it
        : this._categories[this._category].name;
    this.drawText("Category: " + categoryName, 220, 0, 300);

    // Get hunger and sleep status for future use
    var hungerRate = $gameVariables.value(54) || 50;
    var sleepRate = $gameVariables.value(55) || 50;

    // Draw blood type
    var bloodType = this._actor._biologicData.bloodType;
    var bloodText =
      "Blood Type: " + bloodType.type + " (" + bloodType.rarity + ")";
    this.drawText(bloodText, 6, lineHeight, 400);

    // --- DRAW PERSONALITY ---
    var personality = this._actor._biologicData.personality;
    var pName =
      ConfigManager.language === "it"
        ? personality.name_it
        : personality.name;
    var personalityText = "Personality: " + pName;
    this.changeTextColor(this.textColor(3)); // Yellow
    this.drawText(personalityText, 410, lineHeight, 300);
    this.resetTextColor();
    // --- END ---

    this.drawHorzLine(lineHeight * 2);

    // Draw category-specific data
    var startY = lineHeight * 3;

    switch (this._category) {
      case 0:
        this.drawBodyPartsGrid(startY);
        break;
      case 1:
        this.drawVitalSigns(startY);
        break;
      case 2:
        this.drawHormones(startY);
        break;
      case 3:
        this.drawImmuneSystem(startY);
        break;
      case 4:
        this.drawLeyVeins(startY);
        break;
      case 5:
        this.drawBrainActivity(startY);
        break;
      case 6:
        this.drawUterus(startY);
        break;
      case 7:
        this.drawAugments(startY);
        break;
    }
    var instructionText = "";
    // Instructions at the bottom
    var bottomY = this.contents.height - lineHeight * 2;
    if (this._category === 5) {
      // Brain Activity tab
      instructionText = getTranslatedText(
        "←→: Change Category",
        "←→: Cambia Categoria"
      );
    } else if (this._category === 1) {
      // Vital Signs tab
      instructionText = getTranslatedText(
        "←→: Change Category",
        "←→: Cambia Categoria"
      );
    } else {
      instructionText = getTranslatedText(
        "←→: Change Category",
        "←→: Cambia Categoria"
      );
    }

    this.drawText(instructionText, 6, bottomY, this.contents.width - 12);
  };
  Window_BiologicSimulation.prototype.drawVitalSigns = function (startY) {
    var data = this._actor._biologicData.vitalSigns;
    var cellular = this._actor._biologicData.cellularActivity;
    var y = startY - this._vitalScrollY; // Apply scroll offset
    var lineHeight = this.lineHeight();
    var contentHeight = this.contents.height - startY - lineHeight * 2; // Reserve space for instructions
    var visibleAreaTop = startY;
    var visibleAreaBottom = visibleAreaTop + contentHeight;

    // Calculate total content height for scrolling
    var tempY = startY;

    // Basic vital signs (5 lines)
    tempY += lineHeight * 7; // 5 + 2 spacing

    // Cellular Activity section (7 lines if exists)
    if (cellular) {
      tempY += lineHeight * 8; // Title + 5 data lines + 2 spacing
    }

    // Nutrients section (7 lines)
    tempY += lineHeight * 8; // Title + 5 nutrients + 2 spacing

    // Additional detailed vital signs
    tempY += lineHeight * 15; // Extended vital signs data

    this._maxVitalScroll = Math.max(0, tempY - visibleAreaBottom);

    // Helper function to check if line is visible
    var isLineVisible = function (lineY) {
      return (
        lineY >= visibleAreaTop - lineHeight &&
        lineY <= visibleAreaBottom + lineHeight
      );
    };

    // Basic Vital Signs
    if (isLineVisible(y)) {
      this.changeTextColor(this.systemColor());
      this.drawText("Basic Vital Signs:", 6, y, 200);
      this.resetTextColor();
    }
    y += lineHeight;

    if (isLineVisible(y)) {
      this.drawText(
        "Heart Rate: " + Math.floor(data.heartRate) + " BPM",
        20,
        y,
        300
      );
      var hrStatus =
        data.heartRate < 60
          ? "Bradycardia"
          : data.heartRate > 100
          ? "Tachycardia"
          : "Normal";
      var hrColor =
        data.heartRate < 60 || data.heartRate > 100
          ? this.textColor(18)
          : this.textColor(3);
      this.changeTextColor(hrColor);
      this.drawText("(" + hrStatus + ")", 450, y, 150);
      this.resetTextColor();
    }
    y += lineHeight;

    if (isLineVisible(y)) {
      this.drawText(
        "Blood Pressure: " +
          Math.floor(data.bloodPressure.systolic) +
          "/" +
          Math.floor(data.bloodPressure.diastolic),
        20,
        y,
        300
      );
      var bpStatus =
        data.bloodPressure.systolic > 140
          ? "Hypertension"
          : data.bloodPressure.systolic < 90
          ? "Hypotension"
          : "Normal";
      var bpColor =
        bpStatus !== "Normal" ? this.textColor(18) : this.textColor(3);
      this.changeTextColor(bpColor);
      this.drawText("(" + bpStatus + ")", 450, y, 150);
      this.resetTextColor();
    }
    y += lineHeight;

    if (isLineVisible(y)) {
      this.drawText(
        "Body Temperature: " + data.bodyTemperature.toFixed(1) + "°C",
        20,
        y,
        300
      );
      var tempStatus =
        data.bodyTemperature > 37.5
          ? "Fever"
          : data.bodyTemperature < 36.0
          ? "Hypothermia"
          : "Normal";
      var tempColor =
        tempStatus !== "Normal" ? this.textColor(18) : this.textColor(3);
      this.changeTextColor(tempColor);
      this.drawText("(" + tempStatus + ")", 450, y, 150);
      this.resetTextColor();
    }
    y += lineHeight;

    if (isLineVisible(y)) {
      this.drawText(
        "Oxygen Saturation: " + Math.floor(data.oxygenSaturation) + "%",
        20,
        y,
        300
      );
      var o2Status = data.oxygenSaturation < 95 ? "Low" : "Normal";
      var o2Color =
        o2Status !== "Normal" ? this.textColor(18) : this.textColor(3);
      this.changeTextColor(o2Color);
      this.drawText("(" + o2Status + ")", 450, y, 150);
      this.resetTextColor();
    }
    y += lineHeight;

    if (isLineVisible(y)) {
      this.drawText(
        "Cortisol: " + Math.floor(data.cortisol) + " μg/dL",
        20,
        y,
        300
      );
      var cortisolStatus =
        data.cortisol > 25
          ? "High Stress"
          : data.cortisol < 10
          ? "Low"
          : "Normal";
      var cortisolColor =
        cortisolStatus === "High Stress"
          ? this.textColor(2)
          : cortisolStatus === "Low"
          ? this.textColor(18)
          : this.textColor(3);
      this.changeTextColor(cortisolColor);
      this.drawText("(" + cortisolStatus + ")", 450, y, 150);
      this.resetTextColor();
    }
    y += lineHeight * 2;

    // Additional Vital Parameters
    if (isLineVisible(y)) {
      this.changeTextColor(this.systemColor());
      this.drawText("Extended Vital Parameters:", 6, y, 200);
      this.resetTextColor();
    }
    y += lineHeight;

    // Calculate respiratory rate based on heart rate
    var respiratoryRate =
      Math.floor(data.heartRate / 4) + Math.floor(Math.random() * 4);
    if (isLineVisible(y)) {
      this.drawText(
        "Respiratory Rate: " + respiratoryRate + " brt/min",
        20,
        y,
        300
      );
      var respStatus =
        respiratoryRate > 20 ? "High" : respiratoryRate < 12 ? "Low" : "Normal";
      var respColor =
        respStatus !== "Normal" ? this.textColor(18) : this.textColor(3);
      this.changeTextColor(respColor);
      this.drawText("(" + respStatus + ")", 450, y, 150);
      this.resetTextColor();
    }
    y += lineHeight;

    // Blood pH estimation
    var bloodPH = 7.4 + (Math.random() - 0.5) * 0.1;
    if (isLineVisible(y)) {
      this.drawText("Blood pH: " + bloodPH.toFixed(2), 20, y, 300);
      var pHStatus =
        bloodPH < 7.35 ? "Acidic" : bloodPH > 7.45 ? "Alkaline" : "Normal";
      var pHColor =
        pHStatus !== "Normal" ? this.textColor(18) : this.textColor(3);
      this.changeTextColor(pHColor);
      this.drawText("(" + pHStatus + ")", 450, y, 150);
      this.resetTextColor();
    }
    y += lineHeight;

    // Blood glucose estimation based on nutrients
    var bloodGlucose =
      90 +
      Math.floor((data.nutrients.carbs / 300) * 50) +
      Math.floor(Math.random() * 20);
    if (isLineVisible(y)) {
      this.drawText("Blood Glucose: " + bloodGlucose + " mg/dL", 20, y, 300);
      var glucoseStatus =
        bloodGlucose > 140 ? "High" : bloodGlucose < 70 ? "Low" : "Normal";
      var glucoseColor =
        glucoseStatus !== "Normal" ? this.textColor(18) : this.textColor(3);
      this.changeTextColor(glucoseColor);
      this.drawText("(" + glucoseStatus + ")", 450, y, 150);
      this.resetTextColor();
    }
    y += lineHeight;

    // Hydration status
    var hydrationPercent = Math.floor((data.nutrients.water / 2500) * 100);
    if (isLineVisible(y)) {
      this.drawText("Hydration Level: " + hydrationPercent + "%", 20, y, 300);
      var hydrationStatus =
        hydrationPercent < 70
          ? "Dehydrated"
          : hydrationPercent > 100
          ? "Overhydrated"
          : "Normal";
      var hydrationColor =
        hydrationStatus !== "Normal" ? this.textColor(18) : this.textColor(3);
      this.changeTextColor(hydrationColor);
      this.drawText("(" + hydrationStatus + ")", 450, y, 150);
      this.resetTextColor();
    }
    y += lineHeight * 2;

    // Cellular Activity
    if (cellular) {
      if (isLineVisible(y)) {
        this.changeTextColor(this.systemColor());
        this.drawText("Cellular Activity:", 6, y, 200);
        this.resetTextColor();
      }
      y += lineHeight;

      if (isLineVisible(y)) {
        this.drawText(
          "Cells Forming: " + cellular.cellsForming.toLocaleString() + "/sec",
          20,
          y,
          300
        );
        var formationRate =
          cellular.cellsForming > 120000
            ? "High"
            : cellular.cellsForming < 80000
            ? "Low"
            : "Normal";
        var formationColor =
          formationRate === "Low"
            ? this.textColor(18)
            : formationRate === "High"
            ? this.textColor(3)
            : this.normalColor();
        this.changeTextColor(formationColor);
        this.drawText("(" + formationRate + ")", 450, y, 150);
        this.resetTextColor();
      }
      y += lineHeight;

      if (isLineVisible(y)) {
        this.drawText(
          "Cells Dying: " + cellular.cellsDying.toLocaleString() + "/sec",
          20,
          y,
          300
        );
        var deathRate =
          cellular.cellsDying > 100000
            ? "High"
            : cellular.cellsDying < 60000
            ? "Low"
            : "Normal";
        var deathColor =
          deathRate === "High"
            ? this.textColor(2)
            : deathRate === "Low"
            ? this.textColor(3)
            : this.normalColor();
        this.changeTextColor(deathColor);
        this.drawText("(" + deathRate + ")", 450, y, 150);
        this.resetTextColor();
      }
      y += lineHeight;

      if (isLineVisible(y)) {
        this.drawText(
          "Net Cell Change: " +
            (cellular.cellsForming - cellular.cellsDying).toLocaleString() +
            "/sec",
          20,
          y,
          400
        );
      }
      y += lineHeight;

      if (isLineVisible(y)) {
        this.drawText(
          "Mitosis Rate: " + cellular.mitosisRate.toFixed(3) + "%",
          20,
          y,
          300
        );
      }
      y += lineHeight;

      if (isLineVisible(y)) {
        this.drawText(
          "Apoptosis Rate: " + cellular.apoptosisRate.toFixed(3) + "%",
          20,
          y,
          300
        );
      }
      y += lineHeight;

      if (isLineVisible(y)) {
        this.drawText(
          "Total Cells: " + cellular.totalCells.toExponential(2),
          20,
          y,
          300
        );
      }
      y += lineHeight * 2;
    }

    // Nutrients
    if (isLineVisible(y)) {
      this.changeTextColor(this.systemColor());
      this.drawText("Nutritional Status:", 6, y, 200);
      this.resetTextColor();
    }
    y += lineHeight;

    if (isLineVisible(y)) {
      this.drawText(
        "Calories: " + Math.floor(data.nutrients.calories) + " kcal",
        20,
        y,
        250
      );
      var calStatus =
        data.nutrients.calories < 1500
          ? "Deficit"
          : data.nutrients.calories > 2500
          ? "Surplus"
          : "Normal";
      var calColor =
        calStatus === "Deficit"
          ? this.textColor(2)
          : calStatus === "Surplus"
          ? this.textColor(18)
          : this.textColor(3);
      this.changeTextColor(calColor);
      this.drawText("(" + calStatus + ")", 270, y, 150);
      this.resetTextColor();
    }
    y += lineHeight;

    if (isLineVisible(y)) {
      this.drawText(
        "Protein: " + Math.floor(data.nutrients.protein) + "g",
        20,
        y,
        250
      );
      var proteinStatus =
        data.nutrients.protein < 40
          ? "Low"
          : data.nutrients.protein > 100
          ? "High"
          : "Normal";
      var proteinColor =
        proteinStatus !== "Normal" ? this.textColor(18) : this.textColor(3);
      this.changeTextColor(proteinColor);
      this.drawText("(" + proteinStatus + ")", 270, y, 150);
      this.resetTextColor();
    }
    y += lineHeight;

    if (isLineVisible(y)) {
      this.drawText(
        "Carbohydrates: " + Math.floor(data.nutrients.carbs) + "g",
        20,
        y,
        250
      );
      var carbStatus =
        data.nutrients.carbs < 150
          ? "Low"
          : data.nutrients.carbs > 350
          ? "High"
          : "Normal";
      var carbColor =
        carbStatus !== "Normal" ? this.textColor(18) : this.textColor(3);
      this.changeTextColor(carbColor);
      this.drawText("(" + carbStatus + ")", 270, y, 150);
      this.resetTextColor();
    }
    y += lineHeight;

    if (isLineVisible(y)) {
      this.drawText(
        "Fats: " + Math.floor(data.nutrients.fats) + "g",
        20,
        y,
        250
      );
      var fatStatus =
        data.nutrients.fats < 40
          ? "Low"
          : data.nutrients.fats > 120
          ? "High"
          : "Normal";
      var fatColor =
        fatStatus !== "Normal" ? this.textColor(18) : this.textColor(3);
      this.changeTextColor(fatColor);
      this.drawText("(" + fatStatus + ")", 270, y, 150);
      this.resetTextColor();
    }
    y += lineHeight;

    if (isLineVisible(y)) {
      this.drawText(
        "Water: " + Math.floor(data.nutrients.water) + "ml",
        20,
        y,
        250
      );
      var waterStatus =
        data.nutrients.water < 1800
          ? "Low"
          : data.nutrients.water > 3000
          ? "High"
          : "Normal";
      var waterColor =
        waterStatus !== "Normal" ? this.textColor(18) : this.textColor(3);
      this.changeTextColor(waterColor);
      this.drawText("(" + waterStatus + ")", 270, y, 150);
      this.resetTextColor();
    }
    y += lineHeight;

    // Draw scroll indicator if needed
    if (this._maxVitalScroll > 0) {
      var scrollPercent = this._vitalScrollY / this._maxVitalScroll;
      var indicatorY = visibleAreaTop + contentHeight * scrollPercent;
      var indicatorHeight = Math.max(
        10,
        contentHeight * (contentHeight / (contentHeight + this._maxVitalScroll))
      );

      this.contents.fillRect(
        this.contents.width - 8,
        indicatorY,
        4,
        indicatorHeight,
        this.textColor(7)
      );
    }
  };

  // Calculate current mood based on brain activity (Jungian psychology)
  Window_BiologicSimulation.prototype.calculateCurrentMood = function (brain) {
    if (!brain || !brain.regions) return "Neutral";

    var amygdala = brain.regions.amygdala ? brain.regions.amygdala.activity : 50;
    var prefrontal = brain.regions.prefrontalCortex ? brain.regions.prefrontalCortex.activity : 50;
    var hippocampus = brain.regions.hippocampus ? brain.regions.hippocampus.activity : 50;

    var dominantEmotion = amygdala;
    var rationalControl = prefrontal;
    var memory = hippocampus;

    // Determine mood based on brain region dominance
    if (amygdala > 80 && prefrontal < 30) {
      return "Enraged";
    } else if (amygdala > 70 && prefrontal < 50) {
      return "Angry";
    } else if (amygdala < 30 && prefrontal > 80) {
      return "Serene";
    } else if (amygdala > 60 && prefrontal > 70) {
      return "Passionate";
    } else if (amygdala < 40 && prefrontal > 60) {
      return "Contemplative";
    } else if (amygdala > 40 && prefrontal < 40) {
      return "Anxious";
    } else if (memory > 80) {
      return "Nostalgic";
    } else if (amygdala < 50 && prefrontal > 50) {
      return "Calm";
    } else {
      return "Neutral";
    }
  };

  // Get or update current thought (lasts 1-10 seconds)
  Window_BiologicSimulation.prototype.getOrUpdateCurrentThought = function () {
    var currentTime = Date.now();

    // Check if thought duration has expired or thought not initialized
    if (
      !this._currentThought ||
      currentTime - this._thoughtStartTime >= this._thoughtDuration
    ) {
      this._currentThought = this.generateRandomThought();
      this._thoughtStartTime = currentTime;
      this._thoughtDuration = (1 + Math.random() * 9) * 1000; // 1-10 seconds in milliseconds
    }

    return this._currentThought;
  };

  // Generate thought based on biological and brain state
// Generate thought based on biological and brain state
Window_BiologicSimulation.prototype.generateRandomThought = function () {
  var useItalian = ConfigManager.language === "it";
  var actor = this._actor;
  if (!actor || !actor._biologicData) {
    return useItalian ? "Voto vuoto" : "Empty void";
  }

  var bio = actor._biologicData;
  var personality = bio.personality;

  // --- PERSONALITY THOUGHT INJECTION ---
  // 25% chance to pull a thought from the personality list
  if (
    personality &&
    personality.thoughts &&
    Math.random() < 0.25 // 25% chance
  ) {
    var lang = useItalian ? "it" : "en";
    var thoughts = personality.thoughts[lang] || personality.thoughts["en"];
    if (thoughts && thoughts.length > 0) {
      return thoughts[Math.floor(Math.random() * thoughts.length)];
    }
  }
  // --- END INJECTION ---

  var hp = actor.hp;
  var maxHp = actor.mhp;
  var mp = actor.mp;
  var maxMp = actor.mmp;
  var hunger = $gameVariables.value(54) || 50; // 0-100
  var sleep = $gameVariables.value(55) || 50; // 0-100
  var tp = actor.tp || 0;
  var maxTp = actor.maxTp() || 100;
  var apPercent = (tp / maxTp) * 100;

  var hpPercent = (hp / maxHp) * 100;
  var mpPercent = (mp / maxMp) * 100;

  var heartRate = bio.vitalSigns.heartRate || 60;
  var temperature = bio.vitalSigns.bodyTemperature || 37;
  var cortisol = bio.vitalSigns.cortisol || 15;
  var adrenaline = bio.hormones.adrenaline || 20;

  // Determine primary biological state
  var primaryState = this.determinePrimaryBiologicalState(
    hpPercent,
    mpPercent,
    hunger,
    sleep,
    apPercent,
    heartRate,
    temperature,
    cortisol,
    adrenaline
  );

  // Generate thoughts based on the primary state
  return this.generateThoughtFromState(primaryState, useItalian, actor, bio);
};

  // Determine the primary biological/mental state
  Window_BiologicSimulation.prototype.determinePrimaryBiologicalState = function (
    hpPercent,
    mpPercent,
    hunger,
    sleep,
    apPercent,
    heartRate,
    temperature,
    cortisol,
    adrenaline
  ) {
    // Critical states take priority
    if (hpPercent <= 10) return "dying";
    if (hpPercent <= 25) return "wounded";
    if (hunger <= 10) return "starving";
    if (sleep <= 10) return "exhausted";
    if (temperature >= 40) return "fevering";
    if (temperature <= 35) return "freezing";

    // High energy/stress states
    if (apPercent >= 90 && cortisol >= 70) return "berserking";
    if (apPercent >= 75 && adrenaline >= 60) return "energized";
    if (cortisol >= 80) return "panicked";
    if (adrenaline >= 75) return "adrenaline_rush";

    // Depletion states
    if (hunger <= 30) return "hungry";
    if (sleep <= 30) return "drowsy";
    if (apPercent <= 20) return "exhausted_ap";
    if (mpPercent <= 20) return "mana_depleted";

    // Positive states
    if (hpPercent >= 90 && sleep >= 80 && hunger >= 70) return "excellent";
    if (hpPercent >= 75 && apPercent >= 60) return "confident";
    if (sleep >= 70 && hunger >= 60) return "well_rested";

    // Default balanced state
    return "neutral";
  };

  // Generate thoughts based on determined state
  Window_BiologicSimulation.prototype.generateThoughtFromState = function (
    state,
    useItalian,
    actor,
    bio
  ) {
    var thoughts = [];

    switch (state) {
      case "dying":
        thoughts = useItalian
          ? [
              "Sente la morte che si avvicina...",
              "Vede la luce del tunnel",
              "Il dolore scompare in un freddo dolce",
              "L'ultimo respiro... è vicino",
              "Percepisce il confine tra essere e non-essere",
              "Ricorda tutte le vite che potevano essere",
              "Il mondo si dissolve lentamente",
            ]
          : [
              "Feels death approaching...",
              "Sees the light at the tunnel's end",
              "Pain fades into sweet cold",
              "The final breath... is near",
              "Perceives the boundary between being and non-being",
              "Remembers all the lives that could have been",
              "The world dissolves slowly",
            ];
        break;

      case "wounded":
        thoughts = useItalian
          ? [
              "Ogni cellula grida di dolore",
              "Vuole che il dolore finisca",
              "Pensa alla guarigione con disperazione",
              "Il corpo si lamenta dei danni",
              "Sente le ferite bruciare",
              "Immagina pozioni che guariscono",
              "La sofferenza oscura il pensiero",
            ]
          : [
              "Every cell screams in pain",
              "Wants the pain to end",
              "Desperately thinks of healing",
              "The body protests its injuries",
              "Feels wounds burning",
              "Imagines healing potions",
              "Suffering clouds all thought",
            ];
        break;

      case "starving":
        thoughts = useItalian
          ? [
              "La fame domina ogni pensiero",
              "Desidera cibo disperatamente",
              "Lo stomaco grida di fame",
              "Immagina i sapori di qualsiasi cosa",
              "La mente si offusca dalla malnutrizione",
              "Ogni risorsa del corpo è consumata",
              "Ricorda il sapore del cibo",
            ]
          : [
              "Hunger dominates every thought",
              "Desperately desires food",
              "The stomach cries out",
              "Imagines the taste of anything",
              "Mind clouds with malnutrition",
              "Every body resource is depleted",
              "Remembers the taste of food",
            ];
        break;

      case "exhausted":
        thoughts = useItalian
          ? [
              "La fatica appesantisce ogni muscolo",
              "Gli occhi si chiudono da soli",
              "Sogna di sonno profondo",
              "Il cervello funziona al minimo",
              "Ogni movimento è una lotta",
              "Vuole solo dormire",
              "Il corpo non risponde più",
            ]
          : [
              "Fatigue weighs every muscle",
              "Eyes close on their own",
              "Dreams of deep sleep",
              "Brain operates at minimum",
              "Every movement is a struggle",
              "Just wants to sleep",
              "Body no longer responds",
            ];
        break;

      case "fevering":
        thoughts = useItalian
          ? [
              "Il fuoco brucia all'interno",
              "La febbre distorce la realtà",
              "Vede immagini caotiche",
              "Il corpo è una fornace",
              "Pensa in modo confuso e delirante",
              "Sente l'infezione che consuma",
              "Sudore e brividi simultanei",
            ]
          : [
              "Fire burns from within",
              "Fever distorts reality",
              "Sees chaotic images",
              "Body is a furnace",
              "Thinks deliriously and confused",
              "Feels infection consuming",
              "Sweat and chills simultaneously",
            ];
        break;

      case "freezing":
        thoughts = useItalian
          ? [
              "Il freddo congela i pensieri",
              "I muscoli non obbediscono",
              "Ricorda il calore come una reliquia",
              "La mente diventa lenta e pesante",
              "Ogni movimento è agonia",
              "Desidera disperatamente il fuoco",
              "La morte bianca si avvicina",
            ]
          : [
              "Cold freezes thoughts",
              "Muscles won't obey",
              "Remembers warmth as ancient memory",
              "Mind becomes slow and heavy",
              "Every movement is agony",
              "Desperately desires fire",
              "White death approaches",
            ];
        break;

      case "berserking":
        thoughts = useItalian
          ? [
              "La furia prende il controllo!",
              "Vede rosso, sente solo rabbia",
              "Il corpo si muove da solo",
              "Ogni nemico è una bestia da distruggere",
              "L'istinto domina la ragione completamente",
              "Vuole solo combattere e vincere",
              "Sente la forza che esplode",
            ]
          : [
              "Rage takes control!",
              "Sees red, feels only anger",
              "Body moves on its own",
              "Every enemy is a beast to destroy",
              "Instinct completely dominates reason",
              "Only wants to fight and win",
              "Feels explosive strength",
            ];
        break;

      case "energized":
        thoughts = useItalian
          ? [
              "Sente la vitalità che scorre",
              "Pronto a qualsiasi sfida",
              "Il corpo è leggero e forte",
              "La mente è acuta e veloce",
              "Tutto sembra possibile",
              "Vuole agire e conquistare",
              "L'energia è pura e intensa",
            ]
          : [
              "Feels vitality flowing",
              "Ready for any challenge",
              "Body is light and strong",
              "Mind is sharp and quick",
              "Everything seems possible",
              "Wants to act and conquer",
              "Energy is pure and intense",
            ];
        break;

      case "panicked":
        thoughts = useItalian
          ? [
              "Il panico stringe la gola",
              "Non riesce a respirare normalmente",
              "La mente corre fuori controllo",
              "Vede minacce ovunque",
              "Vuole scappare da tutto",
              "Il cuore batte impazzito",
              "La realtà si distorce dalla paura",
            ]
          : [
              "Panic grips the throat",
              "Can't breathe normally",
              "Mind races out of control",
              "Sees threats everywhere",
              "Wants to flee from everything",
              "Heart beats wildly",
              "Reality distorts from fear",
            ];
        break;

      case "adrenaline_rush":
        thoughts = useItalian
          ? [
              "L'adrenalina accelera ogni senso",
              "Il tempo sembra rallentare",
              "Percezioni amplificate all'estremo",
              "Vuole azione adesso",
              "Sente il potere nel corpo",
              "Ogni muscolo vibra di energia",
              "È il momento di brillare",
            ]
          : [
              "Adrenaline accelerates every sense",
              "Time seems to slow",
              "Perceptions amplified to extreme",
              "Wants action now",
              "Feels power in body",
              "Every muscle vibrates with energy",
              "This is the moment to shine",
            ];
        break;

      case "hungry":
        thoughts = useItalian
          ? [
              "La fame è costante e crescente",
              "Lo stomaco protesta continuamente",
              "Pensa a qualsiasi cosa commestibile",
              "La concentrazione è difficile",
              "Vuole mangiare prima di agire",
              "La fame debilita la volontà",
              "Ricorda gli ultimi pasti con nostalgia",
            ]
          : [
              "Hunger is constant and growing",
              "Stomach protests continuously",
              "Thinks of anything edible",
              "Concentration is difficult",
              "Wants to eat before acting",
              "Hunger weakens willpower",
              "Remembers last meals with longing",
            ];
        break;

      case "drowsy":
        thoughts = useItalian
          ? [
              "Gli occhi sono pesanti",
              "La mente annebbiata dal sonno",
              "Fatica a stare sveglio",
              "Immagina di addormentarsi",
              "Ogni movimento è lento e difficile",
              "Vuole un posto confortevole",
              "Il sonno richiama irresistibilmente",
            ]
          : [
              "Eyes are heavy",
              "Mind clouded with sleep",
              "Struggles to stay awake",
              "Imagines falling asleep",
              "Every movement is slow and hard",
              "Wants a comfortable place",
              "Sleep calls irresistibly",
            ];
        break;

      case "exhausted_ap":
        thoughts = useItalian
          ? [
              "L'energia combattiva è esaurita",
              "Non ha più forza per agire",
              "Il corpo rifiuta di combattere",
              "Vuole solo riposare",
              "La fatica da battaglia è totale",
              "Non riuscirebbe a colpire una mosca",
              "Spera in una tregua",
            ]
          : [
              "Fighting energy is exhausted",
              "No longer has strength to act",
              "Body refuses to fight",
              "Just wants to rest",
              "Battle fatigue is total",
              "Couldn't hit a fly",
              "Hopes for a truce",
            ];
        break;

      case "mana_depleted":
        thoughts = useItalian
          ? [
              "L'energia magica è scomparsa",
              "Non può lanciare più incantesimi",
              "Sente il vuoto della magia",
              "Vuole ricaricarsi magicamente",
              "Il collegamento con la magia è reciso",
              "Si sente impotente",
              "Spera di recuperare il mana",
            ]
          : [
              "Magical energy is gone",
              "Can't cast spells anymore",
              "Feels the void of magic",
              "Wants to recharge magically",
              "Connection to magic is severed",
              "Feels powerless",
              "Hopes to recover mana",
            ];
        break;

      case "excellent":
        thoughts = useItalian
          ? [
              "Tutto scorre perfettamente",
              "Corpo e mente sono in armonia",
              "Si sente invincibile",
              "La vita è bella e carica di possibilità",
              "Ogni cellula vibra di vitalità",
              "Questo è il momento di grandi cose",
              "La felicità è pura e profonda",
            ]
          : [
              "Everything flows perfectly",
              "Body and mind are in harmony",
              "Feels invincible",
              "Life is beautiful and full of possibilities",
              "Every cell vibrates with vitality",
              "This is the moment for great things",
              "Happiness is pure and deep",
            ];
        break;

      case "confident":
        thoughts = useItalian
          ? [
              "La fiducia è assoluta",
              "Crede in sé completamente",
              "Niente sembra impossibile",
              "Il potere scorre nelle vene",
              "È il momento di agire",
              "La vittoria è dentro di sé",
              "La paura non ha luogo qui",
            ]
          : [
              "Confidence is absolute",
              "Believes in itself completely",
              "Nothing seems impossible",
              "Power flows through veins",
              "This is the moment to act",
              "Victory is within",
              "Fear has no place here",
            ];
        break;

      case "well_rested":
        thoughts = useItalian
          ? [
              "La mente è fresca e consapevole",
              "Il corpo è leggero e pronto",
              "Tutto sembra più chiaro",
              "La pazienza e la saggezza ritornano",
              "Sente la serenità",
              "È pronto per nuove avventure",
              "La speranza è vivida",
            ]
          : [
              "Mind is fresh and aware",
              "Body is light and ready",
              "Everything seems clearer",
              "Patience and wisdom return",
              "Feels serenity",
              "Ready for new adventures",
              "Hope is vivid",
            ];
        break;

      case "neutral":
      default:
        thoughts = useItalian
          ? [
              "Lo stato è neutrale e stabile",
              "La mente vaga lentamente",
              "Esiste in uno stato di consapevolezza",
              "Nulla richiede attenzione urgente",
              "Semplicemente... è",
            ]
          : [
              "State is neutral and stable",
              "Mind wanders slowly",
              "Exists in a state of awareness",
              "Nothing requires urgent attention",
              "Simply... is",
            ];
        break;
    }

    // Mix in some abstract thoughts occasionally
    if (Math.random() < 0.3) {
      thoughts.push(...this.getAbstractThoughtsForState(state, useItalian));
    }

    return thoughts[Math.floor(Math.random() * thoughts.length)];
  };

  // Get abstract thoughts that relate to the current state
  Window_BiologicSimulation.prototype.getAbstractThoughtsForState = function (
    state,
    useItalian
  ) {
    var abstract = useItalian
      ? [
          "Percepisce le ombre della coscienza",
          "Dialoga con la propria anima",
          "Sente l'eco dell'universo",
          "Contempla il significato del momento",
          "Riflette sulla natura del dolore",
          "Comprende una verità dimenticata",
          "Sente il filo della connessione",
        ]
      : [
          "Perceives shadows of consciousness",
          "Dialogues with own soul",
          "Feels the echo of the universe",
          "Contemplates the meaning of the moment",
          "Reflects on the nature of pain",
          "Understands a forgotten truth",
          "Feels the thread of connection",
        ];

    return abstract;
  };

  // Calculate Ego Strength (based on prefrontal cortex - Jungian sense of self)
  Window_BiologicSimulation.prototype.calculateEgoValue = function (brain) {
    if (!brain || !brain.regions) return 50;

    var prefrontal = brain.regions.prefrontalCortex ? brain.regions.prefrontalCortex.activity : 50;
    var motorCortex = brain.regions.motorCortex ? brain.regions.motorCortex.activity : 50;
    var sensoryCortex = brain.regions.sensoryCortex ? brain.regions.sensoryCortex.activity : 50;

    // Ego is how well the conscious mind controls actions and perceptions
    var ego = (prefrontal + motorCortex + sensoryCortex) / 3;
    return Math.min(100, Math.max(0, ego));
  };

  // Calculate Subconscious (based on limbic system - amygdala, hippocampus, brainstem)
  Window_BiologicSimulation.prototype.calculateSubconsciousValue = function (brain) {
    if (!brain || !brain.regions) return 50;

    var amygdala = brain.regions.amygdala ? brain.regions.amygdala.activity : 50;
    var hippocampus = brain.regions.hippocampus ? brain.regions.hippocampus.activity : 50;
    var brainstem = brain.regions.brainstem ? brain.regions.brainstem.activity : 50;

    // Subconscious is the limbic system's influence (emotions, memories, instincts)
    var subconscious = (amygdala + hippocampus + brainstem) / 3;
    return Math.min(100, Math.max(0, subconscious));
  };

  // Calculate Orgone Energy (Wilhelm Reich's bioenergy concept - based on overall vitality and ley veins)
  Window_BiologicSimulation.prototype.calculateOrgonePercentage = function (brain) {
    if (!brain) return 50;

    var actor = this._actor;
    if (!actor || !actor._biologicData) return 50;

    var bio = actor._biologicData;

    // Orgone is based on:
    // - Overall brain activity (consciousness)
    var brainEnergy = brain.overallActivity || 50;

    // - Ley vein magical activity (meridian energy)
    var leyVeinEnergy = 0;
    var leyVeinCount = 0;
    if (bio.leyVeins && bio.leyVeins.meridians) {
      for (var meridian in bio.leyVeins.meridians) {
        leyVeinEnergy += bio.leyVeins.meridians[meridian].magicalActivity || 0;
        leyVeinCount++;
      }
    }
    leyVeinEnergy = leyVeinCount > 0 ? leyVeinEnergy / leyVeinCount : 50;

    // - Vital signs (heartbeat, breathing)
    var heartRateNormalized = Math.min(100, (bio.vitalSigns.heartRate / 100) * 100);

    // - Immune system strength
    var immuneEnergy = Math.min(100, (bio.immuneSystem.whiteBloodCells / 10000) * 100);

    // Calculate final orgone energy
    var orgone =
      brainEnergy * 0.35 + leyVeinEnergy * 0.35 + heartRateNormalized * 0.15 + immuneEnergy * 0.15;

    return Math.min(100, Math.max(0, orgone));
  };

  Window_BiologicSimulation.prototype.drawBrainActivity = function (startY) {
    var brain = this._actor._biologicData.brainActivity;
    if (!brain) return;

    var y = startY - this._brainScrollY; // Apply scroll offset
    var lineHeight = this.lineHeight();
    var contentHeight = this.contents.height - startY - lineHeight * 2; // Reserve space for instructions
    var visibleAreaTop = startY;
    var visibleAreaBottom = visibleAreaTop + contentHeight;
    var totalContentHeight = 0;

    // Calculate total content height for scrolling
    var tempY = startY;

    // Mood and current thought (3 lines)
    tempY += lineHeight * 3;

    // Psychological Profile section (5 lines: header + ego + subconscious + orgone + spacing)
    tempY += lineHeight * 5;

    // Overall brain stats (4 lines)
    tempY += lineHeight * 4;

    // Brain waves section (7 lines: title + 3 wave pairs + gamma)
    tempY += lineHeight * 7;

    // Brain regions section
    tempY += lineHeight * 2; // Title + spacing

    // Sort regions by activity for display
    var regionArray = [];
    for (var regionKey in brain.regions) {
      var region = brain.regions[regionKey];
      regionArray.push({
        key: regionKey,
        name: region.name,
        activity: region.activity,
        status: region.status,
        function: region.function,
        oxygen: region.oxygenConsumption,
        neurotransmitters: region.neurotransmitters,
      });
    }
    // Sort alphabetically by name
    regionArray.sort(function (a, b) {
      return a.name.localeCompare(b.name);
    });

    // Each region takes 4 lines now (name/status, function, neurotransmitters, and a blank line for spacing)
    tempY += regionArray.length * lineHeight * 4;

    // Neurotransmitter summary section
    tempY += lineHeight * 8; // Title + 6 neurotransmitters + spacing

    this._maxBrainScroll = Math.max(0, tempY - visibleAreaBottom);

    // Helper function to check if line is visible
    var isLineVisible = function (lineY) {
      return (
        lineY >= visibleAreaTop - lineHeight &&
        lineY <= visibleAreaBottom + lineHeight
      );
    };

    // Draw content only if visible

    // Draw mood and current thought
    var currentMood = this.calculateCurrentMood(brain);
    var currentThought = this.getOrUpdateCurrentThought();
    var egoValue = this.calculateEgoValue(brain);
    var subconsciousValue = this.calculateSubconsciousValue(brain);
    var orgonePercentage = this.calculateOrgonePercentage(brain);

    if (isLineVisible(y)) {
      this.changeTextColor(this.textColor(3)); // Yellow for mood
      this.drawText("Mood: " + currentMood, 6, y, 400);
      this.resetTextColor();
    }
    y += lineHeight;

    if (isLineVisible(y)) {
      this.drawText("» " + currentThought, 6, y, 500);
    }
    y += lineHeight * 2; // Add spacing

    // Draw Jungian/Reich psychology stats
    if (isLineVisible(y)) {
      this.changeTextColor(this.textColor(3)); // Yellow for section header
      this.drawText("Psychological Profile:", 6, y, 300);
      this.resetTextColor();
    }
    y += lineHeight;

    if (isLineVisible(y)) {
      this.drawText("Ego Strength: " + Math.floor(egoValue) + "%", 6, y, 300);
    }
    y += lineHeight;

    if (isLineVisible(y)) {
      this.drawText("Subconscious: " + Math.floor(subconsciousValue) + "%", 6, y, 300);
    }
    y += lineHeight;

    if (isLineVisible(y)) {
      this.changeTextColor(this.textColor(1)); // Blue for orgone
      this.drawText("Orgone Energy: " + Math.floor(orgonePercentage) + "%", 6, y, 300);
      this.resetTextColor();
    }
    y += lineHeight * 2; // Add spacing

    // Overall brain stats
    if (isLineVisible(y)) {
      this.changeTextColor(this.textColor(3)); // Yellow for brain activity
      this.drawText(
        "Overall Activity: " + Math.floor(brain.overallActivity) + "%",
        6,
        y,
        300
      );
      this.resetTextColor();
    }
    y += lineHeight;

    if (isLineVisible(y)) {
      this.drawText(
        "Active Regions: " + brain.activeRegions + "/" + brain.totalRegions,
        6,
        y,
        300
      );
    }
    y += lineHeight;

    if (isLineVisible(y)) {
      this.drawText(
        "Neurons Firing: " + brain.neurons.firing.toLocaleString() + "/sec",
        6,
        y,
        400
      );
    }
    y += lineHeight;

    if (isLineVisible(y)) {
      this.drawText(
        "Total Connections: " + brain.neurons.connections.toExponential(2),
        6,
        y,
        400
      );
    }
    y += lineHeight * 2;

    // Brain waves
    if (isLineVisible(y)) {
      this.changeTextColor(this.systemColor());
      this.drawText("Brain Waves (Hz):", 6, y, 200);
      this.resetTextColor();
    }
    y += lineHeight;

    if (isLineVisible(y)) {
      this.drawText(
        "Alpha (8-13): " + brain.waves.alpha.toFixed(1),
        20,
        y,
        220
      );
      this.drawText(
        "Beta (13-30): " + brain.waves.beta.toFixed(1),
        330,
        y,
        200
      );
    }
    y += lineHeight;

    if (isLineVisible(y)) {
      this.drawText("Theta (4-8): " + brain.waves.theta.toFixed(1), 20, y, 200);
      this.drawText(
        "Delta (0.5-4): " + brain.waves.delta.toFixed(1),
        330,
        y,
        200
      );
    }
    y += lineHeight;

    if (isLineVisible(y)) {
      this.drawText(
        "Gamma (30-100): " + brain.waves.gamma.toFixed(1),
        20,
        y,
        200
      );
    }
    y += lineHeight * 2;

    // Brain regions
    if (isLineVisible(y)) {
      this.changeTextColor(this.systemColor());
      this.drawText("Brain Regions:", 6, y, 200);
      this.resetTextColor();
    }
    y += lineHeight;

    for (var i = 0; i < regionArray.length; i++) {
      var region = regionArray[i];
      var statusColor = this.normalColor();

      if (region.status === "Hyperactive") {
        statusColor = this.textColor(3); // Yellow
      } else if (region.status === "Active") {
        statusColor = this.textColor(23); // Light blue
      } else if (region.status === "Low" || region.status === "Minimal") {
        statusColor = this.textColor(18); // Orange/Red
      }

      // Region name and status
      if (isLineVisible(y)) {
        this.drawText(region.name + ":", 20, y, 400);
      }
      y += lineHeight;

      // Activity and oxygen on second line
      if (isLineVisible(y)) {
        this.changeTextColor(statusColor);
        this.drawText(
          "  Activity: " + Math.floor(region.activity) + "% (" + region.status + ")",
          30,
          y,
          350
        );
        this.resetTextColor();
        this.drawText(
          "O₂: " + region.oxygen.toFixed(1),
          550,
          y,
          120
        );
      }
      y += lineHeight;
      y += lineHeight;

      // Function description
      if (isLineVisible(y)) {
        this.drawText("  Function: " + region.function, 30, y, 400);
      }
      y += lineHeight;

      // Neurotransmitters for this region
      if (isLineVisible(y)) {
        var ntText = "  NT: ";
        var ntArray = [];
        for (var nt in region.neurotransmitters) {
          ntArray.push(
            nt.charAt(0).toUpperCase() +
              nt.slice(1) +
              ": " +
              Math.floor(region.neurotransmitters[nt])
          );
        }
        ntText += ntArray.join(", ");
        this.changeTextColor(this.textColor(6)); // Light gray
        this.drawText(ntText, 30, y, 500);
        this.resetTextColor();
      }
      y += lineHeight;

      // --- FIX START: Add an extra line for vertical spacing between entries ---
      y += lineHeight;
      // --- FIX END ---
    }

    y += lineHeight;

    // Overall neurotransmitter summary
    if (isLineVisible(y)) {
      this.changeTextColor(this.systemColor());
      this.drawText("Overall Neurotransmitter Levels:", 6, y, 300);
      this.resetTextColor();
    }
    y += lineHeight;

    // Calculate average neurotransmitter levels across all regions
    var avgNeurotransmitters = {
      dopamine: 0,
      serotonin: 0,
      norepinephrine: 0,
      acetylcholine: 0,
      gaba: 0,
      glutamate: 0,
    };
    var ntCounts = {};

    for (var regionKey in brain.regions) {
      var region = brain.regions[regionKey];
      for (var nt in region.neurotransmitters) {
        if (avgNeurotransmitters.hasOwnProperty(nt)) {
          avgNeurotransmitters[nt] += region.neurotransmitters[nt];
          ntCounts[nt] = (ntCounts[nt] || 0) + 1;
        }
      }
    }

    // Calculate averages
    for (var nt in avgNeurotransmitters) {
      if (ntCounts[nt] > 0) {
        avgNeurotransmitters[nt] = avgNeurotransmitters[nt] / ntCounts[nt];
      }
    }

    // Display neurotransmitter averages
    var ntDisplayNames = {
      dopamine: "Dopamine",
      serotonin: "Serotonin",
      norepinephrine: "Norepinephrine",
      acetylcholine: "Acetylcholine",
      gaba: "GABA",
      glutamate: "Glutamate",
    };

    var ntPairs = [
      ["dopamine", "serotonin"],
      ["norepinephrine", "acetylcholine"],
      ["gaba", "glutamate"],
    ];

    for (var i = 0; i < ntPairs.length; i++) {
      if (isLineVisible(y)) {
        var nt1 = ntPairs[i][0];
        var nt2 = ntPairs[i][1];
        this.drawText(
          ntDisplayNames[nt1] + ": " + Math.floor(avgNeurotransmitters[nt1]),
          20,
          y,
          200
        );
        this.drawText(
          ntDisplayNames[nt2] + ": " + Math.floor(avgNeurotransmitters[nt2]),
          250,
          y,
          200
        );
      }
      y += lineHeight;
    }

    // Draw scroll indicator if needed
    if (this._maxBrainScroll > 0) {
      var scrollPercent = this._brainScrollY / this._maxBrainScroll;
      var indicatorY = visibleAreaTop + contentHeight * scrollPercent;
      var indicatorHeight = Math.max(
        10,
        contentHeight * (contentHeight / (contentHeight + this._maxBrainScroll))
      );

      this.contents.fillRect(
        this.contents.width - 8,
        indicatorY,
        4,
        indicatorHeight,
        this.textColor(7)
      );
    }
  };
  Window_BiologicSimulation.prototype.drawHormones = function (startY) {
    var data = this._actor._biologicData.hormones;
    var y = startY;
    var lineHeight = this.lineHeight();

    this.changeTextColor(this.systemColor());
    this.drawText("Sex Hormones:", 6, y, 200);
    this.resetTextColor();
    y += lineHeight;

    this.drawText(
      "Testosterone: " + Math.floor(data.testosterone) + " ng/dL",
      20,
      y,
      300
    );
    y += lineHeight;

    this.drawText(
      "Estrogen: " + Math.floor(data.estrogen) + " pg/mL",
      20,
      y,
      300
    );
    y += lineHeight;

    this.drawText(
      "Progesterone: " + data.progesterone.toFixed(2) + " ng/mL",
      20,
      y,
      300
    );
    y += lineHeight * 2;

    this.changeTextColor(this.systemColor());
    this.drawText("Other Hormones:", 6, y, 200);
    this.resetTextColor();
    y += lineHeight;

    this.drawText(
      "Cortisol: " + Math.floor(data.cortisol) + " μg/dL",
      20,
      y,
      300
    );
    y += lineHeight;

    this.drawText(
      "Adrenaline: " + Math.floor(data.adrenaline) + " pg/mL",
      20,
      y,
      300
    );
    y += lineHeight;

    this.drawText(
      "Insulin: " + Math.floor(data.insulin) + " mIU/L",
      20,
      y,
      300
    );
    y += lineHeight;

    this.drawText(
      "Growth Hormone: " + data.growth.toFixed(2) + " ng/mL",
      20,
      y,
      300
    );
    y += lineHeight;

    this.drawText(
      "Thyroid (TSH): " + data.thyroid.toFixed(2) + " mIU/L",
      20,
      y,
      300
    );

    // Show current gender based on hormones
    var currentGender = $gameVariables.value(38);
    var genderNames = ["Male", "Female", "Non-Binary"];
    var genderNames_it = ["Maschio", "Femmina", "Non-Binario"];
    var genderName =
      ConfigManager.language === "it"
        ? genderNames_it[currentGender]
        : genderNames[currentGender];

    y += lineHeight * 2;
    this.changeTextColor(this.textColor(3));
    this.drawText("Current Gender: " + genderName, 6, y, 300);
    this.resetTextColor();
  };

  Window_BiologicSimulation.prototype.drawImmuneSystem = function (startY) {
    var data = this._actor._biologicData.immuneSystem;
    var y = startY;
    var lineHeight = this.lineHeight();

    this.drawText(
      "White Blood Cells: " + Math.floor(data.whiteBloodCells) + "/μL",
      6,
      y,
      300
    );
    y += lineHeight;

    this.drawText(
      "Antibodies: " + Math.floor(data.antibodies) + " mg/dL",
      6,
      y,
      300
    );
    y += lineHeight * 2;

    // Active Infections
    this.changeTextColor(this.systemColor());
    this.drawText("Active Infections:", 6, y, 200);
    this.resetTextColor();
    y += lineHeight;

    if (data.infections.length === 0) {
      this.drawText("None detected", 20, y, 300);
      y += lineHeight;
    } else {
      for (var i = 0; i < data.infections.length; i++) {
        var infection = data.infections[i];
        var severityText = ["Mild", "Moderate", "Severe"][
          infection.severity - 1
        ];
        var text =
          infection.location +
          ": " +
          infection.type +
          " (" +
          severityText +
          ")";

        if (infection.severity >= 2) {
          this.changeTextColor(this.textColor(2)); // Red for moderate/severe
        }

        this.drawText(text, 20, y, 400);
        this.resetTextColor();
        y += lineHeight;
      }
    }

    y += lineHeight;

    // Viruses
    this.changeTextColor(this.systemColor());
    this.drawText("Active Viruses:", 6, y, 200);
    this.resetTextColor();
    y += lineHeight;

    if (data.viruses.length === 0) {
      this.drawText("None detected", 20, y, 300);
      y += lineHeight;
    } else {
      for (var i = 0; i < Math.min(data.viruses.length, 5); i++) {
        var virus = data.viruses[i];
        var typeColor =
          virus.type === "Pathogenic"
            ? this.textColor(2)
            : virus.type === "Beneficial"
            ? this.textColor(3)
            : this.normalColor();

        this.drawText(virus.name + ":", 20, y, 200);
        this.changeTextColor(typeColor);
        this.drawText(
          virus.type + " (" + virus.count.toLocaleString() + ")",
          230,
          y,
          200
        );
        this.resetTextColor();
        y += lineHeight;
      }
      if (data.viruses.length > 5) {
        this.drawText(
          "... and " + (data.viruses.length - 5) + " more",
          20,
          y,
          200
        );
        y += lineHeight;
      }
    }

    y += lineHeight;

    // Bacteria
    this.changeTextColor(this.systemColor());
    this.drawText("Active Bacteria:", 6, y, 200);
    this.resetTextColor();
    y += lineHeight;

    if (data.bacteria.length === 0) {
      this.drawText("None detected", 20, y, 300);
    } else {
      for (var i = 0; i < Math.min(data.bacteria.length, 5); i++) {
        var bacteria = data.bacteria[i];
        var typeColor =
          bacteria.type === "Pathogenic"
            ? this.textColor(2)
            : bacteria.type === "Beneficial"
            ? this.textColor(3)
            : this.normalColor();

        this.drawText(bacteria.name + ":", 20, y, 200);
        this.changeTextColor(typeColor);
        this.drawText(
          bacteria.type + " (" + bacteria.count.toLocaleString() + ")",
          230,
          y,
          200
        );
        this.resetTextColor();
        y += lineHeight;
      }
      if (data.bacteria.length > 5) {
        this.drawText(
          "... and " + (data.bacteria.length - 5) + " more",
          20,
          y,
          200
        );
      }
    }
  };

  Window_BiologicSimulation.prototype.drawLeyVeins = function (startY) {
    var data = this._actor._biologicData.leyVeins;
    var bodyParts = this._actor._bodyParts;
    var y = startY;
    var lh = this.lineHeight();
    var useIt = ConfigManager.language === "it";

    // ── Overall flow header ───────────────────────────────────────────────────
    this.changeTextColor(this.textColor(3));
    var overallLabel = useIt
      ? "Flusso Mana Totale: " + Math.floor(data.flow) + "%"
      : "Overall Mana Flow: " + Math.floor(data.flow) + "%";
    this.drawText(overallLabel, 6, y, 350);
    this.resetTextColor();

    // Overall mana bar (full width)
    var barX = 360, barY = y + 4, barW = this.contentsWidth() - 366, barH = lh - 8;
    var bgColor = Utils.RPGMAKER_NAME === "MZ" ? ColorManager.gaugeBackColor() : this.textColor(19);
    var fgColor1 = Utils.RPGMAKER_NAME === "MZ" ? ColorManager.mpGaugeColor1() : this.textColor(22);
    var fgColor2 = Utils.RPGMAKER_NAME === "MZ" ? ColorManager.mpGaugeColor2() : this.textColor(23);
    this.contents.fillRect(barX, barY, barW, barH, bgColor);
    var fillW = Math.floor(barW * Math.min(data.flow, 100) / 100);
    if (fillW > 0) {
      // Gradient-like: fill left half with fgColor1, right half with fgColor2
      var half = Math.floor(fillW / 2);
      this.contents.fillRect(barX, barY, half, barH, fgColor1);
      this.contents.fillRect(barX + half, barY, fillW - half, barH, fgColor2);
    }

    y += lh + 4;
    this.drawHorzLine(y);
    y += 8;

    // ── Column headers ────────────────────────────────────────────────────────
    this.contents.fontSize = 16;
    this.changeTextColor(this.systemColor());
    var hPart  = useIt ? "Parte" : "Body Part";
    var hFlow  = useIt ? "Flusso Mana" : "Mana Flow";
    var hHP    = useIt ? "PV%" : "HP%";
    var hAct   = useIt ? "Attività" : "Activity";
    this.drawText(hPart,  6,   y, 140);
    this.drawText(hFlow,  150, y, 190);
    this.drawText(hHP,    348, y,  52);
    this.drawText(hAct,   408, y,  80);
    this.resetTextColor();
    this.resetFontSettings();
    y += Math.floor(lh * 0.9);
    this.drawHorzLine(y);
    y += 6;

    // ── Body part rows ────────────────────────────────────────────────────────
    if (!bodyParts) return;

    var numParts    = Object.keys(bodyParts).length;
    var healthyCount = 0;
    for (var k in bodyParts) { if (!bodyParts[k].damaged) healthyCount++; }

    // Base per-part flow = what one part gets when all parts are healthy.
    // Bar is scaled against this: 100% bar = normal share, >100% = redistributed extra.
    // Max representable = 150 (the cap in updateLeyVeinsFromDamage).
    var basePerPart = numParts > 0 ? data.flow : 0; // overallFlow / numParts × numParts = overallFlow
    var barMax = 150; // bars scale to this so redistribution is visually apparent

    // Accent color for overloaded (redistributed) flow
    var overloadColor = Utils.RPGMAKER_NAME === "MZ" ? ColorManager.ctGaugeColor1() : this.textColor(29);

    for (var partKey in bodyParts) {
      var part = bodyParts[partKey];
      var mer  = data.meridians[partKey];
      if (!mer) continue;

      var hpRatio = part.maxHp > 0 ? part.currentHp / part.maxHp : 0;
      var flowVal = Math.floor(mer.flow);
      // Per-part normal share (no redistribution)
      var normalShare = numParts > 0 ? Math.floor(data.flow) : 0;
      var isOverloaded = !part.damaged && healthyCount < numParts && flowVal > normalShare;

      // Part name
      this.resetTextColor();
      this.contents.fontSize = 18;
      this.drawText(mer.name || part.name, 6, y, 140);

      // Mana flow gauge bar — scaled so barMax fills the full bar width
      var gX = 150, gY = y + 5, gW = 190, gH = lh - 10;
      this.contents.fillRect(gX, gY, gW, gH, bgColor);
      if (flowVal > 0) {
        var gFill = Math.floor(gW * Math.min(flowVal, barMax) / barMax);
        if (isOverloaded) {
          // Show normal share in mp color, extra in accent (overload)
          var normalFill = Math.floor(gW * Math.min(normalShare, barMax) / barMax);
          var h1 = Math.floor(normalFill / 2);
          this.contents.fillRect(gX, gY, h1, gH, fgColor1);
          this.contents.fillRect(gX + h1, gY, normalFill - h1, gH, fgColor2);
          this.contents.fillRect(gX + normalFill, gY, gFill - normalFill, gH, overloadColor);
        } else {
          var h1 = Math.floor(gFill / 2);
          this.contents.fillRect(gX, gY, h1, gH, fgColor1);
          this.contents.fillRect(gX + h1, gY, gFill - h1, gH, fgColor2);
        }
      }
      // Flow value label inside bar
      this.contents.fontSize = 15;
      this.changeTextColor(part.damaged ? this.textColor(2) : '#ffffff');
      var flowLabel = part.damaged ? (useIt ? "BLOCCATO" : "BLOCKED") : flowVal + "%";
      this.drawText(flowLabel, gX + 4, y, gW - 8);

      // HP %
      this.contents.fontSize = 17;
      this.changeTextColor(part.damaged ? this.textColor(2) : this.normalColor());
      var hpText = part.damaged ? "—" : Math.floor(hpRatio * 100) + "%";
      this.drawText(hpText, 348, y, 52, "right");

      // Magical activity
      if (mer.magicalActivity !== undefined) {
        this.changeTextColor(this.textColor(3));
        this.contents.fontSize = 15;
        this.drawText(Math.floor(mer.magicalActivity) + "%", 408, y, 80);
      }

      this.resetTextColor();
      this.resetFontSettings();
      y += lh;
    }
  };

  Window_BiologicSimulation.prototype.drawHorzLine = function (y) {
    var lineY = y + this.lineHeight() / 2 - 1;
    this.contents.paintOpacity = 48;
    var color =
      Utils.RPGMAKER_NAME === "MZ"
        ? ColorManager.normalColor()
        : this.normalColor();
    this.contents.fillRect(0, lineY, this.contentsWidth(), 2, color);
    this.contents.paintOpacity = 255;
  };

  Window_BiologicSimulation.prototype.cursorRight = function (wrap) {
    this._brainScrollY = 0; // Reset brain scroll
    this._vitalScrollY = 0; // Reset vital scroll
    this._partsScrollY = 0; // Reset parts scroll
    this._augmentsScrollY = 0; // Reset augments scroll
    this._category = (this._category + 1) % this._categories.length;
    this.refresh();
  };

  Window_BiologicSimulation.prototype.cursorLeft = function (wrap) {
    this._brainScrollY = 0; // Reset brain scroll
    this._vitalScrollY = 0; // Reset vital scroll
    this._partsScrollY = 0; // Reset parts scroll
    this._augmentsScrollY = 0; // Reset augments scroll
    this._category =
      (this._category - 1 + this._categories.length) % this._categories.length;
    this.refresh();
  };

  Window_BiologicSimulation.prototype.processCancel = function () {
    if (Utils.RPGMAKER_NAME === "MZ") {
      Window_StatusBase.prototype.processCancel.call(this);
    } else {
      Window_Selectable.prototype.processCancel.call(this);
    }
    SceneManager.pop();
  };

  // Helper methods for color compatibility
  Window_BiologicSimulation.prototype.systemColor = function () {
    return Utils.RPGMAKER_NAME === "MZ"
      ? ColorManager.systemColor()
      : Window_Base.prototype.systemColor.call(this);
  };

  Window_BiologicSimulation.prototype.normalColor = function () {
    return Utils.RPGMAKER_NAME === "MZ"
      ? ColorManager.normalColor()
      : Window_Base.prototype.normalColor.call(this);
  };

  Window_BiologicSimulation.prototype.textColor = function (n) {
    return Utils.RPGMAKER_NAME === "MZ"
      ? ColorManager.textColor(n)
      : Window_Base.prototype.textColor.call(this, n);
  };

  Window_BiologicSimulation.prototype.resetTextColor = function () {
    if (Utils.RPGMAKER_NAME === "MZ") {
      this.changeTextColor(ColorManager.normalColor());
    } else {
      Window_Base.prototype.resetTextColor.call(this);
    }
  };

  Window_BiologicSimulation.prototype.changeTextColor = function (color) {
    if (Utils.RPGMAKER_NAME === "MZ") {
      this.contents.textColor = color;
    } else {
      Window_Base.prototype.changeTextColor.call(this, color);
    }
  };
// Static methods for pregnancy plugin commands

Window_BiologicSimulation.makePregnant = function() {
  var actor = $gameParty.members()[0];
  if (!actor) return;
  
  var pregnancyType = $gameVariables.value(87) || 0;
  
  // Check if reproduction is possible
  if (pregnancyType === 0) {
    var message = getTranslatedText(
      "No reproductive system available. Set Variable 87 first.",
      "Nessun sistema riproduttivo disponibile. Imposta prima la Variabile 87."
    );
    $gameMessage.add(message);
    return;
  }
// Initialize uterus data if it doesn't exist
if (!actor._uterusData) {
  actor._uterusData = {
    pregnancyType: pregnancyType,
    isPregnant: false,
    conceptionDate: null,
    dueDate: null,
    gestationalAge: 0,
    fetus: null,
    ovulationCycle: {
      dayInCycle: Math.floor(Math.random() * 28) + 1,
      cycleLength: 28,
      ovulationDay: 14,
      fertile: false,
    },
    eggCount: 300000 + Math.floor(Math.random() * 200000),
    eggDevelopment: 0,
    eggsToLay: 0,
    seedDevelopment: 0,
    seedsReady: 0,
    mitosisDevelopment: 0,
    lastStatusCheck: Date.now(),
    lastCycleUpdate: Date.now(),
    birthReady: false,
  };
}

var uterus = actor._uterusData;

// Check if already pregnant
if (uterus.isPregnant) {
  var message = getTranslatedText(
    "Already in reproductive process!",
    "Già  in processo riproduttivo!"
  );
  $gameMessage.add(message);
  return;
}

// Make pregnant based on type using game date
var currentGameDate = convertGameDateToTimestamp(getGameDateFromVariable());
uterus.isPregnant = true;
uterus.conceptionDate = currentGameDate;
uterus.gestationalAge = 0;
uterus.lastStatusCheck = currentGameDate;

var message = "";

switch (pregnancyType) {
  case 1: // Uterus
    uterus.dueDate = currentGameDate + 270; // 270 game days
    message = getTranslatedText(
      "Pregnancy initiated! Due in 270 days.",
      "Gravidanza iniziata! Parto previsto tra 270 giorni."
    );
    break;

  case 2: // Oviparous
    uterus.dueDate = currentGameDate + 270; // 270 game days (same duration)
    uterus.eggDevelopment = 0;
    message = getTranslatedText(
      "Egg development initiated! 1-4 eggs will be ready in 270 days.",
      "Sviluppo uova iniziato! 1-4 uova saranno pronte tra 270 giorni."
    );
    break;

  case 3: // Plant seeds
    uterus.dueDate = currentGameDate + 7; // 7 game days (1 week)
    uterus.seedDevelopment = 0;
    message = getTranslatedText(
      "Seed generation initiated! Seed will be ready in 7 days.",
      "Generazione seme iniziata! Seme sarà pronto tra 7 giorni."
    );
    break;

  case 4: // Mitosis
    uterus.dueDate = currentGameDate + 1; // 1 game day
    uterus.mitosisDevelopment = 0;
    message = getTranslatedText(
      "Mitosis initiated! Cell division will complete in 1 day.",
      "Mitosi iniziata! Divisione cellulare completerà in 1 giorno."
    );
    break;
}

$gameMessage.add(message);
};











var _Game_Interpreter_pluginCommand_pregnancy =
  Game_Interpreter.prototype.pluginCommand;
  Window_BiologicSimulation.shortenPregnancy = function() {
    var actor = $gameParty.members()[0];
    if (!actor || !actor._uterusData) return;
    
    var uterus = actor._uterusData;
    var pregnancyType = $gameVariables.value(87) || 0;
    
    if (!uterus.isPregnant) {
      var message = getTranslatedText(
        "Not currently in reproductive process.",
        "Non attualmente in processo riproduttivo."
      );
      $gameMessage.add(message);
      return;
    }
    
    // Reduce by 30 game days (1 month) for all types
    var thirtyGameDays = 30;
    uterus.conceptionDate -= thirtyGameDays;
    uterus.dueDate -= thirtyGameDays;

    // Recalculate progress
    var now = convertGameDateToTimestamp(getGameDateFromVariable());
    var elapsed = now - uterus.conceptionDate;  // elapsed is in days
    uterus.gestationalAge = Math.floor(elapsed);
    
    var message = "";
    var shouldComplete = false;
    
    switch (pregnancyType) {
      case 1: // Uterus
        if (uterus.gestationalAge >= 270) {
          shouldComplete = true;
          message = getTranslatedText(
            "Pregnancy accelerated to completion! Birth is imminent.",
            "Gravidanza accelerata al completamento! Il parto à¨ imminente."
          );
        } else {
          var daysRemaining = 270 - uterus.gestationalAge;
          message = getTranslatedText(
            "Pregnancy shortened by 30 days! " + daysRemaining + " days remaining.",
            "Gravidanza ridotta di 30 giorni! Rimangono " + daysRemaining + " giorni."
          );
        }
        break;
        
      case 2: // Oviparous
        var totalMinutes = Math.floor(elapsed / (1000 * 60));
        uterus.eggDevelopment = Math.min(100, (totalMinutes / (270 * 24 * 60)) * 100);
        
        if (uterus.eggDevelopment >= 100) {
          shouldComplete = true;
          message = getTranslatedText(
            "Egg development accelerated to completion! Eggs ready to lay.",
            "Sviluppo uova accelerato al completamento! Uova pronte da deporre."
          );
        } else {
          message = getTranslatedText(
            "Egg development shortened by 30 days! Progress: " + uterus.eggDevelopment.toFixed(1) + "%",
            "Sviluppo uova ridotto di 30 giorni! Progresso: " + uterus.eggDevelopment.toFixed(1) + "%"
          );
        }
        break;
        
      case 3: // Plant seeds
        var totalHours = Math.floor(elapsed / (1000 * 60 * 60));
        uterus.seedDevelopment = Math.min(100, (totalHours / (7 * 24)) * 100);
        
        if (uterus.seedDevelopment >= 100) {
          shouldComplete = true;
          message = getTranslatedText(
            "Seed generation accelerated to completion! Seed is ready.",
            "Generazione seme accelerata al completamento! Seme à¨ pronto."
          );
        } else {
          var hoursRemaining = Math.ceil(((100 - uterus.seedDevelopment) / 100) * (7 * 24));
          message = getTranslatedText(
            "Seed generation shortened! ~" + hoursRemaining + " hours remaining.",
            "Generazione seme ridotta! Rimangono ~" + hoursRemaining + " ore."
          );
        }
        break;
        
      case 4: // Mitosis
        var totalMinutes = Math.floor(elapsed / (1000 * 60));
        uterus.mitosisDevelopment = Math.min(100, (totalMinutes / 60) * 100);
        
        if (uterus.mitosisDevelopment >= 100) {
          shouldComplete = true;
          message = getTranslatedText(
            "Mitosis accelerated to completion! Cell division complete.",
            "Mitosi accelerata al completamento! Divisione cellulare completa."
          );
        } else {
          var minutesRemaining = Math.ceil(((100 - uterus.mitosisDevelopment) / 100) * 60);
          message = getTranslatedText(
            "Mitosis shortened! ~" + minutesRemaining + " minutes remaining.",
            "Mitosi ridotta! Rimangono ~" + minutesRemaining + " minuti."
          );
        }
        break;
    }
    
    $gameMessage.add(message);
  };
  Window_BiologicSimulation.birthSeed = function() {
    var actor = $gameParty.members()[0];
    if (!actor || !actor._uterusData) return;
    
    var uterus = actor._uterusData;
    var pregnancyType = $gameVariables.value(87) || 0;
    
    if (pregnancyType !== 3) {
      var message = getTranslatedText(
        "This command only works for plant-type reproduction.",
        "Questo comando funziona solo per riproduzione di tipo vegetale."
      );
      $gameMessage.add(message);
      return;
    }
    
    if (uterus.seedsReady <= 0) {
      var message = getTranslatedText(
        "No seeds available to plant.",
        "Nessun seme disponibile da piantare."
      );
      $gameMessage.add(message);
      return;
    }
    
    // Remove one seed from stockpile
    uterus.seedsReady -= 1;
    
    var message = getTranslatedText(
      "Seed planted! Remaining seeds: " + uterus.seedsReady,
      "Seme piantato! Semi rimanenti: " + uterus.seedsReady
    );
    $gameMessage.add(message);
    
    // Trigger birth event
    $gameTemp.reserveCommonEvent(139);
  };
  var _Game_Interpreter_pluginCommand_birthSeed =
  Game_Interpreter.prototype.pluginCommand;
Game_Interpreter.prototype.pluginCommand = function (command, args) {
  _Game_Interpreter_pluginCommand_birthSeed.call(this, command, args);

  if (command === "BirthSeed") {
    Window_BiologicSimulation.birthSeed();
  }
};

// For MZ
if (Utils.RPGMAKER_NAME === "MZ") {
  PluginManager.registerCommand(
    "Health_BiologicSimulation",
    "BirthSeed",
    (args) => {
      Window_BiologicSimulation.birthSeed();
    }
  );
}
  // Add compatibility methods for MV if running in MZ
  if (Utils.RPGMAKER_NAME === "MZ") {
    if (!Window_BiologicSimulation.prototype.drawActorName) {
      Window_BiologicSimulation.prototype.drawActorName = function (
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
  }
})();

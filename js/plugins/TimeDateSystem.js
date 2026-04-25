/*:
 * @target MZ
 * @plugindesc v1.2.0 Adds hunger and sleep systems with overeating mechanic.
 * @author Omni-Lex
 * @url https://nocoldiz.itch.io/hypernet-explorer
 *
 * @help TimeDateSystem
 * === Hunger and Sleep System v1.2.0 ===
 *
 * This plugin adds hunger and sleep mechanics to your game.
 * This version has been modified for a more realistic hunger system.
 *
 * --- What's New in v1.2.0 ---
 * - Added overeating system:
 * - Hunger indicator can exceed 100% (up to 150% by default).
 * - If it exceeds 110%, the player suffers a state (default: 41).
 * - The state is removed when hunger drops below 100%.
 * - Hunger consumption is much faster when above 100%.
 *
 * --- Features ---
 * - Characters become hungry and sleepy over time.
 * - Status is displayed in the main menu (HP, MP, Status, Hunger, Sleep).
 * - Shows current time and temperature.
 * - Notifications appear when hunger/sleep states change.
 * - Debuffs applied at low levels (< 20%) and severe at 0%.
 * - Hunger recovers by eating food with specific nutritional values.
 *
 * --- New Plugin Command: EatFood ---
 * This command replaces the old "RecoverHunger".
 * Simulates food consumption by an actor.
 *
 * 1.  **Before calling the command**, set the nutritional values
 * of the food item in three game variables:
 * - Calories Variable (default: 88)
 * - Fat Variable (default: 89)
 * - Protein Variable (default: 90)
 *
 * @param --- Hunger/Sleep Settings ---
 *
 * @param hungerDecreaseRate
 * @text Hunger Decrease Rate
 * @desc How much hunger decreases per step.
 * @type number
 * @decimals 2
 * @min 0.01
 * @default 0.05
 * @parent --- Hunger/Sleep Settings ---
 *
 * @param sleepDecreaseRate
 * @text Sleep Decrease Rate
 * @desc How much sleep decreases per step.
 * @type number
 * @decimals 2
 * @min 0.01
 * @default 0.03
 * @parent --- Hunger/Sleep Settings ---
 *
 * @param maxHunger
 * @text Max Hunger
 * @desc Maximum hunger value (100% threshold).
 * @type number
 * @min 1
 * @default 100
 * @parent --- Hunger/Sleep Settings ---
 *
 * @param overeatMaxHunger
 * @text Max Hunger (Overeating)
 * @desc Maximum hunger value that can be reached during overeating.
 * @type number
 * @min 100
 * @default 150
 * @parent --- Hunger/Sleep Settings ---
 *
 * @param overeatStateId
 * @text Overeating State ID
 * @desc The ID of the state applied when overeating (>110%).
 * @type state
 * @default 41
 * @parent --- Hunger/Sleep Settings ---
 *
 * @param overeatDepletionMultiplier
 * @text Overeating Depletion Multiplier
 * @desc Multiplier for hunger decrease rate when hunger > 100%.
 * @type number
 * @decimals 2
 * @default 3.00
 * @parent --- Hunger/Sleep Settings ---
 *
 * @param maxSleep
 * @text Max Sleep
 * @desc Maximum sleep value.
 * @type number
 * @min 1
 * @default 100
 * @parent --- Hunger/Sleep Settings ---
 *
 * @param --- Realistic Hunger Recovery ---
 *
 * @param calorieVariableId
 * @text Calorie Variable ID
 * @desc The ID of the game variable that stores food calories.
 * @type variable
 * @default 88
 * @parent --- Realistic Hunger Recovery ---
 *
 * @param fatVariableId
 * @text Fat Variable ID
 * @desc The ID of the game variable that stores food fat.
 * @type variable
 * @default 89
 * @parent --- Realistic Hunger Recovery ---
 *
 * @param proteinVariableId
 * @text Protein Variable ID
 * @desc The ID of the game variable that stores food protein.
 * @type variable
 * @default 90
 * @parent --- Realistic Hunger Recovery ---
 *
 * @param caffeineVariableId
 * @text Caffeine Variable ID
 * @desc The ID of the game variable that stores food caffeine.
 * @type variable
 * @default 91
 * @parent --- Realistic Hunger Recovery ---
 *
 * @param calorieFactor
 * @text Calorie Factor
 * @desc Multiplier for calories in hunger recovery calculation.
 * @type number
 * @decimals 2
 * @default 0.10
 * @parent --- Realistic Hunger Recovery ---
 *
 * @param proteinFactor
 * @text Protein Factor
 * @desc Multiplier for protein in hunger recovery calculation.
 * @type number
 * @decimals 2
 * @default 2.00
 * @parent --- Realistic Hunger Recovery ---
 *
 * @param fatFactor
 * @text Fat Factor
 * @desc Multiplier for fat in hunger recovery calculation.
 * @type number
 * @decimals 2
 * @default 1.50
 * @parent --- Realistic Hunger Recovery ---
 *
 *
 * @param caffeineFactor
 * @text Caffeine Factor
 * @desc Multiplier for caffeine in hunger recovery calculation.
 * @type number
 * @decimals 2
 * @default 1.50
 * @parent --- Realistic Hunger Recovery ---
 *
 * @param --- Time Management Settings ---
 *
 * @param gameTimeVariable
 * @text Game Time Variable
 * @desc Variable ID to store total game minutes elapsed (used on map 315 for manual advancement).
 * @type variable
 * @default 114
 * @parent --- Time Management Settings ---
 *
 * @param gameDateVariable
 * @text Game Date Variable
 * @desc Variable ID to store formatted date/time string (updates on hour/minute changes).
 * @type variable
 * @default 113
 * @parent --- Time Management Settings ---
 *
 * @param --- UI Settings ---
 *
 * @param hungerIcon
 * @text Hunger Icon
 * @desc Icon index for hunger display.
 * @type number
 * @min 0
 * @default 118
 * @parent --- UI Settings ---
 *
 * @param sleepIcon
 * @text Sleep Icon
 * @desc Icon index for sleep display.
 * @type number
 * @min 0
 * @default 3
 * @parent --- UI Settings ---
 *
 * @param temperatureVariable
 * @text Temperature Variable
 * @desc ID of the variable that stores the temperature value.
 * @type variable
 * @default 61
 * @parent --- UI Settings ---
 *
 * @param timeIcon
 * @text Time Icon
 * @desc Icon index for time display.
 * @type number
 * @min 0
 * @default 87
 * @parent --- UI Settings ---
 *
 * @param temperatureIcon
 * @text Temperature Icon
 * @desc Icon index for temperature display.
 * @type number
 * @min 0
 * @default 64
 * @parent --- UI Settings ---
 *
 * @command EatFood
 * @text Eat Food (Recover Hunger)
 * @desc Recovers hunger for an actor based on nutritional values in game variables. Variables are reset to zero after use.
 * @arg actorId
 * @text Actor ID
 * @desc The actor who will eat the food.
 * @type actor
 * @default 1
 *
 * @command RecoverSleep
 * @text Recover Sleep
 * @desc Recovers sleep for the specified actor.
 * @arg actorId
 * @text Actor ID
 * @desc ID of the actor to recover sleep for (1, 2, etc.).
 * @type actor
 * @default 1
 * @arg amount
 * @text Amount
 * @desc Amount of sleep to recover (percentage).
 * @type number
 * @min 1
 * @max 100
 * @default 50
 *
 * @command StartSeat
 * @text Start Seat
 * @desc Activates seat mode: the player recovers 0.5% sleep per second
 * but can only turn around, not move.
 *
 * @command StopSeat
 * @text Stop Seat
 * @desc Deactivates seat mode and restores normal movement.
 *
 * @command Vomit
 * @text Vomit
 * @desc Vomits to reduce hunger: if hunger > 100%, reset to 50%; if hunger ≤ 100%, set to 0%.
 * @arg actorId
 * @text Actor ID
 * @desc The actor who will vomit.
 * @type actor
 * @default 1
 *
 * @command PassTime
 * @text Pass Time
 * @desc Advance the game clock by specified hours and minutes.
 * @arg hours
 * @text Hours
 * @desc Number of hours to advance.
 * @type number
 * @min 0
 * @default 0
 * @arg minutes
 * @text Minutes
 * @desc Number of minutes to advance (0-59).
 * @type number
 * @min 0
 * @max 59
 * @default 0
 *
 * @command FullRestore
 * @text Full Restore (Food & Sleep)
 * @desc Restores hunger and sleep to 100% for all party members.
 *
 */

(function () {
  "use strict";

  const pluginName = "TimeDateSystem";

  // Translation system
  const translations = {
    en: {
      hungry: "is hungry",
      starving: "is starving!",
      noLongerHungry: "is no longer hungry",
      sleepy: "is sleepy",
      exhausted: "is exhausted!",
      noLongerSleepy: "is no longer sleepy",
      hp: "HP",
      mp: "MP",
    },
    it: {
      hungry: "ha fame",
      starving: "sta morendo di fame!",
      noLongerHungry: "non ha più fame",
      sleepy: "ha sonno",
      exhausted: "è esausto!",
      noLongerSleepy: "non ha più sonno",
      hp: "HP",
      mp: "MP",
    },
  };
  // Get current language
  function getCurrentLanguage() {
    if (
      typeof ConfigManager !== "undefined" &&
      ConfigManager.language === "it"
    ) {
      return "it";
    }
    return "en";
  }

  // Get translated text
  function getText(key) {
    const lang = getCurrentLanguage();
    return translations[lang][key] || translations.en[key] || key;
  }

  // Parameters
  const parameters = PluginManager.parameters(pluginName);
  const hungerDecreaseRate = Number(parameters.hungerDecreaseRate || 0.05);
  const sleepDecreaseRate = Number(parameters.sleepDecreaseRate || 0.03);
  const maxHunger = Number(parameters.maxHunger || 100);

  // New Overeating Parameters
  const overeatMaxHunger = Number(parameters.overeatMaxHunger || 150);
  const overeatStateId = Number(parameters.overeatStateId || 41);
  const overeatDepletionMultiplier = Number(
    parameters.overeatDepletionMultiplier || 3.0
  );

  const maxSleep = Number(parameters.maxSleep || 100);
  const hungerIcon = Number(parameters.hungerIcon || 118);
  const sleepIcon = Number(parameters.sleepIcon || 3);
  const temperatureVariable = Number(parameters.temperatureVariable || 61);
  const timeIcon = Number(parameters.timeIcon || 87);
  const temperatureIcon = Number(parameters.temperatureIcon || 64);
  const shiftMultiplier = Number(parameters.shiftMultiplier || 2);

  // Realistic Hunger Recovery Parameters
  const calorieVariableId = Number(parameters.calorieVariableId || 88);
  const fatVariableId = Number(parameters.fatVariableId || 89);
  const proteinVariableId = Number(parameters.proteinVariableId || 90);
  const calorieFactor = Number(parameters.calorieFactor || 0.1);
  const proteinFactor = Number(parameters.proteinFactor || 2.0);
  const caffeineVariableId = Number(parameters.caffeineVariableId || 91);
  const fatFactor = Number(parameters.fatFactor || 1.5);
  const caffeineFactor = Number(parameters.caffeineFactor || 0.6);

  // Time Management Parameters
  const gameTimeVariable = Number(parameters.gameTimeVariable || 114);
  const gameDateVariable = Number(parameters.gameDateVariable || 113);


  // Debug logging helper
  function debug(msg) {
    if (Utils.isNwjs() || Utils.isOptionValid("test")) {
      console.log(`[${pluginName}] ${msg}`);
    }
  }

  //=============================================================================
  // Time Management Functions
  //=============================================================================

  // Track last real-time check (for normal maps using system clock)
  let lastRealTimeCheck = Date.now();

  // Get current game time in minutes (Variable 114 stores total minutes elapsed)
  function getGameTimeMinutes() {
    return $gameVariables.value(gameTimeVariable) || 0;
  }

  // Set game time in minutes (only used for map 315 manual advancement)
  function setGameTimeMinutes(minutes) {
    $gameVariables.setValue(gameTimeVariable, Math.max(0, minutes));
  }

  // Convert minutes since epoch to date/time components
  function getDateTimeFromMinutes(minutes) {
    // Base date: Jan 1, 2001 012:00 (12 AM start)
    const date = new Date(2001, 0, 1, 12, 0, 0);
    date.setMinutes(date.getMinutes() + minutes);

    const months = [
+      "JAN", "FEB", "MAR", "APR", "MAY", "JUN",
      "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"
    ];

    const dayNum = String(date.getDate()).padStart(2, "0");
    const month = months[date.getMonth()];
    const monthNum = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    const yearShort = String(year).slice(-2); // Get last 2 digits of year
    const hours = String(date.getHours()).padStart(2, "0");
    const mins = String(date.getMinutes()).padStart(2, "0");

    return {
      day: date.getDate(),
      dayNum: dayNum,
      month: month,
      monthNum: monthNum,
      year: year,
      yearShort: yearShort,
      hours: hours,
      minutes: mins,
      time24: `${hours}:${mins}`,
      dateShort: `${dayNum}/${monthNum}/${yearShort}`,
      fullDate: `${dayNum} ${month} ${year} ${hours}:${mins}`
    };
  }

  // Update date variable when time changes (on hour/minute boundary)
  let lastDisplayedHour = -1;
  let lastDisplayedMinute = -1;

  function updateGameDateVariable() {
    const minutes = getGameTimeMinutes();
    const dateTime = getDateTimeFromMinutes(minutes);

    const currentHour = parseInt(dateTime.hours);
    const currentMinute = parseInt(dateTime.minutes);

    // Update Variable 113 when hour or minute changes
    if (currentHour !== lastDisplayedHour || currentMinute !== lastDisplayedMinute) {
      lastDisplayedHour = currentHour;
      lastDisplayedMinute = currentMinute;
      $gameVariables.setValue(gameDateVariable, dateTime.fullDate);
      debug(`Game time updated: ${dateTime.fullDate}`);
      if ($gameTemp && $dataMap && !$dataMap.note.includes('<mz3d>disable()</mz3d>')) {
        $gameTemp.reserveCommonEvent(91);
      }
    }
  }

  //=============================================================================
  // Plugin Commands
  //=============================================================================

  PluginManager.registerCommand(pluginName, "EatFood", function (args) {
    const actorId = Number(args.actorId);
    const actor = $gameActors.actor(actorId);

    if (actor) {
        const calories = $gameVariables.value(calorieVariableId) || 0;
        const protein = $gameVariables.value(proteinVariableId) || 0;
        const fat = $gameVariables.value(fatVariableId) || 0;
        const caffeine = $gameVariables.value(caffeineVariableId) || 0;

        // Calculate hunger recovery based on nutritional values
        const recoveryAmount = (calories * calorieFactor) + (protein * proteinFactor) + (fat * fatFactor);
        
        debug(
            `Eating food for actor ${actorId}: C=${calories}, P=${protein}, F=${fat}, Caffeine=${caffeine}. Recovering ${recoveryAmount.toFixed(2)} hunger.`
        );
        
        actor.addHunger(recoveryAmount);

        // Handle caffeine effect on sleep
        if (caffeine > 0) {
            const sleepReduction = caffeine * caffeineFactor;
            actor.reduceSleep(sleepReduction);
            debug(`Caffeine reduced sleep by ${sleepReduction.toFixed(2)} points.`);
        }

        // Reset nutrient variables to 0 after consumption
        $gameVariables.setValue(calorieVariableId, 0);
        $gameVariables.setValue(proteinVariableId, 0);
        $gameVariables.setValue(fatVariableId, 0);
        $gameVariables.setValue(caffeineVariableId, 0);
        debug("Nutrient variables have been reset to 0.");

        // Refresh menu if open
        if (SceneManager._scene instanceof Scene_Menu) {
            SceneManager._scene._hungerSleepStatusWindow.refresh();
        }
    } else {
        debug(`Actor with ID ${actorId} not found.`);
    }
});


  PluginManager.registerCommand(pluginName, "RecoverSleep", function (args) {
    const actorId = Number(args.actorId || 1);
    const amount = Number(args.amount || 50);
    const actor = $gameActors.actor(actorId);

    if (actor) {
      // Calculate percentage of max sleep
      const sleepAmount = (amount / 100) * maxSleep;
      debug(
        `Recovering ${amount}% (${sleepAmount} points) sleep for actor ${actorId}`
      );
      actor.addSleep(sleepAmount);

      // Refresh menu if open
      if (SceneManager._scene instanceof Scene_Menu) {
        SceneManager._scene._hungerSleepStatusWindow.refresh();
      }
    } else {
      debug(`Actor ${actorId} not found.`);
    }
  });

  PluginManager.registerCommand(pluginName, "StartSeat", function (args) {
    if ($gamePlayer) {
      $gamePlayer.setSeat(true);
      debug("Seat mode activated - player can only turn, sleep recovery active");
    }
  });

  PluginManager.registerCommand(pluginName, "StopSeat", function (args) {
    if ($gamePlayer) {
      $gamePlayer.setSeat(false);
      debug("Seat mode deactivated - normal movement restored");
    }
  });

  PluginManager.registerCommand(pluginName, "Vomit", function (args) {
    const actorId = Number(args.actorId || 1);
    const actor = $gameActors.actor(actorId);

    if (actor) {
      const currentHunger = actor.hunger();

      if (currentHunger > maxHunger) {
        // If hunger is over 100%, reset to 50%
        actor._hunger = maxHunger * 0.5;
        debug(`Actor ${actorId} vomited while overeating. Hunger reset to ${actor._hunger}/${maxHunger} (50%)`);
      } else {
        // If hunger is 100% or under, set to 0
        actor._hunger = 0;
        debug(`Actor ${actorId} vomited. Hunger set to 0`);
      }

      // Check for state changes and update overeating state
      actor.updateOvereatState();

      // Refresh menu if open
      if (SceneManager._scene instanceof Scene_Menu) {
        SceneManager._scene._hungerSleepStatusWindow.refresh();
      }

      // Add notification
      const lang = getCurrentLanguage();
      const message = lang === 'it'
        ? `${actor.name()} ha vomitato!`
        : `${actor.name()} vomited!`;
      $gameTemp.addHungerSleepNotification(message);
    } else {
      debug(`Actor ${actorId} not found.`);
    }
  });

  PluginManager.registerCommand(pluginName, "PassTime", function (args) {
    const hours = Number(args.hours || 0);
    const minutes = Number(args.minutes || 0);
    const totalMinutes = (hours * 60) + minutes;

    if (totalMinutes > 0) {
      const currentTime = getGameTimeMinutes();
      setGameTimeMinutes(currentTime + totalMinutes);
      updateGameDateVariable();

      const dateTime = getDateTimeFromMinutes(getGameTimeMinutes());
      debug(`Passed ${hours}h ${minutes}m. New time: ${dateTime.fullDate}`);
    }
  });

  PluginManager.registerCommand(pluginName, "FullRestore", function (args) {
    for (const actor of $gameParty.members()) {
      actor._hunger = maxHunger;
      actor._sleep = maxSleep;
      actor.updateOvereatState();
      debug(`FullRestore: ${actor.name()} hunger=${maxHunger}, sleep=${maxSleep}`);
    }

    if (SceneManager._scene instanceof Scene_Menu) {
      SceneManager._scene._hungerSleepStatusWindow.refresh();
    }
  });

  //=============================================================================
  // Game_Actor Extensions
  //=============================================================================

  const _Game_Actor_initialize = Game_Actor.prototype.initialize;
  Game_Actor.prototype.initialize = function (actorId) {
    _Game_Actor_initialize.call(this, actorId);
    this._hunger = maxHunger;
    this._sleep = maxSleep;
    this._prevHungerState = "normal";
    this._prevSleepState = "normal";
  };

  // Hunger Methods
  Game_Actor.prototype.hunger = function () {
    return this._hunger;
  };

  Game_Actor.prototype.hungerRate = function () {
    return this._hunger / maxHunger;
  };

  Game_Actor.prototype.hungerPercent = function () {
    return Math.floor(this.hungerRate() * 100);
  };

  Game_Actor.prototype.hungerState = function () {
    if (this.hungerRate() <= 0) return "starving";
    if (this.hungerRate() < 0.2) return "hungry";
    return "normal";
  };

  Game_Actor.prototype.addHunger = function (amount) {
    const wasAtZero = this._hunger <= 0;
    const oldState = this.hungerState();
    const wasAtMax = this._hunger >= maxHunger; // Check if already at 100%
  
    // New logic: cap at 100% unless already at 100%
    if (wasAtMax) {
      // If already at 100%, allow overeating
      this._hunger = Math.min(overeatMaxHunger, this._hunger + amount);
      debug(`Actor ${this._actorId} is overeating (was at ${maxHunger})`);
    } else {
      // If below 100%, cap at 100%
      const newHunger = this._hunger + amount;
      this._hunger = Math.min(maxHunger, newHunger);
      if (newHunger > maxHunger) {
        debug(`Actor ${this._actorId} hunger capped at ${maxHunger} (would have been ${newHunger.toFixed(2)})`);
      }
    }
    
    debug(
      `Actor ${this._actorId} hunger updated to ${
        this._hunger
      }/${maxHunger} (${this.hungerPercent()}%)`
    );
  
    // If hunger was at 0 and is now above 0, restore HP to max
    if (wasAtZero && this._hunger > 0) {
      const hpDifference = this.mhp - this.hp;
      if (hpDifference > 0) {
        this.setHp(this.mhp);
        debug(`Actor ${this._actorId} HP fully restored to ${this.mhp}`);
        $gameTemp.addHungerSleepNotification(
          `${this.name()} ${getText("hpRestored")}`
        );
      }
    }
  
    // Check for state changes
    this.checkStateChange("hunger", oldState);
    this.updateOvereatState(); // Check for overeating state
  };

  Game_Actor.prototype.reduceHunger = function (amount) {
    const oldState = this.hungerState();

    // Update hunger value
    this._hunger = Math.max(0, this._hunger - amount);

    // Check for state changes and apply effects
    this.checkStateChange("hunger", oldState);
    this.updateOvereatState(); // Check for overeating state
  };

  // Sleep Methods
  Game_Actor.prototype.sleep = function () {
    return this._sleep;
  };

  Game_Actor.prototype.sleepRate = function () {
    return this._sleep / maxSleep;
  };

  Game_Actor.prototype.sleepPercent = function () {
    return Math.floor(this.sleepRate() * 100);
  };

  Game_Actor.prototype.sleepState = function () {
    if (this.sleepRate() <= 0) return "exhausted";
    if (this.sleepRate() < 0.2) return "sleepy";
    return "normal";
  };

  Game_Actor.prototype.addSleep = function (amount) {
    const wasAtZero = this._sleep <= 0;
    const oldState = this.sleepState();
  
    // Update sleep value
    this._sleep = Math.min(maxSleep, this._sleep + amount);
    debug(
      `Actor ${this._actorId} sleep updated to ${
        this._sleep
      }/${maxSleep} (${this.sleepPercent()}%)`
    );
  
    // If sleep was at 0 and is now above 0, restore MP to max
    if (wasAtZero && this._sleep > 0) {
      const mpDifference = this.mmp - this.mp;
      if (mpDifference > 0) {
        this.setMp(this.mmp);
        debug(`Actor ${this._actorId} MP fully restored to ${this.mmp}`);
        $gameTemp.addHungerSleepNotification(
          `${this.name()} ${getText("mpRestored")}`
        );
      }
    }
  
    // Check for state changes
    this.checkStateChange("sleep", oldState);
  };

  Game_Actor.prototype.reduceSleep = function (amount) {
    const oldState = this.sleepState();

    // Update sleep value
    this._sleep = Math.max(0, this._sleep - amount);

    // Check for state changes and apply effects
    this.checkStateChange("sleep", oldState);
  };

  // New method for handling overeating state
  Game_Actor.prototype.updateOvereatState = function () {
    const overeatThreshold = maxHunger * 1.1; // 110%
    const normalThreshold = maxHunger; // 100%

    const isOvereating = this.isStateAffected(overeatStateId);

    if (this._hunger > overeatThreshold) {
        if (!isOvereating) {
            this.addState(overeatStateId);
            debug(`Actor ${this._actorId} is overeating. Applied state ${overeatStateId}.`);
        }
    } else if (this._hunger < normalThreshold) {
        if (isOvereating) {
            this.removeState(overeatStateId);
            debug(`Actor ${this._actorId} is no longer overeating. Removed state ${overeatStateId}.`);
        }
    }
  };

  // State Changes and Effects
  Game_Actor.prototype.checkStateChange = function (type, oldState) {
    let currentState;
    let prevState;

    if (type === "hunger") {
      currentState = this.hungerState();
      prevState = this._prevHungerState;
      this._prevHungerState = currentState;
    } else {
      currentState = this.sleepState();
      prevState = this._prevSleepState;
      this._prevSleepState = currentState;
    }

    // Only show message if state has changed
    if (currentState !== oldState) {
      let message = "";

      if (type === "hunger") {
        if (currentState === "hungry") {
          message = `${this.name()} ${getText("hungry")}`;
        } else if (currentState === "starving") {
          message = `${this.name()} ${getText("starving")}`;
        } else if (currentState === "normal" && prevState !== "normal") {
          message = `${this.name()} ${getText("noLongerHungry")}`;
        }
      } else {
        if (currentState === "sleepy") {
          message = `${this.name()} ${getText("sleepy")}`;
        } else if (currentState === "exhausted") {
          message = `${this.name()} ${getText("exhausted")}`;
        } else if (currentState === "normal" && prevState !== "normal") {
          message = `${this.name()} ${getText("noLongerSleepy")}`;
        }
      }

      if (message) {
        // Send notification
        $gameTemp.addHungerSleepNotification(message);
      }

      // Apply debuffs based on new state (placeholder implementation)
      if (type === "hunger") {
        this.applyHungerDebuffs(currentState);
      } else {
        this.applySleepDebuffs(currentState);
      }
    }
  };

  // Placeholder debuff methods - in a real plugin these would apply actual states/effects
  Game_Actor.prototype.applyHungerDebuffs = function (state) {
    debug(`Applied hunger debuffs for state: ${state}`);

    if (state === "hungry") {
      // Apply mild hunger debuffs
    } else if (state === "starving") {
      // Apply severe hunger debuffs
    } else {
      // Remove hunger debuffs
    }
  };

  Game_Actor.prototype.applySleepDebuffs = function (state) {
    debug(`Applied sleep debuffs for state: ${state}`);

    if (state === "sleepy") {
      // Apply mild sleep debuffs
    } else if (state === "exhausted") {
      // Apply severe sleep debuffs
    } else {
      // Remove sleep debuffs
    }
  };

  //=============================================================================
  // Game_Party Extensions
  //=============================================================================

  // Update hunger and sleep values when the player moves
  const _Game_Party_onPlayerWalk = Game_Party.prototype.onPlayerWalk;
  Game_Party.prototype.onPlayerWalk = function () {
    _Game_Party_onPlayerWalk.call(this);
    this.updateHungerAndSleep();
  };

Game_Party.prototype.updateHungerAndSleep = function () {
  // Maps where hunger/sleep should not deplete (prison, transport maps, etc.)
  const noDepletionMaps = [718, 719, 720, 327, 1094, 317, 1102];
  const mapId = $gameMap ? $gameMap.mapId() : 0;
  const isInRestZone = noDepletionMaps.includes(mapId);
  if (isInRestZone) {
    return; // Skip hunger and sleep updates in these maps
  }

  // Check if Shift key is pressed for speed boost
  const isShiftPressed = Input.isPressed("shift");
  const baseMultiplier = isShiftPressed ? shiftMultiplier : 1.0;

  // Check if on map 315 (world map) for special time/depletion rules
  const isOnWorldMap = $gameMap && $gameMap.mapId() === 315;

  const hungerRate = isOnWorldMap ? (maxHunger * 0.008) : hungerDecreaseRate;
  const sleepRate = isOnWorldMap ? (maxSleep * 0.02) : sleepDecreaseRate;

  // Update game time based on map
  const currentTime = getGameTimeMinutes();
  if (isOnWorldMap) {
    // On world map, time passes quickly with each step
    const isInVehicle = $gamePlayer && ($gamePlayer.isInBoat() || $gamePlayer.isInShip() || $gamePlayer.isInAirship());
    const minutesToAdd = isInVehicle ? 2 : 10; // 5 minutes for vehicles, 15 for walking
    setGameTimeMinutes(currentTime + minutesToAdd);
  } else {
    // On all other maps, time advances by 1 minute every 10 steps.
    if ($gameParty.steps() % 10 === 0) {
        setGameTimeMinutes(currentTime + 1);
    }
  }
  updateGameDateVariable();

  // ONLY process actor 1 for hunger/sleep management
  const actor = $gameActors.actor(1);
  if (actor) {
    // Overeating logic: increase hunger depletion if over 100%
    let hungerMultiplier = baseMultiplier;
    if (actor.hunger() > maxHunger) {
      hungerMultiplier *= overeatDepletionMultiplier;
    }

    actor.reduceHunger(hungerRate * hungerMultiplier);
    actor.reduceSleep(sleepRate * baseMultiplier);

    // Drain HP if hunger is at 0
    if (actor.hunger() <= 0 && actor.hp > 0) {
      const hpDrain = Math.ceil(actor.mhp * 0.01); // 1% of max HP per step
      const newHp = Math.max(0, actor.hp - hpDrain);
      actor.setHp(newHp);

      debug(`Actor ${actor._actorId} HP drained: ${hpDrain} (${actor.hp}/${actor.mhp})`);

      // Show notification when HP reaches 0
      if (actor.hp === 0) {
        const lang = getCurrentLanguage();
        const message = lang === 'it'
          ? `${actor.name()} è collassato per la fame!`
          : `${actor.name()} collapsed from starvation!`;
        $gameTemp.addHungerSleepNotification(message);
      }
    }

    // Drain MP if sleep is at 0
    if (actor.sleep() <= 0 && actor.mp > 0) {
      const mpDrain = Math.ceil(actor.mmp * 0.01); // 1% of max MP per step
      const newMp = Math.max(0, actor.mp - mpDrain);
      actor.setMp(newMp);

      debug(`Actor ${actor._actorId} MP drained: ${mpDrain} (${actor.mp}/${actor.mmp})`);

      // Show notification when MP reaches 0
      if (actor.mp === 0) {
        const lang = getCurrentLanguage();
        const message = lang === 'it'
          ? `${actor.name()} ha esaurito i PM!`
          : `${actor.name()} ran out of MP!`;
        $gameTemp.addHungerSleepNotification(message);
      }
    }
  }

  // Keep actors 2 and 3 at 100% hunger and sleep
  for (let i = 2; i <= 3; i++) {
    const otherActor = $gameActors.actor(i);
    if (otherActor) {
      otherActor._hunger = maxHunger;
      otherActor._sleep = maxSleep;
    }
  }
};

  //=============================================================================
  // Game_Player Extensions - Seat System
  //=============================================================================

  const _Game_Player_initialize = Game_Player.prototype.initialize;
  Game_Player.prototype.initialize = function () {
    _Game_Player_initialize.call(this);
    this._isSeat = false;
    this._seatFrameCounter = 0;
  };

  Game_Player.prototype.setSeat = function (seated) {
    this._isSeat = seated;
    this._seatFrameCounter = 0;
    debug(`Seat state changed to: ${seated}`);
  };

  Game_Player.prototype.isSeat = function () {
    return this._isSeat;
  };

  // Override movement methods to prevent tile movement while allowing direction changes
  const _Game_Player_moveStraight = Game_Player.prototype.moveStraight;
  Game_Player.prototype.moveStraight = function (d) {
    if (this._isSeat) {
      // Allow direction change but prevent actual movement
      this.setDirection(d);
      return;
    }
    return _Game_Player_moveStraight.call(this, d);
  };

  const _Game_Player_moveDiagonally = Game_Player.prototype.moveDiagonally;
  Game_Player.prototype.moveDiagonally = function (horz, vert) {
    if (this._isSeat) {
      // Allow direction change but prevent actual movement
      // Determine direction from horizontal and vertical inputs
      if (horz !== 0 || vert !== 0) {
        const d = this.getDiagonalDirection(horz, vert);
        if (d > 0) {
          this.setDirection(d);
        }
      }
      return;
    }
    return _Game_Player_moveDiagonally.call(this, horz, vert);
  };

  // Override update to handle seat sleep recovery
  const _Game_Player_update = Game_Player.prototype.update;
  Game_Player.prototype.update = function (sceneActive) {
    _Game_Player_update.call(this, sceneActive);

    // Handle seat sleep recovery (0.5% per second = 0.5% per 60 frames)
    if (this._isSeat) {
      this._seatFrameCounter++;
      if (this._seatFrameCounter >= 60) {
        this._seatFrameCounter = 0;
        // Recover 0.5% of sleep for actor 1 only
        const sleepRecovery = maxSleep * 0.005; // 0.5% of max sleep
        const actor = $gameActors.actor(1);
        if (actor) {
          actor.addSleep(sleepRecovery);
          debug(`Sleep recovery applied: ${sleepRecovery.toFixed(2)} for actor 1`);
        }
      }
    }
  };
  //=============================================================================
  // Time and Temperature Window
  //=============================================================================

  function Window_TimeTemperature() {
    this.initialize(...arguments);
  }

  Window_TimeTemperature.prototype = Object.create(Window_Base.prototype);
  Window_TimeTemperature.prototype.constructor = Window_TimeTemperature;

  Window_TimeTemperature.prototype.initialize = function (rect) {
    Window_Base.prototype.initialize.call(this, rect);
    this.refresh();
    this._refreshTimer = 0;
  };

  Window_TimeTemperature.prototype.update = function () {
    Window_Base.prototype.update.call(this);

    // Refresh every second (60 frames)
    this._refreshTimer++;
    if (this._refreshTimer >= 60) {
      this._refreshTimer = 0;
      this.refresh();
    }
  };

  Window_TimeTemperature.prototype.refresh = function () {
    if (!this.contents) return;

    this.contents.clear();
    this.drawTimeAndTemperature();
  };

  Window_TimeTemperature.prototype.drawTimeAndTemperature = function () {
    const y = 0;

    // Get time and date - check if a daylight mode is forced
    let timeString;
    let dateString = "01/01/01";

      // Full cycle mode - show game time (from system clock)
      const gameMinutes = getGameTimeMinutes();
      const dateTime = getDateTimeFromMinutes(gameMinutes);
      timeString = dateTime.time24;
      dateString = dateTime.dateShort;

    // Get temperature from variable
    const weatherName = window.weatherName || "Clear";
    const temperature = $gameVariables.value(temperatureVariable) || 20;
    const tempString = `${weatherName} ${temperature}°C`;

    // Draw date and time with icon (left side)
    this.resetTextColor();
    this.drawText(`${timeString}`, 36, y, 120);

    // Draw temperature with icon (right side) - increased spacing
    const tempX = 120;

    // Color code temperature
    let tempColor = 0; // White by default
    if (temperature <= 0) {
      tempColor = 4; // Blue for freezing
    } else if (temperature < 10) {
      tempColor = 4; // Blue for cold
    } else if (temperature >= 35) {
      tempColor = 2; // Red for very hot
    } else if (temperature >= 25) {
      tempColor = 14; // Yellow for warm
    }

    this.changeTextColor(ColorManager.textColor(tempColor));
    this.drawText(tempString, tempX + 36, y, 100);
  };

  //=============================================================================
  // Main Menu Display - Add hunger and sleep status
  //=============================================================================

  // Create a new window for hunger and sleep status
  function Window_HungerSleepStatus() {
    this.initialize(...arguments);
  }

  Window_HungerSleepStatus.prototype = Object.create(Window_Base.prototype);
  Window_HungerSleepStatus.prototype.constructor = Window_HungerSleepStatus;

  Window_HungerSleepStatus.prototype.initialize = function (rect) {
    Window_Base.prototype.initialize.call(this, rect);
    this.refresh();
  };

  Window_HungerSleepStatus.prototype.refresh = function () {
    if (!this.contents) return;

    this.contents.clear();
    this.drawHungerSleepStatus();
  };

  Window_HungerSleepStatus.prototype.drawHungerSleepStatus = function () {
    const lineHeight = this.lineHeight();
    let y = 0;

    // ONLY show actor 1
    const actor = $gameActors.actor(1);
    if (!actor) return;

    // Column positions - spread across full window width
    const totalWidth = this.contents.width;
    const nameWidth = 100;
    const hpWidth = 80;
    const mpWidth = 80;
    const statusWidth = 120;
    const hungerWidth = 80; // Increased to accommodate icon + text
    const sleepWidth = 80; // Increased to accommodate icon + text

    // Calculate remaining space and distribute it
    const usedWidth =
      nameWidth + hpWidth + mpWidth + statusWidth + hungerWidth + sleepWidth;
    const remainingWidth = totalWidth - usedWidth;
    const padding = Math.max(10, remainingWidth / 6); // Distribute remaining space as padding

    const hpX = nameWidth + padding;
    const mpX = hpX + hpWidth + padding;
    const statusX = mpX + mpWidth + padding;
    const hungerX = statusX + statusWidth + padding;
    const sleepX = hungerX + hungerWidth + padding;

    const x = 0;

    // Draw actor name
    this.resetTextColor();
    this.drawText(actor.name(), x, y, nameWidth);

    // Draw HP with color coding (current number only) - translated label
    const hpPercent = Math.floor((actor.hp / actor.mhp) * 100);
    let hpColor = hpPercent <= 25 ? 2 : hpPercent < 50 ? 14 : 3;
    this.changeTextColor(ColorManager.textColor(hpColor));
    this.drawText(`${getText("hp")}:${actor.hp}`, hpX, y, hpWidth);

    // Draw MP with color coding (current number only) - translated label
    const mpPercent = Math.floor((actor.mp / actor.mmp) * 100);
    let mpColor = mpPercent <= 25 ? 2 : mpPercent < 50 ? 14 : 4;
    this.changeTextColor(ColorManager.textColor(mpColor));
    this.drawText(`${getText("mp")}:${actor.mp}`, mpX, y, mpWidth);

    // Get first status effect
    const firstState = actor.states().length > 0 ? actor.states()[0] : null;
    const statusText = firstState ? firstState.name : "";
    this.resetTextColor();
    if (firstState && firstState.iconIndex > 0) {
      // Draw status icon if available
      this.drawIcon(firstState.iconIndex, statusX, y);
      this.drawText(
        statusText.substring(0, 10),
        statusX + 32,
        y,
        statusWidth - 32
      );
    } else {
      this.drawText(statusText.substring(0, 12), statusX, y, statusWidth);
    }

    // Draw hunger with icon and color coding
    const hungerPercent = actor.hungerPercent();
    let hungerColor = hungerPercent > 100 ? 21 : (hungerPercent <= 0 ? 2 : hungerPercent < 20 ? 14 : 3); // Magenta for > 100
    this.changeTextColor(ColorManager.textColor(hungerColor));
    this.drawIcon(hungerIcon, hungerX, y);
    this.drawText(`${hungerPercent}%`, hungerX + 32, y, hungerWidth - 32);

    // Draw sleep with icon and color coding
    const sleepPercent = actor.sleepPercent();
    let sleepColor = sleepPercent <= 0 ? 2 : sleepPercent < 20 ? 14 : 4;
    this.changeTextColor(ColorManager.textColor(sleepColor));
    this.drawIcon(sleepIcon, sleepX, y);
    this.drawText(`${sleepPercent}%`, sleepX + 32, y, sleepWidth - 32);
  };

  // Add the hunger/sleep window to the menu scene
  const _Scene_Menu_create = Scene_Menu.prototype.create;
  Scene_Menu.prototype.create = function () {
    _Scene_Menu_create.call(this);
    this.createHungerSleepStatusWindow();
    this.createTimeTemperatureWindow();
    this.createBountyWindow(); // NEW LINE
  };
  // Add new method to Scene_Menu
  Scene_Menu.prototype.createBountyWindow = function () {
    const rect = this.bountyWindowRect();
    this._bountyWindow = new Window_Bounty(rect);
    this.addWindow(this._bountyWindow);
  };

  // Add new method to Scene_Menu
  Scene_Menu.prototype.bountyWindowRect = function () {
    const goldRect = this.goldWindowRect();
    const timeRect = this.timeTemperatureWindowRect();
    const ww = timeRect.x; // Extend to just before time window with small gap
    const wh = goldRect.height; // Match gold window height exactly
    const wx = 0; // Bottom left corner
    const wy = goldRect.y; // Same Y position as gold window
    return new Rectangle(wx, wy, ww, wh);
  };
  Scene_Menu.prototype.createHungerSleepStatusWindow = function () {
    const rect = this.hungerSleepStatusWindowRect();
    this._hungerSleepStatusWindow = new Window_HungerSleepStatus(rect);
    this.addWindow(this._hungerSleepStatusWindow);
  };

  Scene_Menu.prototype.createTimeTemperatureWindow = function () {
    const rect = this.timeTemperatureWindowRect();
    this._timeTemperatureWindow = new Window_TimeTemperature(rect);
    this.addWindow(this._timeTemperatureWindow);
  };

  Scene_Menu.prototype.hungerSleepStatusWindowRect = function () {
    // Full screen width window - only showing actor 1
    const goldRect = this.goldWindowRect();
    const ww = Graphics.boxWidth; // Full screen width
    const wh = this.calcWindowHeight(1, false); // Always 1 line for actor 1 only
    const wx = 0; // Start from left edge
    const wy = goldRect.y - wh; // Position above the gold window
    return new Rectangle(wx, wy, ww, wh);
  };

  Scene_Menu.prototype.timeTemperatureWindowRect = function () {
    // Much larger window to accommodate horizontal layout with more spacing
    const goldRect = this.goldWindowRect();
    const ww = 350; // Increased width from 200 to 350 for larger container
    const wh = this.calcWindowHeight(1, false) + 8; // Height for 1 line only
    const wx = goldRect.x - ww; // Position to the left of gold window
    const wy = goldRect.y; // Same Y position as gold window
    return new Rectangle(wx, wy, ww, wh);
  };
  //=============================================================================
  // Game_Temp Extensions for Notifications
  //=============================================================================

  const _Game_Temp_initialize = Game_Temp.prototype.initialize;
  Game_Temp.prototype.initialize = function () {
    _Game_Temp_initialize.call(this);
    this._hungerSleepNotifications = [];
    this._notificationTimer = 0;
  };

  Game_Temp.prototype.addHungerSleepNotification = function (text) {
    this._hungerSleepNotifications.push({
      text: text,
      duration: 120, // Display for 120 frames (2 seconds)
    });
  };

  Game_Temp.prototype.updateNotifications = function () {
    if (this._hungerSleepNotifications.length > 0) {
      if (this._notificationTimer <= 0) {
        this._notificationTimer = this._hungerSleepNotifications[0].duration;
      } else {
        this._notificationTimer--;
        if (this._notificationTimer <= 0) {
          this._hungerSleepNotifications.shift();
        }
      }
    }
  };

  Game_Temp.prototype.getCurrentNotification = function () {
    return this._hungerSleepNotifications.length > 0
      ? this._hungerSleepNotifications[0].text
      : null;
  };

  //=============================================================================
  // Window_HungerSleepNotification
  //=============================================================================

  function Window_HungerSleepNotification() {
    this.initialize(...arguments);
  }

  Window_HungerSleepNotification.prototype = Object.create(
    Window_Base.prototype
  );
  Window_HungerSleepNotification.prototype.constructor =
    Window_HungerSleepNotification;

  Window_HungerSleepNotification.prototype.initialize = function () {
    const width = 300;
    const height = this.fittingHeight(1);
    const x = 10; // Top left position
    const y = 10;
    Window_Base.prototype.initialize.call(
      this,
      new Rectangle(x, y, width, height)
    );
    this.opacity = 200; // Slightly transparent
    this.visible = false;
    this._lastNotification = null;
  };

  Window_HungerSleepNotification.prototype.update = function () {
    Window_Base.prototype.update.call(this);

    const notification = $gameTemp.getCurrentNotification();
    if (notification !== this._lastNotification) {
      this._lastNotification = notification;
      this.refresh();
    }

    this.visible = !!notification;
  };

  Window_HungerSleepNotification.prototype.refresh = function () {
    this.contents.clear();

    if (this._lastNotification) {
      // Set text color based on severity - works with Italian text too
      if (
        this._lastNotification.includes(getText("starving").replace("!", "")) ||
        this._lastNotification.includes(getText("exhausted").replace("!", ""))
      ) {
        this.changeTextColor(ColorManager.textColor(2)); // Red color
      } else if (
        this._lastNotification.includes(getText("hungry")) ||
        this._lastNotification.includes(getText("sleepy"))
      ) {
        this.changeTextColor(ColorManager.textColor(14)); // Yellow color
      } else {
        this.resetTextColor();
      }

      this.drawText(this._lastNotification, 0, 0, this.contents.width, "left");
    }
  };

  //=============================================================================
  // Scene_Map Extensions for Notifications
  //=============================================================================

  const _Scene_Map_createAllWindows = Scene_Map.prototype.createAllWindows;
  Scene_Map.prototype.createAllWindows = function () {
    _Scene_Map_createAllWindows.call(this);
    this.createHungerSleepNotificationWindow();
  };

  Scene_Map.prototype.createHungerSleepNotificationWindow = function () {
    this._hungerSleepNotificationWindow = new Window_HungerSleepNotification();
    this.addWindow(this._hungerSleepNotificationWindow);
  };

  const _Scene_Map_update = Scene_Map.prototype.update;
  Scene_Map.prototype.update = function () {
    _Scene_Map_update.call(this);
    $gameTemp.updateNotifications();
  };

  function Window_Bounty() {
    this.initialize(...arguments);
  }

  Window_Bounty.prototype = Object.create(Window_Base.prototype);
  Window_Bounty.prototype.constructor = Window_Bounty;

  Window_Bounty.prototype.initialize = function (rect) {
    Window_Base.prototype.initialize.call(this, rect);
    this.refresh();
    this._refreshTimer = 0;
    this._cycleTimer = 0;
    this._showBounty = true; // Toggle between bounty and date
  };

  Window_Bounty.prototype.update = function () {
    Window_Base.prototype.update.call(this);

    // Refresh every 30 frames
    this._refreshTimer++;
    if (this._refreshTimer >= 30) {
      this._refreshTimer = 0;
      this.refresh();
    }

    // Handle cycling between bounty and date every 2 seconds (120 frames)
    const bountyValue = $gameVariables.value(66) || 0;
    if (bountyValue > 0) {
      this._cycleTimer++;
      if (this._cycleTimer >= 120) {
        this._cycleTimer = 0;
        this._showBounty = !this._showBounty;
      }
    }
  };

  Window_Bounty.prototype.refresh = function () {
    if (!this.contents) return;

    this.contents.clear();
    this.drawBounty();
  };

  Window_Bounty.prototype.drawBounty = function () {
    const bountyValue = $gameVariables.value(66) || 0;
    const minutes = getGameTimeMinutes();
    const dateTime = getDateTimeFromMinutes(minutes);

    if (bountyValue === 0) {
      // No bounty: show date in dd/mm/yy format
      this.resetTextColor();
      this.drawText(dateTime.dateShort, 0, 0, this.contents.width, "left");
    } else {
      // Has bounty: cycle between bounty and date
      if (this._showBounty) {
        const euroValue = (bountyValue / 100).toFixed(2);
        const bountyText = `${euroValue}€`;
        this.changeTextColor(ColorManager.textColor(2)); // Red color for bounty
        this.drawText(bountyText, 0, 0, this.contents.width, "left");
      } else {
        this.resetTextColor();
        this.drawText(dateTime.dateShort, 0, 0, this.contents.width, "left");
      }
    }
  };
  //=============================================================================
  // Data Loading/Saving
  //=============================================================================

  const _DataManager_extractSaveContents = DataManager.extractSaveContents;
  DataManager.extractSaveContents = function (contents) {
    _DataManager_extractSaveContents.call(this, contents);

    // Initialize hunger/sleep system after loading if needed
    $gameParty.members().forEach((actor) => {
      if (actor._hunger === undefined) {
        actor._hunger = maxHunger;
      }
      if (actor._sleep === undefined) {
        actor._sleep = maxSleep;
      }
      if (actor._prevHungerState === undefined) {
        actor._prevHungerState = "normal";
      }
      if (actor._prevSleepState === undefined) {
        actor._prevSleepState = "normal";
      }
    });

    // Initialize game time if not set (game load)
    if ($gameVariables.value(gameTimeVariable) === undefined) {
      $gameVariables.setValue(gameTimeVariable, 0); // Start at 0 minutes elapsed (8 AM on Jan 1, 2001)
      updateGameDateVariable();
      debug("Game time initialized to 01 JAN 2001 12:00 after load");
    }
  };

  //=============================================================================
  // Window_HungerSleepOverlay - Display overlay on maps 315 and 636
  //=============================================================================
  function Window_HungerSleepOverlay() {
    this.initialize(...arguments);
  }

  Window_HungerSleepOverlay.prototype = Object.create(Window_Base.prototype);
  Window_HungerSleepOverlay.prototype.constructor = Window_HungerSleepOverlay;

  Window_HungerSleepOverlay.prototype.initialize = function () {
    const width = 300;
    const mapId = $gameMap ? $gameMap.mapId() : 0;
    const isOnWorldMap = mapId === 315;
    const noDepletionMaps = [718, 719, 720, 327, 1094, 317, 1102];
    const isInRestZone = noDepletionMaps.includes(mapId);

    // Map 315 needs 3 lines (Date/Time + Biome + Hunger), Rest zones need 2 lines (Date + Time), others need 1 line
    const height = isOnWorldMap ? this.fittingHeight(3) : (isInRestZone ? this.fittingHeight(2) : this.fittingHeight(1));

    const x = Graphics.boxWidth - width - 10; // Bottom right position
    const y = Graphics.boxHeight - height - 10;
    Window_Base.prototype.initialize.call(
      this,
      new Rectangle(x, y, width, height)
    );
    this.opacity = 180; // Slightly transparent
    this._refreshTimer = 0;
    // Cache last values to show on map load
    this._cachedHungerPercent = 100;
    this._cachedSleepPercent = 100;
    // Track player coordinates for biome change detection (on map 315)
    this._lastPlayerX = $gamePlayer ? $gamePlayer.x : 0;
    this._lastPlayerY = $gamePlayer ? $gamePlayer.y : 0;
    // Refresh immediately on initialization
    this.refresh();
  };

  Window_HungerSleepOverlay.prototype.update = function () {
    Window_Base.prototype.update.call(this);

    // Check if player coordinates changed (on map 315)
    const mapId = $gameMap ? $gameMap.mapId() : 0;
    if (mapId === 315 && $gamePlayer) {
      const currentPlayerX = $gamePlayer.x;
      const currentPlayerY = $gamePlayer.y;
      if (currentPlayerX !== this._lastPlayerX || currentPlayerY !== this._lastPlayerY) {
        this._lastPlayerX = currentPlayerX;
        this._lastPlayerY = currentPlayerY;
        this.refresh(); // Refresh immediately on coordinate change
        return;
      }
    }

    // Refresh every 30 frames for performance (hunger/sleep/time updates)
    this._refreshTimer++;
    if (this._refreshTimer >= 30) {
      this._refreshTimer = 0;
      this.refresh();
    }
  };

  Window_HungerSleepOverlay.prototype.refresh = function () {
    this.contents.clear();
    this.drawHungerSleepOverlay();
  };

  Window_HungerSleepOverlay.prototype.drawHungerSleepOverlay = function () {
    const actor = $gameActors.actor(1); // Player 1 (Actor 1)
    const mapId = $gameMap ? $gameMap.mapId() : 0;
    const isOnWorldMap = mapId === 315;
    const noDepletionMaps = [718, 719, 720, 327, 1094, 317, 1102];
    const isInRestZone = noDepletionMaps.includes(mapId);

    // --- REST ZONE LOGIC (Prison, Transport maps, etc.) ---
    // If in rest zone, draw date on first line and time on second line
    if (isInRestZone) {
        const minutes = getGameTimeMinutes();
        const dateTime = getDateTimeFromMinutes(minutes);
        const dateStr = `${dateTime.dateShort}`;
        const timeStr = dateTime.time24;

        // Draw date on first line
        this.resetTextColor();
        this.drawIcon(timeIcon, 0, 0);
        this.drawText(dateStr, 32, 0, 250);

        // Draw time on second line
        this.resetTextColor();
        this.drawIcon(timeIcon, 0, this.lineHeight());
        this.drawText(timeStr, 32, this.lineHeight(), 250);
        return; // STOP HERE: Do not draw hunger or sleep
    }

    // --- STANDARD LOGIC ---
    let hungerPercent, sleepPercent;

    if (actor) {
      // Get current values and cache them
      hungerPercent = actor.hungerPercent();
      sleepPercent = actor.sleepPercent();
      this._cachedHungerPercent = hungerPercent;
      this._cachedSleepPercent = sleepPercent;
    } else {
      // Use cached values if actor not available
      hungerPercent = this._cachedHungerPercent;
      sleepPercent = this._cachedSleepPercent;
    }

    // Draw date and time first on map 315
    let hungerY = 0;
    if (isOnWorldMap) {
      const minutes = getGameTimeMinutes();
      const dateTime = getDateTimeFromMinutes(minutes);
      const timeY = 0;
      const dateTimeStr = `${dateTime.dateShort} ${dateTime.time24}`;

      this.resetTextColor();
      this.drawIcon(timeIcon, 0, timeY);
      this.drawText(dateTimeStr, 32, timeY, 250);

      // Draw biome name on second line (get from cache using player coordinates on map 315)
      const biomeY = this.lineHeight();
      let biomeName = "Unknown";
      let locationName = null;

      // Check if player is at a hardcoded biome location
      if ($gamePlayer && window.WorldGen && window.WorldGen.HARDCODED_BIOME_NAMES) {
        const playerX = $gamePlayer.x;
        const playerY = $gamePlayer.y;
        const coordKey = `${playerX},${playerY}`;

        locationName = window.WorldGen.HARDCODED_BIOME_NAMES[coordKey];
      }

      // If no hardcoded location found, get biome name
      if (!locationName) {
        // Try to get biome from player's current tile coordinates on map 315
        if ($gameSystem && $gameSystem.getBiomeFromCache && $gamePlayer) {
          const playerX = $gamePlayer.x;
          const playerY = $gamePlayer.y;
          const biomeLookup = $gameSystem.getBiomeFromCache(playerX, playerY);
          if (biomeLookup && biomeLookup !== "Unknown") {
            biomeName = biomeLookup;
          }
        }

        // Fallback to procedural data if cache lookup fails
        if (biomeName === "Unknown" && $gameSystem && $gameSystem._procGenData && $gameSystem._procGenData.currentBiome) {
          biomeName = $gameSystem._procGenData.currentBiome;
        }

        // Simplify road biome names to just "Road"
        if (biomeName.startsWith("Road ")) {
          biomeName = "Road";
        }
      }

      // Display location name if found, otherwise show biome name
      this.resetTextColor();
      this.drawText(locationName || biomeName, 0, biomeY, 250);

      hungerY = this.lineHeight() * 2;
    }

    const y = hungerY;

    // Draw hunger
    let hungerColor = hungerPercent > 100 ? 21 : (hungerPercent <= 0 ? 2 : hungerPercent < 20 ? 14 : 3);
    this.changeTextColor(ColorManager.textColor(hungerColor));
    this.drawIcon(hungerIcon, 0, y);
    this.drawText(`${hungerPercent}%`, 32, y, 80);

    // Draw sleep (on same line, offset to the right)
    let sleepColor = sleepPercent <= 0 ? 2 : sleepPercent < 20 ? 14 : 4;
    this.changeTextColor(ColorManager.textColor(sleepColor));
    this.drawIcon(sleepIcon, 140, y);
    this.drawText(`${sleepPercent}%`, 172, y, 80);
  };

  // Add overlay to Scene_Map only on maps 315, 636 AND 1102
  const _Scene_Map_createAllWindows_Overlay = Scene_Map.prototype.createAllWindows;
  Scene_Map.prototype.createAllWindows = function () {
    _Scene_Map_createAllWindows_Overlay.call(this);
    this.createHungerSleepOverlay();
  };

  Scene_Map.prototype.createHungerSleepOverlay = function () {
    const mapId = $gameMap.mapId();
    const noDepletionMaps = [718, 719, 720, 327, 1094, 317, 1102];
    // Show overlay on world map (315), safe zones (636), or rest zones
    if (mapId === 315 || noDepletionMaps.includes(mapId)) {
      this._hungerSleepOverlay = new Window_HungerSleepOverlay();
      this.addWindow(this._hungerSleepOverlay);
    }
  };

  // Expose globals for use by other plugins
  window.TimeDateSystem = window.TimeDateSystem || {};
  window.TimeDateSystem.maxHunger = maxHunger;
  window.TimeDateSystem.maxSleep = maxSleep;

  //=============================================================================
  // Game Initialization - Ensure time system is ready
  //=============================================================================

  const _DataManager_createGameObjects = DataManager.createGameObjects;
  DataManager.createGameObjects = function () {
    _DataManager_createGameObjects.call(this);

    // Initialize game time on new game (Variable 114 stores total minutes elapsed)
    if ($gameVariables.value(gameTimeVariable) === undefined) {
      $gameVariables.setValue(gameTimeVariable, 0); // Start at 0 minutes elapsed (8 AM on Jan 1, 2001)
      updateGameDateVariable();
      debug("Game time initialized to 01 JAN 2001 12:00 - normal maps increment by real minutes, map 315 increments by 15 per step");
    }
  };
})();

/*:
 * @plugindesc Vehicle Repair System - Maintenance and damage tracking for Camper and Car
 * @author Omni-Lex
 * @target MZ
 *
 * @param CriticalParts
 * @desc List of critical parts that disable vehicle when broken
 * @type string[]
 * @default ["Engine","Transmission","Brakes","Steering"]
 *
 * @param DamagePerHit
 * @desc Percentage of damage applied with damage command
 * @type number
 * @min 1
 * @max 100
 * @default 15
 *
 * @param RepairAmountPartial
 * @desc Percentage repaired with partial repair
 * @type number
 * @min 1
 * @max 100
 * @default 15
 *
 * @command camperMaintenance
 * @text Camper Maintenance
 * @desc Opens the maintenance window for the Camper
 *
 * @command carMaintenance
 * @text Car Maintenance
 * @desc Opens the maintenance window for the Car
 *
 * @command airshipMaintenance
 * @text Airship Maintenance
 * @desc Opens the maintenance window for the Airship
 *
 * @command damageCamper
 * @text Damage Camper
 * @desc Applies 15% damage to random parts of the Camper
 *
 * @command damageCar
 * @text Damage Car
 * @desc Applies 15% damage to random parts of the Car
 *
 * @command damageAirship
 * @text Damage Airship
 * @desc Applies 15% damage to random parts of the Airship
 *
 * @command repairCamper
 * @text Repair Camper
 * @desc Repairs the Camper
 * @arg amount
 * @type select
 * @option Partial (15%)
 * @value partial
 * @option Full (100%)
 * @value full
 * @default partial
 *
 * @command repairCar
 * @text Repair Car
 * @desc Repairs the Car
 * @arg amount
 * @type select
 * @option Partial (15%)
 * @value partial
 * @option Full (100%)
 * @value full
 * @default partial
 *
 * @command repairAirship
 * @text Repair Airship
 * @desc Repairs the Airship
 * @arg amount
 * @type select
 * @option Partial (15%)
 * @value partial
 * @option Full (100%)
 * @value full
 * @default partial
 *
 * @help
 * CamperVehicleRepair.js
 *
 * This plugin manages vehicle part health and maintenance for both
 * the Camper (Ship) and Car (Boat) vehicles.
 *
 * Vehicle Parts System:
 * - Each vehicle has multiple parts with individual health percentages
 * - Critical parts (Engine, Transmission, Brakes, Steering) disable 
 *   the vehicle when broken
 * - Non-critical parts affect performance but don't disable the vehicle
 *
 * Variables Used:
 * - Uses same variable structure as CamperVehicle.js
 * - Camper: Variables 63-67
 * - Car: Variables 69-72
 * - window.brokenCamper: Set when critical parts are broken
 * - window.brokenCar: Set when critical parts are broken
 *
 * Maintenance Window:
 * - Shows vehicle image on the left
 * - Lists all parts with health percentages on the right
 * - Color coding: Green (70%+), Yellow (30-69%), Red (<30%)
 */

(() => {
  "use strict";

  const pluginName = "CamperVehicleRepair";
  const parameters = PluginManager.parameters(pluginName);
  
  const criticalParts = JSON.parse(parameters["CriticalParts"] || '["Engine","Transmission","Brakes","Steering"]');
  const damagePerHit = Number(parameters["DamagePerHit"] || 15);
  const repairAmountPartial = Number(parameters["RepairAmountPartial"] || 15);

  // Vehicle parts configuration
  const vehicleParts = {
    "Engine": { critical: true, maxHealth: 100 },
    "Transmission": { critical: true, maxHealth: 100 },
    "Brakes": { critical: true, maxHealth: 100 },
    "Steering": { critical: true, maxHealth: 100 },
    "Battery": { critical: false, maxHealth: 100 },
    "Alternator": { critical: false, maxHealth: 100 },
    "Radiator": { critical: false, maxHealth: 100 },
    "Fuel System": { critical: false, maxHealth: 100 },
    "Exhaust": { critical: false, maxHealth: 100 },
    "Suspension": { critical: false, maxHealth: 100 },
    "Tires": { critical: false, maxHealth: 100 },
    "Body": { critical: false, maxHealth: 100 },
    "Interior": { critical: false, maxHealth: 100 },
    "Electronics": { critical: false, maxHealth: 100 },
    "Air Filter": { critical: false, maxHealth: 100 },
    "Oil System": { critical: false, maxHealth: 100 }
  };

  // Initialize window variables if they don't exist
  if (typeof window.brokenCamper === 'undefined') {
    window.brokenCamper = false;
  }
  if (typeof window.brokenCar === 'undefined') {
    window.brokenCar = false;
  }
  if (typeof window.brokenAirship === 'undefined') {
    window.brokenAirship = false;
  }

  //=============================================================================
  // Helper Functions
  //=============================================================================

  function ensureGameSystemExists() {
    if (!$gameSystem) {
      console.warn("CamperVehicleRepair: $gameSystem not ready, delaying initialization");
      return false;
    }
    return true;
  }

  function getVehicleHealth(vehicleType) {
    if (!ensureGameSystemExists()) {
      return null;
    }
    
    if (!$gameSystem._vehicleHealth) {
      initializeVehicleHealth();
    }
    return $gameSystem._vehicleHealth[vehicleType];
  }

  function initializeVehicleHealth() {
    if (!ensureGameSystemExists()) {
      return;
    }

    $gameSystem._vehicleHealth = {
      camper: {},
      car: {},
      airship: {}
    };

    for (const part in vehicleParts) {
      $gameSystem._vehicleHealth.camper[part] = 100;
      $gameSystem._vehicleHealth.car[part] = 100;
      $gameSystem._vehicleHealth.airship[part] = 100;
    }
  }

  function checkCriticalParts(vehicleType) {
    const health = getVehicleHealth(vehicleType);
    if (!health) return false;
    
    for (const part of criticalParts) {
      if (health[part] <= 0) {
        return true; // Vehicle is broken
      }
    }
    return false; // Vehicle is functional
  }

  function updateVehicleStatus(vehicleType) {
    const isBroken = checkCriticalParts(vehicleType);

    if (vehicleType === "camper") {
      window.brokenCamper = isBroken;
    } else if (vehicleType === "car") {
      window.brokenCar = isBroken;
    } else if (vehicleType === "airship") {
      window.brokenAirship = isBroken;
    }
  }

  function applyDamage(vehicleType, damagePercent) {
    const health = getVehicleHealth(vehicleType);
    if (!health) return;
    
    const partNames = Object.keys(vehicleParts);
    
    // Randomly select parts to damage
    const numPartsToDamage = Math.floor(Math.random() * 5) + 3; // 3-7 parts
    const partsToDamage = [];
    
    while (partsToDamage.length < numPartsToDamage && partsToDamage.length < partNames.length) {
      const randomPart = partNames[Math.floor(Math.random() * partNames.length)];
      if (!partsToDamage.includes(randomPart)) {
        partsToDamage.push(randomPart);
      }
    }
    
    // Apply damage to selected parts
    for (const part of partsToDamage) {
      const currentHealth = health[part] || 100;
      const damage = (vehicleParts[part].maxHealth * damagePercent) / 100;
      health[part] = Math.max(0, currentHealth - damage);
    }
    
    updateVehicleStatus(vehicleType);
  }

  function repairVehicle(vehicleType, repairPercent) {
    const health = getVehicleHealth(vehicleType);
    if (!health) return;
    
    for (const part in vehicleParts) {
      const currentHealth = health[part] || 0;
      const repairAmount = (vehicleParts[part].maxHealth * repairPercent) / 100;
      health[part] = Math.min(100, currentHealth + repairAmount);
    }
    
    updateVehicleStatus(vehicleType);
  }

  //=============================================================================
  // Window_VehicleMaintenance
  //=============================================================================

  class Window_VehicleMaintenance extends Window_Base {
    constructor(vehicleType) {
      const width = Graphics.boxWidth - 100;
      const height = Graphics.boxHeight - 100;
      const x = (Graphics.boxWidth - width) / 2;
      const y = (Graphics.boxHeight - height) / 2;

      super(new Rectangle(x, y, width, height));
      this._vehicleType = vehicleType;
      if (vehicleType === "camper") {
        this._vehicleName = "Camper";
      } else if (vehicleType === "car") {
        this._vehicleName = "Car";
      } else if (vehicleType === "airship") {
        this._vehicleName = "Starship";
      }
      this.refresh();
    }

    refresh() {
      this.contents.clear();
      this.drawTitle();
      this.drawPartsList();
      this.drawInstructions();
    }

    drawTitle() {
      this.changeTextColor(ColorManager.systemColor());
      this.drawText(`${this._vehicleName} Maintenance`, 0, 0, this.innerWidth, 'center');
      
      // Draw vehicle status
      const isBroken = checkCriticalParts(this._vehicleType);
      const statusText = isBroken ? "STATUS: BROKEN" : "STATUS: OPERATIONAL";
      const statusColor = isBroken ? ColorManager.textColor(18) : ColorManager.textColor(24);
      
      this.changeTextColor(statusColor);
      this.drawText(statusText, 0, 30, this.innerWidth, 'center');
    }

    drawPartsList() {
      const health = getVehicleHealth(this._vehicleType);
      if (!health) return;
      
      const startX = 50;
      const startY = 80;
      const lineHeight = 28;
      const columnWidth = (this.innerWidth - 100) / 2;
      
      this.changeTextColor(ColorManager.systemColor());
      this.drawText("Parts Status", startX, startY - 30, this.innerWidth - 100, 'left');
      
      const partNames = Object.keys(vehicleParts);
      const midPoint = Math.ceil(partNames.length / 2);
      
      // Draw first column
      for (let i = 0; i < midPoint; i++) {
        const part = partNames[i];
        const partHealth = Math.round(health[part] || 0);
        const isCritical = vehicleParts[part].critical;
        const y = startY + (i * lineHeight);
        
        // Draw part name
        this.changeTextColor(ColorManager.normalColor());
        const partLabel = isCritical ? `*${part}` : part;
        this.drawText(partLabel, startX, y, columnWidth - 60, 'left');
        
        // Draw health percentage with color coding
        let healthColor;
        if (partHealth >= 70) {
          healthColor = ColorManager.textColor(24); // Green
        } else if (partHealth >= 30) {
          healthColor = ColorManager.textColor(14); // Yellow
        } else {
          healthColor = ColorManager.textColor(18); // Red
        }
        
        this.changeTextColor(healthColor);
        this.drawText(`${partHealth}%`, startX + columnWidth - 60, y, 50, 'right');
      }
      
      // Draw second column
      for (let i = midPoint; i < partNames.length; i++) {
        const part = partNames[i];
        const partHealth = Math.round(health[part] || 0);
        const isCritical = vehicleParts[part].critical;
        const y = startY + ((i - midPoint) * lineHeight);
        const x = startX + columnWidth;
        
        // Draw part name
        this.changeTextColor(ColorManager.normalColor());
        const partLabel = isCritical ? `*${part}` : part;
        this.drawText(partLabel, x, y, columnWidth - 60, 'left');
        
        // Draw health percentage with color coding
        let healthColor;
        if (partHealth >= 70) {
          healthColor = ColorManager.textColor(24); // Green
        } else if (partHealth >= 30) {
          healthColor = ColorManager.textColor(14); // Yellow
        } else {
          healthColor = ColorManager.textColor(18); // Red
        }
        
        this.changeTextColor(healthColor);
        this.drawText(`${partHealth}%`, x + columnWidth - 60, y, 50, 'right');
      }
      
      // Draw legend
      this.changeTextColor(ColorManager.systemColor());
      const legendY = this.innerHeight - 60;
      this.drawText("* = Critical Part", startX, legendY, this.innerWidth - 100, 'left');
    }

    drawInstructions() {
      this.changeTextColor(ColorManager.normalColor());
      const instructionY = this.innerHeight - 30;
      this.drawText("Press ESC or Cancel to close", 0, instructionY, this.innerWidth, 'center');
    }
  }

  //=============================================================================
  // Scene_VehicleMaintenance
  //=============================================================================

  class Scene_VehicleMaintenance extends Scene_MenuBase {
    initialize(vehicleType) {
      super.initialize();
      this._vehicleType = vehicleType || "camper";
    }

    create() {
      super.create();
      this.createMaintenanceWindow();
    }

    createMaintenanceWindow() {
      this._maintenanceWindow = new Window_VehicleMaintenance(this._vehicleType);
      this.addWindow(this._maintenanceWindow);
    }

    update() {
      super.update();
      
      if (Input.isTriggered('cancel') || Input.isTriggered('ok') || TouchInput.isTriggered()) {
        SoundManager.playCancel();
        SceneManager.pop();
      }
    }
  }

  // Create specific scene classes for each vehicle type
  class Scene_CamperMaintenance extends Scene_VehicleMaintenance {
    initialize() {
      super.initialize("camper");
    }
  }

  class Scene_CarMaintenance extends Scene_VehicleMaintenance {
    initialize() {
      super.initialize("car");
    }
  }

  class Scene_AirshipMaintenance extends Scene_VehicleMaintenance {
    initialize() {
      super.initialize("airship");
    }
  }

  //=============================================================================
  // Game System Initialization Hook
  //=============================================================================

  const _DataManager_createGameObjects = DataManager.createGameObjects;
  DataManager.createGameObjects = function() {
    _DataManager_createGameObjects.call(this);
    // Initialize vehicle health after game objects are created
    if ($gameSystem && !$gameSystem._vehicleHealth) {
      initializeVehicleHealth();
    }
  };

  //=============================================================================
  // Plugin Commands
  //=============================================================================

  PluginManager.registerCommand(pluginName, "camperMaintenance", () => {
    if (!ensureGameSystemExists()) {
      window.skipLocalization = true;
      $gameMessage.add("System not ready. Please try again.");
      window.skipLocalization = false;
      return;
    }
    
    if (!$gameSystem._vehicleHealth) {
      initializeVehicleHealth();
    }
    
    SceneManager.push(Scene_CamperMaintenance);
  });

  PluginManager.registerCommand(pluginName, "carMaintenance", () => {
    if (!ensureGameSystemExists()) {
      window.skipLocalization = true;
      $gameMessage.add("System not ready. Please try again.");
      window.skipLocalization = false;
      return;
    }

    if (!$gameSystem._vehicleHealth) {
      initializeVehicleHealth();
    }

    SceneManager.push(Scene_CarMaintenance);
  });

  PluginManager.registerCommand(pluginName, "airshipMaintenance", () => {
    if (!ensureGameSystemExists()) {
      window.skipLocalization = true;
      $gameMessage.add("System not ready. Please try again.");
      window.skipLocalization = false;
      return;
    }

    if (!$gameSystem._vehicleHealth) {
      initializeVehicleHealth();
    }

    SceneManager.push(Scene_AirshipMaintenance);
  });

  PluginManager.registerCommand(pluginName, "damageCamper", () => {
    if (!ensureGameSystemExists()) {
      window.skipLocalization = true;
      $gameMessage.add("System not ready. Please try again.");
      window.skipLocalization = false;
      return;
    }
    
    if (!$gameSystem._vehicleHealth) {
      initializeVehicleHealth();
    }
    
    applyDamage("camper", damagePerHit);
    
    // Show message if vehicle becomes broken
    if (window.brokenCamper) {
      window.skipLocalization = true;
      $gameMessage.add("\\C[2]Critical damage!\\C[0] The camper is now broken!");
      $gameMessage.add("Critical parts must be repaired before it can be used.");
      window.skipLocalization = false;
    } else {
      window.skipLocalization = true;
      $gameMessage.add("The camper has taken damage!");
      window.skipLocalization = false;
    }
  });

  PluginManager.registerCommand(pluginName, "damageCar", () => {
    if (!ensureGameSystemExists()) {
      window.skipLocalization = true;
      $gameMessage.add("System not ready. Please try again.");
      window.skipLocalization = false;
      return;
    }

    if (!$gameSystem._vehicleHealth) {
      initializeVehicleHealth();
    }

    applyDamage("car", damagePerHit);

    // Show message if vehicle becomes broken
    if (window.brokenCar) {
      window.skipLocalization = true;
      $gameMessage.add("\\C[2]Critical damage!\\C[0] The car is now broken!");
      $gameMessage.add("Critical parts must be repaired before it can be used.");
      window.skipLocalization = false;
    } else {
      window.skipLocalization = true;
      $gameMessage.add("The car has taken damage!");
      window.skipLocalization = false;
    }
  });

  PluginManager.registerCommand(pluginName, "damageAirship", () => {
    if (!ensureGameSystemExists()) {
      window.skipLocalization = true;
      $gameMessage.add("System not ready. Please try again.");
      window.skipLocalization = false;
      return;
    }

    if (!$gameSystem._vehicleHealth) {
      initializeVehicleHealth();
    }

    applyDamage("airship", damagePerHit);

    // Show message if vehicle becomes broken
    if (window.brokenAirship) {
      window.skipLocalization = true;
      $gameMessage.add("\\C[2]Critical damage!\\C[0] The starship is now broken!");
      $gameMessage.add("Critical parts must be repaired before it can be used.");
      window.skipLocalization = false;
    } else {
      window.skipLocalization = true;
      $gameMessage.add("The starship has taken damage!");
      window.skipLocalization = false;
    }
  });

  PluginManager.registerCommand(pluginName, "repairCamper", (args) => {
    if (!ensureGameSystemExists()) {
      window.skipLocalization = true;
      $gameMessage.add("System not ready. Please try again.");
      window.skipLocalization = false;
      return;
    }
    
    if (!$gameSystem._vehicleHealth) {
      initializeVehicleHealth();
    }
    
    const repairPercent = args.amount === "full" ? 100 : repairAmountPartial;
    const wasBroken = window.brokenCamper;
    
    repairVehicle("camper", repairPercent);
    
    if (args.amount === "full") {
      window.skipLocalization = true;
      $gameMessage.add("The camper has been fully repaired!");
      window.skipLocalization = false;
    } else {
      window.skipLocalization = true;
      $gameMessage.add(`The camper has been partially repaired (${repairAmountPartial}%).`);
      window.skipLocalization = false;
    }
    
    // Check if vehicle is now operational
    if (wasBroken && !window.brokenCamper) {
      window.skipLocalization = true;
      $gameMessage.add("\\C[3]The camper is now operational!\\C[0]");
      window.skipLocalization = false;
    }
  });

  PluginManager.registerCommand(pluginName, "repairCar", (args) => {
    if (!ensureGameSystemExists()) {
      window.skipLocalization = true;
      $gameMessage.add("System not ready. Please try again.");
      window.skipLocalization = false;
      return;
    }

    if (!$gameSystem._vehicleHealth) {
      initializeVehicleHealth();
    }

    const repairPercent = args.amount === "full" ? 100 : repairAmountPartial;
    const wasBroken = window.brokenCar;

    repairVehicle("car", repairPercent);

    if (args.amount === "full") {
      window.skipLocalization = true;
      $gameMessage.add("The car has been fully repaired!");
      window.skipLocalization = false;
    } else {
      window.skipLocalization = true;
      $gameMessage.add(`The car has been partially repaired (${repairAmountPartial}%).`);
      window.skipLocalization = false;
    }

    // Check if vehicle is now operational
    if (wasBroken && !window.brokenCar) {
      window.skipLocalization = true;
      $gameMessage.add("\\C[3]The car is now operational!\\C[0]");
      window.skipLocalization = false;
    }
  });

  PluginManager.registerCommand(pluginName, "repairAirship", (args) => {
    if (!ensureGameSystemExists()) {
      window.skipLocalization = true;
      $gameMessage.add("System not ready. Please try again.");
      window.skipLocalization = false;
      return;
    }

    if (!$gameSystem._vehicleHealth) {
      initializeVehicleHealth();
    }

    const repairPercent = args.amount === "full" ? 100 : repairAmountPartial;
    const wasBroken = window.brokenAirship;

    repairVehicle("airship", repairPercent);

    if (args.amount === "full") {
      window.skipLocalization = true;
      $gameMessage.add("The starship has been fully repaired!");
      window.skipLocalization = false;
    } else {
      window.skipLocalization = true;
      $gameMessage.add(`The starship has been partially repaired (${repairAmountPartial}%).`);
      window.skipLocalization = false;
    }

    // Check if vehicle is now operational
    if (wasBroken && !window.brokenAirship) {
      window.skipLocalization = true;
      $gameMessage.add("\\C[3]The starship is now operational!\\C[0]");
      window.skipLocalization = false;
    }
  });

  //=============================================================================
  // Integration with CamperVehicle.js
  //=============================================================================

  // Override vehicle movement check to include broken status
  const _Game_Vehicle_canMove = Game_Vehicle.prototype.canMove;
  Game_Vehicle.prototype.canMove = function() {
    if (this.isShip() && window.brokenCamper) {
      return false;
    }
    if (this.isBoat() && window.brokenCar) {
      return false;
    }
    if (this.isAirship() && window.brokenAirship) {
      return false;
    }
    return _Game_Vehicle_canMove.call(this);
  };

  // Override getting on vehicle if broken
  const _Game_Vehicle_getOn = Game_Vehicle.prototype.getOn;
  Game_Vehicle.prototype.getOn = function() {
    if (this.isShip() && window.brokenCamper) {
      window.skipLocalization = true;
      $gameMessage.add("The camper is broken and cannot be used!");
      $gameMessage.add("Critical parts must be repaired first.");
      window.skipLocalization = false;
      return;
    }
    if (this.isBoat() && window.brokenCar) {
      window.skipLocalization = true;
      $gameMessage.add("The car is broken and cannot be used!");
      $gameMessage.add("Critical parts must be repaired first.");
      window.skipLocalization = false;
      return;
    }
    if (this.isAirship() && window.brokenAirship) {
      window.skipLocalization = true;
      $gameMessage.add("The starship is broken and cannot be used!");
      $gameMessage.add("Critical parts must be repaired first.");
      window.skipLocalization = false;
      return;
    }
    _Game_Vehicle_getOn.call(this);
  };

  // Save/Load compatibility
  const _DataManager_makeSaveContents = DataManager.makeSaveContents;
  DataManager.makeSaveContents = function() {
    const contents = _DataManager_makeSaveContents.call(this);
    if ($gameSystem && $gameSystem._vehicleHealth) {
      contents.vehicleHealth = $gameSystem._vehicleHealth;
    }
    contents.brokenCamper = window.brokenCamper;
    contents.brokenCar = window.brokenCar;
    contents.brokenAirship = window.brokenAirship;
    return contents;
  };

  const _DataManager_extractSaveContents = DataManager.extractSaveContents;
  DataManager.extractSaveContents = function(contents) {
    _DataManager_extractSaveContents.call(this, contents);
    if (contents.vehicleHealth && $gameSystem) {
      $gameSystem._vehicleHealth = contents.vehicleHealth;
    } else if ($gameSystem) {
      initializeVehicleHealth();
    }
    window.brokenCamper = contents.brokenCamper || false;
    window.brokenCar = contents.brokenCar || false;
    window.brokenAirship = contents.brokenAirship || false;
  };

})();
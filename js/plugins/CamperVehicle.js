/*:
 * @plugindesc Merged Vehicle & Movement System v3.0
 * @author Omni-Lex (Merged)
 * @target MZ
 *
 * @param CamperSettings
 * @text Camper Settings
 * 
 * @param CamperMaxFuel
 * @parent CamperSettings
 * @desc Maximum fuel capacity for camper in liters
 * @type number
 * @min 1
 * @default 100
 *
 * @param CamperFuelRate
 * @parent CamperSettings
 * @desc Fuel consumption rate per second for camper
 * @type number
 * @decimals 2
 * @min 0.01
 * @default 0.5
 *
 * @param CamperVariables
 * @parent CamperSettings
 * @text Camper Variable IDs
 *
 * @param CamperXVar
 * @parent CamperVariables
 * @desc Variable ID for Camper X position
 * @type variable
 * @default 63
 *
 * @param CamperYVar
 * @parent CamperVariables
 * @desc Variable ID for Camper Y position
 * @type variable
 * @default 64
 *
 * @param CamperFuelVar
 * @parent CamperVariables
 * @desc Variable ID for Camper fuel
 * @type variable
 * @default 65
 *
 * @param CamperMapVar
 * @parent CamperVariables
 * @desc Variable ID for Camper map
 * @type variable
 * @default 67
 *
 * @param CarSettings
 * @text Car Settings
 *
 * @param CarMaxFuel
 * @parent CarSettings
 * @desc Maximum fuel capacity for car in liters
 * @type number
 * @min 1
 * @default 60
 *
 * @param CarFuelRate
 * @parent CarSettings
 * @desc Fuel consumption rate per second for car
 * @type number
 * @decimals 2
 * @min 0.01
 * @default 0.3
 *
 * @param CarVariables
 * @parent CarSettings
 * @text Car Variable IDs
 *
 * @param CarXVar
 * @parent CarVariables
 * @desc Variable ID for Car X position
 * @type variable
 * @default 69
 *
 * @param CarYVar
 * @parent CarVariables
 * @desc Variable ID for Car Y position
 * @type variable
 * @default 70
 *
 * @param CarFuelVar
 * @parent CarVariables
 * @desc Variable ID for Car fuel
 * @type variable
 * @default 71
 *
 * @param CarMapVar
 * @parent CarVariables
 * @desc Variable ID for Car map
 * @type variable
 * @default 72
 *
 * @param GeneralSettings
 * @text General Settings
 *
 * @param SearchRadius
 * @parent GeneralSettings
 * @desc Maximum search radius for finding valid position
 * @type number
 * @min 1
 * @default 5
 *
 * @param AccelerationFrames
 * @parent GeneralSettings
 * @desc Frames to reach max speed (60 = 1 second)
 * @type number
 * @min 30
 * @default 120
 *
 * @param MovementSettings
 * @text Movement Settings
 *
 * @param speedBoostMultiplier
 * @parent MovementSettings
 * @text Speed Boost Multiplier
 * @type number
 * @decimals 2
 * @min 1.00
 * @max 5.00
 * @default 1.5
 * @desc Movement speed multiplier when holding Shift (1.5 = 50% faster)
 *
 * @command summonCamper
 * @text Summon Camper
 * @desc Teleports the camper to a nearby location
 *
 * @command summonCar
 * @text Summon Car
 * @desc Teleports the car to a nearby location
 *
 * @command teleportToVehicle
 * @text Teleport To Vehicle
 * @desc Teleports player to specified vehicle
 * @arg vehicleType
 * @type select
 * @option Camper
 * @value ship
 * @option Car
 * @value boat
 * @default ship
 *
 * @command saveCamperAndTravel
 * @text Save Camper and Travel
 * @desc Save camper position and enter interior
 *
 * @command saveCarAndTravel
 * @text Save Car and Travel
 * @desc Save car position and enter interior
 *
 * @command returnToCamper
 * @text Return to Camper
 * @desc Return to last camper position
 *
 * @command returnToCar
 * @text Return to Car
 * @desc Return to last car position
 *
 * @command returnAndRideCamper
 * @text Return and Ride Camper
 * @desc Return and automatically ride camper
 *
 * @command returnAndRideCar
 * @text Return and Ride Car
 * @desc Return and automatically ride car
 *
 * @help
 * ============================================================================
 * Merged Vehicle & Movement System
 * ============================================================================
 * 
 * Combines vehicle system with custom movement controls:
 * - Two vehicles with fuel systems
 * - Custom autorun behavior (disabled on map 315)
 * - Speed boost with Shift key when on foot
 * - Map 315 special rules:
 *   - On foot: Speed locked at 2, no dash
 *   - In vehicle: Speed locked at 4
 * 
 * ============================================================================
 */

(() => {
  'use strict';

  const PLUGIN_NAME = 'CamperVehicle';
  const params = PluginManager.parameters(PLUGIN_NAME);

  // ============================================================================
  // Configuration
  // ============================================================================
  //
  // SPEED SETTINGS GUIDE:
  // All movement speeds are centralized in VehicleConfig.SPEED (around line 263)
  // Edit the values there to change speeds everywhere:
  //   - onFootBase: Walking speed when not holding Shift
  //   - onFootAutorunBoost: Speed added by autorun system
  //   - map315OnFootSpeed: Walking speed on map 315 (restricted area)
  //   - vehicleBaseSpeed: Starting speed when in vehicle (maps other than 315)
  //   - vehicleMaxSpeed: Max speed vehicles can reach (with acceleration)
  //   - map315VehicleSpeed: Vehicle speed on map 315 (no acceleration)
  //   - speedBoostMultiplier: Speed multiplier when holding Shift
  // ============================================================================
  
  class VehicleConfig {
    static CAMPER = {
      type: 'ship',
      name: 'Camper',
      maxFuel: Number(params.CamperMaxFuel || 100),
      fuelRate: Number(params.CamperFuelRate || 0.5),
      vars: {
        x: Number(params.CamperXVar || 63),
        y: Number(params.CamperYVar || 64),
        fuel: Number(params.CamperFuelVar || 65),
        map: Number(params.CamperMapVar || 67)
      },
      interior: {
        mapId: 1412,
        x: 10,
        y: 8
      },
      sprites: {
        normal: { name: 'Vehicles/!$RV', index: 2 },
        large: { name: 'Vehicles/!$RV_large', index: 2 }
      },
      refuelEvent: 104,
      storageEvent: 118,
      repairEvent: 120
    };

    static AIRSHIP = {
      type: 'airship',
      name: 'Starship',
      maxFuel: 200,
      fuelRate: 0.8,
      vars: {
        x: 144,
        y: 145,
        fuel: 146,
        map: 147
      },
      interior: {
        mapId: 721,
        x: 25,
        y: 48,
        direction: 6  // Facing right (6 = right, 2 = down, 4 = left, 8 = up)
      },
      sprites: {
        normal: { name: 'Vehicles/!$Airship', index: 0 },
        large: { name: 'Vehicles/!$Airship', index: 0 }
      },
      refuelEvent: 122,
      storageEvent: 123,
      repairEvent: 124
    };

    static CAR = {
      type: 'boat',
      name: 'Car',
      maxFuel: Number(params.CarMaxFuel || 60),
      fuelRate: Number(params.CarFuelRate || 0.3),
      vars: {
        x: Number(params.CarXVar || 69),
        y: Number(params.CarYVar || 70),
        fuel: Number(params.CarFuelVar || 71),
        map: Number(params.CarMapVar || 72)
      },
      interior: {
        mapId: 1094,
        x: 7,
        y: 9
      },
      sprites: {
        normal: { name: 'Vehicles/!$Car', index: 0 },
        large: { name: 'Vehicles/!$Car_large', index: 0 }
      },
      refuelEvent: 116,
      storageEvent: 119,
      repairEvent: 121
    };

    static GENERAL = {
      searchRadius: Number(params.SearchRadius || 5),
      accelerationFrames: Number(params.AccelerationFrames || 120),
      speedBoostMultiplier: Number(params.speedBoostMultiplier || 1.5),
      map315: {
        xVar: 43,
        yVar: 44,
        defaultX: 88,
        defaultY: 130
      }
    };

    // ========================================================================
    // Centralized Speed Settings - Edit these to adjust all movement speeds
    // ========================================================================
    static SPEED = {
      // ON FOOT SPEEDS (non-map 315)
      onFootBase: 4,                    // Base walking speed
      onFootAutorunBoost: 1,            // Boost from autorun (added to base)
      onFootMaxWithShift: null,         // Max speed with Shift (uses multiplier below)

      // ON FOOT SPEEDS (map 315 only)
      map315OnFootSpeed: 4,             // On foot walking speed on map 315

      // VEHICLE SPEEDS (acceleration system)
      vehicleBaseSpeed: 4,              // Starting speed when entering vehicle
      vehicleMaxSpeed: 6,               // Maximum speed after acceleration

      // VEHICLE SPEEDS (map 315 only)
      map315VehicleSpeed: 5,            // Vehicle speed on map 315 (no acceleration)

      // ACCELERATION & BOOST
      speedBoostMultiplier: Number(params.speedBoostMultiplier || 1.5)  // Shift key multiplier
    };
  }

  // ============================================================================
  // ConfigManager - Remove autorun from options
  // ============================================================================

  const _ConfigManager_makeData = ConfigManager.makeData;
  ConfigManager.makeData = function() {
    const config = _ConfigManager_makeData.call(this);
    delete config.alwaysDash;
    return config;
  };

  const _ConfigManager_applyData = ConfigManager.applyData;
  ConfigManager.applyData = function(config) {
    _ConfigManager_applyData.call(this, config);
    this.alwaysDash = true;
  };

  // ============================================================================
  // Window_Options - Remove autorun option
  // ============================================================================

  const _Window_Options_addGeneralOptions = Window_Options.prototype.addGeneralOptions;
  Window_Options.prototype.addGeneralOptions = function() {
    _Window_Options_addGeneralOptions.call(this);
    this._list = this._list.filter(option => option.symbol !== 'alwaysDash');
  };

  // ============================================================================
  // Cache Manager
  // ============================================================================
  
  class MapDataCache {
    constructor() {
      this._cache = new Map();
      this._interiorCache = new Map();
    }

    getMapData(mapId) {
      if (!this._cache.has(mapId)) {
        this._loadMapData(mapId);
      }
      return this._cache.get(mapId);
    }

    isInterior(mapId) {
      if (!this._interiorCache.has(mapId)) {
        const data = this.getMapData(mapId);
        const isInt = data && data.note && 
                     data.note.includes('<Interior>') && 
                     !data.note.includes('<Covered>');
        this._interiorCache.set(mapId, isInt);
      }
      return this._interiorCache.get(mapId);
    }

    _loadMapData(mapId) {
      if (!$dataMapInfos[mapId]) {
        this._cache.set(mapId, null);
        return;
      }

      try {
        const filename = 'Map%1.json'.format(mapId.padZero(3));
        const xhr = new XMLHttpRequest();
        xhr.open('GET', 'data/' + filename, false);
        xhr.overrideMimeType('application/json');
        xhr.send();

        if (xhr.status < 400) {
          this._cache.set(mapId, JSON.parse(xhr.responseText));
        } else {
          this._cache.set(mapId, null);
        }
      } catch (e) {
        this._cache.set(mapId, null);
      }
    }

    clear() {
      this._cache.clear();
      this._interiorCache.clear();
    }
  }

  const mapCache = new MapDataCache();

  // ============================================================================
  // Vehicle Manager
  // ============================================================================
  
  class VehicleManager {
    constructor() {
      this._initialized = false;
    }

    initialize() {
      if (this._initialized) return;

      this._initializeVehicle(VehicleConfig.CAMPER);
      this._initializeVehicle(VehicleConfig.CAR);
      this._initializeVehicle(VehicleConfig.AIRSHIP);

      this._initialized = true;
    }

    _initializeVehicle(config) {
      if ($gameVariables.value(config.vars.fuel) === 0) {
        $gameVariables.setValue(config.vars.fuel, config.maxFuel/2);
      }
      if ($gameVariables.value(config.vars.map) === 0) {
        $gameVariables.setValue(config.vars.map, 315);
      }
    }

    getVehicle(type) {
      return $gameMap.vehicle(type);
    }

    getConfig(vehicle) {
      if (vehicle.isShip()) return VehicleConfig.CAMPER;
      if (vehicle.isBoat()) return VehicleConfig.CAR;
      if (vehicle.isAirship()) return VehicleConfig.AIRSHIP;
      return null;
    }

    savePosition(vehicle) {
      const config = this.getConfig(vehicle);
      if (!config || mapCache.isInterior($gameMap.mapId())) return;

      $gameVariables.setValue(config.vars.x, vehicle.x);
      $gameVariables.setValue(config.vars.y, vehicle.y);
      $gameVariables.setValue(config.vars.map, $gameMap.mapId());

      if ($gameMap.mapId() === 315) {
        $gameVariables.setValue(VehicleConfig.GENERAL.map315.xVar, vehicle.x);
        $gameVariables.setValue(VehicleConfig.GENERAL.map315.yVar, vehicle.y);
      }
    }

    summon(vehicleType) {
      if (mapCache.isInterior($gameMap.mapId())) {
        this._showMessage("There is no space to summon the vehicle");
        return;
      }

      const vehicle = this.getVehicle(vehicleType);
      const config = vehicleType === 'ship' ? VehicleConfig.CAMPER : VehicleConfig.CAR;

      if (!vehicle) return;

      const pos = PositionFinder.findNearPlayer(vehicle);
      if (pos) {
        vehicle.setLocation($gameMap.mapId(), pos.x, pos.y);
        this.savePosition(vehicle);
        this._playTeleportEffect(vehicle);
      } else {
        this._showMessage("No valid position found to summon the vehicle");
      }
    }

    _showMessage(text) {
      window.skipLocalization = true;
      $gameMessage.add(text);
      window.skipLocalization = false;
    }

    _playTeleportEffect(target) {
      AudioManager.playSe({
        name: "Teleport",
        pan: 0,
        pitch: 100,
        volume: 90
      });
      $gameTemp.requestAnimation([target], 52);
    }
  }

  // ============================================================================
  // Position Finder
  // ============================================================================
  
  class PositionFinder {
    static findNearPlayer(character) {
      return this.findValidPosition($gamePlayer.x, $gamePlayer.y, character);
    }

    static findValidPosition(targetX, targetY, character) {
      const adjacent = this._checkAdjacent(targetX, targetY, character);
      if (adjacent) return adjacent;
      return this._spiralSearch(targetX, targetY, character);
    }

    static _checkAdjacent(x, y, character) {
      const directions = [2, 4, 6, 8];
      for (const d of directions) {
        const nx = $gameMap.roundXWithDirection(x, d);
        const ny = $gameMap.roundYWithDirection(y, d);
        if (this._isValidPosition(nx, ny, character)) {
          return { x: nx, y: ny };
        }
      }
      return null;
    }

    static _spiralSearch(centerX, centerY, character) {
      const maxRadius = VehicleConfig.GENERAL.searchRadius;
      
      for (let radius = 2; radius <= maxRadius; radius++) {
        for (let i = 0; i < radius * 2; i++) {
          const positions = [
            { x: centerX - radius + i, y: centerY - radius },
            { x: centerX + radius, y: centerY - radius + i },
            { x: centerX + radius - i, y: centerY + radius },
            { x: centerX - radius, y: centerY + radius - i }
          ];

          for (const pos of positions) {
            const x = $gameMap.roundX(pos.x);
            const y = $gameMap.roundY(pos.y);
            if (this._isValidPosition(x, y, character)) {
              return { x, y };
            }
          }
        }
      }
      return null;
    }

    static _isValidPosition(x, y, character) {
      if (character.isShip() || character.isBoat()) {
        const regionId = $gameMap.regionId(x, y);
        if (regionId === 10) return false;
        if (regionId === 4) return true;
        if ($gameMap.terrainTag(x, y) === 3) return false;
        return $gameMap.isPassable(x, y, 0);
      }
      return $gameMap.isPassable(x, y, 0);
    }
  }

  // ============================================================================
  // Fuel System
  // ============================================================================
  
  class FuelSystem {
    static consumeFuel(vehicle, deltaTime) {
      const config = vehicleManager.getConfig(vehicle);
      if (!config) return;

      const currentFuel = $gameVariables.value(config.vars.fuel);
      if (currentFuel <= 0) return;

      let consumption = config.fuelRate * deltaTime;
      
      if ($gameMap.mapId() !== 315) {
        consumption /= 25;
      }

      const newFuel = Math.max(0, currentFuel - consumption);
      $gameVariables.setValue(config.vars.fuel, newFuel);
    }

    static refuel(vehicle, amount) {
      const config = vehicleManager.getConfig(vehicle);
      if (!config) return;

      const currentFuel = $gameVariables.value(config.vars.fuel);
      const newFuel = Math.min(config.maxFuel, currentFuel + amount);
      $gameVariables.setValue(config.vars.fuel, newFuel);
    }

    static hasFuel(vehicle) {
      const config = vehicleManager.getConfig(vehicle);
      if (!config) return false;
      return $gameVariables.value(config.vars.fuel) > 0;
    }

    static getFuel(vehicle) {
      const config = vehicleManager.getConfig(vehicle);
      if (!config) return 0;
      return $gameVariables.value(config.vars.fuel);
    }
  }

  // ============================================================================
  // Acceleration System
  // ============================================================================

  class AccelerationSystem {
    constructor() {
      this.reset();
    }

    reset() {
      this._accelerating = false;
      this._timer = 0;
      this._baseSpeed = VehicleConfig.SPEED.vehicleBaseSpeed;
      this._maxSpeed = VehicleConfig.SPEED.vehicleMaxSpeed;
    }

    update(vehicle) {
      if ($gameMap.mapId() === 315) {
        if (this._accelerating) {
          this.stopAcceleration();
        }
        return;
      }
      
      if (!$gamePlayer.isInVehicle() || $gamePlayer.vehicle() !== vehicle) return;
    
      const isMoving = this._isMovementInput();
    
      if (isMoving && !this._accelerating) {
        this.startAcceleration();
      } else if (!isMoving && this._accelerating) {
        this.stopAcceleration();
      }
    
      if (this._accelerating && isMoving) {
        this._updateSpeed();
      }
    }

    startAcceleration() {
      this._accelerating = true;
      this._timer = 0;
      $gamePlayer.setMoveSpeed(this._baseSpeed);
    }

    stopAcceleration() {
      this._accelerating = false;
      this._timer = 0;
      $gamePlayer.setMoveSpeed(this._baseSpeed);
    }

    _updateSpeed() {
      this._timer++;
      const progress = Math.min(this._timer / VehicleConfig.GENERAL.accelerationFrames, 1);
      const speed = this._baseSpeed + (this._maxSpeed - this._baseSpeed) * progress;
      $gamePlayer.setMoveSpeed(Math.floor(speed));
    }

    _isMovementInput() {
      return Input.isPressed('down') || Input.isPressed('left') || 
             Input.isPressed('right') || Input.isPressed('up');
    }
  }

  // ============================================================================
  // Vehicle Extensions
  // ============================================================================
  
  const vehicleManager = new VehicleManager();
  
  const _Game_Vehicle_initialize = Game_Vehicle.prototype.initialize;
  Game_Vehicle.prototype.initialize = function(type) {
    _Game_Vehicle_initialize.call(this, type);

    if (this.isShip() || this.isBoat() || this.isAirship()) {
      this._config = vehicleManager.getConfig(this);
      this._fuelTimer = 0;
      this._acceleration = new AccelerationSystem();
    }
  };
  
  const _Game_Vehicle_update = Game_Vehicle.prototype.update;
  Game_Vehicle.prototype.update = function() {
    _Game_Vehicle_update.call(this);

    if ((this.isShip() || this.isBoat() || this.isAirship()) &&
        $gamePlayer.isInVehicle() &&
        $gamePlayer.vehicle() === this) {
      
      if (!this._acceleration || typeof this._acceleration.update !== 'function') {
        this._acceleration = new AccelerationSystem();
      }
      
      // Force speed on map 315
      if ($gameMap.mapId() === 315) {
        if ($gamePlayer._moveSpeed !== VehicleConfig.SPEED.map315VehicleSpeed) {
          $gamePlayer.setMoveSpeed(VehicleConfig.SPEED.map315VehicleSpeed);
        }
      } else {
        this._acceleration.update(this);
      }
      
      // Fuel consumption only when moving
      if ($gamePlayer.isMoving() && this.isMoving()) {
        this._fuelTimer = this._fuelTimer || 0;
        this._fuelTimer++;
        if (this._fuelTimer >= 60) {
          FuelSystem.consumeFuel(this, 1);
          this._fuelTimer = 0;
          
          if (!FuelSystem.hasFuel(this)) {
            $gamePlayer._moveRouteForcing = false;
            $gamePlayer._moveRoute = null;
          }
        }
      } else {
        this._fuelTimer = 0;
      }
    }
  };

  const _Game_Vehicle_updateMove = Game_Vehicle.prototype.updateMove;
  Game_Vehicle.prototype.updateMove = function() {
    _Game_Vehicle_updateMove.call(this);

    if ((this.isShip() || this.isBoat() || this.isAirship()) &&
        $gamePlayer.isInVehicle() &&
        $gamePlayer.vehicle() === this &&
        this.isMoving()) {
      vehicleManager.savePosition(this);
    }
  };

  const _Game_Vehicle_updateAnimation = Game_Vehicle.prototype.updateAnimation;
  Game_Vehicle.prototype.updateAnimation = function() {
    if ((this.isShip() || this.isBoat() || this.isAirship()) &&
        $gamePlayer.isInVehicle() &&
        $gamePlayer.vehicle() === this) {

      if (this.isMoving()) {
        _Game_Vehicle_updateAnimation.call(this);
      } else {
        this._animationCount = 0;
        this._pattern = 1;
      }
    } else {
      _Game_Vehicle_updateAnimation.call(this);
    }
  };

  const _Game_Vehicle_isMapPassable = Game_Vehicle.prototype.isMapPassable;
  Game_Vehicle.prototype.isMapPassable = function(x, y, d) {
    if (this.isShip() || this.isBoat() || this.isAirship()) {
      if (mapCache.isInterior($gameMap.mapId())) return false;
      if (!FuelSystem.hasFuel(this)) return false;
      
      const x2 = $gameMap.roundXWithDirection(x, d);
      const y2 = $gameMap.roundYWithDirection(y, d);
      
      const regionId = $gameMap.regionId(x2, y2);
      if (regionId === 10) return false;
      if (regionId === 4) return true;
      
      if ($gameMap.mapId() === 315) {
        if ($gameMap.terrainTag(x2, y2) === 3) return false;
      } else {
        const terrainTag = $gameMap.terrainTag(x2, y2);
        if (![1, 5, 2, 7].includes(terrainTag)) return false;
      }
      
      return $gameMap.isPassable(x2, y2, this.reverseDir(d));
    }
    return _Game_Vehicle_isMapPassable.call(this, x, y, d);
  };

  const _Game_Vehicle_getOn = Game_Vehicle.prototype.getOn;
  Game_Vehicle.prototype.getOn = function() {
    _Game_Vehicle_getOn.call(this);

    if (this.isShip() || this.isBoat() || this.isAirship()) {
      vehicleManager.savePosition(this);
      this._fuelTimer = 0;

      if (!this._acceleration) {
        this._acceleration = new AccelerationSystem();
      }

      if ($gameMap.mapId() === 315) {
        $gamePlayer.setMoveSpeed(VehicleConfig.SPEED.map315VehicleSpeed);
        $gamePlayer._dashing = true;
      } else {
        $gamePlayer.setMoveSpeed(VehicleConfig.SPEED.vehicleBaseSpeed);
        this._acceleration.reset();
      }
    }
  };
  
  const _Game_Vehicle_getOff = Game_Vehicle.prototype.getOff;
  Game_Vehicle.prototype.getOff = function() {
    if (this.isShip() || this.isBoat() || this.isAirship()) {
      vehicleManager.savePosition(this);
      if (this._acceleration) {
        this._acceleration.reset();
      }
      $gamePlayer._dashing = false;
    }

    _Game_Vehicle_getOff.call(this);

    // Set appropriate on-foot speed based on map
    if ($gameMap.mapId() === 315) {
      $gamePlayer.setMoveSpeed(VehicleConfig.SPEED.map315OnFootSpeed);
    } else {
      $gamePlayer.setMoveSpeed(VehicleConfig.SPEED.onFootBase);
    }

    $gamePlayer.followers().show();
    $gamePlayer.refresh();
  };

  // ============================================================================
  // Player Movement Extensions
  // ============================================================================
  
  // Check for autorun enabled based on map
  Game_Player.prototype.isAutorunEnabled = function() {
    return $gameMap.mapId() !== 315;
  };

  // Override dash button check
  const _Game_Player_isDashButtonPressed = Game_Player.prototype.isDashButtonPressed;
  Game_Player.prototype.isDashButtonPressed = function() {
    // If in vehicle on map 315, always dash
    if (this.isInVehicle()) {
      const v = this.vehicle();
      if (v && (v.isShip() || v.isBoat() || v.isAirship()) && $gameMap.mapId() === 315) {
        return true;
      }
    }
    
    // On foot: no dash on map 315, otherwise check shift
    if ($gameMap.mapId() === 315) {
      return false;
    }
    return Input.isPressed('shift');
  };

  // Override real move speed
  const _Game_Player_realMoveSpeed = Game_Player.prototype.realMoveSpeed;
  Game_Player.prototype.realMoveSpeed = function() {
    // In vehicle on map 315: force speed
    if (this.isInVehicle()) {
      const v = this.vehicle();
      if (v && (v.isShip() || v.isBoat() || v.isAirship()) && $gameMap.mapId() === 315) {
        return VehicleConfig.SPEED.map315VehicleSpeed;
      }
    }

    // On foot on map 315: force speed
    if (!this.isInVehicle() && $gameMap.mapId() === 315) {
      return VehicleConfig.SPEED.map315OnFootSpeed;
    }

    // On foot on other maps: apply autorun and shift boost
    if (!this.isInVehicle()) {
      let speed = this._moveSpeed;

      // Apply autorun speed boost
      if (this.isAutorunEnabled()) {
        speed += VehicleConfig.SPEED.onFootAutorunBoost;
      }

      // Apply shift speed boost
      if (this.isDashButtonPressed()) {
        speed *= VehicleConfig.SPEED.speedBoostMultiplier;
      }

      return speed;
    }

    return _Game_Player_realMoveSpeed.call(this);
  };

  // Override isDashing
  const _Game_Player_isDashing = Game_Player.prototype.isDashing;
  Game_Player.prototype.isDashing = function() {
    if ($gameMap.mapId() === 315) {
      // On map 315: vehicles dash, player doesn't
      if (this.isInVehicle()) {
        const v = this.vehicle();
        if (v && (v.isShip() || v.isBoat() || v.isAirship())) {
          return true;
        }
      }
      return false;
    }

    if (this.isMoving() && !this.isInVehicle()) {
      // Always dashing when autorun enabled (non-315 maps)
      if (this.isAutorunEnabled()) {
        return true;
      }
    }
    return _Game_Player_isDashing.call(this);
  };

  // Override updateDashing
  const _Game_Player_updateDashing = Game_Player.prototype.updateDashing;
  Game_Player.prototype.updateDashing = function() {
    if (this.isInVehicle()) {
      const v = this.vehicle();
      if (v && (v.isShip() || v.isBoat() || v.isAirship()) && $gameMap.mapId() === 315) {
        this._dashing = true;
        return;
      }
    }

    if ($gameMap.mapId() === 315 && !this.isInVehicle()) {
      this._dashing = false;
      return;
    }

    _Game_Player_updateDashing.call(this);
  };

  const _Game_Player_canMove = Game_Player.prototype.canMove;
  Game_Player.prototype.canMove = function() {
    if (this.isInVehicle()) {
      const vehicle = this.vehicle();
      if ((vehicle.isShip() || vehicle.isBoat()) && !FuelSystem.hasFuel(vehicle)) {
        return false;
      }
    }
    return _Game_Player_canMove.call(this);
  };

  Game_Player.prototype.showVehicleDismountMenu = function(vehicle) {
    const config = vehicleManager.getConfig(vehicle);
    if (!config) return;

    const fuel = FuelSystem.getFuel(vehicle);

    window.skipLocalization = true;
    $gameMessage.add(`What would you like to do?\n${config.name} Fuel: ${fuel.toFixed(1)}L`);
    $gameMessage.setChoices(
      ["Stop driving", `Enter ${config.name.toLowerCase()}`, "Continue driving",
       "Refuel", "Storage", "Repairs"],
      0, -1
    );
    window.skipLocalization = false;

    $gameMessage.setChoiceCallback((choice) => {
      switch(choice) {
        case 0: // Stop driving
          $gamePlayer.getOffVehicle();
          break;
        case 1: // Enter interior
          vehicleManager.savePosition(vehicle);
          $gamePlayer.getOffVehicle();
          setTimeout(() => {
            const direction = config.interior.direction || 2;
            $gamePlayer.reserveTransfer(
              config.interior.mapId,
              config.interior.x,
              config.interior.y,
              direction, 0
            );
            AudioManager.playSe({ name: "Door1", pan: 0, pitch: 100, volume: 90 });
          }, 1000);
          break;
        case 2: // Continue
          break;
        case 3: // Refuel
          $gameTemp.reserveCommonEvent(config.refuelEvent);
          break;
        case 4: // Storage
          $gameTemp.reserveCommonEvent(config.storageEvent);
          break;
        case 5: // Repairs
          $gameTemp.reserveCommonEvent(config.repairEvent);
          break;
      }
    });
  };

  // ============================================================================
  // Event Interaction Control
  // ============================================================================
  
  class EventInteractionControl {
    static isTransferEvent(x, y) {
      const events = $gameMap.eventsXy(x, y);
      return events.some(e => e.event().name.toLowerCase().startsWith('transfer'));
    }

    static getTransferMapId(x, y) {
      const events = $gameMap.eventsXy(x, y);
      for (const event of events) {
        const name = event.event().name;
        if (name.toLowerCase().startsWith('transfer')) {
          const match = name.match(/\((\d+)/);
          if (match) return parseInt(match[1]);
        }
      }
      return null;
    }

    static checkVehicleInteriorBlock(x, y, vehicle) {
      if ($gameMap.mapId() === 315) return false;
      if (!this.isTransferEvent(x, y)) return false;

      const mapId = this.getTransferMapId(x, y);
      if (mapId && mapCache.isInterior(mapId)) {
        const config = vehicleManager.getConfig(vehicle);
        window.skipLocalization = true;
        $gameMessage.add(`The ${config.name.toLowerCase()} can't fit there!`);
        window.skipLocalization = false;
        return true;
      }
      return false;
    }
  }

  const _Game_Player_checkEventTriggerHere = Game_Player.prototype.checkEventTriggerHere;
  Game_Player.prototype.checkEventTriggerHere = function(triggers) {
    if (this.isInVehicle()) {
      const vehicle = this.vehicle();
      if ((vehicle.isShip() || vehicle.isBoat() || vehicle.isAirship()) && $gameMap.mapId() !== 315) {
        if (EventInteractionControl.checkVehicleInteriorBlock(this.x, this.y, vehicle)) {
          return false;
        }
        if (!EventInteractionControl.isTransferEvent(this.x, this.y)) {
          return false;
        }
      }
    }
    return _Game_Player_checkEventTriggerHere.call(this, triggers);
  };

  const _Game_Player_checkEventTriggerThere = Game_Player.prototype.checkEventTriggerThere;
  Game_Player.prototype.checkEventTriggerThere = function(triggers) {
    if (this.isInVehicle()) {
      const vehicle = this.vehicle();
      if ((vehicle.isShip() || vehicle.isBoat() || vehicle.isAirship()) && $gameMap.mapId() !== 315) {
        const d = this.direction();
        const x2 = $gameMap.roundXWithDirection(this.x, d);
        const y2 = $gameMap.roundYWithDirection(this.y, d);

        if (EventInteractionControl.checkVehicleInteriorBlock(x2, y2, vehicle)) {
          return false;
        }
        if (!EventInteractionControl.isTransferEvent(x2, y2)) {
          return false;
        }
      }
    }
    return _Game_Player_checkEventTriggerThere.call(this, triggers);
  };

  // ============================================================================
  // Scene Map Extensions
  // ============================================================================
  
  const _Scene_Map_onMapLoaded = Scene_Map.prototype.onMapLoaded;
  Scene_Map.prototype.onMapLoaded = function() {
    _Scene_Map_onMapLoaded.call(this);
    
    vehicleManager.initialize();
    
    // Update vehicle sprites based on map
    const isMap315 = $gameMap.mapId() === 315;

    ['ship', 'boat', 'airship'].forEach(type => {
      const vehicle = vehicleManager.getVehicle(type);
      if (vehicle) {
        const config = vehicleManager.getConfig(vehicle);
        const sprite = isMap315 ? config.sprites.normal : config.sprites.large;
        vehicle._characterName = sprite.name;
        vehicle._characterIndex = sprite.index;
        vehicle.refresh();
      }
    });

    // Set correct player speed when entering a map
    if (!$gamePlayer.isInVehicle()) {
      if ($gameMap.mapId() === 315) {
        $gamePlayer.setMoveSpeed(VehicleConfig.SPEED.map315OnFootSpeed);
      } else {
        $gamePlayer.setMoveSpeed(VehicleConfig.SPEED.onFootBase);
      }
    }

    // Handle auto-ride after transfer
    this._handleAutoRide();
  };

  Scene_Map.prototype._handleAutoRide = function() {
    if ($gameTemp._autoRideTimer > 0) return;

    ['Camper', 'Car'].forEach(vehicleName => {
      const flag = `_spawn${vehicleName}AfterTransfer`;
      const autoFlag = `_autoRide${vehicleName}AfterSpawn`;
      
      if ($gameTemp[flag] && !mapCache.isInterior($gameMap.mapId())) {
        const type = vehicleName === 'Camper' ? 'ship' : 'boat';
        const vehicle = vehicleManager.getVehicle(type);
        const config = vehicleManager.getConfig(vehicle);
        const spawnData = $gameTemp[flag];
        
        if (vehicle && config) {
          const pos = PositionFinder.findValidPosition(spawnData.x, spawnData.y, vehicle);
          if (pos) {
            vehicle.setLocation($gameMap.mapId(), pos.x, pos.y);
            vehicleManager.savePosition(vehicle);
            
            if ($gameTemp[autoFlag]) {
              $gamePlayer.setPosition(pos.x, pos.y);
              $gameTemp._autoRideTimer = 15;
              $gameTemp._vehicleToRide = vehicle;
              $gameTemp._vehicleType = type;
            }
          }
        }
        
        $gameTemp[flag] = null;
        $gameTemp[autoFlag] = false;
      }
    });
  };

  const _Scene_Map_update = Scene_Map.prototype.update;
  Scene_Map.prototype.update = function() {
    _Scene_Map_update.call(this);
    
    // Handle vehicle dismount menu
    if ($gamePlayer.isInVehicle()) {
      const vehicle = $gamePlayer.vehicle();
      if ((vehicle.isShip() || vehicle.isBoat() || vehicle.isAirship()) &&
          (Input.isTriggered('cancel') || TouchInput.isCancelled())) {
        $gamePlayer.showVehicleDismountMenu(vehicle);
      }
    }
    
    // Handle auto-ride timer
    if ($gameTemp._autoRideTimer > 0) {
      $gameTemp._autoRideTimer--;
      if ($gameTemp._autoRideTimer === 0) {
        this._executeAutoRide();
      }
    }
  };

  Scene_Map.prototype._executeAutoRide = function() {
    const vehicle = $gameTemp._vehicleToRide;
    const type = $gameTemp._vehicleType;
    
    if (vehicle && vehicle.mapId === $gameMap.mapId()) {
      $gamePlayer.setPosition(vehicle.x, vehicle.y);
      $gamePlayer._vehicleType = type;
      $gamePlayer.getOnVehicle();
      
      if (!$gamePlayer.isInVehicle()) {
        $gamePlayer._vehicleGettingOn = true;
        vehicle.getOn();
      }
      
      AudioManager.playSe({ name: 'Decision1', pan: 0, pitch: 100, volume: 90 });
    }
    
    $gameTemp._vehicleToRide = null;
    $gameTemp._vehicleType = null;
  };

  const _Scene_Map_updateCallMenu = Scene_Map.prototype.updateCallMenu;
  Scene_Map.prototype.updateCallMenu = function() {
    if ($gamePlayer.isInVehicle()) {
      const vehicle = $gamePlayer.vehicle();
      if (vehicle.isShip() || vehicle.isBoat() || vehicle.isAirship()) {
        return;
      }
    }
    _Scene_Map_updateCallMenu.call(this);
  };

  // ============================================================================
  // Plugin Commands
  // ============================================================================
  
  class PluginCommands {
    static register() {
      this._registerCommand('summonCamper', () => {
        vehicleManager.summon('ship');
      });
      
      this._registerCommand('summonCar', () => {
        vehicleManager.summon('boat');
      });
      
      this._registerCommand('teleportToVehicle', (args) => {
        this._teleportToVehicle(args.vehicleType || 'ship');
      });
      
      this._registerCommand('saveCamperAndTravel', () => {
        this._saveAndTravel(VehicleConfig.CAMPER);
      });
      
      this._registerCommand('saveCarAndTravel', () => {
        this._saveAndTravel(VehicleConfig.CAR);
      });
      
      this._registerCommand('returnToCamper', () => {
        this._returnToVehicle(VehicleConfig.CAMPER, false);
      });
      
      this._registerCommand('returnToCar', () => {
        this._returnToVehicle(VehicleConfig.CAR, false);
      });
      
      this._registerCommand('returnAndRideCamper', () => {
        this._returnToVehicle(VehicleConfig.CAMPER, true);
      });
      
      this._registerCommand('returnAndRideCar', () => {
        this._returnToVehicle(VehicleConfig.CAR, true);
      });
    }
    
    static _registerCommand(name, callback) {
      PluginManager.registerCommand(PLUGIN_NAME, name, callback);
    }
    
    static _teleportToVehicle(type) {
      const vehicle = vehicleManager.getVehicle(type);
      const config = vehicleManager.getConfig(vehicle);
      
      if (!vehicle || !config) {
        window.skipLocalization = true;
        $gameMessage.add(`Cannot find ${config ? config.name.toLowerCase() : 'vehicle'} location`);
        window.skipLocalization = false;
        return;
      }
      
      const mapId = $gameVariables.value(config.vars.map);
      const x = $gameVariables.value(config.vars.x);
      const y = $gameVariables.value(config.vars.y);
      
      if (!mapId || !x || !y) return;
      
      if (mapId === $gameMap.mapId()) {
        const pos = PositionFinder.findValidPosition(x, y, $gamePlayer);
        if (pos) {
          $gamePlayer.reserveTransfer($gameMap.mapId(), pos.x, pos.y, 
                                     $gamePlayer.direction(), 0);
        }
      } else {
        vehicle.setLocation(mapId, x, y);
        const pos = PositionFinder.findValidPosition(x, y, $gamePlayer);
        if (pos) {
          $gamePlayer.reserveTransfer(mapId, pos.x, pos.y, 2, 0);
        }
      }
      
      AudioManager.playSe({ name: 'Teleport', pan: 0, pitch: 100, volume: 90 });
      $gameTemp.requestAnimation([$gamePlayer], 52);
    }
    
    static _saveAndTravel(config) {
      if ($gamePlayer.isInVehicle()) {
        $gamePlayer.getOffVehicle();
      }
      
      $gamePlayer.reserveTransfer(config.interior.mapId, 
                                 config.interior.x, 
                                 config.interior.y, 0, 0);
      
      AudioManager.playSe({ name: 'Teleport', pan: 0, pitch: 100, volume: 90 });
    }
    
    static _returnToVehicle(config, autoRide) {
      const mapId = $gameVariables.value(config.vars.map) || 315;
      const x = $gameVariables.value(config.vars.x);
      const y = $gameVariables.value(config.vars.y);
      
      const vehicle = vehicleManager.getVehicle(config.type);
      if (vehicle) {
        vehicle.setLocation(mapId, x, y);
      }
      
      $gamePlayer.reserveTransfer(mapId, x, y, 2, 0);
      
      const flagName = config.type === 'ship' ? 'Camper' : 'Car';
      $gameTemp[`_spawn${flagName}AfterTransfer`] = { x, y };
      
      if (autoRide) {
        $gameTemp[`_autoRide${flagName}AfterSpawn`] = true;
      }
      
      AudioManager.playSe({ name: 'Door1', pan: 0, pitch: 100, volume: 90 });
    }
  }
  
  // ============================================================================
  // Memory Management
  // ============================================================================
  
  const _Scene_Map_terminate = Scene_Map.prototype.terminate;
  Scene_Map.prototype.terminate = function() {
    _Scene_Map_terminate.call(this);
    
    if ($gameMap.mapId() % 10 === 0) {
      mapCache.clear();
    }
  };

  // ============================================================================
  // Initialization
  // ============================================================================
  
  const _DataManager_setupNewGame = DataManager.setupNewGame;
  DataManager.setupNewGame = function() {
    _DataManager_setupNewGame.call(this);
    ConfigManager.alwaysDash = true;
  };
  
  PluginCommands.register();
  
  window.MergedVehicleSystem = {
    version: '3.0.0',
    cache: mapCache,
    manager: vehicleManager
  };

})();
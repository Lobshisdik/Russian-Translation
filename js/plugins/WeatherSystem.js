/*:
 * @target MZ
 * @plugindesc Weather, Time & Temperature System v1.5.0 (MUSH Audio Engine Integration)
 * @author Omni-Lex
 * @help
 * ============================================================================
 * Weather, Time & Temperature System Plugin for RPG Maker MZ
 * ============================================================================
 * * This plugin creates a dynamic weather system with realistic temperature
 * and sunlight simulation that changes based on time of day, weather, seasons,
 * and the selected country.
 *
 * REQUIRES: MUSH_Audio_Engine.js (must be loaded before this plugin)
 *
 * * Features:
 * - Dynamic weather, temperature, and sunlight based on country data.
 * - Weather changes when entering maps with <Exterior> tag.
 * - Weather effects are removed in maps with <Interior> tag.
 * - Time of day tinting system based on realistic sunrise/sunset times.
 * - Screen tint is affected by temperature (blue for cold, red for hot).
 * - Screen tint is removed upon entering a battle.
 * - Interior maps are now tinted based on temperature only.
 * - Temperature simulation based on country's seasonal day/night temps.
 * - Map-specific base temperatures and forced weather.
 * - NEW v1.5.0: Integrated with MUSH Audio Engine - uses channel 4 for weather BGS
 * - NEW v1.5.0: Weather BGS plays alongside map BGS without overriding it
 * - NEW v1.5.0: Plays random rain sounds (Rain1-4) during rain/storm on exterior maps
 * - NEW v1.5.0: Plays random night ambience (5 variants) during nighttime on exterior maps
 * - NEW v1.5.0: Rain BGS has priority over night BGS
 * - Status effects applied based on weather type:
 * - Rain: Status Effect 28 (Wet)
 * - Storm: Status Effect 27 (Static)
 * - Snow: Status Effect 25 (Hot)
 * - Seeded random weather based on real time and date.
 * - Current hour saved in Variable 23.
 * - Temperature saved in Variable 61 (in Celsius).
 * - On map ID 315, country is set automatically by region ID.
 * * Map Tags:
 * - <Exterior> - Enables weather changes and time tints on this map.
 *                 Also enables weather/night BGS on MUSH Audio Engine channel 4.
 * - <Interior> - Disables time tints, but enables temperature tints.
 *                 Stops channel 4 BGS (weather sounds won't play indoors).
 * - <Dark> - Forces midnight lighting regardless of time or interior/exterior status.
 * - <Light> - Forces midday lighting regardless of time or interior/exterior status.
 * - <BaseTemp:X> - Sets base temperature for this map (X = temperature in Celsius).
 * - <ForceWeather:TYPE> - Forces specific weather on this map (none/rain/storm/snow).
 * - <Night:filename> - Overrides the night ambience sound for this map (e.g., night-ambience).
 * * Examples:
 * - <BaseTemp:25> - Sets map base temperature to 25°C.
 * - <ForceWeather:rain> - Always raining on this map.
 * - <Night:night-cricket3> - Always plays night-cricket3 at night on this map.
 *
 * MUSH Audio Engine Integration:
 * - Weather and night BGS play on channel 4 (won't override map BGS)
 * - Rain sounds: Rain1, Rain2, Rain3, Rain4 (random selection)
 * - Night sounds: night-ambience, night-ambience2, night-ambience3,
 *                 night-cricket3, night-crickets (random selection)
 * - Only plays on exterior maps
 * - Rain BGS has priority over night BGS
 * * @param weatherChangeChance
 * @text Weather Change Chance
 * @desc Chance of weather changing when entering an exterior map (0-100)
 * @type number
 * @min 0
 * @max 100
 * @default 15
 * * @param sunlightColorMode
 * @text Sunlight Color Mode
 * @desc Controls how the day/night tint cycle works on exterior maps
 * @type select
 * @option Full Cycle (Default)
 * @value full
 * @option Day Only (No tint)
 * @value day
 * @option Night Only
 * @value night
 * @option Dusk Only
 * @value dusk
 * @default full
 * * @param enableTimeDebug
 * @text Enable Time Debug
 * @desc Show console messages for time changes (for development)
 * @type boolean
 * @default false
 * * @param enableTempDebug
 * @text Enable Temperature Debug
 * @desc Show console messages for temperature changes (for development)
 * @type boolean
 * @default false
 * * @command forceWeatherChange
 * @text Force Weather Change
 * @desc Forces a random weather change immediately
 * * @command forceTimeUpdate
 * @text Force Time Update
 * @desc Forces an immediate time and tint update
 * * @command forceTemperatureUpdate
 * @text Force Temperature Update
 * @desc Forces an immediate temperature recalculation
 * * @command changeSunlightMode
 * @text Change Sunlight Mode
 * @desc Changes the sunlight color mode during gameplay
 * @command setMapExterior
 * @text Set Map to Exterior
 * @desc Forces the current map to be treated as exterior (enables weather and time tints)
 *
 * @command setMapInterior
 * @text Set Map to Interior
 * @desc Forces the current map to be treated as interior (disables time tints, keeps temperature tints)
 *
 * @command toggleMapType
 * @text Toggle Map Type
 * @desc Toggles between interior and exterior mode for the current map
 * * @arg mode
 * @text Mode
 * @desc Select the sunlight color mode
 * @type select
 * @option Full Cycle
 * @value full
 * @option Day Only
 * @value day
 * @option Night Only
 * @value night
 * @option Dusk Only
 * @value dusk
 * @default full
 * @command setCountryByRegion
 * @text Set Country by Region
 * @desc Sets the country based on the current region ID the player is standing on
 * * * @command setCurrentCountry
 * @text Set Current Country
 * @desc Sets the country for weather, temperature, and sun patterns.
 * * @arg countryId
 * @text Country ID
 * @desc The ID of the country from the Countries data list in the plugin.
 * @type number
 * @min 1
 * @default 78
 * * @command addCustomWeatherEffect
 * @text Add Custom Weather Effect
 * @desc Add custom animated weather effects using PIXI
 * * @arg effectType
 * @text Effect Type
 * @desc Type of custom weather effect
 * @type select
 * @option Fireflies
 * @value fireflies
 * @option Pollen
 * @value pollen
 * @option Leaves
 * @value leaves
 * @option Sakura Petals
 * @value sakura
 * @option Dust Storm
 * @value dust
 * @option Ash Fall
 * @value ash
 * @option Magic Particles
 * @value magic
 * @option Bubbles
 * @value bubbles
 * @option Embers
 * @value embers
 * @option Aurora
 * @value aurora
 * @default fireflies
 * * @arg intensity
 * @text Intensity
 * @desc Intensity of the effect (1-10)
 * @type number
 * @min 1
 * @max 10
 * @default 5
 * * @arg duration
 * @text Duration
 * @desc Duration of transition in frames
 * @type number
 * @min 1
 * @default 60
 * */

(() => {
  "use strict";

  const pluginName = "WeatherSystem";
  const parameters = PluginManager.parameters(pluginName);
  const weatherChangeChance = Number(parameters["weatherChangeChance"] || 15);
  const enableTimeDebug = parameters["enableTimeDebug"] === "true";
  const enableTempDebug = parameters["enableTempDebug"] === "true";

  // DEPENDENCY CHECK: Ensure MUSH Audio Engine is loaded
  if (!AudioManager.playMushBgs || !AudioManager.stopMushBgs || !AudioManager.getBgsFromChannel) {
    const errorMsg = [
      "==============================================================",
      "ERROR: WeatherSystem v1.5.0 requires MUSH_Audio_Engine.js",
      "==============================================================",
      "The WeatherSystem plugin now uses MUSH Audio Engine to play",
      "weather BGS on channel 4 without overriding map BGS.",
      "",
      "Please ensure MUSH_Audio_Engine.js is:",
      "1. Installed in your js/plugins/ folder",
      "2. Activated in the Plugin Manager",
      "3. Loaded BEFORE WeatherSystem.js",
      "=============================================================="
    ].join("\n");

    console.error(errorMsg);

    if (Utils.isNwjs() && Utils.isOptionValid('test')) {
      alert(errorMsg);
    }

    throw new Error("WeatherSystem: Missing required plugin MUSH_Audio_Engine.js");
  }

  // --- COUNTRY DATA ---
  // For organization, it's best to move this to its own JS file (e.g., countries.js)
  // and include it in your project.
  const { Countries } = window.Countries;

  const defaultCountry = Countries.find((c) => c.id === 102);

  const WeatherTypes = {
    NONE: "none",
    RAIN: "rain",
    STORM: "storm",
    SNOW: "snow",
  };

  const StatusEffects = {
    RAIN: 28,
    STORM: 28,
    SNOW: 26,
  };

  const FixedTints = {
    day: [255, 255, 255],
    night: [120, 120, 160],
    dusk: [255, 220, 150],
  };

  const WeatherTemperatureEffects = {
    none: 0,
    rain: -3,
    storm: -5,
    snow: -8,
  };

  // ============================================================================
  // PUDDLE SYSTEM - Dynamic puddle spawning during rain
  // ============================================================================
  const PUDDLE_SOURCE_MAP = 574;
  const MAX_PUDDLES = 15;
  const INITIAL_PUDDLE_COUNT = 5;
  const PUDDLE_SPAWN_INTERVAL = 10000; // 10 seconds

  // Cache for puddle template
  let cachedPuddleTemplate = null;

  // Cache for valid spawn tiles (invalidated on map change)
  let _cachedValidTiles = null;
  let _cachedValidTilesMapId = -1;

  // Backup of weather state + puddle positions saved before a scene change
  // (menu open, battle, etc.). Restored when Scene_Map resumes without a transfer.
  let _weatherBackup = null;

  /**
   * Load puddle template event from map 574
   */
  function loadPuddleTemplate() {
    if (cachedPuddleTemplate) return cachedPuddleTemplate;

    const mapFileName = `Map574.json`;

    // Try StorageManager first (desktop builds)
    try {
      if (typeof StorageManager !== "undefined" && StorageManager.fileExists) {
        const basePath = StorageManager.isLocalMode() ? "data\\" : "data/";
        const fullPath = basePath + mapFileName;

        if (StorageManager.fileExists(fullPath)) {
          const mapData = JSON.parse(StorageManager.fileRead(fullPath));
          if (mapData && mapData.events) {
            const puddleEvent = mapData.events.find(
              (e) => e && e.name === "Puddle"
            );
            if (puddleEvent) {
              cachedPuddleTemplate = puddleEvent;
              if (enableTimeDebug) {
                console.log("[Weather] Loaded puddle template from map 574");
              }
              return cachedPuddleTemplate;
            }
          }
        }
      }
    } catch (e) {
      if (enableTimeDebug) {
        console.warn(`[Weather] StorageManager load failed: ${e.message}`);
      }
    }

    // Try XHR (web builds)
    try {
      const xhr = new XMLHttpRequest();
      xhr.open("GET", `data/${mapFileName}`, false); // synchronous
      xhr.send();

      if (xhr.status === 200) {
        const mapData = JSON.parse(xhr.responseText);
        if (mapData && mapData.events) {
          const puddleEvent = mapData.events.find(
            (e) => e && e.name === "Puddle"
          );
          if (puddleEvent) {
            cachedPuddleTemplate = puddleEvent;
            if (enableTimeDebug) {
              console.log("[Weather] Loaded puddle template from map 574 (XHR)");
            }
            return cachedPuddleTemplate;
          }
        }
      }
    } catch (e) {
      if (enableTimeDebug) {
        console.warn(`[Weather] XHR load failed: ${e.message}`);
      }
    }

    console.warn("[Weather] Failed to load puddle template from map 574");
    return null;
  }

  /**
   * Find valid tiles for puddle spawning.
   * Result is cached per map ID; call invalidatePuddleTileCache() on map change.
   */
  function findPassableTilesForPuddles() {
    const currentMapId = $gameMap.mapId();
    if (_cachedValidTiles && _cachedValidTilesMapId === currentMapId) {
      return _cachedValidTiles;
    }

    // Build a set of occupied tiles from non-puddle events (O(events), not O(tiles))
    const occupiedTiles = new Set();
    for (const ev of $gameMap.events()) {
      if (!ev || ev._erased) continue;
      // Skip puddle events themselves so we don't block our own slots
      if ($gameSystem._weatherPuddles && $gameSystem._weatherPuddles.includes(ev._eventId)) continue;
      occupiedTiles.add(ev.x + "," + ev.y);
    }

    const tiles = [];
    const width = $gameMap.width();
    const height = $gameMap.height();

    for (let x = 0; x < width; x++) {
      for (let y = 0; y < height; y++) {
        if (!$gameMap.isPassable(x, y, 2)) continue;

        const region = $gameMap.regionId(x, y);
        if (region === 10 || region === 103) continue;

        if (occupiedTiles.has(x + "," + y)) continue;
        if ($gamePlayer.x === x && $gamePlayer.y === y) continue;

        const terrain = $gameMap.terrainTag(x, y);
        const isPreferredTerrain = terrain === 1 || terrain === 2 || terrain === 5 || terrain === 7;

        tiles.push({ x, y, priority: isPreferredTerrain ? 1 : 0.5 });
      }
    }

    // Stable weighted shuffle — preferred tiles first, then randomize within each tier
    const preferred = tiles.filter(t => t.priority === 1).sort(() => Math.random() - 0.5);
    const rest      = tiles.filter(t => t.priority !== 1).sort(() => Math.random() - 0.5);
    _cachedValidTiles = preferred.concat(rest);
    _cachedValidTilesMapId = currentMapId;
    return _cachedValidTiles;
  }

  function invalidatePuddleTileCache() {
    _cachedValidTiles = null;
    _cachedValidTilesMapId = -1;
  }

  /**
   * Create a puddle event at specified position
   */
  function createPuddleEvent(template, x, y) {
    if (!$gameMap || !$dataMap) return null;

    // Find next available event ID
    let nextId = $dataMap.events.length;
    while ($dataMap.events[nextId]) {
      nextId++;
    }

    // Deep clone template data
    const puddleData = JSON.parse(JSON.stringify(template));
    puddleData.id = nextId;
    puddleData.x = x;
    puddleData.y = y;

    // Add to map data
    $dataMap.events[nextId] = puddleData;

    // Create Game_Event instance
    const puddleEvent = new Game_Event($gameMap.mapId(), nextId);
    puddleEvent.locate(x, y);
    puddleEvent.refresh();

    // Freeze the event so it costs nothing per frame:
    // no auto-triggers, no movement, no condition checks.
    puddleEvent.update = function() {};

    // Add to map's event list
    $gameMap._events[nextId] = puddleEvent;

    // Add just this one new sprite instead of rebuilding all character sprites
    if (SceneManager._scene && SceneManager._scene._spriteset) {
      const spriteset = SceneManager._scene._spriteset;
      if (spriteset._tilemap && spriteset._characterSprites) {
        const sprite = new Sprite_Character(puddleEvent);
        spriteset._characterSprites.push(sprite);
        spriteset._tilemap.addChild(sprite);
      }
    }

    return nextId;
  }

  // Plugin commands
  PluginManager.registerCommand(pluginName, "forceWeatherChange", (args) => {
    $gameWeather.forceRandomChange();
  });
  PluginManager.registerCommand(pluginName, "forceTimeUpdate", (args) => {
    $gameWeather.updateTimeAndWeather();
  });
  PluginManager.registerCommand(
    pluginName,
    "forceTemperatureUpdate",
    (args) => {
      $gameWeather.updateTemperature();
    }
  );
  PluginManager.registerCommand(pluginName, "setCurrentCountry", (args) => {
    const countryId = Number(args.countryId || 78);
    $gameWeather.setCurrentCountry(countryId);
  });
  PluginManager.registerCommand(
    pluginName,
    "addCustomWeatherEffect",
    (args) => {
      const effectType = args.effectType || "fireflies";
      const intensity = Number(args.intensity || 5);
      const duration = Number(args.duration || 60);
      $gameWeather.setCustomWeather(effectType, intensity, duration);
    }
  );
  PluginManager.registerCommand(pluginName, "setCountryByRegion", (args) => {
    const regionId = $gameMap.regionId($gamePlayer.x, $gamePlayer.y);
    let countryId = regionId;

    // Check if country with this ID exists
    const countryData = Countries.find((c) => c.id === countryId);
    if (!countryData) {
      countryId = 12; // Default to ID 12 if not found
    }

    $gameWeather.setCurrentCountry(countryId);
  });
  PluginManager.registerCommand(pluginName, "setMapExterior", (args) => {
    if ($gameWeather) {
      $gameWeather.setMapExterior();
    }
  });

  PluginManager.registerCommand(pluginName, "setMapInterior", (args) => {
    if ($gameWeather) {
      $gameWeather.setMapInterior();
    }
  });

  PluginManager.registerCommand(pluginName, "toggleMapType", (args) => {
    if ($gameWeather) {
      $gameWeather.toggleMapType();
    }
  });

  class Window_CountryPopup extends Window_Base {
    constructor() {
      const rect = new Rectangle(20, 20, 400, 120);
      super(rect);
      this.isVisible = false;
      this.fadeTimer = 0;
      this.displayDuration = 180; // 3 seconds at 60fps
      this.fadeInDuration = 30; // 0.5 seconds
      this.fadeOutDuration = 30; // 0.5 seconds
      this.countryName = "";
      this.superpowerName = "";
      this.opacity = 0;
      this.visible = false;
      this.refresh();
    }

    show(countryName, superpowerName) {
      this.countryName = countryName;
      this.superpowerName = superpowerName || "";
      this.isVisible = true;
      this.visible = true;
      this.fadeTimer = 0;
      this.opacity = 0;
      this.refresh();
    }

    refresh() {
      this.contents.clear();
      if (!this.countryName) return;

      // Set text color to gold/yellow
      this.changeTextColor(ColorManager.textColor(17)); // Gold color

      // Draw country name
      this.drawText(this.countryName, 0, 0, this.contentsWidth(), "left");

      // Draw superpower name if it exists
      if (this.superpowerName) {
        this.drawText(
          `${this.superpowerName}`,
          0,
          this.lineHeight(),
          this.contentsWidth(),
          "left"
        );
      }

      // Reset text color
      this.resetTextColor();
    }

    update() {
      super.update();

      if (!this.isVisible) return;

      this.fadeTimer++;

      if (this.fadeTimer <= this.fadeInDuration) {
        // Fade in
        this.opacity = Math.floor((this.fadeTimer / this.fadeInDuration) * 255);
      } else if (this.fadeTimer <= this.displayDuration) {
        // Stay visible
        this.opacity = 255;
      } else if (
        this.fadeTimer <=
        this.displayDuration + this.fadeOutDuration
      ) {
        // Fade out
        const fadeOutProgress =
          (this.fadeTimer - this.displayDuration) / this.fadeOutDuration;
        this.opacity = Math.floor((1 - fadeOutProgress) * 255);
      } else {
        // Hide completely
        this.isVisible = false;
        this.visible = false;
        this.opacity = 0;
      }
    }
  }

  // Helper function to parse game date from Variable 113
  function getGameDateFromVariable() {
    const dateStr = $gameVariables.value(113) || "01 JAN 2001 12:00";
    // Format: "01 JAN 2001 12:00"
    const parts = dateStr.split(" ");
    if (parts.length < 4) {
      return { day: 1, month: 0, year: 2001, hours: 8, minutes: 0 };
    }

    const day = parseInt(parts[0]);
    const monthStr = parts[1].toUpperCase();
    const year = parseInt(parts[2]);
    const timeStr = parts[3].split(":");
    const hours = parseInt(timeStr[0]);
    const minutes = parseInt(timeStr[1]);

    const months = [
      "JAN",
      "FEB",
      "MAR",
      "APR",
      "MAY",
      "JUN",
      "JUL",
      "AUG",
      "SEP",
      "OCT",
      "NOV",
      "DEC",
    ];
    const month = months.indexOf(monthStr);

    return { day, month, year, hours, minutes };
  }

  // Helper function to get season from game date
  function getGameSeasonFromVariable() {
    const date = getGameDateFromVariable();
    const month = date.month;
    if (month >= 2 && month <= 4) return "SPRING";
    if (month >= 5 && month <= 7) return "SUMMER";
    if (month >= 8 && month <= 10) return "AUTUMN";
    return "WINTER";
  }

  // Helper function to get day of year from game date
  function getGameDayOfYearFromVariable() {
    const date = getGameDateFromVariable();
    const tempDate = new Date(date.year, date.month, date.day);
    const start = new Date(date.year, 0, 0);
    const diff = tempDate - start;
    const oneDay = 1000 * 60 * 60 * 24;
    return Math.floor(diff / oneDay);
  }

  // Weather, Time & Temperature System Manager
  class Game_WeatherTimeSystem {
    constructor() {
      this.currentWeatherType = WeatherTypes.NONE;
      this.isInterior = false;
      this.forcedLighting = null; // null = normal, 'dark' = midnight, 'light' = midday
      this.customWeatherType = null;
      this.customWeatherIntensity = 0;
      this.currentHour = 12;
      this.currentTintIndex = 12;
      this.targetTintIndex = 12;
      this.tintTransitionProgress = 1.0;
      this.tintTransitionDuration = 60;
      this.currentTemperature = 20;
      this.mapBaseTemperature = null;
      this.mapForcedWeather = null;
      this.mapCustomNightSound = null; // Custom night sound for this map

      this.dynamicTints = []; // For country-based tints
      this.currentCountry = defaultCountry; // Initialize with default

      this._lastCheckedRegionId = -1; // MODIFICATION: For world map region tracking
      $gameVariables.setValue(80, -1);

      // Puddle system
      this._lastPuddleSpawnTime = 0;

      this.initialize();
    }

    initialize() {
      this.updateTimeAndWeather();
    }
    getWeatherDisplayName() {
      switch (this.currentWeatherType) {
        case WeatherTypes.NONE:
          return "Clear";
        case WeatherTypes.RAIN:
          return "Rain";
        case WeatherTypes.STORM:
          return "Storm";
        case WeatherTypes.SNOW:
          return "Snow";
        default:
          return "Unknown";
      }
    }
    setCurrentCountry(countryId) {
      const countryData = Countries.find((c) => c.id === countryId);
      if (countryData) {
        this.currentCountry = countryData;
        $gameVariables.setValue(86, countryId);

        if (enableTimeDebug) {
          console.log(`Country set to: ${this.currentCountry.country}`);
        }
      } else {
        this.currentCountry = defaultCountry;
        $gameVariables.setValue(86, 255);
        console.warn(`Country with ID ${countryId} not found. Using default.`);
      }
      this.forceTimeUpdate();
    }

    _parseTime(timeStr) {
      if (!timeStr || !timeStr.includes(":")) return 6; // Default to 6 AM if invalid
      const [h, m] = timeStr.split(":").map(Number);
      return h + m / 60;
    }

    _interpolateColor(color1, color2, factor) {
      const r = Math.round(color1[0] + factor * (color2[0] - color1[0]));
      const g = Math.round(color1[1] + factor * (color2[1] - color1[1]));
      const b = Math.round(color1[2] + factor * (color2[2] - color1[2]));
      return [r, g, b];
    }

    _generateDynamicTints() {
      const season = this.getSeason().toLowerCase();
      const seasonData = this.currentCountry.seasons[season];
      if (!seasonData) return;

      const sunrise = this._parseTime(seasonData.sunrise);
      const sunset = this._parseTime(seasonData.sunset);

      const solarNoon = sunrise + (sunset - sunrise) / 2;
      const solarMidnight = ((sunset + (24 + sunrise)) / 2) % 24;

      // Enhanced keyframes with golden hour tints at sunrise and sunset
      const keyFrames = [
        { hour: solarMidnight, color: [60, 60, 120] }, // Midnight - Darkest night
        { hour: sunrise - 1.5, color: [80, 80, 140] }, // Pre-dawn - Getting lighter
        { hour: sunrise - 0.75, color: [150, 100, 120] }, // Early dawn - Purple/pink pre-sunrise
        { hour: sunrise - 0.25, color: [255, 150, 80] }, // Dawn golden hour begins - Deep orange
        { hour: sunrise, color: [255, 180, 90] }, // Sunrise golden hour - Warm golden orange
        { hour: sunrise + 0.25, color: [255, 200, 110] }, // Post-sunrise - Golden yellow
        { hour: sunrise + 0.75, color: [255, 220, 140] }, // Morning golden hour fading
        { hour: sunrise + 1.5, color: [250, 240, 200] }, // Late morning - Soft warm light
        { hour: solarNoon, color: [255, 255, 255] }, // Noon - Bright white
        { hour: sunset - 1.5, color: [250, 240, 200] }, // Early evening - Soft warm light
        { hour: sunset - 0.75, color: [255, 220, 130] }, // Pre-sunset golden hour begins
        { hour: sunset - 0.25, color: [255, 190, 100] }, // Sunset golden hour - Rich golden
        { hour: sunset, color: [255, 170, 80] }, // Sunset peak - Deep golden orange
        { hour: sunset + 0.25, color: [255, 150, 90] }, // Post-sunset - Warm orange fading
        { hour: sunset + 0.75, color: [220, 130, 150] }, // Dusk - Purple/pink twilight
        { hour: sunset + 1.5, color: [150, 130, 170] }, // Late dusk - Blue hour begins
        { hour: sunset + 3, color: [120, 110, 160] }, // Early night - Darker still
        { hour: sunset + 5, color: [90, 90, 150] }, // Deep night - Very dark
        { hour: (sunset + 24 + solarMidnight) / 2, color: [70, 70, 130] }, // Mid-evening - Nearly midnight darkness
      ].sort((a, b) => a.hour - b.hour);

      const lastFrame = keyFrames[keyFrames.length - 1];
      keyFrames.unshift({ hour: lastFrame.hour - 24, color: lastFrame.color });
      const firstFrame = keyFrames[1];
      keyFrames.push({ hour: firstFrame.hour + 24, color: firstFrame.color });

      this.dynamicTints = [];
      // Generate tints for each hour (24 entries total)
      for (let h = 0; h < 24; h++) {
        let startFrame, endFrame;
        for (let i = 0; i < keyFrames.length - 1; i++) {
          if (h >= keyFrames[i].hour && h < keyFrames[i + 1].hour) {
            startFrame = keyFrames[i];
            endFrame = keyFrames[i + 1];
            break;
          }
        }

        if (startFrame && endFrame) {
          // Smooth interpolation between keyframes
          const frameDuration = endFrame.hour - startFrame.hour;
          const progress =
            frameDuration > 0 ? (h - startFrame.hour) / frameDuration : 0;
          this.dynamicTints.push(
            this._interpolateColor(startFrame.color, endFrame.color, progress)
          );
        } else {
          this.dynamicTints.push([255, 255, 255]); // Failsafe
        }
      }
    }
    setMapExterior() {
      const wasInterior = this.isInterior;
      this.isInterior = false;

      if (enableTimeDebug) {
        console.log(`Map manually set to EXTERIOR mode`);
      }

      // If we were previously interior, initialize exterior settings
      if (wasInterior) {
        // Reset tint transition to current time
        this.currentTintIndex = this.currentHour;
        this.targetTintIndex = this.currentHour;
        this.tintTransitionProgress = 1.0;

        // Update weather and time
        this.updateTimeAndWeather();

        // Apply weather based on forced weather or random chance
        if (this.mapForcedWeather !== null) {
          this.setWeather(this.mapForcedWeather);
        } else {
          // Always trigger weather change when switching to exterior
          this.changeWeather();
        }

        // NEW BGS SYSTEM - Start playing BGS when switching to exterior
        this.updateEnvironmentBgs();
      }

      // Update tinting to include time-of-day effects
      this.updateTimeOfDayTint();
    }

    // Add this method to Game_WeatherTimeSystem class
    setMapInterior() {
      const wasExterior = !this.isInterior;
      this.isInterior = true;

      if (enableTimeDebug) {
        console.log(`Map manually set to INTERIOR mode`);
      }

      // MUSH AUDIO ENGINE - Stop channel 4 BGS when switching to interior
      this.stopWeatherBgs();

      // Clear weather effects when switching to interior
      if (wasExterior) {
        this.clearWeather();
      }

      // Update temperature (in case it changed)
      this.updateTemperature();

      // Apply interior tinting (temperature only, no time effects)
      this.updateTimeOfDayTint();
    }

    // Add this method to Game_WeatherTimeSystem class
    toggleMapType() {
      if (this.isInterior) {
        this.setMapExterior();
      } else {
        this.setMapInterior();
      }
    }

    // Add this method to Game_WeatherTimeSystem class to get current status
    getMapTypeStatus() {
      return this.isInterior ? "Interior" : "Exterior";
    }
    getTintForMode() {
      // Always use full cycle mode
      if (this.dynamicTints.length !== 24) return [255, 255, 255]; // Failsafe
      return this.dynamicTints[this.currentHour];
    }

    updateTimeAndWeather() {
      this._generateDynamicTints(); // Generate tints based on current country/season

      const gameDate = getGameDateFromVariable();
      const newHour = gameDate.hours;

      this.dayOfYear = getGameDayOfYearFromVariable();
      this.seed = this.dayOfYear * 24 + newHour;

      const hourChanged = this.currentHour !== newHour;
      if (hourChanged) {
        const oldHour = this.currentHour;
        this.currentHour = newHour;

        if ($gameVariables) {
          $gameVariables.setValue(23, this.currentHour);
        }

        this.startTintTransition(newHour);

        // NEW BGS SYSTEM - Update BGS when hour changes (for day/night transitions)
        this.updateEnvironmentBgs();

        if (enableTimeDebug) {
          console.log(
            `Time synchronized to: ${
              this.currentHour
            }:00 (from Variable 113: ${$gameVariables.value(113)})`
          );
        }
      }

      this.updateTemperature();
    }

    getDayOfYear(date) {
      const start = new Date(date.getFullYear(), 0, 0);
      const diff = date - start;
      const oneDay = 1000 * 60 * 60 * 24;
      return Math.floor(diff / oneDay);
    }

    getSeason() {
      return getGameSeasonFromVariable();
    }

    seededRandom() {
      this.seed = (this.seed * 1103515245 + 12345) & 0x7fffffff;
      return this.seed / 0x7fffffff;
    }

    changeWeather() {
      const gameDate = getGameDateFromVariable();
      this.dayOfYear = getGameDayOfYearFromVariable();
      this.currentHour = gameDate.hours;
      this.seed = this.dayOfYear * 24 + this.currentHour;

      const newWeather = this.determineWeather();
      this.setWeather(newWeather);
    }

    determineWeather() {
      const season = this.getSeason().toLowerCase();
      const seasonData = this.currentCountry.seasons[season];
      if (!seasonData) {
        console.error(
          `No season data for ${season} in ${this.currentCountry.country}`
        );
        return WeatherTypes.NONE;
      }

      const { precipitation } = seasonData;
      const random = this.seededRandom() * 100;

      const precipChance = Math.min(70, precipitation * 10);

      if (random > precipChance) {
        return WeatherTypes.NONE;
      }

      if (this.currentTemperature <= 1) {
        return WeatherTypes.SNOW;
      } else {
        return this.seededRandom() < 0.25
          ? WeatherTypes.STORM
          : WeatherTypes.RAIN;
      }
    }

    updateTemperature() {
      const season = this.getSeason().toLowerCase();
      const seasonData = this.currentCountry.seasons[season];
      if (!seasonData) {
        console.error(
          `No season data for ${season} in ${this.currentCountry.country}`
        );
        return;
      }

      const { dayTemp, nightTemp, sunrise, sunset } = seasonData;

      const sunriseHour = this._parseTime(sunrise);
      const sunsetHour = this._parseTime(sunset);
      const gameDate = getGameDateFromVariable();
      const currentHourFloat = gameDate.hours + gameDate.minutes / 60;

      let baseTemperature;
      const peakTempHour = sunriseHour + (sunsetHour - sunriseHour) * 0.6;

      if (currentHourFloat >= sunriseHour && currentHourFloat <= sunsetHour) {
        // Daytime
        const sunriseTemp = (dayTemp + nightTemp) / 2;
        if (currentHourFloat <= peakTempHour) {
          const progress =
            (currentHourFloat - sunriseHour) / (peakTempHour - sunriseHour);
          baseTemperature =
            sunriseTemp +
            (dayTemp - sunriseTemp) * Math.sin((progress * Math.PI) / 2);
        } else {
          const sunsetTemp = sunriseTemp;
          const progress =
            (currentHourFloat - peakTempHour) / (sunsetHour - peakTempHour);
          baseTemperature =
            dayTemp +
            (sunsetTemp - dayTemp) * Math.sin((progress * Math.PI) / 2);
        }
      } else {
        // Nighttime
        const sunsetTemp = (dayTemp + nightTemp) / 2;
        let progress;
        if (currentHourFloat > sunsetHour) {
          progress =
            (currentHourFloat - sunsetHour) / (24 + sunriseHour - sunsetHour);
        } else {
          progress =
            (24 + currentHourFloat - sunsetHour) /
            (24 + sunriseHour - sunsetHour);
        }
        baseTemperature =
          sunsetTemp +
          (nightTemp - sunsetTemp) * Math.sin((progress * Math.PI) / 2);
      }

      let temperature = baseTemperature;
      temperature += WeatherTemperatureEffects[this.currentWeatherType] || 0;

      if (this.mapBaseTemperature !== null) {
        const timeVariation = baseTemperature - (dayTemp + nightTemp) / 2;
        const weatherEffect =
          WeatherTemperatureEffects[this.currentWeatherType] || 0;
        temperature = this.mapBaseTemperature + timeVariation + weatherEffect;
      }

      // NEW: If on procedural map 636, blend with biome temperature
      if ($gameMap && $gameMap.mapId() === 636 && $gameSystem._procGenData) {
        const procGenData = $gameSystem._procGenData;
        const biomeDayTemp = procGenData.biomeDayTemperature;
        const biomeNightTemp = procGenData.biomeNightTemperature;

        if (biomeDayTemp !== undefined && biomeNightTemp !== undefined) {
          // Calculate biome temperature based on current time
          let biomeTemperature;
          if (
            currentHourFloat >= sunriseHour &&
            currentHourFloat <= sunsetHour
          ) {
            // Daytime - use day temperature
            const progress =
              (currentHourFloat - sunriseHour) / (sunsetHour - sunriseHour);
            biomeTemperature =
              biomeNightTemp +
              (biomeDayTemp - biomeNightTemp) *
                Math.sin((progress * Math.PI) / 2);
          } else {
            // Nighttime - use night temperature
            let nightProgress;
            if (currentHourFloat > sunsetHour) {
              nightProgress =
                (currentHourFloat - sunsetHour) /
                (24 + sunriseHour - sunsetHour);
            } else {
              nightProgress =
                (24 + currentHourFloat - sunsetHour) /
                (24 + sunriseHour - sunsetHour);
            }
            biomeTemperature =
              (biomeDayTemp + biomeNightTemp) / 2 +
              (biomeNightTemp - (biomeDayTemp + biomeNightTemp) / 2) *
                Math.sin((nightProgress * Math.PI) / 2);
          }

          // Calculate median between country temperature and biome temperature
          const countryTemp = temperature;
          temperature = (countryTemp + biomeTemperature) / 2;

          if (enableTempDebug) {
            console.log(`[Map 636] Biome temperature blend:`);
            console.log(`- Country temp: ${countryTemp.toFixed(2)}°C`);
            console.log(`- Biome temp: ${biomeTemperature.toFixed(2)}°C`);
            console.log(`- Median temp: ${temperature.toFixed(2)}°C`);
          }
        }
      }

      const newTemperature = Math.round(temperature);

      if (this.currentTemperature !== newTemperature) {
        this.currentTemperature = newTemperature;
        if ($gameVariables)
          $gameVariables.setValue(61, this.currentTemperature);

        if (enableTempDebug) {
          console.log(`Temperature updated to: ${this.currentTemperature}°C`);
          console.log(`- Base calc: ${baseTemperature.toFixed(2)}°C`);
          console.log(`- Country: ${this.currentCountry.country}`);
          console.log(
            `- Weather: ${this.getWeatherName()} (${
              WeatherTemperatureEffects[this.currentWeatherType] || 0
            }°C)`
          );
        }
      }
    }

    getWeatherName() {
      return (
        Object.keys(WeatherTypes).find(
          (key) => WeatherTypes[key] === this.currentWeatherType
        ) || "Unknown"
      );
    }

    startTintTransition(targetHour) {
      if (this.sunlightMode !== "full") return;
      this.targetTintIndex = targetHour;
      this.tintTransitionProgress = 0.0;
      if (enableTimeDebug) {
        console.log(
          `Starting tint transition from ${this.currentTintIndex} to ${this.targetTintIndex}`
        );
      }
    }

    _getTemperatureTintEffect() {
      const temp = this.currentTemperature;

      const COLD_THRESHOLD = 5;
      const EXTREME_COLD = -20;
      const HOT_THRESHOLD = 25;
      const EXTREME_HOT = 40;

      const EXTREME_COLD_TINT = [-20, 0, 50]; // r, g, b offsets for ice blue
      const EXTREME_HOT_TINT = [40, 20, -20]; // r, g, b offsets for red/orange
      const NEUTRAL_TINT = [0, 0, 0];

      let r = 0,
        g = 0,
        b = 0;

      if (temp < COLD_THRESHOLD) {
        const progress =
          (COLD_THRESHOLD - temp) / (COLD_THRESHOLD - EXTREME_COLD);
        const clampedProgress = Math.max(0, Math.min(1, progress));
        r =
          NEUTRAL_TINT[0] +
          (EXTREME_COLD_TINT[0] - NEUTRAL_TINT[0]) * clampedProgress;
        g =
          NEUTRAL_TINT[1] +
          (EXTREME_COLD_TINT[1] - NEUTRAL_TINT[1]) * clampedProgress;
        b =
          NEUTRAL_TINT[2] +
          (EXTREME_COLD_TINT[2] - NEUTRAL_TINT[2]) * clampedProgress;
      } else if (temp > HOT_THRESHOLD) {
        const progress = (temp - HOT_THRESHOLD) / (EXTREME_HOT - HOT_THRESHOLD);
        const clampedProgress = Math.max(0, Math.min(1, progress));
        r =
          NEUTRAL_TINT[0] +
          (EXTREME_HOT_TINT[0] - NEUTRAL_TINT[0]) * clampedProgress;
        g =
          NEUTRAL_TINT[1] +
          (EXTREME_HOT_TINT[1] - NEUTRAL_TINT[1]) * clampedProgress;
        b =
          NEUTRAL_TINT[2] +
          (EXTREME_HOT_TINT[2] - NEUTRAL_TINT[2]) * clampedProgress;
      }

      return [Math.round(r), Math.round(g), Math.round(b)];
    }

    // --- MODIFICATION START ---
    // Modified function to handle interior and exterior tinting rules
    updateTimeOfDayTint() {
      let timeOffsetR = 0,
        timeOffsetG = 0,
        timeOffsetB = 0;

      // Forced lighting overrides: Dark = midnight (hour 0), Light = midday (hour 12)
      if (this.forcedLighting === 'dark') {
        const [timeTintR, timeTintG, timeTintB] = this.getTintForTimeFloat(0);
        timeOffsetR = timeTintR - 255;
        timeOffsetG = timeTintG - 255;
        timeOffsetB = timeTintB - 255;
      } else if (this.forcedLighting === 'light') {
        const [timeTintR, timeTintG, timeTintB] = this.getTintForTimeFloat(12);
        timeOffsetR = timeTintR - 255;
        timeOffsetG = timeTintG - 255;
        timeOffsetB = timeTintB - 255;
      } else if (!this.isInterior) {
        // Apply time-of-day tint ONLY for exteriors (always using full cycle mode)
        // Smooth tint transition based on current hour and minutes
        const gameDate = getGameDateFromVariable();
        const currentHourFloat = gameDate.hours + gameDate.minutes / 60;

        // Get tint for current hour (with smooth interpolation within the hour)
        const [timeTintR, timeTintG, timeTintB] =
          this.getTintForTimeFloat(currentHourFloat);
        timeOffsetR = timeTintR - 255;
        timeOffsetG = timeTintG - 255;
        timeOffsetB = timeTintB - 255;
      }

      // Get the temperature-based tint offset for BOTH interiors and exteriors
      const [tempOffsetR, tempOffsetG, tempOffsetB] =
        this._getTemperatureTintEffect();

      // Combine the offsets
      let finalOffsetR = timeOffsetR + tempOffsetR;
      let finalOffsetG = timeOffsetG + tempOffsetG;
      let finalOffsetB = timeOffsetB + tempOffsetB;

      // Clamp the final values to ensure they are within the valid range for startTint
      finalOffsetR = Math.max(-255, Math.min(255, finalOffsetR));
      finalOffsetG = Math.max(-255, Math.min(255, finalOffsetG));
      finalOffsetB = Math.max(-255, Math.min(255, finalOffsetB));

      $gameScreen.startTint([finalOffsetR, finalOffsetG, finalOffsetB, 0], 0);
    }

    // New method for smooth hourly tint interpolation
    getTintForTimeFloat(hourFloat) {
      if (this.dynamicTints.length !== 24) return [255, 255, 255]; // Failsafe

      const currentHour = Math.floor(hourFloat);
      const nextHour = (currentHour + 1) % 24;
      const progress = hourFloat - currentHour;

      const currentTint = this.dynamicTints[currentHour];
      const nextTint = this.dynamicTints[nextHour];

      return this._interpolateColor(currentTint, nextTint, progress);
    }
    // --- MODIFICATION END ---

    clearTimeOfDayTint() {
      $gameScreen.startTint([0, 0, 0, 0], 30);
    }

    parseMapTags() {
      if (!$dataMap || !$dataMap.meta) return;

      this.mapBaseTemperature = null;
      if ($dataMap.meta.BaseTemp !== undefined) {
        const baseTemp = parseInt($dataMap.meta.BaseTemp);
        if (!isNaN(baseTemp)) {
          this.mapBaseTemperature = baseTemp;
        }
      }

      this.mapForcedWeather = null;
      if ($dataMap.meta.ForceWeather !== undefined) {
        const weatherStr = $dataMap.meta.ForceWeather.toLowerCase();
        if (Object.values(WeatherTypes).includes(weatherStr)) {
          this.mapForcedWeather = weatherStr;
        }
      }

      // Parse Night tag for custom night ambience
      this.mapCustomNightSound = null;
      if ($dataMap.meta.Night !== undefined) {
        const nightSound = $dataMap.meta.Night.trim();
        if (nightSound.length > 0) {
          this.mapCustomNightSound = nightSound;
          if (enableTimeDebug) {
            console.log(`[Map Tag] Custom night sound set to: ${nightSound}`);
          }
        }
      }

      // Parse Country tag (only when NOT on world map 315)
      if ($gameMap.mapId() !== 315 && $dataMap.meta.Country !== undefined) {
        const countryName = $dataMap.meta.Country.trim();
        const matchedCountry = Countries.find(
          (c) => c.country.toLowerCase() === countryName.toLowerCase()
        );

        if (matchedCountry) {
          this.setCurrentCountry(matchedCountry.id);
          if (enableTimeDebug) {
            console.log(
              `[Map Tag] Country set to: ${matchedCountry.country} (ID: ${matchedCountry.id})`
            );
          }
        } else {
          console.warn(
            `[Map Tag] Country "${countryName}" not found in Countries data`
          );
        }
      }
    }

    // --- MODIFICATION START ---
    // Modified function to handle tinting correctly on map load
    checkMapTags(isNewMap = true) {
      if (!$dataMap || !$dataMap.meta) return;

      const wasInterior = this.isInterior;
      const hasInteriorTag = !!$dataMap.meta.Interior;
      const hasExteriorTag = !!$dataMap.meta.Exterior;
      const hasCoveredTag = !!$dataMap.meta.Covered; // NEW: Check for Covered tag
      const hasDarkTag = !!$dataMap.meta.Dark;
      const hasLightTag = !!$dataMap.meta.Light;

      // Set forced lighting override based on Dark/Light tags
      if (hasDarkTag) {
        this.forcedLighting = 'dark';
      } else if (hasLightTag) {
        this.forcedLighting = 'light';
      } else {
        this.forcedLighting = null;
      }

      // Check if on procedural map 636 and underground
      const isUnderground =
        $gameMap.mapId() === 636 &&
        $gameSystem._procGenData &&
        $gameSystem._procGenData.biomeLayerStack &&
        $gameSystem._procGenData.biomeLayerStack.length > 0;

      // Modified logic: Interior if has Interior tag, OR if it's covered, OR if underground on map 636, OR if no tags at all
      this.isInterior =
        hasInteriorTag ||
        hasCoveredTag ||
        isUnderground ||
        (!hasInteriorTag && !hasExteriorTag);

      this.parseMapTags();
      // NEW: Special handling for covered maps - treat them like interiors but with different messaging
      if (this.isInterior) {
        // MUSH AUDIO ENGINE - Stop channel 4 BGS when entering interior
        this.stopWeatherBgs();

        // PUDDLE SYSTEM - Clear puddles when entering interior
        this.clearPuddles();

        this.clearWeather();
        this.updateTemperature();
        this.updateTimeOfDayTint(); // Apply temperature tint only

        // NEW: Different debug messages for covered vs interior
        if (enableTimeDebug) {
          if (isUnderground) {
            console.log(
              "Map loaded: UNDERGROUND CAVE (weather/light/BGS disabled)"
            );
          } else if (hasCoveredTag) {
            console.log("Map loaded: COVERED (weather/light/BGS disabled)");
          } else if (hasInteriorTag) {
            console.log("Map loaded: INTERIOR (channel 4 BGS disabled)");
          } else {
            console.log("Map loaded: DEFAULT INTERIOR (no tags, channel 4 BGS disabled)");
          }
        }
      } else if (hasExteriorTag) {
        this.updateTimeAndWeather();

        if (wasInterior) {
          this.currentTintIndex = this.currentHour;
          this.targetTintIndex = this.currentHour;
          this.tintTransitionProgress = 1.0;
        }

        this.updateTimeOfDayTint();

        if (this.mapForcedWeather !== null) {
          this.setWeather(this.mapForcedWeather);
        } else if (isNewMap && Math.random() * 100 < weatherChangeChance) {
          this.changeWeather();
        } else {
          this.setWeather(this.currentWeatherType); // re-apply current weather
        }

        // MUSH AUDIO ENGINE - Trigger BGS update when entering exterior map
        this.updateEnvironmentBgs();

        // PUDDLE SYSTEM - Spawn puddles if it's already raining
        if (
          this.currentWeatherType === WeatherTypes.RAIN ||
          this.currentWeatherType === WeatherTypes.STORM
        ) {
          this.spawnPuddles(INITIAL_PUDDLE_COUNT);
          this._lastPuddleSpawnTime = Date.now();
        }

        if (enableTimeDebug) {
          console.log("Map loaded: EXTERIOR (weather/light/channel 4 BGS enabled)");
        }
      }
    }

    // --- MODIFICATION END ---

    forceRandomChange() {
      const types = Object.values(WeatherTypes);
      const newWeather = types[Math.floor(Math.random() * types.length)];
      this.setWeather(newWeather);
    }

    forceTimeUpdate() {
      this.updateTimeAndWeather();
      this.updateTimeOfDayTint();
    }

    // MUSH AUDIO ENGINE BGS SYSTEM - Channel 4 for weather/environment BGS
    // This ensures weather BGS doesn't override map BGS

    // Play random rain BGS on channel 4
    playRandomRainBgs() {
      if (!this.isExterior()) return;

      // Check if a rain BGS is already playing on channel 4
      const currentBgs = AudioManager.getBgsFromChannel(4);
      if (currentBgs && currentBgs.name && currentBgs.name.startsWith('rain')) {
        // Already playing a rain sound, don't change it
        return;
      }

      const rainSounds = ['rain-calming', 'rain-calming2', 'rain-gentle', 'rain-light','rain-liquid','rain-shower'];
      const randomRain = rainSounds[Math.floor(Math.random() * rainSounds.length)];

      const bgsSetting = {
        name: randomRain,
        volume: 90,
        pitch: 100,
        pan: 0
      };

      // Play on channel 4, don't auto-remove, pause during battle
      AudioManager.playMushBgs(bgsSetting, 4, false, 'Pause');

      if (enableTimeDebug) {
        console.log(`[MUSH Audio] Playing rain BGS on channel 4: ${randomRain}`);
      }
    }

    // Play random night BGS on channel 4
    playRandomNightBgs() {
      if (!this.isExterior()) return;

      // Don't play night BGS if it's raining (rain has priority)
      if (this.currentWeatherType === WeatherTypes.RAIN ||
          this.currentWeatherType === WeatherTypes.STORM) {
        return;
      }

      // Determine which night sound to play
      let nightSound;

      if (this.mapCustomNightSound !== null) {
        // Use custom night sound for this map
        nightSound = this.mapCustomNightSound;

        // Check if this exact custom sound is already playing
        const currentBgs = AudioManager.getBgsFromChannel(4);
        if (currentBgs && currentBgs.name === nightSound) {
          // Already playing the correct custom sound, don't restart it
          return;
        }
      } else {
        // Use random night sound from default array
        // Check if a night BGS is already playing on channel 4
        const currentBgs = AudioManager.getBgsFromChannel(4);
        if (currentBgs && currentBgs.name &&
            (currentBgs.name.includes('night') || currentBgs.name.includes('cricket'))) {
          // Already playing a night sound, don't change it
          return;
        }

        const nightSounds = ['night-ambience', 'night-ambience2', 'night-ambience3', 'night-cricket3', 'night-crickets'];
        nightSound = nightSounds[Math.floor(Math.random() * nightSounds.length)];
      }

      const bgsSetting = {
        name: nightSound,
        volume: 70,
        pitch: 100,
        pan: 0
      };

      // Play on channel 4, don't auto-remove, pause during battle
      AudioManager.playMushBgs(bgsSetting, 4, false, 'Pause');

      if (enableTimeDebug) {
        console.log(`[MUSH Audio] Playing night BGS on channel 4: ${nightSound}${this.mapCustomNightSound ? ' (custom)' : ''}`);
      }
    }

    // Check if current time is night
    isNightTime() {
      const season = this.getSeason().toLowerCase();
      const seasonData = this.currentCountry.seasons[season];
      if (!seasonData) return false;

      const sunsetHour = this._parseTime(seasonData.sunset);
      const sunriseHour = this._parseTime(seasonData.sunrise);

      // Night is after sunset or before sunrise
      if (sunsetHour < sunriseHour) {
        // Normal case (sunset before midnight, sunrise after midnight)
        return this.currentHour >= sunsetHour || this.currentHour < sunriseHour;
      } else {
        // Edge case (polar regions)
        return this.currentHour >= sunsetHour && this.currentHour < sunriseHour;
      }
    }

    // Check if map is exterior
    isExterior() {
      return !this.isInterior;
    }

    // Update BGS based on weather and time (using MUSH Audio Engine channel 4)
    updateEnvironmentBgs() {
      if (!this.isExterior()) {
        // Stop channel 4 BGS when entering interior
        this.stopWeatherBgs();
        return;
      }

      // Priority 1: Rain BGS
      if (this.currentWeatherType === WeatherTypes.RAIN ||
          this.currentWeatherType === WeatherTypes.STORM) {
        this.playRandomRainBgs();
        return;
      }

      // Priority 2: Night BGS
      if (this.isNightTime()) {
        this.playRandomNightBgs();
        return;
      }

      // No special BGS needed, stop channel 4
      this.stopWeatherBgs();
    }

    // Stop weather BGS on channel 4
    stopWeatherBgs() {
      // Don't stop rain BGS if player is in any vehicle
      if ($gamePlayer.isInVehicle() && $gamePlayer.vehicle().isShip()) {
        if (enableTimeDebug) {
          console.log("[MUSH Audio] Weather BGS kept playing - player in vehicle");
        }
        return;
      }

      // Stop BGS on channel 4 (MUSH Audio Engine)
      if (AudioManager.getBgsFromChannel && AudioManager.getBgsFromChannel(4)) {
        AudioManager.stopMushBgs(4);
        if (enableTimeDebug) {
          console.log("[MUSH Audio] Weather BGS stopped on channel 4");
        }
      }
    }

    // Legacy method for compatibility (now redirects to MUSH system)
    stopRainBgs() {
      this.stopWeatherBgs();
    }
    setWeather(weatherType) {
      if (this.isInterior) return;

      const oldWeather = this.currentWeatherType;
      this.currentWeatherType = weatherType;

      // Update window.weatherName whenever weather changes
      window.weatherName = this.getWeatherDisplayName();

      switch (weatherType) {
        case WeatherTypes.NONE:
          $gameScreen.changeWeather("none", 0, 60);
          break;
        case WeatherTypes.RAIN:
          $gameScreen.changeWeather("rain", 7, 60);
          break;
        case WeatherTypes.STORM:
          $gameScreen.changeWeather("storm", 9, 60);
          break;
        case WeatherTypes.SNOW:
          $gameScreen.changeWeather("snow", 5, 60);
          break;
      }

      // NEW BGS SYSTEM - Update BGS when weather changes
      this.updateEnvironmentBgs();

      // PUDDLE SYSTEM - Spawn puddles when rain starts, clear when it stops
      if (weatherType === WeatherTypes.RAIN || weatherType === WeatherTypes.STORM) {
        if (oldWeather !== WeatherTypes.RAIN && oldWeather !== WeatherTypes.STORM) {
          // Rain just started - spawn initial puddles
          this.spawnPuddles(INITIAL_PUDDLE_COUNT);
          this._lastPuddleSpawnTime = Date.now();
        }
      } else {
        // Weather cleared - remove all puddles
        this.clearPuddles();
      }

      //this.applyStatusEffects();

      if (oldWeather !== weatherType) {
        this.updateTemperature();
      }
    }

    // Modify the clearWeather method
    clearWeather() {
      this.currentWeatherType = WeatherTypes.NONE;
      window.weatherName = this.getWeatherDisplayName(); // Add this line
      $gameScreen.changeWeather("Clear", 0, 0);

      // NEW BGS SYSTEM - Update BGS when clearing weather (might trigger night BGS)
      this.updateEnvironmentBgs();

      // PUDDLE SYSTEM - Clear puddles when weather clears
      this.clearPuddles();

      //this.removeAllWeatherEffects();
      this.clearCustomWeather();
    }

    applyStatusEffects() {
      if (this.isInterior) return;

      $gameParty.members().forEach((actor) => {
       // this.removeWeatherEffects(actor);
        switch (this.currentWeatherType) {
          case WeatherTypes.RAIN:
            actor.addState(StatusEffects.RAIN);
            break;
          case WeatherTypes.STORM:
            actor.addState(StatusEffects.STORM);
            break;
          case WeatherTypes.SNOW:
            actor.addState(StatusEffects.SNOW);
            break;
        }
      });
    }

    removeWeatherEffects(actor) {
      actor.removeState(StatusEffects.RAIN);
      actor.removeState(StatusEffects.STORM);
      actor.removeState(StatusEffects.SNOW);
    }

    removeAllWeatherEffects() {
      $gameParty.members().forEach((actor) => this.removeWeatherEffects(actor));
    }

    update() {
      // Original functionality
      this.updateTimeOfDayTint();

      // --- Automatically set country on world map ---
      if ($gameMap.mapId() === 315) {
        const regionId = $gamePlayer.regionId();

        if (regionId > 0 && regionId !== this._lastCheckedRegionId) {
          this._lastCheckedRegionId = regionId;

          const countryData = Countries.find((c) => c.id === regionId);

          if (countryData) {
            console.log(
              `[WeatherSystem] World Map: Player entered region of ${countryData.country}.`
            );

            // Use the new RPG Maker window instead of PIXI popup
            if (
              SceneManager._scene &&
              SceneManager._scene._countryPopupWindow
            ) {
              SceneManager._scene._countryPopupWindow.show(
                countryData.country,
                countryData.superpower
              );
            }

            this.setCurrentCountry(regionId);
            this.changeWeather();
          }
        }
      } else {
        if (this._lastCheckedRegionId !== -1) {
          this._lastCheckedRegionId = -1;
        }
      }

      // PUDDLE SYSTEM - Gradually spawn more puddles over time during rain
      if (
        !this.isInterior &&
        (this.currentWeatherType === WeatherTypes.RAIN ||
          this.currentWeatherType === WeatherTypes.STORM)
      ) {
        const currentTime = Date.now();

        // Initialize spawn timer if not set
        if (!this._lastPuddleSpawnTime) {
          this._lastPuddleSpawnTime = currentTime;
        }

        // Spawn 1 puddle every PUDDLE_SPAWN_INTERVAL (10 seconds)
        if (currentTime - this._lastPuddleSpawnTime >= PUDDLE_SPAWN_INTERVAL) {
          const currentPuddleCount = $gameSystem._weatherPuddles
            ? $gameSystem._weatherPuddles.length
            : 0;

          if (currentPuddleCount < MAX_PUDDLES) {
            this.spawnPuddles(1);
          }

          this._lastPuddleSpawnTime = currentTime;
        }
      }
    }

    setCustomWeather(type, intensity, duration) {
      if (this.isInterior) return;

      this.customWeatherType = type;
      this.customWeatherIntensity = intensity;

      $gameScreen.changeWeather("none", 0, 30);

      if (SceneManager._scene && SceneManager._scene._spriteset) {
        SceneManager._scene._spriteset.setCustomWeather(
          type,
          intensity,
          duration
        );
      }
    }

    clearCustomWeather() {
      this.customWeatherType = null;
      this.customWeatherIntensity = 0;

      if (SceneManager._scene && SceneManager._scene._spriteset) {
        SceneManager._scene._spriteset.clearCustomWeather();
      }
    }

    // ============================================================================
    // PUDDLE SYSTEM METHODS
    // ============================================================================

    /**
     * Spawn puddles on the current map
     * @param {number} count - Number of puddles to spawn
     */
    spawnPuddles(count = 5) {
      if (this.isInterior) return;
      if (!$gameMap || !$dataMap) return;

      // Only spawn during rain/storm
      if (
        this.currentWeatherType !== WeatherTypes.RAIN &&
        this.currentWeatherType !== WeatherTypes.STORM
      ) {
        return;
      }

      // Initialize puddle tracking
      if (!$gameSystem._weatherPuddles) {
        $gameSystem._weatherPuddles = [];
      }

      // Check if we've hit the max puddle limit
      const currentPuddleCount = $gameSystem._weatherPuddles.length;
      if (currentPuddleCount >= MAX_PUDDLES) {
        return;
      }

      // Load puddle template
      const puddleTemplate = loadPuddleTemplate();
      if (!puddleTemplate) {
        console.warn("[Weather] Puddle template not found on map 574");
        return;
      }

      // Find valid spawn tiles
      const validTiles = findPassableTilesForPuddles();
      if (validTiles.length === 0) {
        if (enableTimeDebug) {
          console.log("[Weather] No valid tiles for puddle spawning");
        }
        return;
      }

      // Adjust count to not exceed max puddles
      const actualCount = Math.min(
        count,
        MAX_PUDDLES - currentPuddleCount,
        validTiles.length
      );

      // Spawn puddles
      let spawnedCount = 0;
      for (let i = 0; i < actualCount && i < validTiles.length; i++) {
        const tile = validTiles[i];

        // Check if there's already a puddle nearby (avoid clustering)
        const hasPuddleNearby = $gameSystem._weatherPuddles.some((eventId) => {
          const puddleEvent = $gameMap._events[eventId];
          if (!puddleEvent) return false;
          const dx = Math.abs(puddleEvent.x - tile.x);
          const dy = Math.abs(puddleEvent.y - tile.y);
          return dx <= 2 && dy <= 2; // 2-tile minimum spacing
        });

        if (hasPuddleNearby) continue;

        const puddleEventId = createPuddleEvent(puddleTemplate, tile.x, tile.y);
        if (puddleEventId !== null) {
          $gameSystem._weatherPuddles.push(puddleEventId);
          spawnedCount++;
        }
      }

      if (enableTimeDebug && spawnedCount > 0) {
        console.log(
          `[Weather] Spawned ${spawnedCount} puddles (total: ${$gameSystem._weatherPuddles.length}/${MAX_PUDDLES})`
        );
      }
    }

    /**
     * Clear all puddles from the current map
     */
    clearPuddles() {
      if (!$gameSystem._weatherPuddles || $gameSystem._weatherPuddles.length === 0) {
        return;
      }

      const puddleCount = $gameSystem._weatherPuddles.length;

      for (const eventId of $gameSystem._weatherPuddles) {
        // Remove from game map
        if ($gameMap && $gameMap._events && $gameMap._events[eventId]) {
          $gameMap._events[eventId].erase();
          delete $gameMap._events[eventId];
        }

        // Remove from data map
        if ($dataMap && $dataMap.events && $dataMap.events[eventId]) {
          delete $dataMap.events[eventId];
        }
      }

      // Clear tracking array
      $gameSystem._weatherPuddles = [];

      // Reset spawn timer
      this._lastPuddleSpawnTime = 0;

      // Invalidate tile cache so next rain recalculates from scratch
      invalidatePuddleTileCache();

      // Refresh spriteset to remove puddle sprites
      if (SceneManager._scene && SceneManager._scene._spriteset) {
        SceneManager._scene._spriteset.createCharacters();
      }

      if (enableTimeDebug && puddleCount > 0) {
        console.log(`[Weather] Cleared ${puddleCount} puddles`);
      }
    }
  }

  window.$gameWeather = null;

  const _DataManager_createGameObjects = DataManager.createGameObjects;
  DataManager.createGameObjects = function () {
    _DataManager_createGameObjects.call(this);
    $gameWeather = new Game_WeatherTimeSystem();
    // PUDDLE SYSTEM - Initialize puddle tracking
    if ($gameSystem) {
      $gameSystem._weatherPuddles = [];
    }
  };

  const _DataManager_makeSaveContents = DataManager.makeSaveContents;
  DataManager.makeSaveContents = function () {
    const contents = _DataManager_makeSaveContents.call(this);
    contents.weather = $gameWeather;
    return contents;
  };

  const _DataManager_extractSaveContents = DataManager.extractSaveContents;
  DataManager.extractSaveContents = function (contents) {
    _DataManager_extractSaveContents.call(this, contents);
    if (contents.weather) {
      // Create a new instance with proper prototype
      $gameWeather = new Game_WeatherTimeSystem();

      // Copy saved properties to the new instance
      Object.assign($gameWeather, contents.weather);

      // Ensure critical properties are initialized
      if (!$gameWeather.currentCountry)
        $gameWeather.currentCountry = defaultCountry;
      if ($gameWeather._lastCheckedRegionId === undefined)
        $gameWeather._lastCheckedRegionId = -1;
      if ($gameWeather._lastPuddleSpawnTime === undefined)
        $gameWeather._lastPuddleSpawnTime = 0;

      // Regenerate dynamic tints with the proper method
      $gameWeather.dynamicTints = [];
      $gameWeather._generateDynamicTints();

      // PUDDLE SYSTEM - Clear puddles on load (they will respawn if needed)
      // This prevents stale puddle references from saved data
      if ($gameSystem && $gameSystem._weatherPuddles) {
        $gameSystem._weatherPuddles = [];
      }
    } else {
      $gameWeather = new Game_WeatherTimeSystem();
    }
  };

  const _Scene_Map_onMapLoaded = Scene_Map.prototype.onMapLoaded;
  Scene_Map.prototype.onMapLoaded = function () {
    _Scene_Map_onMapLoaded.call(this);
    if ($gameWeather) {
      // Always clear stale puddle references when the map loads.
      // For menu/battle returns, Scene_Map.start() will restore them from _weatherBackup.
      $gameWeather.clearPuddles();
      $gameWeather.updateTimeAndWeather();
      // Only allow random weather re-roll on genuine map transfers
      $gameWeather.checkMapTags(!!this._transfer);
    }
  };

  // Save weather + puddle positions when leaving Scene_Map (menu open, battle, etc.)
  const _Scene_Map_terminate = Scene_Map.prototype.terminate;
  Scene_Map.prototype.terminate = function () {
    _Scene_Map_terminate.call(this);
    if ($gameWeather && $gameSystem) {
      const wt = $gameWeather.currentWeatherType;
      if (wt === WeatherTypes.RAIN || wt === WeatherTypes.STORM) {
        // Record puddle positions so we can restore them on resume
        const puddles = ($gameSystem._weatherPuddles || []).map((id) => {
          const ev = $gameMap && $gameMap._events && $gameMap._events[id];
          return ev ? { x: ev.x, y: ev.y } : null;
        }).filter(Boolean);
        _weatherBackup = { weatherType: wt, puddles };
        if (enableTimeDebug) {
          console.log(`[Weather] Saved backup: ${wt}, ${puddles.length} puddles`);
        }
      } else {
        _weatherBackup = null;
      }
    }
  };

  // Restore rain + puddles when Scene_Map resumes without a map transfer
  const _Scene_Map_start = Scene_Map.prototype.start;
  Scene_Map.prototype.start = function () {
    _Scene_Map_start.call(this);
    if (!this._transfer && _weatherBackup && $gameWeather) {
      const backup = _weatherBackup;
      _weatherBackup = null;

      const wt = backup.weatherType;
      const power = wt === WeatherTypes.STORM ? 9 : 7;
      const screenType = wt === WeatherTypes.STORM ? "storm" : "rain";

      // Re-apply weather visuals immediately (duration 0 = no fade)
      $gameScreen.changeWeather(screenType, power, 0);
      $gameWeather.currentWeatherType = wt;
      $gameWeather.isInterior = false;

      // Restart the weather BGS on channel 4
      $gameWeather.updateEnvironmentBgs();

      // Restore puddles at their exact saved positions
      const template = loadPuddleTemplate();
      if (template && backup.puddles.length > 0) {
        if (!$gameSystem._weatherPuddles) $gameSystem._weatherPuddles = [];
        for (const pos of backup.puddles) {
          const id = createPuddleEvent(template, pos.x, pos.y);
          if (id !== null) $gameSystem._weatherPuddles.push(id);
        }
        if (enableTimeDebug) {
          console.log(`[Weather] Restored ${backup.puddles.length} puddles after menu`);
        }
      }
    }
  };

  // Update the Scene_Map integration to use the new window
  const _Scene_Map_createDisplayObjects =
    Scene_Map.prototype.createDisplayObjects;
  Scene_Map.prototype.createDisplayObjects = function () {
    _Scene_Map_createDisplayObjects.call(this);
    this.createCountryPopupWindow();
  };

  Scene_Map.prototype.createCountryPopupWindow = function () {
    this._countryPopupWindow = new Window_CountryPopup();
    this.addChild(this._countryPopupWindow);
  };

  const _Scene_Map_createSpriteset = Scene_Map.prototype.createSpriteset;
  Scene_Map.prototype.createSpriteset = function () {
    _Scene_Map_createSpriteset.call(this);
  };

  const _Scene_Map_update = Scene_Map.prototype.update;
  Scene_Map.prototype.update = function () {
    _Scene_Map_update.call(this);
    if ($gameWeather) {
      $gameWeather.update();
    }
  };

  const _Scene_Boot_start = Scene_Boot.prototype.start;
  Scene_Boot.prototype.start = function () {
    _Scene_Boot_start.call(this);
    if (!$gameWeather) {
      $gameWeather = new Game_WeatherTimeSystem();
    }
  };

  // --- MODIFICATION END ---

  // Custom Weather Particle System (unmodified)
  class Weather_CustomParticle extends PIXI.Sprite {
    constructor(texture, config) {
      super(texture);
      this.config = config;
      this.reset();
    }
    reset() {}
    update() {}
  }
  class Weather_CustomLayer extends PIXI.Container {
    constructor() {
      super();
      this.particles = [];
      this.maxParticles = 100;
      this.intensity = 5;
      this.effectType = null;
      this.targetIntensity = 5;
      this.transitionDuration = 60;
      this.transitionTime = 0;
    }
    setWeather(type, intensity, duration) {
      this.effectType = type;
      this.targetIntensity = intensity;
      this.transitionDuration = duration;
      this.transitionTime = 0;
      this.maxParticles = this.getMaxParticles(type, intensity);
      this.clearParticles();
      this.createParticles();
    }
    getMaxParticles(type, intensity) {
      const base = {
        fireflies: 20,
        pollen: 40,
        leaves: 15,
        sakura: 30,
        dust: 60,
        ash: 50,
        magic: 35,
        bubbles: 25,
        embers: 40,
        aurora: 10,
      };
      return Math.floor((base[type] || 30) * (intensity / 5));
    }
    clearParticles() {
      this.particles.forEach((p) => this.removeChild(p));
      this.particles = [];
    }
    createParticles() {
      for (let i = 0; i < this.maxParticles; i++) {
        const particle = this.createParticle();
        if (particle) {
          this.particles.push(particle);
          this.addChild(particle);
        }
      }
    }
    createParticle() {
      switch (this.effectType) {
        case "fireflies":
          return this.createFirefly();
        case "pollen":
          return this.createPollen();
        case "leaves":
          return this.createLeaf();
        case "sakura":
          return this.createSakuraPetal();
        case "dust":
          return this.createDust();
        case "ash":
          return this.createAsh();
        case "magic":
          return this.createMagicParticle();
        case "bubbles":
          return this.createBubble();
        case "embers":
          return this.createEmber();
        case "aurora":
          return this.createAurora();
        default:
          return null;
      }
    }
    createFirefly() {
      const g = new PIXI.Graphics();
      g.beginFill(0xffff88, 1).drawCircle(0, 0, 2).endFill();
      const t = Graphics.app.renderer.generateTexture(g);
      const f = new Weather_CustomParticle(t, {
        speed: 0.5 + Math.random() * 0.5,
        glowPhase: Math.random() * Math.PI * 2,
        wanderAngle: Math.random() * Math.PI * 2,
        baseAlpha: 0.8 + Math.random() * 0.2,
      });
      f.reset = function () {
        this.x = Math.random() * Graphics.width;
        this.y = Math.random() * Graphics.height;
        this.vx = 0;
        this.vy = 0;
      };
      f.update = function () {
        this.config.wanderAngle += (Math.random() - 0.5) * 0.1;
        this.vx += Math.cos(this.config.wanderAngle) * this.config.speed * 0.1;
        this.vy += Math.sin(this.config.wanderAngle) * this.config.speed * 0.1;
        this.vx *= 0.98;
        this.vy *= 0.98;
        this.x += this.vx;
        this.y += this.vy;
        this.config.glowPhase += 0.05;
        this.alpha =
          this.config.baseAlpha * (0.5 + 0.5 * Math.sin(this.config.glowPhase));
        if (this.x < -10) this.x = Graphics.width + 10;
        if (this.x > Graphics.width + 10) this.x = -10;
        if (this.y < -10) this.y = Graphics.height + 10;
        if (this.y > Graphics.height + 10) this.y = -10;
      };
      f.reset();
      return f;
    }
    createPollen() {
      const g = new PIXI.Graphics();
      g.beginFill(0xffffcc, 0.8).drawCircle(0, 0, 1.5).endFill();
      const t = Graphics.app.renderer.generateTexture(g);
      const p = new Weather_CustomParticle(t, {
        floatSpeed: 0.3 + Math.random() * 0.4,
        swayAmount: 2 + Math.random() * 2,
        phase: Math.random() * Math.PI * 2,
      });
      p.reset = function () {
        this.x = Math.random() * Graphics.width;
        this.y = -10;
        this.baseX = this.x;
      };
      p.update = function () {
        this.y += this.config.floatSpeed;
        this.config.phase += 0.02;
        this.x =
          this.baseX + Math.sin(this.config.phase) * this.config.swayAmount;
        if (this.y > Graphics.height + 10) this.reset();
      };
      p.reset();
      return p;
    }
    createLeaf() {
      const g = new PIXI.Graphics();
      const c = [0x8b7355, 0xcd853f, 0xd2691e, 0xff8c00][
        Math.floor(Math.random() * 4)
      ];
      g.beginFill(c, 0.9)
        .moveTo(0, -4)
        .quadraticCurveTo(3, 0, 0, 4)
        .quadraticCurveTo(-3, 0, 0, -4)
        .endFill();
      const t = Graphics.app.renderer.generateTexture(g);
      const l = new Weather_CustomParticle(t, {
        fallSpeed: 1 + Math.random() * 1.5,
        swaySpeed: 0.02 + Math.random() * 0.02,
        swayAmount: 30 + Math.random() * 20,
        rotationSpeed: (Math.random() - 0.5) * 0.1,
        phase: Math.random() * Math.PI * 2,
      });
      l.anchor.set(0.5);
      l.reset = function () {
        this.x = Math.random() * (Graphics.width + 200) - 100;
        this.y = -20;
        this.baseX = this.x;
        this.scale.set(0.8 + Math.random() * 0.4);
      };
      l.update = function () {
        this.y += this.config.fallSpeed;
        this.config.phase += this.config.swaySpeed;
        this.x =
          this.baseX + Math.sin(this.config.phase) * this.config.swayAmount;
        this.rotation += this.config.rotationSpeed;
        if (this.y > Graphics.height + 20) this.reset();
      };
      l.reset();
      return l;
    }
    createSakuraPetal() {
      const g = new PIXI.Graphics();
      g.beginFill(0xffb7c5, 0.9)
        .moveTo(0, -3)
        .quadraticCurveTo(2, -1, 2, 1)
        .quadraticCurveTo(0, 3, -2, 1)
        .quadraticCurveTo(-2, -1, 0, -3)
        .endFill();
      const t = Graphics.app.renderer.generateTexture(g);
      const p = new Weather_CustomParticle(t, {
        fallSpeed: 0.5 + Math.random() * 0.5,
        spinSpeed: 0.02 + Math.random() * 0.03,
        swayAmount: 20 + Math.random() * 20,
        phase: Math.random() * Math.PI * 2,
      });
      p.anchor.set(0.5);
      p.reset = function () {
        this.x = Math.random() * (Graphics.width + 100) - 50;
        this.y = -10;
        this.baseX = this.x;
        this.scale.set(0.7 + Math.random() * 0.3);
      };
      p.update = function () {
        this.y += this.config.fallSpeed;
        this.config.phase += this.config.spinSpeed;
        this.x =
          this.baseX + Math.sin(this.config.phase * 2) * this.config.swayAmount;
        this.rotation = Math.sin(this.config.phase) * 0.5;
        if (this.y > Graphics.height + 10) this.reset();
      };
      p.reset();
      return p;
    }
    createDust() {
      const g = new PIXI.Graphics();
      g.beginFill(0xd2b48c, 0.3)
        .drawCircle(0, 0, 1 + Math.random() * 2)
        .endFill();
      const t = Graphics.app.renderer.generateTexture(g);
      const d = new Weather_CustomParticle(t, {
        speedX: 2 + Math.random() * 3,
        speedY: (Math.random() - 0.5) * 0.5,
        fadeSpeed: 0.002 + Math.random() * 0.003,
      });
      d.reset = function () {
        this.x = -20;
        this.y = Math.random() * Graphics.height;
        this.alpha = 0.3 + Math.random() * 0.3;
        this.scale.set(1 + Math.random());
      };
      d.update = function () {
        this.x += this.config.speedX;
        this.y += this.config.speedY;
        this.alpha -= this.config.fadeSpeed;
        if (this.x > Graphics.width + 20 || this.alpha <= 0) this.reset();
      };
      d.reset();
      return d;
    }
    createAsh() {
      const g = new PIXI.Graphics();
      g.beginFill(0x808080, 0.7).drawRect(-1, -1, 2, 2).endFill();
      const t = Graphics.app.renderer.generateTexture(g);
      const a = new Weather_CustomParticle(t, {
        fallSpeed: 0.3 + Math.random() * 0.4,
        driftSpeed: (Math.random() - 0.5) * 0.5,
        rotationSpeed: (Math.random() - 0.5) * 0.05,
      });
      a.reset = function () {
        this.x = Math.random() * Graphics.width;
        this.y = -10;
        this.alpha = 0.4 + Math.random() * 0.4;
      };
      a.update = function () {
        this.y += this.config.fallSpeed;
        this.x += this.config.driftSpeed;
        this.rotation += this.config.rotationSpeed;
        if (this.y > Graphics.height + 10) this.reset();
      };
      a.reset();
      return a;
    }
    createMagicParticle() {
      const g = new PIXI.Graphics();
      const c = [0xff00ff, 0x00ffff, 0xffff00, 0x00ff00][
        Math.floor(Math.random() * 4)
      ];
      g.beginFill(c, 1).drawStar(0, 0, 4, 3, 2).endFill();
      const t = Graphics.app.renderer.generateTexture(g);
      const m = new Weather_CustomParticle(t, {
        orbitRadius: 50 + Math.random() * 100,
        orbitSpeed: 0.02 + Math.random() * 0.03,
        centerX: Math.random() * Graphics.width,
        centerY: Math.random() * Graphics.height,
        phase: Math.random() * Math.PI * 2,
        pulsePhase: Math.random() * Math.PI * 2,
      });
      m.anchor.set(0.5);
      m.reset = function () {
        this.scale.set(0.5 + Math.random() * 0.5);
      };
      m.update = function () {
        this.config.phase += this.config.orbitSpeed;
        this.x =
          this.config.centerX +
          Math.cos(this.config.phase) * this.config.orbitRadius;
        this.y =
          this.config.centerY +
          Math.sin(this.config.phase) * this.config.orbitRadius * 0.5;
        this.config.pulsePhase += 0.05;
        this.alpha = 0.5 + 0.5 * Math.sin(this.config.pulsePhase);
        this.rotation += 0.05;
        this.config.centerX += (Math.random() - 0.5) * 0.5;
        this.config.centerY += (Math.random() - 0.5) * 0.5;
        if (this.config.centerX < -100)
          this.config.centerX = Graphics.width + 100;
        if (this.config.centerX > Graphics.width + 100)
          this.config.centerX = -100;
        if (this.config.centerY < -100)
          this.config.centerY = Graphics.height + 100;
        if (this.config.centerY > Graphics.height + 100)
          this.config.centerY = -100;
      };
      m.reset();
      return m;
    }
    createBubble() {
      const g = new PIXI.Graphics();
      g.lineStyle(1, 0xffffff, 0.5)
        .beginFill(0xffffff, 0.1)
        .drawCircle(0, 0, 5)
        .endFill();
      const t = Graphics.app.renderer.generateTexture(g);
      const b = new Weather_CustomParticle(t, {
        riseSpeed: 0.5 + Math.random() * 0.5,
        wobbleSpeed: 0.03 + Math.random() * 0.02,
        wobbleAmount: 10 + Math.random() * 10,
        phase: Math.random() * Math.PI * 2,
        popTimer: 300 + Math.random() * 300,
      });
      b.reset = function () {
        this.x = Math.random() * Graphics.width;
        this.y = Graphics.height + 20;
        this.baseX = this.x;
        this.scale.set(0.5 + Math.random() * 1);
        this.config.popTimer = 300 + Math.random() * 300;
      };
      b.update = function () {
        this.y -= this.config.riseSpeed;
        this.config.phase += this.config.wobbleSpeed;
        this.x =
          this.baseX + Math.sin(this.config.phase) * this.config.wobbleAmount;
        this.config.popTimer--;
        if (this.y < -20 || this.config.popTimer <= 0) {
          if (this.config.popTimer <= 0) {
            this.scale.x += 0.1;
            this.scale.y += 0.1;
            this.alpha -= 0.1;
            if (this.alpha <= 0) this.reset();
          } else {
            this.reset();
          }
        }
      };
      b.reset();
      return b;
    }
    createEmber() {
      const g = new PIXI.Graphics();
      g.beginFill(0xff4500, 1).drawCircle(0, 0, 2).endFill();
      const t = Graphics.app.renderer.generateTexture(g);
      const e = new Weather_CustomParticle(t, {
        riseSpeed: 1 + Math.random() * 1.5,
        driftX: (Math.random() - 0.5) * 2,
        lifespan: 200 + Math.random() * 200,
        currentLife: 0,
      });
      e.reset = function () {
        this.x = Math.random() * Graphics.width;
        this.y = Graphics.height + 10;
        this.config.currentLife = 0;
        this.alpha = 1;
        this.scale.set(1);
      };
      e.update = function () {
        this.y -= this.config.riseSpeed;
        this.x += this.config.driftX + (Math.random() - 0.5) * 0.5;
        this.config.currentLife++;
        const lifeRatio = this.config.currentLife / this.config.lifespan;
        this.alpha = 1 - lifeRatio;
        this.scale.set(1 - lifeRatio * 0.5);
        this.tint = this.interpolateColor(0xff4500, 0x8b0000, lifeRatio);
        if (this.config.currentLife >= this.config.lifespan || this.y < -10)
          this.reset();
      };
      e.interpolateColor = function (c1, c2, r) {
        const r1 = (c1 >> 16) & 255,
          g1 = (c1 >> 8) & 255,
          b1 = c1 & 255;
        const r2 = (c2 >> 16) & 255,
          g2 = (c2 >> 8) & 255,
          b2 = c2 & 255;
        const r_ = Math.round(r1 + (r2 - r1) * r),
          g_ = Math.round(g1 + (g2 - g1) * r),
          b_ = Math.round(b1 + (b2 - b1) * r);
        return (r_ << 16) + (g_ << 8) + b_;
      };
      e.reset();
      return e;
    }
    createAurora() {
      const g = new PIXI.Graphics();
      const w = Graphics.width / 10,
        h = 100 + Math.random() * 100;
      const c = [0x00ff00, 0x00ffff, 0xff00ff, 0x0000ff][
        Math.floor(Math.random() * 4)
      ];
      g.beginFill(c, 0.3).drawRect(0, 0, w, h).endFill();
      const t = Graphics.app.renderer.generateTexture(g);
      const a = new Weather_CustomParticle(t, {
        waveSpeed: 0.01 + Math.random() * 0.02,
        waveAmount: 20 + Math.random() * 30,
        phase: Math.random() * Math.PI * 2,
        baseY: Math.random() * Graphics.height * 0.5,
        fadePhase: Math.random() * Math.PI * 2,
      });
      a.reset = function () {
        this.x = Math.floor(Math.random() * 10) * (Graphics.width / 10);
        this.y = this.config.baseY;
      };
      a.update = function () {
        this.config.phase += this.config.waveSpeed;
        this.y =
          this.config.baseY +
          Math.sin(this.config.phase) * this.config.waveAmount;
        this.config.fadePhase += 0.02;
        this.alpha = 0.1 + 0.2 * Math.sin(this.config.fadePhase);
        this.x += Math.sin(this.config.phase * 0.5) * 0.5;
      };
      a.reset();
      return a;
    }
    update() {
      if (this.transitionTime < this.transitionDuration) {
        this.transitionTime++;
        const ratio = this.transitionTime / this.transitionDuration;
        this.intensity += (this.targetIntensity - this.intensity) * ratio;
        this.alpha = this.intensity / 10;
      }
      this.particles.forEach((p) => p.update && p.update());
    }
    clear() {
      this.clearParticles();
      this.effectType = null;
    }
  }
  const _Spriteset_Map_createWeather = Spriteset_Map.prototype.createWeather;
  Spriteset_Map.prototype.createWeather = function () {
    _Spriteset_Map_createWeather.call(this);
    this._customWeatherLayer = new Weather_CustomLayer();
    this.addChild(this._customWeatherLayer);
  };
  const _Spriteset_Map_updateWeather = Spriteset_Map.prototype.updateWeather;
  Spriteset_Map.prototype.updateWeather = function () {
    _Spriteset_Map_updateWeather.call(this);
    if (this._customWeatherLayer) this._customWeatherLayer.update();
  };
  Spriteset_Map.prototype.setCustomWeather = function (
    type,
    intensity,
    duration
  ) {
    if (this._customWeatherLayer)
      this._customWeatherLayer.setWeather(type, intensity, duration);
  };
  Spriteset_Map.prototype.clearCustomWeather = function () {
    if (this._customWeatherLayer) this._customWeatherLayer.clear();
  };
  const _Game_WeatherTimeSystem_clearWeather =
    Game_WeatherTimeSystem.prototype.clearWeather;
  Game_WeatherTimeSystem.prototype.clearWeather = function () {
    _Game_WeatherTimeSystem_clearWeather.call(this);
    this.clearCustomWeather();
  };
})();

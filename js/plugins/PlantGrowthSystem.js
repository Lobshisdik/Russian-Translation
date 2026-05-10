/*:
 * @target MZ
 * @plugindesc v1.1.0 Plant Growth System - simulates plant lifecycle using game time, seasons and weather.
 * @author Omni-Lex
 *
 * @help PlantGrowthSystem v1.1.0
 * ============================================================
 * Manages a realistic plant growth lifecycle driven by the
 * TimeDateSystem (Variable 114 = game minutes) and WeatherSystem
 * ($gameWeather.getSeason / currentWeatherType).
 *
 * --- Setup ---
 * 1. Name any event "Plant" on the map.
 * 2. Add a Comment command with the plant name to auto-initialize it.
 * 3. Call plugin command "CheckGrowth" from that event to open
 * the plant management menu.
 * 4. Plant sprites must be in img/characters/Plants/
 * e.g. !$Watermelon.png  (single-character, no-shadow prefix)
 * The sprite sheet uses 4 rows (down/left/right/up) as
 * growth stages, first column (pattern 0) is displayed.
 *
 * --- Map Tags ---
 * <Greenhouse>  Growth runs at max speed all year regardless of season.
 *
 * --- Growth Logic ---
 * - Plants only grow during their defined seasons (unless Greenhouse).
 * - Rain: +30% growth speed.  Storm: +10%.  Snow: -50%.
 * - Greenhouse multiplier: x1.5.
 * - Out-of-season plants are dormant (no effective time accumulates).
 *
 * --- Sprite Stages ---
 * Stage 0 Seedling  -> direction DOWN  (row 0, pattern 0)
 * Stage 1 Sprout    -> direction LEFT  (row 1, pattern 0)
 * Stage 2 Growing   -> direction RIGHT (row 2, pattern 0)
 * Stage 3 Mature    -> direction UP    (row 3, pattern 0)
 *
 * @command PlantMenu
 * @text Plant Menu
 * @desc Opens the plant interaction menu: Check / Harvest / Plant or Remove / Cancel.
 *
 * @command CheckGrowth
 * @text Check Growth
 * @desc Opens the full plant management scene (Info panel + commands) for the calling event.
 *
 * @command PlantSeed
 * @text Plant Seed
 * @desc Silently plants a seed at the calling event without opening the menu.
 *
 * @arg plantId
 * @text Plant
 * @desc Name of the plant to plant (must match a PLANT_DB key exactly).
 * @type combo
 * @option Tomato
 * @option Watermelon
 * @option Wheat
 * @option Pumpkin
 * @option Carrot
 * @option Potato
 * @option Mushroom
 * @option Sunflower
 * @option Strawberry
 * @option Corn
 * @option Lavender
 * @option Onion
 * @option Cabbage
 * @option Eggplant
 * @option Pepper
 * @default Tomato
 *
 * @command HarvestPlant
 * @text Harvest Plant
 * @desc Harvests the plant at the calling event and gives items. Does nothing if no plant is present.
 *
 * @command RemovePlant
 * @text Remove Plant
 * @desc Removes the plant at the calling event without giving any items.
 *
 * @command SetGrowthStage
 * @text Set Growth Stage
 * @desc Forces the plant at the calling event to a specific growth stage.
 *
 * @arg stage
 * @text Stage
 * @desc 0 = Seedling, 1 = Sprout, 2 = Growing, 3 = Mature.
 * @type select
 * @option Seedling (0)
 * @value 0
 * @option Sprout (1)
 * @value 1
 * @option Growing (2)
 * @value 2
 * @option Mature (3)
 * @value 3
 * @default 3
 */

(() => {
  "use strict";

  const pluginName = "PlantGrowthSystem";

  // ============================================================
  //  CONSTANTS
  // ============================================================

  const GAME_TIME_VAR = 114; // Variable storing total game minutes (TimeDateSystem)
  const MINUTES_PER_DAY = 1440;

  // Direction per growth stage: 2=down, 4=left, 6=right, 8=up
  const STAGE_DIRS = [2, 4, 6, 8];
  const STAGE_NAMES = ["Seedling", "Sprout", "Growing", "Mature"];

  // Weather growth multipliers (applied when in-season)
  const WEATHER_MULT = { none: 1.0, rain: 1.3, storm: 1.1, snow: 0.5 };

  // Greenhouse bonus when map has <Greenhouse> tag
  const GREENHOUSE_MULT = 1.5;


  // ============================================================
  //  PLANT DATABASE
  // ============================================================

const PLANT_DB = {
    Tomato: { sprite: "Plants/!$Tomato", itemId: 575, cost: 200, seasons: ["SPRING", "SUMMER"], growthDays: 14, yieldMin: 2, yieldMax: 5 },
    Watermelon: { sprite: "Plants/!$Watermelon", itemId: 575, cost: 800, seasons: ["SUMMER"], growthDays: 30, yieldMin: 1, yieldMax: 3 },
    Wheat: { sprite: "Plants/!$Wheat", itemId: 575, cost: 150, seasons: ["SPRING", "SUMMER"], growthDays: 20, yieldMin: 3, yieldMax: 6 },
    Pumpkin: { sprite: "Plants/!$Pumpkin", itemId: 575, cost: 300, seasons: ["AUTUMN"], growthDays: 25, yieldMin: 1, yieldMax: 2 },
    Carrot: { sprite: "Plants/!$Carrot", itemId: 575, cost: 100, seasons: ["SPRING", "AUTUMN"], growthDays: 10, yieldMin: 3, yieldMax: 7 },
    Potato: { sprite: "Plants/!$Potato", itemId: 575, cost: 120, seasons: ["SPRING", "AUTUMN"], growthDays: 12, yieldMin: 4, yieldMax: 8 },
    Mushroom: { sprite: "Plants/!$Mushroom", itemId: 575, cost: 250, seasons: ["AUTUMN", "WINTER"], growthDays: 7, yieldMin: 2, yieldMax: 5 },
    Sunflower: { sprite: "Plants/!$Sunflower", itemId: 575, cost: 200, seasons: ["SUMMER"], growthDays: 15, yieldMin: 2, yieldMax: 4 },
    Strawberry: { sprite: "Plants/!$Strawberry", itemId: 575, cost: 350, seasons: ["SPRING"], growthDays: 18, yieldMin: 3, yieldMax: 8 },
    Corn: { sprite: "Plants/!$Corn", itemId: 575, cost: 400, seasons: ["SUMMER"], growthDays: 25, yieldMin: 2, yieldMax: 5 },
    Lavender: { sprite: "Plants/!$Lavender", itemId: 575, cost: 300, seasons: ["SPRING", "SUMMER"], growthDays: 21, yieldMin: 2, yieldMax: 6 },
    Onion: { sprite: "Plants/!$Onion", itemId: 575, cost: 80, seasons: ["SPRING", "AUTUMN", "WINTER"], growthDays: 10, yieldMin: 4, yieldMax: 8 },
    Cabbage: { sprite: "Plants/!$Cabbage", itemId: 575, cost: 100, seasons: ["SPRING", "AUTUMN"], growthDays: 15, yieldMin: 2, yieldMax: 5 },
    Eggplant: { sprite: "Plants/!$Eggplant", itemId: 575, cost: 250, seasons: ["SUMMER"], growthDays: 20, yieldMin: 2, yieldMax: 4 },
    Pepper: { sprite: "Plants/!$Pepper", itemId: 193, cost: 200, seasons: ["SUMMER"], growthDays: 18, yieldMin: 3, yieldMax: 6 },
    Ananas: { sprite: "Plants/!$Ananas", itemId: 575, cost: 600, seasons: ["SUMMER"], growthDays: 28, yieldMin: 1, yieldMax: 2 },
    Grapes: { sprite: "Plants/!$Grapes", itemId: 575, cost: 300, seasons: ["SUMMER", "AUTUMN"], growthDays: 22, yieldMin: 4, yieldMax: 8 },
    Cactus: { sprite: "Plants/!$Cactus", itemId: 575, cost: 150, seasons: ["SUMMER"], growthDays: 35, yieldMin: 1, yieldMax: 3 },
    Beanstalk: { sprite: "Plants/!$Beanstalk", itemId: 575, cost: 1000, seasons: ["SPRING", "SUMMER"], growthDays: 45, yieldMin: 5, yieldMax: 10 }
  };

  // ============================================================
  //  HELPERS
  // ============================================================

  function plantKey(mapId, eventId) {
    return `${mapId}_${eventId}`;
  }

  function getRecord(mapId, eventId) {
    if (!$gameSystem._plantData) $gameSystem._plantData = {};
    return $gameSystem._plantData[plantKey(mapId, eventId)] || null;
  }

  function saveRecord(mapId, eventId, rec) {
    if (!$gameSystem._plantData) $gameSystem._plantData = {};
    $gameSystem._plantData[plantKey(mapId, eventId)] = rec;
    updateSelfSwitch(mapId, eventId, rec);
  }

  function updateSelfSwitch(mapId, eventId, rec) {
    if (!$gameSelfSwitches) return;
    const isGrowing = !!(rec && !rec.removed && rec.plantId);
    $gameSelfSwitches.setValue([mapId, eventId, "A"], !isGrowing);
  }

  function gameMinutes() {
    return ($gameVariables ? $gameVariables.value(GAME_TIME_VAR) : 0) || 0;
  }

  function currentSeason() {
    if ($gameWeather && typeof $gameWeather.getSeason === "function") {
      return $gameWeather.getSeason();
    }
    const dateStr = ($gameVariables && $gameVariables.value(113)) || "01 JAN 2001 12:00";
    const parts = dateStr.split(" ");
    const MONTHS = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
    const m = MONTHS.indexOf((parts[1] || "JAN").toUpperCase());
    if (m >= 2 && m <= 4) return "SPRING";
    if (m >= 5 && m <= 7) return "SUMMER";
    if (m >= 8 && m <= 10) return "AUTUMN";
    return "WINTER";
  }

  function currentWeather() {
    return ($gameWeather && $gameWeather.currentWeatherType) || "none";
  }

  function isGreenhouse() {
    return !!($dataMap && $dataMap.note && $dataMap.note.includes("<Greenhouse>"));
  }

  function growthMult(greenhouse) {
    if (greenhouse) return GREENHOUSE_MULT;
    return WEATHER_MULT[currentWeather()] ?? 1.0;
  }

  function calcStage(effectiveMins, growthDays) {
    const ratio = Math.min(effectiveMins / (growthDays * MINUTES_PER_DAY), 1.0);
    if (ratio >= 1.0) return 3;
    return Math.floor(ratio * 4);
  }

  function calcProgress(effectiveMins, growthDays) {
    return Math.min(effectiveMins / (growthDays * MINUTES_PER_DAY), 1.0);
  }

  function calcYield(def, effectiveMins) {
    const r = calcProgress(effectiveMins, def.growthDays);
    return Math.max(def.yieldMin, Math.round(def.yieldMin + (def.yieldMax - def.yieldMin) * r));
  }

  function isPlantEvent(event) {
    if (!$dataMap || !$dataMap.events) return false;
    const data = $dataMap.events[event._eventId];
    return !!(data && (data.name || "").toLowerCase() === "plant");
  }

  function getPresetPlantId(eventId) {
    if (!$dataMap || !$dataMap.events) return null;
    const evData = $dataMap.events[eventId];
    if (!evData) return null;
    const plantNames = Object.keys(PLANT_DB);
    for (const page of evData.pages || []) {
      for (const cmd of page.list || []) {
        if (cmd.code !== 108 && cmd.code !== 408) continue;
        const text = (cmd.parameters[0] || "").trim();
        const match = plantNames.find((id) => id.toLowerCase() === text.toLowerCase());
        if (match) return match;
      }
    }
    return null;
  }

  function maybeInitPresetPlant(mapId, eventId) {
    if (getRecord(mapId, eventId)) return;
    const plantId = getPresetPlantId(eventId);
    if (!plantId) return;
    const def   = PLANT_DB[plantId];
    const now   = gameMinutes();
    const stage = Math.floor(Math.random() * 4);
    const lo    = stage / 4;
    const hi    = (stage + 1) / 4;
    const ratio = lo + Math.random() * (hi - lo);
    const effectiveMins = ratio * def.growthDays * MINUTES_PER_DAY;
    saveRecord(mapId, eventId, {
      plantId,
      plantedAt:              now,
      lastUpdateMinutes:      now,
      effectiveGrowthMinutes: effectiveMins,
      stage:                  calcStage(effectiveMins, def.growthDays),
      removed:                false,
    });
  }

  // ============================================================
  //  GROWTH UPDATE
  // ============================================================

  function updateGrowth(mapId, eventId) {
    const rec = getRecord(mapId, eventId);
    if (!rec || rec.removed || !rec.plantId) return;
    const def = PLANT_DB[rec.plantId];
    if (!def) return;

    const now = gameMinutes();
    const elapsed = now - rec.lastUpdateMinutes;
    if (elapsed <= 0) return;

    const greenhouse = isGreenhouse();
    const inSeason = greenhouse || def.seasons.includes(currentSeason());

    if (inSeason) {
      rec.effectiveGrowthMinutes += elapsed * growthMult(greenhouse);
    }
    rec.lastUpdateMinutes = now;
    rec.stage = calcStage(rec.effectiveGrowthMinutes, def.growthDays);
    saveRecord(mapId, eventId, rec);
  }

  function applySprite(event, rec) {
    if (!rec || rec.removed || !rec.plantId) {
      event.setImage("", 0);
      return;
    }
    const def = PLANT_DB[rec.plantId];
    if (!def) return;
    event.setImage(def.sprite, 0);
    event._direction = STAGE_DIRS[rec.stage] || 2;  // bypass setDirection's directionFix guard
    event._directionFix = false;
    event.setWalkAnime(false);
    event.setStepAnime(false);
    event._pattern = 0;
  }

  function refreshMapPlants() {
    if (!$gameMap || !$gameSystem) return;
    const mapId = $gameMap.mapId();
    for (const ev of $gameMap.events()) {
      if (!ev || !isPlantEvent(ev)) continue;
      maybeInitPresetPlant(mapId, ev._eventId);
      updateGrowth(mapId, ev._eventId);
      const rec = getRecord(mapId, ev._eventId);
      applySprite(ev, rec);
      updateSelfSwitch(mapId, ev._eventId, rec);
    }
  }

  // ============================================================
  //  HOOKS
  // ============================================================

  const _Scene_Map_onMapLoaded = Scene_Map.prototype.onMapLoaded;
  Scene_Map.prototype.onMapLoaded = function () {
    _Scene_Map_onMapLoaded.call(this);
    refreshMapPlants();
  };

  const _Game_Event_update = Game_Event.prototype.update;
  Game_Event.prototype.update = function (sceneActive) {
    _Game_Event_update.call(this, sceneActive);
    if (!isPlantEvent(this)) return;
    const rec = getRecord($gameMap.mapId(), this._eventId);
    if (rec && !rec.removed && rec.plantId) {
      this._direction = STAGE_DIRS[rec.stage] || 2;
      this._pattern   = 0;
    }
  };

  // Hook setupPageSettings — the exact moment RPG Maker writes image+direction from
  // the page data. Overriding here wins regardless of how many refreshes fire.
  const _Game_Event_setupPageSettings = Game_Event.prototype.setupPageSettings;
  Game_Event.prototype.setupPageSettings = function () {
    _Game_Event_setupPageSettings.call(this);
    if (!$gameMap || !isPlantEvent(this)) return;
    const rec = getRecord($gameMap.mapId(), this._eventId);
    if (rec && !rec.removed && rec.plantId) applySprite(this, rec);
  };

  // Prevent lock() from turning the plant to face the player on interaction.
  const _Game_Event_lock = Game_Event.prototype.lock;
  Game_Event.prototype.lock = function () {
    if (isPlantEvent(this)) return;
    _Game_Event_lock.call(this);
  };

  // ============================================================
  //  PLUGIN COMMANDS
  // ============================================================

  PluginManager.registerCommand(pluginName, "PlantMenu", function () {
    const eventId = this.eventId();
    const mapId   = $gameMap.mapId();
    updateGrowth(mapId, eventId);
    const rec = getRecord(mapId, eventId);
    if (rec && !rec.removed && rec.plantId) {
      Scene_PlantMenu._openArgs = { mapId, eventId, rec };
      SceneManager.push(Scene_PlantMenu);
    } else {
      Scene_PlantQuickMenu._openArgs = { mapId, eventId, rec };
      SceneManager.push(Scene_PlantQuickMenu);
    }
  });

  PluginManager.registerCommand(pluginName, "CheckGrowth", function () {
    const eventId = this.eventId();
    const mapId   = $gameMap.mapId();
    updateGrowth(mapId, eventId);
    const rec = getRecord(mapId, eventId);
    Scene_PlantMenu._openArgs = { mapId, eventId, rec };
    SceneManager.push(Scene_PlantMenu);
  });

  PluginManager.registerCommand(pluginName, "PlantSeed", function (args) {
    const plantId = String(args.plantId || "").trim();
    if (!PLANT_DB[plantId]) return;
    const eventId = this.eventId();
    const mapId   = $gameMap.mapId();
    const now     = gameMinutes();
    saveRecord(mapId, eventId, { plantId, plantedAt: now, lastUpdateMinutes: now, effectiveGrowthMinutes: 0, stage: 0, removed: false });
    const ev = $gameMap.event(eventId);
    if (ev) applySprite(ev, getRecord(mapId, eventId));
  });

  PluginManager.registerCommand(pluginName, "HarvestPlant", function () {
    const eventId = this.eventId();
    const mapId   = $gameMap.mapId();
    updateGrowth(mapId, eventId);
    const rec = getRecord(mapId, eventId);
    if (!rec || rec.removed || !rec.plantId) return;
    const def  = PLANT_DB[rec.plantId];
    const item = $dataItems[def.itemId];
    if (item && rec.stage >= 2) {
      const qty = calcYield(def, rec.effectiveGrowthMinutes);
      $gameParty.gainItem(item, qty);
      window.skipLocalization = true;
      $gameMessage.add(`\\I[${item.iconIndex}]Harvested \\c[14]${item.name}\\c[0] ×${qty}!`);
      window.skipLocalization = false;
    }
    rec.removed = true;
    rec.plantId = null;
    rec.stage   = 0;
    saveRecord(mapId, eventId, rec);
    const ev = $gameMap.event(eventId);
    if (ev) applySprite(ev, rec);
  });

  PluginManager.registerCommand(pluginName, "RemovePlant", function () {
    const eventId = this.eventId();
    const mapId   = $gameMap.mapId();
    const rec     = getRecord(mapId, eventId);
    if (!rec || rec.removed || !rec.plantId) return;
    rec.removed = true;
    rec.plantId = null;
    rec.stage   = 0;
    saveRecord(mapId, eventId, rec);
    const ev = $gameMap.event(eventId);
    if (ev) applySprite(ev, rec);
  });

  PluginManager.registerCommand(pluginName, "SetGrowthStage", function (args) {
    const stage   = Number(args.stage ?? 3);
    const eventId = this.eventId();
    const mapId   = $gameMap.mapId();
    updateGrowth(mapId, eventId);
    const rec = getRecord(mapId, eventId);
    if (!rec || rec.removed || !rec.plantId) return;
    const def     = PLANT_DB[rec.plantId];
    const midRatio = (stage + 0.5) / 4;
    rec.effectiveGrowthMinutes = Math.min(midRatio * def.growthDays * MINUTES_PER_DAY, def.growthDays * MINUTES_PER_DAY);
    rec.stage = calcStage(rec.effectiveGrowthMinutes, def.growthDays);
    saveRecord(mapId, eventId, rec);
    const ev = $gameMap.event(eventId);
    if (ev) applySprite(ev, rec);
  });

  // ============================================================
  //  SCENE: Plant Menu
  // ============================================================

  class Scene_PlantMenu extends Scene_MenuBase {
    initialize() {
      super.initialize();
      const a = Scene_PlantMenu._openArgs || {};
      this._mapId = a.mapId || 0;
      this._eventId = a.eventId || 0;
      this._rec = a.rec || null;
    }

    create() {
      super.create();
      this._createInfoWindow();
      this._createCommandWindow();
    }

    _hasPlant() {
      return !!(this._rec && !this._rec.removed && this._rec.plantId);
    }

    _createInfoWindow() {
      const wh = Math.floor(Graphics.boxHeight * 0.6);
      const rect = new Rectangle(0, 0, Graphics.boxWidth, wh);
      this._infoWindow = new Window_PlantInfo(rect);
      this._infoWindow.setRecord(this._rec);
      this.addWindow(this._infoWindow);
    }

    _createCommandWindow() {
      const wy = Math.floor(Graphics.boxHeight * 0.6);
      const wh = Graphics.boxHeight - wy;
      const rect = new Rectangle(0, wy, Graphics.boxWidth, wh);
      _cmdIsEmpty = !this._hasPlant();
      this._commandWindow = new Window_PlantCommand(rect);
      this._commandWindow.setHandler("info", this._onInfo.bind(this));
      this._commandWindow.setHandler("harvest", this._onHarvest.bind(this));
      this._commandWindow.setHandler("remove", this._onRemove.bind(this));
      this._commandWindow.setHandler("plant", this._onPlant.bind(this));
      this._commandWindow.setHandler("cancel", this.popScene.bind(this));
      this.addWindow(this._commandWindow);
    }

    _onInfo() {
      this._commandWindow.activate();
    }

    _onHarvest() {
      if (!this._hasPlant()) {
        this._commandWindow.activate();
        return;
      }
      const rec = this._rec;
      const def = PLANT_DB[rec.plantId];
      const item = $dataItems[def.itemId];
      if (item && rec.stage >= 2) {
        const qty = calcYield(def, rec.effectiveGrowthMinutes);
        $gameParty.gainItem(item, qty);
        SoundManager.playShop();
        window.skipLocalization = true;
        $gameMessage.add(`\\I[${item.iconIndex}]Harvested \\c[14]${item.name}\\c[0] ×${qty}!`);
        window.skipLocalization = false;
      }

      rec.removed = true;
      rec.plantId = null;
      rec.stage = 0;
      saveRecord(this._mapId, this._eventId, rec);
      const ev = $gameMap.event(this._eventId);
      if (ev) applySprite(ev, rec);
      this.popScene();
    }

    _onRemove() {
      if (!this._hasPlant()) {
        this._commandWindow.activate();
        return;
      }
      const rec = this._rec;
      rec.removed = true;
      rec.plantId = null;
      rec.stage = 0;
      saveRecord(this._mapId, this._eventId, rec);
      const ev = $gameMap.event(this._eventId);
      if (ev) applySprite(ev, rec);
      SoundManager.playCancel();
      this.popScene();
    }

    _onPlant() {
      if (!this._selectWindow) {
        const ww = Math.floor(Graphics.boxWidth * 0.86);
        const wh = Math.floor(Graphics.boxHeight * 0.88);
        const wx = Math.floor((Graphics.boxWidth - ww) / 2);
        const wy = Math.floor((Graphics.boxHeight - wh) / 2);

        const previewW = 300;
        const selectW = ww - previewW;

        this._selectWindow = new Window_PlantSelect(new Rectangle(wx, wy, selectW, wh));
        this._selectWindow.setHandler("ok", this._onPlantOk.bind(this));
        this._selectWindow.setHandler("cancel", this._onPlantCancel.bind(this));
        this.addWindow(this._selectWindow);

        this._previewWindow = new Window_PlantPreview(new Rectangle(wx + selectW, wy, previewW, wh));
        this.addWindow(this._previewWindow);
        this._selectWindow.setPreviewWindow(this._previewWindow);
      }
      this._commandWindow.deactivate();
      this._selectWindow.refresh();
      this._selectWindow.show();
      this._previewWindow.show();
      this._selectWindow.activate();
      this._selectWindow.select(0);
    }

    _onPlantOk() {
      const plantId = this._selectWindow.currentSymbol();
      const def = PLANT_DB[plantId];
      if (!def || $gameParty.gold() < def.cost) {
        SoundManager.playBuzzer();
        this._selectWindow.activate();
        return;
      }
      $gameParty.loseGold(def.cost);
      const now = gameMinutes();
      const newRec = { plantId, plantedAt: now, lastUpdateMinutes: now, effectiveGrowthMinutes: 0, stage: 0, removed: false };
      saveRecord(this._mapId, this._eventId, newRec);
      this._rec = newRec;
      const ev = $gameMap.event(this._eventId);
      if (ev) applySprite(ev, newRec);
      SoundManager.playShop();
      window.skipLocalization = true;
      $gameMessage.add(`Planted \\c[14]${plantId}\\c[0]!`);
      window.skipLocalization = false;
      this._selectWindow.hide();
      this._previewWindow.hide();
      this.popScene();
    }

    _onPlantCancel() {
      this._selectWindow.hide();
      this._previewWindow.hide();
      this._commandWindow.activate();
    }
  }

  // ============================================================
  //  WINDOW: Plant Info
  // ============================================================

  class Window_PlantInfo extends Window_Base {
    initialize(rect) {
      super.initialize(rect);
      this._rec = null;
    }
    setRecord(rec) {
      this._rec = rec;
      this.refresh();
    }
    refresh() {
      this.contents.clear();
      if (!this._rec || this._rec.removed || !this._rec.plantId) {
        this._drawEmpty();
      } else {
        this._drawInfo(this._rec);
      }
    }
    _drawEmpty() {
      const lh = this.lineHeight();
      this.changeTextColor(ColorManager.systemColor());
      this.drawText("Empty Plot", 0, lh * 2, this.innerWidth, "center");
      this.resetTextColor();
      this.drawText("Select 'Plant' to grow something here.", 0, lh * 3, this.innerWidth, "center");
    }
    _drawInfo(rec) {
      const def = PLANT_DB[rec.plantId];
      if (!def) return;
      const lh = this.lineHeight();
      const pad = this.itemPadding();
      const iw = this.innerWidth;
      const lx = pad;
      const vx = Math.floor(iw * 0.36);
      const vw = iw - vx - pad;
      let y = 2;

      this.changeTextColor(ColorManager.systemColor());
      this.drawText(rec.plantId, lx, y, iw - lx * 2, "center");
      this.resetTextColor();
      y += lh;
      this.contents.fillRect(lx, y, iw - lx * 2, 1, ColorManager.systemColor());
      y += 6;

      const greenhouse = isGreenhouse();
      const season = currentSeason();
      const inSeason = greenhouse || def.seasons.includes(season);
      const progress = calcProgress(rec.effectiveGrowthMinutes, def.growthDays);

      const stageColor = rec.stage >= 3 ? "#77ee77" : rec.stage >= 2 ? "#ffdd66" : "#ffaa44";
      this._labelRow(lx, vx, vw, y, "Stage:", STAGE_NAMES[rec.stage], stageColor);
      y += lh;

      this.changeTextColor(ColorManager.systemColor());
      this.drawText("Growth:", lx, y, vx - lx - 4);
      this.resetTextColor();
      const barW = Math.floor(vw * 0.68);
      this._drawBar(vx, y + 3, barW, progress);
      this.drawText(`${Math.floor(progress * 100)}%`, vx + barW + 6, y, 52);
      y += lh;

      const item = $dataItems[def.itemId];
      const itemName = item ? `\\I[${item.iconIndex}]${item.name}` : `Item #${def.itemId}`;
      this._labelRow(lx, vx, vw, y, "Harvest:", itemName, "#ffffff");
      y += lh;

      const canYield = rec.stage >= 2;
      const yieldText = canYield ? `${calcYield(def, rec.effectiveGrowthMinutes)} – ${def.yieldMax}` : "None";
      this._labelRow(lx, vx, vw, y, "Yield:", yieldText, canYield ? "#ffffff" : "#ee7777");
      y += lh;

      const scolor = inSeason ? "#77ee77" : "#ee7777";
      const slabel = def.seasons.join(", ") + (greenhouse ? "  ✓ Greenhouse" : "");
      this._labelRow(lx, vx, vw, y, "Grows in:", slabel, scolor);
      y += lh;

      const nowLabel = season + (inSeason ? "" : "  (dormant — no growth)");
      this._labelRow(lx, vx, vw, y, "Season now:", nowLabel, inSeason ? "#77ee77" : "#ffaa44");
      y += lh;

      if (rec.stage < 3) {
        const rem = Math.max(0, def.growthDays * MINUTES_PER_DAY - rec.effectiveGrowthMinutes);
        const days = Math.ceil(rem / MINUTES_PER_DAY);
        const ds = inSeason ? `~${days} day${days !== 1 ? "s" : ""}` : `~${days} days (paused)`;
        this._labelRow(lx, vx, vw, y, "Est. Ready:", ds, inSeason ? "#ffffff" : "#ffaa44");
        y += lh;
      } else {
        this.changeTextColor("#77ee77");
        this.drawText("✓  Ready to Harvest!", lx, y, iw - lx * 2, "center");
        this.resetTextColor();
        y += lh;
      }

      const weather = currentWeather();
      if (weather !== "none" && inSeason) {
        const WLABELS = { rain: "Rain   (+30% growth speed)", storm: "Storm  (+10% growth speed)", snow: "Snow   (−50% growth speed)" };
        const mult = WEATHER_MULT[weather] ?? 1.0;
        const wcolor = mult >= 1.0 ? "#77ee77" : "#ee7777";
        this._labelRow(lx, vx, vw, y, "Weather:", WLABELS[weather] || weather, wcolor);
        y += lh;
      }
      this._labelRow(lx, vx, vw, y, "Seed Cost:", `${def.cost}G`, "#ffdd66");
    }
    _labelRow(lx, vx, vw, y, label, value, valueColor) {
      this.changeTextColor(ColorManager.systemColor());
      this.drawText(label, lx, y, vx - lx - 4);
      this.resetTextColor();
      if (valueColor) this.changeTextColor(valueColor);
      this.drawTextEx(String(value), vx, y, vw);
      this.resetTextColor();
    }
    _drawBar(x, y, w, ratio) {
      const h = 14;
      this.contents.fillRect(x, y, w, h, "#222222");
      this.contents.fillRect(x + 1, y + 1, w - 2, h - 2, "#444444");
      const fw = Math.floor((w - 2) * ratio);
      if (fw > 0) {
        const c = ratio >= 1.0 ? "#44dd44" : ratio >= 0.5 ? "#88cc22" : "#bbbb22";
        this.contents.fillRect(x + 1, y + 1, fw, h - 2, c);
      }
    }
  }

  // ============================================================
  //  WINDOW: Plant Command
  // ============================================================

  let _cmdIsEmpty = false;

  class Window_PlantCommand extends Window_Command {
    initialize(rect) {
      this._modeEmpty = _cmdIsEmpty;
      super.initialize(rect);
    }
    makeCommandList() {
      if (this._modeEmpty) {
        this.addCommand("Plant", "plant");
        this.addCommand("Cancel", "cancel");
      } else {
        this.addCommand("Info", "info");
        this.addCommand("Harvest", "harvest");
        this.addCommand("Remove", "remove");
        this.addCommand("Cancel", "cancel");
      }
    }
    maxCols() { return this._modeEmpty ? 2 : 4; }
    numVisibleRows() { return 1; }
  }

  // ============================================================
  //  WINDOW: Plant Select
  // ============================================================

  class Window_PlantSelect extends Window_Command {
    initialize(rect) {
      super.initialize(rect);
      this.hide();
    }

    setPreviewWindow(previewWindow) {
      this._previewWindow = previewWindow;
      this.callUpdateHelp();
    }

    callUpdateHelp() {
      super.callUpdateHelp();
      if (this._previewWindow && this.currentSymbol()) {
        this._previewWindow.setPlant(this.currentSymbol());
      }
    }

    makeCommandList() {
      const season = currentSeason();
      for (const [id, def] of Object.entries(PLANT_DB)) {
        const canAfford = $gameParty ? $gameParty.gold() >= def.cost : false;
        this.addCommand(id, id, canAfford);
        const item = this._list[this._list.length - 1];
        item._def      = def;
        item._inSeason = def.seasons.includes(season);
      }
    }

    refresh() {
      this.clearCommandList();
      this.makeCommandList();
      super.refresh();
    }

    drawItem(index) {
      const entry = this._list[index];
      if (!entry) return;
      const def = entry._def || PLANT_DB[entry.symbol];
      if (!def) return;

      const rect     = this.itemLineRect(index);
      const pad      = this.itemPadding();
      const rx       = rect.x;
      const ry       = rect.y;
      const rw       = rect.width;
      const lh       = this.lineHeight();
      const inSeason = entry._inSeason;
      const hasGold  = $gameParty && $gameParty.gold() >= def.cost;

      this.changePaintOpacity(entry.enabled);

      const DOT = 10;
      this.contents.fillRect(rx, ry + Math.floor((lh - DOT) / 2), DOT, DOT,
                              inSeason ? "#44dd44" : "#444455");

      this.changeTextColor(inSeason ? "#ffffff" : "#888899");
      this.drawText(entry.symbol, rx + DOT + 6, ry, rw - DOT - 6 - 76);

      const euros = (def.cost / 100).toFixed(2) + "€";
      this.changeTextColor(hasGold ? "#ffdd66" : "#cc4444");
      this.drawText(euros, rx + rw - 76, ry, 76, "right");

      this.resetTextColor();
      this.changePaintOpacity(true);
    }

    maxCols()        { return 1; }
    numVisibleRows() { return Math.floor(this.innerHeight / this.itemHeight()); }
  }

  // ============================================================
  //  WINDOW: Plant Preview (Animated)
  // ============================================================

  class Window_PlantPreview extends Window_Base {
    initialize(rect) {
      super.initialize(rect);
      this._plantId = null;
      this._stage   = 0;
      this._timer   = 0;

      this._sprite = new Sprite();
      this.addInnerChild(this._sprite);

      this._stageLabel = new Sprite(new Bitmap(this.innerWidth, 28));
      this.addInnerChild(this._stageLabel);

      this.hide();
    }

    setPlant(plantId) {
      if (this._plantId !== plantId) {
        this._plantId = plantId;
        this._stage   = 0;
        this._timer   = 0;
        this.refresh();
        this._loadSprite();
      }
    }

    update() {
      super.update();
      if (this._plantId && this.visible) {
        this._timer++;
        if (this._timer >= 50) {
          this._timer = 0;
          this._stage = (this._stage + 1) % 4;
          this.updateSpriteFrame();
        }
      }
    }

    refresh() {
      this.contents.clear();
      if (!this._plantId) return;
      const def = PLANT_DB[this._plantId];
      if (!def) return;

      const lh  = this.lineHeight();
      const iw  = this.innerWidth;
      const pad = this.itemPadding();
      const lx  = pad;
      let   y   = 2;

      // ── Header ──────────────────────────────────────────────
      this.changeTextColor(ColorManager.systemColor());
      this.drawText(this._plantId, 0, y, iw, "center");
      this.resetTextColor();
      y += lh;
      this.contents.fillRect(lx, y, iw - lx * 2, 1, ColorManager.systemColor());
      y += 4;

      // sprite area reserved (positioned in updateSpriteFrame)
      const SPRITE_AREA = 92;
      y += SPRITE_AREA;

      // ── Divider ─────────────────────────────────────────────
      this.contents.fillRect(lx, y, iw - lx * 2, 1, "#444455");
      y += 6;

      // ── Info table ──────────────────────────────────────────
      const half      = Math.floor(iw / 2);
      const curSeason = currentSeason();
      const inSeason  = isGreenhouse() || def.seasons.includes(curSeason);
      const hasGold   = $gameParty && $gameParty.gold() >= def.cost;
      const euros     = (def.cost / 100).toFixed(2) + "€";

      this._row(lx, y, iw, lh, "Cost",
                euros, hasGold ? "#ffdd66" : "#cc4444");         y += lh;

      this._row(lx, y, iw, lh, "Status",
                inSeason ? "In Season" : "Dormant",
                inSeason ? "#44dd44"   : "#ee7777");             y += lh;

      // Seasons row — each tag gets its own season color
      const ABBR        = { SPRING: "Spr", SUMMER: "Sum", AUTUMN: "Aut", WINTER: "Win" };
      const SEASON_COLS = { SPRING: "#88dd44", SUMMER: "#ffcc00", AUTUMN: "#ee8833", WINTER: "#88aaff" };
      this.changeTextColor(ColorManager.systemColor());
      this.drawText("Seasons", lx, y, half - lx);
      let sx = half;
      for (const s of def.seasons) {
        this.changeTextColor(s === curSeason ? (SEASON_COLS[s] || "#ffffff") : "#555566");
        this.drawText(ABBR[s] || s, sx, y, 36);
        sx += 32;
      }
      this.resetTextColor();
      y += lh;

      this._row(lx, y, iw, lh, "Growth",
                `${def.growthDays} days`, "#9999cc");            y += lh;

      this._row(lx, y, iw, lh, "Yield",
                `×${def.yieldMin} – ${def.yieldMax}`, "#bb88cc");
    }

    _row(lx, y, iw, lh, label, value, valueColor) {
      const half = Math.floor(iw / 2);
      this.changeTextColor(ColorManager.systemColor());
      this.drawText(label, lx, y, half - lx);
      this.changeTextColor(valueColor || "#ffffff");
      this.drawText(value, half, y, half, "right");
      this.resetTextColor();
    }

    _loadSprite() {
      if (!this._plantId) { this._sprite.bitmap = null; return; }
      const def = PLANT_DB[this._plantId];
      if (!def) return;
      this._sprite.bitmap = ImageManager.loadCharacter(def.sprite);
      this.updateSpriteFrame();
    }



    updateSpriteFrame() {
      if (!this._sprite || !this._sprite.bitmap) return;
      if (!this._sprite.bitmap.isReady()) {
        this._sprite.bitmap.addLoadListener(this.updateSpriteFrame.bind(this));
        return;
      }

      const def    = PLANT_DB[this._plantId];
      const isBig  = ImageManager.isBigCharacter(def.sprite);
      const pw     = this._sprite.bitmap.width  / (isBig ? 3 : 12);
      const ph     = this._sprite.bitmap.height / (isBig ? 4 : 8);
      this._sprite.setFrame(0, this._stage * ph, pw, ph);

      // scale to fill sprite area; cap at 3×
      const SPRITE_AREA = 92;
      const lh          = this.lineHeight();
      const TOP         = lh + 6;   // below header + divider
      const scale       = Math.min((SPRITE_AREA - 22) / ph, 3.0);
      this._sprite.scale.set(scale, scale);
      this._sprite.anchor.set(0.5, 1.0);
      this._sprite.x = Math.floor(this.innerWidth / 2);
      this._sprite.y = TOP + SPRITE_AREA - 4;

      // stage label sits just below the sprite
      if (this._stageLabel) {
        this._stageLabel.x = 0;
        this._stageLabel.y = TOP + SPRITE_AREA - 22;
      }
    }
  }


  // ============================================================
  //  SCENE: Plant Quick Menu
  // ============================================================

  class Scene_PlantQuickMenu extends Scene_MenuBase {
    initialize() {
      super.initialize();
      const a       = Scene_PlantQuickMenu._openArgs || {};
      this._mapId   = a.mapId   || 0;
      this._eventId = a.eventId || 0;
      this._rec     = a.rec     || null;
    }

    create() {
      super.create();
      this._createCommandWindow();
    }

    _hasPlant() {
      return !!(this._rec && !this._rec.removed && this._rec.plantId);
    }

    _createCommandWindow() {
      const ww   = Math.floor(Graphics.boxWidth * 0.5);
      const rows = this._hasPlant() ? 4 : 2;
      const wh   = this.calcWindowHeight(rows, true);
      const wx   = Math.floor((Graphics.boxWidth  - ww) / 2);
      const wy   = Math.floor((Graphics.boxHeight - wh) / 2);
      _quickHasPlant = this._hasPlant();
      this._commandWindow = new Window_PlantQuickCommand(new Rectangle(wx, wy, ww, wh));
      this._commandWindow.setHandler("check",   this._onCheck.bind(this));
      this._commandWindow.setHandler("harvest", this._onHarvest.bind(this));
      this._commandWindow.setHandler("plant",   this._onPlant.bind(this));
      this._commandWindow.setHandler("remove",  this._onRemove.bind(this));
      this._commandWindow.setHandler("cancel",  this.popScene.bind(this));
      this.addWindow(this._commandWindow);
    }

    _onCheck() {
      Scene_PlantMenu._openArgs = { mapId: this._mapId, eventId: this._eventId, rec: this._rec };
      SceneManager.push(Scene_PlantMenu);
    }

    _onHarvest() {
      if (!this._hasPlant()) {
        window.skipLocalization = true;
        $gameMessage.add("Nothing to harvest here.");
        window.skipLocalization = false;
        this.popScene();
        return;
      }
      const rec  = this._rec;
      const def  = PLANT_DB[rec.plantId];
      const item = $dataItems[def.itemId];
      if (item && rec.stage >= 2) {
        const qty = calcYield(def, rec.effectiveGrowthMinutes);
        $gameParty.gainItem(item, qty);
        SoundManager.playShop();
        window.skipLocalization = true;
        $gameMessage.add(`\\I[${item.iconIndex}]Harvested \\c[14]${item.name}\\c[0] ×${qty}!`);
        window.skipLocalization = false;
      }
      rec.removed = true;
      rec.plantId = null;
      rec.stage   = 0;
      saveRecord(this._mapId, this._eventId, rec);
      const ev = $gameMap.event(this._eventId);
      if (ev) applySprite(ev, rec);
      this.popScene();
    }

    _onPlant() {
      if (!this._selectWindow) {
        const ww   = Math.floor(Graphics.boxWidth  * 0.86);
        const wh   = Math.floor(Graphics.boxHeight * 0.88);
        const wx   = Math.floor((Graphics.boxWidth  - ww) / 2);
        const wy   = Math.floor((Graphics.boxHeight - wh) / 2);

        const previewW = 300;
        const selectW = ww - previewW;

        this._selectWindow = new Window_PlantSelect(new Rectangle(wx, wy, selectW, wh));
        this._selectWindow.setHandler("ok",     this._onPlantOk.bind(this));
        this._selectWindow.setHandler("cancel", this._onPlantCancel.bind(this));
        this.addWindow(this._selectWindow);

        this._previewWindow = new Window_PlantPreview(new Rectangle(wx + selectW, wy, previewW, wh));
        this.addWindow(this._previewWindow);
        this._selectWindow.setPreviewWindow(this._previewWindow);
      }
      this._commandWindow.deactivate();
      this._selectWindow.refresh();
      this._selectWindow.show();
      this._previewWindow.show();
      this._selectWindow.activate();
      this._selectWindow.select(0);
    }

    _onPlantOk() {
      const plantId = this._selectWindow.currentSymbol();
      const def     = PLANT_DB[plantId];
      if (!def || $gameParty.gold() < def.cost) {
        SoundManager.playBuzzer();
        this._selectWindow.activate();
        return;
      }
      $gameParty.loseGold(def.cost);
      const now    = gameMinutes();
      const newRec = { plantId, plantedAt: now, lastUpdateMinutes: now, effectiveGrowthMinutes: 0, stage: 0, removed: false };
      saveRecord(this._mapId, this._eventId, newRec);
      this._rec = newRec;
      const ev = $gameMap.event(this._eventId);
      if (ev) applySprite(ev, newRec);
      SoundManager.playShop();
      window.skipLocalization = true;
      $gameMessage.add(`Planted \\c[14]${plantId}\\c[0]!`);
      window.skipLocalization = false;
      this._selectWindow.hide();
      this._previewWindow.hide();
      this.popScene();
    }

    _onPlantCancel() {
      this._selectWindow.hide();
      this._previewWindow.hide();
      this._commandWindow.activate();
    }

    _onRemove() {
      if (!this._hasPlant()) { this._commandWindow.activate(); return; }
      const rec   = this._rec;
      rec.removed = true;
      rec.plantId = null;
      rec.stage   = 0;
      saveRecord(this._mapId, this._eventId, rec);
      const ev = $gameMap.event(this._eventId);
      if (ev) applySprite(ev, rec);
      SoundManager.playCancel();
      this.popScene();
    }
  }

  // ============================================================
  //  WINDOW: Plant Quick Command
  // ============================================================

  let _quickHasPlant = false;

  class Window_PlantQuickCommand extends Window_Command {
    initialize(rect) {
      this._hasPlant = _quickHasPlant;
      super.initialize(rect);
    }
    makeCommandList() {
      if (this._hasPlant) {
        this.addCommand("Check",   "check");
        this.addCommand("Harvest", "harvest");
        this.addCommand("Remove",  "remove");
        this.addCommand("Cancel",  "cancel");
      } else {
        this.addCommand("Plant",   "plant");
        this.addCommand("Cancel",  "cancel");
      }
    }
    maxCols()        { return 1; }
    numVisibleRows() { return this._hasPlant ? 4 : 2; }
  }

})();
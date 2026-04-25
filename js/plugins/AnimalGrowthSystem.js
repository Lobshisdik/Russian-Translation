/*:
 * @target MZ
 * @plugindesc v1.0.0 Animal Growth System - manages animal lifecycle, buying, selling, and item production using game time.
 * @author Omni-Lex
 *
 * @help AnimalGrowthSystem v1.0.0
 * ============================================================
 * Manages an animal husbandry system driven by the
 * TimeDateSystem (Variable 114 = game minutes).
 *
 * --- Setup ---
 * 1. Name any event "Animal" on the map.
 * 2. Call plugin command "AnimalMenu" from that event to open
 *    the animal management menu.
 * 3. Animal sprites must be in img/characters/
 *    e.g. !$MV_Cow.png  (single-character, no-shadow prefix)
 *    The sprite sheet uses direction rows as growth stages:
 *    Baby = direction DOWN (row 0), Adult = direction LEFT (row 1).
 *
 * --- Growth Logic ---
 * - Animals grow from Baby to Adult over their defined growthDays.
 * - Animals that only have an Adult stage start as adults.
 * - Adult animals produce items at defined intervals.
 *
 * --- Animal Events ---
 * - Each "Animal" event on the map is a slot for one animal.
 * - If all slots are occupied, buying more animals is blocked.
 * - Animals can be sold from the sell menu.
 *
 * --- Skins ---
 * - Animals can have multiple skins (sprite variants).
 * - Baby skins are independent of adult skins.
 * - Adult skin is picked at random when the animal is bought.
 *
 * @command AnimalMenu
 * @text Animal Menu
 * @desc Opens the animal interaction menu for the calling event.
 *
 * @command BuyAnimal
 * @text Buy Animal
 * @desc Opens the buy menu to purchase an animal for the calling event.
 *
 * @command SellAnimal
 * @text Sell Animal
 * @desc Opens the sell confirmation for the animal at the calling event.
 *
 * @command CollectProduce
 * @text Collect Produce
 * @desc Collects any ready produce from the animal at the calling event.
 *
 * @command RemoveAnimal
 * @text Remove Animal
 * @desc Removes the animal at the calling event without giving gold.
 */

(() => {
  "use strict";

  const pluginName = "AnimalGrowthSystem";

  // ============================================================
  //  CONSTANTS
  // ============================================================

  const GAME_TIME_VAR = 114;
  const MINUTES_PER_DAY = 1440;

  // Direction per growth stage: 2=down (baby), 4=left (adult)
  const STAGE_DIRS = { baby: 2, adult: 4 };
  const STAGE_NAMES = { baby: "Baby", adult: "Adult" };

  // ============================================================
  //  ANIMAL DATABASE
  // ============================================================

  // Production items use placeholder itemIds — adjust to your database.
  // produces: array of { itemId, interval (in days), yieldMin, yieldMax }

  const ANIMAL_DB = {
    Chicken: {
      adultSkins: [
        "Animals/!$MV_Chicken_1", "Animals/!$MV_Chicken_2", "Animals/!$MV_Chicken_3",
        "Animals/!$MV_Chicken_4", "Animals/!$MV_Chicken_5", "Animals/!$MV_Chicken_6", "Animals/!$MV_Chicken_7"
      ],
      babySkins: ["Animals/!$MV_Chick"],
      hasBaby: true,
      buyCostBaby: 2000,
      buyCostAdult: 5000,
      sellValueBaby: 1000,
      sellValueAdult: 2500,
      growthDays: 7,
      produces: [
        { itemId: 575, interval: 1, yieldMin: 1, yieldMax: 3 }
      ]
    },
    Cow: {
      adultSkins: [
        "Animals/!$MV_Cow", "Animals/!$MV_Cow_Big", "Animals/!$MV_Cow_Big_2",
        "Animals/!$MV_Cow_Big_3", "Animals/!$MV_Cow_Big_4", "Animals/!$MV_Cow_Big_5"
      ],
      babySkins: ["Animals/!$MV_Cow_Baby_1", "Animals/!$MV_Cow_Baby_2"],
      hasBaby: true,
      buyCostBaby: 10000,
      buyCostAdult: 30000,
      sellValueBaby: 5000,
      sellValueAdult: 15000,
      growthDays: 14,
      produces: [
        { itemId: 575, interval: 2, yieldMin: 1, yieldMax: 2 },
        { itemId: 575, interval: 5, yieldMin: 1, yieldMax: 1 }
      ]
    },
    Dog: {
      adultSkins: [
        "Animals/!$MV_Dog_Basenji", "Animals/!$MV_Dog_German_Shepherd",
        "Animals/!$MV_Dog_Labrador", "Animals/!$MV_Dog_Shepherd"
      ],
      babySkins: [],
      hasBaby: false,
      buyCostAdult: 20000,
      sellValueAdult: 10000,
      growthDays: 0,
      produces: []
    },
    Donkey: {
      adultSkins: [
        "Animals/!$MV_Donkey", "Animals/!$MV_Donkey_2", "Animals/!$MV_Donkey_3",
        "Animals/!$MV_Donkey_4", "Animals/!$MV_Donkey_Front_Ears_Up"
      ],
      babySkins: ["Animals/!$MV_Donkey_Baby_1", "Animals/!$MV_Donkey_Baby_2"],
      hasBaby: true,
      buyCostBaby: 8000,
      buyCostAdult: 20000,
      sellValueBaby: 4000,
      sellValueAdult: 10000,
      growthDays: 14,
      produces: []
    },
    Duck: {
      adultSkins: [
        "Animals/!$MV_Duck_1", "Animals/!$MV_Duck_2", "Animals/!$MV_Duck_3", "Animals/!$MV_Duck_4"
      ],
      babySkins: ["Animals/!$MV_Duckling_1", "Animals/!$MV_Duckling_2"],
      hasBaby: true,
      buyCostBaby: 1500,
      buyCostAdult: 4000,
      sellValueBaby: 750,
      sellValueAdult: 2000,
      growthDays: 5,
      produces: [
        { itemId: 575, interval: 2, yieldMin: 1, yieldMax: 2 }
      ]
    },
    Goat: {
      adultSkins: [
        "Animals/!$MV_Goat_1", "Animals/!$MV_Goat_2", "Animals/!$MV_Goat_3", "Animals/!$MV_Goat_4"
      ],
      babySkins: ["Animals/!$MV_Goat_Baby_1", "Animals/!$MV_Goat_Baby_2"],
      hasBaby: true,
      buyCostBaby: 6000,
      buyCostAdult: 15000,
      sellValueBaby: 3000,
      sellValueAdult: 7500,
      growthDays: 10,
      produces: [
        { itemId: 575, interval: 2, yieldMin: 1, yieldMax: 2 }
      ]
    },
    Pig: {
      adultSkins: [
        "Animals/!$MV_Pig_1", "Animals/!$MV_Pig_2", "Animals/!$MV_Pig_3",
        "Animals/!$MV_Pig_4", "Animals/!$MV_Pig_5"
      ],
      babySkins: ["Animals/!$MV_Piglet_1", "Animals/!$MV_Piglet_2"],
      hasBaby: true,
      buyCostBaby: 5000,
      buyCostAdult: 12000,
      sellValueBaby: 2500,
      sellValueAdult: 6000,
      growthDays: 10,
      produces: [
        { itemId: 575, interval: 3, yieldMin: 1, yieldMax: 2 }
      ]
    },
    Rabbit: {
      adultSkins: [
        "Animals/!$MV_Rabbit_1", "Animals/!$MV_Rabbit_2", "Animals/!$MV_Rabbit_3",
        "Animals/!$MV_Rabbit_4", "Animals/!$MV_Rabbit_5", "Animals/!$MV_Rabbit_6"
      ],
      babySkins: ["Animals/!$MV_Rabbit_Baby_1", "Animals/!$MV_Rabbit_Baby_2", "Animals/!$MV_Rabbit_Baby_3"],
      hasBaby: true,
      buyCostBaby: 1000,
      buyCostAdult: 3000,
      sellValueBaby: 500,
      sellValueAdult: 1500,
      growthDays: 5,
      produces: [
        { itemId: 575, interval: 3, yieldMin: 1, yieldMax: 2 }
      ]
    },
    Rooster: {
      adultSkins: [
        "Animals/!$MV_Rooster_1", "Animals/!$MV_Rooster_2", "Animals/!$MV_Rooster_3",
        "Animals/!$MV_Rooster_4", "Animals/!$MV_Rooster_5", "Animals/!$MV_Rooster_6", "Animals/!$MV_Rooster_7"
      ],
      babySkins: [],
      hasBaby: false,
      buyCostAdult: 4000,
      sellValueAdult: 2000,
      growthDays: 0,
      produces: []
    },
    Sheep: {
      adultSkins: [
        "Animals/!$MV_Sheep_1", "Animals/!$MV_Sheep_2", "Animals/!$MV_Sheep_3", "Animals/!$MV_Sheep_4",
        "Animals/!$MV_Sheep_5", "Animals/!$MV_Sheep_6", "Animals/!$MV_Sheep_7", "Animals/!$MV_Sheep_8",
        "Animals/!$MV_Sheep_9", "Animals/!$MV_Sheep_10", "Animals/!$MV_Sheep_11"
      ],
      babySkins: ["Animals/!$MV_Sheep_Baby_1", "Animals/!$MV_Sheep_Baby_2"],
      hasBaby: true,
      buyCostBaby: 4000,
      buyCostAdult: 10000,
      sellValueBaby: 2000,
      sellValueAdult: 5000,
      growthDays: 10,
      produces: [
        { itemId: 575, interval: 3, yieldMin: 1, yieldMax: 3 }
      ]
    }
  };

  // Old variants that don't fit numbered pattern — treated as extra adult skins
  // !$MV_Chicken_Old -> extra Chicken adult skin
  // !$MV_Goat_Old    -> extra Goat adult skin
  ANIMAL_DB.Chicken.adultSkins.push("Animals/!$MV_Chicken_Old");
  ANIMAL_DB.Goat.adultSkins.push("Animals/!$MV_Goat_Old");

  // ============================================================
  //  HELPERS
  // ============================================================

  function animalKey(mapId, eventId) {
    return `${mapId}_${eventId}`;
  }

  function getRecord(mapId, eventId) {
    if (!$gameSystem._animalData) $gameSystem._animalData = {};
    return $gameSystem._animalData[animalKey(mapId, eventId)] || null;
  }

  function saveRecord(mapId, eventId, rec) {
    if (!$gameSystem._animalData) $gameSystem._animalData = {};
    $gameSystem._animalData[animalKey(mapId, eventId)] = rec;
    updateSelfSwitch(mapId, eventId, rec);
  }

  function deleteRecord(mapId, eventId) {
    if (!$gameSystem._animalData) $gameSystem._animalData = {};
    delete $gameSystem._animalData[animalKey(mapId, eventId)];
    if ($gameSelfSwitches) {
      $gameSelfSwitches.setValue([mapId, eventId, "A"], true);
    }
  }

  function updateSelfSwitch(mapId, eventId, rec) {
    if (!$gameSelfSwitches) return;
    const hasAnimal = !!(rec && rec.animalId);
    $gameSelfSwitches.setValue([mapId, eventId, "A"], !hasAnimal);
  }

  function gameMinutes() {
    return ($gameVariables ? $gameVariables.value(GAME_TIME_VAR) : 0) || 0;
  }

  function isAnimalEvent(event) {
    if (!$dataMap || !$dataMap.events) return false;
    const data = $dataMap.events[event._eventId];
    return !!(data && (data.name || "").toLowerCase() === "animal");
  }

  function randomPick(arr) {
    if (!arr || arr.length === 0) return null;
    return arr[Math.floor(Math.random() * arr.length)];
  }

  function calcGrowthProgress(rec, def) {
    if (!def.hasBaby || def.growthDays <= 0) return 1.0;
    const elapsed = rec.effectiveGrowthMinutes || 0;
    return Math.min(elapsed / (def.growthDays * MINUTES_PER_DAY), 1.0);
  }

  function getStage(rec, def) {
    if (!def.hasBaby) return "adult";
    return calcGrowthProgress(rec, def) >= 1.0 ? "adult" : "baby";
  }

  function getCurrentSprite(rec, def) {
    const stage = getStage(rec, def);
    if (stage === "baby") {
      return rec.babySkin || (def.babySkins[0] || def.adultSkins[0]);
    }
    return rec.adultSkin || def.adultSkins[0];
  }

  // Count total animal events on current map
  function countAnimalEvents() {
    if (!$gameMap || !$dataMap || !$dataMap.events) return 0;
    let count = 0;
    for (const ev of $gameMap.events()) {
      if (ev && isAnimalEvent(ev)) count++;
    }
    return count;
  }

  // Count occupied animal events on current map
  function countOccupiedSlots() {
    if (!$gameMap || !$gameSystem._animalData) return 0;
    const mapId = $gameMap.mapId();
    let count = 0;
    for (const ev of $gameMap.events()) {
      if (!ev || !isAnimalEvent(ev)) continue;
      const rec = getRecord(mapId, ev._eventId);
      if (rec && rec.animalId) count++;
    }
    return count;
  }

  function hasFreeSlot() {
    return countOccupiedSlots() < countAnimalEvents();
  }

  // ============================================================
  //  PRODUCTION
  // ============================================================

  function checkProduce(rec, def) {
    if (!def.produces || def.produces.length === 0) return [];
    if (getStage(rec, def) !== "adult") return [];
    const now = gameMinutes();
    const ready = [];
    if (!rec.produceTimers) rec.produceTimers = {};
    for (let i = 0; i < def.produces.length; i++) {
      const prod = def.produces[i];
      const key = `p${i}`;
      if (rec.produceTimers[key] === undefined) {
        rec.produceTimers[key] = now;
      }
      const elapsed = now - rec.produceTimers[key];
      const needed = prod.interval * MINUTES_PER_DAY;
      if (elapsed >= needed) {
        const qty = prod.yieldMin + Math.floor(Math.random() * (prod.yieldMax - prod.yieldMin + 1));
        ready.push({ itemId: prod.itemId, qty, prodIndex: i });
      }
    }
    return ready;
  }

  function collectProduce(rec, def) {
    const items = checkProduce(rec, def);
    const now = gameMinutes();
    for (const r of items) {
      const item = $dataItems[r.itemId];
      if (item) {
        $gameParty.gainItem(item, r.qty);
      }
      const key = `p${r.prodIndex}`;
      rec.produceTimers[key] = now;
    }
    return items;
  }

  function hasReadyProduce(rec, def) {
    return checkProduce(rec, def).length > 0;
  }

  // ============================================================
  //  GROWTH UPDATE
  // ============================================================

  function updateGrowth(mapId, eventId) {
    const rec = getRecord(mapId, eventId);
    if (!rec || !rec.animalId) return;
    const def = ANIMAL_DB[rec.animalId];
    if (!def || !def.hasBaby) return;

    const now = gameMinutes();
    const elapsed = now - rec.lastUpdateMinutes;
    if (elapsed <= 0) return;

    rec.effectiveGrowthMinutes += elapsed;
    rec.lastUpdateMinutes = now;

    const oldStage = rec.stage;
    rec.stage = getStage(rec, def);

    // When transitioning to adult, initialize produce timers
    if (oldStage === "baby" && rec.stage === "adult") {
      rec.produceTimers = {};
      for (let i = 0; i < (def.produces || []).length; i++) {
        rec.produceTimers[`p${i}`] = now;
      }
    }

    saveRecord(mapId, eventId, rec);
  }

  function applySprite(event, rec) {
    if (!rec || !rec.animalId) {
      event.setImage("", 0);
      return;
    }
    const def = ANIMAL_DB[rec.animalId];
    if (!def) return;
    const sprite = getCurrentSprite(rec, def);
    event.setImage(sprite, 0);
    event._direction = STAGE_DIRS[rec.stage] || 2;
    event._directionFix = false;
    event.setWalkAnime(false);
    event.setStepAnime(false);
    event._pattern = 0;
  }

  function refreshMapAnimals() {
    if (!$gameMap || !$gameSystem) return;
    const mapId = $gameMap.mapId();
    for (const ev of $gameMap.events()) {
      if (!ev || !isAnimalEvent(ev)) continue;
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
    refreshMapAnimals();
  };

  const _Game_Event_update = Game_Event.prototype.update;
  Game_Event.prototype.update = function (sceneActive) {
    _Game_Event_update.call(this, sceneActive);
    if (!isAnimalEvent(this)) return;
    const rec = getRecord($gameMap.mapId(), this._eventId);
    if (rec && rec.animalId) {
      const def = ANIMAL_DB[rec.animalId];
      if (def) {
        this._direction = STAGE_DIRS[rec.stage] || 2;
        this._pattern = 0;
      }
    }
  };

  const _Game_Event_setupPageSettings = Game_Event.prototype.setupPageSettings;
  Game_Event.prototype.setupPageSettings = function () {
    _Game_Event_setupPageSettings.call(this);
    if (!$gameMap || !isAnimalEvent(this)) return;
    const rec = getRecord($gameMap.mapId(), this._eventId);
    if (rec && rec.animalId) applySprite(this, rec);
  };

  const _Game_Event_lock = Game_Event.prototype.lock;
  Game_Event.prototype.lock = function () {
    if (isAnimalEvent(this)) return;
    _Game_Event_lock.call(this);
  };

  // ============================================================
  //  PLUGIN COMMANDS
  // ============================================================

  PluginManager.registerCommand(pluginName, "AnimalMenu", function () {
    const eventId = this.eventId();
    const mapId = $gameMap.mapId();
    updateGrowth(mapId, eventId);
    const rec = getRecord(mapId, eventId);
    Scene_AnimalQuickMenu._openArgs = { mapId, eventId, rec };
    SceneManager.push(Scene_AnimalQuickMenu);
  });

  PluginManager.registerCommand(pluginName, "BuyAnimal", function () {
    const eventId = this.eventId();
    const mapId = $gameMap.mapId();
    const rec = getRecord(mapId, eventId);
    if (rec && rec.animalId) {
      $gameMessage.add("This slot already has an animal.");
      return;
    }
    Scene_AnimalBuy._openArgs = { mapId, eventId };
    SceneManager.push(Scene_AnimalBuy);
  });

  PluginManager.registerCommand(pluginName, "SellAnimal", function () {
    const eventId = this.eventId();
    const mapId = $gameMap.mapId();
    updateGrowth(mapId, eventId);
    const rec = getRecord(mapId, eventId);
    if (!rec || !rec.animalId) {
      $gameMessage.add("No animal here to sell.");
      return;
    }
    const def = ANIMAL_DB[rec.animalId];
    const val = rec.stage === "baby" ? (def.sellValueBaby || 0) : (def.sellValueAdult || 0);
    $gameParty.gainGold(val);
    SoundManager.playShop();
    $gameMessage.add(`Sold \\c[14]${rec.animalId}\\c[0] for ${val}G!`);
    deleteRecord(mapId, eventId);
    const ev = $gameMap.event(eventId);
    if (ev) applySprite(ev, null);
  });

  PluginManager.registerCommand(pluginName, "CollectProduce", function () {
    const eventId = this.eventId();
    const mapId = $gameMap.mapId();
    updateGrowth(mapId, eventId);
    const rec = getRecord(mapId, eventId);
    if (!rec || !rec.animalId) return;
    const def = ANIMAL_DB[rec.animalId];
    if (!def) return;
    const items = collectProduce(rec, def);
    if (items.length > 0) {
      SoundManager.playShop();
      for (const r of items) {
        const item = $dataItems[r.itemId];
        if (item) {
          $gameMessage.add(`\\I[${item.iconIndex}]Collected \\c[14]${item.name}\\c[0] ×${r.qty}!`);
        }
      }
      saveRecord(mapId, eventId, rec);
    } else {
      $gameMessage.add("Nothing to collect yet.");
    }
  });

  PluginManager.registerCommand(pluginName, "RemoveAnimal", function () {
    const eventId = this.eventId();
    const mapId = $gameMap.mapId();
    const rec = getRecord(mapId, eventId);
    if (!rec || !rec.animalId) return;
    deleteRecord(mapId, eventId);
    const ev = $gameMap.event(eventId);
    if (ev) applySprite(ev, null);
  });

  // ============================================================
  //  SCENE: Animal Quick Menu
  // ============================================================

  class Scene_AnimalQuickMenu extends Scene_MenuBase {
    initialize() {
      super.initialize();
      const a = Scene_AnimalQuickMenu._openArgs || {};
      this._mapId = a.mapId || 0;
      this._eventId = a.eventId || 0;
      this._rec = a.rec || null;
    }

    create() {
      super.create();
      this._createCommandWindow();
    }

    _hasAnimal() {
      return !!(this._rec && this._rec.animalId);
    }

    _createCommandWindow() {
      const ww = Math.floor(Graphics.boxWidth * 0.5);
      const rows = this._hasAnimal() ? 5 : 2;
      const wh = this.calcWindowHeight(rows, true);
      const wx = Math.floor((Graphics.boxWidth - ww) / 2);
      const wy = Math.floor((Graphics.boxHeight - wh) / 2);
      _quickHasAnimal = this._hasAnimal();
      _quickHasProduce = false;
      if (this._hasAnimal()) {
        const def = ANIMAL_DB[this._rec.animalId];
        _quickHasProduce = def ? hasReadyProduce(this._rec, def) : false;
      }
      this._commandWindow = new Window_AnimalQuickCommand(new Rectangle(wx, wy, ww, wh));
      this._commandWindow.setHandler("check", this._onCheck.bind(this));
      this._commandWindow.setHandler("collect", this._onCollect.bind(this));
      this._commandWindow.setHandler("sell", this._onSell.bind(this));
      this._commandWindow.setHandler("buy", this._onBuy.bind(this));
      this._commandWindow.setHandler("remove", this._onRemove.bind(this));
      this._commandWindow.setHandler("cancel", this.popScene.bind(this));
      this.addWindow(this._commandWindow);
    }

    _onCheck() {
      Scene_AnimalInfo._openArgs = { mapId: this._mapId, eventId: this._eventId, rec: this._rec };
      SceneManager.push(Scene_AnimalInfo);
    }

    _onCollect() {
      if (!this._hasAnimal()) { this.popScene(); return; }
      const def = ANIMAL_DB[this._rec.animalId];
      const items = collectProduce(this._rec, def);
      if (items.length > 0) {
        SoundManager.playShop();
        for (const r of items) {
          const item = $dataItems[r.itemId];
          if (item) {
            $gameMessage.add(`\\I[${item.iconIndex}]Collected \\c[14]${item.name}\\c[0] ×${r.qty}!`);
          }
        }
        saveRecord(this._mapId, this._eventId, this._rec);
      } else {
        $gameMessage.add("Nothing to collect yet.");
      }
      this.popScene();
    }

    _onSell() {
      if (!this._hasAnimal()) { this.popScene(); return; }
      const def = ANIMAL_DB[this._rec.animalId];
      const val = this._rec.stage === "baby" ? (def.sellValueBaby || 0) : (def.sellValueAdult || 0);
      $gameParty.gainGold(val);
      SoundManager.playShop();
      $gameMessage.add(`Sold \\c[14]${this._rec.animalId}\\c[0] for ${val}G!`);
      deleteRecord(this._mapId, this._eventId);
      const ev = $gameMap.event(this._eventId);
      if (ev) applySprite(ev, null);
      this.popScene();
    }

    _onBuy() {
      if (!this._buyWindow) {
        const ww = Math.floor(Graphics.boxWidth * 0.86);
        const wh = Math.floor(Graphics.boxHeight * 0.88);
        const wx = Math.floor((Graphics.boxWidth - ww) / 2);
        const wy = Math.floor((Graphics.boxHeight - wh) / 2);

        const previewW = 300;
        const selectW = ww - previewW;

        this._buyWindow = new Window_AnimalBuySelect(new Rectangle(wx, wy, selectW, wh));
        this._buyWindow.setHandler("ok", this._onBuyOk.bind(this));
        this._buyWindow.setHandler("cancel", this._onBuyCancel.bind(this));
        this.addWindow(this._buyWindow);

        this._previewWindow = new Window_AnimalPreview(new Rectangle(wx + selectW, wy, previewW, wh));
        this.addWindow(this._previewWindow);
        this._buyWindow.setPreviewWindow(this._previewWindow);
      }
      this._commandWindow.deactivate();
      this._buyWindow.refresh();
      this._buyWindow.show();
      this._previewWindow.show();
      this._buyWindow.activate();
      this._buyWindow.select(0);
    }

    _onBuyOk() {
      const sym = this._buyWindow.currentSymbol();
      // sym format: "AnimalName_baby" or "AnimalName_adult"
      const parts = sym.split("_stage_");
      const animalId = parts[0];
      const buyStage = parts[1]; // "baby" or "adult"
      const def = ANIMAL_DB[animalId];
      if (!def) { SoundManager.playBuzzer(); this._buyWindow.activate(); return; }

      const cost = buyStage === "baby" ? def.buyCostBaby : def.buyCostAdult;
      if ($gameParty.gold() < cost) { SoundManager.playBuzzer(); this._buyWindow.activate(); return; }

      $gameParty.loseGold(cost);
      const now = gameMinutes();
      const adultSkin = randomPick(def.adultSkins);
      const babySkin = def.hasBaby ? randomPick(def.babySkins) : null;

      const isBaby = buyStage === "baby" && def.hasBaby;
      const stage = isBaby ? "baby" : "adult";

      const produceTimers = {};
      if (stage === "adult") {
        for (let i = 0; i < (def.produces || []).length; i++) {
          produceTimers[`p${i}`] = now;
        }
      }

      const newRec = {
        animalId,
        boughtAt: now,
        lastUpdateMinutes: now,
        effectiveGrowthMinutes: isBaby ? 0 : def.growthDays * MINUTES_PER_DAY,
        stage,
        adultSkin,
        babySkin,
        produceTimers
      };
      saveRecord(this._mapId, this._eventId, newRec);
      this._rec = newRec;
      const ev = $gameMap.event(this._eventId);
      if (ev) applySprite(ev, newRec);
      SoundManager.playShop();
      $gameMessage.add(`Bought \\c[14]${animalId}\\c[0] (${STAGE_NAMES[stage]})!`);
      this._buyWindow.hide();
      this._previewWindow.hide();
      this.popScene();
    }

    _onBuyCancel() {
      this._buyWindow.hide();
      this._previewWindow.hide();
      this._commandWindow.activate();
    }

    _onRemove() {
      if (!this._hasAnimal()) { this._commandWindow.activate(); return; }
      deleteRecord(this._mapId, this._eventId);
      const ev = $gameMap.event(this._eventId);
      if (ev) applySprite(ev, null);
      SoundManager.playCancel();
      this.popScene();
    }
  }

  // ============================================================
  //  WINDOW: Animal Quick Command
  // ============================================================

  let _quickHasAnimal = false;
  let _quickHasProduce = false;

  class Window_AnimalQuickCommand extends Window_Command {
    initialize(rect) {
      this._hasAnimal = _quickHasAnimal;
      this._hasProduce = _quickHasProduce;
      super.initialize(rect);
    }
    makeCommandList() {
      if (this._hasAnimal) {
        this.addCommand("Check", "check");
        this.addCommand("Collect", "collect", this._hasProduce);
        this.addCommand("Sell", "sell");
        this.addCommand("Remove", "remove");
        this.addCommand("Cancel", "cancel");
      } else {
        this.addCommand("Buy", "buy");
        this.addCommand("Cancel", "cancel");
      }
    }
    maxCols() { return 1; }
    numVisibleRows() { return this._hasAnimal ? 5 : 2; }
  }

  // ============================================================
  //  SCENE: Animal Info
  // ============================================================

  class Scene_AnimalInfo extends Scene_MenuBase {
    initialize() {
      super.initialize();
      const a = Scene_AnimalInfo._openArgs || {};
      this._mapId = a.mapId || 0;
      this._eventId = a.eventId || 0;
      this._rec = a.rec || null;
    }

    create() {
      super.create();
      this._createInfoWindow();
      this._createCommandWindow();
    }

    _createInfoWindow() {
      const wh = Math.floor(Graphics.boxHeight * 0.7);
      const rect = new Rectangle(0, 0, Graphics.boxWidth, wh);
      this._infoWindow = new Window_AnimalInfo(rect);
      this._infoWindow.setRecord(this._rec);
      this.addWindow(this._infoWindow);
    }

    _createCommandWindow() {
      const wy = Math.floor(Graphics.boxHeight * 0.7);
      const wh = Graphics.boxHeight - wy;
      const rect = new Rectangle(0, wy, Graphics.boxWidth, wh);
      this._commandWindow = new Window_AnimalInfoCommand(rect);
      this._commandWindow.setHandler("back", this.popScene.bind(this));
      this._commandWindow.setHandler("cancel", this.popScene.bind(this));
      this.addWindow(this._commandWindow);
    }
  }

  class Window_AnimalInfoCommand extends Window_Command {
    makeCommandList() {
      this.addCommand("Back", "back");
    }
    maxCols() { return 1; }
    numVisibleRows() { return 1; }
  }

  // ============================================================
  //  WINDOW: Animal Info
  // ============================================================

  class Window_AnimalInfo extends Window_Base {
    initialize(rect) {
      super.initialize(rect);
      this._rec = null;
      this._sprite = new Sprite();
      this.addInnerChild(this._sprite);
    }

    setRecord(rec) {
      this._rec = rec;
      this.refresh();
      this._loadSprite();
    }

    refresh() {
      this.contents.clear();
      if (!this._rec || !this._rec.animalId) {
        this._drawEmpty();
      } else {
        this._drawInfo(this._rec);
      }
    }

    _drawEmpty() {
      const lh = this.lineHeight();
      this.changeTextColor(ColorManager.systemColor());
      this.drawText("Empty Slot", 0, lh * 2, this.innerWidth, "center");
      this.resetTextColor();
      this.drawText("Use 'Buy' to place an animal here.", 0, lh * 3, this.innerWidth, "center");
    }

    _drawInfo(rec) {
      const def = ANIMAL_DB[rec.animalId];
      if (!def) return;
      const lh = this.lineHeight();
      const pad = this.itemPadding();
      const iw = this.innerWidth;
      const lx = pad;
      const vx = Math.floor(iw * 0.36);
      const vw = iw - vx - pad;
      let y = 2;

      // Header
      this.changeTextColor(ColorManager.systemColor());
      this.drawText(rec.animalId, lx, y, iw - lx * 2, "center");
      this.resetTextColor();
      y += lh;
      this.contents.fillRect(lx, y, iw - lx * 2, 1, ColorManager.systemColor());
      y += 6;

      // Sprite area
      const SPRITE_AREA = 92;
      y += SPRITE_AREA;

      // Stage
      const stageColor = rec.stage === "adult" ? "#77ee77" : "#ffaa44";
      this._labelRow(lx, vx, vw, y, "Stage:", STAGE_NAMES[rec.stage] || rec.stage, stageColor);
      y += lh;

      // Growth progress (only for baby)
      if (def.hasBaby && rec.stage === "baby") {
        const progress = calcGrowthProgress(rec, def);
        this.changeTextColor(ColorManager.systemColor());
        this.drawText("Growth:", lx, y, vx - lx - 4);
        this.resetTextColor();
        const barW = Math.floor(vw * 0.68);
        this._drawBar(vx, y + 3, barW, progress);
        this.drawText(`${Math.floor(progress * 100)}%`, vx + barW + 6, y, 52);
        y += lh;

        const rem = Math.max(0, def.growthDays * MINUTES_PER_DAY - (rec.effectiveGrowthMinutes || 0));
        const days = Math.ceil(rem / MINUTES_PER_DAY);
        this._labelRow(lx, vx, vw, y, "Adult in:", `~${days} day${days !== 1 ? "s" : ""}`, "#ffffff");
        y += lh;
      }

      // Sell value
      const sellVal = rec.stage === "baby" ? (def.sellValueBaby || 0) : (def.sellValueAdult || 0);
      this._labelRow(lx, vx, vw, y, "Sell Value:", `${sellVal}G`, "#ffdd66");
      y += lh;

      // Production info
      if (def.produces && def.produces.length > 0) {
        this.changeTextColor(ColorManager.systemColor());
        this.drawText("── Production ──", lx, y, iw - lx * 2, "center");
        this.resetTextColor();
        y += lh;

        const now = gameMinutes();
        for (let i = 0; i < def.produces.length; i++) {
          const prod = def.produces[i];
          const item = $dataItems[prod.itemId];
          const itemName = item ? `\\I[${item.iconIndex}]${item.name}` : `Item #${prod.itemId}`;

          this._labelRow(lx, vx, vw, y, "Item:", itemName, "#ffffff");
          y += lh;

          this._labelRow(lx, vx, vw, y, "Yield:", `×${prod.yieldMin} – ${prod.yieldMax}`, "#bb88cc");
          y += lh;

          this._labelRow(lx, vx, vw, y, "Every:", `${prod.interval} day${prod.interval !== 1 ? "s" : ""}`, "#9999cc");
          y += lh;

          if (rec.stage === "adult" && rec.produceTimers) {
            const timer = rec.produceTimers[`p${i}`] || now;
            const elapsed = now - timer;
            const needed = prod.interval * MINUTES_PER_DAY;
            if (elapsed >= needed) {
              this.changeTextColor("#77ee77");
              this.drawText("✓  Ready to Collect!", lx, y, iw - lx * 2, "center");
              this.resetTextColor();
            } else {
              const remMin = needed - elapsed;
              const remD = Math.ceil(remMin / MINUTES_PER_DAY);
              this._labelRow(lx, vx, vw, y, "Next in:", `~${remD} day${remD !== 1 ? "s" : ""}`, "#ffaa44");
            }
            y += lh;
          }

          if (i < def.produces.length - 1) {
            this.contents.fillRect(lx, y, iw - lx * 2, 1, "#333344");
            y += 6;
          }
        }
      } else {
        this._labelRow(lx, vx, vw, y, "Production:", "None", "#888899");
        y += lh;
      }
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

    _loadSprite() {
      if (!this._rec || !this._rec.animalId) { this._sprite.bitmap = null; return; }
      const def = ANIMAL_DB[this._rec.animalId];
      if (!def) return;
      const spriteName = getCurrentSprite(this._rec, def);
      this._sprite.bitmap = ImageManager.loadCharacter(spriteName);
      this._sprite.bitmap.addLoadListener(this._updateSpriteFrame.bind(this));
    }

    _updateSpriteFrame() {
      if (!this._sprite || !this._sprite.bitmap || !this._sprite.bitmap.isReady()) return;
      const rec = this._rec;
      const def = ANIMAL_DB[rec.animalId];
      const spriteName = getCurrentSprite(rec, def);
      const isBig = ImageManager.isBigCharacter(spriteName);
      const pw = this._sprite.bitmap.width / (isBig ? 3 : 12);
      const ph = this._sprite.bitmap.height / (isBig ? 4 : 8);
      const dir = STAGE_DIRS[rec.stage] || 2;
      const row = dir === 2 ? 0 : dir === 4 ? 1 : dir === 6 ? 2 : 3;
      this._sprite.setFrame(0, row * ph, pw, ph);

      const SPRITE_AREA = 92;
      const lh = this.lineHeight();
      const TOP = lh + 6;
      const scale = Math.min((SPRITE_AREA - 22) / ph, 3.0);
      this._sprite.scale.set(scale, scale);
      this._sprite.anchor.set(0.5, 1.0);
      this._sprite.x = Math.floor(this.innerWidth / 2);
      this._sprite.y = TOP + SPRITE_AREA - 4;
    }
  }

  // ============================================================
  //  SCENE: Animal Buy
  // ============================================================

  class Scene_AnimalBuy extends Scene_MenuBase {
    initialize() {
      super.initialize();
      const a = Scene_AnimalBuy._openArgs || {};
      this._mapId = a.mapId || 0;
      this._eventId = a.eventId || 0;
    }

    create() {
      super.create();
      const ww = Math.floor(Graphics.boxWidth * 0.86);
      const wh = Math.floor(Graphics.boxHeight * 0.88);
      const wx = Math.floor((Graphics.boxWidth - ww) / 2);
      const wy = Math.floor((Graphics.boxHeight - wh) / 2);

      const previewW = 300;
      const selectW = ww - previewW;

      this._buyWindow = new Window_AnimalBuySelect(new Rectangle(wx, wy, selectW, wh));
      this._buyWindow.setHandler("ok", this._onBuyOk.bind(this));
      this._buyWindow.setHandler("cancel", this.popScene.bind(this));
      this.addWindow(this._buyWindow);

      this._previewWindow = new Window_AnimalPreview(new Rectangle(wx + selectW, wy, previewW, wh));
      this.addWindow(this._previewWindow);
      this._buyWindow.setPreviewWindow(this._previewWindow);
    }

    _onBuyOk() {
      const sym = this._buyWindow.currentSymbol();
      const parts = sym.split("_stage_");
      const animalId = parts[0];
      const buyStage = parts[1];
      const def = ANIMAL_DB[animalId];
      if (!def) { SoundManager.playBuzzer(); this._buyWindow.activate(); return; }

      const cost = buyStage === "baby" ? def.buyCostBaby : def.buyCostAdult;
      if ($gameParty.gold() < cost) { SoundManager.playBuzzer(); this._buyWindow.activate(); return; }

      $gameParty.loseGold(cost);
      const now = gameMinutes();
      const adultSkin = randomPick(def.adultSkins);
      const babySkin = def.hasBaby ? randomPick(def.babySkins) : null;
      const isBaby = buyStage === "baby" && def.hasBaby;
      const stage = isBaby ? "baby" : "adult";

      const produceTimers = {};
      if (stage === "adult") {
        for (let i = 0; i < (def.produces || []).length; i++) {
          produceTimers[`p${i}`] = now;
        }
      }

      const newRec = {
        animalId,
        boughtAt: now,
        lastUpdateMinutes: now,
        effectiveGrowthMinutes: isBaby ? 0 : def.growthDays * MINUTES_PER_DAY,
        stage,
        adultSkin,
        babySkin,
        produceTimers
      };
      saveRecord(this._mapId, this._eventId, newRec);
      const ev = $gameMap.event(this._eventId);
      if (ev) applySprite(ev, newRec);
      SoundManager.playShop();
      $gameMessage.add(`Bought \\c[14]${animalId}\\c[0] (${STAGE_NAMES[stage]})!`);
      this.popScene();
    }
  }

  // ============================================================
  //  WINDOW: Animal Buy Select
  // ============================================================

  class Window_AnimalBuySelect extends Window_Command {
    initialize(rect) {
      super.initialize(rect);
    }

    setPreviewWindow(previewWindow) {
      this._previewWindow = previewWindow;
      this.callUpdateHelp();
    }

    callUpdateHelp() {
      super.callUpdateHelp();
      if (this._previewWindow && this.currentSymbol()) {
        const sym = this.currentSymbol();
        const parts = sym.split("_stage_");
        this._previewWindow.setAnimal(parts[0], parts[1]);
      }
    }

    makeCommandList() {
      const free = hasFreeSlot();
      for (const [id, def] of Object.entries(ANIMAL_DB)) {
        // Baby option
        if (def.hasBaby) {
          const cost = def.buyCostBaby || 0;
          const canAfford = $gameParty ? $gameParty.gold() >= cost : false;
          const enabled = canAfford && free;
          this.addCommand(`${id} (Baby)`, `${id}_stage_baby`, enabled);
          const item = this._list[this._list.length - 1];
          item._def = def;
          item._animalId = id;
          item._buyStage = "baby";
          item._cost = cost;
        }
        // Adult option
        {
          const cost = def.buyCostAdult || 0;
          const canAfford = $gameParty ? $gameParty.gold() >= cost : false;
          const enabled = canAfford && free;
          this.addCommand(`${id} (Adult)`, `${id}_stage_adult`, enabled);
          const item = this._list[this._list.length - 1];
          item._def = def;
          item._animalId = id;
          item._buyStage = "adult";
          item._cost = cost;
        }
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

      const rect = this.itemLineRect(index);
      const lh = this.lineHeight();
      const hasGold = $gameParty && $gameParty.gold() >= entry._cost;
      const free = hasFreeSlot();

      this.changePaintOpacity(entry.enabled);

      // Stage indicator dot
      const DOT = 10;
      const isBaby = entry._buyStage === "baby";
      this.contents.fillRect(rect.x, rect.y + Math.floor((lh - DOT) / 2), DOT, DOT,
        isBaby ? "#ffaa44" : "#44dd44");

      // Name
      this.changeTextColor(entry.enabled ? "#ffffff" : "#888899");
      this.drawText(entry.name, rect.x + DOT + 6, rect.y, rect.width - DOT - 6 - 76);

      // Cost
      const euros = (entry._cost / 100).toFixed(2) + "€";
      this.changeTextColor(hasGold && free ? "#ffdd66" : "#cc4444");
      this.drawText(euros, rect.x + rect.width - 76, rect.y, 76, "right");

      this.resetTextColor();
      this.changePaintOpacity(true);
    }

    maxCols() { return 1; }
    numVisibleRows() { return Math.floor(this.innerHeight / this.itemHeight()); }
  }

  // ============================================================
  //  WINDOW: Animal Preview (Animated)
  // ============================================================

  class Window_AnimalPreview extends Window_Base {
    initialize(rect) {
      super.initialize(rect);
      this._animalId = null;
      this._previewStage = "adult";
      this._animTimer = 0;
      this._animStage = 0; // toggles between baby/adult for preview

      this._sprite = new Sprite();
      this.addInnerChild(this._sprite);

      this._stageLabel = new Sprite(new Bitmap(this.innerWidth, 28));
      this.addInnerChild(this._stageLabel);

      this.hide();
    }

    setAnimal(animalId, buyStage) {
      if (this._animalId !== animalId || this._previewStage !== buyStage) {
        this._animalId = animalId;
        this._previewStage = buyStage || "adult";
        this._animTimer = 0;
        this._animStage = 0;
        this.refresh();
        this._loadSprite();
      }
    }

    update() {
      super.update();
      if (this._animalId && this.visible) {
        this._animTimer++;
        if (this._animTimer >= 60) {
          this._animTimer = 0;
          const def = ANIMAL_DB[this._animalId];
          if (def && def.hasBaby && this._previewStage === "baby") {
            this._animStage = (this._animStage + 1) % 2; // toggle baby/adult preview
            this._loadSprite();
          }
        }
      }
    }

    refresh() {
      this.contents.clear();
      if (!this._animalId) return;
      const def = ANIMAL_DB[this._animalId];
      if (!def) return;

      const lh = this.lineHeight();
      const iw = this.innerWidth;
      const pad = this.itemPadding();
      const lx = pad;
      let y = 2;

      // Header
      this.changeTextColor(ColorManager.systemColor());
      this.drawText(this._animalId, 0, y, iw, "center");
      this.resetTextColor();
      y += lh;
      this.contents.fillRect(lx, y, iw - lx * 2, 1, ColorManager.systemColor());
      y += 4;

      // Sprite area
      const SPRITE_AREA = 92;
      y += SPRITE_AREA;

      // Divider
      this.contents.fillRect(lx, y, iw - lx * 2, 1, "#444455");
      y += 6;

      // Info table
      const half = Math.floor(iw / 2);
      const buyStage = this._previewStage;
      const isBaby = buyStage === "baby" && def.hasBaby;
      const cost = isBaby ? (def.buyCostBaby || 0) : (def.buyCostAdult || 0);
      const hasGold = $gameParty && $gameParty.gold() >= cost;
      const euros = (cost / 100).toFixed(2) + "€";

      this._row(lx, y, iw, lh, "Cost", euros, hasGold ? "#ffdd66" : "#cc4444");
      y += lh;

      this._row(lx, y, iw, lh, "Stage", isBaby ? "Baby" : "Adult", isBaby ? "#ffaa44" : "#44dd44");
      y += lh;

      if (isBaby && def.growthDays > 0) {
        this._row(lx, y, iw, lh, "Grows in", `${def.growthDays} days`, "#9999cc");
        y += lh;
      }

      const sellVal = isBaby ? (def.sellValueBaby || 0) : (def.sellValueAdult || 0);
      this._row(lx, y, iw, lh, "Sell Value", `${sellVal}G`, "#ffdd66");
      y += lh;

      // Production info
      if (def.produces && def.produces.length > 0) {
        this.contents.fillRect(lx, y, iw - lx * 2, 1, "#444455");
        y += 6;
        this.changeTextColor(ColorManager.systemColor());
        this.drawText("Production", 0, y, iw, "center");
        this.resetTextColor();
        y += lh;

        for (let i = 0; i < def.produces.length; i++) {
          const prod = def.produces[i];
          const item = $dataItems[prod.itemId];
          const itemName = item ? item.name : `Item #${prod.itemId}`;

          this._row(lx, y, iw, lh, "Item", itemName, "#ffffff");
          y += lh;
          this._row(lx, y, iw, lh, "Yield", `×${prod.yieldMin} – ${prod.yieldMax}`, "#bb88cc");
          y += lh;
          this._row(lx, y, iw, lh, "Every", `${prod.interval}d`, "#9999cc");
          y += lh;
        }
      } else {
        this._row(lx, y, iw, lh, "Produces", "Nothing", "#888899");
        y += lh;
      }

      // Skins count
      this._row(lx, y, iw, lh, "Skins", `${def.adultSkins.length} variant${def.adultSkins.length !== 1 ? "s" : ""}`, "#aaaacc");
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
      if (!this._animalId) { this._sprite.bitmap = null; return; }
      const def = ANIMAL_DB[this._animalId];
      if (!def) return;

      let spriteName;
      if (this._previewStage === "baby" && def.hasBaby) {
        spriteName = this._animStage === 0
          ? (def.babySkins[0] || def.adultSkins[0])
          : def.adultSkins[0];
      } else {
        spriteName = def.adultSkins[0];
      }

      this._currentPreviewSprite = spriteName;
      this._sprite.bitmap = ImageManager.loadCharacter(spriteName);
      this._sprite.bitmap.addLoadListener(this._updateSpriteFrame.bind(this));
    }

    _updateSpriteFrame() {
      if (!this._sprite || !this._sprite.bitmap || !this._sprite.bitmap.isReady()) return;
      const spriteName = this._currentPreviewSprite;
      const isBig = ImageManager.isBigCharacter(spriteName);
      const pw = this._sprite.bitmap.width / (isBig ? 3 : 12);
      const ph = this._sprite.bitmap.height / (isBig ? 4 : 8);

      // Show down-facing (row 0) for the preview
      this._sprite.setFrame(0, 0, pw, ph);

      const SPRITE_AREA = 92;
      const lh = this.lineHeight();
      const TOP = lh + 6;
      const scale = Math.min((SPRITE_AREA - 22) / ph, 3.0);
      this._sprite.scale.set(scale, scale);
      this._sprite.anchor.set(0.5, 1.0);
      this._sprite.x = Math.floor(this.innerWidth / 2);
      this._sprite.y = TOP + SPRITE_AREA - 4;

      if (this._stageLabel) {
        this._stageLabel.x = 0;
        this._stageLabel.y = TOP + SPRITE_AREA - 22;
      }
    }
  }

})();
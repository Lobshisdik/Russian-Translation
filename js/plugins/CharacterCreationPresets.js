/*:
 * @target MZ
 * @plugindesc Character preset management system with save/load functionality and UI windows
 * @author Omni-Lex
 * @orderAfter CharacterCreationShared
 * @orderAfter StartingEquipment
 * @orderBefore ClassSelection
 * @orderBefore CharacterCreation
 *
 * @command saveCharacterPreset
 * @text Save Character Preset
 * @desc Saves the current character as a preset for future use
 *
 * @command savePartyMember
 * @text Save Party Member
 * @desc Saves and removes a party member as a preset
 *
 * @arg memberIndex
 * @text Party Member Index
 * @desc Which party member to save and remove (1 = 3rd member, 2 = 4th member)
 * @type select
 * @option 3rd Party Member (Index 1)
 * @value 1
 * @option 4th Party Member (Index 2)
 * @value 2
 * @default 1
 *
 * @help
 * This plugin manages character presets:
 * - Default preset data (Bubba, Em, Selene)
 * - Preset CRUD operations (create, read, update, delete)
 * - Character creation completion tracking
 * - Preset selection UI (Window_CharacterPresets)
 * - Stats explanation UI (Window_StatsExplanation)
 *
 * Dependencies:
 * - CharacterCreationShared.js (for trait application)
 * - StartingEquipment.js (for equipment management)
 *
 * Functions exported to global namespace:
 * - window.CharacterPresets.getCharacterPresets()
 * - window.CharacterPresets.removePresetById(presetId)
 * - window.CharacterPresets.getNextPresetId()
 * - window.CharacterPresets.markStepCompleted(stepIndex)
 * - window.CharacterPresets.isStepCompleted(stepIndex)
 * - window.CharacterPresets.Window_CharacterPresets
 * - window.CharacterPresets.Window_StatsExplanation
 */

(() => {
  const pluginName = "CharacterPresets";

  //=============================================================================
  // Default Character Presets Data
  //=============================================================================

  let CharacterPresets = [
    {
      id: 1,
      name: "Bubba",
      classId: 54,
      sprite: "Fantasy_Characters1",
      spriteIndex: 1,
      mapId: 722,
      x: 55,
      y: 48,
      switches: [49, 50],
      money: 90000,
      items: [{ id: 1, amount: 5 }], // Potion x5
      weapons: [{ id: 12, amount: 1 }], // Axe x1
      armors: [{ id: 4, amount: 1 }], // Ring x1
      equips: [null, null, null, null, null],
      skills: [10],
      traits: [],
      busts: "Bubba",
    },
    {
      id: 2,
      name: "Em",
      classId: 2,
      sprite: "Other/!$Em",
      spriteIndex: 1,
      mapId: 722,
      x: 48,
      y: 48,
      switches: [48, 50],
      money: 20000,
      items: [],
      weapons: [{ id: 6, amount: 1 }],
      armors: [
        { id: 434, amount: 1 },
        { id: 435, amount: 1 },
      ],
      equips: [null, null, null, null, null],
      skills: [],
      traits: [],
      busts: "Em",
    },
    {
      id: 3,
      name: "Selene",
      classId: 6,
      sprite: "School01RM",
      spriteIndex: 2,
      mapId: 561,
      x: 15,
      y: 11,
      switches: [58],
      money: 5000000,
      items: [],
      weapons: [],
      armors: [],
      equips: [],
      skills: [],
      traits: [],
      busts: "Selene",
    }
  ];

  //=============================================================================
  // Preset Management Functions
  //=============================================================================

  /**
   * Get current character presets (from save data or default)
   * @returns {array} Array of preset objects
   */
  function getCharacterPresets() {
    if ($dataSystem.characterPresets) {
      return $dataSystem.characterPresets;
    }
    return CharacterPresets;
  }

  /**
   * Save character presets to game data
   * @param {array} presets - Array of preset objects
   */
  function saveCharacterPresets(presets) {
    $dataSystem.characterPresets = presets;
    // The presets will be saved when the player saves the game
  }

  /**
   * Get the next available preset ID
   * @returns {number} Next preset ID
   */
  function getNextPresetId() {
    const currentPresets = getCharacterPresets();
    if (currentPresets.length === 0) {
      return 1;
    }
    const maxId = Math.max(...currentPresets.map((preset) => preset.id || 0));
    return maxId + 1;
  }

  /**
   * Remove a preset by ID (called when pregenerated character dies)
   * @param {number} presetId - Preset ID to remove
   * @returns {boolean} Success status
   */
  function removePresetById(presetId) {
    const currentPresets = getCharacterPresets();
    const index = currentPresets.findIndex((preset) => preset.id === presetId);

    if (index >= 0) {
      const removedPreset = currentPresets[index];
      currentPresets.splice(index, 1);
      saveCharacterPresets(currentPresets);
      CharacterPresets = currentPresets;
      console.log(`Removed preset from pool: "${removedPreset.name}" (ID: ${presetId})`);
      return true;
    } else {
      console.warn(`Preset with ID ${presetId} not found in pool`);
      return false;
    }
  }

  /**
   * Save current character as preset
   */
  function saveCurrentCharacterAsPreset() {
    const actor = $gameParty.leader();
    if (!actor) {
      $gameMessage.add("No character to save!");
      return;
    }

    const currentMapId = $gameMap.mapId();
    const playerX = $gamePlayer.x;
    const playerY = $gamePlayer.y;

    // Get current active switches
    const activeSwitches = [];
    for (let i = 1; i <= $gameSystem.switchesCount; i++) {
      if ($gameSwitches.value(i)) {
        activeSwitches.push(i);
      }
    }

    // Save inventory, money, equips, and skills
    const money = $gameParty.gold();
    const items = $gameParty
      .items()
      .map((item) => ({ id: item.id, amount: $gameParty.numItems(item) }));
    const weapons = $gameParty
      .weapons()
      .map((item) => ({ id: item.id, amount: $gameParty.numItems(item) }));
    const armors = $gameParty
      .armors()
      .map((item) => ({ id: item.id, amount: $gameParty.numItems(item) }));
    const equips = actor.equips().map((item) => (item ? item.id : null));
    const skills = actor.skills().map((skill) => skill.id);

    // Get traits from actor if available
    const traits = (actor._selectedTraits || []).map((trait) => trait.id || 0).filter((id) => id > 0);

    // Get current presets
    const currentPresets = getCharacterPresets();

    // Check if a preset with this name already exists
    const existingIndex = currentPresets.findIndex(
      (preset) => preset.name === actor.name()
    );

    // Generate or reuse preset ID
    let presetId;
    if (existingIndex >= 0) {
      presetId = currentPresets[existingIndex].id;
    } else {
      presetId = getNextPresetId();
    }

    const newPreset = {
      id: presetId,
      name: actor.name(),
      classId: actor._classId,
      sprite: actor._characterName,
      spriteIndex: actor._characterIndex,
      mapId: currentMapId,
      x: playerX,
      y: playerY,
      switches: activeSwitches.slice(0, 10),
      money: money,
      items: items,
      weapons: weapons,
      armors: armors,
      equips: equips,
      skills: skills,
      traits: traits,
      isCreature: $gameSwitches.value(77),
    };

    if (existingIndex >= 0) {
      currentPresets[existingIndex] = newPreset;
      $gameMessage.add(`Updated character preset: ${newPreset.name}`);
    } else {
      currentPresets.push(newPreset);
      $gameMessage.add(`Saved new character preset: ${newPreset.name} (ID: ${presetId})`);
    }

    saveCharacterPresets(currentPresets);
    CharacterPresets = currentPresets;
  }

  /**
   * Save party member (index 2 or 3) as preset and remove from party
   * @param {number} memberIndex - Party member index (1 or 2 for 3rd/4th member)
   */
  function savePartyMemberAsPreset(memberIndex = 2) {
    const partyMembers = $gameParty.members();
    const targetIndex = parseInt(memberIndex) || 2;

    if (!partyMembers[targetIndex]) {
      const memberPosition = targetIndex + 1;
      $gameMessage.add(`No party member to save at position ${memberPosition}!`);
      return;
    }

    const targetActor = partyMembers[targetIndex];
    const currentMapId = $gameMap.mapId();
    const playerX = $gamePlayer.x;
    const playerY = $gamePlayer.y;

    // Get current active switches
    const activeSwitches = [];
    for (let i = 1; i <= $gameSystem.switchesCount; i++) {
      if ($gameSwitches.value(i)) {
        activeSwitches.push(i);
      }
    }

    // Save actor's equipment and skills
    const equips = targetActor.equips().map((item) => (item ? item.id : null));
    const skills = targetActor.skills().map((skill) => skill.id);
    const traits = (targetActor._selectedTraits || []).map((trait) => trait.id || 0).filter((id) => id > 0);

    // Get current presets
    const currentPresets = getCharacterPresets();
    const existingIndex = currentPresets.findIndex(
      (preset) => preset.name === targetActor.name()
    );

    let presetId;
    if (existingIndex >= 0) {
      presetId = currentPresets[existingIndex].id;
    } else {
      presetId = getNextPresetId();
    }

    const newPreset = {
      id: presetId,
      name: targetActor.name(),
      classId: targetActor._classId,
      sprite: targetActor._characterName,
      spriteIndex: targetActor._characterIndex,
      mapId: currentMapId,
      x: playerX,
      y: playerY,
      switches: activeSwitches.slice(0, 10),
      money: 0,
      items: [],
      weapons: [],
      armors: [],
      equips: equips,
      skills: skills,
      traits: traits,
      isCreature: $gameSwitches.value(77),
    };

    if (existingIndex >= 0) {
      currentPresets[existingIndex] = newPreset;
      $gameMessage.add(`Updated character preset: ${newPreset.name}`);
    } else {
      currentPresets.push(newPreset);
      $gameMessage.add(`Saved new character preset: ${newPreset.name} (ID: ${presetId})`);
    }

    saveCharacterPresets(currentPresets);
    CharacterPresets = currentPresets;

    // Remove the actor from the party
    $gameParty.removeActor(targetActor.actorId());

    const memberPosition = targetIndex + 1;
    $gameMessage.add(
      `${targetActor.name()} has been saved to character presets and removed from party position ${memberPosition}.`
    );
  }

  //=============================================================================
  // Character Creation Tracking Functions
  //=============================================================================

  /**
   * Mark a character creation step as completed
   * @param {number} stepIndex - Step index
   */
  function markStepCompleted(stepIndex) {
    if (!$dataSystem.characterCreationCompleted) {
      $dataSystem.characterCreationCompleted = {};
    }
    $dataSystem.characterCreationCompleted[stepIndex] = true;
  }

  /**
   * Check if a character creation step is completed
   * @param {number} stepIndex - Step index
   * @returns {boolean} Completion status
   */
  function isStepCompleted(stepIndex) {
    if (!$dataSystem.characterCreationCompleted) {
      return false;
    }
    return $dataSystem.characterCreationCompleted[stepIndex] || false;
  }

  /**
   * Check if first character creation is completed
   * @returns {boolean} Completion status
   */
  function hasCompletedFirstCreation() {
    return $dataSystem.hasCompletedFirstCreation || false;
  }

  /**
   * Mark first character creation as complete
   */
  function markFirstCreationComplete() {
    if (!$dataSystem.hasCompletedFirstCreation) {
      $dataSystem.hasCompletedFirstCreation = true;
    }
  }

  //=============================================================================
  // DataManager Hooks
  //=============================================================================

  const _DataManager_onLoad = DataManager.onLoad;
  DataManager.onLoad = function (object) {
    _DataManager_onLoad.call(this, object);
    if (object === $dataSystem) {
      if (!$dataSystem.classLevels) {
        $dataSystem.classLevels = {};
      }
      if (!$dataSystem.characterPresets) {
        $dataSystem.characterPresets = [...CharacterPresets];
      } else {
        CharacterPresets = $dataSystem.characterPresets;
      }
      if (!$dataSystem.characterCreationCompleted) {
        $dataSystem.characterCreationCompleted = {};
      }
      if ($dataSystem.hasCompletedFirstCreation === undefined) {
        $dataSystem.hasCompletedFirstCreation = false;
      }
    }
  };

  const _DataManager_setupNewGame = DataManager.setupNewGame;
  DataManager.setupNewGame = function () {
    _DataManager_setupNewGame.call(this);
    // Reset character creation completion flags for new game
    $dataSystem.characterCreationCompleted = {};
    $dataSystem.hasCompletedFirstCreation = false;
  };

  //=============================================================================
  // Window_CharacterPresets - Preset Selection UI
  //=============================================================================

  class Window_CharacterPresets extends Window_Selectable {
    initialize(rect) {
      this._data = getCharacterPresets();
      super.initialize(rect);

      // Preload all character sprites
      this._loadedBitmaps = [];
      this._data.forEach((preset, index) => {
        const bitmap = ImageManager.loadCharacter(preset.sprite);
        this._loadedBitmaps[index] = bitmap;
        bitmap.addLoadListener(() => {
          this.refresh();
        });
      });

      this.refresh();
      this.select(0);
      this.activate();
    }

    maxItems() {
      return this._data ? this._data.length : 0;
    }

    maxCols() {
      if (!this._data || this._data.length === 0) return 1;
      return Math.min(this._data.length, 3); // Max 3 columns
    }

    itemHeight() {
      return 120; // Fixed height for character display
    }

    itemAt(index) {
      return this._data && this._data[index] ? this._data[index] : null;
    }

    drawItem(index) {
      const preset = this.itemAt(index);
      if (!preset) return;

      const rect = this.itemRect(index);
      const padding = 8;

      // Draw background
      this.contents.fillRect(
        rect.x + 2,
        rect.y + 2,
        rect.width - 4,
        rect.height - 4,
        "rgba(0, 0, 0, 0.3)"
      );

      // Draw character sprite
      const spriteY = rect.y + padding;
      const spriteHeight = 48;
      this.drawCharacterSprite(
        preset.sprite,
        preset.spriteIndex,
        rect.x + rect.width / 2 - 24,
        spriteY
      );

      // Draw character name
      this.changeTextColor(ColorManager.systemColor());
      this.drawText(
        preset.name,
        rect.x,
        spriteY + spriteHeight + 4,
        rect.width,
        "center"
      );

      // Draw class name
      this.resetTextColor();
      const className = $dataClasses[preset.classId]
        ? $dataClasses[preset.classId].name
        : "Unknown";
      this.drawText(
        className,
        rect.x,
        spriteY + spriteHeight + this.lineHeight() + 4,
        rect.width,
        "center"
      );
    }

    drawCharacterSprite(spriteName, spriteIndex, x, y) {
      const bitmap = ImageManager.loadCharacter(spriteName);
      if (bitmap.isReady()) {
        const characterWidth = bitmap.width / 12; // 12 characters per sheet
        const characterHeight = bitmap.height / 8; // 8 directions

        const col = spriteIndex % 4;
        const row = Math.floor(spriteIndex / 4);

        const sx = col * characterWidth * 3; // Each character has 3 frames
        const sy = row * characterHeight * 4; // Each character has 4 directions

        // Draw the down-facing sprite (direction 0, frame 1 - middle frame)
        const frameWidth = characterWidth;
        const frameHeight = characterHeight;
        const frameX = sx + frameWidth; // Middle frame
        const frameY = sy; // Down direction

        this.contents.blt(
          bitmap,
          frameX,
          frameY,
          frameWidth,
          frameHeight,
          x,
          y,
          48,
          48
        );
      }
    }

    processOk() {
      const preset = this.itemAt(this.index());
      if (preset) {
        this.playOkSound();
        this.callOkHandler();
      }
    }

    currentPreset() {
      return this.itemAt(this.index());
    }
  }

  //=============================================================================
  // Window_StatsExplanation - Stats Help Window
  //=============================================================================

  class Window_StatsExplanation extends Window_Base {
    initialize(rect) {
      super.initialize(rect);
      this._handlers = {};
      this.refresh();
      this.activate();
    }

    setHandler(symbol, method) {
      this._handlers[symbol] = method;
    }

    isHandled(symbol) {
      return !!this._handlers[symbol];
    }

    callHandler(symbol) {
      if (this.isHandled(symbol)) {
        this._handlers[symbol]();
      }
    }

    close() {
      this.openness = 0;
    }

    refresh() {
      this.contents.clear();
      let y = 0;
      const lineHeight = this.lineHeight();

      // Title
      this.changeTextColor(ColorManager.systemColor());
      const title = ConfigManager.language === "it"
        ? "Spiegazione Statistiche"
        : "Stats Explanation";
      this.drawText(title, 0, y, this.contentsWidth(), "center");
      y += lineHeight * 1.5;
      this.resetTextColor();

      // STR
      this.changeTextColor(ColorManager.systemColor());
      const strLabel = ConfigManager.language === "it" ? "FRZ (Forza):" : "STR (Strength):";
      this.drawText(strLabel, 0, y, this.contentsWidth());
      y += lineHeight;
      this.resetTextColor();
      const strDesc = ConfigManager.language === "it"
        ? "Influenza il danno degli attacchi\nbasati sulla forza"
        : "Influences damage from\nstrength-based attacks";
      this.drawTextEx(strDesc, this.itemPadding(), y);
      y += lineHeight * 1.5;

      // CON
      this.changeTextColor(ColorManager.systemColor());
      const cosLabel = ConfigManager.language === "it"
        ? "COS (Costituzione):"
        : "CON (Constitution):";
      this.drawText(cosLabel, 0, y, this.contentsWidth());
      y += lineHeight;
      this.resetTextColor();
      const cosDesc = ConfigManager.language === "it"
        ? "Riduce il danno fisico e aumenta la\ncapacità di carico"
        : "Reduces physical damage and\nincreases carry capacity";
      this.drawTextEx(cosDesc, this.itemPadding(), y);
      y += lineHeight * 1.5;

      // DEX
      this.changeTextColor(ColorManager.systemColor());
      const dexLabel = ConfigManager.language === "it"
        ? "DES (Destrezza):"
        : "DEX (Dexterity):";
      this.drawText(dexLabel, 0, y, this.contentsWidth());
      y += lineHeight;
      this.resetTextColor();
      const dexDesc = ConfigManager.language === "it"
        ? "Aumenta la probabilità di schivata\ne il danno degli attacchi basati sulla destrezza"
        : "Increases evasion chance\nand dexterity-based attack damage";
      this.drawTextEx(dexDesc, this.itemPadding(), y);
      y += lineHeight * 1.5;

      // INT
      this.changeTextColor(ColorManager.systemColor());
      const intLabel = ConfigManager.language === "it"
        ? "INT (Intelligenza):"
        : "INT (Intelligence):";
      this.drawText(intLabel, 0, y, this.contentsWidth());
      y += lineHeight;
      this.resetTextColor();
      const intDesc = ConfigManager.language === "it"
        ? "Danno degli incantesimi"
        : "Spell damage";
      this.drawTextEx(intDesc, this.itemPadding(), y);
      y += lineHeight * 1.5;

      // WIS
      this.changeTextColor(ColorManager.systemColor());
      const sagLabel = ConfigManager.language === "it" ? "SAG (Saggezza):" : "WIS (Wisdom):";
      this.drawText(sagLabel, 0, y, this.contentsWidth());
      y += lineHeight;
      this.resetTextColor();
      const sagDesc = ConfigManager.language === "it"
        ? "Aumenta le difese magiche e\nil danno sacro"
        : "Increases magic defense\nand holy damage";
      this.drawTextEx(sagDesc, this.itemPadding(), y);
      y += lineHeight * 1.5;

      // PSI
      this.changeTextColor(ColorManager.systemColor());
      const psiLabel = ConfigManager.language === "it" ? "PSI (Psionici):" : "PSI (Psionics):";
      this.drawText(psiLabel, 0, y, this.contentsWidth());
      y += lineHeight;
      this.resetTextColor();
      const psiDesc = ConfigManager.language === "it"
        ? "Attacco e difese psioniche"
        : "Psionic attack and defense";
      this.drawTextEx(psiDesc, this.itemPadding(), y);
    }

    update() {
      super.update();
      if (
        this.active &&
        (Input.isTriggered("cancel") || TouchInput.isCancelled())
      ) {
        if (this.isHandled("cancel")) {
          this.callHandler("cancel");
        }
      }
    }
  }

  //=============================================================================
  // Plugin Commands
  //=============================================================================

  PluginManager.registerCommand(pluginName, "saveCharacterPreset", () => {
    saveCurrentCharacterAsPreset();
  });

  PluginManager.registerCommand(pluginName, "savePartyMember", (args) => {
    const memberIndex = args.memberIndex ? parseInt(args.memberIndex) : 1;
    savePartyMemberAsPreset(memberIndex);
  });

  //=============================================================================
  // Exports to Global Namespace
  //=============================================================================

  window.CharacterPresets = {
    // Functions
    getCharacterPresets,
    saveCharacterPresets,
    getNextPresetId,
    removePresetById,
    saveCurrentCharacterAsPreset,
    savePartyMemberAsPreset,
    markStepCompleted,
    isStepCompleted,
    hasCompletedFirstCreation,
    markFirstCreationComplete,

    // Windows
    Window_CharacterPresets,
    Window_StatsExplanation
  };

  // Backward compatibility
  window.removePresetById = removePresetById;
  window.getNextPresetId = getNextPresetId;

  console.log(`${pluginName} loaded successfully.`);
})();

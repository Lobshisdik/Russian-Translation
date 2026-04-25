(() => {
  "use strict";
  const pluginName = "BattleSystemEnhancedHUD";
  const parameters = PluginManager.parameters(pluginName);
  const barWidth = 330;
  const enemyLargeBarWidth = 500;
  const barHeight = Number(parameters["BarHeight"] || 25);
  const barSpacing = 70;
  const playerBarX = Number(parameters["PlayerBarX"] || 60);
  const enemyBarX = Number(470);
  const barsY = Number(parameters["BarsY"] || 20);
  const playerHPColor1 = String(parameters["PlayerHPColor1"] || "#ff4444");
  const playerHPColor2 = String(parameters["PlayerHPColor2"] || "#ff0000");
  const enemyHPColor1 = String(parameters["EnemyHPColor1"] || "#ff4444");
  const enemyHPColor2 = String(parameters["EnemyHPColor2"] || "#ff0000");
  const mpBarColor1 = String(parameters["MPBarColor1"] || "#44aaff");
  const mpBarColor2 = String(parameters["MPBarColor2"] || "#0066cc");
  const tpColor1 = String(parameters["TPColor1"] || "#ffcc00");
  const tpColor2 = String(parameters["TPColor2"] || "#ff9900");
  const damageColor = String(parameters["DamageColor"] || "#ffffff");
  const mpSkillColor = String(parameters["MPSkillColor"] || "#44aaff");
  const tpSkillColor = String(parameters["TPSkillColor"] || "#ff9900");
  const animationSpeed = Number(parameters["AnimationSpeed"] || 5);
  const gradientSpeed = Number(parameters["GradientSpeed"] || 1);
  const tpOrbSize = Number(parameters["TPOrbSize"] || 56);
  const tpOrbOffsetX = Number(-40);
  const enemyTpOrbOffsetX = Number(315);
  const angleSize = Number(parameters["AngleSize"] || 15);
  const borderThickness = Number(parameters["BorderThickness"] || 2);
  const borderColor = String(parameters["BorderColor"] || "#000000");
  // Stat change display parameters
  const statDisplayOffsetY = 100; // Offset below MP bar
  const statTextColor = "#FFCC00"; // Yellow text for stat changes
  const statDisplayHeight = 18; // Increased height for stat display
  const isMobileDevice = Utils.isMobileDevice(); // Detect if running on mobile
  const useMobileOptimization = false; // Set to true to force optimization even on desktop
  const { SPRITES_ASSOCIATION } = window.Sprites;

  // Battle UI fixes parameters
  const helpWindowHeightBonus = Number(
    parameters["HelpWindowHeightBonus"] || 20
  );

  const statDisplayPlayerX = Number(
    parameters["StatDisplayPlayerX"] || Graphics.width / 2 - 200
  );
  const statDisplayEnemyX = Number(
    parameters["StatDisplayEnemyX"] || Graphics.width / 2 + 100
  );
  const statDisplayY = Number(parameters["StatDisplayY"] || 50);

  function getEnemyLevel(battler) {
    if (!battler.isEnemy || !battler.isEnemy()) return "";

    const notes = battler.enemy().note || "";
    const levelMatch = notes.match(/<Level:\s*(\d+)>/i);

    if (levelMatch && levelMatch[1]) {
      return "L." + levelMatch[1];
    }
    return "";
  }
  function getResponsiveBarPositions() {
    const screenWidth = Graphics.width;
    const isWidescreen = screenWidth > 900;

    return {
      playerBarX: isWidescreen ? 60 : 60,
      enemyBarX: isWidescreen ? screenWidth - barWidth - 60 : screenWidth - barWidth - 60, // Changed from 470
      barsY: 20
    };
  }

  function getAspectRatio() {
    const width = Graphics.width;
    const height = Graphics.height;
    const ratio = width / height;
    // 16:9 = 1.777..., 4:3 = 1.333...
    return ratio > 1.5 ? '16:9' : '4:3';
  }

  function getStatusTag(state) {
    if (!state || !state.note) return null;

    const notes = state.note;
    const currentLanguage = ConfigManager.language || "en";

    // Look for language-specific tags like <En: DMK> or <It: MRT>
    const langPattern = new RegExp(
      `<${currentLanguage.toUpperCase()}:\\s*([^>]+)>`,
      "i"
    );
    const match = notes.match(langPattern);

    if (match && match[1]) {
      return match[1].trim();
    }

    // Fallback to English if current language not found
    if (currentLanguage !== "en") {
      const enPattern = /<En:\s*([^>]+)>/i;
      const enMatch = notes.match(enPattern);
      if (enMatch && enMatch[1]) {
        return enMatch[1].trim();
      }
    }

    // If no tags found, return null (don't display anything)
    return null;
  }

  // Helper function to collect status tags for display
  function getStatusTags(battler) {
    if (!battler || !battler.states) return [];

    const tags = [];
    const states = battler.states();

    for (const state of states) {
      const tag = getStatusTag(state);
      if (tag) {
        tags.push(tag);
      }
    }

    return tags;
  }

  // Helper function to get bust image path using SPRITES_ASSOCIATION
  function getBustImagePath(actor) {
    if (!actor) return null;

    const actorId = actor.actorId && actor.actorId();
    const characterName = actor.characterName();

    // Player 1 (Actor 1) special handling
    if (actorId === 1) {
      // Priority 1: Check Variable 109 (Player 1 bust name)
      const player1BustName = $gameVariables.value(109);
      if (player1BustName && player1BustName !== "") {
        return "img/faces/" + player1BustName;
      }

      // Priority 2: If Switch 77 is ON, use Variable 106 for monster form
      if ($gameSwitches.value(77)) {
        const player1MonsterName = $gameVariables.value(106);
        if (player1MonsterName && player1MonsterName !== "") {
          return "img/enemies/" + player1MonsterName;
        }
      }

      // Priority 3: Fall back to SPRITES_ASSOCIATION
      if (characterName && window.Sprites && SPRITES_ASSOCIATION) {
        const spritesheetName = characterName.split('.')[0];
        const characterIndex = actor.characterIndex();

        if (SPRITES_ASSOCIATION[spritesheetName] &&
            SPRITES_ASSOCIATION[spritesheetName][characterIndex]) {
          const bustName = SPRITES_ASSOCIATION[spritesheetName][characterIndex];
          return "img/faces/" + bustName;
        }
      }

      return "img/faces/7";
    }

    // Players 2 & 3: Use SPRITES_ASSOCIATION based on sprite
    if (characterName && window.Sprites && SPRITES_ASSOCIATION) {
      const spritesheetName = characterName.split('.')[0];
      const characterIndex = actor.characterIndex();

      if (SPRITES_ASSOCIATION[spritesheetName] &&
          SPRITES_ASSOCIATION[spritesheetName][characterIndex]) {
        const bustName = SPRITES_ASSOCIATION[spritesheetName][characterIndex];
        return "img/faces/" + bustName;
      }
    }

    // Fallback to default bust path structure
    return "img/faces/" + characterName + "/" + actor.characterIndex();
  }

  //=========================================================================
  // Battle UI Fixes - Window_Help modifications
  //=========================================================================

  const _Window_Help_initialize = Window_Help.prototype.initialize;
  Window_Help.prototype.initialize = function (rect) {
    // Check if we're in battle scene and adjust height
    if ($gameParty.inBattle()) {
      rect.height += helpWindowHeightBonus;
    }
    _Window_Help_initialize.call(this, rect);
  };

  const _Scene_Battle_helpWindowRect = Scene_Battle.prototype.helpWindowRect;
  Scene_Battle.prototype.helpWindowRect = function () {
    const rect = _Scene_Battle_helpWindowRect.call(this);
    rect.height += helpWindowHeightBonus;
    return rect;
  };

  // Adjust other windows to account for taller help window
  const _Scene_Battle_skillWindowRect = Scene_Battle.prototype.skillWindowRect;
  Scene_Battle.prototype.skillWindowRect = function () {
    const rect = _Scene_Battle_skillWindowRect.call(this);
    rect.y += helpWindowHeightBonus;
    rect.height -= helpWindowHeightBonus + 200;
    return rect;
  };

  const _Scene_Battle_itemWindowRect = Scene_Battle.prototype.itemWindowRect;
  Scene_Battle.prototype.itemWindowRect = function () {
    const rect = _Scene_Battle_itemWindowRect.call(this);
    rect.y += helpWindowHeightBonus;
    rect.height -= helpWindowHeightBonus + 200;
    return rect;
  };

  //=========================================================================
  // Battle UI Fixes - Window_BattleItem single column
  //=========================================================================

  const _Window_BattleItem_initialize = Window_BattleItem.prototype.initialize;
  Window_BattleItem.prototype.initialize = function (rect) {
    _Window_BattleItem_initialize.call(this, rect);
    // Force single column for battle item window
    this._singleColumn = true;
  };

  const _Window_BattleItem_maxCols = Window_BattleItem.prototype.maxCols;
  Window_BattleItem.prototype.maxCols = function () {
    // Always return 1 column for battle items to prevent name truncation
    return 1;
  };

  const _Window_BattleItem_colSpacing = Window_BattleItem.prototype.colSpacing;
  Window_BattleItem.prototype.colSpacing = function () {
    // No column spacing needed for single column
    return 0;
  };

  // Optional: Adjust item name display to use full width
  const _Window_BattleItem_drawItemName =
  Window_BattleItem.prototype.drawItemName;
Window_BattleItem.prototype.drawItemName = function (item, x, y, width) {
  if (item) {
    const iconY = y + (this.lineHeight() - ImageManager.iconHeight) / 2;
    const textMargin = ImageManager.iconWidth + 4;
    const itemWidth = width || this.innerWidth - textMargin;

    this.resetTextColor();
    this.drawIcon(item.iconIndex, x, iconY);
    
    // Draw item name
    this.drawText(item.name, x + textMargin, y, itemWidth - textMargin - 28);
    
    // Draw item quantity
    this.drawItemNumber(item, x, y, itemWidth);
  }
};

  // Make sure regular item windows (outside battle) keep their normal behavior
  const _Window_ItemList_maxCols = Window_ItemList.prototype.maxCols;
  Window_ItemList.prototype.maxCols = function () {
    // Only affect battle item window, not regular item lists
    if (this.constructor === Window_BattleItem) {
      return 1;
    }
    return _Window_ItemList_maxCols.call(this);
  };

  // Ensure help window text wrapping works properly with increased height
  const _Window_Help_refresh = Window_Help.prototype.refresh;
  Window_Help.prototype.refresh = function () {
    this.contents.clear();
    if (this._text) {
      const textState = this.createTextState(this._text, 0, -8, this.innerWidth);
      textState.height = this.innerHeight;
      this.processAllText(textState);
    }
  };

  //=========================================================================
  // Original Tekken Bar Code continues below
  //=========================================================================

  function Sprite_TekkenBar() {
    this.initialize(...arguments);
  }
  Sprite_TekkenBar.prototype = Object.create(Sprite.prototype);
  Sprite_TekkenBar.prototype.constructor = Sprite_TekkenBar;
  Sprite_TekkenBar.prototype.initialize = function (battler, isPlayer = false, customWidth = null, customHeight = null, isInactive = false) {
    Sprite.prototype.initialize.call(this);
    this._battler = battler;
    this._isPlayer = isPlayer;
    this._isInactiveMember = isInactive;
    this._gradientPhase = Math.random() * Math.PI * 2;
    this._barBitmapWidth = customWidth || barWidth;

    const isSimpleDisplay =
      this._isPlayer &&
      this._battler.actorId &&
      (isInactive || this._battler.actorId() === 1 || this._battler.actorId() === 2 || this._battler.actorId() === 3);

    if (isSimpleDisplay) {
      const ar = getAspectRatio();
      this._playerCardWidth  = customWidth  || (ar === '16:9' ? 400 : 280);
      this._playerCardHeight = customHeight || 190;
      this._wavePhase = 0;
      this.createSimpleDisplayBackground();
      this.createSimpleStatusDisplay();
      if (!isInactive) this.createPlayerTPOrb();
      this._damageFlashTimer = 0;
      this._damageFlashSprite = null;
      this.createDamageFlashOverlay();
    } else {
      // Original initialization for enemies
      this.bitmap = new Bitmap(this._barBitmapWidth, barHeight * 3);
      this._lastHp = battler.hp;
      this._lastMaxHp = battler.mhp;
      this._lastMp = battler.mp;
      this._lastMaxMp = battler.mmp;
      this._lastTp = battler.tp;
      this._mpFlashAmount = 0;
      this._mpFlashTimer = 0;
      this._mpFlashState = false;
      this._projectedTp = battler.tp;
      this._currentSkill = null;
      this._displayHp = battler.hp;
      this._damageChunkHp = battler.hp;
      this._animationCount = 0;
      this._wavePhase = 0;
  
      // Create TP Orb first so it appears behind other elements
      this.createTPOrb();
      this.refresh();
      this.createDamageOverlay();
  
      // CHANGED: Add stat display for ALL characters (not just actor 1)
      this.createStatDisplay();
    }
  };
  
  Sprite_TekkenBar.prototype.createDamageFlashOverlay = function() {
    if (!this._shouldUseBust) return;

    this._damageFlashSprite = new Sprite();

    const flashWidth  = this._playerCardWidth  || 160;
    const flashHeight = this._playerCardHeight || 190;
    this._damageFlashSprite.bitmap = new Bitmap(flashWidth, flashHeight);
    this._damageFlashSprite.x = -playerBarX;
    this._damageFlashSprite.y = -flashHeight;
    this._damageFlashSprite.visible = false;
    this.addChild(this._damageFlashSprite);
  };
  // Add a method to update the position of the stat display
  Sprite_TekkenBar.prototype.updateStatDisplayPosition = function (x, y) {
    if (this._statDisplay) {
      this._statDisplay.x = x;
      this._statDisplay.y = y;
    }
  };

  // Replace the createStatDisplay method with this new version:
  Sprite_TekkenBar.prototype.createStatDisplay = function () {
    this._statDisplay = new Sprite();
    // Increase the width to avoid clipping
    this._statDisplay.bitmap = new Bitmap(
      barWidth * 1.5,
      statDisplayHeight * 6
    );
  
    // Position at the top center of the screen
    const xCenterOffset = 20; // Adjust this value to move left/right from center
  
    if (this._isPlayer) {
      this._statDisplay.x = 40; // Slightly left of center
      this._statDisplay.y = 75; // Top of screen with some padding
    } else {
      this._statDisplay.x = Graphics.width / 2 + xCenterOffset + 30; // Slightly right of center
      this._statDisplay.y = 75; // Top of screen with some padding
    }
  
    // Make sure the sprite is added to the scene, not as a child of the bar
    if (SceneManager._scene) {
      SceneManager._scene.addChild(this._statDisplay);
    } else {
      this.addChild(this._statDisplay);
    }
  
    // Set visibility
    this._statDisplay.visible = true;
  
    // Store UNBUFFED base stats using paramBase instead of param
    this._baseStats = {
      atk: this._battler.paramBase(2), // Attack (unbuffed)
      def: this._battler.paramBase(3), // Defense (unbuffed)
      mat: this._battler.paramBase(4), // Magic Attack (unbuffed)
      mdf: this._battler.paramBase(5), // Magic Defense (unbuffed)
      agi: this._battler.paramBase(6), // Agility (unbuffed)
      luk: this._battler.paramBase(7), // Luck (unbuffed)
    };
  
    // Initialize states hash
    this._lastStatesHash = this._battler
      .states()
      .map((s) => s.id)
      .join(",");
  
    // Call refresh to display initial buffs/debuffs
    this.refreshStatDisplay();
  };

  Sprite_TekkenBar.prototype.refreshStatDisplay = function () {
    if (!this._statDisplay || !this._battler) return;
  
    const bitmap = this._statDisplay.bitmap;
    bitmap.clear();
    bitmap.fontFace = $gameSystem.mainFontFace();
    bitmap.fontSize = 24;
    bitmap.outlineColor = "black";
    bitmap.outlineWidth = 3;
  
    let params = [
      { id: 2, name: "STR", base: this._baseStats.atk },
      { id: 3, name: "CON", base: this._baseStats.def },
      { id: 4, name: "INT", base: this._baseStats.mat },
      { id: 5, name: "WIS", base: this._baseStats.mdf },
      { id: 6, name: "DEX", base: this._baseStats.agi },
      { id: 7, name: "PSI", base: this._baseStats.luk },
    ];
    if (ConfigManager.language === "it") {
      params = [
        { id: 2, name: "FRZ", base: this._baseStats.atk },
        { id: 3, name: "COS", base: this._baseStats.def },
        { id: 4, name: "INT", base: this._baseStats.mat },
        { id: 5, name: "SAG", base: this._baseStats.mdf },
        { id: 6, name: "DES", base: this._baseStats.agi },
        { id: 7, name: "PSI", base: this._baseStats.luk },
      ];
    }
  
    // Collect all stat diffs (only stats, no statuses)
    const statParts = params.reduce((arr, p) => {
      const current = this._battler.param(p.id);
      const diff = current - p.base;
      if (diff !== 0) {
        const sign = diff > 0 ? "+" : "";
        const color = diff > 0 ? "#00ff00" : "#ff4444";
        arr.push({ text: `${p.name}${sign}${diff.toFixed(0)}`, color });
      }
      return arr;
    }, []);
  
    // Collect status tags
    const statusTags = getStatusTags(this._battler);
  
    // Initialize cycling timers if not already set
    if (this._statCycleTimer === undefined) {
      this._statCycleTimer = 0;
      this._statCycleIndex = 0;
    }
    if (this._statusCycleTimer === undefined) {
      this._statusCycleTimer = 0;
      this._statusCycleIndex = 0;
    }
  
    const lineHeight = 24;
    let xPosition = 0;
    let hasContent = false;
  
    // Handle stat display
    if (statParts.length > 0) {
      // Cycle through stats (change every 120 frames = 2 seconds)
      this._statCycleTimer++;
      if (this._statCycleTimer >= 120) {
        this._statCycleTimer = 0;
        this._statCycleIndex = (this._statCycleIndex + 1) % statParts.length;
      }
  
      // Make sure index is valid
      if (this._statCycleIndex >= statParts.length) {
        this._statCycleIndex = 0;
      }
  
      // Draw only the current stat if it exists
      const currentPart = statParts[this._statCycleIndex];
      if (currentPart) {
        bitmap.textColor = currentPart.color;
        const textWidth = bitmap.measureTextWidth(currentPart.text);
        bitmap.drawText(currentPart.text, xPosition, 0, textWidth + 20, lineHeight, "left");
        xPosition += textWidth + 20;
        hasContent = true;
      }
    }
  
    // Handle status display (on the same line, after stats)
    if (statusTags.length > 0) {
      // Cycle through statuses (change every 120 frames = 2 seconds)
      this._statusCycleTimer++;
      if (this._statusCycleTimer >= 120) {
        this._statusCycleTimer = 0;
        this._statusCycleIndex = (this._statusCycleIndex + 1) % statusTags.length;
      }
  
      // Make sure index is valid
      if (this._statusCycleIndex >= statusTags.length) {
        this._statusCycleIndex = 0;
      }
  
      // Draw only the current status if it exists
      const currentStatus = statusTags[this._statusCycleIndex];
      if (currentStatus) {
        bitmap.textColor = "#ffdd99";
        const statusText = `[${currentStatus}]`;
        bitmap.drawText(statusText, xPosition, 0, bitmap.width - xPosition, lineHeight, "left");
        hasContent = true;
      }
    }
  
    this._statDisplay.visible = hasContent;
  };
  Sprite_TekkenBar.prototype.setCurrentSkill = function (skill) {
    this._currentSkill = skill;
    if (skill && this._battler) {
      const tpCost = this._battler.skillTpCost(skill);
      // Only show projected TP if the battler has enough TP to use the skill
      if (this._battler.tp >= tpCost) {
        this._projectedTp = Math.max(0, this._battler.tp - tpCost);
      } else {
        this._projectedTp = this._battler.tp;
      }
    } else {
      this._projectedTp = this._battler.tp;
    }
    this.refreshTPOrb();
  };
  Sprite_TekkenBar.prototype.setMpFlashAmount = function (amount) {
    this._mpFlashAmount = amount || 0;
    if (amount > 0) {
      this._mpFlashTimer = 0;
      this._mpFlashState = true;
    }
  };
  Sprite_TekkenBar.prototype.createDamageOverlay = function () {
    this._damageOverlay = new Sprite();
    this._damageOverlay.bitmap = new Bitmap(this._barBitmapWidth, barHeight);
    this._damageOverlay.y = 0;
    this.addChild(this._damageOverlay);
  };
  Sprite_TekkenBar.prototype.createTPOrb = function () {
    this._tpOrb = new Sprite();
    this._tpOrb.bitmap = new Bitmap(tpOrbSize, tpOrbSize);
    if (this._isPlayer) {
      this._tpOrb.x = tpOrbOffsetX;
    } else {
      this._tpOrb.x = this._barBitmapWidth - 15;
    }
    this._tpOrb.y = -3;
    this.addChild(this._tpOrb);
    this.refreshTPOrb();
  };

  Sprite_TekkenBar.prototype.createPlayerTPOrb = function () {
    const FACE_W = 110;
    const GAP = 8;
    const cardH = this._playerCardHeight || 190;
    this._playerTpOrb = new Sprite();
    this._playerTpOrb.bitmap = new Bitmap(tpOrbSize, tpOrbSize);
    // Center orb at midpoint between HP bar center (y=51) and MP bar center (y=83) in the bitmap
    const orbCenterInBitmap = 67;
    this._playerTpOrb.x = -playerBarX + FACE_W + GAP;
    this._playerTpOrb.y = -cardH + orbCenterInBitmap - Math.floor(tpOrbSize / 2);
    this.addChild(this._playerTpOrb);
    this.refreshPlayerTPOrb();
  };

  Sprite_TekkenBar.prototype.refreshPlayerTPOrb = function () {
    if (!this._battler || !this._playerTpOrb) return;
    const savedOrb = this._tpOrb;
    this._tpOrb = this._playerTpOrb;
    this.refreshTPOrb();
    this._tpOrb = savedOrb;
  };
  Sprite_TekkenBar.prototype.update = function () {
    Sprite.prototype.update.call(this);
    if (!this._battler) {
      return;
    }
  
    // Always update gradient animations for a live feeling
    this.updateGradientAnimation();
  
    // Handle simple display for all player actors
    const isSimpleDisplay =
      this._isPlayer &&
      this._battler.actorId &&
      (this._battler.actorId() === 1 || this._battler.actorId() === 2 || this._battler.actorId() === 3);
  
    if (isSimpleDisplay) {
      // NEW: Animate the background pattern
      if (this._backgroundPattern) {
        this._backgroundPattern.origin.x += 0.5;
        this._backgroundPattern.origin.y += 0.25;
      }
  
      const b = this._battler;

      // Damage chunk + flash tracking
      if (b.hp < this._lastHp) {
        if (this._damageFlashSprite) this.triggerDamageFlash();
        this._damageChunkHp = this._displayHp;
        this._displayHp = b.hp;
      } else if (b.hp > this._lastHp) {
        this._displayHp = b.hp;
        this._damageChunkHp = b.hp;
      }

      // Animate depletion chunk
      let chunkAnimating = false;
      if (this._damageChunkHp > this._displayHp) {
        this._damageChunkHp = Math.max(
          this._displayHp,
          this._damageChunkHp - b.mhp / (60 * animationSpeed)
        );
        chunkAnimating = true;
      }

      // UPDATE DAMAGE FLASH
      if (this._damageFlashTimer > 0) {
        this._damageFlashTimer--;
        const alpha = this._damageFlashTimer / 20;
        this._damageFlashSprite.opacity = Math.floor(alpha * 200);
        this._damageFlashSprite.visible = true;
        if (this._damageFlashTimer <= 0) {
          this._damageFlashSprite.visible = false;
        }
      }

      const currentStatesHash = this._battler.states().map((s) => s.id).join(",");
      if (
        b.hp !== this._lastHp ||
        b.mhp !== this._lastMaxHp ||
        b.mp !== this._lastMp ||
        b.mmp !== this._lastMaxMp ||
        b.tp !== this._lastTp ||
        chunkAnimating ||
        this._lastStatesHash !== currentStatesHash
      ) {
        this.refreshSimpleStatus();
        this._lastHp = b.hp;
        this._lastMaxHp = b.mhp;
        this._lastMp = b.mp;
        this._lastMaxMp = b.mmp;
        this._lastTp = b.tp;
        this._lastStatesHash = currentStatesHash;
      }
      return;
    }
  
    const b = this._battler;
    if (b.hp < this._lastHp) {
      this._damageChunkHp = this._displayHp;
      this._displayHp = b.hp;
      this.updateDamageOverlay();
    } else if (b.hp > this._lastHp) {
      this._displayHp = b.hp;
      this._damageChunkHp = b.hp;
      this.updateDamageOverlay();
    }
  
    if (this._damageChunkHp > this._displayHp) {
      this._damageChunkHp = Math.max(
        this._displayHp,
        this._damageChunkHp - b.mhp / (60 * animationSpeed)
      );
      this.updateDamageOverlay();
    }
  
    // Check for deck count changes when switch 45 is active
    let deckCountChanged = false;
    if ($gameSwitches.value(45) && this._isPlayer) {
      const currentDeckCount = window.$deckCount || 0;
      if (currentDeckCount !== this._lastDeckCount) {
        deckCountChanged = true;
        this._lastDeckCount = currentDeckCount;
      }
    }
  
    // Only refresh if values have changed
    if (
      b.hp !== this._lastHp ||
      b.mhp !== this._lastMaxHp ||
      b.mp !== this._lastMp ||
      b.mmp !== this._lastMaxMp ||
      b.tp !== this._lastTp ||
      deckCountChanged
    ) {
      this.refresh();
  
      // Only refresh TP orb if TP has changed or deck count changed
      if (this._tpOrb && (b.tp !== this._lastTp || deckCountChanged)) {
        this.refreshTPOrb();
      }
  
      this._lastHp = b.hp;
      this._lastMaxHp = b.mhp;
      this._lastMp = b.mp;
      this._lastMaxMp = b.mmp;
      this._lastTp = b.tp;
    }
  
    // CHANGED: Check for stat changes or states for ALL characters (not just actor 1)
    if (this._statDisplay && this._battler) {
      // Reduce frequency of stat updates on mobile
      if (
        !(isMobileDevice || useMobileOptimization) ||
        (this._statCheckCount = ((this._statCheckCount || 0) + 1) % 10) === 0
      ) {
        const params = [2, 3, 4, 5, 6, 7]; // ATK, DEF, MAT, MDF, AGI, LUK
        let statsChanged = false;
        let statesChanged = false;
        let lastStatesHash = this._lastStatesHash || "";
  
        // Create a hash of current states to check for changes
        let currentStatesHash = this._battler
          .states()
          .map((state) => state.id)
          .sort()
          .join(",");
  
        // Check if states have changed
        if (currentStatesHash !== lastStatesHash) {
          statesChanged = true;
          this._lastStatesHash = currentStatesHash;
        }
  
        // Check if stats have changed
        for (const paramId of params) {
          const current = this._battler.param(paramId);
          const base =
            this._baseStats[
              ["atk", "def", "mat", "mdf", "agi", "luk"][paramId - 2]
            ];
          if (current !== base) {
            statsChanged = true;
            break;
          }
        }
  
        // Refresh display if either stats or states changed
        if (statsChanged || statesChanged) {
          this.refreshStatDisplay();
        }
      }
    }
  };
  Sprite_TekkenBar.prototype.updateGradientAnimation = function () {
    // Update gradient phase for all animations
    this._gradientPhase += 0.01 * gradientSpeed;
    if (this._gradientPhase > Math.PI * 2) {
      this._gradientPhase -= Math.PI * 2;
    }

    // Only update wave phase if not in mobile mode (for TP orb)
    if (!(isMobileDevice || useMobileOptimization)) {
      this._wavePhase += 0.02 * gradientSpeed;
      if (this._wavePhase > Math.PI * 2) {
        this._wavePhase -= Math.PI * 2;
      }
    }

    // Refresh is now needed to see the moving gradient
    const isSimpleDisplay =
      this._isPlayer &&
      this._battler &&
      this._battler.actorId &&
      (this._battler.actorId() === 1 || this._battler.actorId() === 2 || this._battler.actorId() === 3);
    if (!isSimpleDisplay) {
      this.refresh();
      if (this._tpOrb) {
        this.refreshTPOrb();
      }
    } else {
      if (this._playerTpOrb) {
        this.refreshPlayerTPOrb();
      }
    }
  };

  Sprite_TekkenBar.prototype.updateDamageOverlay = function () {
    const w = this.bitmap.width;
    const b = this._battler;
    const hpRate = this._displayHp / Math.max(1, b.mhp);
    const dmgRate = this._damageChunkHp / Math.max(1, b.mhp);
    this._damageOverlay.bitmap.clear();
    const ctx = this._damageOverlay.bitmap.context;
    if (this._isPlayer) {
      const dmgWidth = (w - borderThickness * 2) * dmgRate;
      const hpWidth = (w - borderThickness * 2) * hpRate;
      const dmgX = w - dmgWidth - borderThickness;
      const dmgChunkWidth = dmgWidth - hpWidth;
      if (dmgChunkWidth > 0) {
        ctx.fillStyle = damageColor;
        ctx.fillRect(dmgX, 0, dmgChunkWidth, barHeight);
      }
    } else {
      const hpWidth = (w - borderThickness * 2) * hpRate;
      const dmgWidth = (w - borderThickness * 2) * dmgRate;
      if (dmgWidth > hpWidth) {
        const chunkX = borderThickness + hpWidth;
        const chunkWidth = dmgWidth - hpWidth;
        ctx.fillStyle = damageColor;
        ctx.fillRect(chunkX, 0, chunkWidth, barHeight);
      }
    }
  };
  Sprite_TekkenBar.prototype.refreshTPOrb = function () {
    if (!this._battler || !this._tpOrb) {
      return;
    }
  
    const b = this._battler;
    let displayValue, maxValue, rate;
    
    // Check if switch 45 is active and this is a player
    if ($gameSwitches.value(45) && this._isPlayer) {
      // Use deck count instead of TP
      displayValue = Math.min(window.$deckCount || 0, 40);
      maxValue = 40;
      rate = displayValue / maxValue;
    } else {
      // Original TP logic
      displayValue = Math.min(b.tp, 99);
      maxValue = 99;
      rate = displayValue / maxValue;
    }
  
    const bitmap = this._tpOrb.bitmap;
    const radius = tpOrbSize / 2;
    const center = radius;
  
    bitmap.clear();
    bitmap.drawCircle(center, center, radius, "#333333");
    bitmap.drawCircle(center, center, radius - 2, "#222222");
    const liquidHeight = Math.floor((tpOrbSize - 4) * rate);
  
    const ctx = bitmap.context;
    const gradientFactor = (Math.sin(this._gradientPhase) + 1) / 2;
  
    if (liquidHeight > 0) {
      // Check if using mobile optimization
      if (isMobileDevice || useMobileOptimization) {
        // Simple block fill for mobile (much faster)
        ctx.save();
        ctx.beginPath();
        ctx.arc(center, center, radius - 2, 0, Math.PI * 2, false);
        ctx.clip();
  
        // Create a simple gradient
        const orbGradient = ctx.createLinearGradient(
          0,
          tpOrbSize,
          0,
          tpOrbSize - liquidHeight
        );
        orbGradient.addColorStop(0, tpColor1);
        orbGradient.addColorStop(1, tpColor2);
  
        // Draw a simple rectangle instead of wave pattern
        ctx.fillStyle = orbGradient;
        ctx.fillRect(0, tpOrbSize - liquidHeight, tpOrbSize, liquidHeight);
        ctx.restore();
      } else {
        // Original liquid animation for desktop
        const waveAmplitude = 3;
        const waveFrequency = 3;
        const orbGradient = ctx.createLinearGradient(
          0,
          tpOrbSize,
          0,
          tpOrbSize - liquidHeight
        );
        orbGradient.addColorStop(0, tpColor1);
        orbGradient.addColorStop(0.5 + gradientFactor * 0.5, tpColor2);
        orbGradient.addColorStop(1, tpColor1);
  
        ctx.save();
        ctx.beginPath();
        ctx.arc(center, center, radius - 2, 0, Math.PI * 2, false);
        ctx.clip();
        ctx.beginPath();
        ctx.moveTo(0, tpOrbSize);
        ctx.lineTo(0, tpOrbSize - liquidHeight);
  
        // This loop is expensive on mobile
        for (let x = 0; x <= tpOrbSize; x += 1) {
          const y =
            tpOrbSize -
            liquidHeight +
            Math.sin(
              (x / tpOrbSize) * Math.PI * waveFrequency + this._wavePhase
            ) *
              waveAmplitude *
              rate;
          ctx.lineTo(x, y);
        }
  
        ctx.lineTo(tpOrbSize, tpOrbSize);
        ctx.closePath();
        ctx.fillStyle = orbGradient;
        ctx.fill();
        ctx.restore();
      }
    }
  
    // Display the value
    bitmap.fontSize = 16;
    bitmap.textColor = "#ffffff";
    
    if ($gameSwitches.value(45) && this._isPlayer) {
      // Show deck count
      bitmap.drawText(Math.floor(displayValue), 0, center - 8, tpOrbSize, 16, "center");
    } else {
      // Original TP display logic
      if (
        this._currentSkill &&
        this._battler.skillTpCost(this._currentSkill) > 0
      ) {
        const originalTp = Math.floor(b.tp);
        const projectedTp = Math.floor(this._projectedTp);
        bitmap.textColor = projectedTp < originalTp ? "#ff9900" : "#ffffff";
        bitmap.drawText(projectedTp, 0, center - 8, tpOrbSize, 16, "center");
      } else {
        bitmap.drawText(Math.floor(b.tp), 0, center - 8, tpOrbSize, 16, "center");
      }
    }
  
    // Add highlight effect (simplified for mobile)
    if (!(isMobileDevice || useMobileOptimization)) {
      ctx.save();
      ctx.globalCompositeOperation = "lighter";
      const highlight = ctx.createRadialGradient(
        center - radius / 4,
        center - radius / 4,
        0,
        center - radius / 4,
        center - radius / 4,
        radius / 2
      );
      highlight.addColorStop(0, "rgba(255,255,255,0.4)");
      highlight.addColorStop(1, "rgba(255,255,255,0)");
      ctx.fillStyle = highlight;
      ctx.beginPath();
      ctx.arc(
        center - radius / 4,
        center - radius / 4,
        radius / 2,
        0,
        Math.PI * 2,
        false
      );
      ctx.fill();
      ctx.restore();
    }
  
    bitmap._baseTexture.update();
  };
  
  Sprite_TekkenBar.prototype.refresh = function () {
    if (!this._battler) {
      return;
    }
    const w = this.bitmap.width;
    const b = this._battler;
    const hpRate = this._displayHp / Math.max(1, b.mhp);
    this.bitmap.clear();
  
    // NEW: Animated gradient logic
    const gradientWidth = w * 1.5;
    const scrollX = w * 0.5 * Math.sin(this._gradientPhase);
    const gradientOffset = w / 2 - scrollX;
  
    const ctx = this.bitmap.context;
    if (this._isPlayer) {
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(w, 0);
      ctx.lineTo(w - angleSize, barHeight);
      ctx.lineTo(0, barHeight);
      ctx.lineTo(0, 0);
      ctx.closePath();
      ctx.fillStyle = "#222";
      ctx.fill();
      ctx.strokeStyle = borderColor;
      ctx.lineWidth = borderThickness;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(w, 0);
      ctx.lineTo(w - angleSize, barHeight);
      ctx.lineTo(0, barHeight);
      ctx.closePath();
      ctx.stroke();
  
      // NEW: Apply the moving gradient
      const playerGradient = ctx.createLinearGradient(
        gradientOffset - gradientWidth / 2,
        0,
        gradientOffset + gradientWidth / 2,
        0
      );
      playerGradient.addColorStop(0, playerHPColor2);
      playerGradient.addColorStop(0.5, playerHPColor1);
      playerGradient.addColorStop(1, playerHPColor2);
  
      const hpWidth = (w - borderThickness * 2) * hpRate;
      const hpX = w - hpWidth - borderThickness;
      if (hpWidth > 0) {
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(w - borderThickness, borderThickness);
        ctx.lineTo(
          w - borderThickness - angleSize,
          barHeight - borderThickness
        );
        ctx.lineTo(hpX, barHeight - borderThickness);
        ctx.lineTo(hpX, borderThickness);
        ctx.closePath();
        ctx.clip(); // Clip the drawing to the bar shape
        ctx.fillStyle = playerGradient;
        ctx.fillRect(0, 0, w, barHeight); // Fill the clipped area
        ctx.restore();
      }
  
      // Only draw MP bar if switch 45 is NOT active or this is not a player
      if (!$gameSwitches.value(45)) {
        const mpY = barHeight + 5;
        const mpHeight = barHeight / 2;
        const mpRate = b.mp / Math.max(1, b.mmp);
        ctx.beginPath();
        ctx.moveTo(0, mpY);
        ctx.lineTo(w, mpY);
        ctx.lineTo(w - Math.floor(angleSize / 2), mpY + mpHeight);
        ctx.lineTo(0, mpY + mpHeight);
        ctx.lineTo(0, mpY);
        ctx.closePath();
        ctx.fillStyle = "#111";
        ctx.fill();
  
        // NEW: Apply moving gradient to MP bar
        const mpGradient = ctx.createLinearGradient(
          gradientOffset - gradientWidth / 2,
          0,
          gradientOffset + gradientWidth / 2,
          0
        );
        mpGradient.addColorStop(0, mpBarColor2);
        mpGradient.addColorStop(0.5, mpBarColor1);
        mpGradient.addColorStop(1, mpBarColor2);
  
        if (mpRate > 0) {
          const mpWidth = (w - 4) * mpRate;
  
          ctx.save();
          ctx.beginPath();
          ctx.moveTo(2, mpY + 2);
          ctx.lineTo(mpWidth + 2, mpY + 2);
          ctx.lineTo(mpWidth - Math.floor(angleSize / 3) + 2, mpY + mpHeight - 2);
          ctx.lineTo(2, mpY + mpHeight - 2);
          ctx.closePath();
          ctx.clip();
          ctx.fillStyle = mpGradient;
          ctx.fillRect(0, mpY, w, mpHeight);
          ctx.restore();
  
          // MP Flash logic (unchanged)
          if (this._mpFlashAmount > 0 && this._mpFlashState) {
            const mpFlashRate = this._mpFlashAmount / Math.max(1, b.mmp);
            const mpFlashWidth = (w - 4) * mpFlashRate;
            const mpFlashX = 2 + (mpWidth - mpFlashWidth);
            if (mpFlashX >= 2 && mpFlashWidth > 0) {
              ctx.save();
              ctx.globalAlpha = 0.6;
              ctx.fillStyle = "#ffffff";
              ctx.beginPath();
              ctx.moveTo(mpFlashX, mpY + 2);
              ctx.lineTo(mpFlashX + mpFlashWidth, mpY + 2);
              ctx.lineTo(
                mpFlashX + mpFlashWidth - Math.floor(angleSize / 3),
                mpY + mpHeight - 2
              );
              ctx.lineTo(mpFlashX, mpY + mpHeight - 2);
              ctx.closePath();
              ctx.fill();
              ctx.restore();
            }
          }
        }
      }
    } else {
      // Enemy Bar (unchanged)
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(w, 0);
      ctx.lineTo(w, barHeight);
      ctx.lineTo(angleSize, barHeight);
      ctx.lineTo(0, 0);
      ctx.closePath();
      ctx.fillStyle = "#222";
      ctx.fill();
      ctx.strokeStyle = borderColor;
      ctx.lineWidth = borderThickness;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(w, 0);
      ctx.lineTo(w, barHeight);
      ctx.lineTo(angleSize, barHeight);
      ctx.closePath();
      ctx.stroke();
  
      // NEW: Apply moving gradient to Enemy HP
      const enemyGradient = ctx.createLinearGradient(
        gradientOffset - gradientWidth / 2,
        0,
        gradientOffset + gradientWidth / 2,
        0
      );
      enemyGradient.addColorStop(0, enemyHPColor2);
      enemyGradient.addColorStop(0.5, enemyHPColor1);
      enemyGradient.addColorStop(1, enemyHPColor2);
  
      const hpWidth = (w - borderThickness * 2) * hpRate;
      if (hpWidth > 0) {
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(borderThickness, borderThickness);
        ctx.lineTo(borderThickness + angleSize, barHeight - borderThickness);
        const rightX = borderThickness + hpWidth;
        ctx.lineTo(rightX, barHeight - borderThickness);
        ctx.lineTo(rightX, borderThickness);
        ctx.closePath();
        ctx.clip();
        ctx.fillStyle = enemyGradient;
        ctx.fillRect(0, 0, w, barHeight);
        // Shine strip (top half of HP fill)
        const hiH = Math.max(1, Math.floor(barHeight / 2));
        ctx.globalAlpha = 0.28;
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(borderThickness, borderThickness, rightX - borderThickness, hiH);
        ctx.restore();
      }
  
      const mpY = barHeight + 5;
      const mpHeight = barHeight / 2;
      const mpRate = b.mp / Math.max(1, b.mmp);
      ctx.beginPath();
      ctx.moveTo(0, mpY);
      ctx.lineTo(w, mpY);
      ctx.lineTo(w, mpY + mpHeight);
      ctx.lineTo(Math.floor(angleSize / 2), mpY + mpHeight);
      ctx.lineTo(0, mpY);
      ctx.closePath();
      ctx.fillStyle = "#111";
      ctx.fill();
  
      // NEW: Apply moving gradient to Enemy MP
      const mpGradient = ctx.createLinearGradient(
        gradientOffset - gradientWidth / 2,
        0,
        gradientOffset + gradientWidth / 2,
        0
      );
      mpGradient.addColorStop(0, mpBarColor2);
      mpGradient.addColorStop(0.5, mpBarColor1);
      mpGradient.addColorStop(1, mpBarColor2);
  
      if (mpRate > 0) {
        const mpWidth = (w - 4) * mpRate;
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(2, mpY + 2);
        ctx.lineTo(Math.floor(angleSize / 3) + 2, mpY + mpHeight - 2);
        ctx.lineTo(mpWidth + 2, mpY + mpHeight - 2);
        ctx.lineTo(mpWidth + 2, mpY + 2);
        ctx.closePath();
        ctx.clip();
        ctx.fillStyle = mpGradient;
        ctx.fillRect(0, mpY, w, mpHeight);
        // Shine strip (top half of MP fill)
        const mpHiH = Math.max(1, Math.floor(mpHeight / 2));
        ctx.globalAlpha = 0.28;
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(2, mpY + 2, mpWidth, mpHiH);
        ctx.restore();
      }
    }
    this.bitmap._baseTexture.update();
    this.bitmap.textColor = "#ffffff";
    this.bitmap.fontSize = 12;
    this.bitmap.fontBold = true;
    this.bitmap.fontFace = $gameSystem.mainFontFace();
    if (this._isPlayer) {
      // Draw name with level on top line
      const actorLevel = b.level ? ` L.${b.level}` : "";
      const nameWithLevel = b.name() + actorLevel;
      this.bitmap.fontSize = 12;
      this.bitmap.drawText(nameWithLevel, 0, -3, w - 20, barHeight, "right");
      
  }
   else {
      const level = getEnemyLevel(b);
      const nameText = level
        ? `${window.translateText(b.name())} ${level}`
        : window.translateText(b.name());
  
      this.bitmap.fontSize = 12;
      this.bitmap.fontBold = true;
      this.bitmap.fontFace = $gameSystem.mainFontFace();
  
      const maxWidth = w - 30;
      const textWidth = this.bitmap.measureTextWidth(nameText);
  
      if (textWidth > maxWidth) {
        if (this._scaledTextSprite) {
          this.removeChild(this._scaledTextSprite);
        }
  
        this._scaledTextSprite = new Sprite();
        this._scaledTextSprite.bitmap = new Bitmap(textWidth + 20, barHeight);
        this._scaledTextSprite.bitmap.fontSize = 12;
        this._scaledTextSprite.bitmap.fontBold = true;
        this._scaledTextSprite.bitmap.fontFace = $gameSystem.mainFontFace();
        this._scaledTextSprite.bitmap.textColor = "#ffffff";
  
        this._scaledTextSprite.bitmap.drawText(
          nameText,
          10,
          0,
          textWidth + 10,
          barHeight,
          "left"
        );
  
        const scaleFactor = maxWidth / textWidth;
  
        this._scaledTextSprite.scale.x = scaleFactor;
        this._scaledTextSprite.scale.y = 1;
  
        this._scaledTextSprite.x = 15;
        this._scaledTextSprite.y = 0;
  
        this.addChild(this._scaledTextSprite);
      } else {
        if (this._scaledTextSprite) {
          this.removeChild(this._scaledTextSprite);
          this._scaledTextSprite = null;
        }

        this.bitmap.drawText(nameText, 15, 0, w - 15, barHeight, "left");
      }

      // HP numbers right-aligned on HP bar
      const hpBarRate = b.hp / Math.max(1, b.mhp);
      let hpNumColor = "#ffffff";
      if (hpBarRate <= 0.25) hpNumColor = "#ff4444";
      else if (hpBarRate <= 0.5) hpNumColor = "#ffff00";
      this.bitmap.fontSize = 12;
      this.bitmap.fontBold = true;
      this.bitmap.outlineColor = "black";
      this.bitmap.outlineWidth = 3;
      this.bitmap.textColor = hpNumColor;
      this.bitmap.drawText(`${b.hp}`, 0, 0, w - 5, barHeight, "right");

      // MP numbers right-aligned on MP bar
      const mpNumBarY = barHeight + 5;
      const mpNumH = Math.floor(barHeight / 2);
      this.bitmap.fontSize = 10;
      this.bitmap.fontBold = false;
      this.bitmap.textColor = mpBarColor1;
      this.bitmap.drawText(`${b.mp}`, 0, mpNumBarY, w - 5, mpNumH, "right");
    }
  };
  const _Window_SkillList_drawSkillCost =
    Window_SkillList.prototype.drawSkillCost;
  Window_SkillList.prototype.drawSkillCost = function (skill, x, y, width) {
    if (this._actor.skillTpCost(skill) > 0) {
      const tpCost = this._actor.skillTpCost(skill);
      const hasEnoughTp = this._actor.tp >= tpCost;
      if (hasEnoughTp) {
        this.changeTextColor(tpSkillColor);
      } else {
        this.changeTextColor("#888888");
      }
      this.drawText(tpCost, x, y, width, "right");
    } else if (this._actor.skillMpCost(skill) > 0) {
      const mpCost = this._actor.skillMpCost(skill);
      const hasEnoughMp = this._actor.mp >= mpCost;
      if (hasEnoughMp) {
        this.changeTextColor(mpSkillColor);
      } else {
        this.changeTextColor("#888888");
      }
      this.drawText(mpCost, x, y, width, "right");
    }
  };
  Window_SkillList.prototype.isSkillUsable = function (skill) {
    return this._actor && this._actor.canUse(skill);
  };
  const _Window_SkillList_refresh = Window_SkillList.prototype.refresh;
  Window_SkillList.prototype.refresh = function () {
    this._lastMp = this._actor ? this._actor.mp : null;
    this._lastTp = this._actor ? this._actor.tp : null;
    _Window_SkillList_refresh.call(this);
  };
  const _Window_SkillList_update = Window_SkillList.prototype.update;
  Window_SkillList.prototype.update = function () {
    _Window_SkillList_update.call(this);
    if (this._actor) {
      if (this._actor.mp !== this._lastMp || this._actor.tp !== this._lastTp) {
        this.refresh();
      }
    }
  };
  const _Window_SkillList_select = Window_SkillList.prototype.select;
  Window_SkillList.prototype.select = function (index) {
    _Window_SkillList_select.call(this, index);
    this.updateTPProjection();
  };
  Window_SkillList.prototype.updateTPProjection = function () {
    if (!this._actor || !this.active) {
      return;
    }
    const skill = this.item();
    const scene = SceneManager._scene;
    if (scene instanceof Scene_Battle && scene._tekkenHealthBarSprites) {
      for (const sprite of scene._tekkenHealthBarSprites) {
        if (sprite && sprite._battler === this._actor) {
          sprite.setCurrentSkill(skill);
          if (skill) {
            const mpCost = this._actor.skillMpCost(skill);
            sprite.setMpFlashAmount(mpCost);
          } else {
            sprite.setMpFlashAmount(0);
          }
          break;
        }
      }
    }
  };
  const _Window_SkillList_deactivate = Window_SkillList.prototype.deactivate;
  Window_SkillList.prototype.deactivate = function () {
    _Window_SkillList_deactivate.call(this);
    const scene = SceneManager._scene;
    if (scene instanceof Scene_Battle && scene._tekkenHealthBarSprites) {
      for (const sprite of scene._tekkenHealthBarSprites) {
        if (sprite && sprite._battler === this._actor) {
          sprite.setCurrentSkill(null);
          sprite.setMpFlashAmount(0);
          break;
        }
      }
    }
  };
  Window_Selectable.prototype.drawItemBackground = function (index) {};
  const _Window_SkillList_drawItem = Window_SkillList.prototype.drawItem;
  Window_SkillList.prototype.drawItem = function (index) {
    if (this._actor) {
      const skill = this._data[index];
      if (skill) {
        const rect = this.itemLineRect(index);
        const costWidth = this.costWidth();
        const skillName = this._actor.canUse(skill) ? skill.name : skill.name;
        this.changePaintOpacity(this._actor.canUse(skill));
        this.drawItemName(skill, rect.x, rect.y, rect.width - costWidth);
        this.drawSkillCost(skill, rect.x, rect.y, rect.width);
        this.changePaintOpacity(true);
      }
    }
  };
  const _Window_ItemList_drawItem = Window_ItemList.prototype.drawItem;
  Window_ItemList.prototype.drawItem = function (index) {
    const item = this._data[index];
    if (item) {
      const rect = this.itemLineRect(index);
      const nameWidth = rect.width;
      this.changePaintOpacity(this.isEnabled(item));
      this.drawItemName(item, rect.x, rect.y, nameWidth);
      this.changePaintOpacity(true);
    }
  };
  // Create a method to get status effects
  Sprite_TekkenBar.prototype.getStatusEffects = function () {
    if (!this._battler) return [];
    return this._battler.states().map((state) => state.name);
  };

  const _Scene_Battle_createDisplayObjects =
    Scene_Battle.prototype.createDisplayObjects;
  Scene_Battle.prototype.createDisplayObjects = function () {
    _Scene_Battle_createDisplayObjects.call(this);
    this.createTekkenHealthBars();
  };
Scene_Battle.prototype.createTekkenHealthBars = function () {
  this._tekkenHealthBarSprites = [];

  // Get responsive positions based on current resolution
  const positions = getResponsiveBarPositions();
  const aspectRatio = getAspectRatio();

  const partyMembers = $gameParty.battleMembers();

  // Create Player Bars - stacked vertically at top left
  const PCARD_W = aspectRatio === '16:9' ? 396 : 275;
  const PCARD_H = 110;
  const PCARD_SPACING = 0;
  const PCARD_TOP = 10;
  const PCARD_LEFT = 10;

  for (let i = 0; i < partyMembers.length; i += 1) {
    const actor = partyMembers[i];
    const sprite = new Sprite_TekkenBar(actor, true, PCARD_W, PCARD_H);

    // cards stacked downward from top left; sprite.y is card bottom edge
    sprite.x = PCARD_LEFT + playerBarX;
    sprite.y = PCARD_TOP + PCARD_H + i * (PCARD_H + PCARD_SPACING);

    this.addChild(sprite);
    this._tekkenHealthBarSprites.push(sprite);
  }

  // Reserve/inactive party members shown below active ones
  const activeMemberIds = new Set(partyMembers.map(a => a.actorId()));
  const inactiveMembers = $gameParty.members().filter(a => !activeMemberIds.has(a.actorId()));
  for (let i = 0; i < inactiveMembers.length; i++) {
    const actor = inactiveMembers[i];
    const sprite = new Sprite_TekkenBar(actor, true, PCARD_W, PCARD_H, true);
    sprite.x = PCARD_LEFT + playerBarX;
    sprite.y = PCARD_TOP + PCARD_H + (partyMembers.length + i) * (PCARD_H + PCARD_SPACING);
    this.addChild(sprite);
    this._tekkenHealthBarSprites.push(sprite);
  }

  // Create Enemy Bars - right-aligned
  const enemyRightX = Graphics.width - enemyLargeBarWidth - 80;
  for (let i = 0; i < $gameTroop.members().length; i += 1) {
    const enemy = $gameTroop.members()[i];
    if (enemy.isAlive()) {
      const sprite = new Sprite_TekkenBar(enemy, false, enemyLargeBarWidth);
      sprite.x = enemyRightX;
      sprite.y = positions.barsY + i * barSpacing;
      this.addChild(sprite);
      this._tekkenHealthBarSprites.push(sprite);
    }
  }
};




Scene_Battle.prototype.createEnemyHPSprite = function(enemy) {
  const sprite = new Sprite();
  sprite._enemy = enemy;
  sprite._lastHp = enemy.hp;
  
  sprite.bitmap = new Bitmap(200, 30);
  sprite.bitmap.fontFace = $gameSystem.mainFontFace();
  sprite.bitmap.fontSize = 18;
  sprite.bitmap.fontBold = true;
  sprite.bitmap.outlineColor = "black";
  sprite.bitmap.outlineWidth = 3;
  
  // Position under the enemy battler with resolution awareness
  const enemySprite = this._spriteset._enemySprites.find(s => s._battler === enemy);
  if (enemySprite) {
    sprite.x = enemySprite.x - 100;
    sprite.y = enemySprite.y + enemySprite.height / 2 - 200;
  }
  
  sprite.update = function() {
    Sprite.prototype.update.call(this);
    
    if (!this._enemy || !this._enemy.isAlive()) {
      this.visible = false;
      return;
    }
    
    if (this._enemy.hp !== this._lastHp) {
      this.refreshHP();
      this._lastHp = this._enemy.hp;
    }
  };
  
  sprite.refreshHP = function() {
    this.bitmap.clear();
    
    const hp = this._enemy.hp;
    const maxHp = this._enemy.mhp;
    const hpRate = hp / Math.max(1, maxHp);
    
    let color = "#ffffff";
    if (hpRate <= 0.25) color = "#ff4444";
    else if (hpRate <= 0.5) color = "#ffff00";
    else if (hpRate <= 0.75) color = "#ffaa00";
    
    this.bitmap.textColor = color;
    this.bitmap.drawText(`${hp}`, 0, 0, 200, 30, "center");
  };
  
  sprite.refreshHP();
  return sprite;
};

  const _Scene_Battle_update = Scene_Battle.prototype.update;
  Scene_Battle.prototype.update = function () {
    _Scene_Battle_update.call(this);
    this.updateTekkenHealthBars();
  };
  Scene_Battle.prototype.updateTekkenHealthBars = function () {
    // Determine whose turn it is (inputting or executing)
    const activeActor = BattleManager._currentActor ||
      (BattleManager._subject && BattleManager._subject.isActor() ? BattleManager._subject : null);

    for (const sprite of this._tekkenHealthBarSprites) {
      if (sprite && sprite._battler) {
        if (sprite._isPlayer) {
          sprite.visible = true;
          // Checkerboard + overlay only on the active actor; solid base always visible
          const isActive = sprite._battler === activeActor;
          if (sprite._solidBackground) sprite._solidBackground.visible = true;
          if (sprite._backgroundPattern) sprite._backgroundPattern.visible = sprite._isInactiveMember || isActive;
          if (sprite._backgroundOverlay) sprite._backgroundOverlay.visible = isActive;
        } else {
          sprite.visible = sprite._battler.isAlive();
        }
      }
    }
  };
  const _Window_ActorCommand_initialize =
    Window_ActorCommand.prototype.initialize;

  // Create a method to get stat display values
  Sprite_TekkenBar.prototype.getStatChanges = function () {
    if (!this._battler) return {};

    const changes = {};
    const params = [
      { id: 2, name: "STR", base: this._baseStats.atk },
      { id: 3, name: "CON", base: this._baseStats.def },
      { id: 4, name: "INT", base: this._baseStats.mat },
      { id: 5, name: "WIS", base: this._baseStats.mdf },
      { id: 6, name: "DEX", base: this._baseStats.agi },
      { id: 7, name: "PSI", base: this._baseStats.luk },
    ];

    for (const param of params) {
      const current = this._battler.param(param.id);
      const diff = current - param.base;

      if (diff !== 0) {
        changes[param.name] = diff;
      }
    }

    return changes;
  };
  Window_ActorCommand.prototype.initialize = function (rect) {
    if (rect) {
      const lineHeight = this.lineHeight();
      const itemPadding = this.itemPadding();
      const extraHeight = lineHeight + itemPadding * 2;
      rect.height += extraHeight;
    }
    _Window_ActorCommand_initialize.call(this, rect);
  };
  Window_ActorCommand.prototype.maxVisibleItems = function () {
    return 6;
  };
  Window_ActorCommand.prototype.numVisibleRows = function () {
    return 6;
  };
  Window_ActorCommand.prototype.windowHeight = function () {
    return this.fittingHeight(this.numVisibleRows());
  };
  const _Scene_Battle_updateActorCommandWindowPosition =
    Scene_Battle.prototype.updateActorCommandWindowPosition;
  Scene_Battle.prototype.updateActorCommandWindowPosition = function () {
    _Scene_Battle_updateActorCommandWindowPosition.call(this);
    if (
      this._actorCommandWindow.y + this._actorCommandWindow.height >
      Graphics.boxHeight
    ) {
      const overflow =
        this._actorCommandWindow.y +
        this._actorCommandWindow.height -
        Graphics.boxHeight;
      this._actorCommandWindow.y -= overflow + 4;
    }
  };
  Window_ActorCommand.prototype.updateLayoutForExtraCommand = function () {
    const height = this.windowHeight();
    if (this.height !== height) {
      this.height = height;
      this.createContents();
    }
  };
  const _Window_ActorCommand_refresh = Window_ActorCommand.prototype.refresh;
  Window_ActorCommand.prototype.refresh = function () {
    this.updateLayoutForExtraCommand();
    _Window_ActorCommand_refresh.call(this);
  };


// Add the helper method for individual skill commands
Window_ActorCommand.prototype.addSkillCommand = function(skillTypeId) {
  const name = $dataSystem.skillTypes[skillTypeId];
  this.addCommand(name, "skill", true, skillTypeId);
};
  const _Scene_Battle_terminate = Scene_Battle.prototype.terminate;
  Scene_Battle.prototype.terminate = function () {
    _Scene_Battle_terminate.call(this);
    this.removeTekkenHealthBars();
  };
  Scene_Battle.prototype.removeTekkenHealthBars = function () {

    // Original cleanup code
    if (this._tekkenHealthBarSprites) {
      for (const sprite of this._tekkenHealthBarSprites) {
        if (sprite) {
          this.removeChild(sprite);
          if (sprite._statDisplay) {
            this.removeChild(sprite._statDisplay);
          }
        }
      }
      this._tekkenHealthBarSprites = [];
    }
  };

  //=========================================================================
  // NEW: Functions for the 'Simple Display' (Actors 2 & 3)
  //=========================================================================

  // NEW: This function creates the animated background for Actors 2 & 3
  // MODIFIED: This function creates the animated background for Actors 2 & 3
// MODIFIED: This function creates the animated background for Actors 2 & 3
Sprite_TekkenBar.prototype.createSimpleDisplayBackground = function () {
  // 1. Create the bitmap that will hold our square pattern
  const patternBitmap = new Bitmap(128, 128);
  const size = 16;
  const darkGold = "#3b3100";
  const black = "#0a0a0a";

  // 2. Fill the bitmap with the pattern
  for (let y = 0; y < patternBitmap.height; y += size) {
    for (let x = 0; x < patternBitmap.width; x += size) {
      const color = ((x + y) / size) % 2 === 0 ? darkGold : black;
      patternBitmap.fillRect(x, y, size, size, color);
    }
  }

  // 3. Create the TilingSprite for the moving background with reduced width
  const barGfxWidth = 240; // CHANGED: Reduced from 290 to 240 (70px narrower)
  const barGfxHeight = 68; // Height remains the same
  this._backgroundPattern = new TilingSprite(patternBitmap);
  
  // CHANGED: Position much closer to left edge (was -playerBarX, now 5 pixels from left)
  this._backgroundPattern.move(
    5, // Very close to left border instead of -playerBarX
    -barGfxHeight / 2,
    barGfxWidth,
    barGfxHeight
  );
  this._backgroundPattern.opacity = 128; // Make the pattern itself semi-transparent
  this.addChild(this._backgroundPattern);

  // 4. Create the semi-transparent overlay to darken the pattern
  const overlayBitmap = new Bitmap(barGfxWidth, barGfxHeight);
  overlayBitmap.fillAll("rgba(0, 0, 0, 0.6)"); // 60% black overlay
  this._backgroundOverlay = new Sprite(overlayBitmap);
  
  // CHANGED: Position overlay to match the pattern position
  this._backgroundOverlay.x = 5; // Match the pattern position
  this._backgroundOverlay.y = -barGfxHeight / 2;
  this.addChild(this._backgroundOverlay);
};
  // MODIFIED: This now creates card-style layout for party members - aspect ratio aware
  Sprite_TekkenBar.prototype.createSimpleStatusDisplay = function () {
    this._simpleStatusDisplay = new Sprite();

    const cardWidth = this._playerCardWidth || 160;
    const cardHeight = this._playerCardHeight || 190;
    const yOffset = -cardHeight;

    this._simpleStatusDisplay.bitmap = new Bitmap(cardWidth, cardHeight);
    this._simpleStatusDisplay.x = -playerBarX;
    this._simpleStatusDisplay.y = yOffset;
    this.addChild(this._simpleStatusDisplay);
  
    // Store battler's initial state for comparison
    this._lastHp = this._battler.hp;
    this._lastMaxHp = this._battler.mhp;
    this._lastMp = this._battler.mp;
    this._lastMaxMp = this._battler.mmp;
    this._lastTp = this._battler.tp;
    this._lastStatesHash = this._battler
      .states()
      .map((s) => s.id)
      .join(",");
    this._displayHp = this._battler.hp;
    this._damageChunkHp = this._battler.hp;
  
    // Load bust image
    this._bustImage = null;
    this._shouldUseBust =
      this._battler.actorId &&
      (this._battler.actorId() === 1 || this._battler.actorId() === 2 || this._battler.actorId() === 3);

    if (this._shouldUseBust) {
      const fallbackImage = ImageManager.loadBitmap('img/faces/', '7');

      // Get bust image path using SPRITES_ASSOCIATION (supports Variables 106-109)
      const bustPath = getBustImagePath(this._battler);

      if (bustPath) {
        try {
          // Parse the bust path to separate directory and filename
          const lastSlashIndex = bustPath.lastIndexOf('/');
          let bustDir, bustFile;

          if (lastSlashIndex > 0) {
            bustDir = bustPath.substring(0, lastSlashIndex + 1);
            bustFile = bustPath.substring(lastSlashIndex + 1);
          } else {
            bustDir = "img/faces/";
            bustFile = bustPath;
          }

          this._bustImage = ImageManager.loadBitmap(bustDir, bustFile);
          if (this._bustImage) {
            this._bustImage.addLoadListener(() => {
              // Check if the image loaded successfully by verifying it has valid dimensions
              if (this._bustImage && this._bustImage.width > 0 && this._bustImage.height > 0) {
                this.refreshSimpleStatus();
              } else {
                // Use fallback if primary image failed
                this._bustImage = fallbackImage;
                fallbackImage.addLoadListener(() => {
                  this.refreshSimpleStatus();
                });
              }
            });
          }
        } catch (error) {
          console.log("Failed to load bust image:", bustPath, "using fallback");
          this._bustImage = fallbackImage;
          fallbackImage.addLoadListener(() => {
            this.refreshSimpleStatus();
          });
        }
      } else {
        // No valid path found, use fallback
        this._bustImage = fallbackImage;
        fallbackImage.addLoadListener(() => {
          this.refreshSimpleStatus();
        });
      }
    }
  
    this.refreshSimpleStatus();
  };
  Sprite_TekkenBar.prototype.triggerDamageFlash = function() {
    if (!this._damageFlashSprite) return;
    
    this._damageFlashTimer = 20; // 20 frames of flash
    
    // Create red overlay
    const bitmap = this._damageFlashSprite.bitmap;
    bitmap.clear();
    bitmap.fillAll("#ff0000"); // Red color
    
    this._damageFlashSprite.visible = true;
    this._damageFlashSprite.opacity = 200;
  };
  // MODIFIED: This now only draws the text and bust image
// MODIFIED: This function creates the animated background for Actors 2 & 3 - covers info/bars area
Sprite_TekkenBar.prototype.createSimpleDisplayBackground = function () {
  // Checkerboard tile bitmap
  const patternBitmap = new Bitmap(128, 128);
  const size = 16;
  const colorA = "#002a2a";
  const colorB = "#060e0e";
  for (let y = 0; y < patternBitmap.height; y += size) {
    for (let x = 0; x < patternBitmap.width; x += size) {
      patternBitmap.fillRect(x, y, size, size, ((x + y) / size) % 2 === 0 ? colorA : colorB);
    }
  }

  // Cover the full card width (including face column)
  const cardW = this._playerCardWidth || 160;
  const cardH = this._playerCardHeight || 190;
  const bgH   = cardH;
  const bgX   = -playerBarX;
  const bgW   = cardW;
  const bgY   = -cardH;

  if (this._isInactiveMember) {
    // Plain solid dark background for reserve/inactive members
    const plainBitmap = new Bitmap(bgW, bgH);
    plainBitmap.fillRect(0, 0, bgW, bgH, "#000000");
    this._backgroundPattern = new Sprite(plainBitmap);
    this._backgroundPattern.x = bgX;
    this._backgroundPattern.y = bgY;
    this._backgroundPattern.opacity = 255;
    this.addChild(this._backgroundPattern);
    return;
  }

  // Solid base background always visible for non-inactive members
  const solidBitmap = new Bitmap(bgW, bgH);
  solidBitmap.fillRect(0, 0, bgW, bgH, "#000000");
  this._solidBackground = new Sprite(solidBitmap);
  this._solidBackground.opacity = 160;
  this._solidBackground.x = bgX;
  this._solidBackground.y = bgY;
  this.addChild(this._solidBackground);

  this._backgroundPattern = new TilingSprite(patternBitmap);
  this._backgroundPattern.move(bgX, bgY, bgW, bgH);
  this._backgroundPattern.opacity = 200;
  this.addChild(this._backgroundPattern);

  const overlayBitmap = new Bitmap(bgW, bgH);
  overlayBitmap.fillAll("rgba(0,0,0,0.35)");
  this._backgroundOverlay = new Sprite(overlayBitmap);
  this._backgroundOverlay.x = bgX;
  this._backgroundOverlay.y = bgY;
  this.addChild(this._backgroundOverlay);
};

// MODIFIED: This now just creates the foreground elements for the simple display
// MODIFIED: This now just creates the foreground elements for the simple display
Sprite_TekkenBar.prototype.refreshSimpleStatus = function () {
  if (!this._simpleStatusDisplay || !this._battler) return;
  const bitmap = this._simpleStatusDisplay.bitmap;
  bitmap.clear();
  const b = this._battler;
  const name = b.name();
  const hp = b.hp;

  bitmap.fontFace = $gameSystem.mainFontFace();
  bitmap.fontSize = 22; // Slightly smaller font for better fit
  bitmap.fontBold = true;
  bitmap.outlineColor = "black";
  bitmap.outlineWidth = 4; // Bolder outline for readability
  const lineHeight = 24;

  // Positioning constants
  const barHeight = 68;
  const totalAreaHeight = this._simpleStatusDisplay.bitmap.height;
  const startY = (totalAreaHeight - barHeight) / 2; // Start drawing within the vertical center
  
  // CHANGED: Start drawing at the very edge (compensate for negative x position)
  let x = 5; // Small padding from the actual screen edge

  if (this._shouldUseBust && this._bustImage && this._bustImage.isReady()) {
    // Calculate bust dimensions: new size is 889x1200, scale to fit in available space
    // Available width is approximately 160px for the bust to leave room for stats
    const maxBustWidth = 160;
    const bustAspectRatio = this._bustImage.width / this._bustImage.height; // 889/1200 ≈ 0.74
    let bustWidth = maxBustWidth;
    let bustHeight = Math.round(maxBustWidth / bustAspectRatio); // Scale height proportionally

    // Cap height to not exceed total bitmap height
    const maxBustHeight = totalAreaHeight - 4;
    if (bustHeight > maxBustHeight) {
      bustHeight = maxBustHeight;
      bustWidth = Math.round(bustHeight * bustAspectRatio);
    }

    const bustY = startY + (barHeight - bustHeight) / 2; // Center bust vertically in the bar
    bitmap.blt(
      this._bustImage,
      0,
      0,
      this._bustImage.width,
      this._bustImage.height,
      x,
      bustY,
      bustWidth,
      bustHeight
    );

    // Position stats to the right of the bust
    const statX = x + bustWidth + 15;

    // Calculate vertical positions for text to be centered
    const nameY = startY + 8;
    const hpY = nameY + lineHeight + 2;

    // Draw character name
    bitmap.textColor = "#ffffff";
    bitmap.drawText(
      name,
      statX,
      nameY,
      bitmap.width - statX,
      lineHeight,
      "left"
    );

    // Draw HP
    const hpRate = hp / Math.max(1, b.mhp);
    let hpNumberColor = "#ffffff";
    if (hpRate <= 0.25) hpNumberColor = "#ff0000"; // Critical
    else if (hpRate <= 0.5) hpNumberColor = "#ffff00"; // Low

    bitmap.textColor = hpNumberColor;
    const hpText = `${hp}/${b.mhp}`;
    bitmap.drawText(
      hpText,
      statX,
      hpY,
      bitmap.width - statX,
      lineHeight,
      "left"
    );

    // Draw "HP" label next to the number
    const hpTextWidth = bitmap.measureTextWidth(hpText);
    bitmap.textColor = playerHPColor1;
    bitmap.drawText(
      " HP",
      statX + hpTextWidth,
      hpY,
      bitmap.width - (statX + hpTextWidth),
      lineHeight,
      "left"
    );

    // Draw status tags on the far right
    const statusTags = getStatusTags(this._battler);
    if (statusTags.length > 0) {
      const statusX = statX + 130;
      const tagsText = statusTags.join(" ");
      bitmap.textColor = "#ffdd99";
      bitmap.drawText(
        `[${tagsText}]`,
        statusX,
        nameY,
        bitmap.width - statusX,
        lineHeight,
        "left"
      );
    }
  } else {
    // Fallback if no bust is available
    bitmap.textColor = "#ffffff";
    bitmap.drawText(
      name,
      x,
      startY + barHeight / 2 - lineHeight / 2,
      bitmap.width,
      lineHeight,
      "left"
    );
  }

  bitmap._baseTexture.update();
};

Sprite_TekkenBar.prototype.refreshSimpleStatus = function () {
  if (!this._simpleStatusDisplay || !this._battler) return;
  const bitmap = this._simpleStatusDisplay.bitmap;
  bitmap.clear();
  const b   = this._battler;
  const W   = bitmap.width;
  const H   = bitmap.height;
  const ctx = bitmap.context;
  const pad = 6;

  // Face column on the left; orb sits right after face, bars start after orb
  const FACE_W    = 110;
  const GAP       = 8;
  const ORB_GAP   = 4;
  const barAreaX  = FACE_W + GAP + tpOrbSize + ORB_GAP;
  const barW      = W - barAreaX - pad;

  // Colors
  const HP_COLOR  = "#ff3333";  const HP_BRIGHT = "#ff8888";  const HP_DARK   = "#660000";
  const MP_COLOR  = "#3399ff";  const MP_BRIGHT = "#88ccff";  const MP_DARK   = "#003388";
  const AP_COLOR  = "#ffcc00";  const AP_BRIGHT = "#ffee77";  const AP_DARK   = "#664400";

  // Portrait – left column, cover-fit vertically
  if (this._shouldUseBust && this._bustImage && this._bustImage.isReady()) {
    const img = this._bustImage;
    const imgAR = img.width / img.height;
    let bw = FACE_W, bh = Math.round(FACE_W / imgAR);
    if (bh > H) { bh = H; bw = Math.round(H * imgAR); }
    bitmap.blt(img, 0, 0, img.width, img.height, 0, 0, bw, bh);
  }

  // Dead overlay
  if (!b.isAlive()) bitmap.fillRect(0, 0, W, H, "rgba(0,0,0,0.6)");

  bitmap.fontFace     = $gameSystem.mainFontFace();
  bitmap.outlineColor = "#000000";
  bitmap.outlineWidth = 3;

  // Character name – top of bar column
  bitmap.fontSize = 10;
  bitmap.fontBold  = false;
  bitmap.textColor = "#dddddd";
  bitmap.drawText(b.name(), barAreaX, 4, barW, 12, "left");

  let curY = 26;

  // Draws one stat row: label | number | angled gradient bar | optional depletion chunk
  // numBelow=true: draws bar first, then number underneath
  const drawRow = (label, value, color, bright, dark, numColor, rate, numH, barH, trackColor, chunkRate = 0, numBelow = false) => {
    if (!numBelow) {
      bitmap.fontSize  = numH >= 18 ? 16 : numH >= 16 ? 15 : 14;
      bitmap.fontBold  = true;
      bitmap.textColor = numColor;
      bitmap.drawText(String(value), barAreaX, curY, barW, numH, "right");
      curY += numH + 2;
    }
    const ang    = barH + 2;
    const fillW  = Math.round(barW * Math.max(0, Math.min(1, rate)));
    const chunkW = Math.round(barW * Math.max(0, Math.min(1, chunkRate)));
    // Track
    ctx.fillStyle = trackColor;
    ctx.beginPath();
    ctx.moveTo(barAreaX,              curY);
    ctx.lineTo(barAreaX + barW,       curY);
    ctx.lineTo(barAreaX + barW - ang, curY + barH);
    ctx.lineTo(barAreaX - ang,        curY + barH);
    ctx.closePath();
    ctx.fill();
    // Depletion chunk (white trailing section)
    if (chunkW > fillW) {
      ctx.fillStyle = damageColor;
      ctx.beginPath();
      ctx.moveTo(barAreaX + fillW,         curY);
      ctx.lineTo(barAreaX + chunkW,        curY);
      ctx.lineTo(barAreaX + chunkW - ang,  curY + barH);
      ctx.lineTo(barAreaX + fillW  - ang,  curY + barH);
      ctx.closePath();
      ctx.fill();
    }
    // Fill with horizontal gradient
    if (fillW > 0) {
      const grad = ctx.createLinearGradient(barAreaX, 0, barAreaX + barW, 0);
      grad.addColorStop(0,   dark);
      grad.addColorStop(0.3, color);
      grad.addColorStop(0.65, bright);
      grad.addColorStop(1,   dark);
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.moveTo(barAreaX,               curY);
      ctx.lineTo(barAreaX + fillW,       curY);
      ctx.lineTo(barAreaX + fillW - ang, curY + barH);
      ctx.lineTo(barAreaX - ang,         curY + barH);
      ctx.closePath();
      ctx.fill();
      // Shine strip
      const hiH   = Math.max(1, Math.floor(barH / 2));
      const hiAng = Math.floor(ang / 2);
      ctx.save();
      ctx.globalAlpha = 0.28;
      ctx.fillStyle = "#ffffff";
      ctx.beginPath();
      ctx.moveTo(barAreaX,                 curY);
      ctx.lineTo(barAreaX + fillW,         curY);
      ctx.lineTo(barAreaX + fillW - hiAng, curY + hiH);
      ctx.lineTo(barAreaX - hiAng,         curY + hiH);
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    }
    curY += barH + (numBelow ? 2 : 4);
    if (numBelow) {
      bitmap.fontSize  = numH >= 18 ? 16 : numH >= 16 ? 15 : 14;
      bitmap.fontBold  = true;
      bitmap.textColor = numColor;
      bitmap.drawText(String(value), barAreaX, curY, barW, numH, "right");
      curY += numH + 4;
    }
  };

  // HP
  const hpDisplayRate = (this._displayHp   || b.hp) / Math.max(1, b.mhp);
  const hpChunkRate   = (this._damageChunkHp || b.hp) / Math.max(1, b.mhp);
  const hpRate = b.hp / Math.max(1, b.mhp);
  let hpNumColor = "#ffffff";
  if (hpRate <= 0.25) hpNumColor = "#ff4444";
  else if (hpRate <= 0.5) hpNumColor = "#ffff00";
  drawRow("HP", b.hp, HP_COLOR, HP_BRIGHT, HP_DARK, hpNumColor, hpDisplayRate, 20, 10, "rgba(100,0,0,0.4)", hpChunkRate);

  // MP – bar drawn close below HP bar, number below MP bar
  drawRow("MP", b.mp, MP_COLOR, MP_BRIGHT, MP_DARK, "#ffffff", b.mp / Math.max(1, b.mmp), 18, 10, "rgba(0,40,110,0.4)", 0, true);

  bitmap._baseTexture.update();
};

// (legacy stubs kept for compatibility)
Sprite_TekkenBar.prototype._drawVerticalCard = function (bitmap, b, cardWidth, cardHeight) {
  const name = b.name();
  const hp = b.hp;
  const mp = b.mp;
  const tp = b.tp;

  // ===== TOP SECTION: Name and Level =====
  const nameY = 6;
  bitmap.fontSize = 14;
  bitmap.fontBold = true;
  bitmap.textColor = "#ffffff";
  const actorLevel = b.level ? ` L.${b.level}` : "";
  const nameWithLevel = name + actorLevel;
  bitmap.drawText(nameWithLevel, 10, nameY, cardWidth - 20, 18, "center");

  // ===== DIVIDER =====
  const divider1Y = 27;
  bitmap.fillRect(10, divider1Y, cardWidth - 20, 1, "#444444");

  // ===== MIDDLE SECTION: Bust Image =====
  if (this._shouldUseBust && this._bustImage && this._bustImage.isReady()) {
    const imageAreaY = 32;
    const imageAreaHeight = 135;

    const maxBustWidth = cardWidth - 20;
    const maxBustHeight = imageAreaHeight - 10;
    const bustAspectRatio = this._bustImage.width / this._bustImage.height;

    let bustWidth = maxBustWidth;
    let bustHeight = Math.round(maxBustWidth / bustAspectRatio);

    if (bustHeight > maxBustHeight) {
      bustHeight = maxBustHeight;
      bustWidth = Math.round(bustHeight * bustAspectRatio);
    }

    const bustX = Math.floor((cardWidth - bustWidth) / 2);
    const bustY = imageAreaY + Math.floor((imageAreaHeight - bustHeight) / 2);

    bitmap.blt(
      this._bustImage,
      0,
      0,
      this._bustImage.width,
      this._bustImage.height,
      bustX,
      bustY,
      bustWidth,
      bustHeight
    );
  }

  // ===== DIVIDER 2 =====
  const divider2Y = 172;
  bitmap.fillRect(10, divider2Y, cardWidth - 20, 1, "#444444");

  // ===== BOTTOM SECTION: Stats Numbers Only =====
  const statsStartY = 180;
  bitmap.fontSize = 12;
  bitmap.fontBold = true;

  // HP
  const hpRate = hp / Math.max(1, b.mhp);
  let hpColor = "#00ff00";
  if (hpRate <= 0.25) hpColor = "#ff0000";
  else if (hpRate <= 0.5) hpColor = "#ffff00";

  bitmap.textColor = hpColor;
  const hpText = `${hp} HP`;
  bitmap.drawText(hpText, 12, statsStartY, cardWidth - 24, 18, "left");

  // MP
  bitmap.textColor = mpBarColor1;
  const mpText = `${mp} MP`;
  bitmap.drawText(mpText, 12, statsStartY + 28, cardWidth - 24, 18, "left");

  // TP
  bitmap.textColor = tpColor1;
  const tpText = `${Math.floor(tp)} AP`;
  bitmap.drawText(tpText, 12, statsStartY + 54, cardWidth - 24, 18, "left");
};

// HELPER: Draw horizontal rectangle layout for 4:3 aspect ratio
Sprite_TekkenBar.prototype._drawHorizontalCard = function (bitmap, b, cardWidth, cardHeight) {
  const name = b.name();
  const hp = b.hp;
  const mp = b.mp;
  const tp = b.tp;

  // Face on the left side
  const faceSize = cardHeight - 12;
  if (this._shouldUseBust && this._bustImage && this._bustImage.isReady()) {
    const bustAspectRatio = this._bustImage.width / this._bustImage.height;
    let bustWidth = faceSreize;
    let bustHeight = Math.round(faceSize / bustAspectRatio);

    if (bustHeight > faceSize) {
      bustHeight = faceSize;
      bustWidth = Math.round(faceSize * bustAspectRatio);
    }

    const bustX = 6 + Math.floor((faceSize - bustWidth) / 2);
    const bustY = 6 + Math.floor((faceSize - bustHeight) / 2);

    bitmap.blt(
      this._bustImage,
      0,
      0,
      this._bustImage.width,
      this._bustImage.height,
      bustX,
      bustY,
      bustWidth,
      bustHeight
    );
  }

  // Stats on the right side
  const statsX = faceSize + 15;
  const statsStartY = 8;

  // Name and Level
  bitmap.fontSize = 13;
  bitmap.fontBold = true;
  bitmap.textColor = "#ffffff";
  const actorLevel = b.level ? ` L.${b.level}` : "";
  const nameWithLevel = name + actorLevel;
  bitmap.drawText(nameWithLevel, statsX, statsStartY, cardWidth - statsX - 10, 16, "left");

  // HP
  const hpRate = hp / Math.max(1, b.mhp);
  let hpColor = "#00ff00";
  if (hpRate <= 0.25) hpColor = "#ff0000";
  else if (hpRate <= 0.5) hpColor = "#ffff00";

  bitmap.fontSize = 11;
  bitmap.textColor = hpColor;
  const hpText = `${hp} HP`;
  bitmap.drawText(hpText, statsX, statsStartY + 28, cardWidth - statsX - 10, 14, "left");

  // MP
  bitmap.textColor = mpBarColor1;
  const mpText = `${mp} MP`;
  bitmap.drawText(mpText, statsX, statsStartY + 50, cardWidth - statsX - 10, 14, "left");

  // TP
  bitmap.textColor = tpColor1;
  const tpText = `${Math.floor(tp)} AP`;
  bitmap.drawText(tpText, statsX, statsStartY + 72, cardWidth - statsX - 10, 14, "left");
};
})();

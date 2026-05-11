/*:
 * @target MZ
 * @plugindesc Creature creation system for character creation flow
 * @author Omni-Lex
 * @orderAfter Health_Core
 * @orderAfter CharacterCreation
 *
 * @help
 * This plugin provides a creature creation interface that integrates
 * with the character creation flow. It allows players to create custom
 * creatures by selecting:
 * - Archetype (baseline or hybrid)
 * - Battler image
 * - Character sprite
 *
 * The system automatically integrates with the Health_Core archetype
 * system and returns to the trait selection after completion.
 */

(() => {
  const pluginName = "CharacterCreationCreature";

  // Helper function to get translated text
  function getTranslatedText(englishText, italianText) {
    return ConfigManager.language === "it" ? italianText : englishText;
  }

  // ============================================================================
  // Window_ArchetypeSelect - List of available archetypes
  // ============================================================================
  function Window_ArchetypeSelect() {
    this.initialize(...arguments);
  }

  Window_ArchetypeSelect.prototype = Object.create(Window_Selectable.prototype);
  Window_ArchetypeSelect.prototype.constructor = Window_ArchetypeSelect;

  Window_ArchetypeSelect.prototype.initialize = function (rect) {
    Window_Selectable.prototype.initialize.call(this, rect);
    this._data = [];
    this.refresh();
  };

  Window_ArchetypeSelect.prototype.maxCols = function () {
    return 1;
  };

  Window_ArchetypeSelect.prototype.maxItems = function () {
    return this._data ? this._data.length : 0;
  };

  Window_ArchetypeSelect.prototype.item = function () {
    return this._data && this.index() >= 0 ? this._data[this.index()] : null;
  };

  Window_ArchetypeSelect.prototype.makeItemList = function () {
    this._data = [];
    const { EnemyArchetypes } = window.Health || {};
    if (EnemyArchetypes) {
      for (const key in EnemyArchetypes) {
        this._data.push({
          key: key,
          name: window.getArchetypeText(`enemyArchetypes.${key.toLowerCase()}.name`) || key
        });
      }
    }
  };

  Window_ArchetypeSelect.prototype.drawItem = function (index) {
    const item = this._data[index];
    if (item) {
      const rect = this.itemLineRect(index);
      this.drawText(item.name, rect.x, rect.y, rect.width);
    }
  };

  Window_ArchetypeSelect.prototype.refresh = function () {
    this.makeItemList();
    Window_Selectable.prototype.refresh.call(this);
  };

  // Patch to call 'select' handler for live updates
  const _Window_ArchetypeSelect_select = Window_ArchetypeSelect.prototype.select;
  Window_ArchetypeSelect.prototype.select = function (index) {
    _Window_ArchetypeSelect_select.call(this, index);
    if (this.isHandled('select')) {
      this.callHandler('select');
    }
  };

  // ============================================================================
  // Window_BattlerList - List of battler images
  // ============================================================================
  function Window_BattlerList() {
    this.initialize(...arguments);
  }

  Window_BattlerList.prototype = Object.create(Window_Selectable.prototype);
  Window_BattlerList.prototype.constructor = Window_BattlerList;

  Window_BattlerList.prototype.initialize = function (rect) {
    this._data = [];
    this._archetypes = [];
    Window_Selectable.prototype.initialize.call(this, rect);
  };

  Window_BattlerList.prototype.setArchetypes = function (archetypes) {
    this._archetypes = archetypes || [];
    this.refresh();
  };

  Window_BattlerList.prototype.maxCols = function () {
    return 1;
  };

  Window_BattlerList.prototype.maxItems = function () {
    return this._data ? this._data.length : 0;
  };

  Window_BattlerList.prototype.itemHeight = function () {
    return this.lineHeight();
  };

  Window_BattlerList.prototype.makeItemList = function () {
    this._data = [];
    if (!$dataEnemies) return;

    for (const enemy of $dataEnemies) {
      if (!enemy || !enemy.name) continue;

      const note = enemy.note || "";
      const archetypeMatch = note.match(/<Archetype:\s*(.*?)>/);
      if (archetypeMatch) {
        const arch = archetypeMatch[1].trim();
        if (this._archetypes.length === 0 || this._archetypes.includes(arch)) {
          // Avoid duplicate battlers if they have the same name (optional, but cleaner)
          // Actually, different enemies might have the same name but different battlers, 
          // or same battler but different names. Let's keep them all for variety unless identical.
          this._data.push({
            name: enemy.name,
            battlerName: enemy.battlerName
          });
        }
      }
    }

    // Sort alphabetically by enemy name
    this._data.sort((a, b) => a.name.localeCompare(b.name));
  };

  Window_BattlerList.prototype.item = function () {
    return this._data[this.index()];
  };

  Window_BattlerList.prototype.drawItem = function (index) {
    const item = this._data[index];
    if (item) {
      const rect = this.itemLineRect(index);
      this.drawText(item.name, rect.x, rect.y, rect.width);
    }
  };

  Window_BattlerList.prototype.refresh = function () {
    this.makeItemList();
    this.contents.clear();
    this.drawAllItems();
  };

  Window_BattlerList.prototype.select = function (index) {
    Window_Selectable.prototype.select.call(this, index);
    // Trigger the select handler when selection changes
    if (this.isHandled('select')) {
      this.callHandler('select');
    }
  };

  // ============================================================================
  // Window_BattlerPreview - Preview of selected battler
  // ============================================================================
  function Window_BattlerPreview() {
    this.initialize(...arguments);
  }

  Window_BattlerPreview.prototype = Object.create(Window_Base.prototype);
  Window_BattlerPreview.prototype.constructor = Window_BattlerPreview;

  Window_BattlerPreview.prototype.initialize = function (rect) {
    Window_Base.prototype.initialize.call(this, rect);
    this._currentBattler = null;
  };

  Window_BattlerPreview.prototype.setBattler = function (filename) {
    if (this._currentBattler !== filename) {
      this._currentBattler = filename;
      this.refresh();
    }
  };

  Window_BattlerPreview.prototype.refresh = function () {
    this.contents.clear();

    if (!this._currentBattler) {
      this.drawText(getTranslatedText('Select a battler', 'Seleziona un battler'), 0, 0, this.contentsWidth(), 'center');
      return;
    }

    const bitmap = ImageManager.loadEnemy(this._currentBattler);
    if (!bitmap.isReady()) {
      bitmap.addLoadListener(() => this.refresh());
      return;
    }

    // Draw the battler image centered in the preview window
    const maxWidth = this.contentsWidth() - 16;
    const maxHeight = this.contentsHeight() - 16;

    // Calculate aspect ratio and scale accordingly
    const scale = Math.min(maxWidth / bitmap.width, maxHeight / bitmap.height);
    const scaledWidth = Math.floor(bitmap.width * scale);
    const scaledHeight = Math.floor(bitmap.height * scale);

    // Center the battler in the window
    const x = Math.floor((this.contentsWidth() - scaledWidth) / 2);
    const y = Math.floor((this.contentsHeight() - scaledHeight) / 2);

    // Draw the battler image
    this.contents.blt(
      bitmap,
      0, 0, bitmap.width, bitmap.height,
      x, y, scaledWidth, scaledHeight
    );
  };

  // ============================================================================
  // Animal sprite entries moved from CharacterSpriteGridSelector
  // isAnimal: true → drawn without forced fixed direction
  // ============================================================================
  const ANIMAL_SPRITE_ENTRIES = [
    { displayName: 'Animals01Color_0', path: 'Animals01Color', index: 0 },
    { displayName: 'Animals01Color_1', path: 'Animals01Color', index: 1 },
    { displayName: 'Animals01Color_2', path: 'Animals01Color', index: 2 },
    { displayName: 'Animals01Color_3', path: 'Animals01Color', index: 3 },
    { displayName: 'Animals01Color_4', path: 'Animals01Color', index: 4 },
    { displayName: 'FarmAnimals01RM_0', path: 'FarmAnimals01RM', index: 0 },
    { displayName: 'FarmAnimals01RM_1', path: 'FarmAnimals01RM', index: 1 },
    { displayName: 'FarmAnimals01RM_2', path: 'FarmAnimals01RM', index: 2 },
    { displayName: 'FarmAnimals01RM_3', path: 'FarmAnimals01RM', index: 3 },
    { displayName: 'FarmAnimals01RM_4', path: 'FarmAnimals01RM', index: 4 },
    { displayName: 'FarmAnimals01RM_5', path: 'FarmAnimals01RM', index: 5 },
    { displayName: 'FarmAnimals01RM_6', path: 'FarmAnimals01RM', index: 6 },
    { displayName: 'FarmAnimals01RM_7', path: 'FarmAnimals01RM', index: 7 },
    { displayName: 'FarmAnimals02RM_0', path: 'FarmAnimals02RM', index: 0 },
    { displayName: 'FarmAnimals02RM_1', path: 'FarmAnimals02RM', index: 1 },
    { displayName: 'FarmAnimals02RM_2', path: 'FarmAnimals02RM', index: 2 },
    { displayName: 'FarmAnimals02RM_3', path: 'FarmAnimals02RM', index: 3 },
    { displayName: 'FarmAnimals02RM_4', path: 'FarmAnimals02RM', index: 4 },
    { displayName: 'FarmAnimals02RM_5', path: 'FarmAnimals02RM', index: 5 },
    { displayName: 'FarmAnimals02RM_6', path: 'FarmAnimals02RM', index: 6 },
    { displayName: 'FarmAnimals02RM_7', path: 'FarmAnimals02RM', index: 7 },
    { displayName: 'MV_Chick', path: 'Animals/!$MV_Chick', index: 0 },
    { displayName: 'MV_Chicken_1', path: 'Animals/!$MV_Chicken_1', index: 0 },
    { displayName: 'MV_Chicken_2', path: 'Animals/!$MV_Chicken_2', index: 0 },
    { displayName: 'MV_Chicken_3', path: 'Animals/!$MV_Chicken_3', index: 0 },
    { displayName: 'MV_Chicken_4', path: 'Animals/!$MV_Chicken_4', index: 0 },
    { displayName: 'MV_Chicken_5', path: 'Animals/!$MV_Chicken_5', index: 0 },
    { displayName: 'MV_Chicken_6', path: 'Animals/!$MV_Chicken_6', index: 0 },
    { displayName: 'MV_Chicken_7', path: 'Animals/!$MV_Chicken_7', index: 0 },
    { displayName: 'MV_Chicken_Old', path: 'Animals/!$MV_Chicken_Old', index: 0 },
    { displayName: 'MV_Cow_Baby_1', path: 'Animals/!$MV_Cow_Baby_1', index: 0 },
    { displayName: 'MV_Cow_Baby_2', path: 'Animals/!$MV_Cow_Baby_2', index: 0 },
    { displayName: 'MV_Duckling_1', path: 'Animals/!$MV_Duckling_1', index: 0 },
    { displayName: 'MV_Duckling_2', path: 'Animals/!$MV_Duckling_2', index: 0 },
    { displayName: 'MV_Goat_Baby_1', path: 'Animals/!$MV_Goat_Baby_1', index: 0 },
    { displayName: 'MV_Goat_Baby_2', path: 'Animals/!$MV_Goat_Baby_2', index: 0 },
    { displayName: 'MV_Piglet_1', path: 'Animals/!$MV_Piglet_1', index: 0 },
    { displayName: 'MV_Piglet_2', path: 'Animals/!$MV_Piglet_2', index: 0 },
  ];

  // ============================================================================
  // Window_CharacterSelect - Grid of character sprites (monsters + animals)
  // ============================================================================
  function Window_CharacterSelect() {
    this.initialize(...arguments);
  }

  Window_CharacterSelect.prototype = Object.create(Window_Selectable.prototype);
  Window_CharacterSelect.prototype.constructor = Window_CharacterSelect;

  Window_CharacterSelect.prototype.initialize = function (rect) {
    this._images = [];  // array of { displayName, path, index, isAnimal }
    this._bitmaps = [];
    this._archetypes = [];
    Window_Selectable.prototype.initialize.call(this, rect);
    this.loadImages();
  };

  Window_CharacterSelect.prototype.setArchetypes = function (archetypes) {
    this._archetypes = archetypes || [];
    this.loadImages();
  };

  Window_CharacterSelect.prototype.maxCols = function () {
    return 4;
  };

  Window_CharacterSelect.prototype.maxItems = function () {
    return this._images.length;
  };

  Window_CharacterSelect.prototype.itemHeight = function () {
    return 120;
  };

  Window_CharacterSelect.prototype.loadImages = function () {
    this._images = [];
    this._bitmaps = [];

    const formatName = (name) => {
      let n = name.replace(/[\$!]/g, '')
                 .replace(/([a-z0-9])([A-Z])/g, '$1 $2');
      const words = n.split(' ');
      if (words.length >= 2) {
        words.shift();
      }
      return words.join(' ');
    };

    const entries = [];

    const { EnemyArchetypes } = window.Health || {};
    const allowedSprites = new Set();
    if (EnemyArchetypes && this._archetypes.length > 0) {
      for (const archKey of this._archetypes) {
        const arch = EnemyArchetypes[archKey];
        if (arch && arch.sprites) {
          arch.sprites.forEach(s => allowedSprites.add(s));
        }
      }
    }

    // Load monster sprites from img/characters/Monsters/
    const fs = require('fs');
    const path = require('path');
    const monstersPath = path.join(path.dirname(process.mainModule.filename), 'img/characters/Monsters/');

    try {
      const files = fs.readdirSync(monstersPath);
      for (const file of files) {
        const filePath = path.join(monstersPath, file);
        if (fs.statSync(filePath).isFile() && /\.(png|jpg|jpeg)$/i.test(file)) {
          const name = file.replace(/\.(png|jpg|jpeg)$/i, '');
          const normalizedName = name.replace(/^[\$!]/, '');
          
          // Only include if in allowedSprites or if no archetypes were provided (default behavior)
          if (this._archetypes.length === 0 || allowedSprites.has(normalizedName)) {
            entries.push({ displayName: formatName(name), path: 'Monsters/' + name, index: 0, isAnimal: false });
          }
        }
      }
    } catch (error) {
      console.error('Error loading monster character images:', error);
    }

    // Add animal sprites only if no specific archetype filter is active or if specifically allowed
    // For now, we only show animals if no archetype filter is active
    if (this._archetypes.length === 0) {
      for (const a of ANIMAL_SPRITE_ENTRIES) {
        entries.push({ displayName: formatName(a.displayName), path: a.path, index: a.index, isAnimal: true });
      }
    }

    // Sort all entries alphabetically by displayName (case-insensitive)
    entries.sort((a, b) => a.displayName.localeCompare(b.displayName, undefined, { sensitivity: 'base' }));

    this._images = entries;
    this._bitmaps = entries.map(e => ImageManager.loadCharacter(e.path));

    this.refresh();
  };

  Window_CharacterSelect.prototype.item = function () {
    return this._images[this.index()] || null;
  };

  Window_CharacterSelect.prototype.drawItem = function (index) {
    if (index < 0 || index >= this._images.length) return;

    const entry = this._images[index];
    const rect = this.itemRect(index);
    const bitmap = this._bitmaps[index];

    if (!bitmap) return;
    if (!bitmap.isReady()) {
      bitmap.addLoadListener(() => this.redrawItem(index));
      return;
    }

    let pw, ph, sx, sy;

    if (entry.isAnimal) {
      // Animals: respect isBigCharacter flag, no hardcoded frame/direction forcing
      const big = ImageManager.isBigCharacter(entry.path);
      if (big) {
        // !$ single big character: 3 frames × 4 directions
        pw = bitmap.width / 3;
        ph = bitmap.height / 4;
        const pattern = 1;                  // standing frame
        const dirRow = 0;                   // row 0 = facing down
        sx = pattern * pw;
        sy = dirRow * ph;
      } else {
        // Multi-character sheet: 12 columns × 8 rows
        pw = bitmap.width / 12;
        ph = bitmap.height / 8;
        const ci = entry.index;
        const pattern = 1;
        sx = ((ci % 4) * 3 + pattern) * pw;
        sy = (Math.floor(ci / 4) * 4) * ph;  // row 0 within character = facing down
      }
    } else {
      // Monsters: forced middle column, facing down (existing behaviour)
      pw = bitmap.width / 3;
      ph = bitmap.height / 4;
      sx = pw;   // column 1
      sy = 0;    // row 0 = facing down
    }

    // Sprite drawing area (top part)
    const textHeight = 24;
    const spriteRectHeight = rect.height - textHeight;
    const scale = Math.min((rect.width - 8) / pw, (spriteRectHeight - 8) / ph, 1.0);
    const dw = pw * scale;
    const dh = ph * scale;
    const dx = rect.x + (rect.width - dw) / 2;
    const dy = rect.y + (spriteRectHeight - dh) / 2;

    this.contents.blt(bitmap, sx, sy, pw, ph, dx, dy, dw, dh);

    // Name drawing area (bottom part)
    const oldFontSize = this.contents.fontSize;
    this.contents.fontSize = 14;
    this.drawText(entry.displayName, rect.x, rect.y + spriteRectHeight, rect.width, 'center');
    this.contents.fontSize = oldFontSize;
  };

  Window_CharacterSelect.prototype.refresh = function () {
    this.contents.clear();
    this.drawAllItems();
  };

  Window_CharacterSelect.prototype.update = function () {
    Window_Selectable.prototype.update.call(this);
  };

  // ============================================================================
  // Window_CreateCreatureMode - Baseline/Hybrid choice
  // ============================================================================
  function Window_CreateCreatureMode() {
    this.initialize(...arguments);
  }

  Window_CreateCreatureMode.prototype = Object.create(Window_Command.prototype);
  Window_CreateCreatureMode.prototype.constructor = Window_CreateCreatureMode;

  Window_CreateCreatureMode.prototype.initialize = function (rect) {
    Window_Command.prototype.initialize.call(this, rect);
  };

  Window_CreateCreatureMode.prototype.makeCommandList = function () {
    this.addCommand(getTranslatedText("Baseline", "Base"), "baseline");
    this.addCommand(getTranslatedText("Hybrid", "Ibrido"), "hybrid");
  };

  // ============================================================================
  // Window_ArchetypeParts - Display archetype parts
  // ============================================================================
  function Window_ArchetypeParts() {
    this.initialize(...arguments);
  }

  Window_ArchetypeParts.prototype = Object.create(Window_Base.prototype);
  Window_ArchetypeParts.prototype.constructor = Window_ArchetypeParts;

  Window_ArchetypeParts.prototype.initialize = function (rect) {
    Window_Base.prototype.initialize.call(this, rect);
    this._arch1Key = null;
    this._arch2Key = null;
  };

  Window_ArchetypeParts.prototype.setArchetypes = function (arch1Key, arch2Key) {
    if (this._arch1Key !== arch1Key || this._arch2Key !== arch2Key) {
      this._arch1Key = arch1Key;
      this._arch2Key = arch2Key;
      this.refresh();
    }
  };

  Window_ArchetypeParts.prototype.refresh = function () {
    this.contents.clear();
    const { EnemyArchetypes } = window.Health || {};
    if (!EnemyArchetypes) return;

    const arch1 = this._arch1Key ? EnemyArchetypes[this._arch1Key] : null;
    const arch2 = this._arch2Key ? EnemyArchetypes[this._arch2Key] : null;

    if (!arch1 && !arch2) {
      this.drawText(getTranslatedText("Select an archetype...", "Seleziona un archetipo..."), 0, 0, this.contentsWidth(), "center");
      return;
    }

    const mergedParts = {};

    // Add parts from Arch 1
    if (arch1) {
      for (const partKey in arch1.parts) {
        mergedParts[partKey] = { part: arch1.parts[partKey], from: 1 };
      }
    }
    // Add/overwrite parts from Arch 2
    if (arch2) {
      for (const partKey in arch2.parts) {
        mergedParts[partKey] = { part: arch2.parts[partKey], from: 2 };
      }
    }

    let y = 0;
    const lineHeight = this.lineHeight();
    const titleWidth = this.contentsWidth() / 2;

    // Draw Titles
    if (arch1) {
      this.changeTextColor(ColorManager.systemColor());
      const arch1Name = window.getArchetypeText(`enemyArchetypes.${this._arch1Key.toLowerCase()}.name`) || this._arch1Key;
      this.drawText(arch1Name, 0, y, titleWidth);
      this.resetTextColor();
    }
    if (arch2) {
      this.changeTextColor(ColorManager.crisisColor());
      const arch2Name = window.getArchetypeText(`enemyArchetypes.${this._arch2Key.toLowerCase()}.name`) || this._arch2Key;
      this.drawText(arch2Name, titleWidth, y, titleWidth);
      this.resetTextColor();
    }
    y += lineHeight + 4;
    this.contents.fillRect(0, y - 2, this.contentsWidth(), 2, ColorManager.gaugeBackColor());

    // Draw Merged Part List
    for (const partKey in mergedParts) {
      const { part, from } = mergedParts[partKey];
      const name = window.getArchetypeText(part.name);

      // Color-code based on origin
      if (from === 2) {
        // From Arch 2 (or overwrite)
        this.changeTextColor(ColorManager.crisisColor());
      } else {
        // From Arch 1
        this.changeTextColor(ColorManager.normalColor());
      }

      this.drawText(name, 0, y, this.contentsWidth());
      y += lineHeight;

      // Stop if window is full
      if (y > this.contentsHeight() - lineHeight) {
        this.drawText("...", 0, y, this.contentsWidth());
        break;
      }
    }

    this.resetTextColor();
  };

  // ============================================================================
  // Scene_CreateCreature - Main creature creation scene
  // ============================================================================
  function Scene_CreateCreature() {
    this.initialize(...arguments);
  }

  Scene_CreateCreature.prototype = Object.create(Scene_MenuBase.prototype);
  Scene_CreateCreature.prototype.constructor = Scene_CreateCreature;

  // Static method to set target actor ID before opening the scene
  Scene_CreateCreature.setTargetActorId = function (actorId) {
    Scene_CreateCreature._targetActorId = actorId || 1;
  };

  Scene_CreateCreature.prototype.initialize = function () {
    Scene_MenuBase.prototype.initialize.call(this);
    this._selectedArchetype1 = null;
    this._selectedArchetype2 = null;
    this._selectedBattler = null;
    this._selectedCharacter = null;
    this._mode = 'baseline'; // 'baseline' or 'hybrid'
    this._step = 0; // 0 = mode, 1 = arch1, 2 = arch2, 3 = battler, 4 = character
    this._targetActorId = Scene_CreateCreature._targetActorId || 1; // Target actor ID (default: 1, can be 1, 2, or 3)
  };

  Scene_CreateCreature.prototype.create = function () {
    Scene_MenuBase.prototype.create.call(this);
    this.createHelpWindow();
    this.createModeWindow();
    this.createArchetypeWindow();
    this.createArchetypePartsWindow();
    this.createBattlerWindow();
    this.createCharacterWindow();
    this.showStep(0);
  };

  // --- Window Creation ---

  Scene_CreateCreature.prototype.createHelpWindow = function () {
    const rect = this.helpWindowRect();
    this._helpWindow = new Window_Help(rect);
    this.addWindow(this._helpWindow);
  };

  Scene_CreateCreature.prototype.createModeWindow = function () {
    const rect = this.modeWindowRect();
    this._modeWindow = new Window_CreateCreatureMode(rect);
    this._modeWindow.setHandler('baseline', this.onModeSelect.bind(this, 'baseline'));
    this._modeWindow.setHandler('hybrid', this.onModeSelect.bind(this, 'hybrid'));
    this._modeWindow.setHandler('cancel', this.popScene.bind(this));
    this.addWindow(this._modeWindow);
  };

  Scene_CreateCreature.prototype.createArchetypeWindow = function () {
    const rect = this.archetypeListRect();
    this._archetypeWindow = new Window_ArchetypeSelect(rect);
    this._archetypeWindow.setHandler('ok', this.onArchetypeOk.bind(this));
    this._archetypeWindow.setHandler('cancel', this.onArchetypeCancel.bind(this));
    this._archetypeWindow.setHandler('select', this.onArchetypeSelect.bind(this));
    this.addWindow(this._archetypeWindow);
  };

  Scene_CreateCreature.prototype.createArchetypePartsWindow = function () {
    const rect = this.archetypePartsRect();
    this._archetypePartsWindow = new Window_ArchetypeParts(rect);
    this.addWindow(this._archetypePartsWindow);
  };

  Scene_CreateCreature.prototype.createBattlerWindow = function () {
    const listRect = this.battlerListRect();
    this._battlerListWindow = new Window_BattlerList(listRect);
    this._battlerListWindow.setHandler('ok', this.onBattlerOk.bind(this));
    this._battlerListWindow.setHandler('cancel', this.onBattlerCancel.bind(this));
    this._battlerListWindow.setHandler('select', this.onBattlerSelect.bind(this));
    this.addWindow(this._battlerListWindow);

    const previewRect = this.battlerPreviewRect();
    this._battlerPreviewWindow = new Window_BattlerPreview(previewRect);
    this.addWindow(this._battlerPreviewWindow);
  };

  Scene_CreateCreature.prototype.createCharacterWindow = function () {
    const rect = this.fullMainWindowRect();
    this._characterWindow = new Window_CharacterSelect(rect);
    this._characterWindow.setHandler('ok', this.onCharacterOk.bind(this));
    this._characterWindow.setHandler('cancel', this.onCharacterCancel.bind(this));
    this.addWindow(this._characterWindow);
  };

  // --- Window Rects ---

  Scene_CreateCreature.prototype.helpWindowRect = function () {
    const ww = Graphics.boxWidth;
    const wh = this.calcWindowHeight(2, false);
    return new Rectangle(0, 0, ww, wh);
  };

  Scene_CreateCreature.prototype.modeWindowRect = function () {
    const ww = 240;
    const wh = this.calcWindowHeight(2, true);
    const wx = (Graphics.boxWidth - ww) / 2;
    const wy = (Graphics.boxHeight - wh) / 2;
    return new Rectangle(wx, wy, ww, wh);
  };

  Scene_CreateCreature.prototype.mainRectY = function () {
    return this._helpWindow.y + this._helpWindow.height;
  }

  Scene_CreateCreature.prototype.mainRectHeight = function () {
    return Graphics.boxHeight - this.mainRectY();
  }

  Scene_CreateCreature.prototype.archetypeListRect = function () {
    const wy = this.mainRectY();
    const wh = this.mainRectHeight();
    const ww = Math.floor(Graphics.boxWidth * 0.5);
    return new Rectangle(0, wy, ww, wh);
  };

  Scene_CreateCreature.prototype.archetypePartsRect = function () {
    const wy = this.mainRectY();
    const wh = this.mainRectHeight();
    const ww = Graphics.boxWidth - Math.floor(Graphics.boxWidth * 0.5);
    const wx = Graphics.boxWidth - ww;
    return new Rectangle(wx, wy, ww, wh);
  };

  Scene_CreateCreature.prototype.fullMainWindowRect = function () {
    const wy = this.mainRectY();
    const wh = this.mainRectHeight();
    return new Rectangle(0, wy, Graphics.boxWidth, wh);
  };

  Scene_CreateCreature.prototype.battlerListRect = function () {
    const wy = this.mainRectY();
    const wh = this.mainRectHeight();
    const ww = Math.floor(Graphics.boxWidth * 0.3);
    return new Rectangle(0, wy, ww, wh);
  };

  Scene_CreateCreature.prototype.battlerPreviewRect = function () {
    const wy = this.mainRectY();
    const wh = this.mainRectHeight();
    const ww = Graphics.boxWidth - Math.floor(Graphics.boxWidth * 0.3);
    const wx = Graphics.boxWidth - ww;
    return new Rectangle(wx, wy, ww, wh);
  };

  // --- Step Management ---

  Scene_CreateCreature.prototype.showStep = function (step) {
    this._step = step;

    // Hide all windows
    this._modeWindow.hide();
    this._modeWindow.deactivate();

    this._archetypeWindow.hide();
    this._archetypeWindow.deactivate();

    this._archetypePartsWindow.hide();

    this._battlerListWindow.hide();
    this._battlerListWindow.deactivate();
    this._battlerPreviewWindow.hide();

    this._characterWindow.hide();
    this._characterWindow.deactivate();

    switch (step) {
      case 0: // Mode Select
        this._helpWindow.setText(getTranslatedText('Select Creation Mode', 'Seleziona Modalità'));
        this._modeWindow.show();
        this._modeWindow.activate();
        this._modeWindow.select(0);
        break;
      case 1: // Archetype 1
        this._helpWindow.setText(getTranslatedText('Select Base Archetype', 'Seleziona Archetipo Base'));
        this._archetypeWindow.show();
        this._archetypeWindow.activate();
        this._archetypeWindow.select(0);
        this._archetypePartsWindow.setArchetypes(null, null);
        this._archetypePartsWindow.show();
        this.onArchetypeSelect(); // Update parts list for first item
        break;
      case 2: // Archetype 2 (Hybrid only)
        this._helpWindow.setText(getTranslatedText('Select Hybrid Archetype', 'Seleziona Archetipo Ibrido'));
        this._archetypeWindow.show();
        this._archetypeWindow.activate();
        this._archetypeWindow.select(0);
        this._archetypePartsWindow.setArchetypes(this._selectedArchetype1, null);
        this._archetypePartsWindow.show();
        this.onArchetypeSelect(); // Update parts list for first item
        break;
      case 3: // Battler
        this._helpWindow.setText(getTranslatedText('Select a Battler Image', 'Seleziona Immagine Battler'));
        const archsForBattlers = [this._selectedArchetype1];
        if (this._mode === 'hybrid' && this._selectedArchetype2) {
          archsForBattlers.push(this._selectedArchetype2);
        }
        this._battlerListWindow.setArchetypes(archsForBattlers);
        this._battlerListWindow.show();
        this._battlerListWindow.activate();
        this._battlerPreviewWindow.show();
        this._battlerListWindow.select(0);
        this.onBattlerSelect(); // Update preview for first item
        break;
      case 4: // Character
        this._helpWindow.setText(getTranslatedText('Select a Character Sprite', 'Seleziona Sprite Personaggio'));
        const archetypes = [this._selectedArchetype1];
        if (this._mode === 'hybrid' && this._selectedArchetype2) {
          archetypes.push(this._selectedArchetype2);
        }
        this._characterWindow.setArchetypes(archetypes);
        this._characterWindow.show();
        this._characterWindow.activate();
        this._characterWindow.select(0);
        break;
    }
  };

  // --- Event Handlers ---

  Scene_CreateCreature.prototype.onModeSelect = function (mode) {
    this._mode = mode;
    this.showStep(1); // Go to Archetype 1 selection
  };

  Scene_CreateCreature.prototype.onArchetypeSelect = function () {
    const item = this._archetypeWindow.item();
    if (!item) return;

    const currentKey = item.key;
    if (this._step === 1) {
      this._archetypePartsWindow.setArchetypes(currentKey, null);
    } else if (this._step === 2) {
      this._archetypePartsWindow.setArchetypes(this._selectedArchetype1, currentKey);
    }
  };

  Scene_CreateCreature.prototype.onArchetypeOk = function () {
    const item = this._archetypeWindow.item();
    if (!item) return;

    if (this._step === 1) {
      this._selectedArchetype1 = item.key;
      if (this._mode === 'hybrid') {
        this.showStep(2); // Go to Archetype 2
      } else {
        this.showStep(3); // Skip to Battler
      }
    } else if (this._step === 2) {
      this._selectedArchetype2 = item.key;
      this.showStep(3); // Go to Battler
    }
  };

  Scene_CreateCreature.prototype.onArchetypeCancel = function () {
    if (this._step === 1) {
      this.showStep(0); // Back to Mode
    } else if (this._step === 2) {
      this.showStep(1); // Back to Archetype 1
    }
  };

  Scene_CreateCreature.prototype.onBattlerSelect = function () {
    const item = this._battlerListWindow.item();
    const battlerName = item ? item.battlerName : null;
    if (this._battlerPreviewWindow) {
      this._battlerPreviewWindow.setBattler(battlerName);
    }
  };

  Scene_CreateCreature.prototype.onBattlerOk = function () {
    const item = this._battlerListWindow.item();
    const battlerName = item ? item.battlerName : null;
    if (battlerName) {
      this._selectedBattler = battlerName;
      // Save battler image path to appropriate variable based on actor ID (106, 107, or 108)
      const battlerPath = battlerName;
      const variableId = 105 + this._targetActorId; // 106 for actor 1, 107 for actor 2, 108 for actor 3
      $gameVariables.setValue(variableId, battlerPath);
      this.showStep(4); // Go to Character
    }
  };

  Scene_CreateCreature.prototype.onBattlerCancel = function () {
    if (this._mode === 'hybrid') {
      this.showStep(2); // Back to Archetype 2
    } else {
      this.showStep(1); // Back to Archetype 1
    }
  };

  Scene_CreateCreature.prototype.onCharacterOk = function () {
    const entry = this._characterWindow.item();
    if (entry) {
      this._selectedCharacter = entry;
      this.applyCreatureSettings();
      this.popScene();
    }
  };

  Scene_CreateCreature.prototype.onCharacterCancel = function () {
    this.showStep(3); // Back to Battler
  };

  // --- Logic Functions ---

  Scene_CreateCreature.prototype.applyCreatureSettings = function () {
    const actor = $gameActors.actor(this._targetActorId);
    if (!actor) return;

    // Use the changeArchetype function from Health_Core if available
    const changeArchetype = window.changeArchetypeForActor || this.changeArchetypeLocal.bind(this);

    // Apply Archetype(s)
    if (this._mode === 'baseline' && this._selectedArchetype1) {
      changeArchetype(actor, this._selectedArchetype1);
    } else if (this._mode === 'hybrid' && this._selectedArchetype1 && this._selectedArchetype2) {
      this.applyHybridArchetype(actor);
    }

    // Set character sprite
    if (this._selectedCharacter) {
      actor.setCharacterImage(this._selectedCharacter.path, this._selectedCharacter.index);
    }

    console.log(`Creature created for Actor ${this._targetActorId}:`);
    console.log('  Mode:', this._mode);
    console.log('  Archetype 1:', this._selectedArchetype1);
    console.log('  Archetype 2:', this._selectedArchetype2);
    console.log('  Battler:', this._selectedBattler, `(saved to variable ${105 + this._targetActorId})`);
    console.log('  Character:', this._selectedCharacter?.path, 'index', this._selectedCharacter?.index);
  };

  // Local implementation of changeArchetype for standalone use
  Scene_CreateCreature.prototype.changeArchetypeLocal = function (actor, archetypeName) {
    if (!actor) return false;

    const { EnemyArchetypes } = window.Health || {};

    if (!EnemyArchetypes || !EnemyArchetypes[archetypeName]) {
      console.warn(`Archetype "${archetypeName}" not found in EnemyArchetypes`);
      return false;
    }

    const archetype = EnemyArchetypes[archetypeName];

    // Clear existing stat modifiers
    if (actor._statModifiers) {
      for (const param in actor._statModifiers) {
        actor._statModifiers[param] = 0;
      }
    } else {
      actor._statModifiers = {};
    }

    // Initialize new body parts from archetype
    actor._bodyParts = {};
    actor._currentArchetype = archetypeName;

    for (const partKey in archetype.parts) {
      const archetypePart = archetype.parts[partKey];
      const hpPercentage = archetypePart.hpPercent / 100;

      actor._bodyParts[partKey] = {
        name: ConfigManager.language === "it" && archetypePart.name_it
          ? archetypePart.name_it
          : archetypePart.name,
        maxHp: Math.round(actor.mhp * hpPercentage),
        currentHp: Math.round(actor.mhp * hpPercentage),
        vital: false,
        damaged: false,
        canCutoff: archetypePart.canCutoff || false,
        statEffect: archetypePart.statEffect || null,
        damageMsg: ConfigManager.language === "it" && archetypePart.msg_it
          ? archetypePart.msg_it
          : archetypePart.msg,
        specialEffect: archetypePart.specialEffect || null,
        appliedStatEffect: false,
        skillId: archetypePart.skillId || 0,
      };
    }

    // Learn skills from part skillIds
    for (const partKey in archetype.parts) {
      const skillId = archetype.parts[partKey].skillId;
      if (skillId && skillId !== 0 && $dataSkills[skillId]) {
        actor.learnSkill(skillId);
      }
    }

    // Set reproduction variable based on actor ID
    if ($gameVariables) {
      var reproductionValue = archetype.reproduction !== undefined ? archetype.reproduction : 0;
      var actorId = actor.actorId();
      if (actorId === 1) {
        $gameVariables.setValue(87, reproductionValue);
      } else if (actorId === 2) {
        $gameVariables.setValue(115, reproductionValue);
      } else if (actorId === 3) {
        $gameVariables.setValue(116, reproductionValue);
      }
    }

    // Clear all learned skills and add archetype's base skills
    if (archetype.skills && archetype.skills.length > 0) {
      const currentSkills = actor.skills().slice();
      currentSkills.forEach(skillId => {
        actor.forgetSkill(skillId.id);
      });

      archetype.skills.forEach(skillId => {
        if ($dataSkills[skillId]) {
          actor.learnSkill(skillId);
        }
      });
    }

    // Refresh actor parameters
    actor.refresh();

    return true;
  };

  Scene_CreateCreature.prototype.applyHybridArchetype = function (actor) {
    const { EnemyArchetypes } = window.Health || {};
    const arch1 = EnemyArchetypes[this._selectedArchetype1];
    const arch2 = EnemyArchetypes[this._selectedArchetype2];
    if (!arch1 || !arch2) return;

    const mergedParts = {};

    // Add parts from Arch 1
    for (const partKey in arch1.parts) {
      mergedParts[partKey] = arch1.parts[partKey];
    }
    // Add/overwrite parts from Arch 2
    for (const partKey in arch2.parts) {
      mergedParts[partKey] = arch2.parts[partKey];
    }

    // Clear existing actor data
    actor._statModifiers = {};
    actor._bodyParts = {};
    actor._currentArchetype = `${this._selectedArchetype1} / ${this._selectedArchetype2}`;

    // Apply new merged parts to actor
    for (const partKey in mergedParts) {
      const archetypePart = mergedParts[partKey];
      const hpPercentage = archetypePart.hpPercent / 100;

      actor._bodyParts[partKey] = {
        name: ConfigManager.language === "it" && archetypePart.name_it
          ? archetypePart.name_it
          : archetypePart.name,
        maxHp: Math.round(actor.mhp * hpPercentage),
        currentHp: Math.round(actor.mhp * hpPercentage),
        vital: false,
        damaged: false,
        canCutoff: archetypePart.canCutoff || false,
        statEffect: archetypePart.statEffect || null,
        damageMsg: ConfigManager.language === "it" && archetypePart.msg_it
          ? archetypePart.msg_it
          : archetypePart.msg,
        specialEffect: archetypePart.specialEffect || null,
        appliedStatEffect: false,
        skillId: archetypePart.skillId || 0,
      };
    }

    // Learn skills from part skillIds (merged parts, arch2 overrides arch1 for same key)
    for (const partKey in mergedParts) {
      const skillId = mergedParts[partKey].skillId;
      if (skillId && skillId !== 0 && $dataSkills[skillId]) {
        actor.learnSkill(skillId);
      }
    }

    // Use Arch 2 (dominant) for reproduction
    const dominantArchetype = arch2;

    // Set reproduction variable based on actor ID
    if ($gameVariables) {
      var reproductionValue = dominantArchetype.reproduction !== undefined ? dominantArchetype.reproduction : 0;
      var actorId = actor.actorId();
      if (actorId === 1) {
        $gameVariables.setValue(87, reproductionValue);
      } else if (actorId === 2) {
        $gameVariables.setValue(115, reproductionValue);
      } else if (actorId === 3) {
        $gameVariables.setValue(116, reproductionValue);
      }
    }

    // Refresh actor parameters
    actor.refresh();
  };

  // Expose Scene_CreateCreature globally
  window.Scene_CreateCreature = Scene_CreateCreature;

  console.log(`${pluginName} loaded successfully.`);
})();

/*:
 * @target MZ
 * @plugindesc Dynamic class selection system with detailed information, skill categories, and confirmation dialogs
 * @author Omni-Lex
 * @orderAfter CharacterCreationShared
 * @orderAfter StartingEquipment
 * @orderAfter CharacterPresets
 * @orderBefore CharacterCreation
 *
 * @command openClassSelection
 * @text Open Class Selection
 * @desc Opens the class selection menu
 *
 * @param availableClasses
 * @text Available Classes
 * @desc List of class IDs that can be selected (comma-separated)
 * @type string
 * @default 1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59,60,61,62,63,64,65,66
 *
 * @param classNameVariable
 * @text Class Name Variable
 * @desc Variable ID to store the selected class name
 * @type variable
 * @default 1
 *
 * @help
 * This plugin provides a comprehensive class selection UI system:
 * - Window_ClassSelection (class list with levels)
 * - Window_ClassDetails (class description, stats, weapons, skills)
 * - Window_ClassConfirmation (confirmation dialog)
 * - Window_ClassLevelUpSkills (level-up skill list)
 * - Window_SkillCategories (primary/secondary skill categories from notetags)
 * - Window_ClassSelectionTitle (title bar)
 * - Scene_ClassSelection (scene orchestrator)
 *
 * Class Notetags:
 * <Primary: SkillOne, SkillTwo, CamelCaseSkill>
 * <Secondary: AnotherSkill, AndAnother>
 * <en: English description here>
 * <it: Italian description here>
 * <elem: 2> (element ID: 1=Physical, 2=Fire, 3=Ice, etc.)
 *
 * Dependencies:
 * - CharacterCreationShared.js (for localization)
 * - StartingEquipment.js (for weapon equipment)
 * - CharacterPresets.js (for tracking functions)
 *
 * Exports:
 * - window.ClassSelection.Scene_ClassSelection
 */

(() => {
  const pluginName = "ClassSelection";

  //=============================================================================
  // Plugin Parameters
  //=============================================================================

  const parameters = PluginManager.parameters(pluginName);
  const availableClassesParam =
    parameters["availableClasses"] ||
    "1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59,60,61,62,63,64,65,66";
  const availableClasses = availableClassesParam
    .split(",")
    .map((id) => Number(id.trim()));

  //=============================================================================
  // Aliases for dependencies
  //=============================================================================

  const { weaponTypeIcons } = window.StartingEquipment || {};
  const { equipRandomCompatibleWeapon, GLOBAL_STARTER_SKILLS } = window.StartingEquipment || {};
  const { markFirstCreationComplete } = window.CharacterPresets || {};

  //=============================================================================
  // Window_ClassSelection - Class List
  //=============================================================================

  class Window_ClassSelection extends Window_Selectable {
    initialize(rect) {
      super.initialize(rect);
      this._data = this.makeClassList();
      this.refresh();
      this.select(0);
      this.activate();
    }

    makeClassList() {
      return availableClasses.filter(
        (classId) => classId > 0 && $dataClasses[classId]
      );
    }

    maxItems() {
      return this._data ? this._data.length : 1;
    }

    itemAt(index) {
      return this._data ? this._data[index] : null;
    }

    drawItem(index) {
      const classId = this.itemAt(index);
      if (classId) {
        const rect = this.itemLineRect(index);
        const className = $dataClasses[classId].name;
        const classLevel = this.getClassLevel(classId);
        const displayText = `${className} (Lv. ${classLevel})`;
        this.drawText(displayText, rect.x, rect.y, rect.width);
      }
    }

    getClassLevel(classId) {
      const actor = $gameParty.members()[0];
      if (!actor) return 1;

      if (actor._classId === classId) {
        return actor._level;
      }

      return actor._classLevels ? actor._classLevels[classId] || 1 : 1;
    }

    processOk() {
      const classId = this.itemAt(this.index());
      if (classId) {
        this.playOkSound();
        this.callOkHandler();
      }
    }

    select(index) {
      super.select(index);
      this.callHandler("select");
    }

    onTouchSelect(trigger) {
      super.onTouchSelect(trigger);
      this.callHandler("select");
    }

    currentClass() {
      return $dataClasses[this.itemAt(this.index())];
    }

    currentClassId() {
      return this.itemAt(this.index());
    }
  }

  //=============================================================================
  // Window_ClassConfirmation - Confirmation Dialog
  //=============================================================================

  class Window_ClassConfirmation extends Window_Command {
    initialize(rect) {
      super.initialize(rect);
      this._message = "";
      this._classLevel = 1;
      this.openness = 0;
    }

    makeCommandList() {
      if (ConfigManager.language === "it") {
        this.addCommand("Lista Abilità", "levelUpList");
        this.addCommand("Statistiche", "stats");
        this.addCommand("Categorie Abilità", "skillCategories");
        if (this._classLevel > 30) {
          this.addCommand("Prestigio", "prestige", false);
        }
        this.addCommand("Conferma classe", "yes");
        this.addCommand("Annulla", "no");
      } else {
        this.addCommand("Level Up List", "levelUpList");
        this.addCommand("Stats", "stats");
        this.addCommand("Skill Categories", "skillCategories");
        if (this._classLevel > 30) {
          this.addCommand("Prestige", "prestige", false);
        }
        this.addCommand("Confirm class", "yes");
        this.addCommand("Cancel", "no");
      }
    }

    setClassLevel(level) {
      if (this._classLevel !== level) {
        this._classLevel = level;
        this.refresh();
      }
    }

    setMessage(message) {
      this._message = "";
      this.refresh();
    }
  }

  //=============================================================================
  // Window_ClassLevelUpSkills - Level-Up Skills List
  //=============================================================================

  class Window_ClassLevelUpSkills extends Window_Selectable {
    initialize(rect, classData) {
      super.initialize(rect);
      this._class = classData;
      this._data = this.makeSkillList();
      this.refresh();
      this.activate();
      this.select(0);
    }

    makeSkillList() {
      if (!this._class || !this._class.learnings) {
        return [];
      }
      return this._class.learnings
        .map((learning) => ({
          ...learning,
          skill: $dataSkills[learning.skillId],
        }))
        .sort((a, b) => {
          if (a.level !== b.level) {
            return a.level - b.level;
          }
          return a.skill.name.localeCompare(b.skill.name);
        });
    }

    maxItems() {
      return this._data.length > 0 ? this._data.length : 1;
    }

    itemAt(index) {
      return this._data ? this._data[index] : null;
    }

    drawItem(index) {
      const rect = this.itemLineRect(index);
      if (this._data.length > 0) {
        const learning = this.itemAt(index);
        if (learning && learning.skill) {
          const levelText = `Lv ${learning.level}: `;
          const levelWidth = this.textWidth(levelText);
          this.drawText(levelText, rect.x, rect.y, levelWidth);
          this.drawText(
            learning.skill.name,
            rect.x + levelWidth,
            rect.y,
            rect.width - levelWidth
          );
        }
      } else {
        this.drawText(
          "No level-up skills for this class.",
          rect.x,
          rect.y,
          rect.width,
          "center"
        );
      }
    }

    isCurrentItemEnabled() {
      return this._data.length > 0;
    }

    processCancel() {
      super.processCancel();
      this.callHandler("cancel");
    }
  }

  //=============================================================================
  // Window_SkillCategories - Skill Categories from Notetags
  //=============================================================================

  class Window_SkillCategories extends Window_Base {
    initialize(rect, classData) {
      super.initialize(rect);
      this._handlers = {};
      this._class = classData;
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

    _splitCamelCase(text) {
      return text.replace(/([A-Z])/g, " $1").trim();
    }

    refresh() {
      this.contents.clear();
      if (!this._class || !this._class.note) {
        this.drawText(
          "No skill categories defined.",
          0,
          0,
          this.contentsWidth(),
          "center"
        );
        return;
      }

      const note = this._class.note;
      let y = 0;

      const primaryMatch = note.match(/<Primary:\s*([^>]+)>/);
      const secondaryMatch = note.match(/<Secondary:\s*([^>]+)>/);

      if (!primaryMatch && !secondaryMatch) {
        this.drawText(
          "No skill categories defined.",
          0,
          0,
          this.contentsWidth(),
          "center"
        );
        return;
      }

      if (primaryMatch) {
        this.changeTextColor(ColorManager.systemColor());
        this.drawText("Primary:", 0, y, this.contentsWidth());
        y += this.lineHeight();
        this.resetTextColor();
        const skills = primaryMatch[1]
          .split(",")
          .map((s) => this._splitCamelCase(s.trim()));
        this.drawTextEx(skills.join(", "), this.itemPadding(), y);
        y += this.lineHeight() * 2;
      }

      if (secondaryMatch) {
        this.changeTextColor(ColorManager.systemColor());
        this.drawText("Secondary:", 0, y, this.contentsWidth());
        y += this.lineHeight();
        this.resetTextColor();
        const skills = secondaryMatch[1]
          .split(",")
          .map((s) => this._splitCamelCase(s.trim()));
        this.drawTextEx(skills.join(", "), this.itemPadding(), y);
      }
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
  // Window_ClassDetails - Class Information Display
  //=============================================================================

  class Window_ClassDetails extends Window_Base {
    initialize(rect) {
      super.initialize(rect);
      this._class = null;
      this.refresh();
    }

    setClass(classData) {
      if (this._class !== classData) {
        this._class = classData;
        this.refresh();
      }
    }

    refresh() {
      this.contents.clear();
      if (this._class) {
        this.drawClassDetails();
      }
    }

    drawClassDetails() {
      const statsHeight = this.calcStatsHeight();
      const skillsHeight = this.calcSkillsHeight();
      this.drawClassNote();
      const bottomMargin = 10;
      const availableHeight = this.contents.height - bottomMargin;
      const statsStartY = availableHeight - statsHeight - skillsHeight;
      const skillsStartY = availableHeight - skillsHeight;
      this.drawParameters(statsStartY);
      this.drawLearnableSkills(skillsStartY);
    }

    calcStatsHeight() {
      return Math.ceil(6 / 2) * (this.lineHeight() * 0.9) + this.lineHeight();
    }

    calcSkillsHeight() {
      let skillCount = 0;
      if (this._class.learnings && this._class.learnings.length > 0) {
        skillCount = this._class.learnings.filter(
          (learning) => learning.level === 1
        ).length;
      }
      return (
        Math.max(1, skillCount) * (this.lineHeight() * 0.85) + this.lineHeight()
      );
    }

    drawClassNote() {
      let note = this._class.note || "No description available.";
      const rawNote = this._class.note || "";

      if (ConfigManager.language === "it") {
        const match = note.match(/<it:\s*([\s\S]*?)>/);
        if (match) {
          note = match[1].trim();
        } else {
          note = note.replace(/<[^>]+>/g, "").trim();
        }
      } else {
        const match = note.match(/<en:\s*([\s\S]*?)>/);
        if (match) {
          note = match[1].trim();
        } else {
          note = note.replace(/<(it|en):\s*[\s\S]*?>/g, "").trim();
        }
      }

      this.changeTextColor(ColorManager.systemColor());
      this.resetTextColor();
      const maxLines = 3;
      const maxLength = this.contents.width * maxLines - 10;
      const truncatedNote =
        note.length > maxLength ? note.substring(0, maxLength) + "..." : note;

      let currentY = 0;
      this.drawTextEx(truncatedNote, 0, currentY, this.contents.width);

      // Extract and display element
      const elemMatch = rawNote.match(/<elem:\s*(\d+)>/);
      if (elemMatch) {
        const elementId = parseInt(elemMatch[1]);
        if (elementId > 0 && elementId < $dataSystem.elements.length) {
          const elementNamesIT = {
            1: "Fisico",
            2: "Fuoco",
            3: "Ghiaccio",
            4: "Fulmine",
            5: "Acqua",
            6: "Petro",
            7: "Vento",
            8: "Sacro",
            9: "Maledetto"
          };

          const elementName = ConfigManager.language === "it" && elementNamesIT[elementId]
            ? elementNamesIT[elementId]
            : $dataSystem.elements[elementId];

          const elementIcons = [0, 96, 64, 65, 66, 67, 68, 69, 70, 71];
          const elementIcon = elementIcons[elementId] || 0;

          currentY += this.lineHeight() * 3 + 10;
          this.changeTextColor(ColorManager.systemColor());
          const elementLabel = ConfigManager.language === "it" ? "Elemento:" : "Element:";
          this.drawText(elementLabel, 0, currentY, 120);
          this.resetTextColor();
          this.drawText(elementName, 140, currentY, this.contents.width - 200);

          if (elementIcon > 0) {
            const textWidth = this.textWidth(elementName);
            this.drawIcon(elementIcon, 140 + textWidth + 8, currentY);
          }
        }
      }
    }

    drawWeaponAndMagicIcons(y) {
      let iconX = 0;
      const iconWidth = ImageManager.iconWidth + 4;
      for (let weaponTypeId = 1; weaponTypeId <= 12; weaponTypeId++) {
        if (this.canUseWeaponType(weaponTypeId)) {
          const icon = weaponTypeIcons ? weaponTypeIcons[weaponTypeId] : 96;
          this.drawIcon(icon, iconX, y);
          iconX += iconWidth;
        }
      }
    }

    canUseWeaponType(weaponTypeId) {
      if (!this._class || !this._class.traits) return false;
      return this._class.traits.some(
        (trait) =>
          trait.code === 51 &&
          trait.dataId === weaponTypeId &&
          trait.value === 1
      );
    }

    drawParameters(y) {
      const paramNames =
        ConfigManager.language === "it"
          ? ["FOR", "COS", "INT", "SAG", "DES", "PSI"]
          : ["STR", "CON", "INT", "WIS", "DEX", "PSI"];
      const paramIds = [2, 3, 4, 5, 6, 7];
      for (let i = 0; i < paramNames.length; i++) {
        const x = (i % 2) * (this.contents.width / 2);
        const paramY = y + Math.floor(i / 2) * (this.lineHeight() * 0.9);
        const paramValue = this._class.params[paramIds[i]][1];
        this.changeTextColor(ColorManager.textColor(1));
        this.drawText(paramNames[i] + ":", x, paramY, 80);
        this.resetTextColor();
        this.drawText(String(paramValue), x + 80, paramY, 60, "right");
      }
    }

    drawLearnableSkills(y) {
      this.drawWeaponAndMagicIcons(y);
      let level1Skills = [];
      if (this._class.learnings && this._class.learnings.length > 0) {
        level1Skills = this._class.learnings
          .filter((learning) => learning.level === 1)
          .map((learning) => $dataSkills[learning.skillId].name);
      }

      if (level1Skills.length === 0) {
        if (ConfigManager.language === "it") {
          this.drawText(
            "Nessuna skill al livello 1",
            0,
            y + this.lineHeight(),
            this.contents.width
          );
        } else {
          this.drawText(
            "No skills at level 1",
            0,
            y + this.lineHeight(),
            this.contents.width
          );
        }
        return;
      }
      let skillY = y + this.lineHeight() * 0.9;
      const skillLineHeight = this.lineHeight() * 0.85;
      for (const skillName of level1Skills) {
        this.drawText(skillName, 0, skillY, this.contents.width);
        skillY += skillLineHeight;
      }
    }
  }

  //=============================================================================
  // Window_ClassSelectionTitle - Title Bar
  //=============================================================================

  class Window_ClassSelectionTitle extends Window_Base {
    initialize(rect) {
      super.initialize(rect);
      this.refresh();
    }

    refresh() {
      this.contents.clear();
      if (ConfigManager.language === "it") {
        this.drawText(
          "Seleziona la tua classe",
          0,
          0,
          this.contents.width,
          "center"
        );
      } else {
        this.drawText("Select your class", 0, 0, this.contents.width, "center");
      }
    }
  }

  //=============================================================================
  // Scene_ClassSelection - Scene Orchestrator
  //=============================================================================

  class Scene_ClassSelection extends Scene_MenuBase {
    create() {
      super.create();
      this.createTitleWindow();
      this.createClassWindow();
      this.createDetailsWindow();
    }


    createTitleWindow() {
      const rect = this.titleWindowRect();
      this._titleWindow = new Window_ClassSelectionTitle(rect);
      this.addWindow(this._titleWindow);
    }

    createClassWindow() {
      const rect = this.classWindowRect();
      this._classWindow = new Window_ClassSelection(rect);
      this._classWindow.setHandler("ok", this.onClassSelect.bind(this));
      this._classWindow.setHandler("cancel", this.onClassCancel.bind(this));
      this._classWindow.setHandler(
        "select",
        this.onClassSelectionChange.bind(this)
      );
      this.addWindow(this._classWindow);
    }

    onClassCancel() {
      // Return to the class selection step in character creation
      if (window.Scene_CharacterCreation) {
        window.Scene_CharacterCreation.prepare(9);
        SceneManager.goto(window.Scene_CharacterCreation);
      } else {
        this.popScene();
      }
    }

    createDetailsWindow() {
      const rect = this.detailsWindowRect();
      this._detailsWindow = new Window_ClassDetails(rect);
      this.addWindow(this._detailsWindow);

      if (this._classWindow.currentClass()) {
        this._detailsWindow.setClass(this._classWindow.currentClass());
      }
    }

    titleWindowRect() {
      const padding = 24;
      const width = Graphics.boxWidth - padding * 2;
      const height = this.calcWindowHeight(1, false);
      return new Rectangle(padding, padding, width, height);
    }

    classWindowRect() {
      const titleHeight = this.titleWindowRect().height;
      const padding = 24;
      const width = Math.floor((Graphics.boxWidth - padding * 2) / 2);
      const top = padding + titleHeight + 8;
      const height = Graphics.boxHeight - top - padding;
      return new Rectangle(padding, top, width, height);
    }

    detailsWindowRect() {
      const titleHeight = this.titleWindowRect().height;
      const padding = 24;
      const classWidth = this.classWindowRect().width;
      const width = Math.floor((Graphics.boxWidth - padding * 2) / 2);
      const top = padding + titleHeight + 8;
      const height = Graphics.boxHeight - top - padding;
      const x = padding + classWidth + 8;
      return new Rectangle(x, top, width, height);
    }

    onClassSelectionChange() {
      if (this._classWindow.currentClass()) {
        this._detailsWindow.setClass(this._classWindow.currentClass());
      }
    }

    onClassSelect() {
      if (!this._confirmationWindow) {
        const rect = this.confirmationWindowRect();
        this._confirmationWindow = new Window_ClassConfirmation(rect);
        this._confirmationWindow.setHandler(
          "yes",
          this.onConfirmationYes.bind(this)
        );
        this._confirmationWindow.setHandler(
          "no",
          this.onConfirmationNo.bind(this)
        );
        this._confirmationWindow.setHandler(
          "levelUpList",
          this.onLevelUpList.bind(this)
        );
        this._confirmationWindow.setHandler("stats", this.onStats.bind(this));
        this._confirmationWindow.setHandler(
          "skillCategories",
          this.onSkillCategories.bind(this)
        );
        this._confirmationWindow.setHandler(
          "prestige",
          this.onPrestige.bind(this)
        );
        this.addWindow(this._confirmationWindow);
      }

      const classId = this._classWindow.currentClassId();
      const classLevel = this._classWindow.getClassLevel(classId);
      this._confirmationWindow.setClassLevel(classLevel);

      this._confirmationWindow.setMessage("");
      this._confirmationWindow.open();
      this._confirmationWindow.activate();
      this._confirmationWindow.select(0);

      this._classWindow.deactivate();
    }

    onConfirmationYes() {
      const classId = this._classWindow.itemAt(this._classWindow.index());
      const className = $dataClasses[classId].name;

      // Get the current actor being created
      const Scene_CharacterCreation = window.Scene_CharacterCreation;
      const currentActor = Scene_CharacterCreation ? Scene_CharacterCreation.getCurrentActor() : null;
      const currentActorId = Scene_CharacterCreation ? Scene_CharacterCreation.getCurrentActorId() : null;

      // Set the class for the current actor
      if (currentActor) {
        currentActor.changeClass(classId, true);
      }

      // Global requirement: Add item 591 to all new characters (only once for party member 1)
      const currentMemberIndex = Scene_CharacterCreation ? Scene_CharacterCreation._currentPartyMemberIndex : 0;
      if (currentMemberIndex === 0 && $dataItems[591]) {
        $gameParty.gainItem($dataItems[591], 1);
      }

      // Add global starter skills to current actor
      if (currentActor && GLOBAL_STARTER_SKILLS) {
        GLOBAL_STARTER_SKILLS.forEach((skillId) => {
          if ($dataSkills[skillId]) {
            currentActor.learnSkill(skillId);
          }
        });

        // Equip random compatible weapon for the selected class
        if (equipRandomCompatibleWeapon) {
          equipRandomCompatibleWeapon(currentActor, classId);
        }
      }

      // Grant starting money from class notetag (only for party member 1)
      if (currentMemberIndex === 0) {
        const classData = $dataClasses[classId];
        const moneyMatch = classData && classData.note.match(/<Money:(\d+)>/);
        if (moneyMatch) {
          $gameParty.gainGold(Number(moneyMatch[1]));
        }
      }

      // Store class name in variable (only for party member 1)
      if (currentMemberIndex === 0) {
        const variableId = Number(parameters["classNameVariable"] || 0);
        if (variableId > 0) {
          $gameVariables.setValue(variableId, className);
        }
      }

      if (markFirstCreationComplete) {
        markFirstCreationComplete();
      }

      // Resume character creation from step 4 (Traits) after confirming class selection
      if (Scene_CharacterCreation) {
        Scene_CharacterCreation.prepare(4);
        SceneManager.goto(Scene_CharacterCreation);
      } else {
        this.popScene();
      }
    }

    onConfirmationNo() {
      this._confirmationWindow.close();
      this._classWindow.activate();
    }

    onPrestige() {
      // Placeholder for future prestige functionality
    }

    confirmationWindowRect() {
      const width = 400;
      const classId = this._classWindow.currentClassId();
      const classLevel = this._classWindow.getClassLevel(classId);
      const commandCount = classLevel > 30 ? 6 : 5;
      const height = this.calcWindowHeight(commandCount, true);
      const x = (Graphics.boxWidth - width) / 2;
      const y = (Graphics.boxHeight - height) / 2;
      return new Rectangle(x, y, width, height);
    }

    onStats() {
      this._confirmationWindow.deactivate();
      const rect = this.statsWindowRect();
      const Window_StatsExplanation = window.CharacterPresets ? window.CharacterPresets.Window_StatsExplanation : null;
      if (Window_StatsExplanation) {
        this._statsWindow = new Window_StatsExplanation(rect);
        this._statsWindow.setHandler("cancel", this.onSubWindowCancel.bind(this));
        this.addWindow(this._statsWindow);
      }
    }

    onLevelUpList() {
      this._confirmationWindow.deactivate();
      const rect = this.levelUpListWindowRect();
      this._levelUpListWindow = new Window_ClassLevelUpSkills(
        rect,
        this._classWindow.currentClass()
      );
      this._levelUpListWindow.setHandler(
        "cancel",
        this.onSubWindowCancel.bind(this)
      );
      this.addWindow(this._levelUpListWindow);
    }

    onSkillCategories() {
      this._confirmationWindow.deactivate();
      const rect = this.skillCategoriesWindowRect();
      this._skillCategoriesWindow = new Window_SkillCategories(
        rect,
        this._classWindow.currentClass()
      );
      this._skillCategoriesWindow.setHandler(
        "cancel",
        this.onSubWindowCancel.bind(this)
      );
      this.addWindow(this._skillCategoriesWindow);
    }

    onSubWindowCancel() {
      if (this._levelUpListWindow) {
        this._levelUpListWindow.close();
        this._levelUpListWindow = null;
      }
      if (this._skillCategoriesWindow) {
        this._skillCategoriesWindow.close();
        this._skillCategoriesWindow = null;
      }
      if (this._statsWindow) {
        this._statsWindow.close();
        this._statsWindow = null;
      }
      this._confirmationWindow.activate();
    }

    statsWindowRect() {
      const width = 600;
      const height = this.calcWindowHeight(18, false);
      const x = (Graphics.boxWidth - width) / 2;
      const y = (Graphics.boxHeight - height) / 2;
      return new Rectangle(x, y, width, height);
    }

    levelUpListWindowRect() {
      const width = 600;
      const height = this.calcWindowHeight(15, true);
      const x = (Graphics.boxWidth - width) / 2;
      const y = (Graphics.boxHeight - height) / 2;
      return new Rectangle(x, y, width, height);
    }

    skillCategoriesWindowRect() {
      const width = 600;
      const height = this.calcWindowHeight(10, false);
      const x = (Graphics.boxWidth - width) / 2;
      const y = (Graphics.boxHeight - height) / 2;
      return new Rectangle(x, y, width, height);
    }
  }

  //=============================================================================
  // Plugin Commands
  //=============================================================================

  PluginManager.registerCommand(pluginName, "openClassSelection", () => {
    SceneManager.push(Scene_ClassSelection);
  });

  //=============================================================================
  // Exports to Global Namespace
  //=============================================================================

  window.ClassSelection = {
    Scene_ClassSelection
  };

  // Backward compatibility
  window.Scene_ClassSelection = Scene_ClassSelection;

  console.log(`${pluginName} loaded successfully.`);
})();

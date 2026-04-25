//=============================================================================
// TraitSelector.js
//=============================================================================

/*:
 * @target MZ
 * @plugindesc Trait Selector Menu v1.2.0
 * @author Omni-Lex
 * @version 1.2.0
 * @description A trait selection menu that affects player stats and abilities
 *
 * @help TraitSelector.js
 *
 * This plugin creates a trait selection menu where players must choose 4 traits
 * that will affect their character's base stats, skills, items, and equipment.
 *
 * Plugin Command:
 * Use "Open Trait Selector" in the plugin commands menu
 *
 * Script call to open the trait selector:
 * SceneManager.push(Scene_TraitSelector);
 *
 * @command openTraitSelector
 * @text Open Trait Selector
 * @desc Opens the trait selection menu
 *
 * @command openTraitSelectorForCreation
 * @text Open Trait Selector (Character Creation)
 * @desc Opens the trait selector and returns to character creation when done
 *
 * @arg actorId
 * @text Actor ID
 * @desc The ID of the actor to apply traits to (leave blank for default)
 * @type actor
 * @default 1
 *
 * @command randomizeTraits
 * @text Randomize Traits
 * @desc Randomly selects and applies 5 compatible traits to the actor
 *
 * @param switchIds
 * @text Switch IDs to Reset
 * @desc Comma-separated list of switch IDs that will be turned OFF when opening the menu
 * @type string
 * @default 1,2,3,4,5,6,7,8,9,10,11,12
 *
 * @param actorId
 * @text Actor ID
 * @desc The ID of the actor that will receive the trait bonuses
 * @type actor
 * @default 1
 *
 * @param allowDeselect
 * @text Allow Deselection
 * @desc Allow players to deselect traits before confirming
 * @type boolean
 * @default true
 */

(() => {
  "use strict";

  const pluginName = "TraitSelector";
  const parameters = PluginManager.parameters(pluginName);
  const switchIds = parameters["switchIds"]
    .split(",")
    .map((id) => parseInt(id.trim()));
  const actorId = parseInt(parameters["actorId"]) || 1;
  const allowDeselect = parameters["allowDeselect"] === "true";
  const { Traits } = window.ProstheticsData;

  // Translation system

  const translations = {
    headerText: {
      en: "Select 4 traits that will define your character. Each trait has benefits and drawbacks.",
      it: "Seleziona 4 tratti che definiranno il tuo personaggio. Ogni tratto ha vantaggi e svantaggi.",
    },
    selectedTraitsLabel: {
      en: "Selected Traits:",
      it: "Tratti Selezionati:",
    },
    emptySlot: {
      en: "[Empty]",
      it: "[Vuoto]",
    },
    totalBonuses: {
      en: "Total Bonuses:",
      it: "Bonus Totali:",
    },
    confirmCommand: {
      en: "Confirm Selection",
      it: "Conferma Selezione",
    },
    continueCommand: {
      en: "Continue Selecting",
      it: "Continua Selezione",
    },
    selectedStatus: {
      en: "Selected:",
      it: "Selezionati:",
    },
    readyProceed: {
      en: "✓ Ready to proceed!",
      it: "✓ Pronto per procedere!",
    },
    needMore: {
      en: (n) => `Need ${n} more trait${n !== 1 ? "s" : ""}`,
      it: (n) => `Servono ancora ${n} tratt${n !== 1 ? "i" : "o"}`,
    },
    benefits: {
      en: "Benefits:",
      it: "Vantaggi:",
    },
    drawbacks: {
      en: "Drawbacks:",
      it: "Svantaggi:",
    },
    incompatible: {
      en: "Incompatible with selected traits",
      it: "Incompatibile con i tratti selezionati",
    },
  };

  const t = (key, ...args) => {
    const useTranslation = ConfigManager.language === "it";

    const lang = useTranslation ? "it" : "en";
    const text = translations[key][lang];
    return typeof text === "function" ? text(...args) : text;
  };

  // Register plugin commands
  PluginManager.registerCommand(pluginName, "openTraitSelector", (args) => {
    Scene_TraitSelector.prepare(false, null);
    SceneManager.push(Scene_TraitSelector);
  });

  // New command: Open trait selector during character creation
  PluginManager.registerCommand(pluginName, "openTraitSelectorForCreation", (args) => {
    const targetActorId = args.actorId ? parseInt(args.actorId) : actorId;
    Scene_TraitSelector.prepare(true, targetActorId);
    SceneManager.push(Scene_TraitSelector);
  });

  // Trait definitions with translations


  // Helper function to get translated trait property
  const getTraitText = (trait, property) => {
    const useTranslation = ConfigManager.language === "it";

    const value = trait[property];
    if (typeof value === "object" && value !== null) {
      return useTranslation ? value.it : value.en;
    }
    return value;
  };
// Add this helper function near the top with other helpers
const getParamDisplayName = (paramKey) => {
    const useTranslation = ConfigManager.language === "it";
    
    const displayNames = {
      hp: { en: "HP", it: "HP" },
      mp: { en: "MP", it: "MP" },
      atk: { en: "STR", it: "FRZ" },
      def: { en: "CON", it: "COS" },
      mat: { en: "INT", it: "INT" },
      mdf: { en: "SAG", it: "SAG" },
      agi: { en: "DEX", it: "DES" },
      luk: { en: "PSI", it: "PSI" },
      eva: { en: "EVA", it: "EVA" }  // Added evasion
    };
    
    return displayNames[paramKey][useTranslation ? "it" : "en"];
  };
  //-----------------------------------------------------------------------------
  // Scene_TraitSelector
  //-----------------------------------------------------------------------------

  class Scene_TraitSelector extends Scene_MenuBase {
    static _returnToCharacterCreation = false; // Flag to control return behavior
    static _targetActorId = null; // Track which actor to apply traits to

    static prepare(returnToCreation = false, targetActorId = null) {
      Scene_TraitSelector._returnToCharacterCreation = returnToCreation;
      Scene_TraitSelector._targetActorId = targetActorId;
    }

    create() {
      super.create();
      this._selectedTraits = [];
      this.createBackground();
      this.createWindowLayer();
      this.createHelpWindow();
      this.createTraitListWindow();
      this.createSelectedTraitsWindow();
      this.createConfirmWindow();
      this.resetSwitches();
      this.resetActorTraits(); // Add this line
    }
    
    resetActorTraits() {
      const targetId = Scene_TraitSelector._targetActorId || actorId;
      const actor = $gameActors.actor(targetId);

      if (!actor) {
        console.error(`Actor with ID ${targetId} not found!`);
        return;
      }

      // Reset all parameter bonuses to 0
      actor._paramPlus = [0, 0, 0, 0, 0, 0, 0, 0];

      // Remove all learned skills from traits (optional - keeps base class skills)
      // If you want to remove trait-granted skills, you'll need to track which skills were added

      actor.refresh();
    }
    createBackground() {
      this._backgroundSprite = new Sprite();
      this._backgroundSprite.bitmap = SceneManager.backgroundBitmap();
      this.addChild(this._backgroundSprite);
    }

    createHelpWindow() {
      const rect = this.helpWindowRect();
      this._helpWindow = new Window_Help(rect);
      this._helpWindow.setText(t("headerText"));
      this.addWindow(this._helpWindow);
    }

    createTraitListWindow() {
      const rect = this.traitListWindowRect();
      this._traitListWindow = new Window_TraitList(rect);
      this._traitListWindow.setHelpWindow(this._helpWindow);
      this._traitListWindow.setHandler("ok", this.onTraitOk.bind(this));
      this._traitListWindow.setHandler("cancel", this.onTraitCancel.bind(this));
      this._traitListWindow.activate();
      this._traitListWindow.select(0);
      this.addWindow(this._traitListWindow);
    }

    createSelectedTraitsWindow() {
      const rect = this.selectedTraitsWindowRect();
      this._selectedTraitsWindow = new Window_SelectedTraits(rect);
      this._selectedTraitsWindow.setSelectedTraits(this._selectedTraits);
      this.addWindow(this._selectedTraitsWindow);
    }

    createConfirmWindow() {
      const rect = this.confirmWindowRect();
      this._confirmWindow = new Window_TraitConfirm(rect);
      this._confirmWindow.setHandler("ok", this.onConfirmOk.bind(this));
      this._confirmWindow.setHandler("cancel", this.onConfirmCancel.bind(this));
      this._confirmWindow.deactivate();
      this._confirmWindow.deselect();
      this._confirmWindow.hide();
      this._confirmWindow.opacity = 255;
      this.addWindow(this._confirmWindow);
    }

    helpWindowRect() {
      const wx = 0;
      const wy = 0;
      const ww = Graphics.boxWidth;
      const wh = this.calcWindowHeight(3, false);
      return new Rectangle(wx, wy, ww, wh);
    }

    traitListWindowRect() {
      const wx = 0;
      const wy = this._helpWindow.y + this._helpWindow.height;
      const ww = Graphics.boxWidth * 0.6;
      const wh = Graphics.boxHeight - wy;
      return new Rectangle(wx, wy, ww, wh);
    }

    selectedTraitsWindowRect() {
      const wx = this._traitListWindow.width;
      const wy = this._helpWindow.y + this._helpWindow.height;
      const ww = Graphics.boxWidth - wx;
      const wh = Graphics.boxHeight - wy;
      return new Rectangle(wx, wy, ww, wh);
    }

    confirmWindowRect() {
      const wx = 0;
      const wy = Graphics.boxHeight - this.calcWindowHeight(16, false); // Changed from 4 to 8
      const ww = Graphics.boxWidth;
      const wh = this.calcWindowHeight(16, false); // Changed from 4 to 8
      return new Rectangle(wx, wy, ww, wh);
    }

    resetSwitches() {
      switchIds.forEach((id) => {
        $gameSwitches.setValue(id, false);
      });
    }

    onTraitOk() {
      const trait = this._traitListWindow.item();

      if (trait && this._selectedTraits.includes(trait)) {
        SoundManager.playCancel();
        const index = this._selectedTraits.indexOf(trait);
        this._selectedTraits.splice(index, 1);
        this._selectedTraitsWindow.setSelectedTraits(this._selectedTraits);
        this._selectedTraitsWindow.refresh();
        this._traitListWindow.refresh();
        this._confirmWindow.refresh();

        if (this._selectedTraits.length < 4) {
          this._confirmWindow.hide();
          this._confirmWindow.deactivate();
        }

        this._traitListWindow.activate();
      } else if (trait && this._selectedTraits.length < 4) {
        SoundManager.playOk();
        this._selectedTraits.push(trait);
        this._selectedTraitsWindow.setSelectedTraits(this._selectedTraits);
        this._selectedTraitsWindow.refresh();
        this._traitListWindow.refresh();
        this._confirmWindow.refresh();

        if (this._selectedTraits.length >= 4) {
          this._confirmWindow.show();
          this._confirmWindow.activate();
          this._confirmWindow.select(0);
          this._traitListWindow.deactivate();
        } else {
          this._traitListWindow.activate();
        }
      } else {
        SoundManager.playBuzzer();
        this._traitListWindow.activate();
      }
    }

    onTraitCancel() {
      if (this._selectedTraits.length > 0) {
        SoundManager.playCancel();
        this._selectedTraits.pop();
        this._selectedTraitsWindow.setSelectedTraits(this._selectedTraits);
        this._selectedTraitsWindow.refresh();
        this._traitListWindow.refresh();
        this._confirmWindow.refresh();

        if (this._selectedTraits.length < 4) {
          this._confirmWindow.hide();
          this._confirmWindow.deactivate();
        }

        this._traitListWindow.activate();
      } else {
        SoundManager.playBuzzer();
        this._traitListWindow.activate();
      }
    }

    onConfirmOk() {
      if (this._selectedTraits.length === 4) {
        this.applyTraits();
        SoundManager.playOk();

        // Check if we should return to character creation
        if (Scene_TraitSelector._returnToCharacterCreation) {
          // Reset the flag
          Scene_TraitSelector._returnToCharacterCreation = false;
          Scene_TraitSelector._targetActorId = null;

          // Return to character creation scene
          // Just pop - the interrupted step mechanism will handle resuming at the correct step
          this.popScene();
        } else {
          // Normal behavior - return to previous scene
          this.popScene();
        }
      } else {
        SoundManager.playBuzzer();
        this._traitListWindow.activate();
        this._confirmWindow.deactivate();
        this._confirmWindow.hide();
      }
    }

    onConfirmCancel() {
      SoundManager.playCancel();
      this._traitListWindow.activate();
      this._confirmWindow.deactivate();
      this._confirmWindow.hide();
    }

    applyTraits() {
        const targetId = Scene_TraitSelector._targetActorId || actorId;
        const actor = $gameActors.actor(targetId);

        if (!actor) {
          console.error(`Actor with ID ${targetId} not found!`);
          return;
        }

        // Store selected traits on the actor
        if (!actor._selectedTraits) {
          actor._selectedTraits = [];
        }
        actor._selectedTraits = this._selectedTraits.slice(); // Copy array

        this._selectedTraits.forEach((trait) => {
          Object.keys(trait.positive).forEach((param) => {
            this.addParam(actor, param, trait.positive[param]);
          });
          Object.keys(trait.negative).forEach((param) => {
            this.addParam(actor, param, trait.negative[param]);
          });

          trait.skills.forEach((skillId) => {
            if ($dataSkills[skillId]) {
              actor.learnSkill(skillId);
            }
          });

          trait.items.forEach((itemId) => {
            if ($dataItems[itemId]) {
              $gameParty.gainItem($dataItems[itemId], 1);
            }
          });

          trait.equipment.forEach((itemId) => {
            if ($dataWeapons[itemId]) {
              $gameParty.gainItem($dataWeapons[itemId], 1);
            } else if ($dataArmors[itemId]) {
              $gameParty.gainItem($dataArmors[itemId], 1);
            }
          });

          trait.switches.forEach((switchId) => {
            $gameSwitches.setValue(switchId, true);
          });
        });

        actor.refresh();
      }

      // New method to apply traits by ID array (for use by other plugins like ClassSelector)
      applyTraitsByIds(traitIds, targetActorId = null) {
        const targetId = targetActorId || actorId;
        const actor = $gameActors.actor(targetId);

        if (!actor) {
          console.error(`Actor with ID ${targetId} not found!`);
          return;
        }

        if (!traitIds || traitIds.length === 0) {
          console.warn('No trait IDs provided');
          return;
        }

        // Get the Traits array from ProstheticsData
        const TraitsArray = window.ProstheticsData && window.ProstheticsData.Traits;
        if (!TraitsArray) {
          console.error('Traits array not found. Is DB.js loaded?');
          return;
        }

        // Store selected traits on the actor
        if (!actor._selectedTraits) {
          actor._selectedTraits = [];
        }

        const selectedTraits = [];

        // Collect trait objects by ID
        traitIds.forEach((traitId) => {
          const trait = TraitsArray.find((t) => t.id === traitId);
          if (trait) {
            selectedTraits.push(trait);
          } else {
            console.warn(`Trait with ID ${traitId} not found in TraitSelector data`);
          }
        });

        // Apply each selected trait
        selectedTraits.forEach((trait) => {
          // Apply positive bonuses
          Object.keys(trait.positive || {}).forEach((param) => {
            this.addParam(actor, param, trait.positive[param]);
          });

          // Apply negative bonuses
          Object.keys(trait.negative || {}).forEach((param) => {
            this.addParam(actor, param, trait.negative[param]);
          });

          // Learn skills
          (trait.skills || []).forEach((skillId) => {
            if ($dataSkills[skillId]) {
              actor.learnSkill(skillId);
            }
          });

          // Add items
          (trait.items || []).forEach((itemId) => {
            if ($dataItems[itemId]) {
              $gameParty.gainItem($dataItems[itemId], 1);
            }
          });

          // Add equipment
          (trait.equipment || []).forEach((itemId) => {
            if ($dataWeapons[itemId]) {
              $gameParty.gainItem($dataWeapons[itemId], 1);
            } else if ($dataArmors[itemId]) {
              $gameParty.gainItem($dataArmors[itemId], 1);
            }
          });

          // Set switches
          (trait.switches || []).forEach((switchId) => {
            $gameSwitches.setValue(switchId, true);
          });
        });

        // Store selected traits and refresh
        actor._selectedTraits = selectedTraits;
        actor.refresh();

        console.log(
          `Applied ${selectedTraits.length} trait(s) to actor ${targetId}: ${selectedTraits
            .map((t) => t.name.en)
            .join(', ')}`
        );
      }

    addParam(actor, paramName, value) {
  const paramMap = {
    hp: 0,      // Max HP (unchanged)
    mp: 1,      // Max MP (unchanged)
    atk: 2,     // STR (was atk)
    def: 3,     // CON (was def)
    mat: 4,     // INT (was mat)
    mdf: 5,     // SAG (was mdf)
    agi: 6,     // DES (was agi)
    luk: 7,     // PSI (was luk)
  };

      const paramId = paramMap[paramName];
      if (typeof paramId === "number") {
        if (!actor._paramPlus) {
          actor._paramPlus = [0, 0, 0, 0, 0, 0, 0, 0];
        }
        actor._paramPlus[paramId] = (actor._paramPlus[paramId] || 0) + value;
      } else if (paramName === "eva") {
        console.log(
          `Evasion modifier: ${value} (implement via traits if needed)`
        );
      }
    }
  }

  //-----------------------------------------------------------------------------
  // Window_TraitList
  //-----------------------------------------------------------------------------

  class Window_TraitList extends Window_Selectable {
    constructor(rect) {
      super(rect);
      this.refresh();
    }

    maxItems() {
      return Traits.length;
    }

    item() {
      return Traits[this.index()];
    }

    isCurrentItemEnabled() {
      const trait = this.item();
      const scene = SceneManager._scene;
      if (!scene || !scene._selectedTraits) return true;

      const isSelected = scene._selectedTraits.includes(trait);
      const canSelectMore = scene._selectedTraits.length < 4;

      // Check if this trait is incompatible with any selected traits
      const hasIncompatibleSelected = scene._selectedTraits.some(
        (selectedTrait) =>
          trait.incompatible.includes(selectedTrait.id) ||
          selectedTrait.incompatible.includes(trait.id)
      );

      return isSelected || (canSelectMore && !hasIncompatibleSelected);
    }

    drawItem(index) {
      const trait = Traits[index];
      const rect = this.itemLineRect(index);
      const scene = SceneManager._scene;
      const isSelected =
        scene._selectedTraits && scene._selectedTraits.includes(trait);
      const canSelectMore =
        !scene._selectedTraits || scene._selectedTraits.length < 4;

      // Check if this trait is incompatible with any selected traits
      const hasIncompatibleSelected = scene._selectedTraits && scene._selectedTraits.some(
        (selectedTrait) =>
          trait.incompatible.includes(selectedTrait.id) ||
          selectedTrait.incompatible.includes(trait.id)
      );

      const enabled = isSelected || (canSelectMore && !hasIncompatibleSelected);

      this.changePaintOpacity(enabled);

      if (isSelected) {
        this.changeTextColor(ColorManager.powerUpColor());
      } else if (hasIncompatibleSelected && !isSelected) {
        // Draw incompatible traits in color 3 (system color - typically red/warning)
        this.changeTextColor(ColorManager.textColor(3));
      } else if (enabled) {
        this.changeTextColor(ColorManager.normalColor());
      } else {
        this.changeTextColor(ColorManager.deathColor());
      }

      this.drawIcon(trait.icon, rect.x + 2, rect.y + 2);

      const nameText = isSelected
        ? `✓ ${getTraitText(trait, "name")}`
        : getTraitText(trait, "name");
      this.drawText(nameText, rect.x + 36, rect.y, rect.width - 36);
      this.changePaintOpacity(true);
    }

    updateHelp() {
        const trait = this.item();
        if (trait) {
          let helpText = `${getTraitText(trait, "description")}\n`;
      
          const positiveStats = Object.keys(trait.positive).map(
            (key) => `${getParamDisplayName(key)}+${trait.positive[key]}`  // Changed this line
          );
          const negativeStats = Object.keys(trait.negative).map(
            (key) => `${getParamDisplayName(key)}${trait.negative[key]}`  // Changed this line
          );
      
          if (positiveStats.length > 0) {
            helpText += `${t("benefits")} ${positiveStats.join(", ")}\n`;
          }
          if (negativeStats.length > 0) {
            helpText += `${t("drawbacks")} ${negativeStats.join(", ")}`;
          }
      
          this._helpWindow.setText(helpText);
        }
      }
  }

  //-----------------------------------------------------------------------------
  // Window_SelectedTraits
  //-----------------------------------------------------------------------------

  class Window_SelectedTraits extends Window_Base {
    constructor(rect) {
      super(rect);
      this._selectedTraits = [];
      this.refresh();
    }

    setSelectedTraits(traits) {
      this._selectedTraits = traits;
    }

    refresh() {
      this.contents.clear();
      const lineHeight = this.lineHeight();

      this.changeTextColor(ColorManager.systemColor());
      this.drawText(t("selectedTraitsLabel"), 0, 0, this.innerWidth);
      this.changeTextColor(ColorManager.normalColor());

      for (let i = 0; i < 4; i++) {
        const y = lineHeight * (i + 1);
        if (this._selectedTraits[i]) {
          const trait = this._selectedTraits[i];
          this.drawIcon(trait.icon, 0, y + 2);
          this.drawText(
            `${i + 1}. ${getTraitText(trait, "name")}`,
            36,
            y,
            this.innerWidth - 36
          );
        } else {
          this.changeTextColor(ColorManager.deathColor());
          this.drawText(`${i + 1}. ${t("emptySlot")}`, 0, y, this.innerWidth);
          this.changeTextColor(ColorManager.normalColor());
        }
      }
    }
  }

  //-----------------------------------------------------------------------------
  // Window_TraitConfirm
  //-----------------------------------------------------------------------------

  //-----------------------------------------------------------------------------
  // Window_TraitConfirm
  //-----------------------------------------------------------------------------

  class Window_TraitConfirm extends Window_Command {
    constructor(rect) {
      // Make window half width
      rect.width = rect.width / 2;
      super(rect);
      this._bonusLines = [];
    }

    makeCommandList() {
      const scene = SceneManager._scene;
      const canConfirm =
        scene && scene._selectedTraits && scene._selectedTraits.length === 4;

      // Store bonus lines separately
      this._bonusLines = [];
      if (canConfirm) {
        this._bonusLines.push(t("totalBonuses"));

        const totals = {};
        scene._selectedTraits.forEach((trait) => {
          Object.keys(trait.positive).forEach((key) => {
            totals[key] = (totals[key] || 0) + trait.positive[key];
          });
          Object.keys(trait.negative).forEach((key) => {
            totals[key] = (totals[key] || 0) + trait.negative[key];
          });
        });

        Object.keys(totals).forEach((key) => {
            const value = totals[key];
            const sign = value > 0 ? "+" : "";
            this._bonusLines.push({
              text: `  ${getParamDisplayName(key)}: ${sign}${value}`,  // Changed this line
              value: value,
            });
          });
      }

      // Add actual selectable commands
      this.addCommand(t("confirmCommand"), "ok", canConfirm);
      this.addCommand(t("continueCommand"), "cancel");
    }

    drawAllItems() {
      const lineHeight = this.lineHeight();
      let y = 0;

      // Draw bonus lines as plain text (not selectable)
      if (this._bonusLines.length > 0) {
        this._bonusLines.forEach((line, index) => {
          if (index === 0) {
            // Header line
            this.changeTextColor(ColorManager.systemColor());
            this.drawText(line, 0, y, this.innerWidth);
          } else {
            // Stat lines with color
            const value = line.value;
            this.changeTextColor(
              value >= 0
                ? ColorManager.powerUpColor()
                : ColorManager.powerDownColor()
            );
            this.drawText(line.text, 0, y, this.innerWidth);
          }
          y += lineHeight;
        });

        // Add spacing
        y += lineHeight / 2;
      }

      // Draw actual command items
      this.resetTextColor();
      const topIndex = this.topIndex();
      for (let i = 0; i < this.maxVisibleItems(); i++) {
        const index = topIndex + i;
        if (index < this.maxItems()) {
          const rect = this.itemLineRect(i);
          rect.y = y + i * lineHeight;
          this.drawItemBackground(index);
          this.drawItem(index, rect);
        }
      }
    }

    drawItem(index, rect) {
      if (!rect) {
        rect = this.itemLineRect(index);
      }
      const commandName = this.commandName(index);
      const enabled = this.isCommandEnabled(index);
      this.changePaintOpacity(enabled);
      this.drawText(commandName, rect.x, rect.y, rect.width, "left");
      this.changePaintOpacity(true);
    }

    itemRect(index) {
      const rect = super.itemRect(index);
      const bonusOffset =
        this._bonusLines.length > 0
          ? this._bonusLines.length * this.lineHeight() + this.lineHeight() / 2
          : 0;
      rect.y += bonusOffset;
      return rect;
    }

    maxVisibleItems() {
      const bonusLines =
        this._bonusLines.length > 0 ? this._bonusLines.length + 0.5 : 0;
      return Math.floor(this.innerHeight / this.lineHeight() - bonusLines);
    }
  }
// Add this after the existing plugin command registration (around line 113)

  // Helper function to randomize traits for a specific actor
  function randomizeTraitsForActor(targetActorId = null) {
    const targetId = targetActorId || actorId;

    // Get available traits (excluding incompatible ones as we select)
    const availableTraits = [...Traits];
    const selectedTraits = [];

    // Select 4 random traits (changed from 5 to 4 for consistency)
    while (selectedTraits.length < 4 && availableTraits.length > 0) {
      const randomIndex = Math.floor(Math.random() * availableTraits.length);
      const trait = availableTraits[randomIndex];
      
      // Check if this trait is compatible with already selected traits
      const isCompatible = !selectedTraits.some(selected => 
        trait.incompatible.includes(selected.id) || 
        selected.incompatible.includes(trait.id)
      );
      
      if (isCompatible) {
        selectedTraits.push(trait);
      }
      
      // Remove this trait from available pool regardless
      availableTraits.splice(randomIndex, 1);
    }

    // Apply the traits
    const actor = $gameActors.actor(targetId);

    if (!actor) {
      console.error(`Actor with ID ${targetId} not found!`);
      return;
    }
    
    // Reset actor traits first
    actor._paramPlus = [0, 0, 0, 0, 0, 0, 0, 0];
    actor._selectedTraits = [];
    
    // Apply each selected trait
    selectedTraits.forEach((trait) => {
      // Apply positive bonuses
      Object.keys(trait.positive).forEach((param) => {
        const paramMap = {
          hp: 0, mp: 1, atk: 2, def: 3, 
          mat: 4, mdf: 5, agi: 6, luk: 7
        };
        const paramId = paramMap[param];
        if (typeof paramId === "number") {
          actor._paramPlus[paramId] = (actor._paramPlus[paramId] || 0) + trait.positive[param];
        }
      });
      
      // Apply negative bonuses
      Object.keys(trait.negative).forEach((param) => {
        const paramMap = {
          hp: 0, mp: 1, atk: 2, def: 3, 
          mat: 4, mdf: 5, agi: 6, luk: 7
        };
        const paramId = paramMap[param];
        if (typeof paramId === "number") {
          actor._paramPlus[paramId] = (actor._paramPlus[paramId] || 0) + trait.negative[param];
        }
      });
      
      // Learn skills
      trait.skills.forEach((skillId) => {
        if ($dataSkills[skillId]) {
          actor.learnSkill(skillId);
        }
      });
      
      // Add items
      trait.items.forEach((itemId) => {
        if ($dataItems[itemId]) {
          $gameParty.gainItem($dataItems[itemId], 1);
        }
      });
      
      // Add equipment
      trait.equipment.forEach((itemId) => {
        if ($dataWeapons[itemId]) {
          $gameParty.gainItem($dataWeapons[itemId], 1);
        } else if ($dataArmors[itemId]) {
          $gameParty.gainItem($dataArmors[itemId], 1);
        }
      });
      
      // Set switches
      trait.switches.forEach((switchId) => {
        $gameSwitches.setValue(switchId, true);
      });
    });
    
    // Store selected traits
    actor._selectedTraits = selectedTraits;
    actor.refresh();

    console.log("Randomized traits:", selectedTraits.map(t => t.name.en).join(", "));
  }

  PluginManager.registerCommand(pluginName, "randomizeTraits", (args) => {
    randomizeTraitsForActor(actorId);
  });

  // Export globally
  window.Scene_TraitSelector = Scene_TraitSelector;
  window.randomizeTraitsForActor = randomizeTraitsForActor;
})();

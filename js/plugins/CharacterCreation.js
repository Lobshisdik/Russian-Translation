/*:
 * @target MZ
 * @plugindesc Character creation flow orchestrator with step-by-step wizard UI
 * @author Omni-Lex
 * @orderAfter CharacterCreationShared
 * @orderAfter StartingEquipment
 * @orderAfter CharacterPresets
 * @orderAfter ClassSelection
 * @orderAfter TraitSelector
 * @orderAfter Health_Core
 *
 * @command characterCreation
 * @text Character Creation
 * @desc Starts the character creation sequence
 *
 * @command repriseCreation
 * @text Reprise Creation
 * @desc Resumes character creation from class selection step
 *
 * @command repriseCreationCreature
 * @text Reprise Creation Creature
 * @desc Resumes character creation from gender selection (for creatures)
 *
 * @command repriseTraitSelection
 * @text Reprise Trait Selection
 * @desc Opens the trait selector for re-selecting traits
 *
 * @arg actorId
 * @text Actor ID
 * @desc The ID of the actor to select traits for
 * @type actor
 * @default 1
 *
 * @help
 * This plugin orchestrates the entire character creation flow.
 */

(() => {
  const pluginName = "CharacterCreation";

  // Import dependencies from other plugins
  const {
    getLocalizedText,
    getLocalizedChoice,
    applyGenderAndReproduction,
    applyRandomGender,
    getGenderChoices,
    applyTraitsToActor,
    VAR_PLAYER1_GENDER,
    VAR_PLAYER2_GENDER,
    VAR_PLAYER3_GENDER,
    VAR_PLAYER1_REPRODUCTIVE_TYPE,
    VAR_PLAYER2_REPRODUCTIVE_TYPE,
    VAR_PLAYER3_REPRODUCTIVE_TYPE
  } = window.CharacterCreationUtils || {};
  const { equipRandomCompatibleWeapon, GLOBAL_STARTER_SKILLS, applyStartingGear } = window.StartingEquipment || {};
  const { getCharacterPresets, markStepCompleted, isStepCompleted, hasCompletedFirstCreation, markFirstCreationComplete, Window_CharacterPresets } = window.CharacterPresets || {};
  const { Scene_ClassSelection } = window.ClassSelection || {};

﻿  const CharacterCreationData = [
    {
      // 0: Difficulty - Show only once
      get title() {
        return getLocalizedText("Select difficulty", "Seleziona difficoltà ");
      },
      showOnlyOnce: true,
      get choices() {
        return [
          getLocalizedChoice(
            "Permadeath",
            "Permadeath",
            "permadeath",
            "In \\C[1]Permadeath mode\\C[0] if your character perish in battle you will have to create a new one. Loot the body of your past character to recover items and euros.",
            "Nella modalità  \\C[1]Permadeath\\C[0] se il tuo personaggio muore in battaglia dovrai crearne uno nuovo. Saccheggia il corpo del tuo personaggio precedente per recuperare oggetti ed euro."
          ),
          getLocalizedChoice(
            "Roguelite",
            "Roguelite",
            "roguelite",
            "In \\C[1]Roguelite mode\\C[0] if your character get defeated during battle will rewake at the base floor of the dungeon. Your allies will still die if they are not resurrected by the end of the battle.",
            "Nella modalità  \\C[1]Roguelite\\C[0] se il tuo personaggio viene sconfitto in battaglia si risveglierà  al piano base del dungeon. I tuoi alleati moriranno comunque se non vengono resuscitati entro la fine della battaglia."
          ),
        ];
      },
      handler: function (symbol) {
        $gameScreen.startFadeOut(1);
        $gameSwitches.setValue(9, symbol === "permadeath");
        $gameSwitches.setValue(33, true);
        markStepCompleted(0); // Mark this step as completed
        this.nextStep();
      },
    },
    /*
    { // 1: Combat System
        get title() { return getLocalizedText("Select your combat system", "Seleziona il tuo sistema di combattimento"); },
        showOnlyOnce: true,
        get choices() {
            return [
                getLocalizedChoice(
                    "RPG",
                    "RPG",
                    'rpg',
                    "Classic turn-based RPG combat.",
                    "Combattimento RPG classico a turni."
                ),
                
                getLocalizedChoice(
                    "Cards",
                    "Carte",
                    'cards',
                    "Tactical battles using a deck of cards.",
                    "Battaglie tattiche usando un mazzo di carte."
                ),
                getLocalizedChoice(
                    "Spirits",
                    "Spiriti",
                    'spirit',
                    "Spirit-based combat system.",
                    "Sistema di combattimento basato sugli spiriti."
                )
            ];
        },
        handler: function(symbol) {
            // Turn off all battle system switches first
            $gameSwitches.setValue(45, false);
            $gameSwitches.setValue(46, false);
            
            // Turn on the appropriate switch based on selection
            if (symbol === 'cards') {
                $gameSwitches.setValue(45, true);
            } else if (symbol === 'spirit') {
                $gameSwitches.setValue(46, true);
            }
            // RPG mode has no switch (both switches off)
            
            this.nextStep();
        }
    },*/
    {
      // 1: Character Type Selection
      get title() {
        return getLocalizedText(
          "Choose Character Type",
          "Scegli Tipo di Personaggio"
        );
      },
      get choices() {
        const currentMemberIndex = Scene_CharacterCreation._currentPartyMemberIndex || 0;

        const allChoices = [
          getLocalizedChoice(
            "Create New Character",
            "Crea Nuovo Personaggio",
            "new_character",
            "Create a brand new character from scratch.",
            "Crea un personaggio completamente nuovo da zero."
          ),
          getLocalizedChoice(
            "Create Creature",
            "Crea Creatura",
            "create_creature",
            "Create a creature character.",
            "Crea un personaggio creatura."
          ),
          getLocalizedChoice(
            "Total Random",
            "Completamente Casuale",
            "total_random",
            "Create a completely random character instantly.",
            "Crea un personaggio completamente casuale all'istante.",
            136
          ),
        ];

        // Only show "Use Existing Character" option for the first party member
        if (currentMemberIndex === 0) {
          allChoices.push(
            getLocalizedChoice(
              "Use Existing Character",
              "Usa Personaggio Esistente",
              "existing_character",
              "Select from pre-made characters.",
              "Seleziona tra personaggi già  creati."
            )
          );
        }

        return allChoices;
      },
      handler: function (symbol) {
        if (symbol === "new_character") {
          // Get the correct creature switch based on current party member (77, 78, or 79)
          const currentMemberIndex = Scene_CharacterCreation._currentPartyMemberIndex || 0;
          const creatureSwitchId = 77 + currentMemberIndex; // 77 for actor 1, 78 for actor 2, 79 for actor 3

          // Set creature switch OFF for normal character
          $gameSwitches.setValue(creatureSwitchId, false);
          this.nextStep(); // Continue to belief selection
        } else if (symbol === "create_creature") {
          // Set current actor class to 65 for creature
          const currentActor = Scene_CharacterCreation.getCurrentActor();
          if (currentActor) {
            currentActor.changeClass(65, false);
          }

          // Get the correct creature switch based on current party member (77, 78, or 79)
          const currentMemberIndex = Scene_CharacterCreation._currentPartyMemberIndex || 0;
          const creatureSwitchId = 77 + currentMemberIndex; // 77 for actor 1, 78 for actor 2, 79 for actor 3

          // Set creature switch ON for creature mode
          $gameSwitches.setValue(creatureSwitchId, true);
          Scene_CharacterCreation._isCreatureMode = true;

          this.nextStep(); // Continue to belief selection

        } else if (symbol === "total_random") {
          // Total randomization: skip all steps and create random character
          this.createTotalRandomCharacter();
        } else {
          // Go to preset selection
          this.showPresetSelection();
        }
      },
    },
    /*
    { // DISABLED: Belief
        get title() { return getLocalizedText("What do you believe in?", "In cosa credi?"); },
        get choices() {
            return [
                { name: getLocalizedText("Muscles", "Muscoli"), symbol: 'belief', value: 0 },
                { name: getLocalizedText("Science", "Scienza"), symbol: 'belief', value: 1 },
                { name: getLocalizedText("Magic", "Magia"), symbol: 'belief', value: 2 },
                { name: getLocalizedText("Religion", "Religione"), symbol: 'belief', value: 3 },
                { name: getLocalizedText("Hypercapitalism", "Ipercapitalismo"), symbol: 'belief', value: 4 },
                { name: getLocalizedText("Nothing really", "Non proprio niente"), symbol: 'belief', value: 5 }
            ];
        },
        handler: function(symbol, index) {
            const choice = this.currentStepData().choices[index];
            if (choice) $gameVariables.setValue(42, choice.value);
            this.nextStep();
        }
    },*/
    {
      // 2: Gender
      get title() {
        return getLocalizedText(
          "Select your gender:",
          "Seleziona il tuo genere:"
        );
      },
      get choices() {
        return [
          {
            name: getLocalizedText("Male", "Maschio"),
            symbol: "gender",
            value: 0,
          },
          {
            name: getLocalizedText("Female", "Femmina"),
            symbol: "gender",
            value: 1,
          },
          {
            name: getLocalizedText("Non binary", "Non binario"),
            symbol: "gender",
            value: 2,
          },
          {
            name: getLocalizedText("Cocoon", "Bozzolo"),
            symbol: "gender",
            value: 3,
          },
        ];
      },
      handler: function (symbol, index) {
        const choice = this.currentStepData().choices[index];
        if (choice) {
          const currentMemberIndex = Scene_CharacterCreation._currentPartyMemberIndex || 0;

          // Determine which gender and reproductive type variables to use
          let genderVar, reproductiveVar;
          switch (currentMemberIndex) {
            case 0:
              genderVar = VAR_PLAYER1_GENDER;
              reproductiveVar = VAR_PLAYER1_REPRODUCTIVE_TYPE;
              break;
            case 1:
              genderVar = VAR_PLAYER2_GENDER;
              reproductiveVar = VAR_PLAYER2_REPRODUCTIVE_TYPE;
              break;
            case 2:
              genderVar = VAR_PLAYER3_GENDER;
              reproductiveVar = VAR_PLAYER3_REPRODUCTIVE_TYPE;
              break;
            default:
              console.warn(`Invalid party member index: ${currentMemberIndex}`);
              genderVar = VAR_PLAYER1_GENDER;
              reproductiveVar = VAR_PLAYER1_REPRODUCTIVE_TYPE;
          }

          // Set gender variable
          $gameVariables.setValue(genderVar, choice.value);

          // Set reproduction type based on gender
          switch(choice.value){
            case 0: // Male
              $gameVariables.setValue(reproductiveVar, 0); // Testicles
              break;
            case 1: // Female
              $gameVariables.setValue(reproductiveVar, 1); // Uterus
              break;
            case 2: // Non-binary
              $gameVariables.setValue(reproductiveVar, Math.floor(Math.random() * 5)); // Random (0-4)
              break;
            case 3: // Cocoon
              $gameVariables.setValue(reproductiveVar, 4); // Mitosis
              break;
          }
        }

        // If in creature mode, skip to creature creator
        if (Scene_CharacterCreation._isCreatureMode) {
          // Get the current actor ID (1, 2, or 3)
          const currentMemberIndex = Scene_CharacterCreation._currentPartyMemberIndex || 0;
          const actorId = currentMemberIndex + 1;

          // Check if Scene_CreateCreature is available
          if (typeof Scene_CreateCreature !== 'undefined') {
            // Save the step to resume at after creature creation (trait selection)
            Scene_CharacterCreation._interruptedStep = 3; // Will resume at step 4 (traits)

            // Set the target actor ID for Scene_CreateCreature
            if (Scene_CreateCreature.setTargetActorId) {
              Scene_CreateCreature.setTargetActorId(actorId);
            }

            // Open the creature creation UI
            SceneManager.push(Scene_CreateCreature);
          } else {
            console.warn('Scene_CreateCreature not found. Make sure CharacterCreationCreature.js is loaded.');
            // Skip to trait selection
            this._step = 3; // Will be incremented to 4 by nextStep()
            this.nextStep();
          }
        } else {
          this.startWaitingForCommonEvent(97);
        }
      },
    },
    {
      // 3: Class
      get title() {
        if (Scene_CharacterCreation._isCreatureMode) {
          return getLocalizedText("Choose your skills", "Scegli le tue abilità ");
        }
        return getLocalizedText("Choose your class", "Scegli la tua classe");
      },
      get choices() {
        return [
          getLocalizedChoice(
            "Select a class",
            "Seleziona una classe",
            "select_class",
            "Choose your starting class from a list.",
            "Scegli la tua classe iniziale da una lista."
          ),
          getLocalizedChoice(
            "Random class",
            "Classe casuale",
            "random_class",
            "Be assigned a random starting class.",
            "Ti verrà  assegnata una classe iniziale casuale."
          ),
        ];
      },
      handler: function (symbol) {
        if (symbol === "select_class") {
          SceneManager.goto(Scene_ClassSelection);
        } else {
          const validClasses = $dataClasses.filter((c) => c);
          if (validClasses.length > 0) {
            const randomClass =
              validClasses[Math.floor(Math.random() * validClasses.length)];
            const currentActor = Scene_CharacterCreation.getCurrentActor();
            if (currentActor) {
              currentActor.changeClass(randomClass.id, true);
              // Equip random compatible weapon for the random class
              equipRandomCompatibleWeapon(currentActor, randomClass.id);
            }
          }
          this.nextStep();
        }
      },
    },
    {
      // 4: Traits
      get title() {
        return getLocalizedText(
          "Select your traits",
          "Seleziona i tuoi tratti"
        );
      },
      get choices() {
        return [
          getLocalizedChoice(
            "Pick traits",
            "Scegli tratti",
            "pick_traits",
            "Choose your character traits manually.",
            "Scegli manualmente i tratti del tuo personaggio.",
            106
          ),
          getLocalizedChoice(
            "Randomize traits",
            "Tratti casuali",
            "random_traits",
            "Have traits randomly assigned to your character.",
            "I tratti verranno assegnati casualmente al tuo personaggio.",
            136
          ),
          getLocalizedChoice(
            "No special traits",
            "Nessun tratto speciale",
            "no_traits",
            "Start with no special traits.",
            "Inizia senza nessun tratto particolare.",
            null
          ),
        ];
      },
      handler: function (symbol, index) {
        if (symbol === "no_traits") {
          // Move to next step instead of ending
          this.nextStep();
        } else if (symbol === "pick_traits") {
          // Open trait selector scene directly
          const currentMemberIndex = Scene_CharacterCreation._currentPartyMemberIndex || 0;
          const targetActorId = currentMemberIndex + 1; // Actor IDs are 1-based

          // Save current step so we can resume at step 5 after trait selection
          Scene_CharacterCreation._interruptedStep = 4; // Will resume at step 5 (Add Party Member)

          // Prepare TraitSelector to return to character creation
          if (window.Scene_TraitSelector) {
            window.Scene_TraitSelector.prepare(true, targetActorId);
            SceneManager.push(window.Scene_TraitSelector);
          } else {
            console.error("Scene_TraitSelector not loaded!");
            this.nextStep();
          }
        } else if (symbol === "random_traits") {
          // Apply random traits using the TraitSelector plugin command
          const currentMemberIndex = Scene_CharacterCreation._currentPartyMemberIndex || 0;
          const targetActorId = currentMemberIndex + 1; // Actor IDs are 1-based

          // Call randomizeTraits from TraitSelector
          if (window.randomizeTraitsForActor) {
            window.randomizeTraitsForActor(targetActorId);
          } else {
            console.warn("TraitSelector randomizeTraitsForActor not available, using common event fallback");
            const choice = this.currentStepData().choices[index];
            this.startWaitingForCommonEvent(choice.value);
            return;
          }

          // Move to next step
          this.nextStep();
        } else {
          const choice = this.currentStepData().choices[index];
          this.startWaitingForCommonEvent(choice.value);
        }
      },
    },
    {
      // 5: Add Party Member
      get title() {
        return getLocalizedText(
          "Add another party member?",
          "Aggiungere un altro membro del gruppo?"
        );
      },
      get choices() {
        return [
          getLocalizedChoice(
            "Yes, add member",
            "Sà¬, aggiungi membro",
            "add_member",
            "Create another party member.",
            "Crea un altro membro del gruppo.",
            null
          ),
          getLocalizedChoice(
            "No, continue",
            "No, continua",
            "no_more_members",
            "Continue with current party.",
            "Continua con il gruppo attuale.",
            null
          ),
        ];
      },
      handler: function (symbol, index) {
        if (symbol === "add_member") {
          // Check if party is full (max 3 members)
          const currentPartySize = $gameParty.size();

          if (currentPartySize >= 3) {
            // Party is full, automatically close the scene
            markFirstCreationComplete();
            this.popScene();
            return;
          }

          // Set current party member index for next character
          const nextMemberIndex = $gameParty.size(); // This will be 1 or 2 (for actors 2 or 3)
          Scene_CharacterCreation._currentPartyMemberIndex = nextMemberIndex;

          // Add the next actor to the party
          $gameParty.addActor(nextMemberIndex + 1); // Actor IDs are 1-based (1, 2, 3)

          // Reset creature mode flag for new character
          Scene_CharacterCreation._isCreatureMode = false;

          // Go back to step 1 (Character Type Selection) for the new member
          this._step = 0; // Will be incremented to 1 by nextStep()
          this.nextStep();
        } else {
          // End character creation
          markFirstCreationComplete();
          this.popScene();
        }
      },
    },
  ];

  // --- Scene_CharacterCreation ---
  class Scene_CharacterCreation extends Scene_MenuBase {
    static _interruptedStep = -1; // Add this line
    static _startStep = 0;
    static _isCreatureMode = false; // Track if started from creature command
    static _traitsProcessed = false; // Track if traits step has been processed once
    static _currentPartyMemberIndex = 0; // Track which party member is being created (0=first, 1=second, 2=third)
    static getStartingStep() {
      // Only skip showOnlyOnce steps if first creation is already complete
      if (hasCompletedFirstCreation()) {
        let step = 0;
        while (step < CharacterCreationData.length) {
          const stepData = CharacterCreationData[step];
          if (stepData.showOnlyOnce && isStepCompleted(step)) {
            step++;
          } else {
            break;
          }
        }
        return step;
      }
      // First time: start from step 0 regardless
      return 0;
    }
    static prepare(startStep = 0) {
      this._startStep = startStep;
    }
    // Helper method to get the current actor being created
    static getCurrentActor() {
      const actorId = this._currentPartyMemberIndex + 1; // Actor IDs are 1-based
      return $gameActors.actor(actorId);
    }
    // Helper method to get current actor ID
    static getCurrentActorId() {
      return this._currentPartyMemberIndex + 1;
    }
    hideUI() {
      if (this._titleWindow) this._titleWindow.visible = false;
      if (this._gridWindow) {
        this._gridWindow.deactivate();
        this._gridWindow.visible = false;
      }
    }
    // Add these methods to Scene_CharacterCreation class

    showPresetSelection() {
      // Hide current windows
      if (this._titleWindow) this._titleWindow.visible = false;
      if (this._gridWindow) this._gridWindow.visible = false;

      // Create preset selection windows
      this.createPresetTitleWindow();
      this.createPresetWindow();
    }

    createPresetTitleWindow() {
      const rect = this.titleWindowRect();
      this._presetTitleWindow = new Window_CharacterCreationTitle(rect);
      this._presetTitleWindow.setTitle("Select Character");
      this.addWindow(this._presetTitleWindow);
    }

    createPresetWindow() {
      const rect = this.presetWindowRect();
      this._presetWindow = new Window_CharacterPresets(rect);
      this._presetWindow.setHandler("ok", this.onPresetSelect.bind(this));
      this._presetWindow.setHandler("cancel", this.onPresetCancel.bind(this));
      this.addWindow(this._presetWindow);
    }

    presetWindowRect() {
      const titleRect = this.titleWindowRect();
      const x = 50;
      const y = titleRect.y + titleRect.height + 20;
      const width = Graphics.boxWidth - 100;
      const height = Graphics.boxHeight - y - 50;
      return new Rectangle(x, y, width, height);
    }

    // MODIFIED: Reworked to apply full character preset data (inventory, skills, equips, etc.)
    onPresetSelect() {
      const preset = this._presetWindow.currentPreset();
      if (!preset) return;

      const actor = Scene_CharacterCreation.getCurrentActor();
      if (actor) {
        // Set actor properties
        actor.setName(preset.name);
        actor.setCharacterImage(preset.sprite, preset.spriteIndex);

        actor.changeClass(preset.classId, false);

        // Clear party's current inventory and gold
        $gameParty.initAllItems();
        $gameParty.gainGold(-$gameParty.gold());

        // Apply preset money and items
        $gameParty.gainGold(preset.money || 0);
        (preset.items || []).forEach((itemData) => {
          if ($dataItems[itemData.id])
            $gameParty.gainItem($dataItems[itemData.id], itemData.amount);
        });
        (preset.weapons || []).forEach((itemData) => {
          if ($dataWeapons[itemData.id])
            $gameParty.gainItem($dataWeapons[itemData.id], itemData.amount);
        });
        (preset.armors || []).forEach((itemData) => {
          if ($dataArmors[itemData.id])
            $gameParty.gainItem($dataArmors[itemData.id], itemData.amount);
        });

        // Global requirement: Add item 591
        if ($dataItems[591]) {
          $gameParty.gainItem($dataItems[591], 1);
        }

        // Learn additional skills from preset
        (preset.skills || []).forEach((skillId) => {
          actor.learnSkill(skillId);
        });

        // NEW: Add global starter skills
        GLOBAL_STARTER_SKILLS.forEach((skillId) => {
          if ($dataSkills[skillId]) {
            actor.learnSkill(skillId);
          }
        });

        // Refresh actor to apply class traits
        actor.refresh();

        // Apply preset traits if defined
        if (preset.traits && Array.isArray(preset.traits) && preset.traits.length > 0) {
          applyTraitsToActor(actor, preset.traits);
        }

        // Equip items from preset
        (preset.equips || []).forEach((itemId, slotId) => {
          if (itemId > 0) {
            const etypeId = actor.equipSlots()[slotId];
            let item = null;
            if (etypeId === 1) {
              item = $dataWeapons[itemId];
            } else {
              item = $dataArmors[itemId];
            }
            if (item) {
              actor.changeEquip(slotId, item);
            }
          }
        });

        // Store class name in variable
        const variableId = Number(parameters["classNameVariable"] || 0);
        if (variableId > 0) {
          $gameVariables.setValue(
            variableId,
            $dataClasses[preset.classId].name
          );
        }

        // Set bust name in Variable 109
        if (preset.busts) {
          $gameVariables.setValue(109, preset.busts);
        }

        // Set switches
        if (preset.switches && Array.isArray(preset.switches)) {
          preset.switches.forEach((switchId) => {
            $gameSwitches.setValue(switchId, true);
          });
        }

        // Restore creature/normal character flag from preset
        // Get the correct creature switch based on current party member (77, 78, or 79)
        const currentMemberIndex = Scene_CharacterCreation._currentPartyMemberIndex || 0;
        const creatureSwitchId = 77 + currentMemberIndex; // 77 for actor 1, 78 for actor 2, 79 for actor 3

        if (preset.isCreature !== undefined) {
          $gameSwitches.setValue(creatureSwitchId, preset.isCreature);
        } else {
          // Default to OFF (normal character) for backwards compatibility
          $gameSwitches.setValue(creatureSwitchId, false);
        }

        // Final refresh and recover
        actor.refresh();
        actor.recoverAll();
        markFirstCreationComplete();

        // Track the current preset ID for death removal
        $gameSystem._currentPresetId = preset.id;

        // Transfer player
        $gamePlayer.reserveTransfer(preset.mapId, preset.x, preset.y, 2, 0);
      }

      this.popScene();
    }

    onPresetCancel() {
      // Return to character type selection
      if (this._presetTitleWindow) {
        this._presetTitleWindow.close();
        this._presetTitleWindow = null;
      }
      if (this._presetWindow) {
        this._presetWindow.close();
        this._presetWindow = null;
      }

      // Show original windows
      if (this._titleWindow) this._titleWindow.visible = true;
      if (this._gridWindow) this._gridWindow.visible = true;
      this._gridWindow.activate();
    }

    showUI() {
      if (this._titleWindow) this._titleWindow.visible = true;
      if (this._gridWindow) {
        this._gridWindow.visible = true;
        this._gridWindow.activate();
      }
    }

    initialize() {
      super.initialize();

      // Check if we're resuming from an interrupted step (e.g., after creature creation)
      if (Scene_CharacterCreation._interruptedStep >= 0) {
        this._step = Scene_CharacterCreation._interruptedStep + 1;
        Scene_CharacterCreation._interruptedStep = -1;
      } else {
        this._step = Scene_CharacterCreation._startStep;
        Scene_CharacterCreation._startStep = 0;
      }

      this._waitingForCommonEvent = false;
      this._interpreter = null;

      // Reset traits flag for fresh character creation (not resumption from class/skills)
      if (this._step === 0) {
        Scene_CharacterCreation._traitsProcessed = false;
      }
    }

    create() {
      super.create();
      this.createTitleWindow();
      this.createGridWindow();
      this.setupStep();
    }

    createTitleWindow() {
      const rect = this.titleWindowRect();
      this._titleWindow = new Window_CharacterCreationTitle(rect);
      this.addWindow(this._titleWindow);
    }

    createGridWindow() {
      const rect = this.gridWindowRect();
      this._gridWindow = new Window_CharacterCreationGrid(rect);
      this._gridWindow.setScene(this);
      this._gridWindow.setHandler("ok", this.onGridOk.bind(this));
      // MODIFIED: Call onCancel instead of popScene
      this.addWindow(this._gridWindow);
    }

    titleWindowRect() {
      const width = Graphics.boxWidth;
      const height = this.calcWindowHeight(1, false);
      return new Rectangle(0, 0, width, height);
    }

    gridWindowRect() {
      const titleRect = this.titleWindowRect();
      const x = 0;
      const y = titleRect.y + titleRect.height;
      const width = Graphics.boxWidth;
      const height = Graphics.boxHeight - y;
      return new Rectangle(x, y, width, height);
    }

    setupStep() {
      if (this._step >= CharacterCreationData.length) {
        this.popScene();
        return;
      }

      // Auto-randomize traits for characters 2 and 3 (skip trait selection step)
      const currentMemberIndex = Scene_CharacterCreation._currentPartyMemberIndex || 0;
      if (this._step === 4 && currentMemberIndex >= 1) {
        // Characters 2 and 3: auto-randomize traits and skip to next step
        const targetActorId = currentMemberIndex + 1; // Actor IDs are 1-based

        // Call randomizeTraits from TraitSelector
        if (window.randomizeTraitsForActor) {
          window.randomizeTraitsForActor(targetActorId);
        } else {
          console.warn("TraitSelector randomizeTraitsForActor not available for auto-randomization");
        }

        // Skip to next step (Add Party Member prompt)
        this._step++;
        this.setupStep();
        return;
      }

      // Skip "Add another party member?" step if party is already full (3 members)
      if (this._step === 5 && $gameParty.size() >= 3) {
        // Party is full, mark creation complete and close the scene
        markFirstCreationComplete();
        this.popScene();
        return;
      }

      const stepData = this.currentStepData();
      this._titleWindow.setTitle(stepData.title);
      this._gridWindow.setChoices(stepData.choices);

      // NEW: Conditionally set cancel handler based on current step
      const firstStep = Scene_CharacterCreation.getStartingStep();
      if (this._step <= firstStep) {
        // Completely disable cancel handler on first step
        this._gridWindow.setHandler("cancel", null);
      } else {
        // Enable cancel handler for subsequent steps
        this._gridWindow.setHandler("cancel", this.onCancel.bind(this));
      }
    }

    currentStepData() {
      return CharacterCreationData[this._step];
    }

    nextStep() {
      this._step++;
      // Only skip showOnlyOnce steps if first creation is already complete
      if (hasCompletedFirstCreation()) {
        while (this._step < CharacterCreationData.length) {
          const stepData = CharacterCreationData[this._step];
          if (stepData.showOnlyOnce && isStepCompleted(this._step)) {
            this._step++;
          } else {
            break;
          }
        }
      }
      this.setupStep();
    }

    // NEW: Handles going to the previous step.
    previousStep() {
      // If we're in creature mode and at gender step (2), go back to character type selection (1)
      if (Scene_CharacterCreation._isCreatureMode && this._step === 2) {
        this._step = 1;
        Scene_CharacterCreation._isCreatureMode = false; // Exit creature mode
        this.setupStep();
        return;
      }

      // If we're in creature mode and at traits step (4), go back to gender (2), skipping creation method and class
      if (Scene_CharacterCreation._isCreatureMode && this._step === 4) {
        this._step = 2;
        this.setupStep();
        return;
      }

      this._step--;
      // Only skip showOnlyOnce steps when going back if first creation is already complete
      if (hasCompletedFirstCreation()) {
        while (this._step >= 0) {
          const stepData = CharacterCreationData[this._step];
          if (stepData.showOnlyOnce && isStepCompleted(this._step)) {
            this._step--;
          } else {
            break;
          }
        }
      }
      this.setupStep();
    }
    onGridOk() {
      const stepData = this.currentStepData();
      const index = this._gridWindow.index();
      const choice = stepData.choices[index];
      if (stepData.handler) {
        stepData.handler.call(this, choice.symbol, index);
      }
    }

    onCancel() {
      SoundManager.playCancel();
      this.previousStep();
    }
    // MODIFIED: Destroys windows before running the common event.
    startWaitingForCommonEvent(commonEventId) {
      // Save the current step before interrupting
      Scene_CharacterCreation._interruptedStep = this._step;

      // Hide/close UI first to avoid overlap or input issues
      this.hideUI();
      if (this._titleWindow) {
        this._titleWindow.deactivate();
        this._titleWindow.close();
      }
      if (this._gridWindow) {
        this._gridWindow.deactivate();
        this._gridWindow.close();
      }

      // Reserve CE for Scene_Map so event commands run safely on the map interpreter
      if ($dataCommonEvents[commonEventId]) {
        $gameTemp.reserveCommonEvent(commonEventId);
      }

      // Return to the map; the reserved CE will start as soon as the map interpreter is free
      SceneManager.pop();
    }

    // NEW: Creates a completely random character and skips to Add Party Member step
    createTotalRandomCharacter() {
      const currentMemberIndex = Scene_CharacterCreation._currentPartyMemberIndex || 0;
      const currentActor = Scene_CharacterCreation.getCurrentActor();

      if (!currentActor) {
        console.error("No actor available for total randomization!");
        this.nextStep();
        return;
      }

      // Generate random name using Markov chain from "names" database
      let randomName = "Random";
      if (window.generateSeededMarkovName) {
        // Use current timestamp and actor index as seed for variety
        const seed = Date.now() + currentMemberIndex * 1000;
        randomName = window.generateSeededMarkovName(
          Math.floor(seed / 1000),  // worldX equivalent
          Math.floor(seed % 1000),  // worldY equivalent
          currentMemberIndex + 1,   // eventId equivalent (use actor index)
          "names",                  // database ID
          2,                        // chain order
          4,                        // min characters
          12                        // max characters
        );
      } else if (window.textDatabases) {
        // Fallback: pick a random name from the names database
        const namesDB = window.textDatabases.find(db => db.id === "names");
        if (namesDB && namesDB.en) {
          const namesList = namesDB.en.trim().split(/\s+/);
          if (namesList.length > 0) {
            randomName = namesList[Math.floor(Math.random() * namesList.length)];
          }
        }
      }

      // Set the actor's name
      currentActor.setName(randomName);

      // Get the correct creature switch based on current party member (77, 78, or 79)
      const creatureSwitchId = 77 + currentMemberIndex; // 77 for actor 1, 78 for actor 2, 79 for actor 3

      // Randomly decide: regular character (80%) or creature (20%)
      const isCreature = Math.random() < 0.2;

      if (isCreature) {
        // Set up as creature
        $gameSwitches.setValue(creatureSwitchId, true);
        Scene_CharacterCreation._isCreatureMode = true;
        currentActor.changeClass(65, false);
      } else {
        // Set up as regular character
        $gameSwitches.setValue(creatureSwitchId, false);
        Scene_CharacterCreation._isCreatureMode = false;

        // Random class selection
        const validClasses = $dataClasses.filter((c) => c && c.id !== 65); // Exclude creature class
        if (validClasses.length > 0) {
          const randomClass = validClasses[Math.floor(Math.random() * validClasses.length)];
          currentActor.changeClass(randomClass.id, true);

          // Equip random weapon for the class
          equipRandomCompatibleWeapon(currentActor, randomClass.id);
        }
      }

      // Random gender (0-3: Male, Female, Non-binary, Cocoon)
      const randomGender = Math.floor(Math.random() * 4);

      // Determine which variables to use based on party member index
      let genderVar, reproductiveVar;
      switch (currentMemberIndex) {
        case 0:
          genderVar = VAR_PLAYER1_GENDER;
          reproductiveVar = VAR_PLAYER1_REPRODUCTIVE_TYPE;
          break;
        case 1:
          genderVar = VAR_PLAYER2_GENDER;
          reproductiveVar = VAR_PLAYER2_REPRODUCTIVE_TYPE;
          break;
        case 2:
          genderVar = VAR_PLAYER3_GENDER;
          reproductiveVar = VAR_PLAYER3_REPRODUCTIVE_TYPE;
          break;
        default:
          genderVar = VAR_PLAYER1_GENDER;
          reproductiveVar = VAR_PLAYER1_REPRODUCTIVE_TYPE;
      }

      // Set gender variable
      $gameVariables.setValue(genderVar, randomGender);

      // Set reproduction type based on gender
      switch(randomGender) {
        case 0: // Male
          $gameVariables.setValue(reproductiveVar, 0); // Testicles
          break;
        case 1: // Female
          $gameVariables.setValue(reproductiveVar, 1); // Uterus
          break;
        case 2: // Non-binary
          $gameVariables.setValue(reproductiveVar, Math.floor(Math.random() * 5)); // Random (0-4)
          break;
        case 3: // Cocoon
          $gameVariables.setValue(reproductiveVar, 4); // Mitosis
          break;
      }

      // Random traits
      const targetActorId = currentMemberIndex + 1; // Actor IDs are 1-based
      if (window.randomizeTraitsForActor) {
        window.randomizeTraitsForActor(targetActorId);
      } else {
        console.warn("TraitSelector randomizeTraitsForActor not available for total randomization");
      }

      // Random sprite selection
      let selectedSprite = null;
      if (window.selectRandomSpriteForActor) {
        selectedSprite = window.selectRandomSpriteForActor(targetActorId);
        console.log(`Total Random: Selected sprite ${selectedSprite.name} (${selectedSprite.index}) for actor ${targetActorId}`);
      } else {
        console.warn("selectRandomSpriteForActor not available for total randomization");
      }

      // Set bust based on SPRITES_ASSOCIATION for the selected sprite
      if (selectedSprite && window.Sprites && window.Sprites.SPRITES_ASSOCIATION) {
        const SPRITES_ASSOCIATION = window.Sprites.SPRITES_ASSOCIATION;
        const spriteName = selectedSprite.name;
        const spriteIndex = selectedSprite.index;

        // Check if this sprite has an associated bust
        if (SPRITES_ASSOCIATION[spriteName] && SPRITES_ASSOCIATION[spriteName][spriteIndex]) {
          const associatedBust = SPRITES_ASSOCIATION[spriteName][spriteIndex];

          // Set Variable 109 for actor 1, Variable 107 for actor 2, Variable 108 for actor 3
          if (targetActorId === 1) {
            $gameVariables.setValue(109, associatedBust);
            console.log(`Total Random: Set bust ${associatedBust} for actor 1 (Variable 109)`);
          } else if (targetActorId === 2) {
            $gameVariables.setValue(107, associatedBust);
            console.log(`Total Random: Set bust ${associatedBust} for actor 2 (Variable 107)`);
          } else if (targetActorId === 3) {
            $gameVariables.setValue(108, associatedBust);
            console.log(`Total Random: Set bust ${associatedBust} for actor 3 (Variable 108)`);
          }
        } else {
          // No association found, fall back to random bust selection
          console.log(`Total Random: No SPRITES_ASSOCIATION found for ${spriteName}[${spriteIndex}], selecting random bust`);
          if (window.selectRandomBustForActor) {
            const selectedBust = window.selectRandomBustForActor(targetActorId);
            console.log(`Total Random: Selected random bust ${selectedBust} for actor ${targetActorId}`);
          }
        }
      } else {
        // SPRITES_ASSOCIATION not available, fall back to random bust selection
        console.log(`Total Random: SPRITES_ASSOCIATION not available, selecting random bust`);
        if (window.selectRandomBustForActor) {
          const selectedBust = window.selectRandomBustForActor(targetActorId);
          console.log(`Total Random: Selected random bust ${selectedBust} for actor ${targetActorId}`);
        }
      }

      // Skip to step 5 (Add Party Member)
      this._step = 4; // Will be incremented to 5 by nextStep()
      this.nextStep();
    }

    // MODIFIED: Recreates windows after common event completion.
    update() {
      super.update();

      if (this._waitingForCommonEvent) {
        if (this._interpreter) this._interpreter.update();

        // When the CE completes, resume the flow
        if (!this._interpreter || !this._interpreter.isRunning()) {
          this._interpreter = null;
          this._waitingForCommonEvent = false;

          // Advance to the step after the CE (you were doing this already)
          this._step++;
          this.showUI();
          this.setupStep();
        }
      }
    }
  }

  // --- Window_CharacterCreationTitle ---
  class Window_CharacterCreationTitle extends Window_Base {
    initialize(rect) {
      super.initialize(rect);
      this._title = "";
    }
    setTitle(title) {
      if (this._title !== title) {
        this._title = title;
        this.refresh();
      }
    }
    refresh() {
      this.contents.clear();
      this.drawText(this._title, 0, 0, this.contents.width, "center");
    }
  }

  // --- Window_CharacterCreationGrid (FIXED) ---
  // Replace the existing Window_CharacterCreationGrid class with this updated version
  class Window_CharacterCreationGrid extends Window_Selectable {
    initialize(rect) {
      super.initialize(rect);
      this._choices = [];
      this._scene = null;
    }

    setScene(scene) {
      this._scene = scene;
      this.refresh();
    }

    // Add after the select() method in Window_CharacterCreationGrid
    select(index) {
      const lastIndex = this.index();
      super.select(index);

      // Play music preview when hovering over battle music choices
      if (
        this.index() !== lastIndex &&
        this._choices &&
        this._choices.length > 0
      ) {
      }
    }
    setChoices(choices) {
      this._choices = choices || [];
      this._choices.forEach((choice) => {
        if (choice.bgImage) {
          const bitmap = ImageManager.loadPicture(choice.bgImage);
          bitmap.addLoadListener(() => this.refresh());
        }
      });
      this.refresh();
      this.select(0);
      this.activate();
    }

    maxItems() {
      return this._choices ? this._choices.length : 0;
    }

    maxCols() {
      const numItems = this.maxItems();
      if (numItems <= 1) return 1;
      if (numItems <= 4) return 2;
      if (numItems <= 9) return 3;
      return 4;
    }

    itemHeight() {
      const numRows = Math.ceil(this.maxItems() / this.maxCols());
      if (numRows === 0) {
        return this.innerHeight;
      }
      return Math.floor(this.innerHeight / numRows);
    }

    // NEW: Helper method to wrap text without breaking words
    wrapText(text, maxWidth) {
      if (!text) return [];

      // Handle color codes and other escape sequences
      const words = text.split(" ");
      const lines = [];
      let currentLine = "";

      for (let i = 0; i < words.length; i++) {
        const word = words[i];
        const testLine = currentLine + (currentLine ? " " : "") + word;

        // Measure the text width (accounting for escape sequences)
        const testWidth = this.textSizeEx(testLine).width;

        if (testWidth <= maxWidth) {
          currentLine = testLine;
        } else {
          if (currentLine) {
            lines.push(currentLine);
            currentLine = word;
          } else {
            // Single word is too long, force it on its own line
            lines.push(word);
          }
        }
      }

      if (currentLine) {
        lines.push(currentLine);
      }

      return lines;
    }

    // NEW: Calculate text size including escape sequences
    textSizeEx(text) {
      const tempTextState = this.createTextState(text, 0, 0, 0);
      tempTextState.drawing = false; // Don't actually draw
      this.processAllText(tempTextState);
      return {
        width: tempTextState.outputWidth,
        height: tempTextState.outputHeight,
      };
    }

    // UPDATED: Improved drawItem method with proper word wrapping
    drawItem(index) {
      const choice = this._choices[index];
      if (!choice) return;

      const rect = this.itemRect(index);

      // Draw background image if available
      if (choice.bgImage) {
        const bitmap = ImageManager.loadPicture(choice.bgImage);
        if (bitmap.isReady()) {
          this.contents.blt(
            bitmap,
            0,
            0,
            bitmap.width,
            bitmap.height,
            rect.x,
            rect.y,
            rect.width,
            rect.height
          );
        }
      }

      // Draw semi-transparent background for text readability
      const textPadding = 8;
      this.contents.fillRect(
        rect.x + 4,
        rect.y + 4,
        rect.width - 8,
        rect.height - 8,
        "rgba(0, 0, 0, 0.6)"
      );

      // Draw choice name (title)
      this.resetFontSettings();
      this.changeTextColor(ColorManager.systemColor());
      this.contents.fontSize += 4;

      this.drawText(
        choice.name,
        rect.x,
        rect.y + textPadding,
        rect.width,
        "center"
      );

      // Draw description with word wrapping
      this.resetFontSettings();
      if (choice.description) {
        const descY = rect.y + textPadding + this.lineHeight() + 4; // Add small gap
        const availableWidth = rect.width - textPadding * 2;
        const availableHeight = rect.height - (descY - rect.y) - textPadding;

        this.drawWrappedDescription(
          choice.description,
          rect.x + textPadding,
          descY,
          availableWidth,
          availableHeight
        );
      }
    }

    // NEW: Method to draw wrapped description text
    drawWrappedDescription(description, x, y, maxWidth, maxHeight) {
      const wrappedLines = this.wrapText(description, maxWidth);
      const lineHeight = this.lineHeight();
      const maxLines = Math.floor(maxHeight / lineHeight);

      // Limit the number of lines to fit in the available space
      const linesToDraw = Math.min(wrappedLines.length, maxLines);

      for (let i = 0; i < linesToDraw; i++) {
        const lineY = y + i * lineHeight;
        let lineText = wrappedLines[i];

        // If this is the last line we can draw and there are more lines, add ellipsis
        if (i === linesToDraw - 1 && wrappedLines.length > maxLines) {
          // Check if we need to truncate to fit ellipsis
          const ellipsis = "...";
          const ellipsisWidth = this.textWidth(ellipsis);

          while (
            this.textSizeEx(lineText + ellipsis).width > maxWidth &&
            lineText.length > 0
          ) {
            lineText = lineText.slice(0, -1);
          }
          lineText += ellipsis;
        }

        // Draw the line using drawTextEx to handle color codes
        this.drawTextEx(lineText, x, lineY, maxWidth);
      }
    }
  }

  // Plugin Commands
  PluginManager.registerCommand(pluginName, "characterCreation", () => {
    const startStep = Scene_CharacterCreation.getStartingStep();
    Scene_CharacterCreation.prepare(startStep);
    SceneManager.push(Scene_CharacterCreation);
  });

  PluginManager.registerCommand(pluginName, "repriseCreation", () => {
    let startStep;

    if (Scene_CharacterCreation._interruptedStep >= 0) {
      startStep = Scene_CharacterCreation._interruptedStep + 1;
      Scene_CharacterCreation._interruptedStep = -1;
    } else {
      startStep = 3;
      while (startStep < CharacterCreationData.length) {
        const stepData = CharacterCreationData[startStep];
        if (stepData.showOnlyOnce && isStepCompleted(startStep)) {
          startStep++;
        } else {
          break;
        }
      }
    }

    Scene_CharacterCreation._isCreatureMode = false;
    Scene_CharacterCreation.prepare(startStep);
    SceneManager.push(Scene_CharacterCreation);
  });

  PluginManager.registerCommand(pluginName, "repriseCreationCreature", () => {
    let startStep;

    if (Scene_CharacterCreation._interruptedStep >= 0) {
      startStep = Scene_CharacterCreation._interruptedStep + 1;
      Scene_CharacterCreation._interruptedStep = -1;
    } else {
      startStep = 2;
      while (startStep < CharacterCreationData.length) {
        const stepData = CharacterCreationData[startStep];
        if (stepData.showOnlyOnce && isStepCompleted(startStep)) {
          startStep++;
        } else {
          break;
        }
      }
    }

    Scene_CharacterCreation._isCreatureMode = true;
    Scene_CharacterCreation.prepare(startStep);
    SceneManager.push(Scene_CharacterCreation);
  });

  PluginManager.registerCommand(pluginName, "repriseTraitSelection", (args) => {
    const targetActorId = args.actorId ? parseInt(args.actorId) : 1;

    if (window.Scene_TraitSelector) {
      window.Scene_TraitSelector.prepare(true, targetActorId);
      SceneManager.push(window.Scene_TraitSelector);
    } else {
      console.error("Scene_TraitSelector not available!");
    }
  });

  // Export to global namespace
  window.Scene_CharacterCreation = Scene_CharacterCreation;

  console.log(`${pluginName} loaded successfully.`);
})();

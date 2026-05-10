/*:
 * @target MZ
 * @plugindesc v2.0.0 - Unified Split-Screen Local Multiplayer with Gamepad Support.
 * @author Omni-Lex (Unification of SplitScreenMultiplayer & SplitScreenTwoPlayer)
 * @help
 * This plugin implements a high-performance local split-screen system.
 * 
 * --- FEATURES ---
 * - TRUE SPLIT-SCREEN: Independent viewports for both players using PIXI masks.
 * - DYNAMIC MERGING: Viewports merge into one when players are close.
 * - SMART INPUT: Automatically detects and assigns gamepads.
 * - P2 AGENCY: Player 2 can interact with events and triggers.
 * - UNIFIED MENU: Managed via a dedicated "Split-Screen" menu scene.
 *
 * --- SETUP ---
 * 1. Create an event named "Player 2" on your maps to define the spawn point.
 * 2. Access the "Multiplayer" (Local) menu via the Title or Pause screen.
 * 3. Configure controls and orientation in the plugin parameters.
 *
 * @param ---General---
 * @default
 *
 * @param Player2EventName
 * @text Player 2 Event Name
 * @desc The name of the event on the map that marks Player 2's spawn point.
 * @type text
 * @default Player 2
 *
 * @param ProximityThreshold
 * @text Proximity Threshold (tiles)
 * @desc How close (in tiles) players must be to merge into single-screen.
 * @type number
 * @min 1
 * @max 30
 * @default 8
 *
 * @param SplitOrientation
 * @text Split Orientation
 * @desc How the screen is split for two players.
 * @type select
 * @option Vertical (Left/Right)
 * @value vertical
 * @option Horizontal (Top/Bottom)
 * @value horizontal
 * @default vertical
 *
 * @param AutoStartSplitScreen
 * @text Auto-Start Split-Screen
 * @desc Automatically start a split-screen session with a random character on new game.
 * @type boolean
 * @default false
 *
 * @param ---Character Pool---
 * @default
 *
 * @param CharacterPool
 * @text Character Image Pool
 * @desc JSON array of character image names for random P2 selection.
 * @type text
 * @default ["Actor1","Actor2","Actor3"]
 *
 * @param CharacterIndexPool
 * @text Character Index Pool
 * @desc JSON array of character indexes (0-7) matching the pool above.
 * @type text
 * @default [0,1,2]
 *
 * @param ---Keyboard Controls---
 * @default
 *
 * @param P2KeyUp
 * @text P2 Key Up
 * @default w
 *
 * @param P2KeyDown
 * @text P2 Key Down
 * @default s
 *
 * @param P2KeyLeft
 * @text P2 Key Left
 * @default a
 *
 * @param P2KeyRight
 * @text P2 Key Right
 * @default d
 *
 * @param P2KeyAction
 * @text P2 Key Action (OK)
 * @default e
 *
 * @param P2KeyDash
 * @text P2 Key Dash (Shift)
 * @default q
 *
 * @param ---Gamepad---
 * @default
 *
 * @param P2StickDeadzone
 * @text P2 Left Stick Deadzone
 * @desc Deadzone threshold for the left analog stick (0.0-1.0).
 * @type text
 * @default 0.25
 *
 */

(() => {
    "use strict";

    const PLUGIN_NAME = "SplitScreenMultiplayer";
    const params = PluginManager.parameters(PLUGIN_NAME);

    const P2_EVENT_NAME = String(params["Player2EventName"] || "Player2");
    const PROXIMITY = Number(params["ProximityThreshold"] || 8);
    const SPLIT_DIR = String(params["SplitOrientation"] || "vertical");
    const AUTO_START = params["AutoStartSplitScreen"] === "true";

    let CHAR_POOL, INDEX_POOL;

    const SKAB_POOL = [
        "!$11", "!$14", "!$19", "!$2", "!$21", "!$28", "!$3", "!$32", "!$33", "!$46", "!$49", "!$59",
        "!$AirlinePilot", "!$AlienDargos", "!$AlienGrey", "!$AlienTrucker", "!$AlpineGuide", "!$Anarchist", "!$AnarchistSamurai",
        "!$AncientWitch", "!$AndroidArchpriest", "!$AndroidExperiment", "!$Archivist", "!$ArchivistBackpacker", "!$ArchivistGuard",
        "!$ArcticWorker", "!$AvianCommando", "!$AvianNoble", "!$BotGuardian", "!$BotSamurai", "!$BotSpaceman", "!$Catboy",
        "!$CatCourier", "!$CyberWitch", "!$DesertPunk", "!$Doctor2", "!$ElvenArchmage", "!$ElvenPirate", "!$ElvenSpacer",
        "!$EM", "!$emtest2", "!$Enchantress", "!$ExoticBard", "!$Farmer", "!$Fisherman", "!$GnomeExplorer", "!$GoblinIllusionist",
        "!$GoblinRecruit", "!$GoblinShogun", "!$GoblinWitch", "!$HighCommand", "!$KillerBot", "!$KoboldAssassin", "!$KoboldPunk",
        "!$LeatherDaddy", "!$Lich", "!$Madman", "!$Mafia", "!$Noblewoman", "!$Nun", "!$Nurse2", "!$OperaSinger",
        "!$OrcSamurai", "!$OrcSecretary", "!$PirateAdventurer", "!$Porcupine", "!$PrimaryDoctor", "!$Samurai", "!$SchoolTeacher",
        "!$SwordInstructor", "!$TarotWitch", "!$TribalChief", "!$VillageSpritist", "!$VoidPerson", "!$VoidSpacer", "!$VoidWorm",
        "!$WarManager", "!$WarPilot", "!$WastelandDJ", "!$WastelandParamedic", "!$Witch1", "46", "49", "59", "emtest2"
    ].map(name => "Skab/" + name);

    try {
        CHAR_POOL = SKAB_POOL;
        INDEX_POOL = SKAB_POOL.map(name => name.includes("!$") ? 0 : 0); // Default to 0 for index
    } catch (e) {
        CHAR_POOL = SKAB_POOL;
        INDEX_POOL = SKAB_POOL.map(name => 0);
    }

    const P2_KEYS = {
        up: String(params["P2KeyUp"] || "w").toLowerCase(),
        down: String(params["P2KeyDown"] || "s").toLowerCase(),
        left: String(params["P2KeyLeft"] || "a").toLowerCase(),
        right: String(params["P2KeyRight"] || "d").toLowerCase(),
        action: String(params["P2KeyAction"] || "e").toLowerCase(),
        dash: String(params["P2KeyDash"] || "q").toLowerCase()
    };

    const P2_STICK_DEAD = parseFloat(params["P2StickDeadzone"] || "0.25");

    // Remove Numpad from standard Input to reserve for P2
    delete Input.keyMapper[96];  // Numpad 0
    delete Input.keyMapper[98];  // Numpad 2
    delete Input.keyMapper[100]; // Numpad 4
    delete Input.keyMapper[102]; // Numpad 6
    delete Input.keyMapper[104]; // Numpad 8
    delete Input.keyMapper[107]; // Numpad +
    delete Input.keyMapper[110]; // Numpad .

    // =========================================================================
    // I18N Helper for Traits
    // =========================================================================
    let _traitsI18nData = null;

    const resolveI18nPath = (path, obj) => {
        if (!path || !obj) return null;
        return path.split('.').reduce((acc, part) => acc && acc[part], obj);
    };

    const loadTraitsI18n = async () => {
        const lang = ConfigManager.language || "en";
        const url = `js/plugins/i18n/${lang}/traits.json`;
        try {
            const response = await fetch(url);
            _traitsI18nData = await response.json();
            return _traitsI18nData;
        } catch (e) {
            console.error("SplitScreenMultiplayer: Failed to load i18n data from " + url, e);
            return null;
        }
    };

    // =========================================================================
    // GamepadManager (Smart Detection)
    // =========================================================================
    class GamepadManager {
        static getConnectedCount() {
            const gps = navigator.getGamepads ? navigator.getGamepads() : [];
            return Array.from(gps).filter(gp => !!gp).length;
        }

        static getP2GamepadIndex() {
            const count = this.getConnectedCount();
            // If 2+ controllers: P1=0, P2=1. If 1 controller: P1=KB, P2=0.
            return count >= 2 ? 1 : (count === 1 ? 0 : -1);
        }

        static getP1GamepadIndex() {
            const count = this.getConnectedCount();
            return count >= 2 ? 0 : -1; // P1 only gets a gamepad if 2+ are connected
        }

        static isButtonPressed(gpIndex, btnIndex) {
            if (gpIndex < 0) return false;
            const gp = navigator.getGamepads()[gpIndex];
            return gp && gp.buttons[btnIndex] && gp.buttons[btnIndex].pressed;
        }

        static getAxisValue(gpIndex, axisIndex) {
            if (gpIndex < 0) return 0;
            const gp = navigator.getGamepads()[gpIndex];
            if (!gp || !gp.axes) return 0;
            const val = gp.axes[axisIndex];
            return Math.abs(val) > P2_STICK_DEAD ? val : 0;
        }
    }

    // =========================================================================
    // Equipment Lock
    // =========================================================================
    const _Game_Actor_isEquipChangeOk = Game_Actor.prototype.isEquipChangeOk;
    Game_Actor.prototype.isEquipChangeOk = function (slotId) {
        if (this._p2Generated) return false;
        return _Game_Actor_isEquipChangeOk.call(this, slotId);
    };

    // Hide Followers when Split-Screen is active
    const _Game_Followers_update = Game_Followers.prototype.update;
    Game_Followers.prototype.update = function () {
        if (SplitScreenManager.active && SplitScreenManager.p2Event) {
            this._data.forEach(follower => follower.setOpacity(0));
            return;
        }
        _Game_Followers_update.call(this);
    };

    const _Game_Follower_isVisible = Game_Follower.prototype.isVisible;
    Game_Follower.prototype.isVisible = function () {
        if (SplitScreenManager.active && SplitScreenManager.p2Event) return false;
        return _Game_Follower_isVisible.call(this);
    };

    // =========================================================================
    // SplitScreenManager
    // =========================================================================
    const SplitScreenManager = {
        active: false,
        p2EventName: P2_EVENT_NAME,
        p2CharName: "",
        p2CharIndex: 0,
        p2Event: null,
        isSplit: false,
        p2Input: { up: false, down: false, left: false, right: false, action: false, dash: false },
        _prevP2Input: { up: false, down: false, left: false, right: false, action: false, dash: false },
        _savedPartyIds: [],

        init() {
            this.active = false;
            this.p2Event = null;
            this.isSplit = false;
            this._savedPartyIds = [];
        },

        resolveP2Character() {
            if ($gameParty && $gameParty.members().length >= 2) {
                const actor = $gameParty.members()[1];
                this.p2CharName = actor.characterName();
                this.p2CharIndex = actor.characterIndex();
                this._p2ActorId = actor.actorId();
            } else {
                // Fallback
                this.p2CharName = "";
                this.p2CharIndex = 0;
            }
        },

        createSelectionPool() {
            const pool = [];
            // 1. Existing members (skip P1)
            if ($gameParty) {
                const members = $gameParty.members();
                for (let i = 1; i < members.length; i++) {
                    const actor = members[i];
                    pool.push({
                        type: "existing",
                        actor: actor,
                        name: actor.name(),
                        className: actor.currentClass().name,
                        characterName: actor.characterName(),
                        characterIndex: actor.characterIndex(),
                        traits: actor._selectedTraits || [],
                        weapon: actor.weapons()[0],
                        stats: {
                            atk: actor.atk, def: actor.def, mat: actor.mat,
                            mdf: actor.mdf, agi: actor.agi, luk: actor.luk
                        }
                    });
                }
            }
            // 2. Generated candidates
            this.generateCandidates().forEach(c => {
                c.type = "generated";
                pool.push(c);
            });
            return pool;
        },

        generateCandidates() {
            const candidates = [];
            const names = ["Aria", "Boran", "Caelum", "Dara", "Eon", "Fay", "Gael", "Hera", "Ikar", "Juno", "Kael", "Lina"];

            // Get available classes from ClassSelection plugin or default
            const classParams = PluginManager.parameters("CharacterCreationClassSelector");
            let availableClasses = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
            if (classParams && classParams["availableClasses"]) {
                availableClasses = classParams["availableClasses"].split(",").map(id => Number(id.trim()));
            }

            const TraitsArray = (window.Health && window.Health.Traits) || [];

            for (let i = 0; i < 3; i++) {
                const classId = availableClasses[Math.floor(Math.random() * availableClasses.length)];
                const classData = $dataClasses[classId];
                const charIdx = Math.floor(Math.random() * SKAB_POOL.length);
                const charName = SKAB_POOL[charIdx];
                const charIndex = charName.includes("!$") ? 0 : Math.floor(Math.random() * 8);

                // Pick 2 random traits
                const traits = [];
                if (TraitsArray.length > 0) {
                    for (let j = 0; j < 2; j++) {
                        const trait = TraitsArray[Math.floor(Math.random() * TraitsArray.length)];
                        if (!traits.includes(trait)) traits.push(trait);
                        else j--;
                    }
                }

                // Pre-determine weapon
                let weapon = null;
                if (window.StartingEquipment) {
                    const types = window.StartingEquipment.getCompatibleWeaponTypes(classId);
                    const pool = window.StartingEquipment.getCompatibleWeapons(types);
                    if (pool.length > 0) {
                        weapon = pool[Math.floor(Math.random() * pool.length)];
                    }
                }

                candidates.push({
                    name: names[Math.floor(Math.random() * names.length)],
                    classId: classId,
                    className: classData.name,
                    characterName: charName,
                    characterIndex: charIndex,
                    traits: traits,
                    weapon: weapon,
                    stats: {
                        atk: classData.params[2][1] + Math.randomInt(5),
                        def: classData.params[3][1] + Math.randomInt(5),
                        mat: classData.params[4][1] + Math.randomInt(5),
                        mdf: classData.params[5][1] + Math.randomInt(5),
                        agi: classData.params[6][1] + Math.randomInt(5),
                        luk: classData.params[7][1] + Math.randomInt(5)
                    }
                });
            }
            return candidates;
        },

        applyCandidateToActor(candidate, actorId) {
            const actor = $gameActors.actor(actorId);
            actor.setup(actorId);
            actor.setName(candidate.name);
            actor.changeClass(candidate.classId, false);
            actor.setCharacterImage(candidate.characterName, candidate.characterIndex);

            // Apply stats
            for (let i = 2; i < 8; i++) {
                const paramName = ["atk", "def", "mat", "mdf", "agi", "luk"][i - 2];
                actor.addParam(i, candidate.stats[paramName] - actor.param(i));
            }

            // Apply Traits
            if (window.CharacterCreationUtils && window.CharacterCreationUtils.applyTraitsToActor) {
                window.CharacterCreationUtils.applyTraitsToActor(actor, candidate.traits.map(t => t.id));
            }

            // Apply Equipment
            if (candidate.weapon) {
                $gameParty.gainItem(candidate.weapon, 1);
                actor.changeEquip(0, candidate.weapon);
                if (window.StartingEquipment && window.StartingEquipment.learnStarterSkills) {
                    window.StartingEquipment.learnStarterSkills(actor);
                }
            } else if (window.StartingEquipment && window.StartingEquipment.applyStartingGear) {
                window.StartingEquipment.applyStartingGear(actor, candidate.classId);
            }

            // Lock equipment
            actor._p2Generated = true;
            this._p2ActorId = actorId;
        },

        startSession(candidate) {
            this._savedPartyIds = $gameParty._actors.slice();
            const p1Id = $gameParty._actors[0];

            if (candidate.type === "existing") {
                const p2Id = candidate.actor.actorId();
                $gameParty._actors = [p1Id, p2Id];
                this._p2ActorId = p2Id;
            } else {
                const guestId = 4; // Using Actor 4 for generated guest
                this.applyCandidateToActor(candidate, guestId);
                $gameParty._actors = [p1Id, guestId];
                this._p2ActorId = guestId;
            }

            $gamePlayer.refresh();
            this.active = true;
            $gameSwitches.setValue(67, true);
            this.resolveP2Character();
            if (typeof findOrCreateP2Event === 'function') findOrCreateP2Event(true);

            // Disable MousePanZoom and restore defaults
            $gameSystem._mousePanZoomDisabled = true;
            $gameScreen.setZoom(Graphics.width / 2, Graphics.height / 2, 1.0);
            $gameMap.setDisplayPos($gamePlayer.x - $gameMap.screenTileX() / 2, $gamePlayer.y - $gameMap.screenTileY() / 2);
        },

        stopSession() {
            this.active = false;
            if (this._p2ActorId) {
                const actor = $gameActors.actor(this._p2ActorId);
                if (actor && actor._p2Generated) {
                    actor._p2Generated = false;
                }
            }
            if (this._savedPartyIds && this._savedPartyIds.length > 0) {
                $gameParty._actors = this._savedPartyIds.slice();
                this._savedPartyIds = [];
            }
            $gameSwitches.setValue(67, false);
            this.p2Event = null;
            this.isSplit = false;
            $gamePlayer.refresh();

            // Re-enable MousePanZoom
            $gameSystem._mousePanZoomDisabled = false;
        },

        pollInput() {
            // Save previous
            Object.assign(this._prevP2Input, this.p2Input);

            // Keyboard
            const keys = window._p2Keys || {};
            const codes = window._p2Codes || {};

            let up = !!keys[P2_KEYS.up] || !!codes["Numpad8"];
            let down = !!keys[P2_KEYS.down] || !!codes["Numpad2"];
            let left = !!keys[P2_KEYS.left] || !!codes["Numpad4"];
            let right = !!keys[P2_KEYS.right] || !!codes["Numpad6"];
            let action = !!keys[P2_KEYS.action] || !!codes["NumpadEnter"] || !!codes["Numpad0"];
            let dash = !!keys[P2_KEYS.dash] || !!codes["ShiftRight"];

            // Gamepad
            const gpIndex = GamepadManager.getP2GamepadIndex();
            if (gpIndex >= 0) {
                if (GamepadManager.isButtonPressed(gpIndex, 12)) up = true;    // D-Pad Up
                if (GamepadManager.isButtonPressed(gpIndex, 13)) down = true;  // D-Pad Down
                if (GamepadManager.isButtonPressed(gpIndex, 14)) left = true;  // D-Pad Left
                if (GamepadManager.isButtonPressed(gpIndex, 15)) right = true; // D-Pad Right
                if (GamepadManager.isButtonPressed(gpIndex, 0)) action = true;  // A button
                if (GamepadManager.isButtonPressed(gpIndex, 1)) dash = true;    // B button

                const stickX = GamepadManager.getAxisValue(gpIndex, 0);
                const stickY = GamepadManager.getAxisValue(gpIndex, 1);
                if (stickY < 0) up = true;
                if (stickY > 0) down = true;
                if (stickX < 0) left = true;
                if (stickX > 0) right = true;
            }

            this.p2Input = { up, down, left, right, action, dash };
        },

        isTriggered(key) {
            return this.p2Input[key] && !this._prevP2Input[key];
        }
    };
    window.$gameSplitScreen = SplitScreenManager;

    // Keyboard listener
    window._p2Keys = {};
    window._p2Codes = {};
    document.addEventListener("keydown", e => {
        window._p2Keys[e.key.toLowerCase()] = true;
        window._p2Codes[e.code] = true;
    });
    document.addEventListener("keyup", e => {
        window._p2Keys[e.key.toLowerCase()] = false;
        window._p2Codes[e.code] = false;
    });

    // =========================================================================
    // Scene_SplitScreen (Styled like MultiplayerSystem.js)
    // =========================================================================
    class Scene_SplitScreen extends Scene_MenuBase {
        create() {
            super.create();
            this.createHelpWindow();
            this.createStatusWindow();
            this.createCommandWindow();
        }

        createHelpWindow() {
            const rect = new Rectangle(0, this.mainAreaTop(), Graphics.boxWidth, this.calcWindowHeight(1, false));
            this._helpWindow = new Window_Help(rect);
            this._helpWindow.setText("Local Split-Screen Management");
            this.addWindow(this._helpWindow);
        }

        createStatusWindow() {
            const ww = Math.floor(Graphics.boxWidth * 0.4);
            const wh = this.calcWindowHeight(6, true);
            const wx = Graphics.boxWidth - ww;
            const wy = this._helpWindow.y + this._helpWindow.height;
            this._statusWindow = new Window_SplitScreenStatus(new Rectangle(wx, wy, ww, wh));
            this.addWindow(this._statusWindow);
        }

        createCommandWindow() {
            const ww = Graphics.boxWidth - this._statusWindow.width;
            const wh = this._statusWindow.height;
            const wx = 0;
            const wy = this._statusWindow.y;
            this._commandWindow = new Window_SplitScreenCommand(new Rectangle(wx, wy, ww, wh));
            this._commandWindow.setHandler("toggle", this.commandToggle.bind(this));
            this._commandWindow.setHandler("cancel", this.popScene.bind(this));
            this.addWindow(this._commandWindow);
        }

        commandToggle() {
            if (!SplitScreenManager.active) {
                // Turning ON - always go to selection to choose P2
                SceneManager.push(Scene_SplitScreenCharacterSelection);
            } else {
                // Turning OFF
                SplitScreenManager.stopSession();
                this._commandWindow.refresh();
                this._statusWindow.refresh();
                this._commandWindow.activate();
            }
        }

        update() {
            super.update();
            this._statusWindow.refresh();
        }
    }

    class Window_SplitScreenCommand extends Window_Command {
        makeCommandList() {
            const label = SplitScreenManager.active ? "► Disable Split-Screen" : "► Enable Split-Screen";
            this.addCommand(label, "toggle");
        }
    }

    // =========================================================================
    // Scene_SplitScreenCharacterSelection
    // =========================================================================
    class Scene_SplitScreenCharacterSelection extends Scene_MenuBase {
        create() {
            super.create();
            this.createHelpWindow();
            this.createCandidates();
            this.createCommandWindow();

            // Load traits i18n data if not already loaded
            if (!_traitsI18nData) {
                loadTraitsI18n().then(() => {
                    if (this._detailsWindow) this._detailsWindow.refresh();
                });
            }
        }

        createHelpWindow() {
            const rect = new Rectangle(0, this.mainAreaTop(), Graphics.boxWidth, this.calcWindowHeight(1, false));
            this._helpWindow = new Window_Help(rect);
            this._helpWindow.setText("Choose your companion for Local Split-Screen");
            this.addWindow(this._helpWindow);
        }

        createCandidates() {
            this._candidates = SplitScreenManager.createSelectionPool();
        }

        createCommandWindow() {
            const ww = Graphics.boxWidth;
            const wh = 200;
            const wx = 0;
            const wy = Graphics.boxHeight - wh;
            this._commandWindow = new Window_SplitScreenCharSelect(new Rectangle(wx, wy, ww, wh), this._candidates);
            this._commandWindow.setHandler("ok", this.onCandidateOk.bind(this));
            this._commandWindow.setHandler("cancel", this.popScene.bind(this));
            this._commandWindow.setHandler("select", this.onCandidateChange.bind(this));
            this.addWindow(this._commandWindow);

            this.createDetailsWindow();

            // Activate and select first candidate
            this._commandWindow.activate();
            this._commandWindow.select(0);
        }

        createDetailsWindow() {
            const ww = Graphics.boxWidth;
            const wh = Graphics.boxHeight - this._helpWindow.height - this._commandWindow.height;
            const wx = 0;
            const wy = this._helpWindow.height;
            this._detailsWindow = new Window_SplitScreenCharDetails(new Rectangle(wx, wy, ww, wh));
            this.addWindow(this._detailsWindow);
        }

        onCandidateChange() {
            if (this._detailsWindow) {
                const candidate = this._candidates[this._commandWindow.index()];
                this._detailsWindow.setCandidate(candidate);
            }
        }

        onCandidateOk() {
            const candidate = this._candidates[this._commandWindow.index()];
            SplitScreenManager.startSession(candidate);
            SceneManager.goto(Scene_Map);
        }
    }

    class Window_SplitScreenCharSelect extends Window_HorzCommand {
        initialize(rect, candidates) {
            this._candidates = candidates;
            super.initialize(rect);
        }

        maxCols() { return this._candidates.length; }

        makeCommandList() {
            this._candidates.forEach((c, i) => {
                this.addCommand(c.name, "candidate" + i);
            });
        }

        drawItem(index) {
            const rect = this.itemLineRect(index);
            const candidate = this._candidates[index];
            this.drawText(candidate.name, rect.x, rect.y, rect.width, "center");
            this.drawText(candidate.className, rect.x, rect.y + this.lineHeight(), rect.width, "center");
        }

        itemHeight() { return this.lineHeight() * 2; }

        select(index) {
            super.select(index);
            if (this.active) {
                this.callHandler("select");
            }
        }
    }

    class Window_SplitScreenCharDetails extends Window_Base {
        setCandidate(candidate) {
            this._candidate = candidate;
            this.refresh();
        }

        getTraitName(trait) {
            const lang = ConfigManager.language || "en";
            let name = trait.name;

            if (name && typeof name === "object") {
                name = name[lang] || name["en"];
            }

            if (typeof name === "string" && name.includes('.')) {
                // Try Hendrix Localization first
                if (window.translateText) {
                    const translated = window.translateText(name);
                    if (translated !== name) return translated;
                }
                // Fallback to local traits i18n data
                if (_traitsI18nData) {
                    const localized = resolveI18nPath(name, _traitsI18nData);
                    if (localized) return localized;
                }
            }

            return name || "Unknown Trait";
        }

        refresh() {
            this.contents.clear();
            if (!this._candidate) return;

            const c = this._candidate;
            this.contents.fontSize = 32;
            this.drawText(c.name, 0, 0, this.contentsWidth(), "center");
            this.contents.fontSize = 24;
            this.drawText(c.className, 0, this.lineHeight(), this.contentsWidth(), "center");
            this.resetFontSettings();

            let y = this.lineHeight() * 2.5;
            const half = this.contentsWidth() / 2;

            // Stats
            this.changeTextColor(this.systemColor());
            const statsLabel = window.translateText ? window.translateText("Stats") : "Stats";
            this.drawText(statsLabel, 20, y, half);
            this.resetTextColor();
            y += this.lineHeight();

            const stats = [
                { n: "ATK", v: c.stats.atk }, { n: "DEF", v: c.stats.def },
                { n: "MAT", v: c.stats.mat }, { n: "MDF", v: c.stats.mdf },
                { n: "AGI", v: c.stats.agi }, { n: "LUK", v: c.stats.luk }
            ];

            stats.forEach((s, i) => {
                const sx = (i % 2) * (half / 2) + 40;
                const sy = y + Math.floor(i / 2) * this.lineHeight();
                const statName = window.translateText ? window.translateText(s.n) : s.n;
                this.drawText(`${statName}: ${s.v}`, sx, sy, half / 2);
            });

            // Equipment & Traits
            let ty = this.lineHeight() * 2.5;

            // Equipment
            this.changeTextColor(this.systemColor());
            const equipLabel = window.translateText ? window.translateText("Equipment") : "Equipment";
            this.drawText(equipLabel, half, ty, half);
            this.resetTextColor();
            ty += this.lineHeight();
            if (c.weapon) {
                const weaponName = window.translateText ? window.translateText(c.weapon.name) : c.weapon.name;
                this.drawIcon(c.weapon.iconIndex, half + 20, ty);
                this.drawText(weaponName, half + 56, ty, half - 60);
            } else {
                const noneLabel = window.translateText ? window.translateText("None") : "None";
                this.drawText(noneLabel, half + 56, ty, half - 60);
            }
            ty += this.lineHeight() * 1.5;

            // Traits
            this.changeTextColor(this.systemColor());
            const traitsLabel = window.translateText ? window.translateText("Traits") : "Traits";
            this.drawText(traitsLabel, half, ty, half);
            this.resetTextColor();
            ty += this.lineHeight();

            c.traits.forEach(t => {
                const icon = t.icon || 0;
                if (icon) this.drawIcon(icon, half + 20, ty);
                this.drawText(this.getTraitName(t), half + 56, ty, half - 60);
                ty += this.lineHeight();
            });

            // Preview (Actual Player Sprite - Scaled)
            this.drawLargeCharacter(c.characterName, c.characterIndex, this.contentsWidth() - 80, this.contentsHeight() - 20);
        }

        drawLargeCharacter(characterName, characterIndex, x, y) {
            const bitmap = ImageManager.loadCharacter(characterName);
            if (bitmap.isReady()) {
                this.contentsDrawCharacter(bitmap, characterIndex, x, y);
            } else {
                bitmap.addLoadListener(() => this.contentsDrawCharacter(bitmap, characterIndex, x, y));
            }
        }

        contentsDrawCharacter(bitmap, characterIndex, x, y) {
            if (!this._candidate) return;
            const big = ImageManager.isBigCharacter(this._candidate.characterName);
            const pw = bitmap.width / (big ? 3 : 12);
            const ph = bitmap.height / (big ? 4 : 8);
            const n = big ? 0 : characterIndex;
            const sx = ((n % 4) * 3 + 1) * pw;
            const sy = Math.floor(n / 4) * 4 * ph;
            const scale = 2;
            const dw = pw * scale;
            const dh = ph * scale;
            this.contents.blt(bitmap, sx, sy, pw, ph, x - dw / 2, y - dh, dw, dh);
        }
    }

    class Window_SplitScreenStatus extends Window_Base {
        refresh() {
            this.contents.clear();
            this.changeTextColor(this.systemColor());
            this.drawText("Status", 0, 0, this.contentsWidth(), "center");
            this.resetTextColor();

            let y = this.lineHeight();
            const gpCount = GamepadManager.getConnectedCount();
            this.drawText(`Gamepads: ${gpCount}`, 4, y);
            y += this.lineHeight();

            const active = SplitScreenManager.active;
            this.drawText(`Active: ${active ? "YES" : "NO"}`, 4, y);
            y += this.lineHeight();

            if (active) {
                const gpIdx = GamepadManager.getP2GamepadIndex();
                const inputMode = gpIdx >= 0 ? `Gamepad ${gpIdx}` : "Keyboard (WASD)";
                this.drawText(`P2 Input: ${inputMode}`, 4, y);
            }
        }
    }

    // =========================================================================
    // Core Engine Integration
    // =========================================================================
    class Scene_SplitScreenTerminate extends Scene_MenuBase {
        create() {
            super.create();
            this.createHelpWindow();
            this._helpWindow.setText("Active Multiplayer Session");
            this.createCommandWindow();
        }

        createCommandWindow() {
            const ww = 400;
            const wh = this.calcWindowHeight(1, true);
            const wx = (Graphics.boxWidth - ww) / 2;
            const wy = (Graphics.boxHeight - wh) / 2;
            this._commandWindow = new Window_MultiplayerTerminate(new Rectangle(wx, wy, ww, wh));
            this._commandWindow.setHandler("terminate", this.commandTerminate.bind(this));
            this._commandWindow.setHandler("cancel", this.popScene.bind(this));
            this.addWindow(this._commandWindow);
        }

        commandTerminate() {
            SplitScreenManager.stopSession();
            SceneManager.goto(Scene_Map);
        }
    }

    class Window_MultiplayerTerminate extends Window_Command {
        makeCommandList() {
            this.addCommand("Terminate Session", "terminate");
        }
    }

    // Export to window for access from MultiplayerSystem.js
    window.Scene_SplitScreenCharacterSelection = Scene_SplitScreenCharacterSelection;
    window.Scene_SplitScreenTerminate = Scene_SplitScreenTerminate;

    // Integrated with MultiplayerSystem's selection menu

    // Title Menu Integration removed as requested

    // Input Hijacking for P1 (Ensures P1 doesn't use P2's gamepad)
    const _Input_updateGamepadState = Input._updateGamepadState;
    Input._updateGamepadState = function (gamepad) {
        if (SplitScreenManager.active) {
            const p1GpIdx = GamepadManager.getP1GamepadIndex();
            // If P1 index is -1 or doesn't match this gamepad, ignore it for P1
            if (p1GpIdx < 0 || (gamepad && gamepad.index !== p1GpIdx)) return;
        }
        _Input_updateGamepadState.call(this, gamepad);
    };

    const _SceneManager_updateInputData = SceneManager.updateInputData;
    SceneManager.updateInputData = function () {
        _SceneManager_updateInputData.call(this);
        if (SplitScreenManager.active && SplitScreenManager.p2Event) SplitScreenManager.pollInput();
    };

    // =========================================================================
    // Map & Camera (From SplitScreenMultiplayer)
    // =========================================================================
    const _Scene_Map_onMapLoaded = Scene_Map.prototype.onMapLoaded;
    Scene_Map.prototype.onMapLoaded = function () {
        _Scene_Map_onMapLoaded.call(this);
        if (SplitScreenManager.active) findOrCreateP2Event(false);
    };

    function findOrCreateP2Event(forceTeleport = false) {
        if (!$gameMap || !$gameSystem) return;

        const currentMapId = $gameMap.mapId();
        const lastMapId = $gameSystem._lastP2MapId || 0;
        const mapChanged = (currentMapId !== lastMapId);
        $gameSystem._lastP2MapId = currentMapId;

        SplitScreenManager.resolveP2Character();
        const event = $gameMap.events().find(ev => ev && ev.event().name === P2_EVENT_NAME);
        if (event) {
            SplitScreenManager.p2Event = event;
            event.setImage(SplitScreenManager.p2CharName, SplitScreenManager.p2CharIndex);
            event.setOpacity(255);
            event.setPriorityType(1);
            event.setMoveSpeed($gamePlayer.moveSpeed());
            event.setMoveFrequency(5);

            // Only teleport near P1 if map changed or forced (e.g. starting session)
            if (forceTeleport || mapChanged) {
                event.locate($gamePlayer.x, $gamePlayer.y);
            }
        } else {
            SplitScreenManager.p2Event = null;
        }
    }

    const _Game_Map_updateEvents = Game_Map.prototype.updateEvents;
    Game_Map.prototype.updateEvents = function () {
        _Game_Map_updateEvents.call(this);
        if (SplitScreenManager.active && SplitScreenManager.p2Event && !SplitScreenManager.p2Event.isMoving()) {
            updateP2Movement();
        }
    };

    function updateP2Movement() {
        if ($gameMap.isEventRunning() || $gameMessage.isBusy()) return;
        const ev = SplitScreenManager.p2Event;
        if (!ev) return;

        // Ensure Highest frequency for smooth player-like movement
        if (ev.moveFrequency() !== 5) ev.setMoveFrequency(5);

        const input = SplitScreenManager.p2Input;
        
        // Sync speed with player 1 and handle dashing manually
        const baseSpeed = $gamePlayer.moveSpeed();
        const canDash = input.dash && !ev._isSwimming && !ev._isClimbing;
        const targetSpeed = canDash ? baseSpeed + 1 : baseSpeed;
        if (ev.moveSpeed() !== targetSpeed) {
            ev.setMoveSpeed(targetSpeed);
        }
        let dir = 0;
        if (input.up) dir = 8;
        if (input.down) dir = 2;
        if (input.left) dir = 4;
        if (input.right) dir = 6;
        if (dir > 0) {
            ev.moveStraight(dir);
            checkP2TouchTriggers(ev, dir);
        }

        if (SplitScreenManager.isTriggered("action")) {
            const d = ev.direction();
            const x2 = $gameMap.roundXWithDirection(ev.x, d);
            const y2 = $gameMap.roundYWithDirection(ev.y, d);
            let triggered = false;
            $gameMap.eventsXy(x2, y2).forEach(target => {
                if (target !== ev && target.isTriggerIn([0])) {
                    $gameMessage._eventActivator = "p2";
                    target.start();
                    triggered = true;
                }
            });
            $gameMap.eventsXy(ev.x, ev.y).forEach(target => {
                if (target !== ev && target.isTriggerIn([1, 2])) {
                    $gameMessage._eventActivator = "p2";
                    target.start();
                    triggered = true;
                }
            });

            // Map Puzzle System interactions (Levers, Switches, etc.)
            if (!triggered && window.MapPuzzleSystem) {
                triggered = window.MapPuzzleSystem.checkPuzzleInteractions(ev);
            }

            // Movement system interactions (Swimming, Climbing, Fishing)
            if (!triggered && SceneManager._scene instanceof Scene_Map) {
                SceneManager._scene.checkMovementInteraction(ev);
            }
        }

        // Handle Dashing (Handled manually above via setMoveSpeed)
        ev._dashing = false;
    }

    const _Game_Player_triggerButtonAction = Game_Player.prototype.triggerButtonAction;
    Game_Player.prototype.triggerButtonAction = function () {
        const result = _Game_Player_triggerButtonAction.call(this);
        if (result) {
            $gameMessage._eventActivator = "p1";
        }
        return result;
    };

    const _Game_Player_performTransfer = Game_Player.prototype.performTransfer;
    Game_Player.prototype.performTransfer = function () {
        if (SplitScreenManager.active) {
            const mapChanged = (this._newMapId !== $gameMap.mapId());
            _Game_Player_performTransfer.call(this);
            if (!mapChanged) {
                // Same map teleport - need to move P2 manually because onMapLoaded isn't called
                findOrCreateP2Event(true);
            }
        } else {
            _Game_Player_performTransfer.call(this);
        }
    };

    function checkP2TouchTriggers(ev, d) {
        const x2 = $gameMap.roundXWithDirection(ev.x, d);
        const y2 = $gameMap.roundYWithDirection(ev.y, d);
        $gameMap.eventsXy(x2, y2).forEach(target => {
            if (target !== ev && target.isTriggerIn([1, 2])) {
                if (!target.isMoving() && target.isNormalPriority()) {
                    $gameMessage._eventActivator = "p2";
                    target.start();
                }
            }
        });
    }

    const _Game_Event_checkEventTriggerTouch = Game_Event.prototype.checkEventTriggerTouch;
    Game_Event.prototype.checkEventTriggerTouch = function (x, y) {
        if (!$gameMap.isEventRunning()) {
            if (this._trigger === 2) {
                if ($gamePlayer.pos(x, y)) {
                    if (!this.isJumping() && this.isNormalPriority()) {
                        $gameMessage._eventActivator = "p1";
                        this.start();
                        return;
                    }
                } else if (SplitScreenManager.active && SplitScreenManager.p2Event && SplitScreenManager.p2Event.pos(x, y)) {
                    if (!this.isJumping() && this.isNormalPriority()) {
                        $gameMessage._eventActivator = "p2";
                        this.start();
                        return;
                    }
                }
            }
        }
        _Game_Event_checkEventTriggerTouch.call(this, x, y);
    };

    // Rendering
    const _Scene_Map_createSpriteset = Scene_Map.prototype.createSpriteset;
    Scene_Map.prototype.createSpriteset = function () {
        _Scene_Map_createSpriteset.call(this);
        this._p2DisplayX = 0;
        this._p2DisplayY = 0;
    };

    const _Scene_Map_update = Scene_Map.prototype.update;
    Scene_Map.prototype.update = function () {
        _Scene_Map_update.call(this);
        if (SplitScreenManager.active && SplitScreenManager.p2Event) {
            this.updateSplitScreen();
        }
    };

    Scene_Map.prototype.updateSplitScreen = function () {
        if (!this._splitScreenActive) this.activateSplitScreen();
        this.updateSplitViewports();
    };

    Scene_Map.prototype.activateSplitScreen = function () {
        this._splitScreenActive = true;
        const gw = Graphics.width;
        const gh = Graphics.height;

        const mask1 = new PIXI.Graphics().beginFill(0xffffff);
        if (SPLIT_DIR === "vertical") mask1.drawRect(0, 0, Math.floor(gw / 2), gh);
        else mask1.drawRect(0, 0, gw, Math.floor(gh / 2));
        this.addChild(mask1);
        this._spriteset.mask = mask1;
        this._p1Mask = mask1;

        // Initialize P2 display coordinates to avoid jumping
        this._p2DisplayX = $gameMap.displayX();
        this._p2DisplayY = $gameMap.displayY();

        this._p2Spriteset = new Spriteset_Map();

        // Hijack update to use P2-specific display coordinates
        const scene = this;
        const _p2Update = this._p2Spriteset.update;
        this._p2Spriteset.update = function () {
            const lastX = $gameMap._displayX;
            const lastY = $gameMap._displayY;
            $gameMap._displayX = scene._p2DisplayX;
            $gameMap._displayY = scene._p2DisplayY;
            _p2Update.call(this);
            $gameMap._displayX = lastX;
            $gameMap._displayY = lastY;
        };

        const mask2 = new PIXI.Graphics().beginFill(0xffffff);
        if (SPLIT_DIR === "vertical") {
            mask2.drawRect(Math.floor(gw / 2), 0, Math.floor(gw / 2), gh);
        } else {
            mask2.drawRect(0, Math.floor(gh / 2), gw, Math.floor(gh / 2));
        }
        this.addChild(mask2);
        this._p2Spriteset.mask = mask2;
        this._p2Mask = mask2;

        // Add behind window layer if possible
        const wlIdx = this._windowLayer ? this.children.indexOf(this._windowLayer) : -1;
        if (wlIdx >= 0) {
            this.addChildAt(this._p2Spriteset, wlIdx);
        } else {
            this.addChild(this._p2Spriteset);
        }

        // Create Divider
        const divider = new PIXI.Graphics().beginFill(0x000000);
        const thickness = 4;
        if (SPLIT_DIR === "vertical") {
            divider.drawRect(Math.floor(gw / 2) - thickness / 2, 0, thickness, gh);
        } else {
            divider.drawRect(0, Math.floor(gh / 2) - thickness / 2, gw, thickness);
        }

        const wlIdx2 = this._windowLayer ? this.children.indexOf(this._windowLayer) : -1;
        if (wlIdx2 >= 0) {
            this.addChildAt(divider, wlIdx2);
        } else {
            this.addChild(divider);
        }
        this._splitDivider = divider;
    };

    Scene_Map.prototype.deactivateSplitScreen = function () {
        this._splitScreenActive = false;
        if (this._spriteset && this._p1Mask) {
            this.removeChild(this._p1Mask);
            this._spriteset.mask = null;
            this._p1Mask = null;
        }
        if (this._splitDivider) {
            this.removeChild(this._splitDivider);
            this._splitDivider = null;
        }
        if (this._p2Spriteset) {
            if (this._p2Mask) {
                this.removeChild(this._p2Mask);
                this._p2Mask = null;
            }
            this.removeChild(this._p2Spriteset);
            this._p2Spriteset.destroy({ children: true });
            this._p2Spriteset = null;
        }
        this._spriteset.x = 0;
        this._spriteset.y = 0;
    };

    Scene_Map.prototype.updateSplitViewports = function () {
        const p1 = $gamePlayer;
        const ev = SplitScreenManager.p2Event;
        const tw = $gameMap.tileWidth();
        const th = $gameMap.tileHeight();
        const gw = Graphics.width;
        const gh = Graphics.height;
        const vpW = SPLIT_DIR === "vertical" ? gw / 2 : gw;
        const vpH = SPLIT_DIR === "vertical" ? gh : gh / 2;

        // P1 Centering (Center of their viewport)
        const p1TargetX = Math.max(0, Math.min(p1._realX - vpW / tw / 2 + 0.5, $gameMap.width() - vpW / tw));
        const p1TargetY = Math.max(0, Math.min(p1._realY - vpH / th / 2 + 0.5, $gameMap.height() - vpH / th));
        $gameMap._displayX = p1TargetX;
        $gameMap._displayY = p1TargetY;

        // P2 Centering (Center of their viewport)
        const p2TargetX = Math.max(0, Math.min(ev._realX - vpW / tw / 2 + 0.5, $gameMap.width() - vpW / tw));
        const p2TargetY = Math.max(0, Math.min(ev._realY - vpH / th / 2 + 0.5, $gameMap.height() - vpH / th));

        this._p2DisplayX += (p2TargetX - this._p2DisplayX) * 0.15;
        this._p2DisplayY += (p2TargetY - this._p2DisplayY) * 0.15;

        // Visual Offsets (Base positions for viewports)
        if (SPLIT_DIR === "vertical") {
            this._spriteset.x = 0;
            this._p2Spriteset.x = Math.floor(gw / 2);
            this._p2Spriteset.y = 0;
        } else {
            this._spriteset.y = 0;
            this._p2Spriteset.x = 0;
            this._p2Spriteset.y = Math.floor(gh / 2);
        }
    };

    Scene_Map.prototype.updateMergedCamera = function () {
        const p1 = $gamePlayer;
        const p2 = SplitScreenManager.p2Event;
        const midX = (p1._realX + p2._realX) / 2;
        const midY = (p1._realY + p2._realY) / 2;
        const tw = $gameMap.tileWidth();
        const th = $gameMap.tileHeight();
        const gw = Graphics.width;
        const gh = Graphics.height;

        const targetX = Math.max(0, Math.min(midX - gw / tw / 2 + 0.5, $gameMap.width() - gw / tw));
        const targetY = Math.max(0, Math.min(midY - gh / th / 2 + 0.5, $gameMap.height() - gh / th));

        $gameMap._displayX += (targetX - $gameMap._displayX) * 0.12;
        $gameMap._displayY += (targetY - $gameMap._displayY) * 0.12;
    };

    const _Scene_Map_terminate = Scene_Map.prototype.terminate;
    Scene_Map.prototype.terminate = function () {
        if (this._splitScreenActive) this.deactivateSplitScreen();
        _Scene_Map_terminate.call(this);
    };

    // Message Window Overlay handling
    const _Window_Message_updatePlacement = Window_Message.prototype.updatePlacement;
    Window_Message.prototype.updatePlacement = function () {
        _Window_Message_updatePlacement.call(this);
        if (SplitScreenManager.active) {
            // Force center position for overlay look
            const width = Math.min(Graphics.boxWidth - 160, 800);
            const height = this.height;
            const x = (Graphics.boxWidth - width) / 2;
            const y = (Graphics.boxHeight - height) * 0.8;
            this.move(x, y, width, height);
        }
    };

    const _Window_Message_terminateMessage = Window_Message.prototype.terminateMessage;
    Window_Message.prototype.terminateMessage = function () {
        _Window_Message_terminateMessage.call(this);
        if (SplitScreenManager.active) {
            $gameMessage._eventActivator = null;
        }
    };

    // Name Box positioning
    const _Window_NameBox_updatePlacement = Window_NameBox.prototype.updatePlacement;
    Window_NameBox.prototype.updatePlacement = function () {
        _Window_NameBox_updatePlacement.call(this);
        if (SplitScreenManager.active && this._messageWindow) {
            this.x = this._messageWindow.x;
            this.y = this._messageWindow.y - this.height;
        }
    };

    // Choice List Overlay handling
    const _Window_ChoiceList_updatePlacement = Window_ChoiceList.prototype.updatePlacement;
    Window_ChoiceList.prototype.updatePlacement = function () {
        _Window_ChoiceList_updatePlacement.call(this);
        if (SplitScreenManager.active) {
            this.x = (Graphics.boxWidth - this.width) / 2;
            // Place below or above centered message window if possible
            if ($gameMessage.isBusy()) {
                this.y = (Graphics.boxHeight + 200 - this.height) / 2; // Offset from center
            } else {
                this.y = (Graphics.boxHeight - this.height) / 2;
            }
        }
    };

    // Input Redirection for dialogue control
    const _Input_isTriggered = Input.isTriggered;
    Input.isTriggered = function (key) {
        if (SplitScreenManager.active && $gameMessage.isBusy() && $gameMessage._eventActivator) {
            if (key === "ok") {
                // If message is in the middle (positionType === 1), allow ANY player to continue
                if ($gameMessage.positionType() === 1) {
                    return _Input_isTriggered.call(this, key) || SplitScreenManager.isTriggered("action");
                }

                if ($gameMessage._eventActivator === "p2") {
                    return SplitScreenManager.isTriggered("action");
                } else {
                    // P1 is activator, ignore P2's action button
                    return _Input_isTriggered.call(this, key) && !SplitScreenManager.p2Input.action;
                }
            }
        }
        return _Input_isTriggered.call(this, key);
    };

    const _Input_isRepeated = Input.isRepeated;
    Input.isRepeated = function (key) {
        if (SplitScreenManager.active && $gameMessage.isBusy() && $gameMessage._eventActivator) {
            if (["up", "down", "left", "right", "ok"].includes(key)) {
                // If message is in the middle, allow ANY player for 'ok'
                if (key === "ok" && $gameMessage.positionType() === 1) {
                    return _Input_isRepeated.call(this, key) || SplitScreenManager.p2Input.action;
                }

                if ($gameMessage._eventActivator === "p2") {
                    const p2Key = key === "ok" ? "action" : key;
                    return SplitScreenManager.p2Input[p2Key];
                } else {
                    // P1 is activator, ignore P2's direction/ok inputs
                    const p2Key = key === "ok" ? "action" : key;
                    return _Input_isRepeated.call(this, key) && !SplitScreenManager.p2Input[p2Key];
                }
            }
        }
        return _Input_isRepeated.call(this, key);
    };

    // Also override isPressed for fast-forwarding dialogue
    const _Input_isPressed = Input.isPressed;
    Input.isPressed = function (key) {
        if (SplitScreenManager.active && $gameMessage.isBusy() && $gameMessage._eventActivator) {
            if (key === "ok") {
                // If message is in the middle, allow ANY player for 'ok' (fast-forward)
                if ($gameMessage.positionType() === 1) {
                    return _Input_isPressed.call(this, key) || SplitScreenManager.p2Input.action;
                }

                if ($gameMessage._eventActivator === "p2") {
                    return SplitScreenManager.p2Input.action;
                } else {
                    // P1 is activator, ignore P2's action button
                    return _Input_isPressed.call(this, key) && !SplitScreenManager.p2Input.action;
                }
            }
        }
        return _Input_isPressed.call(this, key);
    };

    // --- Battle System Integration ---

    Game_Actor.prototype.multiplayerPlayerId = function () {
        const index = $gameParty.members().indexOf(this);
        // Player 2 controls the second actor in the party (index 1)
        return (index === 1) ? 2 : 1;
    };

    const _Window_Selectable_processCursorMove = Window_Selectable.prototype.processCursorMove;
    Window_Selectable.prototype.processCursorMove = function () {
        if (SplitScreenManager.active && SceneManager._scene instanceof Scene_Battle) {
            const actor = BattleManager.actor();
            if (actor) {
                const playerId = actor.multiplayerPlayerId();
                if (playerId === 2) {
                    this.processP2CursorMove();
                    return;
                }
            }
        }
        _Window_Selectable_processCursorMove.call(this);
    };

    Window_Selectable.prototype.processP2CursorMove = function () {
        if (this.isOpenAndActive()) {
            const input = SplitScreenManager.p2Input;
            if (input.down) this.cursorDown(true);
            if (input.up) this.cursorUp(true);
            if (input.right) this.cursorRight(true);
            if (input.left) this.cursorLeft(true);
        }
    };

    const _Window_Selectable_processHandling = Window_Selectable.prototype.processHandling;
    Window_Selectable.prototype.processHandling = function () {
        if (SplitScreenManager.active && SceneManager._scene instanceof Scene_Battle) {
            const actor = BattleManager.actor();
            if (actor) {
                const playerId = actor.multiplayerPlayerId();
                if (playerId === 2) {
                    this.processP2Handling();
                    return;
                }
            }
        }
        _Window_Selectable_processHandling.call(this);
    };

    Window_Selectable.prototype.processP2Handling = function () {
        if (this.isOpenAndActive()) {
            if (this.isP2OkEnabled() && SplitScreenManager.isTriggered("action")) {
                this.processOk();
            } else if (this.isCancelEnabled() && SplitScreenManager.isTriggered("cancel")) {
                this.processCancel();
            }
        }
    };

    Window_Selectable.prototype.isP2OkEnabled = function () {
        return this.isOkEnabled();
    };

    const _Window_ActorCommand_refresh = Window_ActorCommand.prototype.refresh;
    Window_ActorCommand.prototype.refresh = function () {
        _Window_ActorCommand_refresh.call(this);
        if (SplitScreenManager.active && this._actor) {
            const playerId = this._actor.multiplayerPlayerId();
            this.drawPlayerLabel(playerId);
        }
    };

    Window_ActorCommand.prototype.drawPlayerLabel = function (playerId) {
        this.changeTextColor(ColorManager.systemColor());
        this.contents.fontSize = 14;
        const text = "PLAYER " + playerId;
        this.drawText(text, 0, -10, this.contentsWidth(), "right");
        this.resetFontSettings();
    };

    // =========================================================================
    // Auto-Start Split-Screen
    // =========================================================================
    const _DataManager_setupNewGame = DataManager.setupNewGame;
    DataManager.setupNewGame = function () {
        _DataManager_setupNewGame.call(this);
        if (AUTO_START) {
            // Generate pool of random candidates
            const candidates = SplitScreenManager.createSelectionPool();
            if (candidates.length > 0) {
                // Pick the first random candidate and start session
                SplitScreenManager.startSession(candidates[0]);
            }
        }
    };

})();

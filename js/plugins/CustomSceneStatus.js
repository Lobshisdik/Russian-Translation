//=============================================================================
// CustomSceneStatus.js
//=============================================================================

/*:
 * @target MZ
 * @plugindesc Custom Scene Status v1.5.0
 * @author OmniLex 
 * @version 1.5.0
 * @description Custom status scene with an ornate, compact, framed layout. Supports Italian.
 * * @param maxDescriptionLength
 * @text Max Description Length
 * @desc Maximum number of characters for character descriptions
 * @type number
 * @default 200
 * @min 50
 * @max 500
 * * @command setCharacterDescription
 * @text Set Character Description
 * @desc Set a description for a party member
 * * @arg partyMemberIndex
 * @text Party Member
 * @desc Which party member (1, 2, or 3)
 * @type select
 * @option Party Member 1
 * @value 1
 * @option Party Member 2
 * @value 2
 * @option Party Member 3
 * @value 3
 * @default 1
 * * @arg description
 * @text Description
 * @desc The character description text
 * @type multiline_string
 * @default
 * * @help CustomSceneStatus.js
 * * This plugin replaces the default Scene_Status with a custom version.
 * * --- Features ---
 * - Ornate, framed layout that organizes information into bordered sections.
 * - Compact, full-screen display that eliminates wasted space.
 * - Character descriptions with plugin commands.
 * - Full-width HP/MP/TP/EXP gauges in current/max format.
 * - Correctly scaled text for all labels (fixes EXP label cutoff).
 * - Left/Right arrow keys to cycle through actors.
 * - Compact party member tabs.
 * - Random traits assigned to characters 2+ based on name seed.
 * - Italian language support.
 * - Body parts display from Health_Core.js system.
 * * --- Changelog ---
 * v1.5.0
 * - Added third column displaying body parts from Health_Core.js
 * - Reorganized layout into 3 columns (Info/Gauges/EXP | Params/Element/Traits | Body Parts)
 * - Body parts display HP as gauge bars behind the text
 * - Damaged parts shown with strike-through text and empty gauge
 * - Up/Down arrow keys scroll through body parts list
 * - Scroll indicator shown when body parts exceed visible area
 * - First column reduced to 28% width for better space distribution
 * - Italian translation support for body parts section
 * * v1.4.0 (Refactor)
 * - Added drawSectionBox helper to create an ornate, framed look.
 * - Rewrote drawActorStatus to use the new framed layout, eliminating
 * wasted vertical and horizontal space.
 * - Gauges are now full-width within their sections.
 * - Fixed a bug in drawActorExp where Italian labels ("Totale", "Prossimo")
 * were cut off. The layout now correctly measures label width.
 * - Consolidated layout logic for easier maintenance.
 * * v1.3.2
 * - Initial version.
 */

(() => {
    'use strict';

    const pluginName = 'CustomSceneStatus';
    const parameters = PluginManager.parameters(pluginName);
    const maxDescriptionLength = parseInt(parameters['maxDescriptionLength'] || 200);
    const { Traits } = window.Health;

    // Initialize character descriptions storage safely
    function initializeDescriptions() {
        if ($dataSystem && !$dataSystem.characterDescriptions) {
            $dataSystem.characterDescriptions = {};
        }
    }

    // Initialize on plugin load
    initializeDescriptions();

    //=============================================================================
    // Bust Image Loading Helper
    //=============================================================================

    function getActorBustImagePath(actor) {
        if (!actor) return null;

        const actorId = actor.actorId && actor.actorId();
        const characterName = actor.characterName();
        const { SpritesAssociation } = window.Sprites || {};

        // Player 1 (Actor 1) special handling
        if (actorId === 1) {
            // Priority 1: Check Variable 109 (Player 1 bust name)
            const player1BustName = $gameVariables.value(109);
            if (player1BustName && player1BustName !== "") {
                return "img/busts/" + player1BustName;
            }

            // Priority 2: If Switch 77 is ON, use Variable 106 for monster form
            if ($gameSwitches.value(77)) {
                const player1MonsterName = $gameVariables.value(106);
                if (player1MonsterName && player1MonsterName !== "") {
                    return "img/enemies/" + player1MonsterName;
                }
            }

            // Priority 3: Fall back to SpritesAssociation
            if (characterName && SpritesAssociation) {
                const spritesheetName = characterName.split('.')[0];
                const characterIndex = actor.characterIndex();

                if (SpritesAssociation[spritesheetName] &&
                    SpritesAssociation[spritesheetName][characterIndex]) {
                    const bustName = SpritesAssociation[spritesheetName][characterIndex];
                    return "img/busts/" + bustName;
                }
            }

            return "img/busts/7";
        }

        // Player 2 (Actor 2) special handling
        if (actorId === 2) {
            // Priority 1: Check Variable 117 (Player 2 bust name)
            const player2BustName = $gameVariables.value(117);
            if (player2BustName && player2BustName !== "") {
                return "img/busts/" + player2BustName;
            }

            // Priority 2: If Switch 78 is ON, use Variable 107 for monster form
            if ($gameSwitches.value(78)) {
                const player2MonsterName = $gameVariables.value(107);
                if (player2MonsterName && player2MonsterName !== "") {
                    return "img/enemies/" + player2MonsterName;
                }
            }

            // Priority 3: Fall back to SpritesAssociation
            if (characterName && SpritesAssociation) {
                const spritesheetName = characterName.split('.')[0];
                const characterIndex = actor.characterIndex();

                if (SpritesAssociation[spritesheetName] &&
                    SpritesAssociation[spritesheetName][characterIndex]) {
                    const bustName = SpritesAssociation[spritesheetName][characterIndex];
                    return "img/busts/" + bustName;
                }
            }

            return "img/busts/7";
        }

        // Player 3 (Actor 3) special handling
        if (actorId === 3) {
            // Priority 1: Check Variable 118 (Player 3 bust name)
            const player3BustName = $gameVariables.value(118);
            if (player3BustName && player3BustName !== "") {
                return "img/busts/" + player3BustName;
            }

            // Priority 2: If Switch 79 is ON, use Variable 108 for monster form
            if ($gameSwitches.value(79)) {
                const player3MonsterName = $gameVariables.value(108);
                if (player3MonsterName && player3MonsterName !== "") {
                    return "img/enemies/" + player3MonsterName;
                }
            }

            // Priority 3: Fall back to SpritesAssociation
            if (characterName && SpritesAssociation) {
                const spritesheetName = characterName.split('.')[0];
                const characterIndex = actor.characterIndex();

                if (SpritesAssociation[spritesheetName] &&
                    SpritesAssociation[spritesheetName][characterIndex]) {
                    const bustName = SpritesAssociation[spritesheetName][characterIndex];
                    return "img/busts/" + bustName;
                }
            }

            return "img/busts/7";
        }

        // Fallback to SpritesAssociation for any other actors
        if (characterName && SpritesAssociation) {
            const spritesheetName = characterName.split('.')[0];
            const characterIndex = actor.characterIndex();

            if (SpritesAssociation[spritesheetName] &&
                SpritesAssociation[spritesheetName][characterIndex]) {
                const bustName = SpritesAssociation[spritesheetName][characterIndex];
                return "img/busts/" + bustName;
            }
        }

        // Final fallback to default bust path structure
        return "img/busts/7";
    }

    function drawBustImage(bitmap, actor, x, y, width, height) {
        const bustPath = getActorBustImagePath(actor);

        // Always clear the area first
        bitmap.clearRect(x, y, width, height);

        if (!bustPath) return;

        // Determine if this is an enemy image (don't crop) or bust image (crop)
        const shouldCrop = !bustPath.includes('img/enemies/');

        // Load the main bust image
        const bustBitmap = ImageManager.loadBitmap('', bustPath);

        bustBitmap.addLoadListener(() => {
            // Check if the bitmap actually loaded successfully
            if (bustBitmap.width > 0 && bustBitmap.height > 0) {
                drawBustToCanvas(bitmap, bustBitmap, x, y, width, height, shouldCrop);
            }
        });
    }

    function drawBustToCanvas(bitmap, sourceBitmap, x, y, width, height, shouldCrop = true) {
        try {
            // Disable image smoothing for pixel-perfect rendering
            const context = bitmap.context;
            const oldSmoothing = context.imageSmoothingEnabled;
            context.imageSmoothingEnabled = false;

            // Get source image dimensions
            const sourceWidth = sourceBitmap.width > 0 ? sourceBitmap.width : 889;
            const sourceHeight = sourceBitmap.height > 0 ? sourceBitmap.height : 1200;

            let cropTop = 0;
            let cropLeft = 0;
            let croppedSourceWidth = sourceWidth;
            let croppedSourceHeight = sourceHeight;

            // For bust images, zoom in on the face area with tighter cropping
            if (shouldCrop) {
                // Crop from top to show face details (320px from top instead of 180px)
                cropTop = 320;
                // Crop from sides to zoom in (center 60% of width)
                cropLeft = Math.round(sourceWidth * 0.2);
                croppedSourceWidth = Math.round(sourceWidth * 0.6);
                croppedSourceHeight = sourceHeight - cropTop;
            }

            const aspectRatio = croppedSourceWidth / croppedSourceHeight;

            // Calculate draw dimensions to fit within the display area while maintaining aspect ratio
            let drawWidth = width;
            let drawHeight = Math.round(width / aspectRatio);

            // If height exceeds available space, scale down
            if (drawHeight > height) {
                drawHeight = height;
                drawWidth = Math.round(height * aspectRatio);
            }

            // Center the image within the specified area
            const drawX = Math.round(x + (width - drawWidth) / 2);
            const drawY = Math.round(y + (height - drawHeight) / 2);

            // Draw the image (cropped if it's a bust, full if it's an enemy)
            bitmap.blt(sourceBitmap, cropLeft, cropTop, croppedSourceWidth, croppedSourceHeight, drawX, drawY, drawWidth, drawHeight);

            // Restore original smoothing setting
            context.imageSmoothingEnabled = oldSmoothing;
        } catch (error) {
            // Silently handle errors
        }
    }

    //=============================================================================
    // Translation Helper
    //=============================================================================

    const translations = {
        description: { en: "Description", it: "Descrizione" },
        parameters: { en: "Parameters", it: "Parametri" },
        traits: { en: "Traits", it: "Tratti" },
        noTraits: { en: "No traits", it: "Nessun tratto" },
        states: { en: "States", it: "Stati" },
        none: { en: "None", it: "Nessuno" },
        more: { en: "more...", it: "altri..." },
        total: { en: "Total", it: "Totale" },
        next: { en: "Next", it: "Prossimo" },
        defaultDescriptions: {
            warrior: {
                en: "A skilled warrior\ntrained in combat.",
                it: "Un guerriero esperto\naddestrato al combattimento."
            },
            mage: {
                en: "A wielder of arcane magic.",
                it: "Un utilizzatore di magia arcana."
            },
            priest: {
                en: "A devoted follower\nwith healing powers.",
                it: "Un seguace devoto\ncon poteri curativi."
            },
            rogue: {
                en: "A nimble individual\nskilled in stealth.",
                it: "Un individuo agile\nesperto in furtività."
            },
            archer: {
                en: "An expert marksman\nwith keen eyes.",
                it: "Un tiratore esperto\ncon occhi acuti."
            },
            default: {
                en: "A brave",
                it: "Un coraggioso"
            }
        }
    };

    function getText(key) {
        const useTranslation = ConfigManager.language === "it";
        return translations[key] ? (useTranslation ? translations[key].it : translations[key].en) : key;
    }

    let i18nData = null;

    const loadI18nData = async () => {
        const lang = ConfigManager.language || "en";
        const url = `js/plugins/i18n/${lang}/traits.json`;
        try {
            const response = await fetch(url);
            i18nData = await response.json();
        } catch (e) {
            console.error("CustomSceneStatus: Failed to load i18n data from " + url, e);
        }
    };

    const resolveI18nPath = (path, obj) => {
        if (!path || !obj) return null;
        return path.split('.').reduce((acc, part) => acc && acc[part], obj);
    };

    //=============================================================================
    // Seeded Random Number Generator
    //=============================================================================

    class SeededRandom {
        constructor(seed) {
            this.seed = seed;
        }

        next() {
            this.seed = (this.seed * 9301 + 49297) % 233280;
            return this.seed / 233280;
        }
    }

    function stringToSeed(str) {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash;
        }
        return Math.abs(hash);
    }

    //=============================================================================
    // Trait Generation
    //=============================================================================

    function getTraitById(traitId) {
        if (!window.Health || !window.Health.Traits) {
            return null;
        }
        return window.Health.Traits.find(trait => trait.id === traitId);
    }

    function generateRandomTraits(actorName, count = 5) {
        if (!window.Health || !window.Health.Traits) {
            return [];
        }

        const availableTraits = window.Health.Traits;
        if (availableTraits.length === 0) {
            return [];
        }

        const seed = stringToSeed(actorName);
        const rng = new SeededRandom(seed);
        const traits = [];
        const usedIds = new Set();
        const maxTraitId = Math.max(...availableTraits.map(t => t.id));

        let attempts = 0;
        const maxAttempts = count * 10;

        while (traits.length < count && attempts < maxAttempts) {
            attempts++;
            const traitId = Math.floor(rng.next() * maxTraitId) + 1;

            if (!usedIds.has(traitId)) {
                const traitData = getTraitById(traitId);
                if (traitData) {
                    usedIds.add(traitId);
                    traits.push({
                        id: traitData.id,
                        icon: traitData.icon,
                        name: traitData.name
                    });
                }
            }
        }

        return traits;
    }

    function ensureActorTraits(actor, partyIndex) {
        if (partyIndex === 0) {
            // First party member has no auto-generated traits
            if (!actor._selectedTraits) {
                actor._selectedTraits = [];
            }
        } else {
            // Other party members get seeded random traits
            if (!actor._selectedTraits || actor._selectedTraits.length === 0) {
                actor._selectedTraits = generateRandomTraits(actor.name(), 5);
            }
        }
    }

    //=============================================================================
    // Plugin Commands
    //=============================================================================

    PluginManager.registerCommand(pluginName, "setCharacterDescription", args => {
        const partyIndex = parseInt(args.partyMemberIndex) - 1;
        const description = args.description || "";
        const actor = $gameParty.allMembers()[partyIndex];

        if (actor) {
            if (!$dataSystem || !$dataSystem.characterDescriptions) {
                initializeDescriptions();
            }

            const truncatedDescription = description.length > maxDescriptionLength
                ? description.substring(0, maxDescriptionLength) + "..."
                : description;

            $dataSystem.characterDescriptions[actor.actorId()] = truncatedDescription;
            window.skipLocalization = true;
            $gameMessage.add(`Description set for ${actor.name()}.`);
            window.skipLocalization = false;
        } else {
            window.skipLocalization = true;
            $gameMessage.add("Invalid party member index.");
            window.skipLocalization = false;
        }
    });

    //=============================================================================
    // Scene_Status
    //=============================================================================

    Scene_Status.prototype.create = function () {
        Scene_MenuBase.prototype.create.call(this);
        this._actorIndex = 0;
        this.createStatusWindow();
    };

    Scene_Status.prototype.start = function () {
        Scene_MenuBase.prototype.start.call(this);
        this.refreshActor();
        this._statusWindow.activate();
    };

    Scene_Status.prototype.needsPageButtons = function () {
        return false;
    };

    Scene_Status.prototype.createBackground = function () {
        Scene_MenuBase.prototype.createBackground.call(this);
    };

    Scene_Status.prototype.createStatusWindow = function () {
        const rect = this.statusWindowRect();
        this._statusWindow = new Window_CustomStatus(rect);
        this._statusWindow.setHandler('cancel', this.popScene.bind(this));
        this.addWindow(this._statusWindow);
        const stRect = this.statesWindowRect();
        this._statesWindow = new Window_StatusStates(stRect);
        this.addWindow(this._statesWindow);
        const prRect = this.paramsWindowRect();
        this._paramsWindow = new Window_StatusParams(prRect);
        this.addWindow(this._paramsWindow);
    };

    Scene_Status.prototype.statusWindowRect = function () {
        const ww = Math.floor(Graphics.boxWidth * 0.65);
        return new Rectangle(0, 0, ww, Graphics.boxHeight);
    };

    Scene_Status.prototype.statesWindowRect = function () {
        const rx = Math.floor(Graphics.boxWidth * 0.65);
        const rw = Graphics.boxWidth - rx;
        const rh = Math.floor(Graphics.boxHeight * 0.30);
        return new Rectangle(rx, 0, rw, rh);
    };

    Scene_Status.prototype.paramsWindowRect = function () {
        const rx = Math.floor(Graphics.boxWidth * 0.65);
        const rw = Graphics.boxWidth - rx;
        const stH = Math.floor(Graphics.boxHeight * 0.30);
        return new Rectangle(rx, stH, rw, Graphics.boxHeight - stH);
    };

    Scene_Status.prototype.refreshActor = function () {
        const actor = this.actor();
        ensureActorTraits(actor, this._actorIndex);
        this._statusWindow.setActor(actor);
        this._statusWindow.setActorIndex(this._actorIndex);
        this._statesWindow.setActor(actor);
        this._paramsWindow.setActor(actor);
    };

    Scene_Status.prototype.onActorChange = function () {
        Scene_MenuBase.prototype.onActorChange.call(this);
        this.refreshActor();
    };

    Scene_Status.prototype.update = function () {
        Scene_MenuBase.prototype.update.call(this);
        if (this._statusWindow.active) {
            this.updateActorSelection();
        }
    };

    Scene_Status.prototype.updateActorSelection = function () {
        if (Input.isTriggered('right')) {
            this.nextActor();
        } else if (Input.isTriggered('left')) {
            this.previousActor();
        }
    };

    Scene_Status.prototype.nextActor = function () {
        this._actorIndex = (this._actorIndex + 1) % $gameParty.allMembers().length;
        this.refreshActor();
        SoundManager.playCursor();
    };

    Scene_Status.prototype.previousActor = function () {
        this._actorIndex = (this._actorIndex - 1 + $gameParty.allMembers().length) % $gameParty.allMembers().length;
        this.refreshActor();
        SoundManager.playCursor();
    };

    Scene_Status.prototype.actor = function () {
        return $gameParty.allMembers()[this._actorIndex];
    };

    //=============================================================================
    // Window_CustomStatus
    //=============================================================================

    function Window_CustomStatus() {
        this.initialize(...arguments);
    }

    Window_CustomStatus.prototype = Object.create(Window_StatusBase.prototype);
    Window_CustomStatus.prototype.constructor = Window_CustomStatus;

    Window_CustomStatus.prototype.initialize = function (rect) {
        Window_StatusBase.prototype.initialize.call(this, rect);
        this._actor = null;
        this._actorIndex = 0;
        this.activate();
    };

    Window_CustomStatus.prototype.processCancel = function () {
        this.callHandler('cancel');
    };

    Window_CustomStatus.prototype.isOkEnabled = function () {
        return true;
    };

    Window_CustomStatus.prototype.isCancelEnabled = function () {
        return true;
    };

    Window_CustomStatus.prototype.setActor = function (actor) {
        if (this._actor !== actor) {
            this._actor = actor;
            this._bodyPartsScrollIndex = 0;
            this.refresh();
        }
    };

    Window_CustomStatus.prototype.setActorIndex = function (index) {
        if (this._actorIndex !== index) {
            this._actorIndex = index;
            this._bodyPartsScrollIndex = 0;
            this.refresh();
        }
    };


    // Override drawActorFace to use bust images from variables 106-108
    Window_CustomStatus.prototype.drawActorFace = function (actor, x, y, width, height) {
        width = width || ImageManager.faceWidth;
        height = height || ImageManager.faceHeight;
        drawBustImage(this.contents, actor, x, y, width, height);
    };

    Window_CustomStatus.prototype.refresh = function () {
        this.contents.clear();
        if (this._actor) {
            this.drawPartyTabs();
            if (!i18nData) {
                loadI18nData().then(() => this.drawActorStatus());
            } else {
                this.drawActorStatus();
            }
        }
    };

    Window_CustomStatus.prototype.drawPartyTabs = function () {
        const allMembers = $gameParty.allMembers();
        if (allMembers.length <= 1) return;

        const tabWidth = 160;
        const tabHeight = 32;
        const tabSpacing = 15;
        const arrowWidth = 20;
        const totalTabsWidth = allMembers.length === 2 ? tabWidth : (tabWidth * 2 + tabSpacing);
        const startX = this.width - totalTabsWidth - 30;
        const startY = 10;

        const prevIndex = (this._actorIndex - 1 + allMembers.length) % allMembers.length;
        const nextIndex = (this._actorIndex + 1) % allMembers.length;

        if (allMembers.length === 2) {
            const otherActor = allMembers[prevIndex];
            const tabX = startX;
            const tabY = startY;

            this.drawArrow(tabX - arrowWidth - 5, tabY + tabHeight / 2, "left");
            this.drawTab(otherActor, tabX, tabY, tabWidth, tabHeight);
            this.drawArrow(tabX + tabWidth + 5, tabY + tabHeight / 2, "right");
        } else if (allMembers.length === 3) {
            const leftActor = allMembers[prevIndex];
            const leftTabX = startX;
            const leftTabY = startY;

            this.drawArrow(leftTabX - arrowWidth - 5, leftTabY + tabHeight / 2, "left");
            this.drawTab(leftActor, leftTabX, leftTabY, tabWidth, tabHeight);

            const rightActor = allMembers[nextIndex];
            const rightTabX = startX + tabWidth + tabSpacing;
            const rightTabY = startY;

            this.drawTab(rightActor, rightTabX, rightTabY, tabWidth, tabHeight);
            this.drawArrow(rightTabX + tabWidth + 5, rightTabY + tabHeight / 2, "right");
        }
    };

    Window_CustomStatus.prototype.drawArrow = function (x, y, direction) {
        const arrowSize = 12;
        this.changeTextColor(ColorManager.normalColor());
        this.contents.fontSize = arrowSize * 1.8;

        const arrowText = direction === "left" ? "◀" : "▶";
        const textY = y - this.contents.fontSize / 2;
        this.contents.drawText(arrowText, x - arrowSize, textY, arrowSize * 2, this.contents.fontSize, "center");

        this.resetFontSettings();
    };

    Window_CustomStatus.prototype.drawTab = function (actor, x, y, width, height) {
        const tabColor = ColorManager.dimColor1();
        this.contents.fillRect(x, y, width, height, tabColor);

        const borderColor = ColorManager.outlineColor();
        this.contents.strokeRect(x, y, width, height, borderColor);

        this.contents.fontSize = 18;
        this.changeTextColor(ColorManager.normalColor());
        const textY = y + (height - this.contents.fontSize) / 2 - 2;
        this.contents.drawText(actor.name(), x, textY, width, this.contents.fontSize, "center");
        this.resetFontSettings();
    };

    // [NEW] Helper function to draw bordered/filled boxes
    Window_CustomStatus.prototype.drawSectionBox = function (x, y, width, height) {
        const c1 = ColorManager.dimColor1();
        const c2 = ColorManager.dimColor2();
        // Use a subtle gradient for the background
        this.contents.gradientFillRect(x, y, width, height, c2, c1, true);
        // Draw the border
        this.contents.strokeRect(x, y, width, height, ColorManager.outlineColor());
    };

    // [REFACTORED] Main drawing logic
    Window_CustomStatus.prototype.drawActorStatus = function () {
        const line = this.lineHeight();
        const pad = 10; // Padding between sections
        const innerPad = 15; // Padding inside sections
        const totalWidth = this.contentsWidth();

        // Define column layout (2 columns)
        const leftColX = pad;
        const leftColWidth = Math.floor(totalWidth * 0.43) - Math.floor(pad * 1.5);
        const midColX = leftColX + leftColWidth + pad;
        const midColWidth = totalWidth - midColX - pad;

        let y = 10; // Start Y, below tabs

        // --- LEFT COLUMN ---

        // Section 1: Actor Info (Name/Class/Level on first row, Face on second row)
        const baseFaceWidth = ImageManager.faceWidth;
        const baseFaceHeight = ImageManager.faceHeight;
        const faceScale = 1.6; // Reduced scale to fit narrower column
        const faceWidth = Math.floor(baseFaceWidth * faceScale);
        const faceHeight = Math.floor(baseFaceHeight * faceScale);
        const lineHeight = this.lineHeight();
        const infoRectH = lineHeight + faceHeight + innerPad * 2.5;

        this.drawSectionBox(leftColX, y, leftColWidth, infoRectH);

        // Draw single line: Name, Class Lv.Level
        const nameY = y + innerPad;
        this.contents.fontSize = 18;
        this.resetTextColor();
        const actorName = this._actor.name();
        const className = this._actor.currentClass().name;
        const level = this._actor.level;
        const infoText = `${actorName}, ${className} Lv.${level}`;
        const fullWidth = leftColWidth - innerPad * 2;
        this.drawText(infoText, leftColX + innerPad, nameY, fullWidth, 'left');
        this.resetFontSettings();

        // Draw face image below the text, centered in the column
        const faceY = nameY + lineHeight + innerPad * 0.5;
        const faceCenterX = leftColX + (leftColWidth - faceWidth) / 2;
        this.drawActorFace(this._actor, faceCenterX, faceY, faceWidth, faceHeight);

        y += infoRectH + (pad - 20); // Reduce padding to move gauges up

        // Section 2: Gauges (HP, MP, TP)
        const gaugeRectH = Math.floor(line * 0.95) * 3 + 12 + innerPad * 2;
        const gaugeWidth = leftColWidth - innerPad * 2;

        this.drawSectionBox(leftColX, y, leftColWidth, gaugeRectH);
        this.drawActorHp(this._actor, leftColX + innerPad, y + innerPad, gaugeWidth);
        this.drawActorMp(this._actor, leftColX + innerPad, y + innerPad + Math.floor(line * 0.95) + 4, gaugeWidth);
        this.drawActorTp(this._actor, leftColX + innerPad, y + innerPad + Math.floor(line * 0.95) * 2 + 8, gaugeWidth);

        y += gaugeRectH + (pad / 2); // Reduce padding to prevent cutoff

        // Section 3: Experience
        const expRectH = line * 2 + 12 + innerPad * 2;

        this.drawSectionBox(leftColX, y, leftColWidth, expRectH);
        this.drawActorExp(this._actor, leftColX + innerPad, y + innerPad, gaugeWidth);

        y += expRectH + pad;

        // --- MIDDLE COLUMN ---

        let yMid = 50; // Reset Y for middle column
        const midParamWidth = midColWidth - innerPad * 2;

        // Section 4: Parameters (Two columns)
        const paramRectH = (Math.floor(line * 0.8) * 3) + 10 + innerPad * 2;

        this.drawSectionBox(midColX, yMid, midColWidth, paramRectH);
        this.drawParametersColumn(midColX + innerPad, yMid + innerPad, midParamWidth);

        yMid += paramRectH + 5;

        // Section 4.5: Element
        const elementRectH = line + innerPad * 2;
        this.drawSectionBox(midColX, yMid, midColWidth, elementRectH);
        this.drawActorElement(this._actor, midColX + innerPad, yMid + innerPad, midParamWidth);

        yMid += elementRectH + 5;

        // Section 5: Traits (Fills remaining middle-column space)
        const traitsRectH = Graphics.boxHeight - yMid - 5;

        this.drawSectionBox(midColX, yMid, midColWidth, traitsRectH);
        this.drawCharacterTraitsColumn(this._actor, midColX + innerPad, yMid + innerPad, midParamWidth);

    };

    // [REFACTORED] Draws description inside its new box
    Window_CustomStatus.prototype.drawCharacterDescription = function (actor, x, y, width) {
        const useTranslation = ConfigManager.language === "it";

        this.changeTextColor(ColorManager.systemColor());
        this.contents.fontSize = 20;
        this.drawText(getText('description'), x, y, width);
        this.resetFontSettings();
        y += this.lineHeight();

        const actorId = actor.actorId();
        let description = "";

        if ($dataSystem && $dataSystem.characterDescriptions && $dataSystem.characterDescriptions[actorId]) {
            description = $dataSystem.characterDescriptions[actorId];
        } else {
            const className = actor.currentClass().name.toLowerCase();
            if (className.includes('warrior') || className.includes('fighter') || className.includes('gladiator') ||
                className.includes('guerriero') || className.includes('combattente')) {
                description = useTranslation ? translations.defaultDescriptions.warrior.it : translations.defaultDescriptions.warrior.en;
            } else if (className.includes('mage') || className.includes('wizard') || className.includes('sorcerer') ||
                className.includes('mago') || className.includes('stregone')) {
                description = useTranslation ? translations.defaultDescriptions.mage.it : translations.defaultDescriptions.mage.en;
            } else if (className.includes('priest') || className.includes('cleric') || className.includes('healer') ||
                className.includes('sacerdote') || className.includes('chierico') || className.includes('guaritore')) {
                description = useTranslation ? translations.defaultDescriptions.priest.it : translations.defaultDescriptions.priest.en;
            } else if (className.includes('rogue') || className.includes('thief') || className.includes('assassin') ||
                className.includes('ladro') || className.includes('assassino')) {
                description = useTranslation ? translations.defaultDescriptions.rogue.it : translations.defaultDescriptions.rogue.en;
            } else if (className.includes('archer') || className.includes('ranger') || className.includes('hunter') ||
                className.includes('arciere') || className.includes('cacciatore')) {
                description = useTranslation ? translations.defaultDescriptions.archer.it : translations.defaultDescriptions.archer.en;
            } else {
                const prefix = useTranslation ? translations.defaultDescriptions.default.it : translations.defaultDescriptions.default.en;
                description = `${prefix} ${actor.currentClass().name}.`;
            }
        }

        this.contents.fontSize = 16;
        this.resetTextColor();
        this.drawTextEx(description, x, y, width);
        this.resetFontSettings();
    };

    // [REFACTORED] Draws parameters inside their new box in two columns
    Window_CustomStatus.prototype.drawParametersColumn = function (x, y, width) {
        const lineHeight = this.lineHeight();
        const colWidth = Math.floor((width - 20) / 2);
        const col2X = x + colWidth + 20;

        // Draw parameters with tighter spacing in two columns
        this.contents.fontSize = 20;

        // Column 1: FRZ (2), COS (4), DES (6)
        this.drawActorParamCompact(this._actor, 2, x, y, colWidth);
        this.drawActorParamCompact(this._actor, 4, x, y + Math.floor(lineHeight * 0.8), colWidth);
        this.drawActorParamCompact(this._actor, 6, x, y + Math.floor(lineHeight * 0.8) * 2, colWidth);

        // Column 2: INT (3), WIS (5), PSI (7)
        this.drawActorParamCompact(this._actor, 3, col2X, y, colWidth);
        this.drawActorParamCompact(this._actor, 5, col2X, y + Math.floor(lineHeight * 0.8), colWidth);
        this.drawActorParamCompact(this._actor, 7, col2X, y + Math.floor(lineHeight * 0.8) * 2, colWidth);

        this.resetFontSettings();
    };

    // [REFACTORED] Draws traits inside their new box
    Window_CustomStatus.prototype.drawCharacterTraitsColumn = function (actor, x, y, width) {
        const useTranslation = ConfigManager.language === "it";

        this.changeTextColor(ColorManager.systemColor());
        this.contents.fontSize = 24;
        this.drawText(getText('traits'), x, y, width);
        this.resetFontSettings();
        y += this.lineHeight() + 5;

        if (!actor._selectedTraits || actor._selectedTraits.length === 0) {
            this.contents.fontSize = 16;
            this.resetTextColor();
            this.drawText(getText('noTraits'), x, y, width);
            this.resetFontSettings();
            return;
        }

        this.contents.fontSize = 16;
        const iconSize = ImageManager.iconWidth;
        const spacing = 5;
        const maxCharsPerLine = 12;

        for (let i = 0; i < actor._selectedTraits.length; i++) {
            const trait = actor._selectedTraits[i];
            let traitName = "";

            if (typeof trait.name === 'string' && trait.name.includes('.')) {
                traitName = (i18nData ? resolveI18nPath(trait.name, i18nData) : null) || trait.name;
            } else if (trait.name && typeof trait.name === 'object') {
                traitName = useTranslation ? trait.name.it : trait.name.en;
            } else {
                traitName = trait.name || "";
            }

            // Draw icon
            this.drawIcon(trait.icon, x, y);

            // Wrap text after 12 characters without breaking words
            const wrappedLines = this.wrapTextWithoutBreakingWords(traitName, maxCharsPerLine);
            this.resetTextColor();

            const textStartX = x + iconSize + spacing;
            const textWidth = width - iconSize - spacing;

            for (let lineIdx = 0; lineIdx < wrappedLines.length; lineIdx++) {
                this.drawText(wrappedLines[lineIdx], textStartX, y + (lineIdx * this.lineHeight()), textWidth);
            }

            y += wrappedLines.length * this.lineHeight();
        }

        this.resetFontSettings();
    };

    // Helper function to wrap text without breaking words
    Window_CustomStatus.prototype.wrapTextWithoutBreakingWords = function (text, maxChars) {
        if (!text) return [""];
        const words = text.split(' ');
        const lines = [];
        let currentLine = '';

        for (let i = 0; i < words.length; i++) {
            const word = words[i];
            const testLine = currentLine ? currentLine + ' ' + word : word;

            if (testLine.length <= maxChars) {
                currentLine = testLine;
            } else {
                if (currentLine) {
                    lines.push(currentLine);
                }
                currentLine = word;
            }
        }

        if (currentLine) {
            lines.push(currentLine);
        }

        return lines.length > 0 ? lines : [text];
    };


    //=============================================================================
    // Window_StatusStates
    //=============================================================================

    function Window_StatusStates() {
        this.initialize(...arguments);
    }

    Window_StatusStates.prototype = Object.create(Window_Base.prototype);
    Window_StatusStates.prototype.constructor = Window_StatusStates;

    Window_StatusStates.prototype.initialize = function (rect) {
        Window_Base.prototype.initialize.call(this, rect);
        this._actor = null;
        this._cycleFrame = 0;
        this._cyclePage = 0;
        this._cycleInterval = 90; // frames between page advances
    };

    Window_StatusStates.prototype.setActor = function (actor) {
        this._actor = actor;
        this._cyclePage = 0;
        this._cycleFrame = 0;
        this.refresh();
    };

    Window_StatusStates.prototype.update = function () {
        Window_Base.prototype.update.call(this);
        if (!this._actor) return;
        const states = this._getVisibleStates();
        const iconsPerRow = this._iconsPerRow();
        const rowsVisible = this._rowsVisible();
        const iconsPerPage = iconsPerRow * rowsVisible;
        if (states.length > iconsPerPage) {
            this._cycleFrame++;
            if (this._cycleFrame >= this._cycleInterval) {
                this._cycleFrame = 0;
                const totalPages = Math.ceil(states.length / iconsPerPage);
                this._cyclePage = (this._cyclePage + 1) % totalPages;
                this.refresh();
            }
        }
    };

    Window_StatusStates.prototype._getVisibleStates = function () {
        if (!this._actor) return [];
        return this._actor._states
            .map(id => $dataStates[id])
            .filter(s => s && s.iconIndex > 0);
    };

    Window_StatusStates.prototype._iconsPerRow = function () {
        return Math.max(1, Math.floor(this.contentsWidth() / (ImageManager.iconWidth + 4)));
    };

    Window_StatusStates.prototype._rowsVisible = function () {
        const headerH = this.lineHeight() + 6;
        return Math.max(1, Math.floor((this.contentsHeight() - headerH) / (ImageManager.iconHeight + 4)));
    };

    Window_StatusStates.prototype.refresh = function () {
        this.contents.clear();
        const useTranslation = ConfigManager.language === "it";
        const label = useTranslation ? "Stati" : "States";
        const cw = this.contentsWidth();

        this.changeTextColor(ColorManager.systemColor());
        this.contents.fontSize = 20;
        this.drawText(label, 0, 0, cw);
        this.resetFontSettings();

        const states = this._getVisibleStates();
        const headerH = this.lineHeight() + 6;

        if (states.length === 0) {
            this.contents.fontSize = 16;
            this.resetTextColor();
            this.drawText(useTranslation ? "Nessuno" : "None", 0, headerH, cw);
            this.resetFontSettings();
            return;
        }

        const iconW = ImageManager.iconWidth;
        const iconH = ImageManager.iconHeight;
        const rowH = Math.max(iconH, this.lineHeight()) + 2;
        const rowsAvailable = Math.max(1, Math.floor((this.contentsHeight() - headerH) / rowH));
        const useNameFormat = states.length <= rowsAvailable;

        if (useNameFormat) {
            // List format: icon + name per row
            for (let i = 0; i < states.length; i++) {
                const state = states[i];
                const iy = headerH + i * rowH;
                this.drawIcon(state.iconIndex, 0, iy);
                this.contents.fontSize = 14;
                this.resetTextColor();
                const nameY = iy + Math.floor((rowH - this.lineHeight()) / 2);
                this.drawText(state.name, iconW + 6, nameY, cw - iconW - 6);
            }
            this.resetFontSettings();
        } else {
            // Grid format: icons only with page cycling
            const iconsPerRow = this._iconsPerRow();
            const rowsVisible = this._rowsVisible();
            const iconsPerPage = iconsPerRow * rowsVisible;
            const start = this._cyclePage * iconsPerPage;
            const visible = states.slice(start, start + iconsPerPage);
            const iconWPad = iconW + 4;
            const iconHPad = iconH + 4;

            for (let i = 0; i < visible.length; i++) {
                const col = i % iconsPerRow;
                const row = Math.floor(i / iconsPerRow);
                this.drawIcon(visible[i].iconIndex, col * iconWPad, headerH + row * iconHPad);
            }

            if (states.length > iconsPerPage) {
                const totalPages = Math.ceil(states.length / iconsPerPage);
                const dotSize = 6;
                const dotSpacing = 10;
                const totalDotW = totalPages * dotSpacing - (dotSpacing - dotSize);
                let dotX = Math.floor((cw - totalDotW) / 2);
                const dotY = this.contentsHeight() - dotSize - 2;
                for (let p = 0; p < totalPages; p++) {
                    const color = p === this._cyclePage ? ColorManager.normalColor() : ColorManager.dimColor1();
                    this.contents.fillRect(dotX, dotY, dotSize, dotSize, color);
                    dotX += dotSpacing;
                }
            }
        }
    };

    //=============================================================================
    // Window_StatusParams
    //=============================================================================

    function Window_StatusParams() {
        this.initialize(...arguments);
    }

    Window_StatusParams.prototype = Object.create(Window_Base.prototype);
    Window_StatusParams.prototype.constructor = Window_StatusParams;

    Window_StatusParams.prototype.initialize = function (rect) {
        Window_Base.prototype.initialize.call(this, rect);
        this._actor = null;
    };

    Window_StatusParams.prototype.setActor = function (actor) {
        this._actor = actor;
        this.refresh();
    };

    Window_StatusParams.prototype.refresh = function () {
        this.contents.clear();
        if (!this._actor) return;
        const actor = this._actor;
        const useTranslation = ConfigManager.language === "it";
        const cw = this.contentsWidth();
        const lineH = this.lineHeight();

        // Collect equipment bonuses
        const TRAIT_XPARAM = Game_BattlerBase.TRAIT_XPARAM; // 22
        const TRAIT_SPARAM = Game_BattlerBase.TRAIT_SPARAM; // 23
        const xBonus = new Array(10).fill(0);
        const sBonus = new Array(10).fill(0);
        actor.equips().forEach(item => {
            if (!item) return;
            item.traits.forEach(t => {
                if (t.code === TRAIT_XPARAM) xBonus[t.dataId] += t.value;
                if (t.code === TRAIT_SPARAM) sBonus[t.dataId] += (t.value - 1);
            });
        });

        // Header
        this.changeTextColor(ColorManager.systemColor());
        this.contents.fontSize = 20;
        this.drawText(useTranslation ? "Parametri" : "Params", 0, 0, cw);
        this.resetFontSettings();

        let y = lineH + 6;
        let hasAny = false;

        // SP-Params (sparam)
        const sparamNames = useTranslation
            ? ["Bersaglio", "Guardia", "Recupero", "Farmaco", "Costo MP", "Costo TP", "Dan. Fis.", "Dan. Mag.", "Dan. Pav.", "EXP"]
            : ["Target", "Guard", "Recovery", "Pharm.", "MP Cost", "TP Cost", "Phys.Dmg", "Mag.Dmg", "Floor Dmg", "EXP"];

        const sparamRows = [];
        for (let i = 0; i < 10; i++) {
            if (Math.abs(sBonus[i]) < 0.0001) continue;
            const total = Math.round(actor.sparam(i) * 1000) / 10;
            const bonus = Math.round(sBonus[i] * 1000) / 10;
            sparamRows.push({ name: sparamNames[i], total, bonus });
        }

        if (sparamRows.length > 0) {
            hasAny = true;
            this.changeTextColor(ColorManager.systemColor());
            this.contents.fontSize = 15;
            this.drawText(useTranslation ? "— Parametri Speciali —" : "— SP-Params —", 0, y, cw, 'center');
            y += lineH;
            this.contents.fontSize = 13;
            for (const row of sparamRows) {
                this.resetTextColor();
                this.drawText(row.name, 0, y, Math.floor(cw * 0.42));
                const totalStr = row.total.toFixed(1) + "%";
                const bonusStr = (row.bonus >= 0 ? "+" : "") + row.bonus.toFixed(1) + "%";
                this.changeTextColor(row.bonus >= 0 ? ColorManager.powerUpColor() : ColorManager.powerDownColor());
                this.drawText(totalStr, Math.floor(cw * 0.44), y, Math.floor(cw * 0.28), 'right');
                this.drawText("(" + bonusStr + ")", Math.floor(cw * 0.74), y, Math.floor(cw * 0.26), 'right');
                y += lineH;
            }
        }

        // EX-Params (xparam)
        const xparamNames = useTranslation
            ? ["Colpo", "Schivata", "Critico", "Schiv. Crit.", "Schiv. Mag.", "Rifl. Mag.", "Contrattacco", "Rig. HP", "Rig. MP", "Rig. TP"]
            : ["Hit", "Evasion", "Critical", "Crit.Eva", "Mag.Eva", "Mag.Refl.", "Counter", "HP Regen", "MP Regen", "TP Regen"];

        const xparamRows = [];
        for (let i = 0; i < 10; i++) {
            if (Math.abs(xBonus[i]) < 0.0001) continue;
            const total = Math.round(actor.xparam(i) * 1000) / 10;
            const bonus = Math.round(xBonus[i] * 1000) / 10;
            xparamRows.push({ name: xparamNames[i], total, bonus });
        }

        if (xparamRows.length > 0) {
            hasAny = true;
            if (sparamRows.length > 0) y += 4;
            this.changeTextColor(ColorManager.systemColor());
            this.contents.fontSize = 15;
            this.drawText(useTranslation ? "— Parametri Extra —" : "— EX-Params —", 0, y, cw, 'center');
            y += lineH;
            this.contents.fontSize = 13;
            for (const row of xparamRows) {
                this.resetTextColor();
                this.drawText(row.name, 0, y, Math.floor(cw * 0.42));
                const totalStr = row.total.toFixed(1) + "%";
                const bonusStr = (row.bonus >= 0 ? "+" : "") + row.bonus.toFixed(1) + "%";
                this.changeTextColor(row.bonus >= 0 ? ColorManager.powerUpColor() : ColorManager.powerDownColor());
                this.drawText(totalStr, Math.floor(cw * 0.44), y, Math.floor(cw * 0.28), 'right');
                this.drawText("(" + bonusStr + ")", Math.floor(cw * 0.74), y, Math.floor(cw * 0.26), 'right');
                y += lineH;
            }
        }

        if (!hasAny) {
            this.contents.fontSize = 16;
            this.resetTextColor();
            this.drawText(useTranslation ? "Nessun bonus equipaggiamento" : "No equipment bonuses", 0, lineH + 6, cw, 'center');
        }

        this.resetFontSettings();
    };

    // [REFACTORED] Draws HP with full width and new gauge
    Window_CustomStatus.prototype.drawActorHp = function (actor, x, y, width) {
        this.contents.fontSize = 18;
        this.changeTextColor(ColorManager.systemColor());
        this.drawText(TextManager.hpA, x, y, 40);
        const current = actor.hp;
        const max = actor.mhp;
        this.changeTextColor(ColorManager.hpColor(actor));
        this.drawText(current + "/" + max, x + 45, y, width - 45, "right");

        const gaugeY = y + this.lineHeight() - 6;
        const rate = max > 0 ? current / max : 0;
        this.drawGauge(x, gaugeY, width, 6, rate, ColorManager.hpGaugeColor1(), ColorManager.hpGaugeColor2());
        this.resetFontSettings();
    };

    // [REFACTORED] Draws MP with full width and new gauge
    Window_CustomStatus.prototype.drawActorMp = function (actor, x, y, width) {
        this.contents.fontSize = 18;
        this.changeTextColor(ColorManager.systemColor());
        this.drawText(TextManager.mpA, x, y, 40);
        const current = actor.mp;
        const max = actor.mmp;
        this.changeTextColor(ColorManager.mpColor(actor));
        this.drawText(current + "/" + max, x + 45, y, width - 45, "right");

        const gaugeY = y + this.lineHeight() - 6;
        const rate = max > 0 ? current / max : 0;
        this.drawGauge(x, gaugeY, width, 6, rate, ColorManager.mpGaugeColor1(), ColorManager.mpGaugeColor2());
        this.resetFontSettings();
    };

    // [REFACTORED] Draws TP with full width and new gauge
    Window_CustomStatus.prototype.drawActorTp = function (actor, x, y, width) {
        this.contents.fontSize = 18;
        this.changeTextColor(ColorManager.systemColor());
        this.drawText(TextManager.tpA, x, y, 40);
        const current = actor.tp;
        const max = actor.maxTp();
        this.changeTextColor(ColorManager.tpColor(actor));
        this.drawText(current + "/" + max, x + 45, y, width - 45, "right");

        const gaugeY = y + this.lineHeight() - 6;
        this.drawGauge(x, gaugeY, width, 6, current / max, ColorManager.tpGaugeColor1(), ColorManager.tpGaugeColor2());
        this.resetFontSettings();
    };

    // [REFACTORED] Draws EXP, fixing label width bug
    // [REFACTORED] Draws EXP, fixing label width bug and EXP bar logic
    Window_CustomStatus.prototype.drawActorExp = function (actor, x, y, width) {
        this.contents.fontSize = 16;

        const currentExp = actor.currentExp() || 0;
        let rate = 0;
        let expForThisLevel = 0;
        let expGainedThisLevel = 0;

        if (actor.isMaxLevel()) {
            rate = 1;
            expForThisLevel = 0;
            expGainedThisLevel = 0;
        } else {
            // Correct logic for a "progress within level" EXP bar
            const currentLevelExp = actor.currentLevelExp(); // Total EXP needed for current level
            const nextLevelExp = actor.nextLevelExp();     // Total EXP needed for next level

            expForThisLevel = nextLevelExp - currentLevelExp; // How much EXP this level requires
            expGainedThisLevel = currentExp - currentLevelExp;  // How much EXP gained since last level

            if (expForThisLevel > 0) {
                rate = expGainedThisLevel / expForThisLevel;
            } else {
                rate = 0; // Should not happen, but good to prevent division by zero
            }
        }

        rate = isFinite(rate) ? Math.max(0, Math.min(1, rate)) : 0;

        // Draw EXP text above the bar: EXP: 50/4500
        this.changeTextColor(ColorManager.textColor(6)); // Yellow color for "EXP:"
        this.drawText("EXP:", x, y, width, 'left');

        const expText = `${expGainedThisLevel}/${expForThisLevel}`;
        this.resetTextColor(); // Default color for the numbers
        this.drawText(expText, x + this.textWidth("EXP:") + 10, y, width - this.textWidth("EXP:") - 10, 'left');

        // Draw the gauge below the text
        const gaugeY = y + this.lineHeight();
        this.drawGauge(x, gaugeY, width, 6, rate, ColorManager.normalColor(), ColorManager.normalColor());
        this.resetFontSettings();
    };

    Window_CustomStatus.prototype.drawActorParamCompact = function (actor, paramId, x, y, width) {
        this.changeTextColor(ColorManager.systemColor());
        const paramName = TextManager.param(paramId);
        this.drawText(paramName, x, y, 70);
        const modifier = (actor._statModifiers && actor._statModifiers[paramId]) || 0;
        if (modifier !== 0) {
            const currentVal = actor.param(paramId);
            const originalVal = currentVal - modifier;
            const valAreaX = x + 75;
            const valAreaW = width - 75;
            // Draw original value in gray
            this.changeTextColor('#888888');
            const origStr = String(originalVal);
            const origW = this.textWidth(origStr);
            this.drawText(origStr, valAreaX, y, valAreaW, "left");
            // Draw arrow separator
            this.changeTextColor(ColorManager.normalColor());
            const arrowStr = '→';
            const arrowW = this.textWidth(arrowStr);
            this.drawText(arrowStr, valAreaX + origW + 2, y, valAreaW, "left");
            // Draw debuffed value in red
            this.changeTextColor(ColorManager.hpGaugeColor1());
            this.drawText(String(currentVal), valAreaX + origW + arrowW + 4, y, valAreaW, "left");
        } else {
            this.resetTextColor();
            this.drawText(actor.param(paramId), x + 75, y, width - 75, "left");
        }
        this.resetTextColor();
    };

    // Draw actor element with icon
    Window_CustomStatus.prototype.drawActorElement = function (actor, x, y, width) {
        const actorClass = actor.currentClass();
        if (!actorClass || !actorClass.note) return;

        // Extract element ID from class note
        const elemMatch = actorClass.note.match(/<elem:\s*(\d+)>/);
        if (!elemMatch) return;

        const elementId = parseInt(elemMatch[1]);
        if (elementId <= 0 || elementId >= $dataSystem.elements.length) return;

        // Element translations for Italian
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

        // Element icon mapping: Physical=96, Fire=64, Ice=65, Thunder=66, Water=67, Petro=68, Wind=69, Sacred=70, Cursed=71
        const elementIcons = [0, 96, 64, 65, 66, 67, 68, 69, 70, 71];
        const elementIcon = elementIcons[elementId] || 0;

        this.contents.fontSize = 18;
        this.changeTextColor(ColorManager.systemColor());
        const elementLabel = ConfigManager.language === "it" ? "Elem:" : "Elem:";
        this.drawText(elementLabel, x, y, 100);

        this.resetTextColor();
        this.drawText(elementName, x + 110, y, width - 150);

        // Draw element icon after the name
        if (elementIcon > 0) {
            const textWidth = this.textWidth(elementName);
            this.drawIcon(elementIcon, x + 110 + textWidth + 8, y - 2);
        }

        this.resetFontSettings();
    };

    // [REFACTORED] Draws states inside their new box
    Window_CustomStatus.prototype.drawActorStates = function (actor, x, y, width) {
        this.changeTextColor(ColorManager.systemColor());
        this.contents.fontSize = 18;
        this.drawText(getText('states'), x, y, 200);
        this.resetFontSettings();
        y += this.lineHeight() + 5;

        const states = actor._states.map(id => $dataStates[id]).filter(state => state && state.iconIndex > 0);

        if (states.length === 0) {
            this.resetTextColor();
            this.contents.fontSize = 16;
            this.drawText(getText('none'), x, y, 200);
            this.resetFontSettings();
            return;
        }

        const iconWidth = ImageManager.iconWidth + 2;
        const maxIconsPerRow = Math.floor(width / iconWidth);

        for (let i = 0; i < states.length; i++) {
            const iconX = x + (i % maxIconsPerRow) * iconWidth;
            const iconY = y + Math.floor(i / maxIconsPerRow) * (ImageManager.iconHeight + 2);
            this.drawIcon(states[i].iconIndex, iconX, iconY);
        }

        // Draw names below icons
        const iconRows = Math.ceil(states.length / maxIconsPerRow);
        y += iconRows * (ImageManager.iconHeight + 2) + 5;
        this.contents.fontSize = 14;

        for (let i = 0; i < Math.min(states.length, 3); i++) {
            const textY = y + i * (this.lineHeight() - 5);
            this.resetTextColor();
            this.drawText(states[i].name, x, textY, width);
        }
        if (states.length > 3) {
            const textY = y + 3 * (this.lineHeight() - 5);
            const moreText = `+${states.length - 3} ${getText('more')}`;
            this.drawText(moreText, x, textY, width);
        }
        this.resetFontSettings();
    };

    // [MODIFIED] Gauge function now accepts height
    Window_CustomStatus.prototype.drawGauge = function (x, y, width, height, rate, color1, color2) {
        const fillW = Math.floor((width - 2) * rate);
        const gaugeH = height;
        this.contents.fillRect(x, y, width, gaugeH, ColorManager.gaugeBackColor());
        this.contents.gradientFillRect(x + 1, y + 1, fillW, gaugeH - 2, color1, color2);
    };

})();
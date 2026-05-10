//=============================================================================
// VisualNovelBustSystem.js
//=============================================================================

/*:
 * @target MZ
 * @plugindesc Visual Novel Face System v2.0.0 (Face image variables)
 * @author Omni-Lex
 * @version 2.0.0
 * @description Visual novel-style face display with variable-based image loading. Loads faces from img/faces/ using Variables 106-108 per actor.
 * @url
 * @help VisualNovelBustSystem.js
 *
 * Loads character faces from img/faces/ directory based on Variables 106-108.
 * Each actor uses their stored variable name:
 * - Actor 1: Variable 106
 * - Actor 2: Variable 107
 * - Actor 3: Variable 108
 *
 * Displays faces during dialogue with character names in top-left corner,
 * keeps faces visible across multiple messages within the same event,
 * auto-hides only when the event completely ends,
 * provides manual commands, adjusts to screen resolution changes,
 * and adjusts choice window position.
 * 
 * @param showCharacterNames
 * @text Show Character Names
 * @desc Display character names in top-left corner during dialogue
 * @type boolean
 * @default true
 * 
 * @param nameWindowWidth
 * @text Name Window Width
 * @desc Width of the character name window
 * @type number
 * @default 300
 * 
 * @param nameWindowHeight
 * @text Name Window Height
 * @desc Height of the character name window
 * @type number
 * @default 60
 * 
 * @param nameWindowX
 * @text Name Window X Position
 * @desc X position of the name window from left edge
 * @type number
 * @default 250
 *
 * @param nameWindowY
 * @text Name Window Y Position
 * @desc Y position of the name window from top edge
 * @type number
 * @default 80
 *
 * @param bustYOffset
 * @text Bust Y Offset
 * @desc How many pixels to raise the bust above the bottom of the screen (4:3 mode).
 * @type number
 * @default 180
 *
 * @param bustYOffset_16_9
 * @text Bust Y Offset (16:9)
 * @desc How many pixels to raise the bust above the bottom of the screen (16:9 mode).
 * @type number
 * @default 180
 *
 * @command showBust
 * @text Show Character Bust
 * @desc Manually display a character bust on screen (automatically detects current event's sprite).
 *
 * @command hideBusts
 * @text Hide All Busts
 * @desc Manually hide all bust images and names.
 * 
 * @command batchDialogue
 * @text Batch Dialogue Mode
 * @desc Enable batch dialogue mode - bust stays visible across multiple messages until conversation ends.
 * 
 * @command setPartyBust
 * @text Set Party Member Bust
 * @desc Detect and assign a custom bust image from img/busts based on naming conventions.
 *
 * @arg memberIndex
 * @type number
 * @min 0
 * @max 2
 * @text Party Member Index
 * @desc Index of the party member in the party (0 = first slot, 1 = second, 2 = third).
 * 
 * @command showCustomBust
 * @text Show Custom Bust
 * @desc Display a specific bust image from the busts/All folder.
 *
 * @arg imageName
 * @type string
 * @text Image Name
 * @desc Name of the image file in busts/All folder (without extension).
 *
 * @arg characterName
 * @type string
 * @text Character Name
 * @desc Name to display for this character (optional).
 * 
 * @command playerBatchDialogue
 * @text Show Player bust
 * @desc Display a specific bust image from the busts/All folder.
 * @arg imageName
 * @type string
 * @text Image Name
 * @desc Name of the image file in busts/All folder (without extension).

 */
(function () {
    "use strict";

    const PLUGIN_NAME = "VisualNovelBustSystem";
    const parameters = PluginManager.parameters(PLUGIN_NAME);
    const showCharacterNames = parameters['showCharacterNames'] === 'true';
    const nameWindowWidth = parseInt(parameters['nameWindowWidth']) || 300;
    const nameWindowHeight = parseInt(parameters['nameWindowHeight']) || 60;
    const nameWindowX = parseInt(parameters['nameWindowX']) || 20;
    const nameWindowY = parseInt(parameters['nameWindowY']) || 20;
    const nameWindowX_16_9 = parseInt(parameters['nameWindowX_16_9']) || 250;
    const nameWindowY_16_9 = 420;

    // Parameters
    const bustOpacity = 255;
    const bustWidth = 360;  // Increased from 256 to accommodate 889x1200 images
    const bustHeight = 490; // Increased from 256 to accommodate 889x1200 images (maintains 889/1200 aspect ratio)
    const bustWidth_16_9 = 440;  // Larger bust in 16:9 mode
    const bustHeight_16_9 = 615; // Larger bust in 16:9 mode (maintains 889/1200 aspect ratio)
    const bustYOffset = parseInt(parameters['bustYOffset']) || 180;
    const bustYOffset_16_9 = 220;
    const bustXOffset_16_9 = 245; // Right margin (50px from right edge) in widescreen
    const choiceOffsetLeft = 20; // Left offset for choices in 4:3 mode
    const choiceOffsetLeft_16_9 = 20; // Left offset for choices in 16:9 mode
    const fadeInDuration = 12;
    const fadeOutDuration = 12;
    const choiceOffset = 140;
    const { SpritesAssociation } = window.Sprites;

    // Resolution detection helper
    function isWidescreen() {
        return true;
    }

    function getNameWindowX() {
        return isWidescreen() ? nameWindowX_16_9 : nameWindowX;
    }

    function getNameWindowY() {
        return isWidescreen() ? nameWindowY_16_9 : nameWindowY;
    }

    function getBustWidth() {
        return isWidescreen() ? bustWidth_16_9 : bustWidth;
    }

    function getBustHeight() {
        return isWidescreen() ? bustHeight_16_9 : bustHeight;
    }

    function addBustToScene(bust, scene) {
        if (!scene || bust.parent) return;

        // Find the window layer and insert bust before it (behind all windows)
        if (scene._windowLayer) {
            const windowLayerIndex = scene.children.indexOf(scene._windowLayer);
            if (windowLayerIndex >= 0) {
                scene.addChildAt(bust, windowLayerIndex);
                return;
            }
        }

        // Fallback: try to add before message window directly
        if (scene._messageWindow) {
            const messageWindowIndex = scene.children.indexOf(scene._messageWindow);
            if (messageWindowIndex >= 0) {
                scene.addChildAt(bust, messageWindowIndex);
                return;
            }
        }

        // Last resort: add at the end
        scene.addChild(bust);
    }

    class CharacterNameWindow extends Window_Base {
        constructor(rect) {
            super(rect);
            this.opacity = 255;
            this.backOpacity = 192;
            this._characterName = "";
            this._targetOpacity = 0;
            this._fadeSpeed = 15;
            this.hide();
        }

        setCharacterName(name) {
            this._characterName = name || "";
            this.refresh();
        }

        refresh() {
            this.contents.clear();
            if (this._characterName) {
                const textWidth = this.textWidth(this._characterName);
                const x = (this.contents.width - textWidth) / 2;
                const y = (this.contents.height - this.lineHeight()) / 2;
                this.drawText(this._characterName, x, y, textWidth, 'center');
            }
        }

        showName() {
            if (this._characterName) {
                this.show();
                this._targetOpacity = 255;
            }
        }

        hideName() {
            this._targetOpacity = 0;
        }

        updatePosition() {
            this.x = getNameWindowX();
            this.y = getNameWindowY();
        }

        update() {
            super.update();
            if (this.opacity !== this._targetOpacity) {
                const delta = this._targetOpacity > this.opacity ? this._fadeSpeed : -this._fadeSpeed;
                this.opacity = Math.max(0, Math.min(255, this.opacity + delta));
                this.backOpacity = Math.max(0, Math.min(192, (this.opacity / 255) * 192));
                if (this.opacity === 0 && this._targetOpacity === 0) {
                    this.hide();
                }
            }
        }
    }

    class BustManager {
        constructor() {
            this.characterBust = null;
            this.nameWindow = null;
            this.currentCharacterKey = null;
            this.batchDialogueMode = false;
            this.nameIsVisible = false;
            this.bustIsVisible = false;

            this.activeEventId = null;
            this.lastKnownEventId = null;
            this.hideScheduled = false;
        }

        initialize() {
            this.createBustSprites();
            if (showCharacterNames) {
                this.createNameWindow();
            }
        }

        createBustSprites() {
            this.characterBust = new Sprite();
            this.characterBust.opacity = 0;
            this.characterBust.anchor.x = 0;
            this.characterBust.anchor.y = 1;
            this.setupBustPosition(this.characterBust);
            this.updateBustHiddenPosition();
            this.characterBust.x = this.characterBust._hiddenX;
        }

        createNameWindow() {
            const rect = new Rectangle(
                getNameWindowX(),
                getNameWindowY(),
                nameWindowWidth,
                nameWindowHeight
            );
            this.nameWindow = new CharacterNameWindow(rect);
        }

        updateBustHiddenPosition() {
            const xOffset = isWidescreen() ? bustXOffset_16_9 : 0;
            const width = getBustWidth();
            this.characterBust._hiddenX = Graphics.width + width;
            this.characterBust._targetX = Graphics.width - width - xOffset;
        }

        getBustY() {
            const yOffset = isWidescreen() ? bustYOffset_16_9 : bustYOffset;
            return Graphics.height - yOffset;
        }

        setupBustPosition(sprite) {
            sprite.y = this.getBustY();
        }

        scaleBustToFit(sprite) {
            if (!sprite.bitmap || !sprite.bitmap.width || !sprite.bitmap.height) {
                sprite.bitmap.addLoadListener(() => this.scaleBustToFit(sprite));
                return;
            }
            const width = getBustWidth();
            const height = getBustHeight();
            const scaleX = width / sprite.bitmap.width;
            const scaleY = height / sprite.bitmap.height;
            const scale = Math.min(scaleX, scaleY);
            sprite.scale.x = scale;
            sprite.scale.y = scale;
        }

        getBustImageForCharacter(characterName, characterIndex) {
            if (!characterName) return null;

            if (characterName.startsWith("$") || characterName.startsWith("!") || characterName.startsWith("Objects")) {
                return "busts/7";
            }

            const spritesheetName = characterName.split('.')[0];
            const actorId = this.getCurrentActorIdFromEvent();

            // Priority 1: Check event comments for bust name
            try {
                const commentBustName = this.getBustNameFromEventComment();
                if (commentBustName) {
                    return `busts/${commentBustName}`;
                }
            } catch (err) {
                console.warn("Error checking event comments for bust name:", err);
            }
            if (SpritesAssociation[spritesheetName] && SpritesAssociation[spritesheetName][characterIndex]) {
                const bustName = SpritesAssociation[spritesheetName][characterIndex];
                return `busts/${bustName}`;
            }
            return `busts/7`;

            /*
                        // Player 1 (Actor 1) special handling
                        if (actorId === 1) {
                            // Priority 2: Check Variable 109 (Player 1 bust name)
                            const player1BustName = $gameVariables.value(109);
                            if (player1BustName && player1BustName !== "") {
                                return `busts/${player1BustName}`;
                            }
            
                            // Priority 3: If Switch 77 is ON, use Variable 106 for monster form
                            if ($gameSwitches.value(77)) {
                                const player1MonsterName = $gameVariables.value(106);
                                if (player1MonsterName && player1MonsterName !== "") {
                                    return `monsters/${player1MonsterName}`;
                                }
                            }
            
                            // Priority 4: Fall back to SpritesAssociation
                        
                            return `busts/7`;
                        }
            
                        // Players 2 & 3: Use SpritesAssociation based on sprite
                        if (SpritesAssociation[spritesheetName] && SpritesAssociation[spritesheetName][characterIndex]) {
                            const bustName = SpritesAssociation[spritesheetName][characterIndex];
                            return `busts/${bustName}`;
                        }
            
                        // Fallback if sprite not found in association
                        return `busts/7`;*/
        }

        getBustNameFromEventComment() {
            try {
                const interpreter = $gameMap._interpreter;
                if (!interpreter || !interpreter._eventId) return null;

                const gameEvent = $gameMap.event(interpreter._eventId);
                if (!gameEvent) return null;

                const eventData = gameEvent.event();
                if (!eventData || !eventData.pages) return null;

                const page = eventData.pages.find(p => gameEvent.meetsConditions(p));
                if (!page || !page.list) return null;

                // Search through the event commands for comment commands
                for (const command of page.list) {
                    if (command.code === 108 || command.code === 408) { // 108 = comment, 408 = comment continuation
                        const comment = command.parameters[0];
                        if (comment && typeof comment === 'string') {
                            const trimmedComment = comment.trim();
                            // Check if comment matches a bust filename pattern
                            if (trimmedComment && !trimmedComment.includes(' ') && trimmedComment.length > 0) {
                                return trimmedComment;
                            }
                        }
                    }
                }

                return null;
            } catch (err) {
                console.error("Error extracting bust name from event comment:", err);
                return null;
            }
        }

        getCurrentActorIdFromEvent() {
            // Try to determine which actor is currently speaking from the event name
            const interpreter = $gameMap._interpreter;
            if (!interpreter || !interpreter._eventId) {
                return 1; // Default to Player 1
            }

            const gameEvent = $gameMap.event(interpreter._eventId);
            if (!gameEvent) {
                return 1; // Default to Player 1
            }

            const eventName = gameEvent.event().name || "";

            // Check the event's name to determine which actor it represents
            if (eventName.toLowerCase().includes('actor2') ||
                eventName.toLowerCase().includes('member2') ||
                eventName.toLowerCase().includes('party2')) {
                return 2;
            } else if (eventName.toLowerCase().includes('actor3') ||
                eventName.toLowerCase().includes('member3') ||
                eventName.toLowerCase().includes('party3')) {
                return 3;
            }

            return 1; // Default to Player 1
        }

        getCharacterDisplayName(eventId) {
            if (eventId) {
                const gameEvent = $gameMap.event(eventId);
                if (gameEvent && gameEvent.event().name) {
                    return gameEvent.event().name;
                }
            }

            const charInfo = this.getCurrentEventCharacterInfo();
            if (charInfo && charInfo.characterName) {
                const spritesheetName = charInfo.characterName.split('.')[0];
                return this.convertCamelCaseToReadable(spritesheetName);
            }

            return "";
        }

        convertCamelCaseToReadable(text) {
            if (!text || typeof text !== 'string') return '';

            // First replace underscores with spaces
            let result = text.replace(/_/g, ' ');

            // Insert space before uppercase letters that follow lowercase letters
            result = result.replace(/([a-z])([A-Z])/g, '$1 $2');

            // Insert space before uppercase letters followed by lowercase (for acronyms)
            result = result.replace(/([A-Z]+)([A-Z][a-z])/g, '$1 $2');

            // Capitalize first letter of each word
            result = result.split(' ').map(word => {
                if (word.length === 0) return word;
                return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
            }).join(' ');

            return result;
        }

        getCurrentEventCharacterInfo() {
            const interpreter = $gameMap._interpreter;
            if (!interpreter || !interpreter._eventId) return null;
            const gameEvent = $gameMap.event(interpreter._eventId);
            if (!gameEvent) return null;
            const page = gameEvent.event().pages.find(p => gameEvent.meetsConditions(p));
            if (!page || !page.image || !page.image.characterName) return null;
            return {
                characterName: page.image.characterName,
                characterIndex: page.image.characterIndex,
                eventId: interpreter._eventId
            };
        }

        shouldShowBustAndName() {
            const interpreter = $gameMap._interpreter;
            if (!interpreter || !interpreter._eventId) return false;

            const gameEvent = $gameMap.event(interpreter._eventId);
            if (!gameEvent) return false;

            const eventName = gameEvent.event().name;

            if (eventName && (eventName.startsWith("EV") || eventName.startsWith("Treasure") || eventName.startsWith("Random"))) {
                return false;
            }

            const page = gameEvent.event().pages.find(p => gameEvent.meetsConditions(p));
            if (!page || !page.image) return false;

            if (!page.image.characterName || page.image.characterName === "" || page.image.characterName === "none") {
                return false;
            }

            if (page.image.characterName.toLowerCase().includes("objects/") || page.image.characterName.toLowerCase().startsWith("objects")) {
                return false;
            }

            return true;
        }

        showCustomBust(imageName, characterName = null) {
            if (!imageName) {
                console.warn("No image name provided for custom bust");
                return;
            }

            const path = `busts/${imageName}`;
            const key = `custom_${imageName}`;

            // Load fallback image with error handling
            let fallbackImage = null;
            try {
                fallbackImage = ImageManager.loadBitmap('img/busts/', '7');
            } catch (err) {
                console.error("Failed to load fallback bust image busts/7:", err);
                fallbackImage = null;
            }

            const sameImageDisplayed = this.currentCharacterKey === key && this.characterBust.parent;

            if (showCharacterNames && this.nameWindow) {
                const displayName = characterName || this.convertCamelCaseToReadable(imageName);
                this.nameWindow.setCharacterName(displayName);
                this.nameWindow.updatePosition();
                const scene = SceneManager._scene;
                if (!this.nameWindow.parent && scene) {
                    scene.addChild(this.nameWindow);
                }
                this.nameWindow.showName();
                this.nameIsVisible = true;
            }

            if (sameImageDisplayed) {
                return;
            }

            try {
                const bitmap = ImageManager.loadBitmap('img/', path);
                bitmap.addLoadListener(() => {
                    try {
                        // Check if image loaded successfully
                        if (bitmap.width > 0 && bitmap.height > 0) {
                            this.characterBust.bitmap = bitmap;
                        } else {
                            // Use fallback if primary image failed
                            if (fallbackImage) {
                                this.characterBust.bitmap = fallbackImage;
                                console.warn("Failed to load custom bust image:", path, "using fallback");
                            } else {
                                console.error("Failed to load custom bust image and fallback not available:", path);
                            }
                        }
                        this.scaleBustToFit(this.characterBust);
                    } catch (err) {
                        console.error("Error processing custom bust image:", path, err);
                        if (fallbackImage) {
                            this.characterBust.bitmap = fallbackImage;
                            this.scaleBustToFit(this.characterBust);
                        }
                    }
                });
                this.currentCharacterKey = key;
                const scene = SceneManager._scene;
                if (!this.characterBust.parent && scene) addBustToScene(this.characterBust, scene);

                this.slideIn();
                this.bustIsVisible = true;

                this.activeEventId = 'custom';
                this.hideScheduled = false;
            } catch (err) {
                console.warn("Failed to load custom bust image:", path, "using fallback", err);
                if (fallbackImage) {
                    this.characterBust.bitmap = fallbackImage;
                    this.scaleBustToFit(this.characterBust);
                    this.currentCharacterKey = key;
                    const scene = SceneManager._scene;
                    if (!this.characterBust.parent && scene) addBustToScene(this.characterBust, scene);
                    this.slideIn();
                    this.bustIsVisible = true;
                    this.activeEventId = 'custom';
                    this.hideScheduled = false;
                } else {
                    console.error("Fallback bust image not available, bust display failed");
                    this.bustIsVisible = false;
                }
            }
        }

        showBusts() {
            const charInfo = this.getCurrentEventCharacterInfo();

            const shouldShow = this.shouldShowBustAndName();

            if (!shouldShow || !charInfo) {
                this.bustIsVisible = false;
                return;
            }

            const { characterName, characterIndex, eventId } = charInfo;
            const key = `${characterName}_${characterIndex}`;

            // Load fallback image with error handling
            let fallbackImage = null;
            try {
                fallbackImage = ImageManager.loadBitmap('img/busts/', '7');
            } catch (err) {
                console.error("Failed to load fallback bust image busts/7:", err);
                fallbackImage = null;
            }

            this.activeEventId = eventId;
            this.lastKnownEventId = eventId;
            this.hideScheduled = false;

            // Update position based on speaker in dual screen mode
            let targetX = this.characterBust._targetX;
            if (window.$gameSplitScreen && window.$gameSplitScreen.active) {
                const activator = $gameMessage._eventActivator;
                const width = getBustWidth();
                if (activator === "p1") {
                    targetX = 0; // Left side
                } else if (activator === "p2") {
                    targetX = Graphics.width - width; // Right side
                } else {
                    targetX = (Graphics.width - width) / 2; // Center
                }
            } else {
                const xOffset = isWidescreen() ? bustXOffset_16_9 : 0;
                const width = getBustWidth();
                targetX = Graphics.width - width - xOffset;
            }

            const targetChanged = targetX !== this.characterBust._targetX;
            this.characterBust._targetX = targetX;

            if (this.currentCharacterKey === key && this.characterBust.parent) {
                if (targetChanged) {
                    this.slideIn();
                }
                if (showCharacterNames && this.nameWindow && !this.nameIsVisible) {
                    this.nameWindow.showName();
                    this.nameIsVisible = true;
                }
                this.bustIsVisible = true;
                return;
            }

            const path = this.getBustImageForCharacter(characterName, characterIndex);
            if (path) {
                try {
                    const bitmap = ImageManager.loadBitmap('img/', path);
                    bitmap.addLoadListener(() => {
                        try {
                            // Check if image loaded successfully
                            if (bitmap.width > 0 && bitmap.height > 0) {
                                this.characterBust.bitmap = bitmap;
                            } else {
                                // Use fallback if primary image failed
                                if (fallbackImage) {
                                    this.characterBust.bitmap = fallbackImage;
                                    console.warn("Failed to load bust image:", path, "using fallback");
                                } else {
                                    console.error("Failed to load bust image and fallback not available:", path);
                                }
                            }
                            this.scaleBustToFit(this.characterBust);
                        } catch (err) {
                            console.error("Error processing bust image:", path, err);
                            if (fallbackImage) {
                                this.characterBust.bitmap = fallbackImage;
                                this.scaleBustToFit(this.characterBust);
                            }
                        }
                    });
                    this.currentCharacterKey = key;
                    const scene = SceneManager._scene;
                    if (!this.characterBust.parent && scene) addBustToScene(this.characterBust, scene);

                    if (showCharacterNames && this.nameWindow) {
                        const displayName = this.getCharacterDisplayName(eventId);
                        this.nameWindow.setCharacterName(displayName);
                        this.nameWindow.updatePosition();
                        if (!this.nameWindow.parent && scene) scene.addChild(this.nameWindow);
                        this.nameWindow.showName();
                        this.nameIsVisible = true;
                    }

                    this.slideIn();
                    this.bustIsVisible = true;
                } catch (err) {
                    console.warn("Failed to load bust image:", path, "using fallback", err);
                    if (fallbackImage) {
                        this.characterBust.bitmap = fallbackImage;
                        this.scaleBustToFit(this.characterBust);
                        this.currentCharacterKey = key;
                        const scene = SceneManager._scene;
                        if (!this.characterBust.parent && scene) addBustToScene(this.characterBust, scene);

                        if (showCharacterNames && this.nameWindow) {
                            const displayName = this.getCharacterDisplayName(eventId);
                            this.nameWindow.setCharacterName(displayName);
                            this.nameWindow.updatePosition();
                            if (!this.nameWindow.parent && scene) scene.addChild(this.nameWindow);
                            this.nameWindow.showName();
                            this.nameIsVisible = true;
                        }

                        this.slideIn();
                        this.bustIsVisible = true;
                    } else {
                        console.error("Fallback bust image not available, bust display failed");
                        this.bustIsVisible = false;
                    }
                }
            }
        }

        hideBusts() {
            if (this.characterBust.parent) this.slideOut();

            if (showCharacterNames && this.nameWindow) {
                this.nameWindow.hideName();
                this.nameIsVisible = false;
            }

            this.currentCharacterKey = null;
            this.batchDialogueMode = false;
            this.bustIsVisible = false;
            this.activeEventId = null;
            this.hideScheduled = false;
        }

        enableBatchDialogue() {
            this.batchDialogueMode = true;
            this.showBusts();
        }

        isStillInActiveEvent() {
            const interpreter = $gameMap._interpreter;
            if (!interpreter) return false;
            return interpreter._eventId === this.activeEventId;
        }

        hasEventEnded() {
            const interpreter = $gameMap._interpreter;
            if (!interpreter) return true;
            if (!interpreter.isRunning()) return true;
            if (interpreter._eventId !== this.activeEventId && this.activeEventId !== null) return true;
            return false;
        }

        shouldAutoHide() {
            if (this.batchDialogueMode) return false;
            if (this.isStillInActiveEvent()) return false;
            return this.hasEventEnded();
        }

        isBustVisible() {
            return this.bustIsVisible && this.characterBust.parent && this.characterBust.opacity > 0;
        }

        isMessageWindowClosed() {
            const scene = SceneManager._scene;
            if (!scene || !scene._messageWindow) return true;
            return !scene._messageWindow.isOpen() && !scene._messageWindow.isOpening();
        }

        onResolutionChange() {
            this.updateBustHiddenPosition();

            // Update Y position as well
            this.characterBust.y = this.getBustY();

            if (this.characterBust.parent) {
                if (this.characterBust._slideDuration > 0) {
                    this.characterBust._slideTarget = this.characterBust._targetX;
                } else if (this.bustIsVisible) {
                    this.characterBust.x = this.characterBust._targetX;
                }
            }

            if (this.nameWindow) {
                this.nameWindow.updatePosition();
            }
        }

        slideIn() {
            this.characterBust._slideTarget = this.characterBust._targetX;
            this.characterBust._slideDuration = fadeInDuration;
            this.characterBust._slideType = 'in';
        }

        slideOut() {
            this.characterBust._slideTarget = this.characterBust._hiddenX;
            this.characterBust._slideDuration = fadeOutDuration;
            this.characterBust._slideType = 'out';
        }

        update() {
            const s = this.characterBust;
            if (s._slideDuration > 0) {
                const delta = (s._slideTarget - s.x) / s._slideDuration;
                s.x += delta;
                s._slideDuration -= 1;

                if (s._slideType === 'in') {
                    s.opacity = bustOpacity * (1 - s._slideDuration / fadeInDuration);
                } else if (s._slideType === 'out') {
                    s.opacity = bustOpacity * (s._slideDuration / fadeOutDuration);
                }
            } else if (s._slideType === 'out' && s.parent) {
                s.parent.removeChild(s);
                s.opacity = 0;
                this.bustIsVisible = false;
            }

            if (this.nameWindow) {
                this.nameWindow.update();
            }

            if (this.bustIsVisible && !this.batchDialogueMode) {
                const messageWindowClosed = this.isMessageWindowClosed();
                const eventEnded = this.hasEventEnded();

                if (messageWindowClosed && eventEnded && !this.hideScheduled) {
                    this.hideScheduled = true;
                    this.hideBusts();
                }

                if (!messageWindowClosed && this.isStillInActiveEvent()) {
                    this.hideScheduled = false;
                }
            }
        }
    }

    // Scene setup
    const _Scene_Map_start = Scene_Map.prototype.start;
    Scene_Map.prototype.start = function () {
        _Scene_Map_start.call(this);
        this._bustManager = new BustManager();
        this._bustManager.initialize();
    };

    const _Scene_Map_update = Scene_Map.prototype.update;
    Scene_Map.prototype.update = function () {
        _Scene_Map_update.call(this);
        if (this._bustManager) this._bustManager.update();
    };

    // Hook into resolution changes
    const _Graphics_resize = Graphics.resize;
    Graphics.resize = function (width, height) {
        _Graphics_resize.call(this, width, height);

        const scene = SceneManager._scene;
        if (scene && scene._bustManager) {
            scene._bustManager.onResolutionChange();
        }
    };

    // Auto-show on message start
    const _Window_Message_startMessage = Window_Message.prototype.startMessage;
    Window_Message.prototype.startMessage = function () {
        _Window_Message_startMessage.call(this);
        const scene = SceneManager._scene;
        if (scene && scene._bustManager) scene._bustManager.showBusts();
    };

    const _Window_Message_terminateMessage = Window_Message.prototype.terminateMessage;
    Window_Message.prototype.terminateMessage = function () {
        _Window_Message_terminateMessage.call(this);
        const scene = SceneManager._scene;
        if (scene && scene._bustManager && scene._bustManager.shouldAutoHide()) {
            scene._bustManager.hideBusts();
        }
    };

    const _Window_ChoiceList_updatePlacement = Window_ChoiceList.prototype.updatePlacement;
    Window_ChoiceList.prototype.updatePlacement = function () {
        _Window_ChoiceList_updatePlacement.call(this);

        const scene = SceneManager._scene;
        if (scene && scene._bustManager && scene._bustManager.isBustVisible()) {
            // Check if the displayed bust is NOT the default fallback image (busts/7)
            const isDefaultBust = scene._bustManager.currentCharacterKey === null ||
                (scene._bustManager.characterBust.bitmap &&
                    scene._bustManager.characterBust.bitmap._url &&
                    scene._bustManager.characterBust.bitmap._url.includes('busts/7'));

            // Only shift choice window if it's a custom bust (not the default)
            if (!isDefaultBust) {
                // Align choices to the left with resolution-specific offset
                const leftOffset = isWidescreen() ? choiceOffsetLeft_16_9 : choiceOffsetLeft;
                this.x = leftOffset;
            }
        }
    };

    const _Window_ChoiceList_open = Window_ChoiceList.prototype.open;
    Window_ChoiceList.prototype.open = function () {
        _Window_ChoiceList_open.call(this);
        const scene = SceneManager._scene;
        if (scene && scene._bustManager && scene._bustManager.nameWindow) {
            scene._bustManager.nameWindow.hideName();
        }
    };

    const _Window_ChoiceList_close = Window_ChoiceList.prototype.close;
    Window_ChoiceList.prototype.close = function () {
        _Window_ChoiceList_close.call(this);
        const scene = SceneManager._scene;
        if (scene && scene._bustManager && scene._bustManager.isBustVisible() && scene._bustManager.nameIsVisible) {
            scene._bustManager.nameWindow.showName();
        }
    };

    const _Window_ChoiceList_processCancel = Window_ChoiceList.prototype.processCancel;
    Window_ChoiceList.prototype.processCancel = function () {
        _Window_ChoiceList_processCancel.call(this);
        const scene = SceneManager._scene;
        if (scene && scene._bustManager && scene._bustManager.isBustVisible() && scene._bustManager.nameIsVisible) {
            scene._bustManager.nameWindow.showName();
        }
    };

    const _Window_ChoiceList_processOk = Window_ChoiceList.prototype.processOk;
    Window_ChoiceList.prototype.processOk = function () {
        _Window_ChoiceList_processOk.call(this);
        const scene = SceneManager._scene;
        if (scene && scene._bustManager && scene._bustManager.isBustVisible() && scene._bustManager.nameIsVisible) {
            scene._bustManager.nameWindow.showName();
        }
    };
    // Global message window width override: always 816px wide, centered
    const MESSAGE_WINDOW_WIDTH = 800;

    function overrideMessageWindowRect(SceneClass) {
        const _orig = SceneClass.prototype.messageWindowRect;
        if (!_orig) return;
        SceneClass.prototype.messageWindowRect = function () {
            const rect = _orig.call(this);
            rect.width = MESSAGE_WINDOW_WIDTH;
            rect.x = Math.floor((Graphics.boxWidth - MESSAGE_WINDOW_WIDTH) / 2);
            return rect;
        };
    }

    overrideMessageWindowRect(Scene_Map);
    overrideMessageWindowRect(Scene_Battle);
    // Manual commands
    PluginManager.registerCommand(PLUGIN_NAME, "showBust", () => {
        const scene = SceneManager._scene;
        if (scene && scene._bustManager) scene._bustManager.showBusts();
    });

    PluginManager.registerCommand(PLUGIN_NAME, "hideBusts", () => {
        const scene = SceneManager._scene;
        if (scene && scene._bustManager) scene._bustManager.hideBusts();
    });

    PluginManager.registerCommand(PLUGIN_NAME, "batchDialogue", () => {
        const scene = SceneManager._scene;
        if (scene && scene._bustManager) {
            scene._bustManager.enableBatchDialogue();
        }
    });

    PluginManager.registerCommand(PLUGIN_NAME, "playerBatchDialogue", () => {
        const scene = SceneManager._scene;
        if (scene && scene._bustManager) {
            //scene._bustManager.enablePlayerBatchDialogue();
        }
    });

    PluginManager.registerCommand(PLUGIN_NAME, "showCustomBust", (args) => {
        const scene = SceneManager._scene;
        if (scene && scene._bustManager) {
            scene._bustManager.showCustomBust(args.imageName, args.characterName);
        }
    });

})();
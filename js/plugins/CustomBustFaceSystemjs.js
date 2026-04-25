/*:
 * @target MZ
 * @plugindesc Custom Bust Face System v1.2.0 (SPRITES_ASSOCIATION support)
 * @author Omni-Lex
 * @version 1.2.0
 * @description Replaces default face system with custom bust images. Uses SPRITES_ASSOCIATION mapping from DB.js for automatic bust lookup. Supports monster battler images from variables 106-109.
 *
 * @help CustomBustFaceSystem.js
 *
 * This plugin replaces the default RPG Maker face system with a custom
 * bust system that automatically maps character sprites to bust images.
 *
 * AUTOMATIC SPRITE-TO-BUST MAPPING:
 * The system uses SPRITES_ASSOCIATION from DB.js to automatically map character
 * spritesheet names to bust image names. Each bust image should be 64x64 pixels.
 *
 * Bust images are loaded from: /img/faces/{bust_name}.png
 *
 * CUSTOM BUST AND BATTLER IMAGES:
 * For normal characters, bust images can be set via variables:
 * - Variable 109: Actor 1 bust image name (e.g., "7")
 * - Variable 117: Actor 2 bust image name
 * - Variable 118: Actor 3 bust image name
 *
 * For monster characters or custom creatures, battler images can be set via variables:
 * - Variable 106: Actor 1 battler image (e.g., "img/enemies/BattlerName")
 * - Variable 107: Actor 2 battler image
 * - Variable 108: Actor 3 battler image
 *
 * Creature mode switches (when ON, use battler images instead of busts):
 * - Switch 77: Actor 1 is creature
 * - Switch 78: Actor 2 is creature
 * - Switch 79: Actor 3 is creature
 *
 * LOADING PRIORITY FOR EACH ACTOR:
 * 1. Bust name from Variable (109/117/118)
 * 2. If creature switch (77/78/79) is ON: Battler path from Variable (106/107/108)
 * 3. SPRITES_ASSOCIATION bust mapping (from character sprite sheet name)
 * 4. Fallback: default bust "7"
 *
 * No plugin parameters required. Works automatically once DB.js is loaded.
 *
 * License: Free for commercial and non-commercial use.
 */

(() => {
    'use strict';
    
    // Store original methods
    const _Window_Base_drawActorFace = Window_Base.prototype.drawActorFace;
    const _Window_StatusBase_drawActorFace = Window_StatusBase.prototype.drawActorFace;
    const { SPRITES_ASSOCIATION } = window.Sprites;

    // Helper function to get bust image path
    function getBustImagePath(actor) {
        if (!actor._characterName || actor._characterName === '') {
            return null; // Return null instead of fallback path
        }

        const characterName = actor._characterName;
        const spriteIndex = actor._characterIndex || 0;
        const actorId = actor.actorId ? actor.actorId() : 1;

        // Player 1 (Actor 1) special handling
        if (actorId === 1) {
            // Priority 1: Check Variable 109 (Player 1 bust name)
            const player1BustName = $gameVariables.value(109);
            if (player1BustName && player1BustName !== "") {
                return `img/faces/${player1BustName}`;
            }

            // Priority 2: If Switch 77 is ON, use Variable 106 for monster form
            if ($gameSwitches.value(77)) {
                const player1MonsterName = $gameVariables.value(106);
                if (player1MonsterName && player1MonsterName !== "") {
                    return `img/enemies/${player1MonsterName}`;
                }
            }

            // Priority 3: Fall back to SPRITES_ASSOCIATION
            if (characterName && window.Sprites && SPRITES_ASSOCIATION) {
                const spritesheetName = characterName.split('.')[0];

                if (SPRITES_ASSOCIATION[spritesheetName] &&
                    SPRITES_ASSOCIATION[spritesheetName][spriteIndex]) {
                    const bustName = SPRITES_ASSOCIATION[spritesheetName][spriteIndex];
                    return `img/faces/${bustName}`;
                }
            }

            return `img/faces/7`;
        }

        // Player 2 (Actor 2) special handling
        if (actorId === 2) {
            // Priority 1: Check Variable 117 (Player 2 bust name)
            const player2BustName = $gameVariables.value(117);
            if (player2BustName && player2BustName !== "") {
                return `img/faces/${player2BustName}`;
            }

            // Priority 2: If Switch 78 is ON, use Variable 107 for monster form
            if ($gameSwitches.value(78)) {
                const player2MonsterName = $gameVariables.value(107);
                if (player2MonsterName && player2MonsterName !== "") {
                    return `img/enemies/${player2MonsterName}`;
                }
            }

            // Priority 3: Fall back to SPRITES_ASSOCIATION
            if (characterName && window.Sprites && SPRITES_ASSOCIATION) {
                const spritesheetName = characterName.split('.')[0];

                if (SPRITES_ASSOCIATION[spritesheetName] &&
                    SPRITES_ASSOCIATION[spritesheetName][spriteIndex]) {
                    const bustName = SPRITES_ASSOCIATION[spritesheetName][spriteIndex];
                    return `img/faces/${bustName}`;
                }
            }

            return `img/faces/7`;
        }

        // Player 3 (Actor 3) special handling
        if (actorId === 3) {
            // Priority 1: Check Variable 118 (Player 3 bust name)
            const player3BustName = $gameVariables.value(118);
            if (player3BustName && player3BustName !== "") {
                return `img/faces/${player3BustName}`;
            }

            // Priority 2: If Switch 79 is ON, use Variable 108 for monster form
            if ($gameSwitches.value(79)) {
                const player3MonsterName = $gameVariables.value(108);
                if (player3MonsterName && player3MonsterName !== "") {
                    return `img/enemies/${player3MonsterName}`;
                }
            }

            // Priority 3: Fall back to SPRITES_ASSOCIATION
            if (characterName && window.Sprites && SPRITES_ASSOCIATION) {
                const spritesheetName = characterName.split('.')[0];

                if (SPRITES_ASSOCIATION[spritesheetName] &&
                    SPRITES_ASSOCIATION[spritesheetName][spriteIndex]) {
                    const bustName = SPRITES_ASSOCIATION[spritesheetName][spriteIndex];
                    return `img/faces/${bustName}`;
                }
            }

            return `img/faces/7`;
        }

        // Fallback to SPRITES_ASSOCIATION for any other actors
        if (characterName && window.Sprites && SPRITES_ASSOCIATION) {
            const spritesheetName = characterName.split('.')[0];

            if (SPRITES_ASSOCIATION[spritesheetName] &&
                SPRITES_ASSOCIATION[spritesheetName][spriteIndex]) {
                const bustName = SPRITES_ASSOCIATION[spritesheetName][spriteIndex];
                return `img/faces/${bustName}`;
            }
        }

        // Fallback to default bust path structure
        return `img/faces/7`;
    }
    
    // Helper function to create a blank bitmap
    function createBlankBitmap(width, height) {
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const bitmap = new Bitmap(width, height);
        bitmap._canvas = canvas;
        bitmap._context = canvas.getContext('2d');
        return bitmap;
    }
    
    // Helper function to load and draw bust image with blank fallback
    function drawBustImage(bitmap, actor, x, y, width, height) {
        const bustPath = getBustImagePath(actor);

        // Always clear the area first
        bitmap.clearRect(x, y, width, height);

        // If no valid path, use fallback directly without listeners
        if (!bustPath) {
            const fallbackBitmap = ImageManager.loadBitmap('img/faces/', '7');
            drawBustToCanvas(bitmap, fallbackBitmap, x, y, width, height, true);
            return true;
        }

        // Determine if this is an enemy image (don't crop) or bust image (crop)
        const shouldCrop = false;

        // Load the main bust image
        const bustBitmap = ImageManager.loadBitmap('', bustPath);

        bustBitmap.addLoadListener(() => {
            // Check if the bitmap actually loaded successfully
            if (bustBitmap.width > 0 && bustBitmap.height > 0) {
                drawBustToCanvas(bitmap, bustBitmap, x, y, width, height, shouldCrop);
            } else {
                // Image failed to load, use fallback directly without listeners
                console.log('CustomBustFaceSystem: Bust image not found, using fallback:', bustPath);
                const fallbackBitmap = ImageManager.loadBitmap('img/faces/', '7');
                drawBustToCanvas(bitmap, fallbackBitmap, x, y, width, height, true);
            }
        });

        return true;
    }
    
    // Helper function to draw bust image to canvas
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
            let croppedSourceWidth = sourceWidth;
            let croppedSourceHeight = sourceHeight;

            // Crop top 180 pixels only for bust images, not for enemy/monster images
            if (shouldCrop) {
                cropTop = 180;
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
            bitmap.blt(sourceBitmap, 0, cropTop, croppedSourceWidth, croppedSourceHeight, drawX, drawY, drawWidth, drawHeight);

            // Restore original smoothing setting
            context.imageSmoothingEnabled = oldSmoothing;
        } catch (error) {
            console.log('CustomBustFaceSystem: Error drawing bust to canvas, leaving blank');
            // Don't throw error, just log it
        }
    }
    
    // Override Window_Base drawActorFace method
    Window_Base.prototype.drawActorFace = function(actor, x, y, width, height) {
        width = width || ImageManager.faceWidth;
        height = height || ImageManager.faceHeight;

        // Use our bust system with blank fallback
        drawBustImage(this.contents, actor, x, y, width, height);
    };

    // Override Window_StatusBase drawActorFace method (for status screens)
    Window_StatusBase.prototype.drawActorFace = function(actor, x, y, width, height) {
        width = width || ImageManager.faceWidth;
        height = height || ImageManager.faceHeight;

        // Use our bust system with blank fallback
        drawBustImage(this.contents, actor, x, y, width, height);
    };
    
    // Override ImageManager.loadFace to prevent loading default faces when using busts
    const _ImageManager_loadFace = ImageManager.loadFace;
    ImageManager.loadFace = function(filename) {
        // Check if we're trying to load a face for an actor that should use busts
        // This is a bit tricky since we don't have direct actor context here
        // We'll let the original method handle it and rely on our drawActorFace overrides
        return _ImageManager_loadFace.call(this, filename);
    };
    
    // Helper method to preload bust images (optional, for performance)
    function preloadBustImages() {
        try {
            // Preload from SPRITES_ASSOCIATION if available
            if (window.Sprites && SPRITES_ASSOCIATION) {
                Object.keys(SPRITES_ASSOCIATION).forEach(spritesheetName => {
                    try {
                        const bustIndices = SPRITES_ASSOCIATION[spritesheetName];
                        Object.keys(bustIndices).forEach(index => {
                            const bustName = bustIndices[index];
                            const path = `img/faces/${bustName}`;
                            // Silently attempt to preload, don't log errors
                            const bitmap = ImageManager.loadBitmap('', path);
                            bitmap.addErrorListener(() => {
                                // Silently handle preload errors
                            });
                        });
                    } catch (error) {
                        // Silently handle preload errors for individual sprite sheets
                    }
                });
            }

            // Also preload fallback bust if available
            try {
                const fallbackBitmap = ImageManager.loadBitmap('img/faces/', '7');
                fallbackBitmap.addErrorListener(() => {
                    // Silently handle fallback preload errors
                });
            } catch (error) {
                // Silently handle fallback preload errors
            }
        } catch (error) {
            console.log('CustomBustFaceSystem: Error in preloadBustImages, continuing anyway');
        }
    }
    
    // Preload bust images when the game starts
    const _Scene_Boot_start = Scene_Boot.prototype.start;
    Scene_Boot.prototype.start = function() {
        _Scene_Boot_start.call(this);
        preloadBustImages();
    };
    

    

    // Handle character graphic changes
    const _Game_Actor_setCharacterImage = Game_Actor.prototype.setCharacterImage;
    Game_Actor.prototype.setCharacterImage = function(characterName, characterIndex) {
        _Game_Actor_setCharacterImage.call(this, characterName, characterIndex);
        
        // Update our stored values
        this._characterName = characterName;
        this._characterIndex = characterIndex;
    };
    
})();
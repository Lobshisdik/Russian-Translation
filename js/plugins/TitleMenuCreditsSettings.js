/*:
 * @target MZ
 * @plugindesc Enhanced Credits System with Formatted Text Parsing
 * @author Omni-Lex
 * @version 2.0
 *
 * @param Credits Speed
 * @desc Speed at which credits scroll (1-10, higher is faster)
 * @type number
 * @min 1
 * @max 10
 * @default 3
 * 
 * @param Background Image
 * @desc Background image for the credits screen (leave blank for default)
 * @type file
 * @dir img/titles1/
 * @default
 * 
 * @help 
 * ===========================================================================
 * Enhanced Credits System Plugin
 * ===========================================================================
 * 
 * This plugin adds a Credits option to the RPG Maker MZ title screen menu
 * with automatic parsing of formatted credit data.
 * 
 * Features:
 * - Automatic parsing of formatted credits text
 * - Section headers with decorative formatting
 * - Bold text support for emphasized content
 * - URL cleaning (removes https://)
 * - Scrolling credits with adjustable speed
 * - Optional background image
 * 
 * Format Rules:
 * - ## starts a section header
 * - **text** makes text bold
 * - URLs are automatically cleaned of https://
 * - Links are displayed as plain text (not clickable)
 * 
 * ===========================================================================
 */

(() => {
    'use strict';
    
    const pluginName = "TitleMenuCreditsSettings";
    
    //=============================================================================
    // Plugin Parameters
    //=============================================================================
    
    const parameters = PluginManager.parameters(pluginName);
    const creditsSpeed = Number(parameters['Credits Speed'] || 3);
    const backgroundImage = parameters['Background Image'] || "";
    
    // Hardcoded credits data (formatted text)
    const CREDITS_DATA = `

---

## 🎨 Sprites and Characters

* **Horror Monster Battler Sprite Pack** by invalid-user621; 
[https://invalid-user621.itch.io/horror-monster-battler-sprite-pack]
* **Watercolour Monster Pack** by metalsnail; 
[https://metalsnail.itch.io/watercolour-monster-pack]
* **The Mighty Pack** by themightypalm; 
[https://themightypalm.itch.io/the-mighty-pack]
* **95% Off Ultimate Portrait Pack**; 
[https://itch.io/s/121612/95-off-ultimate-portrait-pack]

---

## 🗺️ Tilesets

* **Damp Dungeons** by arex‑v; 
[https://arex-v.itch.io/damp-dungeons]
* **Modern Exteriors** by limezu; 
[https://limezu.itch.io/modernexteriors]
* **Chronicle Tileset Pack** by wardwellgames; 
[https://wardwellgames.itch.io/chronicle-tileset-pack]
* **Ashlands Tileset** by finalbossblues; 
[https://finalbossblues.itch.io/ashlands-tileset]
* **TF Jungle Tileset** by finalbossblues; 
[https://finalbossblues.itch.io/tf-jungle-tileset]
* **Atlantis Tileset** by finalbossblues; 
[https://finalbossblues.itch.io/atlantis-tileset]
* **Dark Dimension Tileset** by finalbossblues; 
[https://finalbossblues.itch.io/dark-dimension-tileset]
* **TF Beach Tileset** by finalbossblues; 
[https://finalbossblues.itch.io/tf-beach-tileset]
* **Fantasy** by arex‑v; 
[https://arex-v.itch.io/fantasy]
* **Occult Steampunk** by arex‑v; 
[https://arex-v.itch.io/occult-steampunk]

---

## 🔌 Plugin & Script

* **Smooth Battle Log 2.0 **; 
[https://forums.rpgmakerweb.com/index.php?threads/smooth-battle-log-2-0-mz.131465/]
* **Event Spawner** by cocomode; 
[https://cocomode.itch.io/event-spawner]
* **Enemy Levels Plugin for RPG Maker MZ** by cocomode; 
[https://cocomode.itch.io/enemy-levels-plugin-for-rpg-maker-mz]
* **Customized Dynamically Generated Chest Loot** by cocomode; 
[https://cocomode.itch.io/customized-dynamically-generated-chest-loot-for-rpg-maker-mz]
* **Revealed Area Map for RPG Maker MZ** by cocomode; 
[https://cocomode.itch.io/revealed-area-map-for-rpg-maker-mz]
* **TurnInPlace.js** by mjshi; 
[https://github.com/mjshi/RPGMakerRepo/blob/master/TurnInPlace.js]
* **OZZ\_DebugPasability.js** by orochii; 
[https://github.com/orochii/RMXPVXA-Scripts/blob/master/MZ/OZZ\_DebugPasability.js]
* **SLIM’s This and That’s **; 
[https://forums.rpgmakerweb.com/index.php?threads/slims-this-and-thats-mz-edition.125627/]
* **CandaCi’s Resources for MZ**; 
[https://forums.rpgmakerweb.com/index.php?threads/candacis-resources-for-mz.126137/]
* **Avery’s Experimental XP→MZ Conversions**; 
[https://forums.rpgmakerweb.com/index.php?threads/averys-experimental-xp-to-mz-conversions-default-and-original.153808/]

---

## 🖥️ UI and animations

* **Pixel UI & SFX Pack** by jdsherbert; 
[https://jdsherbert.itch.io/pixel-ui-sfx-pack]
* **Effekseer Animation MZ** by nowis‑337; 
[https://nowis-337.itch.io/effekseer-animation-mz]


---

## 📜 Maps

* **Europa MZ Free Semi‑Detailed Map of Europe**; 
[https://forums.rpgmakerweb.com/index.php?threads/europa-mz-free-semi-detailed-map-of-europe.125607/]
* **The Metropolitan Museum of Art – Collection Search **; 
[https://www.metmuseum.org/art/collection/search?page=3\&searchField=AccessionNum]

---

## 🎶 Music

* **Creepy Forest F** ; 
[https://opengameart.org/content/creepy-forest-f]
* **Cave Theme** ; * **Three Red Hearts; 
Prepare to Dev** by tallbeard; 
[https://tallbeard.itch.io/three-red-hearts-prepare-to-dev]
[https://opengameart.org/content/cave-theme]
* **Swamp Environment Audio** ; 
[https://opengameart.org/content/swamp-environment-audio]
* **Ambient Noise** ; 
[https://opengameart.org/content/ambient-noise]
* **Ambient Mountain, River, Wind & Waterfall** ; 
[https://opengameart.org/content/ambient-mountain-river-wind-and-forest-and-waterfall]
* **Music Loop Bundle** by tallbeard; 
[https://tallbeard.itch.io/music-loop-bundle]
* **Music Loops** by comigo; 
[https://comigo.itch.io/music-loops]
* **Techno Trance Melodic Techno 03 ** by moogify; 
[https://pixabay.com/music/techno-trance-melodic-techno-03-extended-version-moogify-9867/]
* **Techno Trance Dark Dub Techno – Somewhere We Got Lost**; 
[https://pixabay.com/music/techno-trance-dark-dub-techno-somewhere-we-got-lost-no-copyright-music-144827/]
* **Medieval; 
Exploration **:

  * [https://www.youtube.com/watch?v=XZO331MAAi0]
  * [https://www.youtube.com/watch?v=wGqJseFSWbA]

---

## 🔊 Sound fx

* **Underwater** by freesound\_community; 
[https://pixabay.com/sound-effects/underwater-6236/]
* **SFX ** by freesound\_community; 
[https://pixabay.com/?utm\_source=link-attribution\&utm\_medium=referral\&utm\_campaign=music\&utm\_content=14814]
* **SFX ** by David Dumais; 
[https://pixabay.com/?utm\_source=link-attribution\&utm\_medium=referral\&utm\_campaign=music\&utm\_content=185435]
* **SFX ** by David Dumais; 
[https://pixabay.com/sound-effects/?utm\_source=link-attribution\&utm\_medium=referral\&utm\_campaign=music\&utm\_content=185432]
* **SFX ** by u\_xjrmmgxfru; 
[https://pixabay.com/sound-effects/?utm\_source=link-attribution\&utm\_medium=referral\&utm\_campaign=music\&utm\_content=266299]
* **Tyler J Warren SFX**; 
[https://tylerjwarren.itch.io/]
RPG Maker MV UPP Windowskin Pack by theunpropro
https://theunpropro.itch.io/rpg-maker-mv-upp-windowskin-packpg

SFX  by freesound_community 
https://pixabay.com/?utm_source=link-attribution&utm_medium=referral&utm_campaign=music&utm_content=45475
---

`;
    
    //=============================================================================
    // Credits Parser
    //=============================================================================
    
    class CreditsParser {
        static parse(text) {
            const lines = text.split('\n');
            const parsedData = [];
            
            for (let line of lines) {
                line = line.trim();
                
                // Skip empty lines and dividers
                if (!line || line === '---') continue;
                
                // Section headers (## text)
                if (line.startsWith('##')) {
                    const headerText = line.replace('##', '').trim();
                    parsedData.push({
                        type: 'header',
                        text: headerText
                    });
                }
                // List items (* text)
                else if (line.startsWith('*')) {
                    const itemText = line.replace('*', '').trim();
                    
                    // Split by semicolon to separate resource name from author
                    const parts = itemText.split(';').map(p => p.trim()).filter(p => p);
                    
                    for (let i = 0; i < parts.length; i++) {
                        const part = parts[i];
                        const processedText = this.processTextFormatting(part);
                        
                        parsedData.push({
                            type: i === 0 ? 'item' : 'author', // First part is item, rest is author info
                            text: processedText.text,
                            formatting: processedText.formatting
                        });
                    }
                }
                // URLs in brackets
                else if (line.startsWith('[') && line.endsWith(']')) {
                    const url = line.slice(1, -1);
                    const cleanUrl = url.replace('https://', '').replace('http://', '');
                    parsedData.push({
                        type: 'url',
                        text: cleanUrl
                    });
                }
            }
            
            return parsedData;
        }
        
        static processTextFormatting(text) {
            const formatting = [];
            let processedText = text;
            
            // Find bold text (**text**)
            const boldRegex = /\*\*(.*?)\*\*/g;
            let match;
            let offset = 0;
            
            while ((match = boldRegex.exec(text)) !== null) {
                const start = match.index - offset;
                const length = match[1].length;
                
                formatting.push({
                    start: start,
                    length: length,
                    type: 'bold'
                });
                
                // Remove the ** markers
                processedText = processedText.replace(match[0], match[1]);
                offset += 4; // Length of "**" * 2
            }
            
            return {
                text: processedText,
                formatting: formatting
            };
        }
    }
    
    //=============================================================================
    // Scene_Title Modifications
    //=============================================================================
    
    const _Scene_Title_createCommandWindow = Scene_Title.prototype.createCommandWindow;
    Scene_Title.prototype.createCommandWindow = function() {
        _Scene_Title_createCommandWindow.call(this);
        this._commandWindow.setHandler("credits", this.commandCredits.bind(this));
        this._commandWindow.setHandler("exitGame", this.commandExitGame.bind(this));
    };
    
    Scene_Title.prototype.commandCredits = function() {
        SceneManager.push(Scene_Credits);
    };
    
    Scene_Title.prototype.commandExitGame = function() {
        SceneManager.exit();
    };
    
    //=============================================================================
    // Window_TitleCommand Modifications
    //=============================================================================
    
    const _Window_TitleCommand_makeCommandList = Window_TitleCommand.prototype.makeCommandList;
    Window_TitleCommand.prototype.makeCommandList = function() {
        _Window_TitleCommand_makeCommandList.call(this);
        this.addCommand("Credits", "credits");
        this.addCommand("Exit", "exitGame");
    };
    
    //=============================================================================
    // Scene_Credits
    //=============================================================================
    
    function Scene_Credits() {
        this.initialize(...arguments);
    }
    
    Scene_Credits.prototype = Object.create(Scene_Base.prototype);
    Scene_Credits.prototype.constructor = Scene_Credits;
    
    Scene_Credits.prototype.initialize = function() {
        Scene_Base.prototype.initialize.call(this);
        this._scrollY = 0;
        this._scrollSpeed = creditsSpeed;
        this._isDone = false;
    };
    
    Scene_Credits.prototype.create = function() {
        Scene_Base.prototype.create.call(this);
        this.createBackground();
        this.createCreditsWindow();
    };
    
    Scene_Credits.prototype.createBackground = function() {
        this._backgroundSprite = new Sprite();
        if (backgroundImage) {
            this._backgroundSprite.bitmap = ImageManager.loadTitle1(backgroundImage);
        } else {
            this._backgroundSprite.bitmap = SceneManager.backgroundBitmap();
        }
        this.addChild(this._backgroundSprite);
    };
    
    Scene_Credits.prototype.createCreditsWindow = function() {
        this._creditsWindow = new Window_Credits();
        this.addChild(this._creditsWindow);
    };
    
    Scene_Credits.prototype.update = function() {
        Scene_Base.prototype.update.call(this);
        
        if (this._isDone) {
            this.popScene();
            return;
        }
        
        if (Input.isTriggered("cancel")) {
            this._isDone = true;
            SoundManager.playCancel();
            return;
        }
        
        // Update scrolling
        this._scrollY += this._scrollSpeed;
        this._creditsWindow.setScrollY(this._scrollY);
        
        // Check if credits have scrolled completely
        if (this._scrollY >= this._creditsWindow.maxScrollY()) {
            this._isDone = true;
        }
    };
    
    //=============================================================================
    // Window_Credits
    //=============================================================================
    
    function Window_Credits() {
        this.initialize(...arguments);
    }
    
    Window_Credits.prototype = Object.create(Window_Base.prototype);
    Window_Credits.prototype.constructor = Window_Credits;
    
    Window_Credits.prototype.initialize = function() {
        const width = Graphics.boxWidth;
        const height = Graphics.boxHeight;
        Window_Base.prototype.initialize.call(this, new Rectangle(0, 0, width, height));
        this.opacity = 255;
        this._parsedCredits = CreditsParser.parse(CREDITS_DATA);
        
        // Calculate required content height first
        this._totalHeight = this.calculateContentHeight();
        
        // Create contents with proper height
        this.createContents();
        this.refresh();
    };
    
    Window_Credits.prototype.refresh = function() {
        this.contents.clear();
        
        const lineHeight = this.lineHeight();
        let y = lineHeight * 2;
        
        // Draw main title
        this.contents.fontSize += 12;
        this.drawText("Game Credits", 0, y, this.contents.width, "center");
        this.contents.fontSize -= 12;
        y += lineHeight * 3;
        
        // Process and draw parsed credits
        for (const entry of this._parsedCredits) {
            switch (entry.type) {
                case 'header':
                    y += lineHeight;
                    this.contents.fontSize += 6;
                    this.changeTextColor(ColorManager.textColor(14)); // Yellow
                    this.drawText(entry.text, 0, y, this.contents.width, "center");
                    this.resetTextColor();
                    this.contents.fontSize -= 6;
                    y += lineHeight * 2;
                    break;
                    
                case 'item':
                    this.drawFormattedText(entry.text, entry.formatting, 40, y, this.contents.width - 80);
                    y += lineHeight * 1.2;
                    break;
                    
                case 'author':
                    this.changeTextColor(ColorManager.textColor(8)); // Gray for author
                    this.drawTextEx("  " + entry.text, 60, y);
                    this.resetTextColor();
                    y += lineHeight * 1.5;
                    break;
                    
                case 'url':
                    this.changeTextColor(ColorManager.textColor(23)); // Light blue
                    this.drawTextEx(entry.text, 60, y);
                    this.resetTextColor();
                    y += lineHeight * 2; // More space after URLs to separate entries
                    break;
            }
        }
        
        // Add some space at the end
        y += lineHeight * 4;
        
        // Store total content height (should match calculated height)
        this._actualHeight = y;
    };
    
    Window_Credits.prototype.drawFormattedText = function(text, formatting, x, y, width) {
        // Check if text has bold formatting
        const hasBold = formatting && formatting.some(f => f.type === 'bold');
        
        if (hasBold) {
            // Extract bold parts and draw them specially
            let processedText = text;
            
            // Simple approach: if it contains bold formatting, make the whole resource name bold
            this.contents.fontSize += 2;
            this.changeTextColor(ColorManager.textColor(17)); // Light green
            this.drawTextEx(processedText, x, y);
            this.resetTextColor();
            this.contents.fontSize -= 2;
        } else {
            // Draw normal text
            this.drawTextEx(text, x, y);
        }
    };
    
    Window_Credits.prototype.setScrollY = function(y) {
        this.origin.y = y;
    };
    
    Window_Credits.prototype.maxScrollY = function() {
        return Math.max(0, this._totalHeight - this.height + this.padding * 4);
    };
    Window_Credits.prototype.calculateContentHeight = function() {
        const lineHeight = this.lineHeight();
        let height = lineHeight * 5; // Initial spacing for title
        
        // Calculate height needed for all content
        for (const entry of this._parsedCredits) {
            switch (entry.type) {
                case 'header':
                    height += lineHeight * 3; // Space before + header + space after
                    break;
                case 'item':
                    height += lineHeight * 1.2;
                    break;
                case 'author':
                    height += lineHeight * 1.5;
                    break;
                case 'url':
                    height += lineHeight * 2;
                    break;
            }
        }
        
        height += lineHeight * 4; // Final spacing
        return height;
    };
    
    Window_Credits.prototype.createContents = function() {
        // Create contents bitmap with calculated height
        const width = this.contentsWidth();
        const height = Math.max(this._totalHeight, this.contentsHeight());
        this.contents = new Bitmap(width, height);
        this.contentsBack = new Bitmap(width, height);
        this.resetFontSettings();
    };
})();
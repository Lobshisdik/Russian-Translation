//=============================================================================
// MPP_SmoothBattleLog2_VerticalScaleAnimation.js
//=============================================================================
// Copyright (c) 2018 Mokusei Penguin
// Modified to include color-coded names and vertical scale animation
// Released under the MIT license
// http://opensource.org/licenses/mit-license.php
//=============================================================================

/*:
 * @target MZ
 * @plugindesc Change the display method and behavior of the battle log with name highlighting and vertical scale animation.
 * @author Mokusei Penguin (Modified)
 * @url
 *
 * @help [version 2.2]
 * This plugin is for RPG Maker MZ.
 * 
 * ▼ Overview
 *  - By making the battle log display method cumulative, sentences will not
 *    disappear immediately even if the log progresses quickly.
 *  - You can check the battle past log from the party command.
 *  - Character names are color-coded: All actors are blue and enemies are red.
 *  - Magic, ability, and item names appear in white.
 *  - Battle log has a vertical scale animation from the middle when appearing and disappearing.
 *  - Battle log starts hidden at the beginning of battle.
 * 
 * ▼ Log Type
 *  〇 all
 *   - The battle log window disappears after a certain amount of time has
 *     passed since the last log was displayed.
 *  〇 1-line
 *   - The logs are deleted in order from the log that has passed a certain
 *     period of time since it was displayed.
 *
 * @param Log Type
 * @desc 
 * @type select
 * @option all
 * @option 1-line
 * @default 1-line
 * 
 * @param Max Lines
 * @desc Maximum number of lines displayed in the battle log
 * @type number
 * @min 1
 * @default 4
 * 
 * @param Message Speed
 * @desc Battle log display speed
 * @type number
 * @default 8
 * 
 * @param View Duration
 * @desc Battle log display time
 * (0:Always displayed)
 * @type number
 * @default 150
 * 
 * @param Font Size
 * @desc The size of the characters in the battle log
 * @type number
 * @min 6
 * @default 26
 * 
 * @param Wait New Line?
 * @desc Whether or not there is a weight when a new log is added.
 * If it behaves strangely, enable it.
 * @type boolean
 * @default false
 * 
 * @param Start Messages On Log?
 * @desc Whether to display the battle start message in the log
 * @type boolean
 * @default false
 * 
 * @param Log Command
 * @desc Command name to display battle past log
 * (Hide when empty)
 * @default Battle Log
 * 
 * @param Animation Speed
 * @desc Speed of the vertical scale animation (higher = faster)
 * @type number
 * @min 1
 * @default 5
 *
 * @param Battle Log BG Opacity
 * @desc Opacity of the battle log background (0-100%)
 * @type number
 * @min 0
 * @max 100
 * @default 25
 *
 */

(() => {
    'use strict';
    
    // Plugin Parameters
    const pluginName = 'MPP_SmoothBattleLog2_FadeEnhancements';
    const params = PluginManager.parameters(pluginName);
    
    const CONFIG = {
        logType: params['Log Type'] || '1-line',
        maxLines: 6,
        messageSpeed: Number(params['Message Speed'] || 8),
        fontSize: Number(params['Font Size'] || 26),
        viewDuration: Number(params['View Duration'] || 150),
        waitNewLine: params['Wait New Line?'] === 'true',
        startMessagesOnLog: params['Start Messages On Log?'] === 'true',
        logCommand: params['Log Command'] || '',
        animationSpeed: Number(params['Animation Speed'] || 8),
        battleLogBgOpacity: Number(params['Battle Log BG Opacity'] || 25),
        colors: {
            actor: 1,   // Blue for Actor 1
            actor2: 4,  // Purple for Actor 2
            actor3: 5,  // Purple for Actor 3
            enemy: 2,   // Green (Color 2) for enemies
            item: 0     // White for ability/magic/item names
        }
    };
    
    // Helper Functions
    const __base = (obj, prop) => {
        if (obj.hasOwnProperty(prop)) {
            return obj[prop];
        } else {
            const proto = Object.getPrototypeOf(obj);
            return function() { return proto[prop].apply(this, arguments); };
        }
    };
    function _getStarIndex(subject) {
        if (subject.isActor && subject.isActor()) {
          // Map actor IDs to variable IDs
          const map = { 1: 38, 2: 39, 3: 40 };
          const varId = map[subject.actorId()] || null;
          const val = varId ? $gameVariables.value(varId) : 0;
          console.log("## ",subject.actorId(),val)
          return val;
        }
        /*
        if (subject._gender !== undefined) {
          return subject._gender;
        }*/
        return 0; // fallback
      }
      function _replaceStars(text, subject) {
        const idx = _getStarIndex(subject);
        const table = { 0: 'o', 1: 'a', 2: '*' };
        const ch = table[idx] || 'o';
        return text.replace(/\*/g, ch);
      }
      
      
    // Optimize: Precompute triangular numbers for common values
    const TRI_CACHE_SIZE = 50;
    const triCache = Array(TRI_CACHE_SIZE).fill(0).map((_, i) => i * (i + 1) / 2);
    const formulaTri = n => {
        return n < TRI_CACHE_SIZE ? triCache[n] : n * (n + 1) / 2;
    };

    //-------------------------------------------------------------------------
    // ConfigManager - Battle Log BG Opacity Setting
    //-------------------------------------------------------------------------

    Object.defineProperty(ConfigManager, 'battleLogBgOpacity', {
        get: function() {
            return this._battleLogBgOpacity !== undefined ? this._battleLogBgOpacity : CONFIG.battleLogBgOpacity;
        },
        set: function(value) {
            this._battleLogBgOpacity = value;
        },
        configurable: true
    });

    const _ConfigManager_makeData = ConfigManager.makeData;
    ConfigManager.makeData = function() {
        const config = _ConfigManager_makeData.call(this);
        config.battleLogBgOpacity = this.battleLogBgOpacity;
        return config;
    };

    const _ConfigManager_applyData = ConfigManager.applyData;
    ConfigManager.applyData = function(config) {
        _ConfigManager_applyData.call(this, config);
        this.battleLogBgOpacity = config.battleLogBgOpacity !== undefined ? config.battleLogBgOpacity : CONFIG.battleLogBgOpacity;
    };

    //-------------------------------------------------------------------------
    // Window_Options - Add Battle Log BG Opacity Option
    //-------------------------------------------------------------------------

    const _Window_Options_addGeneralOptions = Window_Options.prototype.addGeneralOptions;
    Window_Options.prototype.addGeneralOptions = function() {
        _Window_Options_addGeneralOptions.call(this);
        this.addCommand("Battle Log BG Opacity", "battleLogBgOpacity");
    };

    const _Window_Options_statusText = Window_Options.prototype.statusText;
    Window_Options.prototype.statusText = function(index) {
        const symbol = this.commandSymbol(index);
        if (symbol === "battleLogBgOpacity") {
            return this.getConfigValue(symbol) + "%";
        }
        return _Window_Options_statusText.call(this, index);
    };

    const _Window_Options_processOk = Window_Options.prototype.processOk;
    Window_Options.prototype.processOk = function() {
        const index = this.index();
        const symbol = this.commandSymbol(index);
        if (symbol === "battleLogBgOpacity") {
            const value = this.getConfigValue(symbol);
            this.changeValue(symbol, (value + 10) % 110);
            return;
        }
        _Window_Options_processOk.call(this);
    };

    const _Window_Options_cursorRight = Window_Options.prototype.cursorRight;
    Window_Options.prototype.cursorRight = function() {
        const index = this.index();
        const symbol = this.commandSymbol(index);
        if (symbol === "battleLogBgOpacity") {
            const value = this.getConfigValue(symbol);
            this.changeValue(symbol, Math.min(value + 10, 100));
            return;
        }
        _Window_Options_cursorRight.call(this);
    };

    const _Window_Options_cursorLeft = Window_Options.prototype.cursorLeft;
    Window_Options.prototype.cursorLeft = function() {
        const index = this.index();
        const symbol = this.commandSymbol(index);
        if (symbol === "battleLogBgOpacity") {
            const value = this.getConfigValue(symbol);
            this.changeValue(symbol, Math.max(value - 10, 0));
            return;
        }
        _Window_Options_cursorLeft.call(this);
    };

    //-------------------------------------------------------------------------
    // Game_Temp - Battle Log History Storage
    //-------------------------------------------------------------------------
    
    const _Game_Temp_initialize = Game_Temp.prototype.initialize;
    Game_Temp.prototype.initialize = function() {
        _Game_Temp_initialize.apply(this, arguments);
        this._battleLog = [];
    };

    Game_Temp.prototype.clearBattleLog = function() {
        this._battleLog = [];
    };

    Game_Temp.prototype.battleLog = function() {
        return this._battleLog;
    };

    Game_Temp.prototype.addBattleLog = function(text) {
        this._battleLog.push(text);
        if (this._battleLog.length > 100) this._battleLog.shift();
    };

    //-------------------------------------------------------------------------
    // Name Cache Systems - Optimize color-coding
    //-------------------------------------------------------------------------
    
    // Cache for colored names - avoids repeated string replacements
    const NameColorCache = new class {
        constructor() {
            this.initialize();
        }
        
        initialize() {
            this._actorCache = new Map();
            this._enemyCache = new Map();
            this._abilityCache = new Map();
            this._initialized = false;
        }
        
        buildCache() {
            if (this._initialized) return;
            
            // Cache actor names
            const actors = $gameParty.battleMembers();
            actors.forEach(actor => {
                if (!actor || !actor.name()) return;
                
                const name = actor.name();
                // Special case for Actor2
                if (actor.actorId() === 2) {
                    this._actorCache.set(name, `\\c[${CONFIG.colors.actor2}]${name}\\c[0]`);
                } 
                if (actor.actorId() === 3) {
                    this._actorCache.set(name, `\\c[${CONFIG.colors.actor3}]${name}\\c[0]`);
                } 
                else {
                    this._actorCache.set(name, `\\c[${CONFIG.colors.actor}]${name}\\c[0]`);
                }
            });
            
            // Skip enemy name caching - all enemies will be displayed as "Enemy"
            
            // Cache skill and item names
            const skills = $dataSkills.filter(skill => skill && skill.name);
            const items = $dataItems.filter(item => item && item.name);
            
            [...skills, ...items].forEach(item => {
                if (!item || !item.name || item.name.length <= 1) return;
                const name = item.name;
                this._abilityCache.set(name, `\\c[${CONFIG.colors.item}]${name}\\c[0]`);
            });
            
            this._initialized = true;
        }
        
        // Get the colored version of a name, or null if not found
        getColoredName(name) {
            if (this._actorCache.has(name)) return this._actorCache.get(name);
            if (this._enemyCache.has(name)) return this._enemyCache.get(name);
            if (this._abilityCache.has(name)) return this._abilityCache.get(name);
            return null;
        }
        
        // Get colored name for a specific entity
        getActorName(actor) {
            if (!actor) return '';
            
            const name = actor.name();
            if (actor.actorId() === 2) {
                return this._actorCache.get(name) || 
                    `\\c[${CONFIG.colors.actor2}]${name}\\c[0]`;
            } 
            if (actor.actorId() === 3) {
                return this._actorCache.get(name) || 
                    `\\c[${CONFIG.colors.actor3}]${name}\\c[0]`;
            } 
            else {
                return this._actorCache.get(name) || 
                    `\\c[${CONFIG.colors.actor}]${name}\\c[0]`;
            }
        }
        
        getEnemyName(enemy) {
            if (!enemy) return '';
            const name = enemy.name();
            // If enemy name has multiple words, show only the first word
            const firstName = name.split(' ')[1];
            return `\\c[${CONFIG.colors.enemy}]${firstName}\\c[0]`;
        }
        
        getItemName(item) {
            if (!item) return '';
            const name = item.name;
            return this._abilityCache.get(name) || 
                `\\c[${CONFIG.colors.item}]${name}\\c[0]`;
        }
        
        refresh() {
            this.initialize();
        }
    }();

    //-------------------------------------------------------------------------
    // BattleManager - Handle Start Messages
    //-------------------------------------------------------------------------
    const _Game_Enemy_setup = Game_Enemy.prototype.setup;
    Game_Enemy.prototype.setup = function(enemyId, x, y) {
    _Game_Enemy_setup.call(this, enemyId, x, y);
    // 0 = male (o), 1 = female (a)
    //this._gender = this._gender !== undefined ? this._gender : (Math.random() < 0.5 ? 0 : 1);
    };
    const _BattleManager_displayStartMessages = BattleManager.displayStartMessages;
    BattleManager.displayStartMessages = function() {
        if (!CONFIG.startMessagesOnLog) {
            _BattleManager_displayStartMessages.apply(this, arguments);
        }
    };

    BattleManager.displayStartMessagesOnLog = function() {
        // Initialize the name cache
        NameColorCache.buildCache();
        
        // Display enemy emergence with colored names
        for (const name of $gameTroop.enemyNames()) {
            const coloredName = NameColorCache.getColoredName(name) || 
                `\\c[${CONFIG.colors.enemy}]${name}\\c[0]`;
            this._logWindow.push('addText', TextManager.emerge.format(coloredName));
        }
        
        // Display initiative message if applicable
        const message = this.initiativeMessage();
        if (message) {
            this._logWindow.push('wait');
            this._logWindow.push('addText', message);
        }
        this._logWindow.push('clear');
    };

    BattleManager.initiativeMessage = function() {
        if (this._preemptive) {
            return TextManager.preemptive.format($gameParty.name());
        } else if (this._surprise) {
            return TextManager.surprise.format($gameParty.name());
        }
        return null;
    };

    const _BattleManager_endBattle = BattleManager.endBattle;
    BattleManager.endBattle = function(result) {
        _BattleManager_endBattle.apply(this, arguments);
        this._logWindow.clearSmoothBattleLog();
        // Clear name cache when battle ends
        NameColorCache.refresh();
    };

    //-------------------------------------------------------------------------
    // Window_Base - Process Escape Characters
    //-------------------------------------------------------------------------
    
    const _Window_Base_processEscapeCharacter = Window_Base.prototype.processEscapeCharacter;
    Window_Base.prototype.processEscapeCharacter = function(code, textState) {
        if (code === 'MX') {
            textState.x += this.obtainEscapeParam(textState);
        } else if (code === 'CHAR') {
            // Handle character image escape code
            const filename = this.obtainEscapeParam(textState);
            if (filename) {
                try {
                    const charImage = ImageManager.loadBitmap('img/characters/Monsters/', filename);
                    this.contents.blt(
                        charImage,
                        0, 0,                    // src x,y
                        48, 48,                  // src w,h (48x48 crop)
                        textState.x, textState.y, // dest x,y
                        48, 48                   // dest w,h
                    );
                    textState.x = 48;       // move text position
                } catch (error) {
                    console.warn('Character escape image not found:', filename);
                    // Use fallback image
                    try {
                        const fallbackImage = ImageManager.loadBitmap('img/faces/', '7');
                        this.contents.blt(
                            fallbackImage,
                            0, 0,
                            fallbackImage.width,
                            fallbackImage.height,
                            textState.x, textState.y,
                            36, 36
                        );
                        textState.x = 48;
                    } catch (fallbackError) {
                        console.warn('Fallback escape image also not found');
                    }
                }
            }
        } else {
            _Window_Base_processEscapeCharacter.apply(this, arguments);
        }
    };
    
    const _Window_Base_resetFontSettings = __base(Window_Base.prototype, 'resetFontSettings');
    Window_Base.prototype.resetFontSettings = function() {
        _Window_Base_resetFontSettings.apply(this, arguments);
        this.contents.fontSize = CONFIG.fontSize;
    };

    //-------------------------------------------------------------------------
    // Sprite_BattleLog - Individual Log Line Sprite
    //-------------------------------------------------------------------------
    
    function Sprite_BattleLog() {
        this.initialize(...arguments);
    }

    Sprite_BattleLog.prototype = Object.create(Sprite.prototype);
    Sprite_BattleLog.prototype.constructor = Sprite_BattleLog;

    Sprite_BattleLog.prototype.initialize = function(width, height) {
        Sprite.prototype.initialize.call(this);
        this.bitmap = new Bitmap(width, height);
        this._scrollXDuration = 0;
        this._viewDuration = -1;
    };

    // Optimize: Combined update logic for better performance
    Sprite_BattleLog.prototype.update = function(y, max) {
        Sprite.prototype.update.call(this);
        
        // Update durations
        if (this._scrollXDuration > 0) this._scrollXDuration--;
        if (this._viewDuration > 0) this._viewDuration--;
        
        // Calculate positions once
        const height = this.bitmap.height;
        const clampedY = y.clamp(0, max * height);
        
        // Update position
        this.x = this._scrollXDuration > 0 ? formulaTri(this._scrollXDuration) / 2 : 0;
        this.y = clampedY;
        
        // Update frame
        const fy = Math.max(-y, 0);
        this.setFrame(0, fy, this.bitmap.width, height - fy);
        
        // Update opacity - simplified calculation
        this.opacity = 255 - (this._scrollXDuration * 20);
    };

    Sprite_BattleLog.prototype.isPassed = function() {
        return this._viewDuration === 0;
    };

    Sprite_BattleLog.prototype.popup = function(scrollXDuration = 12) {
        this._scrollXDuration = scrollXDuration;
        if (CONFIG.logType === '1-line') {
            this._viewDuration = CONFIG.viewDuration || -1;
        }
    };

    //-------------------------------------------------------------------------
    // Window_BattleLog - Main Battle Log Window
    //-------------------------------------------------------------------------
    

    const _Window_BattleLog_initialize = Window_BattleLog.prototype.initialize;
    Window_BattleLog.prototype.initialize = function(rect) {
        // Custom width and height for the log window
        // Use full screen width (Graphics.width) so the log spans the whole 16:9 screen.
        const customWidth = Graphics.width -200;
        const customHeight = this.fittingHeight(8);

        // In 16:9 mode, Graphics.width > Graphics.boxWidth and the WindowLayer is
        // offset by (width - boxWidth) / 2 to center the game area. We negate this
        // offset so the battle log starts at the true left edge of the screen.
        const customX = -Math.floor((Graphics.width - Graphics.boxWidth) / 2);

        // Check if switch 45 is ON for top positioning
        let customY;
        if ($gameSwitches.value(45)) {
            customY = 20; // 90px from top when switch 45 is ON
        } else {
            customY = Graphics.boxHeight - customHeight; // Bottom positioning (default)
        }

        const customRect = new Rectangle(customX, customY, customWidth, customHeight);
    
        _Window_BattleLog_initialize.call(this, customRect);
    
        // --- MODIFICATIONS START ---
        this.frameVisible = false; // This line hides the window border.
        // --- MODIFICATIONS END ---

        this._clearDuration = 0;
        this._logScrollYDuration = 0;
        this._logScrollY = this.lineHeight();
        this.opacity = 255; // Keep contents (text) fully opaque.
        this.backOpacity = Math.floor(ConfigManager.battleLogBgOpacity * 2.55); // Convert percentage to 0-255 range
        
        // Animation properties
        this._animationState = 'hidden'; // New property to track animation state
        this._animationTimer = 0; // Timer for animation
        this._originalHeight = customHeight; // Store the original height
        this._originalY = this.y; // Store the original Y position
        this._targetHeight = 0; // Target height (start at 0)
        this.height = 0; // Start with height of 0
        this.visible = false; // Start hidden
    
        this.createLogSprites();
        this.drawBackground();
        
        // Optimization: Initialize and build the color cache when creating the log window
        NameColorCache.buildCache();
    };
    

    // Main methods
    Window_BattleLog.prototype.maxLines = function() {
        // If switch 45 is ON, return 1 line, otherwise use CONFIG setting
        if ($gameSwitches.value(45)) {
            return 3;
        }
        return 8;
    };

    Window_BattleLog.prototype.messageSpeed = function() {
        return CONFIG.messageSpeed;
    };
    
    Window_BattleLog.prototype.createLogSprites = function() {
        this._logSprites = [];
        const width = this.itemWidth();
        const height = this.itemHeight();
        // Only create the exact number of sprites needed (+1 for shifting)
        for (let i = 0; i <= this.maxLines(); i++) {
            const sprite = new Sprite_BattleLog(width, height);
            this._logSprites[i] = sprite;
            this.addInnerChild(sprite);
        }
    };

    // Optimized color coding utilities
    Window_BattleLog.prototype.colorCharacterNames = function(text) {
        if (!text) return text;
        
        // Ensure the cache is built
        NameColorCache.buildCache();
        
        let modifiedText = text;
        
        // Create regex patterns for each name type only once
        // Use word boundaries \b to match whole words only
        const namePatterns = [];
        
        // Go through all cached names and create replacements
        for (const [name, replacement] of NameColorCache._actorCache) {
            if (name && name.length > 1) {
                namePatterns.push({
                    regex: new RegExp(`\\b${name}\\b`, 'g'),
                    replacement: replacement
                });
            }
        }
        
        for (const [name, replacement] of NameColorCache._abilityCache) {
            if (name && name.length > 1) {
                namePatterns.push({
                    regex: new RegExp(`\\b${name}\\b`, 'g'),
                    replacement: replacement
                });
            }
        }
        
        // Sort by name length (descending) to avoid partial matches
        namePatterns.sort((a, b) => 
            b.replacement.length - a.replacement.length
        );
        
        // Apply all replacements
        for (const pattern of namePatterns) {
            modifiedText = modifiedText.replace(pattern.regex, pattern.replacement);
        }
        
        return modifiedText;
    };

    // Text and layout handling
    Window_BattleLog.prototype.indentText = function(text) {
        const indent = this._baseLineStack ? this._baseLineStack.length : 0;
        return '\\mx[%1]'.format(indent * 16) + text;
    };
    
    Window_BattleLog.prototype.backRect = function() {
        return new Rectangle(0, 0, this.innerWidth, this.innerHeight);
    };

    const _Window_BattleLog_lineRect = Window_BattleLog.prototype.lineRect;
    Window_BattleLog.prototype.lineRect = function(index) {
        const rect = _Window_BattleLog_lineRect.apply(this, arguments);
        rect.y = 0;
        return rect;
    };

    // Drawing and text updates
// Method 1: Update drawLineText method - Display names instead of icons
Window_BattleLog.prototype.drawLineText = function(index) {
    const rect = this.lineRect(index);
    const baseCT = this.contents;
    const sprite = this._logSprites[index + 1];
    const bitmap = sprite.bitmap;
    let text = this._lines[index];

    bitmap.clear();

    const indent = this._baseLineStack ? this._baseLineStack.length : 0;
    const indentPx = indent * 8;
    let x = rect.x + indentPx;

    // Strip the \mx[…] token
    text = text.replace(`\\mx[${indentPx}]`, '');

    // Replace actor names with colored versions (priority order: longest names first)
    const actors = $gameParty.battleMembers();
    actors.sort((a, b) => b.name().length - a.name().length);

    for (const actor of actors) {
        const name = actor.name();
        if (name && text.includes(name)) {
            let coloredName;
            if (actor.actorId() === 2) {
                coloredName = `\\c[${CONFIG.colors.actor2}]${name}\\c[0]`;
            } else if (actor.actorId() === 3) {
                coloredName = `\\c[${CONFIG.colors.actor3}]${name}\\c[0]`;
            } else {
                coloredName = `\\c[${CONFIG.colors.actor}]${name}\\c[0]`;
            }
            text = text.replace(new RegExp(`\\b${name}\\b`, 'g'), coloredName);
        }
    }

    // Enemy names are handled via NameColorCache - no direct replacement needed

    // Draw the text directly without character images
    this.contents = bitmap;
    this.drawTextEx(text, x, rect.y, rect.width - (x - rect.x));

    // Restore
    this.contents = baseCT;
};
const _Window_BattleLog_resetFontSettings = Window_BattleLog.prototype.resetFontSettings;
Window_BattleLog.prototype.resetFontSettings = function() {
    _Window_BattleLog_resetFontSettings.apply(this, arguments);
    this.contents.outlineColor = 'rgba(0, 0, 0, 1)'; // Solid black outline
    this.contents.outlineWidth = 4; // Thicker outline (default is 3)
};

    // Core functionality for log line management
    Window_BattleLog.prototype.addText = function(text) {
        // Apply translation here if translateText is available globally

        if (typeof translateText === 'function') {
            text = translateText(text);
        }
        const coloredText = this.colorCharacterNames(text);
        const indentText = this.indentText(coloredText);
        
        this._lines.push(indentText);
        if (this.numLines() > this.maxLines()) this.shiftLine();
        
        $gameTemp.addBattleLog(indentText);
        const index = this.numLines() - 1;
        this._logSprites[index + 1].popup();
        this.drawLineText(index);
        
        // Start scale in if window is hidden
        if (this._animationState === 'hidden' || this._animationState === 'scaling-out') {
            this.startScaleIn();
        }
        
        this.wait();
        this._clearDuration = 0;
    };

    Window_BattleLog.prototype.shiftLine = function() {
        this._lines.shift();
        const sprite = this._logSprites.shift();
        sprite.bitmap.clear();
        this._logSprites.push(sprite);
        this._logScrollY -= this.lineHeight();
        this._logScrollYDuration = 16;
    };

    // Animation control methods - Optimized calculations
    Window_BattleLog.prototype.startScaleIn = function() {
        this._animationState = 'scaling-in';
        this._animationTimer = 0;
        this._targetHeight = this._originalHeight;
        this.visible = true;
    };
    
    Window_BattleLog.prototype.startScaleOut = function() {
        if (this._animationState === 'visible') {
            this._animationState = 'scaling-out';
            this._animationTimer = 0;
            this._targetHeight = 0;
        }
    };
    
    // Precompute easing values for common animation progress points
    const EASING_CACHE_SIZE = 100;
    const easedInValues = Array(EASING_CACHE_SIZE).fill(0).map((_, i) => {
        const progress = i / (EASING_CACHE_SIZE - 1);
        return progress * progress; // Quadratic ease-in
    });
    
    const easedOutValues = Array(EASING_CACHE_SIZE).fill(0).map((_, i) => {
        const progress = i / (EASING_CACHE_SIZE - 1);
        return 1 - Math.pow(1 - progress, 3); // Cubic ease-out
    });
    
    Window_BattleLog.prototype.updateScaleAnimation = function() {
        const animSpeed = CONFIG.animationSpeed;
        
        if (this._animationState === 'scaling-in') {
            this._animationTimer += animSpeed;
            
            // Calculate progress (0 to 1)
            const fullDuration = 45;
            const progress = Math.min(1, this._animationTimer / fullDuration);
            
            // Get eased progress from cache or calculate it
            let easedProgress;
            if (progress >= 1) {
                easedProgress = 1;
            } else {
                const index = Math.floor(progress * (EASING_CACHE_SIZE - 1));
                easedProgress = easedOutValues[index];
            }
            
            // Set the new height and adjust y position to grow from the middle
            const newHeight = Math.floor(this._targetHeight * easedProgress);
            const heightDiff = this._originalHeight - newHeight;
            
            this.height = newHeight;
            this.y = this._originalY + (heightDiff / 2);
            
            if (progress >= 1) {
                this.height = this._originalHeight;
                this.y = this._originalY;
                this._animationState = 'visible';
            }
        } else if (this._animationState === 'scaling-out') {
            this._animationTimer += animSpeed;
            
            // Calculate progress (0 to 1)
            const fullDuration = 45;
            const progress = Math.min(1, this._animationTimer / fullDuration);
            
            // Get eased progress from cache or calculate it
            let easedProgress;
            if (progress >= 1) {
                easedProgress = 1;
            } else {
                const index = Math.floor(progress * (EASING_CACHE_SIZE - 1));
                easedProgress = easedInValues[index];
            }
            
            // Set the new height and adjust y position to shrink to the middle
            const newHeight = Math.floor(this._originalHeight * (1 - easedProgress));
            const heightDiff = this._originalHeight - newHeight;
            
            this.height = newHeight;
            this.y = this._originalY + (heightDiff / 2);
            
            if (progress >= 1) {
                this.height = 0;
                this.y = this._originalY + (this._originalHeight / 2);
                this._animationState = 'hidden';
                this.visible = false;
            }
        }
    };

    // Update methods
    const _Window_BattleLog_update = Window_BattleLog.prototype.update;
    Window_BattleLog.prototype.update = function() {
        // Check if switch 45 state changed and update position accordingly
        const shouldBeAtTop = false
        const currentlyAtTop = this._originalY === 20;
        
        if (shouldBeAtTop !== currentlyAtTop) {
            // Switch state changed, update position
            const customHeight = this.fittingHeight(this.maxLines());
            if (shouldBeAtTop) {
                this._originalY = 20; // Move to top
            } else {
                this._originalY = Graphics.boxHeight - customHeight; // Move to bottom
            }
            
            // Update current position if not animating
            if (this._animationState === 'visible' || this._animationState === 'hidden') {
                this.y = this._originalY;
            }
        }
        
        _Window_BattleLog_update.apply(this, arguments);
        this.updateLogScroll();
        this.updateLogSprites();
        this.updateScaleAnimation();
        
        // Check if we should start scaling out (when no lines are displayed)
        if (this.numLines() === 0 && this._animationState === 'visible') {
            this.startScaleOut();
        }
    };
    Window_BattleLog.prototype.updateLogScroll = function() {
        if (this._logScrollYDuration > 0) {
            const d = this._logScrollYDuration;
            const sy = this.lineHeight() - this._logScrollY;
            this._logScrollY += sy * d / formulaTri(d);
            this._logScrollYDuration--;
        }
    };
    
    Window_BattleLog.prototype.updateLogSprites = function() {
        const lineHeight = this.lineHeight();
        const maxLine = this.maxLines() - 1;
        
        // Only update visible sprites for better performance
        for (let i = 0; i < this._logSprites.length; i++) {
            const sprite = this._logSprites[i];
            sprite.update(lineHeight * i - this._logScrollY, maxLine);
        }
        
        if (this._clearDuration > 0) {
            this._clearDuration--;
            if (this._clearDuration === 0) this.clearSmoothBattleLog();
        } else if (this.numLines() > 0 && this._logSprites[1].isPassed()) {
           this.shiftLine();
        }
    };
    
    Window_BattleLog.prototype._updateContentsBack = function() {
        const bitmap = this._contentsBackSprite.bitmap;
        if (bitmap) {
            const lineHeight = this.lineHeight();
            let height = (this.numLines() + 1) * lineHeight - this._logScrollY;
            height = Math.min(height, bitmap.height);
            this._contentsBackSprite.setFrame(0, 0, bitmap.width, height);
        }
    };

    // Clear and reset methods
    const _Window_BattleLog_clear = Window_BattleLog.prototype.clear;
    Window_BattleLog.prototype.clear = function() {
        this._baseLineStack = [];
        if (CONFIG.logType === 'all') this._clearDuration = CONFIG.viewDuration;
    };
    
    Window_BattleLog.prototype.clearSmoothBattleLog = function() {
        _Window_BattleLog_clear.call(this);
        for (const sprite of this._logSprites) {
            sprite.bitmap.clear();
        }
        this._logScrollYDuration = 0;
        this._logScrollY = this.lineHeight();
        
        // Start scale out if there are no lines
        if (this.numLines() === 0) {
            this.startScaleOut();
        }
    };

    // Overrides for battle log behavior
    Window_BattleLog.prototype.waitForEffect = function() {};
    Window_BattleLog.prototype.startTurn = function() {};
    Window_BattleLog.prototype.popBaseLine = function() {
        if (this._baseLineStack) this._baseLineStack.pop();
    };

    const _Window_BattleLog_waitForNewLine = Window_BattleLog.prototype.waitForNewLine;
    Window_BattleLog.prototype.waitForNewLine = function() {
        if (CONFIG.waitNewLine) {
            _Window_BattleLog_waitForNewLine.apply(this, arguments);
        }
    };

    // Battle action display with color coding - optimized
    const _Window_BattleLog_displayAction = Window_BattleLog.prototype.displayAction;
    Window_BattleLog.prototype.displayAction = function(subject, item) {
        this._currentSubject = subject;

        const numMethods = this._methods.length;
        
        // Get colored name directly from cache
        let subjectName;
        if (subject.isActor()) {
            subjectName = NameColorCache.getActorName(subject);
        } else {
            subjectName = NameColorCache.getEnemyName(subject);
        }
        
        if (DataManager.isSkill(item) || DataManager.isItem(item)) {
            // Get colored item name from cache
            const itemName = NameColorCache.getItemName(item);
            
            if (item.message1) {
                this.push("addText", item.message1.format(subjectName, itemName));
            }
            if (item.message2) {
                this.push("addText", item.message2.format(subjectName, itemName));
            }
        } else {
            // For basic attacks
            this.push("addText", TextManager.basicAttack.format(subjectName));
        }
        
        if (this._methods.length === numMethods) {
            _Window_BattleLog_displayAction.apply(this, arguments);
        }
    };
    const _Window_BattleLog_addText = Window_BattleLog.prototype.addText;
    Window_BattleLog.prototype.addText = function(text) {
      // 5.a Optional translation
      if (typeof translateText === 'function') {
        text = translateText(text);
      }
      // 5.b Replace '*' based on actor/enemy gender/variable
      text = _replaceStars(text, this._currentSubject);
      // 5.c Continue with existing color-coding logic
      return _Window_BattleLog_addText.call(this, text);
    };
    
    // Damage display with colored names
    Window_BattleLog.prototype.displayMiss = function(target) {
        let fmt;
        if (target.result().physical) {
            fmt = target.isActor() ? TextManager.actorNoHit : TextManager.enemyNoHit;
        } else {
            fmt = TextManager.actionFailure;
        }
        
        // Get colored target name from cache
        let targetName;
        if (target.isActor()) {
            targetName = NameColorCache.getActorName(target);
        } else {
            targetName = NameColorCache.getEnemyName(target);
        }
        
        this.push("addText", fmt.format(targetName));
    };
    Window_BattleLog.prototype.displayRegeneration = function(subject) {
        if (subject.result().hpDamage < 0) {
            const value = Math.abs(subject.result().hpDamage);
            
            // Get colored subject name from cache
            let subjectName;
            if (subject.isActor()) {
                subjectName = NameColorCache.getActorName(subject);
            } else {
                subjectName = NameColorCache.getEnemyName(subject);
            }
            
            // Format: "[Name] recovered [X] HP!"
            if(ConfigManager.language === 'it'){
                this.push("addText", subjectName + " recupera " + value + " HP!");
            }else{
                this.push("addText", subjectName + " recovered " + value + " HP!");

            }
        }
    };

    //-------------------------------------------------------------------------
    // Window_PastBattleLog - Log History Window
    //-------------------------------------------------------------------------
    
    function Window_PastBattleLog() {
        this.initialize(...arguments);
    }

    Window_PastBattleLog.prototype = Object.create(Window_Selectable.prototype);
    Window_PastBattleLog.prototype.constructor = Window_PastBattleLog;

    Window_PastBattleLog.prototype.initialize = function(rect) {
        Window_Selectable.prototype.initialize.call(this, rect);
        this.openness = 0;
        this._data = [];
    };

    Window_PastBattleLog.prototype.maxItems = function() {
        return this._data.length;
    };

    Window_PastBattleLog.prototype.drawItem = function(index) {
        const rect = this.itemLineRect(index);
        this.drawTextEx(this._data[index], rect.x, rect.y, rect.width);
    };

    Window_PastBattleLog.prototype.refresh = function() {
        this._data = $gameTemp.battleLog();
        Window_Selectable.prototype.refresh.call(this);
    };

    Window_PastBattleLog.prototype.selectBottom = function() {
        this.select(Math.max(this.maxItems() - 1, 0));
    };

    //-------------------------------------------------------------------------
    // Window_PartyCommand - Add Log Command
    //-------------------------------------------------------------------------
    
    const _Window_PartyCommand_makeCommandList = Window_PartyCommand.prototype.makeCommandList;
    Window_PartyCommand.prototype.makeCommandList = function() {
        _Window_PartyCommand_makeCommandList.apply(this, arguments);
        if (CONFIG.logCommand !== '') {
            this.addCommand(CONFIG.logCommand, 'pastLog');
        }
    };

    //-------------------------------------------------------------------------
    // Scene_Battle - Integration with Battle Scene
    //-------------------------------------------------------------------------
    
    const _Scene_Battle_isAnyInputWindowActive = Scene_Battle.prototype.isAnyInputWindowActive;
    Scene_Battle.prototype.isAnyInputWindowActive = function() {
        return _Scene_Battle_isAnyInputWindowActive.apply(this, arguments) ||
                this._pastLogWindow.active;
    };

    const _Scene_Battle_terminate = Scene_Battle.prototype.terminate;
    Scene_Battle.prototype.terminate = function() {
        _Scene_Battle_terminate.apply(this, arguments);
        $gameTemp.clearBattleLog();
        // Clear name cache on battle termination
        NameColorCache.refresh();
    };

    const _Scene_Battle_createDisplayObjects = Scene_Battle.prototype.createDisplayObjects;
    Scene_Battle.prototype.createDisplayObjects = function() {
        _Scene_Battle_createDisplayObjects.apply(this, arguments);
        if (CONFIG.startMessagesOnLog) {
            BattleManager.displayStartMessagesOnLog();
        }
    };

    const _Scene_Battle_createAllWindows = Scene_Battle.prototype.createAllWindows;
    Scene_Battle.prototype.createAllWindows = function() {
        _Scene_Battle_createAllWindows.apply(this, arguments);
        this.createPastLogWindow();
    };

    Scene_Battle.prototype.logWindowRect = function() {
        const wx = -Math.floor((Graphics.width - Graphics.boxWidth) / 2);
        const wy = 0;
        const ww = Graphics.width;
        const wh = this.calcWindowHeight(CONFIG.maxLines, false);
        return new Rectangle(wx, wy, ww, wh);
    };

    Scene_Battle.prototype.createPastLogWindow = function() {
        const rect = this.pastLogWindowRect();
        const pastLogWindow = new Window_PastBattleLog(rect);
        pastLogWindow.setHandler('cancel', this.onPastLogCancel.bind(this));
        this.addWindow(pastLogWindow);
        this._pastLogWindow = pastLogWindow;
    };

    Scene_Battle.prototype.pastLogWindowRect = function() {
        const wx = 0;
        const wy = 0;
        const ww = Graphics.boxWidth;
        const wh = this._statusWindow.y;
        return new Rectangle(wx, wy, ww, wh);
    };
    
    const _Scene_Battle_createPartyCommandWindow = Scene_Battle.prototype.createPartyCommandWindow;
    Scene_Battle.prototype.createPartyCommandWindow = function() {
        _Scene_Battle_createPartyCommandWindow.apply(this, arguments);
        const commandWindow = this._partyCommandWindow;
        commandWindow.setHandler('pastLog', this.commandPastLog.bind(this));
    };

    Scene_Battle.prototype.commandPastLog = function() {
        this._pastLogWindow.refresh();
        this._pastLogWindow.open();
        this._pastLogWindow.selectBottom();
        this._pastLogWindow.activate();
    };

    Scene_Battle.prototype.onPastLogCancel = function() {
        this._pastLogWindow.close();
        this._pastLogWindow.deactivate();
        this._partyCommandWindow.activate();
    };

    const _Scene_Battle_closeCommandWindows = Scene_Battle.prototype.closeCommandWindows;
    Scene_Battle.prototype.closeCommandWindows = function() {
        _Scene_Battle_closeCommandWindows.apply(this, arguments);
        this._pastLogWindow.close();
        this._pastLogWindow.deactivate();
    };

    
    
})();
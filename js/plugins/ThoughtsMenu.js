/*:
 * @plugindesc Adds a "Thoughts" option to the menu with extensive character thoughts based on game state
 * @author Omni-Lex
 * @target MZ
 * @help This plugin adds a "Thoughts" command to the main menu.
 * When selected, it opens a window showing the most recent thoughts
 * from characters in your party.\n These thoughts are generated based on:
 * 
 * - Changes in party composition (members joining/leaving)
 * - Combat status (HP, MP, TP)
 * - Equipment and items
 * - Money changes (gaining/losing)
 * - Recently acquired items
 * - Weather conditions
 * - Current map and location
 * - Recently fought monsters
 * - Time of day
 * - Food and rest levels (tracks hunger/sleep for actors)
 * - Random thoughts about self and other party members
 * - Special conditions (death, status effects)
 * - Rare random thoughts with low probability
 * 
 * Each thought is color-coded with CSS to enhance readability.
 * Text automatically wraps after a certain number of characters.
 * 
 * Character personalities are seeded by the first letter of their name,
 * creating unique thought patterns for each character.
 * @command setMarkovDB
 * @text Set Markov Database
 * @desc Register a Markov chain database string for a party member
 *
 * @arg partyIndex
 * @text Party Member Position
 * @desc Which party member (1=first, 2=second, 3=third)
 * @type number
 * @min 1
 * @max 3
 * @default 1
 *
 * @arg markovData
 * @text Markov Database String
 * @desc The Markov chain database as a string
 * @type multiline_string
 * @default
 * @param MenuText
 * @desc Text displayed in the menu for the Thoughts option
 * @default Thoughts
 * 
 * @param MaxThoughts
 * @desc Maximum number of thoughts to display
 * @type number
 * @default 15
 * 
 * @param LineLength
 * @desc Number of characters before text wrapping
 * @type number
 * @default 60
 * 
 * @param EnableFoodTracking
 * @desc Track hunger levels for party members
 * @type boolean
 * @default true
 * 
 * @param EnableSleepTracking
 * @desc Track fatigue levels for party members
 * @type boolean
 * @default true
 * 
 * @param HungerDecreaseRate
 * @desc How quickly hunger decreases (steps)
 * @type number
 * @default 300
 * 
 * @param FatigueIncreaseRate
 * @desc How quickly fatigue increases (steps)
 * @type number
 * @default 500
 * 
 * @param EnableWeatherThoughts
 * @desc Generate thoughts about current weather
 * @type boolean
 * @default true
 * 
 * @param EnableTimeThoughts
 * @desc Generate thoughts about time of day
 * @type boolean
 * @default true
 * 
 * @param ThoughtColors
 * @desc CSS colors for different thought types
 * @type struct<ThoughtColors>
 * @default {"normal":"#FFFFFF","positive":"#7CFFCB","negative":"#FF7C7C","neutral":"#FFDA7C","determined":"#7C9DFF","welcome":"#D67CFF","sorrow":"#7C7CFF","rare":"#FFD700","equipment":"#81D4FA","status":"#FFB74D","other":"#AED581","money":"#B39DDB","item":"#4FC3F7","map":"#80CBC4","monster":"#FFAB91","weather":"#CE93D8","time":"#9FA8DA","food":"#DCE775","sleep":"#FFE082"}
 */

/*~struct~ThoughtColors:
 * @param normal
 * @desc Color for normal thoughts
 * @default #FFFFFF
 * 
 * @param positive
 * @desc Color for positive thoughts
 * @default #7CFFCB
 * 
 * @param negative
 * @desc Color for negative thoughts
 * @default #FF7C7C
 * 
 * @param neutral
 * @desc Color for neutral thoughts
 * @default #FFDA7C
 * 
 * @param determined
 * @desc Color for determined thoughts
 * @default #7C9DFF
 * 
 * @param welcome
 * @desc Color for welcome thoughts
 * @default #D67CFF
 * 
 * @param sorrow
 * @desc Color for sorrow thoughts
 * @default #7C7CFF
 * 
 * @param rare
 * @desc Color for rare thoughts
 * @default #FFD700
 * 
 * @param equipment
 * @desc Color for equipment thoughts
 * @default #81D4FA
 * 
 * @param status
 * @desc Color for status thoughts
 * @default #FFB74D
 * 
 * @param other
 * @desc Color for thoughts about other party members
 * @default #AED581
 * 
 * @param money
 * @desc Color for money-related thoughts
 * @default #B39DDB
 * 
 * @param item
 * @desc Color for item-related thoughts
 * @default #4FC3F7
 * 
 * @param map
 * @desc Color for location-related thoughts
 * @default #80CBC4
 * 
 * @param monster
 * @desc Color for monster-related thoughts
 * @default #FFAB91
 * 
 * @param weather
 * @desc Color for weather-related thoughts
 * @default #CE93D8
 * 
 * @param time
 * @desc Color for time-related thoughts
 * @default #9FA8DA
 * 
 * @param food
 * @desc Color for food/hunger-related thoughts
 * @default #DCE775
 * 
 * @param sleep
 * @desc Color for sleep/fatigue-related thoughts
 * @default #FFE082
 * 

 */

(function() {
    const pluginName = "ThoughtsMenu";
    
    const parameters = PluginManager.parameters(pluginName);
    const menuText = "Thoughts";
    const maxThoughts = Number(parameters['MaxThoughts'] || 15);
    const lineLength = Number(parameters['LineLength'] || 60);
    const { SPRITES_ASSOCIATION } = window.Sprites;

    // New parameters
    const enableFoodTracking = parameters['EnableFoodTracking'] === 'true';
    const enableSleepTracking = parameters['EnableSleepTracking'] === 'true';
    const enableWeatherThoughts = parameters['EnableWeatherThoughts'] === 'true';
    const enableTimeThoughts = parameters['EnableTimeThoughts'] === 'true';
    
    // Parse color parameters
    let thoughtColors = {};
    try {
        thoughtColors = JSON.parse(parameters['ThoughtColors'] || '{}');
        for (const key in thoughtColors) {
            thoughtColors[key] = JSON.parse(thoughtColors[key]);
        }
    } catch (e) {
        thoughtColors = {
            normal: "#FFFFFF",
            positive: "#7CFFCB",
            negative: "#FF7C7C",
            neutral: "#FFDA7C",
            determined: "#7C9DFF",
            welcome: "#D67CFF",
            sorrow: "#7C7CFF",
            rare: "#FFD700",
            equipment: "#81D4FA",
            status: "#FFB74D",
            other: "#AED581",
            money: "#B39DDB",
            item: "#4FC3F7",
            map: "#80CBC4",
            monster: "#FFAB91",
            weather: "#CE93D8",
            time: "#9FA8DA",
            food: "#DCE775",
            sleep: "#FFE082"
        };
    }
    
    // Helper function to get bust image path using SPRITES_ASSOCIATION
    function getBustImagePath(actor) {
        if (!actor) return null;

        const actorId = actor.actorId && actor.actorId();
        const characterName = actor.characterName();

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

            // Priority 3: Fall back to SPRITES_ASSOCIATION
            if (characterName && window.Sprites && SPRITES_ASSOCIATION) {
                const spritesheetName = characterName.split('.')[0];
                const characterIndex = actor.characterIndex();

                if (SPRITES_ASSOCIATION[spritesheetName] &&
                    SPRITES_ASSOCIATION[spritesheetName][characterIndex]) {
                    const bustName = SPRITES_ASSOCIATION[spritesheetName][characterIndex];
                    return "img/busts/" + bustName;
                }
            }

            return "img/busts/7";
        }

        // Players 2 & 3: Use SPRITES_ASSOCIATION based on sprite
        if (characterName && window.Sprites && SPRITES_ASSOCIATION) {
            const spritesheetName = characterName.split('.')[0];
            const characterIndex = actor.characterIndex();

            if (SPRITES_ASSOCIATION[spritesheetName] &&
                SPRITES_ASSOCIATION[spritesheetName][characterIndex]) {
                const bustName = SPRITES_ASSOCIATION[spritesheetName][characterIndex];
                return "img/busts/" + bustName;
            }
        }

        // Fallback to default bust path structure
        return "img/busts/" + characterName + "/" + actor.characterIndex();
    }

    // Global variables to track party state
    let $lastPartyState = {
        size: 0,
        members: [],
        hp: {},
        mp: {},
        tp: {},
        equips: {},
        money: 0,
        items: {},
        weapons: {},
        armors: {},
        lastMap: 0,
        recentMonsters: [],
        hungerLevels: {},
        fatigueLevels: {},
        lastEquipComments: {}
    };
    
    // Thought history
    const $thoughtHistory = [];
    
    // Recent monsters fought
    const $recentMonsters = [];
    const MAX_RECENT_MONSTERS = 5;
    
    // Recent items acquired
    const $recentItems = {
        items: [],
        weapons: [],
        armors: []
    };
    const MAX_RECENT_ITEMS = 10;
    
    // Personality types based on actor name
    const PERSONALITY_TYPES = {
        CHEERFUL: 'cheerful',      // A-E
        SERIOUS: 'serious',        // F-J
        ANALYTICAL: 'analytical',  // K-O
        EMOTIONAL: 'emotional',    // P-T
        MYSTERIOUS: 'mysterious',  // U-Z
        DEFAULT: 'neutral'
    };
    
    // Get personality type based on actor name
    function getPersonalityType(actor) {
        if (!actor || !actor.name()) return PERSONALITY_TYPES.DEFAULT;
        
        const firstLetter = actor.name().charAt(0).toUpperCase();
        if (firstLetter >= 'A' && firstLetter <= 'E') return PERSONALITY_TYPES.CHEERFUL;
        if (firstLetter >= 'F' && firstLetter <= 'J') return PERSONALITY_TYPES.SERIOUS;
        if (firstLetter >= 'K' && firstLetter <= 'O') return PERSONALITY_TYPES.ANALYTICAL;
        if (firstLetter >= 'P' && firstLetter <= 'T') return PERSONALITY_TYPES.EMOTIONAL;
        if (firstLetter >= 'U' && firstLetter <= 'Z') return PERSONALITY_TYPES.MYSTERIOUS;
        
        return PERSONALITY_TYPES.DEFAULT;
    }
    

    
    // Add plugin commands
    PluginManager.registerCommand(pluginName, "eatFood", args => {
        const itemId = Number(args.itemId);
        const actorId = args.actorId ? Number(args.actorId) : 0;
        $gameParty.eatFood(itemId, actorId);
    });
    
    PluginManager.registerCommand(pluginName, "rest", args => {
        const hours = Number(args.hours) || 8;
        $gameParty.rest(hours);
    });
    
    PluginManager.registerCommand(pluginName, "setHunger", args => {
        const actorId = Number(args.actorId);
        const value = Number(args.value);
        
        if (actorId > 0 && value >= 0 && value <= 100) {
            $lastPartyState.hungerLevels[actorId] = value;
        }
    });
    
    PluginManager.registerCommand(pluginName, "setFatigue", args => {
        const actorId = Number(args.actorId);
        const value = Number(args.value);
        
        if (actorId > 0 && value >= 0 && value <= 100) {
            $lastPartyState.fatigueLevels[actorId] = value;
        }
    });
    
    PluginManager.registerCommand(pluginName, "addMonster", args => {
        const monsterId = Number(args.monsterId);
        
        if (monsterId > 0) {
            $recentMonsters.push(monsterId);
            if ($recentMonsters.length > MAX_RECENT_MONSTERS) {
                $recentMonsters.shift();
            }
        }
    });
    
    PluginManager.registerCommand(pluginName, "addThought", args => {
        const actorId = Number(args.actorId);
        const text = args.text;
        const type = args.type || 'normal';
        
        if (actorId > 0 && text) {
            const actor = $gameActors.actor(actorId);
            if (actor) {
                const personality = getPersonalityType(actor);
                
                // Add the thought to history
                const thought = {
                    actorId: actorId,
                    actorName: actor.name(),
                    text: text,
                    type: type,
                    personality: personality,
                    time: new Date().getTime()
                };
                
                $thoughtHistory.unshift(thought);
                
                // Keep only the latest maxThoughts
                if ($thoughtHistory.length > maxThoughts) {
                    $thoughtHistory.pop();
                }
            }
        }
    });
    
    // Helper function to check hunger level
    Game_Actor.prototype.hungerLevel = function() {
        if (!enableFoodTracking) return 100;
        
        const actorId = this.actorId();
        return $lastPartyState.hungerLevels[actorId] || 0;
    };
    
    // Helper function to check fatigue level
    Game_Actor.prototype.fatigueLevel = function() {
        if (!enableSleepTracking) return 0;
        
        const actorId = this.actorId();
        return $lastPartyState.fatigueLevels[actorId] || 0;
    };
    
    // Apply hunger/fatigue effects to actor stats if desired
    const _Game_Actor_paramPlus = Game_Actor.prototype.paramPlus;
    Game_Actor.prototype.paramPlus = function(paramId) {
        let value = _Game_Actor_paramPlus.call(this, paramId);
        
        // If food tracking is enabled, reduce stats when hungry
        if (enableFoodTracking) {
            const hungerLevel = this.hungerLevel();
            
            // At 0 hunger, reduce attack and defense by up to 25%
            if (hungerLevel < 30) {
                const reduction = 0.25 * ((30 - hungerLevel) / 30);
                
                // Paramids: 2=attack, 3=defense, 4=magic attack, 5=magic defense
                if (paramId >= 2 && paramId <= 5) {
                    value -= Math.floor(value * reduction);
                }
            }
        }
        
        // If sleep tracking is enabled, reduce stats when fatigued
        if (enableSleepTracking) {
            const fatigueLevel = this.fatigueLevel();
            
            // At max fatigue, reduce all stats by up to 25%
            if (fatigueLevel > 70) {
                const reduction = 0.25 * ((fatigueLevel - 70) / 30);
                value -= Math.floor(value * reduction);
            }
        }
        
        return value;
    };

    // Add the Thoughts command to the main menu
    const _Window_MenuCommand_addOriginalCommands = Window_MenuCommand.prototype.addOriginalCommands;
    Window_MenuCommand.prototype.addOriginalCommands = function() {
        _Window_MenuCommand_addOriginalCommands.call(this);
        const useTranslation = ConfigManager.language === 'it';
        this.addCommand(useTranslation?"Parla":"Talk", 'thoughts',true,246);
        this.addCommand(useTranslation?"Dinamiche":"Dynamics", 'dynamics', true, 75);

    };
    
    // Add the Thoughts command handler to the Scene_Menu
    const _Scene_Menu_createCommandWindow = Scene_Menu.prototype.createCommandWindow;
    Scene_Menu.prototype.createCommandWindow = function() {
        _Scene_Menu_createCommandWindow.call(this);
        this._commandWindow.setHandler('thoughts', this.commandThoughts.bind(this));
    };
    
    // Thoughts command handler
    Scene_Menu.prototype.commandThoughts = function() {
        SceneManager.push(Scene_Thoughts);
    };


    
    // Define the Thoughts window
// Define the Thoughts window - IMPROVED VERSION
function Window_Thoughts() {
    this.initialize(...arguments);
}

Window_Thoughts.prototype = Object.create(Window_Selectable.prototype);
Window_Thoughts.prototype.constructor = Window_Thoughts;

Window_Thoughts.prototype.initialize = function(rect) {
    Window_Selectable.prototype.initialize.call(this, rect);
    this._scrollY = 0; // Add scroll tracking
    this.refresh();
    this.activate();
    this.select(0);
};

Window_Thoughts.prototype.maxItems = function() {
    return $thoughtHistory.length;
};

Window_Thoughts.prototype.itemHeight = function() {
    // Increase height to accommodate multi-line thoughts
    return this.lineHeight() * 3; // Allocate 3 lines per thought instead of 2
};

Window_Thoughts.prototype.drawItem = function(index) {
    const thought = $thoughtHistory[index];
    if (thought) {
        const rect = this.itemLineRect(index);
        const color = thoughtColors[thought.type] || thoughtColors.normal;
        const lineHeight = this.lineHeight();
        
        // Clear the entire item area first to prevent text overlap
        this.contents.clearRect(rect.x, rect.y, rect.width, this.itemHeight());
        
        // Get actor for bust image
        const actor = $gameActors.actor(thought.actorId);
        if (actor) {
            try {
                // Draw custom bust image using SPRITES_ASSOCIATION
                const bustImagePath = getBustImagePath(actor);
                const fallbackBitmap = ImageManager.loadBitmap('img/busts/', '7');
                let bustBitmap = null;

                // Parse the path to separate directory and filename for loading
                if (bustImagePath) {
                    const lastSlashIndex = bustImagePath.lastIndexOf('/');
                    let bustDir, bustFile;

                    if (lastSlashIndex > 0) {
                        bustDir = bustImagePath.substring(0, lastSlashIndex + 1);
                        bustFile = bustImagePath.substring(lastSlashIndex + 1);
                    } else {
                        bustDir = "img/busts/";
                        bustFile = bustImagePath;
                    }

                    bustBitmap = ImageManager.loadBitmap(bustDir, bustFile);
                } else {
                    bustBitmap = fallbackBitmap;
                }
                const bustWidth = 32;
                const bustHeight = 32;
                const bustX = rect.x;
                const bustY = rect.y;
                
                bustBitmap.addLoadListener(() => {
                    try {
                        // Check if image loaded successfully
                        if (bustBitmap.width > 0 && bustBitmap.height > 0) {
                            this.contents.blt(bustBitmap, 0, 0, bustBitmap.width, bustBitmap.height, bustX, bustY, bustWidth, bustHeight);
                        } else {
                            // Use fallback if primary image failed
                            this.contents.blt(fallbackBitmap, 0, 0, fallbackBitmap.width, fallbackBitmap.height, bustX, bustY, bustWidth, bustHeight);
                        }
                    } catch (error) {
                        console.warn('Error drawing bust image in load listener:', error);
                        // Use fallback on error
                        this.contents.blt(fallbackBitmap, 0, 0, fallbackBitmap.width, fallbackBitmap.height, bustX, bustY, bustWidth, bustHeight);
                    }
                });
                
                bustBitmap.addErrorListener(() => {
                    try {
                        // Use fallback on error
                        this.contents.blt(fallbackBitmap, 0, 0, fallbackBitmap.width, fallbackBitmap.height, bustX, bustY, bustWidth, bustHeight);
                    } catch (error) {
                        console.warn('Error drawing fallback image in error listener:', error);
                    }
                });
                
                // Try immediate draw if already loaded
                if (bustBitmap.isReady() && bustBitmap.width > 0) {
                    this.contents.blt(bustBitmap, 0, 0, bustBitmap.width, bustBitmap.height, bustX, bustY, bustWidth, bustHeight);
                }
            } catch (error) {
                console.warn('Error loading bust image for actor:', thought.actorId, error);
                // Use fallback image on error
                try {
                    const fallbackBitmap = ImageManager.loadBitmap('img/busts/', '7');
                    const bustWidth = 32;
                    const bustHeight = 32;
                    const bustX = rect.x;
                    const bustY = rect.y;
                    
                    fallbackBitmap.addLoadListener(() => {
                        this.contents.blt(fallbackBitmap, 0, 0, fallbackBitmap.width, fallbackBitmap.height, bustX, bustY, bustWidth, bustHeight);
                    });
                    
                    if (fallbackBitmap.isReady()) {
                        this.contents.blt(fallbackBitmap, 0, 0, fallbackBitmap.width, fallbackBitmap.height, bustX, bustY, bustWidth, bustHeight);
                    }
                } catch (fallbackError) {
                    console.error('Error loading fallback image:', fallbackError);
                }
            }
        }
        
        // Draw actor name with proper spacing
        this.resetTextColor();
        this.contents.fontSize = 24; // Slightly larger font for actor name
        // Truncate long names to 4 characters + :
        const shortName = thought.actorName.length > 4 ? 
            thought.actorName.substring(0, 4) + ":" : 
            thought.actorName + ":";
            
        this.drawText(shortName, rect.x + 40, rect.y, 80);        
        // Reset font size for thought text
        this.changeTextColor(color);
        
        // Process text for proper display
        const wrappedText = this.processThoughtText(thought.text, rect.width - 130);
        
        // Draw each line of thought text with proper spacing
        for (let i = 0; i < wrappedText.length; i++) {
            const line = wrappedText[i];
            const y = rect.y + i * (lineHeight - 4); // Slight reduction in line spacing
            this.drawText(line, rect.x + 130, y, rect.width - 130);
        }
    }
 };
// New method to properly process thought text
Window_Thoughts.prototype.processThoughtText = function(text, maxWidth) {
    const lines = text.split('\n');
    const result = [];
    
    for (let i = 0; i < lines.length; i++) {
        let line = lines[i];
        let tempWidth = this.textWidth(line);
        
        if (tempWidth <= maxWidth) {
            // Line fits, add it directly
            result.push(line);
        } else {
            // Line doesn't fit, split it into multiple lines
            let currentLine = '';
            const words = line.split(' ');
            
            for (let j = 0; j < words.length; j++) {
                const word = words[j];
                const testLine = currentLine + (currentLine ? ' ' : '') + word;
                const testWidth = this.textWidth(testLine);
                
                if (testWidth > maxWidth) {
                    if (currentLine) {
                        result.push(currentLine);
                        currentLine = word;
                    } else {
                        // Word is too long for a line, add it anyway
                        result.push(word);
                        currentLine = '';
                    }
                } else {
                    currentLine = testLine;
                }
            }
            
            if (currentLine) {
                result.push(currentLine);
            }
        }
    }
    
    return result;
};

Window_Thoughts.prototype.refresh = function() {
    this.contents.clear();
    this.drawAllItems();
};

// Override scrolling methods to provide smoother scrolling
Window_Thoughts.prototype.overallHeight = function() {
    return this.maxItems() * this.itemHeight();
};
Window_Thoughts.prototype.drawItemBackground = function(index) {
    // Do nothing - removes the selection background
};

Window_Thoughts.prototype.refreshCursor = function() {
    // Do nothing - removes the cursor rectangle
};

Window_Thoughts.prototype.setCursorRect = function(x, y, width, height) {
    // Do nothing - prevents cursor rectangle from being set
};
// Alternative method - override the cursor drawing entirely
Window_Thoughts.prototype.updateCursor = function() {
    // Keep the scrolling logic but remove cursor visibility
    const scrollY = this.index() * this.itemHeight() - this.baseY();
    this.setScrollY(scrollY);
    
    // Don't call the parent updateCursor to avoid drawing the selection outline
    // Window_Selectable.prototype.updateCursor.call(this);
};

Window_Thoughts.prototype.setScrollY = function(scrollY) {
    if (this._scrollY !== scrollY) {
        this._scrollY = scrollY;
        this.refresh();
    }
};

Window_Thoughts.prototype.baseY = function() {
    return Math.floor(this.innerHeight / 2 - this.itemHeight() / 2);
};

// Enhance scroll handling
Window_Thoughts.prototype.processCursorMove = function() {
    Window_Selectable.prototype.processCursorMove.call(this);
    if (this.isCursorMovable()) {
        if (Input.isRepeated('up')) {
            this.smoothScrollUp();
        }
        if (Input.isRepeated('down')) {
            this.smoothScrollDown();
        }
    }
};

Window_Thoughts.prototype.smoothScrollUp = function() {
    this.cursorUp();
};

Window_Thoughts.prototype.smoothScrollDown = function() {
    this.cursorDown();
};

    // Hook into item gain to track new items
    const _Game_Party_gainItem = Game_Party.prototype.gainItem;
    Game_Party.prototype.gainItem = function(item, amount, includeEquip) {
        const hadItem = this.hasItem(item, includeEquip);
        _Game_Party_gainItem.call(this, item, amount, includeEquip);
        
        // Only track item gains, not losses
        if (amount > 0 && item) {
            // Check if the item is newly acquired
            if (!hadItem || this.numItems(item) === amount) {
                if (DataManager.isItem(item)) {
                    $recentItems.items.push(item.id);
                    if ($recentItems.items.length > MAX_RECENT_ITEMS) {
                        $recentItems.items.shift();
                    }
                } else if (DataManager.isWeapon(item)) {
                    $recentItems.weapons.push(item.id);
                    if ($recentItems.weapons.length > MAX_RECENT_ITEMS) {
                        $recentItems.weapons.shift();
                    }
                } else if (DataManager.isArmor(item)) {
                    $recentItems.armors.push(item.id);
                    if ($recentItems.armors.length > MAX_RECENT_ITEMS) {
                        $recentItems.armors.shift();
                    }
                }
                
                // If it's a consumable item that affects hunger/fatigue, apply its effects
                if (enableFoodTracking && DataManager.isItem(item) && item.consumable) {
                    if (item.meta.food && amount > 0) {
                        const foodValue = Number(item.meta.food) || 30;
                        $gameParty.members().forEach(actor => {
                            const actorId = actor.actorId();
                            $lastPartyState.hungerLevels[actorId] = Math.min(100, ($lastPartyState.hungerLevels[actorId] || 0) + foodValue);
                        });
                    }
                }
                
                if (enableSleepTracking && DataManager.isItem(item) && item.consumable) {
                    if (item.meta.sleep && amount > 0) {
                        const sleepValue = Number(item.meta.sleep) || 30;
                        $gameParty.members().forEach(actor => {
                            const actorId = actor.actorId();
                            $lastPartyState.fatigueLevels[actorId] = Math.max(0, ($lastPartyState.fatigueLevels[actorId] || 100) - sleepValue);
                        });
                    }
                }
            }
        }
    };
    
    // Hook into money changes
    const _Game_Party_gainGold = Game_Party.prototype.gainGold;
    Game_Party.prototype.gainGold = function(amount) {
        const oldGold = this.gold();
        _Game_Party_gainGold.call(this, amount);
        
        // We'll check the money change in the Scene_Thoughts
        $lastPartyState.moneyChange = this.gold() - oldGold;
    };
    
    // Hook into battle end to track fought monsters
    const _BattleManager_endBattle = BattleManager.endBattle;
    BattleManager.endBattle = function(result) {
        _BattleManager_endBattle.call(this, result);
        
        // Record monsters fought in this battle
        if (result === 0) { // Victory
            $gameTroop.members().forEach(enemy => {
                if (enemy.enemy()) {
                    $recentMonsters.push(enemy.enemy().id);
                    if ($recentMonsters.length > MAX_RECENT_MONSTERS) {
                        $recentMonsters.shift();
                    }
                }
            });
        }
    };
    
    // Define the Thoughts scene
    function Scene_Thoughts() {
        this.initialize(...arguments);
    }
    
    Scene_Thoughts.prototype = Object.create(Scene_MenuBase.prototype);
    Scene_Thoughts.prototype.constructor = Scene_Thoughts;
    
    Scene_Thoughts.prototype.initialize = function() {
        Scene_MenuBase.prototype.initialize.call(this);
        this._thoughtInterval = null; 
    };
    
    
Scene_Thoughts.prototype.create = function() {
    Scene_MenuBase.prototype.create.call(this);
    this.createThoughtsWindow();
    
    // Clear the thoughts log when the scene opens.
    // NOTE: This assumes your thoughts are stored in `$gameSystem._thoughts`.
    // If you store them elsewhere, change this line accordingly.
    $gameSystem._thoughts = []; 
    
    // Generate the first batch of thoughts immediately.
    this.generateThoughts(); 

    // Then, set up a timer to call generateThoughts every 10 seconds (3000 ms).
   // this._thoughtInterval = setInterval(this.generateThoughts.bind(this), 10000);
};
Scene_Thoughts.prototype.terminate = function() {
    Scene_MenuBase.prototype.terminate.call(this);
    // This is important to prevent memory leaks and errors!
    if (this._thoughtInterval) {
        clearInterval(this._thoughtInterval);
    }
};
    Scene_Thoughts.prototype.createThoughtsWindow = function() {
        const rect = this.thoughtsWindowRect();
        this._thoughtsWindow = new Window_Thoughts(rect);
        this._thoughtsWindow.setHandler('cancel', this.popScene.bind(this));
        this.addWindow(this._thoughtsWindow);
    };
    
    Scene_Thoughts.prototype.thoughtsWindowRect = function() {
        const ww = Graphics.boxWidth;
        const wh = Graphics.boxHeight - this.calcWindowHeight(1, true);
        const wx = 0;
        const wy = this.calcWindowHeight(1, true);
        return new Rectangle(wx, wy, ww, wh);
    };
    

    Scene_Thoughts.prototype.wrapText = function(text, maxLength) {
        if (!text) return "";
        if (text.length <= maxLength) return text;
        
        let result = '';
        let lines = text.split('\n');
        
        for (let i = 0; i < lines.length; i++) {
            let currentLine = '';
            const words = lines[i].split(' ');
            
            for (let j = 0; j < words.length; j++) {
                const word = words[j];
                if ((currentLine + word).length > maxLength) {
                    result += currentLine.trim() + '\n';
                    currentLine = word + ' ';
                } else {
                    currentLine += word + ' ';
                }
            }
            
            result += currentLine.trim();
            if (i < lines.length - 1) {
                result += '\n';
            }
        }
        
        return result;
    };
    
    Scene_Thoughts.prototype.addThought = function(actor, text, type = 'normal') {
        const thought = {
            actorId: actor.actorId(),
            actorName: actor.name(),
            text: text,
            type: type,
            personality: getPersonalityType(actor),
            time: new Date().getTime()
        };
        
        $thoughtHistory.unshift(thought);
        
        // Keep only the latest maxThoughts
        if ($thoughtHistory.length > maxThoughts) {
            $thoughtHistory.pop();
        }
    };
    // Add this code to your ThoughtsMenu.js plugin

// Initialize relationship tracking when game system is ready
const _DataManager_createGameObjects = DataManager.createGameObjects;
DataManager.createGameObjects = function() {
    _DataManager_createGameObjects.call(this);
    $gameSystem._partyRelationships = $gameSystem._partyRelationships || {};
};

const _DataManager_extractSaveContents = DataManager.extractSaveContents;
DataManager.extractSaveContents = function(contents) {
    _DataManager_extractSaveContents.call(this, contents);
    $gameSystem._partyRelationships = $gameSystem._partyRelationships || {};
};


// Add handler to Scene_Menu
const _Scene_Menu_createCommandWindow_Dynamics = Scene_Menu.prototype.createCommandWindow;
Scene_Menu.prototype.createCommandWindow = function() {
    _Scene_Menu_createCommandWindow_Dynamics.call(this);
    this._commandWindow.setHandler('dynamics', this.commandDynamics.bind(this));
};

Scene_Menu.prototype.commandDynamics = function() {
    SceneManager.push(Scene_PartyDynamics);
};

// Define the Party Dynamics Window
function Window_PartyDynamics() {
    this.initialize(...arguments);
}

Window_PartyDynamics.prototype = Object.create(Window_Base.prototype);
Window_PartyDynamics.prototype.constructor = Window_PartyDynamics;

Window_PartyDynamics.prototype.initialize = function(rect) {
    Window_Base.prototype.initialize.call(this, rect);
    this.refresh();
};

Window_PartyDynamics.prototype.refresh = function() {
    this.contents.clear();
    this.drawRelationshipGraph();
};

Window_PartyDynamics.prototype.drawRelationshipGraph = function() {
    const members = $gameParty.members();
    if (members.length < 2) {
        this.drawText("Need at least 2 party members", 0, 0, this.contents.width, 'center');
        return;
    }
    
    // Initialize relationships if needed
    this.initializeRelationships();
    
    // Calculate positions for party members in a triangle/line
    const centerX = this.contents.width / 2;
    const centerY = this.contents.height / 2-20;
    const radius = Math.min(this.contents.width, this.contents.height) * 0.35;
    
    const positions = [];
    for (let i = 0; i < members.length; i++) {
        const angle = (i / members.length) * Math.PI * 2 - Math.PI / 2;
        positions.push({
            x: centerX + Math.cos(angle) * radius,
            y: centerY + Math.sin(angle) * radius
        });
    }
    
    // Draw relationship lines first
    for (let i = 0; i < members.length; i++) {
        for (let j = i + 1; j < members.length; j++) {
            this.drawRelationshipLine(
                positions[i], positions[j],
                members[i].actorId(), members[j].actorId()
            );
        }
    }
    
    // Draw character nodes
    for (let i = 0; i < members.length; i++) {
        this.drawCharacterNode(members[i], positions[i]);
    }
    
    // Draw legend
    this.drawLegend();
};

Window_PartyDynamics.prototype.initializeRelationships = function() {
    const members = $gameParty.members();
    
    for (let i = 0; i < members.length; i++) {
        for (let j = i + 1; j < members.length; j++) {
            const key = this.getRelationshipKey(members[i].actorId(), members[j].actorId());
            if ($gameSystem._partyRelationships[key] === undefined) {
                // Start with neutral relationship (0) with some variance
                $gameSystem._partyRelationships[key] = Math.floor(Math.random() * 21) - 10;
            }
        }
    }
};

Window_PartyDynamics.prototype.getRelationshipKey = function(actorId1, actorId2) {
    return actorId1 < actorId2 ? `${actorId1}_${actorId2}` : `${actorId2}_${actorId1}`;
};

Window_PartyDynamics.prototype.getRelationshipValue = function(actorId1, actorId2) {
    const key = this.getRelationshipKey(actorId1, actorId2);
    return $gameSystem._partyRelationships[key] || 0;
};

Window_PartyDynamics.prototype.drawRelationshipLine = function(pos1, pos2, actorId1, actorId2) {
    const value = this.getRelationshipValue(actorId1, actorId2);
    
    // Determine line color based on relationship value
    let color;
    if (value >= 50) {
        color = '#00FF00'; // Strong positive - Green
    } else if (value >= 20) {
        color = '#90EE90'; // Positive - Light Green
    } else if (value <= -50) {
        color = '#FF0000'; // Strong negative - Red
    } else if (value <= -20) {
        color = '#FFA500'; // Negative - Orange
    } else {
        color = '#CCCCCC'; // Neutral - Gray
    }
    
    // Calculate line thickness based on relationship strength
    const thickness = Math.min(Math.abs(value) / 20 + 1, 5);
    
    // Draw the line
    const ctx = this.contents._context;
    ctx.save();
    ctx.strokeStyle = color;
    ctx.lineWidth = thickness;
    ctx.globalAlpha = 0.7;
    ctx.beginPath();
    ctx.moveTo(pos1.x, pos1.y);
    ctx.lineTo(pos2.x, pos2.y);
    ctx.stroke();
    
    // Draw relationship value at midpoint
    const midX = (pos1.x + pos2.x) / 2;
    const midY = (pos1.y + pos2.y) / 2;
    ctx.fillStyle = '#FFFFFF';
    ctx.font = '16px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(value.toString(), midX, midY);
    
    ctx.restore();
};

Window_PartyDynamics.prototype.drawCharacterNode = function(actor, position) {
    const bustWidth = 100;
    const bustHeight = 100;
    // Load bust image using SPRITES_ASSOCIATION
    if (actor) {
        try {
            const bustImagePath = getBustImagePath(actor);
            const fallbackBitmap = ImageManager.loadBitmap('img/busts/', '7');
            let bustBitmap = null;

            // Parse the path to separate directory and filename for loading
            if (bustImagePath) {
                const lastSlashIndex = bustImagePath.lastIndexOf('/');
                let bustDir, bustFile;

                if (lastSlashIndex > 0) {
                    bustDir = bustImagePath.substring(0, lastSlashIndex + 1);
                    bustFile = bustImagePath.substring(lastSlashIndex + 1);
                } else {
                    bustDir = "img/busts/";
                    bustFile = bustImagePath;
                }

                bustBitmap = ImageManager.loadBitmap(bustDir, bustFile);
            } else {
                bustBitmap = fallbackBitmap;
            }
            
            // Add a load listener to draw the bust when it's ready
            bustBitmap.addLoadListener(() => {
                try {
                    const sx = 0;
                    const sy = 0;
                    let sw = bustBitmap.width;
                    let sh = bustBitmap.height;
                    let imageToDraw = bustBitmap;
                    // Check if image loaded successfully
                    if (bustBitmap.width <= 0 || bustBitmap.height <= 0) {
                        // Use fallback if primary image failed
                        imageToDraw = fallbackBitmap;
                        sw = fallbackBitmap.width;
                        sh = fallbackBitmap.height;
                    }
                    // Center the image at the node's position
                    const dx = position.x - bustWidth / 2;
                    const dy = position.y - bustHeight / 2;
                    const dw = bustWidth;
                    const dh = bustHeight;
                    this.contents.blt(imageToDraw, sx, sy, sw, sh, dx, dy, dw, dh);
                } catch (error) {
                    console.warn('Error drawing bust image in load listener:', error);
                    // Use fallback on error
                    const sx = 0;
                    const sy = 0;
                    const sw = fallbackBitmap.width;
                    const sh = fallbackBitmap.height;
                    const dx = position.x - bustWidth / 2;
                    const dy = position.y - bustHeight / 2;
                    const dw = bustWidth;
                    const dh = bustHeight;
                    this.contents.blt(fallbackBitmap, sx, sy, sw, sh, dx, dy, dw, dh);
                }
            });
            
            bustBitmap.addErrorListener(() => {
                try {
                    // Use fallback on error
                    const sx = 0;
                    const sy = 0;
                    const sw = fallbackBitmap.width;
                    const sh = fallbackBitmap.height;
                    const dx = position.x - bustWidth / 2;
                    const dy = position.y - bustHeight / 2;
                    const dw = bustWidth;
                    const dh = bustHeight;
                    this.contents.blt(fallbackBitmap, sx, sy, sw, sh, dx, dy, dw, dh);
                } catch (error) {
                    console.warn('Error drawing fallback image in error listener:', error);
                }
            });
        } catch (error) {
            console.warn('Error loading bust image for actor:', actor.actorId(), error);
            // Use fallback image on error
            try {
                const fallbackBitmap = ImageManager.loadBitmap('img/busts/', '7');
                const bustWidth = 100;
                const bustHeight = 100;
                
                fallbackBitmap.addLoadListener(() => {
                    const sx = 0;
                    const sy = 0;
                    const sw = fallbackBitmap.width;
                    const sh = fallbackBitmap.height;
                    const dx = position.x - bustWidth / 2;
                    const dy = position.y - bustHeight / 2;
                    const dw = bustWidth;
                    const dh = bustHeight;
                    this.contents.blt(fallbackBitmap, sx, sy, sw, sh, dx, dy, dw, dh);
                });
                
                if (fallbackBitmap.isReady()) {
                    const sx = 0;
                    const sy = 0;
                    const sw = fallbackBitmap.width;
                    const sh = fallbackBitmap.height;
                    const dx = position.x - bustWidth / 2;
                    const dy = position.y - bustHeight / 2;
                    const dw = bustWidth;
                    const dh = bustHeight;
                    this.contents.blt(fallbackBitmap, sx, sy, sw, sh, dx, dy, dw, dh);
                }
            } catch (fallbackError) {
                console.error('Error loading fallback image:', fallbackError);
            }
        }
    }
    
    // Draw actor name below the bust
    this.changeTextColor('#FFFFFF');
    this.contents.fontSize = 18;
    this.drawText(actor.name(), position.x - 50, position.y + bustHeight / 2 + 5, 100, 'center');
};
Window_PartyDynamics.prototype.drawLegend = function() {
    const x = 10;
    const y = this.contents.height - 140;
    
    this.contents.fontSize = 16;
    this.changeTextColor('#FFFFFF');
    const legendItems = [
        { color: '#00FF00', text: 'Strong Friends (50+)' },
        { color: '#90EE90', text: 'Friends (20+)' },
        { color: '#CCCCCC', text: 'Neutral (-19 to 19)' },
        { color: '#FFA500', text: 'Rivals (-20 to -49)' },
        { color: '#FF0000', text: 'Enemies (-50+)' }
    ];
    
    legendItems.forEach((item, index) => {
        const lineY = y + index * 20;
        const ctx = this.contents._context;
        ctx.save();
        ctx.strokeStyle = item.color;
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(x, lineY + 10);
        ctx.lineTo(x + 30, lineY + 10);
        ctx.stroke();
        ctx.restore();
        
        this.drawText(item.text, x + 40, lineY, 200);
    });
};

// Define the Party Dynamics Scene
function Scene_PartyDynamics() {
    this.initialize(...arguments);
}

Scene_PartyDynamics.prototype = Object.create(Scene_MenuBase.prototype);
Scene_PartyDynamics.prototype.constructor = Scene_PartyDynamics;

Scene_PartyDynamics.prototype.create = function() {
    Scene_MenuBase.prototype.create.call(this);
    this.createDynamicsWindow();
};

Scene_PartyDynamics.prototype.createDynamicsWindow = function() {
    const rect = this.dynamicsWindowRect();
    this._dynamicsWindow = new Window_PartyDynamics(rect);
    this.addWindow(this._dynamicsWindow);
};

Scene_PartyDynamics.prototype.dynamicsWindowRect = function() {
    const ww = Graphics.boxWidth;
    const wh = Graphics.boxHeight - this.calcWindowHeight(1, true);
    const wx = 0;
    const wy = this.calcWindowHeight(1, true);
    return new Rectangle(wx, wy, ww, wh);
};

// Add social event generation
Scene_Thoughts.prototype.generateSocialEvent = function() {
    if ($gameParty.size() < 2) return;
    
    // Only trigger social events occasionally (30% chance)
    if (Math.random() > 0.4) return;
    
    const members = $gameParty.members();
    
    // Determine special event type
    const eventRoll = Math.random();
    
    if (eventRoll < 0.15) {
        // Paranormal events (15%)
        this.generateParanormalEvent(members);
        return;
    } else if (eventRoll < 0.25) {
        // Political/philosophical debates (10%)
        this.generateDebateEvent(members);
        return;
    } else if (eventRoll < 0.35) {
        // Riddles and puzzles (10%)
        this.generateRiddleEvent(members);
        return;
    } else if (eventRoll < 0.45) {
        // Competition events (10%)
        this.generateCompetitionEvent(members);
        return;
    }
    
    // Check if we have exactly 3 party members for alliance events
    if (members.length === 3 && Math.random() < 0.3) {
        // 30% chance for alliance event when there are 3 members
        this.generateAllianceEvent(members);
        return;
    }
    
    // Select two random party members
    const actor1 = members[Math.floor(Math.random() * members.length)];
    let actor2;
    do {
        actor2 = members[Math.floor(Math.random() * members.length)];
    } while (actor2 === actor1);
    
    const relationship = this.getRelationshipValue(actor1.actorId(), actor2.actorId());
    
    // Generate appropriate social event based on current relationship
    let eventType;
    const rand = Math.random();
    
    if (relationship > 30) {
        // Positive events more likely for friends
        eventType = rand < 0.7 ? 'positive' : (rand < 0.9 ? 'neutral' : 'negative');
    } else if (relationship < -30) {
        // Negative events more likely for enemies
        eventType = rand < 0.7 ? 'negative' : (rand < 0.9 ? 'neutral' : 'positive');
    } else {
        // Equal chance for neutral relationships
        eventType = rand < 0.33 ? 'positive' : (rand < 0.66 ? 'neutral' : 'negative');
    }
    
    this.executeSocialEvent(actor1, actor2, eventType);
};

Scene_Thoughts.prototype.getRelationshipValue = function(actorId1, actorId2) {
    const key = actorId1 < actorId2 ? `${actorId1}_${actorId2}` : `${actorId2}_${actorId1}`;
    return $gameSystem._partyRelationships[key] || 0;
};

Scene_Thoughts.prototype.modifyRelationship = function(actorId1, actorId2, amount) {
    const key = actorId1 < actorId2 ? `${actorId1}_${actorId2}` : `${actorId2}_${actorId1}`;
    if ($gameSystem._partyRelationships[key] === undefined) {
        $gameSystem._partyRelationships[key] = 0;
    }
    $gameSystem._partyRelationships[key] = Math.max(-100, Math.min(100, 
        $gameSystem._partyRelationships[key] + amount));
};

Scene_Thoughts.prototype.executeSocialEvent = function(actor1, actor2, eventType) {
    const personality1 = getPersonalityType(actor1);
    const personality2 = getPersonalityType(actor2);
    
    let messages = [];
    let relationshipChange = 0;
    
    if (eventType === 'positive') {
        relationshipChange = Math.floor(Math.random() * 10) + 5;
        messages = this.generatePositiveSocialEvent(actor1, actor2, personality1, personality2);
    } else if (eventType === 'negative') {
        relationshipChange = -(Math.floor(Math.random() * 10) + 5);
        messages = this.generateNegativeSocialEvent(actor1, actor2, personality1, personality2);
    } else {
        relationshipChange = Math.floor(Math.random() * 7) - 3;
        messages = this.generateNeutralSocialEvent(actor1, actor2, personality1, personality2);
    }
    
    // Add icon 34 to distinguish social events
    messages.reverse().forEach(msg => {
        this.addThought(msg.actor, "" + msg.text, msg.type || 'other');
    });
    
    // Update relationship
    this.modifyRelationship(actor1.actorId(), actor2.actorId(), relationshipChange);
};



// Modify the existing generateThoughts function to include social events

// Override update to handle input
Scene_PartyDynamics.prototype.update = function() {
    Scene_MenuBase.prototype.update.call(this);
    
    if (Input.isTriggered('cancel') || Input.isTriggered('ok') || TouchInput.isCancelled()) {
        SoundManager.playCancel();
        this.popScene();
    }
};

// Generate paranormal/supernatural events


// Generate alliance events where two gang up on one
Scene_Thoughts.prototype.generateAllianceEvent = function(members) {
    if (members.length < 3) return; // Need at least 3 members for this event

    // Randomly select the target (the one being ganged up on)
    const target = members[Math.floor(Math.random() * members.length)];
    const allies = members.filter(m => m !== target);
    
    // Check relationships between the allies
    const allyRelationship = this.getRelationshipValue(allies[0].actorId(), allies[1].actorId());
    
    // Determine event type based on relationships
    let eventType;
    if (allyRelationship > 20) {
        // Allies are friends, more likely to team up
        eventType = Math.random() < 0.7 ? 'negative' : 'intervention';
    } else {
        // Allies aren't close, one might defend the target
        eventType = Math.random() < 0.5 ? 'intervention' : 'negative';
    }
    
    const messages = this.generateAllianceEventMessages(allies[0], allies[1], target, eventType);
    
    // Add icon to distinguish social events
    messages.reverse().forEach(msg => {
        this.addThought(msg.actor, "" + msg.text, msg.type || 'other');
    });
    
    // Update relationships based on event type
    if (eventType === 'negative') {
        // Allies bond over ganging up (+5 to +10)
        this.modifyRelationship(allies[0].actorId(), allies[1].actorId(), 
            Math.floor(Math.random() * 6) + 5);
        // Target's relationship with both worsens (-10 to -15)
        this.modifyRelationship(target.actorId(), allies[0].actorId(), 
            -(Math.floor(Math.random() * 6) + 10));
        this.modifyRelationship(target.actorId(), allies[1].actorId(), 
            -(Math.floor(Math.random() * 6) + 10));
    } else {
        // Defender gains respect from target (+10 to +15)
        const defender = allies[1]; // Second ally defends
        this.modifyRelationship(target.actorId(), defender.actorId(), 
            Math.floor(Math.random() * 6) + 10);
        // Aggressor loses respect from both (-5 to -10)
        this.modifyRelationship(allies[0].actorId(), defender.actorId(), 
            -(Math.floor(Math.random() * 6) + 5));
        this.modifyRelationship(target.actorId(), allies[0].actorId(), 
            -(Math.floor(Math.random() * 6) + 5));
    }
};

Scene_Thoughts.prototype.generateParanormalEvent = function(members) {
    // Randomly determine how many party members are involved
    const involvedCount = Math.min(members.length, Math.floor(Math.random() * 2) + 2);
    const involved = [];
    const membersCopy = [...members];
    
    for (let i = 0; i < involvedCount; i++) {
        const index = Math.floor(Math.random() * membersCopy.length);
        involved.push(membersCopy.splice(index, 1)[0]);
    }
    
    const eventType = Math.random() < 0.5 ? 'shared' : 'divided';
    const messages = this.generateParanormalEventMessages(involved, eventType);
    
    // Add icon 34 to distinguish social events
    messages.reverse().forEach(msg => {
        this.addThought(msg.actor, "" + msg.text, msg.type || 'other');
    });
    
    // Update relationships based on how they react
    if (eventType === 'shared') {
        // Shared supernatural experience bonds them
        for (let i = 0; i < involved.length; i++) {
            for (let j = i + 1; j < involved.length; j++) {
                this.modifyRelationship(involved[i].actorId(), involved[j].actorId(), 
                    Math.floor(Math.random() * 8) + 7);
            }
        }
    } else {
        // Divided reactions can strain relationships
        if (involved.length >= 2) {
            this.modifyRelationship(involved[0].actorId(), involved[1].actorId(), 
                -(Math.floor(Math.random() * 8) + 3));
        }
    }
};
/*****************************************/
// Thoughts database

Scene_Thoughts.prototype.generateParanormalEventMessages = function(involved, eventType) {
    const useTranslation = ConfigManager.language === 'it';

    if (eventType === 'shared') {
        const sharedEvents = [
            // Shared vision
            [
                { actor: involved[0], text: useTranslation ? `Avete... l'avete visto tutti?` : `Did... did you all just see that?` },
                { actor: involved[1], text: useTranslation ? `La figura nella nebbia? Sì...` : `The figure in the mist? Yes...` },
                { actor: involved[0], text: useTranslation ? `Sembrava qualcuno che conoscevo. Qualcuno morto da anni.` : `It looked like someone I knew. Someone who's been dead for years.` },
                { actor: involved[1], text: useTranslation ? `Anche per me... ma una persona diversa. Com'è possibile?` : `For me too... but a different person. How is that possible?` },
                involved[2] && { actor: involved[2], text: useTranslation ? `Abbiamo visto tutti i nostri fantasmi... Questo posto è maledetto.` : `We all saw our own ghosts... This place is cursed.` }
            ].filter(Boolean),
            
            // Time anomaly
            [
                { actor: involved[1], text: useTranslation ? `Aspettate... non era appena mezzogiorno?` : `Wait... wasn't it just noon?` },
                { actor: involved[0], text: useTranslation ? `Il sole sta tramontando... ma abbiamo camminato solo per pochi minuti!` : `The sun's setting... but we've only been walking for minutes!` },
                { actor: involved[1], text: useTranslation ? `Il mio orologio da tasca dice che sono passate sei ore...` : `My pocket watch says it's been six hours...` },
                { actor: involved[0], text: useTranslation ? `Non può essere reale. Il tempo non può semplicemente... saltare.` : `This can't be real. Time doesn't just... skip.` },
                involved[2] && { actor: involved[2], text: useTranslation ? `Guardate le nostre razioni. Sono parzialmente consumate. Abbiamo perso del tempo.` : `Look at our rations. They're partially eaten. We lost time.` }
            ].filter(Boolean),
            
            // Collective nightmare
            [
                { actor: involved[0], text: useTranslation ? `*ansima risvegliandosi* Quel sogno...!` : `*gasps awake* That dream...!` },
                { actor: involved[1], text: useTranslation ? `Quello con il corridoio infinito e le porte?` : `The one with the endless corridor and the doors?` },
                { actor: involved[0], text: useTranslation ? `C'eri anche tu! C'eravamo tutti!` : `You were there! We were all there!` },
                { actor: involved[1], text: useTranslation ? `Come possiamo condividere lo stesso sogno?` : `How can we share the same dream?` },
                involved[2] && { actor: involved[2], text: useTranslation ? `La cosa dietro l'ultima porta... non dobbiamo aprirla mai.` : `The thing behind the last door... we can never open it.` }
            ].filter(Boolean),
            
            // Supernatural cold
            [
                { actor: involved[1], text: useTranslation ? `Perché fa così freddo all'improvviso?` : `Why is it suddenly so cold?` },
                { actor: involved[0], text: useTranslation ? `Guardate... il nostro fiato è visibile. Con questo caldo?` : `Look... our breath is visible. In this heat?` },
                { actor: involved[1], text: useTranslation ? `Le piante intorno a noi si stanno coprendo di brina...` : `The plants around us are frosting over...` },
                { actor: involved[0], text: useTranslation ? `Qualcosa di innaturale è qui con noi.` : `Something unnatural is here with us.` },
                involved[2] && { actor: involved[2], text: useTranslation ? `State vicini. Qualunque cosa sia, ci sta girando intorno.` : `Stay close. Whatever it is, it's circling us.` }
            ].filter(Boolean),
            
            // Doppelgangers
            [
                { actor: involved[0], text: useTranslation ? `${involved[1].name()}... perché ci sono due di te?` : `${involved[1].name()}... why are there two of you?` },
                { actor: involved[1], text: useTranslation ? `Cosa? No, TU hai un doppio in piedi dietro di te!` : `What? No, YOU have a double standing behind you!` },
                { actor: involved[0], text: useTranslation ? `Stanno copiando i nostri movimenti alla perfezione...` : `They're copying our movements exactly...` },
                { actor: involved[1], text: useTranslation ? `Ma i loro occhi... completamente neri.` : `But their eyes... completely black.` },
                involved[2] && { actor: involved[2], text: useTranslation ? `Non lasciate che vi tocchino! Si stanno allungando—` : `Don't let them touch you! They're reaching—` }
            ].filter(Boolean),
            
            // Prophetic whispers
            [
                { actor: involved[1], text: useTranslation ? `Sentite anche voi quel sussurro?` : `Do you hear that whispering?` },
                { actor: involved[0], text: useTranslation ? `Mi sta dicendo delle cose... sul domani.` : `It's telling me things... about tomorrow.` },
                { actor: involved[1], text: useTranslation ? `Il mio mi avverte di un tradimento...` : `Mine's warning about a betrayal...` },
                { actor: involved[0], text: useTranslation ? `Queste voci sanno cose che non dovrebbero sapere.` : `These voices know things they shouldn't know.` },
                involved[2] && { actor: involved[2], text: useTranslation ? `Ora parlano all'unisono. Riuscite a capirle?` : `They're speaking in unison now. Can you understand them?` }
            ].filter(Boolean),
            
            // Memory swap
            [
                { actor: involved[0], text: useTranslation ? `Mi è appena venuto in mente un tuo ricordo d'infanzia...` : `I just remembered your childhood memory...` },
                { actor: involved[1], text: useTranslation ? `E io ricordo il tuo! Il giorno in cui il tuo villaggio è bruciato...` : `And I can recall yours! The day your village burned...` },
                { actor: involved[0], text: useTranslation ? `Questo è sbagliato. I nostri ricordi si stanno mescolando!` : `This is wrong. Our memories are mixing together!` },
                { actor: involved[1], text: useTranslation ? `Posso sentire le tue emozioni di quel giorno...` : `I can feel your emotions from that day...` },
                involved[2] && { actor: involved[2], text: useTranslation ? `Presto, concentratevi su chi siete! Non perdete voi stessi!` : `Quick, focus on who you are! Don't lose yourself!` }
            ].filter(Boolean),
            
            // Shadow realm glimpse
            [
                { actor: involved[1], text: useTranslation ? `Le ombre... si muovono in modo strano.` : `The shadows... they're moving wrong.` },
                { actor: involved[0], text: useTranslation ? `Guardate più da vicino. Ci sono cose che vivono al loro interno!` : `Look closer. There are things living in them!` },
                { actor: involved[1], text: useTranslation ? `Ci stanno osservando. Centinaia di occhi...` : `They're watching us. Hundreds of eyes...` },
                { actor: involved[0], text: useTranslation ? `Non fissatele troppo a lungo. Stanno iniziando ad accorgersi che le stiamo guardando.` : `Don't stare too long. They're starting to notice us noticing them.` },
                involved[2] && { actor: involved[2], text: useTranslation ? `Una di loro ha appena sorriso. Le ombre non sorridono!` : `One of them just smiled. Shadows don't smile!` }
            ].filter(Boolean),
            
            // Gravity distortion
            [
                { actor: involved[0], text: useTranslation ? `Perché sta fluttuando tutto?!` : `Why is everything floating?!` },
                { actor: involved[1], text: useTranslation ? `La gravità sta venendo meno! Aggrappatevi a qualcosa!` : `Gravity's failing! Hold onto something!` },
                { actor: involved[0], text: useTranslation ? `I miei piedi non toccano terra!` : `My feet won't touch the ground!` },
                { actor: involved[1], text: useTranslation ? `Guardate gli alberi - si stanno piegando verso l'alto!` : `Look at the trees - they're bending upward!` },
                involved[2] && { actor: involved[2], text: useTranslation ? `Ci sta trascinando verso... che COSA è quello nel cielo?` : `It's pulling us toward... what IS that in the sky?` }
            ].filter(Boolean),
            
            // Entity communication
            [
                { actor: involved[1], text: useTranslation ? `Qualcosa ha appena... parlato direttamente nella mia mente.` : `Something just... spoke directly into my mind.` },
                { actor: involved[0], text: useTranslation ? `Anche tu? Vuole qualcosa da noi.` : `You too? It wants something from us.` },
                { actor: involved[1], text: useTranslation ? `Mi sta mostrando dei simboli. Antichi.` : `It's showing me symbols. Ancient ones.` },
                { actor: involved[0], text: useTranslation ? `Non fidatevi. Questi esseri non danno mai senza prendere.` : `Don't trust it. These beings never give without taking.` },
                involved[2] && { actor: involved[2], text: useTranslation ? `Conosce i nostri nomi. I nostri VERI nomi.` : `It knows our names. Our TRUE names.` }
            ].filter(Boolean)
        ];
        
        return sharedEvents[Math.floor(Math.random() * sharedEvents.length)];
    } else {
        // Divided experiences where party members react differently
        const dividedEvents = [
            // One sees, others don't
            [
                { actor: involved[0], text: useTranslation ? `C'è qualcuno proprio dietro di te!` : `There's someone standing right behind you!` },
                { actor: involved[1], text: useTranslation ? `Cosa? Non c'è nessuno. Ti senti bene?` : `What? There's nobody there. Are you feeling alright?` },
                { actor: involved[0], text: useTranslation ? `È PROPRIO LÌ! Come fate a non vederlo?!` : `They're RIGHT THERE! How can you not see them?!` },
                { actor: involved[1], text: useTranslation ? `${involved[0].name()}, mi stai spaventando. Non c'è niente lì.` : `${involved[0].name()}, you're scaring me. There's nothing there.` },
                involved[2] && { actor: involved[2], text: useTranslation ? `Forse dovremmo riposare. La stanchezza può causare allucinazioni.` : `Maybe we should rest. Exhaustion can cause hallucinations.` }
            ].filter(Boolean),
            
            // Possession suspicion
            [
                { actor: involved[1], text: useTranslation ? `I tuoi occhi hanno lampeggiato di rosso per un secondo...` : `Your eyes just flashed red for a second...` },
                { actor: involved[0], text: useTranslation ? `Cosa? Non essere ridicolo.` : `What? Don't be ridiculous.` },
                { actor: involved[1], text: useTranslation ? `So cosa ho visto! C'è qualcosa che non va in te!` : `I know what I saw! Something's wrong with you!` },
                { actor: involved[0], text: useTranslation ? `Sei paranoico. Sto bene.` : `You're being paranoid. I'm fine.` },
                involved[2] && { actor: involved[2], text: useTranslation ? `${involved[0].name()} si sta comportando in modo strano ultimamente...` : `${involved[0].name()} has been acting strange lately...` }
            ].filter(Boolean),
            
            // Different realities
            [
                { actor: involved[0], text: useTranslation ? `Quando abbiamo attraversato quel ponte?` : `When did we cross that bridge?` },
                { actor: involved[1], text: useTranslation ? `Quale ponte? Siamo stati nella foresta per tutto il tempo.` : `What bridge? We've been in forest the whole time.` },
                { actor: involved[0], text: useTranslation ? `Il ponte di pietra! Abbiamo appena... aspetta, dov'è?` : `The stone bridge! We just... wait, where is it?` },
                { actor: involved[1], text: useTranslation ? `Ti senti male? Non c'è mai stato un ponte.` : `Are you feeling sick? There was never a bridge.` },
                involved[2] && { actor: involved[2], text: useTranslation ? `Ricordo un fiume, ma nessun ponte...` : `I remember a river, but no bridge...` }
            ].filter(Boolean),
            
            // Supernatural mark
            [
                { actor: involved[1], text: useTranslation ? `Cos'è quel simbolo sulla tua mano?!` : `What's that symbol on your hand?!` },
                { actor: involved[0], text: useTranslation ? `Quale simbolo? La mia mano è normale.` : `What symbol? My hand is normal.` },
                { actor: involved[1], text: useTranslation ? `Sta brillando! Una specie di runa!` : `It's glowing! Some kind of rune!` },
                { actor: involved[0], text: useTranslation ? `Stai vedendo cose. Guarda - non c'è niente.` : `You're seeing things. Look - nothing there.` },
                involved[2] && { actor: involved[2], text: useTranslation ? `Io... riesco a vederlo anch'io. Ma solo con la coda dell'occhio.` : `I... I can see it too. But only from the corner of my eye.` }
            ].filter(Boolean),
            
            // Voice mimicry
            [
                { actor: involved[0], text: useTranslation ? `Perché hai appena chiamato il mio nome da laggiù?` : `Why did you just call my name from over there?` },
                { actor: involved[1], text: useTranslation ? `Non ho detto niente. Sono stato in silenzio.` : `I didn't say anything. I've been silent.` },
                { actor: involved[0], text: useTranslation ? `Ho sentito la tua voce chiaramente! Dagli alberi!` : `I heard your voice clearly! From the trees!` },
                { actor: involved[1], text: useTranslation ? `Non ero io... Qualcosa ci sta imitando.` : `That wasn't me... Something's mimicking us.` },
                involved[2] && { actor: involved[2], text: useTranslation ? `Ho appena sentito la MIA voce da dietro quelle rocce...` : `I just heard MY voice from behind those rocks...` }
            ].filter(Boolean),
            
            // Reality anchor
            [
                { actor: involved[1], text: useTranslation ? `Tutto sembra... sbagliato. Distorto.` : `Everything looks... wrong. Distorted.` },
                { actor: involved[0], text: useTranslation ? `Cosa vuoi dire? È tutto normale.` : `What do you mean? Everything's normal.` },
                { actor: involved[1], text: useTranslation ? `I colori sono invertiti! Il cielo è verde!` : `The colors are inverted! The sky is green!` },
                { actor: involved[0], text: useTranslation ? `Il cielo è blu, come sempre. Che ti prende?` : `The sky is blue, like always. What's wrong with you?` },
                involved[2] && { actor: involved[2], text: useTranslation ? `Aspettate... vedo degli sfarfallii. La realtà continua a mutare.` : `Wait... I see flickers. Reality keeps shifting.` }
            ].filter(Boolean),
            
            // Mind reading
            [
                { actor: involved[0], text: useTranslation ? `Riesco a sentire i tuoi pensieri...` : `I can hear your thoughts...` },
                { actor: involved[1], text: useTranslation ? `È impossibile. Smettila di cercare di spaventarmi.` : `That's impossible. Stop trying to freak me out.` },
                { actor: involved[0], text: useTranslation ? `Stai pensando a tua sorella. Il suo nome è...` : `You're thinking about your sister. Her name is...` },
                { actor: involved[1], text: useTranslation ? `NO! Fuori dalla mia testa! Come fai a saperlo?!` : `NO! Stay out of my head! How do you know that?!` },
                involved[2] && { actor: involved[2], text: useTranslation ? `Lo sento anch'io... le nostre menti si stanno fondendo.` : `I feel it too... our minds are bleeding together.` }
            ].filter(Boolean),
            
            // Temporal echo
            [
                { actor: involved[1], text: useTranslation ? `Non abbiamo appena avuto questa stessa conversazione?` : `Didn't we just have this exact conversation?` },
                { actor: involved[0], text: useTranslation ? `Cosa? No, è la prima volta che parliamo oggi.` : `What? No, this is the first time we've talked today.` },
                { actor: involved[1], text: useTranslation ? `No! Hai detto quelle esatte parole! Ci stiamo ripetendo!` : `No! You said those exact words! We're repeating!` },
                { actor: involved[0], text: useTranslation ? `Non hai senso. Stai bene?` : `You're not making sense. Are you alright?` },
                involved[2] && { actor: involved[2], text: useTranslation ? `Io... ho uno stranissimo déjà vu in questo momento.` : `I... I have the strangest déjà vu right now.` }
            ].filter(Boolean),
            
            // Cursed knowledge
            [
                { actor: involved[0], text: useTranslation ? `Improvvisamente so delle cose... cose terribili su questo posto.` : `I suddenly know things... terrible things about this place.` },
                { actor: involved[1], text: useTranslation ? `Che tipo di cose?` : `What kind of things?` },
                { actor: involved[0], text: useTranslation ? `Il massacro. I rituali. È tutto nella mia testa ora!` : `The massacre. The rituals. It's all in my head now!` },
                { actor: involved[1], text: useTranslation ? `Stai dicendo sciocchezze. Questa è solo una foresta normale.` : `You're talking nonsense. This is just a normal forest.` },
                involved[2] && { actor: involved[2], text: useTranslation ? `Non ascoltare la conoscenza. Ha un prezzo.` : `Don't listen to the knowledge. It comes with a price.` }
            ].filter(Boolean),
            
            // False memories
            [
                { actor: involved[1], text: useTranslation ? `Ricordi quando abbiamo combattuto quel demone insieme?` : `Remember when we fought that demon together?` },
                { actor: involved[0], text: useTranslation ? `Non abbiamo mai combattuto un demone. Di cosa stai parlando?` : `We've never fought a demon. What are you talking about?` },
                { actor: involved[1], text: useTranslation ? `Il mese scorso! Mi hai salvato la vita! Come puoi dimenticarlo?` : `Last month! You saved my life! How can you forget?` },
                { actor: involved[0], text: useTranslation ? `Non è mai successo. I tuoi ricordi sono falsi.` : `That never happened. Your memories are false.` },
                involved[2] && { actor: involved[2], text: useTranslation ? `Io... lo ricordo anch'io. Ma anche no. Mi fa male la testa.` : `I... I remember it too. But also don't. My head hurts.` }
            ].filter(Boolean)
        ];
        
        return dividedEvents[Math.floor(Math.random() * dividedEvents.length)];
    }
};

// Generate political/philosophical debate events
Scene_Thoughts.prototype.generateDebateEvent = function(members) {
    const useTranslation = ConfigManager.language === 'it';
    // Select 2-3 random participants
    const participantCount = Math.min(members.length, Math.floor(Math.random() * 2) + 2);
    const participants = [];
    const membersCopy = [...members];
    
    for (let i = 0; i < participantCount; i++) {
        const index = Math.floor(Math.random() * membersCopy.length);
        participants.push(membersCopy.splice(index, 1)[0]);
    }
    
    const debateType = ['political', 'philosophical', 'ethical'][Math.floor(Math.random() * 3)];
    const messages = this.generateDebateMessages(participants, debateType);
    
    messages.messages.reverse().forEach(msg => {
        this.addThought(msg.actor, "" + msg.text, msg.type || 'other');
    });
    
    // Relationship changes based on agreement/disagreement
    if (messages.agreement) {
        for (let i = 0; i < participants.length - 1; i++) {
            this.modifyRelationship(participants[i].actorId(), participants[i + 1].actorId(), 
                Math.floor(Math.random() * 6) + 3);
        }
    } else {
        for (let i = 0; i < participants.length - 1; i++) {
            this.modifyRelationship(participants[i].actorId(), participants[i + 1].actorId(), 
                -(Math.floor(Math.random() * 6) + 2));
        }
    }
};

Scene_Thoughts.prototype.generateDebateMessages = function(participants, debateType) {
    const useTranslation = ConfigManager.language === 'it';
    const debates = {
        political: [
            // Monarchy vs Democracy
            {
                messages: [
                    { actor: participants[0], text: useTranslation ? `Il regno ha bisogno di un sovrano forte. La democrazia è caos.` : `The kingdom needs a strong ruler. Democracy is chaos.` },
                    { actor: participants[1], text: useTranslation ? `Una persona sola non dovrebbe avere tutto quel potere. Il popolo merita di avere voce!` : `One person shouldn't have all that power. People deserve a voice!` },
                    { actor: participants[0], text: useTranslation ? `Le masse sono facilmente influenzabili. Hanno bisogno di una guida.` : `The masses are easily swayed. They need guidance.` },
                    { actor: participants[1], text: useTranslation ? `È esattamente quello che dicono i tiranni per giustificare l'oppressione!` : `That's exactly what tyrants say to justify oppression!` },
                    participants[2] && { actor: participants[2], text: useTranslation ? `Forse c'è del buono in entrambi i sistemi. L'equilibrio è la chiave.` : `Maybe there's merit to both systems. Balance is key.` }
                ].filter(Boolean),
                agreement: false
            },
            // Revolution vs Reform
            {
                messages: [
                    { actor: participants[1], text: useTranslation ? `Il sistema è corrotto. Abbiamo bisogno di una rivoluzione completa!` : `The system is broken. We need complete revolution!` },
                    { actor: participants[0], text: useTranslation ? `Il cambiamento dall'interno è più sicuro. La rivoluzione porta spargimenti di sangue.` : `Change from within is safer. Revolution brings bloodshed.` },
                    { actor: participants[1], text: useTranslation ? `A volte il sangue è il prezzo della libertà!` : `Sometimes blood is the price of freedom!` },
                    { actor: participants[0], text: useTranslation ? `Parla come uno che non ha mai visto la guerra...` : `Spoken like someone who's never seen war...` },
                    participants[2] && { actor: participants[2], text: useTranslation ? `La storia dimostra che entrambe le vie possono funzionare... o fallire miseramente.` : `History shows both paths can work... or fail spectacularly.` }
                ].filter(Boolean),
                agreement: false
            },
            // Noble privilege
            {
                messages: [
                    { actor: participants[0], text: useTranslation ? `Perché i nobili dovrebbero vivere nel lusso mentre i contadini muoiono di fame?` : `Why should nobles live in luxury while peasants starve?` },
                    { actor: participants[1], text: useTranslation ? `Forniscono protezione e governo. Se lo sono guadagnato.` : `They provide protection and governance. It's earned.` },
                    { actor: participants[0], text: useTranslation ? `Guadagnato? Ci sono nati!` : `Earned? They were born into it!` },
                    { actor: participants[1], text: useTranslation ? `E portano il fardello della responsabilità fin dalla nascita.` : `And carry the burden of responsibility from birth.` },
                    participants[2] && { actor: participants[2], text: useTranslation ? `La vera domanda è: il sistema serve il popolo?` : `The real question is: does the system serve the people?` }
                ].filter(Boolean),
                agreement: false
            }
        ],
        philosophical: [
            // Free will debate
            {
                messages: [
                    { actor: participants[1], text: useTranslation ? `Abbiamo davvero il libero arbitrio, o è tutto predeterminato?` : `Do we truly have free will, or is everything predetermined?` },
                    { actor: participants[0], text: useTranslation ? `Facciamo scelte ogni giorno. Certo che abbiamo il libero arbitrio!` : `We make choices every day. Of course we have free will!` },
                    { actor: participants[1], text: useTranslation ? `Ma quelle scelte potrebbero essere illusioni, predeterminate dalla causalità.` : `But those choices might be illusions, predetermined by causality.` },
                    { actor: participants[0], text: useTranslation ? `È un modo deprimente di vedere l'esistenza.` : `That's a depressing way to view existence.` },
                    participants[2] && { actor: participants[2], text: useTranslation ? `Forse il libero arbitrio esiste entro certi limiti. Limitato, ma reale.` : `Perhaps free will exists within constraints. Limited, but real.` }
                ].filter(Boolean),
                agreement: false
            },
            // Nature of good and evil
            {
                messages: [
                    { actor: participants[0], text: useTranslation ? `Credo che le persone siano intrinsecamente buone.` : `I believe people are inherently good.` },
                    { actor: participants[1], text: useTranslation ? `Allora perché c'è così tanto male nel mondo?` : `Then why is there so much evil in the world?` },
                    { actor: participants[0], text: useTranslation ? `Le circostanze corrompono. Data la possibilità, le persone scelgono il bene.` : `Circumstances corrupt. Given the chance, people choose good.` },
                    { actor: participants[1], text: useTranslation ? `Ne ho viste troppe per credere a quella favola.` : `I've seen too much to believe that fairy tale.` },
                    participants[2] && { actor: participants[2], text: useTranslation ? `Forse il bene e il male sono solo concetti che abbiamo creato noi.` : `Maybe good and evil are just concepts we created.` }
                ].filter(Boolean),
                agreement: false
            },
            // Meaning of life
            {
                messages: [
                    { actor: participants[1], text: useTranslation ? `Qual è il senso di tutto questo? Perché lottiamo?` : `What's the point of all this? Why do we struggle?` },
                    { actor: participants[0], text: useTranslation ? `Per crescere, per amare, per lasciare il mondo un posto migliore.` : `To grow, to love, to leave the world better.` },
                    { actor: participants[1], text: useTranslation ? `Ma moriamo tutti. Tutto ciò che facciamo diventa polvere.` : `But we all die. Everything we do turns to dust.` },
                    { actor: participants[0], text: useTranslation ? `Il viaggio è più importante della destinazione.` : `The journey matters more than the destination.` },
                    participants[2] && { actor: participants[2], text: useTranslation ? `Creiamo noi stessi il nostro significato. Questa è la bellezza della coscienza.` : `We create our own meaning. That's the beauty of consciousness.` }
                ].filter(Boolean),
                agreement: true
            }
        ],
        ethical: [
            // Ends justify means
            {
                messages: [
                    { actor: participants[0], text: useTranslation ? `È mai giusto compiere il male per un bene superiore?` : `Is it ever right to do evil for the greater good?` },
                    { actor: participants[1], text: useTranslation ? `Assolutamente. A volte bisogna fare scelte difficili.` : `Absolutely. Sometimes hard choices must be made.` },
                    { actor: participants[0], text: useTranslation ? `Ma chi decide qual è il 'bene superiore'?` : `But who decides what the 'greater good' is?` },
                    { actor: participants[1], text: useTranslation ? `Coloro che hanno il coraggio di agire quando gli altri non lo fanno.` : `Those with the courage to act when others won't.` },
                    participants[2] && { actor: participants[2], text: useTranslation ? `È un sentiero pericoloso. L'eroe di oggi è il cattivo di domani.` : `That's a dangerous path. Today's hero is tomorrow's villain.` }
                ].filter(Boolean),
                agreement: false
            },
            // Duty vs Personal desire
            {
                messages: [
                    { actor: participants[1], text: useTranslation ? `Dovremmo sempre anteporre il dovere alla felicità personale?` : `Should we always put duty before personal happiness?` },
                    { actor: participants[0], text: useTranslation ? `Il dovere dà un senso alla vita. Le ricerche egoistiche sono vuote.` : `Duty gives life meaning. Selfish pursuits are empty.` },
                    { actor: participants[1], text: useTranslation ? `Ma una vita senza gioia non è affatto una vita!` : `But a life without joy is no life at all!` },
                    { actor: participants[0], text: useTranslation ? `La gioia deriva dall'adempiere al proprio scopo.` : `Joy comes from fulfilling one's purpose.` },
                    participants[2] && { actor: participants[2], text: useTranslation ? `Equilibrio. Abbiamo bisogno sia del dovere che della realizzazione personale.` : `Balance. We need both duty and personal fulfillment.` }
                ].filter(Boolean),
                agreement: false
            }
        ]
    };
    
    const selectedDebates = debates[debateType];
    return selectedDebates[Math.floor(Math.random() * selectedDebates.length)];
};

// Generate riddle/puzzle events
Scene_Thoughts.prototype.generateRiddleEvent = function(members) {
    const useTranslation = ConfigManager.language === 'it';
    const riddler = members[Math.floor(Math.random() * members.length)];
    const others = members.filter(m => m !== riddler);
    
    const riddleData = this.selectRiddle();
    const messages = [];
    
    // Riddler poses the riddle
    const riddlePrompt = useTranslation ? `Ecco un indovinello per voi: ${riddleData.riddle}` : `Here's a riddle for you: ${riddleData.riddle}`;
    messages.push({ actor: riddler, text: riddlePrompt });
    
    // Others attempt to solve
    const solver = others[Math.floor(Math.random() * others.length)];
    const success = Math.random() < 0.6; // 60% chance to solve
    
    if (success) {
        messages.push({ actor: solver, text: useTranslation ? `Mmm... È forse ${riddleData.answer}?` : `Hmm... Is it ${riddleData.answer}?` });
        messages.push({ actor: riddler, text: useTranslation ? `Esatto! Ben fatto!` : `Exactly right! Well done!` });
        if (others.length > 1) {
            messages.push({ actor: others.find(o => o !== solver), text: useTranslation ? `Impressionante! Ci stavo ancora pensando.` : `Impressive! I was still thinking about it.` });
        }
        
        // Successful riddle solving improves relationships
        this.modifyRelationship(riddler.actorId(), solver.actorId(), 
            Math.floor(Math.random() * 5) + 5);
    } else {
        messages.push({ actor: solver, text: useTranslation ? `È... ${riddleData.wrongAnswers[Math.floor(Math.random() * riddleData.wrongAnswers.length)]}?` : `Is it... ${riddleData.wrongAnswers[Math.floor(Math.random() * riddleData.wrongAnswers.length)]}?` });
        messages.push({ actor: riddler, text: useTranslation ? `Non proprio. Vuoi riprovare?` : `Not quite. Want another guess?` });
        if (others.length > 1) {
            const other = others.find(o => o !== solver);
            messages.push({ actor: other, text: useTranslation ? `Aspetta, credo di saperlo! È ${riddleData.answer}?` : `Wait, I think I know! Is it ${riddleData.answer}?` });
            messages.push({ actor: riddler, text: useTranslation ? `Sì! Ottimo lavoro, ${other.name()}!` : `Yes! Nice work, ${other.name()}!` });
            
            // Mixed feelings - solver loses some respect
            this.modifyRelationship(solver.actorId(), other.actorId(), 
                -(Math.floor(Math.random() * 3) + 2));
        } else {
            messages.push({ actor: solver, text: useTranslation ? `Mi arrendo. Qual è la risposta?` : `I give up. What's the answer?` });
            messages.push({ actor: riddler, text: useTranslation ? `È ${riddleData.answer}. Più fortuna la prossima volta!` : `It's ${riddleData.answer}. Better luck next time!` });
        }
    }
    
    messages.reverse().forEach(msg => {
        this.addThought(msg.actor, "" + msg.text, msg.type || 'other');
    });
};

Scene_Thoughts.prototype.selectRiddle = function() {
    const useTranslation = ConfigManager.language === 'it';
    const riddles = [
        {
            riddle: useTranslation ? "Ho le mani, ma non posso applaudire. Cosa sono?" : "What has hands but cannot clap?",
            answer: useTranslation ? "un orologio" : "a clock",
            wrongAnswers: useTranslation ? ["una statua", "un albero", "un'ombra"] : ["a statue", "a tree", "a shadow"]
        },
        {
            riddle: useTranslation ? "Parlo senza bocca e sento senza orecchie. Cosa sono?" : "I speak without a mouth and hear without ears. What am I?",
            answer: useTranslation ? "un'eco" : "an echo",
            wrongAnswers: useTranslation ? ["il vento", "un fantasma", "un pensiero"] : ["the wind", "a ghost", "a thought"]
        },
        {
            riddle: useTranslation ? "Più ne fai, più ne lasci dietro. Cosa sono?" : "The more you take, the more you leave behind. What am I?",
            answer: useTranslation ? "i passi" : "footsteps",
            wrongAnswers: useTranslation ? ["il tempo", "il respiro", "i ricordi"] : ["time", "breath", "memories"]
        },
        {
            riddle: useTranslation ? "Cosa può viaggiare per il mondo rimanendo in un angolo?" : "What can travel around the world while staying in a corner?",
            answer: useTranslation ? "un francobollo" : "a stamp",
            wrongAnswers: useTranslation ? ["un ragno", "la polvere", "un'ombra"] : ["a spider", "dust", "a shadow"]
        },
        {
            riddle: useTranslation ? "Ho città, ma non case. Ho montagne, ma non alberi. Cosa sono?" : "I have cities, but no houses. I have mountains, but no trees. What am I?",
            answer: useTranslation ? "una mappa" : "a map",
            wrongAnswers: useTranslation ? ["un sogno", "un dipinto", "un deserto"] : ["a dream", "a painting", "a desert"]
        },
        {
            riddle: useTranslation ? "Cosa si bagna mentre asciuga?" : "What gets wet while drying?",
            answer: useTranslation ? "un asciugamano" : "a towel",
            wrongAnswers: useTranslation ? ["la pioggia", "il sole", "una spugna"] : ["rain", "the sun", "a sponge"]
        },
        {
            riddle: useTranslation ? "Cosa può riempire una stanza senza occupare spazio?" : "What can fill a room but takes up no space?",
            answer: useTranslation ? "la luce" : "light",
            wrongAnswers: useTranslation ? ["l'aria", "il suono", "il buio"] : ["air", "sound", "darkness"]
        },
        {
            riddle: useTranslation ? "Non sono vivo, ma cresco; non ho polmoni, ma ho bisogno d'aria. Cosa sono?" : "I am not alive, but I grow; I don't have lungs, but I need air. What am I?",
            answer: useTranslation ? "il fuoco" : "fire",
            wrongAnswers: useTranslation ? ["una pianta", "la ruggine", "un cristallo"] : ["a plant", "rust", "a crystal"]
        }
    ];
    
    return riddles[Math.floor(Math.random() * riddles.length)];
};

// Generate competition events
Scene_Thoughts.prototype.generateCompetitionEvent = function(members) {
    if (members.length < 2) return;
    
    const competitors = [];
    const membersCopy = [...members];
    
    // Select 2-3 competitors
    const competitorCount = Math.min(membersCopy.length, Math.floor(Math.random() * 2) + 2);
    for (let i = 0; i < competitorCount; i++) {
        const index = Math.floor(Math.random() * membersCopy.length);
        competitors.push(membersCopy.splice(index, 1)[0]);
    }
    
    const competitionType = this.selectCompetition();
    const messages = this.generateCompetitionMessages(competitors, competitionType);
    
    messages.reverse().forEach(msg => {
        this.addThought(msg.actor, "" + msg.text, msg.type || 'other');
    });
};

Scene_Thoughts.prototype.selectCompetition = function() {
    const competitions = [
        'arm_wrestling', 'storytelling', 'cooking', 'hunting', 
        'singing', 'drinking', 'meditation', 'speed', 'accuracy'
    ];
    return competitions[Math.floor(Math.random() * competitions.length)];
};



Scene_Thoughts.prototype.generateThoughts = function() {
    const currentPartyState = this.getCurrentPartyState();
    this.comparePartyStates(currentPartyState, $lastPartyState);
    
    // Check for map changes
    if ($gameMap.mapId() !== $lastPartyState.lastMap) {
        this.generateMapThoughts();
        $lastPartyState.lastMap = $gameMap.mapId();
    }
    
    // Check for money changes
    if ($lastPartyState.moneyChange) {
        this.generateMoneyThoughts($lastPartyState.moneyChange);
        $lastPartyState.moneyChange = 0;
    }
    
    // Check for new items
    this.generateItemThoughts();
    
    // Check for recent monster encounters
    this.generateMonsterThoughts();
    
    // Generate weather thoughts
    this.generateWeatherThoughts();
    
    
// Generate time thoughts
    this.generateTimeThoughts();


// Generate food/hunger thoughts
    this.generateFoodThoughts();


// Generate sleep/fatigue thoughts
    this.generateSleepThoughts();
    
    
    // Generate random thoughts
    this.generateRandomThoughts();
    
    $lastPartyState = currentPartyState;
    this._thoughtsWindow.refresh();
};
const _Scene_Thoughts_generateThoughts = Scene_Thoughts.prototype.generateThoughts;
Scene_Thoughts.prototype.generateThoughts = function() {
    _Scene_Thoughts_generateThoughts.call(this);
    
    // Add social event generation
    this.generateSocialEvent();
};
Scene_Thoughts.prototype.getCurrentPartyState = function() {
    const state = {
        size: $gameParty.size(),
        members: $gameParty.members().map(actor => actor.actorId()),
        hp: {},
        mp: {},
        tp: {},
        equips: {},
        money: $gameParty.gold(),
        items: {},
        weapons: {},
        armors: {},
        lastMap: $gameMap.mapId(),
        recentMonsters: $recentMonsters.slice(),
        hungerLevels: Object.assign({}, $lastPartyState.hungerLevels || {}),
        fatigueLevels: Object.assign({}, $lastPartyState.fatigueLevels || {}),
        lastEquipComments: Object.assign({}, $lastPartyState.lastEquipComments || {})
    };
    
    $gameParty.members().forEach(actor => {
        state.hp[actor.actorId()] = actor.hp;
        state.mp[actor.actorId()] = actor.mp;
        state.tp[actor.actorId()] = actor.tp;
        state.equips[actor.actorId()] = actor.equips().map(item => item ? item.id : 0);
    });
    
    // Track items
    state.items = $gameParty.allItems().reduce((acc, item) => {
        if (DataManager.isItem(item)) {
            acc[item.id] = $gameParty.numItems(item);
        }
        return acc;
    }, {});
    
    // Track weapons
    state.weapons = $gameParty.weapons().reduce((acc, item) => {
        acc[item.id] = $gameParty.numItems(item);
        return acc;
    }, {});
    
    // Track armors
    state.armors = $gameParty.armors().reduce((acc, item) => {
        acc[item.id] = $gameParty.numItems(item);
        return acc;
    }, {});
    
    return state;
};



Scene_Thoughts.prototype.comparePartyStates = function(current, previous) {
    // Check for party size changes
    const useTranslation = ConfigManager.language === 'it'

    if (previous.size > 0 && current.size < previous.size) {
        // Someone left the party or died
        const lostMembers = previous.members.filter(id => !current.members.includes(id));
        lostMembers.forEach(id => {
            const actor = $gameActors.actor(current.members[0]);
            const personality = getPersonalityType(actor);
            // Different personalities react differently to party members leaving
            let thoughtText = "";
            if(useTranslation){
                switch (personality) {
                    case PERSONALITY_TYPES.CHEERFUL:
                        thoughtText = `${$gameActors.actor(id).name()} ci ha lasciato? Spero che torni presto!`;
                        break;
                    case PERSONALITY_TYPES.SERIOUS:
                        thoughtText = `La partenza di ${$gameActors.actor(id).name()} influirà sulle nostre opzioni tattiche.`;
                        break;
                    case PERSONALITY_TYPES.ANALYTICAL:
                        thoughtText = `Con ${$gameActors.actor(id).name()} assente, abbiamo perso circa il 25% del nostro potenziale bellico.`;
                        break;
                    case PERSONALITY_TYPES.EMOTIONAL:
                        thoughtText = `${$gameActors.actor(id).name()} non c'è più...\n Mi sento vuoto dentro.`;
                        break;
                    case PERSONALITY_TYPES.MYSTERIOUS:
                        thoughtText = `L'assenza di ${$gameActors.actor(id).name()} è...\n preoccupante.\n Mi chiedo quale destino li attenda.`;
                        break;
                    default:
                        thoughtText = `${$gameActors.actor(id).name()} non è più con noi.\n Dobbiamo comunque andare avanti.`;
                }

            }else{
                switch (personality) {
                    case PERSONALITY_TYPES.CHEERFUL:
                        thoughtText = `${$gameActors.actor(id).name()} left us? I hope they'll come back soon!`;
                        break;
                    case PERSONALITY_TYPES.SERIOUS:
                        thoughtText = `${$gameActors.actor(id).name()}'s departure will impact our tactical options.`;
                        break;
                    case PERSONALITY_TYPES.ANALYTICAL:
                        thoughtText = `With ${$gameActors.actor(id).name()} gone, we've lost approximately 25% of our combat potential.`;
                        break;
                    case PERSONALITY_TYPES.EMOTIONAL:
                        thoughtText = `${$gameActors.actor(id).name()} is gone...\n I feel empty inside.`;
                        break;
                    case PERSONALITY_TYPES.MYSTERIOUS:
                        thoughtText = `${$gameActors.actor(id).name()}'s absence is...\n concerning.\n I wonder what fate awaits them.`;
                        break;
                    default:
                        thoughtText = `${$gameActors.actor(id).name()} is no longer with us.\n We must continue nonetheless.`;
                }   
            }

            
            this.addThought(actor, thoughtText, 'sorrow');
        });
    }
    
    if (previous.size > 0 && current.size > previous.size) {
        // Someone joined the party
        const newMembers = current.members.filter(id => !previous.members.includes(id));
        newMembers.forEach(id => {
            const actor = $gameActors.actor(current.members[0]);
            const personality = getPersonalityType(actor);
            
            // Different personalities react differently to new party members
            let thoughtText = "";
            if(useTranslation){
                switch (personality) {
                    case PERSONALITY_TYPES.CHEERFUL:
                        thoughtText = `Evviva!\n${$gameActors.actor(id).name()} si è unito a noi!\nSarà davvero divertente!`;
                        break;
                    case PERSONALITY_TYPES.SERIOUS:
                        thoughtText = `${$gameActors.actor(id).name()} si è unito alle nostre fila.\n Le sue abilità saranno preziose.`;
                        break;
                    case PERSONALITY_TYPES.ANALYTICAL:
                        thoughtText = `Le abilità di ${$gameActors.actor(id).name()} si integrano bene con la composizione attuale del team.`;
                        break;
                    case PERSONALITY_TYPES.EMOTIONAL:
                        thoughtText = `Sono così felice che ${$gameActors.actor(id).name()} sia con noi ora!\nBenvenuto nella nostra famiglia!`;
                        break;
                    case PERSONALITY_TYPES.MYSTERIOUS:
                        thoughtText = `${$gameActors.actor(id).name()}...\n un'aggiunta interessante.\n Il destino ci ha uniti.`;
                        break;
                    default:
                        thoughtText = `Benvenuto nel nostro team, ${$gameActors.actor(id).name()}!\nLavoriamo insieme!`;
                }    

            }else{
                switch (personality) {
                    case PERSONALITY_TYPES.CHEERFUL:
                        thoughtText = `Yay!\n${$gameActors.actor(id).name()} joined us!\nThis is going to be so much fun!`;
                        break;
                    case PERSONALITY_TYPES.SERIOUS:
                        thoughtText = `${$gameActors.actor(id).name()} has joined our ranks.\n Their skills will be valuable.`;
                        break;
                    case PERSONALITY_TYPES.ANALYTICAL:
                        thoughtText = `${$gameActors.actor(id).name()}'s abilities complement our existing team composition well.`;
                        break;
                    case PERSONALITY_TYPES.EMOTIONAL:
                        thoughtText = `I'm so happy ${$gameActors.actor(id).name()} is with us now!\nWelcome to our family!`;
                        break;
                    case PERSONALITY_TYPES.MYSTERIOUS:
                        thoughtText = `${$gameActors.actor(id).name()}...\n an interesting addition.\n Fate brings us together.`;
                        break;
                    default:
                        thoughtText = `Welcome to our team, ${$gameActors.actor(id).name()}!\nLet's work together!`;
                }        
            }
 
            
            this.addThought(actor, thoughtText, 'welcome');
        });
    }
    
    // Check TP for determination messages
    $gameParty.members().forEach(actor => {
        if (actor.tp >= actor.maxTp()) {
            const personality = getPersonalityType(actor);
            
            // Different personalities express determination differently
            let thoughtText = "";
            if(useTranslation){
                switch (personality) {
                    case PERSONALITY_TYPES.CHEERFUL:
                        thoughtText = "Sono super carico e pronto a partire!\nFacciamolo!";
                        break;
                    case PERSONALITY_TYPES.SERIOUS:
                        thoughtText = "Il mio potere ha raggiunto l'apice.\n È ora di sferrare un attacco decisivo.";
                        break;
                    case PERSONALITY_TYPES.ANALYTICAL:
                        thoughtText = "Analisi tattica: momento ottimale per usare la tecnica speciale.";
                        break;
                    case PERSONALITY_TYPES.EMOTIONAL:
                        thoughtText = "Sento il potere scorrere in me!\nNiente può fermarmi!";
                        break;
                    case PERSONALITY_TYPES.MYSTERIOUS:
                        thoughtText = "Le ombre sussurrano che è giunto il momento del mio potere supremo...";
                        break;
                    default:
                        thoughtText = "Sono pieno di determinazione.\n Nulla può fermarmi ora!";
                }   

            }else{
                switch (personality) {
                    case PERSONALITY_TYPES.CHEERFUL:
                        thoughtText = "I'm super charged up and ready to go!\nLet's do this!";
                        break;
                    case PERSONALITY_TYPES.SERIOUS:
                        thoughtText = "My power has reached its peak.\n Time to execute a decisive attack.";
                        break;
                    case PERSONALITY_TYPES.ANALYTICAL:
                        thoughtText = "Tactical analysis: optimum moment to deploy special technique.";
                        break;
                    case PERSONALITY_TYPES.EMOTIONAL:
                        thoughtText = "I can feel the power surging through me!\nNothing can stand in my way!";
                        break;
                    case PERSONALITY_TYPES.MYSTERIOUS:
                        thoughtText = "The shadows whisper that the time for my ultimate power has come...";
                        break;
                    default:
                        thoughtText = "I'm filled with determination.\n Nothing can stop me now!";
                }           
            }
 
            
            this.addThought(actor, thoughtText, 'determined');
        }
    });
    
    // Check HP/MP changes and equipment changes
    $gameParty.members().forEach(actor => {
        const actorId = actor.actorId();
        const personality = getPersonalityType(actor);
        
        // Only check if we have previous data for this actor
        if (previous.hp && previous.hp[actorId] !== undefined) {
            const hpChange = actor.hp - previous.hp[actorId];
            const hpPercent = (actor.hp / actor.mhp) * 100;
            
            if (hpChange < -20 && actor.hp < actor.mhp / 2) {
                let thoughtText = "";
                if(useTranslation){
                    switch (personality) {
                        case PERSONALITY_TYPES.CHEERFUL:
                            thoughtText = "Ahi!\nHa fatto un sacco male, ma sorrido lo stesso!";
                            break;
                        case PERSONALITY_TYPES.SERIOUS:
                            thoughtText = "Una ferita significativa.\n Devo essere più cauto.";
                            break;
                        case PERSONALITY_TYPES.ANALYTICAL:
                            thoughtText = "Valutazione danni: preoccupante.\n Probabilità di sopravvivenza in calo.";
                            break;
                        case PERSONALITY_TYPES.EMOTIONAL:
                            thoughtText = "Fa davvero male...\n Vorrei piangere, ma devo restare forte.";
                            break;
                        case PERSONALITY_TYPES.MYSTERIOUS:
                            thoughtText = "Il mio sangue nutre le ombre...\n Sto diventando più debole.";
                            break;
                        default:
                            thoughtText = "Fa davvero male...\n Devo stare più attento.";
                    }

                }else{
                    switch (personality) {
                        case PERSONALITY_TYPES.CHEERFUL:
                            thoughtText = "Ouch!\nThat hurt a lot, but I'm still smiling!";
                            break;
                        case PERSONALITY_TYPES.SERIOUS:
                            thoughtText = "A significant injury.\n I need to be more cautious.";
                            break;
                        case PERSONALITY_TYPES.ANALYTICAL:
                            thoughtText = "Damage assessment: concerning.\n Survival probability decreasing.";
                            break;
                        case PERSONALITY_TYPES.EMOTIONAL:
                            thoughtText = "That really hurt...\n I feel like crying, but I must stay strong.";
                            break;
                        case PERSONALITY_TYPES.MYSTERIOUS:
                            thoughtText = "My blood feeds the shadows...\n I grow weaker.";
                            break;
                        default:
                            thoughtText = "That really hurt...\n I need to be more careful.";
                    }              
                }

                
                this.addThought(actor, thoughtText, 'negative');
            }
            
            if (hpChange > 50) {
                let thoughtText = "";
                if(useTranslation){
                    switch (personality) {
                        case PERSONALITY_TYPES.CHEERFUL:
                            thoughtText = "Wow, mi sento alla grande ora!\nPronto a conquistare il mondo!";
                            break;
                        case PERSONALITY_TYPES.SERIOUS:
                            thoughtText = "La cura è stata efficace.\n Sono pronto a proseguire la missione.";
                            break;
                        case PERSONALITY_TYPES.ANALYTICAL:
                            thoughtText = "Salute ripristinata a parametri accettabili.\n Efficienza migliorata del 47%.";
                            break;
                        case PERSONALITY_TYPES.EMOTIONAL:
                            thoughtText = "Oh grazie al cielo...\n Mi sento molto meglio ora!";
                            break;
                        case PERSONALITY_TYPES.MYSTERIOUS:
                            thoughtText = "La forza vitale ritorna in me...\n Il vuoto dovrà attendere.";
                            break;
                        default:
                            thoughtText = "Ora mi sento molto meglio!\nQuella cura era proprio ciò che serviva.";
                    }

                }else{
                    switch (personality) {
                        case PERSONALITY_TYPES.CHEERFUL:
                            thoughtText = "Wow, I feel amazing now!\nReady to take on the world!";
                            break;
                        case PERSONALITY_TYPES.SERIOUS:
                            thoughtText = "The healing was effective.\n I'm ready to continue the mission.";
                            break;
                        case PERSONALITY_TYPES.ANALYTICAL:
                            thoughtText = "Health restored to acceptable parameters.\n Efficiency improved by 47%.";
                            break;
                        case PERSONALITY_TYPES.EMOTIONAL:
                            thoughtText = "Oh thank goodness...\n I feel so much better now!";
                            break;
                        case PERSONALITY_TYPES.MYSTERIOUS:
                            thoughtText = "The life force returns to me...\n The void must wait.";
                            break;
                        default:
                            thoughtText = "Feeling much better now!\nThat healing was just what I needed.";
                    }        
                }
  
                
                this.addThought(actor, thoughtText, 'positive');
            }
            
            // Critical HP
            if (hpPercent < 20 && previous.hp[actorId] / actor.mhp * 100 >= 20) {
                let thoughtText = "";
                if(useTranslation){
                    switch (personality) {
                        case PERSONALITY_TYPES.CHEERFUL:
                            thoughtText = "Uh oh!\nLe cose si mettono davvero male!\nAiuto, qualcuno?";
                            break;
                        case PERSONALITY_TYPES.SERIOUS:
                            thoughtText = "Situazione critica.\n Necessario intervento medico immediato.";
                            break;
                        case PERSONALITY_TYPES.ANALYTICAL:
                            thoughtText = "Salute critica.\n Probabilità di sopravvivenza: 32% senza intervento.";
                            break;
                        case PERSONALITY_TYPES.EMOTIONAL:
                            thoughtText = "Per favore...\n Non voglio morire qui...\n Qualcuno mi aiuti!";
                            break;
                        case PERSONALITY_TYPES.MYSTERIOUS:
                            thoughtText = "Sento l'oscurità che mi chiama...\n Non ancora.\n Non oggi.";
                            break;
                        default:
                            thoughtText = "Sono nei guai seri qui...\n Ho bisogno di cure subito!";
                    }  

                }else{
                    switch (personality) {
                        case PERSONALITY_TYPES.CHEERFUL:
                            thoughtText = "Uh oh!\nThings are looking pretty bad!\nHelp, anyone?";
                            break;
                        case PERSONALITY_TYPES.SERIOUS:
                            thoughtText = "Critical situation.\n Require immediate medical attention.";
                            break;
                        case PERSONALITY_TYPES.ANALYTICAL:
                            thoughtText = "Health critical.\n Probability of survival: 32% without intervention.";
                            break;
                        case PERSONALITY_TYPES.EMOTIONAL:
                            thoughtText = "Please...\n I don't want to die here...\n Someone help me!";
                            break;
                        case PERSONALITY_TYPES.MYSTERIOUS:
                            thoughtText = "I feel the darkness calling...\n Not yet.\n Not today.";
                            break;
                        default:
                            thoughtText = "I'm in serious trouble here...\n I need healing immediately!";
                    }          
                }

                
                this.addThought(actor, thoughtText, 'negative');
            }
        }
        
        if (previous.mp && previous.mp[actorId] !== undefined) {
            const mpChange = actor.mp - previous.mp[actorId];
            const mpPercent = (actor.mp / actor.mmp) * 100;

            if (mpChange < -30 && actor.mp < actor.mmp / 3) {
                let thoughtText = "";
                if(useTranslation){
                    switch (personality) {
                        case PERSONALITY_TYPES.CHEERFUL:
                            thoughtText = "Uff!\nHo consumato un sacco di magia!\nDevo ricaricarmi presto!";
                            break;
                        case PERSONALITY_TYPES.SERIOUS:
                            thoughtText = "Riserve magiche in esaurimento.\n Necessario conservare la potenza restante.";
                            break;
                        case PERSONALITY_TYPES.ANALYTICAL:
                            thoughtText = "Riserve di mana al 32,7% della capacità.\n Avvio protocolli di conservazione.";
                            break;
                        case PERSONALITY_TYPES.EMOTIONAL:
                            thoughtText = "Mi sento così svuotato...\n La mia energia magica sta svanendo in fretta...";
                            break;
                        case PERSONALITY_TYPES.MYSTERIOUS:
                            thoughtText = "I flussi arcani si indeboliscono in me...\n Le ombre si fanno più distanti.";
                            break;
                        default:
                            thoughtText = "La mia energia magica si sta esaurendo...\n devo conservarla.";
                    }

                }else{
                    switch (personality) {
                        case PERSONALITY_TYPES.CHEERFUL:
                            thoughtText = "Whew!\nUsed up a lot of magic there!\nNeed to recharge soon!";
                            break;
                        case PERSONALITY_TYPES.SERIOUS:
                            thoughtText = "Magical reserves depleting.\n Need to conserve remaining power.";
                            break;
                        case PERSONALITY_TYPES.ANALYTICAL:
                            thoughtText = "Mana reserves at 32.7% capacity.\n Conservation protocols engaged.";
                            break;
                        case PERSONALITY_TYPES.EMOTIONAL:
                            thoughtText = "I feel so drained...\n My magical energy is fading fast...";
                            break;
                        case PERSONALITY_TYPES.MYSTERIOUS:
                            thoughtText = "The arcane flows weaken within me...\n Shadows grow distant.";
                            break;
                        default:
                            thoughtText = "My magic energy is running low...\n need to conserve it.";
                    }
                }

                
                this.addThought(actor, thoughtText, 'negative');
            }
            
            if (actor.mp === 0 && previous.mp[actorId] > 0) {
                let thoughtText = "";
                if(useTranslation){
                    switch (personality) {
                        case PERSONALITY_TYPES.CHEERFUL:
                            thoughtText = "Magia finita!\nImmagino che userò il mio fascino al posto suo!";
                            break;
                        case PERSONALITY_TYPES.SERIOUS:
                            thoughtText = "Energia magica esaurita.\n Passo a tattiche fisiche.";
                            break;
                        case PERSONALITY_TYPES.ANALYTICAL:
                            thoughtText = "Riserve di mana: zero.\n Efficacia magica: annullata.\n Necessario approccio alternativo.";
                            break;
                        case PERSONALITY_TYPES.EMOTIONAL:
                            thoughtText = "Non sento più la magia...\n È tutta sparita...";
                            break;
                        case PERSONALITY_TYPES.MYSTERIOUS:
                            thoughtText = "Il vuoto ha consumato il mio potere arcano...\n Temporaneamente.";
                            break;
                        default:
                            thoughtText = "Sono completamente privo di energia magica...";
                    }

                }else{
                    switch (personality) {
                        case PERSONALITY_TYPES.CHEERFUL:
                            thoughtText = "All out of magic!\nGuess I'll have to use my charm instead!";
                            break;
                        case PERSONALITY_TYPES.SERIOUS:
                            thoughtText = "Magical energy depleted.\n Switching to physical tactics.";
                            break;
                        case PERSONALITY_TYPES.ANALYTICAL:
                            thoughtText = "Mana reserves: zero.\n Magical efficacy: nullified.\n Alternative approach required.";
                            break;
                        case PERSONALITY_TYPES.EMOTIONAL:
                            thoughtText = "I can't feel the magic anymore...\n It's all gone...";
                            break;
                        case PERSONALITY_TYPES.MYSTERIOUS:
                            thoughtText = "The void has consumed my arcane power...\n Temporarily.";
                            break;
                        default:
                            thoughtText = "I'm completely drained of magical energy...";
                    }          
                }
 
                
                this.addThought(actor, thoughtText, 'negative');
            }
            
            // Full MP
            if (actor.mp === actor.mmp && previous.mp[actorId] < actor.mmp) {
                let thoughtText = "";
                if(useTranslation){
                    switch (personality) {
                        case PERSONALITY_TYPES.CHEERFUL:
                            thoughtText = "Energia magica al massimo!\nÈ ora di lanciare incantesimi scintillanti!";
                            break;
                        case PERSONALITY_TYPES.SERIOUS:
                            thoughtText = "Riserve magiche alla capacità massima.\n Pronto per un impiego tattico.";
                            break;
                        case PERSONALITY_TYPES.ANALYTICAL:
                            thoughtText = "Capacità di mana: 100%.\n Efficacia degli incantesimi: ottimale.\n Pronto a procedere.";
                            break;
                        case PERSONALITY_TYPES.EMOTIONAL:
                            thoughtText = "Sento la magia scorrere completamente in me!\nÈ meraviglioso!";
                            break;
                        case PERSONALITY_TYPES.MYSTERIOUS:
                            thoughtText = "I flussi arcani scorrono forti in me ora.\n Il velo tra i mondi si assottiglia.";
                            break;
                        default:
                            thoughtText = "La mia energia magica è al massimo.\n È ora di scatenare potenti incantesimi!";
                    }

                }else{
                    switch (personality) {
                        case PERSONALITY_TYPES.CHEERFUL:
                            thoughtText = "Magical energy all topped up!\nTime for some sparkly spells!";
                            break;
                        case PERSONALITY_TYPES.SERIOUS:
                            thoughtText = "Magical reserves at maximum capacity.\n Ready for tactical deployment.";
                            break;
                        case PERSONALITY_TYPES.ANALYTICAL:
                            thoughtText = "Mana capacity: 100%.\n Spell effectiveness: optimal.\n Ready to proceed.";
                            break;
                        case PERSONALITY_TYPES.EMOTIONAL:
                            thoughtText = "I feel the magic flowing through me completely!\nIt's wonderful!";
                            break;
                        case PERSONALITY_TYPES.MYSTERIOUS:
                            thoughtText = "The arcane flows strong within me now.\n The veil between worlds thins.";
                            break;
                        default:
                            thoughtText = "My magical energy is at its peak.\n Time to unleash some powerful spells!";
                    }
                }

                
                this.addThought(actor, thoughtText, 'positive');
            }
        }
        
        // Check equipment changes
        if (previous.equips && previous.equips[actorId]) {
            const currentEquips = actor.equips().map(item => item ? item.id : 0);
            const previousEquips = previous.equips[actorId];
            
            // Initialize equipment comment tracking if needed
            if (!$lastPartyState.lastEquipComments[actorId]) {
                $lastPartyState.lastEquipComments[actorId] = {};
            }
            
            // Compare arrays
            for (let i = 0; i < currentEquips.length; i++) {
                if (currentEquips[i] !== previousEquips[i] && currentEquips[i] !== 0) {
                    const equipType = ['weapon', 'shield', 'head', 'body', 'accessory'][i] || 'item';
                    const equip = actor.equips()[i];
                    
                    // Check if we've already commented on this specific equipment
                    if (equip && !$lastPartyState.lastEquipComments[actorId][equip.id]) {
                        // Mark this equipment as commented
                        $lastPartyState.lastEquipComments[actorId][equip.id] = true;
                        
                        let thoughtText = "";
                        const adjective = ['comfortable', 'powerful', 'strange', 'perfect', 'unusual'][Math.floor(Math.random() * 5)];
                        if(useTranslation){
                            switch (personality) {
                                case PERSONALITY_TYPES.CHEERFUL:
                                    thoughtText = `Questo nuovo ${equipType} è così ${adjective}!\n${equip.name} mi sta davvero bene!`;
                                    break;
                                case PERSONALITY_TYPES.SERIOUS:
                                    thoughtText = `${equip.name} offre una protezione ${equipType} adeguata.\n Servirà al suo scopo.`;
                                    break;
                                case PERSONALITY_TYPES.ANALYTICAL:
                                    thoughtText = `${equip.name}: ${equipType} ${adjective} con metriche migliorate di circa il 23% rispetto al precedente equipaggiamento.`;
                                    break;
                                case PERSONALITY_TYPES.EMOTIONAL:
                                    thoughtText = `Mi sento così ${adjective} indossando questo ${equip.name}.\n È come se fosse fatto apposta per me!`;
                                    break;
                                case PERSONALITY_TYPES.MYSTERIOUS:
                                    thoughtText = `Questo ${equip.name}...\n Sussurra segreti.\n Un artefatto davvero ${adjective}.`;
                                    break;
                                default:
                                    thoughtText = `Questo ${equipType} sembra ${adjective}.\n ${equip.name} potrebbe essere proprio quello che mi serviva.`;
                            }

                        }else{
                            switch (personality) {
                                case PERSONALITY_TYPES.CHEERFUL:
                                    thoughtText = `This new ${equipType} is so ${adjective}!\n${equip.name} really suits me!`;
                                    break;
                                case PERSONALITY_TYPES.SERIOUS:
                                    thoughtText = `The ${equip.name} provides adequate ${equipType} protection.\n It will serve its purpose.`;
                                    break;
                                case PERSONALITY_TYPES.ANALYTICAL:
                                    thoughtText = `${equip.name}: ${adjective} ${equipType} with approximately 23% improved metrics over previous equipment.`;
                                    break;
                                case PERSONALITY_TYPES.EMOTIONAL:
                                    thoughtText = `I feel so ${adjective} wearing this ${equip.name}.\n It's like it was made just for me!`;
                                    break;
                                case PERSONALITY_TYPES.MYSTERIOUS:
                                    thoughtText = `This ${equip.name}...\n It whispers secrets.\n A ${adjective} artifact indeed.`;
                                    break;
                                default:
                                    thoughtText = `This ${equipType} feels ${adjective}.\n ${equip.name} might be just what I needed.`;
                            }
                        }

           
                        
                        const wrappedText = this.wrapText(thoughtText, lineLength);
                        this.addThought(actor, wrappedText, 'equipment');
                    }
                }
            }
        }
    });
};
Scene_Thoughts.prototype.generateCompetitionMessages = function(competitors, type) {
    const useTranslation = ConfigManager.language === 'it';
    const competitions = {
        arm_wrestling: [
            { actor: competitors[0], text: useTranslation ? `Che ne dite di una partita a braccio di ferro per passare il tempo?` : `How about some arm wrestling to pass the time?` },
            { actor: competitors[1], text: useTranslation ? `Ci sto! Preparati a perdere!` : `You're on! Prepare to lose!` },
            { actor: competitors[0], text: useTranslation ? `*grugnito* Sei... più forte di quanto sembri!` : `*grunt* You're... stronger than you look!` },
            { actor: competitors[1], text: useTranslation ? `Ti arrendi? Il mio braccio non è nemmeno stanco!` : `Give up yet? My arm's not even tired!` },
            { actor: competitors[Math.floor(Math.random() * 2)], text: useTranslation ? `Vittoria! Bella partita, però.` : `Victory! Good match though.` }
        ],
        storytelling: [
            { actor: competitors[0], text: useTranslation ? `Scommetto che posso raccontare una storia migliore della tua.` : `I bet I can tell a better story than you.` },
            { actor: competitors[1], text: useTranslation ? `Sfida accettata! Inizia tu.` : `Challenge accepted! You go first.` },
            { actor: competitors[0], text: useTranslation ? `*racconta una storia elaborata di draghi ed eroi*` : `*tells an elaborate tale of dragons and heroes*` },
            { actor: competitors[1], text: useTranslation ? `Non male, ma ascolta questa... *intesse una saga epica*` : `Not bad, but listen to this... *weaves an epic saga*` },
            competitors[2] && { actor: competitors[2], text: useTranslation ? `Devo ammettere che siete entrambi degli ottimi cantastorie!` : `I have to admit, you're both excellent storytellers!` }
        ].filter(Boolean),
        cooking: [
            { actor: competitors[1], text: useTranslation ? `Le mie abilità in cucina non hanno rivali! Vuoi provare a smentirmi?` : `My cooking skills are unmatched! Care to prove me wrong?` },
            { actor: competitors[0], text: useTranslation ? `Ah! Guarda e impara. *inizia a preparare un pasto*` : `Ha! Watch and learn. *begins preparing a meal*` },
            { actor: competitors[1], text: useTranslation ? `Tecnica interessante... ma guarda questo condimento!` : `Interesting technique... but check out this seasoning!` },
            { actor: competitors[0], text: useTranslation ? `Dove l'hai imparato? È davvero geniale!` : `Where did you learn that? That's actually brilliant!` },
            competitors[2] && { actor: competitors[2], text: useTranslation ? `Giudicherò io! *assaggia entrambi* Sono entrambi fantastici!` : `I'll judge! *tastes both* They're both amazing!` }
        ].filter(Boolean),
        drinking: [
            { actor: competitors[0], text: useTranslation ? `Posso bere più di chiunque altro qui!` : `I can outdrink anyone here!` },
            { actor: competitors[1], text: useTranslation ? `Affermazione audace! Oste, due birre!` : `Bold claim! Barkeep, two ales!` },
            { actor: competitors[0], text: useTranslation ? `*scola la birra* Un'altra!` : `*downs the ale* Another!` },
            { actor: competitors[1], text: useTranslation ? `*mantenendo il ritmo* Te ne pentirai!` : `*matching pace* You're going to regret this!` },
            { actor: competitors[Math.floor(Math.random() * 2)], text: useTranslation ? `Io... credo di averne avuto abbastanza... Hai vinto tu...` : `I... I think I've had enough... You win...` }
        ],
        meditation: [
            { actor: competitors[1], text: useTranslation ? `Vediamo chi riesce a meditare più a lungo senza muoversi.` : `Let's see who can meditate the longest without moving.` },
            { actor: competitors[0], text: useTranslation ? `La pace interiore è la mia specialità. Ci sto.` : `Inner peace is my specialty. You're on.` },
            { actor: competitors[1], text: useTranslation ? `*siede perfettamente immobile, respirando lentamente*` : `*sitting perfectly still, breathing slowly*` },
            { actor: competitors[0], text: useTranslation ? `*in profonda meditazione, completamente concentrato*` : `*deep in meditation, completely focused*` },
            { actor: competitors[Math.floor(Math.random() * 2)], text: useTranslation ? `*starnutisce all'improvviso* Dannazione! Hai vinto.` : `*suddenly sneezes* Damn! You win.` }
        ]
    };
    
    // Determine winner and adjust relationships
    const winner = competitors[Math.floor(Math.random() * competitors.length)];
    const loser = competitors.find(c => c !== winner);
    
    // Good sport vs sore loser
    const goodSport = Math.random() < 0.7;
    if (goodSport) {
        this.modifyRelationship(winner.actorId(), loser.actorId(), 
            Math.floor(Math.random() * 5) + 3);
    } else {
        this.modifyRelationship(winner.actorId(), loser.actorId(), 
            -(Math.floor(Math.random() * 5) + 2));
    }
    
    return competitions[type] || competitions.arm_wrestling;
};
Scene_Thoughts.prototype.generateMoneyThoughts = function(change) {
    const useTranslation = ConfigManager.language === 'it'

    if (change === 0) return;
    
    if ($gameParty.size() > 0) {
        // Select a random actor from the party
        const randomActor = $gameParty.members()[Math.floor(Math.random() * $gameParty.size())];
        const personality = getPersonalityType(randomActor);
        
        let thoughtText = "";
        
        if (change > 0) {
            // Gained money
            if (change > 1000) {
                // Large amount gained
                if(useTranslation){
                    switch (personality) {
                        case PERSONALITY_TYPES.CHEERFUL:
                            thoughtText = `Jackpot!\n${change} oro!\nSiamo ricchi!\nTempo di fare spese!`;
                            break;
                        case PERSONALITY_TYPES.SERIOUS:
                            thoughtText = `Abbiamo ottenuto ${change} oro.\n Ci fornirà risorse utili per il nostro viaggio.`;
                            break;
                        case PERSONALITY_TYPES.ANALYTICAL:
                            thoughtText = `Incremento finanziario: ${change} oro.\n Il nostro potere d'acquisto è aumentato di circa il 25%.`;
                            break;
                        case PERSONALITY_TYPES.EMOTIONAL:
                            thoughtText = `Non posso credere che abbiamo trovato ${change} oro!\nSembra una benedizione!`;
                            break;
                        case PERSONALITY_TYPES.MYSTERIOUS:
                            thoughtText = `${change} monete d'oro...\n La fortuna ci sorride dalle ombre.`;
                            break;
                        default:
                            thoughtText = `Abbiamo guadagnato ${change} oro!\nQuesto dovrebbe aiutarci a comprare equipaggiamento migliore.`;
                    }

                }else{
                    switch (personality) {
                        case PERSONALITY_TYPES.CHEERFUL:
                            thoughtText = `Jackpot!\n${change} gold!\nWe're rich!\nShopping spree time!`;
                            break;
                        case PERSONALITY_TYPES.SERIOUS:
                            thoughtText = `We've acquired ${change} gold.\n This will provide useful resources for our journey.`;
                            break;
                        case PERSONALITY_TYPES.ANALYTICAL:
                            thoughtText = `Financial increase: ${change} gold.\n Our purchasing power has increased by approximately 25%.`;
                            break;
                        case PERSONALITY_TYPES.EMOTIONAL:
                            thoughtText = `I can't believe we found ${change} gold!\nThis feels like a blessing!`;
                            break;
                        case PERSONALITY_TYPES.MYSTERIOUS:
                            thoughtText = `${change} gold pieces...\n Fortune smiles upon us from the shadows.`;
                            break;
                        default:
                            thoughtText = `We gained ${change} gold!\nThis should help us buy better equipment.`;
                    }         
                }

            } else {
                // Small amount gained
                if(useTranslation){
                    switch (personality) {
                        case PERSONALITY_TYPES.CHEERFUL:
                            thoughtText = `Evviva!\nTrovati ${change} oro!\nOgni moneta aiuta!`;
                            break;
                        case PERSONALITY_TYPES.SERIOUS:
                            thoughtText = `${change} oro aggiunti ai nostri fondi.\n Piccola ma utile somma.`;
                            break;
                        case PERSONALITY_TYPES.ANALYTICAL:
                            thoughtText = `${change} oro acquisiti.\n Incremento minimo ma statisticamente rilevante delle risorse.`;
                            break;
                        case PERSONALITY_TYPES.EMOTIONAL:
                            thoughtText = `Trovati ${change} oro!\nSono felice anche per i tesori più piccoli.`;
                            break;
                        case PERSONALITY_TYPES.MYSTERIOUS:
                            thoughtText = `${change} oro...\n I piccoli fili del destino tessono la nostra fortuna.`;
                            break;
                        default:
                            thoughtText = `Abbiamo raccolto ${change} oro.\n Non è molto, ma tutto fa brodo.`;
                    }

                }else{
                    switch (personality) {
                        case PERSONALITY_TYPES.CHEERFUL:
                            thoughtText = `Yay!\nFound ${change} gold!\nEvery bit helps!`;
                            break;
                        case PERSONALITY_TYPES.SERIOUS:
                            thoughtText = `${change} gold added to our funds.\n Small but useful.`;
                            break;
                        case PERSONALITY_TYPES.ANALYTICAL:
                            thoughtText = `${change} gold acquired.\n Minor but statistically relevant increase in resources.`;
                            break;
                        case PERSONALITY_TYPES.EMOTIONAL:
                            thoughtText = `Found ${change} gold!\nI'm happy with even the smallest treasures.`;
                            break;
                        case PERSONALITY_TYPES.MYSTERIOUS:
                            thoughtText = `${change} gold...\n The small threads of fate weave our fortune.`;
                            break;
                        default:
                            thoughtText = `We picked up ${change} gold.\n Not much, but it all adds up.`;
                    }
                }

            }
        } else {
            // Lost/spent money
            change = Math.abs(change);
            
            if (change > 500) {
                // Large amount spent
                if(useTranslation){

                }else{
                    
                }

            } else {
                // Small amount spent
                if(useTranslation){
                    switch (personality) {
                        case PERSONALITY_TYPES.CHEERFUL:
                            thoughtText = `Uff!\nSpesi ${change} oro!\nSpero ne sia valsa la pena!`;
                            break;
                        case PERSONALITY_TYPES.SERIOUS:
                            thoughtText = `${change} oro spesi.\n Una spesa necessaria per i nostri obiettivi.`;
                            break;
                        case PERSONALITY_TYPES.ANALYTICAL:
                            thoughtText = `Esborso finanziario: ${change} oro.\n Il ritorno sull'investimento resta da calcolare.`;
                            break;
                        case PERSONALITY_TYPES.EMOTIONAL:
                            thoughtText = `Abbiamo speso ${change} oro...\n Spero che sia stata la scelta giusta.`;
                            break;
                        case PERSONALITY_TYPES.MYSTERIOUS:
                            thoughtText = `${change} oro scivolano tra le nostre dita...\n Eppure il valore non si misura sempre in monete.`;
                            break;
                        default:
                            thoughtText = `Abbiamo speso ${change} oro.\n Speriamo si riveli un buon investimento.`;
                    }

                }else{
                    switch (personality) {
                        case PERSONALITY_TYPES.CHEERFUL:
                            thoughtText = `Whew!\nSpent ${change} gold!\nHope it was worth it!`;
                            break;
                        case PERSONALITY_TYPES.SERIOUS:
                            thoughtText = `${change} gold spent.\n A necessary expenditure for our objectives.`;
                            break;
                        case PERSONALITY_TYPES.ANALYTICAL:
                            thoughtText = `Financial outflow: ${change} gold.\n Return on investment remains to be calculated.`;
                            break;
                        case PERSONALITY_TYPES.EMOTIONAL:
                            thoughtText = `We spent ${change} gold...\n I hope we made the right choice.`;
                            break;
                        case PERSONALITY_TYPES.MYSTERIOUS:
                            thoughtText = `${change} gold slips through our fingers...\n Yet value is not always measured in coin.`;
                            break;
                        default:
                            thoughtText = `We spent ${change} gold.\n Hopefully it will prove to be a good investment.`;
                    }  
                }
                if(useTranslation){
                    switch (personality) {
                        case PERSONALITY_TYPES.CHEERFUL:
                            thoughtText = `Appena spesi ${change} oro!\nDenaro ben speso!`;
                            break;
                        case PERSONALITY_TYPES.SERIOUS:
                            thoughtText = `${change} oro usati per i rifornimenti.\n Spesa accettabile.`;
                            break;
                        case PERSONALITY_TYPES.ANALYTICAL:
                            thoughtText = `Spesa minore di ${change} oro.\n Impatto sul budget complessivo: trascurabile.`;
                            break;
                        case PERSONALITY_TYPES.EMOTIONAL:
                            thoughtText = `Abbiamo speso ${change} oro.\n Mi sento sempre un po' triste a separarmi dal denaro.`;
                            break;
                        case PERSONALITY_TYPES.MYSTERIOUS:
                            thoughtText = `${change} oro...\n offerti al vuoto del commercio.\n Uno scambio di energia.`;
                            break;
                        default:
                            thoughtText = `Abbiamo speso ${change} oro per i rifornimenti.\n Prezzo giusto.`;
                    }

                }else{
                    switch (personality) {
                        case PERSONALITY_TYPES.CHEERFUL:
                            thoughtText = `Just spent ${change} gold!\nMoney well spent!`;
                            break;
                        case PERSONALITY_TYPES.SERIOUS:
                            thoughtText = `${change} gold used for supplies.\n Acceptable expense.`;
                            break;
                        case PERSONALITY_TYPES.ANALYTICAL:
                            thoughtText = `Minor expenditure of ${change} gold.\n Impact on overall budget: negligible.`;
                            break;
                        case PERSONALITY_TYPES.EMOTIONAL:
                            thoughtText = `We spent ${change} gold.\n I always feel a little sad parting with money.`;
                            break;
                        case PERSONALITY_TYPES.MYSTERIOUS:
                            thoughtText = `${change} gold...\n given to the void of commerce.\n An exchange of energy.`;
                            break;
                        default:
                            thoughtText = `We spent ${change} gold on supplies.\n A fair price.`;
                    }
                }
 
            }
        }
        
        this.addThought(randomActor, thoughtText, 'money');
    }
};

Scene_Thoughts.prototype.generateItemThoughts = function() {
    const useTranslation = ConfigManager.language === 'it'

    if ($gameParty.size() === 0) return;
    
    // Process recent items
    const newItems = $recentItems.items.splice(0, 3); // Process up to 3 new items at a time
    const newWeapons = $recentItems.weapons.splice(0, 2); // Process up to 2 new weapons at a time
    const newArmors = $recentItems.armors.splice(0, 2); // Process up to 2 new armors at a time
    
    if (newItems.length > 0 || newWeapons.length > 0 || newArmors.length > 0) {
        // Select a random actor from the party
        const randomActor = $gameParty.members()[Math.floor(Math.random() * $gameParty.size())];
        const personality = getPersonalityType(randomActor);
        
        // Process regular items
        newItems.forEach(itemId => {
            const item = $dataItems[itemId];
            if (!item) return;
            
            let thoughtText = "";
            
            // Special messages for different item types
            if (item.itypeId === 1) { // Regular item
                if(useTranslation){
                    switch (personality) {
                        case PERSONALITY_TYPES.CHEERFUL:
                            thoughtText = `Ooh!\nUn ${item.name}!\nSembra divertente da usare!`;
                            break;
                        case PERSONALITY_TYPES.SERIOUS:
                            thoughtText = `Abbiamo ottenuto un ${item.name}.\n Potrebbe rivelarsi utile.`;
                            break;
                        case PERSONALITY_TYPES.ANALYTICAL:
                            thoughtText = `Oggetto ottenuto: ${item.name}.\n Utilità potenziale: da moderata ad alta.`;
                            break;
                        case PERSONALITY_TYPES.EMOTIONAL:
                            thoughtText = `Sono così felice che abbiamo trovato questo ${item.name}!\nLo desideravo da un po'!`;
                            break;
                        case PERSONALITY_TYPES.MYSTERIOUS:
                            thoughtText = `Un ${item.name}...\n Interessante come sia arrivato a noi.`;
                            break;
                        default:
                            thoughtText = `Abbiamo trovato un ${item.name}.\n Potrebbe tornarci utile.`;
                    }

                }else{
                    switch (personality) {
                        case PERSONALITY_TYPES.CHEERFUL:
                            thoughtText = `Ooh!\nA ${item.name}!\nThis looks fun to use!`;
                            break;
                        case PERSONALITY_TYPES.SERIOUS:
                            thoughtText = `We've acquired a ${item.name}.\n It may prove useful.`;
                            break;
                        case PERSONALITY_TYPES.ANALYTICAL:
                            thoughtText = `Item obtained: ${item.name}.\n Potential utility: moderate to high.`;
                            break;
                        case PERSONALITY_TYPES.EMOTIONAL:
                            thoughtText = `I'm so glad we found this ${item.name}!\nI've been hoping for one!`;
                            break;
                        case PERSONALITY_TYPES.MYSTERIOUS:
                            thoughtText = `A ${item.name}...\n Interesting how it found its way to us.`;
                            break;
                        default:
                            thoughtText = `We found a ${item.name}.\n This could come in handy.`;
                    }                  
                }

            } else if (item.itypeId === 2) { // Key item
                if(useTranslation){
                    switch (personality) {
                        case PERSONALITY_TYPES.CHEERFUL:
                            thoughtText = `Wow!\nIl ${item.name} sembra super importante!\nAvventura in arrivo!`;
                            break;
                        case PERSONALITY_TYPES.SERIOUS:
                            thoughtText = `Il ${item.name} è un'acquisizione fondamentale.\n La nostra missione prosegue.`;
                            break;
                        case PERSONALITY_TYPES.ANALYTICAL:
                            thoughtText = `Oggetto chiave ottenuto: ${item.name}.\n Significato: eccezionalmente alto.`;
                            break;
                        case PERSONALITY_TYPES.EMOTIONAL:
                            thoughtText = `Il ${item.name}...\n Sento la sua importanza.\n Il nostro viaggio prende una nuova svolta.`;
                            break;
                        case PERSONALITY_TYPES.MYSTERIOUS:
                            thoughtText = `Il ${item.name}...\n Un pezzo di destino ora nelle nostre mani.`;
                            break;
                        default:
                            thoughtText = `Abbiamo ottenuto il ${item.name}.\n Sembra davvero importante.`;
                    }

                }else{
                    switch (personality) {
                        case PERSONALITY_TYPES.CHEERFUL:
                            thoughtText = `Wow!\nThe ${item.name} looks super important!\nAdventure awaits!`;
                            break;
                        case PERSONALITY_TYPES.SERIOUS:
                            thoughtText = `The ${item.name} is a critical acquisition.\n Our mission progresses.`;
                            break;
                        case PERSONALITY_TYPES.ANALYTICAL:
                            thoughtText = `Key item acquired: ${item.name}.\n Significance: exceptionally high.`;
                            break;
                        case PERSONALITY_TYPES.EMOTIONAL:
                            thoughtText = `The ${item.name}...\n I can feel its importance.\n Our journey takes a new turn.`;
                            break;
                        case PERSONALITY_TYPES.MYSTERIOUS:
                            thoughtText = `The ${item.name}...\n A piece of destiny now in our hands.`;
                            break;
                        default:
                            thoughtText = `We obtained the ${item.name}.\n This seems very important.`;
                    }            
                }

            } else if (item.itypeId === 3) { // Hidden item A
                if(useTranslation){
                    switch (personality) {
                        case PERSONALITY_TYPES.CHEERFUL:
                            thoughtText = `Un ${item.name} speciale!\nChe fortuna!`;
                            break;
                        case PERSONALITY_TYPES.SERIOUS:
                            thoughtText = `${item.name} acquisito.\n Le sue proprietà richiedono ulteriori studi.`;
                            break;
                        case PERSONALITY_TYPES.ANALYTICAL:
                            thoughtText = `Oggetto insolito ottenuto: ${item.name}.\n Scopo: poco chiaro ma intrigante.`;
                            break;
                        case PERSONALITY_TYPES.EMOTIONAL:
                            thoughtText = `Questo ${item.name} sembra speciale in qualche modo...\n Mi sento attratto da esso.`;
                            break;
                        case PERSONALITY_TYPES.MYSTERIOUS:
                            thoughtText = `${item.name}...\n Contiene segreti ancora da svelare.`;
                            break;
                        default:
                            thoughtText = `Abbiamo trovato un ${item.name}.\n C'è qualcosa di insolito in esso.`;
                    }

                }else{
                    switch (personality) {
                        case PERSONALITY_TYPES.CHEERFUL:
                            thoughtText = `A special ${item.name}!\nLucky us!`;
                            break;
                        case PERSONALITY_TYPES.SERIOUS:
                            thoughtText = `${item.name} acquired.\n Its properties require further study.`;
                            break;
                        case PERSONALITY_TYPES.ANALYTICAL:
                            thoughtText = `Unusual item obtained: ${item.name}.\n Purpose: unclear but intriguing.`;
                            break;
                        case PERSONALITY_TYPES.EMOTIONAL:
                            thoughtText = `This ${item.name} feels special somehow...\n I'm drawn to it.`;
                            break;
                        case PERSONALITY_TYPES.MYSTERIOUS:
                            thoughtText = `${item.name}...\n It holds secrets yet to be revealed.`;
                            break;
                        default:
                            thoughtText = `We found a ${item.name}.\n There's something unusual about it.`;
                    }             
                }

            } else if (item.itypeId === 4) { // Hidden item B
                if(useTranslation){
                    switch (personality) {
                        case PERSONALITY_TYPES.CHEERFUL:
                            thoughtText = `Oooh, un misterioso ${item.name}!\nChe emozione!`;
                            break;
                        case PERSONALITY_TYPES.SERIOUS:
                            thoughtText = `Questo ${item.name} sembra di origine sconosciuta.\n Prudenza consigliata.`;
                            break;
                        case PERSONALITY_TYPES.ANALYTICAL:
                            thoughtText = `Oggetto misterioso rilevato: ${item.name}.\n Proprietà: sconosciute.\n Rischio: non determinato.`;
                            break;
                        case PERSONALITY_TYPES.EMOTIONAL:
                            thoughtText = `Questo ${item.name} mi dà una strana sensazione...\n Non so se mi piace.`;
                            break;
                        case PERSONALITY_TYPES.MYSTERIOUS:
                            thoughtText = `Il ${item.name} richiama l'oscurità dentro di me...\n Curioso.`;
                            break;
                        default:
                            thoughtText = `Abbiamo trovato un ${item.name}.\n Non sono sicuro di cosa faccia.`;
                    }

                }else{
                    switch (personality) {
                        case PERSONALITY_TYPES.CHEERFUL:
                            thoughtText = `Oooh, a mysterious ${item.name}!\nHow exciting!`;
                            break;
                        case PERSONALITY_TYPES.SERIOUS:
                            thoughtText = `This ${item.name} seems to be of unknown origin.\n Caution advised.`;
                            break;
                        case PERSONALITY_TYPES.ANALYTICAL:
                            thoughtText = `Mysterious item detected: ${item.name}.\n Properties: unknown.\n Risk: undetermined.`;
                            break;
                        case PERSONALITY_TYPES.EMOTIONAL:
                            thoughtText = `This ${item.name} gives me a strange feeling...\n I'm not sure if I like it.`;
                            break;
                        case PERSONALITY_TYPES.MYSTERIOUS:
                            thoughtText = `The ${item.name} calls to the darkness within...\n Curious.`;
                            break;
                        default:
                            thoughtText = `We found a ${item.name}.\n I'm not sure what it does yet.`;
                    }            
                }

            }
            
            this.addThought(randomActor, thoughtText, 'item');
        });
        
        // Process weapons
        newWeapons.forEach(weaponId => {
            var weapon = $dataWeapons[weaponId];
            if (!weapon) return;
            
            let thoughtText = "";
            if(useTranslation){
                weapon.name = window.translateText(weapon.name)
                switch (personality) {
                
                    case PERSONALITY_TYPES.CHEERFUL:
                        thoughtText = `Guarda questo ${weapon.name}!\nNon vedo l'ora di provarlo!`;
                        break;
                    case PERSONALITY_TYPES.SERIOUS:
                        thoughtText = `Abbiamo ottenuto un ${weapon.name}.\n Dovrebbe aumentare la nostra efficacia in combattimento.`;
                        break;
                    case PERSONALITY_TYPES.ANALYTICAL:
                        thoughtText = `Nuova arma ottenuta: ${weapon.name}.\n Potenziale incremento del danno: +${weapon.params[2]}%.`;
                        break;
                    case PERSONALITY_TYPES.EMOTIONAL:
                        thoughtText = `Questo ${weapon.name} è bellissimo...\n Spero ci serva bene in battaglia.`;
                        break;
                    case PERSONALITY_TYPES.MYSTERIOUS:
                        thoughtText = `Un ${weapon.name}...\n Ogni arma ha un'anima e una storia.`;
                        break;
                    default:
                        thoughtText = `Abbiamo trovato un ${weapon.name}.\n Sembra piuttosto potente.`;
                }   

            }else{
                switch (personality) {
                
                    case PERSONALITY_TYPES.CHEERFUL:
                        thoughtText = `Check out this ${weapon.name}!\nCan't wait to try it out!`;
                        break;
                    case PERSONALITY_TYPES.SERIOUS:
                        thoughtText = `We've acquired a ${weapon.name}.\n It should increase our combat effectiveness.`;
                        break;
                    case PERSONALITY_TYPES.ANALYTICAL:
                        thoughtText = `New weapon obtained: ${weapon.name}.\n Damage output: potentially +${weapon.params[2]}%.`;
                        break;
                    case PERSONALITY_TYPES.EMOTIONAL:
                        thoughtText = `This ${weapon.name} is beautiful...\n I hope it serves us well in battle.`;
                        break;
                    case PERSONALITY_TYPES.MYSTERIOUS:
                        thoughtText = `A ${weapon.name}...\n Every weapon has a soul and a story.`;
                        break;
                    default:
                        thoughtText = `We found a ${weapon.name}.\n It looks quite powerful.`;
                }        
            }

            
            this.addThought(randomActor, thoughtText, 'item');
        });
        
        // Process armors
        newArmors.forEach(armorId => {
            var armor = $dataArmors[armorId];
            if (!armor) return;
            
            let thoughtText = "";
            if(useTranslation){
                armor.name = window.translateText(armor.name)

                switch (personality) {
                    case PERSONALITY_TYPES.CHEERFUL:
                        thoughtText = `Questo ${armor.name} è fantastico!\nE anche protettivo!`;
                        break;
                    case PERSONALITY_TYPES.SERIOUS:
                        thoughtText = `${armor.name} acquisita.\n Le nostre capacità difensive sono migliorate.`;
                        break;
                    case PERSONALITY_TYPES.ANALYTICAL:
                        thoughtText = `Nuova armatura: ${armor.name}.\n Aumento della difesa: circa ${armor.params[3]}%.`;
                        break;
                    case PERSONALITY_TYPES.EMOTIONAL:
                        thoughtText = `Mi sento più al sicuro solo a guardare questo ${armor.name}.\n Mi dà fiducia.`;
                        break;
                    case PERSONALITY_TYPES.MYSTERIOUS:
                        thoughtText = `Il ${armor.name}...\n Uno scudo tra la carne e il destino.`;
                        break;
                    default:
                        thoughtText = `Abbiamo trovato un ${armor.name}.\n Dovrebbe offrire una buona protezione.`;
                }   

            }else{
                switch (personality) {
                    case PERSONALITY_TYPES.CHEERFUL:
                        thoughtText = `This ${armor.name} looks awesome!\nAnd protective too!`;
                        break;
                    case PERSONALITY_TYPES.SERIOUS:
                        thoughtText = `${armor.name} acquired.\n Our defensive capabilities have improved.`;
                        break;
                    case PERSONALITY_TYPES.ANALYTICAL:
                        thoughtText = `New armor: ${armor.name}.\n Defense increase: approximately ${armor.params[3]}%.`;
                        break;
                    case PERSONALITY_TYPES.EMOTIONAL:
                        thoughtText = `I feel safer just looking at this ${armor.name}.\n It gives me confidence.`;
                        break;
                    case PERSONALITY_TYPES.MYSTERIOUS:
                        thoughtText = `The ${armor.name}...\n A shield between flesh and fate.`;
                        break;
                    default:
                        thoughtText = `We found a ${armor.name}.\n It should offer good protection.`;
                }   
            }

            
            this.addThought(randomActor, thoughtText, 'item');
        });
    }
};

Scene_Thoughts.prototype.generateMapThoughts = function() {
    const useTranslation = ConfigManager.language === 'it'

    if ($gameParty.size() === 0) return;
    
    // Select a random actor from the party
    const randomActor = $gameParty.members()[Math.floor(Math.random() * $gameParty.size())];
    const personality = getPersonalityType(randomActor);
    
    var mapName = $gameMap.displayName();
    
    // Only generate a thought if the map has a name
    if (mapName) {
        let thoughtText = "";
        if(useTranslation){
            mapName = window.translateText(mapName)

            switch (personality) {
                case PERSONALITY_TYPES.CHEERFUL:
                    thoughtText = `${mapName} sembra un posto divertente da esplorare!\nChissà cosa troveremo!`;
                    break;
                case PERSONALITY_TYPES.SERIOUS:
                    thoughtText = `Siamo arrivati a ${mapName}.\n Dobbiamo procedere con i nostri obiettivi.`;
                    break;
                case PERSONALITY_TYPES.ANALYTICAL:
                    thoughtText = `Località: ${mapName}.\n Valutazione iniziale: terreno complesso con più percorsi.\n Procedere con cautela.`;
                    break;
                case PERSONALITY_TYPES.EMOTIONAL:
                    thoughtText = `${mapName} ha un'atmosfera così unica...\n Sento la sua storia.`;
                    break;
                case PERSONALITY_TYPES.MYSTERIOUS:
                    thoughtText = `${mapName}...\n Le ombre qui raccontano antiche storie.\n Non siamo i primi a percorrere questi sentieri.`;
                    break;
                default:
                    thoughtText = `Siamo arrivati a ${mapName}.\n Vediamo cosa possiamo trovare qui.`;
            }

        }else{
            switch (personality) {
                case PERSONALITY_TYPES.CHEERFUL:
                    thoughtText = `${mapName} looks like a fun place to explore!\nI wonder what we'll find!`;
                    break;
                case PERSONALITY_TYPES.SERIOUS:
                    thoughtText = `We've arrived at ${mapName}.\n We should proceed with our objectives.`;
                    break;
                case PERSONALITY_TYPES.ANALYTICAL:
                    thoughtText = `Location: ${mapName}.\n Initial assessment: complex terrain with multiple pathways.\n Proceeding with caution.`;
                    break;
                case PERSONALITY_TYPES.EMOTIONAL:
                    thoughtText = `${mapName} has such a unique atmosphere...\n I can feel its history.`;
                    break;
                case PERSONALITY_TYPES.MYSTERIOUS:
                    thoughtText = `${mapName}...\n The shadows here tell ancient tales.\n We are not the first to walk these paths.`;
                    break;
                default:
                    thoughtText = `We've arrived at ${mapName}.\n Let's see what we can find here.`;
            }       
        }

        
        this.addThought(randomActor, thoughtText, 'map');
    }
};

Scene_Thoughts.prototype.generateMonsterThoughts = function() {
    const useTranslation = ConfigManager.language === 'it'

    if ($gameParty.size() === 0 || $recentMonsters.length === 0) return;
    
    // Process one recent monster at a time
    const monsterId = $recentMonsters.shift();
    if (!monsterId) return;
    
    var monster = $dataEnemies[monsterId];
    if (!monster) return;
    
    // Select a random actor from the party
    const randomActor = $gameParty.members()[Math.floor(Math.random() * $gameParty.size())];
    const personality = getPersonalityType(randomActor);
    
    let thoughtText = "";
    if(useTranslation){
        monster.name = window.translateText(monster.name);
        switch (personality) {
            case PERSONALITY_TYPES.CHEERFUL:
                thoughtText = `Quel ${monster.name} è stato proprio una bella sfida!\nMa gli abbiamo fatto vedere chi comanda!`;
                break;
            case PERSONALITY_TYPES.SERIOUS:
                thoughtText = `Il ${monster.name} ha mostrato notevoli capacità di combattimento.\n Dobbiamo prepararci a incontri simili.`;
                break;
            case PERSONALITY_TYPES.ANALYTICAL:
                thoughtText = `Dati nemico: ${monster.name}.\n Livello di minaccia: moderato.\n Debolezza: potenzialmente ${['fuoco', 'ghiaccio', 'fulmine', 'fisico', 'magia'][Math.floor(Math.random() * 5)]}.`;
                break;
            case PERSONALITY_TYPES.EMOTIONAL:
                thoughtText = `Quella battaglia contro il ${monster.name} è stata terrificante!\nSto ancora tremando...`;
                break;
            case PERSONALITY_TYPES.MYSTERIOUS:
                thoughtText = `Il ${monster.name}...\n Ora la sua essenza ritorna al vuoto.\n Tutte le creature servono il grande ciclo.`;
                break;
            default:
                thoughtText = `Quel ${monster.name} era più duro di quanto sembrasse.\n Dobbiamo stare attenti se ne incontriamo altri.`;
        }

    }else{
        switch (personality) {
            case PERSONALITY_TYPES.CHEERFUL:
                thoughtText = `That ${monster.name} was quite a challenge!\nBut we showed it who's boss!`;
                break;
            case PERSONALITY_TYPES.SERIOUS:
                thoughtText = `The ${monster.name} displayed formidable combat capabilities.\n We should prepare for similar encounters.`;
                break;
            case PERSONALITY_TYPES.ANALYTICAL:
                thoughtText = `Enemy data: ${monster.name}.\n Threat level: moderate.\n Weakness: potentially ${['fire', 'ice', 'lightning', 'physical', 'magic'][Math.floor(Math.random() * 5)]}.`;
                break;
            case PERSONALITY_TYPES.EMOTIONAL:
                thoughtText = `That battle with the ${monster.name} was terrifying!\nI'm still shaking...`;
                break;
            case PERSONALITY_TYPES.MYSTERIOUS:
                thoughtText = `The ${monster.name}...\n Now its essence returns to the void.\n All creatures serve the greater cycle.`;
                break;
            default:
                thoughtText = `That ${monster.name} was tougher than it looked.\n We should be careful if we meet more.`;
        }
    }

    
    this.addThought(randomActor, thoughtText, 'monster');
};

Scene_Thoughts.prototype.generateWeatherThoughts = function() {
    const useTranslation = ConfigManager.language === 'it'

    if ($gameParty.size() === 0) return;
    
    // Only generate weather thoughts occasionally
    if (Math.random() < 0.3) {
        // Select a random actor from the party
        const randomActor = $gameParty.members()[Math.floor(Math.random() * $gameParty.size())];
        const personality = getPersonalityType(randomActor);
        
        let weatherType = "clear";
        if ($gameScreen.weatherType === 1) weatherType = "rain";
        else if ($gameScreen.weatherType === 2) weatherType = "storm";
        else if ($gameScreen.weatherType === 3) weatherType = "snow";
        
        let thoughtText = "";
        
        switch (weatherType) {
            case "rain":
                if(useTranslation){
                    switch (personality) {
                        case PERSONALITY_TYPES.CHEERFUL:
                            thoughtText = "Pioggia, pioggia, non andare via!\nAdoro saltare nelle pozzanghere!";
                            break;
                        case PERSONALITY_TYPES.SERIOUS:
                            thoughtText = "Questa pioggia rallenterà il nostro progresso.\n Dovremmo trovare riparo presto.";
                            break;
                        case PERSONALITY_TYPES.ANALYTICAL:
                            thoughtText = "Precipitazioni: moderate.\n Visibilità: ridotta del 24%.\n Aderenza al terreno: diminuita del 37%.";
                            break;
                        case PERSONALITY_TYPES.EMOTIONAL:
                            thoughtText = "La pioggia mi rende malinconico...\n eppure c'è anche bellezza in essa.";
                            break;
                        case PERSONALITY_TYPES.MYSTERIOUS:
                            thoughtText = "Le lacrime del cielo lavano via segreti...\n e ne rivelano altri.";
                            break;
                        default:
                            thoughtText = "La pioggia si sta intensificando.\n Dovremmo trovare riparo presto.";
                    }

                }else{
                    switch (personality) {
                        case PERSONALITY_TYPES.CHEERFUL:
                            thoughtText = "Rain, rain, don't go away!\nI love splashing in puddles!";
                            break;
                        case PERSONALITY_TYPES.SERIOUS:
                            thoughtText = "This rain will slow our progress.\n We should find shelter soon.";
                            break;
                        case PERSONALITY_TYPES.ANALYTICAL:
                            thoughtText = "Precipitation: moderate.\n Visibility: reduced by 24%.\n Terrain traction: decreased by 37%.";
                            break;
                        case PERSONALITY_TYPES.EMOTIONAL:
                            thoughtText = "The rain makes me feel melancholy...\n yet there's beauty in it too.";
                            break;
                        case PERSONALITY_TYPES.MYSTERIOUS:
                            thoughtText = "The tears of the sky wash away secrets...\n and reveal others.";
                            break;
                        default:
                            thoughtText = "This rain is getting heavier.\n We should find shelter soon.";
                    }    
                }
 
                break;
            case "storm":
                if(useTranslation){
                    switch (personality) {
                        case PERSONALITY_TYPES.CHEERFUL:
                            thoughtText = "Wow!\nChe tempesta!\nÈ emozionante, ma anche un po' spaventosa!";
                            break;
                        case PERSONALITY_TYPES.SERIOUS:
                            thoughtText = "Questa tempesta è pericolosa.\n Dobbiamo cercare subito riparo.";
                            break;
                        case PERSONALITY_TYPES.ANALYTICAL:
                            thoughtText = "Condizioni della tempesta: gravi.\n Probabilità di fulmini: 4,3%.\n Azione consigliata: trovare riparo.";
                            break;
                        case PERSONALITY_TYPES.EMOTIONAL:
                            thoughtText = "Questa tempesta...\n Sento la sua rabbia e potenza.\n È terrificante e maestosa.";
                            break;
                        case PERSONALITY_TYPES.MYSTERIOUS:
                            thoughtText = "I cieli combattono con la terra...\n Una battaglia di antichi elementi.";
                            break;
                        default:
                            thoughtText = "Questa tempesta sta diventando pericolosa.\n Dobbiamo trovare riparo in fretta.";
                    }

                }else{
                    switch (personality) {
                        case PERSONALITY_TYPES.CHEERFUL:
                            thoughtText = "Wow!\nWhat a storm!\nIt's exciting, but a bit scary too!";
                            break;
                        case PERSONALITY_TYPES.SERIOUS:
                            thoughtText = "This storm is dangerous.\n We need to seek immediate shelter.";
                            break;
                        case PERSONALITY_TYPES.ANALYTICAL:
                            thoughtText = "Storm conditions: severe.\n Lightning strike probability: 4.3%.\n Recommended action: shelter.";
                            break;
                        case PERSONALITY_TYPES.EMOTIONAL:
                            thoughtText = "This storm...\n I can feel its rage and power.\n It's terrifying and awe-inspiring.";
                            break;
                        case PERSONALITY_TYPES.MYSTERIOUS:
                            thoughtText = "The skies war with the earth...\n A battle of ancient elements.";
                            break;
                        default:
                            thoughtText = "This storm is getting dangerous.\n We need to find shelter quickly.";
                    }
                }

                break;
            case "snow":
                if(useTranslation){
                    switch (personality) {
                        case PERSONALITY_TYPES.CHEERFUL:
                            thoughtText = "Neve!\nCosì bella e divertente!\nPossiamo fare un pupazzo di neve dopo?";
                            break;
                        case PERSONALITY_TYPES.SERIOUS:
                            thoughtText = "La neve renderà difficile il viaggio.\n Dobbiamo mantenere il calore.";
                            break;
                        case PERSONALITY_TYPES.ANALYTICAL:
                            thoughtText = "Nevicata: moderata.\n Temperatura: circa -3°C.\n Rischio di ipotermia: in aumento.";
                            break;
                        case PERSONALITY_TYPES.EMOTIONAL:
                            thoughtText = "La neve ricopre tutto di bianco e pace...\n È così serena e delicata.";
                            break;
                        case PERSONALITY_TYPES.MYSTERIOUS:
                            thoughtText = "Il silenzio bianco...\n Il sudario della natura sul mondo vivente.";
                            break;
                        default:
                            thoughtText = "Sta facendo più freddo con questa neve.\n Dovremmo continuare a muoverci per restare caldi.";
                    }

                }else{
                    switch (personality) {
                        case PERSONALITY_TYPES.CHEERFUL:
                            thoughtText = "Snow!\nSo pretty and fun!\nCan we build a snowman later?";
                            break;
                        case PERSONALITY_TYPES.SERIOUS:
                            thoughtText = "The snow will make travel difficult.\n We must maintain our warmth.";
                            break;
                        case PERSONALITY_TYPES.ANALYTICAL:
                            thoughtText = "Snowfall: moderate.\n Temperature: approximately -3°C.\n Risk of hypothermia: increasing.";
                            break;
                        case PERSONALITY_TYPES.EMOTIONAL:
                            thoughtText = "The snow blankets everything in peaceful white...\n It's so serene and gentle.";
                            break;
                        case PERSONALITY_TYPES.MYSTERIOUS:
                            thoughtText = "The white silence...\n Nature's shroud over the living world.";
                            break;
                        default:
                            thoughtText = "It's getting colder with this snow.\n We should keep moving to stay warm.";
                    }
                }

                break;
            default: // Clear
            if(useTranslation){
                switch (personality) {
                    
                    case PERSONALITY_TYPES.CHEERFUL:
                        thoughtText = "Che giornata splendida!\nIl sole rende tutto migliore!";
                        break;
                    case PERSONALITY_TYPES.SERIOUS:
                        thoughtText = "Condizioni meteorologiche serene.\n Ottimali per avanzare.";
                        break;
                    case PERSONALITY_TYPES.ANALYTICAL:
                        thoughtText = "Meteo: sereno.\n Visibilità: 100%.\n Condizioni: ideali per esplorazione e combattimento.";
                        break;
                    case PERSONALITY_TYPES.EMOTIONAL:
                        thoughtText = "Il cielo limpido mi riempie di speranza...\n Come se oggi tutto fosse possibile.";
                        break;
                    case PERSONALITY_TYPES.MYSTERIOUS:
                        thoughtText = "I cieli limpidi nascondono tanti segreti quanto quelli nuvolosi...\n Forse di più.";
                        break;
                    default:
                        thoughtText = "Il tempo è perfetto per viaggiare oggi.\n Dovremmo fare buoni progressi.";
                }

            }else{
                switch (personality) {
                    
                    case PERSONALITY_TYPES.CHEERFUL:
                        thoughtText = "What a beautiful day!\nThe sun makes everything better!";
                        break;
                    case PERSONALITY_TYPES.SERIOUS:
                        thoughtText = "Clear weather conditions.\n Optimal for making progress.";
                        break;
                    case PERSONALITY_TYPES.ANALYTICAL:
                        thoughtText = "Weather: clear.\n Visibility: 100%.\n Conditions: ideal for exploration and combat.";
                        break;
                    case PERSONALITY_TYPES.EMOTIONAL:
                        thoughtText = "The clear skies fill me with hope...\n Like anything is possible today.";
                        break;
                    case PERSONALITY_TYPES.MYSTERIOUS:
                        thoughtText = "Clear skies hide as many secrets as clouded ones...\n Perhaps more.";
                        break;
                    default:
                        thoughtText = "The weather is perfect for traveling today.\n We should make good progress.";
                } 
            }

        }
        
        this.addThought(randomActor, thoughtText, 'weather');
    }
};

Scene_Thoughts.prototype.generateTimeThoughts = function() {
    const useTranslation = ConfigManager.language === 'it'

    if ($gameParty.size() === 0) return;
    
    // Only generate time thoughts occasionally
    if (Math.random() < 0.3) {
        // Select a random actor from the party
        const randomActor = $gameParty.members()[Math.floor(Math.random() * $gameParty.size())];
        const personality = getPersonalityType(randomActor);
        
        // Determine time of day based on game variables or system time
        let hour = 0;
        if ($gameVariables.value(1) > 0 && $gameVariables.value(1) <= 24) {
            // If game uses a time variable
            hour = $gameVariables.value(1);
        } else {
            // Use system time as fallback
            hour = new Date().getHours();
        }
        
        let timeOfDay = "";
        if (hour >= 5 && hour < 12) timeOfDay = "morning";
        else if (hour >= 12 && hour < 17) timeOfDay = "afternoon";
        else if (hour >= 17 && hour < 21) timeOfDay = "evening";
        else timeOfDay = "night";
        
        let thoughtText = "";
        if(useTranslation){
            switch (timeOfDay) {
            
                case "morning":
                    switch (personality) {
                        case PERSONALITY_TYPES.CHEERFUL:
                            thoughtText = "Buongiorno, mondo!\nSono pronto per una giornata piena di avventure!";
                            break;
                        case PERSONALITY_TYPES.SERIOUS:
                            thoughtText = "Mattina.\n Il momento ottimale per iniziare i nostri obiettivi della giornata.";
                            break;
                        case PERSONALITY_TYPES.ANALYTICAL:
                            thoughtText = "Orario: mattina.\n Condizioni di luce: in miglioramento.\n Livelli di energia: ottimali per l'esecuzione dei compiti.";
                            break;
                        case PERSONALITY_TYPES.EMOTIONAL:
                            thoughtText = "La luce del mattino mi riempie di speranza per un nuovo inizio...";
                            break;
                        case PERSONALITY_TYPES.MYSTERIOUS:
                            thoughtText = "L'alba annuncia nuove possibilità...\n e nuovi pericoli.";
                            break;
                        default:
                            thoughtText = "È già mattina.\n Dovremmo sfruttare al massimo la luce del giorno.";
                    }
                    break;
                case "afternoon":
                    switch (personality) {
                        case PERSONALITY_TYPES.CHEERFUL:
                            thoughtText = "La giornata è al massimo!\nCosì tanto da fare e così tanto divertimento!";
                            break;
                        case PERSONALITY_TYPES.SERIOUS:
                            thoughtText = "Pomeriggio.\n Dobbiamo continuare a fare progressi finché la luce del giorno resta forte.";
                            break;
                        case PERSONALITY_TYPES.ANALYTICAL:
                            thoughtText = "Orario: pomeriggio.\n Luce diurna residua: circa 5-7 ore.\n Pianificare di conseguenza.";
                            break;
                        case PERSONALITY_TYPES.EMOTIONAL:
                            thoughtText = "Il sole del pomeriggio è così caldo e rassicurante sulla pelle...";
                            break;
                        case PERSONALITY_TYPES.MYSTERIOUS:
                            thoughtText = "Il sole inizia la sua discesa...\n Il tempo scorre inesorabile, trascinandoci con sé.";
                            break;
                        default:
                            thoughtText = "È metà giornata.\n Stiamo facendo buoni progressi.";
                    }
                    break;
                case "evening":
                    switch (personality) {
                        case PERSONALITY_TYPES.CHEERFUL:
                            thoughtText = "Già sera? La giornata è volata quando ci si diverte!";
                            break;
                        case PERSONALITY_TYPES.SERIOUS:
                            thoughtText = "Si avvicina la sera.\n Dovremmo pensare presto a un alloggio per la notte.";
                            break;
                        case PERSONALITY_TYPES.ANALYTICAL:
                            thoughtText = "Orario: sera.\n Condizioni di luce: in peggioramento.\n Consigliato trovare riparo entro 2,5 ore.";
                            break;
                        case PERSONALITY_TYPES.EMOTIONAL:
                            thoughtText = "La luce della sera è così bella...\n dorata e soffusa.\n Mi fa sentire nostalgico.";
                            break;
                        case PERSONALITY_TYPES.MYSTERIOUS:
                            thoughtText = "Il velo tra i mondi si assottiglia mentre si avvicina l'oscurità...";
                            break;
                        default:
                            thoughtText = "Sta arrivando la sera.\n Dovremmo pensare a trovare un posto sicuro dove riposare presto.";
                    }
                    break;
                case "night":
                    switch (personality) {
                        case PERSONALITY_TYPES.CHEERFUL:
                            thoughtText = "Notte!\nCi sono ancora tante avventure da vivere sotto le stelle!";
                            break;
                        case PERSONALITY_TYPES.SERIOUS:
                            thoughtText = "È calata la notte.\n La visibilità è ridotta.\n Dobbiamo essere molto vigili.";
                            break;
                        case PERSONALITY_TYPES.ANALYTICAL:
                            thoughtText = "Orario: notte.\n Visibilità: ridotta del 78%.\n Probabilità di incontro con nemici: aumentata del 42%.";
                            break;
                        case PERSONALITY_TYPES.EMOTIONAL:
                            thoughtText = "La notte è così buia e misteriosa...\n Mi fa sentire sia paura che fascino.";
                            break;
                        case PERSONALITY_TYPES.MYSTERIOUS:
                            thoughtText = "Notte...\n Quando gli antichi dei sussurrano e le ombre prendono forma.";
                            break;
                        default:
                            thoughtText = "Si sta facendo tardi.\n Dobbiamo stare attenti nell'oscurità.";
                    }
            }

        }else{
            switch (timeOfDay) {
            
                case "morning":
                    switch (personality) {
                        case PERSONALITY_TYPES.CHEERFUL:
                            thoughtText = "Good morning, world!\nI'm ready for a day full of adventures!";
                            break;
                        case PERSONALITY_TYPES.SERIOUS:
                            thoughtText = "Morning.\n The optimal time to begin our objectives for the day.";
                            break;
                        case PERSONALITY_TYPES.ANALYTICAL:
                            thoughtText = "Time: morning.\n Light conditions: improving.\n Energy levels: optimal for task execution.";
                            break;
                        case PERSONALITY_TYPES.EMOTIONAL:
                            thoughtText = "The morning light fills me with hope for a new beginning...";
                            break;
                        case PERSONALITY_TYPES.MYSTERIOUS:
                            thoughtText = "The dawn heralds new possibilities...\n and new dangers.";
                            break;
                        default:
                            thoughtText = "It's morning already.\n We should make the most of the daylight.";
                    }
                    break;
                case "afternoon":
                    switch (personality) {
                        case PERSONALITY_TYPES.CHEERFUL:
                            thoughtText = "The day is in full swing!\nSo much to do, so much fun to have!";
                            break;
                        case PERSONALITY_TYPES.SERIOUS:
                            thoughtText = "Afternoon.\n We should continue to make progress while daylight remains strong.";
                            break;
                        case PERSONALITY_TYPES.ANALYTICAL:
                            thoughtText = "Time: afternoon.\n Daylight remaining: approximately 5-7 hours.\n Plan accordingly.";
                            break;
                        case PERSONALITY_TYPES.EMOTIONAL:
                            thoughtText = "The afternoon sun feels so warm and comforting on my skin...";
                            break;
                        case PERSONALITY_TYPES.MYSTERIOUS:
                            thoughtText = "The sun begins its descent...\n Time flows ever onward, pulling us with it.";
                            break;
                        default:
                            thoughtText = "It's the middle of the day.\n We're making good progress.";
                    }
                    break;
                case "evening":
                    switch (personality) {
                        case PERSONALITY_TYPES.CHEERFUL:
                            thoughtText = "Evening already? The day went by so fast when you're having fun!";
                            break;
                        case PERSONALITY_TYPES.SERIOUS:
                            thoughtText = "Evening approaches.\n We should consider our lodging for the night soon.";
                            break;
                        case PERSONALITY_TYPES.ANALYTICAL:
                            thoughtText = "Time: evening.\n Light conditions: deteriorating.\n Recommend securing shelter within 2.5 hours.";
                            break;
                        case PERSONALITY_TYPES.EMOTIONAL:
                            thoughtText = "The evening light is so beautiful...\n golden and soft.\n It makes me feel nostalgic.";
                            break;
                        case PERSONALITY_TYPES.MYSTERIOUS:
                            thoughtText = "The veil between worlds thins as darkness approaches...";
                            break;
                        default:
                            thoughtText = "Evening is coming.\n We should think about finding a safe place to rest soon.";
                    }
                    break;
                case "night":
                    switch (personality) {
                        case PERSONALITY_TYPES.CHEERFUL:
                            thoughtText = "Night time!\nStill plenty of adventures to be had under the stars!";
                            break;
                        case PERSONALITY_TYPES.SERIOUS:
                            thoughtText = "Night has fallen.\n Visibility is reduced.\n We must be extra vigilant.";
                            break;
                        case PERSONALITY_TYPES.ANALYTICAL:
                            thoughtText = "Time: night.\n Visibility: reduced by 78%.\n Enemy encounter probability: increased by 42%.";
                            break;
                        case PERSONALITY_TYPES.EMOTIONAL:
                            thoughtText = "The night is so dark and mysterious...\n I feel both afraid and fascinated.";
                            break;
                        case PERSONALITY_TYPES.MYSTERIOUS:
                            thoughtText = "Night...\n When the old gods whisper and shadows gain substance.";
                            break;
                        default:
                            thoughtText = "It's getting late.\n We should be careful in the darkness.";
                    }
            }
        }

        
        this.addThought(randomActor, thoughtText, 'time');
    }
};

Scene_Thoughts.prototype.generateFoodThoughts = function() {
    const useTranslation = ConfigManager.language === 'it'

    if ($gameParty.size() === 0) return;
    
    // Only generate food thoughts occasionally
    if (Math.random() < 0.4) {
        $gameParty.members().forEach(actor => {
            const actorId = actor.actorId();
            if (!$lastPartyState.hungerLevels[actorId]) return;
            
            const personality = getPersonalityType(actor);
            const hungerLevel = $lastPartyState.hungerLevels[actorId];
            
            // Only generate thoughts at certain hunger thresholds
            let thoughtText = "";
            
            if (hungerLevel <= 20) {
                // Very hungry
                if(useTranslation){
                    switch (personality) {
                        case PERSONALITY_TYPES.CHEERFUL:
                            thoughtText = "Sto morendo di fame!\nMi farei volentieri un bel pasto abbondante adesso!";
                            break;
                        case PERSONALITY_TYPES.SERIOUS:
                            thoughtText = "Stato di fame: critico.\n È necessario del cibo per mantenere le prestazioni.";
                            break;
                        case PERSONALITY_TYPES.ANALYTICAL:
                            thoughtText = "Deficit calorico rilevato.\n Efficienza operativa stimata: ridotta del 32%.";
                            break;
                        case PERSONALITY_TYPES.EMOTIONAL:
                            thoughtText = "Ho così tanta fame che fa male...\n Riesco a pensare solo a quello...";
                            break;
                        case PERSONALITY_TYPES.MYSTERIOUS:
                            thoughtText = "Il vuoto dentro riflette il vuoto fuori...\n Ho bisogno di nutrimento.";
                            break;
                        default:
                            thoughtText = "Sto letteralmente morendo di fame.\n Dobbiamo trovare del cibo presto.";
                    }

                }else{
                    switch (personality) {
                        case PERSONALITY_TYPES.CHEERFUL:
                            thoughtText = "I'm starving!\nCould really go for a nice big meal right now!";
                            break;
                        case PERSONALITY_TYPES.SERIOUS:
                            thoughtText = "Hunger status: critical.\n Food is required to maintain performance.";
                            break;
                        case PERSONALITY_TYPES.ANALYTICAL:
                            thoughtText = "Caloric deficit detected.\n Estimated operational efficiency: decreased by 32%.";
                            break;
                        case PERSONALITY_TYPES.EMOTIONAL:
                            thoughtText = "I'm so hungry it hurts...\n I can barely think of anything else...";
                            break;
                        case PERSONALITY_TYPES.MYSTERIOUS:
                            thoughtText = "The emptiness within mirrors the void without...\n I require sustenance.";
                            break;
                        default:
                            thoughtText = "I'm absolutely starving.\n We need to find food soon.";
                    }          
                }
  
                this.addThought(actor, thoughtText, 'food');
            } else if (hungerLevel <= 40 && Math.random() < 0.5) {
                // Hungry
                if(useTranslation){
                    switch (personality) {
                        case PERSONALITY_TYPES.CHEERFUL:
                            thoughtText = "Sto iniziando ad avere fame!\nChissà cosa c'è per cena stasera?";
                            break;
                        case PERSONALITY_TYPES.SERIOUS:
                            thoughtText = "Fame rilevata.\n Un pasto sarebbe consigliabile entro un'ora.";
                            break;
                        case PERSONALITY_TYPES.ANALYTICAL:
                            thoughtText = "Livelli di fame: moderati.\n Consigliato consumare cibo entro 2-3 ore.";
                            break;
                        case PERSONALITY_TYPES.EMOTIONAL:
                            thoughtText = "Il mio stomaco inizia a brontolare...\n Spero che potremo mangiare presto.";
                            break;
                        case PERSONALITY_TYPES.MYSTERIOUS:
                            thoughtText = "I bisogni mortali del corpo chiamano...\n La fame cresce dentro.";
                            break;
                        default:
                            thoughtText = "Mi servirebbe qualcosa da mangiare presto.\n Sto iniziando ad avere fame.";
                    }

                }else{
                    switch (personality) {
                        case PERSONALITY_TYPES.CHEERFUL:
                            thoughtText = "Getting a bit hungry!\nI wonder what's for dinner tonight?";
                            break;
                        case PERSONALITY_TYPES.SERIOUS:
                            thoughtText = "Hunger noted.\n A meal would be advisable within the next hour.";
                            break;
                        case PERSONALITY_TYPES.ANALYTICAL:
                            thoughtText = "Hunger levels: moderate.\n Recommend food consumption within 2-3 hours.";
                            break;
                        case PERSONALITY_TYPES.EMOTIONAL:
                            thoughtText = "My stomach is starting to growl...\n I hope we can eat something soon.";
                            break;
                        case PERSONALITY_TYPES.MYSTERIOUS:
                            thoughtText = "The body's mortal needs call...\n Hunger grows within.";
                            break;
                        default:
                            thoughtText = "I could use something to eat soon.\n Getting hungry.";
                    }
                }
  
                this.addThought(actor, thoughtText, 'food');
            } else if (hungerLevel >= 90 && Math.random() < 0.5) {
                // Just ate
                if(useTranslation){
                    switch (personality) {
                        case PERSONALITY_TYPES.CHEERFUL:
                            thoughtText = "Mmm!\nEra delizioso!\nNiente è meglio di una pancia piena!";
                            break;
                        case PERSONALITY_TYPES.SERIOUS:
                            thoughtText = "Requisiti nutrizionali soddisfatti.\n Livelli di energia ripristinati.";
                            break;
                        case PERSONALITY_TYPES.ANALYTICAL:
                            thoughtText = "Nutrimento acquisito.\n Apporto calorico: adeguato.\n Livelli di prestazione: ottimali.";
                            break;
                        case PERSONALITY_TYPES.EMOTIONAL:
                            thoughtText = "Quel pasto è stato così appagante...\n Ora mi sento contento e felice.";
                            break;
                        case PERSONALITY_TYPES.MYSTERIOUS:
                            thoughtText = "Sostentamento consumato...\n La vita continua il suo ciclo eterno.";
                            break;
                        default:
                            thoughtText = "Quel pasto era proprio quello che ci voleva.\n Ora mi sento molto meglio.";
                    }

                }else{
                    switch (personality) {
                        case PERSONALITY_TYPES.CHEERFUL:
                            thoughtText = "Mmm!\nThat was delicious!\nNothing better than a full tummy!";
                            break;
                        case PERSONALITY_TYPES.SERIOUS:
                            thoughtText = "Nutritional requirements satisfied.\n Energy levels restored.";
                            break;
                        case PERSONALITY_TYPES.ANALYTICAL:
                            thoughtText = "Nutrition acquired.\n Caloric intake: adequate.\n Performance levels: optimal.";
                            break;
                        case PERSONALITY_TYPES.EMOTIONAL:
                            thoughtText = "That meal was so satisfying...\n I feel content and happy now.";
                            break;
                        case PERSONALITY_TYPES.MYSTERIOUS:
                            thoughtText = "Sustenance consumed...\n Life continues its eternal cycle.";
                            break;
                        default:
                            thoughtText = "That meal was exactly what I needed.\n I feel much better now.";
                    }
                }
  
                this.addThought(actor, thoughtText, 'food');
            }
        });
    }
};

Scene_Thoughts.prototype.generateSleepThoughts = function() {
    if ($gameParty.size() === 0) return;
    const useTranslation = ConfigManager.language === 'it'

    // Only generate sleep thoughts occasionally
    if (Math.random() < 0.4) {
        $gameParty.members().forEach(actor => {
            const actorId = actor.actorId();
            if (!$lastPartyState.fatigueLevels[actorId]) return;
            
            const personality = getPersonalityType(actor);
            const fatigueLevel = $lastPartyState.fatigueLevels[actorId];
            
            // Only generate thoughts at certain fatigue thresholds
            let thoughtText = "";
            
            if (fatigueLevel >= 80) {
                // Very tired
                if(useTranslation){
                    switch (personality) {
                        case PERSONALITY_TYPES.CHEERFUL:
                            thoughtText = "Ho taaanto sonno...\n *yawn* ...ma sono ancora pronto per l'avventura!";
                            break;
                        case PERSONALITY_TYPES.SERIOUS:
                            thoughtText = "Livelli di fatica critici.\n Riposo necessario per mantenere lo stato operativo.";
                            break;
                        case PERSONALITY_TYPES.ANALYTICAL:
                            thoughtText = "Privazione del sonno: grave.\n Efficienza cognitiva ridotta del 47%.\n Riposo immediato consigliato.";
                            break;
                        case PERSONALITY_TYPES.EMOTIONAL:
                            thoughtText = "Riesco a malapena a tenere gli occhi aperti...\n Ho un bisogno disperato di dormire...";
                            break;
                        case PERSONALITY_TYPES.MYSTERIOUS:
                            thoughtText = "L'oscurità mi chiama al sonno...\n La mia coscienza svanisce.";
                            break;
                        default:
                            thoughtText = "Sono esausto.\n Dobbiamo trovare presto un posto dove riposare.";
                    }

                }else{
                    switch (personality) {
                        case PERSONALITY_TYPES.CHEERFUL:
                            thoughtText = "Sooo sleepy...\n *yawn* ...but still ready for adventure!";
                            break;
                        case PERSONALITY_TYPES.SERIOUS:
                            thoughtText = "Fatigue levels critical.\n Rest required to maintain operational status.";
                            break;
                        case PERSONALITY_TYPES.ANALYTICAL:
                            thoughtText = "Sleep deprivation: severe.\n Cognitive efficiency reduced by 47%.\n Recommend immediate rest.";
                            break;
                        case PERSONALITY_TYPES.EMOTIONAL:
                            thoughtText = "I can barely keep my eyes open...\n I need sleep so badly...";
                            break;
                        case PERSONALITY_TYPES.MYSTERIOUS:
                            thoughtText = "The darkness calls me to slumber...\n My consciousness fades.";
                            break;
                        default:
                            thoughtText = "I'm exhausted.\n We need to find a place to rest soon.";
                    }                   
                }

                this.addThought(actor, thoughtText, 'sleep');
            } else if (fatigueLevel >= 60 && Math.random() < 0.5) {
                // Tired
                if(useTranslation){
                    switch (personality) {
                        case PERSONALITY_TYPES.CHEERFUL:
                            thoughtText = "Sto iniziando a stancarmi!\nUn pisolino ci starebbe bene presto!";
                            break;
                        case PERSONALITY_TYPES.SERIOUS:
                            thoughtText = "Fatica in accumulo.\n Sarà necessario riposare a breve.";
                            break;
                        case PERSONALITY_TYPES.ANALYTICAL:
                            thoughtText = "Livelli di fatica: moderati.\n Efficienza stimata: ridotta del 24%.\n Riposo consigliato.";
                            break;
                        case PERSONALITY_TYPES.EMOTIONAL:
                            thoughtText = "Mi sento così stanco...\n Ho le membra pesanti e la mente annebbiata...";
                            break;
                        case PERSONALITY_TYPES.MYSTERIOUS:
                            thoughtText = "La stanchezza si insinua nelle mie ossa...\n Il mondo dei sogni mi chiama.";
                            break;
                        default:
                            thoughtText = "Sto iniziando a stancarmi.\n Dovremmo pensare di riposare nelle prossime ore.";
                    }

                }else{
                    switch (personality) {
                        case PERSONALITY_TYPES.CHEERFUL:
                            thoughtText = "Getting a bit tired!\nA nap would be nice soon!";
                            break;
                        case PERSONALITY_TYPES.SERIOUS:
                            thoughtText = "Fatigue accumulating.\n Rest will be required in the near future.";
                            break;
                        case PERSONALITY_TYPES.ANALYTICAL:
                            thoughtText = "Fatigue levels: moderate.\n Estimated efficiency: decreased by 24%.\n Rest recommended.";
                            break;
                        case PERSONALITY_TYPES.EMOTIONAL:
                            thoughtText = "I'm feeling so tired...\n My limbs are heavy and my mind is foggy...";
                            break;
                        case PERSONALITY_TYPES.MYSTERIOUS:
                            thoughtText = "Weariness creeps through my bones...\n The dream world beckons.";
                            break;
                        default:
                            thoughtText = "I'm getting tired.\n We should consider resting in the next few hours.";
                    }           
                }
 
                this.addThought(actor, thoughtText, 'sleep');
            } else if (fatigueLevel <= 10 && Math.random() < 0.5) {
                // Just woke up / Well rested
                if(useTranslation){
                    switch (personality) {
                        case PERSONALITY_TYPES.CHEERFUL:
                            thoughtText = "Mi sento fresco e pieno di energie!\nPronto per un nuovo giorno di avventure!";
                            break;
                        case PERSONALITY_TYPES.SERIOUS:
                            thoughtText = "Ciclo di riposo completato.\n Facoltà fisiche e mentali alla capacità ottimale.";
                            break;
                        case PERSONALITY_TYPES.ANALYTICAL:
                            thoughtText = "Stato del sonno: eccellente.\n Acutezza mentale: aumentata del 27%.\n Prestazioni fisiche: ottimali.";
                            break;
                        case PERSONALITY_TYPES.EMOTIONAL:
                            thoughtText = "Ho dormito così bene...\n Mi sento in pace e pronto ad affrontare qualsiasi cosa.";
                            break;
                        case PERSONALITY_TYPES.MYSTERIOUS:
                            thoughtText = "Emergo dal regno dei sogni...\n Rinnovato e di nuovo consapevole.";
                            break;
                        default:
                            thoughtText = "È stato un buon riposo.\n Mi sento completamente rinvigorito.";
                    }

                }else{
                    switch (personality) {
                        case PERSONALITY_TYPES.CHEERFUL:
                            thoughtText = "I feel refreshed and energized!\nReady for a new day of adventures!";
                            break;
                        case PERSONALITY_TYPES.SERIOUS:
                            thoughtText = "Rest cycle complete.\n Physical and mental faculties at optimal capacity.";
                            break;
                        case PERSONALITY_TYPES.ANALYTICAL:
                            thoughtText = "Sleep status: excellent.\n Mental acuity: increased by 27%.\n Physical performance: optimal.";
                            break;
                        case PERSONALITY_TYPES.EMOTIONAL:
                            thoughtText = "I slept so well...\n I feel peaceful and ready to face whatever comes.";
                            break;
                        case PERSONALITY_TYPES.MYSTERIOUS:
                            thoughtText = "Emerging from the realm of dreams...\n Renewed and aware once more.";
                            break;
                        default:
                            thoughtText = "That was a good rest.\n I feel completely refreshed.";
                    }
                }

                this.addThought(actor, thoughtText, 'sleep');
            }
        });
    }
};

Scene_Thoughts.prototype.generateRandomThoughts = function() {
    // Add some random thoughts if we have fewer than maxThoughts
    const useTranslation = ConfigManager.language === 'it'
    var randomThoughts = {}

    if ($thoughtHistory.length < maxThoughts) {
        // Basic random thoughts
        if(useTranslation){
            randomThoughts = {
                [PERSONALITY_TYPES.CHEERFUL]: [
                    { text: "Che bella giornata per un'avventura!", type: 'neutral' },
                    { text: "Chissà se oggi troveremo un tesoro? Sarebbe così emozionante!", type: 'neutral' },
                    { text: "Ho i piedi un po' doloranti, ma chi se ne importa quando ci divertiamo così tanto!", type: 'neutral' },
                    { text: "Non vedo l'ora di raccontare a tutti a casa del nostro fantastico viaggio!", type: 'positive' },
                    { text: "È tutto così colorato e interessante qui fuori nel mondo!", type: 'positive' }
                ],
                [PERSONALITY_TYPES.SERIOUS]: [
                    { text: "Dobbiamo rimanere concentrati sul nostro obiettivo.\n Le distrazioni potrebbero costarci care.", type: 'neutral' },
                    { text: "Le nostre provviste tengono bene.\n Dovremmo essere preparati per la prossima parte del viaggio.", type: 'neutral' },
                    { text: "Devo continuare a migliorare le mie abilità.\n Non c'è spazio per la compiacenza.", type: 'neutral' },
                    { text: "Il terreno davanti sembra impegnativo.\n Dovremmo procedere con cautela.", type: 'neutral' },
                    { text: "La nostra formazione potrebbe essere ottimizzata per migliori capacità difensive.", type: 'neutral' }
                ],
                [PERSONALITY_TYPES.ANALYTICAL]: [
                    { text: "Calcolo del percorso ottimale...\n Diverse variabili da considerare.", type: 'neutral' },
                    { text: "In base alla traiettoria attuale, raggiungeremo la destinazione in circa 3,7 giorni.", type: 'neutral' },
                    { text: "La probabilità di incontro in quest'area è del 62,8% secondo i dati precedenti.", type: 'neutral' },
                    { text: "Il nostro tasso di consumo delle risorse indica che le provviste dureranno ancora 8,2 giorni.", type: 'neutral' },
                    { text: "Analisi dei modelli meteorologici...\n 73% di possibilità di condizioni favorevoli domani.", type: 'neutral' }
                ],
                [PERSONALITY_TYPES.EMOTIONAL]: [
                    { text: "Mi manca così tanto la mia famiglia...\n Spero che anche loro pensino a me.", type: 'neutral' },
                    { text: "Questo viaggio mi ha cambiato in modi che non mi aspettavo.\n Mi sento più forte dentro.", type: 'positive' },
                    { text: "A volte ho paura di ciò che ci aspetta, ma avere degli amici con me mi dà coraggio.", type: 'neutral' },
                    { text: "Il tramonto è così bello che mi fa venire le lacrime agli occhi...", type: 'neutral' },
                    { text: "Sento che siamo tutti legati in qualche modo, uniti dal destino in questo viaggio.", type: 'neutral' }
                ],
                [PERSONALITY_TYPES.MYSTERIOUS]: [
                    { text: "Le ombre sussurrano segreti a chi sa ascoltare...", type: 'neutral' },
                    { text: "Il destino tesse la sua tela intorno a noi, trascinandoci verso un futuro incerto.", type: 'neutral' },
                    { text: "Sento una presenza che ci osserva da oltre il velo della realtà.", type: 'neutral' },
                    { text: "Gli antichi dormono, ma i loro sogni toccano il nostro mondo.", type: 'neutral' },
                    { text: "Nello spazio tra un battito di cuore e l'altro si cela un'eternità di possibilità.", type: 'neutral' }
                ],
                [PERSONALITY_TYPES.DEFAULT]: [
                    { text: "Chissà cosa c'è per cena stasera...", type: 'neutral' },
                    { text: "Ho lasciato il fornello acceso a casa?", type: 'neutral' },
                    { text: "Mi manca la mia famiglia a casa.", type: 'neutral' },
                    { text: "Questa avventura è più emozionante di quanto mi aspettassi!", type: 'positive' },
                    { text: "Ho fatto di nuovo quel sogno strano la scorsa notte...", type: 'neutral' }
                ]
            };

        }else{
             randomThoughts = {
                [PERSONALITY_TYPES.CHEERFUL]: [
                    { text: "What a beautiful day for an adventure!", type: 'neutral' },
                    { text: "I wonder if we'll find treasure today? That would be so exciting!", type: 'neutral' },
                    { text: "My feet are a little sore, but who cares when we're having so much fun!", type: 'neutral' },
                    { text: "I can't wait to tell everyone back home about our amazing journey!", type: 'positive' },
                    { text: "Everything is so colorful and interesting out here in the world!", type: 'positive' }
                ],
                [PERSONALITY_TYPES.SERIOUS]: [
                    { text: "We must remain focused on our objective.\n Distractions could be costly.", type: 'neutral' },
                    { text: "Our supplies are holding steady.\n We should be prepared for the next leg of the journey.", type: 'neutral' },
                    { text: "I must continue to improve my skills.\n There's no room for complacency.", type: 'neutral' },
                    { text: "The terrain ahead appears challenging.\n We should proceed with caution.", type: 'neutral' },
                    { text: "Our formation could be optimized for better defensive capabilities.", type: 'neutral' }
                ],
                [PERSONALITY_TYPES.ANALYTICAL]: [
                    { text: "Calculating optimal path...\n Multiple variables to consider.", type: 'neutral' },
                    { text: "Based on current trajectory, we will reach our destination in approximately 3.7 days.", type: 'neutral' },
                    { text: "The probability of encounter in this area is 62.8% based on previous data.", type: 'neutral' },
                    { text: "Our resource consumption rate indicates supplies will last 8.2 more days.", type: 'neutral' },
                    { text: "Analyzing weather patterns...\n 73% chance of favorable conditions tomorrow.", type: 'neutral' }
                ],
                [PERSONALITY_TYPES.EMOTIONAL]: [
                    { text: "I miss my family so much...\n I hope they're thinking of me too.", type: 'neutral' },
                    { text: "This journey has changed me in ways I never expected.\n I feel stronger inside.", type: 'positive' },
                    { text: "Sometimes I'm scared of what lies ahead, but having friends with me gives me courage.", type: 'neutral' },
                    { text: "The sunset is so beautiful it brings tears to my eyes...", type: 'neutral' },
                    { text: "I feel like we're all connected somehow, bound by fate on this journey.", type: 'neutral' }
                ],
                [PERSONALITY_TYPES.MYSTERIOUS]: [
                    { text: "The shadows whisper secrets to those who know how to listen...", type: 'neutral' },
                    { text: "Destiny weaves its web around us, drawing us toward an uncertain future.", type: 'neutral' },
                    { text: "I sense a presence watching us from beyond the veil of reality.", type: 'neutral' },
                    { text: "The ancient ones sleep, but their dreams touch our world.", type: 'neutral' },
                    { text: "In the space between heartbeats lies an eternity of possibility.", type: 'neutral' }
                ],
                [PERSONALITY_TYPES.DEFAULT]: [
                    { text: "I wonder what's for dinner tonight...", type: 'neutral' },
                    { text: "Did I leave the stove on at home?", type: 'neutral' },
                    { text: "I miss my family back home.", type: 'neutral' },
                    { text: "This adventure is more exciting than I expected!", type: 'positive' },
                    { text: "I had that strange dream again last night...", type: 'neutral' }
                ]
            };     
        }

        
        // Status thoughts
        var statusThoughts = {}
        if(useTranslation){
            statusThoughts = {
                [PERSONALITY_TYPES.CHEERFUL]: [
                    { text: "Sto diventando più forte ogni giorno!\nPresto sarò inarrestabile!", type: 'status' },
                    { text: "I miei riflessi sono super veloci ora!\nCome un ninja!", type: 'status' },
                    { text: "Devo allenarmi di più per tenere il passo con tutti!\nMa mi sto divertendo un sacco!", type: 'status' },
                    { text: "Credo di essere più veloce!\nGuardami sfrecciare!", type: 'status' },
                    { text: "La mia magia è sempre più scintillante e potente!", type: 'status' }
                ],
                [PERSONALITY_TYPES.SERIOUS]: [
                    { text: "La mia efficacia in combattimento è migliorata in modo evidente.", type: 'status' },
                    { text: "I miei riflessi si sono affinati grazie all'allenamento costante.", type: 'status' },
                    { text: "Devo allenarmi più rigorosamente.\n Le mie capacità attuali sono insufficienti.", type: 'status' },
                    { text: "La mia velocità in combattimento è aumentata.\n Soddisfacente.", type: 'status' },
                    { text: "Le mie abilità magiche si stanno sviluppando come previsto.", type: 'status' }
                ],
                [PERSONALITY_TYPES.ANALYTICAL]: [
                    { text: "Parametro forza: aumentato del 4,3% dall'ultima valutazione.", type: 'status' },
                    { text: "Miglioramento dei riflessi rilevato.\n Tempo di reazione ridotto del 7,2%.", type: 'status' },
                    { text: "Livello di potenza attuale: subottimale.\n Raccomandazione: aumentare l'allenamento del 27%.", type: 'status' },
                    { text: "Metriche di velocità in miglioramento.\n Valore attuale: 13,8% sopra la media di base.", type: 'status' },
                    { text: "Capacità magica in espansione secondo le aspettative.\n Crescita attuale: 6,5% a settimana.", type: 'status' }
                ],
                [PERSONALITY_TYPES.EMOTIONAL]: [
                    { text: "Mi sento più forte dentro e fuori...\n Il mio cuore e il mio corpo crescono insieme.", type: 'status' },
                    { text: "I miei movimenti scorrono come l'acqua ora...\n Non mi sono mai sentito così aggraziato.", type: 'status' },
                    { text: "Temo di non diventare abbastanza forte abbastanza in fretta...\n E se deludessi tutti?", type: 'status' },
                    { text: "Mi sento così vivo quando corro ora, come se potessi gareggiare col vento!", type: 'status' },
                    { text: "La magia scorre in me come un bellissimo fiume di luce...", type: 'status' }
                ],
                [PERSONALITY_TYPES.MYSTERIOUS]: [
                    { text: "Il potere cresce dentro di me, nutrendosi sia di ombra che di luce...", type: 'status' },
                    { text: "La mia forma si muove tra i momenti ora, scivolando tra le dita del tempo.", type: 'status' },
                    { text: "Ancora troppo debole.\n Gli antichi mi troverebbero carente.", type: 'status' },
                    { text: "La velocità è un'illusione.\n Non mi muovo più veloce; è il mondo che si muove più lento.", type: 'status' },
                    { text: "L'arcano si intreccia con la mia essenza, legandoci sempre più.", type: 'status' }
                ],
                [PERSONALITY_TYPES.DEFAULT]: [
                    { text: "Mi sento più forte che mai!", type: 'status' },
                    { text: "I miei riflessi si affinano a ogni battaglia.", type: 'status' },
                    { text: "Devo allenarmi di più.\n Non sono forte come dovrei.", type: 'status' },
                    { text: "Credo di essere più veloce...\n o sono i nemici a essere più lenti?", type: 'status' },
                    { text: "Le mie abilità magiche si stanno sviluppando bene.", type: 'status' }
                ]
            };

        }else{
            statusThoughts = {
                [PERSONALITY_TYPES.CHEERFUL]: [
                    { text: "I'm getting stronger every day!\nSoon I'll be unstoppable!", type: 'status' },
                    { text: "My reflexes are super fast now!\nLike a ninja!", type: 'status' },
                    { text: "I need to train more to keep up with everyone!\nBut I'm having fun doing it!", type: 'status' },
                    { text: "I think I'm getting faster!\nWatch me zoom!", type: 'status' },
                    { text: "My magic is getting so much more sparkly and powerful!", type: 'status' }
                ],
                [PERSONALITY_TYPES.SERIOUS]: [
                    { text: "My combat effectiveness has improved by a noticeable margin.", type: 'status' },
                    { text: "My reflexes have sharpened through consistent training.", type: 'status' },
                    { text: "I need to train more rigorously.\n My current capabilities are insufficient.", type: 'status' },
                    { text: "My speed in combat situations has increased.\n This is satisfactory.", type: 'status' },
                    { text: "My magical abilities are developing according to expectations.", type: 'status' }
                ],
                [PERSONALITY_TYPES.ANALYTICAL]: [
                    { text: "Strength parameter: increased by 4.3% since last assessment.", type: 'status' },
                    { text: "Reflex improvement detected.\n Reaction time: decreased by 7.2%.", type: 'status' },
                    { text: "Current power level: suboptimal.\n Recommendation: increase training by 27%.", type: 'status' },
                    { text: "Speed metrics showing improvement.\n Current value: 13.8% above baseline.", type: 'status' },
                    { text: "Magical capacity expanding at expected rate.\n Current growth: 6.5% per week.", type: 'status' }
                ],
                [PERSONALITY_TYPES.EMOTIONAL]: [
                    { text: "I feel stronger inside and out...\n My heart and body growing together.", type: 'status' },
                    { text: "My movements flow like water now...\n I've never felt so graceful.", type: 'status' },
                    { text: "I worry I'm not growing strong enough fast enough...\n What if I let everyone down?", type: 'status' },
                    { text: "I feel so alive when I run now, like I could race the wind itself!", type: 'status' },
                    { text: "The magic flows through me like a beautiful river of light...", type: 'status' }
                ],
                [PERSONALITY_TYPES.MYSTERIOUS]: [
                    { text: "Power grows within me, feeding on shadow and light alike...", type: 'status' },
                    { text: "My form moves between moments now, slipping through time's fingers.", type: 'status' },
                    { text: "Still too weak.\n The ancient ones would find me wanting.", type: 'status' },
                    { text: "Speed is an illusion.\n I do not move faster; the world moves slower.", type: 'status' },
                    { text: "The arcane weaves itself into my essence, binding us ever closer.", type: 'status' }
                ],
                [PERSONALITY_TYPES.DEFAULT]: [
                    { text: "I feel stronger than ever before!", type: 'status' },
                    { text: "My reflexes are getting sharper with each battle.", type: 'status' },
                    { text: "I need to train more.\n I'm not as strong as I should be.", type: 'status' },
                    { text: "I think I'm getting faster...\n or are enemies getting slower?", type: 'status' },
                    { text: "My magical abilities are developing nicely.", type: 'status' }
                ]
            };  
        }

        
        // Rare thoughts (low probability)
        var rareThoughts = {}
        if(useTranslation){
            rareThoughts = {
                [PERSONALITY_TYPES.CHEERFUL]: [
                    { text: "A volte mi chiedo se siamo solo personaggi nel gioco di qualcuno!\nAhah, che pensiero sciocco!", type: 'rare' },
                    { text: "E se ci fosse qualcuno a controllare tutte le nostre azioni? Nah, assurdità!", type: 'rare' },
                    { text: "Ho fatto il sogno più strano in cui qualcuno sceglieva tutto il mio equipaggiamento e le mie azioni!", type: 'rare' },
                    { text: "Hai mai notato che quando camminiamo in fila lo facciamo PERFETTAMENTE in linea? Strano, vero?", type: 'rare' },
                    { text: "Come facciamo a portare così tanta roba senza stancarci? Zaini magici? Ehehe!", type: 'rare' }
                ],
                [PERSONALITY_TYPES.SERIOUS]: [
                    { text: "A volte considero le implicazioni filosofiche del fatto che la nostra realtà possa essere predeterminata.", type: 'rare' },
                    { text: "Il concetto di libero arbitrio sembra discutibile, dato il modello delle nostre decisioni.", type: 'rare' },
                    { text: "Ho notato anomalie nelle leggi fondamentali del nostro mondo che meritano indagine.", type: 'rare' },
                    { text: "Il nostro movimento in formazione mostra una precisione insolita che sfida il comportamento umano normale.", type: 'rare' },
                    { text: "La capacità del nostro inventario viola i principi di base della fisica.\n Questo richiede una spiegazione.", type: 'rare' }
                ],
                [PERSONALITY_TYPES.ANALYTICAL]: [
                    { text: "Ipotesi: la nostra realtà esiste come una simulazione con parametri e vincoli definiti.", type: 'rare' },
                    { text: "L'analisi statistica suggerisce che le nostre decisioni possano essere influenzate da fattori esterni: p<0.002.", type: 'rare' },
                    { text: "Analisi del sogno: schema ricorrente di essere osservati/controllati.\n Probabilità di coincidenza: 0,03%.", type: 'rare' },
                    { text: "Algoritmo di movimento rilevato nel comportamento di gruppo.\n Probabilità di occorrenza naturale: prossima allo zero.", type: 'rare' },
                    { text: "Anomalia spazio-temporale dell'inventario rilevata.\n Osservata violazione della conservazione della massa.", type: 'rare' }
                ],
                [PERSONALITY_TYPES.EMOTIONAL]: [
                    { text: "A volte mi sembra che siamo solo giocatori nella storia di qualcun altro...\n Mi fa sentire così piccolo.", type: 'rare' },
                    { text: "Ti capita mai di sentire che le tue scelte non siano davvero tue? Mi spaventa pensarci...", type: 'rare' },
                    { text: "Ho fatto un sogno inquietante in cui ero solo un burattino con dei fili...\n Sembrava così reale...", type: 'rare' },
                    { text: "Il modo in cui ci muoviamo insieme è così strano...\n Come se fossimo tutti controllati da un'unica mente...", type: 'rare' },
                    { text: "Le nostre borse dovrebbero essere impossibili da trasportare...\n Un altro mistero che mi tiene sveglio la notte.", type: 'rare' }
                ],
                [PERSONALITY_TYPES.MYSTERIOUS]: [
                    { text: "Siamo solo ombre proiettate da entità oltre il velo della nostra comprensione...", type: 'rare' },
                    { text: "Il libero arbitrio è la più grande illusione.\n I nostri percorsi sono stati scritti prima del nostro primo respiro.", type: 'rare' },
                    { text: "Nei sogni intravedo la verità: mani ci muovono come pezzi su una scacchiera cosmica.", type: 'rare' },
                    { text: "I nostri movimenti tradiscono la nostra natura di vasi per forze al di là della nostra dimensione.", type: 'rare' },
                    { text: "Le leggi della realtà si piegano intorno a noi.\n Esistiamo in una tasca tra ciò che è e ciò che sembra.", type: 'rare' }
                ],
                [PERSONALITY_TYPES.DEFAULT]: [
                    { text: "A volte mi chiedo se siamo solo personaggi nella storia di qualcun altro...", type: 'rare' },
                    { text: "E se tutto quello che facciamo fosse predeterminato da un potere superiore?", type: 'rare' },
                    { text: "Ho fatto uno strano sogno in cui qualcuno controllava le mie azioni...", type: 'rare' },
                    { text: "Ti capita mai di sentire che qualcuno osserva ogni nostra mossa?", type: 'rare' },
                    { text: "Mi chiedo perché possiamo portare così tanti oggetti senza appesantirci.", type: 'rare' }
                ]
            };

        }else{
            rareThoughts = {
                [PERSONALITY_TYPES.CHEERFUL]: [
                    { text: "Sometimes I wonder if we're just characters in someone's game!\nHaha, silly thought!", type: 'rare' },
                    { text: "What if there's someone controlling all our actions? Nah, that's just crazy talk!", type: 'rare' },
                    { text: "I had the weirdest dream that someone was picking all my equipment and actions!", type: 'rare' },
                    { text: "Ever notice how when we walk in a line, we walk EXACTLY in a line? That's odd, right?", type: 'rare' },
                    { text: "Why can we carry so much stuff without getting tired? Magic backpacks? Tee-hee!", type: 'rare' }
                ],
                [PERSONALITY_TYPES.SERIOUS]: [
                    { text: "I occasionally consider the philosophical implications that our reality may be predetermined.", type: 'rare' },
                    { text: "The concept of free will seems questionable given the patterns in our decision-making.", type: 'rare' },
                    { text: "I've noted anomalies in the fundamental laws of our world that warrant investigation.", type: 'rare' },
                    { text: "Our formation movement displays unusual precision that defies normal human behavior.", type: 'rare' },
                    { text: "Our inventory capacity violates basic principles of physics.\n This requires explanation.", type: 'rare' }
                ],
                [PERSONALITY_TYPES.ANALYTICAL]: [
                    { text: "Hypothesis: our reality exists as a simulation with defined parameters and constraints.", type: 'rare' },
                    { text: "Statistical analysis suggests our decision-making may be influenced by external factors: p<0.002.", type: 'rare' },
                    { text: "Dream state analysis: recurring pattern of being observed/controlled.\n Probability of coincidence: 0.03%.", type: 'rare' },
                    { text: "Movement algorithm detected in group behavior.\n Natural occurrence probability: near zero.", type: 'rare' },
                    { text: "Inventory space-time anomaly detected.\n Conservation of mass violation observed.", type: 'rare' }
                ],
                [PERSONALITY_TYPES.EMOTIONAL]: [
                    { text: "Sometimes I feel like we're just players in someone else's story...\n It makes me feel so small.", type: 'rare' },
                    { text: "Do you ever feel like your choices aren't really yours? It scares me to think about it...", type: 'rare' },
                    { text: "I had a disturbing dream where I was just a puppet on strings...\n It felt so real...", type: 'rare' },
                    { text: "The way we move together is so strange...\n Like we're all controlled by one mind...", type: 'rare' },
                    { text: "Our bags should be impossible to carry...\n Yet another mystery that keeps me awake at night.", type: 'rare' }
                ],
                [PERSONALITY_TYPES.MYSTERIOUS]: [
                    { text: "We are but shadows cast by entities beyond the veil of our comprehension...", type: 'rare' },
                    { text: "Free will is the grandest illusion.\n Our paths were written before our first breath.", type: 'rare' },
                    { text: "In dreams, I glimpse the truth: hands move us like pieces on a cosmic game board.", type: 'rare' },
                    { text: "Our movements betray our nature as vessels for forces beyond our dimension.", type: 'rare' },
                    { text: "The laws of reality bend around us.\n We exist in a pocket between what is and what seems.", type: 'rare' }
                ],
                [PERSONALITY_TYPES.DEFAULT]: [
                    { text: "Sometimes I wonder if we're just characters in someone else's story...", type: 'rare' },
                    { text: "What if everything we're doing is predetermined by some higher power?", type: 'rare' },
                    { text: "I had a strange dream where someone was controlling my actions...", type: 'rare' },
                    { text: "Do you ever feel like someone is watching our every move?", type: 'rare' },
                    { text: "I wonder why we can carry so many items without getting weighed down.", type: 'rare' }
                ]
            };   
        }
        let shouldUseMarkov = false;
        let markovText = null;

        
        if ($gameParty.size() > 0) {
            // Select a random actor from the party
            const randomActor = $gameParty.members()[Math.floor(Math.random() * $gameParty.size())];
            const personality = getPersonalityType(randomActor);
            
            // Determine which type of thought to generate
            let thoughtPool = randomThoughts[personality] || randomThoughts[PERSONALITY_TYPES.DEFAULT];
            if ($gameSystem._markovDatabases && 
                $gameSystem._markovDatabases[actorId] && 
                window.generateMarkovString && 
                Math.random() > 0.65) {
                
                    try {
                        markovText = window.generateMarkovString($gameSystem._markovDatabases[actorId]);
                        if (markovText && markovText.trim().length > 0) {
                            shouldUseMarkov = true;
                        }
                    } catch (error) {
                        console.warn(`Error generating Markov text for actor ${actorId}:`, error);
                    }          
            }

            if (shouldUseMarkov && markovText) {
                const wrappedText = this.wrapText(markovText, lineLength);
                this.addThought(randomActor, wrappedText, 'neutral');
            }else{
                const rand = Math.random();
            
            if (rand < 0.05) {
                // 5% chance for rare thoughts
                thoughtPool = rareThoughts[personality] || rareThoughts[PERSONALITY_TYPES.DEFAULT];
            } else if (rand < 0.25) {
                // 20% chance for status thoughts
                thoughtPool = statusThoughts[personality] || statusThoughts[PERSONALITY_TYPES.DEFAULT];
            } else if (rand < 0.45 && $gameParty.size() > 1) {
                // 20% chance for thoughts about other party members if there are any
                this.generateThoughtAboutOtherMember(randomActor);
                return;
            } else if (rand < 0.65) {
                // 20% chance for equipment thoughts
                this.generateEquipmentThought(randomActor);
                return;
            }}
            
            // Select a random thought from the chosen pool
            const randomThought = thoughtPool[Math.floor(Math.random() * thoughtPool.length)];
            const wrappedText = this.wrapText(randomThought.text, lineLength);
            this.addThought(randomActor, wrappedText, randomThought.type);
        }
    }
};

Scene_Thoughts.prototype.generateThoughtAboutOtherMember = function(actor) {
    if ($gameParty.size() <= 1) return;
    const useTranslation = ConfigManager.language === 'it'

    // Find another party member that isn't the current actor
    let otherMembers = $gameParty.members().filter(member => member.actorId() !== actor.actorId());
    
    // If there are no other members, return
    if (otherMembers.length === 0) return;
    
    // Select a random other member
    const otherActor = otherMembers[Math.floor(Math.random() * otherMembers.length)];
    
    // Make sure the other actor is alive before generating thoughts about them
    if (!otherActor.isAlive()) return;
    
    const personality = getPersonalityType(actor);
    var thoughtsAboutOthers = {}
    // Different personalities have different types of thoughts about others
    if(useTranslation){
        thoughtsAboutOthers = {
            [PERSONALITY_TYPES.CHEERFUL]: [
                { text: `${otherActor.name()} è così forte!\nSono felice che sia nella nostra squadra!`, type: 'other' },
                { text: `Chissà cosa piace fare a ${otherActor.name()} per divertirsi? Dovremmo uscire più spesso insieme!`, type: 'other' },
                { text: `${otherActor.name()} è stato fantastico nell'ultima battaglia!\nDavvero impressionante!`, type: 'other' },
                { text: `${otherActor.name()} oggi sembra un po' silenzioso.\n Dovrei provare a tirarlo su di morale!`, type: 'other' },
                { text: `Avere ${otherActor.name()} con noi rende tutto più divertente!`, type: 'other' }
            ],
            [PERSONALITY_TYPES.SERIOUS]: [
                { text: `L'efficacia in combattimento di ${otherActor.name()} è migliorata in modo evidente.`, type: 'other' },
                { text: `Le decisioni tattiche di ${otherActor.name()} sono generalmente valide.`, type: 'other' },
                { text: `${otherActor.name()} si è comportato adeguatamente nel recente conflitto.`, type: 'other' },
                { text: `${otherActor.name()} sembra affaticato.\n Il riposo migliorerebbe le sue prestazioni.`, type: 'other' },
                { text: `La presenza di ${otherActor.name()} aumenta la probabilità di sopravvivenza del gruppo.`, type: 'other' }
            ],
            [PERSONALITY_TYPES.ANALYTICAL]: [
                { text: `Progressione delle abilità di ${otherActor.name()}: +12,7% dall'inizio del viaggio.`, type: 'other' },
                { text: `Analisi dei modelli di pensiero di ${otherActor.name()}: inconcludente con i dati attuali.`, type: 'other' },
                { text: `Efficienza in combattimento di ${otherActor.name()}: 82,3%.\n Sopra la media per il suo archetipo.`, type: 'other' },
                { text: `Indicatori comportamentali di ${otherActor.name()} suggeriscono affaticamento o stress psicologico.`, type: 'other' },
                { text: `Sinergia tattica di ${otherActor.name()} con il gruppo: ottimale nel 73% degli scenari.`, type: 'other' }
            ],
            [PERSONALITY_TYPES.EMOTIONAL]: [
                { text: `${otherActor.name()} ha uno spirito così bello...\n Sono onorato di conoscerlo.`, type: 'other' },
                { text: `Mi chiedo quali sogni abbia ${otherActor.name()}? Cosa muove il suo cuore?`, type: 'other' },
                { text: `Il modo in cui ${otherActor.name()} ha combattuto è stato così ispirante...\n Mi ha toccato profondamente.`, type: 'other' },
                { text: `${otherActor.name()} sembra turbato...\n Sento la sua tristezza anche da qui.`, type: 'other' },
                { text: `Avere ${otherActor.name()} con noi dà un senso di sicurezza e calore.`, type: 'other' }
            ],
            [PERSONALITY_TYPES.MYSTERIOUS]: [
                { text: `L'aura di ${otherActor.name()} cresce.\n Le ombre riconoscono il suo potenziale.`, type: 'other' },
                { text: `Quali segreti si nascondono dietro gli occhi di ${otherActor.name()}? Quali verità cela?`, type: 'other' },
                { text: `In battaglia, ${otherActor.name()} danza con il destino.\n Impressionante, anche se inconsapevole.`, type: 'other' },
                { text: `Il silenzio di ${otherActor.name()} dice più di mille parole.\n La sua anima porta fardelli invisibili.`, type: 'other' },
                { text: `I fili del destino mi legano a ${otherActor.name()}.\n I nostri percorsi sono intrecciati.`, type: 'other' }
            ],
            [PERSONALITY_TYPES.DEFAULT]: [
                { text: `${otherActor.name()} sembra diventare più forte ogni giorno.`, type: 'other' },
                { text: `Mi chiedo a cosa stia pensando ${otherActor.name()} in questo momento.`, type: 'other' },
                { text: `${otherActor.name()} ha combattuto bene nell'ultima battaglia.`, type: 'other' },
                { text: `${otherActor.name()} è stato piuttosto silenzioso ultimamente.\n Spero che vada tutto bene.`, type: 'other' },
                { text: `Sono felice di avere ${otherActor.name()} a guardarmi le spalle.`, type: 'other' }
            ]
        };

    }else{
        thoughtsAboutOthers = {
            [PERSONALITY_TYPES.CHEERFUL]: [
                { text: `${otherActor.name()} is so cool!\nI'm glad we're on the same team!`, type: 'other' },
                { text: `I wonder what ${otherActor.name()} likes to do for fun? We should hang out more!`, type: 'other' },
                { text: `${otherActor.name()} was amazing in that last battle!\nSo impressive!`, type: 'other' },
                { text: `${otherActor.name()} seems a bit quiet today.\n I should try to cheer them up!`, type: 'other' },
                { text: `Having ${otherActor.name()} around makes everything more fun!`, type: 'other' }
            ],
            [PERSONALITY_TYPES.SERIOUS]: [
                { text: `${otherActor.name()}'s combat effectiveness has improved noticeably.`, type: 'other' },
                { text: `${otherActor.name()}'s tactical decisions are generally sound.`, type: 'other' },
                { text: `${otherActor.name()} performed adequately in the recent conflict.`, type: 'other' },
                { text: `${otherActor.name()} appears fatigued.\n Rest would improve their performance.`, type: 'other' },
                { text: `${otherActor.name()}'s presence increases our group's survival probability.`, type: 'other' }
            ],
            [PERSONALITY_TYPES.ANALYTICAL]: [
                { text: `${otherActor.name()}'s skill progression: +12.7% since journey commencement.`, type: 'other' },
                { text: `Analyzing ${otherActor.name()}'s thought patterns: inconclusive with current data.`, type: 'other' },
                { text: `${otherActor.name()}'s combat efficiency: 82.3%.\n Above average for their archetype.`, type: 'other' },
                { text: `${otherActor.name()}'s behavioral indicators suggest fatigue or psychological stress.`, type: 'other' },
                { text: `${otherActor.name()}'s tactical synergy with the group: optimal in 73% of scenarios.`, type: 'other' }
            ],
            [PERSONALITY_TYPES.EMOTIONAL]: [
                { text: `${otherActor.name()} has such a beautiful spirit...\n I'm honored to know them.`, type: 'other' },
                { text: `I wonder what dreams ${otherActor.name()} has? What drives their heart?`, type: 'other' },
                { text: `The way ${otherActor.name()} fought was so inspiring...\n It moved me deeply.`, type: 'other' },
                { text: `${otherActor.name()} seems troubled...\n I can feel their sadness from here.`, type: 'other' },
                { text: `Having ${otherActor.name()} with us brings a feeling of safety and warmth.`, type: 'other' }
            ],
            [PERSONALITY_TYPES.MYSTERIOUS]: [
                { text: `${otherActor.name()}'s aura grows stronger.\n The shadows recognize their potential.`, type: 'other' },
                { text: `What secrets lie behind ${otherActor.name()}'s eyes? What truths do they hide?`, type: 'other' },
                { text: `In battle, ${otherActor.name()} dances with fate.\n Impressive, if unconscious.`, type: 'other' },
                { text: `${otherActor.name()}'s silence speaks volumes.\n Their soul carries burdens unseen.`, type: 'other' },
                { text: `The threads of destiny bind me to ${otherActor.name()}.\n Our paths are intertwined.`, type: 'other' }
            ],
            [PERSONALITY_TYPES.DEFAULT]: [
                { text: `${otherActor.name()} seems to be getting stronger every day.`, type: 'other' },
                { text: `I wonder what ${otherActor.name()} is thinking about right now.`, type: 'other' },
                { text: `${otherActor.name()} fought well in that last battle.`, type: 'other' },
                { text: `${otherActor.name()} has been quiet lately.\n I hope everything is okay.`, type: 'other' },
                { text: `I'm glad to have ${otherActor.name()} watching my back.`, type: 'other' }
            ]
        }; 
    }

    
    // HP-related thoughts about other party members
    const otherHpPercent = (otherActor.hp / otherActor.mhp) * 100;
    
    let hpThoughts = [];
    
    if (otherHpPercent < 30) {
        // Critical HP
        if(useTranslation){
            switch (personality) {
                case PERSONALITY_TYPES.CHEERFUL:
                    hpThoughts.push({ text: `${otherActor.name()} sembra davvero ferito!\nDobbiamo aiutarlo subito!`, type: 'other' });
                    break;
                case PERSONALITY_TYPES.SERIOUS:
                    hpThoughts.push({ text: `Le ferite di ${otherActor.name()} sono gravi.\n È necessario un intervento medico urgente.`, type: 'other' });
                    break;
                case PERSONALITY_TYPES.ANALYTICAL:
                    hpThoughts.push({ text: `Salute di ${otherActor.name()}: critica (${otherHpPercent.toFixed(1)}%).\n Probabilità di sopravvivenza in rapido calo.`, type: 'other' });
                    break;
                case PERSONALITY_TYPES.EMOTIONAL:
                    hpThoughts.push({ text: `${otherActor.name()} sta soffrendo così tanto...\n Mi si spezza il cuore a vederlo così.`, type: 'other' });
                    break;
                case PERSONALITY_TYPES.MYSTERIOUS:
                    hpThoughts.push({ text: `La forza vitale di ${otherActor.name()} si affievolisce...\n Il vuoto si avvicina per reclamarlo.`, type: 'other' });
                    break;
                default:
                    hpThoughts.push({ text: `${otherActor.name()} sembra gravemente ferito.\n Dobbiamo trovare cure al più presto.`, type: 'other' });
            }

        }else{
            switch (personality) {
                case PERSONALITY_TYPES.CHEERFUL:
                    hpThoughts.push({ text: `${otherActor.name()} looks really hurt!\nWe need to help them right away!`, type: 'other' });
                    break;
                case PERSONALITY_TYPES.SERIOUS:
                    hpThoughts.push({ text: `${otherActor.name()}'s injuries are severe.\n Medical attention is urgently required.`, type: 'other' });
                    break;
                case PERSONALITY_TYPES.ANALYTICAL:
                    hpThoughts.push({ text: `${otherActor.name()}'s health: critical (${otherHpPercent.toFixed(1)}%).\n Survival probability decreasing rapidly.`, type: 'other' });
                    break;
                case PERSONALITY_TYPES.EMOTIONAL:
                    hpThoughts.push({ text: `${otherActor.name()} is suffering so much...\n It breaks my heart to see them like this.`, type: 'other' });
                    break;
                case PERSONALITY_TYPES.MYSTERIOUS:
                    hpThoughts.push({ text: `${otherActor.name()}'s life force ebbs...\n The void draws closer to claim them.`, type: 'other' });
                    break;
                default:
                    hpThoughts.push({ text: `${otherActor.name()} looks badly injured.\n We need to find healing soon.`, type: 'other' });
            }      
        }

    } else if (otherHpPercent < 50) {
        // Low HP
        if(useTranslation){
            switch (personality) {
                case PERSONALITY_TYPES.CHEERFUL:
                    hpThoughts.push({ text: `${otherActor.name()} ha preso una bella botta!\nDobbiamo medicarlo presto!`, type: 'other' });
                    break;
                case PERSONALITY_TYPES.SERIOUS:
                    hpThoughts.push({ text: `${otherActor.name()} ha subito danni moderati.\n Un trattamento sarebbe consigliabile.`, type: 'other' });
                    break;
                case PERSONALITY_TYPES.ANALYTICAL:
                    hpThoughts.push({ text: `Salute di ${otherActor.name()}: subottimale (${otherHpPercent.toFixed(1)}%).\n Efficacia in combattimento ridotta del 32%.`, type: 'other' });
                    break;
                case PERSONALITY_TYPES.EMOTIONAL:
                    hpThoughts.push({ text: `${otherActor.name()} è dolorante...\n Vorrei poter portare via la sua sofferenza.`, type: 'other' });
                    break;
                case PERSONALITY_TYPES.MYSTERIOUS:
                    hpThoughts.push({ text: `Le ferite di ${otherActor.name()} raccontano storie di battaglia...\n Il prezzo del nostro viaggio.`, type: 'other' });
                    break;
                default:
                    hpThoughts.push({ text: `${otherActor.name()} ha preso una bella botta nell'ultimo scontro.`, type: 'other' });
            }

        }else{
            switch (personality) {
                case PERSONALITY_TYPES.CHEERFUL:
                    hpThoughts.push({ text: `${otherActor.name()} took quite a beating!\nWe should patch them up soon!`, type: 'other' });
                    break;
                case PERSONALITY_TYPES.SERIOUS:
                    hpThoughts.push({ text: `${otherActor.name()} has sustained moderate damage.\n Treatment would be advisable.`, type: 'other' });
                    break;
                case PERSONALITY_TYPES.ANALYTICAL:
                    hpThoughts.push({ text: `${otherActor.name()}'s health: suboptimal (${otherHpPercent.toFixed(1)}%).\n Combat effectiveness reduced by 32%.`, type: 'other' });
                    break;
                case PERSONALITY_TYPES.EMOTIONAL:
                    hpThoughts.push({ text: `${otherActor.name()} is in pain...\n I wish I could take their suffering away.`, type: 'other' });
                    break;
                case PERSONALITY_TYPES.MYSTERIOUS:
                    hpThoughts.push({ text: `${otherActor.name()}'s wounds tell tales of battle...\n The price of our journey.`, type: 'other' });
                    break;
                default:
                    hpThoughts.push({ text: `${otherActor.name()} took quite a beating in that last fight.`, type: 'other' });
            }          
        }

    } else if (otherHpPercent > 90) {
        // Full HP
        if(useTranslation){
            switch (personality) {
                case PERSONALITY_TYPES.CHEERFUL:
                    hpThoughts.push({ text: `${otherActor.name()} sembra in super forma e pronto all'azione!`, type: 'other' });
                    break;
                case PERSONALITY_TYPES.SERIOUS:
                    hpThoughts.push({ text: `${otherActor.name()} è in condizioni fisiche ottimali.\n Bene.`, type: 'other' });
                    break;
                case PERSONALITY_TYPES.ANALYTICAL:
                    hpThoughts.push({ text: `Salute di ${otherActor.name()}: ottimale (${otherHpPercent.toFixed(1)}%).\n Aspettative di prestazione: elevate.`, type: 'other' });
                    break;
                case PERSONALITY_TYPES.EMOTIONAL:
                    hpThoughts.push({ text: `${otherActor.name()} sembra così pieno di vita e di energia...\n È meraviglioso da vedere.`, type: 'other' });
                    break;
                case PERSONALITY_TYPES.MYSTERIOUS:
                    hpThoughts.push({ text: `La forza vitale di ${otherActor.name()} brucia luminosa.\n Le ombre non possono toccarlo.`, type: 'other' });
                    break;
                default:
                    hpThoughts.push({ text: `${otherActor.name()} sembra in perfetta salute.`, type: 'other' });
            }

        }else{
            switch (personality) {
                case PERSONALITY_TYPES.CHEERFUL:
                    hpThoughts.push({ text: `${otherActor.name()} looks super healthy and ready for action!`, type: 'other' });
                    break;
                case PERSONALITY_TYPES.SERIOUS:
                    hpThoughts.push({ text: `${otherActor.name()} is at optimal physical condition.\n Good.`, type: 'other' });
                    break;
                case PERSONALITY_TYPES.ANALYTICAL:
                    hpThoughts.push({ text: `${otherActor.name()}'s health: optimal (${otherHpPercent.toFixed(1)}%).\n Performance expectations: high.`, type: 'other' });
                    break;
                case PERSONALITY_TYPES.EMOTIONAL:
                    hpThoughts.push({ text: `${otherActor.name()} looks so vibrant and full of life...\n It's wonderful to see.`, type: 'other' });
                    break;
                case PERSONALITY_TYPES.MYSTERIOUS:
                    hpThoughts.push({ text: `${otherActor.name()}'s life force burns bright.\n The shadows cannot touch them.`, type: 'other' });
                    break;
                default:
                    hpThoughts.push({ text: `${otherActor.name()} seems to be in perfect health.`, type: 'other' });
            }      
        }

    }
    
    // MP-related thoughts
    const otherMpPercent = (otherActor.mp / otherActor.mmp) * 100;
    
    let mpThoughts = [];
    
    if (otherMpPercent < 20) {
        // Low MP
        if(useTranslation){
            switch (personality) {
                case PERSONALITY_TYPES.CHEERFUL:
                    mpThoughts.push({ text: `${otherActor.name()} sembra completamente a corto di energia magica!\nMeglio tenere da parte qualche pozione per lui!`, type: 'other' });
                    break;
                case PERSONALITY_TYPES.SERIOUS:
                    mpThoughts.push({ text: `Le riserve magiche di ${otherActor.name()} sono quasi esaurite.\n Questo limita le nostre opzioni tattiche.`, type: 'other' });
                    break;
                case PERSONALITY_TYPES.ANALYTICAL:
                    mpThoughts.push({ text: `MP di ${otherActor.name()}: criticamente basso (${otherMpPercent.toFixed(1)}%).\n Efficacia magica gravemente compromessa.`, type: 'other' });
                    break;
                case PERSONALITY_TYPES.EMOTIONAL:
                    mpThoughts.push({ text: `${otherActor.name()} sembra svuotato magicamente...\n La sua aura ora è così fioca.`, type: 'other' });
                    break;
                case PERSONALITY_TYPES.MYSTERIOUS:
                    mpThoughts.push({ text: `La luce arcana dentro ${otherActor.name()} vacilla e svanisce.\n Il vuoto si avvicina.`, type: 'other' });
                    break;
                default:
                    mpThoughts.push({ text: `${otherActor.name()} sembra prosciugato di energia magica.\n Dovremmo riposare presto.`, type: 'other' });
            }

        }else{
            switch (personality) {
                case PERSONALITY_TYPES.CHEERFUL:
                    mpThoughts.push({ text: `${otherActor.name()} looks all out of magic energy!\nBetter save them some potions!`, type: 'other' });
                    break;
                case PERSONALITY_TYPES.SERIOUS:
                    mpThoughts.push({ text: `${otherActor.name()}'s magical reserves are nearly depleted.\n This limits our tactical options.`, type: 'other' });
                    break;
                case PERSONALITY_TYPES.ANALYTICAL:
                    mpThoughts.push({ text: `${otherActor.name()}'s MP: critically low (${otherMpPercent.toFixed(1)}%).\n Magical efficacy severely compromised.`, type: 'other' });
                    break;
                case PERSONALITY_TYPES.EMOTIONAL:
                    mpThoughts.push({ text: `${otherActor.name()} looks magically drained...\n Their aura feels so dim now.`, type: 'other' });
                    break;
                case PERSONALITY_TYPES.MYSTERIOUS:
                    mpThoughts.push({ text: `The arcane light within ${otherActor.name()} flickers and fades.\n The void closes in.`, type: 'other' });
                    break;
                default:
                    mpThoughts.push({ text: `${otherActor.name()} looks magically drained.\n We should rest soon.`, type: 'other' });
            }
        }

    } else if (otherMpPercent > 90) {
        // Full MP
        if(useTranslation){
            switch (personality) {
                case PERSONALITY_TYPES.CHEERFUL:
                    mpThoughts.push({ text: `La magia di ${otherActor.name()} è super carica!\nIncantesimi scintillanti in arrivo!`, type: 'other' });
                    break;
                case PERSONALITY_TYPES.SERIOUS:
                    mpThoughts.push({ text: `L'energia magica di ${otherActor.name()} è al massimo.\n Le nostre capacità offensive sono al top.`, type: 'other' });
                    break;
                case PERSONALITY_TYPES.ANALYTICAL:
                    mpThoughts.push({ text: `MP di ${otherActor.name()}: ottimale (${otherMpPercent.toFixed(1)}%).\n Potenziale di output magico: 100%.`, type: 'other' });
                    break;
                case PERSONALITY_TYPES.EMOTIONAL:
                    mpThoughts.push({ text: `L'aura magica di ${otherActor.name()} è così vivace e bellissima in questo momento...`, type: 'other' });
                    break;
                case PERSONALITY_TYPES.MYSTERIOUS:
                    mpThoughts.push({ text: `I flussi arcani scorrono forti in ${otherActor.name()}.\n Il potere irradia dal suo essere.`, type: 'other' });
                    break;
                default:
                    mpThoughts.push({ text: `${otherActor.name()} sembra traboccare di energia magica.`, type: 'other' });
            }

        }else{
            switch (personality) {
                case PERSONALITY_TYPES.CHEERFUL:
                    mpThoughts.push({ text: `${otherActor.name()}'s magic is super charged!\nSparkly spells incoming!`, type: 'other' });
                    break;
                case PERSONALITY_TYPES.SERIOUS:
                    mpThoughts.push({ text: `${otherActor.name()}'s magical energy is at full capacity.\n Our offensive capabilities are maximized.`, type: 'other' });
                    break;
                case PERSONALITY_TYPES.ANALYTICAL:
                    mpThoughts.push({ text: `${otherActor.name()}'s MP: optimal (${otherMpPercent.toFixed(1)}%).\n Magical output potential: 100%.`, type: 'other' });
                    break;
                case PERSONALITY_TYPES.EMOTIONAL:
                    mpThoughts.push({ text: `${otherActor.name()}'s magical aura is so vibrant and beautiful right now...`, type: 'other' });
                    break;
                case PERSONALITY_TYPES.MYSTERIOUS:
                    mpThoughts.push({ text: `The arcane flows strong within ${otherActor.name()}.\n Power radiates from their very being.`, type: 'other' });
                    break;
                default:
                    mpThoughts.push({ text: `${otherActor.name()} seems to be brimming with magical energy.`, type: 'other' });
            }
        }

    }
    
    // Equipment-related thoughts
    const mainWeapon = otherActor.equips()[0];
    let equipThoughts = [];
    
    if (mainWeapon) {
        if(useTranslation){
            switch (personality) {
                case PERSONALITY_TYPES.CHEERFUL:
                    equipThoughts.push({ text: `Il ${mainWeapon.name} di ${otherActor.name()} è così bello!\nVorrei poterlo provare!`, type: 'other' });
                    break;
                case PERSONALITY_TYPES.SERIOUS:
                    equipThoughts.push({ text: `Il ${mainWeapon.name} di ${otherActor.name()} sembra uno strumento di combattimento efficace.`, type: 'other' });
                    break;
                case PERSONALITY_TYPES.ANALYTICAL:
                    equipThoughts.push({ text: `${mainWeapon.name} di ${otherActor.name()}: output di danno stimato +${mainWeapon.params[2]}%.\n Valutazione di efficienza: alta.`, type: 'other' });
                    break;
                case PERSONALITY_TYPES.EMOTIONAL:
                    equipThoughts.push({ text: `Il modo in cui ${otherActor.name()} brandisce quel ${mainWeapon.name}...\n È come se fosse parte della sua anima.`, type: 'other' });
                    break;
                case PERSONALITY_TYPES.MYSTERIOUS:
                    equipThoughts.push({ text: `Il ${mainWeapon.name} di ${otherActor.name()} ha fame di battaglia.\n Ha assaporato il sangue e ne vuole ancora.`, type: 'other' });
                    break;
                default:
                    equipThoughts.push({ text: `Il ${mainWeapon.name} di ${otherActor.name()} sembra impressionante.`, type: 'other' });
            }

        }else{
            switch (personality) {
                case PERSONALITY_TYPES.CHEERFUL:
                    equipThoughts.push({ text: `${otherActor.name()}'s ${mainWeapon.name} looks so cool!\nI wish I could try it!`, type: 'other' });
                    break;
                case PERSONALITY_TYPES.SERIOUS:
                    equipThoughts.push({ text: `${otherActor.name()}'s ${mainWeapon.name} appears to be an effective combat tool.`, type: 'other' });
                    break;
                case PERSONALITY_TYPES.ANALYTICAL:
                    equipThoughts.push({ text: `${otherActor.name()}'s ${mainWeapon.name}: estimated damage output +${mainWeapon.params[2]}%.\n Efficiency rating: high.`, type: 'other' });
                    break;
                case PERSONALITY_TYPES.EMOTIONAL:
                    equipThoughts.push({ text: `The way ${otherActor.name()} wields that ${mainWeapon.name}...\n It's like it's part of their soul.`, type: 'other' });
                    break;
                case PERSONALITY_TYPES.MYSTERIOUS:
                    equipThoughts.push({ text: `${otherActor.name()}'s ${mainWeapon.name} hungers for battle.\n It has tasted blood and craves more.`, type: 'other' });
                    break;
                default:
                    equipThoughts.push({ text: `${otherActor.name()}'s ${mainWeapon.name} looks impressive.`, type: 'other' });
            }
        }

    }
    
    const armor = otherActor.equips()[3]; // Body armor
    if (armor) {
        if(useTranslation){
            switch (personality) {
                case PERSONALITY_TYPES.CHEERFUL:
                    equipThoughts.push({ text: `L'${armor.name} di ${otherActor.name()} sembra super protettivo!\nE anche stiloso!`, type: 'other' });
                    break;
                case PERSONALITY_TYPES.SERIOUS:
                    equipThoughts.push({ text: `L'${armor.name} di ${otherActor.name()} offre una protezione adeguata.\n Fa il suo dovere.`, type: 'other' });
                    break;
                case PERSONALITY_TYPES.ANALYTICAL:
                    equipThoughts.push({ text: `${armor.name} di ${otherActor.name()}: capacità difensiva +${armor.params[3]}%.\n Efficienza del materiale: soddisfacente.`, type: 'other' });
                    break;
                case PERSONALITY_TYPES.EMOTIONAL:
                    equipThoughts.push({ text: `L'${armor.name} di ${otherActor.name()} gli calza a pennello, come se fosse fatto apposta per lui...`, type: 'other' });
                    break;
                case PERSONALITY_TYPES.MYSTERIOUS:
                    equipThoughts.push({ text: `L'${armor.name} di ${otherActor.name()} porta le cicatrici di molte battaglie.\n Ogni segno racconta una storia di sopravvivenza.`, type: 'other' });
                    break;
                default:
                    equipThoughts.push({ text: `L'${armor.name} di ${otherActor.name()} offre una buona protezione.`, type: 'other' });
            }

        }else{
            switch (personality) {
                case PERSONALITY_TYPES.CHEERFUL:
                    equipThoughts.push({ text: `${otherActor.name()}'s ${armor.name} looks super protective!\nAnd stylish too!`, type: 'other' });
                    break;
                case PERSONALITY_TYPES.SERIOUS:
                    equipThoughts.push({ text: `${otherActor.name()}'s ${armor.name} provides adequate protection.\n It serves its purpose.`, type: 'other' });
                    break;
                case PERSONALITY_TYPES.ANALYTICAL:
                    equipThoughts.push({ text: `${otherActor.name()}'s ${armor.name}: defensive capacity +${armor.params[3]}%.\n Material efficiency: satisfactory.`, type: 'other' });
                    break;
                case PERSONALITY_TYPES.EMOTIONAL:
                    equipThoughts.push({ text: `${otherActor.name()}'s ${armor.name} fits them perfectly, like it was made just for them...`, type: 'other' });
                    break;
                case PERSONALITY_TYPES.MYSTERIOUS:
                    equipThoughts.push({ text: `${otherActor.name()}'s ${armor.name} bears the scars of many battles.\n Each mark tells a story of survival.`, type: 'other' });
                    break;
                default:
                    equipThoughts.push({ text: `${otherActor.name()}'s ${armor.name} provides good protection.`, type: 'other' });
            }
        }

    }
    
    // Combine all available thoughts
    const allThoughts = [
        ...thoughtsAboutOthers[personality] || thoughtsAboutOthers[PERSONALITY_TYPES.DEFAULT],
        ...hpThoughts,
        ...mpThoughts,
        ...equipThoughts
    ];
    
    // Select a random thought
    const randomThought = allThoughts[Math.floor(Math.random() * allThoughts.length)];
    const wrappedText = this.wrapText(randomThought.text, lineLength);
    this.addThought(actor, wrappedText, randomThought.type);
};

Scene_Thoughts.prototype.generateEquipmentThought = function(actor) {
    const useTranslation = ConfigManager.language === 'it'

    const equips = actor.equips().filter(item => item !== null);
    if (equips.length === 0) return;

    const randomEquip = equips[Math.floor(Math.random() * equips.length)];
    const equipType = ["weapon", "shield", "helmet", "armor", "accessory"][equips.indexOf(randomEquip)] || "item";
    let equipmentThoughts = {};
    const personality = getPersonalityType(actor);
    if(useTranslation){
        equipmentThoughts = {
            [PERSONALITY_TYPES.CHEERFUL]: [
                { text: `Questo ${randomEquip.name} è così divertente da usare!\nÈ il mio nuovo ${equipType} preferito!`, type: 'equipment' },
                { text: `Chissà se esiste un ${equipType} ancora più bello là fuori? L'avventura continua!`, type: 'equipment' },
                { text: `Il mio ${randomEquip.name} avrebbe bisogno di una bella lucidata, ma funziona ancora alla grande!`, type: 'equipment' },
                { text: `Questo ${randomEquip.name} è perfetto!\nSembra fatto apposta per me!`, type: 'equipment' },
                { text: `Scommetto che c'è un leggendario ${equipType} incredibile che aspetta solo di essere trovato!\nNon vedo l'ora di scoprirlo!`, type: 'equipment' }
            ],
            [PERSONALITY_TYPES.SERIOUS]: [
                { text: `Questo ${randomEquip.name} è adeguatamente funzionale.\n Fa il suo dovere.`, type: 'equipment' },
                { text: `Un ${equipType} superiore aumenterebbe l'efficienza in combattimento.\n Devo cercarne uno.`, type: 'equipment' },
                { text: `Il ${randomEquip.name} richiede manutenzione per mantenere prestazioni ottimali.`, type: 'equipment' },
                { text: `Questo ${randomEquip.name} è ben bilanciato e adatto al mio stile di combattimento.`, type: 'equipment' },
                { text: `Esistono ${equipType} leggendari nei documenti storici.\n Ottenerne uno sarebbe un vantaggio tattico.`, type: 'equipment' }
            ],
            [PERSONALITY_TYPES.ANALYTICAL]: [
                { text: `${randomEquip.name}: durabilità all'87,3%.\n Metriche di prestazione: sopra la media per la sua classe.`, type: 'equipment' },
                { text: `Parametri attuali del ${equipType}: subottimali.\n Probabilità di trovare equipaggiamento superiore: 62,7%.`, type: 'equipment' },
                { text: `${randomEquip.name} richiede manutenzione.\n Perdita di efficienza stimata: 12,4% ogni 24 scontri.`, type: 'equipment' },
                { text: `Specifiche di ${randomEquip.name}: allineamento ottimale con i parametri dell'utente.\n Distribuzione del peso: ideale.`, type: 'equipment' },
                { text: `Probabilità di ottenere un ${equipType} leggendario: 0,08% per dungeon.\n Calcolo valore atteso: positivo.`, type: 'equipment' }
            ],
            [PERSONALITY_TYPES.EMOTIONAL]: [
                { text: `Mi sono affezionato così tanto al mio ${randomEquip.name}...\n Ormai è parte di me.`, type: 'equipment' },
                { text: `A volte sogno di trovare un nuovo ${equipType} bellissimo che rifletta davvero il mio spirito...`, type: 'equipment' },
                { text: `Il mio povero ${randomEquip.name} ne ha passate tante con me.\n Dovrei prendermene più cura.`, type: 'equipment' },
                { text: `Questo ${randomEquip.name} sembra capirmi...\n Come se fossimo legati in qualche modo.`, type: 'equipment' },
                { text: `Mi chiedo se esista un ${equipType} leggendario con un'anima che risuoni con la mia...`, type: 'equipment' }
            ],
            [PERSONALITY_TYPES.MYSTERIOUS]: [
                { text: `Il ${randomEquip.name} sussurra di battaglie passate...\n Ha già assaporato il sangue prima del mio.`, type: 'equipment' },
                { text: `Un ${equipType} superiore attende nell'ombra.\n Ne sento il richiamo attraverso il vuoto.`, type: 'equipment' },
                { text: `Il ${randomEquip.name} svanisce come tutte le cose...\n La sua gloria si affievolisce con ogni istante.`, type: 'equipment' },
                { text: `Io e questo ${randomEquip.name} siamo legati dai fili del destino.\n I nostri destini sono intrecciati.`, type: 'equipment' },
                { text: `I ${equipType} leggendari non si trovano...\n sono loro a trovare il loro portatore quando le stelle si allineano.`, type: 'equipment' }
            ],
            [PERSONALITY_TYPES.DEFAULT]: [
                { text: `Questo ${randomEquip.name} mi ha servito bene.`, type: 'equipment' },
                { text: `Dovrei cercare un ${equipType} migliore quando arriviamo in città.`, type: 'equipment' },
                { text: `Il mio ${randomEquip.name} ha bisogno di manutenzione.\n Non è più efficace come una volta.`, type: 'equipment' },
                { text: `Questo ${randomEquip.name} sembra fatto apposta per me.`, type: 'equipment' },
                { text: `Mi chiedo se esista un ${equipType} leggendario là fuori.`, type: 'equipment' }
            ]
        };
    } else {
        equipmentThoughts = {
            [PERSONALITY_TYPES.CHEERFUL]: [
                { text: `This ${randomEquip.name} is so much fun to use!\nIt's my new favorite ${equipType}!`, type: 'equipment' },
                { text: `I wonder if there's an even cooler ${equipType} out there somewhere? The adventure continues!`, type: 'equipment' },
                { text: `My ${randomEquip.name} could use a good polish, but it still works great!`, type: 'equipment' },
                { text: `This ${randomEquip.name} feels perfect!\nLike it was made just for me!`, type: 'equipment' },
                { text: `I bet there's an amazing legendary ${equipType} waiting to be discovered!\nCan't wait to find it!`, type: 'equipment' }
            ],
            [PERSONALITY_TYPES.SERIOUS]: [
                { text: `This ${randomEquip.name} is adequately functional.\n It serves its purpose.`, type: 'equipment' },
                { text: `A superior ${equipType} would increase combat efficiency.\n I must seek one out.`, type: 'equipment' },
                { text: `The ${randomEquip.name} requires maintenance to maintain optimal performance.`, type: 'equipment' },
                { text: `This ${randomEquip.name} is well-balanced and suitable for my fighting style.`, type: 'equipment' },
                { text: `Legendary ${equipType}s exist in historical records.\n Acquiring one would be tactically advantageous.`, type: 'equipment' }
            ],
            [PERSONALITY_TYPES.ANALYTICAL]: [
                { text: `${randomEquip.name}: durability at 87.3%.\n Performance metrics: above average for its class.`, type: 'equipment' },
                { text: `Current ${equipType} parameters suboptimal.\n Probability of finding superior equipment: 62.7%.`, type: 'equipment' },
                { text: `${randomEquip.name} maintenance required.\n Estimated efficiency loss: 12.4% per 24 combat encounters.`, type: 'equipment' },
                { text: `${randomEquip.name} specifications: optimally aligned with user parameters.\n Weight distribution: ideal.`, type: 'equipment' },
                { text: `Legendary ${equipType} acquisition probability: 0.08% per dungeon.\n Expected value calculation: positive.`, type: 'equipment' }
            ],
            [PERSONALITY_TYPES.EMOTIONAL]: [
                { text: `I've grown so attached to my ${randomEquip.name}...\n It feels like part of me now.`, type: 'equipment' },
                { text: `Sometimes I dream of finding a beautiful new ${equipType} that truly reflects my spirit...`, type: 'equipment' },
                { text: `My poor ${randomEquip.name} has been through so much with me.\n I should take better care of it.`, type: 'equipment' },
                { text: `This ${randomEquip.name} feels like it understands me...\n Like we're connected somehow.`, type: 'equipment' },
                { text: `I wonder if there's a legendary ${equipType} out there with a soul that would resonate with mine...`, type: 'equipment' }
            ],
            [PERSONALITY_TYPES.MYSTERIOUS]: [
                { text: `The ${randomEquip.name} whispers of battles past...\n It has tasted blood before mine.`, type: 'equipment' },
                { text: `A greater ${equipType} awaits in shadow.\n I sense its call across the void.`, type: 'equipment' },
                { text: `The ${randomEquip.name} fades as all things must.\n Its glory dims with each passing moment.`, type: 'equipment' },
                { text: `This ${randomEquip.name} and I are bound by fate's threads.\n Our destinies intertwined.`, type: 'equipment' },
                { text: `Legendary ${equipType}s are not found...\n they find their wielders when the stars align.`, type: 'equipment' }
            ],
            [PERSONALITY_TYPES.DEFAULT]: [
                { text: `This ${randomEquip.name} has served me well.`, type: 'equipment' },
                { text: `I should look for a better ${equipType} when we reach the next town.`, type: 'equipment' },
                { text: `My ${randomEquip.name} needs maintenance.\n It's not as effective as it used to be.`, type: 'equipment' },
                { text: `This ${randomEquip.name} feels like it was made for me.`, type: 'equipment' },
                { text: `I wonder if there's a legendary ${equipType} out there somewhere.`, type: 'equipment' }
            ]
        };
    }
    // Different personalities have different thoughts about equipment
    
    
    const thoughtPool = equipmentThoughts[personality] || equipmentThoughts[PERSONALITY_TYPES.DEFAULT];
    const randomThought = thoughtPool[Math.floor(Math.random() * thoughtPool.length)];
    const wrappedText = this.wrapText(randomThought.text, lineLength);
    this.addThought(actor, wrappedText, randomThought.type);
};
Scene_Thoughts.prototype.generateAllianceEventMessages = function(ally1, ally2, target, eventType) {
    const useTranslation = ConfigManager.language === 'it';
    if (eventType === 'negative') {
        const negativeEvents = [
            // Blaming the target together
            [
                { actor: ally1, text: useTranslation ? `${target.name()} ha fatto di nuovo un casino, vero?` : `${target.name()} messed up again, didn't they?` },
                { actor: ally2, text: useTranslation ? `Stavo giusto pensando la stessa cosa!` : `I was just thinking the same thing!` },
                { actor: target, text: useTranslation ? `Cosa? Perché mi guardate entrambi così?` : `What? Why are you both looking at me like that?` },
                { actor: ally1, text: useTranslation ? `Siamo stanchi di portarci dietro il tuo peso.` : `We're tired of carrying your weight.` },
                { actor: ally2, text: useTranslation ? `Già, datti una mossa o levati di torno.` : `Yeah, you need to step up or step out.` }
            ],
            // Mocking combat performance
            [
                { actor: ally2, text: useTranslation ? `Hai visto ${target.name()} nell'ultimo scontro?` : `Did you see ${target.name()} in that last fight?` },
                { actor: ally1, text: useTranslation ? `*ride* Cercavo di non guardare. Era imbarazzante!` : `*laughs* I was trying not to watch. It was embarrassing!` },
                { actor: target, text: useTranslation ? `Vi sento, sapete!` : `I can hear you, you know!` },
                { actor: ally2, text: useTranslation ? `Forse questo ti motiverà a fare di meglio.` : `Maybe that'll motivate you to do better.` },
                { actor: ally1, text: useTranslation ? `Seriamente, non possiamo continuare a salvarti.` : `Seriously, we can't keep saving you.` }
            ],
            // Excluding from decisions
            [
                { actor: ally1, text: useTranslation ? `${ally2.name()}, quale pensi dovrebbe essere la nostra prossima mossa?` : `${ally2.name()}, what do you think our next move should be?` },
                { actor: ally2, text: useTranslation ? `Dico di andare a est. Terreni di caccia migliori.` : `I say we head east. Better hunting grounds.` },
                { actor: target, text: useTranslation ? `Non ho voce in capitolo?` : `Don't I get a say in this?` },
                { actor: ally1, text: useTranslation ? `Quando inizierai a contribuire, avrai diritto di voto.` : `When you start contributing, you get a vote.` },
                { actor: ally2, text: useTranslation ? `Concordo. Questa è una cosa tra i membri competenti.` : `Agreed. This is between the competent members.` }
            ],
            // Gossiping about the target
            [
                { actor: ally2, text: useTranslation ? `Sono solo io, o ${target.name()} si sta comportando in modo strano?` : `Is it just me, or has ${target.name()} been acting strange?` },
                { actor: ally1, text: useTranslation ? `Non solo tu. Non credo che possiamo fidarci.` : `Not just you. I don't think we can trust them.` },
                { actor: target, text: useTranslation ? `Sono proprio qui!` : `I'm standing right here!` },
                { actor: ally2, text: useTranslation ? `Allora forse dovresti dare delle spiegazioni.` : `Then maybe you should explain yourself.` },
                { actor: ally1, text: useTranslation ? `Già, meritiamo delle risposte.` : `Yeah, we deserve some answers.` }
            ],
            // Resource hoarding
            [
                { actor: ally1, text: useTranslation ? `${ally2.name()}, ti ho tenuto delle razioni extra.` : `${ally2.name()}, I saved you some extra rations.` },
                { actor: ally2, text: useTranslation ? `Grazie! E per ${target.name()}?` : `Thanks! What about ${target.name()}?` },
                { actor: ally1, text: useTranslation ? `Può avere quello che resta. Se resta qualcosa.` : `They can have what's left. If there is any.` },
                { actor: target, text: useTranslation ? `Non è giusto!` : `That's not fair!` },
                { actor: ally2, text: useTranslation ? `La giustizia si guadagna, non si riceve.` : `Fair is earned, not given.` }
            ],
            // Questioning loyalty
            [
                { actor: ally2, text: useTranslation ? `Possiamo davvero contare su ${target.name()} in una crisi?` : `Can we really count on ${target.name()} in a crisis?` },
                { actor: ally1, text: useTranslation ? `Me lo stavo chiedendo anch'io.` : `I've been wondering the same thing.` },
                { actor: target, text: useTranslation ? `Certo che potete! Perché lo chiedete?` : `Of course you can! Why would you even ask that?` },
                { actor: ally1, text: useTranslation ? `Le tue azioni recenti parlano più delle parole.` : `Your recent actions speak louder than words.` },
                { actor: ally2, text: useTranslation ? `Abbiamo bisogno di alleati affidabili, non di un peso morto.` : `We need reliable allies, not dead weight.` }
            ],
            // Equipment criticism
            [
                { actor: ally1, text: useTranslation ? `L'equipaggiamento di ${target.name()} sta cadendo a pezzi.` : `${target.name()}'s gear is falling apart.` },
                { actor: ally2, text: useTranslation ? `Probabilmente perché non se ne prende cura come si deve.` : `Probably because they don't maintain it properly.` },
                { actor: target, text: useTranslation ? `Il mio equipaggiamento va benissimo!` : `My gear is fine!` },
                { actor: ally1, text: useTranslation ? `Benissimo? È un imbarazzo per il nostro gruppo.` : `Fine? It's an embarrassment to our group.` },
                { actor: ally2, text: useTranslation ? `Sembriamo dei dilettanti per colpa tua.` : `We look like amateurs because of you.` }
            ],
            // Past mistakes
            [
                { actor: ally2, text: useTranslation ? `Ricordi quando ${target.name()} ci ha fatto perdere per tre giorni?` : `Remember when ${target.name()} got us lost for three days?` },
                { actor: ally1, text: useTranslation ? `Come potrei dimenticarlo? Siamo quasi morti di fame!` : `How could I forget? We almost starved!` },
                { actor: target, text: useTranslation ? `È stato mesi fa! Ho chiesto scusa!` : `That was months ago! I said I was sorry!` },
                { actor: ally2, text: useTranslation ? `Scusa non ripara il danno.` : `Sorry doesn't undo the damage.` },
                { actor: ally1, text: useTranslation ? `Né ricostruisce la fiducia che hai infranto.` : `Or rebuild the trust you broke.` }
            ]
        ];
        
        return negativeEvents[Math.floor(Math.random() * negativeEvents.length)];
    } else {
        // Intervention events - one ally defends the target
        const interventionEvents = [
            // Defending combat performance
            [
                { actor: ally1, text: useTranslation ? `${target.name()} ha davvero fatto cilecca laggiù.` : `${target.name()} really dropped the ball back there.` },
                { actor: ally2, text: useTranslation ? `Ehi, non è giusto. Era in difficoltà.` : `Hey, that's not fair. They were overwhelmed.` },
                { actor: target, text: useTranslation ? `Grazie, ${ally2.name()}.` : `Thank you, ${ally2.name()}.` },
                { actor: ally1, text: useTranslation ? `Lo/a difendi? Ci ha quasi fatti uccidere!` : `You're defending them? They nearly got us killed!` },
                { actor: ally2, text: useTranslation ? `Tutti facciamo errori. Lascia perdere.` : `We all make mistakes. Lay off.` }
            ],
            // Standing up against exclusion
            [
                { actor: ally1, text: useTranslation ? `Penso che dovremmo lasciare ${target.name()} in città.` : `I think we should leave ${target.name()} behind in town.` },
                { actor: ally2, text: useTranslation ? `Cosa? Assolutamente no. Siamo una squadra.` : `What? No way. We're a team.` },
                { actor: target, text: useTranslation ? `Volete abbandonarmi?` : `You want to abandon me?` },
                { actor: ally2, text: useTranslation ? `Nessuno abbandona nessuno. Non finché ci sono io.` : `Nobody's abandoning anyone. Not on my watch.` },
                { actor: ally1, text: useTranslation ? `D'accordo, ma quando le cose andranno male...` : `Fine, but when things go wrong...` }
            ],
            // Stopping gossip
            [
                { actor: ally1, text: useTranslation ? `Non mi fido di ${target.name()}. C'è qualcosa che non va.` : `I don't trust ${target.name()}. Something's off.` },
                { actor: ally2, text: useTranslation ? `Basta così. Ha dimostrato ampiamente il suo valore.` : `That's enough. They've proven themselves plenty.` },
                { actor: target, text: useTranslation ? `Io... non sapevo la pensassi così su di me.` : `I... didn't know you felt that way about me.` },
                { actor: ally2, text: useTranslation ? `Non ascoltarlo/a, ${target.name()}. Ti guardo io le spalle.` : `Don't listen to them, ${target.name()}. I've got your back.` },
                { actor: ally1, text: useTranslation ? `Ti pentirai di averlo/a difeso/a.` : `You'll regret defending them.` }
            ],
            // Fair share advocacy
            [
                { actor: ally1, text: useTranslation ? `${target.name()} non merita una parte intera del bottino.` : `${target.name()} doesn't deserve a full share of the loot.` },
                { actor: ally2, text: useTranslation ? `Ognuno riceve una parte uguale. Questi erano i patti.` : `Everyone gets an equal share. That was the deal.` },
                { actor: target, text: useTranslation ? `Lavoro sodo quanto chiunque altro!` : `I work just as hard as anyone!` },
                { actor: ally2, text: useTranslation ? `Esatto. E mi assicurerò che tu sia trattato/a con giustizia.` : `Exactly. And I'll make sure you're treated fairly.` },
                { actor: ally1, text: useTranslation ? `Questo è un errore, ${ally2.name()}.` : `This is a mistake, ${ally2.name()}.` }
            ],
            // Defending character
            [
                { actor: ally1, text: useTranslation ? `${target.name()} è debole. Dovremmo trovare un rimpiazzo.` : `${target.name()} is weak. We should find a replacement.` },
                { actor: ally2, text: useTranslation ? `Debole? Ti ha salvato la vita due volte!` : `Weak? They've saved your life twice!` },
                { actor: target, text: useTranslation ? `Non sono debole...` : `I'm not weak...` },
                { actor: ally2, text: useTranslation ? `Non lo sei. ${ally1.name()} è solo crudele.` : `You're not. ${ally1.name()} is just being cruel.` },
                { actor: ally1, text: useTranslation ? `Sto solo essendo pratico!` : `I'm being practical!` }
            ],
            // Stopping blame
            [
                { actor: ally1, text: useTranslation ? `È tutta colpa di ${target.name()}!` : `This is all ${target.name()}'s fault!` },
                { actor: ally2, text: useTranslation ? `No, non è vero. Eravamo tutti d'accordo con questo piano.` : `No, it's not. We all agreed to this plan.` },
                { actor: target, text: useTranslation ? `Ho fatto del mio meglio...` : `I tried my best...` },
                { actor: ally2, text: useTranslation ? `E questo è tutto ciò che si può chiedere. Fatti da parte, ${ally1.name()}.` : `And that's all anyone can ask. Back off, ${ally1.name()}.` },
                { actor: ally1, text: useTranslation ? `Sei troppo tenero/a con lui/lei.` : `You're too soft on them.` }
            ],
            // Defending decisions
            [
                { actor: ally1, text: useTranslation ? `Le idee di ${target.name()} sono sempre terribili.` : `${target.name()}'s ideas are always terrible.` },
                { actor: ally2, text: useTranslation ? `In realtà, ultimamente ha avuto delle buone intuizioni.` : `Actually, they've had some good insights lately.` },
                { actor: target, text: useTranslation ? `Cerco solo di aiutare...` : `I just try to help...` },
                { actor: ally2, text: useTranslation ? `E lo apprezziamo. Non lasciare che nessuno ti dica il contrario.` : `And we appreciate it. Don't let anyone tell you otherwise.` },
                { actor: ally1, text: useTranslation ? `Siete entrambi dei delusi.` : `You're both delusional.` }
            ],
            // Protecting from criticism
            [
                { actor: ally1, text: useTranslation ? `Guarda ${target.name()}, sempre a combinare casini.` : `Look at ${target.name()}, always messing things up.` },
                { actor: ally2, text: useTranslation ? `Basta! Le tue critiche costanti non aiutano nessuno.` : `Enough! Your constant criticism helps no one.` },
                { actor: target, text: useTranslation ? `Forse dovrei andarmene...` : `Maybe I should just leave...` },
                { actor: ally2, text: useTranslation ? `No, ${target.name()}. ${ally1.name()} dovrebbe chiedere scusa.` : `No, ${target.name()}. ${ally1.name()} should apologize.` },
                { actor: ally1, text: useTranslation ? `Non chiederò scusa per aver detto la verità!` : `I'm not apologizing for speaking the truth!` }
            ]
        ];
        
        return interventionEvents[Math.floor(Math.random() * interventionEvents.length)];
    }
};
Scene_Thoughts.prototype.generatePositiveSocialEvent = function(actor1, actor2, personality1, personality2) {
    const useTranslation = ConfigManager.language === 'it';
    const events = [
        // Shared meal event
        [
            { actor: actor1, text: useTranslation ? `Ehi ${actor2.name()}, vuoi dividere questo cibo che ho trovato?` : `Hey ${actor2.name()}, want to share this food I found?` },
            { actor: actor2, text: useTranslation ? `È molto gentile da parte tua, ${actor1.name()}! Grazie!` : `That's really kind of you, ${actor1.name()}! Thanks!` },
            { actor: actor1, text: useTranslation ? `Siamo una squadra, dopotutto. Dobbiamo guardarci le spalle a vicenda!` : `We're a team after all. Got to look out for each other!` }
        ],
        // Combat compliment
        [
            { actor: actor2, text: useTranslation ? `${actor1.name()}, quella mossa di prima è stata incredibile!` : `${actor1.name()}, that was an amazing move back there!` },
            { actor: actor1, text: useTranslation ? `Grazie! Mi sono allenato/a. Anche la tua difesa è stata solida!` : `Thanks! I've been practicing. Your defense was solid too!` },
            { actor: actor2, text: useTranslation ? `Siamo una bella squadra, non trovi?` : `We make a pretty good team, don't we?` }
        ],
        // Shared joke
        [
            { actor: actor1, text: useTranslation ? `*racconta una barzelletta stupida sulla loro ultima battaglia*` : `*tells a silly joke about their last battle*` },
            { actor: actor2, text: useTranslation ? `*ride* È terribile! Ma avevo bisogno di una risata.` : `*laughs* That's terrible! But I needed that laugh.` },
            { actor: actor1, text: useTranslation ? `A volte bisogna trovare l'umorismo nel caos!` : `Sometimes you need to find humor in the chaos!` }
        ],
        // Helping with injury
        [
            { actor: actor1, text: useTranslation ? `${actor2.name()}, lascia che ti aiuti a bendare quella ferita.` : `${actor2.name()}, let me help bandage that wound.` },
            { actor: actor2, text: useTranslation ? `Io... grazie. Non volevo chiedere.` : `I... thank you. I didn't want to ask.` },
            { actor: actor1, text: useTranslation ? `Non c'è bisogno di chiedere. Ci prendiamo cura l'uno dell'altro.` : `You don't need to ask. We look after each other.` },
            { actor: actor2, text: useTranslation ? `Sono fortunato/a ad averti come compagno/a.` : `I'm lucky to have you as a companion.` }
        ],
        // Shared memory
        [
            { actor: actor2, text: useTranslation ? `Ricordi quando ci siamo incontrati la prima volta? Non avrei mai pensato che saremmo arrivati fin qui.` : `Remember when we first met? I never thought we'd come this far.` },
            { actor: actor1, text: useTranslation ? `Ah! A quel tempo hai cercato di attaccare briga con me!` : `Ha! You tried to pick a fight with me back then!` },
            { actor: actor2, text: useTranslation ? `E ora ti affiderei la mia vita. Buffo come cambiano le cose.` : `And now I'd trust you with my life. Funny how things change.` },
            { actor: actor1, text: useTranslation ? `Lo stesso vale per me, amico/a. Lo stesso vale per me.` : `Same here, friend. Same here.` }
        ],
        // Gift giving
        [
            { actor: actor1, text: useTranslation ? `Ho trovato questo in città. Ho pensato che potesse piacerti.` : `I found this in town. Thought you might like it.` },
            { actor: actor2, text: useTranslation ? `Hai preso questo... per me? ${actor1.name()}, non so cosa dire.` : `You got this... for me? ${actor1.name()}, I don't know what to say.` },
            { actor: actor1, text: useTranslation ? `L'ho visto e ho pensato a te. Niente di che.` : `Just saw it and thought of you. No big deal.` },
            { actor: actor2, text: useTranslation ? `Per me lo è. Grazie, davvero.` : `It is to me. Thank you, truly.` }
        ],
        // Defending each other
        [
            { actor: actor2, text: useTranslation ? `Grazie per avermi coperto le spalle quando quel mostro mi ha aggirato.` : `Thanks for having my back when that monster flanked me.` },
            { actor: actor1, text: useTranslation ? `Sempre. Non posso permettere che ti succeda qualcosa.` : `Always. Can't let anything happen to you.` },
            { actor: actor2, text: useTranslation ? `Farei lo stesso per te senza pensarci due volte.` : `I'd do the same for you in a heartbeat.` }
        ],
        // Shared interests
        [
            { actor: actor1, text: useTranslation ? `Ho notato che stavi leggendo quel libro sulla magia antica.` : `I noticed you reading that book about ancient magic.` },
            { actor: actor2, text: useTranslation ? `Interessa anche a te la teoria magica?` : `You're interested in magical theory too?` },
            { actor: actor1, text: useTranslation ? `Da sempre! Forse potremmo studiare insieme qualche volta?` : `Always have been! Maybe we could study together sometime?` },
            { actor: actor2, text: useTranslation ? `Mi piacerebbe molto!` : `I'd really like that!` }
        ],
        // Nightmare comfort
        [
            { actor: actor2, text: useTranslation ? `Neanche tu riesci a dormire?` : `Couldn't sleep either?` },
            { actor: actor1, text: useTranslation ? `Di nuovo brutti sogni. Questo viaggio... ti logora.` : `Bad dreams again. This journey... it gets to you.` },
            { actor: actor2, text: useTranslation ? `Vuoi parlarne? Sono qui.` : `Want to talk about it? I'm here.` },
            { actor: actor1, text: useTranslation ? `Grazie. Il solo fatto che tu sia qui aiuta.` : `Thanks. Just having you here helps.` }
        ],
        // Training together
        [
            { actor: actor1, text: useTranslation ? `Vuoi fare un po' di sparring? Potrei usare un po' di pratica.` : `Want to spar? I could use the practice.` },
            { actor: actor2, text: useTranslation ? `Certo! Sei diventato/a più forte ultimamente.` : `Sure! You've gotten stronger lately.` },
            { actor: actor1, text: useTranslation ? `A dire il vero, ho imparato quella mossa guardando te.` : `I learned that move watching you actually.` },
            { actor: actor2, text: useTranslation ? `Davvero? Ne sono onorato/a!` : `Really? I'm honored!` }
        ],
        // Sharing supplies
        [
            { actor: actor2, text: useTranslation ? `La mia borraccia è vuota...` : `My waterskin is empty...` },
            { actor: actor1, text: useTranslation ? `Tieni, prendi la mia. L'ho riempita all'ultimo ruscello.` : `Here, take mine. I filled it at the last stream.` },
            { actor: actor2, text: useTranslation ? `Ma tu?` : `But what about you?` },
            { actor: actor1, text: useTranslation ? `Troveremo altra acqua. Tu ne hai bisogno adesso.` : `We'll find more water. You need it now.` }
        ],
        // Encouraging words
        [
            { actor: actor1, text: useTranslation ? `Sembri giù di morale oggi. Tutto bene?` : `You seem down today. Everything okay?` },
            { actor: actor2, text: useTranslation ? `Solo... mi chiedo se sono abbastanza forte per questo.` : `Just... questioning if I'm strong enough for this.` },
            { actor: actor1, text: useTranslation ? `Stai scherzando? Sei una delle persone più forti che conosco.` : `Are you kidding? You're one of the strongest people I know.` },
            { actor: actor2, text: useTranslation ? `Lo pensi davvero? Grazie...` : `You really mean that? Thank you...` }
        ],
        // Shared victory
        [
            { actor: actor2, text: useTranslation ? `Ce l'abbiamo fatta! È stata la nostra miglior battaglia finora!` : `We did it! That was our best fight yet!` },
            { actor: actor1, text: useTranslation ? `La tua strategia è stata geniale!` : `Your strategy was brilliant!` },
            { actor: actor2, text: useTranslation ? `E la tua esecuzione è stata impeccabile!` : `And your execution was flawless!` },
            { actor: actor1, text: useTranslation ? `Insieme siamo inarrestabili!` : `We're unstoppable together!` }
        ],
        // Personal story
        [
            { actor: actor1, text: useTranslation ? `Non ti ho mai detto perché ho iniziato questo viaggio...` : `I never told you why I started this journey...` },
            { actor: actor2, text: useTranslation ? `Non devi, se è troppo personale.` : `You don't have to if it's too personal.` },
            { actor: actor1, text: useTranslation ? `No, voglio che tu lo sappia. Mi fido di te.` : `No, I want you to know. I trust you.` },
            { actor: actor2, text: useTranslation ? `Ne sono onorato/a. Sono qui per ascoltare.` : `I'm honored. I'm here to listen.` }
        ],
        // Celebrating skills
        [
            { actor: actor2, text: useTranslation ? `Come fai a sapere sempre quali erbe sono sicure?` : `How do you always know which herbs are safe?` },
            { actor: actor1, text: useTranslation ? `Me l'ha insegnato mia nonna. Vuoi che ti mostri?` : `My grandmother taught me. Want me to show you?` },
            { actor: actor2, text: useTranslation ? `Mi piacerebbe molto imparare da te!` : `I'd love to learn from you!` }
        ]
    ];
    
    return events[Math.floor(Math.random() * events.length)];
};

Scene_Thoughts.prototype.generateNegativeSocialEvent = function(actor1, actor2, personality1, personality2) {
    const useTranslation = ConfigManager.language === 'it';
    const events = [
        // Strategy disagreement
        [
            { actor: actor1, text: useTranslation ? `La tua strategia nell'ultimo scontro è stata sconsiderata!` : `Your strategy in that last fight was reckless!` },
            { actor: actor2, text: useTranslation ? `Almeno io faccio qualcosa invece di pensare troppo!` : `At least I'm doing something instead of overthinking!` },
            { actor: actor1, text: useTranslation ? `C'è una differenza tra coraggio e stupidità...` : `There's a difference between bravery and stupidity...` }
        ],
        // Resource dispute
        [
            { actor: actor2, text: useTranslation ? `Hai usato l'ultima pozione? Ne avevo bisogno!` : `Did you use the last potion? I needed that!` },
            { actor: actor1, text: useTranslation ? `Stavo morendo! Cosa avrei dovuto fare?` : `I was dying! What was I supposed to do?` },
            { actor: actor2, text: useTranslation ? `Magari la prossima volta comunica...` : `Maybe communicate next time...` }
        ],
        // Personal criticism
        [
            { actor: actor1, text: useTranslation ? `Ultimamente ci stai rallentando.` : `You've been slowing us down lately.` },
            { actor: actor2, text: useTranslation ? `Non tutti possono essere perfetti come credi di essere tu.` : `Not everyone can be perfect like you think you are.` },
            { actor: actor1, text: useTranslation ? `Sto solo dicendo che dobbiamo rimanere concentrati...` : `I'm just saying we need to stay focused...` }
        ],
        // Blame game
        [
            { actor: actor2, text: useTranslation ? `Siamo caduti in un'imboscata per colpa del tuo percorso!` : `We got ambushed because of your route!` },
            { actor: actor1, text: useTranslation ? `Il mio percorso? Sei tu che hai insistito per questa scorciatoia!` : `My route? You're the one who insisted on this shortcut!` },
            { actor: actor2, text: useTranslation ? `Non provare a dare la colpa a me!` : `Don't try to pin this on me!` },
            { actor: actor1, text: useTranslation ? `Come vuoi. Andiamo avanti e basta.` : `Whatever. Let's just move on.` }
        ],
        // Leadership conflict
        [
            { actor: actor1, text: useTranslation ? `Qualcuno deve prendere delle decisioni qui.` : `Someone needs to make decisions here.` },
            { actor: actor2, text: useTranslation ? `E pensi che quel qualcuno sia tu?` : `And you think that someone is you?` },
            { actor: actor1, text: useTranslation ? `Meglio che vagare senza meta!` : `Better than wandering aimlessly!` },
            { actor: actor2, text: useTranslation ? `La tua 'leadership' ci ha quasi uccisi l'ultima volta.` : `Your 'leadership' nearly got us killed last time.` }
        ],
        // Trust issues
        [
            { actor: actor2, text: useTranslation ? `Hai frugato nel mio zaino?!` : `You went through my pack?!` },
            { actor: actor1, text: useTranslation ? `Cercavo oggetti curativi. Rilassati.` : `I was looking for healing items. Relax.` },
            { actor: actor2, text: useTranslation ? `Quella è la mia roba privata! Non ne avevi il diritto!` : `That's my private stuff! You had no right!` },
            { actor: actor1, text: useTranslation ? `Bene. La prossima volta ti lascerò morire dissanguato/a.` : `Fine. Next time I'll let you bleed out.` }
        ],
        // Combat criticism
        [
            { actor: actor1, text: useTranslation ? `Hai mancato ogni attacco! Che ti prende?` : `You missed every attack! What's wrong with you?` },
            { actor: actor2, text: useTranslation ? `Magari se qualcuno mi coprisse come si deve...` : `Maybe if someone covered me properly...` },
            { actor: actor1, text: useTranslation ? `Non dare la colpa a me per la tua incompetenza.` : `Don't blame me for your incompetence.` },
            { actor: actor2, text: useTranslation ? `Incompetenza? Detto da te, è tutto dire.` : `Incompetence? That's rich coming from you.` }
        ],
        // Personality clash
        [
            { actor: actor2, text: useTranslation ? `Non smetti mai di parlare?` : `Do you ever stop talking?` },
            { actor: actor1, text: useTranslation ? `E tu non smetti mai di rimuginare?` : `Do you ever stop brooding?` },
            { actor: actor2, text: useTranslation ? `Almeno io penso prima di parlare.` : `At least I think before I speak.` },
            { actor: actor1, text: useTranslation ? `Sì, tu pensi troppo a tutto.` : `Yeah, you overthink everything.` }
        ],
        // Past grudge
        [
            { actor: actor1, text: useTranslation ? `È proprio come quella volta nelle caverne.` : `This is just like that time in the caves.` },
            { actor: actor2, text: useTranslation ? `Stai seriamente tirando fuori di nuovo quella storia?` : `Are you seriously bringing that up again?` },
            { actor: actor1, text: useTranslation ? `Non hai mai chiesto scusa!` : `You never apologized!` },
            { actor: actor2, text: useTranslation ? `Perché non era colpa mia!` : `Because it wasn't my fault!` }
        ],
        // Money argument
        [
            { actor: actor2, text: useTranslation ? `Hai speso QUANTO alla taverna?!` : `You spent HOW much at the tavern?!` },
            { actor: actor1, text: useTranslation ? `Avevo bisogno di informazioni. Era necessario.` : `I needed information. It was necessary.` },
            { actor: actor2, text: useTranslation ? `Avevi bisogno di birra, ecco di cosa avevi bisogno!` : `You needed ale is what you needed!` },
            { actor: actor1, text: useTranslation ? `Non farmi la predica sui soldi.` : `Don't lecture me about money.` }
        ],
        // Direction dispute
        [
            { actor: actor1, text: useTranslation ? `Stiamo andando nella direzione sbagliata. Di nuovo.` : `We're going the wrong way. Again.` },
            { actor: actor2, text: useTranslation ? `Se ne sai così tanto, perché non ti orienti TU?` : `If you know so much, why don't YOU navigate?` },
            { actor: actor1, text: useTranslation ? `Perché hai insistito di conoscere la strada!` : `Because you insisted you knew the way!` },
            { actor: actor2, text: useTranslation ? `La conosco! Solo... fidati di me.` : `I do! Just... trust me.` },
            { actor: actor1, text: useTranslation ? `È quello che hai detto tre ore fa...` : `That's what you said three hours ago...` }
        ],
        // Equipment envy
        [
            { actor: actor2, text: useTranslation ? `Perché hai preso l'arma migliore?` : `Why did you take the better weapon?` },
            { actor: actor1, text: useTranslation ? `L'ho trovata io. Chi trova, tiene.` : `I found it. Finders keepers.` },
            { actor: actor2, text: useTranslation ? `Dovremmo dividere equamente!` : `We're supposed to share equally!` },
            { actor: actor1, text: useTranslation ? `Allora trovane una tua la prossima volta.` : `Then find your own next time.` }
        ],
        // Exhaustion fight
        [
            { actor: actor1, text: useTranslation ? `Possiamo riposarci ORA, per favore?` : `Can we PLEASE rest now?` },
            { actor: actor2, text: useTranslation ? `Abbiamo riposato un'ora fa! Dobbiamo continuare a muoverci.` : `We rested an hour ago! We need to keep moving.` },
            { actor: actor1, text: useTranslation ? `Facile per te dirlo. Non sei tu a portare lo zaino pesante!` : `Easy for you to say. You're not carrying the heavy pack!` },
            { actor: actor2, text: useTranslation ? `Smettila di lamentarti di tutto!` : `Stop complaining about everything!` }
        ],
        // Magic mishap
        [
            { actor: actor2, text: useTranslation ? `Il tuo incantesimo mi ha colpito! Guarda dove miri!` : `Your spell hit me! Watch where you're aiming!` },
            { actor: actor1, text: useTranslation ? `Sei saltato sulla mia linea di tiro!` : `You jumped into my line of fire!` },
            { actor: actor2, text: useTranslation ? `Stavo schivando! Avresti dovuto vederlo!` : `I was dodging! You should have seen that!` },
            { actor: actor1, text: useTranslation ? `Non leggo nel pensiero!` : `I'm not a mind reader!` }
        ],
        // Food conflict
        [
            { actor: actor1, text: useTranslation ? `Quella era la MIA porzione di razioni!` : `That was MY portion of the rations!` },
            { actor: actor2, text: useTranslation ? `La tua l'hai avuta stamattina.` : `You had yours this morning.` },
            { actor: actor1, text: useTranslation ? `Quello era ieri! Ma stai prestando attenzione?` : `That was yesterday! Are you even paying attention?` },
            { actor: actor2, text: useTranslation ? `Non usare quel tono con me.` : `Don't take that tone with me.` }
        ],
        // Noise complaint
        [
            { actor: actor2, text: useTranslation ? `La tua armatura è così rumorosa! Ogni mostro a miglia di distanza può sentirci!` : `Your armor is so loud! Every monster for miles can hear us!` },
            { actor: actor1, text: useTranslation ? `Scusa se cerco di rimanere protetto!` : `Sorry for trying to stay protected!` },
            { actor: actor2, text: useTranslation ? `La protezione non aiuterà se cadiamo costantemente in imboscate!` : `Protection won't help if we're constantly ambushed!` },
            { actor: actor1, text: useTranslation ? `Bene, la prossima volta andrò in giro nudo. Contento?` : `Fine, next time I'll go naked. Happy?` }
        ],
        // Loyalty question
        [
            { actor: actor1, text: useTranslation ? `Da che parte stai veramente?` : `Whose side are you really on?` },
            { actor: actor2, text: useTranslation ? `Cosa dovrebbe significare?` : `What's that supposed to mean?` },
            { actor: actor1, text: useTranslation ? `Ti comporti in modo strano dall'ultima città.` : `You've been acting strange since that last town.` },
            { actor: actor2, text: useTranslation ? `Forse perché sei paranoico/a riguardo a tutto!` : `Maybe because you're paranoid about everything!` }
        ],
        // Rest dispute
        [
            { actor: actor2, text: useTranslation ? `Il tuo russare mi ha tenuto sveglio/a tutta la notte!` : `Your snoring kept me up all night!` },
            { actor: actor1, text: useTranslation ? `Io non russo!` : `I don't snore!` },
            { actor: actor2, text: useTranslation ? `Sembri un drago con il raffreddore!` : `You sound like a dragon with a cold!` },
            { actor: actor1, text: useTranslation ? `Beh, il tuo continuo girarti e rigirarti ha tenuto sveglio/a ME!` : `Well, your tossing and turning kept ME awake!` }
        ],
        // Battle formation
        [
            { actor: actor1, text: useTranslation ? `Smettila di rompere la formazione!` : `Stop breaking formation!` },
            { actor: actor2, text: useTranslation ? `Le tue formazioni sono troppo rigide!` : `Your formations are too rigid!` },
            { actor: actor1, text: useTranslation ? `Funzionano quando la gente le segue!` : `They work when people follow them!` },
            { actor: actor2, text: useTranslation ? `Funzionano quando hanno senso!` : `They work when they make sense!` }
        ],
        // Hygiene complaint
        [
            { actor: actor2, text: useTranslation ? `Quand'è l'ultima volta che ti sei lavato/a?` : `When's the last time you bathed?` },
            { actor: actor1, text: useTranslation ? `Siamo in un'avventura, non in vacanza!` : `We're on an adventure, not a vacation!` },
            { actor: actor2, text: useTranslation ? `Non è una scusa per puzzare come un troll!` : `That's no excuse to smell like a troll!` },
            { actor: actor1, text: useTranslation ? `Senti chi parla!` : `You're one to talk!` }
        ]
    ];
    
    return events[Math.floor(Math.random() * events.length)];
};

Scene_Thoughts.prototype.generateNeutralSocialEvent = function(actor1, actor2, personality1, personality2) {
    const useTranslation = ConfigManager.language === 'it';
    const events = [
        // Weather observation
        [
            { actor: actor1, text: useTranslation ? `Il tempo è stato strano ultimamente, non trovi?` : `The weather's been strange lately, hasn't it?` },
            { actor: actor2, text: useTranslation ? `Sì, l'ho notato anch'io. Spero non influenzi il nostro viaggio.` : `Yeah, I've noticed that too. Hope it doesn't affect our journey.` },
            { actor: actor1, text: useTranslation ? `Ce la caveremo in ogni caso, suppongo.` : `We'll manage either way, I suppose.` }
        ],
        // Equipment discussion
        [
            { actor: actor2, text: useTranslation ? `È un'arma nuova quella che porti?` : `Is that a new weapon you're carrying?` },
            { actor: actor1, text: useTranslation ? `Trovata nell'ultimo dungeon. Mi ci sto ancora abituando.` : `Found it in the last dungeon. Still getting used to it.` },
            { actor: actor2, text: useTranslation ? `Sembra abbastanza efficace. Bella scoperta.` : `Looks effective enough. Good find.` }
        ],
        // Travel planning
        [
            { actor: actor1, text: useTranslation ? `Dovremmo raggiungere la prossima città entro il crepuscolo.` : `We should reach the next town by nightfall.` },
            { actor: actor2, text: useTranslation ? `Bene. Potremmo usare un vero riposo.` : `Good. We could use a proper rest.` },
            { actor: actor1, text: useTranslation ? `Concordo. Questo viaggiare costante è estenuante.` : `Agreed. This constant traveling is exhausting.` }
        ],
        // Philosophical musing
        [
            { actor: actor2, text: useTranslation ? `Ti chiedi mai perché lo stiamo facendo davvero?` : `Do you ever wonder why we're really doing this?` },
            { actor: actor1, text: useTranslation ? `A volte. Ma rimuginarci sopra non cambierà nulla.` : `Sometimes. But dwelling on it won't change anything.` },
            { actor: actor2, text: useTranslation ? `Suppongo tu abbia ragione. Sto solo pensando ad alta voce.` : `I suppose you're right. Just thinking out loud.` }
        ],
        // Cooking duty
        [
            { actor: actor1, text: useTranslation ? `È il tuo turno di cucinare stasera.` : `It's your turn to cook tonight.` },
            { actor: actor2, text: useTranslation ? `Già? Mi sembra di aver cucinato appena ieri.` : `Already? Feels like I just cooked yesterday.` },
            { actor: actor1, text: useTranslation ? `Erano tre giorni fa.` : `That was three days ago.` },
            { actor: actor2, text: useTranslation ? `Il tempo vola davvero qui fuori, vero?` : `Time really blurs out here, doesn't it?` }
        ],
        // Map reading
        [
            { actor: actor2, text: useTranslation ? `Secondo questa mappa, dovrebbe esserci un fiume qui vicino.` : `According to this map, there should be a river nearby.` },
            { actor: actor1, text: useTranslation ? `Quella mappa è piuttosto vecchia. Le cose potrebbero essere cambiate.` : `That map's pretty old. Things might have changed.` },
            { actor: actor2, text: useTranslation ? `C'è solo un modo per scoprirlo.` : `Only one way to find out.` }
        ],
        // Stargazing
        [
            { actor: actor1, text: useTranslation ? `Notte serena. Le stelle sono luminose.` : `Clear night. The stars are bright.` },
            { actor: actor2, text: useTranslation ? `Il mio villaggio ha costellazioni diverse.` : `My village has different constellations.` },
            { actor: actor1, text: useTranslation ? `Davvero? Interessante.` : `Really? That's interesting.` },
            { actor: actor2, text: useTranslation ? `Ti fa capire quanto è grande il mondo.` : `Makes you realize how big the world is.` }
        ],
        // Morning routine
        [
            { actor: actor2, text: useTranslation ? `Sei già in piedi.` : `You're up early.` },
            { actor: actor1, text: useTranslation ? `Non riuscivo a dormire. Tanto vale prepararsi.` : `Couldn't sleep. Might as well get ready.` },
            { actor: actor2, text: useTranslation ? `Vuoi che inizi a smontare il campo?` : `Want me to start packing up camp?` },
            { actor: actor1, text: useTranslation ? `Certo. Io vado un po' in avanscoperta.` : `Sure. I'll scout ahead a bit.` }
        ],
        // Monster knowledge
        [
            { actor: actor1, text: useTranslation ? `Hai mai combattuto una creatura del genere prima?` : `Ever fought a creature like that before?` },
            { actor: actor2, text: useTranslation ? `Una volta, anni fa. Sono ostiche.` : `Once, years ago. They're tricky.` },
            { actor: actor1, text: useTranslation ? `Qualche consiglio?` : `Any advice?` },
            { actor: actor2, text: useTranslation ? `Mira alle articolazioni. Lì sono meno corazzate.` : `Aim for the joints. They're less armored there.` }
        ],
        // Town memories
        [
            { actor: actor2, text: useTranslation ? `Questa città mi ricorda casa.` : `This town reminds me of home.` },
            { actor: actor1, text: useTranslation ? `In che senso?` : `How so?` },
            { actor: actor2, text: useTranslation ? `L'odore del pane appena sfornato. È lo stesso ovunque tu vada.` : `The smell of bread baking. Same anywhere you go.` },
            { actor: actor1, text: useTranslation ? `Certe cose sono universali, immagino.` : `Some things are universal, I guess.` }
        ],
        // Watch duty
        [
            { actor: actor1, text: useTranslation ? `Faccio io il primo turno di guardia stasera.` : `I'll take first watch tonight.` },
            { actor: actor2, text: useTranslation ? `Sei sicuro? L'hai fatto tu ieri sera.` : `You sure? You took it last night.` },
            { actor: actor1, text: useTranslation ? `Non sono ancora stanco/a comunque.` : `I'm not tired yet anyway.` },
            { actor: actor2, text: useTranslation ? `Va bene. Svegliami tra quattro ore.` : `Alright. Wake me in four hours.` }
        ],
        // Strange dreams
        [
            { actor: actor2, text: useTranslation ? `Ho fatto un sogno stranissimo stanotte.` : `Had the strangest dream last night.` },
            { actor: actor1, text: useTranslation ? `Riguardo a cosa?` : `About what?` },
            { actor: actor2, text: useTranslation ? `Non ricordo bene. Ma sembrava... importante, in qualche modo.` : `Can't quite remember. Just felt... important somehow.` },
            { actor: actor1, text: useTranslation ? `I sogni possono essere così quando si è in viaggio.` : `Dreams can be like that on the road.` }
        ],
        // Weapon maintenance
        [
            { actor: actor1, text: useTranslation ? `Posso prendere in prestito la tua cote?` : `Mind if I borrow your whetstone?` },
            { actor: actor2, text: useTranslation ? `Nel mio zaino, tasca sinistra.` : `In my pack, left side pocket.` },
            { actor: actor1, text: useTranslation ? `Grazie. Questa lama sta diventando smussata.` : `Thanks. This blade's getting dull.` },
            { actor: actor2, text: useTranslation ? `Meglio manutenere che sostituire.` : `Better to maintain than replace.` }
        ],
        // Cultural exchange
        [
            { actor: actor2, text: useTranslation ? `Nella mia terra natale, abbiamo un detto...` : `In my homeland, we have a saying...` },
            { actor: actor1, text: useTranslation ? `Quale?` : `What's that?` },
            { actor: actor2, text: useTranslation ? `'La montagna ricorda ogni passo.'` : `'The mountain remembers every footstep.'` },
            { actor: actor1, text: useTranslation ? `Significa che lasciamo il segno ovunque andiamo?` : `Meaning we leave our mark wherever we go?` },
            { actor: actor2, text: useTranslation ? `Qualcosa del genere.` : `Something like that.` }
        ],
        // Battle scars
        [
            { actor: actor1, text: useTranslation ? `Quella cicatrice sta guarendo bene?` : `That scar healing alright?` },
            { actor: actor2, text: useTranslation ? `Sì, duole solo quando piove.` : `Yeah, just aches when it rains.` },
            { actor: actor1, text: useTranslation ? `Le vecchie ferite fanno così.` : `Old wounds do that.` },
            { actor: actor2, text: useTranslation ? `Ne ho già un sacco.` : `Got plenty of those already.` }
        ],
        // Supply check
        [
            { actor: actor2, text: useTranslation ? `Stiamo finendo le razioni.` : `We're running low on rations.` },
            { actor: actor1, text: useTranslation ? `Dovrebbero bastare fino alla prossima città.` : `Should last until the next town.` },
            { actor: actor2, text: useTranslation ? `Se non subiamo ritardi.` : `If we don't get delayed.` },
            { actor: actor1, text: useTranslation ? `E quando mai non subiamo ritardi?` : `When do we ever not get delayed?` }
        ],
        // Music moment
        [
            { actor: actor1, text: useTranslation ? `Sei tu che canticchi?` : `Is that you humming?` },
            { actor: actor2, text: useTranslation ? `Oh, scusa. Vecchia abitudine.` : `Oh, sorry. Old habit.` },
            { actor: actor1, text: useTranslation ? `No, è piacevole. Che canzone è?` : `No, it's nice. What song is it?` },
            { actor: actor2, text: useTranslation ? `Qualcosa che cantava mia madre.` : `Something my mother used to sing.` }
        ],
        // Superstitions
        [
            { actor: actor2, text: useTranslation ? `Un gatto nero ha appena attraversato la nostra strada.` : `Black cat just crossed our path.` },
            { actor: actor1, text: useTranslation ? `Non sarai superstizioso/a, vero?` : `You're not superstitious, are you?` },
            { actor: actor2, text: useTranslation ? `Non proprio. Ma mia nonna lo era.` : `Not really. But my grandmother was.` },
            { actor: actor1, text: useTranslation ? `Anche la mia. Aveva sempre un amuleto per ogni cosa.` : `Mine too. Always had a charm for everything.` }
        ],
        // Combat roles
        [
            { actor: actor1, text: useTranslation ? `Nel prossimo scontro starò in prima linea.` : `I'll take point in the next fight.` },
            { actor: actor2, text: useTranslation ? `Io posso occuparmi dei fianchi.` : `I can handle the flanks.` },
            { actor: actor1, text: useTranslation ? `Sembra un piano.` : `Sounds like a plan.` }
        ],
        // Language barriers
        [
            { actor: actor2, text: useTranslation ? `Cosa dice quel cartello?` : `What does that sign say?` },
            { actor: actor1, text: useTranslation ? `Non ne sono sicuro. Dialetto diverso, credo.` : `Not sure. Different dialect, I think.` },
            { actor: actor2, text: useTranslation ? `Speriamo non ci stia avvertendo di qualcosa.` : `Hopefully it's not warning us about something.` },
            { actor: actor1, text: useTranslation ? `C'è solo un modo per scoprirlo.` : `Only one way to find out.` }
        ],
        // Merchants
        [
            { actor: actor1, text: useTranslation ? `Quel mercante sembrava losco.` : `That merchant seemed shady.` },
            { actor: actor2, text: useTranslation ? `La maggior parte lo sono, per la mia esperienza.` : `Most of them are, in my experience.` },
            { actor: actor1, text: useTranslation ? `Comunque, potrebbe avere informazioni utili.` : `Still, might have useful information.` },
            { actor: actor2, text: useTranslation ? `Se te lo puoi permettere.` : `If you can afford it.` }
        ],
        // Wildlife observation
        [
            { actor: actor2, text: useTranslation ? `Guarda, tracce di cervo.` : `Look, deer tracks.` },
            { actor: actor1, text: useTranslation ? `E anche fresche.` : `Fresh ones too.` },
            { actor: actor2, text: useTranslation ? `Significa che probabilmente c'è acqua nelle vicinanze.` : `Means water's probably nearby.` },
            { actor: actor1, text: useTranslation ? `Buona osservazione.` : `Good observation.` }
        ],
        // Historical ruins
        [
            { actor: actor1, text: useTranslation ? `Queste rovine devono essere antiche.` : `These ruins must be ancient.` },
            { actor: actor2, text: useTranslation ? `Chissà cosa è successo alla gente che le ha costruite.` : `Wonder what happened to the people who built them.` },
            { actor: actor1, text: useTranslation ? `La stessa cosa che succede a tutte le civiltà, suppongo.` : `Same thing that happens to all civilizations, I suppose.` },
            { actor: actor2, text: useTranslation ? `Alla fine, il tempo conquista tutto.` : `Time conquers everything eventually.` }
        ],
        // Simple observations
        [
            { actor: actor2, text: useTranslation ? `Sta calando la nebbia.` : `Fog's rolling in.` },
            { actor: actor1, text: useTranslation ? `Rende più difficile vedere le minacce.` : `Makes it harder to see threats.` },
            { actor: actor2, text: useTranslation ? `Rende anche più difficile per le minacce vedere noi.` : `Also makes it harder for threats to see us.` },
            { actor: actor1, text: useTranslation ? `Giusta osservazione.` : `Fair point.` }
        ],
        // Inventory management
        [
            { actor: actor1, text: useTranslation ? `Il mio zaino sta diventando pesante.` : `My pack's getting heavy.` },
            { actor: actor2, text: useTranslation ? `Forse dovremmo vendere un po' di questa cianfrusaglia.` : `Maybe we should sell some of this junk.` },
            { actor: actor1, text: useTranslation ? `'Cianfrusaglia' che potrebbe salvarci la vita più tardi.` : `'Junk' that might save our lives later.` },
            { actor: actor2, text: useTranslation ? `Non può salvarci la vita se non riusciamo a muoverci.` : `Can't save our lives if we can't move.` }
        ]
    ];
    
    return events[Math.floor(Math.random() * events.length)];
};
function attachMethods() {
    if (!window.Scene_Thoughts || !Scene_Thoughts.prototype) return;

    const originalGenerateThoughts = Scene_Thoughts.prototype.generateThoughts;

    Scene_Thoughts.prototype.generateParanormalEvent = generateParanormalEvent;
    Scene_Thoughts.prototype.generateParanormalEventMessages = generateParanormalEventMessages;
    Scene_Thoughts.prototype.generateDebateEvent = generateDebateEvent;
    Scene_Thoughts.prototype.generateDebateMessages = generateDebateMessages;
    Scene_Thoughts.prototype.generateRiddleEvent = generateRiddleEvent;
    Scene_Thoughts.prototype.selectRiddle = selectRiddle;
    Scene_Thoughts.prototype.generateCompetitionEvent = generateCompetitionEvent;
    Scene_Thoughts.prototype.selectCompetition = selectCompetition;
    Scene_Thoughts.prototype.generateCompetitionMessages = generateCompetitionMessages;
    Scene_Thoughts.prototype.getCurrentPartyState = getCurrentPartyState;
    Scene_Thoughts.prototype.comparePartyStates = comparePartyStates;
    Scene_Thoughts.prototype.generateMoneyThoughts = generateMoneyThoughts;
    Scene_Thoughts.prototype.generateItemThoughts = generateItemThoughts;
    Scene_Thoughts.prototype.generateMapThoughts = generateMapThoughts;
    Scene_Thoughts.prototype.generateMonsterThoughts = generateMonsterThoughts;
    Scene_Thoughts.prototype.generateWeatherThoughts = generateWeatherThoughts;
    Scene_Thoughts.prototype.generateTimeThoughts = generateTimeThoughts;
    Scene_Thoughts.prototype.generateFoodThoughts = generateFoodThoughts;
    Scene_Thoughts.prototype.generateSleepThoughts = generateSleepThoughts;
    Scene_Thoughts.prototype.generateRandomThoughts = generateRandomThoughts;
    Scene_Thoughts.prototype.generateThoughtAboutOtherMember = generateThoughtAboutOtherMember;
    Scene_Thoughts.prototype.generateEquipmentThought = generateEquipmentThought;
    Scene_Thoughts.prototype.generateAllianceEventMessages = generateAllianceEventMessages;
    Scene_Thoughts.prototype.generatePositiveSocialEvent = generatePositiveSocialEvent;
    Scene_Thoughts.prototype.generateNegativeSocialEvent = generateNegativeSocialEvent;
    Scene_Thoughts.prototype.generateNeutralSocialEvent = generateNeutralSocialEvent;

    if (originalGenerateThoughts) {
      Scene_Thoughts.prototype.generateThoughts = function() {
        originalGenerateThoughts.call(this);
        if (typeof this.generateSocialEvent === 'function') {
          this.generateSocialEvent();
        }
      };
    } else if (typeof generateThoughts === 'function') {
      Scene_Thoughts.prototype.generateThoughts = generateThoughts;
    }
  }

  PluginManager.registerCommand(pluginName, "setMarkovDB", args => {
    const partyIndex = Number(args.partyIndex);
    const markovData = args.markovData;
    
    if (partyIndex >= 1 && partyIndex <= 3 && markovData) {
        // Get the actual actor from party position
        const actor = $gameParty.members()[partyIndex - 1];
        if (actor) {
            // Initialize markov database storage if it doesn't exist
            if (!$gameSystem._markovDatabases) {
                $gameSystem._markovDatabases = {};
            }
            
            // Store the markov data for this actor
            $gameSystem._markovDatabases[actor.actorId()] = markovData;
            
            console.log(`Markov database registered for ${actor.name()} (Party Member ${partyIndex})`);
        } else {
            console.warn(`No actor found at party position ${partyIndex}`);
        }
    } else {
        console.warn("Invalid party index (must be 1-3) or missing markov data");
    }
});
})()
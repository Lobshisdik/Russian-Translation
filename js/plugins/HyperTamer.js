/*:
 * @target MZ
 * @plugindesc HyperTamer Virtual Pet System v2.0.0
 * @author Omni-Lex
 * @url 
 * @help
 * ============================================================================
 * HyperTamer - Virtual Pet Plugin for RPG Maker MZ
 * ============================================================================
 * 
 * This plugin adds a virtual pet system to your game with a retro LCD style
 * interface. Pets are based on enemies from your database and require
 * real-time care to survive.
 * 
 * Features:
 * - Random pet selection from enemy database
 * - Personality system affecting behavior
 * - Real-time needs management
 * - Training mini-games to improve stats
 * - Dynamic growth system
 * - Monochrome LCD display effect
 * - Offline time calculation
 * - Custom device frame overlay
 * 
 * ============================================================================
 * Plugin Commands
 * ============================================================================
 * 
 * Open HyperTamer - Opens the virtual pet interface
 * Reset Pet - Resets the current pet (warning: pet will die!)
 * 
 * @param deviceFrameImage
 * @text Device Frame Image
 * @desc PNG image for the device frame (must have transparent center)
 * @type file
 * @dir img/system/
 * @default HyperTamerFrame
 * 
 * @param lcdColorTint
 * @text LCD Color Tint
 * @desc Hex color for the LCD screen tint
 * @type string
 * @default #9BBC0F
 * 
 * @param updateInterval
 * @text Update Interval
 * @desc Seconds between automatic need updates
 * @type number
 * @min 10
 * @max 300
 * @default 60
 * 
 * @param maxOfflineHours
 * @text Max Offline Hours
 * @desc Maximum hours of offline progression
 * @type number
 * @min 1
 * @max 168
 * @default 24
 * 
 * @param deathEnabled
 * @text Enable Pet Death
 * @desc Can pets die from neglect?
 * @type boolean
 * @default true
 * 
 * @param startingFood
 * @text Starting Food Items
 * @desc Number of food items player starts with
 * @type number
 * @min 0
 * @default 10
 * 
 * @param feedSound
 * @text Feed Sound Effect
 * @desc Sound effect when feeding pet
 * @type file
 * @dir audio/se/
 * @default Heal1
 * 
 * @param playSound
 * @text Play Sound Effect
 * @desc Sound effect when playing with pet
 * @type file
 * @dir audio/se/
 * @default Jump1
 * 
 * @param cleanSound
 * @text Clean Sound Effect
 * @desc Sound effect when cleaning pet
 * @type file
 * @dir audio/se/
 * @default Water1
 * 
 * @param happySound
 * @text Happy Sound Effect
 * @desc Sound effect when pet is happy
 * @type file
 * @dir audio/se/
 * @default Coin
 * 
 * @param sadSound
 * @text Sad Sound Effect
 * @desc Sound effect when pet is sad
 * @type file
 * @dir audio/se/
 * @default Down1
 * 
 * @param growthSound
 * @text Growth Sound Effect
 * @desc Sound effect when pet grows
 * @type file
 * @dir audio/se/
 * @default Powerup
 * 
 * @command openHyperTamer
 * @text Open HyperTamer
 * @desc Opens the virtual pet interface
 * 
 * @command resetPet
 * @text Reset Pet
 * @desc Resets the current pet (it will die!)
 * 
 */

(() => {
    'use strict';
    
    const pluginName = 'HyperTamer';
    const parameters = PluginManager.parameters(pluginName);
    
    const deviceFrameImage = parameters['deviceFrameImage'] || 'HyperTamerFrame';
    const lcdColorTint = parseInt(parameters['lcdColorTint'].replace('#', '0x')) || 0x9BBC0F;
    const updateInterval = Number(parameters['updateInterval']) || 60;
    const maxOfflineHours = Number(parameters['maxOfflineHours']) || 24;
    const deathEnabled = parameters['deathEnabled'] === 'true';
    const startingFood = Number(parameters['startingFood']) || 10;
    
    // Sound effects
    const soundEffects = {
        feed: parameters['feedSound'] || 'Heal1',
        play: parameters['playSound'] || 'Jump1',
        clean: parameters['cleanSound'] || 'Water1',
        happy: parameters['happySound'] || 'Coin',
        sad: parameters['sadSound'] || 'Down1',
        growth: parameters['growthSound'] || 'Powerup'
    };
    
    // Personality types
    const PERSONALITIES = {
        CHEERFUL: { happiness: 1.2, energy: 1.1, hunger: 0.9 },
        LAZY: { happiness: 0.9, energy: 0.7, hunger: 1.3 },
        ENERGETIC: { happiness: 1.1, energy: 1.5, hunger: 1.2 },
        GRUMPY: { happiness: 0.7, energy: 0.9, hunger: 1.0 },
        GENTLE: { happiness: 1.0, energy: 0.8, cleanliness: 1.2 },
        WILD: { happiness: 0.8, energy: 1.3, cleanliness: 0.7 }
    };
    
    // Translation system
    const getLocalizedText = function(key) {
        const isItalian = ConfigManager.langSelect === 'it';
        const translations = {
            // UI Elements
            feed: isItalian ? 'Nutri' : 'Feed',
            play: isItalian ? 'Gioca' : 'Play',
            clean: isItalian ? 'Pulisci' : 'Clean',
            sleep: isItalian ? 'Dormi' : 'Sleep',
            train: isItalian ? 'Allena' : 'Train',
            medicine: isItalian ? 'Cura' : 'Medicine',
            
            // Needs
            hunger: isItalian ? 'Fame' : 'Hunger',
            happiness: isItalian ? 'Felicità' : 'Happiness',
            cleanliness: isItalian ? 'Pulizia' : 'Cleanliness',
            energy: isItalian ? 'Energia' : 'Energy',
            health: isItalian ? 'Salute' : 'Health',
            
            // Stats
            strength: isItalian ? 'Forza' : 'Strength',
            intelligence: isItalian ? 'Intelligenza' : 'Intelligence',
            agility: isItalian ? 'Agilità' : 'Agility',
            
            // Personalities
            CHEERFUL: isItalian ? 'ALLEGRO' : 'CHEERFUL',
            LAZY: isItalian ? 'PIGRO' : 'LAZY',
            ENERGETIC: isItalian ? 'ENERGICO' : 'ENERGETIC',
            GRUMPY: isItalian ? 'SCONTROSO' : 'GRUMPY',
            GENTLE: isItalian ? 'GENTILE' : 'GENTLE',
            WILD: isItalian ? 'SELVAGGIO' : 'WILD',
            
            // Messages
            tooFull: isItalian ? 'Troppo pieno!' : 'Too full!',
            tooTired: isItalian ? 'Troppo stanco...' : 'Too tired...',
            needRest: isItalian ? 'Ha bisogno di riposo!' : 'Need rest!',
            hatesBaths: isItalian ? 'Odia i bagni!' : 'Hates baths!',
            tooTiredOrHungry: isItalian ? 'Troppo stanco o affamato!' : 'Too tired or hungry!',
            
            // Death screen
            petDied: isItalian ? 'Il tuo animale è morto...' : 'Your pet has died...',
            pressOkNewPet: isItalian ? 'Premi OK per un nuovo animale' : 'Press OK to get a new pet',
            
            // Training games
            strengthTraining: isItalian ? 'Allenamento FORZA!' : 'STRENGTH Training!',
            intelligenceTraining: isItalian ? 'Allenamento INTELLIGENZA!' : 'INTELLIGENCE Training!',
            agilityTraining: isItalian ? 'Allenamento AGILITÀ!' : 'AGILITY Training!',
            tapRapidly: isItalian ? 'Tocca rapidamente!' : 'Tap rapidly!',
            matchPattern: isItalian ? 'Ripeti la sequenza!' : 'Match the pattern!',
            catchTarget: isItalian ? 'Prendi il bersaglio!' : 'Catch the target!',
            tapButton: isItalian ? 'TOCCA!' : 'TAP!',
            
            // UI labels
            score: isItalian ? 'Punti' : 'Score',
            time: isItalian ? 'Tempo' : 'Time',
            level: isItalian ? 'Liv.' : 'Lv.',
            age: isItalian ? 'Età' : 'Age',
            days: isItalian ? 'giorni' : 'days',
            food: isItalian ? 'Cibo' : 'Food',
            
            // Menu
            menuCommand: isItalian ? 'HyperDomatore' : 'HyperTamer'
        };
        
        return translations[key] || key;
    };
    
    // Register plugin commands
    PluginManager.registerCommand(pluginName, 'openHyperTamer', args => {
        SceneManager.push(Scene_HyperTamer);
    });
    
    PluginManager.registerCommand(pluginName, 'resetPet', args => {
        $gameSystem.hyperTamerReset();
    });
    
    //=============================================================================
    // Sound Manager Extensions
    //=============================================================================
    
    const playPetSound = function(type) {
        const se = {
            name: soundEffects[type],
            volume: 90,
            pitch: 100,
            pan: 0
        };
        AudioManager.playSe(se);
    };
    
    //=============================================================================
    // LCD Filter for PIXI
    //=============================================================================
    
    class LCDFilter extends PIXI.Filter {
        constructor() {
            const vertexShader = `
                attribute vec2 aVertexPosition;
                attribute vec2 aTextureCoord;
                uniform mat3 projectionMatrix;
                varying vec2 vTextureCoord;
                void main(void) {
                    gl_Position = vec4((projectionMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);
                    vTextureCoord = aTextureCoord;
                }
            `;
            
            const fragmentShader = `
                varying vec2 vTextureCoord;
                uniform sampler2D uSampler;
                uniform vec3 tint;
                uniform float pixelSize;
                
                void main(void) {
                    vec2 coord = vTextureCoord;
                    
                    // Pixelate effect
                    coord = floor(coord / pixelSize) * pixelSize;
                    
                    vec4 color = texture2D(uSampler, coord);
                    
                    // Convert to grayscale
                    float gray = dot(color.rgb, vec3(0.299, 0.587, 0.114));
                    
                    // Apply LCD tint
                    vec3 tinted = mix(vec3(0.0), tint, gray);
                    
                    // Add slight grid pattern
                    float grid = sin(vTextureCoord.x * 200.0) * sin(vTextureCoord.y * 200.0) * 0.05;
                    tinted += grid;
                    
                    gl_FragColor = vec4(tinted, color.a);
                }
            `;
            
            super(vertexShader, fragmentShader);
            
            this.uniforms.tint = new Float32Array([
                ((lcdColorTint >> 16) & 0xFF) / 255,
                ((lcdColorTint >> 8) & 0xFF) / 255,
                (lcdColorTint & 0xFF) / 255
            ]);
            this.uniforms.pixelSize = 0.004;
        }
    }
    
    //=============================================================================
    // Game_System Extensions
    //=============================================================================
    
    const _Game_System_initialize = Game_System.prototype.initialize;
    Game_System.prototype.initialize = function() {
        _Game_System_initialize.call(this);
        this.initializeHyperTamer();
    };
    
    Game_System.prototype.initializeHyperTamer = function() {
        this._hyperTamerData = this._hyperTamerData || this.createNewPet();
        this._hyperTamerItems = this._hyperTamerItems || {
            food: startingFood,
            toys: 3,
            medicine: 2
        };
    };
    
    Game_System.prototype.createNewPet = function() {
        // Get valid enemies (exclude bosses and special enemies)
        const enemies = $dataEnemies.filter(e => 
            e && e.name && e.battlerName && !e.meta.boss
        );
        
        if (enemies.length === 0) {
            console.error('No valid enemies found for HyperTamer!');
            return null;
        }
        
        const randomEnemy = enemies[Math.floor(Math.random() * enemies.length)];
        const personalityKeys = Object.keys(PERSONALITIES);
        const randomPersonality = personalityKeys[Math.floor(Math.random() * personalityKeys.length)];
        
        return {
            petId: randomEnemy.id,
            petName: randomEnemy.name,
            birthTime: Date.now(),
            lastUpdateTime: Date.now(),
            needs: {
                hunger: 50,
                happiness: 50,
                cleanliness: 100,
                energy: 100,
                health: 100
            },
            stats: {
                age: 0,
                careTaken: 0,
                deaths: 0,
                level: 1,
                exp: 0,
                // Training stats
                strength: 0,
                intelligence: 0,
                agility: 0
            },
            personality: randomPersonality,
            personalityTraits: PERSONALITIES[randomPersonality],
            isAlive: true,
            isSleeping: false,
            size: 1.0,
            mood: 'neutral',
            lastInteraction: null,
            enemy: randomEnemy
        };
    };
    
    Game_System.prototype.hyperTamerData = function() {
        if (!this._hyperTamerData) {
            this.initializeHyperTamer();
        }
        return this._hyperTamerData;
    };
    
    Game_System.prototype.hyperTamerItems = function() {
        if (!this._hyperTamerItems) {
            this.initializeHyperTamer();
        }
        return this._hyperTamerItems;
    };
    
    Game_System.prototype.hyperTamerReset = function() {
        if (this._hyperTamerData) {
            this._hyperTamerData.isAlive = false;
            this._hyperTamerData.stats.deaths++;
        }
        this._hyperTamerData = this.createNewPet();
    };
    
    Game_System.prototype.updateHyperTamerOffline = function() {
        const data = this.hyperTamerData();
        if (!data || !data.isAlive) return;
        
        const currentTime = Date.now();
        const timeDiff = currentTime - data.lastUpdateTime;
        const hoursPassed = Math.min(timeDiff / (1000 * 60 * 60), maxOfflineHours);
        
        if (hoursPassed > 0.1) { // Only update if at least 6 minutes passed
            const enemy = $dataEnemies[data.petId];
            this.applyNeedChanges(data, hoursPassed, enemy);
            data.lastUpdateTime = currentTime;
        }
    };
    
    Game_System.prototype.applyNeedChanges = function(data, hours, enemy) {
        // Base rates modified by enemy stats and personality
        const traits = data.personalityTraits;
        const hungerRate = (10 + (enemy.params[2] / 100)) * hours * (traits.hunger || 1);
        const happinessRate = (5 + (enemy.params[1] / 200)) * hours * (traits.happiness || 1);
        const cleanRate = 8 * hours * (traits.cleanliness || 1);
        const energyRate = (6 + (enemy.params[6] / 150)) * hours * (traits.energy || 1);
        
        // Apply changes
        data.needs.hunger = Math.max(0, data.needs.hunger - hungerRate);
        data.needs.happiness = Math.max(0, data.needs.happiness - happinessRate);
        data.needs.cleanliness = Math.max(0, data.needs.cleanliness - cleanRate);
        
        if (!data.isSleeping) {
            data.needs.energy = Math.max(0, data.needs.energy - energyRate);
        } else {
            data.needs.energy = Math.min(100, data.needs.energy + (10 * hours));
        }
        
        // Health is affected by other needs
        if (data.needs.hunger < 20 || data.needs.cleanliness < 20) {
            const healthLoss = (5 + (100 - enemy.params[3]) / 100) * hours;
            data.needs.health = Math.max(0, data.needs.health - healthLoss);
        }
        
        // Update mood based on needs
        this.updatePetMood(data);
        
        // Check for death
        if (deathEnabled && data.needs.health <= 0) {
            data.isAlive = false;
            data.stats.deaths++;
        }
        
        // Update age and check for growth
        const oldAge = data.stats.age;
        data.stats.age = Math.floor((Date.now() - data.birthTime) / (1000 * 60 * 60 * 24));
        
        if (data.stats.age > oldAge && data.stats.age % 3 === 0) {
            this.petGrowth(data);
        }
    };
    
    Game_System.prototype.updatePetMood = function(data) {
        const avgNeeds = (data.needs.hunger + data.needs.happiness + 
                         data.needs.cleanliness + data.needs.energy) / 4;
        
        if (avgNeeds > 70) {
            data.mood = 'happy';
        } else if (avgNeeds > 40) {
            data.mood = 'neutral';
        } else if (avgNeeds > 20) {
            data.mood = 'sad';
        } else {
            data.mood = 'angry';
        }
    };
    
    Game_System.prototype.petGrowth = function(data) {
        // Increase size and stats
        data.size = Math.min(data.size + 0.1, 2.0);
        data.stats.level = Math.floor(data.stats.age / 3) + 1;
        playPetSound('growth');
    };
    
    Game_System.prototype.gainPetExp = function(amount) {
        const data = this.hyperTamerData();
        if (!data || !data.isAlive) return;
        
        data.stats.exp += amount;
        const expNeeded = data.stats.level * 100;
        
        if (data.stats.exp >= expNeeded) {
            data.stats.exp -= expNeeded;
            data.stats.level++;
            data.size = Math.min(data.size + 0.05, 2.0);
            playPetSound('growth');
        }
    };
    
    //=============================================================================
    // Scene_HyperTamer
    //=============================================================================
    
    class Scene_HyperTamer extends Scene_Base {
        initialize() {
            super.initialize();
            this._lastUpdateTime = Date.now();
            this._updateTimer = 0;
            this._animationTimer = 0;
            this._currentMinigame = null;
        }
        
        create() {
            super.create();
            $gameSystem.updateHyperTamerOffline();
            this.createBackground();
            this.createLCDScreen();
            this.createPetSprite();
            this.createUI();
            this.createDeviceFrame();
            this.refreshDisplay();
        }
        
        createBackground() {
            this._backgroundSprite = new Sprite();
            this._backgroundSprite.bitmap = new Bitmap(Graphics.width, Graphics.height);
            this._backgroundSprite.bitmap.fillAll('black');
            this.addChild(this._backgroundSprite);
        }
        
        createLCDScreen() {
            // Create LCD container
            this._lcdContainer = new Sprite();
            this._lcdContainer.bitmap = new Bitmap(320, 240);
            this._lcdContainer.x = (Graphics.width - 320) / 2;
            this._lcdContainer.y = (Graphics.height - 240) / 2 - 50;
            
            // Apply LCD filter
            this._lcdFilter = new LCDFilter();
            this._lcdContainer.filters = [this._lcdFilter];
            
            this.addChild(this._lcdContainer);
        }
        
        createPetSprite() {
            const data = $gameSystem.hyperTamerData();
            if (!data || !data.isAlive) {
                this.createDeathScreen();
                return;
            }
            
            const enemy = $dataEnemies[data.petId];
            this._petSprite = new Sprite();
            
            // Load enemy battler
            if (enemy.battlerName) {
                this._petSprite.bitmap = ImageManager.loadEnemy(enemy.battlerName);
                this._petSprite.setFrame(0, 0, 0, 0);
                
                this._petSprite.bitmap.addLoadListener(() => {
                    // Scale to fit LCD screen with growth
                    const maxWidth = 200;
                    const maxHeight = 150;
                    const baseScale = Math.min(
                        maxWidth / this._petSprite.bitmap.width,
                        maxHeight / this._petSprite.bitmap.height,
                        1
                    );
                    const growthScale = data.size;
                    
                    this._petSprite.scale.x = baseScale * growthScale;
                    this._petSprite.scale.y = baseScale * growthScale;
                    
                    this._petSprite.x = 160;
                    this._petSprite.y = 100;
                    this._petSprite.anchor.x = 0.5;
                    this._petSprite.anchor.y = 0.5;
                });
            }
            
            // Create mood indicator
            this._moodSprite = new Sprite();
            this._moodSprite.bitmap = new Bitmap(32, 32);
            this._moodSprite.x = 280;
            this._moodSprite.y = 10;
            this.updateMoodSprite();
            
            this._lcdContainer.addChild(this._petSprite);
            this._lcdContainer.addChild(this._moodSprite);
        }
        
        updateMoodSprite() {
            const data = $gameSystem.hyperTamerData();
            if (!data || !this._moodSprite) return;
            
            this._moodSprite.bitmap.clear();
            const moodEmojis = {
                happy: '😊',
                neutral: '😐',
                sad: '😢',
                angry: '😠'
            };
            
            this._moodSprite.bitmap.fontSize = 24;
            this._moodSprite.bitmap.drawText(
                moodEmojis[data.mood] || '😐', 
                0, 0, 32, 32, 'center'
            );
        }
        
        createDeathScreen() {
            this._deathText = new Sprite();
            this._deathText.bitmap = new Bitmap(320, 240);
            this._deathText.bitmap.fontSize = 24;
            this._deathText.bitmap.drawText(getLocalizedText('petDied'), 0, 100, 320, 32, 'center');
            this._deathText.bitmap.fontSize = 16;
            this._deathText.bitmap.drawText(getLocalizedText('pressOkNewPet'), 0, 140, 320, 32, 'center');
            this._lcdContainer.addChild(this._deathText);
        }
        
        createUI() {
            const data = $gameSystem.hyperTamerData();
            if (!data || !data.isAlive) return;
            
            // Create UI container
            this._uiContainer = new Sprite();
            this._uiContainer.bitmap = new Bitmap(320, 240);
            this._lcdContainer.addChild(this._uiContainer);
            
            // Create status bars
            this._statusBars = {};
            const barY = 10;
            const barHeight = 8;
            const needs = ['hunger', 'happiness', 'cleanliness', 'energy', 'health'];
            const icons = ['🍖', '😊', '🧼', '😴', '❤️'];
            
            needs.forEach((need, index) => {
                const y = barY + (index * 12);
                this.drawStatusBar(need, 40, y, barHeight, icons[index]);
            });
            
            // Create action buttons
            this._buttons = [];
            const buttonNames = ['feed', 'play', 'clean', 'sleep', 'train'];
            const buttonY = 180;
            
            buttonNames.forEach((name, index) => {
                const button = new Sprite_Button(getLocalizedText(name));
                button.x = 10 + (index * 62);
                button.y = buttonY;
                button.setClickHandler(this.onButtonClick.bind(this, name.toLowerCase()));
                this._lcdContainer.addChild(button);
                this._buttons.push(button);
            });
        }
        
        drawStatusBar(need, x, y, height, icon) {
            const bitmap = this._uiContainer.bitmap;
            const data = $gameSystem.hyperTamerData();
            const value = data.needs[need];
            const width = 100;
            
            // Draw icon
            bitmap.fontSize = 12;
            bitmap.drawText(icon, x - 25, y - 2, 20, height + 4, 'center');
            
            // Draw bar background
            bitmap.fillRect(x, y, width, height, '#333333');
            
            // Draw bar fill
            const fillWidth = Math.floor((width - 2) * value / 100);
            const fillColor = this.getBarColor(need, value);
            bitmap.fillRect(x + 1, y + 1, fillWidth, height - 2, fillColor);
        }
        
        getBarColor(need, value) {
            if (need === 'health') {
                return value > 50 ? '#00FF00' : value > 20 ? '#FFFF00' : '#FF0000';
            }
            return value > 30 ? '#00FF00' : value > 10 ? '#FFFF00' : '#FF0000';
        }
        
        createDeviceFrame() {
            this._deviceFrame = new Sprite();
            this._deviceFrame.bitmap = ImageManager.loadSystem(deviceFrameImage);
            this._deviceFrame.bitmap.addLoadListener(() => {
                this._deviceFrame.x = (Graphics.width - this._deviceFrame.width) / 2;
                this._deviceFrame.y = (Graphics.height - this._deviceFrame.height) / 2;
            });
            this.addChild(this._deviceFrame);
        }
        
        onButtonClick(action) {
            const data = $gameSystem.hyperTamerData();
            const items = $gameSystem.hyperTamerItems();
            
            if (!data || !data.isAlive) {
                if (action === 'feed') { // Use feed button to revive
                    $gameSystem.hyperTamerReset();
                    SceneManager.goto(Scene_HyperTamer);
                }
                return;
            }
            
            // Check last interaction for dynamic responses
            const sameAction = data.lastInteraction === action;
            data.lastInteraction = action;
            
            switch(action) {
                case 'feed':
                    if (items.food > 0) {
                        if (data.needs.hunger > 80 && sameAction) {
                            // Overfeeding
                            data.needs.happiness = Math.max(0, data.needs.happiness - 10);
                            playPetSound('sad');
                            this.showMessage(getLocalizedText('tooFull'));
                        } else {
                            data.needs.hunger = Math.min(100, data.needs.hunger + 30);
                            items.food--;
                            data.stats.careTaken++;
                            playPetSound('feed');
                            if (data.needs.hunger > 70) {
                                playPetSound('happy');
                            }
                        }
                    } else {
                        SoundManager.playBuzzer();
                    }
                    break;
                    
                case 'play':
                    if (data.needs.energy > 20) {
                        if (data.personality === 'LAZY' && sameAction) {
                            data.needs.happiness = Math.max(0, data.needs.happiness - 5);
                            this.showMessage(getLocalizedText('tooTired'));
                        } else {
                            data.needs.happiness = Math.min(100, data.needs.happiness + 25);
                            data.needs.energy = Math.max(0, data.needs.energy - 10);
                            data.stats.careTaken++;
                            playPetSound('play');
                            $gameSystem.gainPetExp(10);
                        }
                    } else {
                        SoundManager.playBuzzer();
                        this.showMessage(getLocalizedText('needRest'));
                    }
                    break;
                    
                case 'clean':
                    if (data.personality === 'WILD' && data.needs.cleanliness > 50) {
                        data.needs.happiness = Math.max(0, data.needs.happiness - 15);
                        this.showMessage(getLocalizedText('hatesBaths'));
                    }
                    data.needs.cleanliness = 100;
                    data.stats.careTaken++;
                    playPetSound('clean');
                    break;
                    
                case 'sleep':
                    data.isSleeping = !data.isSleeping;
                    if (data.isSleeping) {
                        this._lcdContainer.opacity = 128;
                    } else {
                        this._lcdContainer.opacity = 255;
                    }
                    SoundManager.playOk();
                    break;
                    
                case 'train':
                    if (data.needs.energy > 30 && data.needs.hunger > 30) {
                        this.startMinigame();
                    } else {
                        SoundManager.playBuzzer();
                        this.showMessage(getLocalizedText('tooTiredOrHungry'));
                    }
                    break;
            }
            
            $gameSystem.updatePetMood(data);
            this.updateMoodSprite();
            this.refreshDisplay();
        }
        
        showMessage(text) {
            if (!this._messageSprite) {
                this._messageSprite = new Sprite();
                this._messageSprite.bitmap = new Bitmap(200, 32);
                this._messageSprite.x = 60;
                this._messageSprite.y = 150;
                this._lcdContainer.addChild(this._messageSprite);
            }
            
            this._messageSprite.bitmap.clear();
            this._messageSprite.bitmap.fontSize = 16;
            this._messageSprite.bitmap.drawText(text, 0, 0, 200, 32, 'center');
            this._messageSprite.opacity = 255;
            this._messageTimer = 60;
        }
        
        startMinigame() {
            const games = ['strength', 'intelligence', 'agility'];
            const randomGame = games[Math.floor(Math.random() * games.length)];
            this._currentMinigame = new MiniGame_Training(randomGame);
            this._currentMinigame.setFinishHandler(this.onMinigameFinish.bind(this));
            this._lcdContainer.addChild(this._currentMinigame);
        }
        
        onMinigameFinish(type, score) {
            const data = $gameSystem.hyperTamerData();
            
            // Award stats based on performance
            data.stats[type] += Math.floor(score / 10);
            
            // Award exp
            $gameSystem.gainPetExp(score);
            
            // Update needs
            data.needs.energy = Math.max(0, data.needs.energy - 20);
            data.needs.hunger = Math.max(0, data.needs.hunger - 15);
            data.needs.happiness = Math.min(100, data.needs.happiness + 20);
            
            // Clean up minigame
            this._lcdContainer.removeChild(this._currentMinigame);
            this._currentMinigame = null;
            
            playPetSound('happy');
            this.refreshDisplay();
        }
        
        refreshDisplay() {
            if (this._uiContainer && this._uiContainer.bitmap) {
                this._uiContainer.bitmap.clear();
                const needs = ['hunger', 'happiness', 'cleanliness', 'energy', 'health'];
                const icons = ['🍖', '😊', '🧼', '😴', '❤️'];
                
                needs.forEach((need, index) => {
                    const y = 10 + (index * 12);
                    this.drawStatusBar(need, 40, y, 8, icons[index]);
                });
                
                // Draw pet info
                const data = $gameSystem.hyperTamerData();
                if (data && data.isAlive) {
                    const bitmap = this._uiContainer.bitmap;
                    bitmap.fontSize = 12;
                    const personalityText = getLocalizedText(data.personality);
                    bitmap.drawText(`${data.petName} (${personalityText}) ${getLocalizedText('level')}${data.stats.level}`, 10, 220, 300, 20, 'left');
                    
                    // Draw stats
                    bitmap.fontSize = 10;
                    const str = getLocalizedText('strength').substr(0, 3).toUpperCase();
                    const int = getLocalizedText('intelligence').substr(0, 3).toUpperCase();
                    const agi = getLocalizedText('agility').substr(0, 3).toUpperCase();
                    bitmap.drawText(`${str}:${data.stats.strength} ${int}:${data.stats.intelligence} ${agi}:${data.stats.agility}`, 10, 205, 150, 20, 'left');
                    
                    // Draw item counts
                    const items = $gameSystem.hyperTamerItems();
                    bitmap.drawText(`${getLocalizedText('food')}: ${items.food}`, 170, 205, 80, 20, 'left');
                }
            }
        }
        
        update() {
            super.update();
            
            // Handle input
            if (Input.isTriggered('cancel')) {
                this.popScene();
            }
            
            // Update message fade
            if (this._messageTimer > 0) {
                this._messageTimer--;
                if (this._messageTimer < 20) {
                    this._messageSprite.opacity = this._messageTimer * 12.75;
                }
            }
            
            // Update animation timer
            this._animationTimer++;
            
            // Update needs periodically
            this._updateTimer++;
            if (this._updateTimer >= updateInterval * 60) { // Convert seconds to frames
                this._updateTimer = 0;
                const data = $gameSystem.hyperTamerData();
                if (data && data.isAlive) {
                    $gameSystem.applyNeedChanges(data, updateInterval / 3600, $dataEnemies[data.petId]);
                    this.refreshDisplay();
                    this.updateMoodSprite();
                    
                    if (!data.isAlive) {
                        playPetSound('sad');
                        SceneManager.goto(Scene_HyperTamer);
                    }
                }
            }
            
            // Animate pet based on mood and personality
            if (this._petSprite && $gameSystem.hyperTamerData().isAlive) {
                const data = $gameSystem.hyperTamerData();
                let baseY = 100;
                let animSpeed = 0.05;
                let animRange = 5;
                
                // Personality affects animation
                if (data.personality === 'ENERGETIC') {
                    animSpeed = 0.08;
                    animRange = 8;
                } else if (data.personality === 'LAZY') {
                    animSpeed = 0.03;
                    animRange = 3;
                }
                
                // Mood affects animation
                if (data.mood === 'happy') {
                    animRange *= 1.5;
                } else if (data.mood === 'sad') {
                    animRange *= 0.5;
                    baseY += 10;
                }
                
                if (data.isSleeping) {
                    // Gentle breathing animation when sleeping
                    this._petSprite.scale.x = this._petSprite.scale.y = 
                        (data.size * 0.95) + Math.sin(this._animationTimer * 0.02) * 0.05;
                } else {
                    // Bouncing animation
                    this._petSprite.y = baseY + Math.sin(this._animationTimer * animSpeed) * animRange;
                }
            }
        }
            
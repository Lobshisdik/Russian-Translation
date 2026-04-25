/*:
 * @target MZ
 * @plugindesc Dynamic Lighting System v1.2.0
 * @author Omni-Lex
 * @help
 * ============================================================================
 * Dynamic Lighting System Plugin for RPG Maker MZ
 * ============================================================================
 * * v1.2.0: Added compatibility with WeatherSystem.js manual time modes.
 * * This plugin creates a dynamic lighting system that works with the Weather
 * System plugin. Lights are automatically controlled based on time of day.
 * * Setup Instructions:
 * 1. Create a folder called "lights" in your img folder
 * 2. Add light images (e.g., light.png, tungsten.png, flashlight.png, etc.)
 * 3. Name events as "Light", "Streetlight", or "Daylight"
 * * Event Names:
 * - Light: Always active
 * - Streetlight: Active during dusk and night (18:00-06:00)
 * - Daylight: Active during sunrise and day (06:00-18:00)
 * * Event Notes:
 * You can customize lights by adding notes to events:
 * - <lightFile:filename> - Use a specific image file (without .png)
 * - <lightScale:0.5> - Scale the light (default 1.0)
 * - <lightOpacity:200> - Set opacity (0-255, default 255)
 * - <lightOffsetX:10> - Horizontal offset in pixels
 * - <lightOffsetY:-20> - Vertical offset in pixels
 * * Shorthand format also supported:
 * - "tungsten 0.4" - Uses tungsten.png at 0.4 scale
 * - "candle 0.8 150" - Uses candle.png at 0.8 scale with 150 opacity
 * * Flashlight Commands:
 * - Use "Add Player Light" command to give the player a flashlight
 * - Use "Remove Player Light" command to remove the player's flashlight
 * - The flashlight automatically rotates based on player direction
 * * @param defaultLightFile
 * @text Default Light File
 * @desc Default light image file (without .png extension)
 * @type string
 * @default light
 * * @param defaultScale
 * @text Default Scale
 * @desc Default scale for light images
 * @type number
 * @decimals 2
 * @min 0.1
 * @max 5
 * @default 2
 * * @param lightBlendMode
 * @text Light Blend Mode
 * @desc Blend mode for lights (0=Normal, 1=Add, 2=Multiply, 3=Screen)
 * @type number
 * @min 0
 * @max 3
 * @default 1
 * * @param fadeSpeed
 * @text Fade Speed
 * @desc Speed of light fade in/out (frames)
 * @type number
 * @min 1
 * @max 60
 * @default 30
 * * @param flashlightScale
 * @text Flashlight Scale
 * @desc Default scale for player flashlight
 * @type number
 * @decimals 2
 * @min 0.1
 * @max 5
 * @default 1.5
 * * @param flashlightOpacity
 * @text Flashlight Opacity
 * @desc Default opacity for player flashlight (0-255)
 * @type number
 * @min 0
 * @max 255
 * @default 200
 * * @param enableDebug
 * @text Enable Debug Messages
 * @desc Show debug messages in console
 * @type boolean
 * @default false
 * * @param sunriseHour
 * @text Sunrise Hour
 * @desc Hour when sunrise begins (24-hour format)
 * @type number
 * @min 0
 * @max 23
 * @default 6
 * * @param sunsetHour
 * @text Sunset Hour
 * @desc Hour when sunset begins (24-hour format)
 * @type number
 * @min 0
 * @max 23
 * @default 18
 * * @command refreshLights
 * @text Refresh All Lights
 * @desc Immediately refresh all lights on the current map
 * * @command toggleLight
 * @text Toggle Light
 * @desc Toggle a specific light on/off
 * @arg eventId
 * @text Event ID
 * @desc ID of the event to toggle
 * @type number
 * @min 1
 * @default 1
 * * @command addPlayerLight
 * @text Add Player Light
 * @desc Add a flashlight to the player that follows them
 * * @command removePlayerLight
 * @text Remove Player Light
 * @desc Remove the player's flashlight
 * */

(() => {
    'use strict';
    
    const pluginName = 'DynamicLightingSystem';
    const parameters = PluginManager.parameters(pluginName);
    const defaultLightFile = parameters['defaultLightFile'] || 'light';
    const defaultScale = Number(parameters['defaultScale'] || 4);
    const lightBlendMode = Number(parameters['lightBlendMode'] || 1);
    const fadeSpeed = Number(parameters['fadeSpeed'] || 30);
    const flashlightScale = Number(parameters['flashlightScale'] || 1.5);
    const flashlightOpacity = Number(parameters['flashlightOpacity'] || 200);
    const enableDebug = parameters['enableDebug'] === 'true';
    const sunriseHour = Number(parameters['sunriseHour'] || 6);
    const sunsetHour = Number(parameters['sunsetHour'] || 18);
    
    // Light types enum
    const LightTypes = {
        ALWAYS: 'Light',
        STREET: 'Streetlight',
        DAY: 'Daylight'
    };
    
    // Plugin Commands
    PluginManager.registerCommand(pluginName, 'refreshLights', args => {
        if ($gameLighting) {
            $gameLighting.refreshAllLights();
        }
    });
    
    PluginManager.registerCommand(pluginName, 'toggleLight', args => {
        const eventId = Number(args.eventId);
        if ($gameLighting && eventId > 0) {
            $gameLighting.toggleLight(eventId);
        }
    });
    
    PluginManager.registerCommand(pluginName, 'addPlayerLight', args => {
        if ($gameLighting) {
            $gameLighting.addPlayerLight();
            if (enableDebug) {
                console.log('Player flashlight added');
            }
        }
    });
    
    PluginManager.registerCommand(pluginName, 'removePlayerLight', args => {
        if ($gameLighting) {
            $gameLighting.removePlayerLight();
            if (enableDebug) {
                console.log('Player flashlight removed');
            }
        }
    });
    
    // Player Light Sprite Class
    class Sprite_PlayerLight extends Sprite {
        constructor() {
            super();
            this.anchor.set(0.5, 0.5);
            this.blendMode = lightBlendMode;
            this._targetOpacity = flashlightOpacity;
            this._fadeSpeed = fadeSpeed;
            this._lastDirection = $gamePlayer.direction();
            this.initMembers();
        }
        
        initMembers() {
            this.loadBitmap();
            this.updatePosition();
            this.updateRotation();
            this.opacity = 0; // Start faded out
        }
        
        loadBitmap() {
            this.bitmap = ImageManager.loadBitmap('img/lights/', 'flashlight');
            this.scale.set(flashlightScale);
            
            this.bitmap.addLoadListener(() => {
                if (enableDebug) {
                    console.log('Loaded flashlight image');
                }
            });
        }
        
        updatePosition() {
            if (!$gamePlayer) return;
            
            const tw = $gameMap.tileWidth();
            const th = $gameMap.tileHeight();
            
            this.x = $gamePlayer.screenX();
            this.y = $gamePlayer.screenY() - th/2;
        }
        
        updateRotation() {
            if (!$gamePlayer) return;
            
            const direction = $gamePlayer.direction();
            
            // Only update rotation if direction changed
            if (direction !== this._lastDirection) {
                this._lastDirection = direction;
                
                // Set rotation based on direction
                switch (direction) {
                    case 2: // Down
                        this.rotation = 0;
                        break;
                    case 4: // Left  
                        this.rotation = -Math.PI / 2;
                        break;
                    case 6: // Right
                        this.rotation = Math.PI / 2;
                        break;
                    case 8: // Up
                        this.rotation = Math.PI;
                        break;
                }
                
                if (enableDebug) {
                    console.log(`Flashlight rotated for direction: ${direction}, rotation: ${this.rotation}`);
                }
            }
        }
        
        update() {
            super.update();
            this.updatePosition();
            this.updateRotation();
            this.updateOpacity();
        }
        
        updateOpacity() {
            // Smooth fade transition
            if (this.opacity < this._targetOpacity) {
                this.opacity = Math.min(this.opacity + (255 / this._fadeSpeed), this._targetOpacity);
            } else if (this.opacity > this._targetOpacity) {
                this.opacity = Math.max(this.opacity - (255 / this._fadeSpeed), this._targetOpacity);
            }
        }
        
        fadeOut() {
            this._targetOpacity = 0;
        }
        
        fadeIn() {
            this._targetOpacity = flashlightOpacity;
        }
    }
    
    // Light Sprite Class
    class Sprite_Light extends Sprite {
        constructor(event) {
            super();
            this._event = event;
            this._lightType = null;
            this._lightConfig = {};
            this._targetOpacity = 0;
            this._fadeSpeed = fadeSpeed;
            this.anchor.set(0.5, 0.5);
            this.blendMode = lightBlendMode;
            this._manuallyDisabled = false;
            this.initMembers();
        }
        
        initMembers() {
            if (!this._event || typeof this._event.event !== 'function') {
                if (enableDebug) {
                    console.warn('Invalid event passed to Sprite_Light constructor:', this._event);
                }
                return;
            }
            
            this.parseLightType();
            this.parseLightConfig();
            this.loadBitmap();
            this.updatePosition();
            this.updateVisibility();
        }
        
        parseLightType() {
            if (!this._event || typeof this._event.event !== 'function') {
                return;
            }
            
            const eventData = this._event.event();
            if (!eventData || !eventData.name) {
                return;
            }
            
            const eventName = eventData.name;
            if (eventName === LightTypes.ALWAYS) {
                this._lightType = LightTypes.ALWAYS;
            } else if (eventName === LightTypes.STREET) {
                this._lightType = LightTypes.STREET;
            } else if (eventName === LightTypes.DAY) {
                this._lightType = LightTypes.DAY;
            }
        }
        
        parseLightConfig() {
            if (!this._event || typeof this._event.event !== 'function') {
                return;
            }
            
            const event = this._event.event();
            if (!event) {
                return;
            }
            
            const note = event.note || '';
            
            this._lightConfig = {
                file: defaultLightFile,
                scale: defaultScale,
                opacity: 200,
                offsetX: 0,
                offsetY: 0
            };
            
            // Parse tag format
            const fileMatch = note.match(/<lightFile:(\w+)>/i);
            if (fileMatch) {
                this._lightConfig.file = fileMatch[1];
            }
            
            const scaleMatch = note.match(/<lightScale:([\d.]+)>/i);
            if (scaleMatch) {
                this._lightConfig.scale = parseFloat(scaleMatch[1]);
            }
            
            const opacityMatch = note.match(/<lightOpacity:(\d+)>/i);
            if (opacityMatch) {
                this._lightConfig.opacity = parseInt(opacityMatch[1]);
            }
            
            const offsetXMatch = note.match(/<lightOffsetX:([-\d]+)>/i);
            if (offsetXMatch) {
                this._lightConfig.offsetX = parseInt(offsetXMatch[1]);
            }
            
            const offsetYMatch = note.match(/<lightOffsetY:([-\d]+)>/i);
            if (offsetYMatch) {
                this._lightConfig.offsetY = parseInt(offsetYMatch[1]);
            }
            
            // Parse shorthand format
            const shorthandMatch = note.match(/^(\w+)\s+([\d.]+)(?:\s+(\d+))?$/);
            if (shorthandMatch) {
                this._lightConfig.file = shorthandMatch[1];
                this._lightConfig.scale = parseFloat(shorthandMatch[2]);
                if (shorthandMatch[3]) {
                    this._lightConfig.opacity = parseInt(shorthandMatch[3]);
                }
            }
            
            if (enableDebug) {
                console.log(`Light Config for Event ${this._event.eventId()}:`, this._lightConfig);
            }
        }
        
        loadBitmap() {
            const filename = `img/lights/${this._lightConfig.file}.png`;
            this.bitmap = ImageManager.loadBitmap('img/lights/', this._lightConfig.file);
            this.scale.set(this._lightConfig.scale);
            
            this.bitmap.addLoadListener(() => {
                if (enableDebug) {
                    console.log(`Loaded light image: ${filename}`);
                }
            });
        }
        
        updatePosition() {
            if (!this._event || typeof this._event.screenX !== 'function') {
                return;
            }
            
            const tw = $gameMap.tileWidth();
            const th = $gameMap.tileHeight();
            
            this.x = this._event.screenX() + this._lightConfig.offsetX;
            this.y = this._event.screenY() - th/2 + this._lightConfig.offsetY;
        }
        
        // MODIFIED FUNCTION
        updateVisibility() {
            if (this._manuallyDisabled) {
                this._targetOpacity = 0;
                return;
            }

            // Get the sunlight mode from WeatherSystem.js, default to 'full' if not available.
            const sunlightMode = ($gameWeather && typeof $gameWeather.getSunlightMode === 'function') 
                ? $gameWeather.getSunlightMode() 
                : 'full';

            let shouldBeVisible = false;

            switch (sunlightMode) {
                case 'day':
                    // Day Only mode: Only 'Daylight' and 'Light' are on.
                    if (this._lightType === LightTypes.DAY || this._lightType === LightTypes.ALWAYS) {
                        shouldBeVisible = true;
                    }
                    break;

                case 'night':
                case 'dusk':
                    // Night/Dusk Only mode: Only 'Streetlight' and 'Light' are on.
                    if (this._lightType === LightTypes.STREET || this._lightType === LightTypes.ALWAYS) {
                        shouldBeVisible = true;
                    }
                    break;

                case 'full':
                default:
                    // Full Cycle mode: Use the original time-based logic.
                    const currentHour = this.getCurrentHour();
                    switch (this._lightType) {
                        case LightTypes.ALWAYS:
                            shouldBeVisible = true;
                            break;
                        case LightTypes.STREET:
                            shouldBeVisible = currentHour >= sunsetHour || currentHour < sunriseHour;
                            break;
                        case LightTypes.DAY:
                            shouldBeVisible = currentHour >= sunriseHour && currentHour < sunsetHour;
                            break;
                    }
                    break;
            }

            this._targetOpacity = shouldBeVisible ? this._lightConfig.opacity : 0;
        }
        
        getCurrentHour() {
            // This function is now only used for 'full' cycle mode.
            if ($gameWeather && $gameWeather.currentHour !== undefined) {
                return $gameWeather.currentHour;
            }
            
            if ($gameVariables) {
                const hour = $gameVariables.value(23);
                if (hour >= 0 && hour <= 23) {
                    return hour;
                }
            }
            
            return 12; // Default to noon if no time source is found
        }
        
        update() {
            super.update();
            
            if (!this._event || typeof this._event.screenX !== 'function') {
                return;
            }
            
            this.updatePosition();
            this.updateVisibility();
            this.updateOpacity();
        }
        
        updateOpacity() {
            if (this.opacity < this._targetOpacity) {
                this.opacity = Math.min(this.opacity + (255 / this._fadeSpeed), this._targetOpacity);
            } else if (this.opacity > this._targetOpacity) {
                this.opacity = Math.max(this.opacity - (255 / this._fadeSpeed), this._targetOpacity);
            }
        }
        
        toggle() {
            this._manuallyDisabled = !this._manuallyDisabled;
            this.updateVisibility();
        }
        
        refresh() {
            if (!this._event || typeof this._event.event !== 'function') {
                return;
            }
            
            this.parseLightConfig();
            this.loadBitmap();
            this.updateVisibility();
        }
    }
    
    // Tile-based Light Class (for map 636 streetlight tiles)
    class Sprite_TileLight extends Sprite {
        constructor(x, y, tileId) {
            super();
            this._tileX = x;
            this._tileY = y;
            this._tileId = tileId;
            this._lightType = LightTypes.STREET;
            this._lightConfig = {
                file: defaultLightFile,
                scale: defaultScale,
                opacity: 200,
                offsetX: 0,
                offsetY: 0
            };
            this._targetOpacity = 0;
            this._fadeSpeed = fadeSpeed;
            this.anchor.set(0.5, 0.5);
            this.blendMode = lightBlendMode;
            this._manuallyDisabled = false;
            this.initMembers();
        }

        initMembers() {
            this.loadBitmap();
            this.updatePosition();
            this.updateVisibility();
        }

        loadBitmap() {
            const filename = `img/lights/${this._lightConfig.file}.png`;
            this.bitmap = ImageManager.loadBitmap('img/lights/', this._lightConfig.file);
            this.scale.set(this._lightConfig.scale);

        }

        updatePosition() {
            const tw = $gameMap.tileWidth();
            const th = $gameMap.tileHeight();

            this.x = ($gameMap.adjustX(this._tileX) + 0.5) * tw;
            this.y = ($gameMap.adjustY(this._tileY) + 0.5) * th;
        }

        updateVisibility() {
            if (this._manuallyDisabled) {
                this._targetOpacity = 0;
                return;
            }

            // Get the sunlight mode from WeatherSystem.js, default to 'full' if not available.
            const sunlightMode = ($gameWeather && typeof $gameWeather.getSunlightMode === 'function')
                ? $gameWeather.getSunlightMode()
                : 'full';

            let shouldBeVisible = false;
            let debugInfo = '';

            switch (sunlightMode) {
                case 'day':
                    // Day Only mode: Streetlights are off during day
                    shouldBeVisible = false;
                    debugInfo = 'Mode: Day Only - Streetlights OFF';
                    break;

                case 'night':
                case 'dusk':
                    // Night/Dusk Only mode: Streetlights are on
                    shouldBeVisible = true;
                    debugInfo = `Mode: ${sunlightMode} - Streetlights ON`;
                    break;

                case 'full':
                default:
                    // Full Cycle mode: Use the original time-based logic.
                    const currentHour = this.getCurrentHour();
                    shouldBeVisible = currentHour >= sunsetHour || currentHour < sunriseHour;
                    debugInfo = `Mode: Full Cycle - Hour: ${currentHour}, Sunset: ${sunsetHour}, Sunrise: ${sunriseHour} - ${shouldBeVisible ? 'ON' : 'OFF'}`;
                    break;
            }

            const previousOpacity = this._targetOpacity;
            this._targetOpacity = shouldBeVisible ? this._lightConfig.opacity : 0;

            // Only log when visibility changes
            if (previousOpacity !== this._targetOpacity) {
                console.log(`[TileLight] (${this._tileX},${this._tileY}) ${debugInfo}`);
            }
        }

        getCurrentHour() {
            if ($gameWeather && $gameWeather.currentHour !== undefined) {
                return $gameWeather.currentHour;
            }

            if ($gameVariables) {
                const hour = $gameVariables.value(23);
                if (hour >= 0 && hour <= 23) {
                    return hour;
                }
            }

            return 12; // Default to noon if no time source is found
        }

        update() {
            super.update();
            this.updatePosition();
            this.updateVisibility();
            this.updateOpacity();
        }

        updateOpacity() {
            if (this.opacity < this._targetOpacity) {
                this.opacity = Math.min(this.opacity + (255 / this._fadeSpeed), this._targetOpacity);
            } else if (this.opacity > this._targetOpacity) {
                this.opacity = Math.max(this.opacity - (255 / this._fadeSpeed), this._targetOpacity);
            }
        }

        refresh() {
            this.loadBitmap();
            this.updateVisibility();
        }
    }

    // Lighting Layer Class
    class Spriteset_Lighting extends Sprite {
        constructor() {
            super();
            this._lightSprites = [];
            this._playerLight = null;
            this.createLights();
        }

        createLights() {
            // Clear existing lights
            this.removeChildren();
            this._lightSprites = [];
            this._playerLight = null;

            if (!$gameMap || typeof $gameMap.events !== 'function') {
                if (enableDebug) {
                    console.warn('$gameMap or events method not available');
                }
                return;
            }

            const events = $gameMap.events();
            if (!Array.isArray(events)) {
                if (enableDebug) {
                    console.warn('$gameMap.events() did not return an array');
                }
                return;
            }

            events.forEach(event => {
                if (!event || typeof event.event !== 'function') {
                    if (enableDebug) {
                        console.warn('Invalid event found in events array:', event);
                    }
                    return;
                }

                if (this.isLightEvent(event)) {
                    const lightSprite = new Sprite_Light(event);
                    if (lightSprite._lightType) {
                        this._lightSprites.push(lightSprite);
                        this.addChild(lightSprite);

                        if (enableDebug) {
                            console.log(`Created light for event ${event.eventId()}: ${event.event().name}`);
                        }
                    }
                }
            });

            // Create tile-based lights for map 636
            if ($gameMap.mapId() === 636) {
                this.createTileLights();
            }

            // Recreate player light if it should exist
            if ($gameLighting && $gameLighting.hasPlayerLight()) {
                this.createPlayerLight();
            }
        }

        createTileLights() {

            if (!window.WorldGen || !window.WorldGen.MAP636_TILE_EVENTS) {
                return;
            }

            // Check if current biome should have streetlights
            const currentBiome = $gameSystem._procGenData ? $gameSystem._procGenData.currentBiomeName : null;
            if (currentBiome) {
                const biomeLower = currentBiome.toLowerCase();
                const shouldHaveLights = biomeLower.includes('road') ||
                                       biomeLower.includes('city') ||
                                       biomeLower.includes('village') ||
                                       biomeLower.includes('burg');

                if (!shouldHaveLights) {
                    console.log(`[DynamicLighting] Biome "${currentBiome}" does not require streetlights - skipping`);
                    return;
                }

                console.log(`[DynamicLighting] Biome "${currentBiome}" requires streetlights - creating lights`);
            }

            const streetlightConfig = window.WorldGen.MAP636_TILE_EVENTS['Streetlight'];
            if (!streetlightConfig || !streetlightConfig.tilesets) {
                return;
            }

            const currentTileset = $gameMap.tileset();
            const tilesetId = currentTileset ? currentTileset.id : 0;
            console.log('[DynamicLighting] Current tileset ID:', tilesetId);

            // Find the tileset configuration for streetlights
            const tilesetConfig = streetlightConfig.tilesets.find(
                config => config.tilesetId === tilesetId
            );

            if (!tilesetConfig || !tilesetConfig.tileIds || tilesetConfig.tileIds.length === 0) {
                return;
            }

            const streetlightTileIds = tilesetConfig.tileIds;

            const width = $gameMap.width();
            const height = $gameMap.height();
            let lightsCreated = 0;

            // Scan all map tiles (check layers 2, 3, 4 with priority order)
            for (let x = 0; x < width; x++) {
                for (let y = 0; y < height; y++) {
                    const layersToCheck = [4, 3, 2];

                    for (const layer of layersToCheck) {
                        const tileId = $gameMap.tileId(x, y, layer);

                        if (tileId !== 0 && streetlightTileIds.includes(tileId)) {
                            // Create a tile light at this position
                            const tileLight = new Sprite_TileLight(x, y, tileId);
                            this._lightSprites.push(tileLight);
                            this.addChild(tileLight);
                            lightsCreated++;


                            break; // Only use the highest layer tile
                        }
                    }
                }
            }

           
        }
        
        createPlayerLight() {
            if (this._playerLight) {
                this.removeChild(this._playerLight);
            }
            
            this._playerLight = new Sprite_PlayerLight();
            this.addChild(this._playerLight);
            
            if (enableDebug) {
                console.log('Created player flashlight');
            }
        }
        
        removePlayerLight() {
            if (this._playerLight) {
                this._playerLight.fadeOut();
                // Remove after fade completes
                setTimeout(() => {
                    if (this._playerLight) {
                        this.removeChild(this._playerLight);
                        this._playerLight = null;
                    }
                }, fadeSpeed * 16); // Convert frames to milliseconds
            }
        }
        
        isLightEvent(event) {
            if (!event || typeof event.event !== 'function') {
                return false;
            }
            
            const eventData = event.event();
            if (!eventData || !eventData.name) {
                return false;
            }
            
            const eventName = eventData.name;
            return eventName === LightTypes.ALWAYS || 
                   eventName === LightTypes.STREET || 
                   eventName === LightTypes.DAY;
        }
        
        update() {
            super.update();
            this._lightSprites.forEach(sprite => sprite.update());
            if (this._playerLight) {
                this._playerLight.update();
            }
        }
        
        refresh() {
            this._lightSprites.forEach(sprite => sprite.refresh());
        }
        
        toggleLight(eventId) {
            const sprite = this._lightSprites.find(s => s._event && s._event.eventId() === eventId);
            if (sprite) {
                sprite.toggle();
            }
        }
    }
    
    // Lighting System Manager
    class Game_LightingSystem {
        constructor() {
            this._enabled = true;
            this._lightingLayer = null;
            this._hasPlayerLight = false;
        }
        
        setLightingLayer(layer) {
            this._lightingLayer = layer;
        }
        
        refreshAllLights() {
            if (this._lightingLayer) {
                this._lightingLayer.refresh();
            }
        }
        
        toggleLight(eventId) {
            if (this._lightingLayer) {
                this._lightingLayer.toggleLight(eventId);
            }
        }
        
        addPlayerLight() {
            this._hasPlayerLight = true;
            if (this._lightingLayer) {
                this._lightingLayer.createPlayerLight();
            }
        }
        
        removePlayerLight() {
            this._hasPlayerLight = false;
            if (this._lightingLayer) {
                this._lightingLayer.removePlayerLight();
            }
        }
        
        hasPlayerLight() {
            return this._hasPlayerLight;
        }
        
        isEnabled() {
            return this._enabled;
        }
        
        setEnabled(enabled) {
            this._enabled = enabled;
        }
    }
    
    // Night Light Sprite Class (follows player, visible at night on Exterior maps)
    class Sprite_NightLight extends Sprite {
        constructor() {
            super();
            this.anchor.set(0.5, 0.5);
            this.blendMode = lightBlendMode;
            this._targetOpacity = 0;
            this._fadeSpeed = fadeSpeed;
            this.initMembers();
        }

        initMembers() {
            this.bitmap = ImageManager.loadBitmap('img/lights/', 'nightlight');
            this.updateScale();
            this.opacity = 0;
        }

        updateScale() {
            const mapId = $gameMap ? $gameMap.mapId() : 0;
            const scaleFactor = (mapId === 315 || mapId === 1049) ? 0.25 : 1.0;
            this.scale.set(defaultScale * scaleFactor);
        }

        // Returns a float like 18.5 for 18:30
        getCurrentHourFloat() {
            if ($gameVariables) {
                const dateStr = $gameVariables.value(113);
                if (dateStr && typeof dateStr === 'string') {
                    const timePart = dateStr.split(' ')[3];
                    if (timePart) {
                        const parts = timePart.split(':');
                        const h = parseInt(parts[0]);
                        const m = parseInt(parts[1]) || 0;
                        if (h >= 0 && h <= 23) return h + m / 60;
                    }
                }
            }
            if ($gameWeather && $gameWeather.currentHour !== undefined) {
                return $gameWeather.currentHour;
            }
            return 12;
        }

        // Returns opacity multiplier 0.0-1.0 based on time of day
        getNightLightIntensity() {
            const sunlightMode = ($gameWeather && typeof $gameWeather.getSunlightMode === 'function')
                ? $gameWeather.getSunlightMode()
                : 'full';

            switch (sunlightMode) {
                case 'night':
                    return 1.0;
                case 'dusk':
                    return 0.5;
                case 'day':
                    return 0.0;
                case 'full':
                default:
                    return this.calcIntensityFromTime();
            }
        }

        calcIntensityFromTime() {
            const t = this.getCurrentHourFloat();
            const fadeWindow = 2; // 2-hour transition window

            // Sunset fade-in: from sunsetHour-1 to sunsetHour+1
            const fadeInStart = sunsetHour - 1;
            const fadeInEnd = sunsetHour + 1;

            // Sunrise fade-out: from sunriseHour-1 to sunriseHour+1
            const fadeOutStart = sunriseHour - 1;
            const fadeOutEnd = sunriseHour + 1;

            // Full night: between fadeInEnd and fadeOutStart (wrapping midnight)
            if (t >= fadeInEnd || t < fadeOutStart) {
                // Could be full night - check more carefully with wrap
                if (fadeInEnd <= fadeOutStart) {
                    // No midnight wrap (unusual config)
                    if (t >= fadeInEnd && t < fadeOutStart) return 1.0;
                } else {
                    // Normal case: night wraps midnight
                    if (t >= fadeInEnd || t < fadeOutStart) return 1.0;
                }
            }

            // Fade in during sunset
            if (t >= fadeInStart && t < fadeInEnd) {
                return (t - fadeInStart) / fadeWindow;
            }

            // Fade out during sunrise
            if (t >= fadeOutStart && t < fadeOutEnd) {
                return 1.0 - (t - fadeOutStart) / fadeWindow;
            }

            // Daytime
            return 0.0;
        }

        isExteriorMap() {
            // Respect WeatherSystem's runtime exterior/interior override
            if ($gameWeather && typeof $gameWeather.isInterior !== 'undefined') {
                return !$gameWeather.isInterior;
            }
            // Fallback to map note tag
            return $dataMap && $dataMap.note && /<Exterior>/i.test($dataMap.note);
        }

        updatePosition() {
            if (!$gamePlayer) return;
            const th = $gameMap.tileHeight();
            this.x = $gamePlayer.screenX();
            this.y = $gamePlayer.screenY() - th / 2;
        }

        updateVisibility() {
            if (!ConfigManager.nightLight) {
                this._targetOpacity = 0;
                return;
            }

            // Force show on Dark maps, force hide on Light maps
            const forcedLighting = $gameWeather ? $gameWeather.forcedLighting : null;
            if (forcedLighting === 'dark') {
                this._targetOpacity = 200;
                return;
            }
            if (forcedLighting === 'light') {
                this._targetOpacity = 0;
                return;
            }

            if (!this.isExteriorMap()) {
                this._targetOpacity = 0;
                return;
            }
            const intensity = this.getNightLightIntensity();
            this._targetOpacity = Math.round(200 * intensity);
        }

        updateOpacity() {
            if (this.opacity < this._targetOpacity) {
                this.opacity = Math.min(this.opacity + (255 / this._fadeSpeed), this._targetOpacity);
            } else if (this.opacity > this._targetOpacity) {
                this.opacity = Math.max(this.opacity - (255 / this._fadeSpeed), this._targetOpacity);
            }
        }

        update() {
            super.update();
            this.updatePosition();
            this.updateScale();
            this.updateVisibility();
            this.updateOpacity();
        }
    }

    // Global lighting system object
    window.$gameLighting = null;
    
    // Initialize lighting system with game objects
    const _DataManager_createGameObjects = DataManager.createGameObjects;
    DataManager.createGameObjects = function() {
        _DataManager_createGameObjects.call(this);
        $gameLighting = new Game_LightingSystem();
    };
    
    // Save/Load lighting system
// Save/Load lighting system
const _DataManager_makeSaveContents = DataManager.makeSaveContents;
DataManager.makeSaveContents = function() {
    const contents = _DataManager_makeSaveContents.call(this);
    // Manually store only the necessary, serializable data
    contents.lighting = {
        _enabled: $gameLighting._enabled,
        _hasPlayerLight: $gameLighting._hasPlayerLight
    };
    return contents;
};

const _DataManager_extractSaveContents = DataManager.extractSaveContents;
DataManager.extractSaveContents = function(contents) {
    _DataManager_extractSaveContents.call(this, contents);
    const lightingData = contents.lighting;
    // Recreate the system object and restore its saved state
    $gameLighting = new Game_LightingSystem();
    if (lightingData) {
        $gameLighting._enabled = lightingData._enabled;
        $gameLighting._hasPlayerLight = lightingData._hasPlayerLight;
    }
};
    // Add night light to tilemap (below character sprites)
    const _Spriteset_Map_createCharacters = Spriteset_Map.prototype.createCharacters;
    Spriteset_Map.prototype.createCharacters = function() {
        // Create night light before characters so it renders behind them
        this._nightLight = new Sprite_NightLight();
        this._nightLight.z = 0; // Characters use z=3, so this goes below
        this._tilemap.addChild(this._nightLight);
        _Spriteset_Map_createCharacters.call(this);
    };

    // Add lighting layer to map spriteset
    const _Spriteset_Map_createLowerLayer = Spriteset_Map.prototype.createLowerLayer;
    Spriteset_Map.prototype.createLowerLayer = function() {
        _Spriteset_Map_createLowerLayer.call(this);
        this.createLightingLayer();
    };
    
    Spriteset_Map.prototype.createLightingLayer = function() {
        this._lightingLayer = new Spriteset_Lighting();
        const weatherIndex = this.children.indexOf(this._weather);
        if (weatherIndex >= 0) {
            this.addChildAt(this._lightingLayer, weatherIndex);
        } else {
            this.addChild(this._lightingLayer);
        }
        
        if ($gameLighting) {
            $gameLighting.setLightingLayer(this._lightingLayer);
        }
    };
    
    const _Spriteset_Map_update = Spriteset_Map.prototype.update;
    Spriteset_Map.prototype.update = function() {
        _Spriteset_Map_update.call(this);
        if (this._lightingLayer) {
            this._lightingLayer.update();
        }
        if (this._nightLight) {
            this._nightLight.update();
        }
    };
    
    // Refresh lights when entering a new map
    const _Scene_Map_onMapLoaded = Scene_Map.prototype.onMapLoaded;
    Scene_Map.prototype.onMapLoaded = function() {
        _Scene_Map_onMapLoaded.call(this);
        
        setTimeout(() => {
            if ($gameLighting && this._spriteset && this._spriteset._lightingLayer) {
                this._spriteset._lightingLayer.createLights();
                
                if (enableDebug) {
                    console.log('Lights refreshed for new map');
                }
            }
        }, 100);
    };
    
    // Initialize on game start
    const _Scene_Boot_start = Scene_Boot.prototype.start;
    Scene_Boot.prototype.start = function() {
        _Scene_Boot_start.call(this);
        if (!$gameLighting) {
            $gameLighting = new Game_LightingSystem();
        }
    };

    // ==========================================================================
    // ConfigManager - Night Light option (default ON)
    // ==========================================================================
    ConfigManager.nightLight = true;

    const _ConfigManager_makeData_lighting = ConfigManager.makeData;
    ConfigManager.makeData = function() {
        const config = _ConfigManager_makeData_lighting.call(this);
        config.nightLight = this.nightLight;
        return config;
    };

    const _ConfigManager_applyData_lighting = ConfigManager.applyData;
    ConfigManager.applyData = function(config) {
        _ConfigManager_applyData_lighting.call(this, config);
        this.nightLight = this.readFlag(config, 'nightLight', true);
    };

    // Add "Night Light" to Options menu
    const _Window_Options_addGeneralOptions_lighting = Window_Options.prototype.addGeneralOptions;
    Window_Options.prototype.addGeneralOptions = function() {
        _Window_Options_addGeneralOptions_lighting.call(this);
        this.addCommand('Night Light', 'nightLight');
    };

})();
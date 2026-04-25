//=============================================================================
// 3D Battler System
// Version: 1.0.1
//=============================================================================

/*:
 * @target MZ
 * @plugindesc Displays 3D models as battlers using GLB format
 * @author Omni-Lex
 * @url https://nocoldiz.itch.io/hypernet-explorer
 *
 * @help
 * ============================================================================
 * 3D Battler System v1.0.1
 * ============================================================================
 * 
 * This plugin replaces 2D battler sprites with 3D GLB models during battle.
 * 
 * ============================================================================
 * IMPORTANT: Three.js Setup
 * ============================================================================
 * 
 * This plugin requires Three.js and GLTFLoader to be loaded BEFORE this plugin.
 * Add these lines to your index.html in the <head> section:
 * 
 * <script src="js/libs/three.min.js"></script>
 * <script src="js/libs/GLTFLoader.js"></script>
 * 
 * Download files from:
 * - three.min.js: https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js
 * - GLTFLoader.js: https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/loaders/GLTFLoader.js
 * 
 * ============================================================================
 * Setup Instructions
 * ============================================================================
 * 
 * 1. Place GLB model files in: img/3d/
 * 2. Configure actors in plugin parameters
 * 3. Use note tags for enemies
 * 
 * ============================================================================
 * Options Menu
 * ============================================================================
 * 
 * An "Enemy Battlers" option is automatically added to the Options menu.
 * Players can switch between:
 * - 3D: Shows 3D models for enemies (if configured)
 * - 2D: Shows traditional 2D sprites for enemies
 * 
 * This setting is saved and persists between game sessions.
 * Actors always use their configured display mode (3D or 2D).
 * 
 * ============================================================================
 * Actor Configuration
 * ============================================================================
 * 
 * Configure in plugin parameters with:
 * - Actor ID
 * - GLB filename (without path)
 * - Scale
 * - Y Offset
 * 
 * ============================================================================
 * Enemy Note Tags
 * ============================================================================
 * 
 * Add to enemy notes:
 * <3d_model: filename.glb>
 * <3d_scale: 1.0>
 * <3d_offset_y: 0>
 * 
 * Example:
 * <3d_model: dragon.glb>
 * <3d_scale: 1.5>
 * <3d_offset_y: -50>
 * 
 * ============================================================================
 * Animations
 * ============================================================================
 * 
 * Supported animations (must be named exactly in GLB):
 * - idle (or idle2, idle3, etc.)
 * - attack (or attack2, attack3, etc.)
 * - specialAttack (or specialAttack2, specialAttack3, etc.)
 * - hit (or hit2, hit3, etc.)
 * - death (or death2, death3, etc.)
 * - spawn (or spawn2, spawn3, etc.)
 * 
 * ANIMATION VARIATIONS:
 * You can add multiple variations of any animation by adding numbers:
 * - attack, attack2, attack3, attack4, etc. (up to 20)
 * - hit, hit2, hit3
 * - The plugin will randomly pick one each time the animation plays
 * 
 * IDLE BEHAVIOR:
 * - Idle animation is selected ONCE at the start of battle
 * - If you have idle, idle2, idle3, one will be randomly chosen
 * - That same idle animation will loop for the entire battle
 * - This ensures consistent character personality/stance
 * 
 * Missing animations will fallback to idle or skip gracefully.
 * 
 * ============================================================================
 * 
 * @param actorModels
 * @text Actor 3D Models
 * @desc Configure 3D models for actors
 * @type struct<ActorModel>[]
 * @default []
 * 
 * @param enableDebug
 * @text Enable Debug Mode
 * @desc Show console logs for debugging
 * @type boolean
 * @default true
 * 
 * @param cameraDistance
 * @text Camera Distance
 * @desc Distance of camera from battlers
 * @type number
 * @decimals 1
 * @default 8
 * 
 * @param cameraHeight
 * @text Camera Height
 * @desc Height of camera
 * @type number
 * @decimals 1
 * @default 2
 * 
 * @param ambientLightColor
 * @text Ambient Light Color
 * @desc Ambient light color (hex)
 * @type string
 * @default #ffffff
 * 
 * @param ambientLightIntensity
 * @text Ambient Light Intensity
 * @desc Intensity of ambient light
 * @type number
 * @decimals 2
 * @min 0
 * @max 2
 * @default 0.6
 * 
 * @param directionalLightColor
 * @text Directional Light Color
 * @desc Directional light color (hex)
 * @type string
 * @default #ffffff
 * 
 * @param directionalLightIntensity
 * @text Directional Light Intensity
 * @desc Intensity of directional light
 * @type number
 * @decimals 2
 * @min 0
 * @max 2
 * @default 0.8
 */

/*~struct~ActorModel:
 * @param actorId
 * @text Actor ID
 * @desc ID of the actor
 * @type actor
 * @default 1
 * 
 * @param modelFile
 * @text Model Filename
 * @desc GLB filename (in img/3d/)
 * @type string
 * @default character.glb
 * 
 * @param scale
 * @text Scale
 * @desc Scale of the model
 * @type number
 * @decimals 2
 * @min 0.1
 * @max 10
 * @default 1.0
 * 
 * @param offsetY
 * @text Y Offset
 * @desc Vertical offset of the model
 * @type number
 * @decimals 0
 * @min -500
 * @max 500
 * @default 0
 */

(() => {
    'use strict';

    const pluginName = '3DBattlerSystem';
    const parameters = PluginManager.parameters(pluginName);
    
    const config = {
        actorModels: JSON.parse(parameters.actorModels || '[]').map(str => JSON.parse(str)),
        enableDebug: parameters.enableDebug === 'true',
        cameraDistance: Number(parameters.cameraDistance || 8),
        cameraHeight: Number(parameters.cameraHeight || 2),
        ambientLightColor: parameters.ambientLightColor || '#ffffff',
        ambientLightIntensity: Number(parameters.ambientLightIntensity || 0.6),
        directionalLightColor: parameters.directionalLightColor || '#ffffff',
        directionalLightIntensity: Number(parameters.directionalLightIntensity || 0.8)
    };

    // Debug logging
    function debugLog(...args) {
        if (config.enableDebug) {
            console.log('[3D Battler]', ...args);
        }
    }

    // Check if Three.js is loaded
    if (typeof THREE === 'undefined') {
        console.error('[3D Battler] THREE.js is not loaded! Please add three.min.js to your project.');
        console.error('[3D Battler] Add this to index.html: <script src="js/libs/three.min.js"></script>');
        return;
    }

    if (typeof THREE.GLTFLoader === 'undefined') {
        console.error('[3D Battler] GLTFLoader is not loaded! Please add GLTFLoader.js to your project.');
        console.error('[3D Battler] Add this to index.html: <script src="js/libs/GLTFLoader.js"></script>');
        return;
    }

    debugLog('Plugin initialized successfully');

    //=============================================================================
    // ConfigManager - Save/Load Settings
    //=============================================================================
    
    ConfigManager.enemyBattlerMode = '3d'; // Default to 3D

    const _ConfigManager_makeData = ConfigManager.makeData;
    ConfigManager.makeData = function() {
        const config = _ConfigManager_makeData.call(this);
        config.enemyBattlerMode = this.enemyBattlerMode;
        return config;
    };

    const _ConfigManager_applyData = ConfigManager.applyData;
    ConfigManager.applyData = function(config) {
        _ConfigManager_applyData.call(this, config);
        this.enemyBattlerMode = this.readBattlerMode(config, 'enemyBattlerMode');
    };

    ConfigManager.readBattlerMode = function(config, name) {
        const value = config[name];
        if (value !== undefined) {
            return value;
        } else {
            return '3d';
        }
    };

    //=============================================================================
    // Window_Options - Add Option to Menu
    //=============================================================================
    
    const _Window_Options_addGeneralOptions = Window_Options.prototype.addGeneralOptions;
    Window_Options.prototype.addGeneralOptions = function() {
        _Window_Options_addGeneralOptions.call(this);
        this.addCommand('Enemy Battlers', 'enemyBattlerMode');
    };

    const _Window_Options_statusText = Window_Options.prototype.statusText;
    Window_Options.prototype.statusText = function(index) {
        const symbol = this.commandSymbol(index);
        if (symbol === 'enemyBattlerMode') {
            return this.battlerModeStatusText();
        }
        return _Window_Options_statusText.call(this, index);
    };

    Window_Options.prototype.battlerModeStatusText = function() {
        const value = this.getConfigValue('enemyBattlerMode');
        return value === '3d' ? '3D' : '2D';
    };

    const _Window_Options_processOk = Window_Options.prototype.processOk;
    Window_Options.prototype.processOk = function() {
        const index = this.index();
        const symbol = this.commandSymbol(index);
        if (symbol === 'enemyBattlerMode') {
            this.changeBattlerMode();
        } else {
            _Window_Options_processOk.call(this);
        }
    };

    const _Window_Options_cursorRight = Window_Options.prototype.cursorRight;
    Window_Options.prototype.cursorRight = function() {
        const index = this.index();
        const symbol = this.commandSymbol(index);
        if (symbol === 'enemyBattlerMode') {
            this.changeBattlerMode();
        } else {
            _Window_Options_cursorRight.call(this);
        }
    };

    const _Window_Options_cursorLeft = Window_Options.prototype.cursorLeft;
    Window_Options.prototype.cursorLeft = function() {
        const index = this.index();
        const symbol = this.commandSymbol(index);
        if (symbol === 'enemyBattlerMode') {
            this.changeBattlerMode();
        } else {
            _Window_Options_cursorLeft.call(this);
        }
    };

    Window_Options.prototype.changeBattlerMode = function() {
        const currentValue = this.getConfigValue('enemyBattlerMode');
        const newValue = currentValue === '3d' ? '2d' : '3d';
        this.changeValue('enemyBattlerMode', newValue);
    };

    //=============================================================================
    // BattlerModel3D - Manages individual 3D model
    //=============================================================================
    
    class BattlerModel3D {
        constructor(filename, scale, offsetY) {
            this.filename = filename;
            this.scale = scale || 1.0;
            this.offsetY = offsetY || 0;
            this.model = null;
            this.mixer = null;
            this.animations = {};
            this.currentAnimation = null;
            this.selectedIdleAnim = null; // Store the selected idle animation
            this.loaded = false;
            debugLog(`Creating BattlerModel3D: ${filename}, scale: ${scale}, offset: ${offsetY}`);
        }

        async load() {
            return new Promise((resolve, reject) => {
                const loader = new THREE.GLTFLoader();
                const path = `img/3d/${this.filename}`;
                
                debugLog(`Loading model from: ${path}`);
                
                loader.load(
                    path,
                    (gltf) => {
                        debugLog(`Model loaded successfully: ${this.filename}`);
                        this.model = gltf.scene;
                        this.model.scale.set(this.scale, this.scale, this.scale);
                        
                        // Setup animations
                        if (gltf.animations && gltf.animations.length > 0) {
                            this.mixer = new THREE.AnimationMixer(this.model);
                            
                            debugLog(`Found ${gltf.animations.length} animations:`, gltf.animations.map(a => a.name));
                            
                            gltf.animations.forEach(clip => {
                                this.animations[clip.name.toLowerCase()] = clip;
                            });
                        } else {
                            debugLog(`No animations found in model: ${this.filename}`);
                        }
                        
                        this.loaded = true;
                        resolve(this);
                    },
                    (progress) => {
                        debugLog(`Loading progress: ${(progress.loaded / progress.total * 100).toFixed(2)}%`);
                    },
                    (error) => {
                        console.error(`Failed to load 3D model: ${path}`, error);
                        reject(error);
                    }
                );
            });
        }

        playAnimation(animName, loop = true, onComplete = null) {
            if (!this.mixer) {
                debugLog(`No mixer available for animation: ${animName}`);
                return false;
            }

            // Check for variations (attack, attack2, attack3, etc.)
            const availableVariations = this.getAnimationVariations(animName);
            
            if (availableVariations.length === 0) {
                debugLog(`Animation not found: ${animName}. Available:`, Object.keys(this.animations));
                return false;
            }

            // Pick a random variation
            const selectedAnim = availableVariations[Math.floor(Math.random() * availableVariations.length)];
            debugLog(`Selected animation variation: ${selectedAnim} from ${availableVariations.length} options`);

            if (this.currentAnimation) {
                this.currentAnimation.fadeOut(0.2);
            }

            const clip = this.animations[selectedAnim];
            const action = this.mixer.clipAction(clip);
            
            action.reset();
            action.fadeIn(0.2);
            action.setLoop(loop ? THREE.LoopRepeat : THREE.LoopOnce);
            
            if (!loop) {
                action.clampWhenFinished = true;
            }

            if (onComplete) {
                const listener = (e) => {
                    if (e.action === action) {
                        this.mixer.removeEventListener('finished', listener);
                        onComplete();
                    }
                };
                this.mixer.addEventListener('finished', listener);
            }

            action.play();
            this.currentAnimation = action;
            debugLog(`Playing animation: ${selectedAnim}`);
            return true;
        }

        getAnimationVariations(baseName) {
            const variations = [];
            const lowerBaseName = baseName.toLowerCase();
            
            // Check for base animation (e.g., "attack")
            if (this.animations[lowerBaseName]) {
                variations.push(lowerBaseName);
            }
            
            // Check for numbered variations (e.g., "attack2", "attack3", etc.)
            for (let i = 2; i <= 20; i++) {
                const varName = lowerBaseName + i;
                if (this.animations[varName]) {
                    variations.push(varName);
                }
            }
            
            return variations;
        }

        selectIdleAnimation() {
            // Select idle animation once and store it
            if (!this.selectedIdleAnim) {
                const idleVariations = this.getAnimationVariations('idle');
                if (idleVariations.length > 0) {
                    this.selectedIdleAnim = idleVariations[Math.floor(Math.random() * idleVariations.length)];
                    debugLog(`Selected idle animation: ${this.selectedIdleAnim} from ${idleVariations.length} options`);
                } else {
                    this.selectedIdleAnim = null;
                }
            }
            return this.selectedIdleAnim;
        }

        playIdleAnimation() {
            const idleAnim = this.selectIdleAnimation();
            if (idleAnim && this.animations[idleAnim]) {
                if (this.currentAnimation) {
                    this.currentAnimation.fadeOut(0.2);
                }

                const clip = this.animations[idleAnim];
                const action = this.mixer.clipAction(clip);
                
                action.reset();
                action.fadeIn(0.2);
                action.setLoop(THREE.LoopRepeat);
                action.play();
                this.currentAnimation = action;
                debugLog(`Playing idle animation: ${idleAnim}`);
                return true;
            }
            return false;
        }

        update(deltaTime) {
            if (this.mixer) {
                this.mixer.update(deltaTime);
            }
        }

        hasAnimation(animName) {
            return this.getAnimationVariations(animName).length > 0;
        }
    }

    //=============================================================================
    // Battle3DScene - Manages the 3D rendering scene
    //=============================================================================
    
    class Battle3DScene {
        constructor() {
            this.scene = null;
            this.camera = null;
            this.renderer = null;
            this.models = new Map();
            this.clock = new THREE.Clock();
            debugLog('Battle3DScene created');
        }

        initialize(width, height) {
            debugLog(`Initializing 3D scene: ${width}x${height}`);
            
            // Scene
            this.scene = new THREE.Scene();

            // Camera
            this.camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
            this.camera.position.set(0, config.cameraHeight, config.cameraDistance);
            this.camera.lookAt(0, 1, 0);

            // Renderer
            this.renderer = new THREE.WebGLRenderer({ 
                alpha: true, 
                antialias: true 
            });
            this.renderer.setSize(width, height);
            this.renderer.setClearColor(0x000000, 0);

            // Lighting
            const ambientLight = new THREE.AmbientLight(
                config.ambientLightColor, 
                config.ambientLightIntensity
            );
            this.scene.add(ambientLight);

            const directionalLight = new THREE.DirectionalLight(
                config.directionalLightColor, 
                config.directionalLightIntensity
            );
            directionalLight.position.set(5, 10, 5);
            this.scene.add(directionalLight);
            
            debugLog('3D scene initialized successfully');
        }

        async addModel(key, battlerModel, x, y, z) {
            debugLog(`Adding model: ${key} at position (${x}, ${y}, ${z})`);
            
            try {
                if (!battlerModel.loaded) {
                    await battlerModel.load();
                }

                const actualY = y + battlerModel.offsetY / 100;
                battlerModel.model.position.set(x, actualY, z);
                this.scene.add(battlerModel.model);
                this.models.set(key, battlerModel);
                
                debugLog(`Model added successfully: ${key}`);

                // Play spawn or idle animation
                if (battlerModel.hasAnimation('spawn')) {
                    battlerModel.playAnimation('spawn', false, () => {
                        battlerModel.playIdleAnimation();
                    });
                } else {
                    battlerModel.playIdleAnimation();
                }
            } catch (error) {
                console.error(`Failed to add model ${key}:`, error);
            }
        }

        removeModel(key) {
            const model = this.models.get(key);
            if (model && model.model) {
                this.scene.remove(model.model);
                this.models.delete(key);
                debugLog(`Model removed: ${key}`);
            }
        }

        getModel(key) {
            return this.models.get(key);
        }

        update() {
            const delta = this.clock.getDelta();
            this.models.forEach(model => {
                model.update(delta);
            });
        }

        render() {
            this.update();
            this.renderer.render(this.scene, this.camera);
        }

        dispose() {
            if (this.renderer) {
                this.renderer.dispose();
            }
            this.models.clear();
            debugLog('3D scene disposed');
        }
    }

    //=============================================================================
    // Spriteset_Battle Integration
    //=============================================================================
    
    const _Spriteset_Battle_initialize = Spriteset_Battle.prototype.initialize;
    Spriteset_Battle.prototype.initialize = function() {
        this._battle3DScene = null;
        this._battle3DCanvas = null;
        this._battle3DSprite = null;
        debugLog('Spriteset_Battle initialize');
        _Spriteset_Battle_initialize.call(this);
    };

    const _Spriteset_Battle_createLowerLayer = Spriteset_Battle.prototype.createLowerLayer;
    Spriteset_Battle.prototype.createLowerLayer = function() {
        _Spriteset_Battle_createLowerLayer.call(this);
        this.create3DScene();
        this.create3DSprite();
    };

    Spriteset_Battle.prototype.create3DScene = function() {
        debugLog('Creating 3D scene');
        this._battle3DScene = new Battle3DScene();
        this._battle3DScene.initialize(Graphics.width, Graphics.height);
        debugLog('3D scene created');
    };
    
    Spriteset_Battle.prototype.create3DSprite = function() {
        if (!this._battle3DScene) return;
        
        debugLog('Creating 3D sprite container');
        
        // Create a PIXI sprite from the Three.js canvas
        const canvas = this._battle3DScene.renderer.domElement;
        const texture = PIXI.Texture.from(canvas);
        this._battle3DSprite = new PIXI.Sprite(texture);
        
        // Add to the battleback layer so it renders in the correct order
        this._battleField.addChild(this._battle3DSprite);
        
        debugLog('3D sprite added to battle field');
    };

    const _Spriteset_Battle_createEnemies = Spriteset_Battle.prototype.createEnemies;
    Spriteset_Battle.prototype.createEnemies = function() {
        _Spriteset_Battle_createEnemies.call(this);
        // Delay 3D creation to ensure sprites are ready
        setTimeout(() => this.create3DEnemies(), 100);
    };

    Spriteset_Battle.prototype.create3DEnemies = function() {
        debugLog('Creating 3D enemies');
        
        // Check if user wants 3D enemies
        if (ConfigManager.enemyBattlerMode !== '3d') {
            debugLog('Enemy battler mode is set to 2D, skipping 3D enemy creation');
            return;
        }
        
        const enemies = $gameTroop.members();
        
        for (let i = 0; i < enemies.length; i++) {
            const enemy = enemies[i];
            const data = enemy.enemy().meta;
            
            debugLog(`Enemy ${i}:`, enemy.enemy().name, 'Meta:', data);
            
            if (data['3d_model']) {
                const filename = data['3d_model'];
                const scale = Number(data['3d_scale'] || 1.0);
                const offsetY = Number(data['3d_offset_y'] || 0);
                
                debugLog(`Configuring 3D enemy: ${filename}`);
                
                const battlerModel = new BattlerModel3D(filename, scale, offsetY);
                const sprite = this._enemySprites[i];
                
                if (!sprite) {
                    console.error(`Enemy sprite ${i} not found!`);
                    continue;
                }
                
                // Calculate 3D position from 2D sprite position
                const screenX = (sprite.x / Graphics.width) * 4 - 2;
                const screenY = -((sprite.y / Graphics.height) * 4 - 2);
                
                debugLog(`Enemy ${i} 2D pos: (${sprite.x}, ${sprite.y}) -> 3D pos: (${screenX}, ${screenY}, 0)`);
                
                this._battle3DScene.addModel(`enemy_${i}`, battlerModel, screenX, screenY, 0);
                
                // Hide 2D sprite
                sprite.hide();
                debugLog(`Enemy sprite ${i} hidden`);
            }
        }
    };

    const _Spriteset_Battle_createActors = Spriteset_Battle.prototype.createActors;
    Spriteset_Battle.prototype.createActors = function() {
        _Spriteset_Battle_createActors.call(this);
        // Delay 3D creation to ensure sprites are ready
        setTimeout(() => this.create3DActors(), 100);
    };

    Spriteset_Battle.prototype.create3DActors = function() {
        debugLog('Creating 3D actors');
        const actors = $gameParty.battleMembers();
        
        for (let i = 0; i < actors.length; i++) {
            const actor = actors[i];
            const actorConfig = config.actorModels.find(m => Number(m.actorId) === actor.actorId());
            
            debugLog(`Actor ${i}:`, actor.name(), 'ID:', actor.actorId(), 'Config:', actorConfig);
            
            if (actorConfig) {
                const filename = actorConfig.modelFile;
                const scale = Number(actorConfig.scale || 1.0);
                const offsetY = Number(actorConfig.offsetY || 0);
                
                debugLog(`Configuring 3D actor: ${filename}`);
                
                const battlerModel = new BattlerModel3D(filename, scale, offsetY);
                const sprite = this._actorSprites[i];
                
                if (!sprite) {
                    console.error(`Actor sprite ${i} not found!`);
                    continue;
                }
                
                // Calculate 3D position from 2D sprite position
                const screenX = (sprite.x / Graphics.width) * 4 - 2;
                const screenY = -((sprite.y / Graphics.height) * 4 - 2);
                
                debugLog(`Actor ${i} 2D pos: (${sprite.x}, ${sprite.y}) -> 3D pos: (${screenX}, ${screenY}, 0)`);
                
                this._battle3DScene.addModel(`actor_${i}`, battlerModel, screenX, screenY, 0);
                
                // Hide 2D sprite
                sprite.hide();
                debugLog(`Actor sprite ${i} hidden`);
            }
        }
    };

    const _Spriteset_Battle_update = Spriteset_Battle.prototype.update;
    Spriteset_Battle.prototype.update = function() {
        _Spriteset_Battle_update.call(this);
        if (this._battle3DScene) {
            this._battle3DScene.render();
            // Update the PIXI texture with the new Three.js render
            if (this._battle3DSprite && this._battle3DSprite.texture) {
                this._battle3DSprite.texture.update();
            }
        }
    };

    const _Spriteset_Battle_destroy = Spriteset_Battle.prototype.destroy;
    Spriteset_Battle.prototype.destroy = function(options) {
        if (this._battle3DSprite) {
            if (this._battle3DSprite.parent) {
                this._battle3DSprite.parent.removeChild(this._battle3DSprite);
            }
            this._battle3DSprite.destroy();
            this._battle3DSprite = null;
            debugLog('3D sprite destroyed');
        }
        if (this._battle3DScene) {
            this._battle3DScene.dispose();
        }
        _Spriteset_Battle_destroy.call(this, options);
    };

    //=============================================================================
    // Animation Triggers
    //=============================================================================
    
    Spriteset_Battle.prototype.get3DModel = function(battler) {
        if (!battler) return null;
        
        if (battler.isActor()) {
            const index = $gameParty.battleMembers().indexOf(battler);
            return this._battle3DScene ? this._battle3DScene.getModel(`actor_${index}`) : null;
        } else {
            // Only return 3D model if in 3D mode
            if (ConfigManager.enemyBattlerMode !== '3d') {
                return null;
            }
            const index = $gameTroop.members().indexOf(battler);
            return this._battle3DScene ? this._battle3DScene.getModel(`enemy_${index}`) : null;
        }
    };

    const _Sprite_Battler_updateDamagePopup = Sprite_Battler.prototype.updateDamagePopup;
    Sprite_Battler.prototype.updateDamagePopup = function() {
        _Sprite_Battler_updateDamagePopup.call(this);
        
        if (this._damages.length > 0 && SceneManager._scene._spriteset) {
            const model = SceneManager._scene._spriteset.get3DModel(this._battler);
            if (model) {
                model.playAnimation('hit', false, () => {
                    model.playIdleAnimation();
                });
            }
        }
    };

    const _Sprite_Actor_startMotion = Sprite_Actor.prototype.startMotion;
    Sprite_Actor.prototype.startMotion = function(motionType) {
        _Sprite_Actor_startMotion.call(this, motionType);
        
        if (SceneManager._scene._spriteset) {
            const model = SceneManager._scene._spriteset.get3DModel(this._battler);
            if (model) {
                switch (motionType) {
                    case 'attack':
                    case 'thrust':
                    case 'swing':
                    case 'missile':
                        model.playAnimation('attack', false, () => {
                            model.playIdleAnimation();
                        });
                        break;
                    case 'skill':
                        if (model.hasAnimation('specialattack')) {
                            model.playAnimation('specialattack', false, () => {
                                model.playIdleAnimation();
                            });
                        } else {
                            model.playAnimation('attack', false, () => {
                                model.playIdleAnimation();
                            });
                        }
                        break;
                    case 'damage':
                        model.playAnimation('hit', false, () => {
                            model.playIdleAnimation();
                        });
                        break;
                    case 'dead':
                        model.playAnimation('death', false);
                        break;
                }
            }
        }
    };

    const _Sprite_Enemy_initMembers = Sprite_Enemy.prototype.initMembers;
    Sprite_Enemy.prototype.initMembers = function() {
        _Sprite_Enemy_initMembers.call(this);
        this._3dAttackStarted = false;
    };

    const _Sprite_Enemy_updateBitmap = Sprite_Enemy.prototype.updateBitmap;
    Sprite_Enemy.prototype.updateBitmap = function() {
        _Sprite_Enemy_updateBitmap.call(this);
        
        if (this._battler && SceneManager._scene._spriteset) {
            const model = SceneManager._scene._spriteset.get3DModel(this._battler);
            
            if (model) {
                if (this._battler.isActing() && !this._3dAttackStarted) {
                    this._3dAttackStarted = true;
                    const action = this._battler.currentAction();
                    
                    if (action && action.isSkill() && action.item().id !== 1) {
                        if (model.hasAnimation('specialattack')) {
                            model.playAnimation('specialattack', false, () => {
                                model.playIdleAnimation();
                                this._3dAttackStarted = false;
                            });
                        } else {
                            model.playAnimation('attack', false, () => {
                                model.playIdleAnimation();
                                this._3dAttackStarted = false;
                            });
                        }
                    } else {
                        model.playAnimation('attack', false, () => {
                            model.playIdleAnimation();
                            this._3dAttackStarted = false;
                        });
                    }
                } else if (!this._battler.isActing()) {
                    this._3dAttackStarted = false;
                }
                
                if (this._battler.isDead()) {
                    model.playAnimation('death', false);
                }
            }
        }
    };

})();
/*:
 * @target MZ
 * @plugindesc Blood Splatter FX v1.1.0
 * @author Omni-Lex
 * @url https://nocoldiz.itch.io/hypernet-explorer
 * @help
 * ============================================================================
 * Blood Splatter FX Plugin for RPG Maker MZ
 * ============================================================================
 * * This plugin creates blood splatter effects when enemies take damage from
 * physical attacks or skills during battle. It automatically prevents blood
 * effects from skills designated as magical.
 *
 * ============================================================================
 * SETUP:
 * ============================================================================
 *
 * 1.  Define Magic Skill Types:
 * Go to the Plugin Manager, select this plugin, and find the parameter
 * "Magic Skill Type IDs". Enter the ID numbers of the Skill Types you
 * want to be considered magical (e.g., "Magic", "Holy", "Dark").
 * You can find these IDs in your project's Database > Types tab.
 * By default, this is set to [2], which is the standard ID for "Magic".
 *
 * 2.  Set Enemy Archetypes (Optional):
 * To give different enemies different colored blood, add a notetag to the
 * enemy's note box in the Database > Enemies tab.
 *
 * <Archetype: TypeName>
 *
 * Examples:
 * <Archetype: Goblin>       (You can set a green color in the params)
 * <Archetype: Insectoid>    (You can set a blue color in the params)
 * <Archetype: Undead>       (You can set a purple color in the params)
 *
 * If an enemy has no archetype, it will use the default blood color.
 *
 * ============================================================================
 * * @param archetypeColors
 * @text Archetype Blood Colors
 * @type struct<ArchetypeColor>[]
 * @desc Configure blood colors for different enemy archetypes.
 * @default ["{\"archetype\":\"Goblin\",\"color\":\"#00ff00\"}","{\"archetype\":\"Insectoid\",\"color\":\"#0080ff\"}","{\"archetype\":\"Undead\",\"color\":\"#800080\"}","{\"archetype\":\"Machine\",\"color\":\"#404040\"}"]
 * * @param magicSkillTypeIds
 * @text Magic Skill Type IDs
 * @type number[]
 * @desc List of Skill Type IDs that are considered magic and won't cause blood. Find IDs in Database > Types.
 * @default ["2"]
 *
 * @param defaultBloodColor
 * @text Default Blood Color
 * @type string
 * @desc Default blood color for enemies without a defined archetype.
 * @default #ff0000
 * * @param particleCount
 * @text Particle Count
 * @type number
 * @min 5
 * @max 50
 * @desc Number of blood particles per splatter.
 * @default 15
 * * @param particleSize
 * @text Particle Size Range
 * @type string
 * @desc Min and max particle size (format: min,max).
 * @default 2,8
 * * @param splatterDuration
 * @text Splatter Duration
 * @type number
 * @min 10
 * @max 120
 * @desc Duration of the splatter animation in frames.
 * @default 60
 * * @param gravityStrength
 * @text Gravity Strength
 * @type number
 * @decimals 2
 * @min 0
 * @max 2
 * @desc Gravity effect on blood particles.
 * @default 0.5
 * * @param spreadAngle
 * @text Spread Angle
 * @type number
 * @min 30
 * @max 180
 * @desc Angle of the blood splatter spread in degrees.
 * @default 90
 * * @param initialSpeed
 * @text Initial Speed Range
 * @type string
 * @desc Min and max initial speed (format: min,max).
 * @default 5,15
 * * @param enableBloodStains
 * @text Enable Blood Stains
 * @type boolean
 * @desc If true, leaves blood stains on the battlefield after the effect.
 * @default true
 * * @param stainOpacity
 * @text Stain Opacity
 * @type number
 * @min 10
 * @max 100
 * @desc Final opacity percentage of the blood stains.
 * @default 30
 */

/*~struct~ArchetypeColor:
 * @param archetype
 * @text Archetype Name
 * @type string
 * @desc Name of the enemy archetype (must match the notetag).
 * * @param color
 * @text Blood Color
 * @type string
 * @desc Hex color code for this archetype's blood.
 * @default #ff0000
 */

(() => {
    'use strict';
    
    const pluginName = 'BloodSplatterFX';
    const parameters = PluginManager.parameters(pluginName);
    
    // Parse parameters
    const archetypeColors = JSON.parse(parameters.archetypeColors || '[]').map(str => JSON.parse(str));
    const magicSkillTypeIds = JSON.parse(parameters.magicSkillTypeIds || '[]').map(Number);
    const defaultBloodColor = parameters.defaultBloodColor || '#ff0000';
    const particleCount = Number(parameters.particleCount) || 15;
    const particleSize = (parameters.particleSize || '2,8').split(',').map(n => Number(n));
    const splatterDuration = Number(parameters.splatterDuration) || 60;
    const gravityStrength = Number(parameters.gravityStrength) || 0.5;
    const spreadAngle = Number(parameters.spreadAngle) || 90;
    const initialSpeed = (parameters.initialSpeed || '5,15').split(',').map(n => Number(n));
    const enableBloodStains = parameters.enableBloodStains === 'true';
    const stainOpacity = Number(parameters.stainOpacity) || 30;
    
    // Create archetype color map for quick lookup
    const colorMap = {};
    archetypeColors.forEach(ac => {
        colorMap[ac.archetype.toLowerCase()] = ac.color;
    });
    
    //=============================================================================
    // BloodParticle
    // Class for an individual blood particle.
    //=============================================================================
    class BloodParticle extends PIXI.Graphics {
        constructor(color, x, y) {
            super();
            this.bloodColor = parseInt(color.replace('#', '0x'));
            this.x = x;
            this.y = y;
            
            // Randomize particle properties for a natural look
            const size = particleSize[0] + Math.random() * (particleSize[1] - particleSize[0]);
            const speed = initialSpeed[0] + Math.random() * (initialSpeed[1] - initialSpeed[0]);
            const angleRad = (Math.random() * spreadAngle - spreadAngle / 2 - 90) * Math.PI / 180;
            
            this.velocityX = Math.cos(angleRad) * speed;
            this.velocityY = Math.sin(angleRad) * speed;
            this.size = size;
            this.life = splatterDuration;
            this.maxLife = splatterDuration;
            this.gravity = gravityStrength;
            
            this.draw();
        }
        
        draw() {
            this.clear();
            this.beginFill(this.bloodColor, this.alpha);
            // Draw a varied shape for the droplet
            if (Math.random() > 0.5) {
                this.drawCircle(0, 0, this.size);
            } else {
                this.drawEllipse(0, 0, this.size * 1.2, this.size * 0.8);
            }
            this.endFill();
        }
        
        update() {
            this.life--;
            if (this.life <= 0) {
                return false; // Signal that the particle has expired
            }
            
            // Apply physics
            this.velocityY += this.gravity;
            this.x += this.velocityX;
            this.y += this.velocityY;
            
            // Fade out over time
            this.alpha = this.life / this.maxLife;
            
            // Simple air resistance
            this.velocityX *= 0.98;
            this.velocityY *= 0.98;
            
            return true; // Signal that the particle is still active
        }
    }
    
    //=============================================================================
    // BloodStain
    // Class for a persistent blood stain on the battlefield.
    //=============================================================================
    class BloodStain extends PIXI.Graphics {
        constructor(color, x, y) {
            super();
            this.bloodColor = parseInt(color.replace('#', '0x'));
            this.x = x + (Math.random() - 0.5) * 20;
            this.y = y + (Math.random() - 0.5) * 20;
            this.alpha = stainOpacity / 100;
            
            this.draw();
        }
        
        draw() {
            this.clear();
            this.beginFill(this.bloodColor, 1);
            
            // Draw a random stain shape
            const stainType = Math.floor(Math.random() * 3);
            const size = 10 + Math.random() * 20;
            
            switch (stainType) {
                case 0: // Circle
                    this.drawCircle(0, 0, size);
                    break;
                case 1: // Ellipse
                    this.drawEllipse(0, 0, size * 1.5, size);
                    break;
                case 2: // Irregular polygon
                    this.drawPolygon([
                        -size, 0, -size / 2, -size, size / 2, -size / 2,
                        size, 0, size / 2, size, -size / 2, size / 2
                    ]);
                    break;
            }
            this.endFill();
        }
    }
    
    //=============================================================================
    // BloodEffectManager
    // Manages all blood particles and stains during battle.
    //=============================================================================
    class BloodEffectManager {
        constructor() {
            this.container = new PIXI.Container();
            this.stainContainer = new PIXI.Container();
            this.particles = [];
            this.stains = [];
        }
        
        setup(parent) {
            if (parent) {
                parent.addChild(this.stainContainer);
                parent.addChild(this.container);
            }
        }
        
        createSplatter(x, y, color, damageRatio = 1) {
            const count = Math.floor(particleCount * Math.min(damageRatio, 1.5));
            
            for (let i = 0; i < count; i++) {
                const particle = new BloodParticle(color, x, y);
                this.container.addChild(particle);
                this.particles.push(particle);
            }
            
            // Create blood stains if enabled
            if (enableBloodStains && Math.random() > 0.3) {
                const stainCount = 1 + Math.floor(Math.random() * 3);
                for (let i = 0; i < stainCount; i++) {
                    const stain = new BloodStain(color, x, y);
                    this.stainContainer.addChild(stain);
                    this.stains.push(stain);
                }
            }
        }
        
        update() {
            for (let i = this.particles.length - 1; i >= 0; i--) {
                if (!this.particles[i].update()) {
                    this.container.removeChild(this.particles[i]);
                    this.particles.splice(i, 1);
                }
            }
        }
        
        clear() {
            this.particles.forEach(p => this.container.removeChild(p));
            this.stains.forEach(s => this.stainContainer.removeChild(s));
            this.particles = [];
            this.stains = [];
        }
    }
    
    //=============================================================================
    // Plugin Integration with RPG Maker MZ Core Scripts
    //=============================================================================

    const _Spriteset_Battle_createBattleback = Spriteset_Battle.prototype.createBattleback;
    Spriteset_Battle.prototype.createBattleback = function() {
        _Spriteset_Battle_createBattleback.call(this);
        this._bloodEffectManager = new BloodEffectManager();
        this._bloodEffectManager.setup(this._battleField);
    };
    
    const _Spriteset_Battle_update = Spriteset_Battle.prototype.update;
    Spriteset_Battle.prototype.update = function() {
        _Spriteset_Battle_update.call(this);
        if (this._bloodEffectManager) {
            this._bloodEffectManager.update();
        }
    };
    
    // NEW: Automatically determine if an action is magical
    Game_Action.prototype.isConsideredMagicForBloodEffect = function() {
        if (!this.item()) {
            return false;
        }
        // Check if the Hit Type is Magical Attack
        if (this.isMagical()) {
            return true;
        }
        // Check if the Skill Type is in the magic list from plugin parameters
        if (this.isSkill()) {
            const skillTypeId = this.item().stypeId;
            if (magicSkillTypeIds.includes(skillTypeId)) {
                return true;
            }
        }
        return false;
    };

    const _Game_Enemy_performDamage = Game_Enemy.prototype.performDamage;
    Game_Enemy.prototype.performDamage = function() {
        _Game_Enemy_performDamage.call(this);
        const action = BattleManager._action;
        // Trigger blood splatter if the action is not magical and the enemy is still alive
        if (action && !action.isConsideredMagicForBloodEffect() && this.isAlive()) {
            this.createBloodSplatter();
        }
    };
    
    Game_Enemy.prototype.getArchetype = function() {
        const note = this.enemy().note;
        const match = note.match(/<Archetype:\s*(.+?)>/i);
        return match ? match[1].trim().toLowerCase() : null;
    };
    
    Game_Enemy.prototype.getBloodColor = function() {
        const archetype = this.getArchetype();
        return archetype && colorMap[archetype] ? colorMap[archetype] : defaultBloodColor;
    };
    
    Game_Enemy.prototype.createBloodSplatter = function() {
        const spriteset = SceneManager._scene._spriteset;
        if (!spriteset || !spriteset._bloodEffectManager) {
            return;
        }
        
        const sprite = spriteset.findTargetSprite(this);
        if (sprite) {
            const bloodManager = spriteset._bloodEffectManager;
            const color = this.getBloodColor();
            const damageRatio = this.result().hpDamage / this.mhp;
            
            // Position at enemy sprite center with some randomness
            const x = sprite.x;
            const y = sprite.y - sprite.height / 2;
            
            bloodManager.createSplatter(x, y, color, damageRatio);
        }
    };
    
    const _BattleManager_endBattle = BattleManager.endBattle;
    BattleManager.endBattle = function(result) {
        if (SceneManager._scene._spriteset && SceneManager._scene._spriteset._bloodEffectManager) {
            SceneManager._scene._spriteset._bloodEffectManager.clear();
        }
        _BattleManager_endBattle.call(this, result);
    };
    
})();

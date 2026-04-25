//=============================================================================
// Reactive Enemy Battler System (HP-Scaled Blood Effects)
// Version: 2.7.0
//=============================================================================

/*:
 * @target MZ
 * @plugindesc Shows enemy attack sprite when performing attacks with HP-scaled blood particle system
 * @author Omni-Lex
 * @url https://your-website.com
 *
 * @help
 * ============================================================================
 * Reactive Enemy Battler System (HP-Scaled Blood Effects)
 * ============================================================================
 * 
 * This plugin automatically shows sprites when enemies attack, dodge, or counter.
 * Blood particle effects now scale based on damage percentage of enemy's total HP.
 * 
 * Damage Scaling:
 * - 0-5% HP: Minimal particles (5-10 particles)
 * - 5-10% HP: Light spray (10-20 particles)
 * - 10-20% HP: Medium spray (20-35 particles)
 * - 20-35% HP: Heavy spray (35-55 particles)
 * - 35-50% HP: Brutal spray (55-75 particles)
 * - 50%+ HP: Devastating spray (75-100 particles)
 * 
 * Naming Convention:
 * - Default (Idle): enemies/EnemyName.png
 * - Attack: enemies/hit/EnemyName_hit.png
 * - Dodge: enemies/dodge/EnemyName_dodge.png
 * - Counter: enemies/counter/EnemyName_counter.png
 * 
 * Enemy Note Tags:
 * - <NoBlood> - No damage particles
 * - <Bark> - Wood chips flying (no ground stains)
 * - <Spark> - Electric sparks (no ground stains)
 * - <Rock> - Rock debris flying (no ground stains)
 * - <GreenBlood> - Green blood with ground stains
 * - <AzureBlood> - Azure/cyan blood with ground stains
 * - <BlackBlood> - Black blood with ground stains
 * 
 * Default: Red blood with ground stains
 * 
 * Features:
 * - HP-scaled particle effects for realistic damage representation
 * - Enhanced blood spray with multiple particle types
 * - Dynamic spray patterns based on damage severity
 * - Secondary particle effects for heavy hits
 * - Blood stains accumulate on the ground permanently
 * - All enemies positioned 120px lower on screen
 * 
 * ============================================================================
 */

(() => {
    'use strict';

    // Hardcoded parameters
    const attackDuration = 40;
    const lungeScale = 1.15;
    const lungeDuration = 20;
    const dodgeDuration = 40;
    const dodgeDistance = 80;
    const counterDuration = 50;
    const jumpHeight = 15;
    const jumpDuration = 25;
    const defaultScale = 0.5;
    const yOffset = 206;
    const xOffset = 106;

    const groundLevel = 560;

    // HP-based particle configurations
    const hpScaledSprayConfig = {
        minimal: {     // 0-5% HP
            count: [5, 10],
            speed: [3, 6],
            spread: 120,
            secondaryChance: 0.1,
            stainChance: 0.3,
            mistCount: 0
        },
        light: {       // 5-10% HP
            count: [10, 20],
            speed: [4, 8],
            spread: 130,
            secondaryChance: 0.2,
            stainChance: 0.5,
            mistCount: 2
        },
        medium: {      // 10-20% HP
            count: [20, 35],
            speed: [5, 10],
            spread: 140,
            secondaryChance: 0.3,
            stainChance: 0.7,
            mistCount: 4
        },
        heavy: {       // 20-35% HP
            count: [35, 55],
            speed: [7, 12],
            spread: 150,
            secondaryChance: 0.4,
            stainChance: 0.85,
            mistCount: 6
        },
        brutal: {      // 35-50% HP
            count: [55, 75],
            speed: [8, 14],
            spread: 160,
            secondaryChance: 0.5,
            stainChance: 0.95,
            mistCount: 8
        },
        devastating: { // 50%+ HP
            count: [75, 100],
            speed: [9, 16],
            spread: 170,
            secondaryChance: 0.6,
            stainChance: 1.0,
            mistCount: 12
        }
    };

    // Particle type configurations
    const particleTypes = {
        blood: {
            colors: ['#8B0000', '#A00000', '#700000', '#900000', '#6B0000', '#B00000', '#5A0000'],
            stainColors: ['#8B0000', '#700000', '#600000', '#500000'],
            accumulates: true,
            gravity: 0.3,
            airResistance: 0.98,
            size: [3, 10],
            types: ['drop', 'streak', 'mist'],
            secondaryChance: 0.3
        },
        greenBlood: {
            colors: ['#00AA00', '#00CC00', '#009900', '#00BB00', '#008800', '#00DD00', '#007700'],
            stainColors: ['#00AA00', '#009900', '#007700', '#006600'],
            accumulates: true,
            gravity: 0.3,
            airResistance: 0.98,
            size: [3, 10],
            types: ['drop', 'streak', 'mist'],
            secondaryChance: 0.3
        },
        azureBlood: {
            colors: ['#0099CC', '#00AADD', '#0088BB', '#00BBEE', '#0077AA', '#00CCFF', '#0066AA'],
            stainColors: ['#0099CC', '#0088BB', '#0077AA', '#006699'],
            accumulates: true,
            gravity: 0.3,
            airResistance: 0.98,
            size: [3, 10],
            types: ['drop', 'streak', 'mist'],
            secondaryChance: 0.3
        },
        blackBlood: {
            colors: ['#1A1A1A', '#000000', '#0D0D0D', '#262626', '#333333', '#0A0A0A', '#404040'],
            stainColors: ['#1A1A1A', '#0D0D0D', '#000000', '#0A0A0A'],
            accumulates: true,
            gravity: 0.3,
            airResistance: 0.98,
            size: [3, 10],
            types: ['drop', 'streak', 'mist'],
            secondaryChance: 0.3
        },
        bark: {
            colors: ['#8B4513', '#A0522D', '#654321', '#704214', '#5C3317', '#9B6028'],
            stainColors: null,
            accumulates: false,
            gravity: 0.35,
            airResistance: 0.96,
            size: [3, 8],
            types: ['chunk'],
            secondaryChance: 0.2
        },
        spark: {
            colors: ['#FFFF00', '#FFDD00', '#FFAA00', '#FFCC00', '#FFF700', '#FFEE00'],
            stainColors: null,
            accumulates: false,
            gravity: -0.15,
            airResistance: 0.95,
            size: [2, 6],
            types: ['spark'],
            secondaryChance: 0.4
        },
        rock: {
            colors: ['#808080', '#696969', '#A9A9A9', '#778899', '#708090', '#909090'],
            stainColors: null,
            accumulates: false,
            gravity: 0.4,
            airResistance: 0.97,
            size: [4, 11],
            types: ['chunk'],
            secondaryChance: 0.15
        }
    };

    //-----------------------------------------------------------------------------
    // Scene_Battle - Initialize blood stain container
    //-----------------------------------------------------------------------------

    const _Scene_Battle_createSpriteset = Scene_Battle.prototype.createSpriteset;
    Scene_Battle.prototype.createSpriteset = function() {
        _Scene_Battle_createSpriteset.call(this);
        this._bloodStains = [];
    };

    //-----------------------------------------------------------------------------
    // Game_Enemy - Parse note tags
    //-----------------------------------------------------------------------------

    const _Game_Enemy_setup = Game_Enemy.prototype.setup;
    Game_Enemy.prototype.setup = function(enemyId, x, y) {
        _Game_Enemy_setup.call(this, enemyId, x, y);
        this.parseParticleType();
    };

    Game_Enemy.prototype.parseParticleType = function() {
        const note = this.enemy().note;
        
        if (note.match(/<NoBlood>/i)) {
            this._particleType = 'none';
        } else if (note.match(/<Bark>/i)) {
            this._particleType = 'bark';
        } else if (note.match(/<Spark>/i)) {
            this._particleType = 'spark';
        } else if (note.match(/<Rock>/i)) {
            this._particleType = 'rock';
        } else if (note.match(/<GreenBlood>/i)) {
            this._particleType = 'greenBlood';
        } else if (note.match(/<AzureBlood>/i)) {
            this._particleType = 'azureBlood';
        } else if (note.match(/<BlackBlood>/i)) {
            this._particleType = 'blackBlood';
        } else {
            this._particleType = 'blood';
        }
    };

    Game_Enemy.prototype.getParticleType = function() {
        return this._particleType || 'blood';
    };

    //-----------------------------------------------------------------------------
    // Sprite_Enemy
    //-----------------------------------------------------------------------------

    const _Sprite_Enemy_initialize = Sprite_Enemy.prototype.initialize;
    Sprite_Enemy.prototype.initialize = function(battler) {
        _Sprite_Enemy_initialize.call(this, battler);
        this._showingAttack = false;
        this._showingDodge = false;
        this._showingCounter = false;
        this._attackTimer = 0;
        this._defaultBattlerName = '';
        this._baseScale = defaultScale;
        this._baseX = 0;
        this._baseY = 0;
        this._bloodParticles = [];
        
        // Refactored lunge system
        this._lungeAnimation = {
            active: false,
            frame: 0,
            totalFrames: lungeDuration,
            targetScale: lungeScale
        };
        
        // Dodge system
        this._dodgeAnimation = {
            active: false,
            frame: 0,
            totalFrames: dodgeDuration,
            direction: 1,
            distance: dodgeDistance
        };
        
        // Jump system
        this._jumpAnimation = {
            active: false,
            frame: 0,
            totalFrames: jumpDuration,
            height: jumpHeight
        };
        
        this.scale.x = defaultScale;
        this.scale.y = defaultScale;
    };

    const _Sprite_Enemy_setBattler = Sprite_Enemy.prototype.setBattler;
    Sprite_Enemy.prototype.setBattler = function(battler) {
        _Sprite_Enemy_setBattler.call(this, battler);
        if (battler) {
            this._defaultBattlerName = battler.battlerName();
        }
    };

    const _Sprite_Enemy_updatePosition = Sprite_Enemy.prototype.updatePosition;
    Sprite_Enemy.prototype.updatePosition = function() {
        _Sprite_Enemy_updatePosition.call(this);
        this.y += yOffset;
        this.x += xOffset;

    };

    const _Sprite_Enemy_update = Sprite_Enemy.prototype.update;
    Sprite_Enemy.prototype.update = function() {
        _Sprite_Enemy_update.call(this);
        
        // Store base position when not animating
        if (!this._dodgeAnimation.active && !this._jumpAnimation.active) {
            this._baseX = this.x;
            this._baseY = this.y;
        }
        
        this.updateAttackState();
        this.updateLungeAnimation();
        this.updateDodgeAnimation();
        this.updateJumpAnimation();
        this.updateBloodParticles();
    };

    Sprite_Enemy.prototype.updateAttackState = function() {
        if (this._attackTimer > 0) {
            this._attackTimer--;
            if (this._attackTimer === 0) {
                this.returnToIdle();
            }
        }
    };

    // Refactored lunge animation
  // Refactored lunge animation
// Refactored lunge animation - centered and subtle
Sprite_Enemy.prototype.updateLungeAnimation = function() {
    const anim = this._lungeAnimation;
    if (!anim.active) return;
    
    anim.frame++;
    
    const halfFrames = anim.totalFrames / 2;
    let scale;
    
    if (anim.frame <= halfFrames) {
        // First half: scale up slightly (subtle zoom in)
        const t = anim.frame / halfFrames;
        const easedT = this.easeOutCubic(t); // Using cubic for smoother easing
        const targetScale = this._baseScale * anim.targetScale;
        scale = this._baseScale + (targetScale - this._baseScale) * easedT;
    } else {
        // Second half: scale back to normal
        const t = (anim.frame - halfFrames) / halfFrames;
        const easedT = this.easeInCubic(t); // Using cubic for smoother easing
        const targetScale = this._baseScale * anim.targetScale;
        scale = targetScale - (targetScale - this._baseScale) * easedT;
    }
    
    this.scale.x = scale;
    this.scale.y = scale;
    
    // End animation
    if (anim.frame >= anim.totalFrames) {
        anim.active = false;
        anim.frame = 0;
        this.scale.x = this._baseScale;
        this.scale.y = this._baseScale;
    }
};

    // Refactored dodge animation
    Sprite_Enemy.prototype.updateDodgeAnimation = function() {
        const anim = this._dodgeAnimation;
        if (!anim.active) return;
        
        anim.frame++;
        
        const halfFrames = anim.totalFrames / 2;
        let offsetX = 0;
        
        if (anim.frame <= halfFrames) {
            // First half: move away
            const t = anim.frame / halfFrames;
            const easedT = this.easeOutQuad(t);
            offsetX = anim.distance * easedT * anim.direction;
        } else {
            // Second half: return
            const t = (anim.frame - halfFrames) / halfFrames;
            const easedT = this.easeInQuad(t);
            offsetX = anim.distance * (1 - easedT) * anim.direction;
        }
        
        this.x = this._baseX + offsetX;
        
        // End animation
        if (anim.frame >= anim.totalFrames) {
            anim.active = false;
            anim.frame = 0;
            this.x = this._baseX;
        }
    };

    // Refactored jump animation
    Sprite_Enemy.prototype.updateJumpAnimation = function() {
        const anim = this._jumpAnimation;
        if (!anim.active) return;
        
        anim.frame++;
        
        const halfFrames = anim.totalFrames / 2;
        let offsetY = 0;
        
        if (anim.frame <= halfFrames) {
            // First half: jump up
            const t = anim.frame / halfFrames;
            const easedT = this.easeOutQuad(t);
            offsetY = -anim.height * easedT;
        } else {
            // Second half: fall down
            const t = (anim.frame - halfFrames) / halfFrames;
            const easedT = this.easeInQuad(t);
            offsetY = -anim.height * (1 - easedT);
        }
        
        this.y = this._baseY + offsetY;
        
        // End animation
        if (anim.frame >= anim.totalFrames) {
            anim.active = false;
            anim.frame = 0;
            this.y = this._baseY;
        }
    };

    Sprite_Enemy.prototype.easeOutQuad = function(t) {
        return t * (2 - t);
    };
    
    Sprite_Enemy.prototype.easeInQuad = function(t) {
        return t * t;
    };
    
    // Cubic easing for smoother lunge animation
    Sprite_Enemy.prototype.easeOutCubic = function(t) {
        return 1 - Math.pow(1 - t, 3);
    };
    
    Sprite_Enemy.prototype.easeInCubic = function(t) {
        return t * t * t;
    };

    // NEW: Calculate damage percentage and determine spray intensity
    Sprite_Enemy.prototype.determineSprayIntensityByHP = function(damage, enemy) {
        if (!damage || !enemy) return 'minimal';
        
        const maxHp = enemy.mhp;
        const damagePercent = (damage / maxHp) * 100;
        
        // Determine intensity based on damage percentage
        if (damagePercent < 5) return 'minimal';
        if (damagePercent < 10) return 'light';
        if (damagePercent < 20) return 'medium';
        if (damagePercent < 35) return 'heavy';
        if (damagePercent < 50) return 'brutal';
        return 'devastating';
    };

    // MODIFIED: Enhanced particle creation with HP-based scaling
    Sprite_Enemy.prototype.createDamageParticles = function(damage = 100) {
        if (!this._enemy) return;
        
        const particleType = this._enemy.getParticleType();
        if (particleType === 'none') return;
        
        const config = particleTypes[particleType];
        if (!config || !this.parent) return;
        
        // Use HP-based intensity calculation
        const intensity = this.determineSprayIntensityByHP(damage, this._enemy);
        const sprayData = hpScaledSprayConfig[intensity];
        
        // Calculate actual particle count (random between min and max)
        const particleCount = Math.floor(
            sprayData.count[0] + Math.random() * (sprayData.count[1] - sprayData.count[0])
        );
        
        // Fixed 100px spread from sprite center
        const maxSpread = 50;
        
        // Calculate sprite center position
        const spriteCenterX = this.x;
        const spriteCenterY = this.y - 270; // Adjusted for sprite anchor (720px * 0.75 / 2)
        
        // Create multiple spawn points for devastating hits
        const spawnPoints = [];
        if (intensity === 'devastating' || intensity === 'brutal') {
            // Multiple impact points for massive damage
            const numPoints = intensity === 'devastating' ? 3 : 2;
            for (let i = 0; i < numPoints; i++) {
                const angle = (Math.PI * 2 * i) / numPoints + Math.random() * 0.5;
                const distance = Math.random() * maxSpread * 0.7;
                spawnPoints.push({
                    x: spriteCenterX + Math.cos(angle) * distance,
                    y: spriteCenterY + Math.sin(angle) * distance
                });
            }
        } else {
            // Single spawn point for lighter damage
            const angle = Math.random() * Math.PI * 2;
            const distance = Math.random() * maxSpread;
            spawnPoints.push({
                x: spriteCenterX + Math.cos(angle) * distance,
                y: spriteCenterY + Math.sin(angle) * distance
            });
        }
        
        // Distribute particles across spawn points
        const particlesPerPoint = Math.ceil(particleCount / spawnPoints.length);
        
        for (const point of spawnPoints) {
            // Main particles
            for (let i = 0; i < particlesPerPoint; i++) {
                this.createParticle(point.x, point.y, config, sprayData, false, intensity);
            }
            
            // Secondary particles (smaller, more numerous for heavy hits)
            if (Math.random() < sprayData.secondaryChance) {
                const secondaryCount = Math.floor(particlesPerPoint * 0.4);
                for (let i = 0; i < secondaryCount; i++) {
                    this.createParticle(point.x, point.y, config, sprayData, true, intensity);
                }
            }
            
            // Mist particles for blood effects
            if (config.accumulates && sprayData.mistCount > 0) {
                for (let i = 0; i < sprayData.mistCount; i++) {
                    this.createMistParticle(point.x, point.y, config, intensity);
                }
            }
        }
    };

    // MODIFIED: Enhanced particle creation with intensity parameter
    Sprite_Enemy.prototype.createParticle = function(centerX, centerY, config, sprayData, isSecondary, intensity) {
        const particle = new Sprite();
        const particleType = this._enemy.getParticleType();
        
        // Determine particle visual type
        const visualTypes = config.types || ['drop'];
        let visualType = visualTypes[Math.floor(Math.random() * visualTypes.length)];
        
        // Bias toward streaks for heavy damage
        if ((intensity === 'brutal' || intensity === 'devastating') && Math.random() < 0.6) {
            visualType = 'streak';
        }
        
        // Size variation based on intensity
        const sizeMultiplier = isSecondary ? 0.4 : 1;
        const intensityMultiplier = intensity === 'devastating' ? 1.3 : 
                                   intensity === 'brutal' ? 1.2 : 
                                   intensity === 'heavy' ? 1.1 : 1.0;
        const size = (Math.random() * (config.size[1] - config.size[0]) + config.size[0]) * sizeMultiplier * intensityMultiplier;
        
        particle.bitmap = new Bitmap(size * 4, size * 4);
        
        // Color with variation
        const colorIndex = Math.floor(Math.random() * config.colors.length);
        const color = config.colors[colorIndex];
        const darkerColor = this.darkenColor(color, 0.7);
        
        // Draw particle based on type
        if (visualType === 'drop') {
            this.drawBloodDrop(particle.bitmap, size * 2, color, darkerColor);
        } else if (visualType === 'streak') {
            this.drawStreak(particle.bitmap, size * 2, color);
        } else if (visualType === 'mist') {
            this.drawMist(particle.bitmap, size * 2, color);
        } else if (visualType === 'spark') {
            this.drawSpark(particle.bitmap, size * 2, color);
        } else if (visualType === 'chunk') {
            if (particleType === 'bark') {
                this.drawBark(particle.bitmap, size * 2, color);
            } else {
                this.drawRock(particle.bitmap, size * 2, color);
            }
        }
        
        particle.anchor.x = 0.5;
        particle.anchor.y = 0.5;
        particle.x = centerX + (Math.random() - 0.5) * 20;
        particle.y = centerY + (Math.random() - 0.5) * 20;
        particle.blendMode = particleType === 'spark' ? 1 : 0;
        particle.opacity = isSecondary ? 200 : 255;
        
        // Enhanced spray pattern based on intensity
        const spreadAngle = sprayData.spread;
        const baseAngle = (Math.PI * 0.25) + (Math.random() * Math.PI * 1.5);
        const angle = baseAngle + (Math.random() - 0.5) * (spreadAngle * Math.PI / 180);
        
        const minSpeed = sprayData.speed[0];
        const maxSpeed = sprayData.speed[1];
        const speed = (minSpeed + Math.random() * (maxSpeed - minSpeed)) * (isSecondary ? 0.6 : 1);
        
        // Longer life for more severe wounds
        const lifeMultiplier = intensity === 'devastating' ? 1.5 : 
                              intensity === 'brutal' ? 1.3 : 
                              intensity === 'heavy' ? 1.1 : 1.0;
        
        particle._particleData = {
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed - (isSecondary ? 2 : 4),
            gravity: config.gravity * (isSecondary ? 0.8 : 1),
            airResistance: config.airResistance,
            life: Math.floor((isSecondary ? 60 : 90) * lifeMultiplier),
            maxLife: Math.floor((isSecondary ? 60 : 90) * lifeMultiplier),
            rotation: Math.random() * Math.PI * 2,
            rotationSpeed: (Math.random() - 0.5) * (isSecondary ? 0.2 : 0.4),
            isGrounded: false,
            type: particleType,
            visualType: visualType,
            accumulates: config.accumulates,
            color: color,
            enemyX: centerX,
            isSecondary: isSecondary,
            initialSpeed: speed,
            stainChance: sprayData.stainChance,
            intensity: intensity
        };
        
        this._bloodParticles.push(particle);
        
        if (SceneManager._scene && SceneManager._scene._spriteset) {
            SceneManager._scene._spriteset._battleField.addChildAt(particle, 0);
        }
    };

    // NEW: Create mist particles for atmospheric blood spray
    Sprite_Enemy.prototype.createMistParticle = function(centerX, centerY, config, intensity) {
        const particle = new Sprite();
        
        const size = 15 + Math.random() * 10;
        particle.bitmap = new Bitmap(size * 2, size * 2);
        
        const color = config.colors[Math.floor(Math.random() * config.colors.length)];
        this.drawMist(particle.bitmap, size, color);
        
        particle.anchor.x = 0.5;
        particle.anchor.y = 0.5;
        particle.x = centerX + (Math.random() - 0.5) * 40;
        particle.y = centerY + (Math.random() - 0.5) * 40;
        particle.blendMode = 0;
        particle.opacity = 40 + Math.random() * 40;
        
        const angle = Math.random() * Math.PI * 2;
        const speed = 0.5 + Math.random() * 1.5;
        
        particle._particleData = {
            vx: Math.cos(angle) * speed,
            vy: -Math.abs(Math.sin(angle) * speed) - 1,
            gravity: -0.05,
            airResistance: 0.99,
            life: 40 + Math.random() * 20,
            maxLife: 60,
            rotation: 0,
            rotationSpeed: 0,
            isGrounded: false,
            type: 'mist',
            visualType: 'mist',
            accumulates: false,
            intensity: intensity
        };
        
        this._bloodParticles.push(particle);
        
        if (SceneManager._scene && SceneManager._scene._spriteset) {
            SceneManager._scene._spriteset._battleField.addChildAt(particle, 0);
        }
    };

    Sprite_Enemy.prototype.darkenColor = function(color, factor) {
        const r = parseInt(color.substr(1, 2), 16);
        const g = parseInt(color.substr(3, 2), 16);
        const b = parseInt(color.substr(5, 2), 16);
        
        const newR = Math.floor(r * factor);
        const newG = Math.floor(g * factor);
        const newB = Math.floor(b * factor);
        
        return '#' + 
            newR.toString(16).padStart(2, '0') + 
            newG.toString(16).padStart(2, '0') + 
            newB.toString(16).padStart(2, '0');
    };

    Sprite_Enemy.prototype.drawBloodDrop = function(bitmap, size, color, darkerColor) {
        const ctx = bitmap._context;
        const centerX = size;
        const centerY = size;
        
        const gradient = ctx.createRadialGradient(centerX - size * 0.2, centerY - size * 0.2, 0, centerX, centerY, size * 0.5);
        gradient.addColorStop(0, color);
        gradient.addColorStop(1, darkerColor);
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(centerX, centerY, size * 0.4, 0, Math.PI * 2);
        ctx.fill();
    };

    Sprite_Enemy.prototype.drawStreak = function(bitmap, size, color) {
        const ctx = bitmap._context;
        const centerX = size;
        const centerY = size;
        
        ctx.strokeStyle = color;
        ctx.lineWidth = size * 0.3;
        ctx.lineCap = 'round';
        
        ctx.beginPath();
        ctx.moveTo(centerX - size * 0.5, centerY);
        ctx.lineTo(centerX + size * 0.5, centerY - size * 0.2);
        ctx.stroke();
    };

    Sprite_Enemy.prototype.drawMist = function(bitmap, size, color) {
        const ctx = bitmap._context;
        const centerX = size;
        const centerY = size;
        
        ctx.fillStyle = color;
        ctx.globalAlpha = 0.3;
        
        for (let i = 0; i < 3; i++) {
            const offsetX = (Math.random() - 0.5) * size * 0.3;
            const offsetY = (Math.random() - 0.5) * size * 0.3;
            ctx.beginPath();
            ctx.arc(centerX + offsetX, centerY + offsetY, size * 0.25, 0, Math.PI * 2);
            ctx.fill();
        }
        
        ctx.globalAlpha = 1.0;
    };

    Sprite_Enemy.prototype.drawSpark = function(bitmap, size, color) {
        const ctx = bitmap._context;
        ctx.fillStyle = color;
        ctx.strokeStyle = color;
        ctx.lineWidth = 2;
        
        ctx.beginPath();
        for (let i = 0; i < 8; i++) {
            const angle = (i * Math.PI) / 4;
            const radius = i % 2 === 0 ? size * 0.6 : size * 0.2;
            const x = size + Math.cos(angle) * radius;
            const y = size + Math.sin(angle) * radius;
            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        }
        ctx.closePath();
        ctx.fill();
    };

    Sprite_Enemy.prototype.drawRock = function(bitmap, size, color) {
        const ctx = bitmap._context;
        ctx.fillStyle = color;
        
        const sides = 5 + Math.floor(Math.random() * 3);
        ctx.beginPath();
        for (let i = 0; i < sides; i++) {
            const angle = (i * Math.PI * 2) / sides + Math.random() * 0.5;
            const radius = size * (0.4 + Math.random() * 0.3);
            const x = size + Math.cos(angle) * radius;
            const y = size + Math.sin(angle) * radius;
            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        }
        ctx.closePath();
        ctx.fill();
    };

    Sprite_Enemy.prototype.drawBark = function(bitmap, size, color) {
        const ctx = bitmap._context;
        ctx.fillStyle = color;
        
        ctx.beginPath();
        ctx.ellipse(size, size, size * 0.6, size * 0.3, Math.random() * Math.PI, 0, Math.PI * 2);
        ctx.fill();
    };

    // MODIFIED: Enhanced particle update with stain chance based on intensity
    Sprite_Enemy.prototype.updateBloodParticles = function() {
        for (let i = this._bloodParticles.length - 1; i >= 0; i--) {
            const particle = this._bloodParticles[i];
            const data = particle._particleData;
            
            if (!data) continue;
            
            if (!data.isGrounded && data.accumulates && particle.y >= groundLevel) {
                data.isGrounded = true;
                data.vy = 0;
                data.vx = 0;
                particle.y = groundLevel;
                
                this.convertToGroundStain(particle, data);
                this._bloodParticles.splice(i, 1);
                continue;
            }
            
            if (!data.isGrounded) {
                particle.x += data.vx;
                particle.y += data.vy;
                data.vy += data.gravity;
                
                data.vx *= data.airResistance;
                data.vy *= data.airResistance;
                
                if (data.visualType === 'drop' || data.visualType === 'chunk') {
                    particle.rotation += data.rotationSpeed;
                } else if (data.visualType === 'streak') {
                    particle.rotation = Math.atan2(data.vy, data.vx);
                }
                
                data.life--;
                
                const fadeRatio = data.type === 'spark' ? 0.6 : 0.4;
                if (data.life < data.maxLife * fadeRatio) {
                    particle.opacity = 255 * (data.life / (data.maxLife * fadeRatio));
                }
                
                if (data.type === 'spark') {
                    const scale = 0.3 + 0.7 * (data.life / data.maxLife);
                    particle.scale.x = scale;
                    particle.scale.y = scale;
                } else if (data.visualType === 'streak') {
                    const speed = Math.sqrt(data.vx * data.vx + data.vy * data.vy);
                    particle.scale.x = 0.5 + speed / data.initialSpeed;
                    particle.scale.y = 0.5 + 0.5 * (data.life / data.maxLife);
                } else if (data.visualType === 'mist') {
                    const scale = 1.0 + (1.0 - data.life / data.maxLife) * 0.5;
                    particle.scale.x = scale;
                    particle.scale.y = scale;
                    particle.opacity = Math.max(0, particle.opacity - 1);
                } else {
                    const scale = 0.6 + 0.4 * (data.life / data.maxLife);
                    particle.scale.x = scale;
                    particle.scale.y = scale;
                }
                
                if (!data.accumulates && (data.life <= 0 || particle.y > groundLevel + 100)) {
                    if (particle.parent) {
                        particle.parent.removeChild(particle);
                    }
                    if (particle.bitmap) {
                        particle.bitmap.destroy();
                    }
                    this._bloodParticles.splice(i, 1);
                }
            }
        }
    };

    // MODIFIED: Use stain chance from particle data
    Sprite_Enemy.prototype.convertToGroundStain = function(particle, data) {
        if (!SceneManager._scene || !SceneManager._scene._spriteset) return;
        
        particle.opacity = 180 + Math.random() * 75;
        particle.rotation = 0;
        particle.scale.x = 0.7 + Math.random() * 0.3;
        particle.scale.y = 0.7 + Math.random() * 0.3;
        
        const verticalSpread = Math.random() * 40;
        particle.y = groundLevel + verticalSpread;
        
        if (!SceneManager._scene._bloodStains) {
            SceneManager._scene._bloodStains = [];
        }
        SceneManager._scene._bloodStains.push(particle);
        
        // Use stain chance from particle data
        if (!data.isSecondary && Math.random() < data.stainChance) {
            this.createGroundStain(data.enemyX, particle.y, data.type, data.color, data.intensity);
        }
    };

    // MODIFIED: Enhanced ground stains based on intensity
    Sprite_Enemy.prototype.createGroundStain = function(enemyX, y, type, particleColor, intensity) {
        if (!SceneManager._scene || !SceneManager._scene._spriteset) return;
        
        const config = particleTypes[type];
        if (!config || !config.accumulates) return;
        
        // More stains for higher intensity
        const stainCount = intensity === 'devastating' ? 3 :
                          intensity === 'brutal' ? 2 : 1;
        
        for (let s = 0; s < stainCount; s++) {
            const stain = new Sprite();
            
            // Larger stains for more severe wounds
            const sizeMultiplier = intensity === 'devastating' ? 1.5 :
                                  intensity === 'brutal' ? 1.3 :
                                  intensity === 'heavy' ? 1.1 : 1.0;
            const size = (Math.random() * 12 + 8) * sizeMultiplier;
            
            stain.bitmap = new Bitmap(size, size);
            
            const ctx = stain.bitmap._context;
            const stainColors = config.stainColors || config.colors;
            const color = stainColors[Math.floor(Math.random() * stainColors.length)];
            ctx.fillStyle = color;
            
            // Draw irregular stain with multiple circles
            const numCircles = Math.floor(Math.random() * 4) + 3;
            for (let i = 0; i < numCircles; i++) {
                const offsetX = (Math.random() - 0.5) * size * 0.6;
                const offsetY = (Math.random() - 0.5) * size * 0.6;
                const radius = Math.random() * size * 0.35 + size * 0.15;
                ctx.globalAlpha = 0.3 + Math.random() * 0.4;
                ctx.beginPath();
                ctx.arc(size/2 + offsetX, size/2 + offsetY, radius, 0, Math.PI * 2);
                ctx.fill();
            }
            
            ctx.globalAlpha = 1.0;
            
            stain.anchor.x = 0.5;
            stain.anchor.y = 0.5;
            
            // Wider spread for more intense damage
            const spreadMultiplier = intensity === 'devastating' ? 2.0 :
                                    intensity === 'brutal' ? 1.5 : 1.0;
            const spreadX = (Math.random() - 0.5) * 70 * spreadMultiplier;
            stain.x = enemyX + spreadX + (s * 20 - stainCount * 10);
            stain.y = y + Math.random() * 10;
            stain.opacity = 160 + Math.random() * 95;
            stain.blendMode = 0;
            
            SceneManager._scene._spriteset._battleField.addChildAt(stain, 0);
            
            if (!SceneManager._scene._bloodStains) {
                SceneManager._scene._bloodStains = [];
            }
            SceneManager._scene._bloodStains.push(stain);
        }
    };

    Sprite_Enemy.prototype.loadBitmapWithHue = function(filename) {
        if (!this._enemy) return;
        
        const bitmap = ImageManager.loadEnemy(filename);
        const hue = this._enemy.battlerHue();
        
        bitmap.addLoadListener(() => {
            if (this.bitmap === bitmap) {
                this.setHue(hue);
            }
        });
        
        this.bitmap = bitmap;
        this.setHue(hue);
    };

    Sprite_Enemy.prototype.showAttackSprite = function(isSkill = false) {
        if (!this._enemy || this._showingAttack) return;
        
        if (isSkill) {
            const hitFilename = 'hit/' + this._defaultBattlerName + '_hit';
            const bitmap = ImageManager.loadEnemy(hitFilename);
            const hue = this._enemy.battlerHue();
            
            bitmap.addLoadListener(() => {
                if (!bitmap.isError() && this.bitmap === bitmap) {
                    this._showingAttack = true;
                    this._attackTimer = attackDuration;
                    this.setHue(hue);
                }
            });
            
            this.bitmap = bitmap;
            this.setHue(hue);
            this.startJump();
        } else {
            this.startLunge();
        }
    };
    
    Sprite_Enemy.prototype.showDodgeSprite = function() {
        if (!this._enemy || this._showingDodge) return;
        this.startDodge();
    };
    
    Sprite_Enemy.prototype.showCounterSprite = function() {
        if (!this._enemy || this._showingCounter) return;
        this.startLunge();
    };
    
    Sprite_Enemy.prototype.returnToIdle = function() {
        if (!this._enemy) return;
        if (!this._showingAttack && !this._showingDodge && !this._showingCounter) return;
        
        this._showingAttack = false;
        this._showingDodge = false;
        this._showingCounter = false;
        
        this.loadBitmapWithHue(this._defaultBattlerName);
        this._appeared = this._enemy.isAlive();
    };

    // Refactored trigger methods
    Sprite_Enemy.prototype.startLunge = function() {
        this._lungeAnimation.active = true;
        this._lungeAnimation.frame = 0;
    };

    Sprite_Enemy.prototype.startDodge = function() {
        this._dodgeAnimation.active = true;
        this._dodgeAnimation.frame = 0;
        this._dodgeAnimation.direction = Math.random() < 0.5 ? -1 : 1;
    };

    Sprite_Enemy.prototype.startJump = function() {
        this._jumpAnimation.active = true;
        this._jumpAnimation.frame = 0;
    };

    const _Sprite_Enemy_updateBitmap = Sprite_Enemy.prototype.updateBitmap;
    Sprite_Enemy.prototype.updateBitmap = function() {
        const name = this._enemy.battlerName();
        if (this._battlerName !== name && !this._showingAttack && !this._showingDodge && !this._showingCounter) {
            this._battlerName = name;
            this._defaultBattlerName = name;
            this.loadBitmapWithHue(name);
        }
    };

    //-----------------------------------------------------------------------------
    // Game_Action
    //-----------------------------------------------------------------------------

    const _Game_Action_apply = Game_Action.prototype.apply;
    Game_Action.prototype.apply = function(target) {
        const subject = this.subject();
        
        // Trigger lunge animation for enemy attackers
        if (subject && subject.isEnemy()) {
            const sprite = subject.getBattlerSprite();
            if (sprite) {
                const item = this.item();
                // Normal attack (not a skill)
                if (item && DataManager.isSkill(item) && item.id === subject.attackSkillId()) {
                    sprite.startLunge();
                }
                // Skills trigger jump instead (handled in showAttackSprite)
            }
        }
        
        _Game_Action_apply.call(this, target);
        
        if (target && target.isEnemy()) {
            const result = target.result();
            if (result.isHit() && result.hpDamage > 0) {
                const item = this.item();
                if (item && (item.damage.elementId === 1 || item.damage.elementId === -1)) {
                    const damage = result.hpDamage;
                    setTimeout(() => {
                        const sprite = target.getBattlerSprite();
                        if (sprite) {
                            sprite.createDamageParticles(damage);
                        }
                    }, 100);
                }
            }
        }
    };

    //-----------------------------------------------------------------------------
    // Game_Enemy
    //-----------------------------------------------------------------------------

    const _Game_Enemy_performEvasion = Game_Enemy.prototype.performEvasion;
    Game_Enemy.prototype.performEvasion = function() {
        _Game_Enemy_performEvasion.call(this);
        
        const sprite = this.getBattlerSprite();
        if (sprite) {
            sprite.showDodgeSprite();
        }
    };

    const _Game_Enemy_performCounter = Game_Enemy.prototype.performCounter;
    Game_Enemy.prototype.performCounter = function() {
        _Game_Enemy_performCounter.call(this);
        
        const sprite = this.getBattlerSprite();
        if (sprite) {
            sprite.showCounterSprite();
        }
    };

    Game_Enemy.prototype.getBattlerSprite = function() {
        if (!SceneManager._scene || !SceneManager._scene._spriteset) {
            return null;
        }
        
        const spriteset = SceneManager._scene._spriteset;
        if (!spriteset._enemySprites) return null;
        
        for (const sprite of spriteset._enemySprites) {
            if (sprite._battler === this) {
                return sprite;
            }
        }
        return null;
    };

    // Disable default blink and whiten effects
    Sprite_Enemy.prototype.updateBlink = function() {
        // Disabled - no transparency blink effect
    };
    
    Sprite_Enemy.prototype.updateWhiten = function() {
        // Disabled - no white flash effect
    };

    // Add this to your plugin to override damage popup positioning
    const _Sprite_Damage_setup = Sprite_Damage.prototype.setup;
    Sprite_Damage.prototype.setup = function(target) {
        const result = target.result();
        if (result.missed || result.evaded) {
            this._colorType = 0;
            this.createMiss();
        } else if (result.hpAffected) {
            this._colorType = result.hpDamage >= 0 ? 0 : 1;
            this.createDigits(result.hpDamage);
        } else if (target.isAlive() && result.mpDamage !== 0) {
            this._colorType = result.mpDamage >= 0 ? 2 : 3;
            this.createDigits(result.mpDamage)  ;
        }
        if (result.critical) {
            this.setupCriticalEffect();
        }
        
        // Center the damage display on screen
        this.x = Graphics.boxWidth / 2;
        this.y = Graphics.boxHeight / 2;
    };

    // Override the update position to keep it centered
    const _Sprite_Damage_updatePosition = Sprite_Damage.prototype.updatePosition;
    Sprite_Damage.prototype.updatePosition = function() {
        // Keep damage centered instead of following the battler
        this.x = Graphics.boxWidth / 2;
        this.y = Graphics.boxHeight / 2 - (this._duration * 0.5); // Small upward movement
    };
})();
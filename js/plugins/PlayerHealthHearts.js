//=============================================================================
// Player Health Hearts Display (Enhanced)
// Version: 1.1.0
//=============================================================================

/*:
 * @target MZ
 * @plugindesc Player Health Hearts Display v1.1.0
 * @author Omni-Lex
 * @version 1.1.0
 * @description Shows player health as hearts with smooth animations and effects
 * 
 * @param displayDuration
 * @text Display Duration
 * @desc How long to show hearts (in frames, 60 = 1 second)
 * @type number
 * @min 60
 * @max 600
 * @default 240
 * 
 * @param heartEmpty
 * @text Empty Heart Symbol
 * @desc Symbol for empty heart
 * @type string
 * @default ♡
 * 
 * @param heartFull
 * @text Full Heart Symbol
 * @desc Symbol for full heart
 * @type string
 * @default ♥
 * 
 * @param fontSize
 * @text Font Size
 * @desc Size of heart symbols
 * @type number
 * @min 16
 * @max 48
 * @default 28
 * 
 * @param animationSpeed
 * @text Animation Speed
 * @desc Speed of heart loss/gain animations (higher = faster)
 * @type number
 * @min 1
 * @max 10
 * @default 4
 * 
 * @help PlayerHealthHearts.js
 * 
 * Enhanced version with smooth animations:
 * - Hearts fade in/out when lost or gained
 * - Smooth scaling animations
 * - Outline effects for better visibility
 * - Bounce effect when taking damage
 * - Glow effect when healing
 */

(() => {
    'use strict';
    
    const pluginName = 'PlayerHealthHearts';
    const parameters = PluginManager.parameters(pluginName);
    
    const displayDuration = parseInt(parameters['displayDuration']) || 240;
    const heartEmpty = parameters['heartEmpty'] || '♡';
    const heartFull = parameters['heartFull'] || '♥';
    const fontSize = parseInt(parameters['fontSize']) || 28;
    const animationSpeed = parseInt(parameters['animationSpeed']) || 4;
    
    let healthDisplay = null;
    let displayTimer = 0;
    let lastKnownHp = 0;
    let isMapScene = false;
    let heartStates = []; // Track individual heart states for animation
    let damageShake = 0;
    let healGlow = 0;
    let playerFlashTimer = 0;
    let playerFlashIntensity = 0;
    let floorDamageActive = false;
    let floorDamageCooldown = 0;
    
    // Heart state object
    function HeartState(index) {
        this.index = index;
        this.visible = true;
        this.scale = 1.0;
        this.opacity = 255;
        this.targetScale = 1.0;
        this.targetOpacity = 255;
        this.animationTimer = 0;
        this.type = 'full'; // 'full', 'empty', or 'lost'
    }
    
    // Create enhanced health display window
    function Window_HealthHearts() {
        this.initialize(...arguments);
    }
    
    Window_HealthHearts.prototype = Object.create(Window_Base.prototype);
    Window_HealthHearts.prototype.constructor = Window_HealthHearts;
    
    Window_HealthHearts.prototype.initialize = function() {
        const rect = new Rectangle(10, 10, 250, 80);
        Window_Base.prototype.initialize.call(this, rect);
        this.opacity = 0;
        this.contentsOpacity = 255;
        this.visible = false;
        this.padding = 8;
        
        // Initialize heart states
        heartStates = [];
        for (let i = 0; i < 5; i++) {
            heartStates.push(new HeartState(i));
        }
    };
    
    Window_HealthHearts.prototype.refresh = function() {
        this.contents.clear();
        
        const actor = $gameParty.leader();
        if (!actor) return;
        
        const hpRate = actor.hp / actor.mhp;
        const targetHearts = this.calculateHearts(hpRate);
        
        // Update heart states based on current health
        this.updateHeartStates(targetHearts);
        
        // Draw hearts with individual animations
        this.drawAnimatedHearts();
    };
    
    Window_HealthHearts.prototype.calculateHearts = function(hpRate) {
        if (hpRate >= 0.9) return 5;
        if (hpRate >= 0.7) return 4;
        if (hpRate >= 0.5) return 3;
        if (hpRate >= 0.3) return 2;
        if (hpRate >= 0.1) return 1;
        return 0;
    };
    
    Window_HealthHearts.prototype.updateHeartStates = function(targetHearts) {
        for (let i = 0; i < 5; i++) {
            const heart = heartStates[i];
            const shouldBeFull = i < targetHearts;
            
            if (shouldBeFull && heart.type !== 'full') {
                // Heart should be gained
                heart.type = 'full';
                heart.targetScale = 1.2;
                heart.targetOpacity = 255;
                heart.animationTimer = 30;
                healGlow = Math.max(healGlow, 30);
            } else if (!shouldBeFull && heart.type === 'full') {
                // Heart should be lost
                heart.type = 'lost';
                heart.targetScale = 0.3;
                heart.targetOpacity = 0;
                heart.animationTimer = 45;
                damageShake = Math.max(damageShake, 20);
            } else if (!shouldBeFull && heart.type !== 'empty' && heart.type !== 'lost') {
                // Heart should be empty
                heart.type = 'empty';
                heart.targetScale = 0.9;
                heart.targetOpacity = 180;
            }
        }
    };
    
    Window_HealthHearts.prototype.updateAnimations = function() {
        let hasActiveAnimations = false;
        
        for (let i = 0; i < heartStates.length; i++) {
            const heart = heartStates[i];
            
            if (heart.animationTimer > 0) {
                heart.animationTimer--;
                hasActiveAnimations = true;
                
                // Smooth interpolation
                const progress = 1 - (heart.animationTimer / 45);
                const easeProgress = this.easeOutBounce(progress);
                
                heart.scale = this.lerp(heart.scale, heart.targetScale, 0.15);
                heart.opacity = this.lerp(heart.opacity, heart.targetOpacity, 0.12);
                
                // Special effects during animation
                if (heart.type === 'lost' && heart.animationTimer > 20) {
                    // Add some bounce before disappearing
                    heart.scale = heart.targetScale + Math.sin(heart.animationTimer * 0.5) * 0.1;
                }
            } else {
                // Smooth return to normal state
                heart.scale = this.lerp(heart.scale, heart.targetScale, 0.1);
                heart.opacity = this.lerp(heart.opacity, heart.targetOpacity, 0.1);
                
                // Set final target values for stable states
                if (heart.type === 'full') {
                    heart.targetScale = 1.0;
                } else if (heart.type === 'empty') {
                    heart.targetScale = 0.9;
                    heart.targetOpacity = 180;
                }
            }
        }
        
        // Update screen effects
        if (damageShake > 0) {
            damageShake--;
        }
        if (healGlow > 0) {
            healGlow--;
        }
        
        // Update floor damage flash effect
        if (floorDamageActive) {
            // Keep red intensity high while taking damage
            playerFlashIntensity = 0.7 + Math.sin(Date.now() * 0.01) * 0.2; // Subtle pulsing
            floorDamageCooldown = 60; // Reset cooldown when active
        } else if (floorDamageCooldown > 0) {
            // Fade out gradually after stopping floor damage
            floorDamageCooldown--;
            playerFlashIntensity = Math.max(0, (floorDamageCooldown / 60) * 0.7);
        } else {
            playerFlashIntensity = 0;
        }
        
        // Reset floor damage active flag (will be set again if still on damaging floor)
        floorDamageActive = false;
        
        return hasActiveAnimations;
    };
    
    Window_HealthHearts.prototype.drawAnimatedHearts = function() {
        const heartSpacing = 32;
        const baseY = 10;
        
        // Apply screen shake for damage
        const shakeX = damageShake > 0 ? (Math.random() - 0.5) * (damageShake * 0.3) : 0;
        const shakeY = damageShake > 0 ? (Math.random() - 0.5) * (damageShake * 0.2) : 0;
        
        for (let i = 0; i < heartStates.length; i++) {
            const heart = heartStates[i];
            const baseX = 10 + (i * heartSpacing);
            const x = baseX + shakeX;
            const y = baseY + shakeY;
            
            // Skip completely invisible hearts
            if (heart.opacity <= 10) continue;
            
            // Calculate scaled font size
            const scaledFontSize = Math.floor(fontSize * heart.scale);
            if (scaledFontSize <= 0) continue;
            
            // Set font properties
            this.contents.fontSize = scaledFontSize;
            
            // Calculate position offset for scaling effect (center the scaling)
            const scaleOffsetX = (fontSize - scaledFontSize) / 2;
            const scaleOffsetY = (fontSize - scaledFontSize) / 2;
            const finalX = x + scaleOffsetX;
            const finalY = y + scaleOffsetY;
            
            // Determine heart symbol and color
            const symbol = heart.type === 'full' ? heartFull : heartEmpty;
            let heartColor;
            
            if (heart.type === 'full') {
                const alpha = heart.opacity / 255;
                heartColor = `rgba(255, 100, 100, ${alpha})`;
                
                // Add glow effect when healing
                if (healGlow > 0) {
                    const glowIntensity = healGlow / 30;
                    // Draw glow background (larger, lighter heart behind)
                    this.contents.fontSize = scaledFontSize + 4;
                    this.changeTextColor(`rgba(150, 255, 150, ${glowIntensity * alpha * 0.6})`);
                    this.drawText(symbol, finalX - 2, finalY - 2, scaledFontSize + 10, 'left');
                    this.contents.fontSize = scaledFontSize; // Reset font size
                }
            } else if (heart.type === 'empty') {
                const alpha = heart.opacity / 255;
                heartColor = `rgba(200, 200, 200, ${alpha})`;
            } else {
                const alpha = heart.opacity / 255;
                heartColor = `rgba(150, 150, 150, ${alpha})`;
            }
            
            // Draw outline by drawing the text multiple times with offset
            this.changeTextColor('#000000');
            const outlineSize = Math.max(1, Math.floor(scaledFontSize / 14));
            
            // Draw outline in 8 directions
            for (let ox = -outlineSize; ox <= outlineSize; ox++) {
                for (let oy = -outlineSize; oy <= outlineSize; oy++) {
                    if (ox !== 0 || oy !== 0) {
                        this.drawText(symbol, finalX + ox, finalY + oy, scaledFontSize + 10, 'left');
                    }
                }
            }
            
            // Draw the main heart
            this.changeTextColor(heartColor);
            this.drawText(symbol, finalX, finalY, scaledFontSize + 10, 'left');
        }
        
        // Reset font size to default
        this.resetFontSettings();
    };
    
    // Utility functions for smooth animations
    Window_HealthHearts.prototype.lerp = function(start, end, factor) {
        return start + (end - start) * factor;
    };
    
    Window_HealthHearts.prototype.easeOutBounce = function(t) {
        if (t < 1 / 2.75) {
            return 7.5625 * t * t;
        } else if (t < 2 / 2.75) {
            return 7.5625 * (t -= 1.5 / 2.75) * t + 0.75;
        } else if (t < 2.5 / 2.75) {
            return 7.5625 * (t -= 2.25 / 2.75) * t + 0.9375;
        } else {
            return 7.5625 * (t -= 2.625 / 2.75) * t + 0.984375;
        }
    };
    
    // Show the health display with entrance animation
    function showHealthDisplay() {
        if (!isMapScene) return;
        
        if (!healthDisplay) {
            healthDisplay = new Window_HealthHearts();
            SceneManager._scene.addChild(healthDisplay);
        }
        
        healthDisplay.refresh();
        healthDisplay.visible = true;
        healthDisplay.contentsOpacity = 0; // Start invisible for fade-in
        displayTimer = displayDuration;
    }
    
    // Hide the health display with exit animation
    function hideHealthDisplay() {
        if (healthDisplay && displayTimer <= 0) {
            healthDisplay.visible = false;
            damageShake = 0;
            healGlow = 0;
        }
    }
    
    // Check for health changes
    function checkHealthChange() {
        if (!isMapScene) return;
        
        const actor = $gameParty.leader();
        if (!actor) return;
        
        const currentHp = actor.hp;
        
        if (currentHp !== lastKnownHp && lastKnownHp > 0) {
            showHealthDisplay();
        }
        
        lastKnownHp = currentHp;
    }
    
    // Update display with animations
    function updateHealthDisplay() {
        if (healthDisplay && healthDisplay.visible) {
            // Fade in effect
            if (healthDisplay.contentsOpacity < 255) {
                healthDisplay.contentsOpacity = Math.min(255, healthDisplay.contentsOpacity + 8);
            }
            
            // Update heart animations
            const hasActiveAnimations = healthDisplay.updateAnimations();
            
            // Refresh display to show animation updates
            if (hasActiveAnimations || damageShake > 0 || healGlow > 0) {
                healthDisplay.refresh();
            }
        }
        
        if (displayTimer > 0) {
            displayTimer--;
            
            // Fade out effect in last 30 frames
            if (displayTimer <= 30 && healthDisplay) {
                const fadeAlpha = displayTimer / 30;
                healthDisplay.contentsOpacity = Math.floor(255 * fadeAlpha);
            }
            
            if (displayTimer <= 0) {
                hideHealthDisplay();
            }
        }
    }
    
    // Hook into Scene_Map
    const _Scene_Map_initialize = Scene_Map.prototype.initialize;
    Scene_Map.prototype.initialize = function() {
        _Scene_Map_initialize.call(this);
        isMapScene = true;
        
        const actor = $gameParty.leader();
        if (actor) {
            lastKnownHp = actor.hp;
        }
    };
    
    const _Scene_Map_terminate = Scene_Map.prototype.terminate;
    Scene_Map.prototype.terminate = function() {
        _Scene_Map_terminate.call(this);
        isMapScene = false;
        hideHealthDisplay();
        
        if (healthDisplay) {
            this.removeChild(healthDisplay);
            healthDisplay = null;
        }
        
        // Reset animation states
        damageShake = 0;
        healGlow = 0;
        playerFlashTimer = 0;
        playerFlashIntensity = 0;
        floorDamageActive = false;
        floorDamageCooldown = 0;
    };
    
    const _Scene_Map_update = Scene_Map.prototype.update;
    Scene_Map.prototype.update = function() {
        _Scene_Map_update.call(this);
        checkHealthChange();
        updateHealthDisplay();
    };
    
    // Hook into Game_Actor methods
    const _Game_Actor_refresh = Game_Actor.prototype.refresh;
    Game_Actor.prototype.refresh = function() {
        const oldHp = this._hp;
        _Game_Actor_refresh.call(this);
        
        if (this === $gameParty.leader() && isMapScene && oldHp !== this._hp) {
            setTimeout(() => checkHealthChange(), 1);
        }
    };
    
    const _Game_Battler_setHp = Game_Battler.prototype.setHp;
    Game_Battler.prototype.setHp = function(hp) {
        const oldHp = this._hp;
        _Game_Battler_setHp.call(this, hp);
        
        if (this === $gameParty.leader() && isMapScene && oldHp !== this._hp) {
            setTimeout(() => checkHealthChange(), 1);
        }
    };
    
    // Clean up when changing scenes
    const _SceneManager_goto = SceneManager.goto;
    SceneManager.goto = function(sceneClass) {
        if (healthDisplay && SceneManager._scene) {
            SceneManager._scene.removeChild(healthDisplay);
            healthDisplay = null;
        }
        damageShake = 0;
        healGlow = 0;
        playerFlashTimer = 0;
        playerFlashIntensity = 0;
        floorDamageActive = false;
        floorDamageCooldown = 0;
        _SceneManager_goto.call(this, sceneClass);
    };
    
    //=============================================================================
    // Floor Damage Animation Override
    //=============================================================================
    
    // Override floor damage to flash player instead of screen
    const _Game_Actor_executeFloorDamage = Game_Actor.prototype.executeFloorDamage;
    Game_Actor.prototype.executeFloorDamage = function() {
        const damage = Math.floor(this.basicFloorDamage() * this.fdr);
        
        // Apply damage without screen flash
        this.gainHp(-damage);
        
        // Trigger continuous player flash effect
        if (this === $gameParty.leader() && isMapScene && damage > 0) {
            floorDamageActive = true; // Keep red as long as taking damage
            damageShake = Math.max(damageShake, 8); // Gentler shake for continuous damage
        }
        
        // Show damage popup if desired (optional)
        if (damage > 0) {
            this.startDamagePopup();
        }
        
        return damage;
    };
    
    // Override screen flash to prevent it during floor damage
    const _Scene_Map_updateEncounterEffect = Scene_Map.prototype.updateEncounterEffect;
    Scene_Map.prototype.updateEncounterEffect = function() {
        // Only call original if it's not floor damage causing the flash
        if (!floorDamageActive && floorDamageCooldown <= 0) {
            _Scene_Map_updateEncounterEffect.call(this);
        }
    };
    
    // Apply red flash to player sprite
    const _Sprite_Character_updateOther = Sprite_Character.prototype.updateOther;
    Sprite_Character.prototype.updateOther = function() {
        _Sprite_Character_updateOther.call(this);
        
        // Apply red flash to player character
        if (this._character === $gamePlayer && playerFlashIntensity > 0) {
            const flashColor = [255, 100, 100, playerFlashIntensity * 255];
            this.setBlendColor(flashColor);
        } else if (this._character === $gamePlayer && playerFlashIntensity <= 0) {
            // Clear flash when intensity reaches 0
            this.setBlendColor([0, 0, 0, 0]);
        }
    };
    
    // Alternative method: Apply flash to all party member sprites
    const _Sprite_Character_update = Sprite_Character.prototype.update;
    Sprite_Character.prototype.update = function() {
        _Sprite_Character_update.call(this);
        
        // Apply red flash to all party followers during floor damage
        if (playerFlashIntensity > 0) {
            const isPlayerOrFollower = this._character === $gamePlayer || 
                                      ($gamePlayer._followers && $gamePlayer._followers._data.includes(this._character));
            
            if (isPlayerOrFollower) {
                const intensity = playerFlashIntensity;
                const flashColor = [255, 80, 80, intensity * 180];
                this.setBlendColor(flashColor);
            }
        } else {
            // Clear flash when not taking floor damage
            const isPlayerOrFollower = this._character === $gamePlayer || 
                                      ($gamePlayer._followers && $gamePlayer._followers._data.includes(this._character));
            
            if (isPlayerOrFollower) {
                this.setBlendColor([0, 0, 0, 0]);
            }
        }
    };
    
    // Disable default screen flash for floor damage
    const _Game_Screen_startFlashForDamage = Game_Screen.prototype.startFlashForDamage;
    Game_Screen.prototype.startFlashForDamage = function() {
        // Only allow screen flash if it's not from floor damage
        if (!floorDamageActive && floorDamageCooldown <= 0) {
            _Game_Screen_startFlashForDamage.call(this);
        }
    };
})();
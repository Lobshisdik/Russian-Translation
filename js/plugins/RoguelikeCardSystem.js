/*:
 * @target MZ
 * @plugindesc RoguelikeCardSystem v1.2.0
 * @author Omni-Lex
 * @help
 * ============================================================================
 * Roguelike Card System for RPGMaker MZ
 * ============================================================================
 * 
 * This plugin adds a card-based battle system that activates when Switch 45
 * is ON. Players draw cards representing skills and items from a 40-card deck.
 * 
 * Features:
 * - Deck of 40 cards (skills + items)
 * - Hand of 5 cards with Hearthstone-style animations
 * - Energy system: cards cost energy instead of MP/TP
 * - Energy cost = (MP + TP) / 10, capped at 10
 * - Player starts with 1 energy, gains +1 max energy per turn (up to 10)
 * - Navigate cards with Left/Right arrows or A/D keys
 * - Visual card display with name, icon, and description
 * - Smooth animations and hover effects
 * 
 * @param cardWidth
 * @text Card Width
 * @type number
 * @default 150
 * @desc Width of each card in pixels
 * 
 * @param cardHeight
 * @text Card Height
 * @type number
 * @default 220
 * @desc Height of each card in pixels
 * 
 * @param handY
 * @text Hand Y Position
 * @type number
 * @default 380
 * @desc Y position of the card hand
 * 
 * @param deckX
 * @text Deck X Position
 * @type number
 * @default 700
 * @desc X position of the deck display
 * 
 * @param deckY
 * @text Deck Y Position
 * @type number
 * @default 50
 * @desc Y position of the deck display
 */

(() => {
    'use strict';
    
    const pluginName = 'RoguelikeCardSystem';
    const parameters = PluginManager.parameters(pluginName);
    const cardWidth = Number(parameters['cardWidth'] || 150);
    const cardHeight = Number(parameters['cardHeight'] || 220);
    const handY = Number(parameters['handY'] || 380);
    const deckX = Number(parameters['deckX'] || 700);
    const deckY = Number(parameters['deckY'] || 50);
    let _originalPartyMembers = [];
    let _actor2Skills = [];
    let _actor3Skills = [];
    // Energy Manager// Energy Manager
// Energy Manager
class EnergyManager {
    constructor() {
        this.reset();
    }

    reset() {
        this.currentEnergy = 1;
        this.turnCount = 0;
    }

    startTurn() {
        this.turnCount++;
        // Gain 1 base energy at the start of each turn
        this.currentEnergy += 1;
    }

    canAfford(cost) {
        return this.currentEnergy >= cost;
    }

    spendEnergy(cost) {
        if (this.canAfford(cost)) {
            this.currentEnergy -= cost;
            return true;
        }
        return false;
    }

    addEnergy(amount) {
        this.currentEnergy += amount;
    }
}
    
    // Card Class
    class Card {
        constructor(type, id, data) {
            this.type = type; // 'skill' or 'item'
            this.id = id;
            this.data = data;
            this.name = data.name;
            this.iconIndex = data.iconIndex;
            this.description = data.description;
            this.energyCost = this.calculateEnergyCost();
        }
        
        calculateEnergyCost() {
            let cost = 0;
            
            if (this.type === 'skill') {
                const skill = $dataSkills[this.id];
                cost = Math.floor((skill.mpCost + skill.tpCost) / 10);
            } else if (this.type === 'item') {
                const item = $dataItems[this.id];
                // Items have base cost of 1, but can be modified based on price
                cost = Math.max(1, Math.floor(item.price / 1000));
            }
            
            // Cap energy cost at 10
            return Math.min(10, Math.max(0, cost));
        }
        
        canUse(actor) {
            // Check if we have enough energy
            if (!window.$energyManager || !window.$energyManager.canAfford(this.energyCost)) {
                return false;
            }
            
            if (this.type === 'skill') {
                const skill = $dataSkills[this.id];
                if (!skill) return false;
                
                // Check if skill is usable (not just if actor knows it)
                if (skill.occasion === 3) return false; // Never usable
                if (skill.occasion === 2) return false; // Menu only
                
                // For battle, allow both "always" (0) and "battle only" (1) skills
                return skill.occasion === 0 || skill.occasion === 1;
            } else if (this.type === 'item') {
                const item = $dataItems[this.id];
                if (!item) return false;
                
                // Check item usability
                if (item.occasion === 3) return false; // Never usable
                if (item.occasion === 2) return false; // Menu only
                
                return item.occasion === 0 || item.occasion === 1;
            }
            
            return false;
        }
        
        needsTarget() {
            if (this.type === 'skill') {
                const skill = $dataSkills[this.id];
                return skill.scope === 1 || skill.scope === 3 || skill.scope === 7;
            } else if (this.type === 'item') {
                const item = $dataItems[this.id];
                return item.scope === 1 || item.scope === 3 || item.scope === 7;
            }
            return true;
        }
        
        createAction(actor) {
            const action = new Game_Action(actor);
    
            if (this.type === 'skill') {
                const skill = $dataSkills[this.id];
                if (!skill) {
                    console.log(`Error: Skill ${this.id} not found for card ${this.name}`);
                    return null;
                }
                action.setSkill(this.id);
            } else if (this.type === 'item') {
                const item = $dataItems[this.id];
                if (!item) {
                    console.log(`Error: Item ${this.id} not found for card ${this.name}`);
                    return null;
                }
                action.setItem(this.id);
            } else {
                console.log(`Error: Unknown card type ${this.type} for card ${this.name}`);
                return null;
            }
            
            // Ensure the action is marked as valid
            action._forcing = false;
            
            // Verify the action has the required data
            if (!action._item || !action._item.object()) {
                console.log(`Warning: Action created but item/skill data missing for ${this.name}`);
            }
            
            return action;
        }
    }
    
    // Enhanced Card Sprite Class with Animations
    class Sprite_Card extends Sprite {
        constructor(card, index, isSelected) {
            super();
            this.card = card;
            this.index = index;
            this._selected = isSelected;
            this._hover = false;
            this._animationTime = 0;
            this._targetX = 0;
            this._targetY = 0;
            this._targetRotation = 0;
            this._targetScale = 1;
            this._currentScale = 0.1;
            this._drawAnimation = 0;
            this._floating = Math.random() * Math.PI * 2;
            this._shakeAnimation = 0;
            this._particles = [];
            
            this.anchor.x = 0.5;
            this.anchor.y = 0.5;
            
            this.createBitmap();
            this.createParticleContainer();
            this.refresh();
            
            // Start with card scaled down for draw animation
            this.scale.x = 0.1;
            this.scale.y = 0.1;
            
            // Add initial particles for new card
            this.createDrawParticles();
        }
        
        createBitmap() {
            this.bitmap = new Bitmap(cardWidth, cardHeight);
        }
        
        createParticleContainer() {
            this._particleContainer = new Sprite();
            this._particleContainer.z = 200;
            this.addChild(this._particleContainer);
        }
        
        createDrawParticles() {
            for (let i = 0; i < 10; i++) {
                const particle = new Sprite();
                particle.bitmap = new Bitmap(8, 8);
                particle.bitmap.drawCircle(4, 4, 4, '#ffeb3b');
                particle.anchor.x = 0.5;
                particle.anchor.y = 0.5;
                particle.x = (Math.random() - 0.5) * 100;
                particle.y = (Math.random() - 0.5) * 100;
                particle.vx = (Math.random() - 0.5) * 4;
                particle.vy = (Math.random() - 0.5) * 4;
                particle.life = 30;
                particle.maxLife = 30;
                this._particles.push(particle);
                this._particleContainer.addChild(particle);
            }
        }
        
        refresh() {
            this.bitmap.clear();
            
            // Check if card can be afforded
            const canAfford = window.$energyManager && window.$energyManager.canAfford(this.card.energyCost);
            
            // Determine card rarity/type colors
            let frameGradient1 = '#666666';
            let frameGradient2 = '#333333';
            let bgGradient1 = '#ffffff';
            let bgGradient2 = '#e0e0e0';
            
            if (this.card.type === 'skill') {
                const skill = $dataSkills[this.card.id];
                // Color based on energy cost
                if (this.card.energyCost >= 7) {
                    // Epic skills (high energy cost)
                    frameGradient1 = '#9c27b0';
                    frameGradient2 = '#6a1b9a';
                    bgGradient1 = '#f3e5f5';
                    bgGradient2 = '#e1bee7';
                } else if (this.card.energyCost >= 4) {
                    // Rare skills
                    frameGradient1 = '#2196f3';
                    frameGradient2 = '#1565c0';
                    bgGradient1 = '#e3f2fd';
                    bgGradient2 = '#bbdefb';
                } else {
                    // Common skills
                    frameGradient1 = '#757575';
                    frameGradient2 = '#424242';
                    bgGradient1 = '#fafafa';
                    bgGradient2 = '#e0e0e0';
                }
            }
            
            if (this._selected) {
                // Golden highlight for selected
                frameGradient1 = '#ffc107';
                frameGradient2 = '#f57c00';
                bgGradient1 = '#fff8e1';
                bgGradient2 = '#ffecb3';
            }
            
            // Card shadow (multiple layers for depth)
            for (let i = 5; i > 0; i--) {
                const alpha = 0.05 * (6 - i);
                this.bitmap.fillRect(i, i, cardWidth - i, cardHeight - i, `rgba(0, 0, 0, ${alpha})`);
            }
            
            // Card background with gradient
            this.bitmap.gradientFillRect(0, 0, cardWidth, cardHeight, bgGradient1, bgGradient2, true);
            
            // Card frame with gradient
            for (let i = 0; i < 4; i++) {
                const alpha = 1 - (i * 0.2);
                this.bitmap.gradientFillRect(i, i, cardWidth - i * 2, cardHeight - i * 2, 
                    this.adjustColorAlpha(frameGradient1, alpha), 
                    this.adjustColorAlpha(frameGradient2, alpha), true);
            }
            
            // Inner card area
            this.bitmap.fillRect(6, 6, cardWidth - 12, cardHeight - 12, bgGradient1);
            
            // Card name section with ornate border
            this.bitmap.gradientFillRect(8, 8, cardWidth - 16, 40, 'rgba(0, 0, 0, 0.2)', 'rgba(0, 0, 0, 0.1)', false);
            this.bitmap.strokeRect(8, 8, cardWidth - 16, 40, frameGradient2, 1);
            
            // Card name
            this.bitmap.fontSize = 18;
            this.bitmap.fontBold = true;
            this.bitmap.outlineWidth = 3;
            this.bitmap.outlineColor = 'rgba(0, 0, 0, 0.5)';
            this.bitmap.textColor = '#ffffff';
            this.bitmap.drawText(this.card.name, 10, 14, cardWidth - 20, 30, 'center');
            
            // Decorative separator
            this.drawOrnatePattern(52, frameGradient1);
            
            // Icon section with glow effect
            const iconBgX = cardWidth / 2;
            const iconBgY = 85;
            
            // Icon glow
            for (let i = 30; i > 20; i--) {
                const alpha = 0.02 * (31 - i);
                this.bitmap.drawCircle(iconBgX, iconBgY, i, `rgba(255, 255, 255, ${alpha})`);
            }
            
            // Icon background circle
            this.bitmap.drawCircle(iconBgX, iconBgY, 28, 'rgba(0, 0, 0, 0.2)');
            this.bitmap.drawCircle(iconBgX, iconBgY, 25, 'rgba(255, 255, 255, 0.9)');
            
            // Icon
            const iconBitmap = ImageManager.loadSystem('IconSet');
            const pw = ImageManager.iconWidth;
            const ph = ImageManager.iconHeight;
            const sx = this.card.iconIndex % 16 * pw;
            const sy = Math.floor(this.card.iconIndex / 16) * ph;
            const dx = (cardWidth - pw) / 2;
            const dy = 68;
            
            iconBitmap.addLoadListener(() => {
                this.bitmap.blt(iconBitmap, sx, sy, pw, ph, dx, dy);
            });
            
            // Decorative separator
            this.drawOrnatePattern(118, frameGradient1);
            
            // Description box with inner shadow
            this.bitmap.fillRect(12, 125, cardWidth - 24, cardHeight - 140, 'rgba(0, 0, 0, 0.05)');
            this.bitmap.strokeRect(12, 125, cardWidth - 24, cardHeight - 140, 'rgba(255, 255, 255, 0.5)', 1);
            
            // Description
            this.bitmap.fontSize = 11;
            this.bitmap.fontBold = false;
            this.bitmap.outlineWidth = 2;
            this.bitmap.textColor = '#000000';
            const desc = this.card.description || '';
            const lines = this.wrapText(desc, cardWidth - 34);
            let y = 130;
            for (const line of lines) {
                if (y > cardHeight - 25) break;
                this.bitmap.drawText(line, 17, y, cardWidth - 34, 18, 'left');
                y += 18;
            }
            
            // Energy cost indicator with glow
            if (this.card.energyCost >= 0) {
                const costX = cardWidth - 25;
                const costY = 15;
                
                // Determine cost color based on affordability
                let costColor1 = canAfford ? '#00bcd4' : '#f44336';
                let costColor2 = canAfford ? '#0097a7' : '#c62828';
                let glowColor = canAfford ? 'rgba(0, 188, 212, 0.3)' : 'rgba(244, 67, 54, 0.3)';
                
                // Energy crystal glow
                for (let i = 18; i > 12; i--) {
                    const alpha = 0.05 * (19 - i);
                    this.bitmap.drawCircle(costX, costY, i, glowColor.replace('0.3', alpha.toString()));
                }
                
                // Energy crystal shape
                this.bitmap.drawCircle(costX, costY, 12, costColor2);
                this.bitmap.drawCircle(costX, costY, 10, costColor1);
                
                // Energy cost text
                this.bitmap.fontSize = 14;
                this.bitmap.fontBold = true;
                this.bitmap.textColor = '#ffffff';
                this.bitmap.outlineWidth = 2;
                this.bitmap.outlineColor = costColor2;
                this.bitmap.drawText(this.card.energyCost, costX - 12, costY - 10, 24, 20, 'center');
            }
            
            // Card type indicator
            this.bitmap.fontSize = 9;
            this.bitmap.fontBold = false;
            this.bitmap.textColor = frameGradient2;
            this.bitmap.outlineWidth = 0;
            this.bitmap.drawText('SKILL', 10, cardHeight - 20, 60, 15, 'left');
            
            // Show grayed out overlay if can't afford energy
            const actor = BattleManager.actor();
            if (actor && !canAfford) {
                this.bitmap.fillRect(0, 0, cardWidth, cardHeight, 'rgba(64, 64, 64, 0.5)');
            
            }
        }
        
        adjustColorAlpha(color, alpha) {
            if (color.startsWith('#')) {
                const r = parseInt(color.slice(1, 3), 16);
                const g = parseInt(color.slice(3, 5), 16);
                const b = parseInt(color.slice(5, 7), 16);
                return `rgba(${r}, ${g}, ${b}, ${alpha})`;
            }
            return color;
        }
        
        drawOrnatePattern(y, color) {
            const centerX = cardWidth / 2;
            const width = cardWidth - 40;
            
            // Main line
            this.bitmap.fillRect(20, y, width, 2, color);
            
            // Diamond decoration in center
            this.bitmap.drawCircle(centerX, y + 1, 4, color);
            this.bitmap.drawCircle(centerX, y + 1, 3, '#ffffff');
            
            // Side decorations
            this.bitmap.drawCircle(25, y + 1, 2, color);
            this.bitmap.drawCircle(cardWidth - 25, y + 1, 2, color);
        }
        
        wrapText(text, maxWidth) {
            const words = text.split(' ');
            const lines = [];
            let currentLine = '';
            
            for (const word of words) {
                const testLine = currentLine + (currentLine ? ' ' : '') + word;
                const testWidth = this.bitmap.measureTextWidth(testLine);
                
                if (testWidth > maxWidth && currentLine) {
                    lines.push(currentLine);
                    currentLine = word;
                } else {
                    currentLine = testLine;
                }
            }
            
            if (currentLine) {
                lines.push(currentLine);
            }
            
            return lines;
        }
        
        update() {
            super.update();
            super.update();
    
            // Update animations
            this._animationTime += 0.016;
            this._drawAnimation = Math.min(1, this._drawAnimation + 0.08); // Slightly faster draw
            this._floating += 0.015; // Slower floating for less jitter
            
            // Update particles
            for (let i = this._particles.length - 1; i >= 0; i--) {
                const particle = this._particles[i];
                particle.x += particle.vx;
                particle.y += particle.vy;
                particle.vx *= 0.98;
                particle.vy *= 0.98;
                particle.life--;
                particle.opacity = (particle.life / particle.maxLife) * 255;
                particle.scale.x = particle.scale.y = particle.life / particle.maxLife;
                
                if (particle.life <= 0) {
                    this._particleContainer.removeChild(particle);
                    this._particles.splice(i, 1);
                }
            }
            
            // Much stiffer spring physics with higher damping
            const springStrength = 0.20; // Increased for faster settling
            const damping = 0.75; // Increased damping to reduce bounce
            const velocityThreshold = 0.5; // Stop micro-movements
            
            const dx = this._targetX - this.x;
            const dy = this._targetY - this.y;
            
            // Initialize velocities if they don't exist
            this._velocityX = this._velocityX || 0;
            this._velocityY = this._velocityY || 0;
            
            // Apply spring force with damping
            this._velocityX = this._velocityX * damping + dx * springStrength;
            this._velocityY = this._velocityY * damping + dy * springStrength;
            
            // Stop micro-movements to prevent jitter
            if (Math.abs(this._velocityX) < velocityThreshold && Math.abs(dx) < 2) {
                this._velocityX = 0;
                this.x = this._targetX;
            } else {
                this.x += this._velocityX;
            }
            
            if (Math.abs(this._velocityY) < velocityThreshold && Math.abs(dy) < 2) {
                this._velocityY = 0;
                this.y = this._targetY;
            } else {
                this.y += this._velocityY;
            }
            
            // Stiffer rotation with higher damping
            const rotationDiff = this._targetRotation - this.rotation;
            this._rotationVelocity = (this._rotationVelocity || 0) * 0.7 + rotationDiff * 0.25; // Higher damping
            
            // Stop micro-rotations
            if (Math.abs(this._rotationVelocity) < 0.01 && Math.abs(rotationDiff) < 0.02) {
                this._rotationVelocity = 0;
                this.rotation = this._targetRotation;
            } else {
                this.rotation += this._rotationVelocity;
            }
            
            // Stiffer scale animation with reduced overshoot
            const scaleDiff = this._targetScale - this._currentScale;
            this._scaleVelocity = (this._scaleVelocity || 0) * 0.6 + scaleDiff * 0.35; // Higher damping
            this._currentScale += this._scaleVelocity;
            
            // Stop micro-scaling
            if (Math.abs(this._scaleVelocity) < 0.01 && Math.abs(scaleDiff) < 0.01) {
                this._scaleVelocity = 0;
                this._currentScale = this._targetScale;
            }
            
            // Apply draw animation with reduced overshoot
            const drawProgress = this._drawAnimation;
            const overshoot = 1.1; // Reduced overshoot from 1.2 to 1.1
            const drawScale = drawProgress < 0.6 // Changed threshold
                ? this._currentScale * (0.1 + 1.5 * drawProgress * overshoot) // Reduced multiplier
                : this._currentScale * (overshoot - (overshoot - 1) * (drawProgress - 0.6) * 2.5); // Adjusted for new threshold
            
            this.scale.x = drawScale;
            this.scale.y = drawScale;
            
            // More controlled floating animation for selected cards
            const actor = BattleManager.actor();
            const canAfford = window.$energyManager && window.$energyManager.canAfford(this.card.energyCost);
            
            if (this._selected) {
                // Keep selected card at exact target position - no floating or wobbling
                this.x = this._targetX;
                this.y = this._targetY;
                this.rotation = this._targetRotation;
                
          
            } 
        }
        
      
        
        setPosition(x, y, rotation = 0) {
            this._targetX = x;
            this._targetY = y;
            this._targetRotation = rotation;
            
            // Initialize velocities to prevent undefined behavior
            if (this._velocityX === undefined) this._velocityX = 0;
            if (this._velocityY === undefined) this._velocityY = 0;
            if (this._rotationVelocity === undefined) this._rotationVelocity = 0;
            if (this._scaleVelocity === undefined) this._scaleVelocity = 0;
            if (this._currentScale === undefined) this._currentScale = 1;
        }
        
        setSelected(selected) {
            const wasSelected = this._selected;
            this._selected = selected;
            this._targetScale = selected ? 1.1 : 1;
            
            // If selection changed, immediately stop any conflicting animations
            if (wasSelected !== selected) {
                this._velocityX = 0;
                this._velocityY = 0;
                this._rotationVelocity = 0;
                this._scaleVelocity = 0;
            }
            
            this.refresh();
        }
    }
    
    // Card Manager
    class CardManager {
        constructor() {
            this.deck = [];
            this.hand = [];
            this.discardPile = [];
            this.selectedIndex = 0;
        }
        
        initializeDeck() {
            this.deck = [];
            this.hand = [];
            this.discardPile = [];
            this.selectedIndex = 0;
            
            // Store original party and temporarily remove actors 2 and 3
            _originalPartyMembers = $gameParty._actors.slice();
            const actor2 = $gameParty.members()[1];
            const actor3 = $gameParty.members()[2];
            
            // Temporarily remove actors 2 and 3 from battle party
            if (actor2) {
                $gameParty.removeActor(actor2.actorId());
            }
            if (actor3) {
                $gameParty.removeActor(actor3.actorId());
            }
            
            // Clear previous skill selections
            _actor2Skills = [];
            _actor3Skills = [];
            
            // Check if we have a custom deck configuration from deck builder
            const customDeck = $dataSystem.deckBuilder;
            
            if (customDeck && customDeck.length > 0) {
                // Use custom deck from deck builder
                for (const cardConfig of customDeck) {
                    for (let i = 0; i < cardConfig.count; i++) {
                        const skill = $dataSkills[cardConfig.skillId];
                        if (skill) {
                            this.deck.push(new Card('skill', cardConfig.skillId, skill));
                        }
                    }
                }
            }
            
            // If no custom deck OR custom deck has less than 40 cards, fill with basic attack (skill 1)
            while (this.deck.length < 40) {
                const basicAttack = $dataSkills[1];
                if (basicAttack) {
                    this.deck.push(new Card('skill', 1, basicAttack));
                } else {
                    break; // Prevent infinite loop if basic attack doesn't exist
                }
            }
            
            // Update global deck count
            window.$deckCount = this.deck.length;
            
            // Shuffle deck
            this.shuffleDeck();
            
            // Draw initial hand with guaranteed low-cost card
            this.drawInitialHand();
        }

        getAllSkillsForActor(actor) {
            const skills = [];
            
            // Add class learnings
            const actorClass = $dataClasses[actor._classId];
            if (actorClass && actorClass.learnings) {
                for (const learning of actorClass.learnings) {
                    const skill = $dataSkills[learning.skillId];
                    if (skill && this.isSkillUsableInBattle(skill)) {
                        skills.push(skill);
                    }
                }
            }
            
            // Add already learned skills
            for (const skillId of actor._skills) {
                const skill = $dataSkills[skillId];
                if (skill && this.isSkillUsableInBattle(skill) && 
                    !skills.some(s => s.id === skillId)) {
                    skills.push(skill);
                }
            }
            
            return skills;
        }
        
        selectRandomSkills(skillArray, count) {
            if (skillArray.length === 0) return [];
            
            const selected = [];
            const available = skillArray.slice(); // Copy array
            
            for (let i = 0; i < count && available.length > 0; i++) {
                const randomIndex = Math.floor(Math.random() * available.length);
                selected.push(available[randomIndex]);
                available.splice(randomIndex, 1);
            }
            
            // If we need more skills but don't have enough unique ones, repeat
            while (selected.length < count && skillArray.length > 0) {
                const randomSkill = skillArray[Math.floor(Math.random() * skillArray.length)];
                selected.push(randomSkill);
            }
            
            return selected;
        }
        isSkillUsableInBattle(skill) {
            if (!skill) return false;
    
            // Filter out never usable and menu-only skills
            if (skill.occasion === 3) return false; // Never usable
            if (skill.occasion === 2) return false; // Menu only
            
            // Allow skills that are usable in battle (occasion 0 = always, occasion 1 = battle only)
            return skill.occasion === 0 || skill.occasion === 1;
        }
        drawInitialHand() {
            // First, try to find and guarantee at least one low-cost card (0-1 energy)
            const lowCostCards = [];
            const otherCards = [];
            
            // Separate deck into low-cost and other cards
            for (let i = 0; i < this.deck.length; i++) {
                const card = this.deck[i];
                if (card.energyCost <= 1) {
                    lowCostCards.push({card: card, index: i});
                } else {
                    otherCards.push({card: card, index: i});
                }
            }
            
            // Ensure we have at least one low-cost card
            if (lowCostCards.length === 0) {
                // If no low-cost cards exist, create a basic attack card
                const basicAttack = $dataSkills[1];
                if (basicAttack) {
                    const basicCard = new Card('skill', 1, basicAttack);
                    // Force energy cost to 1 if it's higher
                    if (basicCard.energyCost > 1) {
                        basicCard.energyCost = 1;
                    }
                    this.deck.unshift(basicCard); // Add to front of deck
                    lowCostCards.push({card: basicCard, index: 0});
                }
            }
            
            // Draw one guaranteed low-cost card first
            if (lowCostCards.length > 0) {
                const randomLowCost = lowCostCards[Math.floor(Math.random() * lowCostCards.length)];
                this.hand.push(randomLowCost.card);
                this.deck.splice(randomLowCost.index, 1);
                
                // Update indices for remaining cards after removal
                for (let i = 0; i < otherCards.length; i++) {
                    if (otherCards[i].index > randomLowCost.index) {
                        otherCards[i].index--;
                    }
                }
                for (let i = 0; i < lowCostCards.length; i++) {
                    if (lowCostCards[i].index > randomLowCost.index) {
                        lowCostCards[i].index--;
                    }
                }
            }
            
            // Draw the remaining 2 cards normally
            this.drawCards(2);
            
            // Verify we have at least one playable card (just in case)
            let hasPlayableCard = false;
            for (const card of this.hand) {
                if (card.energyCost <= 1) {
                    hasPlayableCard = true;
                    break;
                }
            }
            
            // If somehow we still don't have a playable card, force one
            if (!hasPlayableCard && this.hand.length > 0) {
                // Replace the highest cost card with a basic attack
                let highestCostIndex = 0;
                let highestCost = this.hand[0].energyCost;
                
                for (let i = 1; i < this.hand.length; i++) {
                    if (this.hand[i].energyCost > highestCost) {
                        highestCost = this.hand[i].energyCost;
                        highestCostIndex = i;
                    }
                }
                
                // Replace with basic attack
                const basicAttack = $dataSkills[1];
                if (basicAttack) {
                    const basicCard = new Card('skill', 1, basicAttack);
                    basicCard.energyCost = 1;
                    
                    // Put the replaced card back in deck
                    this.deck.push(this.hand[highestCostIndex]);
                    this.hand[highestCostIndex] = basicCard;
                    
                    // Reshuffle deck
                    this.shuffleDeck();
                }
            }
        }
        
        shuffleDeck() {
            for (let i = this.deck.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [this.deck[i], this.deck[j]] = [this.deck[j], this.deck[i]];
            }
        }
        
        drawCards(count) {
            for (let i = 0; i < count; i++) {
                if (this.deck.length === 0) {
                    // Reshuffle discard pile into deck
                    this.deck = this.discardPile;
                    this.discardPile = [];
                    this.shuffleDeck();
                }
                
                if (this.deck.length > 0 && this.hand.length < 5) {
                    this.hand.push(this.deck.pop());
                    // Update global deck count
                    window.$deckCount = this.deck.length;
                }
            }
        }
        
        playCard(index) {
            if (index >= 0 && index < this.hand.length) {
                const card = this.hand[index];
                this.hand.splice(index, 1);
                this.discardPile.push(card);
                
                if (this.selectedIndex >= this.hand.length) {
                    this.selectedIndex = Math.max(0, this.hand.length - 1);
                }
                
                // Global deck count doesn't change when playing cards (they go to discard)
                // But update it anyway for consistency
                window.$deckCount = this.deck.length;
                
                return card;
            }
            return null;
        }
        
        getCurrentCard() {
            return this.hand[this.selectedIndex] || null;
        }
        initializeCustomDeck(){
            this.deck = [];
            this.hand = [];
            this.discardPile = [];
            this.selectedIndex = 0;
            
            // Store original party and remove actors 2 and 3 for battle
            _originalPartyMembers = $gameParty._actors.slice();
            const actor2 = $gameParty.members()[1];
            const actor3 = $gameParty.members()[2];
            
            if (actor2) {
                $gameParty.removeActor(actor2.actorId());
            }
            if (actor3) {
                $gameParty.removeActor(actor3.actorId());
            }
            
            // Load custom deck from game variables
            const customDeck = $gameSystem.deckBuilderData || this.getDefaultDeck();
            
            // Create cards from custom deck configuration
            for (const cardConfig of customDeck) {
                for (let i = 0; i < cardConfig.count; i++) {
                    const skill = $dataSkills[cardConfig.skillId];
                    if (skill) {
                        this.deck.push(new Card('skill', cardConfig.skillId, skill));
                    }
                }
            }
            
            // Ensure we have exactly 40 cards
            while (this.deck.length < 40) {
                const basicAttack = $dataSkills[1];
                if (basicAttack) {
                    this.deck.push(new Card('skill', 1, basicAttack));
                }
            }
            
            this.shuffleDeck();
            this.drawInitialHand();
        }
        getDefaultDeck () {
            const defaultDeck = [];
            const actor1 = $gameParty.members()[0];
            
            if (actor1) {
                const actor1Skills = this.getAllSkillsForActor(actor1);
                for (const skill of actor1Skills) {
                    defaultDeck.push({
                        skillId: skill.id,
                        count: 3,
                        learnedBy: [actor1.actorId()]
                    });
                }
            }
            
            // Fill remaining slots with basic attack
            const basicAttackCount = Math.max(0, 40 - (defaultDeck.length * 3));
            if (basicAttackCount > 0) {
                defaultDeck.push({
                    skillId: 1,
                    count: basicAttackCount,
                    learnedBy: [1] // Assuming actor 1 is ID 1
                });
            }
            
            return defaultDeck;       
        }
        selectNext() {
            if (this.hand.length > 0) {
                this.selectedIndex = (this.selectedIndex + 1) % this.hand.length;
            }
        }
        
        selectPrevious() {
            if (this.hand.length > 0) {
                this.selectedIndex = (this.selectedIndex - 1 + this.hand.length) % this.hand.length;
            }
        }
    }
    
    // Store managers globally for scene access
    window.$cardManager = null;
    window.$deckCount = 0;
    window.$energyManager = null;
    function restoreOriginalParty() {
        if (_originalPartyMembers.length > 0) {
            // Restore original party members
            $gameParty._actors = _originalPartyMembers.slice();
            
            // Give experience to actors 2 and 3 if they were in the original party
            const exp = BattleManager._rewards ? BattleManager._rewards.exp : 0;
            if (exp > 0) {
                const actor2 = $gameParty.members()[1];
                const actor3 = $gameParty.members()[2];
                
                if (actor2) {
                    actor2.gainExp(exp);
                }
                if (actor3) {
                    actor3.gainExp(exp);
                }
            }
            
            // Clear stored data
            _originalPartyMembers = [];
            _actor2Skills = [];
            _actor3Skills = [];
        }
    }
    
    // Battle Scene modifications
    const _Scene_Battle_create = Scene_Battle.prototype.create;
    Scene_Battle.prototype.create = function() {
        _Scene_Battle_create.call(this);
        
        if ($gameSwitches.value(45)) {
            window.$cardManager = new CardManager();
            window.$energyManager = new EnergyManager();
            this._cardSprites = [];
            this.createCardDisplay();
        }
    };
    
    const _Scene_Battle_start = Scene_Battle.prototype.start;
    Scene_Battle.prototype.start = function() {
        _Scene_Battle_start.call(this);
        
        if ($gameSwitches.value(45) && window.$cardManager && window.$energyManager) {
            window.$cardManager.initializeDeck();
            window.$energyManager.reset();
            this.refreshCardDisplay();
        }
    };
    
// Modify the Scene_Battle terminate method (replace the existing one)
const _Scene_Battle_terminate = Scene_Battle.prototype.terminate;
Scene_Battle.prototype.terminate = function() {
    // Restore party before terminating if card system was active
    if ($gameSwitches.value(45)) {
        restoreOriginalParty();
    }
    
    _Scene_Battle_terminate.call(this);
    window.$cardManager = null;
    window.$energyManager = null;
};
const _BattleManager_makeRewards = BattleManager.makeRewards;
BattleManager.makeRewards = function() {
    _BattleManager_makeRewards.call(this);
    
    // If card system is active, ensure actors 2 and 3 get experience
    if ($gameSwitches.value(45) && _originalPartyMembers.length > 1) {
        const exp = this._rewards.exp;
        
        // Temporarily restore party to give experience
        const currentParty = $gameParty._actors.slice();
        $gameParty._actors = _originalPartyMembers.slice();
        
        // Give experience to all original party members
        for (const member of $gameParty.allMembers()) {
            if (member) {
                member.gainExp(exp);
            }
        }
        
        // Restore the modified party for display purposes
        $gameParty._actors = currentParty;
    }
};
    // Hook into turn start to refresh energy
// Hook into turn start to refresh energy and draw a card
// Hook into turn start to refresh energy and draw a card
const _BattleManager_startTurn = BattleManager.startTurn;
BattleManager.startTurn = function() {
    _BattleManager_startTurn.call(this);

    if ($gameSwitches.value(45) && window.$energyManager && this._subject && this._subject.isActor()) {
        // Player's turn starts
        window.$energyManager.startTurn();

        const scene = SceneManager._scene;
        if (scene instanceof Scene_Battle) {
            const oldHandSize = window.$cardManager.hand.length;
            window.$cardManager.drawCards(1); // Draw one card at the start of the turn
            const newHandSize = window.$cardManager.hand.length;

            // Animate the new card entering the hand
            if (newHandSize > oldHandSize) {
                if (oldHandSize === 0) {
                    scene.refreshCardDisplay();
                } else {
                    scene.showDrawCardEffect();
                }
            } else {
                 // If no card was drawn, still refresh the energy display
                scene.refreshEnergyDisplay();
            }
        }
    }
};
Scene_Battle.prototype.createCardDisplay = function() {
    // Create health display (now first, 2x wider)
    this._healthSprite = new Sprite();
    this._healthSprite.bitmap = new Bitmap(240, 80); // 2x wider (was 120)
    this._healthSprite.x = deckX;
    this._healthSprite.y = deckY; // Health goes to top position
    this._healthSprite.z = -10;
    this._spriteset.addChild(this._healthSprite);

    // Create energy display (now second, moved down)
    this._energySprite = new Sprite();
    this._energySprite.bitmap = new Bitmap(120, 80);
    this._energySprite.x = deckX;
    this._energySprite.y = deckY + 90; // Energy in middle
    this._energySprite.z = -10;
    this._spriteset.addChild(this._energySprite);
            
    // Create hand container
    this._handContainer = new Sprite();
    this._handContainer.y = handY;
    this._handContainer.z = -10;
    this._spriteset.addChild(this._handContainer);
};


    
    Scene_Battle.prototype.refreshCardDisplay = function() {
        if (!window.$cardManager || !window.$energyManager) return;
    
        // Update global deck count
        window.$deckCount = window.$cardManager.deck.length;
        
        
        // Update energy display
        this.refreshEnergyDisplay();
        
        // Clear existing card sprites
        for (const sprite of this._cardSprites) {
            this._handContainer.removeChild(sprite);
        }
        this._cardSprites = [];
        
        // Create card sprites for hand
        const cardCount = window.$cardManager.hand.length;
        
        for (let i = 0; i < cardCount; i++) {
            const card = window.$cardManager.hand[i];
            const isSelected = i === window.$cardManager.selectedIndex;
            
            // Create card sprite
            const sprite = new Sprite_Card(card, i, isSelected);
            
            // Position the card properly from the start
            this.positionCard(sprite, i, cardCount, isSelected);
            
            // Set initial position immediately (no animation for refresh)
            sprite.x = sprite._targetX;
            sprite.y = sprite._targetY;
            sprite.rotation = sprite._targetRotation;
            
            this._handContainer.addChild(sprite);
            this._cardSprites.push(sprite);
        }
        
        // Sort sprites by z-order
        this._handContainer.children.sort((a, b) => (a.z || 0) - (b.z || 0));
        };
        Scene_Battle.prototype.positionCard = function(sprite, index, cardCount, isSelected) {
            const centerX = Graphics.width / 2 - 100; // Moved 100 pixels to the left
            const baseY = 0;
            const cardSpacing = 140;
            const fanAngle = 20;
            const arcHeight = 40;
            
            let normalizedPos, x, y, rotation;
            
            if (cardCount === 1) {
                normalizedPos = 0;
                x = centerX;
                y = isSelected ? baseY - 40 : baseY;
                rotation = 0;
            } else {
                normalizedPos = (index / (cardCount - 1)) - 0.5;
                
                x = centerX + normalizedPos * cardSpacing * Math.min(cardCount / 1.5, 2.5);
                
                if (isSelected) {
                    y = baseY - 40;
                } else {
                    const arcProgress = Math.abs(normalizedPos) * 2;
                    y = baseY + arcHeight * arcProgress;
                }
                
                if (isSelected) {
                    rotation = 0;
                } else {
                    rotation = normalizedPos * fanAngle * Math.PI / 180;
                }
            }
            
            sprite.setPosition(x, y, rotation);
            
            if (isSelected) {
                sprite.z = 1000;
            } else {
                sprite.z = 100 - Math.abs(normalizedPos) * 50;
            }
        };
        
    
    Scene_Battle.prototype.updateCardSelection = function() {
        if (!window.$cardManager || !$gameSwitches.value(45)) return;
        
        const cardCount = window.$cardManager.hand.length;
        
        // Update card positions and selection
        for (let i = 0; i < this._cardSprites.length; i++) {
            const isSelected = i === window.$cardManager.selectedIndex;
            const sprite = this._cardSprites[i];
            
            sprite.setSelected(isSelected);
            
            // Recalculate position using the same logic as positionCard
            this.positionCard(sprite, i, cardCount, isSelected);
        }
        
        // Re-sort for z-order changes
        this._handContainer.children.sort((a, b) => (a.z || 0) - (b.z || 0));
        
        // Refresh energy display in case energy costs changed
        this.refreshEnergyDisplay();
    };
    
Scene_Battle.prototype.refreshEnergyDisplay = function() {
    if (!window.$energyManager) return;
    
    // Update energy display
    this._energySprite.bitmap.clear();
    this._energySprite.bitmap.fontSize = 18;
    
    // Always blue colors for energy
    const energyColor1 = '#00bcd4'; // Cyan
    const energyColor2 = '#0097a7';
    
    this._energySprite.bitmap.gradientFillRect(0, 0, 120, 80, energyColor1, energyColor2, true);
    this._energySprite.bitmap.strokeRect(0, 0, 120, 80, energyColor2, 3);
    
    // Energy orb glow effect
    for (let i = 60; i > 40; i -= 2) {
        const alpha = 0.02 * (61 - i);
        this._energySprite.bitmap.drawCircle(60, 40, i, `rgba(255, 255, 255, ${alpha})`);
    }
    
    this._energySprite.bitmap.textColor = '#ffffff';
    this._energySprite.bitmap.fontBold = true;
    this._energySprite.bitmap.outlineWidth = 2;
    this._energySprite.bitmap.outlineColor = '#000000';
    
    // Only current energy display (no header, no maximum)
    this._energySprite.bitmap.fontSize = 36; // Large font for the number
    const energyText = `${window.$energyManager.currentEnergy}`;
    this._energySprite.bitmap.drawText(energyText, 0, 20, 120, 40, 'center');
    
    // Remove the crystal visualization entirely - no more dots/crystals
};
Scene_Battle.prototype.isPointInBounds = function(x, y, bounds) {
    return x >= bounds.left && x <= bounds.right && 
           y >= bounds.top && y <= bounds.bottom;
};
Scene_Battle.prototype.getCardBounds = function(sprite) {
    const scale = sprite.scale.x || 1;
    const width = cardWidth * scale;
    const height = cardHeight * scale;
    
    // Get world position of the sprite
    const worldX = sprite.x + this._handContainer.x;
    const worldY = sprite.y + this._handContainer.y;
    
    return {
        left: worldX - width / 2,
        right: worldX + width / 2,
        top: worldY - height / 2,
        bottom: worldY + height / 2
    };
};
// Replace the existing updateCardHover method
Scene_Battle.prototype.updateCardHover = function() {
    if (!this._cardSprites || this._cardSprites.length === 0) return;
    
    const mouseX = TouchInput.x;
    const mouseY = TouchInput.y;
    let hoveredCardIndex = -1;
    
    // Check each card sprite for mouse hover
    for (let i = 0; i < this._cardSprites.length; i++) {
        const sprite = this._cardSprites[i];
        if (!sprite) continue;
        
        const cardBounds = this.getCardBounds(sprite);
        
        if (this.isPointInBounds(mouseX, mouseY, cardBounds)) {
            hoveredCardIndex = i;
            break;
        }
    }
    
    // Update selection if a different card is hovered
    if (hoveredCardIndex !== -1 && hoveredCardIndex !== window.$cardManager.selectedIndex) {
        window.$cardManager.selectedIndex = hoveredCardIndex;
        this.updateCardSelection();
    }
    
    // Handle mouse click to play card
    if (TouchInput.isTriggered() && hoveredCardIndex !== -1) {
        const card = window.$cardManager.hand[hoveredCardIndex];
        const actor = BattleManager.actor();
        
        if (card && actor && card.canUse(actor) && window.$energyManager.canAfford(card.energyCost)) {
            // Set the selected card and play it
            window.$cardManager.selectedIndex = hoveredCardIndex;
            this.updateCardSelection();
            
            // Small delay to show selection, then play the card
            setTimeout(() => {
                this.commandAttack();
            }, 100);
        } else if (hoveredCardIndex !== -1) {
            // Card can't be played - show feedback
            SoundManager.playBuzzer();
        }
    }
};
// Updated Scene_Battle.prototype.update with mouse hover detection

// Updated Scene_Battle.prototype.update with mouse hover detection
const _Scene_Battle_update = Scene_Battle.prototype.update;
Scene_Battle.prototype.update = function() {
    _Scene_Battle_update.call(this);
    
    // Update card system controls
    if ($gameSwitches.value(45) && window.$cardManager && this._actorCommandWindow && this._actorCommandWindow.active) {
        // Handle keyboard input for card selection
        if (Input.isTriggered('left') || Input.isTriggered('pageup')) {
            window.$cardManager.selectPrevious();
            this.updateCardSelection();
            SoundManager.playCursor();
        } else if (Input.isTriggered('right') || Input.isTriggered('pagedown')) {
            window.$cardManager.selectNext();
            this.updateCardSelection();
            SoundManager.playCursor();
        }
        
        // Handle scroll wheel input for card cycling
        if (this._prevWheelY === undefined) {
            this._prevWheelY = TouchInput.wheelY;
        }
        
        if (TouchInput.wheelY !== this._prevWheelY) {
            const wheelDelta = TouchInput.wheelY - this._prevWheelY;
            
            if (wheelDelta > 0) {
                window.$cardManager.selectNext();
                this.updateCardSelection();
                SoundManager.playCursor();
            } else if (wheelDelta < 0) {
                window.$cardManager.selectPrevious();
                this.updateCardSelection();
                SoundManager.playCursor();
            }
            
            this._prevWheelY = TouchInput.wheelY;
        }
        
        // Handle mouse hover and clicking for card selection and playing
        this.updateCardHover();
    }
};

    
    // Override actor command selection when card system is active
    const _Scene_Battle_commandAttack = Scene_Battle.prototype.commandAttack;
    
    // PASTE THIS CODE to replace the old commandAttack function

Scene_Battle.prototype.commandAttack = function() {
    if ($gameSwitches.value(45) && window.$cardManager && window.$energyManager) {
        const card = window.$cardManager.getCurrentCard();
        const actor = BattleManager.actor();

        // --- 1. Validation Checks ---
        if (!card) {
            SoundManager.playBuzzer();
            return; // Do nothing if no card is selected.
        }

        if (!actor) {
            console.error("RoguelikeCardSystem Error: No active actor to use a card.");
            SoundManager.playBuzzer();
            return;
        }

        if (!card.canUse(actor)) {
            SoundManager.playBuzzer();

            return; // Exit if the card is not usable for any reason.
        }

        // --- 2. Action Setup & Automated Targeting ---
        this._pendingCard = card;
        const action = card.createAction(actor);

        if (!action || !action.item()) {
            console.error(`RoguelikeCardSystem Error: Failed to create a valid action for card ${card.name}`);
            this._pendingCard = null;
            return;
        }

        // Automatically target the first (and only) enemy if needed.
        if (card.needsTarget()) {
            const targetIndex = 0; // Index for the first enemy.
            action.setTarget(targetIndex);
        }

        actor.setAction(0, action);

        // Set last skill used for animations.
        if (card.type === 'skill') {
            actor.setLastBattleSkill($dataSkills[card.id]);
        }
        
        // --- 3. Execute Card & End Turn ---
        // This helper function will now reliably spend energy and remove the card.
        this.executeCard();

    } else {
        // Fallback to the original method if the card system isn't active.
        _Scene_Battle_commandAttack.call(this);
    }
};
    

// Updated executeCard method - now draws a card and adds energy after playing
Scene_Battle.prototype.executeCard = function() {
    if (this._pendingCard && window.$cardManager && window.$energyManager) {
        const actor = BattleManager.actor();
        
        // Double-check energy before spending
        if (!window.$energyManager.canAfford(this._pendingCard.energyCost)) {
            SoundManager.playBuzzer();
            this._pendingCard = null;
            return;
        }
        
        // Store current MP/TP before action
        const originalMp = actor._mp;
        const originalTp = actor._tp;
        
        // Verify the action is properly set
        const currentAction = actor.currentAction();
        if (!currentAction || !currentAction._item) {
            console.log("Warning: No valid action set for card execution");
            // Try to recreate the action
            const action = this._pendingCard.createAction(actor);
            actor.setAction(0, action);
        }
        
        // Spend energy AFTER confirming action is valid
        if (window.$energyManager.spendEnergy(this._pendingCard.energyCost)) {
            // Remove the card from hand
            const cardToPlay = window.$cardManager.playCard(window.$cardManager.selectedIndex);
            if (cardToPlay) {
                // Immediately refresh display to show proper positioning
                this.refreshCardDisplay();
                //SoundManager.playMagicEvasion();
                
                // Schedule MP/TP restoration for after the action executes
                // This ensures any MP/TP costs are immediately restored
                setTimeout(() => {
                    if (actor && actor._mp !== undefined && actor._tp !== undefined) {
                        actor._mp = originalMp;
                        actor._tp = originalTp;
                    }
                }, 1);
                
                // Log for debugging
                console.log(`Used card: ${cardToPlay.name}, Energy cost: ${cardToPlay.energyCost}`);
            }
        } else {
            console.log("Failed to spend energy for card");
            SoundManager.playBuzzer();
        }
        
        this._pendingCard = null;
    }
    
    // Proceed with the next command
    this.selectNextCommand();
};


// New method to update card affordability shading
Scene_Battle.prototype.updateCardAffordability = function() {
    if (!window.$cardManager || !window.$energyManager || !this._cardSprites) return;
    
    // Refresh each card sprite to update shading based on current energy
    for (const cardSprite of this._cardSprites) {
        if (cardSprite && cardSprite.card) {
            cardSprite.refresh(); // This will redraw the card with proper shading
        }
    }
};
// Pass Turn command
Scene_Battle.prototype.commandPassTurn = function() {
    if ($gameSwitches.value(45) && window.$cardManager && window.$energyManager) {
        const actor = BattleManager.actor();

        // Give the player 2 energy for passing the turn
        window.$energyManager.addEnergy(2);

        // Draw a card from the deck
        const oldHandSize = window.$cardManager.hand.length;
        window.$cardManager.drawCards(1);
        const newHandSize = window.$cardManager.hand.length;

        // Animate the new card if one was drawn
        if (newHandSize > oldHandSize) {
            this.showDrawCardEffect();
        }


        // Set up a guard action for passing the turn
        const action = new Game_Action(actor);
        action.setGuard();
        actor.setAction(0, action);

        // Refresh the energy display to show the new total
        this.refreshEnergyDisplay();

        // End the actor's turn
        this.selectNextCommand();
    }
};
    Scene_Battle.prototype.repositionRemainingCards = function(removedIndex) {
    // Remove the used card sprite from the array
    const removedSprite = this._cardSprites[removedIndex];
    this._cardSprites.splice(removedIndex, 1);
    
    // Update card count and selection
    const cardCount = window.$cardManager.hand.length;
    
    // Smoothly reposition remaining cards
    for (let i = 0; i < this._cardSprites.length; i++) {
        const sprite = this._cardSprites[i];
        const isSelected = i === window.$cardManager.selectedIndex;
        
        // Update the sprite's card reference and selection state
        sprite.card = window.$cardManager.hand[i];
        sprite.index = i;
        sprite.setSelected(isSelected);
        
        // Smoothly animate to new position
        this.positionCard(sprite, i, cardCount, isSelected);
    }
    
    // Re-sort sprites by z-order for proper layering
    this._handContainer.children.sort((a, b) => (a.z || 0) - (b.z || 0));
    
    // Update energy display to reflect spent energy
    this.refreshEnergyDisplay();
};
Scene_Battle.prototype.showDrawCardEffect = function() {
    if (!window.$cardManager || this._cardSprites.length === 0) return;
    
    const newCardIndex = window.$cardManager.hand.length - 1;
    const newCard = window.$cardManager.hand[newCardIndex];
    
    if (!newCard) return;
    
    // Create sprite for the new card
    const newCardSprite = new Sprite_Card(newCard, newCardIndex, false);
    
    // Position the new card off-screen to the right
    const startX = Graphics.width + cardWidth;
    const cardCount = window.$cardManager.hand.length;
    
    // Calculate final position using the same logic as positionCard
    const centerX = Graphics.width / 2;
    const cardSpacing = 80;
    const normalizedPos = cardCount > 1 ? ((newCardIndex / (cardCount - 1)) - 0.5) : 0;
    const finalX = cardCount === 1 ? centerX : centerX + normalizedPos * cardSpacing * Math.min(cardCount / 2, 2);
    const finalY = 0; // Base Y position for non-selected cards
    
    // Set initial position (off-screen)
    newCardSprite.x = startX;
    newCardSprite.y = finalY;
    newCardSprite.rotation = 0;
    newCardSprite._targetX = startX;
    newCardSprite._targetY = finalY;
    newCardSprite._targetRotation = 0;
    
    // Add to hand container and sprite array
    this._handContainer.addChild(newCardSprite);
    this._cardSprites.push(newCardSprite);
    
    // Reposition existing cards to make room (without recreating them)
    for (let i = 0; i < this._cardSprites.length - 1; i++) {
        const sprite = this._cardSprites[i];
        const isSelected = i === window.$cardManager.selectedIndex;
        
        // Update the sprite's index
        sprite.index = i;
        
        // Recalculate position for existing cards
        this.positionCard(sprite, i, cardCount, isSelected);
    }
    
    // Animate the new card sliding in
    const slideAnimation = () => {
        const slideSpeed = 40; // Pixels per frame
        const targetX = finalX;
        
        if (newCardSprite.x > targetX + slideSpeed) {
            newCardSprite.x -= slideSpeed;
            newCardSprite._targetX = newCardSprite.x;
            requestAnimationFrame(slideAnimation);
        } else {
            // Snap to final position and set up normal positioning
            newCardSprite.x = targetX;
            newCardSprite._targetX = targetX;
            newCardSprite._targetY = finalY;
            
            // Apply final fan rotation if there are multiple cards
            if (cardCount > 1) {
                const fanAngle = 15;
                const finalRotation = normalizedPos * fanAngle * Math.PI / 180;
                newCardSprite.setPosition(finalX, finalY, finalRotation);
            }
            
            // Ensure the card is properly selectable
            newCardSprite.card = newCard;
            newCardSprite.index = newCardIndex;
            
            // Create draw particles for visual effect
            newCardSprite.createDrawParticles();
            
            // Re-sort sprites by z-order
            this._handContainer.children.sort((a, b) => (a.z || 0) - (b.z || 0));
        }
    };
    
    // Start the slide animation
    requestAnimationFrame(slideAnimation);
    
    // Update energy display
    this.refreshEnergyDisplay();
};

    function Scene_DeckBuilder() {
        this.initialize(...arguments);
    }
    function getMaxCopiesForEnergyCost(energyCost) {
        // Maximum cost skills (10 energy) = 1 copy
        // Cost 1 cards = 6 copies
        // Linear interpolation between these points
        if (energyCost <= 1) return 6;
        if (energyCost >= 10) return 1;
        
        // Linear scale: y = mx + b
        // At x=1, y=6; At x=10, y=1
        // m = (1-6)/(10-1) = -5/9
        // b = 6 - (-5/9)*1 = 6 + 5/9 = 59/9
        return Math.max(1, Math.floor(6 - (5/9) * (energyCost - 1)));
    }
    
    // Helper function to calculate energy cost (same logic as Card class)
    function calculateSkillEnergyCost(skillId) {
        const skill = $dataSkills[skillId];
        if (!skill) return 0;
        
        let cost = Math.floor((skill.mpCost + skill.tpCost) / 10);
        return Math.min(10, Math.max(0, cost));
    }
    
    Scene_DeckBuilder.prototype = Object.create(Scene_MenuBase.prototype);
    Scene_DeckBuilder.prototype.constructor = Scene_DeckBuilder;
    
Scene_DeckBuilder.prototype.initialize = function() {
    Scene_MenuBase.prototype.initialize.call(this);
    this._availableSkills = [];
    this._currentDeck = [];
    this._selectedSkillIndex = 0;
    this.loadAvailableSkills();
    this.loadCurrentDeck();
    
    // Check if this is the first time opening deck builder after switch activation
    const switchActivationId = $gameSwitches.value(45) ? 'switch45_active' : 'switch45_inactive';
    const hasAutoRandomized = $dataSystem.deckBuilderAutoRandomized || {};
    
    if (this._currentDeck.length === 0 && !hasAutoRandomized[switchActivationId]) {
        // Mark as auto-randomized for this switch state
        if (!$dataSystem.deckBuilderAutoRandomized) {
            $dataSystem.deckBuilderAutoRandomized = {};
        }
        $dataSystem.deckBuilderAutoRandomized[switchActivationId] = true;
        
        // Set flag to auto-randomize after create
        this._shouldAutoRandomize = true;
    }
};
    
Scene_DeckBuilder.prototype.create = function() {
    Scene_MenuBase.prototype.create.call(this);
    this.createWindows();
    
    // Auto-randomize if needed
    if (this._shouldAutoRandomize) {
        this._shouldAutoRandomize = false;
        // Delay randomization by one frame to ensure windows are fully created
        setTimeout(() => {
            this.onRandomizeDeck();
        }, 1);
    }
};    
    Scene_DeckBuilder.prototype.createWindows = function() {
        this.createHelpWindow();
        this.createSkillListWindow();
        this.createDeckWindow();
        this.createCommandWindow();
        this.createQuantityWindow();
    };
    
    Scene_DeckBuilder.prototype.createHelpWindow = function() {
        const rect = this.helpWindowRect();
        this._helpWindow = new Window_Help(rect);
        this._helpWindow.setText("Build your deck! High-cost skills limited to fewer copies. Energy cost affects max copies.");
        this.addWindow(this._helpWindow);
    };
    
    
    Scene_DeckBuilder.prototype.createSkillListWindow = function() {
        const rect = this.skillListWindowRect();
        this._skillListWindow = new Window_DeckBuilderSkillList(rect);
        this._skillListWindow.setHandler('ok', this.onSkillOk.bind(this));
        this._skillListWindow.setHandler('cancel', this.onSkillCancel.bind(this));
        this._skillListWindow.setAvailableSkills(this._availableSkills);
        this._skillListWindow.setCurrentDeck(this._currentDeck);
        this._skillListWindow.activate();
        this._skillListWindow.select(0);
        this.addWindow(this._skillListWindow);
    };
    
    Scene_DeckBuilder.prototype.createDeckWindow = function() {
        const rect = this.deckWindowRect();
        this._deckWindow = new Window_DeckBuilderDeck(rect);
        this._deckWindow.setCurrentDeck(this._currentDeck);
        this.addWindow(this._deckWindow);
    };
    Scene_DeckBuilder.prototype.onExit = function() {
        // Auto-save deck configuration regardless of card count
        if (!$dataSystem.deckBuilder) {
            $dataSystem.deckBuilder = [];
        }
        $dataSystem.deckBuilder = JSON.parse(JSON.stringify(this._currentDeck));
        
        // Auto-save the game
        SoundManager.playSave();
        
        // Exit the scene
        this.popScene();
    };
    
    Scene_DeckBuilder.prototype.createCommandWindow = function() {
        const rect = this.commandWindowRect();
        this._commandWindow = new Window_DeckBuilderCommand(rect);
        this._commandWindow.setHandler('randomize', this.onRandomizeDeck.bind(this));
        this._commandWindow.setHandler('reset', this.onResetDeck.bind(this));
        this._commandWindow.setHandler('cancel', this.onExit.bind(this));
        this.addWindow(this._commandWindow);
    };
    
    Scene_DeckBuilder.prototype.createQuantityWindow = function() {
        const rect = this.quantityWindowRect();
        this._quantityWindow = new Window_DeckBuilderQuantity(rect);
        this._quantityWindow.setHandler('ok', this.onQuantityOk.bind(this));
        this._quantityWindow.setHandler('cancel', this.onQuantityCancel.bind(this));
        this._quantityWindow.hide();
        this._quantityWindow.deactivate();
        this.addWindow(this._quantityWindow);
    };
    
    Scene_DeckBuilder.prototype.helpWindowRect = function() {
        return new Rectangle(0, 0, Graphics.boxWidth, this.calcWindowHeight(2, false));
    };
    
    Scene_DeckBuilder.prototype.skillListWindowRect = function() {
        const wy = this.helpWindowRect().height;
        const ww = Math.floor(Graphics.boxWidth * 0.6);
        const wh = Graphics.boxHeight - wy - this.calcWindowHeight(1, false);
        return new Rectangle(0, wy, ww, wh);
    };
    
    Scene_DeckBuilder.prototype.deckWindowRect = function() {
        const skillRect = this.skillListWindowRect();
        const wx = skillRect.width;
        const wy = skillRect.y;
        const ww = Graphics.boxWidth - skillRect.width;
        const wh = skillRect.height;
        return new Rectangle(wx, wy, ww, wh);
    };
    
    Scene_DeckBuilder.prototype.commandWindowRect = function() {
        const wy = Graphics.boxHeight - this.calcWindowHeight(1, false);
        return new Rectangle(0, wy, Graphics.boxWidth, this.calcWindowHeight(1, false));
    };
    
    Scene_DeckBuilder.prototype.quantityWindowRect = function() {
        const width = 200;
        const height = this.calcWindowHeight(4, false);
        const x = (Graphics.boxWidth - width) / 2;
        const y = (Graphics.boxHeight - height) / 2;
        return new Rectangle(x, y, width, height);
    };
    
    Scene_DeckBuilder.prototype.loadAvailableSkills = function() {
        const skillsMap = new Map();
        
        // Get all party members (including those who might have died)
        for (let i = 1; i <= $dataActors.length - 1; i++) {
            const actor = $gameActors.actor(i);
            if (!actor || !$gameParty.allMembers().some(member => member.actorId() === i)) continue;
            
            const skills = this.getAllSkillsForActor(actor);
            for (const skill of skills) {
                if (!skillsMap.has(skill.id)) {
                    skillsMap.set(skill.id, {
                        skill: skill,
                        learnedBy: []
                    });
                }
                skillsMap.get(skill.id).learnedBy.push(actor.actorId());
            }
        }
        
        this._availableSkills = Array.from(skillsMap.values());
    };
    
    Scene_DeckBuilder.prototype.getAllSkillsForActor = function(actor) {
        const skills = [];
        
        // For actor 1, get all skills from class learnings
        if (actor.actorId() === 1) {
            const actorClass = $dataClasses[actor._classId];
            if (actorClass && actorClass.learnings) {
                for (const learning of actorClass.learnings) {
                    const skill = $dataSkills[learning.skillId];
                    if (skill && this.isSkillUsableInBattle(skill)) {
                        skills.push(skill);
                    }
                }
            }
        }
        
        // For all actors, add currently learned skills
        for (const skillId of actor._skills) {
            const skill = $dataSkills[skillId];
            if (skill && this.isSkillUsableInBattle(skill) && 
                !skills.some(s => s.id === skillId)) {
                skills.push(skill);
            }
        }
        
        return skills;
    };
    
    Scene_DeckBuilder.prototype.isSkillUsableInBattle = function(skill) {
        if (!skill) return false;
        if (skill.occasion === 3) return false; // Never usable
        if (skill.occasion === 2) return false; // Menu only
        return skill.occasion === 0 || skill.occasion === 1;
    };
    
    Scene_DeckBuilder.prototype.loadCurrentDeck = function() {
        // Load from saved data or create empty deck
        this._currentDeck = $dataSystem.deckBuilder ? 
            JSON.parse(JSON.stringify($dataSystem.deckBuilder)) : 
            [];
    };
    
    Scene_DeckBuilder.prototype.onSkillOk = function() {
        const skill = this._skillListWindow.currentSkill();
        if (skill) {
            this._selectedSkill = skill;
            const deckCard = this._currentDeck.find(card => card.skillId === skill.skill.id);
            const currentCount = deckCard ? deckCard.count : 0;
            const energyCost = calculateSkillEnergyCost(skill.skill.id);
            const maxCopies = getMaxCopiesForEnergyCost(energyCost);
            
            this._quantityWindow.setup(skill.skill, currentCount, maxCopies, energyCost);
            this._quantityWindow.show();
            this._quantityWindow.activate();
            this._skillListWindow.deactivate();
            this._commandWindow.deactivate();
        }
    };
    
    Scene_DeckBuilder.prototype.onSkillCancel = function() {
        this._commandWindow.activate();
        this._skillListWindow.deactivate();
    };
    
    Scene_DeckBuilder.prototype.onQuantityOk = function() {
        const skill = this._selectedSkill;
        const newQuantity = this._quantityWindow.currentQuantity();
        this.setSkillQuantity(skill.skill.id, newQuantity);
        this._quantityWindow.hide();
        this._quantityWindow.deactivate();
        this._skillListWindow.activate();
        this._commandWindow.deactivate(); // Keep command window deactivated
    };
    
    Scene_DeckBuilder.prototype.onQuantityCancel = function() {
        this._quantityWindow.hide();
        this._quantityWindow.deactivate();
        this._skillListWindow.activate();
        this._commandWindow.deactivate(); // Keep command window deactivated
    };
    
    Scene_DeckBuilder.prototype.setSkillQuantity = function(skillId, quantity) {
        const existingCard = this._currentDeck.find(card => card.skillId === skillId);
        
        if (quantity === 0) {
            // Remove card from deck
            if (existingCard) {
                const index = this._currentDeck.indexOf(existingCard);
                this._currentDeck.splice(index, 1);
            }
        } else {
            // Check if adding this quantity would exceed 40 cards
            const currentTotal = this.getTotalDeckCount();
            const currentCardCount = existingCard ? existingCard.count : 0;
            const difference = quantity - currentCardCount;
            
            if (currentTotal + difference > 40) {
                const maxAllowed = Math.max(0, 40 - (currentTotal - currentCardCount));
                quantity = Math.min(quantity, maxAllowed);
                
                if (quantity === currentCardCount) {
                    SoundManager.playBuzzer();
                    this._helpWindow.setText("Cannot add more cards \n deck would exceed 40 cards!");
                    return;
                }
            }
            
            if (existingCard) {
                existingCard.count = quantity;
            } else {
                const skillData = this._availableSkills.find(s => s.skill.id === skillId);
                this._currentDeck.push({
                    skillId: skillId,
                    count: quantity,
                    learnedBy: skillData ? skillData.learnedBy : [1]
                });
            }
        }
        
        this.refreshWindows();
        SoundManager.playOk();
    };
    
    Scene_DeckBuilder.prototype.getTotalDeckCount = function() {
        return this._currentDeck.reduce((total, card) => total + card.count, 0);
    };
    
    Scene_DeckBuilder.prototype.refreshWindows = function() {
        this._skillListWindow.setCurrentDeck(this._currentDeck);
        this._skillListWindow.refresh();
        this._deckWindow.setCurrentDeck(this._currentDeck);
        this._deckWindow.refresh();
        const totalCards = this.getTotalDeckCount();
        this._helpWindow.setText(`Deck: ${totalCards}/40 cards. High-cost skills have fewer max copies.`);
    };
    
    Scene_DeckBuilder.prototype.onRandomizeDeck = function() {
        // Clear current deck
        this._currentDeck = [];
        
        // Create a weighted pool based on energy cost (lower cost = more common)
        const skillPool = [];
        for (const skillData of this._availableSkills) {
            const energyCost = calculateSkillEnergyCost(skillData.skill.id);
            const maxCopies = getMaxCopiesForEnergyCost(energyCost);
            
            // Add each skill to pool based on max copies (lower cost = more entries)
            for (let i = 0; i < maxCopies; i++) {
                skillPool.push(skillData);
            }
        }
        
        // Shuffle the skill pool
        for (let i = skillPool.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [skillPool[i], skillPool[j]] = [skillPool[j], skillPool[i]];
        }
        
        // Fill deck with random skills up to 40 cards
        const usedSkills = new Map();
        let cardsAdded = 0;
        
        for (const skillData of skillPool) {
            if (cardsAdded >= 40) break;
            
            const skillId = skillData.skill.id;
            const energyCost = calculateSkillEnergyCost(skillId);
            const maxCopies = getMaxCopiesForEnergyCost(energyCost);
            const currentCount = usedSkills.get(skillId) || 0;
            
            if (currentCount < maxCopies) {
                usedSkills.set(skillId, currentCount + 1);
                cardsAdded++;
                
                // Add to deck or update existing entry
                const existingCard = this._currentDeck.find(card => card.skillId === skillId);
                if (existingCard) {
                    existingCard.count++;
                } else {
                    this._currentDeck.push({
                        skillId: skillId,
                        count: 1,
                        learnedBy: skillData.learnedBy
                    });
                }
            }
        }
        
        this.refreshWindows();
        SoundManager.playMagicEvasion();
        this._helpWindow.setText(`Deck randomized! Generated ${cardsAdded} cards.`);
        this._commandWindow.activate();
    };
    
    Scene_DeckBuilder.prototype.onResetDeck = function() {
        this._currentDeck = []; // Empty the deck completely
        this.refreshWindows();
        SoundManager.playCancel();
        this._helpWindow.setText("Deck reset! All cards removed.");
        this._commandWindow.activate();
    };
    
    // Window for skill list
    function Window_DeckBuilderSkillList() {
        this.initialize(...arguments);
    }
    
    Window_DeckBuilderSkillList.prototype = Object.create(Window_Selectable.prototype);
    Window_DeckBuilderSkillList.prototype.constructor = Window_DeckBuilderSkillList;
    
    Window_DeckBuilderSkillList.prototype.initialize = function(rect) {
        Window_Selectable.prototype.initialize.call(this, rect);
        this._availableSkills = [];
        this._currentDeck = [];
    };
    
    Window_DeckBuilderSkillList.prototype.setAvailableSkills = function(skills) {
        this._availableSkills = skills;
        this.refresh();
    };
    
    Window_DeckBuilderSkillList.prototype.setCurrentDeck = function(deck) {
        this._currentDeck = deck;
    };
    
    Window_DeckBuilderSkillList.prototype.maxItems = function() {
        return this._availableSkills.length;
    };
    
    Window_DeckBuilderSkillList.prototype.currentSkill = function() {
        return this._availableSkills[this.index()];
    };
    
    Window_DeckBuilderSkillList.prototype.drawItem = function(index) {
        const skillData = this._availableSkills[index];
        if (!skillData) return;
        
        const skill = skillData.skill;
        const rect = this.itemRectWithPadding(index);
        const deckCard = this._currentDeck.find(card => card.skillId === skill.id);
        const count = deckCard ? deckCard.count : 0;
        const energyCost = calculateSkillEnergyCost(skill.id);
        const maxCopies = getMaxCopiesForEnergyCost(energyCost);
        
        // Draw skill icon
        this.drawIcon(skill.iconIndex, rect.x, rect.y);
        
        // Draw skill name
        this.contents.fontSize = 18;
        this.changeTextColor(ColorManager.normalColor());
        this.drawText(skill.name, rect.x + 36, rect.y, rect.width - 140);
        
        // Draw energy cost
        this.contents.fontSize = 14;
        this.changeTextColor(ColorManager.systemColor());
        this.drawText(`${energyCost}E`, rect.x + rect.width - 100, rect.y, 30, 'center');
        
        // Draw count in deck
        this.contents.fontSize = 16;
        if (count > 0) {
            this.changeTextColor(ColorManager.powerUpColor());
            this.drawText(`${count}/${maxCopies}`, rect.x + rect.width - 60, rect.y + 2, 50, 'right');
        } else {
            this.changeTextColor(ColorManager.deathColor());
            this.drawText(`0/${maxCopies}`, rect.x + rect.width - 60, rect.y + 2, 50, 'right');
        }
    };
    
    // Window for current deck display
    function Window_DeckBuilderDeck() {
        this.initialize(...arguments);
    }
    
    Window_DeckBuilderDeck.prototype = Object.create(Window_Base.prototype);
    Window_DeckBuilderDeck.prototype.constructor = Window_DeckBuilderDeck;
    
    Window_DeckBuilderDeck.prototype.initialize = function(rect) {
        Window_Base.prototype.initialize.call(this, rect);
        this._currentDeck = [];
    };
    
    Window_DeckBuilderDeck.prototype.setCurrentDeck = function(deck) {
        this._currentDeck = deck;
        this.refresh();
    };
    
    Window_DeckBuilderDeck.prototype.refresh = function() {
        this.contents.clear();
        
        const totalCards = this._currentDeck.reduce((total, card) => total + card.count, 0);
        
        // Draw header
        this.contents.fontSize = 20;
        this.changeTextColor(ColorManager.systemColor());
        this.drawText(`Current Deck (${totalCards}/40)`, 0, 0, this.contents.width, 'center');
        
        // Draw deck contents
        let y = 40;
        this.contents.fontSize = 16;
        
        if (this._currentDeck.length === 0) {
            this.changeTextColor(ColorManager.deathColor());
            this.drawText("Empty Deck", 0, y, this.contents.width, 'center');
        } else {
            for (const cardData of this._currentDeck) {
                const skill = $dataSkills[cardData.skillId];
                if (!skill) continue;
                
                // Draw skill info
                this.drawIcon(skill.iconIndex, 0, y);
                this.changeTextColor(ColorManager.normalColor());
                this.drawText(skill.name, 36, y, this.contents.width - 80);
                
                // Draw count
                this.changeTextColor(ColorManager.powerUpColor());
                this.drawText(`×${cardData.count}`, this.contents.width - 40, y, 40, 'right');
                
                y += 32;
                
                if (y > this.contents.height - 32) break;
            }
        }
    };
    
    // Window for command buttons
    function Window_DeckBuilderCommand() {
        this.initialize(...arguments);
    }
    
    Window_DeckBuilderCommand.prototype = Object.create(Window_HorzCommand.prototype);
    Window_DeckBuilderCommand.prototype.constructor = Window_DeckBuilderCommand;
    
    Window_DeckBuilderCommand.prototype.makeCommandList = function() {
        this.addCommand("Randomize", 'randomize');
        this.addCommand("Reset", 'reset');
        this.addCommand("Exit", 'cancel');
    };
    
    Window_DeckBuilderCommand.prototype.maxCols = function() {
        return 3;
    };
    
    // New quantity selection window
    function Window_DeckBuilderQuantity() {
        this.initialize(...arguments);
    }
    
    Window_DeckBuilderQuantity.prototype = Object.create(Window_Selectable.prototype);
    Window_DeckBuilderQuantity.prototype.constructor = Window_DeckBuilderQuantity;
    
    Window_DeckBuilderQuantity.prototype.initialize = function(rect) {
        Window_Selectable.prototype.initialize.call(this, rect);
        this._skill = null;
        this._quantity = 0;
        this._maxQuantity = 3;
    };
    
    Window_DeckBuilderQuantity.prototype.setup = function(skill, currentQuantity, maxCopies, energyCost) {
        this._skill = skill;
        this._quantity = currentQuantity;
        this._maxQuantity = maxCopies || 3; // fallback to 3 if not provided
        this._energyCost = energyCost || 0;
        this.select(0);
        this.refresh();
    };
    
    
    Window_DeckBuilderQuantity.prototype.maxItems = function() {
        return 1;
    };
    
    Window_DeckBuilderQuantity.prototype.currentQuantity = function() {
        return this._quantity;
    };
    
    Window_DeckBuilderQuantity.prototype.cursorRight = function() {
        if (this._quantity < this._maxQuantity) {
            this._quantity++;
            SoundManager.playCursor();
            this.refresh();
        } else {
            SoundManager.playBuzzer();
        }
    };
    
    Window_DeckBuilderQuantity.prototype.cursorLeft = function() {
        if (this._quantity > 0) {
            this._quantity--;
            SoundManager.playCursor();
            this.refresh();
        } else {
            SoundManager.playBuzzer();
        }
    };
    
    Window_DeckBuilderQuantity.prototype.isOkEnabled = function() {
        return true;
    };
    
    Window_DeckBuilderQuantity.prototype.isCancelEnabled = function() {
        return true;
    };
    
    // Override to prevent other cursor movements
    Window_DeckBuilderQuantity.prototype.cursorDown = function() {
        // Do nothing - prevent default behavior
    };
    
    Window_DeckBuilderQuantity.prototype.cursorUp = function() {
        // Do nothing - prevent default behavior
    };
    
    Window_DeckBuilderQuantity.prototype.cursorPagedown = function() {
        // Do nothing - prevent default behavior
    };
    
    Window_DeckBuilderQuantity.prototype.cursorPageup = function() {
        // Do nothing - prevent default behavior
    };
    
    Window_DeckBuilderQuantity.prototype.refresh = function() {
        this.contents.clear();
        
        if (!this._skill) return;
        
        // Draw skill info
        this.drawIcon(this._skill.iconIndex, 12, 12);
        this.contents.fontSize = 18;
        this.changeTextColor(ColorManager.normalColor());
        this.drawText(this._skill.name, 0, 48, this.contents.width, 'center');
        
        // Draw energy cost
        this.contents.fontSize = 14;
        this.changeTextColor(ColorManager.systemColor());
        this.drawText(`Energy Cost: ${this._energyCost}`, 0, 70, this.contents.width, 'center');
        
        // Draw quantity controls
        this.contents.fontSize = 16;
        this.changeTextColor(ColorManager.systemColor());
        this.drawText(`Copies (Max: ${this._maxQuantity}):`, 0, 90, this.contents.width, 'center');
        
        // Draw quantity with arrows
        const quantityText = `< ${this._quantity} >`;
        this.contents.fontSize = 20;
        if (this._quantity === 0) {
            this.changeTextColor(ColorManager.deathColor());
        } else if (this._quantity === this._maxQuantity) {
            this.changeTextColor(ColorManager.crisisColor());
        } else {
            this.changeTextColor(ColorManager.powerUpColor());
        }
        this.drawText(quantityText, 0, 110, this.contents.width, 'center');
        
        // Draw copy limit explanation
        this.contents.fontSize = 12;
        this.changeTextColor(ColorManager.normalColor());
        let limitText = "";
        if (this._energyCost <= 1) {
            limitText = "Low cost - High copies allowed";
        } else if (this._energyCost >= 10) {
            limitText = "Max cost - Only 1 copy allowed";
        } else {
            limitText = "Mid cost - Limited copies";
        }
        this.drawText(limitText, 0, 135, this.contents.width, 'center');
    };
    
    
    // Menu integration
    const _Window_MenuCommand_addOriginalCommands = Window_MenuCommand.prototype.addOriginalCommands;
    Window_MenuCommand.prototype.addOriginalCommands = function() {
        _Window_MenuCommand_addOriginalCommands.call(this);
        if ($gameSwitches.value(45)) {
            this.addCommand(ConfigManager.language === "it"?"Deck builder":"Costruisci mazzo", 'deckBuilder', true,45);
        }
    };
    
    const _Scene_Menu_createCommandWindow = Scene_Menu.prototype.createCommandWindow;
    Scene_Menu.prototype.createCommandWindow = function() {
        _Scene_Menu_createCommandWindow.call(this);
        this._commandWindow.setHandler('deckBuilder', this.commandDeckBuilder.bind(this));
    };
    
    Scene_Menu.prototype.commandDeckBuilder = function() {
        SceneManager.push(Scene_DeckBuilder);
    };


    // Modify window to show card info and draw command
// Modify window to show card info and passTurn command
const _Window_ActorCommand_makeCommandList = Window_ActorCommand.prototype.makeCommandList;
Window_ActorCommand.prototype.makeCommandList = function() {
    if ($gameSwitches.value(45) && window.$cardManager) {
        if (this._actor) {
            this.addCommand(ConfigManager.language === "it" ? "Usa Carta" : "Use Card", 'attack', true);
            this.addCommand(ConfigManager.language === "it" ? "Passa Turno" : "Pass Turn", 'passTurn', true);
            this.addItemCommand();
            this.addGuardCommand();
        }
    } else {
        _Window_ActorCommand_makeCommandList.call(this);
    }
};
    // Move enemies up when card system is active
    const _Sprite_Enemy_setBattler = Sprite_Enemy.prototype.setBattler;
    Sprite_Enemy.prototype.setBattler = function(battler) {
        _Sprite_Enemy_setBattler.call(this, battler);
        if ($gameSwitches.value(45) && battler) {
            this.y -= 100;
        }
    };

const _Sprite_Enemy_updatePosition = Sprite_Enemy.prototype.updatePosition;
Sprite_Enemy.prototype.updatePosition = function() {
    _Sprite_Enemy_updatePosition.call(this);
    if ($gameSwitches.value(45)) {
        this.y -= 100;
    }
};

// Replace the existing options code in your plugin with this updated version

const _Window_Options_addGeneralOptions = Window_Options.prototype.addGeneralOptions;
Window_Options.prototype.addGeneralOptions = function() {
    _Window_Options_addGeneralOptions.call(this);
    this.addCommand("Combat Mode", 'combatMode');
};

const _Window_Options_statusText = Window_Options.prototype.statusText;
Window_Options.prototype.statusText = function(index) {
    const symbol = this.commandSymbol(index);
    if (symbol === 'combatMode') {
        return this.getCombatModeText();
    }
    return _Window_Options_statusText.call(this, index);
};

const _Window_Options_processOk = Window_Options.prototype.processOk;
Window_Options.prototype.processOk = function() {
    const index = this.index();
    const symbol = this.commandSymbol(index);
    
    if (symbol === 'combatMode') {
        this.changeCombatMode();
        return;
    }
    
    _Window_Options_processOk.call(this);
};

const _Window_Options_cursorRight = Window_Options.prototype.cursorRight;
Window_Options.prototype.cursorRight = function() {
    const index = this.index();
    const symbol = this.commandSymbol(index);
    
    if (symbol === 'combatMode') {
        this.changeCombatMode();
        return;
    }
    
    _Window_Options_cursorRight.call(this);
};

const _Window_Options_cursorLeft = Window_Options.prototype.cursorLeft;
Window_Options.prototype.cursorLeft = function() {
    const index = this.index();
    const symbol = this.commandSymbol(index);
    
    if (symbol === 'combatMode') {
        this.changeCombatMode();
        return;
    }
    
    _Window_Options_cursorLeft.call(this);
};

// Get current combat mode as text
Window_Options.prototype.getCombatModeText = function() {
    const switch45 = $gameSwitches.value(45); // Cards mode
    const switch46 = $gameSwitches.value(46); // Monsters mode
    
    if (switch45 && !switch46) {
        return 'Cards';
    } else if (!switch45 && switch46) {
        return 'Monsters';
    } else {
        return 'RPG'; // Default mode (both switches off)
    }
};

// Get current combat mode as number (0=RPG, 1=Cards, 2=Monsters)
Window_Options.prototype.getCurrentCombatMode = function() {
    const switch45 = $gameSwitches.value(45);
    const switch46 = $gameSwitches.value(46);
    
    if (switch45 && !switch46) {
        return 1; // Cards
    } else if (!switch45 && switch46) {
        return 2; // Monsters
    } else {
        return 0; // RPG (default)
    }
};

// Set combat mode by number
Window_Options.prototype.setCombatMode = function(mode) {
    const wasCardMode = $gameSwitches.value(45);
    
    switch (mode) {
        case 0: // RPG mode
            $gameSwitches.setValue(45, false);
            $gameSwitches.setValue(46, false);
            break;
        case 1: // Cards mode
            $gameSwitches.setValue(45, true);
            $gameSwitches.setValue(46, false);
            break;
        case 2: // Monsters mode
            $gameSwitches.setValue(45, false);
            $gameSwitches.setValue(46, true);
            break;
    }
    
    // Handle skill learning/removal when switching to/from card mode
    const isCardMode = $gameSwitches.value(45);
    const actor1 = $gameParty.members()[0];
    
    if (actor1) {
        if (isCardMode && !wasCardMode) {
            // Switching TO card mode: Give all learnable skills
            this.giveAllLearnableSkills(actor1);
        } else if (!isCardMode && wasCardMode) {
            // Switching FROM card mode: Remove skills learned after current level
            this.removeSkillsAboveLevel(actor1);
        }
    }
    
    // Reset deck builder auto-randomization state when switching modes
    if ($dataSystem.deckBuilderAutoRandomized) {
        $dataSystem.deckBuilderAutoRandomized = {};
    }
};

// Cycle through combat modes
Window_Options.prototype.changeCombatMode = function() {
    const currentMode = this.getCurrentCombatMode();
    const nextMode = (currentMode + 1) % 3; // Cycle through 0, 1, 2
    
    this.setCombatMode(nextMode);
    
    SoundManager.playCursor();
    this.redrawItem(this.findSymbol('combatMode'));
};

// Keep the existing skill management functions
Window_Options.prototype.giveAllLearnableSkills = function(actor) {
    const actorClass = $dataClasses[actor._classId];
    if (!actorClass || !actorClass.learnings) return;
    
    let skillsLearned = 0;
    
    for (const learning of actorClass.learnings) {
        const skill = $dataSkills[learning.skillId];
        if (skill && !actor.isLearnedSkill(learning.skillId)) {
            actor.learnSkill(learning.skillId);
            skillsLearned++;
        }
    }
};

Window_Options.prototype.removeSkillsAboveLevel = function(actor) {
    const actorClass = $dataClasses[actor._classId];
    if (!actorClass || !actorClass.learnings) return;
    
    const currentLevel = actor._level;
    let skillsRemoved = 0;
    const removedSkills = [];
    
    for (const learning of actorClass.learnings) {
        if (learning.level > currentLevel && actor.isLearnedSkill(learning.skillId)) {
            const skill = $dataSkills[learning.skillId];
            if (skill) {
                actor.forgetSkill(learning.skillId);
                removedSkills.push(skill.name);
                skillsRemoved++;
            }
        }
    }
};

Window_Options.prototype.changeCardCombatSetting = function() {
    const wasActive = $gameSwitches.value(45);
    const newValue = !wasActive;
    
    // Toggle the switch
    $gameSwitches.setValue(45, newValue);
    
    // Reset deck builder auto-randomization state when switch changes
    if ($dataSystem.deckBuilderAutoRandomized) {
        $dataSystem.deckBuilderAutoRandomized = {};
    }
    
    // Handle skill learning/removal for main character
    const actor1 = $gameParty.members()[0];
    if (actor1) {
        if (newValue && !wasActive) {
            // Switching ON: Give all learnable skills for current class
            this.giveAllLearnableSkills(actor1);
        } else if (!newValue && wasActive) {
            // Switching OFF: Remove skills learned after current level
            this.removeSkillsAboveLevel(actor1);
        }
    }
    
    SoundManager.playCursor();
    this.redrawItem(this.findSymbol('cardCombat'));
};

Window_Options.prototype.giveAllLearnableSkills = function(actor) {
    const actorClass = $dataClasses[actor._classId];
    if (!actorClass || !actorClass.learnings) return;
    
    let skillsLearned = 0;
    
    for (const learning of actorClass.learnings) {
        const skill = $dataSkills[learning.skillId];
        if (skill && !actor.isLearnedSkill(learning.skillId)) {
            actor.learnSkill(learning.skillId);
            skillsLearned++;
        }
    }
    

};

Window_Options.prototype.removeSkillsAboveLevel = function(actor) {
    const actorClass = $dataClasses[actor._classId];
    if (!actorClass || !actorClass.learnings) return;
    
    const currentLevel = actor._level;
    let skillsRemoved = 0;
    const removedSkills = [];
    
    for (const learning of actorClass.learnings) {
        if (learning.level > currentLevel && actor.isLearnedSkill(learning.skillId)) {
            const skill = $dataSkills[learning.skillId];
            if (skill) {
                actor.forgetSkill(learning.skillId);
                removedSkills.push(skill.name);
                skillsRemoved++;
            }
        }
    }

};
    // Handle the draw card command
// Handle the passTurn command
const _Scene_Battle_createActorCommandWindow = Scene_Battle.prototype.createActorCommandWindow;
Scene_Battle.prototype.createActorCommandWindow = function() {
    _Scene_Battle_createActorCommandWindow.call(this);
    // Remove the old handler and add the new one for 'passTurn'
    this._actorCommandWindow.setHandler('drawCard', null);
    this._actorCommandWindow.setHandler('passTurn', this.commandPassTurn.bind(this));
};
    
    // Input mapping for A and D keys
    Input.keyMapper[65] = 'pageup';    // A key
    Input.keyMapper[68] = 'pagedown';  // D key
    
})();
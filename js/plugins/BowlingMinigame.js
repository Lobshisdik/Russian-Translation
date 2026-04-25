/*:
 * @target MZ
 * @plugindesc Physics-based bowling minigame with realistic pin collisions v3.0.0
 * @author Omni-Lex
 * @version 3.0.0
 *
 * @help BowlingMinigame.js
 *
 * A challenging bowling minigame with realistic 2D physics simulation.
 * Features slower ball speed, realistic pin physics, and increased difficulty.
 *
 * @param ---Physics Settings---
 * @default
 *
 * @param Ball Mass
 * @parent ---Physics Settings---
 * @desc Mass of the bowling ball (affects collision force)
 * @type number
 * @decimals 1
 * @default 7.0
 *
 * @param Pin Mass
 * @parent ---Physics Settings---
 * @desc Mass of each bowling pin
 * @type number
 * @decimals 1
 * @default 1.5
 *
 * @param Friction
 * @parent ---Physics Settings---
 * @desc Lane friction coefficient (0-1, higher = more friction)
 * @type number
 * @decimals 2
 * @default 0.15
 *
 * @param Pin Bounce
 * @parent ---Physics Settings---
 * @desc Pin elasticity on collision (0-1)
 * @type number
 * @decimals 2
 * @default 0.4
 *
 * @param ---Sound Effects---
 * @default
 *
 * @param Roll Sound
 * @parent ---Sound Effects---
 * @desc The sound effect to play when the ball is rolled.
 * @type file
 * @dir audio/se/
 *
 * @param Pin Hit Sound
 * @parent ---Sound Effects---
 * @desc The sound effect for pins being hit.
 * @type file
 * @dir audio/se/
 *
 * @param Strike Sound
 * @parent ---Sound Effects---
 * @desc The sound effect for a strike.
 * @type file
 * @dir audio/se/
 *
 * @param Spare Sound
 * @parent ---Sound Effects---
 * @desc The sound effect for a spare.
 * @type file
 * @dir audio/se/
 *
 * @param Gutter Sound
 * @parent ---Sound Effects---
 * @desc The sound effect for a gutter ball.
 * @type file
 * @dir audio/se/
 *
 * @param ---Game Variables---
 * @default
 *
 * @param Game Result Variable
 * @parent ---Game Variables---
 * @desc The game variable ID to store the result (1 for win, 2 for loss, 3 for draw).
 * @type variable
 * @default 0
 *
 * @param Difficulty Level
 * @parent ---Game Variables---
 * @desc Difficulty level (1=Easy, 2=Normal, 3=Hard)
 * @type number
 * @min 1
 * @max 3
 * @default 2
 *
 * @command startBowlingGame
 * @text Start Bowling Game
 * @desc Opens the physics-based bowling minigame.
 */

(() => {
    'use strict';

    const pluginName = "BowlingMinigame";
    const params = PluginManager.parameters(pluginName);

    // Physics Parameters
    const BALL_MASS = parseFloat(params['Ball Mass'] || 7.0);
    const PIN_MASS = parseFloat(params['Pin Mass'] || 1.5);
    const FRICTION = parseFloat(params['Friction'] || 0.15);
    const PIN_BOUNCE = parseFloat(params['Pin Bounce'] || 0.4);
    const DIFFICULTY = parseInt(params['Difficulty Level'] || 2);

    // Sound Parameters
    const rollSound = { name: params['Roll Sound'] || '', volume: 90, pitch: 100, pan: 0 };
    const pinHitSound = { name: params['Pin Hit Sound'] || '', volume: 90, pitch: 100, pan: 0 };
    const strikeSound = { name: params['Strike Sound'] || '', volume: 100, pitch: 100, pan: 0 };
    const spareSound = { name: params['Spare Sound'] || '', volume: 100, pitch: 100, pan: 0 };
    const gutterSound = { name: params['Gutter Sound'] || '', volume: 90, pitch: 100, pan: 0 };
    const gameResultVariable = parseInt(params['Game Result Variable'], 10) || 0;
    
    // Forward declare the scene class
    let Scene_BowlingMinigame;

    PluginManager.registerCommand(pluginName, "startBowlingGame", () => {
        SceneManager.push(Scene_BowlingMinigame);
    });
    
    // Also make the scene globally accessible for compatibility
    window.Scene_BowlingMinigame = Scene_BowlingMinigame;

    //=============================================================================
    // Physics2D - Simple 2D Physics Engine
    //=============================================================================
    class Physics2D {
        constructor() {
            this.bodies = [];
            this.gravity = { x: 0, y: 0 };
            this.timeStep = 1/60;
        }

        addBody(body) {
            this.bodies.push(body);
        }

        removeBody(body) {
            const index = this.bodies.indexOf(body);
            if (index > -1) this.bodies.splice(index, 1);
        }

        update() {
            // Update positions and velocities
            for (const body of this.bodies) {
                if (!body.static && body.active) {
                    // Apply gravity
                    body.velocity.x += this.gravity.x * this.timeStep;
                    body.velocity.y += this.gravity.y * this.timeStep;
                    
                    // Apply friction (much reduced for proper ball movement)
                    const frictionFactor = 1 - (body.friction * this.timeStep);
                    body.velocity.x *= frictionFactor;
                    body.velocity.y *= frictionFactor;
                    
                    // Apply angular friction
                    body.angularVelocity *= frictionFactor;
                    
                    // Update position (no timeStep multiplication since velocity is already in pixels/frame)
                    body.position.x += body.velocity.x * this.timeStep;
                    body.position.y += body.velocity.y * this.timeStep;
                    body.rotation += body.angularVelocity * this.timeStep;
                }
            }
            
            // Check collisions
            for (let i = 0; i < this.bodies.length; i++) {
                for (let j = i + 1; j < this.bodies.length; j++) {
                    this.checkCollision(this.bodies[i], this.bodies[j]);
                }
            }
        }

        checkCollision(bodyA, bodyB) {
            if (bodyA.static && bodyB.static) return;
            if (!bodyA.active || !bodyB.active) return;
            
            const dx = bodyB.position.x - bodyA.position.x;
            const dy = bodyB.position.y - bodyA.position.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            const minDistance = bodyA.radius + bodyB.radius;
            
            if (distance < minDistance) {
                this.resolveCollision(bodyA, bodyB, dx, dy, distance, minDistance);
            }
        }

        resolveCollision(bodyA, bodyB, dx, dy, distance, minDistance) {
            // Normalize collision vector
            const nx = dx / distance;
            const ny = dy / distance;
            
            // Relative velocity
            const vx = bodyB.velocity.x - bodyA.velocity.x;
            const vy = bodyB.velocity.y - bodyA.velocity.y;
            
            // Relative velocity in collision normal direction
            const speed = vx * nx + vy * ny;
            
            // Do not resolve if velocities are separating
            if (speed > 0) return;
            
            // Calculate restitution (bounciness)
            const e = Math.min(bodyA.restitution, bodyB.restitution);
            
            // Calculate impulse scalar with reduced force
            const impulse = 1.2 * speed / (bodyA.mass + bodyB.mass); // Reduced from 2 to 1.2
            
            // Apply impulse to velocities with velocity caps
            if (!bodyA.static) {
                const forceA = impulse * bodyB.mass * (1 + e);
                bodyA.velocity.x -= forceA * nx * 0.6; // Reduced force multiplier
                bodyA.velocity.y -= forceA * ny * 0.6;
                
                // Cap velocities to prevent excessive movement
                const maxVel = 150;
                bodyA.velocity.x = Math.max(-maxVel, Math.min(maxVel, bodyA.velocity.x));
                bodyA.velocity.y = Math.max(-maxVel, Math.min(maxVel, bodyA.velocity.y));
                
                // Reduced angular velocity
                const tangentX = -ny;
                const tangentY = nx;
                const tangentImpulse = (vx * tangentX + vy * tangentY) * 0.05; // Reduced from 0.1
                bodyA.angularVelocity += tangentImpulse * bodyB.mass / bodyA.mass * 0.5; // Additional damping
            }
            
            if (!bodyB.static) {
                const forceB = impulse * bodyA.mass * (1 + e);
                bodyB.velocity.x += forceB * nx * 0.6; // Reduced force multiplier
                bodyB.velocity.y += forceB * ny * 0.6;
                
                // Cap velocities to prevent excessive movement
                const maxVel = 150;
                bodyB.velocity.x = Math.max(-maxVel, Math.min(maxVel, bodyB.velocity.x));
                bodyB.velocity.y = Math.max(-maxVel, Math.min(maxVel, bodyB.velocity.y));
                
                // Reduced angular velocity
                const tangentX = -ny;
                const tangentY = nx;
                const tangentImpulse = -(vx * tangentX + vy * tangentY) * 0.05; // Reduced from 0.1
                bodyB.angularVelocity += tangentImpulse * bodyA.mass / bodyB.mass * 0.5; // Additional damping
            }
            
            // Separate bodies to prevent overlap
            const overlap = minDistance - distance;
            const separationX = nx * overlap;
            const separationY = ny * overlap;
            
            if (!bodyA.static && !bodyB.static) {
                const totalMass = bodyA.mass + bodyB.mass;
                bodyA.position.x -= separationX * (bodyB.mass / totalMass);
                bodyA.position.y -= separationY * (bodyB.mass / totalMass);
                bodyB.position.x += separationX * (bodyA.mass / totalMass);
                bodyB.position.y += separationY * (bodyA.mass / totalMass);
            } else if (!bodyA.static) {
                bodyA.position.x -= separationX;
                bodyA.position.y -= separationY;
            } else if (!bodyB.static) {
                bodyB.position.x += separationX;
                bodyB.position.y += separationY;
            }
            
            // Trigger collision callback
            if (bodyA.onCollision) bodyA.onCollision(bodyB);
            if (bodyB.onCollision) bodyB.onCollision(bodyA);
        }
    }

    //=============================================================================
    // PhysicsBody - Represents a physics object
    //=============================================================================
    class PhysicsBody {
        constructor(x, y, radius, mass = 1) {
            this.position = { x: x, y: y };
            this.velocity = { x: 0, y: 0 };
            this.radius = radius;
            this.mass = mass;
            this.rotation = 0;
            this.angularVelocity = 0;
            this.friction = FRICTION;
            this.restitution = 0.3;
            this.static = false;
            this.active = true;
            this.onCollision = null;
        }
    }

    //=============================================================================
    // Scene_BowlingMinigame - Main bowling scene with physics
    //=============================================================================
    Scene_BowlingMinigame = class extends Scene_MenuBase {
        initialize() {
            super.initialize();
            this.initPhysics();
            this.initGameVariables();
        }

        initPhysics() {
            this._physics = new Physics2D();
            this._ballBody = null;
            this._pinBodies = [];
        }

        initGameVariables() {
            this._gameState = 'intro';
            this._playerScores = Array(10).fill(null).map(() => [null, null, null]);
            this._cpuScores = Array(10).fill(null).map(() => [null, null, null]);
            this._currentFrame = 0;
            this._currentRoll = 0;
            this._isPlayerTurn = true;
            this._pinsDown = [];
            this._wait = 60;
            this._physicsActive = false;
            
            // Difficulty settings
            this._difficultyMultiplier = DIFFICULTY === 1 ? 1.2 : DIFFICULTY === 3 ? 0.8 : 1.0;
            this._cpuAccuracy = DIFFICULTY === 1 ? 0.7 : DIFFICULTY === 3 ? 0.95 : 0.85;
        }

        create() {
            super.create();
            this.createBackground();
            this.createLane();
            this.createPinSprites();
            this.createBallSprite();
            this.createUI();
            this.setupNewFrame();
        }

        createBackground() {
            const width = Graphics.width;
            const height = Graphics.height;
            this._backgroundSprite = new Sprite(new Bitmap(width, height));
            const bmp = this._backgroundSprite.bitmap;
            
            // Dark gradient background
            bmp.gradientFillRect(0, 0, width, height, '#0a0a0f', '#1a1a2e', true);
            
            // Add subtle grid pattern
            const gridColor = 'rgba(255, 215, 0, 0.05)';
            for (let x = 0; x < width; x += 50) {
                bmp.fillRect(x, 0, 1, height, gridColor);
            }
            for (let y = 0; y < height; y += 50) {
                bmp.fillRect(0, y, width, 1, gridColor);
            }
            
            this.addChild(this._backgroundSprite);
        }

        createLane() {
            const laneWidth = 260;
            const laneHeight = Graphics.height - 100;
            const laneX = (Graphics.width - laneWidth) / 2;
            const laneY = 50;
            
            this._laneSprite = new Sprite(new Bitmap(Graphics.width, Graphics.height));
            const bmp = this._laneSprite.bitmap;
            
            // Lane bounds for physics
            this._laneBounds = {
                left: laneX,
                right: laneX + laneWidth,
                top: laneY,
                bottom: laneY + laneHeight
            };
            
            // Draw gutters
            const gutterColor = '#0a0a15';
            const gutterAccent = '#FFD700';
            bmp.fillRect(laneX - 40, laneY, 40, laneHeight, gutterColor);
            bmp.fillRect(laneX + laneWidth, laneY, 40, laneHeight, gutterColor);
            bmp.fillRect(laneX - 35, laneY, 2, laneHeight, gutterAccent);
            bmp.fillRect(laneX + laneWidth + 33, laneY, 2, laneHeight, gutterAccent);
            
            // Draw lane with wood texture
            const woodDark = '#4a3426';
            const woodLight = '#6b4c3a';
            bmp.gradientFillRect(laneX, laneY, laneWidth, laneHeight, woodDark, woodLight, true);
            
            // Lane markers
            for (let i = 0; i < 39; i++) {
                const y = laneY + 100 + i * 10;
                if (y < laneY + laneHeight - 100) {
                    bmp.fillRect(laneX + 60, y, 4, 4, '#333333');
                    bmp.fillRect(laneX + laneWidth - 64, y, 4, 4, '#333333');
                }
            }
            
            // Pin deck area
            const deckY = 160;
            const deckHeight = 140;
            bmp.fillRect(laneX, deckY, laneWidth, deckHeight, 'rgba(0,0,0,0.2)');
            
            // Draw pin spots
            const pinSpots = this.getPinPositions();
            for (const pos of pinSpots) {
                bmp.drawCircle(pos.x, pos.y, 8, 'rgba(255,255,255,0.1)');
            }
            
            this.addChild(this._laneSprite);
        }

        getPinPositions() {
            const centerX = Graphics.width / 2;
            const spacing = 32;
            const rowY = [200, 220, 240, 260];
            
            return [
                // Back row (4 pins)
                { x: centerX - spacing * 1.5, y: rowY[0] },
                { x: centerX - spacing * 0.5, y: rowY[0] },
                { x: centerX + spacing * 0.5, y: rowY[0] },
                { x: centerX + spacing * 1.5, y: rowY[0] },
                // Third row (3 pins)
                { x: centerX - spacing, y: rowY[1] },
                { x: centerX, y: rowY[1] },
                { x: centerX + spacing, y: rowY[1] },
                // Second row (2 pins)
                { x: centerX - spacing * 0.5, y: rowY[2] },
                { x: centerX + spacing * 0.5, y: rowY[2] },
                // Head pin
                { x: centerX, y: rowY[3] }
            ];
        }

        createPinSprites() {
            this._pinContainer = new Sprite();
            this.addChild(this._pinContainer);
            this._pinSprites = [];
            
            const positions = this.getPinPositions();
            
            for (let i = 0; i < 10; i++) {
                const pinSprite = new Sprite_BowlingPin(i);
                pinSprite.x = positions[i].x;
                pinSprite.y = positions[i].y;
                this._pinSprites.push(pinSprite);
                this._pinContainer.addChild(pinSprite);
            }
        }

        createBallSprite() {
            this._ballSprite = new Sprite_BowlingBall();
            this.addChild(this._ballSprite);
            this.resetBall();
        }

        createUI() {
            // Create UI elements
            this._scoreboard = new Sprite_PhysicsScoreboard();
            this.addChild(this._scoreboard);
            
            this._aimArrow = new Sprite_AimArrow();
            this.addChild(this._aimArrow);
            
            this._powerMeter = new Sprite_PowerMeter(20, 280, "POWER");
            this.addChild(this._powerMeter);
            
            this._spinMeter = new Sprite_SpinMeter(Graphics.width - 60, 280, "SPIN");
            this.addChild(this._spinMeter);
            
            this._statusWindow = new Window_BowlingStatus();
            this.addWindow(this._statusWindow);
            
            this._resultWindow = new Window_BowlingResult();
            this._resultWindow.x = (Graphics.width - this._resultWindow.width) / 2;
            this._resultWindow.y = (Graphics.height - this._resultWindow.height) / 2;
            this._resultWindow.hide();
            this.addWindow(this._resultWindow);
        }

        //-------------------------------------------------------------------------
        // Game Flow Management
        //-------------------------------------------------------------------------
        
        setupNewFrame() {
            if (this._currentFrame >= 10) {
                this._gameState = 'gameOver';
                this.showResult();
                return;
            }
            
            this._currentRoll = 0;
            this._pinsDown = [];
            this.resetPins();
            this.resetBall();
            this._scoreboard.refresh(this._playerScores, this._cpuScores);
            this._isPlayerTurn = true;
            this.startTurn();
        }

        startTurn() {
            this.resetBall();
            this._physicsActive = false;
            
            if (this._isPlayerTurn) {
                this._aimValue = 0;
                this._aimDirection = 1;
                this._powerValue = 0;
                this._powerDirection = 1;
                this._spinValue = 0;
                this._spinDirection = 1;
                this._gameState = 'aiming';
                this._statusWindow.setText("Aim and press OK");
                this._aimArrow.show();
            } else {
                this._gameState = 'cpuThinking';
                this._cpuWait = 60;
                this._statusWindow.setText("CPU is analyzing...");
            }
        }

        update() {
            super.update();
            
            if (this._physicsActive) {
                this.updatePhysics();
            }
            
            switch (this._gameState) {
                case 'aiming':
                    this.updateAiming();
                    break;
                case 'power':
                    this.updatePower();
                    break;
                case 'spin':
                    this.updateSpin();
                    break;
                case 'rolling':
                    this.updateRolling();
                    break;
                case 'cpuThinking':
                    this.updateCpuThinking();
                    break;
                case 'scoring':
                    this.updateScoring();
                    break;
                case 'gameOver':
                    this.updateGameOver();
                    break;
            }
        }

        updatePhysics() {
            if (!this._ballBody || !this._physicsActive) return;
            
            this._physics.update();
            
            // Update ball sprite position from physics
            this._ballSprite.x = this._ballBody.position.x;
            this._ballSprite.y = this._ballBody.position.y;
            this._ballSprite.rotation = this._ballBody.rotation;
            
            // Debug log first few frames
            if (this._debugFrames === undefined) this._debugFrames = 0;
            if (this._debugFrames < 5) {
                console.log('Ball position:', this._ballBody.position, 'velocity:', this._ballBody.velocity);
                this._debugFrames++;
            }
            
            // Check for gutter
            if (this._ballBody.position.x < this._laneBounds.left - 10 || 
                this._ballBody.position.x > this._laneBounds.right + 10) {
                if (!this._gutterPlayed) {
                    if (gutterSound.name) AudioManager.playSe(gutterSound);
                    this._gutterPlayed = true;
                    // Kill ball momentum
                    this._ballBody.velocity.x *= 0.1;
                    this._ballBody.velocity.y *= 0.5;
                }
            }
            
            // Check if ball has reached the end or stopped
            if (this._ballBody.position.y < 120 || 
                (Math.abs(this._ballBody.velocity.y) < 1 && this._ballBody.position.y < 300)) {
                this.endRoll();
                return;
            }
            
            // Update pin sprites from physics
            for (let i = 0; i < this._pinBodies.length; i++) {
                const body = this._pinBodies[i];
                const sprite = this._pinSprites[i];
                if (body && sprite) {
                    sprite.x = body.position.x;
                    sprite.y = body.position.y;
                    sprite.rotation = body.rotation;
                    
                    // Check if pin has fallen
                    const tilt = Math.abs(sprite.rotation);
                    if (tilt > Math.PI / 4 || body.position.y > 400) {
                        if (!this._pinsDown.includes(i)) {
                            this._pinsDown.push(i);
                            sprite.opacity = 128;
                        }
                    }
                }
            }
        }

        updateAiming() {
            // Oscillate aim
            this._aimValue += this._aimDirection * 2 * this._difficultyMultiplier;
            if (this._aimValue > 60 || this._aimValue < -60) {
                this._aimDirection *= -1;
            }
            
            this._aimArrow.setAngle(this._aimValue);
            this._ballSprite.x = Graphics.width / 2 + this._aimValue;
            
            if (Input.isTriggered('ok')) {
                SoundManager.playOk();
                this._aimArrow.hide();
                this._gameState = 'power';
                this._statusWindow.setText("Set power and press OK");
                this._powerMeter.show();
            } else if (Input.isTriggered('cancel')) {
                SoundManager.playCancel();
                this.popScene();
            }
        }

        updatePower() {
            // Oscillate power
            this._powerValue += this._powerDirection * 3 * this._difficultyMultiplier;
            if (this._powerValue > 100 || this._powerValue < 0) {
                this._powerDirection *= -1;
                this._powerValue = Math.max(0, Math.min(100, this._powerValue));
            }
            
            this._powerMeter.setValue(this._powerValue);
            
            if (Input.isTriggered('ok')) {
                SoundManager.playOk();
                this._powerMeter.hide();
                this._gameState = 'spin';
                this._statusWindow.setText("Set spin and press OK");
                this._spinMeter.show();
            } else if (Input.isTriggered('cancel')) {
                SoundManager.playCancel();
                this._powerMeter.hide();
                this._gameState = 'aiming';
                this._statusWindow.setText("Aim and press OK");
                this._aimArrow.show();
            }
        }

        updateSpin() {
            // Oscillate spin
            this._spinValue += this._spinDirection * 0.04 * this._difficultyMultiplier;
            if (this._spinValue > 1 || this._spinValue < -1) {
                this._spinDirection *= -1;
                this._spinValue = Math.max(-1, Math.min(1, this._spinValue));
            }
            
            this._spinMeter.setValue(this._spinValue);
            
            if (Input.isTriggered('ok')) {
                SoundManager.playOk();
                this._spinMeter.hide();
                this.rollBall(this._aimValue, this._powerValue, this._spinValue);
            } else if (Input.isTriggered('cancel')) {
                SoundManager.playCancel();
                this._spinMeter.hide();
                this._gameState = 'power';
                this._statusWindow.setText("Set power and press OK");
                this._powerMeter.show();
            }
        }

        updateCpuThinking() {
            this._cpuWait--;
            if (this._cpuWait <= 0) {
                // CPU calculates optimal shot
                const standing = 10 - this._pinsDown.length;
                let targetX = 0;
                
                if (standing === 10) {
                    // Aim for pocket (between head pin and 3 pin)
                    targetX = 12 * (Math.random() > 0.5 ? 1 : -1);
                } else if (standing > 0) {
                    // Aim for center of remaining pins
                    let sumX = 0;
                    let count = 0;
                    for (let i = 0; i < 10; i++) {
                        if (!this._pinsDown.includes(i)) {
                            sumX += this._pinSprites[i].x - Graphics.width / 2;
                            count++;
                        }
                    }
                    targetX = sumX / count;
                }
                
                // Add accuracy variance
                const variance = (1 - this._cpuAccuracy) * 40;
                targetX += (Math.random() - 0.5) * variance;
                
                // Calculate power (less variance for CPU)
                const power = 65 + Math.random() * 25;
                
                // Calculate spin
                let spin = targetX > 0 ? -0.3 : 0.3;
                spin += (Math.random() - 0.5) * 0.2;
                
                this.rollBall(targetX, power, spin);
            }
        }

        updateRolling() {
            // Rolling is handled by physics engine
            if (!this._physicsActive) {
                this._gameState = 'scoring';
            }
        }

        updateScoring() {
            if (this._wait > 0) {
                this._wait--;
                return;
            }
            
            const pinsKnocked = this._pinsDown.length;
            const scores = this._isPlayerTurn ? this._playerScores : this._cpuScores;
            const frame = scores[this._currentFrame];
            
            // Calculate pins knocked this roll
            let pinsThisRoll = pinsKnocked;
            if (this._currentRoll > 0 && this._currentFrame < 9) {
                pinsThisRoll = pinsKnocked - (frame[0] || 0);
            }
            
            // Update score
            frame[this._currentRoll] = pinsThisRoll;
            
            // Check for strike/spare
            const isStrike = this._currentRoll === 0 && pinsThisRoll === 10;
            const isSpare = this._currentRoll === 1 && pinsKnocked === 10;
            
            if (isStrike) {
                if (strikeSound.name) AudioManager.playSe(strikeSound);
                this._statusWindow.setText("STRIKE!");
            } else if (isSpare) {
                if (spareSound.name) AudioManager.playSe(spareSound);
                this._statusWindow.setText("SPARE!");
            }
            
            this._scoreboard.refresh(this._playerScores, this._cpuScores);
            
            // Determine next action
            if (this._currentFrame < 9) {
                if (isStrike || this._currentRoll === 1) {
                    this.switchTurn();
                } else {
                    this._currentRoll++;
                    this.removeDownPins();
                    this.startTurn();
                }
            } else {
                // 10th frame logic
                this.handle10thFrame(isStrike, isSpare);
            }
        }

        handle10thFrame(isStrike, isSpare) {
            const frame = this._isPlayerTurn ? this._playerScores[9] : this._cpuScores[9];
            
            if (this._currentRoll === 0 && isStrike) {
                this._currentRoll++;
                this.resetPins();
                this.startTurn();
            } else if (this._currentRoll === 1) {
                if (frame[0] === 10 || isSpare) {
                    this._currentRoll++;
                    this.resetPins();
                    this.startTurn();
                } else {
                    this.switchTurn();
                }
            } else if (this._currentRoll === 2) {
                this.switchTurn();
            } else {
                this._currentRoll++;
                this.removeDownPins();
                this.startTurn();
            }
        }

        switchTurn() {
            if (this._isPlayerTurn) {
                this._isPlayerTurn = false;
                this._currentRoll = 0;
                this._pinsDown = [];
                this.resetPins();
                this.startTurn();
            } else {
                this._currentFrame++;
                this.setupNewFrame();
            }
        }

        updateGameOver() {
            if (Input.isTriggered('ok') || Input.isTriggered('cancel')) {
                SoundManager.playOk();
                this.popScene();
            }
        }

        //-------------------------------------------------------------------------
        // Ball Rolling with Physics
        //-------------------------------------------------------------------------
        
        rollBall(aim, power, spin) {
            this._gameState = 'rolling';
            this._statusWindow.setText("");
            this._physicsActive = true;
            this._gutterPlayed = false;
            
            // Clear previous physics bodies
            this._physics.bodies = [];
            
            // Create ball physics body
            const ballX = Graphics.width / 2 + aim;
            const ballY = Graphics.height - 100;
            this._ballBody = new PhysicsBody(ballX, ballY, 16, BALL_MASS);
            
            // Calculate velocity (slower ball for more realistic gameplay)
            const angle = aim * 0.01; // Increased angle effect
            const speed = 200 + (power / 100) * 300; // Increased base speed
            this._ballBody.velocity.x = Math.sin(angle) * speed + spin * 50;
            this._ballBody.velocity.y = -speed; // Forward speed
            this._ballBody.angularVelocity = -speed * 0.01;
            this._ballBody.friction = FRICTION * 0.01; // Reduced friction effect
            this._ballBody.restitution = 0.2;
            
            // Add collision callback for ball
            this._ballBody.onCollision = (other) => {
                if (other.isPin && pinHitSound.name && !this._pinHitPlayed) {
                    AudioManager.playSe(pinHitSound);
                    this._pinHitPlayed = true;
                    setTimeout(() => this._pinHitPlayed = false, 100);
                }
            };
            
            // Create pin physics bodies
            this._pinBodies = [];
            const positions = this.getPinPositions();
            for (let i = 0; i < 10; i++) {
                if (!this._pinsDown.includes(i)) {
                    const pinBody = new PhysicsBody(positions[i].x, positions[i].y, 12, PIN_MASS);
                    pinBody.friction = FRICTION * 0.01;
                    pinBody.restitution = PIN_BOUNCE;
                    pinBody.pinIndex = i;
                    pinBody.isPin = true;
                    this._pinBodies[i] = pinBody;
                    this._physics.addBody(pinBody);
                } else {
                    this._pinBodies[i] = null;
                }
            }
            
            this._physics.addBody(this._ballBody);
            
            if (rollSound.name) {
                AudioManager.playSe(rollSound);
            }
            
            // Debug log
            console.log('Ball launched with velocity:', this._ballBody.velocity);
        }

        endRoll() {
            this._physicsActive = false;
            this._physics.bodies = [];
            this._ballBody = null;
            this._pinBodies = [];
            this._gameState = 'scoring';
            this._wait = 60;
            this._ballSprite.visible = false;
        }

        //-------------------------------------------------------------------------
        // Pin Management
        //-------------------------------------------------------------------------
        
        resetPins() {
            const positions = this.getPinPositions();
            this._pinsDown = [];
            
            for (let i = 0; i < 10; i++) {
                const sprite = this._pinSprites[i];
                sprite.x = positions[i].x;
                sprite.y = positions[i].y;
                sprite.rotation = 0;
                sprite.visible = true;
                sprite.opacity = 255;
            }
        }

        removeDownPins() {
            for (const index of this._pinsDown) {
                this._pinSprites[index].visible = false;
            }
        }

        resetBall() {
            this._ballSprite.x = Graphics.width / 2;
            this._ballSprite.y = Graphics.height - 100;
            this._ballSprite.rotation = 0;
            this._ballSprite.visible = true;
        }

        //-------------------------------------------------------------------------
        // Results
        //-------------------------------------------------------------------------
        
        showResult() {
            const playerTotal = this.calculateTotal(this._playerScores);
            const cpuTotal = this.calculateTotal(this._cpuScores);
            
            let result = "";
            let resultValue = 0;
            
            if (playerTotal > cpuTotal) {
                result = "VICTORY!";
                resultValue = 1;
            } else if (cpuTotal > playerTotal) {
                result = "DEFEAT";
                resultValue = 2;
            } else {
                result = "DRAW";
                resultValue = 3;
            }
            
            if (gameResultVariable > 0) {
                $gameVariables.setValue(gameResultVariable, resultValue);
            }
            
            this._resultWindow.show();
            this._resultWindow.setText(result, `You: ${playerTotal}  CPU: ${cpuTotal}`);
            this._statusWindow.setText("Press OK to exit");
        }

        calculateTotal(scores) {
            let total = 0;
            for (let i = 0; i < 10; i++) {
                total += this.calculateFrameScore(scores, i);
            }
            return total;
        }

        calculateFrameScore(scores, frameIndex) {
            const frame = scores[frameIndex];
            if (frame[0] === null) return 0;
            
            let score = 0;
            
            if (frameIndex < 9) {
                if (frame[0] === 10) { // Strike
                    score = 10;
                    const next = scores[frameIndex + 1];
                    if (next && next[0] !== null) {
                        score += next[0];
                        if (next[0] === 10 && frameIndex < 8) {
                            const nextNext = scores[frameIndex + 2];
                            score += nextNext ? (nextNext[0] || 0) : 0;
                        } else {
                            score += next[1] || 0;
                        }
                    }
                } else if ((frame[0] || 0) + (frame[1] || 0) === 10) { // Spare
                    score = 10;
                    const next = scores[frameIndex + 1];
                    score += next ? (next[0] || 0) : 0;
                } else {
                    score = (frame[0] || 0) + (frame[1] || 0);
                }
            } else {
                // 10th frame
                score = (frame[0] || 0) + (frame[1] || 0) + (frame[2] || 0);
            }
            
            return score;
        }
    }

    //=============================================================================
    // Sprite_BowlingBall
    //=============================================================================
    class Sprite_BowlingBall extends Sprite {
        constructor() {
            super();
            this.createBitmap();
        }

        createBitmap() {
            const size = 32;
            this.bitmap = new Bitmap(size, size);
            this.anchor.set(0.5);
            
            // Draw ball with gradient
            const context = this.bitmap._context;
            const gradient = context.createRadialGradient(size/2, size/2, 0, size/2, size/2, size/2);
            gradient.addColorStop(0, '#333333');
            gradient.addColorStop(0.7, '#1a1a1a');
            gradient.addColorStop(1, '#000000');
            
            context.fillStyle = gradient;
            context.beginPath();
            context.arc(size/2, size/2, size/2 - 1, 0, Math.PI * 2);
            context.fill();
            
            // Add shine
            context.fillStyle = 'rgba(255,255,255,0.3)';
            context.beginPath();
            context.arc(size/3, size/3, size/6, 0, Math.PI * 2);
            context.fill();
            
            // Add finger holes
            const holePositions = [
                {x: size/2 - 4, y: size/2 - 4},
                {x: size/2 + 4, y: size/2 - 4},
                {x: size/2, y: size/2 + 3}
            ];
            
            context.fillStyle = '#000000';
            for (const pos of holePositions) {
                context.beginPath();
                context.arc(pos.x, pos.y, 2, 0, Math.PI * 2);
                context.fill();
            }
        }
    }

    //=============================================================================
    // Sprite_BowlingPin
    //=============================================================================
    class Sprite_BowlingPin extends Sprite {
        constructor(index) {
            super();
            this._index = index;
            this.createBitmap();
        }

        createBitmap() {
            const width = 24;
            const height = 48;
            this.bitmap = new Bitmap(width, height);
            this.anchor.set(0.5, 0.8);
            
            const context = this.bitmap._context;
            
            // Pin body gradient
            const gradient = context.createLinearGradient(0, 0, 0, height);
            gradient.addColorStop(0, '#ffffff');
            gradient.addColorStop(0.5, '#f0f0f0');
            gradient.addColorStop(1, '#e0e0e0');
            
            // Draw pin shape
            context.fillStyle = gradient;
            context.beginPath();
            context.ellipse(width/2, 10, 10, 10, 0, 0, Math.PI * 2);
            context.fill();
            
            context.fillRect(width/2 - 10, 10, 20, 25);
            
            context.beginPath();
            context.ellipse(width/2, 35, 11, 11, 0, 0, Math.PI * 2);
            context.fill();
            
            // Red stripes
            context.fillStyle = '#cc0000';
            context.fillRect(width/2 - 8, 18, 16, 3);
            context.fillRect(width/2 - 8, 22, 16, 3);
            
            // Add subtle shadow
            context.fillStyle = 'rgba(0,0,0,0.1)';
            context.fillRect(width/2 - 10, 40, 20, 2);
        }
    }

    //=============================================================================
    // Sprite_PhysicsScoreboard
    //=============================================================================
    class Sprite_PhysicsScoreboard extends Sprite {
        constructor() {
            super();
            this.bitmap = new Bitmap(Graphics.width, 140);
            this.y = 0;
            this.drawBackground();
        }

        drawBackground() {
            const gold = '#FFD700';
            const bg = 'rgba(10, 10, 20, 0.9)';
            
            this.bitmap.fillRect(0, 0, Graphics.width, 140, bg);
            this.bitmap.strokeRect(1, 1, Graphics.width - 2, 138, gold);
            
            // Frame headers
            this.bitmap.fontSize = 16;
            this.bitmap.textColor = gold;
            const frameWidth = 50;
            const startX = 150;
            
            for (let i = 0; i < 10; i++) {
                this.bitmap.drawText(String(i + 1), startX + i * frameWidth, 5, frameWidth, 20, 'center');
            }
            this.bitmap.drawText("TOTAL", startX + 10 * frameWidth, 5, 80, 20, 'center');
        }

        refresh(playerScores, cpuScores) {
            this.bitmap.clear();
            this.drawBackground();
            this.drawScores("PLAYER", playerScores, 40);
            this.drawScores("CPU", cpuScores, 90);
        }

        drawScores(name, scores, y) {
            // Draw name
            this.bitmap.fontSize = 20;
            this.bitmap.textColor = '#FFD700';
            this.bitmap.drawText(name, 20, y, 120, 30, 'left');
            
            // Draw frames
            const frameWidth = 50;
            const startX = 150;
            let runningTotal = 0;
            
            this.bitmap.fontSize = 16;
            this.bitmap.textColor = '#ffffff';
            
            for (let i = 0; i < 10; i++) {
                const x = startX + i * frameWidth;
                this.drawFrame(x, y, scores[i], i);
                
                if (scores[i][0] !== null) {
                    runningTotal += this.getFrameScore(scores, i);
                    this.bitmap.drawText(String(runningTotal), x, y + 10, frameWidth, 20, 'center');
                }
            }
            
            // Total
            this.bitmap.drawText(String(runningTotal), startX + 10 * frameWidth, y + 10, 80, 20, 'center');
        }

        drawFrame(x, y, frame, frameIndex) {
            const boxSize = 20;
            
            // Draw frame boxes
            this.bitmap.strokeRect(x, y - 20, boxSize, boxSize, '#666666');
            this.bitmap.strokeRect(x + boxSize, y - 20, boxSize, boxSize, '#666666');
            
            if (frameIndex === 9) {
                this.bitmap.strokeRect(x + boxSize * 2, y - 20, boxSize, boxSize, '#666666');
            }
            
            // Draw scores
            this.bitmap.fontSize = 14;
            if (frame[0] !== null) {
                if (frame[0] === 10) {
                    this.bitmap.drawText("X", x, y - 20, boxSize, boxSize, 'center');
                } else {
                    this.bitmap.drawText(String(frame[0]), x, y - 20, boxSize, boxSize, 'center');
                }
            }
            
            if (frame[1] !== null) {
                if (frameIndex < 9) {
                    if (frame[0] + frame[1] === 10) {
                        this.bitmap.drawText("/", x + boxSize, y - 20, boxSize, boxSize, 'center');
                    } else {
                        this.bitmap.drawText(String(frame[1]), x + boxSize, y - 20, boxSize, boxSize, 'center');
                    }
                } else {
                    // 10th frame
                    if (frame[1] === 10) {
                        this.bitmap.drawText("X", x + boxSize, y - 20, boxSize, boxSize, 'center');
                    } else if (frame[0] !== 10 && frame[0] + frame[1] === 10) {
                        this.bitmap.drawText("/", x + boxSize, y - 20, boxSize, boxSize, 'center');
                    } else {
                        this.bitmap.drawText(String(frame[1]), x + boxSize, y - 20, boxSize, boxSize, 'center');
                    }
                }
            }
            
            if (frameIndex === 9 && frame[2] !== null) {
                if (frame[2] === 10) {
                    this.bitmap.drawText("X", x + boxSize * 2, y - 20, boxSize, boxSize, 'center');
                } else if (frame[1] !== 10 && frame[1] + frame[2] === 10) {
                    this.bitmap.drawText("/", x + boxSize * 2, y - 20, boxSize, boxSize, 'center');
                } else {
                    this.bitmap.drawText(String(frame[2]), x + boxSize * 2, y - 20, boxSize, boxSize, 'center');
                }
            }
        }

        getFrameScore(scores, index) {
            const frame = scores[index];
            if (frame[0] === null) return 0;
            
            let score = 0;
            
            if (index < 9) {
                if (frame[0] === 10) { // Strike
                    score = 10;
                    const next = scores[index + 1];
                    if (next && next[0] !== null) {
                        score += next[0];
                        if (next[0] === 10 && index < 8) {
                            const after = scores[index + 2];
                            score += after ? (after[0] || 0) : 0;
                        } else {
                            score += next[1] || 0;
                        }
                    }
                } else if ((frame[0] || 0) + (frame[1] || 0) === 10) { // Spare
                    score = 10;
                    const next = scores[index + 1];
                    score += next ? (next[0] || 0) : 0;
                } else {
                    score = (frame[0] || 0) + (frame[1] || 0);
                }
            } else {
                // 10th frame
                score = (frame[0] || 0) + (frame[1] || 0) + (frame[2] || 0);
            }
            
            return score;
        }
    }

    //=============================================================================
    // Sprite_AimArrow
    //=============================================================================
    class Sprite_AimArrow extends Sprite {
        constructor() {
            super();
            this.bitmap = new Bitmap(200, 200);
            this.anchor.set(0.5, 1);
            this.x = Graphics.width / 2;
            this.y = Graphics.height - 80;
            this.visible = false;
        }

        setAngle(degrees) {
            this.rotation = degrees * Math.PI / 180;
            this.bitmap.clear();
            
            const context = this.bitmap._context;
            context.strokeStyle = 'rgba(255, 215, 0, 0.8)';
            context.lineWidth = 3;
            
            // Draw arrow
            context.beginPath();
            context.moveTo(100, 180);
            context.lineTo(100, 50);
            context.stroke();
            
            // Arrowhead
            context.beginPath();
            context.moveTo(90, 60);
            context.lineTo(100, 50);
            context.lineTo(110, 60);
            context.stroke();
        }
    }

    //=============================================================================
    // Sprite_PowerMeter
    //=============================================================================
    class Sprite_PowerMeter extends Sprite {
        constructor(x, y, label) {
            super();
            this.x = x;
            this.y = y;
            this._label = label;
            this.bitmap = new Bitmap(60, 250);
            this.visible = false;
            this._value = 0;
        }

        setValue(value) {
            this._value = value;
            this.refresh();
        }

        refresh() {
            this.bitmap.clear();
            
            // Label
            this.bitmap.fontSize = 16;
            this.bitmap.textColor = '#FFD700';
            this.bitmap.drawText(this._label, 0, 0, 60, 20, 'center');
            
            // Meter background
            this.bitmap.fillRect(20, 30, 20, 200, 'rgba(0,0,0,0.5)');
            this.bitmap.strokeRect(20, 30, 20, 200, '#FFD700');
            
            // Fill
            const fillHeight = (this._value / 100) * 200;
            const gradient = this.bitmap._context.createLinearGradient(0, 230, 0, 30);
            gradient.addColorStop(0, '#ff0000');
            gradient.addColorStop(0.5, '#ffff00');
            gradient.addColorStop(1, '#00ff00');
            
            this.bitmap._context.fillStyle = gradient;
            this.bitmap._context.fillRect(22, 230 - fillHeight, 16, fillHeight);
        }
    }

    //=============================================================================
    // Sprite_SpinMeter
    //=============================================================================
    class Sprite_SpinMeter extends Sprite {
        constructor(x, y, label) {
            super();
            this.x = x;
            this.y = y;
            this._label = label;
            this.bitmap = new Bitmap(60, 250);
            this.visible = false;
            this._value = 0;
        }

        setValue(value) {
            this._value = value;
            this.refresh();
        }

        refresh() {
            this.bitmap.clear();
            
            // Label
            this.bitmap.fontSize = 16;
            this.bitmap.textColor = '#FFD700';
            this.bitmap.drawText(this._label, 0, 0, 60, 20, 'center');
            
            // Meter background
            this.bitmap.fillRect(20, 30, 20, 200, 'rgba(0,0,0,0.5)');
            this.bitmap.strokeRect(20, 30, 20, 200, '#FFD700');
            
            // Center line
            this.bitmap.fillRect(20, 129, 20, 2, '#888888');
            
            // Fill (from center)
            const normalizedValue = (this._value + 1) / 2; // Convert -1 to 1 range to 0 to 1
            const centerY = 130;
            const maxOffset = 100;
            const fillY = centerY - (normalizedValue - 0.5) * 2 * maxOffset;
            const fillHeight = Math.abs(fillY - centerY);
            
            const gradient = this.bitmap._context.createLinearGradient(0, 30, 0, 230);
            gradient.addColorStop(0, '#0088ff');
            gradient.addColorStop(0.5, '#ffffff');
            gradient.addColorStop(1, '#ff8800');
            
            this.bitmap._context.fillStyle = gradient;
            if (normalizedValue > 0.5) {
                this.bitmap._context.fillRect(22, fillY, 16, fillHeight);
            } else {
                this.bitmap._context.fillRect(22, centerY, 16, fillHeight);
            }
        }
    }

    //=============================================================================
    // Window_BowlingStatus
    //=============================================================================
    class Window_BowlingStatus extends Window_Base {
        constructor() {
            super(new Rectangle(0, Graphics.height - 60, Graphics.width, 60));
            this.setBackgroundType(1);
        }

        setText(text) {
            this.contents.clear();
            this.drawText(text, 0, 0, this.contentsWidth(), 'center');
        }
    }

    //=============================================================================
    // Window_BowlingResult
    //=============================================================================
    class Window_BowlingResult extends Window_Base {
        constructor() {
            super(new Rectangle(0, 0, 400, 200));
            this.setBackgroundType(0);
        }

        setText(result, score) {
            this.contents.clear();
            
            this.contents.fontSize = 36;
            this.changeTextColor(result === "VICTORY!" ? '#00ff00' : result === "DEFEAT" ? '#ff0000' : '#ffff00');
            this.drawText(result, 0, 20, this.contentsWidth(), 'center');
            
            this.contents.fontSize = 24;
            this.resetTextColor();
            this.drawText(score, 0, 80, this.contentsWidth(), 'center');
        }
    }

})();
/*:
 * @target MZ
 * @plugindesc Pool Game v1.0.0
 * @author Omni-Lex
 * @help
 * ============================================================================
 * Pool Game Plugin for RPG Maker MZ
 * ============================================================================
 * 
 * This plugin adds a fully playable pool game to your RPG Maker MZ project.
 * The game features realistic physics, ball collisions, and a top-down view.
 * 
 * Controls:
 * - Arrow Keys: Rotate the cue stick
 * - Hold Space: Charge power (release to shoot)
 * - ESC: Exit the game
 * 
 * Player 2 is controlled by CPU
 * 
 * @command openPoolGame
 * @text Open Pool Game
 * @desc Opens the pool game scene
 * 
 */

(() => {
    'use strict';
    
    const pluginName = 'PoolGame';
    
    // Plugin Commands
    PluginManager.registerCommand(pluginName, 'openPoolGame', args => {
        SceneManager.push(Scene_Pool);
    });
    
    // Pool Game Scene
    class Scene_Pool extends Scene_Base {
        create() {
            super.create();
            this.createBackground();
            this.createPoolGame();
            this.createUI();
        }
        
        createBackground() {
            this._backgroundSprite = new Sprite();
            this._backgroundSprite.bitmap = new Bitmap(Graphics.width, Graphics.height);
            this._backgroundSprite.bitmap.fillAll('#1a1a1a');
            this.addChild(this._backgroundSprite);
        }
        
        createPoolGame() {
            this._poolGame = new PoolGame();
            this.addChild(this._poolGame);
        }
        
        createUI() {
            this._exitButton = new Sprite_Button('cancel');
            this._exitButton.x = Graphics.width - 100;
            this._exitButton.y = 20;
            this._exitButton.setClickHandler(this.popScene.bind(this));
            this.addChild(this._exitButton);
            
            // Info text
            this._infoText = new Sprite();
            this._infoText.bitmap = new Bitmap(600, 150);
            this._infoText.bitmap.fontSize = 20;
            this._infoText.x = 20;
            this._infoText.y = 20;
            this.addChild(this._infoText);
            this.updateInfo();
        }
        
        updateInfo() {
            const bitmap = this._infoText.bitmap;
            bitmap.clear();
            bitmap.textColor = '#ffffff';
            const playerText = this._poolGame.currentPlayer === 1 ? 'Player 1 (You)' : 'Player 2 (CPU)';
            bitmap.drawText(playerText, 0, 0, 600, 30, 'left');
            if (this._poolGame.currentPlayer === 1) {
                bitmap.drawText(`Arrow Keys: Aim | Hold Space: Charge Power | Release: Shoot`, 0, 30, 600, 30, 'left');
                bitmap.drawText(`Power: ${Math.floor(this._poolGame.power * 100)}%`, 0, 60, 600, 30, 'left');
            } else {
                bitmap.drawText(`CPU is thinking...`, 0, 30, 600, 30, 'left');
            }
        }
        
        update() {
            super.update();
            if (Input.isTriggered('cancel')) {
                this.popScene();
            }
            this.updateInfo();
        }
    }
    
    // Pool Game Class
    class PoolGame extends PIXI.Container {
        constructor() {
            super();
            this.currentPlayer = 1;
            this.balls = [];
            this.pockets = [];
            this.cueBall = null;
            this.ballsMoving = false;
            this.cueAngle = 0;
            this.power = 0;
            this.isCharging = false;
            this.powerDirection = 1;
            this.cpuThinking = false;
            this.cpuShotTimer = 0;
            
            this.setupTable();
            this.setupBalls();
            this.setupCueStick();
            
            // Start game loop
            this.ticker = new PIXI.Ticker();
            this.ticker.add(this.update, this);
            this.ticker.start();
        }
        
        setupTable() {
            // Table dimensions
            this.tableWidth = 700;
            this.tableHeight = 350;
            this.tableX = (Graphics.width - this.tableWidth) / 2;
            this.tableY = (Graphics.height - this.tableHeight) / 2;
            
            // Draw table
            const table = new PIXI.Graphics();
            table.beginFill(0x0d5c0d);
            table.drawRect(this.tableX, this.tableY, this.tableWidth, this.tableHeight);
            table.endFill();
            
            // Draw rails
            table.lineStyle(10, 0x8b4513);
            table.drawRect(this.tableX - 5, this.tableY - 5, this.tableWidth + 10, this.tableHeight + 10);
            
            this.addChild(table);
            
            // Setup pockets
            const pocketRadius = 20;
            const pocketPositions = [
                {x: this.tableX, y: this.tableY},
                {x: this.tableX + this.tableWidth / 2, y: this.tableY},
                {x: this.tableX + this.tableWidth, y: this.tableY},
                {x: this.tableX, y: this.tableY + this.tableHeight},
                {x: this.tableX + this.tableWidth / 2, y: this.tableY + this.tableHeight},
                {x: this.tableX + this.tableWidth, y: this.tableY + this.tableHeight}
            ];
            
            pocketPositions.forEach(pos => {
                const pocket = new PIXI.Graphics();
                pocket.beginFill(0x000000);
                pocket.drawCircle(0, 0, pocketRadius);
                pocket.endFill();
                pocket.x = pos.x;
                pocket.y = pos.y;
                this.addChild(pocket);
                this.pockets.push({x: pos.x, y: pos.y, radius: pocketRadius});
            });
        }
        
        setupBalls() {
            const ballRadius = 12;
            const startX = this.tableX + this.tableWidth * 0.75;
            const startY = this.tableY + this.tableHeight / 2;
            
            // Cue ball
            this.cueBall = this.createBall(this.tableX + this.tableWidth * 0.25, startY, 0xffffff, ballRadius, 0);
            
            // Rack formation
            const colors = [
                0xffff00, 0x0000ff, 0xff0000, 0x800080, 0xffa500,
                0x008000, 0x8b4513, 0x000000, 0xffff00, 0x0000ff,
                0xff0000, 0x800080, 0xffa500, 0x008000, 0x8b4513
            ];
            
            let ballIndex = 0;
            for (let row = 0; row < 5; row++) {
                for (let col = 0; col <= row; col++) {
                    const x = startX + row * ballRadius * 1.8;
                    const y = startY + (col - row / 2) * ballRadius * 2.1;
                    this.createBall(x, y, colors[ballIndex], ballRadius, ballIndex + 1);
                    ballIndex++;
                }
            }
        }
        
        createBall(x, y, color, radius, number) {
            const ball = new PIXI.Container();
            
            // Ball graphic
            const circle = new PIXI.Graphics();
            circle.beginFill(color);
            circle.drawCircle(0, 0, radius);
            circle.endFill();
            
            // Add stripe for balls 9-15
            if (number > 8) {
                circle.beginFill(0xffffff);
                circle.drawRect(-radius * 0.8, -radius * 0.3, radius * 1.6, radius * 0.6);
                circle.endFill();
            }
            
            ball.addChild(circle);
            
            // Add number
            if (number > 0) {
                const text = new PIXI.Text(number.toString(), {
                    fontFamily: 'Arial',
                    fontSize: 12,
                    fill: number === 8 ? 0xffffff : 0x000000,
                    align: 'center'
                });
                text.anchor.set(0.5);
                ball.addChild(text);
            }
            
            ball.x = x;
            ball.y = y;
            ball.vx = 0;
            ball.vy = 0;
            ball.radius = radius;
            ball.number = number;
            ball.isPocketed = false;
            
            this.balls.push(ball);
            this.addChild(ball);
            
            return ball;
        }
        
        setupCueStick() {
            // Create cue stick container
            this.cueStick = new PIXI.Container();
            
            // Draw the cue stick
            const stick = new PIXI.Graphics();
            stick.beginFill(0x8B4513); // Brown color
            stick.drawRect(0, -3, 200, 6); // Main shaft
            stick.endFill();
            
            // Add tip
            stick.beginFill(0x000000);
            stick.drawRect(0, -2, 10, 4);
            stick.endFill();
            
            // Add decorative rings
            stick.beginFill(0xFFD700);
            stick.drawRect(50, -4, 5, 8);
            stick.drawRect(150, -4, 5, 8);
            stick.endFill();
            
            this.cueStick.addChild(stick);
            
            // Add aiming line
            this.aimLine = new PIXI.Graphics();
            this.cueStick.addChild(this.aimLine);
            
            // Add power indicator
            this.powerBar = new PIXI.Graphics();
            this.addChild(this.powerBar);
            
            this.addChild(this.cueStick);
        }
        
        updateCueStick() {
            if (this.ballsMoving || !this.cueBall || this.cueBall.isPocketed) {
                this.cueStick.visible = false;
                return;
            }
            
            this.cueStick.visible = true;
            
            // Position cue stick at cue ball
            this.cueStick.x = this.cueBall.x;
            this.cueStick.y = this.cueBall.y;
            
            // Set rotation
            this.cueStick.rotation = this.cueAngle;
            
            // Offset based on power - moved back more from the ball
            const baseOffset = 50; // Increased base offset
            const offset = baseOffset + this.power * 50;
            this.cueStick.children[0].x = -offset;
            
            // Update aim line
            this.aimLine.clear();
            this.aimLine.lineStyle(2, 0xFFFFFF, 0.3);
            this.aimLine.moveTo(0, 0);
            this.aimLine.lineTo(300, 0);
            
            // Update power bar
            this.powerBar.clear();
            if (this.isCharging || (this.currentPlayer === 2 && this.cpuThinking)) {
                const barWidth = 200;
                const barHeight = 20;
                const barX = (Graphics.width - barWidth) / 2;
                const barY = Graphics.height - 100;
                
                // Background
                this.powerBar.beginFill(0x333333);
                this.powerBar.drawRect(barX, barY, barWidth, barHeight);
                this.powerBar.endFill();
                
                // Power fill
                const color = this.power < 0.5 ? 0x00FF00 : this.power < 0.8 ? 0xFFFF00 : 0xFF0000;
                this.powerBar.beginFill(color);
                this.powerBar.drawRect(barX, barY, barWidth * this.power, barHeight);
                this.powerBar.endFill();
                
                // Border
                this.powerBar.lineStyle(2, 0xFFFFFF);
                this.powerBar.drawRect(barX, barY, barWidth, barHeight);
            }
        }
        
        handleInput() {
            if (this.ballsMoving || this.currentPlayer !== 1) return;
            
            // Rotation - reduced sensitivity
            const rotSpeed = 0.02; // Reduced from 0.05
            if (Input.isPressed('left')) {
                this.cueAngle -= rotSpeed;
            }
            if (Input.isPressed('right')) {
                this.cueAngle += rotSpeed;
            }
            
            // Power charging
            if (Input.isPressed('ok') || Input.isLongPressed('ok')) {
                this.isCharging = true;
                this.power += this.powerDirection * 0.02;
                
                // Oscillate power for better control
                if (this.power >= 1) {
                    this.power = 1;
                    this.powerDirection = -1;
                } else if (this.power <= 0) {
                    this.power = 0;
                    this.powerDirection = 1;
                }
            } else if (this.isCharging) {
                // Release - shoot!
                this.shoot();
                this.isCharging = false;
                this.power = 0;
                this.powerDirection = 1;
            }
        }
        
        handleCPU() {
            if (this.ballsMoving || this.currentPlayer !== 2 || !this.cueBall || this.cueBall.isPocketed) return;
            
            if (!this.cpuThinking) {
                this.cpuThinking = true;
                this.cpuShotTimer = 0;
                
                // Find best shot
                const targetBall = this.findBestTarget();
                if (targetBall) {
                    // Calculate angle to target
                    const dx = targetBall.x - this.cueBall.x;
                    const dy = targetBall.y - this.cueBall.y;
                    this.cpuTargetAngle = Math.atan2(dy, dx);
                    
                    // Add some randomness for realism
                    this.cpuTargetAngle += (Math.random() - 0.5) * 0.2;
                    
                    // Calculate power based on distance
                    const distance = Math.hypot(dx, dy);
                    this.cpuTargetPower = Math.min(distance / 300, 0.8) + Math.random() * 0.2;
                }
            }
            
            // Animate CPU shot
            if (this.cpuThinking) {
                this.cpuShotTimer++;
                
                // Rotate to target angle
                const angleDiff = this.cpuTargetAngle - this.cueAngle;
                this.cueAngle += angleDiff * 0.1;
                
                // Charge power
                if (this.cpuShotTimer > 30 && this.cpuShotTimer < 90) {
                    this.power = Math.min(this.power + 0.02, this.cpuTargetPower);
                }
                
                // Shoot
                if (this.cpuShotTimer > 100) {
                    this.shoot();
                    this.cpuThinking = false;
                    this.power = 0;
                }
            }
        }
        
        findBestTarget() {
            // Simple AI: find closest ball that has a clear path
            let bestBall = null;
            let bestDistance = Infinity;
            
            for (const ball of this.balls) {
                if (ball.isPocketed || ball === this.cueBall) continue;
                
                const dx = ball.x - this.cueBall.x;
                const dy = ball.y - this.cueBall.y;
                const distance = Math.hypot(dx, dy);
                
                // Check if path is clear (simple check)
                let pathClear = true;
                const steps = 10;
                for (let i = 1; i < steps; i++) {
                    const checkX = this.cueBall.x + (dx * i / steps);
                    const checkY = this.cueBall.y + (dy * i / steps);
                    
                    for (const otherBall of this.balls) {
                        if (otherBall === ball || otherBall === this.cueBall || otherBall.isPocketed) continue;
                        
                        const checkDist = Math.hypot(otherBall.x - checkX, otherBall.y - checkY);
                        if (checkDist < this.cueBall.radius * 2) {
                            pathClear = false;
                            break;
                        }
                    }
                    if (!pathClear) break;
                }
                
                if (pathClear && distance < bestDistance) {
                    bestDistance = distance;
                    bestBall = ball;
                }
            }
            
            return bestBall || this.balls.find(b => !b.isPocketed && b !== this.cueBall);
        }
        
        shoot() {
            if (!this.cueBall || this.cueBall.isPocketed) return;
            
            const speed = this.power * 20; // Max speed of 20
            this.cueBall.vx = Math.cos(this.cueAngle) * speed;
            this.cueBall.vy = Math.sin(this.cueAngle) * speed;
        }
        
        update(delta) {
            if (this.currentPlayer === 1) {
                this.handleInput();
            } else {
                this.handleCPU();
            }
            
            this.updateCueStick();
            
            const friction = 0.985;
            const minVelocity = 0.1;
            let anyMoving = false;
            
            // Update ball positions
            this.balls.forEach(ball => {
                if (ball.isPocketed) return;
                
                // Apply friction
                ball.vx *= friction;
                ball.vy *= friction;
                
                // Stop if velocity is too low
                if (Math.abs(ball.vx) < minVelocity) ball.vx = 0;
                if (Math.abs(ball.vy) < minVelocity) ball.vy = 0;
                
                // Update position
                ball.x += ball.vx;
                ball.y += ball.vy;
                
                // Check if moving
                if (ball.vx !== 0 || ball.vy !== 0) anyMoving = true;
                
                // Wall collisions
                if (ball.x - ball.radius < this.tableX || ball.x + ball.radius > this.tableX + this.tableWidth) {
                    ball.vx = -ball.vx * 0.8;
                    ball.x = Math.max(this.tableX + ball.radius, Math.min(this.tableX + this.tableWidth - ball.radius, ball.x));
                }
                if (ball.y - ball.radius < this.tableY || ball.y + ball.radius > this.tableY + this.tableHeight) {
                    ball.vy = -ball.vy * 0.8;
                    ball.y = Math.max(this.tableY + ball.radius, Math.min(this.tableY + this.tableHeight - ball.radius, ball.y));
                }
            });
            
            // Ball-to-ball collisions
            for (let i = 0; i < this.balls.length; i++) {
                for (let j = i + 1; j < this.balls.length; j++) {
                    const ball1 = this.balls[i];
                    const ball2 = this.balls[j];
                    
                    if (ball1.isPocketed || ball2.isPocketed) continue;
                    
                    const dx = ball2.x - ball1.x;
                    const dy = ball2.y - ball1.y;
                    const dist = Math.hypot(dx, dy);
                    
                    if (dist < ball1.radius + ball2.radius) {
                        // Collision detected
                        const nx = dx / dist;
                        const ny = dy / dist;
                        
                        // Relative velocity
                        const dvx = ball2.vx - ball1.vx;
                        const dvy = ball2.vy - ball1.vy;
                        const dvn = dvx * nx + dvy * ny;
                        
                        // Don't resolve if velocities are separating
                        if (dvn > 0) continue;
                        
                        // Collision impulse
                        const impulse = dvn;
                        
                        // Apply impulse
                        ball1.vx += impulse * nx;
                        ball1.vy += impulse * ny;
                        ball2.vx -= impulse * nx;
                        ball2.vy -= impulse * ny;
                        
                        // Separate balls
                        const overlap = ball1.radius + ball2.radius - dist;
                        const separateX = nx * overlap / 2;
                        const separateY = ny * overlap / 2;
                        ball1.x -= separateX;
                        ball1.y -= separateY;
                        ball2.x += separateX;
                        ball2.y += separateY;
                    }
                }
            }
            
            // Check pockets
            this.balls.forEach(ball => {
                if (ball.isPocketed) return;
                
                this.pockets.forEach(pocket => {
                    const dist = Math.hypot(ball.x - pocket.x, ball.y - pocket.y);
                    if (dist < pocket.radius) {
                        ball.isPocketed = true;
                        ball.visible = false;
                        
                        // Check game state
                        if (ball.number === 0) {
                            // Cue ball pocketed - respawn
                            setTimeout(() => {
                                ball.x = this.tableX + this.tableWidth * 0.25;
                                ball.y = this.tableY + this.tableHeight / 2;
                                ball.vx = 0;
                                ball.vy = 0;
                                ball.isPocketed = false;
                                ball.visible = true;
                            }, 1000);
                        } else if (ball.number === 8) {
                            // 8-ball pocketed - game over
                            this.gameOver();
                        }
                    }
                });
            });
            
            this.ballsMoving = anyMoving;
            
            // Switch players when balls stop
            if (!this.ballsMoving && this.wasMoving) {
                this.currentPlayer = this.currentPlayer === 1 ? 2 : 1;
                if (this.parent && this.parent.updateInfo) {
                    this.parent.updateInfo();
                }
            }
            
            this.wasMoving = this.ballsMoving;
        }
        
        gameOver() {
            // Simple game over - you can expand this
            const winner = this.currentPlayer === 1 ? 'You Win!' : 'CPU Wins!';
            const gameOverText = new PIXI.Text(winner, {
                fontFamily: 'Arial',
                fontSize: 48,
                fill: 0xFFFFFF,
                align: 'center',
                stroke: 0x000000,
                strokeThickness: 5
            });
            gameOverText.anchor.set(0.5);
            gameOverText.x = Graphics.width / 2;
            gameOverText.y = Graphics.height / 2;
            this.addChild(gameOverText);
        }
        
        destroy() {
            this.ticker.destroy();
            super.destroy();
        }
    }
    
    // Register the scene
    window.Scene_Pool = Scene_Pool;
})();
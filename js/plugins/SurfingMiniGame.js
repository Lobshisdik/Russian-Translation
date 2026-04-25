/*:
 * @target MZ
 * @plugindesc Surfing Mini-Game v1.1.0
 * @author Omni-Lex (modified by OmniLex)
 * @version 1.1.0
 * @description A 2D surfing mini-game with realistic wave physics, a starting coast, and infinite scrolling.
 * * @param surferPicture
 * @text Surfer Picture
 * @desc Picture file name for the surfer sprite (from img/pictures/)
 * @type string
 * @default surfer
 * * @command startSurfingGame
 * @text Start Surfing Game
 * @desc Opens the Surfing mini-game
 * * @help SurfingMiniGame.js
 * * This plugin creates a surfing mini-game with:
 * - A starting coast on the left.
 * - Infinite horizontal scrolling.
 * - Smoother, slower, and higher waves.
 * - Realistic wave physics.
 * - Dynamic day/night water and sky colors.
 * - Action button to jump and ride waves.
 * - Cancel button to exit.
 * * Use the plugin command "Start Surfing Game" or script call: 
 * SceneManager.push(Scene_SurfingGame);
 */

(() => {
    'use strict';

    const pluginName = 'SurfingMiniGame';
    const parameters = PluginManager.parameters(pluginName);
    const surferPicture = parameters['surferPicture'] || 'surfer';

    // =============================================================================
    // Time Management Functions
    // =============================================================================

    function getGameDate() {
        // Get game date from TimeDateSystem (Variable 114: total minutes elapsed)
        // Base date: Jan 1, 2001 12:00
        const gameTimeMinutes = $gameVariables ? $gameVariables.value(114) || 0 : 0;
        const baseDate = new Date(2001, 0, 1, 12, 0, 0);
        return new Date(baseDate.getTime() + gameTimeMinutes * 60 * 1000);
    }

    function getGameTimeHourAndMinute() {
        // Get game time from TimeDateSystem (Variable 114: total minutes elapsed)
        const gameDate = getGameDate();
        const hours = gameDate.getHours();
        const minutes = gameDate.getMinutes();
        return { hours, minutes };
    }

    // Scene for the surfing mini-game
    class Scene_SurfingGame extends Scene_Base {
        initialize() {
            super.initialize();
        }
        
        create() {
            super.create();
            this.createBackground();
            
            // World container for scrolling elements
            this.worldContainer = new PIXI.Container();
            this.addChild(this.worldContainer);
            
            this.createCoast();
            this.createWaveSystem();
            this.createSurfer();
            
            // Game state
            this.time = 0;
            this.cameraX = 0;
            this.surferScreenX = Graphics.width * 0.2; // Surfer's fixed position on screen
            this.worldX = 80; // Surfer's actual position in the world
            this.surferY = this.coastHeight - 15; // Initial Y on coast
            this.surferVelocityY = 0;
            this.surferVelocityX = 0; // Kept for potential future use
            this.onWave = false;
            this.jumping = false;
            this.onCoast = true;
            
            // Add instructions text
            this.createInstructions();
        }
        
        createBackground() {
            // Create sky gradient based on time of day
            this.skyContainer = new PIXI.Container();
            this.addChild(this.skyContainer);
            
            this.skyGradient = new PIXI.Graphics();
            this.skyContainer.addChild(this.skyGradient);
            
            this.updateSkyColor();
        }

        createCoast() {
            this.coastWidth = 200;
            this.coastHeight = Graphics.height * 0.8;
            this.coast = new PIXI.Graphics();
            this.coast.beginFill(0xFFD700); // Yellow color for sand
            this.coast.drawRect(0, this.coastHeight, this.coastWidth, Graphics.height - this.coastHeight);
            this.coast.endFill();
            this.worldContainer.addChild(this.coast);
        }
        
        createWaveSystem() {
            this.waveContainer = new PIXI.Container();
            this.worldContainer.addChild(this.waveContainer);
            
            this.waves = [];
            this.wavePoints = [];
            
            const numPoints = 100; // Increased for smoother waves
            const waveWidth = Graphics.width * 2; // Wider segment for less frequent wrapping
            this.pointSpacing = waveWidth / numPoints;
            this.waveSegmentWidth = waveWidth;
            
            for (let i = 0; i <= numPoints; i++) {
                this.wavePoints.push({
                    x: i * this.pointSpacing,
                    baseY: Graphics.height * 0.8, // Lowered base for higher waves
                    amplitude: 50 + Math.random() * 40, // Increased for higher waves
                    frequency: 0.01 + Math.random() * 0.02,
                    phase: Math.random() * Math.PI * 2,
                    speed: 0.01 + Math.random() * 0.015 // Decreased for slower waves
                });
            }
            
            for (let layer = 0; layer < 3; layer++) {
                const wave = new PIXI.Graphics();
                wave.alpha = 0.8 - layer * 0.2;
                this.waves.push(wave);
                this.waveContainer.addChild(wave);
            }
        }
        
        createSurfer() {
            this.surferContainer = new PIXI.Container();
            this.worldContainer.addChild(this.surferContainer);
            
            this.surfer = new PIXI.Graphics();
            this.surfer.beginFill(0xFF6B35);
            this.surfer.drawRect(-10, -15, 20, 30);
            this.surfer.endFill();
            
            this.surfboard = new PIXI.Graphics();
            this.surfboard.beginFill(0xFFFFFF);
            this.surfboard.drawRect(-15, -3, 30, 6);
            this.surfboard.endFill();
            
            this.surferContainer.addChild(this.surfboard);
            this.surferContainer.addChild(this.surfer);
            
            this.surferContainer.x = this.worldX;
            this.surferContainer.y = this.surferY;
        }
        
        createInstructions() {
            const instructionText = new PIXI.Text(
                'Use Arrow Keys to move. Z/Enter to jump! X/ESC to exit',
                {
                    fontFamily: 'Arial',
                    fontSize: 24,
                    fill: 0xFFFFFF,
                    stroke: 0x000000,
                    strokeThickness: 3
                }
            );
            instructionText.x = 10;
            instructionText.y = 10;
            this.addChild(instructionText);
        }
        
        update() {
            super.update();
            
            if (Input.isTriggered('cancel') || Input.isTriggered('escape')) {
                this.popScene();
                return;
            }
            
            this.time += 1/60;
            
            this.updateSurfer();
            this.updateWorld();
        }

        updateWorld() {
            this.cameraX = Math.max(0, this.worldX - this.surferScreenX);
            this.worldContainer.x = -this.cameraX;

            this.updateWaves();
            this.updateSkyColor();
        }
        
        updateWaves() {
            // Recycle wave points for infinite scrolling
            this.wavePoints.forEach(point => {
                // If a point has scrolled far off the left side of the camera view
                if (point.x < this.cameraX - 150) {
                    point.x += this.waveSegmentWidth;
                }
                // If a point has scrolled far off the right side
                if (point.x > this.cameraX + Graphics.width + 150) {
                    point.x -= this.waveSegmentWidth;
                }
            });
            // Sort to keep them in order for drawing
            this.wavePoints.sort((a, b) => a.x - b.x);

            this.wavePoints.forEach(point => {
                point.phase += point.speed;
            });
            
            this.waves.forEach((wave, layerIndex) => {
                wave.clear();
                const waveColor = this.getWaveColor(layerIndex);
                wave.beginFill(waveColor);
                
                const points = [];
                // Start from the first point in the sorted array
                const firstPoint = this.wavePoints[0];
                points.push(firstPoint.x, Graphics.height);
                
                for (let i = 0; i < this.wavePoints.length; i++) {
                    const point = this.wavePoints[i];
                    const waveY = point.baseY + 
                        Math.sin(this.time * 2 + point.phase) * point.amplitude * (1 - layerIndex * 0.3);
                    points.push(point.x, waveY);
                }
                
                // Complete the polygon to the last point
                const lastPoint = this.wavePoints[this.wavePoints.length - 1];
                points.push(lastPoint.x, Graphics.height);
                
                wave.drawPolygon(points);
                wave.endFill();
            });
        }
        
        updateSurfer() {
            // Horizontal Movement
            const horizontalSpeed = 3;
            if (Input.isPressed('right')) {
                this.worldX += horizontalSpeed;
            }
            if (Input.isPressed('left')) {
                this.worldX -= horizontalSpeed;
            }

            // Determine if on coast (and not jumping off it)
            this.onCoast = (this.worldX < this.coastWidth) && !this.jumping;
            
            // Handle jumping
            if ((Input.isTriggered('ok') || Input.isTriggered('pageup')) && (this.onCoast || this.onWave) && !this.jumping) {
                this.surferVelocityY = -8;
                this.jumping = true;
                this.onWave = false;
                if (this.onCoast) {
                    this.onCoast = false;
                }
                
                if ($dataSystem.sounds && $dataSystem.sounds.cursor) {
                    AudioManager.playSe($dataSystem.sounds.cursor);
                }
            }

            // On the coast physics
            if (this.onCoast) {
                this.surferY = this.coastHeight - 15;
                this.surferVelocityY = 0;
                this.jumping = false;
                this.onWave = false;
                this.surferContainer.rotation = 0;
            } 
            // In the water / air physics
            else {
                this.surferVelocityY += 0.3; // Apply gravity
                this.surferY += this.surferVelocityY;
                
                const waveHeight = this.getWaveHeightAt(this.worldX);
                
                // Check if surfer is landing on a wave
                if (this.surferY >= waveHeight && this.surferVelocityY >= 0) {
                    this.surferY = waveHeight;
                    this.surferVelocityY = 0;
                    this.jumping = false;
                    this.onWave = true;
                    
                    const slope = this.getWaveSlopeAt(this.worldX);
                    this.surferContainer.rotation = slope * 0.3;
                } else {
                    this.onWave = false;
                }
            }
            
            // Prevent moving back past the start of the coast
            this.worldX = Math.max(this.worldX, 40);

            // Reset if surfer falls too far down
            if (this.surferY > Graphics.height + 50) {
                this.worldX = 80;
                this.surferY = this.coastHeight - 15;
                this.surferVelocityY = 0;
                this.jumping = false;
            }
            
            // Update sprite position in the world
            this.surferContainer.x = this.worldX;
            this.surferContainer.y = this.surferY;
        }
        
        getWaveHeightAt(x) {
            let leftPoint = this.wavePoints[0];
            let rightPoint = this.wavePoints[1];
            
            for (let i = 0; i < this.wavePoints.length - 1; i++) {
                if (x >= this.wavePoints[i].x && x <= this.wavePoints[i + 1].x) {
                    leftPoint = this.wavePoints[i];
                    rightPoint = this.wavePoints[i + 1];
                    break;
                }
            }
            
            const t = Math.max(0, Math.min(1, (x - leftPoint.x) / (rightPoint.x - leftPoint.x)));
            if (isNaN(t)) return leftPoint.baseY; // Avoid division by zero if points overlap

            const leftY = leftPoint.baseY + Math.sin(this.time * 2 + leftPoint.phase) * leftPoint.amplitude;
            const rightY = rightPoint.baseY + Math.sin(this.time * 2 + rightPoint.phase) * rightPoint.amplitude;
            
            return leftY + (rightY - leftY) * t;
        }
        
        getWaveSlopeAt(x) {
            const delta = 5;
            const leftHeight = this.getWaveHeightAt(x - delta);
            const rightHeight = this.getWaveHeightAt(x + delta);
            return Math.atan2(rightHeight - leftHeight, delta * 2);
        }
        
        checkWaveCollision() {
            // Placeholder for future enhancements
        }
        
        updateSkyColor() {
            // Use game time from TimeDateSystem instead of real time
            const { hours, minutes } = getGameTimeHourAndMinute();
            const timeOfDay = hours + minutes / 60;

            let skyColor1, skyColor2;

            // Dawn (5-7)
            if (timeOfDay >= 5 && timeOfDay < 7) {
                const t = (timeOfDay - 5) / 2;
                skyColor1 = this.lerpColor(0x1a1a2e, 0xff6b6b, t);
                skyColor2 = this.lerpColor(0x16213e, 0xffd93d, t);
            }
            // Day (7-17)
            else if (timeOfDay >= 7 && timeOfDay < 17) {
                skyColor1 = 0x87ceeb; // Sky blue
                skyColor2 = 0xf0f8ff; // Alice blue
            }
            // Sunset (17-19)
            else if (timeOfDay >= 17 && timeOfDay < 19) {
                const t = (timeOfDay - 17) / 2;
                skyColor1 = this.lerpColor(0x87ceeb, 0xff4757, t);
                skyColor2 = this.lerpColor(0xf0f8ff, 0xff6b35, t);
            }
            // Night (19-5)
            else {
                skyColor1 = 0x1a1a2e; // Dark blue
                skyColor2 = 0x16213e; // Darker blue
            }

            this.skyGradient.clear();
            this.skyGradient.beginFill(skyColor1);
            this.skyGradient.drawRect(0, 0, Graphics.width, Graphics.height * 0.6);
            this.skyGradient.endFill();

            this.skyGradient.beginFill(skyColor2);
            this.skyGradient.drawRect(0, Graphics.height * 0.6, Graphics.width, Graphics.height * 0.4);
            this.skyGradient.endFill();
        }
        
        getWaveColor(layer) {
            // Use game time from TimeDateSystem instead of real time
            const { hours } = getGameTimeHourAndMinute();
            let baseColor;

            if (hours >= 6 && hours < 18) {
                baseColor = [0x4a90e2, 0x357abd, 0x2563eb][layer];
            } else {
                baseColor = [0x1e3a8a, 0x1e40af, 0x1d4ed8][layer];
            }

            return baseColor;
        }
        
        lerpColor(color1, color2, t) {
            const r1 = (color1 >> 16) & 0xff;
            const g1 = (color1 >> 8) & 0xff;
            const b1 = color1 & 0xff;
            
            const r2 = (color2 >> 16) & 0xff;
            const g2 = (color2 >> 8) & 0xff;
            const b2 = color2 & 0xff;
            
            const r = Math.round(r1 + (r2 - r1) * t);
            const g = Math.round(g1 + (g2 - g1) * t);
            const b = Math.round(b1 + (b2 - b1) * t);
            
            return (r << 16) | (g << 8) | b;
        }
        
        popScene() {
            SceneManager.pop();
        }
        
        terminate() {
            super.terminate();
        }
    }
    
    window.Scene_SurfingGame = Scene_SurfingGame;
    
    PluginManager.registerCommand(pluginName, 'startSurfingGame', () => {
        SceneManager.push(Scene_SurfingGame);
    });
    
    window.startSurfingMiniGame = function() {
        SceneManager.push(Scene_SurfingGame);
    };
})();
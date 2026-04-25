/*:
 * @target MZ
 * @plugindesc v1.1 Simplified ASCII fishing minigame with wave effects and colors
 * @author Esoteric Heavy Industries
 * @help
 *
 * ASCII Fishing Minigame
 *
 * A fishing minigame featuring:
 * - Simple wave effects when hook enters water or catches fish
 * - ASCII cross-section visualization of water/pond environment
 * - Animated ASCII fishes with behavior
 * - Hook physics and line control
 * - Fish AI with swimming patterns
 * - Colorful ASCII rendering with Pixi.js
 *
 * Integration with MovementInteractionSystem:
 * - Add plugin command "openFishingMinigame" to open the minigame
 * - Can be called from fishing events or menu
 *
 * @command openFishingMinigame
 * @text Open Fishing Minigame
 * @desc Opens the fishing minigame scene
 *
 * @command closeFishingMinigame
 * @text Close Fishing Minigame
 * @desc Closes the fishing minigame scene
 *
 * @param gridWidth
 * @text Grid Width (characters)
 * @type number
 * @min 40
 * @max 200
 * @desc Width of the ASCII grid in characters
 * @default 80
 *
 * @param gridHeight
 * @text Grid Height (characters)
 * @type number
 * @min 15
 * @max 60
 * @desc Height of the ASCII grid in characters
 * @default 30
 *
 * @param characterSize
 * @text Character Size (pixels)
 * @type number
 * @min 8
 * @max 32
 * @desc Size of each ASCII character in pixels
 * @default 12
 *
 * @param fishCount
 * @text Number of Fish
 * @type number
 * @min 1
 * @max 50
 * @desc Number of fish to simulate
 * @default 8
 *
 * @param waveDamping
 * @text Wave Damping
 * @type number
 * @decimals 2
 * @min 0.8
 * @max 1.0
 * @desc How quickly waves dissipate (higher = longer waves)
 * @default 0.95
 *
 * @param gravity
 * @text Gravity Strength
 * @type number
 * @decimals 2
 * @min 0.01
 * @max 2.0
 * @desc Gravity effect on fish
 * @default 0.1
 *
 */

(() => {
    'use strict';

    const pluginName = "ASCIIPhysicsFishingMinigame";
    const parameters = PluginManager.parameters(pluginName);

    const gridWidth = Number(parameters.gridWidth || 80);
    const gridHeight = Number(parameters.gridHeight || 30);
    const characterSize = Number(parameters.characterSize || 12);
    const fishCount = Number(parameters.fishCount || 8);
    const waveDamping = Number(parameters.waveDamping || 0.95);
    const gravity = Number(parameters.gravity || 0.1);

    // Ensure PIXI is available
    if (typeof PIXI === 'undefined') {
        console.warn("PIXI.js not found. ASCIIPhysicsFishingMinigame requires PIXI.js");
        return;
    }

    //=============================================================================
    // Simple Wave System
    //=============================================================================

    class WaveSystem {
        constructor(width) {
            this.width = width;
            this.waves = new Array(width).fill(0);
            this.time = 0;
        }

        createWave(centerX, radius, strength) {
            const xi = Math.floor(centerX);
            for (let i = Math.max(0, xi - radius); i < Math.min(this.width, xi + radius + 1); i++) {
                const dist = Math.abs(i - xi);
                const falloff = 1 - (dist / radius);
                this.waves[i] += strength * falloff;
            }
        }

        update() {
            this.time++;
            // Damping: waves dissipate over time
            for (let i = 0; i < this.width; i++) {
                this.waves[i] *= waveDamping;
            }
        }

        getWaveHeightAt(x) {
            const xi = Math.floor(x);
            if (xi < 0 || xi >= this.width) return 0;
            return this.waves[xi];
        }
    }

    //=============================================================================
    // Fish AI and Behavior
    //=============================================================================

    class AsciiAFish {
        constructor(x, y, type = 0) {
            this.x = x;
            this.y = y;
            this.vx = (Math.random() - 0.5) * 0.5;
            this.vy = (Math.random() - 0.5) * 0.3;
            this.type = type % 4; // 4 fish types
            this.energy = 100;
            this.age = 0;
            this.direction = this.vx > 0 ? 1 : -1;
            this.behavior = 'idle'; // idle, fleeing, feeding, schooling
            this.behaviorTimer = Math.random() * 60;
            this.target = null;
        }

        getCharacter() {
            const chars = ['<', '>', 'ƒ', '∿'];
            return chars[this.type];
        }

        getColor() {
            const colors = [
                0xFFFFFF, // white
                0xFF8800, // orange
                0x00FFFF, // cyan
                0xFFFF00  // yellow
            ];
            return colors[this.type];
        }

        update(hookPos, allFish, gridWidth, gridHeight) {
            this.age++;
            this.energy -= 0.05;
            this.behaviorTimer--;

            if (this.behaviorTimer <= 0) {
                this.chooseBehavior(hookPos, allFish);
                this.behaviorTimer = 30 + Math.random() * 120;
            }

            // Gravity influence
            this.vy += gravity * 0.1;

            // Behavior execution
            switch (this.behavior) {
                case 'fleeing':
                    this.executeFleeing(hookPos);
                    break;
                case 'feeding':
                    this.executeFeeding();
                    break;
                case 'schooling':
                    this.executeSchooling(allFish);
                    break;
                default:
                    this.executeIdle();
            }

            // Friction and damping
            this.vx *= 0.98;
            this.vy *= 0.98;

            // Update position
            this.x += this.vx;
            this.y += this.vy;

            // Boundary wrapping (left/right) and bottom collision
            if (this.x < 0) this.x = gridWidth;
            if (this.x > gridWidth) this.x = 0;
            if (this.y > gridHeight - 2) {
                this.y = gridHeight - 2;
                this.vy = -Math.abs(this.vy) * 0.6; // Bounce
            }
            if (this.y < 1) {
                this.y = 1;
                this.vy = Math.abs(this.vy) * 0.6;
            }

            // Update direction
            if (this.vx > 0.1) this.direction = 1;
            else if (this.vx < -0.1) this.direction = -1;

            // Death check
            if (this.energy <= 0) {
                return false;
            }
            return true;
        }

        chooseBehavior(hookPos, allFish) {
            const distToHook = Math.hypot(hookPos.x - this.x, hookPos.y - this.y);

            if (distToHook < 8) {
                this.behavior = 'fleeing';
            } else if (Math.random() < 0.3) {
                this.behavior = 'schooling';
            } else if (Math.random() < 0.4) {
                this.behavior = 'idle';
            } else {
                this.behavior = 'feeding';
            }
        }

        executeFleeing(hookPos) {
            const dx = this.x - hookPos.x;
            const dy = this.y - hookPos.y;
            const dist = Math.hypot(dx, dy);
            if (dist > 0) {
                const force = 0.3;
                this.vx += (dx / dist) * force;
                this.vy += (dy / dist) * force * 0.5;
            }
            this.energy -= 0.1;
        }

        executeFeeding() {
            const targetX = Math.sin(this.age * 0.02) * 2 + this.x;
            const dx = targetX - this.x;
            this.vx += dx * 0.01;
            this.energy += 0.05; // Regain energy while feeding
        }

        executeSchooling(allFish) {
            let cx = 0, cy = 0, count = 0;
            for (const fish of allFish) {
                if (fish === this) continue;
                const dist = Math.hypot(fish.x - this.x, fish.y - this.y);
                if (dist < 10) {
                    cx += fish.x;
                    cy += fish.y;
                    count++;
                }
            }
            if (count > 0) {
                cx /= count;
                cy /= count;
                const dx = cx - this.x;
                const dy = cy - this.y;
                const dist = Math.hypot(dx, dy);
                if (dist > 0) {
                    this.vx += (dx / dist) * 0.05;
                    this.vy += (dy / dist) * 0.05;
                }
            }
        }

        executeIdle() {
            // Gentle wandering
            this.vx += (Math.random() - 0.5) * 0.05;
            this.vy += (Math.random() - 0.5) * 0.05;
        }
    }

    //=============================================================================
    // Hook Physics
    //=============================================================================

    class Hook {
        constructor(x, y) {
            this.x = x;
            this.y = y;
            this.lineX = x;
            this.lineY = 0;
            this.vx = 0;
            this.vy = 0;
            this.depth = y;
        }

        update(input, waveSystem) {
            // Input handling
            const speed = 0.5;
            if (input.left) this.lineX -= speed;
            if (input.right) this.lineX += speed;
            if (input.up) this.depth -= speed;
            if (input.down) this.depth += speed;

            // Clamp line position
            this.lineX = Math.max(2, Math.min(gridWidth - 2, this.lineX));
            this.depth = Math.max(1, Math.min(gridHeight - 3, this.depth));

            // Line tension
            const dx = this.x - this.lineX;
            const dy = this.y - this.depth;
            const dist = Math.hypot(dx, dy);
            const tension = 0.15;

            this.vx -= (dx / (dist + 0.1)) * tension;
            this.vy -= (dy / (dist + 0.1)) * tension;

            // Gravity
            this.vy += gravity;

            // Damping
            this.vx *= 0.92;
            this.vy *= 0.92;

            // Position update
            this.x += this.vx;
            this.y += this.vy;

            // Boundary
            this.x = Math.max(2, Math.min(gridWidth - 2, this.x));
            this.y = Math.max(1, Math.min(gridHeight - 1, this.y));

            // Create wave when hook enters water (depth > 3)
            if (this.depth > 3) {
                waveSystem.createWave(this.lineX, 2, 0.2);
            }
        }

        distanceTo(fish) {
            return Math.hypot(this.x - fish.x, this.y - fish.y);
        }
    }

    //=============================================================================
    // ASCII Renderer
    //=============================================================================

    class ASCIIRenderer {
        constructor(width, height) {
            this.width = width;
            this.height = height;
            this.canvas = [];
        }

        clear() {
            this.canvas = Array(this.height).fill(null).map(() =>
                Array(this.width).fill({ char: ' ', color: 0x808080 })
            );
        }

        drawWater(waveSystem) {
            // Draw water surface with wave visualization
            const waterColors = [0x1E90FF, 0x4169E1, 0x6495ED]; // Blue variations

            for (let x = 0; x < this.width; x++) {
                const waveHeight = waveSystem.getWaveHeightAt(x) * 2;
                const surfaceY = 3 + waveHeight;

                if (surfaceY >= 0 && surfaceY < this.height) {
                    const y = Math.floor(surfaceY);
                    if (y < this.height) {
                        // Use different wave characters based on wave intensity
                        let waveChar = '~';
                        let waveColor = waterColors[0];

                        const waveIntensity = Math.abs(waveHeight);
                        if (waveIntensity > 2) {
                            waveChar = '≈';
                            waveColor = waterColors[2];
                        } else if (waveIntensity > 1) {
                            waveChar = '∼';
                            waveColor = waterColors[1];
                        }

                        this.setChar(x, y, waveChar, waveColor);
                    }
                }
            }

            // Draw water fill with color gradient
            for (let x = 0; x < this.width; x++) {
                const surfaceY = Math.floor(3 + waveSystem.getWaveHeightAt(x) * 2);
                for (let y = surfaceY + 1; y < this.height - 2; y++) {
                    const depth = y - surfaceY;
                    // Darker blue the deeper you go
                    const colorIndex = Math.min(2, Math.floor(depth / 5));
                    const baseColor = waterColors[Math.max(0, 2 - colorIndex)];
                    this.setChar(x, y, '░', baseColor);
                }
            }
        }

        drawLine(hook) {
            // Bresenham line drawing for fishing line
            const x0 = Math.round(hook.lineX);
            const y0 = Math.round(hook.lineY);
            const x1 = Math.round(hook.x);
            const y1 = Math.round(hook.y);

            const points = this.bresenhamLine(x0, y0, x1, y1);
            // Line color changes from yellow (top) to orange (underwater)
            for (let i = 0; i < points.length; i++) {
                const point = points[i];
                if (point.x >= 0 && point.x < this.width &&
                    point.y >= 0 && point.y < this.height) {
                    // Gradient from yellow to orange as line goes deeper
                    const t = i / Math.max(1, points.length);
                    const color = t > 0.5 ? 0xFF8800 : 0xFFDD00; // Orange underwater, yellow above
                    this.setChar(point.x, point.y, '|', color);
                }
            }

            // Draw hook with color
            if (x1 >= 0 && x1 < this.width && y1 >= 0 && y1 < this.height) {
                this.setChar(x1, y1, 'Ԥ', 0xFF6600); // Orange hook
            }
        }

        drawFish(fish) {
            const x = Math.round(fish.x);
            const y = Math.round(fish.y);
            if (x >= 0 && x < this.width && y >= 0 && y < this.height) {
                this.setChar(x, y, fish.getCharacter(), fish.getColor());
            }
        }

        drawUI(score, caught) {
            // Score display with bright cyan
            const scoreStr = `FISH: ${caught} | SCORE: ${score}`;
            for (let i = 0; i < scoreStr.length; i++) {
                this.setChar(i, 0, scoreStr[i], 0x00FFFF); // Bright cyan
            }

            // Help text with dim gray
            const helpStr = "← → ↑ ↓ MOVE | SPACE CAST | ESC QUIT";
            const helpColor = 0x888888; // Dim gray
            for (let i = 0; i < helpStr.length && i < this.width; i++) {
                this.setChar(i, this.height - 1, helpStr[i], helpColor);
            }
        }

        setChar(x, y, char, color) {
            if (x >= 0 && x < this.width && y >= 0 && y < this.height) {
                this.canvas[y][x] = { char, color };
            }
        }

        bresenhamLine(x0, y0, x1, y1) {
            const points = [];
            const dx = Math.abs(x1 - x0);
            const dy = Math.abs(y1 - y0);
            const sx = x0 < x1 ? 1 : -1;
            const sy = y0 < y1 ? 1 : -1;
            let err = dx - dy;

            let x = x0, y = y0;
            while (true) {
                points.push({ x, y });
                if (x === x1 && y === y1) break;
                const e2 = 2 * err;
                if (e2 > -dy) { err -= dy; x += sx; }
                if (e2 < dx) { err += dx; y += sy; }
            }
            return points;
        }

        render() {
            return this.canvas;
        }
    }

    //=============================================================================
    // Fishing Minigame Scene
    //=============================================================================

    class Scene_FishingMinigame extends Scene_Base {
        initialize() {
            super.initialize();
            this.waveSystem = new WaveSystem(gridWidth);
            this.renderer = new ASCIIRenderer(gridWidth, gridHeight);
            this.fish = [];
            this.hook = new Hook(gridWidth / 2, gridHeight / 2);
            this.score = 0;
            this.caughtCount = 0;
            this.gameTime = 0;
            this.input = { left: false, right: false, up: false, down: false };
        }

        create() {
            super.create();

            // Create PIXI stage
            this.pixiStage = new PIXI.Container();
            this.addChild(this.pixiStage);

            // Initialize fish population
            for (let i = 0; i < fishCount; i++) {
                const fish = new AsciiAFish(
                    Math.random() * gridWidth * 0.8 + gridWidth * 0.1,
                    Math.random() * (gridHeight - 8) + 4,
                    Math.floor(Math.random() * 4)
                );
                this.fish.push(fish);
            }

            // Setup input
            this.setupInput();

            // Create monospace text for ASCII rendering
            this.textSprite = new PIXI.Text("", {
                fontFamily: 'monospace',
                fontSize: characterSize,
                fill: 0xFFFFFF,
                lineHeight: characterSize
            });
            this.pixiStage.addChild(this.textSprite);
        }

        setupInput() {
            document.addEventListener('keydown', (e) => this.handleKeyDown(e));
            document.addEventListener('keyup', (e) => this.handleKeyUp(e));
        }

        handleKeyDown(e) {
            if (!this._active) return;

            switch (e.key.toLowerCase()) {
                case 'arrowleft': case 'a': this.input.left = true; break;
                case 'arrowright': case 'd': this.input.right = true; break;
                case 'arrowup': case 'w': this.input.up = true; break;
                case 'arrowdown': case 's': this.input.down = true; break;
                case ' ': this.castLine(); break;
                case 'escape': SceneManager.pop(); break;
            }
        }

        handleKeyUp(e) {
            switch (e.key.toLowerCase()) {
                case 'arrowleft': case 'a': this.input.left = false; break;
                case 'arrowright': case 'd': this.input.right = false; break;
                case 'arrowup': case 'w': this.input.up = false; break;
                case 'arrowdown': case 's': this.input.down = false; break;
            }
        }

        castLine() {
            // Create wave at surface when casting
            this.waveSystem.createWave(this.hook.lineX, 3, 0.5);
        }

        update() {
            super.update();
            this.gameTime++;

            // Update physics
            this.hook.update(this.input, this.waveSystem);
            this.waveSystem.update();

            // Update fish
            const deadFish = [];
            for (let i = this.fish.length - 1; i >= 0; i--) {
                const fishAlive = this.fish[i].update(
                    { x: this.hook.x, y: this.hook.y },
                    this.fish,
                    gridWidth,
                    gridHeight
                );
                if (!fishAlive) {
                    deadFish.push(i);
                }

                // Check if hook catches fish
                if (this.hook.distanceTo(this.fish[i]) < 2) {
                    // Create wave when catching fish
                    this.waveSystem.createWave(this.hook.lineX, 4, 0.8);

                    this.score += 100 + Math.floor(this.fish[i].energy);
                    this.caughtCount++;
                    this.fish.splice(i, 1);
                }
            }

            // Respawn dead fish
            while (this.fish.length < fishCount) {
                const fish = new AsciiAFish(
                    Math.random() * gridWidth * 0.8 + gridWidth * 0.1,
                    Math.random() * (gridHeight - 8) + 4,
                    Math.floor(Math.random() * 4)
                );
                this.fish.push(fish);
            }

            // Render
            this.renderFrame();
        }

        renderFrame() {
            this.renderer.clear();
            this.renderer.drawWater(this.waveSystem);
            this.renderer.drawLine(this.hook);

            for (const fish of this.fish) {
                this.renderer.drawFish(fish);
            }

            this.renderer.drawUI(this.score, this.caughtCount);

            // Convert to PIXI text with colors
            const canvas = this.renderer.render();
            let asciiText = '';

            for (let y = 0; y < canvas.length; y++) {
                for (let x = 0; x < canvas[y].length; x++) {
                    asciiText += canvas[y][x].char;
                }
                asciiText += '\n';
            }

            this.textSprite.text = asciiText;

            // Update PIXI colors from canvas
            this.updatePixiColors(canvas);
        }

        updatePixiColors(canvas) {
            // Store color data for rendering (future enhancement: use PixiJS bitmap text with colors)
            this.canvasData = canvas;
        }
    }

    // Register plugin command
    PluginManager.registerCommand(pluginName, 'openFishingMinigame', function() {
        SceneManager.push(Scene_FishingMinigame);
    });

    PluginManager.registerCommand(pluginName, 'closeFishingMinigame', function() {
        SceneManager.pop();
    });

    // Global scene reference
    window.Scene_FishingMinigame = Scene_FishingMinigame;

})();

/*:
 * @target MZ
 * @plugindesc Procedural Analog Clock System v1.0.0
 * @author Omni-Lex
 * @help
 * ============================================================================
 * Procedural Analog Clock Plugin for RPG Maker MZ
 * ============================================================================
 * 
 * This plugin creates procedural analog clocks with appearances seeded by
 * map ID and event coordinates. The clock reads time from Variable 113.
 * 
 * Features:
 * - Multiple clock shapes (circle, square, hexagon, octagon)
 * - Different number styles (Arabic, Roman, dots, none)
 * - Various color schemes
 * - Different hand styles
 * - Rare inverted clocks for left-handed people
 * - Decorative frames
 * 
 * Plugin Commands:
 * - Show Clock: Display the clock at current event position
 * - Hide Clock: Hide the current clock
 * - Update Clock Position: Move clock to new coordinates
 * 
 * The Variable 113 should contain a timestamp in milliseconds.
 * 
 * @command showClock
 * @text Show Clock
 * @desc Shows the procedural clock at the current event position
 * 
 * @command hideClock
 * @text Hide Clock
 * @desc Hides the current clock
 * 
 * @command updateClockPosition
 * @text Update Clock Position
 * @desc Updates the clock position
 * @arg x
 * @type number
 * @desc X coordinate
 * @default 400
 * @arg y
 * @type number
 * @desc Y coordinate
 * @default 300
 * 
 * @param timeVariableId
 * @text Time Variable ID
 * @desc The ID of the variable containing the timestamp
 * @type variable
 * @default 113
 * 
 * @param clockSize
 * @text Clock Size
 * @desc Default size of the clock in pixels
 * @type number
 * @min 50
 * @max 500
 * @default 150
 * 
 * @param clockOpacity
 * @text Clock Opacity
 * @desc Opacity of the clock (0-255)
 * @type number
 * @min 0
 * @max 255
 * @default 230
 */

(() => {
    'use strict';

    const pluginName = 'ProceduralAnalogClock';
    const parameters = PluginManager.parameters(pluginName);
    const timeVariableId = Number(parameters['timeVariableId'] || 113);
    const defaultClockSize = Number(parameters['clockSize'] || 150);
    const clockOpacity = Number(parameters['clockOpacity'] || 230);

    // Seeded random number generator
    class SeededRandom {
        constructor(seed) {
            this.seed = seed;
        }

        next() {
            this.seed = (this.seed * 9301 + 49297) % 233280;
            return this.seed / 233280;
        }

        nextInt(min, max) {
            return Math.floor(this.next() * (max - min + 1)) + min;
        }

        nextFloat(min, max) {
            return this.next() * (max - min) + min;
        }

        choose(array) {
            return array[this.nextInt(0, array.length - 1)];
        }
    }

    // Clock configuration generator
    class ClockConfig {
        constructor(mapId, x, y) {
            const seed = (mapId * 10000 + x * 100 + y) % 233280;
            this.rng = new SeededRandom(seed);
            this.generate();
        }

        generate() {
            // Rare inverted clock (5% chance)
            this.isInverted = this.rng.next() < 0.05;

            // Shape
            this.shape = this.rng.choose(['circle', 'circle', 'circle', 'square', 'hexagon', 'octagon']);

            // Number style
            this.numberStyle = this.rng.choose(['arabic', 'arabic', 'roman', 'dots', 'none', 'mixed']);

            // Color scheme
            const colorSchemes = [
                { bg: 0xFFF8DC, frame: 0x8B4513, hands: 0x000000, numbers: 0x2F4F4F, accent: 0xDAA520 },
                { bg: 0x1C1C1C, frame: 0x4A4A4A, hands: 0xFFD700, numbers: 0xF0E68C, accent: 0xFFD700 },
                { bg: 0xE0FFFF, frame: 0x4682B4, hands: 0x191970, numbers: 0x000080, accent: 0x1E90FF },
                { bg: 0xFFF0F5, frame: 0xC71585, hands: 0x8B008B, numbers: 0xDA70D6, accent: 0xFF69B4 },
                { bg: 0xF0FFF0, frame: 0x228B22, hands: 0x006400, numbers: 0x2E8B57, accent: 0x32CD32 },
                { bg: 0xFFFAF0, frame: 0xB22222, hands: 0x8B0000, numbers: 0xDC143C, accent: 0xFF6347 },
                { bg: 0x2F4F4F, frame: 0xD3D3D3, hands: 0xFFFFFF, numbers: 0xF5F5F5, accent: 0xC0C0C0 }
            ];
            this.colors = this.rng.choose(colorSchemes);

            // Frame style
            this.frameStyle = this.rng.choose(['simple', 'ornate', 'double', 'gear', 'none']);

            // Hand styles
            this.hourHandStyle = this.rng.choose(['arrow', 'diamond', 'simple', 'ornate']);
            this.minuteHandStyle = this.rng.choose(['arrow', 'simple', 'needle', 'ornate']);
            this.secondHandStyle = this.rng.choose(['thin', 'needle', 'none', 'dot']);

            // Decorations
            this.hasMinuteMarks = this.rng.next() < 0.7;
            this.hasCenterDot = this.rng.next() < 0.8;
            this.hasDecorations = this.rng.next() < 0.3;

            // Size variations
            this.sizeMultiplier = this.rng.nextFloat(0.8, 1.2);
        }
    }

    // Main clock sprite class
    class Sprite_ProceduralClock extends PIXI.Container {
        constructor(mapId, eventX, eventY) {
            super();
            this.config = new ClockConfig(mapId, eventX, eventY);
            this.size = defaultClockSize * this.config.sizeMultiplier;
            this.createClock();
            this.alpha = clockOpacity / 255;
        }

        createClock() {
            this.clockContainer = new PIXI.Container();
            this.addChild(this.clockContainer);

            // Create background
            this.createBackground();

            // Create frame
            if (this.config.frameStyle !== 'none') {
                this.createFrame();
            }

            // Create hour marks or numbers
            this.createHourMarkers();

            // Create minute marks
            if (this.config.hasMinuteMarks) {
                this.createMinuteMarks();
            }

            // Create decorations
            if (this.config.hasDecorations) {
                this.createDecorations();
            }

            // Create hands
            this.createHands();

            // Create center dot
            if (this.config.hasCenterDot) {
                this.createCenterDot();
            }

            // Apply inversion if needed
            if (this.config.isInverted) {
                this.clockContainer.scale.x = -1;
            }
        }

        createBackground() {
            const graphics = new PIXI.Graphics();
            graphics.beginFill(this.config.colors.bg);

            switch (this.config.shape) {
                case 'circle':
                    graphics.drawCircle(0, 0, this.size / 2);
                    break;
                case 'square':
                    graphics.drawRect(-this.size / 2, -this.size / 2, this.size, this.size);
                    break;
                case 'hexagon':
                    this.drawPolygon(graphics, 6, this.size / 2);
                    break;
                case 'octagon':
                    this.drawPolygon(graphics, 8, this.size / 2);
                    break;
            }

            graphics.endFill();
            this.clockContainer.addChild(graphics);
        }

        createFrame() {
            const graphics = new PIXI.Graphics();
            const frameWidth = this.size / 20;

            switch (this.config.frameStyle) {
                case 'simple':
                    graphics.lineStyle(frameWidth, this.config.colors.frame);
                    this.drawShape(graphics, this.size / 2);
                    break;
                case 'ornate':
                    graphics.lineStyle(frameWidth * 1.5, this.config.colors.frame);
                    this.drawShape(graphics, this.size / 2);
                    graphics.lineStyle(frameWidth * 0.5, this.config.colors.accent);
                    this.drawShape(graphics, this.size / 2 - frameWidth);
                    break;
                case 'double':
                    graphics.lineStyle(frameWidth, this.config.colors.frame);
                    this.drawShape(graphics, this.size / 2);
                    graphics.lineStyle(frameWidth * 0.5, this.config.colors.frame);
                    this.drawShape(graphics, this.size / 2 - frameWidth * 2);
                    break;
                case 'gear':
                    this.createGearFrame(graphics);
                    break;
            }

            this.clockContainer.addChild(graphics);
        }

        createGearFrame(graphics) {
            const teeth = 12;
            const innerRadius = this.size / 2;
            const outerRadius = innerRadius * 1.1;
            
            graphics.beginFill(this.config.colors.frame);
            for (let i = 0; i < teeth; i++) {
                const angle = (i / teeth) * Math.PI * 2;
                const nextAngle = ((i + 1) / teeth) * Math.PI * 2;
                const midAngle = (angle + nextAngle) / 2;
                
                if (i === 0) {
                    graphics.moveTo(Math.cos(angle) * innerRadius, Math.sin(angle) * innerRadius);
                }
                
                graphics.lineTo(Math.cos(angle) * outerRadius, Math.sin(angle) * outerRadius);
                graphics.lineTo(Math.cos(midAngle) * outerRadius, Math.sin(midAngle) * outerRadius);
                graphics.lineTo(Math.cos(nextAngle) * innerRadius, Math.sin(nextAngle) * innerRadius);
            }
            graphics.endFill();
        }

        createHourMarkers() {
            const container = new PIXI.Container();

            for (let i = 1; i <= 12; i++) {
                const angle = (i / 12) * Math.PI * 2 - Math.PI / 2;
                const distance = this.size * 0.38;
                const x = Math.cos(angle) * distance;
                const y = Math.sin(angle) * distance;

                if (this.config.numberStyle === 'dots') {
                    const dot = new PIXI.Graphics();
                    dot.beginFill(this.config.colors.numbers);
                    dot.drawCircle(x, y, this.size / 40);
                    dot.endFill();
                    container.addChild(dot);
                } else if (this.config.numberStyle !== 'none') {
                    const number = this.createNumber(i);
                    number.x = x;
                    number.y = y;
                    container.addChild(number);
                }
            }

            this.clockContainer.addChild(container);
        }

        createNumber(num) {
            let text;
            
            if (this.config.numberStyle === 'roman') {
                text = this.toRoman(num);
            } else if (this.config.numberStyle === 'mixed') {
                text = (num % 3 === 0) ? this.toRoman(num) : num.toString();
            } else {
                text = num.toString();
            }

            const style = new PIXI.TextStyle({
                fontFamily: this.config.numberStyle === 'roman' ? 'serif' : 'Arial',
                fontSize: this.size / 12,
                fill: this.config.colors.numbers,
                fontWeight: 'bold'
            });

            const textSprite = new PIXI.Text(text, style);
            textSprite.anchor.set(0.5);
            
            // Compensate for inversion if needed
            if (this.config.isInverted) {
                textSprite.scale.x = -1;
            }
            
            return textSprite;
        }

        toRoman(num) {
            const romanNumerals = ['', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII'];
            return romanNumerals[num] || num.toString();
        }

        createMinuteMarks() {
            const graphics = new PIXI.Graphics();
            graphics.lineStyle(1, this.config.colors.numbers);

            for (let i = 0; i < 60; i++) {
                if (i % 5 !== 0) {
                    const angle = (i / 60) * Math.PI * 2 - Math.PI / 2;
                    const innerRadius = this.size * 0.45;
                    const outerRadius = this.size * 0.47;
                    
                    const x1 = Math.cos(angle) * innerRadius;
                    const y1 = Math.sin(angle) * innerRadius;
                    const x2 = Math.cos(angle) * outerRadius;
                    const y2 = Math.sin(angle) * outerRadius;
                    
                    graphics.moveTo(x1, y1);
                    graphics.lineTo(x2, y2);
                }
            }

            this.clockContainer.addChild(graphics);
        }

        createDecorations() {
            const graphics = new PIXI.Graphics();
            const decorCount = 4;
            
            for (let i = 0; i < decorCount; i++) {
                const angle = (i / decorCount) * Math.PI * 2 + Math.PI / 4;
                const x = Math.cos(angle) * this.size * 0.25;
                const y = Math.sin(angle) * this.size * 0.25;
                
                graphics.beginFill(this.config.colors.accent);
                graphics.drawCircle(x, y, this.size / 50);
                graphics.endFill();
            }

            this.clockContainer.addChild(graphics);
        }

        createHands() {
            // Hour hand
            this.hourHand = new PIXI.Graphics();
            this.drawHand(this.hourHand, this.config.hourHandStyle, this.size * 0.25, this.size / 25, this.config.colors.hands);
            this.clockContainer.addChild(this.hourHand);

            // Minute hand
            this.minuteHand = new PIXI.Graphics();
            this.drawHand(this.minuteHand, this.config.minuteHandStyle, this.size * 0.35, this.size / 30, this.config.colors.hands);
            this.clockContainer.addChild(this.minuteHand);

            // Second hand
            if (this.config.secondHandStyle !== 'none') {
                this.secondHand = new PIXI.Graphics();
                const secondColor = this.config.colors.accent || this.config.colors.hands;
                this.drawHand(this.secondHand, this.config.secondHandStyle, this.size * 0.4, this.size / 50, secondColor);
                this.clockContainer.addChild(this.secondHand);
            }
        }

        drawHand(graphics, style, length, width, color) {
            graphics.clear();
            
            switch (style) {
                case 'arrow':
                    graphics.beginFill(color);
                    graphics.moveTo(0, 0);
                    graphics.lineTo(-width / 2, -length * 0.1);
                    graphics.lineTo(-width / 4, -length * 0.9);
                    graphics.lineTo(0, -length);
                    graphics.lineTo(width / 4, -length * 0.9);
                    graphics.lineTo(width / 2, -length * 0.1);
                    graphics.closePath();
                    graphics.endFill();
                    break;
                    
                case 'diamond':
                    graphics.beginFill(color);
                    graphics.moveTo(0, 0);
                    graphics.lineTo(-width / 2, -length * 0.5);
                    graphics.lineTo(0, -length);
                    graphics.lineTo(width / 2, -length * 0.5);
                    graphics.closePath();
                    graphics.endFill();
                    break;
                    
                case 'simple':
                    graphics.lineStyle(width, color, 1, 0.5);
                    graphics.moveTo(0, 0);
                    graphics.lineTo(0, -length);
                    break;
                    
                case 'needle':
                case 'thin':
                    graphics.lineStyle(width * 0.5, color, 1, 0.5);
                    graphics.moveTo(0, length * 0.1);
                    graphics.lineTo(0, -length);
                    break;
                    
                case 'ornate':
                    graphics.beginFill(color);
                    graphics.drawRect(-width / 2, 0, width, -length * 0.7);
                    graphics.moveTo(-width / 2, -length * 0.7);
                    graphics.lineTo(0, -length);
                    graphics.lineTo(width / 2, -length * 0.7);
                    graphics.endFill();
                    graphics.beginFill(color, 0.5);
                    graphics.drawCircle(0, -length * 0.3, width);
                    graphics.endFill();
                    break;
                    
                case 'dot':
                    graphics.beginFill(color);
                    graphics.drawCircle(0, -length, width * 2);
                    graphics.endFill();
                    break;
            }
        }

        createCenterDot() {
            const dot = new PIXI.Graphics();
            dot.beginFill(this.config.colors.accent || this.config.colors.hands);
            dot.drawCircle(0, 0, this.size / 30);
            dot.endFill();
            dot.beginFill(this.config.colors.hands);
            dot.drawCircle(0, 0, this.size / 50);
            dot.endFill();
            this.clockContainer.addChild(dot);
        }

        drawShape(graphics, radius) {
            switch (this.config.shape) {
                case 'circle':
                    graphics.drawCircle(0, 0, radius);
                    break;
                case 'square':
                    graphics.drawRect(-radius, -radius, radius * 2, radius * 2);
                    break;
                case 'hexagon':
                    this.drawPolygon(graphics, 6, radius);
                    break;
                case 'octagon':
                    this.drawPolygon(graphics, 8, radius);
                    break;
            }
        }

        drawPolygon(graphics, sides, radius) {
            const angleStep = (Math.PI * 2) / sides;
            const points = [];
            
            for (let i = 0; i < sides; i++) {
                const angle = angleStep * i - Math.PI / 2;
                points.push(Math.cos(angle) * radius);
                points.push(Math.sin(angle) * radius);
            }
            
            graphics.drawPolygon(points);
        }

        update() {
            const timestamp = $gameVariables.value(timeVariableId) || Date.now();
            const date = new Date(timestamp);
            
            const hours = date.getHours() % 12;
            const minutes = date.getMinutes();
            const seconds = date.getSeconds();
            const milliseconds = date.getMilliseconds();
            
            // Calculate angles
            const secondAngle = ((seconds + milliseconds / 1000) / 60) * Math.PI * 2 - Math.PI / 2;
            const minuteAngle = ((minutes + seconds / 60) / 60) * Math.PI * 2 - Math.PI / 2;
            const hourAngle = ((hours + minutes / 60) / 12) * Math.PI * 2 - Math.PI / 2;
            
            // Apply rotation
            if (this.hourHand) this.hourHand.rotation = hourAngle + Math.PI / 2;
            if (this.minuteHand) this.minuteHand.rotation = minuteAngle + Math.PI / 2;
            if (this.secondHand) this.secondHand.rotation = secondAngle + Math.PI / 2;
        }
    }

    // Scene integration
    let currentClock = null;

    const _Scene_Map_createDisplayObjects = Scene_Map.prototype.createDisplayObjects;
    Scene_Map.prototype.createDisplayObjects = function() {
        _Scene_Map_createDisplayObjects.call(this);
        this.createClockLayer();
    };

    Scene_Map.prototype.createClockLayer = function() {
        this._clockLayer = new PIXI.Container();
        this.addChild(this._clockLayer);
    };

    const _Scene_Map_update = Scene_Map.prototype.update;
    Scene_Map.prototype.update = function() {
        _Scene_Map_update.call(this);
        if (currentClock) {
            currentClock.update();
        }
    };

    // Plugin commands
    PluginManager.registerCommand(pluginName, 'showClock', args => {
        const event = $gameMap.event($gameMap._interpreter.eventId());
        if (event) {
            if (currentClock) {
                SceneManager._scene._clockLayer.removeChild(currentClock);
            }
            
            currentClock = new Sprite_ProceduralClock($gameMap.mapId(), event.x, event.y);
            currentClock.x = event.screenX();
            currentClock.y = event.screenY() - 50;
            
            SceneManager._scene._clockLayer.addChild(currentClock);
        }
    });

    PluginManager.registerCommand(pluginName, 'hideClock', args => {
        if (currentClock && SceneManager._scene._clockLayer) {
            SceneManager._scene._clockLayer.removeChild(currentClock);
            currentClock = null;
        }
    });

    PluginManager.registerCommand(pluginName, 'updateClockPosition', args => {
        if (currentClock) {
            currentClock.x = Number(args.x);
            currentClock.y = Number(args.y);
        }
    });
})();
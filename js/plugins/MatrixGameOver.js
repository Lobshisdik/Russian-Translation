/*:
 * @target MZ
 * @plugindesc (v5.3) Cybernetic Game Over - Mouse & Hover Support Fixed.
 * @author Omni-Lex
 *
 * @param --- Visual Settings ---
 * * @param Node Count
 * @parent --- Visual Sestittings ---
 * @text Particle Count
 * @desc How many floating nodes to generate in the foreground.
 * @type number
 * @default 80
 *
 * @param Connection Distance
 * @parent --- Visual Settings ---
 * @text Link Distance
 * @desc Distance at which foreground nodes connect.
 * @type number
 * @default 160
 *
 * @param Base Color
 * @parent --- Visual Settings ---
 * @desc Hex color for the strands (Neon Green).
 * @type string
 * @default #00ff41
 *
 * @param Background Color
 * @parent --- Visual Settings ---
 * @desc Hex color for the background fade (Dark Green/Black).
 * @type string
 * @default #001100
 *
 * @param --- Text Settings ---
 *
 * @param Title Line 1
 * @parent --- Text Settings ---
 * @desc The first big word.
 * @default GAME
 *
 * @param Title Line 2
 * @parent --- Text Settings ---
 * @desc The second big word.
 * @default OVER
 *
 * @param Text Top
 * @parent --- Text Settings ---
 * @desc Option 1 (Top) - Leads to Load Screen.
 * @default CARICA PARTITA
 *
 * @param Text Middle
 * @parent --- Text Settings ---
 * @desc Option 2 (Middle) - Starts New Game.
 * @default NUOVA PARTITA
 *
 * @param Text Bottom
 * @parent --- Text Settings ---
 * @desc Option 3 (Bottom) - Returns to Title.
 * @default TORNA AL MENU
 *
 * @help
 * ============================================================================
 * OmniLex Matrix/Bio-Web Game Over (v5.3 - Functional Selection)
 * ============================================================================
 *
 * UPDATES (v5.3):
 * - Added TRUE Mouse Support: Hovering over text selects it.
 * - Added Hit Detection: Clicking a word executes THAT word.
 * - Expanded "Hit Areas" so text is easier to click.
 *
 * CONTROLS:
 * [W] / [Arrow Up]   : Move Selection Up
 * [S] / [Arrow Down] : Move Selection Down
 * [Z] / [Enter]      : Confirm Selection
 * [Mouse Hover]      : Select Option
 * [Left Click]       : Confirm Option
 *
 * ============================================================================
 */

(() => {
    const pluginName = "MatrixGameOver";
    const parameters = PluginManager.parameters(pluginName);
    
    // Parsing Parameters
    const pNodeCount = Number(parameters["Node Count"] || 80);
    const pConnectDist = Number(parameters["Connection Distance"] || 160);
    const pColorStrandStr = parameters["Base Color"] || "#00ff41";
    const pColorBgStr = parameters["Background Color"] || "#001100";
    
    // Text Strings
    const pTitle1 = parameters["Title Line 1"] || "GAME";
    const pTitle2 = parameters["Title Line 2"] || "OVER";
    
    const pTextTop = parameters["Text Top"] || "CARICA PARTITA";
    const pTextMid = parameters["Text Middle"] || "NUOVA PARTITA";
    const pTextBot = parameters["Text Bottom"] || "TORNA AL MENU";

    // Colors
    const parseColor = (c) => parseInt(c.replace("#", ""), 16);
    const pColorStrand = parseColor(pColorStrandStr);
    
    // Active/Inactive Colors for text
    const COLOR_SELECTED = '#ffffff'; // Bright White
    const COLOR_INACTIVE = '#005500'; // Dim Green

    // ==============================================================================
    // Scene_Gameover Overrides
    // ==============================================================================

    const _Scene_Gameover_create = Scene_Gameover.prototype.create;
    Scene_Gameover.prototype.create = function() {
        _Scene_Gameover_create.call(this);
        this.createMatrixUI();
        
        // Initialize Selection
        this._commandIndex = 1; 
        this._selectionActive = true;
        this.refreshMenuVisuals();
    };

    Scene_Gameover.prototype.createBackground = function() {
        // 1. Black solid backing
        this._backSolid = new PIXI.Graphics();
        this._backSolid.beginFill(0x000000);
        this._backSolid.drawRect(0, 0, Graphics.width, Graphics.height);
        this._backSolid.endFill();
        this.addChild(this._backSolid);

        // 2. Animated Billowing Strands (High Visibility)
        this._billowingBg = new BillowingBackground(pColorStrand);
        this.addChild(this._billowingBg);

        // 3. Foreground Nodes
        this._bioWeb = new BioWebSystem();
        this.addChild(this._bioWeb);
    };

    Scene_Gameover.prototype.createGameoverImage = function() {};

    Scene_Gameover.prototype.createMatrixUI = function() {
        const cx = Graphics.width / 2;
        const cy = Graphics.height / 2;

        // --- STYLES ---
        const styleMain = new PIXI.TextStyle({
            fontFamily: ["rmmz-mainfont", "Consolas", "Courier New", "monospace"],
            fontSize: 110,
            fill: ['#ffffff', '#ccffcc'], 
            fontWeight: 'bold',
            align: 'center',
            letterSpacing: 10,
            dropShadow: true,
            dropShadowColor: '#004400',
            dropShadowBlur: 10,
            dropShadowDistance: 0
        });

        const styleSub = new PIXI.TextStyle({
            fontFamily: ["rmmz-mainfont", "monospace"],
            fontSize: 24,
            fill: COLOR_INACTIVE, 
            align: 'center',
            letterSpacing: 6,
            fontWeight: 'bold',
            dropShadow: true,
            dropShadowColor: pColorStrandStr,
            dropShadowBlur: 0,
            dropShadowDistance: 0
        });

        const spaceOut = (str) => str.split("").join(" ");

        // Helpers to create text with hit areas
        const createOption = (text, yPos) => {
            const t = new PIXI.Text(spaceOut(text), styleSub);
            t.anchor.set(0.5);
            t.x = cx;
            t.y = yPos;
            // Add a hit area (rectangle) larger than the text for easier clicking
            t.hitArea = new PIXI.Rectangle(-150, -25, 300, 50); 
            t.interactive = true; // PIXI needs this, though we calculate manually often
            return t;
        };

        this._optTop = createOption(pTextTop, cy - 180);
        this._optMid = createOption(pTextMid, cy);
        this._optBot = createOption(pTextBot, cy + 180);

        this._textGame = new PIXI.Text(pTitle1, styleMain);
        this._textGame.anchor.set(0.5);
        this._textGame.x = cx;
        this._textGame.y = cy - 75;

        this._textOver = new PIXI.Text(pTitle2, styleMain);
        this._textOver.anchor.set(0.5);
        this._textOver.x = cx;
        this._textOver.y = cy + 75;

        this._textGame.blendMode = PIXI.BLEND_MODES.ADD;
        this._textOver.blendMode = PIXI.BLEND_MODES.ADD;
        
        this._menuOptions = [this._optTop, this._optMid, this._optBot];

        this.addChild(this._optTop);
        this.addChild(this._textGame);
        this.addChild(this._optMid);
        this.addChild(this._textOver);
        this.addChild(this._optBot);

        this._scanlineTime = 0;
    };

    Scene_Gameover.prototype.update = function() {
        Scene_Base.prototype.update.call(this);

        if (this.isActive() && !this.isBusy()) {
            if (this._selectionActive) {
                this.updateInput();
                this.updateMouse(); // Check mouse position
            }
            if (this._bioWeb) this._bioWeb.update();
            if (this._billowingBg) this._billowingBg.update();
            this.updateGlitchEffects();
        }
    };

    // Keyboard Input
    Scene_Gameover.prototype.updateInput = function() {
        if (Input.isTriggered('up')) {
            SoundManager.playCursor();
            this._commandIndex--;
            if (this._commandIndex < 0) this._commandIndex = 2; 
            this.refreshMenuVisuals();
        }
        else if (Input.isTriggered('down')) {
            SoundManager.playCursor();
            this._commandIndex++;
            if (this._commandIndex > 2) this._commandIndex = 0;
            this.refreshMenuVisuals();
        }
        else if (Input.isTriggered('ok')) {
            this.executeCommand();
        }
    };

    // New Mouse Handling
    Scene_Gameover.prototype.updateMouse = function() {
        const x = TouchInput.x;
        const y = TouchInput.y;

        for (let i = 0; i < this._menuOptions.length; i++) {
            const sprite = this._menuOptions[i];
            
            // Check if mouse is inside the sprite bounds
            // We use getBounds() to be accurate
            if (this.isPointInside(sprite, x, y)) {
                
                // If we are hovering over a NEW option
                if (this._commandIndex !== i) {
                    this._commandIndex = i;
                    SoundManager.playCursor();
                    this.refreshMenuVisuals();
                }

                // If clicking while hovering
                if (TouchInput.isTriggered()) {
                    this.executeCommand();
                }
                return; // Exit loop so we don't trigger multiple
            }
        }
        
        // Allow clicking anywhere if nothing specific is hovered (acts as 'ok')
        // But only if we aren't hovering a button (handled above)
        if (TouchInput.isTriggered()) {
             // Optional: Uncomment below if you want clicking blank space to trigger the *current* selection
             // this.executeCommand(); 
        }
    };

    Scene_Gameover.prototype.isPointInside = function(sprite, x, y) {
        // Simple bounding box check
        const b = sprite.getBounds();
        return (x >= b.x && x <= b.x + b.width && y >= b.y && y <= b.y + b.height);
    };

    Scene_Gameover.prototype.refreshMenuVisuals = function() {
        for (let i = 0; i < this._menuOptions.length; i++) {
            const textObj = this._menuOptions[i];
            
            if (i === this._commandIndex) {
                textObj.style.fill = COLOR_SELECTED;
                textObj.style.dropShadowBlur = 10;
                textObj.style.dropShadowColor = pColorStrandStr;
                textObj.alpha = 1.0;
                textObj.scale.set(1.1); 
            } else {
                textObj.style.fill = COLOR_INACTIVE;
                textObj.style.dropShadowBlur = 0;
                textObj.style.dropShadowColor = '#000000';
                textObj.alpha = 0.6;
                textObj.scale.set(1.0);
            }
        }
    };

    Scene_Gameover.prototype.executeCommand = function() {
        SoundManager.playOk();
        this._selectionActive = false; 

        if (this._commandIndex === 0) {
            SceneManager.push(Scene_Load);
        }
        else if (this._commandIndex === 1) {
            DataManager.setupNewGame();
            SceneManager.goto(Scene_Map);
        }
        else if (this._commandIndex === 2) {
            SceneManager.goto(Scene_Title);
        }
    };

    Scene_Gameover.prototype.updateGlitchEffects = function() {
        if (!this._textGame || !this._textOver) return;

        this._scanlineTime += 0.08;
        const scalePulse = 1 + Math.sin(this._scanlineTime) * 0.015;
        this._textGame.scale.set(scalePulse);
        this._textOver.scale.set(scalePulse);

        if (Math.random() > 0.97) {
            this._textGame.x = (Graphics.width / 2) + (Math.random() * 6 - 3);
            this._textOver.x = (Graphics.width / 2) + (Math.random() * 6 - 3);
            this._textGame.alpha = 0.7;
        } else {
            this._textGame.x = Graphics.width / 2;
            this._textOver.x = Graphics.width / 2;
            this._textGame.alpha = 1.0;
        }
        
        const selected = this._menuOptions[this._commandIndex];
        if (selected) {
            selected.alpha = 0.8 + Math.sin(this._scanlineTime * 4) * 0.2; 
        }
    };

    // ==============================================================================
    // Background Animation (High Visibility)
    // ==============================================================================
    class BillowingBackground extends PIXI.Graphics {
        constructor(color) {
            super();
            this._color = color;
            this._tick = 0;
            this.strands = [];
            this.totalStrands = 55;
            
            for (let i = 0; i < this.totalStrands; i++) {
                this.strands.push({
                    x: Math.random() * Graphics.width,
                    amp: 30 + Math.random() * 50,
                    speed: 0.01 + Math.random() * 0.015,
                    offset: Math.random() * Math.PI * 2,
                    thickness: 1 + Math.random() * 2 
                });
            }
        }

        update() {
            this.clear();
            this._tick++;
            const h = Graphics.height;

            for (const s of this.strands) {
                this.lineStyle(s.thickness, this._color, 0.4);
                this.moveTo(s.x, h + 20);

                for (let y = h; y >= -50; y -= 20) {
                    const time = this._tick * s.speed;
                    const wave = Math.sin(y * 0.01 + time + s.offset) * s.amp 
                               + Math.cos(y * 0.005 + time) * (s.amp * 0.5);

                    this.lineTo(s.x + wave, y);
                }
            }
        }
    }

    // ==============================================================================
    // Foreground Nodes
    // ==============================================================================
    class BioWebSystem extends PIXI.Container {
        constructor() {
            super();
            this.nodes = [];
            this.width = Graphics.width;
            this.height = Graphics.height;
            
            this.graphics = new PIXI.Graphics();
            this.graphics.blendMode = PIXI.BLEND_MODES.ADD; 
            
            const blur = new PIXI.filters.BlurFilter();
            blur.blur = 0.5; 
            blur.quality = 1;
            this.graphics.filters = [blur];
            
            this.addChild(this.graphics);
            this.initNodes();
        }

        initNodes() {
            for (let i = 0; i < pNodeCount; i++) {
                this.nodes.push({
                    x: Math.random() * this.width,
                    y: Math.random() * this.height,
                    vx: (Math.random() - 0.5) * 0.8, 
                    vy: (Math.random() - 0.5) * 0.8, 
                    phase: Math.random() * Math.PI * 2 
                });
            }
        }

        update() {
            this.graphics.clear();
            const nodes = this.nodes;
            const maxDist = pConnectDist;
            
            for (let i = 0; i < nodes.length; i++) {
                const n = nodes[i];
                n.x += n.vx;
                n.y += n.vy;
                n.phase += 0.05;

                if (n.x < -50) n.x = this.width + 50;
                if (n.x > this.width + 50) n.x = -50;
                if (n.y < -50) n.y = this.height + 50;
                if (n.y > this.height + 50) n.y = -50;
                
                this.graphics.beginFill(pColorStrand, 0.3);
                this.graphics.drawCircle(n.x, n.y, 1.5);
                this.graphics.endFill();
            }

            for (let i = 0; i < nodes.length; i++) {
                for (let j = i + 1; j < nodes.length; j++) {
                    const n1 = nodes[i];
                    const n2 = nodes[j];
                    const dx = n1.x - n2.x;
                    const dy = n1.y - n2.y;
                    const distSq = dx * dx + dy * dy; 
                    const maxDistSq = maxDist * maxDist;

                    if (distSq < maxDistSq) {
                        const dist = Math.sqrt(distSq);
                        let alpha = 1 - (dist / maxDist);
                        const pulse = (Math.sin(n1.phase) + Math.sin(n2.phase)) / 2;
                        alpha = alpha * (0.5 + pulse * 0.2); 

                        this.graphics.lineStyle(1, pColorStrand, alpha);
                        this.graphics.moveTo(n1.x, n1.y);
                        this.graphics.lineTo(n2.x, n2.y);
                    }
                }
            }
        }
    }
})();
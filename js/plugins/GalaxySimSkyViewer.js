/*:
 * @target MZ
 * @plugindesc (v1.4) Shows a custom, draggable night sky display with constellations.
 * @author Omni-Lex
 * @help
 * GalaxySimSkyViewer.js
 * (Version 1.4)
 *
 * This plugin provides a custom, draggable star map overlay.
 * Zodiac constellations are now drawn in gold.
 *
 * Controls:
 * - Mouse Drag / WASD / Arrow Keys: Pan camera
 * - Mouse Wheel / Q / E: Zoom in/out (Wheel zooms on cursor, keys zoom on center)
 * - SHIFT: Switch between constellation sets
 * - European / Chinese buttons: Switch constellation sets (auto-recenters)
 * - Cancel/Back/ESC: Exit star map
 *
 * @command openStarMap
 * @text Open Star Map
 * @desc Opens the draggable night sky display.
 *
 * @arg telescopeView
 * @text Telescope View
 * @desc Show a circular "telescope" overlay.
 * @type boolean
 * @default false
 *
 *
 * @param skyScrollSpeed
 * @text WASD Scroll Speed
 * @desc The speed the sky moves when using WASD keys.
 * @type number
 * @default 5
 *
 * @param starSize
 * @text Star Size
 * @desc The radius of the stars drawn on the map.
 * @type number
 * @default 2
 *
 * @param starColor
 * @text Star Color
 * @desc The hex color for stars (e.g., 0xFFFFFF for white).
 * @type string
 * @default 0xFFFFFF
 *
 * @param lineThickness
 * @text Line Thickness
 * @desc The thickness of the constellation lines.
 * @type number
 * @default 1
 *
 * @param lineColor
 * @text Line Color
 * @desc The hex color for constellation lines (e.g., 0x8888FF).
 * @type string
 * @default 0x8888FF
 *
 * @param hoverRadius
 * @text Hover Radius
 * @desc The pixel radius around a constellation's center to detect for hover.
 * @type number
 * @default 25
 *
 * @param starNameZoomThreshold
 * @text Star Name Zoom Threshold
 * @desc The zoom level (e.g., 2.0) required to show star names.
 * @type number
 * @default 2.0
 */

(() => {
    const pluginName = "GalaxySimSkyViewer";
    const params = PluginManager.parameters(pluginName);

    const SKY_SCROLL_SPEED = Number(params.skyScrollSpeed) || 5;
    const STAR_SIZE = Number(params.starSize) || 4;
    const STAR_COLOR = parseInt(params.starColor) || 0xFFFFFF;
    const LINE_THICKNESS = Number(params.lineThickness) || 2;
    const LINE_COLOR = parseInt(params.lineColor) || 0x8888FF;
    const ZODIAC_LINE_COLOR = 0xFFD700; // Yellow Gold for Zodiac
    const HOVER_RADIUS = Number(params.hoverRadius) || 25;
    const STAR_NAME_ZOOM_THRESHOLD = Number(params.starNameZoomThreshold) || 2.0;
    const ZOOM_SPEED = 0.1;
    const MIN_ZOOM = 0.3;
    const MAX_ZOOM = 5.0;
    const BASE_SCALE = 1;
    const DEFAULT_ZOOM = 1;
    const WESTERN_CONSTELLATIONS = window.GalaxyData?.WESTERN_CONSTELLATIONS || {};
    const CHINESE_CONSTELLATIONS = window.GalaxyData?.CHINESE_CONSTELLATIONS || {};

    
    // --- Sprite_StarMap Class ---
    // This is our custom PIXI container for the whole display.

    class Sprite_StarMap extends PIXI.Container {
        constructor(isTelescope = false) {
            super();
            this.width = Graphics.boxWidth;
            this.height = Graphics.boxHeight;
            this.interactive = true;
            this.sortableChildren = true;

            this._isTelescope = isTelescope;
            this._currentView = 'western'; // 'western' or 'chinese'
            this._currentConstellations = WESTERN_CONSTELLATIONS;
            this._dragging = false;
            this._dragStart = new PIXI.Point();
            this._skyStart = new PIXI.Point();
            this._zoomLevel = DEFAULT_ZOOM;

            this._createBackground();
            this._createSkyContainer();
            this._createButtons();
            this._createHoverText();
            this._setupDragHandlers();

            if (this._isTelescope) {
                this._createTelescopeOverlay();
            }

            this.drawConstellations();
        }

        _createBackground() {
            const bg = new PIXI.Graphics();
            bg.beginFill(0x000000, 1.0);
            bg.drawRect(0, 0, Graphics.boxWidth, Graphics.boxHeight);
            bg.endFill();
            bg.interactive = true;
            bg.zIndex = -1;
            this.addChild(bg);
        }

        _createSkyContainer() {
            this._skyContainer = new PIXI.Container();
            this._skyContainer.zIndex = 0;
            const initialScale = BASE_SCALE * DEFAULT_ZOOM;
            this._skyContainer.scale.set(initialScale);
            this.addChild(this._skyContainer);

            this._constellationGraphics = new PIXI.Graphics();
            this._skyContainer.addChild(this._constellationGraphics);

            this._labelContainer = new PIXI.Container();
            this._skyContainer.addChild(this._labelContainer);

            const startPos = WESTERN_CONSTELLATIONS["orion"]?.center || { x: 0, y: 0 };
            this._skyContainer.x = (this.width / 2) - (startPos.x * initialScale);
            this._skyContainer.y = (this.height / 2) - (startPos.y * initialScale);
        }

        _createButtons() {
            this._westernButton = this._createButton("European", 10, 10, () => this._onWesternClick());
            this._chineseButton = this._createButton("Chinese", 130, 10, () => this._onChineseClick());

            this._westernButton.zIndex = 10;
            this._chineseButton.zIndex = 10;

            this.addChild(this._westernButton, this._chineseButton);
            this._updateButtonActiveState();
        }
        
        _createButton(text, x, y, callback) {
            const button = new PIXI.Container();
            button.x = x;
            button.y = y;
            button.interactive = true;
            button.buttonMode = true;

            const bg = new PIXI.Graphics();
            bg.beginFill(0x888888, 1);
            bg.drawRoundedRect(0, 0, 100, 40, 8);
            bg.endFill();
            button.addChild(bg);
            
            button._buttonBackground = bg; 

            const label = new PIXI.Text(text, {
                fontFamily: "Arial",
                fontSize: 18,
                fill: 0xFFFFFF,
                align: "center"
            });
            label.anchor.set(0.5);
            label.x = 50;
            label.y = 20;
            button.addChild(label);
            
            button.on("pointerdown", callback);
            return button;
        }

        _createHoverText() {
            this._hoverNameText = new PIXI.Text("", {
                fontFamily: "Arial",
                fontSize: 24,
                fill: 0xFFFFFF,
                stroke: 0x000000,
                strokeThickness: 4,
                align: "center"
            });
            this._hoverNameText.anchor.set(0.5);
            this._hoverNameText.x = this.width / 2;
            this._hoverNameText.y = this.height - 50;
            this._hoverNameText.zIndex = 10;
            this.addChild(this._hoverNameText);
        }

        _createTelescopeOverlay() {
            const radius = Math.min(this.width, this.height) * 0.45;
            const overlay = new PIXI.Graphics();
            
            overlay.beginFill(0x000000, 1.0);
            // Draw the outer rectangle
            overlay.drawRect(0, 0, this.width, this.height);
            
            // Cut out the center
            overlay.beginHole();
            overlay.drawCircle(this.width / 2, this.height / 2, radius);
            overlay.endHole();
            
            overlay.endFill();
            overlay.zIndex = 5; // Above sky, below buttons
            
            this.addChild(overlay);

            // Add a decorative ring
            const scopeRing = new PIXI.Graphics();
            scopeRing.lineStyle(4, 0x333333, 1.0); // Dark grey ring
            scopeRing.drawCircle(this.width / 2, this.height / 2, radius);
            scopeRing.zIndex = 6; // On top of the black mask
            this.addChild(scopeRing);
        }

        _setupDragHandlers() {
            this.on("pointerdown", this._onDragStart, this);
            this.on("pointerup", this._onDragEnd, this);
            this.on("pointerupoutside", this._onDragEnd, this);
            this.on("pointermove", this._onDragMove, this);
        }

        _onDragStart(event) {
            if (event.target !== this && event.target !== this._skyContainer) {
                return;
            }
            this._dragging = true;
            this._dragStart.copyFrom(event.data.global);
            this._skyStart.copyFrom(this._skyContainer.position);
        }

        _onDragEnd() {
            this._dragging = false;
        }

        _onDragMove(event) {
            if (this._dragging) {
                const newPos = event.data.global;
                const dx = newPos.x - this._dragStart.x;
                const dy = newPos.y - this._dragStart.y;
                
                this._skyContainer.x = this._skyStart.x + dx;
                this._skyContainer.y = this._skyStart.y + dy;
            }
        }

        _onWesternClick() {
            if (this._currentView !== 'western') {
                this._currentView = 'western';
                this._currentConstellations = WESTERN_CONSTELLATIONS;
                this._recenterOnConstellation('orion');
                this.drawConstellations();
                this._updateButtonActiveState();
            }
        }

        _onChineseClick() {
            if (this._currentView !== 'chinese') {
                this._currentView = 'chinese';
                this._currentConstellations = CHINESE_CONSTELLATIONS;
                this._recenterOnConstellation('azure_dragon');
                this.drawConstellations();
                this._updateButtonActiveState();
            }
        }

        _recenterOnConstellation(constellationId) {
            const constellation = this._currentConstellations[constellationId];
            if (constellation && constellation.center) {
                const totalZoom = this._zoomLevel * BASE_SCALE;
                this._skyContainer.x = (this.width / 2) - (constellation.center.x * totalZoom);
                this._skyContainer.y = (this.height / 2) - (constellation.center.y * totalZoom);
            }
        }
        
        _updateButtonActiveState() {
            if (this._currentView === 'western') {
                this._redrawButtonBackground(this._westernButton, 0x6666FF); // Active
                this._redrawButtonBackground(this._chineseButton, 0x888888); // Default
            } else {
                this._redrawButtonBackground(this._westernButton, 0x888888);
                this._redrawButtonBackground(this._chineseButton, 0x6666FF);
            }
        }

        _redrawButtonBackground(button, color) {
            const bg = button._buttonBackground;
            bg.clear();
            bg.beginFill(color, 1);
            bg.drawRoundedRect(0, 0, 100, 40, 8);
            bg.endFill();
        }

        drawConstellations() {
            const g = this._constellationGraphics;
            g.clear();
            this._labelContainer.removeChildren();

            for (const id in this._currentConstellations) {
                const c = this._currentConstellations[id];

                // Set line color based on zodiac property
                const currentLineColor = c.zodiac ? ZODIAC_LINE_COLOR : LINE_COLOR;
                g.lineStyle(LINE_THICKNESS, currentLineColor, 0.6);

                // Draw lines
                for (const line of c.lines) {
                    const star1 = c.stars[line[0]];
                    const star2 = c.stars[line[1]];
                    g.moveTo(star1.x, star1.y);
                    g.lineTo(star2.x, star2.y);
                }

                // Draw stars
                g.lineStyle(0);
                g.beginFill(STAR_COLOR, 1);
                for (const star of c.stars) {
                    g.drawCircle(star.x, star.y, STAR_SIZE);

                    // Draw star name
                    if (star.name) {
                        const starLabel = new PIXI.Text(star.name, {
                            fontFamily: "Arial",
                            fontSize: 24,
                            fill: 0xFFFFFF,
                            stroke: 0x000000,
                            strokeThickness: 4
                        });
                        starLabel.anchor.set(0.5);
                        starLabel.x = star.x;
                        starLabel.y = star.y - 20; // Position above the star
                        starLabel.isStarLabel = true; // Flag for zoom visibility
                        // Set initial visibility
                        starLabel.visible = this._zoomLevel > STAR_NAME_ZOOM_THRESHOLD;
                        this._labelContainer.addChild(starLabel);
                    }
                }
                g.endFill();

                // Draw constellation name at its center
                /*
                if (c.name) {
                    const constLabel = new PIXI.Text(c.name, {
                        fontFamily: "Arial",
                        fontSize: 28,
                        fill: 0xFFFFFF,
                        stroke: 0x000000,
                        strokeThickness: 4,
                        fontWeight: "bold"
                    });
                    constLabel.anchor.set(0.5);
                    constLabel.x = c.center.x;
                    constLabel.y = c.center.y;
                    constLabel.isStarLabel = false; // Not a star label
                    this._labelContainer.addChild(constLabel);
                }*/
            }
        }

        // Main update loop, called manually by the scene
        update() {
            if (this._updateInput()) return; // Handles close
            this._updateKeyboardShortcuts(); // Handles SHIFT
            this._updateWASD();
            this._updateZoom();
            this._updateHover();
        }

        _updateInput() {
            if (Input.isTriggered('cancel') || Input.isTriggered('escape')) {
                this.close();
                return true; // Signal that we closed
            }
            return false;
        }

        _updateKeyboardShortcuts() {
            // Check for SHIFT key press
            if (Input.isTriggered('shift')) {
                if (this._currentView === 'western') {
                    this._onChineseClick();
                } else {
                    this._onWesternClick();
                }
            }
        }

        _updateWASD() {
            if (Input.isPressed('a') || Input.isPressed('left')) {
                this._skyContainer.x += SKY_SCROLL_SPEED;
            }
            if (Input.isPressed('d') || Input.isPressed('right')) {
                this._skyContainer.x -= SKY_SCROLL_SPEED;
            }
            if (Input.isPressed('w') || Input.isPressed('up')) {
                this._skyContainer.y += SKY_SCROLL_SPEED;
            }
            if (Input.isPressed('s') || Input.isPressed('down')) {
                this._skyContainer.y -= SKY_SCROLL_SPEED;
            }
        }

        _updateZoom() {
            const wheelDelta = TouchInput.wheelY;
            if (wheelDelta !== 0) {
                const delta = wheelDelta > 0 ? 0.9 : 1.1; 
                // Zoom towards mouse cursor
                this._applyZoomMultiplicative(delta, TouchInput.x, TouchInput.y);
            }

            if (Input.isPressed('pageup')) {
                // Zoom towards center
                this._applyZoomMultiplicative(1.02);
            }

            if (Input.isPressed('pagedown')) {
                // Zoom towards center
                this._applyZoomMultiplicative(0.98);
            }
        }

        _applyZoomMultiplicative(factor, zoomCenterX, zoomCenterY) {
            const oldZoom = this._zoomLevel;
            this._zoomLevel = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, this._zoomLevel * factor));

            if (oldZoom !== this._zoomLevel) {
                // Use provided center or default to screen center
                const centerX = zoomCenterX !== undefined ? zoomCenterX : this.width / 2;
                const centerY = zoomCenterY !== undefined ? zoomCenterY : this.height / 2;

                // Calculate the world position at the zoom center before zoom
                const oldTotalZoom = oldZoom * BASE_SCALE;
                const worldX = (centerX - this._skyContainer.x) / oldTotalZoom;
                const worldY = (centerY - this._skyContainer.y) / oldTotalZoom;

                // Apply new scale
                const newTotalZoom = this._zoomLevel * BASE_SCALE;
                this._skyContainer.scale.set(newTotalZoom);

                // Adjust position to keep the same world point at the zoom center
                this._skyContainer.x = centerX - worldX * newTotalZoom;
                this._skyContainer.y = centerY - worldY * newTotalZoom;

                // Update label visibility since zoom has changed
                this._updateLabelVisibility();
            }
        }

        _updateLabelVisibility() {
            const showNames = this._zoomLevel > STAR_NAME_ZOOM_THRESHOLD;
            for (const label of this._labelContainer.children) {
                if (label.isStarLabel) { // Check the flag
                    label.visible = showNames;
                }
            }
        }
        
        _updateHover() {
            if (!this._skyContainer || !this._hoverNameText) return;
            const touchPos = new PIXI.Point(TouchInput.x, TouchInput.y);
            const localPos = this._skyContainer.worldTransform.applyInverse(touchPos);

            let hoveredName = "";
            let minDist = HOVER_RADIUS * HOVER_RADIUS;

            for (const id in this._currentConstellations) {
                const c = this._currentConstellations[id];
                const dx = c.center.x - localPos.x;
                const dy = c.center.y - localPos.y;
                const distSq = dx * dx + dy * dy;

                if (distSq < minDist) {
                    minDist = distSq;
                    hoveredName = c.name;
                }
            }

            this._hoverNameText.text = hoveredName;
        }

        close() {
            if (this.parent && this.parent instanceof Scene_Map) {
                this.parent._starMapActive = false;
                this.parent._starMap = null;
            }
            this.destroy({ children: true, texture: false, baseTexture: false });
        }
    }

    // --- Plugin Command ---

    PluginManager.registerCommand(pluginName, "openStarMap", args => {
        const scene = SceneManager._scene;
        if (scene instanceof Scene_Map && !scene._starMapActive) {
            // Parse the new argument
            const isTelescope = args.telescopeView === 'true';

            scene._starMapActive = true;
            // Pass the flag to the constructor
            const starMap = new Sprite_StarMap(isTelescope);
            scene._starMap = starMap; 
            scene.addChild(starMap);
        }
    });

    // --- Scene_Map Hook ---

    const _Scene_Map_update = Scene_Map.prototype.update;
    Scene_Map.prototype.update = function() {
        if (this._starMapActive && this._starMap) {
            this._starMap.update();
            TouchInput.update();
            Input.update();
            return;
        }
        _Scene_Map_update.call(this);
    };

})();
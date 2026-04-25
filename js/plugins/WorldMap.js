/*:
 * @target MZ
 * @plugindesc World Map Plugin v2.3.0 (Zoom, Pan, Detail Tiles & Optimized City Labels)
 * @author Omni-Lex
 * @version 2.3.0
 * @description Minimap (Top-right) + Interactive Fullscreen Map with Labels + Optimized In-Game City Names.
 *
 * @param mapWidth
 * @text Map Width (Mini)
 * @desc Width of the minimap in pixels (Normal Mode)
 * @type number
 * @min 50
 * @max 500
 * @default 200
 *
 * @param mapHeight
 * @text Map Height (Mini)
 * @desc Height of the minimap in pixels (Normal Mode)
 * @type number
 * @min 50
 * @max 500
 * @default 150
 *
 * @param opacity
 * @text Map Opacity
 * @desc Opacity of the minimap (0-255)
 * @type number
 * @min 0
 * @max 255
 * @default 180
 *
 * @param playerColor
 * @text Player Color
 * @desc Color of the player dot (hex color)
 * @type string
 * @default #FF0000
 *
 * @param labelFontSize
 * @text Teleport Label Size
 * @desc Font size for teleport names on the fullscreen map
 * @type number
 * @default 14
 *
 * @param proceduralZoomLevel
 * @text Procedural Map Zoom Level
 * @desc Zoom level for procedural maps in minimap (smaller = more zoomed in). Default 32 shows full block, 16 shows 1/4th.
 * @type number
 * @min 4
 * @max 128
 * @default 16
 *
 * @help WorldMap.js
 *
 * === Controls ===
 * 'M' Key: Cycle Modes (Hidden -> Mini -> Fullscreen).
 *
 * === Fullscreen Mode Controls ===
 * Mouse Drag:  Pan the map.
 * Mouse Wheel: Zoom In / Out.
 * 'Q' Key:     Zoom Out.
 * 'E' Key:     Zoom In.
 *
 * === Setup ===
 * 1. Place 'worldmap.png' in 'img/pictures/'.
 * 2. Create 'img/worldmap/' folder.
 * 3. Place detail tiles in 'img/worldmap/' named:
 * row-1-column-1.png through row-8-column-8.png
 *
 * 4. Name events "Teleport - NameOfPlace" (e.g., "Teleport - Rome").
 *
 * === In-Game City Labels ===
 * City names from teleport events are automatically displayed on the map.
 * Format: "Teleport - CityName" (e.g., "Teleport - Rome" shows "Rome")
 * Labels appear above the event and scroll with the map.
 * Performance: Labels only render when near the visible screen (5 tile buffer).
 * Bitmaps are created lazily when labels first become visible.
 * (Note: Teleport labels on minimap only appear if you are ON the world map).
 */

(() => {
    'use strict';

    const pluginName = 'WorldMap';
    const parameters = PluginManager.parameters(pluginName);

    const mapWidth = Number(parameters['mapWidth']) || 200;
    const mapHeight = Number(parameters['mapHeight']) || 150;
    const paramOpacity = Number(parameters['opacity']) || 180;
    const playerColor = parameters['playerColor'] || '#FF0000';
    const labelFontSize = Number(parameters['labelFontSize']) || 14;
    const proceduralZoomLevel = Number(parameters['proceduralZoomLevel']) || 16;
    
    // Constants for vehicles
    const boatColor = '#0000FF';
    const shipColor = '#00FF00';
    const airshipColor = '#FFFF00';

    // Map States: 0 = Hidden, 1 = Normal (Mini), 2 = Fullscreen (Zoomed)
    let currentMapState = 0;

    // Interactive Zoom Variables
    let zoomScale = 1.0;
    let panX = 0;
    let panY = 0;
    let isDragging = false;
    let lastMouseX = 0;
    let lastMouseY = 0;
    let tilesLoading = false; // Track async tile loading
    let tilesLoaded = 0; // Count of loaded tiles
    const totalTiles = 64; // 8x8 grid

    // Key Definitions
    Input.keyMapper[77] = 'world_map_toggle'; // M
    Input.keyMapper[81] = 'map_zoom_out';     // Q
    Input.keyMapper[69] = 'map_zoom_in';      // E

    let worldMapSprite = null;
    let worldMapBitmap = null; // The master source image loaded from disk
    let fullscreenBitmap = null; // Cached fullscreen grid bitmap
    let cityLabelsContainer = null; // Array of city name label sprites on the map

    // Plugin Commands
    PluginManager.registerCommand(pluginName, "showWorldMap", args => {
        currentMapState = 1;
        refreshWorldMapDisplay();
    });

    PluginManager.registerCommand(pluginName, "hideWorldMap", args => {
        currentMapState = 0;
        refreshWorldMapDisplay();
    });

    // ------------------------------------------------------------------------
    // Initialization & Helpers
    // ------------------------------------------------------------------------

    function createWorldMapSprite() {
        if (worldMapSprite) return;
        
        worldMapSprite = new Sprite();
        worldMapSprite.anchor.x = 0; 
        worldMapSprite.anchor.y = 0;
        
        // Load the master image (for Fullscreen and Map 315 Mini)
        worldMapBitmap = ImageManager.loadPicture('worldmap');
        worldMapBitmap.addLoadListener(() => {
            // Center the map initially for fullscreen mode
            panX = (Graphics.width - worldMapBitmap.width) / 2;
            panY = (Graphics.height - worldMapBitmap.height) / 2;
            refreshWorldMapDisplay();
        });

        // Add world map sprite before window layer (so busts appear in front)
        const scene = SceneManager._scene;
        if (scene._windowLayer) {
            const windowLayerIndex = scene.children.indexOf(scene._windowLayer);
            if (windowLayerIndex >= 0) {
                scene.addChildAt(worldMapSprite, windowLayerIndex);
            } else {
                scene.addChild(worldMapSprite);
            }
        } else {
            scene.addChild(worldMapSprite);
        }
    }

    function resetZoom() {
        zoomScale = 1.0;
        centerOnCurrentCoordinates();
    }

    function centerOnCurrentCoordinates() {
        let centerX, centerY;

        // If on world map (315), use actual player position
        if ($gameMap && $gameMap.mapId() === 315) {
            const playerX = $gamePlayer.x || 0;
            const playerY = $gamePlayer.y || 0;
            centerX = playerX;
            centerY = playerY;
        } else {
            // Otherwise use saved coordinates from variables 43 & 44
            centerX = $gameVariables.value(43) || 0;
            centerY = $gameVariables.value(44) || 0;
        }

        // Full screen grid is 12288x12288 (8x8 tiles of 1536x1536 pixels each)
        // World coords: 0-255 range maps to 0-12288 pixels (48 pixels per world unit)
        const mapPixelX = centerX * 48;
        const mapPixelY = centerY * 48;

        // Center on this position
        panX = Graphics.width / 2 - (mapPixelX * zoomScale);
        panY = Graphics.height / 2 - (mapPixelY * zoomScale);
    }

    // ------------------------------------------------------------------------
    // Drawing Primitives
    // ------------------------------------------------------------------------

    function drawSquare(ctx, x, y, color, size) {
        const half = size / 2;
        ctx.fillStyle = color;
        ctx.fillRect(Math.round(x - half), Math.round(y - half), size, size);
    }
    
    function drawDot(ctx, x, y, color, radius) {
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, 2 * Math.PI);
        ctx.fill();
        ctx.strokeStyle = '#FFFFFF';
        ctx.lineWidth = 1;
        ctx.stroke();
    }

    function drawLabel(ctx, x, y, text) {
        ctx.font = `bold ${labelFontSize}px GameFont, sans-serif`;
        ctx.textAlign = 'left';
        ctx.textBaseline = 'middle';

        // Text Outline (Stroke)
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 3;
        ctx.strokeText(text, x + 8, y); // Offset slightly to right of dot

        // Text Fill
        ctx.fillStyle = 'white';
        ctx.fillText(text, x + 8, y);
    }

    function drawCoordinates(ctx, bitmapWidth, bitmapHeight, coordX, coordY, playerX, playerY) {
        let text = `${coordX}, ${coordY}`;

        // Only append local coordinates if we have them and not on map 315
        if (playerX !== undefined && playerY !== undefined && $gameMap.mapId() !== 315) {
            text += ` | ${playerX}, ${playerY}`;
        }

        const fontSize = 12;
        const padding = 6;
        const x = bitmapWidth - padding;
        const y = bitmapHeight - padding;

        ctx.font = `${fontSize}px GameFont, sans-serif`;
        ctx.textAlign = 'right';
        ctx.textBaseline = 'bottom';

        // Text Outline (Stroke)
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 2;
        ctx.strokeText(text, x, y);

        // Text Fill
        ctx.fillStyle = 'white';
        ctx.fillText(text, x, y);
    }

    function drawDetailedBlockGrid(ctx, bitmapWidth, bitmapHeight, proceduralZoom, tileScale) {
        // Draw grid lines for the detailed block view minimap
        // proceduralZoom: how many units are shown (e.g., 16 units)
        // tileScale: pixels per unit in the zoomed view

        ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
        ctx.lineWidth = 1;

        const pixelsPerUnit = (bitmapWidth / proceduralZoom);

        // Draw vertical grid lines
        for (let i = 0; i <= proceduralZoom; i++) {
            const x = Math.round(i * pixelsPerUnit);
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, bitmapHeight);
            ctx.stroke();
        }

        // Draw horizontal grid lines
        for (let i = 0; i <= proceduralZoom; i++) {
            const y = Math.round(i * pixelsPerUnit);
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(bitmapWidth, y);
            ctx.stroke();
        }
    }

    // ------------------------------------------------------------------------
    // Core Logic
    // ------------------------------------------------------------------------

    function toggleMapState() {
        // Cycle: 0 -> 1 -> 2 -> 0
        currentMapState = (currentMapState + 1) % 3;

        if (currentMapState === 2) {
            // Entering fullscreen - center on current coordinates
            resetZoom();
            fullscreenBitmap = null; // Clear cache to reload tiles
        } else if (currentMapState === 0) {
            // Leaving map view - clean up
            fullscreenBitmap = null;
        }

        refreshWorldMapDisplay();
    }

    function refreshWorldMapDisplay() {
        if (currentMapState === 0) {
            if (worldMapSprite) worldMapSprite.visible = false;
            return;
        }

        if (!worldMapSprite) createWorldMapSprite();
        
        // We only hard-check worldMapBitmap for Fullscreen or Map 315.
        // If we are in Detail Mode (Map != 315), we load dynamic images.
        if (currentMapState === 2 && (!worldMapBitmap || !worldMapBitmap.isReady())) return;

        worldMapSprite.visible = true;

        if (currentMapState === 1) {
            // --- MINI MODE ---
            renderMiniMap();
            worldMapSprite.x = Graphics.width - mapWidth - 10;
            worldMapSprite.y = 10;
            worldMapSprite.scale.x = 1;
            worldMapSprite.scale.y = 1;
            worldMapSprite.opacity = paramOpacity;
        } else {
            // --- FULLSCREEN ZOOM MODE ---
            // Always uses the full master map
            renderFullscreenMap();
            worldMapSprite.x = panX;
            worldMapSprite.y = panY;
            worldMapSprite.scale.x = zoomScale;
            worldMapSprite.scale.y = zoomScale;
            worldMapSprite.opacity = 255;
        }
    }

    // Render Logic for Mini Map
    function renderMiniMap() {
        const mapId = $gameMap.mapId();
        const targetW = mapWidth;
        const targetH = mapHeight;

        // 1. If on World Map (315), show the global view (shrunk)
        if (mapId === 315) {
            if (!worldMapBitmap || !worldMapBitmap.isReady()) return;

            const bitmap = new Bitmap(targetW, targetH);
            bitmap.blt(worldMapBitmap, 0, 0, worldMapBitmap.width, worldMapBitmap.height, 0, 0, targetW, targetH);

            // Draw Entities Global
            drawEntitiesOnBitmap(bitmap, targetW, targetH, false);
            worldMapSprite.bitmap = bitmap;
            return;
        }

        // 2. If NOT on Map 315, show the Detailed Block (with procedural zoom)
        // Calculate which 8x8 block we are in
        const varX = $gameVariables.value(43) || 0;
        const varY = $gameVariables.value(44) || 0;

        // 256 units / 8 blocks = 32 units per block
        const col = Math.floor(varX / 32) + 1;
        const row = Math.floor(varY / 32) + 1;

        // Load the specific tile image: img/worldmap/row-X-column-Y
        const filename = `row-${row}-column-${col}`;
        const tileBitmap = ImageManager.loadBitmap('img/worldmap/', filename);

        if (!tileBitmap.isReady()) {
            // If the tile isn't loaded yet, try again shortly
            tileBitmap.addLoadListener(refreshWorldMapDisplay);
            return;
        }

        const bitmap = new Bitmap(targetW, targetH);

        // Calculate local coordinates within the 32x32 block
        const localX = varX % 32;
        const localY = varY % 32;

        // Calculate the zoom-level view: center on player, show proceduralZoomLevel x proceduralZoomLevel area
        const halfZoom = proceduralZoomLevel / 2;
        const srcX = Math.max(0, Math.min(32 - proceduralZoomLevel, localX - halfZoom));
        const srcY = Math.max(0, Math.min(32 - proceduralZoomLevel, localY - halfZoom));

        // Draw the zoomed portion of the tile
        const tileScale = tileBitmap.width / 32; // pixels per unit
        bitmap.blt(tileBitmap,
            srcX * tileScale, srcY * tileScale,
            proceduralZoomLevel * tileScale, proceduralZoomLevel * tileScale,
            0, 0, targetW, targetH);

        // Draw Player Relative to zoomed view
        const context = bitmap.context;

        // Draw grid for detailed block view
        drawDetailedBlockGrid(context, targetW, targetH, proceduralZoomLevel, tileScale);

        // Scale player position to zoomed minimap
        // (localX - srcX) / proceduralZoomLevel gives position within the zoomed area
        const gridCellWidth = targetW / proceduralZoomLevel;
        const gridCellHeight = targetH / proceduralZoomLevel;
        const px = Math.floor(((localX - srcX) / proceduralZoomLevel) * targetW) + gridCellWidth / 2;
        const py = Math.floor(((localY - srcY) / proceduralZoomLevel) * targetH) + gridCellHeight / 2;

        drawDot(context, px, py, playerColor, 5);

        // Draw coordinates on bottom right, including local player position
        const playerLocalX = $gamePlayer.x;
        const playerLocalY = $gamePlayer.y;
        drawCoordinates(context, targetW, targetH, varX, varY, playerLocalX, playerLocalY);

        worldMapSprite.bitmap = bitmap;
    }

    // Render Logic for Fullscreen (8x8 grid of detailed tiles with async loading)
    function renderFullscreenMap() {
        const tilePixelSize = 1536; // Each tile is 1536x1536 pixels
        const gridSize = 8; // 8x8 grid
        const totalSize = tilePixelSize * gridSize; // 12288x12288 pixels

        // Reuse cached bitmap or create new one
        if (!fullscreenBitmap) {
            fullscreenBitmap = new Bitmap(totalSize, totalSize);
            tilesLoading = true;
            tilesLoaded = 0;

            // Load tiles asynchronously
            for (let row = 1; row <= gridSize; row++) {
                for (let col = 1; col <= gridSize; col++) {
                    (function(r, c) {
                        const filename = `row-${r}-column-${c}`;
                        const tileBitmap = ImageManager.loadBitmap('img/worldmap/', filename);

                        tileBitmap.addLoadListener(() => {
                            const destX = (c - 1) * tilePixelSize;
                            const destY = (r - 1) * tilePixelSize;
                            fullscreenBitmap.blt(tileBitmap, 0, 0, tileBitmap.width, tileBitmap.height, destX, destY, tilePixelSize, tilePixelSize);

                            tilesLoaded++;
                            if (tilesLoaded === totalTiles) {
                                // All tiles loaded, draw grid and entities
                                drawFullscreenGridLines(fullscreenBitmap, tilePixelSize, gridSize, totalSize);
                                tilesLoading = false;
                            }
                        });
                    })(row, col);
                }
            }
        }

        worldMapSprite.bitmap = fullscreenBitmap;
    }

    function drawFullscreenGridLines(bitmap, tilePixelSize, gridSize, totalSize) {
        const ctx = bitmap.context;
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
        ctx.lineWidth = 2;

        for (let i = 1; i < gridSize; i++) {
            const pos = i * tilePixelSize;
            // Vertical lines
            ctx.beginPath();
            ctx.moveTo(pos, 0);
            ctx.lineTo(pos, totalSize);
            ctx.stroke();

            // Horizontal lines
            ctx.beginPath();
            ctx.moveTo(0, pos);
            ctx.lineTo(totalSize, pos);
            ctx.stroke();
        }

        // Draw entities after grid
        drawEntitiesOnBitmap(bitmap, totalSize, totalSize, true);
    }

    function drawEntitiesOnBitmap(bitmap, targetW, targetH, showLabels) {
        // This function draws global entities.
        // If we are in MiniMap mode on a non-315 map, this function is NOT called.
        // This is only for Global Views (Map 315 OR Fullscreen).

        if (!$gameMap || !$gamePlayer) return;

        const context = bitmap.context;
        context.save();

        const mapId = $gameMap.mapId();

        // 1. Teleport Events (Only visible if actual events exist, i.e., on Map 315)
        // If we are on map 10 (Town), $gameMap.events are townspeople, so we generally won't find "teleport" names.
        const events = $gameMap.events();
        
        // We need the world map dimensions for reference
        const wTiles = $dataMap ? $dataMap.width : 256; 
        const hTiles = $dataMap ? $dataMap.height : 256;

        for (const ev of events) {
            if (!ev || ev._erased) continue;
            const name = ev.event().name || "";
            if (/^teleport/i.test(name)) {
                const ex = Math.floor((ev.x / wTiles) * targetW);
                const ey = Math.floor((ev.y / hTiles) * targetH);

                drawSquare(context, ex, ey, '#00FF00', showLabels ? 10 : 6);

                if (showLabels) {
                    let labelText = name.replace(/^teleport\s*/i, '').replace(/^-\s*/, '').trim();
                    if (labelText) {
                        drawLabel(context, ex, ey, labelText);
                    }
                }
            }
        }

        // 2. Vehicles (Global Global coords)
        // If vehicles are not on the current map, their x/y might be irrelevant or stored elsewhere.
        // Standard MV/MZ keeps vehicle coords on $gameMap.boat()._x regardless of map, 
        // but we check _mapId to ensure they are on the world map.
        const dotSize = showLabels ? 6 : 3;
        const worldMapId = 315; // Assuming 315 is the Overworld ID for vehicle checks

        if ($gameMap.boat()._mapId === worldMapId) {
            // We assume standard 256 coordinate logic for vehicle globals or use variables if custom
            // Standard:
            const bx = Math.floor(($gameMap.boat()._x / 256) * targetW);
            const by = Math.floor(($gameMap.boat()._y / 256) * targetH);
            drawDot(context, bx, by, boatColor, dotSize);
        }
        if ($gameMap.ship()._mapId === worldMapId) {
            const sx = Math.floor(($gameMap.ship()._x / 256) * targetW);
            const sy = Math.floor(($gameMap.ship()._y / 256) * targetH);
            drawDot(context, sx, sy, shipColor, dotSize);
        }
        if ($gameMap.airship()._mapId === worldMapId) {
            const ax = Math.floor(($gameMap.airship()._x / 256) * targetW);
            const ay = Math.floor(($gameMap.airship()._y / 256) * targetH);
            drawDot(context, ax, ay, airshipColor, dotSize);
        }

        // 3. Player Global Position
        let px, py;
        if (mapId === 315) {
            // On actual map: use player XY
            const mw = $dataMap.width;
            const mh = $dataMap.height;
            px = Math.floor(($gamePlayer.x / mw) * targetW) + targetW / (mw * 2);
            py = Math.floor(($gamePlayer.y / mh) * targetH) + targetH / (mh * 2);
        } else {
            // Not on map 315: use variables 43 and 44 (0-255 range)
            const varX = $gameVariables.value(43) || 0;
            const varY = $gameVariables.value(44) || 0;
            px = Math.floor((varX / 255) * targetW) + targetW / 510;
            py = Math.floor((varY / 255) * targetH) + targetH / 510;
        }
        drawDot(context, px, py, playerColor, showLabels ? 8 : 4);

        context.restore();
        bitmap.baseTexture.update();
    }

    // ------------------------------------------------------------------------
    // City Labels on Map (In-Game)
    // ------------------------------------------------------------------------

    // City Label Sprite Class
    class Sprite_CityLabel extends Sprite {
        initialize(tileX, tileY, text) {
            super.initialize();
            this._tileX = tileX;
            this._tileY = tileY;
            this._text = text;
            this._bitmapCreated = false;
            this.z = 7; // Above characters
        }

        createBitmap() {
            if (this._bitmapCreated) return;
            this.bitmap = new Bitmap(200, 40);
            this.bitmap.fontSize = labelFontSize;
            this.bitmap.fontFace = 'GameFont, sans-serif';
            this.bitmap.fontBold = true;
            this.bitmap.outlineWidth = 4;
            this.bitmap.outlineColor = 'black';
            this.bitmap.textColor = 'white';
            this.bitmap.drawText(this._text, 0, 0, 200, 40, 'center');
            this.anchor.x = 0.5;
            this.anchor.y = 1;
            this._bitmapCreated = true;
        }

        update() {
            super.update();
            this.updateVisibility();
            if (this.visible) {
                this.updatePosition();
            }
        }

        updateVisibility() {
            // Calculate distance from screen center in tiles
            const screenCenterX = $gameMap.displayX() + Graphics.width / $gameMap.tileWidth() / 2;
            const screenCenterY = $gameMap.displayY() + Graphics.height / $gameMap.tileHeight() / 2;

            const dx = Math.abs(this._tileX - screenCenterX);
            const dy = Math.abs(this._tileY - screenCenterY);

            // Show labels within screen bounds + 5 tile buffer
            const bufferTiles = 5;
            const maxX = (Graphics.width / $gameMap.tileWidth() / 2) + bufferTiles;
            const maxY = (Graphics.height / $gameMap.tileHeight() / 2) + bufferTiles;

            const isNear = dx <= maxX && dy <= maxY;

            // Only create bitmap when label becomes visible
            if (isNear && !this._bitmapCreated) {
                this.createBitmap();
            }

            this.visible = isNear;
        }

        updatePosition() {
            const tw = $gameMap.tileWidth();
            const th = $gameMap.tileHeight();
            this.x = ($gameMap.adjustX(this._tileX) + 0.5) * tw;
            this.y = ($gameMap.adjustY(this._tileY)) * th;
        }
    }

    function createCityLabelsContainer() {
        if (!SceneManager._scene._spriteset) return;

        // Remove old container if exists
        removeCityLabels();

        // Create labels array
        cityLabelsContainer = [];

        const events = $gameMap.events();
        for (const ev of events) {
            if (!ev || ev._erased) continue;
            const name = ev.event().name || "";

            // Match "Teleport - CityName" or "teleport CityName"
            const match = name.match(/^teleport\s*-?\s*(.+)/i);
            if (match) {
                const cityName = match[1].trim();
                if (cityName) {
                    const labelSprite = new Sprite_CityLabel(ev.x, ev.y, cityName);
                    SceneManager._scene._spriteset._tilemap.addChild(labelSprite);
                    cityLabelsContainer.push(labelSprite);
                }
            }
        }
    }

    function updateCityLabels() {
        createCityLabelsContainer();
    }

    function removeCityLabels() {
        if (cityLabelsContainer) {
            for (const label of cityLabelsContainer) {
                if (label.parent) {
                    label.parent.removeChild(label);
                }
            }
            cityLabelsContainer = null;
        }
    }

    // ------------------------------------------------------------------------
    // Input & Update Loops
    // ------------------------------------------------------------------------

    const _Scene_Map_update = Scene_Map.prototype.update;
    Scene_Map.prototype.update = function() {
        _Scene_Map_update.call(this);
        
        // Toggle Map
        if (Input.isTriggered('world_map_toggle')) {
            toggleMapState();
        }

        // Interactive Controls (Only in Fullscreen Mode)
        if (currentMapState === 2 && worldMapSprite) {
            updateZoomControls();
            updatePanControls();
        }
    };

    function updateZoomControls() {
        const zoomSpeed = 0.08;
        let zoomChange = 0;

        // Keyboard Zoom
        if (Input.isPressed('map_zoom_in')) zoomChange += zoomSpeed;
        if (Input.isPressed('map_zoom_out')) zoomChange -= zoomSpeed;

        // Mouse Wheel Zoom
        if (TouchInput.wheelY !== 0) {
            // wheelY is usually +/- 100 or 120. Normalize it.
            zoomChange -= (TouchInput.wheelY / 1000);
        }

        if (zoomChange !== 0) {
            const oldScale = zoomScale;
            // Allow zoom from 0.25x to 8x for more detail viewing
            zoomScale = Math.max(0.25, Math.min(8.0, zoomScale + zoomChange));

            // Calculate zoom towards center of screen
            const ratio = zoomScale / oldScale;
            const centerX = Graphics.width / 2;
            const centerY = Graphics.height / 2;

            panX = centerX - (centerX - panX) * ratio;
            panY = centerY - (centerY - panY) * ratio;

            worldMapSprite.scale.x = zoomScale;
            worldMapSprite.scale.y = zoomScale;
            worldMapSprite.x = panX;
            worldMapSprite.y = panY;
        }
    }

    function updatePanControls() {
        if (TouchInput.isPressed()) {
            if (!isDragging) {
                isDragging = true;
                lastMouseX = TouchInput.x;
                lastMouseY = TouchInput.y;
            } else {
                const dx = TouchInput.x - lastMouseX;
                const dy = TouchInput.y - lastMouseY;
                
                panX += dx;
                panY += dy;
                
                lastMouseX = TouchInput.x;
                lastMouseY = TouchInput.y;
                
                worldMapSprite.x = panX;
                worldMapSprite.y = panY;
            }
        } else {
            isDragging = false;
        }
    }

    // Block player movement when fullscreen map is open
    const _Game_Player_canMove = Game_Player.prototype.canMove;
    Game_Player.prototype.canMove = function() {
        // Block movement if fullscreen map is open (state 2)
        if (currentMapState === 2) {
            return false;
        }
        return _Game_Player_canMove.call(this);
    };

    // Update visuals on movement
    const _Game_Player_updateMove = Game_Player.prototype.updateMove;
    Game_Player.prototype.updateMove = function() {
        _Game_Player_updateMove.call(this);
        // Refresh if visible
        if (currentMapState > 0) {
            refreshWorldMapDisplay();
        }
        // City labels scroll automatically with tilemap, no need to update on every move
    };

    // ------------------------------------------------------------------------
    // Scene Management Cleanup
    // ------------------------------------------------------------------------

    const _Scene_Base_terminate = Scene_Base.prototype.terminate;
    Scene_Base.prototype.terminate = function() {
        _Scene_Base_terminate.call(this);
        if (worldMapSprite) {
            if (worldMapSprite.parent) worldMapSprite.parent.removeChild(worldMapSprite);
            worldMapSprite = null;
        }
        removeCityLabels();
    };

    const _Scene_Map_start = Scene_Map.prototype.start;
    Scene_Map.prototype.start = function() {
        _Scene_Map_start.call(this);

        // Parse map note for <Coords X Y> tag and set variables 43 & 44
        if ($dataMap && $dataMap.note) {
            const coordsMatch = $dataMap.note.match(/<Coords\s*(\d+)\s+(\d+)>/i);
            if (coordsMatch) {
                const coordX = parseInt(coordsMatch[1]);
                const coordY = parseInt(coordsMatch[2]);
                $gameVariables.setValue(43, coordX);
                $gameVariables.setValue(44, coordY);
            }
        }

        // Auto-Open logic for specific maps
        const mapId = $gameMap.mapId();
        if (mapId === 315 || mapId === 636) {
            currentMapState = 1;
        } else {
            currentMapState = 0;
        }

        if (currentMapState > 0) {
            createWorldMapSprite();
            refreshWorldMapDisplay();
        }

        // Initialize city labels on map
        setTimeout(() => {
            if (this._spriteset && this._spriteset._tilemap) {
                createCityLabelsContainer();
                updateCityLabels();
            }
        }, 100);
    };

    // Refresh city labels when events change
    const _Game_Map_refresh = Game_Map.prototype.refresh;
    Game_Map.prototype.refresh = function() {
        _Game_Map_refresh.call(this);
        if (SceneManager._scene instanceof Scene_Map) {
            setTimeout(() => {
                if (SceneManager._scene._spriteset && SceneManager._scene._spriteset._tilemap) {
                    createCityLabelsContainer();
                    updateCityLabels();
                }
            }, 100);
        }
    };

})();
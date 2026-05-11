/*:
 * @target MZ
 * @plugindesc Overrides mouse controls: wheel to zoom, click & drag to pan.
 * @author Gemini
 *
 * @param Min Zoom
 * @type number
 * @decimals 2
 * @default 0.80
 * @desc The furthest you can zoom out (default: 0.50).
 *
 * @param Max Zoom
 * @type number
 * @decimals 2
 * @default 2.00
 * @desc The closest you can zoom in (default: 2.00).
 *
 * @param Zoom Speed
 * @type number
 * @decimals 2
 * @default 0.10
 * @desc How much the camera zooms per scroll wheel tick.
 *
 * @help
 * ============================================================================
 * Mouse Pan & Zoom Controls
 * ============================================================================
 * This plugin completely overrides the default mouse behavior on the map.
 * 
 * - Standard "Click to move" destination pathfinding is disabled.
 * - Scroll the Mouse Wheel up and down to Zoom In and Out.
 * - Click and Drag the mouse to Pan the camera around the map.
 * 
 * Note: If you move the player character using the keyboard or a gamepad 
 * after panning away, the camera will naturally snap back to center on 
 * the player.
 */

(() => {
    const pluginName = "MousePanZoom";
    const parameters = PluginManager.parameters(pluginName);
    const minZoom = Number(parameters['Min Zoom'] || 0.80);
    const maxZoom = Number(parameters['Max Zoom'] || 2.00);
    const zoomSpeed = Number(parameters['Zoom Speed'] || 0.10);

    let isDragging = false;
    let dragStartX = 0;
    let dragStartY = 0;
    let initialDisplayX = 0;
    let initialDisplayY = 0;

    let clickStartX = 0;
    let clickStartY = 0;
    let isClicking = false;

    // ------------------------------------------------------------------------
    // Delayed Click-to-Move (to allow dragging without moving)
    // ------------------------------------------------------------------------
    Scene_Map.prototype.processMapTouch = function () {
        if (TouchInput.isTriggered()) {
            clickStartX = TouchInput.x;
            clickStartY = TouchInput.y;
            isClicking = true;
        }

        if (TouchInput.isReleased()) {
            if (isClicking) {
                const dx = TouchInput.x - clickStartX;
                const dy = TouchInput.y - clickStartY;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 10) { // Threshold for click
                    const x = $gameMap.canvasToMapX(TouchInput.x);
                    const y = $gameMap.canvasToMapY(TouchInput.y);
                    $gameTemp.setDestination(x, y);
                }
                isClicking = false;
            }
        }
    };

    // ------------------------------------------------------------------------
    // Map Update Injection
    // ------------------------------------------------------------------------
    const _Scene_Map_start = Scene_Map.prototype.start;
    Scene_Map.prototype.start = function () {
        _Scene_Map_start.call(this);
        if ($gameSystem._mousePanZoom && $gameSystem._mousePanZoom.zoom && !$gameSystem._mousePanZoomDisabled) {
            const data = $gameSystem._mousePanZoom;
            $gameScreen.setZoom(Graphics.width / 2, Graphics.height / 2, data.zoom);
            $gameMap.setDisplayPos(data.displayX, data.displayY);
        }
    };

    const _Scene_Map_update = Scene_Map.prototype.update;
    Scene_Map.prototype.update = function () {
        _Scene_Map_update.call(this);
        if ($gameMap && $gamePlayer) {
            if (!$gameSystem._mousePanZoomDisabled) {
                this.updateMousePan();
                this.updateMouseZoom();
                
                // Save current state continuously
                if (!$gameSystem._mousePanZoom) $gameSystem._mousePanZoom = {};
                $gameSystem._mousePanZoom.displayX = $gameMap.displayX();
                $gameSystem._mousePanZoom.displayY = $gameMap.displayY();
                $gameSystem._mousePanZoom.zoom = $gameScreen.zoomScale();
            }
        }
    };

    // ------------------------------------------------------------------------
    // Panning Logic
    // ------------------------------------------------------------------------
    Scene_Map.prototype.updateMousePan = function () {
        // Start Drag
        if (TouchInput.isTriggered()) {
            isDragging = true;
            dragStartX = TouchInput.x;
            dragStartY = TouchInput.y;
            initialDisplayX = $gameMap._displayX;
            initialDisplayY = $gameMap._displayY;
        }

        // End Drag
        if (TouchInput.isReleased()) {
            isDragging = false;
        }

        // Process Dragging
        if (isDragging && TouchInput.isPressed()) {
            const dx = TouchInput.x - dragStartX;
            const dy = TouchInput.y - dragStartY;

            // Factor in current zoom level to keep panning 1:1 with the mouse
            const currentZoom = $gameScreen.zoomScale();
            const tileW = $gameMap.tileWidth() * currentZoom;
            const tileH = $gameMap.tileHeight() * currentZoom;

            const newDispX = initialDisplayX - (dx / tileW);
            const newDispY = initialDisplayY - (dy / tileH);

            // setDisplayPos automatically handles map boundaries and looping
            $gameMap.setDisplayPos(newDispX, newDispY);
        }
    };

    // ------------------------------------------------------------------------
    // Zooming Logic
    // ------------------------------------------------------------------------
    Scene_Map.prototype.updateMouseZoom = function () {
        const wheelY = TouchInput.wheelY;

        if (wheelY !== 0) {
            let currentZoom = $gameScreen.zoomScale();

            if (wheelY < 0) {
                currentZoom += zoomSpeed;
            } else {
                currentZoom -= zoomSpeed;
            }

            // Clamp zoom between min and max parameters
            currentZoom = Math.max(minZoom, Math.min(maxZoom, currentZoom));

            // Target the center of the screen for the zoom pivot
            const centerX = Graphics.width / 2;
            const centerY = Graphics.height / 2;

            $gameScreen.setZoom(centerX, centerY, currentZoom);
        }
    };

    // ------------------------------------------------------------------------
    // Prevent Camera Snap-back While Dragging
    // ------------------------------------------------------------------------
    const _Game_Player_updateScroll = Game_Player.prototype.updateScroll;
    Game_Player.prototype.updateScroll = function (lastScrolledX, lastScrolledY) {
        if (isDragging) return; // Don't let the player movement steal the camera during a drag
        _Game_Player_updateScroll.call(this, lastScrolledX, lastScrolledY);
    };

})();
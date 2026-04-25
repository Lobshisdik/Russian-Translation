/*:
 * @target MZ
 * @plugindesc World Map Return v1.4.1
 * @author Omni-Lex
 * @url https://nocoldiz.itch.io/hypernet-explorer
 * @help
 * ============================================================================
 * WorldMapReturn.js
 * ============================================================================
 * 
 * This plugin tracks the player's position on map 315 (world map) and provides
 * various methods to return to it, including automatic border detection.
 * 
 * Variables Used:
 * - Variable 43: Saved X coordinate on map 315
 * - Variable 44: Saved Y coordinate on map 315
 * - Variable 45: Destination map ID (used during transfers)
 * 
 * Features:
 * - Automatically saves player position when leaving map 315
 * - Plugin commands to save position and return to world map
 * - Manual coordinate setting without teleportation
 * - Border detection system with player choice window
 * - Support for custom teleport destinations via OldEurope tags
 * - Exploration choice: Return to World Map or Explore Procedural Map
 * - Automatic speed reset when leaving world map
 * - Screen tint management for interior maps
 * - Directional arrows showing border directions when near border tiles
 * - Directional border tags for precise control over entry/exit points
 * 
 * Map Notetags:
 *
 * <Interior>
 * Marks a map as interior - screen tint will be reset to normal when
 * entering from map 315.
 *
 * <Exterior>
 * Marks a map as exterior - screen tint will not be changed when
 * entering from map 315.
 *
 * <Worldmap N S E W>
 * Enables world map popup on specified borders. Use any combination
 * of directions: N (north), S (south), E (east), W (west).
 * Using <Worldmap> without arguments enables all borders.
 * Without this tag, no borders trigger the popup.
 * Examples:
 *   <Worldmap>        - All borders trigger popup
 *   <Worldmap N W>    - Only north and west borders trigger popup
 *   <Worldmap E>      - Only east border triggers popup
 *
 * <Coords x y>
 * Marks the world map coordinates where this map connects.
 * When player selects "Explore", sets the world coordinates and teleports
 * the player to the edge of the procedural map (one tile inward from border).
 * Example: <Coords 81 129>
 *
 * <Borders mapId x y>
 * When player touches any passable border tile, teleport to specified
 * map and coordinates.
 * Example: <Borders 10 15 20>
 * 
 * @command ReturnToWorldMap
 * @text Return to World Map
 * @desc Teleport the player back to their saved position on map 315
 * 
 * @command SaveWorldMapPosition
 * @text Save Current World Map Position
 * @desc Save the current position on map 315 for later return
 * 
 * @command SetWorldMapCoordinates
 * @text Set World Map Coordinates
 * @desc Manually set the world map coordinates without teleporting
 * @arg x
 * @text X Coordinate
 * @desc X coordinate to set for world map position
 * @type number
 * @min 0
 * @default 0
 * @arg y
 * @text Y Coordinate
 * @desc Y coordinate to set for world map position
 * @type number
 * @min 0
 * @default 0
 * 
 */

(() => {
    'use strict';
    
    const pluginName = 'WorldMapReturn';
    const worldMapId = 315;
    const procMapId = 636;
    const BORDER_DETECTION_RANGE = 3; // Range for showing border arrows

    // Variable IDs
    const VAR_WORLD_X = 43;
    const VAR_WORLD_Y = 44;
    const VAR_DEST_MAP = 45;
    const VAR_PROC_ACTIVE = 90;
    const VAR_PROC_INSIDE = 91;
    
    // Border arrow sprites storage
    let borderArrowSprites = [];
    
    // Plugin Commands
    PluginManager.registerCommand(pluginName, 'ReturnToWorldMap', args => {
        returnToWorldMap();
    });
    
    PluginManager.registerCommand(pluginName, 'SaveWorldMapPosition', function(args) {
        saveWorldMapPosition(this);
    });
    
    PluginManager.registerCommand(pluginName, 'SetWorldMapCoordinates', args => {
        setWorldMapCoordinates(parseInt(args.x), parseInt(args.y));
    });
    
    // Function to return to world map
    function returnToWorldMap() {
        const savedX = $gameVariables.value(VAR_WORLD_X) || 0;
        const savedY = $gameVariables.value(VAR_WORLD_Y) || 0;
        
        if (savedX === 0 && savedY === 0) {
            return;
        }
        
        // Set destination map for tracking
        $gameVariables.setValue(VAR_DEST_MAP, worldMapId);
        
        // Perform transfer
        $gamePlayer.reserveTransfer(worldMapId, savedX, savedY, 0, 0);
    }
    
    // Function to save world map position
    function saveWorldMapPosition(eventContext) {
        if ($gameMap.mapId() === worldMapId) {
            let posX = $gamePlayer.x;
            let posY = $gamePlayer.y;

            // If called from an event, use the event's position
            if (eventContext && eventContext._eventId !== undefined) {
                const event = $gameMap.event(eventContext._eventId);
                if (event) {
                    posX = event.x;
                    posY = event.y;
                }
            }

            $gameVariables.setValue(VAR_WORLD_X, posX);
            $gameVariables.setValue(VAR_WORLD_Y, posY);
        }
    }
    
    // Function to manually set world map coordinates
    function setWorldMapCoordinates(x, y) {
        if (isNaN(x) || isNaN(y)) {
            return;
        }
        
        if (x < 0 || y < 0) {
            return;
        }
        
        $gameVariables.setValue(VAR_WORLD_X, x);
        $gameVariables.setValue(VAR_WORLD_Y, y);
    }
    
    // Override performTransfer to handle position saving and effects
    const _Game_Player_performTransfer = Game_Player.prototype.performTransfer;
    Game_Player.prototype.performTransfer = function() {
        const currentMapId = $gameMap.mapId();
        const destinationMapId = this._newMapId;

        // Store destination map ID
        $gameVariables.setValue(VAR_DEST_MAP, destinationMapId);

        // If leaving world map, save position and reset speed
        if (currentMapId === worldMapId && destinationMapId !== worldMapId) {
            $gameVariables.setValue(VAR_WORLD_X, $gamePlayer.x);
            $gameVariables.setValue(VAR_WORLD_Y, $gamePlayer.y);
        }

        // If leaving procedural map, clear entry border tracking
        if (currentMapId === procMapId && destinationMapId !== procMapId) {
            $gameSystem._procEntryBorder = null;
        }

        // Call original method
        _Game_Player_performTransfer.call(this);
    };
    
    // Override map setup for border tags and interior handling
    const _Game_Map_setup = Game_Map.prototype.setup;
    Game_Map.prototype.setup = function(mapId) {
        _Game_Map_setup.call(this, mapId);
        
        // Setup border tags
        this.setupBorderTags();
        
        // Handle interior tint if coming from world map
        const previousMapId = $gameVariables.value(VAR_DEST_MAP);
        if (previousMapId === worldMapId || $gamePlayer._transferring) {
            const lastMapId = $gamePlayer._transferring ? 
                ($gamePlayer._oldMapId || previousMapId) : previousMapId;
                
            if (lastMapId === worldMapId && mapId !== worldMapId) {
                if ($dataMap && $dataMap.note && $dataMap.note.match(/<Interior>/i)) {
                    $gameScreen.startTint([0, 0, 0, 0], 0);
                }
            }
        }
    };
    
    // Setup border teleportation tags
    Game_Map.prototype.setupBorderTags = function() {
        this._borderDestination = null;
        this._coordsDest = null; // Coordinates for exploration
        this._worldmapDirections = null; // Allowed directions for Worldmap tag (null = disabled, empty array = all directions)

        // Procedural maps (636) don't use traditional border tags
        if ($gameMap.mapId() === procMapId) {
            return;
        }

        if (!$dataMap || !$dataMap.note) return;

        const note = $dataMap.note;

        // Check for Worldmap tag: <Worldmap> or <Worldmap W N> etc.
        const worldmapMatch = note.match(/<Worldmap(?:\s+([\s\w]+?))?>/i);
        if (worldmapMatch) {
            const directionStr = worldmapMatch[1];

            // If no arguments, enable all directions
            if (!directionStr || directionStr.trim() === '') {
                this._worldmapDirections = ['north', 'south', 'east', 'west'];
            } else {
                const allowedDirs = [];
                const upperDirs = directionStr.toUpperCase();

                if (upperDirs.includes('N')) allowedDirs.push('north');
                if (upperDirs.includes('S')) allowedDirs.push('south');
                if (upperDirs.includes('E')) allowedDirs.push('east');
                if (upperDirs.includes('W')) allowedDirs.push('west');

                this._worldmapDirections = allowedDirs.length > 0 ? allowedDirs : null;
            }
        }

        // Check for Borders tag (takes precedence, applies to all borders)
        const bordersMatch = note.match(/<Borders\s+(\d+)\s+(\d+)\s+(\d+)>/i);
        if (bordersMatch) {
            this._borderDestination = {
                mapId: parseInt(bordersMatch[1]),
                x: parseInt(bordersMatch[2]),
                y: parseInt(bordersMatch[3])
            };
            return; // Borders tag overrides Coords
        }

        // Check for Coords tag: <Coords x y>
        const coordsMatch = note.match(/<Coords\s+(\d+)\s+(\d+)>/i);
        if (coordsMatch) {
            this._coordsDest = {
                x: parseInt(coordsMatch[1]),
                y: parseInt(coordsMatch[2])
            };
        }
    };
    
    // Check if tile is a border
    Game_Map.prototype.isBorderTile = function(x, y) {
        return x === 0 || y === 0 || 
               x === this.width() - 1 || y === this.height() - 1;
    };
    
    // Check if a border tile is enabled for teleportation
    Game_Map.prototype.isBorderTileEnabled = function(x, y) {
        if (!this.isBorderTile(x, y)) return false;

        // Border is enabled if we have a border destination or Coords coordinates
        return this._borderDestination || this._coordsDest;
    };

    // Check if border directions match allowed worldmap directions
    Game_Map.prototype.isBorderDirectionAllowed = function(directions) {
        // If no Worldmap tag is set, popup is disabled
        if (this._worldmapDirections === null) return false;

        // Check if any of the border directions match allowed directions
        return directions.some(dir => this._worldmapDirections.includes(dir));
    };
    
    // Get border direction for a tile
    Game_Map.prototype.getBorderDirection = function(x, y) {
        const directions = [];
        
        if (x === 0) directions.push('west');
        if (x === this.width() - 1) directions.push('east');
        if (y === 0) directions.push('north');
        if (y === this.height() - 1) directions.push('south');
        
        return directions;
    };
    
    // Check if a border tile is passable (the tile itself, not movement from it)
    Game_Map.prototype.isBorderTilePassable = function(x, y) {
        // Check if the tile itself is passable from any direction
        // We check all 4 directions to see if the player can stand on this tile
        return this.isPassable(x, y, 2) || // down
               this.isPassable(x, y, 4) || // left  
               this.isPassable(x, y, 6) || // right
               this.isPassable(x, y, 8);   // up
    };
    
    // Get arrow character for direction
    function getArrowForDirection(directions) {
        if (directions.length === 1) {
            switch (directions[0]) {
                case 'north': return '↑';
                case 'south': return '↓';
                case 'west': return '←';
                case 'east': return '→';
            }
        } else if (directions.length === 2) {
            const sorted = directions.sort();
            if (sorted[0] === 'north' && sorted[1] === 'west') return '↖';
            if (sorted[0] === 'north' && sorted[1] === 'east') return '↗';
            if (sorted[0] === 'south' && sorted[1] === 'west') return '↙';
            if (sorted[0] === 'east' && sorted[1] === 'south') return '↘';
        }
        return '•'; // Fallback
    }
    
    // Check if player is near border tiles
    Game_Map.prototype.getNearbyBorderTiles = function(playerX, playerY) {
        const nearbyBorders = [];

        for (let dx = -BORDER_DETECTION_RANGE; dx <= BORDER_DETECTION_RANGE; dx++) {
            for (let dy = -BORDER_DETECTION_RANGE; dy <= BORDER_DETECTION_RANGE; dy++) {
                const x = playerX + dx;
                const y = playerY + dy;

                // Skip the player's current position
                if (dx === 0 && dy === 0) continue;

                // Check bounds
                if (x < 0 || y < 0 || x >= this.width() || y >= this.height()) continue;

                // Check if it's a border tile, passable, and enabled for teleportation
                if (this.isBorderTile(x, y) &&
                    this.isBorderTileEnabled(x, y) &&
                    this.isBorderTilePassable(x, y)) {

                    const directions = this.getBorderDirection(x, y);

                    // Check if border direction is allowed by Worldmap tag
                    if (this.isBorderDirectionAllowed(directions)) {
                        const arrow = getArrowForDirection(directions);

                        nearbyBorders.push({
                            x: x,
                            y: y,
                            arrow: arrow,
                            directions: directions
                        });
                    }
                }
            }
        }

        return nearbyBorders;
    };
    
    // Update player to check for border teleports and update arrows
    const _Game_Player_update = Game_Player.prototype.update;
    Game_Player.prototype.update = function(sceneActive) {
        const wasMoving = this.isMoving();
        _Game_Player_update.call(this, sceneActive);

        if (sceneActive && !$gameMessage.isBusy()) {
            // Check for border teleport immediately, even while moving
            this.checkBorderTeleport();

            // Update border arrows if player stopped moving or position changed
            if (wasMoving || this._lastArrowUpdateX !== this.x || this._lastArrowUpdateY !== this.y) {
                this.updateBorderArrows();
                this._lastArrowUpdateX = this.x;
                this._lastArrowUpdateY = this.y;
            }
        }
    };
    
    // Check and perform border teleportation
    Game_Player.prototype.checkBorderTeleport = function() {
        const x = this.x;
        const y = this.y;
        const currentMapId = $gameMap.mapId();

        // Prevent recursive teleportation
        if (this._justWrapped) {
            this._justWrapped = false;
            return;
        }

        // Handle border - always return to world map (exploration removed)
        if ($gameMap.isBorderTile(x, y) && $gameMap.isBorderTilePassable(x, y)) {
            // Check if there's an available border destination
            const directions = $gameMap.getBorderDirection(x, y);
            const hasBorderDestination = $gameMap._borderDestination || $gameMap._coordsDest;

            // Check if border direction is allowed by Worldmap tag
            const isDirectionAllowed = $gameMap.isBorderDirectionAllowed(directions);

            // Automatically return to world map if not already triggered
            if (hasBorderDestination && !this._borderChoiceShown && isDirectionAllowed) {
                this._borderChoiceShown = true;

                // Get border destination
                let borderDest = null;
                if ($gameMap._coordsDest) {
                    borderDest = {
                        mapId: worldMapId,
                        x: $gameMap._coordsDest.x,
                        y: $gameMap._coordsDest.y
                    };
                } else if ($gameMap._borderDestination) {
                    borderDest = $gameMap._borderDestination;
                }

                // Transfer to world map immediately
                if (borderDest) {
                    $gameVariables.setValue(VAR_DEST_MAP, borderDest.mapId);
                    this.reserveTransfer(borderDest.mapId, borderDest.x, borderDest.y, 0, 0);
                }
                return;
            }
        } else {
            // Reset flag when not at border
            this._borderChoiceShown = false;
        }

        // Handle procedural map (636) border wraparound teleportation
        if (currentMapId === procMapId && $gameVariables.value(VAR_PROC_INSIDE) === 1) {
            const isBorder = $gameMap.isBorderTile(x, y);
            const isPassable = isBorder && $gameMap.isBorderTilePassable(x, y);

            console.log(`[WMR] checkBorderTeleport: pos=(${x},${y}), isBorder=${isBorder}, isPassable=${isPassable}`);

            if (isBorder && isPassable) {
                // Get border directions
                const directions = $gameMap.getBorderDirection(x, y);
                const mapWidth = $gameMap.width();
                const mapHeight = $gameMap.height();

                console.log(`[WMR] Border detected: directions=${JSON.stringify(directions)}, map=${mapWidth}x${mapHeight}`);

                let newX = x;
                let newY = y;
                let teleportDirection = null;

                // Determine if at vertical borders (north/south) - ONLY modify Y
                if (directions.includes('north')) {
                    console.log(`[WMR] NORTH border detected, setting newY from ${newY} to ${mapHeight - 2}`);
                    newY = mapHeight - 2;
                    teleportDirection = 'north';
                } else if (directions.includes('south')) {
                    console.log(`[WMR] SOUTH border detected, setting newY from ${newY} to 1`);
                    newY = 1;
                    teleportDirection = 'south';
                }

                // Determine if at horizontal borders (east/west) - ONLY modify X
                if (directions.includes('west')) {
                    console.log(`[WMR] WEST border detected, setting newX from ${newX} to ${mapWidth - 2}`);
                    newX = mapWidth - 2;
                    teleportDirection = 'west';
                } else if (directions.includes('east')) {
                    console.log(`[WMR] EAST border detected, setting newX from ${newX} to 1`);
                    newX = 1;
                    teleportDirection = 'east';
                }

                console.log(`[WMR] Final calculation: (${x},${y}) → (${newX},${newY}), direction=${teleportDirection}`);

                // Perform wraparound teleport within same map
                if (teleportDirection && $gameMap.isValid(newX, newY)) {
                    console.log(`[WMR] Teleporting to (${newX},${newY})`);
                    this._justWrapped = true; // Prevent recursive wrap
                    this.setPosition(newX, newY);
                    console.log(`[WMR] Player position after setPosition: (${this.x},${this.y})`);
                    return;
                } else if (teleportDirection) {
                    console.log(`[WMR] Invalid destination (${newX},${newY}), isValid=${$gameMap.isValid(newX, newY)}`);
                }
            }
        }

        // Teleportation is now handled by the choice window
        // No automatic teleportation occurs - player must make a choice
    };

    // Convert border directions to exit direction code (2=down, 4=left, 6=right, 8=up)
    Game_Player.prototype.getExitDirection = function(directions) {
        // Determine primary exit direction based on border position
        if (directions.includes('south')) return 2;
        if (directions.includes('west')) return 4;
        if (directions.includes('east')) return 6;
        if (directions.includes('north')) return 8;
        return 0; // Default
    };
    
    // Update border arrows display
    Game_Player.prototype.updateBorderArrows = function() {
        const currentMapId = $gameMap.mapId();

        // Show arrows on procedural map or maps with border destinations
        const shouldShowArrows = (currentMapId === procMapId && $gameVariables.value(VAR_PROC_INSIDE) === 1) ||
                                 $gameMap._borderDestination ||
                                 $gameMap._coordsDest;

        if (!shouldShowArrows) {
            this.clearBorderArrows();
            return;
        }

        const nearbyBorders = $gameMap.getNearbyBorderTiles(this.x, this.y);
        this.displayBorderArrows(nearbyBorders);
    };
    
    // Display border arrows
    Game_Player.prototype.displayBorderArrows = function(borderTiles) {
        this.clearBorderArrows();
        
        if (!SceneManager._scene || !SceneManager._scene._spriteset) return;
        
        const spriteset = SceneManager._scene._spriteset;
        
        borderTiles.forEach(border => {
            const sprite = new Sprite_BorderArrow(border.x, border.y, border.arrow);
            spriteset._baseSprite.addChild(sprite);
            borderArrowSprites.push(sprite);
        });
    };
    
    // Clear all border arrows
    Game_Player.prototype.clearBorderArrows = function() {
        borderArrowSprites.forEach(sprite => {
            if (sprite.parent) {
                sprite.parent.removeChild(sprite);
            }
        });
        borderArrowSprites = [];
    };

    // Show border choice window (Return to World Map or Explore)
    Game_Player.prototype.showBorderChoice = function(directions) {
        if (SceneManager._scene && SceneManager._scene._borderChoiceWindow) {
            SceneManager._scene.openBorderChoice(directions);
        }
    };
    
    // Border Arrow Sprite Class — shared from ProceduralMapTransfer.js (window.Sprite_BorderArrow)

    // Border Choice Window Class
    class Window_BorderChoice extends Window_Selectable {
        constructor(rect) {
            super(rect);
            this._directions = [];
            this.setBackgroundType(0);
            this.deactivate();
            this.hide();
        }

        maxItems() {
            return 3;
        }

        itemHeight() {
            return this.lineHeight();
        }

        setDirections(directions) {
            this._directions = directions;
        }

        drawItem(index) {
            const rect = this.itemLineRect(index);
            let text = '';

            switch(index) {
                case 0:
                    text = 'World Map';
                    break;
                case 1:
                    text = 'Explore';
                    break;
                case 2:
                    text = 'Cancel';
                    break;
            }

            this.changePaintOpacity(this.isCommandEnabled(index));
            this.drawText(text, rect.x, rect.y, rect.width);
            this.changePaintOpacity(true);
        }

        isCommandEnabled(index) {
            return true;
        }

        isCancelable() {
            return true;
        }

        isOkEnabled() {
            return true;
        }

        processCancel() {
            // Call the cancel handler without buzzer sound
            SoundManager.playCancel();
            this.updateInputData();
            this.deactivate();
            this.callCancelHandler();
        }

        refresh() {
            this.contents.clear();
            this.drawAllItems();
        }

        currentSymbol() {
            switch(this.index()) {
                case 0:
                    return 'returnToWorldMap';
                case 1:
                    return 'explore';
                case 2:
                    return 'cancel';
            }
        }
    }

    // Clear arrows when changing maps and apply procedural map tileset
    const _Scene_Map_onMapLoaded = Scene_Map.prototype.onMapLoaded;
    Scene_Map.prototype.onMapLoaded = function() {
        _Scene_Map_onMapLoaded.call(this);
        if ($gamePlayer) {
            $gamePlayer.clearBorderArrows();
        }

        // Apply procedural map tileset if we just transferred to map 636
        if ($gameMap.mapId() === procMapId && $gameSystem.applyProceduralMapTileset) {
            $gameSystem.applyProceduralMapTileset();
        }
    };
    
    // Initialize arrow update tracking
    const _Game_Player_initialize = Game_Player.prototype.initialize;
    Game_Player.prototype.initialize = function() {
        _Game_Player_initialize.call(this);
        this._lastArrowUpdateX = -1;
        this._lastArrowUpdateY = -1;
    };

    // ===== TRAVEL DECISION WINDOW =====

    /**
     * Window_TravelDecision - Shows popup with travel options
     */
    class Window_TravelDecision extends Window_Selectable {
        constructor(rect) {
            super(rect);
            this._travelActive = false;
        }

        maxItems() {
            return 2;
        }

        itemHeight() {
            return this.lineHeight();
        }

        drawItem(index) {
            const rect = this.itemLineRect(index);
            let text = '';

            switch(index) {
                case 0:
                    text = 'Stop Travel';
                    break;
                case 1:
                    text = 'Cancel';
                    break;
            }

            this.changePaintOpacity(this.isCommandEnabled(index));
            this.drawText(text, rect.x, rect.y, rect.width);
            this.changePaintOpacity(true);
        }

        isCommandEnabled(index) {
            return true;
        }

        isCancelable() {
            return true;
        }

        currentSymbol() {
            switch(this.index()) {
                case 0:
                    return 'stopTravel';
                case 1:
                    return 'cancel';
            }
        }

        refresh() {
            this.contents.clear();
            this.drawAllItems();
        }

        drawAllItems() {
            for (let i = 0; i < this.maxItems(); i++) {
                this.drawItem(i);
            }
        }
    }

    // Scene_Map extension for travel decision window
    const _Scene_Map_createAllWindows_original = Scene_Map.prototype.createAllWindows;
    Scene_Map.prototype.createAllWindows = function() {
        _Scene_Map_createAllWindows_original.call(this);
        this.createTravelDecisionWindow();
        this.createBorderChoiceWindow();
    };

    Scene_Map.prototype.createTravelDecisionWindow = function() {
        const rect = new Rectangle(
            Graphics.boxWidth / 2 - 150,
            Graphics.boxHeight / 2 - 100,
            300,
            200
        );
        this._travelDecisionWindow = new Window_TravelDecision(rect);
        this._travelDecisionWindow.setBackgroundType(0);
        this._travelDecisionWindow.deactivate();
        this._travelDecisionWindow.hide();
        this._travelDecisionWindow.setHandler('ok', this.onTravelDecision.bind(this));
        this._travelDecisionWindow.setHandler('cancel', this.closeTravelDecision.bind(this));
        this.addWindow(this._travelDecisionWindow);
    };

    Scene_Map.prototype.openTravelDecision = function() {
        this._travelDecisionWindow.select(1); // Default to "Continue"
        this._travelDecisionWindow.refresh();
        this._travelDecisionWindow.show();
        this._travelDecisionWindow.activate();
        Input.clear(); // Consume the menu input
    };

    Scene_Map.prototype.closeTravelDecision = function() {
        this._travelDecisionWindow.hide();
        this._travelDecisionWindow.deactivate();
    };

    Scene_Map.prototype.onTravelDecision = function() {
        const symbol = this._travelDecisionWindow.currentSymbol();

        if (symbol === 'stopTravel') {
            performStopTravel();
            this.closeTravelDecision();
        } else if (symbol === 'cancel') {
            // Just close the window and continue
            this.closeTravelDecision();
        }
    };

    Scene_Map.prototype.createBorderChoiceWindow = function() {
        // Calculate proper size for exactly 3 options
        // Height formula: (lineHeight * numRows) + (padding * 2)
        // Standard lineHeight = 36, padding = 12
        // Height = (36 * 3) + (12 * 2) = 108 + 24 = 132
        const windowWidth = 240;
        const windowHeight = 136; // Exactly 3 rows with proper padding
        const rect = new Rectangle(
            Graphics.boxWidth / 2 - windowWidth / 2,
            Graphics.boxHeight / 2 - windowHeight / 2,
            windowWidth,
            windowHeight
        );
        this._borderChoiceWindow = new Window_BorderChoice(rect);
        this._borderChoiceWindow.setHandler('ok', this.onBorderChoice.bind(this));
        this._borderChoiceWindow.setHandler('cancel', this.closeBorderChoice.bind(this));
        this.addWindow(this._borderChoiceWindow);
    };

    Scene_Map.prototype.openBorderChoice = function(directions) {
        this._borderChoiceWindow.setDirections(directions);
        this._borderChoiceWindow.select(0);
        this._borderChoiceWindow.refresh();
        this._borderChoiceWindow.show();
        this._borderChoiceWindow.activate();
        Input.clear(); // Consume input
    };

    Scene_Map.prototype.closeBorderChoice = function() {
        this._borderChoiceWindow.hide();
        this._borderChoiceWindow.deactivate();
        // Don't reset _borderChoiceShown here - let it stay true so window doesn't
        // re-trigger while player is still on border. It will reset when player moves off border.
    };

    Scene_Map.prototype.onBorderChoice = function() {
        const symbol = this._borderChoiceWindow.currentSymbol();
        const directions = this._borderChoiceWindow._directions;

        if (symbol === 'returnToWorldMap') {
            // Teleport back to world map at OldEurope destination
            this.returnToWorldMap(directions);
            this.closeBorderChoice();
        } else if (symbol === 'explore') {
            // Teleport to edge of procedural map based on direction
            this.exploreProcedural(directions);
            this.closeBorderChoice();
        } else if (symbol === 'cancel') {
            // Just close the window and continue
            this.closeBorderChoice();
        }
    };

    Scene_Map.prototype.returnToWorldMap = function(directions) {
        // Get the destination from OldEurope tag
        const borderDest = this.getBorderDestinationForDirections(directions);

        if (borderDest) {
            // Transfer to world map at OldEurope coordinates
            $gameVariables.setValue(VAR_DEST_MAP, borderDest.mapId);
            $gamePlayer.reserveTransfer(borderDest.mapId, borderDest.x, borderDest.y, 0, 0);
        }
    };

    Scene_Map.prototype.exploreProcedural = function(directions) {
        // Get the border destination (world coordinates from Coords tag)
        const borderDest = this.getBorderDestinationForDirections(directions);

        let edgeX = 1;
        let edgeY = 1;
        let worldX = borderDest ? borderDest.x : 0;
        let worldY = borderDest ? borderDest.y : 0;
        let entryBorder = null; // Track which border player entered from

        if (borderDest) {
            // Adjust world coordinates based on exit direction
            // If exiting from the left (west), spawn on left edge and adjust world coords accordingly
            if (directions.includes('west')) {
                edgeX = 126;
                edgeY = Math.floor(128 / 2);
                worldX = borderDest.x - 1;  // Player is coming from left, so they should be east of the world coords
                worldY = borderDest.y;
                entryBorder = 'west'; // Track entry border
            }
            // If exiting from the right (east), spawn on right edge
            else if (directions.includes('east')) {
                edgeX = 1;
                edgeY = Math.floor(128 / 2);
                worldX = borderDest.x + 1;  // Player is coming from right, so they should be west of the world coords
                worldY = borderDest.y;
                entryBorder = 'east'; // Track entry border
            }
            // If exiting from the top (north), spawn on top edge
            else if (directions.includes('north')) {
                edgeX = Math.floor(128 / 2);
                edgeY = 125;
                worldX = borderDest.x;
                worldY = borderDest.y - 1;  // Player is coming from north, so they should be south of the world coords
                entryBorder = 'north'; // Track entry border
            }
            // If exiting from the bottom (south), spawn on bottom edge
            else if (directions.includes('south')) {
                edgeX = Math.floor(128 / 2);
                edgeY = 1;
                worldX = borderDest.x;
                worldY = borderDest.y + 1;  // Player is coming from south, so they should be north of the world coords
                entryBorder = 'south'; // Track entry border
            }

            // Set variables 43 and 44 to the adjusted world coordinates
            $gameVariables.setValue(VAR_WORLD_X, worldX);
            $gameVariables.setValue(VAR_WORLD_Y, worldY);
        }

        // Generate procedural map
        if ($gameSystem.generateProceduralMap) {
            if ($gameSystem.generateProceduralMap()) {
                // Store entry border before transferring
                if (entryBorder) {
                    $gameSystem._procEntryBorder = entryBorder;
                }
                // Transfer to procedural map at edge position
                $gamePlayer.reserveTransfer(procMapId, edgeX, edgeY, 2, 0);
            }
        }
    };

    Scene_Map.prototype.getBorderDestinationForDirections = function(directions) {
        // Find the Coords destination for the current border

        // Use Coords if available
        if ($gameMap._coordsDest) {
            return {
                mapId: worldMapId,
                x: $gameMap._coordsDest.x,
                y: $gameMap._coordsDest.y
            };
        }

        // Use Borders tag if available
        if ($gameMap._borderDestination) {
            return $gameMap._borderDestination;
        }

        return null;
    };

    // Intercept OK/interact button on world map when facing a tile with no events
    const _Game_Player_triggerButtonAction = Game_Player.prototype.triggerButtonAction;
    Game_Player.prototype.triggerButtonAction = function() {
        if ($gameMap.mapId() === worldMapId && Input.isTriggered('ok')) {
            const x2 = $gameMap.roundXWithDirection(this.x, this.direction());
            const y2 = $gameMap.roundYWithDirection(this.y, this.direction());
            const hasActionEvent = $gameMap.eventsXy(x2, y2).some(e => e.isTriggerIn([0]) && e.isNormalPriority());
            if (!hasActionEvent) {
                const scene = SceneManager._scene;
                if (scene && scene._travelDecisionWindow && !scene._travelDecisionWindow.active) {
                    scene._travelDecisionWindow.select(0);
                    scene._travelDecisionWindow.refresh();
                    scene._travelDecisionWindow.show();
                    scene._travelDecisionWindow.activate();
                    Input.clear();
                    return true;
                }
            }
        }
        return _Game_Player_triggerButtonAction.call(this);
    };

    // Override Game_Player.canMove to block movement when border choice window is open
    const _Game_Player_canMove = Game_Player.prototype.canMove;
    Game_Player.prototype.canMove = function() {
        // Block movement if travel decision window is active
        if (SceneManager._scene && SceneManager._scene._travelDecisionWindow &&
            SceneManager._scene._travelDecisionWindow.active) {
            return false;
        }
        // Block movement if border choice window is active
        if (SceneManager._scene && SceneManager._scene._borderChoiceWindow &&
            SceneManager._scene._borderChoiceWindow.active) {
            return false;
        }
        return _Game_Player_canMove.call(this);
    };

    // Check if player is facing any events

    // Override updateCallMenu to allow normal menu on world/procedural maps
    const _Scene_Map_updateCallMenu = Scene_Map.prototype.updateCallMenu;
    Scene_Map.prototype.updateCallMenu = function() {
        // Normal menu behavior for all maps (including world and procedural)
        _Scene_Map_updateCallMenu.call(this);
    };


    // Override Window_MenuCommand to add Stop/World map options
    const _Window_MenuCommand_makeCommandList = Window_MenuCommand.prototype.makeCommandList;
    Window_MenuCommand.prototype.makeCommandList = function() {
        _Window_MenuCommand_makeCommandList.call(this);

        // Add "Stop" option on world map (315) as second item
        if ($gameMap.mapId() === worldMapId) {
            this.addCommand('Stop', 'stop', true, 282);
            // Move to second position (index 1)
            const command = this._list.pop();
            this._list.splice(1, 0, command);
        }

        // Add "World map" option as second item on all other maps (always visible)
        if ($gameMap.mapId() !== worldMapId) {
            this.addCommand('World map', 'worldMap', true, 190);
            // Move to second position (index 1)
            const command = this._list.pop();
            this._list.splice(1, 0, command);
        }
    };

    // Function to get NON_PROCEDURAL_COORDINATES from ProceduralMapDB
    function getWorldMapCoordinates() {
        if (window.WorldGen && window.WorldGen.NON_PROCEDURAL_COORDINATES) {
            return window.WorldGen.NON_PROCEDURAL_COORDINATES;
        }
        // Fallback if not loaded yet
        return {};
    }

    // Handle World map and Stop command selection
    const _Scene_Menu_createCommandWindow = Scene_Menu.prototype.createCommandWindow;
    Scene_Menu.prototype.createCommandWindow = function() {
        _Scene_Menu_createCommandWindow.call(this);

        this._commandWindow.setHandler('worldMap', this.commandWorldMap.bind(this));
        this._commandWindow.setHandler('stop', this.commandStop.bind(this));
    };

    Scene_Menu.prototype.commandWorldMap = function() {
        // Check if current map is tagged as Interior
        if ($dataMap && $dataMap.note && $dataMap.note.match(/<Interior>/i)) {
            // Play buzzer sound and do nothing
            SoundManager.playBuzzer();
            this._commandWindow.activate();
            return;
        }

        // Return to world map from procedural map at saved coordinates
        const savedX = $gameVariables.value(VAR_WORLD_X) || 0;
        const savedY = $gameVariables.value(VAR_WORLD_Y) || 0;

        if (savedX !== 0 || savedY !== 0) {
            $gamePlayer.reserveTransfer(worldMapId, savedX, savedY, 0, 0);
        }

        SceneManager.pop();
    };

    // Shared stop travel logic (used by both menu command and interact button)
    function performStopTravel() {
        // Force update global variables to player's ACTUAL current position
        if ($gameMap.mapId() === worldMapId) {
            $gameVariables.setValue(VAR_WORLD_X, $gamePlayer.x);
            $gameVariables.setValue(VAR_WORLD_Y, $gamePlayer.y);
        }

        const currentX = $gameVariables.value(VAR_WORLD_X);
        const currentY = $gameVariables.value(VAR_WORLD_Y);
        const NON_PROCEDURAL_COORDS = getWorldMapCoordinates();

        console.log('[WMR] Checking position:', currentX, currentY, 'in NON_PROCEDURAL_COORDS');

        for (const key in NON_PROCEDURAL_COORDS) {
            const location = NON_PROCEDURAL_COORDS[key];

            if (!location.coords || !Array.isArray(location.coords)) {
                console.warn('[WMR] Invalid coords for', key, ':', location.coords);
                continue;
            }

            const isNewFormat = Array.isArray(location.coords[0]);
            const coordsToCheck = isNewFormat ? location.coords : [location.coords];

            console.log('[WMR] Checking', key, '- format:', isNewFormat ? 'new (array of arrays)' : 'old (single array)', 'coords:', coordsToCheck);

            const foundCoord = coordsToCheck.some((coord) => {
                const coordX = parseInt(coord[0]);
                const coordY = parseInt(coord[1]);
                const match = coordX === parseInt(currentX) && coordY === parseInt(currentY);
                console.log('[WMR]   Comparing', coord, '→ [', coordX, ',', coordY, '] vs player [', currentX, ',', currentY, '] = ', match);
                return match;
            });

            if (foundCoord) {
                const direction = $gamePlayer.direction();
                let destination = null;

                console.log('[WMR] Player direction:', direction);

                if (direction === 2) destination = location.south;
                else if (direction === 8) destination = location.north;
                else if (direction === 4) destination = location.west;
                else if (direction === 6) destination = location.east;

                console.log('[WMR] Destination:', destination);

                if (destination) {
                    console.log('[WMR] Transferring to map', destination.id, 'at', destination.x, destination.y);
                    $gamePlayer.reserveTransfer(destination.id, destination.x, destination.y, 0, 0);
                } else {
                    console.log('[WMR] No destination found for direction', direction);
                }
                return;
            }
        }

        console.log('[WMR] No match found in NON_PROCEDURAL_COORDS, generating procedural map');

        if ($gameSystem.generateProceduralMap) {
            if ($gameSystem.generateProceduralMap()) {
                const playerDirection = $gamePlayer.direction();
                const mapWidth = 128;
                const mapHeight = 128;
                let startX = Math.floor(mapWidth / 2);
                let startY = Math.floor(mapHeight / 2);

                switch (playerDirection) {
                    case 2: startY = 1; break;
                    case 4: startX = mapWidth - 2; break;
                    case 6: startX = 1; break;
                    case 8: startY = mapHeight - 2; break;
                }

                $gameVariables.setValue(110, 1);
                $gameVariables.setValue(111, 1);

                $gamePlayer.reserveTransfer(procMapId, startX, startY, playerDirection, 0);
            }
        }
    }

    Scene_Menu.prototype.commandStop = function() {
        performStopTravel();
        SceneManager.pop();
    };

})();
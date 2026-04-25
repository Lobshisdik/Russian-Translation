/*:
 * @target MZ
 * @plugindesc Rent System v1.1.0
 * @author Omni-Lex
 * @url https://nocoldiz.itch.io/hypernet-explorer
 * @help RentSystem.js
 *
 * @command rent
 * @text Rent Location
 * @desc Rent a location for 24 hours
 * @arg price
 * @text Price
 * @desc Price in gold to rent the location
 * @type number
 * @default 1000
 *
 * @command showRoomList
 * @text Show Room List
 * @desc Display all rentable rooms (events named "Room") on the current map with prices and remaining time. Player can remotely rent rooms.
 *
 * This plugin allows players to rent locations for 24 hours using real time.
 *
 * Setting Up Rooms:
 * - Create events named exactly "Room" (case-insensitive)
 * - Optionally set price in event note: <price:2000> (default: 1000 gold)
 * - When rented, self switch A will be turned ON for that event
 * When the rent command is called, it will show a confirmation window.
 * If accepted, self switch A will be turned ON for 24 hours.
 * * Price conversion: 1000 gold = 10€
 * * The switch will only change on map transfers, not when loading saves
 * to prevent players from getting stuck in rented areas.
 * * Directional Access:
 * Add one of these letters in event notes to enable free access from that direction:
 * - N: Access from North (player approaches from below)
 * - S: Access from South (player approaches from above)  
 * - W: Access from West (player approaches from right)
 * - E: Access from East (player approaches from left)
 * * Plugin Commands:
 * - Rent: Shows rent confirmation and processes payment
 * - Show Room List: Displays all available rooms on the current map with prices, names, and remaining rental time.
 *   Player can remotely rent or view details for each room.
 */

(() => {
    'use strict';
    
    // Plugin name for data storage
    const PLUGIN_NAME = 'RentSystem';
    
    // Translation function
    function getText(key) {
        const useTranslation = ConfigManager.language === 'it';
        
        const translations = {
            'rent_question': {
                'en': 'Rent',
                'it': 'Affitta'
            },
            'free_access': {
                'en': 'Free access',
                'it': 'Accesso gratuito'
            },
            'already_rented': {
                'en': 'You have already rented this room',
                'it': 'Hai già affittato questa camera'
            },
            'for_24h_rent': {
                'en': 'for 24h rent',
                'it': 'per affitto 24h'
            },
            'cancel': {
                'en': 'Cancel',
                'it': 'Annulla'
            },
            'free_access_granted': {
                'en': 'Free access granted to',
                'it': 'Accesso gratuito concesso a'
            },
            'access_restored': {
                'en': 'Access restored to',
                'it': 'Accesso ripristinato a'
            },
            'rented_for_24h': {
                'en': 'Enjoy your stay!',
                'it': 'Buona permanenza!'
            },
            'for_24_hours': {
                'en': 'for 24 hours!',
                'it': 'per 24 ore!'
            },
            'not_enough_gold': {
                'en': 'Not enough euro!',
                'it': 'Euro insufficienti!'
            },
            'error_event_id': {
                'en': 'Error: Cannot determine event ID',
                'it': 'Errore: Impossibile determinare ID evento'
            },
            'rented': {
                'en': 'Rented',
                'it': 'Affittata'
            },
            'expired': {
                'en': 'Expired',
                'it': 'Scaduta'
            },
            'available_rooms': {
                'en': 'Available Rooms',
                'it': 'Stanze Disponibili'
            }
        };

        // Return translation or key name as fallback
        if (translations[key]) {
            return useTranslation ? translations[key]['it'] : translations[key]['en'];
        }
        console.warn(`RentSystem: Missing translation for key: ${key}`);
        return key;
    }
    
    // Initialize rental system
    function initializeRentals() {
        if (!$dataSystem.rentals) {
            $dataSystem.rentals = {};
        }
    }
    
    // Function to get player's approach direction to an event
    function getApproachDirection(eventX, eventY) {
        const playerX = $gamePlayer.x;
        const playerY = $gamePlayer.y;
        
        const dx = eventX - playerX;
        const dy = eventY - playerY;
        
        // Determine which direction has the larger difference
        if (Math.abs(dx) > Math.abs(dy)) {
            return dx > 0 ? 'W' : 'E'; // Player is West or East of event
        } else {
            return dy > 0 ? 'N' : 'S'; // Player is North or South of event
        }
    }
    
    // Function to check if event allows free access from current direction
    function checkDirectionalAccess(eventId) {
        const event = $dataMap.events[eventId];
        if (!event || !event.note) return false;
        
        const eventX = event.x;
        const eventY = event.y;
        const playerX = $gamePlayer.x;
        const playerY = $gamePlayer.y;
        
        // Check if player is on the same tile as the event or adjacent
        const dx = eventX - playerX;
        const dy = eventY - playerY;
        const distance = Math.abs(dx) + Math.abs(dy);
        
        if (distance > 1) {
            console.log(`Event ${eventId}: Player too far from event (distance: ${distance})`);
            return false;
        }
        
        const approachDirection = getApproachDirection(eventX, eventY);
        
        // Check if the event note contains the approach direction letter
        const hasDirectionalAccess = event.note.toUpperCase().includes(approachDirection);
        
        console.log(`Event ${eventId}: Player at (${playerX},${playerY}), Event at (${eventX},${eventY})`);
        console.log(`Approach direction: ${approachDirection}, Note: "${event.note}", Access granted: ${hasDirectionalAccess}`);
        
        return hasDirectionalAccess;
    }

    //=============================================================================
    // Window_RoomList - Room display window
    //=============================================================================

    class Window_RoomList extends Window_Selectable {
        initialize(rect) {
            super.initialize(rect);
            this._rooms = getRoomsOnCurrentMap();
            this._onSelectCallback = null;
            this.refresh();
        }

        setOnSelectCallback(callback) {
            this._onSelectCallback = callback;
        }

        maxCols() {
            return 1;
        }

        maxItems() {
            return this._rooms ? this._rooms.length : 0;
        }

        itemHeight() {
            return 36;
        }

        currentRoom() {
            return this._rooms ? this._rooms[this.index()] : null;
        }

        select(index) {
            super.select(index);
            if (this._onSelectCallback && index >= 0) {
                this._onSelectCallback(index);
            }
        }

        drawItem(index) {
            const room = this._rooms[index];
            if (!room) return;

            const rect = this.itemLineRect(index);
            const priceInEuros = (room.price / 100).toFixed(2);
            const roomLabel = `Room ${index + 1}`;

            let statusText, statusColor;
            if (room.isRented) {
                const timeRemaining = getTimeRemaining(room.expirationTime);
                statusText = `${getText('rented')} - ${timeRemaining}`;
                statusColor = 4; // Blue
            } else {
                statusText = `€${priceInEuros}`;
                statusColor = 3; // Green
            }

            this.resetTextColor();
            this.drawText(roomLabel, rect.x, rect.y, 200);
            this.changeTextColor(ColorManager.textColor(statusColor));
            this.drawText(statusText, rect.x + 220, rect.y, rect.width - 220, 'left');
            this.resetTextColor();
        }

        refresh() {
            this._rooms = getRoomsOnCurrentMap();
            super.refresh();
        }
    }

    //=============================================================================
    // Room List Overlay - shown directly on the map scene so camera panning works
    //=============================================================================

    Scene_Map.prototype.showRoomListOverlay = function() {
        if (this._roomListOverlay) return;

        const rooms = getRoomsOnCurrentMap();
        if (!rooms.length) return;

        const itemH = 36;
        const pad = $gameSystem.windowPadding() * 2;
        const ww = 440;
        const wh = rooms.length * itemH + pad;
        const wx = 4;
        const wy = 4;

        const rect = new Rectangle(wx, wy, ww, wh);
        this._roomListOverlay = new Window_RoomList(rect);
        this._roomListOverlay.setOnSelectCallback(this.panMapToRoomEvent.bind(this));
        this._roomListOverlay.setHandler('ok', this.onRoomListOverlayOk.bind(this));
        this._roomListOverlay.setHandler('cancel', this.closeRoomListOverlay.bind(this));
        this.addWindow(this._roomListOverlay);
        this._roomListOverlay.activate();
        this._createRoomArrow();
        this._roomListOverlay.select(0);
    };

    Scene_Map.prototype._createRoomArrow = function() {
        if (this._roomArrowSprite) return;

        // Build a down-pointing arrow bitmap
        const aw = 32, ah = 22;
        const bitmap = new Bitmap(aw, ah);
        const ctx = bitmap.context;
        ctx.fillStyle = '#ffff66';
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.moveTo(aw / 2, ah - 1);  // tip at bottom center
        ctx.lineTo(1,       1);       // top-left
        ctx.lineTo(aw - 1,  1);       // top-right
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        bitmap._baseTexture.update();

        const sprite = new Sprite(bitmap);
        sprite.anchor.set(0.5, 1.0); // pivot at the tip
        this._roomArrowSprite = sprite;
        this._roomArrowTick = 0;

        // Insert just below the window layer so it renders over the map
        const idx = this.children.indexOf(this._windowLayer);
        this.addChildAt(sprite, idx >= 0 ? idx : this.children.length);
    };

    Scene_Map.prototype.panMapToRoomEvent = function(index) {
        const rooms = getRoomsOnCurrentMap();
        const room = rooms[index];
        if (!room) return;
        const event = $dataMap.events[room.eventId];
        if (!event) return;
        const tw = $gameMap.tileWidth();
        const th = $gameMap.tileHeight();
        const centerX = (Graphics.boxWidth / tw - 1) / 2;
        const centerY = (Graphics.boxHeight / th - 1) / 2;
        $gameMap.setDisplayPos(event.x - centerX, event.y - centerY);

        // Reveal fog of war around the room event
        if (this._spriteset && this._spriteset.revealCircularArea) {
            this._spriteset.revealCircularArea(event.x, event.y, 6);
        }
    };

    Scene_Map.prototype.onRoomListOverlayOk = function() {
        const room = this._roomListOverlay.currentRoom();
        if (!room) {
            this._roomListOverlay.activate();
            return;
        }

        if (room.isRented) {
            window.skipLocalization = true;
            $gameSystem._rentHideBust = true;
            $gameMessage.add(getText('already_rented'));
            window.skipLocalization = false;
            this._roomListOverlay.activate();
            return;
        }

        const price = room.price;
        if ($gameParty.gold() >= price) {
            $gameParty.loseGold(price);
            const eventKey = room.mapId + '_' + room.eventId;
            processRental(eventKey, room.mapId, room.eventId);
            SoundManager.playShop();
            window.skipLocalization = true;
            $gameSystem._rentHideBust = true;
            $gameMessage.add(getText('rented_for_24h'));
            window.skipLocalization = false;
            this._roomListOverlay.refresh();
            this.closeRoomListOverlay();
        } else {
            window.skipLocalization = true;
            $gameSystem._rentHideBust = true;
            $gameMessage.add(getText('not_enough_gold'));
            window.skipLocalization = false;
            this._roomListOverlay.activate();
        }
    };

    Scene_Map.prototype.closeRoomListOverlay = function() {
        if (this._roomListOverlay) {
            this._windowLayer.removeChild(this._roomListOverlay);
            this._roomListOverlay.destroy();
            this._roomListOverlay = null;
        }
        if (this._roomArrowSprite) {
            this._roomArrowSprite.parent.removeChild(this._roomArrowSprite);
            this._roomArrowSprite.destroy();
            this._roomArrowSprite = null;
        }
        $gameSystem._roomListClosed = true;

        // Reset camera back to player
        const tw = $gameMap.tileWidth();
        const th = $gameMap.tileHeight();
        const centerX = (Graphics.boxWidth / tw - 1) / 2;
        const centerY = (Graphics.boxHeight / th - 1) / 2;
        $gameMap.setDisplayPos($gamePlayer.x - centerX, $gamePlayer.y - centerY);

        // Hide busts when the menu closes
        const scene = SceneManager._scene;
        if (scene && scene._bustManager) scene._bustManager.hideBusts();
    };

    //=============================================================================
    // Interpreter wait mode so the event pauses while the overlay is open
    //=============================================================================

    const _Game_Interpreter_updateWaitMode_rent = Game_Interpreter.prototype.updateWaitMode;
    Game_Interpreter.prototype.updateWaitMode = function() {
        if (this._waitMode === 'roomList') {
            if ($gameSystem._roomListClosed) {
                $gameSystem._roomListClosed = false;
                this._waitMode = '';
                return false;
            }
            return true;
        }
        return _Game_Interpreter_updateWaitMode_rent.call(this);
    };

    // Register plugin command
    PluginManager.registerCommand(PLUGIN_NAME, "rent", args => {

        const price = parseInt(args.price) || 1000;
        
        // Get current event ID more reliably
        const interpreter = $gameMap._interpreter;
        const eventId = interpreter._eventId || interpreter.eventId();
        const mapId = $gameMap.mapId();
        
        if (!eventId) {
            window.skipLocalization = true;
            $gameSystem._rentHideBust = true;
            $gameMessage.add(getText('error_event_id'));
            window.skipLocalization = false;

            return;
        }

        // Reveal fog of war around this room
        const _rentEvent = $dataMap.events[eventId];
        if (_rentEvent) {
            const scene = SceneManager._scene;
            if (scene && scene._spriteset && scene._spriteset.revealCircularArea) {
                scene._spriteset.revealCircularArea(_rentEvent.x, _rentEvent.y, 6);
            }
        }

        // Check for directional access first
        if (checkDirectionalAccess(eventId)) {
            // Free access granted based on direction
            const eventName = $dataMap.events[eventId]?.name || 'Location';
            processDirectionalAccess(mapId, eventId);
            window.skipLocalization = true;
            $gameSystem._rentHideBust = true;
            $gameMessage.add(`${getText('free_access_granted')} ${eventName}!`);
            window.skipLocalization = false;

            return;
        }
        
        const eventKey = mapId + '_' + eventId;
        const eventName = $dataMap.events[eventId]?.name || 'Location';
        
        // Convert gold to euros (1000 gold = 10€)
        const priceInEuros = (price / 100).toFixed(2);
        
        showRentConfirmation(eventName, price, priceInEuros, eventKey, mapId, eventId);
    });

    // Register plugin command for showing room list
    PluginManager.registerCommand(PLUGIN_NAME, "showRoomList", args => {
        const rooms = getRoomsOnCurrentMap();
        if (rooms.length === 0) {
            $gameMessage.add('No rooms available to rent.');
            return;
        }

        $gameSystem._roomListClosed = false;
        const scene = SceneManager._scene;
        if (scene && scene.showRoomListOverlay) {
            scene.showRoomListOverlay();
        }
        const interpreter = $gameMap._interpreter;
        if (interpreter) {
            interpreter.setWaitMode('roomList');
        }
    });

    // Function to process directional access (free access)
    function processDirectionalAccess(mapId, eventId) {
        // Turn on self switch A for the current event
        const key = [mapId, eventId, 'A'];
        $gameSelfSwitches.setValue(key, true);
        
        // Force refresh of the current event
        $gameMap.requestRefresh();
        
        console.log(`Directional access granted: Event ${eventId} on Map ${mapId}, Switch key:`, key);
        console.log('Self switch set to:', $gameSelfSwitches.value(key));
    }
    
    // Function to process already rented access (restore access without resetting timer)
    function processAlreadyRentedAccess(mapId, eventId) {
        // Turn on self switch A for the current event
        const key = [mapId, eventId, 'A'];
        $gameSelfSwitches.setValue(key, true);
        
        // Force refresh of the current event
        $gameMap.requestRefresh();
        
        console.log(`Already rented access restored: Event ${eventId} on Map ${mapId}, Switch key:`, key);
        console.log('Self switch set to:', $gameSelfSwitches.value(key));
    }
    
    // Function to show rent confirmation window
    function showRentConfirmation(eventName, price, priceInEuros, eventKey, mapId, eventId, hasDirectionalAccess, isAlreadyRented) {
        const message = `${getText('rent_question')} ${eventName}?`;
        let option1Text;
        
        if (hasDirectionalAccess) {
            option1Text = getText('free_access');
        } else if (isAlreadyRented) {
            option1Text = getText('already_rented');
        } else {
            option1Text = `€${priceInEuros} ${getText('for_24h_rent')}`;
        }
        window.skipLocalization = true;
        $gameSystem._rentHideBust = true;
        $gameMessage.add(message);
        window.skipLocalization = false;

        $gameMessage.setChoices([option1Text, getText('cancel')], 0, 1);
        $gameMessage.setChoiceCallback(n => {
            if (n === 0) { // First option selected
                window.skipLocalization = true;

                if (hasDirectionalAccess) {
                    // Free access granted based on direction
                    processDirectionalAccess(mapId, eventId);
                } else if (isAlreadyRented) {
                    // Restore access without resetting timer
                    processAlreadyRentedAccess(mapId, eventId);
                } else {
                    // Normal rental process
                    if ($gameParty.gold() >= price) {
                        $gameParty.loseGold(price);
                        processRental(eventKey, mapId, eventId);
                        SoundManager.playShop();

                    } else {
                        window.skipLocalization = true;
                        $gameSystem._rentHideBust = true;
                        $gameMessage.add(getText('not_enough_gold'));
                        window.skipLocalization = false;

                    }
                }

            }
            // If n === 1 (Cancel), do nothing - choice window will close automatically
        });

    }
    
    // Function to process the rental
    function processRental(eventKey, mapId, eventId) {
        initializeRentals(); // Ensure rentals object exists

        const currentTime = Date.now();
        const expirationTime = currentTime + (24 * 60 * 60 * 1000); // 24 hours in milliseconds

        // Store rental information
        $dataSystem.rentals[eventKey] = {
            mapId: mapId,
            eventId: eventId,
            startTime: currentTime,
            expirationTime: expirationTime,
            active: true
        };

        // Store game time when rental started (for TimeDateSystem compatibility)
        storeRentalStartTime(expirationTime);

        // Turn on self switch A for the current event
        const key = [mapId, eventId, 'A'];
        $gameSelfSwitches.setValue(key, true);

        // Force refresh of the current event
        $gameMap.requestRefresh();

        console.log(`Rental processed: Event ${eventId} on Map ${mapId}, Switch key:`, key);
        console.log('Self switch set to:', $gameSelfSwitches.value(key));
    }
    
    // Function to check and update rental status
    function updateRentalStatus() {
        initializeRentals(); // Ensure rentals object exists
        
        const currentTime = Date.now();
        
        for (const eventKey in $dataSystem.rentals) {
            const rental = $dataSystem.rentals[eventKey];
            
            if (rental.active && currentTime >= rental.expirationTime) {
                // Rental has expired
                rental.active = false;
                
                // Turn off self switch A
                const key = [rental.mapId, rental.eventId, 'A'];
                $gameSelfSwitches.setValue(key, false);
                
                console.log(`Rental expired: Event ${rental.eventId} on Map ${rental.mapId}`);
            }
        }
        
        // Force refresh current map if any rentals changed
        $gameMap.requestRefresh();
    }
    
    // Initialize rentals when creating new game objects
    const _DataManager_createGameObjects = DataManager.createGameObjects;
    DataManager.createGameObjects = function() {
        _DataManager_createGameObjects.call(this);
        initializeRentals();
    };
    
    // Initialize rentals when loading database
    const _DataManager_onLoad = DataManager.onLoad;
    DataManager.onLoad = function(object) {
        _DataManager_onLoad.call(this, object);
        if (object === $dataSystem) {
            initializeRentals();
        }
    };
    
    // Override DataManager.makeSaveContents to save rental data
    const _DataManager_makeSaveContents = DataManager.makeSaveContents;
    DataManager.makeSaveContents = function() {
        const contents = _DataManager_makeSaveContents.call(this);
        initializeRentals();
        contents.rentals = $dataSystem.rentals;
        contents.rentalStartTimes = $dataSystem.rentalStartTimes || {};
        return contents;
    };

    // Override DataManager.extractSaveContents to load rental data
    const _DataManager_extractSaveContents = DataManager.extractSaveContents;
    DataManager.extractSaveContents = function(contents) {
        _DataManager_extractSaveContents.call(this, contents);
        $dataSystem.rentals = contents.rentals || {};
        $dataSystem.rentalStartTimes = contents.rentalStartTimes || {};
        // Don't update rental status here to prevent players getting stuck
    };
    
    // Clean up expired rentals periodically + refresh room list overlay timer display
    const _Scene_Map_update = Scene_Map.prototype.update;
    Scene_Map.prototype.update = function() {
        _Scene_Map_update.call(this);

        // Check rentals every 60 seconds (3600 frames at 60 FPS)
        if (Graphics.frameCount % 3600 === 0) {
            cleanupExpiredRentals();
        }

        // Refresh room list overlay every second so time-remaining stays current
        if (this._roomListOverlay && Graphics.frameCount % 60 === 0) {
            this._roomListOverlay.refresh();
        }

        // Bounce the room arrow — position derived from the event's actual screen coords
        if (this._roomArrowSprite && this._roomListOverlay) {
            this._roomArrowTick = (this._roomArrowTick || 0) + 1;
            const idx = this._roomListOverlay.index();
            const room = this._roomListOverlay._rooms && this._roomListOverlay._rooms[idx];
            if (room) {
                const event = $dataMap.events[room.eventId];
                if (event) {
                    const tw = $gameMap.tileWidth();
                    const th = $gameMap.tileHeight();
                    const screenX = ($gameMap.adjustX(event.x) + 0.5) * tw;
                    const screenY = $gameMap.adjustY(event.y) * th;
                    const bounce = Math.sin(this._roomArrowTick * 0.12) * 7;
                    this._roomArrowSprite.x = Math.round(screenX);
                    this._roomArrowSprite.y = Math.round(screenY - th * 0.1 + bounce);
                }
            }
        }
    };
    
    // Function to clean up expired rental data
    function cleanupExpiredRentals() {
        initializeRentals();
        const currentTime = Date.now();
        
        for (const eventKey in $dataSystem.rentals) {
            const rental = $dataSystem.rentals[eventKey];
            
            // Remove rental data that's been expired for more than 24 hours
            if (!rental.active && currentTime >= (rental.expirationTime + 24 * 60 * 60 * 1000)) {
                delete $dataSystem.rentals[eventKey];
            }
        }
    }
    
    // Function to get time remaining for a rental in human-readable format
    // Uses TimeDateSystem's game time variable (114) for consistency
    function getTimeRemaining(expirationTime) {
        const gameTimeVariableId = 114; // Variable 114 = game time in TimeDateSystem
        const currentGameMinutes = $gameVariables.value(gameTimeVariableId) || 0;
        const startGameMinutes = getGameStartMinutesForRental(expirationTime);

        // Calculate remaining rental minutes (24 hours = 1440 minutes)
        const rentalDurationMinutes = 24 * 60;
        const elapsedMinutes = currentGameMinutes - startGameMinutes;
        const remainingMinutes = rentalDurationMinutes - elapsedMinutes;

        if (remainingMinutes <= 0) {
            return getText('expired');
        }

        const remainingHours = Math.floor(remainingMinutes / 60);
        const mins = remainingMinutes % 60;

        if (remainingHours > 0) {
            return `${remainingHours}h ${mins}m`;
        }
        return `${mins}m`;
    }

    // Store rental start times in real-time to calculate game time elapsed
    function getGameStartMinutesForRental(expirationTime) {
        if (!$dataSystem.rentalStartTimes) {
            $dataSystem.rentalStartTimes = {};
        }

        const key = `rental_${expirationTime}`;
        return $dataSystem.rentalStartTimes[key] || 0;
    }

    // Store game time when rental starts
    function storeRentalStartTime(expirationTime) {
        if (!$dataSystem.rentalStartTimes) {
            $dataSystem.rentalStartTimes = {};
        }

        const gameTimeVariableId = 114;
        const currentGameMinutes = $gameVariables.value(gameTimeVariableId) || 0;
        const key = `rental_${expirationTime}`;
        $dataSystem.rentalStartTimes[key] = currentGameMinutes;
    }

    // Function to get all rooms (events named "Room") on current map
    function getRoomsOnCurrentMap() {
        const mapId = $gameMap.mapId();
        const rooms = [];

        if (!$dataMap || !$dataMap.events) {
            return rooms;
        }

        for (let eventId = 1; eventId < $dataMap.events.length; eventId++) {
            const event = $dataMap.events[eventId];
            if (!event) continue;

            const eventName = event.name || '';

            // Only include events named "Room"
            if (eventName.toLowerCase() === 'room') {
                // Try to extract price from event note or use default
                let price = 1000; // Default price
                if (event.note) {
                    const priceMatch = event.note.match(/<price[:\s]*(\d+)>/i);
                    if (priceMatch) {
                        price = parseInt(priceMatch[1]);
                    }
                }

                const eventKey = mapId + '_' + eventId;
                const rental = $dataSystem.rentals[eventKey];
                const isRented = rental && rental.active;

                rooms.push({
                    eventId: eventId,
                    mapId: mapId,
                    name: eventName,
                    price: price,
                    isRented: isRented,
                    expirationTime: isRented ? rental.expirationTime : null
                });
            }
        }

        console.log(`Found ${rooms.length} Room events on map ${mapId}`);
        return rooms;
    }

    // (kept for potential external calls)
    function showRoomListWindow() {
        const rooms = getRoomsOnCurrentMap();
        if (rooms.length === 0) {
            $gameMessage.add('No rooms available to rent.');
            return;
        }
        $gameSystem._roomListClosed = false;
        const scene = SceneManager._scene;
        if (scene && scene.showRoomListOverlay) {
            scene.showRoomListOverlay();
        }
        const interpreter = $gameMap._interpreter;
        if (interpreter) {
            interpreter.setWaitMode('roomList');
        }
    }

    // Add missing translations
    const originalGetText = getText;
    window.getText_RentSystem = function(key) {
        const useTranslation = ConfigManager.language === 'it';

        const translations = {
            'expired': {
                'en': 'Expired',
                'it': 'Scaduto'
            },
            'hours_remaining': {
                'en': 'hours remaining',
                'it': 'ore rimanenti'
            },
            'rented': {
                'en': 'Rented',
                'it': 'Affittato'
            },
            'rent_now': {
                'en': 'Rent Now',
                'it': 'Affitta Ora'
            },
            'no_rooms': {
                'en': 'No rooms available',
                'it': 'Nessuna stanza disponibile'
            },
            'available_rooms': {
                'en': 'Available Rooms',
                'it': 'Stanze Disponibili'
            }
        };

        return useTranslation ? translations[key]['it'] : translations[key]['en'];
    };

    // Debug commands
    window.checkRentals = function() {
        initializeRentals();
        console.log('Current rentals:', $dataSystem.rentals);
        console.log('All self switches:', $gameSelfSwitches._data);
        updateRentalStatus();
    };
    
    window.testSwitch = function(mapId, eventId) {
        const key = [mapId, eventId, 'A'];
        console.log(`Switch [${mapId}, ${eventId}, A]:`, $gameSelfSwitches.value(key));
        $gameSelfSwitches.setValue(key, true);
        $gameMap.requestRefresh();
        console.log('Switch set to true and map refreshed');
    };
    
    // Debug function to test directional access
    window.testDirectionalAccess = function(eventId) {
        console.log('Testing directional access for event:', eventId);
        const hasAccess = checkDirectionalAccess(eventId);
        console.log('Has directional access:', hasAccess);
    };

    // Hide bust after any message flagged by the rent system
    const _RentSystem_terminateMessage = Window_Message.prototype.terminateMessage;
    Window_Message.prototype.terminateMessage = function() {
        _RentSystem_terminateMessage.call(this);
        if ($gameSystem._rentHideBust) {
            $gameSystem._rentHideBust = false;
            const scene = SceneManager._scene;
            if (scene && scene._bustManager) scene._bustManager.hideBusts();
        }
    };

})();
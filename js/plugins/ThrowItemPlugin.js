/*:
 * @target MZ
 * @plugindesc Throw Item Plugin v1.0.0
 * @author OmniLexrName
 * @url 
 * @help
 * ============================================================================
 * Throw Item Plugin for RPG Maker MZ
 * ============================================================================
 * 
 * This plugin allows players to throw items, weapons, and armor on the map.
 * Items are thrown with physics simulation based on their weight.
 * 
 * Features:
 * - Throw items up to 8 tiles away
 * - Diagonal throwing support
 * - Physics simulation based on item weight
 * - Items persist on maps
 * - Pick up thrown items
 * - Visual targeting system
 * 
 * Note Tags:
 * <Weight: X> - Set item weight in grams (default: 100)
 * 
 * Plugin Commands:
 * - Throw Item: Start the throwing process for a specific item
 * 
 * @command throwItem
 * @text Throw Item
 * @desc Start the throwing process for an item
 * 
 * @arg itemId
 * @text Item ID
 * @desc ID of the item to throw
 * @type number
 * @default 1
 * 
 * @arg itemType
 * @text Item Type
 * @desc Type of item to throw
 * @type select
 * @option Item
 * @value item
 * @option Weapon
 * @value weapon
 * @option Armor
 * @value armor
 * @default item
 */

(() => {
    'use strict';
    
    const pluginName = 'ThrowItemPlugin';
    
    // Storage for thrown items
    const ThrownItemManager = {
        items: {},
        
        initialize() {
            this.items = {};
        },
        
        addItem(mapId, x, y, itemData) {
            if (!this.items[mapId]) {
                this.items[mapId] = [];
            }
            this.items[mapId].push({
                x: x,
                y: y,
                itemType: itemData.itemType,
                itemId: itemData.itemId,
                iconIndex: itemData.iconIndex
            });
        },
        
        removeItem(mapId, x, y) {
            if (!this.items[mapId]) return null;
            
            const index = this.items[mapId].findIndex(item => 
                item.x === x && item.y === y
            );
            
            if (index >= 0) {
                return this.items[mapId].splice(index, 1)[0];
            }
            return null;
        },
        
        getItem(mapId, x, y) {
            if (!this.items[mapId]) return null;
            
            return this.items[mapId].find(item => 
                item.x === x && item.y === y
            );
        },
        
        getItemsForMap(mapId) {
            return this.items[mapId] || [];
        }
    };
    
    // Initialize thrown item manager
    ThrownItemManager.initialize();
    
    // Save and load thrown items
    const _DataManager_makeSaveContents = DataManager.makeSaveContents;
    DataManager.makeSaveContents = function() {
        const contents = _DataManager_makeSaveContents.call(this);
        contents.thrownItems = ThrownItemManager.items;
        return contents;
    };
    
    const _DataManager_extractSaveContents = DataManager.extractSaveContents;
    DataManager.extractSaveContents = function(contents) {
        _DataManager_extractSaveContents.call(this, contents);
        ThrownItemManager.items = contents.thrownItems || {};
    };
    
    // Throw targeting scene
    class Scene_ThrowTarget extends Scene_Base {
        constructor(itemData) {
            super();
            this._itemData = itemData;
            this._targetX = $gamePlayer.x;
            this._targetY = $gamePlayer.y;
            this._maxRange = 8;
        }
        
        create() {
            super.create();
            this.createBackground();
            this.createTargetSprite();
            this.createRangeIndicator();
            this.createHelpWindow();
        }
        
        createBackground() {
            this._backgroundSprite = new Sprite();
            this._backgroundSprite.bitmap = SceneManager.backgroundBitmap();
            this.addChild(this._backgroundSprite);
        }
        
        createTargetSprite() {
            this._targetSprite = new Sprite();
            this._targetSprite.bitmap = new Bitmap(48, 48);
            this._targetSprite.bitmap.fillRect(0, 0, 48, 48, 'rgba(255, 255, 0, 0.5)');
            this._targetSprite.anchor.x = 0.5;
            this._targetSprite.anchor.y = 0.5;
            this.addChild(this._targetSprite);
            this.updateTargetPosition();
        }
        
        createRangeIndicator() {
            this._rangeSprite = new Sprite();
            this._rangeSprite.bitmap = new Bitmap(Graphics.width, Graphics.height);
            this.addChild(this._rangeSprite);
            this.drawRangeIndicator();
        }
        
        drawRangeIndicator() {
            const bitmap = this._rangeSprite.bitmap;
            bitmap.clear();
            
            const centerX = $gamePlayer.screenX();
            const centerY = $gamePlayer.screenY() - 24;
            const tileSize = 48;
            
            for (let dx = -this._maxRange; dx <= this._maxRange; dx++) {
                for (let dy = -this._maxRange; dy <= this._maxRange; dy++) {
                    if (Math.abs(dx) + Math.abs(dy) <= this._maxRange) {
                        const screenX = centerX + dx * tileSize;
                        const screenY = centerY + dy * tileSize;
                        bitmap.fillRect(screenX - 24, screenY - 24, 48, 48, 'rgba(0, 255, 0, 0.1)');
                    }
                }
            }
        }
        
        createHelpWindow() {
            const rect = new Rectangle(0, 0, Graphics.width, 72);
            this._helpWindow = new Window_Help(rect);
            this._helpWindow.setText('Use arrow keys to aim, OK to throw, Cancel to abort');
            this.addWindow(this._helpWindow);
        }
        
        update() {
            super.update();
            this.updateInput();
            this.updateTargetPosition();
        }
        
        updateInput() {
            if (Input.isRepeated('up')) {
                this.moveTarget(0, -1);
            }
            if (Input.isRepeated('down')) {
                this.moveTarget(0, 1);
            }
            if (Input.isRepeated('left')) {
                this.moveTarget(-1, 0);
            }
            if (Input.isRepeated('right')) {
                this.moveTarget(1, 0);
            }
            
            if (Input.isTriggered('ok')) {
                this.throwItem();
            }
            if (Input.isTriggered('cancel')) {
                this.popScene();
            }
        }
        
        moveTarget(dx, dy) {
            const newX = this._targetX + dx;
            const newY = this._targetY + dy;
            const distance = Math.abs(newX - $gamePlayer.x) + Math.abs(newY - $gamePlayer.y);
            
            if (distance <= this._maxRange) {
                this._targetX = newX;
                this._targetY = newY;
                SoundManager.playCursor();
            }
        }
        
        updateTargetPosition() {
            const tileSize = 48;
            this._targetSprite.x = $gameMap.adjustX(this._targetX) * tileSize + tileSize / 2;
            this._targetSprite.y = $gameMap.adjustY(this._targetY) * tileSize + tileSize / 2;
        }
        
        throwItem() {
            const weight = this.getItemWeight();
            const trajectory = this.calculateTrajectory(weight);
            
            if (trajectory.length > 0) {
                const finalPos = trajectory[trajectory.length - 1];
                
                // Check if final position should destroy item
                const terrainTag = $gameMap.terrainTag(finalPos.x, finalPos.y);
                const regionId = $gameMap.regionId(finalPos.x, finalPos.y);
                
                if (terrainTag === 3 || regionId === 99) {
                    // Item destroyed
                    this.removeItemFromInventory();
                    window.skipLocalization = true;
                    $gameMessage.add('The item was destroyed!');
                    window.skipLocalization = false;
                } else {
                    // Place item on map
                    ThrownItemManager.addItem($gameMap.mapId(), finalPos.x, finalPos.y, this._itemData);
                    this.removeItemFromInventory();
                    
                    // Create thrown item sprite on map
                    if (SceneManager._scene instanceof Scene_Map) {
                        SceneManager._scene._spriteset.createThrownItemSprite(finalPos.x, finalPos.y, this._itemData);
                    }
                }
                
                // Animate throw
                this.animateThrow(trajectory);
            }
            
            this.popScene();
        }
        
        getItemWeight() {
            let item = null;
            
            switch (this._itemData.itemType) {
                case 'item':
                    item = $dataItems[this._itemData.itemId];
                    break;
                case 'weapon':
                    item = $dataWeapons[this._itemData.itemId];
                    break;
                case 'armor':
                    item = $dataArmors[this._itemData.itemId];
                    break;
            }
            
            if (item && item.meta.Weight) {
                return parseInt(item.meta.Weight);
            }
            return 100; // Default weight in grams
        }
        
        calculateTrajectory(weight) {
            const trajectory = [];
            const startX = $gamePlayer.x;
            const startY = $gamePlayer.y;
            const targetX = this._targetX;
            const targetY = this._targetY;
            
            // Calculate throw force based on weight
            const maxForce = 1000; // Maximum force in arbitrary units
            const forceFactor = Math.max(0.3, 1 - (weight / 5000)); // Heavier items don't go as far
            const effectiveRange = Math.floor(this._maxRange * forceFactor);
            
            // Calculate direction
            const dx = targetX - startX;
            const dy = targetY - startY;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance === 0) return trajectory;
            
            const stepX = dx / distance;
            const stepY = dy / distance;
            
            // Simulate physics
            let currentX = startX;
            let currentY = startY;
            let steps = Math.min(distance, effectiveRange);
            
            for (let i = 1; i <= steps; i++) {
                currentX = Math.round(startX + stepX * i);
                currentY = Math.round(startY + stepY * i);
                
                // Check collision
                if (!this.canPass(currentX, currentY)) {
                    break;
                }
                
                trajectory.push({ x: currentX, y: currentY });
            }
            
            return trajectory;
        }
        
        canPass(x, y) {
            // Check if tile is passable
            if (!$gameMap.isPassable(x, y, 2)) return false;
            
            // Check for terrain tag 4
            if ($gameMap.terrainTag(x, y) === 4) return false;
            
            // Check for region 10
            if ($gameMap.regionId(x, y) === 10) return false;
            
            return true;
        }
        
        removeItemFromInventory() {
            switch (this._itemData.itemType) {
                case 'item':
                    $gameParty.loseItem($dataItems[this._itemData.itemId], 1);
                    break;
                case 'weapon':
                    $gameParty.loseItem($dataWeapons[this._itemData.itemId], 1);
                    break;
                case 'armor':
                    $gameParty.loseItem($dataArmors[this._itemData.itemId], 1);
                    break;
            }
        }
        
        animateThrow(trajectory) {
            // This would be implemented with the actual throw animation
            // For now, we'll just place the item at the final position
        }
    }
    
    // Throw animation sprite
    class Sprite_ThrowAnimation extends Sprite {
        constructor(itemData, trajectory, finalPos) {
            super();
            this._itemData = itemData;
            this._trajectory = trajectory;
            this._finalPos = finalPos;
            this._currentStep = 0;
            this._animationSpeed = 4; // Frames per trajectory step
            this._frameCount = 0;
            this._completionCallback = null;
            this._startX = $gamePlayer.x;
            this._startY = $gamePlayer.y;

            this.createBitmap();
            this.updatePosition();

            this.anchor.x = 0.5;
            this.anchor.y = 0.5;
            this.z = 7; // Above characters
        }

        createBitmap() {
            const iconIndex = this._itemData.iconIndex;
            const iconBitmap = ImageManager.loadSystem('IconSet');

            iconBitmap.addLoadListener(() => {
                this.bitmap = new Bitmap(32, 32);
                const pw = 32;
                const ph = 32;
                const sx = (iconIndex % 16) * pw;
                const sy = Math.floor(iconIndex / 16) * ph;
                this.bitmap.blt(iconBitmap, sx, sy, pw, ph, 0, 0);
            });
        }

        setCompletionCallback(callback) {
            this._completionCallback = callback;
        }

        update() {
            super.update();

            if (!this.bitmap || !this.bitmap.isReady()) return;

            this._frameCount++;

            if (this._frameCount >= this._animationSpeed) {
                this._frameCount = 0;
                this._currentStep++;

                if (this._currentStep >= this._trajectory.length) {
                    // Animation complete
                    this.onAnimationComplete();
                    return;
                }

                this.updatePosition();
            } else {
                // Interpolate between current and next position
                this.updateInterpolatedPosition();
            }

            // Add rotation for visual effect
            this.rotation += 0.2;
        }

        updatePosition() {
            const tileSize = 48;
            let currentPos;

            if (this._currentStep === 0) {
                currentPos = { x: this._startX, y: this._startY };
            } else {
                currentPos = this._trajectory[this._currentStep - 1];
            }

            this.x = $gameMap.adjustX(currentPos.x) * tileSize + tileSize / 2;
            this.y = $gameMap.adjustY(currentPos.y) * tileSize + tileSize / 2;

            // Add arc effect (parabolic trajectory)
            const progress = this._currentStep / Math.max(1, this._trajectory.length);
            const arcHeight = 24 * Math.sin(progress * Math.PI);
            this.y -= arcHeight;
        }

        updateInterpolatedPosition() {
            if (this._currentStep >= this._trajectory.length) return;

            const tileSize = 48;
            const progress = this._frameCount / this._animationSpeed;

            let currentPos, nextPos;

            if (this._currentStep === 0) {
                currentPos = { x: this._startX, y: this._startY };
                nextPos = this._trajectory[0];
            } else {
                currentPos = this._trajectory[this._currentStep - 1];
                nextPos = this._trajectory[this._currentStep];
            }

            const currentX = $gameMap.adjustX(currentPos.x) * tileSize + tileSize / 2;
            const currentY = $gameMap.adjustY(currentPos.y) * tileSize + tileSize / 2;
            const nextX = $gameMap.adjustX(nextPos.x) * tileSize + tileSize / 2;
            const nextY = $gameMap.adjustY(nextPos.y) * tileSize + tileSize / 2;

            this.x = currentX + (nextX - currentX) * progress;
            this.y = currentY + (nextY - currentY) * progress;

            // Add arc effect (parabolic trajectory)
            const stepProgress = (this._currentStep + progress) / Math.max(1, this._trajectory.length);
            const arcHeight = 24 * Math.sin(stepProgress * Math.PI);
            this.y -= arcHeight;
        }

        onAnimationComplete() {
            // Call completion callback
            if (this._completionCallback) {
                this._completionCallback();
            }

            // Remove self from scene
            if (this.parent) {
                this.parent.removeChild(this);
            }
        }
    }

    // Thrown item sprite
    class Sprite_ThrownItem extends Sprite {
        constructor(x, y, itemData) {
            super();
            this._tileX = x;
            this._tileY = y;
            this._itemData = itemData;
            this.createBitmap();
            this.updatePosition();
        }
        
        createBitmap() {
            const iconIndex = this._itemData.iconIndex;
            const iconBitmap = ImageManager.loadSystem('IconSet');
            
            iconBitmap.addLoadListener(() => {
                this.bitmap = new Bitmap(32, 32);
                const pw = 32;
                const ph = 32;
                const sx = (iconIndex % 16) * pw;
                const sy = Math.floor(iconIndex / 16) * ph;
                this.bitmap.blt(iconBitmap, sx, sy, pw, ph, 0, 0);
            });
            
            this.anchor.x = 0.5;
            this.anchor.y = 1;
        }
        
        update() {
            super.update();
            this.updatePosition();
        }
        
        updatePosition() {
            const tileSize = 48;
            this.x = $gameMap.adjustX(this._tileX) * tileSize + tileSize / 2;
            this.y = $gameMap.adjustY(this._tileY) * tileSize + tileSize - 8;
        }
    }
    
    // Extend Spriteset_Map to handle thrown items
    const _Spriteset_Map_createLowerLayer = Spriteset_Map.prototype.createLowerLayer;
    Spriteset_Map.prototype.createLowerLayer = function() {
        _Spriteset_Map_createLowerLayer.call(this);
        this.createThrownItems();
    };
    
    Spriteset_Map.prototype.createThrownItems = function() {
        this._thrownItemSprites = [];
        const items = ThrownItemManager.getItemsForMap($gameMap.mapId());
        
        items.forEach(item => {
            this.createThrownItemSprite(item.x, item.y, item);
        });
    };
    
    Spriteset_Map.prototype.createThrownItemSprite = function(x, y, itemData) {
        const sprite = new Sprite_ThrownItem(x, y, itemData);
        this._tilemap.addChild(sprite);
        this._thrownItemSprites.push(sprite);
    };
    
    // Plugin command handler
    PluginManager.registerCommand(pluginName, 'throwItem', args => {
        const itemId = Number(args.itemId);
        const itemType = args.itemType;

        let item = null;
        let iconIndex = 0;

        switch (itemType) {
            case 'item':
                item = $dataItems[itemId];
                if ($gameParty.numItems(item) > 0) {
                    iconIndex = item.iconIndex;
                }
                break;
            case 'weapon':
                item = $dataWeapons[itemId];
                if ($gameParty.numItems(item) > 0) {
                    iconIndex = item.iconIndex;
                }
                break;
            case 'armor':
                item = $dataArmors[itemId];
                if ($gameParty.numItems(item) > 0) {
                    iconIndex = item.iconIndex;
                }
                break;
        }

        if (item && $gameParty.numItems(item) > 0) {
            const itemData = {
                itemType: itemType,
                itemId: itemId,
                iconIndex: iconIndex
            };

            // Save pending throw item for map-based targeting
            $gameSystem._pendingThrowItem = itemData;

            // If currently on map, start targeting immediately
            if (SceneManager._scene instanceof Scene_Map) {
                SceneManager._scene.startThrowTargeting(itemData);
                $gameSystem._pendingThrowItem = null;
            }
        } else {
            window.skipLocalization = true;
            $gameMessage.add('You don\'t have that item!');
            window.skipLocalization = false;
        }
    });
    
    // Handle picking up items
    const _Game_Player_checkEventTriggerHere = Game_Player.prototype.checkEventTriggerHere;
    Game_Player.prototype.checkEventTriggerHere = function(triggers) {
        _Game_Player_checkEventTriggerHere.call(this, triggers);
        
        if (triggers.includes(0)) { // Action button
            const item = ThrownItemManager.getItem($gameMap.mapId(), this.x, this.y);
            
            if (item) {
                this.pickUpItem(item);
            }
        }
    };
    
    Game_Player.prototype.pickUpItem = function(itemData) {
        window.skipLocalization = true;
        $gameMessage.add('\\>Pick up item?');
        window.skipLocalization = false;
        $gameMessage.setChoices(['Pick up', 'Cancel'], 0, 1);
        $gameMessage.setChoiceCallback(n => {
            if (n === 0) {
                // Pick up the item
                let item = null;
                
                switch (itemData.itemType) {
                    case 'item':
                        item = $dataItems[itemData.itemId];
                        break;
                    case 'weapon':
                        item = $dataWeapons[itemData.itemId];
                        break;
                    case 'armor':
                        item = $dataArmors[itemData.itemId];
                        break;
                }
                
                if (item) {
                    $gameParty.gainItem(item, 1);
                    ThrownItemManager.removeItem($gameMap.mapId(), this.x, this.y);
                    
                    // Remove sprite from map
                    if (SceneManager._scene instanceof Scene_Map) {
                        const spriteset = SceneManager._scene._spriteset;
                        if (spriteset._thrownItemSprites) {
                            spriteset._thrownItemSprites = spriteset._thrownItemSprites.filter(sprite => {
                                if (sprite._tileX === this.x && sprite._tileY === this.y) {
                                    sprite.parent.removeChild(sprite);
                                    return false;
                                }
                                return true;
                            });
                        }
                    }
                    
                    window.skipLocalization = true;
                    $gameMessage.add(`Picked up ${item.name}!`);
                    window.skipLocalization = false;
                    SoundManager.playOk();
                }
            }
        });
    };
    
    // Handle map transfer to load thrown items
    const _Scene_Map_onMapLoaded = Scene_Map.prototype.onMapLoaded;
    Scene_Map.prototype.onMapLoaded = function() {
        _Scene_Map_onMapLoaded.call(this);

        // Recreate thrown item sprites for the new map
        if (this._spriteset) {
            this._spriteset.createThrownItems();
        }
    };

    // Check for pending throw item when map scene starts
    const _Scene_Map_start = Scene_Map.prototype.start;
    Scene_Map.prototype.start = function() {
        _Scene_Map_start.call(this);

        // Check if there's a pending throw item from inventory
        if ($gameSystem._pendingThrowItem) {
            const itemData = $gameSystem._pendingThrowItem;
            $gameSystem._pendingThrowItem = null;

            // Start throw targeting mode
            this.startThrowTargeting(itemData);
        }
    };

    // Add throw targeting mode to Scene_Map
    Scene_Map.prototype.startThrowTargeting = function(itemData) {
        // Calculate initial target position (tile in front of player)
        let initialX = $gamePlayer.x;
        let initialY = $gamePlayer.y;

        switch ($gamePlayer.direction()) {
            case 2: // Down
                initialY += 1;
                break;
            case 4: // Left
                initialX -= 1;
                break;
            case 6: // Right
                initialX += 1;
                break;
            case 8: // Up
                initialY -= 1;
                break;
        }

        this._throwTargeting = {
            active: true,
            itemData: itemData,
            targetX: initialX,
            targetY: initialY,
            maxRange: 8
        };

        // Create targeting sprites
        this.createThrowTargetingSprites();

        // Disable player movement
        $gamePlayer._throwTargetingMode = true;
    };

    Scene_Map.prototype.createThrowTargetingSprites = function() {
        if (!this._spriteset) return;

        // Create target cursor sprite
        this._targetCursorSprite = new Sprite();
        this._targetCursorSprite.bitmap = new Bitmap(48, 48);
        this._targetCursorSprite.bitmap.fillRect(0, 0, 48, 48, 'rgba(255, 255, 0, 0.5)');
        this._targetCursorSprite.bitmap.strokeRect(0, 0, 48, 48, 'rgba(255, 255, 0, 1)', 2);
        this._targetCursorSprite.anchor.x = 0;
        this._targetCursorSprite.anchor.y = 0;
        this._spriteset._tilemap.addChild(this._targetCursorSprite);

        // Update initial position
        this.updateTargetCursorPosition();
    };


    Scene_Map.prototype.updateTargetCursorPosition = function() {
        if (!this._targetCursorSprite || !this._throwTargeting) return;

        const tileSize = 48;
        const targetX = this._throwTargeting.targetX;
        const targetY = this._throwTargeting.targetY;

        // Use adjustX/adjustY to convert map coordinates to screen coordinates
        this._targetCursorSprite.x = $gameMap.adjustX(targetX) * tileSize;
        this._targetCursorSprite.y = $gameMap.adjustY(targetY) * tileSize;
    };

    Scene_Map.prototype.endThrowTargeting = function() {
        if (!this._throwTargeting) return;

        // Remove target cursor sprite
        if (this._targetCursorSprite) {
            this._targetCursorSprite.parent.removeChild(this._targetCursorSprite);
            this._targetCursorSprite = null;
        }

        // Re-enable player movement
        $gamePlayer._throwTargetingMode = false;

        this._throwTargeting = null;
    };

    // Override Scene_Map update to handle throw targeting
    const _Scene_Map_update = Scene_Map.prototype.update;
    Scene_Map.prototype.update = function() {
        _Scene_Map_update.call(this);

        if (this._throwTargeting && this._throwTargeting.active) {
            this.updateThrowTargeting();
        }
    };

    Scene_Map.prototype.updateThrowTargeting = function() {
        if (Input.isRepeated('up')) {
            this.moveThrowTarget(0, -1);
        }
        if (Input.isRepeated('down')) {
            this.moveThrowTarget(0, 1);
        }
        if (Input.isRepeated('left')) {
            this.moveThrowTarget(-1, 0);
        }
        if (Input.isRepeated('right')) {
            this.moveThrowTarget(1, 0);
        }

        if (Input.isTriggered('ok')) {
            this.confirmThrow();
        }
        if (Input.isTriggered('cancel')) {
            this.cancelThrow();
        }
    };

    Scene_Map.prototype.moveThrowTarget = function(dx, dy) {
        if (!this._throwTargeting) return;

        const newX = this._throwTargeting.targetX + dx;
        const newY = this._throwTargeting.targetY + dy;
        const distance = Math.abs(newX - $gamePlayer.x) + Math.abs(newY - $gamePlayer.y);

        if (distance <= this._throwTargeting.maxRange) {
            this._throwTargeting.targetX = newX;
            this._throwTargeting.targetY = newY;
            this.updateTargetCursorPosition();

            // Turn player to face the target tile
            this.turnPlayerTowardsTarget(newX, newY);

            SoundManager.playCursor();
        } else {
            SoundManager.playBuzzer();
        }
    };

    Scene_Map.prototype.confirmThrow = function() {
        if (!this._throwTargeting) return;

        const itemData = this._throwTargeting.itemData;
        const targetX = this._throwTargeting.targetX;
        const targetY = this._throwTargeting.targetY;

        // Calculate trajectory and throw item
        const weight = this.getThrowItemWeight(itemData);
        const trajectory = this.calculateThrowTrajectory(weight, targetX, targetY);

        if (trajectory.length > 0) {
            const finalPos = trajectory[trajectory.length - 1];

            // Remove item from inventory immediately
            this.removeThrowItemFromInventory(itemData);

            // Start throw animation
            this.animateThrow(itemData, trajectory, finalPos);
        }

        SoundManager.playOk();
        this.endThrowTargeting();
    };

    Scene_Map.prototype.turnPlayerTowardsTarget = function(targetX, targetY) {
        const playerX = $gamePlayer.x;
        const playerY = $gamePlayer.y;
        const dx = targetX - playerX;
        const dy = targetY - playerY;

        // Determine direction based on which axis has greater distance
        if (Math.abs(dx) > Math.abs(dy)) {
            // Horizontal movement is greater
            if (dx > 0) {
                $gamePlayer.setDirection(6); // Right
            } else if (dx < 0) {
                $gamePlayer.setDirection(4); // Left
            }
        } else if (Math.abs(dy) > Math.abs(dx)) {
            // Vertical movement is greater
            if (dy > 0) {
                $gamePlayer.setDirection(2); // Down
            } else if (dy < 0) {
                $gamePlayer.setDirection(8); // Up
            }
        } else if (dx !== 0 || dy !== 0) {
            // Equal distance or diagonal - prioritize horizontal
            if (dx > 0) {
                $gamePlayer.setDirection(6); // Right
            } else if (dx < 0) {
                $gamePlayer.setDirection(4); // Left
            } else if (dy > 0) {
                $gamePlayer.setDirection(2); // Down
            } else if (dy < 0) {
                $gamePlayer.setDirection(8); // Up
            }
        }
    };

    Scene_Map.prototype.animateThrow = function(itemData, trajectory, finalPos) {
        if (!this._spriteset) return;

        // Create throw animation sprite
        const throwSprite = new Sprite_ThrowAnimation(itemData, trajectory, finalPos);
        this._spriteset._tilemap.addChild(throwSprite);

        // Set callback for when animation completes
        throwSprite.setCompletionCallback(() => {
            // Check if final position should destroy item
            if ($gameMap.isDestroyTile(finalPos.x, finalPos.y)) {
                window.skipLocalization = true;
                $gameMessage.add('The item was destroyed!');
                window.skipLocalization = false;
            } else {
                // Place item on map
                ThrownItemManager.addItem($gameMap.mapId(), finalPos.x, finalPos.y, itemData);

                // Create thrown item sprite on map
                if (this._spriteset) {
                    this._spriteset.createThrownItemSprite(finalPos.x, finalPos.y, itemData);
                }
            }
        });
    };

    Scene_Map.prototype.cancelThrow = function() {
        if (!this._throwTargeting) return;

        SoundManager.playCancel();
        this.endThrowTargeting();
    };

    Scene_Map.prototype.getThrowItemWeight = function(itemData) {
        let item = null;

        switch (itemData.itemType) {
            case 'item':
                item = $dataItems[itemData.itemId];
                break;
            case 'weapon':
                item = $dataWeapons[itemData.itemId];
                break;
            case 'armor':
                item = $dataArmors[itemData.itemId];
                break;
        }

        if (item && item.meta.Weight) {
            return parseInt(item.meta.Weight);
        }
        return 100; // Default weight in grams
    };

    Scene_Map.prototype.calculateThrowTrajectory = function(weight, targetX, targetY) {
        const trajectory = [];
        const startX = $gamePlayer.x;
        const startY = $gamePlayer.y;

        // Calculate throw force based on weight
        const maxRange = this._throwTargeting.maxRange;
        const forceFactor = Math.max(0.3, 1 - (weight / 5000)); // Heavier items don't go as far
        const effectiveRange = Math.floor(maxRange * forceFactor);

        // Calculate direction
        const dx = targetX - startX;
        const dy = targetY - startY;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance === 0) return trajectory;

        const stepX = dx / distance;
        const stepY = dy / distance;

        // Simulate physics
        let currentX = startX;
        let currentY = startY;
        let steps = Math.min(distance, effectiveRange);

        for (let i = 1; i <= steps; i++) {
            currentX = Math.round(startX + stepX * i);
            currentY = Math.round(startY + stepY * i);

            // Check collision
            if ($gameMap.isThrowBlocked(currentX, currentY)) {
                break;
            }

            trajectory.push({ x: currentX, y: currentY });
        }

        return trajectory;
    };

    Scene_Map.prototype.removeThrowItemFromInventory = function(itemData) {
        switch (itemData.itemType) {
            case 'item':
                $gameParty.loseItem($dataItems[itemData.itemId], 1);
                break;
            case 'weapon':
                $gameParty.loseItem($dataWeapons[itemData.itemId], 1);
                break;
            case 'armor':
                $gameParty.loseItem($dataArmors[itemData.itemId], 1);
                break;
        }
    };
    
    // Helper function to check if a tile blocks thrown items
    Game_Map.prototype.isThrowBlocked = function(x, y) {
        // Check if tile is not passable
        if (!this.isPassable(x, y, 2)) return true;
        
        // Check for terrain tag 4
        if (this.terrainTag(x, y) === 4) return true;
        
        // Check for region 10
        if (this.regionId(x, y) === 10) return true;
        
        return false;
    };
    
    // Helper function to check if a tile destroys items
    Game_Map.prototype.isDestroyTile = function(x, y) {
        // Check for terrain tag 3
        if (this.terrainTag(x, y) === 3) return true;

        // Check for region 99
        if (this.regionId(x, y) === 99) return true;

        return false;
    };

    // Prevent player movement during throw targeting mode
    const _Game_Player_canMove = Game_Player.prototype.canMove;
    Game_Player.prototype.canMove = function() {
        if (this._throwTargetingMode) {
            return false;
        }
        return _Game_Player_canMove.call(this);
    };

})();
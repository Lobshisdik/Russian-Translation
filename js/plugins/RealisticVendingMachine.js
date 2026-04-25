/*:
 * @target MZ
 * @plugindesc Realistic Vending Machine v2.3.0 (SaveGame Storage)
 * @author Omni-Lex
 * @help
 * ============================================================================
 * Realistic Vending Machine Plugin for RPG Maker MZ
 * ============================================================================
 * This plugin creates a realistic vending machine interface with daily stock
 * management, direct item selection, item drop animations, and location-based
 * machine tracking. All data is stored in the save game.
 * 
 * Features:
 * - 3x3 grid display of products with codes (A00-A02, B00-B02, C00-C02)
 * - Direct item selection interface (9 slots total)
 * - Daily stock limits (3 purchases per item per day)
 * - Location-based machine tracking (remembers which machine at each position)
 * - Item drop animations
 * - Multiple vending machine support
 * - Secret codes that trigger common events
 * - Daily cache reset
 * - All data stored in save game (no localStorage)
 * 
 * Plugin Commands:
 * - Open Vending Machine: Opens a specific vending machine by ID
 * 
 * @param machines
 * @text Vending Machines
 * @desc Configure different vending machines
 * @type struct<Machine>[]
 * @default []
 * 
 * @param defaultSoundBuy
 * @text Purchase Sound
 * @desc Sound effect when item is purchased
 * @type file
 * @dir audio/se/
 * @default Coin
 * 
 * @param defaultSoundError
 * @text Error Sound
 * @desc Sound effect for errors
 * @type file
 * @dir audio/se/
 * @default Buzzer1
 * 
 * @param secretCodes
 * @text Secret Codes
 * @desc Secret codes that trigger common events
 * @type struct<SecretCode>[]
 * @default []
 * 
 * @command openVendingMachine
 * @text Open Vending Machine
 * @desc Opens a vending machine interface
 * 
 * @arg machineId
 * @text Machine ID
 * @desc ID of the vending machine to open
 * @type string
 * @default default
 */

/*~struct~Machine:
 * @param id
 * @text Machine ID
 * @desc Unique identifier for this machine
 * @type string
 * @default default
 * 
 * @param name
 * @text Machine Name
 * @desc Display name for the vending machine
 * @type string
 * @default Vending Machine
 * 
 * @param itemsA
 * @text Row A Items (A00-A02)
 * @desc Items for row A slots (3 items)
 * @type struct<ItemSlot>[]
 * @default []
 * 
 * @param itemsB
 * @text Row B Items (B00-B02)
 * @desc Items for row B slots (3 items)
 * @type struct<ItemSlot>[]
 * @default []
 * 
 * @param itemsC
 * @text Row C Items (C00-C02)
 * @desc Items for row C slots (3 items)
 * @type struct<ItemSlot>[]
 * @default []
 */

/*~struct~ItemSlot:
 * @param itemId
 * @text Item
 * @desc Item to sell in this slot
 * @type item
 * @default 1
 * 
 * @param price
 * @text Price
 * @desc Override price (0 to use item's default price)
 * @type number
 * @min 0
 * @default 0
 */

/*~struct~SecretCode:
 * @param code
 * @text Code
 * @desc Secret code (e.g., A99)
 * @type string
 * @default A99
 * 
 * @param commonEventId
 * @text Common Event
 * @desc Common event to run when code is entered
 * @type common_event
 * @default 1
 */

(() => {
    'use strict';
    
    const pluginName = 'RealisticVendingMachine';
    const parameters = PluginManager.parameters(pluginName);
    
    // Parse parameters
    const machines = JSON.parse(parameters.machines || '[]').map(m => {
        const machine = JSON.parse(m);
        machine.itemsA = JSON.parse(machine.itemsA || '[]').map(i => JSON.parse(i));
        machine.itemsB = JSON.parse(machine.itemsB || '[]').map(i => JSON.parse(i));
        machine.itemsC = JSON.parse(machine.itemsC || '[]').map(i => JSON.parse(i));
        return machine;
    });
    
    const secretCodes = JSON.parse(parameters.secretCodes || '[]').map(s => JSON.parse(s));
    const soundBuy = parameters.defaultSoundBuy || 'Coin';
    const soundError = parameters.defaultSoundError || 'Buzzer1';
    
    // Initialize vending machine data in $gameSystem
    const _Game_System_initialize = Game_System.prototype.initialize;
    Game_System.prototype.initialize = function() {
        _Game_System_initialize.call(this);
        this.initializeVendingMachineData();
    };
    
    Game_System.prototype.initializeVendingMachineData = function() {
        if (!this._vendingMachineData) {
            this._vendingMachineData = {
                lastDate: getTodayString(),
                purchases: {},
                locations: {}
            };
        }
    };
    
    Game_System.prototype.getVendingMachineData = function() {
        if (!this._vendingMachineData) {
            this.initializeVendingMachineData();
        }
        
        // Check if it's a new day and reset if needed
        const todayString = getTodayString();
        if (this._vendingMachineData.lastDate !== todayString) {
            this._vendingMachineData.lastDate = todayString;
            this._vendingMachineData.purchases = {};
            this._vendingMachineData.locations = {};
        }
        
        return this._vendingMachineData;
    };
    
    Game_System.prototype.savePurchase = function(machineId, code, location) {
        const data = this.getVendingMachineData();
        const key = `${location}_${machineId}_${code}`;
        data.purchases[key] = (data.purchases[key] || 0) + 1;
    };
    
    Game_System.prototype.getPurchaseCount = function(machineId, code, location) {
        const data = this.getVendingMachineData();
        const key = `${location}_${machineId}_${code}`;
        return data.purchases[key] || 0;
    };
    
    Game_System.prototype.saveLocationMachine = function(location, machineId) {
        const data = this.getVendingMachineData();
        data.locations[location] = machineId;
    };
    
    Game_System.prototype.getLocationMachine = function(location) {
        const data = this.getVendingMachineData();
        return data.locations[location] || null;
    };
    
    // Helper functions
    function getGameDateFromVariable() {
        // Check if $gameVariables is initialized, otherwise use default
        const dateStr = ($gameVariables ? $gameVariables.value(113) : null) || '01 JAN 2001 12:00';
        // Format: "01 JAN 2001 12:00"
        const parts = dateStr.split(' ');
        if (parts.length < 4) {
            return { day: 1, month: 0, year: 2001, hours: 8, minutes: 0 };
        }

        const day = parseInt(parts[0]);
        const monthStr = parts[1].toUpperCase();
        const year = parseInt(parts[2]);
        const timeStr = parts[3].split(':');
        const hours = parseInt(timeStr[0]);
        const minutes = parseInt(timeStr[1]);

        const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
        const month = months.indexOf(monthStr);

        return { day, month, year, hours, minutes };
    }

    function getTodayString() {
        const gameDate = getGameDateFromVariable();
        return `${gameDate.year}-${gameDate.month}-${gameDate.day}`;
    }
    
    function getCurrentLocation() {
        // Get the event that triggered this command
        const eventId = $gameMap ? $gameMap._interpreter.eventId() : 0;
        
        if (eventId > 0) {
            // Use the event's location instead of player's location
            const event = $gameMap.event(eventId);
            if (event) {
                const mapId = $gameMap.mapId();
                const x = event.x;
                const y = event.y;
                console.log(`Vending Machine Location: Map ${mapId}, X: ${x}, Y: ${y}`);
                return `${mapId}_${x}_${y}`;
            }
        }
        
        // Fallback to player location if no event found
        if ($gamePlayer && $gameMap) {
            const mapId = $gameMap.mapId();
            const x = $gamePlayer.x;
            const y = $gamePlayer.y;
            console.log(`Vending Machine Location (Player): Map ${mapId}, X: ${x}, Y: ${y}`);
            return `${mapId}_${x}_${y}`;
        }
        
        console.error('Unable to determine location - no event or player found');
        return null;
    }
    
    function savePurchase(machineId, code, location) {
        $gameSystem.savePurchase(machineId, code, location);
    }
    
    function getPurchaseCount(machineId, code, location) {
        return $gameSystem.getPurchaseCount(machineId, code, location);
    }
    
    function saveLocationMachine(location, machineId) {
        $gameSystem.saveLocationMachine(location, machineId);
    }
    
    function getLocationMachine(location) {
        return $gameSystem.getLocationMachine(location);
    }
    
    // Plugin command
    PluginManager.registerCommand(pluginName, 'openVendingMachine', args => {
        const requestedMachineId = args.machineId || 'default';
        const location = getCurrentLocation();
        
        if (!location) {
            console.error('Unable to determine player location!');
            return;
        }
        
        // Check if this location already has a machine assigned today
        const existingMachineId = getLocationMachine(location);
        const machineId = existingMachineId || requestedMachineId;
        
        // If no machine was assigned yet, save the requested one
        if (!existingMachineId) {
            saveLocationMachine(location, machineId);
        }
        
        const machine = machines.find(m => m.id === machineId);
        
        if (!machine) {
            console.error(`Vending machine '${machineId}' not found!`);
            return;
        }
        
        SceneManager.push(Scene_VendingMachine);
        SceneManager.prepareNextScene(machine, location);
    });
    
    // Window_VendingInfo
    class Window_VendingInfo extends Window_Base {
        constructor(rect) {
            super(rect);
            this._currentCode = null;
            this._currentItem = null;
            this._machineId = null;
            this._location = null;
        }
        
        setItem(code, item, machineId, location) {
            if (this._currentCode !== code || this._currentItem !== item || 
                this._machineId !== machineId || this._location !== location) {
                this._currentCode = code;
                this._currentItem = item;
                this._machineId = machineId;
                this._location = location;
                this.refresh();
            }
        }
        
        refresh() {
            this.contents.clear();
            
            if (!this._currentCode || !this._currentItem || !this._currentItem.item) {
                this.contents.fontSize = 18;
                this.contents.textColor = '#cccccc';
                this.drawText('Select an item to view details', 0, 15, this.contents.width, 'center');
                return;
            }
            
            const item = this._currentItem.item;
            const price = this._currentItem.price;
            const purchaseCount = getPurchaseCount(this._machineId, this._currentCode, this._location);
            const remaining = 3 - purchaseCount;
            
            // Draw item icon (larger) - with safety check
            if (item && item.iconIndex !== undefined) {
                this.drawIcon(item.iconIndex, 15, 15);
            }
            
            // Draw item name
            this.contents.fontSize = 22;
            this.contents.textColor = '#ffffff';
            const itemName = item && item.name ? item.name : 'Unknown Item';
            this.drawText(`${this._currentCode}: ${itemName}`, 60, 12, this.contents.width - 70);
            
            // Draw price (convert gold to euros: 1000G = 10€)
            this.contents.fontSize = 18;
            this.contents.textColor = '#ffcc66';
            const priceEuros = (price / 100).toFixed(2);
            this.drawText(`Price: €${priceEuros}`, 60, 40, 200);

            // Draw stock info
            this.contents.fontSize = 18;
            if (remaining > 0) {
                this.contents.textColor = remaining === 1 ? '#ff9999' : '#99ff99';
                this.drawText(`Stock: ${remaining} remaining`, 280, 40, 220);
            } else {
                this.contents.textColor = '#ff6666';
                this.drawText('SOLD OUT', 280, 40, 220);
            }

            // Draw player's gold (converted to euros)
            this.contents.fontSize = 16;
            this.contents.textColor = '#ffffff';
            const playerGold = $gameParty ? $gameParty.gold() : 0;
            const playerEuros = (playerGold / 100).toFixed(2);
            this.drawText(`Your Money: €${playerEuros}`, this.contents.width - 200, 42, 190, 'right');
        }
    }
    
    // Scene_VendingMachine
    class Scene_VendingMachine extends Scene_Base {
        prepare(machine, location) {
            this._machine = machine;
            this._location = location;
        }
        
        create() {
            super.create();
            this.createBackground();
            this.createWindowLayer();
            this.createItemGrid();
            this.createInfoWindow();
            this._selectedItem = null;
        }
        
        createBackground() {
            this._backgroundSprite = new Sprite();
            this._backgroundSprite.bitmap = SceneManager.backgroundBitmap();
            this.addChild(this._backgroundSprite);
            
            // Darken background
            const dimmer = new Sprite();
            dimmer.bitmap = new Bitmap(Graphics.width, Graphics.height);
            dimmer.bitmap.fillAll('rgba(0, 0, 0, 0.6)');
            this.addChild(dimmer);
        }
        
        _layoutRects() {
            const winW = 700;
            const x = Math.floor((Graphics.width - winW) / 2);
            const topY = 20;
            const infoH = 90;
            const gap = 8;
            const bottomMargin = 20;
            const gridH = Graphics.height - topY - gap - infoH - bottomMargin;
            return {
                x, winW, topY, gridH, gap, infoH,
                infoY: topY + gridH + gap
            };
        }

        createItemGrid() {
            const { x, winW, topY, gridH } = this._layoutRects();
            this._itemGrid = new Window_VendingGrid(
                new Rectangle(x, topY, winW, gridH),
                this._machine,
                this._location
            );
            this._itemGrid.setHandler('ok', this.onItemSelect.bind(this));
            this._itemGrid.setHandler('cancel', this.popScene.bind(this));
            this.addWindow(this._itemGrid);
        }

        createInfoWindow() {
            const { x, winW, infoY, infoH } = this._layoutRects();
            this._infoWindow = new Window_VendingInfo(
                new Rectangle(x, infoY, winW, infoH)
            );
            this.addWindow(this._infoWindow);
        }
        
        update() {
            super.update();
            
            // Update info window with currently selected item
            const selectedCode = this._itemGrid.getCurrentCode();
            const selectedItem = this._itemGrid.getItemByCode(selectedCode);
            this._infoWindow.setItem(selectedCode, selectedItem, this._machine.id, this._location);
        }
        
        onItemSelect() {
            const code = this._itemGrid.getCurrentCode();
            const item = this._itemGrid.getItemByCode(code);
            
            if (!item || !item.item) {
                AudioManager.playSe({name: soundError, volume: 90, pitch: 100});
                this._itemGrid.activate();
                return;
            }
            
            // Check purchase limit
            const purchaseCount = getPurchaseCount(this._machine.id, code, this._location);
            if (purchaseCount >= 3) {
                AudioManager.playSe({name: soundError, volume: 90, pitch: 100});
                this._itemGrid.activate();
                return;
            }
            
            // Check gold
            const playerGold = $gameParty ? $gameParty.gold() : 0;
            if (playerGold < item.price) {
                AudioManager.playSe({name: soundError, volume: 90, pitch: 100});
                this._itemGrid.activate();
                return;
            }
            
            // Process purchase
            this.purchaseItem(item, code);
            this._itemGrid.activate();
        }
        
        purchaseItem(item, code) {
            // Deduct gold and add item
            $gameParty.loseGold(item.price);
            $gameParty.gainItem(item.item, 1);
            
            // Save purchase with location
            savePurchase(this._machine.id, code, this._location);
            
            // Play sound
            AudioManager.playSe({name: soundBuy, volume: 90, pitch: 100});
            
            // Animate item drop
            this.animateItemDrop(item, code);
            
            // Refresh grid to show updated stock
            this._itemGrid.refresh();
            
            // Force update info window to show new money amount immediately
            this._infoWindow.setItem(code, item, this._machine.id, this._location);
            this._infoWindow.refresh();
        }
        
        animateItemDrop(item, code) {
            const position = this._itemGrid.getItemPosition(code);
            if (!position) return;
            
            // Create sprite for animation
            const sprite = new Sprite();
            sprite.bitmap = ImageManager.loadSystem('IconSet');
            const pw = ImageManager.iconWidth;
            const ph = ImageManager.iconHeight;
            const sx = item.item.iconIndex % 16 * pw;
            const sy = Math.floor(item.item.iconIndex / 16) * ph;
            sprite.setFrame(sx, sy, pw, ph);
            
            // Set initial position
            sprite.x = this._itemGrid.x + position.x + 24;
            sprite.y = this._itemGrid.y + position.y + 24;
            
            // Add to scene
            this.addChild(sprite);
            
            // Animate drop
            const dropY = Graphics.height - 150;
            const duration = 30;
            let count = 0;
            
            const animateFrame = () => {
                // Check if scene still exists
                if (!this || !this._itemGrid || !sprite || !sprite.parent) {
                    if (sprite && sprite.parent) {
                        try {
                            this.removeChild(sprite);
                        } catch (e) {
                            // Ignore errors during cleanup
                        }
                    }
                    return;
                }
                
                count++;
                const rate = count / duration;
                sprite.y = position.y + this._itemGrid.y + 24 + (dropY - position.y - this._itemGrid.y - 24) * rate;
                
                if (count >= duration) {
                    // Return animation
                    const returnDuration = 20;
                    let returnCount = 0;
                    
                    const animateReturn = () => {
                        // Check if scene and grid still exist
                        if (!this || !this._itemGrid || !sprite || !sprite.parent) {
                            if (sprite && sprite.parent) {
                                try {
                                    this.removeChild(sprite);
                                } catch (e) {
                                    // Ignore errors during cleanup
                                }
                            }
                            return;
                        }
                        returnCount++;
                        const rate = 1 - (returnCount / returnDuration);
                        sprite.y = position.y + this._itemGrid.y + 24 + (dropY - position.y - this._itemGrid.y - 24) * rate;
                        sprite.opacity = 255 * rate;
                        
                        if (returnCount >= returnDuration) {
                            try {
                                this.removeChild(sprite);
                            } catch (e) {
                                // Ignore errors during cleanup
                            }
                        } else {
                            requestAnimationFrame(animateReturn);
                        }
                    };
                    
                    setTimeout(() => {
                        // Check if scene and grid still exist before starting return animation
                        if (this && this._itemGrid && sprite && sprite.parent) {
                            animateReturn();
                        } else if (sprite && sprite.parent) {
                            // If not, just remove the sprite safely
                            try {
                                this.removeChild(sprite);
                            } catch (e) {
                                // Ignore errors during cleanup
                            }
                        }
                    }, 500);
                } else {
                    requestAnimationFrame(animateFrame);
                }
            };
            
            animateFrame();
        }
    }
    
    // Window_VendingGrid
    class Window_VendingGrid extends Window_Selectable {
        constructor(rect, machine, location) {
            super(rect);
            this._machine = machine;
            this._location = location;
            this._items = {};
            this.setupItems();
            this.refresh();
            this.select(0);
            this.activate();
        }
        
        setupItems() {
            // Setup row A (A00-A02) - only first 3 items
            this._machine.itemsA.forEach((slot, i) => {
                if (slot.itemId && i < 3) {
                    const itemData = $dataItems[parseInt(slot.itemId)];
                    if (itemData) {
                        const code = `A${String(i).padStart(2, '0')}`;
                        this._items[code] = {
                            item: itemData,
                            price: parseInt(slot.price) || itemData.price
                        };
                    }
                }
            });
            
            // Setup row B (B00-B02) - only first 3 items
            this._machine.itemsB.forEach((slot, i) => {
                if (slot.itemId && i < 3) {
                    const itemData = $dataItems[parseInt(slot.itemId)];
                    if (itemData) {
                        const code = `B${String(i).padStart(2, '0')}`;
                        this._items[code] = {
                            item: itemData,
                            price: parseInt(slot.price) || itemData.price
                        };
                    }
                }
            });
            
            // Setup row C (C00-C02) - only first 3 items
            this._machine.itemsC.forEach((slot, i) => {
                if (slot.itemId && i < 3) {
                    const itemData = $dataItems[parseInt(slot.itemId)];
                    if (itemData) {
                        const code = `C${String(i).padStart(2, '0')}`;
                        this._items[code] = {
                            item: itemData,
                            price: parseInt(slot.price) || itemData.price
                        };
                    }
                }
            });
        }
        
        maxItems() {
            return 9; // 3 rows × 3 items per row
        }
        
        maxCols() {
            return 3; // 3 columns
        }
        
        itemHeight() {
            return Math.floor(this.innerHeight / 3);
        }
        
        itemWidth() {
            return Math.floor((this.innerWidth - this.colSpacing() * (this.maxCols() - 1)) / this.maxCols());
        }
        
        drawItem(index) {
            const rect = this.itemRectWithPadding(index);
            const code = this.indexToCode(index);
            
            this.drawItemSlot(code, rect.x, rect.y, rect.width, rect.height);
        }
        
        indexToCode(index) {
            const row = Math.floor(index / 3);
            const col = index % 3;
            const rowLetter = ['A', 'B', 'C'][row];
            return `${rowLetter}${String(col).padStart(2, '0')}`;
        }
        
        codeToIndex(code) {
            if (!code || code.length < 3) return -1;
            
            const row = code[0];
            const num = parseInt(code.substring(1));
            const rowIndex = ['A', 'B', 'C'].indexOf(row);
            
            if (rowIndex === -1) return -1;
            if (num < 0 || num >= 3) return -1;
            
            return rowIndex * 3 + num;
        }
        
        getCurrentCode() {
            return this.indexToCode(this.index());
        }
        
        drawItemSlot(code, x, y, width, height) {
            const data = this._items[code];
            const purchaseCount = getPurchaseCount(this._machine.id, code, this._location);
            const soldOut = purchaseCount >= 3;
            const isSelected = code === this.getCurrentCode();
            
            // Draw frame
            const frameColor = isSelected ? '#ffcc00' : (soldOut ? '#666666' : '#ffffff');
            const frameWidth = isSelected ? 4 : 2;
            
            for (let i = 0; i < frameWidth; i++) {
                this.contents.strokeRect(x + i, y + i, width - (i * 2) - 1, height - (i * 2) - 1, frameColor);
            }
            
            // Draw background for selected item
            if (isSelected) {
                this.contents.fillRect(x + 4, y + 4, width - 8, height - 8, 'rgba(255, 204, 0, 0.15)');
            }
            
            // Draw code (larger)
            this.contents.fontSize = 16;
            this.contents.textColor = soldOut ? '#666666' : (isSelected ? '#ffcc00' : '#ffffff');
            this.drawText(code, x + 4, y + 4, width - 8, 'center');
            
            if (data && data.item) {
                // Draw icon (positioned at ~30% down the cell)
                const iconY = y + Math.floor(height * 0.30);
                this.drawIcon(data.item.iconIndex, x + (width - 32) / 2, iconY);

                if (soldOut) {
                    // Draw sold out overlay
                    this.contents.fillRect(x + 12, iconY + 8, width - 24, 20, 'rgba(0, 0, 0, 0.8)');
                    this.contents.fontSize = 13;
                    this.contents.textColor = '#ff6666';
                    this.drawText('SOLD OUT', x + 4, iconY + 8, width - 8, 'center');
                }

                // Draw price in euros (~62% down)
                this.contents.fontSize = 18;
                this.contents.textColor = soldOut ? '#666666' : '#ffcc66';
                const priceEuros = (data.price / 100).toFixed(2);
                this.drawText(`€${priceEuros}`, x + 4, y + Math.floor(height * 0.62), width - 8, 'center');

                // Draw remaining stock indicator (~80% down)
                const remaining = 3 - purchaseCount;
                if (remaining > 0 && remaining < 3) {
                    this.contents.fontSize = 12;
                    this.contents.textColor = remaining === 1 ? '#ff9999' : '#cccccc';
                    this.drawText(`${remaining} left`, x + 4, y + Math.floor(height * 0.80), width - 8, 'center');
                }
            } else {
                // Draw "Out of stock" for empty slots
                this.contents.fontSize = 14;
                this.contents.textColor = '#666666';
                this.drawText('Out of', x + 4, y + Math.floor(height * 0.36), width - 8, 'center');
                this.drawText('Stock', x + 4, y + Math.floor(height * 0.52), width - 8, 'center');
            }
        }
        
        getItemByCode(code) {
            return this._items[code];
        }
        
        getItemPosition(code) {
            const index = this.codeToIndex(code);
            if (index === -1) return null;
            
            const rect = this.itemRectWithPadding(index);
            return {
                x: rect.x + rect.width / 2 - 16,
                y: rect.y + 40
            };
        }
        
        refresh() {
            super.refresh();
        }
        
        isOkEnabled() {
            const code = this.getCurrentCode();
            const item = this.getItemByCode(code);
            return item && item.item;
        }
    }
    
})();
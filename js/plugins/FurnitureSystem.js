/*:
 * @target MZ
 * @plugindesc Furniture System v1.0.0
 * @author Omni-Lex
 * @help
 * ============================================================================
 * Furniture System Plugin for RPG Maker MZ
 * ============================================================================
 * 
 * This plugin provides a comprehensive furniture system with placement,
 * crafting, buying, and dismantling features.
 * 
 * Features:
 * - Dynamic furniture placement with grid snapping (48x48 tiles)
 * - Crafting system using materials
 * - Buy/sell furniture
 * - Dismantle furniture to recover materials
 * - Multi-tile furniture support
 * - Vertical flip system for rotatable furniture
 * - Wall furniture placement restriction (terrain tag 4)
 * - Non-wall furniture: upper tiles can overlap walls, lower tiles cannot
 * - Terrain tag 7 blocks all furniture placement
 * - Save/load furniture positions
 * 
 * Plugin Commands:
 * - Open Furniture Builder
 * - Enter Placement Mode
 * - Give Furniture
 * - Give Material
 * - Unlock Recipe
 * 
 * @param tileSize
 * @text Tile Size
 * @desc Size of each tile in pixels
 * @type number
 * @default 48
 * 
 * @param gridOpacity
 * @text Grid Overlay Opacity
 * @desc Opacity of the grid overlay in placement mode (0-255)
 * @type number
 * @min 0
 * @max 255
 * @default 128
 * 
 * @param dismantleReturn
 * @text Dismantle Return Rate
 * @desc Percentage of materials returned when dismantling (0-1)
 * @type number
 * @decimals 2
 * @min 0
 * @max 1
 * @default 0.75
 * 
 * @command openBuilder
 * @text Open Furniture Builder
 * @desc Opens the furniture crafting menu
 * 
 * @command enterPlacementMode
 * @text Enter Placement Mode
 * @desc Enter furniture placement mode
 * @arg furnitureId
 * @text Furniture ID
 * @desc ID of the furniture to place
 * @type string
 * 
 * @command giveFurniture
 * @text Give Furniture
 * @desc Add furniture to inventory
 * @arg furnitureId
 * @text Furniture ID
 * @desc ID of the furniture to give
 * @type string
 * @arg quantity
 * @text Quantity
 * @desc Number of items to give
 * @type number
 * @default 1
 * 
 * @command giveMaterial
 * @text Give Material
 * @desc Add crafting material to inventory
 * @arg materialId
 * @text Material ID
 * @desc ID of the material (e.g., 0570 for Wood)
 * @type string
 * @arg quantity
 * @text Quantity
 * @desc Number of materials to give
 * @type number
 * @default 1
 * 
 * @command unlockRecipe
 * @text Unlock Recipe
 * @desc Unlock a furniture recipe
 * @arg recipeId
 * @text Recipe ID
 * @desc ID of the furniture recipe to unlock
 * @type string
 * 
 * @command removeAllFurniture
 * @text Remove All Furniture
 * @desc Removes all furniture from current map
 */

(() => {
    'use strict';
    
    const pluginName = 'FurnitureSystem';
    const parameters = PluginManager.parameters(pluginName);
    const TILE_SIZE = Number(parameters['tileSize'] || 48);
    const GRID_OPACITY = Number(parameters['gridOpacity'] || 128);
    const DISMANTLE_RETURN = Number(parameters['dismantleReturn'] || 0.75);
    const { FURNITURE_DB } = window.FurnitureData;

    //=============================================================================
    // Material Definitions
    //=============================================================================
    
    const MATERIALS = {
        565: { name: "Steel Ingot", icon: 95 },
        566: { name: "Titanium Ingot", icon: 96 },
        567: { name: "Varlenia Ingot", icon: 97 },
        568: { name: "Crystal", icon: 98 },
        569: { name: "Glass", icon: 99 },
        570: { name: "Wood", icon: 100 },
        571: { name: "Leather", icon: 101 },
        572: { name: "Cloth", icon: 102 },
        573: { name: "Bone", icon: 103 },
        574: { name: "Meat", icon: 104 },
        575: { name: "Plant Matter", icon: 105 },
        576: { name: "Herb Extract", icon: 106 },
        577: { name: "Oil Flask", icon: 107 },
        578: { name: "Acidic Solution", icon: 108 },
        579: { name: "Arcane Essence", icon: 109 },
        580: { name: "Ethereal Shard", icon: 110 },
        581: { name: "Quantum Core", icon: 111 },
        582: { name: "Circuit Board", icon: 112 },
        583: { name: "Microchip", icon: 113 },
        584: { name: "Battery Cell", icon: 114 },
        585: { name: "Plastic Polymer", icon: 115 },
        586: { name: "Composite Resin", icon: 116 },
        587: { name: "Nanotube Module", icon: 117 }
    };

    //=============================================================================
    // Furniture Database
    //=============================================================================
    
   

    //=============================================================================
    // Game System Extensions
    //=============================================================================
    
    const _Game_System_initialize = Game_System.prototype.initialize;
    Game_System.prototype.initialize = function() {
        _Game_System_initialize.call(this);
        this.initFurnitureSystem();
    };
    
    Game_System.prototype.initFurnitureSystem = function() {
        this._furnitureData = {
            maps: {},           // Furniture placed on each map
            inventory: {},      // Furniture in player's inventory
            materials: {},      // Crafting materials
            unlockedRecipes: [ // Start with basic recipes unlocked
                "wooden_chair",
                "wooden_table",
                "simple_bed",
                "wooden_chest",
                "wooden_torch",
                "plant_pot",
                "crafting_bench"
            ],
            placedFurnitureId: 0  // Unique ID counter for placed furniture
        };
    };
    
    Game_System.prototype.getFurnitureData = function() {
        if (!this._furnitureData) {
            this.initFurnitureSystem();
        }
        return this._furnitureData;
    };
    
    Game_System.prototype.addFurniture = function(furnitureId, quantity = 1) {
        const data = this.getFurnitureData();
        if (!data.inventory[furnitureId]) {
            data.inventory[furnitureId] = 0;
        }
        data.inventory[furnitureId] += quantity;
    };
    
    Game_System.prototype.removeFurniture = function(furnitureId, quantity = 1) {
        const data = this.getFurnitureData();
        if (data.inventory[furnitureId]) {
            data.inventory[furnitureId] -= quantity;
            if (data.inventory[furnitureId] <= 0) {
                delete data.inventory[furnitureId];
            }
        }
    };
    
    Game_System.prototype.hasFurniture = function(furnitureId, quantity = 1) {
        const data = this.getFurnitureData();
        return data.inventory[furnitureId] && data.inventory[furnitureId] >= quantity;
    };
    
    Game_System.prototype.addMaterial = function(materialId, quantity = 1) {
        const data = this.getFurnitureData();
        if (!data.materials[materialId]) {
            data.materials[materialId] = 0;
        }
        data.materials[materialId] += quantity;
    };
    
    Game_System.prototype.removeMaterial = function(materialId, quantity = 1) {
        const data = this.getFurnitureData();
        if (data.materials[materialId]) {
            data.materials[materialId] -= quantity;
            if (data.materials[materialId] <= 0) {
                delete data.materials[materialId];
            }
        }
    };
    
    Game_System.prototype.hasMaterial = function(materialId, quantity = 1) {
        const data = this.getFurnitureData();
        return data.materials[materialId] && data.materials[materialId] >= quantity;
    };
    
    Game_System.prototype.canCraftFurniture = function(furnitureId) {
        const furniture = FURNITURE_DB[furnitureId];
        if (!furniture || !furniture.recipe) return false;
        
        for (const [materialId, quantity] of Object.entries(furniture.recipe)) {
            if (!this.hasMaterial(materialId, quantity)) {
                return false;
            }
        }
        return true;
    };
    
    Game_System.prototype.craftFurniture = function(furnitureId) {
        const furniture = FURNITURE_DB[furnitureId];
        if (!this.canCraftFurniture(furnitureId)) return false;
        
        // Remove materials
        for (const [materialId, quantity] of Object.entries(furniture.recipe)) {
            this.removeMaterial(materialId, quantity);
        }
        
        // Add furniture
        this.addFurniture(furnitureId, 1);
        return true;
    };
    
    Game_System.prototype.dismantleFurniture = function(furnitureId) {
        if (!this.hasFurniture(furnitureId)) return false;
        
        const furniture = FURNITURE_DB[furnitureId];
        if (!furniture || !furniture.recipe) return false;
        
        // Remove furniture
        this.removeFurniture(furnitureId, 1);
        
        // Return materials (based on dismantle return rate)
        for (const [materialId, quantity] of Object.entries(furniture.recipe)) {
            const returnQuantity = Math.floor(quantity * DISMANTLE_RETURN);
            if (returnQuantity > 0) {
                this.addMaterial(materialId, returnQuantity);
            }
        }
        
        return true;
    };
    
    Game_System.prototype.unlockRecipe = function(furnitureId) {
        // All recipes are unlocked by default - this function is now obsolete
        // Kept for backwards compatibility with existing plugin commands
    };
    
    Game_System.prototype.isRecipeUnlocked = function(furnitureId) {
        // All recipes are unlocked by default
        return true;
    };
    
    Game_System.prototype.placeFurniture = function(mapId, furnitureId, x, y, flipped = false) {
        const data = this.getFurnitureData();
        if (!data.maps[mapId]) {
            data.maps[mapId] = [];
        }

        const placedId = data.placedFurnitureId++;
        const placedFurniture = {
            id: placedId,
            furnitureId: furnitureId,
            x: x,
            y: y,
            flipped: flipped
        };

        data.maps[mapId].push(placedFurniture);
        return placedFurniture;
    };
    
    Game_System.prototype.removePlacedFurniture = function(mapId, placedId) {
        const data = this.getFurnitureData();
        if (!data.maps[mapId]) return null;
        
        const index = data.maps[mapId].findIndex(f => f.id === placedId);
        if (index >= 0) {
            const furniture = data.maps[mapId][index];
            data.maps[mapId].splice(index, 1);
            return furniture;
        }
        return null;
    };
    
    Game_System.prototype.getMapFurniture = function(mapId) {
        const data = this.getFurnitureData();
        return data.maps[mapId] || [];
    };

    //=============================================================================
    // Procedural Furniture Generation (House Integration)
    //=============================================================================

    // Seeded random functions matching TreasureRoomSystem
    function seededRandom(seed) {
        const x = Math.sin(seed) * 10000;
        return x - Math.floor(x);
    }

    function getSeededRandomFromArray(array, seed) {
        if (array.length === 0) return null;
        const index = Math.floor(seededRandom(seed) * array.length);
        return array[index];
    }

    function getSeededRandomInt(min, max, seed) {
        return Math.floor(seededRandom(seed) * (max - min + 1)) + min;
    }

    // Get list of valid furniture for a category
    function getFurnitureByCategory(category) {
        return Object.entries(FURNITURE_DB)
            .filter(([id, data]) => data.category === category)
            .map(([id]) => id);
    }

    // Check if a tile is passable (A1, A2, A5)
    function isTilePassable(x, y) {
        if (!$gameMap.isValid(x, y)) return false;
        // Check collision - passable tiles should allow walking
        return $gameMap.isPassable(x, y, 2); // 2 = down direction
    }

    // Check if tile is a wall (A3, A4) by checking collision
    function isTileWall(x, y) {
        if (!$gameMap.isValid(x, y)) return false;
        // Walls block movement in all directions
        return !$gameMap.isPassable(x, y, 2) &&
               !$gameMap.isPassable(x, y, 4) &&
               !$gameMap.isPassable(x, y, 6) &&
               !$gameMap.isPassable(x, y, 8);
    }

    // Find valid furniture placement positions
    // Furniture should be placed south of walls (on passable tiles north of walls)
    // or north of walls (on passable tiles south of walls)
    function findValidFurnitureTiles() {
        const validPositions = [];

        for (let y = 0; y < $gameMap.height(); y++) {
            for (let x = 0; x < $gameMap.width(); x++) {
                if (!isTilePassable(x, y)) continue;

                // Check if adjacent to a wall
                const north = isTileWall(x, y - 1);
                const south = isTileWall(x, y + 1);
                const east = isTileWall(x + 1, y);
                const west = isTileWall(x - 1, y);

                if (north || south || east || west) {
                    validPositions.push({ x, y });
                }
            }
        }

        return validPositions;
    }

    // Check if furniture can be placed at position
    function canPlaceFurnitureAt(x, y, furnitureData) {
        const furnitureList = $gameSystem.getMapFurniture($gameMap.mapId());

        // Check bounds
        if (!$gameMap.isValid(x, y)) return false;

        // Check wall placement restriction
        if (furnitureData.wall) {
            // Wall furniture must be placed on terrain tag 4
            let onWallTerrain = false;
            for (let fx = 0; fx < furnitureData.width; fx++) {
                for (let fy = 0; fy < furnitureData.height; fy++) {
                    if ($gameMap.terrainTag(x + fx, y + fy) === 4) {
                        onWallTerrain = true;
                        break;
                    }
                }
                if (onWallTerrain) break;
            }
            if (!onWallTerrain) {
                return false;
            }
        } else {
            // Non-wall furniture: no tiles can overlap terrain tags 4 or 7
            for (let fx = 0; fx < furnitureData.width; fx++) {
                for (let fy = 0; fy < furnitureData.height; fy++) {
                    const checkX = x + fx;
                    const checkY = y + fy;

                    // Check bounds
                    if (!$gameMap.isValid(checkX, checkY)) return false;

                    // Check if any tile is on terrain tag 4 or 7 (not allowed)
                    const terrainTag = $gameMap.terrainTag(checkX, checkY);
                    if (terrainTag === 4 || terrainTag === 7) {
                        return false;
                    }
                }
            }
        }

        // Never place furniture on terrain tag 7
        for (let fx = 0; fx < furnitureData.width; fx++) {
            for (let fy = 0; fy < furnitureData.height; fy++) {
                const checkX = x + fx;
                const checkY = y + fy;

                // Check bounds
                if (!$gameMap.isValid(checkX, checkY)) return false;

                // Never on terrain tag 7
                if ($gameMap.terrainTag(checkX, checkY) === 7) return false;

                // Check passability based on collision grid
                if (furnitureData.collision[fy] && furnitureData.collision[fy][fx]) {
                    if (!$gameMap.isPassable(checkX, checkY, 2)) return false;
                }
            }
        }

        // Check collision with other furniture
        for (const placed of furnitureList) {
            const otherFurniture = FURNITURE_DB[placed.furnitureId];
            if (!otherFurniture) continue;

            if (x < placed.x + otherFurniture.width &&
                x + furnitureData.width > placed.x &&
                y < placed.y + otherFurniture.height &&
                y + furnitureData.height > placed.y) {
                return false;
            }
        }

        return true;
    }

    // Generate and place procedural furniture in current map based on seed
    Game_System.prototype.generateProceduralFurniture = function(seed) {
        const mapId = $gameMap.mapId();
        const validTiles = findValidFurnitureTiles();

        if (validTiles.length === 0) return;

        // Determine how many furniture pieces to place (1-4 based on seed)
        const furnitureCount = getSeededRandomInt(1, Math.min(4, validTiles.length), seed);

        const categories = ['seating', 'decoration', 'storage', 'lighting'];
        let placementAttempts = 0;
        const maxAttempts = 50;

        for (let i = 0; i < furnitureCount && placementAttempts < maxAttempts; i++) {
            // Get random category
            const category = getSeededRandomFromArray(categories, seed + i * 1000);
            const furnitureList = getFurnitureByCategory(category);

            if (furnitureList.length === 0) {
                i--;
                continue;
            }

            // Get random furniture from category
            const furnitureId = getSeededRandomFromArray(furnitureList, seed + i * 2000);
            const furnitureData = FURNITURE_DB[furnitureId];

            if (!furnitureData) {
                i--;
                continue;
            }

            // Get random position from valid tiles
            const tileIndex = getSeededRandomInt(0, validTiles.length - 1, seed + i * 3000);
            const tile = validTiles[tileIndex];

            // Try to place furniture
            if (canPlaceFurnitureAt(tile.x, tile.y, furnitureData)) {
                const flipped = furnitureData.rotatable ? (getSeededRandomInt(0, 1, seed + i * 4000) === 1) : false;
                const placedData = this.placeFurniture(mapId, furnitureId, tile.x, tile.y, flipped);

                // Add sprite to spriteset if map is loaded
                if (SceneManager._scene instanceof Scene_Map && SceneManager._scene._spriteset) {
                    SceneManager._scene._spriteset.addFurnitureSprite(placedData);
                }
            }

            placementAttempts++;
        }
    };

    // Generate house-appropriate furniture with specific requirements
    Game_System.prototype.generateHouseFurniture = function(seed) {
        const mapId = $gameMap.mapId();
        const validTiles = findValidFurnitureTiles();

        if (validTiles.length === 0) return;

        let tileIndex = 0;
        let placementAttempts = 0;
        const maxAttempts = 200;

        // Helper function to place furniture by category with specific count
        const placeFurnitureByCategory = (category, count, seedOffset) => {
            let placed = 0;
            const furnitureList = getFurnitureByCategory(category);

            if (furnitureList.length === 0) return placed;

            for (let i = 0; i < count && placementAttempts < maxAttempts; i++) {
                // Get random furniture from category
                const furnitureId = getSeededRandomFromArray(furnitureList, seed + seedOffset + i * 2000);
                const furnitureData = FURNITURE_DB[furnitureId];

                if (!furnitureData) continue;

                // Find valid position
                for (let attempts = 0; attempts < 10 && placementAttempts < maxAttempts; attempts++) {
                    tileIndex = (tileIndex + 1) % validTiles.length;
                    const tile = validTiles[tileIndex];

                    // Try to place furniture
                    if (canPlaceFurnitureAt(tile.x, tile.y, furnitureData)) {
                        const flipped = furnitureData.rotatable ? (getSeededRandomInt(0, 1, seed + seedOffset + i * 4000) === 1) : false;
                        const placedData = this.placeFurniture(mapId, furnitureId, tile.x, tile.y, flipped);

                        // Add sprite to spriteset if map is loaded
                        if (SceneManager._scene instanceof Scene_Map && SceneManager._scene._spriteset) {
                            SceneManager._scene._spriteset.addFurnitureSprite(placedData);
                        }

                        placed++;
                        break;
                    }

                    placementAttempts++;
                }
            }

            return placed;
        };

        // Place furniture in required order with specific counts
        // 1. At least 1 seating
        placeFurnitureByCategory.call(this, 'seating', getSeededRandomInt(1, 2, seed), 1000);

        // 2. 1 table
        placeFurnitureByCategory.call(this, 'tables', 1, 2000);

        // 3. At least 2 storage
        placeFurnitureByCategory.call(this, 'storage', getSeededRandomInt(2, 3, seed + 100), 3000);

        // 4. 1 or 2 beds
        placeFurnitureByCategory.call(this, 'beds', getSeededRandomInt(1, 2, seed + 200), 4000);

        // 5. 1-3 decoration
        placeFurnitureByCategory.call(this, 'decoration', getSeededRandomInt(1, 3, seed + 300), 5000);

        // 6. 4 appliances
        placeFurnitureByCategory.call(this, 'appliances', 4, 6000);

        // 7. 1 entertainment
        placeFurnitureByCategory.call(this, 'entertainment', 1, 7000);
    };

    //=============================================================================
    // Sprite_Furniture
    //=============================================================================
    
    class Sprite_Furniture extends Sprite {
        constructor(furnitureData, placedData) {
            super();
            this._furnitureData = furnitureData;
            this._placedData = placedData;
            this.initMembers();
            this.loadBitmap();
            this.updatePosition();
        }
        
        initMembers() {
            this._flipped = this._placedData.flipped || false;
            this.anchor.x = 0;
            this.anchor.y = 1; // Anchor at bottom for proper layering
        }
        
        loadBitmap() {
            const width = this._furnitureData.width * TILE_SIZE;
            const height = this._furnitureData.height * TILE_SIZE;

            try {
                // Try to load furniture image from img/furniture/
                this.bitmap = ImageManager.loadBitmap(`img/furniture/`, this._furnitureData.image);

                // Store reference to check loading later
                this._loadingImage = true;
                this._imageLoadTimeout = 0;
            } catch (error) {
                console.warn(`Failed to load furniture image: ${this._furnitureData.image}`, error);
                this.bitmap = new Bitmap(width, height);
                this.createColoredBitmap(width, height);
            }
        }

        update() {
            super.update();

            // Update position every frame to stay anchored to map as camera moves
            this.updatePosition();

            // Check if image finished loading
            if (this._loadingImage && this.bitmap) {
                this._imageLoadTimeout++;

                // Wait up to 60 frames for image to load
                if (this._imageLoadTimeout > 60 || !this.bitmap._url || this.bitmap.isReady()) {
                    this._loadingImage = false;

                    // If bitmap failed to load properly, use colored fallback
                    if (!this.bitmap.isReady() || this.bitmap.width === 0 || this.bitmap.height === 0) {
                        const width = this._furnitureData.width * TILE_SIZE;
                        const height = this._furnitureData.height * TILE_SIZE;
                        this.bitmap = new Bitmap(width, height);
                        this.createColoredBitmap(width, height);
                    }
                }
            }
        }

        createColoredBitmap(width, height) {
            // Draw placeholder furniture based on category
            const colors = {
                'seating': '#8B4513',    // Brown
                'tables': '#654321',     // Dark Brown
                'storage': '#696969',    // Gray
                'beds': '#4B0082',       // Indigo
                'lighting': '#FFD700',   // Gold
                'workstations': '#2F4F4F', // Dark Slate Gray
                'decoration': '#FF69B4', // Hot Pink
                'appliances': '#708090'  // Slate Gray
            };

            const color = colors[this._furnitureData.category] || '#808080';
            this.bitmap.fillRect(0, 0, width, height, color);

            // Draw border
            this.bitmap.strokeRect(0, 0, width, height, '#000000', 2);

            // Draw name
            this.bitmap.fontSize = 12;
            this.bitmap.textColor = '#FFFFFF';
            this.bitmap.drawText(
                this._furnitureData.name,
                4, 4, width - 8, 20,
                'center'
            );
        }
        
        updatePosition() {
            // Anchor furniture to map by accounting for camera scroll
            const tileWidth = $gameMap.tileWidth();
            const tileHeight = $gameMap.tileHeight();

            this.x = this._placedData.x * tileWidth - $gameMap.displayX() * tileWidth;
            this.y = this._placedData.y * tileHeight - $gameMap.displayY() * tileHeight;

            // Apply vertical flip if rotatable and flipped
            if (this._furnitureData.rotatable && this._flipped) {
                this.scale.x = -1;
                // Adjust x position to account for flip
                this.x += this._furnitureData.width * tileWidth;
            } else {
                this.scale.x = 1;
            }

            // Update z-index based on layer
            if (this._furnitureData.layer === 'below') {
                this.z = 1;
            } else if (this._furnitureData.layer === 'above') {
                this.z = 5;
            } else {
                this.z = 3;
            }
        }
        
        isInteractive() {
            return this._furnitureData.interactive;
        }
        
        getFurnitureData() {
            return this._furnitureData;
        }
        
        getPlacedData() {
            return this._placedData;
        }
        
        setFlipped(flipped) {
            this._flipped = flipped;
            this._placedData.flipped = flipped;
            this.updatePosition();
        }
    }
    
    //=============================================================================
    // Spriteset_Map Extensions
    //=============================================================================
    
    const _Spriteset_Map_createLowerLayer = Spriteset_Map.prototype.createLowerLayer;
    Spriteset_Map.prototype.createLowerLayer = function() {
        _Spriteset_Map_createLowerLayer.call(this);
        this.createFurnitureSprites();
    };
    
    Spriteset_Map.prototype.createFurnitureSprites = function() {
        this._furnitureSprites = [];
        const mapId = $gameMap.mapId();
        const furnitureList = $gameSystem.getMapFurniture(mapId);
        
        furnitureList.forEach(placedData => {
            const furnitureData = FURNITURE_DB[placedData.furnitureId];
            if (furnitureData) {
                const sprite = new Sprite_Furniture(furnitureData, placedData);
                this._furnitureSprites.push(sprite);
                this._tilemap.addChild(sprite);
            }
        });
    };
    
    Spriteset_Map.prototype.addFurnitureSprite = function(placedData) {
        const furnitureData = FURNITURE_DB[placedData.furnitureId];
        if (furnitureData) {
            const sprite = new Sprite_Furniture(furnitureData, placedData);
            this._furnitureSprites.push(sprite);
            this._tilemap.addChild(sprite);
            return sprite;
        }
        return null;
    };
    
    Spriteset_Map.prototype.removeFurnitureSprite = function(placedId) {
        const index = this._furnitureSprites.findIndex(
            sprite => sprite.getPlacedData().id === placedId
        );
        
        if (index >= 0) {
            const sprite = this._furnitureSprites[index];
            this._tilemap.removeChild(sprite);
            this._furnitureSprites.splice(index, 1);
        }
    };
    
    //=============================================================================
    // Scene_FurnitureBuilder
    //=============================================================================
    
    class Scene_FurnitureBuilder extends Scene_MenuBase {
        create() {
            super.create();
            this.createCategoryWindow();
            this.createRecipeWindow();
            this.createDetailWindow();
            this.createInventoryWindow();
            this.createCommandWindow();
        }
        
        createCategoryWindow() {
            const rect = this.categoryWindowRect();
            this._categoryWindow = new Window_FurnitureCategory(rect);
            this._categoryWindow.setHandler('ok', this.onCategoryOk.bind(this));
            this._categoryWindow.setHandler('cancel', this.popScene.bind(this));
            this.addWindow(this._categoryWindow);
        }
        
        categoryWindowRect() {
            const wx = 0;
            const wy = this.mainAreaTop();
            const ww = 240;
            const wh = this.mainAreaHeight();
            return new Rectangle(wx, wy, ww, wh);
        }
        
        createRecipeWindow() {
            const rect = this.recipeWindowRect();
            this._recipeWindow = new Window_FurnitureRecipe(rect);
            this._recipeWindow.setHandler('ok', this.onRecipeOk.bind(this));
            this._recipeWindow.setHandler('cancel', this.onRecipeCancel.bind(this));
            this._categoryWindow.setRecipeWindow(this._recipeWindow);
            this.addWindow(this._recipeWindow);
        }
        
        recipeWindowRect() {
            const wx = 240;
            const wy = this.mainAreaTop();
            const ww = Graphics.boxWidth - 240;
            const wh = 300;
            return new Rectangle(wx, wy, ww, wh);
        }
        
        createDetailWindow() {
            const rect = this.detailWindowRect();
            this._detailWindow = new Window_FurnitureDetail(rect);
            this._recipeWindow.setDetailWindow(this._detailWindow);
            this.addWindow(this._detailWindow);
        }
        
        detailWindowRect() {
            const wx = 240;
            const wy = this.mainAreaTop() + 300;
            const ww = (Graphics.boxWidth - 240) / 2;
            const wh = this.mainAreaHeight() - 300;
            return new Rectangle(wx, wy, ww, wh);
        }
        
        createInventoryWindow() {
            const rect = this.inventoryWindowRect();
            this._inventoryWindow = new Window_FurnitureInventory(rect);
            this.addWindow(this._inventoryWindow);
        }
        
        inventoryWindowRect() {
            const wx = 240 + (Graphics.boxWidth - 240) / 2;
            const wy = this.mainAreaTop() + 300;
            const ww = (Graphics.boxWidth - 240) / 2;
            const wh = this.mainAreaHeight() - 300;
            return new Rectangle(wx, wy, ww, wh);
        }
        
        createCommandWindow() {
            const rect = this.commandWindowRect();
            this._commandWindow = new Window_FurnitureCommand(rect);
            this._commandWindow.setHandler('craft', this.commandCraft.bind(this));
            this._commandWindow.setHandler('place', this.commandPlace.bind(this));
            this._commandWindow.setHandler('dismantle', this.commandDismantle.bind(this));
            this._commandWindow.setHandler('cancel', this.onCommandCancel.bind(this));
            this._commandWindow.hide();
            this._commandWindow.deactivate();
            this.addWindow(this._commandWindow);
        }
        
        commandWindowRect() {
            const ww = 240;
            const wh = 160;
            const wx = (Graphics.boxWidth - ww) / 2;
            const wy = (Graphics.boxHeight - wh) / 2;
            return new Rectangle(wx, wy, ww, wh);
        }
        
        onCategoryOk() {
            this._recipeWindow.activate();
            this._recipeWindow.select(0);
        }
        
        onRecipeCancel() {
            this._recipeWindow.deselect();
            this._categoryWindow.activate();
        }
        
        onRecipeOk() {
            this._commandWindow.setFurniture(this._recipeWindow.item());
            this._commandWindow.show();
            this._commandWindow.activate();
            this._commandWindow.select(0);
        }
        
        onCommandCancel() {
            this._commandWindow.hide();
            this._commandWindow.deactivate();
            this._recipeWindow.activate();
        }
        
        commandCraft() {
            const furnitureId = this._commandWindow.getFurnitureId();
            if ($gameSystem.canCraftFurniture(furnitureId)) {
                $gameSystem.craftFurniture(furnitureId);
                SoundManager.playOk();
                this._inventoryWindow.refresh();
                this._recipeWindow.refresh();
                this._detailWindow.refresh();
            } else {
                SoundManager.playBuzzer();
            }
            this.onCommandCancel();
        }
        
        commandPlace() {
            const furnitureId = this._commandWindow.getFurnitureId();
            if ($gameSystem.hasFurniture(furnitureId)) {
                // Close builder and enter placement mode
                this.popScene();
                $gameTemp.furniturePlacementMode = furnitureId;
            } else {
                SoundManager.playBuzzer();
            }
            this.onCommandCancel();
        }
        
        commandDismantle() {
            const furnitureId = this._commandWindow.getFurnitureId();
            if ($gameSystem.hasFurniture(furnitureId)) {
                $gameSystem.dismantleFurniture(furnitureId);
                SoundManager.playOk();
                this._inventoryWindow.refresh();
                this._recipeWindow.refresh();
                this._detailWindow.refresh();
            } else {
                SoundManager.playBuzzer();
            }
            this.onCommandCancel();
        }
    }
    
    //=============================================================================
    // Window Classes
    //=============================================================================
    
    class Window_FurnitureCategory extends Window_Command {
        makeCommandList() {
            const categories = [
                { name: 'All', symbol: 'all' },
                { name: 'Seating', symbol: 'seating' },
                { name: 'Tables', symbol: 'tables' },
                { name: 'Storage', symbol: 'storage' },
                { name: 'Beds', symbol: 'beds' },
                { name: 'Lighting', symbol: 'lighting' },
                { name: 'Workstations', symbol: 'workstations' },
                { name: 'Decoration', symbol: 'decoration' },
                { name: 'Appliances', symbol: 'appliances' }
            ];
            
            categories.forEach(cat => {
                this.addCommand(cat.name, cat.symbol);
            });
        }
        
        setRecipeWindow(recipeWindow) {
            this._recipeWindow = recipeWindow;
            this.update();
        }
        
        update() {
            super.update();
            if (this._recipeWindow) {
                this._recipeWindow.setCategory(this.currentSymbol());
            }
        }
    }
    
    class Window_FurnitureRecipe extends Window_Selectable {
        initialize(rect) {
            super.initialize(rect);
            this._category = 'all';
            this._data = [];
            this.refresh();
        }
        
        maxItems() {
            return this._data ? this._data.length : 0;
        }
        
        item() {
            return this._data[this.index()];
        }
        
        setCategory(category) {
            if (this._category !== category) {
                this._category = category;
                this.refresh();
                this.select(0);
                this.scrollTo(0, 0);
            }
        }
        
        makeItemList() {
            this._data = [];
            
            for (const [id, furniture] of Object.entries(FURNITURE_DB)) {
                if (this._category === 'all' || furniture.category === this._category) {
                    if ($gameSystem.isRecipeUnlocked(id)) {
                        this._data.push({ id, ...furniture });
                    }
                }
            }
        }
        
        drawItem(index) {
            const item = this._data[index];
            if (item) {
                const rect = this.itemLineRect(index);
                
                // Check if can craft
                const canCraft = $gameSystem.canCraftFurniture(item.id);
                const hasItem = $gameSystem.hasFurniture(item.id);
                
                if (!canCraft) {
                    this.changeTextColor(ColorManager.textColor(8)); // Gray
                } else {
                    this.resetTextColor();
                }
                
                // Draw name
                this.drawText(item.name, rect.x, rect.y, rect.width - 120);
                
                // Draw owned quantity
                if (hasItem) {
                    const qty = $gameSystem.getFurnitureData().inventory[item.id];
                    this.drawText(`Owned: ${qty}`, rect.x + rect.width - 120, rect.y, 120, 'right');
                }
                
                this.resetTextColor();
            }
        }
        
        setDetailWindow(detailWindow) {
            this._detailWindow = detailWindow;
        }
        
        update() {
            super.update();
            if (this._detailWindow) {
                this._detailWindow.setFurniture(this.item());
            }
        }
        
        refresh() {
            this.makeItemList();
            super.refresh();
        }
    }
    
    class Window_FurnitureDetail extends Window_Base {
        initialize(rect) {
            super.initialize(rect);
            this._furniture = null;
        }
        
        setFurniture(furniture) {
            if (this._furniture !== furniture) {
                this._furniture = furniture;
                this.refresh();
            }
        }
        
        refresh() {
            this.contents.clear();
            
            if (!this._furniture) return;
            
            let y = 0;
            const lineHeight = this.lineHeight();
            
            // Name
            this.changeTextColor(ColorManager.systemColor());
            this.drawText(this._furniture.name, 0, y, this.innerWidth, 'center');
            y += lineHeight;
            
            // Description
            this.resetTextColor();
            this.drawTextEx(this._furniture.description, 0, y, this.innerWidth);
            y += lineHeight * 2;
            
            // Size
            this.changeTextColor(ColorManager.systemColor());
            this.drawText('Size:', 0, y, 100);
            this.resetTextColor();
            this.drawText(`${this._furniture.width}x${this._furniture.height}`, 100, y, 100);
            y += lineHeight;
            
            // Recipe
            if (this._furniture.recipe) {
                this.changeTextColor(ColorManager.systemColor());
                this.drawText('Materials:', 0, y, this.innerWidth);
                y += lineHeight;
                
                for (const [materialId, quantity] of Object.entries(this._furniture.recipe)) {
                    const material = MATERIALS[materialId];
                    const has = $gameSystem.hasMaterial(materialId, quantity);
                    const owned = $gameSystem.getFurnitureData().materials[materialId] || 0;
                    
                    if (!has) {
                        this.changeTextColor(ColorManager.textColor(2)); // Red
                    } else {
                        this.resetTextColor();
                    }
                    
                    this.drawText(`${material.name}:`, 12, y, 150);
                    this.drawText(`${owned}/${quantity}`, 162, y, 80, 'right');
                    y += lineHeight;
                }
            }
        }
    }
    
    class Window_FurnitureInventory extends Window_Base {
        initialize(rect) {
            super.initialize(rect);
            this.refresh();
        }
        
        refresh() {
            this.contents.clear();
            
            let y = 0;
            const lineHeight = this.lineHeight();
            
            // Title
            this.changeTextColor(ColorManager.systemColor());
            this.drawText('Inventory', 0, y, this.innerWidth, 'center');
            y += lineHeight;
            
            // Materials
            this.drawText('Materials:', 0, y, this.innerWidth);
            y += lineHeight;
            
            const materials = $gameSystem.getFurnitureData().materials;
            let materialCount = 0;
            
            for (const [id, quantity] of Object.entries(materials)) {
                if (quantity > 0) {
                    const material = MATERIALS[id];
                    this.resetTextColor();
                    this.drawText(`${material.name}:`, 12, y, 150);
                    this.drawText(quantity, 162, y, 80, 'right');
                    y += lineHeight;
                    materialCount++;
                    
                    if (materialCount >= 6) {
                        this.drawText('...', 12, y, 50);
                        break;
                    }
                }
            }
        }
    }
    
    class Window_FurnitureCommand extends Window_Command {
        initialize(rect) {
            super.initialize(rect);
            this._furnitureId = null;
        }
        
        makeCommandList() {
            if (this._furnitureId) {
                const furniture = FURNITURE_DB[this._furnitureId];
                const canCraft = $gameSystem.canCraftFurniture(this._furnitureId);
                const hasItem = $gameSystem.hasFurniture(this._furnitureId);
                
                this.addCommand('Craft', 'craft', canCraft && furniture.recipe);
                this.addCommand('Place', 'place', hasItem);
                this.addCommand('Dismantle', 'dismantle', hasItem && furniture.recipe);
            }
        }
        
        setFurniture(furniture) {
            this._furnitureId = furniture ? furniture.id : null;
            this.refresh();
        }
        
        getFurnitureId() {
            return this._furnitureId;
        }
    }
    
    //=============================================================================
    // Furniture Placement Mode
    //=============================================================================
    
    class Sprite_FurniturePlacement extends Sprite {
        constructor(furnitureId) {
            super();
            this._furnitureId = furnitureId;
            this._furnitureData = FURNITURE_DB[furnitureId];
            this._flipped = false;
            this._valid = false;
            this.createBitmap();
            this.updatePosition();
        }
        
        createBitmap() {
            const width = this._furnitureData.width * TILE_SIZE;
            const height = this._furnitureData.height * TILE_SIZE;
            
            this.bitmap = new Bitmap(width, height);
            this.anchor.x = 0;
            this.anchor.y = 0;
            this.opacity = 180;
            
            this.updateBitmap();
        }
        
        updateBitmap() {
            this.bitmap.clear();
            
            const width = this._furnitureData.width * TILE_SIZE;
            const height = this._furnitureData.height * TILE_SIZE;
            
            // Draw furniture preview
            const color = this._valid ? '#00FF00' : '#FF0000';
            this.bitmap.fillRect(0, 0, width, height, color);
            this.bitmap.strokeRect(0, 0, width, height, '#000000', 2);
            
            // Draw name
            this.bitmap.fontSize = 12;
            this.bitmap.textColor = '#000000';
            this.bitmap.drawText(
                this._furnitureData.name,
                4, 4, width - 8, 20,
                'center'
            );
        }
        
        setPosition(x, y) {
            this.x = x * TILE_SIZE;
            this.y = y * TILE_SIZE;
        }
        
        setValid(valid) {
            if (this._valid !== valid) {
                this._valid = valid;
                this.updateBitmap();
            }
        }
        
        flip() {
            if (this._furnitureData.rotatable) {
                this._flipped = !this._flipped;
                this.scale.x = this._flipped ? -1 : 1;
            }
        }

        getFlipped() {
            return this._flipped;
        }
        
        updatePosition() {
            // Update z-index
            this.z = 6; // Above everything
        }
    }
    
    const _Scene_Map_create = Scene_Map.prototype.create;
    Scene_Map.prototype.create = function() {
        _Scene_Map_create.call(this);
        this.createPlacementMode();
    };

    Scene_Map.prototype.createPlacementMode = function() {
        this._placementSprite = null;
        this._placementGrid = null;
    };

    // Hook into onMapLoaded to generate procedural furniture for houses
    const _Scene_Map_onMapLoaded = Scene_Map.prototype.onMapLoaded;
    Scene_Map.prototype.onMapLoaded = function() {
        _Scene_Map_onMapLoaded.call(this);

        // Check if this is a house with TreasureRoomSystem integration
        if (window.TreasureRoomSystem && typeof window.TreasureRoomSystem.getCurrentHouseSeed === 'function') {
            const seed = window.TreasureRoomSystem.getCurrentHouseSeed();
            if (seed) {
                // Generate procedural furniture for this house
                $gameSystem.generateProceduralFurniture(seed);
            }
        }
    };
    
    const _Scene_Map_update = Scene_Map.prototype.update;
    Scene_Map.prototype.update = function() {
        _Scene_Map_update.call(this);
        
        if ($gameTemp.furniturePlacementMode) {
            this.updatePlacementMode();
        }
    };
    
    Scene_Map.prototype.updatePlacementMode = function() {
        if (!this._placementSprite) {
            this.enterPlacementMode($gameTemp.furniturePlacementMode);
        }
        
        // Get grid position from mouse/touch
        const x = Math.floor(TouchInput.x / TILE_SIZE);
        const y = Math.floor(TouchInput.y / TILE_SIZE);
        
        // Update sprite position
        this._placementSprite.setPosition(x, y);
        
        // Check if position is valid
        const valid = this.isPlacementValid(x, y);
        this._placementSprite.setValid(valid);
        
        // Handle input
        if (Input.isTriggered('ok') || TouchInput.isTriggered()) {
            if (valid) {
                this.placeFurniture(x, y);
            } else {
                SoundManager.playBuzzer();
            }
        } else if (Input.isTriggered('cancel')) {
            this.exitPlacementMode();
        } else if (Input.isTriggered('shift')) {
            this._placementSprite.flip();
        }
    };
    
    Scene_Map.prototype.enterPlacementMode = function(furnitureId) {
        // Create placement sprite
        this._placementSprite = new Sprite_FurniturePlacement(furnitureId);
        this._spriteset._tilemap.addChild(this._placementSprite);
        
        // Create grid overlay
        this.createGridOverlay();
        
        // Disable player movement
        $gameSystem.disableMenu();
        $gamePlayer.setMoveSpeed(0);
    };
    
    Scene_Map.prototype.exitPlacementMode = function() {
        // Remove placement sprite
        if (this._placementSprite) {
            this._spriteset._tilemap.removeChild(this._placementSprite);
            this._placementSprite = null;
        }
        
        // Remove grid overlay
        if (this._placementGrid) {
            this._spriteset._tilemap.removeChild(this._placementGrid);
            this._placementGrid = null;
        }
        
        // Clear placement mode
        $gameTemp.furniturePlacementMode = null;
        
        // Re-enable player movement
        $gameSystem.enableMenu();
        $gamePlayer.setMoveSpeed(4);
    };
    
    Scene_Map.prototype.createGridOverlay = function() {
        const width = $gameMap.width() * TILE_SIZE;
        const height = $gameMap.height() * TILE_SIZE;
        
        this._placementGrid = new Sprite();
        this._placementGrid.bitmap = new Bitmap(width, height);
        this._placementGrid.opacity = GRID_OPACITY;
        this._placementGrid.z = 0;
        
        // Draw grid
        for (let x = 0; x <= $gameMap.width(); x++) {
            const xPos = x * TILE_SIZE;
            this._placementGrid.bitmap.fillRect(xPos, 0, 1, height, '#FFFFFF');
        }
        
        for (let y = 0; y <= $gameMap.height(); y++) {
            const yPos = y * TILE_SIZE;
            this._placementGrid.bitmap.fillRect(0, yPos, width, 1, '#FFFFFF');
        }
        
        this._spriteset._tilemap.addChild(this._placementGrid);
    };
    
    Scene_Map.prototype.isPlacementValid = function(x, y) {
        const furnitureId = $gameTemp.furniturePlacementMode;
        const furniture = FURNITURE_DB[furnitureId];

        if (!furniture) return false;

        // Check bounds
        if (x < 0 || y < 0 ||
            x + furniture.width > $gameMap.width() ||
            y + furniture.height > $gameMap.height()) {
            return false;
        }

        // Check wall placement restriction
        if (furniture.wall) {
            // Wall furniture must be placed on terrain tag 4
            let onWallTerrain = false;
            for (let fx = 0; fx < furniture.width; fx++) {
                for (let fy = 0; fy < furniture.height; fy++) {
                    if ($gameMap.terrainTag(x + fx, y + fy) === 4) {
                        onWallTerrain = true;
                        break;
                    }
                }
                if (onWallTerrain) break;
            }
            if (!onWallTerrain) {
                return false;
            }
        } else {
            // Non-wall furniture: no tiles can overlap terrain tags 4 or 7
            for (let fx = 0; fx < furniture.width; fx++) {
                for (let fy = 0; fy < furniture.height; fy++) {
                    const checkX = x + fx;
                    const checkY = y + fy;

                    // Check bounds
                    if (!$gameMap.isValid(checkX, checkY)) return false;

                    // Check if any tile is on terrain tag 4 or 7 (not allowed)
                    const terrainTag = $gameMap.terrainTag(checkX, checkY);
                    if (terrainTag === 4 || terrainTag === 7) {
                        return false;
                    }
                }
            }
        }

        // Never place furniture on terrain tag 7
        for (let fx = 0; fx < furniture.width; fx++) {
            for (let fy = 0; fy < furniture.height; fy++) {
                if ($gameMap.terrainTag(x + fx, y + fy) === 7) {
                    return false;
                }
            }
        }

        // Check collision with map
        for (let fx = 0; fx < furniture.width; fx++) {
            for (let fy = 0; fy < furniture.height; fy++) {
                if (furniture.collision[fy] && furniture.collision[fy][fx]) {
                    if (!$gameMap.isPassable(x + fx, y + fy, 2)) {
                        return false;
                    }
                }
            }
        }

        // Check collision with other furniture
        const mapFurniture = $gameSystem.getMapFurniture($gameMap.mapId());
        for (const placed of mapFurniture) {
            const otherFurniture = FURNITURE_DB[placed.furnitureId];
            if (!otherFurniture) continue;

            // Check if rectangles overlap
            if (x < placed.x + otherFurniture.width &&
                x + furniture.width > placed.x &&
                y < placed.y + otherFurniture.height &&
                y + furniture.height > placed.y) {
                return false;
            }
        }

        return true;
    };
    
    Scene_Map.prototype.placeFurniture = function(x, y) {
        const furnitureId = $gameTemp.furniturePlacementMode;
        const flipped = this._placementSprite.getFlipped();

        // Remove from inventory
        $gameSystem.removeFurniture(furnitureId, 1);

        // Place on map
        const placedData = $gameSystem.placeFurniture(
            $gameMap.mapId(),
            furnitureId,
            x, y,
            flipped
        );

        // Add sprite to map
        if (this._spriteset) {
            this._spriteset.addFurnitureSprite(placedData);
        }

        SoundManager.playOk();

        // Check if player has more of this furniture
        if ($gameSystem.hasFurniture(furnitureId)) {
            // Stay in placement mode
        } else {
            this.exitPlacementMode();
        }
    };
    
    //=============================================================================
    // Plugin Commands
    //=============================================================================
    
    PluginManager.registerCommand(pluginName, 'openBuilder', args => {
        SceneManager.push(Scene_FurnitureBuilder);
    });
    
    PluginManager.registerCommand(pluginName, 'enterPlacementMode', args => {
        const furnitureId = args.furnitureId;
        if ($gameSystem.hasFurniture(furnitureId)) {
            $gameTemp.furniturePlacementMode = furnitureId;
        }
    });
    
    PluginManager.registerCommand(pluginName, 'giveFurniture', args => {
        const furnitureId = args.furnitureId;
        const quantity = Number(args.quantity) || 1;
        $gameSystem.addFurniture(furnitureId, quantity);
    });
    
    PluginManager.registerCommand(pluginName, 'giveMaterial', args => {
        const materialId = args.materialId;
        const quantity = Number(args.quantity) || 1;
        $gameSystem.addMaterial(materialId, quantity);
    });
    
    PluginManager.registerCommand(pluginName, 'unlockRecipe', args => {
        const recipeId = args.recipeId;
        $gameSystem.unlockRecipe(recipeId);
    });
    
    PluginManager.registerCommand(pluginName, 'removeAllFurniture', args => {
        const mapId = $gameMap.mapId();
        $gameSystem.getFurnitureData().maps[mapId] = [];
        
        // Refresh the scene
        if (SceneManager._scene instanceof Scene_Map) {
            SceneManager.goto(Scene_Map);
        }
    });
    
})();
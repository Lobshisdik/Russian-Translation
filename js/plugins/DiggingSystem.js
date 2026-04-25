/*:
 * @plugindesc Allows for breaking/digging walls at runtime
 * @author Omni-Lex
 *
 * @param BreakableTilesetId
 * @desc Tileset ID that contains breakable walls
 * @default 1
 * 
 * @param ReplacementTileId
 * @desc ID of the tile that will replace broken walls
 * @default 0
 *
 * @help
 * This plugin allows players to break walls in the game.
 * 
 * How to use:
 * 1. Set the tileset ID for breakable walls in the plugin parameters
 * 2. Create a common event that calls the breakWallInFront function
 * 3. Assign that common event to a key or action button
 * 
 * Script calls:
 *   DiggingSystem.breakWallInFront() - Breaks wall in front of player
 *   DiggingSystem.isWallBreakable(x, y) - Checks if wall is breakable
 */

var DiggingSystem = DiggingSystem || {};

(function() {
    'use strict';
    
    var parameters = PluginManager.parameters('DiggingSystem');
    DiggingSystem.breakableTilesetId = Number(parameters['BreakableTilesetId'] || 1);
    DiggingSystem.replacementTileId = Number(parameters['ReplacementTileId'] || 0);
    
    // Function to check if a tile is a breakable wall
    DiggingSystem.isWallBreakable = function(x, y) {
        const mapId = $gameMap.mapId();
        const tileId = $gameMap.tileId(x, y, 0); // Layer 0 for ground/wall tiles
        
        // Check if the tile is from the breakable tileset
        const tilesetId = $gameMap.tileset().id;
        return tilesetId === this.breakableTilesetId && this.isWall(tileId);
    };
    
    // Helper function to determine if a tile is a wall (can be customized)
    DiggingSystem.isWall = function(tileId) {
        // This is a simplified check. You might need to adjust based on your tileset
        // Generally, walls have passage flags that block movement
        const flags = $gameMap.tilesetFlags()[tileId];
        return (flags & 0x0f) === 0x0f; // If all directions are blocked
    };
    
    // Function to get coordinates in front of the player
    DiggingSystem.getFrontPosition = function() {
        const direction = $gamePlayer.direction();
        let x = $gamePlayer.x;
        let y = $gamePlayer.y;
        
        switch (direction) {
            case 2: // Down
                y += 1;
                break;
            case 4: // Left
                x -= 1;
                break;
            case 6: // Right
                x += 1;
                break;
            case 8: // Up
                y -= 1;
                break;
        }
        
        return {x: x, y: y};
    };
    
    // Main function to break a wall in front of the player
    DiggingSystem.breakWallInFront = function() {
        const frontPos = this.getFrontPosition();
        
        if (this.isWallBreakable(frontPos.x, frontPos.y)) {
            // Replace the wall tile with the specified tile
            this.replaceTile(frontPos.x, frontPos.y, this.replacementTileId);
            
            // Update surrounding autotiles
            this.updateSurroundingAutotiles(frontPos.x, frontPos.y);
            
            // Play breaking sound effect (optional)
            AudioManager.playSe({name: 'Break', volume: 90, pitch: 100, pan: 0});
            
            return true;
        }
        
        return false;
    };
    
    // Function to replace a tile at specific coordinates
    DiggingSystem.replaceTile = function(x, y, newTileId) {
        const mapId = $gameMap.mapId();
        
        // Store the change in game system for persistence
        if (!$gameSystem._modifiedTiles) {
            $gameSystem._modifiedTiles = {};
        }
        
        if (!$gameSystem._modifiedTiles[mapId]) {
            $gameSystem._modifiedTiles[mapId] = [];
        }
        
        // Save the modification
        $gameSystem._modifiedTiles[mapId].push({
            x: x,
            y: y,
            tileId: newTileId
        });
        
        // Modify the tile data directly
        const layer = 0; // Assuming walls are on layer 0
        const width = $dataMap.width;
        const height = $dataMap.height;
        
        // Update the map data
        const zIndex = layer * width * height;
        const index = zIndex + y * width + x;
        $dataMap.data[index] = newTileId;
        
        // Request a refresh of the map
        $gameMap.requestRefresh();
    };
    
    // Function to update surrounding autotiles
    DiggingSystem.updateSurroundingAutotiles = function(x, y) {
        // Check and update tiles in all 8 directions
        for (let dy = -1; dy <= 1; dy++) {
            for (let dx = -1; dx <= 1; dx++) {
                if (dx === 0 && dy === 0) continue; // Skip the center tile
                
                const nx = x + dx;
                const ny = y + dy;
                
                // Only update if it's a valid autotile
                const tileId = $gameMap.tileId(nx, ny, 0);
                if (Tilemap.isAutotile(tileId)) {
                    // Force a recalculation of the autotile shape
                    const mapId = $gameMap.mapId();
                    if (!$gameSystem._modifiedTiles) {
                        $gameSystem._modifiedTiles = {};
                    }
                    
                    if (!$gameSystem._modifiedTiles[mapId]) {
                        $gameSystem._modifiedTiles[mapId] = [];
                    }
                    
                    // Simply pushing the same tile ID will force a refresh
                    $gameSystem._modifiedTiles[mapId].push({
                        x: nx,
                        y: ny,
                        tileId: tileId
                    });
                }
            }
        }
    };
    
    // Store original map load function to extend it
    const _Game_Map_setup = Game_Map.prototype.setup;
    Game_Map.prototype.setup = function(mapId) {
        _Game_Map_setup.call(this, mapId);
        
        // Apply stored tile modifications after loading the map
        if ($gameSystem && $gameSystem._modifiedTiles && $gameSystem._modifiedTiles[mapId]) {
            const modifications = $gameSystem._modifiedTiles[mapId];
            
            for (let i = 0; i < modifications.length; i++) {
                const mod = modifications[i];
                const layer = 0;
                const width = $dataMap.width;
                const height = $dataMap.height;
                const zIndex = layer * width * height;
                const index = zIndex + mod.y * width + mod.x;
                
                // Apply the stored modification
                $dataMap.data[index] = mod.tileId;
            }
            
            this.requestRefresh();
        }
    };
})();

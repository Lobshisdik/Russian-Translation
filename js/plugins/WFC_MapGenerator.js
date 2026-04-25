/*:
 * @target MZ
 * @plugindesc Wave Function Collapse Map Generator
 * @author Omni-Lex
 * @help
 * This plugin implements a Wave Function Collapse algorithm to generate
 * procedural maps based on patterns from existing sample maps.
 * 
 * Usage:
 * 1. Create small sample maps that contain the patterns you want to use
 * 2. Set the pattern size (default is 3x3)
 * 3. Specify pattern map IDs in the plugin parameters
 * 4. Call the WFC generator using the plugin command
 * 
 * Plugin Commands:
 *   GenerateMap width height targetMapId - Generates a new map with specified dimensions
 *   
 * @param PatternMapIds
 * @desc IDs of maps to use as pattern sources, separated by commas
 * @default 1,2,3
 * 
 * @param PatternSize
 * @desc Size of pattern blocks (NxN)
 * @type number
 * @min 2
 * @max 5
 * @default 3
 * 
 * @param WrapPatterns
 * @desc Whether patterns should wrap at the edges (true/false)
 * @type boolean
 * @default false
 * 
 * @param DebugMode
 * @desc Enable debug logging (true/false)
 * @type boolean
 * @default false
 * 
 * @param FallbackTileId
 * @desc Tile ID to use for filling empty spaces (0 = auto-detect)
 * @type number
 * @min 0
 * @default 0
 * 
 * @command GenerateMap
 * @desc Generate a new map using WFC algorithm
 * 
 * @arg width
 * @desc Width of the generated map
 * @type number
 * @min 10
 * @max 500
 * @default 50
 * 
 * @arg height
 * @desc Height of the generated map
 * @type number
 * @min 10
 * @max 500
 * @default 50
 * 
 * @arg targetMapId
 * @desc Map ID to save the generated result
 * @type number
 * @min 1
 * @default 1
 *
 * @arg patternMapId
 * @desc Specific map ID to use as pattern source (leave empty to use random patterns from plugin settings)
 * @type number
 * @min 0
 * @default 0
 * 
 * @arg fallbackTileId
 * @desc Tile ID to use for filling empty spaces (0 = use plugin default)
 * @type number
 * @min 0
 * @default 0
 */

(() => {
    'use strict';

    const pluginName = "WFC_MapGenerator";
    
    // Plugin parameters
    const parameters = PluginManager.parameters(pluginName);
    const defaultPatternMapIds = parameters.PatternMapIds.split(',').map(id => Number(id));
    const defaultPatternSize = Number(parameters.PatternSize || 3);
    const defaultWrapPatterns = parameters.WrapPatterns === 'true';
    const debugMode = parameters.DebugMode === 'true';
    const fallbackTileId = Number(parameters.FallbackTileId || 0);
    
    // Debug logging helper
    function debug(...args) {
        if (debugMode) {
            console.log("[WFC]", ...args);
        }
    }
    
    // Register plugin commands
    PluginManager.registerCommand(pluginName, "GenerateMap", args => {
        const width = Number(args.width);
        const height = Number(args.height);
        const targetMapId = Number(args.targetMapId);
        const patternMapId = Number(args.patternMapId || 0);
        const customFallbackTileId = Number(args.fallbackTileId || 0);
        
        // If patternMapId is specified and valid, use it; otherwise use default patterns
        if (patternMapId > 0) {
            generateMap(width, height, targetMapId, [patternMapId], customFallbackTileId);
        } else {
            generateMap(width, height, targetMapId, null, customFallbackTileId);
        }
    });
    
    /**
     * Wave Function Collapse Algorithm
     */
    class WaveFunctionCollapse {
        constructor(patternSize, wrapPatterns, fallbackTileId) {
            this.patternSize = patternSize;
            this.wrapPatterns = wrapPatterns;
            this.fallbackTileId = fallbackTileId || 0;
            this.patterns = [];
            this.weights = [];
            this.adjacencyRules = {
                top: {},
                right: {},
                bottom: {},
                left: {}
            };
        }
        
        /**
         * Extract patterns from a map
         * @param {Map} map - RPG Maker map data
         */
        extractPatternsFromMap(map) {
            const mapWidth = map.width;
            const mapHeight = map.height;
            const mapData = map.data;
            
            debug(`Extracting patterns from map (${mapWidth}x${mapHeight})`);
            
            if (!mapData || !mapWidth || !mapHeight) {
                console.error("Invalid map data!", map);
                return;
            }
            
            let patternsExtracted = 0;
            
            // For each possible pattern position
            for (let y = 0; y < mapHeight - this.patternSize + 1; y++) {
                for (let x = 0; x < mapWidth - this.patternSize + 1; x++) {
                    // Extract pattern
                    const pattern = this.extractPattern(mapData, mapWidth, x, y);
                    
                    // Check if pattern is empty (all zeros)
                    const isEmpty = this.isPatternEmpty(pattern);
                    if (isEmpty) {
                        continue; // Skip empty patterns
                    }
                    
                    // Check if pattern already exists
                    const patternIndex = this.findPatternIndex(pattern);
                    
                    if (patternIndex === -1) {
                        // Add new pattern
                        this.patterns.push(pattern);
                        this.weights.push(1);
                        patternsExtracted++;
                    } else {
                        // Increment weight of existing pattern
                        this.weights[patternIndex]++;
                    }
                }
            }
            
            debug(`Extracted ${patternsExtracted} unique patterns`);
            
            // Extract adjacency rules
            this.extractAdjacencyRules();
        }
        
        /**
         * Check if a pattern is empty (all zeros)
         * @param {Array} pattern - Pattern to check
         * @return {boolean} Whether pattern is empty
         */
        isPatternEmpty(pattern) {
            for (let i = 0; i < pattern.length; i++) {
                for (let j = 0; j < 4; j++) {
                    if (pattern[i][j] !== 0) {
                        return false;
                    }
                }
            }
            return true;
        }
        
        /**
         * Extract a single pattern from map data
         * @param {Array} mapData - Map tile data
         * @param {number} mapWidth - Width of the map
         * @param {number} startX - Starting X position
         * @param {number} startY - Starting Y position
         * @return {Array} Pattern data
         */
        extractPattern(mapData, mapWidth, startX, startY) {
            const pattern = [];
            
            for (let y = 0; y < this.patternSize; y++) {
                for (let x = 0; x < this.patternSize; x++) {
                    const mapX = startX + x;
                    const mapY = startY + y;
                    const tileIndex = (mapY * mapWidth + mapX) * 4; // RPG Maker uses 4 layers per tile
                    
                    // Make sure we're within bounds
                    if (tileIndex < 0 || tileIndex >= mapData.length - 3) {
                        pattern.push([0, 0, 0, 0]);
                        continue;
                    }
                    
                    // Extract all 4 tile layers for this position
                    pattern.push([
                        mapData[tileIndex] || 0,
                        mapData[tileIndex + 1] || 0,
                        mapData[tileIndex + 2] || 0,
                        mapData[tileIndex + 3] || 0
                    ]);
                }
            }
            
            return pattern;
        }
        
        /**
         * Find index of an existing pattern
         * @param {Array} pattern - Pattern to find
         * @return {number} Index of pattern or -1 if not found
         */
        findPatternIndex(pattern) {
            for (let i = 0; i < this.patterns.length; i++) {
                if (this.patternsEqual(pattern, this.patterns[i])) {
                    return i;
                }
            }
            return -1;
        }
        
        /**
         * Check if two patterns are equal
         * @param {Array} pattern1 - First pattern
         * @param {Array} pattern2 - Second pattern
         * @return {boolean} Whether patterns are equal
         */
        patternsEqual(pattern1, pattern2) {
            if (pattern1.length !== pattern2.length) {
                return false;
            }
            
            for (let i = 0; i < pattern1.length; i++) {
                for (let j = 0; j < 4; j++) {
                    if (pattern1[i][j] !== pattern2[i][j]) {
                        return false;
                    }
                }
            }
            return true;
        }
        
        /**
         * Extract adjacency rules from patterns
         */
        extractAdjacencyRules() {
            const numPatterns = this.patterns.length;
            
            debug(`Extracting adjacency rules for ${numPatterns} patterns`);
            
            if (numPatterns === 0) {
                console.error("No patterns were extracted! Check your sample maps.");
                return;
            }
            
            // Initialize adjacency rules
            for (let i = 0; i < numPatterns; i++) {
                this.adjacencyRules.top[i] = [];
                this.adjacencyRules.right[i] = [];
                this.adjacencyRules.bottom[i] = [];
                this.adjacencyRules.left[i] = [];
            }
            
            // For each pair of patterns
            for (let i = 0; i < numPatterns; i++) {
                for (let j = 0; j < numPatterns; j++) {
                    // Check if j can be placed above i
                    if (this.canConnect(this.patterns[i], this.patterns[j], 'top')) {
                        this.adjacencyRules.top[i].push(j);
                    }
                    
                    // Check if j can be placed to the right of i
                    if (this.canConnect(this.patterns[i], this.patterns[j], 'right')) {
                        this.adjacencyRules.right[i].push(j);
                    }
                    
                    // Check if j can be placed below i
                    if (this.canConnect(this.patterns[i], this.patterns[j], 'bottom')) {
                        this.adjacencyRules.bottom[i].push(j);
                    }
                    
                    // Check if j can be placed to the left of i
                    if (this.canConnect(this.patterns[i], this.patterns[j], 'left')) {
                        this.adjacencyRules.left[i].push(j);
                    }
                }
            }
            
            // Check for patterns with no valid neighbors
            let validRules = 0;
            for (let i = 0; i < numPatterns; i++) {
                validRules += this.adjacencyRules.top[i].length;
                validRules += this.adjacencyRules.right[i].length;
                validRules += this.adjacencyRules.bottom[i].length;
                validRules += this.adjacencyRules.left[i].length;
            }
            
            debug(`Created ${validRules} adjacency rules`);
            
            if (validRules === 0) {
                console.error("No valid adjacency rules were created! Check your sample maps.");
            }
        }
        
        /**
         * Check if two patterns can connect in a given direction
         * @param {Array} pattern1 - First pattern
         * @param {Array} pattern2 - Second pattern
         * @param {string} direction - Direction ('top', 'right', 'bottom', 'left')
         * @return {boolean} Whether patterns can connect
         */
        canConnect(pattern1, pattern2, direction) {
            const size = this.patternSize;
            
            switch (direction) {
                case 'top':
                    // Bottom edge of pattern2 must match top edge of pattern1
                    for (let x = 0; x < size; x++) {
                        const p1Index = x;
                        const p2Index = (size - 1) * size + x;
                        
                        for (let layer = 0; layer < 4; layer++) {
                            if (pattern1[p1Index][layer] !== pattern2[p2Index][layer]) {
                                return false;
                            }
                        }
                    }
                    return true;
                    
                case 'right':
                    // Left edge of pattern2 must match right edge of pattern1
                    for (let y = 0; y < size; y++) {
                        const p1Index = y * size + (size - 1);
                        const p2Index = y * size;
                        
                        for (let layer = 0; layer < 4; layer++) {
                            if (pattern1[p1Index][layer] !== pattern2[p2Index][layer]) {
                                return false;
                            }
                        }
                    }
                    return true;
                    
                case 'bottom':
                    // Top edge of pattern2 must match bottom edge of pattern1
                    for (let x = 0; x < size; x++) {
                        const p1Index = (size - 1) * size + x;
                        const p2Index = x;
                        
                        for (let layer = 0; layer < 4; layer++) {
                            if (pattern1[p1Index][layer] !== pattern2[p2Index][layer]) {
                                return false;
                            }
                        }
                    }
                    return true;
                    
                case 'left':
                    // Right edge of pattern2 must match left edge of pattern1
                    for (let y = 0; y < size; y++) {
                        const p1Index = y * size;
                        const p2Index = y * size + (size - 1);
                        
                        for (let layer = 0; layer < 4; layer++) {
                            if (pattern1[p1Index][layer] !== pattern2[p2Index][layer]) {
                                return false;
                            }
                        }
                    }
                    return true;
            }
            
            return false;
        }
        
        /**
         * Generate a map using the wave function collapse algorithm
         * @param {number} width - Width of output map in pattern units
         * @param {number} height - Height of output map in pattern units
         * @return {Array} Generated map
         */
        generate(width, height) {
            debug(`Generating map (${width}x${height})`);
            
            if (this.patterns.length === 0) {
                console.error("No patterns to generate from! Check your sample maps.");
                return null;
            }
            
            // Create wave function grid
            const grid = Array(width * height).fill().map(() => {
                return {
                    collapsed: false,
                    options: Array(this.patterns.length).fill().map((_, i) => i)
                };
            });
            
            // Keep track of entropy (number of options) for each cell
            const getEntropy = cell => cell.options.length;
            
            // Track uncollapsed cells
            let remainingCells = width * height;
            let maxIterations = width * height * 10; // Safety limit
            let iterations = 0;
            
            // Main WFC loop
            while (remainingCells > 0 && iterations < maxIterations) {
                iterations++;
                
                // Find cell with lowest entropy (minimum non-zero options)
                let minEntropy = Infinity;
                let minEntropyIndices = [];
                
                for (let i = 0; i < grid.length; i++) {
                    if (!grid[i].collapsed) {
                        const entropy = getEntropy(grid[i]);
                        
                        if (entropy === 0) {
                            // Contradiction found
                            debug(`Contradiction found at iteration ${iterations}, restarting generation`);
                            
                            // If we've tried too many times, relax constraints
                            if (iterations > maxIterations / 2) {
                                console.warn("Too many contradictions, using fallback strategy");
                                return this.generateFallback(width, height);
                            }
                            
                            // Restart generation
                            return this.generate(width, height);
                        }
                        
                        if (entropy < minEntropy) {
                            minEntropy = entropy;
                            minEntropyIndices = [i];
                        } else if (entropy === minEntropy) {
                            minEntropyIndices.push(i);
                        }
                    }
                }
                
                // Choose a random cell from those with minimum entropy
                const chosenIndex = minEntropyIndices[Math.floor(Math.random() * minEntropyIndices.length)];
                const chosenCell = grid[chosenIndex];
                
                // Observe: collapse this cell to a single state based on weights
                this.collapseCell(chosenCell);
                
                // Propagate constraints
                const cellX = chosenIndex % width;
                const cellY = Math.floor(chosenIndex / width);
                this.propagate(grid, width, height, cellX, cellY);
                
                remainingCells--;
                
                if (iterations % 100 === 0) {
                    debug(`WFC progress: ${width * height - remainingCells}/${width * height} cells collapsed`);
                }
            }
            
            if (iterations >= maxIterations) {
                console.warn("WFC generation reached max iterations, using fallback strategy");
                return this.generateFallback(width, height);
            }
            
            debug(`WFC generation completed in ${iterations} iterations`);
            
            // Convert the collapsed grid to a map
            return this.gridToMap(grid, width, height);
        }
        
        /**
         * Fallback map generation when WFC has too many contradictions
         * @param {number} width - Width of output map
         * @param {number} height - Height of output map
         * @return {Object} Map data
         */
        generateFallback(width, height) {
            debug("Using fallback generation strategy");
            
            // Create a simpler grid with random patterns
            const grid = Array(width * height).fill().map(() => {
                return {
                    collapsed: true,
                    options: [Math.floor(Math.random() * this.patterns.length)]
                };
            });
            
            // Convert to map
            return this.gridToMap(grid, width, height);
        }
        
        /**
         * Collapse a cell to a single state
         * @param {Object} cell - Cell to collapse
         */
        collapseCell(cell) {
            // Get total weight of all options
            let totalWeight = 0;
            for (const option of cell.options) {
                totalWeight += this.weights[option];
            }
            
            // Choose a random option based on weights
            let random = Math.random() * totalWeight;
            let chosenOption = cell.options[0];
            
            for (const option of cell.options) {
                random -= this.weights[option];
                if (random <= 0) {
                    chosenOption = option;
                    break;
                }
            }
            
            // Collapse cell to chosen option
            cell.options = [chosenOption];
            cell.collapsed = true;
        }
        
        /**
         * Propagate constraints through the grid
         * @param {Array} grid - WFC grid
         * @param {number} width - Grid width
         * @param {number} height - Grid height
         * @param {number} startX - X coordinate of the changed cell
         * @param {number} startY - Y coordinate of the changed cell
         */
        propagate(grid, width, height, startX, startY) {
            const stack = [{x: startX, y: startY}];
            
            while (stack.length > 0) {
                const {x, y} = stack.pop();
                const index = y * width + x;
                const cell = grid[index];
                
                if (!cell.collapsed && cell.options.length === 0) {
                    debug(`Contradiction at (${x}, ${y})`);
                    continue;
                }
                
                // Check neighbors and update their options
                const neighbors = [
                    {x: x, y: y - 1, direction: 'top'},
                    {x: x + 1, y: y, direction: 'right'},
                    {x: x, y: y + 1, direction: 'bottom'},
                    {x: x - 1, y: y, direction: 'left'}
                ];
                
                for (const neighbor of neighbors) {
                    // Skip if outside grid boundaries
                    if (neighbor.x < 0 || neighbor.x >= width || neighbor.y < 0 || neighbor.y >= height) {
                        continue;
                    }
                    
                    const neighborIndex = neighbor.y * width + neighbor.x;
                    const neighborCell = grid[neighborIndex];
                    
                    // Skip if already collapsed
                    if (neighborCell.collapsed) {
                        continue;
                    }
                    
                    const oldOptionsCount = neighborCell.options.length;
                    
                    // Update neighbor options based on constraints
                    this.updateOptions(cell, neighborCell, neighbor.direction);
                    
                    // If options were removed, add neighbor to stack for further propagation
                    if (neighborCell.options.length < oldOptionsCount) {
                        stack.push({x: neighbor.x, y: neighbor.y});
                    }
                }
            }
        }
        
        /**
         * Update a cell's options based on its neighbor
         * @param {Object} cell - Reference cell
         * @param {Object} neighborCell - Neighbor cell to update
         * @param {string} direction - Direction from cell to neighborCell
         */
        updateOptions(cell, neighborCell, direction) {
            const validOptions = new Set();
            
            // Get opposite direction for rule lookup
            const oppositeDirection = {
                'top': 'bottom',
                'right': 'left',
                'bottom': 'top',
                'left': 'right'
            }[direction];
            
            // For each possible pattern in the reference cell
            for (const option of cell.options) {
                // Get valid neighbor patterns in the given direction
                const validNeighbors = this.adjacencyRules[direction][option] || [];
                
                // Add valid neighbors to set
                for (const neighbor of validNeighbors) {
                    validOptions.add(neighbor);
                }
            }
            
            // Filter neighbor options to only those that are valid
            const newOptions = neighborCell.options.filter(option => validOptions.has(option));
            
            // If removing all options, keep at least one to avoid contradictions
            if (newOptions.length === 0 && neighborCell.options.length > 0) {
                debug(`Warning: Cell would have 0 options, keeping a random one`);
                newOptions.push(neighborCell.options[Math.floor(Math.random() * neighborCell.options.length)]);
            }
            
            neighborCell.options = newOptions;
        }
        
        /**
         * Convert collapsed grid to map data
         * @param {Array} grid - Collapsed WFC grid
         * @param {number} width - Grid width
         * @param {number} height - Grid height
         * @return {Object} Map data
         */
        gridToMap(grid, width, height) {
            const patternSize = this.patternSize;
            const mapWidth = width + patternSize - 1;
            const mapHeight = height + patternSize - 1;
            
            debug(`Creating map data (${mapWidth}x${mapHeight})`);
            
            // Create map data array (4 layers per tile)
            const mapData = Array(mapWidth * mapHeight * 4).fill(0);
            
            // First pass: Apply all patterns completely
            for (let y = 0; y < height; y++) {
                for (let x = 0; x < width; x++) {
                    const gridIndex = y * width + x;
                    
                    if (!grid[gridIndex] || !grid[gridIndex].options || grid[gridIndex].options.length === 0) {
                        console.error(`Invalid grid cell at (${x}, ${y})`);
                        continue;
                    }
                    
                    const patternIndex = grid[gridIndex].options[0];
                    const pattern = this.patterns[patternIndex];
                    
                    if (!pattern) {
                        console.error(`Invalid pattern index: ${patternIndex}`);
                        continue;
                    }
                    
                    // Copy the entire pattern
                    for (let py = 0; py < patternSize; py++) {
                        for (let px = 0; px < patternSize; px++) {
                            const patternPos = py * patternSize + px;
                            const mapX = x + px;
                            const mapY = y + py;
                            
                            // Skip if outside the map bounds
                            if (mapX >= mapWidth || mapY >= mapHeight) {
                                continue;
                            }
                            
                            const mapPos = (mapY * mapWidth + mapX) * 4;
                            
                            // Copy all 4 tile layers
                            for (let layer = 0; layer < 4; layer++) {
                                // Only overwrite if current tile is empty or we're on the bottom layer (which should never be empty)
                                if (mapData[mapPos + layer] === 0 || layer === 0) {
                                    mapData[mapPos + layer] = pattern[patternPos][layer];
                                }
                            }
                        }
                    }
                }
            }
            
            // Second pass: Fill in any remaining empty bottom tiles with a default tile
            // This ensures there are no black spaces in the final map
            let filledEmptyTiles = 0;
            
            // Find a default "floor" tile to use (the most common bottom layer tile in patterns)
            let defaultFloorTile = this.fallbackTileId;
            
            // If fallback tile ID is 0 (auto-detect), find the most common tile
            if (defaultFloorTile === 0) {
                const floorTileCounts = {};
                for (const pattern of this.patterns) {
                    for (const tileLayers of pattern) {
                        const bottomTile = tileLayers[0];
                        if (bottomTile !== 0) {
                            floorTileCounts[bottomTile] = (floorTileCounts[bottomTile] || 0) + 1;
                        }
                    }
                }
                
                // Get the most common tile ID
                let maxCount = 0;
                for (const [tileId, count] of Object.entries(floorTileCounts)) {
                    if (count > maxCount) {
                        maxCount = count;
                        defaultFloorTile = Number(tileId);
                    }
                }
                
                // If no valid floor tile found, use the first non-zero tile from the first pattern
                if (defaultFloorTile === 0 && this.patterns.length > 0) {
                    for (const tileLayers of this.patterns[0]) {
                        if (tileLayers[0] !== 0) {
                            defaultFloorTile = tileLayers[0];
                            break;
                        }
                    }
                }
            }
            
            debug(`Using default floor tile ID: ${defaultFloorTile}`);
            
            // Fill in any empty bottom-layer tiles
            for (let y = 0; y < mapHeight; y++) {
                for (let x = 0; x < mapWidth; x++) {
                    const mapPos = (y * mapWidth + x) * 4;
                    
                    // If bottom layer is empty (black), fill it with the default floor tile
                    if (mapData[mapPos] === 0) {
                        mapData[mapPos] = defaultFloorTile;
                        filledEmptyTiles++;
                    }
                }
            }
            
            if (filledEmptyTiles > 0) {
                debug(`Filled ${filledEmptyTiles} empty tiles with default floor tile`);
            }
            
            // Verify map data has non-zero tiles
            let nonZeroTiles = 0;
            for (let i = 0; i < mapData.length; i++) {
                if (mapData[i] !== 0) {
                    nonZeroTiles++;
                }
            }
            
            debug(`Map has ${nonZeroTiles} non-zero tile layers out of ${mapData.length} total`);
            
            if (nonZeroTiles === 0) {
                console.error("Generated map is completely empty! Check your pattern maps.");
            }
            
            return {
                width: mapWidth,
                height: mapHeight,
                data: mapData
            };
        }
    }
    
    /**
     * Load pattern maps and generate new map
     * @param {number} width - Width of output map
     * @param {number} height - Height of output map
     * @param {number} targetMapId - Map ID to save result
     * @param {Array} specificPatternMapIds - Optional specific pattern map IDs to use
     * @param {number} customFallbackTileId - Optional specific fallback tile ID (overrides plugin setting)
     */
    function generateMap(width, height, targetMapId, specificPatternMapIds, customFallbackTileId) {
        const patternMapIds = specificPatternMapIds || defaultPatternMapIds;
        const patternSize = defaultPatternSize;
        const wrapPatterns = defaultWrapPatterns;
        const useFallbackTileId = customFallbackTileId !== undefined ? customFallbackTileId : fallbackTileId;
        
        console.log(`Generating map (${width}x${height}) using patterns from maps ${patternMapIds.join(', ')}`);
        
        // Create WFC algorithm instance
        const wfc = new WaveFunctionCollapse(patternSize, wrapPatterns, useFallbackTileId);
        
        // Track if we successfully loaded any patterns
        let patternsLoaded = false;
        
        // Load and process each pattern map
        for (const mapId of patternMapIds) {
            // Make sure map info exists
            if (!$dataMapInfos[mapId]) {
                console.error(`Pattern map ${mapId} not found in $dataMapInfos!`);
                continue;
            }
            
            console.log(`Loading pattern map ${mapId}`);
            
            // Load map file
            const xhr = new XMLHttpRequest();
            const url = 'data/Map' + mapId.padZero(3) + '.json';
            xhr.open('GET', url, false);
            xhr.overrideMimeType('application/json');
            xhr.onload = function() {
                if (xhr.status < 400) {
                    try {
                        const mapData = JSON.parse(xhr.responseText);
                        
                        // Verify map data has valid tiles
                        if (!mapData.data || !mapData.width || !mapData.height) {
                            console.error(`Map ${mapId} has invalid data structure!`);
                            return;
                        }
                        
                        // Check if map has any non-zero tiles
                        let hasContent = false;
                        for (let i = 0; i < mapData.data.length; i++) {
                            if (mapData.data[i] !== 0) {
                                hasContent = true;
                                break;
                            }
                        }
                        
                        if (!hasContent) {
                            console.warn(`Map ${mapId} appears to be empty (all tiles are zero)!`);
                        }
                        
                        // Extract patterns from this map
                        wfc.extractPatternsFromMap(mapData);
                        patternsLoaded = true;
                    } catch (e) {
                        console.error(`Error processing map ${mapId}:`, e);
                    }
                } else {
                    console.error(`Failed to load pattern map ${mapId}: HTTP ${xhr.status}`);
                }
            };
            xhr.onerror = function() {
                console.error(`Network error loading pattern map ${mapId}`);
            };
            xhr.send();
        }
        
        // Check if we have patterns to work with
        if (!patternsLoaded || wfc.patterns.length === 0) {
            console.error("No valid patterns were loaded! Check your pattern maps.");
            
            // Notify user
            if (SceneManager._scene && SceneManager._scene._mapNameWindow) {
                SceneManager._scene._mapNameWindow.open();
                SceneManager._scene._mapNameWindow.drawBackground(0, 0, 400, 48);
                SceneManager._scene._mapNameWindow.drawText(`Error: No valid patterns loaded`, 0, 0, 400, 'center');
            }
            
            return;
        }
        
        // Generate new map using WFC
        const outputMap = wfc.generate(width, height);
        
        if (!outputMap) {
            console.error("Failed to generate map!");
            return;
        }
        
        // Save generated map to target map ID
        const xhr = new XMLHttpRequest();
        const url = 'data/Map' + targetMapId.padZero(3) + '.json';
        xhr.open('GET', url, false);
        xhr.overrideMimeType('application/json');
        xhr.onload = function() {
            if (xhr.status < 400) {
                try {
                    const mapData = JSON.parse(xhr.responseText);
                    
                    // Update map data with generated content
                    mapData.width = outputMap.width;
                    mapData.height = outputMap.height;
                    mapData.data = outputMap.data;
                    
                    // Save updated map
                    try {
                        // Check if we're in NW.js (desktop) environment where fs is available
                        if (typeof require === 'function' && typeof process !== 'undefined') {
                            const fs = require('fs');
                            fs.writeFileSync(url, JSON.stringify(mapData));
                            console.log(`Map saved to ${url}`);
                        } else {
                            // Browser environment - use StorageManager
                            if (StorageManager && StorageManager.saveToLocalFile) {
                                StorageManager.saveToLocalFile(url, JSON.stringify(mapData));
                                console.log(`Map saved to local storage: ${url}`);
                            } else {
                                console.error("Unable to save map: No file system access in this environment");
                            }
                        }
                        
                        // Notify user
                        if (SceneManager._scene && SceneManager._scene._mapNameWindow) {
                            SceneManager._scene._mapNameWindow.open();
                            SceneManager._scene._mapNameWindow.drawBackground(0, 0, 400, 48);
                            SceneManager._scene._mapNameWindow.drawText(`Generated Map (ID: ${targetMapId})`, 0, 0, 400, 'center');
                        }
                        
                        // Refresh current map if we generated the current map
                        if ($gameMap && $gameMap.mapId() === targetMapId) {
                            $gamePlayer.reserveTransfer(targetMapId, $gamePlayer.x, $gamePlayer.y, $gamePlayer.direction(), 0);
                        }
                    } catch (e) {
                        console.error("Error saving map:", e);
                    }
                } catch (e) {
                    console.error(`Error processing target map ${targetMapId}:`, e);
                }
            } else {
                console.error(`Failed to load target map ${targetMapId}: HTTP ${xhr.status}`);
            }
        };
        xhr.onerror = function() {
            console.error(`Network error loading target map ${targetMapId}`);
        };
        xhr.send();
    }
    
    // Add to debug menu if in development mode
    if (Utils.isOptionValid('test')) {
        /*
        const _Window_MenuCommand_addOriginalCommands = Window_MenuCommand.prototype.addOriginalCommands;
        Window_MenuCommand.prototype.addOriginalCommands = function() {
            _Window_MenuCommand_addOriginalCommands.call(this);
            this.addCommand("Generate WFC Map", 'wfc_generate');
        };
        
        // Add handler for the command
        const _Scene_Menu_createCommandWindow = Scene_Menu.prototype.createCommandWindow;
        Scene_Menu.prototype.createCommandWindow = function() {
            _Scene_Menu_createCommandWindow.call(this);
            this._commandWindow.setHandler('wfc_generate', this.commandWfcGenerate.bind(this));
        };*/
        
        // Implementation of the command
        Scene_Menu.prototype.commandWfcGenerate = function() {
            // Get current map ID for both target and pattern (can be overridden)
            const currentMapId = $gameMap.mapId();
            
            // Create a simple window to select options
            const width = Window_Base.prototype.windowWidth.call(this) / 2;
            const height = this.calcWindowHeight(5, true);
            const x = (Graphics.boxWidth - width) / 2;
            const y = (Graphics.boxHeight - height) / 2;
            
            // Store the original scene for returning
            const originalScene = this;
            
            // Create a window for showing options
            const optionsWindow = new Window_WfcOptions(new Rectangle(x, y, width, height));
            optionsWindow.setHandler('ok', function() {
                const options = optionsWindow.getOptions();
                
                // Call generate with the selected options
                if (options.useSpecificPattern) {
                    generateMap(options.width, options.height, options.targetMapId, [options.patternMapId]);
                } else {
                    generateMap(options.width, options.height, options.targetMapId);
                }
                
                // Close windows and return to game
                optionsWindow.close();
                originalScene.popScene();
                
                // Show notification
                window.skipLocalization = true;

                $gameMessage.add("WFC Map generation complete!");
                window.skipLocalization = false;

            });
            
            optionsWindow.setHandler('cancel', function() {
                optionsWindow.close();
                originalScene.popScene();
            });
            
            optionsWindow.open();
            this._wfcOptionsWindow = optionsWindow;
            this.addWindow(optionsWindow);
        };
        
        // Create a window class for WFC options
        function Window_WfcOptions() {
            this.initialize(...arguments);
        }
        
        Window_WfcOptions.prototype = Object.create(Window_Command.prototype);
        Window_WfcOptions.prototype.constructor = Window_WfcOptions;
        
        Window_WfcOptions.prototype.initialize = function(rect) {
            Window_Command.prototype.initialize.call(this, rect);
            this._width = 50;
            this._height = 50;
            this._targetMapId = $gameMap.mapId();
            this._patternMapId = $gameMap.mapId();
            this._fallbackTileId = fallbackTileId;
            this._useSpecificPattern = false;
            this.refresh();
            this.select(0);
            this.activate();
        };
        
        Window_WfcOptions.prototype.makeCommandList = function() {
            this.addCommand(`Width: ${this._width}`, 'width');
            this.addCommand(`Height: ${this._height}`, 'height');
            this.addCommand(`Target Map ID: ${this._targetMapId}`, 'target');
            this.addCommand(`Use Specific Pattern: ${this._useSpecificPattern ? 'Yes' : 'No'}`, 'pattern_toggle');
            
            if (this._useSpecificPattern) {
                this.addCommand(`Pattern Map ID: ${this._patternMapId}`, 'pattern_id');
            }
            
            this.addCommand(`Fallback Tile ID: ${this._fallbackTileId}`, 'fallback');
            this.addCommand("Generate Map", 'ok');
        };
        
        Window_WfcOptions.prototype.getOptions = function() {
            return {
                width: this._width,
                height: this._height,
                targetMapId: this._targetMapId,
                patternMapId: this._patternMapId,
                fallbackTileId: this._fallbackTileId,
                useSpecificPattern: this._useSpecificPattern
            };
        };
        
        Window_WfcOptions.prototype.processOk = function() {
            const index = this.index();
            const symbol = this.commandSymbol(index);
            
            if (symbol === 'width') {
                this.changeValue('width', 10);
            } else if (symbol === 'height') {
                this.changeValue('height', 10);
            } else if (symbol === 'target') {
                this.changeValue('target', 1);
            } else if (symbol === 'pattern_toggle') {
                this._useSpecificPattern = !this._useSpecificPattern;
                this.refresh();
            } else if (symbol === 'pattern_id') {
                this.changeValue('pattern', 1);
            } else if (symbol === 'fallback') {
                this.changeValue('fallback', 1);
            } else {
                Window_Command.prototype.processOk.call(this);
            }
        };
        
        Window_WfcOptions.prototype.changeValue = function(type, step) {
            if (type === 'width') {
                this._width = (this._width + step).clamp(10, 500);
            } else if (type === 'height') {
                this._height = (this._height + step).clamp(10, 500);
            } else if (type === 'target') {
                this._targetMapId = (this._targetMapId + step).clamp(1, 999);
            } else if (type === 'pattern') {
                this._patternMapId = (this._patternMapId + step).clamp(1, 999);
            } else if (type === 'fallback') {
                this._fallbackTileId = (this._fallbackTileId + step).clamp(0, 9999);
            }
            
            this.refresh();
        };
        
        Window_WfcOptions.prototype.cursorRight = function() {
            const index = this.index();
            const symbol = this.commandSymbol(index);
            
            if (symbol === 'width' || symbol === 'height' || 
                symbol === 'target' || symbol === 'pattern_id') {   
                this.processOk();
            }
        };
        
        Window_WfcOptions.prototype.cursorLeft = function() {
            const index = this.index();
            const symbol = this.commandSymbol(index);
            
            if (symbol === 'width') {
                this.changeValue('width', -10);
            } else if (symbol === 'height') {
                this.changeValue('height', -10);
            } else if (symbol === 'target') {
                this.changeValue('target', -1);
            } else if (symbol === 'pattern_id') {
                this.changeValue('pattern', -1);
            } else if (symbol === 'fallback') {
                this.changeValue('fallback', -1);
            }
        };
    }
})();
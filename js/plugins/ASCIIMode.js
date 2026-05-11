//=============================================================================
// ASCII_RenderMode.js
//=============================================================================

/*:
 * @target MZ
 * @plugindesc ASCII Render Mode v1.0.0
 * @author Omni-Lex
 * @url https://nocoldiz.itch.io/hypernet-explorer
 * @help ASCII_RenderMode.js
 * 
 * @param enableKey
 * @text Toggle Key
 * @desc Key to toggle ASCII mode (default: F9)
 * @type string
 * @default F9
 * 
 * @param fontSize
 * @text Font Size
 * @desc Font size for ASCII characters
 * @type number
 * @default 24
 * 
 * @param fontFamily
 * @text Font Family
 * @desc Font family for ASCII rendering
 * @type string
 * @default monospace
 * 
 * @param backgroundColor
 * @text Background Color
 * @desc Background color for ASCII mode
 * @type string
 * @default #000000
 * 
 * @param textColor
 * @text Text Color
 * @desc Default text color for ASCII characters
 * @type string
 * @default #FFFFFF
 * 
 * @param eventColor
 * @text Event Color
 * @desc Color for event characters
 * @type string
 * @default #FFFF00
 * 
 * @param playerColor
 * @text Player Color
 * @desc Color for player character
 * @type string
 * @default #00FF00
 * 
 * This plugin adds an ASCII render mode inspired by Dwarf Fortress.
 * Press the toggle key (default F9) to switch between normal and ASCII mode.
 * 
 * Passable tiles show as '.' (floor)
 * Non-passable tiles show as '#' (wall)
 * Events show as their first letter
 * Player shows as '@'
 * 
 * Events with null/empty images are hidden from ASCII display.
 * 
 * Customize event and terrain translations in the plugin code.
 */

(() => {
    'use strict';

    const pluginName = 'ASCII_RenderMode';
    const parameters = PluginManager.parameters(pluginName);

    const TOGGLE_KEY = parameters['enableKey'] || 'F9';
    const FONT_SIZE = parseInt(parameters['fontSize']) || 24;
    const FONT_FAMILY = parameters['fontFamily'] || 'monospace';
    const BG_COLOR = parameters['backgroundColor'] || '#000000';
    const TEXT_COLOR = parameters['textColor'] || '#FFFFFF';
    const EVENT_COLOR = parameters['eventColor'] || '#FFFF00';
    const PLAYER_COLOR = parameters['playerColor'] || '#00FF00';

    // Translation dictionaries
    const EVENT_TRANSLATIONS = {
        'Chest': '?',
        'Door': '+',
        'Stairs': '<',
        'Tree': 'T',
        'Rock': '*',
        'Water': '~',
        'Fire': '^',
        'Merchant': '$',
        'Guard': 'G',
        'Villager': 'v',
        'Monster': 'M',
        'Boss': 'B',
        'Treasure': '&',
        'Switch': '%',
        'Sign': '!'
    };

    const TERRAIN_TAG_TRANSLATIONS = {
        1: '.',  // Pavement
        2: ',',  // Dirt
        3: '~',  // Water
        4: '█',  // Wall
        5: '.',  // Foliage
        6: '=',  // Metal
        7: '^'   // Roof
    };

    let asciiMode = false;
    let asciiCanvas = null;
    let asciiContext = null;
    let waterFlowDirection = 'S';
    let dialogueLines = [];
    let tilesetDb = null;
    let spritesAssociationDb = null;

    function loadTilesetDb() {
        if (Utils.isNwjs()) {
            const fs = require('fs');
            const path = require('path');
            const filepath = path.join(process.cwd(), 'js', 'db', 'Sprites', 'ASCIITileset.json');
            if (fs.existsSync(filepath)) {
                try {
                    tilesetDb = JSON.parse(fs.readFileSync(filepath, 'utf8'));
                    console.log('ASCII Tileset DB loaded successfully');
                } catch (e) {
                    console.error('Failed to parse ASCII Tileset DB:', e);
                }
            }
        } else {
            fetch('js/db/Sprites/ASCIITileset.json')
                .then(response => response.json())
                .then(data => {
                    tilesetDb = data;
                    console.log('ASCII Tileset DB loaded successfully via fetch');
                })
                .catch(e => console.error('Failed to load ASCII Tileset DB via fetch:', e));
        }
    }

    function loadSpritesAssociationDb() {
        if (Utils.isNwjs()) {
            const fs = require('fs');
            const path = require('path');
            const filepath = path.join(process.cwd(), 'js', 'db', 'Sprites', 'AsciiSpritesAssociation.json');
            if (fs.existsSync(filepath)) {
                try {
                    spritesAssociationDb = JSON.parse(fs.readFileSync(filepath, 'utf8'));
                    console.log('ASCII Sprites Association DB loaded successfully');
                } catch (e) {
                    console.error('Failed to parse ASCII Sprites Association DB:', e);
                }
            }
        } else {
            fetch('js/db/Sprites/AsciiSpritesAssociation.json')
                .then(response => response.json())
                .then(data => {
                    spritesAssociationDb = data;
                    console.log('ASCII Sprites Association DB loaded successfully via fetch');
                })
                .catch(e => console.error('Failed to load ASCII Sprites Association DB via fetch:', e));
        }
    }

    function getColorHex(colorName) {
        const colors = {
            "golden": "#FFD700",
            "dark brown": "#5C4033",
            "purple": "#800080",
            "green": "#008000",
            "bright yellow": "#FFFF00",
            "light brown": "#D2B48C",
            "red": "#FF0000",
            "grey": "#808080"
        };
        return colors[colorName] || colorName;
    }

    loadTilesetDb();
    loadSpritesAssociationDb();
    let choiceLines = [];
    let showDialogue = false;
    let showChoices = false;
    let selectedChoiceIndex = -1;

    let showAsciiMenu = false;
    let menuCommands = [];
    let selectedMenuIndex = -1;

    let CANVAS_WIDTH = 816;
    let CANVAS_HEIGHT = 624;

    let currentFontSize = FONT_SIZE;
    let canvasOffsetX = 0;
    let canvasOffsetY = 0;
    let gridPixelWidth = 0;
    let gridPixelHeight = 0;

    function updateFontSize() {
        const baseWidth = Graphics.width || 816;
        const baseHeight = Graphics.height || 624;
        const gridWidth = Math.floor(baseWidth / FONT_SIZE);
        const gridHeight = Math.floor(baseHeight / FONT_SIZE);

        const dynamicFontSizeX = CANVAS_WIDTH / gridWidth;
        const dynamicFontSizeY = CANVAS_HEIGHT / gridHeight;
        currentFontSize = Math.min(dynamicFontSizeX, dynamicFontSizeY);

        gridPixelWidth = gridWidth * currentFontSize;
        gridPixelHeight = gridHeight * currentFontSize;
        canvasOffsetX = (CANVAS_WIDTH - gridPixelWidth) / 2;
        canvasOffsetY = (CANVAS_HEIGHT - gridPixelHeight) / 2;

        if (asciiContext) {
            asciiContext.font = `${currentFontSize}px ${FONT_FAMILY}`;
            asciiContext.textAlign = 'center';
            asciiContext.textBaseline = 'middle';
        }
    }

    // Initialize ASCII canvas
    function createAsciiCanvas() {
        if (asciiCanvas) return;

        CANVAS_WIDTH = window.innerWidth;
        CANVAS_HEIGHT = window.innerHeight;

        asciiCanvas = document.createElement('canvas');
        asciiCanvas.id = 'asciiCanvas';
        asciiCanvas.style.position = 'absolute';
        asciiCanvas.style.top = '0';
        asciiCanvas.style.left = '0';
        asciiCanvas.style.width = '100vw';
        asciiCanvas.style.height = '100vh';
        asciiCanvas.style.zIndex = '1000';
        asciiCanvas.style.display = 'none';
        asciiCanvas.style.imageRendering = 'pixelated';

        document.body.appendChild(asciiCanvas);
        asciiContext = asciiCanvas.getContext('2d');

        // Set canvas size to window resolution
        asciiCanvas.width = CANVAS_WIDTH;
        asciiCanvas.height = CANVAS_HEIGHT;
        asciiContext.imageSmoothingEnabled = false;

        updateFontSize();
    }

    // Toggle ASCII mode
    function toggleAsciiMode() {
        ConfigManager.asciiModeEnabled = !ConfigManager.asciiModeEnabled;
    }

    // Check if event has a valid image
    function eventHasImage(event) {
        if (!event || !event.event()) return false;

        const eventData = event.event();

        // Check if event has any pages with graphics
        if (eventData.pages && eventData.pages.length > 0) {
            for (let page of eventData.pages) {
                if (page.image && page.image.characterName && page.image.characterName !== '') {
                    return true;
                }
            }
        }

        return false;
    }

    // Get character for tile based on passability and terrain
    function getTileCharacter(x, y) {
        if (!$gameMap) return '#';

        const terrainTag = $gameMap.terrainTag(x, y);
        const regionId = $gameMap.regionId(x, y);

        // Specific configuration for world map 315
        if ($gameMap.mapId() === 315) {
            switch (terrainTag) {
                case 1: return '=';  // Road
                case 2: return '.';  // Grass/Dirt
                case 3: return getWaterAnimatedCharacter(x, y);
                case 4: return '^';  // Mountain
                case 5: return 'T';  // Forest
                case 6: return 'C';  // City
                case 7: return '*';  // Ice
                default: return '.';
            }
        }

        // Roof in interior maps should be blank (Tag 7)
        if (terrainTag === 7) {
            if ($dataMap && $dataMap.note && $dataMap.note.includes("<Interior>")) {
                return ' ';
            }
        }

        // Terrain ID 4 handling
        if (terrainTag === 4) {
            let activeTileId = 0;
            for (let l = 3; l >= 0; l--) {
                const id = $gameMap.tileId(x, y, l);
                if (id > 0) {
                    activeTileId = id;
                    break;
                }
            }

            const isInterior = $dataMap && $dataMap.note && $dataMap.note.includes("<Interior>");

            if (activeTileId < 2048) {
                // Sheet B, C, D, E
                return 'T';
            } else {
                // Sheet A
                if (isInterior) {
                    return ' '; // No symbol
                } else {
                    return '█'; // Filled block
                }
            }
        }

        // Ladder and Counter checks
        if ($gameMap.isLadder(x, y)) {
            return 'H';
        }
        if ($gameMap.isCounter(x, y)) {
            return 'x';
        }

        const isPassable = $gameMap.isPassable(x, y, 2) || $gameMap.isPassable(x, y, 4) ||
            $gameMap.isPassable(x, y, 6) || $gameMap.isPassable(x, y, 8);

        // Region 4 override (Full block for Sheet A, T otherwise)
        if (regionId === 4) {
            let activeTileId = 0;
            for (let l = 3; l >= 0; l--) {
                const id = $gameMap.tileId(x, y, l);
                if (id > 0) {
                    activeTileId = id;
                    break;
                }
            }
            if (activeTileId >= 2048) {
                return '█';
            } else {
                return 'X';
            }
        }
        // Foliage variations (Tag 5 or Region 5)
        if (terrainTag === 5 || regionId === 5) {
            if (!isPassable) {
                const variations = ['T', 'Ť', 'Ṱ', 'Ṭ'];
                const index = Math.abs(x * 733 + y * 941) % variations.length;
                return variations[index];
            } else {
                const variations = ['"', "'", '`', ';',];
                const index = Math.abs(x * 733 + y * 941) % variations.length;
                return variations[index];
            }
        }

        // Grass/Dirt variations (Tag 2) - Dwarf Fortress style
        if (terrainTag === 2) {
            if (isPassable) {
                const variations = ['.', ',', "'", '"'];
                const index = Math.abs(x * 733 + y * 941) % variations.length;
                return variations[index];
            }
        }

        // Check terrain tag translations first
        if (TERRAIN_TAG_TRANSLATIONS[terrainTag]) {
            const char = TERRAIN_TAG_TRANSLATIONS[terrainTag];
            if (char === '~') {
                return getWaterAnimatedCharacter(x, y);
            }
            return char;
        }

        // Fall back to passability
        if (isPassable) {
            return '.';  // Passable floor
        } else {
            return '#';  // Non-passable wall
        }
    }

    // Get animated character for water
    function getWaterAnimatedCharacter(x, y) {
        const sequence = ['~', '-', ' ', '-'];
        const speed = 10; // Frames per step
        const frame = Math.floor(Graphics.frameCount / speed);
        const len = sequence.length;

        let index = 0;
        switch (waterFlowDirection) {
            case 'S':
                index = ((y + frame) % len + len) % len;
                break;
            case 'N':
                index = ((y - frame) % len + len) % len;
                break;
            case 'E':
                index = ((x + frame) % len + len) % len;
                break;
            case 'W':
                index = ((x - frame) % len + len) % len;
                break;
            default:
                index = ((y + frame) % len + len) % len;
        }
        return sequence[index];
    }

    // Get character for event
    function getEventCharacter(event) {
        if (!event || !event.event()) return null;

        // Skip events with no image
        if (!eventHasImage(event)) return null;

        const eventName = event.event().name;
        if (eventName === 'Sign') {
            return '?';
        }
        if (eventName.startsWith('Tutorial')) {
            return '?';
        }
        const characterName = event.characterName();
        if (characterName && spritesAssociationDb && spritesAssociationDb[characterName]) {
            const association = spritesAssociationDb[characterName];
            if (association.chars && association.chars.length > 0) {
                return association.chars[0];
            }
        }

        // Check translation dictionary first
        if (EVENT_TRANSLATIONS[eventName]) {
            return EVENT_TRANSLATIONS[eventName];
        }

        // Fall back to first letter of event name
        return eventName.charAt(0).toUpperCase() || 'E';
    }

    // Render dialogue text in ASCII mode
    function renderDialogue() {
        if (!asciiContext || (!showDialogue && !showChoices)) return;

        const dialogueFontSize = currentFontSize * 1.5; // Make text larger
        const lineHeight = dialogueFontSize + 4;
        let totalLines = dialogueLines.length + choiceLines.length;
        if (totalLines === 0) return;

        let boxHeightLimit = gridPixelHeight / 3;
        if (totalLines * lineHeight > boxHeightLimit) {
            boxHeightLimit = gridPixelHeight / 1.5; // Expand up to 2/3 of screen if needed for many choices
        }
        const maxLines = Math.floor(boxHeightLimit / lineHeight);
        const boxHeight = Math.min(totalLines, maxLines) * lineHeight + 20;
        let startY = CANVAS_HEIGHT - boxHeight - 10;
        if (SceneManager._scene instanceof Scene_Battle) {
            startY = 10; // Draw at top in battle
        }
        const padding = 15; // More padding for larger text

        // Inset from left and right margins (20% of grid width)
        const margin = Math.floor(gridPixelWidth * 0.2);
        const boxX = canvasOffsetX + margin;
        const boxWidth = gridPixelWidth - (margin * 2);

        // Draw dialogue background
        asciiContext.fillStyle = 'rgba(0, 0, 0, 0.8)';
        asciiContext.fillRect(boxX, startY, boxWidth, boxHeight);

        // Draw dialogue border
        asciiContext.strokeStyle = TEXT_COLOR;
        asciiContext.lineWidth = 2;
        asciiContext.strokeRect(boxX, startY, boxWidth, boxHeight);

        // Draw dialogue text
        asciiContext.textAlign = 'left';
        asciiContext.textBaseline = 'top';
        asciiContext.font = `${dialogueFontSize}px ${FONT_FAMILY}`; // Set larger font

        let currentLine = 0;

        // Draw dialogue lines
        if (showDialogue && dialogueLines.length > 0) {
            asciiContext.fillStyle = TEXT_COLOR;
            for (let i = 0; i < dialogueLines.length && currentLine < maxLines; i++) {
                const line = dialogueLines[i];
                const y = startY + padding + (currentLine * lineHeight);
                asciiContext.fillText(line, boxX + padding, y);
                currentLine++;
            }
        }

        // Draw choice lines
        if (showChoices && choiceLines.length > 0) {
            // Add some spacing between dialogue and choices
            if (dialogueLines.length > 0) {
                currentLine += 0.5;
            }

            for (let i = 0; i < choiceLines.length && currentLine < maxLines; i++) {
                const choice = choiceLines[i];
                const y = startY + padding + (currentLine * lineHeight);

                // Highlight selected choice in red, others in yellow
                if (i === selectedChoiceIndex) {
                    asciiContext.fillStyle = '#FF0000'; // Red for selected choice
                } else {
                    asciiContext.fillStyle = '#FFFF00'; // Yellow for unselected choices
                }

                asciiContext.fillText(`> ${choice}`, boxX + padding, y);
                currentLine++;
            }
        }

        // Reset text alignment for map rendering
        asciiContext.textAlign = 'center';
        asciiContext.textBaseline = 'middle';
    }

    function renderAsciiMenu() {
        if (!asciiContext || !showAsciiMenu) return;

        const menuFontSize = currentFontSize * 1.5;
        const lineHeight = menuFontSize + 4;
        const totalItems = menuCommands.length;
        if (totalItems === 0) return;

        const numCols = 2;
        const numRows = Math.ceil(totalItems / numCols);
        
        const colWidth = 200; // Width of each column
        const padding = 20;
        const boxWidth = colWidth * numCols + padding * 2;
        const boxHeight = numRows * lineHeight + 40;
        
        const startX = (CANVAS_WIDTH - boxWidth) / 2;
        const startY = (CANVAS_HEIGHT - boxHeight) / 2;

        // Draw background
        asciiContext.fillStyle = 'rgba(0, 0, 0, 0.9)';
        asciiContext.fillRect(startX, startY, boxWidth, boxHeight);

        // Draw border
        asciiContext.strokeStyle = TEXT_COLOR;
        asciiContext.lineWidth = 2;
        asciiContext.strokeRect(startX, startY, boxWidth, boxHeight);

        // Draw commands
        asciiContext.textAlign = 'left';
        asciiContext.textBaseline = 'top';
        asciiContext.font = `${menuFontSize}px ${FONT_FAMILY}`;

        for (let i = 0; i < totalItems; i++) {
            const cmd = menuCommands[i];
            const row = Math.floor(i / numCols);
            const col = i % numCols;
            
            const x = startX + padding + col * colWidth;
            const y = startY + padding + row * lineHeight;

            if (i === selectedMenuIndex) {
                asciiContext.fillStyle = '#FF0000'; // Red for selected
                asciiContext.fillText(`> ${cmd.name}`, x, y);
            } else {
                if (cmd.enabled) {
                    asciiContext.fillStyle = '#FFFF00'; // Yellow for enabled
                } else {
                    asciiContext.fillStyle = '#808080'; // Gray for disabled
                }
                asciiContext.fillText(`  ${cmd.name}`, x, y);
            }
        }

        // Reset text alignment for map rendering
        asciiContext.textAlign = 'center';
        asciiContext.textBaseline = 'middle';
    }

    function getEnemyLevel(note) {
        const m = note.match(/<Level:\s*(\d+)>/i);
        return m ? parseInt(m[1], 10) : 0;
    }

    function getMedianLevel(party) {
        const levels = party.map(m => m.level).sort((a, b) => a - b);
        const mid = Math.floor(levels.length / 2);
        return levels.length % 2
            ? levels[mid]
            : (levels[mid - 1] + levels[mid]) / 2;
    }

    function getEnemyLevelFromEvent(event) {
        if (!event._fixedTroopId || event._fixedTroopId === 0) {
            return 0;
        }
        const troop = $dataTroops[event._fixedTroopId];
        if (!troop || !troop.members.length) {
            return 0;
        }
        let maxLevel = 0;
        for (const member of troop.members) {
            const enemyData = $dataEnemies[member.enemyId];
            if (enemyData && enemyData.note) {
                const level = getEnemyLevel(enemyData.note);
                if (level > maxLevel) {
                    maxLevel = level;
                }
            }
        }
        return maxLevel;
    }

    function getCharacterColor(type, char, x, y, event) {
        switch (type) {
            case 'player':
                return PLAYER_COLOR;
            case 'event':
                if (event) {
                    const characterName = event.characterName();
                    if (characterName && spritesAssociationDb && spritesAssociationDb[characterName]) {
                        const association = spritesAssociationDb[characterName];
                        if (association.color) {
                            return getColorHex(association.color);
                        }
                    }

                    if (event.event().name === 'Enemy') {
                        const enemyLevel = getEnemyLevelFromEvent(event);
                        const party = $gameParty.members();
                        const medianLevel = party.length > 0 ? getMedianLevel(party) : 1;

                        if (enemyLevel > medianLevel) {
                            return '#8B0000'; // Deeper red
                        } else {
                            return '#FF0000'; // Red
                        }
                    }
                }
                return EVENT_COLOR;
            case 'terrain':
                if (x !== undefined && y !== undefined) {
                    const tag = $gameMap.terrainTag(x, y);
                    const region = $gameMap.regionId(x, y);

                    // Try to get color from tileset DB first
                    if (tilesetDb && $dataTilesets && $dataMap) {
                        let activeTileId = 0;
                        for (let l = 3; l >= 0; l--) {
                            const id = $gameMap.tileId(x, y, l);
                            if (id > 0) {
                                activeTileId = id;
                                break;
                            }
                        }

                        if (activeTileId > 0 && activeTileId < 1024) {
                            const slot = Math.floor(activeTileId / 256); // 0=B, 1=C, 2=D, 3=E
                            const index = activeTileId % 256;

                            const tileset = $dataTilesets[$dataMap.tilesetId];
                            if (tileset) {
                                const filename = tileset.tilesetNames[slot + 5]; // B is at index 5
                                if (filename && tilesetDb[filename + '.png']) {
                                    const color = tilesetDb[filename + '.png'][String(index)];
                                    if (color) return color;
                                }
                            }
                        } else if (activeTileId >= 2048) {
                            // Autotile (A1-A4)
                            const kind = Math.floor((activeTileId - 2048) / 48);
                            let slot = -1;
                            let indexInFile = 0;

                            // Check if it's A2 (most common for grass/dirt)
                            if (kind >= 16 && kind < 48) {
                                slot = 1; // A2
                                const a2Kind = kind - 16;
                                const row = Math.floor(a2Kind / 8) * 3;
                                const col = (a2Kind % 8) * 2;
                                indexInFile = row * 16 + col;
                            }

                            if (slot >= 0) {
                                const tileset = $dataTilesets[$dataMap.tilesetId];
                                if (tileset) {
                                    const filename = tileset.tilesetNames[slot];
                                    if (filename && tilesetDb[filename + '.png']) {
                                        const color = tilesetDb[filename + '.png'][String(indexInFile)];
                                        if (color) return color;
                                    }
                                }
                            }
                        }
                    }

                    // Region 4 (Wall) color variations based on tile ID
                    if (region === 4) {
                        const tileId = $gameMap.tileId(x, y, 0) + $gameMap.tileId(x, y, 1) + $gameMap.tileId(x, y, 2) + $gameMap.tileId(x, y, 3);
                        const wallColors = [
                            '#696969', // Dim Gray
                            '#5C4033', // Dark Brown
                            '#3B5323', // Forest Green
                            '#4A0E4E', // Dark Purple
                            '#1C3144', // Prussian Blue
                            '#8B0000', // Dark Red
                            '#A0522D', // Sienna
                            '#2F4F4F'  // Dark Slate Gray
                        ];
                        return wallColors[Math.abs(tileId) % wallColors.length];
                    }

                    // Specific configuration for world map 315
                    if ($gameMap.mapId() === 315) {
                        switch (tag) {
                            case 1: return '#808080';  // Road - gray
                            case 2: return '#228B22';  // Grass/Dirt - green
                            case 3: return '#0066FF';  // Water - blue
                            case 4: return '#8B4513';  // Mountain - brown
                            case 5: return '#006400';  // Forest - dark green
                            case 6: return '#FFFF00';  // City - yellow
                            case 7: return '#ADD8E6';  // Ice - light blue
                            default: return TEXT_COLOR;
                        }
                    }

                    if (TERRAIN_TAG_TRANSLATIONS[tag] === '~') {
                        return '#0066FF';  // Water - blue
                    }

                    switch (tag) {
                        case 1: return '#808080';  // Pavement
                        case 2: return '#8B4513';  // Dirt
                        case 3: return '#0066FF';  // Water
                        case 4: return '#696969';  // Wall
                        case 6: return '#C0C0C0';  // Metal
                        case 7: return '#B22222';  // Roof
                    }
                }
                // Fallback to character-based color
                switch (char) {
                    case '~': return '#0066FF';  // Water - blue
                    case '^': return '#B22222';  // Roof - reddish/brown
                    case 'T': return '#228B22';  // Foliage - green
                    case '█': return '#696969';  // Wall - gray
                    case '.': return '#808080';  // Pavement - gray
                    case ',': return '#8B4513';  // Dirt - brown
                    case '=': return '#C0C0C0';  // Metal - silver
                    case 'H': return '#D2B48C';  // Ladder - light brown
                    case 'x': return '#DEB887';  // Counter - burlywood
                    default: return TEXT_COLOR;
                }
            default:
                return TEXT_COLOR;
        }
    }

    // Render the ASCII map
    function renderAsciiMap() {
        if (!asciiContext || !$gameMap || !$gamePlayer) return;

        // Clear canvas
        asciiContext.clearRect(0, 0, asciiCanvas.width, asciiCanvas.height);

        if (asciiMode === 2) {
            // Menu only mode
            if (!showAsciiMenu && !showChoices && !showDialogue) {
                return; // Nothing to draw
            }
            // Skip map rendering, go straight to dialogue and menu!
            asciiContext.font = `${currentFontSize}px ${FONT_FAMILY}`;
            renderDialogue();
            renderAsciiMenu();
            return;
        }

        // Normal ASCII mode (ON)
        asciiContext.fillStyle = '#000000'; // Black background
        asciiContext.fillRect(0, 0, asciiCanvas.width, asciiCanvas.height);

        // Update water flow direction from map note
        if ($dataMap && $dataMap.note) {
            const match = $dataMap.note.match(/<WaterFlowTo:\s*([NSEW])>/i);
            waterFlowDirection = match ? match[1].toUpperCase() : 'S';
        } else {
            waterFlowDirection = 'S';
        }

        const mapWidth = $gameMap.width();
        const mapHeight = $gameMap.height();

        // Handle Zoom
        const zoom = $gameScreen ? $gameScreen.zoomScale() : 1.0;
        const activeFontSize = currentFontSize * zoom;
        asciiContext.font = `${activeFontSize}px ${FONT_FAMILY}`;

        const viewWidth = CANVAS_WIDTH / activeFontSize;
        const viewHeight = CANVAS_HEIGHT / activeFontSize;

        // Calculate the map center in tiles based on normal displayPos (snapped for snappy movement)
        const mapCenterX = Math.round($gameMap.displayX()) + (Graphics.width / $gameMap.tileWidth()) / 2;
        const mapCenterY = Math.round($gameMap.displayY()) + (Graphics.height / $gameMap.tileHeight()) / 2;

        // Calculate startX and startY to center the view around that point
        const startX = mapCenterX - viewWidth / 2;
        const startY = mapCenterY - viewHeight / 2;

        const endX = startX + viewWidth;
        const endY = startY + viewHeight;

        const loopStartX = Math.floor(startX);
        const loopStartY = Math.floor(startY);
        const loopEndX = Math.ceil(endX);
        const loopEndY = Math.ceil(endY);

        let mapOffsetX = 0;
        let mapOffsetY = 0;
        if (mapWidth < viewWidth) {
            mapOffsetX = Math.floor((viewWidth - mapWidth) / 2) * activeFontSize;
        }
        if (mapHeight < viewHeight) {
            mapOffsetY = Math.floor((viewHeight - mapHeight) / 2) * activeFontSize;
        }

        const totalOffsetX = canvasOffsetX + mapOffsetX;
        const totalOffsetY = canvasOffsetY + mapOffsetY;

        // Render tiles
        for (let mapY = loopStartY; mapY < loopEndY; mapY++) {
            for (let mapX = loopStartX; mapX < loopEndX; mapX++) {
                const screenX = Math.round(totalOffsetX + (mapX - startX) * activeFontSize + activeFontSize / 2);
                const screenY = Math.round(totalOffsetY + (mapY - startY) * activeFontSize + activeFontSize / 2);

                // Get fog state
                const fogState = $gameMap.fogOfWarState ? $gameMap.fogOfWarState(mapX, mapY) : 2;

                if (fogState === 0) {
                    continue; // Skip rendering never seen tiles
                }

                if (fogState === 1) {
                    asciiContext.globalAlpha = 0.3; // Dim previously seen tiles
                } else {
                    asciiContext.globalAlpha = 1.0;
                }

                // Get base tile character
                const tileChar = getTileCharacter(mapX, mapY);
                const regionId = $gameMap.regionId(mapX, mapY);

                if (regionId === 4 && tileChar === '█') {
                    asciiContext.fillStyle = getCharacterColor('terrain', tileChar, mapX, mapY);
                    const tileX = Math.floor(totalOffsetX + (mapX - startX) * activeFontSize);
                    const tileY = Math.floor(totalOffsetY + (mapY - startY) * activeFontSize);
                    const tileSize = Math.ceil(activeFontSize);
                    asciiContext.fillRect(tileX, tileY, tileSize, tileSize);
                } else {
                    asciiContext.fillStyle = getCharacterColor('terrain', tileChar, mapX, mapY);
                    asciiContext.fillText(tileChar, screenX, screenY);
                }
            }
        }

        // Reset alpha before rendering events
        asciiContext.globalAlpha = 1.0;

        // Render events (only those with images)
        $gameMap.events().forEach(event => {
            if (!event || event._erased) return;

            // Hide events starting with EV
            const eventName = event.event().name;
            if (eventName && eventName.startsWith('EV')) return;

            // Fog of War check
            if ($gameMap.fogOfWarState && event._fogOfWarVisible === false) return;

            // Use snapped coordinates for snappy movement
            const eventX = Math.round(event._realX);
            const eventY = Math.round(event._realY);

            // Check if event is in view
            if (eventX >= startX && eventX < endX && eventY >= startY && eventY < endY) {
                const screenX = Math.round(totalOffsetX + (eventX - startX) * activeFontSize + activeFontSize / 2);
                const screenY = Math.round(totalOffsetY + (eventY - startY) * activeFontSize + activeFontSize / 2);

                const eventChar = getEventCharacter(event);
                if (eventChar) {  // This will be null for events without images
                    asciiContext.fillStyle = getCharacterColor('event', eventChar, undefined, undefined, event);
                    asciiContext.fillText(eventChar, screenX, screenY);
                }
            }
        });

        // Render player (snapped)
        const playerX = Math.round($gamePlayer._realX);
        const playerY = Math.round($gamePlayer._realY);
        if (playerX >= startX && playerX < endX && playerY >= startY && playerY < endY) {
            const screenX = Math.round(totalOffsetX + (playerX - startX) * activeFontSize + activeFontSize / 2);
            const screenY = Math.round(totalOffsetY + (playerY - startY) * activeFontSize + activeFontSize / 2);

            asciiContext.fillStyle = getCharacterColor('player', '@');
            asciiContext.fillText('@', screenX, screenY);
        }

        // Reset font for dialogue
        asciiContext.font = `${currentFontSize}px ${FONT_FAMILY}`;

        // Render dialogue if active
        renderDialogue();
        renderAsciiMenu();
    }

    // Hook into message system to capture dialogue
    const _Window_Message_startMessage = Window_Message.prototype.startMessage;
    Window_Message.prototype.startMessage = function () {
        _Window_Message_startMessage.call(this);

        if (asciiMode) {
            this.visible = false; // Hide normal message window
            
            // Show canvas in battle if needed
            if (SceneManager._scene instanceof Scene_Battle && asciiCanvas) {
                asciiCanvas.style.display = 'block';
            }
            
            // Extract text from the current message
            const text = $gameMessage.allText();
            if (text) {
                // Process text to remove control characters and split into lines
                const cleanText = text.replace(/\\[A-Z]+\[\d*\]/g, ''); // Remove control codes
                const lines = cleanText.split('\n').filter(line => line.trim() !== '');

                // Word wrap long lines to fit screen
                dialogueLines = [];
                const margin = Math.floor(gridPixelWidth * 0.2);
                const boxWidth = gridPixelWidth - (margin * 2);
                const dialogueFontSize = currentFontSize * 1.5;
                const maxCharsPerLine = Math.floor((boxWidth - 30) / (dialogueFontSize * 0.6));

                lines.forEach(line => {
                    if (line.length <= maxCharsPerLine) {
                        dialogueLines.push(line);
                    } else {
                        // Simple word wrapping
                        const words = line.split(' ');
                        let currentLine = '';

                        words.forEach(word => {
                            if ((currentLine + ' ' + word).length <= maxCharsPerLine) {
                                currentLine += (currentLine ? ' ' : '') + word;
                            } else {
                                if (currentLine) dialogueLines.push(currentLine);
                                currentLine = word;
                            }
                        });

                        if (currentLine) dialogueLines.push(currentLine);
                    }
                });

                showDialogue = true;
            }
        }
    };

    const _Window_Message_terminateMessage = Window_Message.prototype.terminateMessage;
    Window_Message.prototype.terminateMessage = function () {
        _Window_Message_terminateMessage.call(this);

        if (asciiMode) {
            this.visible = true; // Restore visibility
            showDialogue = false;
            dialogueLines = [];
            
            // Hide canvas in battle if it was shown for dialogue
            if (SceneManager._scene instanceof Scene_Battle && asciiCanvas) {
                asciiCanvas.style.display = 'none';
            }
        }
    };

    // Hook into choice system to capture dialogue choices
    const _Window_ChoiceList_start = Window_ChoiceList.prototype.start;
    Window_ChoiceList.prototype.start = function () {
        _Window_ChoiceList_start.call(this);

        if (asciiMode) {
            this.visible = false; // Hide normal choice window
            
            // Show canvas in battle if needed
            if (SceneManager._scene instanceof Scene_Battle && asciiCanvas) {
                asciiCanvas.style.display = 'block';
            }
            
            choiceLines = [];
            const choices = $gameMessage.choices();

            for (let i = 0; i < choices.length; i++) {
                const choice = choices[i];
                // Remove control codes from choices
                const cleanChoice = choice.replace(/\\[A-Z]+\[\d*\]/g, '');
                choiceLines.push(`${i + 1}. ${cleanChoice}`);
            }

            selectedChoiceIndex = 0; // Default to first choice selected
            showChoices = true;
        }
    };

    // Track choice selection changes
    const _Window_ChoiceList_select = Window_ChoiceList.prototype.select;
    Window_ChoiceList.prototype.select = function (index) {
        _Window_ChoiceList_select.call(this, index);

        if (asciiMode && showChoices) {
            selectedChoiceIndex = index;
        }
    };

    const _Window_ChoiceList_close = Window_ChoiceList.prototype.close;
    Window_ChoiceList.prototype.close = function () {
        _Window_ChoiceList_close.call(this);

        if (asciiMode) {
            this.visible = true; // Restore visibility
            showChoices = false;
            choiceLines = [];
            selectedChoiceIndex = -1;
            
            // Hide canvas in battle if it was shown for choices
            if (SceneManager._scene instanceof Scene_Battle && asciiCanvas) {
                asciiCanvas.style.display = 'none';
            }
        }
    };
    const _Scene_Map_update = Scene_Map.prototype.update;
    Scene_Map.prototype.update = function () {
        // Check for F9 key press (both by parameter and direct key code)
        if (Input.isTriggered(TOGGLE_KEY.toLowerCase()) || (TOGGLE_KEY.toUpperCase() === 'F9' && Input.isTriggered('debug'))) {
            toggleAsciiMode();
        }

        if (asciiMode && showAsciiMenu) {
            this.updateAsciiMenuInput();
            renderAsciiMap();
            Scene_Base.prototype.update.call(this);
            return;
        }

        _Scene_Map_update.call(this);

        // Update ASCII rendering if active
        if (asciiMode) {
            renderAsciiMap();
        }
    };

    // Render dialogue in battle scene
    const _Scene_Battle_update = Scene_Battle.prototype.update;
    Scene_Battle.prototype.update = function () {
        _Scene_Battle_update.call(this);

        if (asciiMode && (showDialogue || showChoices)) {
            if (asciiContext) {
                asciiContext.clearRect(0, 0, asciiCanvas.width, asciiCanvas.height);
                renderDialogue();
            }
        }
    };

    // Show animated world sprite in ASCII mode
    const _Sprite_Enemy_update = Sprite_Enemy.prototype.update;
    Sprite_Enemy.prototype.update = function() {
        _Sprite_Enemy_update.call(this);
        
        if (ConfigManager.asciiModeEnabled) {
            if (this._enemy) {
                const enemyData = $dataEnemies[this._enemy.enemyId()];
                const charMatch = enemyData ? enemyData.note.match(/<Char:(.+?)>/i) : null;
                const charName = charMatch ? charMatch[1] : null;

                if (charName) {
                    if (!this._asciiCharSprite) {
                        this._asciiCharSprite = new Sprite();
                        this._asciiCharSprite.anchor.x = 0.5;
                        this._asciiCharSprite.anchor.y = 1.0;
                        if (SceneManager._scene && SceneManager._scene._spriteset) {
                            SceneManager._scene._spriteset._battleField.addChild(this._asciiCharSprite);
                        }
                    }
                    
                    this._asciiCharSprite.visible = true;
                    
                    // Hide main battler by using empty bitmap
                    if (!this._emptyBitmap) {
                        this._emptyBitmap = new Bitmap(1, 1);
                    }
                    if (this.bitmap !== this._emptyBitmap) {
                        this._originalBitmap = this.bitmap;
                        this.bitmap = this._emptyBitmap;
                    }
                    
                    // Load character bitmap
                    const bitmap = ImageManager.loadCharacter(charName);
                    this._asciiCharSprite.bitmap = bitmap;
                    
                    // Animate
                    if (bitmap.isReady()) {
                        const isSingle = charName.startsWith('$');
                        const cols = isSingle ? 3 : 12;
                        const rows = isSingle ? 4 : 8;
                        const frameWidth = bitmap.width / cols;
                        const frameHeight = bitmap.height / rows;
                        
                        const frameIndex = Math.floor(Graphics.frameCount / 15) % 4;
                        const pattern = [0, 1, 2, 1];
                        const col = pattern[frameIndex];
                        const row = 0; // Down
                        
                        this._asciiCharSprite.setFrame(col * frameWidth, row * frameHeight, frameWidth, frameHeight);
                    }
                    
                    // Position and Scale
                    this._asciiCharSprite.x = this.x;
                    this._asciiCharSprite.y = this.y;
                    this._asciiCharSprite.scale.set(8, 8);
                }
            }
        } else {
            if (this._asciiCharSprite) {
                this._asciiCharSprite.visible = false;
            }
            if (this._emptyBitmap && this.bitmap === this._emptyBitmap) {
                if (this.loadBitmapWithHue) {
                    this.loadBitmapWithHue(this._defaultBattlerName);
                } else if (this._originalBitmap) {
                    this.bitmap = this._originalBitmap;
                }
                this._originalBitmap = null;
            }
        }
    };

    const _Scene_Map_updateCallMenu = Scene_Map.prototype.updateCallMenu;
    Scene_Map.prototype.updateCallMenu = function() {
        if (asciiMode) {
            if (this.isMenuCalled()) {
                this.openAsciiMenu();
            }
        } else {
            _Scene_Map_updateCallMenu.call(this);
        }
    };

    Scene_Map.prototype.openAsciiMenu = function() {
        showAsciiMenu = true;
        menuCommands = this.getMenuCommands();
        selectedMenuIndex = 0;
        SoundManager.playOk();
    };

    Scene_Map.prototype.getMenuCommands = function() {
        const rect = new Rectangle(0, 0, 0, 0);
        const win = new Window_MenuCommand(rect);
        return win._list;
    };

    Scene_Map.prototype.updateAsciiMenuInput = function() {
        const numCols = 2;
        
        if (Input.isRepeated('down')) {
            selectedMenuIndex = (selectedMenuIndex + numCols) % menuCommands.length;
            SoundManager.playCursor();
        }
        if (Input.isRepeated('up')) {
            selectedMenuIndex = (selectedMenuIndex - numCols + menuCommands.length) % menuCommands.length;
            SoundManager.playCursor();
        }
        if (Input.isRepeated('right')) {
            if (selectedMenuIndex % numCols === 0 && selectedMenuIndex + 1 < menuCommands.length) {
                selectedMenuIndex += 1;
                SoundManager.playCursor();
            }
        }
        if (Input.isRepeated('left')) {
            if (selectedMenuIndex % numCols === 1) {
                selectedMenuIndex -= 1;
                SoundManager.playCursor();
            }
        }
        if (Input.isTriggered('ok')) {
            this.executeAsciiMenuCommand();
        }
        if (Input.isTriggered('cancel') || TouchInput.isCancelled()) {
            showAsciiMenu = false;
            SoundManager.playCancel();
        }
    };

    Scene_Map.prototype.executeAsciiMenuCommand = function() {
        const command = menuCommands[selectedMenuIndex];
        if (!command.enabled) {
            SoundManager.playBuzzer();
            return;
        }
        SoundManager.playOk();
        showAsciiMenu = false; // Close menu
        
        const symbol = command.symbol;
        switch (symbol) {
            case 'item':
                SceneManager.push(Scene_Item);
                break;
            case 'skill':
                $gameParty.setMenuActor($gameParty.leader());
                SceneManager.push(Scene_Skill);
                break;
            case 'equip':
                $gameParty.setMenuActor($gameParty.leader());
                SceneManager.push(Scene_Equip);
                break;
            case 'status':
                $gameParty.setMenuActor($gameParty.leader());
                SceneManager.push(Scene_Status);
                break;
            case 'options':
                SceneManager.push(Scene_Options);
                break;
            case 'save':
                SceneManager.push(Scene_Save);
                break;
            case 'gameEnd':
                SceneManager.push(Scene_GameEnd);
                break;
            case 'cooking':
                SceneManager.push(Scene_Cooking);
                break;
            default:
                break;
        }
    };

    // Handle scene changes
    const _Scene_Map_terminate = Scene_Map.prototype.terminate;
    Scene_Map.prototype.terminate = function () {
        if (asciiCanvas) {
            asciiCanvas.style.display = 'none';
        }
        // Don't reset asciiMode - keep it active for map transitions
        _Scene_Map_terminate.call(this);
    };

    // Handle scene start to restore ASCII mode if it was active
    const _Scene_Map_start = Scene_Map.prototype.start;
    Scene_Map.prototype.start = function () {
        _Scene_Map_start.call(this);

        // If ASCII mode was active, restore it
        if (asciiMode) {
            createAsciiCanvas();
            asciiCanvas.style.display = 'block';
            renderAsciiMap();
        }
    };

    // Handle window resize
    const _Graphics_onResize = Graphics._onResize;
    Graphics._onResize = function () {
        _Graphics_onResize.call(this);

        if (asciiCanvas) {
            CANVAS_WIDTH = window.innerWidth;
            CANVAS_HEIGHT = window.innerHeight;
            // Keep fixed resolution
            asciiCanvas.width = CANVAS_WIDTH;
            asciiCanvas.height = CANVAS_HEIGHT;

            updateFontSize();
        }
    };

    const OPTION_SYMBOL = 'asciiModeEnabled';
    const OPTION_NAME = 'ASCII Mode';

    // Add the option to ConfigManager
    Object.defineProperty(ConfigManager, OPTION_SYMBOL, {
        get: function () {
            return this._asciiModeEnabled;
        },
        set: function (value) {
            // Handle legacy boolean values
            if (value === true) value = 1;
            if (value === false) value = 0;
            
            this._asciiModeEnabled = value;
            asciiMode = value; // Sync local variable
            
            // Update display
            if (value === 1) { // ON
                createAsciiCanvas();
                if (asciiCanvas) asciiCanvas.style.display = 'block';
                // Set zoom to highest closest level (2.0)
                if ($gameScreen && $gamePlayer) {
                    $gameScreen.setZoom($gamePlayer.screenX(), $gamePlayer.screenY(), 2.0);
                }
                renderAsciiMap();
            } else if (value === 2) { // Menu only
                createAsciiCanvas();
                if (asciiCanvas) asciiCanvas.style.display = 'none'; // Hide map, show only for UI
            } else { // OFF
                if (asciiCanvas) asciiCanvas.style.display = 'none';
                showAsciiMenu = false; // Reset menu state
            }
        },
        configurable: true
    });

    // Set default value
    ConfigManager._asciiModeEnabled = false;

    // Hook into makeData to save the option
    const _ConfigManager_makeData = ConfigManager.makeData;
    ConfigManager.makeData = function () {
        const config = _ConfigManager_makeData.call(this);
        config[OPTION_SYMBOL] = this[OPTION_SYMBOL];
        return config;
    };

    // Hook into applyData to load the option
    const _ConfigManager_applyData = ConfigManager.applyData;
    ConfigManager.applyData = function (config) {
        _ConfigManager_applyData.call(this, config);
        const value = config[OPTION_SYMBOL];
        if (value === true) this[OPTION_SYMBOL] = 1;
        else if (value === false) this[OPTION_SYMBOL] = 0;
        else if (value !== undefined) this[OPTION_SYMBOL] = value;
        else this[OPTION_SYMBOL] = 0;
    };

    // Hook into options window to add our option
    const _Window_Options_makeCommandList = Window_Options.prototype.makeCommandList;
    Window_Options.prototype.makeCommandList = function () {
        _Window_Options_makeCommandList.call(this);
        this.addCommand(OPTION_NAME, OPTION_SYMBOL);
    };

    // Hook into status text to show OFF/ON/Menu only
    const _Window_Options_statusText = Window_Options.prototype.statusText;
    Window_Options.prototype.statusText = function (index) {
        const symbol = this.commandSymbol(index);
        if (symbol === OPTION_SYMBOL) {
            const value = this.getConfigValue(symbol);
            if (value === 2) return "Menu only";
            if (value === 1 || value === true) return "ON";
            return "OFF";
        }
        return _Window_Options_statusText.call(this, index);
    };

    // Hook into processOk to handle multi-state toggle
    const _Window_Options_processOk = Window_Options.prototype.processOk;
    Window_Options.prototype.processOk = function () {
        const index = this.index();
        const symbol = this.commandSymbol(index);
        if (symbol === OPTION_SYMBOL) {
            let value = this.getConfigValue(symbol);
            if (value === true) value = 1;
            if (value === false) value = 0;
            const newValue = (value + 1) % 3;
            this.changeValue(symbol, newValue);
            return;
        }
        _Window_Options_processOk.call(this);
    };

    // Hook into cursorRight for multi-state options
    const _Window_Options_cursorRight = Window_Options.prototype.cursorRight;
    Window_Options.prototype.cursorRight = function () {
        const index = this.index();
        const symbol = this.commandSymbol(index);
        if (symbol === OPTION_SYMBOL) {
            let value = this.getConfigValue(symbol);
            if (value === true) value = 1;
            if (value === false) value = 0;
            const newValue = (value + 1) % 3;
            this.changeValue(symbol, newValue);
            return;
        }
        _Window_Options_cursorRight.call(this);
    };

    // Hook into cursorLeft for multi-state options
    const _Window_Options_cursorLeft = Window_Options.prototype.cursorLeft;
    Window_Options.prototype.cursorLeft = function () {
        const index = this.index();
        const symbol = this.commandSymbol(index);
        if (symbol === OPTION_SYMBOL) {
            let value = this.getConfigValue(symbol);
            if (value === true) value = 1;
            if (value === false) value = 0;
            const newValue = (value - 1 + 3) % 3;
            this.changeValue(symbol, newValue);
            return;
        }
        _Window_Options_cursorLeft.call(this);
    };

    // Plugin command for toggling (optional)
    PluginManager.registerCommand(pluginName, "toggle", args => {
        toggleAsciiMode();
    });

    // Add key mapping for F9
    Input.keyMapper[120] = 'f9'; // F9 key code

    // Also ensure the parameter key is mapped
    if (TOGGLE_KEY.toLowerCase() !== 'f9') {
        // Map additional keys if different from F9
        const keyCode = getKeyCode(TOGGLE_KEY);
        if (keyCode) {
            Input.keyMapper[keyCode] = TOGGLE_KEY.toLowerCase();
        }
    }

    // Helper function to get key codes
    function getKeyCode(key) {
        const keyCodes = {
            'F1': 112, 'F2': 113, 'F3': 114, 'F4': 115, 'F5': 116,
            'F6': 117, 'F7': 118, 'F8': 119, 'F9': 120, 'F10': 121,
            'F11': 122, 'F12': 123
        };
        return keyCodes[key.toUpperCase()];
    }

    // =============================================================================
    // Shop System ASCII Replication
    // =============================================================================

    const _Scene_Shop_prepare = Scene_Shop.prototype.prepare;
    Scene_Shop.prototype.prepare = function (goods, purchaseOnly) {
        _Scene_Shop_prepare.call(this, goods, purchaseOnly);
        this._asciiGoods = goods;
        this._asciiPurchaseOnly = purchaseOnly;
    };

    const _Scene_Shop_start = Scene_Shop.prototype.start;
    Scene_Shop.prototype.start = function () {
        _Scene_Shop_start.call(this);
        if (asciiMode) {
            createAsciiCanvas();
            if (asciiCanvas) asciiCanvas.style.display = 'block';
            
            // Deactivate and hide normal windows
            this._commandWindow.deactivate();
            this._buyWindow.deactivate();
            this._sellWindow.deactivate();
            this._numberWindow.deactivate();
            this._commandWindow.hide();
            this._buyWindow.hide();
            this._sellWindow.hide();
            this._numberWindow.hide();
            this._statusWindow.hide();
            this._goldWindow.hide();

            this._selectedCategory = 0; // 0: Buy, 1: Sell, 2: Cancel
            this._selectedIndex = 0;
            this._resolvedGoods = this.resolveGoods(this._asciiGoods);
            this._activeWindow = 'category'; // 'category', 'list', 'quantity'
            this._quantity = 1;
            this._shopMode = 'buy';
        }
    };

    const _Scene_Shop_terminate = Scene_Shop.prototype.terminate;
    Scene_Shop.prototype.terminate = function () {
        if (asciiCanvas) {
            asciiCanvas.style.display = 'none';
        }
        _Scene_Shop_terminate.call(this);
    };

    Scene_Shop.prototype.resolveGoods = function (goods) {
        const resolved = [];
        if (!goods) return resolved;
        for (const good of goods) {
            const type = good[0];
            const id = good[1];
            const priceOverride = good[2];
            const price = good[3];

            let item = null;
            if (type === 0) item = $dataItems[id];
            if (type === 1) item = $dataWeapons[id];
            if (type === 2) item = $dataArmors[id];

            if (item) {
                const finalPrice = priceOverride === 1 ? price : item.price;
                resolved.push({ item, price: finalPrice });
            }
        }
        return resolved;
    };

    Scene_Shop.prototype.getSellableItems = function () {
        const items = $gameParty.allItems();
        return items.map(item => ({ item, price: Math.floor(item.price / 2) }));
    };

    const _Scene_Shop_update = Scene_Shop.prototype.update;
    Scene_Shop.prototype.update = function () {
        if (asciiMode) {
            this.updateAsciiShopInput();
            this.renderAsciiShop();
            Scene_Base.prototype.update.call(this);
            return;
        }
        _Scene_Shop_update.call(this);
    };

    Scene_Shop.prototype.updateAsciiShopInput = function () {
        if (this._activeWindow === 'category') {
            if (Input.isRepeated('right')) {
                this._selectedCategory = (this._selectedCategory + 1) % 3;
                SoundManager.playCursor();
            }
            if (Input.isRepeated('left')) {
                this._selectedCategory = (this._selectedCategory - 1 + 3) % 3;
                SoundManager.playCursor();
            }
            if (Input.isTriggered('ok')) {
                if (this._selectedCategory === 0) { // Buy
                    this._activeWindow = 'list';
                    this._selectedIndex = 0;
                    this._shopMode = 'buy';
                    SoundManager.playOk();
                } else if (this._selectedCategory === 1) { // Sell
                    if (this._asciiPurchaseOnly) {
                        SoundManager.playBuzzer();
                    } else {
                        this._activeWindow = 'list';
                        this._selectedIndex = 0;
                        this._shopMode = 'sell';
                        SoundManager.playOk();
                    }
                } else if (this._selectedCategory === 2) { // Cancel
                    SceneManager.pop();
                    SoundManager.playCancel();
                }
            }
            if (Input.isTriggered('cancel')) {
                SceneManager.pop();
                SoundManager.playCancel();
            }
        } else if (this._activeWindow === 'list') {
            const list = this._shopMode === 'buy' ? this._resolvedGoods : this.getSellableItems();
            if (list.length === 0) {
                if (Input.isTriggered('cancel')) {
                    this._activeWindow = 'category';
                    SoundManager.playCancel();
                }
                return;
            }
            if (Input.isRepeated('down')) {
                this._selectedIndex = (this._selectedIndex + 1) % list.length;
                SoundManager.playCursor();
            }
            if (Input.isRepeated('up')) {
                this._selectedIndex = (this._selectedIndex - 1 + list.length) % list.length;
                SoundManager.playCursor();
            }
            if (Input.isTriggered('ok')) {
                const itemData = list[this._selectedIndex];
                if (itemData && this.canBuyOrSell(itemData)) {
                    this._activeWindow = 'quantity';
                    this._quantity = 1;
                    SoundManager.playOk();
                } else {
                    SoundManager.playBuzzer();
                }
            }
            if (Input.isTriggered('cancel')) {
                this._activeWindow = 'category';
                SoundManager.playCancel();
            }
        } else if (this._activeWindow === 'quantity') {
            if (Input.isRepeated('up')) {
                this._quantity = Math.min(this._quantity + 1, this.maxQuantity());
                SoundManager.playCursor();
            }
            if (Input.isRepeated('down')) {
                this._quantity = Math.max(this._quantity - 1, 1);
                SoundManager.playCursor();
            }
            if (Input.isTriggered('ok')) {
                this.executeTrade();
                this._activeWindow = 'list';
                SoundManager.playOk();
            }
            if (Input.isTriggered('cancel')) {
                this._activeWindow = 'list';
                SoundManager.playCancel();
            }
        }
    };

    Scene_Shop.prototype.canBuyOrSell = function (itemData) {
        if (this._shopMode === 'buy') {
            return $gameParty.gold() >= itemData.price && $gameParty.numItems(itemData.item) < 99;
        } else {
            return $gameParty.numItems(itemData.item) > 0;
        }
    };

    Scene_Shop.prototype.maxQuantity = function () {
        const list = this._shopMode === 'buy' ? this._resolvedGoods : this.getSellableItems();
        const itemData = list[this._selectedIndex];
        if (!itemData) return 1;
        if (this._shopMode === 'buy') {
            const maxGold = Math.floor($gameParty.gold() / itemData.price);
            const maxHold = 99 - $gameParty.numItems(itemData.item);
            return Math.min(maxGold, maxHold);
        } else {
            return $gameParty.numItems(itemData.item);
        }
    };

    Scene_Shop.prototype.executeTrade = function () {
        const list = this._shopMode === 'buy' ? this._resolvedGoods : this.getSellableItems();
        const itemData = list[this._selectedIndex];
        if (!itemData) return;

        const totalCost = itemData.price * this._quantity;
        if (this._shopMode === 'buy') {
            $gameParty.loseGold(totalCost);
            $gameParty.gainItem(itemData.item, this._quantity);
        } else {
            $gameParty.gainGold(totalCost);
            $gameParty.loseItem(itemData.item, this._quantity);
            if ($gameParty.numItems(itemData.item) === 0) {
                this._selectedIndex = Math.max(0, this._selectedIndex - 1);
            }
        }
    };

    Scene_Shop.prototype.renderAsciiShop = function () {
        if (!asciiContext) return;

        asciiContext.clearRect(0, 0, asciiCanvas.width, asciiCanvas.height);
        asciiContext.fillStyle = '#000000';
        asciiContext.fillRect(0, 0, asciiCanvas.width, asciiCanvas.height);

        const fontSize = currentFontSize;
        asciiContext.font = `${fontSize}px ${FONT_FAMILY}`;

        // Header
        asciiContext.fillStyle = TEXT_COLOR;
        asciiContext.textAlign = 'center';
        asciiContext.fillText("--- SHOP ---", CANVAS_WIDTH / 2, 30);

        // Gold
        const euroGold = ($gameParty.gold() / 100).toFixed(2);
        asciiContext.fillStyle = '#FFD700';
        asciiContext.textAlign = 'right';
        asciiContext.fillText(`Balance: ${euroGold} €`, CANVAS_WIDTH - 50, 30);

        // Categories
        const categories = ["BUY", "SELL", "CANCEL"];
        const catWidth = 150;
        const startX = (CANVAS_WIDTH - catWidth * 3) / 2;

        for (let i = 0; i < categories.length; i++) {
            const x = startX + i * catWidth + catWidth / 2;
            if (this._activeWindow === 'category' && i === this._selectedCategory) {
                asciiContext.fillStyle = '#FF0000';
                asciiContext.fillText(`> ${categories[i]} <`, x, 70);
            } else {
                if (i === 1 && this._asciiPurchaseOnly) {
                    asciiContext.fillStyle = '#808080';
                } else {
                    asciiContext.fillStyle = (this._selectedCategory === i && this._activeWindow !== 'category') ? '#FFD700' : '#FFFF00';
                }
                asciiContext.fillText(categories[i], x, 70);
            }
        }

        // List
        const list = this._shopMode === 'buy' ? this._resolvedGoods : this.getSellableItems();
        const listY = 120;
        const listX = 50;

        asciiContext.textAlign = 'left';
        for (let i = 0; i < list.length; i++) {
            const itemData = list[i];
            const y = listY + i * (fontSize + 10);

            if (this._activeWindow === 'list' && i === this._selectedIndex) {
                asciiContext.fillStyle = '#FF0000';
                asciiContext.fillText(`> ${itemData.item.name}`, listX, y);
            } else {
                asciiContext.fillStyle = '#FFFFFF';
                asciiContext.fillText(`  ${itemData.item.name}`, listX, y);
            }

            const euroPrice = (itemData.price / 100).toFixed(2);
            asciiContext.fillStyle = '#FFD700';
            asciiContext.fillText(`${euroPrice} €`, listX + 250, y);
        }

        // Details
        const selectedItemData = list[this._selectedIndex];
        if (selectedItemData) {
            this.renderItemDetails(selectedItemData.item, 450, listY);
        }

        // Quantity Box
        if (this._activeWindow === 'quantity') {
            const boxWidth = 300;
            const boxHeight = 100;
            const bX = (CANVAS_WIDTH - boxWidth) / 2;
            const bY = (CANVAS_HEIGHT - boxHeight) / 2;

            asciiContext.fillStyle = 'rgba(0, 0, 0, 0.9)';
            asciiContext.fillRect(bX, bY, boxWidth, boxHeight);
            asciiContext.strokeStyle = '#FFFFFF';
            asciiContext.strokeRect(bX, bY, boxWidth, boxHeight);

            asciiContext.fillStyle = '#FFFFFF';
            asciiContext.textAlign = 'center';
            asciiContext.fillText(`Quantity: ${this._quantity}`, CANVAS_WIDTH / 2, bY + 40);

            const total = (selectedItemData.price * this._quantity / 100).toFixed(2);
            asciiContext.fillText(`Total: ${total} €`, CANVAS_WIDTH / 2, bY + 70);
        }
    };

    Scene_Shop.prototype.renderItemDetails = function (item, x, y) {
        const fontSize = currentFontSize;
        const lineHeight = fontSize + 6;
        let currentY = y;

        asciiContext.fillStyle = '#FFD700';
        asciiContext.textAlign = 'left';
        asciiContext.fillText(item.name, x, currentY);
        currentY += lineHeight;

        asciiContext.strokeStyle = '#FFFFFF';
        asciiContext.beginPath();
        asciiContext.moveTo(x, currentY);
        asciiContext.lineTo(x + 300, currentY);
        asciiContext.stroke();
        currentY += 10;

        asciiContext.fillStyle = '#FFFFFF';

        const categoryName = window.ItemSystemUtils ? window.ItemSystemUtils.getItemCategoryName(item) : 'Unknown';
        this.drawKeyValue("Type", categoryName, x, currentY);
        currentY += lineHeight;

        const weight = window.ItemSystemUtils ? window.ItemSystemUtils.getItemWeight(item) : 0;
        this.drawKeyValue("Weight", (weight / 10).toFixed(1) + " kg", x, currentY);
        currentY += lineHeight;

        if (DataManager.isWeapon(item)) {
            const scaling = this.getWeaponScaling(item);
            if (scaling) {
                this.drawKeyValue("Scale", scaling, x, currentY);
                currentY += lineHeight;
            }
            this.drawParams(item, x, currentY);
        } else if (DataManager.isArmor(item)) {
            let slot = $dataSystem.equipTypes[item.etypeId];
            this.drawKeyValue("Slot", slot, x, currentY);
            currentY += lineHeight;
            this.drawParams(item, x, currentY);
        } else if (DataManager.isItem(item)) {
            this.drawKeyValue("Use", item.consumable ? "Single" : "Unlimited", x, currentY);
            currentY += lineHeight;

            if (window.ItemSystemUtils && window.ItemSystemUtils.isFoodItem(item)) {
                const calories = window.ItemSystemUtils.getNutritionValue(item, "calories");
                if (calories > 0) {
                    this.drawKeyValue("Calories", calories.toString(), x, currentY);
                    currentY += lineHeight;
                }
            }
        }
    };

    Scene_Shop.prototype.drawKeyValue = function (key, value, x, y) {
        asciiContext.fillStyle = '#00FFFF';
        asciiContext.fillText(key + ":", x, y);
        asciiContext.fillStyle = '#FFFFFF';
        asciiContext.fillText(value, x + 100, y);
    };

    Scene_Shop.prototype.drawParams = function (item, x, y) {
        const fontSize = currentFontSize;
        const lineHeight = fontSize + 6;
        let currentY = y;

        const params = ["HP", "MP", "STR", "COS", "INT", "WIS", "DEX", "PSI"];
        for (let i = 2; i < 8; i++) {
            const val = item.params[i];
            if (val !== 0) {
                const sign = val > 0 ? "+" : "";
                this.drawKeyValue(params[i], sign + val, x, currentY);
                currentY += lineHeight;
            }
        }
    };

    Scene_Shop.prototype.getWeaponScaling = function (item) {
        const attackSkills = item.traits.filter(trait => trait.code === 35);
        if (attackSkills.length === 0) return 'STR';
        for (const trait of attackSkills) {
            const skillId = trait.dataId;
            switch (skillId) {
                case 840: return 'DEX';
                case 841: return 'MIX';
                case 842: return 'PSI';
                case 843: return 'INT';
                case 844: return 'CON';
                case 845: return 'WIS';
            }
        }
        return 'STR';
    };

    // Expose AsciiMode API for other plugins
    window.AsciiMode = {
        get active() { return asciiMode; },
        get canvas() { return asciiCanvas; },
        get context() { return asciiContext; },
        get fontSize() { return currentFontSize; },
        get fontFamily() { return FONT_FAMILY; },
        createCanvas: createAsciiCanvas
    };

    // =============================================================================
    // AI INSTRUCTIONS FOR PLUGIN COMPATIBILITY WITH ASCII MODE
    // =============================================================================
    /*
     * To make any graphical plugin (like a Bestiary, Custom Menu, or Shop) compatible
     * with this ASCII Mode plugin and maintain the same style, follow these guidelines:
     * 
     * 1. Check for ASCII Mode:
     *    Always check if ASCII mode is active using:
     *    if (window.AsciiMode && window.AsciiMode.active !== 0)
     * 
     * 2. Intercept Scene Start:
     *    In your scene's `start` or `initialize` method, check if ASCII mode is active.
     *    If it is:
     *    - Call `window.AsciiMode.createCanvas()`.
     *    - Show the canvas: `if (window.AsciiMode.canvas) window.AsciiMode.canvas.style.display = 'block';`.
     *    - Deactivate and hide the normal windows of the scene to prevent them from
     *      processing inputs or showing through.
     * 
     * 3. Intercept Scene Terminate:
     *    In your scene's `terminate` method, hide the canvas:
     *    `if (window.AsciiMode.canvas) window.AsciiMode.canvas.style.display = 'none';`.
     * 
     * 4. Override Update Loop:
     *    Override the scene's `update` method.
     *    If ASCII mode is active:
     *    - Handle custom inputs (Up, Down, Left, Right, OK, Cancel).
     *    - Call your custom render function to draw the ASCII UI.
     *    - Call `Scene_Base.prototype.update.call(this)` instead of the normal update
     *      to update basic scene functionality without updating the hidden windows.
     *      Return immediately after.
     * 
     * 5. Rendering Guidelines:
     *    - Use the context to draw: `const ctx = window.AsciiMode.context;`.
     *    - Clear the canvas at the start of rendering: `ctx.clearRect(0, 0, window.AsciiMode.canvas.width, window.AsciiMode.canvas.height)`.
     *    - Fill the background with black: `ctx.fillStyle = '#000000'; ctx.fillRect(0, 0, window.AsciiMode.canvas.width, window.AsciiMode.canvas.height)`.
     *    - Use `window.AsciiMode.fontSize` and `window.AsciiMode.fontFamily`.
     *    - Use standard colors for consistency:
     *      - Yellow (`#FFFF00`) for enabled/selectable options.
     *      - Red (`#FF0000`) for selected/active options.
     *      - Gold (`#FFD700`) for headers, highlights, or values.
     *      - Cyan (`#00FFFF`) for keys or labels.
     *      - White (`#FFFFFF`) for normal text.
     *      - Gray (`#808080`) for disabled options.
     * 
     * 6. Example Structure:
     *    See `Scene_Shop` overrides at the bottom of `ASCIIMode.js` for a complete example.
     */

    console.log(`${pluginName} loaded successfully!`);
    console.log(`Press ${TOGGLE_KEY} to toggle ASCII mode`);
})();
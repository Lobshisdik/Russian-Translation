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
 * @default 16
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
    const FONT_SIZE = parseInt(parameters['fontSize']) || 16;
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
        1: '.',  // Normal floor
        2: '~',  // Water
        3: '7',  // Custom terrain (as requested)
        4: '^',  // Mountain/Hill
        5: 'T',  // Forest
        6: '=',  // Bridge
        7: '#',  // Wall/Rock
        8: '%',  // Sand
        9: '*',  // Ice
        10: '+'  // Special
    };
    
    let asciiMode = false;
    let asciiCanvas = null;
    let asciiContext = null;
    let dialogueLines = [];
    let choiceLines = [];
    let showDialogue = false;
    let showChoices = false;
    let selectedChoiceIndex = -1;
    
    const CANVAS_WIDTH = 816;
    const CANVAS_HEIGHT = 624;
    
    // Initialize ASCII canvas
    function createAsciiCanvas() {
        if (asciiCanvas) return;
        
        asciiCanvas = document.createElement('canvas');
        asciiCanvas.id = 'asciiCanvas';
        asciiCanvas.style.position = 'absolute';
        asciiCanvas.style.top = '50%';
        asciiCanvas.style.left = '50%';
        asciiCanvas.style.transform = 'translate(-50%, -50%)';
        asciiCanvas.style.zIndex = '1000';
        asciiCanvas.style.display = 'none';
        asciiCanvas.style.imageRendering = 'pixelated';
        
        document.body.appendChild(asciiCanvas);
        asciiContext = asciiCanvas.getContext('2d');
        
        // Set canvas size to game resolution
        asciiCanvas.width = 816;
        asciiCanvas.height = 624;
        
        // Set font properties
        asciiContext.font = `${FONT_SIZE}px ${FONT_FAMILY}`;
        asciiContext.textAlign = 'center';
        asciiContext.textBaseline = 'middle';
    }
    
    // Toggle ASCII mode
    function toggleAsciiMode() {
        asciiMode = !asciiMode;
        
        if (asciiMode) {
            createAsciiCanvas();
            asciiCanvas.style.display = 'block';
            renderAsciiMap();
        } else {
            if (asciiCanvas) {
                asciiCanvas.style.display = 'none';
            }
        }
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
        
        // Check terrain tag translations first
        if (TERRAIN_TAG_TRANSLATIONS[terrainTag]) {
            return TERRAIN_TAG_TRANSLATIONS[terrainTag];
        }
        
        // Fall back to passability
        if ($gameMap.isPassable(x, y, 2) || $gameMap.isPassable(x, y, 4) || 
            $gameMap.isPassable(x, y, 6) || $gameMap.isPassable(x, y, 8)) {
            return '.';  // Passable floor
        } else {
            return '#';  // Non-passable wall
        }
    }
    
    // Get character for event
    function getEventCharacter(event) {
        if (!event || !event.event()) return null;
        
        // Skip events with no image
        if (!eventHasImage(event)) return null;
        
        const eventName = event.event().name;
        
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
        
        const lineHeight = FONT_SIZE + 4;
        let totalLines = dialogueLines.length + choiceLines.length;
        if (totalLines === 0) return;
        
        const maxLines = Math.floor(CANVAS_HEIGHT / 4 / lineHeight); // Use bottom quarter of screen
        const boxHeight = Math.min(totalLines, maxLines) * lineHeight + 20;
        const startY = CANVAS_HEIGHT - boxHeight - 10;
        const padding = 10;
        
        // Draw dialogue background
        asciiContext.fillStyle = 'rgba(0, 0, 0, 0.8)';
        asciiContext.fillRect(0, startY, CANVAS_WIDTH, boxHeight);
        
        // Draw dialogue border
        asciiContext.strokeStyle = TEXT_COLOR;
        asciiContext.lineWidth = 2;
        asciiContext.strokeRect(0, startY, CANVAS_WIDTH, boxHeight);
        
        // Draw dialogue text
        asciiContext.textAlign = 'left';
        asciiContext.textBaseline = 'top';
        
        let currentLine = 0;
        
        // Draw dialogue lines
        if (showDialogue && dialogueLines.length > 0) {
            asciiContext.fillStyle = TEXT_COLOR;
            for (let i = 0; i < dialogueLines.length && currentLine < maxLines; i++) {
                const line = dialogueLines[i];
                const y = startY + padding + (currentLine * lineHeight);
                asciiContext.fillText(line, padding, y);
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
                
                asciiContext.fillText(`> ${choice}`, padding, y);
                currentLine++;
            }
        }
        
        // Reset text alignment for map rendering
        asciiContext.textAlign = 'center';
        asciiContext.textBaseline = 'middle';
    }
    function getCharacterColor(type, char) {
        switch (type) {
            case 'player':
                return PLAYER_COLOR;
            case 'event':
                return EVENT_COLOR;
            case 'terrain':
                // Different colors for different terrain types
                switch (char) {
                    case '~': return '#0066FF';  // Water - blue
                    case '^': return '#8B4513';  // Mountain - brown
                    case 'T': return '#228B22';  // Forest - green
                    case '7': return '#FF6347';  // Custom terrain - red
                    case '#': return '#696969';  // Wall - gray
                    case '*': return '#87CEEB';  // Ice - light blue
                    case '=': return '#8B4513';  // Bridge - brown
                    case '%': return '#F4A460';  // Sand - sandy brown
                    case '+': return '#FF69B4';  // Special - pink
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
        asciiContext.fillStyle = BG_COLOR;
        asciiContext.fillRect(0, 0, asciiCanvas.width, asciiCanvas.height);
        
        const mapWidth = $gameMap.width();
        const mapHeight = $gameMap.height();
        const playerX = $gamePlayer.x;
        const playerY = $gamePlayer.y;
        
        // Calculate view area (centered on player)
        const viewWidth = Math.floor(CANVAS_WIDTH / FONT_SIZE);
        const viewHeight = Math.floor(CANVAS_HEIGHT / FONT_SIZE);
        
        const startX = Math.max(0, playerX - Math.floor(viewWidth / 2));
        const startY = Math.max(0, playerY - Math.floor(viewHeight / 2));
        const endX = Math.min(mapWidth, startX + viewWidth);
        const endY = Math.min(mapHeight, startY + viewHeight);
        
        // Render tiles
        for (let mapY = startY; mapY < endY; mapY++) {
            for (let mapX = startX; mapX < endX; mapX++) {
                const screenX = (mapX - startX) * FONT_SIZE + FONT_SIZE / 2;
                const screenY = (mapY - startY) * FONT_SIZE + FONT_SIZE / 2;
                
                // Get base tile character
                const tileChar = getTileCharacter(mapX, mapY);
                asciiContext.fillStyle = getCharacterColor('terrain', tileChar);
                asciiContext.fillText(tileChar, screenX, screenY);
            }
        }
        
        // Render events (only those with images)
        $gameMap.events().forEach(event => {
            if (!event || event._erased) return;
            
            const eventX = event.x;
            const eventY = event.y;
            
            // Check if event is in view
            if (eventX >= startX && eventX < endX && eventY >= startY && eventY < endY) {
                const screenX = (eventX - startX) * FONT_SIZE + FONT_SIZE / 2;
                const screenY = (eventY - startY) * FONT_SIZE + FONT_SIZE / 2;
                
                const eventChar = getEventCharacter(event);
                if (eventChar) {  // This will be null for events without images
                    asciiContext.fillStyle = getCharacterColor('event', eventChar);
                    asciiContext.fillText(eventChar, screenX, screenY);
                }
            }
        });
        
        // Render player
        if (playerX >= startX && playerX < endX && playerY >= startY && playerY < endY) {
            const screenX = (playerX - startX) * FONT_SIZE + FONT_SIZE / 2;
            const screenY = (playerY - startY) * FONT_SIZE + FONT_SIZE / 2;
            
            asciiContext.fillStyle = getCharacterColor('player', '@');
            asciiContext.fillText('@', screenX, screenY);
        }
        
        // Render dialogue if active
        renderDialogue();
    }
    
    // Hook into message system to capture dialogue
    const _Window_Message_startMessage = Window_Message.prototype.startMessage;
    Window_Message.prototype.startMessage = function() {
        _Window_Message_startMessage.call(this);
        
        if (asciiMode) {
            // Extract text from the current message
            const text = $gameMessage.allText();
            if (text) {
                // Process text to remove control characters and split into lines
                const cleanText = text.replace(/\\[A-Z]+\[\d*\]/g, ''); // Remove control codes
                const lines = cleanText.split('\n').filter(line => line.trim() !== '');
                
                // Word wrap long lines to fit screen
                dialogueLines = [];
                const maxCharsPerLine = Math.floor((CANVAS_WIDTH - 20) / (FONT_SIZE * 0.6));
                
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
    Window_Message.prototype.terminateMessage = function() {
        _Window_Message_terminateMessage.call(this);
        
        if (asciiMode) {
            showDialogue = false;
            dialogueLines = [];
        }
    };
    
    // Hook into choice system to capture dialogue choices
    const _Window_ChoiceList_start = Window_ChoiceList.prototype.start;
    Window_ChoiceList.prototype.start = function() {
        _Window_ChoiceList_start.call(this);
        
        if (asciiMode) {
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
    Window_ChoiceList.prototype.select = function(index) {
        _Window_ChoiceList_select.call(this, index);
        
        if (asciiMode && showChoices) {
            selectedChoiceIndex = index;
        }
    };
    
    const _Window_ChoiceList_close = Window_ChoiceList.prototype.close;
    Window_ChoiceList.prototype.close = function() {
        _Window_ChoiceList_close.call(this);
        
        if (asciiMode) {
            showChoices = false;
            choiceLines = [];
            selectedChoiceIndex = -1;
        }
    };
    const _Scene_Map_update = Scene_Map.prototype.update;
    Scene_Map.prototype.update = function() {
        _Scene_Map_update.call(this);
        
        // Check for F9 key press (both by parameter and direct key code)
        if (Input.isTriggered(TOGGLE_KEY.toLowerCase()) || Input.isTriggered('f9')) {
            toggleAsciiMode();
        }
        
        // Update ASCII rendering if active
        if (asciiMode) {
            renderAsciiMap();
        }
    };
    
    // Handle scene changes
    const _Scene_Map_terminate = Scene_Map.prototype.terminate;
    Scene_Map.prototype.terminate = function() {
        if (asciiCanvas) {
            asciiCanvas.style.display = 'none';
        }
        // Don't reset asciiMode - keep it active for map transitions
        _Scene_Map_terminate.call(this);
    };
    
    // Handle scene start to restore ASCII mode if it was active
    const _Scene_Map_start = Scene_Map.prototype.start;
    Scene_Map.prototype.start = function() {
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
    Graphics._onResize = function() {
        _Graphics_onResize.call(this);
        
        if (asciiCanvas) {
            // Keep fixed resolution
            asciiCanvas.width = CANVAS_WIDTH;
            asciiCanvas.height = CANVAS_HEIGHT;
            
            if (asciiContext) {
                asciiContext.font = `${FONT_SIZE}px ${FONT_FAMILY}`;
                asciiContext.textAlign = 'center';
                asciiContext.textBaseline = 'middle';
            }
        }
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
    
    console.log(`${pluginName} loaded successfully!`);
    console.log(`Press ${TOGGLE_KEY} to toggle ASCII mode`);
})();
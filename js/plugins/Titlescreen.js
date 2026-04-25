    //=============================================================================
    // WitcherStyleTitle.js
    //=============================================================================

    /*:
    * @target MZ
    * @plugindesc Replaces the title screen command window with a vertical, Witcher-style menu and adds a floating-network of connected data cards with fade-in mesh lines.
    * @author Omni-Lex
    * @version 1.4.3
    *
    * @param windowWidth
    * @text Window Width (%)
    * @desc The width of the command window as a percentage of the screen width.
    * @type number
    * @default 35
    *
    * @param windowX
    * @text Window X Offset (%)
    * @desc Horizontal center position of the command window as a percentage of the screen width.
    * @type number
    * @default 20
    *
    * @param windowPadding
    * @text Window Padding
    * @desc Padding inside the command window.
    * @type number
    * @default 18
    *
    * @param commandPadding
    * @text Command Padding
    * @desc The space to the left of the command text.
    * @type number
    * @default 36
    *
    * @help
    * -----------------------------------------------------------------------------
    * Introduction
    * -----------------------------------------------------------------------------
    * This plugin replaces the default title screen command window with a full-height,
    * Witcher-style column menu on the left side and spawns floating cards below
    * that rise up, showing random enemies, skills, items, weapons, or armor from the
    * game's database. Each card is connected to every other with gold lines that
    * smoothly fade in and out, forming a dynamic mesh.
    *
    * Enhanced features:
    * - Animated ASCII title "Hypernet Explorer" with shimmer effect
    * - Skills now show icons
    * - Enemies display battler images
    * - Cards auto-resize based on content
    * - Terminal-style interface design with gold theme
    * - Cards appear earlier on screen
    * - Left-aligned command window text
    * - Simple black semi-transparent background with golden border
    * - ID-based references instead of icon/sprite numbers
    *
    * No plugin commands.
    *
    */

    (() => {
        const pluginName = "WitcherStyleTitle";
        const params = PluginManager.parameters(pluginName);
        const toPct = v => Number(v) / 100;
        const windowWidthPct = Number(params.windowWidth) || 35;
        const windowXOffsetPct = Number(params.windowX) || 20;
        const windowPadding = Number(params.windowPadding) || 18;
        const commandPadding = Number(params.commandPadding) || 36;
        const { TRIVIA } = window.HelpData;

    // -------------------------------------------------------------------------
        // Logo Image Sprite
        // -------------------------------------------------------------------------

class LogoSprite extends Sprite {
    constructor() {
        super();
        const bitmap = ImageManager.loadPicture('Logo');
        this.bitmap = bitmap;
        bitmap.addLoadListener(() => {
            const maxW = Graphics.width * 0.6;
            const scale = Math.min(1, maxW / bitmap.width);
            this.scale.set(scale);
            this.x = Math.floor((Graphics.width - bitmap.width * scale) / 2);
            this.y = 10;
        });
    }
}

        // -------------------------------------------------------------------------
        // Title window layout with left-aligned text and simple styling
        // -------------------------------------------------------------------------
        const _Scene_Title_createCommandWindow = Scene_Title.prototype.createCommandWindow;
        Scene_Title.prototype.createCommandWindow = function() {
            _Scene_Title_createCommandWindow.call(this);
            this._commandWindow.setHandler('tutorial', this.commandTutorial.bind(this));
            const ww = Graphics.width * toPct(windowWidthPct);
            const wx = Graphics.width * toPct(windowXOffsetPct) - ww / 2;
            
            // Calculate required height based on number of items
            const itemHeight = this._commandWindow.itemHeight();
            const numItems = this._commandWindow.maxItems();
            const requiredHeight = numItems * itemHeight + windowPadding * 2;
            
            // Center the window vertically, but account for the ASCII title
            const titleOffset = 200; // Space for the ASCII title
            const wy = titleOffset + (Graphics.height - requiredHeight - titleOffset) / 2;
            
            this._commandWindow.move(wx, wy);
            this._commandWindow.width = ww;
            this._commandWindow.height = requiredHeight;
            this._commandWindow.padding = windowPadding;
            this._commandWindow._itemPadding = commandPadding;
            
            // Apply custom styling after window is created
            this._applyCustomWindowStyle();
        };
        
        // Tutorial command: start new game on map 1414 at 39,7 facing down
        Scene_Title.prototype.commandTutorial = function() {
            this._commandWindow.close();
            this.fadeOutAll();
            DataManager.setupNewGame();
            $gamePlayer.reserveTransfer(1415, 14, 18, 2, 0);
            SceneManager.goto(Scene_Map);
        };

        // Add custom styling method to Scene_Title
        Scene_Title.prototype._applyCustomWindowStyle = function() {
            // Make window background transparent
            this._commandWindow.opacity = 0;
            
            // Create custom background graphics
            if (!this._customWindowBg) {
                this._customWindowBg = new PIXI.Graphics();
                this.addChildAt(this._customWindowBg, 0);
            }
            
            // Update custom background
            this._updateCustomWindowBackground();
        };
        
        Scene_Title.prototype._updateCustomWindowBackground = function() {
            if (!this._customWindowBg || !this._commandWindow) return;
            
            this._customWindowBg.clear();
            
            // Draw simple black semi-transparent background
            this._customWindowBg.beginFill(0x000000, 0.7);
            this._customWindowBg.drawRect(
                this._commandWindow.x, 
                this._commandWindow.y, 
                this._commandWindow.width, 
                this._commandWindow.height
            );
            this._customWindowBg.endFill();
            
            // Draw golden border
            /*
            this._customWindowBg.lineStyle(2, 0xFFD700, 1);
            this._customWindowBg.drawRect(
                this._commandWindow.x + 1, 
                this._commandWindow.y + 1, 
                this._commandWindow.width - 2, 
                this._commandWindow.height - 2
            );*/
        };
        
        // Update background when window refreshes
        const _Scene_Title_update = Scene_Title.prototype.update;
        Scene_Title.prototype.update = function() {
            _Scene_Title_update.call(this);
            
            // Update Trivia Window
            if (this._triviaWindow) {
                this._triviaWindow.update();
            }
            if (this._customWindowBg && this._commandWindow) {
                this._updateCustomWindowBackground();
            }
            
            // Update all cards
            if (this._floatingContainer) {
                this._floatingContainer.children.forEach(c => c.update && c.update());
            }
            
            // Spawn new cards more frequently
            if (Math.random() < 0.008 && this._floatingContainer) {
                const newCard = new FloatingCard(getRandomData(), this._cardIdCounter++);
                this._floatingContainer.addChild(newCard);
            }
            
            if (!this._floatingContainer) return;
            
            const cards = this._floatingContainer.children;
            const currentPairs = new Set();
            
            // Generate all current card pair combinations using their unique IDs
            for (let i = 0; i < cards.length; i++) {
                for (let j = i + 1; j < cards.length; j++) {
                    const cardA = cards[i];
                    const cardB = cards[j];
                    
                    // Create a consistent key using the smaller ID first
                    const key = cardA._cardId < cardB._cardId 
                        ? `${cardA._cardId}_${cardB._cardId}` 
                        : `${cardB._cardId}_${cardA._cardId}`;
                    
                    currentPairs.add(key);
                    
                    // Create new connection if it doesn't exist
                    if (!this._connections[key]) {
                        this._connections[key] = { 
                            a: cardA, 
                            b: cardB, 
                            alpha: 0,
                            fadingIn: true
                        };
                    }
                }
            }
            
            const fadeSpeed = 0.03; // Slightly faster fade for better visibility
            
            // Update all connections
            for (const key in this._connections) {
                const conn = this._connections[key];
                
                if (currentPairs.has(key)) {
                    // Connection should exist - fade in
                    if (conn.fadingIn) {
                        conn.alpha = Math.min(conn.alpha + fadeSpeed, 0.4); // Higher max alpha
                        if (conn.alpha >= 0.4) {
                            conn.fadingIn = false;
                        }
                    }
                } else {
                    // Connection should not exist - fade out
                    conn.fadingIn = false;
                    conn.alpha -= fadeSpeed;
                    if (conn.alpha <= 0) {
                        delete this._connections[key];
                    }
                }
            }
            
            // Draw all connection lines
            if (this._lineGraphics) {
                this._lineGraphics.clear();
                for (const key in this._connections) {
                    const { a, b, alpha } = this._connections[key];
                    
                    // Make sure both cards still exist
                    if (a && b && a.parent && b.parent) {
                        // Gold connecting lines instead of green
                        this._lineGraphics.lineStyle(2, 0xFFD700, alpha); // Thicker gold lines
                        this._lineGraphics.moveTo(a.x + a.width/2, a.y + a.height/2);
                        this._lineGraphics.lineTo(b.x + b.width/2, b.y + b.height/2);
                    }
                }
            }
        };

        // Override itemTextAlign to force left alignment (backup method)
        const _Window_TitleCommand_itemTextAlign = Window_TitleCommand.prototype.itemTextAlign;
        Window_TitleCommand.prototype.itemTextAlign = function() {
            return 'left';
        };

        // Add Tutorial command to the title menu
        const _Window_TitleCommand_makeCommandList = Window_TitleCommand.prototype.makeCommandList;
        Window_TitleCommand.prototype.makeCommandList = function() {
            _Window_TitleCommand_makeCommandList.call(this);
            this.addCommand('Tutorial', 'tutorial');
        };

        // -------------------------------------------------------------------------
        // Terminal-style floating card with gold theme
        // -------------------------------------------------------------------------
        class FloatingCard extends PIXI.Container {
            constructor(data, cardId) {
                super();
                this._speed = 1 + Math.random();
                this._cardId = cardId; // Unique identifier for tracking connections
                this._draw(data);
            }
            
            _draw({ type, dbData }) {
                const padding = 12;
                const lineHeight = 16;
                let contentWidth = 280;
                let contentHeight = padding;
                const useTranslation = ConfigManager.language === 'it';

                // Terminal-style text styles with gold theme (smaller sizes)
                const headerStyle = new PIXI.TextStyle({ 
                    fontFamily: 'Terminus, Courier New, monospace',
                    fill: '#FFD700', // Gold instead of green
                    fontSize: 15, 
                    fontWeight: 'bold'
                });
                
                const normalStyle = new PIXI.TextStyle({ 
                    fontFamily: 'Terminus, Courier New, monospace',
                    fill: '#FFA500', // Orange-gold instead of cyan
                    fontSize: 13
                });
                
                const dimStyle = new PIXI.TextStyle({ 
                    fontFamily: 'Terminus, Courier New, monospace',
                    fill: '#808080',
                    fontSize: 11
                });
                
                const errorStyle = new PIXI.TextStyle({ 
                    fontFamily: 'Terminus, Courier New, monospace',
                    fill: '#FF6B35', // Orange-red instead of pure red
                    fontSize: 13,
                    fontWeight: 'bold'
                });
                
                const elements = [];
                
                // Terminal header with timestamp and type
                const timestamp = new Date().toISOString().slice(11, 19);
                const header = new PIXI.Text(`[${timestamp}] QUERY_TYPE:\n${type.toUpperCase()}`, dimStyle);
                header.x = padding;
                header.y = contentHeight;
                elements.push(header);
                contentHeight += header.height + 8;
                
                // Terminal prompt line
                const prompt = new PIXI.Text('> ', headerStyle);
                prompt.x = padding;
                prompt.y = contentHeight;
                elements.push(prompt);
                
                if (['item','weapon','armor'].includes(type)) {
                    // Terminal-style item display
                    const nameText = new PIXI.Text(`${window.translateText(dbData.name).toUpperCase()}`, headerStyle);
                    nameText.x = padding + prompt.width;
                    nameText.y = contentHeight;
                    elements.push(nameText);
                    contentHeight += nameText.height + 10;
                    
                    // ASCII-style separator
                    const separator = new PIXI.Text('='.repeat(40), dimStyle);
                    separator.x = padding;
                    separator.y = contentHeight;
                    elements.push(separator);
                    contentHeight += separator.height + 6;
                    
                    // Icon and ID reference
                    const bmp = ImageManager.loadSystem('IconSet');
                    const icon = new Sprite(bmp);
                    const idx = dbData.iconIndex;
                    icon.setFrame((idx % 16) * 32, Math.floor(idx / 16) * 32, 32, 32);
                    icon.x = padding;
                    icon.y = contentHeight;
                    elements.push(icon);
                    
                    // Get the actual database ID instead of icon index
                    const dbId = this._getDbId(type, dbData);
                    const iconText = new PIXI.Text(`[ID:${dbId.toString().padStart(3, '0')}]`, dimStyle);
                    iconText.x = padding + 40;
                    iconText.y = contentHeight + 8;
                    elements.push(iconText);
                    
                    // Move price to next line
                    contentHeight += Math.max(32, iconText.height) + 6;
                    const euroPrice = (dbData.price / 100).toFixed(2);
                    const priceText = new PIXI.Text(useTranslation?`PREZZO: ${euroPrice}€`:`PRICE: ${euroPrice}€`, errorStyle);
                    priceText.x = padding;
                    priceText.y = contentHeight;
                    elements.push(priceText);
                    contentHeight += priceText.height + 12;
                    
                    // Description with manual line breaks
                    const cleanDescription = window.translateText(dbData.description).replace(/\\n/g, ' ').replace(/\n/g, ' ');
                    const descLines = this._wrapTerminalText(cleanDescription, 28);
                    descLines.forEach((line, i) => {
                        const prefix = i === 0 ? 'DESC:\n' : '';
                        const desc = new PIXI.Text(prefix + line, normalStyle);
                        desc.x = padding;
                        desc.y = contentHeight;
                        elements.push(desc);
                        contentHeight += desc.height + 2;
                    });
                    
                } else if (type === 'enemy') {
                    const note = dbData.note || '';
                    const lv = (note.match(/LV:\s*(\d+)/i) || [])[1] || '0';
                    const descTxt = (note.match(/\|\s*([^<]+)/) || [])[1] || '';
                    
                    // Terminal-style enemy display
                    const nameText = new PIXI.Text(`${window.translateText(dbData.name).toUpperCase()}\n[LV.${lv}]`, headerStyle);
                    nameText.x = padding + prompt.width;
                    nameText.y = contentHeight;
                    elements.push(nameText);
                    contentHeight += nameText.height + 10;
                    
                    // ASCII-style separator
                    const separator = new PIXI.Text('-'.repeat(40), dimStyle);
                    separator.x = padding;
                    separator.y = contentHeight;
                    elements.push(separator);
                    contentHeight += separator.height + 6;
                    
                    // Character image and ID reference
                    const charMatch = note.match(/<Char:(\$[^>]+)>/i);
                    let hasCharImage = false;
                    
                    if (charMatch) {
                        try {
                            const charFileName = charMatch[1];
                            const charBmp = ImageManager.loadBitmap('./img/characters/Monsters/', charFileName);
                            const charSprite = new Sprite(charBmp);
                            charSprite.setFrame(0, 0, 32, 32);
                            charSprite.x = padding;
                            charSprite.y = contentHeight;
                            elements.push(charSprite);
                            hasCharImage = true;
                        } catch (e) {
                            console.warn(`Failed to load character image: ${charMatch[1]}`);
                        }
                    }
                    
                    // Get the actual database ID for enemy
                    const dbId = this._getDbId(type, dbData);
                    const charRef = new PIXI.Text(`[ID:${dbId.toString().padStart(3, '0')}]`, dimStyle);
                    charRef.x = hasCharImage ? padding + 40 : padding;
                    charRef.y = contentHeight + (hasCharImage ? 8 : 0);
                    elements.push(charRef);
                    contentHeight += Math.max(hasCharImage ? 32 : 0, charRef.height) + 12;
                    var stats;
                    // Stats in terminal format
                    stats = new PIXI.Text(
                        `STR=${dbData.params[2].toString().padStart(3, '0')} CON=${dbData.params[3].toString().padStart(3, '0')} INT=${dbData.params[4].toString().padStart(3, '0')}\nWIS=${dbData.params[5].toString().padStart(3, '0')} DEX=${dbData.params[6].toString().padStart(3, '0')} PSI=${dbData.params[7].toString().padStart(3, '0')}`,
                        errorStyle
                    );
                    if(useTranslation){
                        stats = new PIXI.Text(
                            `FRZ=${dbData.params[2].toString().padStart(3, '0')} COS=${dbData.params[3].toString().padStart(3, '0')} INT=${dbData.params[4].toString().padStart(3, '0')}\nSAG=${dbData.params[5].toString().padStart(3, '0')} DES=${dbData.params[6].toString().padStart(3, '0')} PSI=${dbData.params[7].toString().padStart(3, '0')}`,
                            errorStyle
                        );
                    }
                    stats.x = padding;
                    stats.y = contentHeight;
                    elements.push(stats);
                    contentHeight += stats.height + 10;
                    
                    // Description with manual line breaks
                    if (descTxt.trim()) {
                        const descLines = this._wrapTerminalText(descTxt.trim(), 28);
                        descLines.forEach((line, i) => {
                            const prefix = i === 0 ? 'INFO:\n' : '';
                            const desc = new PIXI.Text(prefix + line, normalStyle);
                            desc.x = padding;
                            desc.y = contentHeight;
                            elements.push(desc);
                            contentHeight += desc.height + 2;
                        });
                    }
                    
                } else if (type === 'skill') {
                    // Terminal-style skill display
                    const nameText = new PIXI.Text(`${window.translateText(dbData.name).toUpperCase()}`, headerStyle);
                    nameText.x = padding + prompt.width;
                    nameText.y = contentHeight;
                    elements.push(nameText);
                    contentHeight += nameText.height + 10;
                    
                    // ASCII-style separator
                    const separator = new PIXI.Text('~'.repeat(40), dimStyle);
                    separator.x = padding;
                    separator.y = contentHeight;
                    elements.push(separator);
                    contentHeight += separator.height + 6;
                    
                    // Icon and ID reference
                    const bmp = ImageManager.loadSystem('IconSet');
                    const icon = new Sprite(bmp);
                    const idx = dbData.iconIndex;
                    icon.setFrame((idx % 16) * 32, Math.floor(idx / 16) * 32, 32, 32);
                    icon.x = padding;
                    icon.y = contentHeight;
                    elements.push(icon);
                    
                    // Get the actual database ID for skill
                    const dbId = this._getDbId(type, dbData);
                    const iconText = new PIXI.Text(`[ID:${dbId.toString().padStart(3, '0')}]`, dimStyle);
                    iconText.x = padding + 40;
                    iconText.y = contentHeight + 8;
                    elements.push(iconText);
                    contentHeight += Math.max(32, iconText.height) + 12;
                    
                    // Description with manual line breaks
                    const cleanDescription = window.translateText(dbData.description).replace(/\\n/g, ' ').replace(/\n/g, ' ');
                    const descLines = this._wrapTerminalText(cleanDescription, 35);
                    descLines.forEach((line, i) => {
                        const prefix = i === 0 ? 'EXEC:\n' : '';
                        const desc = new PIXI.Text(prefix + line, normalStyle);
                        desc.x = padding;
                        desc.y = contentHeight;
                        elements.push(desc);
                        contentHeight += desc.height + 3;
                    });
                }
                
                // Terminal footer
                contentHeight += 8;
                const footer = new PIXI.Text('EOF', dimStyle);
                footer.x = padding;
                footer.y = contentHeight;
                elements.push(footer);
                contentHeight += footer.height + padding;
                
                // Draw terminal-style background with gold theme
                const g = new PIXI.Graphics();
                // Dark terminal background
                g.beginFill(0x000000, 0.9);
                // Terminal-style border (double line) in gold
                g.lineStyle(1, 0xFFD700, 0.8); // Gold border
                g.drawRect(0, 0, contentWidth, contentHeight);
                g.lineStyle(1, 0xFFD700, 0.4); // Dimmer gold inner border
                g.drawRect(2, 2, contentWidth - 4, contentHeight - 4);
                g.endFill();
                
                this.addChild(g);
                
                // Add all elements
                elements.forEach(element => this.addChild(element));
                
                // Set card dimensions and position with better spacing
                this.width = contentWidth;
                this.height = contentHeight;
                
                // Calculate grid-like positioning to reduce overlap
                const screenMargin = Graphics.width * 0.05;
                const availableWidth = Graphics.width * 0.9;
                const cardSpacing = contentWidth + 40; // Add 40px spacing between cards
                const cardsPerRow = Math.floor(availableWidth / cardSpacing);
                
                // Use card ID to determine position for consistent spacing
                const cardIndex = this._cardId % (cardsPerRow * 3); // 3 rows of spacing
                const rowIndex = Math.floor(cardIndex / cardsPerRow);
                const colIndex = cardIndex % cardsPerRow;
                
                // Calculate base position with spacing
                const baseX = screenMargin + (colIndex * cardSpacing);
                const baseY = Graphics.height + (rowIndex * 150); // Stagger Y starting positions
                
                // Add some randomness but keep spacing
                this.x = baseX + (Math.random() - 0.5) * 30; // Small random offset
                this.y = baseY + Math.random() * 80; // Random Y offset within range
            }
            
            _getDbId(type, dbData) {
                // Find the actual database ID by searching through the appropriate array
                const map = { 
                    enemy: $dataEnemies, 
                    skill: $dataSkills, 
                    item: $dataItems, 
                    weapon: $dataWeapons, 
                    armor: $dataArmors 
                };
                
                const dataArray = map[type];
                for (let i = 0; i < dataArray.length; i++) {
                    if (dataArray[i] === dbData) {
                        return i;
                    }
                }
                return 0; // fallback
            }
            
            _wrapTerminalText(text, maxChars) {
                const words = text.split(' ');
                const lines = [];
                let currentLine = '';
                
                words.forEach(word => {
                    if ((currentLine + word).length <= maxChars) {
                        currentLine += (currentLine ? ' ' : '') + word;
                    } else {
                        if (currentLine) lines.push(currentLine);
                        currentLine = word;
                        // If a single word is too long, force break it
                        if (word.length > maxChars) {
                            const chunks = [];
                            for (let i = 0; i < word.length; i += maxChars) {
                                chunks.push(word.slice(i, i + maxChars));
                            }
                            lines.push(...chunks.slice(0, -1));
                            currentLine = chunks[chunks.length - 1];
                        }
                    }
                });
                if (currentLine) lines.push(currentLine);
                
                return lines;
            }
            
            update() {
                this.y -= this._speed;
                
                // Remove CRT flicker effects - just keep steady alpha
                this.alpha = 1.0;
                
                if (this.y + this.height < 0 && this.parent) {
                    this.parent.removeChild(this);
                }
            }
        }

        // -------------------------------------------------------------------------
        // Random DB picker
        // -------------------------------------------------------------------------
        const TYPES = ['enemy','skill','item','weapon','armor'];
        function getRandomData() {
            const t = TYPES[Math.floor(Math.random() * TYPES.length)];
            const map = { enemy: $dataEnemies, skill: $dataSkills, item: $dataItems, weapon: $dataWeapons, armor: $dataArmors };
            let entry;
            do { entry = map[t][Math.floor(Math.random() * map[t].length)]; } while (!entry);
            return { type: t, dbData: entry };
        }

        // -------------------------------------------------------------------------
        // Scene_Title mesh + cards with fixed connection tracking and hover interaction
        // -------------------------------------------------------------------------
        const _Scene_Title_create = Scene_Title.prototype.create;
        Scene_Title.prototype.create = function() {
            _Scene_Title_create.call(this);
            this._connections = {};
            this._cardIdCounter = 0; // Counter for unique card IDs
            this._lineGraphics = new PIXI.Graphics();
            this.addChildAt(this._lineGraphics, 0);
            this._floatingContainer = new PIXI.Container();
            this.addChildAt(this._floatingContainer, 1);
            
            // Create and add logo image
            this._logoSprite = new LogoSprite();
            this.addChild(this._logoSprite);

            // Create and add Trivia Window
            this._triviaWindow = new TriviaWindow();
            this.addChild(this._triviaWindow);
            
            // Spawn more initial cards with staggered timing
            for (let i = 0; i < 8; i++) {
                setTimeout(() => {
                    const newCard = new FloatingCard(getRandomData(), this._cardIdCounter++);
                    this._floatingContainer.addChild(newCard);
                }, i * 300); // Faster stagger for more cards
            }
        };

        const parameters = PluginManager.parameters(pluginName);
        const heightMultiplier = parseFloat(parameters['heightMultiplier']) || 2.0;
    
        // Simply make the command window taller
        const _Scene_Title_commandWindowRect = Scene_Title.prototype.commandWindowRect;
        Scene_Title.prototype.commandWindowRect = function() {
            const rect = _Scene_Title_commandWindowRect.call(this);
            
            // Make the window taller
            rect.height = rect.height * heightMultiplier;
            
            // Keep it within screen bounds
            const maxHeight = Graphics.height - rect.y - 20;
            if (rect.height > maxHeight) {
                rect.height = maxHeight;
            }
            
            return rect;
        };
    // -------------------------------------------------------------------------
// Trivia Window Class
// -------------------------------------------------------------------------
class TriviaWindow extends PIXI.Container {
    constructor() {
        super();
        
        this._width = 380;
        this._height = 140;
        this._padding = 12;
        this._textWidth = this._width - this._padding * 2;
        this._cycleTime = 800; // 10 seconds per trivia (60fps * 10)

        this.x = Graphics.width - this._width - 20;
        this.y = Graphics.height - this._height - 20;

        this._triviaTimer = 0;
        this._isFadingIn = false;
        this._isFadingOut = false;
        
        // Randomize trivia order
        this._shuffledTrivia = this._shuffleArray([...Array(TRIVIA.length).keys()]);
        this._currentShuffleIndex = 0;

        this._background = new PIXI.Graphics();
        this._drawBackground();
        this.addChild(this._background);

        const triviaStyle = new PIXI.TextStyle({
            fontFamily: 'Terminus, Courier New, monospace',
            fill: '#FFA500', // Orange-gold
            fontSize: 13,
            wordWrap: true,
            wordWrapWidth: this._textWidth,
            lineHeight: 16
        });

        this._text = new PIXI.Text('', triviaStyle);
        this._text.x = this._padding;
        this._text.y = this._padding;
        this._text.alpha = 0;
        this.addChild(this._text);

        this._showNextTrivia(true); // Initial load
    }

    _shuffleArray(array) {
        // Fisher-Yates shuffle
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    }

    _drawBackground() {
        const g = this._background;
        g.clear();
        // Dark terminal background
        g.beginFill(0x000000, 0.7);
        // Terminal-style border (double line) in gold
        g.lineStyle(2, 0xFFD700, 1); // Gold border
        g.drawRect(0, 0, this._width, this._height);
        g.lineStyle(1, 0xFFD700, 0.4); // Dimmer gold inner border
        g.drawRect(3, 3, this._width - 6, this._height - 6);
        g.endFill();
    }

    // Copied from FloatingCard
    _wrapTerminalText(text, maxChars) {
        const words = text.split(' ');
        const lines = [];
        let currentLine = '';
        
        words.forEach(word => {
            if ((currentLine + word).length <= maxChars) {
                currentLine += (currentLine ? ' ' : '') + word;
            } else {
                if (currentLine) lines.push(currentLine);
                currentLine = word;
                if (word.length > maxChars) {
                    const chunks = [];
                    for (let i = 0; i < word.length; i += maxChars) {
                        chunks.push(word.slice(i, i + maxChars));
                    }
                    lines.push(...chunks.slice(0, -1));
                    currentLine = chunks[chunks.length - 1];
                }
            }
        });
        if (currentLine) lines.push(currentLine);
        
        // This is a rough character count limit; we'll limit by lines
        const maxLines = 6; 
        return lines.slice(0, maxLines);
    }

    _showNextTrivia(isInitial = false) {
        const triviaIndex = this._shuffledTrivia[this._currentShuffleIndex];
        const trivia = TRIVIA[triviaIndex];
        if (!trivia) return;

        const useTranslation = ConfigManager.language === 'it';
        const rawText = useTranslation ? trivia.it : trivia.en;
        
        // Use the global translate function (assumed from FloatingCard)
        const text = window.translateText(rawText); 
        
        // Use a 45-char limit for wrapping
        const lines = this._wrapTerminalText(text, 45); 
        this._text.text = "TRIVIA:\n" + lines.join('\n');
        
        this._isFadingIn = true;
        this._isFadingOut = false;
        
        if (isInitial) {
            this._text.alpha = 1.0;
            this._isFadingIn = false;
        }
    }

    update() {
        this._triviaTimer++;

        // Handle text fade in/out
        if (this._isFadingIn) {
            this._text.alpha = Math.min(this._text.alpha + 0.03, 1.0);
            if (this._text.alpha >= 1.0) {
                this._isFadingIn = false;
            }
        } else if (this._isFadingOut) {
            this._text.alpha = Math.max(this._text.alpha - 0.03, 0.0);
            if (this._text.alpha <= 0.0) {
                this._isFadingOut = false;
                // Change text *after* fade out
                this._currentShuffleIndex = (this._currentShuffleIndex + 1) % this._shuffledTrivia.length;
                // Re-shuffle when we've gone through all trivia
                if (this._currentShuffleIndex === 0) {
                    this._shuffledTrivia = this._shuffleArray([...Array(TRIVIA.length).keys()]);
                }
                this._showNextTrivia();
            }
        }

        // Check if it's time to cycle
        if (this._triviaTimer >= this._cycleTime && !this._isFadingIn && !this._isFadingOut) {
            this._isFadingOut = true;
            this._triviaTimer = 0;
        }
    }
}
    })();
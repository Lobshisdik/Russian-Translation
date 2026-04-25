/*:
 * @target MZ
 * @plugindesc Scratching Card System v2.0.0
 * @author Omni-Lex
 * @help
 * ============================================================================
 * Scratching Card System Plugin
 * ============================================================================
 * 
 * This plugin adds a scratching card minigame to your RPGMaker game.
 * 
 * How to use:
 * 1. Install this plugin in your project
 * 2. Use the plugin command "Open Scratch Card" in an event
 * 3. Select the card style you want
 * 4. Players press OK to reveal cells one by one
 * 5. Matching symbols = win!
 * 
 * Gold Conversion:
 * 1 Euro = 100 Gold
 * Example: €12.23 = 1,223 gold
 * 
 * @command openScratchCard
 * @text Open Scratch Card
 * @desc Opens the scratching card interface
 * 
 * @arg style
 * @text Card Style
 * @type select
 * @option Esoteric
 * @value esoteric
 * @option Corporate
 * @value corporate
 * @option Vacation
 * @value vacation
 * @option Hypercapitalist
 * @value hypercapitalist
 * @default esoteric
 * @desc Select the style of scratch card
 * 
 * @command openEsotericCard
 * @text Open Esoteric Card
 * @desc Opens an esoteric style scratch card
 * 
 * @command openCorporateCard
 * @text Open Corporate Card
 * @desc Opens a corporate style scratch card
 * 
 * @command openVacationCard
 * @text Open Vacation Card
 * @desc Opens a vacation style scratch card
 * 
 * @command openHypercapitalistCard
 * @text Open Hypercapitalist Card
 * @desc Opens a hypercapitalist style scratch card
 */

(() => {
    'use strict';

    const pluginName = 'ScratchingCardSystem';
    
    // Card Styles Configuration
    const cardStyles = {
        esoteric: {
            title: {
                en: "Scratch & Curse",
                it: "Gratta & Maledici"
            },
            symbols: ["🔮", "⚗️", "🌙", "✨", "🕯️", "👁️", "🪬", "🔯", "☯️", "🎴"],
            bgColor: '#1a0033',
            fgColor: '#9933ff',
            maxWin: 10000,
            jackpotOdds: 1 / 500000
        },
        corporate: {
            title: {
                en: "Scratch & Profit",
                it: "Gratta & Profitto"
            },
            symbols: ["💼", "📊", "💰", "📈", "🏢", "💳", "🖊️", "📋", "💵", "🎯"],
            bgColor: '#003366',
            fgColor: '#0099cc',
            maxWin: 500000,
            jackpotOdds: 1 / 10000000
        },
        vacation: {
            title: {
                en: "Scratch & Relax",
                it: "Gratta & Relax"
            },
            symbols: ["🏖️", "🌴", "☀️", "🍹", "✈️", "🏝️", "🌊", "🦩", "🌺", "⛱️"],
            bgColor: '#00cccc',
            fgColor: '#ff9933',
            maxWin: 500000,
            jackpotOdds: 1 / 10000000
        },
        hypercapitalist: {
            title: {
                en: "Scratch & Dominate",
                it: "Gratta & Domina"
            },
            symbols: ["💎", "🏦", "🚁", "🏰", "👑", "🍾", "💸", "🎰", "🏆", "⚜️"],
            bgColor: '#330000',
            fgColor: '#ffcc00',
            maxWin: 500000,
            jackpotOdds: 1 / 10000000
        }
    };

    // Prize tiers
    const prizeTiers = {
        standard: [
            { euros: 0, odds: 0.65 },
            { euros: 3, odds: 0.15 },
            { euros: 5, odds: 0.10 },
            { euros: 10, odds: 0.05 },
            { euros: 20, odds: 0.025 },
            { euros: 50, odds: 0.015 },
            { euros: 100, odds: 0.008 },
            { euros: 500, odds: 0.0015 },
            { euros: 1000, odds: 0.0004 },
            { euros: 5000, odds: 0.00008 },
            { euros: 10000, odds: 0.000015 },
            { euros: 50000, odds: 0.0000045 },
            { euros: 100000, odds: 0.0000005 },
            { euros: 500000, odds: 0.0000001 }
        ],
        esoteric: [
            { euros: 0, odds: 0.65 },
            { euros: 3, odds: 0.15 },
            { euros: 5, odds: 0.10 },
            { euros: 10, odds: 0.05 },
            { euros: 20, odds: 0.025 },
            { euros: 50, odds: 0.015 },
            { euros: 100, odds: 0.008 },
            { euros: 500, odds: 0.0015 },
            { euros: 1000, odds: 0.0004 },
            { euros: 5000, odds: 0.00008 },
            { euros: 10000, odds: 0.000002 }
        ]
    };

    // Custom Sprite-based Card Display (instead of Window)
    class Sprite_ScratchCard extends Sprite {
        constructor(style) {
            super();
            
            this.style = cardStyles[style] || cardStyles.esoteric;
            this.currentStyle = style;
            this.cells = [];
            this.revealed = [];
            this.isComplete = false;
            this.wonAmount = 0;
            
            // Create bitmap for drawing
            this.bitmap = new Bitmap(600, 500);
            
            // Position at center
            this.x = (Graphics.boxWidth - 600) / 2;
            this.y = (Graphics.boxHeight - 500) / 2;
            
            this.initializeCard();
            this.refresh();
        }

        initializeCard() {
            // Generate prize first
            this.wonAmount = this.generatePrize();
            
            // Initialize cells with random symbols
            for (let i = 0; i < 10; i++) {
                const symbol = this.style.symbols[Math.floor(Math.random() * this.style.symbols.length)];
                this.cells.push(symbol);
                this.revealed.push(false);
            }
            
            // If player won, ensure at least 3 matching symbols
            if (this.wonAmount > 0) {
                const winSymbol = this.style.symbols[Math.floor(Math.random() * this.style.symbols.length)];
                const positions = [];
                while (positions.length < 3) {
                    const pos = Math.floor(Math.random() * 10);
                    if (!positions.includes(pos)) {
                        positions.push(pos);
                        this.cells[pos] = winSymbol;
                    }
                }
            }
        }

        generatePrize() {
            const tiers = this.currentStyle === 'esoteric' ? prizeTiers.esoteric : prizeTiers.standard;
            const roll = Math.random();
            let cumulative = 0;
            
            for (const tier of tiers) {
                cumulative += tier.odds;
                if (roll <= cumulative) {
                    return tier.euros;
                }
            }
            
            return 0;
        }

        refresh() {
            this.bitmap.clear();
            
            // Draw solid black background
            this.bitmap.fillRect(0, 0, 600, 500, '#000000');
            
            // Draw card frame
            this.bitmap.fillRect(10, 10, 580, 480, '#222222');
            this.bitmap.fillRect(15, 15, 570, 470, '#000000');
            
            this.drawTitle();
            this.drawCells();
            this.drawInstructions();
            
            if (this.isComplete) {
                this.drawResult();
            }
        }

        drawTitle() {
            const lang = typeof ConfigManager !== 'undefined' && ConfigManager.language === 'it' ? 'it' : 'en';
            const title = this.style.title[lang];
            
            this.bitmap.fontSize = 32;
            this.bitmap.textColor = this.style.fgColor;
            this.bitmap.outlineColor = 'rgba(0, 0, 0, 1)';
            this.bitmap.outlineWidth = 6;
            this.bitmap.drawText(title, 0, 20, 600, 40, 'center');
        }

        drawCells() {
            const cellWidth = 80;
            const cellHeight = 80;
            const startX = (600 - (5 * cellWidth + 4 * 20)) / 2;
            const startY = 120;
            
            for (let row = 0; row < 2; row++) {
                for (let col = 0; col < 5; col++) {
                    const index = row * 5 + col;
                    const x = startX + col * (cellWidth + 20);
                    const y = startY + row * (cellHeight + 30);
                    
                    if (this.revealed[index]) {
                        // Draw revealed cell
                        this.bitmap.fillRect(x + 3, y + 3, cellWidth, cellHeight, 'rgba(0, 0, 0, 0.8)');
                        this.bitmap.fillRect(x, y, cellWidth, cellHeight, '#ffffff');
                        this.bitmap.fillRect(x + 2, y + 2, cellWidth - 4, cellHeight - 4, '#f0f0f0');
                        
                        // Draw symbol - PROPERLY CENTERED
                        this.bitmap.fontSize = 48;
                        this.bitmap.textColor = '#000000';
                        this.bitmap.outlineWidth = 0;
                        
                        // Calculate proper centering for the symbol
                        const symbolX = x;
                        const symbolY = y + (cellHeight - 48) / 2; // Center vertically based on font size
                        this.bitmap.drawText(this.cells[index], symbolX, symbolY, cellWidth, 48, 'center');
                    } else {
                        // Draw unrevealed cell
                        this.bitmap.fillRect(x + 2, y + 2, cellWidth, cellHeight, 'rgba(0, 0, 0, 0.5)');
                        this.bitmap.fillRect(x, y, cellWidth, cellHeight, '#888888');
                        this.bitmap.fillRect(x + 2, y + 2, cellWidth - 4, cellHeight - 4, '#bbbbbb');
                        
                        // Draw scratch pattern
                        for (let i = 0; i < 3; i++) {
                            const lineY = y + 20 + i * 20;
                            this.bitmap.fillRect(x + 10, lineY, cellWidth - 20, 2, '#999999');
                        }
                        
                        // Draw question mark - PROPERLY CENTERED
                        this.bitmap.fontSize = 36;
                        this.bitmap.textColor = '#666666';
                        this.bitmap.outlineWidth = 0;
                        
                        // Calculate proper centering for the question mark
                        const questionX = x;
                        const questionY = y + (cellHeight - 36) / 2; // Center vertically based on font size
                        this.bitmap.drawText('?', questionX, questionY, cellWidth, 36, 'center');
                    }
                }
            }
        }
        drawInstructions() {
            if (!this.isComplete) {
                const lang = typeof ConfigManager !== 'undefined' && ConfigManager.language === 'it' ? 'it' : 'en';
                const text = lang === 'it' ? 
                    'Premi OK per grattare una casella' : 
                    'Press OK to scratch a cell';
                
                const remaining = this.cells.filter((_, i) => !this.revealed[i]).length;
                const remainingText = lang === 'it' ? 
                    `Caselle rimanenti: ${remaining}` : 
                    `Cells remaining: ${remaining}`;
                
                this.bitmap.fontSize = 20;
                this.bitmap.textColor = '#ffffff';
                this.bitmap.outlineColor = 'rgba(0, 0, 0, 1)';
                this.bitmap.outlineWidth = 4;
                this.bitmap.drawText(text, 0, 340, 600, 30, 'center');
                
                this.bitmap.fontSize = 16;
                this.bitmap.drawText(remainingText, 0, 365, 600, 25, 'center');
            }
        }

        drawResult() {
            const lang = typeof ConfigManager !== 'undefined' && ConfigManager.language === 'it' ? 'it' : 'en';
            let resultText;
            
            // Draw result box
            const boxX = 50;
            const boxY = 380;
            const boxWidth = 500;
            const boxHeight = 80;
            
            if (this.wonAmount > 0) {
                // Win effect - solid green background
                this.bitmap.fillRect(boxX, boxY, boxWidth, boxHeight, 'rgba(0, 80, 0, 1)');
                this.bitmap.fillRect(boxX + 2, boxY + 2, boxWidth - 4, boxHeight - 4, 'rgba(0, 40, 0, 1)');
                
                resultText = lang === 'it' ? 
                    `HAI VINTO €${this.wonAmount.toFixed(2)}!` : 
                    `YOU WON €${this.wonAmount.toFixed(2)}!`;
                this.bitmap.textColor = '#00ff00';
                
            } else {
                // Lose effect - solid red background
                this.bitmap.fillRect(boxX, boxY, boxWidth, boxHeight, 'rgba(80, 0, 0, 1)');
                this.bitmap.fillRect(boxX + 2, boxY + 2, boxWidth - 4, boxHeight - 4, 'rgba(40, 0, 0, 1)');
                
                resultText = lang === 'it' ? 
                    'Non hai vinto. Riprova!' : 
                    'No win. Try again!';
                this.bitmap.textColor = '#ff6666';
            }
            
            this.bitmap.fontSize = 28;
            this.bitmap.outlineColor = 'rgba(0, 0, 0, 1)';
            this.bitmap.outlineWidth = 6;
            this.bitmap.drawText(resultText, 0, 385, 600, 40, 'center');
            
            const exitText = lang === 'it' ? 
                'Premi OK o ESC per continuare' : 
                'Press OK or ESC to continue';
            this.bitmap.fontSize = 16;
            this.bitmap.textColor = '#ffffff';
            this.bitmap.drawText(exitText, 0, 440, 600, 30, 'center');
        }

        revealRandomCell() {
            const unrevealedIndices = [];
            for (let i = 0; i < 10; i++) {
                if (!this.revealed[i]) {
                    unrevealedIndices.push(i);
                }
            }
            
            if (unrevealedIndices.length > 0) {
                const randomIndex = unrevealedIndices[Math.floor(Math.random() * unrevealedIndices.length)];
                this.revealed[randomIndex] = true;
                
                // Play scratch sound
                AudioManager.playSe({ name: 'Cursor2', volume: 90, pitch: 100, pan: 0 });
                
                if (unrevealedIndices.length === 1) {
                    // All cells revealed
                    this.completeCard();
                }
                
                this.refresh();
            }
        }

        completeCard() {
            this.isComplete = true;
            
            if (this.wonAmount > 0) {
                // Convert euros to gold (1 euro = 100 gold)
                const goldAmount = Math.floor(this.wonAmount * 100);
                $gameParty.gainGold(goldAmount);
                
                // Play win sound
                if (this.wonAmount >= 100) {
                    AudioManager.playSe({ name: 'Fanfare1', volume: 100, pitch: 100, pan: 0 });
                } else {
                    AudioManager.playSe({ name: 'Item1', volume: 90, pitch: 100, pan: 0 });
                }
                
                // Store win in variables for potential use
                if ($gameVariables) {
                    $gameVariables.setValue(100, this.wonAmount);
                }
            } else {
                // Play lose sound
                AudioManager.playSe({ name: 'Buzzer1', volume: 90, pitch: 100, pan: 0 });
            }
        }
    }

    // Refactored Scene using Sprites instead of Windows
    class Scene_ScratchCard extends Scene_Base {
        constructor() {
            super();
            this._style = 'esoteric';
        }

        prepare(style) {
            this._style = style || 'esoteric';
        }

        create() {
            super.create();
            this.createBackground();
            this.createScratchCard();
        }

        createBackground() {
            // Create solid black background
            this._blackBackground = new Sprite();
            this._blackBackground.bitmap = new Bitmap(Graphics.width, Graphics.height);
            this._blackBackground.bitmap.fillRect(0, 0, Graphics.width, Graphics.height, '#000000');
            this.addChild(this._blackBackground);
        }

        createScratchCard() {
            this._scratchCard = new Sprite_ScratchCard(this._style);
            this.addChild(this._scratchCard);
        }

        update() {
            super.update();
            
            if (Input.isTriggered('ok')) {
                this.processOk();
            } else if (Input.isTriggered('cancel')) {
                this.processCancel();
            }
        }

        processOk() {
            if (this._scratchCard.isComplete) {
                this.popScene();
            } else {
                this._scratchCard.revealRandomCell();
            }
        }

        processCancel() {
            if (this._scratchCard.isComplete) {
                this.popScene();
            }
        }

        terminate() {
            super.terminate();
            // Clean up bitmaps to prevent memory leaks
            if (this._blackBackground && this._blackBackground.bitmap) {
                this._blackBackground.bitmap.destroy();
            }
            if (this._scratchCard && this._scratchCard.bitmap) {
                this._scratchCard.bitmap.destroy();
            }
        }
    }

    // Plugin Commands Registration
    PluginManager.registerCommand(pluginName, 'openScratchCard', function(args) {
        const style = args.style || 'esoteric';
        SceneManager.push(Scene_ScratchCard);
        SceneManager.prepareNextScene(style);
    });
    
    PluginManager.registerCommand(pluginName, 'openEsotericCard', function() {
        SceneManager.push(Scene_ScratchCard);
        SceneManager.prepareNextScene('esoteric');
    });
    
    PluginManager.registerCommand(pluginName, 'openCorporateCard', function() {
        SceneManager.push(Scene_ScratchCard);
        SceneManager.prepareNextScene('corporate');
    });
    
    PluginManager.registerCommand(pluginName, 'openVacationCard', function() {
        SceneManager.push(Scene_ScratchCard);
        SceneManager.prepareNextScene('vacation');
    });
    
    PluginManager.registerCommand(pluginName, 'openHypercapitalistCard', function() {
        SceneManager.push(Scene_ScratchCard);
        SceneManager.prepareNextScene('hypercapitalist');
    });

    // Make classes globally available
    window.Scene_ScratchCard = Scene_ScratchCard;
    window.Sprite_ScratchCard = Sprite_ScratchCard;
    
    // Script call method for easier access
    window.openScratchCard = function(style = 'esoteric') {
        SceneManager.push(Scene_ScratchCard);
        SceneManager.prepareNextScene(style);
    };
})();
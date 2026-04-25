/*:
 * @target MZ
 * @plugindesc Animated Tarot Card Reading System v1.0.0
 * @author Omni-Lex
 * @help
 * ============================================================================
 * Animated Tarot Reading Plugin
 * ============================================================================
 * 
 * This plugin creates an animated tarot card reading system with a 3-card
 * spread showing Past, Present, and Future.
 * 
 * Setup:
 * 1. Create a folder named "arcana" inside img/
 * 2. Place your tarot card PNG files named 1.png, 2.png, etc. (1-22)
 * 3. Each number corresponds to a Major Arcana card
 * 
 * The plugin supports both upright and reversed card meanings, with
 * automatic translation support for Italian.
 * 
 * @command openTarot
 * @text Open Tarot Reading
 * @desc Opens the tarot card reading interface
 * 
 * @command readTarotToNPC
 * @text Read Tarot to NPC
 * @desc Read tarot cards to an NPC with a guessing game
 * 
 * @arg npcName
 * @text NPC Name
 * @desc Name of the NPC receiving the reading
 * @type string
 * @default Villager
 * 
 * @arg perfectMessage
 * @text Perfect Score Message
 * @desc Message when all 3 cards are guessed correctly
 * @type multiline_string
 * @default Amazing! Your reading was perfectly accurate!\nI'm impressed by your mystical abilities!
 * 
 * @arg goodMessage
 * @text Good Score Message
 * @desc Message when 2 cards are guessed correctly
 * @type multiline_string
 * @default Good reading! You got most of it right.\nYou have real potential as a fortune teller.
 * 
 * @arg averageMessage
 * @text Average Score Message
 * @desc Message when 1 card is guessed correctly
 * @type multiline_string
 * @default Your reading was partially correct.\nPerhaps you need more practice with the cards.
 * 
 * @arg poorMessage
 * @text Poor Score Message
 * @desc Message when no cards are guessed correctly
 * @type multiline_string
 * @default That reading didn't resonate with me at all...\nMaybe the spirits weren't speaking clearly today.
 * 
 */
const { TarotMeanings } = window.ProstheticsData;

(() => {
    'use strict';

    const pluginName = 'AnimatedTarotReading';

    // Tarot card meanings database
 

    // Plugin Commands
    PluginManager.registerCommand(pluginName, 'openTarot', args => {
        SceneManager.push(Scene_Tarot);
    });

    PluginManager.registerCommand(pluginName, 'readTarotToNPC', args => {
        const npcData = {
            name: args.npcName || 'Villager',
            perfectMessage: args.perfectMessage || "Amazing! Your reading was perfectly accurate!\nI'm impressed by your mystical abilities!",
            goodMessage: args.goodMessage || "Good reading! You got most of it right.\nYou have real potential as a fortune teller.",
            averageMessage: args.averageMessage || "Your reading was partially correct.\nPerhaps you need more practice with the cards.",
            poorMessage: args.poorMessage || "That reading didn't resonate with me at all...\nMaybe the spirits weren't speaking clearly today."
        };
        SceneManager.push(Scene_TarotNPC);
        SceneManager._scene._npcData = npcData;
    });

    // Scene_Tarot
    class Scene_Tarot extends Scene_MenuBase  {
        create() {
            super.create();
            this._cards = [];
            this._selectedCards = [];
            this._isRevealed = [false, false, false];
            this._cardSprites = [];
            this._isAnimating = false;
            this._currentRevealIndex = 0;
            this.createBackground();
            this.createWindows();
            this.shuffleAndDealCards();
        }

        createBackground() {
            this._backgroundSprite = new Sprite();
            this._backgroundSprite.bitmap = new Bitmap(Graphics.width, Graphics.height);
            this._backgroundSprite.bitmap.fillAll('rgba(0, 0, 0, 0.8)');
            this.addChild(this._backgroundSprite);
        }

        createWindows() {
            this.createTitleWindow();
            this.createSpreadWindow();
            this.createMeaningWindow();
            this.createInstructionWindow();
        }

        createTitleWindow() {
            const rect = this.titleWindowRect();
            this._titleWindow = new Window_Base(rect);
            this._titleWindow.drawText(this.getLocalizedText('title'), 0, 0, rect.width - 32, 'center');
            this.addWindow(this._titleWindow);
        }

        titleWindowRect() {
            const width = 400;
            const height = 80;
            const x = (Graphics.width - width) / 2;
            const y = 20;
            return new Rectangle(x, y, width, height);
        }

        createSpreadWindow() {
            const rect = this.spreadWindowRect();
            this._spreadWindow = new Window_Base(rect);
            this.addWindow(this._spreadWindow);
            this.updateSpreadLabels();
        }

        spreadWindowRect() {
            const width = Graphics.width - 100;
            const height = 400;
            const x = 50;
            const y = 120;
            return new Rectangle(x, y, width, height);
        }

        createMeaningWindow() {
            const rect = this.meaningWindowRect();
            this._meaningWindow = new Window_Base(rect);
            this._meaningWindow.hide();
            this.addWindow(this._meaningWindow);
        }

        meaningWindowRect() {
            const width = 600;
            const height = 200;
            const x = (Graphics.width - width) / 2;
            const y = Graphics.height - height - 20;
            return new Rectangle(x, y, width, height);
        }

        createInstructionWindow() {
            const rect = this.instructionWindowRect();
            this._instructionWindow = new Window_Base(rect);
            this._instructionWindow.drawText(this.getLocalizedText('instruction'), 0, 0, rect.width - 32, 'center');
            this.addWindow(this._instructionWindow);
        }

        instructionWindowRect() {
            const width = 500;
            const height = 60;
            const x = (Graphics.width - width) / 2;
            const y = Graphics.height - 100;
            return new Rectangle(x, y, width, height);
        }

        updateSpreadLabels() {
            this._spreadWindow.contents.clear();
            const positions = ['past', 'present', 'future'];
            const spacing = (this._spreadWindow.width - 32) / 3;
            
            positions.forEach((pos, index) => {
                const x = spacing * index + spacing / 2 - 50;
                const text = this.getLocalizedText(pos);
                this._spreadWindow.drawText(text, x, 10, 100, 'center');
            });
        }

        shuffleAndDealCards() {
            // Generate array of card numbers (1-22)
            const allCards = Array.from({length: 22}, (_, i) => i + 1);
            
            // Shuffle cards
            for (let i = allCards.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [allCards[i], allCards[j]] = [allCards[j], allCards[i]];
            }
            
            // Select 3 cards with random orientations
            for (let i = 0; i < 3; i++) {
                this._selectedCards.push({
                    number: allCards[i],
                    isReversed: Math.random() < 0.5
                });
            }
            
            // Create card sprites
            this.createCardSprites();
        }

        createCardSprites() {
            const spacing = (this._spreadWindow.width - 32) / 3;
            const cardWidth = 120;
            const cardHeight = 180;
            
            for (let i = 0; i < 3; i++) {
                const x = this._spreadWindow.x + spacing * i + spacing / 2 - cardWidth / 2;
                const y = this._spreadWindow.y + 80;
                
                // Card back sprite
                const cardBack = new Sprite();
                cardBack.bitmap = new Bitmap(cardWidth, cardHeight);
                cardBack.bitmap.fillAll('#1a1a2e');
                cardBack.bitmap.strokeRect(0, 0, cardWidth, cardHeight, '#eee', 2);
                
                // Draw decorative pattern on card back
                const ctx = cardBack.bitmap.context;
                ctx.save();
                ctx.strokeStyle = '#16213e';
                ctx.lineWidth = 1;
                for (let j = 10; j < cardWidth; j += 20) {
                    ctx.beginPath();
                    ctx.moveTo(j, 0);
                    ctx.lineTo(j, cardHeight);
                    ctx.stroke();
                }
                for (let j = 10; j < cardHeight; j += 20) {
                    ctx.beginPath();
                    ctx.moveTo(0, j);
                    ctx.lineTo(cardWidth, j);
                    ctx.stroke();
                }
                ctx.restore();
                cardBack.bitmap.baseTexture.update();
                
                cardBack.x = x;
                cardBack.y = y;
                cardBack.anchor.x = 0.5;
                cardBack.anchor.y = 0.5;
                cardBack.x += cardWidth / 2;
                cardBack.y += cardHeight / 2;
                
                // Card front sprite (initially hidden)
                const cardFront = new Sprite();
                const cardData = this._selectedCards[i];
                
                // Load the arcana image
                const filename = `img/arcana/${cardData.number-1}`;
                cardFront.bitmap = ImageManager.loadBitmap('', filename);
                
                cardFront.x = x;
                cardFront.y = y;
                cardFront.anchor.x = 0.5;
                cardFront.anchor.y = 0.5;
                cardFront.x += cardWidth / 2;
                cardFront.y += cardHeight / 2;
                cardFront.visible = false;
                
                // Apply reversed rotation if needed
                if (cardData.isReversed) {
                    cardFront.rotation = Math.PI;
                }
                
                // Set up bitmap load handling
                cardFront.bitmap.addLoadListener(() => {
                    cardFront.scale.x = cardWidth / cardFront.bitmap.width;
                    cardFront.scale.y = cardHeight / cardFront.bitmap.height;
                });
                
                this._cardSprites.push({
                    back: cardBack,
                    front: cardFront,
                    index: i,
                    isFlipped: false
                });
                
                this.addChild(cardBack);
                this.addChild(cardFront);
                
                // Make cards interactive
                cardBack.interactive = true;
                cardBack.buttonMode = true;
                cardBack.addListener('pointertap', () => this.onCardClick(i));
                
                // Add hover effect
                cardBack.addListener('pointerover', () => {
                    if (!this._isAnimating && !this._cardSprites[i].isFlipped) {
                        cardBack.scale.x = 1.05;
                        cardBack.scale.y = 1.05;
                    }
                });
                
                cardBack.addListener('pointerout', () => {
                    if (!this._isAnimating && !this._cardSprites[i].isFlipped) {
                        cardBack.scale.x = 1;
                        cardBack.scale.y = 1;
                    }
                });
            }
        }

        onCardClick(index) {
            if (this._isAnimating || this._cardSprites[index].isFlipped) return;
            
            this._isAnimating = true;
            this.flipCard(index);
        }

        flipCard(index) {
            const card = this._cardSprites[index];
            const duration = 20; // frames
            let frame = 0;
            
            const flip = () => {
                frame++;
                const progress = frame / duration;
                const angle = progress * Math.PI;
                
                // First half - shrink card back
                if (progress <= 0.5) {
                    card.back.scale.x = Math.cos(angle);
                } else {
                    // Second half - grow card front
                    if (!card.front.visible) {
                        card.front.visible = true;
                        card.back.visible = false;
                    }
                    card.front.scale.x = Math.abs(Math.cos(angle)) * (120 / card.front.bitmap.width);
                }
                
                if (frame >= duration) {
                    card.isFlipped = true;
                    this._isRevealed[index] = true;
                    this._isAnimating = false;
                    this.showCardMeaning(index);
                    
                    // Check if all cards are revealed
                    if (this._isRevealed.every(r => r)) {
                        this._instructionWindow.contents.clear();
                        this._instructionWindow.drawText(this.getLocalizedText('complete'), 0, 0, 
                            this._instructionWindow.width - 32, 'center');
                    }
                } else {
                    requestAnimationFrame(flip);
                }
            };
            
            flip();
        }

        showCardMeaning(index) {
            const card = this._selectedCards[index];
            const lang = ConfigManager.language === 'it' ? 'it' : 'en';
            const meanings = TarotMeanings[lang][card.number];
            const pool = card.isReversed ? meanings.reversed : meanings.upright;
            const meaning = pool[Math.floor(Math.random() * pool.length)];
            
            this._meaningWindow.contents.clear();
            this._meaningWindow.show();
            
            // Draw card name
            const cardName = this.getCardName(card.number);
            const orientation = card.isReversed ? this.getLocalizedText('reversed') : this.getLocalizedText('upright');
            this._meaningWindow.changeTextColor(ColorManager.systemColor());
            this._meaningWindow.drawText(`${cardName} (${orientation})`, 0, 0, 
                this._meaningWindow.width - 32, 'center');
            
            // Draw meaning
            this._meaningWindow.changeTextColor(ColorManager.normalColor());
            this._meaningWindow.drawTextAutomatically(meaning, 0, 40, this._meaningWindow.width - 32);
            
            // Hide after delay
            setTimeout(() => {
                this._meaningWindow.hide();
            }, 5000);
        }

        getCardName(number) {
            const lang = ConfigManager.language === 'it' ? 'it' : 'en';
            const names = {
                en: [
                    'The Fool', 'The Magician', 'The High Priestess', 'The Empress', 'The Emperor',
                    'The Hierophant', 'The Lovers', 'The Chariot', 'Strength', 'The Hermit',
                    'Wheel of Fortune', 'Justice', 'The Hanged Man', 'Death', 'Temperance',
                    'The Devil', 'The Tower', 'The Star', 'The Moon', 'The Sun',
                    'Judgement', 'The World'
                ],
                it: [
                    'Il Matto', 'Il Mago', 'La Papessa', 'L\'Imperatrice', 'L\'Imperatore',
                    'Il Papa', 'Gli Amanti', 'Il Carro', 'La Forza', 'L\'Eremita',
                    'La Ruota della Fortuna', 'La Giustizia', 'L\'Appeso', 'La Morte', 'La Temperanza',
                    'Il Diavolo', 'La Torre', 'La Stella', 'La Luna', 'Il Sole',
                    'Il Giudizio', 'Il Mondo'
                ]
            };
            return names[lang][number - 1];
        }

        getLocalizedText(key) {
            const lang = ConfigManager.language === 'it' ? 'it' : 'en';
            const texts = {
                en: {
                    title: 'Tarot Reading',
                    past: 'Past',
                    present: 'Present',
                    future: 'Future',
                    instruction: 'Click on a card to reveal its meaning',
                    complete: 'Your reading is complete. Press ESC to exit.',
                    upright: 'Upright',
                    reversed: 'Reversed'
                },
                it: {
                    title: 'Lettura dei Tarocchi',
                    past: 'Passato',
                    present: 'Presente',
                    future: 'Futuro',
                    instruction: 'Clicca su una carta per rivelare il suo significato',
                    complete: 'La tua lettura è completa. Premi ESC per uscire.',
                    upright: 'Dritto',
                    reversed: 'Rovesciato'
                }
            };
            return texts[lang][key];
        }

        update() {
            super.update();
            
            if (Input.isTriggered('cancel') || TouchInput.isCancelled()) {
                this.popScene();
            }
        }
    }

    // Window extensions for text wrapping
    Window_Base.prototype.drawTextAutomatically = function(text, x, y, maxWidth) {
        const textState = this.createTextState(text, x, y, maxWidth);
        const words = text.split(' ');
        let line = '';
        let currentY = y;
        
        for (let i = 0; i < words.length; i++) {
            const testLine = line + words[i] + ' ';
            const metrics = this.textWidth(testLine);
            
            if (metrics > maxWidth && line !== '') {
                this.drawText(line.trim(), x, currentY, maxWidth);
                line = words[i] + ' ';
                currentY += this.lineHeight();
            } else {
                line = testLine;
            }
        }
        
        this.drawText(line.trim(), x, currentY, maxWidth);
    };

    // Scene_TarotNPC - NPC Reading Scene
    class Scene_TarotNPC extends Scene_MenuBase {
        create() {
            super.create();
            this._cards = [];
            this._selectedCards = [];
            this._cardSprites = [];
            this._isAnimating = false;
            this._currentCardIndex = 0;
            this._correctAnswers = 0;
            this._choices = [];
            this._correctMeanings = [];
            this.createBackground();
            this.createWindows();
            this.shuffleAndDealCards();
        }

        createBackground() {
            this._backgroundSprite = new Sprite();
            this._backgroundSprite.bitmap = new Bitmap(Graphics.width, Graphics.height);
            this._backgroundSprite.bitmap.fillAll('rgba(0, 0, 0, 0.8)');
            this.addChild(this._backgroundSprite);
        }

        createWindows() {
            this.createTitleWindow();
            this.createCardWindow();
            this.createChoiceWindow();
            this.createProgressWindow();
        }

        createTitleWindow() {
            const rect = this.titleWindowRect();
            this._titleWindow = new Window_Base(rect);
            const text = this.getLocalizedText('npcTitle').replace('%1', this._npcData.name);
            this._titleWindow.drawText(text, 0, 0, rect.width - 32, 'center');
            this.addWindow(this._titleWindow);
        }

        titleWindowRect() {
            const width = 600;
            const height = 80;
            const x = (Graphics.width - width) / 2;
            const y = 20;
            return new Rectangle(x, y, width, height);
        }

        createCardWindow() {
            const rect = this.cardWindowRect();
            this._cardWindow = new Window_Base(rect);
            this.addWindow(this._cardWindow);
        }

        cardWindowRect() {
            const width = 200;
            const height = 300;
            const x = (Graphics.width - width) / 2;
            const y = 120;
            return new Rectangle(x, y, width, height);
        }

        createChoiceWindow() {
            const rect = this.choiceWindowRect();
            this._choiceWindow = new Window_Command(rect);
            this._choiceWindow.setHandler('cancel', this.onChoiceCancel.bind(this));
            this._choiceWindow.deactivate();
            this._choiceWindow.hide();
            this.addWindow(this._choiceWindow);
        }

        choiceWindowRect() {
            const width = Graphics.width - 100;
            const height = 200;
            const x = 50;
            const y = 450;
            return new Rectangle(x, y, width, height);
        }

        createProgressWindow() {
            const rect = this.progressWindowRect();
            this._progressWindow = new Window_Base(rect);
            this.addWindow(this._progressWindow);
            this.updateProgress();
        }

        progressWindowRect() {
            const width = 300;
            const height = 60;
            const x = Graphics.width - width - 20;
            const y = 20;
            return new Rectangle(x, y, width, height);
        }

        updateProgress() {
            this._progressWindow.contents.clear();
            const positions = ['past', 'present', 'future'];
            const currentPos = this.getLocalizedText(positions[this._currentCardIndex]);
            const text = `${currentPos} (${this._currentCardIndex + 1}/3)`;
            this._progressWindow.drawText(text, 0, 0, this._progressWindow.width - 32, 'center');
        }

        shuffleAndDealCards() {
            // Generate and shuffle cards
            const allCards = Array.from({length: 22}, (_, i) => i + 1);
            for (let i = allCards.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [allCards[i], allCards[j]] = [allCards[j], allCards[i]];
            }
            
            // Select 3 cards
            for (let i = 0; i < 3; i++) {
                this._selectedCards.push({
                    number: allCards[i],
                    isReversed: Math.random() < 0.5
                });
            }
            
            // Show first card
            this.showCurrentCard();
        }

        showCurrentCard() {
            const card = this._selectedCards[this._currentCardIndex];
            
            // Create card sprite
            const cardSprite = new Sprite();
            const filename = `img/arcana/${card.number}.png`;
            cardSprite.bitmap = ImageManager.loadBitmap('', filename);
            
            cardSprite.anchor.x = 0.5;
            cardSprite.anchor.y = 0.5;
            cardSprite.x = this._cardWindow.x + this._cardWindow.width / 2;
            cardSprite.y = this._cardWindow.y + this._cardWindow.height / 2 - 20;
            
            if (card.isReversed) {
                cardSprite.rotation = Math.PI;
            }
            
            cardSprite.bitmap.addLoadListener(() => {
                const maxWidth = 160;
                const maxHeight = 240;
                const scaleX = maxWidth / cardSprite.bitmap.width;
                const scaleY = maxHeight / cardSprite.bitmap.height;
                const scale = Math.min(scaleX, scaleY);
                cardSprite.scale.x = scale;
                cardSprite.scale.y = scale;
                
                // Fade in animation
                cardSprite.opacity = 0;
                const fadeIn = () => {
                    cardSprite.opacity += 10;
                    if (cardSprite.opacity < 255) {
                        requestAnimationFrame(fadeIn);
                    } else {
                        this.setupChoices();
                    }
                };
                fadeIn();
            });
            
            this.addChild(cardSprite);
            this._currentCardSprite = cardSprite;
            
            // Update card name
            this._cardWindow.contents.clear();
            const cardName = this.getCardName(card.number);
            const orientation = card.isReversed ? this.getLocalizedText('reversed') : this.getLocalizedText('upright');
            this._cardWindow.changeTextColor(ColorManager.systemColor());
            this._cardWindow.drawText(cardName, 0, 240, this._cardWindow.width - 32, 'center');
            this._cardWindow.drawText(`(${orientation})`, 0, 270, this._cardWindow.width - 32, 'center');
        }

        setupChoices() {
            const card = this._selectedCards[this._currentCardIndex];
            const lang = ConfigManager.language === 'it' ? 'it' : 'en';
            const meanings = TarotMeanings[lang][card.number];
            const pool = card.isReversed ? meanings.reversed : meanings.upright;
            
            // Get correct meaning
            const correctIndex = Math.floor(Math.random() * pool.length);
            const correctMeaning = pool[correctIndex];
            this._correctMeanings.push(correctMeaning);
            
            // Get two wrong meanings from other cards
            const wrongMeanings = [];
            const usedCards = [card.number];
            
            while (wrongMeanings.length < 2) {
                const randomCard = Math.floor(Math.random() * 22) + 1;
                if (!usedCards.includes(randomCard)) {
                    usedCards.push(randomCard);
                    const wrongPool = TarotMeanings[lang][randomCard];
                    const wrongOrientation = Math.random() < 0.5 ? wrongPool.reversed : wrongPool.upright;
                    const wrongMeaning = wrongOrientation[Math.floor(Math.random() * wrongOrientation.length)];
                    wrongMeanings.push(wrongMeaning);
                }
            }
            
            // Shuffle choices
            this._choices = [correctMeaning, ...wrongMeanings];
            for (let i = this._choices.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [this._choices[i], this._choices[j]] = [this._choices[j], this._choices[i]];
            }
            
            // Store correct answer index
            this._correctAnswerIndex = this._choices.indexOf(correctMeaning);
            
            // Setup choice window
            this._choiceWindow.clearCommandList();
            this._choices.forEach((choice, index) => {
                // Truncate long meanings for the choice window
                const truncated = choice.length > 80 ? choice.substring(0, 77) + '...' : choice;
                this._choiceWindow.addCommand(truncated, 'choice' + index);
            });
            
            // Set handlers
            this._choices.forEach((_, index) => {
                this._choiceWindow.setHandler('choice' + index, () => this.onChoiceSelect(index));
            });
            
            this._choiceWindow.refresh();
            this._choiceWindow.show();
            this._choiceWindow.activate();
            this._choiceWindow.select(0);
        }

        onChoiceSelect(index) {
            this._choiceWindow.deactivate();
            this._choiceWindow.hide();
            
            // Check if correct
            if (index === this._correctAnswerIndex) {
                this._correctAnswers++;
                SoundManager.playOk();
            } else {
                SoundManager.playBuzzer();
            }
            
            // Move to next card or end
            this._currentCardIndex++;
            if (this._currentCardIndex < 3) {
                // Fade out current card
                const fadeOut = () => {
                    this._currentCardSprite.opacity -= 10;
                    if (this._currentCardSprite.opacity > 0) {
                        requestAnimationFrame(fadeOut);
                    } else {
                        this.removeChild(this._currentCardSprite);
                        this.updateProgress();
                        this.showCurrentCard();
                    }
                };
                fadeOut();
            } else {
                this.endReading();
            }
        }

        onChoiceCancel() {
            // Prevent canceling during choice
        }

        endReading() {
            // Determine message based on score
            let message;
            if (this._correctAnswers === 3) {
                message = this._npcData.perfectMessage;
            } else if (this._correctAnswers === 2) {
                message = this._npcData.goodMessage;
            } else if (this._correctAnswers === 1) {
                message = this._npcData.averageMessage;
            } else {
                message = this._npcData.poorMessage;
            }
            
            // Store message for display after scene ends
            $gameMessage.setBackground(0);
            $gameMessage.setPositionType(2);
            
            // Compatibility wrapper
            window.skipLocalization = true;
            message.split('\n').forEach(line => {
                $gameMessage.add(line);
            });
            window.skipLocalization = false;
            
            // Return to map
            this.popScene();
        }

        getCardName(number) {
            const lang = ConfigManager.language === 'it' ? 'it' : 'en';
            const names = {
                en: [
                    'The Fool', 'The Magician', 'The High Priestess', 'The Empress', 'The Emperor',
                    'The Hierophant', 'The Lovers', 'The Chariot', 'Strength', 'The Hermit',
                    'Wheel of Fortune', 'Justice', 'The Hanged Man', 'Death', 'Temperance',
                    'The Devil', 'The Tower', 'The Star', 'The Moon', 'The Sun',
                    'Judgement', 'The World'
                ],
                it: [
                    'Il Matto', 'Il Mago', 'La Papessa', 'L\'Imperatrice', 'L\'Imperatore',
                    'Il Papa', 'Gli Amanti', 'Il Carro', 'La Forza', 'L\'Eremita',
                    'La Ruota della Fortuna', 'La Giustizia', 'L\'Appeso', 'La Morte', 'La Temperanza',
                    'Il Diavolo', 'La Torre', 'La Stella', 'La Luna', 'Il Sole',
                    'Il Giudizio', 'Il Mondo'
                ]
            };
            return names[lang][number - 1];
        }

        getLocalizedText(key) {
            const lang = ConfigManager.language === 'it' ? 'it' : 'en';
            const texts = {
                en: {
                    npcTitle: 'Reading Tarot for %1',
                    past: 'Past',
                    present: 'Present',
                    future: 'Future',
                    upright: 'Upright',
                    reversed: 'Reversed'
                },
                it: {
                    npcTitle: 'Lettura dei Tarocchi per %1',
                    past: 'Passato',
                    present: 'Presente',
                    future: 'Futuro',
                    upright: 'Dritto',
                    reversed: 'Rovesciato'
                }
            };
            return texts[lang][key] || texts.en[key];
        }

        update() {
            super.update();
            
            if (Input.isTriggered('cancel') || TouchInput.isCancelled()) {
                if (!this._choiceWindow.active) {
                    this.popScene();
                }
            }
        }
    }

})();
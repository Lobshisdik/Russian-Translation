//=============================================================================
// AnimatedSlotMachine.js
//=============================================================================

/*:
 * @target MZ
 * @plugindesc Animated Slot Machine v1.0.5
 * @author Omni-Lex
 * @url 
 * @help AnimatedSlotMachine.js
 * 
 * @param minBet
 * @text Minimum Bet
 * @desc Minimum tokens to bet
 * @type number
 * @default 1
 * 
 * @param maxBet
 * @text Maximum Bet
 * @desc Maximum tokens to bet
 * @type number
 * @default 100
 * 
 * @param tokenItemId
 * @text Token Item ID
 * @desc ID of the token item in database
 * @type number
 * @default 1
 * 
 * @command openSlotMachine
 * @text Open Slot Machine
 * @desc Opens the slot machine minigame
 * 
 * This plugin creates an animated slot machine minigame.
 * Use Plugin Command: "Open Slot Machine" or Script Call: SceneManager.push(Scene_SlotMachine);
 */

(() => {
    'use strict';
    
    const pluginName = "AnimatedSlotMachine";
    const parameters = PluginManager.parameters(pluginName);
    const MIN_BET = parseInt(parameters['minBet']) || 1;
    const MAX_BET = parseInt(parameters['maxBet']) || 9999;
    const TOKEN_ITEM_ID = parseInt(parameters['tokenItemId']) || 1;

    // Register plugin command
    PluginManager.registerCommand(pluginName, "openSlotMachine", args => {
        SceneManager.push(Scene_SlotMachine);
    });

    // Slot symbols - using text instead of emoji for better compatibility
    const SLOT_SYMBOLS = ['🎈', '🍋', '🍊', '🍇', '⭐', '💎', '7️⃣', '🔔'];

    const SYMBOL_COLORS = ['#ff0000', '#ffff00', '#ffa500', '#800080', '#ffff00', '#00ffff', '#ff0000', '#ffd700'];
    
    //-----------------------------------------------------------------------------
    // Scene_SlotMachine
    //-----------------------------------------------------------------------------

    class Scene_SlotMachine extends Scene_MenuBase {
        initialize() {
            super.initialize();
            this._bet = MIN_BET;
            this._spinning = false;
            this._reels = [0, 0, 0];
            this._targetReels = [0, 0, 0];
            this._spinSpeed = [0, 0, 0];
            this._spinTimer = 0;
            this._animationPhase = 'idle';
            this._lastWin = 0;
            this._tokens = 0;
            this._reelsStopped = [false, false, false];
        }

        create() {
            super.create();
            this.createBackground();
            this.createWindowLayer();
            this.createAllWindows();
        }

        start() {
            super.start();
            // Activate the slot window when scene starts
            this._slotWindow.activate();
            this._slotWindow.select(0);
        }

        createBackground() {
            this._backgroundSprite = new Sprite();
            this._backgroundSprite.bitmap = new Bitmap(Graphics.width, Graphics.height);
            this._backgroundSprite.bitmap.fillRect(0, 0, Graphics.width, Graphics.height, '#1a1a2e');
            this.addChild(this._backgroundSprite);
        }

        createAllWindows() {
            this.createHelpWindow();
            this.createSlotWindow();
            this.createBetWindow();
            this.createCommandWindow();
        }

        createHelpWindow() {
            const rect = this.helpWindowRect();
            this._helpWindow = new Window_Help(rect);
            this._helpWindow.setText('Slot Machine - Press Enter to Spin, Esc to Exit');
            this.addWindow(this._helpWindow);
        }

        helpWindowRect() {
            const wx = 0;
            const wy = 0;
            const ww = Graphics.boxWidth;
            const wh = this.calcWindowHeight(1, false);
            return new Rectangle(wx, wy, ww, wh);
        }

        createSlotWindow() {
            const rect = new Rectangle(
                (Graphics.boxWidth - 500) / 2,
                100,
                500,
                300
            );
            this._slotWindow = new Window_SlotDisplay(rect);
            this._slotWindow.setHandler('ok', this.onSpinOk.bind(this));
            this._slotWindow.setHandler('cancel', this.popScene.bind(this));
            this.addWindow(this._slotWindow);
        }

        createBetWindow() {
            const rect = new Rectangle(
                50,
                420,
                300,
                130
            );
            this._betWindow = new Window_BetInfo(rect);
            this._betWindow.setBet(this._bet);
            this.addWindow(this._betWindow);
        }

        createCommandWindow() {
            const rect = new Rectangle(
                Graphics.boxWidth - 350,
                420,
                300,
                130
            );
            this._commandWindow = new Window_Base(rect);
            this._commandWindow.drawText('↑/↓: (±10)', 0, 0, 280, 'left');
            this._commandWindow.drawText('←/→: (±1)', 0, 30, 280, 'left');
            this.addWindow(this._commandWindow);
        }

        update() {
            super.update();
            if (this._slotWindow && this._slotWindow.active && !this._spinning) {
                this.updateBetInput();
            }
            this.updateSpinAnimation();
            this.updateWindows();
        }

        updateBetInput() {
            let betChanged = false;
            
            if (Input.isRepeated('up')) {
                this.changeBet(10);
                betChanged = true;
            } else if (Input.isRepeated('down')) {
                this.changeBet(-10);
                betChanged = true;
            } else if (Input.isRepeated('right')) {
                this.changeBet(1);
                betChanged = true;
            } else if (Input.isRepeated('left')) {
                this.changeBet(-1);
                betChanged = true;
            }
            
            if (betChanged) {
                // Prevent default cursor sound and play our own
                Input._latestButton = null;
            }
        }

        changeBet(amount) {
            const oldBet = this._bet;
            this._bet = Math.max(MIN_BET, Math.min(MAX_BET, this._bet + amount));
            if (this._bet !== oldBet) {
                SoundManager.playCursor();
                this._betWindow.setBet(this._bet);
                this._betWindow.refresh();
            }
        }

        onSpinOk() {
            if (this._spinning) return;
            this.spin();
        }

        spin() {
            const tokens = $dataItems[TOKEN_ITEM_ID];
            if (!tokens) {
                SoundManager.playBuzzer();
                this._helpWindow.setText("You don't have any tokens.");
                this._slotWindow.activate();
                this._slotWindow.select(0);
                return;
            }

            const tokenCount = $gameParty.numItems(tokens);
            
            if (tokenCount < this._bet) {
                SoundManager.playBuzzer();
                this._helpWindow.setText(`Not enough Tokens! You have ${tokenCount}, need ${this._bet}`);
                this._slotWindow.activate();
                this._slotWindow.select(0);
                return;
            }

            this._spinning = true;
            this._animationPhase = 'spinning';
            this._spinTimer = 0;
            this._reelsStopped = [false, false, false];
            
            // Deactivate window during spin
            this._slotWindow.deactivate();
            
            // Consume tokens
            $gameParty.loseItem(tokens, this._bet);
            
            // Set random targets for each reel
            for (let i = 0; i < 3; i++) {
                this._targetReels[i] = Math.floor(Math.random() * SLOT_SYMBOLS.length);
                this._spinSpeed[i] = 0.5 + Math.random() * 0.3;
            }
            
            SoundManager.playOk();
            this._helpWindow.setText('Spinning...');
            this._betWindow.refresh();
        }

        updateSpinAnimation() {
            if (!this._spinning) return;
            
            this._spinTimer++;
            
            if (this._animationPhase === 'spinning') {
                // Spin all reels that haven't stopped yet
                for (let i = 0; i < 3; i++) {
                    if (!this._reelsStopped[i]) {
                        this._reels[i] += this._spinSpeed[i];
                        if (this._reels[i] >= SLOT_SYMBOLS.length) {
                            this._reels[i] -= SLOT_SYMBOLS.length;
                        }
                    }
                }
                
                // Slow down and stop reels one by one
                if (this._spinTimer > 60 && !this._reelsStopped[0]) {
                    this._spinSpeed[0] *= 0.88;
                    if (this._spinSpeed[0] < 0.05) {
                        this._reels[0] = this._targetReels[0];
                        this._reelsStopped[0] = true;
                        SoundManager.playCursor();
                    }
                }
                if (this._spinTimer > 90 && !this._reelsStopped[1]) {
                    this._spinSpeed[1] *= 0.88;
                    if (this._spinSpeed[1] < 0.05) {
                        this._reels[1] = this._targetReels[1];
                        this._reelsStopped[1] = true;
                        SoundManager.playCursor();
                    }
                }
                if (this._spinTimer > 120 && !this._reelsStopped[2]) {
                    this._spinSpeed[2] *= 0.88;
                    if (this._spinSpeed[2] < 0.05) {
                        this._reels[2] = this._targetReels[2];
                        this._reelsStopped[2] = true;
                        SoundManager.playCursor();
                    }
                }
                
                // Check if all reels stopped
                if (this._reelsStopped[0] && this._reelsStopped[1] && this._reelsStopped[2]) {
                    this._animationPhase = 'stopping';
                }
            } else if (this._animationPhase === 'stopping') {
                // Wait a brief moment after all reels stop, then check win
                if (this._spinTimer > 180) {
                    this._spinning = false;
                    this._animationPhase = 'idle';
                    this.checkWin();
                    // Reactivate window after spin
                    this._slotWindow.activate();
                    this._slotWindow.select(0);
                }
            }
        }

        updateWindows() {
            if (this._slotWindow) {
                this._slotWindow.setReels(this._reels, this._spinning, this._reelsStopped);
            }
        }

        checkWin() {
            const symbols = this._targetReels.map(i => SLOT_SYMBOLS[i]);
            let winAmount = 0;
            let message = '';
            
            // Check for three of a kind
            if (symbols[0] === symbols[1] && symbols[1] === symbols[2]) {
                const multiplier = symbols[0] === '7️⃣' ? 100 : 
                                 symbols[0] === '💎' ? 50 :
                                 symbols[0] === '⭐' ? 25 : 10;
                winAmount = this._bet * multiplier;
                message = `JACKPOT! Three ${symbols[0]}s! Won ${winAmount} tokens!`;
            }
            // Check for two of a kind
            else if (symbols[0] === symbols[1] || symbols[1] === symbols[2] || symbols[0] === symbols[2]) {
                winAmount = this._bet * 2;
                message = `Two matching symbols! Won ${winAmount} tokens!`;
            }
            
            if (winAmount > 0) {
                const tokens = $dataItems[TOKEN_ITEM_ID];
                $gameParty.gainItem(tokens, winAmount);
                this._lastWin = winAmount;
                SoundManager.playRecovery();
                if (winAmount >= this._bet * 25) {
                    $gameScreen.startFlash([255, 255, 255, 128], 30);
                }
            } else {
                this._lastWin = 0;
                message = 'No match. Try again!';
            }
            
            this._helpWindow.setText(message);
            this._betWindow.setLastWin(this._lastWin);
            this._betWindow.refresh();
        }
    }

    //-----------------------------------------------------------------------------
    // Window_SlotDisplay
    //-----------------------------------------------------------------------------

    class Window_SlotDisplay extends Window_Selectable {
        initialize(rect) {
            super.initialize(rect);
            this._reels = [0, 0, 0];
            this._spinning = false;
            this._reelsStopped = [false, false, false];
            this.refresh();
        }

        maxItems() {
            return 1;
        }

        setReels(reels, spinning, reelsStopped = [false, false, false]) {
            this._reels = reels;
            this._spinning = spinning;
            this._reelsStopped = reelsStopped;
            this.refresh();
        }

        refresh() {
            this.contents.clear();
            
            // Draw title
            this.changeTextColor(ColorManager.systemColor());
            this.drawText('=== SLOT MACHINE ===', 0, 0, this.innerWidth, 'center');
            
            // Draw slot reels
            for (let i = 0; i < 3; i++) {
                this.drawReel(i);
            }
            
            this.resetTextColor();
        }

        drawReel(index) {
            const x = 80 + index * 120;
            const y = 80;
            const width = 100;
            const height = 120;
            
            // Draw reel background
            this.contents.fillRect(x, y, width, height, '#000000');
            this.contents.fillRect(x + 2, y + 2, width - 4, height - 4, '#ffffff');
            
            if (this._spinning && !this._reelsStopped[index]) {
                // Draw multiple symbols for spinning effect
                const position = this._reels[index];
                for (let j = -1; j <= 1; j++) {
                    const symbolIndex = Math.floor(position + j) % SLOT_SYMBOLS.length;
                    const adjustedIndex = symbolIndex < 0 ? symbolIndex + SLOT_SYMBOLS.length : symbolIndex;
                    const symbol = SLOT_SYMBOLS[adjustedIndex];
                    const color = SYMBOL_COLORS[adjustedIndex];
                    const offset = (position % 1) * 40;
                    const symbolY = y + 60 + j * 40 - offset;
                    
                    if (symbolY > y && symbolY < y + height - 20) {
                        // Set larger font size for emoji visibility
                        this.contents.fontSize = 32;
                        this.changeTextColor(color);
                        // Use better centering for emoji
                        const textWidth = this.contents.measureTextWidth(symbol);
                        const centerX = x + (width - textWidth) / 2;
                        this.contents.drawText(symbol, centerX, symbolY - 20, textWidth, 40, 'left');
                    }
                }
            } else {
                // Draw single symbol when stopped (use exact integer index)
                const symbolIndex = Math.floor(this._reels[index]);
                const symbol = SLOT_SYMBOLS[symbolIndex];
                const color = SYMBOL_COLORS[symbolIndex];
                
                // Set large font size for better emoji visibility
                this.contents.fontSize = 48;
                this.changeTextColor(color);
                
                // Calculate proper center position for emoji
                const textWidth = this.contents.measureTextWidth(symbol);
                const textHeight = this.contents.fontSize;
                const centerX = x + (width - textWidth) / 2;
                const centerY = y + (height - textHeight) / 2;
                
                this.contents.drawText(symbol, centerX, centerY, textWidth, textHeight, 'left');
                
                // Reset font size
                this.contents.fontSize = $dataSystem.advanced.fontSize;
            }
            
            this.resetTextColor();
            // Reset font size to default
            this.contents.fontSize = $dataSystem.advanced.fontSize;
        }

        isOkEnabled() {
            return !this._spinning;
        }

        isCancelEnabled() {
            return !this._spinning;
        }

        processHandling() {
            if (this.isOpenAndActive()) {
                if (this.isOkEnabled() && Input.isTriggered('ok')) {
                    this.processOk();
                    return;
                }
                if (this.isCancelEnabled() && Input.isTriggered('cancel')) {
                    this.processCancel();
                    return;
                }
            }
        }

        cursorDown(wrap) {
            // Disable cursor movement
        }

        cursorUp(wrap) {
            // Disable cursor movement
        }

        cursorRight(wrap) {
            // Disable cursor movement - handled by scene
        }

        cursorLeft(wrap) {
            // Disable cursor movement - handled by scene
        }

        cursorPagedown() {
            // Disable
        }

        cursorPageup() {
            // Disable
        }
    }

    //-----------------------------------------------------------------------------
    // Window_BetInfo
    //-----------------------------------------------------------------------------

    class Window_BetInfo extends Window_Base {
        initialize(rect) {
            super.initialize(rect);
            this._bet = MIN_BET;
            this._lastWin = 0;
            this.refresh();
        }

        setBet(bet) {
            this._bet = bet;
        }

        setLastWin(amount) {
            this._lastWin = amount;
        }

        refresh() {
            this.contents.clear();
            
            const tokens = $dataItems[TOKEN_ITEM_ID];
            const tokenName = 'Tokens';  // Always use "Tokens" instead of the item name
            const tokenCount = tokens ? $gameParty.numItems(tokens) : 0;
            
            this.drawText(`${tokenName}:`, 0, 0, 120, 'left');
            this.changeTextColor(ColorManager.systemColor());
            this.drawText(tokenCount.toString(), 120, 0, 100, 'right');
            
            this.resetTextColor();
            this.drawText('Bet:', 0, 30, 120, 'left');
            this.changeTextColor(ColorManager.powerUpColor());
            this.drawText(this._bet.toString(), 120, 30, 100, 'right');
            
            if (this._lastWin > 0) {
                this.resetTextColor();
                this.drawText('Last Win:', 0, 60, 120, 'left');
                this.changeTextColor(ColorManager.powerUpColor());
                this.drawText(this._lastWin.toString(), 120, 60, 100, 'right');
            }
            
            this.resetTextColor();
        }
    }

    // Make classes globally available
    window.Scene_SlotMachine = Scene_SlotMachine;
    window.Window_SlotDisplay = Window_SlotDisplay;
    window.Window_BetInfo = Window_BetInfo;

})();
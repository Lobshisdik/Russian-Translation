//=============================================================================
// AnimatedHorseRace.js - Refactored with Italian Translation and Fixes
//=============================================================================

/*:
 * @target MZ
 * @plugindesc Animated Horse Race v1.2.2 - Fixes navigation and betting issues.
 * @author Omni-Lex 
 * @url https://nocoldiz.itch.io/hypernet-explorer
 * @help AnimatedHorseRace.js
 * * @param minBet
 * @text Minimum Bet
 * @desc Minimum tokens to bet
 * @type number
 * @default 1
 * * @param maxBet
 * @text Maximum Bet
 * @desc Maximum tokens to bet
 * @type number
 * @default 100
 * * @param tokenItemId
 * @text Token Item ID
 * @desc ID of the token item in database
 * @type number
 * @default 1
 * * @command openHorseRace
 * @text Open Horse Race
 * @desc Opens the horse racing minigame
 * * This plugin creates an animated horse racing minigame with persistent horses.
 * Use Plugin Command: "Open Horse Race" or Script Call: SceneManager.push(Scene_HorseRace);
 * * Now supports Italian translation when ConfigManager.language === 'it'
 * Version 1.2.2 fixes issues with getting stuck with insufficient tokens and
 * improves overall menu navigation and user feedback.
 */

(() => {
    'use strict';
    
    const pluginName = "AnimatedHorseRace";
    const parameters = PluginManager.parameters(pluginName);
    const MIN_BET = parseInt(parameters['minBet']) || 1;
    const MAX_BET = parseInt(parameters['maxBet']) || 9999;
    const TOKEN_ITEM_ID = parseInt(parameters['tokenItemId']) || 1;

    // Translation system
    const translations = {
        en: {
            // Main UI
            helpText: 'Horse Race - Select a horse to bet on!',
            raceStarted: 'And they\'re off! The race has begun!',
            selectHorseFirst: 'Please select a horse first!',
            noTokens: 'You don\'t have any tokens.',
            notEnoughTokens: 'Not enough {tokenName}! You have {current}, need {needed}',
            
            // Controls
            selectHorse: '↑/↓: Select Horse',
            changeBet1: '←/→: Change Bet (±1)',
            changeBet10: 'Shift+←/→: (±10)',
            confirmSelection: 'Enter: Confirm & Start',
            startRace: 'Space: Start Race!',
            exitGame: 'Esc: Exit',
            newRace: 'Enter: New Race',
            
            // Betting window
            tokens: 'Tokens',
            bet: 'Bet',
            selected: 'Selected',
            potentialWin: 'Potential Win',
            odds: 'Odds',
            
            // Race window
            raceInProgress: 'RACE IN PROGRESS',
            
            // Results window
            raceResults: 'RACE RESULTS',
            winner: 'Winner',
            youWon: 'YOU WON!',
            youLost: 'You Lost',
            profit: 'Profit',
            lost: 'Lost',
            won: 'Won',
            
            // Result messages
            winMessage: '🎉 {horseName} wins! You won {amount} tokens! 🎉',
            loseMessage: '{horseName} wins! Better luck next time!',
            continuePrompt: ' Press Enter for new race or Esc to exit.'
        },
        it: {
            // Main UI
            helpText: 'Corsa di Cavalli - Seleziona un cavallo su cui scommettere!',
            raceStarted: 'Via! La corsa è iniziata!',
            selectHorseFirst: 'Seleziona prima un cavallo!',
            noTokens: 'Non hai gettoni.',
            notEnoughTokens: '{tokenName} insufficienti! Ne hai {current}, servono {needed}',
            
            // Controls
            selectHorse: '↑/↓: Seleziona Cavallo',
            changeBet1: '←/→: Cambia Scommessa (±1)',
            changeBet10: 'Shift+←/→: (±10)',
            confirmSelection: 'Invio: Conferma e Inizia',
            startRace: 'Spazio: Inizia Corsa!',
            exitGame: 'Esc: Esci',
            newRace: 'Invio: Nuova Corsa',
            
            // Betting window
            tokens: 'Gettoni',
            bet: 'Scommessa',
            selected: 'Selezionato',
            potentialWin: 'Vincita Potenziale',
            odds: 'Quote',
            
            // Race window
            raceInProgress: 'CORSA IN CORSO',
            
            // Results window
            raceResults: 'RISULTATI CORSA',
            winner: 'Vincitore',
            youWon: 'HAI VINTO!',
            youLost: 'Hai Perso',
            profit: 'Profitto',
            lost: 'Perso',
            won: 'Vinto',
            
            // Result messages
            winMessage: '🎉 {horseName} vince! Hai vinto {amount} gettoni! 🎉',
            loseMessage: '{horseName} vince! Ritenta la prossima volta!',
            continuePrompt: ' Premi Invio per una nuova corsa o Esc per uscire.'
        }
    };

    // Translation helper function
    function getText(key, replacements = {}) {
        const useTranslation = ConfigManager.language === 'it';
        const lang = useTranslation ? 'it' : 'en';
        let text = translations[lang][key] || translations.en[key] || key;
        
        for (const [placeholder, value] of Object.entries(replacements)) {
            text = text.replace(new RegExp(`{${placeholder}}`, 'g'), value);
        }
        
        return text;
    }

    PluginManager.registerCommand(pluginName, "openHorseRace", args => {
        SceneManager.push(Scene_HorseRace);
    });

    const NORMAL_PREFIXES = [
        'Thunder', 'Lightning', 'Storm', 'Midnight', 'Shadow', 'Spirit', 'Blaze', 'Flash',
        'Star', 'Diamond', 'Ruby', 'Sapphire', 'Gold', 'Silver', 'Champion', 'Victory',
        'Phoenix', 'Eagle', 'Falcon', 'Arrow', 'Bullet', 'Rocket', 'Comet', 'Meteor',
        'Wind', 'Fire', 'Ice', 'Steel', 'Crimson', 'Azure', 'Emerald', 'Onyx'
    ];
    const NORMAL_SUFFIXES = [
        'Runner', 'Rider', 'Dash', 'Bolt', 'Strike', 'Wing', 'Heart', 'Soul',
        'Storm', 'Blaze', 'Flash', 'Star', 'Moon', 'Sun', 'Wind', 'Fire'
    ];
    const WEIRD_PREFIXES = [
        'Sir Wiggles', 'Captain Snort', 'Professor Trot', 'Doctor Neigh', 'Mister Gallop',
        'Lady Hooves', 'Baron Clip-Clop', 'Duke Whinny', 'Count Mane', 'Princess Tails',
        'Admiral Chomp', 'General Bounce', 'Colonel Stumble', 'Major Wobble', 'Sergeant Giggle'
    ];
    const WEIRD_SUFFIXES = [
        'the Magnificent', 'the Confused', 'the Sleepy', 'the Dramatic', 'the Mysterious',
        'the Hungry', 'the Dancing', 'the Singing', 'the Backwards', 'the Sideways',
        'the Dizzy', 'the Bouncy', 'the Fluffy', 'the Sparkly', 'the Wobbly'
    ];
    const HORSE_COLORS = ['#8B4513', '#A0522D', '#000000', '#FFFFFF', '#D2691E', '#CD853F'];
    const HORSE_EMOJIS = ['🐴', '🐎', '🦄'];

    class SeededRandom {
        constructor(seed) {
            this.seed = seed;
        }
        next() {
            this.seed = (this.seed * 9301 + 49297) % 233280;
            return this.seed / 233280;
        }
    }

    function generateSeedFromPlayerName() {
        const playerName = $dataActors[1] ? $dataActors[1].name : 'Player';
        let seed = 0;
        for (let i = 0; i < playerName.length; i++) {
            seed += playerName.charCodeAt(i) * (i + 1);
        }
        return seed % 1000000;
    }

    function generateHorsePool() {
        const seed = generateSeedFromPlayerName();
        const rng = new SeededRandom(seed);
        const pool = [];
        for (let i = 0; i < 30; i++) {
            let name;
            if (rng.next() < 0.4) {
                const prefix = WEIRD_PREFIXES[Math.floor(rng.next() * WEIRD_PREFIXES.length)];
                const suffix = WEIRD_SUFFIXES[Math.floor(rng.next() * WEIRD_SUFFIXES.length)];
                name = `${prefix} ${suffix}`;
            } else {
                if (rng.next() < 0.6) {
                    name = NORMAL_PREFIXES[Math.floor(rng.next() * NORMAL_PREFIXES.length)];
                } else {
                    const prefix = NORMAL_PREFIXES[Math.floor(rng.next() * NORMAL_PREFIXES.length)];
                    const suffix = NORMAL_SUFFIXES[Math.floor(rng.next() * NORMAL_SUFFIXES.length)];
                    name = `${prefix} ${suffix}`;
                }
            }
            const strength = 0.3 + rng.next() * 0.4;
            const luck = 0.3 + rng.next() * 0.4;
            pool.push({
                id: i,
                name: name,
                color: HORSE_COLORS[Math.floor(rng.next() * HORSE_COLORS.length)],
                emoji: HORSE_EMOJIS[Math.floor(rng.next() * HORSE_EMOJIS.length)],
                strength: strength,
                luck: luck,
                position: 0,
                speed: 0,
                currentStamina: 1.0,
                odds: 0
            });
        }
        return pool;
    }

    let globalHorsePool = null;
    function getHorsePool() {
        if (!globalHorsePool) {
            globalHorsePool = generateHorsePool();
        }
        return globalHorsePool;
    }

    //-----------------------------------------------------------------------------
    // Scene_HorseRace
    //-----------------------------------------------------------------------------
    class Scene_HorseRace extends Scene_MenuBase {
        initialize() {
            super.initialize();
            this._gameState = 'selection'; // 'selection', 'racing', 'results', 'cannot_bet'
            this._bet = MIN_BET;
            this._selectedHorse = -1;
            this._raceHorses = [];
            this._finishOrder = [];
            this._raceTimer = 0;
            this._lastWin = 0;
            this.setupNewRace();
        }

        create() {
            super.create();
            this.createBackground();
            this.createWindowLayer();
            this.createAllWindows();
        }

        start() {
            super.start();
            const tokenCount = $gameParty.numItems($dataItems[TOKEN_ITEM_ID]);
            if (tokenCount < MIN_BET) {
                this.showCannotBetMessage();
            } else {
                this.showSelectionWindows();
            }
        }

        showCannotBetMessage() {
            this._gameState = 'cannot_bet';
            const tokens = $dataItems[TOKEN_ITEM_ID];
            const tokenName = tokens ? tokens.name : getText('tokens');
            const tokenCount = tokens ? $gameParty.numItems(tokens) : 0;
            
            this._helpWindow.setText(getText('notEnoughTokens', {
                tokenName: tokenName,
                current: tokenCount,
                needed: MIN_BET
            }));

            this._horseListWindow.deactivate();
            this._horseListWindow.hide();
            this._betWindow.hide();

            this._commandWindow.contents.clear();
            this._commandWindow.drawText(getText('exitGame'), 0, 50, 260, 'left');
        }

        setupNewRace() {
            const pool = getHorsePool();
            const selectedIndices = [];
            while (selectedIndices.length < 6) {
                const index = Math.floor(Math.random() * pool.length);
                if (!selectedIndices.includes(index)) {
                    selectedIndices.push(index);
                }
            }
            this._raceHorses = selectedIndices.map(index => {
                const horse = { ...pool[index] };
                horse.position = 0;
                horse.speed = 0;
                horse.currentStamina = 1.0;
                horse.odds = this.calculateOdds(horse.strength, horse.luck);
                return horse;
            });
            this._finishOrder = [];
            this._selectedHorse = -1;
            this._raceTimer = 0;
        }

        calculateOdds(strength, luck) {
            const rating = (strength + luck) / 2;
            const baseOdds = Math.max(2, Math.floor(8 - rating * 6));
            return baseOdds + Math.floor(Math.random() * 2);
        }

        createBackground() {
            this._backgroundSprite = new Sprite();
            this._backgroundSprite.bitmap = new Bitmap(Graphics.width, Graphics.height);
            const context = this._backgroundSprite.bitmap.context;
            const gradient = context.createLinearGradient(0, 0, 0, Graphics.height);
            gradient.addColorStop(0, '#87CEEB');
            gradient.addColorStop(0.6, '#98FB98');
            gradient.addColorStop(1, '#228B22');
            context.fillStyle = gradient;
            context.fillRect(0, 0, Graphics.width, Graphics.height);
            this.addChild(this._backgroundSprite);
        }

        createAllWindows() {
            this.createHelpWindow();
            this.createHorseListWindow();
            this.createBetWindow();
            this.createCommandWindow();
            this.createRaceWindow();
            this.createResultsWindow();
        }

        createHelpWindow() {
            const rect = new Rectangle(0, 0, Graphics.boxWidth, this.calcWindowHeight(1, false));
            this._helpWindow = new Window_Help(rect);
            this._helpWindow.setText(getText('helpText'));
            this.addWindow(this._helpWindow);
        }

        createHorseListWindow() {
            const rect = new Rectangle(20, 80, Graphics.boxWidth - 40, 300);
                        this._horseListWindow = new Window_HorseList(rect, this._raceHorses);
            this._horseListWindow.setHandler('ok', this.onHorseOk.bind(this));
            this._horseListWindow.setHandler('cancel', this.onCancel.bind(this));
            this.addWindow(this._horseListWindow);
        }

        createBetWindow() {
            const rect = new Rectangle(20, 400, 300, 140);
                        this._betWindow = new Window_BetInfo(rect);
            this._betWindow.setBet(this._bet);
            this.addWindow(this._betWindow);
        }

        createCommandWindow() {
            // Fixed: Made command window larger (increased width from 300 to 400 and height from 140 to 180)
            const rect = new Rectangle(340, 400, 400, 180);
            this._commandWindow = new Window_Base(rect);
            this.addWindow(this._commandWindow);
            this.refreshCommandWindow();
        }

        refreshCommandWindow() {
            this._commandWindow.contents.clear();
            if (this._gameState === 'selection') {
                this._commandWindow.drawText(getText('selectHorse'), 0, 0, 280, 'left');
                this._commandWindow.drawText(getText('changeBet1'), 0, 22, 280, 'left');
                                this._commandWindow.drawText(getText('changeBet10'), 0, 50, 280, 'left');
                this._commandWindow.drawText(getText('confirmSelection'), 0, 75, 280, 'left');
                this._commandWindow.drawText(getText('exitGame'), 0, 100, 280, 'left');
            } else if (this._gameState === 'results') {
                this._commandWindow.drawText(getText('newRace'), 0, 50, 280, 'left');
                this._commandWindow.drawText(getText('exitGame'), 0, 75, 280, 'left');
            }
        }

        createRaceWindow() {
            const rect = new Rectangle(0, 80, Graphics.boxWidth, Graphics.boxHeight - 80);
            this._raceWindow = new Window_RaceTrack(rect);
            this._raceWindow.setHorses(this._raceHorses);
            this._raceWindow.visible = false;
            this.addWindow(this._raceWindow);
        }

        createResultsWindow() {
            const rect = new Rectangle(150, 150, 500, 280);
                        this._resultsWindow = new Window_RaceResults(rect);
            this._resultsWindow.visible = false;
            this.addWindow(this._resultsWindow);
        }

        update() {
            super.update();
            if (this._gameState === 'selection') {
                this.updateSelection();
            } else if (this._gameState === 'racing') {
                this.updateRace();
            } else if (this._gameState === 'results') {
                this.updateResults();
            } else if (this._gameState === 'cannot_bet') {
                if (Input.isTriggered('cancel')) {
                    SoundManager.playCancel();
                    this.popScene();
                }
            }
        }

        updateSelection() {
            if (this._horseListWindow.active) {
                this.updateBetInput();
            }
        }

        updateBetInput() {
            let betChanged = false;
            const shiftPressed = Input.isPressed('shift');
            const amount = shiftPressed ? 10 : 1;
            if (Input.isRepeated('right')) {
                this.changeBet(amount);
                betChanged = true;
            } else if (Input.isRepeated('left')) {
                this.changeBet(-amount);
                betChanged = true;
            }
            if (betChanged) {
                Input._latestButton = null;
            }
        }

        changeBet(amount) {
            const oldBet = this._bet;
            const tokenCount = $gameParty.numItems($dataItems[TOKEN_ITEM_ID]);
            const currentMax = Math.min(MAX_BET, tokenCount);
            this._bet = Math.max(MIN_BET, Math.min(currentMax, this._bet + amount));

            if (this._bet !== oldBet) {
                SoundManager.playCursor();
                this._betWindow.setBet(this._bet);
                this._betWindow.refresh();
            } else {
                SoundManager.playBuzzer();
            }
        }

        onHorseOk() {
            this._selectedHorse = this._horseListWindow.index();
            this._betWindow.setSelectedHorse(this._raceHorses[this._selectedHorse]);
            this._betWindow.refresh();

            const tokens = $dataItems[TOKEN_ITEM_ID];
            if (!tokens) {
                SoundManager.playBuzzer();
                this._helpWindow.setText(getText('noTokens'));
                this._horseListWindow.activate();
                return;
            }

            const tokenCount = $gameParty.numItems(tokens);
            if (tokenCount < this._bet) {
                SoundManager.playBuzzer();
                this._helpWindow.setText(getText('notEnoughTokens', {
                    tokenName: tokens.name,
                    current: tokenCount,
                    needed: this._bet
                }));
                this._horseListWindow.activate();
                return;
            }

            SoundManager.playOk();
            this.startRace();
        }

        onCancel() {
            SoundManager.playCancel();
            this.popScene();
        }

        startRace() {
            this._gameState = 'racing';
            this._raceTimer = 0;
            this.hideSelectionWindows();
            this._raceWindow.visible = true;
            this._raceWindow.activate();
            
            const tokens = $dataItems[TOKEN_ITEM_ID];
            $gameParty.loseItem(tokens, this._bet);
            
            this._raceHorses.forEach(horse => {
                horse.position = 0;
                horse.currentStamina = 1.0;
                horse.speed = (0.5 + horse.strength * 0.8) * (0.8 + Math.random() * 0.4);
            });
            
            this._helpWindow.setText(getText('raceStarted'));
        }

        updateRace() {
            this._raceTimer++;
            this._raceHorses.forEach(horse => {
                if (horse.position < 100) {
                    const luckFactor = 0.7 + horse.luck * 0.6;
                    const speedModifier = luckFactor * (0.8 + Math.random() * 0.4);
                    const staminaLossRate = 0.003 * (1.5 - horse.luck);
                    horse.currentStamina = Math.max(0.4, horse.currentStamina - staminaLossRate);
                    const staminaFactor = Math.pow(horse.currentStamina, 0.5);
                    horse.position += horse.speed * speedModifier * staminaFactor  * 0.6;
                    
                    if (horse.position >= 100 && !this._finishOrder.includes(horse.id)) {
                        this._finishOrder.push(horse.id);
                        horse.position = 100;
                    }
                }
            });
            this._raceWindow.refresh();
            if (this._finishOrder.length >= this._raceHorses.length || this._raceTimer > 1800) {
                this.endRace();
            }
        }

        endRace() {
            this._gameState = 'results';
            const winnerId = this._finishOrder[0];
            const winnerHorse = this._raceHorses.find(h => h.id === winnerId);
            let winAmount = 0;
            let won = false;

            if (this._selectedHorse !== -1 && this._raceHorses[this._selectedHorse].id === winnerId) {
                const horse = this._raceHorses[this._selectedHorse];
                winAmount = this._bet * horse.odds;
                won = true;
                
                const tokens = $dataItems[TOKEN_ITEM_ID];
                $gameParty.gainItem(tokens, winAmount);
                this._lastWin = winAmount;
                SoundManager.playRecovery();
                
                if (winAmount >= this._bet * 5) {
                    $gameScreen.startFlash([255, 255, 255, 128], 30);
                }
            } else {
                this._lastWin = 0;
            }
            
            this.showResults(winnerHorse, won, winAmount);
        }

        showResults(winnerHorse, won, winAmount) {
            setTimeout(() => {
                this._raceWindow.visible = false;
                this._resultsWindow.visible = true;
                this._resultsWindow.setResults(winnerHorse, won, winAmount, this._bet);
                this._resultsWindow.refresh();
                
                const message = won ? 
                    getText('winMessage', { horseName: winnerHorse.name, amount: winAmount }) :
                    getText('loseMessage', { horseName: winnerHorse.name });
                    
                this._helpWindow.setText(message + getText('continuePrompt'));
                this.refreshCommandWindow();
            }, 500);
        }

        updateResults() {
            if (Input.isTriggered('ok')) {
                this.startNewRace();
            } else if (Input.isTriggered('cancel')) {
                this.popScene();
            }
        }

        startNewRace() {
            this._gameState = 'selection';
            this.setupNewRace();
            
            this._resultsWindow.visible = false;
            
            const tokenCount = $gameParty.numItems($dataItems[TOKEN_ITEM_ID]);
            if (tokenCount < MIN_BET) {
                this.showCannotBetMessage();
            } else {
                this.showSelectionWindows();
                this._horseListWindow.setHorses(this._raceHorses);
                this._raceWindow.setHorses(this._raceHorses);
                this._betWindow.setSelectedHorse(null);
                this._betWindow.refresh();
                this._helpWindow.setText(getText('helpText'));
                this.refreshCommandWindow();
            }
        }

        showSelectionWindows() {
            this._horseListWindow.visible = true;
            this._betWindow.visible = true;
            this._commandWindow.visible = true;
            this._horseListWindow.activate();
            this._horseListWindow.select(0);
        }

        hideSelectionWindows() {
            this._horseListWindow.visible = false;
            this._betWindow.visible = false;
            this._commandWindow.visible = false;
            this._horseListWindow.deactivate();
        }
    }

    //-----------------------------------------------------------------------------
    // Window_HorseList
    //-----------------------------------------------------------------------------
    class Window_HorseList extends Window_Selectable {
        initialize(rect, horses) {
            super.initialize(rect);
            this._horses = horses || [];
            this.refresh();
        }
        maxItems() {
            return this._horses.length;
        }
        setHorses(horses) {
            this._horses = horses;
            this.refresh();
        }
        itemHeight() {
            return 48;
        }
        drawItem(index) {
            const horse = this._horses[index];
            if (!horse) return;
            
            const rect = this.itemRect(index);
            const x = rect.x + 4;
            const y = rect.y + 4;
            
            this.contents.fontSize = 24;
            this.drawText(horse.emoji, x, y, 30, 'center');
            
            this.contents.fontSize = $dataSystem.advanced.fontSize;
            this.changeTextColor(horse.color);
            this.drawText(horse.name, x + 35, y + 8, 200, 'left');
            
            this.resetTextColor();
            // Fixed: Move odds to the right edge of the window
            const oddsX = this.innerWidth - 80;
            this.drawText(`${horse.odds}:1`, oddsX, y + 8, 80, 'right');
        }
        refresh() {
            this.contents.clear();
            this.drawAllItems();
        }
    }

    //-----------------------------------------------------------------------------
    // Window_BetInfo
    //-----------------------------------------------------------------------------
    class Window_BetInfo extends Window_Base {
        initialize(rect) {
            super.initialize(rect);
            this._bet = MIN_BET;
            this._selectedHorse = null;
            this.refresh();
        }
        setBet(bet) {
            this._bet = bet;
        }
        setSelectedHorse(horse) {
            this._selectedHorse = horse;
        }
        refresh() {
            this.contents.clear();
            const tokens = $dataItems[TOKEN_ITEM_ID];
            const tokenName = tokens ? tokens.name : getText('tokens');
            const tokenCount = tokens ? $gameParty.numItems(tokens) : 0;
            
            this.drawText(`${tokenName}:`, 0, 0, 120, 'left');
            this.changeTextColor(ColorManager.systemColor());
            this.drawText(tokenCount.toString(), 120, 0, 120, 'right');
            
            this.resetTextColor();
            this.drawText(getText('bet') + ':', 0, 30, 120, 'left');
            this.changeTextColor(ColorManager.powerUpColor());
            this.drawText(this._bet.toString(), 120, 30, 120, 'right');
            
            if (this._selectedHorse) {
                this.resetTextColor();
                this.drawText(getText('selected') + ':', 0, 60, 240, 'left');
                this.changeTextColor(this._selectedHorse.color);
                this.drawText(this._selectedHorse.name, 0, 85, 240, 'left');
                
                this.resetTextColor();
                const potentialWin = this._bet * this._selectedHorse.odds;
                this.drawText(getText('potentialWin') + ':', 0, 115, 120, 'left');
                this.changeTextColor(ColorManager.powerUpColor());
                this.drawText(potentialWin.toString(), 120, 115, 120, 'right');
                
                this.resetTextColor();
                this.drawText(getText('odds') + ':', 0, 145, 120, 'left');
                this.drawText(`${this._selectedHorse.odds}:1`, 200, 145, 120, 'right');
            }
        }
    }

    //-----------------------------------------------------------------------------
    // Window_RaceTrack
    //-----------------------------------------------------------------------------
    class Window_RaceTrack extends Window_Base {
        initialize(rect) {
            super.initialize(rect);
            this._horses = [];
            this.refresh();
        }
        setHorses(horses) {
            this._horses = horses;
        }
        refresh() {
            this.contents.clear();
            if (this._horses.length === 0) return;
            
            const trackWidth = this.innerWidth - 80;
            const laneHeight = Math.floor((this.innerHeight - 40) / this._horses.length);
            const startX = 40;
            
            this.contents.fontSize = 24;
            this.drawText(getText('raceInProgress'), 0, 10, this.innerWidth, 'center');
            this.contents.fontSize = $dataSystem.advanced.fontSize;
            
            for (let i = 0; i < this._horses.length; i++) {
                const horse = this._horses[i];
                const y = 50 + i * laneHeight;
                
                const laneColor = i % 2 === 0 ? 'rgba(144, 238, 144, 0.3)' : 'rgba(152, 251, 152, 0.3)';
                this.contents.fillRect(startX, y, trackWidth, laneHeight - 4, laneColor);
                this.contents.fillRect(startX, y, 2, laneHeight - 4, '#000000');
                this.contents.fillRect(startX + trackWidth - 2, y, 2, laneHeight - 4, '#FF0000');
                
                const horseX = startX + (horse.position / 100) * (trackWidth - 40);
                this.contents.fontSize = Math.min(24, laneHeight - 8);
                this.drawText(horse.emoji, horseX, y + 2, 30, 'left');
                
                this.contents.fontSize = 14;
                this.changeTextColor(horse.color);
                this.drawText(horse.name, startX + 40, y + Math.floor(laneHeight / 2) - 7, 200, 'left');                
                this.resetTextColor();
                this.contents.fontSize = 12;
                const percentage = Math.floor(horse.position);
                this.drawText(`${percentage}%`, horseX, y + laneHeight - 18, 40, 'center');
                
                this.contents.fontSize = $dataSystem.advanced.fontSize;
            }
            this.resetTextColor();
        }
    }

    //-----------------------------------------------------------------------------
    // Window_RaceResults
    //-----------------------------------------------------------------------------
    class Window_RaceResults extends Window_Base {
        initialize(rect) {
            super.initialize(rect);
            this._winner = null;
            this._won = false;
            this._winAmount = 0;
            this._bet = 0;
        }
        setResults(winner, won, winAmount, bet) {
            this._winner = winner;
            this._won = won;
            this._winAmount = winAmount;
            this._bet = bet;
        }
        refresh() {
            this.contents.clear();
            if (!this._winner) return;
            
            this.contents.fontSize = 24;
            this.drawText(getText('raceResults'), 0, 10, this.innerWidth, 'center');
            
            this.contents.fontSize = 18;
            this.drawText(getText('winner') + ':', 20, 50, 100, 'left');
            this.changeTextColor(this._winner.color);
            this.drawText(`${this._winner.emoji} ${this._winner.name}`, 20, 75, 450, 'center');
            
            this.resetTextColor();
            this.contents.fontSize = $dataSystem.advanced.fontSize;
            
            if (this._won) {
                this.changeTextColor(ColorManager.powerUpColor());
                this.contents.fontSize = 20;
                this.drawText(getText('youWon'), 0, 110, this.innerWidth, 'center');
                
                this.contents.fontSize = $dataSystem.advanced.fontSize;
                this.resetTextColor();
                this.drawText(getText('bet') + ':', 50, 150, 120, 'left');
                this.drawText(this._bet.toString(), 170, 150, 100, 'right');
                
                this.drawText(getText('won') + ':', 50, 175, 120, 'left');
                this.changeTextColor(ColorManager.powerUpColor());
                this.drawText(this._winAmount.toString(), 170, 175, 100, 'right');
                
                this.resetTextColor();
                this.drawText(getText('profit') + ':', 50, 200, 120, 'left');
                this.changeTextColor(ColorManager.powerUpColor());
                this.drawText((this._winAmount - this._bet).toString(), 170, 200, 100, 'right');
            } else {
                this.changeTextColor(ColorManager.deathColor());
                this.contents.fontSize = 20;
                this.drawText(getText('youLost'), 0, 110, this.innerWidth, 'center');
                
                this.contents.fontSize = $dataSystem.advanced.fontSize;
                this.resetTextColor();
                this.drawText(getText('lost') + ':', 50, 150, 120, 'left');
                this.changeTextColor(ColorManager.deathColor());
                this.drawText(this._bet.toString(), 170, 150, 100, 'right');
            }
            this.resetTextColor();
        }
    }

    window.Scene_HorseRace = Scene_HorseRace;
    window.Window_HorseList = Window_HorseList;
    window.Window_BetInfo = Window_BetInfo;
    window.Window_RaceTrack = Window_RaceTrack;
    window.Window_RaceResults = Window_RaceResults;

})();
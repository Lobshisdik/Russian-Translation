/*:
 * @plugindesc v1.1 Tetris-based Lockpicking Minigame for RPG Maker MV/MZ
 * @author Omni-Lex
 * 
 * @param difficultyDefault
 * @text Default Difficulty
 * @desc Default difficulty level (1-10) if not specified
 * @type number
 * @min 1
 * @max 10
 * @default 5
 * 
 * @param timeMultiplier
 * @text Time Limit Multiplier
 * @desc Multiplier for time limit calculation
 * @type number
 * @decimals 1
 * @min 0.5
 * @max 3.0
 * @default 1.0
 * 
 * @param speedMultiplier
 * @text Speed Multiplier
 * @desc Multiplier for drop speed calculation
 * @type number
 * @decimals 1
 * @min 0.5
 * @max 3.0
 * @default 1.0
 *
 * @command startMinigame
 * @text Start Lockpick Minigame
 * @desc Start the Tetris-based lockpicking minigame
 *
 * @arg difficulty
 * @text Difficulty
 * @desc Difficulty level (1-10)
 * @type number
 * @min 1
 * @max 10
 * @default 5
 *
 * @arg successSwitch
 * @text Success Switch
 * @desc Switch ID to turn ON if player succeeds
 * @type switch
 * @default 0
 *
 * @arg failureSwitch
 * @text Failure Switch
 * @desc Switch ID to turn ON if player fails
 * @type switch
 * @default 0
 *
 * @arg successSelfSwitch
 * @text Success Self Switch
 * @desc Self switch (A, B, C, D) to turn ON if player succeeds
 * @type select
 * @option None
 * @value 
 * @option A
 * @value A
 * @option B
 * @value B
 * @option C
 * @value C
 * @option D
 * @value D
 * @default 
 *
 * @arg failureSelfSwitch
 * @text Failure Self Switch
 * @desc Self switch (A, B, C, D) to turn ON if player fails
 * @type select
 * @option None
 * @value 
 * @option A
 * @value A
 * @option B
 * @value B
 * @option C
 * @value C
 * @option D
 * @value D
 * @default 
 *
 * @help
 * ============================================================================
 * Introduction
 * ============================================================================
 * 
 * This plugin adds a Tetris-based lockpicking minigame to your RPG Maker
 * project. When a player attempts to pick a lock, they'll need to place a
 * falling Tetris block in a partially completed puzzle to succeed.
 * 
 * ============================================================================
 * How to Use
 * ============================================================================
 * 
 * Use the following plugin command to start the minigame:
 * 
 * RPG Maker MV:
 * LockpickTetris start [difficulty] [successSwitch] [failureSwitch] [successSelfSwitch] [failureSelfSwitch]
 * 
 * RPG Maker MZ:
 * Use the plugin command menu and select "Start Lockpick Minigame", then
 * set parameters:
 * - difficulty: 1-10 (1 = easy, 10 = hard)
 * - successSwitch: Switch ID to turn ON if player succeeds
 * - failureSwitch: Switch ID to turn ON if player fails
 * - successSelfSwitch: Self switch (A, B, C, D) to turn ON if player succeeds
 * - failureSelfSwitch: Self switch (A, B, C, D) to turn ON if player fails
 * 
 * The difficulty affects:
 * - Drop speed of the Tetris block
 * - Time limit to place the block
 * - Complexity of the pre-filled board
 * 
 * Self switches will be activated on the event that called the minigame,
 * allowing you to easily control event progression after lockpicking.
 * 
 * ============================================================================
 * Credits & Thanks
 * ============================================================================
 * 
 * If you use this plugin, credit is appreciated but not required.
 */

var Imported = Imported || {};
Imported.LockpickTetris = true;

var LockpickTetris = LockpickTetris || {};
LockpickTetris.version = 1.1;

//=============================================================================
// Plugin Manager - Register commands
//=============================================================================

if (Utils.RPGMAKER_NAME === "MZ") {
    PluginManager.registerCommand("LockpickTetris", "startMinigame", args => {
        const difficulty = Number(args.difficulty) || 5;
        const successSwitch = Number(args.successSwitch) || 0;
        const failureSwitch = Number(args.failureSwitch) || 0;
        const successSelfSwitch = args.successSelfSwitch || '';
        const failureSelfSwitch = args.failureSelfSwitch || '';
        LockpickTetris.start(difficulty, successSwitch, failureSwitch, successSelfSwitch, failureSelfSwitch);
    });
}

//=============================================================================
// Game_Interpreter - Register plugin command for MV
//=============================================================================

const _Game_Interpreter_pluginCommand = Game_Interpreter.prototype.pluginCommand;
Game_Interpreter.prototype.pluginCommand = function(command, args) {
    _Game_Interpreter_pluginCommand.call(this, command, args);
    
    if (command === 'LockpickTetris') {
        console.log("LockpickTetris command detected with args:", args);
        if (args[0] === 'start') {
            const difficulty = Number(args[1]) || LockpickTetris.defaultDifficulty;
            const successSwitch = Number(args[2]) || 0;
            const failureSwitch = Number(args[3]) || 0;
            const successSelfSwitch = args[4] || '';
            const failureSelfSwitch = args[5] || '';
            console.log("Starting LockpickTetris with:", difficulty, successSwitch, failureSwitch, successSelfSwitch, failureSelfSwitch);
            LockpickTetris.start(difficulty, successSwitch, failureSwitch, successSelfSwitch, failureSelfSwitch);
        }
    }
};

//=============================================================================
// Translation System
//=============================================================================

LockpickTetris.translations = {
    en: {
        controls: 'Left/Right: Move   Up: Rotate   Down: Soft Drop   Space: Hard Drop',
        complexity: 'Lock complexity: ',
        seconds: 's',
        lockPicked: 'Lock Picked!',
        lockJammed: 'Lock jammed...',
        timeUp: 'Time up!'
    },
    it: {
        controls: 'Sinistra/Destra: Muovi   Su: Ruota   Giù: Caduta morbida   Spazio: Caduta veloce',
        complexity: 'Complessità serratura: ',
        seconds: 's',
        lockPicked: 'Serratura scassinata!',
        lockJammed: 'Serratura bloccata...',
        timeUp: 'Tempo scaduto!'
    }
};

LockpickTetris.getText = function(key) {
    const useTranslation = ConfigManager.language === 'it';
    const lang = useTranslation ? 'it' : 'en';
    return this.translations[lang][key] || this.translations.en[key];
};

//=============================================================================
// LockpickTetris - Main functionality
//=============================================================================

// Initialize parameters
LockpickTetris.Parameters = PluginManager.parameters('LockpickTetris');
LockpickTetris.defaultDifficulty = Number(LockpickTetris.Parameters.difficultyDefault || 5);
LockpickTetris.timeMultiplier = Number(LockpickTetris.Parameters.timeMultiplier || 1.0);
LockpickTetris.speedMultiplier = Number(LockpickTetris.Parameters.speedMultiplier || 1.0);

// Constants for the game
LockpickTetris.BOARD_WIDTH = 10;
LockpickTetris.BOARD_HEIGHT = 20;
LockpickTetris.BLOCK_SIZE = 24;
LockpickTetris.COLORS = [
    '#000000', // Empty
    '#FF0000', // Red
    '#00FF00', // Green
    '#0000FF', // Blue
    '#FFFF00', // Yellow
    '#FF00FF', // Magenta
    '#00FFFF', // Cyan
    '#FFA500'  // Orange
];

// Tetromino shapes (IJLOSTZ)
LockpickTetris.SHAPES = [
    // I
    [
        [0, 0, 0, 0],
        [1, 1, 1, 1],
        [0, 0, 0, 0],
        [0, 0, 0, 0]
    ],
    // J
    [
        [2, 0, 0],
        [2, 2, 2],
        [0, 0, 0]
    ],
    // L
    [
        [0, 0, 3],
        [3, 3, 3],
        [0, 0, 0]
    ],
    // O
    [
        [4, 4],
        [4, 4]
    ],
    // S
    [
        [0, 5, 5],
        [5, 5, 0],
        [0, 0, 0]
    ],
    // T
    [
        [0, 6, 0],
        [6, 6, 6],
        [0, 0, 0]
    ],
    // Z
    [
        [7, 7, 0],
        [0, 7, 7],
        [0, 0, 0]
    ]
];

// Starting point for the lockpicking minigame
// Starting point for the lockpicking minigame
LockpickTetris.start = function(difficulty, successSwitch, failureSwitch, successSelfSwitch, failureSelfSwitch) {
    try {
        // Check for skeleton key (item 206) first
        if ($dataItems[206] && $gameParty.hasItem($dataItems[206])) {
            window.skipLocalization = true;
            // Show skeleton key message
            $gameMessage.add("Used Skeleton Key!");
            window.skipLocalization = false;

            // Store parameters for switch activation
            this.successSwitch = successSwitch;
            this.successSelfSwitch = successSelfSwitch;
            this.currentEventId = $gameMap.isEventRunning() ? $gameMap._interpreter.eventId() : 0;
            this.currentMapId = $gameMap.mapId();
            
            // Consume the skeleton key
            $gameParty.loseItem($dataItems[206], 1);
            
            // Activate success switches
            if (successSwitch > 0) {
                $gameSwitches.setValue(successSwitch, true);
            }
            
            if (this.currentEventId > 0 && successSelfSwitch && ['A', 'B', 'C', 'D'].includes(successSelfSwitch)) {
                const key = [this.currentMapId, this.currentEventId, successSelfSwitch];
                $gameSelfSwitches.setValue(key, true);
            }
            
            return; // Exit without starting the minigame
        }
        
        // NEW: Check for lockpicks (item 564)
        if (!$dataItems[564] || !$gameParty.hasItem($dataItems[564])) {
            // Show no lockpicks message
            window.skipLocalization = true;

            $gameMessage.add("You don't have any lockpicks");
            window.skipLocalization = false;

            return; // Exit without starting the minigame
        }
        
        // Save parameters for later use
        this.difficulty = Math.min(Math.max(difficulty, 1), 10);
        this.successSwitch = successSwitch;
        this.failureSwitch = failureSwitch;
        this.successSelfSwitch = successSelfSwitch;
        this.failureSelfSwitch = failureSelfSwitch;
        
        // Store the current event for self switch activation
        this.currentEventId = $gameMap.isEventRunning() ? $gameMap._interpreter.eventId() : 0;
        this.currentMapId = $gameMap.mapId();
        
        // Get multipliers from parameters
        const params = PluginManager.parameters('LockpickTetris');
        const timeMultiplier = Number(params.timeMultiplier || 1.0);
        const speedMultiplier = Number(params.speedMultiplier || 1.0);
        
        // Calculate game parameters based on difficulty
        this.calculateDifficultySettings(difficulty, timeMultiplier, speedMultiplier);
        
        console.log("Starting LockpickTetris with difficulty: " + difficulty);
        console.log("Drop interval: " + this.dropInterval + "ms, Time limit: " + (this.timeLimit/1000) + "s");
        
        console.log("Event ID: " + this.currentEventId + ", Map ID: " + this.currentMapId);
        
        // Use a safer way to push the scene
        if (window.Scene_LockpickTetris) {
            SceneManager.push(Scene_LockpickTetris);
        } else {
            console.error("Scene_LockpickTetris is not defined yet!");
            
            // Try again in a moment to give scripts time to load
            setTimeout(function() {
                if (window.Scene_LockpickTetris) {
                    SceneManager.push(Scene_LockpickTetris);
                } else {
                    console.error("Scene_LockpickTetris is still not defined after delay!");
                }
            }, 100);
        }
    } catch (e) {
        console.error("Error starting LockpickTetris: " + e.message);
    }
};
// New method for improved difficulty calculation
LockpickTetris.calculateDifficultySettings = function(difficulty, timeMultiplier, speedMultiplier) {
    // Improved drop speed calculation - much more forgiving for lower difficulties
    if (difficulty <= 3) {
        // Very easy: 1200-1800ms drop interval
        this.dropInterval = Math.max(1800 - ((difficulty - 1) * 300), 1200) * speedMultiplier;
    } else if (difficulty <= 6) {
        // Medium: 800-1200ms drop interval
        this.dropInterval = Math.max(1200 - ((difficulty - 3) * 133), 800) * speedMultiplier;
    } else {
        // Hard: 300-800ms drop interval
        this.dropInterval = Math.max(800 - ((difficulty - 6) * 125), 300) * speedMultiplier;
    }
    
    // Improved time limit calculation - much more generous for lower difficulties
    if (difficulty <= 3) {
        // Very easy: 45-60 seconds
        this.timeLimit = (60 - ((difficulty - 1) * 5)) * 1000 * timeMultiplier;
    } else if (difficulty <= 6) {
        // Medium: 25-45 seconds
        this.timeLimit = (45 - ((difficulty - 3) * 6.67)) * 1000 * timeMultiplier;
    } else {
        // Hard: 10-25 seconds
        this.timeLimit = Math.max(25 - ((difficulty - 6) * 3.75), 10) * 1000 * timeMultiplier;
    }
};
//=============================================================================
// Scene_LockpickTetris
//=============================================================================

// Make sure Scene_LockpickTetris is properly defined in the global scope
window.Scene_LockpickTetris = function() {
    this.initialize.apply(this, arguments);
};

Scene_LockpickTetris.prototype = Object.create(Scene_Base.prototype);
Scene_LockpickTetris.prototype.constructor = Scene_LockpickTetris;

Scene_LockpickTetris.prototype.initialize = function() {
    Scene_Base.prototype.initialize.call(this);
    this.createGameVariables();
    console.log("Scene_LockpickTetris initialized");
};

Scene_LockpickTetris.prototype.create = function() {
    Scene_Base.prototype.create.call(this);
    this.createBackground();
    this.createGameBoard();
    this.createUI();
    this.setupInitialBoard();
    this.spawnTetromino();
    this.startTimer();
    this.setupInput();
};

Scene_LockpickTetris.prototype.createGameVariables = function() {
    this.board = Array(LockpickTetris.BOARD_HEIGHT).fill().map(() => 
        Array(LockpickTetris.BOARD_WIDTH).fill(0));
    this.currentPiece = null;
    this.currentPos = { x: 0, y: 0 };
    this.lastDropTime = 0;
    this.gameOver = false;
    this.success = false;
    this.timeRemaining = LockpickTetris.timeLimit;
    this.normalDropInterval = LockpickTetris.dropInterval; // Store normal drop speed
    this.fastDropActive = false; // Track if fast drop is active
};

Scene_LockpickTetris.prototype.createBackground = function() {
    this._backgroundSprite = new Sprite();
    this._backgroundSprite.bitmap = new Bitmap(Graphics.width, Graphics.height);
    this._backgroundSprite.bitmap.fillAll('rgba(0, 0, 0, 0.7)');
    this.addChild(this._backgroundSprite);
    
    // Add lock image/background - with fallback if image doesn't exist
    try {
        this._lockSprite = new Sprite();
        
        // Try to load the Lock image, but with a fallback
        try {
            this._lockSprite.bitmap = ImageManager.loadSystem('Lock');
        } catch (e) {
            console.log("Lock image not found, using fallback");
            // Create a fallback lock icon
            this._lockSprite.bitmap = new Bitmap(160, 160);
            this._lockSprite.bitmap.fillAll('rgba(50, 50, 80, 0.4)');
            
            // Draw a simple lock icon
            this._lockSprite.bitmap.fillRect(60, 40, 40, 80, '#888888');
            this._lockSprite.bitmap.fillRect(50, 80, 60, 40, '#888888');
        }
        
        this._lockSprite.x = 0;
        this._lockSprite.y = 0;
        this.addChild(this._lockSprite);
    } catch (e) {
        console.error("Error creating lock sprite: " + e.message);
    }
};

Scene_LockpickTetris.prototype.createGameBoard = function() {
    const width = LockpickTetris.BOARD_WIDTH * LockpickTetris.BLOCK_SIZE;
    const height = LockpickTetris.BOARD_HEIGHT * LockpickTetris.BLOCK_SIZE;
    
    this._boardSprite = new Sprite();
    this._boardSprite.bitmap = new Bitmap(width, height);
    this._boardSprite.bitmap.fillAll('rgba(32, 32, 32, 0.3)');
    this._boardSprite.x = (Graphics.width - width) / 2;
    this._boardSprite.y = 60;
    this.addChild(this._boardSprite);
    
    this._blocksSprite = new Sprite();
    this._blocksSprite.bitmap = new Bitmap(width, height);
    this._blocksSprite.x = this._boardSprite.x;
    this._blocksSprite.y = this._boardSprite.y;
    this.addChild(this._blocksSprite);
};

Scene_LockpickTetris.prototype.createUI = function() {
    // Timer display
    this._timerSprite = new Sprite();
    this._timerSprite.bitmap = new Bitmap(200, 36);
    this._timerSprite.x = 20;
    this._timerSprite.y = 20;
    this.addChild(this._timerSprite);
    
    // Help text
    this._helpTextSprite = new Sprite();
    this._helpTextSprite.bitmap = new Bitmap(Graphics.width - 40, 72);
    this._helpTextSprite.x = 20;
    this._helpTextSprite.y = Graphics.height - 60;
    this._helpTextSprite.bitmap.fontSize = 16;
    this._helpTextSprite.bitmap.textColor = '#FFFFFF';
    this._helpTextSprite.bitmap.drawText(LockpickTetris.getText('controls'), 0, 0, Graphics.width - 40, 24, 'center');
        this.addChild(this._helpTextSprite);
    
    // Difficulty display
    this._difficultySprite = new Sprite();
    this._difficultySprite.bitmap = new Bitmap(200, 36);
    this._difficultySprite.x = Graphics.width - 220;
    this._difficultySprite.y = 20;
    this._difficultySprite.bitmap.fontSize = 18;
    this._difficultySprite.bitmap.textColor = '#FFFFFF';
    this._difficultySprite.bitmap.drawText(LockpickTetris.getText('complexity') + LockpickTetris.difficulty + '0%', 0, 0, 200, 36, 'right');
        this.addChild(this._difficultySprite);
};

Scene_LockpickTetris.prototype.setupInitialBoard = function() {
    // Improved board generation - much easier for lower difficulties
    let fillRows, filledPercentage;
    
    if (LockpickTetris.difficulty <= 3) {
        // Very easy: 1-3 rows, 20-35% filled
        fillRows = Math.min(LockpickTetris.difficulty, 3);
        filledPercentage = 0.20 + (LockpickTetris.difficulty * 0.05);
    } else if (LockpickTetris.difficulty <= 6) {
        // Medium: 3-6 rows, 35-50% filled
        fillRows = 3 + (LockpickTetris.difficulty - 3);
        filledPercentage = 0.35 + ((LockpickTetris.difficulty - 3) * 0.05);
    } else {
        // Hard: 6-12 rows, 50-70% filled
        fillRows = Math.min(6 + ((LockpickTetris.difficulty - 6) * 1.5), 12);
        filledPercentage = 0.50 + ((LockpickTetris.difficulty - 6) * 0.05);
    }
    
    console.log("Board setup: " + fillRows + " rows, " + (filledPercentage * 100) + "% filled");
    
    // Start from the bottom of the board
    for (let y = LockpickTetris.BOARD_HEIGHT - 1; y >= LockpickTetris.BOARD_HEIGHT - fillRows; y--) {
        // Ensure we don't have any complete lines already
        let blockCount = 0;
        
        for (let x = 0; x < LockpickTetris.BOARD_WIDTH; x++) {
            if (Math.random() < filledPercentage) {
                // Randomly choose a block color (1-7)
                this.board[y][x] = Math.floor(Math.random() * 7) + 1;
                blockCount++;
            }
        }
        
        // Make sure we don't have a complete line
        if (blockCount === LockpickTetris.BOARD_WIDTH) {
            // Remove one block randomly
            const randomX = Math.floor(Math.random() * LockpickTetris.BOARD_WIDTH);
            this.board[y][randomX] = 0;
        }
        
        // For very easy difficulties, ensure we have plenty of gaps
        if (LockpickTetris.difficulty <= 2 && blockCount === 0) {
            // Add at least one block
            const randomX = Math.floor(Math.random() * LockpickTetris.BOARD_WIDTH);
            this.board[y][randomX] = Math.floor(Math.random() * 7) + 1;
        }
    }
    
    this.drawBoard();
};
Scene_LockpickTetris.prototype.drawBoard = function() {
    this._blocksSprite.bitmap.clear();
    
    // Draw the fixed blocks
    for (let y = 0; y < LockpickTetris.BOARD_HEIGHT; y++) {
        for (let x = 0; x < LockpickTetris.BOARD_WIDTH; x++) {
            const colorIndex = this.board[y][x];
            if (colorIndex > 0) {
                this.drawBlock(x, y, colorIndex);
            }
        }
    }
    
    // Draw the current piece
    if (this.currentPiece) {
        this.drawTetromino();
    }
};

Scene_LockpickTetris.prototype.drawBlock = function(x, y, colorIndex) {
    const blockSize = LockpickTetris.BLOCK_SIZE;
    const color = LockpickTetris.COLORS[colorIndex];
    const bitmap = this._blocksSprite.bitmap;
    
    // Main block fill
    bitmap.fillRect(x * blockSize, y * blockSize, blockSize, blockSize, color);
    
    // Highlight (top and left edges)
    bitmap.fillRect(x * blockSize, y * blockSize, blockSize, 2, 'rgba(255, 255, 255, 0.8)');
    bitmap.fillRect(x * blockSize, y * blockSize, 2, blockSize, 'rgba(255, 255, 255, 0.8)');
    
    // Shadow (bottom and right edges)
    bitmap.fillRect(x * blockSize, (y + 1) * blockSize - 2, blockSize, 2, 'rgba(0, 0, 0, 0.5)');
    bitmap.fillRect((x + 1) * blockSize - 2, y * blockSize, 2, blockSize, 'rgba(0, 0, 0, 0.5)');
};

Scene_LockpickTetris.prototype.spawnTetromino = function() {
    // Randomly select a piece
    const shapeIndex = Math.floor(Math.random() * LockpickTetris.SHAPES.length);
    this.currentPiece = JSON.parse(JSON.stringify(LockpickTetris.SHAPES[shapeIndex]));
    
    // Place it at the top-center of the board
    this.currentPos = {
        x: Math.floor((LockpickTetris.BOARD_WIDTH - this.currentPiece[0].length) / 2),
        y: 0
    };
    
    // Check if the spawn position is valid
    if (!this.isValidMove(this.currentPos.x, this.currentPos.y, this.currentPiece)) {
        this.gameOver = true;
        this.endGame(false,"");
    }
};

Scene_LockpickTetris.prototype.drawTetromino = function() {
    for (let y = 0; y < this.currentPiece.length; y++) {
        for (let x = 0; x < this.currentPiece[y].length; x++) {
            const colorIndex = this.currentPiece[y][x];
            if (colorIndex > 0) {
                this.drawBlock(this.currentPos.x + x, this.currentPos.y + y, colorIndex);
            }
        }
    }
};

Scene_LockpickTetris.prototype.isValidMove = function(newX, newY, piece) {
    for (let y = 0; y < piece.length; y++) {
        for (let x = 0; x < piece[y].length; x++) {
            if (piece[y][x] === 0) continue;
            
            const boardX = newX + x;
            const boardY = newY + y;
            
            // Check boundaries
            if (boardX < 0 || boardX >= LockpickTetris.BOARD_WIDTH || 
                boardY < 0 || boardY >= LockpickTetris.BOARD_HEIGHT) {
                return false;
            }
            
            // Check collision with placed blocks
            if (this.board[boardY][boardX] > 0) {
                return false;
            }
        }
    }
    
    return true;
};

Scene_LockpickTetris.prototype.rotatePiece = function(clockwise) {
    const rotated = [];
    const M = this.currentPiece.length;
    const N = this.currentPiece[0].length;
    
    // Initialize rotated array with zeros
    for (let i = 0; i < N; i++) {
        rotated.push(Array(M).fill(0));
    }
    
    // Perform rotation
    if (clockwise) {
        // Clockwise rotation
        for (let y = 0; y < M; y++) {
            for (let x = 0; x < N; x++) {
                rotated[x][M - 1 - y] = this.currentPiece[y][x];
            }
        }
    } else {
        // Counter-clockwise rotation
        for (let y = 0; y < M; y++) {
            for (let x = 0; x < N; x++) {
                rotated[N - 1 - x][y] = this.currentPiece[y][x];
            }
        }
    }
    
    // Check if rotation is valid
    if (this.isValidMove(this.currentPos.x, this.currentPos.y, rotated)) {
        this.currentPiece = rotated;
    } else {
        // Try wall kicks (simple implementation)
        const kicks = [-1, 1, -2, 2];
        
        for (const kick of kicks) {
            if (this.isValidMove(this.currentPos.x + kick, this.currentPos.y, rotated)) {
                this.currentPos.x += kick;
                this.currentPiece = rotated;
                break;
            }
        }
    }
};

Scene_LockpickTetris.prototype.movePiece = function(dx, dy) {
    const newX = this.currentPos.x + dx;
    const newY = this.currentPos.y + dy;
    
    if (this.isValidMove(newX, newY, this.currentPiece)) {
        this.currentPos.x = newX;
        this.currentPos.y = newY;
        return true;
    }
    
    return false;
};

Scene_LockpickTetris.prototype.dropPiece = function() {
    while (this.movePiece(0, 1)) {
        // Keep moving down until we hit something
    }
    
    this.lockPiece();
};

Scene_LockpickTetris.prototype.lockPiece = function() {
    // Merge the current piece with the board
    for (let y = 0; y < this.currentPiece.length; y++) {
        for (let x = 0; x < this.currentPiece[y].length; x++) {
            const colorIndex = this.currentPiece[y][x];
            if (colorIndex > 0) {
                const boardX = this.currentPos.x + x;
                const boardY = this.currentPos.y + y;
                this.board[boardY][boardX] = colorIndex;
            }
        }
    }
    
    // Check for completed lines
    this.checkLines();
    
    // Spawn a new piece
    this.spawnTetromino();
};

Scene_LockpickTetris.prototype.checkLines = function() {
    let completedLines = 0;
    
    for (let y = 0; y < LockpickTetris.BOARD_HEIGHT; y++) {
        let complete = true;
        
        // Check if the line is complete
        for (let x = 0; x < LockpickTetris.BOARD_WIDTH; x++) {
            if (this.board[y][x] === 0) {
                complete = false;
                break;
            }
        }
        
        if (complete) {
            completedLines++;
            
            // Clear the line
            for (let x = 0; x < LockpickTetris.BOARD_WIDTH; x++) {
                this.board[y][x] = 0;
            }
            
            // Show completion animation
            this.animateLineClear(y);
            
            // End game with success
            this.success = true;
            this.endGame(true,"");
            return;
        }
    }
};

Scene_LockpickTetris.prototype.animateLineClear = function(lineY) {
    const width = LockpickTetris.BOARD_WIDTH * LockpickTetris.BLOCK_SIZE;
    const y = lineY * LockpickTetris.BLOCK_SIZE;
    
    // Create flash effect
    const flash = new Sprite();
    flash.bitmap = new Bitmap(width, LockpickTetris.BLOCK_SIZE);
    flash.bitmap.fillAll('#FFFFFF');
    flash.x = this._boardSprite.x;
    flash.y = this._boardSprite.y + y;
    flash.opacity = 0;
    this.addChild(flash);
    
    // Animate flash
    const flashDuration = 30;
    for (let i = 0; i <= flashDuration; i++) {
        setTimeout(() => {
            if (i <= flashDuration / 2) {
                flash.opacity = (i / (flashDuration / 2)) * 255;
            } else {
                flash.opacity = (1 - ((i - flashDuration / 2) / (flashDuration / 2))) * 255;
            }
            
            if (i === flashDuration) {
                this.removeChild(flash);
            }
        }, i * 16);
    }
};

Scene_LockpickTetris.prototype.startTimer = function() {
    this.lastTime = performance.now();
    this.lastDropTime = this.lastTime;
};

Scene_LockpickTetris.prototype.setupInput = function() {
    this._leftPressed = false;
    this._rightPressed = false;
    this._upPressed = false;    // Added for up arrow rotation
    this._downPressed = false;
    this._zPressed = false;
    this._xPressed = false;
    this._spacePressed = false;
};

Scene_LockpickTetris.prototype.update = function() {
    Scene_Base.prototype.update.call(this);
    
    if (this.gameOver) return;
    
    const currentTime = performance.now();
    const deltaTime = currentTime - this.lastTime;
    this.lastTime = currentTime;
    
    this.updateTimer(deltaTime);
    this.handleInput();
    
    // Handle automatic drop
    if (currentTime - this.lastDropTime >= LockpickTetris.dropInterval) {
        this.lastDropTime = currentTime;
        
        if (!this.movePiece(0, 1)) {
            this.lockPiece();
        }
    }
    
    this.drawBoard();
};

Scene_LockpickTetris.prototype.updateTimer = function(deltaTime) {
    this.timeRemaining -= deltaTime;
    
    if (this.timeRemaining <= 0) {
        this.timeRemaining = 0;
        this.endGame(false,"");
    }
    
    // Update timer display
    this._timerSprite.bitmap.clear();
    this._timerSprite.bitmap.fontSize = 36;
    this._timerSprite.bitmap.textColor = this.timeRemaining < 5000 ? '#FF0000' : '#FFFFFF';
    this._timerSprite.bitmap.drawText(Math.ceil(this.timeRemaining / 1000) + LockpickTetris.getText('seconds'), 0, 0, 200, 36, 'left');
};

Scene_LockpickTetris.prototype.handleInput = function() {
    // Left arrow
    if (Input.isTriggered('left') || (Input.isPressed('left') && !this._leftPressed)) {
        this._leftPressed = Input.isPressed('left');
        this.movePiece(-1, 0);
    } else if (!Input.isPressed('left')) {
        this._leftPressed = false;
    }
    
    // Right arrow
    if (Input.isTriggered('right') || (Input.isPressed('right') && !this._rightPressed)) {
        this._rightPressed = Input.isPressed('right');
        this.movePiece(1, 0);
    } else if (!Input.isPressed('right')) {
        this._rightPressed = false;
    }
    
    // Up arrow (rotate clockwise)
    if (Input.isTriggered('up') || (Input.isPressed('up') && !this._upPressed)) {
        this._upPressed = Input.isPressed('up');
        this.rotatePiece(true); // Clockwise rotation
    } else if (!Input.isPressed('up')) {
        this._upPressed = false;
    }
    
    // Down arrow (soft drop)
    if (Input.isPressed('down')) {
        if (!this._downPressed) {
            this._downPressed = true;
            this.fastDropActive = true;
            // Make the piece drop faster (8x normal speed)
            LockpickTetris.dropInterval = this.normalDropInterval / 8;
        }
    } else if (this._downPressed) {
        this._downPressed = false;
        this.fastDropActive = false;
        // Reset to normal speed when down key is released
        LockpickTetris.dropInterval = this.normalDropInterval;
    }
    
    // Z key (rotate counter-clockwise) - kept for compatibility
    if (Input.isTriggered('pageup') || (Input.isPressed('pageup') && !this._zPressed)) {
        this._zPressed = Input.isPressed('pageup');
        this.rotatePiece(false);
    } else if (!Input.isPressed('pageup')) {
        this._zPressed = false;
    }
    
    // X key (rotate clockwise) - kept for compatibility
    if (Input.isTriggered('pagedown') || (Input.isPressed('pagedown') && !this._xPressed)) {
        this._xPressed = Input.isPressed('pagedown');
        this.rotatePiece(true);
    } else if (!Input.isPressed('pagedown')) {
        this._xPressed = false;
    }
    
    // Space key (hard drop)
    if (Input.isTriggered('ok') && !this._spacePressed) {
        this._spacePressed = true;
        this.dropPiece();
    } else if (!Input.isPressed('ok')) {
        this._spacePressed = false;
    }
    
    // ESC key (cancel game)
    if (Input.isTriggered('escape') || Input.isTriggered('cancel')) {
        this.endGame(false, 'timeUp');    }
};


Scene_LockpickTetris.prototype.endGame = function(success, reason) {
    this.gameOver = true;
    this.success = success;
    
    // NEW: Consume lockpick (item 564) only if failed
    // Note: Skeleton key users won't reach this point as they bypass the minigame
    if (!success && $dataItems[564]) {
        $gameParty.loseItem($dataItems[564], 1);
        console.log("Lockpick consumed due to failure");
    }
    
    // Determine the message to show with translation support
    let message;
    if (success) {
        message = LockpickTetris.getText('lockPicked');
    } else if (reason === 'timeUp') {
        message = LockpickTetris.getText('timeUp');
    } else {
        message = LockpickTetris.getText('lockJammed');
    }

    // Show result message
    const resultSprite = new Sprite();
    resultSprite.bitmap = new Bitmap(400, 100);
    resultSprite.bitmap.fontSize = 48;
    resultSprite.bitmap.textColor = success ? '#00FF00' : '#FFFFFF';
    resultSprite.bitmap.drawText(message, 0, 0, 400, 50, 'center');
    resultSprite.bitmap.fontSize = 20;
    resultSprite.x = (Graphics.width - 400) / 2;
    resultSprite.y = (Graphics.height - 100) / 2;
    this.addChild(resultSprite);
    
    // Set the appropriate switches
    if (success && LockpickTetris.successSwitch > 0) {
        $gameSwitches.setValue(LockpickTetris.successSwitch, true);
    } else if (!success && LockpickTetris.failureSwitch > 0) {
        $gameSwitches.setValue(LockpickTetris.failureSwitch, true);
    }
    
    // Set the appropriate self switches
    if (LockpickTetris.currentEventId > 0) {
        const key = [LockpickTetris.currentMapId, LockpickTetris.currentEventId, 'A'];
        const selfSwitchToActivate = success ? LockpickTetris.successSelfSwitch : LockpickTetris.failureSelfSwitch;
        
        if (selfSwitchToActivate && ['A', 'B', 'C', 'D'].includes(selfSwitchToActivate)) {
            key[2] = selfSwitchToActivate;
            $gameSelfSwitches.setValue(key, true);
            console.log("Activated self switch " + selfSwitchToActivate + " for event " + LockpickTetris.currentEventId);
        }
    }
    
    // Wait for key press to exit
    this._waitForExit = true;
};

// Override for waiting for input to exit
const _Scene_LockpickTetris_update = Scene_LockpickTetris.prototype.update;
Scene_LockpickTetris.prototype.update = function() {
    _Scene_LockpickTetris_update.call(this);
    
    if (this._waitForExit && (Input.isTriggered('ok') || Input.isTriggered('cancel'))) {
        this.popScene();
    }
};

// Pop scene method
Scene_LockpickTetris.prototype.popScene = function() {
    SceneManager.pop();
};

//=============================================================================
// End of Plugin
//=============================================================================
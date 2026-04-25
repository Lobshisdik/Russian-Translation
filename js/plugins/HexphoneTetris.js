//=============================================================================
// HexphoneTetris.js
//=============================================================================

/*:
 * @target MZ
 * @plugindesc [v1.0.0] Tetris game for Hexphone System with LCD screen style
 * @author Omni-Lex
 * @help HexphoneTetris.js
 *
 * This plugin adds a Tetris minigame to the Hexphone system.
 * The game features an LCD screen style display with classic Tetris gameplay.
 *
 * Installation:
 * 1. Place this plugin in your js/plugins folder
 * 2. Activate it in Plugin Manager
 * 3. Load HexphoneSystem before this plugin
 *
 * Gameplay:
 * - Arrow Keys / WASD: Move piece left/right
 * - Down / S: Drop piece faster
 * - Z / A: Rotate piece counter-clockwise
 * - X / B: Rotate piece clockwise
 * - Space: Hard drop
 *
 */

(() => {
    'use strict';

    const GRID_WIDTH = 10;
    const GRID_HEIGHT = 20;
    const BLOCK_SIZE = 8;
    const DISPLAY_WIDTH = GRID_WIDTH * BLOCK_SIZE;
    const DISPLAY_HEIGHT = GRID_HEIGHT * BLOCK_SIZE;

    // Tetromino shapes (7 piece types)
    const TETROMINOES = {
        I: { blocks: [[0, 1, 2, 3]], color: 0 },
        O: { blocks: [[0, 1, 4, 5]], color: 3 },
        T: { blocks: [[1, 3, 4, 5], [1, 2, 4, 5], [1, 2, 3, 5], [1, 2, 4, 6]], color: 2 },
        S: { blocks: [[1, 2, 4, 5], [0, 4, 5, 9]], color: 4 },
        Z: { blocks: [[0, 1, 5, 6], [1, 4, 5, 8]], color: 4 },
        J: { blocks: [[0, 4, 5, 6], [1, 2, 4, 8], [0, 1, 2, 6], [0, 4, 8, 9]], color: 1 },
        L: { blocks: [[2, 4, 5, 6], [0, 4, 8, 9], [0, 1, 2, 4], [1, 5, 8, 9]], color: 5 }
    };

    class HexphoneTetrisGame {
        constructor() {
            this.grid = [];
            this.currentPiece = null;
            this.nextPiece = null;
            this.score = 0;
            this.lines = 0;
            this.level = 1;
            this.gameOver = false;
            this.paused = false;
            this.dropTimer = 0;
            this.dropSpeed = 60; // frames per drop
            this.initializeGrid();
            this.spawnNewPiece();
        }

        initializeGrid() {
            this.grid = [];
            for (let y = 0; y < GRID_HEIGHT; y++) {
                const row = [];
                for (let x = 0; x < GRID_WIDTH; x++) {
                    row.push(0);
                }
                this.grid.push(row);
            }
        }

        spawnNewPiece() {
            if (this.nextPiece) {
                this.currentPiece = this.nextPiece;
            } else {
                const types = Object.keys(TETROMINOES);
                const type = types[Math.floor(Math.random() * types.length)];
                this.currentPiece = this.createPiece(type);
            }

            const types = Object.keys(TETROMINOES);
            const type = types[Math.floor(Math.random() * types.length)];
            this.nextPiece = this.createPiece(type);

            if (!this.canPlacePiece(this.currentPiece.x, this.currentPiece.y, this.currentPiece.rotation)) {
                this.gameOver = true;
            }
        }

        createPiece(type) {
            const tetromino = TETROMINOES[type];
            return {
                type: type,
                x: 3,
                y: 0,
                rotation: 0,
                blocks: tetromino.blocks,
                color: tetromino.color
            };
        }

        getBlockCoordinates(piece) {
            const coordinates = [];
            const blocks = piece.blocks[piece.rotation % piece.blocks.length];
            blocks.forEach(blockIndex => {
                const bx = blockIndex % 4;
                const by = Math.floor(blockIndex / 4);
                coordinates.push([piece.x + bx, piece.y + by]);
            });
            return coordinates;
        }

        canPlacePiece(x, y, rotation) {
            const testPiece = { ...this.currentPiece, x: x, y: y, rotation: rotation };
            const coords = this.getBlockCoordinates(testPiece);
            return coords.every(([bx, by]) => {
                return bx >= 0 && bx < GRID_WIDTH && by < GRID_HEIGHT && (by < 0 || this.grid[by][bx] === 0);
            });
        }

        moveLeft() {
            if (this.canPlacePiece(this.currentPiece.x - 1, this.currentPiece.y, this.currentPiece.rotation)) {
                this.currentPiece.x--;
            }
        }

        moveRight() {
            if (this.canPlacePiece(this.currentPiece.x + 1, this.currentPiece.y, this.currentPiece.rotation)) {
                this.currentPiece.x++;
            }
        }

        moveDown() {
            if (this.canPlacePiece(this.currentPiece.x, this.currentPiece.y + 1, this.currentPiece.rotation)) {
                this.currentPiece.y++;
                return true;
            } else {
                this.lockPiece();
                return false;
            }
        }

        rotate(clockwise = true) {
            const newRotation = clockwise ? (this.currentPiece.rotation + 1) % 4 : (this.currentPiece.rotation + 3) % 4;
            if (this.canPlacePiece(this.currentPiece.x, this.currentPiece.y, newRotation)) {
                this.currentPiece.rotation = newRotation;
            }
        }

        hardDrop() {
            while (this.moveDown()) {}
        }

        lockPiece() {
            const coords = this.getBlockCoordinates(this.currentPiece);
            coords.forEach(([x, y]) => {
                if (y >= 0 && y < GRID_HEIGHT && x >= 0 && x < GRID_WIDTH) {
                    this.grid[y][x] = this.currentPiece.color;
                }
            });
            this.clearLines();
            this.spawnNewPiece();
        }

        clearLines() {
            let linesCleared = 0;
            for (let y = GRID_HEIGHT - 1; y >= 0; y--) {
                if (this.grid[y].every(cell => cell !== 0)) {
                    this.grid.splice(y, 1);
                    this.grid.unshift(new Array(GRID_WIDTH).fill(0));
                    linesCleared++;
                    y++;
                }
            }

            if (linesCleared > 0) {
                this.lines += linesCleared;
                const points = [0, 100, 300, 500, 800];
                this.score += points[Math.min(linesCleared, 4)] * this.level;
                this.level = Math.floor(this.lines / 10) + 1;
                this.dropSpeed = Math.max(10, 60 - this.level * 3);
            }
        }

        update() {
            if (this.gameOver || this.paused) return;

            this.dropTimer++;
            if (this.dropTimer >= this.dropSpeed) {
                this.dropTimer = 0;
                this.moveDown();
            }
        }

        draw(bitmap) {
            // Clear display
            bitmap.fillRect(0, 0, DISPLAY_WIDTH, DISPLAY_HEIGHT, '#000000');

            // Draw grid background
            bitmap.fillRect(0, 0, DISPLAY_WIDTH, DISPLAY_HEIGHT, '#111111');

            // Draw grid lines
            for (let x = 0; x <= GRID_WIDTH; x++) {
                bitmap.fillRect(x * BLOCK_SIZE, 0, 1, DISPLAY_HEIGHT, '#333333');
            }
            for (let y = 0; y <= GRID_HEIGHT; y++) {
                bitmap.fillRect(0, y * BLOCK_SIZE, DISPLAY_WIDTH, 1, '#333333');
            }

            // Draw placed blocks
            const colors = ['#000000', '#FF0000', '#00FF00', '#FFFF00', '#00FFFF', '#FF00FF', '#0000FF'];
            for (let y = 0; y < GRID_HEIGHT; y++) {
                for (let x = 0; x < GRID_WIDTH; x++) {
                    if (this.grid[y][x] !== 0) {
                        const color = colors[this.grid[y][x]];
                        bitmap.fillRect(x * BLOCK_SIZE + 1, y * BLOCK_SIZE + 1, BLOCK_SIZE - 2, BLOCK_SIZE - 2, color);
                    }
                }
            }

            // Draw current piece
            if (this.currentPiece && !this.gameOver) {
                const color = colors[this.currentPiece.color];
                const coords = this.getBlockCoordinates(this.currentPiece);
                coords.forEach(([x, y]) => {
                    if (y >= 0) {
                        bitmap.fillRect(x * BLOCK_SIZE + 1, y * BLOCK_SIZE + 1, BLOCK_SIZE - 2, BLOCK_SIZE - 2, color);
                    }
                });
            }

            // Draw game over message
            if (this.gameOver) {
                bitmap.fontSize = 20;
                bitmap.textColor = '#FF0000';
                bitmap.drawText('GAME OVER', 0, DISPLAY_HEIGHT / 2 - 10, DISPLAY_WIDTH, 20, 'center');
            }
        }
    }

    // Global game instance
    let hexphoneTetrisGame = null;
    let tetrisRegistered = false;

    // Register the game with Hexphone system
    if (typeof window !== 'undefined' && !window.HexphoneTetrisGame) {
        window.HexphoneTetrisGame = HexphoneTetrisGame;
    }

    // Setup hooks for Scene_AnokiPhone when it becomes available
    function setupTetrisHooks() {
        if (typeof Scene_AnokiPhone === 'undefined') {
            // Scene_AnokiPhone not available yet, retry in next frame
            console.log('HexphoneTetris: Scene_AnokiPhone not defined, retrying...');
            setTimeout(setupTetrisHooks, 100);
            return;
        }

        console.log('HexphoneTetris: Scene_AnokiPhone found, setting up hooks...');

        // Register Tetris immediately when hooks are set up
        if (!tetrisRegistered) {
            if (typeof window !== 'undefined' && typeof window.registerHexphoneGame === 'function') {
                console.log('HexphoneTetris: Registering Tetris game with Hexphone...');
                window.registerHexphoneGame('Tetris', {
                    name: 'Tetris',
                    commonEventId: 0, // No common event, uses inline rendering
                    handler: null
                });
                tetrisRegistered = true;
                console.log('HexphoneTetris: Tetris registered successfully');
            } else {
                console.log('HexphoneTetris: registerHexphoneGame function not available, will retry later');
                // Try again after a brief delay
                setTimeout(function() {
                    if (!tetrisRegistered && typeof window !== 'undefined' && typeof window.registerHexphoneGame === 'function') {
                        console.log('HexphoneTetris: Registering Tetris on delayed call...');
                        window.registerHexphoneGame('Tetris', {
                            name: 'Tetris',
                            commonEventId: 0,
                            handler: null
                        });
                        tetrisRegistered = true;
                    }
                }, 500);
            }
        } else {
            console.log('HexphoneTetris: Tetris already registered');
        }

        // Create game instance
        const _Scene_AnokiPhone_createGamePlay = Scene_AnokiPhone.prototype.createGamePlay;
        Scene_AnokiPhone.prototype.createGamePlay = function(gameName) {
            if (gameName === 'Tetris') {
                hexphoneTetrisGame = new HexphoneTetrisGame();
                this._hexphoneTetrisGame = hexphoneTetrisGame;
                return;
            }
            if (_Scene_AnokiPhone_createGamePlay) {
                _Scene_AnokiPhone_createGamePlay.call(this, gameName);
            }
        };

        // Update game
        const _Scene_AnokiPhone_updatePhoneScreen = Scene_AnokiPhone.prototype.updatePhoneScreen;
        Scene_AnokiPhone.prototype.updatePhoneScreen = function() {
            if (this._hexphoneTetrisGame) {
                this._hexphoneTetrisGame.update();
            }
            if (_Scene_AnokiPhone_updatePhoneScreen) {
                _Scene_AnokiPhone_updatePhoneScreen.call(this);
            }
        };

        // Handle input for Tetris
        const _Scene_AnokiPhone_handleInput = Scene_AnokiPhone.prototype.handleInput;
        Scene_AnokiPhone.prototype.handleInput = function() {
            if (this._hexphoneTetrisGame && this._screenMode === 'game') {
                const game = this._hexphoneTetrisGame;

                if (Input.isPressed('left') || Input.isPressed('a')) {
                    game.moveLeft();
                }
                if (Input.isPressed('right') || Input.isPressed('d')) {
                    game.moveRight();
                }
                if (Input.isPressed('down') || Input.isPressed('s')) {
                    game.moveDown();
                }
                if (Input.isTriggered('z') || Input.isTriggered('a')) {
                    game.rotate(false);
                }
                if (Input.isTriggered('x') || Input.isTriggered('b')) {
                    game.rotate(true);
                }
                if (Input.isTriggered('space')) {
                    game.hardDrop();
                }
                if (Input.isTriggered('escape') || Input.isTriggered('end')) {
                    this._screenMode = 'games';
                    this._hexphoneTetrisGame = null;
                }
            }
            if (_Scene_AnokiPhone_handleInput) {
                _Scene_AnokiPhone_handleInput.call(this);
            }
        };

        // Draw Tetris game
        const _Scene_AnokiPhone_drawGameScreen = Scene_AnokiPhone.prototype.drawGameScreen;
        Scene_AnokiPhone.prototype.drawGameScreen = function(bitmap) {
            if (this._hexphoneTetrisGame) {
                // Draw Tetris game
                this._hexphoneTetrisGame.draw(bitmap);

                // Draw score, lines, level info
                const infoY = DISPLAY_HEIGHT + 10;
                bitmap.fontSize = 10;
                bitmap.textColor = '#CCCCCC';
                bitmap.drawText('Score: ' + this._hexphoneTetrisGame.score, 5, infoY, 120, 20);
                bitmap.drawText('Lines: ' + this._hexphoneTetrisGame.lines, 130, infoY, 120, 20);
                bitmap.drawText('Level: ' + this._hexphoneTetrisGame.level, 5, infoY + 15, 120, 20);
            } else if (_Scene_AnokiPhone_drawGameScreen) {
                _Scene_AnokiPhone_drawGameScreen.call(this, bitmap);
            }
        };
    }

    // Also hook into Game_System initialization to ensure registration
    if (typeof Game_System !== 'undefined') {
        const _Game_System_initialize = Game_System.prototype.initialize;
        Game_System.prototype.initialize = function() {
            console.log('HexphoneTetris: Game_System initializing...');
            _Game_System_initialize.call(this);
            // Register Tetris when Game_System initializes
            if (typeof window !== 'undefined' && typeof window.registerHexphoneGame === 'function' && !tetrisRegistered) {
                console.log('HexphoneTetris: Registering Tetris in Game_System.initialize...');
                window.registerHexphoneGame('Tetris', {
                    name: 'Tetris',
                    commonEventId: 0,
                    handler: null
                });
                tetrisRegistered = true;
                console.log('HexphoneTetris: Tetris registered via Game_System');
            }
        };
    }

    // Setup hooks when the plugin loads
    setupTetrisHooks();

})();

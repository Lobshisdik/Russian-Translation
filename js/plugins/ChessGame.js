//=============================================================================
// ChessGame.js
//=============================================================================

/*:
 * @target MZ
 * @plugindesc Chess Game v1.0.0
 * @author Omni-Lex
 * @version 1.0.0
 * @description A chess game where the enemy can make illegal moves in chaos mode
 * 
 * @param gameMode
 * @text Default Game Mode
 * @desc Choose the default mode when using the menu or basic plugin command
 * @type select
 * @option Normal
 * @value normal
 * @option Chaos
 * @value chaos
 * @default chaos
 * 
 * @command startNormalChess
 * @text Start Normal Chess
 * @desc Start a chess game with normal rules (AI follows chess rules)
 * 
 * @command startChaosChess
 * @text Start Chaos Chess  
 * @desc Start a chess game with chaos rules (AI can cheat and break rules)
 * 
 * @command startChess
 * @text Start Chess (Default Mode)
 * @desc Start a chess game using the default mode set in plugin parameters
 * 
 * @help ChessGame.js
 * 
 * This plugin adds a chess game with two modes:
 * 
 * NORMAL MODE:
 * - Both player and AI follow standard chess rules
 * - AI has ~1200 Elo strength with tactical awareness
 * - Traditional chess experience
 * 
 * CHAOS MODE:
 * - Player must follow chess rules, but AI can cheat!
 * - AI can steal your pieces, transform pieces, spawn emojis, etc.
 * - Player builds a "Cheat Meter" by capturing pieces
 * - When full, press SHIFT to activate cheat mode (3 illegal moves)
 * - Hilarious and unpredictable gameplay!
 * 
 * Plugin Commands:
 * - Start Normal Chess: Opens chess in normal mode
 * - Start Chaos Chess: Opens chess in chaos mode  
 * - Start Chess (Default): Uses the mode set in plugin parameters
 * 
 * Controls:
 * - Arrow Keys/Mouse: Navigate board
 * - Enter/Click: Select piece or make move
 * - SHIFT: Activate cheat mode when meter is full (Chaos mode only)
 * - Escape: Exit game
 * 
 * Menu Access:
 * The game is automatically added to the main menu as "Chess Game"
 */

(() => {
    'use strict';
    
    const parameters = PluginManager.parameters('ChessGame');
    const gameMode = parameters['gameMode'] || 'chaos';
    
    // Chess piece definitions
    const PIECES = {
        EMPTY: 0,
        W_PAWN: 1, W_ROOK: 2, W_KNIGHT: 3, W_BISHOP: 4, W_QUEEN: 5, W_KING: 6,
        B_PAWN: 7, B_ROOK: 8, B_KNIGHT: 9, B_BISHOP: 10, B_QUEEN: 11, B_KING: 12,
        EMOJI: 13 // Special chaos piece
    };
    
    const PIECE_SYMBOLS = {
        [PIECES.EMPTY]: '·',
        [PIECES.W_PAWN]: '♙', [PIECES.W_ROOK]: '♖', [PIECES.W_KNIGHT]: '♘',
        [PIECES.W_BISHOP]: '♗', [PIECES.W_QUEEN]: '♕', [PIECES.W_KING]: '♔',
        [PIECES.B_PAWN]: '♟', [PIECES.B_ROOK]: '♜', [PIECES.B_KNIGHT]: '♞',
        [PIECES.B_BISHOP]: '♝', [PIECES.B_QUEEN]: '♛', [PIECES.B_KING]: '♚',
        [PIECES.EMOJI]: '👑' // Default emoji
    };
    
    const CHAOS_EMOJIS = ['👑', '🦄', '🐉', '⭐', '💎', '🔥', '⚡', '🌟', '💫', '🎭'];
    
    class ChessGame {
        constructor() {
            this.board = this.initializeBoard();
            this.currentPlayer = 'white';
            this.selectedSquare = null;
            // Check for temporary mode override first, then plugin parameter
            this.gameMode = window.tempChessMode || gameMode;
            this.moveLog = [];
            this.emojiPieces = new Map(); // Store emoji symbols for emoji pieces
            this.gameEnded = false;
            this.cheatMeter = 0; // Cheat meter value (0-100)
            this.maxCheatMeter = 100;
            this.cheatMode = false; // Whether player is currently cheating
            this.cheatMoves = 0; // Remaining cheat moves
        }
        
        initializeBoard() {
            return [
                [PIECES.B_ROOK, PIECES.B_KNIGHT, PIECES.B_BISHOP, PIECES.B_QUEEN, PIECES.B_KING, PIECES.B_BISHOP, PIECES.B_KNIGHT, PIECES.B_ROOK],
                [PIECES.B_PAWN, PIECES.B_PAWN, PIECES.B_PAWN, PIECES.B_PAWN, PIECES.B_PAWN, PIECES.B_PAWN, PIECES.B_PAWN, PIECES.B_PAWN],
                [PIECES.EMPTY, PIECES.EMPTY, PIECES.EMPTY, PIECES.EMPTY, PIECES.EMPTY, PIECES.EMPTY, PIECES.EMPTY, PIECES.EMPTY],
                [PIECES.EMPTY, PIECES.EMPTY, PIECES.EMPTY, PIECES.EMPTY, PIECES.EMPTY, PIECES.EMPTY, PIECES.EMPTY, PIECES.EMPTY],
                [PIECES.EMPTY, PIECES.EMPTY, PIECES.EMPTY, PIECES.EMPTY, PIECES.EMPTY, PIECES.EMPTY, PIECES.EMPTY, PIECES.EMPTY],
                [PIECES.EMPTY, PIECES.EMPTY, PIECES.EMPTY, PIECES.EMPTY, PIECES.EMPTY, PIECES.EMPTY, PIECES.EMPTY, PIECES.EMPTY],
                [PIECES.W_PAWN, PIECES.W_PAWN, PIECES.W_PAWN, PIECES.W_PAWN, PIECES.W_PAWN, PIECES.W_PAWN, PIECES.W_PAWN, PIECES.W_PAWN],
                [PIECES.W_ROOK, PIECES.W_KNIGHT, PIECES.W_BISHOP, PIECES.W_QUEEN, PIECES.W_KING, PIECES.W_BISHOP, PIECES.W_KNIGHT, PIECES.W_ROOK]
            ];
        }
        
        isWhitePiece(piece) {
            return piece >= PIECES.W_PAWN && piece <= PIECES.W_KING;
        }
        
        isBlackPiece(piece) {
            return piece >= PIECES.B_PAWN && piece <= PIECES.B_KING;
        }
        
        isValidSquare(row, col) {
            return row >= 0 && row < 8 && col >= 0 && col < 8;
        }
        
        getPieceSymbol(piece, row, col) {
            if (piece === PIECES.EMOJI) {
                return this.emojiPieces.get(`${row}-${col}`) || '👑';
            }
            return PIECE_SYMBOLS[piece];
        }
        
        isLegalMove(fromRow, fromCol, toRow, toCol) {
            if (!this.isValidSquare(toRow, toCol)) return false;
            
            const piece = this.board[fromRow][fromCol];
            const targetPiece = this.board[toRow][toCol];
            
            // Can't capture own pieces (in normal mode)
            if (this.currentPlayer === 'white') {
                if (this.isWhitePiece(targetPiece)) return false;
                if (!this.isWhitePiece(piece) && piece !== PIECES.EMPTY) return false;
            } else {
                if (this.isBlackPiece(targetPiece)) return false;
                if (!this.isBlackPiece(piece) && piece !== PIECES.EMPTY) return false;
            }
            
            const rowDiff = toRow - fromRow;
            const colDiff = toCol - fromCol;
            const absRowDiff = Math.abs(rowDiff);
            const absColDiff = Math.abs(colDiff);
            
            switch (piece) {
                case PIECES.W_PAWN:
                    if (colDiff === 0 && targetPiece === PIECES.EMPTY) {
                        return (rowDiff === -1) || (fromRow === 6 && rowDiff === -2);
                    } else if (absColDiff === 1 && rowDiff === -1) {
                        return targetPiece !== PIECES.EMPTY;
                    }
                    return false;
                    
                case PIECES.B_PAWN:
                    if (colDiff === 0 && targetPiece === PIECES.EMPTY) {
                        return (rowDiff === 1) || (fromRow === 1 && rowDiff === 2);
                    } else if (absColDiff === 1 && rowDiff === 1) {
                        return targetPiece !== PIECES.EMPTY;
                    }
                    return false;
                    
                case PIECES.W_ROOK:
                case PIECES.B_ROOK:
                    if (rowDiff === 0 || colDiff === 0) {
                        return this.isPathClear(fromRow, fromCol, toRow, toCol);
                    }
                    return false;
                    
                case PIECES.W_KNIGHT:
                case PIECES.B_KNIGHT:
                    return (absRowDiff === 2 && absColDiff === 1) || (absRowDiff === 1 && absColDiff === 2);
                    
                case PIECES.W_BISHOP:
                case PIECES.B_BISHOP:
                    if (absRowDiff === absColDiff) {
                        return this.isPathClear(fromRow, fromCol, toRow, toCol);
                    }
                    return false;
                    
                case PIECES.W_QUEEN:
                case PIECES.B_QUEEN:
                    if (rowDiff === 0 || colDiff === 0 || absRowDiff === absColDiff) {
                        return this.isPathClear(fromRow, fromCol, toRow, toCol);
                    }
                    return false;
                    
                case PIECES.W_KING:
                case PIECES.B_KING:
                case PIECES.EMOJI: // Emoji pieces move like kings
                    return absRowDiff <= 1 && absColDiff <= 1;
            }
            
            return false;
        }
        
        isPathClear(fromRow, fromCol, toRow, toCol) {
            const rowStep = toRow > fromRow ? 1 : toRow < fromRow ? -1 : 0;
            const colStep = toCol > fromCol ? 1 : toCol < fromCol ? -1 : 0;
            
            let currentRow = fromRow + rowStep;
            let currentCol = fromCol + colStep;
            
            while (currentRow !== toRow || currentCol !== toCol) {
                if (this.board[currentRow][currentCol] !== PIECES.EMPTY) {
                    return false;
                }
                currentRow += rowStep;
                currentCol += colStep;
            }
            
            return true;
        }
        
        makeMove(fromRow, fromCol, toRow, toCol) {
            const piece = this.board[fromRow][fromCol];
            const capturedPiece = this.board[toRow][toCol];
            
            // Increase cheat meter when player captures in chaos mode
            if (this.gameMode === 'chaos' && this.currentPlayer === 'white' && capturedPiece !== PIECES.EMPTY) {
                const captureValue = this.getPieceValue ? this.getPieceValue(capturedPiece) : this.getBasicPieceValue(capturedPiece);
                const cheatGain = Math.ceil(captureValue / 50); // Pawn=2, Knight/Bishop=6-7, Rook=10, Queen=18
                this.cheatMeter = Math.min(this.maxCheatMeter, this.cheatMeter + cheatGain);
                this.addToLog(`Cheat Meter +${cheatGain}! (${this.cheatMeter}/${this.maxCheatMeter})`);
            }
            
            this.board[toRow][toCol] = piece;
            this.board[fromRow][fromCol] = PIECES.EMPTY;
            
            // Handle emoji piece movement
            if (piece === PIECES.EMOJI) {
                const emojiSymbol = this.emojiPieces.get(`${fromRow}-${fromCol}`);
                this.emojiPieces.delete(`${fromRow}-${fromCol}`);
                if (emojiSymbol) {
                    this.emojiPieces.set(`${toRow}-${toCol}`, emojiSymbol);
                }
            }
            
            return capturedPiece;
        }
        
        getBasicPieceValue(piece) {
            const values = {
                [PIECES.W_PAWN]: 100, [PIECES.B_PAWN]: 100,
                [PIECES.W_KNIGHT]: 320, [PIECES.B_KNIGHT]: 320,
                [PIECES.W_BISHOP]: 330, [PIECES.B_BISHOP]: 330,
                [PIECES.W_ROOK]: 500, [PIECES.B_ROOK]: 500,
                [PIECES.W_QUEEN]: 900, [PIECES.B_QUEEN]: 900,
                [PIECES.W_KING]: 2000, [PIECES.B_KING]: 2000,
                [PIECES.EMOJI]: 200
            };
            return values[piece] || 0;
        }
        
        canActivateCheatMode() {
            return this.gameMode === 'chaos' && this.cheatMeter >= this.maxCheatMeter && !this.cheatMode;
        }
        
        activateCheatMode() {
            if (this.canActivateCheatMode()) {
                this.cheatMode = true;
                this.cheatMoves = 3; // Allow 3 illegal moves
                this.cheatMeter = 0; // Reset meter
                this.addToLog("🔥 CHEAT MODE ACTIVATED! You can make 3 illegal moves! 🔥");
                return true;
            }
            return false;
        }
        
        isPlayerCheating() {
            return this.cheatMode && this.cheatMoves > 0;
        }
        
        useCheatMove() {
            if (this.isPlayerCheating()) {
                this.cheatMoves--;
                if (this.cheatMoves === 0) {
                    this.cheatMode = false;
                    this.addToLog("Cheat mode exhausted. Back to legal moves only!");
                }
                return true;
            }
            return false;
        }
        
        isLegalOrCheatMove(fromRow, fromCol, toRow, toCol) {
            // Always allow legal moves
            if (this.isLegalMove(fromRow, fromCol, toRow, toCol)) {
                return { legal: true, cheat: false };
            }
            
            // In chaos mode, check if player can cheat
            if (this.gameMode === 'chaos' && this.currentPlayer === 'white' && this.isPlayerCheating()) {
                // Allow various illegal moves
                const piece = this.board[fromRow][fromCol];
                const targetPiece = this.board[toRow][toCol];
                
                // Must be a white piece (no moving empty squares or enemy pieces)
                if (!this.isWhitePiece(piece)) return { legal: false, cheat: false };
                
                // Can't move to same square
                if (fromRow === toRow && fromCol === toCol) return { legal: false, cheat: false };
                
                // Must be valid square
                if (!this.isValidSquare(toRow, toCol)) return { legal: false, cheat: false };
                
                return { legal: false, cheat: true };
            }
            
            return { legal: false, cheat: false };
        }
        
        makeAIMove() {
            if (this.gameMode === 'normal') {
                this.makeNormalAIMove();
            } else {
                this.makeChaosAIMove();
            }
        }
        
        makeNormalAIMove() {
            const validMoves = this.getAllValidMoves('black');
            if (validMoves.length === 0) {
                this.addToLog("Black has no valid moves! White wins!");
                this.gameEnded = true;
                return;
            }
            
            // Evaluate and score all moves
            const scoredMoves = validMoves.map(move => ({
                ...move,
                score: this.evaluateMove(move.fromRow, move.fromCol, move.toRow, move.toCol)
            }));
            
            // Sort by score (highest first)
            scoredMoves.sort((a, b) => b.score - a.score);
            
            // Pick from top moves with some randomness
            const topMoves = scoredMoves.filter(move => 
                move.score >= scoredMoves[0].score - 50
            );
            
            const bestMove = topMoves[Math.floor(Math.random() * topMoves.length)];
            const piece = this.board[bestMove.fromRow][bestMove.fromCol];
            const capturedPiece = this.makeMove(bestMove.fromRow, bestMove.fromCol, bestMove.toRow, bestMove.toCol);
            
            const moveNotation = this.getMoveNotation(piece, bestMove.fromRow, bestMove.fromCol, bestMove.toRow, bestMove.toCol, capturedPiece);
            this.addToLog(`Black plays: ${moveNotation}`);
        }
        
        evaluateMove(fromRow, fromCol, toRow, toCol) {
            let score = 0;
            
            const piece = this.board[fromRow][fromCol];
            const capturedPiece = this.board[toRow][toCol];
            
            // Material evaluation
            if (capturedPiece !== PIECES.EMPTY) {
                score += this.getPieceValue(capturedPiece) * 100; // Prioritize captures
            }
            
            // Piece development (move towards center)
            score += this.getCenterControlScore(toRow, toCol, piece);
            
            // King safety
            if (piece === PIECES.B_KING) {
                score += this.getKingSafetyScore(toRow, toCol);
            }
            
            // Avoid hanging pieces
            score -= this.getHangingPenalty(piece, toRow, toCol) * 50;
            
            // Basic tactics
            score += this.getTacticalBonus(fromRow, fromCol, toRow, toCol);
            
            // Positional bonuses
            score += this.getPositionalScore(piece, fromRow, fromCol, toRow, toCol);
            
            return score;
        }
        
        getPieceValue(piece) {
            const values = {
                [PIECES.W_PAWN]: 100, [PIECES.B_PAWN]: 100,
                [PIECES.W_KNIGHT]: 320, [PIECES.B_KNIGHT]: 320,
                [PIECES.W_BISHOP]: 330, [PIECES.B_BISHOP]: 330,
                [PIECES.W_ROOK]: 500, [PIECES.B_ROOK]: 500,
                [PIECES.W_QUEEN]: 900, [PIECES.B_QUEEN]: 900,
                [PIECES.W_KING]: 20000, [PIECES.B_KING]: 20000,
                [PIECES.EMOJI]: 200
            };
            return values[piece] || 0;
        }
        
        getCenterControlScore(row, col, piece) {
            // Reward controlling center squares
            const centerDistance = Math.max(Math.abs(3.5 - row), Math.abs(3.5 - col));
            let score = (3.5 - centerDistance) * 5;
            
            // Extra bonus for center squares
            if ((row === 3 || row === 4) && (col === 3 || col === 4)) {
                score += 15;
            }
            
            // Knights and bishops benefit more from center control
            if (piece === PIECES.B_KNIGHT || piece === PIECES.B_BISHOP) {
                score *= 1.5;
            }
            
            return score;
        }
        
        getKingSafetyScore(row, col) {
            let safety = 0;
            
            // Prefer corners and edges early game
            if (row === 0 || row === 7 || col === 0 || col === 7) {
                safety += 20;
            }
            
            // Avoid center in opening
            if ((row === 3 || row === 4) && (col === 3 || col === 4)) {
                safety -= 30;
            }
            
            return safety;
        }
        
        getHangingPenalty(piece, row, col) {
            // Check if piece would be hanging (attacked by opponent)
            const pieceValue = this.getPieceValue(piece);
            const attackers = this.getAttackers(row, col, 'white');
            const defenders = this.getAttackers(row, col, 'black');
            
            if (attackers.length > 0) {
                if (defenders.length === 0) {
                    return pieceValue; // Completely hanging
                } else if (attackers.length > defenders.length) {
                    return pieceValue * 0.5; // Likely to be lost in exchange
                }
            }
            
            return 0;
        }
        
        getAttackers(row, col, color) {
            const attackers = [];
            const isWhite = color === 'white';
            
            for (let r = 0; r < 8; r++) {
                for (let c = 0; c < 8; c++) {
                    const piece = this.board[r][c];
                    if ((isWhite && this.isWhitePiece(piece)) || 
                        (!isWhite && this.isBlackPiece(piece))) {
                        
                        const originalPlayer = this.currentPlayer;
                        this.currentPlayer = color;
                        if (this.isLegalMove(r, c, row, col)) {
                            attackers.push({row: r, col: c, piece});
                        }
                        this.currentPlayer = originalPlayer;
                    }
                }
            }
            
            return attackers;
        }
        
        getTacticalBonus(fromRow, fromCol, toRow, toCol) {
            let bonus = 0;
            
            const piece = this.board[fromRow][fromCol];
            
            // Fork detection (attacking multiple pieces)
            if (piece === PIECES.B_KNIGHT || piece === PIECES.B_BISHOP || 
                piece === PIECES.B_QUEEN || piece === PIECES.B_PAWN) {
                
                let targets = 0;
                for (let r = 0; r < 8; r++) {
                    for (let c = 0; c < 8; c++) {
                        if (this.isWhitePiece(this.board[r][c])) {
                            const originalPlayer = this.currentPlayer;
                            this.currentPlayer = 'black';
                            if (this.isLegalMove(toRow, toCol, r, c)) {
                                targets++;
                            }
                            this.currentPlayer = originalPlayer;
                        }
                    }
                }
                
                if (targets >= 2) {
                    bonus += 50 * targets; // Fork bonus
                }
            }
            
            // Pin detection (very basic)
            const capturedPiece = this.board[toRow][toCol];
            if (capturedPiece !== PIECES.EMPTY && 
                (piece === PIECES.B_BISHOP || piece === PIECES.B_ROOK || piece === PIECES.B_QUEEN)) {
                
                // Check if there's a more valuable piece behind the captured one
                const deltaRow = toRow - fromRow;
                const deltaCol = toCol - fromCol;
                const stepRow = deltaRow === 0 ? 0 : deltaRow / Math.abs(deltaRow);
                const stepCol = deltaCol === 0 ? 0 : deltaCol / Math.abs(deltaCol);
                
                let checkRow = toRow + stepRow;
                let checkCol = toCol + stepCol;
                
                if (this.isValidSquare(checkRow, checkCol)) {
                    const behindPiece = this.board[checkRow][checkCol];
                    if (this.isWhitePiece(behindPiece) && 
                        this.getPieceValue(behindPiece) > this.getPieceValue(capturedPiece)) {
                        bonus += 40; // Pin bonus
                    }
                }
            }
            
            return bonus;
        }
        
        getPositionalScore(piece, fromRow, fromCol, toRow, toCol) {
            let score = 0;
            
            // Pawn advancement
            if (piece === PIECES.B_PAWN) {
                score += (7 - toRow) * 5; // Reward advancing towards promotion
                
                // Passed pawn bonus
                let passed = true;
                for (let r = toRow; r < 7; r++) {
                    if (toCol > 0 && this.board[r][toCol - 1] === PIECES.W_PAWN) passed = false;
                    if (this.board[r][toCol] === PIECES.W_PAWN) passed = false;
                    if (toCol < 7 && this.board[r][toCol + 1] === PIECES.W_PAWN) passed = false;
                }
                if (passed && toRow < 5) {
                    score += 20;
                }
            }
            
            // Rook on open files
            if (piece === PIECES.B_ROOK) {
                let openFile = true;
                for (let r = 0; r < 8; r++) {
                    if (this.board[r][toCol] === PIECES.W_PAWN || this.board[r][toCol] === PIECES.B_PAWN) {
                        openFile = false;
                        break;
                    }
                }
                if (openFile) {
                    score += 25;
                }
            }
            
            // Knight outposts
            if (piece === PIECES.B_KNIGHT && toRow <= 4) {
                // Check if knight is IsProtected and can't be driven away by pawns
                let IsProtected = false;
                if (toRow < 7 && toCol > 0 && this.board[toRow + 1][toCol - 1] === PIECES.B_PAWN) IsProtected = true;
                if (toRow < 7 && toCol < 7 && this.board[toRow + 1][toCol + 1] === PIECES.B_PAWN) IsProtected = true;
                
                let canBeDriven = false;
                if (toCol > 0 && toRow < 6) {
                    for (let r = toRow + 1; r < 8; r++) {
                        if (this.board[r][toCol - 1] === PIECES.W_PAWN) canBeDriven = true;
                    }
                }
                if (toCol < 7 && toRow < 6) {
                    for (let r = toRow + 1; r < 8; r++) {
                        if (this.board[r][toCol + 1] === PIECES.W_PAWN) canBeDriven = true;
                    }
                }
                
                if (IsProtected && !canBeDriven) {
                    score += 30; // Knight outpost
                }
            }
            
            return score;
        }
        
        makeChaosAIMove() {
            const chaosActions = [
                () => this.chaosNormalMove(),
                () => this.chaosColorChange(),
                () => this.chaosMovePlayerPiece(),
                () => this.chaosTransformPiece(),
                () => this.chaosResurrectPiece(),
                () => this.chaosCreateEmoji(),
                () => this.chaosStealCheatMeter(), // New chaos action
                () => this.chaosMultiMove() // New chaos action
            ];
            
            const action = chaosActions[Math.floor(Math.random() * chaosActions.length)];
            action();
        }
        
        chaosNormalMove() {
            const validMoves = this.getAllValidMoves('black');
            if (validMoves.length > 0) {
                const randomMove = validMoves[Math.floor(Math.random() * validMoves.length)];
                const piece = this.board[randomMove.fromRow][randomMove.fromCol];
                const capturedPiece = this.makeMove(randomMove.fromRow, randomMove.fromCol, randomMove.toRow, randomMove.toCol);
                
                const moveNotation = this.getMoveNotation(piece, randomMove.fromRow, randomMove.fromCol, randomMove.toRow, randomMove.toCol, capturedPiece);
                this.addToLog(`Black plays normally: ${moveNotation}`);
            } else {
                this.chaosColorChange();
            }
        }
        
        chaosColorChange() {
            const whitePieces = [];
            for (let row = 0; row < 8; row++) {
                for (let col = 0; col < 8; col++) {
                    if (this.isWhitePiece(this.board[row][col])) {
                        whitePieces.push({row, col, piece: this.board[row][col]});
                    }
                }
            }
            
            if (whitePieces.length > 0) {
                const target = whitePieces[Math.floor(Math.random() * whitePieces.length)];
                const newPiece = target.piece + 6; // Convert white to black
                this.board[target.row][target.col] = newPiece;
                
                const messages = [
                    `"That's MINE now!" Black steals your ${PIECE_SYMBOLS[target.piece]} at ${String.fromCharCode(97 + target.col)}${8 - target.row}! 😈`,
                    `"Color correction!" Black corrupts your ${PIECE_SYMBOLS[target.piece]} to join the dark side! Mwahahaha! 🖤`,
                    `"Whoops, did I do that?" Black 'accidentally' converts your ${PIECE_SYMBOLS[target.piece]} to black! 😏`,
                    `"Rules are for losers!" Black brazenly steals your ${PIECE_SYMBOLS[target.piece]} with dark magic! ⚡`,
                    `"Thanks for the donation!" Black laughs as your ${PIECE_SYMBOLS[target.piece]} switches sides! 💸`
                ];
                this.addToLog(messages[Math.floor(Math.random() * messages.length)]);
            } else {
                this.chaosTransformPiece();
            }
        }
        
        chaosMovePlayerPiece() {
            const whitePieces = [];
            for (let row = 0; row < 8; row++) {
                for (let col = 0; col < 8; col++) {
                    if (this.isWhitePiece(this.board[row][col])) {
                        whitePieces.push({row, col, piece: this.board[row][col]});
                    }
                }
            }
            
            if (whitePieces.length > 0) {
                const piece = whitePieces[Math.floor(Math.random() * whitePieces.length)];
                const emptySquares = [];
                
                for (let row = 0; row < 8; row++) {
                    for (let col = 0; col < 8; col++) {
                        if (this.board[row][col] === PIECES.EMPTY) {
                            emptySquares.push({row, col});
                        }
                    }
                }
                
                if (emptySquares.length > 0) {
                    const target = emptySquares[Math.floor(Math.random() * emptySquares.length)];
                    this.board[target.row][target.col] = piece.piece;
                    this.board[piece.row][piece.col] = PIECES.EMPTY;
                    
                    const messages = [
                        `"I'll just move this for you!" Black rudely relocates your ${PIECE_SYMBOLS[piece.piece]} to ${String.fromCharCode(97 + target.col)}${8 - target.row}! 🤪`,
                        `"Oops, butterfingers!" Black 'helpfully' moves your ${PIECE_SYMBOLS[piece.piece]} to a terrible square! 🙃`,
                        `"Let me fix that strategy!" Black teleports your ${PIECE_SYMBOLS[piece.piece]} somewhere useless! 🎭`,
                        `"Trust me, this is better!" Black arrogantly repositions your ${PIECE_SYMBOLS[piece.piece]}! What a jerk! 😤`,
                        `"Playing both sides now!" Black cheekily moves your ${PIECE_SYMBOLS[piece.piece]} like it's his own! 🎪`
                    ];
                    this.addToLog(messages[Math.floor(Math.random() * messages.length)]);
                } else {
                    this.chaosTransformPiece();
                }
            } else {
                this.chaosResurrectPiece();
            }
        }
        
        chaosTransformPiece() {
            const allPieces = [];
            for (let row = 0; row < 8; row++) {
                for (let col = 0; col < 8; col++) {
                    if (this.board[row][col] !== PIECES.EMPTY) {
                        allPieces.push({row, col, piece: this.board[row][col]});
                    }
                }
            }
            
            if (allPieces.length > 0) {
                const target = allPieces[Math.floor(Math.random() * allPieces.length)];
                const blackPieces = [PIECES.B_PAWN, PIECES.B_ROOK, PIECES.B_KNIGHT, PIECES.B_BISHOP, PIECES.B_QUEEN];
                const newPiece = blackPieces[Math.floor(Math.random() * blackPieces.length)];
                const oldPiece = target.piece;
                this.board[target.row][target.col] = newPiece;
                
                const messages = [
                    `"Abracadabra!" Black transforms ${PIECE_SYMBOLS[oldPiece]} into ${PIECE_SYMBOLS[newPiece]}! "Magic is so convenient!" ✨`,
                    `"Upgrade time!" Black mockingly 'improves' ${PIECE_SYMBOLS[oldPiece]} to ${PIECE_SYMBOLS[newPiece]}! The audacity! 🔧`,
                    `"Shape-shifting is legal, right?" Black grins as ${PIECE_SYMBOLS[oldPiece]} becomes ${PIECE_SYMBOLS[newPiece]}! 🦎`,
                    `"I don't like that piece!" Black petulantly changes ${PIECE_SYMBOLS[oldPiece]} to ${PIECE_SYMBOLS[newPiece]}! 👑`,
                    `"Plot twist!" Black dramatically transforms ${PIECE_SYMBOLS[oldPiece]} into ${PIECE_SYMBOLS[newPiece]}! So theatrical! 🎬`
                ];
                this.addToLog(messages[Math.floor(Math.random() * messages.length)]);
            } else {
                this.chaosCreateEmoji();
            }
        }
        
        chaosResurrectPiece() {
            const emptySquares = [];
            for (let row = 0; row < 8; row++) {
                for (let col = 0; col < 8; col++) {
                    if (this.board[row][col] === PIECES.EMPTY) {
                        emptySquares.push({row, col});
                    }
                }
            }
            
            if (emptySquares.length > 0) {
                const target = emptySquares[Math.floor(Math.random() * emptySquares.length)];
                const blackPieces = [PIECES.B_PAWN, PIECES.B_ROOK, PIECES.B_KNIGHT, PIECES.B_BISHOP, PIECES.B_QUEEN];
                const newPiece = blackPieces[Math.floor(Math.random() * blackPieces.length)];
                this.board[target.row][target.col] = newPiece;
                
                const messages = [
                    `"Rise, my minion!" Black necromances a ${PIECE_SYMBOLS[newPiece]} at ${String.fromCharCode(97 + target.col)}${8 - target.row}! "Death is optional!" 💀`,
                    `"Surprise reinforcements!" Black smuggles in a ${PIECE_SYMBOLS[newPiece]}! "I ordered extra pieces!" 📦`,
                    `"Did I mention my army?" Black casually spawns a ${PIECE_SYMBOLS[newPiece]} from thin air! Cheater! 👻`,
                    `"Backup plan activated!" Black materializes a ${PIECE_SYMBOLS[newPiece]}! "Always have a Plan B!" 🎯`,
                    `"Free piece Friday!" Black grins as a ${PIECE_SYMBOLS[newPiece]} appears! "Buy one, get one free!" 🛒`
                ];
                this.addToLog(messages[Math.floor(Math.random() * messages.length)]);
            } else {
                this.chaosNormalMove();
            }
        }
        
        chaosCreateEmoji() {
            const emptySquares = [];
            for (let row = 0; row < 8; row++) {
                for (let col = 0; col < 8; col++) {
                    if (this.board[row][col] === PIECES.EMPTY) {
                        emptySquares.push({row, col});
                    }
                }
            }
            
            if (emptySquares.length > 0) {
                const target = emptySquares[Math.floor(Math.random() * emptySquares.length)];
                const emoji = CHAOS_EMOJIS[Math.floor(Math.random() * CHAOS_EMOJIS.length)];
                this.board[target.row][target.col] = PIECES.EMOJI;
                this.emojiPieces.set(`${target.row}-${target.col}`, emoji);
                
                const messages = [
                    `"Meet my friend!" Black summons ${emoji} at ${String.fromCharCode(97 + target.col)}${8 - target.row}! "He's house-trained!" 🏠`,
                    `"I collect these!" Black proudly places ${emoji} on the board! "Limited edition!" 🌟`,
                    `"Emotional support piece!" Black introduces ${emoji}! "For when regular pieces aren't enough!" 🤗`,
                    `"Why be boring?" Black spawns ${emoji} with a flourish! "Chess needs more personality!" 🎨`,
                    `"Secret weapon deployed!" Black unleashes ${emoji}! "You didn't see this coming!" 🕵️`
                ];
                this.addToLog(messages[Math.floor(Math.random() * messages.length)]);
            } else {
                this.chaosTransformPiece();
            }
        }
        
        chaosStealCheatMeter() {
            if (this.cheatMeter > 20) {
                const stolen = Math.min(30, this.cheatMeter);
                this.cheatMeter = Math.max(0, this.cheatMeter - stolen);
                
                const messages = [
                    `"Yoink! That's mine now!" Black drains ${stolen} cheat energy! "Finders keepers!" 😈`,
                    `"Energy vampire mode!" Black sucks away ${stolen} cheat points! "Delicious!" 🧛`,
                    `"Sharing is caring!" Black steals ${stolen} cheat meter! "Thanks for the donation!" 💸`,
                    `"Power drain engaged!" Black zaps ${stolen} energy! "I needed that more than you!" ⚡`,
                    `"Oops, did I do that?" Black 'accidentally' absorbs ${stolen} cheat points! So smug! 😏`
                ];
                this.addToLog(messages[Math.floor(Math.random() * messages.length)]);
            } else {
                this.chaosNormalMove();
            }
        }
        
        chaosMultiMove() {
            // Make 2-3 moves in one turn
            const moves = Math.floor(Math.random() * 2) + 2; // 2-3 moves
            
            const introMessages = [
                `"Time is a social construct!" Black takes ${moves} moves at once! ⚡`,
                `"Double-dipping!" Black greedily makes ${moves} moves! "My turn, my rules!" 🍰`,
                `"Speedrun mode!" Black blitzes ${moves} moves in a row! "Efficiency!" 🏃`,
                `"Combo attack!" Black chains ${moves} moves together! "Is this legal? Who cares!" 🔗`,
                `"Why wait?" Black impatiently makes ${moves} moves! "Patience is overrated!" ⏰`
            ];
            this.addToLog(introMessages[Math.floor(Math.random() * introMessages.length)]);
            
            for (let i = 0; i < moves; i++) {
                const validMoves = this.getAllValidMoves('black');
                if (validMoves.length > 0) {
                    const randomMove = validMoves[Math.floor(Math.random() * validMoves.length)];
                    const piece = this.board[randomMove.fromRow][randomMove.fromCol];
                    this.makeMove(randomMove.fromRow, randomMove.fromCol, randomMove.toRow, randomMove.toCol);
                    
                    const moveNotation = this.getMoveNotation(piece, randomMove.fromRow, randomMove.fromCol, randomMove.toRow, randomMove.toCol, PIECES.EMPTY);
                    this.addToLog(`  "${i + 1} of ${moves}!" ${moveNotation}`);
                } else {
                    break;
                }
            }
        }
        
        getAllValidMoves(player) {
            const moves = [];
            const isPlayerWhite = player === 'white';
            
            for (let row = 0; row < 8; row++) {
                for (let col = 0; col < 8; col++) {
                    const piece = this.board[row][col];
                    if ((isPlayerWhite && this.isWhitePiece(piece)) || 
                        (!isPlayerWhite && (this.isBlackPiece(piece) || piece === PIECES.EMOJI))) {
                        
                        for (let toRow = 0; toRow < 8; toRow++) {
                            for (let toCol = 0; toCol < 8; toCol++) {
                                const originalPlayer = this.currentPlayer;
                                this.currentPlayer = player;
                                if (this.isLegalMove(row, col, toRow, toCol)) {
                                    moves.push({fromRow: row, fromCol: col, toRow, toCol});
                                }
                                this.currentPlayer = originalPlayer;
                            }
                        }
                    }
                }
            }
            
            return moves;
        }
        
        getMoveNotation(piece, fromRow, fromCol, toRow, toCol, capturedPiece) {
            const fromSquare = String.fromCharCode(97 + fromCol) + (8 - fromRow);
            const toSquare = String.fromCharCode(97 + toCol) + (8 - toRow);
            const pieceSymbol = this.getPieceSymbol(piece, fromRow, fromCol);
            const capture = capturedPiece !== PIECES.EMPTY ? 'x' : '-';
            return `${pieceSymbol}${fromSquare}${capture}${toSquare}`;
        }
        
        addToLog(message) {
            this.moveLog.push(message);
            if (this.moveLog.length > 10) {
                this.moveLog.shift();
            }
        }
        
        checkGameEnd() {
            let whiteKings = 0;
            let blackKings = 0;
            let whitePieces = 0;
            let blackPieces = 0;
            
            for (let row = 0; row < 8; row++) {
                for (let col = 0; col < 8; col++) {
                    const piece = this.board[row][col];
                    if (piece === PIECES.W_KING) whiteKings++;
                    else if (piece === PIECES.B_KING) blackKings++;
                    else if (this.isWhitePiece(piece)) whitePieces++;
                    else if (this.isBlackPiece(piece) || piece === PIECES.EMOJI) blackPieces++;
                }
            }
            
            if (whiteKings === 0 && whitePieces === 0) {
                this.addToLog("All white pieces destroyed! Black wins!");
                this.gameEnded = true;
            } else if (blackKings === 0 && blackPieces === 0) {
                this.addToLog("All black pieces destroyed! White wins!");
                this.gameEnded = true;
            }
        }
    }
    
    class Window_CheatMeter extends Window_Base {
        initialize(rect) {
            super.initialize(rect);
            this.chess = null;
        }
        
        setChess(chess) {
            this.chess = chess;
            this.refresh();
        }
        
        refresh() {
            this.contents.clear();
            if (!this.chess || this.chess.gameMode !== 'chaos') return;
            
            // Title
            this.contents.fontSize = 18;
            this.contents.drawText('CHEAT METER', 0, 0, this.contents.width, 24, 'center');
            const fontSize = this.standardFontSize();
            this.contents.fontSize = fontSize;
            this.drawText(name, x, y, width, fontSize);            
            // Meter background
            const meterWidth = 200;
            const meterHeight = 20;
            const meterX = (this.contents.width - meterWidth) / 2;
            const meterY = 30;
            
            this.contents.fillRect(meterX, meterY, meterWidth, meterHeight, '#333333');
            
            // Meter fill
            const fillWidth = Math.floor((this.chess.cheatMeter / this.chess.maxCheatMeter) * meterWidth);
            const colors = ['#ff0000', '#ff4400', '#ff8800', '#ffcc00', '#ffff00']; // Red to yellow
            const colorIndex = Math.floor((this.chess.cheatMeter / this.chess.maxCheatMeter) * 4);
            const fillColor = colors[Math.min(colorIndex, 4)];
            
            if (fillWidth > 0) {
                this.contents.fillRect(meterX, meterY, fillWidth, meterHeight, fillColor);
            }
            
            // Meter border
            this.contents.strokeRect(meterX, meterY, meterWidth, meterHeight, '#ffffff');
            
            // Text
            const meterText = `${this.chess.cheatMeter}/${this.chess.maxCheatMeter}`;
            this.contents.drawText(meterText, 0, meterY + meterHeight + 5, this.contents.width, 24, 'center');
            
            // Status text
            if (this.chess.canActivateCheatMode()) {
                this.contents.textColor = '#ffff00';
                this.contents.drawText('Press SHIFT to activate!', 0, meterY + meterHeight + 25, this.contents.width, 24, 'center');
                this.contents.textColor = this.contents.normalColor();
            } else if (this.chess.isPlayerCheating()) {
                this.contents.textColor = '#ff4444';
                this.contents.drawText(`🔥 CHEAT MODE: ${this.chess.cheatMoves} moves left 🔥`, 0, meterY + meterHeight + 25, this.contents.width, 24, 'center');
                this.contents.textColor = this.contents.normalColor();
            } else {
                this.contents.drawText('Capture pieces to charge!', 0, meterY + meterHeight + 25, this.contents.width, 24, 'center');
            }
        }
    }
    
    // Scene for chess game
    class Scene_Chess extends Scene_MenuBase {
        create() {
            super.create();
            this.chess = new ChessGame();
            this.createChessBoard();
            this.createLogWindow();
            this.createModeWindow();
            this.createCheatMeterWindow();
        }
        
        terminate() {
            super.terminate();
            // Clean up temporary mode override
            if (window.tempChessMode) {
                delete window.tempChessMode;
            }
        }
        
        createChessBoard() {
            this.boardWindow = new Window_ChessBoard(new Rectangle(50, 50, 480, 480));
            this.boardWindow.setChess(this.chess);
            this.addWindow(this.boardWindow);
        }
        
        createLogWindow() {
            this.logWindow = new Window_ChessLog(new Rectangle(550, 50, 300, 200));
            this.logWindow.setChess(this.chess);
            this.addWindow(this.logWindow);
        }
        
        createModeWindow() {
            this.modeWindow = new Window_Base(new Rectangle(550, 260, 300, 80));
            const text = `Mode: ${this.chess.gameMode === 'normal' ? 'Normal Chess' : 'Chaos Chess'}`;
            this.modeWindow.contents.drawText(text, 0, 0, 280, 36);
            this.addWindow(this.modeWindow);
        }
        
        createCheatMeterWindow() {
            if (this.chess.gameMode === 'chaos') {
                this.cheatMeterWindow = new Window_CheatMeter(new Rectangle(550, 350, 300, 120));
                this.cheatMeterWindow.setChess(this.chess);
                this.addWindow(this.cheatMeterWindow);
            }
        }
        
        update() {
            super.update();
            if (Input.isTriggered('cancel') || TouchInput.isCancelled()) {
                this.popScene();
            }
            
            // Update cheat meter display
            if (this.cheatMeterWindow) {
                this.cheatMeterWindow.refresh();
            }
        }
    }
    
    class Window_ChessBoard extends Window_Selectable {
        initialize(rect) {
            super.initialize(rect);
            this.chess = null;
            this.activate();
        }
        
        setChess(chess) {
            this.chess = chess;
            this.refresh();
        }
        
        maxCols() {
            return 8;
        }
        
        maxItems() {
            return 64;
        }
        
        itemHeight() {
            return Math.floor(this.innerHeight / 8);
        }
        
        itemWidth() {
            return Math.floor(this.innerWidth / 8);
        }
        
        drawItem(index) {
            const rect = this.itemRectWithPadding(index);
            const row = Math.floor(index / 8);
            const col = index % 8;
            
            // Checkerboard pattern
            const isLight = (row + col) % 2 === 0;
            this.contents.fillRect(rect.x, rect.y, rect.width, rect.height, 
                isLight ? '#f0d9b5' : '#b58863');
            
            // Selected square highlight
            if (this.chess && this.chess.selectedSquare && 
                this.chess.selectedSquare.row === row && this.chess.selectedSquare.col === col) {
                this.contents.fillRect(rect.x + 2, rect.y + 2, rect.width - 4, rect.height - 4, '#ffff00');
            }
            
            // Draw piece
            if (this.chess) {
                const piece = this.chess.board[row][col];
                if (piece !== PIECES.EMPTY) {
                    const symbol = this.chess.getPieceSymbol(piece, row, col);
                    this.contents.fontSize = 36;
                    this.contents.drawText(symbol, rect.x, rect.y + 5, rect.width, rect.height, 'center');
                    const fontSize = this.standardFontSize();
                    this.contents.fontSize = fontSize;
                        }
            }
        }
        
        refresh() {
            this.contents.clear();
            for (let i = 0; i < this.maxItems(); i++) {
                this.drawItem(i);
            }
        }
        
        processOk() {
            if (!this.chess || this.chess.gameEnded) return;
            
            const index = this.index();
            const row = Math.floor(index / 8);
            const col = index % 8;
            
            // Check for cheat mode activation (press Shift/Z when cheat meter full)
            if (Input.isPressed('shift') && this.chess.canActivateCheatMode()) {
                this.chess.activateCheatMode();
                this.refresh();
                if (SceneManager._scene.logWindow) {
                    SceneManager._scene.logWindow.refresh();
                }
                return;
            }
            
            if (this.chess.selectedSquare) {
                // Try to make a move
                const fromRow = this.chess.selectedSquare.row;
                const fromCol = this.chess.selectedSquare.col;
                
                if (this.chess.currentPlayer === 'white') {
                    const moveCheck = this.chess.isLegalOrCheatMove(fromRow, fromCol, row, col);
                    
                    if (moveCheck.legal || moveCheck.cheat) {
                        const piece = this.chess.board[fromRow][fromCol];
                        const capturedPiece = this.chess.makeMove(fromRow, fromCol, row, col);
                        
                        const moveNotation = this.chess.getMoveNotation(piece, fromRow, fromCol, row, col, capturedPiece);
                        
                        if (moveCheck.cheat) {
                            this.chess.useCheatMove();
                            this.chess.addToLog(`White cheats: ${moveNotation} 🔥`);
                        } else {
                            this.chess.addToLog(`White plays: ${moveNotation}`);
                        }
                        
                        this.chess.currentPlayer = 'black';
                        this.chess.selectedSquare = null;
                        
                        this.chess.checkGameEnd();
                        if (!this.chess.gameEnded) {
                            // AI move
                            setTimeout(() => {
                                this.chess.makeAIMove();
                                this.chess.currentPlayer = 'white';
                                this.chess.checkGameEnd();
                                this.refresh();
                                SceneManager._scene.logWindow.refresh();
                            }, 500);
                        }
                    } else {
                        this.chess.selectedSquare = null;
                    }
                }
            } else {
                // Select a piece
                const piece = this.chess.board[row][col];
                if (this.chess.currentPlayer === 'white' && this.chess.isWhitePiece(piece)) {
                    this.chess.selectedSquare = {row, col};
                }
            }
            
            this.refresh();
            if (SceneManager._scene.logWindow) {
                SceneManager._scene.logWindow.refresh();
            }
        }
    }
    
    class Window_ChessLog extends Window_Base {
        initialize(rect) {
            super.initialize(rect);
            this.chess = null;
        }
        
        setChess(chess) {
            this.chess = chess;
            this.refresh();
        }
        
        refresh() {
            this.contents.clear();
            if (!this.chess) return;
            
            let y = 0;
            const lineHeight = this.lineHeight();
            
            for (const message of this.chess.moveLog) {
                this.drawTextEx(message, 0, y);
                y += lineHeight;
                if (y >= this.contents.height - lineHeight) break;
            }
        }
    }
    
    // Plugin commands
    PluginManager.registerCommand('ChessGame', 'startNormalChess', function(args) {
        // Temporarily override game mode for this session
        window.tempChessMode = 'normal';
        SceneManager.push(Scene_Chess);
    });
    
    PluginManager.registerCommand('ChessGame', 'startChaosChess', function(args) {
        // Temporarily override game mode for this session
        window.tempChessMode = 'chaos';
        SceneManager.push(Scene_Chess);
    });
    
    // Legacy plugin command for backwards compatibility
    PluginManager.registerCommand('ChessGame', 'startChess', function(args) {
        SceneManager.push(Scene_Chess);
    });
    
    // Add menu command
    const _Scene_Menu_createCommandWindow = Scene_Menu.prototype.createCommandWindow;
    Scene_Menu.prototype.createCommandWindow = function() {
        _Scene_Menu_createCommandWindow.call(this);
        this._commandWindow.setHandler('chess', this.commandChess.bind(this));
    };
    
    Scene_Menu.prototype.commandChess = function() {
        SceneManager.push(Scene_Chess);
    };
    
    const _Window_MenuCommand_addOriginalCommands = Window_MenuCommand.prototype.addOriginalCommands;
    Window_MenuCommand.prototype.addOriginalCommands = function() {
        _Window_MenuCommand_addOriginalCommands.call(this);
        this.addCommand('Chess Game', 'chess');
    };
})();
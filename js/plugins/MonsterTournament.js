/*:
 * @target MZ
 * @plugindesc Monster Tournament Betting v1.0.6
 * @author Omni-Lex
 * @version 1.0.6
 * @description Monster direct elimination tournament with betting system and fight animations
 * 
 * @help MonsterTournament.js
 * 
 * This plugin creates a monster tournament betting system where players can
 * bet items (ID 590) on monsters and watch them fight in elimination rounds.
 * Only battles involving the player's monster are shown visually.
 * 
 * Selection Controls:
 * - Left/Right arrows: Cycle through monsters
 * - Enter: Select current monster
 * 
 * Betting Controls:
 * - Left/Right arrows: Adjust bet by 1
 * - Up/Down arrows: Adjust bet by 10
 * 
 * Plugin Commands:
 * - Start Tournament: Opens the monster selection and tournament interface
 * 
 * @param bettingItemId
 * @text Betting Item ID
 * @desc ID of the item used for betting
 * @type number
 * @default 590
 * 
 * @command startTournament
 * @text Start Tournament
 * @desc Start the monster tournament betting game
 */

(() => {
    'use strict';
    
    const pluginName = 'MonsterTournament';
    const parameters = PluginManager.parameters(pluginName);
    const bettingItemId = Number(parameters['bettingItemId'] || 590);

    // Register plugin command
    PluginManager.registerCommand(pluginName, "startTournament", args => {
        SceneManager.push(Scene_MonsterTournament);
    });

    class Scene_MonsterTournament extends Scene_MenuBase {
        create() {
            super.create();
            this.createBackground();
            this.createWindowLayer();
            this.phase = 'selection'; // selection, betting, tournament, results
            this.selectedMonsters = [];
            this.currentBets = {};
            this.playerChoice = -1;
            this.tournamentBracket = [];
            this.currentRound = 0;
            this.roundResults = [];
            this.currentMonsterIndex = 0;
            this.playerMonsterEliminated = false;
            
            this.selectRandomMonsters();
            this.createSelectionWindows();
        }

        createBackground() {
            this._backgroundFilter = new PIXI.filters.BlurFilter();
            this._backgroundSprite = new Sprite();
            this._backgroundSprite.bitmap = SceneManager.backgroundBitmap();
            this._backgroundSprite.filters = [this._backgroundFilter];
            this.addChild(this._backgroundSprite);
            this.setBackgroundOpacity(192);
        }

        selectRandomMonsters() {
            const allEnemies = $dataEnemies.filter(enemy => enemy && enemy.name);
            this.selectedMonsters = [];
            
            for (let i = 0; i < 8; i++) {
                let randomEnemy;
                do {
                    randomEnemy = allEnemies[Math.floor(Math.random() * allEnemies.length)];
                } while (this.selectedMonsters.includes(randomEnemy));
                
                this.selectedMonsters.push(randomEnemy);
                this.currentBets[i] = 0;
            }
        }

        createSelectionWindows() {
        this._titleWindow = new Window_Base(new Rectangle(0, 0, Graphics.boxWidth, 80));
        this._titleWindow.drawText('Monster Tournament - Select Your Fighter!', 0, 0,
            this._titleWindow.contents.width, 'center');
        this.addWindow(this._titleWindow);
    
        // Create single monster display window
        this._monsterDisplayWindow = new Window_SingleMonsterDisplay(
            new Rectangle(0, 100, Graphics.boxWidth, Graphics.boxHeight - 90),
            this.selectedMonsters,
            this.currentMonsterIndex
        );
        this._monsterDisplayWindow.setHandler('ok', this.onMonsterSelect.bind(this));
        this._monsterDisplayWindow.setHandler('cancel', this.popScene.bind(this));
        this.addWindow(this._monsterDisplayWindow);
    
        // Create betting window as a centered overlay
        const betWidth = 450;
        const betHeight = 140;
        const betX = (Graphics.boxWidth - betWidth) / 2;
        const betY = (Graphics.boxHeight - betHeight) / 2;
        this._bettingWindow = new Window_BettingAmount(
            new Rectangle(betX, betY, betWidth, betHeight)
        );
        this._bettingWindow.setHandler('ok', this.onBetConfirm.bind(this));
        this._bettingWindow.setHandler('cancel', this.onBetCancel.bind(this));
        this._bettingWindow.hide();
        this.addWindow(this._bettingWindow);
    
        // Set initial active window
        this.activateMonsterSelection();
    };

        activateMonsterSelection() {
            this._monsterDisplayWindow.activate();
            this._monsterDisplayWindow.select(0);
            this._monsterDisplayWindow.setCurrentMonster(this.currentMonsterIndex);
        }

        update() {
            super.update();
            
            // Handle navigation between monsters during selection phase
            if (this.phase === 'selection' && this._monsterDisplayWindow.active) {
                this.handleMonsterNavigation();
            }
        }

        handleMonsterNavigation() {
            if (Input.isTriggered('right')) {
                this.navigateMonster(1);
            } else if (Input.isTriggered('left')) {
                this.navigateMonster(-1);
            }
        }

        navigateMonster(direction) {
            let newIndex = this.currentMonsterIndex + direction;
            
            // Handle wrapping
            if (newIndex < 0) {
                newIndex = 7;
            } else if (newIndex > 7) {
                newIndex = 0;
            }
            
            this.currentMonsterIndex = newIndex;
            this._monsterDisplayWindow.setCurrentMonster(this.currentMonsterIndex);
            SoundManager.playCursor();
        }

 // Replace the onMonsterSelect method with this fixed version:

// Replace the onMonsterSelect method with this fixed version:

onMonsterSelect() {
    // Check if player has any betting items before allowing bet placement
    if ($gameParty.numItems($dataItems[bettingItemId]) <= 0) {
        // Display error in title
        this._titleWindow.contents.clear();
        this._titleWindow.drawText(
            "No tokens available!",
            0, 0, this._titleWindow.contents.width, 'center'
        );
        
        SoundManager.playBuzzer();
        
        // Close scene after brief delay
        setTimeout(() => {
            this.popScene();
        }, 1500);
        
        return; // Prevent further execution
    }
    
    this.playerChoice = this.currentMonsterIndex;
    this.phase = 'betting';

    // Deactivate monster display window, but do not hide it.
    this._monsterDisplayWindow.deactivate();

    // Show and activate betting window overlay
    this._bettingWindow.show();
    this._bettingWindow.activate();
    this._bettingWindow.refresh();

    // Update title
    this._titleWindow.contents.clear();
    this._titleWindow.drawText(
        `Selected: ${this.selectedMonsters[this.playerChoice].name} - Place Your Bet!`,
        0, 0, this._titleWindow.contents.width, 'center'
    );
}
        

        onBetConfirm() {
            const betAmount = this._bettingWindow.currentBet();
            if (betAmount <= 0) {
                $gameMessage.add("You must bet at least 1 item!");
                return;
            }
            
            if ($gameParty.numItems($dataItems[bettingItemId]) < betAmount) {
                $gameMessage.add("Not enough betting items!");
                return;
            }

            this.currentBets[this.playerChoice] = betAmount;
            $gameParty.loseItem($dataItems[bettingItemId], betAmount);
            
            this.startTournament();
        }

        onBetCancel(){
        this.phase = 'selection';
    
        // Hide and deactivate betting window
        this._bettingWindow.hide();
        this._bettingWindow.deactivate();
    
        // Reactivate monster selection (no need to show() as it was never hidden)
        this.activateMonsterSelection();
    
        // Restore title
        this._titleWindow.contents.clear();
        this._titleWindow.drawText('Monster Tournament - Select Your Fighter!',
            0, 0, this._titleWindow.contents.width, 'center');
    };

        startTournament() {
            this.phase = 'tournament';
            this._bettingWindow.hide();
            this._monsterDisplayWindow.hide();
            
            // Initialize tournament bracket
            this.tournamentBracket = [...Array(8).keys()];
            this.currentRound = 1;
            this.roundResults = [];
            this.playerMonsterEliminated = false;
            
            this.createBattleScene();
            this.simulateRound();
        }

        createBattleScene() {
            // Remove old windows if they exist
            if (this._tournamentWindow) {
                this.removeChild(this._tournamentWindow);
            }
            
            // Create battle arena
            this._battleArena = new Window_BattleArena(
                new Rectangle(0, 80, Graphics.boxWidth, Graphics.boxHeight - 80)
            );
            this.addWindow(this._battleArena);
        }

        simulateRound() {
            if (this.tournamentBracket.length === 1) {
                this.endTournament();
                return;
            }

            // Check if player's monster is still in the tournament
            if (!this.tournamentBracket.includes(this.playerChoice)) {
                this.playerMonsterEliminated = true;
                this.endTournament();
                return;
            }

            // Create pairs for this round
            const roundPairs = [];
            for (let i = 0; i < this.tournamentBracket.length; i += 2) {
                roundPairs.push([this.tournamentBracket[i], this.tournamentBracket[i + 1]]);
            }

            // Find the pair containing the player's monster
            const playerPairIndex = roundPairs.findIndex(pair => 
                pair.includes(this.playerChoice)
            );

            if (playerPairIndex === -1) {
                // Player's monster not in this round (shouldn't happen)
                this.playerMonsterEliminated = true;
                this.endTournament();
                return;
            }

            // Simulate all other battles instantly
            const nextRoundContestants = [];
            
            for (let i = 0; i < roundPairs.length; i++) {
                const [fighter1Index, fighter2Index] = roundPairs[i];
                
                if (i === playerPairIndex) {
                    // This is the player's battle - we'll handle it visually later
                    continue;
                }
                
                // Simulate battle instantly
                const fighter1 = this.selectedMonsters[fighter1Index];
                const fighter2 = this.selectedMonsters[fighter2Index];
                const winner = this.simulateBattle(fighter1, fighter2);
                const winnerIndex = winner === fighter1 ? fighter1Index : fighter2Index;
                
                nextRoundContestants.push(winnerIndex);
                
                this.roundResults.push({
                    fighter1: fighter1Index,
                    fighter2: fighter2Index,
                    winner: winnerIndex
                });
            }

            // Now show the player's battle visually
            const playerPair = roundPairs[playerPairIndex];
            const opponentIndex = playerPair[0] === this.playerChoice ? playerPair[1] : playerPair[0];
            
            this.showPlayerBattle(this.playerChoice, opponentIndex, (winnerIndex) => {
                // Add the winner of player's battle to next round
                nextRoundContestants.push(winnerIndex);
                
                // Check if player's monster won
                if (winnerIndex !== this.playerChoice) {
                    this.playerMonsterEliminated = true;
                    this.endTournament();
                    return;
                }
                
                // Update bracket for next round
                this.tournamentBracket = nextRoundContestants;
                this.currentRound++;
                
                // Ask for additional bet if player's monster advanced
                if (this.tournamentBracket.length > 1) {
                    this.askForAdditionalBet();
                } else {
                    // Tournament complete, player won
                    this.endTournament();
                }
            });
        }

        showPlayerBattle(playerIndex, opponentIndex, callback) {
            const playerMonster = this.selectedMonsters[playerIndex];
            const opponentMonster = this.selectedMonsters[opponentIndex];
            
            // Update title to show current match
            this._titleWindow.contents.clear();
            this._titleWindow.drawText(
                `Your ${playerMonster.name} VS ${opponentMonster.name}`, 
                0, 0, this._titleWindow.contents.width, 'center'
            );
            
            // Start the battle animation
            this._battleArena.startBattle(playerMonster, opponentMonster, () => {
                // Battle animation complete callback
                const winner = this.simulateBattle(playerMonster, opponentMonster);
                const winnerIndex = winner === playerMonster ? playerIndex : opponentIndex;
                
                this.roundResults.push({
                    fighter1: playerIndex,
                    fighter2: opponentIndex,
                    winner: winnerIndex
                });
                
                // Show result message
                if (winnerIndex === playerIndex) {
                    $gameMessage.add(`${playerMonster.name} wins the battle!`);
                } else {
                    $gameMessage.add(`${playerMonster.name} was defeated by ${opponentMonster.name}!`);
                }
                
                // Call the callback after a brief delay
                setTimeout(() => callback(winnerIndex), 1000);
            });
        }

        simulateBattle(monster1, monster2) {
            // Simple battle simulation based on stats
            const score1 = monster1.params[0] + monster1.params[2] + monster1.params[4] + 
                          monster1.params[5] + Math.random() * 100;
            const score2 = monster2.params[0] + monster2.params[2] + monster2.params[4] + 
                          monster2.params[5] + Math.random() * 100;
            
            return score1 > score2 ? monster1 : monster2;
        }

        askForAdditionalBet() {
            const currentBet = this.currentBets[this.playerChoice];
            this._additionalBetWindow = new Window_AdditionalBet(
                new Rectangle(Graphics.boxWidth/4, Graphics.boxHeight/2 - 50, 
                             Graphics.boxWidth/2, 100),
                currentBet
            );
            this._additionalBetWindow.setHandler('yes', this.onAdditionalBetYes.bind(this));
            this._additionalBetWindow.setHandler('no', this.onAdditionalBetNo.bind(this));
            this.addWindow(this._additionalBetWindow);
        }

        onAdditionalBetYes() {
            this._additionalBetWindow.hide();
            this.removeChild(this._additionalBetWindow);
            this._additionalBetWindow = null;
            this._bettingWindow.show();
            this._bettingWindow.activate();
            this._bettingWindow.setHandler('ok', this.onAdditionalBetConfirm.bind(this));
            this._bettingWindow.setHandler('cancel', this.onAdditionalBetCancel.bind(this));
        }

        onAdditionalBetConfirm() {
            const betAmount = this._bettingWindow.currentBet();
            if (betAmount > 0 && $gameParty.numItems($dataItems[bettingItemId]) >= betAmount) {
                this.currentBets[this.playerChoice] += betAmount;
                $gameParty.loseItem($dataItems[bettingItemId], betAmount);
            }
            
            this._bettingWindow.hide();
            this._bettingWindow.deactivate();
            setTimeout(() => this.simulateRound(), 1000);
        }

        onAdditionalBetCancel() {
            this._bettingWindow.hide();
            this._bettingWindow.deactivate();
            setTimeout(() => this.simulateRound(), 1000);
        }

        onAdditionalBetNo() {
            this._additionalBetWindow.hide();
            this.removeChild(this._additionalBetWindow);
            this._additionalBetWindow = null;
            setTimeout(() => this.simulateRound(), 1000);
        }

        endTournament() {
            if (this.playerMonsterEliminated) {
                // Player's monster was eliminated
                this._titleWindow.contents.clear();
                this._titleWindow.drawText(
                    `${this.selectedMonsters[this.playerChoice].name} was eliminated!`, 
                    0, 0, this._titleWindow.contents.width, 'center'
                );
                
                $gameMessage.add(`Your monster was eliminated from the tournament!`);
                $gameMessage.add(`You lost ${this.currentBets[this.playerChoice]} betting items.`);
            } else {
                // Player won the tournament
                const winnerId = this.tournamentBracket[0];
                
                this._titleWindow.contents.clear();
                this._titleWindow.drawText(
                    `CHAMPION: ${this.selectedMonsters[winnerId].name}!`, 
                    0, 0, this._titleWindow.contents.width, 'center'
                );
                
                const totalWinnings = this.currentBets[this.playerChoice] * 8; // 8:1 payout
                $gameParty.gainItem($dataItems[bettingItemId], totalWinnings);
                $gameMessage.add(`Congratulations! Your monster won the tournament!`);
                $gameMessage.add(`You won ${totalWinnings} items!`);
            }
            
            // Wait a moment then return to menu
            setTimeout(() => this.popScene(), 2000);
        }
    }

    class Window_BattleArena extends Window_Base {
        constructor(rect) {
            super(rect);
            this._fighter1Sprite = null;
            this._fighter2Sprite = null;
            this._animationSprites = [];
            this._battleCallback = null;
            this._battlePhase = 'idle'; // idle, intro, clash, eliminate, complete
            this._animationTimer = 0;
        }

        startBattle(fighter1, fighter2, callback) {
            this._fighter1 = fighter1;
            this._fighter2 = fighter2;
            this._battleCallback = callback;
            this._battlePhase = 'intro';
            this._animationTimer = 0;
            
            this.show();
            this.createFighterSprites();
            this.refresh();
        }

        createFighterSprites() {
            // Clear previous sprites
            this.clearFighterSprites();
            
            // Create fighter 1 sprite (left side)
            if (this._fighter1.battlerName) {
                this._fighter1Sprite = new Sprite();
                this._fighter1Sprite.bitmap = ImageManager.loadEnemy(this._fighter1.battlerName);
                this._fighter1Sprite.anchor.x = 0.5;
                this._fighter1Sprite.anchor.y = 0.8;
                this._fighter1Sprite.x = this.contents.width * 0.25;
                this._fighter1Sprite.y = this.contents.height * 0.7;
                this._fighter1Sprite.scale.x = 0.8;
                this._fighter1Sprite.scale.y = 0.8;
                this.addChild(this._fighter1Sprite);
            }
            
            // Create fighter 2 sprite (right side, flipped)
            if (this._fighter2.battlerName) {
                this._fighter2Sprite = new Sprite();
                this._fighter2Sprite.bitmap = ImageManager.loadEnemy(this._fighter2.battlerName);
                this._fighter2Sprite.anchor.x = 0.5;
                this._fighter2Sprite.anchor.y = 0.8;
                this._fighter2Sprite.x = this.contents.width * 0.75;
                this._fighter2Sprite.y = this.contents.height * 0.7;
                this._fighter2Sprite.scale.x = -0.8; // Flipped
                this._fighter2Sprite.scale.y = 0.8;
                this.addChild(this._fighter2Sprite);
            }
        }

        clearFighterSprites() {
            if (this._fighter1Sprite) {
                this.removeChild(this._fighter1Sprite);
                this._fighter1Sprite = null;
            }
            if (this._fighter2Sprite) {
                this.removeChild(this._fighter2Sprite);
                this._fighter2Sprite = null;
            }
            this._animationSprites.forEach(sprite => this.removeChild(sprite));
            this._animationSprites = [];
        }

        update() {
            super.update();
            this.updateBattleAnimation();
        }

        updateBattleAnimation() {
            if (this._battlePhase === 'idle') return;
            
            this._animationTimer++;
            
            switch (this._battlePhase) {
                case 'intro':
                    this.updateIntroAnimation();
                    break;
                case 'clash':
                    this.updateClashAnimation();
                    break;
                case 'eliminate':
                    this.updateEliminateAnimation();
                    break;
                case 'complete':
                    this.completeBattle();
                    break;
            }
        }

        updateIntroAnimation() {
            // Fighters approach each other
            const progress = Math.min(this._animationTimer / 60, 1); // 1 second
            
            if (this._fighter1Sprite && this._fighter2Sprite) {
                // Move fighters towards center
                const startX1 = this.contents.width * 0.25;
                const startX2 = this.contents.width * 0.75;
                const targetX1 = this.contents.width * 0.4;
                const targetX2 = this.contents.width * 0.6;
                
                this._fighter1Sprite.x = startX1 + (targetX1 - startX1) * progress;
                this._fighter2Sprite.x = startX2 + (targetX2 - startX2) * progress;
                
                // Add bounce effect
                const bounceY = Math.sin(progress * Math.PI * 4) * 5;
                this._fighter1Sprite.y = this.contents.height * 0.7 + bounceY;
                this._fighter2Sprite.y = this.contents.height * 0.7 + bounceY;
            }
            
            if (this._animationTimer >= 60) {
                this._battlePhase = 'clash';
                this._animationTimer = 0;
            }
        }

        updateClashAnimation() {
            // Show skill animations and clash effects
            if (this._animationTimer === 1) {
                this.createClashEffects();
                SoundManager.playBattleStart();
            }
            
            // Make sprites shake during clash
            if (this._fighter1Sprite && this._fighter2Sprite && this._animationTimer < 90) {
                const shakeX = (Math.random() - 0.5) * 8;
                const shakeY = (Math.random() - 0.5) * 4;
                
                this._fighter1Sprite.x += shakeX;
                this._fighter1Sprite.y += shakeY;
                this._fighter2Sprite.x += shakeX;
                this._fighter2Sprite.y += shakeY;
            }
            
            if (this._animationTimer >= 120) { // 2 seconds
                this._battlePhase = 'eliminate';
                this._animationTimer = 0;
                this.determineWinner();
            }
        }

        createClashEffects() {
            // Create visual effects for the clash
            const centerX = this.contents.width * 0.5;
            const centerY = this.contents.height * 0.6;
            
            // Create impact flash
            const flashSprite = new Sprite();
            flashSprite.bitmap = new Bitmap(100, 100);
            flashSprite.bitmap.fillAll('white');
            flashSprite.anchor.x = 0.5;
            flashSprite.anchor.y = 0.5;
            flashSprite.x = centerX;
            flashSprite.y = centerY;
            flashSprite.blendMode = PIXI.BLEND_MODES.ADD;
            this.addChild(flashSprite);
            this._animationSprites.push(flashSprite);
            
            // Fade out the flash
            const fadeFlash = () => {
                flashSprite.opacity -= 15;
                if (flashSprite.opacity > 0) {
                    setTimeout(fadeFlash, 50);
                }
            };
            fadeFlash();
            
            // Create skill effect based on monster skills
            this.createSkillEffect(this._fighter1, centerX - 50, centerY);
            this.createSkillEffect(this._fighter2, centerX + 50, centerY);
        }

        createSkillEffect(fighter, x, y) {
            // Get a random skill from the fighter
            const skills = fighter.actions.filter(action => action.skillId > 0);
            if (skills.length === 0) return;
            
            const skill = $dataSkills[skills[Math.floor(Math.random() * skills.length)].skillId];
            if (!skill) return;
            
            // Create simple effect based on skill type
            const effectSprite = new Sprite();
            effectSprite.bitmap = new Bitmap(60, 60);
            
            // Color based on skill damage type
            let color = 'yellow'; // Default
            if (skill.damage && skill.damage.elementId > 0) {
                const colors = ['white', 'red', 'blue', 'green', 'yellow', 'purple', 'orange'];
                color = colors[skill.damage.elementId % colors.length];
            }
            
            effectSprite.bitmap.fillAll(color);
            effectSprite.anchor.x = 0.5;
            effectSprite.anchor.y = 0.5;
            effectSprite.x = x;
            effectSprite.y = y;
            effectSprite.scale.x = 0.1;
            effectSprite.scale.y = 0.1;
            this.addChild(effectSprite);
            this._animationSprites.push(effectSprite);
            
            // Expand and fade effect
            const expandEffect = () => {
                effectSprite.scale.x += 0.05;
                effectSprite.scale.y += 0.05;
                effectSprite.opacity -= 8;
                if (effectSprite.opacity > 0) {
                    setTimeout(expandEffect, 30);
                }
            };
            expandEffect();
        }

        determineWinner() {
            // Determine winner based on stats (same logic as main battle simulation)
            const score1 = this._fighter1.params[0] + this._fighter1.params[2] + this._fighter1.params[4] + 
                          this._fighter1.params[5] + Math.random() * 100;
            const score2 = this._fighter2.params[0] + this._fighter2.params[2] + this._fighter2.params[4] + 
                          this._fighter2.params[5] + Math.random() * 100;
            
            this._winner = score1 > score2 ? this._fighter1 : this._fighter2;
            this._loser = this._winner === this._fighter1 ? this._fighter2 : this._fighter1;
            this._loserSprite = this._winner === this._fighter1 ? this._fighter2Sprite : this._fighter1Sprite;
        }

        updateEliminateAnimation() {
            // Make the loser disappear
            if (this._loserSprite) {
                this._loserSprite.opacity -= 5;
                this._loserSprite.scale.x *= 0.98;
                this._loserSprite.scale.y *= 0.98;
                
                // Add elimination effect
                if (this._animationTimer % 10 === 0) {
                    this.createEliminationParticle();
                }
            }
            
            if (this._animationTimer >= 60) { // 1 second
                this._battlePhase = 'complete';
                this._animationTimer = 0;
            }
        }

        createEliminationParticle() {
            if (!this._loserSprite) return;
            
            const particle = new Sprite();
            particle.bitmap = new Bitmap(8, 8);
            particle.bitmap.fillAll('red');
            particle.anchor.x = 0.5;
            particle.anchor.y = 0.5;
            particle.x = this._loserSprite.x + (Math.random() - 0.5) * 100;
            particle.y = this._loserSprite.y + (Math.random() - 0.5) * 100;
            particle.velocity = {
                x: (Math.random() - 0.5) * 4,
                y: Math.random() * -3 - 1
            };
            this.addChild(particle);
            this._animationSprites.push(particle);
            
            // Animate particle
            const animateParticle = () => {
                particle.x += particle.velocity.x;
                particle.y += particle.velocity.y;
                particle.velocity.y += 0.1; // Gravity
                particle.opacity -= 5;
                
                if (particle.opacity > 0) {
                    setTimeout(animateParticle, 30);
                } else {
                    this.removeChild(particle);
                }
            };
            animateParticle();
        }

        completeBattle() {
            // Clean up and call callback
            this._battlePhase = 'idle';
            SoundManager.playOk();
            
            if (this._battleCallback) {
                this._battleCallback();
                this._battleCallback = null;
            }
        }

        refresh() {
            this.contents.clear();
            
            if (this._battlePhase !== 'idle' && this._fighter1 && this._fighter2) {
                // Draw battle status or effects if needed
                const statusY = 20;
                this.drawText(`${this._fighter1.name} VS ${this._fighter2.name}`, 
                             0, statusY, this.contents.width, 'center');
            }
        }
    }

    class Window_SingleMonsterDisplay extends Window_Selectable {
        constructor(rect, monsters, currentIndex) {
            super(rect);
            this._monsters = monsters;
            this._currentIndex = currentIndex;
            this.refresh();
        }

        setCurrentMonster(index) {
            this._currentIndex = index;
            this.refresh();
        }

        refresh() {
            this.contents.clear();
            if (this._monsters && this._monsters[this._currentIndex]) {
                const monster = this._monsters[this._currentIndex];
                
                // Draw monster name (large, centered)
                this.contents.fontSize = 28;
                this.drawText(monster.name, 0, 20, this.contents.width, 'center');
                this.contents.fontSize = $gameSystem.mainFontSize();
                
                // Calculate layout
                const leftColumnX = 50;
                const rightColumnX = this.contents.width / 2 + 50;
                const spriteX = this.contents.width - 200;
                let currentY = 80;
                
                // Draw basic parameters (left column)
                this.changeTextColor(ColorManager.systemColor());
                this.drawText('Basic Stats:', leftColumnX, currentY, 200);
                this.changeTextColor(ColorManager.normalColor());
                currentY += 35;
                
                const paramNames = ['HP', 'MP', 'ATK', 'DEF', 'MAT', 'MDF', 'AGI', 'PSI'];
                for (let i = 2; i < 8; i++) {
                    this.drawText(`${paramNames[i]}:`, leftColumnX, currentY, 60);
                    this.drawText(monster.params[i].toString(), leftColumnX + 70, currentY, 100, 'right');
                    currentY += 25;
                }
                
                // Draw additional info (right column)
                let rightY = 115;
                
 
                
                // Draw element resistances if available
                if (monster.traits && monster.traits.length > 0) {
                    this.changeTextColor(ColorManager.systemColor());
                    this.drawText('Special Traits:', rightColumnX, rightY, 200);
                    this.changeTextColor(ColorManager.normalColor());
                    rightY += 30;
                    
                    let traitCount = 0;
                    for (let trait of monster.traits) {
                        if (traitCount >= 4) break; // Limit display
                        
                        let traitText = '';
                        switch (trait.code) {
                            case 11: // Element Rate
                                const elementName = $dataSystem.elements[trait.dataId] || 'Unknown';
                                const rate = Math.round(trait.value * 100);
                                traitText = `${elementName}: ${rate}%`;
                                break;
                        }
                        
                        if (traitText) {
                            this.contents.fontSize = 18;
                            this.drawText(traitText, rightColumnX, rightY, 180);
                            this.contents.fontSize = $gameSystem.mainFontSize();
                            rightY += 22;
                            traitCount++;
                        }
                    }
                }
                
                // Draw combat power estimate
                const combatPower = monster.params[0] + monster.params[2] + monster.params[4] + monster.params[5];
                rightY += 10;
                this.changeTextColor(ColorManager.powerUpColor());
                this.drawText('Combat Power:', rightColumnX, rightY, 120);
                this.drawText(combatPower.toString(), rightColumnX + 130, rightY, 80, 'right');
                this.changeTextColor(ColorManager.normalColor());
                
                // Draw monster sprite (right side)
                if (monster.battlerName) {
                    // Clear any existing sprite
                    this.children.forEach(child => {
                        if (child instanceof Sprite && child._monsterSprite) {
                            this.removeChild(child);
                        }
                    });
                    
                    const sprite = new Sprite();
                    sprite.bitmap = ImageManager.loadEnemy(monster.battlerName);
                    sprite.anchor.x = 0.5;
                    sprite.anchor.y = 0.5;
                    sprite.x = spriteX;
                    sprite.y = 200;
                    
                    // Scale sprite to fit nicely
                    const maxSize = 150;
                    sprite.bitmap.addLoadListener(() => {
                        const scaleX = maxSize / sprite.bitmap.width;
                        const scaleY = maxSize / sprite.bitmap.height;
                        const scale = Math.min(scaleX, scaleY, 1); // Don't upscale
                        sprite.scale.x = scale;
                        sprite.scale.y = scale;
                    });
                    
                    sprite._monsterSprite = true; // Mark for identification
                    this.addChild(sprite);
                }
                
                // Draw navigation instructions
                this.contents.fontSize = 18;
                this.changeTextColor(ColorManager.systemColor());
                this.drawText('← → Cycle Monsters', 0, this.contents.height - 60, this.contents.width, 'center');
                this.drawText(`Monster ${this._currentIndex + 1} of ${this._monsters.length}`, 0, this.contents.height - 40, this.contents.width, 'center');
                this.contents.fontSize = $gameSystem.mainFontSize();
                this.changeTextColor(ColorManager.normalColor());
                
                // Draw selection indicator
                this.contents.fontSize = 20;
                this.changeTextColor(ColorManager.ctGaugeColor1());
                this.drawText('◆ PRESS ENTER TO SELECT ◆', 0, this.contents.height - 20, this.contents.width, 'center');
                this.contents.fontSize = $gameSystem.mainFontSize();
                this.changeTextColor(ColorManager.normalColor());
            }
        }

        maxItems() {
            return 1;
        }
    }

    class Window_BettingAmount extends Window_Selectable {
        constructor(rect) {
            super(rect);
            this._betAmount = 1;
            this.refresh();
        }

        refresh() {
            this.contents.clear();
            const maxBet = $gameParty.numItems($dataItems[bettingItemId]);
            const lineHeight = this.lineHeight();
        
            this.drawText(`Current Bet: ${this._betAmount}`, 0, 0, this.contents.width, 'center');
            this.drawText(`Available: ${maxBet}`, 0, lineHeight, this.contents.width, 'center');
            
            // Use smaller font for instructions
            this.contents.fontSize = 20;
            this.drawText('← → (±1)    ↑ ↓ (±10)', 0, lineHeight * 2 + 4, this.contents.width, 'center');
            this.drawText('Enter to confirm, ESC to cancel', 0, lineHeight * 2 + 28, this.contents.width, 'center');
            
            // Reset font size to default
            this.contents.fontSize = $gameSystem.mainFontSize();
        };

        currentBet() {
            return this._betAmount;
        }

        cursorRight() {
            const maxBet = $gameParty.numItems($dataItems[bettingItemId]);
            if (this._betAmount < maxBet) {
                this._betAmount++;
                this.refresh();
                SoundManager.playCursor();
            }
        }

        cursorLeft() {
            if (this._betAmount > 1) {
                this._betAmount--;
                this.refresh();
                SoundManager.playCursor();
            }
        }

        cursorUp() {
            const maxBet = $gameParty.numItems($dataItems[bettingItemId]);
            const newAmount = Math.min(this._betAmount + 10, maxBet);
            if (newAmount !== this._betAmount) {
                this._betAmount = newAmount;
                this.refresh();
                SoundManager.playCursor();
            }
        }

        cursorDown() {
            const newAmount = Math.max(this._betAmount - 10, 1);
            if (newAmount !== this._betAmount) {
                this._betAmount = newAmount;
                this.refresh();
                SoundManager.playCursor();
            }
        }

        maxItems() {
            return 1;
        }
    }

    class Window_AdditionalBet extends Window_Command {
        constructor(rect, currentBet) {
            super(rect);
            this._currentBet = currentBet;
        }
    
        makeCommandList() {
            const doubleBet = this._currentBet * 2;
            this.addCommand(`Double your bet - ${doubleBet}`, 'yes');
            this.addCommand('Keep Current Bet', 'no');
        }
    }

    // Export the scene class
    window.Scene_MonsterTournament = Scene_MonsterTournament;
})();
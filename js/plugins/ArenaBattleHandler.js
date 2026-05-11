/*:
* @target MZ
* @plugindesc Enhanced Arena Battle Handler - Shows enemy list, stats, and manages arena battles.
* @author OmniLex
*
* @param ArenaWinsVariable
* @text Arena Wins Variable
* @type variable
* @desc Variable ID to store the player's number of arena wins.
* @default 1
*
* @param GauntletWinsVariable
* @text Gauntlet Wins Variable
* @type variable
* @desc Variable ID to store the player's number of gauntlet wins.
* @default 2
*
* @param GauntletBracketVariable
* @text Gauntlet Bracket Variable
* @type variable
* @desc Variable ID to store the player's current gauntlet bracket.
* @default 3
*
* @command StartArenaBattle
* @text Start Arena Battle
* @desc Starts an arena battle with scaling difficulty.
*
* @command ShowEnemyTroopList
* @text Show Enemy Troop List
* @desc Opens a window showing all troops with single enemies, their stats and description.
*
* @command StartGauntletMode
* @text Start Gauntlet Mode
* @desc Opens a window to select a level bracket and starts consecutive battles.
*/

(() => {
    const pluginName = "ArenaBattleHandler";

    const parameters = PluginManager.parameters(pluginName);
    const arenaWinsVarId = Number(parameters['ArenaWinsVariable'] || 1);
    const gauntletWinsVarId = Number(parameters['GauntletWinsVariable'] || 2);
    const gauntletBracketVarId = Number(parameters['GauntletBracketVariable'] || 3);

    PluginManager.registerCommand(pluginName, "StartArenaBattle", args => {
        ArenaBattleHandler.startArenaBattle();
    });

    PluginManager.registerCommand(pluginName, "ShowEnemyTroopList", args => {
        SceneManager.push(Scene_EnemyTroopList);
    });

    PluginManager.registerCommand(pluginName, "StartGauntletMode", args => {
        SceneManager.push(Scene_GauntletSelect);
    });

    const ArenaBattleHandler = {
        startArenaBattle(troopId) {
            let troop;

            if (troopId) {
                troop = $dataTroops[troopId];
            } else {
                const wins = $gameVariables.value(arenaWinsVarId);
                troop = this.selectTroop(wins);
            }

            if (troop) {
                this.prepareBuffEnemies(troop);
                BattleManager.setup(troop.id, true, false);
                BattleManager.setBattleTest(false);
                SceneManager.push(Scene_Battle);
            } else {
                console.error("No suitable troop found for arena battle.");
            }
        },

        selectTroop(wins) {
            const troops = $dataTroops.filter(t => t && t.members.length > 0);
            const troopStats = troops.map(troop => {
                const totalStats = troop.members.reduce((sum, member) => {
                    const enemy = $dataEnemies[member.enemyId];
                    if (!enemy) return sum;
                    return sum + this.calculateEnemyStatScore(enemy);
                }, 0);
                return { troop, totalStats };
            });

            troopStats.sort((a, b) => a.totalStats - b.totalStats);

            const difficultyRange = 3; // Allow some randomness
            const targetIndex = Math.min(troopStats.length - 1, Math.floor(wins / 2));
            const start = Math.max(0, targetIndex - difficultyRange);
            const end = Math.min(troopStats.length - 1, targetIndex + difficultyRange);
            const availableChoices = troopStats.slice(start, end + 1);

            const choice = availableChoices[Math.floor(Math.random() * availableChoices.length)];
            return choice.troop;
        },

        calculateEnemyStatScore(enemy) {
            const params = enemy.params;
            return params[2] + params[3] + params[4] + params[5] + params[6];
        },

        prepareBuffEnemies(troop) {
            // No longer modifying HP values to leave them as base stats
            // This function is kept for compatibility but doesn't modify anything
        },

        // Parse enemy level and description from note field
        parseEnemyNotes(enemy) {
            if (!enemy || !enemy.note) {
                return { level: "?", description: "No description available" };
            }

            const noteText = enemy.note;
            const lvMatch = noteText.match(/LV:\s*(\d+)/i);
            const level = lvMatch ? lvMatch[1] : "?";

            // Extract description - everything between level and any <Char: tag
            let description = "";
            if (lvMatch) {
                const startPos = noteText.indexOf('|', lvMatch.index);
                if (startPos !== -1) {
                    // Find the next <Char: tag after the start position
                    const charTagMatch = noteText.substring(startPos + 1).match(/<Char:/i);
                    const endPos = charTagMatch
                        ? startPos + 1 + charTagMatch.index
                        : noteText.length;

                    description = noteText.substring(startPos + 1, endPos).trim();
                }
            } else {
                // If no level found, extract everything before the first <Char: tag
                const charTagMatch = noteText.match(/<Char:/i);
                description = charTagMatch
                    ? noteText.substring(0, charTagMatch.index).trim()
                    : noteText.trim();
            }

            description = window.translateText(description);

            return { level, description };
        },

        // Get enemy skills
        getEnemySkills(enemy) {
            if (!enemy || !enemy.actions) {
                return [];
            }

            const skillIds = [];
            enemy.actions.forEach(action => {
                if (action.skillId && !skillIds.includes(action.skillId)) {
                    skillIds.push(action.skillId);
                }
            });

            return skillIds.map(id => $dataSkills[id]).filter(skill => skill);
        },

        // Get troops filtered by level bracket
        getTroopsInLevelBracket(minLevel, maxLevel) {
            const result = [];
            for (let i = 1; i < $dataTroops.length; i++) {
                const troop = $dataTroops[i];
                if (troop && troop.members.length === 1) {
                    const enemyId = troop.members[0].enemyId;
                    const enemy = $dataEnemies[enemyId];
                    if (enemy) {
                        const { level } = this.parseEnemyNotes(enemy);
                        const enemyLevel = Number(level) || 0;
                        if (enemyLevel >= minLevel && enemyLevel <= maxLevel) {
                            result.push(troop);
                        }
                    }
                }
            }
            return result;
        },

        // Start a gauntlet battle
        startGauntletBattle() {
            // Fully restore party before battle
            $gameParty.members().forEach(actor => {
                actor.setHp(actor.mhp);
                actor.setMp(actor.mmp);
                actor.clearStates();
            });

            // Get current bracket
            const currentBracket = $gameVariables.value(gauntletBracketVarId);

            // Define level brackets
            const brackets = [
                { min: 1, max: 10 },
                { min: 11, max: 20 },
                { min: 21, max: 30 },
                { min: 31, max: 40 },
                { min: 41, max: 50 },
                { min: 51, max: 60 },
                { min: 61, max: 70 },
                { min: 71, max: 80 },
                { min: 81, max: 90 },
                { min: 91, max: 100 },
                { min: 101, max: 200 },
                { min: 201, max: 300 },
                { min: 301, max: 400 },
                { min: 401, max: 500 },
                { min: 501, max: 9999 }
            ];

            const bracket = brackets[currentBracket - 1] || brackets[0];
            const troops = this.getTroopsInLevelBracket(bracket.min, bracket.max);

            if (troops.length > 0) {
                const randomTroop = troops[Math.floor(Math.random() * troops.length)];

                // Setup battle
                BattleManager.setup(randomTroop.id, true, false);
                BattleManager.setBattleTest(false);
                BattleManager.setGauntletMode(true); // Mark this as a gauntlet battle
                SceneManager.push(Scene_Battle);
            } else {
                window.skipLocalization = true;

                // No suitable troops found
                $gameMessage.add("No suitable enemies found in this level bracket.");
                window.skipLocalization = false;

                this.endGauntlet();
            }
        },

        // Process gauntlet victory
        processGauntletVictory() {
            // Increment gauntlet wins
            const gauntletWins = $gameVariables.value(gauntletWinsVarId) || 0;
            const newWins = gauntletWins + 1;
            $gameVariables.setValue(gauntletWinsVarId, newWins);

            // Check if player should advance to next bracket
            if (newWins % 7 === 0) {
                const currentBracket = $gameVariables.value(gauntletBracketVarId);
                const brackets = [
                    { min: 1, max: 10 },
                    { min: 11, max: 20 },
                    { min: 21, max: 30 },
                    { min: 31, max: 40 },
                    { min: 41, max: 50 },
                    { min: 51, max: 60 },
                    { min: 61, max: 70 },
                    { min: 71, max: 80 },
                    { min: 81, max: 90 },
                    { min: 91, max: 100 },
                    { min: 101, max: 200 },
                    { min: 201, max: 300 },
                    { min: 301, max: 400 },
                    { min: 401, max: 500 },
                    { min: 501, max: 9999 }
                ];

                if (currentBracket < brackets.length) {
                    // Advance to next bracket
                    $gameVariables.setValue(gauntletBracketVarId, currentBracket + 1);
                    const nextBracket = brackets[currentBracket];
                    window.skipLocalization = true;
                    const useTranslation = ConfigManager.language === 'it'

                    // Show message
                    $gameMessage.add(useTranslation ? "Congratulazioni! Sei avanzato al prossimo girone" : "Congratulations! You've advanced to the next level bracket!");
                    $gameMessage.add(`Level ${nextBracket.min}-${nextBracket.max === 9999 ? "+" : nextBracket.max}`);
                    window.skipLocalization = false;

                }
            }

            // Start the next battle after a short delay
            this.startGauntletBattle();

        },

        // End the gauntlet
        endGauntlet() {
            const useTranslation = ConfigManager.language === 'it'

            // Reset gauntlet wins
            $gameVariables.setValue(gauntletWinsVarId, 0);
            window.skipLocalization = true;
            $gameMessage.add(useTranslation ? "Il gauntlet è finito" : "Gauntlet has ended.");
            window.skipLocalization = false;
        }
    };
    ArenaBattleHandler.endGauntlet = function () {
        // Reset gauntlet wins
        $gameVariables.setValue(gauntletWinsVarId, 0);
        const useTranslation = ConfigManager.language === 'it'
        window.skipLocalization = true;

        $gameMessage.add(useTranslation ? "Il gauntlet è finito" : "Gauntlet has ended.");
        window.skipLocalization = false;

        // Ensure we're back to the map scene
        if (SceneManager._scene && !(SceneManager._scene instanceof Scene_Map)) {
            // Only request scene change if we're not already in a scene transition
            if (!SceneManager.isSceneChanging()) {
                SceneManager.goto(Scene_Map);
            }
        }
    };
    //=============================================================================
    // BattleManager Extensions for Gauntlet Mode
    //=============================================================================

    // Add a flag to track gauntlet mode
    let _gauntletMode = false;

    BattleManager.setGauntletMode = function (enabled) {
        _gauntletMode = enabled;
    };

    BattleManager.isGauntletMode = function () {
        return _gauntletMode;
    };

    // Override processVictory to handle gauntlet mode
    const _BattleManager_processVictory = BattleManager.processVictory;
    BattleManager.processVictory = function () {
        if (this.isGauntletMode()) {
            this.playVictoryMe();
            this.replayBgmAndBgs();
            this.makeRewards();
            this.gainRewards();
            this.endBattle(0);
            ArenaBattleHandler.processGauntletVictory();
        } else {
            // Original code for normal battles
            const result = _BattleManager_processVictory.call(this);
            const wins = $gameVariables.value(arenaWinsVarId);
            $gameVariables.setValue(arenaWinsVarId, wins + 1);
            return result;
        }
    };

    // Override processDefeat to handle gauntlet mode
    const _BattleManager_processDefeat = BattleManager.processDefeat;
    BattleManager.processDefeat = function () {
        if (this.isGauntletMode()) {
            this.playDefeatMe();
            this.replayBgmAndBgs();
            this.endBattle(2);
            _gauntletMode = false; // Disable gauntlet mode on defeat
            ArenaBattleHandler.endGauntlet();
        } else {
            return _BattleManager_processDefeat.call(this);
        }
    };

    // Override processAbort to handle gauntlet mode
    const _BattleManager_processAbort = BattleManager.processAbort;
    BattleManager.processAbort = function () {
        if (this.isGauntletMode()) {
            this.replayBgmAndBgs();
            this.endBattle(1);
            _gauntletMode = false; // Disable gauntlet mode on abort
            ArenaBattleHandler.endGauntlet();
        } else {
            return _BattleManager_processAbort.call(this);
        }
    };

    //=============================================================================
    // Enemy Troop List Scene
    //=============================================================================

    function Scene_EnemyTroopList() {
        this.initialize(...arguments);
    }

    Scene_EnemyTroopList.prototype = Object.create(Scene_MenuBase.prototype);
    Scene_EnemyTroopList.prototype.constructor = Scene_EnemyTroopList;

    Scene_EnemyTroopList.prototype.initialize = function () {
        Scene_MenuBase.prototype.initialize.call(this);
    };

    Scene_EnemyTroopList.prototype.create = function () {
        Scene_MenuBase.prototype.create.call(this);
        this.createTroopListWindow();
        this.createEnemyDetailWindow();
    };

    Scene_EnemyTroopList.prototype.createTroopListWindow = function () {
        const rect = this.troopListWindowRect();
        this._troopListWindow = new Window_TroopList(rect);
        this._troopListWindow.setHandler("ok", this.onTroopOk.bind(this));
        this._troopListWindow.setHandler("cancel", this.popScene.bind(this));
        this.addWindow(this._troopListWindow);
    };

    Scene_EnemyTroopList.prototype.createEnemyDetailWindow = function () {
        const rect = this.enemyDetailWindowRect();
        this._enemyDetailWindow = new Window_EnemyDetail(rect);
        this.addWindow(this._enemyDetailWindow);
        this._troopListWindow.setDetailWindow(this._enemyDetailWindow);
    };

    Scene_EnemyTroopList.prototype.troopListWindowRect = function () {
        const ww = Graphics.boxWidth / 2;
        const wh = Graphics.boxHeight - this.calcWindowHeight(2, true);
        const wx = 0;
        const wy = this.calcWindowHeight(2, true);
        return new Rectangle(wx, wy, ww, wh);
    };

    Scene_EnemyTroopList.prototype.enemyDetailWindowRect = function () {
        const x = Graphics.boxWidth / 2;
        const y = this.calcWindowHeight(2, true);
        const w = Graphics.boxWidth / 2;
        const h = Graphics.boxHeight - y;
        return new Rectangle(x, y, w, h);
    };

    Scene_EnemyTroopList.prototype.onTroopOk = function () {
        const troopId = this._troopListWindow.currentTroopId();
        if (troopId) {
            ArenaBattleHandler.startArenaBattle(troopId);
        }
    };

    //=============================================================================
    // Gauntlet Select Scene
    //=============================================================================

    function Scene_GauntletSelect() {
        this.initialize(...arguments);
    }

    Scene_GauntletSelect.prototype = Object.create(Scene_MenuBase.prototype);
    Scene_GauntletSelect.prototype.constructor = Scene_GauntletSelect;

    Scene_GauntletSelect.prototype.initialize = function () {
        Scene_MenuBase.prototype.initialize.call(this);
    };

    Scene_GauntletSelect.prototype.create = function () {
        Scene_MenuBase.prototype.create.call(this);
        this.createHelpWindow();
        this.createLevelBracketWindow();
    };

    Scene_GauntletSelect.prototype.createHelpWindow = function () {
        const rect = this.helpWindowRect();
        const useTranslation = ConfigManager.language === 'it'

        this._helpWindow = new Window_Help(rect);
        this._helpWindow.setText(useTranslation ? "Seleziona un girone per la Modalità Gauntlet" : "Select a level bracket for the Gauntlet Mode.");
        this.addWindow(this._helpWindow);
    };

    Scene_GauntletSelect.prototype.createLevelBracketWindow = function () {
        const rect = this.levelBracketWindowRect();
        this._bracketWindow = new Window_GauntletLevelBracket(rect);
        this._bracketWindow.setHandler("ok", this.onBracketOk.bind(this));
        this._bracketWindow.setHandler("cancel", this.popScene.bind(this));
        this._bracketWindow.setHelpWindow(this._helpWindow);
        this.addWindow(this._bracketWindow);
    };

    Scene_GauntletSelect.prototype.helpWindowRect = function () {
        const wx = 0;
        const wy = 0;
        const ww = Graphics.boxWidth;
        const wh = this.calcWindowHeight(2, false);
        return new Rectangle(wx, wy, ww, wh);
    };

    Scene_GauntletSelect.prototype.levelBracketWindowRect = function () {
        const wx = 0;
        const wy = this.calcWindowHeight(2, false);
        const ww = Graphics.boxWidth;
        const wh = Graphics.boxHeight - wy;
        return new Rectangle(wx, wy, ww, wh);
    };

    Scene_GauntletSelect.prototype.onBracketOk = function () {
        const bracketIndex = this._bracketWindow.index() + 1; // 1-based index
        $gameVariables.setValue(gauntletBracketVarId, bracketIndex);
        $gameVariables.setValue(gauntletWinsVarId, 0); // Reset gauntlet wins

        // Start gauntlet
        this.popScene();
        ArenaBattleHandler.startGauntletBattle();
    };

    //=============================================================================
    // Window_GauntletLevelBracket
    //=============================================================================

    function Window_GauntletLevelBracket() {
        this.initialize(...arguments);
    }

    Window_GauntletLevelBracket.prototype = Object.create(Window_Selectable.prototype);
    Window_GauntletLevelBracket.prototype.constructor = Window_GauntletLevelBracket;

    Window_GauntletLevelBracket.prototype.initialize = function (rect) {
        Window_Selectable.prototype.initialize.call(this, rect);
        this._brackets = this.createLevelBrackets();
        this.refresh();
        this.activate();
        this.select(0);
    };

    Window_GauntletLevelBracket.prototype.createLevelBrackets = function () {
        const brackets = [];
        const useTranslation = ConfigManager.language === 'it'
        const levelTranslation = useTranslation ? "Livello " : "Level "

        // Define brackets from level 1 up to 500+
        brackets.push({ min: 1, max: 10, text: levelTranslation + '1-10' });
        brackets.push({ min: 11, max: 20, text: levelTranslation + '11-20' });
        brackets.push({ min: 21, max: 30, text: levelTranslation + '21-30' });
        brackets.push({ min: 31, max: 40, text: levelTranslation + '31-40' });
        brackets.push({ min: 41, max: 50, text: levelTranslation + '41-50' });
        brackets.push({ min: 51, max: 60, text: levelTranslation + '51-60' });
        brackets.push({ min: 61, max: 70, text: levelTranslation + '61-70' });
        brackets.push({ min: 71, max: 80, text: levelTranslation + '71-80' });
        brackets.push({ min: 81, max: 90, text: levelTranslation + '81-90' });
        brackets.push({ min: 91, max: 100, text: levelTranslation + '91-100' });
        brackets.push({ min: 101, max: 200, text: levelTranslation + '101-200' });
        brackets.push({ min: 201, max: 300, text: levelTranslation + '201-300' });
        brackets.push({ min: 301, max: 400, text: levelTranslation + '301-400' });
        brackets.push({ min: 401, max: 500, text: levelTranslation + '401-500' });
        brackets.push({ min: 501, max: 9999, text: levelTranslation + '500' });

        return brackets;
    };

    Window_GauntletLevelBracket.prototype.maxItems = function () {
        return this._brackets.length;
    };

    Window_GauntletLevelBracket.prototype.drawItem = function (index) {
        const bracket = this._brackets[index];
        if (bracket) {
            const rect = this.itemLineRect(index);
            this.resetTextColor();
            this.drawText(bracket.text, rect.x, rect.y, rect.width);
        }
    };

    Window_GauntletLevelBracket.prototype.updateHelp = function () {
        const bracket = this._brackets[this.index()];
        const useTranslation = ConfigManager.language === 'it'

        if (bracket) {
            let enemyCount = 0;
            for (let i = 1; i < $dataTroops.length; i++) {
                const troop = $dataTroops[i];
                if (troop && troop.members.length === 1) {
                    const enemyId = troop.members[0].enemyId;
                    const enemy = $dataEnemies[enemyId];
                    if (enemy) {
                        const { level } = ArenaBattleHandler.parseEnemyNotes(enemy);
                        const enemyLevel = Number(level) || 0;
                        if (enemyLevel >= bracket.min && enemyLevel <= bracket.max) {
                            enemyCount++;
                        }
                    }
                }
            }

            this._helpWindow.setText(
                useTranslation ? `${bracket.text}: ${enemyCount} nemici disponibili.\n` : `${bracket.text}: ${enemyCount} enemies available.\n` +
                    useTranslation ? "Vinci 7 battaglie per passare al girone successivo. Game over se perdi!" :
                    "Win 7 battles to advance to the next bracket. Game over if you lose!"
            );
        }
    };

    //=============================================================================
    // Window_TroopList
    //=============================================================================

    function Window_TroopList() {
        this.initialize(...arguments);
    }

    Window_TroopList.prototype = Object.create(Window_Selectable.prototype);
    Window_TroopList.prototype.constructor = Window_TroopList;

    Window_TroopList.prototype.initialize = function (rect) {
        Window_Selectable.prototype.initialize.call(this, rect);
        this._data = [];
        this.refresh();
        this.activate();
        this.select(0);
    };

    Window_TroopList.prototype.maxItems = function () {
        return this._data.length;
    };

    Window_TroopList.prototype.item = function () {
        return this._data && this.index() >= 0 ? this._data[this.index()] : null;
    };

    Window_TroopList.prototype.currentTroopId = function () {
        const item = this.item();
        return item ? item.id : 0;
    };

    Window_TroopList.prototype.setDetailWindow = function (detailWindow) {
        this._detailWindow = detailWindow;
        this.updateDetail();
    };

    Window_TroopList.prototype.update = function () {
        Window_Selectable.prototype.update.call(this);
        this.updateDetail();
    };

    Window_TroopList.prototype.updateDetail = function () {
        if (this._detailWindow) {
            const item = this.item();
            this._detailWindow.setTroop(item);
        }
    };

    Window_TroopList.prototype.refresh = function () {
        this.makeItemList();
        this.createContents();
        this.drawAllItems();
    };

    Window_TroopList.prototype.makeItemList = function () {
        this._data = [];
        // Filter troops that contain exactly one enemy
        for (let i = 1; i < $dataTroops.length; i++) {
            const troop = $dataTroops[i];
            if (troop && troop.members.length === 1) {
                const enemyId = troop.members[0].enemyId;
                const enemy = $dataEnemies[enemyId];
                if (enemy) {
                    // Get level from enemy notes
                    const { level } = ArenaBattleHandler.parseEnemyNotes(enemy);
                    this._data.push({
                        id: troop.id,
                        name: troop.name || `Enemy ${enemyId}`,
                        enemyId: enemyId,
                        level: level
                    });
                }
            }
        }
        // Sort by level
        this._data.sort((a, b) => {
            return Number(a.level) - Number(b.level);
        });
    };

    Window_TroopList.prototype.drawItem = function (index) {
        const item = this._data[index];
        if (item) {
            const rect = this.itemLineRect(index);
            this.resetTextColor();
            this.drawText(`Lv. ${item.level} - ${item.name}`, rect.x, rect.y, rect.width);
        }
    };

    //=============================================================================
    // Window_EnemyDetail
    //=============================================================================

    function Window_EnemyDetail() {
        this.initialize(...arguments);
    }

    Window_EnemyDetail.prototype = Object.create(Window_Base.prototype);
    Window_EnemyDetail.prototype.constructor = Window_EnemyDetail;

    Window_EnemyDetail.prototype.initialize = function (rect) {
        Window_Base.prototype.initialize.call(this, rect);
        this._troop = null;
        this._enemy = null;
        this.refresh();
    };

    Window_EnemyDetail.prototype.setTroop = function (troop) {
        if (this._troop !== troop) {
            this._troop = troop;
            if (troop) {
                this._enemy = $dataEnemies[troop.enemyId];
            } else {
                this._enemy = null;
            }
            this.refresh();
        }
    };
    // Fix for Scene_EnemyTroopList
    Scene_EnemyTroopList.prototype.popScene = function () {
        // Ensure we properly return to the previous scene
        SceneManager.pop();
    };
    // Fix for BattleManager's end condition handling
    const _BattleManager_endBattle = BattleManager.endBattle;
    BattleManager.endBattle = function (result) {
        // Store the current gauntlet mode state before ending the battle
        const wasGauntletMode = this.isGauntletMode();

        // Call the original method
        _BattleManager_endBattle.call(this, result);

        // Only reset the gauntlet mode if we're not continuing the gauntlet
        if (wasGauntletMode && result !== 0) {
            _gauntletMode = false;
        }
    };
    // Ensure proper scene flow after battle in gauntlet mode
    const _Scene_Battle_terminate = Scene_Battle.prototype.terminate;
    Scene_Battle.prototype.terminate = function () {
        _Scene_Battle_terminate.call(this);

        // This ensures that if we're coming back from a gauntlet battle that was aborted/lost,
        // we properly clean up and go back to the map scene
        if (!BattleManager.isGauntletMode() && _gauntletMode) {
            _gauntletMode = false;
        }
    };

    Window_EnemyDetail.prototype.refresh = function () {
        this.contents.clear();
        const useTranslation = ConfigManager.language === 'it'

        if (!this._enemy) {
            return;
        }

        const enemy = this._enemy;
        const lineHeight = this.lineHeight();
        let y = 0;
        const { level, description } = ArenaBattleHandler.parseEnemyNotes(enemy);
        const levelName = useTranslation ? "Livello" : "Level"

        // Draw enemy name and level
        this.resetTextColor();
        this.drawText(`${window.translateText(enemy.name)} - ${levelName} ${level}`, 0, y, this.contentsWidth(), 'center');
        y += lineHeight + 10;

        // Draw stats
        this.contents.fontSize = this.contents.fontSize - 4;
        this.drawText("Stats:", 0, y, 120);
        y += lineHeight;

        const params = [
            [useTranslation ? "HP" : "HP", enemy.params[0]],
            [useTranslation ? "HP" : "MP", enemy.params[1]],
            [useTranslation ? "ATK" : "ATT", enemy.params[2]],
            [useTranslation ? "COS" : "CON", enemy.params[3]],
            [useTranslation ? "INT" : "INT", enemy.params[4]],
            [useTranslation ? "SAG" : "WIS", enemy.params[5]],
            [useTranslation ? "DES" : "DEX", enemy.params[6]],
            [useTranslation ? "PSI" : "PSI", enemy.params[7]]
        ];

        // Display two stats per row
        const colWidth = this.contentsWidth() / 2 - 10;
        for (let i = 0; i < params.length; i += 2) {
            // First stat in row
            this.drawText(params[i][0], 10, y, 80);
            this.drawText(params[i][1].toString(), 90, y, 60, 'right');

            // Second stat in row (if available)
            if (i + 1 < params.length) {
                this.drawText(params[i + 1][0], colWidth + 20, y, 80);
                this.drawText(params[i + 1][1].toString(), colWidth + 100, y, 60, 'right');
            }

            y += lineHeight - 2;
        }

        // Draw exp and gold side by side
        y += 10;
        this.drawText(useTranslation ? "Ricompense:" : "Rewards:", 0, y, 120);
        y += lineHeight;

        // Place EXP and Gold side by side
        const halfWidth = this.contentsWidth() / 2 - 10;
        this.drawText("EXP", 10, y, 80);
        this.drawText(enemy.exp.toString(), 90, y, 60, 'right');

        this.drawText("€", halfWidth + 20, y, 80);
        this.drawText(enemy.gold.toString(), halfWidth + 100, y, 60, 'right');
        y += lineHeight + 10;

        // Draw skills
        const skills = ArenaBattleHandler.getEnemySkills(enemy);
        if (skills.length > 0) {
            this.drawText(useTranslation ? "Abilità" : "Skills:", 0, y, 120);
            y += lineHeight;

            // Create comma-separated skill list with line breaks
            const skillNames = skills.map(skill => skill.name);
            const formattedSkillText = this.formatSkillList(skillNames);

            const lines = formattedSkillText.split('\n');
            for (const line of lines) {
                if (y + lineHeight > this.contentsHeight()) break;
                this.drawText(line, 10, y, this.contentsWidth() - 20);
                y += lineHeight - 2;
            }
            y += 10;
        }

        // Draw description
        if (description) {
            this.resetTextColor();
            this.drawText(useTranslation ? "Descrizione:" : "Description:", 0, y, 120);
            y += lineHeight;

            const descLines = this.splitTextWrapped(description, this.contentsWidth() - 20);
            for (const line of descLines) {
                if (y + lineHeight > this.contentsHeight()) break;
                this.drawText(line, 10, y, this.contentsWidth() - 20);
                y += lineHeight;
            }
        }

        this.contents.fontSize = $gameSystem.mainFontSize();
    };

    Window_EnemyDetail.prototype.splitTextWrapped = function (text, width) {
        const words = text.split(' ');
        const lines = [];
        let line = '';

        for (const word of words) {
            const testLine = line + (line ? ' ' : '') + word;
            if (this.textWidth(testLine) > width) {
                lines.push(line);
                line = word;
            } else {
                line = testLine;
            }
        }

        if (line) {
            lines.push(line);
        }

        return lines;
    };
    ArenaBattleHandler.processGauntletVictory = function () {
        const useTranslation = ConfigManager.language === 'it'
        const levelName = useTranslation ? "Livello" : "Level"
        // Increment gauntlet wins
        const gauntletWins = $gameVariables.value(gauntletWinsVarId) || 0;
        const newWins = gauntletWins + 1;
        $gameVariables.setValue(gauntletWinsVarId, newWins);

        // Check if player should advance to next bracket
        if (newWins % 7 === 0) {
            const currentBracket = $gameVariables.value(gauntletBracketVarId);
            const brackets = [
                { min: 1, max: 10 },
                { min: 11, max: 20 },
                { min: 21, max: 30 },
                { min: 31, max: 40 },
                { min: 41, max: 50 },
                { min: 51, max: 60 },
                { min: 61, max: 70 },
                { min: 71, max: 80 },
                { min: 81, max: 90 },
                { min: 91, max: 100 },
                { min: 101, max: 200 },
                { min: 201, max: 300 },
                { min: 301, max: 400 },
                { min: 401, max: 500 },
                { min: 501, max: 9999 }
            ];

            if (currentBracket < brackets.length) {
                // Advance to next bracket
                $gameVariables.setValue(gauntletBracketVarId, currentBracket + 1);
                const nextBracket = brackets[currentBracket];

                // Show message
                window.skipLocalization = true;
                $gameMessage.add(useTranslation ? "Congratulazioni! Sei avanzato al prossimo girone!" : "Congratulations! You've advanced to the next level bracket!");
                $gameMessage.add(`${levelName} ${nextBracket.min}-${nextBracket.max === 9999 ? "+" : nextBracket.max}`);
                window.skipLocalization = false;
            }
        }

        // Start the next battle after a short delay, using a safer approach
        // that won't interfere with scene management
        if (SceneManager._scene && SceneManager._scene.isActive()) {
            setTimeout(() => {
                if (SceneManager._scene && SceneManager._scene.isActive()) {
                    this.startGauntletBattle();
                }
            }, 500);
        }
    };
    Window_EnemyDetail.prototype.formatSkillList = function (skillNames) {
        if (!skillNames || skillNames.length === 0) return "";

        const skillsPerLine = 6; // Number of skills per line
        let result = "";

        for (let i = 0; i < skillNames.length; i++) {
            // Add the skill name
            result += skillNames[i];

            // Add separator or line break
            if (i < skillNames.length - 1) {
                // If we've reached the skills per line limit and it's not the last skill
                if ((i + 1) % skillsPerLine === 0) {
                    result += ",\n";
                } else {
                    result += ", ";
                }
            }
        }

        return result;
    };
})();
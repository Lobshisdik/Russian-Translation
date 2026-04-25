const _Scene_Battle_createAllWindows = Scene_Battle.prototype.createAllWindows;
    Scene_Battle.prototype.createAllWindows = function() {
        _Scene_Battle_createAllWindows.call(this);
        this.setupKeyboardInput();
    };
    
    Scene_Battle.prototype.setupKeyboardInput = function() {
        // Register number keys 1-5 as valid input methods
        Input.keyMapper[49] = "1"; // 1 key
        Input.keyMapper[50] = "2"; // 2 key
        Input.keyMapper[51] = "3"; // 3 key
        Input.keyMapper[52] = "4"; // 4 key
        Input.keyMapper[53] = "5"; // 5 key
    };    // Add number key handler function
    Scene_Battle.prototype.handleNumberKeys = function() {
        // Check for number keys 1-5
        for (let i = 1; i <= 5; i++) {
            if (Input.isTriggered(i.toString())) {
                this.processNumberKeyCommand(i - 1); // Convert to 0-based index
            }
        }
    };
    
    // Process the command selected by number key
    Scene_Battle.prototype.processNumberKeyCommand = function(index) {
        // In actor command window (Attack, Magic, etc.)
        if (this._actorCommandWindow.active) {
            if (index < this._actorCommandWindow.maxItems()) {
                this._actorCommandWindow.select(index);
                this._actorCommandWindow.processOk();
                SoundManager.playOk();
            }
        }
        // In skill window
        else if (this._skillWindow && this._skillWindow.active) {
            if (index < this._skillWindow.maxItems()) {
                this._skillWindow.select(index);
                this._skillWindow.processOk();
                SoundManager.playOk();
            }
        }
        // In item window
        else if (this._itemWindow && this._itemWindow.active) {
            if (index < this._itemWindow.maxItems()) {
                this._itemWindow.select(index);
                this._itemWindow.processOk();
                SoundManager.playOk();
            }
        }
        // In enemy selection window
        else if (this._enemyWindow && this._enemyWindow.active) {
            if (index < this._enemyWindow.maxItems()) {
                this._enemyWindow.select(index);
                this._enemyWindow.processOk();
                SoundManager.playOk();
            }
        }
        // In actor selection window
        else if (this._actorWindow && this._actorWindow.active) {
            if (index < this._actorWindow.maxItems()) {
                this._actorWindow.select(index);
                this._actorWindow.processOk();
                SoundManager.playOk();
            }
        }
        // In party command window
        else if (this._partyCommandWindow.active) {
            if (index < this._partyCommandWindow.maxItems()) {
                this._partyCommandWindow.select(index);
                this._partyCommandWindow.processOk();
                SoundManager.playOk();
            }
        }
    };/*:
 * @target MZ
 * @plugindesc Adds mouse and keyboard control options to battle system
 * @author Omni-Lex
 * @help Mouse Battle Controls v1.1.0
 * 
 * This plugin adds the following controls to the battle system:
 * 
 * Mouse Controls:
 * - Left click on an enemy to execute the current selected command
 * - Right click to cycle to the next command in the command window
 * - Mouse wheel to scroll through available commands
 * 
 * Keyboard Controls:
 * - Number keys 1-5 to select and execute the corresponding commands
 *   (For example, if Attack is the first command, pressing 1 will select Attack)
 * 
 * No plugin parameters are required.
 * 
 * Terms of Use:
 * Free for use in both commercial and non-commercial projects.
 */

(() => {
    'use strict';
    
    //=============================================================================
    // Mouse Input Extension
    //=============================================================================
    
    const _Scene_Battle_initialize = Scene_Battle.prototype.initialize;
    Scene_Battle.prototype.initialize = function() {
        _Scene_Battle_initialize.call(this);
        this._mouseTargetX = 0;
        this._mouseTargetY = 0;
        this._isRightMousePressed = false;
        this._lastRightMousePressed = false;
        this._clickedEnemyForSelection = null;
    };
    
    //=============================================================================
    // Handle Mouse Movement to Track Position
    //=============================================================================
    
    const _Scene_Battle_update = Scene_Battle.prototype.update;
    Scene_Battle.prototype.update = function() {
        _Scene_Battle_update.call(this);
        this.updateMousePosition();
        this.updateMouseControls();
    };
    
    Scene_Battle.prototype.updateMousePosition = function() {
        this._mouseTargetX = TouchInput.x;
        this._mouseTargetY = TouchInput.y;
    };
    
    //=============================================================================
    // Mouse Control Functions
    //=============================================================================
    
    Scene_Battle.prototype.updateMouseControls = function() {
        // Handle right mouse button to cycle commands
        
        // Handle mouse wheel for command selection
        this.handleMouseWheel();
        
        // Handle number key presses (1-5)
        this.handleNumberKeys();
        
        // Left click is already handled by TouchInput.isTriggered()
        // But we'll enhance it for targeting enemies directly
        if (TouchInput.isTriggered()) {
            this.handleLeftClick();
        }
    };
    

    
    Scene_Battle.prototype.handleMouseWheel = function() {
        if (TouchInput.wheelY !== 0) {
            if (this._actorCommandWindow.active) {
                // Move up or down in the command list
                const direction = TouchInput.wheelY > 0 ? 1 : -1;
                const maxItems = this._actorCommandWindow.maxItems();
                let index = this._actorCommandWindow.index() + direction;
                
                // Wrap around the list
                if (index < 0) index = maxItems - 1;
                if (index >= maxItems) index = 0;
                
                this._actorCommandWindow.select(index);
                SoundManager.playCursor();
            } else if (this._partyCommandWindow.active) {
                // Handle mouse wheel for party command window
                const direction = TouchInput.wheelY > 0 ? 1 : -1;
                const maxItems = this._partyCommandWindow.maxItems();
                let index = this._partyCommandWindow.index() + direction;
                
                // Wrap around the list
                if (index < 0) index = maxItems - 1;
                if (index >= maxItems) index = 0;
                
                this._partyCommandWindow.select(index);
                SoundManager.playCursor();
            }
        }
    };
    
    Scene_Battle.prototype.handleLeftClick = function() {
        console.log("## aaa")
        // If we're in the main command window and clicked on an enemy
        if (this._actorCommandWindow.active) {
            const selectedCommand = this._actorCommandWindow.currentSymbol();
            const clickedEnemy = this.getClickedEnemy();
            
            // Handle all command types that could target an enemy
            if (clickedEnemy !== null) {
                // For attack - directly process the command and select the enemy
                if (selectedCommand === 'attack') {
                    this._actorCommandWindow.processOk();
                    if (this._enemyWindow.active) {
                        const enemyIndex = $gameTroop.members().indexOf(clickedEnemy);
                        if (enemyIndex >= 0) {
                            this._enemyWindow.select(enemyIndex);
                            this._enemyWindow.processOk();
                        }
                    }
                }
                // For skills - process the command, waiting for skill selection
                else if (selectedCommand === 'skill') {
                    this._actorCommandWindow.processOk();
                    // Store clicked enemy for later use
                    this._clickedEnemyForSelection = clickedEnemy;
                }
                // For items - process the command, waiting for item selection
                else if (selectedCommand === 'item') {
                    this._actorCommandWindow.processOk();
                    // Store clicked enemy for later use
                    this._clickedEnemyForSelection = clickedEnemy;
                }
                // For guard/defend - process the command (usually doesn't need target)
                else if (selectedCommand === 'guard') {
                    this._actorCommandWindow.processOk();
                }
            }
        }
        // If we're in the skill window and have a stored enemy
        else if (this._skillWindow && this._skillWindow.active && this._clickedEnemyForSelection) {
            const skill = this._skillWindow.item();
            if (skill && skill.scope > 0 && skill.scope < 4) { // Check if skill targets enemies
                this._skillWindow.processOk();
                if (this._enemyWindow.active) {
                    const enemyIndex = $gameTroop.members().indexOf(this._clickedEnemyForSelection);
                    if (enemyIndex >= 0) {
                        this._enemyWindow.select(enemyIndex);
                        this._enemyWindow.processOk();
                        this._clickedEnemyForSelection = null;
                    }
                }
            }
        }
        // If we're in the item window and have a stored enemy
        else if (this._itemWindow && this._itemWindow.active && this._clickedEnemyForSelection) {
            const item = this._itemWindow.item();
            if (item && item.scope > 0 && item.scope < 4) { // Check if item targets enemies
                this._itemWindow.processOk();
                if (this._enemyWindow.active) {
                    const enemyIndex = $gameTroop.members().indexOf(this._clickedEnemyForSelection);
                    if (enemyIndex >= 0) {
                        this._enemyWindow.select(enemyIndex);
                        this._enemyWindow.processOk();
                        this._clickedEnemyForSelection = null;
                    }
                }
            }
        }
        // If we're directly in the enemy selection window
        else if (this._enemyWindow && this._enemyWindow.active) {
            const clickedEnemy = this.getClickedEnemy();
            if (clickedEnemy !== null) {
                const enemyIndex = $gameTroop.members().indexOf(clickedEnemy);
                if (enemyIndex >= 0) {
                    this._enemyWindow.select(enemyIndex);
                    this._enemyWindow.processOk();
                }
            }
        }
    };
    
    Scene_Battle.prototype.getClickedEnemy = function() {
        for (const enemy of $gameTroop.aliveMembers()) {
            const sprite = this._spriteset.findTargetSprite(enemy);
            if (sprite && this.isMouseOverSprite(sprite)) {
                return enemy;
            }
        }
        return null;
    };
    
    Scene_Battle.prototype.isMouseOverSprite = function(sprite) {
        const x = this._mouseTargetX;
        const y = this._mouseTargetY;
        const rect = new Rectangle(
            sprite.x - sprite.width / 2,
            sprite.y - sprite.height,
            sprite.width,
            sprite.height
        );
        return rect.contains(x, y);
    };
    
    //=============================================================================
    // Add method to Spriteset_Battle to find a specific battler sprite
    //=============================================================================
    
    Spriteset_Battle.prototype.findTargetSprite = function(battler) {
        if (battler.isActor()) {
            return this.actorSprite(battler);
        } else {
            return this.enemySprite(battler);
        }
    };
    
    Spriteset_Battle.prototype.enemySprite = function(enemy) {
        for (const sprite of this._enemySprites) {
            if (sprite._battler === enemy) {
                return sprite;
            }
        }
        return null;
    };
    
    Spriteset_Battle.prototype.actorSprite = function(actor) {
        if (this._actorSprites) {
            for (const sprite of this._actorSprites) {
                if (sprite._battler === actor) {
                    return sprite;
                }
            }
        }
        return null;
    };
    
})();
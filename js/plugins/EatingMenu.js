//=============================================================================
// EatingMenu.js
//=============================================================================

/*:
 * @target MZ
 * @plugindesc [v1.0.0] Eating Menu
 * @author Omni-Lex
 * @version 1.0.0
 * @description 1.0.0 A menu that allows assigning food items to party members
 * 
 * @help EatingMenu.js
 * 
 * This plugin creates an eating menu that shows all usable items with
 * <category:Food> in your inventory. You can select items equal to the
 * number of party members and assign them in sequence.
 * 
 * Usage:
 * 1. Add <category:Food> to item notes for food items
 * 2. Call the eating menu with: SceneManager.push(Scene_EatingMenu)
 * 
 * Plugin Commands:
 * None
 * 
 * @param menuCommand
 * @text Add to Menu
 * @desc Add eating menu to the main menu?
 * @type boolean
 * @default true
 * 
 * @param commandName
 * @text Command Name
 * @desc Name displayed in the menu
 * @type string
 * @default Eating
 * 
 */

(() => {
    'use strict';
    
    const pluginName = 'EatingMenu';
    const parameters = PluginManager.parameters(pluginName);
    const addToMenu = parameters['menuCommand'] === 'true';
    const commandName = parameters['commandName'] || 'Eating';

    //=============================================================================
    // Scene_EatingMenu
    //=============================================================================

    function Scene_EatingMenu() {
        this.initialize(...arguments);
    }

    Scene_EatingMenu.prototype = Object.create(Scene_MenuBase.prototype);
    Scene_EatingMenu.prototype.constructor = Scene_EatingMenu;

    Scene_EatingMenu.prototype.initialize = function() {
        Scene_MenuBase.prototype.initialize.call(this);
        this._selectedItems = [];
        this._currentMemberIndex = 0;
    };

    Scene_EatingMenu.prototype.create = function() {
        Scene_MenuBase.prototype.create.call(this);
        this.createHelpWindow();
        this.createFoodItemWindow();
        this.createPartyWindow();
        this.createConfirmWindow();
        this.updateHelp();
    };

    Scene_EatingMenu.prototype.createHelpWindow = function() {
        const rect = this.helpWindowRect();
        this._helpWindow = new Window_Help(rect);
        this.addWindow(this._helpWindow);
    };

    Scene_EatingMenu.prototype.createFoodItemWindow = function() {
        const rect = this.foodItemWindowRect();
        this._foodItemWindow = new Window_FoodItemList(rect);
        this._foodItemWindow.setHelpWindow(this._helpWindow);
        this._foodItemWindow.setHandler('ok', this.onItemOk.bind(this));
        this._foodItemWindow.setHandler('cancel', this.onItemCancel.bind(this));
        this.addWindow(this._foodItemWindow);
    };

    Scene_EatingMenu.prototype.createPartyWindow = function() {
        const rect = this.partyWindowRect();
        this._partyWindow = new Window_EatingParty(rect);
        this.addWindow(this._partyWindow);
    };

    Scene_EatingMenu.prototype.createConfirmWindow = function() {
        const rect = this.confirmWindowRect();
        this._confirmWindow = new Window_EatingConfirm(rect);
        this._confirmWindow.setHandler('confirm', this.onConfirm.bind(this));
        this._confirmWindow.setHandler('cancel', this.onConfirmCancel.bind(this));
        this.addWindow(this._confirmWindow);
    };

    Scene_EatingMenu.prototype.helpWindowRect = function() {
        const wx = 0;
        const wy = this.mainAreaTop();
        const ww = Graphics.boxWidth;
        const wh = this.calcWindowHeight(2, false);
        return new Rectangle(wx, wy, ww, wh);
    };

    Scene_EatingMenu.prototype.foodItemWindowRect = function() {
        const wx = 0;
        const wy = this._helpWindow.y + this._helpWindow.height;
        const ww = Graphics.boxWidth * 2 / 3;
        const wh = Graphics.boxHeight - wy - this.calcWindowHeight(2, false);
        return new Rectangle(wx, wy, ww, wh);
    };

    Scene_EatingMenu.prototype.partyWindowRect = function() {
        const wx = this._foodItemWindow.width;
        const wy = this._helpWindow.y + this._helpWindow.height;
        const ww = Graphics.boxWidth - wx;
        const wh = Graphics.boxHeight - wy - this.calcWindowHeight(2, false);
        return new Rectangle(wx, wy, ww, wh);
    };

    Scene_EatingMenu.prototype.confirmWindowRect = function() {
        const wx = 0;
        const wy = Graphics.boxHeight - this.calcWindowHeight(2, false);
        const ww = Graphics.boxWidth;
        const wh = this.calcWindowHeight(2, false);
        return new Rectangle(wx, wy, ww, wh);
    };

    Scene_EatingMenu.prototype.updateHelp = function() {
        const partySize = $gameParty.allMembers().length;
        const selected = this._selectedItems.length;
        this._helpWindow.setText(
            `Select food for party members (${selected}/${partySize})\n` +
            `Current: ${this._currentMemberIndex < partySize ? $gameParty.allMembers()[this._currentMemberIndex].name() : 'All selected'}`
        );
    };

    Scene_EatingMenu.prototype.onItemOk = function() {
        const item = this._foodItemWindow.item();
        if (item && this._selectedItems.length < $gameParty.allMembers().length) {
            this._selectedItems.push(item);
            this._currentMemberIndex++;
            this._partyWindow.setSelectedItems(this._selectedItems);
            this._partyWindow.refresh();
            this.updateHelp();
            
            if (this._selectedItems.length >= $gameParty.allMembers().length) {
                this._confirmWindow.activate();
                this._confirmWindow.select(0);
                this._foodItemWindow.deactivate();
            } else {
                this._foodItemWindow.activate();
            }
        }
    };

    Scene_EatingMenu.prototype.onItemCancel = function() {
        if (this._selectedItems.length > 0) {
            this._selectedItems.pop();
            this._currentMemberIndex--;
            this._partyWindow.setSelectedItems(this._selectedItems);
            this._partyWindow.refresh();
            this.updateHelp();
        } else {
            this.popScene();
        }
    };

    Scene_EatingMenu.prototype.onConfirm = function() {
        // Use items on party members
        const party = $gameParty.allMembers();
        for (let i = 0; i < this._selectedItems.length && i < party.length; i++) {
            const item = this._selectedItems[i];
            const actor = party[i];
            
            // Remove item from inventory
            $gameParty.loseItem(item, 1);
            
            // Use item effect on actor
            const action = new Game_Action(actor);
            action.setItem(item);
            action.apply(actor);
            
            // Show animation/effect
            if (item.animationId > 0) {
                $gameTemp.requestAnimation([actor], item.animationId);
            }
        }
        
        // Play sound effect
        SoundManager.playUseItem();
        
        // Close scene
        this.popScene();
    };

    Scene_EatingMenu.prototype.onConfirmCancel = function() {
        this._confirmWindow.deactivate();
        this._foodItemWindow.activate();
    };

    //=============================================================================
    // Window_FoodItemList
    //=============================================================================

    function Window_FoodItemList() {
        this.initialize(...arguments);
    }

    Window_FoodItemList.prototype = Object.create(Window_ItemList.prototype);
    Window_FoodItemList.prototype.constructor = Window_FoodItemList;

    Window_FoodItemList.prototype.makeItemList = function() {
        this._data = $gameParty.allItems().filter(item => {
            return DataManager.isItem(item) && 
                   this.includes(item) && 
                   item.meta.category === 'Food';
        });
    };

    Window_FoodItemList.prototype.includes = function(item) {
        return item.itypeId === 1; // Usable items only
    };

    Window_FoodItemList.prototype.isEnabled = function(item) {
        return $gameParty.canUse(item) && $gameParty.numItems(item) > 0;
    };

    Window_FoodItemList.prototype.maxCols = function() {
        return 3;
    };

    //=============================================================================
    // Window_EatingParty
    //=============================================================================

    function Window_EatingParty() {
        this.initialize(...arguments);
    }

    Window_EatingParty.prototype = Object.create(Window_StatusBase.prototype);
    Window_EatingParty.prototype.constructor = Window_EatingParty;

    Window_EatingParty.prototype.initialize = function(rect) {
        Window_StatusBase.prototype.initialize.call(this, rect);
        this._selectedItems = [];
        this.refresh();
    };

    Window_EatingParty.prototype.setSelectedItems = function(items) {
        this._selectedItems = items;
    };

    Window_EatingParty.prototype.refresh = function() {
        this.contents.clear();
        const party = $gameParty.allMembers();
        
        for (let i = 0; i < party.length; i++) {
            const actor = party[i];
            const y = i * this.lineHeight();
            
            // Draw actor name
            this.drawText(actor.name(), 0, y, 120);
            
            // Draw assigned food item
            if (this._selectedItems[i]) {
                const item = this._selectedItems[i];
                const iconIndex = item.iconIndex;
                const x = 130;
                
                this.drawIcon(iconIndex, x, y);
                this.drawText(item.name, x + 32, y, this.width - x - 32);
            } else {
                this.drawText('---', 130, y, 100);
            }
        }
    };

    //=============================================================================
    // Window_EatingConfirm
    //=============================================================================

    function Window_EatingConfirm() {
        this.initialize(...arguments);
    }

    Window_EatingConfirm.prototype = Object.create(Window_Command.prototype);
    Window_EatingConfirm.prototype.constructor = Window_EatingConfirm;

    Window_EatingConfirm.prototype.makeCommandList = function() {
        this.addCommand('Confirm', 'confirm');
        this.addCommand('Cancel', 'cancel');
    };

    Window_EatingConfirm.prototype.maxCols = function() {
        return 2;
    };

    //=============================================================================
    // Add to Menu
    //=============================================================================

    if (addToMenu) {
        const _Window_MenuCommand_addOriginalCommands = Window_MenuCommand.prototype.addOriginalCommands;
        Window_MenuCommand.prototype.addOriginalCommands = function() {
            _Window_MenuCommand_addOriginalCommands.call(this);
            this.addCommand(commandName, 'eating', true);
        };

        const _Scene_Menu_createCommandWindow = Scene_Menu.prototype.createCommandWindow;
        Scene_Menu.prototype.createCommandWindow = function() {
            _Scene_Menu_createCommandWindow.call(this);
            this._commandWindow.setHandler('eating', this.commandEating.bind(this));
        };

        Scene_Menu.prototype.commandEating = function() {
            SceneManager.push(Scene_EatingMenu);
        };
    }

    //=============================================================================
    // Global Access
    //=============================================================================

    window.Scene_EatingMenu = Scene_EatingMenu;

})();
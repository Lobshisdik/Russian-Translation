/*:
 * @target MZ
 * @plugindesc Custom 3x3 grid main menu with character-based commands, icons, and no status window [Claude+GPT].
 * @author Omni-Lex
 *
 * @help
 * This plugin:
 * - Merges two previous plugins: CustomMainMenuLayout and VoiceMenuCommand
 * - Hides the status window
 * - Arranges the menu commands in a 3x3 grid with icons
 * - Replaces default menu commands with character-specific entries and common events
 */

(function() {
    const ICONS = {
        status1: 193,      // Replace with actual icon index for character 1
        status2: 193,      // Replace with actual icon index for character 2
        status3: 193,      // Replace with actual icon index for character 2

        item: 209,        // Backpack
        skill: 191,        // Skills
        equip: 399,       // Equip
        survival: 124,     // Camp
        fusion: 111,       // Fusion
        save: 231,        // Save
        options: 83       // Options
    };

    const _Scene_Menu_create = Scene_Menu.prototype.create;
    Scene_Menu.prototype.create = function() {
        _Scene_Menu_create.call(this);
        this._statusWindow.visible = false;
        this._commandWindow.x = 0;
        this._commandWindow.y = 0; // Align to very top
        this._commandWindow.width = Graphics.boxWidth;
        this._commandWindow.height = Graphics.boxHeight; // Use full height

        // Hide cancel button
        if (this._cancelButton) {
            this._cancelButton.visible = false;
        }
    };

    Scene_Menu.prototype.commandWindowRect = function() {
        const ww = Graphics.boxWidth;
        const wh = this.mainAreaHeight();
        const wx = 0;
        const wy = this.mainAreaTop();
        return new Rectangle(wx, wy, ww, wh);
    };

    Scene_Menu.prototype.needsPageButtons = function() {
        return false;
    };

    const _Window_MenuCommand_maxCols = Window_MenuCommand.prototype.maxCols;
    Window_MenuCommand.prototype.maxCols = function() {
        return 2;
    };

    Window_MenuCommand.prototype.addMainCommands = function() {


        this.addCommand("Backpack", "item", true, ICONS.item);
        this.addCommand("Skills", "skill", true, ICONS.skill);
        this.addCommand("Equip", "equip", true, ICONS.equip);
        //this.addCommand("Camp", "survival", true, ICONS.survival);
        const c1 = $gameParty.members()[0];
        const c2 = $gameParty.members()[1];
        const c3 = $gameParty.members()[2];

        if (c1) {
            this.addCommand("Status", "status1", true, ICONS.status1);
        }
        /*
        if (c2) {
            this.addCommand(c2.name() + "", "status2", true, ICONS.status2);
        }
        if (c3) {
            this.addCommand(c3.name() + "", "status3", true, ICONS.status3);
        }*/
    };

    Window_MenuCommand.prototype.addSaveCommand = function() {
        if (this.needsCommand("save")) {
            const enabled = this.isSaveEnabled();
            this.addCommand(TextManager.save, "save", enabled, ICONS.save);
        }
    };

    const _Scene_Menu_createCommandWindow = Scene_Menu.prototype.createCommandWindow;
    Scene_Menu.prototype.createCommandWindow = function() {
        _Scene_Menu_createCommandWindow.call(this);

        this._commandWindow.setHandler("status1", this.commandStatus1.bind(this));
        this._commandWindow.setHandler("status2", this.commandStatus2.bind(this));
        this._commandWindow.setHandler("status3", this.commandStatus3.bind(this));
        this._commandWindow.setHandler("item", this.commandItem.bind(this));
        this._commandWindow.setHandler("skill", this.commandPersonal.bind(this));
        this._commandWindow.setHandler("equip", this.commandPersonal.bind(this));
        this._commandWindow.setHandler("survival", this.commandSurvival.bind(this));
        this._commandWindow.setHandler("fusion", this.commandFusion.bind(this));
        this._commandWindow.setHandler("save", this.commandSave.bind(this));
        
    };

    Scene_Menu.prototype.commandStatus1 = function() {
        const c = $gameParty.members()[0];
        if (c) $gameParty.setMenuActor(c);
        SceneManager.push(Scene_Status);
    };

    Scene_Menu.prototype.commandStatus2 = function() {
        const c = $gameParty.members()[1];
        if (c) $gameParty.setMenuActor(c);
        SceneManager.push(Scene_Status);
    };
    
    Scene_Menu.prototype.commandStatus3 = function() {
        const c = $gameParty.members()[2];
        if (c) $gameParty.setMenuActor(c);
        SceneManager.push(Scene_Status);
    };

    Scene_Menu.prototype.commandSurvival = function() {
        $gameTemp.reserveCommonEvent(12);
        this.popScene();
    };

    Scene_Menu.prototype.commandFusion = function() {
        $gameTemp.reserveCommonEvent(15);
        this.popScene();
    };

    const _Window_MenuCommand_drawItem = Window_MenuCommand.prototype.drawItem;
    Window_MenuCommand.prototype.drawItem = function(index) {
        const rect = this.itemLineRect(index);
        const align = this.itemTextAlign();
        const iconIndex = this._list[index].ext;
        const text = this.commandName(index);

        this.resetTextColor();
        this.changePaintOpacity(this.isCommandEnabled(index));
        if (iconIndex >= 0) {
            this.drawIcon(iconIndex, rect.x, rect.y + 2);
            this.drawText(text, rect.x + 36, rect.y, rect.width - 36, align);
        } else {
            _Window_MenuCommand_drawItem.call(this, index);
        }
    };
})();
/*:
 * @target MZ
 * @plugindesc Character Switch Equip Menu v1.6.0
 * @author Omni-Lex
 * @version 1.6.0
 * @description v1.6.0 All party members save stats to variables (Player 1: 121-124, Player 2: 125-128, Player 3: 129-132)
 * @url https://nocoldiz.itch.io/hypernet-explorer
 * @help CharacterSwitchEquip.js
 * 
 * This plugin allows you to switch between party members in the equip screen
 * by pressing the Up and Down arrow keys or using the Switch button.
 * 
 * Features:
 * - Press Up to switch to previous character
 * - Press Down to switch to next character
 * - Click Switch button to cycle through characters
 * - Narrower left status panel for better layout
 * - Cycles through all party members
 * - Maintains current window selection when switching
 * - Dynamic custom stats based on equipped armor AND weapon types
 * - Weapon scaling display based on attack skills (Italian/English)
 * - Dual weapon scaling support
 * 
 * Armor Type Stats:
 * - Clothes (Type 1): Substance 100%, Stealth 100%
 * - Robe (Type 2): Arcane 100%
 * - Light Armor (Type 3): Stealth 100%
 * - Heavy Armor (Type 4): Intimidation 100%
 * - Equipment (Type 5) and Shield (Type 6): No stat influence
 * 
 * Weapon Type Stats:
 * - Dagger (Type 1): Stealth 100%
 * - Sword (Type 2): Intimidation 100%
 * - Heavy (Type 3): Intimidation 100%
 * - Axe (Type 4): Intimidation 100%
 * - Whip (Type 5): Substance 100%
 * - Staff (Type 6): Arcane 100%
 * - Bow (Type 7): Stealth 100%
 * - Projectile (Type 8): Substance 100%
 * - Gun (Type 9): Substance 100%
 * - Claw (Type 10): Intimidation 100%
 * 
 * Weapon Scaling (shown when weapon slot selected):
 * - No attack skill: STR scaling
 * - Attack skill 840: DEX scaling
 * - Attack skill 841: MIX scaling
 * - Attack skill 842: PSI scaling
 * - Attack skill 843: INT scaling
 * - Attack skill 844: CON scaling
 * - Attack skill 845: SAG scaling
 * 
 * Plugin Commands:
 * None
 * 
 * License:
 * Free for commercial and non-commercial use.
 * 
 * @param enableSwitching
 * @text Enable Character Switching
 * @desc Enable switching characters with Up/Down keys in equip menu
 * @type boolean
 * @default true
 * 
 * @param switchSound
 * @text Switch Sound Effect
 * @desc Play sound when switching characters
 * @type boolean
 * @default true
 */

(() => {
    'use strict';
    
    const pluginName = 'CharacterSwitchEquip';
    const parameters = PluginManager.parameters(pluginName);
    const enableSwitching = parameters['enableSwitching'] === 'true';
    const switchSound = parameters['switchSound'] === 'true';

    // Translation helper
    const getTranslation = function(key) {
        const useTranslation = ConfigManager.language === "it";
        
        const translations = {
            arcane: { en: 'Arcane', it: 'Arcano' },
            substance: { en: 'Substance', it: 'Sostanza' },
            stealth: { en: 'Stealth', it: 'Furtività' },
            intimidation: { en: 'Intimidation', it: 'Intimidazione' },
            scale: { en: 'ATK', it: 'ATT' },
            str: { en: 'STR', it: 'FOR' },
            dex: { en: 'DEX', it: 'DES' },
            mix: { en: 'MIX', it: 'MIS' },
            psi: { en: 'PSI', it: 'PSI' },
            int: { en: 'INT', it: 'INT' },
            con: { en: 'CON', it: 'COS' },
            wis: { en: 'WIS', it: 'SAG' }
        };
        
        const translation = translations[key.toLowerCase()];
        if (!translation) return key;
        
        return useTranslation ? translation.it : translation.en;
    };

    // Store original methods
    const _Scene_Equip_initialize = Scene_Equip.prototype.initialize;
    const _Scene_Equip_create = Scene_Equip.prototype.create;
    const _Scene_Equip_update = Scene_Equip.prototype.update;
    const _Scene_Equip_onActorChange = Scene_Equip.prototype.onActorChange;

    Scene_Equip.prototype.initialize = function() {
        _Scene_Equip_initialize.call(this);
        this._currentActorIndex = 0;
    };

    Scene_Equip.prototype.create = function() {
        _Scene_Equip_create.call(this);
        this._currentActorIndex = $gameParty.allMembers().indexOf(this._actor);
        this.refreshHelpWindow();
    };





    Scene_Equip.prototype.refreshHelpWindow = function() {
        if (this._helpWindow) {
            this._helpWindow.refresh();
        }
    };

  

    Scene_Equip.prototype.update = function() {
        _Scene_Equip_update.call(this);
        
        if (enableSwitching) {
            this.updateCharacterSwitching();
        }
    };

    Scene_Equip.prototype.updateCharacterSwitching = function() {
        if (this.isAnyWindowActive()) {
            if (Input.isTriggered('up')) {
                this.switchToPreviousCharacter();
            } else if (Input.isTriggered('down')) {
                this.switchToNextCharacter();
            }
        }
    };

    Scene_Equip.prototype.isAnyWindowActive = function() {
        return this._statusWindow.active || 
               this._commandWindow.active || 
               (this._switchButton && this._switchButton.active);
    };

    Scene_Equip.prototype.switchToPreviousCharacter = function() {
        const partyMembers = $gameParty.allMembers();
        if (partyMembers.length <= 1) return;

        const currentWindowState = this.getCurrentWindowState();
        
        this._currentActorIndex--;
        if (this._currentActorIndex < 0) {
            this._currentActorIndex = partyMembers.length - 1;
        }
        
        this.changeActor(partyMembers[this._currentActorIndex]);
        this.restoreWindowState(currentWindowState);
        
        if (switchSound) {
            SoundManager.playCursor();
        }
    };

    Scene_Equip.prototype.switchToNextCharacter = function() {
        const partyMembers = $gameParty.allMembers();
        if (partyMembers.length <= 1) return;

        const currentWindowState = this.getCurrentWindowState();
        
        this._currentActorIndex++;
        if (this._currentActorIndex >= partyMembers.length) {
            this._currentActorIndex = 0;
        }
        
        this.changeActor(partyMembers[this._currentActorIndex]);
        this.restoreWindowState(currentWindowState);
        
        if (switchSound) {
            SoundManager.playCursor();
        }
    };

    Scene_Equip.prototype.getCurrentWindowState = function() {
        return {
            commandIndex: this._commandWindow.index(),
            slotIndex: this._slotWindow.index(),
            itemIndex: this._itemWindow.index(),
            activeWindow: this.getActiveWindow()
        };
    };

    Scene_Equip.prototype.getActiveWindow = function() {
        if (this._commandWindow.active) return 'command';
        if (this._slotWindow.active) return 'slot';
        if (this._itemWindow.active) return 'item';
        if (this._statusWindow.active) return 'status';
        if (this._switchButton && this._switchButton.active) return 'switch';
        return 'command';
    };

    Scene_Equip.prototype.restoreWindowState = function(state) {
        this._commandWindow.select(state.commandIndex);
        this._slotWindow.select(state.slotIndex);
        this._itemWindow.select(state.itemIndex);
        
        this.deactivateAllWindows();
        
        switch (state.activeWindow) {
            case 'command':
                this._commandWindow.activate();
                break;
            case 'slot':
                this._slotWindow.activate();
                break;
            case 'item':
                this._itemWindow.activate();
                break;
            case 'status':
                this._statusWindow.activate();
                break;
            case 'switch':
                this._switchButton.activate();
                break;
            default:
                this._commandWindow.activate();
        }
    };

    Scene_Equip.prototype.deactivateAllWindows = function() {
        this._statusWindow.deactivate();
        this._commandWindow.deactivate();
        this._slotWindow.deactivate();
        this._itemWindow.deactivate();
        if (this._switchButton) this._switchButton.deactivate();
    };

    Scene_Equip.prototype.changeActor = function(newActor) {
        this._actor = newActor;
        this.onActorChange();
    };

    Scene_Equip.prototype.onActorChange = function() {
        _Scene_Equip_onActorChange.call(this);
        this.refreshAllWindows();
    };

    Scene_Equip.prototype.refreshAllWindows = function() {
        this._statusWindow.setActor(this._actor);
        this._slotWindow.setActor(this._actor);
        this._itemWindow.setActor(this._actor);
        this._commandWindow.refresh();
        
        if (this._slotWindow.index() >= 0) {
            const item = this._actor.equips()[this._slotWindow.index()];
            const slotId = this._slotWindow.index();
            this._itemWindow.setSlotId(slotId);
            this._statusWindow.setTempActor(null);
        }
    };

    const _Scene_Equip_mainAreaTop = Scene_Equip.prototype.mainAreaTop;
    Scene_Equip.prototype.mainAreaTop = function() {
        return 0;
    };

    const _Scene_Equip_mainAreaHeight = Scene_Equip.prototype.mainAreaHeight;
    Scene_Equip.prototype.mainAreaHeight = function() {
        const helpHeight = this.calcWindowHeight(2, false);
        return Graphics.boxHeight - helpHeight;
    };

    const _Scene_Equip_helpWindowRect = Scene_Equip.prototype.helpWindowRect;
    Scene_Equip.prototype.helpWindowRect = function() {
        const wx = 0;
        const wh = this.calcWindowHeight(2, false);
        const wy = Graphics.boxHeight - wh;
        const ww = Graphics.boxWidth;
        return new Rectangle(wx, wy, ww, wh);
    };

    const _Scene_Equip_statusWindowRect = Scene_Equip.prototype.statusWindowRect;
    Scene_Equip.prototype.statusWindowRect = function() {
        const wx = 0;
        const wy = this.mainAreaTop();
        const ww = 200;
        const helpHeight = this.calcWindowHeight(2, false);
        const switchButtonHeight = $gameParty.allMembers().length > 1 ? this.calcWindowHeight(1, true) : 0;
        const wh = Graphics.boxHeight - helpHeight - switchButtonHeight - 8;
        return new Rectangle(wx, wy, ww, wh);
    };

    const _Scene_Equip_commandWindowRect = Scene_Equip.prototype.commandWindowRect;
    Scene_Equip.prototype.commandWindowRect = function() {
        const statusRect = this.statusWindowRect();
        const wx = statusRect.width;
        const wy = this.mainAreaTop();
        const ww = Graphics.boxWidth - statusRect.width;
        const wh = this.calcWindowHeight(1, true);
        return new Rectangle(wx, wy, ww, wh);
    };

    const _Scene_Equip_slotWindowRect = Scene_Equip.prototype.slotWindowRect;
    Scene_Equip.prototype.slotWindowRect = function() {
        const commandRect = this.commandWindowRect();
        const wx = commandRect.x;
        const wy = commandRect.y + commandRect.height;
        const ww = commandRect.width;
        const helpHeight = this.calcWindowHeight(2, false);
        const wh = Graphics.boxHeight - commandRect.height - helpHeight;
        return new Rectangle(wx, wy, ww, wh);
    };

    const _Scene_Equip_itemWindowRect = Scene_Equip.prototype.itemWindowRect;
    Scene_Equip.prototype.itemWindowRect = function() {
        return this.slotWindowRect();
    };

    // Override Window_EquipSlot to add custom stats below equipment slots
    const _Window_EquipSlot_drawItem = Window_EquipSlot.prototype.drawItem;
    const _Window_EquipSlot_drawAllItems = Window_EquipSlot.prototype.drawAllItems;
    const _Window_EquipSlot_select = Window_EquipSlot.prototype.select;
    
    Window_EquipSlot.prototype.select = function(index) {
        const lastIndex = this.index();
        _Window_EquipSlot_select.call(this, index);
        // Only refresh if window is initialized and index actually changed
        if (this.contents && lastIndex !== index) {
            this.refresh();
        }
    };

    Window_EquipSlot.prototype.drawAllItems = function() {
        _Window_EquipSlot_drawAllItems.call(this);
        this.drawCustomStats();
    };

    Window_EquipSlot.prototype.calculateCustomStats = function() {
        if (!this._actor) {
            return {
                arcane: 0,
                substance: 0,
                stealth: 0,
                intimidation: 0
            };
        }

        const equips = this._actor.equips();
        
        // Track stat contributions from each equipment piece
        const statContributions = {
            arcane: 0,
            substance: 0,
            stealth: 0,
            intimidation: 0
        };
        
        let totalRelevantPieces = 0;

        // Process all equipment
        for (let i = 0; i < equips.length; i++) {
            const item = equips[i];
            if (!item) continue;
            
            // Check if it's a weapon
            if (DataManager.isWeapon(item)) {
                totalRelevantPieces++;
                const weaponTypeId = item.wtypeId;
                
                switch (weaponTypeId) {
                    case 1: // Dagger
                        statContributions.stealth++;
                        break;
                    case 2: // Sword
                        statContributions.intimidation++;
                        break;
                    case 3: // Heavy
                        statContributions.intimidation++;
                        break;
                    case 4: // Axe
                        statContributions.intimidation++;
                        break;
                    case 5: // Whip
                        statContributions.substance++;
                        break;
                    case 6: // Staff
                        statContributions.arcane++;
                        break;
                    case 7: // Bow
                        statContributions.stealth++;
                        break;
                    case 8: // Projectile
                        statContributions.substance++;
                        break;
                    case 9: // Gun
                        statContributions.substance++;
                        break;
                    case 10: // Claw
                        statContributions.intimidation++;
                        break;
                }
            }
            // Check if it's armor (excluding Equipment type 5 and Shield type 6)
            else if (DataManager.isArmor(item)) {
                const armorTypeId = item.atypeId;
                
                if (armorTypeId >= 1 && armorTypeId <= 4) {
                    totalRelevantPieces++;
                    
                    switch (armorTypeId) {
                        case 1: // Clothes - gives both Substance and Stealth
                            statContributions.substance++;
                            statContributions.stealth++;
                            break;
                        case 2: // Robe
                            statContributions.arcane++;
                            break;
                        case 3: // Light Armor
                            statContributions.stealth++;
                            break;
                        case 4: // Heavy Armor
                            statContributions.intimidation++;
                            break;
                    }
                }
            }
        }

        // Calculate percentages
        const stats = {
            arcane: 0,
            substance: 0,
            stealth: 0,
            intimidation: 0
        };

        if (totalRelevantPieces > 0) {
            stats.arcane = Math.round((statContributions.arcane / totalRelevantPieces) * 100);
            stats.substance = Math.round((statContributions.substance / totalRelevantPieces) * 100);
            stats.stealth = Math.round((statContributions.stealth / totalRelevantPieces) * 100);
            stats.intimidation = Math.round((statContributions.intimidation / totalRelevantPieces) * 100);
        }

        return stats;
    };

    Window_EquipSlot.prototype.drawCustomStats = function() {
        if (!this._actor) return;

        const stats = this.calculateCustomStats();

        // Save stats to variables for all party members
        const actorId = this._actor.actorId();

        if (actorId === 1) {
            // Player 1: Variables 121-124
            $gameVariables.setValue(121, stats.arcane);
            $gameVariables.setValue(122, stats.substance);
            $gameVariables.setValue(123, stats.stealth);
            $gameVariables.setValue(124, stats.intimidation);
        } else if (actorId === 2) {
            // Player 2: Variables 125-128
            $gameVariables.setValue(125, stats.arcane);
            $gameVariables.setValue(126, stats.substance);
            $gameVariables.setValue(127, stats.stealth);
            $gameVariables.setValue(128, stats.intimidation);
        } else if (actorId === 3) {
            // Player 3: Variables 129-132
            $gameVariables.setValue(129, stats.arcane);
            $gameVariables.setValue(130, stats.substance);
            $gameVariables.setValue(131, stats.stealth);
            $gameVariables.setValue(132, stats.intimidation);
        }
        
        const lineHeight = this.lineHeight() + 3;
        const x = this.itemPadding() + 3;
        const width = this.innerWidth - this.itemPadding() * 2;
        
        // Calculate starting Y position (after equipment slots)
        const numSlots = this.maxItems();
        let y = lineHeight * (numSlots + 1); // Add 1 for spacing
        
        // Custom stats display order with translations
        const customStats = [
            { name: getTranslation('arcane'), value: stats.arcane },
            { name: getTranslation('substance'), value: stats.substance },
            { name: getTranslation('stealth'), value: stats.stealth },
            { name: getTranslation('intimidation'), value: stats.intimidation }
        ];
        
        // Find the longest stat name for alignment
        let maxNameWidth = 0;
        for (let i = 0; i < customStats.length; i++) {
            const nameWidth = this.textWidth(customStats[i].name);
            if (nameWidth > maxNameWidth) {
                maxNameWidth = nameWidth;
            }
        }
        
        this.changeTextColor(ColorManager.systemColor());
        
        for (let i = 0; i < customStats.length; i++) {
            const stat = customStats[i];
            // Draw stat name
            this.drawText(stat.name, x, y, width);
            
            // Draw percentage aligned to the longest stat name
            this.changeTextColor(ColorManager.normalColor());
            this.drawText(stat.value + '%', x + maxNameWidth + 12, y, width - maxNameWidth);
            this.changeTextColor(ColorManager.systemColor());
            y += lineHeight;
        }
        
        // Reset color
        this.resetTextColor();
    };


    // Replace "Remove All" command with "Random"
    Window_EquipCommand.prototype.makeCommandList = function() {
        this.addCommand(TextManager.equip2, "equip");
        this.addCommand(TextManager.optimize, "optimize");
        const randomText = ConfigManager.language === "it" ? "Casuale" : "Random";
        this.addCommand(randomText, "random");
    };

    const _Scene_Equip_createCommandWindow = Scene_Equip.prototype.createCommandWindow;
    Scene_Equip.prototype.createCommandWindow = function() {
        const rect = this.commandWindowRect();
        const commandWindow = new Window_EquipCommand(rect);
        commandWindow.setHelpWindow(this._helpWindow);
        commandWindow.setHandler("equip",    this.commandEquip.bind(this));
        commandWindow.setHandler("optimize", this.commandOptimize.bind(this));
        commandWindow.setHandler("random",   this.commandRandom.bind(this));
        commandWindow.setHandler("cancel",   this.popScene.bind(this));
        this.addWindow(commandWindow);
        this._commandWindow = commandWindow;
    };

    Scene_Equip.prototype.commandRandom = function() {
        this._actor.randomEquipments();
        this._statusWindow.refresh();
        this._slotWindow.refresh();
        this._commandWindow.activate();
        SoundManager.playEquip();
    };

    Game_Actor.prototype.randomEquipments = function() {
        const maxSlots = this.equipSlots().length;
        this.clearEquipments();
        for (let i = 0; i < maxSlots; i++) {
            if (this.isEquipChangeOk(i)) {
                this.changeEquip(i, this.randomEquipItem(i));
            }
        }
    };

    Game_Actor.prototype.randomEquipItem = function(slotId) {
        const etypeId = this.equipSlots()[slotId];
        const itemList = etypeId === 1
            ? $gameParty.weapons().filter(w => this.canEquip(w))
            : $gameParty.armors().filter(a => a.etypeId === etypeId && this.canEquip(a));
        if (itemList.length === 0) return null;
        return itemList[Math.floor(Math.random() * itemList.length)];
    };

    const _Window_EquipCommand_cursorUp = Window_EquipCommand.prototype.cursorUp;
    const _Window_EquipCommand_cursorDown = Window_EquipCommand.prototype.cursorDown;

    Window_EquipCommand.prototype.cursorUp = function(wrap) {
        if (enableSwitching && Input.isTriggered('up')) {
            return;
        }
        _Window_EquipCommand_cursorUp.call(this, wrap);
    };

    Window_EquipCommand.prototype.cursorDown = function(wrap) {
        if (enableSwitching && Input.isTriggered('down')) {
            return;
        }
        _Window_EquipCommand_cursorDown.call(this, wrap);
    };

    // Override Window_EquipStatus to show weapon scaling and ensure bust display
    const _Window_EquipStatus_refresh = Window_EquipStatus.prototype.refresh;
    const _Window_EquipStatus_drawActorFace = Window_EquipStatus.prototype.drawActorFace;

    Window_EquipStatus.prototype.refresh = function() {
        _Window_EquipStatus_refresh.call(this);
        this.drawWeaponScaling();
    };

    // Ensure bust faces are drawn with proper zoom
    Window_EquipStatus.prototype.drawActorFace = function(actor, x, y, width, height) {
        width = width || ImageManager.faceWidth;
        height = height || ImageManager.faceHeight;
        // Delegate to the base implementation (which uses CustomBustFaceSystem if available)
        if (_Window_EquipStatus_drawActorFace) {
            _Window_EquipStatus_drawActorFace.call(this, actor, x, y, width, height);
        } else if (Window_Base.prototype.drawActorFace) {
            Window_Base.prototype.drawActorFace.call(this, actor, x, y, width, height);
        }
    };

    Window_EquipStatus.prototype.getWeaponScalingType = function(weapon) {
        if (!weapon || !DataManager.isWeapon(weapon)) {
            return null;
        }

        // Check if weapon has any attack skills
        const attackSkills = weapon.traits.filter(trait => trait.code === 35); // Trait code 35 is Attack Skill
        
        if (attackSkills.length === 0) {
            // No attack skill means STR scaling
            return 'STR';
        }

        // Check for specific attack skills
        for (let i = 0; i < attackSkills.length; i++) {
            const skillId = attackSkills[i].dataId;
            
            switch (skillId) {
                case 840:
                    return 'DEX';
                case 841:
                    return 'MIX';
                case 842:
                    return 'PSI';
                case 843:
                    return 'INT';
                case 844:
                    return 'CON';
                case 845:
                    return 'WIS';
            }
        }

        return null;
    };

    Window_EquipStatus.prototype.drawWeaponScaling = function() {
        if (!this._actor) return;
        
        const equips = this._actor.equips();
        const weapon1 = equips[0]; // First weapon slot
        const weapon2 = equips[1]; // Second weapon slot (for dual wielding)
        
        const scalingType1 = this.getWeaponScalingType(weapon1);
        const scalingType2 = this.getWeaponScalingType(weapon2);
        
        // Check if we have any scaling to display
        if (!scalingType1 && !scalingType2) return;
        
        const lineHeight = this.lineHeight();
        const x = this.itemPadding();
        let y = this.innerHeight - lineHeight - this.itemPadding();
        const width = this.innerWidth - this.itemPadding() * 2;
        
        this.changeTextColor(ColorManager.systemColor());
        
        // If dual wielding, show both scalings
        if (scalingType1 && scalingType2) {
            // Move up one more line to fit both
            y -= lineHeight;
            
            // Draw first weapon scaling
            const translatedType1 = getTranslation(scalingType1);
            this.drawText(getTranslation('scale') + ' 1: ' + translatedType1, x, y, width);
            y += lineHeight;
            
            // Draw second weapon scaling
            const translatedType2 = getTranslation(scalingType2);
            this.drawText(getTranslation('scale') + ' 2: ' + translatedType2, x, y, width);
        } else {
            // Single weapon
            const scalingType = scalingType1 || scalingType2;
            const translatedType = getTranslation(scalingType);
            this.drawText(getTranslation('scale') + ' ' + translatedType, x, y, width);
        }
        
        this.resetTextColor();
    };

})();
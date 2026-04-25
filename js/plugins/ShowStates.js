//=============================================================================
// StateListMenu.js
//=============================================================================
/*:
 * @target MZ
 * @plugindesc Adds a menu scene displaying all states and their descriptions in a two-pane layout, with removal conditions.
 * @author OmniLex
 *
 * @command ShowStates
 * @text Show State List
 * @desc Opens the state list scene showing state names, descriptions, and removal conditions.
 *
 * @help
 * This plugin provides a new plugin command 'ShowStates' which, when executed,
 * will open a custom scene displaying all states (with non-empty names) in a
 * selectable list on the left pane and their details on the right pane.
 *
 * On the right pane, each state's note field and its removal conditions are shown.
 *
 * Italian translations are shown automatically when RPG Maker's language is set to Italian.
 *
 * Usage:
 *   PluginCommand: ShowStates
 */
(() => {
    const pluginName = "StateListMenu";
    const useTranslation = ConfigManager.language === 'it';

    // Translation strings
    const L = {
        removalHeader: useTranslation ? 'Condizioni di rimozione' : 'Removal Conditions',
        atBattleEnd: useTranslation ? 'Rimuovi alla fine della battaglia' : 'Remove at Battle End',
        byRestriction: useTranslation ? 'Rimuovi per restrizione' : 'Remove by Restriction',
        byDamage: useTranslation ? 'Rimuovi per danno' : 'Remove by Damage',
        byWalking: useTranslation ? 'Rimuovi camminando' : 'Remove by Walking'
    };

    PluginManager.registerCommand(pluginName, 'ShowStates', () => {
        SceneManager.push(Scene_StateList);
    });

    class Window_StateList extends Window_Selectable {
        initialize(rect) {
            super.initialize(rect);
            this._data = $dataStates.filter(s => s && s.name);
            this._lastIndex = -1;
            this.select(0);
            this.activate();
        }
        maxItems() { return this._data.length; }
        item() { return this._data[this.index()]; }
        drawItem(index) {
            const state = this._data[index];
            const rect = this.itemLineRect(index);
            this.drawText(state.name, rect.x + 4, rect.y, rect.width - 4);
        }
        update() {
            super.update();
            if (this.index() !== this._lastIndex) {
                this._lastIndex = this.index();
                this.callDescriptionChange();
            }
        }
        callDescriptionChange() {
            this._scene._descriptionWindow.setState(this.item());
        }
    }

    class Window_StateDescription extends Window_Base {
        initialize(rect) {
            super.initialize(rect.x, rect.y, rect.width, rect.height);
            this._state = null;
        }
        setState(state) {
            this._state = state;
            this.refresh();
        }
        refresh() {
            this.contents.clear();
            if (!this._state) return;
            let y = 0;
            // Draw description
            const desc = this._state.note || '';
            this.drawTextEx(desc, 0, y);
            y = this.textHeightEx(desc) + this.lineHeight();
            // Draw removal header
            this.drawText(L.removalHeader, 0, y);
            y += this.lineHeight();
            // List conditions (exclude timing details)
            if (this._state.removeAtBattleEnd) {
                this.drawText('- ' + L.atBattleEnd, 0, y);
                y += this.lineHeight();
            }
            if (this._state.removeByRestriction) {
                this.drawText('- ' + L.byRestriction, 0, y);
                y += this.lineHeight();
            }
            if (this._state.removeByDamage) {
                this.drawText('- ' + L.byDamage, 0, y);
                y += this.lineHeight();
            }
            if (this._state.removeByWalking) {
                this.drawText('- ' + L.byWalking + ' (' + this._state.removeSteps + ' steps)', 0, y);
            }
        }
    }

    class Scene_StateList extends Scene_MenuBase {
        create() {
            super.create();
            const w = Graphics.boxWidth / 2;
            const h = Graphics.boxHeight;
            this._listWindow = new Window_StateList(new Rectangle(0, 0, w, h));
            this._listWindow._scene = this;
            this._listWindow.setHandler('cancel', this.popScene.bind(this));
            this.addWindow(this._listWindow);
            this._descriptionWindow = new Window_StateDescription(new Rectangle(w, 0, w, h));
            this.addWindow(this._descriptionWindow);
            if (this._listWindow.maxItems() > 0) {
                this._descriptionWindow.setState(this._listWindow.item());
            }
        }
    }
})();
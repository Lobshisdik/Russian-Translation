/*:
 * @plugindesc Character Sprite Selection Screen
 * @author Omni-Lex
 *
 * @target MZ
 *
 * @command openCharacterSelect
 * @text Open Character Select
 * @desc Opens the character sprite selection screen
 *
 * @param spriteSheets
 * @text Sprite Sheets
 * @type string[]
 * @desc List of character sprite sheet filenames
 * @default ["Actor1", "Actor2", "Actor3"]
 *
 * @help
 * Plugin to allow character sprite selection.
 * Use Plugin Command to open the selection screen.
 */

(() => {
    const pluginName = "CharacterSpriteSelect";

    // Get plugin parameters
    const params = PluginManager.parameters(pluginName);
    const spriteSheets = JSON.parse(params.spriteSheets || '["Actor1"]');

    // Scene Definition
    class Scene_CharacterSelect extends Scene_MenuBase {
        create() {
            super.create();
            this.createBackground();
            this.createSprite();
            this.createCommandWindow();
        }

        createBackground() {
            this._backgroundSprite = new Sprite(ImageManager.loadSystem('Window'));
            this._backgroundSprite.opacity = 128;
            this._backgroundSprite.width = Graphics.width;
            this._backgroundSprite.height = Graphics.height;
            this.addChild(this._backgroundSprite);
        }

        createSprite() {
            this._currentSpriteIndex = 0;
            this._characterSprite = new Sprite();
            this.updateCharacterSprite();
            this._characterSprite.anchor.x = 0.5;
            this._characterSprite.anchor.y = 0.5;
            this._characterSprite.x = Graphics.width / 2;
            this._characterSprite.y = Graphics.height / 2;
            this.addChild(this._characterSprite);
        }

        updateCharacterSprite() {
            const currentSprite = spriteSheets[this._currentSpriteIndex];
            this._characterSprite.bitmap = ImageManager.loadCharacter(currentSprite);
        }

        createCommandWindow() {
            const rect = this.commandWindowRect();
            this._commandWindow = new Window_CharacterSelectCommand(rect);
            this._commandWindow.setHandler('select', this.onSelect.bind(this));
            this._commandWindow.setHandler('cancel', this.onCancel.bind(this));
            this.addWindow(this._commandWindow);
        }

        commandWindowRect() {
            const wx = (Graphics.boxWidth - 240) / 2;
            const wy = Graphics.boxHeight - this.calcWindowHeight(2, true);
            return new Rectangle(wx, wy, 240, this.calcWindowHeight(2, true));
        }

        update() {
            super.update();
            this.processInput();
        }

        processInput() {
            if (Input.isTriggered('right')) {
                this.changeSprite(1);
            } else if (Input.isTriggered('left')) {
                this.changeSprite(-1);
            }
        }

        changeSprite(direction) {
            this._currentSpriteIndex = 
                (this._currentSpriteIndex + direction + spriteSheets.length) % spriteSheets.length;
            this.updateCharacterSprite();
        }

        onSelect() {
            $gameSystem._selectedCharacterSprite = spriteSheets[this._currentSpriteIndex];
            this.popScene();
        }

        onCancel() {
            this.popScene();
        }
    }

    // Custom Command Window
    class Window_CharacterSelectCommand extends Window_Command {
        initialize(rect) {
            super.initialize(rect);
        }

        makeCommandList() {
            this.addCommand('Select', 'select');
            this.addCommand('Cancel', 'cancel');
        }
    }

    // Plugin Command Registration
    PluginManager.registerCommand(pluginName, "openCharacterSelect", () => {
        SceneManager.push(Scene_CharacterSelect);
    });

    // Optional: Modify player sprite if needed
    const _Game_Player_refresh = Game_Player.prototype.refresh;
    Game_Player.prototype.refresh = function() {
        const selectedSprite = $gameSystem._selectedCharacterSprite || spriteSheets[0];
        this._characterName = selectedSprite;
        _Game_Player_refresh.call(this);
    };
})();
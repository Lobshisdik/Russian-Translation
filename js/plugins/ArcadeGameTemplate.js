/*:
 * @target MZ
 * @plugindesc Basic Arcade Cart Template v1.0.0
 * @author OmniLex
 * @help
 * ============================================================================
 * Basic Arcade Cart Template
 * ============================================================================
 * Use this as a starting point for developing arcade games compatible with
 * the ArcadeCabinetManager API.
 */

(() => {
    const cartId = 'ArcadeGameTemplate';
    const cartName = 'ARCADE GAME TEMPLATE';

    class ArcadeTemplateGame {
        constructor() {
            this._container = null;
            this._score = 0;
            this._isDemo = false;
        }

        start(container) {
            this._container = container;
            this._isDemo = false;
            this.initialize();
        }

        startDemo(container) {
            this._container = container;
            this._isDemo = true;
            this.initialize();
        }

        initialize() {
            this._score = 0;
            this.clearContainer();
            this.render();
        }

        clearContainer() {
            this._container.removeChildren();
        }

        render() {
            const text = new PIXI.Text(
                this._isDemo ? 'DEMO MODE' : 'GAME START',
                {
                    fontFamily: ArcadeManager.getArcadeFont(),
                    fontSize: 48,
                    fill: '#FFFFFF',
                    align: 'center'
                }
            );
            text.anchor.set(0.5);
            text.x = Graphics.width / 2;
            text.y = Graphics.height / 2;
            this._container.addChild(text);
        }

        update() {
            const input = ArcadeManager.getInput();
            if (!this._isDemo && input.action) {
                this.endGame();
            }
        }

        endGame() {
            ArcadeManager.endGame(this._score);
        }
    }

    const cart = new ArcadeTemplateGame();
    ArcadeManager.registerGame(cartId, cartName, cart);
})();

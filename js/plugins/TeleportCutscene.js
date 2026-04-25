/*:
 * @target MZ
 * @plugindesc Teleport cutscene with light beam effect
 * @author OmniLex
 * @url https://github.com/
 *
 * @help TeleportCutscene.js
 *
 * This plugin creates a teleport cutscene where party members turn into
 * light beams and shoot upward before teleporting to a new location.
 *
 * Plugin Commands:
 *   playTeleportCutscene - Plays the teleport cutscene and transfers player
 *
 * @command playTeleportCutscene
 * @text Play Teleport Cutscene
 * @desc Plays the teleport cutscene and transfers to target location
 *
 * @arg mapId
 * @text Map ID
 * @type number
 * @min 1
 * @default 1
 * @desc Target map ID to teleport to
 *
 * @arg x
 * @text X Coordinate
 * @type number
 * @min 0
 * @default 0
 * @desc Target X coordinate
 *
 * @arg y
 * @text Y Coordinate
 * @type number
 * @min 0
 * @default 0
 * @desc Target Y coordinate
 *
 * @arg fadeType
 * @text Fade Type
 * @type select
 * @option Black
 * @value 0
 * @option White
 * @value 1
 * @option None
 * @value 2
 * @default 0
 * @desc Fade type after teleport completes
 */

(() => {
    'use strict';

    const pluginName = 'TeleportCutscene';

    PluginManager.registerCommand(pluginName, 'playTeleportCutscene', args => {
        const mapId = Number(args.mapId);
        const x = Number(args.x);
        const y = Number(args.y);
        const fadeType = Number(args.fadeType);

        SceneManager.push(Scene_TeleportCutscene);
        SceneManager.prepareNextScene(mapId, x, y, fadeType);
    });

    //-----------------------------------------------------------------------------
    // Scene_TeleportCutscene
    //-----------------------------------------------------------------------------

    class Scene_TeleportCutscene extends Scene_Base {
        initialize() {
            super.initialize();
            this._mapId = 1;
            this._x = 0;
            this._y = 0;
            this._fadeType = 0;
        }

        prepare(mapId, x, y, fadeType) {
            this._mapId = mapId;
            this._x = x;
            this._y = y;
            this._fadeType = fadeType;
        }

        create() {
            super.create();
            this.createBackground();
            this.createCharacterSprites();
            this.createLightBeams();
            this._phase = 'idle';
            this._phaseTimer = 0;
            this._animationComplete = false;
        }

        createBackground() {
            this._backgroundSprite = new Sprite();
            this._backgroundSprite.bitmap = new Bitmap(Graphics.width, Graphics.height);
            this._backgroundSprite.bitmap.fillAll('black');
            this.addChild(this._backgroundSprite);
        }

        createCharacterSprites() {
            this._characterSprites = [];
            const party = $gameParty.battleMembers();
            const spacing = Graphics.width / (party.length + 1);

            for (let i = 0; i < party.length; i++) {
                const actor = party[i];
                const characterName = actor.characterName();
                const characterIndex = actor.characterIndex();

                const sprite = new Sprite();
                sprite.bitmap = ImageManager.loadCharacter(characterName);

                // Calculate frame for front-facing character
                const pw = sprite.bitmap.width / 12;
                const ph = sprite.bitmap.height / 8;
                const sx = (characterIndex % 4) * 3 * pw + pw; // Front-facing (middle frame)
                const sy = Math.floor(characterIndex / 4) * 4 * ph; // Front-facing direction

                sprite.setFrame(sx, sy, pw, ph);
                sprite.anchor.x = 0.5;
                sprite.anchor.y = 1.0;
                sprite.x = spacing * (i + 1);
                sprite.y = Graphics.height / 2 + 100;
                sprite.opacity = 0;
                sprite._targetY = sprite.y;

                this.addChild(sprite);
                this._characterSprites.push(sprite);
            }
        }

        createLightBeams() {
            this._lightBeams = [];

            for (let i = 0; i < this._characterSprites.length; i++) {
                const charSprite = this._characterSprites[i];
                const beam = new Sprite();
                beam.bitmap = this.createBeamBitmap();
                beam.anchor.x = 0.5;
                beam.anchor.y = 1.0;
                beam.x = charSprite.x;
                beam.y = charSprite.y;
                beam.opacity = 0;
                beam.scale.y = 0;

                this.addChild(beam);
                this._lightBeams.push(beam);
            }
        }

        createBeamBitmap() {
            const width = 60;
            const height = Graphics.height * 2;
            const bitmap = new Bitmap(width, height);

            // Create gradient light beam
            const context = bitmap.context;
            const gradient = context.createLinearGradient(width / 2, 0, width / 2, height);
            gradient.addColorStop(0, 'rgba(255, 255, 255, 0)');
            gradient.addColorStop(0.3, 'rgba(200, 230, 255, 0.8)');
            gradient.addColorStop(0.5, 'rgba(150, 200, 255, 1)');
            gradient.addColorStop(0.7, 'rgba(200, 230, 255, 0.8)');
            gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');

            context.fillStyle = gradient;
            context.fillRect(0, 0, width, height);

            return bitmap;
        }

        update() {
            super.update();
            this._phaseTimer++;

            switch (this._phase) {
                case 'idle':
                    if (this._phaseTimer > 30) {
                        this._phase = 'fadeIn';
                        this._phaseTimer = 0;
                    }
                    break;
                case 'fadeIn':
                    this.updateFadeIn();
                    break;
                case 'transform':
                    this.updateTransform();
                    break;
                case 'beam':
                    this.updateBeam();
                    break;
                case 'complete':
                    if (this._phaseTimer > 30) {
                        this.performTeleport();
                    }
                    break;
            }
        }

        updateFadeIn() {
            const duration = 60;
            const progress = Math.min(this._phaseTimer / duration, 1);

            for (const sprite of this._characterSprites) {
                sprite.opacity = 255 * progress;
            }

            if (this._phaseTimer >= duration + 30) {
                this._phase = 'transform';
                this._phaseTimer = 0;
            }
        }

        updateTransform() {
            const duration = 60;
            const progress = Math.min(this._phaseTimer / duration, 1);

            for (let i = 0; i < this._characterSprites.length; i++) {
                const sprite = this._characterSprites[i];
                const beam = this._lightBeams[i];

                // Fade out character
                sprite.opacity = 255 * (1 - progress);

                // Fade in beam
                beam.opacity = 255 * progress;
                beam.scale.y = progress;

                // Make character glow/flash
                const flash = Math.sin(this._phaseTimer * 0.2) * 0.3 + 0.7;
                sprite.setBlendColor([255 * flash, 255 * flash, 255 * flash, 0]);
            }

            if (this._phaseTimer >= duration) {
                this._phase = 'beam';
                this._phaseTimer = 0;
            }
        }

        updateBeam() {
            const duration = 90;
            const progress = Math.min(this._phaseTimer / duration, 1);

            for (let i = 0; i < this._lightBeams.length; i++) {
                const beam = this._lightBeams[i];

                // Move beam upward
                beam.y = beam.y - 8;

                // Fade out near the end
                if (progress > 0.7) {
                    const fadeProgress = (progress - 0.7) / 0.3;
                    beam.opacity = 255 * (1 - fadeProgress);
                }

                // Scale effect (pulsing)
                beam.scale.x = 1 + Math.sin(this._phaseTimer * 0.1) * 0.2;
            }

            if (this._phaseTimer >= duration) {
                this._phase = 'complete';
                this._phaseTimer = 0;
            }
        }

        performTeleport() {
            $gamePlayer.reserveTransfer(this._mapId, this._x, this._y, 0, this._fadeType);
            SceneManager.goto(Scene_Map);
        }

        isReady() {
            return super.isReady() &&
                   this._characterSprites.every(s => s.bitmap && s.bitmap.isReady());
        }
    }

    window.Scene_TeleportCutscene = Scene_TeleportCutscene;

})();

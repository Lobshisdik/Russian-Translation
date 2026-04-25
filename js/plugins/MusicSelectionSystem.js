/*:
 * @target MZ
 * @plugindesc Handles battle music selection with independent window and Options menu integration
 * @author Omni-Lex.ai
 *
 * @command openMusicSelectionWindow
 * @text Open Music Selection Window
 * @desc Opens the music selection window in a separate scene
 *
 * @help
 * Music Selection System
 * =====================
 * This plugin provides a standalone music selection system independent from the
 * character creation process. Features include:
 *
 * - Music selection window accessible from Options menu
 * - Configurable battle music tracks
 * - Music preview functionality
 * - Persistent music selection via ConfigManager
 * - Bilingual support (English/Italian)
 *
 * Available Battle Music:
 * - Drums (RandomMind/Battle)
 * - Shortcuts (ZaneMusic/shortcuts)
 * -  (TallBeard)
 * - Melodic Techno (Moogify/MelodicTechno)
 * - Battle1-Battle8 (KADOGAWA)
 */

(() => {
  const pluginName = "MusicSelectionSystem";

  // Special sentinel values
  const MUSIC_NONE     = "__none__";
  const MUSIC_MAP      = "__map__";

  // Music tracks available for selection
  const MUSIC_TRACKS = [
    { name: "None",              value: MUSIC_NONE, composer: "" },
    { name: "Continue Map Music",value: MUSIC_MAP,  composer: "" },
    { name: "Drums", value: "RandomMind/Battle", composer: "RandomMind" },
    { name: "Shortcuts", value: "ZaneMusic/shortcuts", composer: "ZaneMusic" },
    { name: "", value: "", composer: "TallBeard" },
    { name: "Melodic Techno", value: "Moogify/MelodicTechno", composer: "Moogify" },
    { name: "Battle1", value: "Battle1", composer: "KADOGAWA" },
    { name: "Battle2", value: "Battle2", composer: "KADOGAWA" },
    { name: "Battle3", value: "Battle3", composer: "KADOGAWA" },
    { name: "Battle4", value: "Battle4", composer: "KADOGAWA" },
    { name: "Battle5", value: "Battle5", composer: "KADOGAWA" },
    { name: "Battle6", value: "Battle6", composer: "KADOGAWA" },
    { name: "Battle7", value: "Battle7", composer: "KADOGAWA" },
    { name: "Battle8", value: "Battle8", composer: "KADOGAWA" },
  ];

  // Helper function for localized text
  function getLocalizedText(english, italian) {
    return ConfigManager.language === "it" ? italian : english;
  }

  // Battle Music Configuration
  Object.defineProperty(ConfigManager, "battleMusicName", {
    get: function () {
      return this._battleMusicName || "RandomMind/Battle";
    },
    set: function (value) {
      this._battleMusicName = value;
    },
    configurable: true,
  });

  const _ConfigManager_makeData = ConfigManager.makeData;
  ConfigManager.makeData = function () {
    const config = _ConfigManager_makeData.call(this);
    config.battleMusicName = this.battleMusicName;
    return config;
  };

  const _ConfigManager_applyData = ConfigManager.applyData;
  ConfigManager.applyData = function (config) {
    _ConfigManager_applyData.call(this, config);
    this.battleMusicName = this.readBattleMusicName(config);
  };

  ConfigManager.readBattleMusicName = function (config) {
    return config.battleMusicName !== undefined
      ? config.battleMusicName
      : "RandomMind/Battle";
  };

  // Apply battle music when battle starts
  const _BattleManager_playBattleBgm = BattleManager.playBattleBgm;
  BattleManager.playBattleBgm = function () {
    const sel = ConfigManager.battleMusicName;
    if (sel === MUSIC_NONE) {
      AudioManager.stopBgm();
    } else if (sel === MUSIC_MAP) {
      // Keep current map music playing — do nothing
    } else if (sel) {
      AudioManager.playBgm({ name: sel, volume: 90, pitch: 100, pan: 0 });
    } else {
      _BattleManager_playBattleBgm.call(this);
    }
  };

  // Window_MusicSelection - Custom window for music selection
  class Window_MusicSelection extends Window_Selectable {
    initialize(rect) {
      super.initialize(rect);
      this._musicTracks = MUSIC_TRACKS;
      this._lastIndex = -1;
      this.refresh();
      this.select(0);
      this.activate();
    }

    maxItems() {
      return this._musicTracks.length;
    }

    itemHeight() {
      return 48;
    }

    drawItem(index) {
      const track = this._musicTracks[index];
      if (!track) return;

      const rect = this.itemLineRect(index);
      const isSelected = index === this.index();
      const isCurrentTrack = ConfigManager.battleMusicName === track.value;

      // Draw selection/current track indicator
      let prefix = "";
      if (isCurrentTrack) {
        this.changeTextColor(ColorManager.systemColor());
        prefix = "► "; // Current track indicator
      }

      // Draw track name
      this.resetTextColor();
      this.drawText(
        prefix + track.name,
        rect.x + 8,
        rect.y,
        rect.width - 16,
        "left"
      );

      // Draw composer name on the right
      this.changeTextColor(ColorManager.systemColor());
      this.drawText(
        track.composer,
        rect.x + 8,
        rect.y,
        rect.width - 16,
        "right"
      );
    }

    update() {
      super.update();

      // Play music preview when selection changes
      if (this.index() !== this._lastIndex) {
        this._lastIndex = this.index();
        const track = this._musicTracks[this.index()];
        if (track) {
          if (track.value === MUSIC_NONE) {
            AudioManager.stopBgm();
          } else if (track.value === MUSIC_MAP) {
            // No preview change — leave current BGM
          } else {
            AudioManager.playBgm({ name: track.value, volume: 60, pitch: 100, pan: 0 });
          }
        }
      }
    }

    processOk() {
      const track = this._musicTracks[this.index()];
      if (track) {
        ConfigManager.battleMusicName = track.value;
        ConfigManager.save();
        SoundManager.playOk();
        if (track.value === MUSIC_NONE) {
          AudioManager.stopBgm();
        } else if (track.value !== MUSIC_MAP) {
          AudioManager.playBgm({ name: track.value, volume: 90, pitch: 100, pan: 0 });
        }
      }
    }
  }

  // Scene_MusicSelection - Scene for music selection
  class Scene_MusicSelection extends Scene_MenuBase {
    create() {
      super.create();
      this.createMusicWindow();
      this.createHelpWindow();
    }

    createHelpWindow() {
      const rect = this.helpWindowRect();
      this._helpWindow = new Window_Help(rect);
      const helpText = getLocalizedText(
        "Select your preferred battle music. Use arrow keys to preview.",
        "Seleziona la tua musica di battaglia preferita. Usa i tasti freccia per l'anteprima."
      );
      this._helpWindow.setText(helpText);
      this.addWindow(this._helpWindow);
    }

    createMusicWindow() {
      const rect = this.musicWindowRect();
      this._musicWindow = new Window_MusicSelection(rect);
      this._musicWindow.setBackgroundType(0);
      this._musicWindow.setHandler("ok", this.onMusicOk.bind(this));
      this._musicWindow.setHandler("cancel", this.popScene.bind(this));
      this.addWindow(this._musicWindow);
    }

    musicWindowRect() {
      const wx = 0;
      const wy = this.helpAreaHeight();
      const ww = Graphics.boxWidth;
      const wh = Graphics.boxHeight - wy;
      return new Rectangle(wx, wy, ww, wh);
    }

    onMusicOk() {
      this._musicWindow.processOk();
      this.popScene();
    }
  }

  // Plugin command
  PluginManager.registerCommand(pluginName, "openMusicSelectionWindow", () => {
    SceneManager.push(Scene_MusicSelection);
  });

  // Add Battle Music option to Options menu
  const _Window_Options_addGeneralOptions =
    Window_Options.prototype.addGeneralOptions;
  Window_Options.prototype.addGeneralOptions = function () {
    _Window_Options_addGeneralOptions.call(this);
    this.addCommand(
      getLocalizedText("Battle Music", "Musica di Battaglia"),
      "battleMusicName"
    );
  };

  const _Window_Options_statusText = Window_Options.prototype.statusText;
  Window_Options.prototype.statusText = function (index) {
    const symbol = this.commandSymbol(index);
    if (symbol === "battleMusicName") {
      return this.battleMusicStatusText();
    }
    return _Window_Options_statusText.call(this, index);
  };

  Window_Options.prototype.battleMusicStatusText = function () {
    const track = MUSIC_TRACKS.find(t => t.value === ConfigManager.battleMusicName);
    return track ? track.name : "RandomMind/Battle";
  };

  const _Window_Options_processOk = Window_Options.prototype.processOk;
  Window_Options.prototype.processOk = function () {
    const index = this.index();
    const symbol = this.commandSymbol(index);
    if (symbol === "battleMusicName") {
      this.changeBattleMusic();
    } else {
      _Window_Options_processOk.call(this);
    }
  };

  Window_Options.prototype.changeBattleMusic = function () {
    const currentIndex = MUSIC_TRACKS.findIndex(
      t => t.value === ConfigManager.battleMusicName
    );
    const nextIndex = (currentIndex + 1) % MUSIC_TRACKS.length;
    const next = MUSIC_TRACKS[nextIndex];
    ConfigManager.battleMusicName = next.value;

    if (next.value === MUSIC_NONE) {
      AudioManager.stopBgm();
    } else if (next.value !== MUSIC_MAP) {
      AudioManager.playBgm({ name: next.value, volume: 60, pitch: 100, pan: 0 });
    }

    this.redrawItem(this.findSymbol("battleMusicName"));
    this.playCursorSound();
  };

  // Make Scene_MusicSelection available globally if needed
  window.Scene_MusicSelection = Scene_MusicSelection;
  window.Window_MusicSelection = Window_MusicSelection;
})();

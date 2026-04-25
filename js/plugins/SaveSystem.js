/*:
 * @target MZ
 * @plugindesc Autosave on map transition after X minutes with a visual icon.
 * @author esoteric-heavy-industries
 *
 * @param defaultEnabled
 * @text Default Enabled
 * @type boolean
 * @default true
 *
 * @param defaultInterval
 * @text Default Interval (minutes)
 * @type number
 * @min 1
 * @max 60
 * @default 5
 */

(() => {
    const params = PluginManager.parameters("AutosaveTimer");
    const DEFAULT_ENABLED  = params.defaultEnabled !== "false";
    const DEFAULT_INTERVAL = Number(params.defaultInterval) || 5;
    const SAVE_SLOT = 0; 
    const ICON_INDEX = 79; // The icon index you requested

    // --- Config & Options Logic (Persisting settings) ---
    const _ConfigManager_makeData = ConfigManager.makeData;
    ConfigManager.makeData = function() {
        const config = _ConfigManager_makeData.call(this);
        config.autosaveEnabled  = this.autosaveEnabled;
        config.autosaveInterval = this.autosaveInterval;
        return config;
    };

    const _ConfigManager_applyData = ConfigManager.applyData;
    ConfigManager.applyData = function(config) {
        _ConfigManager_applyData.call(this, config);
        this.autosaveEnabled  = config.autosaveEnabled !== undefined ? config.autosaveEnabled : DEFAULT_ENABLED;
        this.autosaveInterval = config.autosaveInterval !== undefined ? Number(config.autosaveInterval) : DEFAULT_INTERVAL;
    };

    const _Window_Options_makeCommandList = Window_Options.prototype.makeCommandList;
    Window_Options.prototype.makeCommandList = function() {
        _Window_Options_makeCommandList.call(this);
        const it = ConfigManager.language === "it";
        this.addCommand(it ? "Salvataggio Auto" : "Auto Save", "autosaveEnabled");
        this.addCommand(it ? "Intervallo (min)" : "Save Interval", "autosaveInterval");
    };

    const _Window_Options_statusText = Window_Options.prototype.statusText;
    Window_Options.prototype.statusText = function(index) {
        const symbol = this.commandSymbol(index);
        if (symbol === "autosaveInterval") return this.getConfigValue(symbol) + " min";
        return _Window_Options_statusText.call(this, index);
    };

    const _Window_Options_isVolumeSymbol = Window_Options.prototype.isVolumeSymbol;
    Window_Options.prototype.isVolumeSymbol = function(symbol) {
        return symbol === "autosaveInterval" || _Window_Options_isVolumeSymbol.call(this, symbol);
    };

    const _Window_Options_changeVolume = Window_Options.prototype.changeVolume;
    Window_Options.prototype.changeVolume = function(symbol, forward, wrap) {
        if (symbol === "autosaveInterval") {
            const last = this.getConfigValue(symbol);
            const value = (last + (forward ? 1 : -1)).clamp(1, 60);
            this.changeValue(symbol, value);
            return;
        }
        _Window_Options_changeVolume.call(this, symbol, forward, wrap);
    };

    // --- Scene_Map Logic ---

    const _Scene_Map_terminate = Scene_Map.prototype.terminate;
    Scene_Map.prototype.terminate = function() {
        if (SceneManager.isNextScene(Scene_Map)) {
            this._checkAutosaveOnTransition();
        }
        _Scene_Map_terminate.call(this);
    };

    Scene_Map.prototype._checkAutosaveOnTransition = function() {
        if (!ConfigManager.autosaveEnabled) return;
        if ($gameSystem._lastAutosaveFrame === undefined) {
            $gameSystem._lastAutosaveFrame = Graphics.frameCount;
            return;
        }

        const framesPassed = Graphics.frameCount - $gameSystem._lastAutosaveFrame;
        const intervalFrames = ConfigManager.autosaveInterval * 60 * 60;

        if (framesPassed >= intervalFrames) {
            $gameSystem._lastAutosaveFrame = Graphics.frameCount;
            this._executeAutosave();
        }
    };

    Scene_Map.prototype._executeAutosave = function() {
        this._showAutosaveIcon(); // Draw the icon
        $gameSystem.onBeforeSave();
        DataManager.saveGame(SAVE_SLOT)
            .then(() => console.log("Autosave Successful"))
            .catch(() => {});
    };

    // Helper to draw Icon 79 at bottom left
    Scene_Map.prototype._showAutosaveIcon = function() {
        const iconSet = ImageManager.loadSystem("IconSet");
        const sprite = new Sprite(iconSet);
        
        // Calculate Icon Source (Icons are 32x32)
        const sx = (ICON_INDEX % 16) * 32;
        const sy = Math.floor(ICON_INDEX / 16) * 32;
        sprite.setFrame(sx, sy, 32, 32);

        // Position: Bottom Left (16px padding)
        sprite.x = 16;
        sprite.y = Graphics.boxHeight - 48;
        sprite.z = 9; // Ensure it's on top of map but under transitions

        // Add to the scene
        this.addChild(sprite);

        // Simple fade out after 2 seconds
        sprite.opacity = 255;
        const fadeOut = setInterval(() => {
            if (sprite.opacity > 0) {
                sprite.opacity -= 15;
            } else {
                this.removeChild(sprite);
                clearInterval(fadeOut);
            }
        }, 50);
    };

    // --- Save Menu UI (Remains the same) ---
    const _Window_SavefileList_maxItems = Window_SavefileList.prototype.maxItems;
    Window_SavefileList.prototype.maxItems = function() {
        return _Window_SavefileList_maxItems.call(this) + 1;
    };

    Window_SavefileList.prototype.drawItem = function(index) {
        const savefileId = index;
        const info = DataManager.savefileInfo(savefileId);
        const rect = this.itemRectWithPadding(index);
        const it = ConfigManager.language === "it";

        if (index === 0) {
            this.changePaintOpacity(true);
            this.drawText(it ? "Salvataggio Auto" : TextManager.autosave, rect.x, rect.y + 4, 180);
            if (info) {
                this.changePaintOpacity(this.isEnabled(savefileId));
                this.drawContents(info, rect);
            } else {
                this.changePaintOpacity(false);
                this.drawText(it ? "Vuoto" : "Empty", rect.x, rect.y + 4, rect.width, "right");
            }
        } else {
            this.changePaintOpacity(this.isEnabled(savefileId));
            this.drawText(TextManager.file + " " + index, rect.x, rect.y + 4, 180);
            if (info) this.drawContents(info, rect);
        }
    };
})();
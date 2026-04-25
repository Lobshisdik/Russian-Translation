//=============================================================================
// VolumePercentageDisplay.js
//=============================================================================

/*:
 * @target MZ
 * @plugindesc Displays volume as percentage bars with 1% increments in options menu
 * @author Assistant
 * @url https://github.com/yourusername/rpgmaker-plugins
 *
 * @help VolumePercentageDisplay.js
 *
 * This plugin replaces the default volume display in the options menu
 * with percentage bars showing exact values (0-100%).
 * Volume can be adjusted in 1% increments instead of the default intervals.
 *
 * Features:
 * - BGM, BGS, ME, and SE volumes display as percentages
 * - Visual bar showing fill percentage
 * - 1% increment adjustments
 * - Shows current percentage value
 *
 * No plugin commands needed - just install and activate.
 *
 * @param barColor1
 * @text Bar Color 1 (Start)
 * @desc The starting gradient color for the volume bar
 * @type number
 * @min 0
 * @max 31
 * @default 20
 *
 * @param barColor2
 * @text Bar Color 2 (End)
 * @desc The ending gradient color for the volume bar
 * @type number
 * @min 0
 * @max 31
 * @default 21
 *
 * @param defaultBgmVolume
 * @text Default BGM Volume
 * @desc Default volume for background music (0-100)
 * @type number
 * @min 0
 * @max 100
 * @default 90
 *
 * @param defaultBgsVolume
 * @text Default BGS Volume
 * @desc Default volume for background sounds (0-100)
 * @type number
 * @min 0
 * @max 100
 * @default 90
 *
 * @param defaultMeVolume
 * @text Default ME Volume
 * @desc Default volume for music effects (0-100)
 * @type number
 * @min 0
 * @max 100
 * @default 90
 *
 * @param defaultSeVolume
 * @text Default SE Volume
 * @desc Default volume for sound effects (0-100)
 * @type number
 * @min 0
 * @max 100
 * @default 90
 *
 * @param defaultFootstepsVolume
 * @text Default Footsteps Volume
 * @desc Default volume for footstep sounds (0-100)
 * @type number
 * @min 0
 * @max 100
 * @default 30
 */

(() => {
    const pluginName = "VolumePercentageDisplay";
    const parameters = PluginManager.parameters(pluginName);
    const barColor1 = Number(parameters['barColor1'] || 20);
    const barColor2 = Number(parameters['barColor2'] || 21);
    const defaultBgmVolume = Number(parameters['defaultBgmVolume'] || 90);
    const defaultBgsVolume = Number(parameters['defaultBgsVolume'] || 90);
    const defaultMeVolume = Number(parameters['defaultMeVolume'] || 90);
    const defaultSeVolume = Number(parameters['defaultSeVolume'] || 90);
    const defaultFootstepsVolume = Number(parameters['defaultFootstepsVolume'] || 30);

    //-----------------------------------------------------------------------------
    // ConfigManager
    //-----------------------------------------------------------------------------

    // Set default volumes
    const _ConfigManager_applyData = ConfigManager.applyData;
    ConfigManager.applyData = function(config) {
        _ConfigManager_applyData.call(this, config);

        // Apply defaults if not set
        if (this.bgmVolume === undefined) {
            this.bgmVolume = defaultBgmVolume;
        }
        if (this.bgsVolume === undefined) {
            this.bgsVolume = defaultBgsVolume;
        }
        if (this.meVolume === undefined) {
            this.meVolume = defaultMeVolume;
        }
        if (this.seVolume === undefined) {
            this.seVolume = defaultSeVolume;
        }
        if (this.footstepsVolume === undefined) {
            this.footstepsVolume = defaultFootstepsVolume;
        }
    };

    // Override to use 1% increments (offset of 1 instead of 20)
    const _ConfigManager_volumeOffset = ConfigManager.volumeOffset;
    ConfigManager.volumeOffset = function() {
        return 1;
    };

    //-----------------------------------------------------------------------------
    // Window_Options
    //-----------------------------------------------------------------------------

    // Override the status text to show percentage
    const _Window_Options_statusText = Window_Options.prototype.statusText;
    Window_Options.prototype.statusText = function(index) {
        const symbol = this.commandSymbol(index);
        const value = this.getConfigValue(symbol);
        
        if (this.isVolumeSymbol(symbol)) {
            return this.volumeStatusText(value);
        } else {
            return _Window_Options_statusText.call(this, index);
        }
    };

    // New method to format volume as percentage
    Window_Options.prototype.volumeStatusText = function(value) {
        return value + "%";
    };

    // Override to draw percentage bar instead of just text
    const _Window_Options_drawItem = Window_Options.prototype.drawItem;
    Window_Options.prototype.drawItem = function(index) {
        const symbol = this.commandSymbol(index);
        
        if (this.isVolumeSymbol(symbol)) {
            this.drawVolumeItem(index);
        } else {
            _Window_Options_drawItem.call(this, index);
        }
    };

    // New method to draw volume with bar
    Window_Options.prototype.drawVolumeItem = function(index) {
        const title = this.commandName(index);
        const rect = this.itemLineRect(index);
        const statusWidth = this.statusWidth();
        const titleWidth = rect.width - statusWidth;
        const value = this.getConfigValue(this.commandSymbol(index));
        
        this.resetTextColor();
        this.changePaintOpacity(this.isCommandEnabled(index));
        this.drawText(title, rect.x, rect.y, titleWidth, "left");
        
        // Draw the percentage bar
        const barX = rect.x + titleWidth;
        const barY = rect.y;
        const barWidth = statusWidth - 60;
        const barHeight = this.lineHeight();
        
        this.drawVolumeBar(barX, barY, barWidth, barHeight, value);
        
        // Draw the percentage text
        this.drawText(value + "%", barX + barWidth + 4, barY, 56, "right");
    };

    // New method to draw the volume bar
    Window_Options.prototype.drawVolumeBar = function(x, y, width, height, rate) {
        // Validate and clamp rate to 0-100
        rate = Number(rate) || 0;
        rate = Math.max(0, Math.min(100, rate));

        const fillW = Math.floor((width - 2) * rate / 100);
        const gaugeY = y + this.lineHeight() - 8 - 4;
        const gaugeH = 8;

        // Draw background
        this.contents.fillRect(x, gaugeY, width, gaugeH, ColorManager.gaugeBackColor());

        // Draw the filled portion (only if fillW is positive)
        if (fillW > 0) {
            const color1 = ColorManager.textColor(barColor1);
            const color2 = ColorManager.textColor(barColor2);
            this.contents.gradientFillRect(x + 1, gaugeY + 1, fillW, gaugeH - 2, color1, color2);
        }
    };

    // Override status width to accommodate bar and percentage
    const _Window_Options_statusWidth = Window_Options.prototype.statusWidth;
    Window_Options.prototype.statusWidth = function() {
        return 240;
    };

    // Override to change by 1% instead of 20%
    const _Window_Options_changeVolume = Window_Options.prototype.changeVolume;
    Window_Options.prototype.changeVolume = function(symbol, forward, wrap) {
        const lastValue = this.getConfigValue(symbol);
        const offset = 1; // 1% increment
        const min = 0;
        const max = 100;
        let value = lastValue;

        if (forward) {
            value += offset;
        } else {
            value -= offset;
        }

        if (value > max) {
            value = wrap ? min : max;
        }
        if (value < min) {
            value = wrap ? max : min;
        }

        if (value !== lastValue) {
            this.changeValue(symbol, value);
        }
    };

    //-----------------------------------------------------------------------------
    // Add Footsteps volume option to config
    //-----------------------------------------------------------------------------

    const _ConfigManager_makeData = ConfigManager.makeData;
    ConfigManager.makeData = function() {
        const config = _ConfigManager_makeData.call(this);
        config.footstepsVolume = this.footstepsVolume;
        return config;
    };

    //-----------------------------------------------------------------------------
    // Add Footsteps to options menu
    //-----------------------------------------------------------------------------

    const _Window_Options_addVolumeOptions = Window_Options.prototype.addVolumeOptions;
    Window_Options.prototype.addVolumeOptions = function() {
        _Window_Options_addVolumeOptions.call(this);
        this.addCommand("Footsteps Volume", "footstepsVolume");
    };

})();
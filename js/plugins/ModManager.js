/*:
 * @target MZ
 * @plugindesc RimWorld-style Mod Manager. Loads mods from a "mods" folder, overrides files, and manages load order.
 * @author Gemini
 *
 * @help
 * ModManager.js
 * 
 * ============================================================================
 * Overview
 * ============================================================================
 * This plugin allows you to have a "mods" folder in your project root.
 * Inside "mods", each folder is treated as a separate mod.
 * Mods can replicate the game's folder structure to override default files
 * or add entirely new ones.
 * 
 * Example Structure:
 * MyGame/
 *   data/
 *   img/
 *   mods/
 *     MyFirstMod/
 *       data/
 *         Actors.json (Overrides default Actors.json)
 *         CustomData.json (Loaded dynamically into $dataCustom.CustomData)
 *       img/
 *         pictures/
 *           new_pic.png (Can be used in game like a normal picture)
 *     AnotherMod/
 *       ...
 * 
 * ============================================================================
 * Controls in Mod Manager Menu
 * ============================================================================
 * - Enter/OK: Toggle Mod ON/OFF
 * - Left/Right (or Q/W): Move Mod Up/Down in priority.
 *   (Mods at the BOTTOM of the list load LAST, overwriting mods above them).
 * 
 * NOTE: This plugin requires NW.js (PC/Mac Deployment or Playtest).
 */

var Imported = Imported || {};
Imported.ModManager = true;

var ModManager = ModManager || {};
ModManager.mods = [];
ModManager.fs = null;
ModManager.path = null;
ModManager.basePath = "";

// Global object to store custom added JSONs
window.$dataCustom = {};

//-----------------------------------------------------------------------------
// Core System
//-----------------------------------------------------------------------------

(() => {
    if (!Utils.isNwjs()) {
        console.warn("ModManager: NW.js is required. Mod Manager disabled.");
        return;
    }

    ModManager.fs = require('fs');
    ModManager.path = require('path');

    // Get root directory of the game
    const path = require('path');
    const base = path.dirname(process.mainModule.filename);
    ModManager.basePath = base;
    ModManager.modsDir = path.join(base, 'mods');
    ModManager.configFile = path.join(base, 'mod_config.json');

    ModManager.initialize = function () {
        this.ensureModsFolder();
        this.loadModConfig();
        this.scanForNewMods();

        // Initialize Steam for Workshop
        try {
            const steamworks = require('../libs/steamworks');
            this.steamClient = steamworks.init(4193010);
            this.scanSteamWorkshop();
        } catch (e) {
            console.log("Steam not available or failed to initialize for ModManager.");
        }

        this.saveModConfig(); // Clean up config
    };

    ModManager.ensureModsFolder = function () {
        if (!this.fs.existsSync(this.modsDir)) {
            this.fs.mkdirSync(this.modsDir);
        }
    };

    ModManager.loadModConfig = function () {
        if (this.fs.existsSync(this.configFile)) {
            try {
                const data = this.fs.readFileSync(this.configFile, 'utf8');
                this.mods = JSON.parse(data);
            } catch (e) {
                console.error("Failed to load mod config.", e);
                this.mods = [];
            }
        } else {
            this.mods = [];
        }
    };

    ModManager.saveModConfig = function () {
        try {
            this.fs.writeFileSync(this.configFile, JSON.stringify(this.mods, null, 2));
        } catch (e) {
            console.error("Failed to save mod config.", e);
        }
    };

    ModManager.scanForNewMods = function () {
        const folders = this.fs.readdirSync(this.modsDir, { withFileTypes: true })
            .filter(dirent => dirent.isDirectory())
            .map(dirent => dirent.name);

        // Remove deleted mods from config (only for local mods)
        this.mods = this.mods.filter(mod => mod.path || folders.includes(mod.name));

        // Add new mods to config (default to active: false)
        const existingModNames = this.mods.map(m => m.name);
        for (const folder of folders) {
            if (!existingModNames.includes(folder)) {
                this.mods.push({ name: folder, active: false });
            }
        }
    };

    ModManager.scanSteamWorkshop = function () {
        if (!this.steamClient) return;

        try {
            const workshop = this.steamClient.workshop || this.steamClient.ugc;
            if (workshop && workshop.getSubscribedItems) {
                const itemIds = workshop.getSubscribedItems();
                for (const itemId of itemIds) {
                    const info = workshop.getItemInstallInfo(itemId);
                    if (info && info.folder) {
                        const modName = `Workshop_${itemId}`;
                        const existing = this.mods.find(m => m.name === modName);
                        if (!existing) {
                            this.mods.push({ name: modName, active: true, path: info.folder });
                        } else {
                            existing.path = info.folder; // Update path
                        }
                    }
                }
            }
        } catch (e) {
            console.error("Failed to scan Steam Workshop:", e);
        }
    };

    // Resolves a path. If an active mod overrides it, returns the mod path.
    ModManager.resolvePath = function (localPath) {
        if (!Utils.isNwjs()) return localPath;

        // Traverse backwards so mods at the bottom of the list (highest priority) get checked first
        for (let i = this.mods.length - 1; i >= 0; i--) {
            const mod = this.mods[i];
            if (mod.active) {
                const moddedPath = mod.path ? this.path.join(mod.path, localPath) : this.path.join(this.modsDir, mod.name, localPath);
                if (this.fs.existsSync(moddedPath)) {
                    // Return formatted for web request
                    if (mod.path) {
                        return "file:///" + moddedPath.replace(/\\/g, "/");
                    }
                    return `mods/${mod.name}/${localPath}`;
                }
            }
        }
        return localPath; // Fallback to base game path
    };

    // Load custom JSONs dynamically
    ModManager.loadCustomData = function () {
        for (const mod of this.mods) {
            if (!mod.active) continue;

            const modDataDir = mod.path ? this.path.join(mod.path, 'data') : this.path.join(this.modsDir, mod.name, 'data');
            if (this.fs.existsSync(modDataDir)) {
                const files = this.fs.readdirSync(modDataDir).filter(f => f.endsWith('.json'));

                for (const file of files) {
                    const baseName = file.replace('.json', '');
                    const standardMZFiles = [
                        "Actors", "Classes", "Skills", "Items", "Weapons", "Armors",
                        "Enemies", "Troops", "States", "Animations", "Tilesets",
                        "CommonEvents", "System", "MapInfos"
                    ];

                    // If it's NOT a standard RM file, load it custom
                    if (!standardMZFiles.includes(baseName) && !baseName.startsWith("Map")) {
                        const url = mod.path ? "file:///" + this.path.join(modDataDir, file).replace(/\\/g, "/") : `mods/${mod.name}/data/${file}`;
                        this.loadCustomDataFile(baseName, url);
                    }
                }
            }
        }
    };

    ModManager.loadCustomDataFile = function (name, src) {
        const xhr = new XMLHttpRequest();
        xhr.open("GET", src);
        xhr.overrideMimeType("application/json");
        xhr.onload = () => {
            if (xhr.status < 400) {
                $dataCustom[name] = JSON.parse(xhr.responseText);
                console.log(`Loaded custom mod data: ${name}`);
            }
        };
        xhr.send();
    };

    // Initialize the manager immediately
    ModManager.initialize();

    //-----------------------------------------------------------------------------
    // Core Overrides for Path Redirection
    //-----------------------------------------------------------------------------

    // Override DataManager to intercept JSON loads
    const _DataManager_loadDataFile = DataManager.loadDataFile;
    DataManager.loadDataFile = function (name, src) {
        const originalPath = "data/" + src;
        const redirectedPath = ModManager.resolvePath(originalPath);

        // Temporarily change src to our redirected path
        // MZ internally prepends "data/", so we have to adjust if it's modded.
        if (redirectedPath !== originalPath) {
            // It's a modded path. We'll use a custom XHR for standard data to bypass MZ's strict pathing
            const xhr = new XMLHttpRequest();
            xhr.open("GET", redirectedPath);
            xhr.overrideMimeType("application/json");
            xhr.onload = () => this.onLoad(xhr);
            xhr.onerror = () => this.onError(xhr, name, redirectedPath);
            window[name] = null;
            xhr.send();
        } else {
            _DataManager_loadDataFile.call(this, name, src);
        }
    };

    // Trigger custom data loading after main database loads
    const _DataManager_loadDatabase = DataManager.loadDatabase;
    DataManager.loadDatabase = function () {
        _DataManager_loadDatabase.call(this);
        ModManager.loadCustomData();
    };

    // Override ImageManager to intercept Image loads
    const _ImageManager_loadBitmap = ImageManager.loadBitmap;
    ImageManager.loadBitmap = function (folder, filename) {
        if (filename) {
            const originalPath = folder + Utils.encodeURI(filename) + ".png";
            const redirectedPath = ModManager.resolvePath(originalPath);
            if (redirectedPath !== originalPath) {
                // If it's modded, strip the filename out so we can pass the whole redirected path
                // This is a bit hacky due to MZ's architecture, but effective.
                let url = redirectedPath;
                return Bitmap.load(url);
            }
        }
        return _ImageManager_loadBitmap.call(this, folder, filename);
    };

    // Override AudioManager to intercept Audio loads
    const _AudioManager_createBuffer = AudioManager.createBuffer;
    AudioManager.createBuffer = function (folder, name) {
        const ext = this.audioFileExt();
        const originalPath = (this._path || "audio/") + folder + Utils.encodeURI(name) + ext;
        const redirectedPath = ModManager.resolvePath(originalPath);

        // WebAudio doesn't strictly prepend the folder if we pass a full URL
        let url = redirectedPath;
        const buffer = new WebAudio(url);
        buffer.name = name;
        buffer.frameCount = this.frameCount;
        return buffer;
    };


    //-----------------------------------------------------------------------------
    // Title Menu Integration & UI
    //-----------------------------------------------------------------------------

    const _Window_TitleCommand_makeCommandList = Window_TitleCommand.prototype.makeCommandList;
    Window_TitleCommand.prototype.makeCommandList = function () {
        _Window_TitleCommand_makeCommandList.call(this);
        this.addCommand("Mods", 'mods');
    };

    const _Scene_Title_createCommandWindow = Scene_Title.prototype.createCommandWindow;
    Scene_Title.prototype.createCommandWindow = function () {
        _Scene_Title_createCommandWindow.call(this);
        this._commandWindow.setHandler('mods', this.commandMods.bind(this));
    };

    Scene_Title.prototype.commandMods = function () {
        this._commandWindow.close();
        SceneManager.push(Scene_ModManager);
    };

    //-----------------------------------------------------------------------------
    // Scene_ModManager
    //-----------------------------------------------------------------------------

    class Scene_ModManager extends Scene_MenuBase {
        create() {
            super.create();
            this.createModWindow();
            this.createHelpWindow();
        }

        createModWindow() {
            const rect = this.modWindowRect();
            this._modWindow = new Window_ModList(rect);
            this._modWindow.setHandler('cancel', this.popScene.bind(this));
            this.addWindow(this._modWindow);
        }

        createHelpWindow() {
            const rect = this.helpWindowRect();
            this._helpWindow = new Window_Help(rect);
            this._helpWindow.setText("OK: Toggle ON/OFF | Left/Right: Change Priority (Lower is later load)");
            this.addWindow(this._helpWindow);
        }

        modWindowRect() {
            const wx = 0;
            const wy = this.calcWindowHeight(1, true); // Below help window
            const ww = Graphics.boxWidth;
            const wh = Graphics.boxHeight - wy;
            return new Rectangle(wx, wy, ww, wh);
        }

        helpWindowRect() {
            const wx = 0;
            const wy = 0;
            const ww = Graphics.boxWidth;
            const wh = this.calcWindowHeight(1, true);
            return new Rectangle(wx, wy, ww, wh);
        }

        terminate() {
            super.terminate();
            ModManager.saveModConfig(); // Save configuration on exit
            // Reload the title scene so graphics/audio take effect if changed
            if (SceneManager._nextScene && SceneManager._nextScene.constructor === Scene_Title) {
                // To force a clean state, reloading the game is safer, but returning to title is ok for most things.
            }
        }
    }

    //-----------------------------------------------------------------------------
    // Window_ModList
    //-----------------------------------------------------------------------------

    class Window_ModList extends Window_Selectable {
        initialize(rect) {
            super.initialize(rect);
            this._data = ModManager.mods;
            this.refresh();
            this.select(0);
            this.activate();
        }

        maxItems() {
            return this._data ? this._data.length : 0;
        }

        item() {
            return this._data && this.index() >= 0 ? this._data[this.index()] : null;
        }

        isOkEnabled() {
            return true;
        }

        drawItem(index) {
            const item = this._data[index];
            if (item) {
                const rect = this.itemLineRect(index);
                this.changePaintOpacity(item.active);

                // Draw Active Status
                const status = item.active ? "[ON]" : "[OFF]";
                this.drawText(status, rect.x, rect.y, 80);

                // Draw Name
                this.drawText(item.name, rect.x + 80, rect.y, rect.width - 80);
                this.changePaintOpacity(1);
            }
        }

        processOk() {
            const item = this.item();
            if (item) {
                item.active = !item.active;
                this.redrawItem(this.index());
                SoundManager.playCursor();
            }
        }

        processCursorMove() {
            super.processCursorMove();
            if (this.isOpenAndActive() && this.item()) {
                if (Input.isRepeated('left') || Input.isRepeated('pageup')) {
                    this.moveModUp();
                } else if (Input.isRepeated('right') || Input.isRepeated('pagedown')) {
                    this.moveModDown();
                }
            }
        }

        moveModUp() {
            const idx = this.index();
            if (idx > 0) {
                const temp = this._data[idx];
                this._data[idx] = this._data[idx - 1];
                this._data[idx - 1] = temp;
                this.select(idx - 1);
                this.refresh();
                SoundManager.playEquip();
            }
        }

        moveModDown() {
            const idx = this.index();
            if (idx < this._data.length - 1) {
                const temp = this._data[idx];
                this._data[idx] = this._data[idx + 1];
                this._data[idx + 1] = temp;
                this.select(idx + 1);
                this.refresh();
                SoundManager.playEquip();
            }
        }
    }

    // Expose classes for compatibility
    window.Scene_ModManager = Scene_ModManager;
    window.Window_ModList = Window_ModList;

})();
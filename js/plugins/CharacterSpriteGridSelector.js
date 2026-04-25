/*:
 * @target MZ
 * @plugindesc [v2.6] Grid-based character sprite selector with bust selection window.
 * @author OmniLex (Modified by Claude)
 *
 * @param GridColumns
 * @text Grid Columns
 * @desc Number of columns to display in the sprite selection grid.
 * @type number
 * @min 1
 * @max 10
 * @default 5
 *
 * @param GridRows
 * @text Grid Rows
 * @desc Maximum number of rows to display per page in the sprite selection grid.
 * @type number
 * @min 1
 * @max 8
 * @default 4
 *
 * @command OpenSpriteSelector
 * @text Open Sprite Selector
 * @desc Opens the grid-based sprite selection UI to pick a sprite for Actor #1.
 *
 * @command OpenSpriteSelectorForActor
 * @text Open Sprite Selector For Actor
 * @desc Opens the sprite selection UI for a specific actor.
 * 
 * @arg actorId
 * @text Actor ID
 * @desc The ID of the actor to change the sprite for.
 * @type number
 * @min 1
 * @default 1
 *
 * @command SelectRandomSprite
 * @text Select Random Sprite
 * @desc Randomly selects a sprite for a specific actor without opening the UI.
 *
 * @arg actorId
 * @text Actor ID
 * @desc The ID of the actor to change the sprite for.
 * @type number
 * @min 1
 * @default 1
 */

(() => {
    const pluginName = "CharacterSpriteGridSelector";
    const params = PluginManager.parameters(pluginName);
    const gridColumns = Number(params["GridColumns"] || 5);
    const gridRows = Number(params["GridRows"] || 4);

    // Unified sprite sheet configuration with cutoffs
    // cutoff: max sprite index to include (0 = first sprite only, 7 = all 8 sprites, null = use default)
    const SPRITE_SHEET_CONFIG = {
        "Skab/!$KillerBot": { cutoff: 0 },
        "Skab/!$2": { cutoff: 0 },
        "Skab/!$3": { cutoff: 0 },
        "Skab/!$AirlinePilot": { cutoff: 0 },
        "Skab/!$AlienDargos": { cutoff: 0 },
        "Skab/!$AlienGrey": { cutoff: 0 },
        "Skab/!$AlienTrucker": { cutoff: 0 },
        "Skab/!$AlpineGuide": { cutoff: 0 },
        "Skab/!$Anarchist": { cutoff: 0 },
        "Skab/!$AnarchistSamurai": { cutoff: 0 },
        "Skab/!$11": { cutoff: 0 },
        "Skab/!$AndroidArchpriest": { cutoff: 0 },
        "Skab/!$AndroidExperiment": { cutoff: 0 },
        "Skab/!$14": { cutoff: 0 },
        "Skab/!$Archivist": { cutoff: 0 },
        "Skab/!$ArchivistBackpacker": { cutoff: 0 },
        "Skab/!$AvianCommando": { cutoff: 0 },
        "Skab/!$ArchivistGuard": { cutoff: 0 },
        "Skab/!$19": { cutoff: 0 },
        "Skab/!$AvianNoble": { cutoff: 0 },
        "Skab/!$21": { cutoff: 0 },
        "Skab/!$Farmer": { cutoff: 0 },
        "Skab/!$GoblinRecruit": { cutoff: 0 },
        "Skab/!$GoblinShogun": { cutoff: 0 },
        "Skab/!$BotSpaceman": { cutoff: 0 },
        "Skab/!$BotGuardian": { cutoff: 0 },
        "Skab/!$GnomeExplorer": { cutoff: 0 },
        "Skab/!$28": { cutoff: 0 },
        "Skab/!$CatBoy": { cutoff: 0 },
        "Skab/!$CatCourier": { cutoff: 0 },
        "Skab/!$ElvenPirate": { cutoff: 0 },
        "Skab/!$32": { cutoff: 0 },
        "Skab/!$33": { cutoff: 0 },
        "Skab/!$VoidPerson": { cutoff: 0 },
        "Skab/!$Witch1": { cutoff: 0 },
        "Skab/!$SwordInstructor": { cutoff: 0 },
        "Skab/!$Samurai": { cutoff: 0 },
        "Skab/!$SchoolTeacher": { cutoff: 0 },
        "Skab/!$PirateAdventurer": { cutoff: 0 },
        "Skab/!$OrcSamurai": { cutoff: 0 },
        "Skab/!$AncientWitch": { cutoff: 0 },
        "Skab/!$BotSamurai": { cutoff: 0 },
        "Skab/!$DesertPunk": { cutoff: 0 },
        "Skab/!$Doctor2": { cutoff: 0 },
        "Skab/!$ElvenSpacer": { cutoff: 0 },
        "Skab/!$ExoticBard": { cutoff: 0 },
        "Skab/!$Fisherman": { cutoff: 0 },
        "Skab/!$GoblinIllusionist": { cutoff: 0 },
        "Skab/!$HighCommand": { cutoff: 0 },
        "Skab/!$LeatherDaddy": { cutoff: 0 },
        "Skab/!$Lich": { cutoff: 0 },
        "Skab/!$Madman": { cutoff: 0 },
        "Skab/!$Mafia": { cutoff: 0 },
        "Skab/!$Nurse2": { cutoff: 0 },
        "Skab/!$PrimaryDoctor": { cutoff: 0 },
        "Skab/!$WastelandParamedic": { cutoff: 0 },
        "NPCs03Color": { cutoff: 0 },
        "Actor2": { cutoff: 0 },
        "Heroes02Color": { cutoff: 6 },
        "Actor3RMVX": { cutoff: 0 },
        "Actor1": { cutoff: 0 },
        "Heroes01Color": { cutoff: 0 },
        "Evil01": { cutoff: 0 },
        "Actor2RMVX": { cutoff: 0 },
        "School01RM": { cutoff: 0 },
        "Actor1RMVX": { cutoff: 0 },
        "NPCs02Color": { cutoff: null },
        "NPCs01Color": { cutoff: null },
        "FarmCharacters01RM": { cutoff: null },
        "Actor3": { cutoff: null },
        "Evil01Color": { cutoff: null },
        "emPath": { cutoff: null },
    };

    // Extract sprite sheet names from config (preserves order)
    const spriteSheets = Object.keys(SPRITE_SHEET_CONFIG);

    // Build a comprehensive list of all sprite options (file + index) considering cutoffs
    const spriteOptions = [];
    const indexToLetter = index => {
        // Convert 0 -> A, 1 -> B, ... 25 -> Z, 26 -> AA, etc.
        let letters = "";
        let i = index;
        do {
            letters = String.fromCharCode(65 + (i % 26)) + letters;
            i = Math.floor(i / 26) - 1;
        } while (i >= 0);
        return letters;
    };
    
    for (const name of spriteSheets) {
        const config = SPRITE_SHEET_CONFIG[name];
        // Determine cutoff index for this sheet (use config or default based on sheet type)
        let cutoffIndex = config && config.cutoff !== null ? config.cutoff : null;
        if (cutoffIndex === null) {
            // No cutoff given: default to 0 for single ($) sheets, or 7 for standard sheets (8 sprites)
            cutoffIndex = name.includes("$") ? 0 : 7;
        } else {
            // If cutoff provided, clamp it within valid range
            if (name.includes("$")) {
                cutoffIndex = 0; // single-character sheet can only have index 0
            } else if (cutoffIndex > 7) {
                cutoffIndex = 7; // multi-character sheets have at most indices 0-7
            }
        }

        // Add each sprite (up to cutoff index) as a separate option
        for (let index = 0; index <= cutoffIndex; index++) {
            spriteOptions.push({ name: name, index: index });
        }
    }


    // Function to select a random sprite from available options
    function selectRandomSprite(actorId) {
        // Get random index from available sprites
        const randomIndex = Math.floor(Math.random() * spriteOptions.length);
        const randomSprite = spriteOptions[randomIndex];
        
        // Apply the randomly selected sprite to the specified actor
        const actor = $gameActors.actor(actorId);
        actor.setCharacterImage(randomSprite.name, randomSprite.index);
        
        // Refresh player if this is the party leader
        if (actorId === $gameParty.leader().actorId()) {
            $gamePlayer.refresh();
        }
        
        return randomSprite;
    }

    // Scene to handle sprite grid selection
    class Scene_SpriteGridSelector extends Scene_MenuBase {
        constructor() {
            super();
            this._actorId = 1; // Default to Actor 1
        }
        
        // Add a method to set the actor ID
        setActor(actorId) {
            this._actorId = actorId;
        }
        
        create() {
            super.create();
            this.createHelpWindow();
            this.createGridWindow();
            this.preloadSprites();
        }

        createHelpWindow() {
            const rect = this.helpWindowRect();
            this._helpWindow = new Window_Help(rect);
            if(ConfigManager.language === 'it' ){
                this._helpWindow.setText("Scegli pure il personaggio");

            }else{
                this._helpWindow.setText("Select a character sprite.");

            }
            this.addWindow(this._helpWindow);
        }

        helpWindowRect() {
            const wx = 0;
            const wy = 0;
            const ww = Graphics.boxWidth;
            const wh = this.calcWindowHeight(1, false);
            return new Rectangle(wx, wy, ww, wh);
        }

        createGridWindow() {
            const rect = this.gridWindowRect();
            this._gridWindow = new Window_SpriteGrid(rect);
            this._gridWindow.setHandler('ok', this.onSpriteSelected.bind(this));
            this._gridWindow.setHandler('cancel', this.popScene.bind(this));
            this.addWindow(this._gridWindow);
            this._gridWindow.activate();
            this._gridWindow.select(0);
        }

        gridWindowRect() {
            const wx = 0;
            const wy = this._helpWindow.height;
            const ww = Graphics.boxWidth;
            const wh = Graphics.boxHeight - wy;
            return new Rectangle(wx, wy, ww, wh);
        }

        // Preload all character images to ensure they are available
        preloadSprites() {
            const uniqueSheets = [...new Set(spriteSheets)];
            uniqueSheets.forEach(filename => {
                ImageManager.loadCharacter(filename);
            });
        }

        onSpriteSelected() {
            const index = this._gridWindow.index();
            if (index >= 0 && index < spriteOptions.length) {
                const entry = spriteOptions[index];
                const actor = $gameActors.actor(this._actorId);

                // Apply the selected sprite to the specified actor
                actor.setCharacterImage(entry.name, entry.index);

                // Refresh player if this is the party leader
                if (this._actorId === $gameParty.leader().actorId()) {
                    $gamePlayer.refresh();
                }

                SoundManager.playOk();

                // Look up associated bust from SPRITES_ASSOCIATION
                let preselectedBust = null;
                const spritesAssoc = window.Sprites && window.Sprites.SPRITES_ASSOCIATION;
                if (spritesAssoc && spritesAssoc[entry.name]) {
                    const busts = spritesAssoc[entry.name];
                    preselectedBust = busts[entry.index] !== undefined ? busts[entry.index] : busts[0];
                }

                // Open bust selection window
                this.createBustSelectionScene(preselectedBust);
            }
        }

        createBustSelectionScene(preselectedBust) {
            const sceneClass = Scene_BustSelector;
            SceneManager.push(sceneClass);
            if (SceneManager._nextScene) {
                SceneManager._nextScene.setActor(this._actorId);
                if (preselectedBust) {
                    SceneManager._nextScene.setPreselectedBust(preselectedBust);
                }
            }
        }
    }

    // Window to display the sprite grid
    class Window_SpriteGrid extends Window_Selectable {
        constructor(rect) {
            super(rect);
            this._sprites = spriteOptions;
            this._characterSprites = [];
            this._bustBitmaps = new Map(); // Cache for bust bitmaps
            this._lastAnimFrame = 0;
            this._animationCount = 0;
            this._lastSelectedIndex = -1;
            this.refresh();
        }

        maxCols() {
            return gridColumns;
        }

        maxItems() {
            return this._sprites.length;
        }

        itemWidth() {
            return Math.floor((this.innerWidth - this.colSpacing() * (this.maxCols() - 1)) / this.maxCols());
        }

        itemHeight() {
            // Compact height for smaller sprites in 4-column grid
            return 64;
        }

        spacing() {
            return 8;
        }

        colSpacing() {
            return this.spacing();
        }

        rowSpacing() {
            return this.spacing();
        }
        
        update() {
            super.update();
            
            // Check if selection changed
            if (this.index() !== this._lastSelectedIndex) {
                if (this._lastSelectedIndex >= 0) {
                    this.redrawItem(this._lastSelectedIndex);
                }
                this._lastSelectedIndex = this.index();
            }
            
            // Update animation for selected sprite only
            if (this.index() >= 0) {
                this._animationCount++;
                if (this._animationCount % 12 === 0) {
                    this.updateCharacterAnimation();
                }
            }
        }
        
        updateCharacterAnimation() {
            const index = this.index();
            if (index >= 0) {
                this.redrawItem(index);
            }
        }

        drawAllItems() {
            super.drawAllItems();
            
            // Clear any existing character sprites
            if (this._characterSprites) {
                this._characterSprites.forEach(sprite => {
                    if (sprite && sprite.parent) {
                        sprite.parent.removeChild(sprite);
                    }
                });
            }
            this._characterSprites = [];
        }

        drawItem(index) {
            if (!this._sprites[index]) return;

            const sprite = this._sprites[index];
            const rect = this.itemRect(index);

            // Draw a background for the item
            this.drawItemBackground(index);

            // Draw only the character sprite (no bust)
            this.drawCharacterSprite(sprite.name, sprite.index, rect.x + rect.width / 2, rect.y + rect.height / 2, index === this.index());
        }
        
        drawCharacterSprite(characterName, characterIndex, x, y, isSelected) {
            // Find the index in the sprite options array
            const spriteIndex = this._sprites.findIndex(s => s.name === characterName && s.index === characterIndex);
            
            // Get the complete item rect
            const rect = this.itemRectWithPadding(this.indexToRect(spriteIndex));
            
            // Load character bitmap
            const bitmap = ImageManager.loadCharacter(characterName);
            if (!bitmap.isReady()) {
                bitmap.addLoadListener(() => this.redrawItem(spriteIndex));
                return;
            }
            
            // Determine character sheet type
            const big = ImageManager.isBigCharacter(characterName);
            
            // Calculate pattern (animation frame) - only animate selected sprite
            let pattern = 1; // Default to middle frame (standing)
            if (isSelected) {
                const frameCount = Graphics.frameCount || this._animationCount;
                const animFrame = Math.floor((frameCount / 12) % 4);
                // Pattern for walking: 0, 1, 2, 1
                pattern = animFrame === 3 ? 1 : animFrame;
            }
            
            // Face down (direction 2)
            const direction = 2;
            
            // Calculate dimensions and source rectangle
            const pw = bitmap.width / (big ? 3 : 12);
            const ph = bitmap.height / (big ? 4 : 8);
            
            // For big characters: pattern = column (animation frame), direction = row
            // For regular characters: characterIndex determines position in grid
            const sx = (big ? pattern : characterIndex % 4 * 3 + pattern) * pw;
            const sy = (big ? (direction / 2 - 1) : Math.floor(characterIndex / 4) * 4 + (direction / 2 - 1)) * ph;
            
            // Use integer scaling for pixel perfect rendering
            const scale = 1; // 1x scale for compact grid
            const dw = Math.floor(pw * scale);
            const dh = Math.floor(ph * scale);
            
            // Use integer coordinates for pixel perfect positioning
            const dx = Math.floor(x - dw / 2);
            const dy = Math.floor(y - dh / 2);
            
            // Draw directly to the window contents with integer coordinates
            this.contents.blt(bitmap, Math.floor(sx), Math.floor(sy), Math.floor(pw), Math.floor(ph), dx, dy, dw, dh);
        }

        drawItemBackground(index) {
            // Do nothing - no background highlight for selected item
        }
        
        // Helper method to convert index to rect coordinates
        indexToRect(index) {
            if (index < 0) return new Rectangle(0, 0, 0, 0);
            const maxCols = this.maxCols();
            const itemWidth = this.itemWidth();
            const itemHeight = this.itemHeight();
            const colSpacing = this.colSpacing();
            const rowSpacing = this.rowSpacing();
            const col = index % maxCols;
            const row = Math.floor(index / maxCols);
            const x = col * itemWidth + col * colSpacing;
            const y = row * itemHeight + row * rowSpacing;
            return new Rectangle(x, y, itemWidth, itemHeight);
        }
        
        // Add padding to rect
        itemRectWithPadding(rect) {
            const padding = this.itemPadding();
            return new Rectangle(
                rect.x + padding,
                rect.y + padding,
                rect.width - padding * 2,
                rect.height - padding * 2
            );
        }
        
        select(index) {
            const lastIndex = this.index();
            super.select(index);
            
            if (lastIndex !== index) {
                // Force complete redraw of both the previous and new selected items
                if (lastIndex >= 0) this.redrawItem(lastIndex);
                if (index >= 0) this.redrawItem(index);
            }
        }
        
        // Override the cursor rectangle to hide the selection border
        refreshCursor() {
            // Override to hide the cursor/border completely
            this.setCursorRect(0, 0, 0, 0);
        }
    }

    // Scene for bust selection
    class Scene_BustSelector extends Scene_MenuBase {
        constructor() {
            super();
            this._actorId = 1;
            this._bustList = [];
            this._preselectedBust = null;
        }

        setActor(actorId) {
            this._actorId = actorId;
        }

        setPreselectedBust(bustName) {
            this._preselectedBust = bustName;
        }

        create() {
            super.create();
            this.createHelpWindow();
            this.createBustListWindow();
            this.createBustPreviewWindow();
            this.loadBustList();
            if (this._preselectedBust) {
                this._bustListWindow.preselectBust(this._preselectedBust);
            }
        }

        createHelpWindow() {
            const rect = this.helpWindowRect();
            this._helpWindow = new Window_Help(rect);
            if (ConfigManager.language === 'it') {
                this._helpWindow.setText("Scegli un'immagine di busto");
            } else {
                this._helpWindow.setText("Select a bust image.");
            }
            this.addWindow(this._helpWindow);
        }

        helpWindowRect() {
            const wx = 0;
            const wy = 0;
            const ww = Graphics.boxWidth;
            const wh = this.calcWindowHeight(1, false);
            return new Rectangle(wx, wy, ww, wh);
        }

        createBustListWindow() {
            const rect = this.bustListWindowRect();
            this._bustListWindow = new Window_BustList(rect);
            this._bustListWindow.setHandler('ok', this.onBustSelected.bind(this));
            this._bustListWindow.setHandler('cancel', this.onBustCancel.bind(this));
            this._bustListWindow.setHandler('select', this.onBustSelect.bind(this));
            this.addWindow(this._bustListWindow);
            this._bustListWindow.activate();
            this._bustListWindow.select(0);
            // Update preview for the first bust
            this.onBustSelect();
        }

        createBustPreviewWindow() {
            const rect = this.bustPreviewWindowRect();
            this._bustPreviewWindow = new Window_BustPreview(rect);
            this.addWindow(this._bustPreviewWindow);
        }

        bustListWindowRect() {
            const wx = 0;
            const wy = this._helpWindow.height;
            const ww = Math.floor(Graphics.boxWidth * 0.3);
            const wh = Graphics.boxHeight - wy;
            return new Rectangle(wx, wy, ww, wh);
        }

        bustPreviewWindowRect() {
            const wx = Math.floor(Graphics.boxWidth * 0.3);
            const wy = this._helpWindow.height;
            const ww = Graphics.boxWidth - wx;
            const wh = Graphics.boxHeight - wy;
            return new Rectangle(wx, wy, ww, wh);
        }

        loadBustList() {
            // This will be populated by the list window
        }

        update() {
            super.update();
            // Ensure the window is activated after state changes
            if (this._bustListWindow && !this._bustListWindow.active) {
                this._bustListWindow.activate();
            }
        }

        onBustSelect() {
            const selectedBust = this._bustListWindow.getSelectedBust();
            const isInCategoryMode = this._bustListWindow.isInCategoryMode();

            // Update preview and help text based on mode
            if (isInCategoryMode) {
                // In category mode, show category description in preview
                if (this._bustPreviewWindow) {
                    this._bustPreviewWindow.setBust(null);
                }
                if (ConfigManager.language === 'it') {
                    this._helpWindow.setText('Premi OK per aprire questa categoria.');
                } else {
                    this._helpWindow.setText('Press OK to open this category.');
                }
            } else {
                // In bust mode, show the actual bust preview
                if (this._bustPreviewWindow) {
                    this._bustPreviewWindow.setBust(selectedBust);
                }
                if (ConfigManager.language === 'it') {
                    this._helpWindow.setText("Selezionato: " + selectedBust);
                } else {
                    this._helpWindow.setText("Selected: " + selectedBust);
                }
            }
        }

        onBustSelected() {
            const isInCategoryMode = this._bustListWindow.isInCategoryMode();

            if (isInCategoryMode) {
                // In category mode, open the selected category
                const selectedIndex = this._bustListWindow.index();
                this._bustListWindow.openCategory(selectedIndex);
                SoundManager.playOk();
            } else {
                // In bust mode, select the bust
                const selectedBust = this._bustListWindow.getSelectedBust();
                if (selectedBust) {
                    // Store the selected bust image name in a variable for later use
                    // Variable 109 is used to store the selected bust
                    $gameVariables.setValue(109, selectedBust);

                    // Set Variable 87 based on category and gender
                    const currentCategory = this._bustListWindow.getCurrentCategory();
                    const genderValue = $gameVariables.value(38);

                    // Bot category: no reproductive organs (-1)
                    if (currentCategory === 'Bot') {
                        $gameVariables.setValue(87, -1);
                    }
                    // Female Goblin: oviparous (2)
                    else if (currentCategory === 'Goblin' && genderValue === 1) {
                        $gameVariables.setValue(87, 2);
                    }

                    SoundManager.playOk();
                    // Pop both the bust selector and sprite selector scenes to fully close
                    SceneManager.pop();
                    SceneManager.pop();
                }
            }
        }

        onBustCancel() {
            const isInCategoryMode = this._bustListWindow.isInCategoryMode();

            if (isInCategoryMode) {
                // Already in category mode, close the scene
                SoundManager.playCancel();
                SceneManager.pop();
            } else {
                // In bust mode, go back to categories
                this._bustListWindow.goBackToCategories();
                SoundManager.playCancel();
            }
        }
    }

    // Window to display list of busts (left panel)
    class Window_BustList extends Window_Selectable {
        constructor(rect) {
            super(rect);
            this._bustFiles = [];
            this._bustCategories = {};
            this._allBusts = [];
            this._categoryMode = true; // True = showing categories, False = showing busts in category
            this._currentCategory = null;
            this.loadBustFiles();
            this.refresh();
        }

        loadBustFiles() {
            this._allBusts = [];

            // Try to use Node.js fs module for file system access
            try {
                const fs = require('fs');
                const path = require('path');
                const bustsPath = path.join(path.dirname(process.mainModule.filename), 'img/busts/');

                const files = fs.readdirSync(bustsPath);
                for (const file of files) {
                    const filePath = path.join(bustsPath, file);
                    const stat = fs.statSync(filePath);

                    // Only include files (not subdirectories) and only image files
                    if (stat.isFile() && /\.(png|jpg|jpeg|gif|webp)$/i.test(file)) {
                        // Remove file extension
                        const nameWithoutExt = file.replace(/\.(png|jpg|jpeg|gif|webp)$/i, '');
                        this._allBusts.push(nameWithoutExt);
                    }
                }
            } catch (error) {
                console.error('Error loading bust files:', error);
                // Fallback: try common numbering patterns if Node.js fs is unavailable
                this.loadBustFilesFallback();
                return;
            }

            // Sort alphabetically
            this._allBusts.sort((a, b) => a.localeCompare(b));
            this.categorizeBusts();
        }

        loadBustFilesFallback() {
            // Fallback method using image loading tests
            const commonNames = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9',
                'Astronaut1', 'ElvenTrader', 'GoblinBard', 'GoblinCleric', 'GoblinMonk',
                'GoblinVampire', 'Miner', 'Nurse1', 'Scavenger', 'VoidSpawn',
                'Space Horrors 01', 'Space Horrors 03', 'Space Horrors 04'];

            let loadedCount = 0;
            const totalToTry = commonNames.length;

            commonNames.forEach(filename => {
                this.tryAddBust(filename, () => {
                    loadedCount++;
                    if (loadedCount === totalToTry) {
                        this._allBusts.sort((a, b) => a.localeCompare(b));
                        this.categorizeBusts();
                        this.refresh();
                    }
                });
            });
        }

        tryAddBust(filename, callback) {
            // Create an image element to test if file exists
            const image = new Image();
            image.onload = () => {
                // File exists, add it if not already in list
                if (this._allBusts.indexOf(filename) === -1) {
                    this._allBusts.push(filename);
                }
                if (callback) callback();
            };
            image.onerror = () => {
                // File doesn't exist, skip silently
                if (callback) callback();
            };
            // Use crossOrigin to avoid CORS issues with local files
            image.crossOrigin = 'anonymous';
            image.src = `img/busts/${filename}.png`;
        }

        categorizeBusts() {
            this._bustCategories = {
                'Human': [],
                'Orc': [],
                'Goblin': [],
                'Elven': [],
                'Bot': [],
                'Android': [],
                'Avian': [],
                'Cat': [],
                'Kobold': [],
                'Alien': [],
                'Void': [],
                'Insectoid': []
            };

            for (const bust of this._allBusts) {
                if (bust.startsWith('Orc')) {
                    this._bustCategories['Orc'].push(bust);
                } else if (bust.startsWith('Goblin')) {
                    this._bustCategories['Goblin'].push(bust);
                } else if (bust.startsWith('Elven')) {
                    this._bustCategories['Elven'].push(bust);
                } else if (bust.startsWith('Bot')) {
                    this._bustCategories['Bot'].push(bust);
                } else if (bust.startsWith('Android')) {
                    this._bustCategories['Android'].push(bust);
                } else if (bust.startsWith('Cat')) {
                    this._bustCategories['Cat'].push(bust);
                } else if (bust.startsWith('Kobold')) {
                    this._bustCategories['Kobold'].push(bust);
                }else if (bust.startsWith('Alien')) {
                    this._bustCategories['Alien'].push(bust);
                }else if (bust.startsWith('Insectoid')) {
                    this._bustCategories['Insectoid'].push(bust);
                }else {
                    this._bustCategories['Human'].push(bust);
                }
            }

            // Update bust files to show categories if in category mode
            this.updateDisplayList();
        }

        updateDisplayList() {
            if (this._categoryMode) {
                // Show categories
                this._bustFiles = Object.keys(this._bustCategories).filter(
                    cat => this._bustCategories[cat].length > 0
                );
            } else if (this._currentCategory) {
                // Show busts in current category
                this._bustFiles = [...this._bustCategories[this._currentCategory]];
            }
        }

        isCategory(index) {
            return this._categoryMode && this._bustFiles[index] !== undefined;
        }

        openCategory(index) {
            const category = this._bustFiles[index];
            if (category && this._bustCategories[category].length > 0) {
                this._currentCategory = category;
                this._categoryMode = false;
                this.updateDisplayList();
                this._index = -1; // Reset index
                this.select(0);
                this.refresh();
                // Trigger the select handler to update preview
                if (this.isHandled('select')) {
                    this.callHandler('select');
                }
            }
        }

        goBackToCategories() {
            this._categoryMode = true;
            this._currentCategory = null;
            this.updateDisplayList();
            this._index = -1; // Reset index
            this.select(0);
            this.refresh();
            // Trigger the select handler to update preview
            if (this.isHandled('select')) {
                this.callHandler('select');
            }
        }

        maxCols() {
            return 1;
        }

        maxItems() {
            return this._bustFiles.length;
        }

        itemHeight() {
            return this.lineHeight();
        }

        drawItem(index) {
            if (!this._bustFiles[index]) return;

            const filename = this._bustFiles[index];
            const rect = this.itemLineRect(index);

            // If in category mode, add folder icon or special formatting
            if (this._categoryMode) {
                this.changeTextColor(this.systemColor());
                this.drawText('📁 ' + filename, rect.x, rect.y, rect.width);
                this.resetTextColor();
            } else {
                // In bust mode, remove category prefix from display name
                const displayName = this.stripCategoryPrefix(filename);
                this.drawText(displayName, rect.x, rect.y, rect.width);
            }
        }

        stripCategoryPrefix(bustName) {
            const categories = ['Orc', 'Goblin', 'Elven', 'Bot', 'Android', 'Cat'];
            for (const category of categories) {
                if (bustName.startsWith(category)) {
                    return bustName.substring(category.length);
                }
            }
            return bustName;
        }

        getSelectedBust() {
            if (this.index() >= 0 && this.index() < this._bustFiles.length) {
                return this._bustFiles[this.index()];
            }
            return null;
        }

        getCurrentCategory() {
            return this._currentCategory;
        }

        isInCategoryMode() {
            return this._categoryMode;
        }

        preselectBust(bustName) {
            // Find which category contains this bust
            let targetCategory = null;
            for (const cat of Object.keys(this._bustCategories)) {
                if (this._bustCategories[cat].includes(bustName)) {
                    targetCategory = cat;
                    break;
                }
            }

            // If no category found, stay in default category view
            if (!targetCategory) return;

            // Switch into that category
            this._currentCategory = targetCategory;
            this._categoryMode = false;
            this.updateDisplayList();

            // Select the bust within the category
            const bustIndex = this._bustFiles.indexOf(bustName);
            this._index = -1;
            this.select(bustIndex >= 0 ? bustIndex : 0);
            this.refresh();
            if (bustIndex >= 0) this.ensureCursorVisible();
        }

        select(index) {
            super.select(index);
            // Trigger the select handler when selection changes
            if (this.isHandled('select')) {
                this.callHandler('select');
            }
        }
    }

    // Window to display bust preview (right panel)
    class Window_BustPreview extends Window_Base {
        constructor(rect) {
            super(rect);
            this._bustBitmap = null;
            this._currentBust = null;
            this.refresh();
        }

        setBust(filename) {
            if (this._currentBust !== filename) {
                this._currentBust = filename;
                this._bustBitmap = null;
                this.refresh();
            }
        }

        refresh() {
            this.contents.clear();

            if (!this._currentBust) {
                this.drawText('Select a bust', 0, 0, this.contentsWidth(), 'center');
                return;
            }

            const bitmap = ImageManager.loadBitmap(`img/busts/`, this._currentBust);
            if (!bitmap.isReady()) {
                bitmap.addLoadListener(() => this.refresh());
                return;
            }

            // Draw the bust image centered in the preview window, cropping top 180 pixels
            const originalWidth = 889;
            const originalHeight = 1200;
            const cropTop = 180; // Crop top 180 pixels
            const croppedHeight = originalHeight - cropTop; // 1020 pixels

            const maxWidth = this.contentsWidth() - 16;
            const maxHeight = this.contentsHeight() - 16;

            // Calculate aspect ratio and scale accordingly based on cropped dimensions
            const scale = Math.min(maxWidth / originalWidth, maxHeight / croppedHeight);
            const scaledWidth = Math.floor(originalWidth * scale);
            const scaledHeight = Math.floor(croppedHeight * scale);

            // Center the bust in the window
            const x = Math.floor((this.contentsWidth() - scaledWidth) / 2);
            const y = Math.floor((this.contentsHeight() - scaledHeight) / 2);

            // Draw the bust image with cropped top (starting from y=180 in the source image)
            this.contents.blt(
                bitmap,
                0, cropTop, originalWidth, croppedHeight,
                x, y, scaledWidth, scaledHeight
            );
        }
    }

    // Patch the prepareNextScene method to properly handle Scene_SpriteGridSelector and Scene_BustSelector
    const _SceneManager_prepareNextScene = SceneManager.prepareNextScene;
    SceneManager.prepareNextScene = function(sceneClass, ...args) {
        if (sceneClass === Scene_SpriteGridSelector || sceneClass === Scene_BustSelector) {
            // Handle sprite grid selector and bust selector preparation
            const [actorId] = args;
            if (sceneClass === Scene_SpriteGridSelector) {
                Scene_SpriteGridSelector.prototype.setActor = function(actorId) {
                    this._actorId = actorId || 1;
                };
            } else if (sceneClass === Scene_BustSelector) {
                Scene_BustSelector.prototype.setActor = function(actorId) {
                    this._actorId = actorId || 1;
                };
            }
            _SceneManager_prepareNextScene.apply(this, [sceneClass]);
            if (this._nextScene && actorId) {
                this._nextScene.setActor(actorId);
            }
        } else {
            // Handle all other scenes normally
            _SceneManager_prepareNextScene.apply(this, arguments);
        }
    };

    // Register plugin commands
    PluginManager.registerCommand(pluginName, "OpenSpriteSelector", () => {
        SceneManager.push(Scene_SpriteGridSelector);
    });
    
    PluginManager.registerCommand(pluginName, "OpenSpriteSelectorForActor", args => {
        const actorId = parseInt(args.actorId) || 1;
        SceneManager.push(Scene_SpriteGridSelector);
        if (SceneManager._nextScene) {
            SceneManager._nextScene.setActor(actorId);
        }
    });
    
    // Register the new random sprite selection command
    PluginManager.registerCommand(pluginName, "SelectRandomSprite", args => {
        const actorId = parseInt(args.actorId) || 1;
        const randomSprite = selectRandomSprite(actorId);

    });

    // Expose selectRandomSprite globally for use by other plugins
    window.selectRandomSpriteForActor = function(actorId) {
        return selectRandomSprite(actorId);
    };

    // Global function to select a random bust and store it in appropriate variable
    window.selectRandomBustForActor = function(actorId) {
        // Get a list of all available bust files
        const availableBusts = [];

        // Try to use Node.js fs module for file system access
        try {
            const fs = require('fs');
            const path = require('path');
            const bustsPath = path.join(path.dirname(process.mainModule.filename), 'img/busts/');
            const files = fs.readdirSync(bustsPath);
            for (const file of files) {
                const filePath = path.join(bustsPath, file);
                const stat = fs.statSync(filePath);
                if (stat.isFile() && /\.(png|jpg|jpeg|gif|webp)$/i.test(file)) {
                    const nameWithoutExt = file.replace(/\.(png|jpg|jpeg|gif|webp)$/i, '');
                    availableBusts.push(nameWithoutExt);
                }
            }
        } catch (error) {
            console.warn('Could not load bust files via fs, using fallback list');
            // Fallback: add some common bust names
            for (let i = 1; i <= 200; i++) {
                availableBusts.push(String(i));
            }
        }

        if (availableBusts.length === 0) {
            console.warn('No bust files available for random selection');
            return null;
        }

        // Select a random bust
        const randomIndex = Math.floor(Math.random() * availableBusts.length);
        const randomBust = availableBusts[randomIndex];

        // Store in appropriate variable based on actor ID
        // Variable 109 = Actor 1, Variable 107 = Actor 2, Variable 108 = Actor 3
        if (actorId === 1) {
            $gameVariables.setValue(109, randomBust);
        } else if (actorId === 2) {
            $gameVariables.setValue(107, randomBust);
        } else if (actorId === 3) {
            $gameVariables.setValue(108, randomBust);
        }

        return randomBust;
    };
})();
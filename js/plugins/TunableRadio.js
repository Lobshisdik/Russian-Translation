//=============================================================================
// TunableRadio.js - FIXED VERSION
//=============================================================================

/*:
 * @target MZ
 * @plugindesc [v1.1.1] Tunable Radio System - Fixed Subfolder Scanning
 * @author Omni-Lex
 * @url https://nocoldiz.itch.io/hypernet-explorer
 * @help TunableRadio.js
 * 
 * @param noiseFile
 * @text Noise File
 * @desc BGM file to play for static/noise (without extension)
 * @type string
 * @default Noise
 * 
 * @param showInMenu
 * @text Show in Menu
 * @desc Add Radio option to the main menu
 * @type boolean
 * @default true
 * 
 * @param menuText
 * @text Menu Text
 * @desc Text to display in the menu for radio option
 * @type string
 * @default Radio
 * 
 * @param bgmFolders
 * @text BGM Subfolders
 * @desc Comma-separated list of subfolders to scan (leave empty for root only)
 * @type string
 * @default ComigoGames,Moogify,Nocoldiz,Old,RandomMind,TallBeard
 * 
 * @param enableFavorites
 * @text Enable Favorites
 * @desc Allow players to mark stations as favorites
 * @type boolean
 * @default true
 * 
 * @param enableAutoScan
 * @text Enable Auto Scan
 * @desc Add auto-scan feature to find next valid station
 * @type boolean
 * @default true
 * 
 * @param radioVolume
 * @text Radio Volume
 * @desc Default volume for radio playback (0-100)
 * @type number
 * @min 0
 * @max 100
 * @default 85
 * 
 * @param showStationInfo
 * @text Show Station Info
 * @desc Display additional station information
 * @type boolean
 * @default true
 * 
 * @param saveLastStation
 * @text Save Last Station
 * @desc Remember last tuned station between game sessions
 * @type boolean
 * @default true
 * 
 * @command openRadio
 * @text Open Radio
 * @desc Opens the radio interface
 * 
 * @command closeRadio
 * @text Close Radio
 * @desc Closes the radio interface
 * 
 * @command scanStations
 * @text Scan for Stations
 * @desc Rescans BGM folder for new music files
 * 
 * @command setVolume
 * @text Set Radio Volume
 * @desc Sets the radio volume
 * @arg volume
 * @type number
 * @min 0
 * @max 100
 * @default 85
 * 
 * This plugin creates a tunable radio system with AM, FM, and EM bands.
 * Automatically scans BGM folder and subfolders for music files.
 * Creates valid frequencies for each song found.
 * 
 * Features:
 * - Dynamic frequency generation based on actual BGM files
 * - Subfolder support for organized music libraries
 * - Favorites system to mark preferred stations
 * - Auto-scan to find next available station
 * - Volume control and station information
 * - Save/load last tuned station
 * 
 * Controls:
 * - Left/Right: Change frequency
 * - Up/Down: Change band
 * - Page Up/Down: Auto-scan for stations
 * - Enter/Space: Toggle favorite
 * - Shift + Left/Right: Quick tune to favorites
 * - Shift + Up/Down: Adjust volume
 * 
 * Use the "Open Radio" plugin command to show the radio interface.
 * Make sure you have a "Noise.ogg" file in your BGM folder for static.
 */

(() => {
    'use strict';
    
    const pluginName = 'TunableRadio';
    const parameters = PluginManager.parameters(pluginName);
    const noiseFile = parameters['noiseFile'] || 'Noise';
    const showInMenu = parameters['showInMenu'] === 'true';
    const menuText = parameters['menuText'] || 'Radio';
    const bgmFolders = parameters['bgmFolders'] ? parameters['bgmFolders'].split(',').map(s => s.trim()) : [];
    const enableFavorites = parameters['enableFavorites'] === 'true';
    const enableAutoScan = parameters['enableAutoScan'] === 'true';
    const radioVolume = parseInt(parameters['radioVolume']) || 85;
    const showStationInfo = parameters['showStationInfo'] === 'true';
    const saveLastStation = parameters['saveLastStation'] === 'true';
    
    // Radio system state
    let radioData = {
        isOpen: false,
        currentBand: 0, // 0: AM, 1: FM, 2: EM
        currentFrequency: 0,
        stations: [], // Will be populated dynamically
        bandNames: ['AM', 'FM', 'EM'],
        frequencies: [], // Will be generated based on actual songs
        currentlyPlaying: null,
        totalStations: 0,
        favorites: [], // Array of favorite stations {band, frequency}
        currentVolume: radioVolume,
        isScanning: false,
        scanDirection: 1, // 1 for forward, -1 for backward
        stationInfo: {}, // Additional info for stations
        lastStation: { band: 0, frequency: 0 } // Save last tuned station
    };
    
    // Key mappings
    Input.keyMapper[27] = 'escape'; // Escape key
    Input.keyMapper[33] = 'pageup'; // Page Up
    Input.keyMapper[34] = 'pagedown'; // Page Down
    Input.keyMapper[13] = 'ok'; // Enter key
    Input.keyMapper[32] = 'ok'; // Space key
    
    // Determine music genre based on filename and path
    function determineGenre(name, path) {
        const lowerName = name.toLowerCase();
        const lowerPath = path.toLowerCase();
        
        // Check by subfolder first (more accurate)
        if (lowerPath.includes('comigogames/') || lowerPath.includes('comigogames')) return 'ComigoGames';
        if (lowerPath.includes('moogify/') || lowerPath.includes('moogify')) return 'Moogify';
        if (lowerPath.includes('nocoldiz/') || lowerPath.includes('nocoldiz')) return 'Nocoldiz';
        if (lowerPath.includes('old/') || lowerPath.includes('old')) return 'Old/Classic';
        if (lowerPath.includes('randommind/') || lowerPath.includes('randommind')) return 'RandomMind';
        if (lowerPath.includes('') || lowerPath.includes('tallbeard')) return 'TallBeard';
        
        // Fallback to filename-based detection
        if (lowerName.includes('battle')) return 'Battle';
        if (lowerName.includes('town') || lowerName.includes('city')) return 'Town';
        if (lowerName.includes('field') || lowerName.includes('world')) return 'Field';
        if (lowerName.includes('dungeon') || lowerName.includes('cave')) return 'Dungeon';
        if (lowerName.includes('theme') || lowerName.includes('main')) return 'Theme';
        if (lowerName.includes('boss') || lowerName.includes('final')) return 'Boss';
        if (lowerName.includes('menu') || lowerName.includes('title')) return 'Menu';
        if (lowerName.includes('sad') || lowerName.includes('emotional')) return 'Emotional';
        if (lowerName.includes('happy') || lowerName.includes('cheerful')) return 'Upbeat';
        
        return 'Misc';
    }
    
    // Save radio data to game variables
    function saveRadioData() {
        if (saveLastStation && $dataSystem && $gameVariables) {
            $gameVariables.setValue(1001, JSON.stringify({
                lastStation: radioData.lastStation,
                favorites: radioData.favorites,
                volume: radioData.currentVolume
            }));
        }
    }
    
    // Load radio data from game variables
    function loadRadioData() {
        if (saveLastStation && $dataSystem && $gameVariables) {
            try {
                const savedData = JSON.parse($gameVariables.value(1001) || '{}');
                if (savedData.lastStation) {
                    radioData.lastStation = savedData.lastStation;
                    radioData.currentBand = savedData.lastStation.band || 0;
                    radioData.currentFrequency = savedData.lastStation.frequency || 0;
                }
                if (savedData.favorites) {
                    radioData.favorites = savedData.favorites;
                }
                if (savedData.volume) {
                    radioData.currentVolume = savedData.volume;
                }
            } catch (e) {
                console.warn('Could not load radio data:', e);
            }
        }
    }
    
    // Generate realistic frequencies based on number of songs
    function generateFrequencies(bgmList) {
        const totalSongs = bgmList.length;
        const songsPerBand = Math.ceil(totalSongs / 3);
        
        radioData.frequencies = {
            AM: [],
            FM: [],
            EM: []
        };
        
        // AM frequencies (540-1700 kHz)
        for (let i = 0; i < songsPerBand; i++) {
            const freq = 540 + (i * (1160 / Math.max(songsPerBand - 1, 1)));
            radioData.frequencies.AM.push(freq.toFixed(0) + ' kHz');
        }
        
        // FM frequencies (88.1-107.9 MHz)
        for (let i = 0; i < songsPerBand; i++) {
            const freq = 88.1 + (i * (19.8 / Math.max(songsPerBand - 1, 1)));
            radioData.frequencies.FM.push(freq.toFixed(1) + ' MHz');
        }
        
        // EM frequencies (1420-10000 MHz)
        for (let i = 0; i < songsPerBand; i++) {
            const freq = 1420 + (i * (8580 / Math.max(songsPerBand - 1, 1)));
            radioData.frequencies.EM.push(freq.toFixed(0) + ' MHz');
        }
    }
    
    // Distribute stations across bands
    function distributeStations(bgmList) {
        radioData.stations = {
            AM: [],
            FM: [],
            EM: []
        };
        
        const bands = ['AM', 'FM', 'EM'];
        let currentBand = 0;
        
        bgmList.forEach((bgm, index) => {
            const band = bands[currentBand];
            radioData.stations[band].push(bgm);
            currentBand = (currentBand + 1) % 3;
        });
        
        // Ensure each band has at least one empty slot for tuning
        bands.forEach(band => {
            while (radioData.stations[band].length < radioData.frequencies[band].length) {
                radioData.stations[band].push(null);
            }
        });
    }
    
    // NEW: Enhanced BGM file scanner that properly handles subfolders
    async function scanBGMFiles() {
        console.log('🔍 Starting enhanced BGM file scan...');
        const bgmList = [];
        const supportedExtensions = ['.ogg'];
        
        try {
            // Method 1: Try NW.js file system scanning (most reliable)
            if (await tryNWJSScanning(bgmList, supportedExtensions)) {
                console.log('✅ Used NW.js file system scanning');
                return bgmList;
            }
            
            // Method 2: Try browser-based approaches
            if (await tryBrowserScanning(bgmList, supportedExtensions)) {
                console.log('✅ Used browser-based scanning');
                return bgmList;
            }
            
            // Method 3: Fallback to AudioManager and DataSystem
            await tryFallbackScanning(bgmList);
            console.log('⚠️ Used fallback scanning method');
            
        } catch (e) {
            console.error('❌ Error during BGM scanning:', e);
            await tryFallbackScanning(bgmList);
        }
        
        return bgmList;
    }
    
    // Enhanced NW.js scanning
    async function tryNWJSScanning(bgmList, extensions) {
        if (typeof require === 'undefined') return false;
        
        try {
            const fs = require('fs');
            const path = require('path');
            
            console.log('📁 Scanning with NW.js file system...');
            
            // Scan root BGM folder
            await scanNWJSFolder('audio/bgm/', '', bgmList, extensions, fs, path);
            
            // Scan specified subfolders
            for (const folder of bgmFolders) {
                if (folder.trim()) {
                    const folderPath = `audio/bgm/${folder.trim()}/`;
                    await scanNWJSFolder(folderPath, folder.trim(), bgmList, extensions, fs, path);
                }
            }
            
            return bgmList.length > 0;
        } catch (e) {
            console.warn('NW.js scanning failed:', e);
            return false;
        }
    }
    
    // Enhanced NW.js folder scanning with recursive support
    async function scanNWJSFolder(folderPath, folderName, bgmList, extensions, fs, path) {
        try {
            const fullPath = path.join(process.cwd(), folderPath);
            console.log(`🔍 Checking folder: ${fullPath}`);
            
            if (!fs.existsSync(fullPath)) {
                console.warn(`📂 Folder not found: ${fullPath}`);
                return;
            }
            
            const files = fs.readdirSync(fullPath);
            console.log(`📋 Found ${files.length} items in ${folderPath}`);
            
            for (const file of files) {
                const filePath = path.join(fullPath, file);
                const stat = fs.statSync(filePath);
                
                if (stat.isDirectory()) {
                    // Recursively scan subdirectories
                    const subFolderName = folderName ? `${folderName}/${file}` : file;
                    await scanNWJSFolder(`${folderPath}${file}/`, subFolderName, bgmList, extensions, fs, path);
                } else if (stat.isFile()) {
                    const ext = path.extname(file).toLowerCase();
                    if (extensions.includes(ext)) {
                        const nameWithoutExt = path.basename(file, ext);
                        if (nameWithoutExt !== noiseFile) {
                            const displayName = folderName ? `${folderName}: ${nameWithoutExt}` : nameWithoutExt;
                            const relativePath = folderName ? `${folderName}/${nameWithoutExt}` : nameWithoutExt;
                            
                            // Check for duplicates
                            if (!bgmList.some(bgm => bgm.path === relativePath)) {
                                bgmList.push({
                                    name: displayName,
                                    path: relativePath,
                                    folder: folderName || 'root',
                                    fullPath: filePath
                                });
                                console.log(`🎵 Found: ${displayName}`);
                            }
                        }
                    }
                }
            }
        } catch (e) {
            console.warn(`Error scanning folder ${folderPath}:`, e);
        }
    }
    
    // Enhanced browser scanning
    async function tryBrowserScanning(bgmList, extensions) {
        console.log('🌐 Trying browser-based scanning...');
        
        // Try to access window.nw for NW.js detection
        if (typeof window !== 'undefined' && window.nw) {
            return await tryNWAPIScanning(bgmList, extensions);
        }
        
        // Try IndexedDB scanning for cached files
        return await tryIndexedDBScanning(bgmList);
    }
    
    // Try NW.js API if available
    async function tryNWAPIScanning(bgmList, extensions) {
        try {
            // This would use NW.js specific APIs if available
            console.log('🔧 NW.js API scanning not implemented yet');
            return false;
        } catch (e) {
            console.warn('NW.js API scanning failed:', e);
            return false;
        }
    }
    
    // Enhanced IndexedDB scanning
    async function tryIndexedDBScanning(bgmList) {
        try {
            console.log('💾 Trying IndexedDB scanning...');
            
            // Check if there are cached BGM files in browser storage
            if (typeof indexedDB !== 'undefined') {
                // This would scan browser cache for BGM files
                // Implementation depends on how RMMZ caches files
                console.log('📦 IndexedDB available but scanning method needs implementation');
            }
            
            return false;
        } catch (e) {
            console.warn('IndexedDB scanning failed:', e);
            return false;
        }
    }
    
    // Enhanced fallback scanning
    async function tryFallbackScanning(bgmList) {
        console.log('🔄 Using fallback scanning methods...');
        
        // Method 1: Try to scan from DataManager
        await scanFromDataManager(bgmList);
        
        // Method 2: Try to scan from AudioManager cache
        await scanFromAudioManager(bgmList);
        
        // Method 3: Try to scan from ImageManager (sometimes has file lists)
        await scanFromImageManager(bgmList);
        
        // Method 4: Manual file detection attempts
        await tryManualFileDetection(bgmList);
    }
    
    // Enhanced DataManager scanning
    async function scanFromDataManager(bgmList) {
        try {
            console.log('📊 Scanning from DataManager...');
            
            // Check various data sources
            const sources = [
                $dataSystem?.bgmList,
                $dataSystem?.bgslist,
                $dataSystem?.audioList
            ];
            
            for (const source of sources) {
                if (source && Array.isArray(source)) {
                    source.forEach(item => {
                        if (item && item.name && item.name !== noiseFile) {
                            addBGMToList(bgmList, item.name, item.name, 'datamanager');
                        }
                    });
                }
            }
            
            // Also check if DataManager has file manifest
            if (DataManager._databaseFiles) {
                DataManager._databaseFiles.forEach(file => {
                    if (file.src && file.src.includes('bgm')) {
                        const name = file.src.replace(/^.*[\\\/]/, '').replace(/\.[^/.]+$/, '');
                        if (name !== noiseFile) {
                            addBGMToList(bgmList, name, name, 'manifest');
                        }
                    }
                });
            }
        } catch (e) {
            console.warn('DataManager scanning failed:', e);
        }
    }
    
    // Enhanced AudioManager scanning
    async function scanFromAudioManager(bgmList) {
        try {
            console.log('🔊 Scanning from AudioManager...');
            
            // Check AudioManager cache
            if (AudioManager._bgmBuffer && AudioManager._bgmBuffer._reservedSe) {
                Object.keys(AudioManager._bgmBuffer._reservedSe).forEach(name => {
                    if (name && name !== noiseFile) {
                        addBGMToList(bgmList, name, name, 'audiomanager');
                    }
                });
            }
            
            // Check other AudioManager properties
            const audioSources = [
                AudioManager._staticBuffers,
                AudioManager._referencedBgm,
                AudioManager._bgmCache
            ];
            
            audioSources.forEach(source => {
                if (source && typeof source === 'object') {
                    Object.keys(source).forEach(key => {
                        if (key && key !== noiseFile && !key.includes('system')) {
                            addBGMToList(bgmList, key, key, 'audiocache');
                        }
                    });
                }
            });
        } catch (e) {
            console.warn('AudioManager scanning failed:', e);
        }
    }
    
    // Scan from ImageManager (sometimes has file lists)
    async function scanFromImageManager(bgmList) {
        try {
            console.log('🖼️ Scanning from ImageManager...');
            
            if (ImageManager._cache) {
                Object.keys(ImageManager._cache).forEach(key => {
                    if (key.includes('bgm') || key.includes('audio')) {
                        const name = key.replace(/^.*[\\\/]/, '').replace(/\.[^/.]+$/, '');
                        if (name && name !== noiseFile) {
                            addBGMToList(bgmList, name, name, 'imagemanager');
                        }
                    }
                });
            }
        } catch (e) {
            console.warn('ImageManager scanning failed:', e);
        }
    }
    
    // Manual file detection for known folders
    async function tryManualFileDetection(bgmList) {
        console.log('🎯 Trying manual file detection...');
        
        const testFolders = bgmFolders.length > 0 ? bgmFolders : ['ComigoGames', 'Moogify', 'Nocoldiz', 'Old', 'RandomMind', 'TallBeard'];
        const commonFiles = [
            'battle', 'town', 'field', 'dungeon', 'boss', 'theme', 'menu', 'title',
            'victory', 'defeat', 'fanfare', 'sad', 'happy', 'mystery', 'calm'
        ];
        
        // Try to detect files by attempting to load them
        for (const folder of testFolders) {
            for (const baseName of commonFiles) {
                for (let i = 1; i <= 5; i++) {
                    const variants = [
                        `${baseName}`,
                        `${baseName}${i}`,
                        `${baseName}_${i}`,
                        `${folder}_${baseName}`,
                        `${folder.toLowerCase()}_${baseName}`
                    ];
                    
                    for (const variant of variants) {
                        const path = `${folder}/${variant}`;
                        if (await testFileExists(path)) {
                            addBGMToList(bgmList, `${folder}: ${variant}`, path, folder);
                        }
                    }
                }
            }
        }
    }
    
    // Test if a BGM file exists by trying to load it
    async function testFileExists(path) {
        return new Promise((resolve) => {
            try {
                const audio = new Audio();
                audio.onloadeddata = () => resolve(true);
                audio.onerror = () => resolve(false);
                audio.onabort = () => resolve(false);
                
                // Try common extensions
                const extensions = ['.ogg', '.m4a', '.wav', '.mp3'];
                let tested = 0;
                
                const testExtension = (ext) => {
                    audio.src = `audio/bgm/${path}${ext}`;
                    setTimeout(() => {
                        tested++;
                        if (tested >= extensions.length) {
                            resolve(false);
                        }
                    }, 100);
                };
                
                extensions.forEach(testExtension);
            } catch (e) {
                resolve(false);
            }
        });
    }
    
    // Helper function to add BGM to list with duplicate checking
    function addBGMToList(bgmList, displayName, path, folder) {
        if (!bgmList.some(bgm => bgm.path === path)) {
            bgmList.push({
                name: displayName,
                path: path,
                folder: folder
            });
            console.log(`🎵 Added: ${displayName} (${folder})`);
        }
    }
    
    // Initialize the radio system
    async function initializeRadio() {
        console.log('🎵 Initializing Enhanced Radio System...');
        console.log(`📂 Configured subfolders: ${bgmFolders.join(', ')}`);
        
        // Scan for actual BGM files using enhanced methods
        const bgmList = await scanBGMFiles();
        
        // Remove duplicates and noise file
        const uniqueBGM = bgmList.filter((bgm, index, self) => 
            index === self.findIndex(b => b.path === bgm.path) && 
            bgm.name !== noiseFile &&
            bgm.path !== noiseFile
        );
        
        radioData.totalStations = uniqueBGM.length;
        
        if (uniqueBGM.length === 0) {
            console.warn('⚠️ No BGM files found for radio stations');
            // Add a placeholder station
            uniqueBGM.push({ 
                name: 'No Music Found', 
                path: null, 
                folder: 'system' 
            });
            radioData.totalStations = 1;
        } else {
            console.log(`🎶 Found ${uniqueBGM.length} BGM files for radio stations`);
            
            // Log found files by folder
            const byFolder = {};
            uniqueBGM.forEach(bgm => {
                const folder = bgm.folder || 'unknown';
                if (!byFolder[folder]) byFolder[folder] = [];
                byFolder[folder].push(bgm.name);
            });
            
            // Show organized results
            console.log('📂 Files found by source:');
            Object.keys(byFolder).sort().forEach(folder => {
                const icon = folder === 'root' ? '🎵' : 
                           folder === 'ComigoGames' ? '🎮' :
                           folder === 'Moogify' ? '🎹' :
                           folder === 'Nocoldiz' ? '❄️' :
                           folder === 'Old' ? '📼' :
                           folder === 'RandomMind' ? '🧠' :
                           folder === 'TallBeard' ? '🧙‍♂️' : '📁';
                console.log(`  ${icon} ${folder}: ${byFolder[folder].length} files`);
                
                // Show first few files as examples
                const examples = byFolder[folder].slice(0, 3);
                examples.forEach(name => {
                    console.log(`    • ${name}`);
                });
                if (byFolder[folder].length > 3) {
                    console.log(`    ... and ${byFolder[folder].length - 3} more`);
                }
            });
        }
        
        // Generate frequencies and distribute across bands
        generateFrequencies(uniqueBGM);
        distributeStations(uniqueBGM);
        
        // Generate station info
        uniqueBGM.forEach((bgm, index) => {
            if (bgm.path) {
                radioData.stationInfo[bgm.path] = {
                    genre: determineGenre(bgm.name, bgm.path),
                    duration: 'Unknown',
                    bitrate: '128 kbps',
                    addedTime: new Date().toLocaleDateString(),
                    folder: bgm.folder || 'unknown'
                };
            }
        });
        
        // Load saved data after initialization
        loadRadioData();
        
        console.log('✅ Enhanced Radio System initialized successfully');
        console.log(`📊 Total stations: ${radioData.totalStations}`);
        console.log(`📡 Stations per band: AM=${radioData.stations.AM.filter(s => s && s.path).length}, FM=${radioData.stations.FM.filter(s => s && s.path).length}, EM=${radioData.stations.EM.filter(s => s && s.path).length}`);
    }
    
    // Play current station
    function playCurrentStation() {
        const band = radioData.bandNames[radioData.currentBand];
        const stationsInBand = radioData.stations[band];
        const currentFreq = Math.min(radioData.currentFrequency, stationsInBand.length - 1);
        const station = stationsInBand[currentFreq];
        
        if (station && station.path) {
            // Play the BGM
            const bgm = {
                name: station.path,
                volume: radioData.currentVolume,
                pitch: 100,
                pan: 0
            };
            AudioManager.playBgm(bgm);
            radioData.currentlyPlaying = station.path;
        } else {
            // Play noise/static
            const noiseBgm = {
                name: noiseFile,
                volume: Math.max(20, radioData.currentVolume - 20), // Quieter static
                pitch: 100 + Math.random() * 10 - 5, // Variable pitch for realism
                pan: 0
            };
            AudioManager.playBgm(noiseBgm);
            radioData.currentlyPlaying = noiseFile;
        }
    }
    
    // Get station statistics
    function getStationStats() {
        let totalStations = 0;
        let stationsByBand = { AM: 0, FM: 0, EM: 0 };
        let favoriteCount = radioData.favorites.length;
        
        radioData.bandNames.forEach(band => {
            const validStations = radioData.stations[band].filter(station => station && station.path);
            stationsByBand[band] = validStations.length;
            totalStations += validStations.length;
        });
        
        return {
            total: totalStations,
            byBand: stationsByBand,
            favorites: favoriteCount
        };
    }
    
    // Radio Window Class
    class Window_Radio extends Window_Base {
        constructor() {
            const width = 480;
            const height = 320;
            const x = (Graphics.boxWidth - width) / 2;
            const y = (Graphics.boxHeight - height) / 2;
            const rect = new Rectangle(x, y, width, height);
            super(rect);
            this.refresh();
        }
        
        refresh() {
            this.contents.clear();
            this.drawBackground();
            this.drawRadioInterface();
        }
        
        drawBackground() {
            // Draw radio background
            const color1 = '#2c3e50';
            const color2 = '#34495e';
            this.contents.gradientFillRect(0, 0, this.contents.width, this.contents.height, color1, color2);
            
            // Draw radio frame
            this.contents.fillRect(20, 20, this.contents.width - 40, this.contents.height - 40, '#1a252f');
            this.contents.strokeRect(20, 20, this.contents.width - 40, this.contents.height - 40, '#7f8c8d');
        }
        
        drawRadioInterface() {
            const band = radioData.bandNames[radioData.currentBand];
            const stationsInBand = radioData.stations[band];
            const maxFreq = Math.max(0, stationsInBand.length - 1);
            const currentFreq = Math.min(radioData.currentFrequency, maxFreq);
            const frequency = radioData.frequencies[band][currentFreq] || 'N/A';
            const station = stationsInBand[currentFreq];
            const isFavorite = this.isCurrentStationFavorite();
            
            // Title
            this.changeTextColor('#ecf0f1');
            this.drawText('PORTABLE RADIO', 0, 30, this.contents.width, 'center');
            
            // Scanning indicator
            if (radioData.isScanning) {
                this.changeTextColor('#f39c12');
                this.drawText('SCANNING...', 0, 55, this.contents.width, 'center');
            }
            
            // Band display
            this.changeTextColor('#e74c3c');
            this.drawText('BAND: ' + band, 60, 80, 200, 'left');
            
            // Frequency display
            this.changeTextColor('#3498db');
            this.drawText('FREQ: ' + frequency, 60, 110, 200, 'left');
            
            // Volume display
            this.changeTextColor('#9b59b6');
            this.drawText(`VOL: ${radioData.currentVolume}%`, 260, 80, 100, 'left');
            
            // Station counter
            this.changeTextColor('#95a5a6');
            this.drawText(`${currentFreq + 1}/${stationsInBand.length}`, 370, 80, 80, 'left');
            
            // Favorite indicator
            if (enableFavorites && isFavorite) {
                this.changeTextColor('#e74c3c');
                this.drawText('★', 260, 110, 20, 'left');
            }
            
            // Total stations info
            this.changeTextColor('#95a5a6');
            this.drawText(`Total: ${radioData.totalStations}`, 280, 110, 200, 'left');
            
            // Station display
            this.changeTextColor('#f39c12');
            if (station && station.path) {
                this.drawText('♪ ' + station.name, 60, 140, this.contents.width - 120, 'left');
                this.changeTextColor('#27ae60');
                this.drawText('● ON AIR', 60, 165, 200, 'left');
                
                // Station info
                if (showStationInfo && radioData.stationInfo[station.path]) {
                    const info = radioData.stationInfo[station.path];
                    this.changeTextColor('#7f8c8d');
                    this.drawText(`Genre: ${info.genre}`, 260, 140, 200, 'left');
                    this.drawText(`Quality: ${info.bitrate}`, 260, 165, 200, 'left');
                }
            } else {
                this.changeTextColor('#95a5a6');
                this.drawText('--- STATIC ---', 60, 140, this.contents.width - 120, 'left');
                this.changeTextColor('#e74c3c');
                this.drawText('○ OFF AIR', 60, 165, 200, 'left');
            }
            
            // Frequency bar
            this.drawFrequencyBar();
            
            // Controls
            this.changeTextColor('#bdc3c7');
            this.drawText('← → Tune  ↑ ↓ Band', 60, 220, 300, 'left');
            if (enableAutoScan) {
                this.drawText('PgUp/PgDn Scan', 60, 240, 200, 'left');
            }
            if (enableFavorites) {
                this.drawText('Enter ★', 260, 240, 100, 'left');
            }
            this.drawText('Shift+↑↓ Vol  ESC Close', 60, 260, 300, 'left');
        }
        
        isCurrentStationFavorite() {
            return radioData.favorites.some(fav => 
                fav.band === radioData.currentBand && 
                fav.frequency === radioData.currentFrequency
            );
        }
        
        drawFrequencyBar() {
            const barX = 60;
            const barY = 190;
            const barWidth = this.contents.width - 120;
            const barHeight = 20;
            
            const band = radioData.bandNames[radioData.currentBand];
            const stationsInBand = radioData.stations[band];
            const totalFreqs = stationsInBand.length;
            
            // Background
            this.contents.fillRect(barX, barY, barWidth, barHeight, '#34495e');
            this.contents.strokeRect(barX, barY, barWidth, barHeight, '#7f8c8d');
            
            if (totalFreqs > 0) {
                // Station markers
                for (let i = 0; i < totalFreqs; i++) {
                    const markerX = barX + (barWidth / totalFreqs) * i + (barWidth / totalFreqs) / 2;
                    const hasStation = stationsInBand[i] && stationsInBand[i].path;
                    const isFavorite = radioData.favorites.some(fav => 
                        fav.band === radioData.currentBand && fav.frequency === i
                    );
                    
                    let color = '#95a5a6'; // Empty station
                    if (hasStation && isFavorite) {
                        color = '#e74c3c'; // Favorite station
                    } else if (hasStation) {
                        color = '#27ae60'; // Regular station
                    }
                    
                    this.contents.fillRect(markerX - 2, barY + 2, 4, barHeight - 4, color);
                    
                    // Favorite star marker
                    if (hasStation && isFavorite) {
                        this.changeTextColor('#e74c3c');
                        this.drawText('★', markerX - 6, barY - 15, 12, 'center');
                    }
                }
                
                // Current position indicator
                const currentFreq = Math.min(radioData.currentFrequency, totalFreqs - 1);
                const indicatorX = barX + (barWidth / totalFreqs) * currentFreq + (barWidth / totalFreqs) / 2;
                this.contents.fillRect(indicatorX - 4, barY - 5, 8, barHeight + 10, '#f39c12');
                
                // Scanning animation
                if (radioData.isScanning) {
                    const time = Graphics.frameCount % 60;
                    const alpha = Math.sin(time * 0.2) * 0.5 + 0.5;
                    const scanColor = `rgba(243, 156, 18, ${alpha})`;
                    this.contents.fillRect(barX, barY, barWidth, barHeight, scanColor);
                }
            }
        }
    }
    
    // Scene class for radio interface
    class Scene_Radio extends Scene_MenuBase {
        create() {
            super.create();
            this.createRadioWindow();
        }
        
        createRadioWindow() {
            this._radioWindow = new Window_Radio();
            this.addWindow(this._radioWindow);
            this._radioWindow.activate();
        }
        
        update() {
            super.update();
            this.handleRadioInput();
        }
        
        handleRadioInput() {
            const band = radioData.bandNames[radioData.currentBand];
            const maxFreq = Math.max(0, radioData.stations[band].length - 1);
            
            // Stop scanning on any input
            if (radioData.isScanning) {
                radioData.isScanning = false;
                this._radioWindow.refresh();
            }
            
            if (Input.isTriggered('left')) {
                if (Input.isPressed('shift') && enableFavorites) {
                    this.tuneToPreviousFavorite();
                } else {
                    radioData.currentFrequency = (radioData.currentFrequency - 1 + radioData.stations[band].length) % radioData.stations[band].length;
                    this.updateStation();
                }
            } else if (Input.isTriggered('right')) {
                if (Input.isPressed('shift') && enableFavorites) {
                    this.tuneToNextFavorite();
                } else {
                    radioData.currentFrequency = (radioData.currentFrequency + 1) % radioData.stations[band].length;
                    this.updateStation();
                }
            } else if (Input.isTriggered('up')) {
                if (Input.isPressed('shift')) {
                    this.adjustVolume(5);
                } else {
                    radioData.currentBand = (radioData.currentBand - 1 + 3) % 3;
                    radioData.currentFrequency = 0;
                    this.updateStation();
                }
            } else if (Input.isTriggered('down')) {
                if (Input.isPressed('shift')) {
                    this.adjustVolume(-5);
                } else {
                    radioData.currentBand = (radioData.currentBand + 1) % 3;
                    radioData.currentFrequency = 0;
                    this.updateStation();
                }
            } else if (Input.isTriggered('pageup') && enableAutoScan) {
                this.startAutoScan(-1);
            } else if (Input.isTriggered('pagedown') && enableAutoScan) {
                this.startAutoScan(1);
            } else if (Input.isTriggered('ok') && enableFavorites) {
                this.toggleFavorite();
            } else if (Input.isTriggered('cancel') || Input.isTriggered('escape')) {
                this.popScene();
                SoundManager.playCancel();
            }
        }
        
        updateStation() {
            this._radioWindow.refresh();
            playCurrentStation();
            this.saveCurrentStation();
            SoundManager.playCursor();
        }
        
        startAutoScan(direction) {
            radioData.isScanning = true;
            radioData.scanDirection = direction;
            this.autoScanStep();
        }
        
        autoScanStep() {
            if (!radioData.isScanning) return;
            
            const band = radioData.bandNames[radioData.currentBand];
            let stationsInBand = radioData.stations[band];
            let attempts = 0;
            const maxAttempts = radioData.totalStations * 3; // Check all bands
            
            while (attempts < maxAttempts) {
                if (radioData.scanDirection > 0) {
                    radioData.currentFrequency = (radioData.currentFrequency + 1) % stationsInBand.length;
                    if (radioData.currentFrequency === 0) {
                        radioData.currentBand = (radioData.currentBand + 1) % 3;
                        const newBand = radioData.bandNames[radioData.currentBand];
                        stationsInBand = radioData.stations[newBand];
                    }
                } else {
                    radioData.currentFrequency = (radioData.currentFrequency - 1 + stationsInBand.length) % stationsInBand.length;
                    if (radioData.currentFrequency === stationsInBand.length - 1) {
                        radioData.currentBand = (radioData.currentBand - 1 + 3) % 3;
                        const newBand = radioData.bandNames[radioData.currentBand];
                        stationsInBand = radioData.stations[newBand];
                        radioData.currentFrequency = stationsInBand.length - 1;
                    }
                }
                
                const currentStation = radioData.stations[radioData.bandNames[radioData.currentBand]][radioData.currentFrequency];
                if (currentStation && currentStation.path) {
                    radioData.isScanning = false;
                    this.updateStation();
                    SoundManager.playOk();
                    return;
                }
                
                attempts++;
            }
            
            // No stations found
            radioData.isScanning = false;
            this._radioWindow.refresh();
            SoundManager.playBuzzer();
        }
        
        toggleFavorite() {
            const currentFav = radioData.favorites.findIndex(fav => 
                fav.band === radioData.currentBand && 
                fav.frequency === radioData.currentFrequency
            );
            
            if (currentFav !== -1) {
                radioData.favorites.splice(currentFav, 1);
                SoundManager.playCancel();
            } else {
                radioData.favorites.push({
                    band: radioData.currentBand,
                    frequency: radioData.currentFrequency
                });
                SoundManager.playOk();
            }
            
            this._radioWindow.refresh();
            saveRadioData();
        }
        
        tuneToPreviousFavorite() {
            const favorites = radioData.favorites.slice().reverse();
            let currentIndex = favorites.findIndex(fav => 
                fav.band === radioData.currentBand && 
                fav.frequency === radioData.currentFrequency
            );
            
            if (currentIndex === -1 && favorites.length > 0) {
                const lastFav = favorites[0];
                radioData.currentBand = lastFav.band;
                radioData.currentFrequency = lastFav.frequency;
                this.updateStation();
            } else if (currentIndex < favorites.length - 1) {
                const nextFav = favorites[currentIndex + 1];
                radioData.currentBand = nextFav.band;
                radioData.currentFrequency = nextFav.frequency;
                this.updateStation();
            }
        }
        
        tuneToNextFavorite() {
            const currentIndex = radioData.favorites.findIndex(fav => 
                fav.band === radioData.currentBand && 
                fav.frequency === radioData.currentFrequency
            );
            
            if (currentIndex === -1 && radioData.favorites.length > 0) {
                const firstFav = radioData.favorites[0];
                radioData.currentBand = firstFav.band;
                radioData.currentFrequency = firstFav.frequency;
                this.updateStation();
            } else if (currentIndex < radioData.favorites.length - 1) {
                const nextFav = radioData.favorites[currentIndex + 1];
                radioData.currentBand = nextFav.band;
                radioData.currentFrequency = nextFav.frequency;
                this.updateStation();
            } else if (radioData.favorites.length > 0) {
                const firstFav = radioData.favorites[0];
                radioData.currentBand = firstFav.band;
                radioData.currentFrequency = firstFav.frequency;
                this.updateStation();
            }
        }
        
        adjustVolume(change) {
            radioData.currentVolume = Math.max(0, Math.min(100, radioData.currentVolume + change));
            this._radioWindow.refresh();
            
            // Update current playing volume
            if (radioData.currentlyPlaying && AudioManager._bgmBuffer) {
                AudioManager._bgmBuffer.volume = radioData.currentVolume / 100;
            }
            
            saveRadioData();
            SoundManager.playCursor();
        }
        
        saveCurrentStation() {
            radioData.lastStation = {
                band: radioData.currentBand,
                frequency: radioData.currentFrequency
            };
            saveRadioData();
        }
        
        terminate() {
            super.terminate();
            radioData.isOpen = false;
        }
    }
    
    // Open radio interface
    function openRadio() {
        if (radioData.isOpen) return;
        
        radioData.isOpen = true;
        SceneManager.push(Scene_Radio);
        playCurrentStation();
    }
    
    // Close radio interface  
    function closeRadio() {
        if (!radioData.isOpen) return;
        
        if (SceneManager._scene instanceof Scene_Radio) {
            SceneManager.pop();
        }
        radioData.isOpen = false;
    }
    
    // Add radio to main menu
    if (showInMenu) {
        const _Window_MenuCommand_addOriginalCommands = Window_MenuCommand.prototype.addOriginalCommands;
        Window_MenuCommand.prototype.addOriginalCommands = function() {
            _Window_MenuCommand_addOriginalCommands.call(this);
            this.addCommand(menuText, 'radio', true);
        };
        
        const _Scene_Menu_createCommandWindow = Scene_Menu.prototype.createCommandWindow;
        Scene_Menu.prototype.createCommandWindow = function() {
            _Scene_Menu_createCommandWindow.call(this);
            this._commandWindow.setHandler('radio', this.commandRadio.bind(this));
        };
        
        Scene_Menu.prototype.commandRadio = function() {
            SceneManager.push(Scene_Radio);
        };
    }
    
    // Enhanced scene management
    const _Scene_Map_update = Scene_Map.prototype.update;
    Scene_Map.prototype.update = function() {
        _Scene_Map_update.call(this);
        
        // Auto-scan animation update
        if (radioData.isScanning && radioData.isOpen && SceneManager._scene instanceof Scene_Radio) {
            if (Graphics.frameCount % 30 === 0) { // Scan every 30 frames (0.5 seconds)
                SceneManager._scene.autoScanStep();
            }
        }
    };
    
    // Initialize when the game starts or on new game
    const _Scene_Boot_start = Scene_Boot.prototype.start;
    Scene_Boot.prototype.start = function() {
        _Scene_Boot_start.call(this);
        // Initialize radio system asynchronously
        initializeRadio().catch(e => {
            console.error('Failed to initialize radio system:', e);
        });
    };
    
    // Auto-scan on new game
    const _DataManager_setupNewGame = DataManager.setupNewGame;
    DataManager.setupNewGame = function() {
        _DataManager_setupNewGame.call(this);
        console.log('🆕 New game started - Rescanning BGM files for radio...');
        // Re-scan BGM files for new game
        setTimeout(() => {
            initializeRadio().then(() => {
                console.log('📻 Radio system ready for new game!');
            }).catch(e => {
                console.error('Failed to scan BGM files on new game:', e);
            });
        }, 100); // Small delay to ensure game is fully loaded
    };
    
    // Plugin commands
    PluginManager.registerCommand(pluginName, "openRadio", args => {
        openRadio();
    });
    
    PluginManager.registerCommand(pluginName, "closeRadio", args => {
        closeRadio();
    });
    
    PluginManager.registerCommand(pluginName, "scanStations", args => {
        console.log('🔄 Manual rescan requested - Scanning BGM folder for stations...');
        initializeRadio().then(() => {
            $gameMessage.add('📻 Radio stations updated!');
            console.log('✅ Manual scan completed');
        }).catch(e => {
            console.error('Manual scan failed:', e);
            $gameMessage.add('⚠️ Radio scan failed - check console for details');
        });
    });
    
    PluginManager.registerCommand(pluginName, "setVolume", args => {
        const volume = parseInt(args.volume) || 85;
        radioData.currentVolume = Math.max(0, Math.min(100, volume));
        
        // Update current playing volume
        if (radioData.currentlyPlaying && AudioManager._bgmBuffer) {
            AudioManager._bgmBuffer.volume = radioData.currentVolume / 100;
        }
        
        saveRadioData();
        $gameMessage.add(`Radio volume set to ${radioData.currentVolume}%`);
    });
    
    // Event listener for game save/load
    const _DataManager_makeSaveContents = DataManager.makeSaveContents;
    DataManager.makeSaveContents = function() {
        const contents = _DataManager_makeSaveContents.call(this);
        saveRadioData();
        return contents;
    };
    
    const _DataManager_extractSaveContents = DataManager.extractSaveContents;
    DataManager.extractSaveContents = function(contents) {
        _DataManager_extractSaveContents.call(this, contents);
        // Radio data will be loaded when initializeRadio is called
    };
    
    // Cleanup on game end
    const _SceneManager_terminate = SceneManager.terminate;
    SceneManager.terminate = function() {
        saveRadioData();
        _SceneManager_terminate.call(this);
    };
    
    // Enhanced Debug functions (can be called from console)
    window.RadioDebug = {
        getStats: () => getStationStats(),
        listStations: () => {
            console.log('📻 Radio Stations:');
            radioData.bandNames.forEach(band => {
                console.log(`📡 ${band} Band:`);
                radioData.stations[band].forEach((station, index) => {
                    if (station && station.path) {
                        const freq = radioData.frequencies[band][index];
                        const isFav = radioData.favorites.some(fav => fav.band === radioData.currentBand && fav.frequency === index);
                        const info = radioData.stationInfo[station.path];
                        console.log(`  🎵 ${freq}: ${station.name} ${isFav ? '★' : ''} [${info?.folder || 'unknown'}]`);
                    } else {
                        const freq = radioData.frequencies[band][index];
                        console.log(`  📵 ${freq}: [STATIC]`);
                    }
                });
            });
        },
        addFavorite: (band, frequency) => {
            const bandIndex = radioData.bandNames.indexOf(band.toUpperCase());
            if (bandIndex !== -1) {
                radioData.favorites.push({ band: bandIndex, frequency: frequency });
                saveRadioData();
                console.log(`⭐ Added ${band} ${frequency} to favorites`);
            }
        },
        clearFavorites: () => {
            radioData.favorites = [];
            saveRadioData();
            console.log('🗑️ Cleared all favorites');
        },
        rescanFiles: async () => {
            console.log('🔄 Rescanning BGM files...');
            await initializeRadio();
            console.log('✅ Rescan completed');
        },
        showFileLocations: () => {
            console.log('📁 BGM File Locations being scanned:');
            console.log('  📂 Root: audio/bgm/');
            const defaultFolders = ['ComigoGames', 'Moogify', 'Nocoldiz', 'Old', 'RandomMind', 'TallBeard'];
            const foldersToScan = bgmFolders.length > 0 ? bgmFolders : defaultFolders;
            foldersToScan.forEach(folder => {
                console.log(`  📂 Subfolder: audio/bgm/${folder}/`);
            });
            console.log('🎵 Supported formats: .ogg');
            console.log('🎼 Music sources: ComigoGames, Moogify, Nocoldiz, Old/Classic, RandomMind, TallBeard');
        },
        showCurrentData: () => {
            console.log('🔍 Current Radio Data:');
            console.log(`Total Stations Found: ${radioData.totalStations}`);
            console.log('Stations by Band:');
            radioData.bandNames.forEach(band => {
                const validStations = radioData.stations[band]?.filter(s => s && s.path) || [];
                console.log(`  ${band}: ${validStations.length} stations`);
                validStations.forEach((station, i) => {
                    console.log(`    ${i + 1}. ${station.name} (${station.folder})`);
                });
            });
        },
        testFileScanning: async () => {
            console.log('🧪 Testing file scanning methods...');
            const bgmList = [];
            
            console.log('1. Testing NW.js scanning...');
            if (await tryNWJSScanning(bgmList, ['.ogg'])) {
                console.log(`✅ NW.js found ${bgmList.length} files`);
            } else {
                console.log('❌ NW.js scanning failed');
            }
            
            console.log('2. Testing fallback methods...');
            const fallbackList = [];
            await tryFallbackScanning(fallbackList);
            console.log(`📋 Fallback methods found ${fallbackList.length} files`);
            
            return { nwjs: bgmList, fallback: fallbackList };
        }
    };
    
})();
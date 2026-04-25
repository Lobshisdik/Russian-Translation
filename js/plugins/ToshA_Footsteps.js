/*:
 * @target MZ
 * @plugindesc [v1.1.0] Plays footstep sounds for player and events with customizable settings, terrain tags, and region IDs.
 * @author ToshaAngel
 * @version v1.1.0
 * @url https://toshaangel.itch.io/
 * @help
 * ___________          .__              
 * \__    ___/___  _____|  |__ _____     
 *   |    | /  _ \/  ___/  |  \\__  \    
 *   |    |(  <_> )___ \|   Y  \/ __ \_  
 *   |____| \____/____  >___|  (____  /  
 *                    \/     \/     \/   
 *    _____                        .__   
 *   /  _  \   ____    ____   ____ |  |  
 *  /  /_\  \ /    \  / ___\_/ __ \|  |  
 * /    |    \   |  \/ /_/  >  ___/|  |__
 * \____|__  /___|  /\___  / \___  >____/
 *         \/     \//_____/      \/   
 * 
 * This plugin allows you to play footstep sounds for both player and events,
 * with fine-tuned control over terrain tags, region IDs, and various other settings.
 * 
 * === Features ===
 * - Footstep sounds when walking on different terrain tags.
 * - Tileset-specific region ID sound configuration via notes.
 * - Support for multiple sounds for each terrain/region.
 * - Play modes: sequential or random.
 * - Individual volume, pitch, and pan settings for each sound.
 * - Toggle footstep sounds for events.
 * - Automatic synchronization of footstep sounds with character animation.
 * - Ship engine sound management with BGS saving/restoring.
 * - Rain-aware engine sounds (plays Engine_rain when raining).
 * - Proper BGS restoration when exiting vehicles or stopping movement.
 * 
 * === How to Use ===
 * 1. Configure default terrain tag sounds in the plugin parameters.
 * 2. For region-specific sounds, add notes to your Tileset:
 * 
 * <RegionSound: regionId>
 * sounds: sound1, sound2, sound3
 * playMode: sequential
 * volume: 90
 * pitchMin: 90
 * pitchMax: 110
 * pan: 0
 * maxDistance: 5
 * animationFrames: 0, 2
 * </RegionSound>
 * 
 * Example:
 * <RegionSound: 1>
 * sounds: Wood1, Wood2, Wood3
 * playMode: random
 * volume: 85
 * pitchMin: 95
 * pitchMax: 105
 * </RegionSound>
 * 
 * <RegionSound: 2>
 * sounds: Metal1, Metal2
 * playMode: sequential
 * volume: 90
 * </RegionSound>
 * 
 * 3. Paint regions in the map editor where you want custom sounds.
 * 4. Enable or disable event footsteps in plugin parameters.
 * 
 * === Priority System ===
 * Region sounds (from tileset notes) have priority over terrain tag sounds.
 * If a tile has both a region ID and terrain tag, region sound plays.
 * 
 * === Notes ===
 * - Region IDs range from 1 to 255 (0 is ignored).
 * - Terrain tags range from 0 to 7.
 * - Sound files must be placed in the audio/se folder.
 * - All region sound properties are optional (defaults will be used).
 * - Ship engine sound files should be in audio/bgs folder.
 * 
 * === License ===
 * This plugin can be used in both free and commercial projects.
 * Attribution is not required but appreciated.
 * 
 * @param StepSounds
 * @text Footstep Sound Settings
 * @type struct<StepSound>[]
 * @default []
 * @desc Configure footstep sounds for each terrain tag.
 * 
 * @param EventFootstepsEnabled
 * @text Event Footstep Sounds
 * @type boolean
 * @on Enabled
 * @off Disabled
 * @default true
 * @desc Enable or disable footstep sounds for events by default.
 */

/*~struct~StepSound:
 * @param AreaName
 * @text Area Name
 * @desc The name of the area (for developer reference).
 * @type text
 * @default 
 * 
 * @param TerrainTag
 * @text Terrain Tag
 * @desc The terrain tag number (0 to 7).
 * @type number
 * @min 0
 * @max 7
 * @default 0
 *
 * @param SoundNames
 * @text Sound Names
 * @desc List of sounds that will be played.
 * @type file[]
 * @dir audio/se
 * @require 1
 *
 * @param PlayMode
 * @text Play Mode
 * @desc Choose the play mode for the footstep sounds.
 * @type select
 * @option Sequential
 * @value sequential
 * @option Random
 * @value random
 * @default sequential
 *
 * @param Volume
 * @text Volume
 * @desc The volume of the sound (0-100).
 * @type number
 * @min 0
 * @max 100
 * @default 90
 *
 * @param PitchMin
 * @text Minimum Pitch
 * @desc The minimum pitch value for the sound (50-150).
 * @type number
 * @min 50
 * @max 150
 * @default 90
 *
 * @param PitchMax
 * @text Maximum Pitch
 * @desc The maximum pitch value for the sound (50-150).
 * @type number
 * @min 50
 * @max 150
 * @default 110
 *
 * @param Pan
 * @text Pan
 * @desc The pan of the sound (-100 left, 0 center, 100 right).
 * @type number
 * @min -100
 * @max 100
 * @default 0
 *
 * @param MaxDistance
 * @text Maximum Distance
 * @desc The maximum distance at which event sounds can be heard.
 * @type number
 * @min 1
 * @default 5
 *
 * @param AnimationFrames
 * @text Animation Frames for Sound
 * @desc The animation frames during which the footstep sound plays.
 * @type number[]
 * @min 0
 * @max 2
 * @default ["0","2"]
 */

(() => {
    const pluginName = "ToshA_Footsteps";
    const parameters = PluginManager.parameters(pluginName);

    const stepSounds = JSON.parse(parameters["StepSounds"] || "[]").map((sound) => {
        const parsedSound = JSON.parse(sound);
        return {
            terrainTag: Number(parsedSound.TerrainTag || 0),
            soundNames: JSON.parse(parsedSound.SoundNames || "[]").map(String),
            playMode: String(parsedSound.PlayMode || "sequential"),
            volume: Number(parsedSound.Volume || 90),
            pitchMin: Number(parsedSound.PitchMin || 90),
            pitchMax: Number(parsedSound.PitchMax || 110),
            pan: Number(parsedSound.Pan || 0),
            maxDistance: Number(parsedSound.MaxDistance || 5),
            animationFrames: JSON.parse(parsedSound.AnimationFrames || '["0","2"]').map(Number),
        };
    });

    const eventFootstepsEnabled = parameters["EventFootstepsEnabled"] === "true";

    // ====== Region Sound Cache ======
    let regionSoundCache = {};

    // ====== Parse Region Sounds from Tileset Notes ======
    function parseRegionSounds(tilesetId) {
        if (!tilesetId || regionSoundCache[tilesetId]) {
            return regionSoundCache[tilesetId] || {};
        }

        const tileset = $dataTilesets[tilesetId];
        if (!tileset || !tileset.note) {
            regionSoundCache[tilesetId] = {};
            return {};
        }

        const regionSounds = {};
        const regex = /<RegionSound:\s*(\d+)>([\s\S]*?)<\/RegionSound>/gi;
        let match;

        while ((match = regex.exec(tileset.note)) !== null) {
            const regionId = parseInt(match[1]);
            const content = match[2];

            const soundConfig = {
                regionId: regionId,
                soundNames: [],
                playMode: "sequential",
                volume: 90,
                pitchMin: 90,
                pitchMax: 110,
                pan: 0,
                maxDistance: 5,
                animationFrames: [0, 2]
            };

            // Parse sounds
            const soundsMatch = content.match(/sounds:\s*([^\n]+)/i);
            if (soundsMatch) {
                soundConfig.soundNames = soundsMatch[1]
                    .split(',')
                    .map(s => s.trim())
                    .filter(s => s.length > 0);
            }

            // Parse playMode
            const playModeMatch = content.match(/playMode:\s*(\w+)/i);
            if (playModeMatch) {
                soundConfig.playMode = playModeMatch[1].toLowerCase();
            }

            // Parse volume
            const volumeMatch = content.match(/volume:\s*(\d+)/i);
            if (volumeMatch) {
                soundConfig.volume = parseInt(volumeMatch[1]);
            }

            // Parse pitchMin
            const pitchMinMatch = content.match(/pitchMin:\s*(\d+)/i);
            if (pitchMinMatch) {
                soundConfig.pitchMin = parseInt(pitchMinMatch[1]);
            }

            // Parse pitchMax
            const pitchMaxMatch = content.match(/pitchMax:\s*(\d+)/i);
            if (pitchMaxMatch) {
                soundConfig.pitchMax = parseInt(pitchMaxMatch[1]);
            }

            // Parse pan
            const panMatch = content.match(/pan:\s*(-?\d+)/i);
            if (panMatch) {
                soundConfig.pan = parseInt(panMatch[1]);
            }

            // Parse maxDistance
            const maxDistanceMatch = content.match(/maxDistance:\s*(\d+)/i);
            if (maxDistanceMatch) {
                soundConfig.maxDistance = parseInt(maxDistanceMatch[1]);
            }

            // Parse animationFrames
            const framesMatch = content.match(/animationFrames:\s*([^\n]+)/i);
            if (framesMatch) {
                soundConfig.animationFrames = framesMatch[1]
                    .split(',')
                    .map(f => parseInt(f.trim()))
                    .filter(f => !isNaN(f));
            }

            if (soundConfig.soundNames.length > 0) {
                regionSounds[regionId] = soundConfig;
            }
        }

        regionSoundCache[tilesetId] = regionSounds;
        return regionSounds;
    }

    // ====== Get sound configuration for current position ======
    function getSoundConfig(character) {
        const x = character.x;
        const y = character.y;
        const regionId = $gameMap.regionId(x, y);
        
        // Priority 1: Region sounds from tileset
        if (regionId > 0 && $gameMap.tilesetId()) {
            const regionSounds = parseRegionSounds($gameMap.tilesetId());
            if (regionSounds[regionId]) {
                return regionSounds[regionId];
            }
        }
        
        // Priority 2: Terrain tag sounds from plugin parameters
        const terrainTag = character.terrainTag();
        const stepSound = stepSounds.find(sound => sound.terrainTag === terrainTag);
        return stepSound || null;
    }

    // ====== Ship BGS Management Variables ======
    let savedBgs = null;
    let shipStopTimer = null;
    let isInCarMode = false;

    // ====== Helper function to check if it's raining ======
    function isRaining() {
        return $gameScreen._weatherType === 'rain' || $gameScreen._weatherType === 'storm';
    }

    // ====== Helper function to get appropriate engine sound ======
    function getEngineSound() {
        return isRaining() ? "Engine_rain" : "Engine";
    }

    // ====== Helper function to get current map BGS ======
    function getCurrentMapBgs() {
        if ($dataMap && $dataMap.bgs && $dataMap.bgs.name) {
            return {
                name: $dataMap.bgs.name,
                volume: $dataMap.bgs.volume,
                pitch: $dataMap.bgs.pitch,
                pan: $dataMap.bgs.pan,
                pos: 0
            };
        }
        return null;
    }

    // ====== Helper function to stop engine and restore BGS ======
    function stopEngineAndRestoreBgs() {
        const currentBgs = AudioManager._currentBgs;
        
        if (currentBgs && (currentBgs.name === "Engine" || currentBgs.name === "Engine_rain")) {
            AudioManager.stopBgs();
            
            // Try to restore saved BGS first, then map BGS
            if (savedBgs) {
                AudioManager.playBgs(savedBgs);
                savedBgs = null;
            } else {
                const mapBgs = getCurrentMapBgs();
                if (mapBgs) {
                    AudioManager.playBgs(mapBgs);
                }
            }
        }
        isInCarMode = false;
    }

    // ====== Footstep sound playback function ======
    function playFootstepSound(character) {

        // Disable footstep sounds for SeaBed biome
        if ($gameSystem._procGenData && $gameSystem._procGenData.currentBiome === "SeaBed") {
            return;
        }

        if (character === $gamePlayer && character.isInVehicle()) {
            // Player is in ship and moving
            const currentBgs = AudioManager._currentBgs;
            const engineSound = getEngineSound();
            
            // If we're not in ship mode yet, save current BGS (if it's not an engine sound)
            if (!isInCarMode) {
                if (currentBgs && currentBgs.name !== "Engine" && currentBgs.name !== "Engine_rain") {
                    savedBgs = {
                        name: currentBgs.name,
                        volume: currentBgs.volume,
                        pitch: currentBgs.pitch,
                        pan: currentBgs.pan,
                        pos: currentBgs.pos || 0
                    };
                } else if (!currentBgs) {
                    // No BGS is playing, check if map has BGS
                    const mapBgs = getCurrentMapBgs();
                    if (mapBgs) {
                        savedBgs = mapBgs;
                    }
                }
                isInCarMode = true;
            }

            // Clear any existing stop timer since we're moving
            if (shipStopTimer) {
                clearTimeout(shipStopTimer);
                shipStopTimer = null;
            }

            // Play appropriate engine sound if not already playing, or switch if weather changed
            if (!currentBgs || (currentBgs.name !== engineSound)) {
                AudioManager.playBgs({
                    name: engineSound,
                    volume: 40,
                    pitch: 100,
                    pan: 0
                });
            }
            return;
        } else {
            // Player is not in ship or not moving
            if (isInCarMode) {
                // We were in ship mode but now we're not moving or not in ship
                
                // Set timer to stop engine and restore BGS after 0.5 seconds
                if (shipStopTimer) {
                    clearTimeout(shipStopTimer);
                }
                
                shipStopTimer = setTimeout(() => {
                    stopEngineAndRestoreBgs();
                    shipStopTimer = null;
                }, 500); // 0.5 second delay
            }
        }
    
        // Get sound configuration (region or terrain)
        const stepSound = getSoundConfig(character);
        
        if (stepSound && stepSound.soundNames.length > 0) {
            const pitch = Math.floor(Math.random() * (stepSound.pitchMax - stepSound.pitchMin + 1)) + stepSound.pitchMin;

            // Get footsteps volume from ConfigManager (default 30%)
            const footstepsVolumeMultiplier = (ConfigManager.footstepsVolume || 30) / 100;
            let volume = stepSound.volume * footstepsVolumeMultiplier;

            // If it's an event, reduce volume based on distance
            if (character !== $gamePlayer) {
                const dx = $gamePlayer.x - character.x;
                const dy = $gamePlayer.y - character.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                if (distance > stepSound.maxDistance) {
                    return; // Too far
                }
                const volumeFactor = 1 - distance / stepSound.maxDistance;
                volume = Math.max(0, Math.min(stepSound.volume * footstepsVolumeMultiplier * volumeFactor, 100));
            }

            let soundName;
            const configId = stepSound.regionId || stepSound.terrainTag || 0;
            const indexKey = '_footstepSoundIndex_' + configId;
            const terrainKey = '_lastSoundConfig_' + configId;

            if (stepSound.playMode === "sequential") {
                // Get the current sound index
                if (!character[indexKey] || character[terrainKey] !== configId) {
                    character[indexKey] = 0;
                }
                soundName = stepSound.soundNames[character[indexKey]];

                // Increment sound index
                character[indexKey] = (character[indexKey] + 1) % stepSound.soundNames.length;
            } else if (stepSound.playMode === "random") {
                // Choose a random sound
                soundName = stepSound.soundNames[Math.floor(Math.random() * stepSound.soundNames.length)];
            } else {
                // If the mode is not recognized, use the first sound
                soundName = stepSound.soundNames[0];
            }

            // Play the sound
            AudioManager.playSe({
                name: soundName,
                volume: volume,
                pitch: pitch,
                pan: stepSound.pan
            });

            // Save the current config identifier
            character[terrainKey] = configId;
        }
    }

    // ====== Override the animation pattern update method ======
    const _Game_CharacterBase_updatePattern = Game_CharacterBase.prototype.updatePattern;
    Game_CharacterBase.prototype.updatePattern = function() {
        const prevPattern = this._pattern;
        _Game_CharacterBase_updatePattern.call(this);
        const newPattern = this._pattern;

        if (prevPattern !== newPattern && this.isMoving()) {
            const isPlayer = this === $gamePlayer;
            let shouldPlayFootsteps = false;

            if (isPlayer) {
                shouldPlayFootsteps = true;
            } else if (this instanceof Game_Event) {
                if (eventFootstepsEnabled && !this.hasNoFootstepSounds()) {
                    shouldPlayFootsteps = true;
                }
            }

            if (shouldPlayFootsteps) {
                const stepSound = getSoundConfig(this);
                if (stepSound && stepSound.animationFrames.includes(newPattern)) {
                    playFootstepSound(this);
                }
            }
        }
    };

    // ====== Handle movement stop detection for ship BGS management ======
    const _Game_Player_updateStop = Game_Player.prototype.updateStop;
    Game_Player.prototype.updateStop = function() {
        _Game_Player_updateStop.call(this);
        
        // Check if player stopped moving while in ship
        if (this.isInVehicle() && (this.vehicle().isShip() || this.vehicle().isBoat()) && !this.isMoving()) {
            // Trigger the BGS management logic
            playFootstepSound(this);
        }
    };

    // ====== Handle vehicle exit ======
    const _Game_Player_getOffVehicle = Game_Player.prototype.getOffVehicle;
    Game_Player.prototype.getOffVehicle = function() {
        const wasInShip = this.isInVehicle() &&  (this.vehicle().isShip() || this.vehicle().isBoat());
        const result = _Game_Player_getOffVehicle.call(this);
        
        if (wasInShip && result) {
            // Player exited the ship, immediately stop engine and restore BGS
            if (shipStopTimer) {
                clearTimeout(shipStopTimer);
                shipStopTimer = null;
            }
            stopEngineAndRestoreBgs();
        }
        
        return result;
    };

    // ====== Handle map transfer ======
    const _Game_Player_performTransfer = Game_Player.prototype.performTransfer;
    Game_Player.prototype.performTransfer = function() {
        // If we're in ship mode and transferring maps, clean up BGS state
        if (isInCarMode) {
            if (shipStopTimer) {
                clearTimeout(shipStopTimer);
                shipStopTimer = null;
            }
            // Don't restore BGS here as the new map will handle its own BGS
            isInCarMode = false;
            savedBgs = null;
        }
        
        _Game_Player_performTransfer.call(this);
    };

    // ====== Clear region sound cache on map load ======
    const _Scene_Map_onMapLoaded = Scene_Map.prototype.onMapLoaded;
    Scene_Map.prototype.onMapLoaded = function() {
        _Scene_Map_onMapLoaded.call(this);
        // Clear cache when changing maps to ensure fresh data
        regionSoundCache = {};
    };

    // ====== Check if the event has the <NoFootsteps> tag ======
    Game_Event.prototype.hasNoFootstepSounds = function() {
        return this.event().note.includes("<NoFootsteps>");
    };

    // ====== Handle weather changes for dynamic engine sound switching ======
    const _Game_Screen_changeWeather = Game_Screen.prototype.changeWeather;
    Game_Screen.prototype.changeWeather = function(type, power, duration) {
        const wasRaining = isRaining();
        _Game_Screen_changeWeather.call(this, type, power, duration);
        const isNowRaining = isRaining();
        
        // If weather changed and player is in ship, switch engine sound
        if (isInCarMode && wasRaining !== isNowRaining) {
            const currentBgs = AudioManager._currentBgs;
            const newEngineSound = getEngineSound();
            
            if (currentBgs && (currentBgs.name === "Engine" || currentBgs.name === "Engine_rain")) {
                AudioManager.playBgs({
                    name: newEngineSound,
                    volume: currentBgs.volume,
                    pitch: currentBgs.pitch,
                    pan: currentBgs.pan
                });
            }
        }
    };

})();
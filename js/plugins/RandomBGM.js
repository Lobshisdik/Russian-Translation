/*:
 * @target MZ
 * @plugindesc Play a random map BGM with random pitch via plugin command.
 * @author OmniLex
 * 
 * @command StartRandomBgm
 * @text Start Random BGM
 * @desc Picks a random BGM from the audio/bgm folder and plays it with random pitch.
 *
 * @arg volume
 * @type number
 * @min 0
 * @max 100
 * @default 90
 * @text Volume
 * @desc Volume for the BGM playback (0-100).
 *
 * @arg pitchMin
 * @type number
 * @min 0
 * @max 200
 * @default 80
 * @text Minimum Pitch
 * @desc Minimum pitch for randomization.
 *
 * @arg pitchMax
 * @type number
 * @min 0
 * @max 200
 * @default 120
 * @text Maximum Pitch
 * @desc Maximum pitch for randomization.
 *
 * @help
 * Use the plugin command "StartRandomBgm" to play a random
 * BGM from your project's `audio/bgm/` folder at a random pitch.
 * Configure volume and pitch range in the command parameters.
 */

(()=>{
    const pluginName = document.currentScript.src.split('/').pop().replace(/\.js$/, '');
    // Load fs and path modules
    let fs = null;
    let path = null;
    try {
      fs = require('fs');
      path = require('path');
    } catch (e) {
      console.warn(`${pluginName}: Could not access fs/path modules.`);
    }
  
    // Build list of BGM files on load
    const bgmList = [];
    if (fs) {
      const bgmDir = path.join(process.cwd(), 'audio', 'bgm');
      try {
        const files = fs.readdirSync(bgmDir);
        files.forEach(file => {
          if (file.match(/\.(ogg|m4a|wav)$/i)) {
            bgmList.push(file.replace(/\.(ogg|m4a|wav)$/i, ''));
          }
        });
      } catch (e) {
        console.error(`${pluginName}: Failed to read audio/bgm directory.`, e);
      }
    }
  
    // Function to play random BGM
    function playRandomBgm(volume, pitchMin, pitchMax) {
      if (bgmList.length === 0) {
        console.warn(`${pluginName}: No BGM files found.`);
        return;
      }
      const name = bgmList[Math.floor(Math.random() * bgmList.length)];
      const pitch = Math.floor(Math.random() * (pitchMax - pitchMin + 1)) + pitchMin;
      AudioManager.playBgm({ name, volume, pitch, pan: 0 });
    }
  
    // Register plugin command
    PluginManager.registerCommand(pluginName, "StartRandomBgm", args => {
      const volume = Number(args.volume);
      const pitchMin = Number(args.pitchMin);
      const pitchMax = Number(args.pitchMax);
      playRandomBgm(volume, pitchMin, pitchMax);
    });
  })();
  
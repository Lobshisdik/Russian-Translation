//=============================================================================
// WeaponSystem.js
//=============================================================================

/*:
 * @target MZ
 * @plugindesc v3.2.0 Complete weapon system with bullets, reloading, sounds, FPS animations, and multi-frame sprites
 * @author Assistant
 * @url https://nocoldiz.itch.io/hypernet-explorer
 *
 * @param pitchVariation
 * @text Pitch Variation
 * @type number
 * @min 0
 * @max 50
 * @default 10
 * @desc Random pitch variation percentage (0-50). Default: 10%
 *
 * @param volume
 * @text Volume
 * @type number
 * @min 0
 * @max 100
 * @default 90
 * @desc Volume for weapon sounds (0-100). Default: 90
 *
 * @param useSubfolder
 * @text Use Weapons Subfolder
 * @type boolean
 * @default true
 * @desc Load sounds from audio/se/Weapons/ subfolder?
 *
 * @param weaponSpriteX
 * @text Weapon Sprite X Position
 * @type number
 * @min -9999
 * @max 9999
 * @default 650
 * @desc X position of weapon sprite (from left). Default: 650
 *
 * @param weaponSpriteY
 * @text Weapon Sprite Y Position
 * @type number
 * @min -9999
 * @max 9999
 * @default 450
 * @desc Y position of weapon sprite (from top). Default: 450
 *
 * @param debugMode
 * @text Debug Mode
 * @type boolean
 * @default false
 * @desc Enable console logging for debugging?
 *
 * @help WeaponSystem.jsconst animationSpeed = Number(parameters['animationSpeed'] || 15);
 *
 * This plugin provides a complete weapon system including:
 * - Custom weapon sounds with pitch variation
 * - FPS-style weapon sprite display with smooth animations
 * - Multi-frame sprite animations for attack sequences
 * - Bullet/ammo system with reloading
 * - Visual bullet gauge display
 *
 * ============================================================================
 * Weapon Note Tags
 * ============================================================================
 *
 * SPRITE SYSTEM:
 * <WeaponSprite: filename>
 * - Sets a single weapon sprite to display in FPS view
 * - Example: <WeaponSprite: Sword>
 * - File location: img/pictures/Weapons/filename.png
 *
 * <WeaponSprite: frame1, frame2, frame3, frame4>
 * - Sets multiple sprite frames that animate during attacks
 * - Cycles through frames when attacking, returns to first frame after
 * - Example: <WeaponSprite: Pistol1, Pistol2, Pistol3, Pistol4>
 * - File location: img/pictures/Weapons/frameX.png
 *
 * <Movement: anim1, anim2, anim3>
 * - Sets which animations to use (randomly chosen on attack)
 * - Available: Swing, Slash, Thrust, Overhead, Uppercut, Spin, Backstab, Static
 * - Example: <Movement: Swing, Slash, Thrust, Spin>
 * - If not set but WeaponSprite exists, defaults to Swing animation
 *
 * <Movement: Static>
 * - Disables the default swing animation
 * - Weapon will only play sprite frame animation without movement
 * - Useful for firearms or weapons that should stay stationary
 *
 * SOUND SYSTEM:
 * <weaponSound: filename>
 * - Sets a single sound file for the weapon
 * - Example: <weaponSound: Sword1>
 *
 * <weaponSounds: file1, file2, file3>
 * - Sets multiple sounds that will be chosen randomly
 * - Example: <weaponSounds: Sword1, Sword2, Sword3>
 *
 * <NoMultiAttackSound>
 * - Prevents playing different sounds for each hit in multi-attacks
 * - Only the first hit will play a sound
 *
 * BULLET SYSTEM:
 * <Bullets: X>
 * - Set max bullets for weapon (default: unlimited)
 * - Example: <Bullets: 6>
 *
 * <ReloadSound: filename>
 * - Sound effect from audio/se for reloading
 * - Example: <ReloadSound: Reload>
 *
 * ============================================================================
 * File Locations
 * ============================================================================
 *
 * Weapon Sprites: img/pictures/Weapons/
 * Weapon Sounds (if subfolder enabled): audio/se/Weapons/
 * Weapon Sounds (if subfolder disabled): audio/se/
 *
 * ============================================================================
 * Animation Types
 * ============================================================================
 *
 * - Swing: Classic diagonal slash from bottom-right to center
 * - Slash: Wide horizontal sweep across the screen
 * - Thrust: Forward stabbing motion toward center
 * - Overhead: Vertical chop from top to bottom
 * - Uppercut: Rising diagonal slash from bottom to top
 * - Spin: Full 360-degree spinning attack
 * - Backstab: Quick thrust from side/behind
 * - Static: No movement animation (only plays sprite frames)
 *
 * ============================================================================
 * Terms of Use
 * ============================================================================
 *
 * Free for commercial and non-commercial use.
 *
 * ============================================================================
 * Changelog
 * ============================================================================
 *
 * v3.2.0 - Added multi-frame sprite animation support and Static animation
 * v3.1.0 - Added smooth FPS-style weapon animations with 16 frames each
 * v3.0.0 - Merged bullet system and weapon sounds into unified plugin
 * v2.0.0 - Added FPS-style weapon sprite display
 * v1.0.0 - Initial release
 */

(() => {
  "use strict";

  const pluginName = "WeaponSystem";
  const parameters = PluginManager.parameters(pluginName);
  const pitchVariation = Number(parameters["pitchVariation"] || 10);
  const volume = Number(parameters["volume"] || 90);
  const useSubfolder = parameters["useSubfolder"] !== "false";
  const weaponSpriteX = Number(parameters["weaponSpriteX"] || 650);
  const weaponSpriteY = Number(parameters["weaponSpriteY"] || 450);
  const animationSpeed = 35; // Hardcoded movement animation speed
  const spriteFrameDuration = 130; // Hardcoded sprite frame duration (increased from 30 to 100ms)
  const debugMode = parameters["debugMode"] === "true";
  const { MovementKeyFrame } = window.AnimationData;

  // Debug logging helper
  const debugLog = (...args) => {
    if (debugMode) {
      console.log("[WeaponSystem]", ...args);
    }
  };
  // Resolution scaling helpers
  const getResolutionScale = () => {
    if ($gameSystem && $gameSystem.getCurrentResolution) {
      const resolution = $gameSystem.getCurrentResolution();
      return resolution === "16:9" ? { x: 1.568, y: 1.154 } : { x: 1, y: 1 };
    }
    return { x: 1, y: 1 };
  };

  const getScaledWeaponX = (isLeftHand = false) => {
    const scale = getResolutionScale();
    if (isLeftHand) {
      // Left hand weapons: scale from left edge
      return Math.round(200 * scale.x);
    }
    // Right hand weapons: scale from their base position
    return Math.round(weaponSpriteX * scale.x);
  };

  const getScaledWeaponY = () => {
    const scale = getResolutionScale(); 
    return Math.round(weaponSpriteY * scale.y);
  };

  const getScaledValue = (value) => {
    const scale = getResolutionScale();
    return Math.round(value * scale.x); // Use x scale for general values
  };
  // Hardcoded shoosh sounds for weapon types
  const DEFAULT_WEAPON_SOUNDS = {
    1: ["Swing1", "Swing2","Swing3","Swing4","Swing5","Swing6","Swing7","Swing8"], // Light
    2: ["Swing1", "Swing2","Swing3","Swing4","Swing5","Swing6","Swing7","Swing8"], // Sword
    3: ["Swing1", "Swing2","Swing3","Swing4","Swing5","Swing6","Swing7","Swing8"], // Heavy
    4: ["Swing1", "Swing2","Swing3","Swing4","Swing5","Swing6","Swing7","Swing8"], //Axe
    5: ["Whip1", "Whip2", "Whip3", "Whip4"], //Whip
    6: ["Swing1", "Swing2","Swing3","Swing4","Swing5","Swing6","Swing7","Swing8"], //Staff
    7: ["Bow"], //Bow
    8: ["Bow"], //Projectile
    9: ["Pistol1", "Pistol2", "Pistol3", "Pistol4", "Pistol5"], //Gun
    10: ["Swing1", "Swing2","Swing3","Swing4","Swing5","Swing6","Swing7","Swing8"], //Claw
    11: ["Punch1","Punch2","Punch3"] //Glove
  };

  // Static animation keyframes (no movement, just holds position)
  // Add this near the top of the file where STATIC_ANIMATION is defined (around line 138)
  // Mirrored swing animation for left hand
  // Add this near the top of the file where STATIC_ANIMATION is defined (around line 138)
  // Mirrored swing animation for left hand

  //=============================================================================
  // ImageManager - Add weapon image loading
  //=============================================================================

  // Load weapon sprites fresh without caching to prevent corruption when changing maps
  ImageManager.loadWeaponPicture = function (filename) {
    const key = "Weapons/" + filename;
    return this.loadPicture(key);
  };

  //=============================================================================
  // DataManager
  //=============================================================================

  const _DataManager_createGameObjects = DataManager.createGameObjects;
  DataManager.createGameObjects = function () {
    _DataManager_createGameObjects.call(this);
    $gameParty.initBulletData();
  };

  const _DataManager_isDatabaseLoaded = DataManager.isDatabaseLoaded;
  DataManager.isDatabaseLoaded = function () {
    if (!_DataManager_isDatabaseLoaded.call(this)) {
      return false;
    }
    if (!this._weaponSystemProcessed) {
      this.processWeaponSystemNotetags();
      this._weaponSystemProcessed = true;
    }
    return true;
  };

  DataManager.processWeaponSystemNotetags = function () {
    debugLog("Processing weapon system notetags...");
    for (const weapon of $dataWeapons) {
      if (!weapon) continue;
      this.extractWeaponSystemData(weapon);
    }
    for (const armor of $dataArmors) {
      if (!armor) continue;
      this.extractWeaponSystemData(armor); // Reuse same extraction method
    }
    debugLog("Weapon system processing complete");
  };

  DataManager.extractWeaponSystemData = function (weapon) {
    weapon.weaponSounds = [];
    weapon.noMultiAttackSound = false;
    weapon.weaponSprite = null;
    weapon.weight = null;
    weapon.weaponSpriteFrames = [];
    weapon.weaponAnimations = [];
    weapon.maxBullets = null;
    weapon.reloadSound = null;
    weapon.isWhip = false; // NEW
    weapon.isFlail = false; // NEW
    weapon.isThrow = false; // ADD THIS LINE
    weapon.weight = 300; // ADD THIS LINE
    weapon.isNunchaku = false; // NEW
    weapon.whipColor = null; // NEW
    weapon.weaponScale = 1.0;
    weapon.weaponRotation = 0;
    weapon.weaponOffsetX = 0;
    weapon.weaponOffsetY = 0;
    weapon.isBow = false; // NEW
    weapon.stringColor = null; // NEW
    weapon.segments = null; // NEW - custom segment count
    const note = weapon.note || "";

    const scaleMatch = note.match(/<Scale:\s*([\d.]+)>/i);
    if (scaleMatch) {
      weapon.weaponScale = parseFloat(scaleMatch[1]);
      debugLog(`Weapon ${weapon.name}: Scale set to ${weapon.weaponScale}`);
    }

    const rotationMatch = note.match(/<Rotation:\s*(-?[\d.]+)>/i);
    if (rotationMatch) {
      weapon.weaponRotation = parseFloat(rotationMatch[1]);
      debugLog(
        `Weapon ${weapon.name}: Rotation set to ${weapon.weaponRotation} degrees`
      );
    }

    const offsetMatch = note.match(/<Offset:\s*(-?[\d.]+),\s*(-?[\d.]+)>/i);
    if (offsetMatch) {
      weapon.weaponOffsetX = parseFloat(offsetMatch[1]);
      weapon.weaponOffsetY = parseFloat(offsetMatch[2]);
      debugLog(
        `Weapon ${weapon.name}: Offset set to (${weapon.weaponOffsetX}, ${weapon.weaponOffsetY})`
      );
    }
    const colorMatch = note.match(/<Color:\s*(.+?)>/i);
    if (colorMatch) {
      weapon.whipColor = colorMatch[1].trim();
      debugLog(`Weapon ${weapon.name}: Color set to "${weapon.whipColor}"`);
    }
    const projectileMatch = note.match(/<ProjectileSprite:\s*(.+?)>/i);
    if (projectileMatch) {
      weapon.projectileSprite = projectileMatch[1].trim();
      debugLog(
        `Weapon ${weapon.name}: Projectile sprite "${weapon.projectileSprite}"`
      );
    }
    // NEW: Check for Whip tag
    if (note.match(/<Whip>/i)) {
      weapon.isWhip = true;
      debugLog(`Weapon ${weapon.name}: Whip physics enabled`);
    }
    // NEW: Check for Flail tag
    if (note.match(/<Flail>/i)) {
      weapon.isFlail = true;
      debugLog(`Weapon ${weapon.name}: Flail physics enabled`);
    }
    // NEW: Check for Nunchaku tag
    if (note.match(/<Nunchaku>/i)) {
      weapon.isNunchaku = true;
      debugLog(`Weapon ${weapon.name}: Nunchaku physics enabled`);
    }
    // Sound system tags
    if (note.match(/<NoMultiAttackSound>/i)) {
      weapon.noMultiAttackSound = true;
      debugLog(`Weapon ${weapon.name}: NoMultiAttackSound enabled`);
    }
    if (note.match(/<Bow>/i)) {
      weapon.isBow = true;
      debugLog(`Weapon ${weapon.name}: Bow physics enabled`);
    }

    const stringColorMatch = note.match(/<StringColor:\s*(.+?)>/i);
    if (stringColorMatch) {
      weapon.stringColor = stringColorMatch[1].trim();
      debugLog(
        `Weapon ${weapon.name}: String color set to "${weapon.stringColor}"`
      );
    }
    const singleMatch = note.match(/<WeaponSound:\s*(.+?)>/i);
    if (singleMatch) {
      const sound = singleMatch[1].trim();
      weapon.weaponSounds.push(sound);
      debugLog(`Weapon ${weapon.name}: Added single sound "${sound}"`);
    }
    const segmentsMatch = note.match(/<Segments:\s*(\d+)>/i);
    if (segmentsMatch) {
      weapon.segments = parseInt(segmentsMatch[1]);
      debugLog(`Weapon ${weapon.name}: Segments set to ${weapon.segments}`);
    }

    // NEW: Check for Throw tag
    if (note.match(/<Throw>/i)) {
      weapon.isThrow = true;
      debugLog(`Weapon ${weapon.name}: Throw physics enabled`);
    }

    // NEW: Check for Weight tag
    const weightMatch = note.match(/<Weight:\s*(\d+)>/i);
    if (weightMatch) {
      weapon.weight = parseInt(weightMatch[1]);
      debugLog(`Weapon ${weapon.name}: Weight set to ${weapon.weight}g`);
    } else {
      weapon.weight = 300; // Default weight
    }
    const multiMatch = note.match(/<WeaponSounds:\s*(.+?)>/i);
    if (multiMatch) {
      const sounds = multiMatch[1]
        .split(",")
        .map((s) => s.trim())
        .filter((s) => s);
      weapon.weaponSounds = weapon.weaponSounds.concat(sounds);
      debugLog(`Weapon ${weapon.name}: Added multiple sounds`, sounds);
    }

    // Sprite system tags
    const spriteMatch = note.match(/<WeaponSprite:\s*(.+?)>/i);
    if (spriteMatch) {
      const spriteData = spriteMatch[1]
        .split(",")
        .map((s) => s.trim())
        .filter((s) => s);

      if (spriteData.length === 1) {
        weapon.weaponSprite = spriteData[0];
        weapon.weaponSpriteFrames = [spriteData[0]];
        debugLog(
          `Weapon ${weapon.name}: Single weapon sprite "${weapon.weaponSprite}"`
        );
      } else {
        weapon.weaponSprite = spriteData[0];
        weapon.weaponSpriteFrames = spriteData;
        debugLog(
          `Weapon ${weapon.name}: Multi-frame sprite with ${spriteData.length} frames`,
          spriteData
        );
      }
    }

    // Animation tags
    const animMatch = note.match(/<Movement:\s*(.+?)>/i);
    if (animMatch) {
      const anims = animMatch[1]
        .split(",")
        .map((s) => s.trim())
        .filter((s) => s);
      weapon.weaponAnimations = anims;
      debugLog(`Weapon ${weapon.name}: Movement`, anims);
    } else if (weapon.weaponSprite && !weapon.isWhip) {
      // Don't default to Swing for whips
      weapon.weaponAnimations = ["Swing"];
      debugLog(`Weapon ${weapon.name}: Using default Swing animation`);
    }

    // Bullet system tags
    const bulletsMatch = note.match(/<Bullets:\s*(\d+)>/i);
    if (bulletsMatch) {
      weapon.maxBullets = parseInt(bulletsMatch[1]);
      debugLog(`Weapon ${weapon.name}: Max bullets ${weapon.maxBullets}`);
    }

    const animSpeedMatch = note.match(/<AnimationSpeed:\s*(\d+)>/i);
    if (animSpeedMatch) {
      weapon.animationSpeed = parseInt(animSpeedMatch[1]);
    }

    const frameSpeedMatch = note.match(/<SpriteFrameDuration:\s*(\d+)>/i);
    if (frameSpeedMatch) {
      weapon.spriteFrameDuration = parseInt(frameSpeedMatch[1]);
    }

    const reloadMatch = note.match(/<ReloadSound:\s*(\w+)>/i);
    if (reloadMatch) {
      weapon.reloadSound = reloadMatch[1];
      debugLog(`Weapon ${weapon.name}: Reload sound "${weapon.reloadSound}"`);
    }

    if (weapon.weaponSounds.length > 0) {
      weapon.weaponSounds = [...new Set(weapon.weaponSounds)];
    }

    // Process skills for movement tags
    for (const skill of $dataSkills) {
      if (!skill) continue;
      skill.weaponAnimations = [];

      const skillNote = skill.note || "";
      const skillAnimMatch = skillNote.match(/<Movement:\s*(.+?)>/i);
      if (skillAnimMatch) {
        const anims = skillAnimMatch[1]
          .split(",")
          .map((s) => s.trim())
          .filter((s) => s);
        skill.weaponAnimations = anims;
        debugLog(`Skill ${skill.name}: Movement`, anims);
      }
    }

    weapon.muzzleFlash = null;

    const muzzleMatch = note.match(/<MuzzleFlash:\s*(-?\d+),\s*(-?\d+)>/i);
    if (muzzleMatch) {
      weapon.muzzleFlash = {
        x: parseInt(muzzleMatch[1]),
        y: parseInt(muzzleMatch[2]),
      };
      debugLog(
        `Weapon ${weapon.name}: Muzzle flash at (${weapon.muzzleFlash.x}, ${weapon.muzzleFlash.y})`
      );
    }
  };

  //=============================================================================
  // Game_Party - Bullet Data Management
  //=============================================================================

  Game_Party.prototype.initBulletData = function () {
    if (!this._bulletData) {
      this._bulletData = {};
    }
  };

  Game_Party.prototype.getBulletData = function (actorId, weaponId) {
    this.initBulletData();
    const key = `${actorId}_${weaponId}`;
    return this._bulletData[key];
  };

  Game_Party.prototype.setBulletData = function (actorId, weaponId, value) {
    this.initBulletData();
    const key = `${actorId}_${weaponId}`;
    this._bulletData[key] = value;
  };

  //=============================================================================
  // Game_Actor - Weapon System
  //=============================================================================

  // Sound system methods

  Game_Actor.prototype.isWeaponWhip = function () {
    const weapons = this.weapons();
    if (weapons.length === 0) return false;
    const weapon = weapons[0];
    return weapon && weapon.isWhip === true;
  };
  Game_Actor.prototype.isWeaponNunchaku = function () {
    const weapons = this.weapons();
    if (weapons.length === 0) return false;
    const weapon = weapons[0];
    return weapon && weapon.isNunchaku === true;
  };
  Game_Actor.prototype.getWeaponColor = function () {
    const weapons = this.weapons();
    if (weapons.length === 0) return null;

    const weapon = weapons[0];
    if (!weapon || !weapon.whipColor) return null;

    return weapon.whipColor;
  };
  // Add to Game_Actor prototype - Shield/Armor weapon detection
  Game_Actor.prototype.getShieldSpriteData = function () {
    const armors = this.armors();
    const validArmors = armors.filter((armor) => armor && armor.weaponSprite);

    if (validArmors.length === 0) return null;

    // Pick a random armor with weaponSprite
    const randomArmor =
      validArmors[Math.floor(Math.random() * validArmors.length)];

    return {
      sprite: randomArmor.weaponSprite,
      frames: randomArmor.weaponSpriteFrames || [randomArmor.weaponSprite],
      animations: randomArmor.weaponAnimations || ["Swing"],
    };
  };

  Game_Actor.prototype.getShieldColor = function () {
    const armors = this.armors();
    for (const armor of armors) {
      if (armor && armor.weaponSprite && armor.whipColor) {
        return armor.whipColor;
      }
    }
    return null;
  };

  Game_Actor.prototype.getShieldScale = function () {
    const armors = this.armors();
    for (const armor of armors) {
      if (armor && armor.weaponSprite && armor.weaponScale) {
        return armor.weaponScale;
      }
    }
    return 1.0;
  };

  Game_Actor.prototype.getShieldRotation = function () {
    const armors = this.armors();
    for (const armor of armors) {
      if (armor && armor.weaponSprite && armor.weaponRotation) {
        return armor.weaponRotation;
      }
    }
    return 0;
  };

  Game_Actor.prototype.getShieldOffset = function () {
    const armors = this.armors();
    for (const armor of armors) {
      if (
        armor &&
        armor.weaponSprite &&
        (armor.weaponOffsetX || armor.weaponOffsetY)
      ) {
        return {
          x: armor.weaponOffsetX || 0,
          y: armor.weaponOffsetY || 0,
        };
      }
    }
    return { x: 0, y: 0 };
  };
  Game_Actor.prototype.isWeaponBow = function () {
    const weapons = this.weapons();
    if (weapons.length === 0) return false;
    const weapon = weapons[0];
    return weapon && weapon.isBow === true;
  };

  Game_Actor.prototype.getBowColors = function () {
    const weapons = this.weapons();
    if (weapons.length === 0) return null;

    const weapon = weapons[0];
    if (!weapon || !weapon.isBow) return null;

    return {
      bow: weapon.whipColor || "#8B4513",
      string: weapon.stringColor || "#D2B48C",
    };
  };
  Game_Actor.prototype.getWeaponProjectileSprite = function () {
    const weapons = this.weapons();
    if (weapons.length === 0) return null;

    const weapon = weapons[0];
    if (!weapon || !weapon.projectileSprite) return null;

    return weapon.projectileSprite;
  };
  Game_Actor.prototype.isWeaponFlail = function () {
    const weapons = this.weapons();
    if (weapons.length === 0) return false;
    const weapon = weapons[0];
    return weapon && weapon.isFlail === true;
  };
  Game_Actor.prototype.isWeaponThrow = function () {
    const weapons = this.weapons();
    if (weapons.length === 0) return false;
    const weapon = weapons[0];
    return weapon && weapon.isThrow === true;
  };

  Game_Actor.prototype.getWeaponWeight = function () {
    const weapons = this.weapons();
    if (weapons.length === 0) return 300;
    const weapon = weapons[0];
    return weapon ? weapon.weight || 300 : 300;
  };
  Game_Actor.prototype.getWeaponSounds = function () {
    const weapons = this.weapons();
    if (weapons.length === 0) {
      debugLog(`Actor ${this.name()}: No weapons equipped, using unarmed sounds`);
      // When unarmed, use glove sounds (weapon type 11)
      return DEFAULT_WEAPON_SOUNDS[11];
    }

    const weapon = weapons[0];
    if (!weapon) {
      debugLog(`Actor ${this.name()}: Weapon data is null`);
      return null;
    }

    debugLog(
      `Actor ${this.name()}: Using weapon "${weapon.name}" (Type ID: ${weapon.wtypeId
      })`
    );

    if (weapon.weaponSounds && weapon.weaponSounds.length > 0) {
      debugLog(
        `Actor ${this.name()}: Found custom sounds`,
        weapon.weaponSounds
      );
      return weapon.weaponSounds;
    }

    if (weapon.wtypeId && DEFAULT_WEAPON_SOUNDS[weapon.wtypeId]) {
      debugLog(
        `Actor ${this.name()}: Using default sounds for type ${weapon.wtypeId}`,
        DEFAULT_WEAPON_SOUNDS[weapon.wtypeId]
      );
      return DEFAULT_WEAPON_SOUNDS[weapon.wtypeId];
    }

    debugLog(
      `Actor ${this.name()}: No sounds found for weapon type ${weapon.wtypeId}`
    );
    return null;
  };

  Game_Actor.prototype.hasNoMultiAttackSound = function () {
    const weapons = this.weapons();
    if (weapons.length === 0) return false;

    const weapon = weapons[0];
    return weapon && weapon.noMultiAttackSound === true;
  };

  Game_Actor.prototype.playWeaponSound = function () {
    const sounds = this.getWeaponSounds();
    if (!sounds || sounds.length === 0) {
      debugLog(`Actor ${this.name()}: No weapon sounds to play`);
      return;
    }

    const soundName = sounds[Math.floor(Math.random() * sounds.length)];

    const basePitch = 100;
    const variation = pitchVariation;
    const randomPitch = basePitch + (Math.random() * variation * 2 - variation);
    const pitch = Math.round(Math.max(50, Math.min(150, randomPitch)));

    let finalSoundName = soundName;
    if (useSubfolder && !soundName.includes("/")) {
      finalSoundName = "Weapons/" + soundName;
    }

    debugLog(
      `Actor ${this.name()}: Playing sound "${finalSoundName}" (pitch: ${pitch})`
    );

    const se = {
      name: finalSoundName,
      volume: volume,
      pitch: pitch,
      pan: 0,
    };

    try {
      AudioManager.playSe(se);
    } catch (error) {
      console.error("[WeaponSystem] Error playing sound:", error);
      debugLog("Error details:", error);
    }
  };

  // Sprite and animation methods
  Game_Actor.prototype.getWeaponSpriteData = function () {
    const weapons = this.weapons();
    
    // When unarmed, return Unarmed1 sprite with glove animation
    if (weapons.length === 0) {
      return {
        sprite: "Unarmed1",
        frames: ["Unarmed1"],
        animations: ["Thrust"], // Thrust animation for punch
      };
    }

    const weapon = weapons[0];
    
    // When equipped with gloves (weapon type 11), also use Unarmed1 sprite
    if (weapon && weapon.wtypeId === 11) {
      return {
        sprite: "Unarmed1",
        frames: ["Unarmed1"],
        animations: ["Thrust"], // Thrust animation for punch
      };
    }
    if (!weapon || !weapon.weaponSprite) return null;

    return {
      sprite: weapon.weaponSprite,
      frames: weapon.weaponSpriteFrames || [weapon.weaponSprite],
      animations: weapon.weaponAnimations || ["Swing"],
    };
  };
  Game_Actor.prototype.getWeaponMuzzleFlash = function () {
    const weapons = this.weapons();
    if (weapons.length === 0) return null;

    const weapon = weapons[0];
    if (!weapon || !weapon.muzzleFlash) return null;

    return weapon.muzzleFlash;
  };
  // Bullet system methods
  Game_Actor.prototype.getWeaponBulletConfig = function () {
    const weapons = this.weapons();
    if (weapons.length === 0) return null;

    const weapon = weapons[0];
    if (!weapon || !weapon.maxBullets) return null;

    return {
      max: weapon.maxBullets,
      weaponId: weapon.id,
    };
  };

  Game_Actor.prototype.getCurrentBullets = function () {
    const config = this.getWeaponBulletConfig();
    if (!config) return null;

    let current = $gameParty.getBulletData(this.actorId(), config.weaponId);
    if (current === undefined) {
      current = config.max;
      $gameParty.setBulletData(this.actorId(), config.weaponId, current);
    }
    return current;
  };

  Game_Actor.prototype.setCurrentBullets = function (value) {
    const config = this.getWeaponBulletConfig();
    if (!config) return;

    const clamped = Math.max(0, Math.min(value, config.max));
    $gameParty.setBulletData(this.actorId(), config.weaponId, clamped);
  };

  Game_Actor.prototype.consumeBullet = function () {
    const current = this.getCurrentBullets();
    if (current !== null && current > 0) {
      this.setCurrentBullets(current - 1);
    }
  };

  Game_Actor.prototype.reloadBullets = function () {
    const config = this.getWeaponBulletConfig();
    if (!config) return;

    this.setCurrentBullets(config.max);

    const weapons = this.weapons();
    if (weapons.length > 0) {
      const weapon = weapons[0];
      const soundName = weapon.reloadSound || "Reload";

      AudioManager.playSe({
        name: "Weapons/" + soundName,
        volume: 90,
        pitch: 100,
        pan: 0,
      });
    }
  };

  Game_Actor.prototype.isOutOfBullets = function () {
    const current = this.getCurrentBullets();
    return current !== null && current <= 0;
  };

  Game_Actor.prototype.canAttackWithBullets = function () {
    const config = this.getWeaponBulletConfig();
    if (!config) return true;

    const current = this.getCurrentBullets();
    return current > 0;
  };

  //=============================================================================
  // Game_Action - Bullet Consumption
  //=============================================================================

  const _Game_Action_apply = Game_Action.prototype.apply;
  Game_Action.prototype.apply = function (target) {
    const subject = this.subject();

    if (this.isAttack() && subject.isActor()) {
      if (!subject.canAttackWithBullets()) {
        return;
      }
      subject.consumeBullet();
    }

    _Game_Action_apply.call(this, target);
  };

  const _Game_Action_numRepeats = Game_Action.prototype.numRepeats;
  Game_Action.prototype.numRepeats = function () {
    const subject = this.subject();

    if (this.isAttack() && subject && subject.isActor()) {
      const current = subject.getCurrentBullets();
      if (current !== null) {
        const normalRepeats = _Game_Action_numRepeats.call(this);
        return Math.min(normalRepeats, current);
      }
    }

    return _Game_Action_numRepeats.call(this);
  };

  //=============================================================================
  // Window_BattleLog - Weapon Sounds
  //=============================================================================

  const _Window_BattleLog_startAction = Window_BattleLog.prototype.startAction;
  Window_BattleLog.prototype.startAction = function (subject, action, targets) {
    if (action && subject && subject.isActor()) {
   
if (action.isAttack()) {
  this._lastAttacker = subject;
  this._multiAttackHitCount = 0;
  this._skillAnimations = null;
  debugLog(`Tracking attacker: ${subject.name()}`);
} else if (action.isSkill()) {
  // Check if skill has Movement animations
  const skill = action.item();
  if (
    skill &&
    skill.weaponAnimations &&
    skill.weaponAnimations.length > 0
  ) {
    // NEW: Check if weapon type should show animation for this skill
    const weapons = subject.weapons();
    const shouldShowAnimation = weapons.length > 0 && weapons[0] && 
      ![7, 8, 9, 10, 11].includes(weapons[0].wtypeId);
    
    if (shouldShowAnimation) {
      this._lastAttacker = subject;
      this._multiAttackHitCount = 0;
      this._skillAnimations = skill.weaponAnimations;
      debugLog(
        `Skill ${skill.name} has animations:`,
        this._skillAnimations
      );
    } else {
      this._lastAttacker = null;
      this._multiAttackHitCount = 0;
      this._skillAnimations = null;
      debugLog(
        `Skill ${skill.name} has animations but weapon type ${weapons[0]?.wtypeId} should not show them`
      );
    }
  } else {
    this._lastAttacker = null;
    this._multiAttackHitCount = 0;
    this._skillAnimations = null;
  }
} else if (action.isSkill()) {
        // Check if skill has Movement animations
        const skill = action.item();
        if (
          skill &&
          skill.weaponAnimations &&
          skill.weaponAnimations.length > 0
        ) {
          this._lastAttacker = subject;
          this._multiAttackHitCount = 0;
          this._skillAnimations = skill.weaponAnimations;
          debugLog(
            `Skill ${skill.name} has animations:`,
            this._skillAnimations
          );
        } else {
          this._lastAttacker = null;
          this._multiAttackHitCount = 0;
          this._skillAnimations = null;
        }
      } else {
        this._lastAttacker = null;
        this._multiAttackHitCount = 0;
        this._skillAnimations = null;
      }
    } else {
      this._lastAttacker = null;
      this._multiAttackHitCount = 0;
      this._skillAnimations = null;
    }

    _Window_BattleLog_startAction.call(this, subject, action, targets);
  };
  const _Window_BattleLog_displayActionResults =
    Window_BattleLog.prototype.displayActionResults;
  Window_BattleLog.prototype.displayActionResults = function (subject, target) {
    // Play weapon animation on ANY attack action result (hit, miss, evade, counter, etc.)
    if (
      target &&
      target.result().used &&
      this._lastAttacker &&
      this._lastAttacker.isActor()
    ) {
      const actor = this._lastAttacker;
      const weapons = actor.weapons();
      const isDualWielding = weapons.length >= 2;

      // Determine weapon index for dual wield
      let weaponIndex = 0;
      if (isDualWielding) {
        this._multiAttackHitCount = this._multiAttackHitCount || 0;
        const weapon1Repeats = weapons[0] ? actor.attackTimesAdd() + 1 : 1;
        weaponIndex = this._multiAttackHitCount < weapon1Repeats ? 0 : 1;
      }

      // Play animation even on miss/evade/counter
      if (SceneManager._scene._spriteset) {
        SceneManager._scene._spriteset.playWeaponAnimation(
          this._skillAnimations,
          weaponIndex
        );
      }

    // Play sound on hit, or on miss/block/counter for ranged weapons (types 7, 8, 9)
    const shouldPlaySound = target.result().isHit() || (() => {
      const weapons = actor.weapons();
      if (weapons.length === 0) return false;
      const weapon = weapons[0];
      return weapon && (weapon.wtypeId === 7 || weapon.wtypeId === 8 || weapon.wtypeId === 9);
    })();

    if (shouldPlaySound && !this._skillAnimations) {
      const noMultiSound = actor.hasNoMultiAttackSound();
      this._multiAttackHitCount = this._multiAttackHitCount || 0;

      if (this._multiAttackHitCount === 0 || !noMultiSound) {
        actor.playWeaponSound();
      }
    }

      this._multiAttackHitCount = (this._multiAttackHitCount || 0) + 1;
    }

    _Window_BattleLog_displayActionResults.call(this, subject, target);
  };
  // In Window_BattleLog.prototype.displayHpDamage - Replace the existing method:
  const _Window_BattleLog_displayHpDamage =
    Window_BattleLog.prototype.displayHpDamage;
  Window_BattleLog.prototype.displayHpDamage = function (target) {
    if (
      target &&
      target.isActor() &&
      SceneManager._scene._spriteset &&
      SceneManager._scene._spriteset._shieldSprite
    ) {
      SceneManager._scene._spriteset._shieldSprite.playBlockAnimation();
      debugLog("Shield block animation triggered");
    }

    // In Window_BattleLog.prototype.displayHpDamage - Replace the sound playing section:
    if (
      target &&
      target.isEnemy() &&
      this._lastAttacker &&
      this._lastAttacker.isActor()
    ) {
      this._multiAttackHitCount = this._multiAttackHitCount || 0;
      const noMultiSound = this._lastAttacker.hasNoMultiAttackSound();

      // NEW: Determine which weapon is hitting based on attack count for dual wield
      const weapons = this._lastAttacker.weapons();
      const isDualWielding = weapons.length >= 2;
      let weaponIndex = 0;

      if (isDualWielding) {
        // Calculate which weapon should animate based on hit count
        const weapon1Repeats = weapons[0]
          ? this._lastAttacker.attackTimesAdd() + 1
          : 1;
        weaponIndex = this._multiAttackHitCount < weapon1Repeats ? 0 : 1;
      }

      if (SceneManager._scene._spriteset) {
        SceneManager._scene._spriteset.playWeaponAnimation(
          this._skillAnimations,
          weaponIndex
        );
      }

      // NEW: Play sound for the correct weapon based on weaponIndex
      if (!this._skillAnimations) {
        if (this._multiAttackHitCount === 0 || !noMultiSound) {
          // Get sounds from the correct weapon
          let sounds = null;
          if (isDualWielding && weaponIndex === 1 && weapons[1]) {
            // Left hand weapon - get its specific sounds
            const leftWeapon = weapons[1];
            if (leftWeapon.weaponSounds && leftWeapon.weaponSounds.length > 0) {
              sounds = leftWeapon.weaponSounds;
            } else if (
              leftWeapon.wtypeId &&
              DEFAULT_WEAPON_SOUNDS[leftWeapon.wtypeId]
            ) {
              sounds = DEFAULT_WEAPON_SOUNDS[leftWeapon.wtypeId];
            }
          } else {
            // Right hand weapon - use existing method
            sounds = this._lastAttacker.getWeaponSounds();
          }

          // Play the sound
          if (sounds && sounds.length > 0) {
            const soundName = sounds[Math.floor(Math.random() * sounds.length)];
            const basePitch = 100;
            const variation = pitchVariation;
            const randomPitch =
              basePitch + (Math.random() * variation * 2 - variation);
            const pitch = Math.round(Math.max(50, Math.min(150, randomPitch)));

            let finalSoundName = soundName;
            if (useSubfolder && !soundName.includes("/")) {
              finalSoundName = "Weapons/" + soundName;
            }

            const se = {
              name: finalSoundName,
              volume: volume,
              pitch: pitch,
              pan: 0,
            };

            AudioManager.playSe(se);
            debugLog(
              `Damage Display: Actor ${this._lastAttacker.name()} hit enemy ${target.name()} with weapon ${weaponIndex + 1
              } (Hit #${this._multiAttackHitCount + 1
              }), playing sound "${finalSoundName}"`
            );
          }
        } else {
          debugLog(
            `Damage Display: Skipping sound for hit #${this._multiAttackHitCount + 1
            } (NoMultiAttackSound enabled)`
          );
        }
      }

      this._multiAttackHitCount++;
    }

    _Window_BattleLog_displayHpDamage.call(this, target);
  };
  const _Window_BattleLog_endAction = Window_BattleLog.prototype.endAction;
  Window_BattleLog.prototype.endAction = function (subject) {
    this._multiAttackHitCount = 0;
    this._lastAttacker = null;
    _Window_BattleLog_endAction.call(this, subject);
  };
// Add this after the existing _Scene_Battle_start alias
// Replace the existing _Scene_Battle_start alias
const _Scene_Battle_start = Scene_Battle.prototype.start;
Scene_Battle.prototype.start = function() {
    _Scene_Battle_start.call(this);

    // Clear any old weapon picture cache to prevent corruption
    if (ImageManager._weaponPictureCache) {
        ImageManager._weaponPictureCache = {};
    }

    // Force weapon sprites to reinitialize when battle starts
    if (this._spriteset) {
        // Clear all weapon sprites first to ensure clean state
        if (this._spriteset._weaponSprite) {
            this._spriteset._weaponSprite.clearWeapon();
        }
        if (this._spriteset._weaponSpriteLeft) {
            this._spriteset._weaponSpriteLeft.clearWeapon();
        }

        // Now update with current equipment
        this._spriteset.updateWeaponSprite();

        // Ensure bullet gauge is set for first actor
        const actor = $gameParty.battleMembers()[0];
        if (actor && this._spriteset._bulletGauge) {
            this._spriteset._bulletGauge.setActor(actor);
        }
    }
};
  //=============================================================================
  // Sprite_WeaponFPS - FPS Weapon Display with Movement
  //=============================================================================

  function Sprite_WeaponFPS() {
    this.initialize(...arguments);
  }

  Sprite_WeaponFPS.prototype = Object.create(Sprite.prototype);
  Sprite_WeaponFPS.prototype.constructor = Sprite_WeaponFPS;

  Sprite_WeaponFPS.prototype.initialize = function (mirrored = false) {
    Sprite.prototype.initialize.call(this);
    this._mirrored = mirrored;
    const scale = getResolutionScale();
    this._baseX = mirrored ? getScaledWeaponX(true) : getScaledWeaponX(false);
    this._baseY = getScaledWeaponY() + Math.round(100 * scale.y);
    this.anchor.x = 0.4;
    this.anchor.y = 0.8;
    this._currentWeapon = null;
    this._weaponFrames = [];
    this._currentSpriteFrame = 0;
    this._animating = false;
    this._animationFrames = [];
    this._availableAnimations = [];
    this._currentFrame = 0;
    this._animationStartTime = 0;
    this._spriteFrameStartTime = 0;
    this._isPlayingSpriteAnimation = false;
    this._spriteAnimationComplete = false;
    this._idleCounter = Math.random() * 100;
    this._idleAmplitudeY = 3;
    this._idleAmplitudeRot = 0.005;
    this._idleSpeed = 0.02;
    this._muzzleFlashSprite = null;
    this._muzzleFlashActive = false;
    this._muzzleFlashStartTime = 0;
    this._muzzleFlashDuration = 50;
    this._muzzleFlashOffset = { x: 0, y: 0 };
    this.resetPosition();
  };
  Sprite_WeaponFPS.prototype.getAnimationSpeed = function () {
    return this._weaponData?.animationSpeed || animationSpeed;
  };
  Sprite_WeaponFPS.prototype._lerp = function (start, end, t) {
    return start + (end - start) * t;
  };

  // Update Sprite_WeaponFPS.prototype.resetPosition to apply custom transforms:

  Sprite_WeaponFPS.prototype.resetPosition = function () {
    this.x = this._baseX + (this._weaponData?.offsetX || 0);
    this.y = this._baseY + (this._weaponData?.offsetY || 0);
    // Apply mirroring to scale
    const baseScale = this._weaponData?.scale || 1.0;
    this.scale.x = this._mirrored ? -baseScale : baseScale; // NEW: Apply mirroring
    this.scale.y = baseScale;
    // Apply mirroring to rotation
    const baseRotation = this._weaponData?.rotation || 0;
    this.rotation = this._mirrored ? -baseRotation : baseRotation; // NEW: Apply mirroring
    this.setColorTone([0, 0, 0, 0]);
  };
  // Update Sprite_WeaponFPS.prototype.setWeapon to store weapon data:

  Sprite_WeaponFPS.prototype.setWeapon = function (actor) {
    if (!actor) {
      this.clearWeapon();
      return;
    }

    const weaponData = actor.getWeaponSpriteData();
    if (!weaponData) {
      this.clearWeapon();
      return;
    }

    // Always reload weapon data, even if it appears to be the same weapon
    // This fixes the issue where sprites don't reappear after battle
    this._currentWeapon = weaponData.sprite;
    this._weaponFrames = weaponData.frames || [weaponData.sprite];
    this._currentSpriteFrame = 0;
    this._availableAnimations = weaponData.animations || ["Swing"];

    // Store weapon customization data
    const weapons = actor.weapons();
    if (weapons.length > 0) {
      const weapon = weapons[0];
      this._weaponData = {
        scale: weapon.weaponScale || 1.0,
        rotation: ((weapon.weaponRotation || 0) * Math.PI) / 180,
        offsetX: weapon.weaponOffsetX || 0,
        offsetY: weapon.weaponOffsetY || 0,
        animationSpeed: weapon.animationSpeed,
      };
    } else {
      this._weaponData = {
        scale: 1.0,
        rotation: 0,
        offsetX: 0,
        offsetY: 0,
        animationSpeed: animationSpeed,
      };
    }

    // Force bitmap reload
    this.loadWeaponSprite();
    this.visible = true;
    debugLog("Weapon sprite set:", weaponData);
};
  Sprite_WeaponFPS.prototype.loadWeaponSprite = function () {
    if (this._weaponFrames.length > 0) {
      const frameName = this._weaponFrames[this._currentSpriteFrame];
      this.bitmap = ImageManager.loadWeaponPicture(frameName);
      this.resetPosition(); // This will apply mirroring
      debugLog(
        `Loaded sprite frame: ${frameName} (${this._currentSpriteFrame}/${this._weaponFrames.length - 1
        })${this._mirrored ? " (mirrored)" : ""}`
      );
    }
  };

  Sprite_WeaponFPS.prototype.clearWeapon = function () {
    this.bitmap = null;
    this._currentWeapon = null;
    this._weaponFrames = [];
    this._currentSpriteFrame = 0;
    this._availableAnimations = [];
    this._animating = false;
    this._isPlayingSpriteAnimation = false;
    this._muzzleFlashOffset = { x: 0, y: 0 }; // Add this line
    if (this._muzzleFlashSprite) {
      this._muzzleFlashSprite.visible = false;
      this._muzzleFlashActive = false;
    }
    this.visible = false;
  };
  Sprite_WeaponFPS.prototype.createMuzzleFlash = function () {
    if (!this._muzzleFlashSprite) {
      this._muzzleFlashSprite = new Sprite();
      this._muzzleFlashSprite.bitmap = new Bitmap(32, 32);
      this._muzzleFlashSprite.anchor.x = 0.5;
      this._muzzleFlashSprite.anchor.y = 0.5;
      this._muzzleFlashSprite.blendMode = 1; // Additive blending
      this._muzzleFlashSprite.visible = false;
      this.addChild(this._muzzleFlashSprite);

      // Draw muzzle flash (bright circle with gradient)
      const bitmap = this._muzzleFlashSprite.bitmap;
      const ctx = bitmap.context;
      const gradient = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
      gradient.addColorStop(0, "rgba(255, 255, 200, 1)");
      gradient.addColorStop(0.5, "rgba(255, 200, 0, 0.8)");
      gradient.addColorStop(1, "rgba(255, 100, 0, 0)");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 32, 32);
      bitmap._baseTexture.update();
    }
  };

  Sprite_WeaponFPS.prototype.setMuzzleFlashOffset = function (
    offsetX,
    offsetY
  ) {
    this._muzzleFlashOffset = { x: offsetX, y: offsetY };
  };

  Sprite_WeaponFPS.prototype.showMuzzleFlash = function () {
    if (!this._muzzleFlashSprite) {
      this.createMuzzleFlash();
    }

    this._muzzleFlashSprite.x = this._muzzleFlashOffset.x;
    this._muzzleFlashSprite.y = this._muzzleFlashOffset.y;
    this._muzzleFlashSprite.visible = true;
    this._muzzleFlashSprite.scale.x = 1.0;
    this._muzzleFlashSprite.scale.y = 1.0;
    this._muzzleFlashSprite.opacity = 255;
    this._muzzleFlashActive = true;
    this._muzzleFlashStartTime = Date.now();

    debugLog("Muzzle flash triggered at", this._muzzleFlashOffset);
  };
  Sprite_WeaponFPS.prototype.playAttackAnimation = function (
    animationOverride = null
  ) {
    if (!this._currentWeapon) {
      debugLog("No weapon available");
      return;
    }

    // Ensure muzzle flash offset exists
    if (!this._muzzleFlashOffset) {
      this._muzzleFlashOffset = { x: 0, y: 0 };
    }

    let animName;

    // NEW: Check for left-hand special animations when mirrored
    if (this._mirrored) {
      const actor = (BattleManager._subject && BattleManager._subject.isActor() ? BattleManager._subject : null) || BattleManager.actor() || $gameParty.battleMembers()[0];
      const weapons = actor ? actor.weapons() : [];
      const isDualWielding = weapons.length >= 2;

      if (isDualWielding && weapons[1]) {
        const leftWeapon = weapons[1];

        // Check if left weapon has Throw tag
        if (leftWeapon.isThrow) {
          this._animationFrames = MovementKeyFrame["LEFT_HAND_THROW"];
          debugLog("Using hardcoded left hand throw animation");
          this._animating = true;
          this._currentFrame = 0;
          this._animationStartTime = Date.now();

          // Start sprite frame animation if multi-frame weapon
          if (this._weaponFrames.length > 1) {
            this._isPlayingSpriteAnimation = true;
            this._currentSpriteFrame = 0;
            this._spriteFrameStartTime = Date.now();
            this.loadWeaponSprite();
          }
          return;
        }

        // Check if left weapon has Bullets tag
        if (leftWeapon.maxBullets && leftWeapon.maxBullets > 0) {
          this._animationFrames = MovementKeyFrame["LEFT_HAND_RECOIL"];
          debugLog("Using hardcoded left hand recoil animation");
          this._animating = true;
          this._currentFrame = 0;
          this._animationStartTime = Date.now();

          // Show muzzle flash if available
          if (
            this._muzzleFlashOffset &&
            (this._muzzleFlashOffset.x !== 0 || this._muzzleFlashOffset.y !== 0)
          ) {
            this.showMuzzleFlash();
          }

          // Start sprite frame animation if multi-frame weapon
          if (this._weaponFrames.length > 1) {
            this._isPlayingSpriteAnimation = true;
            this._currentSpriteFrame = 0;
            this._spriteFrameStartTime = Date.now();
            this.loadWeaponSprite();
          }
          return;
        }
        
        // Check if left weapon is gloves (type 11) - use Thrust for jab
        if (leftWeapon.wtypeId === 11) {
          this._animationFrames = MovementKeyFrame["Thrust"];
          debugLog("Using Thrust animation for left hand glove (jab)");
          this._animating = true;
          this._currentFrame = 0;
          this._animationStartTime = Date.now();
          
          // Start sprite frame animation if multi-frame weapon
          if (this._weaponFrames.length > 1) {
            this._isPlayingSpriteAnimation = true;
            this._currentSpriteFrame = 0;
            this._spriteFrameStartTime = Date.now();
            this.loadWeaponSprite();
          }
          return;
        }

        // Otherwise use hardcoded left hand swing
        this._animationFrames = MovementKeyFrame["LEFT_HAND_SWING"];
        debugLog("Using hardcoded left hand swing animation (mirrored)");
      } else {
        // Not dual wielding but mirrored (claws/gloves)
        this._animationFrames = MovementKeyFrame["LEFT_HAND_SWING"];
        debugLog("Using hardcoded left hand swing animation (mirrored)");
      }
    } else {
      // Right hand - use override if provided (from skill), otherwise use weapon's default animations
      if (animationOverride && animationOverride.length > 0) {
        animName =
          animationOverride[
          Math.floor(Math.random() * animationOverride.length)
          ];
        debugLog(`Using skill animation override: ${animName}`);
      } else if (this._availableAnimations.length > 0) {
        animName =
          this._availableAnimations[
          Math.floor(Math.random() * this._availableAnimations.length)
          ];
        debugLog(`Using weapon animation: ${animName}`);
      } else {
        debugLog("No animations available");
        return;
      }

      // Check if using Static animation
      if (animName.toLowerCase() === "static") {
        this._animationFrames = MovementKeyFrame["STATIC_ANIMATION"];
      } else if (!MovementKeyFrame[animName]) {
        debugLog(`Animation "${animName}" not found, using Swing`);
        this._animationFrames = MovementKeyFrame["Swing"];
      } else {
        this._animationFrames = MovementKeyFrame[animName];
      }
    }

    this._animating = true;
    this._currentFrame = 0;
    this._animationStartTime = Date.now();

    // Start sprite frame animation if multi-frame weapon
    if (this._weaponFrames.length > 1) {
      this._isPlayingSpriteAnimation = true;
      this._currentSpriteFrame = 0;
      this._spriteFrameStartTime = Date.now();
      this.loadWeaponSprite();
      debugLog(
        `Starting sprite animation with ${this._weaponFrames.length} frames`
      );
    }

    // Show muzzle flash if available (safely check for non-zero offset)
    if (
      this._muzzleFlashOffset &&
      (this._muzzleFlashOffset.x !== 0 || this._muzzleFlashOffset.y !== 0)
    ) {
      this.showMuzzleFlash();
    }
  };

  Sprite_WeaponFPS.prototype.advanceSpriteFrame = function () {
    if (this._weaponFrames.length <= 1) return;

    // Restart sprite animation from beginning for each hit
    this._currentSpriteFrame = 0;
    this._isPlayingSpriteAnimation = true;
    this._spriteAnimationComplete = false;
    this.loadWeaponSprite();
    this._spriteFrameStartTime = Date.now();
    debugLog(`Restarting sprite animation sequence for multi-hit`);
  };
  Sprite_WeaponFPS.prototype.resetToFirstFrame = function () {
    if (this._weaponFrames.length <= 1) return;

    this._currentSpriteFrame = 0;
    this.loadWeaponSprite();
    this._isPlayingSpriteAnimation = false;
    debugLog("Reset to first sprite frame");
  };

  Sprite_WeaponFPS.prototype.applyAnimationFrame = function (frame) {
    // Apply rotation (mirror for left hand)
    let rotation = ((frame.rotation || 0) * Math.PI) / 180;
    if (this._mirrored) {
      rotation = -rotation; // Mirror rotation
    }
    this.rotation = rotation;

    // Apply scale (flip horizontally if mirrored)
    const scale = frame.scale || 1.0;
    this.scale.x = this._mirrored ? -scale : scale; // NEW: Flip scale
    this.scale.y = scale;

    // Apply position offset from base position (mirror horizontal offset)
    const offsetX = this._mirrored ? -(frame.right || 0) : frame.right || 0; // NEW
    this.x = this._baseX + offsetX;
    this.y = this._baseY + (frame.bottom || 0);

    // Apply brightness as color tone
    const brightness = frame.brightness || 1.0;
    const gray = Math.round((brightness - 1.0) * 128);
    this.setColorTone([gray, gray, gray, 0]);
  };
  Sprite_WeaponFPS.prototype.update = function () {
    Sprite.prototype.update.call(this);

    if (this._idleCounter > 1000) {
      this._idleCounter = 0;
    }

    if (
      this._isPlayingSpriteAnimation &&
      this._weaponFrames.length > 1 &&
      !this._spriteAnimationComplete
    ) {
      const elapsed = Date.now() - this._spriteFrameStartTime;
      if (elapsed >= spriteFrameDuration) {
        this._currentSpriteFrame++;
        if (this._currentSpriteFrame >= this._weaponFrames.length) {
          this._currentSpriteFrame = this._weaponFrames.length - 1;
          this._spriteAnimationComplete = true;
          this._isPlayingSpriteAnimation = false;
          debugLog("Sprite animation cycle complete");
        }
        this.loadWeaponSprite();
        this._spriteFrameStartTime = Date.now();
      }
    }

    if (this._animating && this._animationFrames.length > 1) {
      const elapsed = Date.now() - this._animationStartTime;
      const frameDuration = animationSpeed;
      const totalDuration = (this._animationFrames.length - 1) * frameDuration;

      if (elapsed >= totalDuration) {
        if (!this._returningToIdle) {
          this._returningToIdle = true;
          this._returnStartTime = Date.now();
          this._returnStartFrame =
            this._animationFrames[this._animationFrames.length - 1];
        }

        const returnElapsed = Date.now() - this._returnStartTime;
        const returnDuration = 200;

        if (returnElapsed >= returnDuration) {
          this.resetPosition();
          this._animating = false;
          this._returningToIdle = false;

          if (this._weaponFrames.length > 1) {
            this.resetToFirstFrame();
          }
        } else {
          const returnProgress = returnElapsed / returnDuration;
          const easeProgress = this._easeOutCubic(returnProgress);

          const idleFrame = {
            rotation: 0,
            scale: 1.0,
            right: 0,
            bottom: 0,
            brightness: 1.0,
          };
          const interpolatedFrame = {};

          interpolatedFrame.rotation = this._lerp(
            this._returnStartFrame.rotation || 0,
            idleFrame.rotation,
            easeProgress
          );
          interpolatedFrame.scale = this._lerp(
            this._returnStartFrame.scale || 1.0,
            idleFrame.scale,
            easeProgress
          );
          interpolatedFrame.right = this._lerp(
            this._returnStartFrame.right || 0,
            idleFrame.right,
            easeProgress
          );
          interpolatedFrame.bottom = this._lerp(
            this._returnStartFrame.bottom || 0,
            idleFrame.bottom,
            easeProgress
          );
          interpolatedFrame.brightness = this._lerp(
            this._returnStartFrame.brightness || 1.0,
            idleFrame.brightness,
            easeProgress
          );

          this.applyAnimationFrame(interpolatedFrame);
        }
      } else {
        const progress = elapsed / frameDuration;
        const fromIndex = Math.floor(progress);
        const toIndex = fromIndex + 1;
        const factor = progress - fromIndex;

        const fromFrame = this._animationFrames[fromIndex];
        const toFrame = this._animationFrames[toIndex];

        const interpolatedFrame = {};
        interpolatedFrame.rotation = this._lerp(
          fromFrame.rotation || 0,
          toFrame.rotation || 0,
          factor
        );
        interpolatedFrame.scale = this._lerp(
          fromFrame.scale || 1.0,
          toFrame.scale || 1.0,
          factor
        );
        interpolatedFrame.right = this._lerp(
          fromFrame.right || 0,
          toFrame.right || 0,
          factor
        );
        interpolatedFrame.bottom = this._lerp(
          fromFrame.bottom || 0,
          toFrame.bottom || 0,
          factor
        );
        interpolatedFrame.brightness = this._lerp(
          fromFrame.brightness || 1.0,
          toFrame.brightness || 1.0,
          factor
        );

        this.applyAnimationFrame(interpolatedFrame);
      }
    } else if (this.bitmap && this.visible) {
      if (!this._animating) {
        this.resetPosition();
      }

      this._idleCounter += 1;
      const sway = Math.sin(this._idleCounter * this._idleSpeed);

      this.y =
        this._baseY +
        (this._weaponData?.offsetY || 0) +
        sway * this._idleAmplitudeY;

      // Mirror rotation for left hand
      const baseRotation = this._weaponData?.rotation || 0;
      const swayRotation = sway * this._idleAmplitudeRot;
      this.rotation = this._mirrored
        ? -(baseRotation + swayRotation)
        : baseRotation + swayRotation;

      this.x = this._baseX + (this._weaponData?.offsetX || 0);
      this.scale.x = this._mirrored
        ? -(this._weaponData?.scale || 1.0)
        : this._weaponData?.scale || 1.0;
      this.scale.y = this._weaponData?.scale || 1.0;
      this.setColorTone([0, 0, 0, 0]);
    }

    if (this._muzzleFlashActive) {
      const elapsed = Date.now() - this._muzzleFlashStartTime;
      if (elapsed >= this._muzzleFlashDuration) {
        this._muzzleFlashSprite.visible = false;
        this._muzzleFlashActive = false;
      } else {
        const progress = elapsed / this._muzzleFlashDuration;
        this._muzzleFlashSprite.opacity = 255 * (1 - progress);
        this._muzzleFlashSprite.scale.x = 1.0 + progress * 0.5;
        this._muzzleFlashSprite.scale.y = 1.0 + progress * 0.5;
      }
    }
  };

  // Add easing function for smoother return
  Sprite_WeaponFPS.prototype._easeOutCubic = function (t) {
    return 1 - Math.pow(1 - t, 3);
  };

  // Add new Sprite_ShieldFPS class after Sprite_WeaponFPS
  function Sprite_ShieldFPS() {
    this.initialize(...arguments);
  }

  Sprite_ShieldFPS.prototype = Object.create(Sprite.prototype);
  Sprite_ShieldFPS.prototype.constructor = Sprite_ShieldFPS;

  Sprite_ShieldFPS.prototype.initialize = function () {
    Sprite.prototype.initialize.call(this);
    const scale = getResolutionScale();
    this._baseX = getScaledWeaponX(true); // Shield is always on left
    this._baseY = getScaledWeaponY() + Math.round(100 * scale.y);
    this.anchor.x = 0.6;
    this.anchor.y = 0.8;
    this._currentShield = null;
    this._shieldFrames = [];
    this._currentSpriteFrame = 0;
    this._animating = false;
    this._animationFrames = [];
    this._availableAnimations = [];
    this._currentFrame = 0;
    this._animationStartTime = 0;
    this._spriteFrameStartTime = 0;
    this._isPlayingSpriteAnimation = false;
    this._spriteAnimationComplete = false;
    this._idleCounter = Math.random() * 100;
    this._idleAmplitudeY = 3;
    this._idleAmplitudeRot = 0.005;
    this._idleSpeed = 0.02;
    this._shieldData = {
      scale: 1.0,
      rotation: 0,
      offsetX: 0,
      offsetY: 0,
    };
    this.resetPosition();
  };

  Sprite_ShieldFPS.prototype.resetPosition = function () {
    this.x = this._baseX + (this._shieldData?.offsetX || 0);
    this.y = this._baseY + (this._shieldData?.offsetY || 0);
    this.scale.x = this._shieldData?.scale || 1.0;
    this.scale.y = this._shieldData?.scale || 1.0;
    this.rotation = this._shieldData?.rotation || 0;
    this.setColorTone([0, 0, 0, 0]);
  };

  Sprite_ShieldFPS.prototype.setShield = function (actor) {
    if (!actor) {
      this.clearShield();
      return;
    }

    const shieldData = actor.getShieldSpriteData();
    if (!shieldData) {
      this.clearShield();
      return;
    }

    this._currentShield = shieldData.sprite;
    this._shieldFrames = shieldData.frames || [shieldData.sprite];
    this._currentSpriteFrame = 0;
    this._availableAnimations = shieldData.animations || ["Swing"];

    const offset = actor.getShieldOffset();
    this._shieldData = {
      scale: actor.getShieldScale(),
      rotation: ((actor.getShieldRotation() || 0) * Math.PI) / 180,
      offsetX: offset.x,
      offsetY: offset.y,
    };

    this.loadShieldSprite();
    this.visible = true;
    debugLog("Shield sprite set:", shieldData);
  };

  Sprite_ShieldFPS.prototype.loadShieldSprite = function () {
    if (this._shieldFrames.length > 0) {
      const frameName = this._shieldFrames[this._currentSpriteFrame];
      this.bitmap = ImageManager.loadWeaponPicture(frameName);
      this.resetPosition();
      debugLog(
        `Loaded shield frame: ${frameName} (${this._currentSpriteFrame}/${this._shieldFrames.length - 1
        })`
      );
    }
  };

  Sprite_ShieldFPS.prototype.clearShield = function () {
    this.bitmap = null;
    this._currentShield = null;
    this._shieldFrames = [];
    this._currentSpriteFrame = 0;
    this._availableAnimations = [];
    this._animating = false;
    this._isPlayingSpriteAnimation = false;
    this.visible = false;
  };

  Sprite_ShieldFPS.prototype.playBlockAnimation = function () {
    if (!this._currentShield) {
      debugLog("No shield available");
      return;
    }

    let animName;
    if (this._availableAnimations.length > 0) {
      animName =
        this._availableAnimations[
        Math.floor(Math.random() * this._availableAnimations.length)
        ];
      debugLog(`Using shield animation: ${animName}`);
    } else {
      debugLog("No animations available for shield");
      return;
    }

    if (animName.toLowerCase() === "static") {
      this._animationFrames = STATIC_ANIMATION;
    } else if (!MovementKeyFrame[animName]) {
      debugLog(`Animation "${animName}" not found, using Swing`);
      this._animationFrames = MovementKeyFrame["Swing"];
    } else {
      this._animationFrames = MovementKeyFrame[animName];
    }

    this._animating = true;
    this._currentFrame = 0;
    this._animationStartTime = Date.now();

    if (this._shieldFrames.length > 1) {
      this._isPlayingSpriteAnimation = true;
      this._currentSpriteFrame = 0;
      this._spriteFrameStartTime = Date.now();
      this.loadShieldSprite();
      debugLog(
        `Starting shield sprite animation with ${this._shieldFrames.length} frames`
      );
    }
  };

  Sprite_ShieldFPS.prototype._lerp = function (start, end, t) {
    return start + (end - start) * t;
  };

  Sprite_ShieldFPS.prototype.applyAnimationFrame = function (frame) {
    this.rotation = ((frame.rotation || 0) * Math.PI) / 180;
    const scale = frame.scale || 1.0;
    this.scale.x = scale;
    this.scale.y = scale;
    this.x = this._baseX + (frame.right || 0);
    this.y = this._baseY + (frame.bottom || 0);
    const brightness = frame.brightness || 1.0;
    const gray = Math.round((brightness - 1.0) * 128);
    this.setColorTone([gray, gray, gray, 0]);
  };

  Sprite_ShieldFPS.prototype._easeOutCubic = function (t) {
    return 1 - Math.pow(1 - t, 3);
  };

  Sprite_ShieldFPS.prototype.update = function () {
    Sprite.prototype.update.call(this);

    if (this._idleCounter > 1000) {
      this._idleCounter = 0;
    }

    if (
      this._isPlayingSpriteAnimation &&
      this._shieldFrames.length > 1 &&
      !this._spriteAnimationComplete
    ) {
      const elapsed = Date.now() - this._spriteFrameStartTime;
      if (elapsed >= spriteFrameDuration) {
        this._currentSpriteFrame++;
        if (this._currentSpriteFrame >= this._shieldFrames.length) {
          this._currentSpriteFrame = this._shieldFrames.length - 1;
          this._spriteAnimationComplete = true;
          this._isPlayingSpriteAnimation = false;
          debugLog("Shield sprite animation cycle complete");
        }
        this.loadShieldSprite();
        this._spriteFrameStartTime = Date.now();
      }
    }

    if (this._animating && this._animationFrames.length > 1) {
      const elapsed = Date.now() - this._animationStartTime;
      const frameDuration = animationSpeed;
      const totalDuration = (this._animationFrames.length - 1) * frameDuration;

      if (elapsed >= totalDuration) {
        if (!this._returningToIdle) {
          this._returningToIdle = true;
          this._returnStartTime = Date.now();
          this._returnStartFrame =
            this._animationFrames[this._animationFrames.length - 1];
        }

        const returnElapsed = Date.now() - this._returnStartTime;
        const returnDuration = 200;

        if (returnElapsed >= returnDuration) {
          this.resetPosition();
          this._animating = false;
          this._returningToIdle = false;

          if (this._shieldFrames.length > 1) {
            this._currentSpriteFrame = 0;
            this.loadShieldSprite();
            this._isPlayingSpriteAnimation = false;
          }
        } else {
          const returnProgress = returnElapsed / returnDuration;
          const easeProgress = this._easeOutCubic(returnProgress);

          const idleFrame = {
            rotation: 0,
            scale: 1.0,
            right: 0,
            bottom: 0,
            brightness: 1.0,
          };
          const interpolatedFrame = {};

          interpolatedFrame.rotation = this._lerp(
            this._returnStartFrame.rotation || 0,
            idleFrame.rotation,
            easeProgress
          );
          interpolatedFrame.scale = this._lerp(
            this._returnStartFrame.scale || 1.0,
            idleFrame.scale,
            easeProgress
          );
          interpolatedFrame.right = this._lerp(
            this._returnStartFrame.right || 0,
            idleFrame.right,
            easeProgress
          );
          interpolatedFrame.bottom = this._lerp(
            this._returnStartFrame.bottom || 0,
            idleFrame.bottom,
            easeProgress
          );
          interpolatedFrame.brightness = this._lerp(
            this._returnStartFrame.brightness || 1.0,
            idleFrame.brightness,
            easeProgress
          );

          this.applyAnimationFrame(interpolatedFrame);
        }
      } else {
        const progress = elapsed / frameDuration;
        const fromIndex = Math.floor(progress);
        const toIndex = fromIndex + 1;
        const factor = progress - fromIndex;

        const fromFrame = this._animationFrames[fromIndex];
        const toFrame = this._animationFrames[toIndex];

        const interpolatedFrame = {};
        interpolatedFrame.rotation = this._lerp(
          fromFrame.rotation || 0,
          toFrame.rotation || 0,
          factor
        );
        interpolatedFrame.scale = this._lerp(
          fromFrame.scale || 1.0,
          toFrame.scale || 1.0,
          factor
        );
        interpolatedFrame.right = this._lerp(
          fromFrame.right || 0,
          toFrame.right || 0,
          factor
        );
        interpolatedFrame.bottom = this._lerp(
          fromFrame.bottom || 0,
          toFrame.bottom || 0,
          factor
        );
        interpolatedFrame.brightness = this._lerp(
          fromFrame.brightness || 1.0,
          toFrame.brightness || 1.0,
          factor
        );

        this.applyAnimationFrame(interpolatedFrame);
      }
    } else if (this.bitmap && this.visible) {
      if (!this._animating) {
        this.resetPosition();
      }

      this._idleCounter += 1;
      const sway = Math.sin(this._idleCounter * this._idleSpeed);

      this.y =
        this._baseY +
        (this._shieldData?.offsetY || 0) +
        sway * this._idleAmplitudeY;
      this.rotation =
        (this._shieldData?.rotation || 0) + sway * this._idleAmplitudeRot;

      this.x = this._baseX + (this._shieldData?.offsetX || 0);
      this.scale.x = this._shieldData?.scale || 1.0;
      this.scale.y = this._shieldData?.scale || 1.0;
      this.setColorTone([0, 0, 0, 0]);
    }
  };

  Sprite_ShieldFPS.prototype.destroy = function () {
    this.clearShield();
    Sprite.prototype.destroy.call(this);
  };
  //=============================================================================
  // Sprite_BulletGauge - Bullet Display
  //=============================================================================

  function Sprite_BulletGauge() {
    this.initialize(...arguments);
  }

  Sprite_BulletGauge.prototype = Object.create(Sprite.prototype);
  Sprite_BulletGauge.prototype.constructor = Sprite_BulletGauge;

  Sprite_BulletGauge.prototype.initialize = function () {
    Sprite.prototype.initialize.call(this);
    this._actor = null;
    this._lastCurrent = -1;
    this._lastMax = -1;
    this.bitmap = new Bitmap(120, 40);
    const scale = getResolutionScale();
    this.x = Math.round(300 * scale.x);
    this.y = Math.round(70 * scale.y);
  };

  Sprite_BulletGauge.prototype.setActor = function (actor) {
    if (this._actor !== actor) {
      this._actor = actor;
      this._lastCurrent = -1;
      this._lastMax = -1;
    }
  };

  Sprite_BulletGauge.prototype.update = function () {
    Sprite.prototype.update.call(this);

    if (this._actor) {
      const config = this._actor.getWeaponBulletConfig();
      if (config) {
        const current = this._actor.getCurrentBullets();
        if (current !== this._lastCurrent || config.max !== this._lastMax) {
          this.refresh(current, config.max);
          this._lastCurrent = current;
          this._lastMax = config.max;
        }
        this.visible = true;
      } else {
        this.visible = false;
      }
    } else {
      this.visible = false;
    }
  };

  // Replace the Sprite_BulletGauge.prototype.refresh method (around line 1988)
  Sprite_BulletGauge.prototype.refresh = function (current, max) {
    this.bitmap.clear();

    // Determine icon based on weapon type
    let iconIndex = 104; // Default bullet icon
    if (this._actor) {
      const weapons = this._actor.weapons();
      if (weapons.length > 0 && weapons[0]) {
        const weapon = weapons[0];
        if (weapon.wtypeId === 7) {
          iconIndex = 102; // Bow/arrow icon
        }
      }
    }

    // Draw weapon icon
    const iconBitmap = ImageManager.loadSystem("IconSet");
    const pw = ImageManager.iconWidth;
    const ph = ImageManager.iconHeight;
    const sx = (iconIndex % 16) * pw;
    const sy = Math.floor(iconIndex / 16) * ph;

    this.bitmap.blt(iconBitmap, sx, sy, pw, ph, 0, 0);

    // Draw bullet count text next to icon
    this.bitmap.fontSize = 24;
    this.bitmap.textColor = "#FFFFFF";
    this.bitmap.outlineWidth = 4;
    this.bitmap.outlineColor = "#000000";
    this.bitmap.drawText(`x ${current}`, 36, 4, 80, 32, "left");
  };

  //=============================================================================
  // Spriteset_Battle - Weapon and Bullet Display
  //=============================================================================

  const _Spriteset_Battle_createLowerLayer =
    Spriteset_Battle.prototype.createLowerLayer;
  Spriteset_Battle.prototype.createLowerLayer = function () {
    _Spriteset_Battle_createLowerLayer.call(this);
    this.createWeaponSprite();
    this.createBulletGauge();
  };
  Spriteset_Battle.prototype.createWeaponSprite = function () {
    this._weaponSprite = new Sprite_WeaponFPS(false); // Right hand
    this._weaponSpriteLeft = new Sprite_WeaponFPS(true); // Left hand (mirrored)
    this._whipSprite = new Sprite_WhipWeapon();
    this._flailSprite = new Sprite_FlailWeapon();
    this._nunchakuSprite = new Sprite_NunchakuWeapon();
    this._bowSprite = new Sprite_BowWeapon();
    this._throwSprite = new Sprite_ThrowWeapon();
    this._projectileSprite = new Sprite_Projectile();
    this._shieldSprite = new Sprite_ShieldFPS();

    this.addChild(this._whipSprite);
    this.addChild(this._flailSprite);
    this.addChild(this._nunchakuSprite);
    this.addChild(this._bowSprite);
    this.addChild(this._weaponSprite);
    this.addChild(this._weaponSpriteLeft);
    this.addChild(this._throwSprite);
    this.addChild(this._projectileSprite);
    this.addChild(this._shieldSprite);

    this.updateWeaponSprite();
  };
  Spriteset_Battle.prototype.createBulletGauge = function () {
    this._bulletGauge = new Sprite_BulletGauge();
    this.addChild(this._bulletGauge);
  };
  // Replace the entire updateWeaponSprite method around line 2218
  Spriteset_Battle.prototype.updateWeaponSprite = function () {
    if (!this._weaponSprite) return;

    const actor =
      BattleManager.actor() ||
      (BattleManager._subject && BattleManager._subject.isActor() ? BattleManager._subject : null) ||
      $gameParty.battleMembers()[0];
    if (!actor) return;

    // Update shield first (always check)
    if (this._shieldSprite) {
      this._shieldSprite.setShield(actor);
    }

    // Get weapon data once at the top
    const weapons = actor.weapons();
    const isDualWielding = weapons.length >= 2;
    const isClaws =
      weapons.length > 0 &&
      weapons[0] &&
      (weapons[0].wtypeId === 10);
    const shouldShowBothHands = isDualWielding || isClaws;

    // Initialize left hand physics-based weapon sprites if they don't exist
    if (!this._whipSpriteLeft) {
      this._whipSpriteLeft = new Sprite_WhipWeapon();
      this.addChild(this._whipSpriteLeft);
    }
    if (!this._flailSpriteLeft) {
      this._flailSpriteLeft = new Sprite_FlailWeapon();
      this.addChild(this._flailSpriteLeft);
    }
    if (!this._nunchakuSpriteLeft) {
      this._nunchakuSpriteLeft = new Sprite_NunchakuWeapon();
      this.addChild(this._nunchakuSpriteLeft);
    }

    // Helper function to clear all special weapon types
    const clearAllSpecialWeapons = () => {
      this._whipSprite.clear();
      this._flailSprite.clear();
      this._nunchakuSprite.clear();
      this._bowSprite.clear();
      this._throwSprite.clear();
    };

    // Helper function to clear all left hand special weapons
    const clearAllLeftHandSpecialWeapons = () => {
      if (this._whipSpriteLeft) this._whipSpriteLeft.clear();
      if (this._flailSpriteLeft) this._flailSpriteLeft.clear();
      if (this._nunchakuSpriteLeft) this._nunchakuSpriteLeft.clear();
    };

    // Handle primary weapon (right hand) based on type
    if (actor.isWeaponThrow()) {
      this._weaponSprite.visible = false;
      clearAllSpecialWeapons();

      if (!this._throwSprite._visible) {
        this._throwSprite.show();
        const spriteData = actor.getWeaponSpriteData();
        if (spriteData && spriteData.sprite) {
          this._throwSprite.setWeaponSprite(spriteData.sprite);
        }
        const weight = actor.getWeaponWeight();
        this._throwSprite.setWeight(weight);
      }
    } else if (actor.isWeaponWhip()) {
      this._weaponSprite.visible = false;
      this._flailSprite.clear();
      this._nunchakuSprite.clear();
      this._bowSprite.clear();
      this._throwSprite.clear();

      if (!this._whipSprite._visible) {
        this._whipSprite.show();
        const spriteData = actor.getWeaponSpriteData();
        if (spriteData && spriteData.sprite) {
          this._whipSprite.setWhipSprite(spriteData.sprite);
        }
        const color = actor.getWeaponColor();
        if (color) {
          this._whipSprite.setWhipColor(color);
        }
        if (weapons.length > 0 && weapons[0].segments) {
          this._whipSprite.setSegmentCount(weapons[0].segments);
        }
      }
    } else if (actor.isWeaponFlail()) {
      this._weaponSprite.visible = false;
      this._whipSprite.clear();
      this._nunchakuSprite.clear();
      this._bowSprite.clear();
      this._throwSprite.clear();

      if (!this._flailSprite._visible) {
        this._flailSprite.show();
        const spriteData = actor.getWeaponSpriteData();
        if (spriteData && spriteData.sprite) {
          this._flailSprite.setFlailHead(spriteData.sprite);
        }
        const color = actor.getWeaponColor();
        if (color) {
          this._flailSprite.setChainColor(color);
        }
        if (weapons.length > 0 && weapons[0].segments) {
          this._flailSprite.setSegmentCount(weapons[0].segments);
        }
      }
    } else if (actor.isWeaponNunchaku()) {
      this._weaponSprite.visible = false;
      this._whipSprite.clear();
      this._flailSprite.clear();
      this._bowSprite.clear();
      this._throwSprite.clear();

      if (!this._nunchakuSprite._visible) {
        this._nunchakuSprite.show();
        const spriteData = actor.getWeaponSpriteData();
        if (spriteData && spriteData.sprite) {
          this._nunchakuSprite.setNunchakuSprites(spriteData.sprite);
        }
        const color = actor.getWeaponColor();
        if (color) {
          this._nunchakuSprite.setChainColor(color);
        }
        if (weapons.length > 0 && weapons[0].segments) {
          this._nunchakuSprite.setSegmentCount(weapons[0].segments);
        }
      }
    } else if (actor.isWeaponBow()) {
      this._weaponSprite.visible = false;
      this._whipSprite.clear();
      this._flailSprite.clear();
      this._nunchakuSprite.clear();
      this._throwSprite.clear();

      if (!this._bowSprite._visible) {
        this._bowSprite.show();
        const colors = actor.getBowColors();
        if (colors) {
          this._bowSprite.setBowColors(colors.bow, colors.string);
        }
      }
    } else {
      // Standard weapons (swords, axes, etc.)
      clearAllSpecialWeapons();
      this._weaponSprite.setWeapon(actor); // This will set visible = true if successful
    }

    // Handle left hand weapon (dual wield or claws/gloves)
    if (!this._weaponSpriteLeft) return;

    // Clear left hand special weapons when not needed
    if (!isDualWielding || !weapons[1]) {
      clearAllLeftHandSpecialWeapons();
    }

    
    // SPECIAL CASE: Hide left hand for gloves (weapon type 10)
    const isGloves = weapons.length > 0 && weapons[0] && weapons[0].wtypeId === 11;
    if (isGloves && !isDualWielding) {
      this._weaponSpriteLeft.visible = false;
      clearAllLeftHandSpecialWeapons();
    } else if (shouldShowBothHands) {
      // Check what type of weapon is in the left hand
      if (isDualWielding && weapons[1]) {
        // LEFT HAND WHIP
        if (weapons[1].isWhip) {
          this._weaponSpriteLeft.visible = false;
          this._flailSpriteLeft.clear();
          this._nunchakuSpriteLeft.clear();

          if (!this._whipSpriteLeft._visible) {
            // Initialize left hand whip with mirrored position
            this._whipSpriteLeft._startX = getScaledWeaponX(true);
            this._whipSpriteLeft._startY = getScaledWeaponY();
            this._whipSpriteLeft.initializeSegments();
            this._whipSpriteLeft.show();

            // Load sprite if available
            if (weapons[1].weaponSprite) {
              this._whipSpriteLeft.setWhipSprite(weapons[1].weaponSprite);
            }

            // Set color if available
            if (weapons[1].whipColor) {
              this._whipSpriteLeft.setWhipColor(weapons[1].whipColor);
            }

            // Set segment count if available
            if (weapons[1].segments) {
              this._whipSpriteLeft.setSegmentCount(weapons[1].segments);
            }

            debugLog(`Showing left hand whip: ${weapons[1].name}`);
          }
        }
        // LEFT HAND FLAIL
        else if (weapons[1].isFlail) {
          this._weaponSpriteLeft.visible = false;
          this._whipSpriteLeft.clear();
          this._nunchakuSpriteLeft.clear();

          if (!this._flailSpriteLeft._visible) {
            // Initialize left hand flail with mirrored position
            this._flailSpriteLeft._startX = getScaledWeaponX(true);
            this._flailSpriteLeft._startY = getScaledWeaponY();
            this._flailSpriteLeft.initializeSegments();
            this._flailSpriteLeft.show();

            // Load sprite if available
            if (weapons[1].weaponSprite) {
              this._flailSpriteLeft.setFlailHead(weapons[1].weaponSprite);
            }

            // Set color if available
            if (weapons[1].whipColor) {
              this._flailSpriteLeft.setChainColor(weapons[1].whipColor);
            }

            // Set segment count if available
            if (weapons[1].segments) {
              this._flailSpriteLeft.setSegmentCount(weapons[1].segments);
            }

            debugLog(`Showing left hand flail: ${weapons[1].name}`);
          }
        }
        // LEFT HAND NUNCHAKU
        else if (weapons[1].isNunchaku) {
          this._weaponSpriteLeft.visible = false;
          this._whipSpriteLeft.clear();
          this._flailSpriteLeft.clear();

          if (!this._nunchakuSpriteLeft._visible) {
            // Initialize left hand nunchaku with mirrored position
            this._nunchakuSpriteLeft._startX = getScaledWeaponX(true);
            this._nunchakuSpriteLeft._startY = getScaledWeaponY();
            this._nunchakuSpriteLeft.initializeSegments();
            this._nunchakuSpriteLeft.show();

            // Load sprite if available
            if (weapons[1].weaponSprite) {
              this._nunchakuSpriteLeft.setNunchakuSprites(
                weapons[1].weaponSprite
              );
            }

            // Set color if available
            if (weapons[1].whipColor) {
              this._nunchakuSpriteLeft.setChainColor(weapons[1].whipColor);
            }

            // Set segment count if available
            if (weapons[1].segments) {
              this._nunchakuSpriteLeft.setSegmentCount(weapons[1].segments);
            }

            debugLog(`Showing left hand nunchaku: ${weapons[1].name}`);
          }
        }
        // NORMAL LEFT HAND WEAPON
        else {
          clearAllLeftHandSpecialWeapons();

          const leftWeaponData = {
            getWeaponSpriteData: function () {
              if (!weapons[1] || !weapons[1].weaponSprite) return null;
              return {
                sprite: weapons[1].weaponSprite,
                frames: weapons[1].weaponSpriteFrames || [
                  weapons[1].weaponSprite,
                ],
                animations: weapons[1].weaponAnimations || ["Swing"],
              };
            },
            weapons: function () {
              return [weapons[1]];
            },
          };
          this._weaponSpriteLeft.setWeapon(leftWeaponData); // This will set visible = true if successful
          debugLog(`Showing left hand weapon: ${weapons[1].name}`);
        }
      // Disabled: single claws/gloves no longer auto-show left hand
      } else if (false && isClawsOrGloves && !isDualWielding) {
      } else {
        // No valid left weapon
        this._weaponSpriteLeft.visible = false;
        clearAllLeftHandSpecialWeapons();
      }
    } else {
      // Not dual wielding or claws/gloves
      this._weaponSpriteLeft.visible = false;
      clearAllLeftHandSpecialWeapons();
    }
  };
  // Add helper method to find enemy sprite
  Spriteset_Battle.prototype.findTargetSprite = function (target) {
    if (!this._enemySprites) return null;

    for (const sprite of this._enemySprites) {
      if (sprite._battler === target) {
        return sprite;
      }
    }
    return null;
  };

  // Replace the playWeaponAnimation method around line 2354
  Spriteset_Battle.prototype.playWeaponAnimation = function (
    animationOverride = null,
    weaponIndex = 0
  ) {
    const actor =
      (BattleManager._subject && BattleManager._subject.isActor() ? BattleManager._subject : null) ||
      BattleManager.actor() ||
      $gameParty.battleMembers()[0];
    if (!actor) return;

    const weapons = actor.weapons();
    const isDualWielding = weapons.length >= 2;

    const isClawsOrGloves = false; // Disabled: single claws no longer show both hands
    const shouldShowBothHands = isDualWielding || isClawsOrGloves;

    // Determine which weapon sprite to animate
    const isLeftHand = weaponIndex === 1;
    const targetSprite = isLeftHand
      ? this._weaponSpriteLeft
      : this._weaponSprite;

    // Handle right hand weapon (weaponIndex 0)
    if (!isLeftHand) {
      if (actor.isWeaponThrow()) {
        const enemies = $gameTroop.aliveMembers();
        if (enemies.length > 0) {
          const target = enemies[0];
          const targetSprite = this.findTargetSprite(target);
          if (targetSprite && this._throwSprite) {
            const targetX = targetSprite.x;
            const targetY = targetSprite.y - targetSprite.height / 2;
            this._throwSprite.throwWeapon(targetX, targetY);
            debugLog("Throwing weapon towards enemy at", targetX, targetY);
          }
        }
      } else if (actor.isWeaponWhip()) {
        const enemies = $gameTroop.aliveMembers();
        if (enemies.length > 0) {
          const target = enemies[0];
          const targetSpriteEnemy = this.findTargetSprite(target);
          if (targetSpriteEnemy) {
            const targetX = targetSpriteEnemy.x;
            const targetY = targetSpriteEnemy.y - targetSpriteEnemy.height / 2;
            this._whipSprite.crack(targetX, targetY);
            debugLog("Whip cracking towards enemy at", targetX, targetY);
          }
        }
      } else if (actor.isWeaponFlail()) {
        const enemies = $gameTroop.aliveMembers();
        if (enemies.length > 0) {
          const target = enemies[0];
          const targetSpriteEnemy = this.findTargetSprite(target);
          if (targetSpriteEnemy) {
            const targetX = targetSpriteEnemy.x;
            const targetY = targetSpriteEnemy.y - targetSpriteEnemy.height / 2;
            this._flailSprite.swing(targetX, targetY);
            debugLog("Flail swinging towards enemy at", targetX, targetY);
          }
        }
      } else if (actor.isWeaponNunchaku()) {
        const enemies = $gameTroop.aliveMembers();
        if (enemies.length > 0) {
          const target = enemies[0];
          const targetSpriteEnemy = this.findTargetSprite(target);
          if (targetSpriteEnemy) {
            const targetX = targetSpriteEnemy.x;
            const targetY = targetSpriteEnemy.y - targetSpriteEnemy.height / 2;
            this._nunchakuSprite.swing(targetX, targetY);
            debugLog("Nunchaku swinging towards enemy at", targetX, targetY);
          }
        }
      } else if (actor.isWeaponBow()) {
        this._bowSprite.drawBow();
      } else if (targetSprite) {
        // Normal weapon animation for right hand
        if (!targetSprite._muzzleFlashOffset) {
          targetSprite._muzzleFlashOffset = { x: 0, y: 0 };
        }
        targetSprite.playAttackAnimation(animationOverride);
        debugLog(`Playing animation for right hand weapon`);
      }

      // Handle projectile sprite for right hand (bows, guns, etc.)
      const projectileSprite = actor.getWeaponProjectileSprite();
      if (projectileSprite && this._projectileSprite) {
        const enemies = $gameTroop.aliveMembers();
        if (enemies.length > 0) {
          const target = enemies[0];
          const targetSpriteEnemy = this.findTargetSprite(target);
          if (targetSpriteEnemy) {
            const scale = getResolutionScale();
            let startX = getScaledWeaponX();
            let startY = getScaledWeaponY() + Math.round(50 * scale.y);
            if (actor.isWeaponBow()) {
              startX =
                getScaledWeaponX() -
                Math.round(150 * scale.x) +
                Math.round(35 * scale.x);
              startY = getScaledWeaponY() - Math.round(100 * scale.y);
            }
            const targetX = targetSpriteEnemy.x;
            const targetY = targetSpriteEnemy.y - targetSpriteEnemy.height / 2;
            this._projectileSprite.fire(
              projectileSprite,
              startX,
              startY,
              targetX,
              targetY
            );
            debugLog(`Projectile "${projectileSprite}" fired at enemy`);
          }
        }
      }
    }

    // Handle left hand weapon animation (for dual wield or claws/gloves)
if (shouldShowBothHands && this._weaponSpriteLeft) {
  if (isLeftHand && weapons[1]) {
    // This is the left hand's turn to animate

    // LEFT HAND WHIP
    if (weapons[1].isWhip && this._whipSpriteLeft) {
      const enemies = $gameTroop.aliveMembers();
      if (enemies.length > 0) {
        const target = enemies[0];
        const targetSpriteEnemy = this.findTargetSprite(target);
        if (targetSpriteEnemy) {
          const targetX = targetSpriteEnemy.x;
          const targetY =
            targetSpriteEnemy.y - targetSpriteEnemy.height / 2;
          this._whipSpriteLeft.crack(targetX, targetY);
          debugLog(
            "Left hand whip cracking towards enemy at",
            targetX,
            targetY
          );
        }
      }
      return;
    }
    // LEFT HAND FLAIL
    else if (weapons[1].isFlail && this._flailSpriteLeft) {
      const enemies = $gameTroop.aliveMembers();
      if (enemies.length > 0) {
        const target = enemies[0];
        const targetSpriteEnemy = this.findTargetSprite(target);
        if (targetSpriteEnemy) {
          const targetX = targetSpriteEnemy.x;
          const targetY =
            targetSpriteEnemy.y - targetSpriteEnemy.height / 2;
          this._flailSpriteLeft.swing(targetX, targetY);
          debugLog(
            "Left hand flail swinging towards enemy at",
            targetX,
            targetY
          );
        }
      }
      return;
    }
    // LEFT HAND NUNCHAKU
    else if (weapons[1].isNunchaku && this._nunchakuSpriteLeft) {
      const enemies = $gameTroop.aliveMembers();
      if (enemies.length > 0) {
        const target = enemies[0];
        const targetSpriteEnemy = this.findTargetSprite(target);
        if (targetSpriteEnemy) {
          const targetX = targetSpriteEnemy.x;
          const targetY =
            targetSpriteEnemy.y - targetSpriteEnemy.height / 2;
          this._nunchakuSpriteLeft.swing(targetX, targetY);
          debugLog(
            "Left hand nunchaku swinging towards enemy at",
            targetX,
            targetY
          );
        }
      }
      return;
    }
    // NORMAL LEFT HAND WEAPON
    else if (this._weaponSpriteLeft.visible) {
      // NEW: Check if left hand weapon should use LEFT_HAND_SWING for skills
      const shouldUseLeftHandSwing = ![7, 8, 9, 10, 11].includes(weapons[1].wtypeId);
      
      if (shouldUseLeftHandSwing && animationOverride && animationOverride.length > 0) {
        // For skills with movement, use LEFT_HAND_SWING for eligible weapon types
        if (!this._weaponSpriteLeft._muzzleFlashOffset) {
          this._weaponSpriteLeft._muzzleFlashOffset = { x: 0, y: 0 };
        }
        // Override to use LEFT_HAND_SWING regardless of skill's animation
        this._weaponSpriteLeft._animationFrames = MovementKeyFrame["LEFT_HAND_SWING"];
        this._weaponSpriteLeft._animating = true;
        this._weaponSpriteLeft._currentFrame = 0;
        this._weaponSpriteLeft._animationStartTime = Date.now();
        debugLog(`Using LEFT_HAND_SWING for left hand weapon type ${weapons[1].wtypeId}`);
      } else {
        // Normal animation (for attacks or ineligible weapon types)
        if (!this._weaponSpriteLeft._muzzleFlashOffset) {
          this._weaponSpriteLeft._muzzleFlashOffset = { x: 0, y: 0 };
        }
        this._weaponSpriteLeft.playAttackAnimation(animationOverride);
        debugLog(
          `Playing animation for left hand weapon (index ${weaponIndex})`
        );
      }
    }
  }
  // Removed simultaneous animation for claws/gloves - now uses default sequential system
}
  };
  Spriteset_Battle.prototype.advanceWeaponSpriteFrame = function () {
    if (this._weaponSprite) {
      this._weaponSprite.advanceSpriteFrame();
    }
  };

  const _Spriteset_Battle_update = Spriteset_Battle.prototype.update;
  Spriteset_Battle.prototype.update = function () {
    _Spriteset_Battle_update.call(this);
    if (this._weaponSprite) {
      this._weaponSprite.update();
    }
    if (this._weaponSpriteLeft) {
      // NEW: Update left weapon
      this._weaponSpriteLeft.update();
    }
    if (this._shieldSprite) {
      this._shieldSprite.update();
    }
    if (this._projectileSprite) {
      this._projectileSprite.update();
    }
  };
  //=============================================================================
  // Scene_Battle - Command Handling and Updates
  //=============================================================================

  const _Scene_Battle_changeInputWindow =
    Scene_Battle.prototype.changeInputWindow;
  Scene_Battle.prototype.changeInputWindow = function () {
    _Scene_Battle_changeInputWindow.call(this);
    if (this._spriteset) {
      this._spriteset.updateWeaponSprite();
    }
  };

  const _Scene_Battle_startActorCommandSelection =
    Scene_Battle.prototype.startActorCommandSelection;
  Scene_Battle.prototype.startActorCommandSelection = function () {
    _Scene_Battle_startActorCommandSelection.call(this);
    if (this._spriteset && this._spriteset._bulletGauge) {
      this._spriteset._bulletGauge.setActor(BattleManager.actor());
    }
    // BUGFIX: Force weapon sprite refresh to ensure it's visible
    if (this._spriteset) {
      this._spriteset.updateWeaponSprite();
    }
  };

  const _Scene_Battle_update = Scene_Battle.prototype.update;
  Scene_Battle.prototype.update = function () {
    _Scene_Battle_update.call(this);
    if (
      this._spriteset &&
      this._spriteset._bulletGauge &&
      BattleManager.actor()
    ) {
      this._spriteset._bulletGauge.setActor(BattleManager.actor());
    }
  };

  //=============================================================================
  // Scene_Boot - Initialization
  //=============================================================================

  const _Scene_Boot_start = Scene_Boot.prototype.start;
  Scene_Boot.prototype.start = function () {
    _Scene_Boot_start.call(this);

    if (debugMode) {
      console.log("[WeaponSystem] Plugin v3.2.0 loaded successfully");
      console.log("[WeaponSystem] Settings:", {
        pitchVariation: pitchVariation,
        volume: volume,
        useSubfolder: useSubfolder,
        weaponSpriteX: weaponSpriteX,
        weaponSpriteY: weaponSpriteY,
        animationSpeed: animationSpeed,
        spriteFrameDuration: spriteFrameDuration,
        debugMode: debugMode,
      });
      console.log(
        "[WeaponSystem] Available animations:",
        Object.keys(MovementKeyFrame).concat(["Static"])
      );
    }
  };

// Replace the existing _Scene_Battle_terminate alias (around line 2825)
// Replace the existing _Scene_Battle_terminate alias (around line 2825)
const _Scene_Battle_terminate = Scene_Battle.prototype.terminate;
Scene_Battle.prototype.terminate = function () {
    _Scene_Battle_terminate.call(this);

    // Properly clear all weapon sprites when battle ends
    if (this._spriteset) {
        if (this._spriteset._weaponSprite) {
            this._spriteset._weaponSprite.clearWeapon();
        }
        if (this._spriteset._weaponSpriteLeft) {
            this._spriteset._weaponSpriteLeft.clearWeapon();
        }
        if (this._spriteset._shieldSprite) {
            this._spriteset._shieldSprite.clearShield();
        }
        if (this._spriteset._whipSprite) {
            this._spriteset._whipSprite.clear();
        }
        if (this._spriteset._flailSprite) {
            this._spriteset._flailSprite.clear();
        }
        if (this._spriteset._nunchakuSprite) {
            this._spriteset._nunchakuSprite.clear();
        }
        if (this._spriteset._bowSprite) {
            this._spriteset._bowSprite.clear();
        }
        if (this._spriteset._throwSprite) {
            this._spriteset._throwSprite.clear();
        }
        if (this._spriteset._whipSpriteLeft) {
            this._spriteset._whipSpriteLeft.clear();
        }
        if (this._spriteset._flailSpriteLeft) {
            this._spriteset._flailSpriteLeft.clear();
        }
        if (this._spriteset._nunchakuSpriteLeft) {
            this._spriteset._nunchakuSpriteLeft.clear();
        }
    }
};
  Sprite_WeaponFPS.prototype.destroy = function () {
    this.clearWeapon();
    Sprite.prototype.destroy.call(this);
  };
})();
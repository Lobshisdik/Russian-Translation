/*:
 * @target MZ
 * @plugindesc v2.4 Adds swimming, fishing, and climbing with threshold-based fall damage
 * @author Omni-Lex
 * @help
 * This plugin adds swimming and fishing mechanics to RPG Maker MZ.
 *
 * MAJOR REFACTOR in v2.0:
 * - Removed vehicle system completely
 * - Simple sprite swapping for swimming
 * - Clean movement without vehicle conflicts
 * - Uses boat graphic as static swimming sprite
 * - Disabled sprinting while swimming
 * - Much simpler and more reliable system
 *
 * NEW in v2.1:
 * - Water reflections for events north of terrain tag 3 tiles
 * NEW in v2.2:
 * - Falling mechanics when jumping off roofs
 * - Fall damage (5% per tile climbed)
 * - Height tracking while climbing
* NEW in v2.3:
 * - Damage applies only upon landing
 * - Jumping North performs a standard jump (no fall distance)
 * NEW in v2.4:
 * - Applied damage threshold (minimum 3 tiles height)
 * - North jumps now trigger damage if threshold is met
 *
 * Features:
 * - Press Enter/Z button when facing water to get options menu
 * - Touch/click on water tiles adjacent to player to open menu
 * - Swim by changing sprite to boat graphic (no vehicle system)
 * - Fish in water if you have the fishing rod (item ID configurable)
 * - Random items or encounters when fishing is successful
 * - Supports fishing rod as both items and weapons
 * - Configurable common events for fishing animations
 * - Climb terrain tag 4 tiles with popup menu
 * - Player faces upward while climbing
 * - Configurable slow climb movement speed
 * - Hides companions/followers while swimming or climbing
 * - Customizable sound effects for swimming, fishing, and climbing
 * - Disables sprinting while swimming or climbing, re-enables on land
 * - Disables event interaction while climbing (prevents accidental triggers)
 * - Blocks swim/fish/climb options on region ID 10 tiles
 * - Water reflections for events north of terrain tag 3 tiles
 *
 * Instructions:
 * 1. Configure the fishing rod item ID in plugin parameters
 * 2. Optionally, set fishing rod weapon IDs
 * 3. Configure fishing items/encounters in plugin parameters
 * 4. Set up common events for fishing animations if desired
 * 5. Make sure water tiles are properly configured in your tilesets (terrain tag 3)
 * 6. Mark climbable tiles with terrain tag 4
 * 7. Configure climb movement speed (0.1 = very slow, 1 = normal)
 * 8. Configure sound effects for fishing, swimming, and climbing (optional)
 * 9. Use region ID 10 on tiles where you don't want swim/fish/climb options
 *
 * @param fishingItems
 * @text Fishing Items
 * @desc Items that can be obtained while fishing (comma-separated item IDs)
 * @default 1,2,3,4,5
 *
 * @param fishingEncounterTroopIds
 * @text Fishing Encounters
 * @desc Troop IDs that can be encountered while fishing (comma-separated)
 * @default 1,2,3
 *
 * @param fishingSuccessRate
 * @text Fishing Success Rate
 * @desc Chance of successful fishing (0-100)
 * @default 70
 *
 * @param waitTime
 * @text Wait Time for Fishing
 * @desc Time to wait while fishing in frames (60 frames = 1 second)
 * @default 180
 *
 * @param fishingRodItemId
 * @text Fishing Rod Item ID
 * @desc Item ID for the fishing rod
 * @default 118
 *
 * @param fishingRodWeaponIds
 * @text Fishing Rod Weapon IDs
 * @desc Weapon IDs that can be used as fishing rods (comma-separated)
 * @default
 *
 * @param fishingAnimationCommonEventId
 * @text Fishing Animation Common Event ID
 * @desc Common event ID for fishing animation (0 = none)
 * @default 0
 *
 * @param fishingBattleCommonEventId
 * @text Fishing Battle Common Event ID
 * @desc Common event ID for battle transition animation (0 = none)
 * @default 0
 *
 * @param hideCompanions
 * @text Hide Companions While Swimming
 * @type boolean
 * @desc Whether to hide companions while swimming
 * @default true
 *
 * @param fishingSoundEffect
 * @text Fishing Sound Effect
 * @type file
 * @dir audio/se/
 * @desc Sound effect to play when fishing (leave empty for no sound)
 * @default Bubble
 *
 * @param startSwimmingSoundEffect
 * @text Start Swimming Sound Effect
 * @type file
 * @dir audio/se/
 * @desc Sound effect to play when starting to swim (leave empty for no sound)
 * @default Splash
 *
 * @param stopSwimmingSoundEffect
 * @text Stop Swimming Sound Effect
 * @type file
 * @dir audio/se/
 * @desc Sound effect to play when stopping swimming (leave empty for no sound)
 * @default Water2
 *
 * @param swimMovementSoundEffect
 * @text Swim Movement Sound Effect
 * @type file
 * @dir audio/se/
 * @desc Sound effect to play during swimming movement (leave empty for no sound)
 * @default Water1
 *
 * @param swimMovementSoundInterval
 * @text Swim Movement Sound Interval
 * @type number
 * @min 1
 * @desc Number of frames between swim movement sounds (60 = 1 second)
 * @default 30
 *
 * @param climbMovementSpeed
 * @text Climb Movement Speed
 * @type number
 * @min 0.1
 * @max 1
 * @decimals 2
 * @desc Movement speed multiplier while climbing (0.1 = very slow, 1 = normal)
 * @default 0.25
 *
 * @param startClimbingSoundEffect
 * @text Start Climbing Sound Effect
 * @type file
 * @dir audio/se/
 * @desc Sound effect to play when starting to climb (leave empty for no sound)
 * @default
 *
 * @param stopClimbingSoundEffect
 * @text Stop Climbing Sound Effect
 * @type file
 * @dir audio/se/
 * @desc Sound effect to play when stopping climbing (leave empty for no sound)
 * @default
 *
 * @param climbMovementSoundEffect
 * @text Climb Movement Sound Effect
 * @type file
 * @dir audio/se/
 * @desc Sound effect to play during climbing movement (leave empty for no sound)
 * @default
 *
 * @param climbMovementSoundInterval
 * @text Climb Movement Sound Interval
 * @type number
 * @min 1
 * @desc Number of frames between climb movement sounds (60 = 1 second)
 * @default 30
 *
 * @param disableClimbing
 * @text Disable Climbing
 * @type boolean
 * @desc Set to true to disable climbing mechanics and options.
 * @default false
 */

(() => {
  "use strict";

  const pluginName = "MovementInteractionSystem";

  // Plugin parameters
  const parameters = PluginManager.parameters(pluginName);

  const fishingItems = String(parameters.fishingItems || "1,2,3,4,5")
    .split(",")
    .map(Number);
  const fishingEncounterTroopIds = String(
    parameters.fishingEncounterTroopIds || "1,2,3"
  )
    .split(",")
    .map(Number);
  const fishingSuccessRate = Number(parameters.fishingSuccessRate || 70);
  const waitTime = Number(parameters.waitTime || 180);
  const waterRegions = [99];
  const waterTerrainTags = [3];
  const FISHING_ROD_ID = Number(parameters.fishingRodItemId || 118);
  const fishingRodWeaponIds = String(parameters.fishingRodWeaponIds || "")
    .split(",")
    .filter((id) => id !== "")
    .map(Number);
  const fishingAnimationCommonEventId = Number(
    parameters.fishingAnimationCommonEventId || 0
  );
  const fishingBattleCommonEventId = Number(
    parameters.fishingBattleCommonEventId || 0
  );
  const hideCompanions = String(parameters.hideCompanions || "true") === "true";

  // Sound effect parameters
  const fishingSoundEffect = String(parameters.fishingSoundEffect || "");
  const startSwimmingSoundEffect = String(
    parameters.startSwimmingSoundEffect || ""
  );
  const stopSwimmingSoundEffect = String(
    parameters.stopSwimmingSoundEffect || ""
  );
  const swimMovementSoundEffect = String(
    parameters.swimMovementSoundEffect || ""
  );
  const swimMovementSoundInterval = Number(
    parameters.swimMovementSoundInterval || 30
  );

  // Climbing parameters
  const climbMovementSpeed = Number(parameters.climbMovementSpeed || 0.5);
  const startClimbingSoundEffect = String(
    parameters.startClimbingSoundEffect || ""
  );
  const stopClimbingSoundEffect = String(
    parameters.stopClimbingSoundEffect || ""
  );
  const climbMovementSoundEffect = String(
    parameters.climbMovementSoundEffect || ""
  );
  const climbMovementSoundInterval = Number(
    parameters.climbMovementSoundInterval || 30
  );

  const disableClimbing = String(parameters.disableClimbing || "false") === "true";

  const tr = (en, it) => (ConfigManager.language === "it" ? it : en);

  // Character state properties (added to Game_CharacterBase):
  // - _isSwimming
  // - _isClimbing
  // - _currentClimbHeight
  // - _pendingFallDamageRate
  // - _originalName
  // - _originalIndex
  // - _isFishing

  let companionsVisible = true;
  let lastSwimSoundFrame = 0;
  let lastClimbSoundFrame = 0;

  // Water reflection system
  let reflectionSprites = new Map(); // Map of character -> reflection sprite
  let reflectionContainer = null;

  // Kicking system - names (case-insensitive substrings) of kickable events/NPCs
  const KICKABLE_NAMES = [
    "barrel", "crate", "box", "bucket", "can", "bottle", "pot", "jar",
    "pebble", "rock", "stone", "ball", "junk", "trash", "debris"
  ];

  //=============================================================================
  // Helper Functions
  //=============================================================================

  function isWaterTile(x, y) {
    const regionId = $gameMap.regionId(x, y);
    if (waterRegions.includes(regionId)) return true;

    const terrainTag = $gameMap.terrainTag(x, y);
    if (waterTerrainTags.includes(terrainTag)) return true;

    return $gameMap.isBoatPassable(x, y);
  }

  function isBlockedWaterTile(x, y) {
    const regionId = $gameMap.regionId(x, y);
    return regionId === 10;
  }

  function isClimbableTile(x, y) {
    if (disableClimbing) return false;
    const terrainTag = $gameMap.terrainTag(x, y);
    return terrainTag === 4;
  }

  function isBlockedClimbTile(x, y) {
    const regionId = $gameMap.regionId(x, y);
    return regionId === 10;
  }

  function isRoofTile(x, y) {
    const terrainTag = $gameMap.terrainTag(x, y);
    return terrainTag === 7;
  }

  function isWallTile(x, y) {
    const regionId = $gameMap.regionId(x, y);
    if (regionId === 10) return true;

    const terrainTag = $gameMap.terrainTag(x, y);
    if (terrainTag === 4) return true;

    return false;
  }

  function hasPriorityTile(x, y) {
    if (!$gameMap || !$dataMap) return false;

    const tileId = $gameMap.tileId(x, y, 4); // Layer 4 (top layer)
    if (!tileId) return false;

    // Check tileset data for priority flag
    const tileset = $gameMap.tileset();
    if (!tileset || !tileset.flags) return false;

    // In RPG Maker MZ, priority is stored in flags with bit 4 (0x10)
    return (tileset.flags[tileId] & 0x10) !== 0;
  }

  function isClimbableAndAccessible(x, y) {
    // Must be a climbable tile
    if (!isClimbableTile(x, y)) return false;

    // Must not be blocked
    if (isBlockedClimbTile(x, y)) return false;

    // Must not have a priority tile (drawn in front)
    if (hasPriorityTile(x, y)) return false;

    // Check if blocked by a priority tile in front
    // Check all layers for blocking priority tiles
    for (let i = 0; i < 5; i++) {
      const tileId = $gameMap.tileId(x, y, i);
      if (tileId && hasPriorityTile(x, y)) {
        return false;
      }
    }

    return true;
  }

  function isCharacterFacingNorthOrSouth(character) {
    const d = character.direction();
    return d === 8 || d === 2;
  }

  function canClimbInDirection(character) {
    // Always only allow climbing when facing north or south
    return isCharacterFacingNorthOrSouth(character);
  }

  function hasFishingRod() {
    if ($gameParty.hasItem($dataItems[FISHING_ROD_ID])) {
      return true;
    }

    return fishingRodWeaponIds.some((weaponId) => {
      return $gameParty.hasItem($dataWeapons[weaponId], true);
    });
  }

  function getFrontTile(character) {
    const x = character.x;
    const y = character.y;
    const d = character.direction();
    return {
      x: $gameMap.roundXWithDirection(x, d),
      y: $gameMap.roundYWithDirection(y, d),
    };
  }

  function getFrontEvent() {
    const tile = getFrontTile($gamePlayer);
    if (!$gameMap || !$gameMap.events()) return null;
    return $gameMap.events().find(
      (ev) => ev && ev.x === tile.x && ev.y === tile.y
    ) || null;
  }

  function isKickableEvent(event) {
    if (!event || !event.event()) return false;
    const name = event.event().name.toLowerCase();
    return KICKABLE_NAMES.some((k) => name.includes(k.toLowerCase()));
  }

  function performKick(character, event) {
    const dir = character.direction();
    AudioManager.playSe({ name: "Kick", volume: 90, pitch: 100, pan: 0 });
    // Attempt to move the event 2 tiles; each moveStraight handles passability
    event.moveStraight(dir);
    if (!event.isMovementSucceeded()) return;
    event.moveStraight(dir);
  }

  function storeOriginalAppearance(character) {
    if (!character._originalName) {
      character._originalName = character._characterName;
      character._originalIndex = character._characterIndex;
    }
  }

  function restoreOriginalAppearance(character) {
    if (character._originalName) {
      character.setImage(character._originalName, character._originalIndex);
    }
  }

  function performFishing(character) {
    character._isFishing = true;

    // Check if ASCII Physics Fishing Minigame is available and enabled
    const useMinigame = $gameVariables && $gameVariables.value(9999) === 1;

    if (useMinigame && window.Scene_FishingMinigame) {
      // Use the advanced fishing minigame
      performFishingMinigame();
      return;
    }

    /*
        if (fishingSoundEffect) {
            AudioManager.playSe({
                name: fishingSoundEffect,
                volume: 90,
                pitch: 100,
                pan: 0
            });
        }*/

    // Disable player movement during fishing (only for P1)
    if (character === $gamePlayer) {
      if (!character._originalCanMove) {
        character._originalCanMove = Game_Player.prototype.canMove;
      }
      Game_Player.prototype.canMove = function () {
        return false;
      };
    }

    if (fishingAnimationCommonEventId > 0) {
      $gameTemp.reserveCommonEvent(fishingAnimationCommonEventId);
    } else {
      $gameScreen.startFlash([255, 255, 255, 128], 60);
    }

    let remainingFrames = waitTime;
    const originalUpdate = Scene_Map.prototype.update;

    Scene_Map.prototype.update = function () {
      const interval = setInterval(() => {
        if (remainingFrames <= 0) {
          clearInterval(interval);
          completeFishing(character);
        } else {
          remainingFrames -= 1;
        }
      }, 16);
      if (originalCanMoveFunction) {
        Game_Player.prototype.canMove = originalCanMoveFunction;
      }
      Scene_Map.prototype.update = originalUpdate;
      completeFishing(character);
    };
  }

  function performFishingMinigame() {
    // Store original canMove function only if not already stored
    if (!originalCanMoveFunction) {
      originalCanMoveFunction = Game_Player.prototype.canMove;
    }

    // Disable player movement during minigame
    Game_Player.prototype.canMove = function () {
      return false;
    };

    // Push the fishing minigame scene
    SceneManager.push(window.Scene_FishingMinigame);

    // Store state for when minigame returns
    window._fishingMinigameResult = null;
  }

  function completeFishing(character) {
    if (character) {
      character._isFishing = false;
    } else {
      $gamePlayer._isFishing = false;
    }

    const success = Math.random() * 100 < fishingSuccessRate;

    if (!success) {
      window.skipLocalization = true;
      $gameMessage.add("Nothing bit the hook...");
      window.skipLocalization = false;
      return;
    }

    const getItem = Math.random() < 0.7;

    if (getItem) {
      const itemId =
        fishingItems[Math.floor(Math.random() * fishingItems.length)];
      const item = $dataItems[itemId];

      if (item) {
        $gameParty.gainItem(item, 1);
        window.skipLocalization = true;
        $gameMessage.add(`\\i[${itemId}]You caught a ${item.name}!`);
        window.skipLocalization = false;
      }
    } else {
      const troopId =
        fishingEncounterTroopIds[
        Math.floor(Math.random() * fishingEncounterTroopIds.length)
        ];
      window.skipLocalization = true;
      $gameMessage.add("Something is pulling on your line!");
      window.skipLocalization = false;

      if (fishingBattleCommonEventId > 0) {
        $gameTemp.reserveCommonEvent(fishingBattleCommonEventId);
      }

      setTimeout(() => {
        BattleManager.setup(troopId, true, false);
        SceneManager.push(Scene_Battle);
      }, 1000);
    }
  }

  function setCompanionsVisibility(visible) {
    if (!hideCompanions) return;

    if (companionsVisible === visible) return;

    companionsVisible = visible;

    if ($gamePlayer.followers && $gamePlayer.followers()) {
      for (let i = 0; i < $gamePlayer.followers()._data.length; i++) {
        const follower = $gamePlayer.followers()._data[i];
        if (follower) {
          follower.setTransparent(!visible);
        }
      }
    }
  }

  function enterSwimMode(character) {
    if (character._isSwimming) return;
    storeOriginalAppearance(character);
    character._isSwimming = true;
    const boatData = $dataSystem.boat;
    character.setImage(boatData.characterName, boatData.characterIndex);

    if (startSwimmingSoundEffect) {
      AudioManager.playSe({
        name: startSwimmingSoundEffect,
        volume: 90,
        pitch: 100,
        pan: 0,
      });
    }

    if (character === $gamePlayer) {
      setCompanionsVisibility(false);
    }
  }

  function exitSwimMode(character) {
    if (!character._isSwimming) return;
    character._isSwimming = false;

    if (stopSwimmingSoundEffect) {
      AudioManager.playSe({
        name: stopSwimmingSoundEffect,
        volume: 90,
        pitch: 100,
        pan: 0,
      });
    }

    restoreOriginalAppearance(character);

    if (character === $gamePlayer) {
      if (!character._isClimbing) {
        setCompanionsVisibility(true);
      }
    }

    if (character === $gamePlayer && $gameTemp.isDestinationValid()) {
      $gameTemp.clearDestination();
    }
  }

  function enterClimbMode(character) {
    if (character._isClimbing) return;
    character._isClimbing = true;
    character._currentClimbHeight = 0;
    character._lastClimbX = character.x;
    character._lastClimbY = character.y;
    character.setDirection(8);

    if (startClimbingSoundEffect) {
      AudioManager.playSe({
        name: startClimbingSoundEffect,
        volume: 90,
        pitch: 100,
        pan: 0,
      });
    }

    if (character === $gamePlayer) {
      setCompanionsVisibility(false);
    }
  }

  function exitClimbMode(character, jumpX, jumpY) {
    if (!character) character = $gamePlayer;
    character._isClimbing = false;
    character._isClimbingMove = false;

    if (stopClimbingSoundEffect) {
      AudioManager.playSe({
        name: stopClimbingSoundEffect,
        volume: 90,
        pitch: 100,
        pan: 0,
      });
    }

    restoreOriginalAppearance(character);
    character.setTransparent(false);
    setCompanionsVisibility(true);

    if (jumpX !== 0 || jumpY !== 0) {
      character.jump(jumpX, jumpY);
    }

    // Clear any input/destination issues
    $gameTemp.clearDestination();
    Input.clear();
  }

  //=============================================================================
  // Water Reflection System
  //=============================================================================

  function initializeReflectionContainer() {
    if (!SceneManager._scene || !SceneManager._scene._spriteset) return;

    const spriteset = SceneManager._scene._spriteset;

    if (!reflectionContainer) {
      reflectionContainer = new PIXI.Container();
      reflectionContainer.z = 0; // Below characters

      // Add to tilemap for proper layering
      if (spriteset._tilemap) {
        spriteset._baseSprite.addChild(reflectionContainer);
      }
    }
  }

  function shouldHaveReflection(character) {
    if (!character) return false;

    const x = character.x;
    const y = character.y;

    // Check if there's water (terrain tag 3) directly south of the character
    const waterY = y + 1;
    if (waterY >= $gameMap.height()) return false;

    const terrainTag = $gameMap.terrainTag(x, waterY);
    return terrainTag === 3;
  }

  function createReflectionSprite(character) {
    if (!character._characterName) return null;

    const reflection = new Sprite_Character(character);

    // Flip vertically
    reflection.scale.y = -1;

    // Apply transparency and tint for water effect
    reflection.opacity = 128; // 50% transparent
    reflection.setBlendColor([0, 50, 100, 50]); // Slight blue tint

    // Optional: Add blur filter for more realistic water reflection
    if (PIXI.filters && PIXI.filters.BlurFilter) {
      const blurFilter = new PIXI.filters.BlurFilter(1);
      reflection.filters = [blurFilter];
    }

    return reflection;
  }

  function updateReflections() {
    if (!reflectionContainer) {
      initializeReflectionContainer();
    }

    if (
      !reflectionContainer ||
      !SceneManager._scene ||
      !SceneManager._scene._spriteset
    )
      return;

    const spriteset = SceneManager._scene._spriteset;
    const allCharacters = [];

    // Collect all events
    if ($gameMap && $gameMap.events()) {
      allCharacters.push(...$gameMap.events());
    }

    // Collect player and followers
    if ($gamePlayer) {
      allCharacters.push($gamePlayer);
      if ($gamePlayer.followers && $gamePlayer.followers()._data) {
        allCharacters.push(...$gamePlayer.followers()._data);
      }
    }

    // Track which characters should have reflections
    const charactersNeedingReflections = new Set();

    for (const character of allCharacters) {
      if (!character) continue;

      if (shouldHaveReflection(character)) {
        charactersNeedingReflections.add(character);

        // Create reflection if it doesn't exist
        if (!reflectionSprites.has(character)) {
          const reflection = createReflectionSprite(character);
          if (reflection) {
            reflectionSprites.set(character, reflection);
            reflectionContainer.addChild(reflection);
          }
        }

        // Update reflection position
        const reflection = reflectionSprites.get(character);
        if (reflection) {
          const characterSprite = findCharacterSprite(spriteset, character);
          if (characterSprite) {
            // Position reflection on the water tile below
            reflection.x = characterSprite.x;
            reflection.y = characterSprite.y + $gameMap.tileHeight() * 2;
            reflection._character = character; // Update character reference
            reflection.update(); // Update sprite
          }
        }
      }
    }

    // Remove reflections for characters that no longer need them
    const toRemove = [];
    for (const [character, reflection] of reflectionSprites) {
      if (!charactersNeedingReflections.has(character)) {
        toRemove.push(character);
        reflectionContainer.removeChild(reflection);
      }
    }

    for (const character of toRemove) {
      reflectionSprites.delete(character);
    }
  }

  function findCharacterSprite(spriteset, character) {
    if (!spriteset || !spriteset._characterSprites) return null;

    for (const sprite of spriteset._characterSprites) {
      if (sprite._character === character) {
        return sprite;
      }
    }
    return null;
  }

  function cleanupReflections() {
    if (reflectionContainer) {
      for (const [character, reflection] of reflectionSprites) {
        reflectionContainer.removeChild(reflection);
      }
      reflectionSprites.clear();

      if (reflectionContainer.parent) {
        reflectionContainer.parent.removeChild(reflectionContainer);
      }
      reflectionContainer = null;
    }
  }

  //=============================================================================
  // Game_Player - Sprint disable while swimming
  //=============================================================================

  const _Game_Player_update = Game_Player.prototype.update;
  Game_Player.prototype.update = function (sceneActive) {
    _Game_Player_update.call(this, sceneActive);
    this.updateSwimState();
  };

  const _Game_Player_screenZ = Game_Player.prototype.screenZ;
  Game_Player.prototype.screenZ = function () {
    if (isRoofTile(this.x, this.y)) {
      return 10;
    }
    return _Game_Player_screenZ.call(this);
  };

  const _Game_Player_isDashing = Game_Player.prototype.isDashing;
  Game_Player.prototype.isDashing = function () {
    if (this._isSwimming || this._isClimbing) {
      return false;
    }
    return _Game_Player_isDashing.call(this);
  };

  const _Game_Player_updateDashing = Game_Player.prototype.updateDashing;
  Game_Player.prototype.updateDashing = function () {
    if (this._isSwimming || this._isClimbing) {
      this._dashing = false;
      return;
    }
    _Game_Player_updateDashing.call(this);
  };

  const _Game_Player_moveStraight = Game_Player.prototype.moveStraight;
  Game_Player.prototype.moveStraight = function (d) {
    if (this._isClimbing && isRoofTile(this.x, this.y)) {
      const x2 = $gameMap.roundXWithDirection(this.x, d);
      const y2 = $gameMap.roundYWithDirection(this.y, d);
      const destIsRoof = isRoofTile(x2, y2);
      const destIsClimbable = isClimbableAndAccessible(x2, y2);

      if (!destIsRoof && !destIsClimbable) {
        const isPassable = $gameMap.isPassable(x2, y2, d);
        const isClear = !this.isCollidedWithEvents(x2, y2) && !this.isCollidedWithVehicles(x2, y2);

        if (isPassable && isClear) {
          let jumpX = 0;
          let jumpY = 0;
          switch (d) {
            case 2: jumpY = 1; break;
            case 4: jumpX = -1; break;
            case 6: jumpX = 1; break;
            case 8: jumpY = -1; break;
          }
          exitClimbMode(this, jumpX, jumpY);
          return;
        }
        return;
      }
    }

    if (this._isClimbing && d === 8) {
      const x2 = $gameMap.roundXWithDirection(this.x, d);
      const y2 = $gameMap.roundYWithDirection(this.y, d);

      if (!isWallTile(x2, y2) && !isRoofTile(x2, y2)) {
        const isPassable = $gameMap.isPassable(x2, y2, d);
        const isClear = !this.isCollidedWithEvents(x2, y2) && !this.isCollidedWithVehicles(x2, y2);

        if (isPassable && isClear) {
          this.jump(0, -1);
          exitClimbMode(this, 0, 0);
          return;
        }
      }
    }

    if (this._isClimbing && (d === 4 || d === 6)) {
      const dx2 = $gameMap.roundXWithDirection(this.x, d);
      const dy2 = $gameMap.roundYWithDirection(this.y, d);
      const srcTag = $gameMap.terrainTag(this.x, this.y);
      const dstTag = $gameMap.terrainTag(dx2, dy2);
      if ((srcTag === 7 && dstTag === 4) || (srcTag === 4 && dstTag === 7)) {
        return;
      }
    }

    _Game_Player_moveStraight.call(this, d);
  };

  const _Game_Player_checkEventTriggerHere =
    Game_Player.prototype.checkEventTriggerHere;
  Game_Player.prototype.checkEventTriggerHere = function (triggers) {
    if (this._isClimbing) {
      if ($gameMap.eventsXy(this.x, this.y).length === 0) return false;
    }
    return _Game_Player_checkEventTriggerHere.call(this, triggers);
  };

  const _Game_Player_checkEventTriggerThere =
    Game_Player.prototype.checkEventTriggerThere;
  Game_Player.prototype.checkEventTriggerThere = function (triggers) {
    if (this._isClimbing) {
      const x2 = $gameMap.roundXWithDirection(this.x, this.direction());
      const y2 = $gameMap.roundYWithDirection(this.y, this.direction());
      if ($gameMap.eventsXy(x2, y2).length === 0) return false;
    }
    return _Game_Player_checkEventTriggerThere.call(this, triggers);
  };

  const _Game_Player_realMoveSpeed = Game_Player.prototype.realMoveSpeed;
  Game_Player.prototype.realMoveSpeed = function () {
    let speed = _Game_Player_realMoveSpeed.call(this);
    if (this._isClimbing) {
      speed *= climbMovementSpeed;
    }
    return speed;
  };

  Game_Player.prototype.updateSwimState = function () {
    if ($gameSystem._procGenData && $gameSystem._procGenData.currentBiome === "SeaBed") {
      if (!this._isSwimming) {
        this._isSwimming = true;
        this._swimAnimationFrame = 0;
        setCompanionsVisibility(false);
      }
      return;
    }

    if (this._isSwimming) {
      if (!isWaterTile(this.x, this.y)) {
        exitSwimMode(this);
        return;
      }

      if (swimMovementSoundEffect && this.isMoving()) {
        const currentFrame = Graphics.frameCount;
        if (currentFrame - lastSwimSoundFrame >= swimMovementSoundInterval) {
          AudioManager.playSe({
            name: swimMovementSoundEffect,
            volume: 50,
            pitch: 100,
            pan: 0,
          });
          lastSwimSoundFrame = currentFrame;
        }
      }
    }

    if (this._isClimbing) {
      const currentTileIsRoof = isRoofTile(this.x, this.y);
      const currentTileIsClimbable = isClimbableAndAccessible(this.x, this.y);

      if (!currentTileIsClimbable && !currentTileIsRoof) {
        let jumpX = 0;
        let jumpY = 1;

        const destX = this.x + jumpX;
        const destY = this.y + jumpY;
        if ($gameMap.isPassable(destX, destY, 0)) {
          exitClimbMode(this, jumpX, jumpY);
        } else {
          exitClimbMode(this, 0, 0);
        }
        return;
      }

      this._lastClimbX = this.x;
      this._lastClimbY = this.y;

      if (!currentTileIsRoof) {
        this.setDirection(8);
      }

      if (climbMovementSoundEffect && this.isMoving()) {
        const currentFrame = Graphics.frameCount;
        if (currentFrame - lastClimbSoundFrame >= climbMovementSoundInterval) {
          AudioManager.playSe({
            name: climbMovementSoundEffect,
            volume: 50,
            pitch: 100,
            pan: 0,
          });
          lastClimbSoundFrame = currentFrame;
        }
      }
    }
  };

  //=============================================================================
  // Companions/Followers Handling
  //=============================================================================

  const _Game_Player_gatherFollowers = Game_Player.prototype.gatherFollowers;
  Game_Player.prototype.gatherFollowers = function () {
    _Game_Player_gatherFollowers.call(this);

    if (!companionsVisible) {
      setCompanionsVisibility(false);
    }
  };

  const _Game_Followers_refresh = Game_Followers.prototype.refresh;
  Game_Followers.prototype.refresh = function () {
    _Game_Followers_refresh.call(this);

    if ($gamePlayer._isSwimming || $gamePlayer._isClimbing) {
      setCompanionsVisibility(false);
    } else {
      setCompanionsVisibility(true);
    }
  };

  //=============================================================================
  // Input handling for keyboard and touch
  //=============================================================================

  const _Scene_Map_updateScene = Scene_Map.prototype.updateScene;
  Scene_Map.prototype.updateScene = function () {
    _Scene_Map_updateScene.call(this);

    if (!SceneManager.isSceneChanging()) {
      this.updateSwimFishInput();
      updateReflections(); // Update water reflections each frame
    }
  };

  Scene_Map.prototype.updateSwimFishInput = function () {
    this.checkMovementInteraction($gamePlayer);
  };

  Scene_Map.prototype.checkMovementInteraction = function (character) {
    if (!character) return;
    const isPlayer = character === $gamePlayer;

    if (character._isSwimming && $gameMap.mapId() === 636) {
      const currentBiome = $gameSystem._procGenData
        ? $gameSystem._procGenData.currentBiome
        : null;
      if (currentBiome && currentBiome.toLowerCase().includes("ocean")) {
        if (isPlayer ? Input.isTriggered("ok") : false) {
          this.showDiveOption(character);
          return;
        }
      }
      if (currentBiome && currentBiome.toLowerCase().includes("seabed")) {
        if (isPlayer ? Input.isTriggered("ok") : false) {
          this.showResurfaceOption(character);
          return;
        }
      }
    }

    if (character._isSwimming || character._isFishing || character._isClimbing) return;

    const isTriggered = isPlayer ? Input.isTriggered("ok") : true;

    if (isTriggered) {
      const frontTile = getFrontTile(character);

      if (isRoofTile(frontTile.x, frontTile.y) && !hasEventOnTile(frontTile.x, frontTile.y)) {
        return;
      }

      if ($gameMap.mapId() === 636) {
        const currentTileset = $gameMap.tileset();
        const tilesetId = currentTileset ? currentTileset.id : 0;
        const layersToCheck = [4, 3, 2];
        let foundTileId = 0;
        let foundLayer = 0;

        for (const layer of layersToCheck) {
          const tileId = $gameMap.tileId(frontTile.x, frontTile.y, layer);
          if (tileId !== 0) {
            foundTileId = tileId;
            foundLayer = layer;
            break;
          }
        }

        if (foundTileId !== 0 && window.WorldGen && window.WorldGen.Map636TileEvents) {
          for (const [commonEventId, config] of Object.entries(
            window.WorldGen.Map636TileEvents
          )) {
            if (typeof commonEventId === 'string' && isNaN(parseInt(commonEventId))) {
              continue;
            }

            for (const tilesetConfig of config.tilesets) {
              if (
                tilesetConfig.tilesetId === tilesetId &&
                tilesetConfig.tileIds.includes(foundTileId)
              ) {
                $gameTemp.reserveCommonEvent(parseInt(commonEventId));
                return;
              }
            }
          }
        }
      }

      if (
        isClimbableAndAccessible(frontTile.x, frontTile.y) &&
        canClimbInDirection(character) &&
        !hasEventOnTile(frontTile.x, frontTile.y)
      ) {
        this.showClimbOptions(character);
        return;
      }

      if (
        isWaterTile(frontTile.x, frontTile.y) &&
        !isBlockedWaterTile(frontTile.x, frontTile.y) &&
        !hasEventOnTile(frontTile.x, frontTile.y) &&
        !isWallTile(frontTile.x, frontTile.y) &&
        !character.canPass(character.x, character.y, character.direction())
      ) {
        if (character.isInVehicle && character.isInVehicle() && character.vehicle().isShip()) {
          return;
        }

        this.showSwimFishOptions(character);
      }
    }

    if (isPlayer) {
      this.processTouchForWaterInteraction();
      this.processTouchForClimbInteraction();
    }
  };

  Scene_Map.prototype.processTouchForWaterInteraction = function () {
    if (!TouchInput.isTriggered()) return;

    const x = $gameMap.canvasToMapX(TouchInput.x);
    const y = $gameMap.canvasToMapY(TouchInput.y);

    const playerX = $gamePlayer.x;
    const playerY = $gamePlayer.y;

    if (
      isAdjacentTile(playerX, playerY, x, y) &&
      isWaterTile(x, y) &&
      !isBlockedWaterTile(x, y) &&
      !hasEventOnTile(x, y)
    ) {
      let d = 0;
      if (x === playerX) {
        d = y > playerY ? 2 : 8;
      } else if (y === playerY) {
        d = x > playerX ? 6 : 4;
      }

      if (d > 0 && $gamePlayer.canPass(playerX, playerY, d)) {
        return;
      }

      if (x === playerX) {
        if (y > playerY) {
          $gamePlayer.setDirection(2);
          this.showSwimFishOptions($gamePlayer);
        } else if (y < playerY) {
          $gamePlayer.setDirection(8);
          this.showSwimFishOptions($gamePlayer);
        }
      } else if (y === playerY) {
        if (x > playerX) {
          $gamePlayer.setDirection(6);
          this.showSwimFishOptions($gamePlayer);
        } else if (x < playerX) {
          $gamePlayer.setDirection(4);
          this.showSwimFishOptions($gamePlayer);
        }
      }
    }
  };

  function isAdjacentTile(playerX, playerY, targetX, targetY) {
    const distance = Math.abs(playerX - targetX) + Math.abs(playerY - targetY);
    return distance === 1;
  }

  function hasEventOnTile(x, y) {
    if (!$gameMap || !$gameMap.events()) return false;
    return $gameMap
      .events()
      .some((event) => event && event.x === x && event.y === y);
  }

  Scene_Map.prototype.processTouchForClimbInteraction = function () {
    if (!TouchInput.isTriggered()) return;

    const x = $gameMap.canvasToMapX(TouchInput.x);
    const y = $gameMap.canvasToMapY(TouchInput.y);

    const playerX = $gamePlayer.x;
    const playerY = $gamePlayer.y;

    if (
      isAdjacentTile(playerX, playerY, x, y) &&
      isClimbableAndAccessible(x, y) &&
      !hasEventOnTile(x, y)
    ) {
      if ($gameMap.mapId() === 636) {
        if (y > playerY) {
          $gamePlayer.setDirection(2);
          this.showClimbOptions($gamePlayer);
        } else if (y < playerY) {
          $gamePlayer.setDirection(8);
          this.showClimbOptions($gamePlayer);
        }
        return;
      }

      if (x > playerX) {
        $gamePlayer.setDirection(6);
      } else if (x < playerX) {
        $gamePlayer.setDirection(4);
      } else if (y > playerY) {
        $gamePlayer.setDirection(2);
      } else if (y < playerY) {
        $gamePlayer.setDirection(8);
      }

      if (canClimbInDirection($gamePlayer)) {
        this.showClimbOptions($gamePlayer);
      }
    }
  };

  Scene_Map.prototype.showClimbOptions = function (character) {
    if (!$dataMap || (!$dataMap.meta.Exterior && !$dataMap.note.includes("Exterior"))) {
      return;
    }

    const choices = [tr("Climb", "Arrampica")];
    choices.push(tr("Cancel", "Annulla"));

    $gameMessage._eventActivator = (character === $gamePlayer) ? "p1" : "p2";
    $gameMessage.setChoices(choices, 0, choices.length - 1);
    $gameMessage.setChoiceCallback((index) => {
      if (index === choices.indexOf(tr("Climb", "Arrampica"))) {
        enterClimbMode(character);
      }
    });
  };

  Scene_Map.prototype.showDiveOption = function (character) {
    const choices = [tr("Dive", "Tuffa")];
    choices.push(tr("Cancel", "Annulla"));

    $gameMessage._eventActivator = (character === $gamePlayer) ? "p1" : "p2";
    $gameMessage.setChoices(choices, 0, choices.length - 1);
    $gameMessage.setChoiceCallback((index) => {
      if (index === choices.indexOf(tr("Dive", "Tuffa"))) {
        const interpreter =
          SceneManager._scene._interpreter || $gameMap._interpreter;
        if (interpreter && PluginManager.callCommand) {
          PluginManager.callCommand(
            interpreter,
            "ProceduralMapTransfer",
            "goDown",
            {}
          );
        }
      }
    });
  };

  Scene_Map.prototype.showResurfaceOption = function (character) {
    const choices = [tr("Resurface", "Risalire")];
    choices.push(tr("Cancel", "Annulla"));

    $gameMessage._eventActivator = (character === $gamePlayer) ? "p1" : "p2";
    $gameMessage.setChoices(choices, 0, choices.length - 1);
    $gameMessage.setChoiceCallback((index) => {
      if (index === choices.indexOf(tr("Resurface", "Risalire"))) {
        const interpreter =
          SceneManager._scene._interpreter || $gameMap._interpreter;
        if (interpreter && PluginManager.callCommand) {
          PluginManager.callCommand(
            interpreter,
            "ProceduralMapTransfer",
            "goUp",
            {}
          );
        }
      }
    });
  };

  Scene_Map.prototype.showSwimFishOptions = function (character) {
    const currentBiome = $gameSystem._procGenData
      ? $gameSystem._procGenData.currentBiome
      : null;

    if (currentBiome && currentBiome.toLowerCase().includes("ocean")) {
      const choices = [tr("Dive", "Tuffa")];
      choices.push(tr("Cancel", "Annulla"));

      $gameMessage.setChoices(choices, 0, choices.length - 1);
      $gameMessage.setChoiceCallback((index) => {
        if (index === choices.indexOf(tr("Dive", "Tuffa"))) {
          const interpreter =
            SceneManager._scene._interpreter || $gameMap._interpreter;
          if (interpreter && PluginManager.callCommand) {
            PluginManager.callCommand(
              interpreter,
              "ProceduralMapTransfer",
              "goDown",
              {}
            );
          }
        }
      });
      return;
    }

    if (currentBiome && currentBiome.toLowerCase().includes("seabed")) {
      const choices = [tr("Resurface", "Risalire")];
      choices.push(tr("Cancel", "Annulla"));

      $gameMessage.setChoices(choices, 0, choices.length - 1);
      $gameMessage.setChoiceCallback((index) => {
        if (index === choices.indexOf(tr("Resurface", "Risalire"))) {
          const interpreter =
            SceneManager._scene._interpreter || $gameMap._interpreter;
          if (interpreter && PluginManager.callCommand) {
            PluginManager.callCommand(
              interpreter,
              "ProceduralMapTransfer",
              "goUp",
              {}
            );
          }
        }
      });
      return;
    }

    if ($gameMap.mapId() === 315) {
      const choices = [];

      if (hasFishingRod()) {
        choices.push(tr("Fish", "Pesca"));
      }

      choices.push(tr("Cancel", "Annulla"));

      if (choices.length === 1) {
        window.skipLocalization = true;
        $gameMessage._eventActivator = (character === $gamePlayer) ? "p1" : "p2";
        $gameMessage.add("You can't swim here.");
        window.skipLocalization = false;
        return;
      }

      $gameMessage._eventActivator = (character === $gamePlayer) ? "p1" : "p2";
      $gameMessage.setChoices(choices, 0, choices.length - 1);
      $gameMessage.setChoiceCallback((index) => {
        if (index === choices.indexOf(tr("Fish", "Pesca")) && hasFishingRod()) {
          performFishing(character);
        }
      });
      return;
    }

    const choices = [tr("Swim", "Nuota")];

    if (hasFishingRod()) {
      choices.push(tr("Fish", "Pesca"));
    }

    choices.push(tr("Cancel", "Annulla"));

    $gameMessage._eventActivator = (character === $gamePlayer) ? "p1" : "p2";
    $gameMessage.setChoices(choices, 0, choices.length - 1);
    $gameMessage.setChoiceCallback((index) => {
      if (index === choices.indexOf(tr("Swim", "Nuota"))) {
        enterSwimMode(character);
      } else if (
        index === choices.indexOf(tr("Fish", "Pesca")) &&
        hasFishingRod()
      ) {
        performFishing(character);
      }
    });
  };

  //=============================================================================
  // Handle saving/loading swim state
  //=============================================================================

  const _Game_Player_refresh = Game_Player.prototype.refresh;
  Game_Player.prototype.refresh = function () {
    _Game_Player_refresh.call(this);

    if (this._isSwimming) {
      const boatData = $dataSystem.boat;
      this.setImage(boatData.characterName, boatData.characterIndex);
      setCompanionsVisibility(false);
    } else if (this._isClimbing) {
      if (
        isClimbableAndAccessible(this.x, this.y) ||
        isRoofTile(this.x, this.y)
      ) {
        this.setDirection(8);
        setCompanionsVisibility(false);
      } else {
        exitClimbMode(this);
      }
    }
  };

  const _Game_Player_makeEmpty = Game_Player.prototype.makeEmpty;
  Game_Player.prototype.makeEmpty = function () {
    _Game_Player_makeEmpty.call(this);
    this._isSwimming = false;
    this._isClimbing = false;
  };

  //=============================================================================
  // Map passability overrides
  //=============================================================================

  const _Game_CharacterBase_canPass = Game_CharacterBase.prototype.canPass;
  Game_CharacterBase.prototype.canPass = function (x, y, d) {
    window._currentlyCheckingCharacter = this;
    const result = _Game_CharacterBase_canPass.call(this, x, y, d);
    window._currentlyCheckingCharacter = null;
    return result;
  };

  const _Game_Map_isPassable = Game_Map.prototype.isPassable;
  Game_Map.prototype.isPassable = function (x, y, d) {
    const regionId = this.regionId(x, y);
    const terrainTag = this.terrainTag(x, y);
    const character = window._currentlyCheckingCharacter;
    const charIsSwimming = character ? character._isSwimming : false;
    const charIsClimbing = character ? character._isClimbing : false;

    // Region 5: Always allow passage
    if (regionId === 5 || regionId === 13) {
      return true;
    }

    // Region 4: Allow passage if it's a ladder tile
    if (regionId === 4 && (charIsClimbing || this.isLadder(x, y))) {
      return true;
    }

    // Region 10 & 11: Always block passage
    if (regionId === 10) {
      return false;
    }

    // Region 99: Only passable when swimming
    if (regionId === 99) {
      return charIsSwimming;
    }

    // Terrain tag 3: Only passable when swimming
    if (terrainTag === 3) {
      return charIsSwimming;
    }

    // Terrain tag 4: Only passable when climbing OR if it's a ladder tile
    if (terrainTag === 4) {
      if (charIsClimbing || this.isLadder(x, y)) {
        // Can't climb/walk to tiles with priority (drawn in front)
        return !hasPriorityTile(x, y);
      }
      return false;
    }

    // Terrain tag 7: Only passable when climbing (roof tiles)
    if (terrainTag === 7) {
      return charIsClimbing;
    }

    return _Game_Map_isPassable.call(this, x, y, d);
  };

  const _Game_Map_checkPassage = Game_Map.prototype.checkPassage;
  Game_Map.prototype.checkPassage = function (x, y, bit) {
    const regionId = this.regionId(x, y);
    const terrainTag = this.terrainTag(x, y);
    const character = window._currentlyCheckingCharacter;
    const charIsSwimming = character ? character._isSwimming : false;
    const charIsClimbing = character ? character._isClimbing : false;

    if (regionId === 5) {
      return 0;
    }

    if ((regionId === 4 || regionId === 10)) {
      if (regionId === 4 && (charIsClimbing || this.isLadder(x, y))) return 0;
      return bit;
    }

    if (regionId === 99) {
      return charIsSwimming ? 0 : bit;
    }

    if (terrainTag === 3) {
      return charIsSwimming ? 0 : bit;
    }

    if (terrainTag === 4) {
      // Can climb if climbing mode is active OR if it's a ladder tile, AND no priority tiles block it
      if ((charIsClimbing || this.isLadder(x, y)) && !hasPriorityTile(x, y)) {
        return 0;
      }
      return bit;
    }

    if (terrainTag === 7) {
      // Roof tiles: passable when climbing
      return charIsClimbing ? 0 : bit;
    }

    return _Game_Map_checkPassage.call(this, x, y, bit);
  };

  //=============================================================================
  // Initialize plugin
  //=============================================================================

  const _Scene_Boot_start = Scene_Boot.prototype.start;
  Scene_Boot.prototype.start = function () {
    _Scene_Boot_start.call(this);

    // Initialize all state variables
    companionsVisible = true;
    lastSwimSoundFrame = 0;
    lastClimbSoundFrame = 0;

    if ($gamePlayer) {
      $gamePlayer._isSwimming = false;
      $gamePlayer._isClimbing = false;
      $gamePlayer._pendingFallDamageRate = 0;
    }
  };

  // Initialize reflection container when spriteset is created
  const _Spriteset_Map_createCharacters =
    Spriteset_Map.prototype.createCharacters;
  Spriteset_Map.prototype.createCharacters = function () {
    _Spriteset_Map_createCharacters.call(this);
    initializeReflectionContainer();
  };

  // Clean up reflections when changing maps
  const _Scene_Map_terminate = Scene_Map.prototype.terminate;
  Scene_Map.prototype.terminate = function () {
    cleanupReflections();
    _Scene_Map_terminate.call(this);
  };

  // Handle map transfers to maintain swimming and climbing state
  const _Game_Player_performTransfer = Game_Player.prototype.performTransfer;
  Game_Player.prototype.performTransfer = function () {
    const wasSwimming = this._isSwimming;
    const wasClimbing = this._isClimbing;

    // Clean up reflections before transfer
    cleanupReflections();

    _Game_Player_performTransfer.call(this);

    // Force swimming/floating mode when transferring to SeaBed biome
    if ($gameSystem._procGenData && $gameSystem._procGenData.currentBiome === "SeaBed") {
      setTimeout(() => {
        if (!this._isSwimming && !this._isClimbing) {
          this._isSwimming = true;
          setCompanionsVisibility(false);
        }
      }, 100);
      return;
    }

    // On map 636, automatically start swimming if on a water tile
    if ($gameMap.mapId() === 636 && isWaterTile(this.x, this.y) && !$gameMap.isPassable(this.x, this.y, 2)) {
      setTimeout(() => {
        if (!this._isSwimming && !this._isClimbing) {
          enterSwimMode(this);
        }
      }, 100);
      return;
    }

    // If we were swimming before transfer, check if we're still on water
    if (wasSwimming) {
      if (isWaterTile(this.x, this.y) && !$gameMap.isPassable(this.x, this.y, 2)) {
        setTimeout(() => {
          this._isSwimming = true;
          const boatData = $dataSystem.boat;
          this.setImage(boatData.characterName, boatData.characterIndex);
          setCompanionsVisibility(false);
        }, 100);
      } else {
        exitSwimMode(this);
      }
    }

    // If we were climbing before transfer, check if we're still on an accessible climbable tile
    if (wasClimbing) {
      if (isClimbableAndAccessible(this.x, this.y)) {
        setTimeout(() => {
          this._isClimbing = true;
          this._lastClimbX = this.x;
          this._lastClimbY = this.y;
          this.setDirection(8);
          setCompanionsVisibility(false);
          this._currentClimbHeight = 0;
        }, 100);
      } else {
        exitClimbMode(this);
      }
    }
  };

  window.MovementSystem = {
    isWaterTile,
    isClimbableAndAccessible,
    canClimbInDirection,
    enterSwimMode,
    exitSwimMode,
    enterClimbMode,
    exitClimbMode,
    performFishing
  };
})();
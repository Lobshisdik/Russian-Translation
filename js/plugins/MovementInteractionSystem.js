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

  const tr = (en, it) => (ConfigManager.language === "it" ? it : en);

  // Global state variables
  let isSwimming = false;
  let isFishing = false;
  let isClimbing = false;
  let companionsVisible = true;
  let lastSwimSoundFrame = 0;
  let lastClimbSoundFrame = 0;
  let lastClimbPositionX = 0;
  let lastClimbPositionY = 0;
  
  // Track height
  let currentClimbHeight = 0;

  // Store original player appearance
  let originalCharacterName = "";
  let originalCharacterIndex = 0;
  let originalCanMoveFunction = null;

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
    const terrainTag = $gameMap.terrainTag(x, y);
    return terrainTag === 4;
  }

  function isBlockedClimbTile(x, y) {
    const regionId = $gameMap.regionId(x, y);
    return regionId === 10 || regionId === 11;
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

  function isPlayerFacingNorthOrSouth() {
    const direction = $gamePlayer.direction();
    return direction === 2 || direction === 8; // 2 = South, 8 = North
  }

  function canClimbInDirection() {
    // Always only allow climbing when facing north or south
    return isPlayerFacingNorthOrSouth();
  }

  function hasFishingRod() {
    if ($gameParty.hasItem($dataItems[FISHING_ROD_ID])) {
      return true;
    }

    return fishingRodWeaponIds.some((weaponId) => {
      return $gameParty.hasItem($dataWeapons[weaponId], true);
    });
  }

  function getFrontTile() {
    const direction = $gamePlayer.direction();
    let x = $gamePlayer.x;
    let y = $gamePlayer.y;

    switch (direction) {
      case 2:
        y += 1;
        break;
      case 4:
        x -= 1;
        break;
      case 6:
        x += 1;
        break;
      case 8:
        y -= 1;
        break;
    }

    return { x, y };
  }

  function getFrontEvent() {
    const tile = getFrontTile();
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

  function performKick(event) {
    const dir = $gamePlayer.direction();
    AudioManager.playSe({ name: "Kick", volume: 90, pitch: 100, pan: 0 });
    // Attempt to move the event 2 tiles; each moveStraight handles passability
    event.moveStraight(dir);
    if (!event.isMovementSucceeded()) return;
    event.moveStraight(dir);
  }

  function storeOriginalAppearance() {
    if (!originalCharacterName) {
      originalCharacterName = $gamePlayer._characterName;
      originalCharacterIndex = $gamePlayer._characterIndex;
    }
  }

  function restoreOriginalAppearance() {
    if (originalCharacterName) {
      $gamePlayer.setImage(originalCharacterName, originalCharacterIndex);
    }
  }

  function performFishing() {
    isFishing = true;

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

    // Store original canMove function only if not already stored
    if (!originalCanMoveFunction) {
      originalCanMoveFunction = Game_Player.prototype.canMove;
    }

    // Disable player movement during fishing
    Game_Player.prototype.canMove = function () {
      return false;
    };

    if (fishingAnimationCommonEventId > 0) {
      $gameTemp.reserveCommonEvent(fishingAnimationCommonEventId);
    } else {
      $gameScreen.startFlash([255, 255, 255, 128], 60);
    }

    let remainingFrames = waitTime;
    const originalUpdate = Scene_Map.prototype.update;

    Scene_Map.prototype.update = function () {
      originalUpdate.call(this);
      if (remainingFrames > 0) {
        remainingFrames--;
        if (remainingFrames === 0) {
          // Restore player movement
          if (originalCanMoveFunction) {
            Game_Player.prototype.canMove = originalCanMoveFunction;
          }
          Scene_Map.prototype.update = originalUpdate;
          completeFishing();
        }
      }
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

  function completeFishing() {
    isFishing = false;

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

  function enterSwimMode() {
    console.log("Entering swim mode...");

    // Store original appearance before changing
    storeOriginalAppearance();

    // Set swimming state
    isSwimming = true;

    // Move to water tile
    const frontTile = getFrontTile();
    $gamePlayer.setPosition(frontTile.x, frontTile.y);

    // Change to boat sprite (static, no animation cycling)
    const boatData = $dataSystem.boat;
    $gamePlayer.setImage(boatData.characterName, boatData.characterIndex);
    $gamePlayer.setTransparent(false);

    // Mark player as swimming for sprint disable
    $gamePlayer._isSwimming = true;

    if (startSwimmingSoundEffect) {
      AudioManager.playSe({
        name: startSwimmingSoundEffect,
        volume: 90,
        pitch: 100,
        pan: 0,
      });
    }

    setCompanionsVisibility(false);

    console.log("Swim mode entered. Swimming state:", isSwimming);
  }

  function exitSwimMode() {
    console.log("Exiting swim mode...");

    // Clear swimming state
    isSwimming = false;
    $gamePlayer._isSwimming = false;

    if (stopSwimmingSoundEffect) {
      AudioManager.playSe({
        name: stopSwimmingSoundEffect,
        volume: 90,
        pitch: 100,
        pan: 0,
      });
    }

    // Restore original character appearance
    restoreOriginalAppearance();
    $gamePlayer.setTransparent(false);

    setCompanionsVisibility(true);

    // Clear any input/destination issues
    if ($gameTemp.isDestinationValid()) {
      $gameTemp.clearDestination();
    }
    Input.clear();

    console.log("Swim mode exited. Swimming state:", isSwimming);
  }

  function enterClimbMode() {
    console.log("Entering climb mode...");

    // Store original appearance before changing
    storeOriginalAppearance();

    // Set climbing state
    isClimbing = true;
    
    // Reset climb height when starting
    currentClimbHeight = 0;

    // Move to climbable tile
    const frontTile = getFrontTile();
    $gamePlayer.setPosition(frontTile.x, frontTile.y);

    // Initialize last climb position
    lastClimbPositionX = frontTile.x;
    lastClimbPositionY = frontTile.y;

    // Set direction to upward (8)
    $gamePlayer.setDirection(8);

    // Mark player as climbing
    $gamePlayer._isClimbing = true;

    if (startClimbingSoundEffect) {
      AudioManager.playSe({
        name: startClimbingSoundEffect,
        volume: 90,
        pitch: 100,
        pan: 0,
      });
    }

    setCompanionsVisibility(false);

    console.log("Climb mode entered. Climbing state:", isClimbing);
  }

  function exitClimbMode(jumpX = 0, jumpY = 1) {
    console.log("Exiting climb mode...");

    // Clear climbing state
    isClimbing = false;
    $gamePlayer._isClimbing = false;

    if (stopClimbingSoundEffect) {
      AudioManager.playSe({
        name: stopClimbingSoundEffect,
        volume: 90,
        pitch: 100,
        pan: 0,
      });
    }

    // Restore original character appearance
    restoreOriginalAppearance();
    $gamePlayer.setTransparent(false);

    // Move back to last valid climbing position first
    $gamePlayer.setPosition(lastClimbPositionX, lastClimbPositionY);

    // Calculate final destination
    const finalX = lastClimbPositionX + jumpX;
    const finalY = lastClimbPositionY + jumpY;

    // Only jump if destination is passable
    if (jumpX !== 0 || jumpY !== 0) {
      if ($gameMap.isPassable(finalX, finalY, 0)) {
        $gamePlayer.jump(jumpX, jumpY);
      }
    }

    setCompanionsVisibility(true);

    // Clear any input/destination issues
    if ($gameTemp.isDestinationValid()) {
      $gameTemp.clearDestination();
    }
    Input.clear();

    console.log("Climb mode exited. Climbing state:", isClimbing);
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
    // /* FALL MECHANICS DISABLED - const wasJumping = this.isJumping(); */

    _Game_Player_update.call(this, sceneActive);

    /* FALL MECHANICS DISABLED
    // Check for Landing
    if (wasJumping && !this.isJumping()) {
        // We have just landed.

        // Remove roof jumping flag
        this._jumpingFromRoof = false;

        // Apply any pending fall damage
        if (this._pendingFallDamageRate > 0) {
            $gameParty.members().forEach(actor => {
                const damage = Math.floor(actor.mhp * this._pendingFallDamageRate);
                if (damage > 0) {
                   actor.gainHp(-damage);
                }
            });
            // Visual flash for damage
            $gameScreen.startFlash([255, 0, 0, 128], 8);

            // Reset pending damage
            this._pendingFallDamageRate = 0;
        }
    }
    */

    this.updateSwimState();
  };

  // Force player priority above * tiles when on roof (Terrain Tag 7)
  const _Game_Player_screenZ = Game_Player.prototype.screenZ;
  Game_Player.prototype.screenZ = function() {
    // Return high priority if on a roof
    // /* FALL MECHANICS DISABLED - || this._jumpingFromRoof */
    if (isRoofTile(this.x, this.y)) {
      return 10;
    }
    return _Game_Player_screenZ.call(this);
  };
  
  // Disable dashing/sprinting while swimming or climbing
  const _Game_Player_isDashing = Game_Player.prototype.isDashing;
  Game_Player.prototype.isDashing = function () {
    if (this._isSwimming || isSwimming || this._isClimbing || isClimbing) {
      return false;
    }
    return _Game_Player_isDashing.call(this);
  };

  const _Game_Player_updateDashing = Game_Player.prototype.updateDashing;
  Game_Player.prototype.updateDashing = function () {
    if (this._isSwimming || isSwimming || this._isClimbing || isClimbing) {
      this._dashing = false;
      return;
    }
    _Game_Player_updateDashing.call(this);
  };

  // Override movement to handle roof tile jumps
// Override movement to handle roof tile jumps and climbing to land
  const _Game_Player_moveStraight = Game_Player.prototype.moveStraight;
  Game_Player.prototype.moveStraight = function (d) {
    // Check if we're on a roof tile and attempting to move to a non-roof/non-climbable tile
    if (isClimbing && isRoofTile(this.x, this.y)) {
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
          
          isClimbing = false;
          this._isClimbing = false;
          if (stopClimbingSoundEffect) {
            AudioManager.playSe({ name: stopClimbingSoundEffect, volume: 90, pitch: 100, pan: 0 });
          }
          restoreOriginalAppearance();
          this.setTransparent(false);
          setCompanionsVisibility(true);
          this.jump(jumpX, jumpY);
          currentClimbHeight = 0;
          return;
        }
        return;
      }
    }

    // NEW: If climbing and moving UP onto a passable tile that is NOT a wall or roof (Climbing to Land)
    if (isClimbing && d === 8) {
      const x2 = $gameMap.roundXWithDirection(this.x, d);
      const y2 = $gameMap.roundYWithDirection(this.y, d);
      
      // isWallTile(x2, y2) checks for Terrain 4 (climbable) and Region 10
      // isRoofTile(x2, y2) checks for Terrain 7
      if (!isWallTile(x2, y2) && !isRoofTile(x2, y2)) {
        const isPassable = $gameMap.isPassable(x2, y2, d);
        const isClear = !this.isCollidedWithEvents(x2, y2) && !this.isCollidedWithVehicles(x2, y2);
        
        if (isPassable && isClear) {
          // Perform the movement to the top and exit climbing mode
          this.jump(0, -1);
          
          isClimbing = false;
          this._isClimbing = false;
          if (stopClimbingSoundEffect) {
            AudioManager.playSe({ name: stopClimbingSoundEffect, volume: 90, pitch: 100, pan: 0 });
          }
          restoreOriginalAppearance();
          this.setTransparent(false);
          setCompanionsVisibility(true);
          currentClimbHeight = 0; // Reset height tracking
          return;
        }
      }
    }

    // Between terrain tag 7 and terrain tag 4, only north/south movement is allowed while climbing
    if (isClimbing && (d === 4 || d === 6)) {
      const dx2 = $gameMap.roundXWithDirection(this.x, d);
      const dy2 = $gameMap.roundYWithDirection(this.y, d);
      const srcTag = $gameMap.terrainTag(this.x, this.y);
      const dstTag = $gameMap.terrainTag(dx2, dy2);
      if ((srcTag === 7 && dstTag === 4) || (srcTag === 4 && dstTag === 7)) {
        return;
      }
    }

    // Normal movement
    _Game_Player_moveStraight.call(this, d);
  };
  // Prevent accidental event triggers while climbing, but allow interaction
  // when there is actually an event at the target position (terrain 4 or 7).
  const _Game_Player_checkEventTriggerHere =
    Game_Player.prototype.checkEventTriggerHere;
  Game_Player.prototype.checkEventTriggerHere = function (triggers) {
    if (this._isClimbing || isClimbing) {
      // Allow if there is an event standing on the player's current tile
      if ($gameMap.eventsXy(this.x, this.y).length === 0) return false;
    }
    return _Game_Player_checkEventTriggerHere.call(this, triggers);
  };

  const _Game_Player_checkEventTriggerThere =
    Game_Player.prototype.checkEventTriggerThere;
  Game_Player.prototype.checkEventTriggerThere = function (triggers) {
    if (this._isClimbing || isClimbing) {
      // Allow if there is an event standing on the facing tile
      const x2 = $gameMap.roundXWithDirection(this.x, this.direction());
      const y2 = $gameMap.roundYWithDirection(this.y, this.direction());
      if ($gameMap.eventsXy(x2, y2).length === 0) return false;
    }
    return _Game_Player_checkEventTriggerThere.call(this, triggers);
  };

  // Slow movement speed while climbing
  const _Game_Player_realMoveSpeed = Game_Player.prototype.realMoveSpeed;
  Game_Player.prototype.realMoveSpeed = function () {
    let speed = _Game_Player_realMoveSpeed.call(this);
    if (isClimbing || this._isClimbing) {
      speed *= climbMovementSpeed;
    }
    return speed;
  };

  Game_Player.prototype.updateSwimState = function () {
    /* FALL MECHANICS DISABLED - height reset
    if (!isClimbing) {
        const currentTag = $gameMap.terrainTag(this.x, this.y);
        if (currentTag !== 4 && currentTag !== 7) {
            currentClimbHeight = 0;
        }
    }
    */

    // Force swimming/floating mode when in SeaBed biome (keep standard sprite)
    if ($gameSystem._procGenData && $gameSystem._procGenData.currentBiome === "SeaBed") {
      if (!isSwimming) {
        isSwimming = true;
        this._isSwimming = true;
        setCompanionsVisibility(false);
      }
      return; // Don't exit swim mode in SeaBed
    }

    if (isSwimming) {
      // Check if we need to exit swim mode (moved to land)
      if (!isWaterTile(this.x, this.y)) {
        exitSwimMode();
        return;
      }

      // Play swim movement sound if configured
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

    if (isClimbing) {
      const currentTileIsRoof = isRoofTile(this.x, this.y);
      const currentTileIsClimbable = isClimbableAndAccessible(this.x, this.y);

      // Check if we're on a valid tile (climbable or roof)
      if (!currentTileIsClimbable && !currentTileIsRoof) {
        // We've moved to a non-climbable, non-roof tile - exit climbing
        // Only allow jumping down (away from cliff)
        // Always jump down when exiting climb
        let jumpX = 0;
        let jumpY = 1; // Always jump down

        // Check if destination tile is passable before jumping
        const destX = this.x + jumpX;
        const destY = this.y + jumpY;
        if ($gameMap.isPassable(destX, destY, 0)) {
          exitClimbMode(jumpX, jumpY);
        } else {
          // Destination not passable, exit without jumping (stay in place)
          exitClimbMode(0, 0);
        }
        return;
      }

      // Update last climb position
      lastClimbPositionX = this.x;
      lastClimbPositionY = this.y;

      // Always face upward while climbing (unless on roof)
      if (!currentTileIsRoof) {
        this.setDirection(8);
      }

      // Play climb movement sound if configured
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

    if (isSwimming) {
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
    // Allow action input while swimming on map 636 with Ocean biome for diving
    if (isSwimming && $gameMap.mapId() === 636) {
      const currentBiome = $gameSystem._procGenData
        ? $gameSystem._procGenData.currentBiome
        : null;
      if (currentBiome && currentBiome.toLowerCase().includes("ocean")) {
        if (Input.isTriggered("ok")) {
          this.showDiveOption();
          return;
        }
      }
      // Allow action input while swimming on map 636 with Seabed biome for resurfacing
      if (currentBiome && currentBiome.toLowerCase().includes("seabed")) {
        if (Input.isTriggered("ok")) {
          this.showResurfaceOption();
          return;
        }
      }
    }

    // Don't show the prompt if already swimming, fishing, or climbing
    if (isSwimming || isFishing || isClimbing) return;

    // Keyboard input - pressing Enter/Z
    if (Input.isTriggered("ok")) {
      const frontTile = getFrontTile();

      // Don't show any prompts when facing roof tiles (terrain ID 7),
      // unless there's an event on that tile the player wants to interact with.
      if (isRoofTile(frontTile.x, frontTile.y) && !hasEventOnTile(frontTile.x, frontTile.y)) {
        return;
      }

      // Check for map 636 tile-to-event mapping (checks layers 2, 3, 4 with priority order)
      if ($gameMap.mapId() === 636) {
        const currentTileset = $gameMap.tileset();
        const tilesetId = currentTileset ? currentTileset.id : 0;

        // Check layers in priority order (4, 3, 2) - highest layer first
        const layersToCheck = [4, 3, 2];
        let foundTileId = 0;
        let foundLayer = 0;

        console.log(
          "## Map 636 Tile lookup at (" + frontTile.x + "," + frontTile.y + "):"
        );
        console.log("   - Current Tileset ID:", tilesetId);

        // Check each layer from highest to lowest priority
        for (const layer of layersToCheck) {
          const tileId = $gameMap.tileId(frontTile.x, frontTile.y, layer);
          console.log("   - Tile ID (layer " + layer + "):", tileId);

          if (tileId !== 0) {
            foundTileId = tileId;
            foundLayer = layer;
            break; // Use the first non-zero tile found
          }
        }

        // Check if this tile ID matches any of our event mappings
        if (foundTileId !== 0 && window.WorldGen && window.WorldGen.MAP636_TILE_EVENTS) {
          for (const [commonEventId, config] of Object.entries(
            window.WorldGen.MAP636_TILE_EVENTS
          )) {
            // Skip special types like "Streetlight" (handled by DynamicLightingSystem)
            if (typeof commonEventId === 'string' && isNaN(parseInt(commonEventId))) {
              continue;
            }

            // Check all tilesets for this common event
            for (const tilesetConfig of config.tilesets) {
              if (
                tilesetConfig.tilesetId === tilesetId &&
                tilesetConfig.tileIds.includes(foundTileId)
              ) {
                console.log(
                  "## Triggering common event:",
                  commonEventId,
                  "for tile ID:",
                  foundTileId,
                  "(layer " + foundLayer + ", tileset " + tilesetId + ")"
                );
                $gameTemp.reserveCommonEvent(parseInt(commonEventId));
                return;
              }
            }
          }

          // Debug: show what tile IDs are configured for debugging
          console.log(
            "## Tile ID",
            foundTileId,
            "from tileset",
            tilesetId,
            "found but no event mapping defined for it"
          );
          console.log(
            "## Configured tile mappings:",
            JSON.stringify(window.WorldGen.MAP636_TILE_EVENTS, null, 2)
          );
        }
      }

      // Check for climbable tiles first (must be accessible - no priority tiles and can climb in direction)
      if (
        isClimbableAndAccessible(frontTile.x, frontTile.y) &&
        canClimbInDirection() &&
        !hasEventOnTile(frontTile.x, frontTile.y)
      ) {
        this.showClimbOptions();
        return;
      }

      // Check for water tiles (exclude walls)
      if (
        isWaterTile(frontTile.x, frontTile.y) &&
        !isBlockedWaterTile(frontTile.x, frontTile.y) &&
        !hasEventOnTile(frontTile.x, frontTile.y) &&
        !isWallTile(frontTile.x, frontTile.y)
      ) {
        if ($gamePlayer.isInVehicle() && $gamePlayer.vehicle().isShip()) {
          return;
        }

        this.showSwimFishOptions();
      }
    }

    this.processTouchForWaterInteraction();
    this.processTouchForClimbInteraction();
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
      // Set direction and show swim/fish options for water in any adjacent direction
      if (x === playerX) {
        // Water directly north or south
        if (y > playerY) {
          $gamePlayer.setDirection(2); // South
          this.showSwimFishOptions();
        } else if (y < playerY) {
          $gamePlayer.setDirection(8); // North
          this.showSwimFishOptions();
        }
      } else if (y === playerY) {
        // Water directly east or west
        if (x > playerX) {
          $gamePlayer.setDirection(6); // East
          this.showSwimFishOptions();
        } else if (x < playerX) {
          $gamePlayer.setDirection(4); // West
          this.showSwimFishOptions();
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
      // On map 636, only respond to north/south (vertical) climbing
      if ($gameMap.mapId() === 636) {
        if (y > playerY) {
          $gamePlayer.setDirection(2); // South
          this.showClimbOptions();
        } else if (y < playerY) {
          $gamePlayer.setDirection(8); // North
          this.showClimbOptions();
        }
        // Ignore left/right clicks on procedural map
        return;
      }

      // On other maps, set direction based on touch position
      if (x > playerX) {
        $gamePlayer.setDirection(6);
      } else if (x < playerX) {
        $gamePlayer.setDirection(4);
      } else if (y > playerY) {
        $gamePlayer.setDirection(2);
      } else if (y < playerY) {
        $gamePlayer.setDirection(8);
      }

      // Only show climb options if can climb in this direction
      if (canClimbInDirection()) {
        this.showClimbOptions();
      }
    }
  };

Scene_Map.prototype.showClimbOptions = function () {
    // Prevent the climb menu from opening if "Exterior" is missing from map notes
    if (!$dataMap || (!$dataMap.meta.Exterior && !$dataMap.note.includes("Exterior"))) {
      return;
    }

    const choices = [tr("Climb", "Arrampica")];
    choices.push(tr("Cancel", "Annulla"));

    $gameMessage.setChoices(choices, 0, choices.length - 1);
    $gameMessage.setChoiceCallback((index) => {
      if (index === choices.indexOf(tr("Climb", "Arrampica"))) {
        enterClimbMode();
      }
    });
  };

  Scene_Map.prototype.showDiveOption = function () {
    const choices = [tr("Dive", "Tuffa")];
    choices.push(tr("Cancel", "Annulla"));

    $gameMessage.setChoices(choices, 0, choices.length - 1);
    $gameMessage.setChoiceCallback((index) => {
      if (index === choices.indexOf(tr("Dive", "Tuffa"))) {
        // Call the GoDown plugin command
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

  Scene_Map.prototype.showResurfaceOption = function () {
    const choices = [tr("Resurface", "Risalire")];
    choices.push(tr("Cancel", "Annulla"));

    $gameMessage.setChoices(choices, 0, choices.length - 1);
    $gameMessage.setChoiceCallback((index) => {
      if (index === choices.indexOf(tr("Resurface", "Risalire"))) {
        // Call the GoUp plugin command
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

  Scene_Map.prototype.showSwimFishOptions = function () {
    // Check if using procedural biome system and get current biome
    const currentBiome = $gameSystem._procGenData
      ? $gameSystem._procGenData.currentBiome
      : null;

    // Ocean biome: Show "Dive" option to go underground
    if (currentBiome && currentBiome.toLowerCase().includes("ocean")) {
      const choices = [tr("Dive", "Tuffa")];
      choices.push(tr("Cancel", "Annulla"));

      $gameMessage.setChoices(choices, 0, choices.length - 1);
      $gameMessage.setChoiceCallback((index) => {
        if (index === choices.indexOf(tr("Dive", "Tuffa"))) {
          // Call the GoDown plugin command
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

    // Seabed biome: Show "Resurface" option to go back up
    if (currentBiome && currentBiome.toLowerCase().includes("seabed")) {
      const choices = [tr("Resurface", "Risalire")];
      choices.push(tr("Cancel", "Annulla"));

      $gameMessage.setChoices(choices, 0, choices.length - 1);
      $gameMessage.setChoiceCallback((index) => {
        if (index === choices.indexOf(tr("Resurface", "Risalire"))) {
          // Call the GoUp plugin command
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

    // Disable swimming on map 315
    if ($gameMap.mapId() === 315) {
      const choices = [];

      if (hasFishingRod()) {
        choices.push(tr("Fish", "Pesca"));
      }

      choices.push(tr("Cancel", "Annulla"));

      if (choices.length === 1) {
        window.skipLocalization = true;
        $gameMessage.add("You can't swim here.");
        window.skipLocalization = false;
        return;
      }

      $gameMessage.setChoices(choices, 0, choices.length - 1);
      $gameMessage.setChoiceCallback((index) => {
        if (index === choices.indexOf(tr("Fish", "Pesca")) && hasFishingRod()) {
          performFishing();
        }
      });
      return;
    }

    // Original code for other maps
    const choices = [tr("Swim", "Nuota")];

    if (hasFishingRod()) {
      choices.push(tr("Fish", "Pesca"));
    }

    choices.push(tr("Cancel", "Annulla"));

    $gameMessage.setChoices(choices, 0, choices.length - 1);
    $gameMessage.setChoiceCallback((index) => {
      if (index === choices.indexOf(tr("Swim", "Nuota"))) {
        enterSwimMode();
      } else if (
        index === choices.indexOf(tr("Fish", "Pesca")) &&
        hasFishingRod()
      ) {
        performFishing();
      }
    });
  };

  //=============================================================================
  // Handle saving/loading swim state
  //=============================================================================

  const _Game_Player_refresh = Game_Player.prototype.refresh;
  Game_Player.prototype.refresh = function () {
    _Game_Player_refresh.call(this);

    // Check if we were swimming when the game was saved
    if (this._isSwimming) {
      isSwimming = true;

      // Restore boat sprite
      const boatData = $dataSystem.boat;
      this.setImage(boatData.characterName, boatData.characterIndex);

      setCompanionsVisibility(false);
    } else {
      isSwimming = false;
    }

    // Check if we were climbing when the game was saved
    if (this._isClimbing) {
      // Only restore climbing if still on accessible climb tile
      if (isClimbableAndAccessible(this.x, this.y)) {
        isClimbing = true;
        // Initialize climb position tracking
        lastClimbPositionX = this.x;
        lastClimbPositionY = this.y;
        this.setDirection(8);
        setCompanionsVisibility(false);
      } else {
        // Exit climb mode if tile is no longer accessible
        isClimbing = false;
        this._isClimbing = false;
        setCompanionsVisibility(true);
      }
    } else {
      isClimbing = false;
      if (!this._isSwimming) {
        setCompanionsVisibility(true);
      }
    }
  };

  // Store swimming and climbing state in save data
  const _Game_Player_makeEmpty = Game_Player.prototype.makeEmpty;
  Game_Player.prototype.makeEmpty = function () {
    _Game_Player_makeEmpty.call(this);
    this._isSwimming = false;
    this._isClimbing = false;
  };

  //=============================================================================
  // Map passability overrides
  //=============================================================================

  const _Game_Map_isPassable = Game_Map.prototype.isPassable;
  Game_Map.prototype.isPassable = function (x, y, d) {
    const regionId = this.regionId(x, y);
    const terrainTag = this.terrainTag(x, y);

    // Region 5: Always allow passage
    if (regionId === 5 || regionId === 13) {
      return true;
    }

    // Region 10 & 11: Always block passage
    if (regionId === 10 || regionId === 11) {
      return false;
    }

    // Region 99: Only passable when swimming
    if (regionId === 99) {
      return isSwimming;
    }

    // Terrain tag 3: Only passable when swimming
    if (terrainTag === 3) {
      return isSwimming;
    }

    // Terrain tag 4: Only passable when climbing AND tile is accessible (no priority tiles)
    if (terrainTag === 4) {
      if (isClimbing) {
        // Can't climb to tiles with priority (drawn in front)
        return !hasPriorityTile(x, y);
      }
      return false;
    }

    // Terrain tag 7: Only passable when climbing (roof tiles)
    if (terrainTag === 7) {
      return isClimbing;
    }

    return _Game_Map_isPassable.call(this, x, y, d);
  };

  const _Game_Map_checkPassage = Game_Map.prototype.checkPassage;
  Game_Map.prototype.checkPassage = function (x, y, bit) {
    const regionId = this.regionId(x, y);
    const terrainTag = this.terrainTag(x, y);

    if (regionId === 5) {
      return 0;
    }

    if (regionId === 10 || regionId === 11) {
      return bit;
    }

    if (regionId === 99) {
      return isSwimming ? 0 : bit;
    }

    if (terrainTag === 3) {
      return isSwimming ? 0 : bit;
    }

    if (terrainTag === 4) {
      // Can climb if climbing mode is active AND no priority tiles block it
      if (isClimbing && !hasPriorityTile(x, y)) {
        return 0;
      }
      return bit;
    }

    if (terrainTag === 7) {
      // Roof tiles: passable when climbing
      return isClimbing ? 0 : bit;
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
    isSwimming = false;
    isFishing = false;
    isClimbing = false;
    companionsVisible = true;
    lastSwimSoundFrame = 0;
    lastClimbSoundFrame = 0;
    lastClimbPositionX = 0;
    lastClimbPositionY = 0;
    
    currentClimbHeight = 0;
    
    originalCharacterName = "";
    originalCharacterIndex = 0;
    originalCanMoveFunction = null;

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
    const wasSwimming = isSwimming;
    const wasClimbing = isClimbing;

    // Clean up reflections before transfer
    cleanupReflections();

    _Game_Player_performTransfer.call(this);

    // Force swimming/floating mode when transferring to SeaBed biome (keep standard sprite)
    if ($gameSystem._procGenData && $gameSystem._procGenData.currentBiome === "SeaBed") {
      setTimeout(() => {
        if (!isSwimming && !isClimbing) {
          isSwimming = true;
          this._isSwimming = true;
          setCompanionsVisibility(false);
        }
      }, 100);
      return;
    }

    // On map 636, automatically start swimming if on a water tile
    if ($gameMap.mapId() === 636 && isWaterTile(this.x, this.y)) {
      setTimeout(() => {
        if (!isSwimming && !isClimbing) {
          storeOriginalAppearance();
          isSwimming = true;
          this._isSwimming = true;
          const boatData = $dataSystem.boat;
          this.setImage(boatData.characterName, boatData.characterIndex);
          this.setTransparent(false);
          setCompanionsVisibility(false);
        }
      }, 100);
      return;
    }

    // Check if player is in region ID 3 and automatically start swimming
    if ($gameMap.regionId(this.x, this.y) === 3) {
      setTimeout(() => {
        if (!isSwimming && !isClimbing) {
          storeOriginalAppearance();
          isSwimming = true;
          this._isSwimming = true;
          const boatData = $dataSystem.boat;
          this.setImage(boatData.characterName, boatData.characterIndex);
          this.setTransparent(false);
          setCompanionsVisibility(false);
        }
      }, 100);
      return;
    }

    // If we were swimming before transfer, check if we're still on water
    if (wasSwimming) {
      if (isWaterTile(this.x, this.y)) {
        // Restore swimming state after transfer
        setTimeout(() => {
          isSwimming = true;
          this._isSwimming = true;
          const boatData = $dataSystem.boat;
          this.setImage(boatData.characterName, boatData.characterIndex);
          setCompanionsVisibility(false);
        }, 100);
      } else {
        // Exit swimming if transferred to land
        isSwimming = false;
        this._isSwimming = false;
        restoreOriginalAppearance();
        if (!wasClimbing) {
          setCompanionsVisibility(true);
        }
      }
    }

    // If we were climbing before transfer, check if we're still on an accessible climbable tile
    if (wasClimbing) {
      if (isClimbableAndAccessible(this.x, this.y)) {
        // Restore climbing state after transfer
        setTimeout(() => {
          isClimbing = true;
          this._isClimbing = true;
          // Initialize climb position tracking
          lastClimbPositionX = $gamePlayer.x;
          lastClimbPositionY = $gamePlayer.y;
          this.setDirection(8);
          setCompanionsVisibility(false);
          // Reset climb height on map transfer
          currentClimbHeight = 0;
        }, 100);
      } else {
        // Exit climbing if transferred to non-accessible tile
        isClimbing = false;
        this._isClimbing = false;
        restoreOriginalAppearance();
        if (!wasSwimming) {
          setCompanionsVisibility(true);
        }
      }
    }
  };
})();
/*:
 * @target MZ
 * @plugindesc Adds 2D platformer controls (Super Mario style) on maps tagged <Platform>, with refined animation, ladder climbing, event triggers, region-based passability, and run button.
 * @author GPT-Starfleet
 *
 * @help PlatformerMode.js
 *
 * Place this in your project's js/plugins folder and enable it.
 *
 * Map Note Tag:
 *   <Platform>
 *
 * Mechanics:
 *   - Left/Right: ←/→ keys (or assignable)
 *   - Jump: Space (disabled when touching/near events)
 *   - Run: Hold Shift key to increase movement speed
 *   - Wall-jump when pressing Space against a wall (regionId=10 or any blocking tile)
 *   - Gravity, max fall speed, collision with walls and ladders
 *   - Region 5 always passable; Region 10 always impassable
 *   - Followers follow the exact path with a short delay, matching facing direction
 *   - Animation: slower walk-cycle when moving; idle frame during jumps; faster animation when running
 *   - Ladder climbing: press Up on ladder tiles
 *   - Action button (Space) triggers adjacent events; touch triggers on contact
 *   - Player freezes during map transitions
 *
 * Configuration (at top of file):
 *   TILE_SIZE       : pixel size of one tile (default 48)
 *   GRAVITY         : pixels per frame²
 *   MOVE_SPEED      : pixels per frame (walking speed)
 *   RUN_SPEED       : pixels per frame (running speed when holding shift)
 *   JUMP_SPEED      : initial jump velocity (pixels per frame)
 *   MAX_FALL_SPEED  : terminal velocity (pixels per frame)
 *   WALL_JUMP_X     : horizontal boost speed on wall-jump
 *   WALL_JUMP_Y     : vertical boost speed on wall-jump
 *   FOLLOWER_DELAY  : frames between each follower in the path history
 *   ANIM_SPEED      : frames per walk-frame advance (higher = slower)
 *   RUN_ANIM_SPEED  : frames per run-frame advance (faster than walk)
 */
(() => {
  const TILE_SIZE      = 48;
  const GRAVITY        = 1.2;
  const MOVE_SPEED     = 4;     // Walking speed
  const RUN_SPEED      = 7;     // Running speed (when holding shift)
  const JUMP_SPEED     = -20;   // Higher jump
  const MAX_FALL_SPEED = 12;
  const WALL_JUMP_X    = 8;     // Stronger horizontal wall jump
  const WALL_JUMP_Y    = -18;   // Higher wall jump
  const FOLLOWER_DELAY = 10;
  const ANIM_SPEED     = 12;    // Walk animation speed
  const RUN_ANIM_SPEED = 6;     // Run animation speed (faster)
  const CAMERA_SPEED   = 0.1;   // Camera follow smoothness (0.1 = smooth, 1.0 = instant)
  const SPRITE_OFFSET_Y = 0;    // Move player sprite above collision box

  const isPlatformMap = () => !!$dataMap.meta.Platform;
  let _positionHistory = [];
  let _isMapTransitioning = false; // Flag to track map transitions

  // Cache original character animation
  const _Character_updateAnimation = Game_Character.prototype.updateAnimation;

  // Hook into map setup to detect map changes
  const _DataManager_onLoad = DataManager.onLoad;
  DataManager.onLoad = function(object) {
    _DataManager_onLoad.call(this, object);
    if (object === $dataMap) {
      _isMapTransitioning = true;
      // Clear position history on map change
      _positionHistory = [];
      
      // Reset player physics state
      if ($gamePlayer) {
        $gamePlayer._vx = 0;
        $gamePlayer._vy = 0;
        $gamePlayer._isJumping = false;
        $gamePlayer._isRunning = false;
      }
    }
  };

  // Hook into Scene_Map start to unfreeze player
  const _Scene_Map_start = Scene_Map.prototype.start;
  Scene_Map.prototype.start = function() {
    _Scene_Map_start.call(this);
    // Unfreeze player after map transition completes
    setTimeout(() => {
      _isMapTransitioning = false;
    }, 100); // Small delay to ensure smooth transition
  };

  // Hook into transfer player to freeze during transition
  const _Game_Player_performTransfer = Game_Player.prototype.performTransfer;
  Game_Player.prototype.performTransfer = function() {
    if (this.isTransferring()) {
      _isMapTransitioning = true;
    }
    _Game_Player_performTransfer.call(this);
  };

  // Extend Game_Player init
  const _GP_initMembers = Game_Player.prototype.initMembers;
  Game_Player.prototype.initMembers = function() {
    _GP_initMembers.call(this);
    this._vx = 0;
    this._vy = 0;
    this._isJumping = false;
    this._animCounter = 0;
    this._isRunning = false;
  };

  // Override update
  const _GP_update = Game_Player.prototype.update;
  Game_Player.prototype.update = function(sceneActive) {
    if (isPlatformMap()) {
      this.updatePlatformer();
    } else {
      _GP_update.call(this, sceneActive);
    }
  };

  // Main platform update
  Game_Player.prototype.updatePlatformer = function() {
    // Skip all platformer updates if map is transitioning
    if (_isMapTransitioning) {
      // Keep player frozen in place
      this._vx = 0;
      this._vy = 0;
      this._isJumping = false;
      this._isRunning = false;
      this.setMovementSuccess(true);
      return;
    }

    this.updateInput();
    this.applyPhysics();
    this.updatePosition();
    this.updateAnimation();
    this.updateFollowersPath();
    this.updateCamera();
    this.checkEventTrigger();
    this.setMovementSuccess(true);
  };

  // Override screenX to apply vertical sprite offset
  const _GP_screenX = Game_Player.prototype.screenX;
  Game_Player.prototype.screenX = function() {
    if (isPlatformMap()) {
      return Math.round(this.scrolledX() * $gameMap.tileWidth());
    }
    return _GP_screenX.call(this);
  };

  // Override screenY to apply vertical sprite offset
  const _GP_screenY = Game_Player.prototype.screenY;
  Game_Player.prototype.screenY = function() {
    if (isPlatformMap()) {
      return Math.round(this.scrolledY() * $gameMap.tileHeight()) + SPRITE_OFFSET_Y;
    }
    return _GP_screenY.call(this);
  };

  // Scoped animation override with running support
  Game_Player.prototype.updateAnimation = function() {
    if (!isPlatformMap()) {
      _Character_updateAnimation.call(this);
      return;
    }
    
    // Freeze animation during map transitions
    if (_isMapTransitioning) {
      this._pattern = 1; // Set to idle frame
      this._animCounter = 0;
      return;
    }
    
    if (this.isOnLadder()) {
      this.setImage(this._characterName, this._characterIndex);
      return;
    }
    if (this._vx !== 0 && !this._isJumping) {
      this._animCounter++;
      // Use different animation speeds for walking vs running
      const animSpeed = this._isRunning ? RUN_ANIM_SPEED : ANIM_SPEED;
      if (this._animCounter >= animSpeed) {
        this._pattern = (this._pattern + 1) % 3;
        this._animCounter = 0;
      }
    } else {
      this._pattern = 1;
      this._animCounter = 0;
    }
  };

  // Input handling with run button support
  Game_Player.prototype.updateInput = function() {
    // Block all input during map transitions
    if (_isMapTransitioning) {
      return;
    }
    
    // Check if run button (shift) is being held
    this._isRunning = Input.isPressed('shift');
    
    // Determine current movement speed based on running state
    const currentSpeed = this._isRunning ? RUN_SPEED : MOVE_SPEED;
    
    // Ladder climb
    if (Input.isPressed('up') && this.isOnLadder()) {
      this._vy = -currentSpeed; // Running also affects ladder climbing speed
      this.setDirection(8);
      return;
    }
    
    // Horizontal move with dynamic speed
    if (Input.isPressed('left')) {
      this._vx = -currentSpeed;
      this.setDirection(4);
    } else if (Input.isPressed('right')) {
      this._vx = currentSpeed;
      this.setDirection(6);
    } else {
      this._vx = 0;
    }
    
    // Jump and Wall Jump (blocked near/under events)
    if (Input.isTriggered('ok')) {
      if (!this.isNearEvent() && !this.isOnLadder()) {
        // Regular jump from ground
        if (this.isTouchingFloor()) {
          this._vy = JUMP_SPEED;
          this._isJumping = true;
        } 
        // Wall jump mechanics - jump in opposite direction of wall contact
        else if (this._isJumping && (this.isTouchingLeftWall() || this.isTouchingRightWall())) {
          this._vy = WALL_JUMP_Y;
          
          // Wall jump speed can also be affected by running
          const wallJumpSpeed = this._isRunning ? WALL_JUMP_X * 1.5 : WALL_JUMP_X;
          
          // Jump away from the wall you're touching
          if (this.isTouchingLeftWall()) {
            // Touching left wall, jump right
            this._vx = wallJumpSpeed;
            this.setDirection(6); // Face right
          } else if (this.isTouchingRightWall()) {
            // Touching right wall, jump left  
            this._vx = -wallJumpSpeed;
            this.setDirection(4); // Face left
          }
          
          this._isJumping = true;
        }
      }
    }
  };

  // Physics
  Game_Player.prototype.applyPhysics = function() {
    // Don't apply physics during map transitions
    if (_isMapTransitioning) {
      return;
    }
    
    if (!this.isOnLadder()) {
      this._vy = Math.min(this._vy + GRAVITY, MAX_FALL_SPEED);
    }
  };

  // Position update & collision
  Game_Player.prototype.updatePosition = function() {
    // Don't update position during map transitions
    if (_isMapTransitioning) {
      return;
    }
    
    // Horizontal
    if (this._vx !== 0) {
      const signX = Math.sign(this._vx);
      const nextX = this._realX + signX * (Math.abs(this._vx) / TILE_SIZE);
      if (!this._isBlockedAt(nextX, this._realY)) {
        this._realX = nextX;
      } else {
        this._vx = 0;
      }
    }
    // Vertical
    if (this._vy !== 0) {
      const signY = Math.sign(this._vy);
      const nextY = this._realY + signY * (Math.abs(this._vy) / TILE_SIZE);
      if (!this._isBlockedAt(this._realX, nextY)) {
        this._realY = nextY;
      } else {
        this._vy = 0;
        this._isJumping = false;
      }
    }
    this._x = Math.round(this._realX);
    this._y = Math.round(this._realY);
    
    // Fix: Only update follower sprites if there are actual party members
    // Don't force all followers to use the player's character name
    this._followers._data.forEach((follower, index) => {
      const actorIndex = index + 1; // Skip player (index 0)
      if ($gameParty._actors[actorIndex]) {
        const actor = $gameActors.actor($gameParty._actors[actorIndex]);
        if (actor) {
          follower._characterName = actor._characterName;
          follower._characterIndex = actor._characterIndex;
        }
      } else {
        // Hide followers that don't correspond to party members
        follower._characterName = '';
      }
    });
  };

  // Ladder check
  Game_Player.prototype.isOnLadder = function() {
    return $gameMap.isLadder(Math.floor(this._realX), Math.floor(this._realY));
  };

  // Event proximity
  Game_Player.prototype.isNearEvent = function() {
    return $gameMap.events().some(ev => Math.abs(ev.x - this.x) + Math.abs(ev.y - this.y) <= 1);
  };

  // Trigger events
  Game_Player.prototype.checkEventTrigger = function() {
    // Block event triggers during map transitions
    if (_isMapTransitioning) {
      return;
    }
    
    // Action button
    if (Input.isTriggered('ok')) {
      $gameMap.events().forEach(ev => {
        if (Math.abs(ev.x - this.x) + Math.abs(ev.y - this.y) <= 1) {
          ev.start();
        }
      });
    }
    // Touch trigger
    const events = $gameMap.eventsXy(this.x, this.y);
    events.forEach(ev => ev.start());
  };

  // Collision check with region overrides - UPDATED for clearer region behavior
  Game_Player.prototype._isBlockedAt = function(rx, ry) {
    const tx = Math.floor(rx);
    const ty = Math.floor(ry);
    
    // Check if coordinates are within map bounds
    if (tx < 0 || tx >= $dataMap.width || ty < 0 || ty >= $dataMap.height) {
      return true; // Out of bounds is always blocked
    }
    
    const regionId = $gameMap.regionId(tx, ty);
    
    // Region 5 is always passable, regardless of tile passability
    if (regionId === 5) {
      return false;
    }
    
    // Region 10 is always impassable, regardless of tile passability
    if (regionId === 10) {
      return true;
    }
    
    // For all other regions, use default passability check
    return !$gameMap.isPassable(tx, ty, this.direction());
  };

  // Floor/wall checks
  Game_Player.prototype.isTouchingFloor = function() {
    return this._isBlockedAt(this._realX, this._realY + 0.51);
  };
  Game_Player.prototype.isTouchingWall = function() {
    return this.isTouchingLeftWall() || this.isTouchingRightWall();
  };
  Game_Player.prototype.isTouchingLeftWall = function() {
    return this._isBlockedAt(this._realX - 0.51, this._realY);
  };
  Game_Player.prototype.isTouchingRightWall = function() {
    return this._isBlockedAt(this._realX + 0.51, this._realY);
  };

  // Followers pathing
  Game_Player.prototype.updateFollowersPath = function() {
    // Don't update followers during map transitions
    if (_isMapTransitioning) {
      return;
    }
    
    // Only update follower paths if there are actual party members beyond the player
    if ($gameParty._actors.length <= 1) {
      _positionHistory = []; // Clear history when alone
      return;
    }
    
    _positionHistory.push({ x: this._realX, y: this._realY, dir: this.direction() });
    const maxHistory = FOLLOWER_DELAY * ($gameParty._actors.length - 1) + 1;
    if (_positionHistory.length > maxHistory) _positionHistory.shift();
    
    this._followers._data.forEach((follower, idx) => {
      // Only update followers that correspond to actual party members
      if ($gameParty._actors[idx + 1]) {
        const i = _positionHistory.length - 1 - FOLLOWER_DELAY * (idx + 1);
        if (i >= 0) {
          const rec = _positionHistory[i];
          follower._realX = rec.x;
          follower._realY = rec.y;
          follower._x = Math.round(rec.x);
          follower._y = Math.round(rec.y);
          follower.setDirection(rec.dir);
        }
      }
    });
  };

  // Camera following
  Game_Player.prototype.updateCamera = function() {
    // Calculate target camera position (center player on screen)
    const targetX = this._realX - ($gameMap.screenTileX() - 1) / 2;
    const targetY = this._realY - ($gameMap.screenTileY() - 1) / 2;
    
    // Get current display position
    const currentX = $gameMap._displayX;
    const currentY = $gameMap._displayY;
    
    // Smoothly interpolate camera position
    const newX = currentX + (targetX - currentX) * CAMERA_SPEED;
    const newY = currentY + (targetY - currentY) * CAMERA_SPEED;
    
    // Clamp camera to map boundaries
    const maxX = Math.max(0, $dataMap.width - $gameMap.screenTileX());
    const maxY = Math.max(0, $dataMap.height - $gameMap.screenTileY());
    
    const clampedX = Math.max(0, Math.min(newX, maxX));
    const clampedY = Math.max(0, Math.min(newY, maxY));
    
    // Set the camera position
    $gameMap.setDisplayPos(clampedX, clampedY);
  };

})();
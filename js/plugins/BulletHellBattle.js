// Uncomment for debugging enemy hitbox
/*
updateHitboxVisualizer() {
if (!this._hitboxVisualizer) {
    this._hitboxVisualizer = new PIXI.Graphics();
    this.addChild(this._hitboxVisualizer);
}

this._hitboxVisualizer.clear();
this._hitboxVisualizer.lineStyle(1, 0xFF0000);
this._hitboxVisualizer.drawRect(
    this._enemyHitbox.x - this._enemyHitbox.width/2,
    this._enemyHitbox.y - this._enemyHitbox.height/2,
    this._enemyHitbox.width,
    this._enemyHitbox.height
);
}
*//*:
* @target MZ
* @plugindesc Creates a bullet hell mini-game during battle
* @author Omni-Lex
* @url https://nocoldiz.itch.io/hypernet-explorer
*
* @help BulletHellBattle.js
*
* This plugin creates a Touhou/Undertale-style bullet hell sequence
* during battle. The player controls a spaceship to avoid enemy attacks
* and shoot back.
*
* Use plugin commands to start the bullet hell sequence during battle events.
*
* @param defaultSpeedMultiplier
* @text Default Speed Multiplier
* @type number
* @decimals 1
* @min 0.1
* @max 2.0
* @default 0.7
* @desc Global speed multiplier for player, enemy and bullets (lower = slower)
*
* @param playerSpeedMultiplier
* @text Player Speed Multiplier
* @type number
* @decimals 1
* @min 0.1
* @max 2.0
* @default 0.8
* @desc Player movement speed multiplier (lower = slower)
*
* @param enemySpeedMultiplier
* @text Enemy Speed Multiplier
* @type number
* @decimals 1
* @min 0.1
* @max 2.0
* @default 0.6
* @desc Enemy movement speed multiplier (lower = slower)
*
* @param bulletSpeedMultiplier
* @text Bullet Speed Multiplier
* @type number
* @decimals 1
* @min 0.1
* @max 2.0
* @default 0.7
* @desc Bullet speed multiplier (lower = slower)
*
* @param useLuckForDamage
* @text Use Luck for Damage
* @type boolean
* @default true
* @desc If true, player's luck will influence damage dealt (luck/10 per hit)
*
* @param useLuckForDifficulty
* @text Use Luck for Difficulty
* @type boolean
* @default true
* @desc If true, enemy's luck will influence bullet patterns and speed
*
* @command startBulletHell
* @text Start Bullet Hell
* @desc Starts a bullet hell sequence in battle
*
* @arg duration
* @text Duration (frames)
* @type number
* @min 1
* @default 300
* @desc Duration of the bullet hell sequence in frames (60 frames = 1 second)
*
* @arg playerImage
* @text Player Ship Image
* @type file
* @dir img/pictures/
* @desc Image to use for the player's spaceship
*
* @arg playerSpeed
* @text Player Ship Speed
* @type number
* @min 1
* @default 5
* @desc Base speed of the player's spaceship
*
* @arg bulletDamage
* @text Player Bullet Damage
* @type number
* @min 1
* @default 10
* @desc Base damage dealt by player bullets
*
* @arg enemyBulletDamage
* @text Enemy Bullet Damage
* @type number
* @min 1
* @default 5
* @desc Damage dealt by enemy bullets
* 
* @arg playerHitSE
* @text Player Hit Sound
* @type file
* @dir audio/se/
* @desc Sound effect when player is hit
* 
* @arg enemyHitSE
* @text Enemy Hit Sound
* @type file
* @dir audio/se/
* @desc Sound effect when enemy is hit
* 
* @arg enemyHitSE2
* @text Enemy Hit Sound 2
* @type file
* @dir audio/se/
* @desc Alternative sound effect when enemy is hit
* 
* @arg enemyHitSE3
* @text Enemy Hit Sound 3
* @type file
* @dir audio/se/
* @desc Alternative sound effect when enemy is hit
* 
* @arg bulletCollisionSE
* @text Bullet Collision Sound
* @type file
* @dir audio/se/
* @desc Sound effect when player's laser hits an enemy bullet
*/
(()=>{"use strict";

// Get plugin parameters
const pluginName = "BulletHellBattle";
const parameters = PluginManager.parameters(pluginName);
const defaultSpeedMultiplier = Number(parameters.defaultSpeedMultiplier || 0.7);
const playerSpeedMultiplier = Number(parameters.playerSpeedMultiplier || 0.8);
const enemySpeedMultiplier = Number(parameters.enemySpeedMultiplier || 0.6);
const bulletSpeedMultiplier = Number(parameters.bulletSpeedMultiplier || 0.7);
const useLuckForDamage = parameters.useLuckForDamage !== "false";
const useLuckForDifficulty = parameters.useLuckForDifficulty !== "false";

PluginManager.registerCommand(pluginName, "startBulletHell", (args) => {
if ($gameParty.inBattle()) {
    const duration = Number(args.duration) || 300;
    const playerImage = String(args.playerImage) || "";
    const playerSpeed = Number(args.playerSpeed) || 5;
    const bulletDamage = Number(args.bulletDamage) || 10;
    const enemyBulletDamage = Number(args.enemyBulletDamage) || 5;
    const playerHitSE = String(args.playerHitSE) || "";
    const enemyHitSE = String(args.enemyHitSE) || "";
    const enemyHitSE2 = String(args.enemyHitSE2) || "";
    const enemyHitSE3 = String(args.enemyHitSE3) || "";
    const bulletCollisionSE = String(args.bulletCollisionSE) || "";

    $gameTemp.bulletHellParams = {
        duration: duration,
        playerImage: playerImage,
        playerSpeed: playerSpeed,
        bulletDamage: bulletDamage,
        enemyBulletDamage: enemyBulletDamage,
        playerHitSE: playerHitSE,
        enemyHitSE: enemyHitSE,
        enemyHitSE2: enemyHitSE2,
        enemyHitSE3: enemyHitSE3,
        bulletCollisionSE: bulletCollisionSE
    };
    
    BattleManager.startBulletHell();
}
});

BattleManager.startBulletHell = function() {
this._bulletHellMode = true;
this._bulletHellFrames = $gameTemp.bulletHellParams.duration;
this._savedActor = this.actor();
this._savedInputting = this._inputting;
this._savedPhase = this._phase;
this._inputting = false;
this._phase = "bullet-hell";
SceneManager._scene.startBulletHell();
};

BattleManager.endBulletHell = function() {
this._bulletHellMode = false;
this._inputting = this._savedInputting;
this._phase = this._savedPhase;

// Make the damage counter visible before ending
if (SceneManager._scene._bulletHellLayer &&
    SceneManager._scene._bulletHellLayer._damageCounter) {
    SceneManager._scene._bulletHellLayer._damageCounter.visible = true;
}

const logWindow = this._logWindow;
if (SceneManager._scene._bulletHellLayer && logWindow && logWindow.addText) {
    const totalDamage = SceneManager._scene._bulletHellLayer._totalDamageDealt;
    if (totalDamage > 0) {
        const text = "Total bullet hell damage: " + totalDamage;
        safeBattleLog(text);
    }
}

// Add a small delay before ending to show the final damage
const scene = SceneManager._scene;
setTimeout(() => {
    if (scene && scene.endBulletHell) {
        scene.endBulletHell();
    }
}, 1000);
};

const _BattleManager_update = BattleManager.update;
BattleManager.update = function(active) {
if (this._bulletHellMode) {
    this.updateBulletHellSequence();
} else {
    _BattleManager_update.call(this, active);
}
};

BattleManager.updateBulletHellSequence = function() {
this._bulletHellFrames--;
if (this._bulletHellFrames <= 0) {
    this.endBulletHell();
}
};

const _Scene_Battle_initialize = Scene_Battle.prototype.initialize;
Scene_Battle.prototype.initialize = function() {
_Scene_Battle_initialize.call(this);
this._bulletHellActive = false;
};

Scene_Battle.prototype.startBulletHell = function() {
this._bulletHellActive = true;
this.hideBattleWindows();
this.createBulletHellLayer();
};

Scene_Battle.prototype.endBulletHell = function() {
this._bulletHellActive = false;
this.showBattleWindows();
this.removeBulletHellLayer();
};

Scene_Battle.prototype.hideBattleWindows = function() {
if (this._partyCommandWindow) this._partyCommandWindow.hide();
if (this._actorCommandWindow) this._actorCommandWindow.hide();
if (this._skillWindow) this._skillWindow.hide();
if (this._itemWindow) this._itemWindow.hide();
if (this._actorWindow) this._actorWindow.hide();
if (this._enemyWindow) this._enemyWindow.hide();
if (this._helpWindow) this._helpWindow.hide();
if (this._statusWindow) this._statusWindow.hide();

if (this._logWindow) {
    if (this._logWindow._logSprites) {
        this._logWindow.opacity = 0;
        this._logWindow.backOpacity = 0;
        this._logWindow.contentsOpacity = 0;
        for (const sprite of this._logWindow._logSprites) {
            if (sprite) {
                sprite.opacity = 0;
            }
        }
        if (this._pastLogWindow) {
            this._pastLogWindow.hide();
            this._pastLogWindow.deactivate();
        }
    } else {
        this._logWindow.hide();
    }
}

this.children.forEach(child => {
    if (child instanceof Window_Base) {
        child.hide();
    }
});
};

Scene_Battle.prototype.showBattleWindows = function() {
if (BattleManager._phase === "input" && BattleManager.isInputting()) {
    if (BattleManager.actor()) {
        this._actorCommandWindow.show();
    } else {
        this._partyCommandWindow.show();
    }
}

if (this._statusWindow) this._statusWindow.show();

if (this._logWindow) {
    if (this._logWindow._logSprites) {
        this._logWindow.opacity = 255;
        this._logWindow.backOpacity = 255;
        this._logWindow.contentsOpacity = 255;
        for (const sprite of this._logWindow._logSprites) {
            if (sprite) {
                sprite.opacity = 255;
            }
        }
    } else {
        this._logWindow.show();
    }
}
};

Scene_Battle.prototype.createBulletHellLayer = function() {
// Create the bullet hell layer
this._bulletHellLayer = new BulletHellLayer(
    $gameTemp.bulletHellParams,
    this._spriteset._enemySprites[0]
);

// First bring the enemy sprite to the front before adding bullet hell layer
const enemySprite = this._spriteset._enemySprites[0];
if (enemySprite && enemySprite.parent) {
    enemySprite.parent.removeChild(enemySprite);
}

// Add the bullet hell layer
this.addChild(this._bulletHellLayer);

// Now add the enemy sprite on top of the bullet hell layer
if (enemySprite) {
    this.addChild(enemySprite);
    // Store reference to know we moved it
    this._bulletHellLayer._movedEnemySprite = true;
}
};

Scene_Battle.prototype.removeBulletHellLayer = function() {
if (this._bulletHellLayer) {
    // Restore enemy sprite to its original container if we moved it
    if (this._bulletHellLayer._movedEnemySprite && this._bulletHellLayer._enemySprite) {
        this.removeChild(this._bulletHellLayer._enemySprite);
        if (this._spriteset && this._spriteset._enemySprites) {
            // Find the correct container to return the sprite to
            const spritesetBattler = this._spriteset._battleField || this._spriteset;
            if (spritesetBattler && spritesetBattler.addChild) {
                spritesetBattler.addChild(this._bulletHellLayer._enemySprite);
            }
        }
    }
    
    // Reset enemy sprite appearance
    if (this._bulletHellLayer._enemySprite && this._bulletHellLayer._originalEnemyScale) {
        this._bulletHellLayer._enemySprite.scale.x = this._bulletHellLayer._originalEnemyScale.x;
        this._bulletHellLayer._enemySprite.scale.y = this._bulletHellLayer._originalEnemyScale.y;
    }
    
    if (this._bulletHellLayer._enemySprite && this._bulletHellLayer._originalEnemyPosition) {
        this._bulletHellLayer._enemySprite.x = this._bulletHellLayer._originalEnemyPosition.x;
        this._bulletHellLayer._enemySprite.y = this._bulletHellLayer._originalEnemyPosition.y;
    }
    
    // Remove bullet hell layer
    this.removeChild(this._bulletHellLayer);
    this._bulletHellLayer = null;
}
};

const _Scene_Battle_update = Scene_Battle.prototype.update;
Scene_Battle.prototype.update = function() {
_Scene_Battle_update.call(this);
if (this._bulletHellActive && this._bulletHellLayer) {
    this._bulletHellLayer.update();
}
};

class BulletHellLayer extends PIXI.Container {
constructor(params, enemySprite) {
    super();
    this.initialize(params, enemySprite);
}

createDamageCounter() {
    this._damageCounter = new Sprite(new Bitmap(200, 48));
    this._damageCounter.bitmap.fontSize = 28;
    this._damageCounter.bitmap.fontFace = $gameSystem.mainFontFace();
    this._damageCounter.bitmap.textColor = "#FFFFFF";
    this._damageCounter.bitmap.outlineColor = "rgba(0, 0, 0, 0.8)";
    this._damageCounter.bitmap.outlineWidth = 4;
    this._damageCounter.x = Graphics.boxWidth / 2 - 100;
    this._damageCounter.y = Graphics.boxHeight * 0.1;
    
    // Hide the damage counter until end of sequence
    this._damageCounter.visible = false;
    
    this.addChild(this._damageCounter);
    this.updateDamageCounter();
}

updateDamageCounter() {
    if (this._damageCounter && this._damageCounter.bitmap) {
        this._damageCounter.bitmap.clear();
        const damage = this._totalDamageDealt || 0;
        this._damageCounter.bitmap.drawText(String(damage), 0, 0, 200, 48, "center");
    }
}

initialize(params, enemySprite) {
    this._params = params;
    this._enemySprite = enemySprite;
    this._enemy = enemySprite._battler;
    this._player = $gameParty.battleMembers()[0];
    
    // Store adjusted player and enemy luck values for later use
    this._playerLuck = this._player.luk;
    this._enemyLuck = this._enemy.luk;
    
    // Extract enemy level from notes
    this._enemyLevel = 1; // Default level
    if (this._enemy.enemy && this._enemy.enemy().note) {
        const levelMatch = this._enemy.enemy().note.match(/LV:\s*(\d+)/i);
        if (levelMatch) {
            this._enemyLevel = Math.min(99, Math.max(1, parseInt(levelMatch[1])));
        }
    }
    
    this.width = Graphics.boxWidth;
    this.height = Graphics.boxHeight;
    
    // Store original enemy sprite properties
    this._originalEnemyScale = {
        x: this._enemySprite.scale.x,
        y: this._enemySprite.scale.y
    };
    this._originalEnemyPosition = {
        x: this._enemySprite.x,
        y: this._enemySprite.y
    };
    
    // Scale down enemy sprite
    this._enemySprite.scale.x *= 0.65;
    this._enemySprite.scale.y *= 0.65;
    
    // Calculate difficulty factor based on enemy level and luck
    // Luck has 70% weight, Level has 30% weight
    // Luck soft caps at 200, common range is 30-50
    
    // Level component (0.0 to 1.0 scale)
    // Level 1-9: 0.0 - 0.3 (easy)
    // Level 10-19: 0.3 - 0.5 (moderate)
    // Level 20-49: 0.5 - 0.75 (medium-hard)
    // Level 50-99: 0.75 - 1.0 (very hard)
    let levelFactor;
    if (this._enemyLevel < 10) {
        // Easy range: linear 0.0 to 0.3
        levelFactor = this._enemyLevel * 0.03;
    } else if (this._enemyLevel < 20) {
        // Moderate range: 0.3 to 0.5
        levelFactor = 0.3 + ((this._enemyLevel - 10) * 0.02);
    } else if (this._enemyLevel < 50) {
        // Medium-hard range: 0.5 to 0.75
        levelFactor = 0.5 + ((this._enemyLevel - 20) * 0.00833);
    } else {
        // Very hard range: 0.75 to 1.0
        levelFactor = 0.75 + ((this._enemyLevel - 50) * 0.0051);
    }
    
    // Luck component with soft cap at 200
    // Designed so 30-50 luck = medium difficulty
    // 0-20 luck: very easy (0.0 - 0.3)
    // 20-30 luck: easy (0.3 - 0.4)
    // 30-50 luck: medium (0.4 - 0.6) <- most common enemies
    // 50-80 luck: hard (0.6 - 0.75)
    // 80-120 luck: very hard (0.75 - 0.9)
    // 120-200 luck: extreme (0.9 - 1.0)
    let luckFactor;
    if (this._enemyLuck < 20) {
        luckFactor = this._enemyLuck * 0.015; // 0.0 to 0.3
    } else if (this._enemyLuck < 30) {
        luckFactor = 0.3 + ((this._enemyLuck - 20) * 0.01); // 0.3 to 0.4
    } else if (this._enemyLuck < 50) {
        luckFactor = 0.4 + ((this._enemyLuck - 30) * 0.01); // 0.4 to 0.6
    } else if (this._enemyLuck < 80) {
        luckFactor = 0.6 + ((this._enemyLuck - 50) * 0.005); // 0.6 to 0.75
    } else if (this._enemyLuck < 120) {
        luckFactor = 0.75 + ((this._enemyLuck - 80) * 0.00375); // 0.75 to 0.9
    } else {
        // Soft cap: diminishing returns above 120
        luckFactor = 0.9 + ((Math.min(200, this._enemyLuck) - 120) * 0.00125); // 0.9 to 1.0
    }
    
    // Weighted combination: 70% luck, 30% level
    const combinedFactor = (luckFactor * 0.7) + (levelFactor * 0.3);
    
    // Convert to difficulty multiplier
    // 0.0-0.25: very easy (0.4x - 0.6x)
    // 0.25-0.4: easy (0.6x - 0.8x)
    // 0.4-0.6: medium (0.8x - 1.2x) <- most common medium level enemies
    // 0.6-0.8: hard (1.2x - 1.6x)
    // 0.8-1.0: very hard/extreme (1.6x - 2.2x)
    let difficultyFactor;
    if (combinedFactor < 0.25) {
        difficultyFactor = 0.4 + (combinedFactor * 0.8); // 0.4 to 0.6
    } else if (combinedFactor < 0.4) {
        difficultyFactor = 0.6 + ((combinedFactor - 0.25) * 1.333); // 0.6 to 0.8
    } else if (combinedFactor < 0.6) {
        difficultyFactor = 0.8 + ((combinedFactor - 0.4) * 2.0); // 0.8 to 1.2
    } else if (combinedFactor < 0.8) {
        difficultyFactor = 1.2 + ((combinedFactor - 0.6) * 2.0); // 1.2 to 1.6
    } else {
        difficultyFactor = 1.6 + ((combinedFactor - 0.8) * 3.0); // 1.6 to 2.2
    }
    
    this._difficultyFactor = useLuckForDifficulty ? difficultyFactor : 1.0;
    
    // Apply massive bullet quantity multiplier for all difficulties
    // Lower difficulties get slower bullets but still plenty of them
    this._bulletQuantityMultiplier = 3.0;
    
    // Set up for multiple patterns
    this._useMultiplePatterns = this._enemyLuck > 10;
    this._activePatterns = [];
    this._patternTimers = {};
    
    // Initialize secondary pattern timer
    this._secondaryPatternTimer = 0;
    this._secondaryPatternInterval = Math.max(30, 120 - this._enemyLuck);

        
    // Setup enemy movement parameters
    this._enemyMovement = {
        pattern: this.getRandomMovementPattern(),
        timer: 0,
        duration: 180,
        speedX: 2 * enemySpeedMultiplier * defaultSpeedMultiplier,
        speedY: 1.5 * enemySpeedMultiplier * defaultSpeedMultiplier,
        angle: 0,
        radius: 80,
        centerX: this._enemySprite.x,
        centerY: this._enemySprite.y
    };
    
    // Create background
    this._background = new PIXI.Graphics();
    this._background.beginFill(0x111111, 0.7); // Darker background (almost black)
    this._background.drawRect(0, 0, Graphics.boxWidth, Graphics.boxHeight);
    this._background.endFill();
    this.addChild(this._background);
    
    // Create game field
    this._bulletHellField = new PIXI.Graphics();
    this._bulletHellField.beginFill(0x000000, 0);
    this._bulletHellField.drawRect(0, 0, Graphics.boxWidth, Graphics.boxHeight);
    this._bulletHellField.endFill();
    this._bulletHellField.y = 0;
    this.addChild(this._bulletHellField);
    
    // Create player ship, bullets, damage counter
    this.createPlayerShip();
    this.createBullets();
    this.createDamageCounter();
    
    // Set up state variables
    this._frames = 0;
    this._playerBulletTimer = 0;
    this._enemyBulletTimer = 0;
    this._totalDamageDealt = 0;
    this._fadeEffects = [];
    this._lastInputDirection = { x: 0, y: 0 };
    
    // Create collision hitboxes
    this.createCollisionAreas();
    
    // Setup input controls
    this.setupControls();
    
    // Pattern change timer based on enemy luck
    this._patternChangeTime = Math.floor(180 / this._difficultyFactor);
}

createPlayerShip() {
    if (this._params.playerImage) {
        this._playerShip = new Sprite();
        this._playerShip.bitmap = ImageManager.loadPicture(this._params.playerImage);
        this._playerShip.bitmap.addLoadListener(() => {
            this._playerShip.scale.x = 0.5;
            this._playerShip.scale.y = 0.5;
            this._playerShip.anchor.x = 0.5;
            this._playerShip.anchor.y = 0.5;
        });
    } else {
        this._playerShip = new Sprite(new Bitmap(30, 30));
        this._playerShip.bitmap.fillAll("white");
        this._playerShip.anchor.x = 0.5;
        this._playerShip.anchor.y = 0.5;
    }
    
    this._playerShip.x = Graphics.boxWidth / 2;
    this._playerShip.y = Graphics.boxHeight * 0.7;
    this.addChild(this._playerShip);
    
    // Create health percentage display
    this._healthDisplay = new Sprite(new Bitmap(60, 20));
    this._healthDisplay.anchor.x = 0.5;
    this._healthDisplay.anchor.y = 0.5;
    this._healthDisplay.y = -30; // Position above ship
    this._playerShip.addChild(this._healthDisplay);
    
    // Update health display initially
    this.updateHealthDisplay();
}

createBullets() {
    this._playerBullets = [];
    this._enemyBullets = [];
}

createCollisionAreas() {
    this._playerHitbox = { radius: 8 };
    
    const enemyWidth = this._enemySprite.width * 0.8;
    const enemyHeight = this._enemySprite.height * 0.6;
    
    this._enemyHitbox = {
        x: this._enemySprite.x,
        y: this._enemySprite.y - 200,  // Offset to position hitbox correctly
        width: enemyWidth,
        height: enemyHeight
    };
}

setupControls() {
    this._inputDirection = { x: 0, y: 0 };
    this._isShooting = false;
}

update() {
    this._frames++;
    
    this.updateInput();
    this.updatePlayerShip();
    this.updateEnemyMovement();
    this.updateBullets();
    this.updateHealthDisplay(); // Update health display each frame
    
    // Use enemy luck to determine bullet spawning frequency
    if (this._frames % Math.max(1, Math.floor(6 / this._difficultyFactor)) === 0) {
        this.spawnEnemyBullets();
    }
    
    this.checkCollisions();
    this.updateFadeEffects();
}

updateInput() {
    this._lastInputDirection = { 
        x: this._inputDirection.x, 
        y: this._inputDirection.y 
    };
    
    this._inputDirection.x = 0;
    this._inputDirection.y = 0;
    
    if (Input.isPressed("left")) { this._inputDirection.x -= 1; }
    if (Input.isPressed("right")) { this._inputDirection.x += 1; }
    if (Input.isPressed("up")) { this._inputDirection.y -= 1; }
    if (Input.isPressed("down")) { this._inputDirection.y += 1; }
    
    this._isShooting = Input.isPressed("ok") || Input.isPressed("space");
}

updatePlayerShip() {
    // Apply speed multipliers
    const speed = this._params.playerSpeed * 
        playerSpeedMultiplier * 
        defaultSpeedMultiplier;
        
    this._playerShip.x += this._inputDirection.x * speed;
    this._playerShip.y += this._inputDirection.y * speed;
    
    // Keep player in bounds
    const maxY = Graphics.boxHeight;
    this._playerShip.x = Math.max(20, Math.min(Graphics.boxWidth - 20, this._playerShip.x));
    this._playerShip.y = Math.max(20, Math.min(maxY - 20, this._playerShip.y));
    
    // Shoot if ready
    if (this._isShooting && this._playerBulletTimer <= 0) {
        this.createPlayerBullet();
        this._playerBulletTimer = 10;
    }
    
    if (this._playerBulletTimer > 0) {
        this._playerBulletTimer--;
    }
}

createPlayerBullet() {
    // Create bullet sprite
    const bullet = new PIXI.Graphics();
    bullet.beginFill(0x00FFFF);
    bullet.drawRect(-2, -8, 4, 16);
    bullet.endFill();
    bullet.x = this._playerShip.x;
    bullet.y = this._playerShip.y - 15;
    this.addChild(bullet);
    
    // Create bullet trail
    const trail = new PIXI.Graphics();
    trail.beginFill(0x88FF, 0.5);
    trail.drawRect(-1, -20, 2, 20);
    trail.endFill();
    trail.x = bullet.x;
    trail.y = bullet.y + 8;
    this.addChild(trail);
    
    // Apply slight sway based on movement
    const sway = { 
        x: this._inputDirection.x * 0.2, 
        y: 0 
    };
    
    // Extra sway for quick direction changes
    if (this._lastInputDirection.x !== this._inputDirection.x) {
        sway.x *= 2;
    }
    
    // Add to bullets array with speed adjusted by multiplier
    this._playerBullets.push({
        sprite: bullet,
        trail: trail,
        speed: 10 * bulletSpeedMultiplier * defaultSpeedMultiplier,
        sway: sway,
        bounceCount: 0,
        maxBounces: 2
    });
}

spawnEnemyBullets() {
    if (this._enemyBulletTimer <= 0) {
        // Pattern selection influenced by enemy luck and time
        const basePattern = Math.floor(this._frames / this._patternChangeTime) % 6;
        let pattern = basePattern;
        
        // Higher luck enemies can use more advanced patterns earlier
        if (useLuckForDifficulty && this._enemyLuck > 40) {
            // Add possibility of using more advanced patterns
            if (Math.random() < (this._enemyLuck - 40) / 60) {
                pattern = Math.floor(Math.random() * 6);
            }
        }
        
        switch (pattern) {
            case 0: this.createCirclePattern(); break;
            case 1: this.createSpreadPattern(); break;
            case 2: this.createSpiralPattern(); break;
            case 3: this.createWavePattern(); break;
            case 4: this.createRainPattern(); break;
            case 5: this.createBurstPattern(); break;
        }
        
        // Set timer for next pattern, faster for high-luck enemies
        switch (pattern) {
            case 2: this._enemyBulletTimer = 10 / this._difficultyFactor; break;
            case 4: this._enemyBulletTimer = 20 / this._difficultyFactor; break;
            default: this._enemyBulletTimer = 30 / this._difficultyFactor; break;
        }
    }
    
    // Handle multiple patterns for enemies with luck > 10
    if (this._useMultiplePatterns) {
        this._secondaryPatternTimer--;
        
        if (this._secondaryPatternTimer <= 0) {
            // Choose a different pattern than the main one
            let secondaryPattern;
            do {
                secondaryPattern = Math.floor(Math.random() * 6);
            } while (secondaryPattern === Math.floor(this._frames / this._patternChangeTime) % 6);
            
            // Create a toned-down version of the secondary pattern
            const originalMultiplier = this._bulletQuantityMultiplier;
            this._bulletQuantityMultiplier = Math.max(1.0, originalMultiplier * 0.6);
            
            switch (secondaryPattern) {
                case 0: this.createCirclePattern(true); break;
                case 1: this.createSpreadPattern(true); break;
                case 2: this.createSpiralPattern(true); break;
                case 3: this.createWavePattern(true); break;
                case 4: this.createRainPattern(true); break;
                case 5: this.createBurstPattern(true); break;
            }
            
            // Restore original multiplier
            this._bulletQuantityMultiplier = originalMultiplier;
            
            // Reset secondary pattern timer
            this._secondaryPatternTimer = this._secondaryPatternInterval;
        }
    }
    
    if (this._enemyBulletTimer > 0) {
        this._enemyBulletTimer--;
    }
}

createCirclePattern(isSecondary = false) {
    const center = { 
        x: this._enemySprite.x, 
        y: this._enemySprite.y 
    };
    
    // Number of bullets affected by enemy luck - touhou level for all difficulties
    const baseBulletCount = 24 + Math.floor(this._difficultyFactor * 8);
    const bulletCount = Math.floor(baseBulletCount * this._bulletQuantityMultiplier);
    
    // Calculate speed based on difficulty
    let speedMultiplier = this._difficultyFactor;
    if (isSecondary) {
        speedMultiplier *= 0.8; // Secondary patterns are slightly slower
    }
    
    for (let i = 0; i < bulletCount; i++) {
        const angle = (Math.PI * 2 / bulletCount) * i;
        const speed = 3 * bulletSpeedMultiplier * defaultSpeedMultiplier * speedMultiplier;
        this.createEnemyBullet(
            center.x, 
            center.y, 
            Math.cos(angle) * speed, 
            Math.sin(angle) * speed,
            isSecondary
        );
    }
}

createSpreadPattern(isSecondary = false) {
    const center = { 
        x: this._enemySprite.x, 
        y: this._enemySprite.y 
    };
    
    // Calculate angle to player
    const angleToPlayer = Math.atan2(
        this._playerShip.y - center.y,
        this._playerShip.x - center.x
    );
    
    // Spread angle affected by enemy luck
    const spreadAngle = Math.PI / 4 * (2 - this._difficultyFactor * 0.5);
    const baseBulletCount = 15 + Math.floor(this._difficultyFactor * 5);
    const bulletCount = Math.floor(baseBulletCount * this._bulletQuantityMultiplier);
    
    // Calculate speed based on difficulty
    let speedMultiplier = this._difficultyFactor;
    if (isSecondary) {
        speedMultiplier *= 0.8; // Secondary patterns are slightly slower
    }
    
    for (let i = 0; i < bulletCount; i++) {
        const angle = angleToPlayer - spreadAngle + (spreadAngle * 2 / (bulletCount - 1)) * i;
        const speed = 4 * bulletSpeedMultiplier * defaultSpeedMultiplier * speedMultiplier;
        
        this.createEnemyBullet(
            center.x, 
            center.y, 
            Math.cos(angle) * speed, 
            Math.sin(angle) * speed,
            isSecondary
        );
    }
}

createEnemyBullet(x, y, vx, vy) {
    let bulletSprite;
    
    // Make all enemy projectiles white regardless of pattern
    bulletSprite = new PIXI.Graphics();
    bulletSprite.beginFill(0xFFFFFF); // White color for all bullets
    
    // Different bullet shapes based on current pattern
    switch (Math.floor(this._frames / this._patternChangeTime) % 6) {
        case 0:
        default:
            bulletSprite.drawCircle(0, 0, 6);
            break;
            
        case 1:
            bulletSprite.moveTo(0, -8);
            bulletSprite.lineTo(7, 8);
            bulletSprite.lineTo(-7, 8);
            bulletSprite.lineTo(0, -8);
            break;
            
        case 2:
            bulletSprite.drawCircle(0, 0, 4);
            break;
            
        case 3:
            bulletSprite.moveTo(0, -7);
            bulletSprite.lineTo(7, 0);
            bulletSprite.lineTo(0, 7);
            bulletSprite.lineTo(-7, 0);
            bulletSprite.lineTo(0, -7);
            break;
            
        case 4:
            bulletSprite.moveTo(0, -8);
            bulletSprite.lineTo(5, 0);
            bulletSprite.lineTo(0, 8);
            bulletSprite.lineTo(-5, 0);
            bulletSprite.lineTo(0, -8);
            break;
            
        case 5:
            const starPoints = 5;
            const outerRadius = 7;
            const innerRadius = 3;
            
            for (let i = 0; i < starPoints * 2; i++) {
                const radius = i % 2 === 0 ? outerRadius : innerRadius;
                const angle = (Math.PI * i) / starPoints;
                const px = Math.cos(angle) * radius;
                const py = Math.sin(angle) * radius;
                
                if (i === 0) {
                    bulletSprite.moveTo(px, py);
                } else {
                    bulletSprite.lineTo(px, py);
                }
            }
            break;
    }
    
    bulletSprite.endFill();
    bulletSprite.x = x;
    bulletSprite.y = y;
    this.addChild(bulletSprite);
    
    // Make enemy projectiles slightly slower (0.8 multiplier)
    this._enemyBullets.push({
        sprite: bulletSprite,
        vx: vx * 0.8,
        vy: vy * 0.8
    });
}
updateHealthDisplay() {
    if (!this._healthDisplay || !this._player) return;
    
    // Calculate health percentage
    const healthPercentage = Math.max(0, Math.min(100, Math.floor((this._player.hp / this._player.mhp) * 100)));
    
    // Clear the bitmap
    this._healthDisplay.bitmap.clear();
    
    // Determine color based on health percentage
    let color = this.getHealthColor(healthPercentage);
    
    // Draw the health percentage text
    this._healthDisplay.bitmap.fontSize = 16;
    this._healthDisplay.bitmap.textColor = color;
    this._healthDisplay.bitmap.outlineColor = "rgba(0, 0, 0, 0.8)";
    this._healthDisplay.bitmap.outlineWidth = 4;
    this._healthDisplay.bitmap.drawText(healthPercentage + "%", 0, 0, 60, 20, "center");
}

updateBullets() {
    // Update player bullets
    for (let i = this._playerBullets.length - 1; i >= 0; i--) {
        const bullet = this._playerBullets[i];
        
        // Move bullet
        bullet.sprite.y -= bullet.speed;
        bullet.sprite.x += bullet.sway.x;
        
        if (bullet.trail) {
            bullet.trail.y -= bullet.speed;
            bullet.trail.x += bullet.sway.x;
        }
        
        // Handle wall bouncing
        const bounceBuffer = 5;
        if ((bullet.sprite.x <= bounceBuffer || bullet.sprite.x >= Graphics.boxWidth - bounceBuffer) && 
            bullet.bounceCount < bullet.maxBounces) {
            
            // Reverse horizontal movement and count bounce
            bullet.sway.x *= -1.2;
            bullet.bounceCount++;
            
            // Create bounce effect
            const bounceEffect = new PIXI.Graphics();
            bounceEffect.beginFill(0xFFFFFF, 0.7);
            bounceEffect.drawCircle(0, 0, 5);
            bounceEffect.endFill();
            bounceEffect.x = bullet.sprite.x;
            bounceEffect.y = bullet.sprite.y;
            this.addChild(bounceEffect);
            
            this._fadeEffects.push({
                sprite: bounceEffect,
                type: "explosion",
                duration: 8,
                timer: 0,
                initialScale: 0.5
            });
        }
        
        // Remove if off-screen
        if (bullet.sprite.y < -20 || bullet.sprite.y > Graphics.boxHeight + 20) {
            this.removeChild(bullet.sprite);
            if (bullet.trail) {
                this.removeChild(bullet.trail);
            }
            this._playerBullets.splice(i, 1);
        }
    }
    
    // Update enemy bullets
    for (let i = this._enemyBullets.length - 1; i >= 0; i--) {
        const bullet = this._enemyBullets[i];
        
        // Move bullet
        bullet.sprite.x += bullet.vx;
        bullet.sprite.y += bullet.vy;
        
        // Remove if off-screen
        if (bullet.sprite.y < -20 || 
            bullet.sprite.y > Graphics.boxHeight + 20 || 
            bullet.sprite.x < -20 || 
            bullet.sprite.x > Graphics.boxWidth + 20) {
            
            this.removeChild(bullet.sprite);
            this._enemyBullets.splice(i, 1);
        }
    }
}
createEnemyBullet(x, y, vx, vy, isSecondary = false) {
    let bulletSprite;
    
    // Make all enemy projectiles white regardless of pattern
    bulletSprite = new PIXI.Graphics();
    
    // Secondary pattern bullets can have slight transparency to distinguish them
    const bulletAlpha = isSecondary ? 0.85 : 1.0;
    bulletSprite.beginFill(0xFFFFFF, bulletAlpha); // White color for all bullets
    
    // Different bullet shapes based on current pattern
    switch (Math.floor(this._frames / this._patternChangeTime) % 6) {
        case 0:
        default:
            bulletSprite.drawCircle(0, 0, 6);
            break;
            
        case 1:
            bulletSprite.moveTo(0, -8);
            bulletSprite.lineTo(7, 8);
            bulletSprite.lineTo(-7, 8);
            bulletSprite.lineTo(0, -8);
            break;
            
        case 2:
            bulletSprite.drawCircle(0, 0, 4);
            break;
            
        case 3:
            bulletSprite.moveTo(0, -7);
            bulletSprite.lineTo(7, 0);
            bulletSprite.lineTo(0, 7);
            bulletSprite.lineTo(-7, 0);
            bulletSprite.lineTo(0, -7);
            break;
            
        case 4:
            bulletSprite.moveTo(0, -8);
            bulletSprite.lineTo(5, 0);
            bulletSprite.lineTo(0, 8);
            bulletSprite.lineTo(-5, 0);
            bulletSprite.lineTo(0, -8);
            break;
            
        case 5:
            const starPoints = 5;
            const outerRadius = 7;
            const innerRadius = 3;
            
            for (let i = 0; i < starPoints * 2; i++) {
                const radius = i % 2 === 0 ? outerRadius : innerRadius;
                const angle = (Math.PI * i) / starPoints;
                const px = Math.cos(angle) * radius;
                const py = Math.sin(angle) * radius;
                
                if (i === 0) {
                    bulletSprite.moveTo(px, py);
                } else {
                    bulletSprite.lineTo(px, py);
                }
            }
            break;
    }
    
    bulletSprite.endFill();
    bulletSprite.x = x;
    bulletSprite.y = y;
    this.addChild(bulletSprite);
    
    // Apply a slight size variation for secondary patterns
    if (isSecondary) {
        bulletSprite.scale.x = 0.9;
        bulletSprite.scale.y = 0.9;
    }
    
    // Make enemy projectiles slightly slower (0.8 multiplier)
    // Secondary pattern bullets can move slightly faster
    const secondarySpeedMod = isSecondary ? 1.1 : 1.0;
    
    this._enemyBullets.push({
        sprite: bulletSprite,
        vx: vx * 0.8 * secondarySpeedMod,
        vy: vy * 0.8 * secondarySpeedMod,
        isSecondary: isSecondary
    });
}
checkCollisions() {
    // If enemy is defeated, end the sequence
    if (this._enemy.hp <= 0) {
        BattleManager.endBulletHell();
        return;
    }
    
    // Check enemy bullets colliding with player
    for (let i = this._enemyBullets.length - 1; i >= 0; i--) {
        const bullet = this._enemyBullets[i];
        
        // Distance between bullet and player
        const dx = bullet.sprite.x - this._playerShip.x;
        const dy = bullet.sprite.y - this._playerShip.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        // Collision with player
        if (distance < this._playerHitbox.radius + 6) {
            this.removeChild(bullet.sprite);
            this._enemyBullets.splice(i, 1);
            this.playerHit();
            continue;
        }
        
        // Check for bullet-on-bullet collisions
        let destroyed = false;
        for (let j = this._playerBullets.length - 1; j >= 0; j--) {
            const playerBullet = this._playerBullets[j];
            
            // Distance between bullets
            const bdx = playerBullet.sprite.x - bullet.sprite.x;
            const bdy = playerBullet.sprite.y - bullet.sprite.y;
            const bulletDistance = Math.sqrt(bdx * bdx + bdy * bdy);
            
            // Collision between bullets
            if (bulletDistance < 14) {
                // Create collision effects
                this.createExplosion(bullet.sprite.x, bullet.sprite.y, 0.5);
                this.createGreekLetter(bullet.sprite.x, bullet.sprite.y);
                
                // Play sound effect
                if (this._params.bulletCollisionSE) {
                    AudioManager.playSe({
                        name: this._params.bulletCollisionSE,
                        volume: 90,
                        pitch: 100,
                        pan: 0
                    });
                }
                
                // Remove both bullets
                this.removeChild(bullet.sprite);
                this._enemyBullets.splice(i, 1);
                
                this.removeChild(playerBullet.sprite);
                if (playerBullet.trail) {
                    this.removeChild(playerBullet.trail);
                }
                this._playerBullets.splice(j, 1);
                
                destroyed = true;
                break;
            }
        }
        
        if (destroyed) continue;
    }
    
    // Check player bullets hitting enemy
    for (let i = this._playerBullets.length - 1; i >= 0; i--) {
        const bullet = this._playerBullets[i];
        
        // Check if bullet is within enemy hitbox
        if (bullet.sprite.x > this._enemyHitbox.x - this._enemyHitbox.width/2 && 
            bullet.sprite.x < this._enemyHitbox.x + this._enemyHitbox.width/2 && 
            bullet.sprite.y > this._enemyHitbox.y - this._enemyHitbox.height/2 && 
            bullet.sprite.y < this._enemyHitbox.y + this._enemyHitbox.height/2) {
            
            // Apply glow effect to bullet on hit
            const filter = new PIXI.filters.ColorMatrixFilter();
            filter.matrix = [
                1.5, 0, 0, 0, 0.5,
                0, 0.1, 0, 0, 0,
                0, 0, 0.1, 0, 0,
                0, 0, 0, 1, 0
            ];
            
            bullet.sprite.filters = [filter];
            if (bullet.trail) {
                bullet.trail.filters = [filter];
            }
            
            // Add to fade effects
            this._fadeEffects.push({
                sprite: bullet.sprite,
                trail: bullet.trail,
                type: "laser",
                duration: 24,
                speed: bullet.speed,
                sway: bullet.sway,
                allowBounce: true
            });
            
            // Remove from active bullets
            this._playerBullets.splice(i, 1);
            
            // Apply damage
            this.enemyHit();
            
            // End sequence if enemy defeated
            if (this._enemy.hp <= 0) {
                BattleManager.endBulletHell();
                return;
            }
        }
    }
}

playerHit() {
    // Visual effect - make player blink
    this._playerShip.filters = [this.createBlinkFilter()];
    setTimeout(() => {
        this._playerShip.filters = null;
    }, 200);
    
    // Calculate damage based on enemy's psychic attack vs player's psychic defense
    let damage = this._params.enemyBulletDamage;
    
    if (useLuckForDamage) {
        // Enemy psychic attack vs player psychic defense
        const attackPower = 50 + this._enemyLuck;
        const defensePower = 50 + this._playerLuck;
        
        // Ratio with soft caps
        const psiRatio = Math.pow(attackPower / defensePower, 0.8);
        
        damage = Math.round(damage * psiRatio);
        
        // Cap damage at 8% max HP to prevent excessive damage
        damage = Math.min(damage, Math.floor(this._player.mhp * 0.08));
    }
    
    // Minimum 1% of max HP
    damage = Math.max(Math.floor(this._player.mhp * 0.01), damage);
    
    this._player.gainHp(-damage);
    
    // Check if player is defeated
    if (this._player.hp <= 0) {
        BattleManager.endBulletHell();
        return;
    }
    
    // Update health display immediately after taking damage
    this.updateHealthDisplay();
    
    // Create damage popup on actor sprite if possible
    if (SceneManager._scene._spriteset) {
        const actorSprites = SceneManager._scene._spriteset._actorSprites;
        if (actorSprites && actorSprites.length > 0) {
            for (let i = 0; i < actorSprites.length; i++) {
                if (actorSprites[i] && actorSprites[i]._battler === this._player) {
                    actorSprites[i].startDamagePopup();
                    break;
                }
            }
        }
    }
}
enemyHit() {
    // Visual effect - make enemy blink
    this._enemySprite.filters = [this.createBlinkFilter()];
    setTimeout(() => {
        this._enemySprite.filters = null;
    }, 200);
    
    // Calculate PSI damage
    let damage = this._params.bulletDamage;
    
    if (useLuckForDamage) {
        // Level-based power (sqrt scaling for smoother growth)
        // Level 1 = 1.0x, Level 25 = 2.5x, Level 50 = 3.5x, Level 99 = 5.0x
        const levelPower = 1 + (Math.sqrt(this._player.level) * 0.4);
        
        // PSI attack vs defense (diminishing returns on both ends)
        const attackPower = 50 + this._playerLuck;
        const defensePower = 50 + this._enemyLuck;
        
        // Ratio with soft caps: ranges from ~0.4x to ~2.0x
        const psiRatio = Math.pow(attackPower / defensePower, 0.8);
        
        // Combine multipliers
        damage = Math.round(damage * levelPower * psiRatio);
        
        // Ensure minimum damage based on level (always feel progression)
        const minDamage = Math.max(1, Math.floor(this._player.level * 0.5));
        damage = Math.max(minDamage, damage);
    }
    
    // Apply damage to enemy
    this._enemy.gainHp(-damage);
    
    // Play random hit sound
    const hitSounds = [
        this._params.enemyHitSE,
        this._params.enemyHitSE2,
        this._params.enemyHitSE3
    ].filter(sound => sound);
    
    if (hitSounds.length > 0) {
        const sound = hitSounds[Math.floor(Math.random() * hitSounds.length)];
        AudioManager.playSe({
            name: sound,
            volume: 90,
            pitch: 100,
            pan: 0
        });
    }
    
    // Update damage counter
    this._totalDamageDealt += damage;
    this.updateDamageCounter();
}


createBlinkFilter() {
    const filter = new PIXI.filters.ColorMatrixFilter();
    filter.brightness(1.5, false);
    return filter;
}
getHealthColor(percentage) {
    // Green (0x00FF00) for 100% health
    // Yellow (0xFFFF00) for 50% health
    // Red (0xFF0000) for 0% health
    if (percentage >= 75) {
        return "#00FF00"; // Green
    } else if (percentage >= 50) {
        return "#88FF00"; // Green-Yellow
    } else if (percentage >= 25) {
        return "#FFFF00"; // Yellow
    } else if (percentage >= 10) {
        return "#FF8800"; // Orange
    } else {
        return "#FF0000"; // Red
    }
}    

createSpiralPattern(isSecondary = false) {
    const center = { 
        x: this._enemySprite.x, 
        y: this._enemySprite.y 
    };
    
    // Spiral angle dependent on time - low difficulty makes more predictable spirals
    const spiralAngle = this._frames * 0.05 * this._difficultyFactor;
    
    // Number of bullets increases with enemy luck - touhou level for all difficulties
    const baseBulletCount = 30 + Math.floor(this._difficultyFactor * 10);
    const bulletCount = Math.floor(baseBulletCount * this._bulletQuantityMultiplier);
    
    // Calculate speed based on difficulty
    let speedMultiplier = this._difficultyFactor;
    if (isSecondary) {
        speedMultiplier *= 0.8; // Secondary patterns are slightly slower
    }
    
    // For multi-arm spirals in higher difficulties
    const armCount = Math.min(1 + Math.floor(this._difficultyFactor * 2), 5);
    
    for (let arm = 0; arm < armCount; arm++) {
        const armOffset = (Math.PI * 2 / armCount) * arm;
        
        for (let i = 0; i < bulletCount / armCount; i++) {
            const angle = spiralAngle + (Math.PI * 2 / (bulletCount / armCount)) * i + armOffset;
            const speed = 2.5 * bulletSpeedMultiplier * defaultSpeedMultiplier * speedMultiplier;
            
            this.createEnemyBullet(
                center.x, 
                center.y, 
                Math.cos(angle) * speed, 
                Math.sin(angle) * speed,
                isSecondary
            );
        }
    }
}

createWavePattern(isSecondary = false) {
    const center = { 
        x: this._enemySprite.x, 
        y: this._enemySprite.y 
    };
    
    // Number of bullets increases with enemy luck - touhou level for all difficulties
    const baseBulletCount = 20 + Math.floor(this._difficultyFactor * 10);
    const bulletCount = Math.floor(baseBulletCount * this._bulletQuantityMultiplier);
    
    // Calculate speed based on difficulty
    let speedMultiplier = this._difficultyFactor;
    if (isSecondary) {
        speedMultiplier *= 0.8; // Secondary patterns are slightly slower
    }
    
    // Higher difficulties have more chaotic waves with multiple frequencies
    const waveFactor = 0.3 * this._difficultyFactor;
    const waveSpeed = 0.2 * this._difficultyFactor;
    
    // Multiple wave layers for higher difficulties
    const waveCount = Math.min(1 + Math.floor(this._difficultyFactor), 3);
    
    for (let wave = 0; wave < waveCount; wave++) {
        const waveOffset = (Math.PI / waveCount) * wave;
        
        for (let i = 0; i < bulletCount / waveCount; i++) {
            // Wave pattern with sine function - more chaotic at higher difficulties
            const angle = (Math.PI / ((bulletCount / waveCount) - 1)) * i - Math.PI/2 + 
                Math.sin(this._frames * waveSpeed + i * 0.1) * waveFactor + waveOffset;
                
            const speed = 3 * bulletSpeedMultiplier * defaultSpeedMultiplier * speedMultiplier;
            
            this.createEnemyBullet(
                center.x, 
                center.y, 
                Math.cos(angle) * speed, 
                Math.sin(angle) * speed,
                isSecondary
            );
        }
    }
}

createRainPattern(isSecondary = false) {
    // Divide width into segments - touhou level for all difficulties
    const baseDivisions = 16 + Math.floor(this._difficultyFactor * 8);
    const divisions = Math.floor(baseDivisions * Math.sqrt(this._bulletQuantityMultiplier));
    const segmentWidth = Graphics.boxWidth / divisions;
    
    // Calculate speed based on difficulty
    let speedMultiplier = this._difficultyFactor;
    if (isSecondary) {
        speedMultiplier *= 0.8; // Secondary patterns are slightly slower
    }
    
    // Low difficulties: regular timing, regular spacing
    // High difficulties: irregular timing, irregular spacing
    for (let i = 0; i < divisions; i++) {
        // Skip some columns randomly at higher difficulties to create gaps
        if (this._difficultyFactor > 1.0 && Math.random() < 0.2) {
            continue;
        }
        
        // Irregular spacing at higher difficulties
        const irregularity = Math.random() * this._difficultyFactor * 0.5;
        
        // Position with sine wave variation
        const xPos = segmentWidth * (i + irregularity) + 
            Math.sin(this._frames * 0.05 + i) * 30 * this._difficultyFactor;
            
        const yPos = -10;
        
        // Varying speeds - higher difficulties have more speed variation
        const speedVariation = (0.5 + Math.random()) * 
            bulletSpeedMultiplier * 
            defaultSpeedMultiplier * 
            speedMultiplier;
            
        this.createEnemyBullet(xPos, yPos, 0, speedVariation, isSecondary);
        
        // At higher difficulties, add additional offset bullets
        if (this._difficultyFactor >= 1.3 && Math.random() < this._difficultyFactor * 0.3) {
            const offsetX = xPos + (Math.random() - 0.5) * segmentWidth;
            this.createEnemyBullet(offsetX, yPos, 0, speedVariation * 1.2, isSecondary);
        }
    }
}

createBurstPattern(isSecondary = false) {
    const centerX = this._enemySprite.x;
    const centerY = this._enemySprite.y;
    
    // Number of bullets increases with enemy luck - touhou level for all difficulties
    const baseBulletCount = 30 + Math.floor(this._difficultyFactor * 15);
    const bulletCount = Math.floor(baseBulletCount * this._bulletQuantityMultiplier);
    
    // Calculate speed based on difficulty
    let speedMultiplier = this._difficultyFactor;
    if (isSecondary) {
        speedMultiplier *= 0.8; // Secondary patterns are slightly slower
    }
    
    // For multi-layer bursts in higher difficulties
    const layerCount = Math.min(1 + Math.floor(this._difficultyFactor), 3);
    
    for (let layer = 0; layer < layerCount; layer++) {
        const layerRadius = 30 + (layer * 20);
        const layerSpeed = speedMultiplier * (1 + (layer * 0.3));
        const layerOffset = (Math.PI / layerCount) * layer;
        
        for (let i = 0; i < bulletCount / layerCount; i++) {
            const angle = (Math.PI * 2 / (bulletCount / layerCount)) * i + layerOffset;
            const speed = 4 * bulletSpeedMultiplier * defaultSpeedMultiplier * layerSpeed;
            
            // Higher difficulties introduce some angle randomization
            const angleJitter = this._difficultyFactor > 1.0 ? 
                (Math.random() - 0.5) * 0.2 * this._difficultyFactor : 0;
            
            // Bullets emerge from circles around the enemy
            const startX = centerX + Math.cos(angle) * layerRadius;
            const startY = centerY + Math.sin(angle) * layerRadius;
            
            this.createEnemyBullet(
                startX, 
                startY, 
                Math.cos(angle + angleJitter) * speed, 
                Math.sin(angle + angleJitter) * speed,
                isSecondary
            );
        }
    }
}

createGreekLetter(x, y) {
    // Array of Greek letters for visual effect
    const greekLetters = [
        "α", "β", "γ", "δ", "ε", "ζ", "η", "θ", "ι", "κ", "λ", "μ", 
        "ν", "ξ", "π", "ρ", "σ", "τ", "φ", "χ", "ψ", "ω"
    ];
    
    // Pick a random letter
    const letter = greekLetters[Math.floor(Math.random() * greekLetters.length)];
    
    // Create text sprite
    const textSprite = new Sprite(new Bitmap(32, 32));
    textSprite.bitmap.fontSize = 24;
    textSprite.bitmap.fontFace = "Arial";
    textSprite.bitmap.textColor = "#000000";
    textSprite.bitmap.drawText(letter, 0, 0, 32, 32, "center");
    
    textSprite.x = x;
    textSprite.y = y;
    textSprite.anchor.x = 0.5;
    textSprite.anchor.y = 0.5;
    textSprite.alpha = 1;
    textSprite.scale.x = 1;
    textSprite.scale.y = 1;
    
    this.addChild(textSprite);
    
    // Add to fade effects
    this._fadeEffects.push({
        sprite: textSprite,
        type: "greekLetter",
        duration: 60,
        timer: 0
    });
    
    return textSprite;
}

createExplosion(x, y, scale = 1) {
    // Create explosion visual
    const explosion = new PIXI.Graphics();
    explosion.beginFill(0xFFCC00);
    explosion.drawCircle(0, 0, 20 * scale);
    explosion.endFill();
    explosion.x = x;
    explosion.y = y;
    explosion.alpha = 1;
    
    this.addChild(explosion);
    
    // Add blur filter
    const blurFilter = new PIXI.filters.BlurFilter();
    blurFilter.blur = 4;
    explosion.filters = [blurFilter];
    
    // Add to fade effects
    this._fadeEffects.push({
        sprite: explosion,
        type: "explosion",
        duration: 15,
        timer: 0,
        initialScale: scale
    });
    
    return explosion;
}

updateFadeEffects() {
    for (let i = this._fadeEffects.length - 1; i >= 0; i--) {
        const effect = this._fadeEffects[i];
        effect.timer++;
        
        if (effect.type === "greekLetter") {
            if (effect.timer >= effect.duration) {
                this.removeChild(effect.sprite);
                this._fadeEffects.splice(i, 1);
            } else {
                // Fade out over time
                effect.sprite.alpha = 1 - (effect.timer / effect.duration);
            }
        }
        else if (effect.type === "explosion") {
            if (effect.timer >= effect.duration) {
                this.removeChild(effect.sprite);
                this._fadeEffects.splice(i, 1);
            } else {
                // Expand and fade out
                const progress = effect.timer / effect.duration;
                effect.sprite.alpha = 1 - progress;
                effect.sprite.scale.x = effect.initialScale * (1 + progress);
                effect.sprite.scale.y = effect.initialScale * (1 + progress);
            }
        }
        else if (effect.type === "laser") {
            if (effect.timer >= effect.duration) {
                this.removeChild(effect.sprite);
                if (effect.trail) {
                    this.removeChild(effect.trail);
                }
                this._fadeEffects.splice(i, 1);
            } else {
                // Continue moving
                effect.sprite.y -= effect.speed;
                if (effect.sway) {
                    effect.sprite.x += effect.sway.x;
                }
                
                if (effect.trail) {
                    effect.trail.y -= effect.speed;
                    if (effect.sway) {
                        effect.trail.x += effect.sway.x;
                    }
                }
                
                // Handle wall bouncing for laser fade effects
                if (effect.allowBounce) {
                    const bounceBuffer = 5;
                    if (effect.sprite.x <= bounceBuffer || effect.sprite.x >= Graphics.boxWidth - bounceBuffer) {
                        effect.sway.x *= -1.2;
                        
                        // Create bounce effect
                        const bounceEffect = new PIXI.Graphics();
                        bounceEffect.beginFill(0xFF3333, 0.7);
                        bounceEffect.drawCircle(0, 0, 5);
                        bounceEffect.endFill();
                        bounceEffect.x = effect.sprite.x;
                        bounceEffect.y = effect.sprite.y;
                        this.addChild(bounceEffect);
                        
                        this._fadeEffects.push({
                            sprite: bounceEffect,
                            type: "explosion",
                            duration: 8,
                            timer: 0,
                            initialScale: 0.5
                        });
                    }
                }
                
                // Start fading out after half duration
                if (effect.timer > effect.duration * 0.5) {
                    const fadeProgress = (effect.timer - effect.duration * 0.5) / (effect.duration * 0.5);
                    effect.sprite.alpha = 1 - fadeProgress;
                    if (effect.trail) {
                        effect.trail.alpha = 1 - fadeProgress;
                    }
                }
            }
        }
    }
}

getRandomMovementPattern() {
    const patterns = ["circle", "zigzag", "figure8", "random", "bounce"];
    
    // Higher luck enemies get more complex patterns
    if (this._difficultyFactor > 1.3) {
        // More likely to use figure8 and circle patterns
        const advancedPatterns = ["figure8", "circle", "zigzag", "bounce"];
        patterns.push(...advancedPatterns);
    }
    
    return patterns[Math.floor(Math.random() * patterns.length)];
}

updateEnemyMovement() {
    if (!this._enemySprite) return;
    
    const movement = this._enemyMovement;
    movement.timer++;
    
    // Change patterns more often with higher luck
    const patternDuration = Math.max(100, 180 / this._difficultyFactor);
    
    if (movement.timer >= movement.duration) {
        movement.pattern = this.getRandomMovementPattern();
        movement.timer = 0;
        movement.centerX = this._enemySprite.x;
        movement.centerY = this._enemySprite.y;
        movement.angle = 0;
        
        // Speed affected by enemy luck
        movement.speedX = (1 + Math.random() * 2) * 
            enemySpeedMultiplier * 
            defaultSpeedMultiplier * 
            this._difficultyFactor;
            
        movement.speedY = (1 + Math.random() * 1.5) * 
            enemySpeedMultiplier * 
            defaultSpeedMultiplier * 
            this._difficultyFactor;
            
        // Radius affected by enemy luck
        movement.radius = 60 + Math.random() * 60 * this._difficultyFactor;
    }
    
    // Calculate movement bounds
    const minX = this._enemySprite.width / 2;
    const maxX = Graphics.boxWidth - this._enemySprite.width / 2;
    const minY = this._enemySprite.height / 2;
    const maxY = Graphics.boxHeight / 2;  // Only top half of screen
    
    // Apply different movement patterns
    switch (movement.pattern) {
        case "circle":
            // Circular movement
            movement.angle += 0.02 * this._difficultyFactor;
            this._enemySprite.x = movement.centerX + Math.cos(movement.angle) * movement.radius;
            this._enemySprite.y = movement.centerY + Math.sin(movement.angle) * movement.radius * 0.6;
            break;
            
        case "zigzag":
            // Zigzag movement
            this._enemySprite.x += Math.cos(movement.timer * 0.1) * movement.speedX * 2;
            this._enemySprite.y += Math.sin(movement.timer * 0.2) * movement.speedY;
            break;
            
        case "figure8":
            // Figure-8 movement
            movement.angle += 0.02 * this._difficultyFactor;
            this._enemySprite.x = movement.centerX + Math.sin(movement.angle * 2) * movement.radius;
            this._enemySprite.y = movement.centerY + Math.sin(movement.angle) * movement.radius * 0.5;
            break;
            
        case "random":
            // Random target movement
            if (movement.timer % 30 === 0) {
                movement.targetX = minX + Math.random() * (maxX - minX);
                movement.targetY = minY + Math.random() * (maxY - minY);
            }
            
            if (movement.targetX && movement.targetY) {
                const dx = movement.targetX - this._enemySprite.x;
                const dy = movement.targetY - this._enemySprite.y;
                this._enemySprite.x += dx * 0.05;
                this._enemySprite.y += dy * 0.05;
            }
            break;
            
        case "bounce":
            // Bouncing movement
            if (!movement.vx) {
                movement.vx = movement.speedX * (Math.random() < 0.5 ? 1 : -1);
            }
            if (!movement.vy) {
                movement.vy = movement.speedY * (Math.random() < 0.5 ? 1 : -1);
            }
            
            this._enemySprite.x += movement.vx;
            this._enemySprite.y += movement.vy;
            
            // Bounce off edges
            if (this._enemySprite.x <= minX || this._enemySprite.x >= maxX) {
                movement.vx *= -1;
            }
            if (this._enemySprite.y <= minY || this._enemySprite.y >= maxY) {
                movement.vy *= -1;
            }
            break;
    }
    
    // Keep enemy within bounds
    this._enemySprite.x = Math.max(minX, Math.min(maxX, this._enemySprite.x));
    this._enemySprite.y = Math.max(minY, Math.min(maxY, this._enemySprite.y));
    
    // Update hitbox position
    this._enemyHitbox.x = this._enemySprite.x;
    this._enemyHitbox.y = this._enemySprite.y - 200; // Offset
    
    // Uncomment for debugging hitbox
    //this.updateHitboxVisualizer();
}
}

// Add function to store battle log messages
Game_Temp.prototype.addBattleLog = function(text) {
if (!this._battleLogMessages) {
    this._battleLogMessages = [];
}
this._battleLogMessages.push(text);
};

// Ensure safe access to battle log functionality
function safeBattleLog(text) {
if ($gameTemp) {
    $gameTemp.addBattleLog(text);
}
// Try to add text directly to log window if available
if (BattleManager._logWindow && BattleManager._logWindow.addText) {
    setTimeout(() => {
        BattleManager._logWindow.addText(text);
    }, 10);
}
}





})();
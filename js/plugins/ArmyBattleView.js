/*:
 * @plugindesc PIXI.js-powered field battle visualization for army combat
 * @author Omni-Lex
 * @target MZ
 *
 * @param battleWidth
 * @text Battle View Width
 * @type number
 * @default 1200
 * @desc Width of the battle view in pixels.
 *
 * @param battleHeight
 * @text Battle View Height
 * @type number
 * @default 800
 * @desc Height of the battle view in pixels.
 *
 * @param dotSize
 * @text Unit Dot Size
 * @type number
 * @default 4
 * @desc Size of each unit dot in pixels.
 *
 * @param advanceSpeed
 * @text Army Advance Speed
 * @type number
 * @decimals 2
 * @default 0.5
 * @desc Speed at which armies advance (pixels per frame).
 *
 * @param attackRange
 * @text Attack Range
 * @type number
 * @default 30
 * @desc Distance at which units can attack each other.
 *
 * @param injuryChance
 * @text Injury Chance
 * @type number
 * @min 0
 * @max 100
 * @default 50
 * @desc Percentage chance troop gets injured instead of dying (0-100).
 *
 * @command startBattle
 * @text Start Battle
 * @desc Starts a field battle against the AI army (auto-detects event from player interaction).
 *
 * @help
 * Army Battle View System
 *
 * This plugin provides a PIXI.js-powered tactical battle visualization
 * inspired by Total War and Mount & Blade.
 *
 * Features:
 * - Real-time tactical battle visualization
 * - Units represented as colored dots (yellow = player, red = enemy)
 * - Formation system based on unit roles (close quarters, support, ranged)
 * - Dynamic combat with units fighting based on their stats
 * - Living/injured troop counters
 * - Units can die (removed from party) or get injured (HP=1, can't fight)
 * - Visual feedback as troops fall in combat
 * - Zoom and pan controls for better battlefield view
 *
 * Controls:
 * - Mouse Wheel: Zoom in/out (30% - 300%)
 * - Drag: Pan the battlefield view
 *
 * Plugin Command:
 *   ArmyBattleView startBattle
 *     - Initiates battle against the AI army that triggered the event
 *     - Automatically detects the event ID from player interaction
 *
 * Usage in Events:
 *   When player touches an army event, simply call the startBattle command
 *   without any parameters - it will auto-detect the event ID.
 */

var Imported = Imported || {};
Imported.ArmyBattleView = true;

var ArmyBattleView = ArmyBattleView || {};
ArmyBattleView.Params = PluginManager.parameters("ArmyBattleView");

ArmyBattleView.Params.battleWidth = Number(ArmyBattleView.Params.battleWidth || 1200);
ArmyBattleView.Params.battleHeight = Number(ArmyBattleView.Params.battleHeight || 800);
ArmyBattleView.Params.dotSize = Number(ArmyBattleView.Params.dotSize || 4);
ArmyBattleView.Params.advanceSpeed = Number(ArmyBattleView.Params.advanceSpeed || 0.5);
ArmyBattleView.Params.attackRange = Number(ArmyBattleView.Params.attackRange || 30);
ArmyBattleView.Params.injuryChance = Number(ArmyBattleView.Params.injuryChance || 50);

//=============================================================================
// Plugin Commands
//=============================================================================

PluginManager.registerCommand("ArmyBattleView", "startBattle", args => {
  // Auto-detect event ID from the current interpreter
  let armyEventId = null;

  // Try to get event ID from the interpreter
  if ($gameMap._interpreter && $gameMap._interpreter._eventId) {
    armyEventId = $gameMap._interpreter._eventId;
  }

  // Fallback: Check if player is facing/touching an event
  if (!armyEventId) {
    const direction = $gamePlayer.direction();
    const x = $gameMap.roundXWithDirection($gamePlayer.x, direction);
    const y = $gameMap.roundYWithDirection($gamePlayer.y, direction);

    const events = $gameMap.eventsXy(x, y);
    if (events.length > 0) {
      armyEventId = events[0].eventId();
    }
  }

  // Fallback: Check for events at player's current position
  if (!armyEventId) {
    const events = $gameMap.eventsXy($gamePlayer.x, $gamePlayer.y);
    if (events.length > 0) {
      armyEventId = events[0].eventId();
    }
  }

  if (!armyEventId) {
    console.error("[ArmyBattleView] Could not auto-detect event ID. Make sure this command is called from an event.");
    return;
  }

  const enemyArmy = $gameAIArmies.getArmyByEventId(armyEventId);

  if (!enemyArmy) {
    console.error("[ArmyBattleView] No army found at event ID:", armyEventId);
    return;
  }

  console.log("[ArmyBattleView] Starting battle with army at event ID:", armyEventId);

  // Store enemy army for battle scene
  $gameTemp._battleEnemyArmy = enemyArmy;
  $gameTemp._battleArmyEventId = armyEventId;

  // Push battle scene
  SceneManager.push(Scene_ArmyBattle);
});

//=============================================================================
// Scene_ArmyBattle - Main battle scene
//=============================================================================

function Scene_ArmyBattle() {
  this.initialize(...arguments);
}

Scene_ArmyBattle.prototype = Object.create(Scene_Base.prototype);
Scene_ArmyBattle.prototype.constructor = Scene_ArmyBattle;

Scene_ArmyBattle.prototype.initialize = function() {
  Scene_Base.prototype.initialize.call(this);
  this._battleEnded = false;
  this._battleResult = null;
};

Scene_ArmyBattle.prototype.create = function() {
  Scene_Base.prototype.create.call(this);
  this.createBattleView();
};

Scene_ArmyBattle.prototype.createBattleView = function() {
  this._battleView = new ArmyBattleField();
  this.addChild(this._battleView);
  this._battleView.startBattle();
};

Scene_ArmyBattle.prototype.update = function() {
  Scene_Base.prototype.update.call(this);

  if (this._battleView && this._battleView.isBattleEnded()) {
    if (!this._battleEnded) {
      this._battleEnded = true;
      this._battleResult = this._battleView.getBattleResult();
      this.endBattle();
    }
  }
};

Scene_ArmyBattle.prototype.endBattle = function() {
  // Wait a moment before transitioning
  setTimeout(() => {
    if (this._battleResult === "victory") {
      // Player won - remove enemy army from map
      const eventId = $gameTemp._battleArmyEventId;
      const enemyArmy = $gameTemp._battleEnemyArmy;

      if (eventId) {
        const event = $gameMap.event(eventId);
        if (event) {
          event.erase();
        }
      }

      // Decrease reputation by 25 for defeating a faction army
      // Independent armies don't affect reputation
      if (enemyArmy && !enemyArmy.isIndependent() && $gameFactions) {
        const factionId = enemyArmy.getFactionId();
        if (factionId >= 0) {
          $gameFactions.changeReputation(factionId, -25);
        }
      }
    } else if (this._battleResult === "defeat") {
      // Player lost - game over or retreat
      // For now, just return to map
    }

    // Clean up temp data
    $gameTemp._battleEnemyArmy = null;
    $gameTemp._battleArmyEventId = null;

    // Return to map
    SceneManager.pop();
  }, 2000);
};

//=============================================================================
// ArmyBattleField - PIXI.js battle visualization
//=============================================================================

function ArmyBattleField() {
  this.initialize(...arguments);
}

ArmyBattleField.prototype = Object.create(PIXI.Container.prototype);
ArmyBattleField.prototype.constructor = ArmyBattleField;

ArmyBattleField.prototype.initialize = function() {
  PIXI.Container.call(this);

  // Calculate battlefield size based on troop counts
  this._calculateBattlefieldSize();

  this._setupBattlefield();
  this._battleEnded = false;
  this._battleResult = null;

  // Camera/viewport controls
  this._viewportX = 0;
  this._viewportY = 0;
  this._zoom = 1.0;
  this._minZoom = 0.3;
  this._maxZoom = 3.0;

  // Mouse/drag state
  this._mousePressed = false;
  this._dragStarted = false;
  this._lastTouchX = 0;
  this._lastTouchY = 0;
};

ArmyBattleField.prototype._calculateBattlefieldSize = function() {
  // Count total troops
  const playerTroopCount = $gameParty.members().length + $gameArmy.getTroopCount();
  const enemyArmy = $gameTemp._battleEnemyArmy;
  const enemyTroopCount = enemyArmy ? enemyArmy.getTroopCount() : 0;
  const totalTroops = playerTroopCount + enemyTroopCount;

  console.log(`[ArmyBattle] Total troops: ${totalTroops} (Player: ${playerTroopCount}, Enemy: ${enemyTroopCount})`);

  // Calculate dynamic battlefield size
  // Base size for small armies (< 50 troops)
  let width = 1200;
  let height = 800;

  // Scale up for larger armies
  if (totalTroops > 50) {
    // Add 10 width and 8 height per extra troop above 50
    const extraTroops = totalTroops - 50;
    width += Math.min(extraTroops * 10, 1800); // Cap at 3000 total width
    height += Math.min(extraTroops * 8, 1200); // Cap at 2000 total height
  }

  // Ensure minimum size
  width = Math.max(width, 1200);
  height = Math.max(height, 800);

  // Store dynamic sizes
  this._battleWidth = width;
  this._battleHeight = height;

  console.log(`[ArmyBattle] Battlefield size: ${width}x${height}`);
};

ArmyBattleField.prototype._getBiomeColor = function() {
  // Default color (dark green field)
  let defaultColor = 0x2d5016;

  try {
    // Get current biome name
    let biomeName = "Unknown";

    // Try to get biome from cache (for map 315 world map)
    if ($gameSystem && $gameSystem.getBiomeFromCache && $gamePlayer && $gameMap.mapId() === 315) {
      const playerX = $gameVariables.value(43);
      const playerY = $gameVariables.value(44);
      biomeName = $gameSystem.getBiomeFromCache(playerX, playerY);
    }

    // Fallback: get from proc gen data (for procedural maps)
    if ((!biomeName || biomeName === "Unknown") && $gameSystem && $gameSystem._procGenData) {
      biomeName = $gameSystem._procGenData.currentBiomeName || $gameSystem._procGenData.currentBiome;
    }

    // Simplify road biome names
    if (biomeName && biomeName.startsWith("Road ")) {
      biomeName = "Road";
    }

    console.log(`[ArmyBattle] Current biome: ${biomeName}`);

    // Look up biome in WorldGen database
    if (biomeName && biomeName !== "Unknown" && window.WorldGen && window.WorldGen.BIOMES) {
      const biome = window.WorldGen.BIOMES.find(b => b.name === biomeName);
      if (biome && biome.color) {
        // Convert hex color string to numeric (e.g., "#191970" -> 0x191970)
        const colorHex = biome.color.replace("#", "0x");
        const colorNum = parseInt(colorHex, 16);
        console.log(`[ArmyBattle] Using biome color: ${biome.color} (${colorNum})`);
        return colorNum;
      }
    }
  } catch (error) {
    console.warn("[ArmyBattle] Error getting biome color:", error);
  }

  console.log(`[ArmyBattle] Using default color`);
  return defaultColor;
};

ArmyBattleField.prototype._setupBattlefield = function() {
  const width = this._battleWidth;
  const height = this._battleHeight;

  // Center on screen
  this.x = (Graphics.width - width) / 2;
  this.y = (Graphics.height - height) / 2;

  // Create content container that will be zoomed/panned
  this._contentContainer = new PIXI.Container();
  this.addChild(this._contentContainer);

  // Background - use biome color
  const biomeColor = this._getBiomeColor();
  this._background = new PIXI.Graphics();
  this._background.beginFill(biomeColor);
  this._background.drawRect(0, 0, width, height);
  this._background.endFill();
  this._contentContainer.addChild(this._background);

  // Containers for units
  this._playerUnits = [];
  this._enemyUnits = [];

  // Containers for effects (projectiles, particles, etc.)
  this._projectiles = [];
  this._particles = [];
  this._effectsContainer = new PIXI.Container();
  this._contentContainer.addChild(this._effectsContainer);

  // UI container (stays fixed, not affected by zoom/pan)
  this._uiContainer = new PIXI.Container();
  this.addChild(this._uiContainer);

  // Counter text
  this._createCounterText();
};

ArmyBattleField.prototype._createCounterText = function() {
  const width = this._battleWidth;
  const height = this._battleHeight;

  // Player counter (bottom)
  this._playerCounterText = new PIXI.Text("", {
    fontFamily: "Arial",
    fontSize: 24,
    fill: 0xFFFF00, // Yellow
    stroke: 0x000000,
    strokeThickness: 4
  });
  this._playerCounterText.x = width / 2;
  this._playerCounterText.y = height - 40;
  this._playerCounterText.anchor.set(0.5);
  this._uiContainer.addChild(this._playerCounterText);

  // Enemy counter (top)
  this._enemyCounterText = new PIXI.Text("", {
    fontFamily: "Arial",
    fontSize: 24,
    fill: 0xFF0000, // Red
    stroke: 0x000000,
    strokeThickness: 4
  });
  this._enemyCounterText.x = width / 2;
  this._enemyCounterText.y = 40;
  this._enemyCounterText.anchor.set(0.5);
  this._uiContainer.addChild(this._enemyCounterText);

  // Battle result text (hidden initially)
  this._resultText = new PIXI.Text("", {
    fontFamily: "Arial",
    fontSize: 48,
    fill: 0xFFFFFF,
    stroke: 0x000000,
    strokeThickness: 6
  });
  this._resultText.x = width / 2;
  this._resultText.y = height / 2;
  this._resultText.anchor.set(0.5);
  this._resultText.visible = false;
  this._uiContainer.addChild(this._resultText);

  // Zoom indicator
  this._zoomText = new PIXI.Text("Zoom: 100%", {
    fontFamily: "Arial",
    fontSize: 16,
    fill: 0xFFFFFF,
    stroke: 0x000000,
    strokeThickness: 3
  });
  this._zoomText.x = 10;
  this._zoomText.y = 10;
  this._uiContainer.addChild(this._zoomText);

  // Controls help text
  this._controlsText = new PIXI.Text("Zoom: Wheel | Pan: Drag | Q/W/E: Abilities | TAB: Hide/Show Sidebar", {
    fontFamily: "Arial",
    fontSize: 14,
    fill: 0xCCCCCC,
    stroke: 0x000000,
    strokeThickness: 2
  });
  this._controlsText.x = 10;
  this._controlsText.y = 30;
  this._uiContainer.addChild(this._controlsText);

  // Commander abilities panel
  this._createCommanderAbilitiesPanel();

  // Create info screen (hidden initially)
  this._createInfoScreen();
};

ArmyBattleField.prototype._createCommanderAbilitiesPanel = function() {
  const width = this._battleWidth;

  // Commander abilities (cooldown in seconds)
  this._commanderAbilities = [
    { name: "Rally Troops", key: "q", cooldown: 30, currentCooldown: 0, effect: "rally" },
    { name: "Heal Squad", key: "w", cooldown: 45, currentCooldown: 0, effect: "heal" },
    { name: "Inspire", key: "e", cooldown: 60, currentCooldown: 0, effect: "inspire" }
  ];

  this._abilityTexts = [];

  for (let i = 0; i < this._commanderAbilities.length; i++) {
    const ability = this._commanderAbilities[i];
    const text = new PIXI.Text(`[${ability.key.toUpperCase()}] ${ability.name}`, {
      fontFamily: "Arial",
      fontSize: 16,
      fill: 0x00FF00,
      stroke: 0x000000,
      strokeThickness: 3
    });
    text.x = width - 180;
    text.y = 60 + i * 25;
    this._uiContainer.addChild(text);
    this._abilityTexts.push(text);
  }
};

ArmyBattleField.prototype._createInfoScreen = function() {
  // Create info screen container (right sidebar)
  this._infoScreen = new PIXI.Container();
  this._infoScreen.visible = true; // Always visible
  this._uiContainer.addChild(this._infoScreen);

  const screenWidth = Graphics.width;
  const screenHeight = Graphics.height;
  const sidebarWidth = Math.floor(screenWidth * 0.20); // 20% of screen width

  // Position sidebar on the right
  this._infoScreen.x = screenWidth - sidebarWidth;
  this._infoScreen.y = 0;

  // Semi-transparent background
  const bg = new PIXI.Graphics();
  bg.beginFill(0x000000, 0.85);
  bg.drawRect(0, 0, sidebarWidth, screenHeight);
  bg.endFill();
  this._infoScreen.addChild(bg);

  // Title
  const title = new PIXI.Text("TACTICAL", {
    fontFamily: "Arial",
    fontSize: 20,
    fill: 0xFFFFFF,
    stroke: 0x000000,
    strokeThickness: 3
  });
  title.x = 10;
  title.y = 10;
  this._infoScreen.addChild(title);

  // Create squad list containers
  this._infoPlayerSquads = new PIXI.Container();
  this._infoPlayerSquads.x = 10;
  this._infoPlayerSquads.y = 50;
  this._infoScreen.addChild(this._infoPlayerSquads);

  this._infoEnemySquads = new PIXI.Container();
  this._infoEnemySquads.x = 10;
  this._infoEnemySquads.y = screenHeight / 2;
  this._infoScreen.addChild(this._infoEnemySquads);

  // Selected squad for commands
  this._selectedSquad = null;

  // Command panel (at bottom)
  this._infoCommandPanel = new PIXI.Container();
  this._infoCommandPanel.x = 10;
  this._infoCommandPanel.y = screenHeight - 180;
  this._infoScreen.addChild(this._infoCommandPanel);

  // Store sidebar width for reference
  this._sidebarWidth = sidebarWidth;
};

ArmyBattleField.prototype.startBattle = function() {
  this._setupPlayerArmy();
  this._setupEnemyArmy();
  this._updateCounters();

  // Initialize info screen
  this._refreshInfoScreen();

  // Start battle loop
  this._battleActive = true;
};

ArmyBattleField.prototype._setupPlayerArmy = function() {
  const width = this._battleWidth;
  const height = this._battleHeight;

  // Group party members and troops
  const partyMembers = $gameParty.members().map(actor => ({
    ...actor, name: actor.name(), hp: actor.mhp, currentHp: actor.hp, role: "close quarters", formation: "Line", isLeader: true
  }));
  const allTroops = [...partyMembers, ...$gameArmy.getTroops()];

  console.log(`[ArmyBattle] Setting up player army: ${allTroops.length} total troops`);

  // Group by name to keep specific squads together
  const groups = Object.values(this._groupBy(allTroops, 'name'));
  const numSquads = groups.length;

  // Player gets bottom half of battlefield (with margin)
  const playerZoneStart = Math.floor(height * 0.55); // Start at 55% down
  const playerZoneEnd = height - 100; // End 100px from bottom
  const playerZoneHeight = playerZoneEnd - playerZoneStart;

  // Calculate spacing to fit all squads in player zone
  const spacing = numSquads > 1 ? playerZoneHeight / (numSquads - 1) : 0;

  // Deploy squads from bottom to top
  groups.forEach((squad, index) => {
    const formationType = squad[0].formation || "Line";
    // Position from bottom upward
    const yPos = playerZoneEnd - (index * spacing);
    console.log(`[ArmyBattle] Deploying player squad ${index + 1}/${numSquads}: ${squad[0].name} (${squad.length} units) in ${formationType} formation at y=${Math.floor(yPos)}`);
    this._applyTacticalFormation(squad, width / 2, yPos, 0xFFFF00, true, formationType);
  });

  console.log(`[ArmyBattle] Player army deployed: ${this._playerUnits.length} units in player zone (${playerZoneStart}-${playerZoneEnd})`);
};

// Helper to group array by key
ArmyBattleField.prototype._groupBy = function(xs, key) {
  return xs.reduce(function(rv, x) {
    (rv[x[key]] = rv[x[key]] || []).push(x);
    return rv;
  }, {});
};

ArmyBattleField.prototype._setupEnemyArmy = function() {
  const enemyArmy = $gameTemp._battleEnemyArmy;
  if (!enemyArmy) {
    console.warn('[ArmyBattle] No enemy army found!');
    return;
  }

  const width = this._battleWidth;
  const height = this._battleHeight;

  // Map and normalize enemy troop data
  const enemyTroops = enemyArmy.getTroops().map(troop => {
    return {
      ...troop,
      currentHp: troop.hp,
      isLeader: false,
      // Default to 'close quarters' if role is missing, as per plugin standard
      role: (troop.role || "close quarters").toLowerCase(),
      // Ensure formation defaults to 'Line' if not specified in the database
      formation: troop.formation || "Line"
    };
  });

  console.log(`[ArmyBattle] Setting up enemy army: ${enemyTroops.length} total troops`);

  // Group troops by name so specific units (e.g., all "Sipahi Cavalry") stay together
  const squads = Object.values(this._groupBy(enemyTroops, 'name'));
  const numSquads = squads.length;

  // Enemy gets top half of battlefield (with margin)
  const enemyZoneStart = 100; // Start 100px from top
  const enemyZoneEnd = Math.floor(height * 0.45); // End at 45% down
  const enemyZoneHeight = enemyZoneEnd - enemyZoneStart;

  // Calculate spacing to fit all squads in enemy zone
  const spacing = numSquads > 1 ? enemyZoneHeight / (numSquads - 1) : 0;

  // Deploy squads from top to bottom
  squads.forEach((squad, index) => {
    const formationType = squad[0].formation;
    const color = 0xFF0000; // Red for Enemy
    // Position from top downward
    const yPos = enemyZoneStart + (index * spacing);

    console.log(`[ArmyBattle] Deploying enemy squad ${index + 1}/${numSquads}: ${squad[0].name} (${squad.length} units) in ${formationType} formation at y=${Math.floor(yPos)}`);

    this._applyTacticalFormation(
      squad,
      width / 2,
      yPos,
      color,
      false, // isPlayer = false
      formationType
    );
  });

  console.log(`[ArmyBattle] Enemy army deployed: ${this._enemyUnits.length} units in enemy zone (${enemyZoneStart}-${enemyZoneEnd})`);
};
ArmyBattleField.prototype._applyTacticalFormation = function(troops, centerX, centerY, color, isPlayer, type) {
  const spacing = 10;
  const count = troops.length;

  troops.forEach((troop, i) => {
    let relX = 0;
    let relY = 0;

      switch (type) {
          case "Wedge":
              const rowW = Math.floor(Math.sqrt(i * 2));
              relY = rowW * spacing * (isPlayer ? 1 : -1);
              relX = (i - (rowW * (rowW + 1)) / 2) * spacing - (rowW * spacing) / 2;
              break;

          case "Line":
              relX = (i - count / 2) * spacing;
              relY = 0;
              break;

          case "Double":
              relX = (Math.floor(i / 2) - count / 4) * spacing;
              relY = (i % 2) * spacing * (isPlayer ? 1 : -1);
              break;

          case "Phalanx": // Tight rectangular block
              const pWidth = Math.ceil(Math.sqrt(count) * 1.5);
              relX = (i % pWidth - pWidth / 2) * (spacing * 0.7);
              relY = Math.floor(i / pWidth) * (spacing * 0.7) * (isPlayer ? 1 : -1);
              break;

          case "Circle":
              const radius = (count * spacing) / (2 * Math.PI);
              const angle = (i / count) * Math.PI * 2;
              relX = Math.cos(angle) * radius;
              relY = Math.sin(angle) * radius;
              break;

          case "Scattered":
              relX = (Math.random() - 0.5) * count * spacing;
              relY = (Math.random() - 0.5) * 40;
              break;

          case "Box": // Hollow square
              const side = Math.ceil(count / 4);
              if (i < side) { relX = i * spacing; relY = 0; }
              else if (i < side * 2) { relX = side * spacing; relY = (i - side) * spacing; }
              else if (i < side * 3) { relX = (side * 3 - i) * spacing; relY = side * spacing; }
              else { relX = 0; relY = (side * 4 - i) * spacing; }
              relX -= (side * spacing) / 2;
              break;

          case "Crescent":
              const cAngle = (i / count - 0.5) * Math.PI;
              relX = Math.sin(cAngle) * (count * spacing / 2);
              relY = Math.cos(cAngle) * 30 * (isPlayer ? 1 : -1);
              break;

          case "Column":
              relX = 0;
              relY = i * spacing * (isPlayer ? 1 : -1);
              break;
      }

      const unit = this._createUnit(troop, centerX + relX, centerY + relY, color, isPlayer);
      if (isPlayer) this._playerUnits.push(unit); else this._enemyUnits.push(unit);
      this._contentContainer.addChild(unit.sprite);

      // Only add name label for the first unit of the squad
      if (i === 0) {
        this._contentContainer.addChild(unit.nameLabel);
        // Mark this as the squad's label holder
        unit.isSquadLabelHolder = true;
      }
  });
};

ArmyBattleField.prototype._createUnit = function(troop, x, y, color, isPlayer) {
  const dotSize = ArmyBattleView.Params.dotSize;
  const role = (troop.role || "close quarters").toLowerCase();

  const sprite = new PIXI.Graphics();
  sprite.beginFill(color);

  // Different shapes based on role
  if (role.includes("ranged") || role.includes("archer") || role.includes("gunner")) {
    // Triangle for ranged
    sprite.moveTo(0, -dotSize);
    sprite.lineTo(dotSize, dotSize);
    sprite.lineTo(-dotSize, dotSize);
    sprite.closePath();
  } else if (role.includes("support") || role.includes("healer") || role.includes("medic")) {
    // Square for support
    sprite.drawRect(-dotSize, -dotSize, dotSize * 2, dotSize * 2);
  } else {
    // Circle for close quarters (default)
    sprite.drawCircle(0, 0, dotSize);
  }

  sprite.endFill();
  sprite.x = x;
  sprite.y = y;

  // Create name label
  const useItalian = ConfigManager.language === 'it';
  const troopName = useItalian && troop.name_it ? troop.name_it : troop.name;

  const nameLabel = new PIXI.Text(troopName, {
    fontFamily: "Arial",
    fontSize: 12,
    fill: color,
    stroke: 0x000000,
    strokeThickness: 3
  });
  nameLabel.anchor.set(0.5, 1); // Center horizontally, bottom of text at anchor
  nameLabel.x = x;
  nameLabel.y = y - dotSize - 2; // Position above unit

  return {
    sprite: sprite,
    nameLabel: nameLabel,
    troop: troop,
    x: x,
    y: y,
    targetX: x,
    targetY: y,
    isPlayer: isPlayer,
    isAlive: true,
    targetEnemy: null,
    attackCooldown: 0,
    role: role,
    morale: 100, // 0-100, affects combat effectiveness
    velocityX: 0,
    velocityY: 0,
    isCharging: false,
    isRouting: false
  };
};

ArmyBattleField.prototype.update = function() {
  if (!this._battleActive) return;

  // Check for TAB key to toggle info screen visibility
  if (Input.isTriggered("tab")) {
    this._infoScreen.visible = !this._infoScreen.visible;
  }

  // Process input for zoom and drag
  this._processInput();

  // Process commander abilities
  this._processCommanderAbilities();

  // Update all units
  this._updateUnits();

  // Update projectiles
  this._updateProjectiles();

  // Update particles
  this._updateParticles();

  // Check for battle end
  this._checkBattleEnd();

  // Update counters
  this._updateCounters();

  // Update ability cooldowns display
  this._updateAbilityCooldowns();

  // Refresh info screen periodically (every 30 frames)
  if (Graphics.frameCount % 30 === 0 && this._infoScreen.visible) {
    this._refreshInfoScreen();
  }
};

ArmyBattleField.prototype._processInput = function() {
  // Handle mouse wheel zoom
  const wheelDelta = TouchInput.wheelY;
  if (wheelDelta !== 0) {
    const zoomFactor = wheelDelta > 0 ? 0.9 : 1.1;
    this._zoom = Math.max(this._minZoom, Math.min(this._maxZoom, this._zoom * zoomFactor));
    this._applyViewportTransform();
  }

  // Get mouse position
  const x = TouchInput.x;
  const y = TouchInput.y;

  // Check if mouse is within battlefield bounds
  const width = this._battleWidth;
  const height = this._battleHeight;
  const localX = x - this.x;
  const localY = y - this.y;

  if (localX < 0 || localY < 0 || localX > width || localY > height) {
    // Mouse outside battlefield
    return;
  }

  // Handle mouse press/drag
  if (TouchInput.isPressed()) {
    if (!this._mousePressed) {
      // Mouse just pressed
      this._mousePressed = true;
      this._dragStarted = false;
      this._lastTouchX = x;
      this._lastTouchY = y;
    } else {
      // Mouse is being dragged
      const dx = x - this._lastTouchX;
      const dy = y - this._lastTouchY;

      if (Math.abs(dx) > 2 || Math.abs(dy) > 2) {
        this._dragStarted = true;
        this._viewportX += dx;
        this._viewportY += dy;
        this._applyViewportTransform();
      }

      this._lastTouchX = x;
      this._lastTouchY = y;
    }
  } else {
    // Mouse released
    this._mousePressed = false;
    this._dragStarted = false;
  }
};

ArmyBattleField.prototype._applyViewportTransform = function() {
  // Apply zoom and pan to content container
  this._contentContainer.scale.set(this._zoom, this._zoom);
  this._contentContainer.position.set(this._viewportX, this._viewportY);

  // Update zoom indicator
  if (this._zoomText) {
    this._zoomText.text = `Zoom: ${Math.round(this._zoom * 100)}%`;
  }
};

ArmyBattleField.prototype._updateUnits = function() {
  const speed = ArmyBattleView.Params.advanceSpeed;
  const baseAttackRange = ArmyBattleView.Params.attackRange;

  // Update player units
  for (const unit of this._playerUnits) {
    if (!unit.isAlive) continue;

    // Check for routing behavior
    if (unit.isRouting) {
      this._updateRoutingUnit(unit);
      continue;
    }

    // Check if unit is holding position
    if (unit.holdPosition) {
      // Units holding position only attack enemies in range, don't move
      const nearestEnemy = this._findNearestEnemy(unit, this._enemyUnits);
      if (nearestEnemy) {
        const distance = this._getDistance(unit.sprite.x, unit.sprite.y, nearestEnemy.sprite.x, nearestEnemy.sprite.y);
        const attackRange = unit.role.includes("ranged") ? baseAttackRange * 3 : baseAttackRange;
        if (distance <= attackRange) {
          this._attackEnemy(unit, nearestEnemy);
        }
      }
      continue;
    }

    // Find nearest enemy
    const nearestEnemy = this._findNearestEnemy(unit, this._enemyUnits);

    if (nearestEnemy) {
      const distance = this._getDistance(unit.sprite.x, unit.sprite.y, nearestEnemy.sprite.x, nearestEnemy.sprite.y);

      // Determine attack range based on role
      let attackRange = baseAttackRange;
      if (unit.role.includes("ranged")) {
        attackRange = baseAttackRange * 3; // 3x range for ranged units
      }

      // Ranged units try to maintain distance
      if (unit.role.includes("ranged")) {
        const idealRange = baseAttackRange * 2.5;
        if (distance < idealRange) {
          // Retreat from enemy
          const angle = Math.atan2(unit.sprite.y - nearestEnemy.sprite.y, unit.sprite.x - nearestEnemy.sprite.x);
          unit.sprite.x += Math.cos(angle) * speed * 0.7;
          unit.sprite.y += Math.sin(angle) * speed * 0.7;
          unit.isCharging = false;
        } else if (distance > attackRange) {
          // Move to ideal range
          const angle = Math.atan2(nearestEnemy.sprite.y - unit.sprite.y, nearestEnemy.sprite.x - unit.sprite.x);
          unit.sprite.x += Math.cos(angle) * speed * 0.5;
          unit.sprite.y += Math.sin(angle) * speed * 0.5;
          unit.isCharging = false;
        } else {
          // In range, attack
          this._attackEnemy(unit, nearestEnemy);
        }
      } else {
        // Melee units charge in
        if (distance > attackRange) {
          const angle = Math.atan2(nearestEnemy.sprite.y - unit.sprite.y, nearestEnemy.sprite.x - unit.sprite.x);
          const moveSpeed = speed * (unit.morale / 100);
          unit.velocityX = Math.cos(angle) * moveSpeed;
          unit.velocityY = Math.sin(angle) * moveSpeed;
          unit.sprite.x += unit.velocityX;
          unit.sprite.y += unit.velocityY;

          // Check if charging (moving fast)
          const velocity = Math.sqrt(unit.velocityX * unit.velocityX + unit.velocityY * unit.velocityY);
          unit.isCharging = velocity > speed * 0.8;
        } else {
          unit.velocityX = 0;
          unit.velocityY = 0;
          unit.isCharging = false;
          this._attackEnemy(unit, nearestEnemy);
        }
      }
    }

    // Clamp position to battlefield boundaries
    this._clampUnitPosition(unit);
  }

  // Update enemy units (same logic)
  for (const unit of this._enemyUnits) {
    if (!unit.isAlive) continue;

    if (unit.isRouting) {
      this._updateRoutingUnit(unit);
      continue;
    }

    const nearestPlayer = this._findNearestEnemy(unit, this._playerUnits);

    if (nearestPlayer) {
      const distance = this._getDistance(unit.sprite.x, unit.sprite.y, nearestPlayer.sprite.x, nearestPlayer.sprite.y);

      let attackRange = baseAttackRange;
      if (unit.role.includes("ranged")) {
        attackRange = baseAttackRange * 3;
      }

      if (unit.role.includes("ranged")) {
        const idealRange = baseAttackRange * 2.5;
        if (distance < idealRange) {
          const angle = Math.atan2(unit.sprite.y - nearestPlayer.sprite.y, unit.sprite.x - nearestPlayer.sprite.x);
          unit.sprite.x += Math.cos(angle) * speed * 0.7;
          unit.sprite.y += Math.sin(angle) * speed * 0.7;
          unit.isCharging = false;
        } else if (distance > attackRange) {
          const angle = Math.atan2(nearestPlayer.sprite.y - unit.sprite.y, nearestPlayer.sprite.x - unit.sprite.x);
          unit.sprite.x += Math.cos(angle) * speed * 0.5;
          unit.sprite.y += Math.sin(angle) * speed * 0.5;
          unit.isCharging = false;
        } else {
          this._attackEnemy(unit, nearestPlayer);
        }
      } else {
        if (distance > attackRange) {
          const angle = Math.atan2(nearestPlayer.sprite.y - unit.sprite.y, nearestPlayer.sprite.x - unit.sprite.x);
          const moveSpeed = speed * (unit.morale / 100);
          unit.velocityX = Math.cos(angle) * moveSpeed;
          unit.velocityY = Math.sin(angle) * moveSpeed;
          unit.sprite.x += unit.velocityX;
          unit.sprite.y += unit.velocityY;

          const velocity = Math.sqrt(unit.velocityX * unit.velocityX + unit.velocityY * unit.velocityY);
          unit.isCharging = velocity > speed * 0.8;
        } else {
          unit.velocityX = 0;
          unit.velocityY = 0;
          unit.isCharging = false;
          this._attackEnemy(unit, nearestPlayer);
        }
      }
    }

    // Clamp position to battlefield boundaries
    this._clampUnitPosition(unit);
  }
};

ArmyBattleField.prototype._clampUnitPosition = function(unit) {
  // Clamp unit position to battlefield boundaries
  const margin = 20; // Keep units 20px away from edges
  const minX = margin;
  const maxX = this._battleWidth - margin;
  const minY = margin;
  const maxY = this._battleHeight - margin;

  unit.sprite.x = Math.max(minX, Math.min(maxX, unit.sprite.x));
  unit.sprite.y = Math.max(minY, Math.min(maxY, unit.sprite.y));

  // Update name label position only if this unit is the squad's label holder
  if (unit.isSquadLabelHolder) {
    const dotSize = ArmyBattleView.Params.dotSize;
    unit.nameLabel.x = unit.sprite.x;
    unit.nameLabel.y = unit.sprite.y - dotSize - 2;
  }
};

ArmyBattleField.prototype._findNearestEnemy = function(unit, enemies) {
  let nearest = null;
  let nearestDist = Infinity;

  for (const enemy of enemies) {
    if (!enemy.isAlive) continue;

    const dist = this._getDistance(unit.sprite.x, unit.sprite.y, enemy.sprite.x, enemy.sprite.y);
    if (dist < nearestDist) {
      nearestDist = dist;
      nearest = enemy;
    }
  }

  return nearest;
};

ArmyBattleField.prototype._getDistance = function(x1, y1, x2, y2) {
  const dx = x2 - x1;
  const dy = y2 - y1;
  return Math.sqrt(dx * dx + dy * dy);
};

ArmyBattleField.prototype._attackEnemy = function(attacker, defender) {
  // Cooldown system
  if (attacker.attackCooldown > 0) {
    attacker.attackCooldown--;
    return;
  }

  // Ranged units fire projectiles
  if (attacker.role.includes("ranged")) {
    this._fireProjectile(attacker, defender);
    attacker.attackCooldown = 90; // Slower attack speed for ranged
    return;
  }

  // Melee combat
  const attackerStats = attacker.troop;
  const defenderStats = defender.troop;

  let baseDamage = Math.max(1, attackerStats.atk - defenderStats.def / 2);

  // Morale affects damage (50% morale = 50% damage)
  baseDamage *= (attacker.morale / 100);

  // Charge bonus: +50% damage if charging
  if (attacker.isCharging) {
    baseDamage *= 1.5;
    this._createParticle(attacker.sprite.x, attacker.sprite.y, 0xFFAA00, "CHARGE!");
  }

  // Flanking bonus: Check if attacking from behind
  const isFlanking = this._checkFlanking(attacker, defender);
  if (isFlanking) {
    baseDamage *= 1.3; // +30% damage from behind
    defender.morale -= 5; // Reduce defender morale
  }

  // Critical hit chance (10% base + luck/100)
  const critChance = 0.1 + (attackerStats.luk || 0) / 1000;
  const isCrit = Math.random() < critChance;
  if (isCrit) {
    baseDamage *= 2;
    this._createParticle(defender.sprite.x, defender.sprite.y, 0xFF0000, "CRIT!");
  }

  // Variance
  const variance = 0.2;
  const damage = Math.floor(baseDamage * (1 + (Math.random() * variance * 2 - variance)));

  // Apply damage
  defenderStats.currentHp -= damage;

  // Flash defender white
  const originalTint = defender.sprite.tint;
  defender.sprite.tint = 0xFFFFFF;
  setTimeout(() => {
    if (defender.sprite) defender.sprite.tint = originalTint;
  }, 100);

  // Morale damage
  defender.morale -= damage / 10;
  if (defender.morale < 0) defender.morale = 0;

  // Check if morale broken (route at 20% morale)
  if (defender.morale < 20 && Math.random() < 0.3) {
    defender.isRouting = true;
  }

  // Check if dead
  if (defenderStats.currentHp <= 0) {
    this._killUnit(defender);
  }

  // Set cooldown (60 frames = 1 second at 60fps)
  attacker.attackCooldown = 60;
};

ArmyBattleField.prototype._killUnit = function(unit) {
  const injuryChance = ArmyBattleView.Params.injuryChance;
  const isInjured = Math.random() * 100 < injuryChance;

  if (isInjured) {
    // Injured - set HP to 1 and remove from battle
    unit.troop.currentHp = 1;
    unit.isAlive = false;
    unit.sprite.visible = false;
    if (unit.isSquadLabelHolder) {
      unit.nameLabel.visible = false;
    }

    // Mark troop as injured in army data
    if (unit.isPlayer && !unit.troop.isLeader) {
      const actualTroop = $gameArmy.getTroops().find(t => t.id === unit.troop.id);
      if (actualTroop) {
        actualTroop.hp = 1; // Set to injured state
      }
    }
  } else {
    // Dead - remove completely
    unit.isAlive = false;
    unit.sprite.visible = false;
    if (unit.isSquadLabelHolder) {
      unit.nameLabel.visible = false;
    }

    // Remove from army data
    if (unit.isPlayer) {
      if (unit.troop.isLeader) {
        // Party member died
        const actorId = parseInt(unit.troop.id.replace("actor_", ""));
        const actor = $gameActors.actor(actorId);
        if (actor) {
          actor.setHp(0);
        }
      } else {
        // Regular troop died
        $gameArmy.removeTroop(unit.troop.id);
      }
    }
  }
};

ArmyBattleField.prototype._updateCounters = function() {
  const playerAlive = this._playerUnits.filter(u => u.isAlive).length;
  const enemyAlive = this._enemyUnits.filter(u => u.isAlive).length;

  this._playerCounterText.text = `Player Army: ${playerAlive}`;
  this._enemyCounterText.text = `Enemy Army: ${enemyAlive}`;
};

ArmyBattleField.prototype._checkBattleEnd = function() {
  const playerAlive = this._playerUnits.filter(u => u.isAlive).length;
  const enemyAlive = this._enemyUnits.filter(u => u.isAlive).length;

  if (playerAlive === 0) {
    this._endBattle("defeat");
  } else if (enemyAlive === 0) {
    this._endBattle("victory");
  }
};

ArmyBattleField.prototype._endBattle = function(result) {
  this._battleActive = false;
  this._battleEnded = true;
  this._battleResult = result;

  // Show result text
  this._resultText.text = result === "victory" ? "VICTORY!" : "DEFEAT!";
  this._resultText.style.fill = result === "victory" ? 0x00FF00 : 0xFF0000;
  this._resultText.visible = true;
};

ArmyBattleField.prototype.isBattleEnded = function() {
  return this._battleEnded;
};

ArmyBattleField.prototype.getBattleResult = function() {
  return this._battleResult;
};

//=============================================================================
// Combat Mechanics - Flanking, Projectiles, Particles, Routing
//=============================================================================

ArmyBattleField.prototype._checkFlanking = function(attacker, defender) {
  // Calculate angle from defender to attacker
  const angle = Math.atan2(attacker.sprite.y - defender.sprite.y, attacker.sprite.x - defender.sprite.x);

  // Calculate defender's facing direction (towards their enemies)
  const defenderFacing = defender.isPlayer ? -Math.PI / 2 : Math.PI / 2; // Up for player, down for enemy

  // Calculate angle difference
  let angleDiff = Math.abs(angle - defenderFacing);
  if (angleDiff > Math.PI) angleDiff = 2 * Math.PI - angleDiff;

  // Flanking if attacking from more than 90 degrees off facing
  return angleDiff > Math.PI / 2;
};

ArmyBattleField.prototype._fireProjectile = function(attacker, defender) {
  const projectile = {
    sprite: new PIXI.Graphics(),
    x: attacker.sprite.x,
    y: attacker.sprite.y,
    targetX: defender.sprite.x,
    targetY: defender.sprite.y,
    target: defender,
    attacker: attacker,
    speed: 5,
    damage: Math.max(1, attacker.troop.atk - defender.troop.def / 2) * (attacker.morale / 100),
    alive: true
  };

  // Draw projectile (small yellow circle)
  projectile.sprite.beginFill(attacker.isPlayer ? 0xFFFF00 : 0xFF0000);
  projectile.sprite.drawCircle(0, 0, 2);
  projectile.sprite.endFill();
  projectile.sprite.x = projectile.x;
  projectile.sprite.y = projectile.y;

  this._projectiles.push(projectile);
  this._effectsContainer.addChild(projectile.sprite);
};

ArmyBattleField.prototype._updateProjectiles = function() {
  for (let i = this._projectiles.length - 1; i >= 0; i--) {
    const proj = this._projectiles[i];

    if (!proj.alive) {
      this._effectsContainer.removeChild(proj.sprite);
      this._projectiles.splice(i, 1);
      continue;
    }

    // Move towards target
    const dx = proj.targetX - proj.x;
    const dy = proj.targetY - proj.y;
    const dist = Math.sqrt(dx * dx + dy * dy);

    if (dist < proj.speed || !proj.target.isAlive) {
      // Hit target or target died
      if (proj.target.isAlive) {
        const defenderStats = proj.target.troop;

        // Apply damage with variance
        const variance = 0.2;
        const damage = Math.floor(proj.damage * (1 + (Math.random() * variance * 2 - variance)));

        defenderStats.currentHp -= damage;

        // Flash target
        const originalTint = proj.target.sprite.tint;
        proj.target.sprite.tint = 0xFFFFFF;
        setTimeout(() => {
          if (proj.target.sprite) proj.target.sprite.tint = originalTint;
        }, 100);

        // Morale damage
        proj.target.morale -= damage / 10;
        if (proj.target.morale < 0) proj.target.morale = 0;

        // Check if dead
        if (defenderStats.currentHp <= 0) {
          this._killUnit(proj.target);
        }
      }

      proj.alive = false;
    } else {
      // Continue moving
      proj.x += (dx / dist) * proj.speed;
      proj.y += (dy / dist) * proj.speed;
      proj.sprite.x = proj.x;
      proj.sprite.y = proj.y;

      // Update target position (target may have moved)
      if (proj.target.isAlive) {
        proj.targetX = proj.target.sprite.x;
        proj.targetY = proj.target.sprite.y;
      }
    }
  }
};

ArmyBattleField.prototype._createParticle = function(x, y, color, text) {
  const particle = {
    sprite: new PIXI.Text(text || "", {
      fontFamily: "Arial",
      fontSize: 14,
      fill: color,
      stroke: 0x000000,
      strokeThickness: 2
    }),
    x: x,
    y: y,
    lifetime: 60, // 1 second at 60fps
    velocityY: -1
  };

  particle.sprite.x = x;
  particle.sprite.y = y;
  particle.sprite.anchor.set(0.5);

  this._particles.push(particle);
  this._effectsContainer.addChild(particle.sprite);
};

ArmyBattleField.prototype._updateParticles = function() {
  for (let i = this._particles.length - 1; i >= 0; i--) {
    const particle = this._particles[i];

    particle.lifetime--;
    particle.y += particle.velocityY;
    particle.sprite.y = particle.y;
    particle.sprite.alpha = particle.lifetime / 60;

    if (particle.lifetime <= 0) {
      this._effectsContainer.removeChild(particle.sprite);
      this._particles.splice(i, 1);
    }
  }
};

ArmyBattleField.prototype._updateRoutingUnit = function(unit) {
  // Routing units flee towards their starting edge
  const fleeDirection = unit.isPlayer ? 1 : -1; // Player flees down, enemy flees up
  const speed = ArmyBattleView.Params.advanceSpeed * 1.5; // Flee faster

  unit.sprite.y += fleeDirection * speed;

  // Change color to indicate routing (darker)
  unit.sprite.tint = 0x888888;

  // Clamp to battlefield boundaries
  this._clampUnitPosition(unit);

  // Remove from battle if reached edge of battlefield
  const margin = 30;
  const height = this._battleHeight;
  if (unit.sprite.y <= margin || unit.sprite.y >= height - margin) {
    unit.isAlive = false;
    unit.sprite.visible = false;
    if (unit.isSquadLabelHolder) {
      unit.nameLabel.visible = false;
    }
  }
};

//=============================================================================
// Commander Abilities System
//=============================================================================

ArmyBattleField.prototype._processCommanderAbilities = function() {
  // Decrease cooldowns
  for (const ability of this._commanderAbilities) {
    if (ability.currentCooldown > 0) {
      ability.currentCooldown -= 1 / 60; // Decrease by 1 second per 60 frames
    }
  }

  // Check for key presses
  for (const ability of this._commanderAbilities) {
    if (ability.currentCooldown <= 0) {
      let keyPressed = false;

      // Check key press based on ability key
      if (ability.key === "q" && Input.isTriggered("pageup")) keyPressed = true;
      if (ability.key === "w" && Input.isTriggered("pagedown")) keyPressed = true;
      if (ability.key === "e" && Input.isTriggered("shift")) keyPressed = true;

      // Fallback: check raw keyboard input
      if (!keyPressed && this._checkKeyPress(ability.key)) {
        keyPressed = true;
      }

      if (keyPressed) {
        this._activateAbility(ability);
        ability.currentCooldown = ability.cooldown;
      }
    }
  }
};

ArmyBattleField.prototype._checkKeyPress = function(key) {
  // Manual keyboard check using Input._currentState
  const keyCode = key.charCodeAt(0);
  return Input._currentState[String.fromCharCode(keyCode).toUpperCase()];
};

ArmyBattleField.prototype._activateAbility = function(ability) {
  console.log(`[ArmyBattle] Activating ability: ${ability.name}`);

  switch (ability.effect) {
    case "rally":
      this._rallyTroops();
      break;
    case "heal":
      this._healSquad();
      break;
    case "inspire":
      this._inspireTroops();
      break;
  }
};

ArmyBattleField.prototype._rallyTroops = function() {
  // Restore morale to routing units
  let ralliedCount = 0;
  for (const unit of this._playerUnits) {
    if (unit.isRouting) {
      unit.isRouting = false;
      unit.morale = 50; // Restore to 50%
      unit.sprite.tint = 0xFFFFFF; // Reset color
      ralliedCount++;
    } else if (unit.isAlive) {
      unit.morale = Math.min(100, unit.morale + 20); // Boost morale
    }
  }

  // Visual feedback
  this._createParticle(
    this._battleWidth / 2,
    this._battleHeight - 200,
    0xFFFF00,
    `RALLY! +20 Morale (${ralliedCount} troops rallied)`
  );
};

ArmyBattleField.prototype._healSquad = function() {
  // Heal all player units
  let healedCount = 0;
  for (const unit of this._playerUnits) {
    if (unit.isAlive && unit.troop.currentHp < unit.troop.hp) {
      const healAmount = Math.floor(unit.troop.hp * 0.25); // Heal 25% of max HP
      unit.troop.currentHp = Math.min(unit.troop.hp, unit.troop.currentHp + healAmount);
      healedCount++;
    }
  }

  // Visual feedback
  this._createParticle(
    this._battleWidth / 2,
    this._battleHeight - 200,
    0x00FF00,
    `HEAL! +25% HP to ${healedCount} troops`
  );
};

ArmyBattleField.prototype._inspireTroops = function() {
  // Grant temporary damage and morale boost
  for (const unit of this._playerUnits) {
    if (unit.isAlive) {
      unit.morale = 100; // Max morale
      unit.troop.atk = Math.floor((unit.troop.atk || 10) * 1.5); // +50% attack for duration
    }
  }

  // Visual feedback
  this._createParticle(
    this._battleWidth / 2,
    this._battleHeight - 200,
    0xFF8800,
    "INSPIRE! +50% Attack & Max Morale!"
  );

  // Reset attack after 10 seconds
  setTimeout(() => {
    for (const unit of this._playerUnits) {
      if (unit.isAlive) {
        unit.troop.atk = Math.floor((unit.troop.atk || 10) / 1.5);
      }
    }
  }, 10000);
};

ArmyBattleField.prototype._updateAbilityCooldowns = function() {
  for (let i = 0; i < this._commanderAbilities.length; i++) {
    const ability = this._commanderAbilities[i];
    const text = this._abilityTexts[i];

    if (ability.currentCooldown > 0) {
      text.text = `[${ability.key.toUpperCase()}] ${ability.name} (${Math.ceil(ability.currentCooldown)}s)`;
      text.style.fill = 0x888888; // Gray out when on cooldown
    } else {
      text.text = `[${ability.key.toUpperCase()}] ${ability.name}`;
      text.style.fill = 0x00FF00; // Green when ready
    }
  }
};

//=============================================================================
// Info Screen System
//=============================================================================

ArmyBattleField.prototype._refreshInfoScreen = function() {
  // Clear existing squad displays
  this._infoPlayerSquads.removeChildren();
  this._infoEnemySquads.removeChildren();

  // Group units by squad name
  const playerSquads = this._groupUnitsBySquad(this._playerUnits);
  const enemySquads = this._groupUnitsBySquad(this._enemyUnits);

  // Display player squads
  const playerTitle = new PIXI.Text("YOUR FORCES", {
    fontFamily: "Arial",
    fontSize: 16,
    fill: 0xFFFF00,
    stroke: 0x000000,
    strokeThickness: 2
  });
  this._infoPlayerSquads.addChild(playerTitle);

  let yOffset = 25;
  for (const [squadName, units] of Object.entries(playerSquads)) {
    const aliveCount = units.filter(u => u.isAlive).length;
    const totalCount = units.length;

    // Truncate long squad names
    const displayName = squadName.length > 15 ? squadName.substring(0, 12) + "..." : squadName;

    const squadText = new PIXI.Text(`${displayName}\n${aliveCount}/${totalCount}`, {
      fontFamily: "Arial",
      fontSize: 12,
      fill: aliveCount > 0 ? 0xFFFFFF : 0x888888,
      stroke: 0x000000,
      strokeThickness: 2
    });
    squadText.y = yOffset;
    squadText.interactive = true;
    squadText.buttonMode = true;
    squadText.on('pointerdown', () => this._selectSquad(squadName, units, true));
    this._infoPlayerSquads.addChild(squadText);

    yOffset += 35;
  }

  // Display enemy squads
  const enemyTitle = new PIXI.Text("ENEMY FORCES", {
    fontFamily: "Arial",
    fontSize: 16,
    fill: 0xFF0000,
    stroke: 0x000000,
    strokeThickness: 2
  });
  this._infoEnemySquads.addChild(enemyTitle);

  yOffset = 25;
  for (const [squadName, units] of Object.entries(enemySquads)) {
    const aliveCount = units.filter(u => u.isAlive).length;
    const totalCount = units.length;

    const displayName = squadName.length > 15 ? squadName.substring(0, 12) + "..." : squadName;

    const squadText = new PIXI.Text(`${displayName}\n${aliveCount}/${totalCount}`, {
      fontFamily: "Arial",
      fontSize: 12,
      fill: aliveCount > 0 ? 0xFFFFFF : 0x888888,
      stroke: 0x000000,
      strokeThickness: 2
    });
    squadText.y = yOffset;
    this._infoEnemySquads.addChild(squadText);

    yOffset += 35;
  }

  // Refresh command panel
  this._refreshCommandPanel();
};

ArmyBattleField.prototype._groupUnitsBySquad = function(units) {
  const squads = {};
  for (const unit of units) {
    const squadName = unit.troop.name;
    if (!squads[squadName]) {
      squads[squadName] = [];
    }
    squads[squadName].push(unit);
  }
  return squads;
};

ArmyBattleField.prototype._selectSquad = function(squadName, units, isPlayer) {
  if (!isPlayer) return; // Can only select player squads

  this._selectedSquad = { name: squadName, units: units };
  this._refreshCommandPanel();
  console.log(`[ArmyBattle] Selected squad: ${squadName}`);
};

ArmyBattleField.prototype._refreshCommandPanel = function() {
  this._infoCommandPanel.removeChildren();

  if (!this._selectedSquad) {
    const noSelection = new PIXI.Text("Click squad\nto command", {
      fontFamily: "Arial",
      fontSize: 11,
      fill: 0xCCCCCC
    });
    this._infoCommandPanel.addChild(noSelection);
    return;
  }

  // Show selected squad (truncated)
  const squadName = this._selectedSquad.name.length > 12 ?
    this._selectedSquad.name.substring(0, 9) + "..." :
    this._selectedSquad.name;

  const title = new PIXI.Text(`SELECTED:\n${squadName}`, {
    fontFamily: "Arial",
    fontSize: 12,
    fill: 0xFFFF00,
    stroke: 0x000000,
    strokeThickness: 2
  });
  this._infoCommandPanel.addChild(title);

  // Command buttons (vertical layout)
  const commands = [
    { key: "1", name: "Hold", action: "hold" },
    { key: "2", name: "Attack", action: "aggressive" },
    { key: "3", name: "Defend", action: "defensive" },
    { key: "4", name: "Retreat", action: "retreat" }
  ];

  let yOffset = 40;
  for (const cmd of commands) {
    const cmdText = new PIXI.Text(`[${cmd.key}] ${cmd.name}`, {
      fontFamily: "Arial",
      fontSize: 11,
      fill: 0x00FF00,
      stroke: 0x000000,
      strokeThickness: 2
    });
    cmdText.y = yOffset;
    cmdText.interactive = true;
    cmdText.buttonMode = true;
    cmdText.on('pointerdown', () => this._executeSquadCommand(cmd.action));
    this._infoCommandPanel.addChild(cmdText);

    yOffset += 20;
  }
};

ArmyBattleField.prototype._executeSquadCommand = function(action) {
  if (!this._selectedSquad) return;

  const units = this._selectedSquad.units.filter(u => u.isAlive);

  switch (action) {
    case "hold":
      console.log(`[ArmyBattle] ${this._selectedSquad.name} holding position`);
      // Set units to hold position (stop moving)
      for (const unit of units) {
        unit.holdPosition = true;
      }
      this._createParticle(this._battleWidth / 2, this._battleHeight / 2, 0xFFFF00,
        `${this._selectedSquad.name} HOLDING POSITION`);
      break;

    case "aggressive":
      console.log(`[ArmyBattle] ${this._selectedSquad.name} advancing aggressively`);
      for (const unit of units) {
        unit.holdPosition = false;
        unit.morale = Math.min(100, unit.morale + 10);
      }
      this._createParticle(this._battleWidth / 2, this._battleHeight / 2, 0xFF0000,
        `${this._selectedSquad.name} AGGRESSIVE STANCE`);
      break;

    case "defensive":
      console.log(`[ArmyBattle] ${this._selectedSquad.name} taking defensive stance`);
      for (const unit of units) {
        unit.holdPosition = true;
        unit.troop.def = Math.floor((unit.troop.def || 10) * 1.2);
      }
      this._createParticle(this._battleWidth / 2, this._battleHeight / 2, 0x0000FF,
        `${this._selectedSquad.name} DEFENSIVE +20% DEF`);
      break;

    case "retreat":
      console.log(`[ArmyBattle] ${this._selectedSquad.name} retreating`);
      for (const unit of units) {
        unit.isRouting = true;
      }
      this._createParticle(this._battleWidth / 2, this._battleHeight / 2, 0x888888,
        `${this._selectedSquad.name} RETREATING`);
      break;
  }
};

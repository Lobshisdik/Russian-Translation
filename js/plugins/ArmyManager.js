/*:
 * @plugindesc Mount & Blade style Army Management System
 * @author Omni-Lex
 * @target MZ
 *
 * @param showInMenu
 * @text Show in Menu
 * @type boolean
 * @default true
 * @desc Whether to add the Army option to the main menu.
 *
 * @param menuText
 * @text Menu Command Text
 * @type string
 * @default Army
 * @desc The text shown for the Army command in the menu.
 *
 * @param maxArmySize
 * @text Maximum Army Size
 * @type number
 * @min 1
 * @max 999
 * @default 100
 * @desc Maximum number of troops you can have in your army.
 *
 * @command buyTroops
 * @text Buy Troops
 * @desc Opens the troop recruitment window.
 * @arg factionId
 * @type number
 * @min -1
 * @default -1
 * @desc The faction ID to recruit from (-1 for all factions).
 *
 * @command debugAddTroops
 * @text Debug: Add All Faction Troops
 * @desc [DEBUG] Adds all troop types from a random faction (10 of each type).
 *
 * @help
 * Army Management System - Mount & Blade Warband Style
 *
 * This plugin adds a comprehensive army management system inspired by
 * Mount & Blade Warband.
 *
 * Features:
 * - Recruit troops from various factions
 * - View army composition and stats
 * - Manage weekly upkeep costs
 * - Coherence system (bonus for same-faction troops)
 * - Release troops to reduce upkeep
 *
 * Plugin Commands:
 *
 * ArmyManager buyTroops factionId
 *   - Opens recruitment window for specified faction
 *   - Use -1 for location-based recruitment (reads Variable 86 for country ID):
 *     * If country has a faction: Shows troops from that faction + subfactions
 *     * If country has no faction: Shows random troops (seeded by Var 43/44 - world X/Y)
 *   - Example: ArmyManager buyTroops 0 (Mages Guild only)
 *   - Example: ArmyManager buyTroops -1 (Location-based recruitment)
 *
 * ArmyManager debugAddTroops
 *   - [DEBUG] Adds all troop types from a random faction (10 of each type)
 *   - Respects max army size limit
 *   - Logs details to console with breakdown by troop type
 *   - Example: ArmyManager debugAddTroops
 *
 * Variable Requirements:
 *   Variable 86: Current country ID (for location-based recruitment)
 *   Variable 43: World map X position (for random troop seeding)
 *   Variable 44: World map Y position (for random troop seeding)
 *
 * Coherence System:
 * - Coherence increases when you have multiple troops from the same faction
 * - Higher coherence provides bonuses (future implementation)
 * - Calculated as: (largest faction group size / total troops) * 100
 */

var Imported = Imported || {};
Imported.ArmyManager = true;

var ArmyManager = ArmyManager || {};
ArmyManager.Params = PluginManager.parameters("ArmyManager");

ArmyManager.Params.showInMenu = String(ArmyManager.Params.showInMenu || "true").toLowerCase() === "true";
ArmyManager.Params.menuText = String(ArmyManager.Params.menuText || "Army");
ArmyManager.Params.maxArmySize = Number(ArmyManager.Params.maxArmySize || 100);

//=============================================================================
// Helper Functions
//=============================================================================

// Get localized stat label
function getStatLabel(stat) {
  const useItalian = ConfigManager.language === 'it';

  const labels = {
    HP: { en: "HP", it: "HP" },
    MP: { en: "MP", it: "MP" },
    ATK: { en: "STR", it: "FRZ" },
    DEF: { en: "CON", it: "COS" },
    MAT: { en: "INT", it: "INT" },
    MDF: { en: "WIS", it: "SAG" },
    AGI: { en: "DEX", it: "DES" },
    LUK: { en: "PSI", it: "PSI" }
  };

  return useItalian ? labels[stat].it : labels[stat].en;
}

//=============================================================================
// Game_Army - Manages army data
//=============================================================================

function Game_Army() {
  this.initialize(...arguments);
}

Game_Army.prototype.initialize = function() {
  this._troops = []; // Array of troop objects
  this._nextTroopId = 1;
  this._squads = []; // Array of squad objects
  this._nextSquadId = 1;
};

Game_Army.prototype.getTroops = function() {
  return this._troops;
};

Game_Army.prototype.getTroopCount = function() {
  return this._troops.length;
};

Game_Army.prototype.canRecruitMore = function() {
  return this._troops.length < ArmyManager.Params.maxArmySize;
};

Game_Army.prototype.addTroop = function(factionId, troopData) {
  if (!this.canRecruitMore()) {
    return false;
  }

  const troop = {
    id: this._nextTroopId++,
    factionId: factionId,
    name: troopData.name,
    name_it: troopData.name_it,
    hp: troopData.hp,
    mp: troopData.mp,
    atk: troopData.atk,
    def: troopData.def,
    mat: troopData.mat,
    mdf: troopData.mdf,
    agi: troopData.agi,
    luk: troopData.luk,
    hiringCost: troopData.hiringCost,
    weeklyCost: troopData.weeklyCost,
    role: troopData.role, // Store role for icon display
    squadId: null // Not in a squad by default
  };

  this._troops.push(troop);
  return true;
};

Game_Army.prototype.removeTroop = function(troopId) {
  const index = this._troops.findIndex(t => t.id === troopId);
  if (index >= 0) {
    this._troops.splice(index, 1);
    return true;
  }
  return false;
};

Game_Army.prototype.getTotalWeeklyCost = function() {
  return this._troops.reduce((sum, troop) => sum + troop.weeklyCost, 0);
};

Game_Army.prototype.getCoherence = function() {
  if (this._troops.length === 0) return 100;

  // Count troops by faction
  const factionCounts = {};
  for (const troop of this._troops) {
    factionCounts[troop.factionId] = (factionCounts[troop.factionId] || 0) + 1;
  }

  // Find largest faction group
  const maxCount = Math.max(...Object.values(factionCounts));

  // Coherence is percentage of largest faction group
  return Math.floor((maxCount / this._troops.length) * 100);
};

Game_Army.prototype.getFactionBreakdown = function() {
  const breakdown = {};

  for (const troop of this._troops) {
    if (!breakdown[troop.factionId]) {
      const faction = $gameFactions.getFaction(troop.factionId);
      const useItalian = ConfigManager.language === 'it';

      // Check if faction exists before accessing its properties
      let factionName = "Unknown Faction";
      if (faction) {
        factionName = useItalian && faction.name_it ? faction.name_it : faction.name;
      }

      breakdown[troop.factionId] = {
        name: factionName,
        count: 0
      };
    }
    breakdown[troop.factionId].count++;
  }

  return breakdown;
};

//=============================================================================
// Squad Management
//=============================================================================

Game_Army.prototype.getSquads = function() {
  return this._squads;
};

Game_Army.prototype.createSquad = function(troopName) {
  const squad = {
    id: this._nextSquadId++,
    name: troopName,
    leaderId: null, // Actor ID of the leader
    troopIds: [] // Array of troop IDs in this squad
  };
  this._squads.push(squad);
  return squad;
};

Game_Army.prototype.getSquadById = function(squadId) {
  return this._squads.find(s => s.id === squadId);
};

Game_Army.prototype.assignLeaderToSquad = function(squadId, actorId) {
  const squad = this.getSquadById(squadId);
  if (squad) {
    squad.leaderId = actorId;
    return true;
  }
  return false;
};

Game_Army.prototype.removeLeaderFromSquad = function(squadId) {
  const squad = this.getSquadById(squadId);
  if (squad) {
    squad.leaderId = null;
    return true;
  }
  return false;
};

Game_Army.prototype.addTroopToSquad = function(troopId, squadId) {
  const troop = this._troops.find(t => t.id === troopId);
  const squad = this.getSquadById(squadId);

  if (!troop || !squad) return false;

  // Verify troop name matches squad
  if (troop.name !== squad.name) return false;

  // Remove from old squad if any
  if (troop.squadId) {
    this.removeTroopFromSquad(troopId);
  }

  troop.squadId = squadId;
  if (!squad.troopIds.includes(troopId)) {
    squad.troopIds.push(troopId);
  }
  return true;
};

Game_Army.prototype.removeTroopFromSquad = function(troopId) {
  const troop = this._troops.find(t => t.id === troopId);
  if (!troop || !troop.squadId) return false;

  const squad = this.getSquadById(troop.squadId);
  if (squad) {
    const index = squad.troopIds.indexOf(troopId);
    if (index >= 0) {
      squad.troopIds.splice(index, 1);
    }

    // Remove empty squads
    if (squad.troopIds.length === 0) {
      const squadIndex = this._squads.findIndex(s => s.id === squad.id);
      if (squadIndex >= 0) {
        this._squads.splice(squadIndex, 1);
      }
    }
  }

  troop.squadId = null;
  return true;
};

Game_Army.prototype.getTroopWithBonuses = function(troopId) {
  const troop = this._troops.find(t => t.id === troopId);
  if (!troop) return null;

  // Create a copy with base stats
  const troopWithBonuses = { ...troop };

  // Apply squad bonuses if in a squad with a leader
  if (troop.squadId) {
    const squad = this.getSquadById(troop.squadId);
    if (squad && squad.leaderId) {
      const leader = $gameActors.actor(squad.leaderId);
      if (leader) {
        // Apply 8% of leader's stats as bonuses
        const bonusPercent = 0.08;
        troopWithBonuses.hp = Math.floor(troop.hp + leader.mhp * bonusPercent);
        troopWithBonuses.mp = Math.floor(troop.mp + leader.mmp * bonusPercent);
        troopWithBonuses.atk = Math.floor(troop.atk + leader.atk * bonusPercent);
        troopWithBonuses.def = Math.floor(troop.def + leader.def * bonusPercent);
        troopWithBonuses.mat = Math.floor(troop.mat + leader.mat * bonusPercent);
        troopWithBonuses.mdf = Math.floor(troop.mdf + leader.mdf * bonusPercent);
        troopWithBonuses.agi = Math.floor(troop.agi + leader.agi * bonusPercent);
        troopWithBonuses.luk = Math.floor(troop.luk + leader.luk * bonusPercent);
        troopWithBonuses.hasLeader = true;
        troopWithBonuses.leaderName = leader.name();
      }
    }
  }

  return troopWithBonuses;
};

Game_Army.prototype.autoOrganizeSquads = function() {
  // Group troops by name
  const troopsByName = {};
  for (const troop of this._troops) {
    if (!troopsByName[troop.name]) {
      troopsByName[troop.name] = [];
    }
    troopsByName[troop.name].push(troop);
  }

  // Create squads for troop types with 2+ troops
  for (const troopName in troopsByName) {
    const troops = troopsByName[troopName];
    if (troops.length >= 2) {
      // Create squad if it doesn't exist
      let squad = this._squads.find(s => s.name === troopName);
      if (!squad) {
        squad = this.createSquad(troopName);
      }

      // Add all troops of this type to the squad
      for (const troop of troops) {
        this.addTroopToSquad(troop.id, squad.id);
      }
    }
  }
};

//=============================================================================
// DataManager Integration
//=============================================================================

const _DataManager_createGameObjects_ArmyManager = DataManager.createGameObjects;
DataManager.createGameObjects = function() {
  _DataManager_createGameObjects_ArmyManager.call(this);
  $gameArmy = new Game_Army();
};

const _DataManager_makeSaveContents_ArmyManager = DataManager.makeSaveContents;
DataManager.makeSaveContents = function() {
  const contents = _DataManager_makeSaveContents_ArmyManager.call(this);
  contents.army = $gameArmy;
  return contents;
};

const _DataManager_extractSaveContents_ArmyManager = DataManager.extractSaveContents;
DataManager.extractSaveContents = function(contents) {
  _DataManager_extractSaveContents_ArmyManager.call(this, contents);
  $gameArmy = contents.army || new Game_Army();
};

//=============================================================================
// Menu Integration
//=============================================================================

const _Window_MenuCommand_makeCommandList_ArmyManager = Window_MenuCommand.prototype.makeCommandList;
Window_MenuCommand.prototype.makeCommandList = function() {
  _Window_MenuCommand_makeCommandList_ArmyManager.call(this);
  if (ArmyManager.Params.showInMenu && $gameArmy && $gameArmy.getTroopCount() > 0) {
    this.addCommand(ArmyManager.Params.menuText, "army", true);
    // Set icon for the newly added command
    this._list[this._list.length - 1].icon = 131;
  }
};

const _Scene_Menu_createCommandWindow_ArmyManager = Scene_Menu.prototype.createCommandWindow;
Scene_Menu.prototype.createCommandWindow = function() {
  _Scene_Menu_createCommandWindow_ArmyManager.call(this);
  this._commandWindow.setHandler("army", this.commandArmy.bind(this));
};

Scene_Menu.prototype.commandArmy = function() {
  SceneManager.push(Scene_Army);
};

//=============================================================================
// Scene_Army - Main army management scene
//=============================================================================

function Scene_Army() {
  this.initialize(...arguments);
}

Scene_Army.prototype = Object.create(Scene_MenuBase.prototype);
Scene_Army.prototype.constructor = Scene_Army;

Scene_Army.prototype.initialize = function() {
  Scene_MenuBase.prototype.initialize.call(this);
};

Scene_Army.prototype.create = function() {
  Scene_MenuBase.prototype.create.call(this);
  this.createHelpWindow();
  this.createInfoWindow();
  this.createCommandWindow();
  this.createTroopListWindow();
  this.createStatsWindow();
};

Scene_Army.prototype.createCommandWindow = function() {
  const rect = this.commandWindowRect();
  this._commandWindow = new Window_ArmyCommand(rect);
  this._commandWindow.setHandler("troops", this.commandTroops.bind(this));
  this._commandWindow.setHandler("squads", this.commandSquads.bind(this));
  this._commandWindow.setHandler("cancel", this.popScene.bind(this));
  this.addWindow(this._commandWindow);
};

Scene_Army.prototype.commandWindowRect = function() {
  const wx = 0;
  const wy = this._infoWindow.y + this._infoWindow.height;
  const ww = 200;
  const wh = this.calcWindowHeight(3, true);
  return new Rectangle(wx, wy, ww, wh);
};

Scene_Army.prototype.commandTroops = function() {
  this._troopListWindow.activate();
  this._troopListWindow.select(0);
};

Scene_Army.prototype.commandSquads = function() {
  SceneManager.push(Scene_Squads);
};

Scene_Army.prototype.createHelpWindow = function() {
  const rect = this.helpWindowRect();
  this._helpWindow = new Window_Help(rect);
  this.addWindow(this._helpWindow);
};

Scene_Army.prototype.helpWindowRect = function() {
  const wx = 0;
  const wy = 0;
  const ww = Graphics.boxWidth;
  const wh = this.calcWindowHeight(2, false);
  return new Rectangle(wx, wy, ww, wh);
};

Scene_Army.prototype.createInfoWindow = function() {
  const rect = this.infoWindowRect();
  this._infoWindow = new Window_ArmyInfo(rect);
  this.addWindow(this._infoWindow);
};

Scene_Army.prototype.infoWindowRect = function() {
  const wx = 0;
  const wy = this._helpWindow.y + this._helpWindow.height;
  const ww = Graphics.boxWidth;
  const wh = this.calcWindowHeight(3, false);
  return new Rectangle(wx, wy, ww, wh);
};

Scene_Army.prototype.createTroopListWindow = function() {
  const rect = this.troopListWindowRect();
  this._troopListWindow = new Window_TroopList(rect);
  this._troopListWindow.setHelpWindow(this._helpWindow);
  this._troopListWindow.setHandler("ok", this.onTroopOk.bind(this));
  this._troopListWindow.setHandler("cancel", this.onTroopCancel.bind(this));
  this._troopListWindow.deactivate();
  this.addWindow(this._troopListWindow);
};

Scene_Army.prototype.troopListWindowRect = function() {
  const wx = 200;
  const wy = this._commandWindow.y;
  const ww = (Graphics.boxWidth - 200) / 2;
  const wh = Graphics.boxHeight - wy;
  return new Rectangle(wx, wy, ww, wh);
};

Scene_Army.prototype.onTroopCancel = function() {
  this._troopListWindow.deselect();
  this._commandWindow.activate();
  this._statsWindow.setTroop(null);
};

Scene_Army.prototype.createStatsWindow = function() {
  const rect = this.statsWindowRect();
  this._statsWindow = new Window_TroopStats(rect);
  this._troopListWindow.setStatsWindow(this._statsWindow);
  this.addWindow(this._statsWindow);
};

Scene_Army.prototype.statsWindowRect = function() {
  const wx = 200 + (Graphics.boxWidth - 200) / 2;
  const wy = this._commandWindow.y;
  const ww = (Graphics.boxWidth - 200) / 2;
  const wh = Graphics.boxHeight - wy;
  return new Rectangle(wx, wy, ww, wh);
};

Scene_Army.prototype.onTroopOk = function() {
  const troop = this._troopListWindow.item();
  if (troop) {
    const message = "Release this troop from your army?";
    if (confirm(message)) {
      $gameArmy.removeTroop(troop.id);
      this._troopListWindow.refresh();
      this._infoWindow.refresh();
      this._statsWindow.setTroop(null);
      if (this._troopListWindow.maxItems() > 0) {
        this._troopListWindow.activate();
      } else {
        this._commandWindow.activate();
      }
    } else {
      this._troopListWindow.activate();
    }
  }
};

//=============================================================================
// Window_ArmyCommand - Command window for army menu
//=============================================================================

function Window_ArmyCommand() {
  this.initialize(...arguments);
}

Window_ArmyCommand.prototype = Object.create(Window_Command.prototype);
Window_ArmyCommand.prototype.constructor = Window_ArmyCommand;

Window_ArmyCommand.prototype.initialize = function(rect) {
  Window_Command.prototype.initialize.call(this, rect);
};

Window_ArmyCommand.prototype.makeCommandList = function() {
  this.addCommand("Troops", "troops", true);
  this.addCommand("Squads", "squads", true);
  this.addCommand("Back", "cancel", true);
};

//=============================================================================
// Window_ArmyInfo - Shows army summary
//=============================================================================

function Window_ArmyInfo() {
  this.initialize(...arguments);
}

Window_ArmyInfo.prototype = Object.create(Window_Base.prototype);
Window_ArmyInfo.prototype.constructor = Window_ArmyInfo;

Window_ArmyInfo.prototype.initialize = function(rect) {
  Window_Base.prototype.initialize.call(this, rect);
  this.refresh();
};

Window_ArmyInfo.prototype.refresh = function() {
  this.contents.clear();

  const troopCount = $gameArmy.getTroopCount();
  const maxTroops = ArmyManager.Params.maxArmySize;
  const weeklyCost = $gameArmy.getTotalWeeklyCost();
  const coherence = $gameArmy.getCoherence();

  const lineHeight = this.lineHeight();
  let y = 0;

  // Line 1: Troop count
  this.changeTextColor(ColorManager.systemColor());
  this.drawText("Troops:", 0, y, 200);
  this.changeTextColor(ColorManager.normalColor());
  this.drawText(`${troopCount} / ${maxTroops}`, 200, y, 200);

  // Line 1: Weekly cost
  this.changeTextColor(ColorManager.systemColor());
  this.drawText("Weekly Cost:", 420, y, 200);
  this.changeTextColor(ColorManager.normalColor());
  const weeklyEuros = (weeklyCost / 100).toFixed(2);
  this.drawText(`€${weeklyEuros}`, 620, y, 200);

  y += lineHeight;

  // Line 2: Coherence
  this.changeTextColor(ColorManager.systemColor());
  this.drawText("Coherence:", 0, y, 200);

  // Color coherence based on value
  if (coherence >= 80) {
    this.changeTextColor("#00FF00"); // Green
  } else if (coherence >= 60) {
    this.changeTextColor("#90EE90"); // Light green
  } else if (coherence >= 40) {
    this.changeTextColor("#FFFF00"); // Yellow
  } else {
    this.changeTextColor("#FFA500"); // Orange
  }
  this.drawText(`${coherence}%`, 200, y, 200);

  // Line 2: Faction breakdown
  this.changeTextColor(ColorManager.systemColor());
  this.drawText("Composition:", 420, y, 200);
  this.changeTextColor(ColorManager.normalColor());

  const breakdown = $gameArmy.getFactionBreakdown();
  const factionNames = Object.values(breakdown)
    .sort((a, b) => b.count - a.count)
    .slice(0, 2)
    .map(f => `${f.name} (${f.count})`)
    .join(", ");

  this.drawText(factionNames || "None", 620, y, 300);
};

//=============================================================================
// Window_TroopList - Shows list of recruited troops
//=============================================================================

function Window_TroopList() {
  this.initialize(...arguments);
}

Window_TroopList.prototype = Object.create(Window_Selectable.prototype);
Window_TroopList.prototype.constructor = Window_TroopList;

Window_TroopList.prototype.initialize = function(rect) {
  Window_Selectable.prototype.initialize.call(this, rect);
  this._data = [];
  this._statsWindow = null;
  this.refresh();
};

Window_TroopList.prototype.setStatsWindow = function(window) {
  this._statsWindow = window;
  this.updateStatsWindow();
};

Window_TroopList.prototype.maxItems = function() {
  return this._data ? this._data.length : 0;
};

Window_TroopList.prototype.item = function() {
  return this._data[this.index()];
};

Window_TroopList.prototype.makeItemList = function() {
  this._data = $gameArmy.getTroops();
};

Window_TroopList.prototype.drawItem = function(index) {
  const troop = this._data[index];
  if (!troop) return;

  const rect = this.itemLineRect(index);
  const useItalian = ConfigManager.language === 'it';
  const troopName = useItalian && troop.name_it ? troop.name_it : troop.name;

  // Determine role icon
  let roleIcon = 0;
  if (troop.role === "support") {
    roleIcon = 1;
  } else if (troop.role === "close quarters") {
    roleIcon = 2;
  } else if (troop.role === "ranged") {
    roleIcon = 3;
  }

  // Draw role icon
  if (roleIcon > 0) {
    this.drawIcon(roleIcon, rect.x, rect.y);
  }

  // Draw troop name (offset for icon)
  this.changeTextColor(ColorManager.normalColor());
  this.drawText(troopName, rect.x + 40, rect.y, rect.width - 140);

  // Draw weekly cost
  this.changeTextColor(ColorManager.systemColor());
  const weeklyEuros = (troop.weeklyCost / 100).toFixed(2);
  this.drawText(`€${weeklyEuros}/w`, rect.x + rect.width - 100, rect.y, 100, "right");
};

Window_TroopList.prototype.refresh = function() {
  this.makeItemList();
  Window_Selectable.prototype.refresh.call(this);
};

Window_TroopList.prototype.updateHelp = function() {
  const troop = this.item();
  if (troop) {
    const faction = $gameFactions.getFaction(troop.factionId);
    const useItalian = ConfigManager.language === 'it';
    const factionName = useItalian && faction.name_it ? faction.name_it : faction.name;
    this._helpWindow.setText(`${troop.name} - ${factionName}\nPress OK to release this troop from your army.`);
  } else {
    this._helpWindow.setText("No troops recruited.");
  }
};

Window_TroopList.prototype.select = function(index) {
  Window_Selectable.prototype.select.call(this, index);
  this.updateStatsWindow();
};

Window_TroopList.prototype.updateStatsWindow = function() {
  if (this._statsWindow) {
    this._statsWindow.setTroop(this.item());
  }
};

//=============================================================================
// Window_TroopStats - Shows detailed stats of selected troop
//=============================================================================

function Window_TroopStats() {
  this.initialize(...arguments);
}

Window_TroopStats.prototype = Object.create(Window_Base.prototype);
Window_TroopStats.prototype.constructor = Window_TroopStats;

Window_TroopStats.prototype.initialize = function(rect) {
  Window_Base.prototype.initialize.call(this, rect);
  this._troop = null;
};

Window_TroopStats.prototype.setTroop = function(troop) {
  if (this._troop !== troop) {
    this._troop = troop;
    this.refresh();
  }
};

Window_TroopStats.prototype.refresh = function() {
  this.contents.clear();

  if (!this._troop) {
    this.drawText("Select a troop to view stats", 0, 0, this.contents.width, "center");
    return;
  }

  const baseTroop = this._troop;
  const troop = $gameArmy.getTroopWithBonuses(baseTroop.id);
  const useItalian = ConfigManager.language === 'it';
  const troopName = useItalian && troop.name_it ? troop.name_it : troop.name;
  const faction = $gameFactions.getFaction(troop.factionId);
  const factionName = useItalian && faction.name_it ? faction.name_it : faction.name;

  const lineHeight = this.lineHeight();
  let y = 0;

  // Title
  this.changeTextColor(ColorManager.hpColor());
  this.drawText(troopName, 0, y, this.contents.width, "center");
  y += lineHeight;

  // Faction
  this.changeTextColor(ColorManager.systemColor());
  this.drawText(factionName, 0, y, this.contents.width, "center");
  y += lineHeight;

  // Leader info
  if (troop.hasLeader) {
    this.changeTextColor(ColorManager.textColor(3)); // Yellow
    this.drawText("Led by: " + troop.leaderName, 0, y, this.contents.width, "center");
    y += lineHeight;
  }

  y += lineHeight * 0.5;

  // Stats
  const stats = [
    { label: getStatLabel("HP"), base: baseTroop.hp, value: troop.hp, color: ColorManager.hpColor() },
    { label: getStatLabel("MP"), base: baseTroop.mp, value: troop.mp, color: ColorManager.mpColor() },
    { label: getStatLabel("ATK"), base: baseTroop.atk, value: troop.atk, color: ColorManager.normalColor() },
    { label: getStatLabel("DEF"), base: baseTroop.def, value: troop.def, color: ColorManager.normalColor() },
    { label: getStatLabel("MAT"), base: baseTroop.mat, value: troop.mat, color: ColorManager.normalColor() },
    { label: getStatLabel("MDF"), base: baseTroop.mdf, value: troop.mdf, color: ColorManager.normalColor() },
    { label: getStatLabel("AGI"), base: baseTroop.agi, value: troop.agi, color: ColorManager.normalColor() },
    { label: getStatLabel("LUK"), base: baseTroop.luk, value: troop.luk, color: ColorManager.normalColor() }
  ];

  for (let i = 0; i < stats.length; i++) {
    const stat = stats[i];
    const x = (i % 2) * (this.contents.width / 2);

    this.changeTextColor(ColorManager.systemColor());
    this.drawText(stat.label + ":", x, y, 60);
    this.changeTextColor(stat.color);

    if (stat.value > stat.base) {
      // Show bonus
      this.drawText(stat.value, x + 60, y, 60);
      this.changeTextColor(ColorManager.textColor(3)); // Yellow for bonus
      this.drawText("(+" + (stat.value - stat.base) + ")", x + 120, y, 80);
    } else {
      this.drawText(stat.value, x + 60, y, 100);
    }

    if (i % 2 === 1) {
      y += lineHeight;
    }
  }

  y += lineHeight;

  // Costs
  this.changeTextColor(ColorManager.systemColor());
  this.drawText("Hiring Cost:", 0, y, 200);
  this.changeTextColor(ColorManager.normalColor());
  const hiringEuros = (troop.hiringCost / 100).toFixed(2);
  this.drawText(`€${hiringEuros}`, 200, y, 150);
  y += lineHeight;

  this.changeTextColor(ColorManager.systemColor());
  this.drawText("Weekly Upkeep:", 0, y, 200);
  this.changeTextColor(ColorManager.normalColor());
  const weeklyEuros = (troop.weeklyCost / 100).toFixed(2);
  this.drawText(`€${weeklyEuros}`, 200, y, 150);
};

//=============================================================================
// Scene_BuyTroops - Troop recruitment scene
//=============================================================================

function Scene_BuyTroops() {
  this.initialize(...arguments);
}

Scene_BuyTroops.prototype = Object.create(Scene_MenuBase.prototype);
Scene_BuyTroops.prototype.constructor = Scene_BuyTroops;

Scene_BuyTroops.prototype.initialize = function() {
  Scene_MenuBase.prototype.initialize.call(this);
};

Scene_BuyTroops.prototype.prepare = function(factionId) {
  this._factionId = factionId;
};

Scene_BuyTroops.prototype.create = function() {
  Scene_MenuBase.prototype.create.call(this);
  this.createHelpWindow();
  this.createGoldWindow();
  this.createTroopShopWindow();
  this.createStatsWindow();
};

Scene_BuyTroops.prototype.createHelpWindow = function() {
  const rect = this.helpWindowRect();
  this._helpWindow = new Window_Help(rect);
  this.addWindow(this._helpWindow);
};

Scene_BuyTroops.prototype.helpWindowRect = function() {
  const wx = 0;
  const wy = 0;
  const ww = Graphics.boxWidth;
  const wh = this.calcWindowHeight(2, false);
  return new Rectangle(wx, wy, ww, wh);
};

Scene_BuyTroops.prototype.createGoldWindow = function() {
  const rect = this.goldWindowRect();
  this._goldWindow = new Window_Gold(rect);
  this.addWindow(this._goldWindow);
};

Scene_BuyTroops.prototype.goldWindowRect = function() {
  const wx = 0;
  const wy = this._helpWindow.y + this._helpWindow.height;
  const ww = Graphics.boxWidth;
  const wh = this.calcWindowHeight(1, false);
  return new Rectangle(wx, wy, ww, wh);
};

Scene_BuyTroops.prototype.createTroopShopWindow = function() {
  const rect = this.troopShopWindowRect();
  this._troopShopWindow = new Window_TroopShop(rect);
  this._troopShopWindow.setHelpWindow(this._helpWindow);
  this._troopShopWindow.setHandler("ok", this.onBuyOk.bind(this));
  this._troopShopWindow.setHandler("cancel", this.popScene.bind(this));
  this._troopShopWindow.setFactionFilter(this._factionId);
  this._troopShopWindow.activate();
  this._troopShopWindow.select(0);
  this.addWindow(this._troopShopWindow);
};

Scene_BuyTroops.prototype.troopShopWindowRect = function() {
  const wx = 0;
  const wy = this._goldWindow.y + this._goldWindow.height;
  const ww = Graphics.boxWidth / 2;
  const wh = Graphics.boxHeight - wy;
  return new Rectangle(wx, wy, ww, wh);
};

Scene_BuyTroops.prototype.createStatsWindow = function() {
  const rect = this.statsWindowRect();
  this._statsWindow = new Window_RecruitStats(rect);
  this._troopShopWindow.setStatsWindow(this._statsWindow);
  this.addWindow(this._statsWindow);
};

Scene_BuyTroops.prototype.statsWindowRect = function() {
  const wx = Graphics.boxWidth / 2;
  const wy = this._goldWindow.y + this._goldWindow.height;
  const ww = Graphics.boxWidth / 2;
  const wh = Graphics.boxHeight - wy;
  return new Rectangle(wx, wy, ww, wh);
};

Scene_BuyTroops.prototype.onBuyOk = function() {
  const item = this._troopShopWindow.item();
  if (!item) {
    this._troopShopWindow.activate();
    return;
  }

  if (!$gameArmy.canRecruitMore()) {
    SoundManager.playBuzzer();
    this._helpWindow.setText("Army is at maximum capacity!");
    this._troopShopWindow.activate();
    return;
  }

  if ($gameParty.gold() < item.troop.hiringCost) {
    SoundManager.playBuzzer();
    this._helpWindow.setText("Not enough money to recruit this troop!");
    this._troopShopWindow.activate();
    return;
  }

  // Recruit the troop
  $gameParty.loseGold(item.troop.hiringCost);
  $gameArmy.addTroop(item.factionId, item.troop);

  // Increase reputation by 1 with the faction
  if ($gameFactions && item.factionId !== undefined && item.factionId >= 0) {
    $gameFactions.changeReputation(item.factionId, 1);
  }

  SoundManager.playShop();

  this._goldWindow.refresh();
  this._troopShopWindow.activate();

  const useItalian = ConfigManager.language === 'it';
  const troopName = useItalian && item.troop.name_it ? item.troop.name_it : item.troop.name;
  this._helpWindow.setText(`Recruited ${troopName}! (${$gameArmy.getTroopCount()}/${ArmyManager.Params.maxArmySize})`);
};

//=============================================================================
// Window_TroopShop - Shows available troops for purchase
//=============================================================================

function Window_TroopShop() {
  this.initialize(...arguments);
}

Window_TroopShop.prototype = Object.create(Window_Selectable.prototype);
Window_TroopShop.prototype.constructor = Window_TroopShop;

Window_TroopShop.prototype.initialize = function(rect) {
  Window_Selectable.prototype.initialize.call(this, rect);
  this._data = [];
  this._factionId = -1;
  this._statsWindow = null;
  this.refresh();
};

Window_TroopShop.prototype.setStatsWindow = function(window) {
  this._statsWindow = window;
  this.updateStatsWindow();
};

Window_TroopShop.prototype.setFactionFilter = function(factionId) {
  this._factionId = factionId !== undefined ? factionId : -1;
  this.refresh();
  this.select(0);
};

Window_TroopShop.prototype.maxItems = function() {
  return this._data ? this._data.length : 0;
};

Window_TroopShop.prototype.item = function() {
  return this._data[this.index()];
};

Window_TroopShop.prototype.makeItemList = function() {
  this._data = [];

  const allFactions = $gameFactions.getAllFactions();

  if (this._factionId === -1 || this._factionId === undefined) {
    // Get country ID from variable 86
    const countryId = $gameVariables.value(86);

    // Look up country in Countries data
    let countryFaction = null;
    if (window.Countries && window.Countries.Countries) {
      const country = window.Countries.Countries.find(c => c.id === countryId);
      if (country && country.faction && country.faction !== "") {
        countryFaction = country.faction;
      }
    }

    if (countryFaction) {
      // Show troops from country's faction and subfactions
      const mainFaction = allFactions.find(f => f && f.name === countryFaction);

      if (mainFaction) {
        // Add main faction troops
        if (mainFaction.troops && mainFaction.troops.length > 0) {
          for (const troop of mainFaction.troops) {
            this._data.push({ factionId: mainFaction.id, troop: troop });
          }
        }

        // Add subfaction troops (factions with parentFaction matching main faction id)
        for (const faction of allFactions) {
          if (!faction) continue;

          if (faction.parentFaction === mainFaction.id && faction.troops && faction.troops.length > 0) {
            for (const troop of faction.troops) {
              this._data.push({ factionId: faction.id, troop: troop });
            }
          }
        }
      }
    } else {
      // No faction for this country - show random troops seeded by world position
      const worldX = $gameVariables.value(43) || 0;
      const worldY = $gameVariables.value(44) || 0;
      const seed = worldX * 1000 + worldY;

      // Seeded random number generator
      const seededRandom = (function(s) {
        return function() {
          s = Math.sin(s) * 10000;
          return s - Math.floor(s);
        };
      })(seed);

      // Get factions with troops
      const factionsWithTroops = allFactions.filter(f => f && f.troops && f.troops.length > 0);

      if (factionsWithTroops.length > 0) {
        // Select 3-5 random factions
        const numFactions = 3 + Math.floor(seededRandom() * 3); // 3-5 factions
        const selectedFactions = [];

        for (let i = 0; i < numFactions && selectedFactions.length < factionsWithTroops.length; i++) {
          const index = Math.floor(seededRandom() * factionsWithTroops.length);
          const faction = factionsWithTroops[index];
          if (!selectedFactions.includes(faction)) {
            selectedFactions.push(faction);
          }
        }

        // Add 2-4 random troops from each selected faction
        for (const faction of selectedFactions) {
          const numTroops = 2 + Math.floor(seededRandom() * 3); // 2-4 troops per faction
          const troopIndices = [];

          for (let i = 0; i < numTroops && troopIndices.length < faction.troops.length; i++) {
            const index = Math.floor(seededRandom() * faction.troops.length);
            if (!troopIndices.includes(index)) {
              troopIndices.push(index);
              this._data.push({ factionId: faction.id, troop: faction.troops[index] });
            }
          }
        }
      }
    }
  } else {
    // Show troops from specific faction
    const faction = allFactions.find(f => f && f.id === this._factionId);
    if (faction && faction.troops) {
      for (const troop of faction.troops) {
        this._data.push({ factionId: faction.id, troop: troop });
      }
    }
  }
};

Window_TroopShop.prototype.drawItem = function(index) {
  const item = this._data[index];
  if (!item) return;

  const troop = item.troop;
  const rect = this.itemLineRect(index);
  const useItalian = ConfigManager.language === 'it';
  const troopName = useItalian && troop.name_it ? troop.name_it : troop.name;

  // Check if affordable
  const canAfford = $gameParty.gold() >= troop.hiringCost;
  this.changePaintOpacity(canAfford);

  // Determine role icon
  let roleIcon = 87;
  if (troop.role === "support") {
    roleIcon = 81;
  } else if (troop.role === "close quarters") {
    roleIcon = 96;
  } else if (troop.role === "ranged") {
    roleIcon = 102;
  }

  // Draw role icon
  if (roleIcon > 0) {
    this.drawIcon(roleIcon, rect.x, rect.y);
  }

  // Draw troop name (offset for icon)
  this.changeTextColor(ColorManager.normalColor());
  this.drawText(troopName, rect.x + 40, rect.y, rect.width - 40);

  this.changePaintOpacity(true);
};

Window_TroopShop.prototype.refresh = function() {
  this.makeItemList();
  Window_Selectable.prototype.refresh.call(this);
};

Window_TroopShop.prototype.updateHelp = function() {
  const item = this.item();
  if (item) {
    const troop = item.troop;
    const faction = $gameFactions.getFaction(item.factionId);
    const useItalian = ConfigManager.language === 'it';
    const troopName = useItalian && troop.name_it ? troop.name_it : troop.name;
    const factionName = faction ? (useItalian && faction.name_it ? faction.name_it : faction.name) : "Unknown";
    const hiringEuros = (troop.hiringCost / 100).toFixed(2);
    const weeklyEuros = (troop.weeklyCost / 100).toFixed(2);
    this._helpWindow.setText(`${troopName} (${factionName})\nHire: €${hiringEuros} | Upkeep: €${weeklyEuros}/week`);
  } else {
    this._helpWindow.setText("No troops available to recruit.");
  }
};

Window_TroopShop.prototype.select = function(index) {
  Window_Selectable.prototype.select.call(this, index);
  this.updateStatsWindow();
};

Window_TroopShop.prototype.updateStatsWindow = function() {
  if (this._statsWindow) {
    this._statsWindow.setTroop(this.item());
  }
};

//=============================================================================
// Window_RecruitStats - Shows stats for troop being recruited
//=============================================================================

function Window_RecruitStats() {
  this.initialize(...arguments);
}

Window_RecruitStats.prototype = Object.create(Window_Base.prototype);
Window_RecruitStats.prototype.constructor = Window_RecruitStats;

Window_RecruitStats.prototype.initialize = function(rect) {
  Window_Base.prototype.initialize.call(this, rect);
  this._item = null;
};

Window_RecruitStats.prototype.setTroop = function(item) {
  if (this._item !== item) {
    this._item = item;
    this.refresh();
  }
};

Window_RecruitStats.prototype.refresh = function() {
  this.contents.clear();

  if (!this._item || !this._item.troop) {
    this.drawText("Select a troop", 0, 0, this.contents.width, "center");
    return;
  }

  const troop = this._item.troop;
  const useItalian = ConfigManager.language === 'it';
  const troopName = useItalian && troop.name_it ? troop.name_it : troop.name;
  const faction = $gameFactions.getFaction(this._item.factionId);

  // Check if faction exists before accessing its properties
  if (!faction) {
    this.drawText("Faction not found", 0, 0, this.contents.width, "center");
    return;
  }

  const factionName = useItalian && faction.name_it ? faction.name_it : faction.name;

  const lineHeight = this.lineHeight();
  let y = 0;

  // Title
  this.changeTextColor(ColorManager.hpColor());
  this.drawText(troopName, 0, y, this.contents.width, "center");
  y += lineHeight;

  // Faction
  this.changeTextColor(ColorManager.systemColor());
  this.drawText(factionName, 0, y, this.contents.width, "center");
  y += lineHeight * 1.5;

  // Stats (compact 2-column layout)
  const stats = [
    { label: getStatLabel("HP"), value: troop.hp },
    { label: getStatLabel("MP"), value: troop.mp },
    { label: getStatLabel("ATK"), value: troop.atk },
    { label: getStatLabel("DEF"), value: troop.def },
    { label: getStatLabel("MAT"), value: troop.mat },
    { label: getStatLabel("MDF"), value: troop.mdf },
    { label: getStatLabel("AGI"), value: troop.agi },
    { label: getStatLabel("LUK"), value: troop.luk }
  ];

  for (let i = 0; i < stats.length; i++) {
    const stat = stats[i];
    const x = (i % 2) * (this.contents.width / 2);

    this.changeTextColor(ColorManager.systemColor());
    this.drawText(stat.label, x, y, 50);
    this.changeTextColor(ColorManager.normalColor());
    this.drawText(stat.value, x + 50, y, 80);

    if (i % 2 === 1) {
      y += lineHeight;
    }
  }
};

//=============================================================================
// Scene_Squads - Squad management scene
//=============================================================================

function Scene_Squads() {
  this.initialize(...arguments);
}

Scene_Squads.prototype = Object.create(Scene_MenuBase.prototype);
Scene_Squads.prototype.constructor = Scene_Squads;

Scene_Squads.prototype.initialize = function() {
  Scene_MenuBase.prototype.initialize.call(this);
};

Scene_Squads.prototype.create = function() {
  Scene_MenuBase.prototype.create.call(this);

  // Auto-organize squads when entering
  $gameArmy.autoOrganizeSquads();

  this.createHelpWindow();
  this.createSquadListWindow();
  this.createLeaderSelectWindow();
};

Scene_Squads.prototype.createHelpWindow = function() {
  const rect = this.helpWindowRect();
  this._helpWindow = new Window_Help(rect);
  this._helpWindow.setText("Assign party members to lead squads of the same troop type.\nLeaders provide stat bonuses based on their stats (+8%).");
  this.addWindow(this._helpWindow);
};

Scene_Squads.prototype.helpWindowRect = function() {
  const wx = 0;
  const wy = 0;
  const ww = Graphics.boxWidth;
  const wh = this.calcWindowHeight(3, false);
  return new Rectangle(wx, wy, ww, wh);
};

Scene_Squads.prototype.createSquadListWindow = function() {
  const rect = this.squadListWindowRect();
  this._squadListWindow = new Window_SquadList(rect);
  this._squadListWindow.setHelpWindow(this._helpWindow);
  this._squadListWindow.setHandler("ok", this.onSquadOk.bind(this));
  this._squadListWindow.setHandler("cancel", this.popScene.bind(this));
  this._squadListWindow.activate();
  this._squadListWindow.select(0);
  this.addWindow(this._squadListWindow);
};

Scene_Squads.prototype.squadListWindowRect = function() {
  const wx = 0;
  const wy = this._helpWindow.y + this._helpWindow.height;
  const ww = Math.floor(Graphics.boxWidth * 0.8);
  const wh = Graphics.boxHeight - wy;
  return new Rectangle(wx, wy, ww, wh);
};

Scene_Squads.prototype.createLeaderSelectWindow = function() {
  const rect = this.leaderSelectWindowRect();
  this._leaderSelectWindow = new Window_LeaderSelect(rect);
  this._leaderSelectWindow.setHandler("ok", this.onLeaderOk.bind(this));
  this._leaderSelectWindow.setHandler("cancel", this.onLeaderCancel.bind(this));
  this._leaderSelectWindow.deactivate();
  this._leaderSelectWindow.hide();
  this.addWindow(this._leaderSelectWindow);
};

Scene_Squads.prototype.leaderSelectWindowRect = function() {
  const wx = Math.floor(Graphics.boxWidth * 0.8);
  const wy = this._helpWindow.y + this._helpWindow.height;
  const ww = Graphics.boxWidth - wx;
  const wh = Graphics.boxHeight - wy;
  return new Rectangle(wx, wy, ww, wh);
};

Scene_Squads.prototype.onSquadOk = function() {
  this._leaderSelectWindow.setSquad(this._squadListWindow.item());
  this._leaderSelectWindow.show();
  this._leaderSelectWindow.activate();
  this._leaderSelectWindow.select(0);
};

Scene_Squads.prototype.onLeaderOk = function() {
  const squad = this._squadListWindow.item();
  const leader = this._leaderSelectWindow.item();

  if (leader && leader.actorId === -1) {
    // Remove leader
    $gameArmy.removeLeaderFromSquad(squad.id);
  } else if (leader) {
    // Assign leader
    $gameArmy.assignLeaderToSquad(squad.id, leader.actorId);
  }

  this._squadListWindow.refresh();
  this._leaderSelectWindow.refresh();
  this._leaderSelectWindow.activate();
};

Scene_Squads.prototype.onLeaderCancel = function() {
  this._leaderSelectWindow.hide();
  this._leaderSelectWindow.deactivate();
  this._squadListWindow.activate();
};

//=============================================================================
// Window_SquadList - Shows list of squads
//=============================================================================

function Window_SquadList() {
  this.initialize(...arguments);
}

Window_SquadList.prototype = Object.create(Window_Selectable.prototype);
Window_SquadList.prototype.constructor = Window_SquadList;

Window_SquadList.prototype.initialize = function(rect) {
  Window_Selectable.prototype.initialize.call(this, rect);
  this._data = [];
  this.refresh();
};

Window_SquadList.prototype.maxItems = function() {
  return this._data ? this._data.length : 0;
};

Window_SquadList.prototype.item = function() {
  return this._data[this.index()];
};

Window_SquadList.prototype.makeItemList = function() {
  this._data = $gameArmy.getSquads();
};

Window_SquadList.prototype.drawItem = function(index) {
  const squad = this._data[index];
  if (!squad) return;

  const rect = this.itemLineRect(index);

  // Squad name and troop count
  this.changeTextColor(ColorManager.normalColor());
  this.drawText(squad.name, rect.x + 4, rect.y, rect.width - 240);

  // Troop count
  this.changeTextColor(ColorManager.systemColor());
  this.drawText(`Troops:`, rect.x + rect.width - 220, rect.y, 70);
  this.changeTextColor(ColorManager.normalColor());
  this.drawText(squad.troopIds.length, rect.x + rect.width - 150, rect.y, 40);

  // Leader name or status
  if (squad.leaderId) {
    const leader = $gameActors.actor(squad.leaderId);
    if (leader) {
      this.changeTextColor(ColorManager.systemColor());
      this.drawText("Leader:", rect.x + rect.width - 100, rect.y, 100);
      this.changeTextColor(ColorManager.textColor(3)); // Yellow
      this.drawText(leader.name(), rect.x + rect.width + 50, rect.y, 150, "left");
    }
  } else {
    this.changeTextColor(ColorManager.textColor(8)); // Gray
    this.drawText("No Leader", rect.x + rect.width - 100, rect.y, 100);
  }
};

Window_SquadList.prototype.refresh = function() {
  this.makeItemList();
  Window_Selectable.prototype.refresh.call(this);
};

Window_SquadList.prototype.updateHelp = function() {
  const squad = this.item();
  if (squad) {
    let text = `Squad: ${squad.name} (${squad.troopIds.length} troops)\n`;
    if (squad.leaderId) {
      const leader = $gameActors.actor(squad.leaderId);
      if (leader) {
        text += `Leader: ${leader.name()} - Providing stat bonuses (+8%)`;
      }
    } else {
      text += "No leader assigned. Select to assign a party member.";
    }
    this._helpWindow.setText(text);
  } else {
    this._helpWindow.setText("No squads available. Recruit at least 2 of the same troop type.");
  }
};

//=============================================================================
// Window_LeaderSelect - Shows party members to assign as leaders
//=============================================================================

function Window_LeaderSelect() {
  this.initialize(...arguments);
}

Window_LeaderSelect.prototype = Object.create(Window_Selectable.prototype);
Window_LeaderSelect.prototype.constructor = Window_LeaderSelect;

Window_LeaderSelect.prototype.initialize = function(rect) {
  Window_Selectable.prototype.initialize.call(this, rect);
  this._data = [];
  this._squad = null;
  this.refresh();
};

Window_LeaderSelect.prototype.setSquad = function(squad) {
  this._squad = squad;
  this.refresh();
};

Window_LeaderSelect.prototype.maxItems = function() {
  return this._data ? this._data.length : 0;
};

Window_LeaderSelect.prototype.item = function() {
  return this._data[this.index()];
};

Window_LeaderSelect.prototype.makeItemList = function() {
  this._data = [];

  if (!this._squad) return;

  // Add "Remove Leader" option if squad has a leader
  if (this._squad.leaderId) {
    this._data.push({ actorId: -1, name: "Remove Leader" });
  }

  // Add all party members
  const members = $gameParty.members();
  for (const member of members) {
    this._data.push({ actorId: member.actorId(), name: member.name() });
  }
};

Window_LeaderSelect.prototype.drawItem = function(index) {
  const item = this._data[index];
  if (!item) return;

  const rect = this.itemLineRect(index);

  if (item.actorId === -1) {
    this.changeTextColor(ColorManager.textColor(2)); // Red
    this.drawText("Remove", rect.x + 4, rect.y, rect.width);
  } else {
    const actor = $gameActors.actor(item.actorId);
    if (actor) {
      // Check if already leading a squad
      const isLeading = $gameArmy.getSquads().some(s => s.leaderId === item.actorId && s.id !== this._squad.id);

      if (isLeading) {
        this.changePaintOpacity(false);
      }

      // Draw actor name
      this.changeTextColor(ColorManager.normalColor());
      this.drawText(actor.name(), rect.x + 4, rect.y, rect.width - 8);

      this.changePaintOpacity(true);
    }
  }
};

Window_LeaderSelect.prototype.refresh = function() {
  this.makeItemList();
  Window_Selectable.prototype.refresh.call(this);
};

Window_LeaderSelect.prototype.isCurrentItemEnabled = function() {
  const item = this.item();
  if (!item) return false;

  if (item.actorId === -1) return true; // Remove leader is always enabled

  // Check if actor is already leading another squad
  return !$gameArmy.getSquads().some(s => s.leaderId === item.actorId && s.id !== this._squad.id);
};

//=============================================================================
// Plugin Commands
//=============================================================================

PluginManager.registerCommand("ArmyManager", "buyTroops", args => {
  const factionId = Number(args.factionId || -1);
  SceneManager.push(Scene_BuyTroops);
  SceneManager.prepareNextScene(factionId);
});

PluginManager.registerCommand("ArmyManager", "debugAddTroops", args => {
  // Get all factions with troops
  const allFactions = $gameFactions.getAllFactions();
  const factionsWithTroops = allFactions.filter(f => f.troops && f.troops.length > 0);

  if (factionsWithTroops.length === 0) {
    console.warn("[ArmyManager] No factions with troops available!");
    return;
  }

  // Pick a random faction
  const randomFaction = factionsWithTroops[Math.floor(Math.random() * factionsWithTroops.length)];

  const useItalian = ConfigManager.language === 'it';
  const factionName = useItalian && randomFaction.name_it ? randomFaction.name_it : randomFaction.name;

  // Add ALL troop types from the faction
  let totalAdded = 0;
  const troopCounts = {};

  for (const troop of randomFaction.troops) {
    let addedCount = 0;

    // Add 10 of each troop type (or until max capacity)
    for (let i = 0; i < 10; i++) {
      if ($gameArmy.canRecruitMore()) {
        $gameArmy.addTroop(randomFaction.id, troop);
        addedCount++;
        totalAdded++;
      } else {
        console.warn(`[ArmyManager] Army at max capacity! Only added ${totalAdded} troops total.`);
        break;
      }
    }

    if (addedCount > 0) {
      const troopName = useItalian && troop.name_it ? troop.name_it : troop.name;
      troopCounts[troopName] = addedCount;
    }

    // Stop if we hit max capacity
    if (!$gameArmy.canRecruitMore()) break;
  }

  console.log(`[ArmyManager] Added ${totalAdded} troops from ${factionName}:`);
  for (const [troopName, count] of Object.entries(troopCounts)) {
    console.log(`  - ${count}x ${troopName}`);
  }
  console.log(`[ArmyManager] Total troops: ${$gameArmy.getTroopCount()}/${ArmyManager.Params.maxArmySize}`);
});

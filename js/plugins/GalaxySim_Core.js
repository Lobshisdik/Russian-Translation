/*:
 * @target MZ
 * @plugindesc GalaxySim Core - Main plugin entry point for modular galaxy simulation
 * @author Omni-Lex + Nocoldiz
 * @url
 * @help
 * ============================================================================
 * GalaxySim Core Module
 * ============================================================================
 * This is the main entry point for the modular GalaxySim system.
 *
 * REQUIRED MODULE LOAD ORDER:
 * 1. GalaxySimDB.js (external database)
 * 2. GalaxySim_Math.js
 * 3. GalaxySim_DataManager.js
 * 4. GalaxySim_Renderer_Planets.js
 * 5. GalaxySim_Renderer_Stars.js
 * 6. GalaxySim_Renderer_Cosmology.js
 * 7. GalaxySim_Renderer_Effects.js
 * 8. GalaxySim_Scene.js
 * 9. GalaxySim_Core.js (this file - load last)
 *
 * ============================================================================
 * Plugin Commands
 * ============================================================================
 * OpenStarMap - Opens the star map scene
 * SetCurrentSystem <systemName> - Sets the current system
 *
 * ============================================================================
 * Variables Used
 * ============================================================================
 * Variable 94: Ship speed multiplier
 * Variable 95: Fuel level
 * Variable 96: Current star system
 * Variable 97: Target star system
 *
 * @command OpenStarMap
 * @text Open Star Map
 * @desc Opens the advanced star map interface
 *
 * @command SetCurrentSystem
 * @text Set Current System
 * @desc Sets the player's current star system
 *
 * @arg systemName
 * @text System Name
 * @desc Name of the star system (e.g., "Sol", "Alpha Centauri")
 * @type string
 * @default Sol
 */

(() => {
  "use strict";

  const pluginName = "GalaxySim_Core";

  // ============================================================================
  // Check Dependencies
  // ============================================================================

  if (!window.GalaxyData) {
    throw new Error("GalaxySim_Core requires GalaxySimDB.js to be loaded first");
  }

  if (!window.GalaxySim) {
    throw new Error("GalaxySim_Core: GalaxySim namespace not found. Ensure all modules are loaded.");
  }

  const requiredModules = ['Math', 'DataManager', 'Renderers'];
  requiredModules.forEach((module) => {
    if (!window.GalaxySim[module]) {
      throw new Error(`GalaxySim_Core: Missing required module: ${module}`);
    }
  });

  if (!window.GalaxySim.Renderers.PlanetRenderer) {
    throw new Error("GalaxySim_Core: PlanetRenderer not found");
  }

  if (!window.Scene_AdvancedStarMap) {
    throw new Error("GalaxySim_Core: Scene_AdvancedStarMap not found. Ensure GalaxySim_Scene.js is loaded.");
  }

  console.log("GalaxySim: All modules loaded successfully");

  // ============================================================================
  // Plugin Commands
  // ============================================================================

  PluginManager.registerCommand(pluginName, "OpenStarMap", (args) => {
    SceneManager.push(Scene_AdvancedStarMap);
  });

  PluginManager.registerCommand(pluginName, "SetCurrentSystem", (args) => {
    const systemName = args.systemName || "Sol";

    if (!$gameSystem.starMapData) {
      $gameSystem.starMapData = new window.GalaxySim.DataManager();
    }

    $gameSystem.starMapData.setCurrentSystem(systemName);
    $gameVariables.setValue(96, systemName);
    console.log(`Current system set to: ${systemName}`);
  });

  // ============================================================================
  // Game_System Integration
  // ============================================================================

  const _Game_System_initialize = Game_System.prototype.initialize;
  Game_System.prototype.initialize = function () {
    _Game_System_initialize.call(this);
    this.starMapData = new window.GalaxySim.DataManager();
  };

  // ============================================================================
  // DataManager Save/Load Integration
  // ============================================================================

  const _DataManager_makeSaveContents = DataManager.makeSaveContents;
  DataManager.makeSaveContents = function () {
    const contents = _DataManager_makeSaveContents.call(this);

    if ($gameSystem.starMapData) {
      contents.starMapData = $gameSystem.starMapData.toJSON();
    }

    return contents;
  };

  const _DataManager_extractSaveContents = DataManager.extractSaveContents;
  DataManager.extractSaveContents = function (contents) {
    _DataManager_extractSaveContents.call(this, contents);

    if (contents.starMapData) {
      $gameSystem.starMapData = new window.GalaxySim.DataManager();
      $gameSystem.starMapData.fromJSON(contents.starMapData);
    }
  };

  // ============================================================================
  // Helper Functions (exposed globally)
  // ============================================================================

  window.GalaxySim.openStarMap = function () {
    SceneManager.push(Scene_AdvancedStarMap);
  };

  window.GalaxySim.getDataManager = function () {
    if (!$gameSystem.starMapData) {
      $gameSystem.starMapData = new window.GalaxySim.DataManager();
    }
    return $gameSystem.starMapData;
  };

  window.GalaxySim.getCurrentSystem = function () {
    const dataManager = window.GalaxySim.getDataManager();
    return dataManager.getSystem(dataManager.currentSystem);
  };

  window.GalaxySim.setCurrentSystem = function (systemName) {
    const dataManager = window.GalaxySim.getDataManager();
    dataManager.setCurrentSystem(systemName);
    $gameVariables.setValue(96, systemName);
  };

  console.log("GalaxySim_Core: Plugin initialized successfully");

})();

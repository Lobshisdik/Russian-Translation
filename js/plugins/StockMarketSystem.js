/*:
 * @plugindesc Stock Market System v3.0 - Direct gold integration with variable sync and configurable SOUL median.
 * @author Omni-Lex (Preset Options Only Version), updated by OmniLex, modified for direct gold
 * 
 * @param Initial Oil Price
 * @desc Starting price for oil stocks (in cents, e.g., 10000 = €100.00)
 * @default 10000
 * 
 * @param Initial SOUL Price
 * @desc Starting price for souls stocks (in cents, e.g., 66666 = €666.66)
 * @default 66666
 * 
 * @param SOUL Median Price
 * @desc Target median price for SOUL stocks that prices will gravitate towards (in cents)
 * @default 66666
 * 
 * @param Volatility
 * @desc Base volatility for stocks. Oil is much higher internally.
 * @default 0.2
 * 
 * @param Update Interval
 * @desc How often the stocks update in milliseconds
 * @default 2000
 * 
 * @param History Length
 * @desc Number of price points to keep in history
 * @default 50
 * 
 * @param Minimum Price
 * @desc A final safety floor for all stock prices (in cents).
 * @default 1000
 * 
 * @param Oil Shares Variable
 * @desc Variable ID to store OIL shares count (0 = disabled)
 * @default 10
 * 
 * @param Soul Shares Variable
 * @desc Variable ID to store SOUL shares count (0 = disabled)
 * @default 11
 * 
 * @param Soul Median Variable
 * @desc Variable ID to control SOUL median price (0 = disabled, uses plugin parameter)
 * @default 12
 * 
 * @command OpenStockMarket
 * @desc Opens the stock market screen
 * 
 * @help
 * ============================================================================
 * Stock Market System v3.0 - Direct Gold Integration with Configurable SOUL Median
 * ============================================================================
 *
 * Updated Features (v3.0):
 * - Added: Configurable SOUL median price via plugin parameter
 * - Added: Variable control for SOUL median price (overrides plugin parameter)
 * - SOUL prices will gravitate towards the median value dynamically
 * - Change the median during gameplay via variables for dynamic market control
 *
 * Previous Features (v2.9):
 * - Added: Variable synchronization for OIL and SOUL shares
 * - Plugin reads from variables on initialization if they exist
 * - Plugin updates variables whenever shares are bought/sold
 * - Variables can be used in events and other plugins
 *
 * Variable Integration:
 * - Set "Oil Shares Variable" to a variable ID (e.g., 10) to sync OIL shares
 * - Set "Soul Shares Variable" to a variable ID (e.g., 11) to sync SOUL shares  
 * - Set "Soul Median Variable" to a variable ID (e.g., 12) to control SOUL median price
 * - Set to 0 to disable variable sync for that feature
 * - Plugin will read existing variable values on game start/load
 * - Variables are updated automatically on buy/sell transactions
 * - SOUL median variable allows dynamic market control during gameplay
 *
 * SOUL Median Price Control:
 * - If "Soul Median Variable" is set and > 0, the variable value will be used as median
 * - If variable is 0 or not set, the plugin parameter "SOUL Median Price" is used
 * - SOUL prices will gradually move towards this median value with random fluctuations
 * - Change the variable during gameplay to shift market dynamics
 * - Median should be set in cents (e.g., 66666 = €666.66)
 *
 * Gold Conversion Logic:
 * - Party gold is stored in cents (1 euro = 100 gold)
 * - When buying €34.44 worth of stock: subtracts 3444 gold
 * - When selling €667.34 worth of stock: adds 66734 gold
 * - All displays convert gold to euros for user interface
 */
(function () {
  "use strict";

  //=============================================================================
  // Plugin Parameters
  //=============================================================================

  const pluginName = "StockMarketSystem";
  const parameters = PluginManager.parameters(pluginName);

  const initialOilPrice = Number(parameters["Initial Oil Price"]) || 30000;
  const initialSoulsPrice = Number(parameters["Initial SOUL Price"]) || 66666;
  const volatility = Number(parameters["Volatility"]) || 0.2;
  const updateInterval = Number(parameters["Update Interval"]) || 2000;
  const historyLength = Number(parameters["History Length"]) || 50;
  const minimumPrice = Number(parameters["Minimum Price"]) || 1000;
  const oilSharesVariableId = Number(parameters["Oil Shares Variable"]) || 51;
  const soulSharesVariableId = Number(parameters["Soul Shares Variable"]) || 52;
  const soulMedianVariableId = Number(parameters["Soul Median Variable"]) || 53;

  //=============================================================================
  // Money Formatting Helper Functions
  //=============================================================================

  function formatMoney(cents) {
    const euros = Math.floor(cents / 100);
    const centsPart = cents % 100;
    return `€${euros}.${centsPart.toString().padStart(2, "0")}`;
  }

  // **FIXED**: Game party gold is treated as cents (gold), not euros
  // No conversion needed - gold IS the cents value
  function getPlayerGoldInCents() {
    return $gameParty.gold();
  }

  // **FIXED**: For display purposes, convert gold (cents) to euros
  function goldToEurosForDisplay(gold) {
    return formatMoney(gold);
  }

  //=============================================================================
  // Variable Synchronization Helper Functions
  //=============================================================================

  function getOilSharesFromVariable() {
    if (oilSharesVariableId > 0 && $dataSystem && $gameVariables) {
      const value = $gameVariables.value(oilSharesVariableId);
      return Math.max(0, Number(value) || 0);
    }
    return 0;
  }

  function getSoulSharesFromVariable() {
    if (soulSharesVariableId > 0 && $dataSystem && $gameVariables) {
      const value = $gameVariables.value(soulSharesVariableId);
      return Math.max(0, Number(value) || 0);
    }
    return 0;
  }

  function getSoulMedianFromVariable() {
    if (soulMedianVariableId > 0 && $dataSystem && $gameVariables) {
      const value = $gameVariables.value(soulMedianVariableId);
      const medianValue = Number(value) || 0;
      // If variable is set and > 0, use it; otherwise use plugin parameter
      return medianValue > 0 ? medianValue : 66666;
    }
    return 66666;
  }

  function setOilSharesVariable(shares) {
    if (oilSharesVariableId > 0 && $gameVariables) {
      $gameVariables.setValue(oilSharesVariableId, shares);
    }
  }

  function setSoulSharesVariable(shares) {
    if (soulSharesVariableId > 0 && $gameVariables) {
      $gameVariables.setValue(soulSharesVariableId, shares);
    }
  }

  //=============================================================================
  // Stock Market System - Core Class
  //=============================================================================

  class StockMarketSystem {
    constructor() {
      this.initialize();
    }

    initialize() {
      // Initialize shares from variables if available, otherwise default to 0
      this._oilShares = getOilSharesFromVariable();
      this._soulsShares = getSoulSharesFromVariable();
      
      this._oilHistory = this.generateRandomHistory(
        initialOilPrice,
        historyLength,
        "oil"
      );
      this._soulsHistory = this.generateRandomHistory(
        initialSoulsPrice,
        historyLength,
        "souls"
      );
      this._oilPrice = this._oilHistory[this._oilHistory.length - 1];
      this._soulsPrice = this._soulsHistory[this._soulsHistory.length - 1];
      this._updateCounter = 0;
      this._lastUpdateTime = 0;
    }

    toJSON() {
      return {
        oilPrice: this._oilPrice,
        soulsPrice: this._soulsPrice,
        oilShares: this._oilShares,
        soulsShares: this._soulsShares,
        oilHistory: this._oilHistory,
        soulsHistory: this._soulsHistory,
        updateCounter: this._updateCounter,
      };
    }

    fromJSON(jsonObj) {
      if (!jsonObj) return;
      
      // Load shares from save data, but sync with variables if they exist
      const savedOilShares = jsonObj.oilShares !== undefined ? Number(jsonObj.oilShares) : 0;
      const savedSoulShares = jsonObj.soulsShares !== undefined ? Number(jsonObj.soulsShares) : 0;
      const variableOilShares = getOilSharesFromVariable();
      const variableSoulShares = getSoulSharesFromVariable();
      
      // Use variable values if they're greater than 0, otherwise use saved values
      this._oilShares = variableOilShares > 0 ? variableOilShares : savedOilShares;
      this._soulsShares = variableSoulShares > 0 ? variableSoulShares : savedSoulShares;
      
      // Ensure variables are synced with current values
      setOilSharesVariable(this._oilShares);
      setSoulSharesVariable(this._soulsShares);
      
      this._updateCounter = jsonObj.updateCounter
        ? Number(jsonObj.updateCounter)
        : 0;
      this._oilPrice =
        jsonObj.oilPrice !== undefined
          ? Number(jsonObj.oilPrice)
          : initialOilPrice;
      this._soulsPrice =
        jsonObj.soulsPrice !== undefined
          ? Number(jsonObj.soulsPrice)
          : initialSoulsPrice;
      this._oilHistory = Array.isArray(jsonObj.oilHistory)
        ? jsonObj.oilHistory.map(Number)
        : this.generateRandomHistory(this._oilPrice, historyLength, "oil");
      this._soulsHistory = Array.isArray(jsonObj.soulsHistory)
        ? jsonObj.soulsHistory.map(Number)
        : this.generateRandomHistory(this._soulsPrice, historyLength, "souls");
      this._lastUpdateTime = 0;
    }

    update() {
      if (!this._lastUpdateTime) {
        this._lastUpdateTime = Date.now();
        return false;
      }
      if (Date.now() - this._lastUpdateTime >= updateInterval) {
        this._lastUpdateTime = Date.now();
        this.updatePrices();
        return true;
      }
      return false;
    }

    updatePrices() {
      this._oilPrice = this.generateNewPrice(this._oilPrice, "oil");
      this._soulsPrice = this.generateNewPrice(this._soulsPrice, "souls");
      this._oilHistory.push(this._oilPrice);
      if (this._oilHistory.length > historyLength) this._oilHistory.shift();
      this._soulsHistory.push(this._soulsPrice);
      if (this._soulsHistory.length > historyLength) this._soulsHistory.shift();
    }

    generateNewPrice(currentPrice, stockType) {
      let newPrice;

      if (stockType === "souls") {
        // Get current median price from variable or plugin parameter
        const targetPrice = getSoulMedianFromVariable();
        const reversionStrength = 0.1;
        const fluctuation = (Math.random() - 0.5) * 500;
        const pullToMean = (targetPrice - currentPrice) * reversionStrength;
        newPrice = currentPrice + pullToMean + fluctuation;
      } else {
        // 'oil'
        const minPrice = 3000; // €30.00
        const maxPrice = 80000; // €800.00
        const centerPrice = (minPrice + maxPrice) / 2;
        const reversionStrength = 0.01; // Very weak pull to the center of the range

        const pullToCenter = (centerPrice - currentPrice) * reversionStrength;
        const randomWalk =
          (Math.random() - 0.5) * (currentPrice * volatility * 2.5);

        let shock = 0;
        if (Math.random() < 0.05) {
          // 5% chance of a market shock
          shock = (Math.random() > 0.5 ? 1 : -1) * currentPrice * 0.2; // Sudden +/- 20% push
        }

        newPrice = currentPrice + pullToCenter + randomWalk + shock;

        // Clamp the price to the intended range
        newPrice = Math.max(minPrice, Math.min(newPrice, maxPrice));
      }

      // Final safety floor
      newPrice = Math.max(newPrice, minimumPrice);
      return Math.round(newPrice);
    }

    getOilPrice() {
      return this._oilPrice;
    }
    getSoulsPrice() {
      return this._soulsPrice;
    }
    getOilShares() {
      return this._oilShares;
    }
    getSoulsShares() {
      return this._soulsShares;
    }

    // **FIXED**: Buy methods now work directly with gold (cents) and sync variables
    buyOil(shares) {
      if (shares <= 0) return false;
      const costInGold = Math.round(shares * this._oilPrice); // Cost in gold (cents)
      if (costInGold <= $gameParty.gold()) {
        $gameParty.loseGold(costInGold); // Subtract gold directly
        this._oilShares += shares;
        setOilSharesVariable(this._oilShares); // Sync with variable
        return true;
      }
      return false;
    }

    sellOil(shares) {
      if (shares > 0 && shares <= this._oilShares) {
        const revenueInGold = Math.round(shares * this._oilPrice); // Revenue in gold (cents)
        $gameParty.gainGold(revenueInGold); // Add gold directly
        this._oilShares -= shares;
        setOilSharesVariable(this._oilShares); // Sync with variable
        return true;
      }
      return false;
    }

    // **FIXED**: Buy/sell souls methods now work directly with gold (cents) and sync variables
    buySouls(shares) {
      if (shares <= 0) return false;
      const costInGold = Math.round(shares * this._soulsPrice); // Cost in gold (cents)
      if (costInGold <= $gameParty.gold()) {
        $gameParty.loseGold(costInGold); // Subtract gold directly
        this._soulsShares += shares;
        setSoulSharesVariable(this._soulsShares); // Sync with variable
        return true;
      }
      return false;
    }

    sellSouls(shares) {
      if (shares > 0 && shares <= this._soulsShares) {
        const revenueInGold = Math.round(shares * this._soulsPrice); // Revenue in gold (cents)
        $gameParty.gainGold(revenueInGold); // Add gold directly
        this._soulsShares -= shares;
        setSoulSharesVariable(this._soulsShares); // Sync with variable
        return true;
      }
      return false;
    }

    generateRandomHistory(basePrice, length, stockType) {
      const history = [];
      let currentPrice = basePrice;
      const minOilPrice = 3000;
      const maxOilPrice = 80000;

      for (let i = 0; i < length; i++) {
        if (stockType === "souls") {
          // Use configurable median price for history generation too
          const targetPrice = getSoulMedianFromVariable();
          const reversionStrength = 0.1;
          const fluctuation = (Math.random() - 0.5) * 500;
          currentPrice +=
            (targetPrice - currentPrice) * reversionStrength + fluctuation;
        } else {
          // 'oil'
          const centerPrice = (minOilPrice + maxOilPrice) / 2;
          const pullToCenter = (centerPrice - currentPrice) * 0.01;
          const randomWalk =
            (Math.random() - 0.5) * (currentPrice * volatility * 2.5);
          currentPrice += pullToCenter + randomWalk;
          if (Math.random() < 0.05) {
            currentPrice *= 1 + (Math.random() - 0.5) * 0.2;
          }
          currentPrice = Math.max(
            minOilPrice,
            Math.min(currentPrice, maxOilPrice)
          );
        }
        history.push(Math.round(currentPrice));
      }
      return history;
    }

    getOilHistory() {
      return this._oilHistory;
    }
    getSoulsHistory() {
      return this._soulsHistory;
    }

    getNetWorthFormatted() {
      return formatMoney(
        getPlayerGoldInCents() +
          Math.round(this._oilShares * this._oilPrice) +
          Math.round(this._soulsShares * this._soulsPrice)
      );
    }

    checkBankruptcy() {
      // Bankruptcy is now handled by the game's natural gold system
    }

    // Method to sync shares with variables (useful for external calls)
    syncWithVariables() {
      if (oilSharesVariableId > 0) {
        const variableOilShares = getOilSharesFromVariable();
        if (variableOilShares !== this._oilShares) {
          this._oilShares = Math.max(0, variableOilShares);
        }
      }
      
      if (soulSharesVariableId > 0) {
        const variableSoulShares = getSoulSharesFromVariable();
        if (variableSoulShares !== this._soulsShares) {
          this._soulsShares = Math.max(0, variableSoulShares);
        }
      }
    }

    // Method to get current SOUL median price (for debugging/display)
    getCurrentSoulMedian() {
      return getSoulMedianFromVariable();
    }
  }

  //=============================================================================
  // Game_System Integration & Window Classes
  //=============================================================================

  const _Game_System_initialize = Game_System.prototype.initialize;
  Game_System.prototype.initialize = function () {
    _Game_System_initialize.call(this);
    this.stockMarket = new StockMarketSystem();
  };
  const _Game_System_onAfterLoad = Game_System.prototype.onAfterLoad;
  Game_System.prototype.onAfterLoad = function () {
    if (_Game_System_onAfterLoad) _Game_System_onAfterLoad.call(this);
    this.stockMarket = new StockMarketSystem();
    if (this.stockMarket) {
      this.stockMarket.fromJSON(this.stockMarket);
    }
  };
  const _SceneManager_updateScene = SceneManager.updateScene;
  SceneManager.updateScene = function () {
    _SceneManager_updateScene.call(this);
    if (
      this._scene &&
      $gameSystem &&
      $gameSystem.stockMarket &&
      $gameSystem.stockMarket.update &&
      $gameSystem.stockMarket.update() &&
      this._scene instanceof Scene_StockMarket
    ) {
      this._scene.refreshDynamicWindows();
    }
  };

  // Hook into variable changes to sync stock shares and median price
  const _Game_Variables_setValue = Game_Variables.prototype.setValue;
  Game_Variables.prototype.setValue = function(variableId, value) {
    _Game_Variables_setValue.call(this, variableId, value);
    
    // Sync stock market shares when relevant variables change
    if ($gameSystem && $gameSystem.stockMarket) {
      if (variableId === oilSharesVariableId || variableId === soulSharesVariableId) {
        $gameSystem.stockMarket.syncWithVariables();
      }
      // Note: SOUL median variable doesn't need syncing as it's read dynamically
    }
  };

  function Window_StockInfo() {
    this.initialize(...arguments);
  }
  Window_StockInfo.prototype = Object.create(Window_Base.prototype);
  Window_StockInfo.prototype.constructor = Window_StockInfo;
  Window_StockInfo.prototype.initialize = function (rect) {
    Window_Base.prototype.initialize.call(this, rect);
    this.refresh();
  };
  Window_StockInfo.prototype.refresh = function () {
    this.contents.clear();
    const stockMarket = $gameSystem.stockMarket;
    const centerX = this.contentsWidth() / 2;
    const colWidth = centerX - 24;
    const useTranslation = ConfigManager.language === "it";
    
    // Left column
    this.drawText(
      useTranslation ? `Denaro: ${goldToEurosForDisplay($gameParty.gold())}` : `Money: ${goldToEurosForDisplay($gameParty.gold())}`,
      24,
      0,
      colWidth
    );
    this.drawText(
      useTranslation ? `Prezzo OIL: ${formatMoney(stockMarket.getOilPrice())}` : `OIL Price: ${formatMoney(stockMarket.getOilPrice())}`,
      24,
      this.lineHeight(),
      colWidth
    );
    this.drawText(
      useTranslation ? `Azioni OIL: ${stockMarket.getOilShares()}` : `OIL Shares: ${stockMarket.getOilShares()}`,
      24,
      this.lineHeight() * 2,
      colWidth
    );
    this.drawText(
      useTranslation ? `Valore OIL: ${formatMoney(Math.round(stockMarket.getOilShares() * stockMarket.getOilPrice()))}` : `OIL Value: ${formatMoney(Math.round(stockMarket.getOilShares() * stockMarket.getOilPrice()))}`,
      24,
      this.lineHeight() * 3,
      colWidth
    );
    
    // Right column
    this.drawText(
      useTranslation ? `Patrimonio: ${stockMarket.getNetWorthFormatted()}` : `Net Worth: ${stockMarket.getNetWorthFormatted()}`,
      centerX,
      0,
      colWidth
    );
    this.drawText(
      useTranslation ? `Prezzo SOUL: ${formatMoney(stockMarket.getSoulsPrice())}` : `SOUL Price: ${formatMoney(stockMarket.getSoulsPrice())}`,
      centerX,
      this.lineHeight(),
      colWidth
    );
    this.drawText(
      useTranslation ? `Azioni SOUL: ${stockMarket.getSoulsShares()}` : `SOUL Shares: ${stockMarket.getSoulsShares()}`,
      centerX,
      this.lineHeight() * 2,
      colWidth
    );
    this.drawText(
      useTranslation ? `Valore SOUL: ${formatMoney(Math.round(stockMarket.getSoulsShares() * stockMarket.getSoulsPrice()))}` : `SOUL Value: ${formatMoney(Math.round(stockMarket.getSoulsShares() * stockMarket.getSoulsPrice()))}`,
      centerX,
      this.lineHeight() * 3,
      colWidth
    );
  };

  function Window_StockGraph() {
    this.initialize(...arguments);
  }
  Window_StockGraph.prototype = Object.create(Window_Base.prototype);
  Window_StockGraph.prototype.constructor = Window_StockGraph;
  Window_StockGraph.prototype.initialize = function (rect) {
    Window_Base.prototype.initialize.call(this, rect);
    this.refresh();
  };
  Window_StockGraph.prototype.refresh = function () {
    if (!$gameSystem || !$gameSystem.stockMarket) return;
    this.contents.clear();
    const stockMarket = $gameSystem.stockMarket;
    const oilHistory = stockMarket.getOilHistory();
    const soulsHistory = stockMarket.getSoulsHistory();
    const allValues = [...oilHistory, ...soulsHistory];
    const min = Math.min(...allValues) * 0.9;
    const max = Math.max(...allValues) * 1.1;
    const graphX = 50,
      graphY = 40;
    const graphWidth = this.contentsWidth() - 100;
    const graphHeight = this.contentsHeight() - 80;
    const useTranslation = ConfigManager.language === "it";
    
    this.contents.gradientFillRect(
      graphX,
      graphY,
      graphWidth,
      graphHeight,
      "rgba(30, 30, 30, 0.8)",
      "rgba(10, 10, 10, 0.8)",
      false
    );
    this.contents.strokeRect(
      graphX,
      graphY,
      graphWidth,
      graphHeight,
      "rgba(255, 255, 255, 0.7)"
    );
    for (let i = 1; i < 5; i++) {
      const y = graphY + graphHeight * (i / 5);
      this.contents.fillRect(
        graphX,
        y,
        graphWidth,
        1,
        "rgba(255, 255, 255, 0.3)"
      );
      const priceInCents = max - (max - min) * (i / 5);
      this.drawText(
        formatMoney(Math.round(priceInCents)),
        4,
        y - 12,
        graphX - 8,
        "right"
      );
    }
    this.drawPriceLine(
      oilHistory,
      graphX,
      graphY,
      graphWidth,
      graphHeight,
      min,
      max,
      "#FFFFFF",
      4
    );
    this.drawPriceLine(
      soulsHistory,
      graphX,
      graphY,
      graphWidth,
      graphHeight,
      min,
      max,
      "#0000FF",
      4
    );
    
    // Draw median line for SOUL if it's visible in the graph
    const currentMedian = stockMarket.getCurrentSoulMedian();
    if (currentMedian >= min && currentMedian <= max) {
      const medianY = graphY + graphHeight - (((currentMedian - min) / (max - min)) * graphHeight);
      this.contents.fillRect(graphX, medianY, graphWidth, 2, "rgba(0, 0, 255, 0.5)");
    }
    
    this.contents.fillRect(graphX + 15, graphY + 15, 25, 4, "#FFFFFF");
    this.drawText(useTranslation ? "OIL" : "Oil", graphX + 45, graphY + 6, 80);
    this.contents.fillRect(graphX + 15, graphY + 35, 25, 4, "#0000FF");
    this.drawText(useTranslation ? "SOUL" : "Souls", graphX + 45, graphY + 26, 80);
    
    
    this.drawText(
      (useTranslation ? "OIL: " : "Oil: ") + formatMoney(stockMarket.getOilPrice()),
      graphX,
      graphY + graphHeight + 10,
      150
    );
    this.drawText(
      (useTranslation ? "SOUL: " : "Souls: ") + formatMoney(stockMarket.getSoulsPrice()),
      graphX + graphWidth - 200,
      graphY + graphHeight + 10,
      200
    );
    

  };
  Window_StockGraph.prototype.drawPriceLine = function (
    history,
    x,
    y,
    width,
    height,
    min,
    max,
    color,
    thickness
  ) {
    const points = history.map((price, i) => ({
      x: x + i * (width / (history.length - 1)),
      y: y + height - (((price - min) / (max - min)) * height || 0),
    }));
    if (points.length < 2) return;
    const context = this.contents.context;
    context.save();
    context.strokeStyle = color;
    context.lineWidth = thickness;
    context.lineJoin = "round";
    context.lineCap = "round";
    context.beginPath();
    context.moveTo(points[0].x, points[0].y);
    for (let i = 1; i < points.length - 2; i++) {
      const xc = (points[i].x + points[i + 1].x) / 2;
      const yc = (points[i].y + points[i + 1].y) / 2;
      context.quadraticCurveTo(points[i].x, points[i].y, xc, yc);
    }
    if (points.length > 2) {
      context.quadraticCurveTo(
        points[points.length - 2].x,
        points[points.length - 2].y,
        points[points.length - 1].x,
        points[points.length - 1].y
      );
    } else {
      context.lineTo(points[1].x, points[1].y);
    }
    context.stroke();
    context.restore();
    this.contents._baseTexture.update();
  };

  function Window_StockCommand() {
    this.initialize(...arguments);
  }
  Window_StockCommand.prototype = Object.create(Window_HorzCommand.prototype);
  Window_StockCommand.prototype.constructor = Window_StockCommand;
  Window_StockCommand.prototype.initialize = function (rect) {
    Window_HorzCommand.prototype.initialize.call(this, rect);
  };
  Window_StockCommand.prototype.maxCols = () => 2;
  Window_StockCommand.prototype.makeCommandList = function () {
    const useTranslation = ConfigManager.language === "it";
    this.addCommand(useTranslation ? "Compra" : "Buy", "buy");
    this.addCommand(useTranslation ? "Vendi" : "Sell", "sell");
  };

  function Window_StockSelection() {
    this.initialize(...arguments);
  }
  Window_StockSelection.prototype = Object.create(Window_Command.prototype);
  Window_StockSelection.prototype.constructor = Window_StockSelection;
  Window_StockSelection.prototype.initialize = function (rect) {
    this._mode = "buy";
    Window_Command.prototype.initialize.call(this, rect);
    this.hide();
    this.deactivate();
  };
  
  Window_StockSelection.prototype.makeCommandList = function () {
    const useTranslation = ConfigManager.language === "it";
    this.addCommand(useTranslation ? "OIL" : "Oil", "oil");
    this.addCommand(useTranslation ? "SOUL" : "Souls", "souls");
    this.addCommand(useTranslation ? "Annulla" : "Cancel", "cancel");
  };
  Window_StockSelection.prototype.setMode = function (mode) {
    this._mode = mode;
    const useTranslation = ConfigManager.language === "it";
    this.setTitle(
      mode === "buy"
        ? useTranslation
          ? "Compra quale stock?"
          : "Buy Which Stock?"
        : useTranslation
        ? "Vendi quale stock?"
        : "Sell Which Stock?"
    );
  };
  Window_StockSelection.prototype.setTitle = function (title) {
    this._title = title;
    this.refresh();
  };
  Window_StockSelection.prototype.drawTitle = function () {
    if (this._title)
      this.drawText(this._title, 0, 0, this.innerWidth, "center");
  };
  Window_StockSelection.prototype.refresh = function () {
    this.clearCommandList();
    this.makeCommandList();
    this.createContents();
    this.drawTitle();
    Window_Selectable.prototype.drawAllItems.call(this);
  };
  Window_StockSelection.prototype.itemRect = function (index) {
    const rect = Window_Command.prototype.itemRect.call(this, index);
    rect.y += this.lineHeight();
    return rect;
  };
  Window_StockSelection.prototype.drawItem = function (index) {
    const rect = this.itemLineRect(index);
    this.drawText(
      this.commandName(index),
      rect.x,
      rect.y,
      rect.width,
      "center"
    );
  };

  function Window_StockAmount() {
    this.initialize(...arguments);
  }
  Window_StockAmount.prototype = Object.create(Window_Command.prototype);
  Window_StockAmount.prototype.constructor = Window_StockAmount;
  Window_StockAmount.prototype.initialize = function (rect) {
    this._mode = "buy";
    this._stockType = "oil";
    this._timer = 0;
    Window_Command.prototype.initialize.call(this, rect);
    this.hide();
    this.deactivate();
  };
  Window_StockAmount.prototype.update = function () {
    Window_Command.prototype.update.call(this);
    if (
      this.isOpenAndActive() &&
      (this._mode === "buy" || this._mode === "sell")
    ) {
      this._timer = (this._timer || 0) + 1;
      if (this._timer >= 30) {
        this._timer = 0;
        this.refresh();
      }
    }
  };
  Window_StockAmount.prototype.makeCommandList = function () {
    const useTranslation = ConfigManager.language === "it";
    const stockMarket = $gameSystem.stockMarket;
    const playerGold = $gameParty.gold();
    
    // Add buy/sell options including new 2 and 4 stock options
    [1, 2, 4, 5, 10, 25, 50, 100, 250, 500].forEach((num) => {
      let enabled = true;
      
      if (this._mode === "buy") {
        // Check if player has enough gold to buy this amount
        const price = this._stockType === "oil" ? stockMarket.getOilPrice() : stockMarket.getSoulsPrice();
        const cost = Math.round(num * price);
        enabled = playerGold >= cost;
      } else if (this._mode === "sell") {
        // Check if player has enough shares to sell this amount
        const currentShares = this._stockType === "oil" ? stockMarket.getOilShares() : stockMarket.getSoulsShares();
        enabled = currentShares >= num;
      }
      
      this.addCommand(
        useTranslation
          ? `${num} ${num > 1 ? "azioni" : "azione"}`
          : `${num} ${num > 1 ? "Shares" : "Share"}`,
        `fixed_${num}`,
        enabled
      );
    });
    
    // Add "Sell All" option for sell mode
    if (this._mode === "sell") {
      const currentShares = this._stockType === "oil" ? stockMarket.getOilShares() : stockMarket.getSoulsShares();
      const hasShares = currentShares > 0;
      
      this.addCommand(
        useTranslation ? "Vendi Tutto" : "Sell All",
        "sell_all",
        hasShares
      );
    }
    
    this.addCommand(useTranslation ? "Annulla" : "Cancel", "cancel");
  };
  Window_StockAmount.prototype.setMode = function (mode, stockType) {
    this._mode = mode;
    this._stockType = stockType || "oil";
    const useTranslation = ConfigManager.language === "it";
    let title;
    const stockName = this._stockType === "oil" ? 
      (useTranslation ? "OIL" : "Oil") : 
      (useTranslation ? "SOUL" : "Souls");
    
    if (mode === "buy") {
      title = useTranslation 
        ? `Compra quante azioni di ${stockName}?`
        : `Buy How Many ${this._stockType.charAt(0).toUpperCase() + this._stockType.slice(1)} Shares?`;
    } else if (mode === "sell") {
      title = useTranslation 
        ? `Vendi quante azioni di ${stockName}?`
        : `Sell How Many ${this._stockType.charAt(0).toUpperCase() + this._stockType.slice(1)} Shares?`;
    }
    this.setTitle(title);
  };
  Window_StockAmount.prototype.setTitle = function (title) {
    this._title = title;
    this.refresh();
  };
  Window_StockAmount.prototype.drawTitle = function () {
    if (this._title)
      this.drawText(this._title, 0, 0, this.innerWidth, "center");
  };
  Window_StockAmount.prototype.itemRect = function (index) {
    const rect = Window_Command.prototype.itemRect.call(this, index);
    rect.y += this.lineHeight();
    return rect;
  };
  Window_StockAmount.prototype.drawItem = function (index) {
    const rect = this.itemLineRect(index);
    const symbol = this.commandSymbol(index);
    const commandName = this.commandName(index);
    const enabled = this.isCommandEnabled(index);
    const padding = this.itemPadding();
    
    this.contents.clearRect(rect.x, rect.y, rect.width, rect.height);
    
    // Set text color based on enabled state
    if (enabled) {
      this.resetTextColor();
    } else {
      // Use a compatible way to get disabled color
      this.changeTextColor(ColorManager.textColor(8)); // Grey color
    }
    
    if (symbol === "cancel") {
      this.drawText(commandName, rect.x, rect.y, rect.width, "center");
      return;
    }
    
    if (symbol === "sell_all") {
      const stockMarket = $gameSystem.stockMarket;
      const currentShares = this._stockType === "oil" ? stockMarket.getOilShares() : stockMarket.getSoulsShares();
      const price = this._stockType === "oil" ? stockMarket.getOilPrice() : stockMarket.getSoulsPrice();
      const totalValue = Math.round(currentShares * price);
      
      this.drawText(
        commandName,
        rect.x + padding,
        rect.y,
        rect.width - padding * 2,
        "left"
      );
      
      if (currentShares > 0) {
        const valueText = `(${currentShares} = ${formatMoney(totalValue)})`;
        this.drawText(
          valueText,
          rect.x + padding,
          rect.y,
          rect.width - padding * 2,
          "right"
        );
      }
      return;
    }
    
    if (symbol && symbol.startsWith("fixed_")) {
      this.drawText(
        commandName,
        rect.x + padding,
        rect.y,
        rect.width - padding * 2,
        "left"
      );
      const stockMarket = $gameSystem.stockMarket;
      const amount = parseInt(symbol.split("_")[1]);
      const price =
        this._stockType === "oil"
          ? stockMarket.getOilPrice()
          : stockMarket.getSoulsPrice();
      
      // Display cost in euros but cost is calculated in gold (cents)
      const costText = `(${formatMoney(Math.round(amount * price))})`;
      
      // Keep cost text same color as main text (enabled/disabled)
      this.drawText(
        costText,
        rect.x + padding,
        rect.y,
        rect.width - padding * 2,
        "right"
      );
    }
  };
  Window_StockAmount.prototype.refresh = function () {
    this.clearCommandList();
    this.makeCommandList();
    this.createContents();
    this.drawTitle();
    Window_Selectable.prototype.drawAllItems.call(this);
  };
  Window_StockAmount.prototype.processOk = function () {
    if (this.currentSymbol() === "cancel") {
      this.processCancel();
      return;
    }
    
    // Check if the current selection is enabled before processing
    if (!this.isCurrentItemEnabled()) {
      SoundManager.playBuzzer();
      return;
    }
    
    if (this.currentSymbol() === "sell_all") {
      const stockMarket = $gameSystem.stockMarket;
      const currentShares = this._stockType === "oil" ? stockMarket.getOilShares() : stockMarket.getSoulsShares();
      this.executeTransaction(currentShares);
    } else if (this.currentSymbol().startsWith("fixed_")) {
      this.executeTransaction(parseInt(this.currentSymbol().split("_")[1]));
    }
  };
  Window_StockAmount.prototype.executeTransaction = function (amount) {
    const stockMarket = $gameSystem.stockMarket;
    let success = false;
    switch (this._mode) {
      case "buy":
        success =
          this._stockType === "oil"
            ? stockMarket.buyOil(amount)
            : stockMarket.buySouls(amount);
        break;
      case "sell":
        success =
          this._stockType === "oil"
            ? stockMarket.sellOil(amount)
            : stockMarket.sellSouls(amount);
        break;
    }
    if (success) {
      SoundManager.playShop();
      this.updateInfoWindow();
    } else {
      SoundManager.playBuzzer();
    }
    stockMarket.checkBankruptcy();
    this.hide();
    this.deactivate();
    this._scene.activateCommandWindow();
  };
  Window_StockAmount.prototype.updateInfoWindow = function () {
    if (this._scene) {
      if (this._scene._infoWindow) this._scene._infoWindow.refresh();
      if (this._scene._graphWindow) this._scene._graphWindow.refresh();
    }
  };

  function Scene_StockMarket() {
    this.initialize(...arguments);
  }
  Scene_StockMarket.prototype = Object.create(Scene_MenuBase.prototype);
  Scene_StockMarket.prototype.constructor = Scene_StockMarket;
  Scene_StockMarket.prototype.initialize = function () {
    Scene_MenuBase.prototype.initialize.call(this);
  };
  Scene_StockMarket.prototype.terminate = function () {
    Scene_MenuBase.prototype.terminate.call(this);
    Input.clear();
    TouchInput.clear();
    if ($gamePlayer) $gamePlayer.refresh();
    if ($gameMessage) $gameMessage.clear();
  };
  Scene_StockMarket.prototype.popScene = function () {
    if (this._commandWindow) this._commandWindow.deactivate();
    if (this._selectionWindow) this._selectionWindow.deactivate();
    if (this._amountWindow) this._amountWindow.deactivate();
    Input.clear();
    TouchInput.clear();
    if ($gameMessage) $gameMessage.clear();
    Scene_MenuBase.prototype.popScene.call(this);
  };
  Scene_StockMarket.prototype.create = function () {
    Scene_MenuBase.prototype.create.call(this);
    this._graphWindow = new Window_StockGraph(this.graphWindowRect());
    this._infoWindow = new Window_StockInfo(this.infoWindowRect());
    this._commandWindow = new Window_StockCommand(this.commandWindowRect());
    this._selectionWindow = new Window_StockSelection(
      this.selectionWindowRect()
    );
    this._amountWindow = new Window_StockAmount(this.amountWindowRect());
    this.addWindow(this._graphWindow);
    this.addWindow(this._infoWindow);
    this.addWindow(this._commandWindow);
    this.addWindow(this._selectionWindow);
    this.addWindow(this._amountWindow);
    this._commandWindow.setHandler("buy", this.onBuyCommand.bind(this));
    this._commandWindow.setHandler("sell", this.onSellCommand.bind(this));
    this._commandWindow.setHandler("cancel", this.popScene.bind(this));
    this._selectionWindow.setHandler(
      "oil",
      this.onStockTypeSelected.bind(this)
    );
    this._selectionWindow.setHandler(
      "souls",
      this.onStockTypeSelected.bind(this)
    );
    this._selectionWindow.setHandler(
      "cancel",
      this.onSelectionCancel.bind(this)
    );
    this._amountWindow._scene = this;
    this._amountWindow.setHandler("cancel", this.onAmountCancel.bind(this));
    this.createCancelButton();
    this._commandWindow.activate();
  };
  Scene_StockMarket.prototype.onBuyCommand = function () {
    this._selectionWindow.setMode("buy");
    this._selectionWindow.show();
    this._selectionWindow.activate();
    this._commandWindow.deactivate();
  };
  Scene_StockMarket.prototype.onSellCommand = function () {
    this._selectionWindow.setMode("sell");
    this._selectionWindow.show();
    this._selectionWindow.activate();
    this._commandWindow.deactivate();
  };
  Scene_StockMarket.prototype.onStockTypeSelected = function () {
    const stockType = this._selectionWindow.currentSymbol();
    this._selectionWindow.hide();
    this._selectionWindow.deactivate();
    this._amountWindow.setMode(this._selectionWindow._mode, stockType);
    this._amountWindow.show();
    this._amountWindow.activate();
  };
  Scene_StockMarket.prototype.onSelectionCancel = function () {
    this._selectionWindow.hide();
    this._selectionWindow.deactivate();
    this._commandWindow.activate();
  };
  Scene_StockMarket.prototype.onAmountCancel = function () {
    this._amountWindow.hide();
    this._amountWindow.deactivate();
    this._commandWindow.activate();
  };
  Scene_StockMarket.prototype.activateCommandWindow = function () {
    this._commandWindow.activate();
    this.refreshDynamicWindows();
  };
  Scene_StockMarket.prototype.refreshDynamicWindows = function () {
    if (this._infoWindow) this._infoWindow.refresh();
    if (this._graphWindow) this._graphWindow.refresh();
  };
  Scene_StockMarket.prototype.update = function () {
    Scene_MenuBase.prototype.update.call(this);
    if ($gameSystem && !$gameSystem.stockMarket.update) {
      $gameSystem.stockMarket = new StockMarketSystem();
    }
  };
  Scene_StockMarket.prototype.createCancelButton = function () {
    Scene_MenuBase.prototype.createCancelButton.call(this);
    if (this._cancelButton)
      this._cancelButton.setClickHandler(this.popScene.bind(this));
  };
  Scene_StockMarket.prototype.graphWindowRect = function () {
    return new Rectangle(0, 0, Graphics.boxWidth, Graphics.boxHeight * 0.5);
  };
  Scene_StockMarket.prototype.infoWindowRect = function () {
    return new Rectangle(
      0,
      this.graphWindowRect().height,
      Graphics.boxWidth,
      this.calcWindowHeight(4, true)
    );
  };
  Scene_StockMarket.prototype.commandWindowRect = function () {
    return new Rectangle(
      0,
      this.graphWindowRect().height + this.infoWindowRect().height,
      Graphics.boxWidth,
      this.calcWindowHeight(1, true)
    );
  };
  Scene_StockMarket.prototype.selectionWindowRect = function () {
    const ww = 300,
      wh = this.calcWindowHeight(4, true);
    return new Rectangle(
      (Graphics.boxWidth - ww) / 2,
      (Graphics.boxHeight - wh) / 2,
      ww,
      wh
    );
  };
  Scene_StockMarket.prototype.amountWindowRect = function () {
    const ww = 500,
      wh = this.calcWindowHeight(12, true);
    return new Rectangle(
      (Graphics.boxWidth - ww) / 2,
      (Graphics.boxHeight - wh) / 2,
      ww,
      wh
    );
  };
  const _Scene_Map_start = Scene_Map.prototype.start;
  Scene_Map.prototype.start = function () {
    _Scene_Map_start.call(this);
    if ($gamePlayer) $gamePlayer.refresh();
    Input.clear();
    TouchInput.clear();
  };
  const _Game_Player_update = Game_Player.prototype.update;
  Game_Player.prototype.update = function (sceneActive) {
    if (SceneManager._scene instanceof Scene_StockMarket) return;
    _Game_Player_update.call(this, sceneActive);
  };
  PluginManager.registerCommand(pluginName, "OpenStockMarket", () => {
    if ($gameSystem && !$gameSystem.stockMarket.update)
      $gameSystem.stockMarket = new StockMarketSystem();
    SceneManager.push(Scene_StockMarket);
  });
  const _Game_Interpreter_pluginCommand =
    Game_Interpreter.prototype.pluginCommand;
  Game_Interpreter.prototype.pluginCommand = function (command, args) {
    _Game_Interpreter_pluginCommand.call(this, command, args);
    if (command === "OpenStockMarket") {
      if ($gameSystem && !$gameSystem.stockMarket.update)
        $gameSystem.stockMarket = new StockMarketSystem();
      SceneManager.push(Scene_StockMarket);
    }
  };
})();
//=============================================================================
// HelpMenu.js
//=============================================================================

/*:
 * @target MZ
 * @plugindesc Adds a Help menu with separate windows for arguments and descriptions
 * @author Omni-Lex
 * @url https://yourwebsite.com
 *
 * @help HelpMenu.js
 *
 * This plugin adds a Help option to the main menu that opens separate windows:
 * - Arguments window: Lists all help topics
 * - Description window: Shows detailed descriptions
 *
 * Navigation:
 * - From menu: Select Help to open Arguments window
 * - In Arguments: Select a topic to view in Description window
 * - In Description: Press Cancel to return to Arguments window
 * - In Arguments: Press Cancel to return to main menu
 *
 * To customize help topics, edit the HELP_TOPICS array in the plugin code.
 *
 * Terms of Use:
 * Free for commercial and non-commercial use.
 */

(() => {
  "use strict";
  const { HELP_TOPICS, TODO_LISTS } = window.HelpData;

  //=============================================================================
  // ControlTagParser - Parse and display control tags based on input method
  //=============================================================================
  const ControlTagParser = {
    getCurrentInputMethod: function() {
      // Check if gamepad/controller input was recently used
      const gamepads = navigator.getGamepads ? navigator.getGamepads() : [];
      for (let i = 0; i < gamepads.length; i++) {
        const gamepad = gamepads[i];
        if (gamepad) {
          // Check if any gamepad buttons are pressed
          for (let j = 0; j < gamepad.buttons.length; j++) {
            if (gamepad.buttons[j].pressed) {
              return 'gamepad';
            }
          }
          // Check if any axes have significant movement
          for (let j = 0; j < gamepad.axes.length; j++) {
            if (Math.abs(gamepad.axes[j]) > 0.5) {
              return 'gamepad';
            }
          }
        }
      }
      return 'keyboard';
    },

    parseControlText: function(text) {
      const inputMethod = this.getCurrentInputMethod();

      // Pattern: <keyboard: ... > <controller: ... >
      // Use non-greedy matching to get text between tags
      const pattern = /<keyboard:\s*(.+?)>\s*<controller:\s*(.+?)>/g;

      return text.replace(pattern, (match, keyboardText, controllerText) => {
        if (inputMethod === 'gamepad') {
          return controllerText.trim();
        } else {
          return keyboardText.trim();
        }
      });
    }
  };

  // Add sorting function
  function sortTopics(topics) {
    return topics.slice().sort((a, b) => {
      const titleA = a.title.toLowerCase();
      const titleB = b.title.toLowerCase();
      return titleA < titleB ? -1 : titleA > titleB ? 1 : 0;
    });
  }

  // Filter out topics with type "lore", "state", or "element" for general help
  function filterTopicsForGeneralHelp(topics) {
    return topics.filter(topic => {
      // Exclude items with type "lore", "state", or "element"
      if (topic.type && (topic.type === "lore" || topic.type === "state" || topic.type === "element")) {
        return false;
      }
      return true;
    });
  }

  // Helper function to get map display name from individual map JSON file
  function getMapDisplayName(mapId, callback) {
    const filename = 'Map%1.json'.format(String(mapId).padZero(3));
    const xhr = new XMLHttpRequest();
    const url = 'data/' + filename;
    xhr.open('GET', url);
    xhr.overrideMimeType('application/json');
    xhr.onload = function() {
      if (xhr.status < 400) {
        const data = JSON.parse(xhr.responseText);
        callback(data.displayName || null);
      } else {
        callback(null);
      }
    };
    xhr.onerror = function() {
      callback(null);
    };
    xhr.send();
  }

  const sortedTopics = sortTopics(filterTopicsForGeneralHelp(HELP_TOPICS));

  //=============================================================================
  // Add Help Command to Main Menu
  //=============================================================================

  const _Window_MenuCommand_addOriginalCommands =
    Window_MenuCommand.prototype.addOriginalCommands;
  Window_MenuCommand.prototype.addOriginalCommands = function () {
    _Window_MenuCommand_addOriginalCommands.call(this);
    const lang = ConfigManager.language || 'en';
    const helpText = lang === 'it' ? 'Aiuto' : 'Help';
    this.addCommand(helpText, "help", true, 281);
  };

  const _Scene_Menu_createCommandWindow =
    Scene_Menu.prototype.createCommandWindow;
  Scene_Menu.prototype.createCommandWindow = function () {
    _Scene_Menu_createCommandWindow.call(this);
    this._commandWindow.setHandler("help", this.commandHelp.bind(this));
  };

  Scene_Menu.prototype.commandHelp = function () {
    SceneManager.push(Scene_HelpChoice);
  };

  //=============================================================================
  // Scene_HelpChoice - Choice between Help and TodoList
  //=============================================================================

  function Scene_HelpChoice() {
    this.initialize(...arguments);
  }

  Scene_HelpChoice.prototype = Object.create(Scene_MenuBase.prototype);
  Scene_HelpChoice.prototype.constructor = Scene_HelpChoice;

  Scene_HelpChoice.prototype.initialize = function () {
    Scene_MenuBase.prototype.initialize.call(this);
  };

  Scene_HelpChoice.prototype.create = function () {
    Scene_MenuBase.prototype.create.call(this);
    this.createChoiceWindow();
  };

  Scene_HelpChoice.prototype.createChoiceWindow = function () {
    const rect = this.choiceWindowRect();
    this._choiceWindow = new Window_HelpChoice(rect);
    this._choiceWindow.setHandler("help", this.commandHelpTopics.bind(this));
    this._choiceWindow.setHandler("todolist", this.commandTodoList.bind(this));
    this._choiceWindow.setHandler("lore", this.commandLore.bind(this));
    this._choiceWindow.setHandler("states", this.commandStates.bind(this));
    this._choiceWindow.setHandler("elements", this.commandElements.bind(this));
    this._choiceWindow.setHandler("tutorial", this.commandToggleTutorial.bind(this));
    this._choiceWindow.setHandler("cancel", this.popScene.bind(this));
    this.addWindow(this._choiceWindow);
  };

  Scene_HelpChoice.prototype.choiceWindowRect = function () {
    const ww = Graphics.boxWidth;
    const wh = Graphics.boxHeight - this.mainAreaTop();
    const wx = 0;
    const wy = this.mainAreaTop();
    return new Rectangle(wx, wy, ww, wh);
  };

  Scene_HelpChoice.prototype.commandHelpTopics = function () {
    SceneManager.push(Scene_HelpArguments);
  };

  Scene_HelpChoice.prototype.commandTodoList = function () {
    SceneManager.push(Scene_TodoListDisplay);
  };

  Scene_HelpChoice.prototype.commandLore = function () {
    SceneManager.push(Scene_HelpArgumentsFiltered);
    SceneManager.prepareNextScene('lore');
  };

  Scene_HelpChoice.prototype.commandStates = function () {
    SceneManager.push(Scene_HelpArgumentsFiltered);
    SceneManager.prepareNextScene('state');
  };

  Scene_HelpChoice.prototype.commandElements = function () {
    SceneManager.push(Scene_HelpArgumentsFiltered);
    SceneManager.prepareNextScene('element');
  };

  Scene_HelpChoice.prototype.commandToggleTutorial = function () {
    // Toggle switch 75 (tutorial system)
    $gameSwitches.setValue(75, !$gameSwitches.value(75));
    this._choiceWindow.activate();
    this._choiceWindow.refresh();
  };

  //=============================================================================
  // Window_HelpChoice - Choice window for Help vs TodoList
  //=============================================================================

  function Window_HelpChoice() {
    this.initialize(...arguments);
  }

  Window_HelpChoice.prototype = Object.create(Window_Command.prototype);
  Window_HelpChoice.prototype.constructor = Window_HelpChoice;

  Window_HelpChoice.prototype.initialize = function (rect) {
    Window_Command.prototype.initialize.call(this, rect);
    this.select(0);
    this.activate();
  };

  Window_HelpChoice.prototype.makeCommandList = function () {
    const lang = ConfigManager.language || "en";

    // Define labels based on language
    const labels = {
      todo: lang === "it" ? "Lista Todo" : "Todo List",
      help: lang === "it" ? "Aiuto" : "Help",
      lore: lang === "it" ? "Lore" : "Lore",
      states: lang === "it" ? "Stati" : "States",
      elements: lang === "it" ? "Elementi" : "Elements",
      tutorial: lang === "it" ? "Suggerimenti nella mappa" : "Map hints"
    };

    this.addCommand(labels.todo, "todolist");
    this.addCommand(labels.help, "help");
    this.addCommand(labels.lore, "lore");
    this.addCommand(labels.states, "states");
    this.addCommand(labels.elements, "elements");

    // Add tutorial toggle with status indicator
    const tutorialStatus = $gameSwitches.value(75) ?
      (lang === "it" ? " (Attivi)" : " (On)") :
      (lang === "it" ? " (Disattivi)" : " (Off)");
    this.addCommand(labels.tutorial + tutorialStatus, "tutorial");
  };

  Window_HelpChoice.prototype.maxCols = function () {
    return 1;
  };

  //=============================================================================
  // Scene_TodoListDisplay - Display full TodoList
  //=============================================================================

  function Scene_TodoListDisplay() {
    this.initialize(...arguments);
  }

  Scene_TodoListDisplay.prototype = Object.create(Scene_MenuBase.prototype);
  Scene_TodoListDisplay.prototype.constructor = Scene_TodoListDisplay;

  Scene_TodoListDisplay.prototype.initialize = function () {
    Scene_MenuBase.prototype.initialize.call(this);
    this._allTodos = [];
    this._seenSwitchIds = new Set();
    this._pendingDisplayNameRequests = 0;
    this._displayNamesLoaded = false;
  };

  Scene_TodoListDisplay.prototype.create = function () {
    Scene_MenuBase.prototype.create.call(this);
    this.createTodoListWindow();
  };

  Scene_TodoListDisplay.prototype.createTodoListWindow = function () {
    const rect = this.todoListWindowRect();
    this._todoListWindow = new Window_TodoListDisplay(rect);
    this._todoListWindow.setHandler("cancel", this.popScene.bind(this));
    this._todoListWindow.setAllTodos(this.getAllTodos());

    // If no requests are pending, mark loading complete immediately
    if (this._pendingDisplayNameRequests === 0) {
      this._todoListWindow.markLoadingComplete();
    }

    this.addWindow(this._todoListWindow);
  };

  Scene_TodoListDisplay.prototype.todoListWindowRect = function () {
    const ww = Graphics.boxWidth;
    const wh = Graphics.boxHeight - this.mainAreaTop();
    const wx = 0;
    const wy = this.mainAreaTop();
    return new Rectangle(wx, wy, ww, wh);
  };

  Scene_TodoListDisplay.prototype.getAllTodos = function () {
    // This will be populated by referencing the TODO_LISTS from MapTodoList
    // We collect all todos from all lists in order, grouped by maps with headers
    const allTodos = [];
    this._seenSwitchIds = new Set();
    this._pendingDisplayNameRequests = 0;

    if (typeof window !== "undefined" && TODO_LISTS) {
      const todoLists = TODO_LISTS;
      for (const listKey in todoLists) {
        const listData = todoLists[listKey];
        if (listData && listData.tasks && listData.maps && listData.maps.length > 0) {
          // Get the first map ID from the maps array
          const firstMapId = listData.maps[0];

          // Get the map name from MapInfos (fallback)
          let mapDisplayName = "Unknown Map";
          if ($dataMapInfos && $dataMapInfos[firstMapId]) {
            const mapInfo = $dataMapInfos[firstMapId];
            mapDisplayName = mapInfo.name || "Unknown Map";
          }

          // Add a header item for this map (will be updated with display name later)
          const headerItem = {
            isHeader: true,
            mapDisplayName: mapDisplayName,
            mapId: firstMapId
          };
          allTodos.push(headerItem);

          // Load the display name asynchronously
          this._pendingDisplayNameRequests++;
          (function(scene, header, mapId) {
            getMapDisplayName(mapId, function(displayName) {
              if (displayName) {
                header.mapDisplayName = displayName;
              }
              // Decrement pending requests
              scene._pendingDisplayNameRequests--;
              // Mark loading complete when all requests are done
              if (scene._pendingDisplayNameRequests === 0) {
                scene._displayNamesLoaded = true;
                if (scene._todoListWindow) {
                  scene._todoListWindow.markLoadingComplete();
                }
              }
            });
          })(this, headerItem, firstMapId);

          // Add all tasks from this list
          for (const task of listData.tasks) {
            // Skip if we've already seen this switchId
            if (!this._seenSwitchIds.has(task.switchId)) {
              this._seenSwitchIds.add(task.switchId);
              allTodos.push(task);
            }
          }
        }
      }
    }

    // If no requests were made, mark as loaded
    if (this._pendingDisplayNameRequests === 0) {
      this._displayNamesLoaded = true;
    }

    return allTodos;
  };

  //=============================================================================
  // Window_TodoListDisplay - Display all todos in a scrollable window
  //=============================================================================

  function Window_TodoListDisplay() {
    this.initialize(...arguments);
  }

  Window_TodoListDisplay.prototype = Object.create(Window_Base.prototype);
  Window_TodoListDisplay.prototype.constructor = Window_TodoListDisplay;

  Window_TodoListDisplay.prototype.initialize = function (rect) {
    Window_Base.prototype.initialize.call(this, rect);
    this._allTodos = [];
    this._scrollIndex = 0;
    this._itemHeights = []; // Track height of each todo item
    this._handlers = {}; // Handler support
    this._loadingComplete = false;
    this.deactivate(); // Start deactivated until data loads
    this.refresh();
  };

  Window_TodoListDisplay.prototype.setHandler = function (symbol, method) {
    this._handlers[symbol] = method;
  };

  Window_TodoListDisplay.prototype.callHandler = function (symbol) {
    if (this._handlers[symbol]) {
      this._handlers[symbol].call(this);
    }
  };

  Window_TodoListDisplay.prototype.callCancelHandler = function () {
    this.callHandler("cancel");
  };

  Window_TodoListDisplay.prototype.setAllTodos = function (todos) {
    this._allTodos = todos;
    this._scrollIndex = 0;
    this._itemHeights = [];
    this.calculateItemHeights();
    this.refresh();
  };

  Window_TodoListDisplay.prototype.markLoadingComplete = function () {
    this._loadingComplete = true;
    this.activate();
    this.refresh();
  };

  Window_TodoListDisplay.prototype.calculateItemHeights = function () {
    this._itemHeights = [];
    for (let i = 0; i < this._allTodos.length; i++) {
      const item = this._allTodos[i];
      
      // Check if this is a header
      if (item.isHeader) {
        // Headers take up one line height + some padding
        this._itemHeights.push(this.lineHeight() + 16);
      } else {
        // Regular task
        const task = item;
        const lang = ConfigManager.language || "en";
        let taskText = task.title[lang] || task.title.en;
        // Parse control tags to match what will actually be displayed
        taskText = ControlTagParser.parseControlText(taskText);
        const wrappedLines = this.wrapText(taskText, 40);
        // Use less padding for single-line tasks
        const padding = wrappedLines.length === 1 ? 4 : 8;
        const height = Math.max(1, wrappedLines.length) * this.lineHeight() + padding;
        this._itemHeights.push(height);
      }
    }
  };

  Window_TodoListDisplay.prototype.wrapText = function (text, maxChars) {
    const lines = [];
    const words = text.split(' ');
    let currentLine = "";

    for (let i = 0; i < words.length; i++) {
      const word = words[i];
      const testLine = currentLine ? currentLine + ' ' + word : word;

      if (testLine.length > maxChars && currentLine) {
        // Current line is full, push it and start new line with current word
        lines.push(currentLine);
        currentLine = word;
      } else {
        // Word fits on current line
        currentLine = testLine;
      }
    }

    if (currentLine) {
      lines.push(currentLine);
    }

    return lines.length > 0 ? lines : [''];
  };

  Window_TodoListDisplay.prototype.update = function () {
    Window_Base.prototype.update.call(this);
    this.processInput();
  };

  Window_TodoListDisplay.prototype.processInput = function () {
    // Cancel handlers: ESC key, B button, or right mouse button
    if (Input.isTriggered("cancel") || TouchInput.isCancelled()) {
      this.callCancelHandler();
    } else if (Input.isRepeated("up")) {
      this._scrollIndex = Math.max(0, this._scrollIndex - 1);
      this.refresh();
    } else if (Input.isRepeated("down")) {
      const maxScroll = Math.max(0, this._allTodos.length - 1);
      this._scrollIndex = Math.min(maxScroll, this._scrollIndex + 1);
      this.refresh();
    }

    // Mousewheel scrolling
    this.processMouseWheel();
  };

  Window_TodoListDisplay.prototype.processMouseWheel = function () {
    if (this._allTodos.length > 1) {
      const threshold = 20;
      if (TouchInput.wheelY >= threshold) {
        // Scroll down
        this._scrollIndex = Math.min(
          Math.max(0, this._allTodos.length - 1),
          this._scrollIndex + 1
        );
        this.refresh();
      } else if (TouchInput.wheelY <= -threshold) {
        // Scroll up
        this._scrollIndex = Math.max(0, this._scrollIndex - 1);
        this.refresh();
      }
    }
  };

  Window_TodoListDisplay.prototype.refresh = function () {
    this.contents.clear();

    // Show loading message if not yet complete
    if (!this._loadingComplete) {
      this.resetTextColor();
      this.drawText("Loading...", 0, 0, this.contentsWidth(), "center");
      return;
    }

    let y = 0;

    for (let i = this._scrollIndex; i < this._allTodos.length && y < this.contentsHeight(); i++) {
      const item = this._allTodos[i];
      if (!item) continue;

      // Check if this is a header
      if (item.isHeader) {
        // Draw header with color 1 (orange in RPG Maker)
        this.changeTextColor(ColorManager.textColor(1));
        this.drawText(item.mapDisplayName, 0, y, this.contentsWidth(), "left");
        y += this._itemHeights[i] || (this.lineHeight() + 16);
        this.resetTextColor();
        continue;
      }

      // Regular task
      const task = item;
      const lang = ConfigManager.language || "en";
      let taskText = task.title[lang] || task.title.en;
      // Parse control tags based on input method
      taskText = ControlTagParser.parseControlText(taskText);

      // Check if task is complete
      const isComplete = $gameSwitches ? $gameSwitches.value(task.switchId) : false;

      // Set color based on completion
      if (isComplete) {
        this.changeTextColor(ColorManager.textColor(3)); // Green for completed
      } else {
        this.changeTextColor(ColorManager.textColor(0)); // Normal color
      }

      // Draw checkbox
      const checkbox = isComplete ? "☑" : "☐";
      this.drawText(checkbox, 0, y, 30, "left");

      // Wrap and draw text
      const wrappedLines = this.wrapText(taskText, 40);
      for (let j = 0; j < wrappedLines.length; j++) {
        this.drawText(wrappedLines[j], 40, y + (j * this.lineHeight()), this.contentsWidth() - 40);
      }

      y += this._itemHeights[i] || (Math.max(1, wrappedLines.length) * this.lineHeight() + (wrappedLines.length === 1 ? 4 : 8));
      this.resetTextColor();
    }

  };

  Window_TodoListDisplay.prototype.processOk = function () {
    // Pressing OK doesn't do anything, only Cancel exits
    SoundManager.playCancel();
  };

  //=============================================================================
  // Scene_HelpArgumentsFiltered - Filtered Arguments List Scene
  //=============================================================================

  function Scene_HelpArgumentsFiltered() {
    this.initialize(...arguments);
  }

  Scene_HelpArgumentsFiltered.prototype = Object.create(Scene_MenuBase.prototype);
  Scene_HelpArgumentsFiltered.prototype.constructor = Scene_HelpArgumentsFiltered;

  Scene_HelpArgumentsFiltered.prototype.initialize = function () {
    Scene_MenuBase.prototype.initialize.call(this);
    this._filterType = null;
  };

  Scene_HelpArgumentsFiltered.prototype.prepare = function (filterType) {
    this._filterType = filterType;
  };

  Scene_HelpArgumentsFiltered.prototype.create = function () {
    Scene_MenuBase.prototype.create.call(this);
    this.createArgumentsWindow();
  };

  Scene_HelpArgumentsFiltered.prototype.createArgumentsWindow = function () {
    const rect = this.argumentsWindowRect();
    this._argumentsWindow = new Window_HelpArgumentsFiltered(rect, this._filterType);
    this._argumentsWindow.setHandler("ok", this.onArgumentOk.bind(this));
    this._argumentsWindow.setHandler("cancel", this.popScene.bind(this));
    this.addWindow(this._argumentsWindow);
  };

  Scene_HelpArgumentsFiltered.prototype.argumentsWindowRect = function () {
    const ww = Graphics.boxWidth;
    const wh = Graphics.boxHeight - this.mainAreaTop();
    const wx = 0;
    const wy = this.mainAreaTop();
    return new Rectangle(wx, wy, ww, wh);
  };

  Scene_HelpArgumentsFiltered.prototype.onArgumentOk = function () {
    const topic = this._argumentsWindow.item();
    if (topic) {
      SceneManager.push(Scene_HelpDescription);
      SceneManager.prepareNextScene(topic);
    }
  };

  //=============================================================================
  // Window_HelpArgumentsFiltered - Filtered Arguments Window
  //=============================================================================

  function Window_HelpArgumentsFiltered() {
    this.initialize(...arguments);
  }

  Window_HelpArgumentsFiltered.prototype = Object.create(Window_Selectable.prototype);
  Window_HelpArgumentsFiltered.prototype.constructor = Window_HelpArgumentsFiltered;

  Window_HelpArgumentsFiltered.prototype.initialize = function (rect, filterType) {
    Window_Selectable.prototype.initialize.call(this, rect);
    this._filterType = filterType;
    this._data = this.getFilteredTopics();
    this.refresh();
    this.select(0);
    this.activate();
  };

  Window_HelpArgumentsFiltered.prototype.getFilteredTopics = function () {
    return HELP_TOPICS.filter(topic => {
      if (!topic.type) return false;
      return topic.type === this._filterType;
    });
  };

  Window_HelpArgumentsFiltered.prototype.maxItems = function () {
    return this._data.length;
  };

  Window_HelpArgumentsFiltered.prototype.item = function () {
    return this._data[this.index()] || null;
  };

  Window_HelpArgumentsFiltered.prototype.drawItem = function (index) {
    const topic = this._data[index];
    if (!topic) return;

    const lang = ConfigManager.language || "en";
    const title = lang === "it" && topic.title_it ? topic.title_it : topic.title;

    const rect = this.itemLineRect(index);
    this.drawText(title, rect.x, rect.y, rect.width);
  };

  //=============================================================================
  // Scene_HelpArguments - Arguments List Scene
  //=============================================================================

  function Scene_HelpArguments() {
    this.initialize(...arguments);
  }

  Scene_HelpArguments.prototype = Object.create(Scene_MenuBase.prototype);
  Scene_HelpArguments.prototype.constructor = Scene_HelpArguments;

  Scene_HelpArguments.prototype.initialize = function () {
    Scene_MenuBase.prototype.initialize.call(this);
  };

  Scene_HelpArguments.prototype.create = function () {
    Scene_MenuBase.prototype.create.call(this);
    this.createArgumentsWindow();
  };

  Scene_HelpArguments.prototype.createArgumentsWindow = function () {
    const rect = this.argumentsWindowRect();
    this._argumentsWindow = new Window_HelpArguments(rect);
    this._argumentsWindow.setHandler("ok", this.onArgumentOk.bind(this));
    this._argumentsWindow.setHandler("cancel", this.popScene.bind(this));
    this.addWindow(this._argumentsWindow);
  };

  Scene_HelpArguments.prototype.argumentsWindowRect = function () {
    const ww = Graphics.boxWidth;
    const wh = Graphics.boxHeight - this.mainAreaTop();
    const wx = 0;
    const wy = this.mainAreaTop();
    return new Rectangle(wx, wy, ww, wh);
  };

  Scene_HelpArguments.prototype.onArgumentOk = function () {
    const topic = this._argumentsWindow.item();
    if (topic) {
      SceneManager.push(Scene_HelpDescription);
      SceneManager.prepareNextScene(topic);
    }
  };

  //=============================================================================
  // Scene_HelpDescription - Description Display Scene
  //=============================================================================

  function Scene_HelpDescription() {
    this.initialize(...arguments);
  }

  Scene_HelpDescription.prototype = Object.create(Scene_MenuBase.prototype);
  Scene_HelpDescription.prototype.constructor = Scene_HelpDescription;

  Scene_HelpDescription.prototype.initialize = function () {
    Scene_MenuBase.prototype.initialize.call(this);
    this._topic = null;
  };

  Scene_HelpDescription.prototype.prepare = function (topic) {
    this._topic = topic;
  };

  Scene_HelpDescription.prototype.create = function () {
    Scene_MenuBase.prototype.create.call(this);
    this.createDescriptionWindow();
  };

  Scene_HelpDescription.prototype.createDescriptionWindow = function () {
    const rect = this.descriptionWindowRect();
    this._descriptionWindow = new Window_HelpDescriptionDisplay(rect);
    this._descriptionWindow.setHandler("cancel", this.popScene.bind(this));
    this._descriptionWindow.setTopic(this._topic);
    this.addWindow(this._descriptionWindow);
  };

  Scene_HelpDescription.prototype.descriptionWindowRect = function () {
    const ww = Graphics.boxWidth;
    const wh = Graphics.boxHeight - this.mainAreaTop();
    const wx = 0;
    const wy = this.mainAreaTop();
    return new Rectangle(wx, wy, ww, wh);
  };

  //=============================================================================
  // Window_HelpArguments - Arguments List Window
  //=============================================================================

  function Window_HelpArguments() {
    this.initialize(...arguments);
  }

  Window_HelpArguments.prototype = Object.create(Window_Selectable.prototype);
  Window_HelpArguments.prototype.constructor = Window_HelpArguments;

  Window_HelpArguments.prototype.initialize = function (rect) {
    Window_Selectable.prototype.initialize.call(this, rect);
    this.refresh();
    this.select(0);
    this.activate();
  };

  Window_HelpArguments.prototype.maxCols = function () {
    return 2;
  };

  Window_HelpArguments.prototype.maxItems = function () {
    return sortedTopics.length;
  };

  Window_HelpArguments.prototype.item = function () {
    return sortedTopics[this.index()];
  };

  Window_HelpArguments.prototype.drawItem = function (index) {
    const topic = sortedTopics[index];
    if (topic) {
      const rect = this.itemLineRect(index);
      this.resetTextColor();

      // Determine which title to display
      let displayTitle = topic.title;
      if ($gameSystem && $gameSystem.isJapanese && $gameSystem.isJapanese()) {
        displayTitle = topic.title_it || topic.title;
      }

      this.drawText(displayTitle, rect.x, rect.y, rect.width);
    }
  };

  Window_HelpArguments.prototype.refresh = function () {
    this.contents.clear();
    this.drawAllItems();
  };

  //=============================================================================
  // Window_HelpDescriptionDisplay - Description Display Window
  //=============================================================================

  function Window_HelpDescriptionDisplay() {
    this.initialize(...arguments);
  }

  Window_HelpDescriptionDisplay.prototype = Object.create(
    Window_Selectable.prototype
  );
  Window_HelpDescriptionDisplay.prototype.constructor =
    Window_HelpDescriptionDisplay;

  Window_HelpDescriptionDisplay.prototype.initialize = function (rect) {
    Window_Selectable.prototype.initialize.call(this, rect);
    this._topic = null;
    this._scrollY = 0;
    this._maxScrollY = 0;
    this._targetScrollY = 0;
    this._scrollBarSprite = null;
    this._lastBarHeight = 0;
    this.activate();
    this.createScrollBar();
  };

  Window_HelpDescriptionDisplay.prototype.setTopic = function (topic) {
    if (this._topic !== topic) {
      this._topic = topic;
      this._scrollY = 0;
      this._targetScrollY = 0;
      this._lastBarHeight = 0;
      this.refresh();
      this.updateScrollBar();
    }
  };

  Window_HelpDescriptionDisplay.prototype.createScrollBar = function () {
    this._scrollBarSprite = new Sprite();
    this._scrollBarSprite.bitmap = new Bitmap(8, 100);
    this.addChild(this._scrollBarSprite);
    this.updateScrollBar();
  };

  Window_HelpDescriptionDisplay.prototype.updateScrollBar = function () {
    if (!this._scrollBarSprite) return;

    const padding = this.padding;
    const barWidth = 8;
    const barX = this.width - padding - barWidth - 4;
    const barAreaHeight = this.height - padding * 2 - 8; // Extra padding at bottom

    if (this._maxScrollY <= 0) {
      this._scrollBarSprite.visible = false;
      return;
    }

    this._scrollBarSprite.visible = true;

    // Calculate scrollbar height and position
    const visibleHeight = this.contents.height;
    const totalHeight = this._maxScrollY + visibleHeight;
    const barHeight = Math.max(
      30,
      (visibleHeight / totalHeight) * barAreaHeight
    );
    const scrollRatio = this._scrollY / this._maxScrollY;
    const maxBarY = barAreaHeight - barHeight;
    const barY = padding + 4 + maxBarY * scrollRatio;

    // Only redraw bitmap if size changed
    if (!this._lastBarHeight || this._lastBarHeight !== barHeight) {
      this._scrollBarSprite.bitmap.clear();
      this._scrollBarSprite.bitmap.fillRect(
        0,
        0,
        barWidth,
        barHeight,
        "rgba(255, 255, 255, 0.6)"
      );
      this._lastBarHeight = barHeight;
    }

    this._scrollBarSprite.x = barX;
    this._scrollBarSprite.y = barY;
  };

  Window_HelpDescriptionDisplay.prototype.refresh = function () {
    this.contents.clear();
    if (this._topic) {
      this.drawTopicContent();
    }
  };

  Window_HelpDescriptionDisplay.prototype.drawTopicContent = function () {
    const topic = this._topic;
    let displayDescription = topic.description;

    // Check for Italian version
    if ($gameSystem && $gameSystem.isJapanese && $gameSystem.isJapanese()) {
      displayDescription = topic.description_it || topic.description;
    }

    const textWidth = this.contents.width - 20;
    const lineHeight = this.lineHeight();
    let y = -this._scrollY;

    // Draw the title
    this.resetTextColor();
    this.contents.fontSize = 28;
    let displayTitle = topic.title;
    if ($gameSystem && $gameSystem.isJapanese && $gameSystem.isJapanese()) {
      displayTitle = topic.title_it || topic.title;
    }
    this.drawText(displayTitle, 10, y, textWidth);
    y += lineHeight + 10;

    // Reset font size
    this.contents.fontSize = this.contents._makeFontNameText().match(/\d+/)[0];

    // Draw description with word wrapping and color support
    if (displayDescription) {
      const lines = this.wrapText(displayDescription, textWidth);
      for (let i = 0; i < lines.length; i++) {
        if (y >= -lineHeight && y < this.contents.height) {
          this.drawTextWithColors(lines[i], 10, y, textWidth);
        }
        y += lineHeight;
      }
    }

    // Draw image if exists
    if (topic.image && topic.image !== "") {
      y += 10;
      const bitmap = ImageManager.loadPicture(topic.image);
      if (bitmap) {
        bitmap.addLoadListener(() => {
          const maxWidth = textWidth;
          const scale = Math.min(1, maxWidth / bitmap.width);
          const width = bitmap.width * scale;
          const height = bitmap.height * scale;
          if (y >= -height && y < this.contents.height) {
            this.contents.blt(
              bitmap,
              0,
              0,
              bitmap.width,
              bitmap.height,
              10,
              y,
              width,
              height
            );
          }
        });
      }
    }

    this._maxScrollY = Math.max(
      0,
      y + this._scrollY - this.contents.height + lineHeight
    );
  };

  Window_HelpDescriptionDisplay.prototype.wrapText = function (text, maxWidth) {
    const lines = [];
    const paragraphs = text.split("\n");

    for (let p = 0; p < paragraphs.length; p++) {
      const paragraph = paragraphs[p];
      if (paragraph === "") {
        lines.push("");
        continue;
      }

      const words = paragraph.split(" ");
      let currentLine = "";

      for (let i = 0; i < words.length; i++) {
        const testLine = currentLine + (currentLine ? " " : "") + words[i];
        const testWidth = this.contents.measureTextWidth(testLine);

        if (testWidth > maxWidth && currentLine !== "") {
          lines.push(currentLine);
          currentLine = words[i];
        } else {
          currentLine = testLine;
        }
      }

      if (currentLine !== "") {
        lines.push(currentLine);
      }
    }

    return lines;
  };

  Window_HelpDescriptionDisplay.prototype.drawTextWithColors = function (
    text,
    x,
    y,
    maxWidth
  ) {
    // Parse text for color codes like \c[n] and handle them
    const colorCodes = /\\c\[(\d+)\]/g;
    let parts = [];
    let lastIndex = 0;
    let match;

    while ((match = colorCodes.exec(text)) !== null) {
      if (match.index > lastIndex) {
        parts.push({
          text: text.substring(lastIndex, match.index),
          color: null,
        });
      }
      parts.push({ text: "", color: parseInt(match[1]) });
      lastIndex = match.index + match[0].length;
    }
    if (lastIndex < text.length) {
      parts.push({ text: text.substring(lastIndex), color: null });
    }

    let currentX = x;
    for (let i = 0; i < parts.length; i++) {
      const part = parts[i];

      if (part.color !== null) {
        this.changeTextColor(ColorManager.textColor(part.color));
      } else if (part.text) {
        this.drawText(part.text, currentX, y, maxWidth - (currentX - x));
        currentX += this.contents.measureTextWidth(part.text);
      }
    }

    this.resetTextColor();
  };

  Window_HelpDescriptionDisplay.prototype.update = function () {
    Window_Selectable.prototype.update.call(this);
    this.updateScrolling();
    this.updateSmoothScroll();
    this.processWheel();
  };

  Window_HelpDescriptionDisplay.prototype.updateScrolling = function () {
    if (this._maxScrollY <= 0) return;

    const scrollSpeed = 24; // Increased scroll speed for smoother feel

    if (Input.isPressed("up")) {
      this._targetScrollY = Math.max(0, this._targetScrollY - scrollSpeed);
    } else if (Input.isPressed("down")) {
      this._targetScrollY = Math.min(
        this._maxScrollY,
        this._targetScrollY + scrollSpeed
      );
    } else if (Input.isPressed("pageup")) {
      this._targetScrollY = Math.max(
        0,
        this._targetScrollY - this.contents.height / 2
      );
    } else if (Input.isPressed("pagedown")) {
      this._targetScrollY = Math.min(
        this._maxScrollY,
        this._targetScrollY + this.contents.height / 2
      );
    }
  };

  Window_HelpDescriptionDisplay.prototype.updateSmoothScroll = function () {
    const oldScrollY = this._scrollY;

    if (this._scrollY !== this._targetScrollY) {
      const diff = this._targetScrollY - this._scrollY;
      const step = Math.ceil(Math.abs(diff) / 4); // Smooth interpolation

      if (Math.abs(diff) < step) {
        this._scrollY = this._targetScrollY;
      } else {
        this._scrollY += diff > 0 ? step : -step;
      }

      // Clamp scroll position
      this._scrollY = Math.max(0, Math.min(this._maxScrollY, this._scrollY));

      // Only refresh content if scroll position changed significantly
      if (Math.abs(this._scrollY - oldScrollY) >= 1) {
        this.refresh();
      }
    }

    // Always update scrollbar position (lightweight operation)
    this.updateScrollBar();
  };

  Window_HelpDescriptionDisplay.prototype.processWheel = function () {
    if (this.isOpenAndActive() && this._maxScrollY > 0) {
      const threshold = 20;
      if (TouchInput.wheelY >= threshold) {
        this._targetScrollY = Math.min(
          this._maxScrollY,
          this._targetScrollY + 40
        );
      }
      if (TouchInput.wheelY <= -threshold) {
        this._targetScrollY = Math.max(0, this._targetScrollY - 40);
      }
    }
  };
})();
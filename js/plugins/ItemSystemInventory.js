/*:
 * @target MZ
 * @plugindesc v1.0.0 Inventory System - Enhanced item management and usage
 * @author Omni-Lex
 * @help ItemSystemInventory.js
 *
 * This plugin provides the enhanced inventory scene with categories, weight tracking, and item usage.
 * Requires ItemSystemUtils.js to be loaded first.
 *
 * Features:
 * - Tabbed inventory with categories (Food, Medical, Tools, Weapons, Armor, Materials)
 * - Weight tracking system with carry capacity limits
 * - Item consumption with effects and common events
 * - Equipment assignment to actors
 * - Bust image support for inventory interactions
 *
 * Terms of Use:
 * Free for use in both commercial and non-commercial projects.
 */

(function () {
  "use strict";

  //=============================================================================
  // Validation - Ensure ItemSystemUtils is loaded
  //=============================================================================

  if (!window.ItemSystemUtils) {
    throw new Error("ItemSystemInventory.js requires ItemSystemUtils.js to be loaded first!");
  }

  // Import utilities from ItemSystemUtils
  const utils = window.ItemSystemUtils;
  const {
    FOOD_HP_RECOVERY_VARIABLE_ID,
    FOOD_COMMON_EVENT_ACTOR1,
    FOOD_COMMON_EVENT_ACTOR2,
    FOOD_COMMON_EVENT_ACTOR3
  } = window.ItemSystemUtils;

  //=============================================================================
  // Special Commands Configuration
  //=============================================================================

  const SPECIAL_COMMANDS = {
    "Glow": { commonEventId: 349 },
    "Ignite": { commonEventId: 350 },
    "Freeze": { commonEventId: 351 },
    "Shock": { commonEventId: 352 },
    "Heal": { commonEventId: 353 },
    "Poison": { commonEventId: 354 },
    "Enchant": { commonEventId: 355 },
    "Transmute": { commonEventId: 356 },
    "Absorb": { commonEventId: 357 },
    "Reflect": { commonEventId: 358 }
  };

  //=============================================================================
  // Enhanced Item Scene
  //=============================================================================

  function Scene_EnhancedItem() {
    this.initialize(...arguments);
  }

  Scene_EnhancedItem.prototype = Object.create(Scene_MenuBase.prototype);
  Scene_EnhancedItem.prototype.constructor = Scene_EnhancedItem;

  Scene_EnhancedItem.prototype.initialize = function () {
    Scene_MenuBase.prototype.initialize.call(this);
    this._mode = "item"; // Always stays in 'item' mode
    this._openCategory = null; // Track which category drawer is open
  };

  Scene_EnhancedItem.prototype.create = function () {
    Scene_MenuBase.prototype.create.call(this);
    this.createWeightWindow();
    this.createItemWindow();
    this.createDetailWindow();
    this.createActorWindow();
    this.createTargetWindow();
    this.createEquipSelectionWindow();
    this.createContextMenu();

    this._itemWindow.setCategory("item");
    this._itemWindow.refresh();

    this._itemWindow.setDetailWindow(this._detailWindow);
    this._itemWindow.setWeightWindow(this._weightWindow);

    this._actorWindow.setHandlers(this);
    this._targetWindow.setHandlers(this);
    this._equipSelectionWindow.setHandlers(this);
    this._contextMenu.setHandlers(this);

    this._itemWindow.select(0);
    this._itemWindow.activate();
  };

  Scene_EnhancedItem.prototype.createWeightWindow = function () {
    const rect = this.weightWindowRect();
    this._weightWindow = new Window_Weight(rect);
    this.addWindow(this._weightWindow);
  };

  Scene_EnhancedItem.prototype.weightWindowRect = function () {
    const wx = 0;
    const wy = 0;
    const ww = Graphics.boxWidth;
    const wh = this.calcWindowHeight(1, true);
    return new Rectangle(wx, wy, ww, wh);
  };

  Scene_EnhancedItem.prototype.createItemWindow = function () {
    const rect = this.itemWindowRect();
    this._itemWindow = new Window_EnhancedItemList(rect);
    this._itemWindow.setHandler("ok", this.onItemOk.bind(this));
    this._itemWindow.setHandler("cancel", this.onItemCancel.bind(this));
    this.addWindow(this._itemWindow);
  };

  Scene_EnhancedItem.prototype.itemWindowRect = function () {
    const wx = 0;
    const wy = this._weightWindow.height;
    const ww = Math.floor(Graphics.boxWidth / 2);
    const wh = Graphics.boxHeight - wy;
    return new Rectangle(wx, wy, ww, wh);
  };

  Scene_EnhancedItem.prototype.createDetailWindow = function () {
    const wx = Math.floor(Graphics.boxWidth / 2);
    const wy = this._weightWindow.height;
    const ww = Math.floor(Graphics.boxWidth / 2);
    const wh = Graphics.boxHeight - wy;
    this._detailWindow = new Window_ItemDetail(new Rectangle(wx, wy, ww, wh)); // Uses the master Window_ItemDetail from ItemSystemShop
    this.addWindow(this._detailWindow);
  };

  Scene_EnhancedItem.prototype.createTargetWindow = function () {
    const rect = this.targetWindowRect();
    this._targetWindow = new Window_ItemTarget(rect);
    this._targetWindow.hide();
    this.addWindow(this._targetWindow);
  };

  Scene_EnhancedItem.prototype.targetWindowRect = function () {
    const wx = 0;
    const wy = this._weightWindow.height;
    const ww = Graphics.boxWidth;
    const wh = Graphics.boxHeight - wy;
    return new Rectangle(wx, wy, ww, wh);
  };

  Scene_EnhancedItem.prototype.createActorWindow = function () {
    const rect = this.actorWindowRect();
    this._actorWindow = new Window_MenuActor(rect);
    this._actorWindow.hide();
    this.addWindow(this._actorWindow);
  };

  Scene_EnhancedItem.prototype.actorWindowRect = function () {
    const wx = 0;
    const wy = this._weightWindow.height;
    const ww = Graphics.boxWidth;
    const wh = Graphics.boxHeight - wy;
    return new Rectangle(wx, wy, ww, wh);
  };

  Scene_EnhancedItem.prototype.createEquipSelectionWindow = function () {
    const rect = this.equipSelectionWindowRect();
    this._equipSelectionWindow = new Window_EquipSelection(rect);
    this._equipSelectionWindow.hide();
    this.addWindow(this._equipSelectionWindow);
  };

  Scene_EnhancedItem.prototype.equipSelectionWindowRect = function () {
    const wx = Math.floor(Graphics.boxWidth / 4);
    const wy = Math.floor(Graphics.boxHeight / 3);
    const ww = Math.floor(Graphics.boxWidth / 2);
    const wh = this.calcWindowHeight(Math.min($gameParty.size(), 2) + 1, true);
    return new Rectangle(wx, wy, ww, wh);
  };

  Scene_EnhancedItem.prototype.createContextMenu = function () {
    const rect = this.contextMenuRect();
    this._contextMenu = new Window_ItemContextMenu(rect);
    this._contextMenu.hide();
    this.addWindow(this._contextMenu);
  };

  Scene_EnhancedItem.prototype.contextMenuRect = function () {
    const ww = 300;
    const wh = this.calcWindowHeight(6, true); // Max 6 options (3 equip + throw + specials)
    const wx = (Graphics.boxWidth - ww) / 2;
    const wy = (Graphics.boxHeight - wh) / 2;
    return new Rectangle(wx, wy, ww, wh);
  };

  //=============================================================================
  // Scene_EnhancedItem Handlers
  //=============================================================================

  Scene_EnhancedItem.prototype.onActorOk = function (actor) {
    this._actorWindow.hide();
    this._itemWindow.show();
    this._itemWindow.activate();
  };

  Scene_EnhancedItem.prototype.onActorCancel = function () {
    this._actorWindow.hide();
    this._itemWindow.show();
    this._itemWindow.activate();
  };

  Scene_EnhancedItem.prototype.onItemOk = function () {
    const item = this._itemWindow.item();

    if (!item) {
      this._itemWindow.activate();
      return;
    }

    // Handle category drawer toggle
    if (item.isCommand) {
      SoundManager.playCursor();
      const selectedIndex = this._itemWindow.index();

      // Toggle category drawer: if it's already open, close it; otherwise, open it
      if (this._openCategory === item.category) {
        this._openCategory = null;
      } else {
        this._openCategory = item.category;
      }

      this._itemWindow.setOpenCategory(this._openCategory);
      this._itemWindow.refresh();
      this._itemWindow.select(selectedIndex);
      this._itemWindow.activate();
      return;
    }

    if (DataManager.isItem(item)) {
      // Show context menu for regular items
      this.showContextMenu(item);
    } else if (DataManager.isWeapon(item) || DataManager.isArmor(item)) {
      // Show context menu for weapons/armor (includes Equip options and Throw)
      this.showContextMenu(item);
    } else {
      this._itemWindow.activate();
    }
  };

  Scene_EnhancedItem.prototype.showContextMenu = function (item) {
    this._contextMenu.setItem(item);
    this._contextMenu.show();
    this._contextMenu.activate();
    this._contextMenu.select(0);
  };

  Scene_EnhancedItem.prototype.onItemCancel = function () {
    this.popScene();
  };

  Scene_EnhancedItem.prototype.handleItemSelection = function (item) {
    if (DataManager.isItem(item)) {
      if (this.isItemTargetRequired(item)) {
        this.showItemTargetWindow(item);
      } else {
        this.useItemWithoutTarget(item);
        this._itemWindow.refresh();
        this._itemWindow.activate();
        this._weightWindow.refresh();
      }
    }
  };

  Scene_EnhancedItem.prototype.handleEquipmentSelection = function (item) {
    const compatibleActors = this.findCompatibleActors(item);

    if (compatibleActors.length === 0) {
      SoundManager.playBuzzer();
      this._itemWindow.activate();
    } else if (compatibleActors.length === 1) {
      this.equipItemToActor(item, compatibleActors[0]);
    } else {
      this.showEquipSelectionWindow(item, compatibleActors);
    }
  };

  Scene_EnhancedItem.prototype.findCompatibleActors = function (item) {
    return $gameParty.members().filter((actor) => actor.canEquip(item));
  };

  Scene_EnhancedItem.prototype.showEquipSelectionWindow = function (
    item,
    compatibleActors
  ) {
    this._equipSelectionWindow.setItem(item);
    this._equipSelectionWindow.setActors(compatibleActors);
    this._equipSelectionWindow.refresh();
    this._equipSelectionWindow.show();
    this._equipSelectionWindow.activate();
    this._equipSelectionWindow.select(0);
  };

  Scene_EnhancedItem.prototype.onEquipSelectionOk = function () {
    const item = this._equipSelectionWindow.item();
    const actor = this._equipSelectionWindow.selectedActor();

    if (item && actor) {
      this.equipItemToActor(item, actor);
    } else {
      this._equipSelectionWindow.hide();
      this._itemWindow.activate();
    }
  };

  Scene_EnhancedItem.prototype.onEquipSelectionCancel = function () {
    this._equipSelectionWindow.hide();
    this._itemWindow.activate();
  };

  Scene_EnhancedItem.prototype.onContextMenuOk = function () {
    const command = this._contextMenu.currentSymbol();
    const item = this._contextMenu.item();

    this._contextMenu.hide();

    switch (command) {
      case "use":
        this.handleItemSelection(item);
        break;
      case "throw":
        this.throwItemToPlugin(item);
        break;
      case "disassemble":
        this.disassembleItem(item);
        break;
      case "equip1":
        this.equipItemToActorByIndex(item, 0);
        break;
      case "equip2":
        this.equipItemToActorByIndex(item, 1);
        break;
      case "equip3":
        this.equipItemToActorByIndex(item, 2);
        break;
      default:
        // Handle special commands (special1, special2, special3)
        if (command.startsWith("special")) {
          this.executeSpecialCommand(item, command);
        } else {
          this._itemWindow.activate();
        }
        break;
    }
  };

  Scene_EnhancedItem.prototype.onContextMenuCancel = function () {
    this._contextMenu.hide();
    this._itemWindow.activate();
  };

  Scene_EnhancedItem.prototype.throwItemToPlugin = function (item) {
    if (!item) {
      this._itemWindow.activate();
      return;
    }

    // Determine item type and ID
    let itemType = 'item';
    let itemId = 0;

    if (DataManager.isWeapon(item)) {
      itemType = 'weapon';
      itemId = item.id;
    } else if (DataManager.isArmor(item)) {
      itemType = 'armor';
      itemId = item.id;
    } else if (DataManager.isItem(item)) {
      itemType = 'item';
      itemId = item.id;
    }

    // Check if party has the item
    if ($gameParty.numItems(item) <= 0) {
      SoundManager.playBuzzer();
      this._itemWindow.activate();
      return;
    }

    // Save item data for throwing on the map
    $gameSystem._pendingThrowItem = {
      itemType: itemType,
      itemId: itemId,
      iconIndex: item.iconIndex
    };

    // Close all menus and return to map
    SoundManager.playOk();
    SceneManager.goto(Scene_Map);
  };

  Scene_EnhancedItem.prototype.equipItemToActorByIndex = function (item, actorIndex) {
    if (!item) {
      this._itemWindow.activate();
      return;
    }

    const actor = $gameParty.members()[actorIndex];
    if (!actor) {
      SoundManager.playBuzzer();
      this._itemWindow.activate();
      return;
    }

    if (!actor.canEquip(item)) {
      SoundManager.playBuzzer();
      this._itemWindow.activate();
      return;
    }

    this.equipItemToActor(item, actor);
  };

  Scene_EnhancedItem.prototype.disassembleItem = function (item) {
    if (!item) {
      this._itemWindow.activate();
      return;
    }

    // Placeholder for disassemble functionality
    SoundManager.playBuzzer();
    console.log("Disassemble not yet implemented for:", item.name);
    this._itemWindow.activate();
  };

  Scene_EnhancedItem.prototype.executeSpecialCommand = function (item, commandSymbol) {
    if (!item || !item.note) {
      this._itemWindow.activate();
      return;
    }

    // Parse special commands from item notes
    const specialCommands = this.parseSpecialCommands(item);
    const index = parseInt(commandSymbol.replace("special", "")) - 1;

    if (index >= 0 && index < specialCommands.length) {
      const specialName = specialCommands[index];
      const specialConfig = SPECIAL_COMMANDS[specialName];

      if (specialConfig && specialConfig.commonEventId) {
        SoundManager.playOk();
        $gameTemp.reserveCommonEvent(specialConfig.commonEventId);
        this.popScene();
        SceneManager.goto(Scene_Map);
        return;
      }
    }

    SoundManager.playBuzzer();
    this._itemWindow.activate();
  };

  Scene_EnhancedItem.prototype.parseSpecialCommands = function (item) {
    if (!item || !item.note) return [];

    const specialCommands = [];
    const regex = /<Special:\s*(.+?)>/gi;
    let match;

    while ((match = regex.exec(item.note)) !== null) {
      specialCommands.push(match[1].trim());
    }

    return specialCommands;
  };

  Scene_EnhancedItem.prototype.equipItemToActor = function (item, actor) {
    if (!item || !actor) return;

    let slotId = -1;

    if (DataManager.isWeapon(item)) {
      slotId = actor.equipSlots().indexOf(1);
    } else if (DataManager.isArmor(item)) {
      const equipSlots = actor.equipSlots();
      for (let i = 0; i < equipSlots.length; i++) {
        if (equipSlots[i] === 2 && $dataArmors[item.id].etypeId === 2) {
          slotId = i; break;
        } else if (equipSlots[i] === 3 && $dataArmors[item.id].etypeId === 3) {
          slotId = i; break;
        } else if (equipSlots[i] === 4 && $dataArmors[item.id].etypeId === 4) {
          slotId = i; break;
        } else if (equipSlots[i] === 5 && $dataArmors[item.id].etypeId === 5) {
          slotId = i; break;
        }
      }
    }

    if (slotId >= 0) {
      SoundManager.playEquip();
      actor.changeEquip(slotId, item);
      this._itemWindow.refresh();
      this._weightWindow.refresh();
      if (this._equipSelectionWindow.visible) {
        this._equipSelectionWindow.hide();
      }
      this._itemWindow.activate();
    } else {
      SoundManager.playBuzzer();
      if (this._equipSelectionWindow.visible) {
        this._equipSelectionWindow.hide();
      }
      this._itemWindow.activate();
    }
  };

  Scene_EnhancedItem.prototype.isItemTargetRequired = function (item) {
    if (!item) return false;
    const scope = item.scope;
    return [7, 8, 9, 10].includes(scope); // Allies
  };

  Scene_EnhancedItem.prototype.showItemTargetWindow = function (item) {
    this._targetWindow.setItem(item);
    this._targetWindow.refresh();
    this._targetWindow.show();
    this._targetWindow.activate();
    this._targetWindow.select(0);
    this._itemWindow.hide();
    this._detailWindow.hide();
  };

  Scene_EnhancedItem.prototype.onTargetOk = function () {
    const item = this._targetWindow.item();
    const targetIndex = this._targetWindow.index();

    if (item) {
      const partySize = $gameParty.members().length;
      if (partySize > 1 && targetIndex === partySize) {
        this.useItemOnAllParty(item);
      } else {
        const actor = $gameParty.members()[targetIndex];
        if (actor) {
          this.useItemOnActor(actor, item);
        }
      }
      this.hideTargetWindowAndRefresh();
    }
  };

  Scene_EnhancedItem.prototype.onTargetCancel = function () {
    this.hideTargetWindowAndRefresh();
  };

  Scene_EnhancedItem.prototype.hideTargetWindowAndRefresh = function () {
    if (this._targetWindow && !this._targetWindow.destroyed) {
      this._targetWindow.hide();
    }
    if (this._itemWindow && !this._itemWindow.destroyed) {
      this._itemWindow.show();
      this._itemWindow.refresh();
      this._itemWindow.activate();
    }
    if (this._detailWindow && !this._detailWindow.destroyed) {
      this._detailWindow.show();
    }
    if (this._weightWindow && !this._weightWindow.destroyed) {
      this._weightWindow.refresh();
    }
  };

  Scene_EnhancedItem.prototype.useItemWithoutTarget = function (item) {
    if (!item) return;

    if (item.scope === 0 || item.scope === 11) {
      const commonEventId = this.getCommonEventEffect(item);
      this.playItemSound(item);
      $gameParty.consumeItem(item);

      if (commonEventId > 0) {
        $gameTemp.reserveCommonEvent(commonEventId);
        this.popScene();
        SceneManager.goto(Scene_Map);
        return;
      }

      if (item.scope === 0) {
        $gameParty.members().forEach((actor) => {
          actor.useItem(item);
        });
      } else if (item.scope === 11) {
        const actor = $gameParty.leader();
        if (actor && actor.canUse(item)) {
          actor.useItem(item);
        }
      }

      $gameScreen.startFlash([255, 255, 255, 128], 8);
    } else {
      SoundManager.playBuzzer();
    }
  };

  Scene_EnhancedItem.prototype.useItemOnAllParty = function (item) {
    if (!item) return;

    const isFood = utils.hasItemCategory(item, "Food");

    if (isFood) {
      this.playItemSound(item);
      let totalHpRecoveryPercent = 0;
      let memberCount = 0;
      const targets = $gameParty.members().filter((member) => member.isAlive());
      if (targets.length === 0) return;

      $gameParty.consumeItem(item);

      for (const actor of targets) {
        if (item.damage && item.damage.type === 3) {
          const action = new Game_Action(actor);
          action.setItemObject(item);
          const value = action.makeDamageValue(actor, false);
          totalHpRecoveryPercent += Math.floor((value / actor.mhp) * 100);
          memberCount++;

          if (actor.hp < actor.mhp) {
            action.apply(actor);
            actor.refresh();
          }
        }
      }

      const avgRecovery = memberCount > 0 ? Math.floor(totalHpRecoveryPercent / memberCount) : 0;
      this.handleFoodItem(null, item, true);

      if (this.triggerCommonEvent(item)) {
        this.popScene();
        SceneManager.goto(Scene_Map);
      } else {
        $gameScreen.startFlash([255, 255, 255, 128], 8);
      }

      this.hideTargetWindowAndRefresh();
      return;
    }

    this.playItemSound(item);

    const targets = $gameParty.members().filter((member) => {
      if (item.scope === 9 || item.scope === 10) return member.isDead();
      return member.isAlive();
    });

    if (targets.length === 0) return;

    $gameParty.consumeItem(item);
    let successfulUses = 0;
    for (const actor of targets) {
      const action = new Game_Action(actor);
      action.setItemObject(item);
      action.apply(actor);
      if (actor.result().isHit()) {
        successfulUses++;
      }
      actor.refresh();
    }

    if (this.triggerCommonEvent(item)) {
      this.popScene();
      SceneManager.goto(Scene_Map);
    } else if (successfulUses > 0) {
      $gameScreen.startFlash([255, 255, 255, 128], 8);
    }

    this.hideTargetWindowAndRefresh();
  };

  Scene_EnhancedItem.prototype.triggerCommonEvent = function (item) {
    const commonEventId = this.getCommonEventEffect(item);

    if (commonEventId > 0) {
      $gameTemp.reserveCommonEvent(commonEventId);
      return true;
    }
    return false;
  };

  Scene_EnhancedItem.prototype.useItemOnActor = function (actor, item) {
    if (!actor || !item) return;

    const isFood = utils.hasItemCategory(item, "Food");

    if (isFood) {
      this.playItemSound(item);
      let hpRecoveryPercent = 0;
      if (item.damage && item.damage.type === 3) {
        const action = new Game_Action(actor);
        action.setItemObject(item);
        const value = action.makeDamageValue(actor, false);
        hpRecoveryPercent = Math.floor((value / actor.mhp) * 100);
      }

      if (actor.hp < actor.mhp && item.damage && item.damage.type === 3) {
        const action = new Game_Action(actor);
        action.setItemObject(item);
        action.apply(actor);
        actor.refresh();
      }

      $gameParty.consumeItem(item);
      this.handleFoodItem(actor, item);

      if (this.triggerCommonEvent(item)) {
        this.popScene();
        SceneManager.goto(Scene_Map);
      } else {
        $gameScreen.startFlash([255, 255, 255, 128], 8);
      }

      this.hideTargetWindowAndRefresh();
      return;
    }

    const action = new Game_Action(actor);
    action.setItemObject(item);
    action.apply(actor);

    if (actor.result().isHit()) {
      this.playItemSound(item);
      $gameParty.consumeItem(item);

      if (this.triggerCommonEvent(item)) {
        this.popScene();
        SceneManager.goto(Scene_Map);
      } else {
        $gameScreen.startFlash([255, 255, 255, 128], 8);
      }

      actor.refresh();
    } else {
      SoundManager.playBuzzer();
    }

    this.hideTargetWindowAndRefresh();
  };

  Scene_EnhancedItem.prototype.calculateHealingAmount = function (
    action,
    target,
    item
  ) {
    if (!action || !target || !item || !item.damage) return 0;
    let value = action.evalDamageFormula(target);
    value = action.applyVariance(value, item.damage.variance);
    if (item.damage.critical) {
      value = action.applyCritical(value);
    }
    return value;
  };

  Scene_EnhancedItem.prototype.applyItemDamageEffects = function (actor, item) {
    if (!actor || !item || !item.damage || item.damage.type === 0) return false;
    const action = new Game_Action(actor);
    action.setItemObject(item);
    let value = this.calculateHealingAmount(action, actor, item);

    switch (item.damage.type) {
      case 1: actor.gainHp(-value); break;
      case 2: actor.gainMp(-value); break;
      case 3: actor.gainHp(value); SoundManager.playRecovery(); break;
      case 4: actor.gainMp(value); SoundManager.playRecovery(); break;
      case 5: actor.gainHp(value); break;
      case 6: actor.gainMp(value); break;
      default: return false;
    }
    return true;
  };

  Scene_EnhancedItem.prototype.applyItemEffects = function (actor, item) {
    if (!actor || !item || !item.effects) return;
    for (const effect of item.effects) {
      this.applyItemEffect(actor, effect);
    }
  };

  Scene_EnhancedItem.prototype.applyItemEffect = function (actor, effect) {
    if (!actor || !effect) return;
    switch (effect.code) {
      case Game_Action.EFFECT_REMOVE_DEBUFF:
        actor.removeBuff(effect.dataId);
        break;
      case Game_Action.EFFECT_GROW:
        actor.addParam(effect.dataId, Math.floor(effect.value1));
        break;
      case Game_Action.EFFECT_LEARN_SKILL:
        actor.learnSkill(effect.dataId);
        break;
    }
  };

  Scene_EnhancedItem.prototype.hasItemCategory = function (item, category) {
    if (!item || !item.note) return false;
    const regex = new RegExp(`<category:${category}>`, "i");
    return regex.test(item.note);
  };

  Scene_EnhancedItem.prototype.handleFoodItem = function (
    actor,
    item,
    isParty = false
  ) {
    const caloriesMatch = item.note.match(/<calories:(\d+)>/);
    const fatMatch = item.note.match(/<fat:(\d+)>/);
    const proteinMatch = item.note.match(/<protein:(\d+)>/);

    if (caloriesMatch) $gameVariables.setValue(88, Number(caloriesMatch[1]));
    if (fatMatch) $gameVariables.setValue(89, Number(fatMatch[1]));
    if (proteinMatch) $gameVariables.setValue(90, Number(proteinMatch[1]));

      let commonEventId = 0;

    if (isParty || !actor) {
      commonEventId = FOOD_COMMON_EVENT_ACTOR1;
    } else if (actor.actorId() === 1) {
      commonEventId = FOOD_COMMON_EVENT_ACTOR1;
    } else if (actor.actorId() === 2) {
      commonEventId = FOOD_COMMON_EVENT_ACTOR2;
    } else if (actor.actorId() === 3) {
      commonEventId = FOOD_COMMON_EVENT_ACTOR3;
    }

    if (commonEventId > 0) {
      $gameTemp.reserveCommonEvent(commonEventId);
    }
  };

  Scene_EnhancedItem.prototype.getCommonEventEffect = function (item) {
    if (!item || !item.effects) return 0;
    const commonEventEffect = item.effects.find(
      (effect) => effect.code === Game_Action.EFFECT_COMMON_EVENT
    );
    return commonEventEffect ? commonEventEffect.dataId : 0;
  };

  Scene_EnhancedItem.prototype.getAnimationSound = function(item) {
    if (!item || !item.animationId || item.animationId <= 0) {
      return null;
    }
    const animation = $dataAnimations[item.animationId];
    if (!animation || !animation.soundTimings || animation.soundTimings.length === 0) {
      return null;
    }
    const sortedSounds = animation.soundTimings.slice().sort((a, b) => a.frame - b.frame);
    return sortedSounds[0] ? sortedSounds[0].se : null;
  };

  Scene_EnhancedItem.prototype.playItemSound = function(item) {
    const animationSound = this.getAnimationSound(item);
    if (animationSound && animationSound.name) {
      AudioManager.playSe(animationSound);
    } else {
      SoundManager.playUseItem(); // Fallback
    }
  };

  //=============================================================================
  // Auto-Eat System
  //=============================================================================

  // Function to automatically eat a food item when hunger reaches 0%
  function autoEatFood(actor) {
    if (!actor) return false;

    // Find a food item in inventory
    const foodItems = $gameParty.allItems().filter(item =>
      DataManager.isItem(item) && utils.hasItemCategory(item, "Food")
    );

    if (foodItems.length === 0) {
      console.log(`[AutoEat] No food items available for actor ${actor.actorId()}`);
      return false;
    }

    // Get the first food item
    const foodItem = foodItems[0];

    // Check if we actually have this item
    if ($gameParty.numItems(foodItem) <= 0) {
      console.log(`[AutoEat] Food item found but not in inventory`);
      return false;
    }

    // Extract nutrition values from item notes
    const caloriesMatch = foodItem.note.match(/<calories:(\d+)>/);
    const fatMatch = foodItem.note.match(/<fat:(\d+)>/);
    const proteinMatch = foodItem.note.match(/<protein:(\d+)>/);

    const calories = caloriesMatch ? Number(caloriesMatch[1]) : 0;
    const fat = fatMatch ? Number(fatMatch[1]) : 0;
    const protein = proteinMatch ? Number(proteinMatch[1]) : 0;

    // Set nutrition variables (Variable IDs from ItemSystemUtils)
    $gameVariables.setValue(88, calories);
    $gameVariables.setValue(89, fat);
    $gameVariables.setValue(90, protein);

    // Play eat sound
    const animationSound = foodItem.animationId && $dataAnimations[foodItem.animationId]
      ? ($dataAnimations[foodItem.animationId].soundTimings || []).find(st => st.se && st.se.name)
      : null;

    if (animationSound && animationSound.se && animationSound.se.name) {
      AudioManager.playSe(animationSound.se);
    } else {
      SoundManager.playUseItem();
    }

    // Consume the item
    $gameParty.consumeItem(foodItem);

    // Manually trigger hunger recovery (instead of using plugin command)
    // Use the EatFood plugin command logic
    const calorieFactor = 0.10;
    const proteinFactor = 2.00;
    const fatFactor = 1.50;
    const recoveryAmount = (calories * calorieFactor) + (protein * proteinFactor) + (fat * fatFactor);

    actor.addHunger(recoveryAmount);

    // Reset nutrition variables
    $gameVariables.setValue(88, 0);
    $gameVariables.setValue(89, 0);
    $gameVariables.setValue(90, 0);

    // Trigger common event for food consumption (if actor 1, 2, or 3)
    let commonEventId = 0;
    if (actor.actorId() === 1) {
      commonEventId = FOOD_COMMON_EVENT_ACTOR1;
    } else if (actor.actorId() === 2) {
      commonEventId = FOOD_COMMON_EVENT_ACTOR2;
    } else if (actor.actorId() === 3) {
      commonEventId = FOOD_COMMON_EVENT_ACTOR3;
    }

    if (commonEventId > 0) {
      $gameTemp.reserveCommonEvent(commonEventId);
    }

    // Add notification
    const useTranslation = ConfigManager.language === "it";
    const itemName = window.translateText ? window.translateText(foodItem.name) : foodItem.name;
    const message = useTranslation
      ? `${actor.name()} ha mangiato automaticamente ${itemName}!`
      : `${actor.name()} automatically ate ${itemName}!`;

    if ($gameTemp && $gameTemp.addHungerSleepNotification) {
      $gameTemp.addHungerSleepNotification(message);
    }

    console.log(`[AutoEat] Actor ${actor.actorId()} automatically ate ${foodItem.name} (recovered ${recoveryAmount.toFixed(2)} hunger)`);
    return true;
  }

  // Hook into Game_Party hunger update to trigger auto-eat
  const _Game_Party_updateHungerAndSleep = Game_Party.prototype.updateHungerAndSleep;
  Game_Party.prototype.updateHungerAndSleep = function() {
    // Call original function first
    _Game_Party_updateHungerAndSleep.call(this);

    // Check each actor for 0% hunger and auto-eat
    this.members().forEach((actor) => {
      if (actor.hunger() <= 0) {
        // Try to auto-eat
        autoEatFood(actor);
      }
    });
  };

  //=============================================================================
  // Weight Window Class
  //=============================================================================

  function Window_Weight() {
    this.initialize(...arguments);
  }

  Window_Weight.prototype = Object.create(Window_Base.prototype);
  Window_Weight.prototype.constructor = Window_Weight;

  Window_Weight.prototype.initialize = function (rect) {
    Window_Base.prototype.initialize.call(this, rect);
    this.refresh();
  };

  Window_Weight.prototype.refresh = function () {
    this.contents.clear();
    const currentWeight = utils.calculateTotalWeight();
    const maxWeight = utils.calculateMaxCarryWeight();
    const useTranslation = ConfigManager.language === "it";

    const tabName = useTranslation ? "Oggetti" : "Items";

    const x = 0;
    const y = 0;
    const width = this.innerWidth;

    this.changeTextColor(ColorManager.systemColor());
    this.drawText(tabName, x, y, width, "left");

    if (utils.isOverencumbered()) {
      this.changeTextColor(ColorManager.deathColor());
    } else if (currentWeight > maxWeight * 0.8) {
      this.changeTextColor(ColorManager.crisisColor());
    } else {
      this.changeTextColor(ColorManager.normalColor());
    }

    const weightText = useTranslation ? "Peso" : "Weight";
    this.drawText(
      weightText + ": " + utils.formatWeight(currentWeight) + " / " + utils.formatWeight(maxWeight),
      x, y, width, "right"
    );

    if (utils.isOverencumbered()) {
      this.changeTextColor(ColorManager.deathColor());
      const warningText = useTranslation
        ? "Sovraccarico! Movimento rallentato!"
        : "Overencumbered! Movement slowed!";
      this.drawText(warningText, x, y + this.lineHeight() / 2, width, "center");
    }
    this.resetTextColor();
  };

  //=============================================================================
  // Enhanced Item List Window
  //=============================================================================

  function Window_EnhancedItemList() {
    this.initialize(...arguments);
  }

  Window_EnhancedItemList.prototype = Object.create(Window_ItemList.prototype);
  Window_EnhancedItemList.prototype.constructor = Window_EnhancedItemList;

  Window_EnhancedItemList.prototype.initialize = function (rect) {
    Window_ItemList.prototype.initialize.call(this, rect);
    this._category = "item";
    this._detailWindow = null;
    this._weightWindow = null;
    this._scene = null;
    this._openCategory = null; // Track which category drawer is open
  };

  Window_EnhancedItemList.prototype.maxCols = function () {
    return 1;
  };

  Window_EnhancedItemList.prototype.drawItem = function (index) {
    const item = this.itemAt(index);
    if (item) {
      const rect = this.itemLineRect(index);

      if (item.isCommand) {
        this.changeTextColor(ColorManager.systemColor());
        this.drawText(item.name, rect.x, rect.y, rect.width, "left");
        this.resetTextColor();
        return;
      }

      const numberWidth = this.numberWidth();
      const weightWidth = 80;
      const originalName = item.name;
      if (window.translateText && typeof window.translateText === "function") {
        item.name = window.translateText(item.name);
      }

      let displayName = item.name;
      if (displayName.length > 13) {
        displayName = displayName.substring(0, 13) + "...";
      }

      const tempName = item.name;
      item.name = displayName;
      this.drawItemName(item, rect.x, rect.y, rect.width - numberWidth - weightWidth);
      item.name = tempName;

      this.resetTextColor();
      this.drawItemNumber(item, rect.x, rect.y, rect.width);
    }
  };

  Window_EnhancedItemList.prototype.setDetailWindow = function (detailWindow) {
    this._detailWindow = detailWindow;
    this.updateDetail();
  };

  Window_EnhancedItemList.prototype.setWeightWindow = function (weightWindow) {
    this._weightWindow = weightWindow;
  };

  Window_EnhancedItemList.prototype.setCategory = function (category) {
    if (this._category !== category) {
      this._category = category;
      this._data = [];
      this.makeItemList();
      this.refresh();
      this.scrollTo(0, 0);
    }
  };

  Window_EnhancedItemList.prototype.setOpenCategory = function (category) {
    this._openCategory = category;
    this.makeItemList();
  };

  Window_EnhancedItemList.prototype.includes = function (item) {
    switch (this._category) {
      case "item":
        return DataManager.isItem(item) && item.itypeId === 1 && !utils.isFoodItem(item) && !utils.isToolsItem(item) && !utils.isMedicalItem(item);
      case "medical":
        return DataManager.isItem(item) && utils.isMedicalItem(item);
      case "tools":
        return DataManager.isItem(item) && utils.isToolsItem(item);
      case "food":
        return DataManager.isItem(item) && utils.isFoodItem(item);
      case "weapon":
        return DataManager.isWeapon(item);
      case "armor":
        return DataManager.isArmor(item);
      case "keyItem":
        return DataManager.isItem(item) && item.itypeId === 2;
      default:
        return false;
    }
  };

  Window_EnhancedItemList.prototype.makeItemList = function () {
    this._data = [];
    const useTranslation = ConfigManager.language === "it";

    // Define categories in order
    const categories = [
      { key: "medical", label: useTranslation ? "[Medico]" : "[Medical]", count: utils.countMedicalItems() },
      { key: "food", label: useTranslation ? "[Cibo]" : "[Food]", count: utils.countFoodItems() },
      { key: "tools", label: useTranslation ? "[Essenziali]" : "[Tools]", count: utils.countToolsItems() },
      { key: "weapon", label: useTranslation ? "[Armi]" : "[Weapons]", count: utils.countWeapons() },
      { key: "armor", label: useTranslation ? "[Armature]" : "[Armors]", count: utils.countArmors() },
      { key: "keyItem", label: useTranslation ? "[Materiali]" : "[Materials]", count: utils.countMaterials() }
    ];

    // Build list with accordion behavior
    for (const cat of categories) {
      // Only show categories that have items
      if (cat.count > 0) {
        // Add category header
        this._data.push({
          name: `${cat.label} (${cat.count})`,
          isCommand: true,
          category: cat.key
        });

        // If this category is open, add its items
        if (this._openCategory === cat.key) {
          let categoryItems = [];
          if (cat.key === "medical") {
            categoryItems = $gameParty.allItems().filter((item) => DataManager.isItem(item) && utils.isMedicalItem(item));
          } else if (cat.key === "tools") {
            categoryItems = $gameParty.allItems().filter((item) => DataManager.isItem(item) && utils.isToolsItem(item));
          } else if (cat.key === "food") {
            categoryItems = $gameParty.allItems().filter((item) => DataManager.isItem(item) && utils.isFoodItem(item));
          } else if (cat.key === "weapon") {
            categoryItems = $gameParty.weapons();
          } else if (cat.key === "armor") {
            categoryItems = $gameParty.armors();
          } else if (cat.key === "keyItem") {
            categoryItems = $gameParty.allItems().filter((item) => DataManager.isItem(item) && item.itypeId === 2);
          }
          this._data = this._data.concat(categoryItems);
        }
      }
    }

    // Add regular items at the end (items that don't belong to any category)
    const regularItems = $gameParty.allItems().filter((item) =>
      DataManager.isItem(item) &&
      item.itypeId === 1 &&
      !utils.isFoodItem(item) &&
      !utils.isToolsItem(item) &&
      !utils.isMedicalItem(item)
    );
    this._data = this._data.concat(regularItems);
  };

  Window_EnhancedItemList.prototype.select = function (index) {
    Window_ItemList.prototype.select.call(this, index);
    this.updateDetail();
  };

  Window_EnhancedItemList.prototype.updateDetail = function () {
    if (this._detailWindow) {
      const item = this.item();
      this._detailWindow.setItem(item);
    }
  };

  Window_EnhancedItemList.prototype.setHandlers = function (scene) {
    this._scene = scene;
    this.setHandler("ok", this.onItemOk.bind(this));
    this.setHandler("cancel", this.onItemCancel.bind(this));
  };

  Window_EnhancedItemList.prototype.onItemOk = function () {
    this._scene.onItemOk();
  };

  Window_EnhancedItemList.prototype.processHandling = function () {
    if (this.isOpenAndActive()) {
      if (Input.isTriggered("ok")) {
        this.processOk();
        return;
      }
      if (Input.isTriggered("cancel") || Input.isRepeated("cancel")) {
        this.processCancel();
        return;
      }
      if (Input.isRepeated("pagedown")) {
        this.cursorPagedown();
      }
      if (Input.isRepeated("pageup")) {
        this.cursorPageup();
      }
    }
  };

  Window_EnhancedItemList.prototype.processOk = function () {
    if (this.isCurrentItemEnabled()) {
      this.playOkSound();
      this.updateInputData();
      this.deactivate();
      this.callOkHandler();
    } else {
      this.playBuzzerSound();
    }
  };

  Window_EnhancedItemList.prototype.isCurrentItemEnabled = function () {
    const item = this.item();
    if (!item) return false;
    if (item.isCommand) return true;
    // Allow all items, weapons, and armor to be selected
    // The context menu will handle what actions are available
    return true;
  };

  Window_EnhancedItemList.prototype.isEnabled = function (item) {
    if (!item) return false;
    if (item.isCommand) return true;
    // Allow all items, weapons, and armor to be selected
    // The context menu will handle what actions are available
    return true;
  };

  // Override base Window_ItemList.prototype.isEnabled
  Window_ItemList.prototype.isEnabled = function (item) {
    if (!item) return false;
    // Allow all items to be selected
    // The context menu will handle what actions are available
    return true;
  };

  Window_EnhancedItemList.prototype.callOkHandler = function () {
    if (this.isHandled("ok")) {
      this.callHandler("ok");
    }
  };

  //=============================================================================
  // Item Context Menu Window
  //=============================================================================

  function Window_ItemContextMenu() {
    this.initialize(...arguments);
  }

  Window_ItemContextMenu.prototype = Object.create(Window_Command.prototype);
  Window_ItemContextMenu.prototype.constructor = Window_ItemContextMenu;

  Window_ItemContextMenu.prototype.initialize = function (rect) {
    this._item = null;
    Window_Command.prototype.initialize.call(this, rect);
    this.hide();
    this.deactivate();
  };

  Window_ItemContextMenu.prototype.setItem = function (item) {
    if (this._item !== item) {
      this._item = item;
      this.refresh();
      this.updateWindowHeight();
    }
  };

  Window_ItemContextMenu.prototype.updateWindowHeight = function () {
    const numCommands = this.maxItems();
    const newHeight = this.fittingHeight(numCommands);
    const newY = (Graphics.boxHeight - newHeight) / 2;

    this.move(this.x, newY, this.width, newHeight);
    this.createContents();
    this.refresh();
  };

  Window_ItemContextMenu.prototype.item = function () {
    return this._item;
  };

  Window_ItemContextMenu.prototype.makeCommandList = function () {
    if (!this._item) return;

    const useTranslation = ConfigManager.language === "it";
    const isEquipment = DataManager.isWeapon(this._item) || DataManager.isArmor(this._item);

    if (isEquipment) {
      // Equipment context menu: Equip options + Throw + Cancel
      const equipText = useTranslation ? "Equipaggia a" : "Equip";

      // Add equip command for each party member who can equip this item
      $gameParty.members().forEach((actor, index) => {
        if (actor && actor.canEquip(this._item)) {
          const actorName = window.translateText ? window.translateText(actor.name()) : actor.name();
          this.addCommand(`${equipText} ${actorName}`, `equip${index + 1}`);
        }
      });

      this.addCommand(useTranslation ? "Getta via" : "Throw", "throw");
    } else {
      // Regular item context menu: Use (if consumable), Throw, Disassemble, Special

      // Check if item is consumable (default: yes, unless <Consumable: no>)
      const isConsumable = this.isItemConsumable(this._item);
      // Check if item can be used in menu (occasion: 0 = Always, 2 = Menu Screen)
      const canUseInMenu = this._item.occasion === 0 || this._item.occasion === 2;

      if (isConsumable && canUseInMenu) {
        this.addCommand(useTranslation ? "Usa" : "Use", "use");
      }

      this.addCommand(useTranslation ? "Getta via" : "Throw", "throw");
      this.addCommand(useTranslation ? "Smonta" : "Disassemble", "disassemble");

      // Add special commands from item notes
      const specialCommands = this.parseSpecialCommands(this._item);
      for (let i = 0; i < Math.min(specialCommands.length, 3); i++) {
        const specialName = specialCommands[i];
        const translatedName = useTranslation && this.translateSpecialCommand(specialName)
          ? this.translateSpecialCommand(specialName)
          : specialName;
        this.addCommand(translatedName, `special${i + 1}`);
      }
    }
  };

  Window_ItemContextMenu.prototype.isItemConsumable = function (item) {
    if (!item || !item.note) return true; // Default: consumable

    // Check for <Consumable: no> tag
    const match = item.note.match(/<Consumable:\s*(no|false)>/i);
    return !match; // Return false if tag exists, true otherwise
  };

  Window_ItemContextMenu.prototype.parseSpecialCommands = function (item) {
    if (!item || !item.note) return [];

    const specialCommands = [];
    const regex = /<Special:\s*(.+?)>/gi;
    let match;

    while ((match = regex.exec(item.note)) !== null) {
      specialCommands.push(match[1].trim());
    }

    return specialCommands;
  };

  Window_ItemContextMenu.prototype.translateSpecialCommand = function (commandName) {
    // Add Italian translations for special commands here
    const translations = {
      "Glow": "Illumina",
      "Ignite": "Accendi",
      "Freeze": "Congela",
      "Shock": "Elettrizza",
      "Heal": "Cura",
      "Poison": "Avvelena",
      "Enchant": "Incanta",
      "Transmute": "Tramuta",
      "Absorb": "Assorbi",
      "Reflect": "Rifletti"
    };
    return translations[commandName] || null;
  };

  Window_ItemContextMenu.prototype.setHandlers = function (scene) {
    this._scene = scene;
    this.setHandler("ok", this.onMenuOk.bind(this));
    this.setHandler("cancel", this.onMenuCancel.bind(this));
  };

  Window_ItemContextMenu.prototype.onMenuOk = function () {
    if (this._scene && this._scene.onContextMenuOk) {
      this._scene.onContextMenuOk();
    }
  };

  Window_ItemContextMenu.prototype.onMenuCancel = function () {
    if (this._scene && this._scene.onContextMenuCancel) {
      this._scene.onContextMenuCancel();
    }
  };

  //=============================================================================
  // Override Scene_Menu to use our enhanced scene
  //=============================================================================

  const _Scene_Menu_commandItem = Scene_Menu.prototype.commandItem;
  Scene_Menu.prototype.commandItem = function () {
    SceneManager.push(Scene_EnhancedItem);
  };

  //=============================================================================
  // Actor Window Extensions
  //=============================================================================

  Window_MenuActor.prototype.setHandlers = function (scene) {
    this._scene = scene;
    this.setHandler("ok", this.onActorOk.bind(this));
    this.setHandler("cancel", this.onActorCancel.bind(this));
  };

  Window_MenuActor.prototype.onActorOk = function () {
    if (this._scene && this._scene.onActorOk) {
      this._scene.onActorOk(this.actor());
    }
  };

  Window_MenuActor.prototype.onActorCancel = function () {
    if (this._scene && this._scene.onActorCancel) {
      this._scene.onActorCancel();
    }
  };

  //=============================================================================
  // Input Handler Extensions
  //=============================================================================

  const _Scene_EnhancedItem_update = Scene_EnhancedItem.prototype.update;
  Scene_EnhancedItem.prototype.update = function () {
    if (_Scene_EnhancedItem_update) {
      _Scene_EnhancedItem_update.call(this);
    }
    if (TouchInput.isCancelled()) {
      this.popScene();
      return;
    }
    if (Input.isTriggered("cancel")) {
      const activeWindow = this._windowLayer.children.find((w) => w.active);
      if (!activeWindow || !activeWindow.isHandled("cancel")) {
        this.popScene();
      }
    }
  };

  //=============================================================================
  // Target Selection Window
  //=============================================================================

  function Window_ItemTarget() {
    this.initialize(...arguments);
  }

  Window_ItemTarget.prototype = Object.create(Window_Selectable.prototype);
  Window_ItemTarget.prototype.constructor = Window_ItemTarget;

  Window_ItemTarget.prototype.initialize = function (rect) {
    Window_Selectable.prototype.initialize.call(this, rect);
    this._item = null;
    this._scene = null;
    this.refresh();
    this.select(0);
    this.hide();
  };

  Window_ItemTarget.prototype.setItem = function (item) {
    if (this._item !== item) {
      this._item = item;
      this.refresh();
    }
  };

  Window_ItemTarget.prototype.maxItems = function () {
    return $gameParty.members().length;
  };

  Window_ItemTarget.prototype.maxCols = function () {
    return Math.min($gameParty.members().length, 3);
  };

  Window_ItemTarget.prototype.itemWidth = function () {
    return Math.floor((this.innerWidth - this.colSpacing()) / this.maxCols());
  };

  Window_ItemTarget.prototype.itemHeight = function () {
    return Math.floor(this.innerHeight / Math.min(2, this.maxItems()));
  };

  Window_ItemTarget.prototype.item = function () {
    return this._item;
  };

  Window_ItemTarget.prototype.isCurrentItemEnabled = function () {
    return this.isItemEnabled(this.index());
  };

  Window_ItemTarget.prototype.isItemEnabled = function (index) {
    if (index >= 0 && index < $gameParty.members().length) {
      const actor = $gameParty.members()[index];
      return this.canUse(actor, this._item);
    }
    return false;
  };

  Window_ItemTarget.prototype.canUse = function (actor, item) {
    if (!actor || !item) return false;
    const isFood = utils.hasItemCategory(item, "Food");
    if (DataManager.isItem(item) && (item.scope === 9 || item.scope === 10)) {
      return actor.isDead();
    }
    if (DataManager.isItem(item) && item.damage && item.damage.type === 3 && !isFood) {
      return actor.hp < actor.mhp;
    }
    if (DataManager.isItem(item) && item.damage && item.damage.type === 4) {
      return actor.mp < actor.mmp;
    }
    return actor.canUse(item);
  };

  Window_ItemTarget.prototype.hasItemCategory = function (item, category) {
    if (!item || !item.note) return false;
    const regex = new RegExp(`<category:${category}>`, "i");
    return regex.test(item.note);
  };

  Window_ItemTarget.prototype.drawItem = function (index) {
    const actor = $gameParty.members()[index];
    if (!actor) return;
    const useTranslation = ConfigManager.language === "it";
    const rect = this.itemRect(index);
    const padding = 3;
    this.resetTextColor();
    this.changePaintOpacity(this.isItemEnabled(index));

    const faceWidth = 160;
    const faceHeight = 200;
    const faceX = rect.x + padding;
    const faceY = rect.y + padding;

    try {
      // Get bust image path (checks variables 106-109 based on actor ID, uses SPRITES_ASSOCIATION)
      const bustImagePath = utils.getActorBustImagePath(actor);

      // Load fallback image with error handling
      let fallbackImage = null;
    try {
        fallbackImage = ImageManager.loadBitmap("img/busts/", "7");
      } catch (err) {
        console.error("Failed to load fallback bust image:", err);
      }

      let bustBitmap = null;
      try {
        bustBitmap = ImageManager.loadBitmap("", bustImagePath);
      } catch (err) {
        console.error("Failed to load bust image:", bustImagePath, err);
      }

      if (!bustBitmap || !fallbackImage) {
        console.warn("Cannot display bust: bust or fallback image failed to load");
        return;
      }

      bustBitmap.addLoadListener(() => {
        // Check if the image loaded successfully
        if (bustBitmap.width > 0 && bustBitmap.height > 0) {
          this.contents.blt(bustBitmap, 0, 180, bustBitmap.width, bustBitmap.height - 180, faceX, faceY, faceWidth, faceHeight);
        } else {
          // Use fallback if primary image failed
          this.contents.blt(fallbackImage, 0, 180, fallbackImage.width, fallbackImage.height - 180, faceX, faceY, faceWidth, faceHeight);
        }
      });

      bustBitmap.addErrorListener(() => {
        // Use fallback on error
        this.contents.blt(fallbackImage, 0, 180, fallbackImage.width, fallbackImage.height - 180, faceX, faceY, faceWidth, faceHeight);
      });

      // Try immediate draw if already loaded
      if (bustBitmap.isReady() && bustBitmap.width > 0) {
        this.contents.blt(bustBitmap, 0, 180, bustBitmap.width, bustBitmap.height - 180, faceX, faceY, faceWidth, faceHeight);
      }
    } catch (error) {
        // Fallback on exception
        const fallbackImage = ImageManager.loadBitmap("img/busts/", "7");
        if (fallbackImage.isReady()) {
          this.contents.blt(fallbackImage, 0, 180, fallbackImage.width, fallbackImage.height - 180, faceX, faceY, faceWidth, faceHeight);
        } else {
          fallbackImage.addLoadListener(() => {
            this.contents.blt(fallbackImage, 0, 180, fallbackImage.width, fallbackImage.height - 180, faceX, faceY, faceWidth, faceHeight);
          });
        }
    }

    // Position name and stats below the large sprite instead of to the right
    const nameX = faceX;
    const nameY = faceY + faceHeight + padding;
    const translatedName = window.translateText ? window.translateText(actor.name()) : actor.name();
    this.drawText(translatedName, nameX, nameY, faceWidth, "left");

    const gaugeWidth = faceWidth;
    const gaugeHeight = 16;
    const gaugeX = nameX;
    let gaugeY = nameY + this.lineHeight();

    this.changeTextColor(ColorManager.systemColor());
    this.drawText("HP ", gaugeX, gaugeY, 30);
    this.drawGauge(gaugeX + 35, gaugeY, gaugeWidth - 35, actor.hpRate(), ColorManager.hpGaugeColor1(), ColorManager.hpGaugeColor2());
    this.changeTextColor(ColorManager.hpColor(actor));
    this.drawText(actor.hp + " / " + actor.mhp + "", gaugeX + 35, gaugeY, gaugeWidth - 35, "left");

    gaugeY += gaugeHeight + 8;
    this.changeTextColor(ColorManager.systemColor());
    this.drawText("MP ", gaugeX, gaugeY, 30);
    this.drawGauge(gaugeX + 35, gaugeY, gaugeWidth - 35, actor.mpRate(), ColorManager.mpGaugeColor1(), ColorManager.mpGaugeColor2());
    this.changeTextColor(ColorManager.mpColor(actor));
    this.drawText(actor.mp + " / " + actor.mmp + "", gaugeX + 35, gaugeY, gaugeWidth - 35, "left");

    if ($dataSystem.optDisplayTp) {
      gaugeY += gaugeHeight + 8;
      this.changeTextColor(ColorManager.systemColor());
      this.drawText("AP ", gaugeX, gaugeY, 30);
      this.drawGauge(gaugeX + 35, gaugeY, gaugeWidth - 35, actor.tpRate(), ColorManager.tpGaugeColor1(), ColorManager.tpGaugeColor2());
      this.changeTextColor(ColorManager.tpColor(actor));
      this.drawText(actor.tp + " / 100", gaugeX + 35, gaugeY, gaugeWidth - 35, "left");
    }

    gaugeY += gaugeHeight + 16;
    const statX = gaugeX;
    const statWidth = 80;
    const valueWidth = 60;

    this.changePaintOpacity(true);
  };

  Window_ItemTarget.prototype.drawAllPartyOption = function (rect) {
    const padding = 20;
    const nameWidth = 140;
    const useTranslation = ConfigManager.language === "it";
    this.changePaintOpacity(this.isItemEnabled($gameParty.members().length));
    this.changeTextColor(ColorManager.systemColor());
    this.drawText(useTranslation ? "Tutto il Party" : "All Party", rect.x + padding, rect.y, nameWidth);
    this.resetTextColor();
    this.drawText(
      useTranslation ? "Dividi gli effetti tra i compagni" : "Distribute effects among members",
      rect.x + padding + nameWidth, rect.y, rect.width - padding - nameWidth
    );
    this.changePaintOpacity(true);
  };

  Window_ItemTarget.prototype.drawActorInfo = function (actor, rect) {
    if (!actor) return;
    const padding = 20;
    const nameWidth = 140;
    const gaugeWidth = 90;
    const valueWidth = 70;
    const spacing = 20;
    this.changePaintOpacity(this.isItemEnabled($gameParty.members().indexOf(actor)));
    this.changeTextColor(ColorManager.systemColor());
    const translatedName = window.translateText ? window.translateText(actor.name()) : actor.name();
    this.drawText(translatedName, rect.x + padding, rect.y, nameWidth);
    let x = rect.x + padding + nameWidth + spacing;
    this.drawActorHp(actor, x, rect.y, gaugeWidth);
    x += gaugeWidth + valueWidth + spacing;
    this.drawActorMp(actor, x, rect.y, gaugeWidth);
    x += gaugeWidth + valueWidth + spacing;
    if ($dataSystem.optDisplayTp) {
      this.drawActorTp(actor, x, rect.y, gaugeWidth);
    }
    this.changePaintOpacity(true);
  };

  Window_ItemTarget.prototype.drawActorHp = function (actor, x, y, width) {
    const color1 = ColorManager.hpGaugeColor1();
    const color2 = ColorManager.hpGaugeColor2();
    this.drawGauge(x, y, width, actor.hpRate(), color1, color2);
    this.changeTextColor(ColorManager.systemColor());
    this.drawText("HP", x, y, 30);
    this.changeTextColor(ColorManager.hpColor(actor));
    this.drawText(actor.hp + " / " + actor.mhp + " HP", x + 35, y, width - 35, "left");
  };

  Window_ItemTarget.prototype.drawActorMp = function (actor, x, y, width) {
    const color1 = ColorManager.mpGaugeColor1();
    const color2 = ColorManager.mpGaugeColor2();
    this.drawGauge(x, y, width, actor.mpRate(), color1, color2);
    this.changeTextColor(ColorManager.systemColor());
    this.drawText("MP", x, y, 30);
    this.changeTextColor(ColorManager.mpColor(actor));
    this.drawText(actor.mp + " / " + actor.mmp + "", x + 35, y, width - 35, "left");
  };

  Window_ItemTarget.prototype.drawActorTp = function (actor, x, y, width) {
    const color1 = ColorManager.tpGaugeColor1();
    const color2 = ColorManager.tpGaugeColor2();
    this.drawGauge(x, y, width, actor.tpRate(), color1, color2);
    this.changeTextColor(ColorManager.systemColor());
    this.drawText("AP", x, y, 30);
    this.changeTextColor(ColorManager.tpColor(actor));
    this.drawText(actor.tp + " / 100 AP", x + 35, y, width - 35, "left");
  };

  Window_ItemTarget.prototype.refresh = function () {
    this.contents.clear();
    this.drawAllItems();
  };

  Window_ItemTarget.prototype.setHandlers = function (scene) {
    this._scene = scene;
    this.setHandler("ok", this.onTargetOk.bind(this));
    this.setHandler("cancel", this.onTargetCancel.bind(this));
  };

  Window_ItemTarget.prototype.onTargetOk = function () {
    this._scene.onTargetOk();
  };

  Window_ItemTarget.prototype.onTargetCancel = function () {
    this._scene.onTargetCancel();
  };

  //=============================================================================
  // Equipment Selection Window
  //=============================================================================

  function Window_EquipSelection() {
    this.initialize(...arguments);
  }

  Window_EquipSelection.prototype = Object.create(Window_Selectable.prototype);
  Window_EquipSelection.prototype.constructor = Window_EquipSelection;

  Window_EquipSelection.prototype.initialize = function (rect) {
    Window_Selectable.prototype.initialize.call(this, rect);
    this._item = null;
    this._actors = [];
    this._scene = null;
    this.refresh();
    this.hide();
  };

  Window_EquipSelection.prototype.setItem = function (item) {
    if (this._item !== item) {
      this._item = item;
      this.refresh();
    }
  };

  Window_EquipSelection.prototype.setActors = function (actors) {
    this._actors = actors || [];
    this.refresh();
  };

  Window_EquipSelection.prototype.maxItems = function () {
    return this._actors.length;
  };

  Window_EquipSelection.prototype.item = function () {
    return this._item;
  };

  Window_EquipSelection.prototype.selectedActor = function () {
    return this._actors[this.index()];
  };

  Window_EquipSelection.prototype.drawItem = function (index) {
    const rect = this.itemLineRect(index);
    const actor = this._actors[index];
    const useTranslation = ConfigManager.language === "it";
    const padding = 3;

    if (actor) {
      const faceWidth = 64;
      const faceHeight = 64;
      const faceX = rect.x + padding;
      const faceY = rect.y + padding;

      try {
        // Get bust image path (checks variables 106-109 based on actor ID, uses SPRITES_ASSOCIATION)
        const bustImagePath = utils.getActorBustImagePath(actor);

        // Load fallback image with error handling
        let fallbackImage = null;
        try {
          fallbackImage = ImageManager.loadBitmap("img/busts/", "7");
        } catch (err) {
          console.error("Failed to load fallback bust image:", err);
        }

        let bustBitmap = null;
        try {
          bustBitmap = ImageManager.loadBitmap("", bustImagePath);
        } catch (err) {
          console.error("Failed to load bust image:", bustImagePath, err);
        }

        if (!bustBitmap || !fallbackImage) {
          console.warn("Cannot display bust: bust or fallback image failed to load");
          return;
        }

        bustBitmap.addLoadListener(() => {
          // Check if the image loaded successfully
          if (bustBitmap.width > 0 && bustBitmap.height > 0) {
            this.contents.blt(bustBitmap, 0, 180, bustBitmap.width, bustBitmap.height - 180, faceX, faceY, faceWidth, faceHeight);
          } else {
            // Use fallback if primary image failed
            this.contents.blt(fallbackImage, 0, 180, fallbackImage.width, fallbackImage.height - 180, faceX, faceY, faceWidth, faceHeight);
          }
        });

        bustBitmap.addErrorListener(() => {
          // Use fallback on error
          this.contents.blt(fallbackImage, 0, 180, fallbackImage.width, fallbackImage.height - 180, faceX, faceY, faceWidth, faceHeight);
        });

        // Try immediate draw if already loaded
        if (bustBitmap.isReady() && bustBitmap.width > 0) {
          this.contents.blt(bustBitmap, 0, 180, bustBitmap.width, bustBitmap.height - 180, faceX, faceY, faceWidth, faceHeight);
        }
      } catch (error) {
        const fallbackImage = ImageManager.loadBitmap("img/busts/", "7");
        if (fallbackImage.isReady()) {
          this.contents.blt(fallbackImage, 0, 180, fallbackImage.width, fallbackImage.height - 180, faceX, faceY, faceWidth, faceHeight);
        } else {
          fallbackImage.addLoadListener(() => {
            this.contents.blt(fallbackImage, 0, 180, fallbackImage.width, fallbackImage.height - 180, faceX, faceY, faceWidth, faceHeight);
          });
        }
      }

      const translatedName = window.translateText ? window.translateText(actor.name()) : actor.name();
      this.drawText(translatedName, rect.x + padding, rect.y + 210, 160);

      if (this._item) {
        let equipType = "";
        let currentEquip = null;
        if (DataManager.isWeapon(this._item)) {
          equipType = useTranslation ? "Arma" : "Weapon";
          currentEquip = actor.weapons()[0];
        } else if (DataManager.isArmor(this._item)) {
          switch (this._item.etypeId) {
            case 2: equipType = useTranslation ? "Scudo" : "Shield"; currentEquip = actor.armors().find((a) => a.etypeId === 2); break;
            case 3: equipType = useTranslation ? "Testa" : "Head"; currentEquip = actor.armors().find((a) => a.etypeId === 3); break;
            case 4: equipType = useTranslation ? "Corpo" : "Body"; currentEquip = actor.armors().find((a) => a.etypeId === 4); break;
            case 5: equipType = useTranslation ? "Accessorio" : "Accessory"; currentEquip = actor.armors().find((a) => a.etypeId === 5); break;
            default: equipType = useTranslation ? "Armatura" : "Armor"; break;
          }
        }
        this.changeTextColor(ColorManager.systemColor());
        this.drawText(equipType + ":", rect.x + padding, rect.y + 230, 100);
        this.resetTextColor();
        if (currentEquip) {
          const originalName = currentEquip.name;
          if (window.translateText && typeof window.translateText === "function") {
            currentEquip.name = window.translateText(currentEquip.name);
          }
          this.drawItemName(currentEquip, rect.x + 180, rect.y + 32, 200);
          currentEquip.name = originalName;
        } else {
          this.drawText(useTranslation ? "Nessuno" : "None", rect.x + 180, rect.y + 32, 200);
        }
      }
    }
  };

  Window_EquipSelection.prototype.drawActorMenuImage = function (actor, x, y) {
    const faceIndex = actor.faceIndex();
    const faceName = actor.faceName();
    const width = ImageManager.faceWidth;
    const height = ImageManager.faceHeight;
    const faceWidth = 160;
    const faceHeight = 200;
    const faceX = x;
    const faceY = y;

    // Get bust image path (checks variables 106-109 based on actor ID, uses SPRITES_ASSOCIATION)
    const bustImagePath = utils.getActorBustImagePath(actor);

    // Load fallback image with error handling
    let fallbackImage = null;
    try {
      fallbackImage = ImageManager.loadBitmap("img/busts/", "7");
    } catch (err) {
      console.error("Failed to load fallback bust image:", err);
    }

    let bustBitmap = null;
    try {
      bustBitmap = ImageManager.loadBitmap("", bustImagePath);
    } catch (err) {
      console.error("Failed to load bust image:", bustImagePath, err);
    }

    if (!bustBitmap || !fallbackImage) {
      console.warn("Cannot display bust: bust or fallback image failed to load");
      return;
    }

    bustBitmap.addLoadListener(() => {
      // Check if the image loaded successfully
      if (bustBitmap.width > 0 && bustBitmap.height > 0) {
        this.contents.blt(bustBitmap, 0, 180, bustBitmap.width, bustBitmap.height - 180, faceX, faceY, faceWidth, faceHeight);
      } else {
        // Use fallback if primary image failed
        this.contents.blt(fallbackImage, 0, 180, fallbackImage.width, fallbackImage.height - 180, faceX, faceY, faceWidth, faceHeight);
      }
    });

    bustBitmap.addErrorListener(() => {
      // Use fallback on error
      this.contents.blt(fallbackImage, 0, 180, fallbackImage.width, fallbackImage.height - 180, faceX, faceY, faceWidth, faceHeight);
    });

    // Try immediate draw if already loaded
    if (bustBitmap.isReady() && bustBitmap.width > 0) {
      this.contents.blt(bustBitmap, 0, 180, bustBitmap.width, bustBitmap.height - 180, faceX, faceY, faceWidth, faceHeight);
    }
  };

  Window_EquipSelection.prototype.refresh = function () {
    this.contents.clear();
    this.drawAllItems();
    const useTranslation = ConfigManager.language === "it";
    this.changeTextColor(ColorManager.systemColor());
    const titleText = useTranslation ? "Equipaggia a quale personaggio?" : "Equip to which character?";
    this.drawText(titleText, 0, 0, this.width - this.padding * 2, "center");
  };

  Window_EquipSelection.prototype.setHandlers = function (scene) {
    this._scene = scene;
    this.setHandler("ok", this.onSelectionOk.bind(this));
    this.setHandler("cancel", this.onSelectionCancel.bind(this));
  };

  Window_EquipSelection.prototype.onSelectionOk = function () {
    this._scene.onEquipSelectionOk();
  };

  Window_EquipSelection.prototype.onSelectionCancel = function () {
    this._scene.onEquipSelectionCancel();
  };

})();

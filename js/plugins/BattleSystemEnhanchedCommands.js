//=============================================================================
// BattleSystemEnhanchedCommands.js
//=============================================================================

/*:
 * @target MZ
 * @plugindesc v2.0.0 Stylized battle command window with colored gradient bars
 * @author Assistant
 *
 * @help BattleSystemEnhanchedCommands.js
 *
 * Reworked actor command window for battle:
 * - Per-command colored gradient bars (FF7R / Persona 5 inspired)
 * - Left accent stripe with command-type color
 * - Icon + uppercase label layout
 * - Selection highlight without default cursor rectangle
 * - Reload command support (requires WeaponSystem.js)
 *
 * Load order: Must load AFTER WeaponSystem.js
 */

(() => {
  "use strict";

  //=============================================================================
  // Command color palette
  //=============================================================================

  const COMMAND_COLORS = {
    attack: { accent: "#e63232", rgb: [160, 20,  20 ] },
    reload: { accent: "#e68832", rgb: [160, 90,  20 ] },
    skill:  { accent: "#9944ee", rgb: [80,  30,  160] },
    item:   { accent: "#44cc88", rgb: [20,  130, 70 ] },
    guard:  { accent: "#ffdd44", rgb: [130, 110, 20 ] },
  };

  const getCommandColors = (symbol) =>
    COMMAND_COLORS[symbol] || { accent: "#888888", rgb: [60, 60, 60] };

  //=============================================================================
  // Window_ActorCommand - Command List
  //=============================================================================

  Window_ActorCommand.prototype.makeCommandList = function () {
    if (!this._actor) return;

    if (this._actor.isOutOfBullets()) {
      this.addCommandWithIcon("", "reload", true, null, 115);
    } else {
      this.addCommandWithIcon("", "attack", this._actor.canAttack(), null, 97);
    }

    const skillTypes = this._actor.skillTypes();
    for (let i = skillTypes.length - 1; i >= 0; i--) {
      const stypeId = skillTypes[i];
      const iconIndex = stypeId === 2 ? 76 : 79;
      this.addCommandWithIcon("", "skill", true, stypeId, iconIndex);
    }

    this.addCommandWithIcon("", "item",  true,                        null, 209);
    this.addCommandWithIcon("", "guard", this._actor.canGuard(),      null, 52);
  };

  Window_ActorCommand.prototype.addCommandWithIcon = function (name, symbol, enabled, ext, iconIndex) {
    this._list.push({ name, symbol, enabled, ext, iconIndex });
  };

  Window_ActorCommand.prototype.getCommandName = function (symbol, ext) {
    switch (symbol) {
      case "attack": return TextManager.attack;
      case "skill":  return $dataSystem.skillTypes[ext] || "Skill";
      case "guard":  return TextManager.guard;
      case "item":   return TextManager.item;
      case "reload": return "Reload";
      default:       return "";
    }
  };

  //=============================================================================
  // Window_ActorCommand - Layout
  //=============================================================================

  Window_ActorCommand.prototype.itemHeight = function () { return 58; };
  Window_ActorCommand.prototype.numVisibleRows = function () { return 5; };
  Window_ActorCommand.prototype.maxCols = function () { return 1; };
  Window_ActorCommand.prototype.itemWidth = function () {
    return Math.floor((this.innerWidth + this.colSpacing()) / this.maxCols() - this.colSpacing());
  };

  //=============================================================================
  // Window_ActorCommand - Drawing
  //=============================================================================

  Window_ActorCommand.prototype.drawItem = function (index) {
    const rect    = this.itemRect(index);
    const command = this._list[index];
    const isSelected = index === this.index();
    const { accent, rgb } = getCommandColors(command.symbol);

    this.contents.clearRect(rect.x, rect.y, rect.width, rect.height);

    const pad  = 4;
    const bx   = rect.x  + pad;
    const by   = rect.y  + pad;
    const bw   = rect.width  - pad * 2;
    const bh   = rect.height - pad * 2;
    const alpha = isSelected ? 0.85 : 0.45;

    // Gradient background: colored → transparent (left to right)
    const fillColor = `rgba(${rgb[0]},${rgb[1]},${rgb[2]},${alpha})`;
    this.contents.gradientFillRect(bx, by, bw, bh, fillColor, "rgba(0,0,0,0)", false);

    // Left accent stripe
    const stripeW = isSelected ? 5 : 3;
    this.contents.fillRect(bx, by, stripeW, bh, accent);

    // Bottom separator
    const separatorColor = isSelected ? accent : "rgba(255,255,255,0.07)";
    this.contents.fillRect(bx, by + bh - 1, bw, 1, separatorColor);

    // Selected: top highlight line
    if (isSelected) {
      this.contents.fillRect(bx, by, bw, 1, "rgba(255,255,255,0.3)");
    }

    this.changePaintOpacity(command.enabled);

    // Icon
    const iconIndex = command.iconIndex || 0;
    if (iconIndex > 0) {
      const iconX = bx + stripeW + 10;
      const iconY = rect.y + (rect.height - ImageManager.iconHeight) / 2;
      this.drawIcon(iconIndex, iconX, iconY);

      // Label
      const name   = this.getCommandName(command.symbol, command.ext);
      const textX  = iconX + ImageManager.iconWidth + 8;
      const textW  = rect.width - (textX - rect.x) - pad - 4;
      const textY  = rect.y + (rect.height - this.lineHeight()) / 2;

      this.changeTextColor(isSelected ? "#ffffff" : ColorManager.textColor(7));
      this.drawText(name, textX, textY, textW, "left");
    }

    this.resetTextColor();
    this.changePaintOpacity(true);
  };

  // Hide default cursor rectangle — selection is shown via drawItem
  Window_ActorCommand.prototype.refreshCursor = function () {
    this.setCursorRect(0, 0, 0, 0);
  };

  // Redraw on cursor move so selection highlight updates immediately
  const _Window_ActorCommand_select = Window_ActorCommand.prototype.select;
  Window_ActorCommand.prototype.select = function (index) {
    _Window_ActorCommand_select.call(this, index);
    if (this._list && this._list.length > 0) this.refresh();
  };

  //=============================================================================
  // Window_ActorCommand - Initialization
  //=============================================================================

  const _Window_ActorCommand_initialize = Window_ActorCommand.prototype.initialize;
  Window_ActorCommand.prototype.initialize = function (rect) {
    _Window_ActorCommand_initialize.call(this, rect);
    this.opacity = 0;
    this.hideBackgroundDimmer();
  };

  Scene_Battle.prototype.actorCommandWindowRect = function () {
    const cmdWidth  = 220;
    const helpRect  = this.helpWindowRect();
    const rightEdge = Graphics.boxWidth + Math.floor((Graphics.width - Graphics.boxWidth) / 2);
    return new Rectangle(rightEdge - cmdWidth, helpRect.y + helpRect.height, cmdWidth, this.windowAreaHeight());
  };

  //=============================================================================
  // Window_ActorCommand - Unused helpers kept for compatibility
  //=============================================================================

  Window_ActorCommand.prototype.addSkillCommand  = function (stypeId) { this.addCommand("", "skill", true, stypeId, 79); };
  Window_ActorCommand.prototype.addItemCommand   = function ()         { this.addCommand("", "item",  true, 176); };
  Window_ActorCommand.prototype.addGuardCommand  = function ()         { this.addCommand("", "guard", this._actor.canGuard(), 52); };
  Window_ActorCommand.prototype.isWideScreenResolution = function ()   {
    return Math.abs(Graphics.width / Graphics.height - 16 / 9) < 0.1;
  };

  //=============================================================================
  // Scene_Battle - UI Overrides
  //=============================================================================

  Scene_Battle.prototype.createCancelButton = function () {
    // Remove touch back button from battle UI
  };

  //=============================================================================
  // Scene_Battle - Reload Command Handling
  //=============================================================================

  const _Scene_Battle_createActorCommandWindow = Scene_Battle.prototype.createActorCommandWindow;
  Scene_Battle.prototype.createActorCommandWindow = function () {
    _Scene_Battle_createActorCommandWindow.call(this);
    this._actorCommandWindow.setHandler("reload", this.commandReload.bind(this));
  };

  Scene_Battle.prototype.commandReload = function () {
    const actor = BattleManager.actor();
    if (actor) {
      actor.reloadBullets();
      BattleManager.inputtingAction().setGuard();
      this.selectNextCommand();
    }
  };

})();

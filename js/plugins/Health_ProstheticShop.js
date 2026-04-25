/*:
 * @plugindesc [Add-on] Prosthetic shop (Refactored UI - Full Screen Steps)
 * @author Omni-Lex 
 * @help
 * This plugin is an add-on for the Core Limb Damage System.
 *
 * Flow:
 * 1. Party member selection
 * 2. Command menu (Install bodypart / Remove bodypart / Replace bodypart [stub] /
 *    Install implant / Cancel)
 * 3a. [Install bodypart]  → Archetype select → Part list → confirm purchase
 * 3b. [Remove bodypart]   → Actor part list → (if implant) confirm warning
 * 3c. [Install implant]  → Body part grid → Prosthetic list
 *
 * Body part install price  : hpPercent * 1000 gold
 * Body part removal price  : hpPercent * 100  gold
 * Vital parts cannot be removed.
 * Installing a body part grants the abs(statEffect.amount) bonus to that param.
 * Removing a body part reverts that bonus.
 *
 * @command OpenProstheticShop
 * @desc Opens the prosthetic shop.
 *
 */
(function () {
  "use strict";

  var pluginName = "Health_ProstheticShop";
  var parameters = {};
  const {
    BodyParts,
    ProstheticTypes,
    ProstheticCompatibility,
    EnemyArchetypes,
  } = window.ProstheticsData || {};

  // --- Utility constants & functions ---

  const AUTO_ASSIGN_IMPLANTS = [
    "TESTES",       // 0
    "UTERUS",       // 1
    "OVIDUCT",      // 2
    "SPORE_GLAND",  // 3
    "MITOSIS_GLAND",// 4
    "TESTES",       // 5
  ];

  // Maps party index (0/1/2) to the game variable for reproduction type
  function getReproductionVariableId(actor) {
    const idx = $gameParty.members().indexOf(actor);
    return [87, 115, 116][idx] !== undefined ? [87, 115, 116][idx] : 87;
  }

  if (Utils.RPGMAKER_NAME === "MZ") {
    parameters = PluginManager.parameters(pluginName);
  } else {
    parameters = PluginManager.parameters(pluginName);
  }

  if (Utils.RPGMAKER_NAME === "MZ" && !window.Window_StatusBase) {
    throw new Error("Window_StatusBase is required for this plugin in RPG Maker MZ");
  }

  function getParamName(paramId) {
    const en = ["Max HP","Max MP","STR","Hit Rate","INT","COS","DEX","PSI"];
    const it = ["PV Max","PM Max","FOR","Precisione","INT","COS","DES","PSI"];
    return (ConfigManager.language === "it" ? it : en)[paramId] || "Stat";
  }

  function formatPriceInEuros(goldPrice) {
    return (goldPrice / 100).toFixed(2) + "€";
  }

  function getTranslated(dataObject, propertyName) {
    const lang = ConfigManager.language;
    const langKey = `${propertyName}_${lang}`;
    return lang !== "en" && dataObject[langKey] ? dataObject[langKey] : dataObject[propertyName];
  }

  function getTranslatedText(en, it) {
    return ConfigManager.language === "it" ? it : en;
  }

  function initializeBodyParts(actor) {
    if (actor && !actor._bodyParts && BodyParts) {
      actor._bodyParts = {};
      actor._statModifiers = {};
      for (const partKey in BodyParts) {
        const basePart = BodyParts[partKey];
        const hpPercentage = basePart.hp / 100;
        actor._bodyParts[partKey] = {
          name: getTranslated(basePart, "name"),
          maxHp: Math.round(actor.mhp * hpPercentage),
          currentHp: Math.round(actor.mhp * hpPercentage),
          vital: basePart.vital,
          damaged: false,
          equipSlot: basePart.equipSlot || null,
          childParts: basePart.childParts || [],
          multiple: basePart.multiple || false,
          appliedStatEffect: false,
        };
      }
    }
  }

  const getTextColor = function(id) {
    if (this && this.textColor) return this.textColor(id);
    if (Utils.RPGMAKER_NAME === "MZ" && window.ColorManager) return ColorManager.textColor(id);
    return "rgba(255,255,255,1)";
  };

  const getSystemColor = function() {
    if (this && this.systemColor) return this.systemColor();
    if (Utils.RPGMAKER_NAME === "MZ" && window.ColorManager) return ColorManager.systemColor();
    return "rgba(176,224,248,1)";
  };

  // Helper: infer hpPercent for an existing body part
  function inferHpPercent(part, actor) {
    if (part.hpPercent !== undefined) return part.hpPercent;
    if (actor.mhp > 0) return Math.round((part.maxHp / actor.mhp) * 100);
    return 10;
  }

  // Helper: look up statEffect for a part key
  function lookupStatEffect(partKey, part, actor) {
    if (part.statEffect) return part.statEffect;
    if (actor._currentArchetype && EnemyArchetypes) {
      const arch = EnemyArchetypes[actor._currentArchetype];
      if (arch && arch.parts && arch.parts[partKey]) return arch.parts[partKey].statEffect;
    }
    return null;
  }

  // Returns true if the given part should be treated as vital for this actor.
  // LEFT_LUNG / RIGHT_LUNG are only vital when their partner is already damaged.
  const LUNG_PAIRS = { LEFT_LUNG: "RIGHT_LUNG", RIGHT_LUNG: "LEFT_LUNG" };
  function isPartVital(actor, partKey, basePart) {
    if (partKey in LUNG_PAIRS) {
      const partner = actor._bodyParts && actor._bodyParts[LUNG_PAIRS[partKey]];
      // Vital only when the other lung is missing or fully damaged
      return !partner || partner.damaged;
    }
    return !!(basePart && basePart.vital);
  }

  // Compute the effective stat bonus from a statEffect object.
  // HP (param 0) and MP (param 1) are multiplied by 10.
  // All other stats are divided by 3, rounded up.
  function computeStatBonus(statEffect) {
    if (!statEffect) return 0;
    const raw = Math.abs(statEffect.amount);
    if (statEffect.param === 0 || statEffect.param === 1) return raw * 10;
    return Math.ceil(raw / 3);
  }

  // --- END UTILITY ---

  // ===========================================================================
  // Window_PartySelect  (Step 1)
  // ===========================================================================
  function Window_PartySelect() { this.initialize(...arguments); }
  Window_PartySelect.prototype = Object.create(Window_Command.prototype);
  Window_PartySelect.prototype.constructor = Window_PartySelect;

  Window_PartySelect.prototype.initialize = function () {
    const ww = 400;
    const members = $gameParty.members();
    const wh = members.length * 36 + 24;
    const wx = (Graphics.boxWidth  - ww) / 2;
    const wy = (Graphics.boxHeight - wh) / 2;
    if (Utils.RPGMAKER_NAME === "MZ") {
      Window_Command.prototype.initialize.call(this, new Rectangle(wx, wy, ww, wh));
    } else {
      Window_Command.prototype.initialize.call(this, wx, wy, ww, wh);
    }
  };

  Window_PartySelect.prototype.makeCommandList = function () {
    for (const actor of $gameParty.members()) {
      this.addCommand(actor.name(), "selectMember", true, actor);
    }
  };

  Window_PartySelect.prototype.getSelectedActor = function () {
    return this.currentExt();
  };

  // ===========================================================================
  // Window_ShopCommand  (Step 2)
  // ===========================================================================
  function Window_ShopCommand() { this.initialize(...arguments); }
  Window_ShopCommand.prototype = Object.create(Window_Command.prototype);
  Window_ShopCommand.prototype.constructor = Window_ShopCommand;

  Window_ShopCommand.prototype.initialize = function () {
    const ww = 400;
    const wh = 5 * 36 + 24; // 5 commands
    const wx = (Graphics.boxWidth  - ww) / 2;
    const wy = (Graphics.boxHeight - wh) / 2;
    if (Utils.RPGMAKER_NAME === "MZ") {
      Window_Command.prototype.initialize.call(this, new Rectangle(wx, wy, ww, wh));
    } else {
      Window_Command.prototype.initialize.call(this, wx, wy, ww, wh);
    }
  };

  Window_ShopCommand.prototype.makeCommandList = function () {
    this.addCommand(getTranslatedText("Install bodypart",  "Installa parte"),    "installBodypart",  true);
    this.addCommand(getTranslatedText("Remove bodypart",   "Rimuovi parte"),     "removeBodypart",   true);
    this.addCommand(getTranslatedText("Replace bodypart",  "Sostituisci parte"), "replaceBodypart",  true);
    this.addCommand(getTranslatedText("Install implant",   "Installa impianto"), "installImplant",   true);
    this.addCommand(getTranslatedText("Cancel",            "Annulla"),           "cancel",           true);
  };

  // ===========================================================================
  // Window_ArchetypeSelect  (Install bodypart – step A)
  // ===========================================================================
  function Window_ArchetypeSelect() { this.initialize(...arguments); }
  Window_ArchetypeSelect.prototype = Object.create(Window_Command.prototype);
  Window_ArchetypeSelect.prototype.constructor = Window_ArchetypeSelect;

  Window_ArchetypeSelect.prototype.initialize = function () {
    const width  = Graphics.boxWidth;
    const height = Graphics.boxHeight - 120;
    if (Utils.RPGMAKER_NAME === "MZ") {
      Window_Command.prototype.initialize.call(this, new Rectangle(0, 0, width, height));
    } else {
      Window_Command.prototype.initialize.call(this, 0, 0, width, height);
    }
  };

  Window_ArchetypeSelect.prototype.maxCols = function () { return 3; };

  Window_ArchetypeSelect.prototype.makeCommandList = function () {
    if (!EnemyArchetypes) return;
    for (const key of Object.keys(EnemyArchetypes)) {
      const label = key.replace(/([A-Z])/g, " $1").trim();
      this.addCommand(label, "archetype", true, key);
    }
  };

  Window_ArchetypeSelect.prototype.getSelectedKey = function () {
    return this.currentExt();
  };

  // ===========================================================================
  // Window_ArchetypePartList  (Install bodypart – step B)
  // ===========================================================================
  function Window_ArchetypePartList() { this.initialize(...arguments); }

  if (Utils.RPGMAKER_NAME === "MZ") {
    Window_ArchetypePartList.prototype = Object.create(Window_StatusBase.prototype);
  } else {
    Window_ArchetypePartList.prototype = Object.create(Window_Selectable.prototype);
  }
  Window_ArchetypePartList.prototype.constructor = Window_ArchetypePartList;

  Window_ArchetypePartList.prototype.initialize = function () {
    const width  = Graphics.boxWidth;
    const height = Graphics.boxHeight - 120;
    if (Utils.RPGMAKER_NAME === "MZ") {
      Window_StatusBase.prototype.initialize.call(this, new Rectangle(0, 0, width, height));
    } else {
      Window_Selectable.prototype.initialize.call(this, 0, 0, width, height);
    }
    this._actor       = null;
    this._archetypeKey = null;
    this._partList    = [];
    this.refresh();
  };

  Window_ArchetypePartList.prototype.setContext = function (actor, archetypeKey) {
    this._actor        = actor;
    this._archetypeKey = archetypeKey;
    this.refresh();
    this.select(0);
  };

  Window_ArchetypePartList.prototype.maxItems = function () { return this._partList.length; };
  Window_ArchetypePartList.prototype.itemHeight = function () { return this.lineHeight() * 2; };

  Window_ArchetypePartList.prototype.setupPartList = function () {
    this._partList = [];
    if (!this._archetypeKey || !EnemyArchetypes) return;
    const archetype = EnemyArchetypes[this._archetypeKey];
    if (!archetype || !archetype.parts) return;

    for (const partKey of Object.keys(archetype.parts)) {
      const part       = archetype.parts[partKey];

      // Skip vital parts and parts whose key or name contains "Core" or "Body"
      if (part.vital) continue;
      const keyLower  = partKey.toLowerCase();
      const nameLower = (part.name || "").toLowerCase();
      if (keyLower.includes("core") || keyLower.includes("body") ||
          nameLower.includes("core") || nameLower.includes("body") ||
          nameLower.includes("head") || nameLower.includes("head")) continue;

      // Key-based check first, then name-based: hide if the actor already owns
      // any part whose name is contained in this part's name (case-insensitive).
      // e.g. actor has "Right Hand" → hides archetype parts like "Right Hand (Cyber)"
      const partName = (ConfigManager.language === "it" && part.name_it ? part.name_it : part.name).toLowerCase();
      let alreadyOwned = !!(this._actor && this._actor._bodyParts && this._actor._bodyParts[partKey]);
      if (!alreadyOwned && this._actor && this._actor._bodyParts) {
        for (const existingKey in this._actor._bodyParts) {
          const existingName = (this._actor._bodyParts[existingKey].name || "").toLowerCase();
          if (existingName && partName.includes(existingName)) { alreadyOwned = true; break; }
        }
      }
      const cost       = part.hpPercent * 1000 +  Math.abs(part.statEffect.amount) * 10000;
      const statBonus  = computeStatBonus(part.statEffect);

      this._partList.push({
        isArchetypePart: true,
        partKey,
        archetypeKey: this._archetypeKey,
        name:        ConfigManager.language === "it" && part.name_it ? part.name_it : part.name,
        hpPercent:   part.hpPercent,
        vital:       part.vital,
        statEffect:  part.statEffect || null,
        statBonus,
        skillId:     part.skillId || 0,
        cost,
        alreadyOwned,
        archPart:    part,   // keep full archetype part data for installation
      });
    }
  };

  Window_ArchetypePartList.prototype.drawItem = function (index) {
    const item = this._partList[index];
    if (!item) return;

    const rect  = this.itemRect(index);
    const x     = rect.x + 4;
    const width = rect.width - 8;
    this.contents.clearRect(rect.x, rect.y, rect.width, rect.height);

    if (item.alreadyOwned) {
      this.contents.paintOpacity = 96;
      this.changeTextColor(getTextColor.call(this, 7));
    } else {
      this.contents.paintOpacity = 255;
      this.resetTextColor();
    }

    // Name
    this.drawText(item.name, x, rect.y, width - 160);

    // Price or OWNED badge
    if (item.alreadyOwned) {
      this.changeTextColor(getTextColor.call(this, 3));
      this.drawText(getTranslatedText("OWNED", "POSSEDUTA"), x + width - 160, rect.y, 160, "right");
    } else {
      this.resetTextColor();
      this.drawText(formatPriceInEuros(item.cost), x + width - 160, rect.y, 160, "right");
    }

    // Second line: stat bonus + skill name
    const y2 = rect.y + this.lineHeight();
    if (item.statEffect && item.statBonus > 0) {
      const paramName = getParamName(item.statEffect.param);
      const skillText = (item.skillId && item.skillId !== 0 && $dataSkills && $dataSkills[item.skillId])
        ? "  ★ " + $dataSkills[item.skillId].name : "";
      this.changeTextColor(getTextColor.call(this, 3));
      this.drawText(`${paramName} +${item.statBonus}${skillText}`, x, y2, width);
    } else if (item.skillId && item.skillId !== 0 && $dataSkills && $dataSkills[item.skillId]) {
      this.changeTextColor(getTextColor.call(this, 6));
      this.drawText("★ " + $dataSkills[item.skillId].name, x, y2, width);
    }

    this.contents.paintOpacity = 255;
    this.resetTextColor();
  };

  Window_ArchetypePartList.prototype.refresh = function () {
    this.contents.clear();
    this.setupPartList();
    this.drawAllItems();
  };

  Window_ArchetypePartList.prototype.isOkEnabled = function () {
    const item = this._partList[this.index()];
    return !!(item && !item.alreadyOwned);
  };

  Window_ArchetypePartList.prototype.processOk = function () {
    if (!this.isOkEnabled()) { SoundManager.playBuzzer(); return; }
    this.callHandler("ok");
  };

  Window_ArchetypePartList.prototype.getCurrentSelection = function () {
    return this._partList[this.index()];
  };

  // ===========================================================================
  // Window_RemovePartList  (Remove bodypart)
  // ===========================================================================
  function Window_RemovePartList() { this.initialize(...arguments); }

  if (Utils.RPGMAKER_NAME === "MZ") {
    Window_RemovePartList.prototype = Object.create(Window_StatusBase.prototype);
  } else {
    Window_RemovePartList.prototype = Object.create(Window_Selectable.prototype);
  }
  Window_RemovePartList.prototype.constructor = Window_RemovePartList;

  Window_RemovePartList.prototype.initialize = function () {
    const width  = Graphics.boxWidth;
    const height = Graphics.boxHeight - 120;
    if (Utils.RPGMAKER_NAME === "MZ") {
      Window_StatusBase.prototype.initialize.call(this, new Rectangle(0, 0, width, height));
    } else {
      Window_Selectable.prototype.initialize.call(this, 0, 0, width, height);
    }
    this._actor    = null;
    this._partList = [];
    this.refresh();
  };

  Window_RemovePartList.prototype.setActor = function (actor) {
    this._actor = actor;
    this.refresh();
    this.select(0);
  };

  Window_RemovePartList.prototype.maxItems = function () { return this._partList.length; };
  Window_RemovePartList.prototype.itemHeight = function () { return this.lineHeight() * 2; };

  Window_RemovePartList.prototype.setupPartList = function () {
    this._partList = [];
    if (!this._actor || !this._actor._bodyParts) return;

    for (const partKey of Object.keys(this._actor._bodyParts)) {
      const part       = this._actor._bodyParts[partKey];
      const hasImplant = !!(this._actor._prosthetics && this._actor._prosthetics[partKey]);
      const hpPercent  = inferHpPercent(part, this._actor);
      const cost       = hpPercent * 100;
      const statEffect = lookupStatEffect(partKey, part, this._actor);
      const statBonus  = computeStatBonus(statEffect);

      this._partList.push({
        isRemoveBodypart: true,
        partKey,
        name:       part.name || partKey,
        vital:      isPartVital(this._actor, partKey, part),
        hasImplant,
        hpPercent,
        cost,
        statEffect,
        statBonus,
        skillId:    part.skillId || 0,
      });
    }
  };

  Window_RemovePartList.prototype.drawItem = function (index) {
    const item = this._partList[index];
    if (!item) return;

    const rect  = this.itemRect(index);
    const x     = rect.x + 4;
    const width = rect.width - 8;
    this.contents.clearRect(rect.x, rect.y, rect.width, rect.height);

    if (item.vital) {
      this.contents.paintOpacity = 96;
      this.changeTextColor(getTextColor.call(this, 7));
    } else {
      this.contents.paintOpacity = 255;
      this.resetTextColor();
    }

    // Name  (* = has implant)
    const nameText = item.name + (item.hasImplant ? " *" : "");
    this.drawText(nameText, x, rect.y, width - 160);

    // VITAL badge or removal price
    if (item.vital) {
      this.changeTextColor(getTextColor.call(this, 18));
      this.drawText(getTranslatedText("VITAL", "VITALE"), x + width - 160, rect.y, 160, "right");
    } else {
      this.resetTextColor();
      this.drawText(formatPriceInEuros(item.cost), x + width - 160, rect.y, 160, "right");
    }

    // Second line: stat loss + skill name
    const y2 = rect.y + this.lineHeight();
    const skillText = (item.skillId && item.skillId !== 0 && $dataSkills && $dataSkills[item.skillId])
      ? "  ★ " + $dataSkills[item.skillId].name : "";
    if (item.statEffect && item.statBonus > 0) {
      const paramName = getParamName(item.statEffect.param);
      this.changeTextColor(getTextColor.call(this, 7));
      this.drawText(
        getTranslatedText(`Loses ${paramName} +${item.statBonus}`, `Perdi ${paramName} +${item.statBonus}`) + skillText,
        x, y2, width
      );
    } else if (skillText) {
      this.changeTextColor(getTextColor.call(this, 7));
      this.drawText("★ " + $dataSkills[item.skillId].name, x, y2, width);
    }

    this.contents.paintOpacity = 255;
    this.resetTextColor();
  };

  Window_RemovePartList.prototype.refresh = function () {
    this.contents.clear();
    this.setupPartList();
    this.drawAllItems();
  };

  Window_RemovePartList.prototype.isOkEnabled = function () {
    const item = this._partList[this.index()];
    return !!(item && !item.vital);
  };

  Window_RemovePartList.prototype.processOk = function () {
    if (!this.isOkEnabled()) { SoundManager.playBuzzer(); return; }
    this.callHandler("ok");
  };

  Window_RemovePartList.prototype.getCurrentSelection = function () {
    return this._partList[this.index()];
  };

  // ===========================================================================
  // Window_ConfirmRemove  (Yes/No when implant would be lost)
  // ===========================================================================
  function Window_ConfirmRemove() { this.initialize(...arguments); }
  Window_ConfirmRemove.prototype = Object.create(Window_Command.prototype);
  Window_ConfirmRemove.prototype.constructor = Window_ConfirmRemove;

  Window_ConfirmRemove.prototype.initialize = function () {
    const ww = Math.min(520, Math.floor(Graphics.boxWidth * 0.75));
    const wh = 3 * 36 + 24; // warning line + 2 choices
    const wx = (Graphics.boxWidth  - ww) / 2;
    const wy = (Graphics.boxHeight - wh) / 2;
    if (Utils.RPGMAKER_NAME === "MZ") {
      Window_Command.prototype.initialize.call(this, new Rectangle(wx, wy, ww, wh));
    } else {
      Window_Command.prototype.initialize.call(this, wx, wy, ww, wh);
    }
  };

  Window_ConfirmRemove.prototype.makeCommandList = function () {
    this.addCommand(getTranslatedText("Yes, remove it", "Sì, rimuovi"), "confirm", true);
    this.addCommand(getTranslatedText("Cancel",         "Annulla"),     "cancel",  true);
  };

  // Push items down one line to leave room for the warning text
  Window_ConfirmRemove.prototype.itemRect = function (index) {
    const rect = Window_Command.prototype.itemRect.call(this, index);
    rect.y += this.lineHeight();
    return rect;
  };

  Window_ConfirmRemove.prototype.drawAllItems = function () {
    this.changeTextColor(getTextColor.call(this, 17)); // orange/yellow
    this.drawText(
      getTranslatedText("Warning: implant will be lost!", "Attenzione: l'impianto andrà perso!"),
      0, 0, this.contents.width, "center"
    );
    this.resetTextColor();
    Window_Command.prototype.drawAllItems.call(this);
  };

  // ===========================================================================
  // Window_ReplacePartList  (Replace bodypart – step A: pick part to replace)
  // ===========================================================================
  function Window_ReplacePartList() { this.initialize(...arguments); }

  if (Utils.RPGMAKER_NAME === "MZ") {
    Window_ReplacePartList.prototype = Object.create(Window_StatusBase.prototype);
  } else {
    Window_ReplacePartList.prototype = Object.create(Window_Selectable.prototype);
  }
  Window_ReplacePartList.prototype.constructor = Window_ReplacePartList;

  Window_ReplacePartList.prototype.initialize = function () {
    const width  = Graphics.boxWidth;
    const height = Graphics.boxHeight - 120;
    if (Utils.RPGMAKER_NAME === "MZ") {
      Window_StatusBase.prototype.initialize.call(this, new Rectangle(0, 0, width, height));
    } else {
      Window_Selectable.prototype.initialize.call(this, 0, 0, width, height);
    }
    this._actor    = null;
    this._partList = [];
    this.refresh();
  };

  Window_ReplacePartList.prototype.setActor = function (actor) {
    this._actor = actor;
    this.refresh();
    this.select(0);
  };

  Window_ReplacePartList.prototype.maxItems  = function () { return this._partList.length; };
  Window_ReplacePartList.prototype.itemHeight = function () { return this.lineHeight() * 2; };

  Window_ReplacePartList.prototype.setupPartList = function () {
    this._partList = [];
    if (!this._actor || !this._actor._bodyParts) return;

    for (const partKey of Object.keys(this._actor._bodyParts)) {
      const part       = this._actor._bodyParts[partKey];
      const hpPercent  = inferHpPercent(part, this._actor);
      const removalFee = hpPercent * 100;
      const statEffect = lookupStatEffect(partKey, part, this._actor);
      const statBonus  = computeStatBonus(statEffect);

      // Only show parts that have at least one replacement option in any archetype
      let hasReplacement = false;
      if (EnemyArchetypes) {
        for (const archKey of Object.keys(EnemyArchetypes)) {
          const arch = EnemyArchetypes[archKey];
          if (arch && arch.parts && arch.parts[partKey]) { hasReplacement = true; break; }
        }
      }
      if (!hasReplacement) continue;

      this._partList.push({
        isReplaceSelectPart: true,
        partKey,
        name:       part.name || partKey,
        vital:      part.vital,
        hpPercent,
        removalFee,
        statEffect,
        statBonus,
      });
    }
  };

  Window_ReplacePartList.prototype.drawItem = function (index) {
    const item = this._partList[index];
    if (!item) return;

    const rect  = this.itemRect(index);
    const x     = rect.x + 4;
    const width = rect.width - 8;
    this.contents.clearRect(rect.x, rect.y, rect.width, rect.height);
    this.resetTextColor();

    this.drawText(item.name, x, rect.y, width - 160);

    // Show removal fee on the right
    this.changeTextColor(getTextColor.call(this, 17));
    this.drawText(
      getTranslatedText("Removal: ", "Rim: ") + formatPriceInEuros(item.removalFee),
      x + width - 160, rect.y, 160, "right"
    );

    // Second line: vital badge or stat loss
    if (item.vital) {
      this.changeTextColor(getTextColor.call(this, 18));
      this.drawText(getTranslatedText("VITAL", "VITALE"), x, rect.y + this.lineHeight(), width);
    } else if (item.statEffect && item.statBonus > 0) {
      const paramName = getParamName(item.statEffect.param);
      this.changeTextColor(getTextColor.call(this, 7));
      this.drawText(
        getTranslatedText(`Loses ${paramName} +${item.statBonus}`, `Perdi ${paramName} +${item.statBonus}`),
        x, rect.y + this.lineHeight(), width
      );
    }

    this.resetTextColor();
    this.contents.paintOpacity = 255;
  };

  Window_ReplacePartList.prototype.refresh = function () {
    this.contents.clear();
    this.setupPartList();
    this.drawAllItems();
  };

  Window_ReplacePartList.prototype.isOkEnabled = function () {
    return !!(this._partList[this.index()]);
  };

  Window_ReplacePartList.prototype.getCurrentSelection = function () {
    return this._partList[this.index()];
  };

  // ===========================================================================
  // Window_ReplaceArchetypePartList  (Replace bodypart – step B: pick replacement)
  // ===========================================================================
  function Window_ReplaceArchetypePartList() { this.initialize(...arguments); }

  if (Utils.RPGMAKER_NAME === "MZ") {
    Window_ReplaceArchetypePartList.prototype = Object.create(Window_StatusBase.prototype);
  } else {
    Window_ReplaceArchetypePartList.prototype = Object.create(Window_Selectable.prototype);
  }
  Window_ReplaceArchetypePartList.prototype.constructor = Window_ReplaceArchetypePartList;

  Window_ReplaceArchetypePartList.prototype.initialize = function () {
    const width  = Graphics.boxWidth;
    const height = Graphics.boxHeight - 120;
    if (Utils.RPGMAKER_NAME === "MZ") {
      Window_StatusBase.prototype.initialize.call(this, new Rectangle(0, 0, width, height));
    } else {
      Window_Selectable.prototype.initialize.call(this, 0, 0, width, height);
    }
    this._actor      = null;
    this._partKey    = null;
    this._removalFee = 0;
    this._partList   = [];
    this.refresh();
  };

  Window_ReplaceArchetypePartList.prototype.setContext = function (actor, partKey, removalFee) {
    this._actor      = actor;
    this._partKey    = partKey;
    this._removalFee = removalFee || 0;
    this.refresh();
    this.select(0);
  };

  Window_ReplaceArchetypePartList.prototype.maxItems  = function () { return this._partList.length; };
  Window_ReplaceArchetypePartList.prototype.itemHeight = function () { return this.lineHeight() * 2; };

  Window_ReplaceArchetypePartList.prototype.setupPartList = function () {
    this._partList = [];
    if (!this._partKey || !EnemyArchetypes) return;

    for (const archKey of Object.keys(EnemyArchetypes)) {
      const archetype = EnemyArchetypes[archKey];
      if (!archetype || !archetype.parts) continue;
      const part = archetype.parts[this._partKey];
      if (!part) continue;

      const installCost = part.hpPercent * 1000 + Math.abs((part.statEffect && part.statEffect.amount) || 0) * 10000;
      const totalCost   = installCost + this._removalFee;
      const statBonus   = computeStatBonus(part.statEffect);
      const partName    = ConfigManager.language === "it" && part.name_it ? part.name_it : part.name;
      const archLabel   = archKey.replace(/([A-Z])/g, " $1").trim();

      this._partList.push({
        isReplacePart: true,
        partKey:      this._partKey,
        archetypeKey: archKey,
        archetypeLabel: archLabel,
        name:         partName,
        hpPercent:    part.hpPercent,
        vital:        part.vital,
        statEffect:   part.statEffect || null,
        statBonus,
        skillId:      part.skillId || 0,
        installCost,
        removalFee:   this._removalFee,
        cost:         totalCost,
        archPart:     part,
      });
    }
  };

  Window_ReplaceArchetypePartList.prototype.drawItem = function (index) {
    const item = this._partList[index];
    if (!item) return;

    const rect  = this.itemRect(index);
    const x     = rect.x + 4;
    const width = rect.width - 8;
    this.contents.clearRect(rect.x, rect.y, rect.width, rect.height);
    this.resetTextColor();

    // Name + archetype source
    this.drawText(item.name, x, rect.y, width - 200);
    this.changeTextColor(getTextColor.call(this, 6));
    this.drawText("[" + item.archetypeLabel + "]", x + width - 380, rect.y, 180, "right");

    // Total cost
    this.resetTextColor();
    this.drawText(formatPriceInEuros(item.cost), x + width - 160, rect.y, 160, "right");

    // Second line: stat bonus + skill name
    const y2 = rect.y + this.lineHeight();
    if (item.statEffect && item.statBonus > 0) {
      const paramName = getParamName(item.statEffect.param);
      const skillText = (item.skillId && item.skillId !== 0 && $dataSkills && $dataSkills[item.skillId])
        ? "  ★ " + $dataSkills[item.skillId].name : "";
      this.changeTextColor(getTextColor.call(this, 3));
      this.drawText(`${paramName} +${item.statBonus}${skillText}`, x, y2, width);
    } else if (item.skillId && item.skillId !== 0 && $dataSkills && $dataSkills[item.skillId]) {
      this.changeTextColor(getTextColor.call(this, 6));
      this.drawText("★ " + $dataSkills[item.skillId].name, x, y2, width);
    }

    this.resetTextColor();
    this.contents.paintOpacity = 255;
  };

  Window_ReplaceArchetypePartList.prototype.refresh = function () {
    this.contents.clear();
    this.setupPartList();
    this.drawAllItems();
  };

  Window_ReplaceArchetypePartList.prototype.isOkEnabled = function () {
    return !!(this._partList[this.index()]);
  };

  Window_ReplaceArchetypePartList.prototype.getCurrentSelection = function () {
    return this._partList[this.index()];
  };

  // ===========================================================================
  // Window_BodyPartSelect  (Install implant – step A)
  // ===========================================================================
  function Window_BodyPartSelect() { this.initialize(...arguments); }

  if (Utils.RPGMAKER_NAME === "MZ") {
    Window_BodyPartSelect.prototype = Object.create(Window_StatusBase.prototype);
  } else {
    Window_BodyPartSelect.prototype = Object.create(Window_Selectable.prototype);
  }
  Window_BodyPartSelect.prototype.constructor = Window_BodyPartSelect;

  Window_BodyPartSelect.prototype.initialize = function () {
    const width  = Graphics.boxWidth;
    const height = Graphics.boxHeight - 120;
    if (Utils.RPGMAKER_NAME === "MZ") {
      Window_StatusBase.prototype.initialize.call(this, new Rectangle(0, 0, width, height));
    } else {
      Window_Selectable.prototype.initialize.call(this, 0, 0, width, height);
    }
    this._actor       = null;
    this._bodyPartKeys = [];
    this.refresh();
    this.activate();
    this.select(0);
  };

  Window_BodyPartSelect.prototype.setActor = function (actor) {
    this._actor = actor;
    this.refresh();
    this.select(0);
  };

  Window_BodyPartSelect.prototype.colSpacing  = function () { return 12; };
  Window_BodyPartSelect.prototype.maxCols     = function () { return 2; };
  Window_BodyPartSelect.prototype.maxItems    = function () { return this._bodyPartKeys.length; };
  Window_BodyPartSelect.prototype.itemHeight  = function () { return this.lineHeight() * 2; };

  Window_BodyPartSelect.prototype.setupBodyParts = function () {
    if (!this._actor) { this._bodyPartKeys = []; return; }
    if (!this._actor._bodyParts) initializeBodyParts(this._actor);
    this._bodyPartKeys = [];
    for (var partKey in ProstheticCompatibility) {
      if (this._actor._bodyParts[partKey]) this._bodyPartKeys.push(partKey);
    }
  };

  Window_BodyPartSelect.prototype.drawItem = function (index) {
    const partKey = this._bodyPartKeys[index];
    if (!partKey || !this._actor) return;

    const rect = this.itemRect(index);
    const part = this._actor._bodyParts[partKey];
    const currentProstheticKey = this._actor._prosthetics ? this._actor._prosthetics[partKey] : null;

    this.contents.clearRect(rect.x, rect.y, rect.width, rect.height);
    this.resetTextColor();

    this.changeTextColor(getSystemColor.call(this));
    this.drawText(part.name, rect.x, rect.y, rect.width);
    this.resetTextColor();

    let statusText = getTranslatedText("Original", "Originale");
    if (currentProstheticKey && ProstheticTypes[currentProstheticKey]) {
      const prosthetic = ProstheticTypes[currentProstheticKey];
      statusText = ConfigManager.language === "it" ? prosthetic.name_it : prosthetic.name_en;
      this.changeTextColor(getTextColor.call(this, 3));
    } else {
      this.changeTextColor(getTextColor.call(this, 0));
    }
    this.drawText(statusText, rect.x, rect.y + this.lineHeight(), rect.width);
    this.resetTextColor();
  };

  Window_BodyPartSelect.prototype.refresh = function () {
    this.contents.clear();
    this.setupBodyParts();
    this.drawAllItems();
  };

  Window_BodyPartSelect.prototype.getPartKey = function () {
    return this._bodyPartKeys[this.index()];
  };

  // ===========================================================================
  // Window_ProstheticList  (Install implant – step B)
  // ===========================================================================
  function Window_ProstheticList() { this.initialize(...arguments); }

  if (Utils.RPGMAKER_NAME === "MZ") {
    Window_ProstheticList.prototype = Object.create(Window_StatusBase.prototype);
  } else {
    Window_ProstheticList.prototype = Object.create(Window_Selectable.prototype);
  }
  Window_ProstheticList.prototype.constructor = Window_ProstheticList;

  Window_ProstheticList.prototype.initialize = function () {
    const width  = Graphics.boxWidth;
    const height = Graphics.boxHeight - 120;
    if (Utils.RPGMAKER_NAME === "MZ") {
      Window_StatusBase.prototype.initialize.call(this, new Rectangle(0, 0, width, height));
    } else {
      Window_Selectable.prototype.initialize.call(this, 0, 0, width, height);
    }
    this._actor          = null;
    this._partKey        = null;
    this._prostheticList = [];
    this._selectedProsthetics = {};
    this.refresh();
  };

  Window_ProstheticList.prototype.setActor = function (actor) {
    this._actor = actor;
    this.refresh();
  };

  Window_ProstheticList.prototype.setPartKey = function (partKey) {
    if (this._partKey !== partKey) {
      this._partKey = partKey;
      this.refresh();
      this.select(0);
    }
  };

  Window_ProstheticList.prototype.maxItems   = function () { return this._prostheticList.length; };
  Window_ProstheticList.prototype.itemHeight = function () { return this.lineHeight() * 2; };

  Window_ProstheticList.prototype.setupProstheticList = function () {
    this._prostheticList = [];
    if (!this._partKey || !this._actor) return;

    const currentProstheticKey = this._actor._prosthetics ? this._actor._prosthetics[this._partKey] : null;

    this._prostheticList.push({
      isRemoveOption: true,
      name: getTranslatedText("[Remove Current Prosthetic]", "[Rimuovi Protesi Attuale]"),
      canRemove: !!currentProstheticKey,
      currentProsthetic: currentProstheticKey,
    });

    const compatibleProsthetics = ProstheticCompatibility[this._partKey] || [];
    for (var i = 0; i < compatibleProsthetics.length; i++) {
      const prostheticKey = compatibleProsthetics[i];
      const prosthetic    = ProstheticTypes[prostheticKey];
      if (!prosthetic) continue;
      this._prostheticList.push({
        isProsthetic: true,
        partKey: this._partKey,
        prostheticKey,
        prosthetic,
        name: ConfigManager.language === "it" ? prosthetic.name_it : prosthetic.name_en,
        cost: prosthetic.cost,
        isCurrentlyInstalled: currentProstheticKey === prostheticKey,
      });
    }
  };

  Window_ProstheticList.prototype.drawItem = function (index) {
    const item = this._prostheticList[index];
    if (!item) return;

    const rect = this.itemRect(index);
    this.contents.clearRect(rect.x, rect.y, rect.width, rect.height);

    if (item.isRemoveOption) {
      this.changeTextColor(item.canRemove ? getTextColor.call(this, 17) : getTextColor.call(this, 7));
      this.drawText(item.name, rect.x, rect.y, rect.width, "center");
      if (item.currentProsthetic) {
        const pData = ProstheticTypes[item.currentProsthetic];
        const curName = pData ? (ConfigManager.language === "it" ? pData.name_it : pData.name_en) : "Unknown";
        this.changeTextColor(getTextColor.call(this, 0));
        this.drawText(getTranslatedText("Current: ", "Attuale: ") + curName, rect.x, rect.y + this.lineHeight(), rect.width, "center");
      } else {
        this.changeTextColor(getTextColor.call(this, 7));
        this.drawText(getTranslatedText("(Original Part)", "(Parte Originale)"), rect.x, rect.y + this.lineHeight(), rect.width, "center");
      }
    } else if (item.isProsthetic) {
      const x     = rect.x + 12;
      const width = rect.width - 24;
      if (item.isCurrentlyInstalled) {
        this.contents.paintOpacity = 96;
        this.changeTextColor(getTextColor.call(this, 7));
      } else {
        this.contents.paintOpacity = 255;
        this.resetTextColor();
      }

      this.drawText(item.name, x, rect.y, width - 100);

      if (item.isCurrentlyInstalled) {
        this.drawText("---", x + width - 100, rect.y, 100, "right");
        this.changeTextColor(getTextColor.call(this, 3));
        this.drawText(getTranslatedText("INSTALLED", "INSTALLATO"), x + width - 200, rect.y, 100, "right");
      } else {
        this.drawText(formatPriceInEuros(item.cost), x + width - 100, rect.y, 100, "right");
      }

      if (item.prosthetic.effects) {
        let effectText = "";
        for (const paramId in item.prosthetic.effects) {
          effectText += getParamName(parseInt(paramId)) + " +" + item.prosthetic.effects[paramId] + " ";
        }
        this.drawText(effectText, x, rect.y + this.lineHeight(), width);
      }

      this.contents.paintOpacity = 255;
      this.resetTextColor();
    }
  };

  Window_ProstheticList.prototype.refresh = function () {
    this.contents.clear();
    this.setupProstheticList();
    this.drawAllItems();
  };

  Window_ProstheticList.prototype.isOkEnabled = function () {
    const item = this._prostheticList[this.index()];
    if (!item) return false;
    if (item.isRemoveOption) return item.canRemove;
    if (item.isProsthetic)   return !item.isCurrentlyInstalled;
    return false;
  };

  Window_ProstheticList.prototype.processOk = function () {
    if (!this._prostheticList[this.index()]) return;
    this.callHandler("ok");
  };

  Window_ProstheticList.prototype.installProstheticImmediate = function (actor, partKey, prostheticKey) {
    const prosthetic = ProstheticTypes[prostheticKey];
    if (!prosthetic) return;

    if (!actor._prosthetics)       actor._prosthetics      = {};
    if (!actor._prostheticEffects) actor._prostheticEffects = {};

    this.removeProstheticImmediate(actor, partKey);
    actor._prosthetics[partKey] = prostheticKey;

    if (prosthetic.effects) {
      for (const paramId in prosthetic.effects) {
        if (!actor._prostheticEffects[paramId]) actor._prostheticEffects[paramId] = 0;
        actor._prostheticEffects[paramId] += prosthetic.effects[paramId];
      }
    }

    if (prosthetic.skill) actor.learnSkill(prosthetic.skill);

    const reproVarId = getReproductionVariableId(actor);
    if      (prostheticKey === "UTERUS")       $gameVariables.setValue(reproVarId, 1);
    else if (prostheticKey === "OVIDUCT")      $gameVariables.setValue(reproVarId, 2);
    else if (prostheticKey === "SPORE_GLAND")  $gameVariables.setValue(reproVarId, 3);
    else if (prostheticKey === "MITOSIS_GLAND")$gameVariables.setValue(reproVarId, 4);
    else if (prostheticKey === "TESTES")       $gameVariables.setValue(reproVarId, 0);

    actor.refresh();
  };

  Window_ProstheticList.prototype.removeProstheticImmediate = function (actor, partKey) {
    const currentProstheticKey = actor._prosthetics ? actor._prosthetics[partKey] : null;
    if (!currentProstheticKey) return;
    const prosthetic = ProstheticTypes[currentProstheticKey];
    if (!prosthetic) return;

    if (prosthetic.effects) {
      for (const paramId in prosthetic.effects) {
        if (actor._prostheticEffects && actor._prostheticEffects[paramId]) {
          actor._prostheticEffects[paramId] -= prosthetic.effects[paramId];
          if (actor._prostheticEffects[paramId] === 0) delete actor._prostheticEffects[paramId];
        }
      }
    }

    if (prosthetic.skill) actor.forgetSkill(prosthetic.skill);

    const reproVarId = getReproductionVariableId(actor);
    if (["UTERUS","OVIDUCT","SPORE_GLAND","MITOSIS_GLAND"].includes(currentProstheticKey)) {
      $gameVariables.setValue(reproVarId, 0);
    }

    delete actor._prosthetics[partKey];
    actor.refresh();
  };

  Window_ProstheticList.prototype.getCurrentSelection = function () {
    return this._prostheticList[this.index()];
  };

  // ===========================================================================
  // Window_ProstheticCost  (bottom info bar – shared by all flows)
  // ===========================================================================
  function Window_ProstheticCost() { this.initialize(...arguments); }
  Window_ProstheticCost.prototype = Object.create(Window_Base.prototype);
  Window_ProstheticCost.prototype.constructor = Window_ProstheticCost;

  Window_ProstheticCost.prototype.initialize = function () {
    const height = 120;
    if (Utils.RPGMAKER_NAME === "MZ") {
      Window_Base.prototype.initialize.call(this, new Rectangle(0, Graphics.boxHeight - height, Graphics.boxWidth, height));
    } else {
      Window_Base.prototype.initialize.call(this, 0, Graphics.boxHeight - height, Graphics.boxWidth, height);
    }
    this._totalCost = 0;
    this._selection = null;
    this.refresh();
  };

  Window_ProstheticCost.prototype.setSelection = function (item) {
    this._selection = item;
    this._totalCost = (item && item.cost) ? item.cost : 0;
    this.refresh();
  };

  Window_ProstheticCost.prototype.refresh = function () {
    this.contents.clear();
    const sel = this._selection;
    const w   = this.contents.width - 12;

    // Line 1: cost
    if (sel && sel.isProsthetic && !sel.isCurrentlyInstalled) {
      this.drawText(getTranslatedText("Cost: ", "Costo: ") + formatPriceInEuros(this._totalCost), 6, 0, w);
    } else if (sel && sel.isRemoveOption && sel.canRemove) {
      this.drawText(getTranslatedText("Removal: FREE", "Rimozione: GRATIS"), 6, 0, w);
    } else if (sel && sel.isArchetypePart && !sel.alreadyOwned) {
      this.drawText(getTranslatedText("Cost: ", "Costo: ") + formatPriceInEuros(this._totalCost), 6, 0, w);
    } else if (sel && sel.isRemoveBodypart && !sel.vital) {
      this.drawText(getTranslatedText("Removal: ", "Rimozione: ") + formatPriceInEuros(this._totalCost), 6, 0, w);
    } else if (sel && sel.isReplaceSelectPart) {
      this.drawText(
        getTranslatedText("Removal fee: ", "Costo rimozione: ") + formatPriceInEuros(sel.removalFee),
        6, 0, w
      );
    } else if (sel && sel.isReplacePart) {
      this.drawText(
        getTranslatedText("Total: ", "Totale: ") + formatPriceInEuros(sel.cost) +
        "  (" + getTranslatedText("Install: ", "Inst: ") + formatPriceInEuros(sel.installCost) +
        " + " + getTranslatedText("Removal: ", "Rim: ") + formatPriceInEuros(sel.removalFee) + ")",
        6, 0, w
      );
    } else {
      this.drawText(getTranslatedText("Cost: ---", "Costo: ---"), 6, 0, w);
    }

    // Line 2: current money
    this.drawText(
      getTranslatedText("Current Money: ", "Denaro Attuale: ") + formatPriceInEuros($gameParty.gold()),
      6, this.lineHeight(), w
    );
    this.resetTextColor();
  };

  Window_ProstheticCost.prototype.canAfford = function () {
    return $gameParty.gold() >= this._totalCost && this._totalCost > 0;
  };

  // ===========================================================================
  // Scene_ProstheticShop
  // ===========================================================================
  function Scene_ProstheticShop() { this.initialize(...arguments); }
  Scene_ProstheticShop.prototype = Object.create(Scene_MenuBase.prototype);
  Scene_ProstheticShop.prototype.constructor = Scene_ProstheticShop;

  Scene_ProstheticShop.prototype.initialize = function () {
    Scene_MenuBase.prototype.initialize.call(this);
    this._selectedActor   = null;
    this._selectedPartKey = null;
  };

  Scene_ProstheticShop.prototype.create = function () {
    Scene_MenuBase.prototype.create.call(this);
    this.createPartyWindow();
    this.createCommandWindow();
    // Install bodypart windows
    this.createArchetypeSelectWindow();
    this.createArchetypePartListWindow();
    // Remove bodypart windows
    this.createRemovePartListWindow();
    this.createConfirmRemoveWindow();
    // Replace bodypart windows
    this.createReplacePartListWindow();
    this.createReplaceArchetypePartListWindow();
    // Install implant windows
    this.createBodyPartSelectWindow();
    this.createProstheticListWindow();
    // Shared cost bar
    this.createCostWindow();
    this._costWindow.hide();
  };

  // ---- Step 1: Party ----

  Scene_ProstheticShop.prototype.createPartyWindow = function () {
    this._partyWindow = new Window_PartySelect();
    this._partyWindow.setHandler("selectMember", this.onPartySelect.bind(this));
    this._partyWindow.setHandler("cancel",        this.popScene.bind(this));
    this.addWindow(this._partyWindow);
  };

  Scene_ProstheticShop.prototype.onPartySelect = function () {
    this._selectedActor = this._partyWindow.getSelectedActor();
    this._partyWindow.deactivate();
    this._partyWindow.hide();
    this._commandWindow.refresh();
    this._commandWindow.show();
    this._commandWindow.activate();
    this._commandWindow.select(0);
  };

  // ---- Step 2: Command ----

  Scene_ProstheticShop.prototype.createCommandWindow = function () {
    this._commandWindow = new Window_ShopCommand();
    this._commandWindow.setHandler("installBodypart",  this.onCmdInstallBodypart.bind(this));
    this._commandWindow.setHandler("removeBodypart",   this.onCmdRemoveBodypart.bind(this));
    this._commandWindow.setHandler("replaceBodypart",  this.onCmdReplaceBodypart.bind(this));
    this._commandWindow.setHandler("installImplant",   this.onCmdInstallImplant.bind(this));
    this._commandWindow.setHandler("cancel",           this.onCmdCancel.bind(this));
    this._commandWindow.hide();
    this._commandWindow.deactivate();
    this.addWindow(this._commandWindow);
  };

  Scene_ProstheticShop.prototype.onCmdInstallBodypart = function () {
    this._commandWindow.hide();
    this._commandWindow.deactivate();
    this._archetypeSelectWindow.refresh();
    this._archetypeSelectWindow.show();
    this._archetypeSelectWindow.activate();
    this._archetypeSelectWindow.select(0);
    this._costWindow.setSelection(null);
    this._costWindow.show();
  };

  Scene_ProstheticShop.prototype.onCmdRemoveBodypart = function () {
    this._commandWindow.hide();
    this._commandWindow.deactivate();
    this._removePartListWindow.setActor(this._selectedActor);
    this._removePartListWindow.show();
    this._removePartListWindow.activate();
    this._costWindow.setSelection(this._removePartListWindow.getCurrentSelection());
    this._costWindow.show();
  };

  Scene_ProstheticShop.prototype.onCmdReplaceBodypart = function () {
    this._commandWindow.hide();
    this._commandWindow.deactivate();
    this._replacePartListWindow.setActor(this._selectedActor);
    this._replacePartListWindow.show();
    this._replacePartListWindow.activate();
    this._costWindow.setSelection(this._replacePartListWindow.getCurrentSelection());
    this._costWindow.show();
  };

  Scene_ProstheticShop.prototype.onCmdInstallImplant = function () {
    this._commandWindow.hide();
    this._commandWindow.deactivate();
    this._partSelectWindow.setActor(this._selectedActor);
    this._partSelectWindow.show();
    this._partSelectWindow.activate();
    this._costWindow.setSelection(null);
    this._costWindow.show();
  };

  Scene_ProstheticShop.prototype.onCmdCancel = function () {
    this._commandWindow.hide();
    this._commandWindow.deactivate();
    this._partyWindow.show();
    this._partyWindow.activate();
  };

  // ---- Replace bodypart: Part select ----

  Scene_ProstheticShop.prototype.createReplacePartListWindow = function () {
    this._replacePartListWindow = new Window_ReplacePartList();
    this._replacePartListWindow.setHandler("ok",     this.onReplacePartSelect.bind(this));
    this._replacePartListWindow.setHandler("cancel", this.onReplacePartCancel.bind(this));
    this._replacePartListWindow.hide();
    this._replacePartListWindow.deactivate();
    this.addWindow(this._replacePartListWindow);
  };

  Scene_ProstheticShop.prototype.onReplacePartSelect = function () {
    const item = this._replacePartListWindow.getCurrentSelection();
    if (!item) return;
    this._replacePartListWindow.hide();
    this._replacePartListWindow.deactivate();
    this._replaceArchetypePartListWindow.setContext(this._selectedActor, item.partKey, item.removalFee);
    this._replaceArchetypePartListWindow.show();
    this._replaceArchetypePartListWindow.activate();
    this._costWindow.setSelection(this._replaceArchetypePartListWindow.getCurrentSelection());
  };

  Scene_ProstheticShop.prototype.onReplacePartCancel = function () {
    this._replacePartListWindow.hide();
    this._replacePartListWindow.deactivate();
    this._costWindow.hide();
    this._commandWindow.show();
    this._commandWindow.activate();
  };

  // ---- Replace bodypart: Archetype part select ----

  Scene_ProstheticShop.prototype.createReplaceArchetypePartListWindow = function () {
    this._replaceArchetypePartListWindow = new Window_ReplaceArchetypePartList();
    this._replaceArchetypePartListWindow.setHandler("ok",     this.onReplaceArchetypePartOk.bind(this));
    this._replaceArchetypePartListWindow.setHandler("cancel", this.onReplaceArchetypePartCancel.bind(this));
    this._replaceArchetypePartListWindow.hide();
    this._replaceArchetypePartListWindow.deactivate();
    this.addWindow(this._replaceArchetypePartListWindow);
  };

  Scene_ProstheticShop.prototype.onReplaceArchetypePartOk = function () {
    const item = this._replaceArchetypePartListWindow.getCurrentSelection();
    if (!item) return;

    if (!this._costWindow.canAfford()) {
      $gameMessage.add(getTranslatedText(
        "Insufficient funds! Cost: " + formatPriceInEuros(item.cost),
        "Fondi insufficienti! Costo: " + formatPriceInEuros(item.cost)
      ));
      SoundManager.playBuzzer();
      this._replaceArchetypePartListWindow.activate();
      return;
    }

    const actor   = this._selectedActor;
    const partKey = item.partKey;
    const archPart = item.archPart;

    $gameParty.loseGold(item.cost);

    // Reverse stat bonus of the old part
    const oldPart = actor._bodyParts && actor._bodyParts[partKey];
    if (oldPart) {
      const oldStatEffect = lookupStatEffect(partKey, oldPart, actor);
      const oldBonus = computeStatBonus(oldStatEffect);
      if (oldBonus > 0 && actor._bodyPartStatEffects) {
        const p = oldStatEffect.param;
        if (actor._bodyPartStatEffects[p]) {
          actor._bodyPartStatEffects[p] -= oldBonus;
          if (actor._bodyPartStatEffects[p] <= 0) delete actor._bodyPartStatEffects[p];
        }
      }
      // Remove implant on the old part if present (no refund)
      if (actor._prosthetics && actor._prosthetics[partKey]) {
        const prostheticKey = actor._prosthetics[partKey];
        const prosthetic    = ProstheticTypes[prostheticKey];
        if (prosthetic) {
          if (prosthetic.effects) {
            for (const paramId in prosthetic.effects) {
              if (actor._prostheticEffects && actor._prostheticEffects[paramId]) {
                actor._prostheticEffects[paramId] -= prosthetic.effects[paramId];
                if (actor._prostheticEffects[paramId] === 0) delete actor._prostheticEffects[paramId];
              }
            }
          }
          if (prosthetic.skill) actor.forgetSkill(prosthetic.skill);
        }
        delete actor._prosthetics[partKey];
      }
    }

    // Forget skill of the old part
    if (oldPart && oldPart.skillId && oldPart.skillId !== 0) {
      actor.forgetSkill(oldPart.skillId);
    }

    // Install new part with new data
    if (!actor._bodyParts) actor._bodyParts = {};
    const hpPercentage = item.hpPercent / 100;
    actor._bodyParts[partKey] = {
      name:              item.name,
      maxHp:             Math.round(actor.mhp * hpPercentage),
      currentHp:         Math.round(actor.mhp * hpPercentage),
      vital:             item.vital,
      damaged:           false,
      equipSlot:         archPart.equipSlot   || null,
      childParts:        archPart.childParts  || [],
      multiple:          archPart.multiple    || false,
      appliedStatEffect: false,
      hpPercent:         item.hpPercent,
      statEffect:        item.statEffect,
      skillId:           item.skillId || 0,
    };

    // Apply new stat bonus
    if (item.statEffect && item.statBonus > 0) {
      if (!actor._bodyPartStatEffects) actor._bodyPartStatEffects = {};
      const p = item.statEffect.param;
      if (!actor._bodyPartStatEffects[p]) actor._bodyPartStatEffects[p] = 0;
      actor._bodyPartStatEffects[p] += item.statBonus;
    }

    // Learn skill granted by the new part
    if (item.skillId && item.skillId !== 0) actor.learnSkill(item.skillId);

    actor.refresh();

    $gameMessage.add(getTranslatedText(
      item.name + " replaced successfully!",
      item.name + " sostituita con successo!"
    ));
    SoundManager.playShop();

    this._replaceArchetypePartListWindow.setContext(actor, partKey, item.removalFee);
    this._costWindow.setSelection(this._replaceArchetypePartListWindow.getCurrentSelection());
    this._replaceArchetypePartListWindow.activate();
  };

  Scene_ProstheticShop.prototype.onReplaceArchetypePartCancel = function () {
    this._replaceArchetypePartListWindow.hide();
    this._replaceArchetypePartListWindow.deactivate();
    this._replacePartListWindow.setActor(this._selectedActor);
    this._replacePartListWindow.show();
    this._replacePartListWindow.activate();
    this._costWindow.setSelection(this._replacePartListWindow.getCurrentSelection());
  };

  // ---- Install bodypart: Archetype select ----

  Scene_ProstheticShop.prototype.createArchetypeSelectWindow = function () {
    this._archetypeSelectWindow = new Window_ArchetypeSelect();
    this._archetypeSelectWindow.setHandler("archetype", this.onArchetypeSelect.bind(this));
    this._archetypeSelectWindow.setHandler("cancel",    this.onArchetypeCancel.bind(this));
    this._archetypeSelectWindow.hide();
    this._archetypeSelectWindow.deactivate();
    this.addWindow(this._archetypeSelectWindow);
  };

  Scene_ProstheticShop.prototype.onArchetypeSelect = function () {
    const key = this._archetypeSelectWindow.getSelectedKey();
    this._archetypeSelectWindow.hide();
    this._archetypeSelectWindow.deactivate();
    this._archetypePartListWindow.setContext(this._selectedActor, key);
    this._archetypePartListWindow.show();
    this._archetypePartListWindow.activate();
    this._costWindow.setSelection(this._archetypePartListWindow.getCurrentSelection());
  };

  Scene_ProstheticShop.prototype.onArchetypeCancel = function () {
    this._archetypeSelectWindow.hide();
    this._archetypeSelectWindow.deactivate();
    this._costWindow.hide();
    this._commandWindow.show();
    this._commandWindow.activate();
  };

  // ---- Install bodypart: Archetype part list ----

  Scene_ProstheticShop.prototype.createArchetypePartListWindow = function () {
    this._archetypePartListWindow = new Window_ArchetypePartList();
    this._archetypePartListWindow.setHandler("ok",     this.onArchetypePartOk.bind(this));
    this._archetypePartListWindow.setHandler("cancel", this.onArchetypePartCancel.bind(this));
    this._archetypePartListWindow.hide();
    this._archetypePartListWindow.deactivate();
    this.addWindow(this._archetypePartListWindow);
  };

  Scene_ProstheticShop.prototype.onArchetypePartOk = function () {
    const item  = this._archetypePartListWindow.getCurrentSelection();
    if (!item) return;

    if (!this._costWindow.canAfford()) {
      $gameMessage.add(getTranslatedText(
        "Insufficient funds! Cost: " + formatPriceInEuros(item.cost),
        "Fondi insufficienti! Costo: " + formatPriceInEuros(item.cost)
      ));
      SoundManager.playBuzzer();
      this._archetypePartListWindow.activate();
      return;
    }

    // Install the body part
    const actor   = this._selectedActor;
    const archPart = item.archPart;

    $gameParty.loseGold(item.cost);

    // Add the part to actor._bodyParts
    if (!actor._bodyParts) actor._bodyParts = {};
    const hpPercentage = item.hpPercent / 100;
    actor._bodyParts[item.partKey] = {
      name:             item.name,
      maxHp:            Math.round(actor.mhp * hpPercentage),
      currentHp:        Math.round(actor.mhp * hpPercentage),
      vital:            item.vital,
      damaged:          false,
      equipSlot:        archPart.equipSlot   || null,
      childParts:       archPart.childParts  || [],
      multiple:         archPart.multiple    || false,
      appliedStatEffect:false,
      hpPercent:        item.hpPercent,
      statEffect:       item.statEffect,
      skillId:          item.skillId || 0,
    };

    // Apply stat bonus
    if (item.statEffect && item.statBonus > 0) {
      if (!actor._bodyPartStatEffects) actor._bodyPartStatEffects = {};
      const p = item.statEffect.param;
      if (!actor._bodyPartStatEffects[p]) actor._bodyPartStatEffects[p] = 0;
      actor._bodyPartStatEffects[p] += item.statBonus;
      actor.refresh();
    }

    // Grant skill
    if (item.skillId && item.skillId !== 0) actor.learnSkill(item.skillId);

    $gameMessage.add(getTranslatedText(
      item.name + " installed successfully!",
      item.name + " installata con successo!"
    ));
    SoundManager.playShop();

    this._archetypePartListWindow.setContext(actor, item.archetypeKey);
    this._costWindow.setSelection(this._archetypePartListWindow.getCurrentSelection());
    this._archetypePartListWindow.activate();
  };

  Scene_ProstheticShop.prototype.onArchetypePartCancel = function () {
    this._archetypePartListWindow.hide();
    this._archetypePartListWindow.deactivate();
    this._archetypeSelectWindow.show();
    this._archetypeSelectWindow.activate();
    this._costWindow.setSelection(null);
  };

  // ---- Remove bodypart ----

  Scene_ProstheticShop.prototype.createRemovePartListWindow = function () {
    this._removePartListWindow = new Window_RemovePartList();
    this._removePartListWindow.setHandler("ok",     this.onRemovePartOk.bind(this));
    this._removePartListWindow.setHandler("cancel", this.onRemovePartCancel.bind(this));
    this._removePartListWindow.hide();
    this._removePartListWindow.deactivate();
    this.addWindow(this._removePartListWindow);
  };

  Scene_ProstheticShop.prototype.onRemovePartOk = function () {
    const item = this._removePartListWindow.getCurrentSelection();
    if (!item || item.vital) return;

    this._pendingRemoveItem = item;

    if (item.hasImplant) {
      // Show implant-loss warning before removing
      this._removePartListWindow.deactivate();
      this._confirmRemoveWindow.refresh();
      this._confirmRemoveWindow.show();
      this._confirmRemoveWindow.activate();
      this._confirmRemoveWindow.select(0);
    } else {
      this._executeRemoveBodypart(item);
    }
  };

  Scene_ProstheticShop.prototype.onRemovePartCancel = function () {
    this._removePartListWindow.hide();
    this._removePartListWindow.deactivate();
    this._costWindow.hide();
    this._commandWindow.show();
    this._commandWindow.activate();
  };

  // ---- Remove bodypart: implant-loss confirmation ----

  Scene_ProstheticShop.prototype.createConfirmRemoveWindow = function () {
    this._confirmRemoveWindow = new Window_ConfirmRemove();
    this._confirmRemoveWindow.setHandler("confirm", this.onConfirmRemoveYes.bind(this));
    this._confirmRemoveWindow.setHandler("cancel",  this.onConfirmRemoveNo.bind(this));
    this._confirmRemoveWindow.hide();
    this._confirmRemoveWindow.deactivate();
    this.addWindow(this._confirmRemoveWindow);
  };

  Scene_ProstheticShop.prototype.onConfirmRemoveYes = function () {
    this._confirmRemoveWindow.hide();
    this._confirmRemoveWindow.deactivate();
    this._executeRemoveBodypart(this._pendingRemoveItem);
    this._pendingRemoveItem = null;
  };

  Scene_ProstheticShop.prototype.onConfirmRemoveNo = function () {
    this._confirmRemoveWindow.hide();
    this._confirmRemoveWindow.deactivate();
    this._removePartListWindow.activate();
  };

  Scene_ProstheticShop.prototype._executeRemoveBodypart = function (item) {
    const actor = this._selectedActor;

    if (!this._costWindow.canAfford()) {
      $gameMessage.add(getTranslatedText(
        "Insufficient funds! Cost: " + formatPriceInEuros(item.cost),
        "Fondi insufficienti! Costo: " + formatPriceInEuros(item.cost)
      ));
      SoundManager.playBuzzer();
      this._removePartListWindow.activate();
      return;
    }

    $gameParty.loseGold(item.cost);

    // Remove installed implant first (no refund)
    if (item.hasImplant && actor._prosthetics && actor._prosthetics[item.partKey]) {
      const prostheticKey = actor._prosthetics[item.partKey];
      const prosthetic    = ProstheticTypes[prostheticKey];
      if (prosthetic) {
        if (prosthetic.effects) {
          for (const paramId in prosthetic.effects) {
            if (actor._prostheticEffects && actor._prostheticEffects[paramId]) {
              actor._prostheticEffects[paramId] -= prosthetic.effects[paramId];
              if (actor._prostheticEffects[paramId] === 0) delete actor._prostheticEffects[paramId];
            }
          }
        }
        if (prosthetic.skill) actor.forgetSkill(prosthetic.skill);
      }
      delete actor._prosthetics[item.partKey];
    }

    // Reverse stat bonus granted when this part was added
    if (item.statEffect && item.statBonus > 0 && actor._bodyPartStatEffects) {
      const p = item.statEffect.param;
      if (actor._bodyPartStatEffects[p]) {
        actor._bodyPartStatEffects[p] -= item.statBonus;
        if (actor._bodyPartStatEffects[p] <= 0) delete actor._bodyPartStatEffects[p];
      }
    }

    // Forget skill granted by this part
    const removedPart = actor._bodyParts[item.partKey];
    if (removedPart && removedPart.skillId && removedPart.skillId !== 0) {
      actor.forgetSkill(removedPart.skillId);
    }

    // Remove the body part
    delete actor._bodyParts[item.partKey];
    actor.refresh();

    $gameMessage.add(getTranslatedText(
      item.name + " removed.",
      item.name + " rimossa."
    ));
    SoundManager.playShop();

    this._removePartListWindow.setActor(actor);
    this._costWindow.setSelection(this._removePartListWindow.getCurrentSelection());
    this._removePartListWindow.activate();
  };

  // ---- Install implant: body part grid ----

  Scene_ProstheticShop.prototype.createBodyPartSelectWindow = function () {
    this._partSelectWindow = new Window_BodyPartSelect();
    this._partSelectWindow.setHandler("ok",     this.onPartSelectOk.bind(this));
    this._partSelectWindow.setHandler("cancel", this.onPartSelectCancel.bind(this));
    this._partSelectWindow.hide();
    this._partSelectWindow.deactivate();
    this.addWindow(this._partSelectWindow);
  };

  Scene_ProstheticShop.prototype.onPartSelectOk = function () {
    this._selectedPartKey = this._partSelectWindow.getPartKey();
    this._prostheticListWindow.setActor(this._selectedActor);
    this._prostheticListWindow.setPartKey(this._selectedPartKey);
    this._partSelectWindow.hide();
    this._partSelectWindow.deactivate();
    this._prostheticListWindow.show();
    this._prostheticListWindow.activate();
    this._costWindow.setSelection(this._prostheticListWindow.getCurrentSelection());
  };

  Scene_ProstheticShop.prototype.onPartSelectCancel = function () {
    this._partSelectWindow.hide();
    this._partSelectWindow.deactivate();
    this._costWindow.hide();
    this._commandWindow.show();
    this._commandWindow.activate();
  };

  // ---- Install implant: prosthetic list ----

  Scene_ProstheticShop.prototype.createProstheticListWindow = function () {
    this._prostheticListWindow = new Window_ProstheticList();
    this._prostheticListWindow.setHandler("ok",     this.onProstheticListOk.bind(this));
    this._prostheticListWindow.setHandler("cancel", this.onProstheticListCancel.bind(this));
    this._prostheticListWindow.hide();
    this._prostheticListWindow.deactivate();
    this.addWindow(this._prostheticListWindow);
  };

  Scene_ProstheticShop.prototype.onProstheticListCancel = function () {
    this._prostheticListWindow.hide();
    this._prostheticListWindow.deactivate();
    this._partSelectWindow.show();
    this._partSelectWindow.activate();
    this._costWindow.setSelection(null);
  };

  Scene_ProstheticShop.prototype.onProstheticListOk = function () {
    const item = this._prostheticListWindow.getCurrentSelection();
    if (!item) return;
    if (item.isRemoveOption) {
      this.onRemoveImplant(item);
    } else if (item.isProsthetic) {
      this.onInstallImplant(item);
    } else {
      SoundManager.playBuzzer();
      this._prostheticListWindow.activate();
    }
  };

  Scene_ProstheticShop.prototype.onInstallImplant = function (item) {
    if (!item || !item.isProsthetic) return;

    if (this._prostheticListWindow.isOkEnabled() && this._costWindow.canAfford()) {
      $gameParty.loseGold(item.cost);
      this._prostheticListWindow.installProstheticImmediate(this._selectedActor, item.partKey, item.prostheticKey);
      $gameMessage.add(getTranslatedText("Prosthetic installed successfully!", "Protesi installata con successo!"));
      SoundManager.playShop();
      this._partSelectWindow.setActor(this._selectedActor);
      this._prostheticListWindow.setActor(this._selectedActor);
      this._prostheticListWindow.refresh();
      this._costWindow.setSelection(this._prostheticListWindow.getCurrentSelection());
    } else {
      $gameMessage.add(getTranslatedText(
        "Insufficient funds! Cost: " + formatPriceInEuros(item.cost),
        "Fondi insufficienti! Costo: " + formatPriceInEuros(item.cost)
      ));
      SoundManager.playBuzzer();
    }
    this._prostheticListWindow.activate();
  };

  Scene_ProstheticShop.prototype.onRemoveImplant = function (item) {
    if (!item || !item.isRemoveOption || !item.canRemove) return;
    this._prostheticListWindow.removeProstheticImmediate(this._selectedActor, this._selectedPartKey);
    $gameMessage.add(getTranslatedText("Prosthetic removed successfully", "Protesi rimossa con successo!"));
    SoundManager.playShop();
    this._partSelectWindow.setActor(this._selectedActor);
    this._prostheticListWindow.setActor(this._selectedActor);
    this._prostheticListWindow.refresh();
    this._costWindow.setSelection(this._prostheticListWindow.getCurrentSelection());
    this._prostheticListWindow.activate();
  };

  // ---- Cost window ----

  Scene_ProstheticShop.prototype.createCostWindow = function () {
    this._costWindow = new Window_ProstheticCost();
    this.addWindow(this._costWindow);
  };

  Scene_ProstheticShop.prototype.update = function () {
    Scene_MenuBase.prototype.update.call(this);
    if (this._prostheticListWindow.visible) {
      this._costWindow.setSelection(this._prostheticListWindow.getCurrentSelection());
    } else if (this._removePartListWindow.visible) {
      this._costWindow.setSelection(this._removePartListWindow.getCurrentSelection());
    } else if (this._archetypePartListWindow.visible) {
      this._costWindow.setSelection(this._archetypePartListWindow.getCurrentSelection());
    } else if (this._replaceArchetypePartListWindow.visible) {
      this._costWindow.setSelection(this._replaceArchetypePartListWindow.getCurrentSelection());
    } else if (this._replacePartListWindow.visible) {
      this._costWindow.setSelection(this._replacePartListWindow.getCurrentSelection());
    }
  };

  // ===========================================================================
  // Game_Actor.prototype.param  – prosthetic + body-part stat bonuses
  // ===========================================================================
  var _Game_Actor_param_prosthetic = Game_Actor.prototype.param;
  Game_Actor.prototype.param = function (paramId) {
    var value = _Game_Actor_param_prosthetic.call(this, paramId);
    if (this._prostheticEffects    && this._prostheticEffects[paramId])    value += this._prostheticEffects[paramId];
    if (this._bodyPartStatEffects  && this._bodyPartStatEffects[paramId])  value += this._bodyPartStatEffects[paramId];
    return Math.max(1, value);
  };

  // ===========================================================================
  // Scene_Menu integration
  // ===========================================================================
  var _Scene_Menu_createCommandWindow_prosthetic = Scene_Menu.prototype.createCommandWindow;
  Scene_Menu.prototype.createCommandWindow = function () {
    _Scene_Menu_createCommandWindow_prosthetic.call(this);
    this._commandWindow.setHandler("prostheticShop", this.commandProstheticShop.bind(this));
  };

  Scene_Menu.prototype.commandProstheticShop = function () {
    SceneManager.push(Scene_ProstheticShop);
  };

  // ===========================================================================
  // autoAssignProsthetic  (targets actor 1 only)
  // ===========================================================================
  Game_System.prototype.autoAssignProsthetic = function () {
    const actor       = $gameActors.actor(1);
    const assignmentDone = $gameSwitches.value(88);
    const storedName     = $gameVariables.value(89);
    const currentName    = actor.name();
    const shouldAssign   = !assignmentDone || currentName !== storedName;

    if (shouldAssign) {
      const v87Value   = $gameVariables.value(87);
      const implantName = AUTO_ASSIGN_IMPLANTS[v87Value] !== undefined
        ? AUTO_ASSIGN_IMPLANTS[v87Value]
        : "TESTES";
      console.log(`Auto-assigning implant: ${implantName} (V87 value: ${v87Value})`);
      $gameSwitches.setValue(88, true);
      $gameVariables.setValue(89, currentName);
    } else {
      console.log(`Prosthetic auto-assignment skipped. (Name: ${currentName})`);
    }
  };

  // ===========================================================================
  // Plugin Commands
  // ===========================================================================
  var _Game_Interpreter_pluginCommand_prosthetic = Game_Interpreter.prototype.pluginCommand;
  Game_Interpreter.prototype.pluginCommand = function (command, args) {
    _Game_Interpreter_pluginCommand_prosthetic.call(this, command, args);
    if (command === "OpenProstheticShop") {
      $gameSystem.autoAssignProsthetic();
      SceneManager.push(Scene_ProstheticShop);
    }
  };

  if (Utils.RPGMAKER_NAME === "MZ") {
    PluginManager.registerCommand("Health_ProstheticShop", "OpenProstheticShop", () => {
      $gameSystem.autoAssignProsthetic();
      SceneManager.push(Scene_ProstheticShop);
    });
  }
})();

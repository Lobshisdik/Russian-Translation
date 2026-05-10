/*:
 * @target MZ
 * @plugindesc v1.0.0 Work System - Select jobs, earn money, gain experience through labor
 * @author Omni-Lex
 * @base TimeDateSystem
 * @orderAfter TimeDateSystem
 *
 * @help WorkSystem.js
 * === Work System v1.0.0 ===
 *
 * Requires: TimeDateSystem.js and DataService.js
 *
 * --- Features ---
 * - Select from 30+ different jobs across multiple categories
 * - Choose which party member performs the work
 * - View stat requirements before starting
 * - Warning system for insufficient stats (but allows risky work)
 * - Screen darkens during work shift
 * - Procedural outcome messages based on performance
 * - Time passes during work (integrates with TimeDateSystem)
 * - Earn gold or lose it in disasters
 * - Take damage and suffer status effects from work accidents
 * - Success rates influenced by stats and luck
 *
 * --- Plugin Commands ---
 *
 * @command OpenWorkMenu
 * @text Open Work Menu
 * @desc Opens the work system job selection screen.
 *
 * @command OpenWorkMenuCategory
 * @text Open Work Menu (Category)
 * @desc Opens work menu filtered to a specific category.
 * @arg category
 * @type select
 * @option General
 * @option Combat
 * @option Magical
 * @option Social
 * @option Technical
 * @option Labor
 * @option Criminal
 * @option Faction
 * @default General
 * @desc The job category to display.
 *
 * @command ShowSingleJob
 * @text Show Single Job
 * @desc Shows a specific job without the job list.
 * @arg jobId
 * @type number
 * @min 1
 * @default 1
 * @desc The ID of the job to display.
 *
 * @param timeVariable
 * @text Time Variable
 * @desc Variable ID that stores game time in minutes (from TimeDateSystem).
 * @type variable
 * @default 114
 *
 * @param enableFactionJobs
 * @text Enable Faction Jobs
 * @desc Show faction-specific jobs in the work menu.
 * @type boolean
 * @default true
 *
 * @param showSuccessChance
 * @text Show Success Chance
 * @desc Display calculated success % before working.
 * @type boolean
 * @default true
 *
 * @param workFadeDuration
 * @text Work Fade Duration
 * @desc Frames for screen fade (60 = 1 second).
 * @type number
 * @default 30
 *
 * @param workDuration
 * @text Work Display Duration
 * @desc How long (in frames) the black screen lasts during work.
 * @type number
 * @default 120
 *
 * @param workSoundEffect
 * @text Work Sound Effect
 * @desc SE to play when work begins (leave blank for none).
 * @type file
 * @dir audio/se
 * @default
 */

(() => {
  'use strict';

  const pluginName = "WorkSystem";
  const parameters = PluginManager.parameters(pluginName);

  const settings = {
    timeVariable: Number(parameters.timeVariable || 114),
    enableFactionJobs: parameters.enableFactionJobs === "true",
    showSuccessChance: parameters.showSuccessChance === "true",
    workFadeDuration: Number(parameters.workFadeDuration || 30),
    workDuration: Number(parameters.workDuration || 120),
    workSoundEffect: String(parameters.workSoundEffect || "")
  };
  window.WorkSystem = window.WorkSystem || {};

  // Helper function to get job by ID
  window.WorkSystem.getJob = function (jobId) {
    if (!window.WorkSystem || !window.WorkSystem.Jobs) return null;
    return window.WorkSystem.Jobs.find(job => job.id === jobId);
  };

  // Helper function to get jobs by category
  window.WorkSystem.getJobsByCategory = function (category) {
    if (!window.WorkSystem || !window.WorkSystem.Jobs) return [];
    return window.WorkSystem.Jobs.filter(job => job.category === category);
  };

  // Helper function to get faction jobs
  window.WorkSystem.getFactionJobs = function (factionId) {
    if (!window.WorkSystem || !window.WorkSystem.Jobs) return [];
    return window.WorkSystem.Jobs.filter(job => job.factionId === factionId);
  };

  // Helper function to get actor stat (including custom ones)
  window.WorkSystem.getActorStat = function (actor, stat) {
    if (!actor) return 0;
    switch (stat) {
      case 'ATK': return actor.atk;
      case 'DEF': return actor.def;
      case 'MAT': return actor.mat;
      case 'MDF': return actor.mdf;
      case 'AGI': return actor.agi;
      case 'LUK': return actor.luk;
      case 'HP': return actor.mhp;
      case 'MP': return actor.mmp;
      case 'Arcane': return $gameVariables.value(86);
      case 'Substance': return $gameVariables.value(87);
      case 'Stealth': return $gameVariables.value(88);
      case 'Intimidation': return $gameVariables.value(89);
      default: return 0;
    }
  };

  // Helper function to check if actor meets requirements
  window.WorkSystem.meetsRequirements = function (actor, job) {
    const requirements = job.requirements;
    const results = {
      meets: true,
      deficits: []
    };

    for (const [stat, required] of Object.entries(requirements)) {
      const actorValue = this.getActorStat(actor, stat);

      if (actorValue < required) {
        results.meets = false;
        results.deficits.push({
          stat: stat,
          required: required,
          current: actorValue,
          deficit: required - actorValue
        });
      }
    }

    return results;
  };

  // Calculate success chance based on stat deficits
  window.WorkSystem.calculateSuccessChance = function (actor, job) {
    const check = this.meetsRequirements(actor, job);

    if (check.meets) {
      return 0.80; // 80% base success rate if requirements met
    }

    // Calculate penalty based on deficits
    let totalDeficit = 0;
    let totalRequired = 0;

    for (const deficit of check.deficits) {
      totalDeficit += deficit.deficit;
      totalRequired += deficit.required;
    }

    const deficitRatio = totalDeficit / totalRequired;
    const successChance = Math.max(0.10, 0.80 - (deficitRatio * 2)); // Minimum 10% chance

    return successChance;
  };

  // ============================================================================
  // Work Manager - Core Logic
  // ============================================================================

  class WorkManager {
    static executeWork(actor, job) {
      const successChance = window.WorkSystem.calculateSuccessChance(actor, job);
      const roll = Math.random();

      let outcomeType;
      if (roll < 0.05) {
        // 5% disaster chance
        outcomeType = 'disaster';
      } else if (roll < successChance) {
        // Success
        if (roll > successChance * 0.8) {
          outcomeType = 'success';
        } else {
          outcomeType = 'partial';
        }
      } else {
        // Failure
        outcomeType = 'failure';
      }

      return this.processOutcome(actor, job, outcomeType);
    }

    static processOutcome(actor, job, outcomeType) {
      const outcome = job.outcomes[outcomeType];

      // Select random message
      const messages = outcome.messages;
      const message = messages[Math.floor(Math.random() * messages.length)];

      // Calculate pay
      const pay = Math.floor(job.basePay * outcome.payMultiplier);

      // Get damage
      const damage = outcome.damage || {};
      const hpDamage = damage.hp || 0;
      const mpDamage = damage.mp || 0;

      // Get status effects
      const statuses = outcome.status || [];

      return {
        outcomeType: outcomeType,
        message: message,
        pay: pay,
        hpDamage: hpDamage,
        mpDamage: mpDamage,
        statuses: statuses,
        jobName: job.name,
        jobNameIt: job.name_it
      };
    }

    static applyWorkEffects(actor, job, result) {
      // Apply gold gain/loss
      if (result.pay > 0) {
        $gameParty.gainGold(result.pay);
      } else if (result.pay < 0) {
        $gameParty.loseGold(Math.abs(result.pay));
      }

      // Apply damage
      if (result.hpDamage > 0) {
        actor.gainHp(-result.hpDamage);
      }
      if (result.mpDamage > 0) {
        actor.gainMp(-result.mpDamage);
      }

      // Apply status effects
      for (const statusName of result.statuses) {
        const stateId = window.WorkSystem.Status[statusName.toUpperCase()];
        if (stateId) {
          actor.addState(stateId);
        } else {
          // If it's already a number, add it directly
          if (!isNaN(statusName)) {
            actor.addState(Number(statusName));
          }
        }
      }

      // Advance time (duration in hours, convert to minutes)
      const timeInMinutes = job.duration * 60;
      const currentTime = $gameVariables.value(settings.timeVariable);
      $gameVariables.setValue(settings.timeVariable, currentTime + timeInMinutes);

      // Reduce hunger/sleep based on work duration
      // Assume 5% hunger and 3% sleep per hour (matching TimeDateSystem rates)
      if (actor.hungerValue !== undefined) {
        const hungerCost = job.duration * 5;
        const sleepCost = job.duration * 3;

        actor.hungerValue = Math.max(0, actor.hungerValue - hungerCost);
        actor.sleepValue = Math.max(0, actor.sleepValue - sleepCost);
      }
    }
  }

  // ============================================================================
  // Window_WorkJobList - Displays available jobs
  // ============================================================================

  class Window_WorkJobList extends Window_Selectable {
    initialize(rect, category) {
      this._category = category || null;
      super.initialize(rect);
      this.refresh();
      this.select(0);
    }

    maxCols() {
      return 1;
    }

    maxItems() {
      return this._data ? this._data.length : 0;
    }

    item() {
      return this._data[this.index()];
    }

    makeItemList() {
      if (!window.WorkSystem || !window.WorkSystem.Jobs) {
        this._data = [];
        return;
      }

      let jobs = window.WorkSystem.Jobs;

      // Filter by category if specified
      if (this._category) {
        jobs = jobs.filter(job => job.category === this._category);
      }

      // Filter faction jobs based on settings
      if (!settings.enableFactionJobs) {
        jobs = jobs.filter(job => !job.factionId);
      }

      this._data = jobs;
    }

    drawItem(index) {
      const job = this._data[index];
      if (!job) return;

      const rect = this.itemLineRect(index);
      const useItalian = ConfigManager.language === 'it';

      // Job name
      this.resetTextColor();
      const jobName = useItalian && job.name_it ? job.name_it : job.name;
      this.drawText(jobName, rect.x + 4, rect.y, rect.width - 120);

      // Duration
      this.changeTextColor(ColorManager.systemColor());
      this.drawText(`${job.duration}h`, rect.x + rect.width - 150, rect.y, 50, 'right');

      // Pay
      const payColor = job.basePay > 150 ? ColorManager.powerUpColor() : ColorManager.normalColor();
      this.changeTextColor(payColor);
      this.drawText(`€${job.basePay}`, rect.x + rect.width - 90, rect.y, 80, 'right');
    }

    refresh() {
      this.makeItemList();
      super.refresh();
    }

    updateHelp() {
      if (this._helpWindow) {
        const job = this.item();
        if (job) {
          const useItalian = ConfigManager.language === 'it';
          const desc = useItalian && job.description_it ? job.description_it : job.description;
          this._helpWindow.setText(desc);
        }
      }
    }
  }

  // ============================================================================
  // Window_WorkJobDetails - Shows detailed job info and requirements
  // ============================================================================

  class Window_WorkJobDetails extends Window_Base {
    initialize(rect) {
      super.initialize(rect);
      this._job = null;
      this._actor = null;
    }

    setJob(job) {
      this._job = job;
      this.refresh();
    }

    setActor(actor) {
      this._actor = actor;
      this.refresh();
    }

    refresh() {
      this.contents.clear();
      if (!this._job || !this._actor) return;

      const job = this._job;
      const actor = this._actor;
      const lineHeight = this.lineHeight();
      let y = 0;

      // Job name
      this.changeTextColor(ColorManager.hpColor(actor));
      this.drawText(job.name, 0, y, this.contents.width, 'center');
      y += lineHeight;

      // Category and duration
      this.resetTextColor();
      this.drawText(`Category: ${job.category}`, 0, y, 300);
      this.drawText(`Duration: ${job.duration} hours`, 310, y, 200);
      y += lineHeight + 4;

      // Requirements header
      this.changeTextColor(ColorManager.systemColor());
      this.drawText("Requirements:", 0, y, this.contents.width);
      y += lineHeight;

      // Check requirements
      const reqCheck = window.WorkSystem.meetsRequirements(actor, job);

      // Draw each requirement
      for (const [stat, required] of Object.entries(job.requirements)) {
        const actorValue = window.WorkSystem.getActorStat(actor, stat);

        // Color code: green if met, red if not
        if (actorValue >= required) {
          this.changeTextColor(ColorManager.powerUpColor());
        } else {
          this.changeTextColor(ColorManager.deathColor());
        }

        this.drawText(`${stat}: ${actorValue} / ${required}`, 20, y, 200);
        y += lineHeight;
      }

      y += 4;

      // Success chance (if enabled)
      if (settings.showSuccessChance) {
        const successChance = window.WorkSystem.calculateSuccessChance(actor, job);
        const chancePercent = Math.floor(successChance * 100);

        this.changeTextColor(ColorManager.systemColor());
        this.drawText("Success Rate:", 0, y, 150);

        // Color code success chance
        let chanceColor;
        if (chancePercent >= 70) {
          chanceColor = ColorManager.powerUpColor();
        } else if (chancePercent >= 40) {
          chanceColor = ColorManager.normalColor();
        } else {
          chanceColor = ColorManager.deathColor();
        }
        this.changeTextColor(chanceColor);
        this.drawText(`${chancePercent}%`, 160, y, 100);
        y += lineHeight + 4;
      }

      // Warning if requirements not met
      if (!reqCheck.meets) {
        this.changeTextColor(ColorManager.deathColor());
        this.drawText("⚠ WARNING: Insufficient stats!", 0, y, this.contents.width, 'center');
        y += lineHeight;
        this.resetTextColor();
        this.drawText("Higher risk of failure and injury.", 0, y, this.contents.width, 'center');
        y += lineHeight;
      }

      // Faction info (if applicable)
      if (job.factionId !== undefined) {
        y += 4;
        this.changeTextColor(ColorManager.systemColor());
        this.drawText(`Faction Job ID: ${job.factionId}`, 0, y, this.contents.width);
      }
    }
  }

  // ============================================================================
  // Window_WorkActorSelect - Choose which party member works
  // ============================================================================

  class Window_WorkActorSelect extends Window_Selectable {
    initialize(rect) {
      super.initialize(rect);
      this.refresh();
      this.select(0);
    }

    maxCols() {
      return 4;
    }

    maxItems() {
      return $gameParty.size();
    }

    actor() {
      return $gameParty.members()[this.index()];
    }

    drawItem(index) {
      const actor = $gameParty.members()[index];
      if (!actor) return;

      const rect = this.itemRect(index);
      const x = rect.x + 4;
      const y = rect.y + 4;
      const width = rect.width - 8;

      // Draw actor face
      const faceWidth = ImageManager.faceWidth;
      const faceHeight = ImageManager.faceHeight;
      this.drawActorFace(actor, x, y, width, rect.height - 8);

      // Draw actor name below face
      this.drawText(actor.name(), x, y + faceHeight - this.lineHeight(), width, 'center');
    }

    itemHeight() {
      return ImageManager.faceHeight + this.lineHeight() + 8;
    }
  }

  // ============================================================================
  // Window_WorkDetailsPanel - Combined details and actor selection panel
  // ============================================================================

  class Window_WorkDetailsPanel extends Window_Selectable {
    initialize(rect) {
      super.initialize(rect);
      this._job = null;
      this._actor = null;
      this._actorSelectMode = false;
      this._singleJobMode = false;
      this._actors = [];
      this.deactivate();
      this.refresh();
    }

    setSingleJobMode(enabled) {
      this._singleJobMode = enabled;
    }

    setJob(job) {
      if (this._job !== job) {
        this._job = job;
        this.refresh();
      }
    }

    setActor(actor) {
      if (this._actor !== actor) {
        this._actor = actor;
        this.refresh();
      }
    }

    getSelectedActor() {
      if (this._actorSelectMode && this.index() >= 0) {
        return this._actors[this.index()];
      }
      return this._actor;
    }

    activateActorSelection() {
      this._actorSelectMode = true;
      this._actors = $gameParty.members();
      this.activate();
      this.select(0);
      this.setHandler('ok', this.onActorOk.bind(this));
      this.setHandler('cancel', this.onActorCancel.bind(this));
      this.refresh();
    }

    deactivateActorSelection() {
      this._actorSelectMode = false;
      this.deactivate();
      this.select(-1);
      this.clearHandler('ok');
      this.clearHandler('cancel');
      this.refresh();
    }

    onActorOk() {
      const actor = this.getSelectedActor();
      if (actor && SceneManager._scene.onActorSelected) {
        SceneManager._scene.onActorSelected(actor);
      }
    }

    onActorCancel() {
      if (SceneManager._scene.onActorCancel) {
        SceneManager._scene.onActorCancel();
      }
    }

    maxCols() {
      return this._actorSelectMode ? 4 : 1;
    }

    maxItems() {
      return this._actorSelectMode ? this._actors.length : 0;
    }

    itemHeight() {
      if (this._actorSelectMode) {
        return 100; // Height for actor portraits
      }
      return this.lineHeight();
    }

    drawItem(index) {
      if (!this._actorSelectMode) return;

      const actor = this._actors[index];
      if (!actor) return;

      const rect = this.itemRect(index);
      const x = rect.x + 4;
      const y = rect.y + 4;
      const width = rect.width - 8;

      // Draw actor face
      this.drawActorFace(actor, x, y, width, 80);

      // Draw actor name
      this.drawText(actor.name(), x, y + 80, width, 'center');
    }

    refresh() {
      this.contents.clear();

      if (!this._job) {
        this.drawText('Select a job...', 0, 0, this.contentsWidth(), 'center');
        return;
      }

      if (this._actorSelectMode) {
        this.drawActorSelection();
      } else {
        this.drawJobDetails();
      }
    }

    drawJobDetails() {
      const job = this._job;
      const actor = this._actor || $gameParty.leader();
      const lineHeight = this.lineHeight();
      const useItalian = ConfigManager.language === 'it';
      let y = 0;

      // Job description
      this.changeTextColor(ColorManager.systemColor());
      const descLabel = useItalian ? 'Descrizione' : 'Description';
      this.drawText(descLabel, 0, y, this.contentsWidth());
      y += lineHeight;

      this.resetTextColor();
      const description = useItalian && job.description_it ? job.description_it : job.description;
      const wrappedDesc = this.wrapText(description, this.contentsWidth());
      for (const line of wrappedDesc) {
        this.drawText(line, 10, y, this.contentsWidth() - 10);
        y += lineHeight;
      }

      y += 5;

      // Job info row
      this.changeTextColor(ColorManager.systemColor());
      this.drawText(`${job.category}`, 0, y, 200);
      this.drawText(`${job.duration}h`, 210, y, 100);
      this.changeTextColor(ColorManager.textColor(14));
      this.drawText(`€${job.basePay}`, 320, y, 100);
      y += lineHeight;

      // Faction info if applicable
      if (job.factionId !== undefined && job.factionId !== null) {
        this.changeTextColor(ColorManager.systemColor());
        const factionLabel = useItalian ? 'Fazione' : 'Faction';
        this.drawText(`${factionLabel}:`, 0, y, 100);
        this.changeTextColor(ColorManager.textColor(17)); // Purple/special color
        const factionName = this.getFactionName(job.factionId);
        this.drawText(factionName, 110, y, 300);
        y += lineHeight;
      }

      y += 10;

      // Split into two columns
      const columnWidth = Math.floor(this.contentsWidth() / 2);
      const leftX = 0;
      const rightX = columnWidth + 20;
      const startY = y;

      // Left column: Locations
      y = startY;
      this.changeTextColor(ColorManager.systemColor());
      const locLabel = useItalian ? 'Luoghi' : 'Locations';
      this.drawText(locLabel, leftX, y, columnWidth);
      y += lineHeight;

      this.resetTextColor();
      if (!job.locations || job.locations.length === 0) {
        const unknownText = useItalian ? 'Sconosciuto' : 'Unknown';
        this.drawText(unknownText, leftX + 10, y, columnWidth - 10);
      } else {
        for (const location of job.locations) {
          this.drawText('• ' + location, leftX + 10, y, columnWidth - 10);
          y += lineHeight;
          if (y > this.contentsHeight() - lineHeight * 2) break;
        }
      }

      // Right column: Requirements
      y = startY;
      this.changeTextColor(ColorManager.systemColor());
      const reqLabel = useItalian ? 'Requisiti' : 'Requirements';
      this.drawText(reqLabel, rightX, y, columnWidth);
      y += lineHeight;

      const requirements = job.requirements;
      for (const [stat, required] of Object.entries(requirements)) {
        const actorValue = window.WorkSystem.getActorStat(actor, stat);
        const meetsReq = actorValue >= required;

        this.changeTextColor(meetsReq ? ColorManager.powerUpColor() : ColorManager.deathColor());
        this.drawText(`${stat}: ${actorValue} / ${required}`, rightX + 10, y, columnWidth - 10);
        y += lineHeight;
      }

      // Success rate at bottom
      if (settings.showSuccessChance && actor) {
        const successChance = window.WorkSystem.calculateSuccessChance(actor, job);
        const chancePercent = Math.floor(successChance * 100);

        y = this.contentsHeight() - lineHeight * 2;
        this.changeTextColor(ColorManager.systemColor());
        const successLabel = useItalian ? 'Tasso di Successo' : 'Success Rate';
        this.drawText(successLabel + ':', rightX, y, 150);

        let chanceColor;
        if (chancePercent >= 70) {
          chanceColor = ColorManager.powerUpColor();
        } else if (chancePercent >= 40) {
          chanceColor = ColorManager.normalColor();
        } else {
          chanceColor = ColorManager.deathColor();
        }
        this.changeTextColor(chanceColor);
        this.drawText(`${chancePercent}%`, rightX + 160, y, 100);
      }
    }

    drawActorSelection() {
      const lineHeight = this.lineHeight();
      const useItalian = ConfigManager.language === 'it';

      // Draw instruction text
      this.changeTextColor(ColorManager.systemColor());
      const instructionText = useItalian ? 'Seleziona il lavoratore:' : 'Select worker:';
      this.drawText(instructionText, 0, 0, this.contentsWidth(), 'center');

      // Draw actor portraits (handled by drawItem)
      super.refresh();
    }

    wrapText(text, maxWidth) {
      const words = text.split(' ');
      const lines = [];
      let currentLine = '';

      for (const word of words) {
        const testLine = currentLine ? currentLine + ' ' + word : word;
        const testWidth = this.textWidth(testLine);

        if (testWidth > maxWidth - 20 && currentLine) {
          lines.push(currentLine);
          currentLine = word;
        } else {
          currentLine = testLine;
        }
      }

      if (currentLine) {
        lines.push(currentLine);
      }

      return lines;
    }

    getActorStat(actor, stat) {
      return window.WorkSystem.getActorStat(actor, stat);
    }

    getFactionName(factionId) {
      // Try to get faction name from FactionDataManager if it exists
      if (typeof $dataFactions !== 'undefined' && $dataFactions && $dataFactions[factionId]) {
        return $dataFactions[factionId].name || `Faction ${factionId}`;
      }

      // Fallback to hardcoded faction names based on WorkSystem comments
      const factionNames = {
        0: "Mages Guild",
        1: "Archive Foundation",
        2: "Hypercapitalist Collective",
        3: "Loyalists",
        4: "Traditionalists",
        5: "Technomancers",
        6: "92 Schools Branch",
        7: "Eris' Court",
        15: "Petromanagers",
        16: "Speed Demons",
        17: "Seven Sisters",
        20: "Data Acquisition Department",
        21: "Knowledge Preservation Division",
        22: "Public Transparency Unit",
        23: "Internal Compliance Unit",
        27: "Vatican",
        30: "Battle Nuns"
      };

      return factionNames[factionId] || `Faction ${factionId}`;
    }
  }

  // ============================================================================
  // Scene_Work - Main work system scene
  // ============================================================================

  class Scene_Work extends Scene_MenuBase {
    create() {
      super.create();
      this._category = $gameTemp._workCategory || null;
      this._singleJobId = $gameTemp._singleJobId || null;
      this._singleJobMode = this._singleJobId !== null;

      $gameTemp._workCategory = null;
      $gameTemp._singleJobId = null;

      if (this._singleJobMode) {
        this.createSingleJobView();
      } else {
        this.createJobListWindow();
        this.createDetailsPanel();
      }
    }

    jobListWindowRect() {
      const wx = 0;
      const wy = 0;
      const ww = Graphics.boxWidth;
      const wh = Graphics.boxHeight * 0.40; // Top 40% of screen
      return new Rectangle(wx, wy, ww, wh);
    }

    detailsPanelRect() {
      const wx = 0;
      const wy = this._jobListWindow.y + this._jobListWindow.height;
      const ww = Graphics.boxWidth;
      const wh = Graphics.boxHeight - wy;
      return new Rectangle(wx, wy, ww, wh);
    }

    singleJobRect() {
      const wx = 0;
      const wy = 0;
      const ww = Graphics.boxWidth;
      const wh = Graphics.boxHeight;
      return new Rectangle(wx, wy, ww, wh);
    }

    createJobListWindow() {
      const rect = this.jobListWindowRect();
      this._jobListWindow = new Window_WorkJobList(rect, this._category);
      this._jobListWindow.setHandler('ok', this.onJobOk.bind(this));
      this._jobListWindow.setHandler('cancel', this.popScene.bind(this));
      this._jobListWindow.activate();
      this.addWindow(this._jobListWindow);
    }

    createDetailsPanel() {
      const rect = this.detailsPanelRect();
      this._detailsPanel = new Window_WorkDetailsPanel(rect);
      this.addWindow(this._detailsPanel);
    }

    createSingleJobView() {
      const rect = this.singleJobRect();
      this._detailsPanel = new Window_WorkDetailsPanel(rect);
      this._detailsPanel.setSingleJobMode(true);
      this.addWindow(this._detailsPanel);

      // Load the specific job
      const job = window.WorkSystem.getJob(this._singleJobId);
      if (job) {
        this._detailsPanel.setJob(job);
        this._detailsPanel.setActor($gameParty.leader());

        // Immediately show actor selection
        this._detailsPanel.activateActorSelection();
      } else {
        console.error(`Job ID ${this._singleJobId} not found!`);
        this.popScene();
      }
    }

    onJobOk() {
      const job = this._jobListWindow.item();
      if (!job) return;

      this._jobListWindow.deactivate();
      this._detailsPanel.activateActorSelection();
    }

    onActorSelected(actor) {
      const job = this._jobListWindow.item();
      if (job && actor) {
        this.startWork(actor, job);
      }
    }

    onActorCancel() {
      this._detailsPanel.deactivateActorSelection();
      this._jobListWindow.activate();
    }

    startWork(actor, job) {
      // Store work data and return to map
      $gameTemp._pendingWork = {
        actorId: actor.actorId(),
        job: job
      };

      this.popScene();
    }

    update() {
      super.update();

      // Update details panel based on current job and actor selection
      if (!this._singleJobMode && this._jobListWindow) {
        const job = this._jobListWindow.item();
        const actor = this._detailsPanel.getSelectedActor() || $gameParty.leader();

        if (job && actor) {
          this._detailsPanel.setJob(job);
          this._detailsPanel.setActor(actor);
        }
      } else if (this._singleJobMode) {
        // In single job mode, update actor only
        const actor = this._detailsPanel.getSelectedActor() || $gameParty.leader();
        if (actor) {
          this._detailsPanel.setActor(actor);
        }
      }
    }
  }

  // ============================================================================
  // Map Integration - Execute work on map
  // ============================================================================

  const _Scene_Map_update = Scene_Map.prototype.update;
  Scene_Map.prototype.update = function() {
    _Scene_Map_update.call(this);

    if ($gameTemp._pendingWork && !$gameMessage.isBusy() && !$gamePlayer.isMoving()) {
      this.processWork();
    }
  };

  Scene_Map.prototype.processWork = function() {
    const workData = $gameTemp._pendingWork;
    $gameTemp._pendingWork = null;

    const actor = $gameActors.actor(workData.actorId);
    const job = workData.job;

    if (!actor || !job) return;

    // Start work sequence
    this.startWorkSequence(actor, job);
  };

  Scene_Map.prototype.startWorkSequence = function(actor, job) {
    // Disable player movement
    $gamePlayer.setMoveSpeed(0);

    // Play work sound effect
    if (settings.workSoundEffect) {
      AudioManager.playSe({
        name: settings.workSoundEffect,
        volume: 90,
        pitch: 100,
        pan: 0
      });
    }

    // Fade out screen
    $gameScreen.startFadeOut(settings.workFadeDuration);

    // Wait for fade, then process work
    setTimeout(() => {
      this.executeWork(actor, job);
    }, (settings.workFadeDuration / 60) * 1000 + settings.workDuration / 60 * 1000);
  };

  Scene_Map.prototype.executeWork = function(actor, job) {
    // Execute work and get result
    const result = WorkManager.executeWork(actor, job);

    // Apply effects
    WorkManager.applyWorkEffects(actor, job, result);

    // Fade back in
    $gameScreen.startFadeIn(settings.workFadeDuration);

    // Re-enable player movement
    $gamePlayer.setMoveSpeed(4);

    // Display result messages
    setTimeout(() => {
      this.displayWorkResult(actor, job, result);
    }, (settings.workFadeDuration / 60) * 1000);
  };

  Scene_Map.prototype.displayWorkResult = function(actor, job, result) {
    const useItalian = ConfigManager.language === 'it';
    const jobName = useItalian && job.name_it ? job.name_it : job.name;

    // Work complete message
    window.skipLocalization = true;
    $gameMessage.add(`\\C[6]${actor.name()}\\C[0] finished working as \\C[4]${jobName}\\C[0].`);
    window.skipLocalization = false;

    // Outcome message
    window.skipLocalization = true;
    $gameMessage.add(result.message);
    window.skipLocalization = false;

    // Pay information
    if (result.pay > 0) {
      window.skipLocalization = true;
      $gameMessage.add(`\\C[14]Earned: €${result.pay}\\C[0]`);
      window.skipLocalization = false;
    } else if (result.pay < 0) {
      window.skipLocalization = true;
      $gameMessage.add(`\\C[18]Lost: €${Math.abs(result.pay)} (damages)\\C[0]`);
      window.skipLocalization = false;
    } else {
      window.skipLocalization = true;
      $gameMessage.add(`\\C[7]No payment received.\\C[0]`);
      window.skipLocalization = false;
    }

    // Damage information
    if (result.hpDamage > 0) {
      window.skipLocalization = true;
      $gameMessage.add(`\\C[18]Took ${result.hpDamage} HP damage.\\C[0]`);
      window.skipLocalization = false;
    }
    if (result.mpDamage > 0) {
      window.skipLocalization = true;
      $gameMessage.add(`\\C[23]Exhausted ${result.mpDamage} MP.\\C[0]`);
      window.skipLocalization = false;
    }

    // Status effects
    if (result.statuses.length > 0) {
      const stateNames = result.statuses.map(id => $dataStates[id].name).join(', ');
      window.skipLocalization = true;
      $gameMessage.add(`\\C[18]Afflicted: ${stateNames}\\C[0]`);
      window.skipLocalization = false;
    }

    // Time passed
    window.skipLocalization = true;
    $gameMessage.add(`\\C[6]${job.duration} hours passed.\\C[0]`);
    window.skipLocalization = false;
  };

  // ============================================================================
  // Plugin Commands
  // ============================================================================

  PluginManager.registerCommand(pluginName, "OpenWorkMenu", args => {
    SceneManager.push(Scene_Work);
  });

  PluginManager.registerCommand(pluginName, "OpenWorkMenuCategory", args => {
    $gameTemp._workCategory = args.category;
    SceneManager.push(Scene_Work);
  });

  PluginManager.registerCommand(pluginName, "ShowSingleJob", args => {
    $gameTemp._singleJobId = Number(args.jobId);
    SceneManager.push(Scene_Work);
  });

  // ============================================================================
  // Add Work option to main menu (optional - can be enabled via menu command)
  // ============================================================================

  // Uncomment below to add "Work" to main menu
  /*
  const _Window_MenuCommand_addOriginalCommands = Window_MenuCommand.prototype.addOriginalCommands;
  Window_MenuCommand.prototype.addOriginalCommands = function() {
    _Window_MenuCommand_addOriginalCommands.call(this);
    this.addCommand("Work", "work", true);
  };

  const _Scene_Menu_createCommandWindow = Scene_Menu.prototype.createCommandWindow;
  Scene_Menu.prototype.createCommandWindow = function() {
    _Scene_Menu_createCommandWindow.call(this);
    this._commandWindow.setHandler("work", this.commandWork.bind(this));
  };

  Scene_Menu.prototype.commandWork = function() {
    SceneManager.push(Scene_Work);
  };
  */

})();

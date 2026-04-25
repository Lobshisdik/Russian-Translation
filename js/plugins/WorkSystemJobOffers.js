/*:
 * @target MZ
 * @plugindesc v1.0.0 Job Offers Menu - Browse available jobs with locations
 * @author Omni-Lex
 * @url https://nocoldiz.itch.io/hypernet-explorer
 *
 * @help WorkSystemJobOffers.js
 * === Job Offers Menu v1.0.0 ===
 *
 * Adds a "Job Offers" menu command that shows random available jobs.
 * Displays job details including duration, hourly pay, and locations.
 *
 * Requirements:
 * - WorkSystemDB.js must be loaded first
 *
 * --- Plugin Commands ---
 *
 * @command openJobOffers
 * @text Open Job Offers Menu
 * @desc Opens the Job Offers browser showing random available jobs.
 *
 * @param numberOfJobs
 * @text Number of Jobs Shown
 * @type number
 * @min 3
 * @max 20
 * @default 8
 * @desc How many random jobs to display in the Job Offers menu
 *
 * @param showInMenu
 * @text Show in Main Menu
 * @type boolean
 * @default true
 * @desc Add "Job Offers" command to main menu
 *
 * @param menuCommandName
 * @text Menu Command Name
 * @type text
 * @default Job Offers
 * @desc Name of the menu command (English)
 *
 * @param menuCommandName_IT
 * @text Menu Command Name (Italian)
 * @type text
 * @default Offerte di Lavoro
 * @desc Name of the menu command (Italian)
 */

(() => {
    'use strict';
  
    const pluginName = "WorkSystemJobOffers";
    const parameters = PluginManager.parameters(pluginName);
    const numberOfJobs = Number(parameters['numberOfJobs'] || 8);
    const showInMenu = parameters['showInMenu'] === 'true';
  
    //=============================================================================
    // Plugin Commands
    //=============================================================================
  
    PluginManager.registerCommand(pluginName, "openJobOffers", args => {
      SceneManager.push(Scene_JobOffers);
    });
  
    //=============================================================================
    // Window_MenuCommand - Add Job Offers to main menu
    //=============================================================================
  

  
    //=============================================================================
    // Scene_JobOffers - Main job offers scene
    //=============================================================================
  
    class Scene_JobOffers extends Scene_MenuBase {
      create() {
        super.create();
        this.createJobListWindow();
        this.createDetailWindow();
      }
  
      createJobListWindow() {
        const rect = this.jobListWindowRect();
        this._jobListWindow = new Window_JobOffersList(rect);
        this._jobListWindow.setHandler('ok', this.onJobOk.bind(this));
        this._jobListWindow.setHandler('cancel', this.popScene.bind(this));
        this.addWindow(this._jobListWindow);
        this._jobListWindow.activate();
        this._jobListWindow.select(0);
      }
  
      jobListWindowRect() {
        const wx = 0;
        const wy = 0;
        const ww = Graphics.boxWidth;
        const wh = Graphics.boxHeight * 0.45; // Top 45% of screen
        return new Rectangle(wx, wy, ww, wh);
      }
  
      createDetailWindow() {
        const rect = this.detailWindowRect();
        this._detailWindow = new Window_JobDetails(rect);
        this._jobListWindow.setDetailWindow(this._detailWindow);
        this.addWindow(this._detailWindow);
      }
  
      detailWindowRect() {
        const wx = 0;
        const wy = this._jobListWindow.y + this._jobListWindow.height;
        const ww = Graphics.boxWidth;
        const wh = Graphics.boxHeight - wy;
        return new Rectangle(wx, wy, ww, wh);
      }
  
      onJobOk() {
        const job = this._jobListWindow.currentJob();
        if (job) {
          // Could add functionality here to accept/start the job
          this._jobListWindow.activate();
        }
      }
    }
  
    //=============================================================================
    // Window_JobOffersList - Job list window
    //=============================================================================
  
    class Window_JobOffersList extends Window_Selectable {
      initialize(rect) {
        super.initialize(rect);
        this._data = [];
        this._detailWindow = null;
        this.refresh();
      }
  
      maxCols() {
        return 1;
      }
  
      maxItems() {
        return this._data ? this._data.length : 0;
      }
  
      setDetailWindow(window) {
        this._detailWindow = window;
        this.updateDetailWindow();
      }
  
      currentJob() {
        return this._data[this.index()];
      }
  
      makeItemList() {
        if (!window.WorkSystemDB || !window.WorkSystemDB.JOBS) {
          console.error("WorkSystemDB not loaded!");
          return [];
        }
  
        const allJobs = window.WorkSystemDB.JOBS;
        const shuffled = [...allJobs].sort(() => Math.random() - 0.5);
        return shuffled.slice(0, numberOfJobs);
      }
  
      refresh() {
        this._data = this.makeItemList();
        super.refresh();
      }
  
      drawItem(index) {
        const job = this._data[index];
        if (!job) return;
  
        const rect = this.itemLineRect(index);
        const language = ConfigManager.language || 'en';
        const jobName = language === 'it' ? job.name_it : job.name;
        const hourlyPay = Math.round(job.basePay / job.duration);
  
        // Draw job name
        this.changeTextColor(ColorManager.systemColor());
        this.drawText(jobName, rect.x, rect.y, rect.width - 150);
  
        // Draw duration and hourly pay
        this.changeTextColor(ColorManager.normalColor());
        const payText = `${hourlyPay}€/hr`;
        const durationText = `${job.duration}h`;
        const infoText = `${durationText} | ${payText}`;
        this.drawText(infoText, rect.x + rect.width - 150, rect.y, 150, 'right');
      }
  
      select(index) {
        super.select(index);
        this.updateDetailWindow();
      }
  
      updateDetailWindow() {
        if (this._detailWindow) {
          const job = this.currentJob();
          this._detailWindow.setJob(job);
        }
      }
    }
  
    //=============================================================================
    // Window_JobDetails - Combined detail display window
    //=============================================================================
  
    class Window_JobDetails extends Window_Base {
      initialize(rect) {
        super.initialize(rect);
        this._job = null;
      }
  
      setJob(job) {
        if (this._job !== job) {
          this._job = job;
          this.refresh();
        }
      }
  
      refresh() {
        this.contents.clear();
        if (!this._job) return;
  
        const language = ConfigManager.language || 'en';
        const lineHeight = this.lineHeight();
        let y = 0;
  
        // Job description
        this.changeTextColor(ColorManager.systemColor());
        const descLabel = language === 'it' ? 'Descrizione' : 'Description';
        this.drawText(descLabel, 0, y, this.contentsWidth());
        y += lineHeight;
  
        this.changeTextColor(ColorManager.normalColor());
        const description = language === 'it' ? this._job.description_it : this._job.description;
        const wrappedDesc = this.wrapText(description, this.contentsWidth());
        for (const line of wrappedDesc) {
          this.drawText(line, 0, y, this.contentsWidth());
          y += lineHeight;
        }
  
        // Total pay
        y += 5;
        this.changeTextColor(ColorManager.systemColor());
        const totalPayLabel = language === 'it' ? 'Paga Totale' : 'Total Pay';
        this.drawText(`${totalPayLabel}: `, 0, y, 200);
        this.changeTextColor(ColorManager.normalColor());
        this.drawText(`${this._job.basePay}€`, 200, y, this.contentsWidth() - 200);
        y += lineHeight;

        // Faction info if applicable
        if (this._job.factionId !== undefined && this._job.factionId !== null) {
          this.changeTextColor(ColorManager.systemColor());
          const factionLabel = language === 'it' ? 'Fazione' : 'Faction';
          this.drawText(`${factionLabel}:`, 0, y, 200);
          this.changeTextColor(ColorManager.textColor(17)); // Purple/special color
          const factionName = this.getFactionName(this._job.factionId);
          this.drawText(factionName, 200, y, this.contentsWidth() - 200);
          y += lineHeight;
        }

        y += 10;
  
        // Divide into two columns for locations and requirements
        const columnWidth = Math.floor(this.contentsWidth() / 2);
        const leftX = 0;
        const rightX = columnWidth + 20;
        const startY = y;
  
        // Left column: Locations
        y = startY;
        this.changeTextColor(ColorManager.systemColor());
        const locationsLabel = language === 'it' ? 'Luoghi Disponibili' : 'Available Locations';
        this.drawText(locationsLabel, leftX, y, columnWidth);
        y += lineHeight;
  
        this.changeTextColor(ColorManager.normalColor());
        if (!this._job.locations || this._job.locations.length === 0) {
          const unknownText = language === 'it' ? 'Sconosciuto' : 'Unknown';
          this.drawText(unknownText, leftX + 10, y, columnWidth - 10);
        } else {
          for (const location of this._job.locations) {
            this.drawText('• ' + location, leftX + 10, y, columnWidth - 10);
            y += lineHeight;
          }
        }
  
        // Right column: Requirements
        y = startY;
        this.changeTextColor(ColorManager.systemColor());
        const reqText = language === 'it' ? 'Requisiti' : 'Requirements';
        this.drawText(reqText, rightX, y, columnWidth);
        y += lineHeight;
  
        const requirements = this._job.requirements;
        const actor = $gameParty.leader();
  
        for (const [stat, value] of Object.entries(requirements)) {
          let actorValue = this.getActorStat(actor, stat);
          const meetsReq = actorValue >= value;
  
          this.changeTextColor(meetsReq ? ColorManager.normalColor() : ColorManager.deathColor());
          this.drawText(`${stat}: ${value} (${actorValue})`, rightX + 10, y, columnWidth - 10);
          y += lineHeight;
        }
      }
  
      wrapText(text, maxWidth) {
        const words = text.split(' ');
        const lines = [];
        let currentLine = '';
  
        for (const word of words) {
          const testLine = currentLine ? currentLine + ' ' + word : word;
          const testWidth = this.textWidth(testLine);
  
          if (testWidth > maxWidth && currentLine) {
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
        if (!actor) return 0;

        switch(stat) {
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
      }

      getFactionName(factionId) {
        // Try to get faction name from FactionDataManager if it exists
        if (typeof $dataFactions !== 'undefined' && $dataFactions && $dataFactions[factionId]) {
          return $dataFactions[factionId].name || `Faction ${factionId}`;
        }

        // Fallback to hardcoded faction names based on WorkSystemDB comments
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
  
    // Export windows for external use
    window.Scene_JobOffers = Scene_JobOffers;
    window.Window_JobOffersList = Window_JobOffersList;
    window.Window_JobDetails = Window_JobDetails;
  
    console.log('WorkSystemJobOffers loaded');
  
  })();
  
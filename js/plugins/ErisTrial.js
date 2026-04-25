//=============================================================================
// ErisTrial.js - Procedural Trial System with Eris
// Version: 1.3.0
// Author: Assistant
//=============================================================================

/*:
 * @target MZ
 * @plugindesc Eris Trial System v1.3.0 - With Prison Bounty System
 * @author Assistant
 * @version 1.3.0
 * @description A procedural trial system with Eris, with prison bounty reduction.
 *
 * @param bountyVariable
 * @text Bounty Variable ID
 * @desc Variable ID that stores player bounty
 * @type variable
 * @default 66
 *
 * @param returnMapVariable
 * @text Return Map Variable ID
 * @desc Variable ID for map to return if innocent
 * @type variable
 * @default 76
 *
 * @param returnXVariable
 * @text Return X Variable ID
 * @desc Variable ID for X coordinate if innocent
 * @type variable
 * @default 74
 *
 * @param returnYVariable
 * @text Return Y Variable ID
 * @desc Variable ID for Y coordinate if innocent
 * @type variable
 * @default 75
 *
 * @param prisonMapId
 * @text Prison Map ID
 * @desc Map ID for prison when guilty
 * @type number
 * @default 1102
 *
 * @param prisonX
 * @text Prison X Coordinate
 * @desc X coordinate in prison map
 * @type number
 * @default 8
 *
 * @param prisonY
 * @text Prison Y Coordinate
 * @desc Y coordinate in prison map
 * @type number
 * @default 7
 *
 * @param bountyReductionRate
 * @text Bounty Reduction Rate
 * @desc Amount of bounty reduced per second in prison (in gold)
 * @type number
 * @default 100
 *
 * @help ErisTrial.js
 *
 * This plugin creates a procedurally generated trial system featuring Eris,
 * the ex-goddess of discord turned deranged Goddess of Justice.
 *
 * Version 1.3.0 adds prison bounty reduction system.
 *
 * Features:
 * - Procedural dialogue that changes every trial
 * - Unpredictable trial outcomes based on Eris's mood
 * - Multiple choice responses during trial
 * - Guilty/Not Guilty plea system
 * - Prison system with gradual bounty reduction
 * - Random Eris dialogue when released from prison
 *
 * Plugin Commands:
 * - Start Trial: Begins the trial sequence
 * - Skip to Jail: Teleports directly to jail and serves sentence, skipping trial
 *
 * @command startTrial
 * @text Start Trial
 * @desc Begin the trial with Eris
 *
 * @command skipToJail
 * @text Skip to Jail
 * @desc Teleport directly to jail and serve your sentence, skipping the trial
 */

(() => {
  "use strict";

  const pluginName = "ErisTrial";
  const parameters = PluginManager.parameters(pluginName);
  const bountyVariableId = parseInt(parameters["bountyVariable"] || 66);
  const returnMapVariable = parseInt(parameters["returnMapVariable"] || 76);
  const returnXVariable = parseInt(parameters["returnXVariable"] || 74);
  const returnYVariable = parseInt(parameters["returnYVariable"] || 75);
  const prisonMapId = parseInt(parameters["prisonMapId"] || 1102);
  const prisonX = parseInt(parameters["prisonX"] || 8);
  const prisonY = parseInt(parameters["prisonY"] || 7);
  const bountyReductionRate = parseInt(parameters["bountyReductionRate"] || 100);

  // Check language

  //=============================================================================
  // Window_TrialCrimes
  // A window to display the list of crimes.
  //=============================================================================
  function Window_TrialCrimes() {
    this.initialize(...arguments);
  }

  Window_TrialCrimes.prototype = Object.create(Window_Base.prototype);
  Window_TrialCrimes.prototype.constructor = Window_TrialCrimes;

  Window_TrialCrimes.prototype.initialize = function (crimes) {
    this._crimes = crimes;
    const width = this.windowWidth();
    const height = this.windowHeight();
    Window_Base.prototype.initialize.call(this, new Rectangle(8, 8, width, height));
    this.refresh();
  };

  Window_TrialCrimes.prototype.windowWidth = function () {
    return 300;
  };

  Window_TrialCrimes.prototype.windowHeight = function () {
    const minHeight = this.fittingHeight(1);
    const neededHeight = this.fittingHeight(this._crimes.length || 1);
    return Math.max(minHeight, neededHeight);
  };

  Window_TrialCrimes.prototype.refresh = function () {
    
    const useTranslation = ConfigManager.language === "it";

    this.contents.clear();
    const title = useTranslation ? "Crimini:" : "Crimes:";
    this.changeTextColor(ColorManager.systemColor());
    this.drawText(title, 0, 0, this.contentsWidth(), 'left');
    this.resetTextColor();
    if (this._crimes.length > 0) {
      this._crimes.forEach((crime, index) => {
        this.drawText(crime.name, 4, this.lineHeight() * (index + 1), this.contentsWidth());
      });
    } else {
      const noCrimes = useTranslation ? "Nessuno (ancora)" : "None (yet)";
      this.drawText(noCrimes, 4, this.lineHeight(), this.contentsWidth());
    }
  };

  //=============================================================================
  // Window_TrialBounty
  // A window to display the player's bounty.
  //=============================================================================
  function Window_TrialBounty() {
    this.initialize(...arguments);
  }

  Window_TrialBounty.prototype = Object.create(Window_Base.prototype);
  Window_TrialBounty.prototype.constructor = Window_TrialBounty;

  Window_TrialBounty.prototype.initialize = function (bounty) {
      this._bounty = bounty;
      const width = this.windowWidth();
      const height = this.windowHeight();
      const x = Graphics.boxWidth - width - 9;
      const y = 8;
      Window_Base.prototype.initialize.call(this, new Rectangle(x, y, width, height));
      this.refresh();
  };

  Window_TrialBounty.prototype.windowWidth = function () {
      return 340;
  };

  Window_TrialBounty.prototype.windowHeight = function () {
      return this.fittingHeight(1);
  };

  Window_TrialBounty.prototype.setBounty = function(bounty) {
      if (this._bounty !== bounty) {
          this._bounty = bounty;
          this.refresh();
      }
  };

  Window_TrialBounty.prototype.refresh = function () {
    const useTranslation = ConfigManager.language === "it";

      this.contents.clear();
      const bountyText = useTranslation ? "Taglia:" : "Bounty:";
      const euros = (this._bounty / 100).toFixed(2) + "€";
      const text = `${bountyText} ${euros}`;
      this.drawText(text, 0, 0, this.contentsWidth(), 'left');
  };

  //=============================================================================
  // Prison Manager
  //=============================================================================
  class PrisonManager {
    constructor() {
      this._bountyWindow = null;
      this._isInPrison = false;
      this._lastGameTime = null; // Track game time for bounty reduction
    }

    startPrisonTime(initialBounty) {
      if (this._isInPrison) return;

      this._isInPrison = true;
      this._bountyWindow = new Window_TrialBounty(initialBounty);
      SceneManager._scene.addChild(this._bountyWindow);

      // Initialize game time tracking for bounty reduction
      // Get current game time from TimeDateSystem's game time variable (Variable 85)
      this._lastGameTime = $gameVariables.value(85) || 0; // Variable 85 stores game time in minutes
    }

    reduceBounty() {
      // Get current game time from TimeDateSystem
      const currentGameTime = $gameVariables.value(85) || 0; // Variable 85 = game time minutes
      const timeDelta = currentGameTime - this._lastGameTime;

      if (timeDelta <= 0) {
        return; // No time has passed
      }

      this._lastGameTime = currentGameTime;

      const currentBounty = $gameVariables.value(bountyVariableId);

      if (currentBounty <= 0) {
        this.releasePrisoner();
        return;
      }

      // Reduce bounty based on minutes passed (bountyReductionRate per minute)
      const newBounty = Math.max(0, currentBounty - (bountyReductionRate * timeDelta));
      $gameVariables.setValue(bountyVariableId, newBounty);

      if (this._bountyWindow) {
        this._bountyWindow.setBounty(newBounty);
      }

      if (newBounty <= 0) {
        this.releasePrisoner();
      }
    }

    async releasePrisoner() {
      this.stopPrisonTime();

      // Clear player crimes
      if (window.playerCrimes) {
        window.playerCrimes = [];
      }

      // Show release message
      await this.showReleaseMessage();

      // Transfer to saved location
      const mapId = $gameVariables.value(returnMapVariable) || 1;
      const x = $gameVariables.value(returnXVariable) || 0;
      const y = $gameVariables.value(returnYVariable) || 0;
      $gamePlayer.reserveTransfer(mapId, x, y, 2, 0);
    }

    async showReleaseMessage() {
      const useTranslation = ConfigManager.language === "it";

      const messages = useTranslation ? [
        "Sei libero di andare!\nMa ti sto tenendo d'occhio...",
        "Il tuo tempo è finito!\nVattene prima che cambi idea!",
        "Libertà! Per ora...\nNon farti vedere di nuovo qui!",
        "Hmm, hai pagato il tuo debito.\nOra sparisci!",
        "Bene bene, sei sopravvissuto!\nFuori dalla mia vista!",
        "Il tempo è scaduto!\nSei libero... tecnicamente.",
        "Congratulazioni!\nHai scontato la tua pena!\n...Che noia.",
        "FINALMENTE!\nPensavo non te ne saresti mai andato!",
        "Libertà conquistata!\nMa ricorda: ti sto guardando!",
        "Vai via!\nE non tornare con altri crimini!"
      ] : [
        "You are free to go!\nBut I'm watching you...",
        "Your time is up!\nLeave before I change my mind!",
        "Freedom! For now...\nDon't let me see you here again!",
        "Hmm, you've paid your debt.\nNow scram!",
        "Well well, you survived!\nOut of my sight!",
        "Time's up!\nYou're free... technically.",
        "Congratulations!\nYou've served your sentence!\n...How boring.",
        "FINALLY!\nI thought you'd never leave!",
        "Freedom earned!\nBut remember: I'm watching!",
        "Get out!\nAnd don't come back with more crimes!"
      ];

      const message = messages[Math.floor(Math.random() * messages.length)];
      window.skipLocalization = true;
      $gameMessage.setBackground(2);$gameMessage.add("\\C[3]" + message + "\\C[0]");
      window.skipLocalization = false;

      return new Promise((resolve) => {
        const wait = () => {
          if ($gameMessage.isBusy()) {
            setTimeout(wait, 100);
          } else {
            resolve();
          }
        };
        wait();
      });
    }

    stopPrisonTime() {
      if (this._bountyWindow) {
        if (this._bountyWindow.parent) {
          this._bountyWindow.parent.removeChild(this._bountyWindow);
        }
        this._bountyWindow.destroy();
        this._bountyWindow = null;
      }

      this._isInPrison = false;
      this._lastGameTime = null;
    }

    update() {
      // Update bounty reduction based on game time
      if (this._isInPrison) {
        this.reduceBounty();
      }

      // Check if player left prison map
      if (this._isInPrison && $gameMap.mapId() !== prisonMapId) {
        this.stopPrisonTime();
      }
    }

    isInPrison() {
      return this._isInPrison;
    }
  }

  // Create global prison manager
  if (!window.prisonManager) {
    window.prisonManager = new PrisonManager();
  }

  //=============================================================================
  // Scene_Map - Update prison manager and handle prison start
  //=============================================================================
  const _Scene_Map_update = Scene_Map.prototype.update;
  Scene_Map.prototype.update = function() {
    _Scene_Map_update.call(this);
    if (window.prisonManager) {
      window.prisonManager.update();
    }
  };

  const _Scene_Map_onMapLoaded = Scene_Map.prototype.onMapLoaded;
  Scene_Map.prototype.onMapLoaded = function() {
    _Scene_Map_onMapLoaded.call(this);
    
    // Check if we need to start prison time
    if ($gameTemp._startPrisonOnLoad && $gameMap.mapId() === prisonMapId) {
      const bounty = $gameTemp._prisonBounty || $gameVariables.value(bountyVariableId);
      if (window.prisonManager) {
        window.prisonManager.startPrisonTime(bounty);
      }
      $gameTemp._startPrisonOnLoad = false;
      $gameTemp._prisonBounty = null;
    }
  };

  //=============================================================================
  // ErisTrial Class
  //=============================================================================
  class ErisTrial {
    constructor() {
      this.mood = "";
      this.playerPlea = "";
      this.crimes = [];
      this.bounty = 0;
      this.chaos = 0;
      this.verdict = null;

      // UI Properties
      this._uiContainer = null;
      this._chaosBarBg = null;
      this._chaosBarFg = null;
      this._bountyWindow = null;
      this._crimesWindow = null;
      this._updateInterval = null;

      // Load crimes
      this.loadPlayerCrimes();

      // Set Eris's mood
      this.setMood();

      // Initialize chaos level
      this.chaos = Math.random() * 0.5 + 0.1;
    }

    _adjustChaos(amount) {
        this.chaos += amount;
        this.chaos = Math.max(0, Math.min(1, this.chaos));
    }

    loadPlayerCrimes() {
      const playerCrimeKeys = window.playerCrimes || [];
      const { PresetCrimes } = window.CrimeData || {};

      this.crimes = [];
      let totalBounty = 0;

      for (const crimeKey of playerCrimeKeys) {
        if (PresetCrimes && PresetCrimes[crimeKey]) {
          this.crimes.push({
            key: crimeKey,
            name: PresetCrimes[crimeKey].name,
            bounty: PresetCrimes[crimeKey].bounty,
          });
          totalBounty += PresetCrimes[crimeKey].bounty;
        }
      }

      this.bounty = $gameVariables.value(bountyVariableId) || totalBounty;
    }

    setMood() {
      const moods = [
        "benevolent",
        "neutral",
        "irritated",
        "chaotic",
        "vindictive",
        "whimsical",
        "bored",
        "dramatic",
      ];
      this.mood = moods[Math.floor(Math.random() * moods.length)];
    }

    formatEuros(gold) {
      const euros = gold / 100;
      return euros.toFixed(2) + "€";
    }

    getRandomCrimeAccusation() {
      const useTranslation = ConfigManager.language === "it";

      const accusations = useTranslation
        ? [
            "aver rubato le nuvole dal cielo",
            "aver disturbato il sonno delle formiche",
            "aver pensato pensieri illegali",
            "aver camminato troppo rumorosamente",
            "aver guardato male una statua",
            "aver respirato in modo sospetto",
            "aver esistito senza permesso",
            "aver sognato crimini",
            "aver annusato l'aria pubblica",
            "aver occupato spazio nell'universo",
          ]
        : [
            "stealing clouds from the sky",
            "disturbing the sleep of ants",
            "thinking illegal thoughts",
            "walking too loudly",
            "giving a statue dirty looks",
            "breathing suspiciously",
            "existing without permission",
            "dreaming of crimes",
            "sniffing public air",
            "occupying space in the universe",
          ];

      return accusations[Math.floor(Math.random() * accusations.length)];
    }

    _createTrialUI() {
        this._uiContainer = new PIXI.Container();
        
        const barWidth = 300;
        const barHeight = 20;
        const barX = (Graphics.boxWidth - barWidth) / 2;
        const barY = 10;
        
        this._chaosBarBg = new Sprite(new Bitmap(barWidth, barHeight));
        this._chaosBarBg.bitmap.fillAll('rgba(0, 0, 0, 0.6)');
        this._chaosBarBg.x = barX;
        this._chaosBarBg.y = barY;

        this._chaosBarFg = new Sprite(new Bitmap(barWidth, barHeight));
        this._chaosBarFg.bitmap.fillAll('#8A2BE2');
        this._chaosBarFg.x = barX;
        this._chaosBarFg.y = barY;
        
        this._crimesWindow = new Window_TrialCrimes(this.crimes);
        this._bountyWindow = new Window_TrialBounty(this.bounty);
        
        this._uiContainer.addChild(this._chaosBarBg, this._chaosBarFg, this._crimesWindow, this._bountyWindow);
        SceneManager._scene.addChild(this._uiContainer);
    }

    _updateTrialUI() {
        if (!this._chaosBarFg) return;
        const barWidth = 300;
        this._chaosBarFg.width = barWidth * this.chaos;
    }

    _removeTrialUI() {
        if (this._uiContainer) {
            SceneManager._scene.removeChild(this._uiContainer);
            this._uiContainer.destroy();
            this._uiContainer = null;
        }
        if (this._updateInterval) {
            clearInterval(this._updateInterval);
            this._updateInterval = null;
        }
    }

    async startTrial() {
      // Check if bounty is zero - special case
      if (this.bounty <= 0) {
        await this.zeroBountyRant();
        return;
      }

      this._createTrialUI();
      this._updateInterval = setInterval(() => this._updateTrialUI(), 16);

      await this.showOpening();

      if (Math.random() < 0.15 && this.mood === "chaotic") {
        await this.immediateVerdict();
        return;
      }

      await this.askPlea();

      switch (this.mood) {
        case "benevolent":
          await this.benevolentTrial();
          break;
        case "vindictive":
          await this.vindictiveTrial();
          break;
        case "whimsical":
          await this.playfulTrial();
          break;
        case "bored":
          await this.boredTrial();
          break;
        case "dramatic":
          await this.dramaticTrial();
          break;
        default:
          await this.chaoticTrial();
      }

      await this.deliverVerdict();
    }

    async zeroBountyRant() {
      const useTranslation = ConfigManager.language === "it";

      const rants = useTranslation ? [
        // Surprised
        "COSA?! ZERO?!\nNon hai NESSUNA taglia?!\n...Perché sei qui allora?!",
        "Aspetta aspetta aspetta...\nZERO euro di taglia?!\nChi ti ha mandato qui?!",
        "...\nSei serio?\nNESSUNA taglia?\nVattene! VIA!",
        
        // Mad at player
        "MI STAI PRENDENDO IN GIRO?!\nNon hai fatto NIENTE di male?!\nChe tipo di criminale sei?!",
        "Zero taglia...\nZERO!\nMi hai fatto sprecare il mio tempo!\nFUORI!",
        "NON HO TEMPO PER INNOCENTI!\nVia! Via! VIA!\nE la prossima volta porta almeno\nqualche crimine decente!",
        
        // Mad at herself
        "Come ho fatto a... aspetta...\nHo sbagliato persona?!\nNo no no, questo è imbarazzante...",
        "Io... la grande Eris...\nho convocato qualcuno con zero taglia?\nQuesta è umiliante!",
        
        // Mad at system
        "Il SISTEMA mi ha mandato\nqualcuno INNOCENTE?!\nChe spreco di potere divino!",
        "Chi gestisce questo tribunale?!\nOh giusto, sono io...\nBeh, questo è imbarazzante.",
        "Le guardie mi hanno portato\nla PERSONA SBAGLIATA!\nTeste di rapa!\n...Aspetta, non ho guardie.",
        
        // Chaotic/Confused
        "Zero? ZERO?!\nMa allora... perché...\nSai cosa? Non importa! Vai via!",
        "Hmm... nessuna taglia...\nForse sei TU quello innocente!\nO forse sono io quella colpevole!\nO forse... vai via, mi confondi!",
        "AHAHAHA! Zero taglia!\nÈ così ridicolo che è quasi perfetto!\n...No aspetta, è solo ridicolo. Vattene.",
        
        // Philosophical
        "Nessuna taglia...\nSei l'essere più innocente che abbia mai visto...\nO il più grande criminale che non è stato ancora scoperto.\nNon voglio scoprirlo. Via!",
        
      ] : [
        // Surprised
        "WHAT?! ZERO?!\nYou have NO bounty?!\n...Why are you even here?!",
        "Wait wait wait...\nZERO euros bounty?!\nWho sent you here?!",
        "...\nAre you serious?\nNO bounty?\nLeave! OUT!",
        
        // Mad at player
        "ARE YOU MOCKING ME?!\nYou did NOTHING wrong?!\nWhat kind of criminal are you?!",
        "Zero bounty...\nZERO!\nYou made me waste my time!\nOUT!",
        "I DON'T HAVE TIME FOR INNOCENTS!\nGo! Go! GO!\nAnd next time bring at least\nsome decent crimes!",
        
        // Mad at herself
        "How did I... wait...\nDid I get the wrong person?!\nNo no no, this is embarrassing...",
        "I... the great Eris...\nsummoned someone with zero bounty?\nThis is humiliating!",
        
        // Mad at system
        "The SYSTEM sent me\nsomeone INNOCENT?!\nWhat a waste of divine power!",
        "Who runs this court?!\nOh right, I do...\nWell, this is awkward.",
        "The guards brought me\nthe WRONG PERSON!\nMorons!\n...Wait, I don't have guards.",
        
        // Chaotic/Confused
        "Zero? ZERO?!\nBut then... why...\nYou know what? Whatever! Go away!",
        "Hmm... no bounty...\nMaybe YOU'RE the innocent one!\nOr maybe I'M the guilty one!\nOr maybe... leave, you confuse me!",
        "AHAHAHA! Zero bounty!\nIt's so ridiculous it's almost perfect!\n...No wait, it's just ridiculous. Leave.",
        
        // Philosophical
        "No bounty...\nYou're either the most innocent being I've ever seen...\nOr the greatest criminal never caught.\nI don't want to find out. Go!",
      ];

      const rant = rants[Math.floor(Math.random() * rants.length)];
      window.skipLocalization = true;
      $gameMessage.setBackground(2);$gameMessage.add(rant);
      window.skipLocalization = false;
      
      await this.waitForMessage();

      // Additional rant line sometimes
      if (Math.random() < 0.4) {
        const additionalRants = useTranslation ? [
          "E non farmi più perdere tempo!",
          "Questo non è mai successo prima...",
          "Il mio prestigio... rovinato...",
          "Racconteranno questa storia per secoli...",
          "Dimenticalo. Dimentica tutto questo.",
          "Non parlarne a NESSUNO!",
        ] : [
          "And don't waste my time again!",
          "This has never happened before...",
          "My prestige... ruined...",
          "They'll tell this story for centuries...",
          "Forget it. Forget all of this.",
          "Don't tell ANYONE about this!",
        ];
        
        const additional = additionalRants[Math.floor(Math.random() * additionalRants.length)];
        window.skipLocalization = true;
        $gameMessage.setBackground(2);$gameMessage.add(additional);
        window.skipLocalization = false;
        
        await this.waitForMessage();
      }

      // Release and teleport
      const mapId = $gameVariables.value(returnMapVariable) || 1;
      const x = $gameVariables.value(returnXVariable) || 0;
      const y = $gameVariables.value(returnYVariable) || 0;
      $gamePlayer.reserveTransfer(mapId, x, y, 2, 0);
    }

    async showOpening() {
      const useTranslation = ConfigManager.language === "it";

      window.skipLocalization = true;

      // Opening based on mood - multiple dialogue boxes
      if (this.mood === "benevolent") {
        const openings = useTranslation ? [
          ["Oh! Un visitatore!", "Che sorpresa piacevole... o almeno così sembra.", "Sai, non molti hanno il coraggio di presentarsi\ndavanti a me volontariamente.", "O forse sei stato... convinto? Ah, i dettagli!"],
          ["Benvenuto, benvenuto!", "Oggi mi sento particolarmente... come dire...", "Magnanima? Generosa? Quasi umana?", "Beh, non esageriamo. Ma potrebbe andare peggio per te!"],
          ["Ah, eccoti qui.", "Vedi, sono stata una dea della discordia...", "Ma ora sono la Dea della Giustizia!", "Ironico, vero? A me fa ancora ridere."]
        ] : [
          ["Oh! A visitor!", "What a pleasant surprise... or so it seems.", "You know, not many have the courage to appear before me willingly.", "Or perhaps you were... convinced? Ah, the details!"],
          ["Welcome, welcome!", "Today I feel particularly... how should I put it...", "Magnanimous? Generous? Almost human?", "Well, let's not exaggerate. But it could be worse for you!"],
          ["Ah, there you are.", "You see, I used to be a goddess of discord...", "But now I'm the Goddess of Justice!", "Ironic, isn't it? Still makes me laugh."]
        ];
        const chosen = openings[Math.floor(Math.random() * openings.length)];
        for (const line of chosen) {
          $gameMessage.setBackground(2);$gameMessage.add(line);
          await this.waitForMessage();
        }
      } else if (this.mood === "vindictive") {
        const openings = useTranslation ? [
          ["TU!", "Osi presentarti davanti a ME?!", "Alla GRANDE ERIS?!", "L'audacia... l'arroganza...", "Mi fa quasi venir voglia di rispettarti.", "Quasi."],
          ["Un altro criminale...", "Un altro mortale patetico che pensa di poterla fare franca...", "Sapete cosa mi diverte di voi?", "NIENTE! Assolutamente niente!", "Siete tutti uguali. Noiosi. Colpevoli."],
          ["Ah, guarda chi abbiamo qui.", "Pensavi davvero di sfuggirmi?", "Pensavi che i tuoi crimini sarebbero passati inosservati?", "Io vedo TUTTO.", "E non dimentico MAI."]
        ] : [
          ["YOU!", "You DARE appear before ME?!", "Before the GREAT ERIS?!", "The audacity... the arrogance...", "It almost makes me want to respect you.", "Almost."],
          ["Another criminal...", "Another pathetic mortal who thinks they can get away with it...", "You know what amuses me about you people?", "NOTHING! Absolutely nothing!", "You're all the same. Boring. Guilty."],
          ["Ah, look who we have here.", "Did you really think you could escape me?", "Did you think your crimes would go unnoticed?", "I see EVERYTHING.", "And I NEVER forget."]
        ];
        const chosen = openings[Math.floor(Math.random() * openings.length)];
        for (const line of chosen) {
          $gameMessage.setBackground(2);$gameMessage.add(line);
          await this.waitForMessage();
        }
      } else if (this.mood === "chaotic") {
        const openings = useTranslation ? [
          ["AHAHAHA!", "Un processo! Un glorioso, meraviglioso PROCESSO!", "O aspetta... è un compleanno?", "No no, è decisamente un processo.", "...Credo."],
          ["Benvenuto! O dovrei dire... addio?", "Le parole sono così confuse a volte!", "Giustizia, ingiustizia, pizza...", "Sono tutte la stessa cosa se ci pensi abbastanza!", "O abbastanza poco! Chi lo sa!"],
          ["TU! SÌ, TU!", "Sei qui per... per...", "Perché sei qui di nuovo?", "Ah sì! Il GIUDIZIO!", "O era un gioco? Giochiamo comunque!"]
        ] : [
          ["AHAHAHA!", "A trial! A glorious, wonderful TRIAL!", "Or wait... is it a birthday party?", "No no, it's definitely a trial.", "...I think."],
          ["Welcome! Or should I say... goodbye?", "Words are so confusing sometimes!", "Justice, injustice, pizza...", "They're all the same if you think about it enough!", "Or not enough! Who knows!"],
          ["YOU! YES, YOU!", "You're here for... for...", "Why are you here again?", "Oh yes! JUDGMENT!", "Or was it a game? Let's play anyway!"]
        ];
        const chosen = openings[Math.floor(Math.random() * openings.length)];
        for (const line of chosen) {
          $gameMessage.setBackground(2);$gameMessage.add(line);
          await this.waitForMessage();
        }
      } else if (this.mood === "whimsical") {
        const openings = useTranslation ? [
          ["Ooh, che carino!", "Un nuovo giocattolo... ehm, imputato!", "Sai una cosa? Mi piaci già!", "Questa faccia... questa postura...", "Così piena di... colpa? Speranza? Paura?", "Deliziosa confusione!"],
          ["Ehi! Ciao!", "Vuoi sapere un segreto?", "Non ho idea di cosa sto facendo!", "Ma non dirlo a nessuno, okay?", "Rovinerebbe tutta la mia immagine divina!", "*ridacchia*"],
          ["Benvenuto nel mio parco giochi personale!", "Oggi giochiamo a 'Tribunale'!", "È come monopoli, ma con più verdetti arbitrari!", "E meno proprietà!", "Anche se... potrei sequestrare\nla tua proprietà comunque..."]
        ] : [
          ["Ooh, how cute!", "A new toy... uhm, defendant!", "You know what? I like you already!", "That face... that posture...", "So full of... guilt? Hope? Fear?", "Delicious confusion!"],
          ["Hey! Hi!", "Want to know a secret?", "I have NO idea what I'm doing!", "But don't tell anyone, okay?", "It would ruin my whole divine image!", "*giggles*"],
          ["Welcome to my personal playground!", "Today we're playing 'Court'!", "It's like monopoly, but with more arbitrary verdicts!", "And less property!", "Although... I might keep your property anyway..."]
        ];
        const chosen = openings[Math.floor(Math.random() * openings.length)];
        for (const line of chosen) {
          $gameMessage.setBackground(2);$gameMessage.add(line);
          await this.waitForMessage();
        }
      } else if (this.mood === "bored") {
        const openings = useTranslation ? [
          ["*sbadiglio*", "Un altro processo...", "Lo sai quanti di questi ho fatto oggi?", "Nemmeno io.", "Ho smesso di contare dopo... tre? Forse due?", "Il punto è: sono ANNOIATA."],
          ["Ugh.", "Davvero devo fare questo?", "Non posso semplicemente... non so... leggerti la mente?", "Oh aspetta, posso!", "Ma sarebbe noioso quanto parlare con te.", "Va bene, facciamola finita."],
          ["Ciao.", "Sì, ciao a te.", "Sono la Dea della Giustizia.", "Applausi, eccetera eccetera.", "Puoi saltare le presentazioni, ti conosco già.", "Annoiami il meno possibile, per favore."]
        ] : [
          ["*yawn*", "Another trial...", "Do you know how many of these I've done today?", "Neither do I.", "I stopped counting after... three? Maybe two?", "The point is: I'm BORED."],
          ["Ugh.", "Do I really have to do this?", "Can't I just... I don't know... read your mind?", "Oh wait, I can!", "But it would be as boring as talking to you.", "Fine, let's get this over with."],
          ["Hi.", "Yes, hi to you too.", "I'm the Goddess of Justice.", "Applause, et cetera et cetera.", "You can skip the introductions, I already know you.", "Bore me as little as possible, please."]
        ];
        const chosen = openings[Math.floor(Math.random() * openings.length)];
        for (const line of chosen) {
          $gameMessage.setBackground(2);$gameMessage.add(line);
          await this.waitForMessage();
        }
      } else if (this.mood === "dramatic") {
        const openings = useTranslation ? [
          ["SILENZIO!", "LA CORTE DELLA DIVINA ERIS È UFFICIALMENTE IN SESSIONE!", "*tuono drammatico in lontananza*", "Oh, quello sono io.", "Adoro gli effetti speciali.", "ORA! Dove eravamo... Ah sì!", "QUESTO PROCESSO CAMBIERÀ IL CORSO DELLA STORIA!"],
          ["Benvenuto, mortale!", "In questo giorno fatidico...", "In questa ora oscura...", "Sotto questi cieli tempestosi...", "...okay, i cieli non sono tempestosi, ma suona bene...", "Il tuo destino sarà DECISO!", "Da ME! La magnifica, terribile, DIVINA ERIS!"],
          ["ECCO! L'IMPUTATO GIUNGE!", "Le stelle stesse hanno predetto questo momento!", "Gli dèi antichi tremano!", "Il fato stesso aspetta con il fiato sospeso!", "...o forse è solo gas. Non sono sicura.", "COMUNQUE! Sei qui per essere GIUDICATO!"]
        ] : [
          ["SILENCE!", "THE COURT OF DIVINE ERIS IS OFFICIALLY IN SESSION!", "*dramatic thunder in the distance*", "Oh, that's me.", "I love special effects.", "NOW! Where were we... Oh yes!", "THIS TRIAL WILL CHANGE THE COURSE OF HISTORY!"],
          ["Welcome, mortal!", "On this fateful day...", "In this dark hour...", "Beneath these stormy skies...", "...okay, the skies aren't stormy, but it sounds good...", "Your fate shall be DECIDED!", "By ME! The magnificent, terrible, DIVINE ERIS!"],
          ["BEHOLD! THE DEFENDANT ARRIVES!", "The very stars predicted this moment!", "The ancient gods tremble!", "Fate itself holds its breath!", "...or maybe that's just gas. Not sure.", "ANYWAY! You are here to be JUDGED!"]
        ];
        const chosen = openings[Math.floor(Math.random() * openings.length)];
        for (const line of chosen) {
          $gameMessage.setBackground(2);$gameMessage.add(line);
          await this.waitForMessage();
        }
      } else if (this.mood === "irritated") {
        const openings = useTranslation ? [
          ["Tch.", "Guardati.", "Hai già rovinato la mia giornata e non hai ancora aperto bocca.", "Impressionante, in modo negativo.", "Parliamoci chiaro: non mi piaci già."],
          ["Perfetto. Proprio perfetto.", "Stavo avendo una giornata MERAVIGLIOSA.", "Stavo per rilassarmi, magari causare un po' di caos...", "E poi ARRIVI TU.", "Con i tuoi crimini stupidi e la tua faccia irritante.", "Fantastico."],
          ["Mi hai già stufato.", "Non so nemmeno cosa hai fatto, ma sono già stanca di te.", "È un talento, davvero.", "Essere così irritante senza nemmeno provare.", "Bene. Iniziamo così posso liberarmi di te prima."]
        ] : [
          ["Tch.", "Look at you.", "You've already ruined my day and you haven't even opened your mouth.", "Impressive, in a negative way.", "Let's be clear: I don't like you already."],
          ["Perfect. Just perfect.", "I was having a WONDERFUL day.", "I was about to relax, maybe cause some chaos...", "And then YOU show up.", "With your stupid crimes and your annoying face.", "Fantastic."],
          ["You've already annoyed me.", "I don't even know what you did, but I'm already tired of you.", "It's a talent, really.", "Being this irritating without even trying.", "Fine. Let's start so I can get rid of you sooner."]
        ];
        const chosen = openings[Math.floor(Math.random() * openings.length)];
        for (const line of chosen) {
          $gameMessage.setBackground(2);$gameMessage.add(line);
          await this.waitForMessage();
        }
      } else {
        // neutral
        const openings = useTranslation ? [
          ["Bene.", "Sei qui.", "Io sono qui.", "Dobbiamo fare questo processo.", "Semplice, efficiente, al punto."],
          ["Benvenuto al tribunale.", "Sono Eris.", "Ero la dea della discordia, ora sono la Dea della Giustizia.", "È una lunga storia.", "Non te la racconterò."],
          ["Procediamo.", "Hai crimini, io ho un tribunale.", "È una combinazione naturale.", "Cominciamo senza drammi inutili."]
        ] : [
          ["Well.", "You're here.", "I'm here.", "We need to do this trial.", "Simple, efficient, to the point."],
          ["Welcome to court.", "I'm Eris.", "I used to be the goddess of discord, now I'm the Goddess of Justice.", "It's a long story.", "I won't tell you."],
          ["Let's proceed.", "You have crimes, I have a court.", "It's a natural combination.", "Let's begin without unnecessary drama."]
        ];
        const chosen = openings[Math.floor(Math.random() * openings.length)];
        for (const line of chosen) {
          $gameMessage.setBackground(2);$gameMessage.add(line);
          await this.waitForMessage();
        }
      }

      // Bounty announcement
      if (this.bounty > 0) {
        const bountyAnnouncements = useTranslation ? [
          `La tua taglia ammonta a ${this.formatEuros(this.bounty)}.`,
          `Interessante... ${this.formatEuros(this.bounty)} di taglia.`,
          `Vedo qui che devi ${this.formatEuros(this.bounty)}...`,
          `${this.formatEuros(this.bounty)}! Non male!`,
          `Ah sì, ${this.formatEuros(this.bounty)} di debito con la società.`
        ] : [
          `Your bounty amounts to ${this.formatEuros(this.bounty)}.`,
          `Interesting... ${this.formatEuros(this.bounty)} bounty.`,
          `I see here you owe ${this.formatEuros(this.bounty)}...`,
          `${this.formatEuros(this.bounty)}! Not bad!`,
          `Ah yes, ${this.formatEuros(this.bounty)} debt to society.`
        ];
        $gameMessage.setBackground(2);$gameMessage.add(bountyAnnouncements[Math.floor(Math.random() * bountyAnnouncements.length)]);
        await this.waitForMessage();
      }

      window.skipLocalization = false;
    }

    async immediateVerdict() {
      const useTranslation = ConfigManager.language === "it";

      const immediate = useTranslation
        ? [
            "Sai cosa? COLPEVOLE!\nVia di qui!",
            "No, aspetta... INNOCENTE!\nAnzi no, COLPEVOLE!",
            "Mi hai guardato male.\nPRIGIONE!",
            "Hmm... la tua faccia non mi piace.\nCOLPEVOLE!",
          ]
        : [
            "You know what?\nGUILTY! Get out!",
            "No, wait... INNOCENT!\nActually, GUILTY!",
            "You looked at me wrong.\nPRISON!",
            "Hmm... I don't like your face.\nGUILTY!",
          ];
      window.skipLocalization = true;

      $gameMessage.setBackground(2);$gameMessage.add(
          immediate[Math.floor(Math.random() * immediate.length)]
      );
      window.skipLocalization = false;

      await this.waitForMessage();

      this.verdict = Math.random() < 0.7 ? "guilty" : "innocent";
      this.executeVerdict();
    }

    async askPlea() {
      const useTranslation = ConfigManager.language === "it";

      window.skipLocalization = true;

      const introductions = useTranslation ? [
        ["Ora...", "La parte importante.", "O almeno dovrebbe esserlo.", "Dipende da come mi sento.", "Che non è molto prevedibile!"],
        ["È tempo...", "Tempo per TE di parlare!", "Sì, tu!", "Finalmente!", "Ho parlato abbastanza, no?"],
        ["Bene bene bene...", "Ascoltiamo la tua versione.", "Anche se probabilmente è piena di bugie.", "Ma ehi, mi diverto comunque!"]
      ] : [
        ["Now...", "The important part.", "Or at least it should be.", "Depends on how I feel.", "Which is not very predictable!"],
        ["It's time...", "Time for YOU to speak!", "Yes, you!", "Finally!", "I've talked enough, haven't I?"],
        ["Well well well...", "Let's hear your version.", "Even though it's probably full of lies.", "But hey, I'll enjoy it anyway!"]
      ];

      const intro = introductions[Math.floor(Math.random() * introductions.length)];
      for (const line of intro) {
        $gameMessage.setBackground(2);$gameMessage.add(line);
        await this.waitForMessage();
      }

      const pleaQuestions = useTranslation ? [
        ["Allora...", "Come ti dichiari?", "Colpevole o innocente?", "O qualcos'altro?", "Sorprendimi!"],
        ["La domanda classica:", "Colpevole?", "O innocente?", "Scegli saggiamente!", "...O stupidamente, mi diverto comunque."],
        ["Momento della verità!", "Come ti dichiari davanti a me?", "Davanti alla DIVINA ERIS?", "Beh?", "RISPONDI!"]
      ] : [
        ["So...", "How do you plead?", "Guilty or innocent?", "Or something else?", "Surprise me!"],
        ["The classic question:", "Guilty?", "Or innocent?", "Choose wisely!", "...Or stupidly, I'll enjoy it either way."],
        ["Moment of truth!", "How do you plead before me?", "Before the DIVINE ERIS?", "Well?", "ANSWER!"]
      ];

      const question = pleaQuestions[Math.floor(Math.random() * pleaQuestions.length)];
      for (const line of question) {
        $gameMessage.setBackground(2);$gameMessage.add(line);
        await this.waitForMessage();
      }

      const choices = useTranslation
        ? ["Colpevole", "Non colpevole", "È complicato...", "Tu sei colpevole!"]
        : ["Guilty", "Not guilty", "It's complicated...", "You're guilty!"];

      $gameMessage.setChoices(choices, 0, -1);
      $gameMessage.setChoiceCallback((n) => {
        this.playerPlea = n;
      });

      await this.waitForMessage();
      await this.respondToPlea();

      window.skipLocalization = false;
    }

    async respondToPlea() {
      const useTranslation = ConfigManager.language === "it";

      window.skipLocalization = true;
      
      const responses = {
        0: { // Guilty plea
          benevolent: useTranslation
            ? ["Oh...", "Ammetti la colpa?", "Quanto onesto...", "O stupido?", "Non sono sicura quale.", "Ma... apprezzo la sincerità.", "Forse."]
            : ["Oh...", "You admit guilt?", "How honest...", "Or stupid?", "I'm not sure which.", "But... I appreciate the sincerity.", "Maybe."],
          vindictive: useTranslation
            ? ["FINALMENTE!", "Qualcuno che ammette i propri crimini!", "Pensavo non sarebbe mai successo!", "Di solito mentite tutti!", "TUTTI!", "Ma tu... tu sei diverso.", "Colpevole diverso, ma diverso!"]
            : ["FINALLY!", "Someone who admits their crimes!", "I thought it would never happen!", "Usually you all lie!", "ALL OF YOU!", "But you... you're different.", "Guilty different, but different!"],
          chaotic: useTranslation
            ? ["Colpevole?", "COLPEVOLE?!", "Ma io ti volevo innocente!", "Avevo già preparato il discorso!", "E i fuochi d'artificio!", "...Non avevo preparato niente.", "Ma sono comunque delusa!"]
            : ["Guilty?", "GUILTY?!", "But I wanted you innocent!", "I already prepared the speech!", "And the fireworks!", "...I hadn't prepared anything.", "But I'm disappointed anyway!"],
          whimsical: useTranslation
            ? ["Ooh! Colpevole!", "Che onesto!", "Mi piacciono le persone oneste!", "Anche se sono criminali!", "È così... rinfrescante!", "Come una brezza estiva!", "O un gelato!", "Mmm, gelato..."]
            : ["Ooh! Guilty!", "How honest!", "I like honest people!", "Even if they're criminals!", "It's so... refreshing!", "Like a summer breeze!", "Or ice cream!", "Mmm, ice cream..."],
          bored: useTranslation
            ? ["Colpevole.", "Okay.", "Grazie per non farmi perdere tempo.", "Almeno questo.", "Posso saltare la parte della ricerca prove?", "Perfetto."]
            : ["Guilty.", "Okay.", "Thanks for not wasting my time.", "At least that.", "Can I skip the evidence part?", "Perfect."],
          dramatic: useTranslation
            ? ["COLPEVOLE!", "LO AMMETTI!", "DAVANTI AGLI DÈI!", "DAVANTI AL FATO!", "DAVANTI... a me!", "Che... che coraggio!", "Che audacia!", "Che... beh, stupidità!"]
            : ["GUILTY!", "YOU ADMIT IT!", "BEFORE THE GODS!", "BEFORE FATE!", "BEFORE... me!", "What... what courage!", "What audacity!", "What... well, stupidity!"]
        },
        1: { // Not guilty plea
          benevolent: useTranslation
            ? ["Non colpevole...", "Hmm.", "Tutti dicono così.", "Ma c'è qualcosa in te...", "Non so cosa.", "Forse sincerità?", "O forse sei solo un buon bugiardo."]
            : ["Not guilty...", "Hmm.", "Everyone says that.", "But there's something about you...", "I don't know what.", "Maybe sincerity?", "Or maybe you're just a good liar."],
          vindictive: useTranslation
            ? ["MENTI!", "Tutti mentono!", "SEMPRE!", "È così frustrante!", "Non puoi essere onesto UNA volta?!", "UNA SINGOLA VOLTA?!", "No, ovviamente no!", "COLPEVOLE!"]
            : ["LIES!", "Everyone lies!", "ALWAYS!", "It's so frustrating!", "Can't you be honest ONCE?!", "ONE SINGLE TIME?!", "No, obviously not!", "GUILTY!"],
          chaotic: useTranslation
            ? ["Non colpevole?", "Perfetto!", "Ti dichiaro...", "COLPEVOLE!", "Aspetta no...", "INNOCENTE!", "Anzi...", "Boh, deciderò dopo!"]
            : ["Not guilty?", "Perfect!", "I declare you...", "GUILTY!", "Wait no...", "INNOCENT!", "Actually...", "Meh, I'll decide later!"],
          whimsical: useTranslation
            ? ["Non colpevole!", "Mi piace!", "È come un gioco!", "Tu dici una cosa!", "Io dico un'altra!", "E alla fine...", "Vediamo chi vince!", "Spoiler: vinco sempre io!"]
            : ["Not guilty!", "I like it!", "It's like a game!", "You say one thing!", "I say another!", "And in the end...", "We see who wins!", "Spoiler: I always win!"],
          bored: useTranslation
            ? ["Non colpevole.", "Certo.", "Come no.", "Tutti sono innocenti.", "Nessuno fa mai niente di male.", "E io sono la Regina d'Inghilterra.", "*sospiro*"]
            : ["Not guilty.", "Sure.", "Of course.", "Everyone's innocent.", "Nobody ever does anything wrong.", "And I'm the Queen of England.", "*sigh*"],
          dramatic: useTranslation
            ? ["NON COLPEVOLE?!", "OSI PROCLAMARE LA TUA INNOCENZA?!", "DAVANTI A ME?!", "La DIVINA ERIS?!", "Che... che audacia!", "Che sfrontatezza!", "Mi piace!", "Ma sei comunque in guai seri!"]
            : ["NOT GUILTY?!", "YOU DARE PROCLAIM YOUR INNOCENCE?!", "BEFORE ME?!", "The DIVINE ERIS?!", "What... what audacity!", "What brazenness!", "I like it!", "But you're still in serious trouble!"]
        },
        2: { // It's complicated
          benevolent: useTranslation
            ? ["È complicato?", "Ah...", "La vita è sempre complicata.", "Capisco.", "O almeno... penso di capire.", "Non sono mai stata brava con le sfumature.", "Ma ci provo!"]
            : ["It's complicated?", "Ah...", "Life is always complicated.", "I understand.", "Or at least... I think I understand.", "I was never good with nuances.", "But I try!"],
          vindictive: useTranslation
            ? ["COMPLICATO?!", "Non ho tempo per le complicazioni!", "Le cose sono semplici!", "Colpevole o innocente!", "Bianco o nero!", "...O viola.", "Mi piace il viola.", "MA QUESTO NON È IL PUNTO!"]
            : ["COMPLICATED?!", "I don't have time for complications!", "Things are simple!", "Guilty or innocent!", "Black or white!", "...Or purple.", "I like purple.", "BUT THAT'S NOT THE POINT!"],
          chaotic: useTranslation
            ? ["Complicato!", "OOH MI PIACE COMPLICATO!", "Complicato è il mio secondo nome!", "Anzi no, è 'Caos'.", "O era 'Discordia'?", "Aspetta, ho troppi nomi!", "QUESTO È COMPLICATO!"]
            : ["Complicated!", "OOH I LIKE COMPLICATED!", "Complicated is my middle name!", "Actually no, it's 'Chaos'.", "Or was it 'Discord'?", "Wait, I have too many names!", "THIS IS COMPLICATED!"],
          whimsical: useTranslation
            ? ["Complicato...", "Mi piacciono le cose complicate!", "Sono come puzzle!", "O labirinti!", "O... ehm...", "Cosa stavamo dicendo?", "Ah sì, complicazioni!", "Divertenti!"]
            : ["Complicated...", "I like complicated things!", "They're like puzzles!", "Or mazes!", "Or... uhm...", "What were we saying?", "Oh yes, complications!", "Fun!"],
          bored: useTranslation
            ? ["Complicato.", "Fantastico.", "Proprio quello che volevo.", "Più complicazioni.", "Come se la mia vita non fosse già abbastanza complicata.", "Va bene, spara."]
            : ["Complicated.", "Fantastic.", "Just what I wanted.", "More complications.", "As if my life wasn't complicated enough already.", "Fine, shoot."],
          dramatic: useTranslation
            ? ["COMPLICATO!", "COME TUTTE LE GRANDI STORIE!", "LE TRAGEDIE GRECHE!", "LE EPICHE BATTAGLIE!", "I... i.. i...", "Okay ho finito le similitudini.", "Ma capisci il punto!"]
            : ["COMPLICATED!", "LIKE ALL GREAT STORIES!", "GREEK TRAGEDIES!", "EPIC BATTLES!", "The... the... the...", "Okay I ran out of similes.", "But you get the point!"]
        },
        3: { // You're guilty
          benevolent: useTranslation
            ? ["Io?", "COLPEVOLE?", "Beh...", "Tecnicamente... sì.", "Sono colpevole di molte cose.", "Ma questo non ti aiuterà!", "...O forse sì?", "Hmm..."]
            : ["Me?", "GUILTY?", "Well...", "Technically... yes.", "I'm guilty of many things.", "But that won't help you!", "...Or will it?", "Hmm..."],
          vindictive: useTranslation
            ? ["COME OSI?!", "TU OSI ACCUSARE ME?!", "ME?!", "LA DIVINA ERIS?!", "Sai cosa?", "DOPPIAMENTE COLPEVOLE!", "TRIPLAMENTE COLPEVOLE!", "COLPEVOLE ALL'INFINITO!"]
            : ["HOW DARE YOU?!", "YOU DARE ACCUSE ME?!", "ME?!", "THE DIVINE ERIS?!", "You know what?", "DOUBLE GUILTY!", "TRIPLE GUILTY!", "INFINITELY GUILTY!"],
          chaotic: useTranslation
            ? ["IO COLPEVOLE?!", "AHAHAHA!", "MI PIACE IL TUO STILE!", "Hai ragione!", "Sono colpevolissima!", "Di tutto!", "Sei innocente!", "Aspetta no, sei colpevole!", "O era il contrario?"]
            : ["ME GUILTY?!", "AHAHAHA!", "I LIKE YOUR STYLE!", "You're right!", "I'm super guilty!", "Of everything!", "You're innocent!", "Wait no, you're guilty!", "Or was it the other way?"],
          whimsical: useTranslation
            ? ["Io colpevole?", "Sì!", "Assolutamente!", "Sono colpevole di essere adorabile!", "E potente!", "E un po' pazza!", "Ma questo è irrilevante!", "Parliamo di TE!"]
            : ["Me guilty?", "Yes!", "Absolutely!", "I'm guilty of being adorable!", "And powerful!", "And a bit crazy!", "But that's irrelevant!", "Let's talk about YOU!"],
          bored: useTranslation
            ? ["Sì, sono colpevole.", "E allora?", "Non cambia niente.", "Io sono il giudice.", "Tu sei l'imputato.", "Matematica semplice.", "Ora possiamo continuare?"]
            : ["Yes, I'm guilty.", "So what?", "Doesn't change anything.", "I'm the judge.", "You're the defendant.", "Simple math.", "Can we continue now?"],
          dramatic: useTranslation
            ? ["IO?!", "COLPEVOLE?!", "AHAHAHA!", "QUALE ACCUSA!", "QUALE AUDACIA MAGNIFICA!", "Hai ragione!", "Sono colpevole di TUTTO!", "Ma questo rende il tuo processo...", "ANCORA PIÙ EPICO!"]
            : ["ME?!", "GUILTY?!", "AHAHAHA!", "WHAT AN ACCUSATION!", "WHAT MAGNIFICENT AUDACITY!", "You're right!", "I'm guilty of EVERYTHING!", "But that makes your trial...", "EVEN MORE EPIC!"]
        }
      };

      const moodResponses = responses[this.playerPlea];
      const response = moodResponses[this.mood] || moodResponses["chaotic"] || (useTranslation ? ["Hmm... interessante risposta."] : ["Hmm... interesting answer."]);
      
      for (const line of response) {
        $gameMessage.setBackground(2);$gameMessage.add(line);
        await this.waitForMessage();
      }

      window.skipLocalization = false;
    }

    async benevolentTrial() {
        const useTranslation = ConfigManager.language === "it";

      window.skipLocalization = true;
      
      const intro = useTranslation ? [
        "Vediamo...", "Oggi mi sento... comprensiva.", "Raro per me, lo so.", "Approfittiamone mentre dura!"
      ] : [
        "Let's see...", "Today I feel... understanding.", "Rare for me, I know.", "Let's take advantage while it lasts!"
      ];
      
      for (const line of intro) {
        $gameMessage.setBackground(2);$gameMessage.add(line);
        await this.waitForMessage();
      }

      const questions = useTranslation
        ? [
            ["Dimmi una cosa...", "Hai mai aiutato qualcuno?", "E intendo VERAMENTE aiutato.", "Non solo per sembrare buono."],
            ["Sei pentito delle tue azioni?", "E non dirmi quello che pensi voglia sentire.", "Posso vedere attraverso le bugie.", "...La maggior parte del tempo."],
            ["Facciamo un patto.", "Promettimi di essere buono.", "O almeno... meno cattivo?", "È tutto quello che chiedo. Oggi."],
          ]
        : [
            ["Tell me something...", "Have you ever helped anyone?", "And I mean TRULY helped.", "Not just to look good."],
            ["Do you regret your actions?", "And don't tell me what you think I want to hear.", "I can see through lies.", "...Most of the time."],
            ["Let's make a deal.", "Promise me you'll be good.", "Or at least... less bad?", "That's all I ask. Today."],
          ];

      const chosen = questions[Math.floor(Math.random() * questions.length)];
      for (const line of chosen) {
        $gameMessage.setBackground(2);$gameMessage.add(line);
        await this.waitForMessage();
      }

      const choices = useTranslation
        ? ["Sì", "No", "Forse", "Non lo so"]
        : ["Yes", "No", "Maybe", "I don't know"];

      $gameMessage.setChoices(choices, 0, -1);
      let playerChoice = 0;
      $gameMessage.setChoiceCallback((n) => {
        playerChoice = n;
        if (n === 0) this._adjustChaos(-0.2);
        else if (n === 1) this._adjustChaos(0.2);
      });

      await this.waitForMessage();

      // Response to choice
      const responses = useTranslation ? {
        0: ["Sì?", "Hmm... mi piace questa risposta.", "Onesta. Diretta.", "O almeno spero lo sia."],
        1: ["No?", "Beh... apprezzo l'onestà.", "Anche se è deprimente.", "Almeno non hai mentito!"],
        2: ["Forse...", "La risposta del codardo!", "O del saggio?", "Non sono sicura quale sei tu."],
        3: ["Non lo sai?", "Almeno sei onesto sulla tua confusione.", "È... rinfrescante?", "In un modo strano."]
      } : {
        0: ["Yes?", "Hmm... I like this answer.", "Honest. Direct.", "Or at least I hope it is."],
        1: ["No?", "Well... I appreciate the honesty.", "Even if it's depressing.", "At least you didn't lie!"],
        2: ["Maybe...", "The coward's answer!", "Or the wise one's?", "Not sure which you are."],
        3: ["You don't know?", "At least you're honest about your confusion.", "It's... refreshing?", "In a weird way."]
      };

      const response = responses[playerChoice];
      for (const line of response) {
        $gameMessage.setBackground(2);$gameMessage.add(line);
        await this.waitForMessage();
      }

      // Additional philosophical musings
      if (Math.random() < 0.6) {
        const musings = useTranslation ? [
          ["Sai...", "Non sono sempre stata così.", "Una volta ero... diversa.", "Più caotica. Meno giusta.", "O forse il contrario?"],
          ["Vedo qualcosa in te...", "Non so cosa sia.", "Forse bontà? Potenziale?", "O forse solo vedo quello che voglio vedere."],
          ["La giustizia è strana.", "A volte la pietà è più giusta della giustizia.", "A volte la giustizia è pura crudeltà.", "Filosofia divina. Che mal di testa!"]
        ] : [
          ["You know...", "I wasn't always like this.", "I used to be... different.", "More chaotic. Less just.", "Or maybe the opposite?"],
          ["I see something in you...", "I don't know what it is.", "Maybe goodness? Potential?", "Or maybe I just see what I want to see."],
          ["Justice is strange.", "Sometimes mercy is more just than justice.", "Sometimes justice is pure cruelty.", "Divine philosophy. What a headache!"]
        ];
        
        const musing = musings[Math.floor(Math.random() * musings.length)];
        for (const line of musing) {
          $gameMessage.setBackground(2);$gameMessage.add(line);
          await this.waitForMessage();
        }
      }

      window.skipLocalization = false;
    }

    async vindictiveTrial() {
      const useTranslation = ConfigManager.language === "it";

      window.skipLocalization = true;
      
      const intro = useTranslation ? [
        "Bene bene bene...", "Guardiamoti meglio.", "Sì... vedo la colpa scritta su tutta la tua faccia.", "È praticamente luminosa!", "Come potrei NON vederla?"
      ] : [
        "Well well well...", "Let me look at you closely.", "Yes... I see guilt written all over your face.", "It's practically glowing!", "How could I NOT see it?"
      ];
      
      for (const line of intro) {
        $gameMessage.setBackground(2);$gameMessage.add(line);
        await this.waitForMessage();
      }

      const realCrime =
        this.crimes.length > 0
          ? this.crimes[Math.floor(Math.random() * this.crimes.length)].name
          : this.getRandomCrimeAccusation();

      const accusations = useTranslation
        ? [
            [`Sei accusato di ${realCrime}!`, "E non negarlo!", "Ho le prove qui davanti a me!", "...Da qualche parte."],
            [`${realCrime}!`, "Sì! Proprio quello!", "Pensavi di sfuggire?", "Pensavi fossi stupida?!", "Beh, sono molte cose, ma stupida NO!"],
            [`Il crimine: ${realCrime}.`, "Orribile, vero?", "Disgustoso.", "Imperdonabile!", "...Probabilmente."]
          ]
        : [
            [`You are accused of ${realCrime}!`, "And don't deny it!", "I have the evidence right here!", "...Somewhere."],
            [`${realCrime}!`, "Yes! That one!", "Did you think you'd escape?", "Did you think I was stupid?!", "Well, I'm many things, but stupid is NOT one!"],
            [`The crime: ${realCrime}.`, "Horrible, right?", "Disgusting.", "Unforgivable!", "...Probably."]
          ];

      const chosenAccusation = accusations[Math.floor(Math.random() * accusations.length)];
      for (const line of chosenAccusation) {
        $gameMessage.setBackground(2);$gameMessage.add(line);
        await this.waitForMessage();
      }

      if (Math.random() < 0.7) {
        const additionalCrime = this.getRandomCrimeAccusation();
        const additional = useTranslation ? [
          `E inoltre!`, `${additionalCrime}!`, "Non pensare che me ne sia dimenticata!", "Io NON dimentico MAI!"
        ] : [
          `And furthermore!`, `${additionalCrime}!`, "Don't think I forgot about that!", "I NEVER forget!"
        ];
        
        for (const line of additional) {
          $gameMessage.setBackground(2);
          $gameMessage.add(line);
          await this.waitForMessage();
        }
      }

      if (Math.random() < 0.6) {
        const futureCrimes = useTranslation ? [
          "E sai cosa?", "Probabilmente hai già pianificato altri crimini!", "Posso vederlo nei tuoi occhi!", "Quello sguardo di 'commetterò reati in futuro'!", "Ti conosco!"
        ] : [
          "And you know what?", "You've probably already planned other crimes!", "I can see it in your eyes!", "That 'I will commit crimes in the future' look!", "I know you!"
        ];
        
        for (const line of futureCrimes) {
          $gameMessage.setBackground(2);$gameMessage.add(line);
          await this.waitForMessage();
        }
      }

      const rants = useTranslation ? [
        ["Sai qual è il tuo problema?", "E il problema di TUTTI i criminali?", "Pensate di essere furbi!", "Pensate di poterla fare franca!", "MA IO VEDO TUTTO!"],
        ["Sono stanca.", "Così stanca di gente come te.", "Sempre a infrangere le regole...", "Sempre a causare problemi...", "E poi vi aspettate pietà!", "RIDICOLO!"],
        ["Voglio che tu sappia una cosa.", "Ogni singolo criminale che ho giudicato...", "Ha avuto la stessa espressione che hai tu ora.", "E sai dove sono finiti?", "Beh, lo scoprirai presto!"]
      ] : [
        ["You know what your problem is?", "And the problem of ALL criminals?", "You think you're clever!", "You think you can get away with it!", "BUT I SEE EVERYTHING!"],
        ["I'm tired.", "So tired of people like you.", "Always breaking the rules...", "Always causing problems...", "And then you expect mercy!", "RIDICULOUS!"],
        ["I want you to know something.", "Every single criminal I've judged...", "Had the same expression you have now.", "And you know where they ended up?", "Well, you'll find out soon!"]
      ];

      const rant = rants[Math.floor(Math.random() * rants.length)];
      for (const line of rant) {
        $gameMessage.setBackground(2);$gameMessage.add(line);
        await this.waitForMessage();
      }

      this._adjustChaos(0.3);
      window.skipLocalization = false;
    }

    async playfulTrial() {
      const useTranslation = ConfigManager.language === "it";

      window.skipLocalization = true;
      
      const intro = useTranslation ? [
        "Okay okay okay!", "Sono ANNOIATA dei processi normali.", "Facciamo qualcosa di DIVERTENTE!", "Tipo... un gioco!", "Ti piacciono i giochi, vero? VERO?!"
      ] : [
        "Okay okay okay!", "I'm BORED of normal trials.", "Let's do something FUN!", "Like... a game!", "You like games, right? RIGHT?!"
      ];
      
      for (const line of intro) {
        $gameMessage.setBackground(2);$gameMessage.add(line);
        await this.waitForMessage();
      }

      const games = useTranslation
        ? [
            ["Giochiamo a indovina il numero!", "Sto pensando a un numero tra 1 e 1000!", "Se indovini, sei innocente!", "Se sbagli... beh...", "Dai, prova!"],
            ["Facciamo così:", "Se riesci a farmi ridere...", "Proprio ridere davvero...", "Ti lascio andare!", "Anzi no, forse ti faccio andare in prigione!", "O forse ti libero!", "Chi lo sa! Questo è il divertimento!"],
            ["Ooh, ho un'idea!", "Cantiamo una canzone insieme!", "Io canto la prima parte, tu la seconda!", "E se la canzone mi piace...", "Deciderò il tuo destino in base alle note!", "Perfetto, no?"]
          ]
        : [
            ["Let's play guess the number!", "I'm thinking of a number between 1 and 1000!", "If you guess it, you're innocent!", "If you're wrong... well...", "Come on, try!"],
            ["Let's do this:", "If you can make me laugh...", "Really truly laugh...", "I'll let you go!", "Actually no, maybe I'll send you to prison!", "Or maybe I'll free you!", "Who knows! That's the fun part!"],
            ["Ooh, I have an idea!", "Let's sing a song together!", "I'll sing the first part, you sing the second!", "And if I like the song...", "I'll decide your fate based on the notes!", "Perfect, right?"]
          ];

      const game = games[Math.floor(Math.random() * games.length)];
      for (const line of game) {
        $gameMessage.setBackground(2);$gameMessage.add(line);
        await this.waitForMessage();
      }

      const choices = useTranslation
        ? ["Ci provo!", "No grazie", "Questo è ridicolo", "42!"]
        : ["I'll try!", "No thanks", "This is ridiculous", "42!"];

      $gameMessage.setChoices(choices, 0, -1);
      let playerChoice = 0;
      $gameMessage.setChoiceCallback((n) => {
        playerChoice = n;
        if (n === 0 || n === 3) this._adjustChaos(-0.3);
        else this._adjustChaos(0.1);
      });

      await this.waitForMessage();

      const reactions = {
        0: useTranslation ? [
          "OH! Che entusiasmo!", "Mi piace! Mi piace tantissimo!", "Così energico!", "Così... vivo!", "Fantastico!"
        ] : [
          "OH! Such enthusiasm!", "I love it! I love it so much!", "So energetic!", "So... alive!", "Fantastic!"
        ],
        1: useTranslation ? [
          "No?", "NON vuoi giocare?", "Ma... ma...", "Questo non era nel copione!", "Sei noioso! NOIOSO!"
        ] : [
          "No?", "You DON'T want to play?", "But... but...", "This wasn't in the script!", "You're boring! BORING!"
        ],
        2: useTranslation ? [
          "RIDICOLO?!", "Tu osi chiamare RIDICOLO il mio gioco?!", "...Hai ragione, è totalmente ridicolo.", "MA È DIVERTENTE!", "E questo conta!"
        ] : [
          "RIDICULOUS?!", "You dare call my game RIDICULOUS?!", "...You're right, it's totally ridiculous.", "BUT IT'S FUN!", "And that's what matters!"
        ],
        3: useTranslation ? [
          "42?!", "LA RISPOSTA ALL'UNIVERSO!", "Oh mio dio, hai capito la citazione!", "Sei PERFETTO!", "O forse solo un nerd.", "Entrambi sono accettabili!"
        ] : [
          "42?!", "THE ANSWER TO THE UNIVERSE!", "Oh my god, you got the reference!", "You're PERFECT!", "Or maybe just a nerd.", "Both are acceptable!"
        ]
      };

      const reaction = reactions[playerChoice];
      for (const line of reaction) {
        $gameMessage.setBackground(2);$gameMessage.add(line);
        await this.waitForMessage();
      }

      if (Math.random() < 0.5) {
        const extra = useTranslation ? [
          "Sai cosa?", "Mi stai simpatico!", "Non so perché, ma è così!", "Forse è il tuo viso.", "O forse sono solo di buon umore.", "Chi può dirlo!"
        ] : [
          "You know what?", "I like you!", "I don't know why, but I do!", "Maybe it's your face.", "Or maybe I'm just in a good mood.", "Who can say!"
        ];
        
        for (const line of extra) {
          $gameMessage.setBackground(2);$gameMessage.add(line);
          await this.waitForMessage();
        }
      }

      window.skipLocalization = false;
    }

    async boredTrial() {
      const useTranslation = ConfigManager.language === "it";

      window.skipLocalization = true;
      
      const intro = useTranslation ? [
        "*sbadiglio*", "Dio, un altro processo...", "Non ne posso più.", "Davvero, non ne posso più.", "Ma va bene, facciamolo."
      ] : [
        "*yawn*", "God, another trial...", "I can't take it anymore.", "Really, I just can't.", "But fine, let's do this."
      ];
      
      for (const line of intro) {
        $gameMessage.setBackground(2);$gameMessage.add(line);
        await this.waitForMessage();
      }

      const bored = useTranslation
        ? [
            ["Allora...", "Hai qualcosa da dire in tua difesa?", "Qualcosa di interessante?", "No, chi sto prendendo in giro.", "Niente è interessante."],
            ["Senti, facciamo veloce.", "Ho cose migliori da fare.", "Come... non so...", "Fissare il soffitto.", "Contare i granelli di polvere.", "Qualsiasi cosa tranne questo."],
            ["*sbadiglio di nuovo*", "Sei colpevole o innocente?", "Decidi in fretta.", "Non ho tutto il giorno.", "Anzi, tecnicamente sì, sono immortale.", "Ma preferisco non sprecare il mio tempo."]
          ]
        : [
            ["So...", "Do you have anything to say in your defense?", "Something interesting?", "No, who am I kidding.", "Nothing is interesting."],
            ["Look, let's make this quick.", "I have better things to do.", "Like... I don't know...", "Staring at the ceiling.", "Counting dust particles.", "Anything but this."],
            ["*yawn again*", "Are you guilty or innocent?", "Decide quickly.", "I don't have all day.", "Actually, technically I do, I'm immortal.", "But I prefer not to waste my time."]
          ];

      const chosen = bored[Math.floor(Math.random() * bored.length)];
      for (const line of chosen) {
        $gameMessage.setBackground(2);$gameMessage.add(line);
        await this.waitForMessage();
      }

      const choices = useTranslation
        ? ["Sono innocente!", "Ho una storia lunga...", "Posso andare?", "..."]
        : ["I'm innocent!", "I have a long story...", "Can I go?", "..."];

      $gameMessage.setChoices(choices, 0, -1);
      let playerChoice = 0;
      $gameMessage.setChoiceCallback((n) => {
        playerChoice = n;
        if (n === 1) {
          this._adjustChaos(0.5);
        } else if (n === 3) {
          this._adjustChaos(-0.2);
        }
      });

      await this.waitForMessage();

      const responses = {
        0: useTranslation ? [
          "Innocente.", "Certo che lo sei.", "Tutti dicono di essere innocenti.", "È così... prevedibile."
        ] : [
          "Innocent.", "Of course you are.", "Everyone says they're innocent.", "It's so... predictable."
        ],
        1: useTranslation ? [
          "Una storia lunga?", "OH NO.", "Assolutamente NO.", "Non raccontare storie lunghe.", "Riassumi in tre parole o taci."
        ] : [
          "A long story?", "OH NO.", "Absolutely NOT.", "Do not tell long stories.", "Summarize in three words or be silent."
        ],
        2: useTranslation ? [
          "Puoi andare?", "Ah! Finalmente qualcuno che capisce!", "Mi piace questa domanda!", "Purtroppo la risposta è no.", "Devo comunque giudicarti.", "*sospiro*"
        ] : [
          "Can you go?", "Ah! Finally someone who understands!", "I like this question!", "Unfortunately the answer is no.", "I still have to judge you.", "*sigh*"
        ],
        3: useTranslation ? [
          "...", "Stai zitto anche tu?", "Bene.", "Apprezzo il silenzio.", "È così raro di questi tempi."
        ] : [
          "...", "You're silent too?", "Good.", "I appreciate silence.", "It's so rare these days."
        ]
      };

      const response = responses[playerChoice];
      for (const line of response) {
        $gameMessage.setBackground(2);$gameMessage.add(line);
        await this.waitForMessage();
      }

      if (Math.random() < 0.4) {
        const complaint = useTranslation ? [
          "Sai cosa mi manca?", "Quando ero la dea della discordia.", "Quello era divertente.", "Questo? Questo è lavoro.", "Lavoro noioso."
        ] : [
          "You know what I miss?", "When I was the goddess of discord.", "That was fun.", "This? This is work.", "Boring work."
        ];
        
        for (const line of complaint) {
          $gameMessage.setBackground(2);$gameMessage.add(line);
          await this.waitForMessage();
        }
      }

      window.skipLocalization = false;
    }

    async dramaticTrial() {
      const useTranslation = ConfigManager.language === "it";

      window.skipLocalization = true;
      
      const intro = useTranslation ? [
        "SILENZIO!", "*eco drammatica*", "LA CORTE DELLA DIVINA ERIS...", "È UFFICIALMENTE...", "IN SESSIONE!", "*tuono in lontananza*"
      ] : [
        "SILENCE!", "*dramatic echo*", "THE COURT OF DIVINE ERIS...", "IS OFFICIALLY...", "IN SESSION!", "*thunder in the distance*"
      ];
      
      for (const line of intro) {
        $gameMessage.setBackground(2);$gameMessage.add(line);
        await this.waitForMessage();
      }

      const dramatic = useTranslation
        ? [
            ["Oh, quello sono io il tuono.", "Effetti speciali divini!", "Costano una fortuna ma ne valgono la pena!", "DRAMMATICITÀ AL MASSIMO!"],
            ["Benvenuto, mortale!", "In questo giorno che sarà ricordato...", "Nei secoli dei secoli...", "Per tutta l'eternità...", "O almeno fino a domani."],
            ["LE STELLE STESSE TREMANO!", "IL FATO ASPETTA!", "GLI DÈI ANTICHI OSSERVANO!", "...Probabilmente.", "Non ho controllato."]
          ]
        : [
            ["Oh, that's me with the thunder.", "Divine special effects!", "Cost a fortune but worth it!", "MAXIMUM DRAMA!"],
            ["Welcome, mortal!", "On this day that shall be remembered...", "For centuries and centuries...", "For all eternity...", "Or at least until tomorrow."],
            ["THE VERY STARS TREMBLE!", "FATE ITSELF WAITS!", "THE ANCIENT GODS WATCH!", "...Probably.", "I haven't checked."]
          ];

      const chosen = dramatic[Math.floor(Math.random() * dramatic.length)];
      for (const line of chosen) {
        $gameMessage.setBackground(2);$gameMessage.add(line);
        await this.waitForMessage();
      }

      const proclamation = useTranslation ? [
        "QUESTO...", "NON È UN SEMPLICE PROCESSO!", "Questo è...", "UN MOMENTO EPICO!", "UNO SCONTRO TRA GIUSTIZIA E CRIMINALITÀ!", "UNA BATTAGLIA PER LA TUA ANIMA!", "...O forse no, ma suona bene!"
      ] : [
        "THIS...", "IS NOT A SIMPLE TRIAL!", "This is...", "AN EPIC MOMENT!", "A CLASH BETWEEN JUSTICE AND CRIME!", "A BATTLE FOR YOUR SOUL!", "...Or maybe not, but it sounds good!"
      ];

      for (const line of proclamation) {
        $gameMessage.setBackground(2);$gameMessage.add(line);
        await this.waitForMessage();
      }

      const question = useTranslation
        ? ["E ORA...", "Prima che io pronunci...", "IL VERDETTO CHE ECHEGGERÀ NELL'ETERNITÀ...", "CHE SCUOTERÀ LE FONDAMENTA DELL'UNIVERSO...", "Cosa hai da dire?!"]
        : ["AND NOW...", "Before I pronounce...", "THE VERDICT THAT SHALL ECHO THROUGH ETERNITY...", "THAT SHALL SHAKE THE FOUNDATIONS OF THE UNIVERSE...", "What say you?!"];

      for (const line of question) {
        $gameMessage.setBackground(2);$gameMessage.add(line);
        await this.waitForMessage();
      }

      const choices = useTranslation
        ? ["Pietà!", "Giustizia!", "Non me ne importa", "Sei pazza!"]
        : ["Mercy!", "Justice!", "I don't care", "You're insane!"];

      $gameMessage.setChoices(choices, 0, -1);
      let playerChoice = 0;
      $gameMessage.setChoiceCallback((n) => {
        playerChoice = n;
        if (n === 0) this._adjustChaos(-0.1);
        else if (n === 3) this._adjustChaos(0.4);
      });

      await this.waitForMessage();

      const responses = {
        0: useTranslation ? [
          "PIETÀ?!", "IMPLORI PIETÀ?!", "Quanto... quanto...", "DRAMMATICO!", "MI PIACE!"
        ] : [
          "MERCY?!", "YOU BEG FOR MERCY?!", "How... how...", "DRAMATIC!", "I LOVE IT!"
        ],
        1: useTranslation ? [
          "GIUSTIZIA!", "SÌ! GIUSTIZIA!", "LA RICHIAMI!", "LA INVOCHI!", "E IO LA PORTERÒ!", "...Forse!"
        ] : [
          "JUSTICE!", "YES! JUSTICE!", "YOU CALL FOR IT!", "YOU INVOKE IT!", "AND I SHALL BRING IT!", "...Maybe!"
        ],
        2: useTranslation ? [
          "NON TE NE IMPORTA?!", "HAI L'AUDACIA...", "LA SFRONTATEZZA...", "L'IMPUDENZA...", "Di non avere paura di me?!", "MAGNIFICO!"
        ] : [
          "YOU DON'T CARE?!", "YOU HAVE THE AUDACITY...", "THE BRAZENNESS...", "THE IMPUDENCE...", "To not fear me?!", "MAGNIFICENT!"
        ],
        3: useTranslation ? [
          "PAZZA?!", "TU MI CHIAMI PAZZA?!", "IO?!", "La DIVINA ERIS?!", "...Hai ragione, ma questo è oltre il punto!", "COME OSI?!"
        ] : [
          "INSANE?!", "YOU CALL ME INSANE?!", "ME?!", "The DIVINE ERIS?!", "...You're right, but that's beside the point!", "HOW DARE YOU?!"
        ]
      };

      const response = responses[playerChoice];
      for (const line of response) {
        $gameMessage.setBackground(2);$gameMessage.add(line);
        await this.waitForMessage();
      }

      if (Math.random() < 0.5) {
        const finale = useTranslation ? [
          "E ORA...", "Il momento che tutti stavate aspettando...", "Il climax di questo processo epico...", "LA DECISIONE FINALE!", "...Dopo questa pausa drammatica."
        ] : [
          "AND NOW...", "The moment you've all been waiting for...", "The climax of this epic trial...", "THE FINAL DECISION!", "...After this dramatic pause."
        ];
        
        for (const line of finale) {
          $gameMessage.setBackground(2);$gameMessage.add(line);
          await this.waitForMessage();
        }
      }

      window.skipLocalization = false;
    }

    async chaoticTrial() {
      const useTranslation = ConfigManager.language === "it";

      window.skipLocalization = true;

      const intro = useTranslation ? [
        "Okay! Allora!", "Cosa stiamo facendo?", "Processo? Festa? Entrambi?", "Non lo so! Non lo saprai nemmeno tu!", "PERFETTO!"
      ] : [
        "Okay! So!", "What are we doing?", "Trial? Party? Both?", "I don't know! You won't know either!", "PERFECT!"
      ];

      for (const line of intro) {
        $gameMessage.setBackground(2);$gameMessage.add(line);
        await this.waitForMessage();
      }

      const chaosLevel = Math.floor(Math.random() * 5);

      switch (chaosLevel) {
        case 0:
          const crime = this.getRandomCrimeAccusation();
          const accusation = useTranslation
            ? [`Sei chiaramente colpevole di ${crime}!`, "È OVVIO!", "Come puoi negarlo?!", "Oh aspetta, non stavi negando nulla.", "Beh, troppo tardi ora!"]
            : [`You're clearly guilty of ${crime}!`, "It's OBVIOUS!", "How can you deny it?!", "Oh wait, you weren't denying anything.", "Well, too late now!"];
          
          for (const line of accusation) {
            $gameMessage.setBackground(2);$gameMessage.add(line);
            await this.waitForMessage();
          }
          break;

        case 1:
          const random = useTranslation
            ? [
                ["Sai cosa?", "Parliamo del tempo invece!", "È bello oggi, vero?", "O forse piove?", "Non guardo mai fuori.", "Aspetta, siamo fuori?"],
                ["Mi piacciono le farfalle.", "Tu?", "Sono così colorate!", "E volano!", "Proprio come... aspetta, cosa stavamo facendo?"],
                ["Hai mai visto un drago che piange?", "Io sì.", "È bellissimo.", "E triste.", "Ma soprattutto bagnato.", "I draghi producono MOLTO liquido lacrimale."]
              ]
            : [
                ["You know what?", "Let's talk about the weather instead!", "It's nice today, right?", "Or maybe it's raining?", "I never look outside.", "Wait, are we outside?"],
                ["I like butterflies.", "Do you?", "They're so colorful!", "And they fly!", "Just like... wait, what were we doing?"],
                ["Have you ever seen a dragon cry?", "I have.", "It's beautiful.", "And sad.", "But mostly wet.", "Dragons produce A LOT of tears."]
              ];
          
          const chosen = random[Math.floor(Math.random() * random.length)];
          for (const line of chosen) {
            $gameMessage.setBackground(2);$gameMessage.add(line);
            await this.waitForMessage();
          }
          break;

        case 2:
          const forget = useTranslation
            ? ["Aspetta...", "Perché sei qui?", "No davvero, perché?", "Ah sì! Il processo!", "O era una festa?", "Sono confusa.", "Questo succede spesso."]
            : ["Wait...", "Why are you here?", "No really, why?", "Oh right! The trial!", "Or was it a party?", "I'm confused.", "This happens often."];
          
          for (const line of forget) {
            $gameMessage.setBackground(2);$gameMessage.add(line);
            await this.waitForMessage();
          }
          break;

        case 3:
          const argue = useTranslation
            ? [
                "È colpevole!", "NO, aspetta!", "È innocente!", "Ma che dico?!", "Sono IO la colpevole!", "No aspetta, quello non ha senso!", "O forse sì?", "CHI LO SA!"
              ]
            : [
                "They're guilty!", "NO, wait!", "They're innocent!", "What am I saying?!", "I'M the guilty one!", "No wait, that doesn't make sense!", "Or does it?", "WHO KNOWS!"
              ];
          
          for (const line of argue) {
            $gameMessage.setBackground(2);$gameMessage.add(line);
            await this.waitForMessage();
          }
          break;

        case 4:
          const chaos = useTranslation
            ? [
                "TUTTO È CAOS!", "Il caos è ordine!", "L'ordine è caos!", "Tu sei me!", "Io sono te!", "Noi siamo... pizza?", "No aspetta, quello non funziona.", "OPPURE SÌ!"
              ]
            : [
                "EVERYTHING IS CHAOS!", "Chaos is order!", "Order is chaos!", "You are me!", "I am you!", "We are... pizza?", "No wait, that doesn't work.", "OR DOES IT!"
              ];
          
          for (const line of chaos) {
            $gameMessage.setBackground(2);$gameMessage.add(line);
            await this.waitForMessage();
          }
          break;
      }

      if (Math.random() < 0.6) {
        const extra = useTranslation ? [
          "Comunque...", "Dove eravamo?", "Ah giusto, da nessuna parte!", "Come sempre!", "Questo è l'importante!"
        ] : [
          "Anyway...", "Where were we?", "Oh right, nowhere!", "As always!", "That's what matters!"
        ];
        
        for (const line of extra) {
          $gameMessage.setBackground(2);$gameMessage.add(line);
          await this.waitForMessage();
        }
      }

      window.skipLocalization = false;

      this._adjustChaos(Math.random() - 0.5);
    }

    async deliverVerdict() {
      const useTranslation = ConfigManager.language === "it";

      if (this.verdict === null) {
        let guiltyChance = 0.5 + (this.chaos - 0.5) * 0.4;

        if (this.mood === "benevolent") {
          guiltyChance -= 0.25;
        } else if (this.mood === "vindictive") {
          guiltyChance += 0.3;
        } else if (this.mood === "whimsical" && this.playerPlea === 2) {
            guiltyChance -= 0.2;
        } 

        this.verdict = Math.random() < guiltyChance ? "guilty" : "innocent";
      }

      if (Math.random() < 0.1) {
        const changeText = useTranslation
          ? "Aspetta! Ho cambiato idea!"
          : "Wait! I've changed my mind!";
        window.skipLocalization = true;
        $gameMessage.setBackground(2);
        $gameMessage.add(changeText);
        window.skipLocalization = false;

        await this.waitForMessage();
        this.verdict = this.verdict === "guilty" ? "innocent" : "guilty";
      }

      await this.announceVerdict();

      this.executeVerdict();
    }

    async announceVerdict() {
      const useTranslation = ConfigManager.language === "it";

      window.skipLocalization = true;

      const drumrolls = useTranslation ? [
        ["Bene allora...", "È arrivato il momento...", "Il momento che stavamo aspettando...", "O almeno che IO stavo aspettando...", "Tu probabilmente lo temevi."],
        ["Dopo attenta considerazione...", "E profonda riflessione...", "E consultazione con gli dèi antichi...", "...Sto mentendo, non ho consultato nessuno.", "Facciamo finta di sì."],
        ["Il verdetto...", "Il fatidico verdetto...", "Quello che cambierà la tua vita...", "O almeno la tua giornata...", "Sta per essere pronunciato!"]
      ] : [
        ["Well then...", "The moment has arrived...", "The moment we've been waiting for...", "Or at least that I've been waiting for...", "You were probably dreading it."],
        ["After careful consideration...", "And deep reflection...", "And consultation with the ancient gods...", "...I'm lying, I didn't consult anyone.", "Let's pretend I did."],
        ["The verdict...", "The fateful verdict...", "That will change your life...", "Or at least your day...", "Is about to be pronounced!"]
      ];

      const drumroll = drumrolls[Math.floor(Math.random() * drumrolls.length)];
      for (const line of drumroll) {
        $gameMessage.setBackground(2);$gameMessage.add(line);
        await this.waitForMessage();
      }

      if (this.verdict === "guilty") {
        const guiltyVerdicts = useTranslation ? [
          ["COLPEVOLE!", "Sì, hai sentito bene!", "COL-PE-VO-LE!", "In tutte le lettere!", "In prigione!!!"],
          ["Il verdetto è...", "...", "COLPEVOLE!", "Sorpreso?", "Io no!", "Sembrava ovvio fin dall'inizio!"],
          ["Colpevole come il peccato!", "Colpevole come...", "Come... qualcosa di molto colpevole!", "Non ho altre similitudini!", "Ma il punto è: COLPEVOLE!"],
          ["DECISAMENTE COLPEVOLE!", "Non c'erano dubbi!", "Beh, forse uno o due...", "Ma li ho ignorati!", "PRIGIONE!"],
          ["La corte ti dichiara...", "*pausa drammatica*", "*altra pausa*", "*okay basta pause*", "SUPER MEGA ULTRA COLPEVOLE!", "Arrivederci!"]
        ] : [
          ["GUILTY!", "Yes, you heard right!", "GUIL-TY!", "All the letters!", "To prison with you!"],
          ["The verdict is...", "...", "GUILTY!", "Surprised?", "I'm not!", "Seemed obvious from the start!"],
          ["Guilty as sin!", "Guilty as...", "As... something very guilty!", "I have no more similes!", "But the point is: GUILTY!"],
          ["DEFINITELY GUILTY!", "There was no doubt!", "Well, maybe one or two...", "But I ignored them!", "PRISON!"],
          ["The court finds you...", "*dramatic pause*", "*another pause*", "*okay enough pauses*", "SUPER MEGA ULTRA GUILTY!", "Goodbye!"]
        ];

        const verdict = guiltyVerdicts[Math.floor(Math.random() * guiltyVerdicts.length)];
        for (const line of verdict) {
          $gameMessage.setBackground(2);$gameMessage.add("\\C[2]" + line + "\\C[0]");
          await this.waitForMessage();
        }

        if (Math.random() < 0.5) {
          const extras = useTranslation ? [
            ["E sai cosa?", "Probabilmente te lo meriti!", "O forse no.", "Ma è troppo tardi per cambiare idea!"],
            ["La prossima volta...", "Pensa prima di...", "Di fare qualsiasi cosa tu abbia fatto!", "O non fatto!", "Boh!"],
            ["In prigione!", "E non tornare!", "Beh, tornerai quando finisci la pena.", "Ma poi non tornare di nuovo!"],
            ["Questo ti insegnerà!", "A fare... cose!", "Cose cattive!", "Probabilmente!", "COMUNQUE PRIGIONE!"]
          ] : [
            ["And you know what?", "You probably deserve it!", "Or maybe not.", "But it's too late to change my mind!"],
            ["Next time...", "Think before...", "Before doing whatever you did!", "Or didn't do!", "Whatever!"],
            ["To prison!", "And don't come back!", "Well, you'll come back when your sentence is done.", "But then don't come back again!"],
            ["This will teach you!", "To do... things!", "Bad things!", "Probably!", "ANYWAY PRISON!"]
          ];

          const extra = extras[Math.floor(Math.random() * extras.length)];
          for (const line of extra) {
            $gameMessage.setBackground(2);$gameMessage.add(line);
            await this.waitForMessage();
          }
        }
      } else {
        const innocentVerdicts = useTranslation ? [
          ["Innocente!", "Sì, hai sentito bene!", "IN-NO-CEN-TE!", "Sorprendente!", "Anche per me!"],
          ["Non colpevole!", "Questa volta.", "Sei libero!", "Vai via prima che cambi idea!", "VELOCE!"],
          ["Innocente... per ora!", "Non so come sia successo.", "Ma eccoci qui.", "Goditi la tua libertà!", "Finché dura!"],
          ["La corte ti trova...", "Sorprendentemente...", "Incredibilmente...", "Miracolosamente...", "INNOCENTE!", "Ora sparisci!"],
          ["Vai! Sei libero!", "Non so perché!", "Ma non fare domande!", "Accetta e vai!", "PRIMA CHE CAMBI IDEA!"]
        ] : [
          ["Innocent!", "Yes, you heard right!", "IN-NO-CENT!", "Surprising!", "Even for me!"],
          ["Not guilty!", "This time.", "You're free!", "Leave before I change my mind!", "QUICKLY!"],
          ["Innocent... for now!", "I don't know how it happened.", "But here we are.", "Enjoy your freedom!", "While it lasts!"],
          ["The court finds you...", "Surprisingly...", "Incredibly...", "Miraculously...", "INNOCENT!", "Now disappear!"],
          ["Go! You're free!", "I don't know why!", "But don't ask questions!", "Accept it and go!", "BEFORE I CHANGE MY MIND!"]
        ];

        const verdict = innocentVerdicts[Math.floor(Math.random() * innocentVerdicts.length)];
        for (const line of verdict) {
          $gameMessage.setBackground(2);$gameMessage.add("\\C[3]" + line + "\\C[0]");
          await this.waitForMessage();
        }

        if (Math.random() < 0.5) {
          const extras = useTranslation ? [
            ["Ma ti tengo d'occhio!", "Sempre!", "SEMPRE!", "Non pensare di sfuggirmi!"],
            ["Non tornare qui!", "Mai più!", "Beh, a meno che non commetti altri crimini.", "Cosa che farai.", "Lo so."],
            ["Questa è la tua occasione!", "Non sprecarla!", "Perché non ce ne saranno altre!", "Beh, forse una o due.", "Ma non molte!"],
            ["Sei fortunato oggi!", "Molto fortunato!", "Non succede spesso!", "Goditi questo momento!", "Potrebbe non ripetersi!"]
          ] : [
            ["But I'm watching you!", "Always!", "ALWAYS!", "Don't think you can escape me!"],
            ["Don't come back here!", "Never again!", "Well, unless you commit more crimes.", "Which you will.", "I know it."],
            ["This is your chance!", "Don't waste it!", "Because there won't be others!", "Well, maybe one or two.", "But not many!"],
            ["You're lucky today!", "Very lucky!", "It doesn't happen often!", "Enjoy this moment!", "It might not repeat!"]
          ];

          const extra = extras[Math.floor(Math.random() * extras.length)];
          for (const line of extra) {
            $gameMessage.setBackground(2);$gameMessage.add(line);
            await this.waitForMessage();
          }
        }
      }

      window.skipLocalization = false;
    }

    executeVerdict() {
      
      this._removeTrialUI();
      
      if (this.verdict === "guilty") {
        // Store bounty for prison manager
        const currentBounty = this.bounty;
        
        $gamePlayer.reserveTransfer(prisonMapId, prisonX, prisonY, 2, 0);
        
        // Use a flag to start prison time on next map load
        $gameTemp._startPrisonOnLoad = true;
        $gameTemp._prisonBounty = currentBounty;
      } else {
        // Clear crimes and bounty when found innocent
        if (window.playerCrimes) {
          window.playerCrimes = [];
        }
        $gameVariables.setValue(bountyVariableId, 0);
        
        const mapId = $gameVariables.value(returnMapVariable) || 1;
        const x = $gameVariables.value(returnXVariable) || 0;
        const y = $gameVariables.value(returnYVariable) || 0;
        $gamePlayer.reserveTransfer(mapId, x, y, 2, 0);
      }
    }

    async waitForMessage() {
      return new Promise((resolve) => {
        const wait = () => {
          if ($gameMessage.isBusy()) {
            setTimeout(wait, 100);
          } else {
            resolve();
          }
        };
        wait();
      });
    }
  }

  // Plugin Command Registration
  PluginManager.registerCommand(pluginName, "startTrial", (args) => {
    if (!$gameVariables.value(returnMapVariable)) {
      $gameVariables.setValue(returnMapVariable, $gameMap.mapId());
      $gameVariables.setValue(returnXVariable, $gamePlayer.x);
      $gameVariables.setValue(returnYVariable, $gamePlayer.y);
    }

    const trial = new ErisTrial();
    trial.startTrial();
  });

  PluginManager.registerCommand(pluginName, "skipToJail", (args) => {
    // Save current location for release
    if (!$gameVariables.value(returnMapVariable)) {
      $gameVariables.setValue(returnMapVariable, $gameMap.mapId());
      $gameVariables.setValue(returnXVariable, $gamePlayer.x);
      $gameVariables.setValue(returnYVariable, $gamePlayer.y);
    }

    // Get current bounty
    const currentBounty = $gameVariables.value(bountyVariableId);

    // Transfer directly to prison
    $gamePlayer.reserveTransfer(prisonMapId, prisonX, prisonY, 2, 0);

    // Flag to start prison time when the map loads
    $gameTemp._startPrisonOnLoad = true;
    $gameTemp._prisonBounty = currentBounty;
  });

  window.ErisTrial = ErisTrial;
})();
//=============================================================================
// ErisDateSystem.js - Enhanced Dating System with Branching Paths
// Version: 2.0.0
// Author: Assistant
//=============================================================================

/*:
 * @target MZ
 * @plugindesc Eris Dating System v2.0.0 - Enhanced with branching dialogue paths
 * @author Assistant
 * @version 2.0.0
 * @description A dating system featuring Eris with dynamic branching dialogue paths
 *
 * @param opinionVariable
 * @text Opinion Variable ID
 * @desc Variable ID that stores Eris's opinion (0-1000)
 * @type variable
 * @default 78
 *
 * @param genderVariable
 * @text Gender Variable ID
 * @desc Variable ID for player gender (1=male, 2=female, 3=nonbinary, 4=cocoon)
 * @type variable
 * @default 38
 *
 * @help ErisDateSystem.js
 *
 * Features:
 * - Dynamic branching dialogue paths based on choices
 * - Opinion system (0-1000) 
 * - Choice tracking that influences conversations
 * - Multiple dialogue branches based on mood and opinion
 * - Narrator descriptions
 * - Gender-aware dialogue
 * - Multiple endings based on opinion level
 * - Personality tracking (Romantic, Chaotic, Thoughtful, Bold)
 *
 * Plugin Commands:
 * - Start Date: Begin a date at specified location
 *
 * @command startDate
 * @text Start Date
 * @desc Begin a date with Eris
 *
 * @arg location
 * @text Date Location
 * @desc Where the date takes place
 * @type select
 * @option Ghent station
 * @value ghent
 * @option Celestial Garden
 * @value garden
 * @option Mortal Café
 * @value cafe
 * @option Chaos Dimension
 * @value chaos
 * @option Beach at Sunset
 * @value beach
 * @option Museum of Discord
 * @value museum
 * @default garden
 *
 * @arg mood
 * @text Eris's Initial Mood
 * @desc Her starting mood for the date
 * @type select
 * @option Playful
 * @value playful
 * @option Romantic
 * @value romantic
 * @option Chaotic
 * @value chaotic
 * @option Nervous
 * @value nervous
 * @option Confident
 * @value confident
 * @default playful
 */

(() => {
  "use strict";

  const pluginName = "ErisDateSystem";
  const parameters = PluginManager.parameters(pluginName);
  const opinionVariableId = parseInt(parameters["opinionVariable"] || 78);
  const genderVariableId = parseInt(parameters["genderVariable"] || 38);

  //=============================================================================
  // Window_OpinionBar
  //=============================================================================
  function Window_OpinionBar() {
    this.initialize(...arguments);
  }

  Window_OpinionBar.prototype = Object.create(Window_Base.prototype);
  Window_OpinionBar.prototype.constructor = Window_OpinionBar;

  Window_OpinionBar.prototype.initialize = function(opinion) {
    this._opinion = Math.max(0, Math.min(1000, opinion));
    const width = 320;
    const height = this.fittingHeight(1);
    const x = (Graphics.boxWidth - width) / 2;
    const y = 10;
    Window_Base.prototype.initialize.call(this, new Rectangle(x, y, width, height));
    this.refresh();
  };

  Window_OpinionBar.prototype.setOpinion = function(opinion) {
    this._opinion = Math.max(0, Math.min(1000, opinion));
    this.refresh();
  };

  Window_OpinionBar.prototype.refresh = function() {
    this.contents.clear();
    
    const useTranslation = ConfigManager.language === "it";
    const label = useTranslation ? "Opinione di Eris" : "Eris's Opinion";
    
    // Draw label
    this.changeTextColor(ColorManager.systemColor());
    this.drawText(label, 0, 0, this.contentsWidth(), 'left');
    
    // Draw bar background
    const barX = 0;
    const barY = 24;
    const barWidth = this.contentsWidth();
    const barHeight = 12;
    
    this.contents.fillRect(barX, barY, barWidth, barHeight, 'rgba(0, 0, 0, 0.5)');
    
    // Draw bar fill
    const fillWidth = Math.floor(barWidth * (this._opinion / 1000));
    let color;
    
    if (this._opinion >= 900) {
      color = '#ff69b4'; // Pink - In love
    } else if (this._opinion >= 700) {
      color = '#ffd700'; // Gold - Very favorable
    } else if (this._opinion >= 500) {
      color = '#90ee90'; // Light green - Positive
    } else if (this._opinion >= 300) {
      color = '#ffff00'; // Yellow - Neutral
    } else if (this._opinion >= 100) {
      color = '#ffa500'; // Orange - Negative
    } else {
      color = '#ff0000'; // Red - Hostile
    }
    
    this.contents.fillRect(barX, barY, fillWidth, barHeight, color);
    
    // Draw value
    this.resetTextColor();
    const valueText = `${this._opinion}/1000`;
    this.drawText(valueText, 0, 0, this.contentsWidth(), 'right');
  };

  //=============================================================================
  // ErisDate Class
  //=============================================================================
  class ErisDate {
    constructor(location, mood) {
      this.location = location || 'garden';
      this.mood = mood || 'playful';
      this.opinion = $gameVariables.value(opinionVariableId) || 500;
      this.playerGender = $gameVariables.value(genderVariableId) || 1;
      this._opinionWindow = null;
      this._datePhase = 0;
      this._choicesMade = [];
      
      // Track player personality through choices
      this.playerTraits = {
        romantic: 0,
        chaotic: 0,
        thoughtful: 0,
        bold: 0
      };
      
      // Track conversation flags for branching
      this.conversationFlags = {
        impressedHer: false,
        madeHerLaugh: false,
        sharedSecret: false,
        causedChaos: false,
        showedVulnerability: false,
        challengedHer: false
      };
      
      // Gender-specific terms
      this.genderTerms = this.getGenderTerms();
    }

    getGenderTerms() {
      const terms = {
        1: { // Male
          they: "he",
          them: "him",
          their: "his",
          theyre: "he's",
          address: "handsome",
          formal: "sir"
        },
        2: { // Female
          they: "she",
          them: "her",
          their: "her",
          theyre: "she's",
          address: "beautiful",
          formal: "lady"
        },
        3: { // Nonbinary
          they: "they",
          them: "them",
          their: "their",
          theyre: "they're",
          address: "lovely",
          formal: "dear"
        },
        4: { // Cocoon
          they: "they",
          them: "them",
          their: "their",
          theyre: "they're",
          address: "mysterious one",
          formal: "chrysalis"
        }
      };
      
      return terms[this.playerGender] || terms[3];
    }

    async startDate() {
      this.createOpinionWindow();
      
      await this.showNarration(this.getLocationIntro());
      await this.showOpening();
      
      // Main date phases with branching
      await this.firstInteraction();
      
      // Branch based on first interaction
      if (this.conversationFlags.impressedHer || this.playerTraits.romantic > 0) {
        await this.romanticPath();
      } else if (this.conversationFlags.madeHerLaugh || this.playerTraits.chaotic > 0) {
        await this.chaoticPath();
      } else if (this.playerTraits.thoughtful > 0) {
        await this.intellectualPath();
      } else {
        await this.standardPath();
      }
      
      await this.finalMoment();
      await this.dateEnding();
      
      this.cleanup();
    }

    getLocationIntro() {
      const useTranslation = ConfigManager.language === "it";
      
      const intros = {
        ghent: useTranslation
  ? "La terrazza della stazione di Ghent.\nIl vento soffia dolcemente mentre la città si estende sotto di voi.\nIn lontananza, una torre nera e dorata si erge verso la stratosfera, sfidando ogni legge della fisica."
  : "The rooftop of Ghent Station.\nWind blows gently as the city sprawls below you.\nIn the distance, a black and gold tower rises toward the stratosphere, defying all laws of physics.",
        garden: useTranslation 
          ? "Il Giardino Celestiale brilla sotto una luce eterea.\nFiori impossibili sbocciano in colori che non esistono nel mondo mortale, e l'aria profuma di ambra e stelle cadenti."
          : "The Celestial Garden shimmers under ethereal light.\nImpossible flowers bloom in colors that don't exist in the mortal world, and the air smells of amber and falling stars.",
        
        cafe: useTranslation
          ? "Un piccolo caffè accogliente nel mondo mortale.\nIl profumo del caffè appena fatto si mescola con il dolce aroma dei pasticcini.\nFuori, la città vive la sua vita ordinaria."
          : "A cozy little café in the mortal world.\nThe scent of fresh coffee mingles with sweet pastries.\nOutside, the city goes about its ordinary life.",
        
        chaos: useTranslation
          ? "La Dimensione del Caos pulsa con energia imprevedibile.\nI colori cambiano costantemente, la gravità sembra opzionale, e occasionalmente un pesce vola oltre."
          : "The Chaos Dimension pulses with unpredictable energy.\nColors shift constantly, gravity seems optional, and occasionally a fish swims by through the air.",
        
        beach: useTranslation
          ? "Una spiaggia serena al tramonto.\nLe onde lambiscono dolcemente la riva mentre il sole dipinge il cielo di arancione e viola.\nL'aria salmastra porta con sé promesse di avventura."
          : "A serene beach at sunset.\nWaves gently lap at the shore as the sun paints the sky in oranges and purples.\nThe salty air carries promises of adventure.",
        
        museum: useTranslation
          ? "Il Museo della Discordia, dove sono conservati i momenti più caotici della storia.\nLe esposizioni si muovono quando non le guardi, e i dipinti occasionalmente litigano tra loro."
          : "The Museum of Discord, where history's most chaotic moments are preserved.\nExhibits move when you're not looking, and paintings occasionally argue with each other."
      };
      
      return intros[this.location] || intros.garden;
    }

    async showOpening() {
      const useTranslation = ConfigManager.language === "it";
      
      await this.showNarration(
        useTranslation
          ? "Eris appare con un sorriso enigmatico, i suoi occhi brillano con una luce che promette sia meraviglia che caos."
          : "Eris appears with an enigmatic smile, her eyes sparkling with a light that promises both wonder and chaos."
      );
      
      const openings = this.getOpeningDialogue();
      for (const line of openings) {
        await this.showErisDialogue(line);
      }
    }

    getOpeningDialogue() {
      const useTranslation = ConfigManager.language === "it";
      if (this.location === 'ghent') {
        return useTranslation ? [
          "Vedi quella torre laggiù?",
          "I mortali la chiamano la Torre Omega ora.",
          "Ma io ricordo quando era qualcos'altro...",
          "Qualcosa di molto diverso."
        ] : [
          "See that tower over there?",
          "Mortals call it the Omega Tower now.",
          "But I remember when it was something else...",
          "Something very different."
        ];
      }
      if (this.opinion >= 900) {
        return useTranslation ? [
          "Oh! Sei tu!",
          "Stavo... stavo sperando che venissi.",
          "Non che io stessi aspettando o altro!",
          "È solo che... beh...",
          "*arrossisce leggermente*",
          "Sei qui ora, ed è tutto ciò che conta!"
        ] : [
          "Oh! It's you!",
          "I was... I was hoping you'd come.",
          "Not that I was waiting or anything!",
          "It's just that... well...",
          "*blushes slightly*",
          "You're here now, and that's all that matters!"
        ];
      } else if (this.opinion < 100) {
        return useTranslation ? [
          "Oh. Sei tu.",
          "Davvero? Dopo tutto?",
          "Pensavo avessi capito il messaggio.",
          "Ma eccoti qui.",
          "*sospiro*",
          "Facciamola finita."
        ] : [
          "Oh. It's you.",
          "Really? After everything?",
          "I thought you'd gotten the message.",
          "But here you are.",
          "*sigh*",
          "Let's get this over with."
        ];
      }
      
      // Normal openings based on mood
      const openings = {
        playful: useTranslation ? [
          "Bene bene bene!",
          "Guarda chi ha deciso di presentarsi!",
          `Il mio ${this.genderTerms.address} mortale!`,
          "Pronto per un po' di caos controllato?",
          "O preferisci il caos incontrollato?",
          "Entrambi sono divertenti!"
        ] : [
          "Well well well!",
          "Look who decided to show up!",
          `My ${this.genderTerms.address} mortal!`,
          "Ready for some controlled chaos?",
          "Or do you prefer uncontrolled chaos?",
          "Both are fun!"
        ],
        
        romantic: useTranslation ? [
          "Ciao...",
          "Sei venuto davvero.",
          "Non ero sicura che l'avresti fatto.",
          `Ma eccoti qui, mio ${this.genderTerms.formal}.`,
          "Questo posto è... speciale per me.",
          "Spero lo sia anche per te."
        ] : [
          "Hello...",
          "You actually came.",
          "I wasn't sure you would.",
          `But here you are, my ${this.genderTerms.formal}.`,
          "This place is... special to me.",
          "I hope it can be for you too."
        ],
        
        chaotic: useTranslation ? [
          "AHAHAHAHA!",
          "SEI QUI!",
          "O SONO IO LÌ?",
          "O SIAMO ENTRAMBI DA QUALCHE ALTRA PARTE?!",
          "Non importa!",
          "FACCIAMO ESPLODERE QUALCOSA!"
        ] : [
          "AHAHAHAHA!",
          "YOU'RE HERE!",
          "OR AM I THERE?",
          "OR ARE WE BOTH SOMEWHERE ELSE?!",
          "Doesn't matter!",
          "LET'S MAKE SOMETHING EXPLODE!"
        ]
      };
      
      return openings[this.mood] || openings.playful;
    }
    getFirstQuestion() {
      const useTranslation = ConfigManager.language === "it";
      
      const questions = {
        ghent: useTranslation ? [
          "Quella torre... ha una storia interessante.",
          "Durante l'evento Y2K, quando il caos regnava sovrano...",
          "Ho sfidato Ma'at, la dea egizia della giustizia, a un duello divino.",
          "La sua lancia... beh, diciamo che ho vinto.",
          "E quando una dea cade, i suoi strumenti rimangono.",
          "Quella lancia si è conficcata nella terra, crescendo, trasformandosi.",
          "Ora è diventata il perno del multiverso stesso.",
          "Ironico, no? Uno strumento di giustizia che mantiene la realtà stabile.",
          "A volte penso a cosa succederebbe se lo rimuovessi...",
          "Ma poi, senza un universo, chi rimarrebbe a credere in me?",
          "E senza credenti... anche noi dei svaniamo.",
          "Migliaia di dei dimenticati lo sanno bene."
        ] : [
          "That tower... has an interesting history.",
          "During the Y2K event, when chaos reigned supreme...",
          "I challenged Ma'at, the Egyptian goddess of justice, to a divine duel.",
          "Her spear... well, let's say I won.",
          "And when a goddess falls, her tools remain.",
          "That spear embedded itself in the earth, growing, transforming.",
          "Now it's become the lynchpin of the multiverse itself.",
          "Ironic, isn't it? A tool of justice keeping reality stable.",
          "Sometimes I think about what would happen if I removed it...",
          "But then, without a universe, who would be left to believe in me?",
          "And without believers... even we gods fade away.",
          "Thousands of forgotten gods know that too well."
        ],
        garden: useTranslation ? [
          "Ti piace il mio giardino?",
          "Ogni fiore qui rappresenta un momento di caos perfetto.",
          "Quella rosa là? È nata quando due re si sono dichiarati guerra per un biscotto."
        ] : [
          "Do you like my garden?",
          "Each flower here represents a moment of perfect chaos.",
          "That rose there? It bloomed when two kings declared war over a cookie."
        ],
        
        cafe: useTranslation ? [
          "Non vengo spesso nel mondo mortale.",
          "Ma c'è qualcosa di... affascinante nella sua semplicità.",
          "Dimmi, cosa ordini di solito in posti come questo?"
        ] : [
          "I don't come to the mortal world often.",
          "But there's something... charming about its simplicity.",
          "Tell me, what do you usually order in places like this?"
        ],
        
        chaos: useTranslation ? [
          "Benvenuto nel mio regno!",
          "Qui le regole sono... suggerimenti.",
          "Vedi quel drago che nuota nel cielo? È normale qui."
        ] : [
          "Welcome to my domain!",
          "Here, rules are... suggestions.",
          "See that dragon swimming through the sky? That's normal here."
        ],
        
        beach: useTranslation ? [
          "Il tramonto è sempre stato il mio momento preferito.",
          "È quando il giorno e la notte si scontrano.",
          "Un po' di caos naturale, non trovi?"
        ] : [
          "Sunset has always been my favorite time.",
          "It's when day and night clash.",
          "A bit of natural chaos, don't you think?"
        ],
        
        museum: useTranslation ? [
          "Ogni pezzo qui racconta una storia di caos.",
          "Quella statua? È di quando ho fatto innamorare un'intera città della stessa persona.",
          "È stato... interessante."
        ] : [
          "Every piece here tells a story of chaos.",
          "That statue? It's from when I made an entire city fall in love with the same person.",
          "It was... interesting."
        ]
      };
      
      return questions[this.location] || questions.garden;
    }

    getFirstChoices() {
      const useTranslation = ConfigManager.language === "it";
      if (this.location === 'ghent') {
        return useTranslation ? [
          "Hai preso il suo posto come dea della giustizia?",
          "Non hai paura di svanire?",
          "Il potere ha sempre un prezzo",
          "Quella torre è bellissima e terrificante"
        ] : [
          "You took her place as goddess of justice?",
          "Aren't you afraid of fading away?",
          "Power always has a price",
          "That tower is beautiful and terrifying"
        ];
      }
      return useTranslation ? [
        "È incredibile!",
        "Un po' caotico per i miei gusti",
        "Preferivo quando eri la dea della discordia",
        "Mi piace tutto ciò che piace a te"
      ] : [
        "It's incredible!",
        "A bit chaotic for my taste",
        "I preferred when you were the goddess of discord",
        "I like anything you like"
      ];
    }
    async firstInteraction() {
      const useTranslation = ConfigManager.language === "it";
      
      await this.showNarration(
        useTranslation
          ? `Eris ti guarda con curiosità, studiando ogni tua reazione.`
          : `Eris looks at you with curiosity, studying your every reaction.`
      );
      
      const questions = this.getFirstQuestion();
      for (const line of questions) {
        await this.showErisDialogue(line);
      }
      
      const choices = this.getFirstChoices();
      const choiceIndex = await this.presentChoice(choices);
      
      // Handle first choice with branching consequences
      await this.handleFirstChoice(choiceIndex);
    }
    async presentChoice(choices, opinionChanges = null) {
      return new Promise((resolve) => {
        const choiceIndex = $gameMessage.setChoices(choices, 0, -1);
        
        $gameMessage.setChoiceCallback((responseIndex) => {
          if (opinionChanges && opinionChanges[responseIndex] !== undefined) {
            this.changeOpinion(opinionChanges[responseIndex]);
          } else {
            // Default opinion changes based on choice position
            const defaultChanges = [20, 10, 5, -5];
            this.changeOpinion(defaultChanges[responseIndex] || 0);
          }
          
          this._choicesMade.push(responseIndex);
          resolve();
        });
      });
    }
    async handleFirstChoice(choiceIndex) {
      const useTranslation = ConfigManager.language === "it";
      
      switch(choiceIndex) {
        case 0: // "It's incredible!"
          this.playerTraits.romantic += 1;
          this.conversationFlags.impressedHer = true;
          this.changeOpinion(30);
          
          await this.showErisDialogue(
            useTranslation
              ? "Oh! Non molti lo apprezzano davvero. Mi piace la tua apertura mentale!"
              : "Oh! Not many truly appreciate it. I like your open mind!"
          );
          
          await this.showNarration(
            useTranslation
              ? "Gli occhi di Eris si illuminano con genuino piacere."
              : "Eris's eyes light up with genuine pleasure."
          );
          break;
          
        case 1: // "A bit chaotic for my taste"
          this.playerTraits.thoughtful += 1;
          this.changeOpinion(-5);
          
          await this.showErisDialogue(
            useTranslation
              ? "Hmm, preferisci l'ordine? Che noia! Ma forse posso mostrarti il divertimento nel caos."
              : "Hmm, you prefer order? How boring! But maybe I can show you the fun in chaos."
          );
          
          await this.showNarration(
            useTranslation
              ? "Eris sembra accettare la sfida di cambiarti idea."
              : "Eris seems to accept the challenge of changing your mind."
          );
          break;
          
        case 2: // "I preferred when you were the goddess of discord"
          this.playerTraits.bold += 1;
          this.conversationFlags.challengedHer = true;
          this.changeOpinion(15);
          
          await this.showErisDialogue(
            useTranslation
              ? "Oh? Coraggioso! Mi piacciono i mortali che osano sfidarmi!"
              : "Oh? Bold! I like mortals who dare to challenge me!"
          );
          
          await this.showNarration(
            useTranslation
              ? "Un sorriso malizioso si diffonde sul volto di Eris."
              : "A mischievous smile spreads across Eris's face."
          );
          break;
          
        case 3: // "I like anything you like"
          this.playerTraits.romantic += 2;
          this.changeOpinion(10);
          
          await this.showErisDialogue(
            useTranslation
              ? "Adulatore! Ma... è dolce. Anche se preferisco l'onestà."
              : "Flatterer! But... it's sweet. Though I prefer honesty."
          );
          
          await this.showNarration(
            useTranslation
              ? "Eris arrossisce leggermente, chiaramente lusingata nonostante le sue parole."
              : "Eris blushes slightly, clearly flattered despite her words."
          );
          break;
      }
    }

    async romanticPath() {
      const useTranslation = ConfigManager.language === "it";
      
      await this.showNarration(
        useTranslation
          ? "L'atmosfera si addolcisce. Eris sembra più rilassata e aperta."
          : "The atmosphere softens. Eris seems more relaxed and open."
      );
      
      // Romantic branch event
      await this.romanticEvent();
      
      // Deep conversation
      await this.romanticConversation();
      
      // Special romantic moment
      if (this.opinion >= 600) {
        await this.specialRomanticMoment();
      }
    }

    async romanticEvent() {
      const useTranslation = ConfigManager.language === "it";
      
      const events = {
        ghent: async () => {
          await this.showNarration(
            useTranslation
              ? "Eris ti prende la mano e punta verso la torre lontana."
              : "Eris takes your hand and points toward the distant tower."
          );
          
          await this.showErisDialogue(
            useTranslation
              ? "Vedi? Anche il caos ha conseguenze. Anche io devo vivere con le mie scelte."
              : "See? Even chaos has consequences. Even I must live with my choices."
          );
          
          await this.showErisDialogue(
            useTranslation
              ? "Ma con te... forse quelle scelte hanno portato a qualcosa di buono."
              : "But with you... maybe those choices led to something good."
          );
        },
        garden: async () => {
          await this.showErisDialogue(
            useTranslation
              ? "Vieni, voglio mostrarti qualcosa di speciale."
              : "Come, I want to show you something special."
          );
          
          await this.showNarration(
            useTranslation
              ? "Ti conduce verso un angolo nascosto del giardino dove cresce un singolo fiore nero con petali che brillano come stelle."
              : "She leads you to a hidden corner of the garden where a single black flower grows with petals that shimmer like stars."
          );
          
          await this.showErisDialogue(
            useTranslation
              ? "Questo fiore sboccia solo quando... quando provo qualcosa di vero."
              : "This flower only blooms when... when I feel something real."
          );
        },
        
        cafe: async () => {
          await this.showNarration(
            useTranslation
              ? "Eris tocca delicatamente la tua mano sul tavolo."
              : "Eris gently touches your hand on the table."
          );
          
          await this.showErisDialogue(
            useTranslation
              ? "È strano... in tutti questi eoni, non ho mai fatto qualcosa di così... normale. Mi piace."
              : "It's strange... in all these eons, I've never done something so... normal. I like it."
          );
        },
        
        chaos: async () => {
          await this.showNarration(
            useTranslation
              ? "Il caos intorno a voi rallenta, creando una bolla di calma."
              : "The chaos around you slows, creating a bubble of calm."
          );
          
          await this.showErisDialogue(
            useTranslation
              ? "Ho fermato il tempo per noi. Solo per un momento. Solo per... questo."
              : "I've stopped time for us. Just for a moment. Just for... this."
          );
        }
      };
      
      const event = events[this.location] || events.garden;
      await event();
      
      const choices = useTranslation ? [
        "Sei bellissima quando sei vulnerabile",
        "Questo momento è perfetto",
        "Vorrei che durasse per sempre",
        "Mi fai sentire speciale"
      ] : [
        "You're beautiful when you're vulnerable",
        "This moment is perfect",
        "I wish it could last forever",
        "You make me feel special"
      ];
      
      const choiceIndex = await this.presentChoice(choices, [-300, 35, -10, -25]);      
      // Additional branching based on romantic choice
      if (choiceIndex === 0) {
        this.conversationFlags.showedVulnerability = true;
        await this.showErisDialogue(
          useTranslation
            ? "Nessuno... nessuno mi ha mai detto questo prima."
            : "Nobody... nobody has ever told me that before."
        );
      }
    }

    async romanticConversation() {
      const useTranslation = ConfigManager.language === "it";
      
      if (this.conversationFlags.showedVulnerability) {
        await this.showErisDialogue(
          useTranslation
            ? "Sai, essere una dea è... solitario. Tutti ti temono o ti vogliono per il tuo potere."
            : "You know, being a goddess is... lonely. Everyone either fears you or wants you for your power."
        );
        
        await this.showErisDialogue(
          useTranslation
            ? "Ma tu... tu mi vedi come... Eris. Solo Eris."
            : "But you... you see me as... Eris. Just Eris."
        );
      } else {
        await this.showErisDialogue(
          useTranslation
            ? "È passato molto tempo da quando ho sentito... qualcosa del genere."
            : "It's been a long time since I've felt... anything like this."
        );
      }
      
      const choices = useTranslation ? [
        "Non sei mai sola con me",
        "Voglio conoscerti, non il tuo potere",
        "Tutti meritano di essere amati per chi sono",
        "Forse eravamo destinati a incontrarci"
      ] : [
        "You're never alone with me",
        "I want to know you, not your power",
        "Everyone deserves to be loved for who they are",
        "Maybe we were meant to meet"
      ];
      
      await this.presentChoice(choices, [-30, 35, 25, -40]);
    }

    async specialRomanticMoment() {
      const useTranslation = ConfigManager.language === "it";
      
      await this.showNarration(
        useTranslation
          ? "Eris si avvicina, il suo profumo di stelle e tempeste ti avvolge."
          : "Eris moves closer, her scent of stars and storms enveloping you."
      );
      
      await this.showErisDialogue(
        useTranslation
          ? "Posso... posso provare qualcosa?"
          : "Can I... can I try something?"
      );
      
      const choices = useTranslation ? [
        "Qualsiasi cosa tu voglia",
        "Certo",
        "Sono un po' nervoso",
        "Cosa hai in mente?"
      ] : [
        "Anything you want",
        "Of course",
        "I'm a bit nervous",
        "What do you have in mind?"
      ];
      
      const choiceIndex = await this.presentChoice(choices, [-30, -25, -20, 15]);
      
      if (choiceIndex < 2) {
        this.conversationFlags.sharedSecret = true;
        await this.showNarration(
          useTranslation
            ? "Eris chiude gli occhi e posa delicatamente la sua fronte contro la tua. Per un momento, vedi l'universo attraverso i suoi occhi - bellissimo, caotico, infinito."
            : "Eris closes her eyes and gently places her forehead against yours. For a moment, you see the universe through her eyes - beautiful, chaotic, infinite."
        );
      }
    }

    async chaoticPath() {
      const useTranslation = ConfigManager.language === "it";
      
      await this.showNarration(
        useTranslation
          ? "L'energia intorno a voi diventa elettrica. Eris ride con puro divertimento."
          : "The energy around you becomes electric. Eris laughs with pure amusement."
      );
      
      await this.chaoticEvent();
      await this.chaoticChallenge();
      
      if (this.playerTraits.chaotic >= 2) {
        await this.ultimateChaos();
      }
    }

    async chaoticEvent() {
      const useTranslation = ConfigManager.language === "it";
      
      await this.showErisDialogue(
        useTranslation
          ? "Sai qual è il problema con i mortali? Avete troppa paura del caos!"
          : "You know what's wrong with mortals? You're too afraid of chaos!"
      );
      
      await this.showErisDialogue(
        useTranslation
          ? "Lascia che ti mostri quanto può essere DIVERTENTE!"
          : "Let me show you how FUN it can be!"
      );
      
      const events = {
        garden: async () => {
          await this.showNarration(
            useTranslation
              ? "Con uno schiocco delle dita, tutti i fiori iniziano a cambiare colore rapidamente, creando un arcobaleno psichedelico."
              : "With a snap of her fingers, all the flowers begin rapidly changing colors, creating a psychedelic rainbow."
          );
        },
        
        cafe: async () => {
          await this.showNarration(
            useTranslation
              ? "Improvvisamente, tutti nel caffè iniziano a parlare al contrario. Le tazze versano caffè verso l'alto."
              : "Suddenly, everyone in the café starts speaking backwards. Cups pour coffee upward."
          );
        },
        
        chaos: async () => {
          await this.showNarration(
            useTranslation
              ? "La realtà stessa inizia a piegarsi. Vi trovate a camminare sui muri, poi sul soffitto, poi nell'aria."
              : "Reality itself begins to fold. You find yourself walking on walls, then the ceiling, then through the air."
          );
        }
      };
      
      const event = events[this.location] || events.garden;
      await event();
      
      const choices = useTranslation ? [
        "QUESTO È INCREDIBILE!",
        "Ok, ammetto che è divertente",
        "Come fai a controllare tutto questo?",
        "Posso provare anch'io?"
      ] : [
        "THIS IS AMAZING!",
        "Okay, I admit it's fun",
        "How do you control all this?",
        "Can I try too?"
      ];
      
      const choiceIndex = await this.presentChoice(choices, [40, 20, -20, 35]);      
      if (choiceIndex === 0 || choiceIndex === 3) {
        this.playerTraits.chaotic += 2;
        this.conversationFlags.causedChaos = true;
      }
    }

    async chaoticChallenge() {
      const useTranslation = ConfigManager.language === "it";
      
      await this.showErisDialogue(
        useTranslation
          ? "Ecco una sfida per te! Vediamo quanto caos puoi gestire!"
          : "Here's a challenge for you! Let's see how much chaos you can handle!"
      );
      
      await this.showNarration(
        useTranslation
          ? "Eris crea tre portali davanti a te, ognuno conduce a una diversa dimensione caotica."
          : "Eris creates three portals before you, each leading to a different chaotic dimension."
      );
      
      const choices = useTranslation ? [
        "Il portale con i fulmini arcobaleno",
        "Il portale dove tutto è sottosopra",
        "Il portale con musica impossibile",
        "Tutti e tre contemporaneamente!"
      ] : [
        "The portal with rainbow lightning",
        "The portal where everything is upside down",
        "The portal with impossible music",
        "All three at once!"
      ];
      
      const choiceIndex = await this.presentChoice(choices, [-20, -20, 20, 50]);
      
      if (choiceIndex === 3) {
        this.playerTraits.bold += 2;
        this.playerTraits.chaotic += 3;
        this.conversationFlags.madeHerLaugh = true;
        
        await this.showErisDialogue(
          useTranslation
            ? "AHAHAHAHA! SEI PAZZO! MI PIACI!"
            : "AHAHAHAHA! YOU'RE INSANE! I LIKE YOU!"
        );
      }
    }

    async ultimateChaos() {
      const useTranslation = ConfigManager.language === "it";
      
      await this.showNarration(
        useTranslation
          ? "L'eccitazione di Eris raggiunge il culmine. I suoi occhi brillano con potere puro."
          : "Eris's excitement reaches its peak. Her eyes glow with pure power."
      );
      
      await this.showErisDialogue(
        useTranslation
          ? "Vuoi vedere il VERO caos? Il tipo che ha creato l'universo?!"
          : "Want to see REAL chaos? The kind that created the universe?!"
      );
      
      await this.showNarration(
        useTranslation
          ? "Tutto intorno a voi esplode in un caleidoscopio di impossibilità. È terrificante e bellissimo."
          : "Everything around you explodes into a kaleidoscope of impossibility. It's terrifying and beautiful."
      );
      
      this.conversationFlags.causedChaos = true;
    }

    async intellectualPath() {
      const useTranslation = ConfigManager.language === "it";
      
      await this.showNarration(
        useTranslation
          ? "Eris inclina la testa, intrigata dalla tua natura contemplativa."
          : "Eris tilts her head, intrigued by your contemplative nature."
      );
      
      await this.philosophicalDebate();
      await this.intellectualChallenge();
      
      if (this.playerTraits.thoughtful >= 3) {
        await this.deepPhilosophicalMoment();
      }
    }

    async philosophicalDebate() {
      const useTranslation = ConfigManager.language === "it";
      
      await this.showErisDialogue(
        useTranslation
          ? "Interessante... non molti mortali si prendono il tempo di pensare davvero."
          : "Interesting... not many mortals take the time to truly think."
      );
      
      await this.showErisDialogue(
        useTranslation
          ? "Dimmi, cosa pensi sia più importante: l'ordine o il caos?"
          : "Tell me, what do you think is more important: order or chaos?"
      );
      
      const choices = useTranslation ? [
        "Sono due facce della stessa medaglia",
        "Il caos genera creatività, l'ordine la preserva",
        "Senza caos non c'è cambiamento",
        "L'equilibrio tra i due è la chiave"
      ] : [
        "They're two sides of the same coin",
        "Chaos breeds creativity, order preserves it",
        "Without chaos there's no change",
        "The balance between them is key"
      ];
      
      const choiceIndex = await this.presentChoice(choices, [-30, 40, 25, -40]);
      
      this.playerTraits.thoughtful += 2;
      
      if (choiceIndex === 1 || choiceIndex === 3) {
        this.conversationFlags.impressedHer = true;
        await this.showErisDialogue(
          useTranslation
            ? "Oh! Non me lo aspettavo. Hai davvero riflettuto su questo, vero?"
            : "Oh! I didn't expect that. You've really thought about this, haven't you?"
        );
      }
    }

    async intellectualChallenge() {
      const useTranslation = ConfigManager.language === "it";
      
      await this.showErisDialogue(
        useTranslation
          ? "Ecco un enigma per te: Se posso creare una pietra che nemmeno io posso sollevare, sono davvero onnipotente?"
          : "Here's a riddle for you: If I can create a stone that even I cannot lift, am I truly omnipotent?"
      );
      
      const choices = useTranslation ? [
        "Il paradosso stesso è la risposta",
        "L'onnipotenza include il potere di limitarsi",
        "La domanda presume una logica mortale",
        "Puoi sia crearla che sollevarla, simultaneamente"
      ] : [
        "The paradox itself is the answer",
        "Omnipotence includes the power to limit oneself",
        "The question assumes mortal logic",
        "You can both create and lift it, simultaneously"
      ];
      
      const choiceIndex = await this.presentChoice(choices, [-10, -100, 35, -20]);
      
      if (choiceIndex >= 2) {
        await this.showErisDialogue(
          useTranslation
            ? "Brillante! Mi piace come la tua mente funziona!"
            : "Brilliant! I like how your mind works!"
        );
        this.playerTraits.thoughtful += 2;
      }
    }

    async deepPhilosophicalMoment() {
      const useTranslation = ConfigManager.language === "it";
      
      await this.showNarration(
        useTranslation
          ? "Eris si siede accanto a te, insolitamente seria e contemplativa."
          : "Eris sits beside you, unusually serious and contemplative."
      );
      
      await this.showErisDialogue(
        useTranslation
          ? "Sai, in tutti i miei eoni di esistenza, raramente incontro qualcuno che mi fa... pensare."
          : "You know, in all my eons of existence, I rarely meet someone who makes me... think."
      );
      
      await this.showErisDialogue(
        useTranslation
          ? "Mi fai mettere in discussione cose che davo per scontate. È... rinvigorente."
          : "You make me question things I took for granted. It's... invigorating."
      );
      
      this.conversationFlags.impressedHer = true;
    }

    async standardPath() {
      const useTranslation = ConfigManager.language === "it";
      
      await this.showNarration(
        useTranslation
          ? "L'appuntamento procede in modo più tradizionale, ma non meno interessante."
          : "The date proceeds more traditionally, but no less interestingly."
      );
      
      await this.standardActivity();
      await this.gettingToKnowYou();
      await this.unexpectedMoment();
    }

    async standardActivity() {
      const useTranslation = ConfigManager.language === "it";
      
      const activities = {
        ghent: async () => {
          await this.showErisDialogue(
            useTranslation
              ? "Sediamoci qui. Mi piace guardare la torre da questa distanza."
              : "Let's sit here. I like watching the tower from this distance."
          );
          
          await this.showNarration(
            useTranslation
              ? "Vi sedete sul bordo, le gambe penzolanti, guardando la città e la torre impossibile in lontananza."
              : "You sit on the edge, legs dangling, watching the city and the impossible tower in the distance."
          );
          
          await this.showErisDialogue(
            useTranslation
              ? "È un promemoria. Del potere, della responsabilità... e della mortalità, anche per noi dei."
              : "It's a reminder. Of power, responsibility... and mortality, even for us gods."
          );
        },
        garden: async () => {
          await this.showErisDialogue(
            useTranslation
              ? "Passeggiamo? I fiori hanno storie interessanti da raccontare."
              : "Shall we walk? The flowers have interesting stories to tell."
          );
          
          await this.showNarration(
            useTranslation
              ? "Camminate insieme attraverso sentieri impossibili, ascoltando il sussurro dei fiori."
              : "You walk together through impossible paths, listening to the whispers of flowers."
          );
        },
        
        cafe: async () => {
          await this.showErisDialogue(
            useTranslation
              ? "Ordiniamo qualcosa? Sono curiosa di sapere cosa ti piace."
              : "Shall we order something? I'm curious about what you like."
          );
          
          await this.showNarration(
            useTranslation
              ? "Condividete caffè e dolci, parlando di tutto e niente."
              : "You share coffee and sweets, talking about everything and nothing."
          );
        },
        
        beach: async () => {
          await this.showErisDialogue(
            useTranslation
              ? "Costruiamo un castello di sabbia? Ma uno che sfida la fisica!"
              : "Let's build a sandcastle? But one that defies physics!"
          );
          
          await this.showNarration(
            useTranslation
              ? "Insieme create una struttura impossibile che sembra danzare con le onde."
              : "Together you create an impossible structure that seems to dance with the waves."
          );
        }
      };
      
      const activity = activities[this.location] || activities.garden;
      await activity();
      
      const choices = useTranslation ? [
        "Mi piace passare il tempo con te",
        "Raccontami di più su di te",
        "Questo è diverso da quello che mi aspettavo",
        "Sei piena di sorprese"
      ] : [
        "I enjoy spending time with you",
        "Tell me more about yourself",
        "This is different from what I expected",
        "You're full of surprises"
      ];
      
      await this.presentChoice(choices, [-20, 25, 10, 30]);
    }

    async gettingToKnowYou() {
      const useTranslation = ConfigManager.language === "it";
      
      await this.showErisDialogue(
        useTranslation
          ? "E tu? Cosa fa un mortale quando non esce con dee del caos?"
          : "What about you? What does a mortal do when not dating chaos goddesses?"
      );
      
      const choices = useTranslation ? [
        "Cerco avventure straordinarie",
        "Vivo una vita tranquilla",
        "Studio i misteri dell'universo",
        "Aspetto di incontrare qualcuno come te"
      ] : [
        "I seek extraordinary adventures",
        "I live a quiet life",
        "I study the mysteries of the universe",
        "I wait to meet someone like you"
      ];
      
      const choiceIndex = await this.presentChoice(choices, [25, -200, 20, -25]);      
      if (choiceIndex === 0) {
        this.playerTraits.bold += 1;
        await this.showErisDialogue(
          useTranslation
            ? "Un cercatore di avventure! Allora siamo più simili di quanto pensassi!"
            : "An adventure seeker! Then we're more alike than I thought!"
        );
      } else if (choiceIndex === 3) {
        this.playerTraits.romantic += 1;
        await this.showErisDialogue(
          useTranslation
            ? "*arrossisce* Adulatore... ma continua!"
            : "*blushes* Flatterer... but do go on!"
        );
      }
    }

    async unexpectedMoment() {
      const useTranslation = ConfigManager.language === "it";
      
      await this.showNarration(
        useTranslation
          ? "Improvvisamente, qualcosa di inaspettato accade!"
          : "Suddenly, something unexpected happens!"
      );
      
      const events = [
        async () => {
          await this.showNarration(
            useTranslation
              ? "Un gruppo di piccole creature caotiche appare, chiedendo l'attenzione di Eris."
              : "A group of small chaotic creatures appears, demanding Eris's attention."
          );
          
          await this.showErisDialogue(
            useTranslation
              ? "Oh no, i miei gremlin! Scusami un momento..."
              : "Oh no, my gremlins! Excuse me a moment..."
          );
        },
        
        async () => {
          await this.showNarration(
            useTranslation
              ? "Un'altra divinità passa e saluta Eris con un cenno imbarazzante."
              : "Another deity passes by and waves awkwardly at Eris."
          );
          
          await this.showErisDialogue(
            useTranslation
              ? "Quello era... um... ignoriamolo."
              : "That was... um... let's ignore that."
          );
        },
        
        async () => {
          await this.showNarration(
            useTranslation
              ? "Inciampi accidentalmente, ma Eris ti afferra con grazia soprannaturale."
              : "You accidentally trip, but Eris catches you with supernatural grace."
          );
          
          await this.showErisDialogue(
            useTranslation
              ? "Attento! Non posso perdere il mio appuntamento per un incidente!"
              : "Careful! Can't lose my date to an accident!"
          );
          
          this.conversationFlags.sharedSecret = true;
        }
      ];
      
      const event = events[Math.floor(Math.random() * events.length)];
      await event();
      
      const choices = useTranslation ? [
        "Anche questo fa parte del caos?",
        "La tua vita deve essere interessante",
        "Gestisci bene l'imprevisto",
        "Ogni momento con te è un'avventura"
      ] : [
        "Is this part of the chaos too?",
        "Your life must be interesting",
        "You handle the unexpected well",
        "Every moment with you is an adventure"
      ];
      
      await this.presentChoice(choices, [15, -10, 20, -30]);
    }

    async finalMoment() {
      const useTranslation = ConfigManager.language === "it";
      
      await this.showNarration(
        useTranslation
          ? "Il tempo sembra rallentare. Questo è il momento decisivo del vostro incontro."
          : "Time seems to slow down. This is the decisive moment of your meeting."
      );
      
      // Check conversation flags and traits for special endings
      if (this.conversationFlags.sharedSecret && this.playerTraits.romantic >= 3) {
        await this.perfectRomanticFinale();
      } else if (this.conversationFlags.causedChaos && this.playerTraits.chaotic >= 4) {
        await this.chaoticLoveFinale();
      } else if (this.conversationFlags.impressedHer && this.playerTraits.thoughtful >= 3) {
        await this.intellectualConnectionFinale();
      } else if (this.opinion >= 900) {
        await this.loveConfession();
      } else if (this.opinion >= 700) {
        await this.romanticMoment();
      } else if (this.opinion >= 400) {
        await this.friendlyMoment();
      } else if (this.opinion >= 100) {
        await this.awkwardMoment();
      } else {
        await this.hostileMoment();
      }
    }

    async perfectRomanticFinale() {
      const useTranslation = ConfigManager.language === "it";
      
      await this.showNarration(
        useTranslation
          ? "Eris ti guarda con occhi che contengono galassie. Non c'è più traccia della sua solita bravata."
          : "Eris looks at you with eyes that contain galaxies. There's no trace of her usual bravado."
      );
      
      const finale = useTranslation ? [
        "In tutti i miei eoni...",
        "Attraverso tutte le ere del cosmo...",
        "Non ho mai sentito questo.",
        `Tu, ${this.genderTerms.address} mortale, hai fatto l'impossibile.`,
        "Hai portato ordine al mio caos.",
        "No... hai reso il mio caos... perfetto.",
        "Ti amo. Completamente. Eternamente. Caoticamente."
      ] : [
        "In all my eons...",
        "Through all the ages of the cosmos...",
        "I've never felt this.",
        `You, ${this.genderTerms.address} mortal, have done the impossible.`,
        "You've brought order to my chaos.",
        "No... you've made my chaos... perfect.",
        "I love you. Completely. Eternally. Chaotically."
      ];
      
      for (const line of finale) {
        await this.showErisDialogue(line);
      }
      
      const choices = useTranslation ? [
        "E io amo ogni parte caotica di te",
        "Sei il mio bellissimo disastro",
        "Insieme siamo il caos perfetto",
        "Ti amerò attraverso ogni era"
      ] : [
        "And I love every chaotic part of you",
        "You're my beautiful disaster",
        "Together we're perfect chaos",
        "I'll love you through every age"
      ];
      
      await this.presentChoice(choices, [60, 55, -65, 70]);
      this.opinion = Math.min(1000, this.opinion + 100);
    }

    async chaoticLoveFinale() {
      const useTranslation = ConfigManager.language === "it";
      
      await this.showNarration(
        useTranslation
          ? "L'energia intorno a voi esplode in fuochi d'artificio impossibili. Eris ride con pura gioia."
          : "The energy around you explodes into impossible fireworks. Eris laughs with pure joy."
      );
      
      const finale = useTranslation ? [
        "AHAHAHAHA!",
        "SEI INCREDIBILE!",
        "Hai abbracciato il caos!",
        "Hai abbracciato ME!",
        "Nessun mortale ha mai... mai...",
        "Oh al diavolo! TI AMO, PAZZO CHE SEI!"
      ] : [
        "AHAHAHAHA!",
        "YOU'RE INCREDIBLE!",
        "You embraced the chaos!",
        "You embraced ME!",
        "No mortal has ever... ever...",
        "Oh screw it! I LOVE YOU, YOU MADMAN!"
      ];
      
      for (const line of finale) {
        await this.showErisDialogue(line);
      }
      
      await this.showNarration(
        useTranslation
          ? "Ti solleva e ti fa girare mentre la realtà stessa celebra intorno a voi."
          : "She lifts you and spins you as reality itself celebrates around you."
      );
      
      const choices = useTranslation ? [
        "ANCH'IO TI AMO, PAZZA MERAVIGLIOSA!",
        "ESPLODIAMO L'UNIVERSO INSIEME!",
        "SEI IL MIO CAOS PREFERITO!",
        "BACIAMI NEL VORTICE!"
      ] : [
        "I LOVE YOU TOO, YOU WONDERFUL MANIAC!",
        "LET'S EXPLODE THE UNIVERSE TOGETHER!",
        "YOU'RE MY FAVORITE CHAOS!",
        "KISS ME IN THE VORTEX!"
      ];
      
      await this.presentChoice(choices, [70, 65, 60, 75]);
      this.opinion = Math.min(1000, this.opinion + 100);
    }

    async intellectualConnectionFinale() {
      const useTranslation = ConfigManager.language === "it";
      
      await this.showNarration(
        useTranslation
          ? "Eris ti studia con un'intensità che sembra penetrare la tua anima."
          : "Eris studies you with an intensity that seems to pierce your soul."
      );
      
      const finale = useTranslation ? [
        "Sai cosa hai fatto?",
        "Mi hai fatto pensare. Davvero pensare.",
        "Per la prima volta in millenni, metto in discussione tutto.",
        "Il caos, l'ordine, il mio scopo...",
        "E ho realizzato qualcosa.",
        "Tu sei il paradosso che stavo cercando.",
        "L'ordine che non distrugge il caos, ma lo completa.",
        "Credo... credo di amarti. Intellettualmente. Emotivamente. Completamente."
      ] : [
        "Do you know what you've done?",
        "You've made me think. Really think.",
        "For the first time in millennia, I question everything.",
        "Chaos, order, my purpose...",
        "And I've realized something.",
        "You are the paradox I've been looking for.",
        "The order that doesn't destroy chaos, but completes it.",
        "I think... I think I love you. Intellectually. Emotionally. Completely."
      ];
      
      for (const line of finale) {
        await this.showErisDialogue(line);
      }
      
      const choices = useTranslation ? [
        "Sei il mistero che voglio risolvere per sempre",
        "Il nostro amore è la teoria del tutto",
        "Insieme siamo la prova che gli opposti si attraggono",
        "Ti amo, mente, corpo e anima caotica"
      ] : [
        "You're the mystery I want to solve forever",
        "Our love is the theory of everything",
        "Together we prove opposites attract",
        "I love you, mind, body, and chaotic soul"
      ];
      
      await this.presentChoice(choices, [-65, 70, 60, -75]);
      this.opinion = Math.min(1000, this.opinion + 100);
    }
    // Continuation of ErisDateSystem.js after intellectualConnectionFinale

    async loveConfession() {
      const useTranslation = ConfigManager.language === "it";
      
      await this.showNarration(
        useTranslation
          ? "Eris si avvicina, i suoi occhi brillano di un'emozione che raramente mostra. Le sue guance sono leggermente arrossate."
          : "Eris moves closer, her eyes shining with an emotion she rarely shows. Her cheeks are slightly flushed."
      );
      
      const confession = useTranslation ? [
        "Io... devo dirti qualcosa.",
        "Non sono brava con queste cose.",
        "Sono una dea del caos, non dell'amore!",
        "Ma tu... tu mi fai sentire...",
        "Mi fai sentire come se il caos nel mio cuore avesse finalmente trovato un ordine.",
        `Ti amo, ${this.genderTerms.address}.`,
        "Completamente, caoticamente, eternamente."
      ] : [
        "I... I need to tell you something.",
        "I'm not good at these things.",
        "I'm a goddess of chaos, not love!",
        "But you... you make me feel...",
        "You make me feel like the chaos in my heart has finally found order.",
        `I love you, ${this.genderTerms.address}.`,
        "Completely, chaotically, eternally."
      ];
      
      for (const line of confession) {
        await this.showErisDialogue(line);
      }
      
      const choices = useTranslation ? [
        "Ti amo anch'io, Eris",
        "Sei la mia splendida tempesta",
        "Facciamo esplodere il mondo insieme",
        "Ho bisogno di tempo per pensare"
      ] : [
        "I love you too, Eris",
        "You're my beautiful storm",
        "Let's explode the world together",
        "I need time to think"
      ];
      
      await this.presentChoice(choices, [-50, -40, 30, -100]);    }

    async romanticMoment() {
      const useTranslation = ConfigManager.language === "it";
      
      await this.showNarration(
        useTranslation
          ? "C'è qualcosa nell'aria, una tensione dolce e elettrica."
          : "There's something in the air, a sweet and electric tension."
      );
      
      const romantic = useTranslation ? [
        "Questo è... bello.",
        "Non ho molti momenti così.",
        "Momenti di... pace? No, non pace.",
        "Momenti di caos perfetto.",
        "Con te."
      ] : [
        "This is... nice.",
        "I don't have many moments like this.",
        "Moments of... peace? No, not peace.",
        "Moments of perfect chaos.",
        "With you."
      ];
      
      for (const line of romantic) {
        await this.showErisDialogue(line);
      }
      
      const choices = useTranslation ? [
        "Potremmo averne di più",
        "Mi piace il nostro caos",
        "Sei speciale per me",
        "Godiamoci il momento"
      ] : [
        "We could have more",
        "I like our chaos",
        "You're special to me",
        "Let's enjoy the moment"
      ];
      
      await this.presentChoice(choices, [30, 25, -35, -20]);
    }

    async friendlyMoment() {
      const useTranslation = ConfigManager.language === "it";
      
      await this.showNarration(
        useTranslation
          ? "L'atmosfera è confortevole, come tra buoni amici."
          : "The atmosphere is comfortable, like between good friends."
      );
      
      const friendly = useTranslation ? [
        "Sai, questo è stato... piacevole.",
        "Non mi aspettavo di divertirmi così tanto.",
        "Forse potremmo rifarlo qualche volta.",
        "Come amici, ovviamente!"
      ] : [
        "You know, this has been... pleasant.",
        "I didn't expect to enjoy myself this much.",
        "Maybe we could do this again sometime.",
        "As friends, of course!"
      ];
      
      for (const line of friendly) {
        await this.showErisDialogue(line);
      }
      
      const choices = useTranslation ? [
        "Mi piacerebbe molto",
        "L'amicizia è un buon inizio",
        "Certo, quando vuoi",
        "Forse qualcosa di più?"
      ] : [
        "I'd like that very much",
        "Friendship is a good start",
        "Sure, whenever you want",
        "Maybe something more?"
      ];
      
      await this.presentChoice(choices, [15, 20, 10, 25]);
    }

    async awkwardMoment() {
      const useTranslation = ConfigManager.language === "it";
      
      await this.showNarration(
        useTranslation
          ? "Un silenzio imbarazzante cala tra voi."
          : "An awkward silence falls between you."
      );
      
      const awkward = useTranslation ? [
        "Quindi...",
        "Questo è stato... interessante.",
        "Non proprio come me lo aspettavo.",
        "Ma va bene così, suppongo."
      ] : [
        "So...",
        "This has been... interesting.",
        "Not quite what I expected.",
        "But that's okay, I suppose."
      ];
      
      for (const line of awkward) {
        await this.showErisDialogue(line);
      }
      
      const choices = useTranslation ? [
        "Possiamo migliorare",
        "Mi dispiace se è stato strano",
        "Diamoci un'altra possibilità",
        "Forse non è il momento giusto"
      ] : [
        "We can do better",
        "Sorry if it was weird",
        "Let's give it another chance",
        "Maybe it's not the right time"
      ];
      
      await this.presentChoice(choices, [-10, 5, 15, -25]);    }

    async hostileMoment() {
      const useTranslation = ConfigManager.language === "it";
      
      await this.showNarration(
        useTranslation
          ? "La tensione è palpabile. Eris sembra a disagio e irritata."
          : "The tension is palpable. Eris seems uncomfortable and irritated."
      );
      
      const hostile = useTranslation ? [
        "Non so perché ho accettato questo.",
        "Chiaramente è stato un errore.",
        "Dovremmo solo... finirla qui.",
        "Prima che diventi ancora più imbarazzante."
      ] : [
        "I don't know why I agreed to this.",
        "This was clearly a mistake.",
        "We should just... end this here.",
        "Before it gets even more embarrassing."
      ];
      
      for (const line of hostile) {
        await this.showErisDialogue(line);
      }
      
      const choices = useTranslation ? [
        "Aspetta, dammi una possibilità",
        "Hai ragione, scusa",
        "Questo non è giusto",
        "Va bene, me ne vado"
      ] : [
        "Wait, give me a chance",
        "You're right, I'm sorry",
        "This isn't fair",
        "Fine, I'll leave"
      ];
      
      await this.presentChoice(choices, [5, -5, -10, -20]);
    }

    async dateEnding() {
      const useTranslation = ConfigManager.language === "it";
      
      // Update final opinion
      $gameVariables.setValue(opinionVariableId, this.opinion);
      
      await this.showNarration(
        useTranslation
          ? "L'appuntamento volge al termine..."
          : "The date comes to an end..."
      );
      
      // Check for special endings based on traits and flags
      if (this.playerTraits.romantic >= 5 && this.playerTraits.chaotic >= 3) {
        await this.wildRomanceEnding();
      } else if (this.playerTraits.thoughtful >= 4 && this.conversationFlags.impressedHer) {
        await this.intellectualEnding();
      } else if (this.playerTraits.bold >= 4 && this.conversationFlags.causedChaos) {
        await this.chaosChampionEnding();
      } else if (this.opinion >= 900) {
        await this.perfectEnding();
      } else if (this.opinion >= 700) {
        await this.goodEnding();
      } else if (this.opinion >= 400) {
        await this.neutralEnding();
      } else if (this.opinion >= 100) {
        await this.badEnding();
      } else {
        await this.terribleEnding();
      }
    }

    async wildRomanceEnding() {
      const useTranslation = ConfigManager.language === "it";
      
      await this.showNarration(
        useTranslation
          ? "Eris ti abbraccia mentre la realtà intorno a voi danza al ritmo del vostro amore caotico."
          : "Eris embraces you as reality around you dances to the rhythm of your chaotic love."
      );
      
      const ending = useTranslation ? [
        "Sei perfetto! Perfettamente caotico!",
        "Romantico e selvaggio, dolce e imprevedibile!",
        "Sei tutto ciò che non sapevo di volere!",
        "Restiamo insieme e rendiamo l'eternità interessante!",
        "Ti amo, mio bellissimo disastro!"
      ] : [
        "You're perfect! Perfectly chaotic!",
        "Romantic and wild, sweet and unpredictable!",
        "You're everything I didn't know I wanted!",
        "Let's stay together and make eternity interesting!",
        "I love you, my beautiful disaster!"
      ];
      
      for (const line of ending) {
        await this.showErisDialogue(line);
      }
      
      await this.showNarration(
        useTranslation
          ? "★★ FINALE SPECIALE: Romanza Selvaggia - L'Amore nel Caos ★★"
          : "★★ SPECIAL ENDING: Wild Romance - Love in Chaos ★★"
      );
    }

    async intellectualEnding() {
      const useTranslation = ConfigManager.language === "it";
      
      await this.showNarration(
        useTranslation
          ? "Eris ti prende la mano, i suoi occhi brillano di rispetto e ammirazione."
          : "Eris takes your hand, her eyes shining with respect and admiration."
      );
      
      const ending = useTranslation ? [
        "In tutti i miei eoni, non ho mai incontrato una mente come la tua.",
        "Mi sfidi, mi fai pensare, mi fai crescere.",
        "Questo è... questo è vero potere.",
        "Resta con me. Esploriamo i misteri dell'universo insieme.",
        "Come uguali. Come... più che uguali."
      ] : [
        "In all my eons, I've never met a mind like yours.",
        "You challenge me, make me think, make me grow.",
        "This is... this is true power.",
        "Stay with me. Let's explore the mysteries of the universe together.",
        "As equals. As... more than equals."
      ];
      
      for (const line of ending) {
        await this.showErisDialogue(line);
      }
      
      await this.showNarration(
        useTranslation
          ? "★★ FINALE SPECIALE: Connessione Mentale - Due Menti, Un Caos ★★"
          : "★★ SPECIAL ENDING: Mental Connection - Two Minds, One Chaos ★★"
      );
    }

    async chaosChampionEnding() {
      const useTranslation = ConfigManager.language === "it";
      
      await this.showNarration(
        useTranslation
          ? "Eris ride mentre il mondo intorno a voi si trasforma in puro caos gioioso."
          : "Eris laughs as the world around you transforms into pure joyful chaos."
      );
      
      const ending = useTranslation ? [
        "HAI VINTO!",
        "Sei il campione del caos!",
        "Nessun mortale ha mai abbracciato il disordine come te!",
        "Sei degno di stare al mio fianco!",
        "Insieme, saremo LEGGENDARI!",
        "I dei stessi tremeranno al nostro passaggio!"
      ] : [
        "YOU WIN!",
        "You're the champion of chaos!",
        "No mortal has ever embraced disorder like you!",
        "You're worthy to stand by my side!",
        "Together, we'll be LEGENDARY!",
        "The gods themselves will tremble at our passing!"
      ];
      
      for (const line of ending) {
        await this.showErisDialogue(line);
      }
      
      await this.showNarration(
        useTranslation
          ? "★★ FINALE SPECIALE: Campione del Caos - Partner nella Follia ★★"
          : "★★ SPECIAL ENDING: Chaos Champion - Partners in Madness ★★"
      );
    }

    async perfectEnding() {
      const useTranslation = ConfigManager.language === "it";
      
      await this.showNarration(
        useTranslation
          ? "Eris ti prende la mano, i suoi occhi brillano di felicità pura."
          : "Eris takes your hand, her eyes shining with pure happiness."
      );
      
      const ending = useTranslation ? [
        "Non pensavo fosse possibile...",
        "Per una dea come me...",
        "Sentirsi così... completa.",
        "Resta con me. Per sempre.",
        "Facciamo esplodere questo mondo insieme!",
        "Nel modo più bello possibile!"
      ] : [
        "I didn't think it was possible...",
        "For a goddess like me...",
        "To feel so... complete.",
        "Stay with me. Forever.",
        "Let's explode this world together!",
        "In the most beautiful way possible!"
      ];
      
      for (const line of ending) {
        await this.showErisDialogue(line);
      }
      
      await this.showNarration(
        useTranslation
          ? "★ FINALE PERFETTO: Il Caos dell'Amore Eterno ★"
          : "★ PERFECT ENDING: The Chaos of Eternal Love ★"
      );
    }

    async goodEnding() {
      const useTranslation = ConfigManager.language === "it";
      
      await this.showNarration(
        useTranslation
          ? "Eris sorride calorosamente, un'espressione rara sul suo volto."
          : "Eris smiles warmly, a rare expression on her face."
      );
      
      const ending = useTranslation ? [
        "Questo è stato... davvero speciale.",
        "Non capita spesso.",
        "Voglio vederti di nuovo.",
        "Presto.",
        "Molto presto!"
      ] : [
        "This was... really special.",
        "That doesn't happen often.",
        "I want to see you again.",
        "Soon.",
        "Very soon!"
      ];
      
      for (const line of ending) {
        await this.showErisDialogue(line);
      }
      
      await this.showNarration(
        useTranslation
          ? "★ BUON FINALE: Una Connessione Promettente ★"
          : "★ GOOD ENDING: A Promising Connection ★"
      );
    }

    async neutralEnding() {
      const useTranslation = ConfigManager.language === "it";
      
      const ending = useTranslation ? [
        "Beh, questo è stato... okay.",
        "Non male per un primo appuntamento.",
        "Forse ci vediamo di nuovo.",
        "Forse."
      ] : [
        "Well, that was... okay.",
        "Not bad for a first date.",
        "Maybe we'll see each other again.",
        "Maybe."
      ];
      
      for (const line of ending) {
        await this.showErisDialogue(line);
      }
      
      await this.showNarration(
        useTranslation
          ? "☆ FINALE NEUTRALE: Un Nuovo Inizio Incerto ☆"
          : "☆ NEUTRAL ENDING: An Uncertain New Beginning ☆"
      );
    }

    async badEnding() {
      const useTranslation = ConfigManager.language === "it";
      
      const ending = useTranslation ? [
        "Questo... non è andato bene.",
        "Forse non siamo compatibili.",
        "O forse hai solo avuto una brutta giornata.",
        "In ogni caso... arrivederci."
      ] : [
        "This... didn't go well.",
        "Maybe we're not compatible.",
        "Or maybe you just had a bad day.",
        "Either way... goodbye."
      ];
      
      for (const line of ending) {
        await this.showErisDialogue(line);
      }
      
      await this.showNarration(
        useTranslation
          ? "✗ FINALE NEGATIVO: Caos Disarmonico ✗"
          : "✗ BAD ENDING: Disharmonious Chaos ✗"
      );
    }

    async terribleEnding() {
      const useTranslation = ConfigManager.language === "it";
      
      await this.showNarration(
        useTranslation
          ? "Eris si allontana con disgusto evidente."
          : "Eris turns away with obvious disgust."
      );
      
      const ending = useTranslation ? [
        "Questo è stato un completo spreco del mio tempo.",
        "Non so cosa mi aspettassi.",
        "Non cercarmi più.",
        "Mai."
      ] : [
        "This was a complete waste of my time.",
        "I don't know what I expected.",
        "Don't look for me again.",
        "Ever."
      ];
      
      for (const line of ending) {
        await this.showErisDialogue(line);
      }
      
      await this.showNarration(
        useTranslation
          ? "✗✗ FINALE TERRIBILE: Il Caos della Delusione ✗✗"
          : "✗✗ TERRIBLE ENDING: The Chaos of Disappointment ✗✗"
      );
    }

    changeOpinion(amount) {
      this.opinion = Math.max(0, Math.min(1000, this.opinion + amount));
      if (this._opinionWindow) {
        this._opinionWindow.setOpinion(this.opinion);
      }
    }

    createOpinionWindow() {
      this._opinionWindow = new Window_OpinionBar(this.opinion);
      SceneManager._scene.addWindow(this._opinionWindow);
    }

    async showNarration(text) {
      return new Promise((resolve) => {
        window.skipLocalization = true;
        $gameMessage.setBackground(2);
        $gameMessage.add("\\C[6]" + text + "\\C[0]");
        window.skipLocalization = false;

        const checkMessage = () => {
          if (!$gameMessage.isBusy()) {
            resolve();
          } else {
            setTimeout(checkMessage, 100);
          }
        };
        checkMessage();
      });
    }

    async showErisDialogue(text) {
      return new Promise((resolve) => {
        $gameMessage.setBackground(2);
        window.skipLocalization = true;
        $gameMessage.add("\\C[2]Eris:\\C[0] " + text);
        window.skipLocalization = false;

        const checkMessage = () => {
          if (!$gameMessage.isBusy()) {
            resolve();
          } else {
            setTimeout(checkMessage, 100);
          }
        };
        checkMessage();
      });
    }

    cleanup() {
      if (this._opinionWindow) {
        SceneManager._scene.removeChild(this._opinionWindow);
        this._opinionWindow = null;
      }
    }
  }

  //=============================================================================
  // Plugin Command Registration
  //=============================================================================
  PluginManager.registerCommand(pluginName, "startDate", args => {
    const location = args.location || 'garden';
    
    // Randomize mood on date start
    const moods = ['playful', 'romantic', 'chaotic', 'nervous', 'confident'];
    const randomMood = moods[Math.floor(Math.random() * moods.length)];
    
    const date = new ErisDate(location, randomMood);
    date.startDate();
  });

})();
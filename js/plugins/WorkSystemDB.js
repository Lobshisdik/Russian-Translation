/*:
 * @target MZ
 * @plugindesc v1.0.0 Database for Work System - Job definitions, requirements, and outcomes
 * @author Omni-Lex
 * @url https://nocoldiz.itch.io/hypernet-explorer
 *
 * @help WorkSystemDB.js
 * === Work System Database v1.0.0 ===
 *
 * This plugin stores all job data for the Work System plugin.
 * It includes job requirements, outcomes, messages, and rewards.
 *
 * Job Outcome Types:
 * - SUCCESS: Full pay, positive messages
 * - PARTIAL: Reduced pay, neutral messages, possible minor damage
 * - FAILURE: Minimal/no pay, negative messages, possible damage/status
 * - DISASTER: Loss of gold, major damage/status effects
 *
 * Stats Used:
 * - Base: ATK, DEF, MAT, MDF, AGI, LUK, HP, MP
 * - Custom: Arcane (Var 86), Substance (Var 87), Stealth (Var 88), Intimidation (Var 89)
 */

(() => {
  'use strict';

  // Export to global namespace
  window.WorkSystemDB = window.WorkSystemDB || {};

  // Job Categories
  const JOB_CATEGORIES = {
    GENERAL: "General",
    COMBAT: "Combat",
    MAGICAL: "Magical",
    SOCIAL: "Social",
    TECHNICAL: "Technical",
    LABOR: "Labor",
    CRIMINAL: "Criminal",
    FACTION: "Faction"
  };

  // Status Effect IDs (from States.json)
  const STATUS = {
    POISON: 4,
    BLIND: 5,
    SILENCE: 6,
    RAGE: 7,
    CONFUSION: 8,
    SLEEP: 10,
    FREEZE: 11,
    PARALYSIS: 12,
    STUN: 13,
    HOT: 25,
    COLD: 26,
    STATIC: 27,
    WET: 28,
    BERSERK: 31,
    NAUSEA: 41,
    DRUNK: 42,
    BURNED: 43,
    INFECTED: 44,
    BLEEDING: 48
  };

  // All available jobs
  const JOBS = [
    // ============================================================
    // GENERAL LABOR JOBS
    // ============================================================
    {
      id: 1,
      name: "Warehouse Worker",
      name_int: "",
name_it: "Operaio di Magazzino",
      category: JOB_CATEGORIES.LABOR,
      description: "Load and unload cargo in the warehouse district.",
      description_it: "Carica e scarica merci nel distretto dei magazzini.",
      duration: 8, // hours
      basePay: 120,
      locations: ["Dock District", "Industrial Zone", "Trade Quarter"],
      requirements: {
        ATK: 20,
        DEF: 15,
        AGI: 10
      },
      outcomes: {
        success: {
          messages: [
            "You efficiently moved all the cargo.",
            "The foreman nods approvingly at your work.",
            "Another day, another crate moved.",
            "You finish the shift without incident.",
            "The work is hard but straightforward."
          ],
          payMultiplier: 1.0
        },
        partial: {
          messages: [
            "You dropped a few boxes but got the job done.",
            "Your back aches from the heavy lifting.",
            "You struggled with some of the heavier items.",
            "The supervisor gives you a warning look.",
            "You barely kept pace with the others."
          ],
          payMultiplier: 0.6,
          damage: { hp: 10 }
        },
        failure: {
          messages: [
            "You couldn't keep up with the workload.",
            "The heavy crates proved too much for you.",
            "You collapsed from exhaustion halfway through.",
            "The foreman sent you home early.",
            "Your body wasn't ready for this kind of work."
          ],
          payMultiplier: 0.2,
          damage: { hp: 25 },
          status: [STATUS.NAUSEA]
        },
        disaster: {
          messages: [
            "You dropped a valuable shipment!",
            "A forklift accident destroys company property!",
            "You caused a massive pile-up in the warehouse!",
            "Your carelessness led to a workplace injury!",
            "The ruined goods are deducted from your pay!"
          ],
          payMultiplier: -0.5,
          damage: { hp: 40 },
          status: [STATUS.BLEEDING, STATUS.STUN]
        }
      }
    },

    {
      id: 2,
      name: "Farm Hand",
      name_int: "",
name_it: "Bracciante Agricolo",
      category: JOB_CATEGORIES.LABOR,
      description: "Work the fields, tend to crops and livestock.",
      description_it: "Lavora nei campi, cura i raccolti e il bestiame.",
      duration: 10,
      basePay: 100,
      locations: ["Rural Farms", "Agricultural District", "Countryside"],
      requirements: {
        ATK: 15,
        DEF: 20,
        HP: 100
      },
      outcomes: {
        success: {
          messages: [
            "The harvest goes smoothly under your care.",
            "The animals are well-fed and content.",
            "You work from dawn to dusk without complaint.",
            "The farmer thanks you for your hard work.",
            "Another productive day on the farm."
          ],
          payMultiplier: 1.0
        },
        partial: {
          messages: [
            "The work is exhausting under the hot sun.",
            "You manage most tasks but fall behind schedule.",
            "The animals were more unruly than expected.",
            "Your hands are blistered from the labor.",
            "You completed the essentials but nothing more."
          ],
          payMultiplier: 0.7,
          damage: { hp: 15 },
          status: [STATUS.HOT]
        },
        failure: {
          messages: [
            "The physical labor proves too demanding.",
            "You suffer from heat exhaustion in the fields.",
            "The livestock got loose on your watch.",
            "You couldn't finish even half the work.",
            "The farmer is disappointed with your performance."
          ],
          payMultiplier: 0.3,
          damage: { hp: 30 },
          status: [STATUS.HOT, STATUS.NAUSEA]
        },
        disaster: {
          messages: [
            "You left the barn door open - livestock escaped!",
            "Your negligence ruined an entire crop section!",
            "You accidentally poisoned the water supply!",
            "A fire started from your carelessness!",
            "The damage costs more than a day's wages!"
          ],
          payMultiplier: -1.0,
          damage: { hp: 35 },
          status: [STATUS.BURNED, STATUS.NAUSEA]
        }
      }
    },

    {
      id: 3,
      name: "Bartender",
      name_int: "",
name_it: "Barista",
      category: JOB_CATEGORIES.SOCIAL,
      description: "Serve drinks and manage patrons at the tavern.",
      description_it: "Servi bevande e gestisci clienti alla taverna.",
      duration: 8,
      basePay: 90,
      locations: ["Tavern District", "Red Light District", "Entertainment Quarter"],
      requirements: {
        AGI: 20,
        LUK: 15,
        Intimidation: 10
      },
      outcomes: {
        success: {
          messages: [
            "The drinks flow and tips pile up.",
            "You handle the evening rush with ease.",
            "Even the drunkards respect your authority.",
            "Your charm earns you extra tips.",
            "A successful night behind the bar."
          ],
          payMultiplier: 1.3
        },
        partial: {
          messages: [
            "You spill a few drinks but manage.",
            "A drunk patron gives you trouble.",
            "The tips were mediocre tonight.",
            "You're exhausted from staying on your feet.",
            "The night was busier than expected."
          ],
          payMultiplier: 0.8,
          damage: { hp: 5 }
        },
        failure: {
          messages: [
            "You couldn't keep up with orders.",
            "Multiple customers complained about slow service.",
            "A fight broke out that you couldn't stop.",
            "The owner is unhappy with your performance.",
            "You broke several glasses in the chaos."
          ],
          payMultiplier: 0.4,
          damage: { hp: 15 },
          status: [STATUS.NAUSEA]
        },
        disaster: {
          messages: [
            "A massive bar brawl erupted under your watch!",
            "You got knocked out trying to break up a fight!",
            "Expensive bottles were smashed in the chaos!",
            "The tavern is wrecked and it's your fault!",
            "You're banned from working here again!"
          ],
          payMultiplier: -0.8,
          damage: { hp: 50 },
          status: [STATUS.STUN, STATUS.BLEEDING]
        }
      }
    },

    {
      id: 4,
      name: "Street Performer",
      name_int: "",
name_it: "Artista di Strada",
      category: JOB_CATEGORIES.SOCIAL,
      description: "Entertain crowds with performances for tips.",
      description_it: "Intrattieni la folla con spettacoli per mance.",
      duration: 6,
      basePay: 60,
      locations: ["Town Square", "Market District", "Festival Grounds"],
      requirements: {
        LUK: 25,
        AGI: 15,
        MAT: 10
      },
      outcomes: {
        success: {
          messages: [
            "The crowd loves your performance!",
            "Coins rain into your hat.",
            "You draw a large and generous audience.",
            "Your act is the talk of the town.",
            "A wealthy patron gives you a generous donation."
          ],
          payMultiplier: 1.5
        },
        partial: {
          messages: [
            "A few people stop to watch and tip.",
            "Your performance is decent but not spectacular.",
            "The crowd is small but appreciative.",
            "You earn a modest amount for your efforts.",
            "Some applause, some indifference."
          ],
          payMultiplier: 0.9
        },
        failure: {
          messages: [
            "The crowd ignores your performance.",
            "You barely earn anything today.",
            "Someone heckles you mercilessly.",
            "Your act falls flat and people walk away.",
            "You're embarrassed by the poor turnout."
          ],
          payMultiplier: 0.2
        },
        disaster: {
          messages: [
            "The city guards chase you for performing without a permit!",
            "Thugs rob you of your earnings!",
            "You're pelted with rotten vegetables!",
            "A rival performer sabotages your act!",
            "You're fined for disturbing the peace!"
          ],
          payMultiplier: -0.5,
          damage: { hp: 10 },
          status: [STATUS.NAUSEA]
        }
      }
    },

    {
      id: 5,
      name: "Blacksmith Assistant",
      name_int: "",
name_it: "Assistente Fabbro",
      category: JOB_CATEGORIES.TECHNICAL,
      description: "Help the blacksmith forge weapons and tools.",
      description_it: "Aiuta il fabbro a forgiare armi e attrezzi.",
      duration: 9,
      basePay: 130,
      locations: ["Forge District", "Craftsman Quarter", "Industrial Zone"],
      requirements: {
        ATK: 25,
        DEF: 20,
        Substance: 15
      },
      outcomes: {
        success: {
          messages: [
            "You keep the forge running smoothly.",
            "The blacksmith praises your steady hand.",
            "Every piece comes out perfect.",
            "The heat is intense but you manage well.",
            "Quality work earns quality pay."
          ],
          payMultiplier: 1.0
        },
        partial: {
          messages: [
            "You get singed by the hot metal a few times.",
            "Some pieces need to be reforged.",
            "The heat is almost unbearable.",
            "You complete most of the orders.",
            "Your hands are covered in minor burns."
          ],
          payMultiplier: 0.7,
          damage: { hp: 20 },
          status: [STATUS.BURNED]
        },
        failure: {
          messages: [
            "The forge's heat overwhelms you.",
            "You ruin several expensive pieces.",
            "A bad burn sends you home early.",
            "The blacksmith is frustrated with your mistakes.",
            "You can't handle the physical demands."
          ],
          payMultiplier: 0.3,
          damage: { hp: 35 },
          status: [STATUS.BURNED, STATUS.HOT]
        },
        disaster: {
          messages: [
            "You spill molten metal everywhere!",
            "The forge explodes from your negligence!",
            "You destroy a custom order for a noble!",
            "Your mistake causes a workshop fire!",
            "The blacksmith bans you permanently!"
          ],
          payMultiplier: -1.2,
          damage: { hp: 60 },
          status: [STATUS.BURNED, STATUS.BLEEDING]
        }
      }
    },

    // ============================================================
    // MAGICAL JOBS
    // ============================================================
    {
      id: 6,
      name: "Spell Component Gatherer",
      name_int: "",
name_it: "Raccoglitore di Componenti",
      category: JOB_CATEGORIES.MAGICAL,
      description: "Collect rare magical ingredients in dangerous areas.",
      description_it: "Raccogli ingredienti magici rari in zone pericolose.",
      duration: 7,
      basePay: 150,
      locations: ["Mystic Forest", "Arcane Wasteland", "Magic District"],
      requirements: {
        MAT: 20,
        Arcane: 25,
        LUK: 15
      },
      outcomes: {
        success: {
          messages: [
            "You find all the components on the list.",
            "A rare mushroom catches your eye - bonus!",
            "Your magical sense leads you to quality ingredients.",
            "The client is thrilled with your haul.",
            "Every component is in perfect condition."
          ],
          payMultiplier: 1.2
        },
        partial: {
          messages: [
            "You find most of what's needed.",
            "Some ingredients are slightly damaged.",
            "The search takes longer than expected.",
            "You encounter minor magical hazards.",
            "An acceptable but not exceptional haul."
          ],
          payMultiplier: 0.8,
          damage: { hp: 10, mp: 15 }
        },
        failure: {
          messages: [
            "The magical flora proves too dangerous.",
            "You can't identify the correct components.",
            "A magical trap injures you badly.",
            "You return nearly empty-handed.",
            "Your magical sense failed you today."
          ],
          payMultiplier: 0.25,
          damage: { hp: 25, mp: 30 },
          status: [STATUS.POISON]
        },
        disaster: {
          messages: [
            "You trigger a magical curse!",
            "The components explode in your bag!",
            "You anger a territorial magical creature!",
            "Your mishandling ruins the entire batch!",
            "The client demands compensation!"
          ],
          payMultiplier: -0.7,
          damage: { hp: 40, mp: 50 },
          status: [STATUS.POISON, STATUS.CONFUSION]
        }
      }
    },

    {
      id: 7,
      name: "Alchemist's Assistant",
      name_int: "",
name_it: "Assistente Alchimista",
      category: JOB_CATEGORIES.MAGICAL,
      description: "Mix potions and manage the alchemist's laboratory.",
      description_it: "Mescola pozioni e gestisci il laboratorio dell'alchimista.",
      duration: 8,
      basePay: 140,
      locations: ["Potion Shop", "Alchemy Quarter", "Magic Academy"],
      requirements: {
        MAT: 25,
        Arcane: 20,
        Substance: 20
      },
      outcomes: {
        success: {
          messages: [
            "Every potion is perfectly brewed.",
            "Your precision impresses the alchemist.",
            "The laboratory runs like clockwork.",
            "You discover a more efficient mixing method.",
            "Quality work in the arcane arts."
          ],
          payMultiplier: 1.0
        },
        partial: {
          messages: [
            "A few batches come out slightly off-color.",
            "You get mild chemical burns from splashes.",
            "Most potions are acceptable quality.",
            "The fumes give you a headache.",
            "Adequate but not exceptional work."
          ],
          payMultiplier: 0.7,
          damage: { hp: 12, mp: 10 },
          status: [STATUS.NAUSEA]
        },
        failure: {
          messages: [
            "Multiple batches are ruined by mistakes.",
            "Toxic fumes overcome you.",
            "You can't maintain the proper temperatures.",
            "The alchemist is disappointed.",
            "Your magical control was insufficient."
          ],
          payMultiplier: 0.3,
          damage: { hp: 25, mp: 25 },
          status: [STATUS.POISON, STATUS.NAUSEA]
        },
        disaster: {
          messages: [
            "A massive alchemical explosion rocks the lab!",
            "You accidentally create a toxic cloud!",
            "Valuable reagents are destroyed!",
            "The lab needs expensive repairs!",
            "You're lucky to escape with your life!"
          ],
          payMultiplier: -1.5,
          damage: { hp: 55, mp: 40 },
          status: [STATUS.POISON, STATUS.BURNED, STATUS.CONFUSION]
        }
      }
    },

    {
      id: 8,
      name: "Magical Artifact Restorer",
      name_int: "",
name_it: "Restauratore di Artefatti",
      category: JOB_CATEGORIES.MAGICAL,
      description: "Repair and restore damaged magical items.",
      description_it: "Ripara e restaura oggetti magici danneggiati.",
      duration: 6,
      basePay: 180,
      locations:[], 
requirements: {
        MAT: 30,
        Arcane: 35,
        MDF: 20
      },
      outcomes: {
        success: {
          messages: [
            "The artifact's magic flows perfectly again.",
            "Your restoration work is flawless.",
            "The client marvels at the restored power.",
            "You handle the volatile magic expertly.",
            "Another masterful restoration complete."
          ],
          payMultiplier: 1.1
        },
        partial: {
          messages: [
            "The artifact works but not at full power.",
            "You experience magical feedback during work.",
            "The restoration is functional if imperfect.",
            "Some enchantments couldn't be fully restored.",
            "An adequate if uninspiring job."
          ],
          payMultiplier: 0.75,
          damage: { mp: 20 },
          status: [STATUS.STATIC]
        },
        failure: {
          messages: [
            "The artifact's magic resists your attempts.",
            "Magical backlash injures you.",
            "You couldn't restore the item's power.",
            "The complexity exceeded your skill.",
            "The client takes their business elsewhere."
          ],
          payMultiplier: 0.2,
          damage: { hp: 20, mp: 40 },
          status: [STATUS.CONFUSION, STATUS.STATIC]
        },
        disaster: {
          messages: [
            "The artifact explodes catastrophically!",
            "A magical curse transfers to you!",
            "The item is destroyed beyond repair!",
            "Rampant magic damages the workshop!",
            "You must compensate for the lost artifact!"
          ],
          payMultiplier: -2.0,
          damage: { hp: 50, mp: 60 },
          status: [STATUS.CONFUSION, STATUS.PARALYSIS, STATUS.STATIC]
        }
      }
    },

    // ============================================================
    // COMBAT JOBS
    // ============================================================
    {
      id: 9,
      name: "Caravan Guard",
      name_int: "",
name_it: "Guardia Carovaniera",
      category: JOB_CATEGORIES.COMBAT,
      description: "Protect merchant caravans from bandits and monsters.",
      description_it: "Proteggi le carovane mercantili da banditi e mostri.",
      duration: 12,
      basePay: 200,
      locations:[], 
requirements: {
        ATK: 30,
        DEF: 25,
        AGI: 20,
        Intimidation: 15
      },
      outcomes: {
        success: {
          messages: [
            "The journey is peaceful thanks to your presence.",
            "Bandits take one look at you and flee.",
            "The merchant arrives safely and grateful.",
            "Your reputation precedes you.",
            "An uneventful but profitable escort."
          ],
          payMultiplier: 1.0
        },
        partial: {
          messages: [
            "A skirmish with bandits leaves you wounded.",
            "You successfully drive off attackers but take hits.",
            "The caravan arrives with minor losses.",
            "Combat tested your limits.",
            "You earned your pay but paid in blood."
          ],
          payMultiplier: 0.8,
          damage: { hp: 30 },
          status: [STATUS.BLEEDING]
        },
        failure: {
          messages: [
            "Bandits overwhelm you.",
            "You fail to protect the cargo.",
            "Serious injuries force you to retreat.",
            "The merchant curses your incompetence.",
            "You barely escaped with your life."
          ],
          payMultiplier: 0.3,
          damage: { hp: 55 },
          status: [STATUS.BLEEDING, STATUS.STUN]
        },
        disaster: {
          messages: [
            "The caravan is completely destroyed!",
            "You're knocked unconscious and robbed!",
            "Bandits take everything including your weapons!",
            "The merchant demands compensation!",
            "Your reputation as a guard is ruined!"
          ],
          payMultiplier: -1.5,
          damage: { hp: 80 },
          status: [STATUS.BLEEDING, STATUS.STUN, STATUS.CONFUSION]
        }
      }
    },

    {
      id: 10,
      name: "Arena Fighter",
      name_int: "",
name_it: "Combattente d'Arena",
      category: JOB_CATEGORIES.COMBAT,
      description: "Fight in the arena for prize money and glory.",
      description_it: "Combatti nell'arena per denaro e gloria.",
      duration: 4,
      basePay: 150,
      locations:[], 
requirements: {
        ATK: 35,
        DEF: 30,
        AGI: 25,
        HP: 150
      },
      outcomes: {
        success: {
          messages: [
            "You dominate your opponent!",
            "The crowd roars your name!",
            "Victory is swift and decisive!",
            "Your fighting skills are unmatched today!",
            "The prize money is yours!"
          ],
          payMultiplier: 1.5
        },
        partial: {
          messages: [
            "You win but take serious damage.",
            "A narrow victory after brutal exchanges.",
            "You barely edge out your opponent.",
            "The match was closer than expected.",
            "Victory, but at a cost."
          ],
          payMultiplier: 1.0,
          damage: { hp: 35 }
        },
        failure: {
          messages: [
            "You're defeated in the arena.",
            "Your opponent proves superior.",
            "The crowd boos as you fall.",
            "Humiliating defeat.",
            "No prize money for losers."
          ],
          payMultiplier: 0.2,
          damage: { hp: 60 },
          status: [STATUS.BLEEDING, STATUS.STUN]
        },
        disaster: {
          messages: [
            "You're brutally knocked out in the first round!",
            "The crowd throws garbage at your unconscious body!",
            "You have to pay medical fees!",
            "Your humiliation is complete!",
            "The arena bans you for poor performance!"
          ],
          payMultiplier: -0.8,
          damage: { hp: 90 },
          status: [STATUS.BLEEDING, STATUS.STUN, STATUS.CONFUSION]
        }
      }
    },

    {
      id: 11,
      name: "Monster Exterminator",
      name_int: "",
name_it: "Sterminatore di Mostri",
      category: JOB_CATEGORIES.COMBAT,
      description: "Clear out monster infestations from civilian areas.",
      description_it: "Elimina infestazioni di mostri dalle aree civili.",
      duration: 8,
      basePay: 220,
      locations:[], 
requirements: {
        ATK: 30,
        DEF: 25,
        MAT: 20,
        LUK: 15
      },
      outcomes: {
        success: {
          messages: [
            "The infestation is completely cleared.",
            "Not a single monster escaped.",
            "The townsfolk celebrate your success.",
            "Professional and efficient work.",
            "Another clean extermination job."
          ],
          payMultiplier: 1.0
        },
        partial: {
          messages: [
            "Most monsters eliminated but some escaped.",
            "You're injured in the fighting.",
            "The job took longer than expected.",
            "Civilians are mostly satisfied.",
            "A rough but successful hunt."
          ],
          payMultiplier: 0.75,
          damage: { hp: 25 },
          status: [STATUS.POISON]
        },
        failure: {
          messages: [
            "The monsters prove too dangerous.",
            "You're forced to retreat.",
            "Several monsters remain at large.",
            "The town is disappointed.",
            "You bit off more than you could chew."
          ],
          payMultiplier: 0.3,
          damage: { hp: 45 },
          status: [STATUS.POISON, STATUS.BLEEDING]
        },
        disaster: {
          messages: [
            "The monster nest overwhelms you!",
            "Your incompetence led to civilian casualties!",
            "Property damage costs more than your fee!",
            "You're mauled nearly to death!",
            "The town bans you from ever returning!"
          ],
          payMultiplier: -1.8,
          damage: { hp: 75 },
          status: [STATUS.POISON, STATUS.BLEEDING, STATUS.INFECTED]
        }
      }
    },

    // ============================================================
    // CRIMINAL JOBS
    // ============================================================
    {
      id: 12,
      name: "Pickpocketing",
      name_int: "",
name_it: "Borseggio",
      category: JOB_CATEGORIES.CRIMINAL,
      description: "Steal from unsuspecting marks in crowded areas.",
      description_it: "Ruba da vittime ignare in aree affollate.",
      duration: 5,
      basePay: 100,
      locations:[], 
requirements: {
        AGI: 30,
        Stealth: 35,
        LUK: 25
      },
      outcomes: {
        success: {
          messages: [
            "Your fingers are quick and unseen.",
            "Easy marks and easy money.",
            "You lift several fat purses.",
            "Nobody suspects a thing.",
            "A profitable day in the shadows."
          ],
          payMultiplier: 1.4
        },
        partial: {
          messages: [
            "You manage a few successful lifts.",
            "One mark almost caught you.",
            "The crowds weren't as thick as hoped.",
            "Modest earnings for the risk.",
            "You got away but it was close."
          ],
          payMultiplier: 0.9
        },
        failure: {
          messages: [
            "You're caught red-handed!",
            "The guards chase you through the streets!",
            "You escape but empty-handed!",
            "A mob of angry citizens pursues you!",
            "No loot, just bruises!"
          ],
          payMultiplier: 0.0,
          damage: { hp: 20 },
          status: [STATUS.STUN]
        },
        disaster: {
          messages: [
            "You picked the wrong mark - they're a noble's bodyguard!",
            "The city guard beats you senseless!",
            "You're fined heavily for your crime!",
            "Your stash is confiscated!",
            "You narrowly avoid prison!"
          ],
          payMultiplier: -1.2,
          damage: { hp: 50 },
          status: [STATUS.BLEEDING, STATUS.STUN]
        }
      }
    },

    {
      id: 13,
      name: "Smuggling Run",
      name_int: "",
name_it: "Contrabbando",
      category: JOB_CATEGORIES.CRIMINAL,
      description: "Transport illegal goods across checkpoints.",
      description_it: "Trasporta merci illegali attraverso i posti di blocco.",
      duration: 10,
      basePay: 250,
      locations:[], 
requirements: {
        Stealth: 30,
        LUK: 25,
        AGI: 20,
        Intimidation: 15
      },
      outcomes: {
        success: {
          messages: [
            "You slip past the checkpoints undetected.",
            "The goods are delivered successfully.",
            "Your contacts are impressed.",
            "Not a single guard suspected you.",
            "Clean run, clean profit."
          ],
          payMultiplier: 1.0
        },
        partial: {
          messages: [
            "You had to bribe a guard.",
            "A close call at the checkpoint.",
            "Some goods were damaged in transit.",
            "The route was more dangerous than expected.",
            "You made it but lost some profit to bribes."
          ],
          payMultiplier: 0.6,
          damage: { hp: 10 }
        },
        failure: {
          messages: [
            "The guards are on high alert!",
            "You're forced to dump the cargo and run!",
            "The operation is compromised!",
            "You barely escape arrest!",
            "Your contacts are furious!"
          ],
          payMultiplier: 0.1,
          damage: { hp: 25 },
          status: [STATUS.NAUSEA]
        },
        disaster: {
          messages: [
            "You're caught with illegal goods!",
            "The cargo is seized and you're beaten!",
            "Your contacts abandon you!",
            "Massive fines are imposed!",
            "You're blacklisted from future jobs!"
          ],
          payMultiplier: -2.0,
          damage: { hp: 55 },
          status: [STATUS.BLEEDING, STATUS.STUN]
        }
      }
    },

    {
      id: 14,
      name: "Burglary",
      name_int: "",
name_it: "Furto con Scasso",
      category: JOB_CATEGORIES.CRIMINAL,
      description: "Break into a building and steal valuables.",
      description_it: "Entra con scasso in un edificio e ruba oggetti di valore.",
      duration: 6,
      basePay: 300,
      locations:[], 
requirements: {
        Stealth: 40,
        AGI: 30,
        LUK: 30,
        Substance: 15
      },
      outcomes: {
        success: {
          messages: [
            "You're in and out like a ghost.",
            "The safe opens without issue.",
            "High-value items secured.",
            "Nobody heard a thing.",
            "Master thief at work."
          ],
          payMultiplier: 1.2
        },
        partial: {
          messages: [
            "You triggered an alarm but escaped.",
            "The loot was less than expected.",
            "A guard nearly spotted you.",
            "You got something but had to flee.",
            "Close call but you made it out."
          ],
          payMultiplier: 0.7,
          damage: { hp: 15 }
        },
        failure: {
          messages: [
            "The alarm brings guards running!",
            "You escape but empty-handed!",
            "Dogs chase you into the night!",
            "The target had better security than expected!",
            "A botched job from start to finish!"
          ],
          payMultiplier: 0.0,
          damage: { hp: 30 },
          status: [STATUS.BLEEDING]
        },
        disaster: {
          messages: [
            "You're caught in the act!",
            "The guards beat you mercilessly!",
            "You're robbed of your own equipment!",
            "Authorities extract a heavy fine!",
            "Your reputation as a thief is tarnished!"
          ],
          payMultiplier: -1.8,
          damage: { hp: 65 },
          status: [STATUS.BLEEDING, STATUS.STUN, STATUS.CONFUSION]
        }
      }
    },

    // ============================================================
    // TECHNICAL JOBS
    // ============================================================
    {
      id: 15,
      name: "Mechanic",
      name_int: "",
name_it: "Meccanico",
      category: JOB_CATEGORIES.TECHNICAL,
      description: "Repair vehicles and machinery.",
      description_it: "Ripara veicoli e macchinari.",
      duration: 8,
      basePay: 140,
      locations:[], 
requirements: {
        Substance: 30,
        AGI: 20,
        LUK: 15
      },
      outcomes: {
        success: {
          messages: [
            "Every repair is textbook perfect.",
            "The engines purr under your care.",
            "Clients praise your expertise.",
            "You diagnose problems instantly.",
            "Another satisfied customer."
          ],
          payMultiplier: 1.0
        },
        partial: {
          messages: [
            "The repairs work but aren't elegant.",
            "You get covered in grease and oil.",
            "One vehicle gives you trouble.",
            "The work takes longer than estimated.",
            "Functional but not your best work."
          ],
          payMultiplier: 0.75,
          damage: { hp: 8 }
        },
        failure: {
          messages: [
            "You can't diagnose the problem.",
            "The repairs fail shortly after completion.",
            "The client is unsatisfied.",
            "You damaged a component trying to fix it.",
            "Your technical knowledge was insufficient."
          ],
          payMultiplier: 0.3,
          damage: { hp: 15 },
          status: [STATUS.NAUSEA]
        },
        disaster: {
          messages: [
            "You caused an engine explosion!",
            "Your mistake totals an expensive vehicle!",
            "Oil sprays everywhere causing injuries!",
            "The damage exceeds your pay!",
            "You're banned from the shop!"
          ],
          payMultiplier: -1.3,
          damage: { hp: 45 },
          status: [STATUS.BURNED, STATUS.BLEEDING]
        }
      }
    },

    {
      id: 16,
      name: "Locksmith",
      name_int: "",
name_it: "Fabbro di Serrature",
      category: JOB_CATEGORIES.TECHNICAL,
      description: "Create and repair locks for clients.",
      description_it: "Crea e ripara serrature per i clienti.",
      duration: 6,
      basePay: 120,
      locations:[], 
requirements: {
        Substance: 25,
        AGI: 25,
        LUK: 20
      },
      outcomes: {
        success: {
          messages: [
            "Every lock functions flawlessly.",
            "Your craftsmanship is impeccable.",
            "Clients trust your work completely.",
            "Complex mechanisms pose no challenge.",
            "Another perfect day at the bench."
          ],
          payMultiplier: 1.0
        },
        partial: {
          messages: [
            "Most locks work adequately.",
            "One mechanism keeps jamming.",
            "The work is tedious and tiring.",
            "You complete the essential jobs.",
            "Acceptable but uninspired work."
          ],
          payMultiplier: 0.7
        },
        failure: {
          messages: [
            "Several locks malfunction.",
            "You can't figure out a complex mechanism.",
            "Clients complain about quality.",
            "Your precision was lacking today.",
            "A frustrating day of failures."
          ],
          payMultiplier: 0.25,
          damage: { hp: 5 }
        },
        disaster: {
          messages: [
            "You permanently lock a client out!",
            "A spring mechanism injures your eye!",
            "You ruin expensive lock components!",
            "The client sues for damages!",
            "Your reputation is destroyed!"
          ],
          payMultiplier: -1.0,
          damage: { hp: 30 },
          status: [STATUS.BLIND, STATUS.BLEEDING]
        }
      }
    },

    {
      id: 17,
      name: "Clockmaker",
      name_int: "",
name_it: "Orologiaio",
      category: JOB_CATEGORIES.TECHNICAL,
      description: "Craft and repair intricate timepieces.",
      description_it: "Crea e ripara orologi complessi.",
      duration: 7,
      basePay: 160,
      locations:[], 
requirements: {
        Substance: 35,
        AGI: 30,
        LUK: 20
      },
      outcomes: {
        success: {
          messages: [
            "Every gear meshes perfectly.",
            "The timepieces are works of art.",
            "Your precision is unmatched.",
            "Clients marvel at your craftsmanship.",
            "Perfection in every tick."
          ],
          payMultiplier: 1.1
        },
        partial: {
          messages: [
            "The mechanisms work but need adjustment.",
            "One clock keeps running slow.",
            "Your eyes strain from the detailed work.",
            "Adequate repairs if not masterful.",
            "The work tests your patience."
          ],
          payMultiplier: 0.75,
          damage: { hp: 5 }
        },
        failure: {
          messages: [
            "The delicate mechanisms defeat you.",
            "Multiple timepieces fail to function.",
            "Your hand tremors ruin the work.",
            "Clients take their business elsewhere.",
            "The precision required exceeds your skill."
          ],
          payMultiplier: 0.2
        },
        disaster: {
          messages: [
            "You destroy a priceless antique clock!",
            "A spring flies into your face!",
            "Years of work ruined in seconds!",
            "The compensation bankrupts you!",
            "You're blacklisted from the trade!"
          ],
          payMultiplier: -2.5,
          damage: { hp: 25 },
          status: [STATUS.BLIND, STATUS.BLEEDING]
        }
      }
    },

    // ============================================================
    // MORE SOCIAL JOBS
    // ============================================================
    {
      id: 18,
      name: "Diplomat",
      name_int: "",
name_it: "Diplomatico",
      category: JOB_CATEGORIES.SOCIAL,
      description: "Negotiate deals and resolve disputes.",
      description_it: "Negozia accordi e risolvi dispute.",
      duration: 6,
      basePay: 180,
      locations:[], 
requirements: {
        Intimidation: 25,
        LUK: 30,
        MAT: 20
      },
      outcomes: {
        success: {
          messages: [
            "The negotiations go smoothly.",
            "Both parties are satisfied with the deal.",
            "Your silver tongue saves the day.",
            "Conflict resolved through words alone.",
            "A diplomatic triumph."
          ],
          payMultiplier: 1.0
        },
        partial: {
          messages: [
            "The deal is reached but both sides grumble.",
            "Negotiations drag on exhaustingly.",
            "A compromise rather than victory.",
            "You manage an acceptable outcome.",
            "Politics are messier than expected."
          ],
          payMultiplier: 0.7,
          damage: { mp: 15 }
        },
        failure: {
          messages: [
            "The negotiations collapse.",
            "Both parties walk away angry.",
            "Your arguments fall on deaf ears.",
            "The dispute remains unresolved.",
            "A diplomatic failure."
          ],
          payMultiplier: 0.2,
          damage: { mp: 25 }
        },
        disaster: {
          messages: [
            "Your words start a fight!",
            "You offend everyone involved!",
            "The dispute escalates to violence!",
            "You're blamed for the breakdown!",
            "Your reputation as a diplomat is ruined!"
          ],
          payMultiplier: -0.8,
          damage: { hp: 30, mp: 30 },
          status: [STATUS.STUN]
        }
      }
    },

    {
      id: 19,
      name: "Fortune Teller",
      name_int: "",
name_it: "Indovino",
      category: JOB_CATEGORIES.SOCIAL,
      description: "Read fortunes for paying customers.",
      description_it: "Leggi il futuro per clienti paganti.",
      duration: 5,
      basePay: 80,
      locations:[], 
requirements: {
        LUK: 30,
        MAT: 25,
        Arcane: 20
      },
      outcomes: {
        success: {
          messages: [
            "Your predictions resonate deeply.",
            "Customers leave satisfied and amazed.",
            "The spirits speak clearly through you.",
            "Word of your accuracy spreads.",
            "Tips flow generously."
          ],
          payMultiplier: 1.4
        },
        partial: {
          messages: [
            "Your readings are vague but accepted.",
            "Some customers seem unconvinced.",
            "The mystical connection is weak today.",
            "You earn modest tips.",
            "A middling day of divination."
          ],
          payMultiplier: 0.8
        },
        failure: {
          messages: [
            "Your predictions are obviously wrong.",
            "Customers demand refunds.",
            "The spirits are silent.",
            "You're accused of being a fraud.",
            "An embarrassing day."
          ],
          payMultiplier: 0.15
        },
        disaster: {
          messages: [
            "You accidentally curse a customer!",
            "An angry mob accuses you of witchcraft!",
            "Your false prediction causes harm!",
            "You're driven out of town!",
            "Refunds cost more than you earned!"
          ],
          payMultiplier: -0.6,
          damage: { mp: 30 },
          status: [STATUS.CONFUSION]
        }
      }
    },

    {
      id: 20,
      name: "Courier",
      name_int: "",
name_it: "Corriere",
      category: JOB_CATEGORIES.GENERAL,
      description: "Deliver packages and messages across the city.",
      description_it: "Consegna pacchi e messaggi in città.",
      duration: 7,
      basePay: 100,
      locations:[], 
requirements: {
        AGI: 30,
        DEF: 15,
        LUK: 15
      },
      outcomes: {
        success: {
          messages: [
            "All deliveries on time.",
            "Customers tip for your speed.",
            "You know the city like the back of your hand.",
            "Not a single package damaged.",
            "Swift and reliable service."
          ],
          payMultiplier: 1.2
        },
        partial: {
          messages: [
            "Most deliveries made on time.",
            "You get lost once or twice.",
            "A package gets slightly damaged.",
            "The routes were more difficult than expected.",
            "You earn your pay but barely."
          ],
          payMultiplier: 0.75,
          damage: { hp: 10 }
        },
        failure: {
          messages: [
            "You get hopelessly lost.",
            "Multiple deliveries are late.",
            "A package is severely damaged.",
            "Clients complain about your service.",
            "The dispatcher is furious."
          ],
          payMultiplier: 0.3,
          damage: { hp: 15 },
          status: [STATUS.NAUSEA]
        },
        disaster: {
          messages: [
            "You lose an important package!",
            "You're mugged and all deliveries are stolen!",
            "A valuable parcel is destroyed!",
            "The losses are deducted from your pay!",
            "You're fired from the courier service!"
          ],
          payMultiplier: -1.2,
          damage: { hp: 35 },
          status: [STATUS.BLEEDING, STATUS.STUN]
        }
      }
    },

    // ============================================================
    // FACTION JOBS - MAGES GUILD (Faction ID: 0)
    // ============================================================
    {
      id: 100,
      name: "Permit Inspector",
      name_int: "",
name_it: "Ispettore Permessi",
      category: JOB_CATEGORIES.FACTION,
      factionId: 0, // Mages Guild
      description: "Inspect magical practitioners for proper permits and licensing.",
      description_it: "Ispeziona praticanti magici per permessi e licenze appropriate.",
      duration: 8,
      basePay: 140,
      locations:[], 
requirements: {
        MAT: 20,
        Arcane: 25,
        Intimidation: 20
      },
      outcomes: {
        success: {
          messages: [
            "You find several permit violations and issue fines.",
            "The bureaucracy flows smoothly through you.",
            "Unlicensed mages flee at your approach.",
            "Forms filed in triplicate - perfection.",
            "Another day upholding Guild regulations."
          ],
          payMultiplier: 1.0
        },
        partial: {
          messages: [
            "You catch some violators but others escape.",
            "The paperwork is exhausting.",
            "One mage argues vehemently about technicalities.",
            "Most violations are minor infractions.",
            "Adequate enforcement of the rules."
          ],
          payMultiplier: 0.75,
          damage: { mp: 15 }
        },
        failure: {
          messages: [
            "Unlicensed mages evade your inspection.",
            "You lose track of the complex regulations.",
            "A powerful mage intimidates you.",
            "The paperwork defeats you.",
            "The Guild is disappointed in your performance."
          ],
          payMultiplier: 0.3,
          damage: { mp: 25 }
        },
        disaster: {
          messages: [
            "You accidentally revoke a Guild Master's permit!",
            "An angry mage curses you!",
            "You lose vital Guild documents!",
            "Political backlash costs you!",
            "You're reassigned to the archives!"
          ],
          payMultiplier: -0.8,
          damage: { hp: 20, mp: 35 },
          status: [STATUS.CONFUSION, STATUS.SILENCE]
        }
      }
    },

    {
      id: 101,
      name: "Ritual Supervisor",
      name_int: "",
name_it: "Supervisore Rituali",
      category: JOB_CATEGORIES.FACTION,
      factionId: 3, // Loyalists
      description: "Ensure magical rituals follow Guild protocols exactly.",
      description_it: "Assicura che i rituali magici seguano esattamente i protocolli della Gilda.",
      duration: 6,
      basePay: 130,
      locations:[], 
requirements: {
        MAT: 25,
        Arcane: 30,
        MDF: 20
      },
      outcomes: {
        success: {
          messages: [
            "Every ritual proceeds according to the exact specifications.",
            "The Grandmaster would be proud.",
            "Stability through proper procedure.",
            "No deviations from tradition.",
            "Order maintained, chaos prevented."
          ],
          payMultiplier: 1.0
        },
        partial: {
          messages: [
            "Minor improvisations are noted.",
            "The rituals work but lack perfect form.",
            "You have to correct several practitioners.",
            "Tradition is mostly upheld.",
            "Adequate though not flawless supervision."
          ],
          payMultiplier: 0.7,
          damage: { mp: 20 }
        },
        failure: {
          messages: [
            "The ritual deviates dangerously from protocol.",
            "You can't control the practitioners.",
            "Magical energies become unstable.",
            "The Loyalists question your commitment.",
            "Chaos threatens order."
          ],
          payMultiplier: 0.25,
          damage: { hp: 15, mp: 30 },
          status: [STATUS.STATIC]
        },
        disaster: {
          messages: [
            "The ritual goes catastrophically wrong!",
            "Wild magic erupts everywhere!",
            "Guild property is damaged!",
            "Your lax supervision is blamed!",
            "You're stripped of supervisory duties!"
          ],
          payMultiplier: -1.2,
          damage: { hp: 40, mp: 50 },
          status: [STATUS.CONFUSION, STATUS.PARALYSIS]
        }
      }
    },

    {
      id: 102,
      name: "Anti-Technology Enforcer",
      name_int: "",
name_it: "Applicatore Anti-Tecnologia",
      category: JOB_CATEGORIES.FACTION,
      factionId: 4, // Traditionalists
      description: "Seek out and destroy illegal techno-magical fusion devices.",
      description_it: "Cerca e distruggi dispositivi illegali di fusione tecno-magica.",
      duration: 8,
      basePay: 160,
      locations:[], 
requirements: {
        MAT: 30,
        Arcane: 35,
        Intimidation: 25,
        ATK: 20
      },
      outcomes: {
        success: {
          messages: [
            "Heretical devices are purged with fire and fury.",
            "Magic remains pure and untainted.",
            "The old ways are preserved.",
            "Technology corrupts; you prevent it.",
            "Another successful raid against modernity."
          ],
          payMultiplier: 1.0
        },
        partial: {
          messages: [
            "Some devices destroyed but others hidden.",
            "The technomancers flee before you arrive.",
            "You confiscate most contraband.",
            "The impure magic leaves you feeling unclean.",
            "Adequate enforcement of tradition."
          ],
          payMultiplier: 0.75,
          damage: { hp: 15, mp: 20 },
          status: [STATUS.STATIC]
        },
        failure: {
          messages: [
            "The technomancers overpower you.",
            "Their machines malfunction dangerously.",
            "You can't find the hidden workshops.",
            "Technology defeats tradition today.",
            "The Traditionalists are disappointed."
          ],
          payMultiplier: 0.3,
          damage: { hp: 30, mp: 30 },
          status: [STATUS.STATIC, STATUS.BURNED]
        },
        disaster: {
          messages: [
            "A techno-magical device explodes!",
            "You're caught in a machine's malfunction!",
            "Technomancers capture and humiliate you!",
            "Expensive Guild property is destroyed!",
            "Your failure becomes a cautionary tale!"
          ],
          payMultiplier: -1.0,
          damage: { hp: 55, mp: 40 },
          status: [STATUS.BURNED, STATUS.STATIC, STATUS.PARALYSIS]
        }
      }
    },

    {
      id: 103,
      name: "Magitech Engineer",
      name_int: "",
name_it: "Ingegnere Magitech",
      category: JOB_CATEGORIES.FACTION,
      factionId: 5, // Technomancers
      description: "Develop experimental fusion of magic and machinery.",
      description_it: "Sviluppa fusioni sperimentali di magia e macchinari.",
      duration: 9,
      basePay: 200,
      locations:[], 
requirements: {
        MAT: 35,
        Arcane: 35,
        Substance: 35,
        LUK: 20
      },
      outcomes: {
        success: {
          messages: [
            "The sigils integrate perfectly with the engine!",
            "A breakthrough in magitech design!",
            "Progress marches forward!",
            "The future is now!",
            "Magic and machine in perfect harmony!"
          ],
          payMultiplier: 1.2
        },
        partial: {
          messages: [
            "The device works but is unstable.",
            "Minor explosions are part of progress.",
            "You advance the cause incrementally.",
            "Not all experiments succeed.",
            "Science requires sacrifice."
          ],
          payMultiplier: 0.7,
          damage: { hp: 20, mp: 25 },
          status: [STATUS.BURNED, STATUS.STATIC]
        },
        failure: {
          messages: [
            "The magical and mechanical systems reject each other.",
            "Catastrophic system failure.",
            "The experiment sets you back months.",
            "Your theories were flawed.",
            "The Technomancers question your competence."
          ],
          payMultiplier: 0.25,
          damage: { hp: 35, mp: 40 },
          status: [STATUS.BURNED, STATUS.STATIC, STATUS.CONFUSION]
        },
        disaster: {
          messages: [
            "The magitech device explodes violently!",
            "A magical feedback loop nearly kills you!",
            "The entire laboratory is destroyed!",
            "Years of research go up in flames!",
            "You're banned from experimental work!"
          ],
          payMultiplier: -2.0,
          damage: { hp: 70, mp: 60 },
          status: [STATUS.BURNED, STATUS.PARALYSIS, STATUS.CONFUSION]
        }
      }
    },

    {
      id: 104,
      name: "Spell Categorization Clerk",
      name_int: "",
name_it: "Impiegato Categorizzazione Incantesimi",
      category: JOB_CATEGORIES.FACTION,
      factionId: 6, // 92 schools branch
      description: "Meticulously categorize spells into the 92 distinct schools.",
      description_it: "Categorizza meticolosamente gli incantesimi nelle 92 scuole distinte.",
      duration: 10,
      basePay: 110,
      locations:[], 
requirements: {
        MAT: 30,
        Arcane: 40,
        LUK: 10
      },
      outcomes: {
        success: {
          messages: [
            "Every spell properly classified and filed.",
            "The taxonomies are perfection.",
            "Order from chaos through categorization.",
            "92 schools, no exceptions.",
            "Academic rigor at its finest."
          ],
          payMultiplier: 1.0
        },
        partial: {
          messages: [
            "Most spells categorized correctly.",
            "One spell defies easy classification.",
            "The minutiae is mentally exhausting.",
            "Your eyes blur from reading ancient texts.",
            "Adequate if tedious work."
          ],
          payMultiplier: 0.75,
          damage: { mp: 30 }
        },
        failure: {
          messages: [
            "You misclassify several important spells.",
            "The system's complexity defeats you.",
            "Colleagues point out numerous errors.",
            "The 92 schools blur together.",
            "Your classifications are rejected."
          ],
          payMultiplier: 0.2,
          damage: { mp: 40 },
          status: [STATUS.CONFUSION]
        },
        disaster: {
          messages: [
            "You accidentally merge two schools!",
            "Your errors corrupt the entire database!",
            "Decades of work must be redone!",
            "The 92 schools branch is in chaos!",
            "You're expelled from academic circles!"
          ],
          payMultiplier: -0.9,
          damage: { mp: 60 },
          status: [STATUS.CONFUSION, STATUS.NAUSEA]
        }
      }
    },

    // ============================================================
    // FACTION JOBS - ARCHIVE FOUNDATION (Faction ID: 1)
    // ============================================================
    {
      id: 105,
      name: "Document Redactor",
      name_int: "",
name_it: "Oscuratore di Documenti",
      category: JOB_CATEGORIES.FACTION,
      factionId: 1, // Archive Foundation
      description: "Remove dangerous knowledge from historical texts.",
      description_it: "Rimuovi conoscenza pericolosa dai testi storici.",
      duration: 8,
      basePay: 150,
      locations:[], 
requirements: {
        Arcane: 25,
        Stealth: 20,
        Substance: 25
      },
      outcomes: {
        success: {
          messages: [
            "Dangerous truths safely erased.",
            "The people are protected from knowledge.",
            "History is properly sanitized.",
            "Another day preserving ignorance.",
            "Containment protocols upheld."
          ],
          payMultiplier: 1.0
        },
        partial: {
          messages: [
            "Most dangerous information removed.",
            "Some texts are difficult to redact cleanly.",
            "Your hand cramps from the meticulous work.",
            "Adequate censorship performed.",
            "The tedium is mind-numbing."
          ],
          payMultiplier: 0.75,
          damage: { mp: 15 }
        },
        failure: {
          messages: [
            "You miss several dangerous passages.",
            "The censorship is obviously incomplete.",
            "Superiors question your commitment.",
            "Knowledge slips through your fingers.",
            "The Foundation is displeased."
          ],
          payMultiplier: 0.3,
          damage: { mp: 25 }
        },
        disaster: {
          messages: [
            "You accidentally publish an uncensored text!",
            "Forbidden knowledge spreads!",
            "The Foundation's containment is breached!",
            "Your career is destroyed!",
            "You're marked as a security risk!"
          ],
          payMultiplier: -1.0,
          damage: { hp: 20, mp: 40 },
          status: [STATUS.CONFUSION, STATUS.PARALYSIS]
        }
      }
    },

    {
      id: 106,
      name: "Artifact Thief",
      name_int: "",
name_it: "Ladro di Artefatti",
      category: JOB_CATEGORIES.FACTION,
      factionId: 20, // Data Acquisition Department
      description: "Steal historical artifacts for the Foundation's collection.",
      description_it: "Ruba artefatti storici per la collezione della Fondazione.",
      duration: 8,
      basePay: 250,
      locations:[], 
requirements: {
        Stealth: 40,
        AGI: 35,
        Arcane: 25,
        LUK: 25
      },
      outcomes: {
        success: {
          messages: [
            "The artifact is acquired without incident.",
            "Your theft is undetected.",
            "Another relic secured for the Foundation.",
            "Professional extraction.",
            "Knowledge contained, mission complete."
          ],
          payMultiplier: 1.0
        },
        partial: {
          messages: [
            "The artifact is secured but alarms triggered.",
            "You're pursued but escape.",
            "The extraction was messier than planned.",
            "Mission successful but not clean.",
            "The Foundation gets what it wants."
          ],
          payMultiplier: 0.7,
          damage: { hp: 20 },
          status: [STATUS.BLEEDING]
        },
        failure: {
          messages: [
            "The security was too tight.",
            "You're forced to abort the mission.",
            "The artifact remains beyond reach.",
            "Your infiltration is detected and thwarted.",
            "The Foundation is disappointed."
          ],
          payMultiplier: 0.2,
          damage: { hp: 30 },
          status: [STATUS.BLEEDING, STATUS.STUN]
        },
        disaster: {
          messages: [
            "You're caught red-handed!",
            "The artifact is destroyed in the chaos!",
            "Guards beat you unconscious!",
            "The Foundation disavows you!",
            "You're imprisoned and interrogated!"
          ],
          payMultiplier: -1.5,
          damage: { hp: 70 },
          status: [STATUS.BLEEDING, STATUS.STUN, STATUS.CONFUSION]
        }
      }
    },

    {
      id: 107,
      name: "Silent Librarian",
      name_int: "",
name_it: "Bibliotecario Silenzioso",
      category: JOB_CATEGORIES.FACTION,
      factionId: 21, // Knowledge Preservation Division
      description: "Maintain the archives and permanently silence noisy patrons.",
      description_it: "Mantieni gli archivi e zittisci permanentemente i visitatori rumorosi.",
      duration: 8,
      basePay: 140,
      locations:[], 
requirements: {
        Stealth: 30,
        Intimidation: 35,
        ATK: 25
      },
      outcomes: {
        success: {
          messages: [
            "The library remains perfectly silent.",
            "Disruptive patrons are... dealt with.",
            "The books are preserved, order maintained.",
            "Silence is golden, and blood red.",
            "Another quiet day in the archives."
          ],
          payMultiplier: 1.0
        },
        partial: {
          messages: [
            "Most disruptions are handled.",
            "One patron escapes before silencing.",
            "The cleanup is messy.",
            "Order is mostly restored.",
            "An acceptable day's work."
          ],
          payMultiplier: 0.75,
          damage: { hp: 10 },
          status: [STATUS.BLEEDING]
        },
        failure: {
          messages: [
            "Chaos erupts in the library.",
            "You can't silence the disturbances.",
            "Patrons flee in terror.",
            "The Foundation questions your methods.",
            "Order collapses."
          ],
          payMultiplier: 0.3,
          damage: { hp: 25 },
          status: [STATUS.BLEEDING, STATUS.STUN]
        },
        disaster: {
          messages: [
            "You accidentally kill an important scholar!",
            "Books are destroyed in the struggle!",
            "Word of the murders spreads!",
            "The Foundation is exposed!",
            "You become a liability!"
          ],
          payMultiplier: -1.2,
          damage: { hp: 45 },
          status: [STATUS.BLEEDING, STATUS.CONFUSION]
        }
      }
    },

    {
      id: 108,
      name: "Propaganda Writer",
      name_int: "",
name_it: "Scrittore di Propaganda",
      category: JOB_CATEGORIES.FACTION,
      factionId: 22, // Public Transparency Unit
      description: "Craft convincing misinformation for public consumption.",
      description_it: "Crea disinformazione convincente per il consumo pubblico.",
      duration: 7,
      basePay: 130,
      locations:[], 
requirements: {
        MAT: 30,
        LUK: 25,
        Intimidation: 20
      },
      outcomes: {
        success: {
          messages: [
            "Your lies are perfectly believable.",
            "The public accepts the narrative completely.",
            "Truth is what we say it is.",
            "Another successful information campaign.",
            "The irony of your unit's name amuses you."
          ],
          payMultiplier: 1.0
        },
        partial: {
          messages: [
            "Most people believe the story.",
            "Some skeptics question the narrative.",
            "The propaganda is adequate if uninspired.",
            "Enough believe to matter.",
            "Plausible if not perfect."
          ],
          payMultiplier: 0.75
        },
        failure: {
          messages: [
            "The lies are obviously transparent.",
            "The public sees through the propaganda.",
            "Your narrative collapses under scrutiny.",
            "The Foundation is displeased.",
            "Truth slips through your censorship."
          ],
          payMultiplier: 0.25
        },
        disaster: {
          messages: [
            "Your propaganda exposes Foundation secrets!",
            "The truth accidentally leaks out!",
            "Public outrage erupts!",
            "You're blamed for the disaster!",
            "Your career in misinformation is over!"
          ],
          payMultiplier: -0.9,
          damage: { mp: 40 },
          status: [STATUS.CONFUSION]
        }
      }
    },

    {
      id: 109,
      name: "Internal Investigator",
      name_int: "",
name_it: "Investigatore Interno",
      category: JOB_CATEGORIES.FACTION,
      factionId: 23, // Internal Compliance Unit
      description: "Root out information leaks within the Foundation.",
      description_it: "Scova perdite di informazioni all'interno della Fondazione.",
      duration: 9,
      basePay: 180,
       locations:[], 
requirements: {
        Stealth: 35,
        Intimidation: 35,
        LUK: 25,
        MAT: 20
      },
      outcomes: {
        success: {
          messages: [
            "You uncover and eliminate a leak.",
            "The secret police succeed again.",
            "Loyalty is enforced through fear.",
            "The Foundation's secrets remain safe.",
            "Internal security maintained."
          ],
          payMultiplier: 1.0
        },
        partial: {
          messages: [
            "You identify suspects but lack proof.",
            "Some evidence slips away.",
            "The investigation is inconclusive.",
            "Internal tensions rise.",
            "Adequate if imperfect security."
          ],
          payMultiplier: 0.7,
          damage: { hp: 15 }
        },
        failure: {
          messages: [
            "The leak continues undetected.",
            "Your investigation goes nowhere.",
            "Suspects elude your grasp.",
            "The secret police are outwitted.",
            "Information continues to leak."
          ],
          payMultiplier: 0.3,
          damage: { hp: 25 }
        },
        disaster: {
          messages: [
            "You're discovered to be the leak!",
            "Your investigation exposes YOU!",
            "The secret police turn on you!",
            "You're interrogated and tortured!",
            "Your life in the Foundation is over!"
          ],
          payMultiplier: -1.5,
          damage: { hp: 65 },
          status: [STATUS.BLEEDING, STATUS.STUN, STATUS.CONFUSION]
        }
      }
    },

    // ============================================================
    // FACTION JOBS - HYPERCAPITALIST COLLECTIVE (Faction ID: 2)
    // ============================================================
    {
      id: 110,
      name: "Market Manipulator",
      name_int: "",
name_it: "Manipolatore di Mercato",
      category: JOB_CATEGORIES.FACTION,
      factionId: 2, // Hypercapitalist Collective
      description: "Manipulate markets for profit through any means necessary.",
      description_it: "Manipola i mercati per profitto con qualsiasi mezzo necessario.",
      duration: 8,
      basePay: 200,
      locations:[], 
requirements: {
        LUK: 30,
        Intimidation: 25,
        Substance: 20,
        MAT: 25
      },
      outcomes: {
        success: {
          messages: [
            "The market bends to your will.",
            "Profit margins soar!",
            "The invisible hand guides your trades.",
            "Capitalism at its finest.",
            "Another successful manipulation."
          ],
          payMultiplier: 1.5
        },
        partial: {
          messages: [
            "Modest gains from market movements.",
            "Some trades go against you.",
            "Profit is made but not maximized.",
            "The market is unpredictable today.",
            "Adequate returns."
          ],
          payMultiplier: 0.8
        },
        failure: {
          messages: [
            "The market moves against you.",
            "Your manipulation is detected.",
            "Losses mount quickly.",
            "The Collective is disappointed.",
            "Even the free market has limits."
          ],
          payMultiplier: 0.2,
          damage: { mp: 30 }
        },
        disaster: {
          messages: [
            "A market crash wipes out your position!",
            "Regulators investigate your activities!",
            "Massive losses are incurred!",
            "The Collective demands compensation!",
            "Your financial reputation is destroyed!"
          ],
          payMultiplier: -2.5,
          damage: { mp: 50 },
          status: [STATUS.CONFUSION, STATUS.NAUSEA]
        }
      }
    },

    {
      id: 111,
      name: "Oil Extraction Overseer",
      name_int: "",
name_it: "Supervisore Estrazione Petrolio",
      category: JOB_CATEGORIES.FACTION,
      factionId: 15, // Petromanagers
      description: "Maximize oil extraction efficiency through infernal optimization.",
      description_it: "Massimizza l'efficienza dell'estrazione petrolifera attraverso ottimizzazione infernale.",
      duration: 10,
      basePay: 220,
      locations:[], 
requirements: {
        Intimidation: 35,
        Substance: 30,
        ATK: 25,
        MAT: 25
      },
      outcomes: {
        success: {
          messages: [
            "Extraction rates hit record highs!",
            "The pact delivers results.",
            "Black gold flows endlessly.",
            "Efficiency through damnation.",
            "Hell's managers are pleased."
          ],
          payMultiplier: 1.2
        },
        partial: {
          messages: [
            "Extraction goals mostly met.",
            "Minor equipment failures slow progress.",
            "The workers are exhausted.",
            "Adequate if not exceptional output.",
            "The infernal quotas loom."
          ],
          payMultiplier: 0.75,
          damage: { hp: 15 },
          status: [STATUS.BURNED]
        },
        failure: {
          messages: [
            "Extraction rates fall below targets.",
            "Equipment failures cascade.",
            "The infernal pact demands more.",
            "Your soul is questioned.",
            "Managers don't accept excuses."
          ],
          payMultiplier: 0.25,
          damage: { hp: 35 },
          status: [STATUS.BURNED, STATUS.NAUSEA]
        },
        disaster: {
          messages: [
            "A well explodes catastrophically!",
            "Workers die in the inferno!",
            "The infernal pact demands your soul NOW!",
            "Massive damages and deaths!",
            "Hell comes to collect!"
          ],
          payMultiplier: -2.0,
          damage: { hp: 75 },
          status: [STATUS.BURNED, STATUS.BLEEDING, STATUS.CONFUSION]
        }
      }
    },

    {
      id: 112,
      name: "High-Speed Courier",
      name_int: "",
name_it: "Corriere ad Alta Velocità",
      category: JOB_CATEGORIES.FACTION,
      factionId: 16, // Speed demons
      description: "Deliver packages at breakneck speeds, worshipping velocity.",
      description_it: "Consegna pacchi a velocità folle, adorando la velocità.",
      duration: 5,
      basePay: 180,
      locations:[], 
requirements: {
        AGI: 40,
        LUK: 30,
        DEF: 20
      },
      outcomes: {
        success: {
          messages: [
            "You break your personal speed record!",
            "Velocity is ecstasy!",
            "The packages arrive impossibly fast!",
            "Speed is life, slowness is death!",
            "The engine screams in joy!"
          ],
          payMultiplier: 1.4
        },
        partial: {
          messages: [
            "Fast, but not fast enough.",
            "A near-collision slows you down.",
            "The speed high is diminished.",
            "Adequate velocity achieved.",
            "You hunger for more speed."
          ],
          payMultiplier: 0.8,
          damage: { hp: 20 }
        },
        failure: {
          messages: [
            "You crash trying to go too fast!",
            "Speed betrays you!",
            "The packages are destroyed!",
            "Slowness is death, and you were slow!",
            "The Speed Demons mock you!"
          ],
          payMultiplier: 0.2,
          damage: { hp: 45 },
          status: [STATUS.BLEEDING, STATUS.STUN]
        },
        disaster: {
          messages: [
            "A catastrophic high-speed crash!",
            "Your vehicle explodes!",
            "Multiple packages and vehicles destroyed!",
            "You're banned from high-octane fuel!",
            "Speed has claimed another victim!"
          ],
          payMultiplier: -1.8,
          damage: { hp: 80 },
          status: [STATUS.BURNED, STATUS.BLEEDING, STATUS.STUN]
        }
      }
    },

    {
      id: 113,
      name: "Fuel Monopoly Enforcer",
      name_int: "",
name_it: "Applicatore Monopolio Carburante",
      category: JOB_CATEGORIES.FACTION,
      factionId: 17, // Seven Sisters
      description: "Ensure the Seven Sisters maintain total fuel market control.",
      description_it: "Assicura che le Sette Sorelle mantengano il controllo totale del mercato carburante.",
      duration: 8,
      basePay: 200,
      locations:[], 
requirements: {
        ATK: 30,
        Intimidation: 40,
        Stealth: 25,
        LUK: 20
      },
      outcomes: {
        success: {
          messages: [
            "Competitors are eliminated efficiently.",
            "The monopoly is secure.",
            "Independent refineries burn.",
            "Market control is absolute.",
            "The Seven Sisters reward loyalty."
          ],
          payMultiplier: 1.1
        },
        partial: {
          messages: [
            "Some competitors resist.",
            "The enforcement is messy.",
            "Monopoly control is maintained but challenged.",
            "Violence was necessary.",
            "Adequate market domination."
          ],
          payMultiplier: 0.75,
          damage: { hp: 25 },
          status: [STATUS.BLEEDING]
        },
        failure: {
          messages: [
            "Competitors stand their ground.",
            "Your enforcement fails.",
            "The monopoly is threatened.",
            "The Seven Sisters are displeased.",
            "Market control slips."
          ],
          payMultiplier: 0.3,
          damage: { hp: 40 },
          status: [STATUS.BLEEDING, STATUS.STUN]
        },
        disaster: {
          messages: [
            "A competitor destroys your refinery!",
            "The enforcement backfires spectacularly!",
            "Public outrage threatens the monopoly!",
            "The Seven Sisters abandon you!",
            "Your failure costs millions!"
          ],
          payMultiplier: -2.2,
          damage: { hp: 65 },
          status: [STATUS.BURNED, STATUS.BLEEDING, STATUS.STUN]
        }
      }
    },

    // ============================================================
    // FACTION JOBS - ERIS' COURT (Faction ID: 7)
    // ============================================================
    {
      id: 114,
      name: "Divine Chaos Agent",
      name_int: "",
name_it: "Agente del Caos Divino",
      category: JOB_CATEGORIES.FACTION,
      factionId: 7, // Eris' Court
      description: "Spread discord and disruption in the name of the Goddess of Chaos.",
      description_it: "Diffondi discordia e disordine nel nome della Dea del Caos.",
      duration: 6,
      basePay: 150,
      locations:[], 
requirements: {
        LUK: 35,
        Stealth: 30,
        Intimidation: 25
      },
      outcomes: {
        success: {
          messages: [
            "Glorious chaos spreads in your wake!",
            "Eris smiles upon your disruption!",
            "Order crumbles before discord!",
            "Bureaucrats tear their hair out!",
            "Beautiful, beautiful chaos!"
          ],
          payMultiplier: 1.3
        },
        partial: {
          messages: [
            "Minor disruptions achieved.",
            "The chaos is contained too quickly.",
            "Eris expects more from you.",
            "Adequate discord sown.",
            "Order proves resilient today."
          ],
          payMultiplier: 0.7
        },
        failure: {
          messages: [
            "Your chaos is quickly suppressed.",
            "Order prevails today.",
            "The disruption fails to spread.",
            "Eris is disappointed.",
            "Boring stability wins."
          ],
          payMultiplier: 0.2
        },
        disaster: {
          messages: [
            "Your chaos turns on you!",
            "Order's champions beat you down!",
            "Eris laughs at your failure!",
            "The chaos consumes YOU!",
            "Even discord has consequences!"
          ],
          payMultiplier: -0.8,
          damage: { hp: 50 },
          status: [STATUS.CONFUSION, STATUS.RAGE]
        }
      }
    },

    // ============================================================
    // FACTION JOBS - VATICAN (Faction ID: 27)
    // ============================================================
    {
      id: 124,
      name: "Vatican Scribe",
      name_int: "",
name_it: "Scriba Vaticano",
      category: JOB_CATEGORIES.FACTION,
      factionId: 27, // Vatican
      description: "Transcribe and maintain sacred texts and church documents.",
      description_it: "Trascrivi e mantieni testi sacri e documenti della chiesa.",
      duration: 8,
      basePay: 130,
      locations:[], 
requirements: {
        MAT: 30,
        Arcane: 25,
        LUK: 15
      },
      outcomes: {
        success: {
          messages: [
            "Every word perfectly transcribed.",
            "The sacred texts are preserved.",
            "Your devotion shows in your work.",
            "The church is pleased.",
            "Another day in service of faith."
          ],
          payMultiplier: 1.0
        },
        partial: {
          messages: [
            "Most texts transcribed correctly.",
            "Your hand cramps from the writing.",
            "A few minor errors slip through.",
            "Adequate service to the church.",
            "The work is tedious but holy."
          ],
          payMultiplier: 0.75
        },
        failure: {
          messages: [
            "Multiple transcription errors.",
            "You misquote sacred scripture!",
            "The texts are corrupted by mistakes.",
            "The church is disappointed.",
            "Your devotion is questioned."
          ],
          payMultiplier: 0.25
        },
        disaster: {
          messages: [
            "You spill ink on a priceless manuscript!",
            "Sacred texts are ruined!",
            "The church brands you incompetent!",
            "Centuries of work destroyed!",
            "You're excommunicated from scribal duties!"
          ],
          payMultiplier: -1.5,
          damage: { mp: 40 },
          status: [STATUS.CONFUSION]
        }
      }
    },

    {
      id: 127,
      name: "Battle Nun Trainee",
      name_int: "",
name_it: "Allieva Suora da Battaglia",
      category: JOB_CATEGORIES.FACTION,
      factionId: 30, // Battle Nuns
      description: "Train in both scripture and combat as a Vatican special forces operative.",
      description_it: "Addestrati sia nelle scritture che nel combattimento come operativa delle forze speciali vaticane.",
      duration: 10,
      basePay: 170,
      locations:[], 
requirements: {
        ATK: 35,
        DEF: 30,
        MAT: 25,
        Arcane: 25
      },
      outcomes: {
        success: {
          messages: [
            "Your devotion and combat skills impress.",
            "Scripture and steel in perfect harmony.",
            "The Lord's wrath flows through you.",
            "Holy violence perfected.",
            "A warrior nun is born."
          ],
          payMultiplier: 1.0
        },
        partial: {
          messages: [
            "The training is brutally demanding.",
            "You excel at combat but struggle with theology.",
            "Scripture and violence don't mix easily.",
            "Adequate progress in training.",
            "The holy warrior path is difficult."
          ],
          payMultiplier: 0.75,
          damage: { hp: 30 }
        },
        failure: {
          messages: [
            "The training defeats you.",
            "You're not strong enough for this order.",
            "Scripture and combat both escape you.",
            "The Battle Nuns reject you.",
            "Holy warfare requires more."
          ],
          payMultiplier: 0.25,
          damage: { hp: 50 },
          status: [STATUS.BLEEDING]
        },
        disaster: {
          messages: [
            "A training accident nearly kills you!",
            "You accidentally attack a superior!",
            "Your faith wavers under pressure!",
            "The Battle Nuns deem you unworthy!",
            "You're expelled from the order!"
          ],
          payMultiplier: -0.8,
          damage: { hp: 75 },
          status: [STATUS.BLEEDING, STATUS.STUN, STATUS.CONFUSION]
        }
      }
    },

    // ============================================================
    // MORE GENERAL JOBS TO ROUND OUT THE LIST
    // ============================================================
    {
      id: 128,
      name: "Night Watchman",
      name_int: "",
name_it: "Guardiano Notturno",
      category: JOB_CATEGORIES.GENERAL,
      description: "Guard property through the dangerous night hours.",
      description_it: "Sorveglia proprietà durante le pericolose ore notturne.",
      duration: 10,
      basePay: 110,
      locations:[], 
requirements: {
        DEF: 20,
        AGI: 15,
        Intimidation: 20
      },
      outcomes: {
        success: {
          messages: [
            "A quiet night on watch.",
            "No incidents to report.",
            "Your presence deters trouble.",
            "The property is secure.",
            "Another peaceful night."
          ],
          payMultiplier: 1.0
        },
        partial: {
          messages: [
            "Some suspicious activity but nothing major.",
            "You doze off once or twice.",
            "A long, boring night.",
            "Adequate security provided.",
            "The night drags on endlessly."
          ],
          payMultiplier: 0.75,
          damage: { mp: 20 }
        },
        failure: {
          messages: [
            "You fall asleep on duty!",
            "Thieves break in while you're distracted!",
            "Property is stolen on your watch!",
            "You're fired immediately!",
            "One job you had: stay awake!"
          ],
          payMultiplier: 0.1,
          damage: { mp: 30 },
          status: [STATUS.SLEEP]
        },
        disaster: {
          messages: [
            "A major robbery occurs on your watch!",
            "You're beaten unconscious by thieves!",
            "Everything is stolen!",
            "You must compensate for the losses!",
            "Your career as a watchman is over!"
          ],
          payMultiplier: -1.5,
          damage: { hp: 60 },
          status: [STATUS.STUN, STATUS.BLEEDING]
        }
      }
    },

    {
      id: 129,
      name: "Fisherman",
      name_int: "",
name_it: "Pescatore",
      category: JOB_CATEGORIES.LABOR,
      description: "Catch fish for sale at the market.",
      description_it: "Pesca pesce per venderlo al mercato.",
      duration: 8,
      basePay: 95,
      locations:[], 
requirements: {
        AGI: 20,
        LUK: 30,
        DEF: 15
      },
      outcomes: {
        success: {
          messages: [
            "The nets are full!",
            "A bountiful catch today.",
            "The fish are practically jumping into your boat.",
            "The market will pay well for this haul.",
            "A fisherman's perfect day."
          ],
          payMultiplier: 1.3
        },
        partial: {
          messages: [
            "A modest catch.",
            "Enough fish to make it worthwhile.",
            "The fish weren't biting much today.",
            "Adequate haul for the effort.",
            "You've caught better before."
          ],
          payMultiplier: 0.8
        },
        failure: {
          messages: [
            "The fish aren't biting at all.",
            "You return nearly empty-handed.",
            "Hours wasted for almost nothing.",
            "A fisherman's worst day.",
            "Maybe tomorrow will be better."
          ],
          payMultiplier: 0.2
        },
        disaster: {
          messages: [
            "Your boat capsizes!",
            "Equipment is lost to the depths!",
            "You nearly drown!",
            "The replacement cost exceeds your earnings!",
            "Perhaps fishing isn't for you!"
          ],
          payMultiplier: -1.2,
          damage: { hp: 35 },
          status: [STATUS.WET, STATUS.COLD]
        }
      }
    },

    {
      id: 130,
      name: "Street Cleaner",
      name_int: "",
name_it: "Spazzino",
      category: JOB_CATEGORIES.LABOR,
      description: "Clean the filthy city streets.",
      description_it: "Pulisci le sporche strade cittadine.",
      duration: 8,
      basePay: 80,
      locations:[], 
requirements: {
        ATK: 15,
        DEF: 20
      },
      outcomes: {
        success: {
          messages: [
            "The streets are spotless.",
            "Honest work, honest pay.",
            "You take pride in a clean city.",
            "The work is simple but necessary.",
            "Another area cleaned thoroughly."
          ],
          payMultiplier: 1.0
        },
        partial: {
          messages: [
            "Most areas cleaned adequately.",
            "The filth seems endless.",
            "Your back aches from the labor.",
            "Good enough for today.",
            "The city stays dirty no matter what."
          ],
          payMultiplier: 0.75,
          damage: { hp: 10 }
        },
        failure: {
          messages: [
            "You can't keep up with the filth.",
            "The work overwhelms you.",
            "You give up halfway through.",
            "The supervisor is disappointed.",
            "The streets remain dirty."
          ],
          payMultiplier: 0.3,
          damage: { hp: 15 },
          status: [STATUS.NAUSEA]
        },
        disaster: {
          messages: [
            "You fall into a sewer!",
            "Disease spreads from untreated waste!",
            "You're infected by toxic refuse!",
            "Medical treatment costs more than you earn!",
            "The city's filth defeats you!"
          ],
          payMultiplier: -0.8,
          damage: { hp: 40 },
          status: [STATUS.INFECTED, STATUS.POISON, STATUS.NAUSEA]
        }
      }
    }
  ];

  // Export the database
  window.WorkSystemDB.JOBS = JOBS;
  window.WorkSystemDB.JOB_CATEGORIES = JOB_CATEGORIES;
  window.WorkSystemDB.STATUS = STATUS;

  // Helper function to get job by ID
  window.WorkSystemDB.getJob = function(jobId) {
    return JOBS.find(job => job.id === jobId);
  };

  // Helper function to get jobs by category
  window.WorkSystemDB.getJobsByCategory = function(category) {
    return JOBS.filter(job => job.category === category);
  };

  // Helper function to get faction jobs
  window.WorkSystemDB.getFactionJobs = function(factionId) {
    return JOBS.filter(job => job.factionId === factionId);
  };

  // Helper function to check if actor meets requirements
  window.WorkSystemDB.meetsRequirements = function(actor, job) {
    const requirements = job.requirements;
    const results = {
      meets: true,
      deficits: []
    };

    for (const [stat, required] of Object.entries(requirements)) {
      let actorValue = 0;

      // Get actor's stat value
      switch(stat) {
        case 'ATK': actorValue = actor.atk; break;
        case 'DEF': actorValue = actor.def; break;
        case 'MAT': actorValue = actor.mat; break;
        case 'MDF': actorValue = actor.mdf; break;
        case 'AGI': actorValue = actor.agi; break;
        case 'LUK': actorValue = actor.luk; break;
        case 'HP': actorValue = actor.mhp; break;
        case 'MP': actorValue = actor.mmp; break;
        case 'Arcane': actorValue = $gameVariables.value(86); break;
        case 'Substance': actorValue = $gameVariables.value(87); break;
        case 'Stealth': actorValue = $gameVariables.value(88); break;
        case 'Intimidation': actorValue = $gameVariables.value(89); break;
      }

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
  window.WorkSystemDB.calculateSuccessChance = function(actor, job) {
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

  console.log('WorkSystemDB loaded: ' + JOBS.length + ' jobs available');

})();

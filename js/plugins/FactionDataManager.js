/*:
 * @plugindesc Faction Reputation System for RPG Maker RZ
 * @author Omni-Lex
 *
 * @param showInMenu
 * @text Show in Menu
 * @type boolean
 * @default true
 * @desc Whether to add the Faction Status option to the main menu.
 *
 * @param menuText
 * @text Menu Command Text
 * @type string
 * @default Factions
 * @desc The text shown for the Faction Status command in the menu.
 *
 * @param startingValues
 * @text Starting Reputation Values
 * @type string
 * @default 0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0
 * @desc Comma-separated starting values for factions.
 *
 * @command open
 * @text Open Faction Screen
 * @desc Opens the faction reputation screen.
 *
 * @command setReputation
 * @text Set Reputation
 * @desc Sets a faction's reputation to a specific value.
 * @arg factionId
 * @type number
 * @min 0
 * @max 17
 * @desc The ID of the faction (0-17).
 * @arg value
 * @type number
 * @min -100
 * @max 100
 * @desc The reputation value (-100 to 100).
 *
 * @command changeReputation
 * @text Change Reputation
 * @desc Changes a faction's reputation by the specified amount.
 * @arg factionId
 * @type number
 * @min 0
 * @max 17
 * @desc The ID of the faction (0-17).
 * @arg change
 * @type number
 * @min -100
 * @max 100
 * @desc The amount to change reputation by (-100 to 100).
 *
 * @command getFactionsByType
 * @text Get Factions by Type
 * @desc Gets all factions of a specific type and stores their count and IDs in variables.
 * @arg typeName
 * @type select
 * @option hardcoded
 * @desc The type of factions to get.
 * @arg variableId
 * @type variable
 * @desc The variable ID to store the count in. Subsequent variables will store faction IDs.
 *
 * @command getHighestReputationFaction
 * @text Get Highest Reputation Faction
 * @desc Gets the faction ID with the highest reputation.
 * @arg variableId
 * @type variable
 * @desc The variable ID to store the faction ID in.
 *
 * @command getLowestReputationFaction
 * @text Get Lowest Reputation Faction
 * @desc Gets the faction ID with the lowest reputation.
 * @arg variableId
 * @type variable
 * @desc The variable ID to store the faction ID in.
 *
 * @command checkQuestAvailability
 * @text Check Quest Availability
 * @desc Checks if a quest is available based on faction reputation.
 * @arg questId
 * @type number
 * @desc The ID of the quest.
 * @arg factionId
 * @type number
 * @min 0
 * @max 17
 * @desc The ID of the faction (0-17).
 * @arg requiredRep
 * @type number
 * @min -100
 * @max 100
 * @desc The required reputation (-100 to 100).
 * @arg switchId
 * @type switch
 * @desc The switch ID to store the result in (ON if available).
 *
 * @command getAvailableQuestCount
 * @text Get Available Quest Count
 * @desc Gets the number of available quests for a faction.
 * @arg factionId
 * @type number
 * @min 0
 * @max 17
 * @desc The ID of the faction (0-17).
 * @arg variableId
 * @type variable
 * @desc The variable ID to store the count in.
 *
 * @help
 * This plugin implements a faction reputation system with 3 hardcoded factions
 * and 7 procedurally generated factions. Reputation ranges from -100 to +100.
 *
 * Plugin Commands:
 *
 * FactionReputationSystem open
 *   - Opens the faction reputation screen
 *
 * FactionReputationSystem setReputation factionId value
 *   - Sets a faction's reputation to a specific value
 *   - Example: FactionReputationSystem setReputation 0 50
 *
 * FactionReputationSystem changeReputation factionId change
 *   - Changes a faction's reputation by the specified amount
 *   - Example: FactionReputationSystem changeReputation 0 10
 *
 * Script Calls:
 *   $gameFactions.getReputation(factionId) - Get reputation value
 *   $gameFactions.setReputation(factionId, value) - Set reputation
 *   $gameFactions.getReputationLevel(factionId) - Get level text
 *   SceneManager.push(Scene_FactionStatus) - Open faction screen
 */

//=============================================================================
// Plugin Parameters and Setup
//=============================================================================

let $gameFactions = null;

var Imported = Imported || {};
Imported.FactionReputationSystem = true;

var FRS = FRS || {};
FRS.Params = PluginManager.parameters("FactionDataManager");

FRS.Params.showInMenu =
  String(FRS.Params.showInMenu || "true").toLowerCase() === "true";
FRS.Params.menuText = String(FRS.Params.menuText || "Factions");
FRS.Params.startingValues = String(
  FRS.Params.startingValues || "0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0"
)
  .split(",")
  .map(Number);

//=============================================================================
// Faction Data Manager
//=============================================================================

function FactionDataManager() {
  this.initialize(...arguments);
}

FactionDataManager.prototype.initialize = function () {
  this._factions = [];
  this._setupHardcodedFactions();
};

FactionDataManager.prototype._setupHardcodedFactions = function () {
  const FACTIONS = [
    {
      id: 0,
      name: "Mages Guild",
      name_it: "Gilda dei Maghi",
      description: "The ancient, bureaucratic institution regulating the use of magic across the continent. They value order, tradition, and permits.",
      description_it: "L'antica istituzione burocratica che regola l'uso della magia nel continente. Valorizzano l'ordine, la tradizione e i permessi.",
      iconIndex: 110,
      troops: [
        { name: "Apprentice Mage", formation: "Circle", name_it: "Mago Apprendista", hp: 80, mp: 120, atk: 15, def: 10, mat: 35, mdf: 25, agi: 18, luk: 12, hiringCost: 7000, weeklyCost: 1400, spritename: "Actor1", spriteindex: 1, role: "support" },
        { name: "Guild Initiate", formation: "Box", name_it: "Iniziato della Gilda", hp: 120, mp: 150, atk: 20, def: 15, mat: 45, mdf: 30, agi: 20, luk: 15, hiringCost: 16800, weeklyCost: 3500, spritename: "Actor1", spriteindex: 1, role: "support" },
        { name: "Guild Warden", formation: "Phalanx", name_it: "Custode della Gilda", hp: 140, mp: 120, atk: 42, def: 48, mat: 38, mdf: 42, agi: 22, luk: 16, hiringCost: 28000, weeklyCost: 5600, spritename: "Actor1", spriteindex: 1, role: "close quarters" },
        { name: "Certified Mage", formation: "Double", name_it: "Mago Certificato", hp: 150, mp: 200, atk: 25, def: 20, mat: 60, mdf: 40, agi: 22, luk: 18, hiringCost: 35000, weeklyCost: 7000, spritename: "Actor1", spriteindex: 1, role: "support" },
        { name: "Battle Mage", formation: "Wedge", name_it: "Mago da Battaglia", hp: 170, mp: 170, atk: 48, def: 42, mat: 55, mdf: 48, agi: 32, luk: 20, hiringCost: 44800, weeklyCost: 8960, spritename: "Actor1", spriteindex: 1, role: "close quarters" },
        { name: "Guild Enforcer", formation: "Line", name_it: "Esecutore della Gilda", hp: 180, mp: 180, atk: 40, def: 35, mat: 50, mdf: 45, agi: 28, luk: 20, hiringCost: 49000, weeklyCost: 9800, spritename: "Actor1", spriteindex: 1, role: "close quarters" },
        { name: "Mystic Archer", formation: "Crescent", name_it: "Arciere Mistico", hp: 130, mp: 160, atk: 50, def: 28, mat: 52, mdf: 38, agi: 58, luk: 25, hiringCost: 53200, weeklyCost: 10640, spritename: "Actor1", spriteindex: 1, role: "ranged" },
        { name: "Senior Magister", formation: "Circle", name_it: "Magistro Anziano", hp: 200, mp: 250, atk: 30, def: 25, mat: 75, mdf: 55, agi: 25, luk: 22, hiringCost: 70000, weeklyCost: 14000, spritename: "Actor1", spriteindex: 1, role: "support" },
        { name: "War Wizard", formation: "Column", name_it: "Mago di Guerra", hp: 210, mp: 220, atk: 62, def: 55, mat: 68, mdf: 60, agi: 38, luk: 25, hiringCost: 98000, weeklyCost: 19600, spritename: "Actor1", spriteindex: 1, role: "close quarters" },
        { name: "Archmage", formation: "Box", name_it: "Arcimago", hp: 220, mp: 320, atk: 35, def: 30, mat: 95, mdf: 70, agi: 30, luk: 28, hiringCost: 112000, weeklyCost: 22400, spritename: "Actor1", spriteindex: 1, role: "support" },
        { name: "Spell Sniper", formation: "Scattered", name_it: "Cecchino Incantatore", hp: 180, mp: 240, atk: 58, def: 35, mat: 82, mdf: 55, agi: 72, luk: 32, hiringCost: 133000, weeklyCost: 26600, spritename: "Actor1", spriteindex: 1, role: "ranged" },
        { name: "Grandmaster Wizard", formation: "Double", name_it: "Gran Maestro Stregone", hp: 250, mp: 400, atk: 40, def: 35, mat: 120, mdf: 90, agi: 35, luk: 35, hiringCost: 210000, weeklyCost: 42000, spritename: "Actor1", spriteindex: 1, role: "support" }
      ],
      leaders: [
        { name: "Archmage Eldrin", spritename: "Actor1", spriteindex: 0, personality: "Cautious" },
        { name: "Magister Lyra", spritename: "Actor2", spriteindex: 1, personality: "Authoritative" },
        { name: "Councilor Theron", spritename: "Actor3", spriteindex: 2, personality: "Mischievous" },
        { name: "Spellweaver Mira", spritename: "Actor1", spriteindex: 3, personality: "Authoritative" },
        { name: "Enchanter Kael", spritename: "Actor2", spriteindex: 4, personality: "Calm" },
        { name: "Wizard Lord Varen", spritename: "Actor3", spriteindex: 5, personality: "Scholarly" },
        { name: "Sage Celeste", spritename: "Actor1", spriteindex: 6, personality: "Stoic" },
        { name: "Grand Magus Dorian", spritename: "Actor2", spriteindex: 7, personality: "Impulsive" }
      ]
    },
    {
      id: 1,
      name: "Archive Foundation",
      name_it: "Archive Foundation",
      description: "A secretive organization dedicated to hoarding history and controlling information. They believe knowledge is dangerous and must be contained.",
      description_it: "Un'organizzazione segreta dedicata all'accumulo della storia e al controllo dell'informazione. Credono che la conoscenza sia pericolosa e debba essere contenuta.",
      iconIndex: 186,
      troops: [
        { name: "Archive Clerk", formation: "Box", name_it: "Impiegato d'Archivio", hp: 90, mp: 80, atk: 20, def: 15, mat: 25, mdf: 20, agi: 15, luk: 18, hiringCost: 8400, weeklyCost: 1680, spritename: "Actor1", spriteindex: 1, role: "support" },
        { name: "Junior Archivist", formation: "Circle", name_it: "Archivista Junior", hp: 120, mp: 100, atk: 25, def: 20, mat: 35, mdf: 30, agi: 18, luk: 20, hiringCost: 19600, weeklyCost: 3920, spritename: "Actor1", spriteindex: 1, role: "support" },
        { name: "Archive Sentinel", formation: "Phalanx", name_it: "Sentinella d'Archivio", hp: 160, mp: 90, atk: 45, def: 52, mat: 28, mdf: 38, agi: 24, luk: 18, hiringCost: 30800, weeklyCost: 6160, spritename: "Actor1", spriteindex: 1, role: "close quarters" },
        { name: "Knowledge Keeper", formation: "Double", name_it: "Custode della Conoscenza", hp: 150, mp: 130, atk: 30, def: 30, mat: 45, mdf: 45, agi: 20, luk: 25, hiringCost: 39200, weeklyCost: 7840, spritename: "Actor1", spriteindex: 1, role: "support" },
        { name: "Crossbow Archivist", formation: "Line", name_it: "Archivista con Balestra", hp: 140, mp: 95, atk: 48, def: 32, mat: 32, mdf: 35, agi: 52, luk: 22, hiringCost: 47600, weeklyCost: 9520, spritename: "Actor1", spriteindex: 1, role: "ranged" },
        { name: "Archive Guardian", formation: "Wedge", name_it: "Guardiano dell'Archivio", hp: 200, mp: 100, atk: 50, def: 45, mat: 30, mdf: 40, agi: 25, luk: 20, hiringCost: 56000, weeklyCost: 11200, spritename: "Actor1", spriteindex: 1, role: "close quarters" },
        { name: "Senior Curator", formation: "Box", name_it: "Curatore Anziano", hp: 180, mp: 180, atk: 35, def: 35, mat: 60, mdf: 60, agi: 22, luk: 30, hiringCost: 77000, weeklyCost: 15400, spritename: "Actor1", spriteindex: 1, role: "support" },
        { name: "Vault Defender", formation: "Phalanx", name_it: "Difensore della Cripta", hp: 240, mp: 110, atk: 65, def: 70, mat: 35, mdf: 58, agi: 28, luk: 24, hiringCost: 100800, weeklyCost: 20160, spritename: "Actor1", spriteindex: 1, role: "close quarters" },
        { name: "Knowledge Sniper", formation: "Column", name_it: "Cecchino della Conoscenza", hp: 170, mp: 140, atk: 62, def: 38, mat: 52, mdf: 48, agi: 68, luk: 35, hiringCost: 112000, weeklyCost: 22400, spritename: "Actor1", spriteindex: 1, role: "ranged" },
        { name: "Master Librarian", formation: "Circle", name_it: "Bibliotecario Maestro", hp: 200, mp: 220, atk: 40, def: 40, mat: 75, mdf: 75, agi: 28, luk: 35, hiringCost: 126000, weeklyCost: 25200, spritename: "Actor1", spriteindex: 1, role: "support" }
      ],
      leaders: [
        { name: "Curator Magnus", spritename: "Actor1", spriteindex: 0, personality: "Adventurous" },
        { name: "Archivist Vera", spritename: "Actor2", spriteindex: 1, personality: "Nurturing" },
        { name: "Keeper Silas", spritename: "Actor3", spriteindex: 2, personality: "Sanguine" },
        { name: "Librarian Octavia", spritename: "Actor1", spriteindex: 3, personality: "Calm" },
        { name: "Scribe Matthias", spritename: "Actor2", spriteindex: 4, personality: "Nervous" },
        { name: "Record Master Elena", spritename: "Actor3", spriteindex: 5, personality: "Melancholic" },
        { name: "Chronicle Guard Dorian", spritename: "Actor1", spriteindex: 6, personality: "Calm" },
        { name: "Vault Warden Iris", spritename: "Actor2", spriteindex: 7, personality: "Hedonistic" }
      ]
    },
    {
      id: 2,
      name: "Hypercapitalist Collective",
      name_it: "Collettivo Ipercapitalista",
      description: "A ruthless alliance of merchant-kings and tycoons who believe the free market is the only true god.",
      description_it: "Una spietata alleanza di re-mercanti e magnati che credono che il libero mercato sia l'unico vero dio.",
      iconIndex: 314,
      noStartingTroops: true,
      troops: [
        { name: "Contract Worker", formation: "Line", name_it: "Lavoratore a Contratto", hp: 100, mp: 50, atk: 30, def: 20, mat: 15, mdf: 15, agi: 22, luk: 25, hiringCost: 11200, weeklyCost: 2240, spritename: "Actor1", spriteindex: 1, role: "close quarters" },
        { name: "Corporate Security", formation: "Double", name_it: "Sicurezza Aziendale", hp: 150, mp: 60, atk: 45, def: 35, mat: 20, mdf: 25, agi: 28, luk: 20, hiringCost: 28000, weeklyCost: 5600, spritename: "Actor1", spriteindex: 1, role: "close quarters" },
        { name: "Corporate Marksman", formation: "Crescent", name_it: "Tiratore Aziendale", hp: 130, mp: 55, atk: 52, def: 28, mat: 18, mdf: 22, agi: 48, luk: 28, hiringCost: 36400, weeklyCost: 7280, spritename: "Actor1", spriteindex: 1, role: "ranged" },
        { name: "Hired Mercenary", formation: "Scattered", name_it: "Mercenario Assoldato", hp: 180, mp: 70, atk: 55, def: 40, mat: 25, mdf: 30, agi: 32, luk: 22, hiringCost: 44800, weeklyCost: 8960, spritename: "Actor1", spriteindex: 1, role: "close quarters" },
        { name: "Field Medic", formation: "Box", name_it: "Medico da Campo", hp: 140, mp: 140, atk: 28, def: 30, mat: 55, mdf: 52, agi: 30, luk: 35, hiringCost: 53200, weeklyCost: 10640, spritename: "Actor1", spriteindex: 1, role: "support" },
        { name: "Elite Enforcer", formation: "Wedge", name_it: "Esecutore d'Elite", hp: 220, mp: 80, atk: 70, def: 50, mat: 30, mdf: 35, agi: 38, luk: 25, hiringCost: 70000, weeklyCost: 14000, spritename: "Actor1", spriteindex: 1, role: "close quarters" },
        { name: "Corporate Sniper", formation: "Column", name_it: "Cecchino Aziendale", hp: 170, mp: 75, atk: 75, def: 35, mat: 28, mdf: 30, agi: 72, luk: 40, hiringCost: 91000, weeklyCost: 18200, spritename: "Actor1", spriteindex: 1, role: "ranged" },
        { name: "Executive Guard", formation: "Phalanx", name_it: "Guardia Esecutiva", hp: 250, mp: 100, atk: 80, def: 60, mat: 35, mdf: 45, agi: 40, luk: 30, hiringCost: 105000, weeklyCost: 21000, spritename: "Actor1", spriteindex: 1, role: "close quarters" },
        { name: "Combat Specialist", formation: "Double", name_it: "Specialista da Combattimento", hp: 210, mp: 110, atk: 72, def: 52, mat: 48, mdf: 50, agi: 52, luk: 38, hiringCost: 126000, weeklyCost: 25200, spritename: "Actor1", spriteindex: 1, role: "support" },
        { name: "Corporate Assassin", formation: "Scattered", name_it: "Assassino Aziendale", hp: 200, mp: 120, atk: 95, def: 45, mat: 50, mdf: 40, agi: 60, luk: 45, hiringCost: 168000, weeklyCost: 33600, spritename: "Actor1", spriteindex: 1, role: "ranged" }
      ],
      leaders: [
        { name: "CEO Marcellus", spritename: "Actor1", spriteindex: 0, personality: "Loyal" },
        { name: "Tycoon Victoria", spritename: "Actor2", spriteindex: 1, personality: "Melancholic" },
        { name: "Mogul Cassius", spritename: "Actor3", spriteindex: 2, personality: "Stoic" },
        { name: "Trader Supreme Ada", spritename: "Actor1", spriteindex: 3, personality: "Loyal" },
        { name: "Market Lord Felix", spritename: "Actor2", spriteindex: 4, personality: "Brave" },
        { name: "Commerce King Sophia", spritename: "Actor3", spriteindex: 5, personality: "Nurturing" },
        { name: "Merchant Prince Julian", spritename: "Actor1", spriteindex: 6, personality: "Cautious" },
        { name: "Corp Director Lydia", spritename: "Actor2", spriteindex: 7, personality: "Stoic" }
      ]
    },
    {
      id: 3,
      name: "Loyalists",
      name_it: "Lealisti",
      description: "Those who adhere strictly to the Grandmaster's decrees, favoring political stability over magical innovation.",
      description_it: "Coloro che aderiscono rigorosamente ai decreti del Gran Maestro, favorendo la stabilità politica rispetto all'innovazione magica.",
      parentFaction: 0,
      troops: [
        { name: "Loyal Acolyte", formation: "Box", name_it: "Accolito Leale", hp: 90, mp: 110, atk: 18, def: 12, mat: 38, mdf: 28, agi: 16, luk: 14, hiringCost: 8400, weeklyCost: 1680, spritename: "Actor1", spriteindex: 1, role: "support" },
        { name: "Decree Enforcer", formation: "Line", name_it: "Esecutore del Decreto", hp: 130, mp: 140, atk: 30, def: 25, mat: 48, mdf: 38, agi: 20, luk: 18, hiringCost: 25200, weeklyCost: 5040, spritename: "Actor1", spriteindex: 1, role: "support" },
        { name: "Loyal Battle Mage", formation: "Wedge", name_it: "Mago da Battaglia Leale", hp: 160, mp: 180, atk: 38, def: 32, mat: 62, mdf: 48, agi: 24, luk: 20, hiringCost: 49000, weeklyCost: 9800, spritename: "Actor1", spriteindex: 1, role: "close quarters" },
        { name: "Loyal Sentinel", formation: "Phalanx", name_it: "Sentinella Leale", hp: 180, mp: 150, atk: 52, def: 55, mat: 45, mdf: 52, agi: 22, luk: 18, hiringCost: 67200, weeklyCost: 13440, spritename: "Actor1", spriteindex: 1, role: "close quarters" },
        { name: "Grandmaster's Champion", formation: "Double", name_it: "Campione del Gran Maestro", hp: 200, mp: 240, atk: 45, def: 40, mat: 80, mdf: 65, agi: 30, luk: 28, hiringCost: 98000, weeklyCost: 19600, spritename: "Actor1", spriteindex: 1, role: "support" }
      ],
      leaders: [
        { name: "Loyalist Magus Tiberius", spritename: "Actor1", spriteindex: 0, personality: "Artistic" },
        { name: "Devoted Enchanter Aria", spritename: "Actor2", spriteindex: 1, personality: "Apathetic" },
        { name: "True Mage Cornelius", spritename: "Actor3", spriteindex: 2, personality: "Fatalistic" },
        { name: "Faithful Sage Meredith", spritename: "Actor1", spriteindex: 3, personality: "Paranoid" },
        { name: "Orthodox Wizard Quinn", spritename: "Actor2", spriteindex: 4, personality: "Nurturing" },
        { name: "Decree Keeper Thalia", spritename: "Actor3", spriteindex: 5, personality: "Adventurous" },
        { name: "Guild Champion Marcus", spritename: "Actor1", spriteindex: 6, personality: "Grumpy" },
        { name: "Sacred Spellcaster Nora", spritename: "Actor2", spriteindex: 7, personality: "Empathetic" },
        { name: "Traditional Mage Lucius", spritename: "Actor3", spriteindex: 0, personality: "Empathetic" },
        { name: "Pure Magic Scholar Elara", spritename: "Actor1", spriteindex: 1, personality: "Sanguine" }
      ]
    },
    {
      id: 4,
      name: "Traditionalists",
      name_it: "Tradizionalisti",
      description: "Hardliners who reject technology and believe magic should remain pure, esoteric, and elitist.",
      description_it: "Oltranzisti che rifiutano la tecnologia e credono che la magia debba rimanere pura, esoterica ed elitaria.",
      parentFaction: 0,
      troops: [
        { name: "Purist Novice", formation: "Circle", name_it: "Novizio Purista", hp: 70, mp: 130, atk: 12, def: 8, mat: 42, mdf: 32, agi: 14, luk: 16, hiringCost: 9800, weeklyCost: 1960, spritename: "Actor1", spriteindex: 1, role: "support" },
        { name: "Hermetic Mage", formation: "Box", name_it: "Mago Ermetico", hp: 110, mp: 180, atk: 18, def: 15, mat: 58, mdf: 48, agi: 18, luk: 20, hiringCost: 28000, weeklyCost: 5600, spritename: "Actor1", spriteindex: 1, role: "support" },
        { name: "Traditionalist Guard", formation: "Phalanx", name_it: "Guardia Tradizionalista", hp: 130, mp: 140, atk: 38, def: 42, mat: 48, mdf: 52, agi: 16, luk: 18, hiringCost: 39200, weeklyCost: 7840, spritename: "Actor1", spriteindex: 1, role: "close quarters" },
        { name: "Esoteric Master", formation: "Crescent", name_it: "Maestro Esoterico", hp: 140, mp: 240, atk: 22, def: 20, mat: 78, mdf: 65, agi: 22, luk: 25, hiringCost: 56000, weeklyCost: 11200, spritename: "Actor1", spriteindex: 1, role: "support" },
        { name: "Ancient Sage", formation: "Double", name_it: "Saggio Antico", hp: 180, mp: 320, atk: 28, def: 25, mat: 105, mdf: 85, agi: 25, luk: 32, hiringCost: 119000, weeklyCost: 23800, spritename: "Actor1", spriteindex: 1, role: "support" }
      ],
      leaders: [
        { name: "Purist Elder Cassius", spritename: "Actor1", spriteindex: 0, personality: "Paranoid" },
        { name: "Hermetic Master Isolde", spritename: "Actor2", spriteindex: 1, personality: "Empathetic" },
        { name: "Ancient Scholar Regulus", spritename: "Actor3", spriteindex: 2, personality: "Fatalistic" },
        { name: "Traditionalist Sage Vivian", spritename: "Actor1", spriteindex: 3, personality: "Mischievous" },
        { name: "Orthodox Keeper Gaius", spritename: "Actor2", spriteindex: 4, personality: "Brave" },
        { name: "Pure Magus Helena", spritename: "Actor3", spriteindex: 5, personality: "Melancholic" },
        { name: "Esoteric Lord Flavius", spritename: "Actor1", spriteindex: 6, personality: "Adventurous" },
        { name: "Sacred Scholar Portia", spritename: "Actor2", spriteindex: 7, personality: "Nurturing" },
        { name: "Classical Wizard Maximus", spritename: "Actor3", spriteindex: 0, personality: "Scholarly" },
        { name: "Original Doctrine Keeper Diana", spritename: "Actor1", spriteindex: 1, personality: "Grumpy" }
      ]
    },
    {
      id: 5,
      name: "Technomancers",
      name_it: "Tecnomanti",
      description: "Radicals attempting to fuse arcane sigils with combustion engines and heavy machinery.",
      description_it: "Radicali che tentano di fondere sigilli arcani con motori a combustione e macchinari pesanti.",
      parentFaction: 0,
      troops: [
        { name: "Tech Apprentice", formation: "Box", name_it: "Apprendista Tecno", hp: 100, mp: 100, atk: 28, def: 22, mat: 40, mdf: 28, agi: 25, luk: 18, hiringCost: 12600, weeklyCost: 2520, spritename: "Actor1", spriteindex: 1, role: "support" },
        { name: "Gearwright", formation: "Double", name_it: "Artefice Meccanico", hp: 140, mp: 130, atk: 40, def: 35, mat: 52, mdf: 35, agi: 30, luk: 20, hiringCost: 30800, weeklyCost: 6160, spritename: "Actor1", spriteindex: 1, role: "support" },
        { name: "Steamfist Brawler", formation: "Wedge", name_it: "Lottatore Vaporfist", hp: 160, mp: 110, atk: 58, def: 52, mat: 42, mdf: 35, agi: 32, luk: 18, hiringCost: 47600, weeklyCost: 9520, spritename: "Actor1", spriteindex: 1, role: "close quarters" },
        { name: "Arcane Engineer", formation: "Circle", name_it: "Ingegnere Arcano", hp: 170, mp: 160, atk: 50, def: 45, mat: 68, mdf: 42, agi: 35, luk: 22, hiringCost: 58800, weeklyCost: 11760, spritename: "Actor1", spriteindex: 1, role: "support" },
        { name: "Gunmage", formation: "Column", name_it: "Mago Armiere", hp: 150, mp: 150, atk: 65, def: 38, mat: 62, mdf: 40, agi: 55, luk: 25, hiringCost: 81200, weeklyCost: 16240, spritename: "Actor1", spriteindex: 1, role: "ranged" },
        { name: "Magitek Specialist", formation: "Double", name_it: "Specialista Magitek", hp: 210, mp: 200, atk: 65, def: 55, mat: 85, mdf: 55, agi: 42, luk: 28, hiringCost: 112000, weeklyCost: 22400, spritename: "Actor1", spriteindex: 1, role: "support" }
      ],
      leaders: [
        { name: "Tech-Mage Orion", spritename: "Actor1", spriteindex: 0, personality: "Authoritative" },
        { name: "Inventor Sage Lyanna", spritename: "Actor2", spriteindex: 1, personality: "Brave" },
        { name: "Gear Scholar Tobias", spritename: "Actor3", spriteindex: 2, personality: "Adventurous" },
        { name: "Steam Wizard Isadora", spritename: "Actor1", spriteindex: 3, personality: "Brave" },
        { name: "Arcane Engineer Cyrus", spritename: "Actor2", spriteindex: 4, personality: "Nurturing" },
        { name: "Magitek Master Freya", spritename: "Actor3", spriteindex: 5, personality: "Empathetic" },
        { name: "Innovation Lord Kane", spritename: "Actor1", spriteindex: 6, personality: "Impulsive" },
        { name: "Progress Mage Selene", spritename: "Actor2", spriteindex: 7, personality: "Grumpy" },
        { name: "Mechanical Sage Viktor", spritename: "Actor3", spriteindex: 0, personality: "Calm" },
        { name: "Future Spellcrafter Zara", spritename: "Actor1", spriteindex: 1, personality: "Loyal" }
      ]
    },
    {
      id: 6,
      name: "92 schools branch",
      name_it: "Ramo delle 92 Scuole",
      description: "An academic splinter group obsessed with categorizing every minute variation of spellcasting into rigid schools.",
      description_it: "Un gruppo accademico scissionista ossessionato dal classificare ogni minima variazione degli incantesimi in rigide scuole.",
      parentFaction: 0,
      troops: [
        { name: "School Scholar", formation: "Box", name_it: "Studioso di Scuola", hp: 85, mp: 140, atk: 15, def: 12, mat: 45, mdf: 35, agi: 17, luk: 20, hiringCost: 10500, weeklyCost: 2100, spritename: "Actor1", spriteindex: 1, role: "support" },
        { name: "Specialized Caster", formation: "Circle", name_it: "Incantatore Specializzato", hp: 120, mp: 190, atk: 20, def: 18, mat: 62, mdf: 48, agi: 20, luk: 24, hiringCost: 29400, weeklyCost: 5880, spritename: "Actor1", spriteindex: 1, role: "support" },
        { name: "School Defender", formation: "Phalanx", name_it: "Difensore di Scuola", hp: 140, mp: 160, atk: 42, def: 48, mat: 52, mdf: 55, agi: 18, luk: 22, hiringCost: 44800, weeklyCost: 8960, spritename: "Actor1", spriteindex: 1, role: "close quarters" },
        { name: "School Master", formation: "Double", name_it: "Maestro di Scuola", hp: 150, mp: 250, atk: 25, def: 22, mat: 82, mdf: 62, agi: 24, luk: 28, hiringCost: 63000, weeklyCost: 12600, spritename: "Actor1", spriteindex: 1, role: "support" },
        { name: "Polymath Mage", formation: "Column", name_it: "Mago Poliedrico", hp: 190, mp: 330, atk: 32, def: 28, mat: 110, mdf: 80, agi: 28, luk: 35, hiringCost: 133000, weeklyCost: 26600, spritename: "Actor1", spriteindex: 1, role: "support" }
      ],
      leaders: [
        { name: "Headmaster Aurelius", spritename: "Actor1", spriteindex: 0, personality: "Impulsive" },
        { name: "School Dean Ophelia", spritename: "Actor2", spriteindex: 1, personality: "Brave" },
        { name: "Master Teacher Lucan", spritename: "Actor3", spriteindex: 2, personality: "Artistic" },
        { name: "Polymath Sage Rowena", spritename: "Actor1", spriteindex: 3, personality: "Disciplined" },
        { name: "Academy Lord Cedric", spritename: "Actor2", spriteindex: 4, personality: "Adventurous" },
        { name: "Pedagogue Mage Astrid", spritename: "Actor3", spriteindex: 5, personality: "Empathetic" },
        { name: "Professor Supreme Hadrian", spritename: "Actor1", spriteindex: 6, personality: "Adventurous" },
        { name: "Scholar Leader Beatrice", spritename: "Actor2", spriteindex: 7, personality: "Hedonistic" },
        { name: "Educational Master Darius", spritename: "Actor3", spriteindex: 0, personality: "Stoic" },
        { name: "Mentor Archmage Evangeline", spritename: "Actor1", spriteindex: 1, personality: "Cautious" }
      ]
    },
    {
      id: 7,
      name: "Eris' Court",
      name_it: "Corte di Eris",
      description: "Followers of the Goddess of Discord, seeking to disrupt the boring order of the Guilds and Foundation.",
      description_it: "Seguaci della Dea della Discordia, che cercano di sconvolgere il noioso ordine delle Gilde e della Fondazione.",
      parentFaction: 18,
      troops: [
        { name: "Chaos Cultist", formation: "Scattered", name_it: "Cultista del Caos", hp: 95, mp: 90, atk: 32, def: 18, mat: 38, mdf: 22, agi: 35, luk: 40, hiringCost: 9800, weeklyCost: 1960, spritename: "Actor1", spriteindex: 1, role: "ranged" },
        { name: "Chaos Brawler", formation: "Wedge", name_it: "Lottatore del Caos", hp: 120, mp: 80, atk: 48, def: 35, mat: 30, mdf: 25, agi: 38, luk: 45, hiringCost: 21000, weeklyCost: 4200, spritename: "Actor1", spriteindex: 1, role: "close quarters" },
        { name: "Discord Agent", formation: "Scattered", name_it: "Agente della Discordia", hp: 130, mp: 120, atk: 45, def: 25, mat: 52, mdf: 30, agi: 45, luk: 50, hiringCost: 26600, weeklyCost: 5320, spritename: "Actor1", spriteindex: 1, role: "ranged" },
        { name: "Entropy Bringer", formation: "Crescent", name_it: "Portatore di Entropia", hp: 160, mp: 160, atk: 58, def: 32, mat: 68, mdf: 38, agi: 55, luk: 60, hiringCost: 53200, weeklyCost: 10640, spritename: "Actor1", spriteindex: 1, role: "support" },
        { name: "Chaos Berserker", formation: "Column", name_it: "Berserker del Caos", hp: 180, mp: 100, atk: 78, def: 42, mat: 40, mdf: 32, agi: 52, luk: 65, hiringCost: 72800, weeklyCost: 14560, spritename: "Actor1", spriteindex: 1, role: "close quarters" },
        { name: "Avatar of Discord", formation: "Circle", name_it: "Avatar della Discordia", hp: 200, mp: 220, atk: 75, def: 40, mat: 90, mdf: 50, agi: 70, luk: 80, hiringCost: 105000, weeklyCost: 21000, spritename: "Actor1", spriteindex: 1, role: "support" }
      ],
      leaders: [
        { name: "High Priest Nihilus", spritename: "Actor1", spriteindex: 0, personality: "Calm" },
        { name: "Chaos Oracle Morgana", spritename: "Actor2", spriteindex: 1, personality: "Nurturing" },
        { name: "Entropy Lord Xander", spritename: "Actor3", spriteindex: 2, personality: "Sanguine" },
        { name: "Discord Sage Lilith", spritename: "Actor1", spriteindex: 3, personality: "Nurturing" },
        { name: "Void Master Balthazar", spritename: "Actor2", spriteindex: 4, personality: "Nervous" },
        { name: "Anarchy Champion Raven", spritename: "Actor3", spriteindex: 5, personality: "Nervous" },
        { name: "Disorder Keeper Malachi", spritename: "Actor1", spriteindex: 6, personality: "Melancholic" },
        { name: "Chaos Weaver Seraphina", spritename: "Actor2", spriteindex: 7, personality: "Hedonistic" }
      ]
    },
    {
      id: 8,
      name: "Naguka",
      name_it: "Naguka",
      description: "A tribe of swamp-dwelling scavengers known for their resistance to industrial toxins.",
      description_it: "Una tribù di spazzini delle paludi noti per la loro resistenza alle tossine industriali.",
      parentFaction: 25,
      troops: [
        { name: "Swamp Scavenger", formation: "Scattered", name_it: "Spazzino della Palude", hp: 110, mp: 60, atk: 28, def: 25, mat: 20, mdf: 35, agi: 22, luk: 18, hiringCost: 7700, weeklyCost: 1540, spritename: "Actor1", spriteindex: 1, role: "close quarters" },
        { name: "Blowdart Hunter", formation: "Crescent", name_it: "Cacciatore con Cerbottana", hp: 95, mp: 65, atk: 35, def: 20, mat: 25, mdf: 32, agi: 48, luk: 22, hiringCost: 15400, weeklyCost: 3080, spritename: "Actor1", spriteindex: 1, role: "ranged" },
        { name: "Toxic Warrior", formation: "Line", name_it: "Guerriero Tossico", hp: 150, mp: 80, atk: 42, def: 38, mat: 30, mdf: 50, agi: 28, luk: 20, hiringCost: 21000, weeklyCost: 4200, spritename: "Actor1", spriteindex: 1, role: "close quarters" },
        { name: "Poison Slinger", formation: "Scattered", name_it: "Lanciatore di Veleno", hp: 130, mp: 90, atk: 48, def: 28, mat: 38, mdf: 45, agi: 58, luk: 28, hiringCost: 33600, weeklyCost: 6720, spritename: "Actor1", spriteindex: 1, role: "ranged" },
        { name: "Plague Bearer", formation: "Double", name_it: "Portatore di Peste", hp: 190, mp: 110, atk: 55, def: 45, mat: 45, mdf: 65, agi: 32, luk: 22, hiringCost: 44800, weeklyCost: 8960, spritename: "Actor1", spriteindex: 1, role: "close quarters" },
        { name: "Naguka Shaman", formation: "Box", name_it: "Sciamano Naguka", hp: 160, mp: 180, atk: 38, def: 35, mat: 70, mdf: 75, agi: 30, luk: 35, hiringCost: 77000, weeklyCost: 15400, spritename: "Actor1", spriteindex: 1, role: "support" }
      ],
      leaders: [
        { name: "Swamp Chief Gorrok", spritename: "Actor1", spriteindex: 0, personality: "Adventurous" },
        { name: "Poison Shaman Zzara", spritename: "Actor2", spriteindex: 1, personality: "Nervous" },
        { name: "Bog Warrior Thrax", spritename: "Actor3", spriteindex: 2, personality: "Cynical" },
        { name: "Venom Elder Nyx", spritename: "Actor1", spriteindex: 3, personality: "Impulsive" },
        { name: "Marsh Lord Kreth", spritename: "Actor2", spriteindex: 4, personality: "Cautious" },
        { name: "Toxic Oracle Sssara", spritename: "Actor3", spriteindex: 5, personality: "Timid" },
        { name: "Wetland Guardian Brognak", spritename: "Actor1", spriteindex: 6, personality: "Scholarly" },
        { name: "Plague Keeper Vyx", spritename: "Actor2", spriteindex: 7, personality: "Stoic" },
        { name: "Mire Champion Grax", spritename: "Actor3", spriteindex: 0, personality: "Empathetic" },
        { name: "Fungal Sage Mycellia", spritename: "Actor1", spriteindex: 1, personality: "Impulsive" }
      ]
    },
    {
      id: 9,
      name: "Verden",
      name_it: "Verden",
      description: "Forest goblins who wage guerilla warfare against the expansion of heavy industry.",
      description_it: "Goblin delle foreste che conducono una guerriglia contro l'espansione dell'industria pesante.",
      parentFaction: 25,
      troops: [
        { name: "Forest Scout", formation: "Scattered", name_it: "Esploratore della Foresta", hp: 85, mp: 50, atk: 35, def: 20, mat: 18, mdf: 22, agi: 45, luk: 25, hiringCost: 7000, weeklyCost: 1400, spritename: "Actor1", spriteindex: 1, role: "ranged" },
        { name: "Sapling Defender", formation: "Circle", name_it: "Difensore Alberello", hp: 105, mp: 60, atk: 42, def: 45, mat: 22, mdf: 28, agi: 28, luk: 20, hiringCost: 13300, weeklyCost: 2660, spritename: "Actor1", spriteindex: 1, role: "close quarters" },
        { name: "Guerilla Fighter", formation: "Scattered", name_it: "Combattente Guerrigliero", hp: 120, mp: 70, atk: 48, def: 30, mat: 25, mdf: 28, agi: 58, luk: 30, hiringCost: 19600, weeklyCost: 3920, spritename: "Actor1", spriteindex: 1, role: "ranged" },
        { name: "Tree Ambusher", formation: "Column", name_it: "Imboscatore degli Alberi", hp: 140, mp: 90, atk: 62, def: 35, mat: 35, mdf: 32, agi: 70, luk: 35, hiringCost: 39200, weeklyCost: 7840, spritename: "Actor1", spriteindex: 1, role: "ranged" },
        { name: "Nature's Wrath", formation: "Wedge", name_it: "Ira della Natura", hp: 170, mp: 110, atk: 68, def: 55, mat: 45, mdf: 42, agi: 52, luk: 32, hiringCost: 58800, weeklyCost: 11760, spritename: "Actor1", spriteindex: 1, role: "close quarters" },
        { name: "Forest Champion", formation: "Crescent", name_it: "Campione della Foresta", hp: 180, mp: 130, atk: 78, def: 45, mat: 50, mdf: 45, agi: 85, luk: 45, hiringCost: 77000, weeklyCost: 15400, spritename: "Actor1", spriteindex: 1, role: "ranged" }
      ],
      leaders: [
        { name: "Forest Elder Sylvara", spritename: "Actor1", spriteindex: 0, personality: "Mischievous" },
        { name: "Grove Guardian Thorne", spritename: "Actor2", spriteindex: 1, personality: "Scholarly" },
        { name: "Leaf Sage Verdant", spritename: "Actor3", spriteindex: 2, personality: "Melancholic" },
        { name: "Tree Keeper Fauna", spritename: "Actor1", spriteindex: 3, personality: "Authoritative" },
        { name: "Woodland Champion Ash", spritename: "Actor2", spriteindex: 4, personality: "Aggressive" },
        { name: "Nature Oracle Moss", spritename: "Actor3", spriteindex: 5, personality: "Empathetic" },
        { name: "Branch Warrior Rowan", spritename: "Actor1", spriteindex: 6, personality: "Adventurous" },
        { name: "Vine Master Flora", spritename: "Actor2", spriteindex: 7, personality: "Grumpy" },
        { name: "Root Defender Oakley", spritename: "Actor3", spriteindex: 0, personality: "Hedonistic" },
        { name: "Wildwood Sage Ivy", spritename: "Actor1", spriteindex: 1, personality: "Brave" }
      ]
    },
    {
      id: 10,
      name: "Truckers Society",
      name_it: "Società dei Camionisti",
      noStartingTroops: true,
      description: "The brave souls who transport goods across the wastelands. They are the lifeblood of the economy and obey no road laws.",
      description_it: "Le anime coraggiose che trasportano merci attraverso le terre desolate. Sono la linfa vitale dell'economia e non obbediscono a nessun codice della strada.",
      iconIndex: 283,
      troops: [
        { name: "Rookie Trucker", formation: "Line", name_it: "Camionista Novizio", hp: 120, mp: 40, atk: 35, def: 30, mat: 10, mdf: 15, agi: 28, luk: 22, hiringCost: 9800, weeklyCost: 1960, spritename: "Actor1", spriteindex: 1, role: "close quarters" },
        { name: "Highway Marksman", formation: "Double", name_it: "Tiratore dell'Autostrada", hp: 105, mp: 45, atk: 42, def: 25, mat: 12, mdf: 18, agi: 52, luk: 28, hiringCost: 18200, weeklyCost: 3640, spritename: "Actor1", spriteindex: 1, role: "ranged" },
        { name: "Road Warrior", formation: "Wedge", name_it: "Guerriero della Strada", hp: 160, mp: 50, atk: 50, def: 45, mat: 15, mdf: 20, agi: 35, luk: 25, hiringCost: 25200, weeklyCost: 5040, spritename: "Actor1", spriteindex: 1, role: "close quarters" },
        { name: "Convoy Sniper", formation: "Column", name_it: "Cecchino della Carovana", hp: 140, mp: 55, atk: 58, def: 32, mat: 18, mdf: 22, agi: 68, luk: 35, hiringCost: 39200, weeklyCost: 7840, spritename: "Actor1", spriteindex: 1, role: "ranged" },
        { name: "Veteran Driver", formation: "Double", name_it: "Autista Veterano", hp: 200, mp: 60, atk: 65, def: 55, mat: 20, mdf: 28, agi: 42, luk: 30, hiringCost: 49000, weeklyCost: 9800, spritename: "Actor1", spriteindex: 1, role: "close quarters" },
        { name: "Road Medic", formation: "Box", name_it: "Medico Stradale", hp: 170, mp: 120, atk: 40, def: 42, mat: 55, mdf: 58, agi: 38, luk: 35, hiringCost: 67200, weeklyCost: 13440, spritename: "Actor1", spriteindex: 1, role: "support" },
        { name: "Road Master", formation: "Phalanx", name_it: "Maestro della Strada", hp: 240, mp: 80, atk: 85, def: 70, mat: 25, mdf: 35, agi: 50, luk: 38, hiringCost: 91000, weeklyCost: 18200, spritename: "Actor1", spriteindex: 1, role: "close quarters" }
      ],
      leaders: [
        { name: "Road King Diesel", spritename: "Actor1", spriteindex: 0, personality: "Melancholic" },
        { name: "Highway Boss Cassie", spritename: "Actor2", spriteindex: 1, personality: "Cynical" },
        { name: "Convoy Master Hank", spritename: "Actor3", spriteindex: 2, personality: "Empathetic" },
        { name: "Trucker Chief Rita", spritename: "Actor1", spriteindex: 3, personality: "Cautious" },
        { name: "Route Lord Duke", spritename: "Actor2", spriteindex: 4, personality: "Sanguine" },
        { name: "Wheeler Commander Sarah", spritename: "Actor3", spriteindex: 5, personality: "Nurturing" },
        { name: "Freight Captain Buck", spritename: "Actor1", spriteindex: 6, personality: "Fatalistic" },
        { name: "Road Warrior Maxine", spritename: "Actor2", spriteindex: 7, personality: "Melancholic" }
      ]
    },
    {
      id: 11,
      name: "Esoteric Heavy Industries",
      name_it: "Esoteric Heavy Industries",
      description: "A massive and misterious conglomerate.",
      description_it: "Un enorme e misterioso conglomerato.",
      noStartingTroops: true,
      iconIndex: 79,
      troops: [
        { name: "Factory Worker", formation: "Line", name_it: "Operaio di Fabbrica", hp: 130, mp: 40, atk: 38, def: 35, mat: 15, mdf: 20, agi: 20, luk: 15, hiringCost: 9100, weeklyCost: 1820, spritename: "Actor1", spriteindex: 1, role: "close quarters" },
        { name: "Industrial Foreman", formation: "Column", name_it: "Caposquadra Industriale", hp: 170, mp: 60, atk: 52, def: 48, mat: 22, mdf: 28, agi: 25, luk: 18, hiringCost: 23800, weeklyCost: 4760, spritename: "Actor1", spriteindex: 1, role: "close quarters" },
        { name: "Factory Sharpshooter", formation: "Line", name_it: "Tiratore di Fabbrica", hp: 150, mp: 55, atk: 58, def: 35, mat: 20, mdf: 25, agi: 52, luk: 22, hiringCost: 36400, weeklyCost: 7280, spritename: "Actor1", spriteindex: 1, role: "ranged" },
        { name: "Heavy Machinist", formation: "Phalanx", name_it: "Macchinista Pesante", hp: 210, mp: 80, atk: 68, def: 62, mat: 30, mdf: 35, agi: 28, luk: 20, hiringCost: 47600, weeklyCost: 9520, spritename: "Actor1", spriteindex: 1, role: "close quarters" },
        { name: "Industrial Engineer", formation: "Box", name_it: "Ingegnere Industriale", hp: 180, mp: 120, atk: 45, def: 50, mat: 62, mdf: 58, agi: 30, luk: 28, hiringCost: 67200, weeklyCost: 13440, spritename: "Actor1", spriteindex: 1, role: "support" },
        { name: "Steel Sentinel", formation: "Phalanx", name_it: "Sentinella d'Acciaio", hp: 260, mp: 90, atk: 82, def: 95, mat: 35, mdf: 52, agi: 26, luk: 22, hiringCost: 86800, weeklyCost: 17360, spritename: "Actor1", spriteindex: 1, role: "close quarters" },
        { name: "Corporate Titan", formation: "Wedge", name_it: "Titano Aziendale", hp: 280, mp: 100, atk: 90, def: 85, mat: 40, mdf: 50, agi: 32, luk: 25, hiringCost: 98000, weeklyCost: 19600, spritename: "Actor1", spriteindex: 1, role: "close quarters" },
        { name: "Assembly Line Sniper", formation: "Column", name_it: "Cecchino Catena Montaggio", hp: 220, mp: 85, atk: 95, def: 48, mat: 38, mdf: 42, agi: 75, luk: 35, hiringCost: 133000, weeklyCost: 26600, spritename: "Actor1", spriteindex: 1, role: "ranged" },
        { name: "Industrial Overlord", formation: "Phalanx", name_it: "Signore Industriale", hp: 350, mp: 130, atk: 110, def: 100, mat: 55, mdf: 65, agi: 38, luk: 30, hiringCost: 182000, weeklyCost: 36400, spritename: "Actor1", spriteindex: 1, role: "close quarters" }
      ],
      leaders: [
        { name: "Factory Baron Forge", spritename: "Actor1", spriteindex: 0, personality: "Cautious" },
        { name: "Steel Mistress Clara", spritename: "Actor2", spriteindex: 1, personality: "Artistic" },
        { name: "Industry Lord Marcus", spritename: "Actor3", spriteindex: 2, personality: "Impulsive" },
        { name: "Production Chief Ingrid", spritename: "Actor1", spriteindex: 3, personality: "Loyal" },
        { name: "Machine Master Viktor", spritename: "Actor2", spriteindex: 4, personality: "Empathetic" },
        { name: "Foundry King Brutus", spritename: "Actor3", spriteindex: 5, personality: "Authoritative" },
        { name: "Assembly Boss Natasha", spritename: "Actor1", spriteindex: 6, personality: "Scholarly" },
        { name: "Metal Warlord Rex", spritename: "Actor2", spriteindex: 7, personality: "Impulsive" }
      ]
    },
    {
      id: 12,
      name: "North Point Army",
      name_it: "Esercito di North Point",
      noStartingTroops: true,
      description: "A disciplined military force protecting the northern borders from whatever lurks in the frozen wastes.",
      description_it: "Una forza militare disciplinata che protegge i confini settentrionali da ciò che si nasconde nelle distese ghiacciate.",
      iconIndex: 199,
      troops: [
        { name: "Recruit", formation: "Line", name_it: "Recluta", hp: 110, mp: 50, atk: 32, def: 28, mat: 12, mdf: 18, agi: 24, luk: 15, hiringCost: 8400, weeklyCost: 1680, spritename: "Actor1", spriteindex: 1, role: "close quarters" },
        { name: "Regular Soldier", formation: "Double", name_it: "Soldato Regolare", hp: 150, mp: 70, atk: 48, def: 42, mat: 18, mdf: 25, agi: 30, luk: 18, hiringCost: 21000, weeklyCost: 4200, spritename: "Actor1", spriteindex: 1, role: "close quarters" },
        { name: "Northern Archer", formation: "Crescent", name_it: "Arciere del Nord", hp: 130, mp: 65, atk: 52, def: 32, mat: 22, mdf: 28, agi: 55, luk: 20, hiringCost: 30800, weeklyCost: 6160, spritename: "Actor1", spriteindex: 1, role: "ranged" },
        { name: "Frost Ranger", formation: "Scattered", name_it: "Ranger del Gelo", hp: 180, mp: 90, atk: 58, def: 48, mat: 35, mdf: 40, agi: 42, luk: 22, hiringCost: 42000, weeklyCost: 8400, spritename: "Actor1", spriteindex: 1, role: "ranged" },
        { name: "Battle Cleric", formation: "Box", name_it: "Chierico da Battaglia", hp: 170, mp: 130, atk: 42, def: 48, mat: 68, mdf: 75, agi: 28, luk: 30, hiringCost: 56000, weeklyCost: 11200, spritename: "Actor1", spriteindex: 1, role: "support" },
        { name: "Winter Guard", formation: "Phalanx", name_it: "Guardia Invernale", hp: 220, mp: 110, atk: 72, def: 65, mat: 45, mdf: 52, agi: 38, luk: 25, hiringCost: 70000, weeklyCost: 14000, spritename: "Actor1", spriteindex: 1, role: "close quarters" },
        { name: "Frost Marksman", formation: "Column", name_it: "Tiratore del Gelo", hp: 190, mp: 100, atk: 78, def: 42, mat: 48, mdf: 50, agi: 68, luk: 28, hiringCost: 95200, weeklyCost: 19040, spritename: "Actor1", spriteindex: 1, role: "ranged" },
        { name: "Northern Knight", formation: "Wedge", name_it: "Cavaliere del Nord", hp: 270, mp: 140, atk: 90, def: 80, mat: 55, mdf: 68, agi: 35, luk: 30, hiringCost: 119000, weeklyCost: 23800, spritename: "Actor1", spriteindex: 1, role: "close quarters" },
        { name: "Winter Priest", formation: "Circle", name_it: "Sacerdote Invernale", hp: 240, mp: 220, atk: 55, def: 60, mat: 95, mdf: 105, agi: 32, luk: 40, hiringCost: 154000, weeklyCost: 30800, spritename: "Actor1", spriteindex: 1, role: "support" },
        { name: "Marshal of the Frost", formation: "Phalanx", name_it: "Maresciallo del Gelo", hp: 320, mp: 180, atk: 105, def: 95, mat: 70, mdf: 85, agi: 42, luk: 35, hiringCost: 196000, weeklyCost: 39200, spritename: "Actor1", spriteindex: 1, role: "close quarters" }
      ],
      leaders: [
        { name: "King Harald", spritename: "Actor1", spriteindex: 0, personality: "Melancholic" },
        { name: "Queen Astrid", spritename: "Actor2", spriteindex: 1, personality: "Calm" },
        { name: "Jarl Magnus", spritename: "Actor3", spriteindex: 2, personality: "Sanguine" },
        { name: "Shield-Maiden Sigrid", spritename: "Actor1", spriteindex: 3, personality: "Scholarly" },
        { name: "Frost Lord Erik", spritename: "Actor2", spriteindex: 4, personality: "Cynical" },
        { name: "Ice Queen Freya", spritename: "Actor3", spriteindex: 5, personality: "Nervous" },
        { name: "Snow King Olaf", spritename: "Actor1", spriteindex: 6, personality: "Disciplined" },
        { name: "Winter Matriarch Brunhilde", spritename: "Actor2", spriteindex: 7, personality: "Loyal" }
      ]
    },
    {
      id: 13,
      name: "Inverted Citadel",
      name_it: "Cittadella Invertita",
      description: "A fortress hanging from the ceiling of a massive cavern, home to outcasts and dark scholars.",
      description_it: "Una fortezza appesa al soffitto di un'enorme caverna, dimora di emarginati e studiosi oscuri.",
      iconIndex: 241,
      noStartingTroops: true,
      troops: [
        { name: "Cave Outcast", formation: "Scattered", name_it: "Emarginato della Caverna", hp: 95, mp: 85, atk: 28, def: 22, mat: 32, mdf: 28, agi: 26, luk: 20, hiringCost: 7700, weeklyCost: 1540, spritename: "Actor1", spriteindex: 1, role: "close quarters" },
        { name: "Void Archer", formation: "Crescent", name_it: "Arciere del Vuoto", hp: 105, mp: 95, atk: 38, def: 20, mat: 38, mdf: 30, agi: 52, luk: 25, hiringCost: 15400, weeklyCost: 3080, spritename: "Actor1", spriteindex: 1, role: "ranged" },
        { name: "Dark Acolyte", formation: "Circle", name_it: "Accolito Oscuro", hp: 125, mp: 130, atk: 35, def: 28, mat: 50, mdf: 42, agi: 30, luk: 25, hiringCost: 20300, weeklyCost: 4060, spritename: "Actor1", spriteindex: 1, role: "support" },
        { name: "Abyssal Blade", formation: "Wedge", name_it: "Lama Abissale", hp: 150, mp: 120, atk: 58, def: 48, mat: 45, mdf: 50, agi: 38, luk: 28, hiringCost: 35000, weeklyCost: 7000, spritename: "Actor1", spriteindex: 1, role: "close quarters" },
        { name: "Shadow Scholar", formation: "Box", name_it: "Studioso delle Ombre", hp: 155, mp: 180, atk: 42, def: 35, mat: 68, mdf: 58, agi: 35, luk: 30, hiringCost: 42000, weeklyCost: 8400, spritename: "Actor1", spriteindex: 1, role: "support" },
        { name: "Darkness Sniper", formation: "Column", name_it: "Cecchino dell'Oscurità", hp: 140, mp: 150, atk: 68, def: 30, mat: 58, mdf: 52, agi: 72, luk: 35, hiringCost: 67200, weeklyCost: 13440, spritename: "Actor1", spriteindex: 1, role: "ranged" },
        { name: "Umbral Warlock", formation: "Double", name_it: "Warlock Umbratile", hp: 190, mp: 240, atk: 50, def: 42, mat: 88, mdf: 75, agi: 40, luk: 35, hiringCost: 84000, weeklyCost: 16800, spritename: "Actor1", spriteindex: 1, role: "support" },
        { name: "Shadow Reaver", formation: "Line", name_it: "Predatore d'Ombra", hp: 220, mp: 200, atk: 92, def: 62, mat: 72, mdf: 70, agi: 50, luk: 38, hiringCost: 126000, weeklyCost: 25200, spritename: "Actor1", spriteindex: 1, role: "close quarters" },
        { name: "Citadel Master", formation: "Circle", name_it: "Maestro della Cittadella", hp: 230, mp: 310, atk: 58, def: 50, mat: 112, mdf: 95, agi: 45, luk: 42, hiringCost: 154000, weeklyCost: 30800, spritename: "Actor1", spriteindex: 1, role: "support" }
      ],
      leaders: [
        { name: "Crime Boss Vito", spritename: "Actor1", spriteindex: 0, personality: "Timid" },
        { name: "Shadow Matriarch Carmilla", spritename: "Actor2", spriteindex: 1, personality: "Hedonistic" },
        { name: "Syndicate Don Marco", spritename: "Actor3", spriteindex: 2, personality: "Timid" },
        { name: "Night Queen Selena", spritename: "Actor1", spriteindex: 3, personality: "Grumpy" },
        { name: "Dark Lord Vincent", spritename: "Actor2", spriteindex: 4, personality: "Disciplined" },
        { name: "Underground Empress Rosa", spritename: "Actor3", spriteindex: 5, personality: "Cautious" },
        { name: "Twilight King Luca", spritename: "Actor1", spriteindex: 6, personality: "Timid" },
        { name: "Noir Mistress Angelica", spritename: "Actor2", spriteindex: 7, personality: "Authoritative" }
      ]
    },
    {
      id: 14,
      name: "Petrodemons",
      name_it: "Petrodemoni",
      description: "Entities born from deep earth oil deposits; living fuel that burns with malice.",
      description_it: "Entità nate dai depositi di petrolio delle profondità; carburante vivente che brucia con malizia.",
      iconIndex: 179,
      troops: [
        { name: "Oil Imp", formation: "Scattered", name_it: "Diavoletto del Petrolio", hp: 90, mp: 100, atk: 38, def: 20, mat: 45, mdf: 30, agi: 32, luk: 28, hiringCost: 11200, weeklyCost: 2240, spritename: "Actor1", spriteindex: 1, role: "support" },
        { name: "Flame Slinger", formation: "Line", name_it: "Lanciatore di Fiamme", hp: 110, mp: 120, atk: 48, def: 25, mat: 52, mdf: 35, agi: 58, luk: 32, hiringCost: 21000, weeklyCost: 4200, spritename: "Actor1", spriteindex: 1, role: "ranged" },
        { name: "Crude Fiend", formation: "Wedge", name_it: "Demone Grezzo", hp: 140, mp: 150, atk: 52, def: 32, mat: 62, mdf: 42, agi: 40, luk: 32, hiringCost: 28000, weeklyCost: 5600, spritename: "Actor1", spriteindex: 1, role: "close quarters" },
        { name: "Petro Hellion", formation: "Column", name_it: "Demone Petrolifero", hp: 180, mp: 200, atk: 68, def: 40, mat: 80, mdf: 55, agi: 48, luk: 38, hiringCost: 56000, weeklyCost: 11200, spritename: "Actor1", spriteindex: 1, role: "close quarters" },
        { name: "Burning Archer", formation: "Crescent", name_it: "Arciere Ardente", hp: 160, mp: 180, atk: 75, def: 35, mat: 72, mdf: 50, agi: 78, luk: 42, hiringCost: 81200, weeklyCost: 16240, spritename: "Actor1", spriteindex: 1, role: "ranged" },
        { name: "Infernal Baron", formation: "Box", name_it: "Barone Infernale", hp: 230, mp: 270, atk: 85, def: 50, mat: 105, mdf: 70, agi: 55, luk: 45, hiringCost: 105000, weeklyCost: 21000, spritename: "Actor1", spriteindex: 1, role: "support" },
        { name: "Tar Knight", formation: "Phalanx", name_it: "Cavaliere di Catrame", hp: 260, mp: 240, atk: 98, def: 75, mat: 88, mdf: 68, agi: 42, luk: 40, hiringCost: 147000, weeklyCost: 29400, spritename: "Actor1", spriteindex: 1, role: "close quarters" },
        { name: "Hellfire Marksman", formation: "Column", name_it: "Tiratore Fuoco Infernale", hp: 220, mp: 280, atk: 105, def: 48, mat: 115, mdf: 75, agi: 92, luk: 55, hiringCost: 182000, weeklyCost: 36400, spritename: "Actor1", spriteindex: 1, role: "ranged" },
        { name: "Archdevil of Oil", formation: "Double", name_it: "Arcidemone del Petrolio", hp: 300, mp: 350, atk: 110, def: 65, mat: 135, mdf: 90, agi: 65, luk: 55, hiringCost: 210000, weeklyCost: 42000, spritename: "Actor1", spriteindex: 1, role: "support" }
      ],
      leaders: [
        { name: "Hive Mind Alpha", spritename: "Actor1", spriteindex: 0, personality: "Paranoid" },
        { name: "Unity Leader Sigma", spritename: "Actor2", spriteindex: 1, personality: "Cautious" },
        { name: "Collective Prime Delta", spritename: "Actor3", spriteindex: 2, personality: "Loyal" },
        { name: "Harmony Master Omega", spritename: "Actor1", spriteindex: 3, personality: "Scholarly" },
        { name: "Synergy Lord Epsilon", spritename: "Actor2", spriteindex: 4, personality: "Mischievous" },
        { name: "Group Consciousness Theta", spritename: "Actor3", spriteindex: 5, personality: "Scholarly" },
        { name: "Network Queen Phi", spritename: "Actor1", spriteindex: 6, personality: "Disciplined" },
        { name: "Shared Mind King Psi", spritename: "Actor2", spriteindex: 7, personality: "Adventurous" }
      ]
    },
    {
      id: 15,
      name: "Petromanagers",
      name_it: "Petromanager",
      noStartingTroops: true,
      description: "Middle-managers who have signed infernal pacts to maximize oil extraction efficiency.",
      description_it: "Quadri intermedi che hanno firmato patti infernali per massimizzare l'efficienza dell'estrazione petrolifera.",
      parentFaction: 2,
      troops: [
        { name: "Junior Manager", formation: "Box", name_it: "Manager Junior", hp: 105, mp: 90, atk: 32, def: 28, mat: 40, mdf: 35, agi: 28, luk: 30, hiringCost: 12600, weeklyCost: 2520 },
        { name: "Efficiency Analyst", formation: "Line", name_it: "Analista di Efficienza", hp: 140, mp: 130, atk: 42, def: 35, mat: 58, mdf: 48, agi: 32, luk: 35, hiringCost: 30800, weeklyCost: 6160 },
        { name: "Senior Petromanager", formation: "Double", name_it: "Petromanager Senior", hp: 180, mp: 180, atk: 55, def: 45, mat: 78, mdf: 62, agi: 38, luk: 40, hiringCost: 63000, weeklyCost: 12600 },
        { name: "Infernal Executive", formation: "Column", name_it: "Esecutivo Infernale", hp: 220, mp: 240, atk: 70, def: 55, mat: 100, mdf: 80, agi: 45, luk: 50, hiringCost: 119000, weeklyCost: 23800 }
      ],
      leaders: [
        { name: "Demon Lord Azaroth", spritename: "Actor1", spriteindex: 0, personality: "Cynical" },
        { name: "Infernal Queen Lilith", spritename: "Actor2", spriteindex: 1, personality: "Sanguine" },
        { name: "Hell King Baal", spritename: "Actor3", spriteindex: 2, personality: "Timid" },
        { name: "Abyss Mistress Morrigan", spritename: "Actor1", spriteindex: 3, personality: "Brave" },
        { name: "Chaos Demon Xalvador", spritename: "Actor2", spriteindex: 4, personality: "Aggressive" },
        { name: "Shadow Lord Beleth", spritename: "Actor3", spriteindex: 5, personality: "Mischievous" },
        { name: "Nether Queen Astarte", spritename: "Actor1", spriteindex: 6, personality: "Cynical" },
        { name: "Void King Mammon", spritename: "Actor2", spriteindex: 7, personality: "Apathetic" }
      ]
    },
    {
      id: 16,
      name: "Speed demons",
      name_it: "Demoni della Velocità",
      noStartingTroops: true,
      description: "Adrenaline junkies and couriers who worship velocity and high-octane fuel.",
      description_it: "Drogati di adrenalina e corrieri che venerano la velocità e il carburante ad alto numero di ottani.",
      parentFaction: 2,
      troops: [
        { name: "Speed Freak", formation: "Scattered", name_it: "Maniaco della Velocità", hp: 95, mp: 60, atk: 42, def: 22, mat: 18, mdf: 20, agi: 65, luk: 35, hiringCost: 11900, weeklyCost: 2380 },
        { name: "Nitro Courier", formation: "Wedge", name_it: "Corriere Nitro", hp: 130, mp: 80, atk: 58, def: 32, mat: 28, mdf: 28, agi: 82, luk: 42, hiringCost: 29400, weeklyCost: 5880 },
        { name: "Velocity Cultist", formation: "Column", name_it: "Cultista della Velocità", hp: 160, mp: 100, atk: 75, def: 38, mat: 40, mdf: 35, agi: 100, luk: 50, hiringCost: 58800, weeklyCost: 11760 },
        { name: "Sonic Demon", formation: "Crescent", name_it: "Demone Sonico", hp: 190, mp: 130, atk: 92, def: 45, mat: 52, mdf: 45, agi: 120, luk: 60, hiringCost: 112000, weeklyCost: 22400 }
      ],
      leaders: [
        { name: "High Seraph Gabriel", spritename: "Actor1", spriteindex: 0, personality: "Disciplined" },
        { name: "Divine Empress Aurora", spritename: "Actor2", spriteindex: 1, personality: "Authoritative" },
        { name: "Celestial King Raphael", spritename: "Actor3", spriteindex: 2, personality: "Stoic" },
        { name: "Holy Matriarch Seraphina", spritename: "Actor1", spriteindex: 3, personality: "Artistic" },
        { name: "Light Lord Michael", spritename: "Actor2", spriteindex: 4, personality: "Nervous" },
        { name: "Sacred Queen Uriel", spritename: "Actor3", spriteindex: 5, personality: "Timid" },
        { name: "Heaven's Champion Azrael", spritename: "Actor1", spriteindex: 6, personality: "Melancholic" },
        { name: "Radiant Mistress Cassiel", spritename: "Actor2", spriteindex: 7, personality: "Loyal" }
      ]
    },
    {
      id: 17,
      name: "Seven Sisters",
      name_it: "Sette Sorelle",
      noStartingTroops: true,
      description: "The seven ruling families that hold a monopoly on all fuel production.",
      description_it: "Le sette famiglie regnanti che detengono il monopolio su tutta la produzione di carburante.",
      parentFaction: 2,
      troops: [
        { name: "Family Enforcer", formation: "Line", name_it: "Esecutore Familiare", hp: 140, mp: 70, atk: 50, def: 45, mat: 30, mdf: 38, agi: 35, luk: 28, hiringCost: 25200, weeklyCost: 5040 },
        { name: "Oil Baron Guard", formation: "Phalanx", name_it: "Guardia del Barone", hp: 190, mp: 90, atk: 68, def: 60, mat: 42, mdf: 50, agi: 40, luk: 32, hiringCost: 53200, weeklyCost: 10640 },
        { name: "Family Champion", formation: "Box", name_it: "Campione della Famiglia", hp: 240, mp: 120, atk: 88, def: 75, mat: 58, mdf: 65, agi: 48, luk: 38, hiringCost: 98000, weeklyCost: 19600 },
        { name: "Heiress Assassin", formation: "Scattered", name_it: "Assassina Ereditiera", hp: 200, mp: 150, atk: 105, def: 55, mat: 75, mdf: 60, agi: 75, luk: 55, hiringCost: 168000, weeklyCost: 33600 }
      ],
      leaders: [
        { name: "Void Emperor Nihil", spritename: "Actor1", spriteindex: 0, personality: "Melancholic" },
        { name: "Entropy Empress Umbra", spritename: "Actor2", spriteindex: 1, personality: "Aggressive" },
        { name: "Null King Vacuus", spritename: "Actor3", spriteindex: 2, personality: "Nurturing" },
        { name: "Oblivion Queen Tenebris", spritename: "Actor1", spriteindex: 3, personality: "Brave" },
        { name: "Emptiness Lord Khaos", spritename: "Actor2", spriteindex: 4, personality: "Cautious" },
        { name: "Nothingness Sovereign Erebus", spritename: "Actor3", spriteindex: 5, personality: "Timid" },
        { name: "Abyss Ruler Nyx", spritename: "Actor1", spriteindex: 6, personality: "Timid" },
        { name: "Dark Matter Monarch Styx", spritename: "Actor2", spriteindex: 7, personality: "Authoritative" }
      ]
    },
    {
      id: 18,
      name: "The Gods",
      name_it: "Gli Dei",
      description: "The divine pantheon overseeing the realms, largely indifferent to mortal suffering.",
      description_it: "Il pantheon divino che sorveglia i regni, in gran parte indifferente alla sofferenza mortale.",
      iconIndex: 118,
      noStartingTroops: true,
      troops: [
        { name: "Divine Herald", formation: "Circle", name_it: "Araldo Divino", hp: 180, mp: 250, atk: 50, def: 45, mat: 85, mdf: 80, agi: 50, luk: 70, hiringCost: 42000, weeklyCost: 8400, spritename: "Actor1", spriteindex: 1, role: "support" },
        { name: "Heavenly Archer", formation: "Column", name_it: "Arciere Celeste", hp: 190, mp: 230, atk: 68, def: 42, mat: 78, mdf: 75, agi: 72, luk: 75, hiringCost: 70000, weeklyCost: 14000, spritename: "Actor1", spriteindex: 1, role: "ranged" },
        { name: "Celestial Guardian", formation: "Phalanx", name_it: "Guardiano Celestiale", hp: 250, mp: 320, atk: 75, def: 70, mat: 110, mdf: 100, agi: 55, luk: 80, hiringCost: 91000, weeklyCost: 18200, spritename: "Actor1", spriteindex: 1, role: "close quarters" },
        { name: "Divine Templar", formation: "Wedge", name_it: "Templare Divino", hp: 290, mp: 350, atk: 92, def: 95, mat: 105, mdf: 115, agi: 58, luk: 85, hiringCost: 133000, weeklyCost: 26600, spritename: "Actor1", spriteindex: 1, role: "close quarters" },
        { name: "Seraphim Warrior", formation: "Double", name_it: "Guerriero Serafino", hp: 320, mp: 400, atk: 100, def: 90, mat: 140, mdf: 130, agi: 65, luk: 90, hiringCost: 168000, weeklyCost: 33600, spritename: "Actor1", spriteindex: 1, role: "close quarters" },
        { name: "Angelic Sniper", formation: "Scattered", name_it: "Cecchino Angelico", hp: 270, mp: 380, atk: 115, def: 65, mat: 125, mdf: 120, agi: 95, luk: 95, hiringCost: 238000, weeklyCost: 47600, spritename: "Actor1", spriteindex: 1, role: "ranged" },
        { name: "High Priest", formation: "Box", name_it: "Sommo Sacerdote", hp: 310, mp: 450, atk: 70, def: 75, mat: 160, mdf: 155, agi: 60, luk: 100, hiringCost: 294000, weeklyCost: 58800, spritename: "Actor1", spriteindex: 1, role: "support" },
        { name: "Demigod Avatar", formation: "Column", name_it: "Avatar Semidivino", hp: 400, mp: 500, atk: 130, def: 110, mat: 180, mdf: 165, agi: 75, luk: 100, hiringCost: 350000, weeklyCost: 70000, spritename: "Actor1", spriteindex: 1, role: "close quarters" }
      ],
      leaders: [
        { name: "Zeus the Thunderer", spritename: "Actor1", spriteindex: 0, personality: "Authoritative" },
        { name: "Athena the Wise", spritename: "Actor2", spriteindex: 1, personality: "Scholarly" },
        { name: "Ares the Warmonger", spritename: "Actor3", spriteindex: 2, personality: "Aggressive" },
        { name: "Hades the Indifferent", spritename: "Actor1", spriteindex: 3, personality: "Melancholic" },
        { name: "Artemis the Hunter", spritename: "Actor2", spriteindex: 4, personality: "Adventurous" },
        { name: "Dionysus the Reveler", spritename: "Actor3", spriteindex: 5, personality: "Hedonistic" },
        { name: "Apollo the Radiant", spritename: "Actor1", spriteindex: 6, personality: "Artistic" },
        { name: "Hera the Jealous", spritename: "Actor2", spriteindex: 7, personality: "Possessive" }
      ]
    },
    {
      id: 19,
      name: "Supreme Archivist Council",
      name_it: "Consiglio Supremo",
      description: "The elders who decide which truths are remembered and which are erased forever.",
      description_it: "Gli anziani che decidono quali verità vengono ricordate e quali cancellate per sempre.",
      parentFaction: 1,
      troops: [
        { name: "Council Scribe", formation: "Box", name_it: "Scriba del Consiglio", hp: 110, mp: 140, atk: 22, def: 25, mat: 48, mdf: 45, agi: 18, luk: 30, hiringCost: 21000, weeklyCost: 4200 },
        { name: "Truth Keeper", formation: "Double", name_it: "Custode della Verità", hp: 150, mp: 200, atk: 30, def: 35, mat: 68, mdf: 65, agi: 22, luk: 38, hiringCost: 49000, weeklyCost: 9800 },
        { name: "Council Elder", formation: "Circle", name_it: "Anziano del Consiglio", hp: 200, mp: 280, atk: 38, def: 45, mat: 92, mdf: 88, agi: 28, luk: 50, hiringCost: 105000, weeklyCost: 21000 }
      ],
      leaders: [
        { name: "High Archivist Mnemosyne", spritename: "Actor1", spriteindex: 0, personality: "Scholarly" },
        { name: "Elder Erasmus", spritename: "Actor2", spriteindex: 1, personality: "Cautious" },
        { name: "Truth-Keeper Alexandria", spritename: "Actor3", spriteindex: 2, personality: "Authoritative" },
        { name: "Curator Oblivion", spritename: "Actor1", spriteindex: 3, personality: "Cynical" }
      ]
    },
    {
      id: 20,
      name: "Data Acquisition Department",
      name_it: "Dip. Acquisizione Dati",
      description: "Field agents and spies tasked with stealing secrets and recovering lost artifacts.",
      description_it: "Agenti sul campo e spie incaricati di rubare segreti e recuperare artefatti perduti.",
      parentFaction: 1,
      troops: [
        { name: "Field Agent", formation: "Line", name_it: "Agente sul Campo", hp: 120, mp: 90, atk: 40, def: 28, mat: 32, mdf: 30, agi: 48, luk: 35, hiringCost: 22400, weeklyCost: 4480 },
        { name: "Acquisition Spy", formation: "Scattered", name_it: "Spia Acquisitrice", hp: 140, mp: 110, atk: 52, def: 32, mat: 45, mdf: 38, agi: 62, luk: 45, hiringCost: 44800, weeklyCost: 8960 },
        { name: "Elite Infiltrator", formation: "Column", name_it: "Infiltrato d'Elite", hp: 170, mp: 140, atk: 68, def: 38, mat: 60, mdf: 48, agi: 78, luk: 60, hiringCost: 91000, weeklyCost: 18200 }
      ],
      leaders: [
        { name: "Spymaster Cipher", spritename: "Actor1", spriteindex: 0, personality: "Paranoid" },
        { name: "Agent Codex", spritename: "Actor2", spriteindex: 1, personality: "Mischievous" },
        { name: "Director Shadow", spritename: "Actor3", spriteindex: 2, personality: "Cautious" },
        { name: "Operative Raven", spritename: "Actor1", spriteindex: 3, personality: "Adventurous" }
      ]
    },
    {
      id: 21,
      name: "Knowledge Preservation Division",
      name_it: "Div. Preservazione Conoscenza",
      description: "Librarians who maintain the physical integrity of the books and silence noisy patrons... permanently.",
      description_it: "Bibliotecari che mantengono l'integrità fisica dei libri e zittiscono i visitatori rumorosi... permanentemente.",
      parentFaction: 1,
      troops: [
        { name: "Silent Librarian", formation: "Circle", name_it: "Bibliotecario Silenzioso", hp: 130, mp: 120, atk: 35, def: 32, mat: 50, mdf: 52, agi: 25, luk: 28, hiringCost: 19600, weeklyCost: 3920 },
        { name: "Preservation Guard", formation: "Phalanx", name_it: "Guardia della Preservazione", hp: 180, mp: 140, atk: 55, def: 50, mat: 62, mdf: 68, agi: 30, luk: 32, hiringCost: 44800, weeklyCost: 8960 },
        { name: "Master Conservator", formation: "Double", name_it: "Maestro Conservatore", hp: 220, mp: 180, atk: 68, def: 62, mat: 80, mdf: 85, agi: 35, luk: 40, hiringCost: 98000, weeklyCost: 19600 }
      ],
      leaders: [
        { name: "Chief Librarian Silence", spritename: "Actor1", spriteindex: 0, personality: "Disciplined" },
        { name: "Conservator Grimoire", spritename: "Actor2", spriteindex: 1, personality: "Scholarly" },
        { name: "Keeper Codex", spritename: "Actor3", spriteindex: 2, personality: "Grumpy" },
        { name: "Archivist Quietus", spritename: "Actor1", spriteindex: 3, personality: "Timid" }
      ]
    },
    {
      id: 22,
      name: "Public Transparency Unit",
      name_it: "Unità Trasparenza Pubblica",
      description: "The propaganda wing. Their name is ironic; they specialize in redaction and misinformation.",
      description_it: "L'ala della propaganda. Il loro nome è ironico; sono specializzati in censure e disinformazione.",
      parentFaction: 1,
      troops: [
        { name: "Propagandist", formation: "Line", name_it: "Propagandista", hp: 105, mp: 110, atk: 28, def: 25, mat: 45, mdf: 40, agi: 30, luk: 42, hiringCost: 18200, weeklyCost: 3640 },
        { name: "Spin Doctor", formation: "Crescent", name_it: "Manipolatore", hp: 140, mp: 150, atk: 38, def: 32, mat: 62, mdf: 55, agi: 38, luk: 55, hiringCost: 40600, weeklyCost: 8120 },
        { name: "Misinformation Master", formation: "Box", name_it: "Maestro della Disinformazione", hp: 180, mp: 200, atk: 48, def: 40, mat: 85, mdf: 72, agi: 45, luk: 70, hiringCost: 91000, weeklyCost: 18200 }
      ],
      leaders: [
        { name: "Director Doubletalk", spritename: "Actor1", spriteindex: 0, personality: "Mischievous" },
        { name: "Minister Redact", spritename: "Actor2", spriteindex: 1, personality: "Cynical" },
        { name: "Chief Spin Doctor Orwell", spritename: "Actor3", spriteindex: 2, personality: "Authoritative" },
        { name: "Propagandist-in-Chief Pravda", spritename: "Actor1", spriteindex: 3, personality: "Hedonistic" }
      ]
    },
    {
      id: 23,
      name: "Internal Compliance Unit",
      name_it: "Unità Conformità Interna",
      description: "The secret police ensuring no Archivist leaks data to the outside world.",
      description_it: "La polizia segreta che assicura che nessun Archivista divulghi dati al mondo esterno.",
      parentFaction: 1,
      troops: [
        { name: "Compliance Officer", formation: "Line", name_it: "Ufficiale di Conformità", hp: 140, mp: 90, atk: 45, def: 40, mat: 35, mdf: 42, agi: 38, luk: 30, hiringCost: 23800, weeklyCost: 4760 },
        { name: "Secret Enforcer", formation: "Wedge", name_it: "Esecutore Segreto", hp: 190, mp: 110, atk: 65, def: 55, mat: 48, mdf: 58, agi: 48, luk: 35, hiringCost: 53200, weeklyCost: 10640 },
        { name: "Internal Inquisitor", formation: "Phalanx", name_it: "Inquisitore Interno", hp: 240, mp: 140, atk: 85, def: 70, mat: 65, mdf: 75, agi: 55, luk: 42, hiringCost: 112000, weeklyCost: 22400 }
      ],
      leaders: [
        { name: "Grand Inquisitor Loyalty", spritename: "Actor1", spriteindex: 0, personality: "Paranoid" },
        { name: "Director Compliance", spritename: "Actor2", spriteindex: 1, personality: "Disciplined" },
        { name: "Chief Enforcer Ironhand", spritename: "Actor3", spriteindex: 2, personality: "Authoritative" },
        { name: "Watchmaster Vigilance", spritename: "Actor1", spriteindex: 3, personality: "Cautious" }
      ]
    },
    {
      id: 24,
      name: "Libertarian Gods",
      name_it: "Dei Libertari",
      noStartingTroops: true,
      description: "Minor deities who demand no worship, only mutually beneficial transactions.",
      description_it: "Divinità minori che non richiedono adorazione, ma solo transazioni reciprocamente vantaggiose.",
      parentFaction: 18,
      troops: [
        { name: "Free Market Angel", formation: "Circle", name_it: "Angelo del Libero Mercato", hp: 160, mp: 200, atk: 48, def: 42, mat: 75, mdf: 68, agi: 55, luk: 65, hiringCost: 39200, weeklyCost: 7840 },
        { name: "Contract Enforcer", formation: "Column", name_it: "Esecutore Contrattuale", hp: 200, mp: 240, atk: 68, def: 60, mat: 95, mdf: 85, agi: 62, luk: 75, hiringCost: 84000, weeklyCost: 16800 },
        { name: "Sovereign Spirit", formation: "Wedge", name_it: "Spirito Sovrano", hp: 260, mp: 300, atk: 90, def: 75, mat: 125, mdf: 110, agi: 70, luk: 90, hiringCost: 154000, weeklyCost: 30800 }
      ],
      leaders: [
        { name: "Ayn Rand the Divine", spritename: "Actor1", spriteindex: 0, personality: "Cynical" },
        { name: "Adam Smith Ascended", spritename: "Actor2", spriteindex: 1, personality: "Scholarly" },
        { name: "Invisible Hand", spritename: "Actor3", spriteindex: 2, personality: "Mischievous" },
        { name: "Sovereign of Self", spritename: "Actor1", spriteindex: 3, personality: "Brave" }
      ]
    },
    {
      id: 25,
      name: "Goblin Collective Unconsciuous",
      name_it: "Inconscio Collettivo Goblin",
      noStartingTroops: true,
      description: "The psychic link that connects all goblin minds, storing their ancestral chaotic wisdom.",
      description_it: "Il legame psichico che connette tutte le menti goblin, conservando la loro caotica saggezza ancestrale.",
      iconIndex: 182,
      troops: [
        { name: "Psychic Goblin", formation: "Circle", name_it: "Goblin Psichico", hp: 100, mp: 140, atk: 32, def: 25, mat: 55, mdf: 60, agi: 38, luk: 40, hiringCost: 12600, weeklyCost: 2520, spritename: "Actor1", spriteindex: 1, role: "support" },
        { name: "Mind Striker", formation: "Wedge", name_it: "Colpitore Mentale", hp: 120, mp: 150, atk: 45, def: 30, mat: 62, mdf: 68, agi: 42, luk: 45, hiringCost: 23800, weeklyCost: 4760, spritename: "Actor1", spriteindex: 1, role: "close quarters" },
        { name: "Hive Mind Warrior", formation: "Phalanx", name_it: "Guerriero Mente Alveare", hp: 140, mp: 180, atk: 48, def: 35, mat: 72, mdf: 78, agi: 45, luk: 50, hiringCost: 30800, weeklyCost: 6160, spritename: "Actor1", spriteindex: 1, role: "close quarters" },
        { name: "Psychic Slinger", formation: "Scattered", name_it: "Lanciatore Psichico", hp: 125, mp: 170, atk: 52, def: 28, mat: 68, mdf: 72, agi: 65, luk: 52, hiringCost: 47600, weeklyCost: 9520, spritename: "Actor1", spriteindex: 1, role: "ranged" },
        { name: "Collective Conduit", formation: "Double", name_it: "Condotto Collettivo", hp: 180, mp: 240, atk: 62, def: 45, mat: 95, mdf: 100, agi: 52, luk: 65, hiringCost: 67200, weeklyCost: 13440, spritename: "Actor1", spriteindex: 1, role: "support" },
        { name: "Telepathic Sniper", formation: "Column", name_it: "Cecchino Telepatico", hp: 160, mp: 210, atk: 75, def: 38, mat: 88, mdf: 92, agi: 82, luk: 70, hiringCost: 100800, weeklyCost: 20160, spritename: "Actor1", spriteindex: 1, role: "ranged" },
        { name: "Ancestral Echo", formation: "Crescent", name_it: "Eco Ancestrale", hp: 230, mp: 320, atk: 78, def: 55, mat: 125, mdf: 135, agi: 60, luk: 85, hiringCost: 133000, weeklyCost: 26600, spritename: "Actor1", spriteindex: 1, role: "support" }
      ],
      leaders: [
        { name: "Hive Alpha Griknak", spritename: "Actor1", spriteindex: 0, personality: "Nervous" },
        { name: "Psychic Prime Skizzik", spritename: "Actor2", spriteindex: 1, personality: "Mischievous" },
        { name: "Collective One Gribblik", spritename: "Actor3", spriteindex: 2, personality: "Chaotic" },
        { name: "Mind-Unity Zogwort", spritename: "Actor1", spriteindex: 3, personality: "Empathetic" }
      ]
    },
    {
      id: 26,
      name: "The Tourists",
      name_it: "I Turisti",
      noStartingTroops: true,
      description: "Aliens from Zeta Reticuli viewing this world's conflicts as mere entertainment.",
      description_it: "Alieni da Zeta Reticuli che vedono i conflitti di questo mondo come mero intrattenimento.",
      iconIndex: 158,
      troops: [
        { name: "Observer Drone", formation: "Circle", name_it: "Drone Osservatore", hp: 120, mp: 100, atk: 40, def: 50, mat: 60, mdf: 60, agi: 45, luk: 50, hiringCost: 28000, weeklyCost: 5600, spritename: "Actor1", spriteindex: 1, role: "support" },
        { name: "Probe Scout", formation: "Scattered", name_it: "Sonda Esploratrice", hp: 130, mp: 110, atk: 52, def: 45, mat: 68, mdf: 68, agi: 72, luk: 58, hiringCost: 49000, weeklyCost: 9800, spritename: "Actor1", spriteindex: 1, role: "ranged" },
        { name: "Alien Tourist", formation: "Box", name_it: "Turista Alieno", hp: 170, mp: 150, atk: 58, def: 68, mat: 85, mdf: 85, agi: 55, luk: 65, hiringCost: 63000, weeklyCost: 12600, spritename: "Actor1", spriteindex: 1, role: "close quarters" },
        { name: "Beam Sniper", formation: "Column", name_it: "Cecchino a Raggi", hp: 160, mp: 170, atk: 78, def: 58, mat: 92, mdf: 90, agi: 88, luk: 75, hiringCost: 95200, weeklyCost: 19040, spritename: "Actor1", spriteindex: 1, role: "ranged" },
        { name: "Reality Manipulator", formation: "Crescent", name_it: "Manipolatore della Realtà", hp: 220, mp: 220, atk: 75, def: 85, mat: 115, mdf: 115, agi: 65, luk: 80, hiringCost: 126000, weeklyCost: 25200, spritename: "Actor1", spriteindex: 1, role: "support" },
        { name: "Enforcer Construct", formation: "Phalanx", name_it: "Costrutto Esecutore", hp: 260, mp: 200, atk: 98, def: 115, mat: 105, mdf: 110, agi: 62, luk: 85, hiringCost: 189000, weeklyCost: 37800, spritename: "Actor1", spriteindex: 1, role: "close quarters" },
        { name: "Plasma Rifleman", formation: "Double", name_it: "Fuciliere al Plasma", hp: 230, mp: 250, atk: 115, def: 75, mat: 135, mdf: 130, agi: 105, luk: 95, hiringCost: 231000, weeklyCost: 46200, spritename: "Actor1", spriteindex: 1, role: "ranged" },
        { name: "Zetan Overseer", formation: "Box", name_it: "Supervisore Zetano", hp: 300, mp: 300, atk: 95, def: 110, mat: 150, mdf: 150, agi: 80, luk: 100, hiringCost: 252000, weeklyCost: 50400, spritename: "Actor1", spriteindex: 1, role: "support" }
      ],
      leaders: [
        { name: "Ambassador Zyx-7", spritename: "Actor1", spriteindex: 0, personality: "Calm" },
        { name: "Overseer Qel-9", spritename: "Actor2", spriteindex: 1, personality: "Scholarly" },
        { name: "Tourist Director Vrax-3", spritename: "Actor3", spriteindex: 2, personality: "Hedonistic" },
        { name: "Observer Prime Klix-5", spritename: "Actor1", spriteindex: 3, personality: "Cautious" }
      ]
    },
    {
      id: 27,
      name: "Holy Vatican Empire",
      name_it: "Sacro Vaticano Impero",
      description: "The ancient seat of the Papacy, a city-state that wields immense spiritual and temporal power. It operates on faith, tradition, and clandestine operations.",
      description_it: "L'antica sede del Papato, una città-stato che esercita un immenso potere spirituale e temporale. Opera sulla base della fede, della tradizione e di operazioni clandestine.",
      iconIndex: 221,
      troops: [
        { name: "Altar Server", formation: "Circle", name_it: "Chierichetto", hp: 95, mp: 100, atk: 25, def: 22, mat: 40, mdf: 48, agi: 20, luk: 25, hiringCost: 9100, weeklyCost: 1820, spritename: "Actor1", spriteindex: 1, role: "support" },
        { name: "Vatican Guard", formation: "Phalanx", name_it: "Guardia Vaticana", hp: 140, mp: 120, atk: 45, def: 50, mat: 48, mdf: 62, agi: 28, luk: 30, hiringCost: 25200, weeklyCost: 5040, spritename: "Actor1", spriteindex: 1, role: "close quarters" },
        { name: "Holy Archer", formation: "Line", name_it: "Arciere Sacro", hp: 125, mp: 110, atk: 52, def: 38, mat: 52, mdf: 58, agi: 55, luk: 32, hiringCost: 39200, weeklyCost: 7840, spritename: "Actor1", spriteindex: 1, role: "ranged" },
        { name: "Holy Knight", formation: "Wedge", name_it: "Cavaliere Sacro", hp: 190, mp: 160, atk: 68, def: 75, mat: 65, mdf: 85, agi: 35, luk: 38, hiringCost: 56000, weeklyCost: 11200, spritename: "Actor1", spriteindex: 1, role: "close quarters" },
        { name: "Blessed Marksman", formation: "Double", name_it: "Tiratore Benedetto", hp: 170, mp: 140, atk: 75, def: 48, mat: 68, mdf: 75, agi: 72, luk: 42, hiringCost: 81200, weeklyCost: 16240, spritename: "Actor1", spriteindex: 1, role: "ranged" },
        { name: "Papal Champion", formation: "Phalanx", name_it: "Campione Papale", hp: 250, mp: 220, atk: 90, def: 95, mat: 88, mdf: 110, agi: 42, luk: 48, hiringCost: 112000, weeklyCost: 22400, spritename: "Actor1", spriteindex: 1, role: "close quarters" },
        { name: "Vatican Priest", formation: "Box", name_it: "Sacerdote Vaticano", hp: 210, mp: 260, atk: 55, def: 62, mat: 105, mdf: 125, agi: 38, luk: 58, hiringCost: 147000, weeklyCost: 29400, spritename: "Actor1", spriteindex: 1, role: "support" },
        { name: "Divine Sniper", formation: "Column", name_it: "Cecchino Divino", hp: 220, mp: 200, atk: 105, def: 65, mat: 95, mdf: 100, agi: 95, luk: 55, hiringCost: 182000, weeklyCost: 36400, spritename: "Actor1", spriteindex: 1, role: "ranged" },
        { name: "Cardinal Templar", formation: "Wedge", name_it: "Cardinale Templare", hp: 310, mp: 280, atk: 110, def: 115, mat: 110, mdf: 140, agi: 48, luk: 60, hiringCost: 210000, weeklyCost: 42000, spritename: "Actor1", spriteindex: 1, role: "close quarters" }
      ],
      leaders: [
        { name: "Pope Benedict XVII", spritename: "Actor1", spriteindex: 0, personality: "Authoritative" },
        { name: "Cardinal Secretary Lorenzo", spritename: "Actor2", spriteindex: 1, personality: "Scholarly" },
        { name: "Archbishop Militaris", spritename: "Actor3", spriteindex: 2, personality: "Brave" },
        { name: "Mother Superior Magdalena", spritename: "Actor1", spriteindex: 3, personality: "Disciplined" },
        { name: "Papal Chamberlain Dante", spritename: "Actor2", spriteindex: 4, personality: "Loyal" },
        { name: "Cardinal Defender Maximus", spritename: "Actor3", spriteindex: 5, personality: "Aggressive" }
      ]
    },
    {
      id: 28,
      name: "Cardinal's Council",
      name_it: "Consiglio dei Cardinali",
      description: "The secretive inner circle of cardinals who advise the Pope and control the Church's political machinations.",
      description_it: "La cerchia ristretta e segreta di cardinali che consigliano il Papa and controllano le macchinazioni politiche della Chiesa.",
      parentFaction: 27,
      noStartingTroops: true,
      troops: [
        { name: "Council Deacon", formation: "Circle", name_it: "Diacono del Consiglio", hp: 120, mp: 150, atk: 30, def: 35, mat: 58, mdf: 70, agi: 25, luk: 35, hiringCost: 25200, weeklyCost: 5040 },
        { name: "Cardinal Advisor", formation: "Box", name_it: "Cardinale Consigliere", hp: 180, mp: 220, atk: 45, def: 55, mat: 85, mdf: 105, agi: 32, luk: 48, hiringCost: 63000, weeklyCost: 12600 },
        { name: "Prince of the Church", formation: "Double", name_it: "Principe della Chiesa", hp: 250, mp: 300, atk: 62, def: 75, mat: 115, mdf: 140, agi: 38, luk: 65, hiringCost: 140000, weeklyCost: 28000 }
      ],
      leaders: [
        { name: "Cardinal Prefect Giovanni", spritename: "Actor1", spriteindex: 0, personality: "Scholarly" },
        { name: "Prince-Cardinal Alessandro", spritename: "Actor2", spriteindex: 1, personality: "Authoritative" },
        { name: "Cardinal Secretary Bernardo", spritename: "Actor3", spriteindex: 2, personality: "Cynical" },
        { name: "Dean of Cardinals Francesco", spritename: "Actor1", spriteindex: 3, personality: "Cautious" }
      ]
    },
    {
      id: 29,
      name: "IOR",
      name_it: "IOR",
      noStartingTroops: true,
      description: "The Institute for the Works of Religion, the Vatican's controversial bank, rumored to handle funds from less-than-holy sources.",
      description_it: "L'Istituto per le Opere di Religione, la controversa banca vaticana, che si dice gestisca fondi da fonti non proprio sante.",
      parentFaction: 27,
      troops: [
        { name: "Bank Clerk", formation: "Box", name_it: "Impiegato Bancario", hp: 100, mp: 80, atk: 22, def: 25, mat: 35, mdf: 40, agi: 28, luk: 50, hiringCost: 16800, weeklyCost: 3360 },
        { name: "Financial Analyst", formation: "Double", name_it: "Analista Finanziario", hp: 130, mp: 110, atk: 32, def: 35, mat: 52, mdf: 58, agi: 35, luk: 65, hiringCost: 39200, weeklyCost: 7840 },
        { name: "IOR Enforcer", formation: "Line", name_it: "Esecutore IOR", hp: 170, mp: 130, atk: 50, def: 48, mat: 68, mdf: 75, agi: 42, luk: 70, hiringCost: 77000, weeklyCost: 15400 },
        { name: "Holy Banker", formation: "Crescent", name_it: "Banchiere Sacro", hp: 220, mp: 170, atk: 65, def: 60, mat: 90, mdf: 95, agi: 48, luk: 85, hiringCost: 133000, weeklyCost: 26600 }
      ],
      leaders: [
        { name: "President Calvi II", spritename: "Actor1", spriteindex: 0, personality: "Paranoid" },
        { name: "Director Marcinkus III", spritename: "Actor2", spriteindex: 1, personality: "Cynical" },
        { name: "Treasurer Monsignor Luciano", spritename: "Actor3", spriteindex: 2, personality: "Greedy" },
        { name: "Auditor Bishop Santoro", spritename: "Actor1", spriteindex: 3, personality: "Cautious" }
      ]
    },
    {
      id: 30,
      name: "Battle Nuns",
      name_it: "Suore da Battaglia",
      description: "An order of militant nuns trained in both scripture and modern combat, serving as the Vatican's special forces.",
      description_it: "Un ordine di suore militanti addestrate sia nelle sacre scritture che nel combattimento moderno, che fungono da forze speciali del Vaticano.",
      parentFaction: 27,
      troops: [
        { name: "Novice Sister", formation: "Scattered", name_it: "Suora Novizia", hp: 110, mp: 110, atk: 38, def: 32, mat: 42, mdf: 52, agi: 35, luk: 28, hiringCost: 19600, weeklyCost: 3920 },
        { name: "Battle Sister", formation: "Line", name_it: "Suora da Battaglia", hp: 160, mp: 150, atk: 58, def: 50, mat: 62, mdf: 75, agi: 48, luk: 35, hiringCost: 49000, weeklyCost: 9800 },
        { name: "Sister Superior", formation: "Wedge", name_it: "Suora Superiore", hp: 210, mp: 200, atk: 78, def: 68, mat: 85, mdf: 100, agi: 58, luk: 42, hiringCost: 98000, weeklyCost: 19600 },
        { name: "Mother Superior", formation: "Column", name_it: "Madre Superiora", hp: 270, mp: 260, atk: 100, def: 85, mat: 110, mdf: 130, agi: 68, luk: 52, hiringCost: 182000, weeklyCost: 36400 }
      ],
      leaders: [
        { name: "Abbess Militant Catherine", spritename: "Actor1", spriteindex: 0, personality: "Disciplined" },
        { name: "Sister Commander Maria", spritename: "Actor2", spriteindex: 1, personality: "Brave" },
        { name: "Mother Warrior Theresa", spritename: "Actor3", spriteindex: 2, personality: "Aggressive" },
        { name: "Prioress Joanna", spritename: "Actor1", spriteindex: 3, personality: "Loyal" }
      ]
    },
    {
      id: 31,
      name: "Hexorcists Corp",
      name_it: "Corpo degli Esorcisti",
      description: "A specialized unit of tech-priests who combat demonic code, rogue AIs, and other digital heresies.",
      description_it: "Un'unità specializzata di tecno-preti che combattono codice demoniaco, IA corrotte e altre eresie digitali.",
      parentFaction: 27,
      troops: [
        { name: "Cyber Acolyte", formation: "Circle", name_it: "Accolito Cyber", hp: 115, mp: 140, atk: 40, def: 35, mat: 65, mdf: 58, agi: 45, luk: 38, hiringCost: 22400, weeklyCost: 4480 },
        { name: "Tech-Priest", formation: "Box", name_it: "Tecno-Prete", hp: 155, mp: 200, atk: 55, def: 48, mat: 90, mdf: 80, agi: 52, luk: 45, hiringCost: 53200, weeklyCost: 10640 },
        { name: "Digital Exorcist", formation: "Column", name_it: "Esorcista Digitale", hp: 200, mp: 270, atk: 70, def: 60, mat: 115, mdf: 105, agi: 60, luk: 55, hiringCost: 105000, weeklyCost: 21000 },
        { name: "Master Hexorcist", formation: "Double", name_it: "Maestro Esorcista", hp: 260, mp: 350, atk: 88, def: 75, mat: 145, mdf: 135, agi: 70, luk: 68, hiringCost: 196000, weeklyCost: 39200 }
      ],
      leaders: [
        { name: "Chief Hexorcist Raphael", spritename: "Actor1", spriteindex: 0, personality: "Scholarly" },
        { name: "Tech-Bishop Alan Turing", spritename: "Actor2", spriteindex: 1, personality: "Nervous" },
        { name: "Cyber-Cardinal Neo", spritename: "Actor3", spriteindex: 2, personality: "Disciplined" },
        { name: "Digital Prelate Morpheus", spritename: "Actor1", spriteindex: 3, personality: "Cautious" }
      ]
    },
    {
      id: 32,
      name: "Gay Lobby",
      name_it: "Lobby Gay",
      noStartingTroops: true,
      description: "A powerful and influential shadow group within the Vatican, advocating for progressive reforms from within the ancient institution.",
      description_it: "Un potente e influente gruppo ombra all'interno del Vaticano, che promuove riforme progressiste dall'interno dell'antica istituzione.",
      parentFaction: 27,
      troops: [
        { name: "Progressive Priest", formation: "Circle", name_it: "Prete Progressista", hp: 105, mp: 120, atk: 28, def: 30, mat: 50, mdf: 55, agi: 38, luk: 45, hiringCost: 18200, weeklyCost: 3640 },
        { name: "Reform Advocate", formation: "Crescent", name_it: "Sostenitore della Riforma", hp: 140, mp: 170, atk: 38, def: 42, mat: 72, mdf: 78, agi: 48, luk: 60, hiringCost: 43400, weeklyCost: 8680 },
        { name: "Shadow Diplomat", formation: "Box", name_it: "Diplomatico Ombra", hp: 180, mp: 230, atk: 50, def: 52, mat: 98, mdf: 105, agi: 58, luk: 80, hiringCost: 95200, weeklyCost: 19040 }
      ],
      leaders: [
        { name: "Father Sebastian", spritename: "Actor1", spriteindex: 0, personality: "Empathetic" },
        { name: "Monsignor Gabriel", spritename: "Actor2", spriteindex: 1, personality: "Nurturing" },
        { name: "Cardinal Advocate Antonio", spritename: "Actor3", spriteindex: 2, personality: "Brave" },
        { name: "Bishop Reformer Matteo", spritename: "Actor1", spriteindex: 3, personality: "Loyal" }
      ]
    },
    {
      id: 33,
      name: "Opus Dei",
      name_it: "Opus Dei",
      description: "A deeply conservative and secretive lay organization known for its members' unwavering devotion and influence in secular society.",
      description_it: "Un'organizzazione laica profondamente conservatrice e segreta, nota per l'incrollabile devozione e l'influenza dei suoi membri nella società secolare.",
      parentFaction: 27,
      troops: [
        { name: "Devoted Numerary", formation: "Phalanx", name_it: "Numerario Devoto", hp: 125, mp: 100, atk: 42, def: 40, mat: 45, mdf: 50, agi: 32, luk: 35, hiringCost: 21000, weeklyCost: 4200 },
        { name: "Secular Agent", formation: "Line", name_it: "Agente Secolare", hp: 165, mp: 130, atk: 60, def: 55, mat: 62, mdf: 68, agi: 40, luk: 42, hiringCost: 50400, weeklyCost: 10080 },
        { name: "Opus Dei Zealot", formation: "Wedge", name_it: "Zelota dell'Opus Dei", hp: 210, mp: 170, atk: 80, def: 72, mat: 85, mdf: 90, agi: 48, luk: 50, hiringCost: 100800, weeklyCost: 20160 },
        { name: "Supernumerary Elite", formation: "Box", name_it: "Elite Supernumeraria", hp: 270, mp: 220, atk: 105, def: 92, mat: 110, mdf: 120, agi: 55, luk: 62, hiringCost: 189000, weeklyCost: 37800 }
      ],
      leaders: [
        { name: "Prelate Josemaría II", spritename: "Actor1", spriteindex: 0, personality: "Authoritative" },
        { name: "Director Escrivá III", spritename: "Actor2", spriteindex: 1, personality: "Disciplined" },
        { name: "Numerary Superior Ricardo", spritename: "Actor3", spriteindex: 2, personality: "Paranoid" },
        { name: "Vicar General Felipe", spritename: "Actor1", spriteindex: 3, personality: "Cautious" }
      ]
    },
    {
      id: 34,
      name: "Swiss Guards",
      name_it: "Guardie Svizzere",
      description: "The colorfully-dressed but deadly elite mercenaries sworn to protect the Pope, wielding both halberds and advanced plasma rifles.",
      description_it: "I mercenari d'élite vestiti in modo colorato ma letali, che hanno giurato di proteggere il Papa, brandendo sia alabarde che fucili al plasma avanzati.",
      parentFaction: 27,
      troops: [
        { name: "Swiss Recruit", formation: "Line", name_it: "Recluta Svizzera", hp: 135, mp: 70, atk: 48, def: 52, mat: 22, mdf: 38, agi: 38, luk: 30, hiringCost: 25200, weeklyCost: 5040 },
        { name: "Halberdier", formation: "Phalanx", name_it: "Alabardiere", hp: 190, mp: 90, atk: 72, def: 78, mat: 30, mdf: 52, agi: 45, luk: 35, hiringCost: 58800, weeklyCost: 11760 },
        { name: "Plasma Guard", formation: "Double", name_it: "Guardia al Plasma", hp: 240, mp: 110, atk: 95, def: 95, mat: 48, mdf: 68, agi: 52, luk: 42, hiringCost: 119000, weeklyCost: 23800 },
        { name: "Swiss Commander", formation: "Wedge", name_it: "Comandante Svizzero", hp: 300, mp: 140, atk: 120, def: 115, mat: 62, mdf: 88, agi: 60, luk: 52, hiringCost: 224000, weeklyCost: 44800 }
      ],
      leaders: [
        { name: "Commandant Wilhelm Tell III", spritename: "Actor1", spriteindex: 0, personality: "Brave" },
        { name: "Colonel Hans Pfyffer", spritename: "Actor2", spriteindex: 1, personality: "Disciplined" },
        { name: "Captain Kaspar von Silenen", spritename: "Actor3", spriteindex: 2, personality: "Loyal" },
        { name: "Lieutenant Urs Graf", spritename: "Actor1", spriteindex: 3, personality: "Aggressive" }
      ]
    },
    {
      id: 35,
      name: "USSR",
      name_it: "USSR",
      description: "The mighty military force of the Soviet Union, renowned for its discipline, massive numbers, and unwavering ideology.",
      description_it: "La potente forza militare dell'Unione Sovietica, rinomata per la sua disciplina, numeri massicci e ideologia incrollabile.",
      iconIndex: 79,
      troops: [
        { name: "Red Army Recruit", formation: "Line", name_it: "Recluta Armata Rossa", hp: 100, mp: 40, atk: 35, def: 32, mat: 15, mdf: 20, agi: 25, luk: 18, hiringCost: 9800, weeklyCost: 1960, spritename: "Actor1", spriteindex: 1, role: "close quarters" },
        { name: "Soviet Rifleman", formation: "Double", name_it: "Fuciliere Sovietico", hp: 130, mp: 50, atk: 48, def: 42, mat: 18, mdf: 25, agi: 30, luk: 20, hiringCost: 18200, weeklyCost: 3640, spritename: "Actor1", spriteindex: 1, role: "ranged" },
        { name: "Commissar", formation: "Box", name_it: "Commissario", hp: 140, mp: 90, atk: 42, def: 38, mat: 45, mdf: 48, agi: 28, luk: 30, hiringCost: 25200, weeklyCost: 5040, spritename: "Actor1", spriteindex: 1, role: "support" },
        { name: "Red Veteran", formation: "Phalanx", name_it: "Veterano Rosso", hp: 165, mp: 60, atk: 62, def: 55, mat: 22, mdf: 32, agi: 35, luk: 25, hiringCost: 39200, weeklyCost: 7840, spritename: "Actor1", spriteindex: 1, role: "close quarters" },
        { name: "Soviet Sniper", formation: "Column", name_it: "Cecchino Sovietico", hp: 145, mp: 55, atk: 72, def: 35, mat: 20, mdf: 28, agi: 68, luk: 32, hiringCost: 50400, weeklyCost: 10080, spritename: "Actor1", spriteindex: 1, role: "ranged" },
        { name: "Red Officer", formation: "Line", name_it: "Ufficiale Rosso", hp: 180, mp: 110, atk: 58, def: 52, mat: 55, mdf: 60, agi: 38, luk: 35, hiringCost: 67200, weeklyCost: 13440, spritename: "Actor1", spriteindex: 1, role: "support" },
        { name: "Elite Soldier", formation: "Wedge", name_it: "Soldato d'Elite", hp: 210, mp: 70, atk: 82, def: 72, mat: 28, mdf: 42, agi: 45, luk: 30, hiringCost: 95200, weeklyCost: 19040, spritename: "Actor1", spriteindex: 1, role: "close quarters" },
        { name: "Soviet Commander", formation: "Box", name_it: "Comandante Sovietico", hp: 240, mp: 140, atk: 75, def: 68, mat: 72, mdf: 78, agi: 42, luk: 40, hiringCost: 140000, weeklyCost: 28000, spritename: "Actor1", spriteindex: 1, role: "support" }
      ],
      leaders: [
        { name: "Marshal Zhukov", spritename: "Actor1", spriteindex: 0, personality: "Cynical" },
        { name: "General Rokossovsky", spritename: "Actor2", spriteindex: 1, personality: "Apathetic" },
        { name: "Marshal Konev", spritename: "Actor3", spriteindex: 2, personality: "Calm" },
        { name: "General Chuikov", spritename: "Actor1", spriteindex: 3, personality: "Brave" },
        { name: "Admiral Kuznetsov", spritename: "Actor2", spriteindex: 4, personality: "Cautious" },
        { name: "General Vasilevsky", spritename: "Actor3", spriteindex: 5, personality: "Calm" },
        { name: "Marshal Timoshenko", spritename: "Actor1", spriteindex: 6, personality: "Brave" },
        { name: "General Malinovsky", spritename: "Actor2", spriteindex: 7, personality: "Apathetic" }
      ]
    },
    {
      id: 36,
      name: "Guards Division",
      name_it: "Divisione delle Guardie",
      description: "Elite Soviet units that have distinguished themselves in battle, bearing the prestigious 'Guards' title.",
      description_it: "Unità sovietiche d'élite che si sono distinte in battaglia, portando il prestigioso titolo di 'Guardie'.",
      parentFaction: 35,
      troops: [
        { name: "Guards Private", formation: "Phalanx", name_it: "Soldato delle Guardie", hp: 145, mp: 55, atk: 58, def: 52, mat: 20, mdf: 30, agi: 38, luk: 28, hiringCost: 28000, weeklyCost: 5600, spritename: "Actor1", spriteindex: 1, role: "close quarters" },
        { name: "Guards Sergeant", formation: "Double", name_it: "Sergente delle Guardie", hp: 175, mp: 65, atk: 72, def: 65, mat: 25, mdf: 38, agi: 42, luk: 32, hiringCost: 50400, weeklyCost: 10080, spritename: "Actor1", spriteindex: 1, role: "close quarters" },
        { name: "Guards Marksman", formation: "Line", name_it: "Tiratore delle Guardie", hp: 160, mp: 60, atk: 85, def: 45, mat: 22, mdf: 32, agi: 75, luk: 38, hiringCost: 67200, weeklyCost: 13440, spritename: "Actor1", spriteindex: 1, role: "ranged" },
        { name: "Guards Lieutenant", formation: "Box", name_it: "Tenente delle Guardie", hp: 195, mp: 100, atk: 68, def: 62, mat: 58, mdf: 65, agi: 45, luk: 40, hiringCost: 89600, weeklyCost: 17920, spritename: "Actor1", spriteindex: 1, role: "support" },
        { name: "Guards Captain", formation: "Wedge", name_it: "Capitano delle Guardie", hp: 220, mp: 85, atk: 92, def: 82, mat: 32, mdf: 48, agi: 52, luk: 35, hiringCost: 123200, weeklyCost: 24640, spritename: "Actor1", spriteindex: 1, role: "close quarters" },
        { name: "Guards Major", formation: "Column", name_it: "Maggiore delle Guardie", hp: 250, mp: 120, atk: 88, def: 78, mat: 72, mdf: 82, agi: 55, luk: 48, hiringCost: 168000, weeklyCost: 33600, spritename: "Actor1", spriteindex: 1, role: "support" }
      ],
      leaders: [
        { name: "Colonel Petrov", spritename: "Actor1", spriteindex: 0, personality: "Timid" },
        { name: "Major Ivanov", spritename: "Actor2", spriteindex: 1, personality: "Empathetic" },
        { name: "Captain Sokolov", spritename: "Actor3", spriteindex: 2, personality: "Apathetic" },
        { name: "Lieutenant Kozlov", spritename: "Actor1", spriteindex: 3, personality: "Nervous" },
        { name: "Sergeant Volkov", spritename: "Actor2", spriteindex: 4, personality: "Grumpy" },
        { name: "Hero Popov", spritename: "Actor3", spriteindex: 5, personality: "Loyal" },
        { name: "General Lebedev", spritename: "Actor1", spriteindex: 6, personality: "Empathetic" },
        { name: "Marshal Fedorov", spritename: "Actor2", spriteindex: 7, personality: "Calm" },
        { name: "Commander Smirnov", spritename: "Actor3", spriteindex: 0, personality: "Timid" },
        { name: "Hero Morozov", spritename: "Actor1", spriteindex: 1, personality: "Scholarly" }
      ]
    },
    {
      id: 37,
      name: "Tank Division",
      name_it: "Divisione Carri",
      description: "Armored forces equipped with T-34s and heavy tanks, the iron fist of the Red Army.",
      description_it: "Forze corazzate equipaggiate con T-34 e carri pesanti, il pugno di ferro dell'Armata Rossa.",
      parentFaction: 35,
      troops: [
        { name: "Tank Crewman", formation: "Line", name_it: "Carrista", hp: 125, mp: 50, atk: 52, def: 68, mat: 18, mdf: 35, agi: 32, luk: 25, hiringCost: 30800, weeklyCost: 6160, spritename: "Actor1", spriteindex: 1, role: "close quarters" },
        { name: "T-34 Driver", formation: "Column", name_it: "Pilota T-34", hp: 150, mp: 60, atk: 68, def: 85, mat: 22, mdf: 42, agi: 35, luk: 28, hiringCost: 56000, weeklyCost: 11200, spritename: "Actor1", spriteindex: 1, role: "close quarters" },
        { name: "Tank Commander", formation: "Box", name_it: "Comandante Carro", hp: 165, mp: 90, atk: 62, def: 72, mat: 45, mdf: 55, agi: 38, luk: 35, hiringCost: 78400, weeklyCost: 15680, spritename: "Actor1", spriteindex: 1, role: "support" },
        { name: "Heavy Tank Operator", formation: "Phalanx", name_it: "Operatore Carro Pesante", hp: 180, mp: 70, atk: 88, def: 105, mat: 25, mdf: 48, agi: 28, luk: 30, hiringCost: 112000, weeklyCost: 22400, spritename: "Actor1", spriteindex: 1, role: "close quarters" },
        { name: "Tank Ace", formation: "Wedge", name_it: "Asso dei Carri", hp: 195, mp: 80, atk: 95, def: 95, mat: 30, mdf: 52, agi: 42, luk: 38, hiringCost: 151200, weeklyCost: 30240, spritename: "Actor1", spriteindex: 1, role: "close quarters" },
        { name: "Armored Brigade Leader", formation: "Box", name_it: "Leader Brigata Corazzata", hp: 220, mp: 110, atk: 92, def: 88, mat: 62, mdf: 68, agi: 45, luk: 42, hiringCost: 196000, weeklyCost: 39200, spritename: "Actor1", spriteindex: 1, role: "support" }
      ],
      leaders: [
        { name: "Tank General Katukov", spritename: "Actor1", spriteindex: 0, personality: "Hedonistic" },
        { name: "Colonel Rotmistrov", spritename: "Actor2", spriteindex: 1, personality: "Melancholic" },
        { name: "Ace Commander Lavrinenko", spritename: "Actor3", spriteindex: 2, personality: "Grumpy" },
        { name: "Major Burda", spritename: "Actor1", spriteindex: 3, personality: "Melancholic" },
        { name: "Hero Kolobanov", spritename: "Actor2", spriteindex: 4, personality: "Mischievous" },
        { name: "Brigade Leader Getman", spritename: "Actor3", spriteindex: 5, personality: "Cautious" },
        { name: "General Rybalko", spritename: "Actor1", spriteindex: 6, personality: "Brave" },
        { name: "Tank Marshal Bogdanov", spritename: "Actor2", spriteindex: 7, personality: "Empathetic" },
        { name: "Commander Baryatinsky", spritename: "Actor3", spriteindex: 0, personality: "Adventurous" },
        { name: "Ace Oskin", spritename: "Actor1", spriteindex: 1, personality: "Artistic" }
      ]
    },
    {
      id: 38,
      name: "Rifle Division",
      name_it: "Divisione Fucilieri",
      description: "The backbone of the Red Army, brave riflemen who hold the line against all odds.",
      description_it: "La spina dorsale dell'Armata Rossa, coraggiosi fucilieri che tengono la linea contro ogni probabilità.",
      parentFaction: 35,
      troops: [
        { name: "Rifleman", formation: "Line", name_it: "Fuciliere", hp: 115, mp: 45, atk: 45, def: 38, mat: 16, mdf: 22, agi: 32, luk: 22, hiringCost: 16800, weeklyCost: 3360, spritename: "Actor1", spriteindex: 1, role: "ranged" },
        { name: "Veteran Rifleman", formation: "Double", name_it: "Fuciliere Veterano", hp: 145, mp: 55, atk: 62, def: 48, mat: 20, mdf: 28, agi: 38, luk: 25, hiringCost: 33600, weeklyCost: 6720, spritename: "Actor1", spriteindex: 1, role: "ranged" },
        { name: "Rifle Squad Leader", formation: "Box", name_it: "Caposquadra Fucilieri", hp: 160, mp: 75, atk: 58, def: 52, mat: 38, mdf: 45, agi: 42, luk: 30, hiringCost: 50400, weeklyCost: 10080, spritename: "Actor1", spriteindex: 1, role: "support" },
        { name: "Sharpshooter", formation: "Column", name_it: "Tiratore Scelto", hp: 140, mp: 50, atk: 78, def: 35, mat: 18, mdf: 25, agi: 72, luk: 35, hiringCost: 67200, weeklyCost: 13440, spritename: "Actor1", spriteindex: 1, role: "ranged" },
        { name: "Rifle Company Commander", formation: "Crescent", name_it: "Comandante Compagnia", hp: 185, mp: 95, atk: 68, def: 58, mat: 52, mdf: 62, agi: 48, luk: 38, hiringCost: 95200, weeklyCost: 19040, spritename: "Actor1", spriteindex: 1, role: "support" },
        { name: "Elite Marksman", formation: "Column", name_it: "Tiratore d'Elite", hp: 170, mp: 65, atk: 95, def: 42, mat: 25, mdf: 32, agi: 88, luk: 42, hiringCost: 134400, weeklyCost: 26880, spritename: "Actor1", spriteindex: 1, role: "ranged" }
      ],
      leaders: [
        { name: "Colonel Gorbatov", spritename: "Actor1", spriteindex: 0, personality: "Timid" },
        { name: "Major Shumilov", spritename: "Actor2", spriteindex: 1, personality: "Loyal" },
        { name: "Captain Rodimtsev", spritename: "Actor3", spriteindex: 2, personality: "Apathetic" },
        { name: "Sniper Zaitsev", spritename: "Actor1", spriteindex: 3, personality: "Brave" },
        { name: "Hero Pavlichenko", spritename: "Actor2", spriteindex: 4, personality: "Aggressive" },
        { name: "General Govorov", spritename: "Actor3", spriteindex: 5, personality: "Paranoid" },
        { name: "Commander Batov", spritename: "Actor1", spriteindex: 6, personality: "Nurturing" },
        { name: "Marshal Meretskov", spritename: "Actor2", spriteindex: 7, personality: "Fatalistic" },
        { name: "Hero Gromov", spritename: "Actor3", spriteindex: 0, personality: "Nurturing" },
        { name: "Sergeant Pavlov", spritename: "Actor1", spriteindex: 1, personality: "Scholarly" }
      ]
    },
    {
      id: 39,
      name: "Airborne Division",
      name_it: "Divisione Aviotrasportata",
      description: "Elite paratroopers and airborne forces, striking from the skies behind enemy lines.",
      description_it: "Paracadutisti d'élite e forze aviotrasportate, che colpiscono dai cieli dietro le linee nemiche.",
      parentFaction: 35,
      troops: [
        { name: "Paratrooper", formation: "Scattered", name_it: "Paracadutista", hp: 130, mp: 55, atk: 55, def: 42, mat: 22, mdf: 28, agi: 58, luk: 32, hiringCost: 36400, weeklyCost: 7280, spritename: "Actor1", spriteindex: 1, role: "ranged" },
        { name: "Airborne Assault", formation: "Wedge", name_it: "Assalto Aviotrasportato", hp: 155, mp: 65, atk: 72, def: 52, mat: 28, mdf: 35, agi: 65, luk: 35, hiringCost: 61600, weeklyCost: 12320, spritename: "Actor1", spriteindex: 1, role: "close quarters" },
        { name: "Jump Master", formation: "Box", name_it: "Maestro di Lancio", hp: 170, mp: 85, atk: 65, def: 55, mat: 48, mdf: 52, agi: 62, luk: 40, hiringCost: 84000, weeklyCost: 16800, spritename: "Actor1", spriteindex: 1, role: "support" },
        { name: "Airborne Sniper", formation: "Scattered", name_it: "Cecchino Aviotrasportato", hp: 150, mp: 60, atk: 88, def: 38, mat: 25, mdf: 30, agi: 82, luk: 45, hiringCost: 117600, weeklyCost: 23520, spritename: "Actor1", spriteindex: 1, role: "ranged" },
        { name: "Airborne Commander", formation: "Circle", name_it: "Comandante Aviotrasportato", hp: 195, mp: 105, atk: 78, def: 62, mat: 62, mdf: 68, agi: 72, luk: 48, hiringCost: 162400, weeklyCost: 32480, spritename: "Actor1", spriteindex: 1, role: "support" },
        { name: "Spetsnaz Paratrooper", formation: "Wedge", name_it: "Paracadutista Spetsnaz", hp: 210, mp: 90, atk: 105, def: 68, mat: 38, mdf: 45, agi: 95, luk: 52, hiringCost: 224000, weeklyCost: 44800, spritename: "Actor1", spriteindex: 1, role: "close quarters" }
      ],
      leaders: [
        { name: "General Glagolev", spritename: "Actor1", spriteindex: 0, personality: "Grumpy" },
        { name: "Colonel Margelov", spritename: "Actor2", spriteindex: 1, personality: "Paranoid" },
        { name: "Major Levashov", spritename: "Actor3", spriteindex: 2, personality: "Authoritative" },
        { name: "Captain Denisov", spritename: "Actor1", spriteindex: 3, personality: "Disciplined" },
        { name: "Jump Hero Yegorov", spritename: "Actor2", spriteindex: 4, personality: "Calm" },
        { name: "Airborne Ace Kantaria", spritename: "Actor3", spriteindex: 5, personality: "Cautious" },
        { name: "Commander Belov", spritename: "Actor1", spriteindex: 6, personality: "Melancholic" },
        { name: "Marshal Shaposhnikov", spritename: "Actor2", spriteindex: 7, personality: "Cynical" },
        { name: "Hero Krylov", spritename: "Actor3", spriteindex: 0, personality: "Impulsive" },
        { name: "Elite Trooper Nesterov", spritename: "Actor1", spriteindex: 1, personality: "Adventurous" }
      ]
    },
    {
      id: 40,
      name: "Artillery Division",
      name_it: "Divisione Artiglieria",
      description: "Heavy artillery and rocket forces, the 'God of War' that rains destruction upon the enemy.",
      description_it: "Artiglieria pesante e forze missilistiche, il 'Dio della Guerra' che fa piovere distruzione sul nemico.",
      parentFaction: 35,
      troops: [
        { name: "Artillery Gunner", formation: "Line", name_it: "Artigliere", hp: 110, mp: 60, atk: 48, def: 45, mat: 32, mdf: 38, agi: 28, luk: 25, hiringCost: 28000, weeklyCost: 5600, spritename: "Actor1", spriteindex: 1, role: "ranged" },
        { name: "Howitzer Crew", formation: "Double", name_it: "Equipaggio Obice", hp: 135, mp: 75, atk: 65, def: 55, mat: 42, mdf: 48, agi: 32, luk: 28, hiringCost: 50400, weeklyCost: 10080, spritename: "Actor1", spriteindex: 1, role: "ranged" },
        { name: "Katyusha Operator", formation: "Column", name_it: "Operatore Katyusha", hp: 145, mp: 85, atk: 78, def: 48, mat: 55, mdf: 52, agi: 35, luk: 32, hiringCost: 75600, weeklyCost: 15120, spritename: "Actor1", spriteindex: 1, role: "ranged" },
        { name: "Artillery Spotter", formation: "Circle", name_it: "Osservatore Artiglieria", hp: 125, mp: 95, atk: 42, def: 38, mat: 62, mdf: 68, agi: 48, luk: 40, hiringCost: 84000, weeklyCost: 16800, spritename: "Actor1", spriteindex: 1, role: "support" },
        { name: "Heavy Artillery Commander", formation: "Box", name_it: "Comandante Artiglieria Pesante", hp: 165, mp: 110, atk: 72, def: 62, mat: 75, mdf: 82, agi: 38, luk: 38, hiringCost: 123200, weeklyCost: 24640, spritename: "Actor1", spriteindex: 1, role: "support" },
        { name: "Rocket Artillery Master", formation: "Crescent", name_it: "Maestro Artiglieria Razzi", hp: 180, mp: 125, atk: 95, def: 58, mat: 92, mdf: 88, agi: 42, luk: 42, hiringCost: 184800, weeklyCost: 36960, spritename: "Actor1", spriteindex: 1, role: "ranged" }
      ],
      leaders: [
        { name: "Artillery Marshal Voronov", spritename: "Actor1", spriteindex: 0, personality: "Grumpy" },
        { name: "General Kazakov", spritename: "Actor2", spriteindex: 1, personality: "Artistic" },
        { name: "Colonel Nedelin", spritename: "Actor3", spriteindex: 2, personality: "Melancholic" },
        { name: "Major Kurchevsky", spritename: "Actor1", spriteindex: 3, personality: "Melancholic" },
        { name: "Rocket Hero Tukhachevsky", spritename: "Actor2", spriteindex: 4, personality: "Nervous" },
        { name: "Katyusha Ace Kostikov", spritename: "Actor3", spriteindex: 5, personality: "Sanguine" },
        { name: "Commander Yakovlev", spritename: "Actor1", spriteindex: 6, personality: "Impulsive" },
        { name: "Marshal Kulik", spritename: "Actor2", spriteindex: 7, personality: "Nervous" },
        { name: "General Petrov", spritename: "Actor3", spriteindex: 0, personality: "Hedonistic" },
        { name: "Hero Grabin", spritename: "Actor1", spriteindex: 1, personality: "Impulsive" }
      ]
    },
    {
      id: 41,
      name: "Ottoman Empire",
      name_it: "Impero Ottomano",
      description: "The Great Empire that never fell. A vast, multi-ethnic powerhouse ruling from Istanbul, blending centuries-old traditions with modern military and covert technology. It is led by the Sultan-Caliph.",
      description_it: "Il Grande Impero che non è mai caduto. Una vasta potenza multietnica che governa da Istanbul, fondendo tradizioni secolari con tecnologia militare e segreta moderna. È guidato dal Sultano-Califfo.",
      iconIndex: 110,
      troops: [
        { name: "Sipahi Cavalry", formation: "Wedge", name_it: "Cavalleria Sipahi", hp: 130, mp: 60, atk: 45, def: 40, mat: 30, mdf: 35, agi: 50, luk: 25, hiringCost: 18900, weeklyCost: 3780, spritename: "Actor1", spriteindex: 1, role: "close quarters" },
        { name: "Janissary Trooper", formation: "Phalanx", name_it: "Giannizzero", hp: 155, mp: 80, atk: 58, def: 55, mat: 35, mdf: 40, agi: 38, luk: 30, hiringCost: 32200, weeklyCost: 6440, spritename: "Actor1", spriteindex: 1, role: "close quarters" },
        { name: "Imperial Engineer", formation: "Box", name_it: "Ingegnere Imperiale", hp: 120, mp: 110, atk: 40, def: 45, mat: 60, mdf: 65, agi: 35, luk: 35, hiringCost: 45500, weeklyCost: 9100, spritename: "Actor1", spriteindex: 1, role: "support" },
        { name: "Modern Janissary", formation: "Double", name_it: "Giannizzero Moderno", hp: 185, mp: 100, atk: 70, def: 65, mat: 45, mdf: 50, agi: 45, luk: 40, hiringCost: 67200, weeklyCost: 13440, spritename: "Actor1", spriteindex: 1, role: "close quarters" },
        { name: "Bashi-Bazouk Mercenary", formation: "Scattered", name_it: "Mercenario Bashi-Bazouk", hp: 170, mp: 90, atk: 78, def: 50, mat: 40, mdf: 45, agi: 60, luk: 28, hiringCost: 88200, weeklyCost: 17640, spritename: "Actor1", spriteindex: 1, role: "ranged" },
        { name: "Pasha's Advisor", formation: "Circle", name_it: "Consigliere del Pascià", hp: 160, mp: 140, atk: 50, def: 58, mat: 80, mdf: 85, agi: 40, luk: 50, hiringCost: 115500, weeklyCost: 23100, spritename: "Actor1", spriteindex: 1, role: "support" },
        { name: "Ottoman Guard", formation: "Phalanx", name_it: "Guardia Ottomana", hp: 220, mp: 120, atk: 90, def: 85, mat: 55, mdf: 62, agi: 50, luk: 45, hiringCost: 147000, weeklyCost: 29400, spritename: "Actor1", spriteindex: 1, role: "close quarters" },
        { name: "Grand Vizier's Elite", formation: "Wedge", name_it: "Élite del Gran Visir", hp: 250, mp: 150, atk: 105, def: 95, mat: 70, mdf: 78, agi: 55, luk: 55, hiringCost: 210000, weeklyCost: 42000, spritename: "Actor1", spriteindex: 1, role: "close quarters" }
      ],
      leaders: [
        { name: "Sultan Osman VI", spritename: "Actor1", spriteindex: 0, personality: "Authoritative" },
        { name: "Grand Vizier Ahmet", spritename: "Actor2", spriteindex: 1, personality: "Disciplined" },
        { name: "Marshal Fevzi Pasha", spritename: "Actor3", spriteindex: 2, personality: "Brave" },
        { name: "Admiral Barbaros III", spritename: "Actor1", spriteindex: 3, personality: "Adventurous" }
      ]
    },
    {
      id: 42,
      name: "Tanzimat Bureaucracy",
      name_it: "Burocrazia Tanzimat",
      description: "The sprawling, highly structured, and often corrupt administrative core of the Empire, modernizing with ruthless efficiency.",
      description_it: "Il vasto, strutturato e spesso corrotto nucleo amministrativo dell'Impero, che si modernizza con spietata efficienza.",
      parentFaction: 41,
      troops: [
        { name: "Registry Clerk", formation: "Box", name_it: "Impiegato del Registro", hp: 90, mp: 120, atk: 20, def: 28, mat: 45, mdf: 55, agi: 30, luk: 40, hiringCost: 14700, weeklyCost: 2940 },
        { name: "Müfettiş (Inspector)", formation: "Double", name_it: "Müfettiş (Ispettore)", hp: 110, mp: 150, atk: 30, def: 35, mat: 65, mdf: 75, agi: 35, luk: 55, hiringCost: 36400, weeklyCost: 7280 },
        { name: "Vizier's Diplomat", formation: "Circle", name_it: "Diplomatico del Visir", hp: 140, mp: 190, atk: 45, def: 48, mat: 90, mdf: 105, agi: 40, luk: 70, hiringCost: 70000, weeklyCost: 14000 },
        { name: "Emin Effendi (High Official)", formation: "Column", name_it: "Emin Effendi (Alto Funzionario)", hp: 180, mp: 240, atk: 60, def: 62, mat: 120, mdf: 135, agi: 45, luk: 85, hiringCost: 133000, weeklyCost: 26600 }
      ],
      leaders: [
        { name: "Grand Bureaucrat Midhat Pasha", spritename: "Actor1", spriteindex: 0, personality: "Scholarly" },
        { name: "Reform Minister Ali Pasha", spritename: "Actor2", spriteindex: 1, personality: "Cautious" },
        { name: "Chief Administrator Fuad Effendi", spritename: "Actor3", spriteindex: 2, personality: "Disciplined" },
        { name: "Inspector General Reshid Bey", spritename: "Actor1", spriteindex: 3, personality: "Cynical" }
      ]
    },
    {
      id: 43,
      name: "Imperial Submarine Fleet",
      name_it: "Flotta Sottomarina Imperiale",
      description: "The silent service of the Ottoman Navy. Utilizing high-tech stealth and torpedo systems to maintain control of the Mediterranean and Black Seas.",
      description_it: "Il servizio silenzioso della Marina Ottomana. Utilizza sistemi stealth e siluri ad alta tecnologia per mantenere il controllo del Mediterraneo e del Mar Nero.",
      parentFaction: 41,
      troops: [
        { name: "Submarine Cadet", formation: "Column", name_it: "Cadetto Sottomarino", hp: 125, mp: 80, atk: 42, def: 48, mat: 35, mdf: 40, agi: 35, luk: 38, hiringCost: 28000, weeklyCost: 5600, spritename: "Actor1", spriteindex: 1, role: "ranged" },
        { name: "Sonar Technician", formation: "Circle", name_it: "Tecnico Sonar", hp: 140, mp: 110, atk: 50, def: 55, mat: 58, mdf: 65, agi: 40, luk: 50, hiringCost: 50400, weeklyCost: 10080, spritename: "Actor1", spriteindex: 1, role: "support" },
        { name: "Torpedo Operator", formation: "Line", name_it: "Operatore Siluri", hp: 165, mp: 95, atk: 75, def: 62, mat: 45, mdf: 52, agi: 55, luk: 45, hiringCost: 81200, weeklyCost: 16240, spritename: "Actor1", spriteindex: 1, role: "ranged" },
        { name: "Submarine Commander", formation: "Double", name_it: "Comandante Sottomarino", hp: 190, mp: 130, atk: 88, def: 75, mat: 70, mdf: 80, agi: 60, luk: 60, hiringCost: 134400, weeklyCost: 26880, spritename: "Actor1", spriteindex: 1, role: "ranged" }
      ],
      leaders: [
        { name: "Captain Reis Murat", spritename: "Actor1", spriteindex: 4, personality: "Cautious" },
        { name: "Admiral Salih", spritename: "Actor2", spriteindex: 5, personality: "Calm" }
      ]
    },
    {
      id: 44,
      name: "Talon of the Caliph",
      name_it: "Artiglio del Califfo",
      description: "The Sultan-Caliph's secret police and intelligence agency, focusing on both domestic dissent and foreign espionage. They are the true 'eyes and ears' of the Empire.",
      description_it: "La polizia segreta e l'agenzia di intelligence del Sultano-Califfo, focalizzata sia sul dissenso interno che sullo spionaggio estero. Sono i veri 'occhi e orecchie' dell'Impero.",
      parentFaction: 41,
      troops: [
        { name: "Informant", formation: "Scattered", name_it: "Informatore", hp: 100, mp: 100, atk: 25, def: 30, mat: 40, mdf: 45, agi: 50, luk: 60, hiringCost: 16800, weeklyCost: 3360, spritename: "Actor1", spriteindex: 1, role: "support" },
        { name: "Shadow Operative", formation: "Column", name_it: "Agente Ombra", hp: 135, mp: 140, atk: 55, def: 48, mat: 68, mdf: 75, agi: 65, luk: 75, hiringCost: 53200, weeklyCost: 10640, spritename: "Actor1", spriteindex: 1, role: "close quarters" },
        { name: "Assassination Specialist", formation: "Crescent", name_it: "Specialista in Assassinio", hp: 170, mp: 160, atk: 85, def: 60, mat: 75, mdf: 82, agi: 80, luk: 90, hiringCost: 100800, weeklyCost: 20160, spritename: "Actor1", spriteindex: 1, role: "ranged" },
        { name: "Grand Intelligencer", formation: "Box", name_it: "Grande Intelligence", hp: 200, mp: 200, atk: 95, def: 70, mat: 100, mdf: 110, agi: 90, luk: 105, hiringCost: 175000, weeklyCost: 35000, spritename: "Actor1", spriteindex: 1, role: "support" }
      ],
      leaders: [
        { name: "Spymaster Hakan the Silent", spritename: "Actor1", spriteindex: 0, personality: "Paranoid" },
        { name: "Intelligence Chief Mehmed Bey", spritename: "Actor2", spriteindex: 1, personality: "Cautious" },
        { name: "Assassin Master Selim the Shadow", spritename: "Actor3", spriteindex: 2, personality: "Mischievous" },
        { name: "Director of Secrets Kemal Pasha", spritename: "Actor1", spriteindex: 3, personality: "Cynical" }
      ]
    },
    {
      id: 45,
      name: "Janissary Guard",
      name_it: "Giannizzeri",
      description: "A small, highly-trained detachment of modern Janissaries serving as the Sultan-Caliph's personal guard and elite shock troops.",
      description_it: "Un piccolo distaccamento altamente addestrato di Giannizzeri moderni che fungono da guardia personale del Sultano-Califfo e da truppe d'assalto d'élite.",
      parentFaction: 41,
      troops: [
        { name: "Janissary Novice", formation: "Line", name_it: "Novizio Giannizzero", hp: 170, mp: 85, atk: 65, def: 60, mat: 40, mdf: 45, agi: 45, luk: 35, hiringCost: 44800, weeklyCost: 8960, spritename: "Actor1", spriteindex: 1, role: "close quarters" },
        { name: "Koruma Trooper", formation: "Phalanx", name_it: "Fante Koruma", hp: 210, mp: 105, atk: 85, def: 80, mat: 50, mdf: 55, agi: 55, luk: 40, hiringCost: 89600, weeklyCost: 17920, spritename: "Actor1", spriteindex: 1, role: "close quarters" },
        { name: "Janissary Captain", formation: "Wedge", name_it: "Capitano Giannizzero", hp: 260, mp: 130, atk: 105, def: 100, mat: 65, mdf: 72, agi: 65, luk: 48, hiringCost: 168000, weeklyCost: 33600, spritename: "Actor1", spriteindex: 1, role: "close quarters" },
        { name: "Ağa of the Koruma", formation: "Phalanx", name_it: "Ağa del Koruma", hp: 320, mp: 160, atk: 125, def: 120, mat: 80, mdf: 90, agi: 75, luk: 55, hiringCost: 280000, weeklyCost: 56000, spritename: "Actor1", spriteindex: 1, role: "close quarters" }
      ],
      leaders: [
        { name: "Grand Ağa Suleiman", spritename: "Actor1", spriteindex: 0, personality: "Brave" },
        { name: "Koruma Commander Mustafa", spritename: "Actor2", spriteindex: 1, personality: "Disciplined" },
        { name: "Elite Captain Ibrahim", spritename: "Actor3", spriteindex: 2, personality: "Loyal" },
        { name: "First Guard Osman", spritename: "Actor1", spriteindex: 3, personality: "Aggressive" }
      ]
    },
    {
      id: 46,
      name: "Britannia",
      name_it: "Britannia",
      description: "The successor to the British Empire, a global power defined by its technological superiority, vast Commonwealth resources, and disciplined military. Ruled by a modern Constitutional Monarchy.",
      description_it: "Il successore dell'Impero Britannico, una potenza globale definita dalla sua superiorità tecnologica, dalle vaste risorse del Commonwealth e da un esercito disciplinato. Governato da una moderna Monarchia Costituzionale.",
      iconIndex: 121,
      troops: [
        { name: "Commonwealth Trooper", formation: "Line", name_it: "Fante del Commonwealth", hp: 110, mp: 60, atk: 40, def: 35, mat: 20, mdf: 25, agi: 35, luk: 22, hiringCost: 11200, weeklyCost: 2240, spritename: "Actor1", spriteindex: 1, role: "close quarters" },
        { name: "Royal Marine Rifleman", formation: "Double", name_it: "Fuciliere dei Royal Marine", hp: 140, mp: 70, atk: 55, def: 48, mat: 25, mdf: 32, agi: 40, luk: 28, hiringCost: 28000, weeklyCost: 5600, spritename: "Actor1", spriteindex: 1, role: "ranged" },
        { name: "Field Medic", formation: "Circle", name_it: "Medico da Campo", hp: 130, mp: 100, atk: 35, def: 40, mat: 50, mdf: 60, agi: 38, luk: 35, hiringCost: 39200, weeklyCost: 7840, spritename: "Actor1", spriteindex: 1, role: "support" },
        { name: "Imperial Grenadier", formation: "Wedge", name_it: "Granatiere Imperiale", hp: 170, mp: 90, atk: 70, def: 65, mat: 35, mdf: 40, agi: 45, luk: 30, hiringCost: 56000, weeklyCost: 11200, spritename: "Actor1", spriteindex: 1, role: "close quarters" },
        { name: "Highlander Marksman", formation: "Column", name_it: "Tiratore degli Highlander", hp: 155, mp: 75, atk: 82, def: 45, mat: 30, mdf: 38, agi: 68, luk: 38, hiringCost: 72800, weeklyCost: 14560, spritename: "Actor1", spriteindex: 1, role: "ranged" },
        { name: "Staff Officer", formation: "Box", name_it: "Ufficiale di Stato Maggiore", hp: 175, mp: 120, atk: 50, def: 55, mat: 70, mdf: 78, agi: 42, luk: 45, hiringCost: 98000, weeklyCost: 19600, spritename: "Actor1", spriteindex: 1, role: "support" },
        { name: "Veteran Fusilier", formation: "Phalanx", name_it: "Fuciliere Veterano", hp: 200, mp: 105, atk: 95, def: 80, mat: 40, mdf: 50, agi: 50, luk: 40, hiringCost: 134400, weeklyCost: 26880, spritename: "Actor1", spriteindex: 1, role: "close quarters" },
        { name: "Guard Commander", formation: "Double", name_it: "Comandante della Guardia", hp: 230, mp: 140, atk: 85, def: 75, mat: 90, mdf: 100, agi: 48, luk: 52, hiringCost: 182000, weeklyCost: 36400, spritename: "Actor1", spriteindex: 1, role: "support" }
      ],
      leaders: [
        { name: "King George IX", spritename: "Actor1", spriteindex: 0, personality: "Disciplined" },
        { name: "Field Marshal Montgomery II", spritename: "Actor2", spriteindex: 1, personality: "Brave" },
        { name: "Admiral Nelson IV", spritename: "Actor3", spriteindex: 2, personality: "Adventurous" },
        { name: "Commander Victoria", spritename: "Actor1", spriteindex: 3, personality: "Authoritative" }
      ]
    },
    {
      id: 47,
      name: "Royal Navy Task Force",
      name_it: "Task Force della Royal Navy",
      description: "The core strength of Britannia, deploying advanced frigates, aircraft carriers, and hydrofoil transports to maintain global sea lanes.",
      description_it: "La forza principale di Britannia, che schiera fregate avanzate, portaerei e trasporti a idroplano per mantenere aperte le rotte marittime globali.",
      parentFaction: 46,
      troops: [
        { name: "Seaman Recruit", formation: "Line", name_it: "Recluta Marinaio", hp: 120, mp: 70, atk: 45, def: 55, mat: 28, mdf: 40, agi: 30, luk: 25, hiringCost: 25200, weeklyCost: 5040, spritename: "Actor1", spriteindex: 1, role: "close quarters" },
        { name: "Frigate Crewman", formation: "Column", name_it: "Membro Equipaggio Fregata", hp: 150, mp: 85, atk: 60, def: 70, mat: 35, mdf: 50, agi: 35, luk: 30, hiringCost: 47600, weeklyCost: 9520, spritename: "Actor1", spriteindex: 1, role: "close quarters" },
        { name: "Radar Technician", formation: "Circle", name_it: "Tecnico Radar", hp: 135, mp: 110, atk: 40, def: 50, mat: 65, mdf: 75, agi: 45, luk: 40, hiringCost: 67200, weeklyCost: 13440, spritename: "Actor1", spriteindex: 1, role: "support" },
        { name: "Hydrofoil Officer", formation: "Crescent", name_it: "Ufficiale Idroplano", hp: 180, mp: 100, atk: 75, def: 85, mat: 45, mdf: 60, agi: 50, luk: 35, hiringCost: 100800, weeklyCost: 20160, spritename: "Actor1", spriteindex: 1, role: "close quarters" },
        { name: "Fleet Commander", formation: "Box", name_it: "Comandante di Flotta", hp: 210, mp: 130, atk: 85, def: 95, mat: 75, mdf: 88, agi: 55, luk: 50, hiringCost: 154000, weeklyCost: 30800, spritename: "Actor1", spriteindex: 1, role: "support" }
      ],
      leaders: [
        { name: "Admiral Drake IV", spritename: "Actor1", spriteindex: 0, personality: "Adventurous" },
        { name: "Commodore Hawkins", spritename: "Actor2", spriteindex: 1, personality: "Brave" },
        { name: "Captain Beatty", spritename: "Actor3", spriteindex: 2, personality: "Disciplined" },
        { name: "Fleet Admiral Hood", spritename: "Actor1", spriteindex: 3, personality: "Authoritative" }
      ]
    },
    {
      id: 48,
      name: "SAS/SBS Commandos",
      name_it: "Commando SAS/SBS",
      description: "The legendary Special Air Service and Special Boat Service. Highly trained, stealthy, and equipped with advanced personal cloaking and data systems.",
      description_it: "Il leggendario Special Air Service e Special Boat Service. Altamente addestrati, furtivi e dotati di sistemi di occultamento personale e dati avanzati.",
      parentFaction: 46,
      troops: [
        { name: "Recon Specialist", formation: "Scattered", name_it: "Specialista Ricognizione", hp: 130, mp: 80, atk: 58, def: 45, mat: 40, mdf: 48, agi: 70, luk: 65, hiringCost: 42000, weeklyCost: 8400, spritename: "Actor1", spriteindex: 1, role: "ranged" },
        { name: "Demolitions Expert", formation: "Wedge", name_it: "Esperto Demolizioni", hp: 160, mp: 100, atk: 78, def: 55, mat: 55, mdf: 62, agi: 75, luk: 70, hiringCost: 77000, weeklyCost: 15400, spritename: "Actor1", spriteindex: 1, role: "close quarters" },
        { name: "SBS Frogman", formation: "Column", name_it: "Sommozzatore SBS", hp: 175, mp: 110, atk: 85, def: 60, mat: 60, mdf: 70, agi: 80, luk: 75, hiringCost: 119000, weeklyCost: 23800, spritename: "Actor1", spriteindex: 1, role: "close quarters" },
        { name: "SAS Counter-Terrorist", formation: "Scattered", name_it: "Anti-Terrorismo SAS", hp: 200, mp: 130, atk: 100, def: 70, mat: 75, mdf: 85, agi: 90, luk: 85, hiringCost: 182000, weeklyCost: 36400, spritename: "Actor1", spriteindex: 1, role: "ranged" }
      ],
      leaders: [
        { name: "Regiment Commander Stirling", spritename: "Actor1", spriteindex: 0, personality: "Brave" },
        { name: "SBS Director Laycock", spritename: "Actor2", spriteindex: 1, personality: "Cautious" },
        { name: "SAS Captain Price", spritename: "Actor3", spriteindex: 2, personality: "Disciplined" },
        { name: "Squadron Leader MacLeod", spritename: "Actor1", spriteindex: 3, personality: "Adventurous" }
      ]
    },
    {
      id: 49,
      name: "MI6 Black Archive",
      name_it: "Archivio Nero MI6",
      noStartingTroops: true,
      description: "Britannia's most clandestine intelligence division, dealing in high-level technological espionage, psychological warfare, and global political manipulation.",
      description_it: "La divisione di intelligence più clandestina di Britannia, che si occupa di spionaggio tecnologico di alto livello, guerra psicologica e manipolazione politica globale.",
      parentFaction: 46,
      troops: [
        { name: "Analyst Handler", formation: "Circle", name_it: "Analista/Gestore", hp: 110, mp: 130, atk: 30, def: 35, mat: 60, mdf: 70, agi: 45, luk: 60, hiringCost: 28000, weeklyCost: 5600, spritename: "Actor1", spriteindex: 1, role: "support" },
        { name: "Covert Agent", formation: "Scattered", name_it: "Agente Segreto", hp: 140, mp: 160, atk: 50, def: 48, mat: 80, mdf: 90, agi: 55, luk: 75, hiringCost: 63000, weeklyCost: 12600, spritename: "Actor1", spriteindex: 1, role: "support" },
        { name: "Psychological Warfare Expert", formation: "Crescent", name_it: "Esperto Guerra Psicologica", hp: 165, mp: 190, atk: 65, def: 55, mat: 105, mdf: 120, agi: 60, luk: 90, hiringCost: 112000, weeklyCost: 22400, spritename: "Actor1", spriteindex: 1, role: "support" },
        { name: "Section Chief (The Controller)", formation: "Box", name_it: "Capo Sezione (Il Controllore)", hp: 190, mp: 230, atk: 75, def: 65, mat: 130, mdf: 150, agi: 70, luk: 100, hiringCost: 175000, weeklyCost: 35000, spritename: "Actor1", spriteindex: 1, role: "support" }
      ],
      leaders: [
        { name: "M (Director General)", spritename: "Actor1", spriteindex: 0, personality: "Paranoid" },
        { name: "Q (Technical Director)", spritename: "Actor2", spriteindex: 1, personality: "Scholarly" },
        { name: "C (Chief of Station)", spritename: "Actor3", spriteindex: 2, personality: "Cautious" },
        { name: "Agent 007 (Field Director)", spritename: "Actor1", spriteindex: 3, personality: "Brave" }
      ]
    },
    {
      id: 50,
      name: "Science Command",
      name_it: "Comando Scientifico",
      description: "A joint military-scientific division responsible for developing and deploying cutting-edge plasma weaponry, kinetic defense systems, and power armour.",
      description_it: "Una divisione congiunta militare-scientifica responsabile dello sviluppo e dell'implementazione di armi al plasma all'avanguardia, sistemi di difesa cinetica e armature potenziate.",
      parentFaction: 46,
      troops: [
        { name: "Lab Technician", formation: "Circle", name_it: "Tecnico di Laboratorio", hp: 100, mp: 150, atk: 25, def: 30, mat: 55, mdf: 65, agi: 40, luk: 45, hiringCost: 22400, weeklyCost: 4480, spritename: "Actor1", spriteindex: 1, role: "support" },
        { name: "Plasma Engineer", formation: "Double", name_it: "Ingegnere Plasma", hp: 140, mp: 180, atk: 45, def: 45, mat: 80, mdf: 90, agi: 50, luk: 55, hiringCost: 61600, weeklyCost: 12320, spritename: "Actor1", spriteindex: 1, role: "ranged" },
        { name: "Power Armor Trooper", formation: "Phalanx", name_it: "Fante in Armatura Potenziata", hp: 240, mp: 120, atk: 85, def: 110, mat: 50, mdf: 70, agi: 30, luk: 40, hiringCost: 119000, weeklyCost: 23800, spritename: "Actor1", spriteindex: 1, role: "close quarters" },
        { name: "Chief Scientist (Kineticist)", formation: "Column", name_it: "Capo Scienziato (Cinetista)", hp: 180, mp: 220, atk: 60, def: 65, mat: 120, mdf: 135, agi: 60, luk: 65, hiringCost: 189000, weeklyCost: 37800, spritename: "Actor1", spriteindex: 1, role: "ranged" }
      ],
      leaders: [
        { name: "Director Hawking III", spritename: "Actor1", spriteindex: 0, personality: "Scholarly" },
        { name: "Chief Engineer Tesla IV", spritename: "Actor2", spriteindex: 1, personality: "Artistic" },
        { name: "General Turing", spritename: "Actor3", spriteindex: 2, personality: "Disciplined" },
        { name: "Professor Faraday V", spritename: "Actor1", spriteindex: 3, personality: "Nervous" }
      ]
    }
  ];
  this._factions = FACTIONS;
};

FactionDataManager.instance = new FactionDataManager();

//=============================================================================
// Register Plugin Commands
//=============================================================================

PluginManager.registerCommand("FactionDataManager", "open", (args) => {
  SceneManager.push(Scene_FactionStatus);
});

PluginManager.registerCommand("FactionDataManager", "setReputation", (args) => {
  const factionId = Number(args.factionId || 0);
  const value = Number(args.value || 0);
  $gameFactions.setReputation(factionId, value);
});

PluginManager.registerCommand(
  "FactionDataManager",
  "changeReputation",
  (args) => {
    const factionId = Number(args.factionId || 0);
    const change = Number(args.change || 0);
    $gameFactions.changeReputation(factionId, change);
  }
);

PluginManager.registerCommand(
  "FactionDataManager",
  "getFactionsByType",
  (args) => {
    const typeName = String(args.typeName || "");
    const variableId = Number(args.variableId || 0);
    $gameFactions.getFactionsByType(typeName, variableId);
  }
);

PluginManager.registerCommand(
  "FactionDataManager",
  "getHighestReputationFaction",
  (args) => {
    const variableId = Number(args.variableId || 0);
    $gameFactions.getHighestReputationFaction(variableId);
  }
);

PluginManager.registerCommand(
  "FactionDataManager",
  "getLowestReputationFaction",
  (args) => {
    const variableId = Number(args.variableId || 0);
    $gameFactions.getLowestReputationFaction(variableId);
  }
);

PluginManager.registerCommand(
  "FactionDataManager",
  "checkQuestAvailability",
  (args) => {
    const questId = Number(args.questId || 0);
    const factionId = Number(args.factionId || 0);
    const requiredRep = Number(args.requiredRep || 0);
    const switchId = Number(args.switchId || 0);
    $gameFactions.checkQuestAvailability(
      questId,
      factionId,
      requiredRep,
      switchId
    );
  }
);

PluginManager.registerCommand(
  "FactionDataManager",
  "getAvailableQuestCount",
  (args) => {
    const factionId = Number(args.factionId || 0);
    const variableId = Number(args.variableId || 0);
    $gameFactions.getAvailableQuestCount(factionId, variableId);
  }
);

//=============================================================================
// Menu Integration
//=============================================================================

const _Window_MenuCommand_makeCommandList_FactionDataManager =
  Window_MenuCommand.prototype.makeCommandList;
Window_MenuCommand.prototype.makeCommandList = function () {
  _Window_MenuCommand_makeCommandList_FactionDataManager.call(this);
  if (FRS.Params.showInMenu) {
    this.addCommand(FRS.Params.menuText, "factions", true);
    // Set icon for the newly added command
    this._list[this._list.length - 1].icon = 247;
  }
};

const _Scene_Menu_createCommandWindow_FactionDataManager =
  Scene_Menu.prototype.createCommandWindow;
Scene_Menu.prototype.createCommandWindow = function () {
  _Scene_Menu_createCommandWindow_FactionDataManager.call(this);
  this._commandWindow.setHandler(
    "factions",
    this.commandFactionStatus.bind(this)
  );
};

Scene_Menu.prototype.commandFactionStatus = function () {
  SceneManager.push(Scene_FactionStatus);
};

//=============================================================================
// Game_Factions - Handles faction data and operations
//=============================================================================

function Game_Factions() {
  this.initialize(...arguments);
}

Game_Factions.prototype.initialize = function () {
  this._reputations = [];
  this.initializeReputations();
};

Game_Factions.prototype.initializeReputations = function () {
  // Initialize reputations from plugin parameters
  const numFactions = FactionDataManager.instance._factions.length;
  this._reputations = FRS.Params.startingValues.slice(0, numFactions);

  // Fill with zeros if there are not enough values
  while (this._reputations.length < numFactions) {
    this._reputations.push(0);
  }
};

Game_Factions.prototype.getReputation = function (factionId) {
  if (factionId >= 0 && factionId < this._reputations.length) {
    return this._reputations[factionId];
  }
  return 0;
};

Game_Factions.prototype.setReputation = function (factionId, value) {
  if (factionId >= 0 && factionId < this._reputations.length) {
    this._reputations[factionId] = Math.max(-100, Math.min(100, value));

    // Update relationships with other factions
    this.updateRelatedFactions(factionId, value);
  }
};

Game_Factions.prototype.changeReputation = function (factionId, change) {
  if (factionId >= 0 && factionId < this._reputations.length) {
    const newValue = this.getReputation(factionId) + change;
    this.setReputation(factionId, newValue);
  }
};

Game_Factions.prototype.updateRelatedFactions = function (factionId, newValue) {
    // Skip if relationships aren't initialized
    if (!FactionDataManager.instance || !FactionDataManager.instance._relationships) {
        // Relationships system not set up, skip related faction updates
        return;
    }

  // Check if this is a significant reputation change
  const oldValue = this.getReputation(factionId);
  const change = newValue - oldValue;

  // Only update related factions if change is significant (>= 10 points)
  if (Math.abs(change) >= 10) {
    for (let i = 0; i < FactionDataManager.instance._factions.length; i++) {
      if (i !== factionId) {
        const relationship = FactionDataManager.instance._relationships[factionId][i];

        // Update related faction's reputation based on relationship
        if (relationship !== 0) {
          const relatedChange = Math.floor(change * relationship * 0.2);
          if (relatedChange !== 0) {
            this.changeReputation(i, relatedChange);
          }
        }
      }
    }
  }
};

Game_Factions.prototype.getReputationLevel = function (factionId) {
  const reputation = this.getReputation(factionId);

  if (reputation >= 80) return "Exalted";
  if (reputation >= 60) return "Revered";
  if (reputation >= 40) return "Honored";
  if (reputation >= 20) return "Friendly";
  if (reputation >= -20) return "Neutral";
  if (reputation >= -40) return "Unfriendly";
  if (reputation >= -60) return "Hostile";
  if (reputation >= -80) return "Hated";
  return "Nemesis";
};

Game_Factions.prototype.getReputationColor = function (factionId) {
  const reputation = this.getReputation(factionId);

  if (reputation >= 80) return "#00FF00"; // Bright green
  if (reputation >= 60) return "#32CD32"; // Lime green
  if (reputation >= 40) return "#90EE90"; // Light green
  if (reputation >= 20) return "#98FB98"; // Pale green
  if (reputation >= -20) return "#FFFFFF"; // White
  if (reputation >= -40) return "#FFA07A"; // Light salmon
  if (reputation >= -60) return "#FF6347"; // Tomato
  if (reputation >= -80) return "#FF4500"; // Orange red
  return "#FF0000"; // Red
};

Game_Factions.prototype.getReputationPerks = function (factionId) {
  const reputation = this.getReputation(factionId);
  const perks = [];

  // Generic perks based on reputation level
  if (reputation >= 20) {
    perks.push("Basic services and goods available");
  }
  if (reputation >= 40) {
    perks.push("10% discount on faction goods");
    perks.push("Access to uncommon items");
  }
  if (reputation >= 60) {
    perks.push("25% discount on faction goods");
    perks.push("Access to rare items");
    perks.push("Faction members will assist in battle");
  }
  if (reputation >= 80) {
    perks.push("40% discount on faction goods");
    perks.push("Access to exclusive items");
    perks.push("Faction special quests available");
    perks.push("Faction safe houses accessible");
  }

  // Negative perks
  if (reputation <= -20) {
    perks.push("Most faction services unavailable");
  }
  if (reputation <= -40) {
    perks.push("Faction members may refuse to interact");
    perks.push("Guards will be suspicious of you");
  }
  if (reputation <= -60) {
    perks.push("Faction territory is dangerous to enter");
    perks.push("Faction members may attack on sight");
  }
  if (reputation <= -80) {
    perks.push("Faction sends bounty hunters after you");
    perks.push("Allied factions may become hostile");
  }

  return perks;
};

Game_Factions.prototype.getRelationship = function (factionId1, factionId2) {
  // Return 0 if relationships aren't initialized
  if (!FactionDataManager.instance || !FactionDataManager.instance._relationships) {
    return 0;
  }

  if (
    factionId1 >= 0 &&
    factionId1 < FactionDataManager.instance._factions.length &&
    factionId2 >= 0 &&
    factionId2 < FactionDataManager.instance._factions.length
  ) {
    return FactionDataManager.instance._relationships[factionId1][factionId2];
  }
  return 0;
};

Game_Factions.prototype.getRelationshipName = function (
  factionId1,
  factionId2
) {
  const relationship = this.getRelationship(factionId1, factionId2);

  switch (relationship) {
    case 2:
      return "Allied";
    case 1:
      return "Friendly";
    case 0:
      return "Neutral";
    case -1:
      return "Unfriendly";
    case -2:
      return "Hostile";
    default:
      return "Unknown";
  }
};

Game_Factions.prototype.getAllFactions = function () {
  return FactionDataManager.instance._factions;
};

Game_Factions.prototype.getFaction = function (factionId) {
  if (factionId >= 0 && factionId < FactionDataManager.instance._factions.length) {
    return FactionDataManager.instance._factions[factionId];
  }
  return null;
};

Game_Factions.prototype.getFactionsByType = function (typeName, variableId) {
  let factionIds = [];

  // Map faction types to indices
  const typeIndices = {
    hardcoded: [0, 1, 2],
  };

  // Get faction IDs by type
  if (typeIndices[typeName]) {
    factionIds = typeIndices[typeName];
  }

  // Store count in variableId
  $gameVariables.setValue(variableId, factionIds.length);

  // Store faction IDs in subsequent variables
  for (let i = 0; i < factionIds.length; i++) {
    $gameVariables.setValue(variableId + i + 1, factionIds[i]);
  }
};

Game_Factions.prototype.getHighestReputationFaction = function (variableId) {
  let highestRepFaction = 0;
  let highestRep = -101;

  for (let i = 0; i < this._reputations.length; i++) {
    if (this._reputations[i] > highestRep) {
      highestRep = this._reputations[i];
      highestRepFaction = i;
    }
  }

  $gameVariables.setValue(variableId, highestRepFaction);
};

Game_Factions.prototype.getLowestReputationFaction = function (variableId) {
  let lowestRepFaction = 0;
  let lowestRep = 101;

  for (let i = 0; i < this._reputations.length; i++) {
    if (this._reputations[i] < lowestRep) {
      lowestRep = this._reputations[i];
      lowestRepFaction = i;
    }
  }

  $gameVariables.setValue(variableId, lowestRepFaction);
};

Game_Factions.prototype.checkQuestAvailability = function (
  questId,
  factionId,
  requiredRep,
  switchId
) {
  const reputation = this.getReputation(factionId);
  const isAvailable = reputation >= requiredRep;

  $gameSwitches.setValue(switchId, isAvailable);
};

Game_Factions.prototype.getAvailableQuestCount = function (
  factionId,
  variableId
) {
  // This is a placeholder function that would normally check quest data
  // For now, we'll simulate based on reputation
  const reputation = this.getReputation(factionId);
  let questCount = 0;

  if (reputation >= -20) questCount += 1;
  if (reputation >= 20) questCount += 1;
  if (reputation >= 40) questCount += 1;
  if (reputation >= 60) questCount += 2;
  if (reputation >= 80) questCount += 3;

  $gameVariables.setValue(variableId, questCount);
};

//=============================================================================
// DataManager Integration
//=============================================================================

const _DataManager_createGameObjects = DataManager.createGameObjects;
DataManager.createGameObjects = function() {
  _DataManager_createGameObjects.call(this);
  $gameFactions = new Game_Factions();
};

const _DataManager_makeSaveContents = DataManager.makeSaveContents;
DataManager.makeSaveContents = function() {
  const contents = _DataManager_makeSaveContents.call(this);
  contents.factions = $gameFactions;
  return contents;
};

const _DataManager_extractSaveContents = DataManager.extractSaveContents;
DataManager.extractSaveContents = function(contents) {
  _DataManager_extractSaveContents.call(this, contents);
  $gameFactions = contents.factions;
  if (!$gameFactions) {
      $gameFactions = new Game_Factions();
  }
  // Re-establish the singleton instance on the loaded object if it's lost
  if ($gameFactions && !FactionDataManager.instance) {
      FactionDataManager.instance = new FactionDataManager();
  }
};

//=============================================================================
// Scene_FactionStatus
//=============================================================================

function Scene_FactionStatus() {

  this.initialize(...arguments);

}



Scene_FactionStatus.prototype = Object.create(Scene_MenuBase.prototype);

Scene_FactionStatus.prototype.constructor = Scene_FactionStatus;



Scene_FactionStatus.prototype.initialize = function () {

  Scene_MenuBase.prototype.initialize.call(this);

};



Scene_FactionStatus.prototype.create = function () {

  Scene_MenuBase.prototype.create.call(this);

  this.createFactionStatusWindow();

};



Scene_FactionStatus.prototype.createFactionStatusWindow = function () {

  const rect = this.factionStatusWindowRect();

  this._factionStatusWindow = new Window_FactionStatus(rect);

  this._factionStatusWindow.setHandler("cancel", this.popScene.bind(this));

  this.addWindow(this._factionStatusWindow);

};



Scene_FactionStatus.prototype.factionStatusWindowRect = function () {

  const wx = 0;

  const wy = this.mainAreaTop();

  const ww = Graphics.boxWidth;

  const wh = this.mainAreaHeight();

  return new Rectangle(wx, wy, ww, wh);

};



//=============================================================================

// Window_FactionStatus

//=============================================================================



function Window_FactionStatus() {

  this.initialize(...arguments);

}



Window_FactionStatus.prototype = Object.create(Window_Selectable.prototype);

Window_FactionStatus.prototype.constructor = Window_FactionStatus;



Window_FactionStatus.prototype.initialize = function (rect) {

  Window_Selectable.prototype.initialize.call(this, rect);

  this.makeItemList();

  this.refresh();

  this.activate();

};



Window_FactionStatus.prototype.makeItemList = function () {

  this._data = [];

  const allFactions = $gameFactions.getAllFactions();

  const mainFactions = allFactions.filter((f) => f.parentFaction === undefined);

  const subFactions = allFactions.filter((f) => f.parentFaction !== undefined);



  mainFactions.sort((a, b) => a.id - b.id);



  mainFactions.forEach((mainFaction) => {

    this._data.push({ faction: mainFaction, isSub: false });

    const children = subFactions.filter(

      (sub) => sub.parentFaction === mainFaction.id

    );

    children.sort((a, b) => a.id - b.id);

    children.forEach((child) => {

      this._data.push({ faction: child, isSub: true });

    });

  });

};



Window_FactionStatus.prototype.maxItems = function () {

  return this._data ? this._data.length : 0;

};



Window_FactionStatus.prototype.itemHeight = function () {



  return this.lineHeight(); // Each item takes one line



};



Window_FactionStatus.prototype.drawItem = function (index) {



  const item = this._data[index];



  const faction = item.faction;



  if (faction) {



    const rect = this.itemLineRect(index);



    



    // Determine which language to use for name and description



    const useItalian = ConfigManager.language === 'it';



    const factionName = useItalian && faction.name_it ? faction.name_it : faction.name;







    const reputation = $gameFactions.getReputation(faction.id);



    const reputationLevel = $gameFactions.getReputationLevel(faction.id);



    const reputationColor = $gameFactions.getReputationColor(faction.id);







    const iconWidth = ImageManager.iconWidth;



    const baseTextIndent = iconWidth + 4; // Space for icon + padding



    const subFactionIndent = 32; // Additional indent for subfactions







    let currentTextX = rect.x;







    // Draw icon for main factions



    if (!item.isSub && faction.iconIndex) {



        this.drawIcon(faction.iconIndex, currentTextX, rect.y);



    }







    // Adjust textX based on whether it's a subfaction or main faction



    if (item.isSub) {



        currentTextX += baseTextIndent + subFactionIndent; // Subfactions get icon space + additional indent



    } else {



        currentTextX += baseTextIndent; // Main factions just get icon space



    }







    const availableWidth = rect.width - (currentTextX - rect.x);



    const textY = rect.y;







    // Draw faction name (left-aligned)



    this.changeTextColor(ColorManager.normalColor());



    this.drawText(factionName, currentTextX, textY, availableWidth / 2, "left");







    // Draw reputation (right-aligned)



    this.changeTextColor(reputationColor);



    const repText = reputationLevel + ` (${reputation})`;



    this.drawText(repText, currentTextX + availableWidth / 2, textY, availableWidth / 2, "right");



  }



};



Window_FactionStatus.prototype.update = function () {

  Window_Selectable.prototype.update.call(this);

  if (this.isOpenAndActive()) {

    if (Input.isTriggered("ok") || Input.isTriggered("cancel")) {

      SoundManager.playCancel();

      this.callHandler("cancel");

    }

  }

};


/*:
 * @target MZ
 * @plugindesc Generates random book titles and statue descriptions (seeded by location). Supports English and Italian.
 * @author Omni-Lex & OmniLex
 * @help This plugin creates message boxes displaying random book titles or statue descriptions
 * whenever called. The selection is deterministic based on mapID, event position,
 * and the first letter of the player name.
 *
 * === LINKING SYSTEM ===
 * Multiple events can share the same description by naming them with a link prefix:
 * - Event names: "link-1", "link-test", "link-3", etc.
 * - All events with the same link identifier (e.g., "link-1") will show identical descriptions
 * - The first event with that link name determines the seed for all linked events
 * - Example: Three events named "link-paint1" will all show the same painting description
 *
 * === LANGUAGE SUPPORT ===
 * To set the language to Italian, use the 'Script' event command and enter:
 * ConfigManager.language = "it";
 *
 * Make sure to do this before calling the plugin commands.
 *
 * Plugin Commands:
 * ShowRandomBook - Shows a message box with random book information
 * ShowStatueDescription - Shows a message box with random statue description
 * ShowPaintingDescription - Shows a message box with random painting description
 *
 * @command ShowRandomBook
 * @desc Display a random book in a message box
 *
 * @command ShowStatueDescription
 * @desc Display a random statue description in a message box
 * @arg subject
 * @text Statue Subject
 * @desc The subject/theme of the statue (optional - will be random if empty)
 * @type string
 * @default
 * @arg subjectIt
 * @text Statue Subject IT
 * @desc The it subject/theme of the statue (optional - will be random if empty)
 * @type string
 * @default
 *
 * @command ShowPaintingDescription
 * @desc Display a random painting in a message box
 * @arg subject
 * @text Painting Subject
 * @desc The subject/theme of the painting (optional - will be random if empty)
 * @type string
 * @default
* @arg subjectIt
 * @text Painting Subject IT
 * @desc The it subject/theme of the painting (optional - will be random if empty)
 * @type string
 * @default
 *
 * @command ShowFossilDescription
 * @desc Display a random fossil specimen description in a message box
 * @arg type
 * @text Fossil Type
 * @desc amber, dinosaur, weird — leave empty for random
 * @type string
 * @default
 */

(() => {
    const pluginName = "RandomBookGenerator";

    // === Seeded RNG util (mulberry32) ===
    function createSeededRNG() {
        const mapId    = $gameMap.mapId();
        const x        = $gamePlayer.x;
        const y        = $gamePlayer.y;
        const name     = $gameParty.leader().name || "";
        const initial  = name.length ? (name.charCodeAt(0) - 64) : 0;
        // combine into a 32-bit seed
        let seed = (mapId * 73856093) ^ (x * 19349663) ^ (y * 83492791) ^ initial;
        seed = seed >>> 0;
        // mulberry32 PRNG
        return (function(a) {
            return function() {
                var t = a += 0x6D2B79F5;
                t = Math.imul(t ^ (t >>> 15), t | 1);
                t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
                return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
            };
        })(seed);
    }

    // === Text wrapping util ===
    function wrapText(text, maxChars) {
        const words = text.split(' ');
        let line = '';
        let result = '';
        for (const word of words) {
            if ((line + word).length > maxChars) {
                result += line.trim() + '\n';
                line = '';
            }
            line += word + ' ';
        }
        result += line.trim();
        return result;
    }

    // ==================================
    // === ENGLISH LANGUAGE RESOURCES ===
    // ==================================

    const titlePrefixes = ["The", "A", "Chronicles of", "Tales from", "Legacy of", "Secrets of", "Whispers of", "Echoes of", "Beyond the", "Journey to", "Return to", "Shadows of", "Light of", "Children of", "Guardians of", "Curse of", "Blessing of", "Mystery of", "Last", "First", "Lost", "Forgotten", "Hidden", "Ancient", "Eternal", "Silent", "Broken", "Shattered", "Fallen", "Rising", "Endless", "Infinite", "Divine", "Sacred", "Forbidden", "Stolen", "Untold", "Unseen", "Veiled", "Masked", "Twilight", "Midnight", "Dawn of", "Dusk of", "Origin of", "Birth of", "Death of", "Rebirth of", "Awakening of", "Fall of", "Rise of", "Revenge of", "Wrath of", "Mercy of", "Justice of", "Honor of", "Glory of", "Pride of", "Song of", "Voice of", "Cry of", "Call of", "Path of", "Way of", "Road to", "Bridge to", "Gate to", "Door to", "Portal to", "Window to", "Mirror of", "Reflection of", "Shadow of", "Light of", "Dark"];
    const titleNouns = ["Kingdom", "Empire", "Realm", "World", "Land", "Nation", "Planet", "Dimension", "Universe", "Reality", "Dream", "Nightmare", "Fantasy", "Illusion", "Memory", "Thought", "Discovery", "Creation", "Destruction", "Chaos", "Order", "Balance", "Peace", "War", "Victory", "Defeat", "Destiny", "Fate", "Fortune", "Mystery", "Secret", "Enigma", "Prophecy", "Vision", "Oracle", "Hero", "Villain", "Soul", "Spirit", "Mind", "Heart", "Shadow", "Ghost", "Tower", "Castle", "Fortress", "Horizon", "Sky", "Heaven", "Garden", "Forest", "Mountain", "River", "Ocean", "Sea", "Island", "Star", "Sun", "Moon", "Galaxy", "Void", "Abyss", "Labyrinth", "Journey", "Quest", "Adventure", "Knowledge", "Wisdom", "Darkness", "Light", "Crown", "Throne", "Scepter", "Jewel", "Gem", "Stone", "Flame", "Fire", "Ice", "Winter", "Spring", "Summer", "Autumn", "Eternity", "Infinity", "Moment"];
    const titleAdjectives = ["Dark", "Light", "Bright", "Shadowy", "Glowing", "Shining", "Burning", "Frozen", "Icy", "Cold", "Hot", "Warm", "Ancient", "Lost", "Forgotten", "Hidden", "Sacred", "Forbidden", "Cursed", "Blessed", "Broken", "Shattered", "Fallen", "Rising", "Endless", "Infinite", "Eternal", "Divine", "Mortal", "Silent", "Whispering", "Screaming", "Lonely", "Crowded", "Empty", "Full", "Final", "First", "Last", "True", "False", "Illusory", "Real", "Possible", "Impossible"];
    const titleSubjects = ["Dragon", "Phoenix", "Griffin", "Unicorn", "Angel", "Demon", "King", "Queen", "Prince", "Princess", "Knight", "Mage", "Wizard", "Witch", "Sorcerer", "Warrior", "Thief", "Assassin", "Hunter", "Prophet", "Seer", "Oracle", "God", "Goddess", "Titan", "Giant", "Elf", "Dwarf", "Orc", "Goblin", "Mermaid", "Siren", "Ghost", "Specter", "Wolf", "Lion", "Eagle", "Raven", "Serpent", "Leviathan", "Behemoth", "Star", "Comet", "Nebula", "Wanderer", "Traveler", "Explorer", "Scholar", "Alchemist", "Emperor", "Empress"];
    const titleConnectors = ["of", "and", "in", "from", "beyond", "beneath", "above", "below", "within", "without", "between", "among", "across", "through", "after", "before", "with", "by", "near", "at", "to", "for", "or", "but", "yet", "while"];
    const firstNames = ["James", "John", "Robert", "Michael", "William", "David", "Richard", "Joseph", "Thomas", "Charles", "Christopher", "Daniel", "Matthew", "Anthony", "Mark", "Donald", "Steven", "Paul", "Andrew", "Joshua", "Kenneth", "Kevin", "Brian", "George", "Timothy", "Ronald", "Edward", "Jason", "Jeffrey", "Ryan", "Jacob", "Gary", "Nicholas", "Eric", "Jonathan", "Stephen", "Larry", "Justin", "Scott", "Brandon", "Benjamin", "Samuel", "Gregory", "Alexander", "Patrick", "Frank", "Raymond", "Jack", "Dennis", "Jerry", "Mary", "Patricia", "Jennifer", "Linda", "Elizabeth", "Barbara", "Susan", "Jessica", "Sarah", "Karen", "Lisa", "Nancy", "Betty", "Sandra", "Margaret", "Ashley", "Kimberly", "Emily", "Donna", "Michelle", "Carol", "Amanda", "Melissa", "Deborah", "Stephanie", "Dorothy", "Rebecca", "Sharon", "Laura", "Cynthia", "Kathleen", "Helen", "Amy", "Shirley", "Angela", "Anna", "Ruth", "Brenda", "Pamela", "Nicole", "Katherine", "Samantha", "Christine", "Catherine", "Virginia", "Debra", "Rachel", "Janet", "Emma", "Carolyn", "Maria", "Heather", "Diane", "Julie", "Joyce", "Evelyn", "Joan", "Victoria", "Kelly", "Christina", "Lauren", "Frances", "Martha", "Judith", "Cheryl", "Megan", "Andrea", "Olivia", "Ann", "Jean", "Alice", "Jacqueline", "Hannah", "Doris", "Kathryn", "Gloria", "Teresa", "Sara", "Janice", "Marie", "Julia", "Grace", "Judy", "Theresa", "Rose", "Beverly", "Denise", "Marilyn", "Amber", "Danielle", "Brittany", "Diana", "Abigail", "Jane", "Natalie", "Lori", "Tiffany", "Taylor", "Lee", "Quinn", "Rowan", "Robin", "River", "Indigo", "Sage", "Hazel", "Ash", "Remy", "Marlowe", "Zephyr", "Nova", "Jules", "Phoenix", "Ari", "Onyx", "Alexis", "Riley", "Jordan", "Morgan", "Casey", "Skyler"];
    const lastNames = ["Smith", "Johnson", "Williams", "Jones", "Brown", "Davis", "Miller", "Wilson", "Moore", "Taylor", "Anderson", "Thomas", "Jackson", "White", "Harris", "Martin", "Thompson", "Garcia", "Martinez", "Robinson", "Clark", "Rodriguez", "Lewis", "Lee", "Walker", "Hall", "Allen", "Young", "King", "Wright", "Scott", "Green", "Adams", "Baker", "Nelson", "Carter", "Mitchell", "Perez", "Roberts", "Turner", "Phillips", "Campbell", "Parker", "Evans", "Edwards", "Collins", "Stewart", "Morris", "Rogers", "Reed", "Cook", "Morgan", "Bell", "Murphy", "Bailey", "Cooper", "Richardson", "Cox", "Howard", "Ward", "Peterson", "Gray", "James", "Watson", "Brooks", "Kelly", "Sanders", "Price", "Bennett", "Wood", "Barnes", "Ross", "Henderson", "Coleman", "Jenkins", "Perry", "Powell", "Long", "Patterson", "Hughes", "Washington", "Butler", "Simmons", "Foster", "Russell", "Griffin", "Diaz", "Hayes", "Faulkner", "Wolf", "O'Sullivan", "MacLeod", "Van Houten", "de la Cruz", "Li", "Wong", "Chen", "Park", "Kim", "Yamamoto", "Sato", "Khan", "Singh", "Patel", "Ivanov", "Smirnov", "Silva", "Santos", "Dupont", "Bernard", "Rossi", "Ferrari", "Kowalski", "Nowak", "Andersson", "Johansson", "Hansen", "Jensen", "Storm", "Frost", "Winters", "Blackwood", "Whitestone", "Redfield", "Greenwood", "Goldsmith", "Silverstein", "Diamond", "Ironside", "Steele", "Starling", "Raven", "Hawk", "Falcon", "Rivers", "Forest", "Hill", "Mountain", "Stone", "Shore", "Day", "Night", "Valentine", "Writer", "Author", "Poet", "Bard", "Scribe", "Scholar", "Sage", "Wizard", "Witch", "Sorcerer", "Seer", "Prophet", "Oracle"];
    const titleParticles = ["von", "van", "de", "del", "della", "di", "da", "du", "des", "le", "la", "el", "al", "ibn", "ben", "bin", "mac", "mc", "o", "y"];
    const descriptionPatterns = ["A {adjective} tale about {character} who discovers {object} in {location}.", "Set in {location}, this {genre} follows {character} on a quest for {object}.", "When {character} encounters {object}, {event} ensues in this {adjective} {genre}.", "A {adjective} exploration of {theme} through the eyes of {character} in {location}.", "{character}'s life changes forever when {event} reveals {secret} about {location}.", "In a world where {concept}, {character} must confront {adversity} to find {object}.", "The {adjective} story of how {character} overcame {adversity} with the help of {object}.", "A {adjective} {genre} examining the nature of {theme} and {concept}.", "When {location} faces {adversity}, {character} must use {object} to save everyone.", "{character} journeys through {location} in search of {object}, only to discover {secret}."];
    const characters = ["a young scholar", "an aging detective", "a disgraced knight", "an ambitious apprentice", "a reluctant hero", "a cunning thief", "a forgotten deity", "an exiled monarch", "a mysterious stranger", "a gifted child", "a reformed villain", "a cursed wanderer", "a veteran soldier", "a nomadic bard", "an orphaned heir", "a reclusive inventor", "a cynical merchant", "a haunted artist", "a brilliant scientist", "a retired assassin", "a prophesied savior", "an immortal being", "a time-displaced traveler"];
    const objects = ["an ancient artifact", "a forbidden spell", "a lost heirloom", "a mysterious map", "a powerful weapon", "a forgotten manuscript", "a rare gem", "a magical instrument", "a secret formula", "a prophetic scroll", "a sacred relic", "an alien device", "a hidden doorway", "a sentient machine", "a time-bending watch", "a reality-altering prism", "a truth-revealing mirror", "a soul-binding contract", "a wish-granting vessel", "a star-forged blade"];
    const locations = ["a forgotten kingdom", "an underwater city", "a floating island", "a subterranean civilization", "a parallel dimension", "a distant planet", "an enchanted forest", "a haunted mansion", "a desolate wasteland", "a hidden monastery", "a thriving metropolis", "a frozen tundra", "a celestial realm", "a digital world", "a post-apocalyptic landscape", "a dream realm", "a sentient labyrinth", "a mirror dimension", "a necropolis", "a living island"];
    const events = ["a celestial alignment", "a violent revolution", "a natural disaster", "a technological singularity", "a divine intervention", "a mysterious disappearance", "a prophesied return", "a magical awakening", "an unexpected inheritance", "a scientific breakthrough", "a cosmic collision", "a dimensional rift", "a royal coronation", "a historical discovery", "a global pandemic", "a temporal paradox", "a massive invasion", "a forbidden ritual", "a spiritual awakening"];
    const secrets = ["a hidden lineage", "a cosmic truth", "a forbidden knowledge", "a government conspiracy", "a historical deception", "a suppressed technology", "a magical heritage", "an alien origin", "a forgotten civilization", "a divine purpose", "a prophesied doom", "a reality illusion", "a time loop", "a simulated reality", "a dimensional convergence", "a soul fragmentation", "a memory fabrication", "a universal connection", "a paradoxical existence"];
    const themes = ["identity", "memory", "time", "mortality", "love", "power", "freedom", "justice", "truth", "knowledge", "faith", "hope", "redemption", "vengeance", "sacrifice", "fate", "choice", "isolation", "connection", "reality", "consciousness", "transformation", "order", "chaos", "balance", "war", "courage", "fear", "forgiveness", "guilt", "loyalty", "betrayal", "innocence", "corruption", "wisdom", "purpose", "existence", "free will", "morality", "good", "evil", "tradition", "progress", "life", "death", "rebirth", "nature", "magic", "destiny"];
    const concepts = ["time travel", "immortality", "telepathy", "telekinesis", "invisibility", "shapeshifting", "mind control", "teleportation", "precognition", "necromancy", "elemental manipulation", "illusion casting", "dimensional travel", "gravity manipulation", "memory extraction", "dream walking", "artificial consciousness", "virtual reality", "faster-than-light travel", "planetary terraforming", "consciousness uploading", "a hivemind", "universal translation", "sentient cities"];
    const adversities = ["a corrupt government", "a natural disaster", "an invading army", "a deadly plague", "a mysterious curse", "a powerful corporation", "a criminal organization", "a technological breakdown", "a religious inquisition", "a magical catastrophe", "an economic collapse", "a civil war", "a tyrannical ruler", "a rogue artificial intelligence", "a cosmic threat", "an alien infiltration", "a biological weapon", "a time anomaly"];
    const consequences = ["global catastrophe", "personal transformation", "societal collapse", "spiritual awakening", "technological revolution", "environmental restoration", "historical revision", "cultural renaissance", "political upheaval", "peaceful unification", "dimensional merging", "temporal restructuring", "reality redefinition", "consciousness expansion", "universal understanding", "cosmic realignment", "evolutionary advancement"];
    const sacrifices = ["one's memory", "one's identity", "one's mortality", "one's humanity", "one's sanity", "one's freedom", "one's power", "one's family", "one's love", "one's happiness", "one's innocence", "one's knowledge", "one's purpose", "one's future", "one's past", "one's soul", "one's faith", "one's integrity", "one's principles", "one's morality"];
    const genres = ["fantasy novel", "science fiction epic", "historical fiction", "mystery thriller", "psychological drama", "romantic adventure", "philosophical treatise", "dystopian prophecy", "utopian vision", "political satire", "social commentary", "supernatural horror", "magical realism", "urban fantasy", "space opera", "cyberpunk narrative", "steampunk adventure", "alternate history", "time travel paradox", "post-apocalyptic survival tale", "metaphysical exploration", "coming-of-age story", "tragedy", "comedy", "epic poem"];
    const adjectives = ["captivating", "haunting", "mystical", "ancient", "arcane", "bleak", "brooding", "celestial", "cerebral", "cryptic", "daunting", "decadent", "defiant", "desolate", "grotesque", "dire", "dreamlike", "eerie", "elusive", "enchanting", "enigmatic", "ephemeral", "exquisite", "fatal", "feral", "formidable", "fractured", "ghastly", "grim", "heroic", "illusory", "imposing", "improbable", "infinite", "insidious", "inscrutable", "intrepid", "introspective", "iridescent", "lonesome", "luminous", "macabre", "majestic", "melancholic", "mesmerizing", "monumental", "mythic", "nocturnal", "ominous", "otherworldly", "poignant", "puzzling", "quixotic", "resilient", "resplendent", "reverent", "sacred", "savage", "shimmering", "solemn", "spectral", "sublime", "surreal", "tempestuous", "tenebrous", "transcendent", "turbulent", "uncanny", "unfathomable", "unsettling", "veiled", "vibrant", "volatile", "whimsical", "wistful", "lurid"];
    const middleInitials = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

    // ==================================
    // === STATUE RESOURCES (ENGLISH) ===
    // ==================================

    const statueSubjects = ["Warrior", "Knight", "King", "Queen", "Emperor", "Empress", "General", "Hero", "Saint", "Goddess", "God", "Angel", "Deity", "Guardian", "Protector", "Scholar", "Philosopher", "Inventor", "Explorer", "Admiral", "Captain", "Merchant", "Artisan", "Poet", "Bard", "Musician", "Dancer", "Healer", "Priest", "Monk", "Druid", "Wizard", "Sorcerer", "Oracle", "Seer", "Prophet", "Hunter", "Archer", "Gladiator", "Champion", "Paladin", "Crusader", "Liberator", "Founder", "Builder", "Creator", "Destroyer", "Conqueror", "Defender", "Martyr", "Sacrifice", "Victor", "Child", "Mother", "Father", "Elder", "Ancestor", "Dragon", "Phoenix", "Griffin", "Unicorn", "Lion", "Eagle", "Wolf", "Bear", "Serpent", "Raven"];
    const statueMaterials = ["marble", "bronze", "granite", "obsidian", "jade", "ivory", "gold", "silver", "copper", "iron", "steel", "stone", "limestone", "sandstone", "basalt", "crystal", "quartz", "onyx", "alabaster", "clay", "wood", "ebony", "oak", "cedar", "mahogany", "bamboo"];
    const statueAdjectives = ["majestic", "imposing", "graceful", "weathered", "ancient", "towering", "delicate", "intricate", "massive", "elegant", "serene", "fierce", "noble", "regal", "divine", "sacred", "mysterious", "haunting", "beautiful", "sublime", "magnificent", "splendid", "grandiose", "monumental", "colossal", "diminutive", "exquisite", "crude", "primitive", "sophisticated", "ornate", "simple", "austere", "baroque", "classical", "gothic", "romantic", "modernist", "abstract", "realistic", "stylized", "symbolic", "allegorical"];
    const statuePoses = ["standing tall", "kneeling in prayer", "seated on a throne", "holding a sword aloft", "extending a welcoming hand", "pointing toward the horizon", "embracing a child", "reading from a scroll", "playing a musical instrument", "dancing gracefully", "wielding a staff", "grasping a shield", "raising a chalice", "holding scales of justice", "clutching a book", "bearing a torch", "carrying a banner", "cradling an orb", "mounted on horseback", "in flowing robes", "wearing armor", "crowned with laurels", "veiled in mystery", "surrounded by flames", "emerging from stone", "reaching for the heavens", "bowing in reverence", "in contemplation", "mid-stride", "frozen in battle"];
    const statueFeatures = ["flowing hair", "a stern expression", "kind eyes", "a noble bearing", "intricate armor", "elaborate robes", "detailed musculature", "delicate features", "a commanding presence", "weathered features", "youthful vigor", "ancient wisdom", "serene composure", "fierce determination", "gentle hands", "powerful limbs", "ornate jewelry", "ritual scars", "ceremonial markings", "divine radiance", "ethereal beauty", "earthly strength", "mortal frailty", "immortal grace"];
    const statueLocations = ["the town square", "the temple courtyard", "the palace gardens", "the cemetery", "the marketplace", "the harbor", "the city gates", "the mountain pass", "the forest clearing", "the sacred grove", "the royal palace", "the ancient ruins", "the monastery", "the university", "the library", "the museum", "the park", "the memorial garden", "the battlefield", "the crossroads"];
    const statueConditions = ["pristine", "slightly weathered", "heavily eroded", "partially broken", "missing an arm", "cracked", "moss-covered", "vine-entangled", "blackened by age", "polished to a shine", "recently restored", "freshly carved", "showing its age", "battle-scarred", "time-worn", "lovingly maintained", "neglected", "vandalized", "decorated with flowers", "adorned with offerings"];
    const statueHistories = ["commissioned by a grateful city", "carved by a master sculptor", "erected to commemorate a victory", "built to honor the fallen", "created as a symbol of peace", "raised in defiance", "constructed in secret", "gifted by foreign dignitaries", "carved from a single block", "assembled from many pieces", "created by unknown hands", "sculpted by the subject themselves", "made by a grieving family", "commissioned by the church", "built by the people", "carved by prisoners", "created as penance", "made to fulfill a vow", "erected overnight", "built over many years"];

    const statueDescriptionPatterns = [
        "A {adjective} {material} statue of {subject}, {pose}. {feature} dominates the sculpture, which stands in {location}. The statue is {condition} and was {history}.",
        "This {material} monument depicts {subject} {pose}, carved with {feature}. Located in {location}, the {adjective} statue is {condition}. Legend says it was {history}.",
        "Standing {adjective} in {location}, this {material} statue shows {subject} {pose}. Notable for its {feature}, the monument is {condition} and {history}.",
        "A {condition} {material} statue of {subject} can be found in {location}. The {adjective} figure is shown {pose}, with {feature}. It was {history}.",
        "The {adjective} statue depicts {subject} {pose}, crafted from {material}. Its {feature} draws the eye, and though {condition}, it remains in {location} where it was {history}."
    ];

    // ==================================
    // === ITALIAN LANGUAGE RESOURCES ===
    // ==================================

    const titlePrefixes_it = ["Il", "La", "Un", "Una", "Cronache di", "Racconti da", "L'eredità di", "Segreti di", "Sussurri di", "Echi di", "Oltre il", "Viaggio a", "Ritorno a", "Ombre di", "Luce di", "Figli di", "Guardiani di", "Maledizione di", "Benedizione di", "Mistero di", "L'ultimo", "Il primo", "Perduto", "Dimenticato", "Nascosto", "Antico", "Eterno", "Silenzioso", "Infranto", "Spezzato", "Caduto", "Nascente", "Senza fine", "Infinito", "Divino", "Sacro", "Proibito", "Rubato", "Mai raccontato", "Invisibile", "Velato", "Mascherato", "Crepuscolo", "Mezzanotte", "Alba di", "Tramonto di", "Origine di", "Nascita di", "Morte di", "Rinascita di", "Risveglio di", "Caduta di", "Ascesa di", "Vendetta di", "Ira di", "Pietà di", "Giustizia di", "Onore di", "Gloria di", "Orgoglio di", "Canto di", "Voce di", "Grido di", "Chiamata di", "Sentiero di", "Via di", "Strada per", "Ponte per", "Cancello per", "Porta per", "Portale per", "Finestra su", "Specchio di", "Riflesso di", "Ombra di", "Luce di", "Oscuro"];
    const titleNouns_it = ["Regno", "Impero", "Reame", "Mondo", "Terra", "Nazione", "Pianeta", "Dimensione", "Universo", "Realtà", "Sogno", "Incubo", "Fantasia", "Illusione", "Ricordo", "Pensiero", "Scoperta", "Creazione", "Distruzione", "Caos", "Ordine", "Equilibrio", "Pace", "Guerra", "Vittoria", "Sconfitta", "Destino", "Fato", "Fortuna", "Mistero", "Segreto", "Enigma", "Profezia", "Visione", "Oracolo", "Eroe", "Antagonista", "Anima", "Spirito", "Mente", "Cuore", "Ombra", "Fantasma", "Torre", "Castello", "Fortezza", "Orizzonte", "Cielo", "Paradiso", "Giardino", "Foresta", "Montagna", "Fiume", "Oceano", "Mare", "Isola", "Stella", "Sole", "Luna", "Galassia", "Vuoto", "Abisso", "Labirinto", "Viaggio", "Ricerca", "Avventura", "Conoscenza", "Saggezza", "Oscurità", "Luce", "Corona", "Trono", "Scettro", "Gioiello", "Gemma", "Pietra", "Fiamma", "Fuoco", "Ghiaccio", "Inverno", "Primavera", "Estate", "Autunno", "Eternità", "Infinito", "Momento"];
    const titleAdjectives_it = ["Oscuro", "Luminoso", "Brillante", "Ombroso", "Splendente", "Lucente", "Ardente", "Ghiacciato", "Gelido", "Freddo", "Caldo", "Tiepido", "Antico", "Perduto", "Dimenticato", "Nascosto", "Sacro", "Proibito", "Maledetto", "Benedetto", "Infranto", "Spezzato", "Caduto", "Nascente", "Senza fine", "Infinito", "Eterno", "Divino", "Mortale", "Silenzioso", "Sussurrante", "Urlante", "Solitario", "Affollato", "Vuoto", "Pieno", "Finale", "Primo", "Ultimo", "Vero", "Falso", "Illusorio", "Reale", "Possibile", "Impossibile"];
    const titleSubjects_it = ["Drago", "Fenice", "Grifone", "Unicorno", "Angelo", "Demone", "Re", "Regina", "Principe", "Principessa", "Cavaliere", "Mago", "Strega", "Stregone", "Guerriero", "Ladro", "Assassino", "Cacciatore", "Profeta", "Veggente", "Oracolo", "Dio", "Dea", "Titano", "Gigante", "Elfo", "Nano", "Orco", "Goblin", "Sirena", "Fantasma", "Spettro", "Lupo", "Leone", "Aquila", "Corvo", "Serpente", "Leviatano", "Behemoth", "Stella", "Cometa", "Nebulosa", "Viandante", "Viaggiatore", "Esploratore", "Studioso", "Alchimista", "Imperatore", "Imperatrice"];
    const titleConnectors_it = ["di", "e", "in", "da", "oltre", "sotto", "sopra", "dentro", "fuori", "tra", "fra", "attraverso", "dopo", "prima", "con", "vicino", "a", "per", "o", "ma", "tuttavia", "mentre"];
    const firstNames_it = ["Marco", "Alessandro", "Giuseppe", "Flavio", "Luca", "Paolo", "Roberto", "Stefano", "Andrea", "Matteo", "Daniele", "Federico", "Riccardo", "Davide", "Michele", "Francesco", "Simone", "Claudio", "Antonio", "Giovanni", "Mario", "Luigi", "Pietro", "Leonardo", "Tommaso", "Gabriele", "Enrico", "Lorenzo", "Edoardo", "Filippo", "Angelo", "Vincenzo", "Salvatore", "Massimo", "Giorgio", "Carlo", "Nicola", "Domenico", "Giulio", "Fabio", "Alessio", "Sergio", "Raffaele", "Cristian", "Emanuele", "Giacomo", "Walter", "Giulia", "Sofia", "Aurora", "Ginevra", "Alice", "Beatrice", "Emma", "Giorgia", "Vittoria", "Matilde", "Chiara", "Anna", "Francesca", "Martina", "Sara", "Greta", "Elena", "Elisa", "Caterina", "Laura", "Valentina", "Paola", "Monica", "Silvia", "Veronica", "Barbara", "Patrizia", "Nadia", "Ilaria", "Eleonora", "Maria", "Rosa", "Angela", "Teresa", "Lucia", "Giovanna", "Carmela", "Cloe", "Aria", "Elia", "Leone", "Enea", "Azzurra", "Sole", "Luce", "Viola", "Bianca", "Alma", "Adele", "Diana", "Iris", "Isabel", "Ambra", "Asia", "Luna", "Elettra"];
    const lastNames_it = ["Rossi", "Russo", "Ferrari", "Esposito", "Bianchi", "Romano", "Colombo", "Ricci", "Marino", "Greco", "Bruno", "Gallo", "Conti", "De Luca", "Mancini", "Costa", "Giordano", "Rizzo", "Lombardi", "Moretti", "Barbieri", "Fontana", "Santoro", "Mariani", "Rinaldi", "Caruso", "Villa", "Leone", "Longo", "Galli", "Martini", "Serra", "Conte", "Ferri", "Sanna", "Messina", "D'Amico", "Amato", "Cattaneo", "Orlando", "Damico", "Farina", "Testa", "Grassi", "Parisi", "Volpe", "Piras", "Sartori", "Milani", "Monti", "Gentile", "Ferrara", "Bernardi", "Marchetti", "Pellegrini", "Palmieri", "Basile", "Fiore", "Bellini", "D'Angelo", "Riva", "Pagano", "Fabbri", "Grimaldi", "Poli", "Silvestri", "Gatti", "Barone", "Vitale", "Benedetti", "Pugliese", "Caputo", "De Angelis", "Salerno", "Gucci", "Armani", "Versace", "Prada", "Valentino", "da Vinci", "Alighieri", "Verdi", "Puccini", "Vivaldi", "Caravaggio", "Raffaello", "Donatello", "Galilei", "Medici", "Borgia", "Sforza", "Este", "Montefeltro", "Visconti", "Savona", "Genovese", "Fiorentino", "Veneziano", "Romano", "Napoletano", "Siciliano", "Sardo"];
    const titleParticles_it = ["di", "de", "del", "della", "dello", "da", "dal", "dalla", "dallo", "dei", "degli", "delle"];
    const descriptionPatterns_it = ["Un racconto {adjective} su {character} che scopre {object} in {location}.", "Ambientato in {location}, questo {genre} segue {character} in una missione per {object}.", "Quando {character} incontra {object}, ne consegue {event} in questo {adjective} {genre}.", "Un'esplorazione {adjective} di {theme} attraverso gli occhi di {character} in {location}.", "La vita di {character} cambia per sempre quando {event} rivela {secret} su {location}.", "In un mondo dove {concept}, {character} deve affrontare {adversity} per trovare {object}.", "La storia {adjective} di come {character} superò {adversity} con l'aiuto di {object}.", "Un {genre} {adjective} che esamina la natura di {theme} e {concept}.", "Quando {location} affronta {adversity}, {character} deve usare {object} per salvare tutti.", "{character} viaggia attraverso {location} in cerca di {object}, solo per scoprire {secret}."];
    const characters_it = ["un giovane studioso", "un detective anziano", "un cavaliere in disgrazia", "un apprendista ambizioso", "un eroe riluttante", "un ladro astuto", "una divinità dimenticata", "un monarca in esilio", "un misterioso straniero", "un bambino dotato", "un cattivo redento", "un viandante maledetto", "un soldato veterano", "un bardo nomade", "un erede orfano", "un inventore solitario", "un mercante cinico", "un artista tormentato", "uno scienziato brillante", "un assassino in pensione", "un salvatore profetizzato", "un essere immortale", "un viaggiatore spostato nel tempo"];
    const objects_it = ["un antico manufatto", "un incantesimo proibito", "un cimelio perduto", "una mappa misteriosa", "un'arma potente", "un manoscritto dimenticato", "una gemma rara", "uno strumento magico", "una formula segreta", "una pergamena profetica", "una reliquia sacra", "un dispositivo alieno", "un portale nascosto", "una macchina senziente", "un orologio che piega il tempo", "un prisma che altera la realtà", "uno specchio che rivela la verità", "un contratto lega-anime", "un artefatto esaudisci-desideri", "una lama forgiata nelle stelle"];
    const locations_it = ["un regno dimenticato", "una città sottomarina", "un'isola fluttuante", "una civiltà sotterranea", "una dimensione parallela", "un pianeta distante", "una foresta incantata", "una magione infestata", "una terra desolata", "un monastero nascosto", "una metropoli fiorente", "una tundra ghiacciata", "un reame celestiale", "un mondo digitale", "un paesaggio post-apocalittico", "un reame onirico", "un labirinto senziente", "una dimensione specchio", "una necropoli", "un'isola vivente"];
    const events_it = ["un allineamento celeste", "una rivoluzione violenta", "un disastro naturale", "una singolarità tecnologica", "un intervento divino", "una misteriosa sparizione", "un ritorno profetizzato", "un risveglio magico", "un'eredità inaspettata", "una scoperta scientifica", "una collisione cosmica", "una frattura dimensionale", "un'incoronazione reale", "una scoperta storica", "una pandemia globale", "un paradosso temporale", "un'invasione di massa", "un rituale proibito", "un risveglio spirituale"];
    const secrets_it = ["una discendenza nascosta", "una verità cosmica", "una conoscenza proibita", "una cospirazione governativa", "un inganno storico", "una tecnologia soppressa", "un'eredità magica", "un'origine aliena", "una civiltà dimenticata", "uno scopo divino", "un destino profetizzato", "una realtà illusoria", "un ciclo temporale", "una realtà simulata", "una convergenza dimensionale", "una frammentazione dell'anima", "un ricordo fabbricato", "una connessione universale", "un'esistenza paradossale"];
    const themes_it = ["identità", "memoria", "tempo", "mortalità", "amore", "potere", "libertà", "giustizia", "verità", "conoscenza", "fede", "speranza", "redenzione", "vendetta", "sacrificio", "destino", "scelta", "isolamento", "connessione", "realtà", "coscienza", "trasformazione", "ordine", "caos", "equilibrio", "guerra", "coraggio", "paura", "perdono", "colpa", "lealtà", "tradimento", "innocenza", "corruzione", "saggezza", "scopo", "esistenza", "libero arbitrio", "moralità", "bene", "male", "tradizione", "progresso", "vita", "morte", "rinascita", "natura", "magia"];
    const concepts_it = ["viaggio nel tempo", "immortalità", "telepatia", "telecinesi", "invisibilità", "mutaforma", "controllo mentale", "teletrasporto", "precognizione", "negromanzia", "manipolazione elementale", "creazione di illusioni", "viaggio dimensionale", "manipolazione della gravità", "estrazione della memoria", "viaggio onirico", "coscienza artificiale", "realtà virtuale", "viaggio superluminale", "terraformazione planetaria", "upload della coscienza", "una mente alveare", "traduzione universale", "città senzienti"];
    const adversities_it = ["un governo corrotto", "un disastro naturale", "un esercito invasore", "una piaga mortale", "una maledizione misteriosa", "una potente corporazione", "un'organizzazione criminale", "un guasto tecnologico", "un'inquisizione religiosa", "una catastrofe magica", "un collasso economico", "una guerra civile", "un sovrano tirannico", "un'intelligenza artificiale ribelle", "una minaccia cosmica", "un'infiltrazione aliena", "un'arma biologica", "un'anomalia temporale"];
    const consequences_it = ["una catastrofe globale", "una trasformazione personale", "il collasso della società", "un risveglio spirituale", "una rivoluzione tecnologica", "il ripristino ambientale", "una revisione storica", "una rinascita culturale", "uno sconvolgimento politico", "un'unificazione pacifica", "una fusione dimensionale", "una ristrutturazione temporale", "una ridefinizione della realtà", "un'espansione della coscienza", "una comprensione universale", "un riallineamento cosmico", "un avanzamento evolutivo"];
    const sacrifices_it = ["la propria memoria", "la propria identità", "la propria mortalità", "la propria umanità", "la propria sanità mentale", "la propria libertà", "il proprio potere", "la propria famiglia", "il proprio amore", "la propria felicità", "la propria innocenza", "la propria conoscenza", "il proprio scopo", "il proprio futuro", "il proprio passato", "la propria anima", "la propria fede", "la propria integrità", "i propri principi", "la propria moralità"];
    const genres_it = ["romanzo fantasy", "epopea di fantascienza", "romanzo storico", "thriller misterioso", "dramma psicologico", "avventura romantica", "trattato filosofico", "profezia distopica", "visione utopica", "satira politica", "commento sociale", "horror soprannaturale", "realismo magico", "urban fantasy", "space opera", "narrativa cyberpunk", "avventura steampunk", "storia alternativa", "paradosso temporale", "racconto di sopravvivenza post-apocalittico", "esplorazione metafisica", "romanzo di formazione", "tragedia", "commedia", "poema epico"];
    const adjectives_it = ["accattivante", "ossessionante", "mistico", "antico", "arcano", "desolato", "cupo", "celestiale", "cerebrale", "criptico", "impegnativo", "decadente", "sprezzante", "desolato", "grottesco", "terribile", "onirico", "inquietante", "sfuggente", "incantevole", "enigmatico", "effimero", "squisito", "fatale", "ferale", "formidabile", "fratturato", "spettrale", "cupo", "eroico", "illusorio", "imponente", "improbabile", "infinito", "insidioso", "imperscrutabile", "intrepido", "introspettivo", "iridescente", "solitario", "luminoso", "macabro", "maestoso", "melanconico", "ipnotico", "monumentale", "mitico", "notturno", "minaccioso", "ultraterreno", "toccante", "sconcertante", "cavalleresco", "resiliente", "splendido", "riverente", "sacro", "selvaggio", "scintillante", "solenne", "spettrale", "sublime", "surreale", "tempestoso", "tenebroso", "trascendente", "turbolento", "strano", "insondabile", "inquietante", "velato", "vibrante", "volatile", "stravagante", "malinconico", "torbido"];
    const middleInitials_it = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

    // ==================================
    // === STATUE RESOURCES (ITALIAN) ===
    // ==================================

    const statueSubjects_it = ["Guerriero", "Cavaliere", "Re", "Regina", "Imperatore", "Imperatrice", "Generale", "Eroe", "Santo", "Dea", "Dio", "Angelo", "Divinità", "Guardiano", "Protettore", "Studioso", "Filosofo", "Inventore", "Esploratore", "Ammiraglio", "Capitano", "Mercante", "Artigiano", "Poeta", "Bardo", "Musicista", "Danzatore", "Guaritore", "Sacerdote", "Monaco", "Druido", "Mago", "Stregone", "Oracolo", "Veggente", "Profeta", "Cacciatore", "Arciere", "Gladiatore", "Campione", "Paladino", "Crociato", "Liberatore", "Fondatore", "Costruttore", "Creatore", "Distruttore", "Conquistatore", "Difensore", "Martire", "Sacrificio", "Vincitore", "Bambino", "Madre", "Padre", "Anziano", "Antenato", "Drago", "Fenice", "Grifone", "Unicorno", "Leone", "Aquila", "Lupo", "Orso", "Serpente", "Corvo"];
    const statueMaterials_it = ["marmo", "bronzo", "granito", "ossidiana", "giada", "avorio", "oro", "argento", "rame", "ferro", "acciaio", "pietra", "calcare", "arenaria", "basalto", "cristallo", "quarzo", "onice", "alabastro", "argilla", "legno", "ebano", "quercia", "cedro", "mogano", "bambù"];
    const statueAdjectives_it = ["maestosa", "imponente", "aggraziata", "logorata", "antica", "svettante", "delicata", "intricata", "massiccia", "elegante", "serena", "feroce", "nobile", "regale", "divina", "sacra", "misteriosa", "ossessionante", "bella", "sublime", "magnifica", "splendida", "grandiosa", "monumentale", "colossale", "minuta", "squisita", "grezza", "primitiva", "sofisticata", "ornata", "semplice", "austera", "barocca", "classica", "gotica", "romantica", "modernista", "astratta", "realistica", "stilizzata", "simbolica", "allegorica"];
    const statuePoses_it = ["in piedi maestosa", "inginocchiata in preghiera", "seduta su un trono", "che brandisce una spada", "che tende una mano accogliente", "che indica l'orizzonte", "che abbraccia un bambino", "che legge da un rotolo", "che suona uno strumento", "che danza con grazia", "che impugna un bastone", "che afferra uno scudo", "che alza un calice", "che tiene le bilance della giustizia", "che stringe un libro", "che porta una torcia", "che regge una bandiera", "che culla un globo", "a cavallo", "in vesti fluenti", "che indossa un'armatura", "coronata d'alloro", "velata nel mistero", "circondata dalle fiamme", "che emerge dalla pietra", "che si protende verso i cieli", "che si inchina in riverenza", "in contemplazione", "a metà passo", "bloccata in battaglia"];
    const statueFeatures_it = ["capelli fluenti", "un'espressione severa", "occhi gentili", "un portamento nobile", "un'armatura intricata", "vesti elaborate", "muscolatura dettagliata", "lineamenti delicati", "una presenza dominante", "tratti logorati", "vigore giovanile", "saggezza antica", "compostezza serena", "feroce determinazione", "mani gentili", "membra possenti", "gioielli ornati", "cicatrici rituali", "segni cerimoniali", "radianza divina", "bellezza eterea", "forza terrena", "fragilità mortale", "grazia immortale"];
    const statueLocations_it = ["la piazza del paese", "il cortile del tempio", "i giardini del palazzo", "il cimitero", "il mercato", "il porto", "le porte della città", "il passo montano", "la radura nella foresta", "il bosco sacro", "il palazzo reale", "le rovine antiche", "il monastero", "l'università", "la biblioteca", "il museo", "il parco", "il giardino commemorativo", "il campo di battaglia", "il crocicchio"];
    const statueConditions_it = ["incontaminata", "leggermente logorata", "pesantemente erosa", "parzialmente rotta", "priva di un braccio", "screpolata", "coperta di muschio", "avvolta da rampicanti", "annerita dall'età", "lucida a specchio", "recentemente restaurata", "appena scolpita", "che mostra l'età", "segnata dalla battaglia", "consumata dal tempo", "amorevolmente mantenuta", "trascurata", "vandalizzata", "decorata con fiori", "adornata con offerte"];
    const statueHistories_it = ["commissionata da una città grata", "scolpita da un maestro scultore", "eretta per commemorare una vittoria", "costruita per onorare i caduti", "creata come simbolo di pace", "innalzata in segno di sfida", "costruita in segreto", "donata da dignitari stranieri", "scolpita da un singolo blocco", "assemblata da molti pezzi", "creata da mani sconosciute", "scolpita dal soggetto stesso", "fatta da una famiglia in lutto", "commissionata dalla chiesa", "costruita dal popolo", "scolpita da prigionieri", "creata come penitenza", "fatta per adempiere a un voto", "eretta durante la notte", "costruita nel corso di molti anni"];

    const statueDescriptionPatterns_it = [
        "Una statua {adjective} di {material} raffigurante {subject}, {pose}. {feature} domina la scultura, che si trova in {location}. La statua è {condition} e fu {history}.",
        "Questo monumento di {material} raffigura {subject} {pose}, scolpito con {feature}. Situata in {location}, la statua {adjective} è {condition}. La leggenda dice che fu {history}.",
        "Eretta {adjective} in {location}, questa statua di {material} mostra {subject} {pose}. Notevole per {feature}, il monumento è {condition} e {history}.",
        "Una statua {condition} di {material} raffigurante {subject} si trova in {location}. La figura {adjective} è mostrata {pose}, con {feature}. Fu {history}.",
        "La statua {adjective} raffigura {subject} {pose}, scolpita in {material}. {feature} attira l'occhio, e benché {condition}, rimane in {location} dove fu {history}."
    ];
// ==================================
// === PAINTING RESOURCES (ENGLISH) ===
// ==================================

const paintingSubjects = ["landscape", "portrait", "still life", "abstract composition", "seascape", "cityscape", "battle scene", "religious scene", "mythological scene", "genre scene", "nude figure", "animal study", "botanical study", "architectural view", "interior scene", "nocturne", "sunrise", "sunset", "storm", "calm waters", "forest glade", "mountain vista", "village square", "royal court", "tavern scene", "market day", "harvest festival", "wedding ceremony", "funeral procession", "coronation", "exile", "homecoming", "first love", "betrayal", "redemption", "transformation", "ascension", "descent", "creation", "destruction", "birth", "death", "war", "peace", "chaos", "order", "dream", "nightmare", "memory", "prophecy", "illusion", "revelation"];

const paintingStyles = ["realistic", "impressionistic", "expressionistic", "surreal", "abstract", "cubist", "pointillist", "fauvist", "romantic", "baroque", "renaissance", "gothic", "art nouveau", "art deco", "minimalist", "maximalist", "photorealistic", "stylized", "naive", "folk art", "primitive", "modern", "contemporary", "classical", "neoclassical", "symbolist", "dadaist", "futurist", "constructivist", "pop art", "street art", "graffiti", "mural", "fresco", "tempera", "watercolor", "oil", "acrylic", "pastel", "charcoal", "ink wash", "mixed media"];

const paintingColors = ["monochromatic", "sepia", "black and white", "vibrant", "muted", "pastel", "earth tones", "jewel tones", "warm", "cool", "complementary", "analogous", "triadic", "split-complementary", "tetradic", "crimson and gold", "azure and silver", "emerald and copper", "violet and cream", "ochre and umber", "ultramarine and vermillion", "cadmium yellow and prussian blue", "burnt sienna and ivory", "alizarin crimson and titanium white", "raw umber and zinc white", "cobalt blue and cadmium orange", "viridian and rose madder", "lamp black and naples yellow", "cerulean and burnt orange", "quinacridone magenta and pthalo green"];

const paintingTechniques = ["impasto", "glazing", "scumbling", "alla prima", "sfumato", "chiaroscuro", "tenebrism", "pointillism", "broken color", "wet-on-wet", "wet-on-dry", "dry brush", "palette knife", "finger painting", "sgraffito", "frottage", "decalcomania", "dripping", "pouring", "splattering", "blending", "layering", "crosshatching", "stippling", "wash", "gradient", "ombre", "color blocking", "geometric", "organic", "gestural", "controlled", "loose", "tight", "detailed", "rough", "smooth", "textured", "flat", "dimensional", "atmospheric perspective", "linear perspective"];

const paintingMoods = ["melancholic", "joyful", "mysterious", "ominous", "serene", "turbulent", "contemplative", "passionate", "whimsical", "dramatic", "romantic", "ethereal", "haunting", "uplifting", "somber", "nostalgic", "futuristic", "dreamlike", "nightmarish", "peaceful", "chaotic", "harmonious", "discordant", "intense", "subtle", "bold", "delicate", "powerful", "fragile", "timeless", "fleeting", "eternal", "momentary", "infinite", "intimate", "grand", "humble", "majestic", "playful", "serious", "lighthearted", "heavy", "airy", "grounded", "floating", "anchored", "free", "confined", "expansive", "claustrophobic"];

const paintingCompositions = ["centered", "off-center", "rule of thirds", "golden ratio", "symmetrical", "asymmetrical", "balanced", "unbalanced", "diagonal", "vertical", "horizontal", "triangular", "circular", "spiral", "radiating", "converging", "diverging", "layered", "flat", "deep", "shallow", "foreground dominant", "background dominant", "middle ground focus", "multiple focal points", "single focal point", "no focal point", "scattered", "clustered", "linear", "curved", "angular", "organic", "geometric", "fractured", "unified", "fragmented", "whole", "partial", "complete", "incomplete", "open", "closed", "flowing", "static", "dynamic", "still", "moving", "frozen", "fluid"];

const weirdPaintingElements = ["floating eyes", "melting clocks", "impossible geometry", "gravity-defying objects", "morphing faces", "transparent figures", "multiple perspectives", "distorted proportions", "living architecture", "sentient landscapes", "bleeding colors", "fractured reality", "mirror worlds", "inside-out spaces", "time loops", "dimensional rifts", "shadow creatures", "light beings", "crystalline growths", "organic machinery", "mechanical plants", "hybrid creatures", "shapeshifting forms", "recursive patterns", "infinite corridors", "breathing walls", "singing stones", "dancing furniture", "weeping statues", "laughing trees", "screaming silence", "visible music", "audible colors", "touchable thoughts", "edible emotions", "liquid fire", "solid air", "frozen lightning", "flowing stone", "living paint", "painted life"];

const abstractConcepts = ["temporal displacement", "emotional resonance", "psychic energy", "spiritual transcendence", "existential dread", "cosmic consciousness", "quantum entanglement", "parallel dimensions", "collective unconscious", "archetypal symbols", "primordial chaos", "universal harmony", "infinite recursion", "eternal return", "metamorphosis", "transmutation", "sublimation", "disintegration", "reconstruction", "fragmentation", "unification", "separation", "connection", "isolation", "communion", "alienation", "belonging", "exile", "homecoming", "departure", "arrival", "transition", "threshold", "boundary", "limit", "infinity", "void", "fullness", "emptiness", "presence", "absence", "being", "becoming", "ceasing", "beginning", "ending", "continuation", "interruption", "flow", "stagnation"];

const paintingDescriptionPatterns = [
    "A {style} {subject} rendered in {colors} using {technique}. The {composition} composition creates a {mood} atmosphere.",
    "This {colors} painting depicts {subject} with {technique} brushwork. The {style} approach emphasizes {abstractConcept} through {composition} arrangement.",
    "An {mood} {style} work showing {subject}. The artist employed {technique} with {colors} to achieve a {composition} effect featuring {weirdElement}.",
    "The canvas presents {subject} in {style} manner, utilizing {colors} and {technique}. The {mood} quality is enhanced by {composition} structure and {weirdElement}.",
    "A {technique} study of {subject} executed in {style} tradition. The {colors} palette and {composition} design evoke {mood} while incorporating {abstractConcept}.",
    "This experimental piece combines {subject} with {weirdElement}, rendered through {technique} in {colors}. The {style} interpretation creates {mood} tension via {composition} dynamics.",
    "An exploration of {abstractConcept} through {subject}, painted with {technique} using {colors}. The {style} execution and {composition} flow generate {mood} resonance."
];

// ==================================
// === PAINTING RESOURCES (ITALIAN) ===
// ==================================

const paintingSubjects_it = ["paesaggio", "ritratto", "natura morta", "composizione astratta", "marina", "veduta urbana", "scena di battaglia", "scena religiosa", "scena mitologica", "scena di genere", "figura nuda", "studio di animali", "studio botanico", "veduta architettonica", "scena d'interni", "notturno", "alba", "tramonto", "tempesta", "acque calme", "radura nel bosco", "vista montana", "piazza del paese", "corte reale", "scena di taverna", "giorno di mercato", "festa del raccolto", "cerimonia nuziale", "processione funebre", "incoronazione", "esilio", "ritorno a casa", "primo amore", "tradimento", "redenzione", "trasformazione", "ascensione", "discesa", "creazione", "distruzione", "nascita", "morte", "guerra", "pace", "caos", "ordine", "sogno", "incubo", "ricordo", "profezia", "illusione", "rivelazione"];

const paintingStyles_it = ["realistica", "impressionistica", "espressionistica", "surreale", "astratta", "cubista", "puntinista", "fauve", "romantica", "barocca", "rinascimentale", "gotica", "art nouveau", "art deco", "minimalista", "massimalista", "fotorealistica", "stilizzata", "naif", "arte popolare", "primitiva", "moderna", "contemporanea", "classica", "neoclassica", "simbolista", "dadaista", "futurista", "costruttivista", "pop art", "street art", "graffiti", "murale", "affresco", "tempera", "acquerello", "olio", "acrilico", "pastello", "carboncino", "inchiostro", "tecnica mista"];

const paintingColors_it = ["monocromatica", "seppia", "bianco e nero", "vibrante", "tenue", "pastello", "toni della terra", "toni gioiello", "calda", "fredda", "complementare", "analoga", "triadica", "complementare divisa", "tetradica", "cremisi e oro", "azzurro e argento", "smeraldo e rame", "violetto e crema", "ocra e ombra", "oltremare e vermiglione", "giallo cadmio e blu di prussia", "terra di siena bruciata e avorio", "cremisi d'alizarina e bianco di titanio", "terra d'ombra naturale e bianco di zinco", "blu cobalto e arancio cadmio", "verde veronese e lacca di robbia", "nero d'avorio e giallo di napoli", "ceruleo e arancio bruciato", "magenta quinacridone e verde ftalocianina"];

const paintingTechniques_it = ["impasto", "velatura", "sfregamento", "alla prima", "sfumato", "chiaroscuro", "tenebrismo", "puntinismo", "colore spezzato", "bagnato su bagnato", "bagnato su asciutto", "pennello asciutto", "spatola", "pittura a dita", "graffito", "frottage", "decalcomania", "sgocciolamento", "colatura", "spruzzatura", "sfumatura", "stratificazione", "tratteggio incrociato", "punteggiatura", "lavaggio", "gradiente", "sfumatura", "blocchi di colore", "geometrica", "organica", "gestuale", "controllata", "libera", "serrata", "dettagliata", "grezza", "liscia", "texturizzata", "piatta", "dimensionale", "prospettiva atmosferica", "prospettiva lineare"];

const paintingMoods_it = ["malinconica", "gioiosa", "misteriosa", "minacciosa", "serena", "turbolenta", "contemplativa", "appassionata", "capricciosa", "drammatica", "romantica", "eterea", "ossessionante", "edificante", "cupa", "nostalgica", "futuristica", "onirica", "incubo", "pacifica", "caotica", "armoniosa", "discordante", "intensa", "sottile", "audace", "delicata", "potente", "fragile", "senza tempo", "fugace", "eterna", "momentanea", "infinita", "intima", "grandiosa", "umile", "maestosa", "giocosa", "seria", "spensierata", "pesante", "aerea", "radicata", "fluttuante", "ancorata", "libera", "confinata", "espansiva", "claustrofobica"];

const paintingCompositions_it = ["centrata", "decentrata", "regola dei terzi", "sezione aurea", "simmetrica", "asimmetrica", "bilanciata", "sbilanciata", "diagonale", "verticale", "orizzontale", "triangolare", "circolare", "spirale", "radiante", "convergente", "divergente", "stratificata", "piatta", "profonda", "superficiale", "primo piano dominante", "sfondo dominante", "focus medio piano", "punti focali multipli", "punto focale singolo", "nessun punto focale", "sparsa", "raggruppata", "lineare", "curva", "angolare", "organica", "geometrica", "fratturata", "unificata", "frammentata", "intera", "parziale", "completa", "incompleta", "aperta", "chiusa", "fluente", "statica", "dinamica", "ferma", "in movimento", "congelata", "fluida"];

const weirdPaintingElements_it = ["occhi fluttuanti", "orologi che si sciolgono", "geometria impossibile", "oggetti che sfidano la gravità", "volti che si trasformano", "figure trasparenti", "prospettive multiple", "proporzioni distorte", "architettura vivente", "paesaggi senzienti", "colori che sanguinano", "realtà fratturata", "mondi specchio", "spazi rovesciati", "loop temporali", "fratture dimensionali", "creature d'ombra", "esseri di luce", "crescite cristalline", "macchinari organici", "piante meccaniche", "creature ibride", "forme mutaforma", "pattern ricorsivi", "corridoi infiniti", "muri che respirano", "pietre che cantano", "mobili danzanti", "statue piangenti", "alberi ridenti", "silenzio urlante", "musica visibile", "colori udibili", "pensieri tangibili", "emozioni commestibili", "fuoco liquido", "aria solida", "fulmine congelato", "pietra fluente", "vernice vivente", "vita dipinta"];

const abstractConcepts_it = ["spostamento temporale", "risonanza emotiva", "energia psichica", "trascendenza spirituale", "angoscia esistenziale", "coscienza cosmica", "entanglement quantistico", "dimensioni parallele", "inconscio collettivo", "simboli archetipici", "caos primordiale", "armonia universale", "ricorsione infinita", "eterno ritorno", "metamorfosi", "trasmutazione", "sublimazione", "disintegrazione", "ricostruzione", "frammentazione", "unificazione", "separazione", "connessione", "isolamento", "comunione", "alienazione", "appartenenza", "esilio", "ritorno a casa", "partenza", "arrivo", "transizione", "soglia", "confine", "limite", "infinito", "vuoto", "pienezza", "vuotezza", "presenza", "assenza", "essere", "divenire", "cessare", "iniziare", "finire", "continuazione", "interruzione", "flusso", "stagnazione"];

const paintingDescriptionPatterns_it = [
    "Una {subject} {style} resa in {colors} usando la tecnica {technique}. La composizione {composition} crea un'atmosfera {mood}.",
    "Questa pittura {colors} raffigura una {subject} con pennellate {technique}. L'approccio {style} enfatizza {abstractConcept} attraverso un arrangiamento {composition}.",
    "Un'opera {mood} e {style} che mostra una {subject}. L'artista ha impiegato {technique} con {colors} per ottenere un effetto {composition} caratterizzato da {weirdElement}.",
    "La tela presenta una {subject} in maniera {style}, utilizzando {colors} e {technique}. La qualità {mood} è accentuata dalla struttura {composition} e da {weirdElement}.",
    "Uno studio {technique} di una {subject} eseguito nella tradizione {style}. La palette {colors} e il design {composition} evocano un'atmosfera {mood} incorporando {abstractConcept}.",
    "Questo pezzo sperimentale combina una {subject} con {weirdElement}, reso attraverso {technique} in {colors}. L'interpretazione {style} crea tensione {mood} tramite dinamiche {composition}.",
    "Un'esplorazione di {abstractConcept} attraverso una {subject}, dipinta con {technique} usando {colors}. L'esecuzione {style} e il flusso {composition} generano risonanza {mood}."
];
// Extract link ID from event name (format: "link-X" where X is the identifier)
function extractLinkId(eventId) {
    const event = $dataMap.events[eventId];
    if (!event || !event.name) return null;

    // Match event names like "link-1", "link-test", "link-paint1", etc.
    const match = event.name.match(/^link-(.+)$/i);
    return match ? match[1].toLowerCase() : null;
}

// Find the first event in the current map with the given link ID
function findFirstEventWithLinkId(linkId) {
    if (!linkId) return null;

    // Search for the first event with a matching link name
    for (let i = 1; i < $dataMap.events.length; i++) {
        if ($dataMap.events[i] && extractLinkId(i) === linkId) {
            return i;
        }
    }
    return null;
}

// Find the first event on the current map that shares the same note text
function findFirstEventWithSameNote(currentEventId) {
    const event = $dataMap.events[currentEventId];
    if (!event || !event.note || event.note.trim() === '') return currentEventId;

    const targetNote = event.note.trim();
    for (let i = 1; i < $dataMap.events.length; i++) {
        const e = $dataMap.events[i];
        if (e && e.note && e.note.trim() === targetNote) {
            return i; // first event with the same note wins
        }
    }
    return currentEventId;
}

// Get the seed source event ID (either current event or first linked event)
function getSeedSourceEventId(currentEventId) {
    // Priority 1: explicit link-name system ("link-X" event name)
    const linkId = extractLinkId(currentEventId);
    if (linkId) {
        const firstEventId = findFirstEventWithLinkId(linkId);
        return firstEventId || currentEventId;
    }
    // Priority 2: matching event note — use the first event that has the same note
    return findFirstEventWithSameNote(currentEventId);
}

// === Modified Seeded RNG Function ===
// Replace the existing createSeededRNG function with this version
function createSeededRNG(eventId = null) {
    const mapId = $gameMap.mapId();
    
    // Use event-based seeding if eventId is provided
    if (eventId !== null) {
        const sourceEventId = getSeedSourceEventId(eventId);
        const sourceEvent = $dataMap.events[sourceEventId];
        
        if (sourceEvent) {
            const x = sourceEvent.x;
            const y = sourceEvent.y;
            const name = $gameParty.leader().name || "";
            const initial = name.length ? (name.charCodeAt(0) - 64) : 0;
            
            // Use source event's position for consistent seeding across linked events
            let seed = (mapId * 73856093) ^ (x * 19349663) ^ (y * 83492791) ^ initial ^ sourceEventId;
            seed = seed >>> 0;
            
            return (function(a) {
                return function() {
                    var t = a += 0x6D2B79F5;
                    t = Math.imul(t ^ (t >>> 15), t | 1);
                    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
                    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
                };
            })(seed);
        }
    }
    
    // Fallback to player-based seeding (original behavior)
    const x = $gamePlayer.x;
    const y = $gamePlayer.y;
    const name = $gameParty.leader().name || "";
    const initial = name.length ? (name.charCodeAt(0) - 64) : 0;
    let seed = (mapId * 73856093) ^ (x * 19349663) ^ (y * 83492791) ^ initial;
    seed = seed >>> 0;
    
    return (function(a) {
        return function() {
            var t = a += 0x6D2B79F5;
            t = Math.imul(t ^ (t >>> 15), t | 1);
            t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
            return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
        };
    })(seed);
}


    // Core function to display a random book with seeded randomness and wrapped text
    function displayRandomBook(eventId = null) {
        const random = createSeededRNG(eventId);
        const title = generateTitle(random);
        const author = generateAuthor(random);
        let description = generateDescription(random);
        description = wrapText(description, 40);
        
        window.skipLocalization = true;
        const messageText = "\\C[4]\"" + title + "\"\\C[0]\nby \\C[3]" + author + "\\C[0]\n" + description;
        $gameMessage.add(messageText);
        window.skipLocalization = false;
    }

    // Core function to display a statue description with seeded randomness
    function displayStatueDescription(customSubject = "", eventId = null) {
        const random = createSeededRNG(eventId);
        let description = generateStatueDescription(random, customSubject);
        description = wrapText(description, 40);
        
        window.skipLocalization = true;
        const messageText = "\\C[6]" + description + "\\C[0]";
        $gameMessage.add(messageText);
        window.skipLocalization = false;
    }
    
// Core function to display a painting description with seeded randomness
function displayPaintingDescription(customSubject = "", eventId = null) {
    const random = createSeededRNG(eventId);
    let description = generatePaintingDescription(random, customSubject);
    description = wrapText(description, 40);
    
    window.skipLocalization = true;
    const messageText = "\\C[5]" + description + "\\C[0]";
    $gameMessage.add(messageText);
    window.skipLocalization = false;
}

// Generate a deterministic painting description
function generatePaintingDescription(random = Math.random, customSubject = "") {
    const useItalian = ConfigManager.language === "it";

    let pattern = useItalian ?
        paintingDescriptionPatterns_it[Math.floor(random() * paintingDescriptionPatterns_it.length)] :
        paintingDescriptionPatterns[Math.floor(random() * paintingDescriptionPatterns.length)];

    const subjects = useItalian ? paintingSubjects_it : paintingSubjects;
    const styles = useItalian ? paintingStyles_it : paintingStyles;
    const colors = useItalian ? paintingColors_it : paintingColors;
    const techniques = useItalian ? paintingTechniques_it : paintingTechniques;
    const moods = useItalian ? paintingMoods_it : paintingMoods;
    const compositions = useItalian ? paintingCompositions_it : paintingCompositions;
    const weirdElements = useItalian ? weirdPaintingElements_it : weirdPaintingElements;
    const abstractConceptsArray = useItalian ? abstractConcepts_it : abstractConcepts;

    const map = {
        subject: customSubject || subjects[Math.floor(random() * subjects.length)],
        style: styles[Math.floor(random() * styles.length)],
        colors: colors[Math.floor(random() * colors.length)],
        technique: techniques[Math.floor(random() * techniques.length)],
        mood: moods[Math.floor(random() * moods.length)],
        composition: compositions[Math.floor(random() * compositions.length)],
        weirdElement: weirdElements[Math.floor(random() * weirdElements.length)],
        abstractConcept: abstractConceptsArray[Math.floor(random() * abstractConceptsArray.length)]
    };

    return pattern.replace(/\{(\w+)\}/g, (_, key) => {
        return map[key] || "";
    });
}
    // Generate a deterministic title
    function generateTitle(random = Math.random) {
        const useItalian = ConfigManager.language === "it";
        const prefixes = useItalian ? titlePrefixes_it : titlePrefixes;
        const adjectives = useItalian ? titleAdjectives_it : titleAdjectives;
        const nouns = useItalian ? titleNouns_it : titleNouns;
        const connectors = useItalian ? titleConnectors_it : titleConnectors;
        const subjects = useItalian ? titleSubjects_it : titleSubjects;

        const choice = Math.floor(random() * 6);
        switch (choice) {
            case 0:
                return prefixes[Math.floor(random() * prefixes.length)] + " " +
                       adjectives[Math.floor(random() * adjectives.length)] + " " +
                       nouns[Math.floor(random() * nouns.length)];
            case 1:
                return prefixes[Math.floor(random() * prefixes.length)] + " " +
                       nouns[Math.floor(random() * nouns.length)] + " " +
                       connectors[Math.floor(random() * connectors.length)] + " " +
                       nouns[Math.floor(random() * nouns.length)];
            case 2:
                return subjects[Math.floor(random() * subjects.length)] + " " +
                       connectors[Math.floor(random() * connectors.length)] + " " +
                       prefixes[Math.floor(random() * prefixes.length)] + " " +
                       nouns[Math.floor(random() * nouns.length)];
            case 3:
                return adjectives[Math.floor(random() * adjectives.length)] + " " +
                       nouns[Math.floor(random() * nouns.length)];
            case 4:
                return adjectives[Math.floor(random() * adjectives.length)] + " " +
                       nouns[Math.floor(random() * nouns.length)] + " " +
                       connectors[Math.floor(random() * connectors.length)] + " " +
                       prefixes[Math.floor(random() * prefixes.length)] + " " +
                       adjectives[Math.floor(random() * adjectives.length)] + " " +
                       nouns[Math.floor(random() * nouns.length)];
            case 5:
                return prefixes[Math.floor(random() * prefixes.length)] + " " +
                       subjects[Math.floor(random() * subjects.length)] + "'s " +
                       nouns[Math.floor(random() * nouns.length)];
            default:
                return useItalian ? "Senza titolo" : "Untitled";
        }
    }

    // Generate a deterministic author
    function generateAuthor(random = Math.random) {
        const useItalian = ConfigManager.language === "it";
        const fNames = useItalian ? firstNames_it : firstNames;
        const lNames = useItalian ? lastNames_it : lastNames;
        const particles = useItalian ? titleParticles_it : titleParticles;

        const firstName  = fNames[Math.floor(random() * fNames.length)];
        const lastName   = lNames[Math.floor(random() * lNames.length)];
        const midInit    = middleInitials[Math.floor(random() * middleInitials.length)];
        const particle   = particles[Math.floor(random() * particles.length)];
        
        const format = Math.floor(random() * 7);
        const pseudonyms = useItalian ? ["Mistero", "Fenice", "Enigma"] : ["Mystery", "Phoenix", "Enigma"];
        const nicknames = useItalian ? ["Doc", "Ombra", "Falco"] : ["Doc","Shadow","Hawk"];

        switch (format) {
            case 0: return `${firstName} ${lastName}`;
            case 1: return `${firstName} ${midInit}. ${lastName}`;
            case 2:
                const mid2 = middleInitials[Math.floor(random() * middleInitials.length)];
                return `${firstName} ${midInit}. ${mid2}. ${lastName}`;
            case 3:
                const nick = nicknames[Math.floor(random() * 3)];
                return `${firstName} '${nick}' ${lastName}`;
            case 4: return `${firstName} ${particle} ${lastName}`;
            case 5: return pseudonyms[Math.floor(random() * pseudonyms.length)];
            case 6:
                const p1 = pseudonyms[Math.floor(random() * pseudonyms.length)];
                const p2 = pseudonyms[Math.floor(random() * pseudonyms.length)];
                return `${p1} ${p2}`;
            default: return `${firstName} ${lastName}`;
        }
    }

    // Generate a deterministic description
    function generateDescription(random = Math.random) {
        const useItalian = ConfigManager.language === "it";

        let pattern = useItalian ?
            descriptionPatterns_it[Math.floor(random() * descriptionPatterns_it.length)] :
            descriptionPatterns[Math.floor(random() * descriptionPatterns.length)];
        
        const map = {
            character: useItalian ? characters_it : characters,
            object: useItalian ? objects_it : objects,
            location: useItalian ? locations_it : locations,
            event: useItalian ? events_it : events,
            secret: useItalian ? secrets_it : secrets,
            theme: useItalian ? themes_it : themes,
            concept: useItalian ? concepts_it : concepts,
            adversity: useItalian ? adversities_it : adversities,
            consequence: useItalian ? consequences_it : consequences,
            sacrifice: useItalian ? sacrifices_it : sacrifices,
            genre: useItalian ? genres_it : genres,
            adjective: useItalian ? adjectives_it : adjectives
        };

        return pattern.replace(/\{(\w+)\}/g, (_, key) => {
            const arr = map[key];
            return arr[Math.floor(random() * arr.length)];
        });
    }

    // Generate a deterministic statue description
    function generateStatueDescription(random = Math.random, customSubject = "") {
        const useItalian = ConfigManager.language === "it";

        let pattern = useItalian ?
            statueDescriptionPatterns_it[Math.floor(random() * statueDescriptionPatterns_it.length)] :
            statueDescriptionPatterns[Math.floor(random() * statueDescriptionPatterns.length)];

        const subjects = useItalian ? statueSubjects_it : statueSubjects;
        const materials = useItalian ? statueMaterials_it : statueMaterials;
        const adjectives = useItalian ? statueAdjectives_it : statueAdjectives;
        const poses = useItalian ? statuePoses_it : statuePoses;
        const features = useItalian ? statueFeatures_it : statueFeatures;
        const locations = useItalian ? statueLocations_it : statueLocations;
        const conditions = useItalian ? statueConditions_it : statueConditions;
        const histories = useItalian ? statueHistories_it : statueHistories;

        const map = {
            subject: customSubject || subjects[Math.floor(random() * subjects.length)],
            material: materials[Math.floor(random() * materials.length)],
            adjective: adjectives[Math.floor(random() * adjectives.length)],
            pose: poses[Math.floor(random() * poses.length)],
            feature: features[Math.floor(random() * features.length)],
            location: locations[Math.floor(random() * locations.length)],
            condition: conditions[Math.floor(random() * conditions.length)],
            history: histories[Math.floor(random() * histories.length)]
        };

        return pattern.replace(/\{(\w+)\}/g, (_, key) => {
            return map[key] || "";
        });
    }
    // ============================================================
    // === FOSSIL RESOURCES (ENGLISH) ===
    // ============================================================

    // --- Amber ---
    const amberInsects    = ["a perfectly preserved fly", "a iridescent beetle", "an ant carrying a seed", "a spider mid-molt", "a scorpion with raised tail", "a mosquito with intact proboscis", "a termite queen", "a honeybee", "a parasitic wasp", "a dragonfly nymph", "a fungus gnat", "a bark louse", "a lacewing larva", "a flea with visible legs", "a stonefly", "a mite clutching a hair", "a mayfly in final instar", "a thrips colony", "a cockroach nymph", "a bookworm"];
    const amberPlant      = ["a leaf fragment with visible venation", "a piece of ancient bark", "a seed capsule", "a pollen grain cluster", "a fungal spore body", "a flower petal with intact cells", "root hairs still attached to soil", "a wood chip with tracheid structure", "a resin bubble frozen mid-flow", "a moss fragment", "a conifer needle", "a fern frond tip", "a piece of charred wood", "tree bark with fungal channels"];
    const amberVertebrate = ["a gecko toe pad", "a lizard scale patch", "a feather with barb detail", "a mammal hair with follicle", "a snake scale", "a fragment of frog limb", "a bird feather with intact rachis", "a chameleon claw", "a small lizard tail tip", "a skink scale segment"];
    const amberRare       = ["a colony of ancient bacteria", "a bubble of prehistoric atmosphere", "a parasitic nematode", "a microscopic protist", "two insects locked in combat", "a spider web strand", "a blood-engorged mite", "a silk cocoon fragment", "a mushroom cap", "a droplet of ancient water"];
    const amberColors     = ["golden", "honey-yellow", "deep orange-red", "pale citrine", "cognac", "greenish-tinted", "milky-white", "dark cherry", "reddish-brown", "transparent amber"];
    const amberOrigins    = ["Baltic (Eocene, ~44 Ma)", "Burmese (Cretaceous, ~99 Ma)", "Dominican (Miocene, ~20 Ma)", "Lebanese (Cretaceous, ~130 Ma)", "Canadian (Cretaceous, ~78 Ma)", "Siberian (Triassic, ~230 Ma)", "Arkansas (Cretaceous, ~100 Ma)", "New Jersey (Cretaceous, ~90 Ma)"];
    const amberSizes      = ["thumbnail-sized", "fist-sized", "golf-ball-sized", "a small nodule", "a large pendant-shaped piece", "a flattened disc", "an elongated teardrop", "a rough cubic chunk"];
    const amberPreservation = ["pristine and fully transparent", "partially clouded by inclusions", "fractured but with intact inclusion chamber", "showing dendritic flow patterns", "slightly yellowed on the surface", "exhibiting blue fluorescence under UV", "with internal crazing from age stress", "polished to reveal internal detail"];
    const amberDetails    = ["The cellular structure of the inclusion is intact at microscopic scale.", "Air bubbles adjacent to the specimen suggest rapid resin flow burial.", "The inclusion shows signs of struggling before entombment.", "Isotope analysis places formation during a warm interglacial period.", "A secondary inclusion of plant matter nearby suggests forest floor origin.", "The resin chemistry indicates a now-extinct conifer family.", "Micro-CT scanning would reveal additional hidden structures.", "The preservation quality is rated museum-grade by specialists."];

    const amberDescriptionPatterns = [
        "A {color} piece of {origin} amber, {size}, containing {inclusion}. The specimen is {preservation}. {detail}",
        "This {size} {origin} amber specimen contains {inclusion}, preserved in {color} resin. The piece is {preservation}. {detail}",
        "Encased in {color} {origin} amber ({size}), {inclusion} has been frozen in time. The specimen is {preservation}. {detail}",
        "A remarkable {origin} amber ({color}, {size}) preserves {inclusion}. Found {preservation}, this specimen is exceptional. {detail}"
    ];

    // --- Dinosaur bones ---
    const dinoSpecies     = ["Tyrannosaurus rex", "Triceratops horridus", "Brachiosaurus altithorax", "Velociraptor mongoliensis", "Stegosaurus stenops", "Ankylosaurus magniventris", "Pteranodon longiceps", "Diplodocus carnegii", "Allosaurus fragilis", "Iguanodon bernissartensis", "Spinosaurus aegyptiacus", "Parasaurolophus walkeri", "Pachycephalosaurus wyomingensis", "Gallimimus bullatus", "Carnotaurus sastrei", "Dilophosaurus wetherilli", "Deinonychus antirrhopus", "Ceratosaurus nasicornis", "Edmontosaurus regalis", "Therizinosaurus cheloniformis", "Quetzalcoatlus northropi", "Mosasaurus hoffmannii", "Elasmosaurus platyurus", "Archeopteryx lithographica", "Maiasaura peeblesorum"];
    const dinoBoneParts   = ["femur", "skull fragment", "rib section", "caudal vertebra", "recurved claw", "serrated tooth", "scapula", "pelvic girdle fragment", "jaw bone", "cranial dome", "forelimb", "tibiotarsus", "metatarsal", "radius", "cervical vertebra", "dorsal spine", "chevron bone", "ilium", "pubis", "coracoid"];
    const dinoPeriods     = ["Late Jurassic (~150 Ma)", "Early Cretaceous (~130 Ma)", "Late Cretaceous (~66 Ma)", "Middle Jurassic (~165 Ma)", "Early Triassic (~245 Ma)", "Late Triassic (~210 Ma)"];
    const dinoMatrix      = ["red sandstone", "grey mudstone", "yellow limestone", "black shale", "calcite-rich siltstone", "volcanic tuff", "river channel conglomerate", "floodplain mudstone"];
    const dinoPreservation = ["permineralized", "fully mineralized", "partially articulated", "isolated element", "still in matrix", "recently prepared", "showing original bone texture", "exhibiting Haversian canal structure", "with attached matrix on one surface", "with visible pathological remodeling"];
    const dinoSizes       = ["22 cm in length", "38 cm across", "over half a metre long", "approximately 80 cm", "15 cm at its widest", "fragmented but spanning 40 cm when reconstructed", "intact at 55 cm", "the size of a human forearm"];
    const dinoDetails     = ["Growth rings in cross-section suggest a subadult individual.", "Bite marks on the cortical surface indicate scavenging post-mortem.", "The bone density is consistent with an active, warm-blooded metabolism.", "Attached bony callus indicates a healed fracture sustained during life.", "Histological analysis reveals rapid growth rate typical of the clade.", "The black coloration is from manganese infiltration during fossilization.", "Microscopic analysis found traces of original collagen protein.", "Comparison with known specimens suggests a new regional variant."];

    const dinoDescriptionPatterns = [
        "A {preservation} {bone} of {species} from the {period}. Found in {matrix} matrix, the specimen measures {size}. {detail}",
        "This {bone} of {species} ({period}) is {preservation}, embedded in {matrix}. It measures {size}. {detail}",
        "Recovered from {matrix} deposits ({period}), this {preservation} {bone} is attributed to {species}. The element is {size}. {detail}",
        "A {size} {preservation} {bone}, assigned to {species} based on morphology. The {period} specimen was found in {matrix}. {detail}"
    ];

    // --- Weird creatures ---
    const weirdCreatureTypes = [
        "a coiled ammonite with iridescent nacreous shell", "a complete trilobite with compound eyes preserved", "a sea scorpion (eurypterid) in full articulation",
        "a giant dragonfly (Meganeura) with wing venation intact", "an anomalocaris with grasping appendages visible", "a Cambrian Hallucigenia, spines and tentacles preserved",
        "a Tully monster (Tullimonstrum) — classification still debated", "a mosasaur skull with recurved teeth", "a plesiosaur neck section with gastroliths",
        "an ichthyosaur giving birth, mother and offspring preserved", "a mammoth molar the size of a dinner plate", "a giant ground sloth claw, still partially sheathed",
        "a terror bird (Phorusrhacid) skull with hooked beak", "a Helicoprion jaw whorl — a spiral of shark teeth",
        "a coelacanth lobe-fin, almost identical to living specimens", "an Opabinia with five eyes and a frontal nozzle",
        "a Wiwaxia covered in sclerite armour", "a giant sea lily (crinoid) crown section", "a horseshoe crab trail ending abruptly — the crab above, fossilized mid-walk",
        "a nautiloid with visible siphuncle and chamber walls", "a Dickinsonia, flat and radially symmetrical — possibly the earliest animal",
        "a Charnia frond, Ediacaran in age and of uncertain biology", "a cluster of orthocone nautiloids in predatory pile-up",
        "a Pikaia — possibly the earliest known chordate", "a petrified egg clutch of unknown species"
    ];
    const weirdAges        = ["Ediacaran (~560 Ma)", "Cambrian (~510 Ma)", "Ordovician (~460 Ma)", "Silurian (~430 Ma)", "Devonian (~375 Ma)", "Carboniferous (~310 Ma)", "Permian (~270 Ma)", "Triassic (~220 Ma)", "Jurassic (~155 Ma)", "Cretaceous (~90 Ma)", "Paleocene (~60 Ma)", "Eocene (~45 Ma)", "Oligocene (~30 Ma)", "Miocene (~15 Ma)", "Pleistocene (~500 Ka)"];
    const weirdMatrix      = ["black chert", "fine-grained limestone", "Burgess Shale-type mudstone", "phosphatic nodule", "silicified limestone", "bituminous shale", "ironstone concretion", "volcanic ash layer", "calcareous marl", "grey mudstone"];
    const weirdPreservation = ["three-dimensionally preserved", "preserved as a carbon film", "preserved via pyritization", "silicified to fine detail", "preserved inside a calcareous concretion", "partially compressed but legible", "cast in iron oxide", "with soft tissue outline visible", "remarkably complete", "articulated — likely buried alive"];
    const weirdDetails     = ["No living relatives are known — the lineage is entirely extinct.", "The taxonomy of this specimen remains contested among specialists.", "Micro-CT scanning revealed internal organs still in anatomical position.", "The specimen represents the oldest known record of this body plan.", "Similar specimens have only been found on one other continent.", "Its mode of feeding is inferred from gut contents still preserved.", "The creature's bilateral symmetry was not recognized for decades after discovery.", "This specimen was initially misidentified as a plant before re-examination.", "The preservation mechanism that created this fossil is still poorly understood.", "It exhibits features shared with multiple modern phyla simultaneously."];

    const weirdDescriptionPatterns = [
        "Embedded in {matrix} ({age}), {creature} is {preservation}. {detail}",
        "This {preservation} specimen from {matrix} ({age}) shows {creature}. {detail}",
        "From {matrix} deposits of {age}, {creature} — {preservation}. {detail}",
        "A {preservation} fossil in {matrix} ({age}): {creature}. {detail}"
    ];

    // --- Italian translations ---
    const amberInsects_it    = ["una mosca perfettamente conservata", "uno scarabeo iridescente", "una formica che trasporta un seme", "un ragno in muta", "uno scorpione con la coda alzata", "una zanzara con proboscide intatta", "una regina termite", "un'ape mellifera", "una vespa parassita", "una ninfa di libellula", "un moscerino dei funghi", "un pidocchio della corteccia", "una larva di crisopa", "una pulce con le zampe visibili", "una mosca di pietra", "un acaro aggrappato a un pelo", "una efemera nell'ultimo stadio", "una colonia di tripidi", "una ninfa di scarafaggio", "un tarligno"];
    const amberPlant_it      = ["un frammento di foglia con venatura visibile", "un pezzo di corteccia antica", "una capsula di semi", "un grappolo di granuli di polline", "un corpo di spora fungina", "un petalo di fiore con cellule intatte", "radici capillari ancora attaccate al suolo", "un truciolo di legno con struttura tracheide", "una bolla di resina congelata in scorrimento", "un frammento di muschio", "un ago di conifera", "la punta di una fronda di felce", "un pezzo di legno carbonizzato", "corteccia d'albero con canali fungini"];
    const amberColors_it     = ["dorata", "giallo miele", "arancio-rossa profonda", "citrino pallido", "cognac", "con sfumatura verdastra", "bianco latte", "color ciliegia scuro", "marrone rossastro", "ambra trasparente"];
    const amberOrigins_it    = ["baltico (Eocene, ~44 Ma)", "birmano (Cretaceo, ~99 Ma)", "dominicano (Miocene, ~20 Ma)", "libanese (Cretaceo, ~130 Ma)", "canadese (Cretaceo, ~78 Ma)", "siberiano (Triassico, ~230 Ma)", "dell'Arkansas (Cretaceo, ~100 Ma)", "del New Jersey (Cretaceo, ~90 Ma)"];
    const amberPreservation_it = ["perfettamente trasparente", "parzialmente opacizzata da inclusioni", "fratturata ma con camera di inclusione intatta", "con motivi di flusso dendritico", "leggermente ingiallita in superficie", "con fluorescenza blu sotto luce UV", "con screpolature interne da stress", "lucidata per rivelare il dettaglio interno"];
    const dinoSpecies_it     = dinoSpecies; // species names are Latin — same in Italian
    const dinoBoneParts_it   = ["femore", "frammento di cranio", "sezione di costola", "vertebra caudale", "artiglio ricurvo", "dente seghettato", "scapola", "frammento del cinto pelvico", "mandibola", "cupola cranica", "arto anteriore", "tibiotarso", "metatarso", "radio", "vertebra cervicale", "spina dorsale", "osso chevron", "ileo", "pube", "coracoide"];
    const dinoPeriods_it     = ["Giurassico Superiore (~150 Ma)", "Cretaceo Inferiore (~130 Ma)", "Cretaceo Superiore (~66 Ma)", "Giurassico Medio (~165 Ma)", "Triassico Inferiore (~245 Ma)", "Triassico Superiore (~210 Ma)"];
    const dinoMatrix_it      = ["arenaria rossa", "fangite grigia", "calcare giallo", "scisto nero", "siltite ricca di calcite", "tufo vulcanico", "conglomerato di canale fluviale", "fangite di pianura alluvionale"];
    const dinoPreservation_it = ["permineralizzato", "completamente mineralizzato", "parzialmente articolato", "elemento isolato", "ancora nella matrice", "di recente preparazione", "con texture ossea originale", "con struttura dei canali di Havers", "con matrice su una superficie", "con rimodellamento patologico visibile"];
    const weirdCreatureTypes_it = [
        "un'ammonite avvolta con guscio madreperlaceo iridescente", "un trilobite completo con occhi composti conservati", "uno scorpione di mare (euriptero) in piena articolazione",
        "una libellula gigante (Meganeura) con venatura alare intatta", "un anomalocaris con appendici prensili visibili", "una Hallucigenia cambriana con spine e tentacoli conservati",
        "un Tully monster (Tullimonstrum) — classificazione ancora dibattuta", "un cranio di mosasauro con denti ricurvi", "una sezione del collo di plesiosauro con gastroliti",
        "un ittiosauro che partorisce, madre e prole conservati", "un molare di mammut grande quanto un piatto", "un artiglio di bradipo gigante ancora parzialmente guainato",
        "un cranio di uccello del terrore (Foruscrachide) con becco adunco", "una spirale mascellare di Helicoprion — spirale di denti di squalo",
        "una pinna lobata di celacanto, quasi identica agli esemplari viventi", "una Opabinia con cinque occhi e ugello frontale",
        "una Wiwaxia ricoperta di armatura sclerite", "una sezione della corona di un giglio di mare (crinoide)", "la pista di un granchio ferrato che si interrompe bruscamente — il granchio sopra, fossilizzato a metà cammino",
        "un nautiloide con sifone e pareti delle camere visibili", "una Dickinsonia, piatta e radialmente simmetrica — forse il primo animale",
        "una fronda di Charnia, ediacariana e di biologia incerta", "un ammasso di nautiloidi ortoconi in pila predatoria",
        "una Pikaia — forse il più antico cordato conosciuto", "un nido di uova pietrificate di specie sconosciuta"
    ];
    const weirdMatrix_it      = ["diaspro nero", "calcare a grana fine", "fangite tipo Burgess Shale", "nodulo fosfatico", "calcare silicizzato", "scisto bituminoso", "concrezione di siderite", "strato di cenere vulcanica", "marna calcarea", "fangite grigia"];
    const weirdPreservation_it = ["conservato tridimensionalmente", "conservato come film di carbonio", "conservato per piritizzazione", "silicizzato nel dettaglio", "conservato in una concrezione calcarea", "parzialmente compresso ma leggibile", "impresso in ossido di ferro", "con contorno di tessuto molle visibile", "notevolmente completo", "articolato — probabilmente sepolto vivo"];

    function generateFossilDescription(random, fossilType) {
        const useItalian = typeof ConfigManager !== 'undefined' && ConfigManager.language === 'it';
        const types = ['amber', 'dinosaur', 'weird'];
        const type = fossilType && types.includes(fossilType) ? fossilType : types[Math.floor(random() * types.length)];

        function pick(arr) { return arr[Math.floor(random() * arr.length)]; }

        if (type === 'amber') {
            const allInclusions = [
                ...(useItalian ? amberInsects_it : amberInsects),
                ...(useItalian ? amberPlant_it   : amberPlant),
            ];
            if (random() < 0.15) allInclusions.push(...amberRare);
            if (random() < 0.10) allInclusions.push(...amberVertebrate);
            const pattern = pick(amberDescriptionPatterns);
            return pattern
                .replace('{color',    (useItalian ? amberColors_it   : amberColors)   .find((_, i) => i === Math.floor(random() * (useItalian ? amberColors_it : amberColors).length)) || pick(amberColors))
                .replace('{color}',   pick(useItalian ? amberColors_it   : amberColors))
                .replace('{origin}',  pick(useItalian ? amberOrigins_it  : amberOrigins))
                .replace('{size}',    pick(amberSizes))
                .replace('{inclusion}', pick(allInclusions))
                .replace('{preservation}', pick(useItalian ? amberPreservation_it : amberPreservation))
                .replace('{detail}',  pick(amberDetails));
        }

        if (type === 'dinosaur') {
            const pattern = pick(dinoDescriptionPatterns);
            return pattern
                .replace('{preservation}', pick(useItalian ? dinoPreservation_it : dinoPreservation))
                .replace('{bone}',    pick(useItalian ? dinoBoneParts_it : dinoBoneParts))
                .replace('{species}', pick(dinoSpecies))
                .replace('{period}',  pick(useItalian ? dinoPeriods_it  : dinoPeriods))
                .replace('{matrix}',  pick(useItalian ? dinoMatrix_it   : dinoMatrix))
                .replace('{size}',    pick(dinoSizes))
                .replace('{detail}',  pick(dinoDetails));
        }

        // weird
        const pattern = pick(weirdDescriptionPatterns);
        return pattern
            .replace('{matrix}',    pick(useItalian ? weirdMatrix_it      : weirdMatrix))
            .replace('{age}',       pick(weirdAges))
            .replace('{creature}',  pick(useItalian ? weirdCreatureTypes_it : weirdCreatureTypes))
            .replace('{preservation}', pick(useItalian ? weirdPreservation_it : weirdPreservation))
            .replace('{detail}',    pick(weirdDetails));
    }

    function displayFossilDescription(fossilType, eventId) {
        const random = createSeededRNG(eventId);
        const text   = generateFossilDescription(random, fossilType);
        window.skipLocalization = true;
        $gameMessage.add('\\C[6][ FOSSIL SPECIMEN ]\\C[0]');
        $gameMessage.add(text);
        window.skipLocalization = false;
    }

    // Plugin command handlers
    PluginManager.registerCommand(pluginName, "ShowRandomBook", args => {
        const eventId = $gameMap._interpreter ? $gameMap._interpreter._eventId : null;
        displayRandomBook(eventId);
    });
    

    PluginManager.registerCommand(pluginName, "ShowStatueDescription", args => {
        const subject = args.subject || "";
        const eventId = $gameMap._interpreter ? $gameMap._interpreter._eventId : null;
        displayStatueDescription(subject, eventId);
    });
    
    PluginManager.registerCommand(pluginName, "ShowPaintingDescription", args => {
        const subject = args.subject || "";
        const eventId = $gameMap._interpreter ? $gameMap._interpreter._eventId : null;
        displayPaintingDescription(subject, eventId);
    });

    PluginManager.registerCommand(pluginName, "ShowFossilDescription", args => {
        const type    = (args.type || "").toLowerCase().trim();
        const eventId = $gameMap._interpreter ? $gameMap._interpreter._eventId : null;
        displayFossilDescription(type, eventId);
    });

})();
/*:
 * @target MZ
 * @plugindesc Random TV Transmission Generator v2.0 - Generates strange TV broadcasts mixing em.Path lore with Y2K culture
 * @author Omni-Lex
 * @help This plugin creates TV transmissions with multiple message boxes.
 * Each transmission is deterministic based on map location and player name.
 *
 * To set the language to Italian, use the 'Script' event command and enter:
 * ConfigManager.language = "it";
 *
 * Plugin Commands:
 * ShowTVTransmission - Shows a random TV transmission with multiple message boxes
 *
 * @command ShowTVTransmission
 * @desc Display a random TV transmission
 * @arg maxMessages
 * @text Max Messages
 * @desc Maximum number of message boxes (1-8)
 * @type number
 * @min 1
 * @max 8
 * @default 3
 */

(() => {
    const pluginName = "RandomTVTransmissionGenerator";


    // ==================================
    // === ENGLISH TV CONTENT ===
    // ==================================

    const tvChannels_en = [
        // Surreal
        "Channel Z-999", "Static Vision Network", "Loop TV Eternal", "Chaos Broadcasting Co.", "Dimension 7 Public Access",
        "Temporal News 24/7", "Hypercapitalist Shopping Network", "Archival Access Television", "Truckers' Highway Radio",
        "Mage Guild Public Access", "Anoki Emergency Broadcast", "Road Report Radio FM", "Post-Y2K Survivor's Network",
        "Interdimensional Weather Channel", "Squish Memorial Broadcasting", "The 80 Rule Information Network",
        "FantaBlack Productions Ltd.", "Anoki Nostalgia Network", "Bubble Memory TV", "Fragmented Reality Channel",
        "The Broken Timeline Network", "Retrograde Broadcasting", "Memory Hole Television", "Glitch City Public TV",
        "Paradox News Network", "The Looping Channel", "Dimensional Drift FM", "Chronos Disruption Network",
        // Fantasy Normal
        "Aethelgard National Broadcasting (ANB)", "The Silver City News Network (SCNN)", "The Royal Court Channel", "Kingdom Weather Service",
        "Goblin Ball League Network (GBLN)", "The History of Ages Channel", "Dungeon Decorators TV", "The Adventurer's Network",
        "The Alchemist's Kitchen", "Wyvern Racing Today", "The Bard's Song Channel", "Port Prosperity Public Access"
    ];
    
    const newsAnchors_en = [
        // Surreal
        "Tom Loopsworth", "Jane Dimensional", "Bob Fragmenter", "Sarah Timeline", "Mike Paradox", "Lisa Riftcaster",
        "Dave Glitchton", "Anna Voidwalker", "Chuck Temporis", "Diana Crashcode", "Steve Loopbreak", "Tina Memwipe",
        "Walter Chronicity", "Barbara Driftspace", "Jim Resetson", "Carol Timeshift", "Brad Memoryleak", "Susan Stacktrace",
        "Kevin Nullpointer", "Rachel Segfault", "Tony Bootloop", "Michelle Hardcrash", "Derek Bluescreensky",
        "Amanda Kernelpanic", "Frank Systemerror", "Linda Accessviolation", "Gary Stackoverflow", "Janet Mallocfail",
        // Fantasy Normal
        "Bartholomew Crane", "Eleonora Vance", "Reginald Finch", "Seraphina Marlowe", "Gideon Graves", "Isolde Thorne",
        "Percival Croft", "Genevieve Dubois", "Alistair Finch", "Beatrix Haven", "Julian Blackwood", "Rosalind Payne"
    ];
    
    const commercialProducts_en = [
        // Surreal
        "Anoki 3310 Temporal Stabilizers", "FantaBlack Anti-Magic Paint", "Speed Boost Energy Drinks", "Memory Restoration Pills",
        "Dimensional Rift Sealant", "Y2K Survival Kits", "CamelCase Spell Checkers", "Mental Dam Foil Hats", "Loop-Proof Watches",
        "Hypercapitalist Credit Cards", "Archive Foundation Subscriptions", "Mage Guild Insurance Policies", "Goblin Repellent Spray",
        "Bubble's Cosmic RV Parts", "Em's Memory Fragment Collectors", "Thatcher's Leadership Seminars", "Crowley's Chaos Magic Kits",
        "Esoteric Heavy Industries Catalogs", "Petroleum Demon Detectors", "Schrödinger Bridge Tokens", "Time Rental Vouchers",
        "Reality Anchor Systems", "Truck Stop Coffee Pods", "Interdimensional GPS Units", "Thought Disease Vaccines",
        "Leyline Proximity Meters", "Ritual Component Starter Packs", "Metamagic Enhancement Serums", "Anoki Ringtone Therapy",
        "Y2K Nostalgia Capsules", "Post-Squishing Trauma Counseling", "Linear Time Simulation Software", "Causality Chain Repair Kits",
        // Fantasy Normal
        "Stoutbeard's Famous Ale", "Glimmerwash Laundry Scour", "Iron-Hide Armor Polish", "Scry-Glass Communicators",
        "Elven Waybread Rations", "The Griffin-Claw Sedan", "Everburn Torches", "Swiftstride Courier Service",
        "Gnomish Cogwork Watches", "Crimson Cola", "Dragon's Breath Chili Sauce", "Mage-Light Bulbs", "Rust-Stop for Swords"
    ];
    
    const weatherLocations_en = [
        // Surreal
        "The Road Omnipresent", "Memory Lane District", "Temporal Junction 45", "The Void Between Worlds", "Former Reality Sector 7",
        "The Green Fields Territory", "Archive Foundation Headquarters", "Thatcher's Tower Complex", "The Collision Point",
        "Y2K Ground Zero Memorial", "Beagle City Outskirts", "The Squishing Epicenter", "Loop Prevention Zone Alpha",
        "Dimensional Drift Sector", "Goblin War Territories", "The Anoki Preservation Area", "Crowley's Experimental Zone",
        "Highway 80 Checkpoint", "The Broken Causality District", "Esoteric Industries Testing Grounds", "The Memory Graveyard",
        "Bubble's Last Known Position", "Em's Ritual Island", "The Hypercapitalist Trade Routes", "Petroleum Demon Fields",
        "The Schrödinger Bridge Network", "Temporal Storm Valley", "Reality Anchor Installation Beta", "The Leyline Nexus",
        // Fantasy Normal
        "The City of Silver Spires", "Gloomwood Forest", "The Sunken City of Aeridor", "The Dragon's Tooth Mountains",
        "The Whispering Plains", "Port Everstand", "The Iron Citadel", "The Kingdom of Aethelgard", "The Crystal Coast",
        "The Swamplands of Sorrow", "The Northern Reach", "The Verdant Valley", "The Capital City"
    ];
    
    const celebrities_en = [
        // Surreal
        "Bubble the Cosmic Mechanic", "Em the Memory-Lost Witch", "Margaret Thatcher (Mage Supreme)", "Aleister Crowley (Chaos Lord)",
        "The Anoki Prophet", "Y2K Survivor Jenkins", "The Archive Librarian Supreme", "Hypercapitalist CEO", "The Goblin King",
        "The Petroleum Demon Hunter", "The Reality Anchor Engineer", "The Time Rental Mogul", "The Interdimensional Trucker",
        "The Loop Escape Artist", "The Memory Fragment Collector", "The CamelCase Scholar", "The Thought Disease Researcher",
        // Fantasy Normal
        "Lyrion the Famous Bard", "Sir Kaelan the Dragonslayer", "Master Alchemist Valerius", "Grizelda the Goblin Ball Star",
        "Lady Annelise (Famous Actress)", "Fargrim the Master Blacksmith", "The High Oracle of Delphi", "Lord Valerius (Politician)"
    ];
    
    const gameShows_en = [
        // Surreal
        "Wheel of Temporal Fortune", "Who Wants to Be a Hypercapitalist", "The Price is Loop", "Jeopardy: Post-Squishing Edition",
        "Deal or Dimensional Rift", "Survivor: Green Fields", "The Amazing Interdimensional Race", "Archive Foundation Trivia",
        "Memory Fragment Matching", "Y2K Nostalgia Challenge", "Speed Dating Above 80 KM/H", "Anoki Durability Testing Show",
        // Fantasy Normal
        "The Price is Arcane", "Family Feud: Clans of the North", "Dungeon of Fortune", "Who Wants to Slay a Dragon?",
        "The Weakest Link in the Chainmail", "Trial by Combat", "The Great Gnomish Bake-Off", "Find the Artifact"
    ];
    
    const cookingShows_en = [
        // Surreal
        "Cooking with Temporal Ingredients", "Hell's Kitchen: Post-Apocalypse", "Baking in a Time Loop", "Goblin Cuisine Extreme",
        "Interdimensional Flavor Quest", "Y2K Survival Rations Master", "Truck Stop Diner Deluxe", "Memory-Infused Recipes",
        // Fantasy Normal
        "Tavern Rescue", "The Iron Chef: Kingdom Stadium", "Cooking with Kobolds", "Dining with Dragons",
        "The Frugal Alchemist", "A Pinch of Pixie Dust", "Feasts of the Nine Realms", "Royal Kitchen Nightmares"
    ];
    
    const documentaries_en = [
        // Surreal
        "The Squishing: What Really Happened", "Anoki: The Indestructible Legacy", "Margaret vs. Crowley: The Mage Wars",
        "Life in the Loops: A Survivor's Story", "The Archive Foundation Raids", "Hypercapitalist Society Exposed",
        "Goblin Civilization: Before the Fall", "The Road That Connects Everything", "Y2K: The Day Everything Changed",
        "Em's Journey: From Witch to Legend", "Bubble and the Cosmic RV Chronicles",
        // Fantasy Normal
        "The Fall of the Sky-Citadels", "Wyverns: Monarchs of the Sky", "A History of the Orcish Wars", "The Lost City of Aeridor",
        "Inside the Mage's Guild", "The Great Dwarven Migration", "Legends of the Forgotten Kings", "The Art of Golemancy"
    ];
    
    const educationalShows_en = [
        // Surreal
        "CamelCase 101: Magical Grammar", "Speed Management for Loop Prevention", "Understanding Temporal Mechanics",
        "Archive Organization Fundamentals", "Introduction to Metamagic", "Anoki Maintenance and Repair",
        "Interdimensional Navigation Basics", "Y2K Technology Archaeology", "Goblin Language Lessons",
        "Reality Anchor Theory and Practice", "Memory Fragment Analysis", "Truck Driving in Unstable Reality",
        // Fantasy Normal
        "Basic Potion Brewing", "Introduction to Gnomish Engineering", "Reading Ancient Runes", "How It's Enchanted",
        "Swordsmanship for Beginners", "Kingdom Civics", "Draconic Anatomy 101", "Know Your Monsters", "Agricultural Alchemy"
    ];
    
    const programTypes_en = [
        "news", "commercial", "weather", "emergency", "talk_show", "documentary", "cooking", "educational", "static",
        "glitch", "memory_fragment", "prophetic", "game_show", "soap_opera", "children_show", "infomercial",
        "religious", "conspiracy", "sports", "late_night", "reality_tv", "music_video", "test_pattern", "adult_swim",
        "sitcom", "drama", "historical_epic", "puppet_show", "royal_address"
    ];
    
    // ITALIAN CONTENT (Extended with Fantasy)
    const tvChannels_it = [
        // Surreal
        "Canale Z-999", "Rete Visione Statica", "Loop TV Eterno", "Caos Broadcasting Co.", "Dimensione 7 Accesso Pubblico",
        "Notizie Temporali 24/7", "Rete Commerciale Ipercapitalista", "Televisione Accesso Archiviale", "Radio Autostrada Camionisti",
        "Accesso Pubblico Gilda Maghi", "Anoki Trasmissione Emergenza", "Radio Rapporto Strada FM", "Rete Sopravvissuti Post-Y2K",
        "Canale Meteo Interdimensionale", "Broadcasting Memoriale Squish", "Rete Informazioni Regola 80",
        "Produzioni FantaBlack Srl", "Rete Nostalgia Anoki", "TV Memoria Bolla", "Canale Realtà Frammentata",
        "Rete Timeline Spezzata", "Broadcasting Retrogrado", "Televisione Buco Memoria", "TV Pubblica Città Glitch",
        "Rete Notizie Paradosso", "Il Canale Loop", "FM Deriva Dimensionale", "Rete Disruzione Chronos",
        // Fantasy Normal (Italian)
        "Radiotelevisione di Aethelgard (RTA)", "Rete Notizie Città d'Argento (RNCA)", "Il Canale della Corte Reale", "Servizio Meteo del Regno",
        "Rete Lega Palla-Goblin (RLPG)", "Il Canale delle Ere", "TV Decoratori di Sotterranei", "La Rete dell'Avventuriero"
    ];
    
    const newsAnchors_it = [
        // Surreal
        "Tom Loopsworth", "Jane Dimensionale", "Bob Frammentatore", "Sarah Temporale", "Mike Paradosso", "Lisa Riftcaster",
        "Dave Glitchton", "Anna Camminatrice Vuoto", "Chuck Temporis", "Diana Crashcode", "Steve Spezzaloop", "Tina Cancellmem",
        "Walter Cronicità", "Barbara Spazioriva", "Jim Resetson", "Carol Cambiotempo", "Brad Perditmemoria", "Susan Tracciapila",
        "Kevin Puntanullo", "Rachel Erroresegmento", "Tony Loopavvio", "Michelle Crashduro", "Derek Cielobluscermo",
        "Amanda Panicokernel", "Frank Errorisistema", "Linda Violazioneaccesso", "Gary Stackoverflow", "Janet Falliremalloc",
        // Fantasy Normal (Italian)
        "Bartolomeo Gru", "Eleonora Vance", "Reginaldo Fringuello", "Serafina Marlowe", "Gedeone Graves", "Isotta Spina",
        "Percival Croft", "Ginevra Dubois", "Alistair Fringuello", "Beatrice Porto", "Giuliano Boscopreto", "Rosalinda Payne"
    ];
    
    // Extended content arrays...
    const newsTemplates_en = [
        "Breaking: Local loop detected in {location}. Residents advised to maintain speeds above 80 km/h. {anchor} reporting.",
        "The Archive Foundation raided another {company} facility today, demanding access to '{document}.' Three archivists were detained by {security}.",
        "Margaret Thatcher's faction claims breakthrough in {research}. Aleister Crowley supporters call it '{criticism}.'",
        "Anoki stock reaches all-time high as their {model} models prove immune to {anomaly}. Scientists remain {emotion}.",
        "Hypercapitalist collective announces new '{service}' service. Critics say it exploits {victims}.",
        "Strange signals detected from {mysterious_location}. {profession} report {equipment} pointing to '{coordinates}.'",
        "Y2K memorial service interrupted by actual {glitch}. Irony noted by {survivors}.",
        "Goblin raids increase in {territory}. Authorities remind citizens that technology above {era} triggers their {reaction}.",
        "New FantaBlack coating proves {percentage}% {resistance}. {legal_entity} files lawsuit from beyond {barrier}.",
        "Traffic update: {highway} experiencing {temporal_condition}. Expect delays of {time_amount}.",
        "Local {profession} discovers {artifact} dating back to {time_period}. Archive Foundation {action}.",
        "Weather anomaly in {location} causes {effect}. Residents report {strange_phenomenon}.",
        "Breaking: {celebrity} spotted near {location} driving {vehicle} at {speed}. Fans gather despite {danger}.",
        "Economic report: {currency} reaches new {direction} against {comparison}. Hypercapitalists {reaction}.",
        "Cultural event: Annual {festival} celebrates {tradition} in {location}. Expected attendance: {number}."
    ];
    
    const companies_en = ["Stoutbeard Brewing", "Gnomish Gearworks Inc.", "Esoteric Heavy Industries", "Crimson Cola Co.", "Iron-Hide Armor Polishers", "Swiftstride Couriers", "Alchemix Potions", "Sky-Sail Shipping"];
    const documents_en = ["classified flavor documents", "secret recipes", "temporal research data", "Y2K protocols", "employee memories", "royal decrees", "trade agreements", "quest logs", "spell scrolls", "shipping manifests"];
    const security_en = ["corporate security", "time police", "reality wardens", "Anoki guards", "archive defenders", "the City Watch", "Royal Guards", "Guild Enforcers", "caravan guards", "bouncers"];
    const research_en = ["CamelCase research", "temporal mechanics", "memory extraction", "loop prevention", "reality anchoring", "draconic anatomy", "elemental studies", "ancient rune translation", "agricultural alchemy"];
    const criticism_en = ["grammatical heresy", "temporal blasphemy", "dimensional treason", "reality vandalism", "chronological terrorism", "magical heresy", "treason against the crown", "poor craftsmanship", "a grave insult"];
    const models_en = ["3310", "3315", "5110", "8210", "3210", "Ironclad Series", "Starlight Model", "Mk. IV Golem", "Griffin-Claw"];
    const anomalies_en = ["temporal anomalies", "reality rifts", "memory storms", "dimensional feedback", "causality breaks", "magical surges", "crop blight", "trade route blockades", "mana voids", "wild magic zones"];
    const emotions_en = ["baffled", "confused", "terrified", "amazed", "suspicious", "outraged", "hopeful", "skeptical", "delighted", "resigned"];
    const services_en = ["Time Rental", "Memory Banking", "Reality Insurance", "Loop Escape", "Speed Boosting", "Caravan Escort", "Blade Sharpening", "Potion Delivery", "Scrying Services", "Curse Removal"];
    const victims_en = ["loop victims", "temporal refugees", "memory-lost citizens", "reality orphans", "chronology displaced", "villagers", "merchants", "adventurers", "travelers", "the Royal Treasury"];
    
    // Extended weather templates with more variables
    const weatherTemplates_en = [
        "Today in {location}: {weather_type} expected with {percentage}% chance of {precipitation}. Winds from {direction} at {speed}.",
        "Current conditions in {location}: Reality {stability}, dimension drift {intensity}. {recommendation} for {activity}!",
        "Warning: {hazard} in {location}. Visibility limited to {time_reference}. Drive carefully through {medium}.",
        "Unusual {pressure_type} pressure system moving through {location}. Expect {phenomenon} and {effect}.",
        "Beautiful day in {location}! {system} intact, no {warning_type} warnings issued. Enjoy the {experience}!",
        "Severe {storm_type} warning for {location}. Seek shelter in {shelter_type}. This system may cause {consequence}.",
        "Interdimensional forecast: {dimension_weather} spreading from {origin}. Citizens advised to {action}.",
        "Temporal pressure dropping in {location}. Barometric reading: {measurement}. {professional} advises {precaution}."
    ];
    
    const weather_types_en = ["Temporal storms", "Reality distortions", "Memory fog", "Dimensional rifts", "Causality rain", "Clear skies", "Mana storms", "Ash fall", "Acid rain", "Heavy fog"];
    const precipitations_en = ["memory precipitation", "temporal droplets", "reality fragments", "dimensional snow", "chronological hail", "rain", "sleet", "snow", "blood rain", "ectoplasm"];
    const directions_en = ["the past", "the future", "parallel dimension", "the void", "pre-Squishing times", "the Dragon's Tooth Mountains", "the sea", "the Gloomwood", "the Northern Reach"];
    const stabilities_en = ["stable", "fluctuating", "deteriorating", "improving", "unknown", "solid", "unsteady", "chaotic", "calm"];
    const intensities_en = ["minimal", "moderate", "severe", "extreme", "catastrophic", "low", "high", "mild", "intense"];
    const hazards_en = ["Chronological fog", "Memory storms", "Reality static", "Temporal turbulence", "Dimensional interference", "Dragon sightings", "Orc raids", "Wild magic surges", "Dense fog", "Slime infestations"];
    const time_references_en = ["next Tuesday", "yesterday evening", "last century", "the year 2000", "tomorrow's breakfast", "the next moon cycle", "the last age", "the coming winter", "five minutes ago"];
    
    // Commercial templates with more variety
    const commercialTemplates_en = [
        "Tired of {problem}? Try {product}! Side effects may include {side_effect}. Call {phone_number} now!",
        "At {company}, we make the {impossible_thing}... {action}! {product} - now available at {location}!",
        "Don't let {disaster} ruin your {time_period}! {product} keeps you {state} in whatever {reality_type} you prefer!",
        "Remember the good old days of {nostalgia_item}? {product} brings back that nostalgic {feeling}!",
        "Are YOU {dangerous_activity}? {product} - because {consequence} is {permanence}!",
        "New from {manufacturer}: {product}! The only {item_type} designed specifically for {target_audience}!",
        "Warning: {authority} recommends against {activity}. That's why you need {product}!",
        "{celebrity} says: 'I wouldn't be {achievement} without {product}!' Order now and receive {bonus}!",
        "Act now! {product} is flying off the shelves faster than {speed_reference}! Limited time offer!",
        "Doctors hate this one simple trick: {product}! {percentage}% of users report {benefit}!"
    ];
    
    const problems_en = ["losing your memories every 24 hours", "temporal displacement", "reality confusion", "dimensional sickness", "rusty armor", "a dull sword", "a goblin infestation", "a leaky roof", "wyvern breath"];
    const side_effects_en = ["existential dread", "temporal hiccups", "memory leakage", "dimensional allergies", "reality rash", "glowing skin", "minor poltergeist activity", "uncontrollable levitation", "a sudden craving for gold"];
    const phone_numbers_en = ["1-800-LOOP-HELP", "555-TIME-STOP", "1-800-NO-RESET", "555-REALITY", "1-800-FIX-TIME", "555-MAGES", "1-800-GOBLIN", "555-SWORDS", "1-888-POTIONS"];
    const impossible_things_en = ["impossible", "improbable", "theoretically sound", "magically enhanced", "temporally stable", "possible", "affordable", "enchantable", "unbelievably potent"];
    const actions_en = ["appear in your warehouse overnight", "manifest in your driveway", "materialize during coffee breaks", "deliver it by raven", "forge it in dragon's fire", "brew it under a full moon"];
    
    // Talk show templates with more dialogue
    const talkShowTemplates_en = [
        "Welcome back to '{show_name}.' Today's guest, {guest}, claims to {claim}. Our expert {expert} says this is {assessment}.",
        "On today's '{show_name}': {situation}. We'll be right back after these messages from {sponsor}.",
        "You're watching '{show_name}.' Tonight: {conflict} - the {description} that's {effect}!",
        "'{show_name}' returns! Today: caller {caller_name} can't stop their {device} from {malfunction}.",
        "Live from {location}, it's '{show_name}'! Tonight we're discussing {topic} with special guest {celebrity}.",
        "Breaking news interrupts '{show_name}': {news_event} reported in {location}. We return to our interview with {guest}.",
        "'{show_name}' investigation reveals {conspiracy}. {authority_figure} denies allegations of {accusation}.",
        "Viewer discretion advised for tonight's '{show_name}': {controversial_topic} with {expert_type} {expert_name}."
    ];
    
    const show_names_en = [
        "Coffee with Consciousness", "Roadside Confessions", "Dimensional Housewives", "Tech Support from Hell",
        "Memory Lane Tonight", "The Temporal Hour", "Loop Breakers Anonymous", "Reality Check Live",
        "Post-Squishing Survivors", "The Archive Foundation Files", "Hypercapitalist Exposed",
        "Mage Guild Mysteries", "Anoki Chronicles", "Y2K Flashbacks", "The Goblin Truth",
        "Good Morning, Silver Spires", "The Royal Court Report", "Tavern Talk", "Tonight with Sir Kaelan"
    ];
    
    const claims_en = [
        "remember life before the Squishing", "have traveled through time", "speak fluent Goblin",
        "work for Esoteric Heavy Industries", "dated a Hypercapitalist", "escaped a permanent loop",
        "own the last working computer", "found Em's lost memories", "have wrestled a troll", "found a lost artifact",
        "can speak with dragons", "survived the Sunken City"
    ];
    
    // Emergency broadcasts with more urgency
    const emergencyTemplates_en = [
        "EMERGENCY BROADCAST: {violation_type} detected in sector {location}. {consequence} spreading. {action} immediately.",
        "ALERT: {threat} spotted near {location}. {instruction}. This is not a drill.",
        "WARNING: {disease_type} outbreak in {location}. {prevention_method}.",
        "URGENT: {disaster_type} in {location}. {temporal_effect}. Please {instruction}.",
        "CRITICAL: {organization} has {action_past}. {instruction}, especially {specific_action}.",
        "ALL STATIONS: {phenomenon} detected. Citizens should {immediate_action} and avoid {dangerous_thing}.",
        "PRIORITY ALERT: {technology} malfunction in {location}. {evacuation_instruction}.",
        "EMERGENCY OVERRIDE: {authority} declares {declaration} in {location}. {compliance_instruction}."
    ];
    
    const violation_types_en = ["CamelCase violation", "Reality breach", "Temporal paradox", "Memory contamination", "Containment spell failure", "Treaty violation", "Unauthorized portal creation"];
    const consequences_en = ["Reality infection", "Temporal corruption", "Memory plague", "Dimensional collapse", "Mass demon summoning", "Wild magic surge", "City-wide petrification"];
    const threat_types_en = ["Goblin war party", "Rogue AI", "Reality anchor failure", "Temporal storm", "A dragon", "An orc horde", "A rogue golem", "A rampaging hydra"];
    const disease_types_en = ["Thought Transmitted Disease", "Memory virus", "Reality sickness", "Temporal plague", "Rock-scale fever", "The grey plague", "Mana sickness", "Lycanthropy"];
    
    // Memory fragments with more variety
    const memoryFragments_en = [
        "...Mom always said check the computer for Y2K updates... why can't I remember her face?...",
        "...the Anoki ringtone, that familiar Anoki ringtone... it used to mean something...",
        "...before the Squishing, we had something called 'the hypernet'... what was it like?...",
        "...Margaret Thatcher, wasn't she just a politician once? Now look what she's become...",
        "...I think I had a cat before the loops started... or was it a dog? Do I even like animals?...",
        "...dial-up modem sounds, why do I remember dial-up modem sounds but not my birthday?...",
        "...there was a place called 'school' where children learned... what happened to the children?...",
        "...Christmas morning, 1999... we thought Y2K would be the worst thing... how naive we were...",
        "...my first Anoki phone... indestructible, they said... turns out they were right...",
        "...flying cars were supposed to exist by now... instead we got temporal loops...",
        "...MySpace, AOL Instant Messenger... names without meaning... ghosts of a digital age...",
        "...DVDs, VHS tapes... physical media that held memories... now memories hold nothing...",
        "...the Twin Towers still stood... the world made sense... time moved forward...",
        "...Pokémon cards, Game Boy Color... toys that didn't predict the future... simpler magic..."
    ];
    
    // Prophetic content with more mystery
    const prophecies_en = [
        "...the storm is coming, Bubba knows, Bubba always knows... the RV dreams of electric sheep...",
        "...when the Anoki rings thrice, the Archive Foundation will fall... knowledge dies with wisdom...",
        "...Em's memories shall pierce the heart of gods... what is forgotten remembers itself...",
        "...beware the one who moves slower than 80, for they are lost in yesterday's tomorrow...",
        "...the Road leads to Beagle, but Beagle leads to nowhere... and nowhere leads home...",
        "...seven trumpets of Anoki shall sound... and the loops will break like chains of time...",
        "...when the last Goblin learns to read, the Green Fields will burn with ancient knowledge...",
        "...Margaret and Crowley dance on graves of reality... their war ends only in mutual annihilation...",
        "...the Hypercapitalists count coins that don't exist... wealth measured in forgotten seconds...",
        "...in the deepest Archive, a book writes itself... and what it writes, becomes truth...",
        "...Esoteric Heavy Industries manufactures tomorrow... their workers are tomorrow's ghosts...",
        "...the Petroleum Demons sleep beneath Italy... their dreams leak into our nightmares..."
    ];
    
    // Static content with more variation
    const staticContent_en = [
        "[STATIC NOISE]", "[SIGNAL INTERFERENCE]", "[TEMPORAL STATIC]", "[DIMENSIONAL FEEDBACK]",
        "...zzzt...can anyone hear...zzzt...the year 2000...zzzt...", "...reality is breaking down...zzzt...help us...zzzt...",
        "[TRANSMISSION LOST]", "[SEARCHING FOR SIGNAL...]", "[REALITY ANCHOR OFFLINE]", "[TEMPORAL BUFFER OVERFLOW]",
        "...zzzt...Margaret? Margaret, are you there?...zzzt...", "...the loops are breaking...zzzt...freedom...zzzt...",
        "[ERROR 404: REALITY NOT FOUND]", "[MEMORY ALLOCATION FAILED]", "[TIMELINE SEGMENTATION FAULT]",
        "...Anoki, Anoki, why have you forsaken us...zzzt...", "...before the Squishing...zzzt...we were human...zzzt...",
        "[CARRIER SIGNAL LOST]", "[DIMENSIONAL DRIFT DETECTED]", "[CAUSALITY VIOLATION WARNING]",
        "...Em? Em, can you hear me? The memories are fading...zzzt...", "...Highway 80 to nowhere...zzzt..."
    ];
    
    // Program content with more complexity
    const soapOperaTemplates_en = [
        "Previously on '{soap_name}': {character1} discovered that {character2} was {revelation}. Will {character3} forgive {character4} for {betrayal}?",
        "This week on '{soap_name}': {dramatic_event} rocks {location}. Meanwhile, {character1} struggles with {internal_conflict}.",
        "'{soap_name}' continues: The truth about {mystery} finally comes to light when {character1} finds {evidence} in {location}."
    ];
    
    const soap_names_en = [
        "Days of Our Loops", "General Reality Hospital", "The Young and the Temporal", "As the World Squishes",
        "All My Memories", "One Life to Loop", "Another Dimension", "The Bold and the Timeless",
        "The Spire and the Destitute", "Aethelgard Abbey", "Port Prosperity"
    ];
    
    const children_show_templates_en = [
        "Today on '{kids_show}': {character} learns about {lesson} when {situation}. Remember, kids: {moral}!",
        "'{kids_show}' safety tip: Always wear your {safety_item} when {dangerous_activity}. Safety first!",
        "Join {character} on '{kids_show}' as they explore {location} and meet {friend}. What will they discover?"
    ];
    
    const kids_shows_en = [
        "Anoki the Indestructible Phone's Fun Time", "Memory Lane Playhouse", "Goblin Friends Forever",
        "The Magic of CamelCase", "Temporal Tommy's Time Adventures", "Reality Rangers",
        "Pip the Friendly Pixie", "Adventures in the Gnome Garden", "Sir Reginald's School for Squires"
    ];
    
    // Religious/cult programming
    const religiousTemplates_en = [
        "Brother {preacher} speaks about {topic} in today's '{religious_show}'. Remember: {religious_message}.",
        "The Church of {deity} presents '{religious_show}': {sermon_topic}. Donations accepted in {currency}.",
        "'{religious_show}' meditation hour: Focus on {spiritual_concept} while {activity}. Om {sacred_word}."
    ];
    
    const religious_shows_en = [
        "Anoki Faith Hour", "The Gospel According to Margaret", "Crowley's Chaos Chapel",
        "Archive Foundation Salvation", "The Church of Infinite Loops", "Temporal Testimony Time",
        "Sermons from the Sunstone Cathedral", "The Path of the Elements", "Hymns to the All-Seer"
    ];
    
    // Late night programming
    const lateNightTemplates_en = [
        "It's {time} AM, and you're watching '{late_show}'. Tonight: {weird_topic} and {strange_guest}.",
        "'{late_show}' after dark: When {situation}, what do you do? Call {number} with your {adjective} stories.",
        "Welcome to the {hour} hour of '{late_show}'. Tonight's topic: {controversial_subject}. Lines are open."
    ];
    
    const late_shows_en = [
        "Midnight on the Road", "The Insomnia Files", "After Hours Reality Check", "The Temporal Zone",
        "Late Night Loop Prevention", "The Witching Hour Broadcast", "Nightmare Frequency",
        "After Dark in Silver Spires", "Tavern Tales After Hours", "Whispers from the Void"
    ];
    // ==================================
    // === ITALIAN CONTENT FALLBACKS ===
    // ==================================
    // To prevent errors if Italian isn't fully translated, we'll make English the fallback.
    const commercialProducts_it = commercialProducts_en;
    const weatherLocations_it = weatherLocations_en;
    const celebrities_it = celebrities_en;
    const gameShows_it = gameShows_en;
    const cookingShows_it = cookingShows_en;
    const documentaries_it = documentaries_en;
    const educationalShows_it = educationalShows_en;
    const programTypes_it = programTypes_en;
    const newsTemplates_it = newsTemplates_en;
    const companies_it = companies_en;
    const documents_it = documents_en;
    const security_it = security_en;
    const research_it = research_en;
    const criticism_it = criticism_en;
    const models_it = models_en;
    const anomalies_it = anomalies_en;
    const emotions_it = emotions_en;
    const services_it = services_en;
    const victims_it = victims_en;
    const weatherTemplates_it = weatherTemplates_en;
    const weather_types_it = weather_types_en;
    const precipitations_it = precipitations_en;
    const directions_it = directions_en;
    const stabilities_it = stabilities_en;
    const intensities_it = intensities_en;
    const hazards_it = hazards_en;
    const time_references_it = time_references_en;
    const commercialTemplates_it = commercialTemplates_en;
    const problems_it = problems_en;
    const side_effects_it = side_effects_en;
    const phone_numbers_it = phone_numbers_en;
    const impossible_things_it = impossible_things_en;
    const actions_it = actions_en;
    const talkShowTemplates_it = talkShowTemplates_en;
    const show_names_it = show_names_en;
    const claims_it = claims_en;
    const emergencyTemplates_it = emergencyTemplates_en;
    const violation_types_it = violation_types_en;
    const consequences_it = consequences_en;
    const threat_types_it = threat_types_en;
    const disease_types_it = disease_types_en;
    const memoryFragments_it = memoryFragments_en;
    const prophecies_it = prophecies_en;
    const staticContent_it = staticContent_en;
    const soapOperaTemplates_it = soapOperaTemplates_en;
    const soap_names_it = soap_names_en;
    const children_show_templates_it = children_show_templates_en;
    const kids_shows_it = kids_shows_en;
    const religiousTemplates_it = religiousTemplates_en;
    const religious_shows_it = religious_shows_en;
    const lateNightTemplates_it = lateNightTemplates_en;
    const late_shows_it = late_shows_en;


    // ==================================
    // === LANGUAGE CONTENT MANAGER ===
    // ==================================

    const contentDatabase = {
        en: {
            channels: tvChannels_en, anchors: newsAnchors_en, products: commercialProducts_en,
            locations: weatherLocations_en, celebrities: celebrities_en, gameShows: gameShows_en,
            cookingShows: cookingShows_en, documentaries: documentaries_en, educationalShows: educationalShows_en,
            programTypes: programTypes_en, newsTemplates: newsTemplates_en, companies: companies_en,
            documents: documents_en, security: security_en, research: research_en, criticism: criticism_en,
            models: models_en, anomalies: anomalies_en, emotions: emotions_en, services: services_en,
            victims: victims_en, weatherTemplates: weatherTemplates_en, weather_types: weather_types_en,
            precipitations: precipitations_en, directions: directions_en, stabilities: stabilities_en,
            intensities: intensities_en, hazards: hazards_en, time_references: time_references_en,
            commercialTemplates: commercialTemplates_en, problems: problems_en, side_effects: side_effects_en,
            phone_numbers: phone_numbers_en, impossible_things: impossible_things_en, actions: actions_en,
            talkShowTemplates: talkShowTemplates_en, show_names: show_names_en, claims: claims_en,
            emergencyTemplates: emergencyTemplates_en, violation_types: violation_types_en, consequences: consequences_en,
            threat_types: threat_types_en, disease_types: disease_types_en, memoryFragments: memoryFragments_en,
            prophecies: prophecies_en, staticContent: staticContent_en, soapOperaTemplates: soapOperaTemplates_en,
            soap_names: soap_names_en, children_show_templates: children_show_templates_en, kids_shows: kids_shows_en,
            religiousTemplates: religiousTemplates_en, religious_shows: religious_shows_en, lateNightTemplates: lateNightTemplates_en,
            late_shows: late_shows_en
        },
        it: {
            channels: tvChannels_it, anchors: newsAnchors_it, products: commercialProducts_it,
            locations: weatherLocations_it, celebrities: celebrities_it, gameShows: gameShows_it,
            cookingShows: cookingShows_it, documentaries: documentaries_it, educationalShows: educationalShows_it,
            programTypes: programTypes_it, newsTemplates: newsTemplates_it, companies: companies_it,
            documents: documents_it, security: security_it, research: research_it, criticism: criticism_it,
            models: models_it, anomalies: anomalies_it, emotions: emotions_it, services: services_it,
            victims: victims_it, weatherTemplates: weatherTemplates_it, weather_types: weather_types_it,
            precipitations: precipitations_it, directions: directions_it, stabilities: stabilities_it,
            intensities: intensities_it, hazards: hazards_it, time_references: time_references_it,
            commercialTemplates: commercialTemplates_it, problems: problems_it, side_effects: side_effects_it,
            phone_numbers: phone_numbers_it, impossible_things: impossible_things_it, actions: actions_it,
            talkShowTemplates: talkShowTemplates_it, show_names: show_names_it, claims: claims_it,
            emergencyTemplates: emergencyTemplates_it, violation_types: violation_types_it, consequences: consequences_it,
            threat_types: threat_types_it, disease_types: disease_types_it, memoryFragments: memoryFragments_it,
            prophecies: prophecies_it, staticContent: staticContent_it, soapOperaTemplates: soapOperaTemplates_it,
            soap_names: soap_names_it, children_show_templates: children_show_templates_it, kids_shows: kids_shows_it,
            religiousTemplates: religiousTemplates_it, religious_shows: religious_shows_it, lateNightTemplates: lateNightTemplates_it,
            late_shows: late_shows_it
        }
    };

    let currentContent = contentDatabase.en;

    function getContent(category) {
        return currentContent[category];
    }

    // ==================================
    // === SEEDED RANDOM GENERATOR ===
    // ==================================

    let seed = 1;

    function setSeed(s) {
        seed = s;
    }

    function seededRandom() {
        let x = Math.sin(seed++) * 10000;
        return x - Math.floor(x);
    }

    function getRandomElement(arr) {
        if (!arr || arr.length === 0) return "";
        return arr[Math.floor(seededRandom() * arr.length)];
    }

    function initializeSeed() {
        const pName = $gameParty.leader() ? $gameParty.leader().name() : "Null";
        let initialSeed = $gameMap.mapId();
        for (let i = 0; i < pName.length; i++) {
            initialSeed += pName.charCodeAt(i) * (i + 1);
        }
        setSeed(initialSeed);
    }
    
    function updateLanguage() {
        const lang = ConfigManager.language === 'it' ? 'it' : 'en';
        currentContent = contentDatabase[lang];
    }


    // ==================================
    // === MESSAGE GENERATION LOGIC ===
    // ==================================

    const generator = {
        news: () => {
            return getRandomElement(getContent("newsTemplates"))
                .replace(/{location}/g, getRandomElement(getContent("locations")))
                .replace(/{anchor}/g, getRandomElement(getContent("anchors")))
                .replace(/{company}/g, getRandomElement(getContent("companies")))
                .replace(/{document}/g, getRandomElement(getContent("documents")))
                .replace(/{security}/g, getRandomElement(getContent("security")))
                .replace(/{research}/g, getRandomElement(getContent("research")))
                .replace(/{criticism}/g, getRandomElement(getContent("criticism")))
                .replace(/{model}/g, getRandomElement(getContent("models")))
                .replace(/{anomaly}/g, getRandomElement(getContent("anomalies")))
                .replace(/{emotion}/g, getRandomElement(getContent("emotions")))
                .replace(/{service}/g, getRandomElement(getContent("services")))
                .replace(/{victims}/g, getRandomElement(getContent("victims")))
                .replace(/{mysterious_location}/g, getRandomElement(getContent("locations")))
                .replace(/{profession}/g, "researchers")
                .replace(/{equipment}/g, "sensors")
                .replace(/{coordinates}/g, "unknown")
                .replace(/{glitch}/g, "temporal rift")
                .replace(/{survivors}/g, "attendees")
                .replace(/{territory}/g, getRandomElement(getContent("locations")))
                .replace(/{era}/g, "pre-Squishing")
                .replace(/{reaction}/g, "aggression")
                .replace(/{percentage}/g, Math.floor(seededRandom() * 21) + 80)
                .replace(/{resistance}/g, "reality-resistant")
                .replace(/{legal_entity}/g, "A rival corporation")
                .replace(/{barrier}/g, "the void")
                .replace(/{highway}/g, "Highway 80")
                .replace(/{temporal_condition}/g, "time dilation")
                .replace(/{time_amount}/g, `${Math.floor(seededRandom() * 10) + 1} hours`)
                .replace(/{artifact}/g, "strange device")
                .replace(/{time_period}/g, "the Y2K era")
                .replace(/{action}/g, "has seized the item")
                .replace(/{effect}/g, "raining memories")
                .replace(/{strange_phenomenon}/g, "objects aging backwards")
                .replace(/{celebrity}/g, getRandomElement(getContent("celebrities")))
                .replace(/{vehicle}/g, "a cosmic RV")
                .replace(/{speed}/g, "88 km/h")
                .replace(/{danger}/g, "the risk of a loop")
                .replace(/{currency}/g, "HyperCredits")
                .replace(/{direction}/g, "high")
                .replace(/{comparison}/g, "the Royal Sovereign")
                .replace(/{reaction}/g, "are pleased")
                .replace(/{festival}/g, "Festival of Broken Timelines")
                .replace(/{tradition}/g, "the Great Unlooping")
                .replace(/{number}/g, Math.floor(seededRandom() * 10000));
        },
        commercial: () => {
            return getRandomElement(getContent("commercialTemplates"))
                .replace(/{problem}/g, getRandomElement(getContent("problems")))
                .replace(/{product}/g, getRandomElement(getContent("products")))
                .replace(/{side_effect}/g, getRandomElement(getContent("side_effects")))
                .replace(/{phone_number}/g, getRandomElement(getContent("phone_numbers")))
                .replace(/{company}/g, getRandomElement(getContent("companies")))
                .replace(/{impossible_thing}/g, getRandomElement(getContent("impossible_things")))
                .replace(/{action}/g, getRandomElement(getContent("actions")))
                .replace(/{location}/g, getRandomElement(getContent("locations")))
                .replace(/{disaster}/g, "a causality break")
                .replace(/{time_period}/g, "day")
                .replace(/{state}/g, "safe")
                .replace(/{reality_type}/g, "timeline")
                .replace(/{nostalgia_item}/g, "the year 1999")
                .replace(/{feeling}/g, "feeling")
                .replace(/{dangerous_activity}/g, "driving under 80 km/h")
                .replace(/{consequence}/g, "getting looped")
                .replace(/{permanence}/g, "forever")
                .replace(/{manufacturer}/g, "Esoteric Heavy Industries")
                .replace(/{item_type}/g, "device")
                .replace(/{target_audience}/g, "temporal refugees")
                .replace(/{authority}/g, "The Archive Foundation")
                .replace(/{activity}/g, "remembering too much")
                .replace(/{celebrity}/g, getRandomElement(getContent("celebrities")))
                .replace(/{achievement}/g, "where I am today")
                .replace(/{bonus}/g, "a free Anoki 3310 case")
                .replace(/{speed_reference}/g, "a reality anchor failing")
                .replace(/{percentage}/g, Math.floor(seededRandom() * 21) + 80)
                .replace(/{benefit}/g, "improved memory retention");
        },
        weather: () => {
            return getRandomElement(getContent("weatherTemplates"))
                .replace(/{location}/g, getRandomElement(getContent("locations")))
                .replace(/{weather_type}/g, getRandomElement(getContent("weather_types")))
                .replace(/{percentage}/g, Math.floor(seededRandom() * 101))
                .replace(/{precipitation}/g, getRandomElement(getContent("precipitations")))
                .replace(/{direction}/g, getRandomElement(getContent("directions")))
                .replace(/{speed}/g, `${Math.floor(seededRandom() * 60 + 20)} km/h`)
                .replace(/{stability}/g, getRandomElement(getContent("stabilities")))
                .replace(/{intensity}/g, getRandomElement(getContent("intensities")))
                .replace(/{recommendation}/g, "Extreme caution is advised")
                .replace(/{activity}/g, "interdimensional travel")
                .replace(/{hazard}/g, getRandomElement(getContent("hazards")))
                .replace(/{time_reference}/g, getRandomElement(getContent("time_references")))
                .replace(/{medium}/g, "the timeline")
                .replace(/{pressure_type}/g, "temporal")
                .replace(/{phenomenon}/g, "minor paradoxes")
                .replace(/{effect}/g, "a sense of déjà vu")
                .replace(/{system}/g, "Causality")
                .replace(/{warning_type}/g, "loop")
                .replace(/{experience}/g, "stable timeline")
                .replace(/{storm_type}/g, "reality")
                .replace(/{shelter_type}/g, "a reality-anchored structure")
                .replace(/{consequence}/g, "total existence failure")
                .replace(/{dimension_weather}/g, "static bleed")
                .replace(/{origin}/g, "Dimension 7")
                .replace(/{action}/g, "reinforce their mental dams")
                .replace(/{measurement}/g, `${Math.floor(seededRandom() * 100)} millichrons`)
                .replace(/{professional}/g, "Temporal meteorologists")
                .replace(/{precaution}/g, "securing loose memories");
        },
        talk_show: () => {
            return getRandomElement(getContent("talkShowTemplates"))
                .replace(/{show_name}/g, getRandomElement(getContent("show_names")))
                .replace(/{guest}/g, getRandomElement(getContent("celebrities")))
                .replace(/{claim}/g, getRandomElement(getContent("claims")))
                .replace(/{expert}/g, "Dr. Alistair Finch")
                .replace(/{assessment}/g, "highly improbable")
                .replace(/{situation}/g, "A man claims his toaster is a portal to the past")
                .replace(/{sponsor}/g, getRandomElement(getContent("companies")))
                .replace(/{conflict}/g, "The Goblin Rights Debate")
                .replace(/{description}/g, "controversy")
                .replace(/{effect}/g, "sweeping the nation")
                .replace(/{caller_name}/g, "Bob from Sector 7")
                .replace(/{device}/g, "Anoki 3310")
                .replace(/{malfunction}/g, "receiving calls from himself in the future")
                .replace(/{location}/g, "Beagle City")
                .replace(/{topic}/g, "The Squishing")
                .replace(/{celebrity}/g, getRandomElement(getContent("celebrities")))
                .replace(/{news_event}/g, "a temporal loop forming downtown")
                .replace(/{conspiracy}/g, "a link between FantaBlack and memory loss")
                .replace(/{authority_figure}/g, "A Hypercapitalist CEO")
                .replace(/{accusation}/g, "market manipulation")
                .replace(/{controversial_topic}/g, "The ethics of Thought Disease")
                .replace(/{expert_type}/g, "bio-ethicist")
                .replace(/{expert_name}/g, "Dr. Genevieve Dubois");
        },
        emergency: () => {
            return getRandomElement(getContent("emergencyTemplates"))
                .replace(/{violation_type}/g, getRandomElement(getContent("violation_types")))
                .replace(/{location}/g, getRandomElement(getContent("locations")))
                .replace(/{consequence}/g, getRandomElement(getContent("consequences")))
                .replace(/{action}/g, "Maintain speed above 80 km/h")
                .replace(/{threat}/g, getRandomElement(getContent("threat_types")))
                .replace(/{instruction}/g, "Do not engage. Evacuate.")
                .replace(/{disease_type}/g, getRandomElement(getContent("disease_types")))
                .replace(/{prevention_method}/g, "Avoid eye contact and unprotected thoughts.")
                .replace(/{disaster_type}/g, "a full timeline collapse")
                .replace(/{temporal_effect}/g, "You may experience past and future events simultaneously.")
                .replace(/{organization}/g, "The Archive Foundation")
                .replace(/{action_past}/g, "breached containment")
                .replace(/{specific_action}/g, "destroy all personal records")
                .replace(/{phenomenon}/g, "A major reality squish")
                .replace(/{immediate_action}/g, "brace for impact")
                .replace(/{dangerous_thing}/g, "unstable concepts")
                .replace(/{technology}/g, "The Schrödinger Bridge Network")
                .replace(/{evacuation_instruction}/g, "Evacuation is mandatory.")
                .replace(/{authority}/g, "The Mage Guild")
                .replace(/{declaration}/g, "a state of magical emergency")
                .replace(/{compliance_instruction}/g, "All unlicensed magic is now forbidden.");
        },
        memory_fragment: () => getRandomElement(getContent("memoryFragments")),
        prophetic: () => getRandomElement(getContent("prophecies")),
        static: () => getRandomElement(getContent("staticContent")),
        glitch: () => "ERROR: B̸r̵o̵a̷d̷c̷a̷s̴t̷ ̶s̵i̷g̷n̵a̶l̷ ̷i̸n̵t̸e̴g̶r̴i̴t̸y̷ ̶c̸o̸m̴p̴r̷o̴m̴i̶s̴e̵d̵.̴ R̸e̴a̷l̶i̷t̴y̶.̴e̷x̶e̴ ̶h̴a̴s̴ ̷p̸e̷r̸f̸o̴r̴m̷e̴d̴ ̶a̸n̴ ̶i̸l̵l̴e̸g̴a̴l̶ ̸o̶p̸e̸r̴a̴t̴i̸o̶n̷.",
        game_show: () => `Welcome to ${getRandomElement(getContent("gameShows"))}! Our next contestant will risk it all for a new ${getRandomElement(getContent("products"))}!`,
        soap_opera: () => {
             return getRandomElement(getContent("soapOperaTemplates"))
                .replace(/{soap_name}/g, getRandomElement(getContent("soap_names")))
                .replace(/{character1}/g, "Bartholomew")
                .replace(/{character2}/g, "Seraphina")
                .replace(/{character3}/g, "Julian")
                .replace(/{character4}/g, "Genevieve")
                .replace(/{revelation}/g, "secretly a time traveler")
                .replace(/{betrayal}/g, "selling the family castle to the Hypercapitalists")
                .replace(/{dramatic_event}/g, "A sudden goblin invasion")
                .replace(/{location}/g, getRandomElement(getContent("locations")))
                .replace(/{internal_conflict}/g, "a magical curse")
                .replace(/{mystery}/g, "the missing heir")
                .replace(/{evidence}/g, "an ancient scroll");
        },
        children_show: () => {
            return getRandomElement(getContent("children_show_templates"))
                .replace(/{kids_show}/g, getRandomElement(getContent("kids_shows")))
                .replace(/{character}/g, "Temporal Tommy")
                .replace(/{lesson}/g, "the importance of stable timelines")
                .replace(/{situation}/g, "his pet dinosaur gets lost in the Y2K bug")
                .replace(/{moral}/g, "don't play with paradoxes!")
                .replace(/{safety_item}/g, "Mental Dam Foil Hat")
                .replace(/{dangerous_activity}/g, "navigating a memory storm")
                .replace(/{friend}/g, "a friendly Goblin");
        },
        religious: () => {
            return getRandomElement(getContent("religiousTemplates"))
                .replace(/{preacher}/g, "Anomaly Jones")
                .replace(/{topic}/g, "The Great Squishing")
                .replace(/{religious_show}/g, getRandomElement(getContent("religious_shows")))
                .replace(/{religious_message}/g, "Only the Indestructible Anoki can save your data.")
                .replace(/{deity}/g, "the Archive Foundation")
                .replace(/{sermon_topic}/g, "On the Sanctity of Primary Timelines")
                .replace(/{currency}/g, "purified memories")
                .replace(/{spiritual_concept}/g, "the sound of one hand dialing")
                .replace(/{activity}/g, "we await the signal")
                .replace(/{sacred_word}/g, "...Anoki...");
        },
        late_night: () => {
            return getRandomElement(getContent("lateNightTemplates"))
                .replace(/{time}/g, Math.floor(seededRandom() * 3) + 1)
                .replace(/{late_show}/g, getRandomElement(getContent("late_shows")))
                .replace(/{weird_topic}/g, "Truck stop conspiracies")
                .replace(/{strange_guest}/g, "a man who claims to be from the year 2000")
                .replace(/{situation}/g, "you find a memory that isn't yours")
                .replace(/{number}/g, getRandomElement(getContent("phone_numbers")))
                .replace(/{adjective}/g, "weirdest")
                .replace(/{hour}/g, "third")
                .replace(/{controversial_subject}/g, "Are loop victims truly conscious?");
        },
        default: () => "Technical Difficulties. Please stand by."
    };

    function generateMessage(type) {
        const createMessage = generator[type] || generator.default;
        return createMessage();
    }


    // ==================================
    // === PLUGIN COMMAND ===
    // ==================================

    PluginManager.registerCommand(pluginName, "ShowTVTransmission", args => {
        const maxMessages = Number(args.maxMessages) || 4;
        
        // Ensure this command is run from the map interpreter
        const interpreter = $gameMap.interpreter;
        if (!interpreter) return;

        updateLanguage();
        initializeSeed();
        
        const channel = getRandomElement(getContent("channels"));
        const commands = [];

        for (let i = 0; i < maxMessages; i++) {
            const programType = getRandomElement(getContent("programTypes"));
            const messageText = `\\C[7]${channel}\\C[0]\n` + generateMessage(programType);

            // Command 101: Show Text
            // Parameters: [Face Name, Face Index, Background, Position, Text]
            const params = ["", 0, 0, 2, messageText];
            commands.push({ code: 101, indent: 0, parameters: params });
        }
        
        // Setup a child interpreter to run our generated commands
        interpreter.setupChild(commands);
    });

})();

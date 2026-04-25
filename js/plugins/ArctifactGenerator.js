/*:
* @plugindesc Creates procedurally generated items, weapons, and armor with random properties
* @author Omni-Lex
*
* @command GenerateAllRandom
* @text Generate All Random Items
* @desc Fills all available slots with random artifacts, weapons and armors of random levels
*
* @command RandomArtifactByLevel
* @text Add Level-Appropriate Artifact
* @desc Adds a random artifact with level close to the player's level
*
* @command RandomArtifact
* @text Add Totally Random Artifact
* @desc Adds a completely random artifact to inventory
*
* @help
* This plugin creates procedurally generated items with the <Category: Artifact> tag
* and weapons/armor with <Category: Procedural> tag.
* 
* Items from ID 700-799 are reserved for artifacts.
* Weapons from ID 500-549 are reserved for procedural weapons.
* Armors from ID 550-600 are reserved for procedural armors.
* 
* ============================================================================
* Plugin Commands (MV format):
* ============================================================================
* GenerateAllRandom           # Fills all slots with random procedural items
* RandomArtifactByLevel       # Adds level-appropriate artifact to inventory
* RandomArtifact              # Adds completely random artifact to inventory
*
* ============================================================================
* Terms of Use:
* Free for use in both commercial and non-commercial projects.
* ============================================================================
*/

(function() {
// Configuration
const ARTIFACT_START_ID = 700;
const ARTIFACT_END_ID = 799;
const ARTIFACT_COUNT = ARTIFACT_END_ID - ARTIFACT_START_ID + 1;

const WEAPON_START_ID = 500;
const WEAPON_END_ID = 549;
const WEAPON_COUNT = WEAPON_END_ID - WEAPON_START_ID + 1;

const ARMOR_START_ID = 550;
const ARMOR_END_ID = 600;
const ARMOR_COUNT = ARMOR_END_ID - ARMOR_START_ID + 1;

// Name generation components with expanded bizarre naming conventions
const artifactPrefixes = [
    "Whisper-", "Glitch-", "Quantum-", "Nexus-", "Void-", 
    "Paradox-", "Fractal-", "Pulse-", "Chrono-", "Flux-",
    "Rift-", "Echo-", "Entropy-", "Miasma-", "Singularity-",
    "Nebula-", "Tesseract-", "Labyrinth-", "Aberrant-", "Eldritch-",
    "Synaesthetic-", "Xeno-", "Proto-", "Meta-", "Hyper-",
    "Omega-", "Primordial-", "Aberration-", "Apocrypha-", "Umbral-",
    "Zero-", "Null-", "Absolute-", "Anti-", "Pseudo-",
    "Trans-", "Neo-", "Quasi-", "Retro-", "Omni-",
    "Crypto-", "Splice-", "Kinetic-", "Astral-", "Vortex-",
    "Phasmic-", "Synaptic-", "Vector-", "Sentient-", "Autonomous-",
    "Memetic-", "Prism-", "Cascading-", "Cyclic-", "Phantom-"
];

const artifactNouns = [
    "Distortion", "Vortex", "Anomaly", "Convergence", "Residue", 
    "Catalyst", "Paradigm", "Entropy", "Enigma", "Axiom",
    "Tesseract", "Transmuter", "Cipher", "Interlocutor", "Conduit",
    "Algorithm", "Manifold", "Helix", "Codex", "Sigil",
    "Gestalt", "Oculus", "Palindrome", "Theorem", "Simulacrum",
    "Continuum", "Resonator", "Oscillator", "Anathema", "Artifice",
    "Paradox", "Tautology", "Monolith", "Kaleidoscope", "Labyrinth",
    "Biomass", "Cortex", "Nexus", "Locus", "Interface",
    "Assemblage", "Synapse", "Apparatus", "Construct", "Engine",
    "Compendium", "Zeitgeist", "Amalgam", "Vector", "Vortice",
    "Tessellation", "Mandala", "Quintessence", "Node", "Contraption",
    "Mechanism", "Diode", "Rhizome", "Effigy", "Hypercube"
];

const artifactSuffixes = [
    "of Impossible Geometries", "of Forbidden Knowledge", "of Untethered Dreams", 
    "of Whispered Madness", "of Dimensional Collapse", "of Shattered Perception", 
    "of Iridescent Decay", "of Cascading Thought", "of Temporal Displacement", 
    "of Neural Corruption", "of Infinite Recursion", "of Cognitive Dissonance",
    "of Entropic Dissolution", "of Phase Variance", "of Quantum Uncertainty",
    "of Reality Fragmentation", "of Memory Corruption", "of Consciousness Bleed",
    "of Synthetic Nightmares", "of Primordial Chaos", "of Fractal Intelligence",
    "of Digital Hallucinations", "of Mechanical Abominations", "of Visceral Enigmas",
    "of Perpetual Contradiction", "of Probabilistic Collapse", "of Emergent Consciousness",
    "of Parabolic Transcendence", "of Aberrant Logic", "of Viscous Time",
    "of Infinite Regress", "of Algorithmic Predestination", "of Mathematical Heresy",
    "of Chromatic Aberration", "of Paradoxical Truth", "of Spectral Frequencies",
    "of Anomalous Properties", "of Computational Divinity", "of Recursive Horror",
    "of Incomprehensible Angles", "of Asynchronous Dreams", "of Decentralized Awareness",
    "of Hyperdimensional Collapse", "of Simulated Existence", "of Perceptual Chaos",
    "of Procedural Memory", "of Quantum Superposition", "of Synthetic Sentience",
    "of Non-Euclidean Spaces", "of Perpetual Motion", "of Theoretical Impossibility"
];

// Effect types
const effectTypes = [
    { type: "addParam", params: [0], text: "Max HP" },        // MaxHP
    { type: "addParam", params: [1], text: "Max MP" },        // MaxMP
    { type: "addParam", params: [2], text: "Attack" },        // ATK
    { type: "addParam", params: [3], text: "Defense" },       // DEF
    { type: "addParam", params: [4], text: "Magic" },         // MAT
    { type: "addParam", params: [5], text: "Magic Def" },     // MDF
    { type: "addParam", params: [6], text: "Agility" },       // AGI
    { type: "addParam", params: [7], text: "Luck" },          // LUK
    { type: "addState", text: "Grants Regen" },               // State (specify in params)
    { type: "removeState", text: "Prevents Poison" },         // State (specify in params)
    { type: "addDebuff", text: "Weakens Enemies" },           // Debuff (specify in params)
    { type: "removeDebuff", text: "Provides Resistance" }     // Debuff (specify in params)
];

// Initialize items, weapons, and armors when game starts
const _DataManager_onLoad = DataManager.onLoad;
DataManager.onLoad = function(object) {
    _DataManager_onLoad.call(this, object);
    if (object === $dataItems) {
        initializeArtifactTemplates();
        console.log("Initialized artifact templates in slots " + ARTIFACT_START_ID + "-" + ARTIFACT_END_ID);
    } else if (object === $dataWeapons) {
        initializeWeaponTemplates();
        console.log("Initialized weapon templates in slots " + WEAPON_START_ID + "-" + WEAPON_END_ID);
    } else if (object === $dataArmors) {
        initializeArmorTemplates();
        console.log("Initialized armor templates in slots " + ARMOR_START_ID + "-" + ARMOR_END_ID);
    }
};

// Make sure our database is large enough for our procedural items
const _Scene_Boot_start = Scene_Boot.prototype.start;
Scene_Boot.prototype.start = function() {
    // Ensure database arrays are large enough
    const requiredItemsLength = ARTIFACT_END_ID + 1;
    if ($dataItems.length < requiredItemsLength) {
        const originalLength = $dataItems.length;
        for (let i = originalLength; i < requiredItemsLength; i++) {
            $dataItems[i] = null;
        }
        console.log("Extended $dataItems from " + originalLength + " to " + $dataItems.length);
    }
    
    const requiredWeaponsLength = WEAPON_END_ID + 1;
    if ($dataWeapons.length < requiredWeaponsLength) {
        const originalLength = $dataWeapons.length;
        for (let i = originalLength; i < requiredWeaponsLength; i++) {
            $dataWeapons[i] = null;
        }
        console.log("Extended $dataWeapons from " + originalLength + " to " + $dataWeapons.length);
    }
    
    const requiredArmorsLength = ARMOR_END_ID + 1;
    if ($dataArmors.length < requiredArmorsLength) {
        const originalLength = $dataArmors.length;
        for (let i = originalLength; i < requiredArmorsLength; i++) {
            $dataArmors[i] = null;
        }
        console.log("Extended $dataArmors from " + originalLength + " to " + $dataArmors.length);
    }
    
    // Call original function
    _Scene_Boot_start.call(this);
};

// Set up the artifact template items
function initializeArtifactTemplates() {
    for (let i = 0; i < ARTIFACT_COUNT; i++) {
        const id = ARTIFACT_START_ID + i;
        
        if (!$dataItems[id]) {
            $dataItems[id] = JSON.parse(JSON.stringify($dataItems[1])); // Clone from a basic item
        }
        
        // Set basic template properties
        $dataItems[id].id = id;
        $dataItems[id].name = "Empty Artifact Slot " + id;
        $dataItems[id].description = "Reserved for procedural generation";
        $dataItems[id].note = "<Category: Artifact>\n<Procedural: true>";
        $dataItems[id].iconIndex = 160 + (i % 16); // Assign a generic icon
        $dataItems[id].price = 0;
        $dataItems[id].occasion = 2; // 2 means "Menu Screen"
        $dataItems[id].scope = 7;    // 7 means "One Ally"
        $dataItems[id].effects = [];
        $dataItems[id].isGenerated = false;
    }
}

// Set up the weapon template items
function initializeWeaponTemplates() {
    for (let i = 0; i < WEAPON_COUNT; i++) {
        const id = WEAPON_START_ID + i;
        
        if (!$dataWeapons[id]) {
            $dataWeapons[id] = JSON.parse(JSON.stringify($dataWeapons[1])); // Clone from a basic weapon
        }
        
        // Set basic template properties
        $dataWeapons[id].id = id;
        $dataWeapons[id].name = "Empty Weapon Slot " + id;
        $dataWeapons[id].description = "Reserved for procedural generation";
        $dataWeapons[id].note = "<Category: Procedural>\n<Procedural: true>";
        $dataWeapons[id].iconIndex = 96 + (i % 16); // Assign a generic weapon icon
        $dataWeapons[id].price = 0;
        $dataWeapons[id].wtypeId = 0;
        $dataWeapons[id].params = [0, 0, 0, 0, 0, 0, 0, 0]; // All stats at 0
        $dataWeapons[id].traits = [];
        $dataWeapons[id].isGenerated = false;
    }
}

// Set up the armor template items
function initializeArmorTemplates() {
    for (let i = 0; i < ARMOR_COUNT; i++) {
        const id = ARMOR_START_ID + i;
        
        if (!$dataArmors[id]) {
            $dataArmors[id] = JSON.parse(JSON.stringify($dataArmors[1])); // Clone from a basic armor
        }
        
        // Set basic template properties
        $dataArmors[id].id = id;
        $dataArmors[id].name = "Empty Armor Slot " + id;
        $dataArmors[id].description = "Reserved for procedural generation";
        $dataArmors[id].note = "<Category: Procedural>\n<Procedural: true>";
        $dataArmors[id].iconIndex = 128 + (i % 16); // Assign a generic armor icon
        $dataArmors[id].price = 0;
        $dataArmors[id].atypeId = 0;
        $dataArmors[id].etypeId = 1; // Default to body armor
        $dataArmors[id].params = [0, 0, 0, 0, 0, 0, 0, 0]; // All stats at 0
        $dataArmors[id].traits = [];
        $dataArmors[id].isGenerated = false;
    }
}

// Generate a bizarrely random artifact name
function generateArtifactName() {
    const prefix = artifactPrefixes[Math.floor(Math.random() * artifactPrefixes.length)];
    const noun = artifactNouns[Math.floor(Math.random() * artifactNouns.length)];
    const suffix = artifactSuffixes[Math.floor(Math.random() * artifactSuffixes.length)];
    
    // Additional bizarre name elements and modifiers
    const nameFormats = [
        // Standard with hyphenated prefix
        () => prefix + noun + " " + suffix,
        
        // Reversed order with strange punctuation
        () => noun + " " + suffix + " [" + prefix.replace("-", "") + "]",
        
        // Fragmented with unusual separators
        () => prefix + noun + ":::" + suffix.replace(" ", "/"),
        
        // Glitched text simulation
        () => prefix.toUpperCase() + "<" + noun + ">" + suffix.toLowerCase(),
        
        // With numeric designations
        () => prefix + noun + " " + suffix + " [v" + (Math.floor(Math.random() * 9) + 1) + "." + (Math.floor(Math.random() * 99) + 1) + "]",
        
        // With strange symbols
        () => "†" + prefix + noun + "†" + " " + suffix,
        
        // With reversed elements
        () => prefix + noun.split("").reverse().join("") + " " + suffix,
        
        // Nested parentheses
        () => prefix + "(" + noun + "(" + suffix + "))",
        
        // Serial number format
        () => "X-" + (Math.floor(Math.random() * 999) + 1) + "-" + prefix.replace("-", "") + "/" + noun,
        
        // Binary prefix
        () => "0b" + Math.floor(Math.random() * 256).toString(2) + " " + prefix + noun,
        
        // Hex code format
        () => "#" + Math.floor(Math.random() * 16777215).toString(16).toUpperCase() + ":" + prefix + noun,
        
        // URL-like format
        () => prefix.replace("-", "") + "://" + noun.toLowerCase() + "." + suffix.replace(/\s+/g, "-").toLowerCase(),
        
        // Mathematical notation
        () => "∫" + prefix + "(" + noun + ")d" + suffix.split(" ")[1],
        
        // Chemical formula style
        () => prefix.replace("-", "") + noun.charAt(0) + Math.floor(Math.random() * 9 + 1) + noun.charAt(1) + Math.floor(Math.random() * 9 + 1),
        
        // Redacted format
        () => prefix + "[REDACTED]" + " " + suffix,
        
        // Corrupted text
        () => prefix + noun + " " + suffix.split("").map(c => Math.random() > 0.8 ? '?' : c).join(""),
        
        // Terminal command style
        () => "sudo " + prefix.toLowerCase() + noun.toLowerCase() + " --" + suffix.replace(/\s+/g, "-").toLowerCase(),
        
        // Mixed caps
        () => prefix + noun.split("").map((c, i) => i % 2 === 0 ? c.toUpperCase() : c.toLowerCase()).join("") + " " + suffix,
        
        // Nested brackets
        () => prefix + "[[" + noun + "]]" + " " + suffix,
        
        // Quantum superposition format
        () => prefix + "(" + noun + "+" + artifactNouns[Math.floor(Math.random() * artifactNouns.length)] + ")/√2" + " " + suffix,
        
        // Inverted case
        () => prefix.toLowerCase() + noun.toUpperCase() + " " + suffix,
        
        // File extension format
        () => prefix + noun + "." + suffix.split(" ")[1].substring(0, 3),
        
        // Time code format
        () => prefix + "[" + Math.floor(Math.random() * 24) + ":" + Math.floor(Math.random() * 60) + ":" + Math.floor(Math.random() * 60) + "]" + noun,
        
        // With emoji
        () => "⚠️ " + prefix + noun + " " + suffix,
        
        // Matrix coordinate style
        () => prefix + "[" + Math.floor(Math.random() * 9) + "," + Math.floor(Math.random() * 9) + "," + Math.floor(Math.random() * 9) + "]" + " " + noun,
        
        // Register notation
        () => prefix + noun + " " + suffix + " R" + Math.floor(Math.random() * 32),
        
        // Compound weird format (multiple of the above combined)
        () => {
            const innerPrefix = artifactPrefixes[Math.floor(Math.random() * artifactPrefixes.length)];
            return prefix.toUpperCase() + "{" + innerPrefix + noun + "}" + " " + suffix;
        },
        
        // ROT13-style encoding (simplified)
        () => prefix + noun.split("").map(c => {
            const code = c.charCodeAt(0);
            if (code >= 65 && code <= 90) return String.fromCharCode(((code - 65 + 13) % 26) + 65);
            if (code >= 97 && code <= 122) return String.fromCharCode(((code - 97 + 13) % 26) + 97);
            return c;
        }).join("") + " " + suffix,
        
        // Strikethrough simulation
        () => prefix + noun.split("").join('\u0336') + " " + suffix,
        
        // Recursive naming
        () => prefix + noun + " " + suffix + " " + prefix + noun,
        
        // Coordinate grid reference
        () => "[" + String.fromCharCode(65 + Math.floor(Math.random() * 26)) + Math.floor(Math.random() * 100) + "] " + prefix + noun,
        
        // Alternate dimension designation
        () => "Earth-" + Math.floor(Math.random() * 10000) + " " + prefix + noun,
        
        // Network address style
        () => "192.168." + Math.floor(Math.random() * 256) + "." + Math.floor(Math.random() * 256) + "/" + prefix.replace("-", "") + noun,
        
        // Cryptic ID format
        () => "SCP-" + Math.floor(Math.random() * 6000) + ": " + prefix + noun,
        
        // Corrupted text with Unicode
        () => prefix + noun.split("").map(c => Math.random() > 0.7 ? String.fromCharCode(c.charCodeAt(0) + 768 + Math.floor(Math.random() * 20)) : c).join("") + " " + suffix,
        
        // Warning label format
        () => "DANGER: CLASS-" + Math.floor(Math.random() * 5 + 1) + " " + prefix + noun,
        
        // Logical operation format
        () => prefix + "(" + noun + " ⊕ " + suffix.split(" ")[1] + ")",
        
        // Base64-like format
        () => prefix + noun + "==" + suffix.replace(/\s+/g, "+"),
        
        // Temporal coordinates
        () => "T-" + Math.floor(Math.random() * 10000) + " " + prefix + noun
    ];
    
    // Choose a random format
    const formatFunc = nameFormats[Math.floor(Math.random() * nameFormats.length)];
    return formatFunc();
}

// Generate random effects based on level
function generateEffects(level) {
    const effects = [];
    const effectCount = Math.floor(level / 20) + 1; // 1-5 effects based on level
    
    for (let i = 0; i < effectCount; i++) {
        const effectTemplate = effectTypes[Math.floor(Math.random() * effectTypes.length)];
        const effect = { ...effectTemplate };
        
        // Set effect value based on level
        if (effect.type === "addParam") {
            effect.value = Math.floor(level * (1 + Math.random()));
            effect.params = [...effectTemplate.params, effect.value];
        } else if (effect.type === "addState" || effect.type === "removeState") {
            // Random state ID between 1-10
            const stateId = Math.floor(Math.random() * 10) + 1;
            effect.params = [stateId, 1.0]; // State ID and rate
        } else if (effect.type === "addDebuff" || effect.type === "removeDebuff") {
            const paramId = Math.floor(Math.random() * 8);
            effect.params = [paramId, 3, 1.0]; // Param ID, turns, and rate
        }
        
        effects.push(effect);
    }
    
    return effects;
}

// Generate description text based on effects
function generateDescription(effects, level) {
    let desc = "Level " + level + " Artifact\n";
    
    effects.forEach(effect => {
        if (effect.type === "addParam" && effect.params.length >= 2) {
            desc += "+" + effect.params[1] + " " + effect.text + "\n";
        } else {
            desc += effect.text + "\n";
        }
    });
    
    return desc.trim();
}

// Find an available artifact slot
function findAvailableArtifactSlot() {
    for (let i = 0; i < ARTIFACT_COUNT; i++) {
        const id = ARTIFACT_START_ID + i;
        if (!$dataItems[id].isGenerated) {
            return id;
        }
    }
    return -1; // No slots available
}

// Find an available weapon slot
function findAvailableWeaponSlot() {
    for (let i = 0; i < WEAPON_COUNT; i++) {
        const id = WEAPON_START_ID + i;
        if (!$dataWeapons[id].isGenerated) {
            return id;
        }
    }
    return -1; // No slots available
}

// Find an available armor slot
function findAvailableArmorSlot() {
    for (let i = 0; i < ARMOR_COUNT; i++) {
        const id = ARMOR_START_ID + i;
        if (!$dataArmors[id].isGenerated) {
            return id;
        }
    }
    return -1; // No slots available
}

// Generate a single artifact
function generateArtifact(level) {
    // Cap level between 1-99
    level = Math.max(1, Math.min(99, level));
    
    // Find an available slot
    const id = findAvailableArtifactSlot();
    if (id === -1) {
        console.error("No available artifact slots!");
        return -1;
    }
    
    // Generate artifact properties
    const name = generateArtifactName();
    const effects = generateEffects(level);
    const description = generateDescription(effects, level);
    const iconIndex = 176 + Math.floor(Math.random() * 8); // Choose from better looking icons
    const price = level * 100 * (1 + Math.floor(Math.random() * 5));
    
    // Update the item
    $dataItems[id].name = name;
    $dataItems[id].description = description;
    $dataItems[id].iconIndex = iconIndex;
    $dataItems[id].price = price;
    $dataItems[id].effects = effects;
    $dataItems[id].meta = { 
        Category: "Artifact", 
        Procedural: true, 
        Level: level 
    };
    $dataItems[id].isGenerated = true;
    
    console.log("Generated artifact ID: " + id + " - " + name); // Add debug logging
    
    return id;
}

// Reset all artifact slots
function resetArtifactSlots() {
    for (let i = 0; i < ARTIFACT_COUNT; i++) {
        const id = ARTIFACT_START_ID + i;
        $dataItems[id].isGenerated = false;
        $dataItems[id].name = "Empty Artifact Slot " + id;
        $dataItems[id].description = "Reserved for procedural generation";
    }
}

// Reset all weapon slots
function resetWeaponSlots() {
    for (let i = 0; i < WEAPON_COUNT; i++) {
        const id = WEAPON_START_ID + i;
        $dataWeapons[id].isGenerated = false;
        $dataWeapons[id].name = "Empty Weapon Slot " + id;
        $dataWeapons[id].description = "Reserved for procedural generation";
    }
}

// Reset all armor slots
function resetArmorSlots() {
    for (let i = 0; i < ARMOR_COUNT; i++) {
        const id = ARMOR_START_ID + i;
        $dataArmors[id].isGenerated = false;
        $dataArmors[id].name = "Empty Armor Slot " + id;
        $dataArmors[id].description = "Reserved for procedural generation";
    }
}

// Plugin command processing
const pluginName = "ProceduralItemGenerator";

// Generate all procedural items with random levels
function generateAllRandom() {
    resetArtifactSlots();
    resetWeaponSlots();
    resetArmorSlots();
    
    // Generate artifacts for all available slots
    for (let i = 0; i < ARTIFACT_COUNT; i++) {
        const level = Math.floor(Math.random() * 99) + 1; // Random level 1-99
        generateArtifact(level);
    }
    
    // Generate weapons for all available slots
    for (let i = 0; i < WEAPON_COUNT; i++) {
        const level = Math.floor(Math.random() * 99) + 1; // Random level 1-99
        const type = Math.floor(Math.random() * 9) + 1; // Random weapon type 1-9
        generateWeapon(level, type);
    }
    
    // Generate armor for all available slots
    for (let i = 0; i < ARMOR_COUNT; i++) {
        const level = Math.floor(Math.random() * 99) + 1; // Random level 1-99
        const type = Math.floor(Math.random() * 5) + 1; // Random armor type 1-5
        generateArmor(level, type);
    }
    
    console.log("Generated all procedural items with random levels");
}

// Get player level - depends on your game's level structure
function getPlayerLevel() {
    // Default to leader's level if available
    if ($gameParty && $gameParty.leader()) {
        return $gameParty.leader().level;
    }
    
    // Fallback to a random level if no leader available
    return Math.floor(Math.random() * 99) + 1;
}

// Add a level-appropriate artifact to inventory
function addLevelAppropriateArtifact() {
    const playerLevel = getPlayerLevel();
    
    // Generate a level close to the player's level (±5 levels, capped at 1-99)
    const levelVariance = Math.floor(Math.random() * 11) - 5; // -5 to +5
    const artifactLevel = Math.max(1, Math.min(99, playerLevel + levelVariance));
    
    const artifactId = generateArtifact(artifactLevel);
    if (artifactId > 0) {
        $gameParty.gainItem($dataItems[artifactId], 1);
        console.log("Added level-appropriate artifact: " + $dataItems[artifactId].name + " (Level " + artifactLevel + ") to inventory");
        console.log("Current inventory count: " + $gameParty.numItems($dataItems[artifactId]));
    } else {
        console.error("Failed to add artifact to inventory - invalid ID returned");
    }
}

// Add a totally random artifact to inventory
function addRandomArtifact() {
    const level = Math.floor(Math.random() * 99) + 1; // Random level 1-99
    const artifactId = generateArtifact(level);
    if (artifactId > 0) {
        $gameParty.gainItem($dataItems[artifactId], 1);
        console.log("Added random artifact: " + $dataItems[artifactId].name + " (Level " + level + ") to inventory");
        console.log("Current inventory count: " + $gameParty.numItems($dataItems[artifactId]));
    } else {
        console.error("Failed to add artifact to inventory - invalid ID returned");
    }
}

// MV and older plugin command handling
const _Game_Interpreter_pluginCommand = Game_Interpreter.prototype.pluginCommand;
Game_Interpreter.prototype.pluginCommand = function(command, args) {
    _Game_Interpreter_pluginCommand.call(this, command, args);
    
    if (command === "GenerateAllRandom") {
        generateAllRandom();
    } else if (command === "RandomArtifactByLevel") {
        addLevelAppropriateArtifact();
    } else if (command === "RandomArtifact") {
        addRandomArtifact();
    }
};

// MZ plugin command handling (if MZ is detected)
if (Utils.RPGMAKER_NAME === "MZ") {
    PluginManager.registerCommand(pluginName, "GenerateAllRandom", args => {
        generateAllRandom();
    });
    
    PluginManager.registerCommand(pluginName, "RandomArtifactByLevel", args => {
        addLevelAppropriateArtifact();
    });
    
    PluginManager.registerCommand(pluginName, "RandomArtifact", args => {
        addRandomArtifact();
    });
}

// Add methods to Game_System to generate items programmatically
Game_System.prototype.generateArtifact = function(level) {
    return generateArtifact(level);
};

Game_System.prototype.generateWeapon = function(level, type) {
    return generateWeapon(level, type);
};

Game_System.prototype.generateArmor = function(level, type) {
    return generateArmor(level, type);
};

// Enhance item display to show procedural item properties
const _Window_ItemList_drawItem = Window_ItemList.prototype.drawItem;
Window_ItemList.prototype.drawItem = function(index) {
    const item = this._data[index];
    if (item && item.meta && (item.meta.Category === "Artifact" || item.meta.Category === "Procedural")) {
        const rect = this.itemRect(index);
        const iconBoxWidth = Window_Base._iconWidth + 4;
        
        // Draw icon
        this.drawIcon(item.iconIndex, rect.x, rect.y + 2);
        
        // Choose color based on category
        if (item.meta.Category === "Artifact") {
            this.changeTextColor(this.textColor(3)); // Color 3 (blue) for artifacts
        } else if (item.meta.Category === "Procedural") {
            // Check if it's a weapon or armor and use different colors
            if (DataManager.isWeapon(item)) {
                this.changeTextColor(this.textColor(2)); // Color 2 (green) for weapons
            } else if (DataManager.isArmor(item)) {
                this.changeTextColor(this.textColor(6)); // Color 6 (cyan) for armor
            }
        }
        
        // Draw item name
        this.drawText(item.name, rect.x + iconBoxWidth, rect.y, rect.width - iconBoxWidth);
        
        // Reset text color
        this.resetTextColor();
    } else {
        _Window_ItemList_drawItem.call(this, index);
    }
};
// Generate weapon description
function generateWeaponDescription(level, typeId, traits, params) {
    let desc = "Level " + level + " " + weaponNouns[typeId][0] + "\n";
    
    // Add attack value
    desc += "Attack Power: " + params[2] + "\n";
    
    // Add any bonus stats
    const statNames = ["Max HP", "Max MP", "", "Defense", "Magic", "Magic Def", "Agility", "Luck"];
    for (let i = 0; i < params.length; i++) {
        if (i !== 2 && params[i] > 0) { // Skip the attack stat (already shown)
            desc += "+" + params[i] + " " + statNames[i] + "\n";
        }
    }
    
    // Add traits descriptions
    traits.forEach(trait => {
        if (trait.code === 31) { // Element Rate
            const elementNames = ["", "", "", "Fire", "Ice", "Thunder", "Water", "Earth", "Wind", "Holy", "Dark"];
            desc += "Imbued with " + elementNames[trait.dataId] + " element\n";
        } else if (trait.code === 32) { // Attack State
            const stateNames = ["", "", "", "", "Poison", "Blind", "Silence", "Rage", "Confusion", "Fascination", "Sleep", "Paralysis"];
            const chance = Math.floor(trait.value * 100);
            desc += chance + "% chance to inflict " + stateNames[trait.dataId] + "\n";
        } else if (trait.code === 22) { // Critical Rate
            const bonus = Math.floor((trait.value - 1) * 100);
            desc += "+" + bonus + "% critical hit rate\n";
        } else if (trait.code === 34) { // Attack Times+
            desc += "Hits twice per attack\n";
        } else if (trait.code === 21) { // Param Rate
            const statNames = ["Max HP", "Max MP", "Attack", "Defense", "Magic", "Magic Def", "Agility", "Luck"];
            const bonus = Math.floor((trait.value - 1) * 100);
            desc += "+" + bonus + "% " + statNames[trait.dataId] + "\n";
        }
    });
    
    // Add flavor text based on level
    if (level < 30) {
        desc += "\nA decent weapon for an adventurer.";
    } else if (level < 60) {
        desc += "\nA powerful weapon forged by master craftsmen.";
    } else if (level < 90) {
        desc += "\nAn exceptional weapon of legendary quality.";
    } else {
        desc += "\nA divine weapon of incomparable power.";
    }
    
    return desc;
}

// Generate armor description
function generateArmorDescription(level, typeId, traits, params) {
    let desc = "Level " + level + " " + armorNouns[typeId][0] + "\n";
    
    // Add defense value
    desc += "Defense: " + params[3] + "\n";
    
    // Add any bonus stats
    const statNames = ["Max HP", "Max MP", "Attack", "", "Magic", "Magic Def", "Agility", "Luck"];
    for (let i = 0; i < params.length; i++) {
        if (i !== 3 && params[i] > 0) { // Skip the defense stat (already shown)
            desc += "+" + params[i] + " " + statNames[i] + "\n";
        }
    }
    
    // Add traits descriptions
    traits.forEach(trait => {
        if (trait.code === 11) { // Element Rate
            const elementNames = ["", "", "", "Fire", "Ice", "Thunder", "Water", "Earth", "Wind", "Holy", "Dark"];
            const resistance = Math.floor((1 - trait.value) * 100);
            desc += resistance + "% " + elementNames[trait.dataId] + " resistance\n";
        } else if (trait.code === 13) { // State Rate
            const stateNames = ["", "", "", "", "Poison", "Blind", "Silence", "Rage", "Confusion", "Fascination", "Sleep", "Paralysis"];
            const resistance = Math.floor((1 - trait.value) * 100);
            desc += resistance + "% " + stateNames[trait.dataId] + " resistance\n";
        } else if (trait.code === 21) { // Param Rate
            const statNames = ["Max HP", "Max MP", "Attack", "Defense", "Magic", "Magic Def", "Agility", "Luck"];
            const bonus = Math.floor((trait.value - 1) * 100);
            desc += "+" + bonus + "% " + statNames[trait.dataId] + "\n";
        } else if (trait.code === 23) { // TP Charge Rate
            const bonus = Math.floor((trait.value - 1) * 100);
            desc += "+" + bonus + "% TP gained from actions\n";
        } else if (trait.code === 14) { // State Immunity
            const stateNames = ["", "Regen", "Guard", "Immortal", "Poison", "Blind", "Silence", "Rage"];
            desc += "Auto-" + stateNames[trait.dataId] + " at battle start\n";
        }
    });
    
    // Add flavor text based on level
    if (level < 30) {
        desc += "\nA decent piece of protective gear.";
    } else if (level < 60) {
        desc += "\nA superior armor crafted with exceptional skill.";
    } else if (level < 90) {
        desc += "\nAn extraordinary protective item of legendary renown.";
    } else {
        desc += "\nA divine armor that grants unparalleled protection.";
    }
    
    return desc;
}    // Generate weapon traits based on level
function generateWeaponTraits(level) {
    const traits = [];
    
    // Add elemental property (chance increases with level)
    if (Math.random() < 0.2 + (level / 200)) {
        const elements = [3, 4, 5, 6, 7, 8, 9]; // Standard elements (fire, ice, thunder, etc.)
        const element = elements[Math.floor(Math.random() * elements.length)];
        
        traits.push({
            code: 31, // Element Rate
            dataId: element,
            value: 1.0 // Attack has this element
        });
    }
    
    // Add state infliction (chance increases with level)
    if (Math.random() < 0.15 + (level / 300)) {
        const states = [4, 5, 6, 7, 8, 9, 10]; // Standard debilitating states (poison, blind, silence, etc.)
        const state = states[Math.floor(Math.random() * states.length)];
        const chance = 0.1 + (level / 300); // 10% base + up to 33% at level 99
        
        traits.push({
            code: 32, // Attack State
            dataId: state,
            value: chance // Chance to inflict state
        });
    }
    
    // Add critical hit bonus (rarer, for higher level weapons)
    if (Math.random() < 0.05 + (level / 400)) {
        traits.push({
            code: 22, // Attack Speed
            dataId: 0,
            value: 0.15 + (level / 300) // 15% base + up to 33% at level 99
        });
    }
    
    // Add attack hits+ (very rare, for high level weapons)
    if (Math.random() < 0.02 + (level / 500)) {
        traits.push({
            code: 34, // Attack Times+
            dataId: 0,
            value: 1 // One additional attack
        });
    }
    
    // Add parameter boost traits
    const statChance = 0.1 + (level / 300);
    if (Math.random() < statChance) {
        const paramId = Math.floor(Math.random() * 8);
        const boost = 1.0 + (level / 200); // Up to 50% boost at level 99
        
        traits.push({
            code: 21, // Param Rate
            dataId: paramId,
            value: boost
        });
    }
    
    return traits;
}

// Generate armor traits based on level
function generateArmorTraits(level) {
    const traits = [];
    
    // Add elemental resistance (chance increases with level)
    if (Math.random() < 0.25 + (level / 200)) {
        const elements = [3, 4, 5, 6, 7, 8, 9]; // Standard elements (fire, ice, thunder, etc.)
        const element = elements[Math.floor(Math.random() * elements.length)];
        const resistance = 1.0 - (0.2 + (level / 400)); // 20% to 45% resistance
        
        traits.push({
            code: 11, // Element Rate
            dataId: element,
            value: resistance
        });
    }
    
    // Add state resistance (chance increases with level)
    if (Math.random() < 0.2 + (level / 200)) {
        const states = [4, 5, 6, 7, 8, 9, 10]; // Standard debilitating states (poison, blind, silence, etc.)
        const state = states[Math.floor(Math.random() * states.length)];
        const resistance = 1.0 - (0.15 + (level / 300)); // 15% to 48% resistance
        
        traits.push({
            code: 13, // State Rate
            dataId: state,
            value: resistance
        });
    }
    
    // Add parameter boost traits
    const statChance = 0.15 + (level / 300);
    if (Math.random() < statChance) {
        const paramId = Math.floor(Math.random() * 8);
        const boost = 1.0 + (level / 200); // Up to 50% boost at level 99
        
        traits.push({
            code: 21, // Param Rate
            dataId: paramId,
            value: boost
        });
    }
    
    // Add special effects for higher level armor
    if (level > 50) {
        // Chance for TP generation trait
        if (Math.random() < 0.1) {
            traits.push({
                code: 23, // TP Charge Rate
                dataId: 0,
                value: 1.1 + ((level - 50) / 100) // 10% to 60% boost
            });
        }
        
        // Chance for automatic state (e.g., auto-regen, etc.)
        if (Math.random() < 0.05) {
            const goodStates = [1, 2, 3]; // Beneficial states like auto-regen
            const state = goodStates[Math.floor(Math.random() * goodStates.length)];
            
            traits.push({
                code: 14, // State Immunity
                dataId: state,
                value: 1.0
            });
        }
    }
    
    return traits;
}    // Generate a weapon name
function generateWeaponName(typeId) {
    const prefix = weaponPrefixes[Math.floor(Math.random() * weaponPrefixes.length)];
    const nouns = weaponNouns[typeId] || weaponNouns[1]; // Default to swords if type is invalid
    const noun = nouns[Math.floor(Math.random() * nouns.length)];
    const suffix = Math.random() > 0.5 ? " " + weaponSuffixes[Math.floor(Math.random() * weaponSuffixes.length)] : "";
    
    // Determine naming pattern
    const namePatterns = [
        // Standard name with prefix and possibly suffix
        () => prefix + " " + noun + suffix,
        
        // "The X" format
        () => "The " + prefix + " " + noun + suffix,
        
        // Name with level-indicating mark
        () => prefix + " " + noun + " +" + (Math.floor(Math.random() * 5) + 1) + suffix,
        
        // More formalized name
        () => prefix + "'s " + noun + suffix,
        
        // Mythological reference
        () => noun + " of " + prefix + " Fury" + suffix,
        
        // Simple but effective
        () => prefix + " " + noun,
        
        // "X of the Y" format
        () => noun + " of the " + prefix
    ];
    
    // Choose a random format
    const formatFunc = namePatterns[Math.floor(Math.random() * namePatterns.length)];
    return formatFunc();
}

// Generate an armor name
function generateArmorName(typeId) {
    const prefix = armorPrefixes[Math.floor(Math.random() * armorPrefixes.length)];
    const nouns = armorNouns[typeId] || armorNouns[2]; // Default to body armor if type is invalid
    const noun = nouns[Math.floor(Math.random() * nouns.length)];
    const suffix = Math.random() > 0.5 ? " " + armorSuffixes[Math.floor(Math.random() * armorSuffixes.length)] : "";
    
    // Determine naming pattern
    const namePatterns = [
        // Standard name with prefix and possibly suffix
        () => prefix + " " + noun + suffix,
        
        // "The X" format
        () => "The " + prefix + " " + noun + suffix,
        
        // Name with level-indicating mark
        () => prefix + " " + noun + " +" + (Math.floor(Math.random() * 5) + 1) + suffix,
        
        // More formalized name
        () => prefix + "'s " + noun + suffix,
        
        // Mythological reference
        () => noun + " of " + prefix + " Protection" + suffix,
        
        // Simple but effective
        () => prefix + " " + noun,
        
        // "X of the Y" format
        () => noun + " of the " + prefix
    ];
    
    // Choose a random format
    const formatFunc = namePatterns[Math.floor(Math.random() * namePatterns.length)];
    return formatFunc();
}    // Generate a procedural weapon
function generateWeapon(level, typeId) {
    // Cap level between 1-99
    level = Math.max(1, Math.min(99, level));
    
    // Find an available slot
    const id = findAvailableWeaponSlot();
    if (id === -1) {
        console.error("No available weapon slots!");
        return -1;
    }
    
    // Determine weapon type if not specified
    if (!typeId || !weaponNouns[typeId]) {
        typeId = Math.floor(Math.random() * 9) + 1; // Random weapon type 1-9
    }
    
    // Generate base stats based on level
    const baseDamage = Math.floor(5 + (level * 1.5));
    const params = [0, 0, baseDamage, 0, 0, 0, 0, 0]; // Set attack stat
    
    // Add random bonus stats
    const statCount = Math.floor(level / 20) + 1; // 1-5 bonus stats based on level
    for (let i = 0; i < statCount; i++) {
        const statIndex = Math.floor(Math.random() * 8);
        if (statIndex !== 2) { // Skip attack stat since we already set it
            params[statIndex] += Math.floor(level * 0.5 * (0.5 + Math.random()));
        }
    }
    
    // Generate name
    const name = generateWeaponName(typeId);
    
    // Generate weapon traits
    const traits = generateWeaponTraits(level);
    
    // Generate description
    const description = generateWeaponDescription(level, typeId, traits, params);
    
    // Set icon based on weapon type
    const typeIconBase = {
        1: 96,   // Swords
        2: 100,  // Spears
        3: 104,  // Axes
        4: 108,  // Maces
        5: 102,  // Bows
        6: 110,  // Daggers
        7: 101,  // Staves
        8: 111,  // Guns
        9: 106   // Hand weapons
    };
    const iconIndex = typeIconBase[typeId] + Math.floor(Math.random() * 4); // Variation within type
    
    // Calculate price based on level and traits
    const price = level * 200 * (1 + traits.length * 0.5) * (1 + Math.floor(Math.random() * 3));
    
    // Update the weapon
    $dataWeapons[id].name = name;
    $dataWeapons[id].description = description;
    $dataWeapons[id].iconIndex = iconIndex;
    $dataWeapons[id].price = price;
    $dataWeapons[id].params = params;
    $dataWeapons[id].traits = traits;
    $dataWeapons[id].wtypeId = typeId;
    $dataWeapons[id].meta = {
        Category: "Procedural",
        Procedural: true,
        Level: level,
        Type: typeId
    };
    $dataWeapons[id].isGenerated = true;
    
    return id;
}

// Generate a procedural armor
function generateArmor(level, typeId) {
    // Cap level between 1-99
    level = Math.max(1, Math.min(99, level));
    
    // Find an available slot
    const id = findAvailableArmorSlot();
    if (id === -1) {
        console.error("No available armor slots!");
        return -1;
    }
    
    // Determine armor type if not specified (1-5)
    if (!typeId || !armorNouns[typeId]) {
        typeId = Math.floor(Math.random() * 5) + 1; // Random armor type 1-5
    }
    
    // Set etypeId based on type
    const etypeIdMap = {
        1: 3, // Head
        2: 4, // Body
        3: 2, // Shield
        4: 5, // Arms
        5: 6  // Legs
    };
    
    // Generate base stats based on level
    const baseDefense = Math.floor(3 + (level * 1.2));
    const params = [0, 0, 0, baseDefense, 0, 0, 0, 0]; // Set defense stat
    
    // Add random bonus stats
    const statCount = Math.floor(level / 20) + 1; // 1-5 bonus stats based on level
    for (let i = 0; i < statCount; i++) {
        const statIndex = Math.floor(Math.random() * 8);
        if (statIndex !== 3) { // Skip defense stat since we already set it
            params[statIndex] += Math.floor(level * 0.5 * (0.5 + Math.random()));
        }
    }
    
    // Generate name
    const name = generateArmorName(typeId);
    
    // Generate armor traits
    const traits = generateArmorTraits(level);
    
    // Generate description
    const description = generateArmorDescription(level, typeId, traits, params);
    
    // Set icon based on armor type
    const typeIconBase = {
        1: 128, // Head
        2: 135, // Body
        3: 144, // Shield
        4: 149, // Arms
        5: 152  // Legs
    };
    const iconIndex = typeIconBase[typeId] + Math.floor(Math.random() * 4); // Variation within type
    
    // Calculate price based on level and traits
    const price = level * 150 * (1 + traits.length * 0.5) * (1 + Math.floor(Math.random() * 3));
    
    // Update the armor
    $dataArmors[id].name = name;
    $dataArmors[id].description = description;
    $dataArmors[id].iconIndex = iconIndex;
    $dataArmors[id].price = price;
    $dataArmors[id].params = params;
    $dataArmors[id].traits = traits;
    $dataArmors[id].atypeId = 1; // Default to all armor types can equip
    $dataArmors[id].etypeId = etypeIdMap[typeId];
    $dataArmors[id].meta = {
        Category: "Procedural",
        Procedural: true,
        Level: level,
        Type: typeId
    };
    $dataArmors[id].isGenerated = true;
    
    return id;
}    // Weapon name generation components
const weaponPrefixes = [
    "Vicious", "Savage", "Bloodthirsty", "Wicked", "Brutal", 
    "Merciless", "Ruinous", "Destructive", "Devastating", "Raging",
    "Frenzied", "Furious", "Violent", "Chaotic", "Cataclysmic",
    "Annihilating", "Slaughtering", "Butchering", "Crushing", "Pulverizing",
    "Void-", "Blood-", "Doom-", "Death-", "Shadow-", 
    "Nightmare-", "Terror-", "Havoc-", "Massacre-", "Carnage-",
    "Corrupted", "Twisted", "Warped", "Cursed", "Unholy",
    "Demonic", "Abyssal", "Infernal", "Hellish", "Fiendish"
];

const weaponNouns = {
    1: ["Sword", "Blade", "Saber", "Rapier", "Cutlass", "Scimitar", "Claymore", "Longsword"], // Swords
    2: ["Spear", "Lance", "Halberd", "Pike", "Trident", "Glaive", "Partisan", "Javelin"], // Spears
    3: ["Axe", "Hatchet", "Tomahawk", "Battleaxe", "Cleaver", "Hacker", "Chopper", "Divider"], // Axes
    4: ["Mace", "Club", "Hammer", "Flail", "Morningstar", "Maul", "Bludgeon", "Crusher"], // Maces
    5: ["Bow", "Longbow", "Shortbow", "Recurve", "Composite", "Greatbow", "Warbow", "Deathbow"], // Bows
    6: ["Dagger", "Knife", "Dirk", "Stiletto", "Kris", "Shiv", "Skewer", "Ripper"], // Daggers
    7: ["Staff", "Rod", "Wand", "Scepter", "Cane", "Focus", "Stave", "Baton"], // Staves
    8: ["Gun", "Pistol", "Rifle", "Shotgun", "Cannon", "Blaster", "Revolver", "Carbine"], // Guns
    9: ["Gauntlet", "Fist", "Claw", "Knuckle", "Cestus", "Talon", "Grip", "Hand"] // Hand weapons
};

const weaponSuffixes = [
    "of Slaughter", "of Carnage", "of Bloodshed", "of Destruction", "of Annihilation",
    "of the Abyss", "of the Void", "of Oblivion", "of Doom", "of Ruin",
    "of Despair", "of Misery", "of Anguish", "of Torment", "of Pain",
    "of the Beast", "of the Demon", "of the Fiend", "of the Devil", "of the Dragon",
    "of Corruption", "of Agony", "of Suffering", "of Venom", "of Poison",
    "of Twilight", "of Midnight", "of Darkness", "of Shadows", "of Night",
    "of the Grave", "of Death", "of the End", "of Extinction", "of Termination"
];

// Armor name generation components
const armorPrefixes = [
    "Impenetrable", "Unbreakable", "Resilient", "Indomitable", "Unyielding", 
    "Steadfast", "Resolute", "Dauntless", "Stalwart", "Immovable",
    "Adamant", "Fortified", "Reinforced", "Bolstered", "Strengthened",
    "Hardened", "Tempered", "Forged", "Galvanized", "Steeled",
    "Titan-", "Dragon-", "God-", "Angel-", "Paladin-", 
    "Guardian-", "Warden-", "Defender-", "Protector-", "Sentinel-",
    "Sacred", "Divine", "Hallowed", "Blessed", "Holy",
    "Celestial", "Astral", "Ethereal", "Empyrean", "Transcendent"
];

const armorNouns = {
    1: ["Helm", "Helmet", "Headguard", "Crown", "Circlet", "Coif", "Hood", "Mask"], // Head
    2: ["Armor", "Breastplate", "Cuirass", "Chestguard", "Hauberk", "Plate", "Mail", "Vest"], // Body
    3: ["Shield", "Bulwark", "Aegis", "Barrier", "Blockade", "Ward", "Guard", "Defender"], // Shield
    4: ["Gauntlet", "Glove", "Grip", "Handguard", "Bracer", "Vambrace", "Fist", "Grasp"], // Hands
    5: ["Greaves", "Leggings", "Cuisses", "Schynbalds", "Poleyns", "Tassets", "Sabatons", "Boots"] // Legs
};

const armorSuffixes = [
    "of Protection", "of Defense", "of Shielding", "of Warding", "of Guarding",
    "of Fortitude", "of Endurance", "of Resilience", "of Tenacity", "of Perseverance",
    "of the Guardian", "of the Sentinel", "of the Warden", "of the Defender", "of the Protector",
    "of the Immortal", "of the Undying", "of the Eternal", "of the Unyielding", "of the Steadfast",
    "of Deflection", "of Resistance", "of Immunity", "of Negation", "of Invulnerability",
    "of Dawn", "of Light", "of Radiance", "of Brilliance", "of Glory",
    "of the Mountain", "of the Fortress", "of the Citadel", "of the Bastion", "of the Bulwark"
];
})();
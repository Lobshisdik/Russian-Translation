const fs = require('fs');
const path = require('path');

// Biome presets from SpriteCharAssigner.html
const BIOME_PRESETS = {
  "Infernal": ["Hell", "Volcano", "Crypt"],
  "Aquatic": ["Ocean", "Beach", "SeaBed", "Lake", "River"],
  "Arctic": ["Ice", "Permafrost", "ForestIce", "MountainIce", "CityIce", "VillageIce", "BurgIce", "CaveIce", "Tundra"],
  "Desert": ["Desert", "MountainDesert", "CityDesert", "VillageDesert", "BurgDesert", "Canyon", "Badlands", "SaltFlats"],
  "Forest": ["Forest", "ForestTropical", "Jungle", "Bamboo", "Taiga", "SpiritWoods", "Mangrove"],
  "Urban": ["City", "Burg", "Village", "Metro", "Office", "Factory", "Spacecenter"],
  "Underground": ["Cave", "Dungeon", "Mines", "Underdark", "Crypt", "Sewer"],
  "Mountain": ["Mountain", "MountainIce", "MountainDesert", "VillageMountain", "Highlands"],
  "Wetlands": ["Swamp", "Mangrove", "RiverBank"],
  "Mystical": ["Heaven", "Eldritch", "Dreamscape", "Abstract", "Limbo", "Fairy", "Crystals"],
  "Civilization": ["City", "Village", "Burg", "Houses", "Villa", "Farm", "Park"],
  "Religious": ["ChurchInside", "Temple", "TempleShinto", "Graveyard"],
  "Industrial": ["Factory", "FactoryInside", "Laboratory", "Office", "Spacecenter"],
  "Ruins": ["Ruins", "Abandoned", "AbandonedInside"],
  "Alien": ["AlienPlanet", "Space", "Digital", "Abstract"],
  "WaterFresh": ["River", "Lake", "RiverBank", "Docks", "VillageRiver", "VillageSea"],
  "Grasslands": ["Fields", "Meadows", "Steppe", "Park"],
  "Dark": ["Dark tower", "Omega tower", "OmegaTower", "Hell", "Underdark", "Eldritch"],
  "Tropical": ["ForestTropical", "Jungle", "Beach", "Mangrove"],
  "Combat": ["Arena", "Castle", "CastleInside", "Dungeon"],
  "Transportation": ["Highway", "Road", "Train", "Metro", "Docks"],
  "Nature": ["Forest", "Fields", "Meadows", "Park", "Mushroom"],
  "Cosmic": ["Space", "AlienPlanet", "Digital", "Abstract", "Spacecenter"],
  "Horror": ["Eldritch", "Underdark", "Crypt", "Graveyard", "Dark tower", "Sewer"],
  "Agricultural": ["Farm", "Fields", "Meadows", "Village", "Houses"],
  "Coastal": ["Beach", "VillageSea"],
  "Technology": ["Digital", "Laboratory", "Spacecenter", "Factory", "Office", "Metro"],
  "Wasteland": ["Abandoned", "AbandonedInside", "Ruins", "Landfill", "Badlands"],
  "Volcanic": ["Volcano", "Hell", "Petro cave"],
  "Elemental": ["Crystals", "Ice", "Volcano", "SpiritWoods", "Heaven"],
  "Subterranean": ["Cave", "CaveFlooded", "CaveIce", "Mines", "Underdark", "Dungeon", "Petro cave"],
  "Celestial": ["Heaven", "Dreamscape", "Limbo", "Abstract", "Space"],
  "Corrupted": ["Eldritch", "Dark tower", "Omega tower", "OmegaTower", "Hell", "Sewer", "Underdark"],
  "Nomadic": ["Highway", "Road", "Train", "Metro", "Docks", "Desert"],
  "Magical": ["SpiritWoods", "Crystals", "Fairy", "Dreamscape", "Eldritch", "TempleShinto"],
  "Temperate": ["Forest", "Park", "Meadows", "Fields", "Village", "Houses"],
  "Settlement": ["Village", "VillageDesert", "VillageIce", "VillageMountain", "VillageRiver", "VillageSea"],
  "Fortress": ["Castle", "CastleInside", "Arena", "OmegaTower", "Dark tower"],
  "Sacred": ["Temple", "TempleShinto", "ChurchInside", "Heaven", "Graveyard"],
  "Polluted": ["Sewer", "Landfill", "Petro cave", "Factory", "Abandoned"],
  "Extreme": ["Hell", "Heaven", "Volcano", "Permafrost", "Underdark", "Omega tower"],
  "Fungal": ["Mushroom", "Cave", "Swamp", "Forest", "SpiritWoods"],
  "Barren": ["Desert", "Badlands", "SaltFlats", "Canyon", "Tundra", "Permafrost"],
  "Civilized": ["City", "Burg", "Village", "Park", "Houses", "Villa", "Ghent"],
  "Wilderness": ["Forest", "Jungle", "Taiga", "SpiritWoods", "Bamboo", "Mangrove", "Savannah"],
  "Savannah": ["Savannah"],
  "Labyrinth": ["Dungeon", "Castle", "Lair", "Mines", "Underdark", "CastleInside"],
  "Frozen": ["Ice", "Permafrost", "Snow", "Tundra", "CaveIce"],
  "Highlands": ["Mountain", "Highlands", "VillageMountain", "MountainDesert", "MountainIce"],
  "Abyssal": ["Underdark", "Eldritch", "Limbo", "Dark tower", "SeaBed", "CaveFlooded"]
};

// File paths
const jsonPath = path.join(__dirname, '..', 'data', 'Enemies.json');
const csvPath = path.join(__dirname, 'data', 'enemies.csv');

// Function to extract biomes from note field
function extractBiomes(note) {
  if (!note) return [];
  const biomeMatch = note.match(/<Biome:\s*([^>]+)>/);
  if (!biomeMatch) return [];

  // Split by comma and trim whitespace
  return biomeMatch[1].split(',').map(b => b.trim()).filter(b => b);
}

// Priority order for presets (higher priority = more specific/thematic)
const PRESET_PRIORITY = [
  "Infernal", "Arctic", "Desert", "Volcanic", "Abyssal", "Celestial",
  "Horror", "Aquatic", "Alien", "Cosmic", "Sacred", "Corrupted",
  "Frozen", "Tropical", "Underground", "Subterranean", "Mystical",
  "Forest", "Mountain", "Wetlands", "Fungal", "Wasteland",
  "Urban", "Civilization", "Industrial", "Religious", "Combat",
  "Labyrinth", "Fortress", "Ruins", "Dark", "Agricultural",
  "Grasslands", "Nature", "Temperate", "Wilderness", "Settlement",
  "Highlands", "Coastal", "Barren", "WaterFresh", "Transportation",
  "Magical", "Elemental", "Technology", "Polluted", "Extreme",
  "Nomadic", "Savannah", "Civilized"
];

// Function to infer preset from enemy name when no biome info exists
function inferPresetFromName(name) {
  const lowerName = name.toLowerCase();

  // Keyword matching for common enemy types
  if (lowerName.includes('ice') || lowerName.includes('frost') || lowerName.includes('frozen')) return "Arctic";
  if (lowerName.includes('fire') || lowerName.includes('flame') || lowerName.includes('infernal')) return "Infernal";
  if (lowerName.includes('desert') || lowerName.includes('sand')) return "Desert";
  if (lowerName.includes('water') || lowerName.includes('aqua') || lowerName.includes('ocean')) return "Aquatic";
  if (lowerName.includes('forest') || lowerName.includes('tree') || lowerName.includes('wood')) return "Forest";
  if (lowerName.includes('dark') || lowerName.includes('shadow') || lowerName.includes('void')) return "Dark";
  if (lowerName.includes('undead') || lowerName.includes('zombie') || lowerName.includes('skeleton')) return "Horror";
  if (lowerName.includes('demon') || lowerName.includes('devil') || lowerName.includes('hell')) return "Infernal";
  if (lowerName.includes('dragon') || lowerName.includes('wyrm')) return "Mountain";
  if (lowerName.includes('goblin') || lowerName.includes('orc')) return "Wilderness";
  if (lowerName.includes('ghost') || lowerName.includes('wraith') || lowerName.includes('specter')) return "Horror";
  if (lowerName.includes('golem') || lowerName.includes('construct')) return "Underground";
  if (lowerName.includes('slime') || lowerName.includes('ooze')) return "Underground";
  if (lowerName.includes('spider') || lowerName.includes('scorpion') || lowerName.includes('insect')) return "Nature";
  if (lowerName.includes('wolf') || lowerName.includes('bear') || lowerName.includes('beast')) return "Wilderness";
  if (lowerName.includes('knight') || lowerName.includes('warrior') || lowerName.includes('soldier')) return "Combat";
  if (lowerName.includes('mage') || lowerName.includes('wizard') || lowerName.includes('sorcerer')) return "Mystical";
  if (lowerName.includes('angel') || lowerName.includes('celestial')) return "Celestial";
  if (lowerName.includes('alien') || lowerName.includes('space')) return "Alien";
  if (lowerName.includes('machine') || lowerName.includes('robot') || lowerName.includes('mech')) return "Technology";

  // Default fallback
  return "Wilderness";
}

// Function to find the single most appropriate biome preset
function findBestBiomePreset(biomes, enemyName) {
  if (biomes.length === 0) {
    // Infer from enemy name
    return inferPresetFromName(enemyName);
  }

  // Count how many of the enemy's biomes match each preset
  const presetScores = {};

  for (const biome of biomes) {
    for (const [presetName, presetBiomes] of Object.entries(BIOME_PRESETS)) {
      if (presetBiomes.includes(biome)) {
        if (!presetScores[presetName]) {
          presetScores[presetName] = 0;
        }
        presetScores[presetName]++;
      }
    }
  }

  // If no matches found, infer from name
  if (Object.keys(presetScores).length === 0) {
    return inferPresetFromName(enemyName);
  }

  // Find the highest score
  const maxScore = Math.max(...Object.values(presetScores));

  // Get all presets with the highest score
  const topPresets = Object.keys(presetScores).filter(
    preset => presetScores[preset] === maxScore
  );

  // If only one top preset, return it
  if (topPresets.length === 1) return topPresets[0];

  // If multiple tied presets, choose by priority
  for (const preset of PRESET_PRIORITY) {
    if (topPresets.includes(preset)) {
      return preset;
    }
  }

  // Fallback to first alphabetically
  return topPresets.sort()[0];
}

console.log('Reading Enemies.json...');
const enemiesData = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

// Extract id, name, and biome preset pairs
const enemyMap = new Map();
for (const enemy of enemiesData) {
  if (enemy && enemy.id && enemy.name) {
    const biomes = extractBiomes(enemy.note);
    const preset = findBestBiomePreset(biomes, enemy.name);

    enemyMap.set(enemy.id, {
      name: enemy.name,
      preset: preset
    });
  }
}

console.log(`Found ${enemyMap.size} enemies in JSON`);

// Build new CSV content
let csvContent = 'id,name,biome_preset\n';
for (const [id, data] of enemyMap) {
  // Escape quotes in names and wrap in quotes
  const escapedName = data.name.replace(/"/g, '""');
  const escapedPreset = data.preset.replace(/"/g, '""');

  csvContent += `${id},"${escapedName}","${escapedPreset}"\n`;
}

// Write the updated CSV
fs.writeFileSync(csvPath, csvContent, 'utf8');

console.log(`Updated ${csvPath} with ${enemyMap.size} enemies`);
console.log('Done!');

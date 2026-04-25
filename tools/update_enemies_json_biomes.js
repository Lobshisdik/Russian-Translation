const fs = require('fs');
const path = require('path');

// Biome presets mapping
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
  "Abyssal": ["Underdark", "Eldritch", "Limbo", "Dark tower", "SeaBed", "CaveFlooded"],
  "Pastoral": ["Farm", "Fields", "Village", "Park", "Meadows", "Savannah"]
};

// File paths
const csvPath = path.join(__dirname, 'data', 'enemies.csv');
const jsonPath = path.join(__dirname, '..', 'data', 'Enemies.json');

console.log('Reading enemies.csv...');
const csvContent = fs.readFileSync(csvPath, 'utf8');
const lines = csvContent.split('\n').filter(line => line.trim());

// Parse CSV (skip header)
const presetMap = new Map();
for (let i = 1; i < lines.length; i++) {
  const match = lines[i].match(/^(\d+),"([^"]+)","([^"]+)"$/);
  if (match) {
    const id = parseInt(match[1]);
    const preset = match[3];
    presetMap.set(id, preset);
  }
}

console.log(`Loaded ${presetMap.size} enemy presets from CSV`);

console.log('Reading Enemies.json...');
const enemiesData = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

let updatedCount = 0;
let skippedCount = 0;

for (const enemy of enemiesData) {
  if (!enemy || !enemy.id) continue;

  const preset = presetMap.get(enemy.id);
  if (!preset) {
    console.log(`Warning: No preset found for enemy ID ${enemy.id}`);
    skippedCount++;
    continue;
  }

  // Get biomes from preset
  const biomes = BIOME_PRESETS[preset];
  if (!biomes) {
    console.log(`Warning: Unknown preset "${preset}" for enemy ID ${enemy.id}`);
    skippedCount++;
    continue;
  }

  // Update or add biome tag in note field
  if (!enemy.note) {
    enemy.note = "";
  }

  // Remove existing biome tag if present
  enemy.note = enemy.note.replace(/<Biome:[^>]+>/g, '').trim();

  // Add new biome tag at the beginning
  const biomeTag = `<Biome: ${biomes.join(', ')}>`;

  if (enemy.note) {
    enemy.note = biomeTag + '\n' + enemy.note;
  } else {
    enemy.note = biomeTag;
  }

  updatedCount++;
}

console.log(`Updated ${updatedCount} enemies, skipped ${skippedCount}`);

// Write back to JSON
console.log('Writing updated Enemies.json...');
fs.writeFileSync(jsonPath, JSON.stringify(enemiesData, null, 2), 'utf8');

console.log('Done!');

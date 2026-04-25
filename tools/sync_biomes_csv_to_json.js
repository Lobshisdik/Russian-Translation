#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const CSV_PATH = path.join(__dirname, 'data', 'enemies.csv');
const JSON_PATH = path.join(__dirname, '..', 'data', 'Enemies.json');

console.log('Reading CSV and JSON files...');

// Read CSV
const csvContent = fs.readFileSync(CSV_PATH, 'utf-8');
const csvLines = csvContent.split(/\r?\n/);

// Parse CSV into a map: id -> biomes
const csvBiomes = new Map();

let i = 0;
while (i < csvLines.length) {
  const line = csvLines[i];

  // Match enemy header line
  if (line.match(/^"(\d+)"/)) {
    // Collect full entry
    let fullEntry = line;
    const startIdx = i;
    i++;

    while (i < csvLines.length && !csvLines[i].match(/^"(\d+)"/)) {
      fullEntry += '\n' + csvLines[i];
      i++;
    }

    // Extract ID
    const idMatch = fullEntry.match(/^"(\d+)"/);
    if (!idMatch) continue;

    const id = parseInt(idMatch[1]);

    // Extract biomes
    const biomeMatch = fullEntry.match(/<Biome:\s*([^>]+)>/);
    if (biomeMatch) {
      const biomes = biomeMatch[1]
        .split(',')
        .map(b => b.trim())
        .filter(b => b);
      csvBiomes.set(id, biomes);
    }
  } else {
    i++;
  }
}

console.log(`Parsed ${csvBiomes.size} enemies from CSV`);

// Read JSON
const jsonContent = fs.readFileSync(JSON_PATH, 'utf-8');
const enemies = JSON.parse(jsonContent);

// Update JSON enemies with biomes from CSV
let updated = 0;
let notFound = 0;

for (let idx = 0; idx < enemies.length; idx++) {
  const enemy = enemies[idx];

  if (!enemy) continue; // Skip null entries

  const id = enemy.id;
  const csvBiomeList = csvBiomes.get(id);

  if (!csvBiomeList) {
    notFound++;
    continue;
  }

  // Update the note field with new biome tag
  const note = enemy.note || '';

  // Remove old biome tag if exists
  const newNote = note.replace(/<Biome:[^>]*>/g, '');

  // Add new biome tag (maintain order: insert after Archetype or at end)
  const newBiomeTag = `<Biome: ${csvBiomeList.join(', ')}>`;

  let finalNote;
  const archetypeMatch = newNote.match(/(<Archetype:[^>]*>)/);

  if (archetypeMatch) {
    // Insert after Archetype tag
    finalNote = newNote.replace(archetypeMatch[1], archetypeMatch[1] + '\n' + newBiomeTag);
  } else {
    // Append to end
    finalNote = newNote.trim() + '\n' + newBiomeTag;
  }

  // Clean up extra whitespace
  finalNote = finalNote.replace(/\n\n+/g, '\n').trim();

  enemy.note = finalNote;
  updated++;
}

console.log(`Updated ${updated} enemies in JSON`);
if (notFound > 0) {
  console.log(`Warning: ${notFound} enemies in JSON not found in CSV`);
}

// Write updated JSON
fs.writeFileSync(JSON_PATH, JSON.stringify(enemies, null, 0), 'utf-8');

console.log('✓ Successfully synced biomes from CSV to Enemies.json');

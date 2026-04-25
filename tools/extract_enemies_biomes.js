#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Paths
const ENEMIES_PATH = path.join(__dirname, '../data/Enemies.json');
const BIOMES_PATH = path.join(__dirname, '../js/plugins/ProceduralMapDB.js');
const OUTPUT_DIR = path.join(__dirname, 'extracted_data');

// Create output directory if it doesn't exist
if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

console.log('🎮 Enemies & Biomes Extractor\n');
console.log('=' .repeat(50));

// Extract Enemies
console.log('\n📖 Extracting Enemies...');
try {
    const enemiesData = JSON.parse(fs.readFileSync(ENEMIES_PATH, 'utf8'));
    const extracted = [];

    enemiesData.forEach((enemy) => {
        if (enemy && enemy.name && enemy.id) {
            let description = '';
            if (enemy.note) {
                // Match <En: description> pattern
                const match = enemy.note.match(/<En:\s*([^<]*)/);
                if (match) {
                    description = match[1].trim().replace(/>$/, '').trim();
                }
            }

            extracted.push({
                id: enemy.id,
                name: enemy.name,
                description: description
            });
        }
    });

    // Sort by ID
    extracted.sort((a, b) => a.id - b.id);

    // Save enemies JSON
    const enemiesOutput = path.join(OUTPUT_DIR, 'enemies_extracted.json');
    fs.writeFileSync(enemiesOutput, JSON.stringify(extracted, null, 2));

    console.log(`✅ Extracted ${extracted.length} enemies`);
    console.log(`   With descriptions: ${extracted.filter(e => e.description).length}`);
    console.log(`   📁 Saved to: ${enemiesOutput}`);

} catch (error) {
    console.error(`❌ Error extracting enemies: ${error.message}`);
}

// Extract Biomes
console.log('\n🌍 Extracting Biomes...');
try {
    const biomesContent = fs.readFileSync(BIOMES_PATH, 'utf8');
    const biomes = [];

    // Extract only main biome names from the BIOMES array
    // Split by main biome objects and extract only the first name: in each
    const biomeObjects = biomesContent.match(/\{\s*name:\s*['"]([\w\s]+)['"],[^}]*?features:\s*\[/gs);

    if (biomeObjects) {
        biomeObjects.forEach(biomeBlock => {
            const nameMatch = biomeBlock.match(/name:\s*['"]([\w\s]+)['"]/);
            if (nameMatch) {
                const biomeName = nameMatch[1].trim();
                // Filter out layer definitions and duplicates
                if (biomeName && !biomes.includes(biomeName) && !/^[A-Z]\d+\s+\d+$/.test(biomeName)) {
                    biomes.push(biomeName);
                }
            }
        });
    }

    // Sort alphabetically
    biomes.sort();

    // Save biomes JSON
    const biomesJsonOutput = path.join(OUTPUT_DIR, 'biomes_list.json');
    fs.writeFileSync(biomesJsonOutput, JSON.stringify(biomes, null, 2));

    // Save biomes CSV (comma-separated)
    const biomesCsvOutput = path.join(OUTPUT_DIR, 'biomes_list.csv');
    fs.writeFileSync(biomesCsvOutput, biomes.join(', '));

    console.log(`✅ Extracted ${biomes.length} biomes`);
    console.log(`   📁 JSON: ${biomesJsonOutput}`);
    console.log(`   📁 CSV: ${biomesCsvOutput}`);

} catch (error) {
    console.error(`❌ Error extracting biomes: ${error.message}`);
}

console.log('\n' + '='.repeat(50));
console.log('✨ Extraction Complete!');
console.log(`📂 Output directory: ${OUTPUT_DIR}`);

const fs = require('fs');
const path = require('path');

// Read the Enemies.json file
const enemiesPath = path.join(__dirname, 'data', 'Enemies.json');
const enemiesData = JSON.parse(fs.readFileSync(enemiesPath, 'utf8'));

// Prepare CSV header
let csv = 'id,name\n';

// Extract id and name from each enemy (skip null entries)
for (const enemy of enemiesData) {
  if (enemy && enemy.id && enemy.name) {
    // Escape quotes in name if present
    const name = enemy.name.replace(/"/g, '""');
    csv += `${enemy.id},"${name}"\n`;
  }
}

// Write to CSV file
const outputPath = path.join(__dirname, 'enemies.csv');
fs.writeFileSync(outputPath, csv, 'utf8');

console.log(`CSV exported to: ${outputPath}`);
console.log(`Total enemies: ${enemiesData.filter(e => e).length}`);

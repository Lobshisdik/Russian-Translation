const fs = require('fs');

// Read FEATURES array from ProceduralMapDB.js
const dbFile = fs.readFileSync('js/plugins/ProceduralMapDB.js', 'utf8');
const match = dbFile.match(/const FEATURES = \[([\s\S]*?)\];/);
if (!match) {
  console.log('Could not find FEATURES array');
  process.exit(1);
}

const featuresStr = match[1];
const featureNames = {};
const nameMatches = [...featuresStr.matchAll(/name:\s*["'](\w+)["'],/g)];
for (const m of nameMatches) {
  featureNames[m[1]] = true;
}

// Read tileset features
const tilesetData = JSON.parse(fs.readFileSync('data/Tilesets.json', 'utf8'));
const tileset = tilesetData.find(t => t && t.id === 300);
const lines = tileset.note.split('\n');
const tilesetFeatures = {};
lines.forEach(l => {
  const m = l.match(/<(\w+):/);
  if (m) tilesetFeatures[m[1]] = true;
});

const missing = [];
Object.keys(tilesetFeatures).sort().forEach(f => {
  if (!featureNames[f]) missing.push(f);
});

console.log('Missing features (' + missing.length + '):');
missing.forEach(f => console.log(f));

const fs = require('fs');

const filePath = 'js/plugins/ProceduralMapDB.js';
let content = fs.readFileSync(filePath, 'utf8');

// Pattern to match feature arrays: features: ["Item1", "Item2", ...]
const pattern = /features:\s*\[([\s\S]*?)\]/g;

content = content.replace(pattern, (match, arrayContent) => {
  // Check if already converted (contains 'name:')
  if (arrayContent.includes('name:')) {
    return match; // Already converted, skip
  }
  
  // Extract feature names from string array
  const stringMatches = arrayContent.match(/"([^"]+)"/g) || [];
  const features = stringMatches.map(m => m.slice(1, -1)); // Remove quotes
  
  if (features.length === 0) {
    return match; // No features to convert
  }
  
  // Convert to object format with density: 1
  const converted = features
    .map(f => `{name: "${f}", density: 1}`)
    .join(',\n        ');
  
  return `features: [\n        ${converted}\n      ]`;
});

fs.writeFileSync(filePath, content, 'utf8');
console.log('Conversion complete!');

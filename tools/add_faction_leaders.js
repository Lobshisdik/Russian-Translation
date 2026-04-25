const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'js', 'plugins', 'FactionDataManager.js');

// Read the file
let content = fs.readFileSync(filePath, 'utf8');

// Faction-themed leader names
const factionLeaders = {
  0: [ // Mages Guild - already done
    "Archmage Eldrin", "Magister Lyra", "Councilor Theron", "Spellweaver Mira",
    "Enchanter Kael", "Wizard Lord Varen", "Sage Celeste", "Grand Magus Dorian"
  ],
  1: [ // Archive Foundation
    "Curator Magnus", "Archivist Vera", "Keeper Silas", "Librarian Octavia",
    "Scribe Matthias", "Record Master Elena", "Chronicle Guard Dorian", "Vault Warden Iris"
  ],
  2: [ // Hypercapitalist Collective
    "CEO Marcellus", "Tycoon Victoria", "Mogul Cassius", "Trader Supreme Ada",
    "Market Lord Felix", "Commerce King Sophia", "Merchant Prince Julian", "Corp Director Lydia"
  ],
  3: [ // Mages Guild - Loyalists (subfaction - 10 leaders)
    "Loyalist Magus Tiberius", "Devoted Enchanter Aria", "True Mage Cornelius", "Faithful Sage Meredith",
    "Orthodox Wizard Quinn", "Decree Keeper Thalia", "Guild Champion Marcus", "Sacred Spellcaster Nora",
    "Traditional Mage Lucius", "Pure Magic Scholar Elara"
  ],
  4: [ // Mages Guild - Purists (subfaction - 10 leaders)
    "Purist Elder Cassius", "Hermetic Master Isolde", "Ancient Scholar Regulus", "Traditionalist Sage Vivian",
    "Orthodox Keeper Gaius", "Pure Magus Helena", "Esoteric Lord Flavius", "Sacred Scholar Portia",
    "Classical Wizard Maximus", "Original Doctrine Keeper Diana"
  ],
  5: [ // Mages Guild - Innovators (subfaction - 10 leaders)
    "Tech-Mage Orion", "Inventor Sage Lyanna", "Gear Scholar Tobias", "Steam Wizard Isadora",
    "Arcane Engineer Cyrus", "Magitek Master Freya", "Innovation Lord Kane", "Progress Mage Selene",
    "Mechanical Sage Viktor", "Future Spellcrafter Zara"
  ],
  6: [ // Mages Guild - Schools (subfaction - 10 leaders)
    "Headmaster Aurelius", "School Dean Ophelia", "Master Teacher Lucan", "Polymath Sage Rowena",
    "Academy Lord Cedric", "Pedagogue Mage Astrid", "Professor Supreme Hadrian", "Scholar Leader Beatrice",
    "Educational Master Darius", "Mentor Archmage Evangeline"
  ],
  7: [ // Cult of Chaos
    "High Priest Nihilus", "Chaos Oracle Morgana", "Entropy Lord Xander", "Discord Sage Lilith",
    "Void Master Balthazar", "Anarchy Champion Raven", "Disorder Keeper Malachi", "Chaos Weaver Seraphina"
  ],
  8: [ // Naguka (subfaction - 10 leaders)
    "Swamp Chief Gorrok", "Poison Shaman Zzara", "Bog Warrior Thrax", "Venom Elder Nyx",
    "Marsh Lord Kreth", "Toxic Oracle Sssara", "Wetland Guardian Brognak", "Plague Keeper Vyx",
    "Mire Champion Grax", "Fungal Sage Mycellia"
  ],
  9: [ // Dryads (subfaction - 10 leaders)
    "Forest Elder Sylvara", "Grove Guardian Thorne", "Leaf Sage Verdant", "Tree Keeper Fauna",
    "Woodland Champion Ash", "Nature Oracle Moss", "Branch Warrior Rowan", "Vine Master Flora",
    "Root Defender Oakley", "Wildwood Sage Ivy"
  ],
  10: [ // Truckers Union
    "Road King Diesel", "Highway Boss Cassie", "Convoy Master Hank", "Trucker Chief Rita",
    "Route Lord Duke", "Wheeler Commander Sarah", "Freight Captain Buck", "Road Warrior Maxine"
  ],
  11: [ // Iron Syndicate
    "Factory Baron Forge", "Steel Mistress Clara", "Industry Lord Marcus", "Production Chief Ingrid",
    "Machine Master Viktor", "Foundry King Brutus", "Assembly Boss Natasha", "Metal Warlord Rex"
  ],
  12: [ // Northern Kingdom
    "King Harald", "Queen Astrid", "Jarl Magnus", "Shield-Maiden Sigrid",
    "Frost Lord Erik", "Ice Queen Freya", "Snow King Olaf", "Winter Matriarch Brunhilde"
  ],
  13: [ // Underworld Syndicate
    "Crime Boss Vito", "Shadow Matriarch Carmilla", "Syndicate Don Marco", "Night Queen Selena",
    "Dark Lord Vincent", "Underground Empress Rosa", "Twilight King Luca", "Noir Mistress Angelica"
  ],
  14: [ // The Collective
    "Hive Mind Alpha", "Unity Leader Sigma", "Collective Prime Delta", "Harmony Master Omega",
    "Synergy Lord Epsilon", "Group Consciousness Theta", "Network Queen Phi", "Shared Mind King Psi"
  ],
  15: [ // Demon Lords
    "Demon Lord Azaroth", "Infernal Queen Lilith", "Hell King Baal", "Abyss Mistress Morrigan",
    "Chaos Demon Xalvador", "Shadow Lord Beleth", "Nether Queen Astarte", "Void King Mammon"
  ],
  16: [ // Divine Council
    "High Seraph Gabriel", "Divine Empress Aurora", "Celestial King Raphael", "Holy Matriarch Seraphina",
    "Light Lord Michael", "Sacred Queen Uriel", "Heaven's Champion Azrael", "Radiant Mistress Cassiel"
  ],
  17: [ // Void Entities
    "Void Emperor Nihil", "Entropy Empress Umbra", "Null King Vacuus", "Oblivion Queen Tenebris",
    "Emptiness Lord Khaos", "Nothingness Sovereign Erebus", "Abyss Ruler Nyx", "Dark Matter Monarch Styx"
  ]
};

// Actor sprite options and indices
const actorSprites = ["Actor1", "Actor2", "Actor3"];
const spriteIndices = [0, 1, 2, 3, 4, 5, 6, 7];

// Find each faction and add leaders if not already present
let factionCount = 0;
let modifiedCount = 0;

// Process each faction
for (let factionId = 1; factionId <= 17; factionId++) {
  // Skip faction 0 as it's already done
  if (factionId === 0) continue;

  const leaders = factionLeaders[factionId];
  if (!leaders) continue;

  // Build the leaders array string
  let leadersArray = '      leaders: [\n';

  for (let i = 0; i < leaders.length; i++) {
    const spritename = actorSprites[i % 3];
    const spriteindex = spriteIndices[i % 8];
    leadersArray += `        { name: "${leaders[i]}", spritename: "${spritename}", spriteindex: ${spriteindex} }`;
    if (i < leaders.length - 1) {
      leadersArray += ',';
    }
    leadersArray += '\n';
  }
  leadersArray += '      ]';

  // Find the faction block using a more reliable pattern
  // Match the faction by id field
  const factionPattern = new RegExp(
    `(\\{[\\s\\S]*?id:\\s*${factionId},[\\s\\S]*?troops:\\s*\\[[\\s\\S]*?\\])([\\s\\n]*)(\\})`,
    'g'
  );

  const match = content.match(factionPattern);
  if (match) {
    // Replace with troops array + leaders array
    content = content.replace(
      factionPattern,
      `$1,\n${leadersArray}$2$3`
    );
    modifiedCount++;
  }
}

// Write the file back
fs.writeFileSync(filePath, content, 'utf8');

console.log(`Successfully added leaders to ${modifiedCount} factions (excluding faction 0 which was already done)`);

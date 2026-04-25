/*:
 * @target MZ
 * @plugindesc Defines shared furniture for other plugins to consume.
 * @help This just exposes BodyParts / ProstheticTypes / ProstheticCompatibility globally.
 */

(() => {
  const FURNITURE_DB = {
    // === SEATING ===
    wooden_chair: {
      name: "Wooden Chair",
      category: "seating",
      image: "wooden_chair",
      width: 1,
      height: 1,
      wall: false,
      collision: [[1]],
      layer: "same",
      rotatable: true,
      recipe: {
        570: 2, // Wood x2
        572: 1, // Cloth x1
      },
      buyPrice: 1500,
      sellPrice: 600,
      description: "A simple wooden chair with cloth cushion.",
    },

    leather_armchair: {
      name: "Leather Armchair",
      category: "seating",
      image: "leather_armchair",
      width: 2,
      height: 2,
      wall: false,
      collision: [[1][1], [1][1]],
      layer: "same",
      rotatable: true,
      recipe: {
        570: 3, // Wood x3
        571: 2, // Leather x2
        572: 2, // Cloth x2
      },
      buyPrice: 4500,
      sellPrice: 1800,
      description: "A comfortable leather armchair.",
    },

    tech_chair: {
      name: "Tech Chair",
      category: "seating",
      image: "tech_chair",
      width: 1,
      height: 1,
      wall: false,
      collision: [[1]],
      layer: "same",
      rotatable: true,
      recipe: {
        565: 2, // Steel Ingot x2
        585: 3, // Plastic Polymer x3
        583: 1, // Microchip x1
      },
      buyPrice: 8000,
      sellPrice: 3200,
      description: "An ergonomic high-tech chair with auto-adjustment.",
    },

    crystal_throne: {
      name: "Crystal Throne",
      category: "seating",
      image: "crystal_throne",
      width: 2,
      height: 2,
      wall: false,
      collision: [
        [1, 1],
        [1, 1],
      ],
      layer: "same",
      rotatable: true,
      recipe: {
        568: 5, // Crystal x5
        567: 2, // Varlenia Ingot x2
        579: 3, // Arcane Essence x3
        580: 2, // Ethereal Shard x2
      },
      buyPrice: 50000,
      sellPrice: 20000,
      description: "A majestic throne made of magical crystals.",
    },

    wooden_bench: {
      name: "Wooden Bench",
      category: "seating",
      image: "wooden_bench",
      width: 2,
      height: 1,
      wall: false,
      collision: [[1, 1]],
      layer: "same",
      rotatable: true,
      recipe: {
        570: 4, // Wood x4
        565: 2, // Steel Ingot x2
      },
      buyPrice: 3000,
      sellPrice: 1200,
      description: "A simple wooden bench for two.",
    },

    // === TABLES ===
    wooden_table: {
      name: "Wooden Table",
      category: "tables",
      image: "wooden_table",
      width: 2,
      height: 2,
      wall: false,
      collision: [
        [1, 1],
        [1, 1],
      ],
      layer: "same",
      rotatable: false,
      recipe: {
        570: 4, // Wood x4
        565: 2, // Steel Ingot x2
      },
      buyPrice: 4000,
      sellPrice: 1600,
      description: "A sturdy wooden table.",
    },

    glass_table: {
      name: "Glass Table",
      category: "tables",
      image: "glass_table",
      width: 2,
      height: 1,
      wall: false,
      collision: [[1, 1]],
      layer: "same",
      rotatable: true,
      recipe: {
        569: 3, // Glass x3
        565: 2, // Steel Ingot x2
      },
      buyPrice: 5000,
      sellPrice: 2000,
      description: "A modern glass table with steel frame.",
    },

    tech_desk: {
      name: "Tech Desk",
      category: "tables",
      image: "tech_desk",
      width: 3,
      height: 2,
      wall: false,
      collision: [
        [1, 1, 1],
        [1, 0, 1],
      ],
      layer: "same",
      rotatable: true,
      recipe: {
        565: 3, // Steel Ingot x3
        582: 2, // Circuit Board x2
        583: 2, // Microchip x2
        585: 4, // Plastic Polymer x4
      },
      buyPrice: 15000,
      sellPrice: 6000,
      description: "A high-tech desk with integrated displays.",
    },

    alchemy_table: {
      name: "Alchemy Table",
      category: "tables",
      image: "alchemy_table",
      width: 2,
      height: 2,
      wall: false,
      collision: [
        [1, 1],
        [1, 1],
      ],
      layer: "same",
      rotatable: false,
      recipe: {
        570: 3, // Wood x3
        569: 2, // Glass x2
        576: 3, // Herb Extract x3
        578: 2, // Acidic Solution x2
      },
      buyPrice: 12000,
      sellPrice: 4800,
      description: "A table equipped for alchemical experiments.",
    },

    dining_table: {
      name: "Dining Table",
      category: "tables",
      image: "dining_table",
      width: 3,
      height: 2,
      wall: false,
      collision: [
        [1, 1, 1],
        [1, 1, 1],
      ],
      layer: "same",
      rotatable: true,
      recipe: {
        570: 6, // Wood x6
        572: 2, // Cloth x2
        565: 2, // Steel Ingot x2
      },
      buyPrice: 8000,
      sellPrice: 3200,
      description: "A large dining table for family meals.",
    },

    // === STORAGE ===
    wooden_chest: {
      name: "Wooden Chest",
      category: "storage",
      image: "wooden_chest",
      width: 2,
      height: 1,
      wall: false,
      collision: [[1, 1]],
      layer: "same",
      rotatable: true,
      interactive: true,
      eventId: 0,
      storageCapacity: 20,
      recipe: {
        570: 4, // Wood x4
        565: 2, // Steel Ingot x2
        571: 1, // Leather x1
      },
      buyPrice: 5000,
      sellPrice: 2000,
      description: "A wooden chest for storing items.",
    },

    metal_locker: {
      name: "Metal Locker",
      category: "storage",
      image: "metal_locker",
      width: 1,
      height: 2,
      wall: false,
      collision: [[1], [1]],
      layer: "same",
      rotatable: true,
      interactive: true,
      eventId: 0,
      storageCapacity: 30,
      recipe: {
        565: 4, // Steel Ingot x4
        566: 2, // Titanium Ingot x2
      },
      buyPrice: 8000,
      sellPrice: 3200,
      description: "A secure metal storage locker.",
    },

    quantum_storage: {
      name: "Quantum Storage Unit",
      category: "storage",
      image: "quantum_storage",
      width: 2,
      height: 2,
      wall: false,
      collision: [
        [1, 1],
        [1, 1],
      ],
      layer: "same",
      rotatable: false,
      interactive: true,
      eventId: 0,
      storageCapacity: 100,
      recipe: {
        581: 2, // Quantum Core x2
        566: 4, // Titanium Ingot x4
        587: 2, // Nanotube Module x2
        580: 3, // Ethereal Shard x3
      },
      buyPrice: 100000,
      sellPrice: 40000,
      description: "Uses quantum technology for massive storage.",
    },

    bookshelf: {
      name: "Bookshelf",
      category: "storage",
      image: "bookshelf",
      width: 2,
      height: 3,
      wall: false,
      collision: [
        [1, 1],
        [1, 1],
        [1, 1],
      ],
      layer: "same",
      rotatable: true,
      recipe: {
        570: 6, // Wood x6
        565: 2, // Steel Ingot x2
      },
      buyPrice: 6000,
      sellPrice: 2400,
      description: "A tall bookshelf for organizing books and items.",
    },

    crystal_display: {
      name: "Crystal Display Case",
      category: "storage",
      image: "crystal_display",
      width: 1,
      height: 1,
      wall: false,
      collision: [[1]],
      layer: "same",
      rotatable: false,
      interactive: true,
      eventId: 0,
      storageCapacity: 5,
      recipe: {
        569: 4, // Glass x4
        568: 2, // Crystal x2
        579: 1, // Arcane Essence x1
      },
      buyPrice: 15000,
      sellPrice: 6000,
      description: "Display case that preserves magical items.",
    },

    // === BEDS ===
    simple_bed: {
      name: "Simple Bed",
      category: "beds",
      image: "simple_bed",
      width: 2,
      height: 3,
      wall: false,
      collision: [
        [1, 1],
        [1, 1],
        [1, 1],
      ],
      layer: "same",
      rotatable: true,
      interactive: true,
      eventId: 0,
      recipe: {
        570: 4, // Wood x4
        572: 3, // Cloth x3
        575: 2, // Plant Matter x2
      },
      buyPrice: 6000,
      sellPrice: 2400,
      description: "A basic bed for resting.",
    },

    luxury_bed: {
      name: "Luxury Bed",
      category: "beds",
      image: "luxury_bed",
      width: 3,
      height: 3,
      wall: false,
      collision: [
        [1, 1, 1],
        [1, 1, 1],
        [1, 1, 1],
      ],
      layer: "same",
      rotatable: true,
      interactive: true,
      eventId: 0,
      recipe: {
        570: 6, // Wood x6
        571: 4, // Leather x4
        572: 5, // Cloth x5
        575: 4, // Plant Matter x4
      },
      buyPrice: 20000,
      sellPrice: 8000,
      description: "A luxurious king-size bed.",
    },

    tech_pod: {
      name: "Sleep Pod",
      category: "beds",
      image: "tech_pod",
      width: 1,
      height: 2,
      wall: false,
      collision: [
        [1],
        [1],
      ],
      layer: "same",
      rotatable: false,
      interactive: true,
      eventId: 0,
      recipe: {
        565: 4, // Steel Ingot x4
        583: 2, // Microchip x2
        584: 2, // Battery Cell x2
        585: 3, // Plastic Polymer x3
      },
      buyPrice: 30000,
      sellPrice: 12000,
      description: "High-tech sleeping pod with health monitoring.",
    },

    // === LIGHTING ===
    wooden_torch: {
      name: "Wooden Torch Stand",
      category: "lighting",
      image: "wooden_torch",
      width: 1,
      height: 1,
      wall: false,
      collision: [[1]],
      layer: "same",
      rotatable: false,
      recipe: {
        570: 2, // Wood x2
        577: 1, // Oil Flask x1
        572: 1, // Cloth x1
      },
      buyPrice: 1000,
      sellPrice: 400,
      description: "A simple torch stand for basic lighting.",
    },

    crystal_lamp: {
      name: "Crystal Lamp",
      category: "lighting",
      image: "crystal_lamp",
      width: 1,
      height: 1,
      wall: false,
      collision: [[0]], // No collision - can walk through
      layer: "above",
      rotatable: false,
      recipe: {
        568: 2, // Crystal x2
        579: 1, // Arcane Essence x1
        565: 1, // Steel Ingot x1
      },
      buyPrice: 8000,
      sellPrice: 3200,
      description: "A magical lamp powered by crystals.",
    },

    neon_light: {
      name: "Neon Light Panel",
      category: "lighting",
      image: "neon_light",
      width: 2,
      height: 1,
      wall: false,
      collision: [[0, 0]],
      layer: "above",
      rotatable: true,
      recipe: {
        569: 2, // Glass x2
        584: 1, // Battery Cell x1
        583: 1, // Microchip x1
        585: 2, // Plastic Polymer x2
      },
      buyPrice: 6000,
      sellPrice: 2400,
      description: "Modern neon lighting panel.",
    },

    chandelier: {
      name: "Crystal Chandelier",
      category: "lighting",
      image: "chandelier",
      width: 2,
      height: 2,
      wall: false,
      collision: [
        [0, 0],
        [0, 0],
      ],
      layer: "above",
      rotatable: false,
      recipe: {
        568: 4, // Crystal x4
        567: 2, // Varlenia Ingot x2
        579: 2, // Arcane Essence x2
        569: 3, // Glass x3
      },
      buyPrice: 30000,
      sellPrice: 12000,
      description: "An elegant crystal chandelier.",
    },

    // === WORKSTATIONS ===
    crafting_bench: {
      name: "Crafting Bench",
      category: "workstations",
      image: "crafting_bench",
      width: 2,
      height: 2,
      wall: false,
      collision: [
        [1, 1],
        [1, 0],
      ],
      layer: "same",
      rotatable: true,
      interactive: true,
      eventId: 0,
      workstationType: "crafting",
      recipe: {
        570: 4, // Wood x4
        565: 3, // Steel Ingot x3
        571: 2, // Leather x2
      },
      buyPrice: 10000,
      sellPrice: 4000,
      description: "Basic workbench for crafting furniture.",
    },

    tech_workstation: {
      name: "Tech Workstation",
      category: "workstations",
      image: "tech_workstation",
      width: 3,
      height: 2,
      wall: false,
      collision: [
        [1, 1, 1],
        [1, 0, 1],
      ],
      layer: "same",
      rotatable: true,
      interactive: true,
      eventId: 0,
      workstationType: "tech",
      recipe: {
        565: 4, // Steel Ingot x4
        582: 3, // Circuit Board x3
        583: 3, // Microchip x3
        584: 2, // Battery Cell x2
        585: 3, // Plastic Polymer x3
      },
      buyPrice: 50000,
      sellPrice: 20000,
      description: "Advanced workstation for tech crafting.",
    },

    arcane_altar: {
      name: "Arcane Altar",
      category: "workstations",
      image: "arcane_altar",
      width: 3,
      height: 3,
      wall: false,
      collision: [
        [1, 1, 1],
        [1, 0, 1],
        [1, 1, 1],
      ],
      layer: "same",
      rotatable: false,
      interactive: true,
      eventId: 0,
      workstationType: "magic",
      recipe: {
        568: 5, // Crystal x5
        579: 4, // Arcane Essence x4
        580: 3, // Ethereal Shard x3
        567: 3, // Varlenia Ingot x3
        573: 2, // Bone x2
      },
      buyPrice: 80000,
      sellPrice: 32000,
      description: "Altar for magical furniture enchantments.",
    },

    chemistry_station: {
      name: "Chemistry Station",
      category: "workstations",
      image: "chemistry_station",
      width: 2,
      height: 2,
      wall: false,
      collision: [
        [1, 1],
        [1, 0],
      ],
      layer: "same",
      rotatable: true,
      interactive: true,
      eventId: 0,
      workstationType: "chemistry",
      recipe: {
        569: 4, // Glass x4
        578: 3, // Acidic Solution x3
        577: 2, // Oil Flask x2
        565: 3, // Steel Ingot x3
      },
      buyPrice: 20000,
      sellPrice: 8000,
      description: "Station for chemical processing.",
    },

    // === DECORATIONS ===
    plant_pot: {
      name: "Plant Pot",
      category: "decoration",
      image: "plant_pot",
      width: 1,
      height: 1,
      wall: false,
      collision: [[1]],
      layer: "same",
      rotatable: false,
      recipe: {
        575: 2, // Plant Matter x2
        570: 1, // Wood x1
      },
      buyPrice: 1500,
      sellPrice: 600,
      description: "A decorative plant in a pot.",
    },

    holographic_display: {
      name: "Holographic Display",
      category: "decoration",
      image: "holo_display",
      width: 1,
      height: 2,
      wall: false,
      collision: [[0], [0]],
      layer: "above",
      rotatable: true,
      recipe: {
        569: 2, // Glass x2
        583: 2, // Microchip x2
        584: 1, // Battery Cell x1
        587: 1, // Nanotube Module x1
      },
      buyPrice: 25000,
      sellPrice: 10000,
      description: "Projects holographic images.",
    },

    statue: {
      name: "Stone Statue",
      category: "decoration",
      image: "statue",
      width: 1,
      height: 2,
      wall: false,
      collision: [[1], [1]],
      layer: "same",
      rotatable: true,
      recipe: {
        573: 4, // Bone x4
        586: 2, // Composite Resin x2
      },
      buyPrice: 8000,
      sellPrice: 3200,
      description: "An artistic stone statue.",
    },

    aquarium: {
      name: "Aquarium",
      category: "decoration",
      image: "aquarium",
      width: 2,
      height: 1,
      wall: false,
      collision: [[1, 1]],
      layer: "same",
      rotatable: true,
      recipe: {
        569: 4, // Glass x4
        565: 2, // Steel Ingot x2
        577: 1, // Oil Flask x1
      },
      buyPrice: 10000,
      sellPrice: 4000,
      description: "A decorative aquarium.",
    },

    mirror: {
      name: "Wall Mirror",
      category: "decoration",
      image: "mirror",
      width: 2,
      height: 2,
      wall: false,
      collision: [
        [0, 0],
        [0, 0],
      ],
      layer: "below",
      rotatable: true,
      wallMounted: true,
      recipe: {
        569: 3, // Glass x3
        565: 2, // Steel Ingot x2
        586: 1, // Composite Resin x1
      },
      buyPrice: 6000,
      sellPrice: 2400,
      description: "A large wall-mounted mirror.",
    },

    rug: {
      name: "Decorative Rug",
      category: "decoration",
      image: "rug",
      width: 3,
      height: 2,
      wall: false,
      collision: [
        [0, 0, 0],
        [0, 0, 0],
      ],
      layer: "below",
      rotatable: true,
      recipe: {
        572: 4, // Cloth x4
        571: 2, // Leather x2
      },
      buyPrice: 4000,
      sellPrice: 1600,
      description: "A comfortable decorative rug.",
    },

    // === APPLIANCES ===
    refrigerator: {
      name: "Refrigerator",
      category: "appliances",
      image: "refrigerator",
      width: 1,
      height: 2,
      wall: false,
      collision: [[1], [1]],
      layer: "same",
      rotatable: true,
      interactive: true,
      eventId: 0,
      storageCapacity: 15,
      preserveFood: true,
      recipe: {
        565: 4, // Steel Ingot x4
        584: 2, // Battery Cell x2
        585: 3, // Plastic Polymer x3
        583: 1, // Microchip x1
      },
      buyPrice: 20000,
      sellPrice: 8000,
      description: "Keeps food fresh and preserved.",
    },

    cooking_stove: {
      name: "Cooking Stove",
      category: "appliances",
      image: "cooking_stove",
      width: 2,
      height: 1,
      wall: false,
      collision: [[1, 1]],
      layer: "same",
      rotatable: true,
      interactive: true,
      eventId: 0,
      workstationType: "cooking",
      recipe: {
        565: 3, // Steel Ingot x3
        577: 2, // Oil Flask x2
        584: 1, // Battery Cell x1
      },
      buyPrice: 15000,
      sellPrice: 6000,
      description: "Essential for cooking meals.",
    },

    recycler: {
      name: "Material Recycler",
      category: "appliances",
      image: "recycler",
      width: 2,
      height: 2,
      wall: false,
      collision: [
        [1, 1],
        [1, 1],
      ],
      layer: "same",
      rotatable: false,
      interactive: true,
      eventId: 0,
      workstationType: "recycling",
      recipe: {
        566: 3, // Titanium Ingot x3
        582: 2, // Circuit Board x2
        578: 2, // Acidic Solution x2
        587: 2, // Nanotube Module x2
      },
      buyPrice: 50000,
      sellPrice: 20000,
      description: "Breaks down items into base materials.",
    },

    teleporter: {
      name: "Quantum Teleporter",
      category: "appliances",
      image: "teleporter",
      width: 2,
      height: 2,
      wall: false,
      collision: [
        [0, 0],
        [0, 0],
      ],
      layer: "below",
      rotatable: false,
      interactive: true,
      eventId: 0,
      teleporter: true,
      recipe: {
        581: 3, // Quantum Core x3
        580: 4, // Ethereal Shard x4
        587: 3, // Nanotube Module x3
        567: 4, // Varlenia Ingot x4
      },
      buyPrice: 200000,
      sellPrice: 80000,
      description: "Instant transportation between linked teleporters.",
    },

    // === ENTERTAINMENT ===
    television: {
      name: "Flat Screen TV",
      category: "entertainment",
      image: "television",
      width: 2,
      height: 1,
      wall: false,
      collision: [[0, 0]],
      layer: "above",
      rotatable: true,
      interactive: true,
      eventId: 0,
      recipe: {
        565: 4, // Steel Ingot x4
        569: 3, // Glass x3
        583: 3, // Microchip x3
        584: 2, // Battery Cell x2
      },
      buyPrice: 15000,
      sellPrice: 6000,
      description: "High-definition television for entertainment.",
    },

    arcade_machine: {
      name: "Arcade Cabinet",
      category: "entertainment",
      image: "arcade_machine",
      width: 1,
      height: 2,
      wall: false,
      collision: [[1], [1]],
      layer: "same",
      rotatable: true,
      interactive: true,
      eventId: 0,
      recipe: {
        565: 5, // Steel Ingot x5
        583: 4, // Microchip x4
        584: 3, // Battery Cell x3
        585: 4, // Plastic Polymer x4
      },
      buyPrice: 20000,
      sellPrice: 8000,
      description: "Classic arcade games for endless fun.",
    },

    pool_table: {
      name: "Pool Table",
      category: "entertainment",
      image: "pool_table",
      width: 3,
      height: 2,
      wall: false,
      collision: [
        [1, 1, 1],
        [1, 1, 1],
      ],
      layer: "same",
      rotatable: true,
      interactive: true,
      eventId: 0,
      recipe: {
        570: 8, // Wood x8
        571: 3, // Leather x3
        572: 2, // Cloth x2
        565: 2, // Steel Ingot x2
      },
      buyPrice: 25000,
      sellPrice: 10000,
      description: "A premium pool table for recreation.",
    },

    ping_pong_table: {
      name: "Ping Pong Table",
      category: "entertainment",
      image: "ping_pong_table",
      width: 3,
      height: 2,
      wall: false,
      collision: [
        [1, 1, 1],
        [1, 1, 1],
      ],
      layer: "same",
      rotatable: true,
      interactive: true,
      eventId: 0,
      recipe: {
        570: 6, // Wood x6
        572: 3, // Cloth x3
        565: 2, // Steel Ingot x2
      },
      buyPrice: 12000,
      sellPrice: 4800,
      description: "A competitive ping pong table.",
    },

    dartboard: {
      name: "Dartboard",
      category: "entertainment",
      image: "dartboard",
      width: 1,
      height: 2,
      wall: false,
      collision: [[0], [0]],
      layer: "above",
      rotatable: false,
      interactive: true,
      eventId: 0,
      recipe: {
        570: 3, // Wood x3
        573: 2, // Bone x2
        575: 2, // Plant Matter x2
      },
      buyPrice: 5000,
      sellPrice: 2000,
      description: "A classic dartboard game.",
    },

    jukebox: {
      name: "Jukebox",
      category: "entertainment",
      image: "jukebox",
      width: 1,
      height: 2,
      wall: false,
      collision: [[1], [1]],
      layer: "same",
      rotatable: true,
      interactive: true,
      eventId: 0,
      recipe: {
        565: 3, // Steel Ingot x3
        583: 2, // Microchip x2
        584: 2, // Battery Cell x2
        586: 2, // Composite Resin x2
      },
      buyPrice: 8000,
      sellPrice: 3200,
      description: "Play your favorite music anytime.",
    },

    billiards_balls_set: {
      name: "Billiards Ball Set",
      category: "entertainment",
      image: "billiards_balls_set",
      width: 1,
      height: 1,
      wall: false,
      collision: [[0]],
      layer: "above",
      rotatable: false,
      interactive: true,
      eventId: 0,
      recipe: {
        573: 3, // Bone x3
        586: 2, // Composite Resin x2
      },
      buyPrice: 2000,
      sellPrice: 800,
      description: "Set of billiard balls for pool games.",
    },

    gaming_console: {
      name: "Gaming Console",
      category: "entertainment",
      image: "gaming_console",
      width: 1,
      height: 1,
      wall: false,
      collision: [[1]],
      layer: "same",
      rotatable: false,
      interactive: true,
      eventId: 0,
      recipe: {
        565: 2, // Steel Ingot x2
        583: 3, // Microchip x3
        584: 2, // Battery Cell x2
        585: 3, // Plastic Polymer x3
      },
      buyPrice: 18000,
      sellPrice: 7200,
      description: "Latest gaming console for entertainment.",
    },

    virtual_reality_headset: {
      name: "VR Headset Station",
      category: "entertainment",
      image: "vr_headset",
      width: 2,
      height: 2,
      wall: false,
      collision: [
        [1, 1],
        [1, 1],
      ],
      layer: "same",
      rotatable: false,
      interactive: true,
      eventId: 0,
      recipe: {
        565: 5, // Steel Ingot x5
        583: 4, // Microchip x4
        584: 3, // Battery Cell x3
        587: 2, // Nanotube Module x2
      },
      buyPrice: 35000,
      sellPrice: 14000,
      description: "Immersive virtual reality experience.",
    },

    foosball_table: {
      name: "Foosball Table",
      category: "entertainment",
      image: "foosball_table",
      width: 2,
      height: 1,
      wall: false,
      collision: [[1, 1]],
      layer: "same",
      rotatable: true,
      interactive: true,
      eventId: 0,
      recipe: {
        570: 4, // Wood x4
        565: 3, // Steel Ingot x3
        571: 2, // Leather x2
      },
      buyPrice: 10000,
      sellPrice: 4000,
      description: "Table football for quick matches.",
    },

    blackjack_table: {
      name: "Blackjack Table",
      category: "entertainment",
      image: "blackjack_table",
      width: 2,
      height: 2,
      wall: false,
      collision: [
        [1, 1],
        [1, 1],
      ],
      layer: "same",
      rotatable: true,
      interactive: true,
      eventId: 0,
      recipe: {
        570: 5, // Wood x5
        572: 4, // Cloth x4
        565: 2, // Steel Ingot x2
      },
      buyPrice: 12000,
      sellPrice: 4800,
      description: "Professional blackjack gaming table.",
    },

    roulette_table: {
      name: "Roulette Table",
      category: "entertainment",
      image: "roulette_table",
      width: 3,
      height: 2,
      wall: false,
      collision: [
        [1, 1, 1],
        [1, 1, 1],
      ],
      layer: "same",
      rotatable: false,
      interactive: true,
      eventId: 0,
      recipe: {
        570: 6, // Wood x6
        572: 3, // Cloth x3
        565: 4, // Steel Ingot x4
        568: 2, // Crystal x2
      },
      buyPrice: 30000,
      sellPrice: 12000,
      description: "Luxurious roulette gaming table.",
    },

    slot_machine: {
      name: "Slot Machine",
      category: "entertainment",
      image: "slot_machine",
      width: 1,
      height: 2,
      wall: false,
      collision: [[1], [1]],
      layer: "same",
      rotatable: true,
      interactive: true,
      eventId: 0,
      recipe: {
        565: 4, // Steel Ingot x4
        583: 3, // Microchip x3
        584: 2, // Battery Cell x2
        586: 2, // Composite Resin x2
      },
      buyPrice: 16000,
      sellPrice: 6400,
      description: "Classic slot machine for gambling entertainment.",
    },

    karaoke_machine: {
      name: "Karaoke System",
      category: "entertainment",
      image: "karaoke_machine",
      width: 2,
      height: 1,
      wall: false,
      collision: [[1, 1]],
      layer: "same",
      rotatable: true,
      interactive: true,
      eventId: 0,
      recipe: {
        565: 3, // Steel Ingot x3
        583: 3, // Microchip x3
        584: 2, // Battery Cell x2
        569: 2, // Glass x2
      },
      buyPrice: 14000,
      sellPrice: 5600,
      description: "Sing your favorite songs with professional quality.",
    },

    movie_projector: {
      name: "Movie Projector",
      category: "entertainment",
      image: "movie_projector",
      width: 1,
      height: 1,
      wall: false,
      collision: [[1]],
      layer: "same",
      rotatable: true,
      interactive: true,
      eventId: 0,
      recipe: {
        565: 3, // Steel Ingot x3
        569: 2, // Glass x2
        583: 2, // Microchip x2
        584: 2, // Battery Cell x2
      },
      buyPrice: 13000,
      sellPrice: 5200,
      description: "Project movies on any wall.",
    },

    dance_floor: {
      name: "Dance Floor",
      category: "entertainment",
      image: "dance_floor",
      width: 3,
      height: 3,
      wall: false,
      collision: [
        [0, 0, 0],
        [0, 0, 0],
        [0, 0, 0],
      ],
      layer: "below",
      rotatable: false,
      interactive: true,
      eventId: 0,
      recipe: {
        572: 6, // Cloth x6
        565: 4, // Steel Ingot x4
        584: 2, // Battery Cell x2
      },
      buyPrice: 22000,
      sellPrice: 8800,
      description: "Disco-style dance floor with lights.",
    },

    bowling_lane: {
      name: "Bowling Lane Set",
      category: "entertainment",
      image: "bowling_lane",
      width: 2,
      height: 4,
      wall: false,
      collision: [
        [1, 1],
        [1, 1],
        [1, 1],
        [1, 1],
      ],
      layer: "same",
      rotatable: false,
      interactive: true,
      eventId: 0,
      recipe: {
        570: 8, // Wood x8
        575: 4, // Plant Matter x4
        565: 4, // Steel Ingot x4
      },
      buyPrice: 28000,
      sellPrice: 11200,
      description: "Full bowling lane setup.",
    },

    // === PLANTS & NATURE ===
    plant: {
      name: "Plant",
      category: "nature",
      image: "plant",
      width: 1,
      height: 1,
      wall: false,
      collision: [[1]],
      layer: "same",
      rotatable: false,
      recipe: {
        575: 2, // Plant Matter x2
        570: 1, // Wood x1
      },
      buyPrice: 3000,
      sellPrice: 1200,
      description: "A potted decorative plant.",
    },

    flowers: {
      name: "Flower Bed",
      category: "nature",
      image: "flowers",
      width: 2,
      height: 1,
      wall: false,
      collision: [[0, 0]],
      layer: "below",
      rotatable: false,
      recipe: {
        575: 3, // Plant Matter x3
        572: 1, // Cloth x1
      },
      buyPrice: 1000,
      sellPrice: 400,
      description: "A bed of colorful flowers.",
    },

    tree: {
      name: "Tree",
      category: "nature",
      image: "tree",
      width: 2,
      height: 3,
      wall: false,
      collision: [
        [1, 1],
        [1, 1],
        [1, 1],
      ],
      layer: "same",
      rotatable: false,
      recipe: {
        570: 5, // Wood x5
        575: 4, // Plant Matter x4
        573: 2, // Bone x2
      },
      buyPrice: 12000,
      sellPrice: 4800,
      description: "A large decorative tree.",
    },

    rock: {
      name: "Rock",
      category: "nature",
      image: "rock",
      width: 1,
      height: 1,
      wall: false,
      collision: [[1]],
      layer: "same",
      rotatable: false,
      recipe: {
        573: 2, // Bone x2
        586: 1, // Composite Resin x1
      },
      buyPrice: 1000,
      sellPrice: 400,
      description: "A large decorative rock.",
    },

    pile_of_bones: {
      name: "Pile of Bones",
      category: "nature",
      image: "pile_of_bones",
      width: 2,
      height: 1,
      wall: false,
      collision: [[1, 1]],
      layer: "same",
      rotatable: true,
      recipe: {
        573: 5, // Bone x5
        586: 2, // Composite Resin x2
      },
      buyPrice: 1500,
      sellPrice: 600,
      description: "A creepy pile of bones.",
    },

    // === STRUCTURES & OUTDOOR ===
    fence: {
      name: "Fence",
      category: "structures",
      image: "fence",
      width: 2,
      height: 1,
      wall: false,
      collision: [[1, 1]],
      layer: "same",
      rotatable: true,
      recipe: {
        570: 4, // Wood x4
        565: 1, // Steel Ingot x1
      },
      buyPrice: 5000,
      sellPrice: 2000,
      description: "A wooden fence section.",
    },

    bridge: {
      name: "Bridge",
      category: "structures",
      image: "bridge",
      width: 3,
      height: 2,
      wall: false,
      collision: [
        [0, 0, 0],
        [0, 0, 0],
      ],
      layer: "below",
      rotatable: true,
      recipe: {
        570: 8, // Wood x8
        565: 4, // Steel Ingot x4
        575: 2, // Plant Matter x2
      },
      buyPrice: 20000,
      sellPrice: 8000,
      description: "A wooden bridge crossing.",
    },

    stairs: {
      name: "Stairs",
      category: "structures",
      image: "stairs",
      width: 2,
      height: 2,
      wall: false,
      collision: [
        [1, 1],
        [1, 1],
      ],
      layer: "same",
      rotatable: true,
      recipe: {
        570: 6, // Wood x6
        565: 3, // Steel Ingot x3
        571: 2, // Leather x2
      },
      buyPrice: 8000,
      sellPrice: 3200,
      description: "A set of wooden stairs.",
    },

    ladder: {
      name: "Ladder",
      category: "structures",
      image: "ladder",
      width: 1,
      height: 2,
      wall: false,
      collision: [[1], [1]],
      layer: "same",
      rotatable: true,
      recipe: {
        570: 3, // Wood x3
        565: 2, // Steel Ingot x2
        571: 1, // Leather x1
      },
      buyPrice: 6000,
      sellPrice: 2400,
      description: "A wooden ladder for climbing.",
    },

    rails: {
      name: "Rails",
      category: "structures",
      image: "rails",
      width: 3,
      height: 1,
      wall: false,
      collision: [[1, 1, 1]],
      layer: "same",
      rotatable: true,
      recipe: {
        565: 4, // Steel Ingot x4
        566: 2, // Titanium Ingot x2
      },
      buyPrice: 4000,
      sellPrice: 1600,
      description: "Metal safety rails.",
    },

    // === WINDOWS ===
    window_1x1: {
      name: "Window (1x1)",
      category: "structures",
      image: "window_1x1",
      width: 1,
      height: 1,
      wall: true,
      collision: [[0]],
      layer: "above",
      rotatable: false,
      wallMounted: true,
      recipe: {
        569: 2, // Glass x2
        565: 1, // Steel Ingot x1
        586: 1, // Composite Resin x1
      },
      buyPrice: 5000,
      sellPrice: 2000,
      description: "A small window.",
    },

    window_2x1: {
      name: "Window (2x1)",
      category: "structures",
      image: "window_2x1",
      width: 2,
      height: 1,
      wall: true,
      collision: [[0, 0]],
      layer: "above",
      rotatable: false,
      wallMounted: true,
      recipe: {
        569: 3, // Glass x3
        565: 2, // Steel Ingot x2
        586: 1, // Composite Resin x1
      },
      buyPrice: 6000,
      sellPrice: 2400,
      description: "A medium window.",
    },

    window_2x2: {
      name: "Window (2x2)",
      category: "structures",
      image: "window_2x2",
      width: 2,
      height: 2,
      wall: true,
      collision: [
        [0, 0],
        [0, 0],
      ],
      layer: "above",
      rotatable: false,
      wallMounted: true,
      recipe: {
        569: 5, // Glass x5
        565: 3, // Steel Ingot x3
        586: 2, // Composite Resin x2
      },
      buyPrice: 8000,
      sellPrice: 3200,
      description: "A large window.",
    },

    // === SIGNS & MISCELLANEOUS ===
    sign: {
      name: "Sign",
      category: "decoration",
      image: "sign",
      width: 1,
      height: 1,
      wall: false,
      collision: [[1]],
      layer: "same",
      rotatable: true,
      recipe: {
        570: 2, // Wood x2
        565: 1, // Steel Ingot x1
      },
      buyPrice: 4000,
      sellPrice: 1600,
      description: "A wooden directional sign.",
    },

    vase: {
      name: "Vase",
      category: "decoration",
      image: "vase",
      width: 1,
      height: 1,
      wall: false,
      collision: [[1]],
      layer: "same",
      rotatable: false,
      recipe: {
        569: 3, // Glass x3
        586: 1, // Composite Resin x1
      },
      buyPrice: 4000,
      sellPrice: 1600,
      description: "A decorative vase.",
    },

    clock: {
      name: "Wall Clock",
      category: "decoration",
      image: "clock",
      width: 1,
      height: 1,
      wall: true,
      collision: [[0]],
      layer: "above",
      rotatable: false,
      wallMounted: true,
      recipe: {
        565: 2, // Steel Ingot x2
        583: 2, // Microchip x2
        584: 1, // Battery Cell x1
      },
      buyPrice: 6000,
      sellPrice: 2400,
      description: "A mechanical wall clock.",
    },

    grandfather_clock: {
      name: "Grandfather Clock",
      category: "decoration",
      image: "grandfather_clock",
      width: 1,
      height: 3,
      wall: false,
      collision: [[1], [1], [1]],
      layer: "same",
      rotatable: false,
      interactive: true,
      eventId: 0,
      recipe: {
        570: 5, // Wood x5
        565: 3, // Steel Ingot x3
        583: 2, // Microchip x2
        584: 1, // Battery Cell x1
      },
      buyPrice: 15000,
      sellPrice: 6000,
      description: "An elegant grandfather clock.",
    },

    world_globe: {
      name: "World Globe",
      category: "decoration",
      image: "world_globe",
      width: 1,
      height: 2,
      wall: false,
      collision: [[1], [0]],
      layer: "same",
      rotatable: true,
      interactive: true,
      eventId: 0,
      recipe: {
        569: 2, // Glass x2
        570: 1, // Wood x1
        565: 1, // Steel Ingot x1
      },
      buyPrice: 12000,
      sellPrice: 4800,
      description: "A rotating world globe.",
    },

    world_map: {
      name: "World Map",
      category: "decoration",
      image: "world_map",
      width: 2,
      height: 2,
      wall: false,
      collision: [
        [0, 0],
        [0, 0],
      ],
      layer: "above",
      rotatable: false,
      wallMounted: true,
      recipe: {
        572: 2, // Cloth x2
        569: 1, // Glass x1
        565: 1, // Steel Ingot x1
      },
      buyPrice: 2000,
      sellPrice: 800,
      description: "A framed world map.",
    },

    prayer_rug: {
      name: "Prayer Rug",
      category: "decoration",
      image: "prayer_rug",
      width: 2,
      height: 2,
      wall: false,
      collision: [
        [0, 0],
        [0, 0],
      ],
      layer: "below",
      rotatable: true,
      recipe: {
        572: 4, // Cloth x4
        571: 2, // Leather x2
      },
      buyPrice: 2000,
      sellPrice: 800,
      description: "A decorative prayer rug.",
    },

    // === TRASH & STORAGE ===
    trash_pile: {
      name: "Trash Pile",
      category: "decoration",
      image: "trash_pile",
      width: 2,
      height: 1,
      wall: false,
      collision: [[1, 1]],
      layer: "same",
      rotatable: false,
      recipe: {
        586: 3, // Composite Resin x3
        573: 1, // Bone x1
      },
      buyPrice: 2000,
      sellPrice: 800,
      description: "A pile of discarded trash.",
    },

    barrel: {
      name: "Barrel",
      category: "storage",
      image: "barrel",
      width: 1,
      height: 1,
      wall: false,
      collision: [[1]],
      layer: "same",
      rotatable: false,
      interactive: true,
      eventId: 0,
      storageCapacity: 10,
      recipe: {
        570: 3, // Wood x3
        565: 1, // Steel Ingot x1
        577: 1, // Oil Flask x1
      },
      buyPrice: 4000,
      sellPrice: 1600,
      description: "A wooden storage barrel.",
    },

    pile_of_books: {
      name: "Pile of Books",
      category: "decoration",
      image: "pile_of_books",
      width: 2,
      height: 1,
      wall: false,
      collision: [[1, 1]],
      layer: "same",
      rotatable: false,
      recipe: {
        572: 3, // Cloth x3
        570: 2, // Wood x2
      },
      buyPrice: 3000,
      sellPrice: 1200,
      description: "A stack of old books.",
    },

    // === ATMOSPHERE & LIGHTING ===
    candle: {
      name: "Candle",
      category: "lighting",
      image: "candle",
      width: 1,
      height: 1,
      wall: false,
      collision: [[0]],
      layer: "above",
      rotatable: false,
      recipe: {
        577: 2, // Oil Flask x2
        572: 1, // Cloth x1
      },
      buyPrice: 500,
      sellPrice: 200,
      description: "A lit decorative candle.",
    },

    pentagram: {
      name: "Pentagram Floor",
      category: "decoration",
      image: "pentagram",
      width: 2,
      height: 2,
      wall: false,
      collision: [
        [0, 0],
        [0, 0],
      ],
      layer: "below",
      rotatable: false,
      recipe: {
        579: 2, // Arcane Essence x2
        580: 2, // Ethereal Shard x2
        577: 1, // Oil Flask x1
      },
      buyPrice: 10000,
      sellPrice: 4000,
      description: "A mystical pentagram drawn on the floor.",
    },

    stage_lights: {
      name: "Stage Lights",
      category: "lighting",
      image: "stage_lights",
      width: 2,
      height: 2,
      wall: false,
      collision: [
        [0, 0],
        [0, 0],
      ],
      layer: "above",
      rotatable: false,
      recipe: {
        565: 3, // Steel Ingot x3
        584: 3, // Battery Cell x3
        583: 2, // Microchip x2
        569: 2, // Glass x2
      },
      buyPrice: 12000,
      sellPrice: 4800,
      description: "Professional stage lighting rig.",
    },

    // === INDUSTRIAL ===
    pipe: {
      name: "Pipe",
      category: "structures",
      image: "pipe",
      width: 1,
      height: 2,
      wall: false,
      collision: [[1], [1]],
      layer: "same",
      rotatable: true,
      recipe: {
        565: 3, // Steel Ingot x3
        578: 1, // Acidic Solution x1
      },
      buyPrice: 5000,
      sellPrice: 2000,
      description: "An industrial metal pipe.",
    },

    motor_engine: {
      name: "Big Motor Engine",
      category: "workstations",
      image: "motor_engine",
      width: 2,
      height: 2,
      wall: false,
      collision: [
        [1, 1],
        [1, 1],
      ],
      layer: "same",
      rotatable: false,
      interactive: true,
      eventId: 0,
      recipe: {
        565: 6, // Steel Ingot x6
        566: 4, // Titanium Ingot x4
        582: 3, // Circuit Board x3
        583: 3, // Microchip x3
        584: 2, // Battery Cell x2
      },
      buyPrice: 30000,
      sellPrice: 12000,
      description: "A large industrial motor engine.",
    },

    // === MUSIC & INSTRUMENTS ===
    piano: {
      name: "Piano",
      category: "entertainment",
      image: "piano",
      width: 2,
      height: 2,
      wall: false,
      collision: [
        [1, 1],
        [1, 1],
      ],
      layer: "same",
      rotatable: true,
      interactive: true,
      eventId: 0,
      recipe: {
        570: 8, // Wood x8
        571: 3, // Leather x3
        565: 3, // Steel Ingot x3
        583: 2, // Microchip x2
      },
      buyPrice: 28000,
      sellPrice: 11200,
      description: "A grand piano for musical performances.",
    },

    guitar: {
      name: "Acoustic Guitar",
      category: "entertainment",
      image: "guitar",
      width: 1,
      height: 2,
      wall: false,
      collision: [[1], [1]],
      layer: "same",
      rotatable: true,
      interactive: true,
      eventId: 0,
      recipe: {
        570: 4, // Wood x4
        571: 2, // Leather x2
        565: 1, // Steel Ingot x1
      },
      buyPrice: 18000,
      sellPrice: 7200,
      description: "An acoustic guitar for playing.",
    },

    electric_guitar: {
      name: "Electric Guitar",
      category: "entertainment",
      image: "electric_guitar",
      width: 1,
      height: 2,
      wall: false,
      collision: [[1], [1]],
      layer: "same",
      rotatable: true,
      interactive: true,
      eventId: 0,
      recipe: {
        570: 3, // Wood x3
        565: 3, // Steel Ingot x3
        583: 2, // Microchip x2
        584: 1, // Battery Cell x1
      },
      buyPrice: 22000,
      sellPrice: 8800,
      description: "A modern electric guitar.",
    },

    harp: {
      name: "Harp",
      category: "entertainment",
      image: "harp",
      width: 2,
      height: 3,
      wall: false,
      collision: [
        [1, 1],
        [1, 1],
        [0, 0],
      ],
      layer: "same",
      rotatable: true,
      interactive: true,
      eventId: 0,
      recipe: {
        570: 5, // Wood x5
        571: 3, // Leather x3
        565: 2, // Steel Ingot x2
      },
      buyPrice: 20000,
      sellPrice: 8000,
      description: "A beautiful golden harp.",
    },

    // === HOME ITEMS ===
    crib: {
      name: "Baby Crib",
      category: "beds",
      image: "crib",
      width: 2,
      height: 2,
      wall: false,
      collision: [
        [1, 1],
        [1, 1],
      ],
      layer: "same",
      rotatable: true,
      interactive: true,
      eventId: 0,
      recipe: {
        570: 4, // Wood x4
        572: 3, // Cloth x3
        571: 1, // Leather x1
      },
      buyPrice: 7000,
      sellPrice: 2800,
      description: "A comfortable baby crib.",
    },

    radio: {
      name: "Radio",
      category: "entertainment",
      image: "radio",
      width: 1,
      height: 1,
      wall: false,
      collision: [[1]],
      layer: "same",
      rotatable: false,
      interactive: true,
      eventId: 0,
      recipe: {
        565: 2, // Steel Ingot x2
        583: 2, // Microchip x2
        584: 1, // Battery Cell x1
        585: 1, // Plastic Polymer x1
      },
      buyPrice: 7000,
      sellPrice: 2800,
      description: "An old radio for music and news.",
    },

    wc: {
      name: "Toilet",
      category: "appliances",
      image: "wc",
      width: 1,
      height: 2,
      wall: false,
      collision: [[1], [0]],
      layer: "same",
      rotatable: true,
      interactive: true,
      eventId: 0,
      recipe: {
        565: 2, // Steel Ingot x2
        569: 1, // Glass x1
        585: 2, // Plastic Polymer x2
      },
      buyPrice: 8000,
      sellPrice: 3200,
      description: "A functional toilet.",
    },

    shower: {
      name: "Shower",
      category: "appliances",
      image: "shower",
      width: 1,
      height: 2,
      wall: false,
      collision: [[1], [1]],
      layer: "same",
      rotatable: true,
      interactive: true,
      eventId: 0,
      recipe: {
        565: 3, // Steel Ingot x3
        569: 2, // Glass x2
        578: 1, // Acidic Solution x1
      },
      buyPrice: 9000,
      sellPrice: 3600,
      description: "A shower stall for bathing.",
    },

    pc: {
      name: "Computer",
      category: "workstations",
      image: "pc",
      width: 1,
      height: 1,
      wall: false,
      collision: [[1]],
      layer: "same",
      rotatable: false,
      interactive: true,
      eventId: 0,
      recipe: {
        565: 3, // Steel Ingot x3
        583: 3, // Microchip x3
        584: 2, // Battery Cell x2
        585: 2, // Plastic Polymer x2
      },
      buyPrice: 25000,
      sellPrice: 10000,
      description: "A high-performance desktop computer.",
    },

    christmas_tree: {
      name: "Christmas Tree",
      category: "decoration",
      image: "christmas_tree",
      width: 2,
      height: 3,
      wall: false,
      collision: [
        [1, 1],
        [1, 1],
        [1, 1],
      ],
      layer: "same",
      rotatable: false,
      interactive: true,
      eventId: 0,
      recipe: {
        575: 5, // Plant Matter x5
        584: 2, // Battery Cell x2
        586: 1, // Composite Resin x1
      },
      buyPrice: 10000,
      sellPrice: 4000,
      description: "A festive decorated Christmas tree.",
    },

    warrior_statue: {
      name: "Warrior Monk Statue",
      category: "decoration",
      image: "warrior_statue",
      width: 1,
      height: 2,
      wall: false,
      collision: [[1], [1]],
      layer: "same",
      rotatable: true,
      recipe: {
        573: 5, // Bone x5
        586: 3, // Composite Resin x3
        565: 2, // Steel Ingot x2
      },
      buyPrice: 15000,
      sellPrice: 6000,
      description: "A statue of a mighty warrior monk.",
    },

    baseball_bat: {
      name: "Baseball Bat",
      category: "entertainment",
      image: "baseball_bat",
      width: 1,
      height: 2,
      wall: false,
      collision: [[1], [1]],
      layer: "same",
      rotatable: true,
      interactive: true,
      eventId: 0,
      recipe: {
        570: 2, // Wood x2
        571: 1, // Leather x1
      },
      buyPrice: 3000,
      sellPrice: 1200,
      description: "A wooden baseball bat.",
    },

    // === 2001 ERA TECH & COMPUTERS ===
    crt_monitor: {
      name: "CRT Monitor",
      category: "workstations",
      image: "crt_monitor",
      width: 1,
      height: 1,
      wall: false,
      collision: [[1]],
      layer: "same",
      rotatable: false,
      interactive: true,
      eventId: 0,
      recipe: {
        565: 2, // Steel Ingot x2
        569: 2, // Glass x2
        583: 2, // Microchip x2
        584: 1, // Battery Cell x1
      },
      buyPrice: 12000,
      sellPrice: 4800,
      description: "A bulky CRT computer monitor (2001 era).",
    },

    desktop_computer_2001: {
      name: "Desktop PC (2001)",
      category: "workstations",
      image: "desktop_computer_2001",
      width: 1,
      height: 1,
      wall: false,
      collision: [[1]],
      layer: "same",
      rotatable: false,
      interactive: true,
      eventId: 0,
      recipe: {
        565: 4, // Steel Ingot x4
        583: 4, // Microchip x4
        584: 3, // Battery Cell x3
        585: 3, // Plastic Polymer x3
      },
      buyPrice: 28000,
      sellPrice: 11200,
      description: "A chunky desktop computer from 2001.",
    },

    keyboard_mouse: {
      name: "Keyboard & Mouse",
      category: "workstations",
      image: "keyboard_mouse",
      width: 1,
      height: 1,
      wall: false,
      collision: [[0]],
      layer: "above",
      rotatable: false,
      recipe: {
        565: 1, // Steel Ingot x1
        583: 1, // Microchip x1
        585: 1, // Plastic Polymer x1
      },
      buyPrice: 4000,
      sellPrice: 1600,
      description: "Computer keyboard and mouse combo.",
    },

    dial_up_modem: {
      name: "Dial-up Modem",
      category: "workstations",
      image: "dial_up_modem",
      width: 1,
      height: 1,
      wall: false,
      collision: [[1]],
      layer: "same",
      rotatable: false,
      interactive: true,
      eventId: 0,
      recipe: {
        565: 1, // Steel Ingot x1
        583: 2, // Microchip x2
        584: 1, // Battery Cell x1
      },
      buyPrice: 6000,
      sellPrice: 2400,
      description: "Dial-up internet modem (screech and squeal included).",
    },

    landline_phone: {
      name: "Landline Phone",
      category: "entertainment",
      image: "landline_phone",
      width: 1,
      height: 1,
      wall: false,
      collision: [[1]],
      layer: "same",
      rotatable: false,
      interactive: true,
      eventId: 0,
      recipe: {
        565: 1, // Steel Ingot x1
        583: 1, // Microchip x1
        585: 1, // Plastic Polymer x1
      },
      buyPrice: 3000,
      sellPrice: 1200,
      description: "A corded landline telephone.",
    },

    printer_inkjet: {
      name: "Inkjet Printer",
      category: "workstations",
      image: "printer_inkjet",
      width: 1,
      height: 1,
      wall: false,
      collision: [[1]],
      layer: "same",
      rotatable: false,
      interactive: true,
      eventId: 0,
      recipe: {
        565: 2, // Steel Ingot x2
        583: 2, // Microchip x2
        585: 2, // Plastic Polymer x2
      },
      buyPrice: 8000,
      sellPrice: 3200,
      description: "An inkjet printer (loud and slow).",
    },

    fax_machine: {
      name: "Fax Machine",
      category: "workstations",
      image: "fax_machine",
      width: 1,
      height: 1,
      wall: false,
      collision: [[1]],
      layer: "same",
      rotatable: false,
      interactive: true,
      eventId: 0,
      recipe: {
        565: 2, // Steel Ingot x2
        583: 2, // Microchip x2
        584: 1, // Battery Cell x1
      },
      buyPrice: 7000,
      sellPrice: 2800,
      description: "A standalone fax machine.",
    },

    vcr_player: {
      name: "VCR Player",
      category: "entertainment",
      image: "vcr_player",
      width: 1,
      height: 1,
      wall: false,
      collision: [[1]],
      layer: "same",
      rotatable: false,
      interactive: true,
      eventId: 0,
      recipe: {
        565: 2, // Steel Ingot x2
        583: 2, // Microchip x2
        584: 1, // Battery Cell x1
      },
      buyPrice: 6000,
      sellPrice: 2400,
      description: "VCR for playing VHS tapes.",
    },

    dvd_player: {
      name: "DVD Player",
      category: "entertainment",
      image: "dvd_player",
      width: 1,
      height: 1,
      wall: false,
      collision: [[1]],
      layer: "same",
      rotatable: false,
      interactive: true,
      eventId: 0,
      recipe: {
        565: 2, // Steel Ingot x2
        583: 3, // Microchip x3
        584: 2, // Battery Cell x2
      },
      buyPrice: 8000,
      sellPrice: 3200,
      description: "New DVD player (state of the art in 2001).",
    },

    cable_box: {
      name: "Cable Box",
      category: "entertainment",
      image: "cable_box",
      width: 1,
      height: 1,
      wall: false,
      collision: [[1]],
      layer: "same",
      rotatable: false,
      interactive: true,
      eventId: 0,
      recipe: {
        565: 1, // Steel Ingot x1
        583: 2, // Microchip x2
        584: 1, // Battery Cell x1
      },
      buyPrice: 4000,
      sellPrice: 1600,
      description: "Cable television box with remote control.",
    },

    game_console_ps1: {
      name: "Battlestation 1",
      category: "entertainment",
      image: "game_console_ps1",
      width: 1,
      height: 1,
      wall: false,
      collision: [[1]],
      layer: "same",
      rotatable: false,
      interactive: true,
      eventId: 0,
      recipe: {
        565: 3, // Steel Ingot x3
        583: 3, // Microchip x3
        584: 2, // Battery Cell x2
        585: 2, // Plastic Polymer x2
      },
      buyPrice: 20000,
      sellPrice: 8000,
      description: "Sony PlayStation console (2001 era).",
    },

    game_console_n64: {
      name: "Tintendon 666",
      category: "entertainment",
      image: "game_console_n64",
      width: 1,
      height: 1,
      wall: false,
      collision: [[1]],
      layer: "same",
      rotatable: false,
      interactive: true,
      eventId: 0,
      recipe: {
        565: 3, // Steel Ingot x3
        583: 3, // Microchip x3
        584: 2, // Battery Cell x2
        585: 2, // Plastic Polymer x2
      },
      buyPrice: 18000,
      sellPrice: 7200,
      description: "Nintendo 64 gaming console.",
    },

    dreamcast_console: {
      name: "Mastercast Console",
      category: "entertainment",
      image: "dreamcast_console",
      width: 1,
      height: 1,
      wall: false,
      collision: [[1]],
      layer: "same",
      rotatable: false,
      interactive: true,
      eventId: 0,
      recipe: {
        565: 3, // Steel Ingot x3
        583: 3, // Microchip x3
        584: 2, // Battery Cell x2
        585: 2, // Plastic Polymer x2
      },
      buyPrice: 18000,
      sellPrice: 7200,
      description: "Sega Dreamcast gaming console.",
    },

    crt_television: {
      name: "CRT Television",
      category: "entertainment",
      image: "crt_television",
      width: 2,
      height: 2,
      wall: false,
      collision: [
        [1, 1],
        [1, 1],
      ],
      layer: "same",
      rotatable: true,
      interactive: true,
      eventId: 0,
      recipe: {
        565: 4, // Steel Ingot x4
        569: 4, // Glass x4
        583: 2, // Microchip x2
        584: 2, // Battery Cell x2
      },
      buyPrice: 16000,
      sellPrice: 6400,
      description: "Large CRT television set.",
    },

    stereo_boombox: {
      name: "Stereo Boombox",
      category: "entertainment",
      image: "stereo_boombox",
      width: 2,
      height: 1,
      wall: false,
      collision: [[1, 1]],
      layer: "same",
      rotatable: true,
      interactive: true,
      eventId: 0,
      recipe: {
        565: 2, // Steel Ingot x2
        583: 3, // Microchip x3
        584: 2, // Battery Cell x2
        585: 2, // Plastic Polymer x2
      },
      buyPrice: 10000,
      sellPrice: 4000,
      description: "Stereo boombox with cassette and CD player.",
    },

    zip_drive: {
      name: "Zip Drive",
      category: "workstations",
      image: "zip_drive",
      width: 1,
      height: 1,
      wall: false,
      collision: [[1]],
      layer: "same",
      rotatable: false,
      interactive: true,
      eventId: 0,
      recipe: {
        565: 1, // Steel Ingot x1
        583: 2, // Microchip x2
        585: 1, // Plastic Polymer x1
      },
      buyPrice: 5000,
      sellPrice: 2000,
      description: "Iomega Zip drive (100MB storage).",
    },

    // === FURNITURE (2001 STYLE) ===
    beanbag_chair: {
      name: "Beanbag Chair",
      category: "seating",
      image: "beanbag_chair",
      width: 1,
      height: 1,
      wall: false,
      collision: [[1]],
      layer: "same",
      rotatable: false,
      interactive: true,
      eventId: 0,
      recipe: {
        572: 4, // Cloth x4
        575: 3, // Plant Matter x3
      },
      buyPrice: 5000,
      sellPrice: 2000,
      description: "A comfortable beanbag chair (2001 style).",
    },

    futon: {
      name: "Futon",
      category: "beds",
      image: "futon",
      width: 2,
      height: 2,
      wall: false,
      collision: [
        [1, 1],
        [1, 1],
      ],
      layer: "same",
      rotatable: true,
      interactive: true,
      eventId: 0,
      recipe: {
        570: 5, // Wood x5
        572: 4, // Cloth x4
        571: 2, // Leather x2
      },
      buyPrice: 12000,
      sellPrice: 4800,
      description: "A futon couch/bed combo.",
    },

    metal_shelving: {
      name: "Metal Shelving Unit",
      category: "storage",
      image: "metal_shelving",
      width: 2,
      height: 3,
      wall: false,
      collision: [
        [1, 1],
        [1, 1],
        [1, 1],
      ],
      layer: "same",
      rotatable: true,
      recipe: {
        565: 5, // Steel Ingot x5
        566: 2, // Titanium Ingot x2
      },
      buyPrice: 8000,
      sellPrice: 3200,
      description: "Industrial metal shelving unit.",
    },

    loft_bed: {
      name: "Loft Bed",
      category: "beds",
      image: "loft_bed",
      width: 2,
      height: 3,
      wall: false,
      collision: [
        [1, 1],
        [1, 1],
        [1, 1],
      ],
      layer: "same",
      rotatable: true,
      interactive: true,
      eventId: 0,
      recipe: {
        570: 8, // Wood x8
        565: 4, // Steel Ingot x4
        572: 3, // Cloth x3
      },
      buyPrice: 18000,
      sellPrice: 7200,
      description: "A loft bed for small spaces.",
    },

    bunk_bed: {
      name: "Bunk Bed",
      category: "beds",
      image: "bunk_bed",
      width: 2,
      height: 3,
      wall: false,
      collision: [
        [1, 1],
        [1, 1],
        [1, 1],
      ],
      layer: "same",
      rotatable: true,
      interactive: true,
      eventId: 0,
      recipe: {
        570: 8, // Wood x8
        565: 3, // Steel Ingot x3
        572: 4, // Cloth x4
      },
      buyPrice: 15000,
      sellPrice: 6000,
      description: "A bunk bed for two sleepers.",
    },

    water_cooler: {
      name: "Water Cooler",
      category: "appliances",
      image: "water_cooler",
      width: 1,
      height: 2,
      wall: false,
      collision: [[1], [1]],
      layer: "same",
      rotatable: true,
      interactive: true,
      eventId: 0,
      recipe: {
        565: 3, // Steel Ingot x3
        569: 2, // Glass x2
        584: 1, // Battery Cell x1
      },
      buyPrice: 6000,
      sellPrice: 2400,
      description: "Office water cooler for gossip and hydration.",
    },

    desk_lamp: {
      name: "Desk Lamp",
      category: "lighting",
      image: "desk_lamp",
      width: 1,
      height: 1,
      wall: false,
      collision: [[0]],
      layer: "above",
      rotatable: true,
      recipe: {
        565: 1, // Steel Ingot x1
        584: 1, // Battery Cell x1
        586: 1, // Composite Resin x1
      },
      buyPrice: 2000,
      sellPrice: 800,
      description: "A simple desk lamp.",
    },

    floor_lamp: {
      name: "Floor Lamp",
      category: "lighting",
      image: "floor_lamp",
      width: 1,
      height: 2,
      wall: false,
      collision: [[1], [1]],
      layer: "same",
      rotatable: true,
      recipe: {
        565: 2, // Steel Ingot x2
        584: 2, // Battery Cell x2
        586: 1, // Composite Resin x1
      },
      buyPrice: 3000,
      sellPrice: 1200,
      description: "A tall floor lamp.",
    },

    lava_lamp: {
      name: "Lava Lamp",
      category: "decoration",
      image: "lava_lamp",
      width: 1,
      height: 1,
      wall: false,
      collision: [[1]],
      layer: "same",
      rotatable: false,
      interactive: true,
      eventId: 0,
      recipe: {
        569: 2, // Glass x2
        584: 2, // Battery Cell x2
        586: 1, // Composite Resin x1
      },
      buyPrice: 4000,
      sellPrice: 1600,
      description: "A groovy lava lamp (2001 essential).",
    },

    // === DECORATIONS & POSTERS ===
    movie_poster: {
      name: "Movie Poster",
      category: "decoration",
      image: "movie_poster",
      width: 1,
      height: 2,
      wall: false,
      collision: [[0]],
      layer: "above",
      rotatable: false,
      wallMounted: true,
      recipe: {
        572: 1, // Cloth x1
        565: 1, // Steel Ingot x1
      },
      buyPrice: 1000,
      sellPrice: 400,
      description: "A movie poster from 2001.",
    },

    band_poster: {
      name: "Band Poster",
      category: "decoration",
      image: "band_poster",
      width: 1,
      height: 2,
      wall: false,
      collision: [[0]],
      layer: "above",
      rotatable: false,
      wallMounted: true,
      recipe: {
        572: 1, // Cloth x1
        565: 1, // Steel Ingot x1
      },
      buyPrice: 1000,
      sellPrice: 400,
      description: "A band poster on the wall.",
    },

    sports_poster: {
      name: "Sports Poster",
      category: "decoration",
      image: "sports_poster",
      width: 1,
      height: 2,
      wall: false,
      collision: [[0]],
      layer: "above",
      rotatable: false,
      wallMounted: true,
      recipe: {
        572: 1, // Cloth x1
        565: 1, // Steel Ingot x1
      },
      buyPrice: 1000,
      sellPrice: 400,
      description: "A sports team poster.",
    },

    neon_sign: {
      name: "Neon Sign",
      category: "lighting",
      image: "neon_sign",
      width: 2,
      height: 1,
      wall: false,
      collision: [[0, 0]],
      layer: "above",
      rotatable: true,
      recipe: {
        569: 3, // Glass x3
        584: 2, // Battery Cell x2
        585: 1, // Plastic Polymer x1
      },
      buyPrice: 8000,
      sellPrice: 3200,
      description: "A neon sign for cool vibes.",
    },

    string_lights: {
      name: "String Lights",
      category: "lighting",
      image: "string_lights",
      width: 3,
      height: 1,
      wall: false,
      collision: [[0, 0, 0]],
      layer: "above",
      rotatable: true,
      recipe: {
        584: 3, // Battery Cell x3
        585: 2, // Plastic Polymer x2
      },
      buyPrice: 3000,
      sellPrice: 1200,
      description: "Decorative string lights.",
    },

    tapestry: {
      name: "Tapestry",
      category: "decoration",
      image: "tapestry",
      width: 2,
      height: 2,
      wall: false,
      collision: [
        [0, 0],
        [0, 0],
      ],
      layer: "above",
      rotatable: false,
      wallMounted: true,
      recipe: {
        572: 3, // Cloth x3
        571: 1, // Leather x1
      },
      buyPrice: 4000,
      sellPrice: 1600,
      description: "A decorative tapestry on the wall.",
    },

    picture_frame: {
      name: "Picture Frame",
      category: "decoration",
      image: "picture_frame",
      width: 1,
      height: 1,
      wall: false,
      collision: [[0]],
      layer: "above",
      rotatable: false,
      wallMounted: true,
      recipe: {
        569: 1, // Glass x1
        570: 1, // Wood x1
        586: 1, // Composite Resin x1
      },
      buyPrice: 2000,
      sellPrice: 800,
      description: "A framed photo on the wall.",
    },

    // === OFFICE FURNITURE ===
    cubicle_divider: {
      name: "Cubicle Divider",
      category: "structures",
      image: "cubicle_divider",
      width: 2,
      height: 2,
      wall: false,
      collision: [
        [1, 1],
        [1, 1],
      ],
      layer: "same",
      rotatable: true,
      recipe: {
        572: 4, // Cloth x4
        565: 2, // Steel Ingot x2
        570: 2, // Wood x2
      },
      buyPrice: 6000,
      sellPrice: 2400,
      description: "Office cubicle partition.",
    },

    filing_cabinet: {
      name: "Filing Cabinet",
      category: "storage",
      image: "filing_cabinet",
      width: 1,
      height: 2,
      wall: false,
      collision: [[1], [1]],
      layer: "same",
      rotatable: true,
      interactive: true,
      eventId: 0,
      storageCapacity: 25,
      recipe: {
        565: 3, // Steel Ingot x3
        570: 2, // Wood x2
      },
      buyPrice: 7000,
      sellPrice: 2800,
      description: "Metal filing cabinet for documents.",
    },

    office_desk: {
      name: "Office Desk",
      category: "tables",
      image: "office_desk",
      width: 3,
      height: 2,
      wall: false,
      collision: [
        [1, 1, 1],
        [1, 0, 1],
      ],
      layer: "same",
      rotatable: true,
      recipe: {
        570: 5, // Wood x5
        565: 3, // Steel Ingot x3
        586: 2, // Composite Resin x2
      },
      buyPrice: 10000,
      sellPrice: 4000,
      description: "A typical office desk.",
    },

    office_chair: {
      name: "Office Chair",
      category: "seating",
      image: "office_chair",
      width: 1,
      height: 1,
      wall: false,
      collision: [[1]],
      layer: "same",
      rotatable: true,
      interactive: true,
      eventId: 0,
      recipe: {
        565: 2, // Steel Ingot x2
        571: 2, // Leather x2
        572: 1, // Cloth x1
      },
      buyPrice: 5000,
      sellPrice: 2000,
      description: "A rolling office chair.",
    },

    bulletin_board: {
      name: "Bulletin Board",
      category: "decoration",
      image: "bulletin_board",
      width: 2,
      height: 2,
      wall: false,
      collision: [
        [0, 0],
        [0, 0],
      ],
      layer: "above",
      rotatable: false,
      wallMounted: true,
      recipe: {
        570: 2, // Wood x2
        572: 2, // Cloth x2
        565: 1, // Steel Ingot x1
      },
      buyPrice: 3000,
      sellPrice: 1200,
      description: "Cork bulletin board for notes and memos.",
    },

    whiteboard: {
      name: "Whiteboard",
      category: "decoration",
      image: "whiteboard",
      width: 2,
      height: 2,
      wall: false,
      collision: [[1, 1][(0, 0)]],
      layer: "above",
      rotatable: false,
      wallMounted: true,
      recipe: {
        569: 2, // Glass x2
        565: 1, // Steel Ingot x1
        586: 1, // Composite Resin x1
      },
      buyPrice: 3000,
      sellPrice: 1200,
      description: "Whiteboard for sketching and planning.",
    },

    // === BATHROOM/KITCHEN ITEMS ===
    bathtub: {
      name: "Bathtub",
      category: "appliances",
      image: "bathtub",
      width: 2,
      height: 3,
      wall: false,
      collision: [
        [1, 1],
        [1, 1],
        [0, 0],
      ],
      layer: "same",
      rotatable: true,
      interactive: true,
      eventId: 0,
      recipe: {
        565: 4, // Steel Ingot x4
        569: 2, // Glass x2
        585: 2, // Plastic Polymer x2
      },
      buyPrice: 14000,
      sellPrice: 5600,
      description: "A relaxing bathtub.",
    },

    sink: {
      name: "Sink",
      category: "appliances",
      image: "sink",
      width: 1,
      height: 1,
      wall: false,
      collision: [[1]],
      layer: "same",
      rotatable: true,
      interactive: true,
      eventId: 0,
      recipe: {
        565: 2, // Steel Ingot x2
        569: 1, // Glass x1
        578: 1, // Acidic Solution x1
      },
      buyPrice: 5000,
      sellPrice: 2000,
      description: "A functional bathroom/kitchen sink.",
    },

    cabinet: {
      name: "Cabinet",
      category: "storage",
      image: "cabinet",
      width: 1,
      height: 2,
      wall: false,
      collision: [[1], [1]],
      layer: "same",
      rotatable: true,
      interactive: true,
      eventId: 0,
      storageCapacity: 20,
      recipe: {
        570: 4, // Wood x4
        565: 1, // Steel Ingot x1
        586: 1, // Composite Resin x1
      },
      buyPrice: 6000,
      sellPrice: 2400,
      description: "Kitchen or bathroom cabinet.",
    },

    counter: {
      name: "Counter",
      category: "tables",
      image: "counter",
      width: 2,
      height: 1,
      wall: false,
      collision: [[1, 1]],
      layer: "same",
      rotatable: true,
      recipe: {
        570: 3, // Wood x3
        565: 2, // Steel Ingot x2
        586: 1, // Composite Resin x1
      },
      buyPrice: 6000,
      sellPrice: 2400,
      description: "Kitchen counter.",
    },

    microwave: {
      name: "Microwave",
      category: "appliances",
      image: "microwave",
      width: 1,
      height: 1,
      wall: false,
      collision: [[1]],
      layer: "same",
      rotatable: false,
      interactive: true,
      eventId: 0,
      recipe: {
        565: 2, // Steel Ingot x2
        583: 2, // Microchip x2
        584: 1, // Battery Cell x1
      },
      buyPrice: 7000,
      sellPrice: 2800,
      description: "Microwave oven.",
    },

    dishwasher: {
      name: "Dishwasher",
      category: "appliances",
      image: "dishwasher",
      width: 1,
      height: 1,
      wall: false,
      collision: [[1]],
      layer: "same",
      rotatable: true,
      interactive: true,
      eventId: 0,
      recipe: {
        565: 3, // Steel Ingot x3
        583: 2, // Microchip x2
        584: 1, // Battery Cell x1
      },
      buyPrice: 9000,
      sellPrice: 3600,
      description: "Automatic dishwasher.",
    },

    washing_machine: {
      name: "Washing Machine",
      category: "appliances",
      image: "washing_machine",
      width: 2,
      height: 2,
      wall: false,
      collision: [[1,1], [0,0]],
      layer: "same",
      rotatable: true,
      interactive: true,
      eventId: 0,
      recipe: {
        565: 4, // Steel Ingot x4
        583: 2, // Microchip x2
        584: 1, // Battery Cell x1
      },
      buyPrice: 11000,
      sellPrice: 4400,
      description: "Washing machine for laundry.",
    },

    dryer: {
      name: "Dryer",
      category: "appliances",
      image: "dryer",
      width: 1,
      height: 2,
      wall: false,
      collision: [[1], [1]],
      layer: "same",
      rotatable: true,
      interactive: true,
      eventId: 0,
      recipe: {
        565: 3, // Steel Ingot x3
        583: 2, // Microchip x2
        584: 2, // Battery Cell x2
      },
      buyPrice: 10000,
      sellPrice: 4000,
      description: "Electric clothes dryer.",
    },

    // === NOSTALGIC ITEMS ===
    vhs_collection: {
      name: "VHS Collection",
      category: "decoration",
      image: "vhs_collection",
      width: 2,
      height: 1,
      wall: false,
      collision: [[1, 1]],
      layer: "same",
      rotatable: true,
      recipe: {
        572: 2, // Cloth x2
        586: 1, // Composite Resin x1
      },
      buyPrice: 2000,
      sellPrice: 800,
      description: "Stack of VHS tapes.",
    },

    dvd_collection: {
      name: "DVD Collection",
      category: "decoration",
      image: "dvd_collection",
      width: 2,
      height: 1,
      wall: false,
      collision: [[1, 1]],
      layer: "same",
      rotatable: true,
      recipe: {
        572: 2, // Cloth x2
        586: 1, // Composite Resin x1
      },
      buyPrice: 3000,
      sellPrice: 1200,
      description: "Stack of DVD cases.",
    },

    cd_collection: {
      name: "CD Collection",
      category: "decoration",
      image: "cd_collection",
      width: 1,
      height: 2,
      wall: false,
      collision: [[1], [1]],
      layer: "same",
      rotatable: true,
      recipe: {
        586: 3, // Composite Resin x3
      },
      buyPrice: 4000,
      sellPrice: 1600,
      description: "Collection of CDs in cases.",
    },

    comic_book_stack: {
      name: "Comic Book Stack",
      category: "decoration",
      image: "comic_book_stack",
      width: 1,
      height: 1,
      wall: false,
      collision: [[1]],
      layer: "same",
      rotatable: false,
      recipe: {
        572: 2, // Cloth x2
        570: 1, // Wood x1
      },
      buyPrice: 2000,
      sellPrice: 800,
      description: "Stack of comic books.",
    },

    magazine_rack: {
      name: "Magazine Rack",
      category: "storage",
      image: "magazine_rack",
      width: 1,
      height: 2,
      wall: false,
      collision: [[1], [1]],
      layer: "same",
      rotatable: true,
      interactive: true,
      eventId: 0,
      recipe: {
        570: 3, // Wood x3
        565: 1, // Steel Ingot x1
      },
      buyPrice: 3000,
      sellPrice: 1200,
      description: "Rack for magazines and newspapers.",
    },

    incense_burner: {
      name: "Incense Burner",
      category: "decoration",
      image: "incense_burner",
      width: 1,
      height: 1,
      wall: false,
      collision: [[1]],
      layer: "same",
      rotatable: false,
      interactive: true,
      eventId: 0,
      recipe: {
        570: 1, // Wood x1
        577: 2, // Oil Flask x2
      },
      buyPrice: 2000,
      sellPrice: 800,
      description: "Incense burner for aromatherapy.",
    },

    terrarium: {
      name: "Terrarium",
      category: "decoration",
      image: "terrarium",
      width: 1,
      height: 1,
      wall: false,
      collision: [[1]],
      layer: "same",
      rotatable: false,
      interactive: true,
      eventId: 0,
      recipe: {
        569: 3, // Glass x3
        575: 2, // Plant Matter x2
        586: 1, // Composite Resin x1
      },
      buyPrice: 5000,
      sellPrice: 2000,
      description: "A terrarium with tiny plants.",
    },

    pinball_machine: {
      name: "Pinball Machine",
      category: "entertainment",
      image: "pinball_machine",
      width: 1,
      height: 2,
      wall: false,
      collision: [[1], [1]],
      layer: "same",
      rotatable: false,
      interactive: true,
      eventId: 0,
      recipe: {
        565: 5, // Steel Ingot x5
        583: 4, // Microchip x4
        584: 3, // Battery Cell x3
        586: 2, // Composite Resin x2
      },
      buyPrice: 22000,
      sellPrice: 8800,
      description: "Classic pinball machine.",
    },

    floor_cushion: {
      name: "Floor Cushion",
      category: "seating",
      image: "floor_cushion",
      width: 1,
      height: 1,
      wall: false,
      collision: [[0]],
      layer: "below",
      rotatable: false,
      interactive: true,
      eventId: 0,
      recipe: {
        572: 3, // Cloth x3
        575: 2, // Plant Matter x2
      },
      buyPrice: 2000,
      sellPrice: 800,
      description: "A comfortable floor cushion.",
    },

    floor_pillow_stack: {
      name: "Floor Pillow Stack",
      category: "seating",
      image: "floor_pillow_stack",
      width: 2,
      height: 1,
      wall: false,
      collision: [[0, 0]],
      layer: "below",
      rotatable: false,
      interactive: true,
      eventId: 0,
      recipe: {
        572: 4, // Cloth x4
        575: 3, // Plant Matter x3
      },
      buyPrice: 3000,
      sellPrice: 1200,
      description: "Stack of floor pillows.",
    },

    glass_shelves: {
      name: "Glass Shelves",
      category: "storage",
      image: "glass_shelves",
      width: 2,
      height: 2,
      wall: false,
      collision: [
        [1, 1],
        [1, 1],
      ],
      layer: "same",
      rotatable: true,
      recipe: {
        569: 5, // Glass x5
        565: 3, // Steel Ingot x3
      },
      buyPrice: 10000,
      sellPrice: 4000,
      description: "Modern glass shelving display.",
    },

    low_table: {
      name: "Low Table",
      category: "tables",
      image: "low_table",
      width: 2,
      height: 2,
      wall: false,
      collision: [
        [1, 1],
        [1, 1],
      ],
      layer: "same",
      rotatable: true,
      recipe: {
        570: 4, // Wood x4
        565: 1, // Steel Ingot x1
      },
      buyPrice: 5000,
      sellPrice: 2000,
      description: "Low minimalist table.",
    },

    stereo_speaker: {
      name: "Stereo Speaker",
      category: "entertainment",
      image: "stereo_speaker",
      width: 1,
      height: 2,
      wall: false,
      collision: [[1], [1]],
      layer: "same",
      rotatable: true,
      recipe: {
        565: 2, // Steel Ingot x2
        583: 2, // Microchip x2
        584: 1, // Battery Cell x1
      },
      buyPrice: 6000,
      sellPrice: 2400,
      description: "High-quality stereo speaker.",
    },

    // === FARM ITEMS ===
    barn: {
      name: "Barn",
      category: "farm",
      image: "barn",
      width: 4,
      height: 3,
      wall: false,
      collision: [
        [1, 1, 1, 1],
        [1, 1, 1, 1],
        [1, 1, 1, 1],
      ],
      layer: "same",
      rotatable: false,
      interactive: true,
      eventId: 0,
      recipe: {
        570: 12, // Wood x12
        565: 6, // Steel Ingot x6
        572: 4, // Cloth x4
      },
      buyPrice: 50000,
      sellPrice: 20000,
      description: "A large barn for storage and animal housing.",
    },

    windmill: {
      name: "Windmill",
      category: "farm",
      image: "windmill",
      width: 3,
      height: 3,
      wall: false,
      collision: [
        [1, 1, 1],
        [1, 1, 1],
        [1, 1, 1],
      ],
      layer: "same",
      rotatable: false,
      interactive: true,
      eventId: 0,
      recipe: {
        570: 10, // Wood x10
        565: 8, // Steel Ingot x8
        569: 4, // Glass x4
      },
      buyPrice: 40000,
      sellPrice: 16000,
      description: "A functional windmill for grinding grain.",
    },

    silo: {
      name: "Silo",
      category: "farm",
      image: "silo",
      width: 2,
      height: 3,
      wall: false,
      collision: [
        [1, 1],
        [1, 1],
        [1, 1],
      ],
      layer: "same",
      rotatable: false,
      interactive: true,
      eventId: 0,
      recipe: {
        565: 6, // Steel Ingot x6
        570: 4, // Wood x4
        569: 2, // Glass x2
      },
      buyPrice: 30000,
      sellPrice: 12000,
      description: "A tall storage silo for grain and crops.",
    },

    chicken_coop: {
      name: "Chicken Coop",
      category: "farm",
      image: "chicken_coop",
      width: 2,
      height: 2,
      wall: false,
      collision: [
        [1, 1],
        [1, 1],
      ],
      layer: "same",
      rotatable: true,
      interactive: true,
      eventId: 0,
      recipe: {
        570: 6, // Wood x6
        572: 4, // Cloth x4
        571: 2, // Leather x2
      },
      buyPrice: 15000,
      sellPrice: 6000,
      description: "A coop for raising chickens and collecting eggs.",
    },

    pig_pen: {
      name: "Pig Pen",
      category: "farm",
      image: "pig_pen",
      width: 3,
      height: 2,
      wall: false,
      collision: [
        [1, 1, 1],
        [1, 1, 1],
      ],
      layer: "same",
      rotatable: true,
      interactive: true,
      eventId: 0,
      recipe: {
        570: 8, // Wood x8
        565: 4, // Steel Ingot x4
        572: 3, // Cloth x3
      },
      buyPrice: 20000,
      sellPrice: 8000,
      description: "An enclosure for raising pigs.",
    },

    stable: {
      name: "Stable",
      category: "farm",
      image: "stable",
      width: 3,
      height: 2,
      wall: false,
      collision: [
        [1, 1, 1],
        [1, 1, 1],
      ],
      layer: "same",
      rotatable: true,
      interactive: true,
      eventId: 0,
      recipe: {
        570: 10, // Wood x10
        565: 5, // Steel Ingot x5
        572: 4, // Cloth x4
      },
      buyPrice: 25000,
      sellPrice: 10000,
      description: "A stable for keeping horses and other livestock.",
    },

    beehive: {
      name: "Beehive",
      category: "farm",
      image: "beehive",
      width: 1,
      height: 2,
      wall: false,
      collision: [[1], [1]],
      layer: "same",
      rotatable: false,
      interactive: true,
      eventId: 0,
      recipe: {
        570: 4, // Wood x4
        572: 2, // Cloth x2
        575: 2, // Plant Matter x2
      },
      buyPrice: 8000,
      sellPrice: 3200,
      description: "A beehive for producing honey.",
    },

    vegetable_garden: {
      name: "Vegetable Garden",
      category: "farm",
      image: "vegetable_garden",
      width: 2,
      height: 2,
      wall: false,
      collision: [
        [1, 1],
        [1, 1],
      ],
      layer: "same",
      rotatable: false,
      interactive: true,
      eventId: 0,
      recipe: {
        570: 3, // Wood x3
        575: 6, // Plant Matter x6
        569: 1, // Glass x1
      },
      buyPrice: 6000,
      sellPrice: 2400,
      description: "A tended garden for growing vegetables.",
    },

    hay_bales: {
      name: "Hay Bales",
      category: "farm",
      image: "hay_bales",
      width: 2,
      height: 1,
      wall: false,
      collision: [[1, 1]],
      layer: "same",
      rotatable: true,
      recipe: {
        575: 8, // Plant Matter x8
      },
      buyPrice: 3000,
      sellPrice: 1200,
      description: "Bundled hay bales for animal feed storage.",
    },

    water_trough: {
      name: "Water Trough",
      category: "farm",
      image: "water_trough",
      width: 2,
      height: 1,
      wall: false,
      collision: [[1, 1]],
      layer: "same",
      rotatable: true,
      recipe: {
        570: 3, // Wood x3
        565: 2, // Steel Ingot x2
        569: 1, // Glass x1
      },
      buyPrice: 5000,
      sellPrice: 2000,
      description: "A trough for watering livestock.",
    },

    scarecrow: {
      name: "Scarecrow",
      category: "farm",
      image: "scarecrow",
      width: 1,
      height: 2,
      wall: false,
      collision: [[1], [1]],
      layer: "same",
      rotatable: true,
      recipe: {
        570: 2, // Wood x2
        572: 3, // Cloth x3
        575: 2, // Plant Matter x2
      },
      buyPrice: 4000,
      sellPrice: 1600,
      description: "A scarecrow to protect crops from birds.",
    },

    farm_fence: {
      name: "Farm Fence",
      category: "farm",
      image: "farm_fence",
      width: 2,
      height: 1,
      wall: false,
      collision: [[1, 1]],
      layer: "same",
      rotatable: true,
      recipe: {
        570: 3, // Wood x3
        565: 1, // Steel Ingot x1
      },
      buyPrice: 2000,
      sellPrice: 800,
      description: "A simple wooden fence for farm boundaries.",
    },

    crop_field: {
      name: "Crop Field",
      category: "farm",
      image: "crop_field",
      width: 3,
      height: 2,
      wall: false,
      collision: [
        [0, 0, 0],
        [0, 0, 0],
      ],
      layer: "below",
      rotatable: false,
      recipe: {
        575: 10, // Plant Matter x10
      },
      buyPrice: 5000,
      sellPrice: 2000,
      description: "A field planted with crops.",
    },

    fruit_tree: {
      name: "Fruit Tree",
      category: "farm",
      image: "fruit_tree",
      width: 2,
      height: 2,
      wall: false,
      collision: [
        [1, 1],
        [1, 1],
      ],
      layer: "same",
      rotatable: false,
      recipe: {
        575: 8, // Plant Matter x8
        570: 2, // Wood x2
      },
      buyPrice: 10000,
      sellPrice: 4000,
      description: "A fruit-bearing tree for the farm.",
    },

    garden_shed: {
      name: "Garden Shed",
      category: "farm",
      image: "garden_shed",
      width: 2,
      height: 2,
      wall: false,
      collision: [
        [1, 1],
        [1, 1],
      ],
      layer: "same",
      rotatable: true,
      interactive: true,
      eventId: 0,
      recipe: {
        570: 6, // Wood x6
        565: 2, // Steel Ingot x2
        572: 2, // Cloth x2
      },
      buyPrice: 12000,
      sellPrice: 4800,
      description: "A small shed for storing farm tools.",
    },

    milking_station: {
      name: "Milking Station",
      category: "farm",
      image: "milking_station",
      width: 2,
      height: 2,
      wall: false,
      collision: [
        [1, 1],
        [1, 1],
      ],
      layer: "same",
      rotatable: true,
      interactive: true,
      eventId: 0,
      recipe: {
        570: 4, // Wood x4
        565: 3, // Steel Ingot x3
        572: 2, // Cloth x2
      },
      buyPrice: 18000,
      sellPrice: 7200,
      description: "A station equipped for milking dairy animals.",
    },

    feed_trough: {
      name: "Feed Trough",
      category: "farm",
      image: "feed_trough",
      width: 2,
      height: 1,
      wall: false,
      collision: [[1, 1]],
      layer: "same",
      rotatable: true,
      recipe: {
        570: 3, // Wood x3
        565: 1, // Steel Ingot x1
        575: 2, // Plant Matter x2
      },
      buyPrice: 3000,
      sellPrice: 1200,
      description: "A trough for storing and dispensing animal feed.",
    },

    irrigation_system: {
      name: "Irrigation System",
      category: "farm",
      image: "irrigation_system",
      width: 3,
      height: 1,
      wall: false,
      collision: [[1, 1, 1]],
      layer: "below",
      rotatable: true,
      recipe: {
        565: 4, // Steel Ingot x4
        569: 2, // Glass x2
        575: 3, // Plant Matter x3
      },
      buyPrice: 15000,
      sellPrice: 6000,
      description: "An automated system for irrigation.",
    },

    // === INDUSTRIAL ITEMS ===
    factory_furnace: {
      name: "Industrial Furnace",
      category: "industrial",
      image: "factory_furnace",
      width: 3,
      height: 3,
      wall: false,
      collision: [
        [1, 1, 1],
        [1, 1, 1],
        [1, 1, 1],
      ],
      layer: "same",
      rotatable: false,
      interactive: true,
      eventId: 0,
      recipe: {
        565: 8, // Steel Ingot x8
        566: 4, // Titanium Ingot x4
        569: 3, // Glass x3
      },
      buyPrice: 80000,
      sellPrice: 32000,
      description: "A high-temperature furnace for metal smelting.",
    },

    assembly_line: {
      name: "Assembly Line",
      category: "industrial",
      image: "assembly_line",
      width: 4,
      height: 2,
      wall: false,
      collision: [
        [1, 1, 1, 1],
        [1, 1, 1, 1],
      ],
      layer: "same",
      rotatable: true,
      interactive: true,
      eventId: 0,
      recipe: {
        565: 6, // Steel Ingot x6
        583: 4, // Microchip x4
        584: 3, // Battery Cell x3
        585: 4, // Plastic Polymer x4
      },
      buyPrice: 120000,
      sellPrice: 48000,
      description: "An automated assembly line for manufacturing.",
    },

    conveyor_belt: {
      name: "Conveyor Belt",
      category: "industrial",
      image: "conveyor_belt",
      width: 4,
      height: 1,
      wall: false,
      collision: [[1, 1, 1, 1]],
      layer: "below",
      rotatable: true,
      recipe: {
        565: 4, // Steel Ingot x4
        572: 2, // Cloth x2
        584: 2, // Battery Cell x2
      },
      buyPrice: 35000,
      sellPrice: 14000,
      description: "A motorized belt for transporting materials.",
    },

    industrial_crane: {
      name: "Industrial Crane",
      category: "industrial",
      image: "industrial_crane",
      width: 2,
      height: 4,
      wall: false,
      collision: [
        [1, 1],
        [1, 1],
        [1, 1],
        [1, 1],
      ],
      layer: "same",
      rotatable: true,
      interactive: true,
      eventId: 0,
      recipe: {
        566: 6, // Titanium Ingot x6
        565: 4, // Steel Ingot x4
        583: 3, // Microchip x3
        584: 2, // Battery Cell x2
      },
      buyPrice: 90000,
      sellPrice: 36000,
      description: "A heavy-duty crane for lifting loads.",
    },

    hydraulic_press: {
      name: "Hydraulic Press",
      category: "industrial",
      image: "hydraulic_press",
      width: 2,
      height: 3,
      wall: false,
      collision: [
        [1, 1],
        [1, 1],
        [1, 1],
      ],
      layer: "same",
      rotatable: false,
      interactive: true,
      eventId: 0,
      recipe: {
        565: 6, // Steel Ingot x6
        566: 3, // Titanium Ingot x3
        584: 2, // Battery Cell x2
      },
      buyPrice: 70000,
      sellPrice: 28000,
      description: "A high-pressure hydraulic press for shaping metal.",
    },

    storage_tank: {
      name: "Storage Tank",
      category: "industrial",
      image: "storage_tank",
      width: 2,
      height: 3,
      wall: false,
      collision: [
        [1, 1],
        [1, 1],
        [1, 1],
      ],
      layer: "same",
      rotatable: false,
      interactive: true,
      eventId: 0,
      recipe: {
        565: 5, // Steel Ingot x5
        569: 2, // Glass x2
        587: 2, // Nanotube Module x2
      },
      buyPrice: 50000,
      sellPrice: 20000,
      description: "A large tank for storing liquids and materials.",
    },

    refinery_tower: {
      name: "Refinery Tower",
      category: "industrial",
      image: "refinery_tower",
      width: 2,
      height: 4,
      wall: false,
      collision: [
        [1, 1],
        [1, 1],
        [1, 1],
        [1, 1],
      ],
      layer: "same",
      rotatable: false,
      interactive: true,
      eventId: 0,
      recipe: {
        565: 8, // Steel Ingot x8
        566: 4, // Titanium Ingot x4
        569: 3, // Glass x3
        587: 2, // Nanotube Module x2
      },
      buyPrice: 110000,
      sellPrice: 44000,
      description: "A distillation tower for refining materials.",
    },

    heavy_machinery: {
      name: "Heavy Machinery",
      category: "industrial",
      image: "heavy_machinery",
      width: 3,
      height: 2,
      wall: false,
      collision: [
        [1, 1, 1],
        [1, 1, 1],
      ],
      layer: "same",
      rotatable: true,
      interactive: true,
      eventId: 0,
      recipe: {
        566: 5, // Titanium Ingot x5
        565: 4, // Steel Ingot x4
        583: 2, // Microchip x2
        584: 2, // Battery Cell x2
      },
      buyPrice: 85000,
      sellPrice: 34000,
      description: "Complex heavy machinery for industrial processing.",
    },

    electric_generator: {
      name: "Electric Generator",
      category: "industrial",
      image: "electric_generator",
      width: 2,
      height: 2,
      wall: false,
      collision: [
        [1, 1],
        [1, 1],
      ],
      layer: "same",
      rotatable: false,
      interactive: true,
      eventId: 0,
      recipe: {
        565: 4, // Steel Ingot x4
        583: 3, // Microchip x3
        584: 3, // Battery Cell x3
        587: 2, // Nanotube Module x2
      },
      buyPrice: 60000,
      sellPrice: 24000,
      description: "A generator for producing electrical power.",
    },

    air_compressor: {
      name: "Air Compressor",
      category: "industrial",
      image: "air_compressor",
      width: 1,
      height: 2,
      wall: false,
      collision: [
        [1],
        [1],
      ],
      layer: "same",
      rotatable: false,
      interactive: true,
      eventId: 0,
      recipe: {
        565: 4, // Steel Ingot x4
        583: 2, // Microchip x2
        584: 2, // Battery Cell x2
        585: 2, // Plastic Polymer x2
      },
      buyPrice: 40000,
      sellPrice: 16000,
      description: "Compresses air for pneumatic systems.",
    },

    control_panel: {
      name: "Control Panel",
      category: "industrial",
      image: "control_panel",
      width: 1,
      height: 2,
      wall: false,
      collision: [[1], [1]],
      layer: "same",
      rotatable: true,
      interactive: true,
      eventId: 0,
      recipe: {
        565: 2, // Steel Ingot x2
        583: 4, // Microchip x4
        584: 2, // Battery Cell x2
        585: 3, // Plastic Polymer x3
      },
      buyPrice: 25000,
      sellPrice: 10000,
      description: "A control panel for managing machinery systems.",
    },

    safety_barrier: {
      name: "Safety Barrier",
      category: "industrial",
      image: "safety_barrier",
      width: 2,
      height: 1,
      wall: false,
      collision: [[1, 1]],
      layer: "same",
      rotatable: true,
      recipe: {
        565: 3, // Steel Ingot x3
        572: 1, // Cloth x1
      },
      buyPrice: 8000,
      sellPrice: 3200,
      description: "A protective barrier for hazardous areas.",
    },

    chemical_vat: {
      name: "Chemical Vat",
      category: "industrial",
      image: "chemical_vat",
      width: 2,
      height: 2,
      wall: false,
      collision: [
        [1, 1],
        [1, 1],
      ],
      layer: "same",
      rotatable: false,
      interactive: true,
      eventId: 0,
      recipe: {
        565: 3, // Steel Ingot x3
        569: 4, // Glass x4
        578: 4, // Acidic Solution x4
      },
      buyPrice: 45000,
      sellPrice: 18000,
      description: "A chemical processing vat for reactions.",
    },

    robotic_arm: {
      name: "Robotic Arm",
      category: "industrial",
      image: "robotic_arm",
      width: 2,
      height: 2,
      wall: false,
      collision: [
        [1, 1],
        [1, 1],
      ],
      layer: "same",
      rotatable: true,
      interactive: true,
      eventId: 0,
      recipe: {
        565: 5, // Steel Ingot x5
        566: 2, // Titanium Ingot x2
        583: 4, // Microchip x4
        584: 3, // Battery Cell x3
        587: 2, // Nanotube Module x2
      },
      buyPrice: 100000,
      sellPrice: 40000,
      description: "An automated robotic arm for precise tasks.",
    },

    welding_station: {
      name: "Welding Station",
      category: "industrial",
      image: "welding_station",
      width: 2,
      height: 2,
      wall: false,
      collision: [
        [1, 1],
        [1, 1],
      ],
      layer: "same",
      rotatable: true,
      interactive: true,
      eventId: 0,
      recipe: {
        565: 4, // Steel Ingot x4
        583: 2, // Microchip x2
        584: 2, // Battery Cell x2
        585: 1, // Plastic Polymer x1
      },
      buyPrice: 35000,
      sellPrice: 14000,
      description: "Equipment for welding metal structures.",
    },

    laser_cutter: {
      name: "Laser Cutter",
      category: "industrial",
      image: "laser_cutter",
      width: 2,
      height: 2,
      wall: false,
      collision: [
        [1, 1],
        [1, 1],
      ],
      layer: "same",
      rotatable: true,
      interactive: true,
      eventId: 0,
      recipe: {
        565: 3, // Steel Ingot x3
        583: 5, // Microchip x5
        584: 3, // Battery Cell x3
        580: 2, // Ethereal Shard x2
      },
      buyPrice: 75000,
      sellPrice: 30000,
      description: "A precision laser cutter for detailed work.",
    },

    "3d_printer": {
      name: "3D Printer",
      category: "industrial",
      image: "3d_printer",
      width: 2,
      height: 2,
      wall: false,
      collision: [
        [1, 1],
        [1, 1],
      ],
      layer: "same",
      rotatable: true,
      interactive: true,
      eventId: 0,
      recipe: {
        565: 3, // Steel Ingot x3
        583: 4, // Microchip x4
        584: 3, // Battery Cell x3
        585: 4, // Plastic Polymer x4
        587: 2, // Nanotube Module x2
      },
      buyPrice: 95000,
      sellPrice: 38000,
      description: "A 3D printer for manufacturing objects.",
    },

    industrial_oven: {
      name: "Industrial Oven",
      category: "industrial",
      image: "industrial_oven",
      width: 2,
      height: 2,
      wall: false,
      collision: [
        [1, 1],
        [1, 1],
      ],
      layer: "same",
      rotatable: false,
      interactive: true,
      eventId: 0,
      recipe: {
        565: 5, // Steel Ingot x5
        569: 2, // Glass x2
        584: 2, // Battery Cell x2
      },
      buyPrice: 50000,
      sellPrice: 20000,
      description: "A large industrial oven for heat treatment.",
    },

    sorting_machine: {
      name: "Sorting Machine",
      category: "industrial",
      image: "sorting_machine",
      width: 3,
      height: 2,
      wall: false,
      collision: [
        [1, 1, 1],
        [1, 1, 1],
      ],
      layer: "same",
      rotatable: true,
      interactive: true,
      eventId: 0,
      recipe: {
        565: 4, // Steel Ingot x4
        583: 4, // Microchip x4
        584: 2, // Battery Cell x2
        585: 3, // Plastic Polymer x3
      },
      buyPrice: 55000,
      sellPrice: 22000,
      description: "Automatically sorts and categorizes materials.",
    },

    vacuum_chamber: {
      name: "Vacuum Chamber",
      category: "industrial",
      image: "vacuum_chamber",
      width: 2,
      height: 3,
      wall: false,
      collision: [
        [1, 1],
        [1, 1],
        [1, 1],
      ],
      layer: "same",
      rotatable: false,
      interactive: true,
      eventId: 0,
      recipe: {
        565: 5, // Steel Ingot x5
        569: 3, // Glass x3
        583: 2, // Microchip x2
        584: 2, // Battery Cell x2
      },
      buyPrice: 65000,
      sellPrice: 26000,
      description: "A chamber for vacuum processing.",
    },

    packaging_unit: {
      name: "Packaging Unit",
      category: "industrial",
      image: "packaging_unit",
      width: 2,
      height: 2,
      wall: false,
      collision: [
        [1, 1],
        [1, 1],
      ],
      layer: "same",
      rotatable: true,
      interactive: true,
      eventId: 0,
      recipe: {
        565: 2, // Steel Ingot x2
        583: 3, // Microchip x3
        584: 2, // Battery Cell x2
        585: 3, // Plastic Polymer x3
      },
      buyPrice: 30000,
      sellPrice: 12000,
      description: "Automated equipment for packaging products.",
    },

    quality_scanner: {
      name: "Quality Scanner",
      category: "industrial",
      image: "quality_scanner",
      width: 1,
      height: 2,
      wall: false,
      collision: [[1], [1]],
      layer: "same",
      rotatable: true,
      interactive: true,
      eventId: 0,
      recipe: {
        565: 2, // Steel Ingot x2
        569: 2, // Glass x2
        583: 3, // Microchip x3
        584: 1, // Battery Cell x1
      },
      buyPrice: 22000,
      sellPrice: 8800,
      description: "Inspects products for quality control.",
    },

    industrial_duct: {
      name: "Industrial Duct",
      category: "industrial",
      image: "industrial_duct",
      width: 1,
      height: 3,
      wall: false,
      collision: [[1], [1], [1]],
      layer: "above",
      rotatable: true,
      recipe: {
        565: 3, // Steel Ingot x3
        585: 2, // Plastic Polymer x2
      },
      buyPrice: 12000,
      sellPrice: 4800,
      description: "Ductwork for air and material flow.",
    },

    power_distribution: {
      name: "Power Distribution Box",
      category: "industrial",
      image: "power_distribution",
      width: 1,
      height: 2,
      wall: false,
      collision: [[1], [1]],
      layer: "same",
      rotatable: false,
      interactive: true,
      eventId: 0,
      recipe: {
        565: 2, // Steel Ingot x2
        583: 3, // Microchip x3
        584: 4, // Battery Cell x4
        585: 2, // Plastic Polymer x2
      },
      buyPrice: 28000,
      sellPrice: 11200,
      description: "Distributes electrical power to equipment.",
    },

    // === CAMPING ITEMS ===
    tent: {
      name: "Tent",
      category: "camping",
      image: "tent",
      width: 2,
      height: 2,
      wall: false,
      collision: [
        [1, 1],
        [1, 1],
      ],
      layer: "same",
      rotatable: true,
      interactive: true,
      eventId: 0,
      recipe: {
        572: 6, // Cloth x6
        570: 4, // Wood x4
        571: 2, // Leather x2
      },
      buyPrice: 8000,
      sellPrice: 3200,
      description: "A portable tent for camping overnight.",
    },

    campfire: {
      name: "Campfire",
      category: "camping",
      image: "campfire",
      width: 1,
      height: 1,
      wall: false,
      collision: [[1]],
      layer: "same",
      rotatable: false,
      interactive: true,
      eventId: 0,
      recipe: {
        575: 4, // Plant Matter x4
        570: 2, // Wood x2
      },
      buyPrice: 2000,
      sellPrice: 800,
      description: "A cozy campfire for warmth and cooking.",
    },

    sleeping_bag: {
      name: "Sleeping Bag",
      category: "camping",
      image: "sleeping_bag",
      width: 1,
      height: 2,
      wall: false,
      collision: [[1], [1]],
      layer: "same",
      rotatable: true,
      interactive: true,
      eventId: 0,
      recipe: {
        572: 4, // Cloth x4
        575: 3, // Plant Matter x3
      },
      buyPrice: 4000,
      sellPrice: 1600,
      description: "A comfortable sleeping bag for rest.",
    },

    camping_lantern: {
      name: "Camping Lantern",
      category: "camping",
      image: "camping_lantern",
      width: 1,
      height: 1,
      wall: false,
      collision: [[1]],
      layer: "same",
      rotatable: false,
      interactive: true,
      eventId: 0,
      recipe: {
        570: 1, // Wood x1
        569: 2, // Glass x2
        577: 1, // Oil Flask x1
      },
      buyPrice: 3000,
      sellPrice: 1200,
      description: "A lantern for outdoor lighting.",
    },

    camping_stove: {
      name: "Camping Stove",
      category: "camping",
      image: "camping_stove",
      width: 1,
      height: 1,
      wall: false,
      collision: [[1]],
      layer: "same",
      rotatable: false,
      interactive: true,
      eventId: 0,
      recipe: {
        565: 2, // Steel Ingot x2
        577: 2, // Oil Flask x2
      },
      buyPrice: 5000,
      sellPrice: 2000,
      description: "A portable camping stove for cooking.",
    },

    camping_chair: {
      name: "Camping Chair",
      category: "camping",
      image: "camping_chair",
      width: 1,
      height: 1,
      wall: false,
      collision: [[1]],
      layer: "same",
      rotatable: true,
      recipe: {
        570: 3, // Wood x3
        572: 2, // Cloth x2
      },
      buyPrice: 2500,
      sellPrice: 1000,
      description: "A lightweight camping chair.",
    },

    cooler: {
      name: "Cooler",
      category: "camping",
      image: "cooler",
      width: 1,
      height: 1,
      wall: false,
      collision: [[1]],
      layer: "same",
      rotatable: false,
      interactive: true,
      eventId: 0,
      recipe: {
        570: 2, // Wood x2
        585: 3, // Plastic Polymer x3
        575: 1, // Plant Matter x1
      },
      buyPrice: 6000,
      sellPrice: 2400,
      description: "An insulated cooler for storing food.",
    },

    picnic_table: {
      name: "Picnic Table",
      category: "camping",
      image: "picnic_table",
      width: 2,
      height: 2,
      wall: false,
      collision: [
        [1, 1],
        [1, 1],
      ],
      layer: "same",
      rotatable: true,
      recipe: {
        570: 5, // Wood x5
        565: 2, // Steel Ingot x2
      },
      buyPrice: 7000,
      sellPrice: 2800,
      description: "A sturdy table for outdoor dining.",
    },

    camping_backpack: {
      name: "Camping Backpack",
      category: "camping",
      image: "camping_backpack",
      width: 1,
      height: 1,
      wall: false,
      collision: [[0]],
      layer: "above",
      rotatable: false,
      recipe: {
        572: 3, // Cloth x3
        571: 2, // Leather x2
      },
      buyPrice: 5500,
      sellPrice: 2200,
      description: "A large backpack for carrying gear.",
    },

    water_container: {
      name: "Water Container",
      category: "camping",
      image: "water_container",
      width: 1,
      height: 1,
      wall: false,
      collision: [[1]],
      layer: "same",
      rotatable: false,
      recipe: {
        585: 2, // Plastic Polymer x2
        569: 1, // Glass x1
      },
      buyPrice: 2000,
      sellPrice: 800,
      description: "A container for carrying water.",
    },

    bedroll: {
      name: "Bedroll",
      category: "camping",
      image: "bedroll",
      width: 1,
      height: 2,
      wall: false,
      collision: [[1], [1]],
      layer: "same",
      rotatable: true,
      interactive: true,
      eventId: 0,
      recipe: {
        572: 3, // Cloth x3
        575: 2, // Plant Matter x2
      },
      buyPrice: 3500,
      sellPrice: 1400,
      description: "A rolled-up bedding for camping.",
    },

    hammock: {
      name: "Hammock",
      category: "camping",
      image: "hammock",
      width: 2,
      height: 1,
      wall: false,
      collision: [[1, 1]],
      layer: "above",
      rotatable: true,
      interactive: true,
      eventId: 0,
      recipe: {
        572: 4, // Cloth x4
        571: 1, // Leather x1
      },
      buyPrice: 6500,
      sellPrice: 2600,
      description: "A relaxing hammock for resting.",
    },

    tent_cabin: {
      name: "Tent Cabin",
      category: "camping",
      image: "tent_cabin",
      width: 3,
      height: 3,
      wall: false,
      collision: [
        [1, 1, 1],
        [1, 1, 1],
        [1, 1, 1],
      ],
      layer: "same",
      rotatable: true,
      interactive: true,
      eventId: 0,
      recipe: {
        572: 10, // Cloth x10
        570: 8, // Wood x8
        571: 4, // Leather x4
      },
      buyPrice: 20000,
      sellPrice: 8000,
      description: "A large tent with cabin-like structure.",
    },

    camping_rope: {
      name: "Camping Rope",
      category: "camping",
      image: "camping_rope",
      width: 1,
      height: 1,
      wall: false,
      collision: [[1]],
      layer: "above",
      rotatable: true,
      recipe: {
        572: 3, // Cloth x3
      },
      buyPrice: 1500,
      sellPrice: 600,
      description: "Rope for securing tents and gear.",
    },

    campsite_marker: {
      name: "Campsite Marker",
      category: "camping",
      image: "campsite_marker",
      width: 1,
      height: 1,
      wall: false,
      collision: [[1]],
      layer: "same",
      rotatable: true,
      recipe: {
        570: 2, // Wood x2
      },
      buyPrice: 1000,
      sellPrice: 400,
      description: "A marker flag for the campsite.",
    },

    food_storage: {
      name: "Food Storage Box",
      category: "camping",
      image: "food_storage",
      width: 1,
      height: 1,
      wall: false,
      collision: [[1]],
      layer: "same",
      rotatable: false,
      interactive: true,
      eventId: 0,
      recipe: {
        570: 3, // Wood x3
        565: 1, // Steel Ingot x1
      },
      buyPrice: 4000,
      sellPrice: 1600,
      description: "A secure box for storing food supplies.",
    },

    camping_tent_dome: {
      name: "Dome Tent",
      category: "camping",
      image: "camping_tent_dome",
      width: 2,
      height: 2,
      wall: false,
      collision: [
        [1, 1],
        [1, 1],
      ],
      layer: "same",
      rotatable: false,
      interactive: true,
      eventId: 0,
      recipe: {
        572: 5, // Cloth x5
        570: 3, // Wood x3
        571: 1, // Leather x1
      },
      buyPrice: 7000,
      sellPrice: 2800,
      description: "A durable dome-shaped tent.",
    },

    camping_cot: {
      name: "Camping Cot",
      category: "camping",
      image: "camping_cot",
      width: 1,
      height: 2,
      wall: false,
      collision: [[1], [1]],
      layer: "same",
      rotatable: true,
      interactive: true,
      eventId: 0,
      recipe: {
        570: 2, // Wood x2
        572: 2, // Cloth x2
      },
      buyPrice: 4500,
      sellPrice: 1800,
      description: "An elevated cot for sleeping off the ground.",
    },

    camping_grill: {
      name: "Camping Grill",
      category: "camping",
      image: "camping_grill",
      width: 1,
      height: 1,
      wall: false,
      collision: [[1]],
      layer: "same",
      rotatable: true,
      interactive: true,
      eventId: 0,
      recipe: {
        565: 3, // Steel Ingot x3
        570: 1, // Wood x1
      },
      buyPrice: 5500,
      sellPrice: 2200,
      description: "A portable grill for cooking.",
    },

    camping_lantern_led: {
      name: "LED Camping Lantern",
      category: "camping",
      image: "camping_lantern_led",
      width: 1,
      height: 1,
      wall: false,
      collision: [[1]],
      layer: "same",
      rotatable: false,
      interactive: true,
      eventId: 0,
      recipe: {
        585: 2, // Plastic Polymer x2
        584: 2, // Battery Cell x2
        583: 1, // Microchip x1
      },
      buyPrice: 8000,
      sellPrice: 3200,
      description: "A modern LED lantern with battery power.",
    },

    camping_shelter: {
      name: "Pop-up Shelter",
      category: "camping",
      image: "camping_shelter",
      width: 2,
      height: 2,
      wall: false,
      collision: [
        [1, 1],
        [1, 1],
      ],
      layer: "same",
      rotatable: true,
      interactive: true,
      eventId: 0,
      recipe: {
        572: 4, // Cloth x4
        570: 2, // Wood x2
        585: 2, // Plastic Polymer x2
      },
      buyPrice: 6000,
      sellPrice: 2400,
      description: "A quick pop-up shelter for protection.",
    },

    // === SUPERMARKET ITEMS ===
    shopping_cart: {
      name: "Shopping Cart",
      category: "supermarket",
      image: "shopping_cart",
      width: 2,
      height: 2,
      wall: false,
      collision: [[1,1],[0,0]],
      layer: "same",
      rotatable: true,
      recipe: {
        565: 3, // Steel Ingot x3
        585: 2, // Plastic Polymer x2
      },
      buyPrice: 5000,
      sellPrice: 2000,
      description: "A metal shopping cart for customers.",
    },

    shopping_basket: {
      name: "Shopping Basket",
      category: "supermarket",
      image: "shopping_basket",
      width: 1,
      height: 1,
      wall: false,
      collision: [[0]],
      layer: "above",
      rotatable: false,
      recipe: {
        565: 1, // Steel Ingot x1
        585: 1, // Plastic Polymer x1
      },
      buyPrice: 2000,
      sellPrice: 800,
      description: "A hand-held shopping basket.",
    },

    checkout_counter: {
      name: "Checkout Counter",
      category: "supermarket",
      image: "checkout_counter",
      width: 3,
      height: 1,
      wall: false,
      collision: [[1, 1, 1]],
      layer: "same",
      rotatable: true,
      interactive: true,
      eventId: 0,
      recipe: {
        570: 5, // Wood x5
        565: 3, // Steel Ingot x3
        569: 2, // Glass x2
      },
      buyPrice: 15000,
      sellPrice: 6000,
      description: "A counter for processing customer purchases.",
    },

    cash_register: {
      name: "Cash Register",
      category: "supermarket",
      image: "cash_register",
      width: 1,
      height: 1,
      wall: false,
      collision: [[1]],
      layer: "same",
      rotatable: false,
      interactive: true,
      eventId: 0,
      recipe: {
        565: 2, // Steel Ingot x2
        583: 3, // Microchip x3
        584: 2, // Battery Cell x2
        585: 1, // Plastic Polymer x1
      },
      buyPrice: 8000,
      sellPrice: 3200,
      description: "A register for processing transactions.",
    },

    display_shelf: {
      name: "Display Shelf",
      category: "supermarket",
      image: "display_shelf",
      width: 2,
      height: 3,
      wall: false,
      collision: [
        [1, 1],
        [1, 1],
        [1, 1],
      ],
      layer: "same",
      rotatable: true,
      recipe: {
        570: 4, // Wood x4
        565: 2, // Steel Ingot x2
        569: 1, // Glass x1
      },
      buyPrice: 10000,
      sellPrice: 4000,
      description: "A shelf for displaying products.",
    },

    refrigerated_display: {
      name: "Refrigerated Display Case",
      category: "supermarket",
      image: "refrigerated_display",
      width: 2,
      height: 2,
      wall: false,
      collision: [
        [1, 1],
        [1, 1],
      ],
      layer: "same",
      rotatable: true,
      interactive: true,
      eventId: 0,
      recipe: {
        565: 4, // Steel Ingot x4
        569: 3, // Glass x3
        584: 2, // Battery Cell x2
        583: 1, // Microchip x1
      },
      buyPrice: 20000,
      sellPrice: 8000,
      description: "A refrigerated case for perishable items.",
    },

    freezer_unit: {
      name: "Freezer Unit",
      category: "supermarket",
      image: "freezer_unit",
      width: 2,
      height: 2,
      wall: false,
      collision: [
        [1, 1],
        [1, 1],
      ],
      layer: "same",
      rotatable: true,
      interactive: true,
      eventId: 0,
      recipe: {
        565: 4, // Steel Ingot x4
        569: 2, // Glass x2
        584: 3, // Battery Cell x3
        583: 2, // Microchip x2
      },
      buyPrice: 25000,
      sellPrice: 10000,
      description: "A commercial freezer for frozen items.",
    },

    product_display_stand: {
      name: "Product Display Stand",
      category: "supermarket",
      image: "product_display_stand",
      width: 1,
      height: 2,
      wall: false,
      collision: [[1], [1]],
      layer: "same",
      rotatable: true,
      recipe: {
        570: 2, // Wood x2
        565: 1, // Steel Ingot x1
        569: 1, // Glass x1
      },
      buyPrice: 4000,
      sellPrice: 1600,
      description: "A stand for displaying promotional items.",
    },

    price_sign: {
      name: "Price Sign",
      category: "supermarket",
      image: "price_sign",
      width: 1,
      height: 1,
      wall: false,
      collision: [[1]],
      layer: "above",
      rotatable: true,
      recipe: {
        570: 1, // Wood x1
        569: 1, // Glass x1
      },
      buyPrice: 1500,
      sellPrice: 600,
      description: "A sign for displaying product prices.",
    },

    shopping_aisle: {
      name: "Shopping Aisle",
      category: "supermarket",
      image: "shopping_aisle",
      width: 4,
      height: 1,
      wall: false,
      collision: [[1, 1, 1, 1]],
      layer: "below",
      rotatable: true,
      recipe: {
        570: 4, // Wood x4
        565: 2, // Steel Ingot x2
        575: 1, // Plant Matter x1
      },
      buyPrice: 8000,
      sellPrice: 3200,
      description: "An aisle marker in the supermarket.",
    },

    automatic_door: {
      name: "Automatic Door",
      category: "supermarket",
      image: "automatic_door",
      width: 1,
      height: 2,
      wall: false,
      collision: [[1], [1]],
      layer: "same",
      rotatable: true,
      interactive: true,
      eventId: 0,
      recipe: {
        565: 2, // Steel Ingot x2
        569: 2, // Glass x2
        583: 1, // Microchip x1
        584: 1, // Battery Cell x1
      },
      buyPrice: 12000,
      sellPrice: 4800,
      description: "An automatic sliding door entrance.",
    },

    customer_service_desk: {
      name: "Customer Service Desk",
      category: "supermarket",
      image: "customer_service_desk",
      width: 2,
      height: 1,
      wall: false,
      collision: [[1, 1]],
      layer: "same",
      rotatable: true,
      interactive: true,
      eventId: 0,
      recipe: {
        570: 3, // Wood x3
        565: 2, // Steel Ingot x2
        569: 1, // Glass x1
      },
      buyPrice: 6000,
      sellPrice: 2400,
      description: "A desk for customer inquiries and service.",
    },

    mannequin_display: {
      name: "Mannequin Display",
      category: "supermarket",
      image: "mannequin_display",
      width: 1,
      height: 2,
      wall: false,
      collision: [[1], [1]],
      layer: "same",
      rotatable: true,
      recipe: {
        570: 2, // Wood x2
        585: 3, // Plastic Polymer x3
        572: 1, // Cloth x1
      },
      buyPrice: 5000,
      sellPrice: 2000,
      description: "A mannequin for displaying clothing.",
    },

    department_sign: {
      name: "Department Sign",
      category: "supermarket",
      image: "department_sign",
      width: 2,
      height: 1,
      wall: false,
      collision: [[1, 1]],
      layer: "above",
      rotatable: true,
      recipe: {
        570: 2, // Wood x2
        569: 1, // Glass x1
      },
      buyPrice: 3000,
      sellPrice: 1200,
      description: "A sign marking different departments.",
    },

    stocking_shelf: {
      name: "Stocking Shelf",
      category: "supermarket",
      image: "stocking_shelf",
      width: 2,
      height: 2,
      wall: false,
      collision: [
        [1, 1],
        [1, 1],
      ],
      layer: "same",
      rotatable: true,
      recipe: {
        570: 3, // Wood x3
        565: 2, // Steel Ingot x2
      },
      buyPrice: 7000,
      sellPrice: 2800,
      description: "A shelf for storing inventory.",
    },

    security_gate: {
      name: "Security Gate",
      category: "supermarket",
      image: "security_gate",
      width: 2,
      height: 2,
      wall: false,
      collision: [
        [1, 1],
        [1, 1],
      ],
      layer: "same",
      rotatable: true,
      interactive: true,
      eventId: 0,
      recipe: {
        565: 4, // Steel Ingot x4
        583: 2, // Microchip x2
        584: 1, // Battery Cell x1
      },
      buyPrice: 18000,
      sellPrice: 7200,
      description: "A security gate at the store entrance.",
    },

    produce_stand: {
      name: "Produce Stand",
      category: "supermarket",
      image: "produce_stand",
      width: 2,
      height: 2,
      wall: false,
      collision: [
        [1, 1],
        [1, 1],
      ],
      layer: "same",
      rotatable: true,
      recipe: {
        570: 3, // Wood x3
        565: 1, // Steel Ingot x1
        575: 2, // Plant Matter x2
      },
      buyPrice: 5500,
      sellPrice: 2200,
      description: "A stand for displaying fresh produce.",
    },

    deli_counter: {
      name: "Deli Counter",
      category: "supermarket",
      image: "deli_counter",
      width: 2,
      height: 1,
      wall: false,
      collision: [[1, 1]],
      layer: "same",
      rotatable: true,
      interactive: true,
      eventId: 0,
      recipe: {
        570: 3, // Wood x3
        565: 3, // Steel Ingot x3
        569: 2, // Glass x2
        572: 1, // Cloth x1
      },
      buyPrice: 11000,
      sellPrice: 4400,
      description: "A counter for deli and prepared foods.",
    },

    bakery_display: {
      name: "Bakery Display Case",
      category: "supermarket",
      image: "bakery_display",
      width: 2,
      height: 2,
      wall: false,
      collision: [
        [1, 1],
        [1, 1],
      ],
      layer: "same",
      rotatable: true,
      interactive: true,
      eventId: 0,
      recipe: {
        570: 2, // Wood x2
        569: 3, // Glass x3
        565: 2, // Steel Ingot x2
        572: 1, // Cloth x1
      },
      buyPrice: 10000,
      sellPrice: 4000,
      description: "A display case for baked goods.",
    },

    conveyor_checkout: {
      name: "Conveyor Checkout Belt",
      category: "supermarket",
      image: "conveyor_checkout",
      width: 3,
      height: 1,
      wall: false,
      collision: [[1, 1, 1]],
      layer: "below",
      rotatable: true,
      interactive: true,
      eventId: 0,
      recipe: {
        565: 4, // Steel Ingot x4
        572: 1, // Cloth x1
        584: 1, // Battery Cell x1
      },
      buyPrice: 12000,
      sellPrice: 4800,
      description: "A motorized conveyor belt for checkout.",
    },

    store_directory: {
      name: "Store Directory",
      category: "supermarket",
      image: "store_directory",
      width: 1,
      height: 2,
      wall: false,
      collision: [[1], [1]],
      layer: "same",
      rotatable: false,
      interactive: true,
      eventId: 0,
      recipe: {
        570: 2, // Wood x2
        569: 2, // Glass x2
        565: 1, // Steel Ingot x1
      },
      buyPrice: 4000,
      sellPrice: 1600,
      description: "A directory showing store layout.",
    },

    lighting_fixture: {
      name: "Store Lighting Fixture",
      category: "supermarket",
      image: "lighting_fixture",
      width: 1,
      height: 1,
      wall: false,
      collision: [[0]],
      layer: "above",
      rotatable: false,
      recipe: {
        565: 1, // Steel Ingot x1
        583: 1, // Microchip x1
        584: 1, // Battery Cell x1
      },
      buyPrice: 3000,
      sellPrice: 1200,
      description: "Overhead lighting for the store.",
    },

    // === DUNGEON ITEMS ===
    dungeon_torch: {
      name: "Dungeon Torch",
      category: "dungeon",
      image: "dungeon_torch",
      width: 1,
      height: 1,
      wall: false,
      collision: [[1]],
      layer: "same",
      rotatable: true,
      recipe: {
        570: 2, // Wood x2
        577: 2, // Oil Flask x2
      },
      buyPrice: 3000,
      sellPrice: 1200,
      description: "A torch for lighting dark dungeons.",
    },

    stone_pillar: {
      name: "Stone Pillar",
      category: "dungeon",
      image: "stone_pillar",
      width: 1,
      height: 3,
      wall: false,
      collision: [[1], [1], [1]],
      layer: "same",
      rotatable: false,
      recipe: {
        566: 4, // Titanium Ingot x4
        573: 3, // Bone x3
      },
      buyPrice: 8000,
      sellPrice: 3200,
      description: "A tall stone pillar for structural support.",
    },

    iron_bars: {
      name: "Iron Bars",
      category: "dungeon",
      image: "iron_bars",
      width: 1,
      height: 2,
      wall: false,
      collision: [[1], [1]],
      layer: "same",
      rotatable: true,
      recipe: {
        565: 4, // Steel Ingot x4
      },
      buyPrice: 5000,
      sellPrice: 2000,
      description: "Iron bars for prison cells and cages.",
    },

    wooden_door: {
      name: "Wooden Door",
      category: "dungeon",
      image: "wooden_door",
      width: 1,
      height: 2,
      wall: false,
      collision: [[1], [1]],
      layer: "same",
      rotatable: true,
      interactive: true,
      eventId: 0,
      recipe: {
        570: 4, // Wood x4
        565: 2, // Steel Ingot x2
      },
      buyPrice: 6000,
      sellPrice: 2400,
      description: "A reinforced wooden dungeon door.",
    },

    iron_door: {
      name: "Iron Door",
      category: "dungeon",
      image: "iron_door",
      width: 1,
      height: 2,
      wall: false,
      collision: [[1], [1]],
      layer: "same",
      rotatable: true,
      interactive: true,
      eventId: 0,
      recipe: {
        565: 6, // Steel Ingot x6
        566: 2, // Titanium Ingot x2
      },
      buyPrice: 12000,
      sellPrice: 4800,
      description: "A heavy iron dungeon door.",
    },

    prison_cell: {
      name: "Prison Cell",
      category: "dungeon",
      image: "prison_cell",
      width: 2,
      height: 2,
      wall: false,
      collision: [
        [1, 1],
        [1, 1],
      ],
      layer: "same",
      rotatable: false,
      interactive: true,
      eventId: 0,
      recipe: {
        565: 6, // Steel Ingot x6
        570: 3, // Wood x3
        572: 2, // Cloth x2
      },
      buyPrice: 15000,
      sellPrice: 6000,
      description: "A cell for imprisoning captives.",
    },

    torture_rack: {
      name: "Torture Rack",
      category: "dungeon",
      image: "torture_rack",
      width: 2,
      height: 2,
      wall: false,
      collision: [
        [1, 1],
        [1, 1],
      ],
      layer: "same",
      rotatable: true,
      interactive: true,
      eventId: 0,
      recipe: {
        570: 4, // Wood x4
        565: 4, // Steel Ingot x4
        571: 2, // Leather x2
      },
      buyPrice: 18000,
      sellPrice: 7200,
      description: "A medieval torture device.",
    },

    iron_chain: {
      name: "Iron Chain",
      category: "dungeon",
      image: "iron_chain",
      width: 2,
      height: 1,
      wall: false,
      collision: [[1, 1]],
      layer: "above",
      rotatable: true,
      recipe: {
        565: 3, // Steel Ingot x3
      },
      buyPrice: 4000,
      sellPrice: 1600,
      description: "Heavy chains for binding prisoners.",
    },

    skull_pile: {
      name: "Skull Pile",
      category: "dungeon",
      image: "skull_pile",
      width: 1,
      height: 1,
      wall: false,
      collision: [[1]],
      layer: "same",
      rotatable: false,
      recipe: {
        573: 6, // Bone x6
      },
      buyPrice: 3000,
      sellPrice: 1200,
      description: "A pile of skulls.",
    },

    bone_altar: {
      name: "Bone Altar",
      category: "dungeon",
      image: "bone_altar",
      width: 2,
      height: 2,
      wall: false,
      collision: [
        [1, 1],
        [1, 1],
      ],
      layer: "same",
      rotatable: false,
      interactive: true,
      eventId: 0,
      recipe: {
        573: 8, // Bone x8
        565: 3, // Steel Ingot x3
        580: 2, // Ethereal Shard x2
      },
      buyPrice: 20000,
      sellPrice: 8000,
      description: "An altar made of bones for dark rituals.",
    },

    spikes: {
      name: "Spike Trap",
      category: "dungeon",
      image: "spikes",
      width: 1,
      height: 1,
      wall: false,
      collision: [[1]],
      layer: "same",
      rotatable: false,
      recipe: {
        565: 3, // Steel Ingot x3
        573: 1, // Bone x1
      },
      buyPrice: 4000,
      sellPrice: 1600,
      description: "Spikes as a trap or decoration.",
    },

    stone_grate: {
      name: "Stone Grate",
      category: "dungeon",
      image: "stone_grate",
      width: 2,
      height: 1,
      wall: false,
      collision: [[1, 1]],
      layer: "below",
      rotatable: true,
      recipe: {
        566: 3, // Titanium Ingot x3
        570: 1, // Wood x1
      },
      buyPrice: 5500,
      sellPrice: 2200,
      description: "A stone grate for floor drainage.",
    },

    stone_statue: {
      name: "Stone Statue",
      category: "dungeon",
      image: "stone_statue",
      width: 1,
      height: 2,
      wall: false,
      collision: [[1], [1]],
      layer: "same",
      rotatable: true,
      recipe: {
        566: 5, // Titanium Ingot x5
        573: 2, // Bone x2
      },
      buyPrice: 10000,
      sellPrice: 4000,
      description: "An eerie stone statue.",
    },

    dark_altar: {
      name: "Dark Altar",
      category: "dungeon",
      image: "dark_altar",
      width: 2,
      height: 2,
      wall: false,
      collision: [
        [1, 1],
        [1, 1],
      ],
      layer: "same",
      rotatable: false,
      interactive: true,
      eventId: 0,
      recipe: {
        566: 6, // Titanium Ingot x6
        580: 4, // Ethereal Shard x4
        579: 3, // Arcane Essence x3
      },
      buyPrice: 35000,
      sellPrice: 14000,
      description: "A dark altar for arcane rituals.",
    },

    treasure_chest: {
      name: "Treasure Chest",
      category: "dungeon",
      image: "treasure_chest",
      width: 1,
      height: 1,
      wall: false,
      collision: [[1]],
      layer: "same",
      rotatable: true,
      interactive: true,
      eventId: 0,
      recipe: {
        570: 4, // Wood x4
        565: 3, // Steel Ingot x3
        571: 2, // Leather x2
      },
      buyPrice: 8000,
      sellPrice: 3200,
      description: "A treasure chest for storing valuables.",
    },

    barrel: {
      name: "Dungeon Barrel",
      category: "dungeon",
      image: "barrel",
      width: 1,
      height: 1,
      wall: false,
      collision: [[1]],
      layer: "same",
      rotatable: false,
      recipe: {
        570: 3, // Wood x3
        565: 1, // Steel Ingot x1
      },
      buyPrice: 2500,
      sellPrice: 1000,
      description: "A barrel for storing supplies.",
    },

    stone_coffin: {
      name: "Stone Coffin",
      category: "dungeon",
      image: "stone_coffin",
      width: 2,
      height: 1,
      wall: false,
      collision: [[1, 1]],
      layer: "same",
      rotatable: true,
      interactive: true,
      eventId: 0,
      recipe: {
        566: 5, // Titanium Ingot x5
        573: 3, // Bone x3
        580: 2, // Ethereal Shard x2
      },
      buyPrice: 12000,
      sellPrice: 4800,
      description: "A stone coffin containing remains.",
    },

    dungeon_chest: {
      name: "Dungeon Chest",
      category: "dungeon",
      image: "dungeon_chest",
      width: 1,
      height: 1,
      wall: false,
      collision: [[1]],
      layer: "same",
      rotatable: false,
      interactive: true,
      eventId: 0,
      recipe: {
        570: 2, // Wood x2
        565: 2, // Steel Ingot x2
        571: 1, // Leather x1
      },
      buyPrice: 5000,
      sellPrice: 2000,
      description: "A chest locked in the dungeon.",
    },

    stone_wall: {
      name: "Stone Wall",
      category: "dungeon",
      image: "stone_wall",
      width: 2,
      height: 2,
      wall: false,
      collision: [
        [1, 1],
        [1, 1],
      ],
      layer: "same",
      rotatable: true,
      recipe: {
        566: 6, // Titanium Ingot x6
        573: 2, // Bone x2
      },
      buyPrice: 10000,
      sellPrice: 4000,
      description: "A solid stone wall.",
    },

    hanging_chains: {
      name: "Hanging Chains",
      category: "dungeon",
      image: "hanging_chains",
      width: 1,
      height: 3,
      wall: false,
      collision: [[1], [1], [1]],
      layer: "above",
      rotatable: true,
      recipe: {
        565: 4, // Steel Ingot x4
        573: 1, // Bone x1
      },
      buyPrice: 6000,
      sellPrice: 2400,
      description: "Heavy chains hanging from the ceiling.",
    },

    sword_rack: {
      name: "Sword Rack",
      category: "dungeon",
      image: "sword_rack",
      width: 1,
      height: 2,
      wall: false,
      collision: [[1], [1]],
      layer: "same",
      rotatable: true,
      recipe: {
        570: 2, // Wood x2
        565: 2, // Steel Ingot x2
      },
      buyPrice: 4500,
      sellPrice: 1800,
      description: "A rack for displaying weapons.",
    },

    shield_wall: {
      name: "Shield Wall",
      category: "dungeon",
      image: "shield_wall",
      width: 2,
      height: 2,
      wall: false,
      collision: [
        [1, 1],
        [1, 1],
      ],
      layer: "same",
      rotatable: true,
      recipe: {
        565: 5, // Steel Ingot x5
        570: 2, // Wood x2
      },
      buyPrice: 9000,
      sellPrice: 3600,
      description: "A wall displaying shields.",
    },

    dungeon_banner: {
      name: "Dungeon Banner",
      category: "dungeon",
      image: "dungeon_banner",
      width: 1,
      height: 2,
      wall: false,
      collision: [[1], [1]],
      layer: "above",
      rotatable: true,
      recipe: {
        572: 3, // Cloth x3
        565: 1, // Steel Ingot x1
      },
      buyPrice: 3500,
      sellPrice: 1400,
      description: "A dark banner for dungeon decoration.",
    },

    // === GYM ITEMS ===
    treadmill: {
      name: "Treadmill",
      category: "gym",
      image: "treadmill",
      width: 2,
      height: 1,
      wall: false,
      collision: [[1, 1]],
      layer: "same",
      rotatable: true,
      interactive: true,
      eventId: 0,
      recipe: {
        565: 5, // Steel Ingot x5
        583: 3, // Microchip x3
        584: 2, // Battery Cell x2
        585: 2, // Plastic Polymer x2
      },
      buyPrice: 25000,
      sellPrice: 10000,
      description: "An electric treadmill for cardio training.",
    },

    weight_bench: {
      name: "Weight Bench",
      category: "gym",
      image: "weight_bench",
      width: 2,
      height: 3,
      wall: false,
      collision: [
        [1, 1],
        [1, 1],
        [0, 0],
      ],
      layer: "same",
      rotatable: true,
      interactive: true,
      eventId: 0,
      recipe: {
        570: 3, // Wood x3
        565: 4, // Steel Ingot x4
        572: 2, // Cloth x2
      },
      buyPrice: 12000,
      sellPrice: 4800,
      description: "A bench for weight training exercises.",
    },

    dumbbell_rack: {
      name: "Dumbbell Rack",
      category: "gym",
      image: "dumbbell_rack",
      width: 2,
      height: 2,
      wall: false,
      collision: [
        [1, 1],
        [1, 1],
      ],
      layer: "same",
      rotatable: true,
      recipe: {
        565: 6, // Steel Ingot x6
        570: 2, // Wood x2
      },
      buyPrice: 15000,
      sellPrice: 6000,
      description: "A rack for storing dumbbells and weights.",
    },

    barbell_rack: {
      name: "Barbell Rack",
      category: "gym",
      image: "barbell_rack",
      width: 2,
      height: 2,
      wall: false,
      collision: [
        [1, 1],
        [1, 1],
      ],
      layer: "same",
      rotatable: false,
      recipe: {
        565: 8, // Steel Ingot x8
        570: 2, // Wood x2
      },
      buyPrice: 18000,
      sellPrice: 7200,
      description: "A rack for storing barbells and plates.",
    },

    squat_rack: {
      name: "Squat Rack",
      category: "gym",
      image: "squat_rack",
      width: 2,
      height: 3,
      wall: false,
      collision: [
        [1, 1],
        [1, 1],
        [1, 1],
      ],
      layer: "same",
      rotatable: false,
      interactive: true,
      eventId: 0,
      recipe: {
        565: 10, // Steel Ingot x10
        570: 3, // Wood x3
      },
      buyPrice: 30000,
      sellPrice: 12000,
      description: "A rack for barbell squats and lifting.",
    },

    cable_machine: {
      name: "Cable Machine",
      category: "gym",
      image: "cable_machine",
      width: 2,
      height: 2,
      wall: false,
      collision: [
        [1, 1],
        [1, 1],
      ],
      layer: "same",
      rotatable: true,
      interactive: true,
      eventId: 0,
      recipe: {
        565: 6, // Steel Ingot x6
        583: 2, // Microchip x2
        584: 2, // Battery Cell x2
        585: 1, // Plastic Polymer x1
      },
      buyPrice: 22000,
      sellPrice: 8800,
      description: "A multi-purpose cable exercise machine.",
    },

    leg_press: {
      name: "Leg Press Machine",
      category: "gym",
      image: "leg_press",
      width: 2,
      height: 2,
      wall: false,
      collision: [
        [1, 1],
        [1, 1],
      ],
      layer: "same",
      rotatable: false,
      interactive: true,
      eventId: 0,
      recipe: {
        565: 8, // Steel Ingot x8
        583: 1, // Microchip x1
        584: 1, // Battery Cell x1
      },
      buyPrice: 28000,
      sellPrice: 11200,
      description: "A leg press machine for lower body training.",
    },

    chest_press: {
      name: "Chest Press Machine",
      category: "gym",
      image: "chest_press",
      width: 2,
      height: 2,
      wall: false,
      collision: [
        [1, 1],
        [1, 1],
      ],
      layer: "same",
      rotatable: false,
      interactive: true,
      eventId: 0,
      recipe: {
        565: 7, // Steel Ingot x7
        572: 2, // Cloth x2
        584: 1, // Battery Cell x1
      },
      buyPrice: 20000,
      sellPrice: 8000,
      description: "A chest press machine for upper body training.",
    },

    lat_pulldown: {
      name: "Lat Pulldown Machine",
      category: "gym",
      image: "lat_pulldown",
      width: 2,
      height: 3,
      wall: false,
      collision: [
        [1, 1],
        [1, 1],
        [1, 1],
      ],
      layer: "same",
      rotatable: false,
      interactive: true,
      eventId: 0,
      recipe: {
        565: 7, // Steel Ingot x7
        584: 1, // Battery Cell x1
      },
      buyPrice: 22000,
      sellPrice: 8800,
      description: "A lat pulldown machine for back training.",
    },

    leg_extension: {
      name: "Leg Extension Machine",
      category: "gym",
      image: "leg_extension",
      width: 2,
      height: 2,
      wall: false,
      collision: [
        [1, 1],
        [1, 1],
      ],
      layer: "same",
      rotatable: false,
      interactive: true,
      eventId: 0,
      recipe: {
        565: 6, // Steel Ingot x6
        584: 1, // Battery Cell x1
      },
      buyPrice: 18000,
      sellPrice: 7200,
      description: "A leg extension machine for quadriceps training.",
    },

    ab_crunch_machine: {
      name: "Ab Crunch Machine",
      category: "gym",
      image: "ab_crunch_machine",
      width: 1,
      height: 2,
      wall: false,
      collision: [[1], [1]],
      layer: "same",
      rotatable: false,
      interactive: true,
      eventId: 0,
      recipe: {
        565: 4, // Steel Ingot x4
        572: 2, // Cloth x2
        584: 1, // Battery Cell x1
      },
      buyPrice: 14000,
      sellPrice: 5600,
      description: "A machine for abdominal crunches.",
    },

    rowing_machine: {
      name: "Rowing Machine",
      category: "gym",
      image: "rowing_machine",
      width: 2,
      height: 1,
      wall: false,
      collision: [[1, 1]],
      layer: "same",
      rotatable: true,
      interactive: true,
      eventId: 0,
      recipe: {
        565: 5, // Steel Ingot x5
        572: 2, // Cloth x2
        583: 1, // Microchip x1
        584: 1, // Battery Cell x1
      },
      buyPrice: 20000,
      sellPrice: 8000,
      description: "A rowing machine for full-body cardio.",
    },

    stationary_bike: {
      name: "Stationary Bike",
      category: "gym",
      image: "stationary_bike",
      width: 1,
      height: 1,
      wall: false,
      collision: [[1]],
      layer: "same",
      rotatable: false,
      interactive: true,
      eventId: 0,
      recipe: {
        565: 4, // Steel Ingot x4
        584: 2, // Battery Cell x2
        583: 1, // Microchip x1
      },
      buyPrice: 16000,
      sellPrice: 6400,
      description: "A stationary bike for cardio training.",
    },

    elliptical_machine: {
      name: "Elliptical Machine",
      category: "gym",
      image: "elliptical_machine",
      width: 2,
      height: 1,
      wall: false,
      collision: [[1, 1]],
      layer: "same",
      rotatable: true,
      interactive: true,
      eventId: 0,
      recipe: {
        565: 6, // Steel Ingot x6
        584: 2, // Battery Cell x2
        583: 2, // Microchip x2
      },
      buyPrice: 24000,
      sellPrice: 9600,
      description: "An elliptical machine for low-impact cardio.",
    },

    punching_bag: {
      name: "Punching Bag",
      category: "gym",
      image: "punching_bag",
      width: 1,
      height: 2,
      wall: false,
      collision: [[1], [1]],
      layer: "same",
      rotatable: true,
      interactive: true,
      eventId: 0,
      recipe: {
        570: 2, // Wood x2
        572: 3, // Cloth x3
        571: 2, // Leather x2
      },
      buyPrice: 8000,
      sellPrice: 3200,
      description: "A heavy punching bag for boxing training.",
    },

    speed_bag: {
      name: "Speed Bag",
      category: "gym",
      image: "speed_bag",
      width: 1,
      height: 2,
      wall: false,
      collision: [[1], [1]],
      layer: "same",
      rotatable: true,
      interactive: true,
      eventId: 0,
      recipe: {
        570: 2, // Wood x2
        572: 2, // Cloth x2
        571: 1, // Leather x1
      },
      buyPrice: 6000,
      sellPrice: 2400,
      description: "A speed bag for reflex training.",
    },

    pull_up_bar: {
      name: "Pull-up Bar",
      category: "gym",
      image: "pull_up_bar",
      width: 2,
      height: 1,
      wall: false,
      collision: [[1, 1]],
      layer: "above",
      rotatable: true,
      interactive: true,
      eventId: 0,
      recipe: {
        565: 3, // Steel Ingot x3
        570: 1, // Wood x1
      },
      buyPrice: 5000,
      sellPrice: 2000,
      description: "A bar for pull-up and chin-up exercises.",
    },

    parallel_bars: {
      name: "Parallel Bars",
      category: "gym",
      image: "parallel_bars",
      width: 2,
      height: 2,
      wall: false,
      collision: [
        [1, 1],
        [1, 1],
      ],
      layer: "same",
      rotatable: true,
      recipe: {
        565: 5, // Steel Ingot x5
        570: 2, // Wood x2
      },
      buyPrice: 10000,
      sellPrice: 4000,
      description: "Parallel bars for dips and core training.",
    },

    gym_mat: {
      name: "Gym Mat",
      category: "gym",
      image: "gym_mat",
      width: 2,
      height: 2,
      wall: false,
      collision: [
        [0, 0],
        [0, 0],
      ],
      layer: "below",
      rotatable: false,
      recipe: {
        572: 4, // Cloth x4
        585: 3, // Plastic Polymer x3
      },
      buyPrice: 5000,
      sellPrice: 2000,
      description: "A protective mat for floor exercises.",
    },

    gym_mirror: {
      name: "Gym Mirror",
      category: "gym",
      image: "gym_mirror",
      width: 2,
      height: 3,
      wall: false,
      collision: [
        [1, 1],
        [1, 1],
        [1, 1],
      ],
      layer: "same",
      rotatable: true,
      recipe: {
        569: 5, // Glass x5
        565: 2, // Steel Ingot x2
      },
      buyPrice: 12000,
      sellPrice: 4800,
      description: "A large mirror for form checking.",
    },

    gym_locker: {
      name: "Gym Locker",
      category: "gym",
      image: "gym_locker",
      width: 1,
      height: 2,
      wall: false,
      collision: [[1], [1]],
      layer: "same",
      rotatable: true,
      interactive: true,
      eventId: 0,
      recipe: {
        565: 3, // Steel Ingot x3
        570: 1, // Wood x1
      },
      buyPrice: 6000,
      sellPrice: 2400,
      description: "A locker for storing gym belongings.",
    },

    shower_stall: {
      name: "Shower Stall",
      category: "gym",
      image: "shower_stall",
      width: 1,
      height: 2,
      wall: false,
      collision: [[1], [1]],
      layer: "same",
      rotatable: true,
      interactive: true,
      eventId: 0,
      recipe: {
        565: 2, // Steel Ingot x2
        569: 2, // Glass x2
        572: 1, // Cloth x1
      },
      buyPrice: 8000,
      sellPrice: 3200,
      description: "A shower stall for post-workout cleaning.",
    },

    gym_bleachers: {
      name: "Gym Bleachers",
      category: "gym",
      image: "gym_bleachers",
      width: 3,
      height: 2,
      wall: false,
      collision: [
        [1, 1, 1],
        [1, 1, 1],
      ],
      layer: "same",
      rotatable: true,
      recipe: {
        570: 6, // Wood x6
        565: 2, // Steel Ingot x2
      },
      buyPrice: 14000,
      sellPrice: 5600,
      description: "Bleachers for spectators or rest.",
    },

    foam_roller: {
      name: "Foam Roller Stand",
      category: "gym",
      image: "foam_roller",
      width: 1,
      height: 1,
      wall: false,
      collision: [[1]],
      layer: "same",
      rotatable: false,
      recipe: {
        585: 3, // Plastic Polymer x3
        572: 1, // Cloth x1
      },
      buyPrice: 4000,
      sellPrice: 1600,
      description: "A stand for foam rollers and recovery tools.",
    },

    resistance_bands_rack: {
      name: "Resistance Bands Rack",
      category: "gym",
      image: "resistance_bands_rack",
      width: 1,
      height: 2,
      wall: false,
      collision: [[1], [1]],
      layer: "same",
      rotatable: true,
      recipe: {
        570: 2, // Wood x2
        572: 2, // Cloth x2
      },
      buyPrice: 3500,
      sellPrice: 1400,
      description: "A rack for organizing resistance bands.",
    },

    medicine_ball_rack: {
      name: "Medicine Ball Rack",
      category: "gym",
      image: "medicine_ball_rack",
      width: 2,
      height: 1,
      wall: false,
      collision: [[1, 1]],
      layer: "same",
      rotatable: true,
      recipe: {
        570: 2, // Wood x2
        565: 1, // Steel Ingot x1
      },
      buyPrice: 4500,
      sellPrice: 1800,
      description: "A rack for storing medicine balls.",
    },

    gym_clock: {
      name: "Gym Clock",
      category: "gym",
      image: "gym_clock",
      width: 1,
      height: 1,
      wall: false,
      collision: [[1]],
      layer: "above",
      rotatable: false,
      recipe: {
        565: 1, // Steel Ingot x1
        569: 1, // Glass x1
      },
      buyPrice: 2000,
      sellPrice: 800,
      description: "A wall-mounted clock for interval training.",
    },

    // === BEACH ITEMS ===
    beach_umbrella: {
      name: "Beach Umbrella",
      category: "beach",
      image: "beach_umbrella",
      width: 1,
      height: 1,
      wall: false,
      collision: [[1]],
      layer: "same",
      rotatable: true,
      recipe: {
        572: 3, // Cloth x3
        570: 2, // Wood x2
      },
      buyPrice: 4000,
      sellPrice: 1600,
      description: "A colorful umbrella for sun protection.",
    },

    beach_chair: {
      name: "Beach Chair",
      category: "beach",
      image: "beach_chair",
      width: 1,
      height: 1,
      wall: false,
      collision: [[1]],
      layer: "same",
      rotatable: true,
      interactive: true,
      eventId: 0,
      recipe: {
        570: 2, // Wood x2
        572: 2, // Cloth x2
      },
      buyPrice: 3500,
      sellPrice: 1400,
      description: "A comfortable chair for relaxing on the beach.",
    },

    sand_castle: {
      name: "Sand Castle",
      category: "beach",
      image: "sand_castle",
      width: 2,
      height: 2,
      wall: false,
      collision: [
        [1, 1],
        [1, 1],
      ],
      layer: "same",
      rotatable: false,
      recipe: {
        575: 6, // Plant Matter x6 (sand)
      },
      buyPrice: 5000,
      sellPrice: 2000,
      description: "A sand castle for decoration.",
    },

    sailboat: {
      name: "Sailboat",
      category: "beach",
      image: "sailboat",
      width: 2,
      height: 3,
      wall: false,
      collision: [
        [1, 1],
        [1, 1],
        [1, 1],
      ],
      layer: "same",
      rotatable: true,
      interactive: true,
      eventId: 0,
      recipe: {
        570: 5, // Wood x5
        572: 4, // Cloth x4
        571: 2, // Leather x2
      },
      buyPrice: 20000,
      sellPrice: 8000,
      description: "A wooden sailboat for beach exploration.",
    },

    beach_hut: {
      name: "Beach Hut",
      category: "beach",
      image: "beach_hut",
      width: 2,
      height: 2,
      wall: false,
      collision: [
        [1, 1],
        [1, 1],
      ],
      layer: "same",
      rotatable: true,
      interactive: true,
      eventId: 0,
      recipe: {
        570: 6, // Wood x6
        572: 3, // Cloth x3
        575: 2, // Plant Matter x2
      },
      buyPrice: 15000,
      sellPrice: 6000,
      description: "A small beach hut for shelter.",
    },

    surfboard: {
      name: "Surfboard",
      category: "beach",
      image: "surfboard",
      width: 1,
      height: 2,
      wall: false,
      collision: [[1], [1]],
      layer: "same",
      rotatable: true,
      recipe: {
        570: 3, // Wood x3
        585: 2, // Plastic Polymer x2
      },
      buyPrice: 8000,
      sellPrice: 3200,
      description: "A surfboard for riding waves.",
    },

    beach_ball: {
      name: "Beach Ball",
      category: "beach",
      image: "beach_ball",
      width: 1,
      height: 1,
      wall: false,
      collision: [[0]],
      layer: "above",
      rotatable: false,
      recipe: {
        585: 2, // Plastic Polymer x2
        572: 1, // Cloth x1
      },
      buyPrice: 2000,
      sellPrice: 800,
      description: "An inflatable beach ball.",
    },

    beach_towel_rack: {
      name: "Beach Towel Rack",
      category: "beach",
      image: "beach_towel_rack",
      width: 1,
      height: 1,
      wall: false,
      collision: [[1]],
      layer: "same",
      rotatable: true,
      recipe: {
        570: 2, // Wood x2
        572: 2, // Cloth x2
      },
      buyPrice: 3000,
      sellPrice: 1200,
      description: "A rack for hanging beach towels.",
    },

    beach_cooler: {
      name: "Beach Cooler",
      category: "beach",
      image: "beach_cooler",
      width: 1,
      height: 1,
      wall: false,
      collision: [[1]],
      layer: "same",
      rotatable: false,
      interactive: true,
      eventId: 0,
      recipe: {
        570: 2, // Wood x2
        585: 3, // Plastic Polymer x3
        572: 1, // Cloth x1
      },
      buyPrice: 6000,
      sellPrice: 2400,
      description: "A cooler for cold drinks on the beach.",
    },

    lifeguard_stand: {
      name: "Lifeguard Stand",
      category: "beach",
      image: "lifeguard_stand",
      width: 2,
      height: 3,
      wall: false,
      collision: [
        [1, 1],
        [1, 1],
        [1, 1],
      ],
      layer: "same",
      rotatable: false,
      interactive: true,
      eventId: 0,
      recipe: {
        570: 6, // Wood x6
        565: 2, // Steel Ingot x2
        572: 1, // Cloth x1
      },
      buyPrice: 12000,
      sellPrice: 4800,
      description: "A tall stand for beach lifeguards.",
    },

    beach_sign: {
      name: "Beach Sign",
      category: "beach",
      image: "beach_sign",
      width: 1,
      height: 2,
      wall: false,
      collision: [[1], [1]],
      layer: "above",
      rotatable: true,
      recipe: {
        570: 2, // Wood x2
        572: 1, // Cloth x1
      },
      buyPrice: 2500,
      sellPrice: 1000,
      description: "A sign for beach warnings and information.",
    },

    beach_anchor: {
      name: "Anchor",
      category: "beach",
      image: "beach_anchor",
      width: 1,
      height: 1,
      wall: false,
      collision: [[1]],
      layer: "same",
      rotatable: true,
      recipe: {
        565: 4, // Steel Ingot x4
      },
      buyPrice: 5000,
      sellPrice: 2000,
      description: "A ship anchor for mooring.",
    },

    wooden_dock: {
      name: "Wooden Dock",
      category: "beach",
      image: "wooden_dock",
      width: 3,
      height: 1,
      wall: false,
      collision: [[1, 1, 1]],
      layer: "below",
      rotatable: true,
      recipe: {
        570: 8, // Wood x8
        565: 2, // Steel Ingot x2
      },
      buyPrice: 10000,
      sellPrice: 4000,
      description: "A wooden dock for mooring boats.",
    },

    beach_pier: {
      name: "Beach Pier",
      category: "beach",
      image: "beach_pier",
      width: 4,
      height: 2,
      wall: false,
      collision: [
        [1, 1, 1, 1],
        [1, 1, 1, 1],
      ],
      layer: "same",
      rotatable: true,
      recipe: {
        570: 12, // Wood x12
        565: 4, // Steel Ingot x4
      },
      buyPrice: 25000,
      sellPrice: 10000,
      description: "A large pier extending into the water.",
    },

    buoy: {
      name: "Buoy",
      category: "beach",
      image: "buoy",
      width: 1,
      height: 1,
      wall: false,
      collision: [[1]],
      layer: "same",
      rotatable: false,
      recipe: {
        585: 3, // Plastic Polymer x3
        565: 1, // Steel Ingot x1
      },
      buyPrice: 3000,
      sellPrice: 1200,
      description: "A buoy for marking water zones.",
    },

    beach_lounge: {
      name: "Beach Lounger",
      category: "beach",
      image: "beach_lounge",
      width: 2,
      height: 1,
      wall: false,
      collision: [[1, 1]],
      layer: "same",
      rotatable: true,
      interactive: true,
      eventId: 0,
      recipe: {
        570: 3, // Wood x3
        572: 3, // Cloth x3
        571: 1, // Leather x1
      },
      buyPrice: 7000,
      sellPrice: 2800,
      description: "A luxurious lounger for relaxation.",
    },

    sand_bucket: {
      name: "Sand Bucket",
      category: "beach",
      image: "sand_bucket",
      width: 1,
      height: 1,
      wall: false,
      collision: [[0]],
      layer: "above",
      rotatable: false,
      recipe: {
        585: 2, // Plastic Polymer x2
        570: 1, // Wood x1
      },
      buyPrice: 2000,
      sellPrice: 800,
      description: "A bucket for sand and water play.",
    },

    sand_shovel: {
      name: "Sand Shovel",
      category: "beach",
      image: "sand_shovel",
      width: 1,
      height: 1,
      wall: false,
      collision: [[0]],
      layer: "above",
      rotatable: true,
      recipe: {
        570: 2, // Wood x2
        565: 1, // Steel Ingot x1
      },
      buyPrice: 1500,
      sellPrice: 600,
      description: "A shovel for digging in the sand.",
    },

    beach_shower: {
      name: "Beach Shower",
      category: "beach",
      image: "beach_shower",
      width: 1,
      height: 2,
      wall: false,
      collision: [[1], [1]],
      layer: "same",
      rotatable: true,
      interactive: true,
      eventId: 0,
      recipe: {
        570: 3, // Wood x3
        565: 2, // Steel Ingot x2
        572: 1, // Cloth x1
      },
      buyPrice: 6000,
      sellPrice: 2400,
      description: "An outdoor shower for rinsing off sand.",
    },

    beach_bar: {
      name: "Beach Bar",
      category: "beach",
      image: "beach_bar",
      width: 2,
      height: 1,
      wall: false,
      collision: [[1, 1]],
      layer: "same",
      rotatable: true,
      interactive: true,
      eventId: 0,
      recipe: {
        570: 4, // Wood x4
        565: 2, // Steel Ingot x2
        572: 1, // Cloth x1
      },
      buyPrice: 10000,
      sellPrice: 4000,
      description: "A bar counter for beach refreshments.",
    },

    tiki_torch: {
      name: "Tiki Torch",
      category: "beach",
      image: "tiki_torch",
      width: 1,
      height: 1,
      wall: false,
      collision: [[1]],
      layer: "same",
      rotatable: false,
      interactive: true,
      eventId: 0,
      recipe: {
        570: 2, // Wood x2
        577: 2, // Oil Flask x2
        572: 1, // Cloth x1
      },
      buyPrice: 4000,
      sellPrice: 1600,
      description: "A tiki torch for evening beach lighting.",
    },

    palm_tree: {
      name: "Palm Tree",
      category: "beach",
      image: "palm_tree",
      width: 2,
      height: 3,
      wall: false,
      collision: [
        [1, 1],
        [1, 1],
        [1, 1],
      ],
      layer: "same",
      rotatable: false,
      recipe: {
        575: 8, // Plant Matter x8
        570: 2, // Wood x2
      },
      buyPrice: 8000,
      sellPrice: 3200,
      description: "A tropical palm tree.",
    },

    hammock: {
      name: "Beach Hammock",
      category: "beach",
      image: "hammock",
      width: 2,
      height: 1,
      wall: false,
      collision: [[1, 1]],
      layer: "above",
      rotatable: true,
      interactive: true,
      eventId: 0,
      recipe: {
        572: 4, // Cloth x4
        570: 2, // Wood x2
      },
      buyPrice: 6500,
      sellPrice: 2600,
      description: "A hammock strung between poles.",
    },

    beach_volleyball_net: {
      name: "Volleyball Net",
      category: "beach",
      image: "beach_volleyball_net",
      width: 3,
      height: 1,
      wall: false,
      collision: [[1, 1, 1]],
      layer: "above",
      rotatable: true,
      recipe: {
        572: 4, // Cloth x4
        570: 2, // Wood x2
      },
      buyPrice: 5000,
      sellPrice: 2000,
      description: "A net for beach volleyball.",
    },

    beach_cabana: {
      name: "Beach Cabana",
      category: "beach",
      image: "beach_cabana",
      width: 3,
      height: 3,
      wall: false,
      collision: [
        [1, 1, 1],
        [1, 1, 1],
        [1, 1, 1],
      ],
      layer: "same",
      rotatable: true,
      interactive: true,
      eventId: 0,
      recipe: {
        570: 10, // Wood x10
        572: 6, // Cloth x6
        571: 3, // Leather x3
      },
      buyPrice: 30000,
      sellPrice: 12000,
      description: "A luxurious cabana for privacy on the beach.",
    },

    rowboat: {
      name: "Rowboat",
      category: "beach",
      image: "rowboat",
      width: 2,
      height: 2,
      wall: false,
      collision: [
        [1, 1],
        [1, 1],
      ],
      layer: "same",
      rotatable: true,
      interactive: true,
      eventId: 0,
      recipe: {
        570: 6, // Wood x6
        571: 2, // Leather x2
      },
      buyPrice: 12000,
      sellPrice: 4800,
      description: "A small rowboat for water exploration.",
    },
  };
  window.FurnitureData = {
    FURNITURE_DB,
  };
})();

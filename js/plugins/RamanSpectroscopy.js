/*:
 * @target MZ
 * @plugindesc [v1.0] Raman Spectroscopy Scanner — analyzes statues, paintings, and library objects in front of the player.
 * @author Esoteric Heavy Industries
 *
 * @help
 * Raman Spectroscopy Scanner
 * ==========================
 * Call the ScanFront plugin command to scan the object the player is facing.
 * The scanner identifies material composition of statues, paintings, and
 * library/bookcase objects and renders an authentic Raman spectrum graph.
 *
 * Detected object types (matched against event name):
 *   Statues  : statue, sculpt, figure, bust, idol, carv
 *   Paintings: paint, picture, portrait, canvas, artwork, fresco
 *   Libraries: book, shelf, librar, tome, scroll
 *
 * Manual material override (event note tag):
 *   <RamanMaterial:marble>
 *
 * Supported material keys:
 *   marble, granite, bronze, limestone
 *   lapis, vermillion, malachite, lead_white
 *   wood, paper
 *
 * Close the display with OK, Cancel, or click.
 *
 * @command ScanFront
 * @text Scan Object in Front
 * @desc Performs Raman spectroscopy scan on the object the player is facing.
 */

(() => {
    'use strict';
    const pluginName = 'RamanSpectroscopy';

    // =========================================================
    // MATERIAL DATABASE
    // Peaks: { pos: Raman shift cm⁻¹, height: 0-1, fwhm: cm⁻¹ }
    // =========================================================
    const MATERIAL_DB = {
        marble: {
            name: 'Calcite  CaCO\u2083',
            subname: 'Marble',
            color: 0x88CCFF,
            confidence: 97.4,
            peaks: [
                { pos: 156,  height: 0.28, fwhm: 16 },
                { pos: 280,  height: 0.42, fwhm: 18 },
                { pos: 712,  height: 0.52, fwhm: 22 },
                { pos: 1085, height: 1.00, fwhm: 14 },
                { pos: 1434, height: 0.10, fwhm: 28 },
            ],
        },
        granite: {
            name: 'SiO\u2082 + Feldspars',
            subname: 'Granite',
            color: 0xFFBB88,
            confidence: 95.1,
            peaks: [
                { pos: 128,  height: 0.28, fwhm: 20 },
                { pos: 206,  height: 0.52, fwhm: 16 },
                { pos: 265,  height: 0.38, fwhm: 16 },
                { pos: 356,  height: 0.32, fwhm: 20 },
                { pos: 464,  height: 1.00, fwhm: 12 },
                { pos: 808,  height: 0.42, fwhm: 16 },
                { pos: 1082, height: 0.22, fwhm: 24 },
            ],
        },
        bronze: {
            name: 'Cu\u2082O / SnO\u2082  alloy',
            subname: 'Bronze + Patina',
            color: 0xCC9944,
            confidence: 91.8,
            peaks: [
                { pos: 218,  height: 0.55, fwhm: 50 },
                { pos: 296,  height: 1.00, fwhm: 40 },
                { pos: 413,  height: 0.38, fwhm: 60 },
                { pos: 624,  height: 0.30, fwhm: 70 },
                { pos: 1048, height: 0.18, fwhm: 80 },
            ],
        },
        limestone: {
            name: 'CaCO\u2083 / MgCO\u2083',
            subname: 'Limestone',
            color: 0xDDCCAA,
            confidence: 98.2,
            peaks: [
                { pos: 155,  height: 0.22, fwhm: 24 },
                { pos: 280,  height: 0.30, fwhm: 28 },
                { pos: 725,  height: 0.38, fwhm: 28 },
                { pos: 1088, height: 1.00, fwhm: 18 },
                { pos: 1405, height: 0.12, fwhm: 34 },
            ],
        },
        lapis: {
            name: 'Lazurite  Na\u2088[Al\u2086Si\u2086O\u2082\u2084]S\u2099',
            subname: 'Lapis Lazuli + Oil Binder',
            color: 0x4488FF,
            confidence: 93.6,
            peaks: [
                { pos: 258,  height: 0.28, fwhm: 30 },
                { pos: 548,  height: 0.72, fwhm: 24 },
                { pos: 820,  height: 1.00, fwhm: 20 },
                { pos: 1096, height: 0.42, fwhm: 24 },
                { pos: 1442, height: 0.48, fwhm: 40 },
                { pos: 1657, height: 0.38, fwhm: 36 },
            ],
        },
        vermillion: {
            name: '\u03B1-HgS  Cinnabar',
            subname: 'Vermillion Pigment',
            color: 0xFF4422,
            confidence: 99.1,
            peaks: [
                { pos: 252,  height: 1.00, fwhm: 16 },
                { pos: 343,  height: 0.58, fwhm: 20 },
                { pos: 1442, height: 0.45, fwhm: 40 },
                { pos: 1657, height: 0.32, fwhm: 36 },
                { pos: 2850, height: 0.28, fwhm: 60 },
                { pos: 2920, height: 0.52, fwhm: 50 },
            ],
        },
        malachite: {
            name: 'Cu\u2082(CO\u2083)(OH)\u2082',
            subname: 'Malachite Pigment',
            color: 0x44CC66,
            confidence: 96.7,
            peaks: [
                { pos: 179,  height: 0.42, fwhm: 24 },
                { pos: 271,  height: 0.68, fwhm: 20 },
                { pos: 330,  height: 0.52, fwhm: 20 },
                { pos: 433,  height: 1.00, fwhm: 16 },
                { pos: 727,  height: 0.32, fwhm: 30 },
                { pos: 1096, height: 0.28, fwhm: 28 },
            ],
        },
        lead_white: {
            name: '2PbCO\u2083\u00B7Pb(OH)\u2082',
            subname: 'Lead White Pigment',
            color: 0xEEDDAA,
            confidence: 94.3,
            peaks: [
                { pos: 401,  height: 0.28, fwhm: 30 },
                { pos: 918,  height: 0.48, fwhm: 24 },
                { pos: 1055, height: 1.00, fwhm: 20 },
                { pos: 1370, height: 0.38, fwhm: 28 },
                { pos: 2988, height: 0.55, fwhm: 40 },
            ],
        },
        wood: {
            name: 'Cellulose + Lignin',
            subname: 'Hardwood',
            color: 0xAA7744,
            confidence: 88.9,
            peaks: [
                { pos: 380,  height: 0.28, fwhm: 50 },
                { pos: 900,  height: 0.52, fwhm: 40 },
                { pos: 1095, height: 1.00, fwhm: 30 },
                { pos: 1268, height: 0.48, fwhm: 36 },
                { pos: 1378, height: 0.42, fwhm: 30 },
                { pos: 1598, height: 0.62, fwhm: 24 },
                { pos: 2900, height: 0.70, fwhm: 60 },
            ],
        },
        paper: {
            name: 'Cellulose',
            subname: 'Aged Parchment',
            color: 0xFFEEBB,
            confidence: 92.0,
            peaks: [
                { pos: 380,  height: 0.18, fwhm: 40 },
                { pos: 900,  height: 0.38, fwhm: 36 },
                { pos: 1095, height: 1.00, fwhm: 24 },
                { pos: 1378, height: 0.32, fwhm: 30 },
                { pos: 2900, height: 0.58, fwhm: 50 },
            ],
        },
        onyx: {
            name: 'SiO\u2082  Chalcedony',
            subname: 'Black Onyx',
            color: 0x9988CC,
            confidence: 96.3,
            peaks: [
                { pos: 207,  height: 0.38, fwhm: 18 },
                { pos: 464,  height: 1.00, fwhm: 10 },
                { pos: 697,  height: 0.20, fwhm: 28 },
                { pos: 808,  height: 0.35, fwhm: 16 },
                { pos: 1085, height: 0.30, fwhm: 30 },
                { pos: 1600, height: 0.25, fwhm: 60 },  // D band — carbon inclusions
                { pos: 2900, height: 0.22, fwhm: 80 },  // G band — carbon inclusions
            ],
        },
        // ---- Stone / Mineral ----
        obsidian: {
            name: 'SiO\u2082  Volcanic Glass',
            subname: 'Obsidian',
            color: 0x553355,
            confidence: 89.7,
            peaks: [
                { pos: 464,  height: 1.00, fwhm: 90 },  // broad amorphous Si-O-Si
                { pos: 800,  height: 0.45, fwhm: 130 },
                { pos: 1050, height: 0.28, fwhm: 160 },
            ],
        },
        jade: {
            name: 'NaAlSi\u2082O\u2086  Jadeite',
            subname: 'Jade',
            color: 0x33AA77,
            confidence: 94.1,
            peaks: [
                { pos: 228,  height: 0.35, fwhm: 22 },
                { pos: 374,  height: 1.00, fwhm: 16 },
                { pos: 521,  height: 0.55, fwhm: 20 },
                { pos: 700,  height: 0.22, fwhm: 30 },
                { pos: 1004, height: 0.75, fwhm: 18 },
            ],
        },
        quartz: {
            name: 'SiO\u2082  \u03B1-Quartz',
            subname: 'Rock Crystal / Quartz',
            color: 0xCCEEFF,
            confidence: 99.8,
            peaks: [
                { pos: 128,  height: 0.32, fwhm: 10 },
                { pos: 206,  height: 0.58, fwhm: 8 },
                { pos: 265,  height: 0.42, fwhm: 8 },
                { pos: 356,  height: 0.28, fwhm: 10 },
                { pos: 464,  height: 1.00, fwhm: 6 },  // very sharp main peak
                { pos: 808,  height: 0.38, fwhm: 10 },
            ],
        },
        sandstone: {
            name: 'SiO\u2082 + Calcite Cement',
            subname: 'Sandstone',
            color: 0xDDAA66,
            confidence: 91.2,
            peaks: [
                { pos: 265,  height: 0.25, fwhm: 22 },
                { pos: 356,  height: 0.30, fwhm: 24 },
                { pos: 464,  height: 1.00, fwhm: 18 },
                { pos: 808,  height: 0.28, fwhm: 22 },
                { pos: 1082, height: 0.35, fwhm: 30 },
            ],
        },
        basalt: {
            name: 'Pyroxene + Plagioclase',
            subname: 'Basalt',
            color: 0x446677,
            confidence: 87.5,
            peaks: [
                { pos: 325,  height: 0.45, fwhm: 35 },
                { pos: 392,  height: 0.60, fwhm: 30 },
                { pos: 668,  height: 1.00, fwhm: 40 },
                { pos: 824,  height: 0.38, fwhm: 35 },
                { pos: 1012, height: 0.55, fwhm: 40 },
            ],
        },
        alabaster: {
            name: 'CaSO\u2084\u00B72H\u2082O  Gypsum',
            subname: 'Alabaster',
            color: 0xFFEEDD,
            confidence: 98.6,
            peaks: [
                { pos: 184,  height: 0.38, fwhm: 16 },
                { pos: 415,  height: 0.42, fwhm: 18 },
                { pos: 619,  height: 0.35, fwhm: 18 },
                { pos: 1008, height: 1.00, fwhm: 12 },  // SO4 symmetric stretch
                { pos: 1137, height: 0.28, fwhm: 20 },
            ],
        },
        clay: {
            name: 'Al\u2082Si\u2082O\u2085(OH)\u2084  Kaolinite',
            subname: 'Fired Clay / Terracotta',
            color: 0xCC6633,
            confidence: 93.4,
            peaks: [
                { pos: 132,  height: 0.30, fwhm: 20 },
                { pos: 270,  height: 0.50, fwhm: 18 },
                { pos: 338,  height: 0.45, fwhm: 16 },
                { pos: 432,  height: 0.65, fwhm: 16 },
                { pos: 753,  height: 0.50, fwhm: 22 },
                { pos: 1107, height: 1.00, fwhm: 20 },
            ],
        },
        // ---- Metals ----
        gold: {
            name: 'Au  Surface Oxide Layer',
            subname: 'Gold (Gilded)',
            color: 0xFFCC00,
            confidence: 82.3,
            peaks: [
                { pos: 294,  height: 0.30, fwhm: 65 },
                { pos: 640,  height: 0.20, fwhm: 90 },  // near-featureless — noble metal
            ],
        },
        silver: {
            name: 'Ag\u2082S + AgCl  Tarnish',
            subname: 'Silver (Tarnished)',
            color: 0xCCCCCC,
            confidence: 85.1,
            peaks: [
                { pos: 203,  height: 0.80, fwhm: 30 },  // Ag2S
                { pos: 238,  height: 1.00, fwhm: 24 },  // AgCl
                { pos: 344,  height: 0.45, fwhm: 28 },
            ],
        },
        copper: {
            name: 'Cu\u2082O / CuO  Patina',
            subname: 'Copper',
            color: 0xCC7733,
            confidence: 90.5,
            peaks: [
                { pos: 218,  height: 0.65, fwhm: 40 },  // Cu2O
                { pos: 298,  height: 1.00, fwhm: 35 },
                { pos: 345,  height: 0.55, fwhm: 40 },  // CuO
                { pos: 528,  height: 0.40, fwhm: 50 },
                { pos: 632,  height: 0.48, fwhm: 50 },
            ],
        },
        iron: {
            name: '\u03B1-Fe\u2082O\u2083  Hematite',
            subname: 'Iron (Oxidized / Rusted)',
            color: 0x884422,
            confidence: 90.2,
            peaks: [
                { pos: 225,  height: 0.60, fwhm: 25 },
                { pos: 247,  height: 0.45, fwhm: 22 },
                { pos: 293,  height: 1.00, fwhm: 20 },  // main hematite peak
                { pos: 412,  height: 0.70, fwhm: 22 },
                { pos: 498,  height: 0.35, fwhm: 28 },
                { pos: 613,  height: 0.45, fwhm: 28 },
            ],
        },
        steel: {
            name: 'Fe/C + Fe\u2082O\u2083  Alloy',
            subname: 'Steel (Patinated)',
            color: 0x778899,
            confidence: 88.7,
            peaks: [
                { pos: 225,  height: 0.40, fwhm: 30 },
                { pos: 293,  height: 0.75, fwhm: 26 },  // hematite layer
                { pos: 412,  height: 1.00, fwhm: 28 },
                { pos: 668,  height: 0.35, fwhm: 35 },  // magnetite Fe3O4
                { pos: 1350, height: 0.30, fwhm: 80 },  // carbon D band
            ],
        },
        // ---- Organic / Other ----
        ivory: {
            name: 'Ca\u2085(PO\u2084)\u2083OH  Hydroxyapatite',
            subname: 'Ivory / Bone',
            color: 0xFFFAE8,
            confidence: 96.8,
            peaks: [
                { pos: 430,  height: 0.35, fwhm: 24 },
                { pos: 590,  height: 0.30, fwhm: 28 },
                { pos: 960,  height: 1.00, fwhm: 18 },  // PO4 v1 symmetric stretch
                { pos: 1045, height: 0.45, fwhm: 22 },
                { pos: 1070, height: 0.38, fwhm: 22 },
                { pos: 1640, height: 0.22, fwhm: 50 },  // amide I
                { pos: 2940, height: 0.40, fwhm: 60 },  // C-H stretch
            ],
        },
        ebony: {
            name: 'Cellulose + Lignin (dense)',
            subname: 'Ebony Wood',
            color: 0x221100,
            confidence: 88.2,
            peaks: [
                { pos: 380,  height: 0.22, fwhm: 50 },
                { pos: 900,  height: 0.40, fwhm: 40 },
                { pos: 1095, height: 0.85, fwhm: 30 },
                { pos: 1268, height: 0.55, fwhm: 36 },
                { pos: 1378, height: 0.48, fwhm: 30 },
                { pos: 1598, height: 1.00, fwhm: 22 },  // lignin aromatic — dominant in ebony
                { pos: 2900, height: 0.60, fwhm: 60 },
            ],
        },
        bamboo: {
            name: 'Cellulose + Silica Phytoliths',
            subname: 'Bamboo',
            color: 0xAABB55,
            confidence: 91.5,
            peaks: [
                { pos: 380,  height: 0.20, fwhm: 40 },
                { pos: 464,  height: 0.30, fwhm: 30 },  // SiO2 phytoliths
                { pos: 900,  height: 0.45, fwhm: 36 },
                { pos: 1095, height: 1.00, fwhm: 24 },
                { pos: 1378, height: 0.38, fwhm: 28 },
                { pos: 1598, height: 0.50, fwhm: 22 },
                { pos: 2900, height: 0.65, fwhm: 55 },
            ],
        },
        // ---- Painting pigments ----
        ultramarine: {
            name: 'Na\u2088[AlSiO\u2084]\u2086S\u2083  Synthetic',
            subname: 'Ultramarine Blue',
            color: 0x2244DD,
            confidence: 94.8,
            peaks: [
                { pos: 258,  height: 0.22, fwhm: 28 },
                { pos: 548,  height: 0.65, fwhm: 22 },
                { pos: 820,  height: 1.00, fwhm: 18 },
                { pos: 975,  height: 0.30, fwhm: 26 },
                { pos: 1096, height: 0.38, fwhm: 22 },
            ],
        },
        prussian_blue: {
            name: 'Fe\u2087[Fe(CN)\u2086]\u2083',
            subname: 'Prussian Blue',
            color: 0x003366,
            confidence: 99.4,
            peaks: [
                { pos: 284,  height: 0.50, fwhm: 20 },
                { pos: 537,  height: 0.35, fwhm: 25 },
                { pos: 2094, height: 1.00, fwhm: 10 },  // CN stretch — highly diagnostic
            ],
        },
        cobalt_blue: {
            name: 'CoAl\u2082O\u2084  Spinel',
            subname: 'Cobalt Blue',
            color: 0x0055AA,
            confidence: 97.2,
            peaks: [
                { pos: 197,  height: 0.35, fwhm: 20 },
                { pos: 503,  height: 0.85, fwhm: 16 },
                { pos: 522,  height: 1.00, fwhm: 14 },
                { pos: 618,  height: 0.45, fwhm: 22 },
            ],
        },
        burnt_sienna: {
            name: '\u03B1-Fe\u2082O\u2083  Calcined Earth',
            subname: 'Burnt Sienna',
            color: 0xBB5522,
            confidence: 88.4,
            peaks: [
                { pos: 225,  height: 0.55, fwhm: 30 },
                { pos: 292,  height: 1.00, fwhm: 25 },
                { pos: 412,  height: 0.65, fwhm: 28 },
                { pos: 497,  height: 0.30, fwhm: 32 },
                { pos: 613,  height: 0.40, fwhm: 32 },
            ],
        },
        azurite: {
            name: 'Cu\u2083(CO\u2083)\u2082(OH)\u2082',
            subname: 'Azurite',
            color: 0x3366CC,
            confidence: 97.6,
            peaks: [
                { pos: 250,  height: 0.45, fwhm: 24 },
                { pos: 282,  height: 0.60, fwhm: 20 },
                { pos: 397,  height: 0.55, fwhm: 22 },
                { pos: 435,  height: 0.75, fwhm: 20 },
                { pos: 756,  height: 1.00, fwhm: 16 },
                { pos: 1096, height: 0.50, fwhm: 24 },
                { pos: 1456, height: 0.32, fwhm: 30 },
            ],
        },
        viridian: {
            name: 'Cr\u2082O\u2083\u00B7H\u2082O  Hydrated Chromia',
            subname: 'Viridian Green',
            color: 0x228855,
            confidence: 96.1,
            peaks: [
                { pos: 351,  height: 0.55, fwhm: 20 },
                { pos: 549,  height: 1.00, fwhm: 18 },  // Cr-O main band
                { pos: 610,  height: 0.45, fwhm: 22 },
                { pos: 1442, height: 0.30, fwhm: 40 },  // oil binder C-H
            ],
        },
        charcoal: {
            name: 'Amorphous Carbon',
            subname: 'Charcoal / Carbon Black',
            color: 0x444444,
            confidence: 95.0,
            peaks: [
                { pos: 1350, height: 1.00, fwhm: 60 },  // D band (disorder)
                { pos: 1590, height: 0.90, fwhm: 50 },  // G band (graphite)
                { pos: 2700, height: 0.45, fwhm: 120 }, // 2D band
            ],
        },
        // ---- Fossil specimens ----
        amber: {
            name: 'Polymerized Terpenoid Resin',
            subname: 'Fossilized Amber',
            color: 0xFFAA22,
            confidence: 97.8,
            peaks: [
                { pos: 1168, height: 0.40, fwhm: 30 },  // C-O-C stretch
                { pos: 1380, height: 0.45, fwhm: 28 },  // C-H deformation
                { pos: 1453, height: 0.55, fwhm: 26 },  // CH2 scissor
                { pos: 1639, height: 0.70, fwhm: 22 },  // C=C exocyclic stretch
                { pos: 1726, height: 0.55, fwhm: 20 },  // C=O ester carbonyl — succinite marker
                { pos: 2868, height: 0.65, fwhm: 35 },  // C-H sym stretch
                { pos: 2930, height: 1.00, fwhm: 30 },  // C-H asym stretch (main band)
            ],
        },
        fossil_bone: {
            name: 'Bioapatite + Diagenetic Calcite',
            subname: 'Permineralized Bone',
            color: 0xBBAA88,
            confidence: 93.1,
            peaks: [
                { pos: 430,  height: 0.30, fwhm: 28 },  // PO4 v2
                { pos: 590,  height: 0.25, fwhm: 32 },  // PO4 v4
                { pos: 960,  height: 1.00, fwhm: 22 },  // PO4 v1 (broader than fresh bone)
                { pos: 1040, height: 0.40, fwhm: 28 },  // PO4 v3
                { pos: 1085, height: 0.35, fwhm: 26 },  // calcite infiltration
                { pos: 1640, height: 0.08, fwhm: 60 },  // amide I — heavily reduced in fossil
            ],
        },
        fossil_silicified: {
            name: 'SiO\u2082  Chalcedony / Chert',
            subname: 'Silicified Fossil',
            color: 0xAABBCC,
            confidence: 91.4,
            peaks: [
                { pos: 207,  height: 0.32, fwhm: 20 },
                { pos: 464,  height: 1.00, fwhm: 14 },  // quartz main band
                { pos: 697,  height: 0.18, fwhm: 32 },
                { pos: 808,  height: 0.30, fwhm: 20 },
                { pos: 1085, height: 0.12, fwhm: 40 },  // trace carbonate
            ],
        },
        fossil_pyrite: {
            name: 'FeS\u2082  Iron Disulfide',
            subname: 'Pyritized Fossil',
            color: 0xCCBB44,
            confidence: 98.5,
            peaks: [
                { pos: 343,  height: 1.00, fwhm: 12 },  // S-S stretch (Ag mode)
                { pos: 379,  height: 0.65, fwhm: 10 },  // Eg libration mode
                { pos: 430,  height: 0.45, fwhm: 14 },  // Tg mode
            ],
        },
        fossil_calcite: {
            name: 'CaCO\u2083  Diagenetic Calcite',
            subname: 'Calcified Shell / Coral',
            color: 0xDDCCBB,
            confidence: 96.0,
            peaks: [
                { pos: 156,  height: 0.22, fwhm: 18 },
                { pos: 282,  height: 0.38, fwhm: 20 },
                { pos: 713,  height: 0.48, fwhm: 24 },
                { pos: 1085, height: 1.00, fwhm: 14 },  // CO3 v1
                { pos: 1435, height: 0.10, fwhm: 30 },
            ],
        },
    };

    const STATUE_MATERIALS   = ['marble', 'granite', 'bronze', 'limestone', 'onyx',
                                 'obsidian', 'jade', 'quartz', 'sandstone', 'basalt',
                                 'alabaster', 'clay', 'gold', 'silver', 'copper', 'iron',
                                 'steel', 'ivory', 'ebony', 'bamboo'];
    const PAINTING_MATERIALS = ['lapis', 'vermillion', 'malachite', 'lead_white',
                                 'ultramarine', 'prussian_blue', 'cobalt_blue',
                                 'burnt_sienna', 'azurite', 'viridian', 'charcoal'];
    const LIBRARY_MATERIALS  = ['wood', 'paper', 'ebony', 'bamboo'];
    const FOSSIL_MATERIALS   = ['amber', 'fossil_bone', 'fossil_silicified', 'fossil_pyrite', 'fossil_calcite'];
    // Fallback pool for any unrecognised event (surface/environmental scan)
    const SURFACE_MATERIALS  = ['marble', 'granite', 'limestone', 'onyx', 'sandstone', 'clay', 'wood'];

    // =========================================================
    // UTILITIES
    // =========================================================

    function getEventInFront() {
        const player = $gamePlayer;
        const dir = player.direction();
        const dx = dir === 6 ? 1 : dir === 4 ? -1 : 0;
        const dy = dir === 2 ? 1 : dir === 8 ? -1 : 0;
        const events = $gameMap.eventsXy(player.x + dx, player.y + dy);
        return events[0] || null;
    }

    function seededRNG(seed) {
        let s = (seed >>> 0) || 1;
        return () => {
            s ^= s << 13; s >>>= 0;
            s ^= s >> 17;
            s ^= s << 5;  s >>>= 0;
            return s / 4294967296;
        };
    }

    // Check if any page of an event calls a given plugin command (MZ code 357)
    function eventCallsCommand(evData, commandName) {
        for (const page of (evData.pages || [])) {
            for (const cmd of (page.list || [])) {
                if (cmd.code === 357 && cmd.parameters[1] === commandName) return true;
            }
        }
        return false;
    }

    function getMaterialForEvent(ev) {
        if (!ev) return null;
        const data = ev.event();
        const name = (data.name || '').toLowerCase();
        const note = (data.note || '');

        // Explicit tag takes priority
        const tagged = note.match(/<RamanMaterial:([^>]+)>/i);
        if (tagged && MATERIAL_DB[tagged[1].toLowerCase()]) {
            return { materialKey: tagged[1].toLowerCase(), objectType: 'tagged' };
        }

        const rng = seededRNG(($gameMap.mapId() * 73856093) ^ (ev.x * 19349663) ^ (ev.y * 83492791));

        // Command-based detection: check what plugin commands the event calls
        const callsFossil   = eventCallsCommand(data, 'ShowFossilDescription');
        const callsStatue   = eventCallsCommand(data, 'ShowStatueDescription');
        const callsPainting = eventCallsCommand(data, 'ShowPaintingDescription');
        const callsBook     = eventCallsCommand(data, 'ShowRandomBook');

        if (callsFossil)   return { materialKey: FOSSIL_MATERIALS[  Math.floor(rng() * FOSSIL_MATERIALS.length)],   objectType: 'fossil'   };
        if (callsStatue)   return { materialKey: STATUE_MATERIALS[  Math.floor(rng() * STATUE_MATERIALS.length)],   objectType: 'statue'   };
        if (callsPainting) return { materialKey: PAINTING_MATERIALS[Math.floor(rng() * PAINTING_MATERIALS.length)], objectType: 'painting' };
        if (callsBook)     return { materialKey: LIBRARY_MATERIALS[  Math.floor(rng() * LIBRARY_MATERIALS.length)],  objectType: 'library'  };

        // Name/note keyword fallback
        const isFossil   = /fossil|amber|dinosaur|dino|bone|trilobit|ammonit|mammoth|specimen|paleo|cretaceous|jurassic|prehistoric/i.test(name) ||
                           /fossil|amber|dinosaur|bone/i.test(note);
        const isStatue   = /statue|sculpt|figure|bust|idol|carv/i.test(name)   || /statue|sculpt/i.test(note);
        const isPainting = /paint|picture|portrait|canvas|artwork|fresco/i.test(name) || /paint/i.test(note);
        const isLibrary  = /book|shelf|librar|tome|scroll/i.test(name)          || /book|librar/i.test(note);

        if (isFossil)   return { materialKey: FOSSIL_MATERIALS[  Math.floor(rng() * FOSSIL_MATERIALS.length)],   objectType: 'fossil'   };
        if (isStatue)   return { materialKey: STATUE_MATERIALS[  Math.floor(rng() * STATUE_MATERIALS.length)],   objectType: 'statue'   };
        if (isPainting) return { materialKey: PAINTING_MATERIALS[Math.floor(rng() * PAINTING_MATERIALS.length)], objectType: 'painting' };
        if (isLibrary)  return { materialKey: LIBRARY_MATERIALS[ Math.floor(rng() * LIBRARY_MATERIALS.length)],  objectType: 'library'  };

        console.log('[Raman] No keyword match — falling back to surface scan for event:', name);
        return { materialKey: SURFACE_MATERIALS[Math.floor(rng() * SURFACE_MATERIALS.length)], objectType: 'surface' };
    }

    function gaussian(x, center, height, fwhm) {
        const sigma = fwhm / (2 * Math.sqrt(2 * Math.LN2));
        return height * Math.exp(-0.5 * ((x - center) / sigma) ** 2);
    }

    function generateSpectrum(material, nPts, rng) {
        const MIN = 100, MAX = 3500;
        return Array.from({ length: nPts }, (_, i) => {
            const shift = MIN + (MAX - MIN) * (i / (nPts - 1));
            let y = material.peaks.reduce((acc, p) => acc + gaussian(shift, p.pos, p.height, p.fwhm), 0);
            y += (rng() - 0.5) * 0.035;                            // shot noise
            y += 0.018 * Math.exp(-(((shift - 1800) / 1300) ** 2)); // fluorescence baseline
            return { shift, y: Math.max(0, Math.min(1.15, y)) };
        });
    }

    // =========================================================
    // PIXI RAMAN DISPLAY
    // States: 'scan' → 'reveal' → 'done'
    // =========================================================

    class RamanDisplay {
        constructor(materialKey, objectType, evName) {
            this.mat        = MATERIAL_DB[materialKey];
            this.objectType = objectType;
            this.evName     = (evName || 'Unknown Object').toUpperCase();
            this.closed     = false;
            this.state      = 'scan';
            this.frame      = 0;
            this.scanPos    = 0;  // 0..1
            this.revealPos  = 0;  // 0..1

            const rng = seededRNG(materialKey.split('').reduce((a, c) => a * 31 + c.charCodeAt(0), 7));
            this.spectrum = generateSpectrum(this.mat, 500, rng);

            // Pre-create reusable styles
            this._stylePeak = new PIXI.TextStyle({ fontFamily: 'monospace', fontSize: 9, fill: 0xFFFF55 });

            this.container = new PIXI.Container();
            this._buildUI();
        }

        // ---- UI construction ----

        _buildUI() {
            const W = Graphics.width, H = Graphics.height;

            const overlay = new PIXI.Graphics();
            overlay.beginFill(0x000000, 0.72).drawRect(0, 0, W, H).endFill();
            this.container.addChild(overlay);

            this.pW = Math.min(730, W * 0.90);
            this.pH = Math.min(510, H * 0.84);
            this.pX = (W - this.pW) / 2;
            this.pY = (H - this.pH) / 2;

            // Panel body
            const panel = new PIXI.Graphics();
            panel.lineStyle(1, 0x005588, 1)
                 .beginFill(0x04101E, 0.99)
                 .drawRoundedRect(this.pX, this.pY, this.pW, this.pH, 6)
                 .endFill();
            panel.lineStyle(1, 0x0088BB, 0.55)
                 .drawRoundedRect(this.pX + 3, this.pY + 3, this.pW - 6, this.pH - 6, 5);
            this.container.addChild(panel);

            // Title bar
            const tb = new PIXI.Graphics();
            tb.beginFill(0x071828).drawRect(this.pX + 4, this.pY + 4, this.pW - 8, 34).endFill();
            this.container.addChild(tb);

            this._addCenteredText(
                '\u25C8 RAMAN SPECTROSCOPY ANALYZER  v2.4 \u25C8',
                12, 0x00CCFF, this.pY + 11, 3
            );

            this._addText(
                `TARGET: ${this.evName}   TYPE: ${this.objectType.toUpperCase()}   LASER: 532nm CW`,
                10, 0x6699AA, this.pX + 12, this.pY + 46
            );

            // Graph area
            this.gL = this.pX + 66;
            this.gT = this.pY + 66;
            this.gW = this.pW - 84;
            this.gH = this.pH - 136;
            this.gB = this.gT + this.gH;
            this.gR = this.gL + this.gW;

            const gbg = new PIXI.Graphics();
            gbg.beginFill(0x010812).drawRect(this.gL, this.gT, this.gW, this.gH).endFill();
            this.container.addChild(gbg);

            this._drawGrid();
            this._drawAxes();
            this._drawAxisLabels();

            // Animation layers
            this.layerScan     = new PIXI.Container(); this.container.addChild(this.layerScan);
            this.layerSpectrum = new PIXI.Container(); this.container.addChild(this.layerSpectrum);
            this.layerPeaks    = new PIXI.Container(); this.container.addChild(this.layerPeaks);
            this.layerInfo     = new PIXI.Container(); this.container.addChild(this.layerInfo);
            this.layerInfo.visible = false;

            this._buildInfoPanel();

            // Status bar
            const statusY = this.pY + this.pH - 46;
            const sbar = new PIXI.Graphics();
            sbar.beginFill(0x020E1C).drawRect(this.pX + 4, statusY, this.pW - 8, 26).endFill();
            this.container.addChild(sbar);

            this.statusTxt = this._addText('INITIALIZING LASER...', 10, 0x00FF88, this.pX + 10, statusY + 6);

            this._addCenteredText('[OK / CANCEL / CLICK  TO CLOSE]', 9, 0x334455, this.pY + this.pH - 18);
        }

        _addText(str, size, fill, x, y, letterSpacing = 0) {
            const t = new PIXI.Text(str, new PIXI.TextStyle({
                fontFamily: '"Courier New", Courier, monospace',
                fontSize: size, fill, letterSpacing,
            }));
            t.x = x; t.y = y;
            this.container.addChild(t);
            return t;
        }

        _addCenteredText(str, size, fill, y, letterSpacing = 0) {
            const t = new PIXI.Text(str, new PIXI.TextStyle({
                fontFamily: '"Courier New", Courier, monospace',
                fontSize: size, fill, letterSpacing,
            }));
            t.x = this.pX + (this.pW - t.width) / 2;
            t.y = y;
            this.container.addChild(t);
            return t;
        }

        _drawGrid() {
            const g = new PIXI.Graphics();
            for (const s of [500, 1000, 1500, 2000, 2500, 3000]) {
                g.lineStyle(1, 0x0A2540, 0.9)
                 .moveTo(this._shiftToX(s), this.gT)
                 .lineTo(this._shiftToX(s), this.gB);
            }
            for (let i = 0; i <= 4; i++) {
                const py = this.gT + (1 - i / 4) * this.gH;
                g.lineStyle(1, 0x0A2540, 0.9).moveTo(this.gL, py).lineTo(this.gR, py);
            }
            this.container.addChild(g);
        }

        _drawAxes() {
            const g = new PIXI.Graphics();
            g.lineStyle(1.5, 0x1A6090)
             .moveTo(this.gL, this.gT).lineTo(this.gL, this.gB)
             .moveTo(this.gL, this.gB).lineTo(this.gR, this.gB);
            this.container.addChild(g);
        }

        _drawAxisLabels() {
            const s9  = new PIXI.TextStyle({ fontFamily: 'monospace', fontSize: 9,  fill: 0x446688 });
            const s10 = new PIXI.TextStyle({ fontFamily: 'monospace', fontSize: 10, fill: 0x4499BB });

            // X tick labels
            for (const v of [500, 1000, 1500, 2000, 2500, 3000, 3500]) {
                const t = new PIXI.Text(v, s9);
                t.x = this._shiftToX(v) - t.width / 2;
                t.y = this.gB + 5;
                this.container.addChild(t);
            }
            // X axis title
            const xt = new PIXI.Text('Raman Shift  (cm\u207B\u00B9)', s10);
            xt.x = this.gL + (this.gW - xt.width) / 2;
            xt.y = this.gB + 20;
            this.container.addChild(xt);

            // Y tick labels
            for (let i = 0; i <= 4; i++) {
                const pct = i * 25;
                const t = new PIXI.Text(pct + '%', s9);
                const py = this.gT + (1 - i / 4) * this.gH;
                t.x = this.gL - t.width - 5;
                t.y = py - t.height / 2;
                this.container.addChild(t);
            }
            // Y axis title (rotated)
            const yt = new PIXI.Text('Intensity', s10);
            yt.rotation = -Math.PI / 2;
            yt.x = this.pX + 10;
            yt.y = this.gT + this.gH / 2 + yt.width / 2;
            this.container.addChild(yt);
        }

        _buildInfoPanel() {
            const y0 = this.pY + this.pH - 44;

            const s1 = new PIXI.TextStyle({ fontFamily: 'monospace', fontSize: 11, fill: 0xFFDD00, fontWeight: 'bold' });
            const s2 = new PIXI.TextStyle({ fontFamily: 'monospace', fontSize: 10, fill: 0xAADDFF });

            const t1 = new PIXI.Text('\u25A0 MATERIAL IDENTIFIED:', s1);
            t1.x = this.gL; t1.y = y0;
            this.layerInfo.addChild(t1);

            const t2 = new PIXI.Text(
                `   ${this.mat.name}   [${this.mat.subname}]   MATCH: ${this.mat.confidence}%`,
                s2
            );
            t2.x = this.gL; t2.y = y0 + 16;
            this.layerInfo.addChild(t2);

            // Large material name label inside the graph area (top-right)
            const sName = new PIXI.TextStyle({
                fontFamily: 'monospace', fontSize: 15,
                fill: this.mat.color, fontWeight: 'bold', letterSpacing: 2,
            });
            const tName = new PIXI.Text(this.mat.subname.toUpperCase(), sName);
            tName.x = this.gR - tName.width - 8;
            tName.y = this.gT + 6;
            this.layerInfo.addChild(tName);

            // Formula below it
            const sForm = new PIXI.TextStyle({ fontFamily: 'monospace', fontSize: 10, fill: this.mat.color, alpha: 0.75 });
            const tForm = new PIXI.Text(this.mat.name, sForm);
            tForm.x = this.gR - tForm.width - 8;
            tForm.y = this.gT + 24;
            this.layerInfo.addChild(tForm);
        }

        // ---- Coordinate helpers ----

        _shiftToX(shift) { return this.gL + (shift - 100) / 3400 * this.gW; }
        _intensityToY(v) { return this.gB - v * this.gH; }

        // ---- Per-frame update ----

        update(delta) {
            if (this.closed) return;
            this.frame += delta;

            if (this.state === 'scan') {
                this.scanPos = Math.min(1, this.frame / 90);
                this._renderScan();
                if (this.scanPos >= 1) {
                    this.state = 'reveal';
                    this.frame = 0;
                    this.layerScan.visible = false;
                    this.statusTxt.text = 'ANALYZING SPECTRAL SIGNATURE...';
                }
            } else if (this.state === 'reveal') {
                this.revealPos = Math.min(1, this.frame / 110);
                this._renderReveal();
                if (this.revealPos >= 1) {
                    this.state = 'done';
                    this.statusTxt.text =
                        `\u2588 SCAN COMPLETE \u2014 532nm CW LASER  |  RES: 2 cm\u207B\u00B9  |  SNR: 84 dB`;
                    this.layerInfo.visible = true;
                }
            }
        }

        _renderScan() {
            this.layerScan.removeChildren();
            const nPts   = this.spectrum.length;
            const cutIdx = Math.max(2, Math.floor(this.scanPos * nPts));
            const sub    = this.spectrum.slice(0, cutIdx);

            // Rough noisy preview behind the laser
            const rough = new PIXI.Graphics();
            rough.lineStyle(1, 0x005522, 0.55);
            sub.forEach((pt, i) => {
                const px = this._shiftToX(pt.shift);
                const py = this._intensityToY(pt.y * 0.9);
                if (i === 0) rough.moveTo(px, py); else rough.lineTo(px, py);
            });
            this.layerScan.addChild(rough);

            // Laser scan line
            const scanX = this._shiftToX(sub[sub.length - 1].shift);
            const line  = new PIXI.Graphics();
            // Glow halo
            line.lineStyle(14, 0x00FF66, 0.10).moveTo(scanX, this.gT).lineTo(scanX, this.gB);
            // Core beam
            line.lineStyle(2,  0x00FF66, 1.00).moveTo(scanX, this.gT).lineTo(scanX, this.gB);
            this.layerScan.addChild(line);

            const shift = Math.round(sub[sub.length - 1].shift);
            const dots  = '.'.repeat(Math.floor(this.frame / 8) % 4);
            this.statusTxt.text = `LASER SCANNING${dots}   [\u03BD = ${shift} cm\u207B\u00B9]`;
        }

        _renderReveal() {
            this.layerSpectrum.removeChildren();
            this.layerPeaks.removeChildren();

            const nPts   = this.spectrum.length;
            const cutIdx = Math.max(2, Math.floor(this.revealPos * nPts));
            const sub    = this.spectrum.slice(0, cutIdx);

            // Glow layer
            const glow = new PIXI.Graphics();
            glow.lineStyle(4, this.mat.color, 0.18);
            sub.forEach((pt, i) => {
                const px = this._shiftToX(pt.shift);
                const py = this._intensityToY(pt.y);
                if (i === 0) glow.moveTo(px, py); else glow.lineTo(px, py);
            });
            this.layerSpectrum.addChild(glow);

            // Main spectrum line
            const line = new PIXI.Graphics();
            line.lineStyle(1.5, this.mat.color, 0.95);
            sub.forEach((pt, i) => {
                const px = this._shiftToX(pt.shift);
                const py = this._intensityToY(pt.y);
                if (i === 0) line.moveTo(px, py); else line.lineTo(px, py);
            });
            this.layerSpectrum.addChild(line);

            // Peak annotations (appear as the reveal line passes each peak)
            const currentShift = sub[sub.length - 1].shift;
            for (const pk of this.mat.peaks) {
                if (pk.height < 0.22 || pk.pos > currentShift) continue;
                const px = this._shiftToX(pk.pos);
                const py = this._intensityToY(pk.height);

                const tick = new PIXI.Graphics();
                tick.lineStyle(1, 0xFFFF55, 0.75).moveTo(px, py - 2).lineTo(px, py - 18);
                this.layerPeaks.addChild(tick);

                const lbl = new PIXI.Text(String(pk.pos), this._stylePeak);
                lbl.x = px - lbl.width / 2;
                lbl.y = py - 30;
                this.layerPeaks.addChild(lbl);
            }

            const dots = '.'.repeat(Math.floor(this.frame / 10) % 4);
            this.statusTxt.text = `RENDERING SPECTRUM${dots}`;
        }

        // ---- Lifecycle ----

        close() {
            if (this.closed) return;
            this.closed = true;
            console.log('[Raman] RamanDisplay.close() called');
        }
    }

    // =========================================================
    // SCENE
    // Proper MZ scene so Esc works and the map is paused cleanly
    // =========================================================

    class Scene_RamanScan extends Scene_Base {
        create() {
            super.create();
            console.log('[Raman] Scene_RamanScan.create()');
            this._display = window._ramanDisplay;

            // Solid background so the frozen map doesn't show through
            const bg = new PIXI.Graphics();
            bg.beginFill(0x000000, 1).drawRect(0, 0, Graphics.width, Graphics.height).endFill();
            this.addChild(bg);

            this.addChild(this._display.container);
            console.log('[Raman] Scene children after setup:', this.children.length);
        }

        update() {
            super.update();
            if (!this._display) return;
            this._display.update(1);

            if (Input.isTriggered('cancel') || Input.isTriggered('ok') ||
                TouchInput.isCancelled() || TouchInput.isTriggered()) {
                console.log('[Raman] Scene_RamanScan: close input detected');
                this._display.close();
                this.popScene();
            }
        }

        terminate() {
            super.terminate();
            console.log('[Raman] Scene_RamanScan.terminate()');
            if (this._display) this._display.closed = true;
        }
    }

    // =========================================================
    // INTERPRETER WAIT HOOK
    // Blocks the event until the display is closed
    // =========================================================

    const _origUpdateWaitMode = Game_Interpreter.prototype.updateWaitMode;
    Game_Interpreter.prototype.updateWaitMode = function () {
        if (this._waitMode === 'ramanScan') {
            const d = window._ramanDisplay;
            if (d && !d.closed) return true;
            window._ramanDisplay = null;
            return false;
        }
        return _origUpdateWaitMode.call(this);
    };

    // =========================================================
    // PLUGIN COMMAND
    // =========================================================

    PluginManager.registerCommand(pluginName, 'ScanFront', function () {
        console.log('[Raman] ScanFront command triggered');
        console.log('[Raman] Player dir:', $gamePlayer.direction(), '| x:', $gamePlayer.x, 'y:', $gamePlayer.y);

        const ev = getEventInFront();
        console.log('[Raman] Event in front:', ev ? `id=${ev.eventId()} name="${ev.event().name}" x=${ev.x} y=${ev.y}` : 'NONE');

        const result = getMaterialForEvent(ev);
        console.log('[Raman] getMaterialForEvent result:', result);

        if (!result) {
            console.log('[Raman] No scannable material found — showing message');
            window.skipLocalization = true;
            $gameMessage.add('\\C[8][ RAMAN SCANNER ]\\C[0]');
            $gameMessage.add('No spectrally active material detected in scan area.');
            $gameMessage.add('Target must be a statue, painting, or library object within 1m.');
            window.skipLocalization = false;
            return;
        }

        console.log('[Raman] Creating display for material:', result.materialKey, '| type:', result.objectType);
        console.log('[Raman] SceneManager._scene:', SceneManager._scene);
        console.log('[Raman] Graphics.width/height:', Graphics.width, Graphics.height);

        const display = new RamanDisplay(
            result.materialKey,
            result.objectType,
            ev ? ev.event().name : 'Unknown'
        );
        console.log('[Raman] RamanDisplay constructed OK');
        window._ramanDisplay = display;
        console.log('[Raman] Pushing Scene_RamanScan...');
        SceneManager.push(Scene_RamanScan);
        this.setWaitMode('ramanScan');
        console.log('[Raman] waitMode set to ramanScan');
    });

})();

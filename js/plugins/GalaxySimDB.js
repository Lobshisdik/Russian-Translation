(() => {
  // define your data
  const GALAXY_TYPE_SPIRAL = "spiral";
  const GALAXY_TYPE_BARRED_SPIRAL = "barred_spiral";
  const GALAXY_TYPE_ELLIPTICAL = "elliptical";
  const GALAXY_TYPE_IRREGULAR = "irregular";
  const GALAXY_TYPE_DWARF = "dwarf";
  const GALAXY_TYPE_DWARF_SPHEROIDAL = "dwarf_spheroidal";
  const WESTERN_CONSTELLATIONS = {
    // Northern Hemisphere Constellations
    andromeda: {
      name: "Andromeda",
      center: { x: 200, y: 400 },
      stars: [
        { x: 150, y: 380, name: "Alpheratz", magnitude: 2.06 },
        { x: 180, y: 390, name: "Mirach", magnitude: 2.05 },
        { x: 210, y: 400, name: "Almach", magnitude: 2.1 },
        { x: 240, y: 410, name: "Delta And", magnitude: 3.27 },
        { x: 170, y: 420, name: "51 And", magnitude: 3.57 },
        { x: 190, y: 370, name: "Mu And", magnitude: 3.87 },
      ],
      lines: [
        [0, 1],
        [1, 2],
        [2, 3],
        [1, 4],
        [1, 5],
      ],
    },

    aquarius: {
      zodiac: true,

      name: "Aquarius",
      center: { x: 2200, y: 1100 },
      stars: [
        { x: 2180, y: 1080, name: "Sadalsuud", magnitude: 2.87 },
        { x: 2200, y: 1090, name: "Sadalmelik", magnitude: 2.96 },
        { x: 2220, y: 1100, name: "Sadachbia", magnitude: 3.84 },
        { x: 2240, y: 1110, name: "Skat", magnitude: 3.27 },
        { x: 2160, y: 1120, name: "Albali", magnitude: 3.77 },
        { x: 2190, y: 1130, name: "Ancha", magnitude: 4.16 },
      ],
      lines: [
        [0, 1],
        [1, 2],
        [2, 3],
        [1, 4],
        [4, 5],
      ],
    },

    aquila: {
      name: "Aquila",
      center: { x: 1900, y: 900 },
      stars: [
        { x: 1900, y: 900, name: "Altair", magnitude: 0.77 },
        { x: 1880, y: 890, name: "Alshain", magnitude: 3.71 },
        { x: 1920, y: 890, name: "Tarazed", magnitude: 2.72 },
        { x: 1870, y: 920, name: "Theta Aql", magnitude: 3.23 },
        { x: 1930, y: 920, name: "Delta Aql", magnitude: 3.36 },
        { x: 1900, y: 870, name: "Lambda Aql", magnitude: 3.44 },
      ],
      lines: [
        [0, 1],
        [0, 2],
        [0, 3],
        [0, 4],
        [0, 5],
      ],
    },

    aries: {
      name: "Aries",
      zodiac: true,
      center: { x: 300, y: 500 },
      stars: [
        { x: 280, y: 490, name: "Hamal", magnitude: 2.0 },
        { x: 300, y: 500, name: "Sheratan", magnitude: 2.64 },
        { x: 320, y: 510, name: "Mesarthim", magnitude: 3.86 },
        { x: 310, y: 480, name: "41 Ari", magnitude: 3.63 },
      ],
      lines: [
        [0, 1],
        [1, 2],
        [0, 3],
      ],
    },

    auriga: {
      name: "Auriga",
      center: { x: 600, y: 400 },
      stars: [
        { x: 600, y: 380, name: "Capella", magnitude: 0.08 },
        { x: 580, y: 400, name: "Menkalinan", magnitude: 1.9 },
        { x: 620, y: 410, name: "Mahasim", magnitude: 2.62 },
        { x: 630, y: 390, name: "Hassaleh", magnitude: 2.69 },
        { x: 590, y: 420, name: "Almaaz", magnitude: 2.99 },
        { x: 570, y: 390, name: "Haedus I", magnitude: 3.75 },
      ],
      lines: [
        [0, 1],
        [1, 4],
        [4, 2],
        [2, 3],
        [3, 0],
        [0, 5],
      ],
    },

    bootes: {
      name: "Boötes",
      center: { x: 1400, y: 600 },
      stars: [
        { x: 1400, y: 580, name: "Arcturus", magnitude: -0.05 },
        { x: 1380, y: 600, name: "Izar", magnitude: 2.7 },
        { x: 1420, y: 610, name: "Muphrid", magnitude: 2.68 },
        { x: 1410, y: 560, name: "Seginus", magnitude: 3.03 },
        { x: 1390, y: 620, name: "Delta Boo", magnitude: 3.47 },
        { x: 1430, y: 590, name: "Nekkar", magnitude: 3.5 },
      ],
      lines: [
        [0, 1],
        [0, 2],
        [0, 3],
        [1, 4],
        [2, 5],
        [3, 5],
      ],
    },

    canis_major: {
      name: "Canis Major",
      center: { x: 700, y: 1200 },
      stars: [
        { x: 700, y: 1180, name: "Sirius", magnitude: -1.46 },
        { x: 680, y: 1200, name: "Adhara", magnitude: 1.5 },
        { x: 720, y: 1210, name: "Wezen", magnitude: 1.84 },
        { x: 710, y: 1160, name: "Mirzam", magnitude: 1.98 },
        { x: 690, y: 1220, name: "Aludra", magnitude: 2.45 },
        { x: 730, y: 1190, name: "Phurud", magnitude: 3.02 },
        { x: 670, y: 1190, name: "Furud", magnitude: 3.02 },
      ],
      lines: [
        [0, 1],
        [0, 3],
        [1, 2],
        [1, 4],
        [2, 5],
        [1, 6],
      ],
    },

    canis_minor: {
      name: "Canis Minor",
      center: { x: 800, y: 900 },
      stars: [
        { x: 800, y: 900, name: "Procyon", magnitude: 0.34 },
        { x: 820, y: 910, name: "Gomeisa", magnitude: 2.9 },
      ],
      lines: [[0, 1]],
    },

    capricornus: {
      zodiac: true,

      name: "Capricornus",
      center: { x: 2100, y: 1200 },
      stars: [
        { x: 2080, y: 1180, name: "Deneb Algedi", magnitude: 2.87 },
        { x: 2100, y: 1190, name: "Dabih", magnitude: 3.08 },
        { x: 2120, y: 1200, name: "Nashira", magnitude: 3.68 },
        { x: 2090, y: 1210, name: "Yen", magnitude: 4.14 },
        { x: 2110, y: 1220, name: "Dorsum", magnitude: 4.08 },
        { x: 2130, y: 1210, name: "Zeta Cap", magnitude: 3.74 },
      ],
      lines: [
        [0, 1],
        [1, 2],
        [2, 5],
        [5, 4],
        [4, 3],
        [3, 0],
      ],
    },

    cassiopeia: {
      name: "Cassiopeia",
      center: { x: 100, y: 300 },
      stars: [
        { x: 60, y: 290, name: "Schedar", magnitude: 2.23 },
        { x: 80, y: 300, name: "Caph", magnitude: 2.27 },
        { x: 100, y: 295, name: "Gamma Cas", magnitude: 2.47 },
        { x: 120, y: 305, name: "Ruchbah", magnitude: 2.68 },
        { x: 140, y: 310, name: "Segin", magnitude: 3.38 },
      ],
      lines: [
        [0, 1],
        [1, 2],
        [2, 3],
        [3, 4],
      ],
    },

    cepheus: {
      name: "Cepheus",
      center: { x: 2300, y: 300 },
      stars: [
        { x: 2280, y: 280, name: "Alderamin", magnitude: 2.51 },
        { x: 2300, y: 290, name: "Alfirk", magnitude: 3.23 },
        { x: 2320, y: 300, name: "Errai", magnitude: 3.21 },
        { x: 2310, y: 320, name: "Iota Cep", magnitude: 3.52 },
        { x: 2290, y: 310, name: "Zeta Cep", magnitude: 3.35 },
      ],
      lines: [
        [0, 1],
        [1, 2],
        [2, 3],
        [3, 4],
        [4, 0],
      ],
    },

    cetus: {
      name: "Cetus",
      center: { x: 200, y: 1000 },
      stars: [
        { x: 180, y: 980, name: "Diphda", magnitude: 2.04 },
        { x: 200, y: 990, name: "Menkar", magnitude: 2.53 },
        { x: 220, y: 1000, name: "Mira", magnitude: 3.04 },
        { x: 210, y: 1020, name: "Tau Cet", magnitude: 3.5 },
        { x: 190, y: 1010, name: "Theta Cet", magnitude: 3.6 },
        { x: 170, y: 1000, name: "Eta Cet", magnitude: 3.45 },
      ],
      lines: [
        [0, 1],
        [1, 2],
        [2, 3],
        [1, 4],
        [4, 5],
        [5, 0],
      ],
    },

    corona_borealis: {
      name: "Corona Borealis",
      center: { x: 1600, y: 600 },
      stars: [
        { x: 1600, y: 590, name: "Alphecca", magnitude: 2.23 },
        { x: 1580, y: 595, name: "Nusakan", magnitude: 3.68 },
        { x: 1620, y: 595, name: "Gamma CrB", magnitude: 3.84 },
        { x: 1590, y: 605, name: "Theta CrB", magnitude: 4.13 },
        { x: 1610, y: 605, name: "Delta CrB", magnitude: 4.59 },
        { x: 1570, y: 600, name: "Iota CrB", magnitude: 4.98 },
        { x: 1630, y: 600, name: "Epsilon CrB", magnitude: 4.15 },
      ],
      lines: [
        [0, 1],
        [0, 2],
        [1, 3],
        [2, 4],
        [3, 5],
        [4, 6],
      ],
    },

    corvus: {
      name: "Corvus",
      center: { x: 1200, y: 1200 },
      stars: [
        { x: 1180, y: 1180, name: "Gienah", magnitude: 2.59 },
        { x: 1200, y: 1190, name: "Kraz", magnitude: 2.65 },
        { x: 1220, y: 1200, name: "Algorab", magnitude: 2.95 },
        { x: 1210, y: 1220, name: "Minkar", magnitude: 3.0 },
        { x: 1190, y: 1210, name: "Alchiba", magnitude: 4.02 },
      ],
      lines: [
        [0, 1],
        [1, 2],
        [2, 3],
        [3, 4],
        [4, 0],
      ],
    },

    crater: {
      name: "Crater",
      center: { x: 1100, y: 1100 },
      stars: [
        { x: 1080, y: 1080, name: "Labrum", magnitude: 3.56 },
        { x: 1100, y: 1090, name: "Gamma Crt", magnitude: 4.08 },
        { x: 1120, y: 1100, name: "Zeta Crt", magnitude: 4.73 },
        { x: 1110, y: 1120, name: "Eta Crt", magnitude: 5.18 },
        { x: 1090, y: 1110, name: "Theta Crt", magnitude: 4.7 },
      ],
      lines: [
        [0, 1],
        [1, 2],
        [2, 3],
        [3, 4],
        [4, 0],
      ],
    },

    cygnus: {
      name: "Cygnus",
      center: { x: 2000, y: 400 },
      stars: [
        { x: 2000, y: 380, name: "Deneb", magnitude: 1.25 },
        { x: 1980, y: 400, name: "Albireo", magnitude: 3.18 },
        { x: 2020, y: 410, name: "Sadr", magnitude: 2.2 },
        { x: 2010, y: 390, name: "Gienah", magnitude: 2.48 },
        { x: 1990, y: 420, name: "Rukh", magnitude: 2.87 },
        { x: 2030, y: 430, name: "Zeta Cyg", magnitude: 3.2 },
      ],
      lines: [
        [0, 2],
        [2, 1],
        [2, 3],
        [2, 4],
        [2, 5],
      ],
    },

    delphinus: {
      name: "Delphinus",
      center: { x: 2050, y: 800 },
      stars: [
        { x: 2040, y: 790, name: "Sualocin", magnitude: 3.63 },
        { x: 2050, y: 795, name: "Rotanev", magnitude: 3.64 },
        { x: 2060, y: 800, name: "Gamma Del", magnitude: 3.9 },
        { x: 2055, y: 810, name: "Delta Del", magnitude: 4.43 },
        { x: 2045, y: 805, name: "Epsilon Del", magnitude: 4.03 },
      ],
      lines: [
        [0, 1],
        [1, 2],
        [2, 3],
        [3, 4],
        [4, 0],
      ],
    },

    draco: {
      name: "Draco",
      center: { x: 1700, y: 300 },
      stars: [
        { x: 1680, y: 280, name: "Eltanin", magnitude: 2.23 },
        { x: 1700, y: 290, name: "Rastaban", magnitude: 2.79 },
        { x: 1720, y: 300, name: "Thuban", magnitude: 3.65 },
        { x: 1710, y: 320, name: "Edasich", magnitude: 3.29 },
        { x: 1690, y: 310, name: "Eta Dra", magnitude: 2.74 },
        { x: 1730, y: 330, name: "Aldhibah", magnitude: 3.17 },
        { x: 1670, y: 300, name: "Kappa Dra", magnitude: 3.87 },
      ],
      lines: [
        [0, 1],
        [1, 2],
        [2, 3],
        [3, 4],
        [4, 0],
        [2, 5],
        [4, 6],
      ],
    },

    equuleus: {
      name: "Equuleus",
      center: { x: 2100, y: 900 },
      stars: [
        { x: 2090, y: 890, name: "Kitalpha", magnitude: 3.92 },
        { x: 2100, y: 895, name: "Delta Equ", magnitude: 4.49 },
        { x: 2110, y: 900, name: "Gamma Equ", magnitude: 4.7 },
        { x: 2105, y: 910, name: "Beta Equ", magnitude: 5.16 },
      ],
      lines: [
        [0, 1],
        [1, 2],
        [2, 3],
        [3, 0],
      ],
    },

    eridanus: {
      name: "Eridanus",
      center: { x: 400, y: 1300 },
      stars: [
        { x: 380, y: 1280, name: "Achernar", magnitude: 0.46 },
        { x: 400, y: 1290, name: "Cursa", magnitude: 2.79 },
        { x: 420, y: 1300, name: "Zaurak", magnitude: 2.95 },
        { x: 410, y: 1320, name: "Rana", magnitude: 3.54 },
        { x: 390, y: 1310, name: "Acamar", magnitude: 2.91 },
        { x: 430, y: 1330, name: "Azha", magnitude: 3.96 },
        { x: 370, y: 1300, name: "Zibal", magnitude: 4.8 },
      ],
      lines: [
        [0, 1],
        [1, 2],
        [2, 3],
        [3, 4],
        [4, 0],
        [3, 5],
        [4, 6],
      ],
    },

    gemini: {
      name: "Gemini",
      zodiac: true,
      center: { x: 700, y: 700 },
      stars: [
        { x: 680, y: 680, name: "Pollux", magnitude: 1.14 },
        { x: 700, y: 690, name: "Castor", magnitude: 1.57 },
        { x: 720, y: 700, name: "Alhena", magnitude: 1.93 },
        { x: 710, y: 720, name: "Wasat", magnitude: 3.53 },
        { x: 690, y: 710, name: "Mebsuta", magnitude: 3.06 },
        { x: 730, y: 710, name: "Mekbuda", magnitude: 3.79 },
        { x: 670, y: 700, name: "Propus", magnitude: 3.15 },
      ],
      lines: [
        [0, 1],
        [1, 2],
        [0, 4],
        [1, 3],
        [2, 5],
        [0, 6],
      ],
    },

    hercules: {
      name: "Hercules",
      center: { x: 1700, y: 700 },
      stars: [
        { x: 1680, y: 680, name: "Rasalgethi", magnitude: 3.48 },
        { x: 1700, y: 690, name: "Kornephoros", magnitude: 2.77 },
        { x: 1720, y: 700, name: "Zeta Her", magnitude: 2.89 },
        { x: 1710, y: 720, name: "Eta Her", magnitude: 3.53 },
        { x: 1690, y: 710, name: "Pi Her", magnitude: 3.15 },
        { x: 1730, y: 710, name: "Sarin", magnitude: 3.14 },
        { x: 1670, y: 700, name: "Mu Her", magnitude: 3.42 },
      ],
      lines: [
        [0, 1],
        [1, 2],
        [2, 3],
        [3, 4],
        [4, 1],
        [2, 5],
        [4, 6],
      ],
    },

    hydra: {
      name: "Hydra",
      center: { x: 1000, y: 1100 },
      stars: [
        { x: 980, y: 1080, name: "Alphard", magnitude: 1.98 },
        { x: 1000, y: 1090, name: "Gamma Hya", magnitude: 3.0 },
        { x: 1020, y: 1100, name: "Zeta Hya", magnitude: 3.11 },
        { x: 1010, y: 1120, name: "Nu Hya", magnitude: 3.11 },
        { x: 990, y: 1110, name: "Pi Hya", magnitude: 3.27 },
        { x: 1030, y: 1110, name: "Epsilon Hya", magnitude: 3.38 },
        { x: 970, y: 1100, name: "Sigma Hya", magnitude: 4.44 },
      ],
      lines: [
        [0, 1],
        [1, 2],
        [2, 3],
        [3, 4],
        [4, 0],
        [2, 5],
        [0, 6],
      ],
    },

    lacerta: {
      name: "Lacerta",
      center: { x: 2200, y: 450 },
      stars: [
        { x: 2180, y: 440, name: "Alpha Lac", magnitude: 3.77 },
        { x: 2200, y: 445, name: "Beta Lac", magnitude: 4.43 },
        { x: 2220, y: 450, name: "4 Lac", magnitude: 4.57 },
        { x: 2210, y: 460, name: "5 Lac", magnitude: 4.36 },
        { x: 2190, y: 455, name: "2 Lac", magnitude: 4.55 },
      ],
      lines: [
        [0, 1],
        [1, 2],
        [2, 3],
        [3, 4],
        [4, 0],
      ],
    },

    leo: {
      name: "Leo",
      zodiac: true,

      center: { x: 1000, y: 800 },
      stars: [
        { x: 980, y: 780, name: "Regulus", magnitude: 1.35 },
        { x: 1000, y: 790, name: "Denebola", magnitude: 2.14 },
        { x: 1020, y: 800, name: "Algieba", magnitude: 2.28 },
        { x: 1010, y: 820, name: "Zosma", magnitude: 2.56 },
        { x: 990, y: 810, name: "Ras Elased", magnitude: 2.98 },
        { x: 1030, y: 810, name: "Adhafera", magnitude: 3.44 },
        { x: 970, y: 800, name: "Eta Leo", magnitude: 3.52 },
      ],
      lines: [
        [0, 1],
        [1, 2],
        [2, 3],
        [3, 4],
        [4, 0],
        [2, 5],
        [4, 6],
      ],
    },

    leo_minor: {
      name: "Leo Minor",
      center: { x: 1050, y: 750 },
      stars: [
        { x: 1040, y: 740, name: "Praecipua", magnitude: 3.83 },
        { x: 1050, y: 745, name: "Beta LMi", magnitude: 4.21 },
        { x: 1060, y: 750, name: "21 LMi", magnitude: 4.48 },
        { x: 1055, y: 760, name: "10 LMi", magnitude: 4.55 },
      ],
      lines: [
        [0, 1],
        [1, 2],
        [2, 3],
      ],
    },

    lepus: {
      name: "Lepus",
      center: { x: 550, y: 1200 },
      stars: [
        { x: 540, y: 1180, name: "Arneb", magnitude: 2.58 },
        { x: 550, y: 1190, name: "Nihal", magnitude: 2.84 },
        { x: 560, y: 1200, name: "Epsilon Lep", magnitude: 3.19 },
        { x: 555, y: 1220, name: "Mu Lep", magnitude: 3.31 },
        { x: 545, y: 1210, name: "Zeta Lep", magnitude: 3.55 },
      ],
      lines: [
        [0, 1],
        [1, 2],
        [2, 3],
        [3, 4],
        [4, 0],
      ],
    },

    libra: {
      name: "Libra",
      zodiac: true,

      center: { x: 1500, y: 1000 },
      stars: [
        { x: 1480, y: 980, name: "Zubenelgenubi", magnitude: 2.61 },
        { x: 1500, y: 990, name: "Zubeneschamali", magnitude: 2.75 },
        { x: 1520, y: 1000, name: "Zubenelhakrabi", magnitude: 3.91 },
        { x: 1510, y: 1020, name: "Theta Lib", magnitude: 4.15 },
        { x: 1490, y: 1010, name: "Iota Lib", magnitude: 4.54 },
      ],
      lines: [
        [0, 1],
        [1, 2],
        [2, 3],
        [3, 4],
        [4, 0],
      ],
    },

    lynx: {
      name: "Lynx",
      center: { x: 900, y: 500 },
      stars: [
        { x: 880, y: 490, name: "Alpha Lyn", magnitude: 3.13 },
        { x: 900, y: 495, name: "38 Lyn", magnitude: 3.82 },
        { x: 920, y: 500, name: "31 Lyn", magnitude: 4.25 },
        { x: 910, y: 510, name: "21 Lyn", magnitude: 4.64 },
        { x: 890, y: 505, name: "15 Lyn", magnitude: 4.35 },
      ],
      lines: [
        [0, 1],
        [1, 2],
        [2, 3],
        [3, 4],
        [4, 0],
      ],
    },

    lyra: {
      name: "Lyra",
      center: { x: 1850, y: 500 },
      stars: [
        { x: 1850, y: 480, name: "Vega", magnitude: 0.03 },
        { x: 1835, y: 500, name: "Sheliak", magnitude: 3.45 },
        { x: 1865, y: 505, name: "Sulafat", magnitude: 3.24 },
        { x: 1855, y: 520, name: "Delta Lyr", magnitude: 4.3 },
        { x: 1845, y: 515, name: "Epsilon Lyr", magnitude: 4.67 },
      ],
      lines: [
        [0, 1],
        [0, 2],
        [1, 3],
        [2, 3],
        [1, 4],
      ],
    },

    monoceros: {
      name: "Monoceros",
      center: { x: 750, y: 1000 },
      stars: [
        { x: 740, y: 980, name: "Beta Mon", magnitude: 3.74 },
        { x: 750, y: 990, name: "Gamma Mon", magnitude: 3.98 },
        { x: 760, y: 1000, name: "Delta Mon", magnitude: 4.15 },
        { x: 755, y: 1020, name: "Epsilon Mon", magnitude: 4.44 },
        { x: 745, y: 1010, name: "Zeta Mon", magnitude: 4.34 },
      ],
      lines: [
        [0, 1],
        [1, 2],
        [2, 3],
        [3, 4],
        [4, 0],
      ],
    },

    ophiuchus: {
      name: "Ophiuchus",
      center: { x: 1700, y: 900 },
      stars: [
        { x: 1680, y: 880, name: "Rasalhague", magnitude: 2.08 },
        { x: 1700, y: 890, name: "Cebalrai", magnitude: 2.77 },
        { x: 1720, y: 900, name: "Yed Prior", magnitude: 2.74 },
        { x: 1710, y: 920, name: "Yed Posterior", magnitude: 3.24 },
        { x: 1690, y: 910, name: "Sabik", magnitude: 2.43 },
        { x: 1730, y: 910, name: "Marfik", magnitude: 3.54 },
      ],
      lines: [
        [0, 1],
        [1, 2],
        [2, 3],
        [3, 4],
        [4, 0],
        [2, 5],
      ],
    },

    orion: {
      name: "Orion",
      center: { x: 600, y: 1000 },
      stars: [
        { x: 580, y: 970, name: "Betelgeuse", magnitude: 0.42 },
        { x: 620, y: 970, name: "Bellatrix", magnitude: 1.64 },
        { x: 580, y: 1030, name: "Rigel", magnitude: 0.13 },
        { x: 620, y: 1030, name: "Saiph", magnitude: 2.06 },
        { x: 595, y: 1000, name: "Alnitak", magnitude: 1.77 },
        { x: 600, y: 1000, name: "Alnilam", magnitude: 1.7 },
        { x: 605, y: 1000, name: "Mintaka", magnitude: 2.23 },
      ],
      lines: [
        [0, 1],
        [2, 3],
        [0, 2],
        [1, 3],
        [4, 5],
        [5, 6],
        [0, 4],
        [1, 6],
        [2, 5],
        [3, 5],
      ],
    },

    pegasus: {
      name: "Pegasus",
      center: { x: 2300, y: 600 },
      stars: [
        { x: 2280, y: 580, name: "Enif", magnitude: 2.4 },
        { x: 2300, y: 590, name: "Scheat", magnitude: 2.42 },
        { x: 2320, y: 600, name: "Markab", magnitude: 2.49 },
        { x: 2310, y: 620, name: "Algenib", magnitude: 2.84 },
        { x: 2290, y: 610, name: "Homam", magnitude: 3.41 },
        { x: 2330, y: 610, name: "Matar", magnitude: 2.94 },
      ],
      lines: [
        [0, 1],
        [1, 2],
        [2, 3],
        [3, 4],
        [4, 1],
        [2, 5],
      ],
    },

    perseus: {
      name: "Perseus",
      center: { x: 350, y: 400 },
      stars: [
        { x: 340, y: 380, name: "Mirfak", magnitude: 1.8 },
        { x: 350, y: 390, name: "Algol", magnitude: 2.12 },
        { x: 360, y: 400, name: "Gamma Per", magnitude: 2.93 },
        { x: 355, y: 420, name: "Delta Per", magnitude: 3.01 },
        { x: 345, y: 410, name: "Epsilon Per", magnitude: 2.89 },
        { x: 365, y: 415, name: "Zeta Per", magnitude: 2.85 },
      ],
      lines: [
        [0, 1],
        [1, 2],
        [2, 3],
        [3, 4],
        [4, 0],
        [2, 5],
      ],
    },

    pisces: {
      name: "Pisces",
      zodiac: true,
      center: { x: 100, y: 900 },
      stars: [
        { x: 80, y: 880, name: "Alpherg", magnitude: 3.79 },
        { x: 100, y: 890, name: "Gamma Psc", magnitude: 3.69 },
        { x: 120, y: 900, name: "Kappa Psc", magnitude: 4.94 },
        { x: 110, y: 920, name: "Lambda Psc", magnitude: 4.5 },
        { x: 90, y: 910, name: "Iota Psc", magnitude: 4.13 },
        { x: 105, y: 895, name: "Omega Psc", magnitude: 4.01 },
      ],
      lines: [
        [0, 1],
        [1, 2],
        [2, 3],
        [3, 4],
        [4, 0],
        [1, 5],
      ],
    },

    piscis_austrinus: {
      name: "Piscis Austrinus",
      center: { x: 2200, y: 1300 },
      stars: [
        { x: 2200, y: 1280, name: "Fomalhaut", magnitude: 1.16 },
        { x: 2180, y: 1300, name: "Epsilon PsA", magnitude: 4.17 },
        { x: 2220, y: 1310, name: "Delta PsA", magnitude: 4.2 },
        { x: 2210, y: 1320, name: "Beta PsA", magnitude: 4.29 },
        { x: 2190, y: 1315, name: "Gamma PsA", magnitude: 4.46 },
      ],
      lines: [
        [0, 1],
        [0, 2],
        [1, 4],
        [2, 3],
        [3, 4],
      ],
    },

    sagitta: {
      name: "Sagitta",
      zodiac: true,
      center: { x: 1950, y: 800 },
      stars: [
        { x: 1940, y: 795, name: "Gamma Sge", magnitude: 3.47 },
        { x: 1950, y: 800, name: "Delta Sge", magnitude: 3.82 },
        { x: 1960, y: 805, name: "Alpha Sge", magnitude: 4.37 },
        { x: 1955, y: 790, name: "Beta Sge", magnitude: 4.37 },
      ],
      lines: [
        [0, 1],
        [1, 2],
        [0, 3],
        [2, 3],
      ],
    },

    sagittarius: {
      name: "Sagittarius",
      center: { x: 1900, y: 1200 },
      stars: [
        { x: 1880, y: 1180, name: "Kaus Australis", magnitude: 1.85 },
        { x: 1900, y: 1190, name: "Nunki", magnitude: 2.02 },
        { x: 1920, y: 1200, name: "Ascella", magnitude: 2.6 },
        { x: 1910, y: 1220, name: "Kaus Media", magnitude: 2.7 },
        { x: 1890, y: 1210, name: "Kaus Borealis", magnitude: 2.81 },
        { x: 1930, y: 1210, name: "Phi Sgr", magnitude: 3.17 },
        { x: 1870, y: 1200, name: "Alnasl", magnitude: 2.99 },
      ],
      lines: [
        [0, 1],
        [1, 2],
        [2, 3],
        [3, 4],
        [4, 0],
        [1, 5],
        [4, 6],
      ],
    },

    scorpius: {
      zodiac: true,
      name: "Scorpius",
      center: { x: 1600, y: 1200 },
      stars: [
        { x: 1600, y: 1180, name: "Antares", magnitude: 1.03 },
        { x: 1580, y: 1190, name: "Graffias", magnitude: 2.62 },
        { x: 1620, y: 1195, name: "Dschubba", magnitude: 2.32 },
        { x: 1610, y: 1210, name: "Sargas", magnitude: 1.63 },
        { x: 1590, y: 1220, name: "Shaula", magnitude: 1.63 },
        { x: 1630, y: 1215, name: "Lesath", magnitude: 2.69 },
        { x: 1570, y: 1205, name: "Wei", magnitude: 2.89 },
      ],
      lines: [
        [0, 1],
        [0, 2],
        [0, 3],
        [3, 4],
        [3, 5],
        [1, 6],
        [4, 6],
      ],
    },

    scutum: {
      name: "Scutum",
      center: { x: 1850, y: 1100 },
      stars: [
        { x: 1840, y: 1090, name: "Alpha Sct", magnitude: 3.85 },
        { x: 1850, y: 1095, name: "Beta Sct", magnitude: 4.22 },
        { x: 1860, y: 1100, name: "Gamma Sct", magnitude: 4.7 },
        { x: 1855, y: 1110, name: "Delta Sct", magnitude: 4.72 },
      ],
      lines: [
        [0, 1],
        [1, 2],
        [2, 3],
        [3, 0],
      ],
    },

    serpens: {
      name: "Serpens",
      zodiac: true,

      center: { x: 1550, y: 900 },
      stars: [
        { x: 1530, y: 880, name: "Unukalhai", magnitude: 2.65 },
        { x: 1550, y: 890, name: "Beta Ser", magnitude: 3.67 },
        { x: 1570, y: 900, name: "Gamma Ser", magnitude: 3.85 },
        { x: 1560, y: 920, name: "Delta Ser", magnitude: 4.23 },
        { x: 1540, y: 910, name: "Epsilon Ser", magnitude: 3.71 },
      ],
      lines: [
        [0, 1],
        [1, 2],
        [2, 3],
        [3, 4],
        [4, 0],
      ],
    },

    taurus: {
      name: "Taurus",
      zodiac: true,
      center: { x: 450, y: 600 },
      stars: [
        { x: 450, y: 580, name: "Aldebaran", magnitude: 0.85 },
        { x: 430, y: 600, name: "Elnath", magnitude: 1.68 },
        { x: 470, y: 610, name: "Alcyone", magnitude: 2.87 },
        { x: 460, y: 590, name: "Tianguan", magnitude: 3.0 },
        { x: 440, y: 620, name: "Hyadum I", magnitude: 3.54 },
        { x: 480, y: 615, name: "Atlas", magnitude: 3.63 },
      ],
      lines: [
        [0, 1],
        [0, 2],
        [0, 3],
        [1, 4],
        [2, 5],
      ],
    },

    triangulum: {
      name: "Triangulum",
      center: { x: 250, y: 350 },
      stars: [
        { x: 240, y: 340, name: "Beta Tri", magnitude: 3.0 },
        { x: 250, y: 350, name: "Alpha Tri", magnitude: 3.41 },
        { x: 260, y: 360, name: "Gamma Tri", magnitude: 4.01 },
      ],
      lines: [
        [0, 1],
        [1, 2],
        [2, 0],
      ],
    },

    ursa_major: {
      name: "Ursa Major",
      center: { x: 1200, y: 400 },
      stars: [
        { x: 1150, y: 390, name: "Dubhe", magnitude: 1.79 },
        { x: 1180, y: 395, name: "Merak", magnitude: 2.37 },
        { x: 1210, y: 400, name: "Phecda", magnitude: 2.44 },
        { x: 1240, y: 405, name: "Megrez", magnitude: 3.31 },
        { x: 1270, y: 410, name: "Alioth", magnitude: 1.77 },
        { x: 1300, y: 415, name: "Mizar", magnitude: 2.27 },
        { x: 1290, y: 380, name: "Alkaid", magnitude: 1.86 },
      ],
      lines: [
        [0, 1],
        [1, 2],
        [2, 3],
        [3, 4],
        [4, 5],
        [5, 6],
        [3, 6],
      ],
    },

    ursa_minor: {
      name: "Ursa Minor",
      center: { x: 1400, y: 200 },
      stars: [
        { x: 1400, y: 180, name: "Polaris", magnitude: 1.98 },
        { x: 1380, y: 195, name: "Kochab", magnitude: 2.08 },
        { x: 1420, y: 200, name: "Pherkad", magnitude: 3.05 },
        { x: 1410, y: 210, name: "Eta UMi", magnitude: 4.95 },
        { x: 1390, y: 205, name: "Zeta UMi", magnitude: 4.32 },
        { x: 1430, y: 190, name: "Delta UMi", magnitude: 4.36 },
        { x: 1385, y: 215, name: "Epsilon UMi", magnitude: 4.23 },
      ],
      lines: [
        [0, 1],
        [1, 2],
        [2, 3],
        [3, 4],
        [4, 1],
        [2, 5],
        [4, 6],
      ],
    },

    virgo: {
      name: "Virgo",
      zodiac: true,
      center: { x: 1300, y: 1000 },
      stars: [
        { x: 1300, y: 980, name: "Spica", magnitude: 0.97 },
        { x: 1280, y: 990, name: "Zavijava", magnitude: 3.61 },
        { x: 1320, y: 995, name: "Porrima", magnitude: 2.74 },
        { x: 1310, y: 1010, name: "Vindemiatrix", magnitude: 2.83 },
        { x: 1290, y: 1020, name: "Heze", magnitude: 3.37 },
        { x: 1330, y: 1005, name: "Zaniah", magnitude: 3.89 },
      ],
      lines: [
        [0, 1],
        [0, 2],
        [0, 3],
        [1, 4],
        [2, 5],
        [3, 4],
      ],
    },

    vulpecula: {
      name: "Vulpecula",
      center: { x: 2000, y: 600 },
      stars: [
        { x: 1990, y: 590, name: "Anser", magnitude: 4.44 },
        { x: 2000, y: 595, name: "23 Vul", magnitude: 4.52 },
        { x: 2010, y: 600, name: "31 Vul", magnitude: 4.59 },
        { x: 2005, y: 610, name: "32 Vul", magnitude: 5.01 },
      ],
      lines: [
        [0, 1],
        [1, 2],
        [2, 3],
      ],
    },

    // Southern Hemisphere Constellations
    antlia: {
      name: "Antlia",
      center: { x: 1000, y: 1400 },
      stars: [
        { x: 990, y: 1390, name: "Alpha Ant", magnitude: 4.25 },
        { x: 1000, y: 1395, name: "Epsilon Ant", magnitude: 4.51 },
        { x: 1010, y: 1400, name: "Iota Ant", magnitude: 4.6 },
        { x: 1005, y: 1410, name: "Theta Ant", magnitude: 4.79 },
      ],
      lines: [
        [0, 1],
        [1, 2],
        [2, 3],
      ],
    },

    apus: {
      name: "Apus",
      center: { x: 1600, y: 1600 },
      stars: [
        { x: 1590, y: 1590, name: "Alpha Aps", magnitude: 3.83 },
        { x: 1600, y: 1595, name: "Gamma Aps", magnitude: 3.89 },
        { x: 1610, y: 1600, name: "Beta Aps", magnitude: 4.24 },
        { x: 1605, y: 1610, name: "Delta Aps", magnitude: 4.68 },
      ],
      lines: [
        [0, 1],
        [1, 2],
        [2, 3],
        [3, 0],
      ],
    },

    ara: {
      name: "Ara",
      center: { x: 1700, y: 1500 },
      stars: [
        { x: 1680, y: 1480, name: "Alpha Ara", magnitude: 2.95 },
        { x: 1700, y: 1490, name: "Beta Ara", magnitude: 2.85 },
        { x: 1720, y: 1500, name: "Gamma Ara", magnitude: 3.34 },
        { x: 1710, y: 1520, name: "Zeta Ara", magnitude: 3.13 },
        { x: 1690, y: 1510, name: "Delta Ara", magnitude: 3.62 },
      ],
      lines: [
        [0, 1],
        [1, 2],
        [2, 3],
        [3, 4],
        [4, 0],
      ],
    },

    caelum: {
      name: "Caelum",
      center: { x: 500, y: 1400 },
      stars: [
        { x: 490, y: 1390, name: "Alpha Cae", magnitude: 4.45 },
        { x: 500, y: 1395, name: "Beta Cae", magnitude: 5.05 },
        { x: 510, y: 1400, name: "Gamma Cae", magnitude: 4.55 },
        { x: 505, y: 1410, name: "Delta Cae", magnitude: 5.07 },
      ],
      lines: [
        [0, 1],
        [1, 2],
        [2, 3],
      ],
    },

    camelopardalis: {
      name: "Camelopardalis",
      center: { x: 500, y: 200 },
      stars: [
        { x: 480, y: 180, name: "Beta Cam", magnitude: 4.03 },
        { x: 500, y: 190, name: "Alpha Cam", magnitude: 4.29 },
        { x: 520, y: 200, name: "Gamma Cam", magnitude: 4.63 },
        { x: 510, y: 220, name: "7 Cam", magnitude: 4.47 },
        { x: 490, y: 210, name: "BE Cam", magnitude: 4.39 },
      ],
      lines: [
        [0, 1],
        [1, 2],
        [2, 3],
        [3, 4],
        [4, 0],
      ],
    },

    cancer: {
      name: "Cancer",
      zodiac: true,

      center: { x: 850, y: 700 },
      stars: [
        { x: 830, y: 680, name: "Tarf", magnitude: 3.52 },
        { x: 850, y: 690, name: "Asellus Australis", magnitude: 3.94 },
        { x: 870, y: 700, name: "Asellus Borealis", magnitude: 4.67 },
        { x: 860, y: 720, name: "Acubens", magnitude: 4.25 },
        { x: 840, y: 710, name: "Iota Cnc", magnitude: 4.02 },
      ],
      lines: [
        [0, 1],
        [1, 2],
        [2, 3],
        [3, 4],
        [4, 0],
      ],
    },

    canes_venatici: {
      name: "Canes Venatici",
      center: { x: 1300, y: 500 },
      stars: [
        { x: 1300, y: 490, name: "Cor Caroli", magnitude: 2.9 },
        { x: 1320, y: 510, name: "Chara", magnitude: 4.26 },
      ],
      lines: [[0, 1]],
    },

    carina: {
      name: "Carina",
      center: { x: 900, y: 1600 },
      stars: [
        { x: 900, y: 1580, name: "Canopus", magnitude: -0.74 },
        { x: 880, y: 1590, name: "Miaplacidus", magnitude: 1.68 },
        { x: 920, y: 1595, name: "Avior", magnitude: 1.86 },
        { x: 910, y: 1610, name: "Aspidiske", magnitude: 2.25 },
        { x: 890, y: 1620, name: "Theta Car", magnitude: 2.76 },
      ],
      lines: [
        [0, 1],
        [0, 2],
        [1, 4],
        [2, 3],
        [3, 4],
      ],
    },

    centaurus: {
      name: "Centaurus",
      center: { x: 1300, y: 1500 },
      stars: [
        { x: 1280, y: 1480, name: "Alpha Centauri", magnitude: -0.27 },
        { x: 1300, y: 1490, name: "Hadar", magnitude: 0.61 },
        { x: 1320, y: 1500, name: "Menkent", magnitude: 2.06 },
        { x: 1310, y: 1520, name: "Gamma Cen", magnitude: 2.17 },
        { x: 1290, y: 1510, name: "Epsilon Cen", magnitude: 2.3 },
      ],
      lines: [
        [0, 1],
        [1, 2],
        [2, 3],
        [3, 4],
        [4, 0],
      ],
    },

    chamaeleon: {
      name: "Chamaeleon",
      center: { x: 1100, y: 1700 },
      stars: [
        { x: 1080, y: 1680, name: "Alpha Cha", magnitude: 4.07 },
        { x: 1100, y: 1690, name: "Gamma Cha", magnitude: 4.11 },
        { x: 1120, y: 1700, name: "Beta Cha", magnitude: 4.26 },
        { x: 1110, y: 1720, name: "Delta Cha", magnitude: 4.45 },
      ],
      lines: [
        [0, 1],
        [1, 2],
        [2, 3],
      ],
    },

    circinus: {
      name: "Circinus",
      center: { x: 1500, y: 1600 },
      stars: [
        { x: 1490, y: 1590, name: "Alpha Cir", magnitude: 3.19 },
        { x: 1500, y: 1595, name: "Beta Cir", magnitude: 4.07 },
        { x: 1510, y: 1600, name: "Gamma Cir", magnitude: 4.51 },
      ],
      lines: [
        [0, 1],
        [1, 2],
        [2, 0],
      ],
    },

    columba: {
      name: "Columba",
      center: { x: 600, y: 1350 },
      stars: [
        { x: 590, y: 1330, name: "Phact", magnitude: 2.6 },
        { x: 600, y: 1340, name: "Wazn", magnitude: 3.12 },
        { x: 610, y: 1350, name: "Gamma Col", magnitude: 4.36 },
        { x: 605, y: 1370, name: "Delta Col", magnitude: 3.85 },
        { x: 595, y: 1360, name: "Epsilon Col", magnitude: 3.87 },
      ],
      lines: [
        [0, 1],
        [1, 2],
        [2, 3],
        [3, 4],
        [4, 0],
      ],
    },

    coma_berenices: {
      name: "Coma Berenices",
      center: { x: 1250, y: 700 },
      stars: [
        { x: 1240, y: 690, name: "Diadem", magnitude: 4.26 },
        { x: 1250, y: 695, name: "Beta Com", magnitude: 4.26 },
        { x: 1260, y: 700, name: "Gamma Com", magnitude: 4.35 },
      ],
      lines: [
        [0, 1],
        [1, 2],
      ],
    },

    corona_australis: {
      name: "Corona Australis",
      center: { x: 1900, y: 1400 },
      stars: [
        { x: 1885, y: 1390, name: "Alphekka Meridiana", magnitude: 4.11 },
        { x: 1895, y: 1395, name: "Beta CrA", magnitude: 4.12 },
        { x: 1905, y: 1400, name: "Gamma CrA", magnitude: 4.21 },
        { x: 1910, y: 1410, name: "Delta CrA", magnitude: 4.59 },
        { x: 1900, y: 1415, name: "Theta CrA", magnitude: 4.62 },
        { x: 1890, y: 1410, name: "Zeta CrA", magnitude: 4.75 },
      ],
      lines: [
        [0, 1],
        [1, 2],
        [2, 3],
        [3, 4],
        [4, 5],
        [5, 0],
      ],
    },

    crux: {
      name: "Crux",
      center: { x: 1200, y: 1600 },
      stars: [
        { x: 1190, y: 1590, name: "Acrux", magnitude: 0.76 },
        { x: 1210, y: 1590, name: "Gacrux", magnitude: 1.64 },
        { x: 1200, y: 1610, name: "Becrux", magnitude: 1.25 },
        { x: 1200, y: 1580, name: "Delta Cru", magnitude: 2.8 },
        { x: 1205, y: 1600, name: "Epsilon Cru", magnitude: 3.58 },
      ],
      lines: [
        [0, 2],
        [1, 3],
        [2, 4],
      ],
    },

    dorado: {
      name: "Dorado",
      center: { x: 500, y: 1600 },
      stars: [
        { x: 490, y: 1580, name: "Alpha Dor", magnitude: 3.27 },
        { x: 500, y: 1590, name: "Beta Dor", magnitude: 3.46 },
        { x: 510, y: 1600, name: "Gamma Dor", magnitude: 4.25 },
        { x: 505, y: 1620, name: "Delta Dor", magnitude: 4.35 },
      ],
      lines: [
        [0, 1],
        [1, 2],
        [2, 3],
        [3, 0],
      ],
    },

    fornax: {
      name: "Fornax",
      center: { x: 300, y: 1300 },
      stars: [
        { x: 290, y: 1290, name: "Dalim", magnitude: 3.87 },
        { x: 300, y: 1295, name: "Beta For", magnitude: 4.46 },
        { x: 310, y: 1300, name: "Nu For", magnitude: 4.96 },
      ],
      lines: [
        [0, 1],
        [1, 2],
      ],
    },

    grus: {
      name: "Grus",
      center: { x: 2200, y: 1500 },
      stars: [
        { x: 2180, y: 1480, name: "Alnair", magnitude: 1.74 },
        { x: 2200, y: 1490, name: "Gruid", magnitude: 2.11 },
        { x: 2220, y: 1500, name: "Gamma Gru", magnitude: 3.01 },
        { x: 2210, y: 1520, name: "Delta Gru", magnitude: 3.97 },
        { x: 2190, y: 1510, name: "Epsilon Gru", magnitude: 3.51 },
      ],
      lines: [
        [0, 1],
        [1, 2],
        [2, 3],
        [3, 4],
        [4, 0],
      ],
    },

    horologium: {
      name: "Horologium",
      center: { x: 400, y: 1500 },
      stars: [
        { x: 390, y: 1490, name: "Alpha Hor", magnitude: 3.86 },
        { x: 400, y: 1495, name: "Beta Hor", magnitude: 4.98 },
        { x: 410, y: 1500, name: "Gamma Hor", magnitude: 5.35 },
        { x: 405, y: 1510, name: "Delta Hor", magnitude: 4.93 },
      ],
      lines: [
        [0, 1],
        [1, 2],
        [2, 3],
      ],
    },

    hydrus: {
      name: "Hydrus",
      center: { x: 200, y: 1700 },
      stars: [
        { x: 190, y: 1680, name: "Beta Hyi", magnitude: 2.8 },
        { x: 200, y: 1690, name: "Alpha Hyi", magnitude: 2.86 },
        { x: 210, y: 1700, name: "Gamma Hyi", magnitude: 3.24 },
      ],
      lines: [
        [0, 1],
        [1, 2],
        [2, 0],
      ],
    },

    indus: {
      name: "Indus",
      center: { x: 2100, y: 1600 },
      stars: [
        { x: 2090, y: 1590, name: "Persian", magnitude: 3.11 },
        { x: 2100, y: 1595, name: "Beta Ind", magnitude: 3.65 },
        { x: 2110, y: 1600, name: "Theta Ind", magnitude: 4.39 },
        { x: 2105, y: 1610, name: "Delta Ind", magnitude: 4.4 },
      ],
      lines: [
        [0, 1],
        [1, 2],
        [2, 3],
        [3, 0],
      ],
    },

    mensa: {
      name: "Mensa",
      center: { x: 600, y: 1700 },
      stars: [
        { x: 590, y: 1690, name: "Alpha Men", magnitude: 5.09 },
        { x: 600, y: 1695, name: "Gamma Men", magnitude: 5.18 },
        { x: 610, y: 1700, name: "Beta Men", magnitude: 5.31 },
      ],
      lines: [
        [0, 1],
        [1, 2],
      ],
    },

    microscopium: {
      name: "Microscopium",
      center: { x: 2100, y: 1350 },
      stars: [
        { x: 2090, y: 1340, name: "Gamma Mic", magnitude: 4.67 },
        { x: 2100, y: 1345, name: "Epsilon Mic", magnitude: 4.71 },
        { x: 2110, y: 1350, name: "Alpha Mic", magnitude: 4.88 },
        { x: 2105, y: 1360, name: "Theta Mic", magnitude: 4.82 },
      ],
      lines: [
        [0, 1],
        [1, 2],
        [2, 3],
      ],
    },

    musca: {
      name: "Musca",
      center: { x: 1250, y: 1650 },
      stars: [
        { x: 1240, y: 1640, name: "Alpha Mus", magnitude: 2.69 },
        { x: 1250, y: 1645, name: "Beta Mus", magnitude: 3.05 },
        { x: 1260, y: 1650, name: "Delta Mus", magnitude: 3.62 },
        { x: 1255, y: 1660, name: "Gamma Mus", magnitude: 3.87 },
      ],
      lines: [
        [0, 1],
        [1, 2],
        [2, 3],
        [3, 0],
      ],
    },

    norma: {
      name: "Norma",
      center: { x: 1600, y: 1500 },
      stars: [
        { x: 1590, y: 1490, name: "Gamma2 Nor", magnitude: 4.02 },
        { x: 1600, y: 1495, name: "Epsilon Nor", magnitude: 4.47 },
        { x: 1610, y: 1500, name: "Eta Nor", magnitude: 4.65 },
        { x: 1605, y: 1510, name: "Delta Nor", magnitude: 4.73 },
      ],
      lines: [
        [0, 1],
        [1, 2],
        [2, 3],
        [3, 0],
      ],
    },

    octans: {
      name: "Octans",
      center: { x: 2200, y: 1800 },
      stars: [
        { x: 2190, y: 1790, name: "Nu Oct", magnitude: 3.76 },
        { x: 2200, y: 1795, name: "Beta Oct", magnitude: 4.15 },
        { x: 2210, y: 1800, name: "Delta Oct", magnitude: 4.32 },
      ],
      lines: [
        [0, 1],
        [1, 2],
        [2, 0],
      ],
    },

    pavo: {
      name: "Pavo",
      center: { x: 1900, y: 1650 },
      stars: [
        { x: 1880, y: 1630, name: "Peacock", magnitude: 1.94 },
        { x: 1900, y: 1640, name: "Beta Pav", magnitude: 3.42 },
        { x: 1920, y: 1650, name: "Delta Pav", magnitude: 3.56 },
        { x: 1910, y: 1670, name: "Gamma Pav", magnitude: 4.22 },
        { x: 1890, y: 1660, name: "Epsilon Pav", magnitude: 3.95 },
      ],
      lines: [
        [0, 1],
        [1, 2],
        [2, 3],
        [3, 4],
        [4, 0],
      ],
    },

    phoenix: {
      name: "Phoenix",
      center: { x: 100, y: 1500 },
      stars: [
        { x: 80, y: 1480, name: "Ankaa", magnitude: 2.38 },
        { x: 100, y: 1490, name: "Beta Phe", magnitude: 3.31 },
        { x: 120, y: 1500, name: "Gamma Phe", magnitude: 3.39 },
        { x: 110, y: 1520, name: "Delta Phe", magnitude: 3.93 },
        { x: 90, y: 1510, name: "Epsilon Phe", magnitude: 3.88 },
      ],
      lines: [
        [0, 1],
        [1, 2],
        [2, 3],
        [3, 4],
        [4, 0],
      ],
    },

    pictor: {
      name: "Pictor",
      center: { x: 600, y: 1550 },
      stars: [
        { x: 590, y: 1540, name: "Alpha Pic", magnitude: 3.27 },
        { x: 600, y: 1545, name: "Beta Pic", magnitude: 3.86 },
        { x: 610, y: 1550, name: "Gamma Pic", magnitude: 4.5 },
      ],
      lines: [
        [0, 1],
        [1, 2],
      ],
    },

    puppis: {
      name: "Puppis",
      center: { x: 800, y: 1400 },
      stars: [
        { x: 780, y: 1380, name: "Naos", magnitude: 2.25 },
        { x: 800, y: 1390, name: "Pi Pup", magnitude: 2.7 },
        { x: 820, y: 1400, name: "Tureis", magnitude: 2.81 },
        { x: 810, y: 1420, name: "Nu Pup", magnitude: 3.17 },
        { x: 790, y: 1410, name: "Tau Pup", magnitude: 2.93 },
      ],
      lines: [
        [0, 1],
        [1, 2],
        [2, 3],
        [3, 4],
        [4, 0],
      ],
    },

    pyxis: {
      name: "Pyxis",
      center: { x: 900, y: 1300 },
      stars: [
        { x: 890, y: 1290, name: "Alpha Pyx", magnitude: 3.68 },
        { x: 900, y: 1295, name: "Beta Pyx", magnitude: 3.97 },
        { x: 910, y: 1300, name: "Gamma Pyx", magnitude: 4.01 },
      ],
      lines: [
        [0, 1],
        [1, 2],
      ],
    },

    reticulum: {
      name: "Reticulum",
      center: { x: 400, y: 1600 },
      stars: [
        { x: 390, y: 1590, name: "Alpha Ret", magnitude: 3.35 },
        { x: 400, y: 1595, name: "Beta Ret", magnitude: 3.85 },
        { x: 410, y: 1600, name: "Delta Ret", magnitude: 4.56 },
        { x: 405, y: 1610, name: "Epsilon Ret", magnitude: 4.44 },
      ],
      lines: [
        [0, 1],
        [1, 2],
        [2, 3],
        [3, 0],
      ],
    },

    sculptor: {
      name: "Sculptor",
      center: { x: 100, y: 1300 },
      stars: [
        { x: 90, y: 1290, name: "Alpha Scl", magnitude: 4.31 },
        { x: 100, y: 1295, name: "Beta Scl", magnitude: 4.37 },
        { x: 110, y: 1300, name: "Gamma Scl", magnitude: 4.41 },
        { x: 105, y: 1310, name: "Delta Scl", magnitude: 4.59 },
      ],
      lines: [
        [0, 1],
        [1, 2],
        [2, 3],
        [3, 0],
      ],
    },

    sextans: {
      name: "Sextans",
      center: { x: 1000, y: 900 },
      stars: [
        { x: 990, y: 890, name: "Alpha Sex", magnitude: 4.49 },
        { x: 1000, y: 895, name: "Beta Sex", magnitude: 5.0 },
        { x: 1010, y: 900, name: "Gamma Sex", magnitude: 5.05 },
      ],
      lines: [
        [0, 1],
        [1, 2],
      ],
    },

    telescopium: {
      name: "Telescopium",
      center: { x: 1900, y: 1500 },
      stars: [
        { x: 1890, y: 1490, name: "Alpha Tel", magnitude: 3.51 },
        { x: 1900, y: 1495, name: "Zeta Tel", magnitude: 4.13 },
        { x: 1910, y: 1500, name: "Epsilon Tel", magnitude: 4.52 },
      ],
      lines: [
        [0, 1],
        [1, 2],
      ],
    },

    triangulum_australe: {
      name: "Triangulum Australe",
      center: { x: 1600, y: 1650 },
      stars: [
        { x: 1590, y: 1640, name: "Atria", magnitude: 1.92 },
        { x: 1600, y: 1650, name: "Beta TrA", magnitude: 2.85 },
        { x: 1610, y: 1660, name: "Gamma TrA", magnitude: 2.89 },
      ],
      lines: [
        [0, 1],
        [1, 2],
        [2, 0],
      ],
    },

    tucana: {
      name: "Tucana",
      center: { x: 2300, y: 1600 },
      stars: [
        { x: 2290, y: 1590, name: "Alpha Tuc", magnitude: 2.86 },
        { x: 2300, y: 1595, name: "Gamma Tuc", magnitude: 3.99 },
        { x: 2310, y: 1600, name: "Beta Tuc", magnitude: 4.29 },
        { x: 2305, y: 1610, name: "Zeta Tuc", magnitude: 4.23 },
      ],
      lines: [
        [0, 1],
        [1, 2],
        [2, 3],
        [3, 0],
      ],
    },

    vela: {
      name: "Vela",
      center: { x: 900, y: 1500 },
      stars: [
        { x: 880, y: 1480, name: "Regor", magnitude: 1.78 },
        { x: 900, y: 1490, name: "Alsephina", magnitude: 1.96 },
        { x: 920, y: 1500, name: "Suhail", magnitude: 2.21 },
        { x: 910, y: 1520, name: "Markeb", magnitude: 2.69 },
        { x: 890, y: 1510, name: "Phi Vel", magnitude: 3.54 },
      ],
      lines: [
        [0, 1],
        [1, 2],
        [2, 3],
        [3, 4],
        [4, 0],
      ],
    },

    volans: {
      name: "Volans",
      center: { x: 800, y: 1650 },
      stars: [
        { x: 790, y: 1640, name: "Beta Vol", magnitude: 3.77 },
        { x: 800, y: 1645, name: "Gamma Vol", magnitude: 3.62 },
        { x: 810, y: 1650, name: "Delta Vol", magnitude: 3.97 },
        { x: 805, y: 1660, name: "Alpha Vol", magnitude: 4.0 },
      ],
      lines: [
        [0, 1],
        [1, 2],
        [2, 3],
        [3, 0],
      ],
    },
  };

  const CHINESE_CONSTELLATIONS = {
    // === AZURE DRAGON OF THE EAST (東方青龍) ===
    jiao: {
      name: "角 (Jiao) - Horn",
      symbol: "Azure Dragon",
      center: { x: 850, y: 450 },
      stars: [
        { x: 830, y: 440, name: "Spica", magnitude: 0.97 },
        { x: 860, y: 455, name: "Zeta Vir", magnitude: 3.37 },
        { x: 845, y: 460, name: "Heze", magnitude: 3.38 },
      ],
      lines: [
        [0, 1],
        [1, 2],
      ],
    },
    kang: {
      name: "亢 (Kang) - Neck",
      symbol: "Azure Dragon",
      center: { x: 900, y: 430 },
      stars: [
        { x: 880, y: 420, name: "Kappa Vir", magnitude: 4.18 },
        { x: 910, y: 435, name: "Iota Vir", magnitude: 4.08 },
        { x: 895, y: 440, name: "Phi Vir", magnitude: 4.81 },
        { x: 920, y: 425, name: "Lambda Vir", magnitude: 4.52 },
      ],
      lines: [
        [0, 1],
        [1, 2],
        [2, 3],
      ],
    },
    di: {
      name: "氐 (Di) - Root",
      symbol: "Azure Dragon",
      center: { x: 950, y: 460 },
      stars: [
        { x: 930, y: 450, name: "Alpha Lib", magnitude: 2.75 },
        { x: 960, y: 465, name: "Beta Lib", magnitude: 2.61 },
        { x: 945, y: 470, name: "Gamma Lib", magnitude: 3.91 },
        { x: 970, y: 455, name: "Iota Lib", magnitude: 4.54 },
      ],
      lines: [
        [0, 1],
        [1, 2],
        [2, 3],
        [3, 0],
      ],
    },
    fang: {
      name: "房 (Fang) - Room",
      symbol: "Azure Dragon",
      center: { x: 1000, y: 440 },
      stars: [
        { x: 980, y: 430, name: "Pi Sco", magnitude: 2.89 },
        { x: 1010, y: 445, name: "Rho Sco", magnitude: 3.88 },
        { x: 995, y: 450, name: "Delta Sco", magnitude: 2.32 },
        { x: 1020, y: 435, name: "Beta Sco", magnitude: 2.62 },
      ],
      lines: [
        [0, 1],
        [1, 2],
        [2, 3],
        [3, 0],
      ],
    },
    xin: {
      name: "心 (Xin) - Heart",
      symbol: "Azure Dragon",
      center: { x: 1050, y: 450 },
      stars: [
        { x: 1030, y: 445, name: "Sigma Sco", magnitude: 2.88 },
        { x: 1055, y: 450, name: "Antares", magnitude: 1.03 },
        { x: 1070, y: 455, name: "Tau Sco", magnitude: 2.82 },
      ],
      lines: [
        [0, 1],
        [1, 2],
      ],
    },
    wei: {
      name: "尾 (Wei) - Tail",
      symbol: "Azure Dragon",
      center: { x: 1100, y: 470 },
      stars: [
        { x: 1080, y: 460, name: "Epsilon Sco", magnitude: 2.29 },
        { x: 1095, y: 465, name: "Mu Sco", magnitude: 3.0 },
        { x: 1110, y: 470, name: "Zeta Sco", magnitude: 3.62 },
        { x: 1125, y: 475, name: "Eta Sco", magnitude: 3.33 },
        { x: 1105, y: 480, name: "Theta Sco", magnitude: 1.87 },
        { x: 1090, y: 485, name: "Iota Sco", magnitude: 2.99 },
        { x: 1115, y: 490, name: "Kappa Sco", magnitude: 2.41 },
        { x: 1130, y: 485, name: "Lambda Sco", magnitude: 1.63 },
        { x: 1120, y: 495, name: "Upsilon Sco", magnitude: 2.69 },
      ],
      lines: [
        [0, 1],
        [1, 2],
        [2, 3],
        [3, 4],
        [4, 5],
        [5, 6],
        [6, 7],
        [7, 8],
      ],
    },
    ji: {
      name: "箕 (Ji) - Winnowing Basket",
      symbol: "Azure Dragon",
      center: { x: 1150, y: 500 },
      stars: [
        { x: 1130, y: 490, name: "Gamma Sgr", magnitude: 2.99 },
        { x: 1155, y: 495, name: "Delta Sgr", magnitude: 2.7 },
        { x: 1145, y: 505, name: "Epsilon Sgr", magnitude: 1.85 },
        { x: 1170, y: 510, name: "Eta Sgr", magnitude: 3.11 },
      ],
      lines: [
        [0, 1],
        [1, 2],
        [2, 3],
        [3, 0],
      ],
    },

    // === BLACK TORTOISE OF THE NORTH (北方玄武) ===
    dou: {
      name: "斗 (Dou) - Dipper",
      symbol: "Black Tortoise",
      center: { x: 1200, y: 520 },
      stars: [
        { x: 1180, y: 510, name: "Phi Sgr", magnitude: 3.17 },
        { x: 1195, y: 515, name: "Lambda Sgr", magnitude: 2.82 },
        { x: 1210, y: 520, name: "Mu Sgr", magnitude: 3.86 },
        { x: 1225, y: 525, name: "Sigma Sgr", magnitude: 2.02 },
        { x: 1205, y: 530, name: "Tau Sgr", magnitude: 3.32 },
        { x: 1190, y: 535, name: "Zeta Sgr", magnitude: 2.6 },
      ],
      lines: [
        [0, 1],
        [1, 2],
        [2, 3],
        [3, 4],
        [4, 5],
        [5, 0],
      ],
    },
    niu: {
      name: "牛 (Niu) - Ox",
      symbol: "Black Tortoise",
      center: { x: 100, y: 550 },
      stars: [
        { x: 80, y: 540, name: "Beta Cap", magnitude: 3.08 },
        { x: 95, y: 545, name: "Alpha2 Cap", magnitude: 3.57 },
        { x: 110, y: 550, name: "Xi2 Cap", magnitude: 5.08 },
        { x: 125, y: 555, name: "Pi Cap", magnitude: 5.08 },
        { x: 105, y: 560, name: "Rho Cap", magnitude: 4.78 },
        { x: 90, y: 565, name: "Omicron Cap", magnitude: 5.94 },
      ],
      lines: [
        [0, 1],
        [1, 2],
        [2, 3],
        [3, 4],
        [4, 5],
        [5, 0],
      ],
    },
    nu: {
      name: "女 (Nü) - Girl",
      symbol: "Black Tortoise",
      center: { x: 150, y: 570 },
      stars: [
        { x: 130, y: 560, name: "Epsilon Aqr", magnitude: 3.77 },
        { x: 155, y: 570, name: "Mu Aqr", magnitude: 4.73 },
        { x: 145, y: 575, name: "4 Aqr", magnitude: 5.99 },
        { x: 170, y: 580, name: "5 Aqr", magnitude: 5.55 },
      ],
      lines: [
        [0, 1],
        [1, 2],
        [2, 3],
      ],
    },
    xu: {
      name: "虛 (Xu) - Emptiness",
      symbol: "Black Tortoise",
      center: { x: 200, y: 580 },
      stars: [
        { x: 185, y: 575, name: "Beta Aqr", magnitude: 2.91 },
        { x: 215, y: 585, name: "Alpha Equ", magnitude: 3.92 },
      ],
      lines: [[0, 1]],
    },
    wei_north: {
      name: "危 (Wei) - Rooftop",
      symbol: "Black Tortoise",
      center: { x: 250, y: 590 },
      stars: [
        { x: 230, y: 580, name: "Alpha Aqr", magnitude: 2.96 },
        { x: 255, y: 590, name: "Theta Peg", magnitude: 3.53 },
        { x: 270, y: 600, name: "Epsilon Peg", magnitude: 2.39 },
      ],
      lines: [
        [0, 1],
        [1, 2],
      ],
    },
    shi: {
      name: "室 (Shi) - Encampment",
      symbol: "Black Tortoise",
      center: { x: 300, y: 600 },
      stars: [
        { x: 280, y: 590, name: "Alpha Peg", magnitude: 2.48 },
        { x: 320, y: 610, name: "Beta Peg", magnitude: 2.42 },
      ],
      lines: [[0, 1]],
    },
    bi: {
      name: "壁 (Bi) - Wall",
      symbol: "Black Tortoise",
      center: { x: 350, y: 610 },
      stars: [
        { x: 330, y: 600, name: "Gamma Peg", magnitude: 2.83 },
        { x: 370, y: 620, name: "Alpha And", magnitude: 2.06 },
      ],
      lines: [[0, 1]],
    },

    // === WHITE TIGER OF THE WEST (西方白虎) ===
    kui: {
      name: "奎 (Kui) - Legs",
      symbol: "White Tiger",
      center: { x: 400, y: 350 },
      stars: [
        { x: 380, y: 330, name: "Eta And", magnitude: 4.42 },
        { x: 395, y: 340, name: "Zeta And", magnitude: 4.06 },
        { x: 410, y: 350, name: "Delta And", magnitude: 3.27 },
        { x: 425, y: 360, name: "Epsilon And", magnitude: 4.37 },
        { x: 405, y: 370, name: "Pi And", magnitude: 4.36 },
        { x: 390, y: 365, name: "Nu And", magnitude: 4.53 },
        { x: 415, y: 335, name: "Mu And", magnitude: 3.87 },
        { x: 430, y: 345, name: "Beta And", magnitude: 2.06 },
        { x: 385, y: 355, name: "Kappa Psc", magnitude: 4.94 },
        { x: 400, y: 360, name: "Lambda Psc", magnitude: 4.5 },
        { x: 415, y: 365, name: "Iota Psc", magnitude: 4.13 },
        { x: 430, y: 370, name: "Theta Psc", magnitude: 4.27 },
        { x: 410, y: 375, name: "Gamma Psc", magnitude: 3.69 },
        { x: 395, y: 380, name: "7 Psc", magnitude: 5.07 },
        { x: 420, y: 385, name: "Omega Psc", magnitude: 4.01 },
      ],
      lines: [
        [0, 1],
        [1, 2],
        [2, 3],
        [3, 4],
        [4, 5],
        [5, 6],
        [6, 7],
        [7, 0],
        [8, 9],
        [9, 10],
        [10, 11],
        [11, 12],
        [12, 13],
        [13, 14],
        [14, 8],
      ],
    },
    lou: {
      name: "婁 (Lou) - Bond",
      symbol: "White Tiger",
      center: { x: 450, y: 380 },
      stars: [
        { x: 435, y: 370, name: "Beta Ari", magnitude: 2.66 },
        { x: 460, y: 385, name: "Gamma Ari", magnitude: 3.88 },
        { x: 455, y: 390, name: "Alpha Ari", magnitude: 2.0 },
      ],
      lines: [
        [0, 1],
        [1, 2],
      ],
    },
    wei_west: {
      name: "胃 (Wei) - Stomach",
      symbol: "White Tiger",
      center: { x: 500, y: 390 },
      stars: [
        { x: 485, y: 380, name: "35 Ari", magnitude: 4.66 },
        { x: 510, y: 395, name: "39 Ari", magnitude: 4.52 },
        { x: 505, y: 400, name: "41 Ari", magnitude: 3.63 },
      ],
      lines: [
        [0, 1],
        [1, 2],
        [2, 0],
      ],
    },
    mao: {
      name: "昴 (Mao) - Hairy Head",
      symbol: "White Tiger",
      center: { x: 550, y: 400 },
      stars: [
        { x: 540, y: 390, name: "Alcyone", magnitude: 2.87 },
        { x: 545, y: 395, name: "Atlas", magnitude: 3.63 },
        { x: 550, y: 400, name: "Electra", magnitude: 3.7 },
        { x: 555, y: 405, name: "Maia", magnitude: 3.86 },
        { x: 560, y: 410, name: "Merope", magnitude: 4.18 },
        { x: 555, y: 415, name: "Taygeta", magnitude: 4.29 },
        { x: 550, y: 410, name: "Pleione", magnitude: 5.09 },
      ],
      lines: [
        [0, 1],
        [1, 2],
        [2, 3],
        [3, 4],
        [4, 5],
        [5, 6],
        [6, 0],
      ],
    },
    bi_west: {
      name: "畢 (Bi) - Net",
      symbol: "White Tiger",
      center: { x: 600, y: 410 },
      stars: [
        { x: 580, y: 400, name: "Epsilon Tau", magnitude: 3.54 },
        { x: 595, y: 405, name: "Delta Tau", magnitude: 3.76 },
        { x: 610, y: 410, name: "Gamma Tau", magnitude: 3.65 },
        { x: 625, y: 415, name: "Alpha Tau", magnitude: 0.85 },
        { x: 605, y: 420, name: "Theta2 Tau", magnitude: 3.4 },
        { x: 590, y: 425, name: "Lambda Tau", magnitude: 3.47 },
        { x: 615, y: 430, name: "Zeta Tau", magnitude: 3.0 },
        { x: 600, y: 435, name: "Omicron Tau", magnitude: 3.6 },
      ],
      lines: [
        [0, 1],
        [1, 2],
        [2, 3],
        [3, 4],
        [4, 5],
        [5, 0],
        [6, 7],
        [7, 3],
      ],
    },
    zui: {
      name: "觜 (Zui) - Turtle Beak",
      symbol: "White Tiger",
      center: { x: 650, y: 420 },
      stars: [
        { x: 635, y: 415, name: "Lambda Ori", magnitude: 3.54 },
        { x: 660, y: 425, name: "Phi1 Ori", magnitude: 4.41 },
        { x: 655, y: 430, name: "Phi2 Ori", magnitude: 4.09 },
      ],
      lines: [
        [0, 1],
        [1, 2],
        [2, 0],
      ],
    },
    shen: {
      name: "參 (Shen) - Three Stars",
      symbol: "White Tiger",
      center: { x: 700, y: 430 },
      stars: [
        { x: 680, y: 410, name: "Betelgeuse", magnitude: 0.5 },
        { x: 695, y: 420, name: "Gamma Ori", magnitude: 1.64 },
        { x: 710, y: 430, name: "Delta Ori", magnitude: 2.23 },
        { x: 695, y: 435, name: "Epsilon Ori", magnitude: 1.7 },
        { x: 710, y: 440, name: "Zeta Ori", magnitude: 2.03 },
        { x: 725, y: 445, name: "Kappa Ori", magnitude: 2.06 },
        { x: 720, y: 450, name: "Rigel", magnitude: 0.13 },
      ],
      lines: [
        [0, 1],
        [1, 2],
        [2, 3],
        [3, 4],
        [4, 5],
        [5, 6],
        [6, 0],
        [2, 4],
      ],
    },

    // === VERMILLION BIRD OF THE SOUTH (南方朱雀) ===
    jing: {
      name: "井 (Jing) - Well",
      symbol: "Vermillion Bird",
      center: { x: 750, y: 450 },
      stars: [
        { x: 730, y: 440, name: "Mu Gem", magnitude: 2.88 },
        { x: 745, y: 445, name: "Eta Gem", magnitude: 3.28 },
        { x: 760, y: 450, name: "Gamma Gem", magnitude: 1.93 },
        { x: 775, y: 455, name: "Xi Gem", magnitude: 3.36 },
        { x: 755, y: 460, name: "Lambda Gem", magnitude: 3.58 },
        { x: 740, y: 465, name: "Delta Gem", magnitude: 3.53 },
        { x: 765, y: 470, name: "Zeta Gem", magnitude: 3.79 },
        { x: 750, y: 475, name: "Epsilon Gem", magnitude: 2.98 },
      ],
      lines: [
        [0, 1],
        [1, 2],
        [2, 3],
        [3, 4],
        [4, 5],
        [5, 6],
        [6, 7],
        [7, 0],
      ],
    },
    gui: {
      name: "鬼 (Gui) - Ghost",
      symbol: "Vermillion Bird",
      center: { x: 800, y: 460 },
      stars: [
        { x: 780, y: 450, name: "Theta Cnc", magnitude: 5.33 },
        { x: 795, y: 455, name: "Eta Cnc", magnitude: 5.33 },
        { x: 810, y: 460, name: "Gamma Cnc", magnitude: 4.66 },
        { x: 825, y: 465, name: "Delta Cnc", magnitude: 3.94 },
        { x: 805, y: 470, name: "M44 Praesepe", magnitude: 3.7 },
      ],
      lines: [
        [0, 1],
        [1, 2],
        [2, 3],
        [3, 4],
        [4, 0],
      ],
    },
    liu: {
      name: "柳 (Liu) - Willow",
      symbol: "Vermillion Bird",
      center: { x: 850, y: 470 },
      stars: [
        { x: 830, y: 460, name: "Delta Hya", magnitude: 4.16 },
        { x: 845, y: 465, name: "Sigma Hya", magnitude: 4.44 },
        { x: 860, y: 470, name: "Eta Hya", magnitude: 4.3 },
        { x: 875, y: 475, name: "Rho Hya", magnitude: 4.36 },
        { x: 855, y: 480, name: "Epsilon Hya", magnitude: 3.38 },
        { x: 840, y: 485, name: "Zeta Hya", magnitude: 3.11 },
        { x: 865, y: 490, name: "Theta Hya", magnitude: 3.88 },
        { x: 850, y: 495, name: "Iota Hya", magnitude: 3.91 },
      ],
      lines: [
        [0, 1],
        [1, 2],
        [2, 3],
        [3, 4],
        [4, 5],
        [5, 6],
        [6, 7],
        [7, 0],
      ],
    },
    xing: {
      name: "星 (Xing) - Star",
      symbol: "Vermillion Bird",
      center: { x: 900, y: 480 },
      stars: [
        { x: 880, y: 470, name: "Alpha Hya", magnitude: 2.0 },
        { x: 895, y: 475, name: "Tau1 Hya", magnitude: 4.6 },
        { x: 910, y: 480, name: "Tau2 Hya", magnitude: 4.54 },
        { x: 925, y: 485, name: "Iota Hya", magnitude: 3.91 },
        { x: 905, y: 490, name: "26 Hya", magnitude: 4.78 },
        { x: 890, y: 495, name: "27 Hya", magnitude: 4.8 },
        { x: 915, y: 500, name: "31 Hya", magnitude: 4.6 },
      ],
      lines: [
        [0, 1],
        [1, 2],
        [2, 3],
        [3, 4],
        [4, 5],
        [5, 6],
        [6, 0],
      ],
    },
    zhang: {
      name: "張 (Zhang) - Extended Net",
      symbol: "Vermillion Bird",
      center: { x: 950, y: 490 },
      stars: [
        { x: 930, y: 480, name: "Upsilon1 Hya", magnitude: 4.12 },
        { x: 945, y: 485, name: "Lambda Hya", magnitude: 3.61 },
        { x: 960, y: 490, name: "Mu Hya", magnitude: 3.81 },
        { x: 975, y: 495, name: "Nu Hya", magnitude: 3.11 },
        { x: 955, y: 500, name: "Kappa Hya", magnitude: 5.06 },
        { x: 940, y: 505, name: "Phi Hya", magnitude: 4.91 },
      ],
      lines: [
        [0, 1],
        [1, 2],
        [2, 3],
        [3, 4],
        [4, 5],
        [5, 0],
      ],
    },
    yi: {
      name: "翼 (Yi) - Wings",
      symbol: "Vermillion Bird",
      center: { x: 1000, y: 500 },
      stars: [
        { x: 980, y: 490, name: "Alpha Crt", magnitude: 4.08 },
        { x: 995, y: 495, name: "Beta Crt", magnitude: 4.46 },
        { x: 1010, y: 500, name: "Gamma Crt", magnitude: 4.08 },
        { x: 1025, y: 505, name: "Delta Crt", magnitude: 3.56 },
        { x: 1005, y: 510, name: "Epsilon Crt", magnitude: 4.83 },
        { x: 990, y: 515, name: "Zeta Crt", magnitude: 4.73 },
        { x: 1015, y: 520, name: "Eta Crt", magnitude: 5.18 },
        { x: 1000, y: 525, name: "Theta Crt", magnitude: 4.7 },
        { x: 1020, y: 490, name: "Iota Crt", magnitude: 5.48 },
        { x: 1035, y: 495, name: "Kappa Crt", magnitude: 5.94 },
        { x: 985, y: 520, name: "Lambda Crt", magnitude: 5.08 },
        { x: 970, y: 515, name: "Mu Crt", magnitude: 5.07 },
        { x: 1030, y: 485, name: "Psi Crt", magnitude: 6.13 },
        { x: 995, y: 480, name: "Omega Crt", magnitude: 5.82 },
        { x: 1010, y: 475, name: "Xi Crt", magnitude: 5.28 },
        { x: 1025, y: 470, name: "Nu Crt", magnitude: 5.48 },
        { x: 1005, y: 465, name: "Pi Crt", magnitude: 5.24 },
        { x: 990, y: 460, name: "Rho Crt", magnitude: 5.23 },
        { x: 1015, y: 455, name: "Sigma Crt", magnitude: 5.56 },
        { x: 1000, y: 450, name: "Tau Crt", magnitude: 5.69 },
        { x: 1020, y: 445, name: "Upsilon Crt", magnitude: 5.72 },
        { x: 1005, y: 440, name: "Phi Crt", magnitude: 5.72 },
      ],
      lines: [
        [0, 1],
        [1, 2],
        [2, 3],
        [3, 4],
        [4, 5],
        [5, 6],
        [6, 7],
        [7, 0],
        [8, 9],
        [9, 3],
        [10, 11],
        [11, 5],
        [12, 13],
        [13, 14],
        [14, 15],
        [15, 16],
        [16, 17],
        [17, 18],
        [18, 19],
        [19, 20],
        [20, 21],
        [21, 12],
      ],
    },
    zhen: {
      name: "軫 (Zhen) - Chariot",
      symbol: "Vermillion Bird",
      center: { x: 1050, y: 510 },
      stars: [
        { x: 1030, y: 500, name: "Gamma Crv", magnitude: 2.59 },
        { x: 1045, y: 505, name: "Beta Crv", magnitude: 2.65 },
        { x: 1060, y: 510, name: "Delta Crv", magnitude: 2.95 },
        { x: 1075, y: 515, name: "Epsilon Crv", magnitude: 3.0 },
      ],
      lines: [
        [0, 1],
        [1, 2],
        [2, 3],
        [3, 0],
      ],
    },

    // === THREE ENCLOSURES (三垣) ===

    // Purple Forbidden Enclosure (紫微垣)
    ziwei: {
      name: "紫微垣 (Ziwei Yuan) - Purple Forbidden Enclosure",
      symbol: "Three Enclosures",
      center: { x: 600, y: 200 },
      stars: [
        // Right Wall
        { x: 550, y: 150, name: "Theta Dra", magnitude: 4.01 },
        { x: 560, y: 160, name: "Eta Dra", magnitude: 2.74 },
        { x: 570, y: 170, name: "Zeta Dra", magnitude: 3.17 },
        { x: 580, y: 180, name: "Upsilon Dra", magnitude: 4.82 },
        { x: 590, y: 190, name: "73 Dra", magnitude: 5.2 },
        { x: 600, y: 200, name: "Gamma Cep", magnitude: 3.21 },
        { x: 590, y: 210, name: "Beta Cep", magnitude: 3.23 },
        { x: 580, y: 220, name: "Iota Cep", magnitude: 3.52 },
        // Left Wall
        { x: 620, y: 220, name: "Alpha UMi", magnitude: 2.02 },
        { x: 630, y: 210, name: "Delta UMi", magnitude: 4.36 },
        { x: 640, y: 200, name: "Epsilon UMi", magnitude: 4.23 },
        { x: 650, y: 190, name: "Zeta UMi", magnitude: 4.32 },
        { x: 640, y: 180, name: "Eta UMi", magnitude: 4.95 },
        { x: 630, y: 170, name: "Gamma UMi", magnitude: 3.05 },
        { x: 620, y: 160, name: "Beta UMi", magnitude: 2.08 },
        { x: 610, y: 150, name: "5 UMi", magnitude: 4.25 },
      ],
      lines: [
        [0, 1],
        [1, 2],
        [2, 3],
        [3, 4],
        [4, 5],
        [5, 6],
        [6, 7],
        [8, 9],
        [9, 10],
        [10, 11],
        [11, 12],
        [12, 13],
        [13, 14],
        [14, 15],
      ],
    },

    // Supreme Palace Enclosure (太微垣)
    taiwei: {
      name: "太微垣 (Taiwei Yuan) - Supreme Palace Enclosure",
      symbol: "Three Enclosures",
      center: { x: 800, y: 300 },
      stars: [
        // Right Wall
        { x: 750, y: 280, name: "Eta Vir", magnitude: 3.89 },
        { x: 760, y: 285, name: "Gamma Vir", magnitude: 3.65 },
        { x: 770, y: 290, name: "Delta Vir", magnitude: 3.38 },
        { x: 780, y: 295, name: "Epsilon Vir", magnitude: 2.83 },
        { x: 790, y: 300, name: "Sigma Leo", magnitude: 4.05 },
        // Left Wall
        { x: 810, y: 300, name: "Beta Leo", magnitude: 2.14 },
        { x: 820, y: 295, name: "Delta Leo", magnitude: 2.56 },
        { x: 830, y: 290, name: "Theta Leo", magnitude: 3.34 },
        { x: 840, y: 285, name: "Iota Leo", magnitude: 3.94 },
        { x: 850, y: 280, name: "Sigma Leo", magnitude: 4.05 },
      ],
      lines: [
        [0, 1],
        [1, 2],
        [2, 3],
        [3, 4],
        [5, 6],
        [6, 7],
        [7, 8],
        [8, 9],
      ],
    },

    // Heavenly Market Enclosure (天市垣)
    tianshi: {
      name: "天市垣 (Tianshi Yuan) - Heavenly Market Enclosure",
      symbol: "Three Enclosures",
      center: { x: 1000, y: 350 },
      stars: [
        // Right Wall
        { x: 950, y: 320, name: "Delta Her", magnitude: 3.14 },
        { x: 960, y: 325, name: "Lambda Her", magnitude: 4.41 },
        { x: 970, y: 330, name: "Mu Her", magnitude: 3.42 },
        { x: 980, y: 335, name: "Omicron Her", magnitude: 3.83 },
        { x: 990, y: 340, name: "109 Her", magnitude: 3.84 },
        { x: 1000, y: 345, name: "110 Her", magnitude: 4.19 },
        // Left Wall
        { x: 1000, y: 355, name: "Rho Her", magnitude: 4.17 },
        { x: 1010, y: 360, name: "Theta Her", magnitude: 3.86 },
        { x: 1020, y: 365, name: "Eta Oph", magnitude: 2.43 },
        { x: 1030, y: 370, name: "Xi Ser", magnitude: 3.54 },
        { x: 1040, y: 375, name: "Nu Oph", magnitude: 3.34 },
        { x: 1050, y: 380, name: "Tau Oph", magnitude: 5.24 },
      ],
      lines: [
        [0, 1],
        [1, 2],
        [2, 3],
        [3, 4],
        [4, 5],
        [5, 6],
        [6, 7],
        [7, 8],
        [8, 9],
        [9, 10],
        [10, 11],
      ],
    },

    // === SPECIAL ASTERISMS ===

    // Big Dipper (北斗七星)
    beidou: {
      name: "北斗七星 (Beidou Qixing) - Big Dipper",
      symbol: "Special Asterism",
      center: { x: 400, y: 150 },
      stars: [
        { x: 360, y: 140, name: "Dubhe", magnitude: 1.79 },
        { x: 380, y: 145, name: "Merak", magnitude: 2.37 },
        { x: 400, y: 150, name: "Phecda", magnitude: 2.44 },
        { x: 420, y: 155, name: "Megrez", magnitude: 3.31 },
        { x: 440, y: 150, name: "Alioth", magnitude: 1.77 },
        { x: 430, y: 140, name: "Mizar", magnitude: 2.27 },
        { x: 410, y: 130, name: "Alkaid", magnitude: 1.86 },
      ],
      lines: [
        [0, 1],
        [1, 2],
        [2, 3],
        [3, 4],
        [4, 5],
        [5, 6],
      ],
    },

    // Southern Dipper (南斗六星)
    nandou: {
      name: "南斗六星 (Nandou Liuxing) - Southern Dipper",
      symbol: "Special Asterism",
      center: { x: 1180, y: 530 },
      stars: [
        { x: 1160, y: 520, name: "Mu Sgr", magnitude: 3.86 },
        { x: 1175, y: 525, name: "Lambda Sgr", magnitude: 2.82 },
        { x: 1190, y: 530, name: "Phi Sgr", magnitude: 3.17 },
        { x: 1205, y: 535, name: "Sigma Sgr", magnitude: 2.02 },
        { x: 1185, y: 540, name: "Tau Sgr", magnitude: 3.32 },
        { x: 1170, y: 545, name: "Zeta Sgr", magnitude: 2.6 },
      ],
      lines: [
        [0, 1],
        [1, 2],
        [2, 3],
        [3, 4],
        [4, 5],
        [5, 0],
      ],
    },

    // Three Stars (參宿三星/獵戶座腰帶)
    sanxing: {
      name: "參宿三星 (Sanshu Sanxing) - Orion's Belt",
      symbol: "Special Asterism",
      center: { x: 700, y: 435 },
      stars: [
        { x: 680, y: 435, name: "Alnitak", magnitude: 2.03 },
        { x: 700, y: 435, name: "Alnilam", magnitude: 1.7 },
        { x: 720, y: 435, name: "Mintaka", magnitude: 2.23 },
      ],
      lines: [
        [0, 1],
        [1, 2],
      ],
    },
  };

  const SUPERCLUSTERS = [
    // Original Laniakea Components (Retaining Original Local Coordinates as a Baseline)
    {
      name: "Virgo Supercluster",
      partOf: "Laniakea Supercluster",
      x: 0,
      y: 0,
      distance: 0, // Contains Local Group
      radius: 55, // Mly
      clusters: 100,
      mass: 1e15,
      color: { r: 180, g: 200, b: 255 },
    },
    {
      name: "Hydra-Centaurus Supercluster",
      partOf: "Laniakea Supercluster",
      x: 150,
      y: -80,
      distance: 170, // Mly
      radius: 60, // Mly
      clusters: 80,
      mass: 1e15,
      color: { r: 255, g: 200, b: 180 },
    },
    {
      name: "Pavo-Indus Supercluster",
      partOf: "Laniakea Supercluster",
      x: -120,
      y: -200,
      distance: 230, // Mly
      radius: 50, // Mly
      clusters: 60,
      mass: 8e14,
      color: { r: 200, g: 180, b: 255 },
    },
    {
      name: "Southern Supercluster",
      partOf: "Laniakea Supercluster",
      x: -180,
      y: 100,
      distance: 200, // Mly
      radius: 45, // Mly
      clusters: 50,
      mass: 7e14,
      color: { r: 180, g: 255, b: 200 },
    },
    {
      name: "Antlia Supercluster",
      partOf: "Laniakea Supercluster",
      x: 60,
      y: 120,
      distance: 130, // Mly
      radius: 40, // Mly
      clusters: 45,
      mass: 6e14,
      color: { r: 255, g: 220, b: 180 },
    },
    {
      name: "Centaurus Supercluster",
      partOf: "Laniakea Supercluster",
      x: 180,
      y: -40,
      distance: 180, // Mly
      radius: 50, // Mly
      clusters: 70,
      mass: 9e14,
      color: { r: 200, g: 255, b: 220 },
    },
    {
      name: "Hydra Supercluster",
      partOf: "Laniakea Supercluster",
      x: 240,
      y: 60,
      distance: 250, // Mly
      radius: 55, // Mly
      clusters: 65,
      mass: 8e14,
      color: { r: 220, g: 200, b: 255 },
    },
    {
      name: "Fornax Supercluster",
      partOf: "Laniakea Supercluster",
      x: -90,
      y: 150,
      distance: 180, // Mly
      radius: 35, // Mly
      clusters: 40,
      mass: 5e14,
      color: { r: 255, g: 180, b: 220 },
    },
    {
      name: "Norma Supercluster",
      partOf: "Laniakea Supercluster",
      x: 200,
      y: -120,
      distance: 230, // Mly
      radius: 45, // Mly
      clusters: 55,
      mass: 7e14,
      color: { r: 180, g: 220, b: 255 },
    }, // Expanded List with Calculated Coordinates (L = Supergalactic Longitude)
    {
      name: "Great Attractor",
      partOf: "Laniakea Supercluster",
      distance: 220, // Mly // L ≈ 307° (Centered on Norma Cluster)
      x: 1133, // 220 * cos(307°)
      y: -176, // 220 * sin(307°)
      radius: null,
      clusters: 1,
      mass: 1e16,
      color: { r: 180, g: 200, b: 255 },
    },
    {
      name: "Perseus-Pisces Supercluster",
      partOf: null,
      distance: 250, // Mly // L ≈ 140°
      x: -192, // 250 * cos(140°)
      y: 161, // 250 * sin(140°)
      radius: 150,
      clusters: 60,
      mass: 1e16,
      color: { r: 180, g: 200, b: 255 },
    },
    {
      name: "Coma Supercluster",
      partOf: null,
      distance: 300, // Mly // L ≈ 47°
      x: 205, // 300 * cos(47°)
      y: 220, // 300 * sin(47°)
      radius: 100,
      clusters: 2,
      mass: 1e16,
      color: { r: 180, g: 200, b: 255 },
    },
    {
      name: "Hercules Superclusters",
      partOf: null,
      distance: 500, // Mly // L ≈ 70°
      x: 171, // 500 * cos(70°)
      y: 469, // 500 * sin(70°)
      radius: 300,
      clusters: 20,
      mass: 1e16,
      color: { r: 180, g: 200, b: 255 },
    },
    {
      name: "Shapley Supercluster",
      partOf: null,
      distance: 650, // Mly // L ≈ 306°
      x: 382, // 650 * cos(306°)
      y: -526, // 650 * sin(306°)
      radius: 120,
      clusters: 25,
      mass: 5e16,
      color: { r: 180, g: 200, b: 255 },
    },
    {
      name: "Sculptor Supercluster",
      partOf: null,
      distance: 400, // Mly // L ≈ 270°
      x: 0, // 400 * cos(270°)
      y: -400, // 400 * sin(270°)
      radius: 80,
      clusters: 10,
      mass: 5e15,
      color: { r: 180, g: 200, b: 255 },
    },
    {
      name: "Bootes Supercluster",
      partOf: null,
      distance: 1000, // Mly // L ≈ 70° (Approx. location of the associated void)
      x: 342, // 1000 * cos(70°)
      y: 940, // 1000 * sin(70°)
      radius: 150,
      clusters: 12,
      mass: 1e16,
      color: { r: 180, g: 200, b: 255 },
    },
  ];
  const LOCAL_GROUP_GALAXIES = [
    // Major Galaxies
    {
      name: "Milky Way",
      x: 0,
      y: 0,
      distance: 0,
      radius: 50, // kly
      type: GALAXY_TYPE_BARRED_SPIRAL,
      mass: 1.5e12, // Solar masses
      arms: 4,
      armTightness: 0.8,
      rotation: 0,
      color: { r: 255, g: 240, b: 200 },
    },
    {
      name: "Andromeda (M31)",
      x: 2200,
      y: 1200,
      distance: 2537, // kly
      radius: 110, // kly
      type: GALAXY_TYPE_SPIRAL,
      mass: 1.5e12,
      arms: 2,
      armTightness: 0.6,
      rotation: Math.PI * 0.3,
      color: { r: 220, g: 230, b: 255 },
    },
    {
      name: "Triangulum (M33)",
      x: 2600,
      y: 1400,
      distance: 3000, // kly
      radius: 30, // kly
      type: GALAXY_TYPE_SPIRAL,
      mass: 6e10,
      arms: 2,
      armTightness: 0.7,
      rotation: Math.PI * 0.5,
      color: { r: 200, g: 220, b: 255 },
    },
    {
      name: "Large Magellanic Cloud",
      x: 140,
      y: -80,
      distance: 160, // kly
      radius: 7, // kly
      type: GALAXY_TYPE_IRREGULAR,
      mass: 1e10,
      rotation: 0,
      color: { r: 200, g: 210, b: 255 },
    },
    {
      name: "Small Magellanic Cloud",
      x: 180,
      y: -100,
      distance: 200, // kly
      radius: 3.5, // kly
      type: GALAXY_TYPE_IRREGULAR,
      mass: 7e9,
      rotation: 0,
      color: { r: 210, g: 220, b: 255 },
    },

    // Andromeda's Satellites
    {
      name: "M32",
      x: 2180,
      y: 1180,
      distance: 2490, // kly
      radius: 4, // kly
      type: GALAXY_TYPE_ELLIPTICAL,
      mass: 3e9,
      eccentricity: 0.7,
      rotation: Math.PI * 0.2,
      color: { r: 255, g: 240, b: 220 },
    },
    {
      name: "M110 (NGC 205)",
      x: 2220,
      y: 1220,
      distance: 2700, // kly
      radius: 8.5, // kly
      type: GALAXY_TYPE_ELLIPTICAL,
      mass: 4e9,
      eccentricity: 0.5,
      rotation: Math.PI * 0.7,
      color: { r: 255, g: 235, b: 215 },
    },

    // Notable Dwarf Galaxies
    {
      name: "NGC 6822",
      x: -1500,
      y: -800,
      distance: 1630, // kly
      radius: 4, // kly
      type: GALAXY_TYPE_IRREGULAR,
      mass: 1e9,
      rotation: 0,
      color: { r: 200, g: 210, b: 240 },
    },
    {
      name: "IC 10",
      x: -2000,
      y: 500,
      distance: 2200, // kly
      radius: 3, // kly
      type: GALAXY_TYPE_IRREGULAR,
      mass: 8e8,
      rotation: 0,
      color: { r: 190, g: 200, b: 255 },
    },
    {
      name: "Sagittarius Dwarf",
      x: 50,
      y: -70,
      distance: 70, // kly
      radius: 5, // kly
      type: GALAXY_TYPE_DWARF_SPHEROIDAL,
      mass: 4e8,
      rotation: 0,
      color: { r: 255, g: 230, b: 200 },
    },
    {
      name: "Fornax Dwarf",
      x: -400,
      y: -200,
      distance: 460, // kly
      radius: 2.3, // kly
      type: GALAXY_TYPE_DWARF_SPHEROIDAL,
      mass: 5e7,
      rotation: 0,
      color: { r: 240, g: 220, b: 200 },
    },
    {
      name: "Sculptor Dwarf",
      x: -250,
      y: -150,
      distance: 290, // kly
      radius: 1.5, // kly
      type: GALAXY_TYPE_DWARF_SPHEROIDAL,
      mass: 2e7,
      rotation: 0,
      color: { r: 235, g: 215, b: 195 },
    },
    {
      name: "Leo I",
      x: 750,
      y: -300,
      distance: 820, // kly
      radius: 1.2, // kly
      type: GALAXY_TYPE_DWARF_SPHEROIDAL,
      mass: 5e7,
      rotation: 0,
      color: { r: 240, g: 225, b: 205 },
    },
    {
      name: "Leo II",
      x: 680,
      y: -250,
      distance: 690, // kly
      radius: 0.8, // kly
      type: GALAXY_TYPE_DWARF_SPHEROIDAL,
      mass: 1e7,
      rotation: 0,
      color: { r: 235, g: 220, b: 200 },
    },
    {
      name: "Ursa Minor Dwarf",
      x: 200,
      y: 150,
      distance: 225, // kly
      radius: 1, // kly
      type: GALAXY_TYPE_DWARF_SPHEROIDAL,
      mass: 3e7,
      rotation: 0,
      color: { r: 230, g: 215, b: 195 },
    },
    {
      name: "Draco Dwarf",
      x: 250,
      y: 180,
      distance: 260, // kly
      radius: 1.2, // kly
      type: GALAXY_TYPE_DWARF_SPHEROIDAL,
      mass: 3e7,
      rotation: 0,
      color: { r: 235, g: 220, b: 200 },
    },
    {
      name: "Carina Dwarf",
      x: -85,
      y: -75,
      distance: 330, // kly
      radius: 1.2, // kly
      type: GALAXY_TYPE_DWARF_SPHEROIDAL,
      mass: 1.5e7,
      rotation: 0,
      color: { r: 240, g: 220, b: 200 },
    },
    {
      name: "Sextans Dwarf",
      x: -280,
      y: -95,
      distance: 280, // kly
      radius: 2, // kly
      type: GALAXY_TYPE_DWARF_SPHEROIDAL,
      mass: 4e7,
      rotation: 0,
      color: { r: 235, g: 218, b: 198 },
    },
    {
      name: "IC 1613",
      x: -2200,
      y: -800,
      distance: 2350, // kly
      radius: 6, // kly
      type: GALAXY_TYPE_IRREGULAR,
      mass: 1e9,
      rotation: 0,
      color: { r: 195, g: 205, b: 245 },
    },
    {
      name: "WLM",
      x: -3000,
      y: 0,
      distance: 3000, // kly
      radius: 4, // kly
      type: GALAXY_TYPE_IRREGULAR,
      mass: 5e8,
      rotation: 0,
      color: { r: 190, g: 200, b: 240 },
    },
    {
      name: "Phoenix Dwarf",
      x: -1300,
      y: -700,
      distance: 1440, // kly
      radius: 1.5, // kly
      type: GALAXY_TYPE_IRREGULAR,
      mass: 2e8,
      rotation: 0,
      color: { r: 200, g: 210, b: 235 },
    },
    {
      name: "NGC 3109",
      x: -4000,
      y: -1200,
      distance: 4250, // kly
      radius: 10, // kly
      type: GALAXY_TYPE_IRREGULAR,
      mass: 2e9,
      rotation: 0,
      color: { r: 185, g: 195, b: 235 },
    },
    {
      name: "Antlia Dwarf",
      x: -4100,
      y: -900,
      distance: 4300, // kly
      radius: 1.5, // kly
      type: GALAXY_TYPE_DWARF_SPHEROIDAL,
      mass: 1e7,
      rotation: 0,
      color: { r: 230, g: 210, b: 190 },
    },
    {
      name: "Leo A",
      x: 2400,
      y: -600,
      distance: 2500, // kly
      radius: 2.5, // kly
      type: GALAXY_TYPE_IRREGULAR,
      mass: 7e7,
      rotation: 0,
      color: { r: 195, g: 205, b: 240 },
    },
    {
      name: "Aquarius Dwarf",
      x: 3000,
      y: -1000,
      distance: 3150, // kly
      radius: 1.8, // kly
      type: GALAXY_TYPE_IRREGULAR,
      mass: 5e7,
      rotation: 0,
      color: { r: 200, g: 208, b: 238 },
    },
    {
      name: "Tucana Dwarf",
      x: -2800,
      y: -1400,
      distance: 3000, // kly
      radius: 1, // kly
      type: GALAXY_TYPE_DWARF_SPHEROIDAL,
      mass: 2e7,
      rotation: 0,
      color: { r: 235, g: 215, b: 195 },
    },
    {
      name: "Pegasus Dwarf",
      x: 3000,
      y: 500,
      distance: 3000, // kly
      radius: 3, // kly
      type: GALAXY_TYPE_IRREGULAR,
      mass: 1e8,
      rotation: 0,
      color: { r: 190, g: 200, b: 235 },
    },
  ];

  const STAR_TYPES = {
    O: {
      color: 0x9bb0ff,
      temp: [30000, 60000],
      mass: [16, 90],
      radius: [6.6, 10],
      freq: 0.00003,
    },
    B: {
      color: 0xaabfff,
      temp: [10000, 30000],
      mass: [2.1, 16],
      radius: [1.8, 6.6],
      freq: 0.0013,
    },
    BLACK_HOLE: {
      color: 0x000000, // visual representation only
      temp: null, // Hawking temp irrelevant
      mass: [3, 100], // stellar-mass black hole range in solar masses
      radius: null, // computed from mass (Schwarzschild radius)
      freq: 0.00002, // extremely rare
    },

    SUPERMASSIVE_BLACK_HOLE: {
      color: 0x000000,
      temp: null,
      mass: [1e5, 1e10], // 100k to billions of solar masses
      radius: null,
      freq: 0.000001, // far rarer
    },
    A: {
      color: 0xcad7ff,
      temp: [7500, 10000],
      mass: [1.4, 2.1],
      radius: [1.4, 1.8],
      freq: 0.006,
    },
    F: {
      color: 0xf8f7ff,
      temp: [6000, 7500],
      mass: [1.04, 1.4],
      radius: [1.15, 1.4],
      freq: 0.03,
    },
    G: {
      color: 0xfff4ea,
      temp: [5200, 6000],
      mass: [0.8, 1.04],
      radius: [0.96, 1.15],
      freq: 0.076,
    },
    K: {
      color: 0xffd2a1,
      temp: [3700, 5200],
      mass: [0.45, 0.8],
      radius: [0.7, 0.96],
      freq: 0.121,
    },
    M: {
      color: 0xffcc6f,
      temp: [2400, 3700],
      mass: [0.08, 0.45],
      radius: [0.2, 0.7],
      freq: 0.765,
    },
  };

  const PLANET_TYPES = {
    // Tiny Terrestrials
    sub_mercurian: {
      minMass: 0.01,
      maxMass: 0.1,
      color: 0xb8860b,
      description: "Bare‐bones rocky world, thinner crust, minimal atmosphere.",
      biome: "Badlands",
    },
    mercurian: {
      minMass: 0.1,
      maxMass: 0.2,
      color: 0xa0522d,
      description: "Mercury‐like, airless, cratered, iron‐rich.",
      biome: "Canyon",
    },
    sub_earth: {
      minMass: 0.2,
      maxMass: 0.5,
      color: 0x8b7355,
      description: "Smaller than Earth but still geologically active.",
      biome: "Mountain",
    },
    earth_like: {
      minMass: 0.5,
      maxMass: 2.0,
      color: 0x2e8b57,
      description: "Rocky with plate tectonics, liquid water, breathable air.",
      biome: "Fields",
    },
    super_earth: {
      minMass: 2.0,
      maxMass: 10.0,
      color: 0x556b2f,
      description: "Large rocky world; higher gravity, thicker atmosphere.",
      biome: "Highlands",
    },

    // Water / Ice Worlds
    mini_neptune: {
      minMass: 2.0,
      maxMass: 4.0,
      color: 0x87cefa,
      description: "Small ice‐rich envelope over a rocky core.",
      biome: "Ice",
    },
    ice: {
      minMass: 0.3,
      maxMass: 4.0,
      color: 0xe0ffff,
      description: "Frozen surface; possible subsurface ocean.",
      biome: "Ice",
    },
    ocean: {
      minMass: 0.5,
      maxMass: 2.0,
      color: 0x006994,
      description: "Global liquid ocean, minimal landmasses.",
      biome: "Ocean",
    },
    lava_ocean: {
      minMass: 0.5,
      maxMass: 5.0,
      color: 0xdd4500,
      description: "Partially molten surface, steam atmosphere.",
      biome: "Volcano",
    },
    desert: {
      minMass: 0.3,
      maxMass: 1.5,
      color: 0xedc9af,
      description: "Dry world, sparse vegetation or none at all.",
      biome: "Desert",
    },
    rainforest: {
      minMass: 0.5,
      maxMass: 2.0,
      color: 0x228b22,
      description: "Thick jungles, heavy precipitation, high biomass.",
      biome: "Jungle",
    },
    tundra: {
      minMass: 0.3,
      maxMass: 1.5,
      color: 0xafeeee,
      description: "Cold, limited plant life, permafrost‐dominated.",
      biome: "Tundra",
    },
    acid_ocean: {
      minMass: 0.5,
      maxMass: 3.0,
      color: 0x7fff00,
      description: "Sulfuric or hydrochloric acid seas, corrosive skies.",
      biome: "Swamp",
    },

    // Giant Planets
    gas_giant: {
      minMass: 10.0,
      maxMass: 500.0,
      color: 0xffb366,
      description: "Massive hydrogen‐helium envelope, no solid surface.",
      biome: "Ice",
    },
    hot_jupiter: {
      minMass: 50.0,
      maxMass: 500.0,
      color: 0xff8c00,
      description:
        "Orbits extremely close to its star, blistering temperatures.",
      biome: "Volcano",
    },
    warm_jupiter: {
      minMass: 10.0,
      maxMass: 100.0,
      color: 0xffa500,
      description: "Closer in than Jupiter but farther than a hot‐Jupiter.",
      biome: "Ice",
    },
    cold_jupiter: {
      minMass: 50.0,
      maxMass: 300.0,
      color: 0xd2691e,
      description: "Far from its star, deep cold atmosphere.",
      biome: "Ice",
    },
    ice_giant: {
      minMass: 5.0,
      maxMass: 50.0,
      color: 0x4fd0e0,
      description: "Rich in volatiles like water, ammonia; thick icy mantle.",
      biome: "Ice",
    },
    ringed_gas_giant: {
      minMass: 50.0,
      maxMass: 800.0,
      color: 0xd2b48c,
      description: "Prominent rings, dozens of moons.",
      biome: "Ice",
    },
    puffy: {
      minMass: 0.1,
      maxMass: 0.5,
      color: 0xffdab9,
      description: "Extremely low density, bloated by stellar heating.",
      biome: "Ice",
    },

    // Exotic and Strange Worlds
    chthonian: {
      minMass: 0.5,
      maxMass: 2.0,
      color: 0x660000,
      description: "Stripped gas giant core, volcanic, metal‐rich.",
      biome: "Volcano",
    },
    mega_iron: {
      minMass: 1.0,
      maxMass: 10.0,
      color: 0x444444,
      description: "Almost pure iron/nickel, high density, magnetic.",
      biome: "Mines",
    },
    carbon: {
      minMass: 0.5,
      maxMass: 5.0,
      color: 0x2f4f4f,
      description: "Graphite and hydrocarbons dominate; tar‐like seas.",
      biome: "Landfill",
    },
    diamond: {
      minMass: 2.0,
      maxMass: 20.0,
      color: 0xb9f2ff,
      description: "High pressure turns carbon shell into diamond layer.",
      biome: "Crystals",
    },
    magma_planet: {
      minMass: 1.0,
      maxMass: 8.0,
      color: 0xff4500,
      description: "Surface is a global magma bath, constant eruptions.",
      biome: "Volcano",
    },
    plasma: {
      minMass: 0.2,
      maxMass: 50.0,
      color: 0xff1493,
      description: "Ionized atmosphere, glows under stellar wind.",
      biome: "Eldritch",
    },
    magnetar: {
      minMass: 1.0,
      maxMass: 2.0,
      color: 0x9400d3,
      description: "Ultra‐magnetic field, exotic radiation environment.",
      biome: "Eldritch",
    },
    quark_planet: {
      minMass: 0.1,
      maxMass: 2.0,
      color: 0x8a2be2,
      description: "Hypothetical strange matter core, super‐dense.",
      biome: "Eldritch",
    },
    rogue: {
      minMass: 0.5,
      maxMass: 1000.0,
      color: 0x333333,
      description: "Free‐floating, cold, no host star.",
      biome: "Space",
    },
    habitable: {
      minMass: 0.5,
      maxMass: 5.0,
      color: 0x32cd32,
      description: "Within habitable zone, stable climate, liquid water.",
      biome: "Meadows",
    },

    // Dwarfs & Substellar
    dwarf: {
      minMass: 0.002,
      maxMass: 0.1,
      color: 0x808080,
      description: "Small icy/rocky body, like Pluto or Ceres.",
      biome: "Ice",
    },
    centaur: {
      minMass: 0.001,
      maxMass: 0.001,
      color: 0x6699cc,
      description: "Icy‐rock hybrid between Jupiter and Neptune orbits.",
      biome: "Ice",
    },
    planetesimal: {
      minMass: 0.001,
      maxMass: 0.001,
      color: 0xbbbbbb,
      description: "Building block of planets, tiny rock/ice clump.",
      biome: "Ice",
    },
    c_type_asteroid: {
      minMass: 0.001,
      maxMass: 0.001,
      color: 0x555555,
      description: "Carbonaceous, dark, primitive composition.",
      biome: "Badlands",
    },
    s_type_asteroid: {
      minMass: 0.001,
      maxMass: 0.001,
      color: 0xaaaaaa,
      description: "Silicate and nickel‐iron, brighter surface.",
      biome: "Canyon",
    },
    m_type_asteroid: {
      minMass: 0.001,
      maxMass: 0.001,
      color: 0x777777,
      description: "Metallic, mostly nickel‐iron core fragments.",
      biome: "Mines",
    },
    trojan_asteroid: {
      minMass: 0.001,
      maxMass: 0.001,
      color: 0x888888,
      description: "Co‐orbiting in Lagrange points of a larger planet.",
      biome: "Badlands",
    },

    // Comets
    comet: {
      minMass: 0.001,
      maxMass: 0.001,
      color: 0xffffff,
      description: "Dirty snowball: ice, dust, develops tail near star.",
      biome: "Ice",
    },
    short_period_comet: {
      minMass: 0.001,
      maxMass: 0.001,
      color: 0xefefef,
      description: "Orbits under 200 years, frequent visitor.",
      biome: "Ice",
    },
    long_period_comet: {
      minMass: 0.001,
      maxMass: 0.001,
      color: 0xdfdfdf,
      description: "Orbits over 200 years, from distant Oort cloud.",
      biome: "Ice",
    },
  };
  const SYSTEMS = {
    // Our Solar System
    sol: {
      name: "Sol",
      type: "G",
      mass: 1.0,
      radius: 1.0,
      temperature: 5778,
      position: { x: 0, y: 0, z: 0 },
      planets: [
        {
          name: "Mercury",
          type: "mercurian",
          moons: [],
          orbitRadius: 0.39,
          mass: 0.055,
        },
        {
          name: "Venus",
          type: "sub_earth",
          moons: [],
          orbitRadius: 0.72,
          mass: 0.815,
        },
        {
          name: "Earth",
          type: "earth_like",
          moons: [{ name: "Moon", type: "sub_mercurian", mass: 0.0123 }],
          orbitRadius: 1.0,
          mass: 1.0,
        },
        {
          name: "Mars",
          type: "desert",
          moons: [
            { name: "Phobos", type: "c_type_asteroid", mass: 1.78e-8 },
            { name: "Deimos", type: "c_type_asteroid", mass: 2.5e-9 },
          ],
          orbitRadius: 1.52,
          mass: 0.107,
        },
        {
          name: "Vesta",
          type: "s_type_asteroid",
          moons: [],
          orbitRadius: 2.36,
          mass: 0.000043,
        },
        {
          name: "Juno",
          type: "s_type_asteroid",
          moons: [],
          orbitRadius: 2.67,
          mass: 0.0000033,
        },
        {
          name: "Ceres",
          type: "dwarf",
          moons: [],
          orbitRadius: 2.77,
          mass: 0.00016,
        },
        {
          name: "Pallas",
          type: "c_type_asteroid",
          moons: [],
          orbitRadius: 2.77,
          mass: 0.000034,
        },
        {
          name: "67P/Churyumov-Gerasimenko",
          type: "short_period_comet",
          moons: [],
          orbitRadius: 3.46,
          mass: 1.7e-12,
        },
        {
          name: "Jupiter",
          type: "gas_giant",
          moons: [
            { name: "Io", type: "lava_ocean", mass: 0.015 },
            { name: "Europa", type: "ocean", mass: 0.008 },
            { name: "Ganymede", type: "ice", mass: 0.025 },
            { name: "Callisto", type: "ice", mass: 0.018 },
            { name: "Amalthea", type: "ice", mass: 2.1e-7 },
            { name: "Thebe", type: "rocky", mass: 3.1e-8 },
            { name: "Adrastea", type: "rocky", mass: 1.9e-9 },
            { name: "Metis", type: "rocky", mass: 1.2e-8 },
            { name: "Themisto", type: "irregular", mass: 1.1e-10 },
            { name: "Leda", type: "irregular", mass: 6.3e-11 },
            { name: "Himalia", type: "irregular", mass: 7.77e-7 },
            { name: "Lysithea", type: "irregular", mass: 7.7e-10 },
            { name: "Elara", type: "irregular", mass: 8.7e-8 },
            { name: "Dia", type: "irregular", mass: 7.9e-12 },
            { name: "Carpo", type: "irregular", mass: 1.28e-12 },
            { name: "Europa", type: "ocean", mass: 0.008 },
            { name: "Euporie", type: "irregular", mass: 5.3e-13 },
            { name: "Orthosie", type: "irregular", mass: 5.3e-13 },
            { name: "Pasithee", type: "irregular", mass: 5.3e-13 },
            { name: "Sponde", type: "irregular", mass: 5.3e-13 },
            { name: "Kale", type: "irregular", mass: 5.3e-13 },
            { name: "Pasiphae", type: "irregular", mass: 2.5e-8 },
            { name: "Sinope", type: "irregular", mass: 7.5e-9 },
            { name: "Callirrhoe", type: "irregular", mass: 4.1e-12 },
            { name: "Megaclite", type: "irregular", mass: 5.3e-13 },
            { name: "Taygete", type: "irregular", mass: 5.3e-13 },
            { name: "Chaldene", type: "irregular", mass: 5.3e-13 },
            { name: "Harpalyke", type: "irregular", mass: 5.3e-13 },
            { name: "Kalyke", type: "irregular", mass: 1.6e-12 },
            { name: "Iocaste", type: "irregular", mass: 7.9e-13 },
            { name: "Erinome", type: "irregular", mass: 5.3e-13 },
            { name: "Isonoe", type: "irregular", mass: 5.3e-13 },
            { name: "Praxidike", type: "irregular", mass: 1.8e-12 },
            { name: "Autonoe", type: "irregular", mass: 5.3e-13 },
            { name: "Thyone", type: "irregular", mass: 5.3e-13 },
            { name: "Hermippe", type: "irregular", mass: 5.3e-13 },
            { name: "Aitne", type: "irregular", mass: 5.3e-13 },
            { name: "Eurydome", type: "irregular", mass: 5.3e-13 },
            { name: "Euanthe", type: "irregular", mass: 5.3e-13 },
            { name: "Eupheme", type: "irregular", mass: 5.3e-13 },
            { name: "Orthosie", type: "irregular", mass: 5.3e-13 },
            { name: "Thyone", type: "irregular", mass: 5.3e-13 },
            { name: "Hermippe", type: "irregular", mass: 5.3e-13 },
            { name: "Ananke", type: "irregular", mass: 3.0e-10 },
            { name: "Carme", type: "irregular", mass: 1.3e-9 },
            { name: "Herse", type: "irregular", mass: 5.3e-13 },
            { name: "S/2021 J1", type: "irregular", mass: 5.3e-13 },
            { name: "S/2021 J2", type: "irregular", mass: 5.3e-13 },
            { name: "Mneme", type: "irregular", mass: 5.3e-13 },
            { name: "Aoede", type: "irregular", mass: 5.3e-13 },
            { name: "Kalyke", type: "irregular", mass: 1.6e-12 },
            { name: "Hegemone", type: "irregular", mass: 5.3e-13 },
            { name: "Kharon", type: "irregular", mass: 5.3e-13 },
            { name: "Eukelade", type: "irregular", mass: 5.3e-13 },
            { name: "Cyllene", type: "irregular", mass: 5.3e-13 },
            { name: "Eirene", type: "irregular", mass: 5.3e-13 },
            { name: "Philophrosyne", type: "irregular", mass: 5.3e-13 },
            { name: "Euporie", type: "irregular", mass: 5.3e-13 },
            { name: "Orbitar", type: "irregular", mass: 5.3e-13 },
            { name: "Chaldene", type: "irregular", mass: 5.3e-13 },
            { name: "Erinome", type: "irregular", mass: 5.3e-13 },
            { name: "Isonoe", type: "irregular", mass: 5.3e-13 },
            { name: "Praxidike", type: "irregular", mass: 1.8e-12 },
            { name: "Autonoe", type: "irregular", mass: 5.3e-13 },
            { name: "Thyone", type: "irregular", mass: 5.3e-13 },
            { name: "Hermippe", type: "irregular", mass: 5.3e-13 },
            { name: "Aitne", type: "irregular", mass: 5.3e-13 },
            { name: "Eurydome", type: "irregular", mass: 5.3e-13 },
            { name: "Euanthe", type: "irregular", mass: 5.3e-13 },
            { name: "Eupheme", type: "irregular", mass: 5.3e-13 },
            { name: "Orthosie", type: "irregular", mass: 5.3e-13 },
            { name: "Herse", type: "irregular", mass: 5.3e-13 },
            { name: "Kore", type: "irregular", mass: 5.3e-13 },
            { name: "Cyllene", type: "irregular", mass: 5.3e-13 },
            { name: "Eirene", type: "irregular", mass: 5.3e-13 },
            { name: "Philophrosyne", type: "irregular", mass: 5.3e-13 },
            { name: "S/2003 J2", type: "irregular", mass: 5.3e-13 },
            { name: "S/2011 J1", type: "irregular", mass: 5.3e-13 },
            { name: "S/2017 J1", type: "irregular", mass: 5.3e-13 },
            { name: "S/2016 J1", type: "irregular", mass: 5.3e-13 },
            { name: "S/2018 J2", type: "irregular", mass: 5.3e-13 },
            { name: "S/2021 J1", type: "irregular", mass: 5.3e-13 },
            { name: "S/2021 J2", type: "irregular", mass: 5.3e-13 },

            // Continue for remaining ~97 moons as needed using recent NASA lists
          ],
          orbitRadius: 5.2,
          mass: 317.8,
        },

        {
          name: "624 Hektor",
          type: "trojan_asteroid",
          moons: [{ name: "Scamandrius", type: "ice" }],
          orbitRadius: 5.2,
          mass: 1.3e-6,
        },
        {
          name: "Saturn",
          type: "ringed_gas_giant",
          moons: [
            { name: "Mimas", type: "ice", mass: 6.3e-6 },
            { name: "Enceladus", type: "ocean", mass: 1.8e-5 },
            { name: "Tethys", type: "ice", mass: 0.0001 },
            { name: "Dione", type: "ice", mass: 0.00018 },
            { name: "Rhea", type: "ice", mass: 0.00039 },
            { name: "Titan", type: "ice", mass: 0.0225 },
            { name: "Iapetus", type: "ice", mass: 0.0003 },
            { name: "Janus", type: "ice", mass: 1.9e-6 },
            { name: "Epimetheus", type: "ice", mass: 5.3e-7 },
            { name: "Hyperion", type: "ice", mass: 5.6e-5 },
            { name: "Phoebe", type: "carbonaceous", mass: 8.3e-6 },
            { name: "Pan", type: "ice", mass: 8.6e-12 },
            { name: "Atlas", type: "ice", mass: 6.6e-13 },
            { name: "Prometheus", type: "ice", mass: 1.6e-10 },
            { name: "Pandora", type: "ice", mass: 1.4e-10 },
            { name: "Telesto", type: "ice", mass: ~3.6e-13 },
            { name: "Calypso", type: "ice", mass: ~3.5e-13 },
            { name: "Helene", type: "ice", mass: ~7.5e-13 },
          ],
          orbitRadius: 9.54,
          mass: 95.2,
        },
        {
          name: "1P/Halley",
          type: "short_period_comet",
          moons: [],
          orbitRadius: 17.8,
          mass: 3.7e-11,
        },
        {
          name: "Uranus",
          type: "ice_giant",
          moons: [
            { name: "Miranda", type: "ice", mass: 1.1e-5 },
            { name: "Ariel", type: "ice", mass: 0.00022 },
            { name: "Umbriel", type: "ice", mass: 0.0002 },
            { name: "Titania", type: "ice", mass: 0.00059 },
            { name: "Oberon", type: "ice", mass: 0.00051 },
            { name: "Cordelia", type: "ice", mass: 1.5e-10 },
            { name: "Ophelia", type: "ice", mass: 1.8e-10 },
            { name: "Bianca", type: "ice", mass: 3.8e-10 },
            { name: "Cressida", type: "ice", mass: 1.2e-9 },
            { name: "Desdemona", type: "ice", mass: 6.6e-10 },
            { name: "Juliet", type: "ice", mass: 1.9e-9 },
            { name: "Portia", type: "ice", mass: 4.7e-9 },
            { name: "Rosalind", type: "ice", mass: 1.1e-9 },
            { name: "Belinda", type: "ice", mass: 1.2e-9 },
            { name: "Perdita", type: "ice", mass: 9.2e-11 },
            { name: "Puck", type: "ice", mass: 2.3e-8 },
            { name: "Mab", type: "ice", mass: 7.1e-11 },
            { name: "Cupid", type: "ice", mass: 7.1e-11 },
            { name: "Francisco", type: "irregular", mass: 8.5e-11 },
            { name: "Caliban", type: "irregular", mass: 6.3e-8 },
            { name: "Stephano", type: "irregular", mass: 5.8e-10 },
            { name: "Trinculo", type: "irregular", mass: 1.2e-10 },
            { name: "Sycorax", type: "irregular", mass: 1.7e-7 },
            { name: "Margaret", type: "irregular", mass: 1.2e-10 },
            { name: "Prospero", type: "irregular", mass: 7.7e-10 },
            { name: "Setebos", type: "irregular", mass: 7.2e-10 },
            { name: "Ferdinand", type: "irregular", mass: 1.9e-10 },
            { name: "S/2023 U1", type: "irregular", mass: 5.7e-11 },
          ],
          orbitRadius: 19.2,
          mass: 14.5,
        },

        {
          name: "Neptune",
          type: "ice_giant",
          moons: [
            { name: "Triton", type: "ice", mass: 0.0035 },
            { name: "Nereid", type: "ice", mass: 5.2e-6 },
            { name: "Proteus", type: "ice", mass: 8.4e-6 },
          ],
          orbitRadius: 30.1,
          mass: 17.1,
        },
        {
          name: "Pluto",
          type: "ice",
          moons: [
            { name: "Charon", type: "ice", mass: 0.00025 },
            { name: "Styx", type: "ice", mass: 1.3e-9 },
            { name: "Nix", type: "ice", mass: 7.5e-9 },
            { name: "Kerberos", type: "ice", mass: 2.7e-9 },
            { name: "Hydra", type: "ice", mass: 8.0e-9 },
          ],
          orbitRadius: 39.5,
          mass: 0.0022,
        },
        {
          name: "Haumea",
          type: "dwarf",
          moons: [
            { name: "Namaka", type: "ice", mass: 2.9e-7 },
            { name: "Hi'iaka", type: "ice", mass: 3.2e-6 },
          ],
          orbitRadius: 43.1,
          mass: 0.0007,
        },
        {
          name: "Makemake",
          type: "dwarf",
          moons: [{ name: "MK 2", type: "ice", mass: 8.4e-8 }],
          orbitRadius: 45.8,
          mass: 0.0005,
        },
        {
          name: "Eris",
          type: "dwarf",
          moons: [{ name: "Dysnomia", type: "ice", mass: 6.2e-5 }],
          orbitRadius: 67.7,
          mass: 0.0028,
        },
        {
          name: "C/1995 O1 (Hale-Bopp)",
          type: "long_period_comet",
          moons: [],
          orbitRadius: 186.0,
          mass: 3.7e-8,
        },
      ],
    },

    // Nearest stars (within 10 ly - keep original planets)
    "proxima centauri": {
      name: "Proxima Centauri",
      type: "M",
      mass: 0.122,
      radius: 0.154,
      temperature: 3042,
      position: { x: -1.64, y: -1.87, z: -3.77 },
      planets: [
        {
          name: "Proxima b",
          type: "rocky",
          moons: [],
          orbitRadius: 0.05,
          mass: 1.17,
        },
        {
          name: "Proxima c",
          type: "ice_giant",
          moons: [],
          orbitRadius: 1.49,
          mass: 7.0,
        },
      ],
    },

    "alpha centauri": {
      name: "Alpha Centauri",
      type: "G",
      mass: 3.8735,
      radius: 2.033,
      temperature: 5790,
      position: { x: -1.68, y: -1.36, z: -3.84 },
      binary: true,
      planets: [],
    },

    "barnard's star": {
      name: "Barnard's Star",
      type: "M",
      mass: 0.144,
      radius: 0.196,
      temperature: 3134,
      position: { x: -0.47, y: 5.94, z: 0.49 },
      planets: [
        {
          name: "Barnard's Star b",
          type: "ice",
          moons: [],
          orbitRadius: 0.4,
          mass: 3.2,
        },
      ],
    },

    "wolf 359": {
      name: "Wolf 359",
      type: "M",
      mass: 0.09,
      radius: 0.16,
      temperature: 2800,
      position: { x: 2.39, y: -3.89, z: 6.57 },
      planets: [],
    },

    "lalande 21185": {
      name: "Lalande 21185",
      type: "M",
      mass: 0.46,
      radius: 0.393,
      temperature: 3600,
      position: { x: -6.51, y: -1.66, z: 4.85 },
      planets: [],
    },

    sirius: {
      name: "Sirius",
      type: "A",
      mass: 2.063,
      radius: 1.711,
      temperature: 9940,
      position: { x: -1.64, y: -5.32, z: -8.06 },
      binary: true,
      planets: [],
    },

    "wise 0855−0714": {
      name: "WISE 0855−0714",
      type: "Y",
      mass: 0.03,
      radius: 0.1,
      temperature: 250,
      position: { x: 2.33, y: -3.27, z: -5.95 },
      planets: [],
    },

    // Stars beyond 10 ly - add procedural planets
    "luyten's star": {
      name: "Luyten's Star",
      type: "M",
      mass: 0.26,
      radius: 0.35,
      temperature: 3200,
      position: { x: 9.45, y: -1.34, z: 7.93 },
      planets: [
        {
          name: "GJ 273 b",
          type: "rocky",
          moons: [],
          orbitRadius: 0.09,
          mass: 2.89,
        },
        {
          name: "GJ 273 c",
          type: "ice",
          moons: [],
          orbitRadius: 0.06,
          mass: 1.18,
        },
        {
          name: "GJ 273 d",
          type: "sub_earth",
          moons: [],
          orbitRadius: 0.38,
          mass: 0.35,
          atmosphere: true,
        },
        {
          name: "GJ 273 e",
          type: "ice_giant",
          moons: [],
          orbitRadius: 2.1,
          mass: 12.4,
          atmosphere: true,
        },
      ],
    },

    "ross 154": {
      name: "Ross 154",
      type: "M",
      mass: 0.17,
      radius: 0.24,
      temperature: 3340,
      position: { x: -4.69, y: -8.48, z: -1.84 },
      planets: [
        {
          name: "Ross 154 b",
          type: "mercurian",
          moons: [],
          orbitRadius: 0.05,
          mass: 0.15,
          atmosphere: false,
        },
        {
          name: "Ross 154 c",
          type: "desert",
          moons: [],
          orbitRadius: 0.28,
          mass: 0.78,
          atmosphere: true,
        },
        {
          name: "Ross 154 d",
          type: "ice",
          moons: [],
          orbitRadius: 1.6,
          mass: 2.3,
          atmosphere: true,
        },
      ],
    },

    "ross 248": {
      name: "Ross 248",
      type: "M",
      mass: 0.16,
      radius: 0.19,
      temperature: 3200,
      position: { x: 7.33, y: 0.65, z: 7.26 },
      planets: [
        {
          name: "Ross 248 b",
          type: "lava_ocean",
          moons: [],
          orbitRadius: 0.04,
          mass: 1.2,
          atmosphere: true,
        },
        {
          name: "Ross 248 c",
          type: "sub_earth",
          moons: [],
          orbitRadius: 0.22,
          mass: 0.41,
          atmosphere: false,
        },
      ],
    },

    "epsilon eridani": {
      name: "Epsilon Eridani",
      type: "K",
      mass: 0.82,
      radius: 0.74,
      temperature: 5076,
      position: { x: 1.93, y: -8.78, z: -5.55 },
      planets: [
        {
          name: "Epsilon Eridani b",
          type: "gas_giant",
          moons: [],
          orbitRadius: 3.39,
          mass: 247.8,
        },
        {
          name: "Epsilon Eridani c",
          type: "ice_giant",
          moons: [],
          orbitRadius: 5.8,
          mass: 28.3,
          atmosphere: true,
        },
        {
          name: "Epsilon Eridani d",
          type: "dwarf",
          moons: [],
          orbitRadius: 8.9,
          mass: 0.08,
          atmosphere: false,
        },
      ],
    },

    procyon: {
      name: "Procyon",
      type: "F",
      mass: 1.499,
      radius: 2.048,
      temperature: 6530,
      position: { x: -4.77, y: -2.87, z: 10.3 },
      binary: true,
      planets: [
        {
          name: "Procyon b",
          type: "hot_jupiter",
          moons: [],
          orbitRadius: 0.15,
          mass: 187.5,
          atmosphere: true,
        },
        {
          name: "Procyon c",
          type: "super_earth",
          moons: [],
          orbitRadius: 1.8,
          mass: 5.6,
          atmosphere: true,
        },
        {
          name: "Procyon d",
          type: "ice_giant",
          moons: [],
          orbitRadius: 4.2,
          mass: 22.8,
          atmosphere: true,
        },
      ],
    },

    "61 cygni": {
      name: "61 Cygni",
      type: "K",
      mass: 0.7,
      radius: 0.665,
      temperature: 4400,
      position: { x: 6.51, y: 6.1, z: 7.13 },
      binary: true,
      planets: [
        {
          name: "61 Cygni Ab",
          type: "rocky",
          moons: [],
          orbitRadius: 0.42,
          mass: 1.3,
          atmosphere: true,
        },
        {
          name: "61 Cygni Ac",
          type: "ocean",
          moons: [],
          orbitRadius: 0.95,
          mass: 1.8,
          atmosphere: true,
        },
        {
          name: "61 Cygni Ad",
          type: "gas_giant",
          moons: [],
          orbitRadius: 3.7,
          mass: 89.4,
          atmosphere: true,
        },
      ],
    },

    capella: {
      name: "Capella",
      type: "G",
      mass: 2.7,
      radius: 12.2,
      temperature: 4940,
      position: { x: -4.53, y: 39.45, z: 13.95 },
      binary: true,
      planets: [
        {
          name: "Capella b",
          type: "chthonian",
          moons: [],
          orbitRadius: 0.08,
          mass: 1.4,
          atmosphere: false,
        },
        {
          name: "Capella c",
          type: "warm_jupiter",
          moons: [],
          orbitRadius: 2.3,
          mass: 76.5,
          atmosphere: true,
        },
        {
          name: "Capella d",
          type: "ice_giant",
          moons: [],
          orbitRadius: 7.8,
          mass: 34.2,
          atmosphere: true,
        },
      ],
    },

    vega: {
      name: "Vega",
      type: "A",
      mass: 2.14,
      radius: 2.36,
      temperature: 9602,
      position: { x: 7.68, y: 14.62, z: 19.17 },
      planets: [
        {
          name: "Vega b",
          type: "plasma",
          moons: [],
          orbitRadius: 0.12,
          mass: 3.4,
          atmosphere: true,
        },
        {
          name: "Vega c",
          type: "mega_iron",
          moons: [],
          orbitRadius: 0.68,
          mass: 6.7,
          atmosphere: false,
        },
        {
          name: "Vega d",
          type: "gas_giant",
          moons: [],
          orbitRadius: 4.5,
          mass: 234.5,
          atmosphere: true,
        },
        {
          name: "Vega e",
          type: "ice_giant",
          moons: [],
          orbitRadius: 9.2,
          mass: 41.3,
          atmosphere: true,
        },
      ],
    },

    altair: {
      name: "Altair",
      type: "A",
      mass: 1.79,
      radius: 1.79,
      temperature: 7550,
      position: { x: 7.16, y: 14.13, z: 2.77 },
      planets: [
        {
          name: "Altair b",
          type: "lava_ocean",
          moons: [],
          orbitRadius: 0.18,
          mass: 2.3,
          atmosphere: true,
        },
        {
          name: "Altair c",
          type: "desert",
          moons: [],
          orbitRadius: 0.82,
          mass: 1.1,
          atmosphere: true,
        },
        {
          name: "Altair d",
          type: "mini_neptune",
          moons: [],
          orbitRadius: 2.4,
          mass: 3.8,
          atmosphere: true,
        },
      ],
    },

    arcturus: {
      name: "Arcturus",
      type: "K",
      mass: 1.08,
      radius: 25.4,
      temperature: 4286,
      position: { x: 14.27, y: 19.18, z: 28.71 },
      planets: [
        {
          name: "Arcturus b",
          type: "hot_jupiter",
          moons: [],
          orbitRadius: 0.25,
          mass: 312.4,
          atmosphere: true,
        },
        {
          name: "Arcturus c",
          type: "carbon",
          moons: [],
          orbitRadius: 1.8,
          mass: 3.2,
          atmosphere: true,
        },
        {
          name: "Arcturus d",
          type: "cold_jupiter",
          moons: [],
          orbitRadius: 12.5,
          mass: 178.9,
          atmosphere: true,
        },
      ],
    },

    betelgeuse: {
      name: "Betelgeuse",
      type: "M",
      mass: 11.6,
      radius: 887,
      temperature: 3500,
      position: { x: 199.7, y: -148.7, z: 587.1 },
      planets: [
        {
          name: "Betelgeuse b",
          type: "magma_planet",
          moons: [],
          orbitRadius: 4.5,
          mass: 5.6,
          atmosphere: true,
        },
        {
          name: "Betelgeuse c",
          type: "rogue",
          moons: [],
          orbitRadius: 8.9,
          mass: 234.5,
          atmosphere: false,
        },
      ],
    },

    rigel: {
      name: "Rigel",
      type: "B",
      mass: 21.0,
      radius: 78.9,
      temperature: 12100,
      position: { x: 237.1, y: -425.6, z: -716.3 },
      planets: [
        {
          name: "Rigel b",
          type: "plasma",
          moons: [],
          orbitRadius: 8.5,
          mass: 8.9,
          atmosphere: true,
        },
        {
          name: "Rigel c",
          type: "diamond",
          moons: [],
          orbitRadius: 1.8,
          mass: 15.6,
          atmosphere: true,
        },
        {
          name: "Rigel d",
          type: "cold_jupiter",
          moons: [],
          orbitRadius: 4.2,
          mass: 267.3,
          atmosphere: true,
        },
      ],
    },

    polaris: {
      name: "Polaris",
      type: "F",
      mass: 5.4,
      radius: 37.5,
      temperature: 6015,
      position: { x: -32.6, y: 431.3, z: 5.75 },
      binary: true,
      planets: [
        {
          name: "Polaris b",
          type: "chthonian",
          moons: [],
          orbitRadius: 4.2,
          mass: 1.8,
          atmosphere: false,
        },
        {
          name: "Polaris c",
          type: "warm_jupiter",
          moons: [],
          orbitRadius: 7.8,
          mass: 89.4,
          atmosphere: true,
        },
        {
          name: "Polaris d",
          type: "ringed_gas_giant",
          moons: [],
          orbitRadius: 1.56,
          mass: 456.7,
          atmosphere: true,
        },
      ],
    },

    spica: {
      name: "Spica",
      type: "B",
      mass: 10.25,
      radius: 7.47,
      temperature: 25400,
      position: { x: 93.71, y: -118.2, z: -197.9 },
      binary: true,
      planets: [
        {
          name: "Spica b",
          type: "plasma",
          moons: [],
          orbitRadius: 1.2,
          mass: 4.5,
          atmosphere: true,
        },
        {
          name: "Spica c",
          type: "magnetar",
          moons: [],
          orbitRadius: 2.8,
          mass: 1.7,
          atmosphere: true,
        },
      ],
    },

    fomalhaut: {
      name: "Fomalhaut",
      type: "A",
      mass: 1.92,
      radius: 1.84,
      temperature: 8590,
      position: { x: 17.23, y: -7.76, z: -16.34 },
      planets: [
        {
          name: "Fomalhaut b",
          type: "gas_giant",
          moons: [],
          orbitRadius: 1.15,
          mass: 234.5,
        },
        {
          name: "Fomalhaut c",
          type: "ice",
          moons: [],
          orbitRadius: 0.45,
          mass: 2.1,
          atmosphere: true,
        },
        {
          name: "Fomalhaut d",
          type: "super_earth",
          moons: [],
          orbitRadius: 1.2,
          mass: 7.8,
          atmosphere: true,
        },
        {
          name: "Fomalhaut e",
          type: "mini_neptune",
          moons: [],
          orbitRadius: 3.4,
          mass: 3.6,
          atmosphere: true,
        },
      ],
    },

    "trappist-1": {
      name: "TRAPPIST-1",
      type: "M",
      mass: 0.089,
      radius: 0.121,
      temperature: 2550,
      position: { x: 12.4, y: -27.1, z: -24.5 },
      planets: [
        {
          name: "TRAPPIST-1b",
          type: "rocky",
          moons: [],
          orbitRadius: 0.011,
          mass: 1.02,
        },
        {
          name: "TRAPPIST-1c",
          type: "rocky",
          moons: [],
          orbitRadius: 0.015,
          mass: 1.16,
        },
        {
          name: "TRAPPIST-1d",
          type: "rocky",
          moons: [],
          orbitRadius: 0.022,
          mass: 0.3,
        },
        {
          name: "TRAPPIST-1e",
          type: "ocean",
          moons: [],
          orbitRadius: 0.029,
          mass: 0.77,
        },
        {
          name: "TRAPPIST-1f",
          type: "rocky",
          moons: [],
          orbitRadius: 0.038,
          mass: 0.93,
        },
        {
          name: "TRAPPIST-1g",
          type: "rocky",
          moons: [],
          orbitRadius: 0.047,
          mass: 1.15,
        },
        {
          name: "TRAPPIST-1h",
          type: "ice",
          moons: [],
          orbitRadius: 0.062,
          mass: 0.33,
        },
      ],
    },

    "kepler-186": {
      name: "Kepler-186",
      type: "M",
      mass: 0.475,
      radius: 0.47,
      temperature: 3788,
      position: { x: 178.4, y: 553.2, z: 29.7 },
      planets: [
        {
          name: "Kepler-186b",
          type: "rocky",
          moons: [],
          orbitRadius: 0.03,
          mass: 1.58,
        },
        {
          name: "Kepler-186c",
          type: "rocky",
          moons: [],
          orbitRadius: 0.05,
          mass: 2.3,
        },
        {
          name: "Kepler-186d",
          type: "rocky",
          moons: [],
          orbitRadius: 0.1,
          mass: 1.12,
        },
        {
          name: "Kepler-186e",
          type: "rocky",
          moons: [],
          orbitRadius: 0.17,
          mass: 1.35,
        },
        {
          name: "Kepler-186f",
          type: "ocean",
          moons: [],
          orbitRadius: 0.36,
          mass: 1.11,
        },
      ],
    },

    canopus: {
      name: "Canopus",
      type: "F",
      mass: 8.0,
      radius: 71,
      temperature: 7350,
      position: { x: 73.66, y: -190.3, z: -234.3 },
      planets: [
        {
          name: "Canopus b",
          type: "hot_jupiter",
          moons: [],
          orbitRadius: 7.8,
          mass: 423.5,
          atmosphere: true,
        },
        {
          name: "Canopus c",
          type: "ringed_gas_giant",
          moons: [],
          orbitRadius: 1.45,
          mass: 567.8,
          atmosphere: true,
        },
        {
          name: "Canopus d",
          type: "ice_giant",
          moons: [],
          orbitRadius: 2.34,
          mass: 45.6,
          atmosphere: true,
        },
      ],
    },

    aldebaran: {
      name: "Aldebaran",
      type: "K",
      mass: 1.16,
      radius: 44.2,
      temperature: 3910,
      position: { x: 18.93, y: -21.09, z: -58.86 },
      planets: [
        {
          name: "Aldebaran b",
          type: "gas_giant",
          moons: [],
          orbitRadius: 1.34,
          mass: 183.6,
        },
        {
          name: "Aldebaran c",
          type: "desert",
          moons: [],
          orbitRadius: 4.8,
          mass: 1.2,
          atmosphere: true,
        },
        {
          name: "Aldebaran d",
          type: "cold_jupiter",
          moons: [],
          orbitRadius: 8.6,
          mass: 234.5,
          atmosphere: true,
        },
      ],
    },

    antares: {
      name: "Antares",
      type: "M",
      mass: 12.4,
      radius: 680,
      temperature: 3500,
      position: { x: 424.4, y: -110.9, z: -326.4 },
      binary: true,
      planets: [
        {
          name: "Antares b",
          type: "magma_planet",
          moons: [],
          orbitRadius: 3.45,
          mass: 6.7,
          atmosphere: true,
        },
        {
          name: "Antares c",
          type: "rogue",
          moons: [],
          orbitRadius: 7.8,
          mass: 456.7,
          atmosphere: false,
        },
      ],
    },

    deneb: {
      name: "Deneb",
      type: "A",
      mass: 19,
      radius: 203,
      temperature: 8525,
      position: { x: 989.5, y: 1833.2, z: 1555.1 },
      planets: [
        {
          name: "Deneb b",
          type: "plasma",
          moons: [],
          orbitRadius: 2.1,
          mass: 12.3,
          atmosphere: true,
        },
        {
          name: "Deneb c",
          type: "diamond",
          moons: [],
          orbitRadius: 3.8,
          mass: 18.9,
          atmosphere: true,
        },
        {
          name: "Deneb d",
          type: "cold_jupiter",
          moons: [],
          orbitRadius: 6.8,
          mass: 378.9,
          atmosphere: true,
        },
      ],
    },

    pollux: {
      name: "Pollux",
      type: "K",
      mass: 1.91,
      radius: 8.8,
      temperature: 4851,
      position: { x: -15.91, y: 17.63, z: 23.21 },
      planets: [
        {
          name: "Pollux b",
          type: "gas_giant",
          moons: [],
          orbitRadius: 1.64,
          mass: 72.8,
        },
        {
          name: "Pollux c",
          type: "earth_like",
          moons: [],
          orbitRadius: 1.2,
          mass: 1.4,
          atmosphere: true,
        },
        {
          name: "Pollux d",
          type: "ice_giant",
          moons: [],
          orbitRadius: 2.4,
          mass: 28.9,
          atmosphere: true,
        },
      ],
    },

    "ross 128": {
      name: "Ross 128",
      type: "M",
      mass: 0.168,
      radius: 0.2,
      temperature: 3192,
      position: { x: -0.83, y: 10.87, z: -1.57 },
      planets: [
        {
          name: "Ross 128 b",
          type: "rocky",
          moons: [],
          orbitRadius: 0.045,
          mass: 1.35,
        },
        {
          name: "Ross 128 c",
          type: "ice",
          moons: [],
          orbitRadius: 0.28,
          mass: 2.3,
          atmosphere: true,
        },
        {
          name: "Ross 128 d",
          type: "mini_neptune",
          moons: [],
          orbitRadius: 1.4,
          mass: 3.2,
          atmosphere: true,
        },
      ],
    },

    achernar: {
      name: "Achernar",
      type: "B",
      mass: 6.7,
      radius: 9.3,
      temperature: 15000,
      position: { x: 36.47, y: -114.8, z: -67.95 },
      planets: [
        {
          name: "Achernar b",
          type: "plasma",
          moons: [],
          orbitRadius: 1.1,
          mass: 5.6,
          atmosphere: true,
        },
        {
          name: "Achernar c",
          type: "mega_iron",
          moons: [],
          orbitRadius: 2.8,
          mass: 8.9,
          atmosphere: false,
        },
        {
          name: "Achernar d",
          type: "warm_jupiter",
          moons: [],
          orbitRadius: 6.5,
          mass: 89.4,
          atmosphere: true,
        },
      ],
    },

    "gamma crucis": {
      name: "Gamma Crucis",
      type: "M",
      mass: 1.5,
      radius: 120,
      temperature: 3600,
      position: { x: 54.14, y: -51.31, z: -45.49 },
      planets: [
        {
          name: "Gamma Crucis b",
          type: "lava_ocean",
          moons: [],
          orbitRadius: 6.2,
          mass: 3.4,
          atmosphere: true,
        },
        {
          name: "Gamma Crucis c",
          type: "gas_giant",
          moons: [],
          orbitRadius: 1.34,
          mass: 267.8,
          atmosphere: true,
        },
      ],
    },

    sadr: {
      name: "Sadr",
      type: "F",
      mass: 12,
      radius: 150,
      temperature: 6100,
      position: { x: 556.2, y: 1714.7, z: 49.3 },
      planets: [
        {
          name: "Sadr b",
          type: "chthonian",
          moons: [],
          orbitRadius: 1.56,
          mass: 1.8,
          atmosphere: false,
        },
        {
          name: "Sadr c",
          type: "ringed_gas_giant",
          moons: [],
          orbitRadius: 3.24,
          mass: 678.9,
          atmosphere: true,
        },
      ],
    },

    mira: {
      name: "Mira",
      type: "M",
      mass: 1.2,
      radius: 332,
      temperature: 2918,
      position: { x: 70.8, y: -251.7, z: -143.2 },
      binary: true,
      planets: [
        {
          name: "Mira b",
          type: "rogue",
          moons: [],
          orbitRadius: 3.45,
          mass: 345.6,
          atmosphere: false,
        },
        {
          name: "Mira c",
          type: "ice",
          moons: [],
          orbitRadius: 5.67,
          mass: 3.4,
          atmosphere: true,
        },
      ],
    },

    "eta carinae": {
      name: "Eta Carinae",
      type: "O",
      mass: 100,
      radius: 240,
      temperature: 35000,
      position: { x: 4619.3, y: -4891.2, z: -3216.7 },
      binary: true,
      planets: [
        {
          name: "Eta Carinae b",
          type: "plasma",
          moons: [],
          orbitRadius: 4.56,
          mass: 34.5,
          atmosphere: true,
        },
        {
          name: "Eta Carinae c",
          type: "quark_planet",
          moons: [],
          orbitRadius: 8.9,
          mass: 1.8,
          atmosphere: true,
        },
      ],
    },

    "UY scuti": {
      name: "UY Scuti",
      type: "M",
      mass: 7,
      radius: 1700,
      temperature: 3365,
      position: { x: 2943.5, y: -9030.2, z: 254.7 },
      planets: [
        {
          name: "UY Scuti b",
          type: "magma_planet",
          moons: [],
          orbitRadius: 1.78,
          mass: 7.8,
          atmosphere: true,
        },
      ],
    },

    "delta cephei": {
      name: "Delta Cephei",
      type: "F",
      mass: 4.5,
      radius: 44.5,
      temperature: 5800,
      position: { x: 267.3, y: 844.2, z: 13.9 },
      binary: true,
      planets: [
        {
          name: "Delta Cephei b",
          type: "warm_jupiter",
          moons: [],
          orbitRadius: 4.8,
          mass: 67.8,
          atmosphere: true,
        },
        {
          name: "Delta Cephei c",
          type: "ringed_gas_giant",
          moons: [],
          orbitRadius: 9.8,
          mass: 456.7,
          atmosphere: true,
        },
      ],
    },

    "pistol star": {
      name: "Pistol Star",
      type: "O",
      mass: 120,
      radius: 420,
      temperature: 30000,
      position: { x: 24750, y: -3875, z: 125 },
      planets: [
        {
          name: "Pistol Star b",
          type: "plasma",
          moons: [],
          orbitRadius: 8.9,
          mass: 45.6,
          atmosphere: true,
        },
      ],
    },

    "v838 monocerotis": {
      name: "V838 Monocerotis",
      type: "L",
      mass: 8,
      radius: 1570,
      temperature: 2000,
      position: { x: 6184, y: -19012, z: -536 },
      planets: [
        {
          name: "V838 Mon b",
          type: "rogue",
          moons: [],
          orbitRadius: 2.34,
          mass: 567.8,
          atmosphere: false,
        },
      ],
    },

    "teegarden's star": {
      name: "Teegarden's Star",
      type: "M",
      mass: 0.09,
      radius: 0.1,
      temperature: 2700,
      position: { x: 2.95, y: -11.47, z: -3.89 },
      planets: [
        {
          name: "Teegarden b",
          type: "rocky",
          moons: [],
          orbitRadius: 0.025,
          mass: 1.05,
        },
        {
          name: "Teegarden c",
          type: "rocky",
          moons: [],
          orbitRadius: 0.045,
          mass: 1.11,
        },
        {
          name: "Teegarden d",
          type: "ice",
          moons: [],
          orbitRadius: 0.18,
          mass: 1.8,
          atmosphere: true,
        },
      ],
    },

    "yz ceti": {
      name: "YZ Ceti",
      type: "M",
      mass: 0.13,
      radius: 0.17,
      temperature: 3050,
      position: { x: 2.03, y: -11.14, z: -4.21 },
      planets: [
        {
          name: "YZ Ceti b",
          type: "rocky",
          moons: [],
          orbitRadius: 0.02,
          mass: 0.7,
        },
        {
          name: "YZ Ceti c",
          type: "rocky",
          moons: [],
          orbitRadius: 0.03,
          mass: 1.14,
        },
        {
          name: "YZ Ceti d",
          type: "sub_earth",
          moons: [],
          orbitRadius: 0.08,
          mass: 0.34,
          atmosphere: false,
        },
      ],
    },

    "van maanen's star": {
      name: "Van Maanen's Star",
      type: "D",
      mass: 0.68,
      radius: 0.011,
      temperature: 6030,
      position: { x: 13.93, y: -1.32, z: -1.74 },
      planets: [
        {
          name: "Van Maanen b",
          type: "chthonian",
          moons: [],
          orbitRadius: 0.8,
          mass: 1.2,
          atmosphere: false,
        },
      ],
    },

    "groombridge 34": {
      name: "Groombridge 34",
      type: "M",
      mass: 0.38,
      radius: 0.38,
      temperature: 3500,
      position: { x: 7.61, y: 8.08, z: 3.34 },
      binary: true,
      planets: [
        {
          name: "Groombridge 34 Ab",
          type: "rocky",
          moons: [],
          orbitRadius: 0.15,
          mass: 5.2,
        },
      ],
    },

    "tau ceti": {
      name: "Tau Ceti",
      type: "G",
      mass: 0.78,
      radius: 0.79,
      temperature: 5344,
      position: { x: 1.75, y: -10.34, z: -5.7 },
      planets: [
        {
          name: "Tau Ceti f",
          type: "rocky",
          moons: [],
          orbitRadius: 1.35,
          mass: 6.7,
        },
        {
          name: "Tau Ceti e",
          type: "rocky",
          moons: [],
          orbitRadius: 0.55,
          mass: 4.3,
        },
      ],
    },

    "zeta reticuli a": {
      name: "Zeta Reticuli A",
      type: "G",
      mass: 0.97,
      radius: 0.94,
      temperature: 5730,
      position: { x: 21.46, y: -31.33, z: -7.02 },
      binary: true,
      planets: [
        {
          name: "Zeta A I",
          type: "rocky",
          moons: [],
          orbitRadius: 0.9,
          mass: 1.1,
        },
        {
          name: "Zeta A II",
          type: "ocean",
          moons: [],
          orbitRadius: 1.5,
          mass: 1.3,
        },
      ],
    },

    "hip 15330": {
      name: "HIP 15330",
      type: "K",
      mass: 0.75,
      radius: 0.78,
      temperature: 4600,
      position: { x: 20.51, y: -31.27, z: -7.62 },
      planets: [],
    },

    "gliese 86": {
      name: "Gliese 86",
      type: "K",
      mass: 0.79,
      radius: 0.83,
      temperature: 4780,
      position: { x: 16.14, y: -39.85, z: -0.97 },
      planets: [
        {
          name: "Gliese 86 b",
          type: "hot_jupiter",
          moons: [],
          orbitRadius: 0.11,
          mass: 4.0,
        },
      ],
    },

    "Sagittarius A*": {
      name: "Sagittarius A*",
      type: "supermassive_black_hole",
      mass: 4000000, // in solar masses (≈ 4 × 10^6 M☉)
      radius: 0.08, // Schwarzschild radius in AU ≈ 12.7 million km
      temperature: null, // event horizon has no surface temperature
      position: { x: -5900.17, y: -8000.89, z: -3.21 }, // keep your galaxy coords
      planets: [],
    },

    "hr 8832": {
      name: "HR 8832",
      type: "F",
      mass: 1.3,
      radius: 1.5,
      temperature: 6500,
      position: { x: 21.17, y: -27.89, z: -3.21 },
      planets: [],
    },

    bellatrix: {
      name: "Bellatrix",
      type: "B",
      mass: 8.6,
      radius: 5.8,
      temperature: 22000,
      position: { x: 73.15, y: -122.4, z: -194.1 },
      planets: [],
    },

    algol: {
      name: "Algol",
      type: "B",
      mass: 3.7,
      radius: 2.9,
      temperature: 13000,
      position: { x: -20.36, y: 88.71, z: -17.43 },
      binary: true,
      planets: [],
    },

    castor: {
      name: "Castor",
      type: "A",
      mass: 2.2,
      radius: 1.6,
      temperature: 10286,
      position: { x: -24.14, y: 31.57, z: 33.63 },
      binary: true,
      planets: [],
    },

    regulus: {
      name: "Regulus",
      type: "B",
      mass: 3.8,
      radius: 3.15,
      temperature: 12460,
      position: { x: -41.09, y: 56.04, z: 32.38 },
      planets: [],
    },

    scheat: {
      name: "Scheat",
      type: "M",
      mass: 2.0,
      radius: 95,
      temperature: 3700,
      position: { x: 59.95, y: 168.3, z: 72.84 },
      planets: [],
    },

    denebola: {
      name: "Denebola",
      type: "A",
      mass: 1.78,
      radius: 1.73,
      temperature: 8500,
      position: { x: -20.26, y: 25.31, z: 14.57 },
      planets: [],
    },

    merak: {
      name: "Merak",
      type: "A",
      mass: 2.7,
      radius: 2.4,
      temperature: 9275,
      position: { x: -41.16, y: 54.09, z: 33.87 },
      planets: [],
    },

    dubhe: {
      name: "Dubhe",
      type: "F",
      mass: 4.25,
      radius: 27.0,
      temperature: 5300,
      position: { x: -62.31, y: 82.47, z: 58.84 },
      planets: [],
    },

    miaplacidus: {
      name: "Miaplacidus",
      type: "A",
      mass: 3.5,
      radius: 6.8,
      temperature: 8200,
      position: { x: 33.39, y: -94.02, z: -53.21 },
      planets: [],
    },

    anser: {
      name: "Anser",
      type: "K",
      mass: 1.3,
      radius: 9.5,
      temperature: 4750,
      position: { x: 127.31, y: 307.84, z: 12.47 },
      planets: [],
    },

    saiph: {
      name: "Saiph",
      type: "B",
      mass: 15.5,
      radius: 22.0,
      temperature: 26000,
      position: { x: 199.82, y: -473.9, z: -402.3 },
      planets: [],
    },

    meissa: {
      name: "Meissa",
      type: "O",
      mass: 25.0,
      radius: 10.0,
      temperature: 35000,
      position: { x: 341.7, y: -643.2, z: -825.1 },
      planets: [],
    },

    hatsya: {
      name: "Hatsya",
      type: "B",
      mass: 10.0,
      radius: 3.0,
      temperature: 22000,
      position: { x: 413.7, y: -814.3, z: -1006.4 },
      planets: [],
    },

    "nair al saif": {
      name: "Nair al Saif",
      type: "B",
      mass: 9.0,
      radius: 5.0,
      temperature: 23000,
      position: { x: 400.12, y: -789.6, z: -974.3 },
      planets: [],
    },

    mintaka: {
      name: "Mintaka",
      type: "B",
      mass: 24.0,
      radius: 16.0,
      temperature: 29500,
      position: { x: 281.47, y: -554.2, z: -684.6 },
      planets: [],
    },

    alnilam: {
      name: "Alnilam",
      type: "B",
      mass: 40.0,
      radius: 24.0,
      temperature: 27500,
      position: { x: 412.1, y: -810.6, z: -1001.4 },
      planets: [],
    },

    alnitak: {
      name: "Alnitak",
      type: "O",
      mass: 33.0,
      radius: 20.0,
      temperature: 31000,
      position: { x: 226.32, y: -445.4, z: -550.3 },
      planets: [],
    },

    "gliese 97": {
      name: "Gliese 97",
      type: "K",
      mass: 0.7,
      radius: 0.72,
      temperature: 4500,
      position: { x: 17.35, y: -36.93, z: -1.34 },
      planets: [],
    },

    "tyc 7512-1387-1": {
      name: "TYC 7512-1387-1",
      type: "M",
      mass: 0.31,
      radius: 0.38,
      temperature: 3100,
      position: { x: 19.87, y: -37.36, z: -3.89 },
      planets: [],
    },

    "zeta reticuli b": {
      name: "Zeta Reticuli B",
      type: "G",
      mass: 0.88,
      radius: 0.86,
      temperature: 5410,
      position: { x: 21.52, y: -31.27, z: -7.14 },
      binary: true,
      planets: [
        {
          name: "Zeta B I",
          type: "desert",
          moons: [],
          orbitRadius: 0.7,
          mass: 0.8,
        },
        {
          name: "Zeta B II",
          type: "super_earth",
          moons: [],
          orbitRadius: 1.2,
          mass: 3.2,
        },
      ],
    },

    "epsilon indi": {
      name: "Epsilon Indi",
      type: "K",
      mass: 0.76,
      radius: 0.74,
      temperature: 4630,
      position: { x: 3.63, y: -8.82, z: -7.14 },
      planets: [
        {
          name: "Epsilon Indi Ab",
          type: "gas_giant",
          moons: [],
          orbitRadius: 11.6,
          mass: 2.7,
        },
      ],
    },

    "kepler-22": {
      name: "Kepler-22",
      type: "G",
      mass: 0.97,
      radius: 0.98,
      temperature: 5518,
      position: { x: 190.47, y: 587.64, z: 31.82 },
      planets: [
        {
          name: "Kepler-22b",
          type: "ocean",
          moons: [],
          orbitRadius: 0.85,
          mass: 2.4,
        },
      ],
    },
  };
  window.GalaxyData = {
    STAR_TYPES,
    PLANET_TYPES,
    LOCAL_GROUP_GALAXIES,
    SYSTEMS,
    SUPERCLUSTERS,
    WESTERN_CONSTELLATIONS,
    CHINESE_CONSTELLATIONS,
  };
})();

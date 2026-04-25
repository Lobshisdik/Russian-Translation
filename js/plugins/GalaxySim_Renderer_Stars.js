/*:
 * @target MZ
 * @plugindesc GalaxySim Star Renderer Module - Star, black hole, and orbit rendering
 * @author Omni-Lex + Nocoldiz
 * @url
 * @help
 * ============================================================================
 * GalaxySim Star Renderer Module
 * ============================================================================
 * This module handles star system rendering:
 * - Star drawing with glows and labels
 * - Black holes (normal, supermassive, hypermassive)
 * - Orbital mechanics visualization
 * - Player ship rendering
 * - Name generation for stars and black holes
 *
 * LOAD ORDER: Must load AFTER GalaxySim_Math.js
 *
 * DEPENDENCIES:
 * - GalaxySim_Math.js
 * - GalaxySim_Renderer_Planets.js (for comet trails and planet rendering)
 */

(() => {
  "use strict";

  // Check dependencies
  if (!window.GalaxySim || !window.GalaxySim.Math) {
    throw new Error("GalaxySim_Renderer_Stars requires GalaxySim_Math to be loaded first");
  }

  // Import from Math module
  const { RandomGenerator, COLORS, ORBIT_ZOOM_THRESHOLD, ORBIT_FULL_ALPHA_ZOOM,
          PLANET_MIN_SIZE, PLANET_DETAIL_THRESHOLD, ECCENTRIC_ORBIT_TYPES,
          SCALE_GALAXY, SCALE_SYSTEM } = window.GalaxySim.Math;

  // ============================================================================
  // Name Generation Functions
  // ============================================================================

  function generateRealisticStarName(worldX, worldY, seedRng) {
    const catalogPrefixes = [
      'HD', 'HIP', 'Gliese', 'TYC', '2MASS J', 'WISE J', 'SDSS J',
      'UGPS J', 'PSR J', 'NGC', 'IC', 'Messier',
      'Synuefe', 'Bleia', 'Byeia', 'Dryio', 'Eol', 'Flyiedgiae',
      'Hypiae', 'Kyloall', 'Mynoaw', 'Nyeajeau', 'Oevasy', 'Phroea',
      'Plaa', 'Praea', 'Pru', 'Swoilz', 'Thaile', 'Truechiae',
      'Wepiae', 'Bleae', 'Graea', 'Phroi', 'Boewnst', 'Lyaisae', 'Outotz',
    ];

    const sectorLetters = ['AA', 'AB', 'AC', 'AD', 'AE', 'AF', 'BA', 'BB', 'BC', 'BD', 'CA', 'CB', 'CC', 'CD', 'EA', 'EB', 'EC', 'ED'];

    const catalogType = seedRng.int(0, 2);

    if (catalogType === 0) {
      const prefix = catalogPrefixes[seedRng.int(0, 6)];
      const number = Math.abs(Math.floor(worldX * 1000 + worldY * 1000)) % 999999;
      return `${prefix} ${number}`;
    } else if (catalogType === 1) {
      const prefix = catalogPrefixes[seedRng.int(6, 12)];
      const ra_h = Math.abs(Math.floor(worldX * 10)) % 24;
      const ra_m = Math.abs(Math.floor(worldY * 10)) % 60;
      const ra_s = Math.abs(Math.floor((worldX + worldY) * 100)) % 60;
      const dec_sign = worldY >= 0 ? '+' : '-';
      const dec_d = Math.abs(Math.floor(worldY * 5)) % 90;
      const dec_m = Math.abs(Math.floor(worldX * 10)) % 60;
      const dec_s = Math.abs(Math.floor((worldX - worldY) * 100)) % 60;

      return `${prefix}${String(ra_h).padStart(2, '0')}${String(ra_m).padStart(2, '0')}${String(ra_s).padStart(2, '0')}.${String(Math.floor(seedRng.random() * 99)).padStart(2, '0')}${dec_sign}${String(dec_d).padStart(2, '0')}${String(dec_m).padStart(2, '0')}${String(dec_s).padStart(2, '0')}.${String(Math.floor(seedRng.random() * 9))}`;
    } else {
      const prefix = catalogPrefixes[seedRng.int(13, catalogPrefixes.length - 1)];
      const sector = sectorLetters[seedRng.int(0, sectorLetters.length - 1)];
      const letter = String.fromCharCode(65 + seedRng.int(0, 25));
      const number = Math.abs(Math.floor(worldX * 100 + worldY * 100)) % 9999;

      return `${prefix} ${sector}-${letter} ${letter}${number}`;
    }
  }

  function generateBlackHoleName(worldX, worldY, seedRng, isHypermassive = false) {
    const blackHoleNamePrefixes = [
      'Abaddon', 'Cataclysm', 'Devourer', 'Extinction', 'Oblivion', 'Ravager',
      'Vortex', 'Void', 'Abyss', 'Maelstrom', 'Singularity', 'Nightmare',
      'Perdition', 'Terminus', 'Aeon', 'Chaos', 'Hunger', 'Madness', 'Wraith', 'Requiem',
    ];

    const descriptors = [
      'Prime', 'Major', 'Lesser', 'Dark', 'Shadow', 'Phantom', 'Silent',
      'Ancient', 'Hungry', 'Eternal', 'Cursed', 'Lost', 'Forgotten', 'Forbidden', 'Accursed',
    ];

    const prefix = blackHoleNamePrefixes[seedRng.int(0, blackHoleNamePrefixes.length - 1)];
    const descriptor = descriptors[seedRng.int(0, descriptors.length - 1)];

    if (isHypermassive) {
      return `${prefix} the ${descriptor} (TON-class)`;
    } else {
      const superMassiveClasses = ['Sagittarius', 'Andromeda', 'Cygnus', 'Virgo', 'Centaurus'];
      const designation = superMassiveClasses[seedRng.int(0, superMassiveClasses.length - 1)];
      const catalogNumber = Math.abs(Math.floor(worldX * 7919 + worldY * 6143)) % 9999;
      const suffix = String.fromCharCode(65 + seedRng.int(0, 25));
      return `${prefix} ${descriptor} (${designation} A${catalogNumber}${suffix})`;
    }
  }

  function determineBlackHoleType(worldX, worldY, seedRng, inGreatAttractor = false) {
    if (inGreatAttractor) {
      // In Great Attractor, only 3% of stars are black holes
      if (seedRng.random() < 0.03) {
        // Determine which type of black hole (30% hypermassive, 40% supermassive, 30% normal)
        const typeRoll = seedRng.random();
        if (typeRoll < 0.3) return 'hypermassive';
        if (typeRoll < 0.7) return 'supermassive';
        return 'normal';
      }
      return null; // 97% are normal stars
    } else {
      if (seedRng.random() < 0.001) {
        return seedRng.random() < 0.3 ? 'supermassive' : 'normal';
      }
    }
    return null;
  }

  // ============================================================================
  // Star Rendering Functions (exported for Scene use)
  // ============================================================================

  const StarRenderers = {
    generateRealisticStarName,
    generateBlackHoleName,
    determineBlackHoleType,

    hexToRgb(hex) {
      if (!hex) return { r: 255, g: 255, b: 255 };
      const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
      return result
        ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16),
          }
        : { r: 255, g: 255, b: 255 };
    },

    // Note: These functions need `this` context from Scene, so they're defined as methods
    // that will be bound when called from Scene_AdvancedStarMap
  };

  // ============================================================================
  // Export to namespace
  // ============================================================================

  window.GalaxySim.Renderers = window.GalaxySim.Renderers || {};
  window.GalaxySim.Renderers.Stars = StarRenderers;

})();

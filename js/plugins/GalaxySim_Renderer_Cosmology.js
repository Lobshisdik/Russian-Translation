/*:
 * @target MZ
 * @plugindesc GalaxySim Cosmology Renderer Module - Large-scale universe rendering
 * @author Omni-Lex + Nocoldiz
 * @url
 * @help
 * ============================================================================
 * GalaxySim Cosmology Renderer Module
 * ============================================================================
 * This module provides constants and helpers for large-scale universe rendering:
 * - Galaxy morphologies (spiral, elliptical, irregular, dwarf)
 * - Supercluster structures
 * - Cosmic web filaments
 * - Observable universe visualization
 *
 * LOAD ORDER: Must load AFTER GalaxySim_Math.js
 *
 * DEPENDENCIES:
 * - GalaxySim_Math.js
 *
 * NOTE: Actual rendering functions are in GalaxySim_Scene.js due to tight
 * coupling with camera, time, and selection state.
 */

(() => {
  "use strict";

  // Check dependencies
  if (!window.GalaxySim || !window.GalaxySim.Math) {
    throw new Error("GalaxySim_Renderer_Cosmology requires GalaxySim_Math to be loaded first");
  }

  // Import from Math module
  const { MLY_TO_LY } = window.GalaxySim.Math;

  // ============================================================================
  // Cosmological Constants
  // ============================================================================

  // Laniakea Hypercluster - Known Superclusters
  const LANIAKEA_SUPERCLUSTERS = [
    { name: 'Virgo Cluster', x: 0, y: 0, mass: 1.2, radius: 11 * MLY_TO_LY, color: { r: 120, g: 150, b: 200 } },
    { name: 'Hydra Supercluster', x: -50 * MLY_TO_LY, y: 30 * MLY_TO_LY, mass: 0.8, radius: 8 * MLY_TO_LY, color: { r: 100, g: 180, b: 220 } },
    { name: 'Centaurus Supercluster', x: 40 * MLY_TO_LY, y: -35 * MLY_TO_LY, mass: 0.9, radius: 9 * MLY_TO_LY, color: { r: 140, g: 170, b: 210 } },
    { name: 'Pavo-Indus Supercluster', x: -70 * MLY_TO_LY, y: -60 * MLY_TO_LY, mass: 0.7, radius: 7 * MLY_TO_LY, color: { r: 110, g: 160, b: 230 } },
  ];

  // Great Attractor location
  const GREAT_ATTRACTOR_COORDS = {
    x: 150 * MLY_TO_LY,
    y: -30 * MLY_TO_LY,
    radius: 50 * MLY_TO_LY,
  };

  // Observable Universe radius (46.5 billion light-years)
  const OBSERVABLE_UNIVERSE_RADIUS = 46500 * MLY_TO_LY;

  // Universe Sphere (theoretical limit, beyond observable)
  const UNIVERSE_SPHERE_RADIUS = OBSERVABLE_UNIVERSE_RADIUS * 2;

  // ============================================================================
  // Helper Functions
  // ============================================================================

  function isInGreatAttractor(x, y) {
    const dx = x - GREAT_ATTRACTOR_COORDS.x;
    const dy = y - GREAT_ATTRACTOR_COORDS.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    return distance <= GREAT_ATTRACTOR_COORDS.radius;
  }

  function getGalaxyMorphologyColor(type, rng) {
    const morphologyColors = {
      spiral: { r: 200 + rng.int(0, 55), g: 200 + rng.int(0, 55), b: 255 },
      barred_spiral: { r: 220 + rng.int(0, 35), g: 200 + rng.int(0, 55), b: 240 + rng.int(0, 15) },
      elliptical: { r: 255, g: 220 + rng.int(0, 35), b: 180 + rng.int(0, 40) },
      irregular: { r: 180 + rng.int(0, 50), g: 200 + rng.int(0, 55), b: 220 + rng.int(0, 35) },
      dwarf: { r: 150 + rng.int(0, 50), g: 170 + rng.int(0, 50), b: 190 + rng.int(0, 50) },
      dwarf_spheroidal: { r: 140 + rng.int(0, 40), g: 150 + rng.int(0, 40), b: 170 + rng.int(0, 40) },
    };

    return morphologyColors[type] || { r: 200, g: 200, b: 200 };
  }

  // ============================================================================
  // Export to namespace
  // ============================================================================

  window.GalaxySim.Renderers = window.GalaxySim.Renderers || {};
  window.GalaxySim.Renderers.Cosmology = {
    LANIAKEA_SUPERCLUSTERS,
    GREAT_ATTRACTOR_COORDS,
    OBSERVABLE_UNIVERSE_RADIUS,
    UNIVERSE_SPHERE_RADIUS,
    isInGreatAttractor,
    getGalaxyMorphologyColor,
  };

})();

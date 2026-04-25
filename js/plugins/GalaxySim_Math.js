/*:
 * @target MZ
 * @plugindesc GalaxySim Math Module - Mathematical utilities and data structures
 * @author Omni-Lex + Nocoldiz
 * @url
 * @help
 * ============================================================================
 * GalaxySim Math Module
 * ============================================================================
 * This module provides mathematical utilities for the GalaxySim system:
 * - Vector2 class for 2D vector operations
 * - Camera class for viewport transformations
 * - RandomGenerator for seeded random number generation
 * - Constants for colors, scales, and unit conversions
 *
 * LOAD ORDER: This module must be loaded BEFORE other GalaxySim modules.
 *
 * DEPENDENCIES: GalaxySimDB.js (must be loaded before this)
 */

(() => {
  "use strict";

  // Initialize namespace
  if (!window.GalaxySim) {
    window.GalaxySim = {};
  }

  // ============================================================================
  // Load Data from GalaxyData
  // ============================================================================

  const STAR_TYPES = window.GalaxyData?.STAR_TYPES || {};
  const PLANET_TYPES = window.GalaxyData?.PLANET_TYPES || {};

  // ============================================================================
  // Helper Functions
  // ============================================================================

  // Helper to convert hex color to CSS format
  function hexToCSS(hexColor) {
    if (typeof hexColor === "string") {
      if (hexColor.startsWith("#")) return hexColor;
      return "#" + hexColor;
    }
    return "#" + hexColor.toString(16).padStart(6, "0");
  }

  // Build star color map from STAR_TYPES
  const STAR_COLORS = {};
  Object.keys(STAR_TYPES).forEach((type) => {
    STAR_COLORS[type] = hexToCSS(STAR_TYPES[type].color);
  });

  // Build planet color map from PLANET_TYPES
  const PLANET_COLORS = {};
  Object.keys(PLANET_TYPES).forEach((type) => {
    PLANET_COLORS[type] = hexToCSS(PLANET_TYPES[type].color);
  });

  // ============================================================================
  // Constants
  // ============================================================================

  const COLORS = {
    background: "#000510",
    grid: "rgba(30, 60, 120, 0.15)",
    gridHighlight: "rgba(50, 100, 180, 0.25)",
    selection: "#00d4ff",
    selectionGlow: "rgba(0, 212, 255, 0.3)",
    current: "#ffaa00",
    connection: "rgba(80, 120, 200, 0.2)",
    scanLine: "rgba(0, 200, 255, 0.4)",
    uiBackground: "rgba(10, 20, 40, 0.92)",
    uiHighlight: "rgba(0, 150, 255, 0.3)",
    uiBorder: "rgba(0, 200, 255, 0.5)",
    text: "#e0e8ff",
    textDim: "#8090b0",
    textHighlight: "#00d4ff",
    orbit: "rgba(80, 120, 200, 0.5)",
    orbitLabel: "rgba(200, 220, 255, 0.9)",
  };

  // Zoom thresholds for orbit visibility in galaxy view
  const ORBIT_ZOOM_THRESHOLD = 4;
  const ORBIT_FULL_ALPHA_ZOOM = 10;

  // Planet detail rendering thresholds
  const PLANET_DETAIL_THRESHOLD = 400;
  const PLANET_FULL_DETAIL_ZOOM = 800;
  const PLANET_MIN_SIZE = 0.1;
  const PLANET_MAX_SIZE = 600;

  // Planet types with eccentric orbits
  const ECCENTRIC_ORBIT_TYPES = new Set([
    "rogue",
    "comet",
    "short_period_comet",
    "long_period_comet",
  ]);

  // ============================================================================
  // Multi-Scale Universe Constants
  // ============================================================================

  // Scale levels for universe visualization
  const SCALE_SYSTEM = 0;
  const SCALE_GALAXY = 1;
  const SCALE_LOCAL_GROUP = 2;
  const SCALE_SUPERCLUSTER = 3;
  const SCALE_FILAMENTS = 4;
  const SCALE_OBSERVABLE = 5;
  const SCALE_UNIVERSE_SPHERE = 6;

  // Zoom thresholds for scale transitions
  const SCALE_THRESHOLDS = {
    [SCALE_SYSTEM]: 2.0,
    [SCALE_GALAXY]: 0.02159,
    [SCALE_LOCAL_GROUP]: 0.000001,
    [SCALE_SUPERCLUSTER]: 0.0000091,
    [SCALE_FILAMENTS]: 0.000000001,
    [SCALE_OBSERVABLE]: 0.000000009,
  };

  // Unit conversions (all distances in light-years internally)
  const LY_TO_KLY = 0.001;
  const LY_TO_MLY = 0.000001;
  const LY_TO_GLY = 0.000000001;
  const KLY_TO_LY = 1000;
  const MLY_TO_LY = 1000000;
  const GLY_TO_LY = 1000000000;

  // Galaxy morphology types
  const GALAXY_TYPE_SPIRAL = 'spiral';
  const GALAXY_TYPE_BARRED_SPIRAL = 'barred_spiral';
  const GALAXY_TYPE_ELLIPTICAL = 'elliptical';
  const GALAXY_TYPE_IRREGULAR = 'irregular';
  const GALAXY_TYPE_DWARF = 'dwarf';
  const GALAXY_TYPE_DWARF_SPHEROIDAL = 'dwarf_spheroidal';

  // Map generation constants
  const MAP_RADIUS = 130;
  const SYSTEM_DENSITY = 0.00001;

  // ============================================================================
  // Vector2 Class
  // ============================================================================

  class Vector2 {
    constructor(x = 0, y = 0) {
      this.x = x;
      this.y = y;
    }

    add(v) {
      return new Vector2(this.x + v.x, this.y + v.y);
    }

    sub(v) {
      return new Vector2(this.x - v.x, this.y - v.y);
    }

    mul(s) {
      return new Vector2(this.x * s, this.y * s);
    }

    length() {
      return Math.sqrt(this.x * this.x + this.y * this.y);
    }

    normalize() {
      const len = this.length();
      return len > 0 ? this.mul(1 / len) : new Vector2();
    }

    lerp(v, t) {
      return new Vector2(
        this.x + (v.x - this.x) * t,
        this.y + (v.y - this.y) * t
      );
    }

    distance(v) {
      return this.sub(v).length();
    }
  }

  // ============================================================================
  // Camera Class
  // ============================================================================

  class Camera {
    constructor() {
      this.position = new Vector2(0, 0);
      this.targetPosition = new Vector2(0, 0);
      this.zoom = 1;
      this.targetZoom = 1;
      this.minZoom = 1e-13;
      this.maxZoom = 10000;
      this.smoothing = 0.12;
      this.zoomSmoothing = 0.15;
    }

    update() {
      this.position = this.position.lerp(this.targetPosition, this.smoothing);
      this.zoom += (this.targetZoom - this.zoom) * this.zoomSmoothing;
    }

    setTarget(x, y) {
      this.targetPosition = new Vector2(x, y);
    }

    setZoom(zoom) {
      this.targetZoom = Math.max(this.minZoom, Math.min(this.maxZoom, zoom));
    }

    screenToWorld(x, y, width, height) {
      return new Vector2(
        (x - width / 2) / this.zoom + this.position.x,
        (y - height / 2) / this.zoom + this.position.y
      );
    }

    worldToScreen(x, y, width, height) {
      return new Vector2(
        (x - this.position.x) * this.zoom + width / 2,
        (y - this.position.y) * this.zoom + height / 2
      );
    }
  }

  // ============================================================================
  // RandomGenerator Class
  // ============================================================================

  class RandomGenerator {
    constructor(seed) {
      this.seed = this.hashCode(seed);
    }

    hashCode(str) {
      let hash = 0;
      for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = (hash << 5) - hash + char;
        hash = hash & hash;
      }
      return Math.abs(hash);
    }

    random() {
      this.seed = (this.seed * 9301 + 49297) % 233280;
      return this.seed / 233280;
    }

    range(min, max) {
      return min + this.random() * (max - min);
    }

    int(min, max) {
      return Math.floor(this.range(min, max + 1));
    }
  }

  // ============================================================================
  // Export to namespace
  // ============================================================================

  window.GalaxySim.Math = {
    // Classes
    Vector2,
    Camera,
    RandomGenerator,

    // Helper functions
    hexToCSS,

    // Constants
    COLORS,
    STAR_COLORS,
    PLANET_COLORS,

    // Thresholds
    ORBIT_ZOOM_THRESHOLD,
    ORBIT_FULL_ALPHA_ZOOM,
    PLANET_DETAIL_THRESHOLD,
    PLANET_FULL_DETAIL_ZOOM,
    PLANET_MIN_SIZE,
    PLANET_MAX_SIZE,
    ECCENTRIC_ORBIT_TYPES,

    // Scales
    SCALE_SYSTEM,
    SCALE_GALAXY,
    SCALE_LOCAL_GROUP,
    SCALE_SUPERCLUSTER,
    SCALE_FILAMENTS,
    SCALE_OBSERVABLE,
    SCALE_UNIVERSE_SPHERE,
    SCALE_THRESHOLDS,

    // Unit conversions
    LY_TO_KLY,
    LY_TO_MLY,
    LY_TO_GLY,
    KLY_TO_LY,
    MLY_TO_LY,
    GLY_TO_LY,

    // Galaxy types
    GALAXY_TYPE_SPIRAL,
    GALAXY_TYPE_BARRED_SPIRAL,
    GALAXY_TYPE_ELLIPTICAL,
    GALAXY_TYPE_IRREGULAR,
    GALAXY_TYPE_DWARF,
    GALAXY_TYPE_DWARF_SPHEROIDAL,

    // Map constants
    MAP_RADIUS,
    SYSTEM_DENSITY,
  };

})();

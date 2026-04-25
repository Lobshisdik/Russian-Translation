/*:
 * @target MZ
 * @plugindesc GalaxySim Planet Renderer Module - Procedural planet rendering system
 * @author Omni-Lex + Nocoldiz
 * @url
 * @help
 * ============================================================================
 * GalaxySim Planet Renderer Module
 * ============================================================================
 * This module handles all planet rendering:
 * - Procedural planet generation with caching
 * - Gas giants, terrestrial, icy, volcanic planets
 * - Atmosphere and terminator shadows
 * - Comet trails with particle effects
 *
 * LOAD ORDER: Must load AFTER GalaxySim_Math.js
 *
 * DEPENDENCIES:
 * - GalaxySim_Math.js
 */

(() => {
  "use strict";

  // Check dependencies
  if (!window.GalaxySim || !window.GalaxySim.Math) {
    throw new Error("GalaxySim_Renderer_Planets requires GalaxySim_Math to be loaded first");
  }

  // Import from Math module
  const { PLANET_MIN_SIZE, PLANET_MAX_SIZE } = window.GalaxySim.Math;

  // ============================================================================
  // Planet Renderer Class
  // ============================================================================

  class PlanetRenderer {
    constructor() {
      this.cache = new Map();
      this.maxCacheSize = 50;
    }

    noise2D(x, y, seed) {
      const n = Math.sin(x * 12.9898 + y * 78.233 + seed) * 43758.5453;
      return n - Math.floor(n);
    }

    fbm(x, y, seed, octaves = 3) {
      let value = 0;
      let amplitude = 1;
      let frequency = 1;
      let maxValue = 0;

      for (let i = 0; i < octaves; i++) {
        value += this.noise2D(x * frequency, y * frequency, seed + i) * amplitude;
        maxValue += amplitude;
        amplitude *= 0.5;
        frequency *= 2;
      }

      return value / maxValue;
    }

    getPlanetColors(type, baseColor) {
      const colors = {
        earth_like: [
          { color: "#2e8b57", weight: 0.4 },
          { color: "#1e6bb8", weight: 0.5 },
          { color: "#ffffff", weight: 0.1 },
        ],
        ocean: [
          { color: "#006994", weight: 0.7 },
          { color: "#004d6b", weight: 0.2 },
          { color: "#ffffff", weight: 0.1 },
        ],
        desert: [
          { color: "#edc9af", weight: 0.6 },
          { color: "#d4a595", weight: 0.3 },
          { color: "#c19a6b", weight: 0.1 },
        ],
        ice: [
          { color: "#e0ffff", weight: 0.5 },
          { color: "#b0e0e6", weight: 0.3 },
          { color: "#ffffff", weight: 0.2 },
        ],
        lava_ocean: [
          { color: "#ff4500", weight: 0.4 },
          { color: "#ff6347", weight: 0.3 },
          { color: "#8b0000", weight: 0.3 },
        ],
        magma_planet: [
          { color: "#ff4500", weight: 0.5 },
          { color: "#dc143c", weight: 0.3 },
          { color: "#000000", weight: 0.2 },
        ],
        gas_giant: [
          { color: "#ffb366", weight: 0.4 },
          { color: "#ff9944", weight: 0.3 },
          { color: "#ffcc88", weight: 0.3 },
        ],
        hot_jupiter: [
          { color: "#ff8c00", weight: 0.5 },
          { color: "#ff6347", weight: 0.3 },
          { color: "#ffa500", weight: 0.2 },
        ],
        ice_giant: [
          { color: "#4fd0e0", weight: 0.5 },
          { color: "#5fe8ff", weight: 0.3 },
          { color: "#87ceeb", weight: 0.2 },
        ],
        carbon: [
          { color: "#2f4f4f", weight: 0.6 },
          { color: "#1c1c1c", weight: 0.3 },
          { color: "#696969", weight: 0.1 },
        ],
        diamond: [
          { color: "#b9f2ff", weight: 0.4 },
          { color: "#e0ffff", weight: 0.3 },
          { color: "#ffffff", weight: 0.3 },
        ],
        plasma: [
          { color: "#ff1493", weight: 0.4 },
          { color: "#ff69b4", weight: 0.3 },
          { color: "#ff00ff", weight: 0.3 },
        ],
      };

      return colors[type] || [{ color: baseColor, weight: 1.0 }];
    }

    drawPlanet(ctx, x, y, radius, planet, seed) {
      const clampedRadius = Math.min(radius, PLANET_MAX_SIZE);

      if (clampedRadius < PLANET_MIN_SIZE) {
        const glowGradient = ctx.createRadialGradient(x, y, 0, x, y, clampedRadius * 1.5);
        const baseColor = this.hexToRgb(planet.color);
        glowGradient.addColorStop(0, planet.color);
        glowGradient.addColorStop(0.7, planet.color);
        glowGradient.addColorStop(1, `rgba(${baseColor.r}, ${baseColor.g}, ${baseColor.b}, 0)`);
        ctx.fillStyle = glowGradient;
        ctx.beginPath();
        ctx.arc(x, y, clampedRadius * 1.5, 0, Math.PI * 2);
        ctx.fill();
        return;
      }

      const cacheKey = `${planet.type}_${planet.name}_${Math.floor(clampedRadius / 5) * 5}`;

      if (this.cache.has(cacheKey)) {
        const cached = this.cache.get(cacheKey);
        ctx.drawImage(cached, x - cached.width / 2, y - cached.height / 2);
        return;
      }

      const planetCanvas = document.createElement("canvas");
      const size = Math.ceil(clampedRadius * 2.8);
      planetCanvas.width = size;
      planetCanvas.height = size;
      const pCtx = planetCanvas.getContext("2d");

      const centerX = size / 2;
      const centerY = size / 2;

      if (this.isGasGiant(planet.type)) {
        this.drawGasGiant(pCtx, centerX, centerY, clampedRadius, planet, seed);
      } else if (this.isIcyBody(planet.type)) {
        this.drawIcyWorld(pCtx, centerX, centerY, clampedRadius, planet, seed);
      } else if (this.isVolcanic(planet.type)) {
        this.drawVolcanicWorld(pCtx, centerX, centerY, clampedRadius, planet, seed);
      } else if (planet.type === "earth_like" || planet.type === "ocean" || planet.type === "habitable") {
        this.drawTerrestrialWorld(pCtx, centerX, centerY, clampedRadius, planet, seed);
      } else {
        this.drawRockyWorld(pCtx, centerX, centerY, clampedRadius, planet, seed);
      }

      if (this.hasAtmosphere(planet.type)) {
        this.drawAtmosphere(pCtx, centerX, centerY, clampedRadius, planet);
      }

      this.drawTerminator(pCtx, centerX, centerY, clampedRadius);

      if (this.cache.size >= this.maxCacheSize) {
        const firstKey = this.cache.keys().next().value;
        this.cache.delete(firstKey);
      }
      this.cache.set(cacheKey, planetCanvas);

      ctx.drawImage(planetCanvas, x - size / 2, y - size / 2);
    }

    isGasGiant(type) {
      return [
        "gas_giant", "hot_jupiter", "warm_jupiter", "cold_jupiter",
        "ice_giant", "ringed_gas_giant", "puffy",
      ].includes(type);
    }

    isIcyBody(type) {
      return [
        "ice", "tundra", "dwarf", "comet",
        "short_period_comet", "long_period_comet",
      ].includes(type);
    }

    isVolcanic(type) {
      return ["lava_ocean", "magma_planet", "chthonian"].includes(type);
    }

    hasAtmosphere(type) {
      return ![
        "dwarf", "c_type_asteroid", "s_type_asteroid", "m_type_asteroid",
        "trojan_asteroid", "comet", "short_period_comet", "long_period_comet",
        "mercurian", "planetesimal", "centaur",
      ].includes(type);
    }

    drawGasGiant(ctx, cx, cy, radius, planet, seed) {
      ctx.save();

      ctx.beginPath();
      ctx.arc(cx, cy, radius, 0, Math.PI * 2);
      ctx.clip();

      const gradient = ctx.createRadialGradient(
        cx - radius * 0.3, cy - radius * 0.3, 0, cx, cy, radius
      );

      const colors = this.getPlanetColors(planet.type, planet.color);
      const baseColor = colors[0].color;

      gradient.addColorStop(0, this.lightenColor(baseColor, 1.3));
      gradient.addColorStop(0.5, baseColor);
      gradient.addColorStop(1, this.darkenColor(baseColor, 0.5));

      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(cx, cy, radius, 0, Math.PI * 2);
      ctx.fill();

      ctx.globalAlpha = 0.4;
      const numBands = Math.floor(radius / 4);
      for (let i = 0; i < numBands; i++) {
        const y = -radius + (i / numBands) * radius * 2;
        const bandNoise = this.noise2D(i, seed, 0);
        const bandWidth = radius * 2 * Math.sqrt(1 - (y / radius) ** 2);

        if (isNaN(bandWidth)) continue;

        const bandColor = i % 2 === 0 ? colors[0].color : colors[1]?.color || colors[0].color;
        ctx.strokeStyle = bandColor;
        ctx.lineWidth = Math.max(1, radius / 15);

        const turbulence = this.noise2D(y, seed + 100, 0) * 5;
        ctx.beginPath();
        ctx.moveTo(cx - bandWidth + turbulence, cy + y);
        ctx.lineTo(cx + bandWidth + turbulence, cy + y);
        ctx.stroke();
      }

      ctx.globalAlpha = 1;

      if (radius > 20 && planet.type === "gas_giant") {
        const spotX = cx + radius * 0.3;
        const spotY = cy + radius * 0.2;
        const spotRadius = radius * 0.25;

        ctx.fillStyle = "rgba(220, 100, 80, 0.5)";
        ctx.beginPath();
        ctx.ellipse(spotX, spotY, spotRadius, spotRadius * 0.6, 0, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.restore();
    }

    drawIcyWorld(ctx, cx, cy, radius, planet, seed) {
      const gradient = ctx.createRadialGradient(
        cx - radius * 0.3, cy - radius * 0.3, 0, cx, cy, radius
      );
      gradient.addColorStop(0, "#ffffff");
      gradient.addColorStop(0.5, planet.color);
      gradient.addColorStop(1, this.darkenColor(planet.color, 0.5));

      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(cx, cy, radius, 0, Math.PI * 2);
      ctx.fill();

      ctx.strokeStyle = "rgba(200, 230, 255, 0.3)";
      ctx.lineWidth = 1;
      const numCracks = Math.min(10, Math.floor(radius / 3));
      for (let i = 0; i < numCracks; i++) {
        const angle = this.noise2D(i, seed, 0) * Math.PI * 2;
        const dist = this.noise2D(i, seed + 1, 0) * radius * 0.7;
        const x1 = cx + Math.cos(angle) * dist;
        const y1 = cy + Math.sin(angle) * dist;
        const x2 = cx + Math.cos(angle + 0.5) * (dist + radius * 0.2);
        const y2 = cy + Math.sin(angle + 0.5) * (dist + radius * 0.2);

        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
      }
    }

    drawVolcanicWorld(ctx, cx, cy, radius, planet, seed) {
      const gradient = ctx.createRadialGradient(
        cx - radius * 0.3, cy - radius * 0.3, 0, cx, cy, radius
      );
      gradient.addColorStop(0, "#ff6347");
      gradient.addColorStop(0.5, planet.color);
      gradient.addColorStop(1, "#000000");

      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(cx, cy, radius, 0, Math.PI * 2);
      ctx.fill();

      const numHotspots = Math.min(8, Math.floor(radius / 4));
      for (let i = 0; i < numHotspots; i++) {
        const angle = this.noise2D(i, seed, 0) * Math.PI * 2;
        const dist = this.noise2D(i, seed + 1, 0) * radius * 0.6;
        const x = cx + Math.cos(angle) * dist;
        const y = cy + Math.sin(angle) * dist;
        const hotspotRadius = radius * 0.12;

        const hotGradient = ctx.createRadialGradient(x, y, 0, x, y, hotspotRadius);
        hotGradient.addColorStop(0, "#ffff00");
        hotGradient.addColorStop(0.5, "#ff4500");
        hotGradient.addColorStop(1, "rgba(255, 0, 0, 0)");

        ctx.fillStyle = hotGradient;
        ctx.beginPath();
        ctx.arc(x, y, hotspotRadius, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    drawTerrestrialWorld(ctx, cx, cy, radius, planet, seed) {
      const oceanColor = planet.type === "ocean" ? "#006994" : "#1e6bb8";
      const landColor = planet.type === "ocean" ? "#2e4d3d" : "#2e8b57";

      const gradient = ctx.createRadialGradient(
        cx - radius * 0.3, cy - radius * 0.3, 0, cx, cy, radius
      );
      gradient.addColorStop(0, this.lightenColor(oceanColor, 1.2));
      gradient.addColorStop(0.5, oceanColor);
      gradient.addColorStop(1, this.darkenColor(oceanColor, 0.6));

      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(cx, cy, radius, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = landColor;
      const step = Math.max(2, Math.floor(radius / 15));
      for (let y = -radius; y <= radius; y += step) {
        for (let x = -radius; x <= radius; x += step) {
          const dx = x / radius;
          const dy = y / radius;
          const distSq = dx * dx + dy * dy;

          if (distSq > 1) continue;

          const noise = this.fbm(x * 0.05, y * 0.05, seed, 2);
          const continentThreshold = planet.type === "ocean" ? 0.7 : 0.55;

          if (noise > continentThreshold) {
            ctx.fillRect(cx + x, cy + y, step, step);
          }
        }
      }

      ctx.fillStyle = "rgba(255, 255, 255, 0.3)";
      for (let y = -radius; y <= radius; y += step * 1.5) {
        for (let x = -radius; x <= radius; x += step * 1.5) {
          const dx = x / radius;
          const dy = y / radius;
          const distSq = dx * dx + dy * dy;

          if (distSq > 1) continue;

          const cloudNoise = this.fbm(x * 0.08, y * 0.08, seed + 500, 2);
          if (cloudNoise > 0.6) {
            ctx.globalAlpha = (cloudNoise - 0.6) * 1.2;
            ctx.fillRect(cx + x, cy + y, step * 1.5, step * 1.5);
          }
        }
      }
      ctx.globalAlpha = 1;
    }

    drawRockyWorld(ctx, cx, cy, radius, planet, seed) {
      const gradient = ctx.createRadialGradient(
        cx - radius * 0.3, cy - radius * 0.3, 0, cx, cy, radius
      );
      gradient.addColorStop(0, this.lightenColor(planet.color, 1.3));
      gradient.addColorStop(0.5, planet.color);
      gradient.addColorStop(1, this.darkenColor(planet.color, 0.5));

      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(cx, cy, radius, 0, Math.PI * 2);
      ctx.fill();

      ctx.strokeStyle = "rgba(0, 0, 0, 0.3)";
      ctx.fillStyle = "rgba(0, 0, 0, 0.2)";
      const numCraters = Math.min(6, Math.floor(radius / 4));
      for (let i = 0; i < numCraters; i++) {
        const angle = this.noise2D(i, seed, 0) * Math.PI * 2;
        const dist = this.noise2D(i, seed + 1, 0) * radius * 0.7;
        const x = cx + Math.cos(angle) * dist;
        const y = cy + Math.sin(angle) * dist;
        const craterRadius = this.noise2D(i, seed + 2, 0) * radius * 0.12 + radius * 0.05;

        ctx.beginPath();
        ctx.arc(x, y, craterRadius, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
      }
    }

    drawAtmosphere(ctx, cx, cy, radius, planet) {
      const atmosGradient = ctx.createRadialGradient(cx, cy, radius, cx, cy, radius * 1.3);

      const atmosColor = this.getAtmosphereColor(planet.type);
      atmosGradient.addColorStop(0, atmosColor.replace(")", ", 0.3)").replace("rgb", "rgba"));
      atmosGradient.addColorStop(1, "rgba(0, 0, 0, 0)");

      ctx.fillStyle = atmosGradient;
      ctx.beginPath();
      ctx.arc(cx, cy, radius * 1.3, 0, Math.PI * 2);
      ctx.fill();
    }

    drawTerminator(ctx, cx, cy, radius) {
      const shadowGradient = ctx.createRadialGradient(
        cx - radius * 0.3, cy - radius * 0.3, 0,
        cx + radius * 0.5, cy + radius * 0.5, radius * 1.5
      );
      shadowGradient.addColorStop(0, "rgba(0, 0, 0, 0)");
      shadowGradient.addColorStop(0.6, "rgba(0, 0, 0, 0.3)");
      shadowGradient.addColorStop(1, "rgba(0, 0, 0, 0.7)");

      ctx.fillStyle = shadowGradient;
      ctx.beginPath();
      ctx.arc(cx, cy, radius, 0, Math.PI * 2);
      ctx.fill();
    }

    drawCometTrail(ctx, cometX, cometY, cometRadius, starX, starY, cometType, planet, time) {
      const dx = cometX - starX;
      const dy = cometY - starY;
      const distance = Math.sqrt(dx * dx + dy * dy);

      const dirX = dx / distance;
      const dirY = dy / distance;

      let baseTrailLength = cometRadius * 15;
      let trailWidth = cometRadius * 1.5;
      let trailSegments = 20;
      let particleCount = 30;

      if (cometType === "short_period_comet") {
        baseTrailLength = cometRadius * 25;
        trailWidth = cometRadius * 2.0;
        trailSegments = 25;
        particleCount = 40;
      } else if (cometType === "long_period_comet") {
        baseTrailLength = cometRadius * 40;
        trailWidth = cometRadius * 2.5;
        trailSegments = 30;
        particleCount = 50;
      }

      const maxTrailDistance = 10;
      const distanceFactor = Math.max(0.5, Math.min(2.0, 1 - (distance / maxTrailDistance)));
      const finalTrailLength = baseTrailLength * (0.5 + distanceFactor);

      const animTime = time || Date.now() / 1000;

      ctx.save();
      ctx.globalCompositeOperation = 'lighter';

      for (let i = 0; i < trailSegments; i++) {
        const t = i / trailSegments;
        const nextT = (i + 1) / trailSegments;

        const x1 = cometX + dirX * finalTrailLength * t;
        const y1 = cometY + dirY * finalTrailLength * t;
        const x2 = cometX + dirX * finalTrailLength * nextT;
        const y2 = cometY + dirY * finalTrailLength * nextT;

        const width1 = trailWidth * (1 - t * 0.7);
        const width2 = trailWidth * (1 - nextT * 0.7);
        const alpha1 = 0.9 * (1 - t * 0.9);
        const alpha2 = 0.9 * (1 - nextT * 0.9);

        const turbWave1 = Math.sin(t * Math.PI * 4 + animTime * 2) * cometRadius * 0.4;
        const turbWave2 = Math.sin(t * Math.PI * 7 - animTime * 3) * cometRadius * 0.2;
        const turbulence1 = turbWave1 + turbWave2;

        const turbWave3 = Math.sin(nextT * Math.PI * 4 + animTime * 2) * cometRadius * 0.4;
        const turbWave4 = Math.sin(nextT * Math.PI * 7 - animTime * 3) * cometRadius * 0.2;
        const turbulence2 = turbWave3 + turbWave4;

        const perpX = -dirY;
        const perpY = dirX;

        const glowGradient = ctx.createRadialGradient(
          x1 + (x2 - x1) * 0.5, y1 + (y2 - y1) * 0.5, 0,
          x1 + (x2 - x1) * 0.5, y1 + (y2 - y1) * 0.5, width1 * 2
        );
        glowGradient.addColorStop(0, `rgba(150, 200, 255, ${alpha1 * 0.6})`);
        glowGradient.addColorStop(0.5, `rgba(100, 180, 255, ${alpha1 * 0.3})`);
        glowGradient.addColorStop(1, `rgba(80, 160, 255, 0)`);

        ctx.fillStyle = glowGradient;
        ctx.beginPath();
        ctx.moveTo(x1 + perpX * width1 * 1.5, y1 + perpY * width1 * 1.5);
        ctx.lineTo(x1 - perpX * width1 * 1.5, y1 - perpY * width1 * 1.5);
        ctx.lineTo(x2 - perpX * width2 * 1.5, y2 - perpY * width2 * 1.5);
        ctx.lineTo(x2 + perpX * width2 * 1.5, y2 + perpY * width2 * 1.5);
        ctx.closePath();
        ctx.fill();

        const iceGradient = ctx.createLinearGradient(x1, y1, x2, y2);
        const brightness = 1 + Math.sin(animTime * 4 + t * Math.PI * 2) * 0.15;
        iceGradient.addColorStop(0, `rgba(${220 * brightness}, ${240 * brightness}, 255, ${alpha1})`);
        iceGradient.addColorStop(0.5, `rgba(${200 * brightness}, ${230 * brightness}, 255, ${(alpha1 + alpha2) * 0.5})`);
        iceGradient.addColorStop(1, `rgba(${180 * brightness}, ${220 * brightness}, 255, ${alpha2})`);

        ctx.fillStyle = iceGradient;
        ctx.beginPath();
        ctx.moveTo(x1 + perpX * width1 + perpX * turbulence1, y1 + perpY * width1 + perpY * turbulence1);
        ctx.lineTo(x1 - perpX * width1 - perpX * turbulence1, y1 - perpY * width1 - perpY * turbulence1);
        ctx.lineTo(x2 - perpX * width2 - perpX * turbulence2, y2 - perpY * width2 - perpY * turbulence2);
        ctx.lineTo(x2 + perpX * width2 + perpX * turbulence2, y2 + perpY * width2 + perpY * turbulence2);
        ctx.closePath();
        ctx.fill();

        const coreGradient = ctx.createLinearGradient(x1, y1, x2, y2);
        coreGradient.addColorStop(0, `rgba(255, 255, 255, ${alpha1 * 0.8})`);
        coreGradient.addColorStop(0.5, `rgba(240, 250, 255, ${(alpha1 + alpha2) * 0.4})`);
        coreGradient.addColorStop(1, `rgba(220, 240, 255, ${alpha2 * 0.6})`);

        ctx.fillStyle = coreGradient;
        ctx.beginPath();
        ctx.moveTo(x1 + perpX * width1 * 0.3, y1 + perpY * width1 * 0.3);
        ctx.lineTo(x1 - perpX * width1 * 0.3, y1 - perpY * width1 * 0.3);
        ctx.lineTo(x2 - perpX * width2 * 0.3, y2 - perpY * width2 * 0.3);
        ctx.lineTo(x2 + perpX * width2 * 0.3, y2 + perpY * width2 * 0.3);
        ctx.closePath();
        ctx.fill();

        if (i % 2 === 0) {
          const dustPhase = animTime * 1.5 + t * Math.PI * 3;
          const dustAlpha = (alpha1 * 0.7) * (0.8 + Math.sin(dustPhase) * 0.2);

          const dustGradient = ctx.createLinearGradient(x1, y1, x2, y2);
          dustGradient.addColorStop(0, `rgba(255, 240, 180, ${dustAlpha})`);
          dustGradient.addColorStop(0.5, `rgba(255, 220, 160, ${dustAlpha * 0.7})`);
          dustGradient.addColorStop(1, `rgba(255, 200, 140, ${dustAlpha * 0.5})`);

          const dustTurb1 = turbulence1 * 1.3;
          const dustTurb2 = turbulence2 * 1.3;

          ctx.fillStyle = dustGradient;
          ctx.beginPath();
          ctx.moveTo(x1 + perpX * width1 * 0.6 + perpX * dustTurb1, y1 + perpY * width1 * 0.6 + perpY * dustTurb1);
          ctx.lineTo(x1 - perpX * width1 * 0.6 - perpX * dustTurb1, y1 - perpY * width1 * 0.6 - perpY * dustTurb1);
          ctx.lineTo(x2 - perpX * width2 * 0.6 - perpX * dustTurb2, y2 - perpY * width2 * 0.6 - perpY * dustTurb2);
          ctx.lineTo(x2 + perpX * width2 * 0.6 + perpX * dustTurb2, y2 + perpY * width2 * 0.6 + perpY * dustTurb2);
          ctx.closePath();
          ctx.fill();
        }
      }

      for (let i = 0; i < particleCount; i++) {
        const particlePhase = (i / particleCount + animTime * 0.3) % 1.0;
        const particleT = particlePhase;

        const particleX = cometX + dirX * finalTrailLength * particleT;
        const particleY = cometY + dirY * finalTrailLength * particleT;

        const perpX = -dirY;
        const perpY = dirX;
        const spreadOffset = (Math.sin(i * 2.5 + animTime * 2) * trailWidth * 0.7) * (1 - particleT * 0.5);

        const finalX = particleX + perpX * spreadOffset;
        const finalY = particleY + perpY * spreadOffset;

        const particleSize = cometRadius * (0.3 + Math.sin(i * 1.7 + animTime * 3) * 0.15) * (1 - particleT * 0.7);
        const particleAlpha = (1 - particleT) * (0.6 + Math.sin(i * 3.2 + animTime * 4) * 0.3);

        const colorPhase = (i / particleCount * 3 + animTime) % 1.0;
        let r, g, b;
        if (colorPhase < 0.5) {
          r = 200 + colorPhase * 110;
          g = 230 + colorPhase * 50;
          b = 255;
        } else {
          r = 255;
          g = 220 - (colorPhase - 0.5) * 80;
          b = 180 - (colorPhase - 0.5) * 100;
        }

        const particleGlow = ctx.createRadialGradient(finalX, finalY, 0, finalX, finalY, particleSize * 2);
        particleGlow.addColorStop(0, `rgba(${r}, ${g}, ${b}, ${particleAlpha})`);
        particleGlow.addColorStop(0.4, `rgba(${r}, ${g}, ${b}, ${particleAlpha * 0.6})`);
        particleGlow.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`);

        ctx.fillStyle = particleGlow;
        ctx.beginPath();
        ctx.arc(finalX, finalY, particleSize * 2, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.restore();
    }

    getAtmosphereColor(type) {
      const atmosColors = {
        earth_like: "rgb(100, 150, 255)",
        ocean: "rgb(100, 150, 255)",
        habitable: "rgb(100, 150, 255)",
        hot_jupiter: "rgb(255, 150, 100)",
        gas_giant: "rgb(200, 180, 150)",
        ice_giant: "rgb(150, 200, 255)",
        plasma: "rgb(255, 50, 200)",
        lava_ocean: "rgb(255, 100, 50)",
        acid_ocean: "rgb(150, 255, 100)",
      };
      return atmosColors[type] || "rgb(150, 150, 150)";
    }

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
    }

    lightenColor(color, factor) {
      const rgb = this.hexToRgb(color);
      return `rgb(${Math.min(255, rgb.r * factor)}, ${Math.min(255, rgb.g * factor)}, ${Math.min(255, rgb.b * factor)})`;
    }

    darkenColor(color, factor) {
      const rgb = this.hexToRgb(color);
      return `rgb(${rgb.r * factor}, ${rgb.g * factor}, ${rgb.b * factor})`;
    }
  }

  // ============================================================================
  // Export to namespace
  // ============================================================================

  window.GalaxySim.Renderers = window.GalaxySim.Renderers || {};
  window.GalaxySim.Renderers.PlanetRenderer = PlanetRenderer;

})();

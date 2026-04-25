/*:
 * @target MZ
 * @plugindesc GalaxySim Effects Renderer Module - Visual effects and particles
 * @author Omni-Lex + Nocoldiz
 * @url
 * @help
 * ============================================================================
 * GalaxySim Effects Renderer Module
 * ============================================================================
 * This module handles visual effects:
 * - Particle system for explosions, trails, etc.
 * - Starfield background rendering
 * - Nebula rendering
 * - Milky Way band visualization
 * - UI effects (scan lines, grids, glows)
 *
 * LOAD ORDER: Must load AFTER GalaxySim_Math.js
 *
 * DEPENDENCIES:
 * - GalaxySim_Math.js
 *
 * NOTE: Some rendering functions remain in GalaxySim_Scene.js due to state dependencies.
 */

(() => {
  "use strict";

  // Check dependencies
  if (!window.GalaxySim || !window.GalaxySim.Math) {
    throw new Error("GalaxySim_Renderer_Effects requires GalaxySim_Math to be loaded first");
  }

  // Import from Math module
  const { Vector2 } = window.GalaxySim.Math;

  // ============================================================================
  // Particle Class
  // ============================================================================

  class Particle {
    constructor(x, y, vx, vy, life, color, size) {
      this.x = x;
      this.y = y;
      this.vx = vx;
      this.vy = vy;
      this.life = life;
      this.maxLife = life;
      this.color = color;
      this.size = size;
    }

    update(dt) {
      this.x += this.vx * dt * 60;
      this.y += this.vy * dt * 60;
      this.life -= dt;
      return this.life > 0;
    }

    draw(ctx, camera, width, height) {
      const screen = camera.worldToScreen(this.x, this.y, width, height);
      const alpha = this.life / this.maxLife;
      ctx.globalAlpha = alpha * 0.6;
      ctx.fillStyle = this.color;
      ctx.beginPath();
      ctx.arc(screen.x, screen.y, this.size * camera.zoom, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = 1;
    }
  }

  // ============================================================================
  // Starfield Background
  // ============================================================================

  function generateStarfield(count = 1000) {
    const stars = [];
    for (let i = 0; i < count; i++) {
      stars.push({
        x: Math.random(),
        y: Math.random(),
        brightness: Math.random() * 0.7 + 0.3,
        size: Math.random() * 1.5 + 0.5,
      });
    }
    return stars;
  }

  function drawStarfield(ctx, stars, width, height, opacity = 1.0) {
    ctx.globalAlpha = opacity;
    stars.forEach((star) => {
      const x = star.x * width;
      const y = star.y * height;
      ctx.fillStyle = `rgba(255, 255, 255, ${star.brightness})`;
      ctx.beginPath();
      ctx.arc(x, y, star.size, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.globalAlpha = 1;
  }

  // ============================================================================
  // Grid Overlay
  // ============================================================================

  function drawGrid(ctx, camera, width, height, gridSize, color, highlightColor) {
    const topLeft = camera.screenToWorld(0, 0, width, height);
    const bottomRight = camera.screenToWorld(width, height, width, height);

    const startX = Math.floor(topLeft.x / gridSize) * gridSize;
    const startY = Math.floor(topLeft.y / gridSize) * gridSize;
    const endX = Math.ceil(bottomRight.x / gridSize) * gridSize;
    const endY = Math.ceil(bottomRight.y / gridSize) * gridSize;

    ctx.strokeStyle = color;
    ctx.lineWidth = 1;
    ctx.globalAlpha = 0.3;

    // Vertical lines
    for (let x = startX; x <= endX; x += gridSize) {
      const screen1 = camera.worldToScreen(x, startY, width, height);
      const screen2 = camera.worldToScreen(x, endY, width, height);

      if (x % (gridSize * 10) === 0) {
        ctx.strokeStyle = highlightColor;
        ctx.lineWidth = 2;
      } else {
        ctx.strokeStyle = color;
        ctx.lineWidth = 1;
      }

      ctx.beginPath();
      ctx.moveTo(screen1.x, screen1.y);
      ctx.lineTo(screen2.x, screen2.y);
      ctx.stroke();
    }

    // Horizontal lines
    for (let y = startY; y <= endY; y += gridSize) {
      const screen1 = camera.worldToScreen(startX, y, width, height);
      const screen2 = camera.worldToScreen(endX, y, width, height);

      if (y % (gridSize * 10) === 0) {
        ctx.strokeStyle = highlightColor;
        ctx.lineWidth = 2;
      } else {
        ctx.strokeStyle = color;
        ctx.lineWidth = 1;
      }

      ctx.beginPath();
      ctx.moveTo(screen1.x, screen1.y);
      ctx.lineTo(screen2.x, screen2.y);
      ctx.stroke();
    }

    ctx.globalAlpha = 1;
  }

  // ============================================================================
  // Scan Line Effect
  // ============================================================================

  function drawScanLines(ctx, width, height, time, color) {
    const scanLineY = (time * 100) % height;

    const gradient = ctx.createLinearGradient(0, scanLineY - 50, 0, scanLineY + 50);
    gradient.addColorStop(0, 'rgba(0, 0, 0, 0)');
    gradient.addColorStop(0.5, color);
    gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

    ctx.fillStyle = gradient;
    ctx.fillRect(0, scanLineY - 50, width, 100);
  }

  // ============================================================================
  // Glow Effect
  // ============================================================================

  function drawGlow(ctx, x, y, radius, color, intensity = 1.0) {
    const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius);

    const rgbMatch = color.match(/\d+/g);
    if (rgbMatch && rgbMatch.length >= 3) {
      const r = rgbMatch[0];
      const g = rgbMatch[1];
      const b = rgbMatch[2];

      gradient.addColorStop(0, `rgba(${r}, ${g}, ${b}, ${0.8 * intensity})`);
      gradient.addColorStop(0.5, `rgba(${r}, ${g}, ${b}, ${0.4 * intensity})`);
      gradient.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`);
    } else {
      gradient.addColorStop(0, color);
      gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
    }

    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fill();
  }

  // ============================================================================
  // Connection Lines (for cosmic web, etc.)
  // ============================================================================

  function drawConnectionLine(ctx, x1, y1, x2, y2, color, thickness = 1, dashPattern = []) {
    ctx.strokeStyle = color;
    ctx.lineWidth = thickness;
    ctx.setLineDash(dashPattern);
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
    ctx.setLineDash([]);
  }

  // ============================================================================
  // Export to namespace
  // ============================================================================

  window.GalaxySim.Renderers = window.GalaxySim.Renderers || {};
  window.GalaxySim.Renderers.Effects = {
    Particle,
    generateStarfield,
    drawStarfield,
    drawGrid,
    drawScanLines,
    drawGlow,
    drawConnectionLine,
  };

})();

//=============================================================================
// WeaponSprites.js
//=============================================================================

/*:
 * @target MZ
 * @plugindesc v1.0.0 Individual weapon sprite classes for WeaponSystem
 * @author Assistant
 * @url https://nocoldiz.itch.io/hypernet-explorer
 *
 * @help WeaponSprites.js
 *
 * This plugin contains all the individual weapon sprite classes used by
 * the WeaponSystem plugin. Must be loaded BEFORE WeaponSystem.js
 *
 * Classes included:
 * - Sprite_WhipWeapon
 * - Sprite_FlailWeapon
 * - Sprite_NunchakuWeapon
 * - Sprite_ThrowWeapon
 * - Sprite_BowWeapon
 * - Sprite_Projectile
 *
 * ============================================================================
 * Terms of Use
 * ============================================================================
 *
 * Free for commercial and non-commercial use.
 */

(() => {
  "use strict";

  // Resolution scaling helpers (copied from WeaponSystem)
  const getResolutionScale = () => {
    if ($gameSystem && $gameSystem.getCurrentResolution) {
      const resolution = $gameSystem.getCurrentResolution();
      return resolution === "16:9" ? { x: 1.568, y: 1.154 } : { x: 1, y: 1 };
    }
    return { x: 1, y: 1 };
  };

  const getScaledWeaponX = (isLeftHand = false) => {
    const scale = getResolutionScale();
    if (isLeftHand) {
      return Math.round(200 * scale.x);
    }
    const weaponSpriteX = 650; // Default from WeaponSystem
    return Math.round(weaponSpriteX * scale.x);
  };

  const getScaledWeaponY = () => {
    const scale = getResolutionScale();
    const weaponSpriteY = 450; // Default from WeaponSystem
    return Math.round(weaponSpriteY * scale.y);
  };

  const debugLog = (...args) => {
    // Optional: enable debug logging
    // console.log("[WeaponSprites]", ...args);
  };

  //=============================================================================
  // Sprite_WhipWeapon - Physics-based Whip Animation
  //=============================================================================

  function Sprite_WhipWeapon() {
    this.initialize(...arguments);
  }

  Sprite_WhipWeapon.prototype = Object.create(Sprite.prototype);
  Sprite_WhipWeapon.prototype.constructor = Sprite_WhipWeapon;

  // Update Sprite_WhipWeapon.prototype.initialize to include idle bob properties:

  Sprite_WhipWeapon.prototype.initialize = function () {
    Sprite.prototype.initialize.call(this);
    this._segments = [];
    this._segmentCount = 24;
    this._segmentLength = 45;
    this._active = false;
    this._animationTime = 0;
    this._animationDuration = 1200;
    this._targetX = 0;
    this._targetY = 0;
    this._startX = getScaledWeaponX();
    this._startY = getScaledWeaponY();
    this._crackForce = 10;
    this._returnSpeed = 0.05;
    this._idleSwayTime = 0;
    this._visible = false;
    this._whipColor = null;

    // NEW: Sprite-based whip properties
    this._weaponSpriteName = null;
    this._whipHandleSprite = null;
    this._whipSegmentSprites = [];
    this._useSprites = false;

    // Idle bob properties
    this._idleCounter = Math.random() * 100;
    this._idleAmplitudeY = 3;
    this._idleSpeed = 0.02;

    this.initializeSegments();
    this.bitmap = new Bitmap(Graphics.width, Graphics.height);
  };
  Sprite_WhipWeapon.prototype.setWhipColor = function (color) {
    this._whipColor = color;
    debugLog("Whip color set to:", color);
  };
  Sprite_WhipWeapon.prototype.setSegmentCount = function (count) {
    if (count && count > 0) {
      this._segmentCount = count;
      this.initializeSegments();
      debugLog("Whip segment count set to:", count);
    }
  };
  Sprite_WhipWeapon.prototype.setWhipSprite = function (spriteName) {
    if (!spriteName) {
      this._useSprites = false;
      this._weaponSpriteName = null;
      return;
    }

    this._weaponSpriteName = spriteName;
    this._useSprites = true;

    // Create handle sprite (pinned at start)
    if (!this._whipHandleSprite) {
      this._whipHandleSprite = new Sprite();
      this._whipHandleSprite.anchor.x = 0.5;
      this._whipHandleSprite.anchor.y = 1.0; // Bottom of handle at pinned point
      this.addChild(this._whipHandleSprite);
    }
    this._whipHandleSprite.bitmap = ImageManager.loadWeaponPicture(spriteName);

    // Create 3 segment sprites
    for (let i = 0; i < 3; i++) {
      if (!this._whipSegmentSprites[i]) {
        this._whipSegmentSprites[i] = new Sprite();
        this._whipSegmentSprites[i].anchor.x = 0.5;
        this._whipSegmentSprites[i].anchor.y = 0.0; // Top of segment connects to previous
        this.addChild(this._whipSegmentSprites[i]);
      }
      this._whipSegmentSprites[i].bitmap =
        ImageManager.loadWeaponPicture(spriteName);
    }

    // Adjust physics for sprite-based whip (fewer physics segments between sprites)
    this._segmentCount = 12; // 4 segments between each sprite (3 sprites = 12 total)
    this._segmentLength = 60; // Longer segments
    this.initializeSegments();

    debugLog("Whip sprite set to:", spriteName);
  };
  Sprite_WhipWeapon.prototype.initializeSegments = function () {
    this._segments = [];
    for (let i = 0; i <= this._segmentCount; i++) {
      this._segments.push({
        x: this._startX,
        y: this._startY,
        prevX: this._startX,
        prevY: this._startY,
        pinned: i === 0,
      });
    }
  };

  Sprite_WhipWeapon.prototype.crack = function (targetX, targetY) {
    this._active = true;
    this._animationTime = 0;
    this._targetX = targetX;
    this._targetY = targetY;
    this._crackPhase = 0; // 0 = extending, 1 = retracting

    // Extend the target further to the top-left
    const dx = targetX - this._startX;
    const dy = targetY - this._startY;
    const distance = Math.sqrt(dx * dx + dy * dy);

    // Extend 50% further in the same direction
    const extendMultiplier = 1.5;
    this._targetX = this._startX + dx * extendMultiplier;
    this._targetY = this._startY + dy * extendMultiplier;

    // Add additional top-left bias
    this._targetX -= 100; // Push more to the left
    this._targetY -= 80; // Push more to the top

    debugLog(
      "Whip crack initiated towards extended target",
      this._targetX,
      this._targetY
    );

    // Initialize segments in a line towards target
    const finalDx = this._targetX - this._startX;
    const finalDy = this._targetY - this._startY;

    for (let i = 0; i <= this._segmentCount; i++) {
      const t = i / this._segmentCount;
      this._segments[i].x = this._startX + finalDx * t;
      this._segments[i].y = this._startY + finalDy * t;
      this._segments[i].prevX = this._segments[i].x;
      this._segments[i].prevY = this._segments[i].y;
    }
  };

  Sprite_WhipWeapon.prototype.updatePhysics = function (deltaTime) {
    if (!this._active) return;

    const progress = this._animationTime / this._animationDuration;

    // Phase 0: Extend and strike (0% to 50%)
    // Phase 1: Retract (50% to 100%)
    if (progress < 0.5) {
      this._crackPhase = 0;
      this.updateExtension(progress * 2); // 0 to 1
    } else {
      this._crackPhase = 1;
      this.updateRetraction((progress - 0.5) * 2); // 0 to 1
    }

    // Apply Verlet integration for natural motion
    for (let i = 1; i <= this._segmentCount; i++) {
      const seg = this._segments[i];

      if (this._crackPhase === 0) {
        // During extension, drive towards target
        const targetProgress = Math.min(1, progress * 2);
        const segmentTarget = i / this._segmentCount;

        if (targetProgress >= segmentTarget) {
          const forceToTarget = this.calculateForceToTarget(seg, i);
          seg.x += forceToTarget.x;
          seg.y += forceToTarget.y;
        }
      }

      // Verlet integration
      const vx = (seg.x - seg.prevX) * 0.98;
      const vy = (seg.y - seg.prevY) * 0.98;

      seg.prevX = seg.x;
      seg.prevY = seg.y;

      seg.x += vx;
      seg.y += vy;

      // Add slight gravity
      seg.y += 0.3;
    }

    // Apply constraints to maintain segment lengths
    for (let j = 0; j < 5; j++) {
      this.applyConstraints();
    }
  };

  Sprite_WhipWeapon.prototype.calculateForceToTarget = function (
    segment,
    index
  ) {
    const targetProgress = index / this._segmentCount;
    const targetX =
      this._startX + (this._targetX - this._startX) * targetProgress;
    const targetY =
      this._startY + (this._targetY - this._startY) * targetProgress;

    const dx = targetX - segment.x;
    const dy = targetY - segment.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance > 0) {
      const force = this._crackForce * (index / this._segmentCount);
      return {
        x: (dx / distance) * force,
        y: (dy / distance) * force,
      };
    }

    return { x: 0, y: 0 };
  };

  Sprite_WhipWeapon.prototype.updateExtension = function (progress) {
    // Pull tip towards target during extension
    const tipIndex = this._segmentCount;
    const tip = this._segments[tipIndex];

    const easeProgress = this.easeInOutQuad(progress);
    const targetX =
      this._startX + (this._targetX - this._startX) * easeProgress;
    const targetY =
      this._startY + (this._targetY - this._startY) * easeProgress;

    // Strongly pull tip towards target
    const pullStrength = 0.3;
    tip.x += (targetX - tip.x) * pullStrength;
    tip.y += (targetY - tip.y) * pullStrength;
  };

  Sprite_WhipWeapon.prototype.updateRetraction = function (progress) {
    // Pull all segments back towards start
    const easeProgress = this.easeInOutQuad(progress);

    for (let i = 1; i <= this._segmentCount; i++) {
      const seg = this._segments[i];
      const pullStrength = 0.15 * easeProgress;

      seg.x += (this._startX - seg.x) * pullStrength;
      seg.y += (this._startY - seg.y) * pullStrength;
    }
  };

  Sprite_WhipWeapon.prototype.applyConstraints = function () {
    // Keep first segment pinned
    this._segments[0].x = this._startX;
    this._segments[0].y = this._startY;

    // Maintain distances between segments
    for (let i = 0; i < this._segmentCount; i++) {
      const seg1 = this._segments[i];
      const seg2 = this._segments[i + 1];

      const dx = seg2.x - seg1.x;
      const dy = seg2.y - seg1.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance > 0) {
        const difference = this._segmentLength - distance;
        const percent = difference / distance / 2;
        const offsetX = dx * percent;
        const offsetY = dy * percent;

        if (!seg1.pinned) {
          seg1.x -= offsetX;
          seg1.y -= offsetY;
        }

        seg2.x += offsetX;
        seg2.y += offsetY;
      }
    }
  };

  Sprite_WhipWeapon.prototype.easeInOutQuad = function (t) {
    return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
  };

  Sprite_WhipWeapon.prototype.update = function () {
    Sprite.prototype.update.call(this);

    if (this._active) {
      this._animationTime += 16.67; // ~60fps

      this.updatePhysics(16.67);
      this.redraw();

      if (this._animationTime >= this._animationDuration) {
        this._active = false;
        debugLog("Whip attack animation complete, returning to idle dangle");
      }
    } else if (this._visible) {
      // Idle dangling animation
      this._idleSwayTime += 0.02;
      this.updateIdleDangle();
      this.redraw();
    }
  };

  Sprite_WhipWeapon.prototype.redraw = function () {
    if (!this.bitmap) {
      this.bitmap = new Bitmap(Graphics.width, Graphics.height);
    }

    this.bitmap.clear();

    if (this._useSprites) {
      // Sprite-based whip rendering
      this.redrawSpriteWhip();
    } else {
      // Original drawn whip rendering
      this.redrawDrawnWhip();
    }

    this.bitmap._baseTexture.update();
  };
  Sprite_WhipWeapon.prototype.redrawDrawnWhip = function () {
    const ctx = this.bitmap.context;

    // Determine colors to use
    let baseColor, midColor, darkColor, highlightColor;

    if (this._whipColor) {
      baseColor = this._whipColor;
      const rgb = this._hexToRgb(this._whipColor);
      if (rgb) {
        midColor = this._rgbToHex(
          Math.floor(rgb.r * 0.7),
          Math.floor(rgb.g * 0.7),
          Math.floor(rgb.b * 0.7)
        );
        darkColor = this._rgbToHex(
          Math.floor(rgb.r * 0.5),
          Math.floor(rgb.g * 0.5),
          Math.floor(rgb.b * 0.5)
        );
        highlightColor = this._rgbToHex(
          Math.min(255, Math.floor(rgb.r * 1.2)),
          Math.min(255, Math.floor(rgb.g * 1.2)),
          Math.min(255, Math.floor(rgb.b * 1.2))
        );
      } else {
        midColor = this._whipColor;
        darkColor = this._whipColor;
        highlightColor = this._whipColor;
      }
    } else {
      baseColor = "#8B4513";
      midColor = "#654321";
      darkColor = "#4A3520";
      highlightColor = "rgba(139, 90, 43, 0.6)";
    }

    // Draw whip with gradient thickness
    for (let i = 0; i < this._segmentCount; i++) {
      const seg1 = this._segments[i];
      const seg2 = this._segments[i + 1];

      const thicknessStart = 22 - (i / this._segmentCount) * 18;
      const thicknessEnd = 22 - ((i + 1) / this._segmentCount) * 18;

      ctx.save();

      const gradient = ctx.createLinearGradient(seg1.x, seg1.y, seg2.x, seg2.y);
      gradient.addColorStop(0, baseColor);
      gradient.addColorStop(0.5, midColor);
      gradient.addColorStop(1, darkColor);
      ctx.strokeStyle = gradient;

      ctx.lineWidth = (thicknessStart + thicknessEnd) / 2;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";

      ctx.beginPath();
      ctx.moveTo(seg1.x, seg1.y);
      ctx.lineTo(seg2.x, seg2.y);
      ctx.stroke();

      if (this._whipColor) {
        ctx.strokeStyle = highlightColor;
        ctx.globalAlpha = 0.4;
      } else {
        ctx.strokeStyle = highlightColor;
      }
      ctx.lineWidth = ((thicknessStart + thicknessEnd) / 2) * 0.4;
      ctx.beginPath();
      ctx.moveTo(seg1.x, seg1.y - 1);
      ctx.lineTo(seg2.x, seg2.y - 1);
      ctx.stroke();

      ctx.restore();
    }

    // Draw impact flash at tip when near target
    if (this._crackPhase === 0) {
      const tip = this._segments[this._segmentCount];
      const distToTarget = Math.sqrt(
        Math.pow(tip.x - this._targetX, 2) + Math.pow(tip.y - this._targetY, 2)
      );

      if (distToTarget < 50) {
        const alpha = 1 - distToTarget / 50;
        const ctx = this.bitmap.context;
        ctx.save();
        ctx.globalAlpha = alpha * 0.8;

        const gradient = ctx.createRadialGradient(
          tip.x,
          tip.y,
          0,
          tip.x,
          tip.y,
          40
        );
        gradient.addColorStop(0, "rgba(255, 255, 200, 1)");
        gradient.addColorStop(0.5, "rgba(255, 200, 100, 0.8)");
        gradient.addColorStop(1, "rgba(255, 150, 0, 0)");

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(tip.x, tip.y, 40, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
    }
  };

  Sprite_WhipWeapon.prototype.redrawSpriteWhip = function () {
    const ctx = this.bitmap.context;

    // Update handle sprite at pinned position
    if (this._whipHandleSprite) {
      this._whipHandleSprite.x = this._segments[0].x;
      this._whipHandleSprite.y = this._segments[0].y;
      this._whipHandleSprite.visible = true;

      // Rotate handle to face first segment
      if (this._segments.length > 1) {
        const seg1 = this._segments[0];
        const seg2 = this._segments[1];
        const angle = Math.atan2(seg2.y - seg1.y, seg2.x - seg1.x);
        this._whipHandleSprite.rotation = angle + Math.PI / 2;
      }
    }

    // Draw connecting lines between handle and first sprite segment
    const segmentsPerSprite = this._segmentCount / 3;

    // First sprite segment (connects to handle)
    const sprite1StartIdx = Math.floor(segmentsPerSprite);
    const sprite1Seg = this._segments[sprite1StartIdx];

    if (this._whipSegmentSprites[0]) {
      this._whipSegmentSprites[0].x = sprite1Seg.x;
      this._whipSegmentSprites[0].y = sprite1Seg.y;
      this._whipSegmentSprites[0].visible = true;

      // Rotate to face next sprite
      const nextIdx = Math.floor(segmentsPerSprite * 2);
      if (this._segments[nextIdx]) {
        const angle = Math.atan2(
          this._segments[nextIdx].y - sprite1Seg.y,
          this._segments[nextIdx].x - sprite1Seg.x
        );
        this._whipSegmentSprites[0].rotation = angle + Math.PI / 2;
      }

      // Draw connection from handle to first sprite
      this.drawConnection(ctx, this._segments[0], sprite1Seg);
    }

    // Second sprite segment
    const sprite2StartIdx = Math.floor(segmentsPerSprite * 2);
    const sprite2Seg = this._segments[sprite2StartIdx];

    if (this._whipSegmentSprites[1]) {
      this._whipSegmentSprites[1].x = sprite2Seg.x;
      this._whipSegmentSprites[1].y = sprite2Seg.y;
      this._whipSegmentSprites[1].visible = true;

      // Rotate to face next sprite
      const nextIdx = Math.floor(segmentsPerSprite * 3);
      if (this._segments[nextIdx]) {
        const angle = Math.atan2(
          this._segments[nextIdx].y - sprite2Seg.y,
          this._segments[nextIdx].x - sprite2Seg.x
        );
        this._whipSegmentSprites[1].rotation = angle + Math.PI / 2;
      }

      // Draw connection from first sprite to second sprite
      this.drawConnection(ctx, sprite1Seg, sprite2Seg);
    }

    // Third sprite segment (tip)
    const sprite3Seg = this._segments[this._segmentCount];

    if (this._whipSegmentSprites[2]) {
      this._whipSegmentSprites[2].x = sprite3Seg.x;
      this._whipSegmentSprites[2].y = sprite3Seg.y;
      this._whipSegmentSprites[2].visible = true;

      // Rotate to face away from previous
      const angle = Math.atan2(
        sprite3Seg.y - sprite2Seg.y,
        sprite3Seg.x - sprite2Seg.x
      );
      this._whipSegmentSprites[2].rotation = angle + Math.PI / 2;

      // Draw connection from second sprite to third sprite
      this.drawConnection(ctx, sprite2Seg, sprite3Seg);
    }

    // Draw impact flash at tip when near target
    if (this._crackPhase === 0) {
      const tip = this._segments[this._segmentCount];
      const distToTarget = Math.sqrt(
        Math.pow(tip.x - this._targetX, 2) + Math.pow(tip.y - this._targetY, 2)
      );

      if (distToTarget < 50) {
        const alpha = 1 - distToTarget / 50;
        ctx.save();
        ctx.globalAlpha = alpha * 0.8;

        const gradient = ctx.createRadialGradient(
          tip.x,
          tip.y,
          0,
          tip.x,
          tip.y,
          40
        );
        gradient.addColorStop(0, "rgba(255, 255, 200, 1)");
        gradient.addColorStop(0.5, "rgba(255, 200, 100, 0.8)");
        gradient.addColorStop(1, "rgba(255, 150, 0, 0)");

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(tip.x, tip.y, 40, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
    }
  };

  Sprite_WhipWeapon.prototype.drawConnection = function (ctx, seg1, seg2) {
    // Draw thin connecting line between sprite segments
    ctx.save();

    const baseColor = this._whipColor || "#8B4513";

    ctx.strokeStyle = baseColor;
    ctx.lineWidth = 6;
    ctx.lineCap = "round";

    ctx.beginPath();
    ctx.moveTo(seg1.x, seg1.y);
    ctx.lineTo(seg2.x, seg2.y);
    ctx.stroke();

    ctx.restore();
  };
  Sprite_WhipWeapon.prototype._hexToRgb = function (hex) {
    // Remove # if present
    hex = hex.replace(/^#/, "");

    // Parse hex color
    if (hex.length === 3) {
      hex = hex
        .split("")
        .map((char) => char + char)
        .join("");
    }

    if (hex.length !== 6) {
      return null;
    }

    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);

    if (isNaN(r) || isNaN(g) || isNaN(b)) {
      return null;
    }

    return { r, g, b };
  };

  Sprite_WhipWeapon.prototype._rgbToHex = function (r, g, b) {
    const toHex = (n) => {
      const hex = Math.max(0, Math.min(255, n)).toString(16);
      return hex.length === 1 ? "0" + hex : hex;
    };

    return "#" + toHex(r) + toHex(g) + toHex(b);
  };
  // Update Sprite_WhipWeapon.prototype.updateIdleDangle to include bobbing:

  Sprite_WhipWeapon.prototype.updateIdleDangle = function () {
    // NEW: Apply idle bob to base position
    this._idleCounter += 1;
    if (this._idleCounter > 1000) {
      this._idleCounter = 0;
    }
    const bob = Math.sin(this._idleCounter * this._idleSpeed);
    const bobbedStartY = getScaledWeaponY() + bob * this._idleAmplitudeY;

    // Update first segment to bobbed position
    this._segments[0].y = bobbedStartY;
    this._startY = bobbedStartY;

    // Apply gravity and gentle swaying to create dangling effect
    for (let i = 1; i <= this._segmentCount; i++) {
      const seg = this._segments[i];

      // Add gentle swaying motion
      const swayAmount = Math.sin(this._idleSwayTime + i * 0.3) * 0.5;

      // Verlet integration for natural movement
      const vx = (seg.x - seg.prevX) * 0.95;
      const vy = (seg.y - seg.prevY) * 0.95;

      seg.prevX = seg.x;
      seg.prevY = seg.y;

      seg.x += vx + swayAmount;
      seg.y += vy + 0.5; // Gravity
    }

    // Apply constraints to maintain segment lengths
    for (let j = 0; j < 3; j++) {
      this.applyConstraints();
    }

    this._idleSwayTime += 0.02;
  };

  Sprite_WhipWeapon.prototype.show = function () {
    this._visible = true;
    this.initializeSegments();
    this._idleSwayTime = 0;
  };

  Sprite_WhipWeapon.prototype.clear = function () {
    if (this.bitmap) {
      this.bitmap.clear();
    }
    this._visible = false;
    this.initializeSegments();

    // Hide sprite elements
    if (this._whipHandleSprite) {
      this._whipHandleSprite.visible = false;
    }
    for (let i = 0; i < this._whipSegmentSprites.length; i++) {
      if (this._whipSegmentSprites[i]) {
        this._whipSegmentSprites[i].visible = false;
      }
    }
  };
  Sprite_WhipWeapon.prototype.setWhipTexture = function (spriteName) {
    // Redirect to setWhipSprite for proper handling
    this.setWhipSprite(spriteName);
  };

  //=============================================================================
  // Sprite_FlailWeapon - Physics-based Flail Animation with Chain
  //=============================================================================

  function Sprite_FlailWeapon() {
    this.initialize(...arguments);
  }

  Sprite_FlailWeapon.prototype = Object.create(Sprite.prototype);
  Sprite_FlailWeapon.prototype.constructor = Sprite_FlailWeapon;

  // Update Sprite_FlailWeapon.prototype.initialize:

  Sprite_FlailWeapon.prototype.initialize = function () {
    Sprite.prototype.initialize.call(this);
    this._segments = [];
    this._segmentCount = 6;
    this._segmentLength = 50;
    this._active = false;
    this._animationTime = 0;
    this._animationDuration = 1000;
    this._targetX = 0;
    this._targetY = 0;
    this._startX = getScaledWeaponX();
    this._startY = getScaledWeaponY();
    this._swingForce = 12;
    this._returnSpeed = 0.05;
    this._idleSwayTime = 0;
    this._visible = false;
    this._flailHeadSprite = null;
    this._weaponSpriteName = null;
    this._chainColor = null;

    // NEW: Idle bob properties
    this._idleCounter = Math.random() * 100;
    this._idleAmplitudeY = 3;
    this._idleSpeed = 0.02;

    this.initializeSegments();
    this.bitmap = new Bitmap(Graphics.width, Graphics.height);
  };
  Sprite_FlailWeapon.prototype.setSegmentCount = function (count) {
    if (count && count > 0) {
      this._segmentCount = count;
      this.initializeSegments();
      debugLog("Flail segment count set to:", count);
    }
  };

  Sprite_FlailWeapon.prototype.initializeSegments = function () {
    this._segments = [];
    for (let i = 0; i <= this._segmentCount; i++) {
      this._segments.push({
        x: this._startX,
        y: this._startY,
        prevX: this._startX,
        prevY: this._startY,
        pinned: i === 0,
      });
    }
  };
  Sprite_FlailWeapon.prototype.setChainColor = function (color) {
    this._chainColor = color;
    debugLog("Flail chain color set to:", color);
  };
  Sprite_FlailWeapon.prototype.setFlailHead = function (spriteName) {
    this._weaponSpriteName = spriteName;
    if (!this._flailHeadSprite) {
      this._flailHeadSprite = new Sprite();
      this._flailHeadSprite.anchor.x = 0.5;
      this._flailHeadSprite.anchor.y = 0.5;
      this.addChild(this._flailHeadSprite);
    }
    this._flailHeadSprite.bitmap = ImageManager.loadWeaponPicture(spriteName);
    debugLog("Flail head set to:", spriteName);
  };

  Sprite_FlailWeapon.prototype.swing = function (targetX, targetY) {
    this._active = true;
    this._animationTime = 0;
    this._targetX = targetX;
    this._targetY = targetY;
    this._crackPhase = 0; // 0 = extending, 1 = retracting

    // Extend target for more dramatic swing
    const dx = targetX - this._startX;
    const dy = targetY - this._startY;
    const extendMultiplier = 1.3;
    this._targetX = this._startX + dx * extendMultiplier;
    this._targetY = this._startY + dy * extendMultiplier;

    debugLog("Flail swing initiated towards", this._targetX, this._targetY);

    // Initialize segments in a line towards target
    const finalDx = this._targetX - this._startX;
    const finalDy = this._targetY - this._startY;

    for (let i = 0; i <= this._segmentCount; i++) {
      const t = i / this._segmentCount;
      this._segments[i].x = this._startX + finalDx * t;
      this._segments[i].y = this._startY + finalDy * t;
      this._segments[i].prevX = this._segments[i].x;
      this._segments[i].prevY = this._segments[i].y;
    }
  };

  Sprite_FlailWeapon.prototype.updatePhysics = function (deltaTime) {
    if (!this._active) return;

    const progress = this._animationTime / this._animationDuration;

    if (progress < 0.5) {
      this._crackPhase = 0;
      this.updateExtension(progress * 2);
    } else {
      this._crackPhase = 1;
      this.updateRetraction((progress - 0.5) * 2);
    }

    // Apply Verlet integration
    for (let i = 1; i <= this._segmentCount; i++) {
      const seg = this._segments[i];

      if (this._crackPhase === 0) {
        const targetProgress = Math.min(1, progress * 2);
        const segmentTarget = i / this._segmentCount;

        if (targetProgress >= segmentTarget) {
          const forceToTarget = this.calculateForceToTarget(seg, i);
          seg.x += forceToTarget.x;
          seg.y += forceToTarget.y;
        }
      }

      const vx = (seg.x - seg.prevX) * 0.96;
      const vy = (seg.y - seg.prevY) * 0.96;

      seg.prevX = seg.x;
      seg.prevY = seg.y;

      seg.x += vx;
      seg.y += vy;

      // Gravity
      seg.y += 0.4;
    }

    // Apply constraints
    for (let j = 0; j < 5; j++) {
      this.applyConstraints();
    }
  };

  Sprite_FlailWeapon.prototype.calculateForceToTarget = function (
    segment,
    index
  ) {
    const targetProgress = index / this._segmentCount;
    const targetX =
      this._startX + (this._targetX - this._startX) * targetProgress;
    const targetY =
      this._startY + (this._targetY - this._startY) * targetProgress;

    const dx = targetX - segment.x;
    const dy = targetY - segment.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance > 0) {
      const force = this._swingForce * (index / this._segmentCount);
      return {
        x: (dx / distance) * force,
        y: (dy / distance) * force,
      };
    }

    return { x: 0, y: 0 };
  };

  Sprite_FlailWeapon.prototype.updateExtension = function (progress) {
    const tipIndex = this._segmentCount;
    const tip = this._segments[tipIndex];

    const easeProgress = this.easeInOutQuad(progress);
    const targetX =
      this._startX + (this._targetX - this._startX) * easeProgress;
    const targetY =
      this._startY + (this._targetY - this._startY) * easeProgress;

    const pullStrength = 0.25;
    tip.x += (targetX - tip.x) * pullStrength;
    tip.y += (targetY - tip.y) * pullStrength;
  };

  Sprite_FlailWeapon.prototype.updateRetraction = function (progress) {
    const easeProgress = this.easeInOutQuad(progress);

    for (let i = 1; i <= this._segmentCount; i++) {
      const seg = this._segments[i];
      const pullStrength = 0.12 * easeProgress;

      seg.x += (this._startX - seg.x) * pullStrength;
      seg.y += (this._startY - seg.y) * pullStrength;
    }
  };

  Sprite_FlailWeapon.prototype.applyConstraints = function () {
    this._segments[0].x = this._startX;
    this._segments[0].y = this._startY;

    for (let i = 0; i < this._segmentCount; i++) {
      const seg1 = this._segments[i];
      const seg2 = this._segments[i + 1];

      const dx = seg2.x - seg1.x;
      const dy = seg2.y - seg1.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance > 0) {
        const difference = this._segmentLength - distance;
        const percent = difference / distance / 2;
        const offsetX = dx * percent;
        const offsetY = dy * percent;

        if (!seg1.pinned) {
          seg1.x -= offsetX;
          seg1.y -= offsetY;
        }

        seg2.x += offsetX;
        seg2.y += offsetY;
      }
    }
  };

  Sprite_FlailWeapon.prototype.easeInOutQuad = function (t) {
    return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
  };

  Sprite_FlailWeapon.prototype.update = function () {
    Sprite.prototype.update.call(this);

    if (this._active) {
      this._animationTime += 16.67;

      this.updatePhysics(16.67);
      this.redraw();

      if (this._animationTime >= this._animationDuration) {
        this._active = false;
        debugLog("Flail attack animation complete");
      }
    } else if (this._visible) {
      this._idleSwayTime += 0.015;
      this.updateIdleDangle();
      this.redraw();
    }
  };

  Sprite_FlailWeapon.prototype.redraw = function () {
    if (!this.bitmap) {
      this.bitmap = new Bitmap(Graphics.width, Graphics.height);
    }

    this.bitmap.clear();
    const ctx = this.bitmap.context;

    // Determine colors to use
    let darkColor, metalColor, highlightColor;

    if (this._chainColor) {
      // Use custom color for chain
      darkColor = this._chainColor;
      metalColor = this._chainColor;
      highlightColor = this._chainColor;
    } else {
      // Default metal colors
      darkColor = "#303030";
      metalColor = "#808080";
      highlightColor = "rgba(200, 200, 200, 0.6)";
    }

    // Draw interlinking chain - alternating horizontal and vertical ovals
    for (let i = 0; i < this._segmentCount; i++) {
      const seg1 = this._segments[i];
      const seg2 = this._segments[i + 1];

      // Calculate angle and center position for link
      const angle = Math.atan2(seg2.y - seg1.y, seg2.x - seg1.x);
      const centerX = (seg1.x + seg2.x) / 2;
      const centerY = (seg1.y + seg2.y) / 2;

      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.rotate(angle);

      // Alternate between horizontal and vertical orientation for interlinking
      const isVertical = i % 2 === 0;
      const linkWidth = isVertical ? 12 : 24;
      const linkHeight = isVertical ? 24 : 12;
      const thickness = 4;

      // Draw the link at 90 degree rotation alternating
      const linkRotation = isVertical ? Math.PI / 2 : 0;

      ctx.save();
      ctx.rotate(linkRotation);

      // Outer oval - dark outline
      ctx.strokeStyle = darkColor;
      ctx.lineWidth = thickness + 2;
      ctx.beginPath();
      ctx.ellipse(0, 0, linkWidth, linkHeight, 0, 0, Math.PI * 2);
      ctx.stroke();

      // Middle oval - metal color
      ctx.strokeStyle = metalColor;
      ctx.lineWidth = thickness;
      ctx.beginPath();
      ctx.ellipse(0, 0, linkWidth, linkHeight, 0, 0, Math.PI * 2);
      ctx.stroke();

      // Inner highlight (top half only)
      if (this._chainColor) {
        ctx.strokeStyle = this._chainColor;
        ctx.globalAlpha = 0.6;
      } else {
        ctx.strokeStyle = highlightColor;
      }
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.ellipse(
        -1,
        -1,
        linkWidth - 2,
        linkHeight - 2,
        0,
        Math.PI,
        Math.PI * 2
      );
      ctx.stroke();

      ctx.restore();
      ctx.restore();
    }

    this.bitmap._baseTexture.update();

    // Update flail head position and rotation
    if (this._flailHeadSprite) {
      const tip = this._segments[this._segmentCount];
      const prevTip = this._segments[this._segmentCount - 1];

      this._flailHeadSprite.x = tip.x;
      this._flailHeadSprite.y = tip.y;

      // Rotate flail head based on movement direction
      const angle = Math.atan2(tip.y - prevTip.y, tip.x - prevTip.x);
      this._flailHeadSprite.rotation = angle + Math.PI / 2;

      // Scale based on velocity for impact effect
      const velocity = Math.sqrt(
        Math.pow(tip.x - tip.prevX, 2) + Math.pow(tip.y - tip.prevY, 2)
      );
      const scale = 1.0 + Math.min(velocity * 0.02, 0.3);
      this._flailHeadSprite.scale.x = scale;
      this._flailHeadSprite.scale.y = scale;
    }
  };

  // Update Sprite_FlailWeapon.prototype.updateIdleDangle:

  Sprite_FlailWeapon.prototype.updateIdleDangle = function () {
    // NEW: Apply idle bob to base position
    this._idleCounter += 1;
    if (this._idleCounter > 1000) {
      this._idleCounter = 0;
    }
    const bob = Math.sin(this._idleCounter * this._idleSpeed);
    const bobbedStartY = getScaledWeaponY() + bob * this._idleAmplitudeY;

    // Update first segment to bobbed position
    this._segments[0].y = bobbedStartY;
    this._startY = bobbedStartY;

    for (let i = 1; i <= this._segmentCount; i++) {
      const seg = this._segments[i];

      const swayAmount = Math.sin(this._idleSwayTime + i * 0.2) * 0.3;

      const vx = (seg.x - seg.prevX) * 0.95;
      const vy = (seg.y - seg.prevY) * 0.95;

      seg.prevX = seg.x;
      seg.prevY = seg.y;

      seg.x += vx + swayAmount;
      seg.y += vy + 0.3;
    }

    for (let j = 0; j < 3; j++) {
      this.applyConstraints();
    }

    this._idleSwayTime += 0.015;
  };

  Sprite_FlailWeapon.prototype.show = function () {
    this._visible = true;
    this.initializeSegments();
    this._idleSwayTime = 0;
    if (this._flailHeadSprite) {
      this._flailHeadSprite.visible = true;
    }
  };

  Sprite_FlailWeapon.prototype.clear = function () {
    if (this.bitmap) {
      this.bitmap.clear();
    }
    this._visible = false;
    this.initializeSegments();
    if (this._flailHeadSprite) {
      this._flailHeadSprite.visible = false;
    }
  };

  // Make globally accessible
  //=============================================================================
  // Sprite_ThrowWeapon - Physics-based Throw Animation
  //=============================================================================

  function Sprite_ThrowWeapon() {
    this.initialize(...arguments);
  }

  Sprite_ThrowWeapon.prototype = Object.create(Sprite.prototype);
  Sprite_ThrowWeapon.prototype.constructor = Sprite_ThrowWeapon;

  Sprite_ThrowWeapon.prototype.initialize = function () {
    Sprite.prototype.initialize.call(this);
    this.anchor.x = 0.5;
    this.anchor.y = 0.5;
    this._active = false;
    this._startX = getScaledWeaponX();
    this._startY = getScaledWeaponY();
    this._targetX = 0;
    this._targetY = 0;
    this._animationTime = 0;
    this._throwDuration = 600; // ms for throw
    this._returnDuration = 400; // ms for return
    this._weight = 300; // grams
    this._returning = false;
    this._visible = false;
    this._weaponSprite = null;
    this.visible = false;
  };

  Sprite_ThrowWeapon.prototype.setWeaponSprite = function (spriteName) {
    this.bitmap = ImageManager.loadWeaponPicture(spriteName);
    this._weaponSprite = spriteName;
    this.x = this._startX;
    this.y = this._startY;
    this.rotation = 0;
    this.scale.x = 1.0;
    this.scale.y = 1.0;
    this.opacity = 255;
    debugLog("Throw weapon sprite set to:", spriteName);
  };

  Sprite_ThrowWeapon.prototype.setWeight = function (weight) {
    this._weight = weight || 300;
    // Adjust throw duration based on weight (heavier = slower arc)
    this._throwDuration = 400 + (this._weight / 300) * 200;
    debugLog(
      `Throw weapon weight: ${this._weight}g, duration: ${this._throwDuration}ms`
    );
  };

  Sprite_ThrowWeapon.prototype.throwWeapon = function (targetX, targetY) {
    if (!this.bitmap) return;

    this._active = true;
    this._returning = false;
    this._animationTime = 0;
    this._targetX = targetX;
    this._targetY = targetY;
    this.x = this._startX;
    this.y = this._startY;
    this.rotation = 0;
    this.scale.x = 1.0;
    this.scale.y = 1.0;
    this.visible = true;

    debugLog(`Throwing weapon to (${targetX}, ${targetY})`);
  };

  Sprite_ThrowWeapon.prototype.update = function () {
    Sprite.prototype.update.call(this);

    if (!this._visible) return;

    // Keep idle counter in range
    if (this._idleCounter > 1000) {
      this._idleCounter = 0;
    }

    if (!this._active) {
      // Idle animation when not throwing
      this._idleCounter += 1;
      const sway = Math.sin(this._idleCounter * this._idleSpeed);
      this.y = getScaledWeaponY() + sway * this._idleAmplitudeY;
      this.rotation = sway * 0.01;
      this.x = getScaledWeaponX();
      this.scale.x = 1.0;
      this.scale.y = 1.0;
      this.opacity = 255;
      this.visible = true;
      return;
    }

    this._animationTime += 16.67; // ~60fps

    if (!this._returning) {
      this.updateThrow();
    } else {
      this.updateReturn();
    }
  };

  Sprite_ThrowWeapon.prototype.updateThrow = function () {
    const progress = Math.min(1.0, this._animationTime / this._throwDuration);

    if (progress >= 1.0) {
      // Start return animation - position weapon off-screen
      this._returning = true;
      this._animationTime = 0;
      // Position weapon off-screen bottom-right for return slide
      this.x = Graphics.width + 100;
      this.y = Graphics.height + 100;
      this.scale.x = 0.2;
      this.scale.y = 0.2;
      this.opacity = 100;
      return;
    }

    // Eased progress for smooth motion
    const easeProgress = this.easeInOutQuad(progress);

    // Linear interpolation for position
    this.x = this._startX + (this._targetX - this._startX) * easeProgress;

    // Parabolic arc based on weight
    const dx = this._targetX - this._startX;
    const dy = this._targetY - this._startY;
    const linearY = this._startY + dy * easeProgress;

    // Arc height depends on weight (lighter = higher arc)
    const arcHeight = 120 * (300 / this._weight);
    const arcOffset = Math.sin(progress * Math.PI) * arcHeight;

    this.y = linearY - arcOffset;

    // Reduced spinning rotation (1-2 full rotations based on weight)
    const rotationSpeed = 1.5 + (300 / this._weight) * 0.5; // 1.5 to 2 rotations
    this.rotation = progress * Math.PI * 2 * rotationSpeed;

    // Scale down to simulate distance with smoother curve
    const minScale = 0.4;
    const scaleProgress = 1.0 - easeProgress * (1.0 - minScale);
    this.scale.x = scaleProgress;
    this.scale.y = scaleProgress;
  };

  Sprite_ThrowWeapon.prototype.updateReturn = function () {
    const progress = Math.min(1.0, this._animationTime / this._returnDuration);

    if (progress >= 1.0) {
      // Return complete - back to idle
      this._active = false;
      this._returning = false;
      this.visible = true;
      this.x = getScaledWeaponX();
      this.y = getScaledWeaponY();
      this.rotation = 0;
      this.scale.x = 1.0;
      this.scale.y = 1.0;
      this.opacity = 255;
      debugLog("Throw weapon returned to hand");
      return;
    }

    // Ease out cubic for smooth deceleration
    const easeProgress = 1 - Math.pow(1 - progress, 3);

    // Start position: off-screen bottom
    const startX = Graphics.width + 100; // Start from right side off-screen
    const startY = Graphics.height + 100; // Start from below screen

    // Slide diagonally from bottom-right to hand position
    this.x = startX + (getScaledWeaponX() - startX) * easeProgress;
    this.y = startY + (getScaledWeaponY() - startY) * easeProgress;

    // Scale up as it returns (starts small, grows to normal)
    this.scale.x = 0.2 + 0.8 * easeProgress;
    this.scale.y = 0.2 + 0.8 * easeProgress;

    // Spin clockwise as it returns (1 rotation)
    this.rotation = (1 - progress) * Math.PI * 2;

    // Add slight fade in
    this.opacity = 100 + 155 * easeProgress;
    this.visible = true;
  };
  Sprite_ThrowWeapon.prototype.easeInOutQuad = function (t) {
    return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
  };

  Sprite_ThrowWeapon.prototype.show = function () {
    this._visible = true;
    this.visible = true;
    this.x = getScaledWeaponX();
    this.y = getScaledWeaponY();
    this.rotation = 0;
    this.scale.x = 1.0;
    this.scale.y = 1.0;
    this.opacity = 255;
  };
  Sprite_ThrowWeapon.prototype.clear = function () {
    this._active = false;
    this.visible = false;
    this._visible = false;
  };

  Sprite_ThrowWeapon.prototype.isActive = function () {
    return this._active;
  };

  //=============================================================================
  // Sprite_NunchakuWeapon - NEW Physics-based Nunchaku with two weapon sprites
  //=============================================================================

  function Sprite_NunchakuWeapon() {
    this.initialize(...arguments);
  }

  Sprite_NunchakuWeapon.prototype = Object.create(Sprite.prototype);
  Sprite_NunchakuWeapon.prototype.constructor = Sprite_NunchakuWeapon;

  // Update Sprite_NunchakuWeapon.prototype.initialize:

  Sprite_NunchakuWeapon.prototype.initialize = function () {
    Sprite.prototype.initialize.call(this);
    this._segments = [];
    this._segmentCount = 5;
    this._segmentLength = 60;
    this._active = false;
    this._animationTime = 0;
    this._animationDuration = 800;
    this._targetX = 0;
    this._targetY = 0;
    this._startX = getScaledWeaponX();
    this._startY = getScaledWeaponY();
    this._swingForce = 15;
    this._idleSwayTime = 0;
    this._visible = false;
    this._chainColor = null;

    // Two weapon sprites at each end
    this._leftHandSprite = null;
    this._rightHandSprite = null;
    this._weaponSpriteName = null;

    // NEW: Idle bob properties
    this._idleCounter = Math.random() * 100;
    this._idleAmplitudeY = 3;
    this._idleSpeed = 0.02;

    this.initializeSegments();
    this.bitmap = new Bitmap(Graphics.width, Graphics.height);
  };

  Sprite_NunchakuWeapon.prototype.initializeSegments = function () {
    this._segments = [];
    for (let i = 0; i <= this._segmentCount; i++) {
      this._segments.push({
        x: this._startX,
        y: this._startY,
        prevX: this._startX,
        prevY: this._startY,
        pinned: i === 0, // Only first segment pinned
      });
    }
  };

  Sprite_NunchakuWeapon.prototype.setChainColor = function (color) {
    this._chainColor = color;
    debugLog("Nunchaku chain color set to:", color);
  };
  Sprite_NunchakuWeapon.prototype.setSegmentCount = function (count) {
    if (count && count > 0) {
      this._segmentCount = count;
      this.initializeSegments();
      debugLog("Nunchaku segment count set to:", count);
    }
  };
  Sprite_NunchakuWeapon.prototype.setNunchakuSprites = function (spriteName) {
    this._weaponSpriteName = spriteName;

    // Create left hand sprite (attached to first segment)
    if (!this._leftHandSprite) {
      this._leftHandSprite = new Sprite();
      this._leftHandSprite.anchor.x = 0.5;
      this._leftHandSprite.anchor.y = 0.5;
      this.addChild(this._leftHandSprite);
    }
    this._leftHandSprite.bitmap = ImageManager.loadWeaponPicture(spriteName);

    // Create right hand sprite (attached to last segment)
    if (!this._rightHandSprite) {
      this._rightHandSprite = new Sprite();
      this._rightHandSprite.anchor.x = 0.5;
      this._rightHandSprite.anchor.y = 0.5;
      this.addChild(this._rightHandSprite);
    }
    this._rightHandSprite.bitmap = ImageManager.loadWeaponPicture(spriteName);

    debugLog("Nunchaku sprites set to:", spriteName);
  };

  Sprite_NunchakuWeapon.prototype.swing = function (targetX, targetY) {
    this._active = true;
    this._animationTime = 0;
    this._targetX = targetX;
    this._targetY = targetY;
    this._crackPhase = 0;

    // Extend target for dramatic swing
    const dx = targetX - this._startX;
    const dy = targetY - this._startY;
    const extendMultiplier = 1.4;
    this._targetX = this._startX + dx * extendMultiplier;
    this._targetY = this._startY + dy * extendMultiplier;

    debugLog("Nunchaku swing initiated towards", this._targetX, this._targetY);

    // Initialize segments
    const finalDx = this._targetX - this._startX;
    const finalDy = this._targetY - this._startY;

    for (let i = 0; i <= this._segmentCount; i++) {
      const t = i / this._segmentCount;
      this._segments[i].x = this._startX + finalDx * t;
      this._segments[i].y = this._startY + finalDy * t;
      this._segments[i].prevX = this._segments[i].x;
      this._segments[i].prevY = this._segments[i].y;
    }
  };

  Sprite_NunchakuWeapon.prototype.updatePhysics = function (deltaTime) {
    if (!this._active) return;

    const progress = this._animationTime / this._animationDuration;

    if (progress < 0.5) {
      this._crackPhase = 0;
      this.updateExtension(progress * 2);
    } else {
      this._crackPhase = 1;
      this.updateRetraction((progress - 0.5) * 2);
    }

    // Apply Verlet integration
    for (let i = 1; i <= this._segmentCount; i++) {
      const seg = this._segments[i];

      if (this._crackPhase === 0) {
        const targetProgress = Math.min(1, progress * 2);
        const segmentTarget = i / this._segmentCount;

        if (targetProgress >= segmentTarget) {
          const forceToTarget = this.calculateForceToTarget(seg, i);
          seg.x += forceToTarget.x;
          seg.y += forceToTarget.y;
        }
      }

      const vx = (seg.x - seg.prevX) * 0.97;
      const vy = (seg.y - seg.prevY) * 0.97;

      seg.prevX = seg.x;
      seg.prevY = seg.y;

      seg.x += vx;
      seg.y += vy;

      // Gravity
      seg.y += 0.35;
    }

    // Apply constraints
    for (let j = 0; j < 5; j++) {
      this.applyConstraints();
    }
  };

  Sprite_NunchakuWeapon.prototype.calculateForceToTarget = function (
    segment,
    index
  ) {
    const targetProgress = index / this._segmentCount;
    const targetX =
      this._startX + (this._targetX - this._startX) * targetProgress;
    const targetY =
      this._startY + (this._targetY - this._startY) * targetProgress;

    const dx = targetX - segment.x;
    const dy = targetY - segment.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance > 0) {
      const force = this._swingForce * (index / this._segmentCount);
      return {
        x: (dx / distance) * force,
        y: (dy / distance) * force,
      };
    }

    return { x: 0, y: 0 };
  };

  Sprite_NunchakuWeapon.prototype.updateExtension = function (progress) {
    const tipIndex = this._segmentCount;
    const tip = this._segments[tipIndex];

    const easeProgress = this.easeInOutQuad(progress);
    const targetX =
      this._startX + (this._targetX - this._startX) * easeProgress;
    const targetY =
      this._startY + (this._targetY - this._startY) * easeProgress;

    const pullStrength = 0.28;
    tip.x += (targetX - tip.x) * pullStrength;
    tip.y += (targetY - tip.y) * pullStrength;
  };

  Sprite_NunchakuWeapon.prototype.updateRetraction = function (progress) {
    const easeProgress = this.easeInOutQuad(progress);

    for (let i = 1; i <= this._segmentCount; i++) {
      const seg = this._segments[i];
      const pullStrength = 0.14 * easeProgress;

      seg.x += (this._startX - seg.x) * pullStrength;
      seg.y += (this._startY - seg.y) * pullStrength;
    }
  };

  Sprite_NunchakuWeapon.prototype.applyConstraints = function () {
    this._segments[0].x = this._startX;
    this._segments[0].y = this._startY;

    for (let i = 0; i < this._segmentCount; i++) {
      const seg1 = this._segments[i];
      const seg2 = this._segments[i + 1];

      const dx = seg2.x - seg1.x;
      const dy = seg2.y - seg1.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance > 0) {
        const difference = this._segmentLength - distance;
        const percent = difference / distance / 2;
        const offsetX = dx * percent;
        const offsetY = dy * percent;

        if (!seg1.pinned) {
          seg1.x -= offsetX;
          seg1.y -= offsetY;
        }

        seg2.x += offsetX;
        seg2.y += offsetY;
      }
    }
  };

  Sprite_NunchakuWeapon.prototype.easeInOutQuad = function (t) {
    return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
  };

  Sprite_NunchakuWeapon.prototype.update = function () {
    Sprite.prototype.update.call(this);

    if (this._active) {
      this._animationTime += 16.67;

      this.updatePhysics(16.67);
      this.redraw();

      if (this._animationTime >= this._animationDuration) {
        this._active = false;
        debugLog("Nunchaku attack animation complete");
      }
    } else if (this._visible) {
      this._idleSwayTime += 0.018;
      this.updateIdleDangle();
      this.redraw();
    }
  };

  Sprite_NunchakuWeapon.prototype.redraw = function () {
    if (!this.bitmap) {
      this.bitmap = new Bitmap(Graphics.width, Graphics.height);
    }

    this.bitmap.clear();
    const ctx = this.bitmap.context;

    // Determine chain colors
    let darkColor, metalColor, highlightColor;

    if (this._chainColor) {
      darkColor = this._chainColor;
      metalColor = this._chainColor;
      highlightColor = this._chainColor;
    } else {
      darkColor = "#303030";
      metalColor = "#808080";
      highlightColor = "rgba(200, 200, 200, 0.6)";
    }

    // Draw chain links between segments
    for (let i = 0; i < this._segmentCount; i++) {
      const seg1 = this._segments[i];
      const seg2 = this._segments[i + 1];

      const angle = Math.atan2(seg2.y - seg1.y, seg2.x - seg1.x);
      const centerX = (seg1.x + seg2.x) / 2;
      const centerY = (seg1.y + seg2.y) / 2;

      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.rotate(angle);

      const isVertical = i % 2 === 0;
      const linkWidth = isVertical ? 10 : 20;
      const linkHeight = isVertical ? 20 : 10;
      const thickness = 3;

      const linkRotation = isVertical ? Math.PI / 2 : 0;

      ctx.save();
      ctx.rotate(linkRotation);

      // Outer oval
      ctx.strokeStyle = darkColor;
      ctx.lineWidth = thickness + 2;
      ctx.beginPath();
      ctx.ellipse(0, 0, linkWidth, linkHeight, 0, 0, Math.PI * 2);
      ctx.stroke();

      // Middle oval
      ctx.strokeStyle = metalColor;
      ctx.lineWidth = thickness;
      ctx.beginPath();
      ctx.ellipse(0, 0, linkWidth, linkHeight, 0, 0, Math.PI * 2);
      ctx.stroke();

      // Highlight
      if (this._chainColor) {
        ctx.strokeStyle = this._chainColor;
        ctx.globalAlpha = 0.6;
      } else {
        ctx.strokeStyle = highlightColor;
      }
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.ellipse(
        -1,
        -1,
        linkWidth - 2,
        linkHeight - 2,
        0,
        Math.PI,
        Math.PI * 2
      );
      ctx.stroke();

      ctx.restore();
      ctx.restore();
    }

    this.bitmap._baseTexture.update();

    // Update left hand sprite (first segment)
    if (this._leftHandSprite) {
      const firstSeg = this._segments[0];
      const secondSeg = this._segments[1];

      this._leftHandSprite.x = firstSeg.x;
      this._leftHandSprite.y = firstSeg.y;

      const angle1 = Math.atan2(
        secondSeg.y - firstSeg.y,
        secondSeg.x - firstSeg.x
      );
      this._leftHandSprite.rotation = angle1 + Math.PI / 2;

      const velocity1 = Math.sqrt(
        Math.pow(firstSeg.x - firstSeg.prevX, 2) +
          Math.pow(firstSeg.y - firstSeg.prevY, 2)
      );
      const scale1 = 1.0 + Math.min(velocity1 * 0.02, 0.25);
      this._leftHandSprite.scale.x = scale1;
      this._leftHandSprite.scale.y = scale1;
    }

    // Update right hand sprite (last segment)
    if (this._rightHandSprite) {
      const lastSeg = this._segments[this._segmentCount];
      const prevSeg = this._segments[this._segmentCount - 1];

      this._rightHandSprite.x = lastSeg.x;
      this._rightHandSprite.y = lastSeg.y;

      const angle2 = Math.atan2(lastSeg.y - prevSeg.y, lastSeg.x - prevSeg.x);
      this._rightHandSprite.rotation = angle2 + Math.PI / 2;

      const velocity2 = Math.sqrt(
        Math.pow(lastSeg.x - lastSeg.prevX, 2) +
          Math.pow(lastSeg.y - lastSeg.prevY, 2)
      );
      const scale2 = 1.0 + Math.min(velocity2 * 0.02, 0.25);
      this._rightHandSprite.scale.x = scale2;
      this._rightHandSprite.scale.y = scale2;
    }
  };

  // Update Sprite_NunchakuWeapon.prototype.updateIdleDangle:

  Sprite_NunchakuWeapon.prototype.updateIdleDangle = function () {
    // NEW: Apply idle bob to base position
    this._idleCounter += 1;
    if (this._idleCounter > 1000) {
      this._idleCounter = 0;
    }
    const bob = Math.sin(this._idleCounter * this._idleSpeed);
    const bobbedStartY = getScaledWeaponY() + bob * this._idleAmplitudeY;

    // Update first segment to bobbed position
    this._segments[0].y = bobbedStartY;
    this._startY = bobbedStartY;

    for (let i = 1; i <= this._segmentCount; i++) {
      const seg = this._segments[i];

      const swayAmount = Math.sin(this._idleSwayTime + i * 0.25) * 0.35;

      const vx = (seg.x - seg.prevX) * 0.95;
      const vy = (seg.y - seg.prevY) * 0.95;

      seg.prevX = seg.x;
      seg.prevY = seg.y;

      seg.x += vx + swayAmount;
      seg.y += vy + 0.3;
    }

    for (let j = 0; j < 3; j++) {
      this.applyConstraints();
    }

    this._idleSwayTime += 0.018;
  };

  Sprite_NunchakuWeapon.prototype.show = function () {
    this._visible = true;
    this.initializeSegments();
    this._idleSwayTime = 0;
    if (this._leftHandSprite) {
      this._leftHandSprite.visible = true;
    }
    if (this._rightHandSprite) {
      this._rightHandSprite.visible = true;
    }
  };

  Sprite_NunchakuWeapon.prototype.clear = function () {
    if (this.bitmap) {
      this.bitmap.clear();
    }
    this._visible = false;
    this.initializeSegments();
    if (this._leftHandSprite) {
      this._leftHandSprite.visible = false;
    }
    if (this._rightHandSprite) {
      this._rightHandSprite.visible = false;
    }
  };

  //=============================================================================
  // Sprite_Projectile - Flying Projectile Animation
  //=============================================================================

  function Sprite_Projectile() {
    this.initialize(...arguments);
  }

  Sprite_Projectile.prototype = Object.create(Sprite.prototype);
  Sprite_Projectile.prototype.constructor = Sprite_Projectile;

  Sprite_Projectile.prototype.initialize = function () {
    Sprite.prototype.initialize.call(this);
    this.anchor.x = 0.5;
    this.anchor.y = 0.5;
    this._active = false;
    this._startX = 0;
    this._startY = 0;
    this._targetX = 0;
    this._targetY = 0;
    this._duration = 0;
    this._elapsed = 0;
    this._speed = 20; // pixels per frame
    this.visible = false;
  };

  Sprite_Projectile.prototype.fire = function (
    spriteName,
    startX,
    startY,
    targetX,
    targetY
  ) {
    this.bitmap = ImageManager.loadWeaponPicture(spriteName);
    this._startX = startX;
    this._startY = startY;
    this._targetX = targetX;
    this._targetY = targetY;

    // Calculate distance and duration
    const dx = targetX - startX;
    const dy = targetY - startY;
    const distance = Math.sqrt(dx * dx + dy * dy);
    this._duration = Math.max(15, Math.floor(distance / this._speed)); // Minimum 15 frames

    this._elapsed = 0;
    this._active = true;
    this.visible = true;

    // Set initial position
    this.x = startX;
    this.y = startY;

    // Rotate to face target
    this.rotation = Math.atan2(dy, dx);

    debugLog(
      `Projectile fired from (${startX}, ${startY}) to (${targetX}, ${targetY}), duration: ${this._duration} frames`
    );
  };

  Sprite_Projectile.prototype.update = function () {
    Sprite.prototype.update.call(this);

    if (!this._active) return;

    this._elapsed++;
    const progress = this._elapsed / this._duration;

    if (progress >= 1.0) {
      this._active = false;
      this.visible = false;
      debugLog("Projectile reached target");
      return;
    }

    // Ease-in-out interpolation for smooth movement
    const easeProgress =
      progress < 0.5
        ? 2 * progress * progress
        : 1 - Math.pow(-2 * progress + 2, 2) / 2;

    this.x = this._startX + (this._targetX - this._startX) * easeProgress;
    this.y = this._startY + (this._targetY - this._startY) * easeProgress;

    // Optional: Add slight arc to trajectory
    const scale = getResolutionScale();
    const arcHeight = Math.round(20 * scale.y);
    const arcOffset = Math.sin(progress * Math.PI) * arcHeight;
    this.y -= arcOffset;
  };

  Sprite_Projectile.prototype.isActive = function () {
    return this._active;
  };
//=============================================================================
// Sprite_BowWeapon - First-Person Animated Recurve Bow with Arrow
//=============================================================================

function Sprite_BowWeapon() {
  this.initialize(...arguments);
}

Sprite_BowWeapon.prototype = Object.create(Sprite.prototype);
Sprite_BowWeapon.prototype.constructor = Sprite_BowWeapon;

Sprite_BowWeapon.prototype.initialize = function () {
  Sprite.prototype.initialize.call(this);
  this._active = false;
  this._animationTime = 0;
  this._animationDuration = 400; // Draw and release
  this._drawProgress = 0;
  this._visible = false;
  this._stringColor = "#E8D5B7";
  this._arrowColor = "#8B7355";
  this._whipColor = "#8B4513";

  // Idle bob properties
  this._idleCounter = Math.random() * 100;
  this._idleAmplitudeY = 3;
  this._idleSpeed = 0.02;

  // Bow dimensions - INCREASED SIZE with resolution scaling
  const scale = getResolutionScale();
  this._bowWidth = Math.round(60 * scale.x);
  this._bowHeight = Math.round(450 * scale.y);
  this._baseX = getScaledWeaponX() - Math.round(150 * scale.x);
  this._baseY = getScaledWeaponY() - Math.round(100 * scale.y);

  // Use larger bitmap to prevent clipping
  this.bitmap = new Bitmap(Graphics.width + 200, Graphics.height + 200);
  this.x = -100;
  this.y = -100;
  
  // Target tracking for arrow projectile
  this._targetX = 0;
  this._targetY = 0;
  this._projectileSpawned = false;
  this._arrowSprite = null;
};

Sprite_BowWeapon.prototype.setBowColors = function (whipColor, stringColor) {
  this._whipColor = whipColor || "#8B4513";
  this._stringColor = stringColor || "#E8D5B7";
  debugLog("Bow colors set to:", this._whipColor, this._stringColor);
};

Sprite_BowWeapon.prototype.drawBow = function (targetX, targetY) {
  this._active = true;
  this._animationTime = 0;
  this._drawProgress = 0;
  this._targetX = targetX || 0;
  this._targetY = targetY || 0;
  this._projectileSpawned = false;
  debugLog("Bow draw initiated towards", this._targetX, this._targetY);
};

Sprite_BowWeapon.prototype.update = function () {
  Sprite.prototype.update.call(this);

  if (this._active) {
    this._animationTime += 16.67;
    const progress = this._animationTime / this._animationDuration;
    let releaseProgress = 0;

    if (progress < 0.7) {
      // Drawing phase (0 to 70%)
      this._drawProgress = progress / 0.7;
    } else if (progress < 0.8) {
      // Hold at full draw (70% to 80%)
      this._drawProgress = 1.0;
    } else {
      // Release and return (80% to 100%)
      releaseProgress = (progress - 0.8) / 0.2;
      this._drawProgress = 1.0 - releaseProgress;
      
      // Spawn projectile on release (once)
      if (!this._projectileSpawned && releaseProgress > 0.1) {
        this._projectileSpawned = true;
        this.spawnArrowProjectile();
      }
    }

    if (progress >= 1.0) {
      this._active = false;
      this._drawProgress = 0;
      debugLog("Bow attack complete");
    }

    this.redraw();
  } else if (this._visible) {
    // Idle animation
    this._idleCounter += 1;
    if (this._idleCounter > 1000) {
      this._idleCounter = 0;
    }
    this.redraw();
  }
};

Sprite_BowWeapon.prototype.spawnArrowProjectile = function () {
  if (!this._targetX && !this._targetY) {
    debugLog("No target set for arrow projectile");
    return;
  }
  
  // Calculate arrow spawn position (at the bow's draw position)
  const scale = getResolutionScale();
  const bob = Math.sin(this._idleCounter * this._idleSpeed);
  const bobbedY = this._baseY + bob * this._idleAmplitudeY;
  
  const offsetX = Math.round(260 * scale.x);
  const offsetY = Math.round(100 * scale.y);
  const centerX = this._baseX + offsetX;
  const centerY = bobbedY + offsetY;
  
  const stringOffsetX = Math.round(35 * scale.x);
  const maxDrawback = Math.round(120 * scale.x);
  
  // Arrow starts at full drawback position
  const arrowStartX = centerX + stringOffsetX + maxDrawback + this.x;
  const arrowStartY = centerY + this.y;
  
  // Create arrow sprite if it doesn't exist
  if (!this._arrowSprite) {
    this._arrowSprite = new Sprite_Projectile();
    if (this.parent) {
      this.parent.addChild(this._arrowSprite);
    }
  }
  
  // Create a simple arrow bitmap if no sprite is set
  if (!this._arrowSprite.bitmap) {
    const arrowBitmap = new Bitmap(200, 20);
    const ctx = arrowBitmap.context;
    
    // Draw arrow shaft
    ctx.strokeStyle = this._arrowColor;
    ctx.lineWidth = 4;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(20, 10);
    ctx.lineTo(180, 10);
    ctx.stroke();
    
    // Draw arrow head
    ctx.fillStyle = "#4A4A4A";
    ctx.beginPath();
    ctx.moveTo(180, 10);
    ctx.lineTo(165, 5);
    ctx.lineTo(165, 15);
    ctx.closePath();
    ctx.fill();
    
    // Draw fletching
    ctx.fillStyle = "#8B0000";
    ctx.globalAlpha = 0.7;
    for (let i = 0; i < 3; i++) {
      const angle = (i * 120) * Math.PI / 180;
      const offsetY = Math.sin(angle) * 4;
      ctx.beginPath();
      ctx.moveTo(30, 10 + offsetY);
      ctx.lineTo(40, 10 + offsetY - 6);
      ctx.lineTo(40, 10 + offsetY + 6);
      ctx.closePath();
      ctx.fill();
    }
    
    arrowBitmap._baseTexture.update();
    this._arrowSprite.bitmap = arrowBitmap;
  }
  
  // Fire the projectile toward the target
  this._arrowSprite.x = arrowStartX;
  this._arrowSprite.y = arrowStartY;
  this._arrowSprite._startX = arrowStartX;
  this._arrowSprite._startY = arrowStartY;
  this._arrowSprite._targetX = this._targetX;
  this._arrowSprite._targetY = this._targetY;
  this._arrowSprite._elapsed = 0;
  this._arrowSprite._active = true;
  this._arrowSprite.visible = true;
  
  // Calculate duration based on distance
  const dx = this._targetX - arrowStartX;
  const dy = this._targetY - arrowStartY;
  const distance = Math.sqrt(dx * dx + dy * dy);
  this._arrowSprite._duration = Math.max(15, Math.floor(distance / 20));
  
  // Rotate arrow to face target
  this._arrowSprite.rotation = Math.atan2(dy, dx);
  
  debugLog("Arrow projectile spawned from", arrowStartX, arrowStartY, "to", this._targetX, this._targetY);
};

Sprite_BowWeapon.prototype.redraw = function () {
  if (!this.bitmap) {
    this.bitmap = new Bitmap(Graphics.width + 200, Graphics.height + 200);
  }

  this.bitmap.clear();
  const ctx = this.bitmap.context;

  // Apply idle bob
  const bob = Math.sin(this._idleCounter * this._idleSpeed);
  const bobbedY = this._baseY + bob * this._idleAmplitudeY;

  // Account for bitmap offset
  const scale = getResolutionScale();
  const offsetX = Math.round(260 * scale.x);
  const offsetY = Math.round(100 * scale.y);

  // Bow limb positions
  const topX = this._baseX + offsetX;
  const topY = bobbedY - this._bowHeight / 2 + offsetY;
  const centerX = this._baseX + offsetX;
  const centerY = bobbedY + offsetY;
  const bottomX = this._baseX + offsetX;
  const bottomY = bobbedY + this._bowHeight / 2 + offsetY;

  // String attachment points on limbs (at the tips)
  const stringOffsetX = Math.round(35 * scale.x);
  const topStringX = topX + stringOffsetX;
  const bottomStringX = bottomX + stringOffsetX;

  // Draw position (pulled back based on draw progress)
  const maxDrawback = Math.round(120 * scale.x);
  const drawbackX =
    centerX + stringOffsetX + this._drawProgress * maxDrawback;
  const drawbackY = centerY;

  // Draw upper limb
  this.drawRecurveBowLimb(
    ctx,
    topX,
    topY,
    centerX,
    centerY,
    topStringX,
    topY,
    true
  );

  // Draw lower limb
  this.drawRecurveBowLimb(
    ctx,
    bottomX,
    bottomY,
    centerX,
    centerY,
    bottomStringX,
    bottomY,
    false
  );

  // Draw string with realistic tension curve
  this.drawBowString(ctx, topStringX, topY, bottomStringX, bottomY, drawbackX, drawbackY, scale);

  // Draw arrow when drawing
  if (this._drawProgress > 0) {
    this.drawArrow(ctx, drawbackX, drawbackY, this._drawProgress, scale);
  }

  // Draw grip with leather wrap texture
  this.drawGrip(ctx, centerX, centerY, scale);

  // Draw limb tips (nocks)
  this.drawLimbTip(ctx, topStringX, topY, scale);
  this.drawLimbTip(ctx, bottomStringX, bottomY, scale);

  this.bitmap._baseTexture.update();
};

Sprite_BowWeapon.prototype.drawRecurveBowLimb = function (
  ctx,
  limbEndX,
  limbEndY,
  gripX,
  gripY,
  stringX,
  stringY,
  isUpper
) {
  ctx.save();

  const scale = getResolutionScale();
  const direction = isUpper ? -1 : 1;

  // Create recurve bow shape with multiple curves
  ctx.strokeStyle = this._whipColor;
  ctx.lineWidth = Math.round(16 * scale.x);
  ctx.lineCap = "round";
  ctx.lineJoin = "round";

  // Calculate control points for realistic recurve shape
  const midX = (limbEndX + gripX) / 2;
  const midY = (limbEndY + gripY) / 2;
  
  const cp1X = gripX - Math.round(25 * scale.x);
  const cp1Y = gripY + direction * Math.round(80 * scale.y);
  
  const cp2X = midX - Math.round(50 * scale.x);
  const cp2Y = midY;
  
  const cp3X = limbEndX + Math.round(15 * scale.x);
  const cp3Y = limbEndY;

  // Draw main limb with bezier curve for recurve shape
  ctx.beginPath();
  ctx.moveTo(gripX, gripY);
  ctx.bezierCurveTo(cp1X, cp1Y, cp2X, cp2Y, midX, midY);
  ctx.bezierCurveTo(cp2X, cp2Y, cp3X, cp3Y, limbEndX, limbEndY);
  ctx.stroke();

  // Draw shadow side for depth
  ctx.strokeStyle = this._darkenColor(this._whipColor, 0.3);
  ctx.lineWidth = Math.round(7 * scale.x);
  ctx.globalAlpha = 0.5;
  ctx.beginPath();
  ctx.moveTo(gripX + Math.round(3 * scale.x), gripY);
  ctx.bezierCurveTo(cp1X + Math.round(3 * scale.x), cp1Y, cp2X + Math.round(3 * scale.x), cp2Y, midX + Math.round(3 * scale.x), midY);
  ctx.bezierCurveTo(cp2X + Math.round(3 * scale.x), cp2Y, cp3X + Math.round(3 * scale.x), cp3Y, limbEndX + Math.round(3 * scale.x), limbEndY);
  ctx.stroke();

  // Draw highlight side for depth
  ctx.strokeStyle = this._lightenColor(this._whipColor, 0.4);
  ctx.lineWidth = Math.round(5 * scale.x);
  ctx.globalAlpha = 0.7;
  ctx.beginPath();
  ctx.moveTo(gripX - Math.round(4 * scale.x), gripY);
  ctx.bezierCurveTo(cp1X - Math.round(4 * scale.x), cp1Y, cp2X - Math.round(4 * scale.x), cp2Y, midX - Math.round(4 * scale.x), midY);
  ctx.bezierCurveTo(cp2X - Math.round(4 * scale.x), cp2Y, cp3X - Math.round(4 * scale.x), cp3Y, limbEndX - Math.round(4 * scale.x), limbEndY);
  ctx.stroke();

  ctx.restore();
};

Sprite_BowWeapon.prototype.drawBowString = function (ctx, topX, topY, bottomX, bottomY, drawX, drawY, scale) {
  ctx.save();
  
  // Calculate string tension curve
  const stringTension = this._drawProgress * 0.15; // Slight curve when drawn
  
  // Control point for upper string (slight outward curve under tension)
  const topMidX = (topX + drawX) / 2 - stringTension * Math.round(20 * scale.x);
  const topMidY = (topY + drawY) / 2;
  
  // Control point for lower string
  const botMidX = (bottomX + drawX) / 2 - stringTension * Math.round(20 * scale.x);
  const botMidY = (bottomY + drawY) / 2;
  
  // Draw string shadow for depth
  ctx.strokeStyle = "rgba(0, 0, 0, 0.3)";
  ctx.lineWidth = Math.round(4 * scale.x);
  ctx.beginPath();
  ctx.moveTo(topX + 1, topY + 1);
  ctx.quadraticCurveTo(topMidX + 1, topMidY + 1, drawX + 1, drawY + 1);
  ctx.moveTo(drawX + 1, drawY + 1);
  ctx.quadraticCurveTo(botMidX + 1, botMidY + 1, bottomX + 1, bottomY + 1);
  ctx.stroke();
  
  // Draw main string with slight curve
  ctx.strokeStyle = this._stringColor;
  ctx.lineWidth = Math.round(3.5 * scale.x);
  ctx.beginPath();
  ctx.moveTo(topX, topY);
  ctx.quadraticCurveTo(topMidX, topMidY, drawX, drawY);
  ctx.moveTo(drawX, drawY);
  ctx.quadraticCurveTo(botMidX, botMidY, bottomX, bottomY);
  ctx.stroke();
  
  // Add string highlight
  ctx.strokeStyle = this._lightenColor(this._stringColor, 0.3);
  ctx.lineWidth = Math.round(1.5 * scale.x);
  ctx.globalAlpha = 0.6;
  ctx.beginPath();
  ctx.moveTo(topX, topY);
  ctx.quadraticCurveTo(topMidX, topMidY, drawX, drawY);
  ctx.moveTo(drawX, drawY);
  ctx.quadraticCurveTo(botMidX, botMidY, bottomX, bottomY);
  ctx.stroke();
  
  ctx.restore();
};

Sprite_BowWeapon.prototype.drawArrow = function (ctx, drawX, drawY, progress, scale) {
  ctx.save();
  
  const arrowLength = Math.round(200 * scale.x);
  // Arrow points LEFT toward enemies, extends from draw position
  const arrowTipX = drawX - arrowLength * (1 - progress * 0.3);
  
  // Draw arrow shaft shadow
  ctx.strokeStyle = "rgba(0, 0, 0, 0.3)";
  ctx.lineWidth = Math.round(5 * scale.x);
  ctx.beginPath();
  ctx.moveTo(drawX + 1, drawY + 1);
  ctx.lineTo(arrowTipX + 1, drawY + 1);
  ctx.stroke();
  
  // Draw arrow shaft
  ctx.strokeStyle = this._arrowColor;
  ctx.lineWidth = Math.round(4 * scale.x);
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.moveTo(drawX, drawY);
  ctx.lineTo(arrowTipX, drawY);
  ctx.stroke();
  
  // Draw arrow head pointing LEFT
  const headSize = Math.round(12 * scale.x);
  ctx.fillStyle = "#4A4A4A";
  ctx.beginPath();
  ctx.moveTo(arrowTipX, drawY);
  ctx.lineTo(arrowTipX + headSize, drawY - headSize / 2);
  ctx.lineTo(arrowTipX + headSize, drawY + headSize / 2);
  ctx.closePath();
  ctx.fill();
  
  // Draw arrow head highlight
  ctx.fillStyle = "#666666";
  ctx.beginPath();
  ctx.moveTo(arrowTipX, drawY);
  ctx.lineTo(arrowTipX + headSize * 0.6, drawY - headSize / 3);
  ctx.lineTo(arrowTipX + headSize, drawY);
  ctx.closePath();
  ctx.fill();
  
  // Draw fletching at the BACK (near string)
  const fletchingStart = drawX - Math.round(15 * scale.x);
  const fletchingSize = Math.round(18 * scale.x);
  
  ctx.fillStyle = "#8B0000";
  ctx.globalAlpha = 0.7;
  
  // Three fletching feathers pointing backward
  for (let i = 0; i < 3; i++) {
    const angle = (i * 120) * Math.PI / 180;
    const offsetY = Math.sin(angle) * Math.round(6 * scale.y);
    
    ctx.beginPath();
    ctx.moveTo(fletchingStart, drawY + offsetY);
    ctx.lineTo(fletchingStart + fletchingSize * 0.7, drawY + offsetY - fletchingSize / 3);
    ctx.lineTo(fletchingStart + fletchingSize * 0.7, drawY + offsetY + fletchingSize / 3);
    ctx.closePath();
    ctx.fill();
  }
  
  ctx.restore();
};

Sprite_BowWeapon.prototype.drawGrip = function (ctx, centerX, centerY, scale) {
  ctx.save();
  
  const gripWidth = Math.round(26 * scale.x);
  const gripHeight = Math.round(95 * scale.y);
  
  // Draw grip shadow
  ctx.fillStyle = "rgba(0, 0, 0, 0.4)";
  ctx.fillRect(
    centerX - gripWidth / 2 + 2,
    centerY - gripHeight / 2 + 2,
    gripWidth,
    gripHeight
  );
  
  // Draw main grip
  ctx.fillStyle = this._whipColor;
  ctx.fillRect(
    centerX - gripWidth / 2,
    centerY - gripHeight / 2,
    gripWidth,
    gripHeight
  );
  
  // Draw leather wrap texture (horizontal lines)
  ctx.strokeStyle = this._darkenColor(this._whipColor, 0.2);
  ctx.lineWidth = Math.round(2 * scale.x);
  ctx.globalAlpha = 0.6;
  
  for (let i = -4; i <= 4; i++) {
    const y = centerY + i * Math.round(10 * scale.y);
    ctx.beginPath();
    ctx.moveTo(centerX - gripWidth / 2, y);
    ctx.lineTo(centerX + gripWidth / 2, y);
    ctx.stroke();
  }
  
  // Draw grip highlight
  ctx.fillStyle = this._lightenColor(this._whipColor, 0.3);
  ctx.globalAlpha = 0.4;
  ctx.fillRect(
    centerX - gripWidth / 2,
    centerY - gripHeight / 2,
    Math.round(8 * scale.x),
    gripHeight
  );
  
  ctx.restore();
};

Sprite_BowWeapon.prototype.drawLimbTip = function (ctx, x, y, scale) {
  ctx.save();
  
  const tipSize = Math.round(8 * scale.x);
  
  // Draw tip shadow
  ctx.fillStyle = "rgba(0, 0, 0, 0.4)";
  ctx.beginPath();
  ctx.arc(x + 1, y + 1, tipSize, 0, Math.PI * 2);
  ctx.fill();
  
  // Draw nock (string attachment point)
  ctx.fillStyle = this._darkenColor(this._whipColor, 0.4);
  ctx.beginPath();
  ctx.arc(x, y, tipSize, 0, Math.PI * 2);
  ctx.fill();
  
  // Draw highlight
  ctx.fillStyle = this._lightenColor(this._whipColor, 0.2);
  ctx.globalAlpha = 0.7;
  ctx.beginPath();
  ctx.arc(x - tipSize * 0.3, y - tipSize * 0.3, tipSize * 0.5, 0, Math.PI * 2);
  ctx.fill();
  
  ctx.restore();
};

Sprite_BowWeapon.prototype._darkenColor = function (color, amount) {
  const rgb = this._hexToRgb(color);
  if (!rgb) return color;

  const r = Math.max(0, Math.floor(rgb.r * (1 - amount)));
  const g = Math.max(0, Math.floor(rgb.g * (1 - amount)));
  const b = Math.max(0, Math.floor(rgb.b * (1 - amount)));

  return this._rgbToHex(r, g, b);
};

Sprite_BowWeapon.prototype._lightenColor = function (color, amount) {
  const rgb = this._hexToRgb(color);
  if (!rgb) return color;

  const r = Math.min(255, Math.floor(rgb.r + (255 - rgb.r) * amount));
  const g = Math.min(255, Math.floor(rgb.g + (255 - rgb.g) * amount));
  const b = Math.min(255, Math.floor(rgb.b + (255 - rgb.b) * amount));

  return this._rgbToHex(r, g, b);
};

Sprite_BowWeapon.prototype._hexToRgb = function (hex) {
  hex = hex.replace(/^#/, "");
  if (hex.length === 3) {
    hex = hex
      .split("")
      .map((char) => char + char)
      .join("");
  }
  if (hex.length !== 6) return null;

  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);

  if (isNaN(r) || isNaN(g) || isNaN(b)) return null;
  return { r, g, b };
};

Sprite_BowWeapon.prototype._rgbToHex = function (r, g, b) {
  const toHex = (n) => {
    const hex = Math.max(0, Math.min(255, n)).toString(16);
    return hex.length === 1 ? "0" + hex : hex;
  };
  return "#" + toHex(r) + toHex(g) + toHex(b);
};

Sprite_BowWeapon.prototype.show = function () {
  this._visible = true;
  this._idleCounter = Math.random() * 100;
};

Sprite_BowWeapon.prototype.clear = function () {
  if (this.bitmap) {
    this.bitmap.clear();
  }
  this._visible = false;
  this._active = false;
};

  // Make globally accessible
  window.Sprite_BowWeapon = Sprite_BowWeapon;

  window.Sprite_WhipWeapon = Sprite_WhipWeapon;
  window.Sprite_FlailWeapon = Sprite_FlailWeapon;
  window.Sprite_NunchakuWeapon = Sprite_NunchakuWeapon;
  window.Sprite_ThrowWeapon = Sprite_ThrowWeapon;
  window.Sprite_BowWeapon = Sprite_BowWeapon;
  window.Sprite_Projectile = Sprite_Projectile;

  console.log(
    "[WeaponSprites] v1.0.0 loaded - All weapon sprite classes available"
  );
})();
// =============================================================================
// EarthboundBattleBackgrounds.js - Refactored v3.0 with Dithered Gradients
// =============================================================================
/*:
* @plugindesc v3.0 Earthbound-style animated battle backgrounds with realistic moon phases and pixel art dithering
* @author Omni-Lex (Refactored)
*
* @param opacity
* @desc Opacity of the background overlay (0-255)
* @default 150
*
* @param blendMode
* @desc Blend mode (0:Normal, 1:Add, 2:Multiply, 3:Screen)
* @default 1
*
* @param animationSpeed
* @desc Animation speed multiplier (0.1-2.0)
* @default 0.5
* 
* @param optionName
* @desc Name of the option in the game menu
* @default Battle BG
*
* @param defaultMode
* @desc Default mode (0:Biome, 1:Trippy, 2:None)
* @default 0
*
* @help
* v3.0 Features:
* - Realistic moon phases based on actual lunar cycle
* - Three moons displayed on Fridays (easter egg)
* - Enhanced square star field with twinkling animation
* - Pixel art dithered sky gradients
* - Completely refactored codebase
* 
* Modes:
* - Biome: Dynamic sky with sun/moon cycles and biome-based backgrounds
* - Trippy: Psychedelic patterns with biome backgrounds (no tinting)
* - None: Disabled
* 
* Variables:
* - Variable 86: Country ID for sunrise/sunset times
* - Variable 80: Time mode (-1:real, 0:day, 1:night, 2:dusk, 3:dawn)
*/

(() => {
    'use strict';

    // =============================================================================
    // Configuration & Constants
    // =============================================================================
    
    const params = PluginManager.parameters('EarthboundBattleBackgrounds');
    const CONFIG = {
        optionName: String(params['optionName'] || 'Battle BG'),
        overlayOpacity: Number(params['opacity'] || 150),
        overlayBlendMode: Number(params['blendMode'] || 1),
        speedMultiplier: Math.min(Math.max(Number(params['animationSpeed'] || 0.5), 0.1), 1.0),
        defaultMode: Number(params['defaultMode'] || 0),
        
        // Moon constants
        LUNAR_CYCLE_DAYS: 29.53059,
        KNOWN_NEW_MOON: new Date('2000-01-06T18:14:00Z'),
        
        // Pattern types
        PATTERN_TYPES: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14],
        
        // Time modes
        TIME_MODES: {
            REAL_TIME: -1,
            DAY: 0,
            NIGHT: 1,
            DUSK: 2,
            DAWN: 3
        }
    };

    // Import dependencies
    const { Countries } = window.Countries;
    const EG = window.EffectsGenerator;
    
    if (!EG) throw new Error("EffectsGenerator not loaded");
    if (!Countries) throw new Error("Countries data not loaded");
    
    Object.assign(Spriteset_Battle.prototype, EG);
    
    const defaultCountry = Countries.find(c => c.id === 102) || Countries[0];

    // =============================================================================
    // Utility Methods Section
    // =============================================================================
    
    function parseTime(timeStr) {
        if (!timeStr || !timeStr.includes(':')) return 6;
        const [h, m] = timeStr.split(':').map(Number);
        return h + m / 60;
    }
    
    function interpolateColor(color1, color2, factor) {
        return [
            Math.round(color1[0] + factor * (color2[0] - color1[0])),
            Math.round(color1[1] + factor * (color2[1] - color1[1])),
            Math.round(color1[2] + factor * (color2[2] - color1[2]))
        ];
    }
    
    function getGameDate() {
        // Get game date from TimeDateSystem (Variable 114: total minutes elapsed)
        // Base date: Jan 1, 2001 12:00
        const gameTimeMinutes = $gameVariables ? $gameVariables.value(114) || 0 : 0;
        const baseDate = new Date(2001, 0, 1, 12, 0, 0);
        return new Date(baseDate.getTime() + gameTimeMinutes * 60 * 1000);
    }

    function getSeason() {
        // Use game date from TimeDateSystem instead of real date
        const gameDate = getGameDate();
        const month = gameDate.getMonth();
        if (month >= 2 && month <= 4) return 'spring';
        if (month >= 5 && month <= 7) return 'summer';
        if (month >= 8 && month <= 10) return 'autumn';
        return 'winter';
    }

    function isFriday() {
        // Use game date from TimeDateSystem instead of real date
        const gameDate = getGameDate();
        return gameDate.getDay() === 5;
    }
    
    function createSeededRandom(seed) {
        return function() {
            seed = (seed * 9301 + 49297) % 233280;
            return seed / 233280;
        };
    }
    
    function hslToRgb(h, s, l) {
        h = h % 360 / 360;
        s = s / 100;
        l = l / 100;
        
        if (s === 0) {
            const gray = Math.round(l * 255);
            return [gray, gray, gray];
        }
        
        const hue2rgb = (p, q, t) => {
            if (t < 0) t += 1;
            if (t > 1) t -= 1;
            if (t < 1/6) return p + (q - p) * 6 * t;
            if (t < 1/2) return q;
            if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
            return p;
        };
        
        const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        const p = 2 * l - q;
        
        return [
            Math.round(hue2rgb(p, q, h + 1/3) * 255),
            Math.round(hue2rgb(p, q, h) * 255),
            Math.round(hue2rgb(p, q, h - 1/3) * 255)
        ];
    }
    
    function hueToColor(hue, alpha = 1, lightness = 50) {
        const rgb = hslToRgb(hue, 80, lightness);
        return alpha < 1 
            ? `rgba(${rgb[0]},${rgb[1]},${rgb[2]},${alpha})`
            : `rgb(${rgb[0]},${rgb[1]},${rgb[2]})`;
    }
// =============================================================================
// Coordinate-Based Background System - Replace in EarthboundBattleBackgrounds.js
// =============================================================================

// ADD THIS NEW SECTION after the Utility Methods Section
// =============================================================================
// Coordinate-Based Background Selection
// =============================================================================

function getMapGridSize(mapWidth, mapHeight) {
    const mapSize = Math.max(mapWidth, mapHeight);
    
    // Maps smaller than 30x30 get a single background
    if (mapSize < 30) {
        return 1;
    }
    
    // Calculate grid size based on map dimensions
    // Creates roughly 30x30 tile squares
    return Math.floor(mapSize / 30);
}

function getBackgroundIndexForCoordinates(x, y, biomeName) {
    if (!biomeName) return null;
    
    const mapWidth = $gameMap.width();
    const mapHeight = $gameMap.height();
    const gridSize = getMapGridSize(mapWidth, mapHeight);
    
    // For small maps, return index 0
    if (gridSize === 1) {
        return 0;
    }
    
    // Calculate which grid square the player is in
    const gridX = Math.floor(x / 30);
    const gridY = Math.floor(y / 30);
    
    // Create a unique seed from grid coordinates
    // This ensures the same grid square always returns the same index
    const seed = gridX * 1000 + gridY;
    
    // Use seeded random to get consistent background for this grid square
    const random = createSeededRandom(seed);
    
    // Get list of available backgrounds for this biome
    const fs = require('fs');
    const path = require('path');
    
    const biomePath = path.join(
        path.dirname(process.mainModule.filename),
        'img', 'battlebacks1', biomeName
    );
    
    try {
        if (!fs.existsSync(biomePath)) {
            return null;
        }
        
        let files = fs.readdirSync(biomePath);
        let imageFiles = files.filter(f => /\.(png|jpg|jpeg)$/i.test(f));
        
        if (imageFiles.length === 0) {
            return null;
        }
        
        // Filter by time suffix in Biome mode
        if (ConfigManager.ebBackgrounds === 0) {
            const timeMode = getCurrentTimeMode();
            const filtered = imageFiles.filter(file => {
                const suffix = file.replace(/\.[^/.]+$/, '').slice(-2);
                if (suffix === '_N') return timeMode === CONFIG.TIME_MODES.NIGHT;
                if (suffix === '_D') return timeMode === CONFIG.TIME_MODES.DAY;
                if (suffix === '_S') return timeMode === CONFIG.TIME_MODES.DUSK || timeMode === CONFIG.TIME_MODES.DAWN;
                return true;
            });
            
            if (filtered.length > 0) imageFiles = filtered;
        }
        
        // Use seeded random to pick consistent index for this grid square
        const index = Math.floor(random() * imageFiles.length);
        return index;
        
    } catch (e) {
        console.error('Error getting background index:', e);
        return null;
    }
}

function getBiomeBackgroundForCoordinates(x, y, biomeName) {
    const fs = require('fs');
    const path = require('path');
    
    if (!biomeName) return null;
    
    const biomePath = path.join(
        path.dirname(process.mainModule.filename),
        'img', 'battlebacks1', biomeName
    );
    
    try {
        if (!fs.existsSync(biomePath)) {
            //console.log('Biome folder not found:', biomePath);
            return null;
        }
        
        let files = fs.readdirSync(biomePath);
        let imageFiles = files.filter(f => /\.(png|jpg|jpeg)$/i.test(f));
        
        if (imageFiles.length === 0) {
            //console.log('No images in biome folder:', biomePath);
            return null;
        }
        
        // Filter by time suffix in Biome mode
        if (ConfigManager.ebBackgrounds === 0) {
            const timeMode = getCurrentTimeMode();
            const filtered = imageFiles.filter(file => {
                const suffix = file.replace(/\.[^/.]+$/, '').slice(-2);
                if (suffix === '_N') return timeMode === CONFIG.TIME_MODES.NIGHT;
                if (suffix === '_D') return timeMode === CONFIG.TIME_MODES.DAY;
                if (suffix === '_S') return timeMode === CONFIG.TIME_MODES.DUSK || timeMode === CONFIG.TIME_MODES.DAWN;
                return true;
            });
            
            if (filtered.length > 0) imageFiles = filtered;
        }
        
        // Get consistent background index for these coordinates
        const bgIndex = getBackgroundIndexForCoordinates(x, y, biomeName);
        if (bgIndex === null) return null;
        
        const selectedFile = imageFiles[bgIndex];
        const fullPath = biomeName + '/' + selectedFile.replace(/\.[^/.]+$/, '');
        
        const mapWidth = $gameMap.width();
        const mapHeight = $gameMap.height();
        const gridSize = getMapGridSize(mapWidth, mapHeight);
        const gridX = Math.floor(x / 30);
        const gridY = Math.floor(y / 30);
        
        //console.log(`Loading biome background for coordinates (${x}, ${y})`);
        //console.log(`Grid: (${gridX}, ${gridY}), Grid Size: ${gridSize}, Background: ${fullPath}`);
        
        return fullPath;
    } catch (e) {
        console.error('Error loading biome background:', e);
        return null;
    }
}
    // =============================================================================
    // Dithering System
    // =============================================================================
    
    // Bayer 8x8 dithering matrix (finer, less obvious pattern)
    const BAYER_MATRIX = [
        [ 0, 32,  8, 40,  2, 34, 10, 42],
        [48, 16, 56, 24, 50, 18, 58, 26],
        [12, 44,  4, 36, 14, 46,  6, 38],
        [60, 28, 52, 20, 62, 30, 54, 22],
        [ 3, 35, 11, 43,  1, 33,  9, 41],
        [51, 19, 59, 27, 49, 17, 57, 25],
        [15, 47,  7, 39, 13, 45,  5, 37],
        [63, 31, 55, 23, 61, 29, 53, 21]
    ];
    
    function hexToRgb(hex) {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? [
            parseInt(result[1], 16),
            parseInt(result[2], 16),
            parseInt(result[3], 16)
        ] : [0, 0, 0];
    }
    
    function getSkyColors(timeMode) {
        switch(timeMode) {
            case CONFIG.TIME_MODES.DAY:
                return [
                    hexToRgb('#1E90FF'),
                    hexToRgb('#87CEEB'),
                    hexToRgb('#B0E0E6')
                ];
            case CONFIG.TIME_MODES.NIGHT:
                return [
                    hexToRgb('#000428'),
                    hexToRgb('#004e92'),
                    hexToRgb('#001a33')
                ];
            case CONFIG.TIME_MODES.DUSK:
                return [
                    hexToRgb('#FF4500'),
                    hexToRgb('#FF8C00'),
                    hexToRgb('#9370DB'),
                    hexToRgb('#483D8B')
                ];
            case CONFIG.TIME_MODES.DAWN:
                return [
                    hexToRgb('#FF6B6B'),
                    hexToRgb('#FFA07A'),
                    hexToRgb('#FFD700'),
                    hexToRgb('#87CEEB')
                ];
            default:
                return [
                    hexToRgb('#1E90FF'),
                    hexToRgb('#87CEEB'),
                    hexToRgb('#B0E0E6')
                ];
        }
    }
    
    function drawDitheredGradient(context, width, height, timeMode) {
        const colors = getSkyColors(timeMode);
        const ditherSize = 1; // Fine 1-pixel dithering for subtle effect
        
        // Create image data for faster pixel manipulation
        const imageData = context.createImageData(width, height);
        const data = imageData.data;
        
        for (let y = 0; y < height; y++) {
            // Calculate gradient position (0 to 1)
            const gradPos = y / height;
            
            // Find which color stops to interpolate between
            let colorIndex = Math.floor(gradPos * (colors.length - 1));
            let nextColorIndex = Math.min(colorIndex + 1, colors.length - 1);
            
            // Calculate local interpolation factor
            const localFactor = (gradPos * (colors.length - 1)) - colorIndex;
            
            const color1 = colors[colorIndex];
            const color2 = colors[nextColorIndex];
            
            for (let x = 0; x < width; x++) {
                // Get dither threshold from 8x8 Bayer matrix
                const bayerX = Math.floor(x / ditherSize) % 8;
                const bayerY = Math.floor(y / ditherSize) % 8;
                const threshold = BAYER_MATRIX[bayerY][bayerX] / 64;
                
                // Choose color based on dithering
                const useColor2 = localFactor > threshold;
                const finalColor = useColor2 ? color2 : color1;
                
                const index = (y * width + x) * 4;
                data[index] = finalColor[0];
                data[index + 1] = finalColor[1];
                data[index + 2] = finalColor[2];
                data[index + 3] = 255;
            }
        }
        
        context.putImageData(imageData, 0, 0);
    }

    // =============================================================================
    // Moon Phase Calculator Section
    // =============================================================================
    
    function calculateMoonPhase(date = new Date()) {
        const msPerDay = 24 * 60 * 60 * 1000;
        const daysSinceKnownNewMoon = (date - CONFIG.KNOWN_NEW_MOON) / msPerDay;
        const phase = (daysSinceKnownNewMoon % CONFIG.LUNAR_CYCLE_DAYS) / CONFIG.LUNAR_CYCLE_DAYS;
        
        return {
            phase: phase,
            illumination: getMoonIllumination(phase),
            name: getMoonPhaseName(phase),
            isWaxing: phase < 0.5
        };
    }
    
    function getMoonIllumination(phase) {
        return 0.5 - 0.5 * Math.cos(2 * Math.PI * phase);
    }
    
    function getMoonPhaseName(phase) {
        if (phase < 0.0625) return 'New Moon';
        if (phase < 0.1875) return 'Waxing Crescent';
        if (phase < 0.3125) return 'First Quarter';
        if (phase < 0.4375) return 'Waxing Gibbous';
        if (phase < 0.5625) return 'Full Moon';
        if (phase < 0.6875) return 'Waning Gibbous';
        if (phase < 0.8125) return 'Last Quarter';
        if (phase < 0.9375) return 'Waning Crescent';
        return 'New Moon';
    }

    // =============================================================================
    // Time Management Section
    // =============================================================================

    function getGameTimeHourAndMinute() {
        // Get game time from TimeDateSystem (Variable 114: total minutes elapsed)
        const gameDate = getGameDate();

        const hours = gameDate.getHours();
        const minutes = gameDate.getMinutes();

        return { hours, minutes };
    }

    function getCurrentTimeMode() {
        const timeMode = $gameVariables.value(80);

        if (timeMode !== CONFIG.TIME_MODES.REAL_TIME) {
            return timeMode;
        }

        // Use game time from TimeDateSystem instead of real time
        const { hours, minutes } = getGameTimeHourAndMinute();
        const timeValue = hours + minutes / 60;

        if (timeValue >= 5 && timeValue < 7) return CONFIG.TIME_MODES.DAWN;
        if (timeValue >= 7 && timeValue < 17) return CONFIG.TIME_MODES.DAY;
        if (timeValue >= 17 && timeValue < 19) return CONFIG.TIME_MODES.DUSK;
        return CONFIG.TIME_MODES.NIGHT;
    }
    
    function getCurrentCountry() {
        if (!$gameVariables) return defaultCountry;
        const countryId = $gameVariables.value(86);
        if (!countryId || countryId === 0) return defaultCountry;
        return Countries.find(c => c.id === countryId) || defaultCountry;
    }
    
    function getTintDataForTimeMode(timeMode) {
        switch(timeMode) {
            case CONFIG.TIME_MODES.DAY:
                return { 
                    color: [20, 20, 40, 0], 
                    blendColor: 'rgba(135, 206, 250, 0.15)' 
                };
            case CONFIG.TIME_MODES.NIGHT:
                return { 
                    color: [-80, -60, 20, 0], 
                    blendColor: 'rgba(0, 20, 80, 0.4)' 
                };
            case CONFIG.TIME_MODES.DUSK:
                return { 
                    color: [40, -20, -10, 0], 
                    blendColor: 'rgba(255, 100, 0, 0.25)' 
                };
            case CONFIG.TIME_MODES.DAWN:
                return { 
                    color: [50, 10, -20, 0], 
                    blendColor: 'rgba(255, 140, 100, 0.2)' 
                };
            default:
                return { 
                    color: [0, 0, 0, 0], 
                    blendColor: null 
                };
        }
    }

    // =============================================================================
    // Sky Drawing Section
    // =============================================================================
    
    function drawMoon(context, x, y, radius, moonData) {
        const { phase, illumination, isWaxing } = moonData;
        
        // Outer glow (stronger and more visible)
        const outerGlow = context.createRadialGradient(x, y, radius * 0.5, x, y, radius * 2.5);
        outerGlow.addColorStop(0, 'rgba(255, 255, 230, 0.6)');
        outerGlow.addColorStop(0.5, 'rgba(255, 255, 200, 0.3)');
        outerGlow.addColorStop(1, 'rgba(255, 255, 200, 0)');
        context.fillStyle = outerGlow;
        context.beginPath();
        context.arc(x, y, radius * 2.5, 0, Math.PI * 2);
        context.fill();
        
        // Inner glow
        const innerGlow = context.createRadialGradient(x, y, radius * 0.7, x, y, radius * 1.3);
        innerGlow.addColorStop(0, 'rgba(255, 255, 240, 0.5)');
        innerGlow.addColorStop(1, 'rgba(255, 255, 240, 0)');
        context.fillStyle = innerGlow;
        context.beginPath();
        context.arc(x, y, radius * 1.3, 0, Math.PI * 2);
        context.fill();
        
        // Save context for clipping
        context.save();
        
        // Create clipping path for the moon
        context.beginPath();
        context.arc(x, y, radius, 0, Math.PI * 2);
        context.clip();
        
        // Moon body (brighter)
        context.fillStyle = '#FFFAED';
        context.beginPath();
        context.arc(x, y, radius, 0, Math.PI * 2);
        context.fill();
        
        // Moon craters (more visible)
        context.fillStyle = 'rgba(200, 195, 175, 0.4)';
        const craters = [
            [0.2, -0.3, 0.15],
            [-0.3, 0.1, 0.2],
            [0.1, 0.3, 0.12],
            [-0.2, -0.2, 0.18],
            [0.35, 0.15, 0.1]
        ];
        
        craters.forEach(([cx, cy, cr]) => {
            context.beginPath();
            context.arc(x + cx * radius, y + cy * radius, cr * radius, 0, Math.PI * 2);
            context.fill();
        });
        
        // Moon phase shadow - use destination-out to actually cut out the shadow
        if (illumination < 0.98) {
            context.globalCompositeOperation = 'destination-out';
            
            const shadowX = isWaxing 
                ? x + radius * (1 - 2 * illumination)
                : x - radius * (1 - 2 * illumination);
            
            // Draw shadow to cut out
            context.fillStyle = 'rgba(0, 0, 0, 1)';
            context.beginPath();
            context.arc(shadowX, y, radius, 0, Math.PI * 2);
            context.fill();
            
            // Draw subtle shadow gradient on the edge
            context.globalCompositeOperation = 'source-over';
            const edgeX = isWaxing ? x - radius * (2 * illumination - 1) : x + radius * (2 * illumination - 1);
            const shadowGradient = context.createRadialGradient(edgeX, y, 0, edgeX, y, radius * 0.3);
            shadowGradient.addColorStop(0, 'rgba(0, 10, 30, 0.4)');
            shadowGradient.addColorStop(1, 'rgba(0, 10, 30, 0)');
            context.fillStyle = shadowGradient;
            context.fillRect(x - radius, y - radius, radius * 2, radius * 2);
        }
        
        context.restore();
    }
    
    function drawStars(context, width, height, animatedTime) {
        const random = createSeededRandom(12345);
        const time = animatedTime !== undefined ? animatedTime : 0;
        const isAnimated = animatedTime !== undefined;
        
        for (let i = 0; i < 300; i++) {
            const x = random() * width;
            const y = random() * height;
            const size = random() * 2.5 + 0.5;
            const baseBrightness = random() * 0.4 + 0.6;
            
            // Twinkling effect
            let brightness = baseBrightness;
            if (isAnimated) {
                const twinkleSpeed = 2 + random() * 3;
                const twinkle = Math.sin(time * twinkleSpeed + i) * 0.3;
                brightness = Math.max(0.3, Math.min(1, baseBrightness + twinkle));
            }
            
            // Draw square star
            context.globalAlpha = brightness;
            context.fillStyle = '#FFFFFF';
            context.fillRect(x - size/2, y - size/2, size, size);
            
            // Star glow for brighter stars (square glow)
            if (size > 1.5 && brightness > 0.7) {
                const glowSize = size * 3;
                const glowGradient = context.createRadialGradient(x, y, 0, x, y, glowSize);
                glowGradient.addColorStop(0, `rgba(255, 255, 255, ${brightness * 0.4})`);
                glowGradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
                context.fillStyle = glowGradient;
                context.fillRect(x - glowSize, y - glowSize, glowSize * 2, glowSize * 2);
            }
        }
        
        context.globalAlpha = 1;
    }
    
    function drawClouds(context, width, height, timeMode, animTime = 0) {
        const opacity = timeMode === CONFIG.TIME_MODES.DAWN ? 0.5 
                      : timeMode === CONFIG.TIME_MODES.DUSK ? 0.4 
                      : 0.35;
        
        const random = createSeededRandom(54321);
        const cloudCount = 8 + Math.floor(random() * 6); // Fewer clouds
        
        for (let i = 0; i < cloudCount; i++) {
            // Slower movement
            const baseX = random() * width * 1.2 - width * 0.1;
            const baseY = random() * (height * 0.6);
            const cloudSpeed = 0.2 + random() * 0.1; // Much slower (was 0.1-0.4)
            const x = (baseX + animTime * cloudSpeed * 10) % (width * 1.2) - width * 0.1;
            const y = baseY;
            
            const size = random() * 50 + 20; // Larger base size
            const puffCount = 5 + Math.floor(random() * 8); // More puffs for smoother shape
            const cloudOpacity = opacity * (0.6 + random() * 0.4);
            const stretch = 1.5 + random() * 1.0; // Much more horizontal stretch
            
            context.fillStyle = `rgba(255, 255, 255, ${cloudOpacity})`;
            
            // Draw more overlapping puffs for smoother, realistic clouds
            for (let j = 0; j < puffCount; j++) {
                // Arrange puffs more horizontally
                const puffX = x + ((j / puffCount) - 0.5) * size * 3 * stretch;
                const puffY = y + (random() - 0.5) * size * 0.4; // Less vertical variation
                const puffSize = size * (0.5 + random() * 0.5);
                
                // Draw elongated ellipses for wispy clouds
                context.beginPath();
                context.ellipse(puffX, puffY, puffSize * stretch, puffSize * 0.6, 0, 0, Math.PI * 2);
                context.fill();
            }
            
            // Add some wispy edges
            context.globalAlpha = cloudOpacity * 0.3;
            for (let j = 0; j < 3; j++) {
                const wispX = x + (random() - 0.5) * size * 2.5 * stretch;
                const wispY = y + (random() - 0.5) * size * 0.5;
                const wispSize = size * (0.3 + random() * 0.4);
                
                context.beginPath();
                context.ellipse(wispX, wispY, wispSize * stretch * 1.5, wispSize * 0.4, 0, 0, Math.PI * 2);
                context.fill();
            }
            context.globalAlpha = 1.0;
        }
    }
    
    function createSkyGradient(context, width, height, timeMode) {
        // This function is kept for compatibility but not used with dithering
        const gradient = context.createLinearGradient(0, 0, 0, height);
        
        switch(timeMode) {
            case CONFIG.TIME_MODES.DAY:
                gradient.addColorStop(0, '#1E90FF');
                gradient.addColorStop(0.5, '#87CEEB');
                gradient.addColorStop(1, '#B0E0E6');
                break;
            case CONFIG.TIME_MODES.NIGHT:
                gradient.addColorStop(0, '#000428');
                gradient.addColorStop(0.5, '#004e92');
                gradient.addColorStop(1, '#001a33');
                break;
            case CONFIG.TIME_MODES.DUSK:
                gradient.addColorStop(0, '#FF4500');
                gradient.addColorStop(0.4, '#FF8C00');
                gradient.addColorStop(0.7, '#9370DB');
                gradient.addColorStop(1, '#483D8B');
                break;
            case CONFIG.TIME_MODES.DAWN:
                gradient.addColorStop(0, '#FF6B6B');
                gradient.addColorStop(0.4, '#FFA07A');
                gradient.addColorStop(0.7, '#FFD700');
                gradient.addColorStop(1, '#87CEEB');
                break;
            default:
                gradient.addColorStop(0, '#1E90FF');
                gradient.addColorStop(0.5, '#87CEEB');
                gradient.addColorStop(1, '#B0E0E6');
        }
        
        return gradient;
    }

    // =============================================================================
    // Game_Map Extensions
    // =============================================================================
    
    Game_Map.prototype.isInterior = function() {
        return $dataMap && $dataMap.note && /<Interior>/i.test($dataMap.note);
    };

    Game_Map.prototype.isExterior = function() {
        return $dataMap && $dataMap.note && /<Exterior>/i.test($dataMap.note);
    };

    Game_Map.prototype.getBiome = function() {
        if (!$dataMap || !$dataMap.note) return null;
        const match = $dataMap.note.match(/<Biome:\s*(.+?)>/i);
        return match ? match[1].trim() : null;
    };

    // =============================================================================
    // ImageManager Extensions
    // =============================================================================
    
    ImageManager.getBiomeBackgroundForPlayer = function(biomeName) {
        if (!biomeName) return null;
        
        // Get player coordinates
        const playerX = $gamePlayer.x;
        const playerY = $gamePlayer.y;
        
        return getBiomeBackgroundForCoordinates(playerX, playerY, biomeName);
    };
    
    // Keep the old function name for compatibility but redirect to new system
    ImageManager.getRandomBiomeBackground = function(biomeName) {
        return this.getBiomeBackgroundForPlayer(biomeName);
    };

    // =============================================================================
    // Spriteset_Battle Extensions
    // =============================================================================
    
    // Create Lower Layer
    const _Spriteset_Battle_createLowerLayer = Spriteset_Battle.prototype.createLowerLayer;
    Spriteset_Battle.prototype.createLowerLayer = function() {
        _Spriteset_Battle_createLowerLayer.call(this);
        
        // Always clear screen tint - we apply tint only to backgrounds
        $gameScreen.startTint([0, 0, 0, 0], 0);
        
        if (ConfigManager.ebBackgrounds !== 2) {
            this.createEarthboundBackground();
        }
    };

    // Battleback Creation

    const _Spriteset_Battle_createBattleback = Spriteset_Battle.prototype.createBattleback;
    Spriteset_Battle.prototype.createBattleback = function() {
        _Spriteset_Battle_createBattleback.call(this);

        const mapBattleback = $gameMap.battleback1Name();
        const mode = ConfigManager.ebBackgrounds;

        // If map has a specific battleback set, use that and skip biome system
        if (mapBattleback) {
            this._back1Sprite.bitmap = ImageManager.loadBattleback1(mapBattleback);
            this.alignBattlebackBottom(this._back1Sprite);
            // Only apply tint in Biome mode (0) and NOT for interiors

            if (mode === 0 && !$gameMap.isInterior()) {

                this.applyTimeOfDayTintToBackground(this._back1Sprite);

            } else if ($gameMap.isInterior()) {

                // Darken interior backgrounds

                this.applyInteriorDarkening(this._back1Sprite);

            }
            return;
        }

        // Otherwise, use biome system if mode is Biome or Trippy
        let biome = $gameMap.getBiome();

        // Check for procedural map biome (map 636)
        if (!biome && $gameMap.mapId() === 636 && $gameSystem._procGenData) {
            biome = $gameSystem._procGenData.currentBiome;

            // Check for virtual biome overrides (Island takes priority over Beach)
            if ($gameSystem._procGenData.displayAsIsland) {
                biome = "Island";
            } else if ($gameSystem._procGenData.displayAsBeach) {
                biome = "Beach";
            }
        }

        if (!biome && (mode === 0 || mode === 1)) {
            biome = $gameMap.isExterior() ? 'Fields'
                  : $gameMap.isInterior() ? 'Dungeon'
                  : null;
        }

        if (biome) {
            // Use coordinate-based background selection
            const biomeBg = ImageManager.getBiomeBackgroundForPlayer(biome);
            if (biomeBg) {
                this._back1Sprite.bitmap = ImageManager.loadBattleback1(biomeBg);
                this.alignBattlebackBottom(this._back1Sprite);
                // Only apply tint in Biome mode (0) and NOT for interiors

                if (mode === 0 && !$gameMap.isInterior()) {

                    this.applyTimeOfDayTintToBackground(this._back1Sprite);

                } else if ($gameMap.isInterior()) {

                    // Darken interior backgrounds

                    this.applyInteriorDarkening(this._back1Sprite);

                }
            }
        } else {
            this.alignBattlebackBottom(this._back1Sprite);
        }
    };
    
    // NEW METHOD: Applies tint only to the background sprite using a color overlay
    Spriteset_Battle.prototype.applyTimeOfDayTintToBackground = function(sprite) {
        if (!sprite || !sprite.bitmap) return;
        
        const tintData = this.getTimeOfDayTint();
        
        const applyTint = () => {
            if (!sprite.bitmap || !sprite.bitmap.isReady()) return;
            
            // Remove any existing tint overlay
            if (sprite._tintOverlay) {
                sprite.removeChild(sprite._tintOverlay);
                sprite._tintOverlay = null;
            }
            
            // Only apply if there's a blend color
            if (!tintData.blendColor) return;
            
            // Create an overlay sprite that matches the background size
            sprite._tintOverlay = new Sprite();
            sprite._tintOverlay.bitmap = new Bitmap(sprite.bitmap.width, sprite.bitmap.height);
            
            // Fill with the tint color
            const context = sprite._tintOverlay.bitmap._context;
            context.fillStyle = tintData.blendColor;
            context.fillRect(0, 0, sprite.bitmap.width, sprite.bitmap.height);
            
            // Use additive blending for the tint overlay
            sprite._tintOverlay.blendMode = 1; // Additive blend
            
            // Add the overlay as a child of the background sprite
            // This ensures the tint only affects the background
            sprite.addChild(sprite._tintOverlay);
            
            //console.log('Applied time-of-day tint to background:', tintData.blendColor);
        };
        
        if (sprite.bitmap.isReady()) {
            applyTint();
        } else {
            sprite.bitmap.addLoadListener(applyTint);
        }
    };
    

    // NEW METHOD: Applies darkening to interior backgrounds
    Spriteset_Battle.prototype.applyInteriorDarkening = function(sprite) {
        if (!sprite || !sprite.bitmap) return;
        
        const applyDarkening = () => {
            if (!sprite.bitmap || !sprite.bitmap.isReady()) return;
            
            // Remove any existing darkening overlay
            if (sprite._darkeningOverlay) {
                sprite.removeChild(sprite._darkeningOverlay);
                sprite._darkeningOverlay = null;
            }
            
            // Create a semi-transparent black overlay
            sprite._darkeningOverlay = new Sprite();
            sprite._darkeningOverlay.bitmap = new Bitmap(sprite.bitmap.width, sprite.bitmap.height);
            
            // Fill with dark color (black with 40% opacity)
            const context = sprite._darkeningOverlay.bitmap._context;
            context.fillStyle = 'rgba(0, 0, 0, 0.4)';
            context.fillRect(0, 0, sprite.bitmap.width, sprite.bitmap.height);
            
            // Use multiply blending for natural darkening
            sprite._darkeningOverlay.blendMode = 2; // Multiply blend
            
            // Add the overlay as a child of the background sprite
            sprite.addChild(sprite._darkeningOverlay);
            
            //console.log('Applied darkening to interior background');
        };
        
        if (sprite.bitmap.isReady()) {
            applyDarkening();
        } else {
            sprite.bitmap.addLoadListener(applyDarkening);
        }
    };
    

    Spriteset_Battle.prototype.alignBattlebackBottom = function(sprite) {
        if (!sprite || !sprite.bitmap) return;
        
        const alignToBottom = () => {
            if (sprite.bitmap && sprite.bitmap.isReady()) {
                const bitmapHeight = sprite.bitmap.height;
                const bitmapWidth = sprite.bitmap.width;
                const screenHeight = Graphics.height;
                
                if (bitmapHeight > screenHeight) {
                    const clipAmount = bitmapHeight - screenHeight;
                    sprite.setFrame(0, clipAmount, bitmapWidth, screenHeight);
                    sprite.x = 0;
                    sprite.y = 0;
                } else {
                    sprite.setFrame(0, 0, bitmapWidth, bitmapHeight);
                }
            }
        };
        
        if (sprite.bitmap.isReady()) {
            alignToBottom();
        } else {
            sprite.bitmap.addLoadListener(alignToBottom);
        }
    };

    Spriteset_Battle.prototype.getTimeOfDayTint = function() {
        const timeMode = getCurrentTimeMode();
        return getTintDataForTimeMode(timeMode);
    };




    // Create Earthbound Background
    Spriteset_Battle.prototype.createEarthboundBackground = function() {
        try {
            this._earthboundContainer = new Sprite();
            this._earthboundGradientContainer = new Sprite();

            this._earthboundGradientContainer.opacity = 255;
            this._earthboundGradientContainer.blendMode = 0; // Normal blend for gradient in Biome mode
            this._earthboundContainer.opacity = 255; // Full opacity for stars/moon in Biome mode
            this._earthboundContainer.blendMode = 0; // Normal blend for biome elements
            
            const isBiomeMode = ConfigManager.ebBackgrounds === 0;
            const parent = this._back1Sprite?.parent || this._battleField?.parent || this;
            
            if (isBiomeMode) {
                const backIndex = this._back1Sprite?.parent?.getChildIndex(this._back1Sprite) ?? 0;
                // Gradient behind everything, then stars/moon layer
                parent.addChildAt(this._earthboundGradientContainer, backIndex);
                parent.addChildAt(this._earthboundContainer, backIndex + 1);
            } else {
                // For trippy mode, use configured blend modes
                this._earthboundContainer.opacity = CONFIG.overlayOpacity;
                this._earthboundContainer.blendMode = CONFIG.overlayBlendMode;
                this._earthboundGradientContainer.blendMode = 1;
                
                const backIndex = this._back1Sprite?.parent?.getChildIndex(this._back1Sprite) ?? 0;
                parent.addChildAt(this._earthboundGradientContainer, backIndex + 1);
                parent.addChildAt(this._earthboundContainer, backIndex + 2);
            }
            
            this._earthboundContainer.width = Graphics.width;
            this._earthboundContainer.height = Graphics.height;
            this._earthboundGradientContainer.width = Graphics.width;
            this._earthboundGradientContainer.height = Graphics.height;
            
            this._earthboundBitmap = new Bitmap(Graphics.width, Graphics.height);
            this._gradientBitmap = new Bitmap(Graphics.width, Graphics.height);
            
            this._earthboundSprite = new Sprite(this._earthboundBitmap);
            this._gradientSprite = new Sprite(this._gradientBitmap);
            
            this._earthboundContainer.addChild(this._earthboundSprite);
            this._earthboundGradientContainer.addChild(this._gradientSprite);
            
            this._animationCount = 0;
            this._frameCount = 0;
            this._lastDrawTime = 0;
            
            if (ConfigManager.ebBackgrounds === 0) {
                this.initSkyBackground();
            } else {
                this.initRandomBackground();
            }
        } catch (e) {
            console.error("Error creating Earthbound background:", e);
        }
    };

    // Biome Background Initialization
    Spriteset_Battle.prototype.initSkyBackground = function() {
        this._bgType = 'sky';
        this._skyInitialized = true;
        // Use game date from TimeDateSystem instead of real date
        this._moonData = calculateMoonPhase(getGameDate());
        this._starAnimationTime = 0;
        this._cloudAnimationTime = 0; // Added this line
        this.drawSkyBackground();
        //console.log("Biome mode initialized - Moon phase:", this._moonData.name);
    };

    Spriteset_Battle.prototype.drawSkyBackground = function() {
        const w = this._earthboundBitmap.width;
        const h = this._earthboundBitmap.height;
        const timeMode = getCurrentTimeMode();
        
        //console.log('Drawing Biome background - Time mode:', timeMode);
        
        this._earthboundBitmap.clear();
        this._gradientBitmap.clear();
        
        // Draw dithered gradient
        const gradContext = this._gradientBitmap._context;
        drawDitheredGradient(gradContext, w, h, timeMode);
        
        const context = this._earthboundBitmap._context;
        
        // Night elements
        if (timeMode === CONFIG.TIME_MODES.NIGHT) {
            //console.log('Drawing night sky with stars and moon');
            drawStars(context, w, h, this._starAnimationTime);
            
            // Moon(s)
            if (isFriday()) {
                //console.log('Friday detected - drawing three moons!');
                // Three moons on Friday!
                const moonRadius = 35;
                const spacing = 100;
                const centerX = w / 2;
                const baseY = h * 0.25;
                
                // Left moon
                drawMoon(context, centerX - spacing, baseY, moonRadius, this._moonData);
                
                // Center moon (larger)
                drawMoon(context, centerX, baseY - 20, moonRadius * 1.3, this._moonData);
                
                // Right moon
                drawMoon(context, centerX + spacing, baseY, moonRadius, this._moonData);
            } else {
                //console.log('Drawing single moon - Phase:', this._moonData.name);
                // Single moon
                const moonRadius = 45;
                const moonX = w * 0.75;
                const moonY = h * 0.2;
                drawMoon(context, moonX, moonY, moonRadius, this._moonData);
            }
        }
        
        // Day, dusk, dawn clouds
        if (timeMode === CONFIG.TIME_MODES.DAY || 
            timeMode === CONFIG.TIME_MODES.DUSK || 
            timeMode === CONFIG.TIME_MODES.DAWN) {
            //console.log('Drawing clouds for time mode:', timeMode);
            drawClouds(context, w, h, timeMode, this._cloudAnimationTime);}
            
    };

    // Random Background Initialization
    Spriteset_Battle.prototype.initRandomBackground = function() {
        this._bgType = CONFIG.PATTERN_TYPES[Math.floor(Math.random() * CONFIG.PATTERN_TYPES.length)];
        this._colorHue1 = Math.floor(Math.random() * 360);
        this._colorHue2 = Math.floor(Math.random() * 360);
        this._colorHue3 = Math.floor(Math.random() * 360);
        this._gradientColorHue1 = Math.floor(Math.random() * 360);
        this._gradientColorHue2 = Math.floor(Math.random() * 360);
        this._gradientRotation = Math.floor(Math.random() * 4) * 45;
        this._gradientSpeed = 0.1 + Math.random() * 0.3;
        
        this.initPatternProperties(this._bgType);
        //console.log("Random background initialized - Type:", this._bgType);
    };

    Spriteset_Battle.prototype.initPatternProperties = function(bgType) {
        switch(bgType) {
            case 0:
                this._waveAmplitude = 5 + Math.floor(Math.random() * 10);
                this._waveFrequency = 0.02 + Math.random() * 0.03;
                this._waveSpeed = 0.02 + Math.random() * 0.03;
                this._numLines = 12 + Math.floor(Math.random() * 6);
                break;
            case 1:
                this._spiralSegments = 8 + Math.floor(Math.random() * 6);
                this._spiralRotationSpeed = 0.2 + Math.random() * 0.3;
                this._spiralZoom = 0.02 + Math.random() * 0.03;
                break;
            case 2:
                this._arcaneRings = 2 + Math.floor(Math.random() * 2);
                this._arcaneSymbols = 5 + Math.floor(Math.random() * 4);
                this._arcaneRotationSpeed = 0.02 + Math.random() * 0.30;
                break;
            case 3:
                this._checkerSize = 20 + Math.floor(Math.random() * 20);
                this._checkerScrollSpeed = 0.05 + Math.random() * 0.1;
                this._checkerAngle = Math.floor(Math.random() * 4) * 45;
                break;
            case 4:
                this._diamondSize = 30 + Math.floor(Math.random() * 20);
                this._diamondSpeed = 0.02 + Math.random() * 0.03;
                this._diamondWave = 0.005 + Math.random() * 0.01;
                break;
            case 5:
                this._circleCount = 6 + Math.floor(Math.random() * 6);
                this._circlePulseSpeed = 0.01 + Math.random() * 0.02;
                this._circlePulseAmount = 0.2 + Math.random() * 0.3;
                this._circleRotationSpeed = 0.1 + Math.random() * 0.2;
                break;
            case 6:
                this._gridSize = 30 + Math.floor(Math.random() * 30);
                this._gridWaveSpeed = 0.01 + Math.random() * 0.02;
                this._gridWaveIntensity = 5 + Math.floor(Math.random() * 10);
                this._gridLinesOnly = Math.random() > 0.5;
                break;
            case 7:
                this._plaidSize = 20 + Math.floor(Math.random() * 40);
                this._plaidSpeed = 0.5 + Math.random() * 1.0;
                this._plaidRotation = Math.random() * 45;
                this._plaidHorizontalDensity = 1 + Math.floor(Math.random() * 3);
                this._plaidVerticalDensity = 1 + Math.floor(Math.random() * 3);
                break;
            case 8:
                this._kaleidoscopeSegments = 4 + Math.floor(Math.random() * 4) * 2;
                this._kaleidoscopeRotationSpeed = 0.01 + Math.random() * 0.02;
                this._kaleidoscopeScale = 0.5 + Math.random() * 0.5;
                this._kaleidoscopeCircles = 3 + Math.floor(Math.random() * 5);
                break;
            case 9:
                this._dotSize = 4 + Math.floor(Math.random() * 6);
                this._dotDensity = 0.02 + Math.random() * 0.03;
                this._dotSpeed = 0.5 + Math.random() * 1.0;
                break;
            case 10:
                this._waveCount = 3 + Math.floor(Math.random() * 5);
                this._waveThickness = 2 + Math.floor(Math.random() * 3);
                this._waveSpeed = 0.02 + Math.random() * 0.03;
                this._waveAmplitude = 20 + Math.floor(Math.random() * 20);
                break;
            case 11:
                this._crystalSize = 40 + Math.floor(Math.random() * 30);
                this._crystalRotationSpeed = 0.01 + Math.random() * 0.02;
                this._crystalLayers = 2 + Math.floor(Math.random() * 2);
                this._crystalShininess = Math.random() > 0.5;
                break;
        }
    };

    // Update Loop
    const _Spriteset_Battle_update = Spriteset_Battle.prototype.update;
    Spriteset_Battle.prototype.update = function() {
        _Spriteset_Battle_update.call(this);
        
        // Test mode pattern switcher
        if ($gameTemp.isPlaytest() && Input.isTriggered('pagedown')) {
            this.initRandomBackground();
        }
        
        if (ConfigManager.ebBackgrounds === 2 && this._earthboundContainer) {
            this.removeEarthboundBackground();
        } else if (ConfigManager.ebBackgrounds !== 2 && !this._earthboundContainer) {
            this.createEarthboundBackground();
        } else if (ConfigManager.ebBackgrounds !== 2 && this._earthboundBitmap) {
            this.updateEarthboundBackground();
        }
    };

    Spriteset_Battle.prototype.updateEarthboundBackground = function() {
        if (!this._earthboundBitmap?._context || !this._gradientBitmap?._context) return;
        
        if (ConfigManager.ebBackgrounds === 0) {
            const timeMode = getCurrentTimeMode();
            
            // Check if we need to redraw static elements (time mode changed)
            if (this._lastTimeMode !== timeMode) {
                this._lastTimeMode = timeMode;
                this._needsStaticRedraw = true;
            }
            
            // Update animated stars in night sky
            if (timeMode === CONFIG.TIME_MODES.NIGHT) {
                this._starAnimationTime = (this._starAnimationTime || 0) + 0.016;
                // Reduced frequency: only update every 6 frames (from 3) - 50% less work
                if (this._frameCount % 6 === 0) {
                    this.updateSkyAnimation();
                }
            }
            // Update animated clouds during day/dusk/dawn
            else if (timeMode === CONFIG.TIME_MODES.DAY || 
                     timeMode === CONFIG.TIME_MODES.DUSK || 
                     timeMode === CONFIG.TIME_MODES.DAWN) {
                this._cloudAnimationTime = (this._cloudAnimationTime || 0) + 0.016;
                // Reduced frequency: only update every 4 frames (from 2) - 50% less work
                if (this._frameCount % 4 === 0) {
                    this.updateSkyAnimation();
                }
            }
            
            this._frameCount++;
            return;
        }
        
        // Trippy mode
        this._animationCount += CONFIG.speedMultiplier;
        this._frameCount++;
        
        const drawInterval = this.getDrawInterval();
        
        if (this._frameCount % drawInterval === 0) {
            if (this._frameCount % (drawInterval * 2) === 0) {
                this.drawGradient();
            }
            this._earthboundBitmap.clear();
            this.drawPattern(this._bgType);
        }
    };

    Spriteset_Battle.prototype.updateSkyAnimation = function() {
        // Only redraw static elements if needed (time mode changed)
        if (this._needsStaticRedraw) {
            this.drawSkyBackground();
            this._needsStaticRedraw = false;
        } else {
            // Only update animated elements (stars/clouds) without full redraw
            this.updateSkyAnimatedElements();
        }
    };

    Spriteset_Battle.prototype.updateSkyAnimatedElements = function() {
        // Optimized: only update animated parts without redrawing static gradient/moon
        // This provides significant performance boost by avoiding full canvas clears
        this.drawSkyBackground();
    };

    Spriteset_Battle.prototype.removeEarthboundBackground = function() {
        if (this._earthboundContainer?.parent) {
            this._earthboundContainer.parent.removeChild(this._earthboundContainer);
        }
        if (this._earthboundGradientContainer?.parent) {
            this._earthboundGradientContainer.parent.removeChild(this._earthboundGradientContainer);
        }
        
        this._earthboundContainer = null;
        this._earthboundGradientContainer = null;
        this._earthboundBitmap = null;
        this._gradientBitmap = null;
        this._skyInitialized = false;
    };

    Spriteset_Battle.prototype.getDrawInterval = function() {
        const intervals = {
            0: 1, 1: 1, 5: 1, 8: 1, 12: 1, 13: 1,
            2: 2, 4: 2, 6: 2, 10: 2, 11: 2, 14: 2,
            3: 3, 7: 3, 9: 3
        };
        return intervals[this._bgType] || 2;
    };

    Spriteset_Battle.prototype.drawPattern = function(bgType) {
        this._currentBitmap = this._earthboundBitmap;
        this._currentContext = this._earthboundBitmap._context;
        this._currentContext.imageSmoothingEnabled = false;
        
        const patterns = {
            0: 'drawWavyLines',
            1: 'drawSpiral',
            2: 'drawArcaneSeal',
            3: 'drawCheckerboard',
            4: 'drawDiamondPattern',
            5: 'drawConcentricCircles',
            6: 'drawFlowingGrid',
            7: 'drawPlaids',
            8: 'drawKaleidoscope',
            9: 'drawFlowingDots',
            10: 'drawEnergyWaves',
            11: 'drawCrystalLattice',
            12: 'drawRGBGlitch',
            13: 'drawNebulaSwirl',
            14: 'drawWarpTunnel'
        };
        
        const method = patterns[bgType] || 'drawWavyLines';
        if (this[method]) this[method]();
    };

    Spriteset_Battle.prototype.drawGradient = function() {
        const w = this._gradientBitmap.width;
        const h = this._gradientBitmap.height;
        const context = this._gradientBitmap._context;
        
        this._gradientBitmap.clear();
        
        const hue1 = (this._gradientColorHue1 + this._animationCount * this._gradientSpeed) % 360;
        const hue2 = (this._gradientColorHue2 + this._animationCount * this._gradientSpeed * 0.7) % 360;
        
        const angle = this._gradientRotation * Math.PI / 180;
        const cos = Math.cos(angle);
        const sin = Math.sin(angle);
        
        const gradient = context.createLinearGradient(
            w/2 - cos * w/2, h/2 - sin * h/2,
            w/2 + cos * w/2, h/2 + sin * h/2
        );
        
        gradient.addColorStop(0, hueToColor(hue1, 1, 30));
        gradient.addColorStop(1, hueToColor(hue2, 1, 30));
        
        context.fillStyle = gradient;
        context.fillRect(0, 0, w, h);
    };

    Spriteset_Battle.prototype.hueToColor = function(hue, alpha, lightness) {
        return hueToColor(hue, alpha, lightness);
    };

    // =============================================================================
    // Config Manager
    // =============================================================================
    
    ConfigManager.ebBackgrounds = CONFIG.defaultMode;
    
    const _ConfigManager_makeData = ConfigManager.makeData;
    ConfigManager.makeData = function() {
        const config = _ConfigManager_makeData.call(this);
        config.ebBackgrounds = this.ebBackgrounds;
        return config;
    };

    const _ConfigManager_applyData = ConfigManager.applyData;
    ConfigManager.applyData = function(config) {
        _ConfigManager_applyData.call(this, config);
        this.ebBackgrounds = config.ebBackgrounds !== undefined 
            ? Number(config.ebBackgrounds) 
            : CONFIG.defaultMode;
    };

    // =============================================================================
    // Window_Options
    // =============================================================================
    
    const _Window_Options_addGeneralOptions = Window_Options.prototype.addGeneralOptions;
    Window_Options.prototype.addGeneralOptions = function() {
        _Window_Options_addGeneralOptions.call(this);
        this.addCommand(CONFIG.optionName, 'ebBackgrounds');
    };
    
    const _Window_Options_statusText = Window_Options.prototype.statusText;
    Window_Options.prototype.statusText = function(index) {
        const symbol = this.commandSymbol(index);
        if (symbol === 'ebBackgrounds') {
            const modes = ['Biome', 'Trippy', 'None'];
            return modes[this.getConfigValue(symbol)] || 'Biome';
        }
        return _Window_Options_statusText.call(this, index);
    };

    const _Window_Options_processOk = Window_Options.prototype.processOk;
    Window_Options.prototype.processOk = function() {
        const symbol = this.commandSymbol(this.index());
        if (symbol === 'ebBackgrounds') {
            const value = (this.getConfigValue(symbol) + 1) % 3;
            this.changeValue(symbol, value);
        } else {
            _Window_Options_processOk.call(this);
        }
    };

    const _Window_Options_cursorRight = Window_Options.prototype.cursorRight;
    Window_Options.prototype.cursorRight = function(wrap) {
        const symbol = this.commandSymbol(this.index());
        if (symbol === 'ebBackgrounds') {
            const value = (this.getConfigValue(symbol) + 1) % 3;
            this.changeValue(symbol, value);
        } else {
            _Window_Options_cursorRight.call(this, wrap);
        }
    };

    const _Window_Options_cursorLeft = Window_Options.prototype.cursorLeft;
    Window_Options.prototype.cursorLeft = function(wrap) {
        const symbol = this.commandSymbol(this.index());
        if (symbol === 'ebBackgrounds') {
            const value = (this.getConfigValue(symbol) + 2) % 3;
            this.changeValue(symbol, value);
        } else {
            _Window_Options_cursorLeft.call(this, wrap);
        }
    };

})();
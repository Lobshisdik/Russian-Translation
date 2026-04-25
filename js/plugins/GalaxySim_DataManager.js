/*:
 * @target MZ
 * @plugindesc GalaxySim Data Manager Module - Star system data management and ship travel
 * @author Omni-Lex + Nocoldiz
 * @url
 * @help
 * ============================================================================
 * GalaxySim Data Manager Module
 * ============================================================================
 * This module handles all star system data management:
 * - Loading hardcoded systems from GalaxySimDB
 * - Procedural system generation
 * - Player ship position and travel logic
 * - System queries and distance calculations
 *
 * LOAD ORDER: Must load AFTER GalaxySim_Math.js
 *
 * DEPENDENCIES:
 * - GalaxySimDB.js
 * - GalaxySim_Math.js
 */

(() => {
  "use strict";

  // Check dependencies
  if (!window.GalaxySim || !window.GalaxySim.Math) {
    throw new Error("GalaxySim_DataManager requires GalaxySim_Math to be loaded first");
  }

  if (!window.GalaxyData) {
    throw new Error("GalaxySim_DataManager requires GalaxySimDB to be loaded first");
  }

  // Import from Math module
  const { RandomGenerator, MAP_RADIUS, SYSTEM_DENSITY, KLY_TO_LY,
          GALAXY_TYPE_SPIRAL, GALAXY_TYPE_ELLIPTICAL, GALAXY_TYPE_IRREGULAR,
          GALAXY_TYPE_DWARF_SPHEROIDAL } = window.GalaxySim.Math;
  const { STAR_COLORS, PLANET_COLORS } = window.GalaxySim.Math;

  // Import from GalaxyData
  const STAR_TYPES = window.GalaxyData.STAR_TYPES;
  const PLANET_TYPES = window.GalaxyData.PLANET_TYPES;
  const SYSTEMS = window.GalaxyData.SYSTEMS;

  // ============================================================================
  // Procedural Name Generators
  // ============================================================================

  function generateProceduralGalaxyName(x, y, rng) {
    const catalogPrefixes = [
      'NGC', 'IC', 'UGC', 'PGC', 'SDSS', '2MASS', 'ESO', 'UGPS',
      'WISE', 'MCG', 'CGCG', 'LEDA', 'APG', 'VCC'
    ];

    const catalogType = rng.random();

    if (catalogType < 0.3) {
      const prefix = catalogPrefixes[Math.floor(rng.random() * catalogPrefixes.length)];
      const number = Math.floor(rng.random() * 9999) + 1;
      return `${prefix} ${number}`;
    } else if (catalogType < 0.5) {
      const prefix = catalogPrefixes[Math.floor(rng.random() * catalogPrefixes.length)];
      const ra1 = Math.floor(rng.random() * 24).toString().padStart(2, '0');
      const ra2 = Math.floor(rng.random() * 60).toString().padStart(2, '0');
      const ra3 = (rng.random() * 60).toFixed(2).padStart(5, '0');
      const decSign = rng.random() > 0.5 ? '+' : '-';
      const dec1 = Math.floor(rng.random() * 90).toString().padStart(2, '0');
      const dec2 = Math.floor(rng.random() * 60).toString().padStart(2, '0');
      const dec3 = (rng.random() * 60).toFixed(1).padStart(4, '0');
      return `${prefix} J${ra1}${ra2}${ra3}${decSign}${dec1}${dec2}${dec3}`;
    } else {
      const prefix = catalogPrefixes[Math.floor(rng.random() * catalogPrefixes.length)];
      const sign = rng.random() > 0.5 ? '+' : '-';
      const part1 = Math.floor(rng.random() * 15) + 1;
      const part2 = Math.floor(rng.random() * 99) + 1;
      const part3 = Math.floor(rng.random() * 999) + 1;
      return `${prefix}${sign}${part1.toString().padStart(2, '0')}-${part2.toString().padStart(2, '0')}-${part3.toString().padStart(3, '0')}`;
    }
  }

  function generateProceduralSuperclusterName(x, y, rng) {
    const realConstellations = [
      'Pisces', 'Cetus', 'Sculptor', 'Fornax', 'Eridanus',
      'Hydra', 'Centaurus', 'Perseus', 'Coma', 'Corona Borealis',
      'Hercules', 'Leo', 'Bootes', 'Aquarius', 'Pegasus',
      'Indus', 'Pavo', 'Phoenix', 'Horologium', 'Reticulum',
      'Draco', 'Ursa', 'Lynx', 'Gemini', 'Cancer',
      'Virgo', 'Libra', 'Scorpius', 'Sagittarius', 'Capricorn',
      'Taurus', 'Orion', 'Canis', 'Lepus', 'Columba'
    ];

    const directions = [
      'Northern', 'Southern', 'Eastern', 'Western',
      'Upper', 'Lower', 'Central', 'Outer',
      'Near', 'Far', 'Inner', 'Peripheral'
    ];

    const features = [
      'Great', 'Grand', 'Major', 'Greater', 'Vast',
      'Extended', 'Massive', 'Giant', 'Complex'
    ];

    const typeRoll = rng.random();

    if (typeRoll < 0.35) {
      const constellation = realConstellations[Math.floor(rng.random() * realConstellations.length)];
      return `${constellation} Supercluster`;
    } else if (typeRoll < 0.65) {
      const direction = directions[Math.floor(rng.random() * directions.length)];
      const feature = features[Math.floor(rng.random() * features.length)];
      return `${direction} ${feature} Supercluster`;
    } else {
      const prefixes = ['SDSS-C', 'SCL', 'MSC', 'GSC', 'Abell', 'Shapley'];
      const prefix = prefixes[Math.floor(rng.random() * prefixes.length)];
      const number = Math.floor(rng.random() * 9999) + 1000;
      return `${prefix} ${number}`;
    }
  }

  function generateGalaxyGroupName(x, y, rng) {
    const directions = [
      'Northern', 'Southern', 'Eastern', 'Western',
      'Upper', 'Lower', 'Central', 'Outer',
      'Near', 'Far', 'Inner', 'Peripheral'
    ];

    const features = [
      'Void', 'Arm', 'Stream', 'Cloud', 'Arc',
      'Filament', 'Wall', 'Bridge', 'Tail', 'Spur',
      'Cluster', 'Chain', 'Loop', 'Knot'
    ];

    const typeRoll = rng.random();

    if (typeRoll < 0.4) {
      const direction = directions[Math.floor(rng.random() * directions.length)];
      const feature = features[Math.floor(rng.random() * features.length)];
      return `${direction} ${feature} Group`;
    } else if (typeRoll < 0.7) {
      const number = Math.floor(rng.random() * 999) + 1;
      return `Galaxy Group ${number}`;
    } else {
      const consonants = 'BCDFGHJKLMNPQRSTVWXYZ';
      const vowels = 'AEIOU';
      let name = '';
      const length = Math.floor(rng.random() * 3) + 4;
      for (let i = 0; i < length; i++) {
        if (i % 2 === 0) {
          name += consonants[Math.floor(rng.random() * consonants.length)];
        } else {
          name += vowels[Math.floor(rng.random() * vowels.length)];
        }
      }
      return `${name.charAt(0) + name.slice(1).toLowerCase()} Group`;
    }
  }

  function generateSuperclusterName(x, y, rng) {
    const realConstellations = [
      'Pisces', 'Cetus', 'Sculptor', 'Fornax', 'Eridanus',
      'Hydra', 'Centaurus', 'Perseus', 'Coma', 'Corona Borealis',
      'Hercules', 'Leo', 'Bootes', 'Aquarius', 'Pegasus',
      'Indus', 'Pavo', 'Phoenix', 'Horologium', 'Reticulum'
    ];

    const typeRoll = rng.random();

    if (typeRoll < 0.5) {
      const constellation = realConstellations[Math.floor(rng.random() * realConstellations.length)];
      return `${constellation} Supercluster`;
    } else if (typeRoll < 0.75) {
      const directions = ['Northern', 'Southern', 'Eastern', 'Western', 'Central'];
      const features = ['Great', 'Grand', 'Major', 'Greater', 'Vast'];
      const direction = directions[Math.floor(rng.random() * directions.length)];
      const feature = features[Math.floor(rng.random() * features.length)];
      return `${direction} ${feature} Supercluster`;
    } else {
      const prefixes = ['Sloan', 'SDSS', 'SCL', 'MSC', 'GSC'];
      const prefix = prefixes[Math.floor(rng.random() * prefixes.length)];
      const number = Math.floor(rng.random() * 999) + 1;
      return `${prefix}-${number}`;
    }
  }

  function generateProceduralLocalGroup(supercluster) {
    const rng = new RandomGenerator(`cosmic_web_${supercluster.x}_${supercluster.y}`);
    const galaxies = [];

    const sectorRadius = 100000 * KLY_TO_LY;
    const targetCount = 1000 + Math.floor(rng.random() * 1500);

    let safetyCounter = 0;

    const getCosmicWebDensity = (x, y) => {
      let freq = 0.00004;
      let amplitude = 1.0;
      let noiseSum = 0;
      let maxVal = 0;

      const warpX = Math.sin(x * freq * 0.5);
      const warpY = Math.cos(y * freq * 0.5);

      const wx = x + (warpX * 0.2 * sectorRadius);
      const wy = y + (warpY * 0.2 * sectorRadius);

      for (let i = 0; i < 3; i++) {
        const nx = wx * freq + (i * 13.2);
        const ny = wy * freq + (i * 57.8);

        let signal = 1.0 - Math.abs(Math.sin(nx) * Math.cos(ny));
        signal = Math.pow(signal, 2);

        noiseSum += signal * amplitude;
        maxVal += amplitude;

        freq *= 2.1;
        amplitude *= 0.5;
      }

      let normalized = noiseSum / maxVal;
      return Math.pow(normalized, 6);
    };

    while (galaxies.length < targetCount && safetyCounter < targetCount * 20) {
      safetyCounter++;

      const angle = rng.random() * Math.PI * 2;
      const dist = Math.sqrt(rng.random()) * sectorRadius;

      const candX = supercluster.x + Math.cos(angle) * dist;
      const candY = supercluster.y + Math.sin(angle) * dist;

      const density = getCosmicWebDensity(candX, candY);

      if (rng.random() > (density + 0.005)) {
        continue;
      }

      const typeRoll = rng.random();
      let type, radius, mass;

      if (density > 0.85 && typeRoll < 0.6) {
        type = GALAXY_TYPE_ELLIPTICAL;
        radius = (60 + rng.random() * 100) * KLY_TO_LY;
        mass = 1e12 + rng.random() * 5e12;
      } else if (density > 0.4) {
        if (typeRoll < 0.7) {
          type = GALAXY_TYPE_SPIRAL;
          radius = (25 + rng.random() * 60) * KLY_TO_LY;
          mass = 5e10 + rng.random() * 8e11;
        } else {
          type = GALAXY_TYPE_ELLIPTICAL;
          radius = (20 + rng.random() * 40) * KLY_TO_LY;
          mass = 1e10 + rng.random() * 1e11;
        }
      } else {
        type = rng.random() < 0.5 ? GALAXY_TYPE_DWARF_SPHEROIDAL : GALAXY_TYPE_IRREGULAR;
        radius = (2 + rng.random() * 8) * KLY_TO_LY;
        mass = 1e7 + rng.random() * 1e9;
      }

      galaxies.push({
        name: generateProceduralGalaxyName(candX, candY, rng),
        x: candX,
        y: candY,
        radius: radius,
        type: type,
        mass: mass,
        color: {
          r: 200 + Math.floor(rng.random() * 55),
          g: density > 0.7 ? 150 + Math.floor(rng.random() * 50) : 180 + Math.floor(rng.random() * 75),
          b: density > 0.7 ? 100 + Math.floor(rng.random() * 50) : 200 + Math.floor(rng.random() * 55)
        },
        supercluster: supercluster
      });
    }

    return galaxies;
  }

  // ============================================================================
  // Star Map Data Manager
  // ============================================================================

  class StarMapDataManager {
    constructor() {
      this.systems = new Map();
      this.hardcodedSystems = new Set();
      this.currentSystem = "Sol";
      this.proceduralSeed = 12345;
      this.proceduralGenerated = false;
      this.loadSystems();

      this.playerShip = {
        currentSystem: "Sol",
        currentPlanet: null,
        position: null,
        targetSystem: null,
        targetPlanet: null,
        isMoving: false,
        departureTime: null,
        departurePosition: null,
        targetPosition: null,
        travelDistance: 0,
        orbitRadius: 0.5,
      };

      this.initializeShipPosition();
    }

    initializeShipPosition() {
      const sol = this.systems.get("Sol");
      if (sol) {
        this.playerShip.position = { ...sol.position };
      } else {
        this.playerShip.position = { x: 0, y: 0, z: 0 };
      }
    }

    startTravelToSystem(targetSystemName) {
      const targetSystem = this.systems.get(targetSystemName);
      if (!targetSystem) return false;

      this.playerShip.targetSystem = targetSystemName;
      this.playerShip.targetPlanet = null;
      this.playerShip.isMoving = true;
      this.playerShip.departureTime = Date.now();
      this.playerShip.departurePosition = { ...this.playerShip.position };
      this.playerShip.targetPosition = { ...targetSystem.position };

      const dx = this.playerShip.targetPosition.x - this.playerShip.departurePosition.x;
      const dy = this.playerShip.targetPosition.y - this.playerShip.departurePosition.y;
      const dz = this.playerShip.targetPosition.z - this.playerShip.departurePosition.z;
      this.playerShip.travelDistance = Math.sqrt(dx * dx + dy * dy + dz * dz);

      return true;
    }

    startTravelToPlanet(targetSystemName, targetPlanetName) {
      const targetSystem = this.systems.get(targetSystemName);
      if (!targetSystem) return false;

      const planet = targetSystem.planets.find((p) => p.name === targetPlanetName);
      if (!planet) return false;

      this.playerShip.targetSystem = targetSystemName;
      this.playerShip.targetPlanet = targetPlanetName;
      this.playerShip.isMoving = true;
      this.playerShip.departureTime = Date.now();
      this.playerShip.departurePosition = { ...this.playerShip.position };

      const MIN_VISUAL_WORLD_RADIUS = 0.15;
      const RADIUS_SCALE_FACTOR = 0.01;
      const worldRadius = MIN_VISUAL_WORLD_RADIUS + targetSystem.radius * RADIUS_SCALE_FACTOR;
      const MIN_PIXEL_SIZE = 2;
      const starPixelRadius = Math.max(MIN_PIXEL_SIZE, worldRadius);

      const orbitRadiusWorld = planet.orbitRadius || 1;
      const angle = planet.phase || 0;

      const isEccentric = planet.type === "rogue" || planet.type === "comet" ||
                          planet.type === "short_period_comet" || planet.type === "long_period_comet";

      let planetX, planetY;

      if (isEccentric) {
        const eccentricity = 0.6;
        const a = orbitRadiusWorld;
        const b = a * Math.sqrt(1 - eccentricity * eccentricity);
        const c_offset = a * eccentricity;

        planetX = targetSystem.position.x + c_offset + Math.cos(angle) * a;
        planetY = targetSystem.position.y + Math.sin(angle) * b;
      } else {
        planetX = targetSystem.position.x + Math.cos(angle) * orbitRadiusWorld;
        planetY = targetSystem.position.y + Math.sin(angle) * orbitRadiusWorld;
      }

      this.playerShip.targetPosition = {
        x: planetX,
        y: planetY,
        z: targetSystem.position.z,
      };

      const dx = this.playerShip.targetPosition.x - this.playerShip.departurePosition.x;
      const dy = this.playerShip.targetPosition.y - this.playerShip.departurePosition.y;
      const dz = this.playerShip.targetPosition.z - this.playerShip.departurePosition.z;
      this.playerShip.travelDistance = Math.sqrt(dx * dx + dy * dy + dz * dz);

      return true;
    }

    stopTravel(userStopped = true) {
      this.playerShip.isMoving = false;
      this.playerShip.targetSystem = null;
      this.playerShip.targetPlanet = null;
      this.playerShip.departureTime = null;
      this.playerShip.departurePosition = null;
      this.playerShip.targetPosition = null;
      if (userStopped) {
        this.playerShip.stoppedMidTravel = true;
      }
    }

    updateShipPosition() {
      if (!this.playerShip.isMoving || !this.playerShip.departureTime) {
        return;
      }

      const speedMultiplier = $gameVariables.value(94) || 1;
      const currentTime = Date.now();
      const elapsedSeconds = (currentTime - this.playerShip.departureTime) / 1000;

      const baseSpeed = 1;
      const distanceTraveled = elapsedSeconds * baseSpeed * speedMultiplier;
      const maxProgress = 0.95;
      const progress = Math.min(distanceTraveled / this.playerShip.travelDistance, maxProgress);

      const dx = this.playerShip.targetPosition.x - this.playerShip.departurePosition.x;
      const dy = this.playerShip.targetPosition.y - this.playerShip.departurePosition.y;
      const dz = this.playerShip.targetPosition.z - this.playerShip.departurePosition.z;

      this.playerShip.position = {
        x: this.playerShip.departurePosition.x + dx * progress,
        y: this.playerShip.departurePosition.y + dy * progress,
        z: this.playerShip.departurePosition.z + dz * progress,
      };

      const fuelConsumed = elapsedSeconds * speedMultiplier * speedMultiplier * 0.01;
      const currentFuel = $gameVariables.value(95);
      const fuelValue = currentFuel !== null && currentFuel !== undefined ? currentFuel : 10000;
      $gameVariables.setValue(95, Math.max(0, fuelValue - fuelConsumed));

      if (progress >= maxProgress) {
        // Ship has arrived
        this.playerShip.currentSystem = this.playerShip.targetSystem;
        this.currentSystem = this.playerShip.targetSystem;

        if (this.playerShip.targetPlanet) {
          this.playerShip.currentPlanet = this.playerShip.targetPlanet;
        } else {
          this.playerShip.currentPlanet = null;
        }

        this.playerShip.stoppedMidTravel = false;
        $gameVariables.setValue(96, this.playerShip.currentSystem);
        this.stopTravel(false);
      }

      if ($gameVariables.value(95) <= 0) {
        this.stopTravel(true);
      }
    }

    recalculateDepartureOnSpeedChange() {
      if (!this.playerShip.isMoving || !this.playerShip.departureTime) {
        return;
      }

      this.playerShip.departurePosition = {
        x: this.playerShip.position.x,
        y: this.playerShip.position.y,
        z: this.playerShip.position.z,
      };

      this.playerShip.departureTime = Date.now();

      const remainingDx = this.playerShip.targetPosition.x - this.playerShip.position.x;
      const remainingDy = this.playerShip.targetPosition.y - this.playerShip.position.y;
      const remainingDz = this.playerShip.targetPosition.z - this.playerShip.position.z;
      this.playerShip.travelDistance = Math.sqrt(
        remainingDx * remainingDx + remainingDy * remainingDy + remainingDz * remainingDz
      );
    }

    updateShipAtPlanet() {
      // If ship is stationary at a planet, keep it centered on the planet as it moves
      if (this.playerShip.isMoving || !this.playerShip.currentPlanet) {
        return;
      }

      const currentSystem = this.systems.get(this.playerShip.currentSystem);
      if (!currentSystem) return;

      const planet = currentSystem.planets.find((p) => p.name === this.playerShip.currentPlanet);
      if (!planet || !planet.orbitRadius) {
        // If no planet found, center on star
        this.playerShip.position = {
          x: currentSystem.position.x,
          y: currentSystem.position.y,
          z: currentSystem.position.z,
        };
        return;
      }

      // Get the planet's current position
      const time = Date.now() * 0.0001;
      const basePhase = planet.basePhase || 0;
      const planetAngle = basePhase + time * (planet.orbitSpeed || 1);
      const planetOrbitRadius = planet.orbitRadius || 1;

      const isEccentric = planet.type === "rogue" || planet.type === "comet" ||
                          planet.type === "short_period_comet" || planet.type === "long_period_comet";

      let planetX, planetY;

      if (isEccentric) {
        const eccentricity = 0.6;
        const a = planetOrbitRadius;
        const b = a * Math.sqrt(1 - eccentricity * eccentricity);
        const c_offset = a * eccentricity;
        planetX = currentSystem.position.x + c_offset + Math.cos(planetAngle) * a;
        planetY = currentSystem.position.y + Math.sin(planetAngle) * b;
      } else {
        planetX = currentSystem.position.x + Math.cos(planetAngle) * planetOrbitRadius;
        planetY = currentSystem.position.y + Math.sin(planetAngle) * planetOrbitRadius;
      }

      // Update planet's phase for rendering
      planet.phase = planetAngle;

      // Place ship at planet's center (overlay)
      this.playerShip.position = {
        x: planetX,
        y: planetY,
        z: currentSystem.position.z,
      };
    }

    updateShipOrbit() {
      const currentSystem = this.systems.get(this.playerShip.currentSystem);
      if (!currentSystem) return;

      const time = Date.now() * 0.0002;
      const orbitRadius = this.playerShip.orbitRadius;

      if (this.playerShip.currentPlanet) {
        const planet = currentSystem.planets.find((p) => p.name === this.playerShip.currentPlanet);
        if (planet && planet.orbitRadius) {
          const planetAngle = planet.phase || 0;
          const planetOrbitRadius = planet.orbitRadius || 1;

          const isEccentric = planet.type === "rogue" || planet.type === "comet" ||
                              planet.type === "short_period_comet" || planet.type === "long_period_comet";

          let planetX, planetY;

          if (isEccentric) {
            const eccentricity = 0.6;
            const a = planetOrbitRadius;
            const b = a * Math.sqrt(1 - eccentricity * eccentricity);
            const c_offset = a * eccentricity;

            planetX = currentSystem.position.x + c_offset + Math.cos(planetAngle) * a;
            planetY = currentSystem.position.y + Math.sin(planetAngle) * b;
          } else {
            planetX = currentSystem.position.x + Math.cos(planetAngle) * planetOrbitRadius;
            planetY = currentSystem.position.y + Math.sin(planetAngle) * planetOrbitRadius;
          }

          const orbitAngle = time * 4;
          this.playerShip.position = {
            x: planetX + Math.cos(orbitAngle) * orbitRadius,
            y: planetY + Math.sin(orbitAngle) * orbitRadius,
            z: currentSystem.position.z,
          };
        }
      } else {
        const orbitAngle = time;
        this.playerShip.position = {
          x: currentSystem.position.x + Math.cos(orbitAngle) * orbitRadius * 2,
          y: currentSystem.position.y + Math.sin(orbitAngle) * orbitRadius * 2,
          z: currentSystem.position.z,
        };
      }
    }

    getShipPosition() {
      return this.playerShip.position;
    }

    isShipMoving() {
      return this.playerShip.isMoving;
    }

    getTargetSystem() {
      return this.playerShip.targetSystem;
    }

    loadSystems() {
      Object.keys(SYSTEMS).forEach((key) => {
        const systemData = SYSTEMS[key];
        const system = {
          name: systemData.name,
          type: systemData.type,
          color: STAR_COLORS[systemData.type] || "#ffffff",
          position: systemData.position,
          mass: systemData.mass,
          radius: systemData.radius,
          temperature: systemData.temperature,
          luminosity: systemData.luminosity || this.calculateLuminosity(systemData),
          binary: systemData.binary || false,
          hardcoded: true,
          planets: [],
        };

        if (systemData.planets && systemData.planets.length > 0) {
          systemData.planets.forEach((planet, index) => {
            const planetTypeData = PLANET_TYPES[planet.type];

            const newPlanet = {
              name: planet.name || `${system.name} ${String.fromCharCode(65 + index)}`,
              type: planet.type,
              color: PLANET_COLORS[planet.type] || "#888888",
              orbitRadius: planet.orbitRadius,
              radius: planet.radius || 1.0,
              mass: planet.mass,
              period: Math.sqrt(Math.pow(planet.orbitRadius, 3) / system.mass) * 365,
              phase: Math.random() * Math.PI * 2,
              atmosphere: planet.atmosphere !== false,
              moons: [],
            };

            if (planet.moons && planet.moons.length > 0) {
              planet.moons.forEach((moon, moonIndex) => {
                const planetMassInSolar = newPlanet.mass / 333000.0;

                newPlanet.moons.push({
                  name: moon.name || `${newPlanet.name} ${String.fromCharCode(97 + moonIndex)}`,
                  type: moon.type,
                  color: PLANET_COLORS[moon.type] || "#888888",
                  orbitRadius: moon.orbitRadius,
                  radius: moon.radius || 0.27,
                  mass: moon.mass,
                  period: Math.sqrt(Math.pow(moon.orbitRadius, 3) / planetMassInSolar) * 365,
                  phase: Math.random() * Math.PI * 2,
                  atmosphere: moon.atmosphere === true,
                });
              });
            }

            system.planets.push(newPlanet);
          });
        }

        this.systems.set(systemData.name, system);
        this.hardcodedSystems.add(systemData.name);
      });

      console.log(`Loaded ${this.systems.size} hardcoded star systems from GalaxyData`);
    }

    generateProceduralSystems() {
      if (this.proceduralGenerated) {
        console.log("Procedural systems already generated, skipping...");
        return;
      }

      const MOON_INVALID_PLANET_TYPES = new Set([
        "gas_giant", "hot_jupiter", "warm_jupiter", "cold_jupiter", "ice_giant",
        "ringed_gas_giant", "magnetar", "comet", "short_period_comet", "long_period_comet",
        "asteroid", "c_type_asteroid", "s_type_asteroid", "m_type_asteroid", "trojan_asteroid",
      ]);

      const moonTypePool = Object.keys(PLANET_TYPES).filter((type) => !MOON_INVALID_PLANET_TYPES.has(type));
      const rng = new RandomGenerator(this.proceduralSeed);

      const volume = (4 / 3) * Math.PI * Math.pow(MAP_RADIUS, 3);
      const numProceduralSystems = Math.floor(volume * SYSTEM_DENSITY);

      console.log(`Generating ${numProceduralSystems} procedural systems for the first time...`);

      const starTypePool = [];
      Object.keys(STAR_TYPES).forEach((type) => {
        const count = Math.round(STAR_TYPES[type].freq * 1000);
        for (let i = 0; i < count; i++) {
          starTypePool.push(type);
        }
      });

      for (let i = 0; i < numProceduralSystems; i++) {
        const theta = rng.random() * Math.PI * 2;
        const phi = Math.acos(2 * rng.random() - 1);
        const r = Math.pow(rng.random(), 1 / 3) * MAP_RADIUS;

        const x = r * Math.sin(phi) * Math.cos(theta);
        const y = r * Math.sin(phi) * Math.sin(theta);
        const z = r * Math.cos(phi);

        let tooClose = false;
        for (const [name, system] of this.systems) {
          const dx = system.position.x - x;
          const dy = system.position.y - y;
          const dz = (system.position.z || 0) - z;
          const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
          if (dist < 2) {
            tooClose = true;
            break;
          }
        }
        if (tooClose) continue;

        const starType = starTypePool[rng.int(0, starTypePool.length - 1)];
        const starData = STAR_TYPES[starType];

        const mass = rng.range(starData.mass[0], starData.mass[1]);
        const radius = rng.range(starData.radius[0], starData.radius[1]);
        const temperature = rng.range(starData.temp[0], starData.temp[1]);

        const system = {
          name: `${starType}-${i.toString().padStart(4, "0")}`,
          type: starType,
          color: STAR_COLORS[starType],
          position: { x, y, z },
          mass: mass,
          radius: radius,
          temperature: temperature,
          luminosity: this.calculateLuminosity({ mass, radius }),
          binary: rng.random() < 0.3,
          hardcoded: false,
          planets: [],
        };

        if (rng.random() < 0.3) {
          const numPlanets = rng.int(1, 8);
          const planetTypes = Object.keys(PLANET_TYPES);

          for (let p = 0; p < numPlanets; p++) {
            const planetType = planetTypes[rng.int(0, planetTypes.length - 1)];
            const planetData = PLANET_TYPES[planetType];

            const planet = {
              name: `${system.name} ${String.fromCharCode(97 + p)}`,
              type: planetType,
              color: PLANET_COLORS[planetType] || "#888888",
              orbitRadius: rng.range(0.1, 10) * (p + 1) * 0.4,
              radius: rng.range(0.5, 3),
              mass: rng.range(planetData.minMass, planetData.maxMass),
              period: 0,
              phase: rng.random() * Math.PI * 2,
              atmosphere: rng.random() < 0.5,
              moons: [],
            };

            planet.period = Math.sqrt(Math.pow(planet.orbitRadius, 3) / system.mass) * 365;

            const moonChance = 0.1 + planet.mass / 20.0;

            if (rng.random() < moonChance && moonTypePool.length > 0) {
              const numMoons = rng.int(1, 4);
              let lastMoonOrbit = rng.range(0.001, 0.003);

              for (let m = 0; m < numMoons; m++) {
                const moonType = moonTypePool[rng.int(0, moonTypePool.length - 1)];
                const moonData = PLANET_TYPES[moonType];

                const moonOrbitRadius = lastMoonOrbit + rng.range(0.001, 0.004);
                lastMoonOrbit = moonOrbitRadius;

                const moonMass = rng.range(moonData.minMass, moonData.maxMass) * 0.05;
                const moonRadius = rng.range(0.1, 0.4);
                const planetMassInSolar = planet.mass / 333000.0;

                const moon = {
                  name: `${planet.name} ${String.fromCharCode(97 + m)}`,
                  type: moonType,
                  color: PLANET_COLORS[moonType] || "#888888",
                  orbitRadius: moonOrbitRadius,
                  radius: moonRadius,
                  mass: moonMass,
                  period: Math.sqrt(Math.pow(moonOrbitRadius, 3) / planetMassInSolar) * 365,
                  phase: rng.random() * Math.PI * 2,
                  atmosphere: false,
                };
                planet.moons.push(moon);
              }
            }

            system.planets.push(planet);
          }
        }

        this.systems.set(system.name, system);
      }

      this.proceduralGenerated = true;
      console.log(`Total systems: ${this.systems.size} (${this.hardcodedSystems.size} hardcoded, ${this.systems.size - this.hardcodedSystems.size} procedural)`);
    }

    generateSingleProceduralSystem(x, y, z, name, rng) {
      const MOON_INVALID_PLANET_TYPES = new Set([
        "gas_giant", "hot_jupiter", "warm_jupiter", "cold_jupiter", "ice_giant",
        "ringed_gas_giant", "magnetar", "comet", "short_period_comet", "long_period_comet",
        "asteroid", "c_type_asteroid", "s_type_asteroid", "m_type_asteroid", "trojan_asteroid",
      ]);

      const moonTypePool = Object.keys(PLANET_TYPES).filter((type) => !MOON_INVALID_PLANET_TYPES.has(type));

      const starTypePool = [];
      Object.keys(STAR_TYPES).forEach((type) => {
        const count = Math.round(STAR_TYPES[type].freq * 1000);
        for (let i = 0; i < count; i++) {
          starTypePool.push(type);
        }
      });

      const starType = starTypePool[rng.int(0, starTypePool.length - 1)];
      const starData = STAR_TYPES[starType];

      const mass = rng.range(starData.mass[0], starData.mass[1]);
      const radius = rng.range(starData.radius[0], starData.radius[1]);
      const temperature = rng.range(starData.temp[0], starData.temp[1]);

      const system = {
        name: name,
        type: starType,
        color: STAR_COLORS[starType],
        position: { x, y, z },
        mass: mass,
        radius: radius,
        temperature: temperature,
        luminosity: this.calculateLuminosity({ mass, radius }),
        binary: rng.random() < 0.3,
        hardcoded: false,
        planets: [],
      };

      if (rng.random() < 0.3) {
        const numPlanets = rng.int(1, 8);
        const planetTypes = Object.keys(PLANET_TYPES);

        for (let p = 0; p < numPlanets; p++) {
          const planetType = planetTypes[rng.int(0, planetTypes.length - 1)];
          const planetData = PLANET_TYPES[planetType];

          const planet = {
            name: `${system.name} ${String.fromCharCode(98 + p)}`,
            type: planetType,
            color: PLANET_COLORS[planetType] || "#888888",
            orbitRadius: rng.range(0.1, 10) * (p + 1) * 0.4,
            radius: rng.range(0.5, 3),
            mass: rng.range(planetData.minMass, planetData.maxMass),
            period: 0,
            phase: rng.random() * Math.PI * 2,
            atmosphere: rng.random() < 0.5,
            moons: [],
          };

          planet.period = Math.sqrt(Math.pow(planet.orbitRadius, 3) / system.mass) * 365;

          const moonChance = 0.1 + planet.mass / 20.0;

          if (rng.random() < moonChance && moonTypePool.length > 0) {
            const numMoons = rng.int(1, 4);
            let lastMoonOrbit = rng.range(0.001, 0.003);

            for (let m = 0; m < numMoons; m++) {
              const moonType = moonTypePool[rng.int(0, moonTypePool.length - 1)];
              const moonData = PLANET_TYPES[moonType];

              const moonOrbitRadius = lastMoonOrbit + rng.range(0.001, 0.004);
              lastMoonOrbit = moonOrbitRadius;

              const moonMass = rng.range(moonData.minMass, moonData.maxMass) * 0.05;
              const moonRadius = rng.range(0.1, 0.4);
              const planetMassInSolar = planet.mass / 333000.0;

              const moon = {
                name: `${planet.name} ${String.fromCharCode(97 + m)}`,
                type: moonType,
                color: PLANET_COLORS[moonType] || "#888888",
                orbitRadius: moonOrbitRadius,
                radius: moonRadius,
                mass: moonMass,
                period: Math.sqrt(Math.pow(moonOrbitRadius, 3) / planetMassInSolar) * 365,
                phase: rng.random() * Math.PI * 2,
                atmosphere: false,
              };
              planet.moons.push(moon);
            }
          }

          system.planets.push(planet);
        }
      }

      return system;
    }

    toJSON() {
      const data = {
        currentSystem: this.currentSystem,
        proceduralSeed: this.proceduralSeed,
        playerShip: this.playerShip,
      };
      console.log("StarMapDataManager.toJSON: Saving data", data);
      return data;
    }

    fromJSON(data) {
      if (!data) {
        console.log("StarMapDataManager.fromJSON: No save data provided");
        return;
      }

      console.log("StarMapDataManager.fromJSON: Loading save data", data);

      this.currentSystem = data.currentSystem || "Sol";
      this.proceduralSeed = data.proceduralSeed || 12345;

      if (data.playerShip) {
        this.playerShip = {
          ...this.playerShip,
          ...data.playerShip,
        };
        console.log("StarMapDataManager.fromJSON: Loaded playerShip", this.playerShip);
      }

      this.proceduralGenerated = false;
      console.log("StarMapDataManager.fromJSON: Restoration complete");
    }

    calculateLuminosity(systemData) {
      const M = systemData.mass || 1;
      const R = systemData.radius || 1;
      return Math.pow(M, 3.5) * Math.pow(R, 2) * 0.001;
    }

    getSystem(name) {
      return this.systems.get(name);
    }

    getAllSystems() {
      return Array.from(this.systems.values());
    }

    getSystemsInRadius(centerX, centerY, radius) {
      return this.getAllSystems().filter((system) => {
        const dx = system.position.x - centerX;
        const dy = system.position.y - centerY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        return dist <= radius;
      });
    }

    setCurrentSystem(name) {
      if (this.systems.has(name)) {
        this.currentSystem = name;
        console.log(`Current system set to: ${name}`);
      }
    }
  }

  // ============================================================================
  // Export to namespace
  // ============================================================================

  window.GalaxySim.DataManager = StarMapDataManager;
  window.GalaxySim.NameGenerators = {
    generateProceduralGalaxyName,
    generateProceduralSuperclusterName,
    generateGalaxyGroupName,
    generateSuperclusterName,
    generateProceduralLocalGroup,
  };

})();

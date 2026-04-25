/*:
 * @target MZ
 * @plugindesc Complex Apiary System v1.0.0
 * @author Omni-Lex
 * @help
 * ============================================================================
 * Complex Apiary Plugin for RPG Maker MZ
 * ============================================================================
 * 
 * This plugin simulates a complex bee colony with:
 * - Multiple bee castes (Queen, Workers, Nurses, Guards, Foragers, Drones)
 * - Full lifecycle simulation (Egg -> Larva -> Pupa -> Adult -> Death)
 * - Hexagonal comb display
 * - Resource management (honey, pollen, royal jelly, wax)
 * - Seasonal effects and weather impacts
 * - Disease and pest management
 * - Colony moods and efficiency factors
 * 
 * @param honeyItemId
 * @text Honey Item ID
 * @type number
 * @default 345
 * @desc The item ID for honey in your database
 * 
 * @command openApiary
 * @text Open Apiary
 * @desc Opens the apiary interface
 * 
 * @command simulateTime
 * @text Simulate Time
 * @desc Simulates time passage for the apiary
 * 
 */

(() => {
    'use strict';
    
    const HONEY_ITEM_ID = 345;
    
    // Bee lifecycle stages
    const LifeStage = {
        EGG: 'egg',
        LARVA: 'larva',
        PUPA: 'pupa',
        ADULT: 'adult'
    };
    
    // Bee castes
    const BeeType = {
        QUEEN: 'queen',
        WORKER: 'worker',
        NURSE: 'nurse',
        GUARD: 'guard',
        FORAGER: 'forager',
        DRONE: 'drone',
        BUILDER: 'builder',
        SCOUT: 'scout'
    };
    
    // Colony states
    const ColonyState = {
        THRIVING: 'thriving',
        STABLE: 'stable',
        STRUGGLING: 'struggling',
        SWARMING: 'swarming',
        SUPERSEDURE: 'supersedure',
        DORMANT: 'dormant'
    };
    
    // Diseases and pests
    const Threats = {
        VARROA: 'varroa',
        NOSEMA: 'nosema',
        FOULBROOD: 'foulbrood',
        WAXMOTH: 'waxmoth',
        WASPS: 'wasps',
        BEARS: 'bears'
    };
    
    class Bee {
        constructor(type, age = 0) {
            this.id = Math.random().toString(36).substr(2, 9);
            this.type = type;
            this.age = age;
            this.stage = LifeStage.EGG;
            this.health = 100;
            this.productivity = Math.random() * 50 + 50;
            this.experience = 0;
            this.genetics = this.generateGenetics();
            this.tasks = [];
            this.infections = [];
            this.mated = false;
            this.eggsLaid = 0;
            this.pollenCarrying = 0;
            this.nectarCarrying = 0;
        }
        
        generateGenetics() {
            return {
                productivity: Math.random() * 0.4 + 0.8,
                disease_resistance: Math.random() * 0.4 + 0.8,
                longevity: Math.random() * 0.4 + 0.8,
                foraging: Math.random() * 0.4 + 0.8,
                aggression: Math.random() * 0.4 + 0.8,
                cold_tolerance: Math.random() * 0.4 + 0.8
            };
        }
        
        getLifespan() {
            const baseLifespan = {
                [BeeType.QUEEN]: 1460,
                [BeeType.WORKER]: 42,
                [BeeType.DRONE]: 55,
                [BeeType.NURSE]: 42,
                [BeeType.GUARD]: 42,
                [BeeType.FORAGER]: 35,
                [BeeType.BUILDER]: 45,
                [BeeType.SCOUT]: 38
            };
            return baseLifespan[this.type] * this.genetics.longevity;
        }
        
        getEmoji() {
            if (this.stage === LifeStage.EGG) return '⚪';
            if (this.stage === LifeStage.LARVA) return '🐛';
            if (this.stage === LifeStage.PUPA) return '🪱';
            if (this.type === BeeType.QUEEN) return '👸';
            if (this.type === BeeType.DRONE) return '🐝';
            return '🐝';
        }
    }
    
    class HexCell {
        constructor(q, r) {
            this.q = q;
            this.r = r;
            this.s = -q - r;
            this.content = null;
            this.waxAge = 0;
            this.honey = 0;
            this.pollen = 0;
            this.royalJelly = 0;
            this.capped = false;
            this.temperature = 35;
        }
    }
    
    class ApiaryComplex {
        constructor() {
            this.initialized = false;
            this.lastUpdate = Date.now();
            this.colony = {
                queen: null,
                bees: [],
                cells: new Map(),
                resources: {
                    honey: 100,
                    pollen: 50,
                    royalJelly: 10,
                    wax: 30,
                    propolis: 5,
                    water: 100
                },
                population: {
                    eggs: 0,
                    larvae: 0,
                    pupae: 0,
                    workers: 0,
                    nurses: 0,
                    guards: 0,
                    foragers: 0,
                    drones: 0,
                    builders: 0,
                    scouts: 0
                },
                stats: {
                    totalBees: 0,
                    births: 0,
                    deaths: 0,
                    honeyProduced: 0,
                    honeyConsumed: 0,
                    pollenCollected: 0,
                    enemiesRepelled: 0,
                    diseasesOvercome: 0,
                    swarms: 0,
                    age: 0
                },
                environment: {
                    temperature: 20,
                    humidity: 60,
                    season: 'spring',
                    weather: 'sunny',
                    flowers: 100,
                    threats: []
                },
                state: ColonyState.STABLE,
                mood: 50,
                efficiency: 1.0,
                genetics: {
                    strain: 'italian',
                    traits: {
                        productivity: 1.0,
                        gentleness: 0.8,
                        disease_resistance: 0.7,
                        swarming_tendency: 0.5
                    }
                }
            };
            
            this.hexRadius = 5;
            this.initializeColony();
        }
        
        initializeColony() {
            // Create hexagonal comb structure
            for (let q = -this.hexRadius; q <= this.hexRadius; q++) {
                for (let r = Math.max(-this.hexRadius, -q - this.hexRadius); 
                     r <= Math.min(this.hexRadius, -q + this.hexRadius); r++) {
                    const cell = new HexCell(q, r);
                    this.colony.cells.set(`${q},${r}`, cell);
                }
            }
            
            // Create initial queen
            this.colony.queen = new Bee(BeeType.QUEEN, 100);
            this.colony.queen.stage = LifeStage.ADULT;
            this.colony.queen.mated = true;
            this.colony.queen.health = 100;
            
            // Create initial worker population
            for (let i = 0; i < 20; i++) {
                const worker = new Bee(BeeType.WORKER, 20);
                worker.stage = LifeStage.ADULT;
                this.colony.bees.push(worker);
            }
            
            // Create initial nurses
            for (let i = 0; i < 10; i++) {
                const nurse = new Bee(BeeType.NURSE, 15);
                nurse.stage = LifeStage.ADULT;
                this.colony.bees.push(nurse);
            }
            
            // Create initial guards
            for (let i = 0; i < 5; i++) {
                const guard = new Bee(BeeType.GUARD, 25);
                guard.stage = LifeStage.ADULT;
                this.colony.bees.push(guard);
            }
            
            this.updatePopulationCount();
            this.initialized = true;
        }
        
        simulateTimeStep(hours = 1) {
            const steps = Math.floor(hours);
            
            for (let i = 0; i < steps; i++) {
                this.updateEnvironment();
                this.queenActivity();
                this.beeDevelopment();
                this.beeActivities();
                this.resourceManagement();
                this.threatManagement();
                this.colonyDynamics();
                this.updateColonyState();
                
                this.colony.stats.age++;
            }
            
            this.updatePopulationCount();
            return this.generateReport(hours);
        }
        
        updateEnvironment() {
            // Simulate day/night cycle
            const hour = this.colony.stats.age % 24;
            const isDay = hour >= 6 && hour <= 18;
            
            // Temperature fluctuation
            if (isDay) {
                this.colony.environment.temperature = 20 + Math.random() * 10;
            } else {
                this.colony.environment.temperature = 10 + Math.random() * 5;
            }
            
            // Seasonal changes
            const day = Math.floor(this.colony.stats.age / 24);
            if (day % 90 === 0) {
                const seasons = ['spring', 'summer', 'autumn', 'winter'];
                const currentIndex = seasons.indexOf(this.colony.environment.season);
                this.colony.environment.season = seasons[(currentIndex + 1) % 4];
            }
            
            // Weather changes
            if (Math.random() < 0.1) {
                const weatherTypes = ['sunny', 'cloudy', 'rainy', 'stormy', 'windy'];
                this.colony.environment.weather = weatherTypes[Math.floor(Math.random() * weatherTypes.length)];
            }
            
            // Flower availability
            const seasonModifier = {
                spring: 1.2,
                summer: 1.5,
                autumn: 0.8,
                winter: 0.1
            };
            this.colony.environment.flowers = 100 * seasonModifier[this.colony.environment.season] * 
                                              (this.colony.environment.weather === 'sunny' ? 1.2 : 0.8);
        }
        
        queenActivity() {
            if (!this.colony.queen || this.colony.queen.health <= 0) {
                this.raiseNewQueen();
                return;
            }
            
            const queen = this.colony.queen;
            queen.age++;
            
            // Queen egg laying
            if (queen.mated && queen.health > 30) {
                const season = this.colony.environment.season;
                const baseEggRate = {
                    spring: 2000,
                    summer: 1500,
                    autumn: 500,
                    winter: 50
                };
                
                const dailyEggs = baseEggRate[season] * 
                                 (queen.health / 100) * 
                                 queen.genetics.productivity *
                                 this.colony.efficiency;
                
                const eggsThisHour = Math.floor(dailyEggs / 24);
                
                for (let i = 0; i < eggsThisHour; i++) {
                    if (this.colony.resources.royalJelly > 0.1) {
                        const newBee = new Bee(this.decideBeeType(), 0);
                        this.colony.bees.push(newBee);
                        queen.eggsLaid++;
                        this.colony.stats.births++;
                        this.colony.resources.royalJelly -= 0.05;
                    }
                }
            }
            
            // Queen health management
            if (queen.age > queen.getLifespan() * 0.8) {
                queen.health -= 0.5;
            }
            
            // Pheromone production
            this.colony.mood = Math.min(100, this.colony.mood + (queen.health / 100) * 2);
        }
        
        decideBeeType() {
            const needs = this.analyzeColonyNeeds();
            const rand = Math.random();
            
            if (needs.needDrones && rand < 0.05) return BeeType.DRONE;
            if (needs.needNurses && rand < 0.3) return BeeType.NURSE;
            if (needs.needGuards && rand < 0.1) return BeeType.GUARD;
            if (needs.needBuilders && rand < 0.15) return BeeType.BUILDER;
            if (needs.needScouts && rand < 0.05) return BeeType.SCOUT;
            if (needs.needForagers && rand < 0.3) return BeeType.FORAGER;
            
            return BeeType.WORKER;
        }
        
        analyzeColonyNeeds() {
            const total = this.colony.stats.totalBees;
            const ratios = {
                nurses: this.colony.population.nurses / total,
                guards: this.colony.population.guards / total,
                foragers: this.colony.population.foragers / total,
                builders: this.colony.population.builders / total,
                scouts: this.colony.population.scouts / total,
                drones: this.colony.population.drones / total
            };
            
            return {
                needNurses: ratios.nurses < 0.2,
                needGuards: ratios.guards < 0.05,
                needForagers: ratios.foragers < 0.3,
                needBuilders: ratios.builders < 0.1,
                needScouts: ratios.scouts < 0.02,
                needDrones: this.colony.environment.season === 'spring' && ratios.drones < 0.05
            };
        }
        
        beeDevelopment() {
            const beesToRemove = [];
            
            for (let bee of this.colony.bees) {
                bee.age++;
                
                // Stage progression
                if (bee.stage === LifeStage.EGG && bee.age >= 3) {
                    bee.stage = LifeStage.LARVA;
                } else if (bee.stage === LifeStage.LARVA && bee.age >= 9) {
                    bee.stage = LifeStage.PUPA;
                } else if (bee.stage === LifeStage.PUPA && bee.age >= 21) {
                    bee.stage = LifeStage.ADULT;
                    bee.experience = 0;
                }
                
                // Adult bee role transitions
                if (bee.stage === LifeStage.ADULT && bee.type === BeeType.WORKER) {
                    if (bee.age < 25) {
                        bee.type = BeeType.NURSE;
                    } else if (bee.age < 35) {
                        bee.type = BeeType.BUILDER;
                    } else if (bee.age < 40) {
                        bee.type = BeeType.GUARD;
                    } else {
                        bee.type = BeeType.FORAGER;
                    }
                }
                
                // Health decay
                if (bee.stage === LifeStage.ADULT) {
                    const ageRatio = bee.age / bee.getLifespan();
                    if (ageRatio > 0.8) {
                        bee.health -= 2 + Math.random() * 3;
                    } else if (ageRatio > 0.5) {
                        bee.health -= 0.5 + Math.random();
                    }
                    
                    // Environmental stress
                    if (this.colony.environment.temperature < 10) {
                        bee.health -= (10 - this.colony.environment.temperature) * 0.1;
                    }
                    if (this.colony.environment.temperature > 35) {
                        bee.health -= (this.colony.environment.temperature - 35) * 0.2;
                    }
                }
                
                // Death
                if (bee.health <= 0 || bee.age > bee.getLifespan()) {
                    beesToRemove.push(bee);
                    this.colony.stats.deaths++;
                }
            }
            
            // Remove dead bees
            this.colony.bees = this.colony.bees.filter(bee => !beesToRemove.includes(bee));
        }
        
        beeActivities() {
            for (let bee of this.colony.bees) {
                if (bee.stage !== LifeStage.ADULT) continue;
                
                switch (bee.type) {
                    case BeeType.FORAGER:
                        this.forageActivity(bee);
                        break;
                    case BeeType.NURSE:
                        this.nurseActivity(bee);
                        break;
                    case BeeType.GUARD:
                        this.guardActivity(bee);
                        break;
                    case BeeType.BUILDER:
                        this.builderActivity(bee);
                        break;
                    case BeeType.SCOUT:
                        this.scoutActivity(bee);
                        break;
                    case BeeType.DRONE:
                        this.droneActivity(bee);
                        break;
                }
                
                bee.experience += 0.1;
            }
        }
        
        forageActivity(bee) {
            if (this.colony.environment.weather === 'rainy' || 
                this.colony.environment.weather === 'stormy') return;
            
            const forageSuccess = Math.random() * bee.genetics.foraging * 
                                 (this.colony.environment.flowers / 100);
            
            if (forageSuccess > 0.5) {
                const nectarCollected = Math.random() * 5 * bee.genetics.productivity;
                const pollenCollected = Math.random() * 3 * bee.genetics.productivity;
                
                this.colony.resources.honey += nectarCollected * 0.3; // Nectar to honey conversion
                this.colony.resources.pollen += pollenCollected;
                this.colony.stats.honeyProduced += nectarCollected * 0.3;
                this.colony.stats.pollenCollected += pollenCollected;
                
                bee.nectarCarrying = nectarCollected;
                bee.pollenCarrying = pollenCollected;
            }
            
            // Risk of getting lost or eaten
            if (Math.random() < 0.001) {
                bee.health = 0;
            }
        }
        
        nurseActivity(bee) {
            // Feed larvae
            const larvae = this.colony.bees.filter(b => b.stage === LifeStage.LARVA);
            if (larvae.length > 0 && this.colony.resources.honey > 0) {
                const fedLarvae = Math.min(5, larvae.length);
                this.colony.resources.honey -= fedLarvae * 0.1;
                this.colony.resources.royalJelly += 0.01 * bee.genetics.productivity;
                
                for (let i = 0; i < fedLarvae; i++) {
                    larvae[i].health = Math.min(100, larvae[i].health + 5);
                }
            }
            
            // Temperature regulation
            this.colony.cells.forEach(cell => {
                if (cell.content && cell.content.stage === LifeStage.LARVA) {
                    cell.temperature = 35; // Optimal brood temperature
                }
            });
        }
        
        guardActivity(bee) {
            // Check for threats
            if (this.colony.environment.threats.length > 0) {
                const threat = this.colony.environment.threats[0];
                const defenseSuccess = Math.random() * bee.genetics.aggression;
                
                if (defenseSuccess > 0.6) {
                    this.colony.environment.threats.shift();
                    this.colony.stats.enemiesRepelled++;
                    bee.health -= 10; // Combat damage
                }
            }
            
            // Patrol behavior increases colony security
            this.colony.mood = Math.min(100, this.colony.mood + 0.1);
        }
        
        builderActivity(bee) {
            // Build new comb
            if (this.colony.resources.wax > 1) {
                this.colony.resources.wax -= 0.1;
                
                // Find empty cell to build
                this.colony.cells.forEach(cell => {
                    if (!cell.content && Math.random() < 0.01) {
                        cell.waxAge = 0;
                        cell.content = 'empty';
                    }
                });
            }
            
            // Produce wax
            if (this.colony.resources.honey > 1) {
                this.colony.resources.honey -= 0.05;
                this.colony.resources.wax += 0.01 * bee.genetics.productivity;
            }
        }
        
        scoutActivity(bee) {
            // Scout for new flower sources
            const scoutSuccess = Math.random() * bee.experience / 10;
            if (scoutSuccess > 0.8) {
                this.colony.environment.flowers += 10;
            }
            
            // Check for swarming conditions
            if (this.colony.stats.totalBees > 60000 && 
                this.colony.environment.season === 'spring') {
                this.colony.state = ColonyState.SWARMING;
            }
        }
        
        droneActivity(bee) {
            // Drones mainly consume resources
            this.colony.resources.honey -= 0.02;
            
            // Mating flights
            if (this.colony.environment.season === 'spring' && 
                this.colony.environment.weather === 'sunny' &&
                !bee.mated) {
                if (Math.random() < 0.01) {
                    bee.mated = true;
                    bee.health = 0; // Drones die after mating
                }
            }
        }
        
        resourceManagement() {
            // Resource consumption
            const totalBees = this.colony.stats.totalBees;
            const baseConsumption = totalBees * 0.001;
            
            this.colony.resources.honey -= baseConsumption;
            this.colony.resources.pollen -= baseConsumption * 0.5;
            this.colony.stats.honeyConsumed += baseConsumption;
            
            // Water collection (automatic)
            if (this.colony.environment.weather === 'rainy') {
                this.colony.resources.water = 100;
            } else {
                this.colony.resources.water -= totalBees * 0.0001;
                this.colony.resources.water = Math.max(0, this.colony.resources.water);
            }
            
            // Propolis production
            if (Math.random() < 0.1) {
                this.colony.resources.propolis += 0.1;
            }
            
            // Resource caps
            this.colony.resources.honey = Math.max(0, this.colony.resources.honey);
            this.colony.resources.pollen = Math.max(0, this.colony.resources.pollen);
            this.colony.resources.royalJelly = Math.max(0, this.colony.resources.royalJelly);
            this.colony.resources.wax = Math.max(0, this.colony.resources.wax);
        }
        
        threatManagement() {
            // Random threat generation
            if (Math.random() < 0.01) {
                const threatTypes = Object.values(Threats);
                const newThreat = threatTypes[Math.floor(Math.random() * threatTypes.length)];
                this.colony.environment.threats.push(newThreat);
            }
            
            // Process existing threats
            for (let threat of this.colony.environment.threats) {
                switch (threat) {
                    case Threats.VARROA:
                        // Infect random bees
                        const targetBee = this.colony.bees[Math.floor(Math.random() * this.colony.bees.length)];
                        if (targetBee) {
                            targetBee.health -= 5;
                            targetBee.infections.push(Threats.VARROA);
                        }
                        break;
                        
                    case Threats.WAXMOTH:
                        // Damage comb
                        this.colony.resources.wax -= 1;
                        break;
                        
                    case Threats.WASPS:
                        // Kill bees and steal honey
                        if (this.colony.bees.length > 0) {
                            const victim = Math.floor(Math.random() * this.colony.bees.length);
                            this.colony.bees[victim].health -= 50;
                        }
                        this.colony.resources.honey -= 5;
                        break;
                }
            }
            
            // Natural threat resolution
            this.colony.environment.threats = this.colony.environment.threats.filter(() => Math.random() > 0.1);
        }
        
        colonyDynamics() {
            // Calculate colony efficiency
            const factors = {
                queenHealth: this.colony.queen ? this.colony.queen.health / 100 : 0,
                resources: Math.min(1, this.colony.resources.honey / 100),
                temperature: 1 - Math.abs(this.colony.environment.temperature - 25) / 25,
                threats: Math.max(0.5, 1 - this.colony.environment.threats.length * 0.1),
                mood: this.colony.mood / 100
            };
            
            this.colony.efficiency = Object.values(factors).reduce((a, b) => a * b, 1);
            
            // Swarming behavior
            if (this.colony.state === ColonyState.SWARMING) {
                this.performSwarm();
            }
            
            // Supersedure (replace failing queen)
            if (this.colony.queen && this.colony.queen.health < 20) {
                this.colony.state = ColonyState.SUPERSEDURE;
                this.raiseNewQueen();
            }
        }
        
        performSwarm() {
            // Half the colony leaves with the old queen
            const leavingBees = Math.floor(this.colony.bees.length / 2);
            this.colony.bees = this.colony.bees.slice(leavingBees);
            
            // Resources are split
            this.colony.resources.honey /= 2;
            this.colony.resources.pollen /= 2;
            
            // Raise new queen
            this.raiseNewQueen();
            
            this.colony.stats.swarms++;
            this.colony.state = ColonyState.STABLE;
        }
        
        raiseNewQueen() {
            // Find suitable larvae
            const larvae = this.colony.bees.filter(b => 
                b.stage === LifeStage.LARVA && b.age < 3
            );
            
            if (larvae.length > 0) {
                // Convert larva to queen
                const chosenLarva = larvae[0];
                chosenLarva.type = BeeType.QUEEN;
                chosenLarva.genetics.productivity *= 1.5;
                chosenLarva.genetics.longevity *= 2;
                
                // Remove old queen if superseding
                if (this.colony.queen && this.colony.state === ColonyState.SUPERSEDURE) {
                    this.colony.queen = null;
                }
                
                // Wait for new queen to mature
                // (This is simplified - in reality would take time)
                if (chosenLarva.stage === LifeStage.ADULT) {
                    this.colony.queen = chosenLarva;
                    this.colony.bees = this.colony.bees.filter(b => b !== chosenLarva);
                }
            }
        }
        
        updateColonyState() {
            const totalBees = this.colony.stats.totalBees;
            
            if (totalBees < 1000) {
                this.colony.state = ColonyState.STRUGGLING;
            } else if (totalBees < 10000) {
                this.colony.state = ColonyState.STABLE;
            } else if (totalBees > 50000) {
                this.colony.state = ColonyState.THRIVING;
            }
            
            if (this.colony.environment.season === 'winter') {
                this.colony.state = ColonyState.DORMANT;
            }
        }
        
        updatePopulationCount() {
            // Reset counts
            Object.keys(this.colony.population).forEach(key => {
                this.colony.population[key] = 0;
            });
            
            // Count bees by type and stage
            for (let bee of this.colony.bees) {
                if (bee.stage === LifeStage.EGG) {
                    this.colony.population.eggs++;
                } else if (bee.stage === LifeStage.LARVA) {
                    this.colony.population.larvae++;
                } else if (bee.stage === LifeStage.PUPA) {
                    this.colony.population.pupae++;
                } else if (bee.stage === LifeStage.ADULT) {
                    switch (bee.type) {
                        case BeeType.WORKER:
                            this.colony.population.workers++;
                            break;
                        case BeeType.NURSE:
                            this.colony.population.nurses++;
                            break;
                        case BeeType.GUARD:
                            this.colony.population.guards++;
                            break;
                        case BeeType.FORAGER:
                            this.colony.population.foragers++;
                            break;
                        case BeeType.DRONE:
                            this.colony.population.drones++;
                            break;
                        case BeeType.BUILDER:
                            this.colony.population.builders++;
                            break;
                        case BeeType.SCOUT:
                            this.colony.population.scouts++;
                            break;
                    }
                }
            }
            
            this.colony.stats.totalBees = this.colony.bees.length + 
                                          (this.colony.queen ? 1 : 0);
        }
        
        generateReport(hours) {
            const report = {
                timeElapsed: hours,
                colony: {
                    state: this.colony.state,
                    mood: Math.floor(this.colony.mood),
                    efficiency: Math.floor(this.colony.efficiency * 100),
                    age: this.colony.stats.age
                },
                queen: {
                    alive: !!this.colony.queen,
                    health: this.colony.queen ? Math.floor(this.colony.queen.health) : 0,
                    age: this.colony.queen ? this.colony.queen.age : 0,
                    eggsLaid: this.colony.queen ? this.colony.queen.eggsLaid : 0
                },
                population: {
                    total: this.colony.stats.totalBees,
                    eggs: this.colony.population.eggs,
                    larvae: this.colony.population.larvae,
                    pupae: this.colony.population.pupae,
                    adults: {
                        workers: this.colony.population.workers,
                        nurses: this.colony.population.nurses,
                        guards: this.colony.population.guards,
                        foragers: this.colony.population.foragers,
                        drones: this.colony.population.drones,
                        builders: this.colony.population.builders,
                        scouts: this.colony.population.scouts
                    }
                },
                resources: {
                    honey: Math.floor(this.colony.resources.honey),
                    pollen: Math.floor(this.colony.resources.pollen),
                    royalJelly: Math.floor(this.colony.resources.royalJelly * 10) / 10,
                    wax: Math.floor(this.colony.resources.wax),
                    propolis: Math.floor(this.colony.resources.propolis * 10) / 10,
                    water: Math.floor(this.colony.resources.water)
                },
                environment: {
                    season: this.colony.environment.season,
                    weather: this.colony.environment.weather,
                    temperature: Math.floor(this.colony.environment.temperature),
                    flowers: Math.floor(this.colony.environment.flowers),
                    threats: this.colony.environment.threats
                },
                statistics: {
                    births: this.colony.stats.births,
                    deaths: this.colony.stats.deaths,
                    honeyProduced: Math.floor(this.colony.stats.honeyProduced),
                    honeyConsumed: Math.floor(this.colony.stats.honeyConsumed),
                    pollenCollected: Math.floor(this.colony.stats.pollenCollected),
                    enemiesRepelled: this.colony.stats.enemiesRepelled,
                    swarms: this.colony.stats.swarms
                }
            };
            
            return report;
        }
        
        harvestHoney() {
            const harvestable = Math.floor(this.colony.resources.honey * 0.7); // Keep 30% for bees
            if (harvestable > 0) {
                this.colony.resources.honey -= harvestable;
                $gameParty.gainItem($dataItems[HONEY_ITEM_ID], Math.floor(harvestable / 10));
                return harvestable;
            }
            return 0;
        }
    }
    
    class Scene_Apiary extends Scene_Base {
        create() {
            super.create();
            this.createBackground();
            this.createApiaryDisplay();
            this.createInfoWindows();
            this.createCommandWindow();
        }
        
        createBackground() {
            this._backgroundSprite = new Sprite();
            this._backgroundSprite.bitmap = new Bitmap(Graphics.width, Graphics.height);
            this._backgroundSprite.bitmap.fillAll('rgba(139, 69, 19, 0.7)');
            this.addChild(this._backgroundSprite);
        }
        
        createApiaryDisplay() {
            this._apiarySprite = new Sprite();
            this._apiarySprite.bitmap = new Bitmap(Graphics.width, Graphics.height);
            this._apiarySprite.x = Graphics.width / 2;
            this._apiarySprite.y = Graphics.height / 2;
            this.addChild(this._apiarySprite);
            
            this.drawHexagonalGrid();
            this.drawBees();
        }
        
        drawHexagonalGrid() {
            const hexSize = 20;
            const apiary = $gameSystem.apiaryComplex;
            
            if (!apiary) return;
            
            const bitmap = this._apiarySprite.bitmap;
            
            apiary.colony.cells.forEach((cell, key) => {
                const [q, r] = key.split(',').map(Number);
                const x = hexSize * (Math.sqrt(3) * q + Math.sqrt(3)/2 * r);
                const y = hexSize * (3/2 * r);
                
                this.drawHexagon(bitmap, x + Graphics.width/2, y + Graphics.height/2, hexSize, cell);
            });
        }
        
        drawHexagon(bitmap, x, y, size, cell) {
            const points = [];
            for (let i = 0; i < 6; i++) {
                const angle = (Math.PI / 3) * i;
                points.push({
                    x: x + size * Math.cos(angle),
                    y: y + size * Math.sin(angle)
                });
            }
            
            // Draw hexagon outline
            bitmap.strokeStyle = 'rgba(255, 200, 0, 1)';
            bitmap.lineWidth = 2;
            bitmap.beginPath();
            bitmap.moveTo(points[0].x, points[0].y);
            for (let i = 1; i < 6; i++) {
                bitmap.lineTo(points[i].x, points[i].y);
            }
            bitmap.closePath();
            bitmap.stroke();
            
            // Fill based on content
            if (cell.honey > 0) {
                bitmap.fillStyle = `rgba(255, 200, 0, ${Math.min(1, cell.honey / 10)})`;
                bitmap.fill();
            }
            if (cell.pollen > 0) {
                bitmap.fillStyle = `rgba(255, 255, 0, ${Math.min(1, cell.pollen / 5)})`;
                bitmap.fill();
            }
        }
        
        drawBees() {
            const apiary = $gameSystem.apiaryComplex;
            if (!apiary) return;
            
            const bitmap = this._apiarySprite.bitmap;
            bitmap.fontSize = 16;
            
            // Draw queen
            if (apiary.colony.queen) {
                const x = Graphics.width / 2;
                const y = Graphics.height / 2;
                bitmap.drawText(apiary.colony.queen.getEmoji(), x - 10, y - 10, 20, 20, 'center');
            }
            
            // Draw sample of other bees (too many to show all)
            const maxDisplay = Math.min(100, apiary.colony.bees.length);
            for (let i = 0; i < maxDisplay; i++) {
                const bee = apiary.colony.bees[i];
                const angle = (i / maxDisplay) * Math.PI * 2;
                const radius = 50 + Math.random() * 150;
                const x = Graphics.width / 2 + Math.cos(angle) * radius;
                const y = Graphics.height / 2 + Math.sin(angle) * radius;
                
                bitmap.drawText(bee.getEmoji(), x - 10, y - 10, 20, 20, 'center');
            }
        }
        
        createInfoWindows() {
            // Colony Status Window
            this._statusWindow = new Window_Base(new Rectangle(10, 10, 300, 200));
            this.addWindow(this._statusWindow);
            
            // Resources Window
            this._resourceWindow = new Window_Base(new Rectangle(Graphics.width - 310, 10, 300, 200));
            this.addWindow(this._resourceWindow);
            
            // Population Window
            this._populationWindow = new Window_Base(new Rectangle(10, 220, 300, 200));
            this.addWindow(this._populationWindow);
            
            this.updateInfoWindows();
        }
        
        updateInfoWindows() {
            const apiary = $gameSystem.apiaryComplex;
            if (!apiary) return;
            
            const report = apiary.generateReport(0);
            
            // Status Window
            this._statusWindow.contents.clear();
            this._statusWindow.contents.fontSize = 18;
            this._statusWindow.drawText(`Colony: ${report.colony.state}`, 0, 0, 280, 'left');
            this._statusWindow.drawText(`Mood: ${report.colony.mood}%`, 0, 30, 280, 'left');
            this._statusWindow.drawText(`Efficiency: ${report.colony.efficiency}%`, 0, 60, 280, 'left');
            this._statusWindow.drawText(`Queen Health: ${report.queen.health}%`, 0, 90, 280, 'left');
            this._statusWindow.drawText(`Season: ${report.environment.season}`, 0, 120, 280, 'left');
            
            // Resources Window
            this._resourceWindow.contents.clear();
            this._resourceWindow.contents.fontSize = 18;
            this._resourceWindow.drawText(`🍯 Honey: ${report.resources.honey}`, 0, 0, 280, 'left');
            this._resourceWindow.drawText(`🌻 Pollen: ${report.resources.pollen}`, 0, 30, 280, 'left');
            this._resourceWindow.drawText(`👑 Royal Jelly: ${report.resources.royalJelly}`, 0, 60, 280, 'left');
            this._resourceWindow.drawText(`🕯️ Wax: ${report.resources.wax}`, 0, 90, 280, 'left');
            this._resourceWindow.drawText(`💧 Water: ${report.resources.water}%`, 0, 120, 280, 'left');
            
            // Population Window
            this._populationWindow.contents.clear();
            this._populationWindow.contents.fontSize = 16;
            this._populationWindow.drawText(`Total Bees: ${report.population.total}`, 0, 0, 280, 'left');
            this._populationWindow.drawText(`⚪ Eggs: ${report.population.eggs}`, 0, 25, 280, 'left');
            this._populationWindow.drawText(`🐛 Larvae: ${report.population.larvae}`, 0, 50, 280, 'left');
            this._populationWindow.drawText(`🪱 Pupae: ${report.population.pupae}`, 0, 75, 280, 'left');
            this._populationWindow.drawText(`🐝 Workers: ${report.population.adults.workers}`, 0, 100, 280, 'left');
            this._populationWindow.drawText(`🐝 Foragers: ${report.population.adults.foragers}`, 0, 125, 280, 'left');
            this._populationWindow.drawText(`🐝 Guards: ${report.population.adults.guards}`, 0, 150, 280, 'left');
        }
        
        createCommandWindow() {
            this._commandWindow = new Window_Command(new Rectangle(Graphics.width - 200, Graphics.height - 100, 190, 90));
            this._commandWindow.setHandler('harvest', this.commandHarvest.bind(this));
            this._commandWindow.setHandler('cancel', this.popScene.bind(this));
            this.addWindow(this._commandWindow);
        }
        
        commandHarvest() {
            const apiary = $gameSystem.apiaryComplex;
            if (apiary) {
                const harvested = apiary.harvestHoney();
                if (harvested > 0) {
                    $gameMessage.add(`Harvested ${Math.floor(harvested / 10)} honey!`);
                } else {
                    $gameMessage.add('Not enough honey to harvest!');
                }
            }
            this._commandWindow.activate();
            this.updateInfoWindows();
        }
        
        update() {
            super.update();
            
            // Update display every 30 frames
            if (Graphics.frameCount % 30 === 0) {
                this.updateInfoWindows();
                this._apiarySprite.bitmap.clear();
                this.drawHexagonalGrid();
                this.drawBees();
            }
        }
    }
    
    Window_Command.prototype.makeCommandList = function() {
        if (SceneManager._scene instanceof Scene_Apiary) {
            this.addCommand('Harvest Honey', 'harvest');
            this.addCommand('Exit', 'cancel');
        }
    };
    
    // Plugin Commands
    PluginManager.registerCommand('ApiaryComplex', 'openApiary', args => {
        if (!$gameSystem.apiaryComplex) {
            $gameSystem.apiaryComplex = new ApiaryComplex();
        }
        
        // Simulate time passed since last access
        const now = Date.now();
        const timePassed = (now - $gameSystem.apiaryComplex.lastUpdate) / 1000 / 3600; // Hours
        
        if (timePassed > 0) {
            const report = $gameSystem.apiaryComplex.simulateTimeStep(timePassed);
            
            // Show summary message
            $gameMessage.add(`--- Apiary Status Report ---`);
            $gameMessage.add(`Time elapsed: ${Math.floor(timePassed)} hours`);
            $gameMessage.add(`Colony state: ${report.colony.state}`);
            $gameMessage.add(`Total bees: ${report.population.total}`);
            $gameMessage.add(`Honey available: ${report.resources.honey}`);
            
            if (report.queen.alive) {
                $gameMessage.add(`Queen health: ${report.queen.health}%`);
            } else {
                $gameMessage.add(`WARNING: No queen present!`);
            }
            
            if (report.environment.threats.length > 0) {
                $gameMessage.add(`Active threats: ${report.environment.threats.join(', ')}`);
            }
        }
        
        $gameSystem.apiaryComplex.lastUpdate = now;
        
        // Open the apiary scene
        SceneManager.push(Scene_Apiary);
    });
    
    PluginManager.registerCommand('ApiaryComplex', 'simulateTime', args => {
        if (!$gameSystem.apiaryComplex) {
            $gameSystem.apiaryComplex = new ApiaryComplex();
        }
        
        const hours = 24; // Simulate one day
        const report = $gameSystem.apiaryComplex.simulateTimeStep(hours);
        
        $gameMessage.add(`Simulated ${hours} hours`);
        $gameMessage.add(`Honey produced: ${Math.floor(report.statistics.honeyProduced)}`);
        $gameMessage.add(`Current population: ${report.population.total}`);
    });
})();

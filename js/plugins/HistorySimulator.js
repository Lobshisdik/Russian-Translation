/*:
 * @target MZ
 * @plugindesc Dwarf Fortress-inspired Europe Alternate History Generator (1900-2004).
 * @author Omni-Lex
 * @url https://nocoldiz.itch.io/hypernet-explorer
 *
 * @param startYear
 * @text Start Year
 * @type number
 * @default 1900
 * @desc The year the simulation starts.
 *
 * @param endYear
 * @text End Year
 * @type number
 * @default 2004
 * @desc The year the simulation ends.
 *
 * @param autoRunOnNewGame
 * @text Auto-run on New Game
 * @type boolean
 * @default true
 * @desc If true, runs a fresh simulation when a new game starts.
 *
 * @command runSimulation
 * @text Run Simulation
 * @desc Runs a fresh simulation of history. WARNING: Clears existing history.
 *
 * @command getHistoricalFact
 * @text Get Historical Fact
 * @desc Gets a random historical fact and stores it in a variable.
 * @arg variableId
 * @type variable
 * @desc The variable ID to store the fact string in.
 * @arg year
 * @type number
 * @desc Optional: Specify a year. 0 for random.
 * @default 0
 *
 * @command showHistoryLog
 * @text Show History Log
 * @desc Opens a window displaying the generated timeline.
 *
 * @help
 * HistorySimulator.js
 * ============================================================================
 * This plugin simulates a century of geopolitical shifts, ideologies, and 
 * conflicts in a procedural Europe (1900-2004).
 *
 * It generates a persistent timeline of events including:
 * - Political coups, elections, and assassinations
 * - Wars and territorial conquests
 * - Paranormal anomalies and "The Squishing"
 * - Economic shifts and technological breakthroughs
 *
 * The history is stored in $gameSystem._historicalEvents and persists in saves.
 *
 * Integration:
 * - Use 'Get Historical Fact' to flavor NPC dialogue or item descriptions.
 * - The simulation affects hidden 'stats' for factions and hyperpowers which
 *   can be used by other plugins or conditional branches.
 * ============================================================================
 */

(function() {
    'use strict';

    const pluginName = "HistorySimulator";
    const params = PluginManager.parameters(pluginName);
    const START_YEAR = Number(params.startYear || 1900);
    const END_YEAR = Number(params.endYear || 2004);
    const AUTO_RUN = params.autoRunOnNewGame === "true";
    const CANON_END_YEAR = 2004; // The true end year of the canon timeline

    //=============================================================================
    // Data Constants (Ported from HistorySimulator.html)
    //=============================================================================

    const HYPERPOWERS = {
        'Holy Vatican Empire': {
            baseTerritory: 'Italy',
            capital: 'Rome',
            color: 'purple',
            leaders: [
                {name: 'Pope Leo XIII', ideology: 'Theocratic', years: [1900, 1903]},
                {name: 'Pope Pius X', ideology: 'Conservative Theocratic', years: [1903, 1914]},
                {name: 'Pope Benedict XV', ideology: 'Pacifist Theocratic', years: [1914, 1922]},
                {name: 'Benito Mussolini', ideology: 'Fascist Theocratic', years: [1922, 1943]},
                {name: 'Antonio Gramsci', ideology: 'Socialist', years: [1922, 1970]},
                {name: 'Pope Pius XII', ideology: 'Diplomatic Theocratic', years: [1939, 1958]},
                {name: 'Aldo Moro', ideology: 'Christian Democratic', years: [1960, 1978]},
                {name: 'Giulio Andreotti', ideology: 'Machiavellian', years: [1972, 1992]},
                {name: 'Pope John Paul II', ideology: 'Anti-Communist', years: [1978, 2005]},
                {name: 'Silvio Berlusconi', ideology: 'Media Theocrat', years: [1994, 2011]}
            ],
            population: 32000000,
            economy: 100,
            military: 80
        },
        'Britannia': {
            baseTerritory: 'United Kingdom',
            capital: 'London',
            color: 'blue',
            leaders: [
                {name: 'Queen Victoria', ideology: 'Imperial Monarchist', years: [1837, 1901]},
                {name: 'Edward VII', ideology: 'Diplomatic Monarchist', years: [1901, 1910]},
                {name: 'George V', ideology: 'Conservative Monarchist', years: [1910, 1936]},
                {name: 'Edward VIII', ideology: 'Scandalous Monarchist', years: [1936, 1936]},
                {name: 'George VI', ideology: 'Duty-Bound Monarchist', years: [1936, 1952]},
                {name: 'Winston Churchill', ideology: 'Imperial Democrat', years: [1940, 1955]},
                {name: 'Clement Attlee', ideology: 'Socialist', years: [1945, 1951]},
                {name: 'Elizabeth II', ideology: 'Constitutional Monarchist', years: [1952, 2022]},
                {name: 'Margaret Thatcher', ideology: 'Conservative', years: [1979, 1990]},
                {name: 'Tony Blair', ideology: 'New Labour', years: [1997, 2007]}
            ],
            population: 38000000,
            economy: 150,
            military: 120
        },
        'Soviet Union': {
            baseTerritory: 'Russia',
            capital: 'Moscow',
            color: 'red',
            leaders: [
                {name: 'Nicholas II', ideology: 'Autocrat', years: [1894, 1917]},
                {name: 'Vladimir Lenin', ideology: 'Communist Revolutionary', years: [1917, 1924]},
                {name: 'Leon Trotsky', ideology: 'Internationalist Communist', years: [1917, 1940]},
                {name: 'Joseph Stalin', ideology: 'Totalitarian Communist', years: [1924, 1953]},
                {name: 'Nikita Khrushchev', ideology: 'Reform Communist', years: [1953, 1964]},
                {name: 'Leonid Brezhnev', ideology: 'Stagnation Communist', years: [1964, 1982]},
                {name: 'Mikhail Gorbachev', ideology: 'Reform Socialist', years: [1985, 1991]},
                {name: 'Boris Yeltsin', ideology: 'Democratic Capitalist', years: [1991, 1999]},
                {name: 'Vladimir Putin', ideology: 'Authoritarian', years: [1999, 2024]}
            ],
            population: 120000000,
            economy: 120,
            military: 200
        },
        'Ottoman Empire': {
            baseTerritory: 'Turkey',
            capital: 'Istanbul',
            color: 'orange',
            leaders: [
                {name: 'Abdul Hamid II', ideology: 'Islamic Autocrat', years: [1876, 1909]},
                {name: 'Mehmed V', ideology: 'Constitutional Sultan', years: [1909, 1918]},
                {name: 'Enver Pasha', ideology: 'Young Turk Nationalist', years: [1913, 1918]},
                {name: 'Mustafa Kemal Atatürk', ideology: 'Secular Nationalist', years: [1923, 1938]},
                {name: 'İsmet İnönü', ideology: 'Kemalist', years: [1938, 1950]},
                {name: 'Adnan Menderes', ideology: 'Conservative Democrat', years: [1950, 1960]},
                {name: 'Süleyman Demirel', ideology: 'Center-Right', years: [1965, 1993]},
                {name: 'Turgut Özal', ideology: 'Liberal Conservative', years: [1983, 1993]},
                {name: 'Tansu Çiller', ideology: 'Center-Right', years: [1993, 1996]},
                {name: 'Necmettin Erbakan', ideology: 'Islamist', years: [1996, 1997]},
                {name: 'Bülent Ecevit', ideology: 'Social Democrat', years: [1999, 2024]}
            ],
            population: 35000000,
            economy: 80,
            military: 100
        },
        'Goblin Horde': {
            baseTerritory: 'Norway',
            capital: 'Underground',
            color: '#228b22',
            leaders: [
                {name: 'The Great Goblin', ideology: 'Stone Age Primal', years: [1970, 2024]}
            ],
            population: 5000000,
            economy: 30,
            military: 150
        }
    };

    const FACTIONS = {
        'Mages Guild': {
            baseTerritory: 'United Kingdom',
            color: '#ff00ff',
            parentHyperpower: 'Britannia',
            leaders: [
                {name: 'Aleister Crowley', ideology: 'Thelemic Magus', years: [1901, 1947]},
                {name: 'Dion Fortune', ideology: 'Esoteric Psychologist', years: [1920, 1946]},
                {name: 'Margaret Thatcher', ideology: 'Traditionalist Witch', years: [1979, 1990]},
                {name: 'Em', ideology: 'Sacrificial Sorceress', years: [2001, 2024]}
            ],
            arcane: 85, velocity: 40, information: 60
        },
        'Archive Foundation': {
            baseTerritory: 'Russia',
            color: '#00ffff',
            leaders: [
                {name: 'Brewster Kahle', ideology: 'Universal Librarian', years: [1996, 2024]},
                {name: 'Julian Assange', ideology: 'Information Leaker', years: [2001, 2024]}
            ],
            arcane: 30, velocity: 30, information: 100
        },
        'Hypercapitalist Collective': {
            baseTerritory: 'Netherlands',
            color: '#ffff00',
            leaders: [
                {name: 'The Pyramid Overlord', ideology: 'Speed Profit Prophet', years: [1990, 2024]},
                {name: 'The Shadow CEO', ideology: 'High-Frequency Trader', years: [1990, 2024]}
            ],
            arcane: 40, velocity: 120, information: 70
        },
        'The Gods': {
            baseTerritory: 'Italy',
            color: '#ffffff',
            parentHyperpower: 'Holy Vatican Empire',
            leaders: [
                {name: 'YHWH', ideology: 'Abramic Father', years: [0, 1999]},
                {name: 'Eris', ideology: 'Discordian Chaos', years: [1999, 2024]},
                {name: 'Malal', ideology: 'Chaos Renegade', years: [1990, 2024]}
            ],
            arcane: 100, velocity: 80, information: 50
        }
    };

    const COUNTRIES = {
        'Italy': {controller: 'Holy Vatican Empire', faction: 'The Gods'},
        'United Kingdom': {controller: 'Britannia', faction: 'Mages Guild'},
        'Norway': {controller: 'Goblin Horde', faction: 'Neutral'},
        'Russia': {controller: 'Soviet Union', faction: 'Archive Foundation'},
        'Turkey': {controller: 'Ottoman Empire', faction: 'Neutral'},
        'Netherlands': {controller: 'Neutral', faction: 'Hypercapitalist Collective'},
        'Belgium': {controller: 'Neutral', faction: 'Neutral'},
        'Switzerland': {controller: 'Neutral', faction: 'Neutral'},
        'Austria': {controller: 'Neutral', faction: 'Neutral'},
        'Poland': {controller: 'Neutral', faction: 'Neutral'},
        'Czechoslovakia': {controller: 'Neutral', faction: 'Neutral'},
        'Hungary': {controller: 'Neutral', faction: 'Neutral'},
        'Romania': {controller: 'Neutral', faction: 'Neutral'},
        'Bulgaria': {controller: 'Neutral', faction: 'Neutral'},
        'Yugoslavia': {controller: 'Neutral', faction: 'Neutral'},
        'Greece': {controller: 'Neutral', faction: 'Neutral'},
        'Denmark': {controller: 'Neutral', faction: 'Neutral'},
        'Sweden': {controller: 'Neutral', faction: 'Neutral'},
        'Finland': {controller: 'Neutral', faction: 'Neutral'},
        'Ireland': {controller: 'Neutral', faction: 'Neutral'},
        'Albania': {controller: 'Neutral', faction: 'Neutral'},
        'Estonia': {controller: 'Neutral', faction: 'Neutral'},
        'Latvia': {controller: 'Neutral', faction: 'Neutral'},
        'Lithuania': {controller: 'Neutral', faction: 'Neutral'}
    };

    const EVENT_TYPES = {
        political: ['assassination attempt', 'election', 'coup attempt', 'reforms', 'scandal'],
        military: ['border skirmish', 'naval encounter', 'weapon development', 'military parade'],
        economic: ['market crash', 'trade agreement', 'industrial growth', 'resource discovery'],
        social: ['plague outbreak', 'technological breakthrough', 'cultural festival', 'religious event'],
        paranormal: ['StrangeLightsInSky', 'MysteriousDisappearances', 'PropheticDreams', 'CryptidSighting', 'ThoughtTransmittedDisease', 'TimeAnomaly'],
        royal: ['royal wedding', 'succession crisis', 'royal scandal']
    };

    const EMOJIS = {
        political: '⚖️', military: '🔫', economic: '💰', social: '👥',
        paranormal: '🔮', royal: '👑', conquest: '🚩', war: '⚔️',
        peace: '🕊️', internal: '🏛️'
    };

    //=============================================================================
    // History Manager Class
    //=============================================================================

    class HistoryManager {
        constructor() {
            this.reset();
        }

        reset() {
            this._events = [];
            this._deadLeaders = new Set();
            this._currentLeaders = {};
            this._currentFactionLeaders = {};
            this._currentHyperpowers = JSON.parse(JSON.stringify(HYPERPOWERS));
            this._currentFactions = JSON.parse(JSON.stringify(FACTIONS));
            this._currentCountries = JSON.parse(JSON.stringify(COUNTRIES));
        }

        runSimulation(years = null) {
            this.reset();
            const startYear = START_YEAR;
            const endYear = years ? startYear + years : END_YEAR;
            let date = new Date(startYear, 0, 1);
            const endDate = new Date(endYear, 0, 1);

            while (date <= endDate) {
                const year = date.getFullYear();
                this.updateActiveLeaders(year);
                
                // Monthly check for events
                this.handleFixedEvents(date);
                this.handleInternalPolitics(date, false);
                this.handleInternalPolitics(date, true);
                
                if (Math.random() < 0.15) {
                    const event = this.generateRandomEvent(date);
                    if (event) this._events.push(event);
                }

                // Advance one month
                date.setMonth(date.getMonth() + 1);
            }
            
            this.saveToGameSystem();
            console.log(`[HistorySimulator] Simulation complete. ${this._events.length} events generated.`);
        }

        updateActiveLeaders(year) {
            for (let power in this._currentHyperpowers) {
                const available = HYPERPOWERS[power].leaders.filter(l => 
                    year >= l.years[0] && year <= l.years[1] && !this._deadLeaders.has(l.name)
                );
                if (!this._currentLeaders[power] || !available.includes(this._currentLeaders[power])) {
                    this._currentLeaders[power] = available[0] || null;
                }
            }
            for (let faction in this._currentFactions) {
                const available = FACTIONS[faction].leaders.filter(l => 
                    year >= l.years[0] && year <= l.years[1] && !this._deadLeaders.has(l.name)
                );
                if (!this._currentFactionLeaders[faction] || !available.includes(this._currentFactionLeaders[faction])) {
                    this._currentFactionLeaders[faction] = available[0] || null;
                }
            }
        }

        handleFixedEvents(date) {
            const dateStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
            const fixed = this.getFixedEvent(dateStr);
            if (fixed) {
                this._events.push({
                    date: dateStr,
                    type: fixed.type,
                    description: fixed.description
                });
                if (fixed.callback) fixed.callback(this);
            }
        }

        getFixedEvent(dateStr) {
            const events = {
                '1914-07': {
                    type: 'military',
                    description: "⚔️ WORLD WAR I BEGINS: Archduke Franz Ferdinand is assassinated. The alliance systems of the Hyperpowers trigger a global conflict.",
                    callback: (mgr) => { for (let h in mgr._currentHyperpowers) mgr._currentHyperpowers[h].military += 30; }
                },
                '1917-10': {
                    type: 'political',
                    description: "⚖️ OCTOBER REVOLUTION: The Soviet Union emerges from the ashes of Imperial Russia. Vladimir Lenin seizes control of the Archive Foundation.",
                    callback: (mgr) => { 
                        mgr._currentHyperpowers['Soviet Union'].military += 50;
                        mgr._currentFactions['Archive Foundation'].information += 40;
                    }
                },
                '1918-11': {
                    type: 'peace',
                    description: "🕊️ WWI ENDS: Armistice signed. The map of Europe is redrawn. Ottoman Empire begins its slow decline.",
                    callback: (mgr) => { mgr._currentHyperpowers['Ottoman Empire'].economy -= 20; }
                },
                '1939-09': {
                    type: 'military',
                    description: "⚔️ WORLD WAR II BEGINS: Invasion of Poland. Total war engulfs the globe. The Atlantic Protectorate is mobilized by Britannia.",
                    callback: (mgr) => { mgr._currentHyperpowers['Britannia'].military += 100; }
                },
                '1945-05': {
                    type: 'peace',
                    description: "🕊️ WWII ENDS IN EUROPE: VE Day. Soviet Union and Britannia emerge as the dominant global forces.",
                    callback: (mgr) => { 
                        mgr._currentHyperpowers['Soviet Union'].economy += 50;
                        mgr._currentHyperpowers['Britannia'].economy += 50;
                    }
                },
                '1970-05': {
                    type: 'paranormal',
                    description: "🔮 The Soviet Union opens the Kola Superdeep Borehole. A massive Goblin Horde emerges from the depths of the Earth!",
                    callback: (mgr) => { mgr._currentHyperpowers['Goblin Horde'].military += 200; }
                },
                '1992-01': {
                    type: 'paranormal',
                    description: "🔮 THE SQUISHING BEGINS: Reality starts to feel 'thin'. Dimensional stability drops by 15%. Anomalies reported worldwide.",
                    callback: (mgr) => { for (let f in mgr._currentFactions) mgr._currentFactions[f].arcane += 10; }
                },
                '2001-09': {
                    type: 'military',
                    description: "💀 SEPTEMBER 11: New York is struck by teonuclear weapons. The blast strips out the souls of 3 million citizens, leaving 'Hollow Shells'.",
                    callback: (mgr) => { 
                        mgr._currentHyperpowers['Britannia'].information += 80;
                        for (let f in mgr._currentFactions) mgr._currentFactions[f].information *= 0.7;
                    }
                }
            };
            return events[dateStr];
        }

        handleInternalPolitics(date, isFaction) {
            const year = date.getFullYear();
            const actors = isFaction ? this._currentFactions : this._currentHyperpowers;
            const currentActors = isFaction ? this._currentFactionLeaders : this._currentLeaders;
            const actorNames = Object.keys(actors);

            actorNames.forEach(actor => {
                if (Math.random() > 0.02) return; // Rare check

                const available = (isFaction ? FACTIONS[actor] : HYPERPOWERS[actor]).leaders.filter(l => 
                    year >= l.years[0] && year <= l.years[1] && !this._deadLeaders.has(l.name)
                );

                if (available.length > 1) {
                    const active = currentActors[actor];
                    if (!active) return;
                    const rivals = available.filter(l => l.name !== active.name);
                    const rival = rivals[Math.floor(Math.random() * rivals.length)];
                    if (!rival) return;
                    
                    const struggleType = ['election', 'coup', 'assassination', 'alliance'][Math.floor(Math.random() * 4)];
                    let outcomeDesc = "";

                    switch(struggleType) {
                        case 'election':
                            if (Math.random() > 0.5) {
                                currentActors[actor] = rival;
                                outcomeDesc = `🗳️ ${rival.name} wins the election in ${actor}, replacing ${active.name}.`;
                            } else {
                                outcomeDesc = `🗳️ ${active.name} maintains power in ${actor} after a tight election.`;
                            }
                            break;
                        case 'coup':
                            if (Math.random() > 0.4) {
                                currentActors[actor] = rival;
                                outcomeDesc = `🎖️ MILITARY COUP! ${rival.name} seizes power in ${actor}, overthrowing ${active.name}!`;
                            } else {
                                outcomeDesc = `🎖️ A coup attempt by ${rival.name} in ${actor} was suppressed.`;
                            }
                            break;
                        case 'assassination':
                            if (Math.random() > 0.7) {
                                this._deadLeaders.add(active.name);
                                currentActors[actor] = rival;
                                outcomeDesc = `💀 ${active.name} was assassinated! ${rival.name} takes control of ${actor}.`;
                            } else {
                                this._deadLeaders.add(rival.name);
                                outcomeDesc = `💀 Assassination attempt on ${active.name} failed. Rival ${rival.name} was executed.`;
                            }
                            break;
                        case 'alliance':
                            outcomeDesc = `🤝 ${active.name} and ${rival.name} form an uneasy political alliance in ${actor}.`;
                            break;
                    }

                    if (outcomeDesc) {
                        this._events.push({
                            date: date.toISOString().split('T')[0],
                            type: 'internal',
                            description: outcomeDesc
                        });
                    }
                }
            });
        }

        generateRandomEvent(date) {
            const year = date.getFullYear();
            const category = Object.keys(EVENT_TYPES)[Math.floor(Math.random() * Object.keys(EVENT_TYPES).length)];
            const type = EVENT_TYPES[category][Math.floor(Math.random() * EVENT_TYPES[category].length)];
            
            const isFaction = category === 'paranormal' || Math.random() < 0.3;
            const actorPool = isFaction ? Object.keys(this._currentFactions) : Object.keys(this._currentHyperpowers);
            const actor = actorPool[Math.floor(Math.random() * actorPool.length)];
            const leader = isFaction ? this._currentFactionLeaders[actor] : this._currentLeaders[actor];
            
            if (!leader) return null;

            const desc = this.getEventDescription(category, type, actor, leader, year);
            const results = this.applyEffects(actor, isFaction, desc);

            return {
                date: date.toISOString().split('T')[0],
                type: category,
                description: desc,
                results: results
            };
        }

        getEventDescription(category, type, actor, leader, year) {
            const emoji = EMOJIS[category] || '🔹';
            // Basic mapping for descriptions
            const basic = {
                political: {
                    'assassination attempt': `Assassination attempt on ${leader.name} of ${actor} foiled.`,
                    'election': `${actor} holds controversial elections, ${leader.name} maintains power.`,
                    'coup attempt': `Military coup attempt in ${actor} crushed by ${leader.name}.`,
                    'reforms': `${leader.name} announces sweeping ${leader.ideology} reforms in ${actor}.`,
                    'scandal': `Corruption scandal rocks ${actor} government under ${leader.name}.`
                },
                military: {
                    'border skirmish': `Border skirmish between ${actor} forces and neighboring territory.`,
                    'naval encounter': `${actor} naval forces encounter mysterious vessels.`,
                    'weapon development': `${actor} scientists develop new experimental technology.`,
                    'military parade': `${leader.name} reviews massive military parade in ${actor}.`
                },
                economic: {
                    'market crash': `${actor} stock market crashes, economy loses value.`,
                    'trade agreement': `${actor} signs lucrative trade deal.`,
                    'industrial growth': `${actor} industrial output increases by 15%.`,
                    'resource discovery': `Valuable mineral deposits discovered in ${actor}.`
                },
                social: {
                    'plague outbreak': `Mysterious plague strikes ${actor}.`,
                    'technological breakthrough': `${actor} achieves breakthrough in radio/telecom.`,
                    'cultural festival': `Grand cultural festival celebrates ${actor} heritage.`,
                    'religious event': `Miraculous apparition reported in ${actor}.`
                },
                paranormal: {
                    'StrangeLightsInSky': `Unexplained lights dance across ${actor} skies.`,
                    'MysteriousDisappearances': `Entire village vanishes in ${actor}.`,
                    'PropheticDreams': `${leader.name} claims PropheticDreams guide ${actor}.`,
                    'CryptidSighting': `Witnesses report a PetroDemon near ${actor}.`,
                    'ThoughtTransmittedDisease': `TTD outbreak in ${actor}; Citizens wear TinfoilDams.`,
                    'TimeAnomaly': `${actor} experiences a TimeAnomaly; History is shifted.`
                },
                royal: {
                    'royal wedding': `Grand royal wedding unites ${actor} nobility.`,
                    'succession crisis': `${actor} faces succession crisis.`,
                    'royal scandal': `Scandal rocks ${actor} court.`
                }
            };

            const weird = {
                political: {
                    'assassination attempt': `${leader.name} survived an assassination attempt by their own future self.`,
                    'election': `The election in ${actor} resulted in a tie between ${leader.name} and a sentient cloud.`,
                    'reforms': `${leader.name} legalizes 'Soul-Trading' in ${actor}.`
                },
                military: {
                    'border skirmish': `A border skirmish in ${actor} was fought using weapons that delete memories.`,
                    'weapon development': `${actor} develops a bomb that explodes into 'Pure Meaning'.`
                },
                paranormal: {
                    'TimeAnomaly': `${actor} is experiencing Tuesday twice every week due to a temporal leak.`,
                    'MysteriousDisappearances': `People in ${actor} are being replaced by 2D cardboard cutouts.`,
                    'ThoughtTransmittedDisease': `A viral idea in ${actor} causes citizens to speak only in CamelCase.`
                }
            };

            let text = "";
            if (year >= 1992 && weird[category] && weird[category][type] && Math.random() < 0.4) {
                text = weird[category][type];
            } else {
                text = (basic[category] && basic[category][type]) || `${type} occurs in ${actor}.`;
            }

            return `${emoji} ${text}`;
        }

        applyEffects(actor, isFaction, desc) {
            const stats = isFaction ? this._currentFactions[actor] : this._currentHyperpowers[actor];
            if (!stats) return "";

            let results = [];
            if (desc.includes('crash')) { stats.economy *= 0.8; results.push("Eco -20%"); }
            if (desc.includes('growth')) { stats.economy *= 1.15; results.push("Eco +15%"); }
            if (desc.includes('plague') || desc.includes('TTD')) { stats.population *= 0.95; results.push("Pop -5%"); }
            if (desc.includes('breakthrough')) { stats.information += 20; results.push("Info +20"); }
            if (desc.includes('Anomaly')) { stats.velocity += 20; results.push("Vel +20"); }
            
            if (stats.arcane !== undefined) stats.arcane += 2;
            if (stats.population) stats.population *= 1.0001;

            return results.join(', ');
        }

        saveToGameSystem() {
            if ($gameSystem) {
                $gameSystem._historicalEvents = this._events;
                $gameSystem._historicalHyperpowers = this._currentHyperpowers;
                $gameSystem._historicalFactions = this._currentFactions;
                $gameSystem._historicalDeadLeaders = Array.from(this._deadLeaders);
            }
        }
        
        getHistoricalFact(year = 0) {
            const events = $gameSystem ? $gameSystem._historicalEvents : this._events;
            if (!events || events.length === 0) return "The history books are blank.";
            
            let pool = events;
            if (year > 0) {
                pool = events.filter(e => e.date.startsWith(String(year)));
            }
            if (pool.length === 0) return "No significant records remain from that era.";
            
            const event = pool[Math.floor(Math.random() * pool.length)];
            return `[${event.date}] ${event.description}`;
        }
    }

    // Initialize global manager
    const manager = new HistoryManager();
    window.HistoryManager = manager;

    //=============================================================================
    // Plugin Commands
    //=============================================================================

    PluginManager.registerCommand(pluginName, "runSimulation", args => {
        const years = args.years ? Number(args.years) : null;
        manager.runSimulation(years);
    });

    PluginManager.registerCommand(pluginName, "getHistoricalFact", args => {
        const varId = Number(args.variableId);
        const year = Number(args.year);
        const fact = manager.getHistoricalFact(year);
        $gameVariables.setValue(varId, fact);
    });

    PluginManager.registerCommand(pluginName, "showHistoryLog", args => {
        SceneManager.push(Scene_History);
    });

    //=============================================================================
    // Integration with Game System
    //=============================================================================

    const _DataManager_setupNewGame = DataManager.setupNewGame;
    DataManager.setupNewGame = function() {
        _DataManager_setupNewGame.call(this);
        if (AUTO_RUN) {
            manager.runSimulation();
        }
    };

    //=============================================================================
    // UI - Scene_History
    //=============================================================================

    class Scene_History extends Scene_MenuBase {
        create() {
            super.create();
            this.createWindowLayer();
            this.createSummaryWindow();
            this.createHistoryWindow();
            this.createDetailsWindow();
            
            this._summaryWindow.hide();
            this._summaryWindow.deactivate();
            
            this._historyWindow.show();
            this._historyWindow.activate();
            this._detailsWindow.show();
        }

        createSummaryWindow() {
            const rect = this.summaryWindowRect();
            this._summaryWindow = new Window_HistorySummary(rect);
            this._summaryWindow.setHandler('ok', this.onSummaryOk.bind(this));
            this._summaryWindow.setHandler('cancel', this.popScene.bind(this));
            this.addWindow(this._summaryWindow);
        }

        createHistoryWindow() {
            const rect = this.historyWindowRect();
            this._historyWindow = new Window_HistoryLog(rect);
            this._historyWindow.setHandler('cancel', this.onHistoryCancel.bind(this));
            this._historyWindow.hide();
            this.addWindow(this._historyWindow);
        }

        createDetailsWindow() {
            const rect = this.detailsWindowRect();
            this._detailsWindow = new Window_HistoryDetails(rect);
            this._detailsWindow.hide();
            this.addWindow(this._detailsWindow);
            this._historyWindow.setDetailsWindow(this._detailsWindow);
        }

        summaryWindowRect() {
            const ww = Graphics.boxWidth - 100;
            const wh = Graphics.boxHeight - 160;
            const wx = (Graphics.boxWidth - ww) / 2;
            const wy = (Graphics.boxHeight - wh) / 2;
            return new Rectangle(wx, wy, ww, wh);
        }

        historyWindowRect() {
            const totalW = Graphics.boxWidth - 40;
            const ww = Math.floor(totalW * 0.6);
            const wh = Graphics.boxHeight - 40;
            const wx = 20;
            const wy = 20;
            return new Rectangle(wx, wy, ww, wh);
        }

        detailsWindowRect() {
            const totalW = Graphics.boxWidth - 40;
            const listW = Math.floor(totalW * 0.6);
            const ww = totalW - listW;
            const wh = Graphics.boxHeight - 40;
            const wx = 20 + listW;
            const wy = 20;
            return new Rectangle(wx, wy, ww, wh);
        }

        onSummaryOk() {
            this._summaryWindow.hide();
            this._historyWindow.show();
            this._historyWindow.activate();
            this._detailsWindow.show();
        }

        onHistoryCancel() {
            this._historyWindow.hide();
            this._historyWindow.deactivate();
            this._detailsWindow.hide();
            this._summaryWindow.show();
            this._summaryWindow.activate();
        }
    }

    class Window_HistorySummary extends Window_Selectable {
        constructor(rect) {
            super(rect);
            this.refresh();
            this.activate();
            this.select(0);
        }

        maxItems() { return 1; }

        refresh() {
            this.contents.clear();
            const events = $gameSystem._historicalEvents || [];
            const yearCount = events.length > 0 ? 
                (new Date(events[events.length-1].date).getFullYear() - new Date(events[0].date).getFullYear()) : 0;
            
            this.changeTextColor(ColorManager.systemColor());
            this.drawText("HISTORY SIMULATION COMPLETE", 0, 0, this.contentsWidth(), "center");
            this.drawText(`Procedural Timeline: ${START_YEAR} - ${START_YEAR + yearCount}`, 0, this.lineHeight(), this.contentsWidth(), "center");
            this.drawHorzLine(this.lineHeight() * 2);

            let y = this.lineHeight() * 3;
            this.changeTextColor(ColorManager.systemColor());
            this.drawText("FINAL WORLD STATE:", 0, y, this.contentsWidth());
            y += this.lineHeight();
            this.resetTextColor();

            // Draw top 3 Hyperpowers
            const powers = Object.entries($gameSystem._historicalHyperpowers || {})
                .sort((a, b) => (b[1].military + b[1].economy) - (a[1].military + a[1].economy))
                .slice(0, 3);

            powers.forEach(([name, data]) => {
                this.drawText(`${name}: Mil ${Math.floor(data.military)} | Eco ${Math.floor(data.economy)}`, 20, y, this.contentsWidth() - 40);
                y += this.lineHeight();
            });

            y += 10;
            this.changeTextColor(ColorManager.systemColor());
            this.drawText("KEY FACTIONS:", 0, y, this.contentsWidth());
            y += this.lineHeight();
            this.resetTextColor();

            const factions = Object.entries($gameSystem._historicalFactions || {})
                .sort((a, b) => b[1].information - a[1].information)
                .slice(0, 3);

            factions.forEach(([name, data]) => {
                this.drawText(`${name}: Info ${Math.floor(data.information)} | Arcane ${Math.floor(data.arcane)}`, 20, y, this.contentsWidth() - 40);
                y += this.lineHeight();
            });

            this.changeTextColor(ColorManager.systemColor());
            this.drawText("Press OK to view detailed log or ESC to continue", 0, this.contentsHeight() - this.lineHeight(), this.contentsWidth(), "center");
        }

        drawHorzLine(y) {
            this.contents.fillRect(0, y, this.contentsWidth(), 2, ColorManager.normalColor());
        }
    }

    class Window_HistoryLog extends Window_Selectable {
        constructor(rect) {
            super(rect);
            this._data = $gameSystem._historicalEvents || [];
            this._visibleCount = 0;
            this._frameCount = 0;
            this.refresh();
            this.activate();
        }

        setDetailsWindow(detailsWindow) {
            this._detailsWindow = detailsWindow;
            this.updateDetails();
        }

        maxItems() {
            return this._visibleCount;
        }

        itemHeight() {
            return this.lineHeight() * 4;
        }

        update() {
            super.update();
            if (this._visibleCount < this._data.length) {
                this._frameCount++;
                if (this._frameCount >= 10) { // Reveal an entry every 10 frames
                    this._visibleCount++;
                    this._frameCount = 0;
                    this.refresh();
                    this.select(this._visibleCount - 1); // Autoscroll
                    this.updateDetails();
                }
            }
        }

        updateDetails() {
            if (this._detailsWindow && this._visibleCount > 0) {
                this._detailsWindow.setEvent(this._data[this._visibleCount - 1]);
            }
        }

        drawItem(index) {
            const event = this._data[index];
            const rect = this.itemLineRect(index);
            this.contents.fontSize = 18;
            
            // Draw Date
            this.changeTextColor(ColorManager.systemColor());
            this.drawText(event.date, rect.x, rect.y, rect.width);
            
            // Draw Description (Wrapped)
            this.changeTextColor(ColorManager.normalColor());
            this.contents.fontSize = 16;
            
            const text = event.description;
            const words = text.split(' ');
            let line = '';
            const maxWidth = rect.width;
            let y = rect.y + this.lineHeight();
            
            for (const word of words) {
                const testLine = line + word + ' ';
                const metrics = this.contents.measureTextWidth(testLine);
                if (metrics > maxWidth && line !== '') {
                    this.drawText(line, rect.x, y, maxWidth);
                    y += this.lineHeight();
                    line = word + ' ';
                } else {
                    line = testLine;
                }
            }
            if (line !== '' && y < rect.y + rect.height) {
                this.drawText(line, rect.x, y, maxWidth);
            }
        }
        
        isCancelEnabled() {
            return super.isCancelEnabled() && this._visibleCount >= this._data.length;
        }

        isCursorVisible() { return true; }
    }

    class Window_HistoryDetails extends Window_Base {
        constructor(rect) {
            super(rect);
            this._event = null;
            this.refresh();
        }

        setEvent(event) {
            if (this._event !== event) {
                this._event = event;
                this.refresh();
            }
        }

        refresh() {
            this.contents.clear();
            if (!this._event) return;

            const x = 10;
            let y = 10;
            
            this.contents.fontSize = 22;
            this.changeTextColor(ColorManager.systemColor());
            this.drawText("LATEST NEWS", x, y, this.contentsWidth() - 20);
            y += 35;
            
            // Add Date
            this.contents.fontSize = 16;
            this.changeTextColor(ColorManager.systemColor());
            this.drawText(`Date: ${this._event.date}`, x, y, this.contentsWidth() - 20);
            y += 25;

            this.contents.fontSize = 16;
            this.changeTextColor(ColorManager.normalColor());
            
            // Word wrap for description
            const text = this._event.description;
            const words = text.split(' ');
            let line = '';
            const maxWidth = this.contentsWidth() - 20;
            
            for (const word of words) {
                const testLine = line + word + ' ';
                const metrics = this.contents.measureTextWidth(testLine);
                if (metrics > maxWidth && line !== '') {
                    this.drawText(line, x, y, maxWidth);
                    y += 25;
                    line = word + ' ';
                } else {
                    line = testLine;
                }
            }
            if (line !== '') {
                this.drawText(line, x, y, maxWidth);
                y += 25;
            }
            
            y += 10;
            this.changeTextColor(ColorManager.systemColor());
            this.drawText("RESULTS:", x, y, this.contentsWidth() - 20);
            y += 25;
            
            this.changeTextColor(ColorManager.normalColor());
            this.drawText(this._event.results || "None", x, y, this.contentsWidth() - 20);
        }
    }

    window.Scene_History = Scene_History;
    window.Window_HistorySummary = Window_HistorySummary;
    window.Window_HistoryLog = Window_HistoryLog;
    window.Window_HistoryDetails = Window_HistoryDetails;

})();

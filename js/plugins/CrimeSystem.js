//=============================================================================
// Crime System Plugin - Enhanced Version with Italian Translation
// Version: 1.2.0
// Author: Assistant
//=============================================================================

/*:
 * @target MZ
 * @plugindesc Crime System v1.2.0
 * @author Assistant
 * @version 1.2.0
 * @description A comprehensive crime system with extensive preset crimes and bounty tracking
 *
 * @param bountyVariable
 * @text Bounty Variable ID
 * @desc Variable ID to store bounty (default: 66)
 * @type variable
 * @default 66
 *
 * @param displayDuration
 * @text Crime Display Duration
 * @desc Duration in frames to show crime notification (60 = 1 second)
 * @type number
 * @default 180
 *
 * @help CrimeSystem.js
 * 
 * This plugin adds a crime system to your game with the following features:
 * - Commit crimes with bounty values
 * - Extensive preset crime list with categories
 * - View crime history and total bounty
 * - Clear bounty and crime records
 * - Crime notification window
 * - Gold to Euro conversion (1000 gold = 10.00 euros)
 * - Italian language support
 * - Crime IDs stored in window.playerCrimes array
 * 
 * Plugin Commands:
 * - Add Crime: Add a new crime with specified bounty
 * - Add Preset Crime: Add a crime from the preset list
 * - Show Preset Crimes: Display all available preset crimes
 * - Show Crime List: Display all committed crimes and total bounty
 * - Clear Bounty: Reset bounty and crime history
 * 
 * Script Calls:
 * - CrimeSystem.addCrime("Crime Name", bounty)
 * - CrimeSystem.addPresetCrime("crimeKey")
 * - CrimeSystem.showPresetCrimes()
 * - CrimeSystem.showCrimeList()
 * - CrimeSystem.clearBounty()
 * 
 * @command addCrime
 * @text Add Crime
 * @desc Add a new crime to the player's record
 *
 * @arg crimeName
 * @text Crime Name
 * @desc Name of the crime committed
 * @type string
 * @default Theft
 *
 * @arg bountyAmount
 * @text Bounty Amount
 * @desc Bounty amount in gold for this crime
 * @type number
 * @default 100
 *
 * @command addPresetCrime
 * @text Add Preset Crime
 * @desc Add a crime from the preset list
 *
 * @arg crimeType
 * @text Crime Type
 * @desc Select a preset crime type
 * @type select
 * @option pettyTheft
 * @option pickpocketing
 * @option shoplifting
 * @option burglary
 * @option robbery
 * @option armedRobbery
 * @option bankRobbery
 * @option grandTheft
 * @option assault
 * @option battery
 * @option aggravatedAssault
 * @option murder
 * @option manslaughter
 * @option serialKilling
 * @option vandalism
 * @option graffiti
 * @option arson
 * @option propertyDestruction
 * @option publicDisturbance
 * @option disorderlyConduct
 * @option trespassing
 * @option breakingAndEntering
 * @option unlawfulEntry
 * @option drugPossession
 * @option drugDealing
 * @option drugTrafficking
 * @option smuggling
 * @option contraband
 * @option fraud
 * @option embezzlement
 * @option bribery
 * @option corruption
 * @option taxEvasion
 * @option moneyLaundering
 * @option forgery
 * @option counterfeiting
 * @option identityTheft
 * @option cybercrime
 * @option hacking
 * @option dataTheft
 * @option piracy
 * @option extortion
 * @option blackmail
 * @option kidnapping
 * @option hostage
 * @option humanTrafficking
 * @option slavery
 * @option poaching
 * @option illegalHunting
 * @option animalCruelty
 * @option environmentalCrime
 * @option pollutionViolation
 * @option illegalDumping
 * @option speedingMinor
 * @option speedingMajor
 * @option recklessDriving
 * @option dui
 * @option hitAndRun
 * @option vehicleTheft
 * @option carjacking
 * @option illegalRacing
 * @option publicIntoxication
 * @option underageDrinking
 * @option disturbing
 * @option loitering
 * @option jaywalking
 * @option littering
 * @option noisePollution
 * @option perjury
 * @option contemptOfCourt
 * @option obstructingJustice
 * @option resistingArrest
 * @option escapingCustody
 * @option prisonBreak
 * @option weaponsPossession
 * @option illegalWeapons
 * @option weaponsTrafficking
 * @option terrorism
 * @option treason
 * @option espionage
 * @option warCrimes
 * @option genocide
 * @option crimesAgainstHumanity
 * @default pettyTheft
 *
 * @command showPresetCrimes
 * @text Show Preset Crimes
 * @desc Display all available preset crimes organized by category
 *
 * @command showCrimeList
 * @text Show Crime List
 * @desc Display the list of all crimes and total bounty
 *
 * @command clearBounty
 * @text Clear Bounty
 * @desc Clear all crimes and reset bounty to 0
 * 
    * @command addCrimeFromVariable
 * @text Add Crime (Bounty from Variable)
 * @desc Add a new crime with bounty amount read from Variable 79
 *
 * @arg crimeName
 * @text Crime Name
 * @desc Name of the crime committed
 * @type string
 * @default Theft
 */

(() => {
    'use strict';
    
    const pluginName = 'CrimeSystem';
    const parameters = PluginManager.parameters(pluginName);
    const bountyVariableId = parseInt(parameters['bountyVariable'] || 66);
    const displayDuration = parseInt(parameters['displayDuration'] || 180);
    
    // Language check
    const useTranslation = ConfigManager.language === 'it';
    const { PresetCrimes} = window.CrimeData;

    // Helper function to get game date from variable 113
    function getGameDateFromVariable() {
        const dateStr = $gameVariables.value(113) || '01 JAN 2001 12:00';
        // Format: "01 JAN 2001 12:00"
        const parts = dateStr.split(' ');
        if (parts.length < 4) {
            return { day: 1, month: 0, year: 2001, hours: 8, minutes: 0 };
        }

        const day = parseInt(parts[0]);
        const monthStr = parts[1].toUpperCase();
        const year = parseInt(parts[2]);
        const timeStr = parts[3].split(':');
        const hours = parseInt(timeStr[0]);
        const minutes = parseInt(timeStr[1]);

        const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
        const month = months.indexOf(monthStr);

        return { day, month, year, hours, minutes };
    }

    // Format game date as readable string
    function getGameDateTimeString() {
        const gameDate = getGameDateFromVariable();
        const monthNames = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
        const monthStr = monthNames[gameDate.month];
        const dayStr = String(gameDate.day).padStart(2, '0');
        const yearStr = gameDate.year;
        const hoursStr = String(gameDate.hours).padStart(2, '0');
        const minutesStr = String(gameDate.minutes).padStart(2, '0');
        return `${dayStr} ${monthStr} ${yearStr} ${hoursStr}:${minutesStr}`;
    }

    // Translation texts
    const TEXT = {
        en: {
            crimeRecord: "Crime Record",
            totalBounty: "Total Bounty",
            noCrimes: "No crimes committed.",
            crimesCommitted: "Crimes Committed:",
            bountyCleared: "Bounty cleared!",
            allCrimesForgi: "All crimes have been forgiven.",
            availableCrimes: "Available Crimes by Category",
            errorUnknown: "Error: Unknown crime type:",
            total: "Total"
        },
        it: {
            crimeRecord: "Registro Crimini",
            totalBounty: "Taglia Totale",
            noCrimes: "Nessun crimine commesso.",
            crimesCommitted: "Crimini Commessi:",
            bountyCleared: "Taglia cancellata!",
            allCrimesForgi: "Tutti i crimini sono stati perdonati.",
            availableCrimes: "Crimini Disponibili per Categoria",
            errorUnknown: "Errore: Tipo di crimine sconosciuto:",
            total: "Totale"
        }
    };
    const bountyVariable = 66; // Variable that stores bounty value
    const bountyIcon = 87; // Icon for bounty display
    // Get localized text
    const gettext = (key) => {
        return useTranslation ? TEXT.it[key] || TEXT.en[key] : TEXT.en[key];
    };
    
    // Crime System Class
    class CrimeSystem {
        static initialize() {
            if (!$dataSystem.switches) return;
            
            // Initialize crime data if not exists
            if (!$gameSystem._crimeData) {
                $gameSystem._crimeData = {
                    crimes: [],
                    totalBounty: 0
                };
            }
            
            // Initialize window.playerCrimes array
            if (!window.playerCrimes) {
                window.playerCrimes = [];
            }
        }
        
        static addCrime(crimeName, bountyAmount, crimeId = null) {
            this.initialize();
            
            const crime = {
                name: crimeName,
                bounty: bountyAmount,
                id: crimeId,
                timestamp: getGameDateTimeString()
            };
            
            $gameSystem._crimeData.crimes.push(crime);
            $gameSystem._crimeData.totalBounty += bountyAmount;
            
            // Add crime ID to window.playerCrimes if provided
            if (crimeId) {
                window.playerCrimes.push(crimeId);
            }
            
            // Update bounty variable
            $dataSystem.switches && $gameVariables.setValue(bountyVariableId, $gameSystem._crimeData.totalBounty);
            
            // Show crime notification
            this.showCrimeNotification(crimeName, bountyAmount);
        }
        
        static addPresetCrime(crimeKey) {
            const crime = PresetCrimes[crimeKey];
            if (crime) {
                // Pass the crimeKey as the ID
                this.addCrime(crime.name, crime.bounty, crimeKey);
            } else {
                window.skipLocalization = true;
                $gameMessage.add(`\\C[2]${gettext('errorUnknown')}\\C[0] ${crimeKey}`);
                window.skipLocalization = false;

            }
        }
        
        static showPresetCrimes() {
            // Group crimes by category
            const categories = {};
            for (const [key, crime] of Object.entries(PresetCrimes)) {
                if (!categories[crime.category]) {
                    categories[crime.category] = [];
                }
                categories[crime.category].push({ key, ...crime });
            }
            
            let message = `\\C[3]${gettext('availableCrimes')}\\C[0]\n\n`;
            
            for (const [category, crimes] of Object.entries(categories)) {
                message += `\\C[1]${category}:\\C[0]\n`;
                crimes.forEach(crime => {
                    message += `• ${crime.name} - ${this.goldToEuros(crime.bounty)}\n`;
                });
                message += "\n";
            }
            window.skipLocalization = true;

            $gameMessage.add(message);
            window.skipLocalization = false;

        }
        
        static showCrimeNotification(crimeName, bountyAmount) {
            if (SceneManager._scene instanceof Scene_Map) {
                SceneManager._scene.showCrimeNotification(crimeName, bountyAmount);
            }
        }
        
        static showCrimeList() {
            this.initialize();
            
            const crimeData = $gameSystem._crimeData;
            let message = `\\C[2]${gettext('crimeRecord')}\\C[0]\n\n`;
            
            if (crimeData.crimes.length === 0) {
                message += gettext('noCrimes');
            } else {
                message += `${gettext('totalBounty')}: \\C[3]${this.goldToEuros(crimeData.totalBounty)}\\C[0]\n\n`;
                message += `\\C[1]${gettext('crimesCommitted')}\\C[0]\n`;

                crimeData.crimes.forEach((crime, index) => {
                    const timeStr = crime.timestamp ? ` [${crime.timestamp}]` : '';
                    message += `${index + 1}. ${crime.name} - ${this.goldToEuros(crime.bounty)}${timeStr}\n`;
                });
            }
            window.skipLocalization = true;

            $gameMessage.add(message);
            window.skipLocalization = false;

        }
        
        static clearBounty() {
            this.initialize();
            
            $gameSystem._crimeData = {
                crimes: [],
                totalBounty: 0
            };
            
            // Clear window.playerCrimes array
            window.playerCrimes = [];
            
            // Reset bounty variable
            $dataSystem.switches && $gameVariables.setValue(bountyVariableId, 0);
            window.skipLocalization = true;

            $gameMessage.add(`\\C[3]${gettext('bountyCleared')}\\C[0]\n${gettext('allCrimesForgi')}`);
            window.skipLocalization = false;

        }
        
        static goldToEuros(goldAmount) {
            const euros = (goldAmount / 1000) * 10;
            return euros.toFixed(2) + "€";
        }
        
        static getTotalBounty() {
            this.initialize();
            return $gameSystem._crimeData.totalBounty || 0;
        }
        
        static getPresetCrime(crimeKey) {
            return PresetCrimes[crimeKey] || null;
        }
        
        static getAllPresetCrimes() {
            return PresetCrimes;
        }
        
        static getPlayerCrimes() {
            this.initialize();
            return window.playerCrimes || [];
        }
    }
    
    // Crime Notification Window
    class Window_CrimeNotification extends Window_Base {
        initialize() {
            const rect = this.windowRect();
            super.initialize(rect);
            this.opacity = 0;
            this.contentsOpacity = 0;
            this._displayTimer = 0;
            this._crimeName = "";
            this._bountyAmount = 0;
            this.hide();
        }
        
        windowRect() {
            const width = 620;
            const height = 100;
            const x = 20;
            const y = 20;
            return new Rectangle(x, y, width, height);
        }
        
        showCrime(crimeName, bountyAmount) {
            this._crimeName = crimeName;
            this._bountyAmount = bountyAmount;
            this._displayTimer = displayDuration;
            this.show();
            this.refresh();
            
            // Fade in animation
            this.opacity = 0;
            this.contentsOpacity = 0;
            const fadeInDuration = 20;
            
            for (let i = 0; i <= fadeInDuration; i++) {
                setTimeout(() => {
                    this.opacity = (255 * i) / fadeInDuration;
                    this.contentsOpacity = (255 * i) / fadeInDuration;
                }, i * 16);
            }
        }
        
        refresh() {
            this.contents.clear();
            const totalBounty = CrimeSystem.getTotalBounty();
            
            // Draw crime name
            this.changeTextColor(ColorManager.textColor(2));
            this.drawText(this._crimeName, 0, 0, this.contents.width, 'left');
            
            // Draw bounty
            this.changeTextColor(ColorManager.textColor(3));
            const bountyText = CrimeSystem.goldToEuros(this._bountyAmount);
            this.drawText(bountyText, 0, 0, this.contents.width, 'right');
            
            // Draw total bounty
            this.changeTextColor(ColorManager.normalColor());
            const totalText = `${gettext('total')}: ${CrimeSystem.goldToEuros(totalBounty)}`;
            this.drawText(totalText, 0, this.lineHeight(), this.contents.width, 'center');
        }
        
        update() {
            super.update();
            
            if (this._displayTimer > 0) {
                this._displayTimer--;
                
                // Start fade out in last 30 frames
                if (this._displayTimer <= 30) {
                    const fadeRatio = this._displayTimer / 30;
                    this.opacity = 255 * fadeRatio;
                    this.contentsOpacity = 255 * fadeRatio;
                }
                
                if (this._displayTimer <= 0) {
                    this.hide();
                }
            }
        }
    }
    
    // Extend Scene_Map to handle crime notifications
    const _Scene_Map_createAllWindows = Scene_Map.prototype.createAllWindows;
    Scene_Map.prototype.createAllWindows = function() {
        _Scene_Map_createAllWindows.call(this);
        this.createCrimeNotificationWindow();
    };
    
    Scene_Map.prototype.createCrimeNotificationWindow = function() {
        const rect = new Rectangle(0, 0, 0, 0);
        this._crimeNotificationWindow = new Window_CrimeNotification(rect);
        this.addWindow(this._crimeNotificationWindow);
    };
    
    Scene_Map.prototype.showCrimeNotification = function(crimeName, bountyAmount) {
        if (this._crimeNotificationWindow) {
            this._crimeNotificationWindow.showCrime(crimeName, bountyAmount);
        }
    };
    
    // Plugin Commands
    PluginManager.registerCommand(pluginName, "addCrime", args => {
        const crimeName = String(args.crimeName);
        const bountyAmount = parseInt(args.bountyAmount);
        CrimeSystem.addCrime(crimeName, bountyAmount);
    });
    
    PluginManager.registerCommand(pluginName, "addPresetCrime", args => {
        const crimeType = String(args.crimeType);
        CrimeSystem.addPresetCrime(crimeType);
    });
    
    PluginManager.registerCommand(pluginName, "showPresetCrimes", args => {
        CrimeSystem.showPresetCrimes();
    });
    
    PluginManager.registerCommand(pluginName, "showCrimeList", args => {
        CrimeSystem.showCrimeList();
    });
    
    PluginManager.registerCommand(pluginName, "clearBounty", args => {
        CrimeSystem.clearBounty();
    });
    PluginManager.registerCommand(pluginName, "addCrimeFromVariable", args => {
        const crimeName = String(args.crimeName);
        const bountyAmount = $gameVariables.value(79);
        CrimeSystem.addCrime(crimeName, bountyAmount);
    });
    // Global access for script calls
    window.CrimeSystem = CrimeSystem;
    window.PresetCrimes = PresetCrimes;
    
    // Initialize on new game or load game
    const _DataManager_createGameObjects = DataManager.createGameObjects;
    DataManager.createGameObjects = function() {
        _DataManager_createGameObjects.call(this);
        CrimeSystem.initialize();
    };
    
    const _DataManager_makeSaveContents = DataManager.makeSaveContents;
    DataManager.makeSaveContents = function() {
        const contents = _DataManager_makeSaveContents.call(this);
        CrimeSystem.initialize();
        return contents;
    };
})();
/*:
 * @target MZ
 * @plugindesc Defines crimes data for other plugins to consume.
 * @help This just exposes PresetCrimes globally.
 */

(() => {
    // define your data
    const useTranslation = ConfigManager.language === 'it';

    const PresetCrimes = {
        // === THEFT CRIMES ===
        pettyTheft: { 
            name: useTranslation ? "Furto Minore" : "Petty Theft", 
            bounty: 50, 
            category: useTranslation ? "Furti" : "Theft" 
        },
        pickpocketing: { 
            name: useTranslation ? "Borseggio" : "Pickpocketing", 
            bounty: 75, 
            category: useTranslation ? "Furti" : "Theft" 
        },
        shoplifting: { 
            name: useTranslation ? "Taccheggio" : "Shoplifting", 
            bounty: 100, 
            category: useTranslation ? "Furti" : "Theft" 
        },
        burglary: { 
            name: useTranslation ? "Furto con Scasso" : "Burglary", 
            bounty: 500, 
            category: useTranslation ? "Furti" : "Theft" 
        },
        robbery: { 
            name: useTranslation ? "Rapina" : "Robbery", 
            bounty: 750, 
            category: useTranslation ? "Furti" : "Theft" 
        },
        armedRobbery: { 
            name: useTranslation ? "Rapina a Mano Armata" : "Armed Robbery", 
            bounty: 1500, 
            category: useTranslation ? "Furti" : "Theft" 
        },
        bankRobbery: { 
            name: useTranslation ? "Rapina in Banca" : "Bank Robbery", 
            bounty: 5000, 
            category: useTranslation ? "Furti" : "Theft" 
        },
        grandTheft: { 
            name: useTranslation ? "Furto Aggravato" : "Grand Theft", 
            bounty: 2000, 
            category: useTranslation ? "Furti" : "Theft" 
        },
        
        // === VIOLENT CRIMES ===
        assault: { 
            name: useTranslation ? "Aggressione" : "Assault", 
            bounty: 300, 
            category: useTranslation ? "Violenza" : "Violence" 
        },
        battery: { 
            name: useTranslation ? "Percosse" : "Battery", 
            bounty: 400, 
            category: useTranslation ? "Violenza" : "Violence" 
        },
        aggravatedAssault: { 
            name: useTranslation ? "Aggressione Aggravata" : "Aggravated Assault", 
            bounty: 800, 
            category: useTranslation ? "Violenza" : "Violence" 
        },
        murder: { 
            name: useTranslation ? "Omicidio" : "Murder", 
            bounty: 10000, 
            category: useTranslation ? "Violenza" : "Violence" 
        },
        manslaughter: { 
            name: useTranslation ? "Omicidio Colposo" : "Manslaughter", 
            bounty: 6000, 
            category: useTranslation ? "Violenza" : "Violence" 
        },
        serialKilling: { 
            name: useTranslation ? "Omicidio Seriale" : "Serial Killing", 
            bounty: 25000, 
            category: useTranslation ? "Violenza" : "Violence" 
        },
        
        // === PROPERTY CRIMES ===
        vandalism: { 
            name: useTranslation ? "Vandalismo" : "Vandalism", 
            bounty: 150, 
            category: useTranslation ? "Proprietà" : "Property" 
        },
        graffiti: { 
            name: useTranslation ? "Graffiti" : "Graffiti", 
            bounty: 75, 
            category: useTranslation ? "Proprietà" : "Property" 
        },
        arson: { 
            name: useTranslation ? "Incendio Doloso" : "Arson", 
            bounty: 2500, 
            category: useTranslation ? "Proprietà" : "Property" 
        },
        propertyDestruction: { 
            name: useTranslation ? "Distruzione di Proprietà" : "Property Destruction", 
            bounty: 400, 
            category: useTranslation ? "Proprietà" : "Property" 
        },
        
        // === PUBLIC ORDER CRIMES ===
        publicDisturbance: { 
            name: useTranslation ? "Disturbo della Quiete Pubblica" : "Public Disturbance", 
            bounty: 25, 
            category: useTranslation ? "Ordine Pubblico" : "Public Order" 
        },
        disorderlyConduct: { 
            name: useTranslation ? "Condotta Disordinata" : "Disorderly Conduct", 
            bounty: 50, 
            category: useTranslation ? "Ordine Pubblico" : "Public Order" 
        },
        trespassing: { 
            name: useTranslation ? "Violazione di Domicilio" : "Trespassing", 
            bounty: 100, 
            category: useTranslation ? "Ordine Pubblico" : "Public Order" 
        },
        breakingAndEntering: { 
            name: useTranslation ? "Effrazione" : "Breaking and Entering", 
            bounty: 350, 
            category: useTranslation ? "Ordine Pubblico" : "Public Order" 
        },
        unlawfulEntry: { 
            name: useTranslation ? "Ingresso Illegale" : "Unlawful Entry", 
            bounty: 200, 
            category: useTranslation ? "Ordine Pubblico" : "Public Order" 
        },
        
        // === DRUG CRIMES ===
        drugPossession: { 
            name: useTranslation ? "Possesso di Droga" : "Drug Possession", 
            bounty: 200, 
            category: useTranslation ? "Droghe" : "Drugs" 
        },
        drugDealing: { 
            name: useTranslation ? "Spaccio di Droga" : "Drug Dealing", 
            bounty: 1000, 
            category: useTranslation ? "Droghe" : "Drugs" 
        },
        drugTrafficking: { 
            name: useTranslation ? "Traffico di Droga" : "Drug Trafficking", 
            bounty: 5000, 
            category: useTranslation ? "Droghe" : "Drugs" 
        },
        smuggling: { 
            name: useTranslation ? "Contrabbando" : "Smuggling", 
            bounty: 3000, 
            category: useTranslation ? "Droghe" : "Drugs" 
        },
        contraband: { 
            name: useTranslation ? "Possesso di Contrabbando" : "Contraband Possession", 
            bounty: 500, 
            category: useTranslation ? "Droghe" : "Drugs" 
        },
        
        // === WHITE COLLAR CRIMES ===
        fraud: { 
            name: useTranslation ? "Frode" : "Fraud", 
            bounty: 1500, 
            category: useTranslation ? "Colletto Bianco" : "White Collar" 
        },
        embezzlement: { 
            name: useTranslation ? "Appropriazione Indebita" : "Embezzlement", 
            bounty: 2000, 
            category: useTranslation ? "Colletto Bianco" : "White Collar" 
        },
        bribery: { 
            name: useTranslation ? "Corruzione" : "Bribery", 
            bounty: 1200, 
            category: useTranslation ? "Colletto Bianco" : "White Collar" 
        },
        corruption: { 
            name: useTranslation ? "Corruzione" : "Corruption", 
            bounty: 3000, 
            category: useTranslation ? "Colletto Bianco" : "White Collar" 
        },
        taxEvasion: { 
            name: useTranslation ? "Evasione Fiscale" : "Tax Evasion", 
            bounty: 2500, 
            category: useTranslation ? "Colletto Bianco" : "White Collar" 
        },
        moneyLaundering: { 
            name: useTranslation ? "Riciclaggio di Denaro" : "Money Laundering", 
            bounty: 4000, 
            category: useTranslation ? "Colletto Bianco" : "White Collar" 
        },
        forgery: { 
            name: useTranslation ? "Falsificazione" : "Forgery", 
            bounty: 800, 
            category: useTranslation ? "Colletto Bianco" : "White Collar" 
        },
        counterfeiting: { 
            name: useTranslation ? "Contraffazione" : "Counterfeiting", 
            bounty: 1500, 
            category: useTranslation ? "Colletto Bianco" : "White Collar" 
        },
        identityTheft: { 
            name: useTranslation ? "Furto d'Identità" : "Identity Theft", 
            bounty: 1000, 
            category: useTranslation ? "Colletto Bianco" : "White Collar" 
        },
        
        // === CYBER CRIMES ===
        cybercrime: { 
            name: useTranslation ? "Crimine Informatico" : "Cybercrime", 
            bounty: 1200, 
            category: useTranslation ? "Informatica" : "Cyber" 
        },
        hacking: { 
            name: useTranslation ? "Hacking Informatico" : "Computer Hacking", 
            bounty: 2000, 
            category: useTranslation ? "Informatica" : "Cyber" 
        },
        dataTheft: { 
            name: useTranslation ? "Furto di Dati" : "Data Theft", 
            bounty: 1800, 
            category: useTranslation ? "Informatica" : "Cyber" 
        },
        piracy: { 
            name: useTranslation ? "Pirateria Digitale" : "Digital Piracy", 
            bounty: 300, 
            category: useTranslation ? "Informatica" : "Cyber" 
        },
        
        // === ORGANIZED CRIME ===
        extortion: { 
            name: useTranslation ? "Estorsione" : "Extortion", 
            bounty: 2000, 
            category: useTranslation ? "Crimine Organizzato" : "Organized Crime" 
        },
        blackmail: { 
            name: useTranslation ? "Ricatto" : "Blackmail", 
            bounty: 1500, 
            category: useTranslation ? "Crimine Organizzato" : "Organized Crime" 
        },
        kidnapping: { 
            name: useTranslation ? "Sequestro di Persona" : "Kidnapping", 
            bounty: 8000, 
            category: useTranslation ? "Crimine Organizzato" : "Organized Crime" 
        },
        hostage: { 
            name: useTranslation ? "Presa di Ostaggi" : "Hostage Taking", 
            bounty: 7000, 
            category: useTranslation ? "Crimine Organizzato" : "Organized Crime" 
        },
        humanTrafficking: { 
            name: useTranslation ? "Tratta di Esseri Umani" : "Human Trafficking", 
            bounty: 15000, 
            category: useTranslation ? "Crimine Organizzato" : "Organized Crime" 
        },
        slavery: { 
            name: useTranslation ? "Schiavitù" : "Slavery", 
            bounty: 12000, 
            category: useTranslation ? "Crimine Organizzato" : "Organized Crime" 
        },
        
        // === ENVIRONMENTAL CRIMES ===
        poaching: { 
            name: useTranslation ? "Bracconaggio" : "Poaching", 
            bounty: 400, 
            category: useTranslation ? "Ambientali" : "Environmental" 
        },
        illegalHunting: { 
            name: useTranslation ? "Caccia Illegale" : "Illegal Hunting", 
            bounty: 300, 
            category: useTranslation ? "Ambientali" : "Environmental" 
        },
        animalCruelty: { 
            name: useTranslation ? "Maltrattamento di Animali" : "Animal Cruelty", 
            bounty: 600, 
            category: useTranslation ? "Ambientali" : "Environmental" 
        },
        environmentalCrime: { 
            name: useTranslation ? "Crimine Ambientale" : "Environmental Crime", 
            bounty: 2000, 
            category: useTranslation ? "Ambientali" : "Environmental" 
        },
        pollutionViolation: { 
            name: useTranslation ? "Violazione Inquinamento" : "Pollution Violation", 
            bounty: 1500, 
            category: useTranslation ? "Ambientali" : "Environmental" 
        },
        illegalDumping: { 
            name: useTranslation ? "Smaltimento Illegale" : "Illegal Dumping", 
            bounty: 800, 
            category: useTranslation ? "Ambientali" : "Environmental" 
        },
        
        // === TRAFFIC CRIMES ===
        speedingMinor: { 
            name: useTranslation ? "Eccesso di Velocità Minore" : "Minor Speeding", 
            bounty: 25, 
            category: useTranslation ? "Traffico" : "Traffic" 
        },
        speedingMajor: { 
            name: useTranslation ? "Eccesso di Velocità Grave" : "Major Speeding", 
            bounty: 150, 
            category: useTranslation ? "Traffico" : "Traffic" 
        },
        recklessDriving: { 
            name: useTranslation ? "Guida Spericolata" : "Reckless Driving", 
            bounty: 300, 
            category: useTranslation ? "Traffico" : "Traffic" 
        },
        dui: { 
            name: useTranslation ? "Guida in Stato di Ebbrezza" : "Driving Under Influence", 
            bounty: 800, 
            category: useTranslation ? "Traffico" : "Traffic" 
        },
        hitAndRun: { 
            name: useTranslation ? "Omissione di Soccorso" : "Hit and Run", 
            bounty: 1200, 
            category: useTranslation ? "Traffico" : "Traffic" 
        },
        vehicleTheft: { 
            name: useTranslation ? "Furto di Veicolo" : "Vehicle Theft", 
            bounty: 1000, 
            category: useTranslation ? "Traffico" : "Traffic" 
        },
        carjacking: { 
            name: useTranslation ? "Rapina di Auto" : "Carjacking", 
            bounty: 2500, 
            category: useTranslation ? "Traffico" : "Traffic" 
        },
        illegalRacing: { 
            name: useTranslation ? "Corsa Clandestina" : "Illegal Street Racing", 
            bounty: 500, 
            category: useTranslation ? "Traffico" : "Traffic" 
        },
        
        // === MINOR OFFENSES ===
        publicIntoxication: { 
            name: useTranslation ? "Ubriachezza in Pubblico" : "Public Intoxication", 
            bounty: 50, 
            category: useTranslation ? "Reati Minori" : "Minor Offenses" 
        },
        underageDrinking: { 
            name: useTranslation ? "Consumo di Alcol Minorenne" : "Underage Drinking", 
            bounty: 75, 
            category: useTranslation ? "Reati Minori" : "Minor Offenses" 
        },
        disturbing: { 
            name: useTranslation ? "Disturbo della Pace" : "Disturbing the Peace", 
            bounty: 40, 
            category: useTranslation ? "Reati Minori" : "Minor Offenses" 
        },
        loitering: { 
            name: useTranslation ? "Vagabondaggio" : "Loitering", 
            bounty: 20, 
            category: useTranslation ? "Reati Minori" : "Minor Offenses" 
        },
        jaywalking: { 
            name: useTranslation ? "Attraversamento Improprio" : "Jaywalking", 
            bounty: 15, 
            category: useTranslation ? "Reati Minori" : "Minor Offenses" 
        },
        littering: { 
            name: useTranslation ? "Abbandono di Rifiuti" : "Littering", 
            bounty: 25, 
            category: useTranslation ? "Reati Minori" : "Minor Offenses" 
        },
        noisePollution: { 
            name: useTranslation ? "Inquinamento Acustico" : "Noise Pollution", 
            bounty: 35, 
            category: useTranslation ? "Reati Minori" : "Minor Offenses" 
        },
        
        // === JUDICIAL CRIMES ===
        perjury: { 
            name: useTranslation ? "Spergiuro" : "Perjury", 
            bounty: 1000, 
            category: useTranslation ? "Giudiziari" : "Judicial" 
        },
        contemptOfCourt: { 
            name: useTranslation ? "Oltraggio alla Corte" : "Contempt of Court", 
            bounty: 300, 
            category: useTranslation ? "Giudiziari" : "Judicial" 
        },
        obstructingJustice: { 
            name: useTranslation ? "Ostacolo alla Giustizia" : "Obstructing Justice", 
            bounty: 800, 
            category: useTranslation ? "Giudiziari" : "Judicial" 
        },
        resistingArrest: { 
            name: useTranslation ? "Resistenza all'Arresto" : "Resisting Arrest", 
            bounty: 200, 
            category: useTranslation ? "Giudiziari" : "Judicial" 
        },
        escapingCustody: { 
            name: useTranslation ? "Fuga dalla Custodia" : "Escaping Custody", 
            bounty: 1500, 
            category: useTranslation ? "Giudiziari" : "Judicial" 
        },
        prisonBreak: { 
            name: useTranslation ? "Evasione dal Carcere" : "Prison Break", 
            bounty: 5000, 
            category: useTranslation ? "Giudiziari" : "Judicial" 
        },
        
        // === WEAPONS CRIMES ===
        weaponsPossession: { 
            name: useTranslation ? "Possesso Illegale di Armi" : "Illegal Weapons Possession", 
            bounty: 600, 
            category: useTranslation ? "Armi" : "Weapons" 
        },
        illegalWeapons: { 
            name: useTranslation ? "Fabbricazione Illegale di Armi" : "Illegal Weapons Manufacturing", 
            bounty: 2000, 
            category: useTranslation ? "Armi" : "Weapons" 
        },
        weaponsTrafficking: { 
            name: useTranslation ? "Traffico di Armi" : "Weapons Trafficking", 
            bounty: 4000, 
            category: useTranslation ? "Armi" : "Weapons" 
        },
        
        // === SERIOUS CRIMES AGAINST STATE ===
        terrorism: { 
            name: useTranslation ? "Terrorismo" : "Terrorism", 
            bounty: 50000, 
            category: useTranslation ? "Crimini contro lo Stato" : "State Crimes" 
        },
        treason: { 
            name: useTranslation ? "Alto Tradimento" : "Treason", 
            bounty: 30000, 
            category: useTranslation ? "Crimini contro lo Stato" : "State Crimes" 
        },
        espionage: { 
            name: useTranslation ? "Spionaggio" : "Espionage", 
            bounty: 20000, 
            category: useTranslation ? "Crimini contro lo Stato" : "State Crimes" 
        },
        warCrimes: { 
            name: useTranslation ? "Crimini di Guerra" : "War Crimes", 
            bounty: 100000, 
            category: useTranslation ? "Crimini contro lo Stato" : "State Crimes" 
        },
        genocide: { 
            name: useTranslation ? "Genocidio" : "Genocide", 
            bounty: 500000, 
            category: useTranslation ? "Crimini contro lo Stato" : "State Crimes" 
        },
        crimesAgainstHumanity: { 
            name: useTranslation ? "Crimini contro l'Umanità" : "Crimes Against Humanity", 
            bounty: 250000, 
            category: useTranslation ? "Crimini contro lo Stato" : "State Crimes" 
        }
    };
    // expose under a single namespace to avoid polluting global too badly
    window.CrimeData = {
        PresetCrimes    };
  })();
  
//=============================================================================
// FastTravelSystem.js
// Version: 1.7.0 (Persistent Travel Timer + Fuel System)
//=============================================================================

/*:
 * @target MZ
 * @plugindesc Fast Travel System v1.7.0
 * @author Omni-Lex (Reworked by OmniLex, Enhanced with Persistent Timer)
 * @version 1.7.0
 * @description A comprehensive fast travel system with persistent travel countdown, travel maps, manual completion, and fuel system.
 *
 * @param baseDistancePrice
 * @text Base Distance Price
 * @desc Base price per distance unit (in gold)
 * @type number
 * @default 10
 *
 * @param playerXVar
 * @text Player X Variable
 * @desc Variable ID that stores player X position
 * @type variable
 * @default 43
 *
 * @param playerYVar
 * @text Player Y Variable
 * @desc Variable ID that stores player Y position
 * @type variable
 * @default 44
 *
 * @param maxTravelTime
 * @text Max Travel Time
 * @desc Maximum travel time in seconds
 * @type number
 * @default 120
 *
 * @param fuelVar
 * @text Fuel Variable
 * @desc Variable ID that stores current fuel liters
 * @type variable
 * @default 65
 * 
* @param carFuelVar
 * @text Car Fuel Variable
 * @desc Variable ID that stores current fuel liters
 * @type variable
 * @default 71
 *
 * @param fuelCapacity
 * @text Fuel Tank Capacity
 * @desc Maximum fuel capacity in liters (RV camper capacity)
 * @type number
 * @default 100
 * 
 * @param carFuelCapacity
 * @text Fuel Tank Capacity
 * @desc Maximum fuel capacity in liters (Car capacity)
 * @type number
 * @default 60
 *
 * @param fuelConsumptionRate
 * @text Fuel Consumption Rate
 * @desc Liters consumed per distance unit for car sharing
 * @type number
 * @decimals 2
 * @default 0.1
 *
 * @command RefuelMax
 * @text Refuel to Maximum
 * @desc Instantly refuels the vehicle to maximum capacity if you have enough money.
 * @command StartFastTravel
 * @text Start Fast Travel
 * @desc Opens the fast travel destination window directly.
 *
 * @arg transportType
 * @text Transport Type
 * @desc The type of transportation to use
 * @type select
 * @option Walking
 * @value walking
 * @option Bicycle
 * @value bicycle
 * @option Horse
 * @value horse
 * @option Car Sharing
 * @value carsharing
 * @option Camper
 * @value camper
 * @option Bus
 * @value bus
 * @option Train
 * @value train
 * @option Taxi
 * @value taxi
 * @option Boat
 * @value boat
 * @option Ferry
 * @value ferry
 * @option Airplane (Economy)
 * @value airplane_economy
 * @option Airplane (Business)
 * @value airplane_business
 * @option Private Jet
 * @value private_jet
 * @option Limousine
 * @value limousine
 * @option Helicopter
 * @value helicopter
 * @option Cruise Ship
 * @value cruise
 * @option Submarine
 * @value submarine
 * @option Hot Air Balloon
 * @value balloon
 * @option Zeppelin
 * @value zeppelin
 * @option Magic Carpet
 * @value magic_carpet
 * @option Dragon Mount
 * @value dragon
 * @option Teleportation Circle
 * @value teleport_circle
 * @option Hypermetro Network
 * @value hypermetro
 * @option Maglev Train
 * @value maglev
 * @option Hyperloop
 * @value hyperloop
 * @option Low Orbit Starship
 * @value starship
 * @option Wormhole Portal
 * @value wormhole
 * @option Quantum Teleportation
 * @value quantum
 * @option Time Machine
 * @value time_machine
 * @option Dimensional Gateway
 * @value dimensional
 * @default walking
 *
 * @command RefreshDestinations
 * @text Refresh Destinations
 * @desc Forces a refresh of the destination cache (use after adding new teleport events).
 *
 * @command EndTravel
 * @text End Travel
 * @desc Completes the travel when called on a transportation map after timer reaches zero.
 * 
 * @command EndTravelCamper
 * @text End Travel Camper
 * @desc Completes the travel when called on a transportation map after timer reaches zero.
 * 
 * 
 * @command EndTravelCar
 * @text End Travel Car
 * @desc Completes the travel when called on a transportation map after timer reaches zero.
 *
 * @command EndTravelAirship
 * @text End Travel Airship
 * @desc Completes the travel when called on a transportation map after timer reaches zero.
 *
 * @command TeleportToAirship
 * @text Teleport To Airship
 * @desc Teleports the player to the airship's current location on map 315.
 *
 * @command TeleportToAirshipAndRide
 * @text Teleport To Airship And Ride
 * @desc Teleports the player to the airship's location and boards it.
 *
 * @command ShowRefuelWindow
 * @text Show Refuel Window
 * @desc Opens the refueling window for car sharing.
 *
 * @command ShowDestinationPicture
 * @text Show Destination Picture
 * @desc Shows a picture window for the specified destination.
 *
 * @arg locationName
 * @text Location Name
 * @desc The name of the location to display
 * @type text
 * @default Antwerpen
 *
 * @command HideDestinationPicture
 * @text Hide Destination Picture
 * @desc Hides the destination picture window.
 *
 * @command TutorialStation
 * @text Tutorial Station
 * @desc Opens the fast travel destination window via train, restricted to Ghent and Omega Tower.
 *
 * @help FastTravelSystem.js (v1.7.0)
 *
 * * New in v1.7.0:
 * - Completely refactored timer system to be truly persistent across all scenes
 * - Timer window now stays visible when opening menus, battles, or other scenes
 * - Travel data is now stored in $gameSystem for complete persistence
 * - Improved timer synchronization and refresh logic
 * - Fixed timer disappearing issues during gameplay
 *
 * * Features from v1.6.0:
 * - Car sharing uses fuel instead of money for travel costs
 * - Added fuel system with RV camper capacity (100 liters)
 * - Added refueling window accessible via plugin command
 * - Fuel price is influenced by Variable 53
 * - Fuel consumption rate: 0.1 liters per distance unit
 *
 * * Core Features:
 * - Events with names starting with "Teleport" are destinations
 * - Player is first teleported to a travel map specific to the transport type
 * - Persistent timer that survives menu operations and scene changes
 * - Travel costs are calculated based on distance and transport type
 * - Car sharing uses fuel instead of money
 * - Use the "EndTravel" command to complete travel once timer reaches zero
 * - Use the "ShowRefuelWindow" command to refuel your vehicle
 */

(() => {
    'use strict';
    
    const pluginName = 'FastTravelSystem';
    const parameters = PluginManager.parameters(pluginName);
    const baseDistancePrice = parseInt(parameters['baseDistancePrice']) || 10;
    const playerXVar = parseInt(parameters['playerXVar']) || 43;
    const playerYVar = parseInt(parameters['playerYVar']) || 44;
    const maxTravelTime = parseInt(parameters['maxTravelTime']) || 600;
    const fuelVar = parseInt(parameters['fuelVar']) || 65;
    const carFuelVar = parseInt(parameters['carFuelVar']) || 71;

    const fuelCapacity = parseInt(parameters['fuelCapacity']) || 100;
    const carFuelCapacity = parseInt(parameters['carFuelCapacity']) || 100;

    const fuelConsumptionRate = parseFloat(parameters['fuelConsumptionRate']) || 0.1;
    
    // Base time in seconds it takes to travel one tile. Used in timer calculation.
    const baseTimePerTile = 0.15;
const TRANSPORT_DESTINATIONS = {
    "Antwerpen": {
        "base": {"x":88, "y":118},
        "train": { "mapId": 1043, "x": 14, "y": 1 },
        "picture": "Antwerpen"
    },
    "Frozen Station": {
        "base": {"x":66, "y":92},
        "train": { "mapId": 1414, "x": 23, "y": 23 },
        "picture": "FrozenStation"
    },
    "GreenWitch": {
        "base": {"x":62, "y":117},
        "train": { "mapId": 596, "x": 23, "y": 23 },
        "picture": "GreenWitch"
    },
    "Ghent": {
        "base": {"x":84, "y":120},
        "train": { "mapId": 708, "x": 25, "y": 12 },
        "bus": { "mapId": 704, "x": 29, "y": 25 },
        "helicopter": { "mapId": 1036, "x": 53, "y": 55 },
        "picture": "Ghent"
    },
    "Omega Tower": {
        "base": {"x":79, "y":125},
        "train": { "mapId": 102, "x": 39, "y": 7 },
        "bus": { "mapId": 136, "x": 40, "y": 118 },
        "helicopter": { "mapId": 540, "x": 31, "y": 48 },
        "picture": "OmegaTower"
    },
    "Luxembourg": {
        "base": {"x":101, "y":128},
        "bus": { "mapId": 600, "x": 19, "y": 72 },
        "picture": "Luxembourg"
    },
    "Amsterdam": {
        "base": {"x":91, "y":109},
        "picture": "Amsterdam"
    },
    "The Hague": {
        "base": {"x":87, "y":111},
        "picture": "TheHague"
    },
    "Rotterdam": {
        "base": {"x":92, "y":112},
        "picture": "Rotterdam"
    },
    "Ouddorp": {
        "base": {"x":87, "y":113},
        "picture": "Ouddorp"
    },
    "Middelburg": {
        "base": {"x":85, "y":11},
        "picture": "Middelburg"
    },
    "Harlem": {
        "base": {"x":88, "y":108},
        "picture": "Harlem"
    },
    "Alkmaar": {
        "base": {"x":89, "y":105},
        "picture": "Alkmaar"
    },
    "Leeuwarden": {
        "base": {"x":96, "y":101},
        "picture": "Leeuwarden"
    },
    "Groningen": {
        "base": {"x":103, "y":102},
        "picture": "Groningen"
    },
    "Limburg": {
        "base": {"x":100, "y":119},
        "picture": "Limburg"
    },
    "Eindhoven": {
        "base": {"x":97, "y":113},
        "picture": "Eindhoven"
    },
    "Zwolle": {
        "base": {"x":102, "y":108},
        "picture": "Zwolle"
    },
    "Tritunnel Ovest": {
        "base": {"x":83, "y":116},
        "picture": "TritunnelOvest"
    },
    "Charleroi": {
        "base": {"x":94, "y":125},
        "picture": "Charleroi"
    },
    "Luik": {
        "base": {"x":94, "y":119},
        "picture": "Luik"
    },
    "Bologna": {
        "base": {"x":124, "y":168},
        "picture": "Bologna"
    },
    "Super sacred shrine": {
        "base": {"x":97, "y":142}
    },
    "London": {
        "base": {"x":66, "y":112}
    },
    "MAXGauntlet": {
        "base": {"x":111, "y":163}
    },
    "Vatican Citadel": {
        "base": {"x":126, "y":187}
    },
    "MAXTavern": {
        "base": {"x":115, "y":161}
    },
    "Cardiff": {
        "base": {"x":52, "y":111}
    },
    "Milano": {
        "base": {"x":121, "y":161}
    },
    "Canicattini Bagni": {
        "base": {"x":130, "y":223}
    },
    "Casalpusterlengo": {
        "base": {"x":117, "y":163}
    },
    "Plymouth": {
        "base": {"x":48, "y":120}
    },
    "Canterbury": {
        "base": {"x":73, "y":119}
    },
    "Brighton": {
        "base": {"x":66, "y":120}
    },
    "Boston": {
        "base": {"x":68, "y":105}
    },
    "Manchester": {
        "base": {"x":62, "y":101}
    },
    "Birmingham": {
        "base": {"x":57, "y":108}
    },
    "Edinburgh": {
        "base": {"x":62, "y":89}
    },
    "Glasgow": {
        "base": {"x":58, "y":90}
    },
    "Perth": {
        "base": {"x":61, "y":86}
    },
    "Oban": {
        "base": {"x":53, "y":82}
    },
    "Aberdeen": {
        "base": {"x":64, "y":82}
    },
    "Petrocave": {
        "base": {"x":88, "y":131}
    },
    "Belfast": {
        "base": {"x":42, "y":85}
    },
    "Roma": {
        "base": {"x":126, "y":186}
    },
    "Messina": {
        "base": {"x":134, "y":218}
    },
    "Londonderry": {
        "base": {"x":37, "y":82}
    },
    "Sligo": {
        "base": {"x":36, "y":85}
    },
    "Reggio Calabria": {
        "base": {"x":136, "y":215}
    },
    "Alba Adriatica": {
        "base": {"x":137, "y":180}
    },
    "Dublin": {
        "base": {"x":43, "y":92}
    },
    "Wexford": {
        "base": {"x":43, "y":96}
    },
    "Cork": {
        "base": {"x":37, "y":100}
    },
    "Tritunnel East": {
        "base": {"x":73, "y":111}
    },
    "Killarney": {
        "base": {"x":33, "y":101}
    },
    "Brusselles": {
        "base": {"x":89, "y":121}
    },
    "Reykyavik": {
        "base": {"x":49, "y":24}
    },
    "Dark tower": {
        "base": {"x":81, "y":129}
    },
    "Kalfafell": {
        "base": {"x":56, "y":25}
    },
    "Laugar": {
        "base": {"x":60, "y":20}
    },
    "Hvammstangi": {
        "base": {"x":50, "y":21}
    },
    "Klasvik": {
        "base": {"x":76, "y":41}
    },
    "Gasadalur": {
        "base": {"x":71, "y":42}
    },
    "Torshavn": {
        "base": {"x":73, "y":45}
    },
    "Sandvik": {
        "base": {"x":71, "y":50}
    },
    "Crabby Beach": {
        "base": {"x":85, "y":116}
    },
    "Madrid": {
        "base": {"x":49, "y":188}
    },
    "Granada": {
        "base": {"x":54, "y":205}
    },
    "Valencia": {
        "base": {"x":70, "y":199}
    },
    "Genova": {
        "base": {"x":110, "y":171}
    },
    "La Spezia": {
        "base": {"x":118, "y":171}
    },
    "Pisa": {
        "base": {"x":119, "y":175}
    },
    "Livorno": {
        "base": {"x":118, "y":178}
    },
    "Frosinone": {
        "base": {"x":133, "y":185}
    },
    "Napoli": {
        "base": {"x":135, "y":194}
    },
    "Capri": {
        "base": {"x":134, "y":196}
    },
    "Taranto": {
        "base": {"x":151, "y":200}
    },
    "Catanzaro": {
        "base": {"x":144, "y":210}
    },
    "Cosenza": {
        "base": {"x":144, "y":201}
    },
    "Lecce": {
        "base": {"x":154, "y":199}
    },
    "Ancona": {
        "base": {"x":134, "y":176}
    },
    "San Marino": {
        "base": {"x":129, "y":176}
    },
    "Verona": {
        "base": {"x":125, "y":161}
    },
    "Venezia": {
        "base": {"x":136, "y":163}
    },
    "Torino": {
        "base": {"x":113, "y":162}
    },
    "Lucca": {
        "base": {"x":121, "y":173}
    },
    "Firenze": {
        "base": {"x":123, "y":174}
    },
    "L'Aquila": {
        "base": {"x":135, "y":181}
    },
    "Latina": {
        "base": {"x":127, "y":188}
    },
    "Amalfi": {
        "base": {"x":137, "y":196}
    },
    "Sorrento": {
        "base": {"x":139, "y":196}
    },
    "Crotone": {
        "base": {"x":148, "y":208}
    },
    "Catania": {
        "base": {"x":133, "y":222}
    },
    "Siracusa": {
        "base": {"x":132, "y":225}
    },
    "Palermo": {
        "base": {"x":125, "y":219}
    },
    "Marsala": {
        "base": {"x":123, "y":221}
    },
    "Lampedusa": {
        "base": {"x":120, "y":228}
    },
    "Agrigento": {
        "base": {"x":127, "y":223}
    },
    "Cagliari": {
        "base": {"x":105, "y":210}
    },
    "Sassari": {
        "base": {"x":106, "y":201}
    },
    "Tunisi": {
        "base": {"x":105, "y":226}
    },
    "Biserta": {
        "base": {"x":102, "y":223}
    },
    "Tripoli": {
        "base": {"x":125, "y":253}
    },
    "Algeri": {
        "base": {"x":59, "y":228}
    },
    "Atene": {
        "base": {"x":204, "y":224}
    },
    "Instanbul": {
        "base": {"x":237, "y":194}
    },
    "Corfù": {
        "base": {"x":151, "y":179}
    },
    "Odessa": {
        "base": {"x":232, "y":147}
    },
    "Berlin": {
        "base": {"x":135, "y":109}
    },
    "Copenaghen": {
        "base": {"x":144, "y":78}
    },
    "Malmo": {
        "base": {"x":148, "y":68}
    },
    "Oslo": {
        "base": {"x":131, "y":45}
    },
    "Paris": {
        "base": {"x":79, "y":139}
    },
    "Marsiglia": {
        "base": {"x":88, "y":166}
    },
    "Bordeaux": {
        "base": {"x":67, "y":160}
    },
    "Brest": {
        "base": {"x":53, "y":144}
    },
    "Berna": {
        "base": {"x":117, "y":151}
    },
    "Ginevra": {
        "base": {"x":105, "y":157}
    },
    "Zermatt": {
        "base": {"x":112, "y":157}
    },
    "Lugano": {
        "base": {"x":115, "y":155}
    },
    "Liechtenstein": {
        "base": {"x":128, "y":153}
    },
    "Zurigo": {
        "base": {"x":118, "y":148}
    },
    "Basilea": {
        "base": {"x":112, "y":147}
    },
    "Le Havre": {
        "base": {"x":75, "y":130}
    },
    "Orleans": {
        "base": {"x":80, "y":147}
    },
    "Le Mans": {
        "base": {"x":73, "y":144}
    },
    "Saint Helier": {
        "base": {"x":58, "y":136}
    },
    "Jersey": {
        "base": {"x":56, "y":135}
    },
    "Guernsey": {
        "base": {"x":52, "y":131}
    },
    "Palma di Maiorca": {
        "base": {"x":82, "y":194}
    },
    "Ivissa": {
        "base": {"x":80, "y":198}
    },
    "Minorca": {
        "base": {"x":88, "y":191}
    },
    "Barcellona": {
        "base": {"x":77, "y":184}
    },
    "Saragozza": {
        "base": {"x":63, "y":184}
    },
    "Siviglia": {
        "base": {"x":39, "y":205}
    },
    "Lisbona": {
        "base": {"x":22, "y":192}
    },
    "Porto": {
        "base": {"x":25, "y":179}
    },
    "Santiago di Compostela": {
        "base": {"x":34, "y":167}
    },
    "Pola": {
        "base": {"x":146, "y":172}
    },
    "Zara": {
        "base": {"x":152, "y":176}
    },
    "Sarajevo": {
        "base": {"x":168, "y":175}
    },
    "Belgrado": {
        "base": {"x":178, "y":165}
    },
    "Novi Sad": {
        "base": {"x":170, "y":157}
    },
    "Tirana": {
        "base": {"x":175, "y":196}
    },
    "Sofia": {
        "base": {"x":209, "y":190}
    },
    "Bucarest": {
        "base": {"x":207, "y":168}
    },
    "Costanza": {
        "base": {"x":226, "y":169}
    },
    "Roccalonga": {
        "base": {"x":147, "y":192}
    }
};
    const travelMaps = {
        walking: { mapId: 0, x: 10, y: 10 },
        bicycle: { mapId: 0, x: 10, y: 10 },
        horse: { mapId: 0, x: 10, y: 10 },
        carsharing: { mapId: 0, x: 10, y: 10 },
        camper: { mapId: 0, x: 10, y: 10 },
        bus: { mapId: 719, x: 8, y: 7 },
        train: { mapId: 718, x: 7, y: 7 },
        taxi: { mapId: 720, x: 10, y: 10 },
        boat: { mapId: 0, x: 10, y: 10 },
        ferry: { mapId: 0, x: 10, y: 10 },
        airplane_economy: { mapId: 0, x: 10, y: 10 },
        airplane_business: { mapId: 0, x: 10, y: 10 },
        private_jet: { mapId: 0, x: 10, y: 10 },
        limousine: { mapId: 0, x: 10, y: 10 },
        helicopter: { mapId: 0, x: 10, y: 10 },
        cruise: { mapId: 0, x: 10, y: 10 },
        submarine: { mapId: 0, x: 10, y: 10 },
        balloon: { mapId: 0, x: 10, y: 10 },
        zeppelin: { mapId: 0, x: 10, y: 10 },
        magic_carpet: { mapId: 0, x: 10, y: 10 },
        dragon: { mapId: 0, x: 10, y: 10 },
        teleport_circle: { mapId: 0, x: 10, y: 10 },
        hypermetro: { mapId: 0, x: 10, y: 10 },
        maglev: { mapId: 0, x: 10, y: 10 },
        hyperloop: { mapId: 0, x: 10, y: 10 },
        starship: { mapId: 0, x: 10, y: 10 },
        wormhole: { mapId: 0, x: 10, y: 10 },
        quantum: { mapId: 0, x: 10, y: 10 },
        time_machine: { mapId: 0, x: 10, y: 10 },
        dimensional: { mapId: 0, x: 10, y: 10 }
    };

    const transportMultipliers = {
        walking: 0.0, bicycle: 0.1, horse: 0.5, carsharing: 0.0, camper: 0.0, // Car sharing now costs no money
        bus: 0.8, train: 1.2, taxi: 2.5, boat: 1.5, ferry: 1.3, airplane_economy: 3.0,
        airplane_business: 6.0, private_jet: 25.0, limousine: 5.0, helicopter: 1.0,
        cruise: 8.0, submarine: 20.0, balloon: 4.0, zeppelin: 7.0,
        magic_carpet: 10.0, dragon: 12.0, teleport_circle: 1.0, hypermetro: 2.0,
        maglev: 2.5, hyperloop: 3.5, starship: 50.0, wormhole: 100.0,
        quantum: 200.0, time_machine: 500.0, dimensional: 1000.0
    };

    // Speed multipliers for travel duration. Higher value = faster travel.
    const speedMultipliers = {
        walking: 1.0, bicycle: 1.25, horse: 1.67, carsharing: 3.5, camper: 2.5,
        bus: 2.0, train: 3.33, taxi: 3.33, boat: 1.43, ferry: 1.67,
        airplane_economy: 5.0, airplane_business: 6.67, private_jet: 10.0,
        limousine: 4.0, helicopter: 6.67, cruise: 1.25, submarine: 1.67,
        balloon: 1.11, zeppelin: 1.43, magic_carpet: 5.0, dragon: 10.0,
        teleport_circle: 20.0, hypermetro: 6.67, maglev: 10.0, hyperloop: 12.5,
        starship: 20.0, wormhole: 50.0, quantum: 100.0, time_machine: 200.0,
        dimensional: 1000.0
    };
   
    const transportNames = {
        walking: "Walking", bicycle: "Bicycle", horse: "Horse", carsharing: "Car Sharing",camper: "Camper",
        bus: "Bus", train: "Train", taxi: "Taxi", boat: "Boat", ferry: "Ferry",
        airplane_economy: "Airplane (Economy)", airplane_business: "Airplane (Business)",
        private_jet: "Private Jet", limousine: "Limousine", helicopter: "Helicopter",
        cruise: "Cruise Ship", submarine: "Submarine", balloon: "Hot Air Balloon",
        zeppelin: "Zeppelin", magic_carpet: "Magic Carpet", dragon: "Dragon Mount",
        teleport_circle: "Teleportation Circle", hypermetro: "Hypermetro Network",
        maglev: "Maglev Train", hyperloop: "Hyperloop", starship: "Low Orbit Starship",
        wormhole: "Wormhole Portal", quantum: "Quantum Teleportation",
        time_machine: "Time Machine", dimensional: "Dimensional Gateway"
    };

    let destinationCache = null;
    let cacheInitialized = false;
    let globalTravelTimer = null;

    //=============================================================================
    // Game_System - Enhanced for persistent travel data
    //=============================================================================
    const _Game_System_initialize_FTS = Game_System.prototype.initialize;
    Game_System.prototype.initialize = function() {
        _Game_System_initialize_FTS.call(this);
        this.initializeFastTravelData();
    };

    Game_System.prototype.initializeFastTravelData = function() {
        this._fastTravelData = {
            destinations: [],
            selectedTransport: 'walking',
            isActive: false,
            finalDestination: null,
            originalMap: null,
            travelStartTime: null,
            totalDistanceKm: 0,
            travelCompleted: false,
            currentTravelMapId: null,

            // Timer specific data
            timerActive: false,
            timerStartTime: 0,
            timerDuration: 0,
            timerRemainingTime: 0,
            timerDestination: '',
            timerTransport: 'walking',

            // TimeDateSystem integration data
            travelStartGameTime: 0,
            totalTravelMinutes: 0,
            minutesPerSecond: 0
        };
    };

    Game_System.prototype.getFastTravelData = function() {
        if (!this._fastTravelData) {
            this.initializeFastTravelData();
        }
        return this._fastTravelData;
    };

    Game_System.prototype.startTravelTimer = function(duration, transport, destination, totalKm) {
        const data = this.getFastTravelData();
        data.timerActive = true;
        data.timerStartTime = Date.now();
        data.timerDuration = duration;
        data.timerRemainingTime = duration;
        data.timerDestination = destination;
        data.timerTransport = transport;
        data.totalDistanceKm = totalKm;

        // Calculate time advancement for TimeDateSystem integration
        // Each tile of distance = 1 minutes of game time
        // Time advancement scales with transport speed:
        // - Faster transports advance time faster per second
        // - Slower transports advance time slower per second
        const distanceInTiles = totalKm / 1; // Convert back from "km" to tiles
        const baseMinutesPerTile = 1; // Base game minutes per tile
        const totalGameMinutes = distanceInTiles * baseMinutesPerTile;

        // Calculate minutes per real second based on actual travel duration
        // Faster transports have shorter durations, so more minutes per second
        // Slower transports have longer durations, so fewer minutes per second
        const minutesPerSecond = duration > 0 ? totalGameMinutes / duration : totalGameMinutes;

        data.travelStartGameTime = $gameVariables.value(114) || 0; // Variable 114 = gameTimeVariable
        data.totalTravelMinutes = totalGameMinutes;
        data.minutesPerSecond = minutesPerSecond;

        // Start global interval timer
        if (globalTravelTimer) {
            clearInterval(globalTravelTimer);
        }

        globalTravelTimer = setInterval(() => {
            this.updateTravelTimer();
        }, 1000);

        // Force immediate update of any visible timer windows
        this.updateAllTravelTimerWindows();
    };

    Game_System.prototype.updateTravelTimer = function() {
        const data = this.getFastTravelData();
        if (!data.timerActive) return;

        const elapsed = Math.floor((Date.now() - data.timerStartTime) / 1000);
        data.timerRemainingTime = Math.max(0, data.timerDuration - elapsed);

        // Update game variable
        $gameVariables.setValue(45, data.timerRemainingTime);

        // Advance game time for TimeDateSystem integration
        // Time advancement is scaled by transport speed
        // - Faster transports advance time faster per second
        // - Slower transports advance time slower per second
        if (data.timerDuration > 0 && data.minutesPerSecond) {
            const minutesToAdd = elapsed * data.minutesPerSecond;
            const newGameTime = data.travelStartGameTime + minutesToAdd;
            $gameVariables.setValue(114, Math.floor(newGameTime)); // Variable 114 = gameTimeVariable
        }

        // Update all timer windows
        this.updateAllTravelTimerWindows();

        // Check for completion
        if (data.timerRemainingTime <= 0) {
            this.completeTravelTimer();
        }

        // Periodic messages
        if (data.timerRemainingTime % 10 === 0 && data.timerRemainingTime > 0) {
            if (SceneManager._scene instanceof Scene_Map) {
            }
        }
    };

    Game_System.prototype.completeTravelTimer = function() {
        const data = this.getFastTravelData();
        if (globalTravelTimer) {
            clearInterval(globalTravelTimer);
            globalTravelTimer = null;
        }
        
        data.travelCompleted = true;
        $gameSwitches.setValue(55, false);
        if (SceneManager._scene instanceof Scene_Map) {
            }
        
        this.updateAllTravelTimerWindows();
    };

    Game_System.prototype.stopTravelTimer = function() {
        const data = this.getFastTravelData();
        data.timerActive = false;
        data.timerRemainingTime = 0;
        data.travelCompleted = false;
        
        if (globalTravelTimer) {
            clearInterval(globalTravelTimer);
            globalTravelTimer = null;
        }
        
        this.updateAllTravelTimerWindows();
    };

    Game_System.prototype.updateAllTravelTimerWindows = function() {
        // Update timer windows in all scenes
        if (SceneManager._scene && SceneManager._scene._travelTimerWindow) {
            SceneManager._scene._travelTimerWindow.refreshFromGameSystem();
        }
    };

    Game_System.prototype.clearFastTravelData = function() {
        this.stopTravelTimer();
        this.initializeFastTravelData();
        $gameSwitches.setValue(55, false);        
        if ($gamePlayer) {
            $gamePlayer.setMovementLock(false);
        }
    };

    const _Game_System_onAfterLoad = Game_System.prototype.onAfterLoad;
    Game_System.prototype.onAfterLoad = function() {
        _Game_System_onAfterLoad.call(this);
        cacheInitialized = false;
        destinationCache = null;
        
        // Restart timer if it was active
        const data = this.getFastTravelData();
        if (data.timerActive && data.timerRemainingTime > 0) {
            const elapsed = Math.floor((Date.now() - data.timerStartTime) / 1000);
            const remaining = Math.max(0, data.timerDuration - elapsed);
            
            if (remaining > 0) {
                data.timerRemainingTime = remaining;
                globalTravelTimer = setInterval(() => {
                    this.updateTravelTimer();
                }, 1000);
            } else {
                this.completeTravelTimer();
            }
        }
    };

    // Utility functions now use $gameSystem
    function getFastTravelData() {
        return $gameSystem.getFastTravelData();
    }

    function clearFastTravelData() {
        $gameSystem.clearFastTravelData();
    }

    // Plugin commands
    PluginManager.registerCommand(pluginName, "StartFastTravel", args => {
        const transportType = args.transportType || 'walking';
        if (SceneManager._scene instanceof Scene_Map) {
            SceneManager._scene.startFastTravel(transportType);
        }
    });

    PluginManager.registerCommand(pluginName, "RefreshDestinations", () => {
        refreshDestinationCache();
    });

    PluginManager.registerCommand(pluginName, "RefuelMax", () => {
        const currentFuel = getCurrentFuel();
        const fuelNeeded = fuelCapacity - currentFuel;
        
        if (fuelNeeded <= 0) {
            return;
        }
        
        setCurrentFuel(fuelCapacity);
    });

    PluginManager.registerCommand(pluginName, "RefuelCarMax", () => {
        const currentFuel = getCurrentFuel();
        const fuelNeeded = fuelCapacity - currentFuel;
        
        if (fuelNeeded <= 0) {
            return;
        }
        
        setCurrentFuel(fuelCapacity);
    });

    PluginManager.registerCommand(pluginName, "EndTravel", () => {
        if (!canEndTravel()) {
            return;
        }
        
        completeTravelToDestination();
    });

    PluginManager.registerCommand(pluginName, "EndTravelCamper", () => {
        completeTravelCamper();
    });
    
    PluginManager.registerCommand(pluginName, "EndTravelCar", () => {
        completeTravelCar();
    });

    PluginManager.registerCommand(pluginName, "EndTravelAirship", () => {
        completeTravelAirship();
    });

    PluginManager.registerCommand(pluginName, "TeleportToAirship", () => {
        teleportToAirship();
    });

    PluginManager.registerCommand(pluginName, "TeleportToAirshipAndRide", () => {
        teleportToAirshipAndRide();
    });

    PluginManager.registerCommand(pluginName, "ShowRefuelWindow", () => {
        if (SceneManager._scene instanceof Scene_Map) {
            SceneManager._scene.showRefuelWindow();
        }
    });

    PluginManager.registerCommand(pluginName, "ShowDestinationPicture", args => {
        const locationName = args.locationName || "Antwerpen";
        if (SceneManager._scene instanceof Scene_Map) {
            SceneManager._scene.showDestinationPicture(locationName);
        }
    });

    PluginManager.registerCommand(pluginName, "TutorialStation", () => {
        if (SceneManager._scene instanceof Scene_Map) {
            SceneManager._scene.startTutorialTravel();
        }
    });

    PluginManager.registerCommand(pluginName, "HideDestinationPicture", () => {
        if (SceneManager._scene instanceof Scene_Map) {
            SceneManager._scene.hideDestinationPicture();
        }
    });

    // Helper functions
    function canEndTravel() {
        const data = getFastTravelData();
        
        if (!data.finalDestination) {
            console.log("FastTravel: No final destination set");
            return false;
        }
        
        if (!data.travelCompleted) {
            console.log("FastTravel: Travel timer not completed");
            return false;
        }
        
        if (data.selectedTransport === 'carsharing'||data.selectedTransport === 'camper') {
            const currentMapId = $gameMap.mapId();
            if (currentMapId !== data.currentTravelMapId) {
                console.log("FastTravel: Not on correct map for car sharing");
                return false;
            }
            return true;
        }
        
        const currentMapId = $gameMap.mapId();
        if (currentMapId !== data.currentTravelMapId) {
            console.log("FastTravel: Not on travel map");
            return false;
        }
        
        return true;
    }

    function calculateDistance(x1, y1, x2, y2) {
        return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
    }

    function goldToEuros(gold) {
        return (gold / 100).toFixed(2);
    }

    function getCurrentFuel() {
        return $gameVariables.value(fuelVar) || 0;
    }
    function getCurrentCarFuel() {
        return $gameVariables.value(carFuelVar) || 0;
    }
    function setCurrentFuel(amount) {
        $gameVariables.setValue(fuelVar, Math.max(0, Math.min(fuelCapacity, amount)));
    }
    function setCurrentCarFuel(amount) {
        $gameVariables.setValue(fuelVar, Math.max(0, Math.min(carFuelCapacity, amount)));
    }

    function getFuelPrice() {
        const baseFuelPrice = $gameVariables.value(53) || 10;
        return baseFuelPrice;
    }

    function calculateFuelCost(destination, transportType) {
        if (transportType !== 'carsharing' || transportType !== 'camper') return 0;
        
        const playerX = $gameVariables.value(playerXVar);
        const playerY = $gameVariables.value(playerYVar);
        const actualDest = getActualDestination(destination, transportType);
        const distance = calculateDistance(playerX, playerY, actualDest.x, actualDest.y);
        return distance * fuelConsumptionRate;
    }

    function calculateTravelTime(destination, transportType) {
        const playerX = $gameVariables.value(playerXVar);
        const playerY = $gameVariables.value(playerYVar);
        const actualDest = getActualDestination(destination, transportType);
        const distance = calculateDistance(playerX, playerY, actualDest.x, actualDest.y);
        const speedMultiplier = speedMultipliers[transportType] || 1.0;
        
        const travelTime = Math.min(Math.floor((distance * baseTimePerTile) / speedMultiplier), maxTravelTime);
        return Math.max(travelTime, 3);
    }

    function parseTransportOverrides(event) {
        const overrides = {};
        if (!event.pages || !event.pages[0] || !event.pages[0].list) return overrides;
        
        for (const command of event.pages[0].list) {
            if (command.code === 108 || command.code === 408) {
                const comment = command.parameters[0];
                if (!comment) continue;
                
                const lines = comment.split(',');
                for (const line of lines) {
                    const parts = line.trim().split(/\s+/);
                    if (parts.length === 4) {
                        const [transport, mapId, x, y] = parts;
                        const parsedMapId = parseInt(mapId);
                        const parsedX = parseInt(x);
                        const parsedY = parseInt(y);
                        if (!isNaN(parsedMapId) && !isNaN(parsedX) && !isNaN(parsedY)) {
                            overrides[transport.toLowerCase()] = { 
                                mapId: parsedMapId, 
                                x: parsedX, 
                                y: parsedY 
                            };
                        }
                    }
                }
            }
        }
        return overrides;
    }

    function initializeDestinationCache() {
        if (cacheInitialized && destinationCache !== null) {
            return destinationCache;
        }
        
        console.log("FastTravel: Building destination cache from hardcoded data...");
        const destinations = [];
        
        // Build destinations directly from TRANSPORT_DESTINATIONS
        for (const [destinationName, transportData] of Object.entries(TRANSPORT_DESTINATIONS)) {
            // Use the first available transport method as the default location
            const firstTransport = Object.keys(transportData)[0];
            const defaultLocation = transportData[firstTransport];
            
            destinations.push({
                name: destinationName,
                fullName: 'Teleport - ' + destinationName,
                mapId: defaultLocation.mapId,
                x: defaultLocation.x,
                y: defaultLocation.y,
                eventId: 0, // No event ID needed for hardcoded destinations
                transportOverrides: transportData
            });
        }
        
        destinationCache = destinations;
        cacheInitialized = true;
        console.log(`FastTravel: Loaded ${destinations.length} destinations from hardcoded data.`);
        return destinations;
    }

    function refreshDestinationCache() {
        console.log("FastTravel: Refreshing destination cache...");
        cacheInitialized = false;
        destinationCache = null;
        return initializeDestinationCache();
    }

    function getTeleportDestinations() {
        return initializeDestinationCache();
    }

    function getActualDestination(destination, transportType) {
        // Use "base" coordinates for camper/carsharing - always go to map 315
        if ((transportType === 'camper' || transportType === 'carsharing') && destination.transportOverrides && destination.transportOverrides['base']) {
            const base = destination.transportOverrides['base'];
            return { mapId: 315, x: base.x, y: base.y, name: destination.name };
        }

        // Check if location has ONLY "base" (and optionally "picture")
        // If so, transport to map 315 at base coordinates
        if (destination.transportOverrides) {
            const transportKeys = Object.keys(destination.transportOverrides).filter(key => key !== 'picture');
            const onlyHasBase = transportKeys.length === 1 && transportKeys[0] === 'base';

            if (onlyHasBase && destination.transportOverrides['base']) {
                const base = destination.transportOverrides['base'];
                return { mapId: 315, x: base.x, y: base.y, name: destination.name };
            }
        }

        // Use transport-specific override if available
        if (destination.transportOverrides && destination.transportOverrides[transportType]) {
            const override = destination.transportOverrides[transportType];
            return { mapId: override.mapId, x: override.x, y: override.y, name: destination.name };
        }

        // Default destination
        return { mapId: destination.mapId, x: destination.x, y: destination.y + 1, name: destination.name };
    }

    function calculateTravelCost(destination, transportType) {
        if (transportType === 'carsharing'||transportType === 'camper') {
            return calculateFuelCost(destination, transportType);
        }
        
        const playerX = $gameVariables.value(playerXVar);
        const playerY = $gameVariables.value(playerYVar);
        const actualDest = getActualDestination(destination, transportType);
        const distance = calculateDistance(playerX, playerY, actualDest.x, actualDest.y);
        const multiplier = transportMultipliers[transportType] || 1.0;
        return Math.floor(distance * baseDistancePrice * multiplier);
    }
    
    function calculateTravelCostFromDistance(distance, transportType) {
        if (transportType === 'carsharing'||transportType === 'camper') {
            return distance * fuelConsumptionRate;
        }
        
        const multiplier = transportMultipliers[transportType] || 1.0;
        return Math.floor(distance * baseDistancePrice * multiplier);
    }

    function canAffordTravel(destination, transportType) {
        if (transportType === 'carsharing'||transportType === 'camper') {
            const fuelNeeded = calculateFuelCost(destination, transportType);
            const currentFuel = getCurrentFuel();
            return currentFuel >= fuelNeeded;
        }
        
        const cost = calculateTravelCost(destination, transportType);
        return $gameParty.gold() >= cost;
    }
    function executeTravel(destination, cost) {
        const data = getFastTravelData();
        $gameSwitches.setValue(55, true);    
        
        if (data.selectedTransport === 'camper') {
            const currentFuel = getCurrentFuel();
            setCurrentFuel(currentFuel - cost);
            const newFuelAmount = currentFuel - cost;
            $gameVariables.setValue(65, newFuelAmount);
            const actualDest = getActualDestination(destination, data.selectedTransport);
            $gameVariables.setValue(63, actualDest.x);
            $gameVariables.setValue(64, actualDest.y);
            $gameVariables.setValue(67, 315);
    
        } 
        if (data.selectedTransport === 'carsharing') {
            const currentFuel = getCurrentCarFuel();
            setCurrentCarFuel(currentFuel - cost);
            const newFuelAmount = currentFuel - cost;
            $gameVariables.setValue(71, newFuelAmount);
            const actualDest = getActualDestination(destination, data.selectedTransport);
            $gameVariables.setValue(69, actualDest.x);
            $gameVariables.setValue(70, actualDest.y);
            $gameVariables.setValue(72, 315);
    
        } else {
            $gameParty.loseGold(cost);
        }
        
        SceneManager._scene.closeFastTravelWindow();
        data.finalDestination = getActualDestination(destination, data.selectedTransport);
        data.originalMap = { mapId: $gameMap.mapId(), x: $gamePlayer.x, y: $gamePlayer.y };
        
        // Always use stored player coordinates from variables for distance calculation
        const playerX = $gameVariables.value(playerXVar);
        const playerY = $gameVariables.value(playerYVar);
        const distance = calculateDistance(playerX, playerY, data.finalDestination.x, data.finalDestination.y);
        data.totalDistanceKm = Math.round(distance * 1);
        
        const travelTime = calculateTravelTime(destination, data.selectedTransport);
        data.travelStartTime = Date.now();
        data.travelCompleted = false;
        
        if (data.selectedTransport === 'carsharing' || data.selectedTransport === 'camper') {
            data.currentTravelMapId = $gameMap.mapId();
            $gamePlayer.setMovementLock(false);
        } else {
            const travelMap = travelMaps[data.selectedTransport];
            if (travelMap && travelMap.mapId > 0 && $dataMapInfos[travelMap.mapId]) {
                data.currentTravelMapId = travelMap.mapId;
                $gamePlayer.reserveTransfer(travelMap.mapId, travelMap.x, travelMap.y, 2, 0);
                $gamePlayer.setMovementLock(false);
            } else {
                console.warn(`FastTravel: Travel map for ${data.selectedTransport} not found. Using direct travel.`);
                executeDirectTravel();
                return;
            }
        }
        
        // Start the persistent timer
        $gameSystem.startTravelTimer(travelTime, data.selectedTransport, destination.name, data.totalDistanceKm);
    }
    function completeTravelToDestination() {
        const data = getFastTravelData();
        if (!data.finalDestination) {
            console.error("FastTravel: No final destination stored!");
            return;
        }

        // Check for specific map teleport overrides
        // Teleport immediately to original destination
        $gamePlayer.reserveTransfer(
            data.finalDestination.mapId,
            data.finalDestination.x,
            data.finalDestination.y,
            2, 0
        );

        $gameVariables.setValue(playerXVar, data.finalDestination.x);
        $gameVariables.setValue(playerYVar, data.finalDestination.y);
        $gameVariables.setValue(45, data.finalDestination.mapId);
        clearFastTravelData();
    }
    function completeTravelCamper() {
        const data = getFastTravelData();
        
        // If no fast travel was selected, teleport to ship location
        if (!data.finalDestination) {
            console.log("FastTravel: No final destination - teleporting to ship location");
            console.log("Coordinates",$gameVariables.value(67),$gameVariables.value(63),$gameVariables.value(64));

            // Teleport to ship location (assuming ship is at a specific location)
            $gamePlayer.reserveTransfer($gameVariables.value(67), $gameVariables.value(63), $gameVariables.value(64), 2, 0);            
            return;
        }
        
        // If timer is in progress, do nothing
        if (data.timerActive && data.timerRemainingTime > 0) {
            console.log("FastTravel: Timer still in progress - doing nothing");
            return;
        }
        
        // If timer has started and ended, teleport to destination
        if (data.timerActive && data.timerRemainingTime <= 0) {
            console.log("FastTravel: Timer completed - teleporting to destination on map " + data.finalDestination.mapId);

            // Teleport to destination using the mapId from finalDestination
            $gamePlayer.reserveTransfer(data.finalDestination.mapId, data.finalDestination.x, data.finalDestination.y, 2, 0);
            const vehicle = $gameMap.vehicle("ship");
            vehicle.setLocation(data.finalDestination.mapId, data.finalDestination.x, data.finalDestination.y+1);

            // Set variables as specified
            $gameVariables.setValue(63, data.finalDestination.x); // Camper X position
            $gameVariables.setValue(64, data.finalDestination.y+1); // Camper Y position
            $gameVariables.setValue(67, data.finalDestination.mapId); // Map ID

            $gameVariables.setValue(playerXVar, data.finalDestination.x);
            $gameVariables.setValue(playerYVar, data.finalDestination.y);
            $gameVariables.setValue(45, data.finalDestination.mapId);
            clearFastTravelData();
        }

    }

    function completeTravelCar() {
        const data = getFastTravelData();
        
        // If no fast travel was selected, teleport to ship location
        if (!data.finalDestination) {
            console.log("FastTravel: No final destination - teleporting to car location");
            console.log("Coordinates",$gameVariables.value(72),$gameVariables.value(69),$gameVariables.value(70));

            // Teleport to car location (assuming car is at a specific location)
            $gamePlayer.reserveTransfer($gameVariables.value(72), $gameVariables.value(69), $gameVariables.value(70), 2, 0);            
            return;
        }
        
        // If timer is in progress, do nothing
        if (data.timerActive && data.timerRemainingTime > 0) {
            console.log("FastTravel: Timer still in progress - doing nothing");
            return;
        }
        
        // If timer has started and ended, teleport to destination
        if (data.timerActive && data.timerRemainingTime <= 0) {
            console.log("FastTravel: Timer completed - teleporting to destination on map " + data.finalDestination.mapId);

            // Teleport to destination using the mapId from finalDestination
            $gamePlayer.reserveTransfer(data.finalDestination.mapId, data.finalDestination.x, data.finalDestination.y, 2, 0);
            const vehicle = $gameMap.vehicle("boat");
            vehicle.setLocation(data.finalDestination.mapId, data.finalDestination.x, data.finalDestination.y+1);

            // Set variables as specified
            $gameVariables.setValue(69, data.finalDestination.x); // Car X position
            $gameVariables.setValue(70, data.finalDestination.y+1); // Car Y position
            $gameVariables.setValue(72, data.finalDestination.mapId); // Map ID
            $gameVariables.setValue(playerXVar, data.finalDestination.x);
            $gameVariables.setValue(playerYVar, data.finalDestination.y);
            $gameVariables.setValue(45, data.finalDestination.mapId);
            clearFastTravelData();
        }
    }

    function completeTravelAirship() {
        const data = getFastTravelData();

        // If no fast travel was selected, teleport to airship location
        if (!data.finalDestination) {
            console.log("FastTravel: No final destination - teleporting to airship location");
            console.log("Coordinates",$gameVariables.value(147),$gameVariables.value(144),$gameVariables.value(145));

            // Teleport to airship location
            $gamePlayer.reserveTransfer($gameVariables.value(147), $gameVariables.value(144), $gameVariables.value(145), 2, 0);
            return;
        }

        // If timer is in progress, do nothing
        if (data.timerActive && data.timerRemainingTime > 0) {
            console.log("FastTravel: Timer still in progress - doing nothing");
            return;
        }

        // If timer has started and ended, teleport to destination
        if (data.timerActive && data.timerRemainingTime <= 0) {
            console.log("FastTravel: Timer completed - teleporting to destination on map " + data.finalDestination.mapId);

            // Teleport to destination using the mapId from finalDestination
            $gamePlayer.reserveTransfer(data.finalDestination.mapId, data.finalDestination.x, data.finalDestination.y, 2, 0);
            const vehicle = $gameMap.vehicle("airship");
            vehicle.setLocation(data.finalDestination.mapId, data.finalDestination.x, data.finalDestination.y+1);

            // Set variables as specified
            $gameVariables.setValue(144, data.finalDestination.x); // Airship X position
            $gameVariables.setValue(145, data.finalDestination.y+1); // Airship Y position
            $gameVariables.setValue(147, data.finalDestination.mapId); // Map ID
            $gameVariables.setValue(playerXVar, data.finalDestination.x);
            $gameVariables.setValue(playerYVar, data.finalDestination.y);
            $gameVariables.setValue(45, data.finalDestination.mapId);
            clearFastTravelData();
        }
    }

    function teleportToAirship() {
        // Teleport to airship's current location
        const airshipMapId = $gameVariables.value(147) || 315; // Default to map 315 if not set
        const airshipX = $gameVariables.value(144) || 0;
        const airshipY = $gameVariables.value(145) || 0;

        console.log("FastTravel: Teleporting to airship at", airshipMapId, airshipX, airshipY);
        $gamePlayer.reserveTransfer(airshipMapId, airshipX, airshipY, 2, 0);
    }

    function teleportToAirshipAndRide() {
        // Teleport to airship's current location and board it
        const airshipMapId = $gameVariables.value(147) || 315; // Default to map 315 if not set
        const airshipX = $gameVariables.value(144) || 0;
        const airshipY = $gameVariables.value(145) || 0;

        console.log("FastTravel: Teleporting to airship and boarding at", airshipMapId, airshipX, airshipY);
        $gamePlayer.reserveTransfer(airshipMapId, airshipX, airshipY, 2, 0);

        // Wait for transfer to complete, then board the airship
        const interpreter = new Game_Interpreter();
        interpreter.setup([
            { code: 201, indent: 0, parameters: [0, airshipMapId, airshipX, airshipY, 2, 0] }, // Transfer
            { code: 205, indent: 0, parameters: [2] } // Set Vehicle Location (2 = airship)
        ], 0);

        // Board the airship
        setTimeout(() => {
            const airship = $gameMap.vehicle("airship");
            if (airship) {
                $gamePlayer._vehicleType = "airship";
                $gamePlayer._vehicleGettingOn = true;
                $gamePlayer.setThrough(false);
                $gamePlayer.setMoveSpeed(airship.moveSpeed());
            }
        }, 100);
    }

    function executeDirectTravel() {
        const data = getFastTravelData();
        if (!data.finalDestination || !data.finalDestination.mapId) {
            console.error("FastTravel: Cannot execute direct travel - no valid destination!");
            clearFastTravelData();
            return;
        }
        
        $gamePlayer.reserveTransfer(
            data.finalDestination.mapId,
            data.finalDestination.x,
            data.finalDestination.y,
            2, 0
        );
        $gameVariables.setValue(playerXVar, data.finalDestination.x);
        $gameVariables.setValue(playerYVar, data.finalDestination.y);
        clearFastTravelData();
    }

    const _DataManager_createGameObjects = DataManager.createGameObjects;
    DataManager.createGameObjects = function() {
        _DataManager_createGameObjects.call(this);
        cacheInitialized = false;
        destinationCache = null;
    };

    //=============================================================================
    // Game_Player modifications for movement lock
    //=============================================================================
    const _Game_Player_initMembers_FTS = Game_Player.prototype.initMembers;
    Game_Player.prototype.initMembers = function() {
        _Game_Player_initMembers_FTS.call(this);
        this._movementLocked = false;
    };

    Game_Player.prototype.setMovementLock = function(locked) {
        this._movementLocked = locked;
    };

    const _Game_Player_canMove_FTS = Game_Player.prototype.canMove;
    Game_Player.prototype.canMove = function() {
        if (this._movementLocked) {
            return false;
        }
        return _Game_Player_canMove_FTS.call(this);
    };

    // Track airship position when moving on map 315
    const _Game_Player_increaseSteps_FTS = Game_Player.prototype.increaseSteps;
    Game_Player.prototype.increaseSteps = function() {
        _Game_Player_increaseSteps_FTS.call(this);

        // Update airship position when riding it on map 315
        if ($gameMap.mapId() === 315 && this.isInVehicle() && this.vehicle() === $gameMap.vehicle("airship")) {
            const airship = $gameMap.vehicle("airship");
            if (airship) {
                $gameVariables.setValue(144, airship.x); // Airship X position
                $gameVariables.setValue(145, airship.y); // Airship Y position
                $gameVariables.setValue(147, 315); // Map ID
            }
        }
    };

    //=============================================================================
    // Scene_Map modifications - Enhanced for persistent timer
    //=============================================================================
    const _Scene_Map_createAllWindows_FTS = Scene_Map.prototype.createAllWindows;
    Scene_Map.prototype.createAllWindows = function() {
        _Scene_Map_createAllWindows_FTS.call(this);
        this.createFastTravelDestinationWindow();
        this.createTravelTimerWindow();
        this.createRefuelWindow();
    };

    const _Scene_Map_start_FTS = Scene_Map.prototype.start;
    Scene_Map.prototype.start = function() {
        _Scene_Map_start_FTS.call(this);
        this.checkForActiveTimer();
    };
    Scene_Map.prototype.checkForActiveTimer = function() {
        const data = getFastTravelData();
        if (data.timerActive && this._travelTimerWindow) {
            // For car sharing, always show timer
            if (data.selectedTransport === 'carsharing'||data.selectedTransport === 'camper') {
                this._travelTimerWindow.refreshFromGameSystem();
                this._travelTimerWindow.show();
            }
            // For other transport types, only show timer when on travel map
            else if ($gameMap.mapId() === data.currentTravelMapId) {
                this._travelTimerWindow.refreshFromGameSystem();
                this._travelTimerWindow.show();
            }
            // Hide timer when not on travel map (for non-carsharing transport)
            else {
                this._travelTimerWindow.hide();
            }
        }
    };
    

    Scene_Map.prototype.createFastTravelDestinationWindow = function() {
        const ww = 600; 
        const wh = Graphics.boxHeight - 100;
        const wx = (Graphics.boxWidth - ww) / 2; 
        const wy = 50;
        this._fastTravelDestWindow = new Window_FastTravelDestination(new Rectangle(wx, wy, ww, wh));
        this._fastTravelDestWindow.setHandler('ok', this.onFastTravelOk.bind(this));
        this._fastTravelDestWindow.setHandler('cancel', this.onFastTravelCancel.bind(this));
        this._fastTravelDestWindow.hide();
        this.addWindow(this._fastTravelDestWindow);
    };

    Scene_Map.prototype.createTravelTimerWindow = function() {
        const rect = new Rectangle(Graphics.boxWidth - 300, 0, 300, this.calcWindowHeight(3, false));
        this._travelTimerWindow = new Window_TravelTimer(rect);
        this._travelTimerWindow.hide();
        this.addWindow(this._travelTimerWindow);
    };

// Enhanced Scene_Map refuel window methods (replace existing methods)
Scene_Map.prototype.createRefuelWindow = function() {
    // Create fullscreen Art Deco refuel window
    this._refuelWindow = new Window_Refuel();
    this._refuelWindow.setHandler('ok', this.onRefuelOk.bind(this));
    this._refuelWindow.setHandler('cancel', this.onRefuelCancel.bind(this));
    this._refuelWindow.hide();
    this.addWindow(this._refuelWindow);
};

    const _Scene_Map_onTransferEnd_FTS = Scene_Map.prototype.onTransferEnd;
    Scene_Map.prototype.onTransferEnd = function() {
        _Scene_Map_onTransferEnd_FTS.call(this);
        this.checkForActiveTimer();
    };

    Scene_Map.prototype.startFastTravel = function(transportType) {
        const data = getFastTravelData();
        $gamePlayer.setMovementLock(true);
        data.selectedTransport = transportType;
        
        // Only update player coordinates if on map 315
        if ($gameMap.mapId() === 315) {
            $gameVariables.setValue(playerXVar, $gamePlayer.x);
            $gameVariables.setValue(playerYVar, $gamePlayer.y);
        }
        // If not on map 315, use the existing stored coordinates without updating
        
        data.destinations = getTeleportDestinations();
        data.isActive = true;
        this._fastTravelDestWindow.refresh();
        this._fastTravelDestWindow.show();
        this._fastTravelDestWindow.activate();
        this._fastTravelDestWindow.select(0);
    };

    Scene_Map.prototype.startTutorialTravel = function() {
        const data = getFastTravelData();
        $gamePlayer.setMovementLock(true);
        data.selectedTransport = 'train';
        data.allowedDestinations = ['Ghent', 'Omega Tower'];

        if ($gameMap.mapId() === 315) {
            $gameVariables.setValue(playerXVar, $gamePlayer.x);
            $gameVariables.setValue(playerYVar, $gamePlayer.y);
        }

        data.destinations = getTeleportDestinations();
        data.isActive = true;
        this._fastTravelDestWindow.refresh();
        this._fastTravelDestWindow.show();
        this._fastTravelDestWindow.activate();
        this._fastTravelDestWindow.select(0);
    };


    Scene_Map.prototype.onFastTravelOk = function() {
        const destination = this._fastTravelDestWindow.currentExt();
        if (!destination) {
            this._fastTravelDestWindow.activate();
            return;
        }
        
        const data = getFastTravelData();
        const cost = calculateTravelCost(destination, data.selectedTransport);
        const travelTime = calculateTravelTime(destination, data.selectedTransport);
        
        if (data.selectedTransport === 'carsharing'||data.selectedTransport === 'camper') {
            const fuelNeeded = cost;
        } else {
            const costEuros = goldToEuros(cost);
        }
        window.skipLocalization = true;

        $gameMessage.setChoices(["Yes", "No"], 0, 1);
        $gameMessage.setChoiceCallback(n => {
            if (n === 0) {
                if (canAffordTravel(destination, data.selectedTransport)) {
                    executeTravel(destination, cost);
                } else {
                    if (data.selectedTransport === 'carsharing'||data.selectedTransport === 'camper') {
                    } else {
                    }
                    this._fastTravelDestWindow.activate();
                }
            } else {
                this._fastTravelDestWindow.activate();
            }
        });
        window.skipLocalization = false;

    };

    Scene_Map.prototype.onFastTravelCancel = function() {
        this.closeFastTravelWindow();
        clearFastTravelData();
    };

    Scene_Map.prototype.closeFastTravelWindow = function() {
        this._fastTravelDestWindow.hide();
        this._fastTravelDestWindow.deactivate();
    };

    Scene_Map.prototype.showRefuelWindow = function() {
        this._refuelWindow.refresh();
        this._refuelWindow.show();
        this._refuelWindow.activate();
        this._refuelWindow.select(0);
    };


    Scene_Map.prototype.onRefuelOk = function() {
        const selectedOption = this._refuelWindow.getCurrentOption();
        if (!selectedOption || !selectedOption.enabled) {
            this._refuelWindow.activate();
            return;
        }
        window.skipLocalization = true;

        // Handle different refuel types
        if (selectedOption.type === 'refuel_camper' || selectedOption.type === 'refuel') {
            const liters = selectedOption.liters;
            const cost = selectedOption.cost;
            const costEuros = goldToEuros(cost);

            $gameMessage.add(`\\C[17]Refuel Confirmation\\C[0]`);
            $gameMessage.add(`Purchase ${liters}L of fuel for ${costEuros}€?`);
            $gameMessage.setChoices(["Confirm", "Cancel"], 0, 1);
            $gameMessage.setChoiceCallback(n => {
                if (n === 0) {
                    if ($gameParty.gold() >= cost) {
                        $gameParty.loseGold(cost);
                        const currentFuel = getCurrentFuel();
                        setCurrentFuel(currentFuel + liters);
                        
                        $gameMessage.add(`\\C[17]Refueling Complete!\\C[0]`);
                        $gameMessage.add(`Added ${liters}L of fuel.`);
                        $gameMessage.add(`Current fuel: ${getCurrentFuel()}L/${fuelCapacity}L`);
                        
                        this._refuelWindow.setupRefuelOptions();
                        this._refuelWindow.refresh();
                    } else {
                        $gameMessage.add(`\\C[18]Insufficient funds!\\C[0]`);
                        $gameMessage.add(`You need ${costEuros}€ for this purchase.`);
                    }
                }
            });
        } 
        else if (selectedOption.type === 'buy_fuel_tank') {
            const cost = selectedOption.cost;
            const costEuros = goldToEuros(cost);
            const itemId = selectedOption.itemId;
            
            $gameMessage.add(`\\C[17]Purchase Confirmation\\C[0]`);
            $gameMessage.add(`Buy emergency fuel canister for ${costEuros}€?`);
            $gameMessage.setChoices(["Confirm", "Cancel"], 0, 1);
            $gameMessage.setChoiceCallback(n => {
                if (n === 0) {
                    if ($gameParty.gold() >= cost) {
                        $gameParty.loseGold(cost);
                        $gameParty.gainItem($dataItems[itemId], 1);
                        
                        $gameMessage.add(`\\C[17]Purchase Complete!\\C[0]`);
                        $gameMessage.add(`Emergency fuel canister acquired.`);
                        
                        this._refuelWindow.setupRefuelOptions();
                        this._refuelWindow.refresh();
                    } else {
                        $gameMessage.add(`\\C[18]Insufficient funds!\\C[0]`);
                        $gameMessage.add(`You need ${costEuros}€ for this purchase.`);
                    }
                }
            });
        }
        window.skipLocalization = false;

    };
    

    Scene_Map.prototype.onRefuelCancel = function() {
        // Ensure player movement is unlocked
        $gamePlayer.setMovementLock(false);
        this._refuelWindow.hide();
        this._refuelWindow.deactivate();
    };

    //=============================================================================
    // Scene_Base modifications - Ensure timer persists across all scenes
    //=============================================================================
    const _Scene_Base_createWindowLayer_FTS = Scene_Base.prototype.createWindowLayer;
    Scene_Base.prototype.createWindowLayer = function() {
        _Scene_Base_createWindowLayer_FTS.call(this);
        this.createPersistentTravelTimer();
    };


    Scene_Base.prototype.createPersistentTravelTimer = function() {
        // Only create in scenes that don't already have their own timer window
        if (!(this instanceof Scene_Map)) {
            const data = getFastTravelData();
            if (data.timerActive) {
                // For car sharing, show timer in all scenes
                if (data.selectedTransport === 'carsharing'||data.selectedTransport === 'camper') {
                    const rect = new Rectangle(Graphics.boxWidth - 300, 0, 300, Window_Base.prototype.fittingHeight(3));
                    this._persistentTimerWindow = new Window_TravelTimer(rect);
                    this._persistentTimerWindow.refreshFromGameSystem();
                    this._persistentTimerWindow.show();
                    this.addWindow(this._persistentTimerWindow);
                }
                // For other transport types, don't show timer outside of travel map
            }
        }
    };
    //=============================================================================
    // Window_TravelTimer - Enhanced with persistent data sync
    //=============================================================================
    class Window_TravelTimer extends Window_Base {
        initialize(rect) {
            super.initialize(rect);
            this.refresh();
        }

        refreshFromGameSystem() {
            const data = getFastTravelData();
            if (data.timerActive) {
                this.show();
                this.refresh();
            } else {
                this.hide();
            }
        }

        refresh() {
            this.contents.clear();
            
            const data = getFastTravelData();
            if (!data.timerActive) {
                this.hide();
                return;
            }
            
            if (data.timerRemainingTime <= 0 && data.travelCompleted) {
                // Show completion message and instructions
                this.changeTextColor(ColorManager.textColor(17)); // Green color
                this.contents.fontSize = 20;
                this.drawText("Travel Complete!", 4, 0, this.contentsWidth() - 8, 'center');
                this.resetFontSettings();
                
                this.changeTextColor(ColorManager.textColor(6)); // Yellow color
                this.contents.fontSize = 16;
                this.drawText("Use 'End Travel' command", 4, this.lineHeight(), this.contentsWidth() - 8, 'center');
                this.drawText("to disembark", 4, this.lineHeight() + 20, this.contentsWidth() - 8, 'center');
                this.resetFontSettings();
                return;
            }
            
            const remainingTime = data.timerRemainingTime;
            const minutes = Math.floor(remainingTime / 60);
            const seconds = remainingTime % 60;
            const timeString = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
            
            this.changeTextColor(ColorManager.systemColor());
            this.drawText("Time to Arrival:", 4, 0, this.contentsWidth() - 8);
            
            this.changeTextColor(ColorManager.normalColor());
            this.contents.fontSize = 24;
            this.drawText(timeString, 4, this.lineHeight(), this.contentsWidth() - 8, 'center');
            this.resetFontSettings();
            
            if (this.contentsHeight() > this.lineHeight() * 2 && data.totalDistanceKm > 0) {
                // Calculate remaining distance based on time progress
                let remainingKm = 0;
                if (data.timerDuration > 0) {
                    const progress = (data.timerDuration - remainingTime) / data.timerDuration;
                    remainingKm = Math.max(0, Math.round(data.totalDistanceKm * (1 - progress)));
                } else {
                    remainingKm = data.totalDistanceKm;
                }
                
                this.changeTextColor(ColorManager.textColor(3));
                this.contents.fontSize = 18;
                this.drawText(`${remainingKm} km remaining`, 4, this.lineHeight() * 2 + 4, this.contentsWidth() - 8, 'center');
                this.resetFontSettings();
            }
        }

        update() {
            super.update();
            // Refresh every 60 frames (1 second) to stay synchronized
            if (Graphics.frameCount % 60 === 0) {
                this.refreshFromGameSystem();
            }
        }
    }

    //=============================================================================
    // Window_FastTravelDestination - Destination selection window
    //=============================================================================
    class Window_FastTravelDestination extends Window_Command {
        initialize(rect) {
            super.initialize(rect);
        }

        makeCommandList()  {
            const data = getFastTravelData();
            const transportType = data.selectedTransport;
            if (!data.destinations) return;
        
            // Always use stored player coordinates from variables, not current position
            const playerX = $gameVariables.value(playerXVar);
            const playerY = $gameVariables.value(playerYVar);
            
            // Get current map name
            const currentMapName = $dataMapInfos[$gameMap.mapId()]?.name || '';
        
            // Filter destinations based on transport type requirements
            let filteredDestinations = data.destinations;
            
            if (transportType === 'bus' || transportType === 'train' || transportType === 'helicopter')  {
                filteredDestinations = data.destinations.filter(dest => {
                    return dest.transportOverrides && dest.transportOverrides[transportType];
                });
            }
            
            // Filter out destinations whose name is contained in current map name
            filteredDestinations = filteredDestinations.filter(dest => {
                return !currentMapName.toLowerCase().includes(dest.name.toLowerCase());
            });

            // If a destination whitelist is set (e.g. tutorial station), apply it
            if (data.allowedDestinations && data.allowedDestinations.length > 0) {
                filteredDestinations = filteredDestinations.filter(dest =>
                    data.allowedDestinations.includes(dest.name)
                );
            }
        
            const destinationsWithDistance = filteredDestinations
                .map(dest => {
                    const actualDest = getActualDestination(dest, transportType);
                    // Use stored coordinates for distance calculation
                    const distance = calculateDistance(playerX, playerY, actualDest.x, actualDest.y);
                    return { destination: dest, distance: distance };
                })
                .sort((a, b) => a.distance - b.distance);
        
            destinationsWithDistance.forEach(item => {
                const dest = item.destination;
                const distanceInTiles = item.distance;
                const distanceInKm = Math.round(distanceInTiles * 1);
        
                let text, enabled;
                
                if (transportType === 'carsharing'||transportType === 'camper') {
                    const fuelNeeded = calculateTravelCostFromDistance(distanceInTiles, transportType);
                    enabled = getCurrentFuel() >= fuelNeeded;
                    text = `${dest.name} (${fuelNeeded.toFixed(1)}L, ${distanceInKm} km)`;
                } else {
                    const cost = calculateTravelCostFromDistance(distanceInTiles, transportType);
                    const costEuros = goldToEuros(cost);
                    enabled = $gameParty.gold() >= cost;
                    text = `${dest.name} (${costEuros}€, ${distanceInKm} km)`;
                }
        
                this.addCommand(text, "destination", enabled, dest);
            });
        }
    }

//=============================================================================
    // Window_Refuel - Enhanced refueling window with camper refuel and fuel tank purchase
    //=============================================================================

//=============================================================================
// Window_Refuel - Reworked for Car/Camper selection
//=============================================================================
//=============================================================================
// Window_Refuel - Fixed version with proper input handling
//=============================================================================
class Window_Refuel extends Window_Base {
    initialize(rect) {
        // Make it fullscreen
        const fullscreenRect = new Rectangle(0, 0, Graphics.boxWidth, Graphics.boxHeight);
        super.initialize(fullscreenRect);
        this._selectedIndex = 0;
        this._options = [];
        this._animationPhase = 0;
        this._pulseTimer = 0;
        this.opacity = 0;
        this.contentsOpacity = 0;
        this._active = false; // Add active state tracking

        this._view = 'main_menu'; // 'main_menu', 'car_refuel', 'camper_refuel'
        this._carFuelCapacity = 60; // Assumed fuel capacity for the car in Liters.
        this.setupMainMenuOptions();
        this.refresh();
    }

    // Add proper activation/deactivation methods
    activate() {
        this._active = true;
        this.show();
    }

    deactivate() {
        this._active = false;
        this.hide();
    }

    // Override show to set active state
    show() {
        super.show();
        $gamePlayer.setMovementLock(true);
        this._animationPhase = 0;
        this.startFadeIn();
    }

    // Override hide to clear active state
    hide() {
        super.hide();
        $gamePlayer.setMovementLock(false);
        this._active = false; // Ensure active state is cleared
        this.startFadeOut();
    }

    // Sets up the initial three choices
    setupMainMenuOptions() {
        this._view = 'main_menu';
        this._options = [];
        this._currentOption = null;

        // Option 1: Car Refuel
        const carRefuelEnabled = $gameSwitches.value(64);
        this._options.push({
            type: "select_car_refuel",
            text: "Car Refuel",
            description: "Refuel the primary vehicle.",
            enabled: carRefuelEnabled,
        });

        // Option 2: Camper Refuel
        const camperRefuelEnabled = $gameSwitches.value(51);
        this._options.push({
            type: "select_camper_refuel",
            text: "Camper Refuel",
            description: "Refuel the RV camper's tank.",
            enabled: camperRefuelEnabled,
        });

        // Option 3: Exit
        this._options.push({
            type: "exit",
            text: "Exit Station",
            description: "Leave the fuel station.",
            enabled: true,
        });
    }

    // Sets up the detailed refueling options for the selected vehicle
    setupDetailedRefuelOptions(vehicleType) {
        this._view = vehicleType; // 'car_refuel' or 'camper_refuel'
        this._options = [];
        
        const fuelPrice = getFuelPrice();
        let currentFuel, maxCapacity;

        if (vehicleType === 'car_refuel') {
            currentFuel = $gameVariables.value(71) || 0;
            maxCapacity = this._carFuelCapacity;
        } else { // 'camper_refuel'
            currentFuel = getCurrentFuel(); // Uses original plugin parameter for fuelVar (46)
            maxCapacity = fuelCapacity; // Uses original plugin parameter
        }
        
        const maxRefuel = maxCapacity - currentFuel;

        if (maxRefuel > 0.1) { // Only show options if fuel is actually needed
            const refuelAmounts = [5, 10, 25, 50];
            
            refuelAmounts.forEach(liters => {
                if (liters < maxRefuel) {
                    const cost = Math.floor(liters * fuelPrice);
                    const enabled = $gameParty.gold() >= cost;
                    this._options.push({
                        type: "refuel", text: `${liters} Liters`,
                        description: `Standard refuel amount`, liters: liters,
                        cost: cost, enabled: enabled,
                    });
                }
            });
            
            const cost = Math.floor(maxRefuel * fuelPrice);
            const enabled = $gameParty.gold() >= cost;
            this._options.push({
                type: "refuel", text: `Fill Tank (${maxRefuel.toFixed(1)}L)`,
                description: "Fill to maximum capacity", liters: maxRefuel,
                cost: cost, enabled: enabled,
            });
        }
        
        this._options.push({
            type: "back", text: "Back",
            description: "Return to vehicle selection.",
            cost: 0, enabled: true,
        });
    }

    refresh() {
        this.contents.clear();
        if (!this._options) return;

        this.drawBackground();
        this.drawTitle();

        if (this._view === 'main_menu') {
            this.drawMainMenuOptions();
        } else {
            let currentFuel, maxCapacity;
            if (this._view === 'car_refuel') {
                currentFuel = $gameVariables.value(71) || 0;
                maxCapacity = this._carFuelCapacity;
            } else {
                currentFuel = getCurrentFuel();
                maxCapacity = fuelCapacity;
            }
            this.drawFuelGauge(currentFuel, maxCapacity);
            this.drawStationInfo();
            this.drawRefuelOptions();
        }
    }

    // Draws the initial Car/Camper/Exit menu
    drawMainMenuOptions() {
        const startY = 250;
        const optionHeight = 80;
        const optionWidth = this.contentsWidth() / 2;
        const optionX = (this.contentsWidth() - optionWidth) / 2;

        this._options.forEach((option, index) => {
            const y = startY + (index * (optionHeight + 20));
            const isSelected = index === this._selectedIndex;
            const isEnabled = option.enabled;

            let bgColor = isSelected ? 'rgba(233, 69, 96, 0.3)' : 'rgba(1, 1, 35, 0.8)';
            if (!isEnabled) bgColor = 'rgba(50, 50, 50, 0.5)';
            this.contents.context.fillStyle = bgColor;
            this.contents.context.fillRect(optionX, y, optionWidth, optionHeight);

            let borderColor = isSelected ? '#e94560' : '#f2a365';
            if (!isEnabled) borderColor = '#666666';
            this.contents.context.strokeStyle = borderColor;
            this.contents.context.lineWidth = isSelected ? 3 : 1;
            this.contents.context.strokeRect(optionX, y, optionWidth, optionHeight);

            let textColor = isEnabled ? '#ffffff' : '#888888';
            if (isSelected && isEnabled) textColor = '#f2a365';
            
            this.contents.context.fillStyle = textColor;
            this.contents.context.textAlign = 'center';
            this.contents.context.font = isSelected ? 'bold 28px serif' : '26px serif';
            this.contents.context.fillText(option.text, this.contentsWidth() / 2, y + 35);
            
            this.contents.context.font = '18px serif';
            this.contents.context.fillStyle = isEnabled ? '#cccccc' : '#666666';
            this.contents.context.fillText(option.description, this.contentsWidth() / 2, y + 60);
        });
    }

    // Draws the detailed options for purchasing fuel
    drawRefuelOptions() {
        const startY = 400;
        const optionHeight = 70;
        const optionWidth = this.contentsWidth() - 120;
        const optionX = 60;
        
        this._options.forEach((option, index) => {
            const y = startY + (index * (optionHeight + 10));
            const isSelected = index === this._selectedIndex;
            const isEnabled = option.enabled;
            
            let bgColor = isSelected ? 'rgba(233, 69, 96, 0.3)' : 'rgba(1, 1, 35, 0.8)';
            if (!isEnabled) bgColor = 'rgba(50, 50, 50, 0.5)';
            this.contents.context.fillStyle = bgColor;
            this.contents.context.fillRect(optionX, y, optionWidth, optionHeight);
            
            let borderColor = isSelected ? '#e94560' : '#f2a365';
            if (!isEnabled) borderColor = '#666666';
            this.contents.context.strokeStyle = borderColor;
            this.contents.context.lineWidth = isSelected ? 3 : 1;
            this.contents.context.strokeRect(optionX, y, optionWidth, optionHeight);
            
            let textColor = isEnabled ? '#ffffff' : '#888888';
            if (isSelected && isEnabled) textColor = '#f2a365';
            
            this.contents.context.fillStyle = textColor;
            this.contents.context.textAlign = 'left';
            this.contents.context.font = isSelected ? 'bold 22px serif' : '20px serif';
            this.contents.context.fillText(option.text, optionX + 20, y + 30);
            
            this.contents.context.font = '16px serif';
            this.contents.context.fillStyle = isEnabled ? '#cccccc' : '#666666';
            this.contents.context.fillText(option.description, optionX + 20, y + 50);
            
            if (option.cost > 0) {
                const costText = `${goldToEuros(option.cost)}€`;
                this.contents.context.font = 'bold 24px monospace';
                this.contents.context.textAlign = 'right';
                this.contents.context.fillStyle = isEnabled ? '#2ed573' : '#666666';
                this.contents.context.fillText(costText, optionX + optionWidth - 20, y + 40);
            }
        });
    }

    processOk() {
        const selectedOption = this._options[this._selectedIndex];
        if (!selectedOption || !selectedOption.enabled) {
            SoundManager.playBuzzer();
            return;
        }

        SoundManager.playOk();

        if (this._view === 'main_menu') {
            switch (selectedOption.type) {
                case 'select_car_refuel':
                    this.setupDetailedRefuelOptions('car_refuel');
                    break;
                case 'select_camper_refuel':
                    this.setupDetailedRefuelOptions('camper_refuel');
                    break;
                case 'exit':
                    this.processCancel();
                    return;
            }
            this.select(0);
            this.refresh();
        } else { // In a detailed refuel view
            if (selectedOption.type === 'back') {
                this.setupMainMenuOptions();
                this.select(0);
                this.refresh();
                SoundManager.playCancel();
                return;
            }
            if (this._handler && selectedOption.type === 'refuel') {
                this._currentOption = selectedOption;
                this._handler('ok');
            }
        }
    }

    processCancel() {
        SoundManager.playCancel();
        if (this._view !== 'main_menu') {
            this.setupMainMenuOptions();
            this.select(0);
            this.refresh();
        } else {
            if (this._handler) {
                this._handler('cancel');
            }
        }
    }

    getCurrentRefuelType() {
        return this._view;
    }
    
    selectNext() {
        if (this._options.length === 0) return;
        SoundManager.playCursor();
        this._selectedIndex = (this._selectedIndex + 1) % this._options.length;
        this.refresh();
    }

    selectPrevious() {
        if (this._options.length === 0) return;
        SoundManager.playCursor();
        this._selectedIndex = (this._selectedIndex - 1 + this._options.length) % this._options.length;
        this.refresh();
    }

    drawFuelGauge(currentFuel, maxCapacity) {
        const gaugeWidth = this.contentsWidth() - 200;
        const gaugeHeight = 60;
        const gaugeX = 100;
        const gaugeY = 10;
        this.contents.context.fillStyle = '#0f0f23';
        this.contents.context.fillRect(gaugeX - 10, gaugeY - 10, gaugeWidth + 20, gaugeHeight + 20);
        this.contents.context.strokeStyle = '#e94560';
        this.contents.context.lineWidth = 3;
        this.contents.context.strokeRect(gaugeX - 10, gaugeY - 10, gaugeWidth + 20, gaugeHeight + 20);
        this.contents.context.fillStyle = '#1a1a2e';
        this.contents.context.fillRect(gaugeX, gaugeY, gaugeWidth, gaugeHeight);

        const fillWidth = (currentFuel / maxCapacity) * gaugeWidth;
        let fuelGradient;
        if (currentFuel < maxCapacity * 0.25) {
            fuelGradient = this.contents.context.createLinearGradient(gaugeX, gaugeY, gaugeX, gaugeY + gaugeHeight);
            fuelGradient.addColorStop(0, '#ff4757'); fuelGradient.addColorStop(1, '#c23616');
        } else if (currentFuel < maxCapacity * 0.75) {
            fuelGradient = this.contents.context.createLinearGradient(gaugeX, gaugeY, gaugeX, gaugeY + gaugeHeight);
            fuelGradient.addColorStop(0, '#ffa502'); fuelGradient.addColorStop(1, '#ff6348');
        } else {
            fuelGradient = this.contents.context.createLinearGradient(gaugeX, gaugeY, gaugeX, gaugeY + gaugeHeight);
            fuelGradient.addColorStop(0, '#2ed573'); fuelGradient.addColorStop(1, '#1e90ff');
        }
        this.contents.context.fillStyle = fuelGradient;
        this.contents.context.fillRect(gaugeX, gaugeY, fillWidth, gaugeHeight);

        this.contents.context.font = 'bold 32px monospace';
        this.contents.context.textAlign = 'center';
        this.contents.context.fillStyle = '#ffffff';
        this.contents.context.fillText(
            `${Math.floor(currentFuel)}L / ${maxCapacity}L`,
            this.contentsWidth() / 2, gaugeY + (gaugeHeight / 2) + 10
        );
        this.contents.context.font = 'bold 24px serif';
        this.contents.context.fillStyle = '#f2a365';
        this.contents.context.fillText('FUEL LEVEL', this.contentsWidth() / 2, gaugeY - 20);
    }

    startFadeIn() {
        this.opacity = 0;
        this.contentsOpacity = 0;
        const fadeSpeed = 8;
        const fadeInterval = setInterval(() => {
            this.opacity = Math.min(255, this.opacity + fadeSpeed);
            this.contentsOpacity = Math.min(255, this.contentsOpacity + fadeSpeed);
            if (this.opacity >= 255) {
                clearInterval(fadeInterval);
            }
        }, 16);
    }

    startFadeOut() {
        const fadeSpeed = 12;
        const fadeInterval = setInterval(() => {
            this.opacity = Math.max(0, this.opacity - fadeSpeed);
            this.contentsOpacity = Math.max(0, this.contentsOpacity - fadeSpeed);
            if (this.opacity <= 0) {
                clearInterval(fadeInterval);
            }
        }, 16);
    }

    drawBackground() {
        const width = this.contentsWidth();
        const height = this.contentsHeight();
        const gradient = this.contents.context.createLinearGradient(0, 0, 0, height);
        gradient.addColorStop(0, '#1a1a2e');
        gradient.addColorStop(0.3, '#16213e');
        gradient.addColorStop(0.7, '#0f3460');
        gradient.addColorStop(1, '#0e2954');
        this.contents.context.fillStyle = gradient;
        this.contents.context.fillRect(0, 0, width, height);
        this.contents.context.strokeStyle = '#e94560';
        this.contents.context.lineWidth = 4;
        this.contents.context.strokeRect(10, 10, width - 20, height - 20);
        this.contents.context.strokeStyle = '#f2a365';
        this.contents.context.lineWidth = 2;
        this.contents.context.strokeRect(20, 20, width - 40, height - 40);
    }

    drawTitle() {
        const titleY = 60;
        this.contents.context.font = 'bold 48px serif';
        this.contents.context.textAlign = 'center';
        this.contents.context.fillStyle = '#000000';
        this.contents.context.fillText('FUEL STATION', this.contentsWidth() / 2 + 3, titleY + 3);
        const titleGradient = this.contents.context.createLinearGradient(0, titleY - 30, 0, titleY + 10);
        titleGradient.addColorStop(0, '#f2a365');
        titleGradient.addColorStop(1, '#e94560');
        this.contents.context.fillStyle = titleGradient;
        this.contents.context.fillText('FUEL STATION', this.contentsWidth() / 2, titleY);
        this.contents.context.font = 'italic 24px serif';
        this.contents.context.fillStyle = '#ffffff';
        this.contents.context.fillText('Premium Automotive Services', this.contentsWidth() / 2, titleY + 40);
    }

    drawStationInfo() {
        const infoY = 280;
        const fuelPrice = getFuelPrice();
        const currentGold = $gameParty.gold();
        this.contents.context.fillStyle = 'rgba(1, 1, 35, 0.8)';
        this.contents.context.fillRect(50, infoY, this.contentsWidth() - 100, 80);
        this.contents.context.strokeStyle = '#f2a365';
        this.contents.context.lineWidth = 2;
        this.contents.context.strokeRect(50, infoY, this.contentsWidth() - 100, 80);
        this.contents.context.font = '20px serif';
        this.contents.context.textAlign = 'left';
        this.contents.context.fillStyle = '#ffffff';
        this.contents.context.fillText(`Fuel Price: ${goldToEuros(fuelPrice)}€/L`, 80, infoY + 30);
        this.contents.context.fillText(`Available Funds: ${goldToEuros(currentGold)}€`, 80, infoY + 55);
    }


    // Fixed update method - only process input when active and visible
    update() {
        super.update();
        this._pulseTimer++;
        if (this._pulseTimer % 60 === 0) {
            this.refresh();
        }
        
        // Only process input when the window is active and visible
        if (this._active && this.visible) {
            this.processInput();
        }
    }

    // Input processing - now only called when window is active
    processInput() {
        if (Input.isTriggered('ok') || TouchInput.isTriggered()) {
            this.processOk();
        } else if (Input.isTriggered('cancel')) {
            this.processCancel();
        } else if (Input.isRepeated('up')) {
            this.selectPrevious();
        } else if (Input.isRepeated('down')) {
            this.selectNext();
        }
    }

    getCurrentOption() {
        return this._currentOption || this._options[this._selectedIndex];
    }

    setHandler(symbol, method) {
        this._handler = method;
    }

    select(index) {
        this._selectedIndex = Math.max(0, Math.min(index, this._options.length - 1));
        this.refresh();
    }
}

// Replace the existing onRefuelOk function in Scene_Map with this new version
Scene_Map.prototype.onRefuelOk = function() {
    window.skipLocalization = true;

    const selectedOption = this._refuelWindow.getCurrentOption();
    const refuelType = this._refuelWindow.getCurrentRefuelType();

    if (!selectedOption || !selectedOption.enabled || selectedOption.type !== 'refuel') {
        this._refuelWindow.activate();
        return;
    }

    const liters = selectedOption.liters;
    const cost = selectedOption.cost;
    const costEuros = goldToEuros(cost);
    const vehicleName = refuelType === 'car_refuel' ? 'car' : 'camper';

    $gameMessage.add(`\\C[17]Refuel Confirmation\\C[0]`);
    $gameMessage.add(`Purchase ${liters.toFixed(1)}L for the ${vehicleName} for ${costEuros}€?`);
    $gameMessage.setChoices(["Confirm", "Cancel"], 0, 1);
    $gameMessage.setChoiceCallback(n => {
        if (n === 0) { // Confirm
            if ($gameParty.gold() >= cost) {
                $gameParty.loseGold(cost);
                
                if (refuelType === 'car_refuel') {
                    const carCapacity = 60; // Must match the value in the window class
                    const currentFuel = $gameVariables.value(71) || 0;
                    const newFuel = Math.min(carCapacity, currentFuel + liters);
                    $gameVariables.setValue(carFuelVar, newFuel);
                } else { // 'camper_refuel'
                    const currentFuel = getCurrentFuel();
                    setCurrentFuel(currentFuel + liters);
                }

                $gameMessage.add(`\\C[17]Refueling Complete!\\C[0]`);
                $gameMessage.add(`Added ${liters.toFixed(1)}L of fuel to the ${vehicleName}.`);
                
                this._refuelWindow.setupDetailedRefuelOptions(refuelType);
                this._refuelWindow.refresh();
                this._refuelWindow.select(0);
            } else {
                $gameMessage.add(`\\C[18]Insufficient funds!\\C[0]`);
                $gameMessage.add(`You need ${costEuros}€ for this purchase.`);
            }
        }
        this._refuelWindow.activate();
    });
    window.skipLocalization = false;

};

// ===========================
// Window_DestinationPicture
// ===========================
class Window_DestinationPicture extends Window_Base {
    initialize(rect) {
        super.initialize(rect);
        this._locationName = "";
        this._bitmap = null;
        this.opacity = 255;
        this.hide();
    }

    setLocation(locationName) {
        this._locationName = locationName;
        this.loadPicture();
        this.refresh();
        this.show();
    }

    loadPicture() {
        // Get picture filename from TRANSPORT_DESTINATIONS
        const destinationData = TRANSPORT_DESTINATIONS[this._locationName];
        const filename = destinationData && destinationData.picture ? destinationData.picture : this._locationName;
        
        this._bitmap = ImageManager.loadPicture(filename);
        
        // Wait for bitmap to load
        if (this._bitmap && !this._bitmap.isReady()) {
            this._bitmap.addLoadListener(() => {
                this.refresh();
            });
        }
    }

    refresh() {
        this.contents.clear();
        
        if (!this._bitmap || !this._bitmap.isReady()) {
            return;
        }

        // Draw the location name at the top
        this.drawLocationName();
        
        // Draw the picture
        this.drawPicture();
    }

    drawLocationName() {
        const textY = 10;
        this.contents.fontSize = 28;
        this.changeTextColor(ColorManager.systemColor());
        this.drawText(this._locationName, 0, textY, this.contentsWidth(), 'center');
        this.resetTextColor();
    }

    drawPicture() {
        if (!this._bitmap || !this._bitmap.isReady()) {
            return;
        }

        // Calculate position to center the image
        const imageY = 50; // Below the title
        const availableWidth = this.contentsWidth();
        const availableHeight = this.contentsHeight() - imageY - 10;
        
        // Calculate scaling to fit within window while maintaining aspect ratio
        const scaleX = availableWidth / this._bitmap.width;
        const scaleY = availableHeight / this._bitmap.height;
        const scale = Math.min(scaleX, scaleY, 1); // Don't scale up
        
        const scaledWidth = this._bitmap.width * scale;
        const scaledHeight = this._bitmap.height * scale;
        
        // Center the image
        const imageX = (availableWidth - scaledWidth) / 2;
        
        // Draw the bitmap
        const sx = 0;
        const sy = 0;
        const sw = this._bitmap.width;
        const sh = this._bitmap.height;
        
        this.contents.blt(this._bitmap, sx, sy, sw, sh, imageX, imageY, scaledWidth, scaledHeight);
    }

    update() {
        super.update();
        // This window doesn't consume input - it's overlay only
    }

    // Override to prevent input processing
    processHandling() {
        return false;
    }

    isOkEnabled() {
        return false;
    }

    isCancelEnabled() {
        return false;
    }
}

// ===========================
// Scene_Map - Destination Picture Methods
// ===========================
Scene_Map.prototype.showDestinationPicture = function(locationName) {
    if (!this._destinationPictureWindow) {
        this.createDestinationPictureWindow();
    }
    this._destinationPictureWindow.setLocation(locationName);
};

Scene_Map.prototype.hideDestinationPicture = function() {
    if (this._destinationPictureWindow) {
        this._destinationPictureWindow.hide();
    }
};

Scene_Map.prototype.createDestinationPictureWindow = function() {
    // Create window in center of screen
    const width = 600;
    const height = 500;
    const x = (Graphics.boxWidth - width) / 2;
    const y = (Graphics.boxHeight - height) / 2;
    const rect = new Rectangle(x, y, width, height);
    
    this._destinationPictureWindow = new Window_DestinationPicture(rect);
    this.addWindow(this._destinationPictureWindow);
};

// Hook into Scene_Map.createAllWindows to ensure window is created
const _Scene_Map_createAllWindows = Scene_Map.prototype.createAllWindows;
Scene_Map.prototype.createAllWindows = function() {
    _Scene_Map_createAllWindows.call(this);
    this.createDestinationPictureWindow();
};

})();
//=============================================================================
// AnokiHexphoneSystem.js
//=============================================================================

/*:
 * @target MZ
 * @plugindesc [v2.1.0] Anoki-Style Hexphone System with Credits, Messages, Games
 * @author Omni-Lex 
 * @url https://nocoldiz.itch.io/hypernet-explorer
 * @help AnokiHexphoneSystem.js
 * * v2.1.0 - Added fully functional Messages, Settings, and Games apps.
 * - Added plugin commands for sending/receiving messages.
 * - Main menu is now fully interactive.
 * * @param menuText
 * @text Menu Option Text
 * @desc Text shown in the pause menu for the phone
 * @type string
 * @default Hexphone
 * * @param initialCredits
 * @text Initial Credits
 * @desc Starting phone credits for the player
 * @type number
 * @min 0
 * @default 100
 * * @param callCostPerSecond
 * @text Call Cost Per Second
 * @desc Credits consumed per second during calls
 * @type number
 * @min 0
 * @default 1
 * * @param messageCost
 * @text Message Cost
 * @desc Credits consumed per message sent
 * @type number
 * @min 0
 * @default 5
 * * @param ringtones
 * @text Available Ringtones
 * @desc List of available ringtones
 * @type struct<Ringtone>[]
 * @default ["{\"name\":\"Anoki Tune\",\"se\":\"Decision1\",\"volume\":\"90\",\"pitch\":\"100\"}","{\"name\":\"Classic\",\"se\":\"Bell1\",\"volume\":\"90\",\"pitch\":\"100\"}"]
 * * @param contacts
 * @text Available Contacts
 * @desc Define your available contacts here
 * @type struct<Contact>[]
 * @default []
 * * @param games
 * @text Phone Games
 * @desc Mini-games available on the phone
 * @type struct<PhoneGame>[]
 * @default ["{\"name\":\"Snake\",\"commonEventId\":\"1\"}"]
 * * @command openPhone
 * @text Open Phone
 * @desc Opens the Anoki phone interface
 * * @command addCredits
 * @text Add Credits
 * @desc Add credits to the phone
 * * @arg amount
 * @text Amount
 * @desc Amount of credits to add
 * @type number
 * @min 0
 * @default 10
 * * @command registerContact
 * @text Register Contact
 * @desc Add a contact to the phone
 * * @arg contactName
 * @text Contact Name
 * @desc Name of the contact to register
 * @type string
 * @default
 * * @command removeContact
 * @text Remove Contact
 * @desc Remove a contact from the phone
 * * @arg contactName
 * @text Contact Name
 * @desc Name of the contact to remove
 * @type string
 * @default
 *
 * @command receiveMessage
 * @text Receive Message
 * @desc Adds a new message to the phone's inbox
 *
 * @arg sender
 * @text Sender
 * @desc Who the message is from
 * @type string
 * @default ???
 *
 * @arg content
 * @text Content
 * @desc The text content of the message
 * @type multiline_string
 * @default
 *
 * @command sendMessage
 * @text Send Message
 * @desc Sends a new message (costs credits)
 *
 * @arg recipient
 * @text Recipient
 * @desc Who the message is being sent to
 * @type string
 * @default ???
 *
 * @arg content
 * @text Content
 * @desc The text content of the message
 * @type multiline_string
 * @default
 */

/*~struct~Contact:
 * @param name
 * @text Contact Name
 * @desc Name of the contact
 * @type string
 * @default 
 * * @param number
 * @text Phone Number
 * @desc Phone number (display only)
 * @type string
 * @default 555-0100
 * * @param commonEventId
 * @text Common Event ID
 * @desc Common event to call when this contact is selected
 * @type common_event
 * @default 1
 */

/*~struct~Ringtone:
 * @param name
 * @text Ringtone Name
 * @desc Display name for the ringtone
 * @type string
 * @default 
 * * @param se
 * @text Sound Effect
 * @desc Sound effect file for the ringtone
 * @type file
 * @dir audio/se/
 * @default Decision1
 * * @param volume
 * @text Volume
 * @desc Volume of the ringtone (0-100)
 * @type number
 * @min 0
 * @max 100
 * @default 90
 * * @param pitch
 * @text Pitch
 * @desc Pitch of the ringtone (50-150)
 * @type number
 * @min 50
 * @max 150
 * @default 100
 */

/*~struct~PhoneGame:
 * @param name
 * @text Game Name
 * @desc Name of the mini-game
 * @type string
 * @default 
 * * @param commonEventId
 * @text Common Event ID
 * @desc Common event to launch the game
 * @type common_event
 * @default 1
 */

(() => {
    'use strict';

    const pluginName = "AnokiHexphoneSystem";
    const parameters = PluginManager.parameters(pluginName);
    const requiredItemIds = [1, 173, 184, 358];

    // Translation system
    const translations = {
        en: {
            'Credits': 'Credits',
            'New Messages': 'New Messages!',
            'Press MENU': 'Press MENU',
            'MENU': 'MENU',
            'Press END to exit': 'Press END to exit',
            'DIAL NUMBER': 'DIAL NUMBER',
            'Enter number and': 'Enter number and',
            'press CALL button': 'press CALL button',
            'Delete and Save': '*: Delete  MENU: Save',
            'CONTACTS': 'CONTACTS',
            'No contacts': 'No contacts',
            'Call and Delete': 'MENU: Call  *: Delete',
            'CALLING': 'CALLING...',
            'Cost': 'Cost',
            'Press to hang up': 'Press # to hang up',
            'ADD CONTACT': 'ADD CONTACT',
            'Enter number': 'Enter number:',
            'Then press MENU': 'Then press MENU',
            'to save contact': 'to save contact',
            'Delete and Cancel': '*: Delete  END: Cancel',
            'CALL HISTORY': 'CALL HISTORY',
            'No call history': 'No call history',
            'Press END to return': 'Press END to return',
            'MESSAGES': 'MESSAGES',
            'No messages': 'No messages',
            'Read and Delete': 'MENU: Read  *: Delete',
            'SETTINGS': 'SETTINGS',
            'Change setting': 'Press 2/8 to change',
            'GAMES': 'GAMES',
            'No games': 'No games installed',
            'Play Game': 'MENU: Play Game'
        },
        it: {
            'Credits': 'Crediti',
            'New Messages': 'Nuovi Messaggi!',
            'Press MENU': 'Premi MENU',
            'MENU': 'MENU',
            'Press END to exit': 'Premi FINE per uscire',
            'DIAL NUMBER': 'COMPONI NUMERO',
            'Enter number and': 'Inserisci numero e',
            'press CALL button': 'premi CHIAMA',
            'Delete and Save': '*: Cancella  MENU: Salva',
            'CONTACTS': 'CONTATTI',
            'No contacts': 'Nessun contatto',
            'Call and Delete': 'MENU: Chiama  *: Cancella',
            'CALLING': 'CHIAMATA...',
            'Cost': 'Costo',
            'Press to hang up': 'Premi # per chiudere',
            'ADD CONTACT': 'AGGIUNGI CONTATTO',
            'Enter number': 'Inserisci numero:',
            'Then press MENU': 'Poi premi MENU',
            'to save contact': 'per salvare contatto',
            'Delete and Cancel': '*: Cancella  FINE: Annulla',
            'CALL HISTORY': 'CRONOLOGIA CHIAMATE',
            'No call history': 'Nessuna cronologia',
            'Press END to return': 'Premi FINE per tornare',
            'MESSAGES': 'MESSAGGI',
            'No messages': 'Nessun messaggio',
            'Read and Delete': 'MENU: Leggi  *: Cancella',
            'SETTINGS': 'IMPOSTAZIONI',
            'Change setting': 'Premi 2/8 per cambiare',
            'GAMES': 'GIOCHI',
            'No games': 'Nessun gioco installato',
            'Play Game': 'MENU: Gioca'
        }
    };

    // Function to get translated text
    function getText(key) {
        const language = ConfigManager.language === 'it' ? 'it' : 'en';
        return translations[language][key] || translations.en[key] || key;
    }

    // Function to convert gold to euros (100 gold = 1 euro)
    function goldToEuros(goldAmount) {
        return (goldAmount / 100).toFixed(2);
    }

    // Parse parameters
    const menuText = parameters['menuText'] || 'Hexphone';
    const initialCredits = Number(parameters['initialCredits']) || 100;
    const callCostPerSecond = 5; // 5 gold per second = 0.05 euros per second
    const messageCost = Number(parameters['messageCost']) || 5;
    
    // Parse structured data
    const contactsData = JSON.parse(parameters['contacts'] || '[]');
    const ringtonesData = JSON.parse(parameters['ringtones'] || '[]');
    const gamesData = JSON.parse(parameters['games'] || '[]');
    
    // Process contacts
    const availableContacts = {};
    for (const contactData of contactsData) {
        const contact = JSON.parse(contactData);
        availableContacts[contact.name] = {
            name: contact.name,
            number: contact.number || '555-0100',
            commonEventId: Number(contact.commonEventId) || 1
        };
    }
    
    // Process ringtones
    const availableRingtones = [];
    for (const ringtoneData of ringtonesData) {
        const ringtone = JSON.parse(ringtoneData);
        availableRingtones.push({
            name: ringtone.name,
            se: ringtone.se,
            volume: Number(ringtone.volume) || 90,
            pitch: Number(ringtone.pitch) || 100
        });
    }
    // Add a default ringtone if none are defined
    if (availableRingtones.length === 0) {
        availableRingtones.push({
            name: "Default",
            se: "Decision1",
            volume: 90,
            pitch: 100
        });
    }
    
    // Process games
    const phoneGames = [];
    for (const gameData of gamesData) {
        const game = JSON.parse(gameData);
        phoneGames.push({
            name: game.name
        });
    }

    //=============================================================================
    // Game_System - Data Management
    //=============================================================================
    
    const _Game_System_initialize = Game_System.prototype.initialize;
    Game_System.prototype.initialize = function() {
        _Game_System_initialize.call(this);
        this.initializeAnokiPhone();
    };
    
    Game_System.prototype.initializeAnokiPhone = function() {
        this._phoneContacts = {};
        this._phoneCredits = initialCredits;
        this._phoneMessages = [];
        this._selectedRingtoneIndex = 0; // Use index
        this._phoneSettings = {
            volume: 7,
            brightness: 5,
            language: 'EN'
        };
        this._callHistory = [];

        // Process any pending game registrations that were queued before $gameSystem was ready
        if (window._pendingGameRegistrations && window._pendingGameRegistrations.length > 0) {
            console.log('HexphoneSystem: Processing', window._pendingGameRegistrations.length, 'pending game registrations');
            for (const registration of window._pendingGameRegistrations) {
                this.registerHexphoneGame(registration.name, registration.data);
            }
            window._pendingGameRegistrations = [];
            console.log('HexphoneSystem: Pending registrations processed');
        }
    };
    
    Game_System.prototype.getPhoneCredits = function() {
        return this._phoneCredits || 0;
    };
    
    Game_System.prototype.addPhoneCredits = function(amount) {
        this._phoneCredits = Math.max(0, (this._phoneCredits || 0) + amount);
    };
    
    Game_System.prototype.consumeCredits = function(amount) {
        if (this.getPhoneCredits() >= amount) {
            this._phoneCredits -= amount;
            return true;
        }
        return false;
    };
    
    Game_System.prototype.registerContact = function(contactName) {
        if (availableContacts[contactName]) {
            this._phoneContacts[contactName] = availableContacts[contactName];
            return true;
        }
        return false;
    };
    
    Game_System.prototype.removeContact = function(contactName) {
        if (this._phoneContacts[contactName]) {
            delete this._phoneContacts[contactName];
            return true;
        }
        return false;
    };
    
    Game_System.prototype.getContacts = function() {
        return this._phoneContacts || {};
    };
    
    Game_System.prototype.addCallToHistory = function(number, name, duration) {
        if (!this._callHistory) this._callHistory = [];
        this._callHistory.unshift({
            number: number,
            name: name || 'Unknown',
            duration: duration,
            timestamp: new Date().toLocaleString()
        });
        if (this._callHistory.length > 20) {
            this._callHistory.pop();
        }
    };
    
    Game_System.prototype.getCallHistory = function() {
        return this._callHistory || [];
    };

    // --- NEW Message Functions ---

    Game_System.prototype.getMessages = function() {
        return this._phoneMessages || [];
    };

    Game_System.prototype.getMessage = function(index) {
        return this.getMessages()[index];
    };
    
    Game_System.prototype.addMessage = function(sender, content, type) {
        if (!this._phoneMessages) this._phoneMessages = [];
        const message = {
            sender: sender,
            content: content,
            type: type, // 'received' or 'sent'
            timestamp: new Date(),
            read: type === 'sent'
        };
        this._phoneMessages.unshift(message);
        if (this._phoneMessages.length > 20) {
            this._phoneMessages.pop();
        }
    };
    
    Game_System.prototype.readMessage = function(index) {
        const message = this.getMessage(index);
        if (message) {
            message.read = true;
        }
    };

    Game_System.prototype.deleteMessage = function(index) {
        if (this._phoneMessages[index]) {
            this._phoneMessages.splice(index, 1);
        }
    };

    // --- NEW Settings & Games Functions ---

    Game_System.prototype.getAvailableRingtones = function() {
        return availableRingtones;
    };

    Game_System.prototype.getSelectedRingtoneIndex = function() {
        return this._selectedRingtoneIndex || 0;
    };

    Game_System.prototype.setSelectedRingtoneIndex = function(index) {
        const ringtones = this.getAvailableRingtones();
        this._selectedRingtoneIndex = (index + ringtones.length) % ringtones.length;
    };

    Game_System.prototype.getCurrentRingtone = function() {
        return this.getAvailableRingtones()[this.getSelectedRingtoneIndex()];
    };

    // Plugin system for external game registration
    const externalGames = {};

    Game_System.prototype.registerHexphoneGame = function(gameName, gameData) {
        externalGames[gameName] = gameData;
        // Also add to the phoneGames array if not already there
        if (!phoneGames.find(g => g.name === gameName)) {
            console.log('HexphoneSystem: Adding game to phoneGames array:', gameName);
            phoneGames.push({
                name: gameName
            });
            console.log('HexphoneSystem: Total games now:', phoneGames.length);
        } else {
            console.log('HexphoneSystem: Game already registered:', gameName);
        }
    };

    Game_System.prototype.getExternalGame = function(gameName) {
        return externalGames[gameName] || null;
    };

    Game_System.prototype.getPhoneGames = function() {
        return phoneGames;
    };


    //=============================================================================
    // Scene_AnokiPhone - Main Phone Scene
    //=============================================================================
    
    function Scene_AnokiPhone() {
        this.initialize(...arguments);
    }
    
    Scene_AnokiPhone.prototype = Object.create(Scene_MenuBase.prototype);
    Scene_AnokiPhone.prototype.constructor = Scene_AnokiPhone;
    
    Scene_AnokiPhone.prototype.initialize = function() {
        Scene_MenuBase.prototype.initialize.call(this);
        this._screenMode = 'home';
        this._dialedNumber = '';
        this._buttons = [];
        this._screenAnimation = 0;
        this._inCall = false;
        this._callDuration = 0;
        this._callTimer = null;
        this._cursorBlink = 0;
        
        // Selection indices
        this._selectedContactIndex = 0;
        this._selectedMessageIndex = 0;
        this._selectedGameIndex = 0;
        this._selectedSettingIndex = 0;
        this._selectedHistoryIndex = 0; // Added for consistency
    };
    
    Scene_AnokiPhone.prototype.create = function() {
        Scene_MenuBase.prototype.create.call(this);
        this.createBackground();
        this.createPhoneBody();
        this.createScreen();
        this.createButtons();
        this.playPowerOnSound();
    };

    Scene_AnokiPhone.prototype.createBackground = function() {
        // Transparent background - no sprite needed
    };
    
    Scene_AnokiPhone.prototype.createPhoneBody = function() {
        const phoneX = Graphics.width / 2 - 150;
        const phoneY = 50;
        
        this._phoneSprite = new Sprite();
        this._phoneSprite.bitmap = new Bitmap(300, 600);
        this._phoneSprite.x = phoneX;
        this._phoneSprite.y = phoneY;
        
        const bitmap = this._phoneSprite.bitmap;
        const context = bitmap.context;
        
        // Phone body gradient
        const gradient = context.createLinearGradient(0, 0, 0, 600);
        gradient.addColorStop(0, '#3a4a5a');
        gradient.addColorStop(1, '#1f2937');
        
        context.fillStyle = gradient;
        context.roundRect(0, 0, 300, 600, 20);
        context.fill();
        
        // Phone border
        context.strokeStyle = '#0f172a';
        context.lineWidth = 3;
        context.roundRect(0, 0, 300, 600, 20);
        context.stroke();
        
        // Brand name
        bitmap.fontSize = 12;
        bitmap.fontFace = 'Arial';
        bitmap.textColor = '#94a3b8';
        bitmap.drawText('ANOKI', 0, 10, 300, 24, 'center');
        
        this.addChild(this._phoneSprite);
    };
    
    Scene_AnokiPhone.prototype.createScreen = function() {
        const screenX = Graphics.width / 2 - 130;
        const screenY = 90;
        
        this._screenSprite = new Sprite();
        this._screenSprite.bitmap = new Bitmap(260, 180);
        this._screenSprite.x = screenX;
        this._screenSprite.y = screenY;
        
        const bitmap = this._screenSprite.bitmap;
        
        // Screen background (Nokia green tint)
        bitmap.fillRect(0, 0, 260, 180, '#9fa870');
        
        // Screen border
        const context = bitmap.context;
        context.strokeStyle = '#2d3748';
        context.lineWidth = 2;
        context.strokeRect(0, 0, 260, 180);
        
        this.addChild(this._screenSprite);
        
        // Content sprite (for dynamic content)
        this._contentSprite = new Sprite();
        this._contentSprite.bitmap = new Bitmap(250, 170);
        this._contentSprite.x = screenX + 5;
        this._contentSprite.y = screenY + 5;
        this.addChild(this._contentSprite);
        
        this.refreshScreen();
    };
    
    Scene_AnokiPhone.prototype.refreshScreen = function() {
        const bitmap = this._contentSprite.bitmap;
        bitmap.clear();
        bitmap.fontSize = 14;
        bitmap.fontFace = 'Courier New, monospace';
        bitmap.textColor = '#1a1a1a';
        
        if (this._screenMode === 'home') {
            this.drawHomeScreen(bitmap);
        } else if (this._screenMode === 'menu') {
            this.drawMenuScreen(bitmap);
        } else if (this._screenMode === 'dial') {
            this.drawDialScreen(bitmap);
        } else if (this._screenMode === 'contacts') {
            this.drawContactsScreen(bitmap);
        } else if (this._screenMode === 'calling') {
            this.drawCallingScreen(bitmap);
        } else if (this._screenMode === 'addContact') {
            this.drawAddContactScreen(bitmap);
        } else if (this._screenMode === 'callHistory') {
            this.drawCallHistoryScreen(bitmap);
        } else if (this._screenMode === 'messages') { // NEW
            this.drawMessagesScreen(bitmap);
        } else if (this._screenMode === 'messageView') { // NEW
            this.drawMessageViewScreen(bitmap);
        } else if (this._screenMode === 'settings') { // NEW
            this.drawSettingsScreen(bitmap);
        } else if (this._screenMode === 'games') { // NEW
            this.drawGamesScreen(bitmap);
        } else if (this._screenMode === 'game') { // NEW - Inline game
            this.drawGameScreen(bitmap);
        }
    };
    
    Scene_AnokiPhone.prototype.drawHomeScreen = function(bitmap) {
        const credits = $gameSystem.getPhoneCredits();
        const time = new Date();
        const timeStr = time.getHours().toString().padStart(2, '0') + ':' + 
                       time.getMinutes().toString().padStart(2, '0');
        
        bitmap.fontSize = 20;
        bitmap.drawText(timeStr, 0, 10, 250, 24, 'center');
        
        bitmap.fontSize = 12;
        bitmap.drawText('ANOKI', 0, 40, 250, 20, 'center');
        
        bitmap.fontSize = 14;
        bitmap.drawText(getText('Credits') + ': €' + goldToEuros(credits), 0, 70, 250, 20, 'center');

        // NEW: Check for unread messages
        const unread = $gameSystem.getMessages().some(msg => !msg.read);
        if (unread) {
            bitmap.fontSize = 12;
            bitmap.fontBold = true;
            bitmap.drawText(getText('New Messages'), 0, 95, 250, 20, 'center');
            bitmap.fontBold = false;
        }

        bitmap.fontSize = 11;
        bitmap.drawText(getText('Press MENU'), 0, 120, 250, 20, 'center');
    };
    
    Scene_AnokiPhone.prototype.drawMenuScreen = function(bitmap) {
        bitmap.fontSize = 14;
        bitmap.fontBold = true;
        bitmap.drawText(getText('MENU'), 0, 5, 250, 20, 'center');
        bitmap.fontBold = false;

        bitmap.fontSize = 12;
        // UPDATED Menu
        const menuItems = [
            '1. ' + getText('CONTACTS'),
            '2. ' + getText('MESSAGES'),
            '3. ' + getText('CALL HISTORY'),
            '4. ' + getText('DIAL NUMBER'),
            '5. ' + getText('SETTINGS'),
            '6. ' + getText('GAMES')
        ];

        let y = 30;
        for (const item of menuItems) {
            bitmap.drawText(item, 10, y, 230, 20, 'left');
            y += 20;
        }

        bitmap.fontSize = 10;
        bitmap.drawText(getText('Press END to exit'), 0, 150, 250, 20, 'center');
    };
    
    Scene_AnokiPhone.prototype.drawDialScreen = function(bitmap) {
        bitmap.fontSize = 14;
        bitmap.fontBold = true;
        bitmap.drawText(getText('DIAL NUMBER'), 0, 5, 250, 20, 'center');
        bitmap.fontBold = false;

        // Display dialed number
        bitmap.fontSize = 18;
        const displayNumber = this._dialedNumber || '_';

        // Add cursor blink effect
        const cursor = (this._cursorBlink < 30) ? '_' : ' ';
        bitmap.drawText(displayNumber + cursor, 0, 40, 250, 24, 'center');

        bitmap.fontSize = 11;
        bitmap.drawText(getText('Enter number and'), 0, 100, 250, 20, 'center');
        bitmap.drawText(getText('press CALL button'), 0, 115, 250, 20, 'center');

        if (this._dialedNumber) {
            bitmap.fontSize = 10;
            bitmap.drawText(getText('Delete and Save'), 0, 145, 250, 20, 'center');
        }
    };
    
    Scene_AnokiPhone.prototype.drawContactsScreen = function(bitmap) {
        bitmap.fontSize = 14;
        bitmap.fontBold = true;
        bitmap.drawText(getText('CONTACTS'), 0, 5, 250, 20, 'center');
        bitmap.fontBold = false;

        const contacts = Object.values($gameSystem.getContacts());

        if (contacts.length === 0) {
            bitmap.fontSize = 12;
            bitmap.drawText(getText('No contacts'), 0, 60, 250, 20, 'center');
        } else {
            bitmap.fontSize = 11;
            let y = 30;
            const maxDisplay = 5;
            const start = Math.max(0, this._selectedContactIndex - 2);
            const end = Math.min(contacts.length, start + maxDisplay);

            for (let i = start; i < end; i++) {
                const contact = contacts[i];
                const prefix = (i === this._selectedContactIndex) ? '> ' : '  ';
                bitmap.drawText(prefix + contact.name, 5, y, 230, 20, 'left');
                bitmap.fontSize = 9;
                bitmap.drawText(contact.number, 15, y + 12, 220, 20, 'left');
                bitmap.fontSize = 11;
                y += 28;
            }

            bitmap.fontSize = 10;
            bitmap.drawText(getText('Call and Delete'), 0, 150, 250, 20, 'center');
        }
    };
    
    Scene_AnokiPhone.prototype.drawCallingScreen = function(bitmap) {
        bitmap.fontSize = 14;
        bitmap.fontBold = true;
        bitmap.drawText(getText('CALLING'), 0, 20, 250, 20, 'center');
        bitmap.fontBold = false;

        bitmap.fontSize = 16;
        const contactName = this._currentCallName || 'Unknown';
        bitmap.drawText(contactName, 0, 50, 250, 20, 'center');

        bitmap.fontSize = 12;
        bitmap.drawText(this._dialedNumber || '', 0, 75, 250, 20, 'center');

        if (this._inCall) {
            const duration = Math.floor(this._callDuration);
            const minutes = Math.floor(duration / 60);
            const seconds = duration % 60;
            const durationStr = minutes.toString().padStart(2, '0') + ':' +
                              seconds.toString().padStart(2, '0');

            bitmap.fontSize = 18;
            bitmap.drawText(durationStr, 0, 100, 250, 24, 'center');

            const cost = Math.floor(this._callDuration * callCostPerSecond);
            bitmap.fontSize = 11;
            bitmap.drawText(getText('Cost') + ': €' + goldToEuros(cost), 0, 130, 250, 20, 'center');
        }

        bitmap.fontSize = 10;
        bitmap.drawText(getText('Press to hang up'), 0, 150, 250, 20, 'center');
    };
    
    Scene_AnokiPhone.prototype.drawAddContactScreen = function(bitmap) {
        bitmap.fontSize = 14;
        bitmap.fontBold = true;
        bitmap.drawText(getText('ADD CONTACT'), 0, 5, 250, 20, 'center');
        bitmap.fontBold = false;

        bitmap.fontSize = 12;
        bitmap.drawText(getText('Enter number'), 10, 35, 220, 20, 'left');

        bitmap.fontSize = 16;
        const cursor = (this._cursorBlink < 30) ? '_' : ' ';
        bitmap.drawText((this._dialedNumber || '') + cursor, 0, 55, 250, 24, 'center');

        bitmap.fontSize = 11;
        bitmap.drawText(getText('Then press MENU'), 0, 100, 250, 20, 'center');
        bitmap.drawText(getText('to save contact'), 0, 115, 250, 20, 'center');

        bitmap.fontSize = 10;
        bitmap.drawText(getText('Delete and Cancel'), 0, 145, 250, 20, 'center');
    };
    
    Scene_AnokiPhone.prototype.drawCallHistoryScreen = function(bitmap) {
        bitmap.fontSize = 14;
        bitmap.fontBold = true;
        bitmap.drawText(getText('CALL HISTORY'), 0, 5, 250, 20, 'center');
        bitmap.fontBold = false;

        const history = $gameSystem.getCallHistory();

        if (history.length === 0) {
            bitmap.fontSize = 12;
            bitmap.drawText(getText('No call history'), 0, 70, 250, 20, 'center');
        } else {
            bitmap.fontSize = 10;
            let y = 30;
            const maxDisplay = 5;

            // NOTE: Add scrolling support later if needed. For now, shows top 5.
            for (let i = 0; i < Math.min(maxDisplay, history.length); i++) {
                const call = history[i];
                bitmap.drawText(call.name, 5, y, 180, 20, 'left');

                const duration = Math.floor(call.duration);
                const minutes = Math.floor(duration / 60);
                const seconds = duration % 60;
                const durationStr = minutes + ':' + seconds.toString().padStart(2, '0');

                bitmap.fontSize = 9;
                bitmap.drawText(call.number + ' (' + durationStr + ')', 5, y + 10, 230, 20, 'left');
                bitmap.fontSize = 10;
                y += 25;
            }
        }

        bitmap.fontSize = 10;
        bitmap.drawText(getText('Press END to return'), 0, 150, 250, 20, 'center');
    };

    // --- NEW Screen Draw Functions ---

    Scene_AnokiPhone.prototype.drawMessagesScreen = function(bitmap) {
        bitmap.fontSize = 14;
        bitmap.fontBold = true;
        bitmap.drawText(getText('MESSAGES'), 0, 5, 250, 20, 'center');
        bitmap.fontBold = false;

        const messages = $gameSystem.getMessages();

        if (messages.length === 0) {
            bitmap.fontSize = 12;
            bitmap.drawText(getText('No messages'), 0, 70, 250, 20, 'center');
        } else {
            bitmap.fontSize = 11;
            let y = 30;
            const maxDisplay = 5;
            const start = Math.max(0, this._selectedMessageIndex - 2);
            const end = Math.min(messages.length, start + maxDisplay);

            for (let i = start; i < end; i++) {
                const message = messages[i];
                const prefix = (i === this._selectedMessageIndex) ? '> ' : '  ';
                let sender = message.sender;
                if (message.type === 'sent') {
                    sender = 'To: ' + sender;
                }
                if (!message.read) {
                    sender = '(N) ' + sender;
                }
                bitmap.drawText(prefix + sender, 5, y, 230, 20, 'left');

                bitmap.fontSize = 9;
                const snippet = message.content.substring(0, 30) + (message.content.length > 30 ? '...' : '');
                bitmap.drawText(snippet, 15, y + 12, 220, 20, 'left');
                bitmap.fontSize = 11;
                y += 28;
            }
        }

        bitmap.fontSize = 10;
        bitmap.drawText(getText('Read and Delete'), 0, 150, 250, 20, 'center');
    };

    Scene_AnokiPhone.prototype.drawMessageViewScreen = function(bitmap) {
        const message = $gameSystem.getMessage(this._selectedMessageIndex);
        if (!message) {
            this._screenMode = 'messages';
            this.refreshScreen();
            return;
        }

        // Mark as read when viewed
        $gameSystem.readMessage(this._selectedMessageIndex);
        
        bitmap.fontSize = 14;
        bitmap.fontBold = true;
        const title = message.type === 'sent' ? 'To: ' : 'From: ';
        bitmap.drawText(title + message.sender, 0, 5, 250, 20, 'center');
        bitmap.fontBold = false;
        
        bitmap.fontSize = 11;
        this.drawWrappedText(bitmap, message.content, 5, 30, 240, 14);
        
        bitmap.fontSize = 10;
        bitmap.drawText(getText('Press END to return'), 0, 150, 250, 20, 'center');
    };

    Scene_AnokiPhone.prototype.drawSettingsScreen = function(bitmap) {
        bitmap.fontSize = 14;
        bitmap.fontBold = true;
        bitmap.drawText(getText('SETTINGS'), 0, 5, 250, 20, 'center');
        bitmap.fontBold = false;

        // Only one setting for now: Ringtone
        const ringtone = $gameSystem.getCurrentRingtone();
        const settingName = 'Ringtone: <' + ringtone.name + '>';

        bitmap.fontSize = 12;
        bitmap.drawText('> ' + settingName, 5, 30, 240, 20, 'left');

        bitmap.fontSize = 10;
        bitmap.drawText(getText('Change setting'), 0, 150, 250, 20, 'center');
    };

    Scene_AnokiPhone.prototype.drawGamesScreen = function(bitmap) {
        bitmap.fontSize = 14;
        bitmap.fontBold = true;
        bitmap.drawText(getText('GAMES'), 0, 5, 250, 20, 'center');
        bitmap.fontBold = false;

        const games = $gameSystem.getPhoneGames();
        console.log('HexphoneSystem: drawGamesScreen called, games count:', games.length, 'games:', games);

        if (games.length === 0) {
            bitmap.fontSize = 12;
            bitmap.drawText(getText('No games'), 0, 70, 250, 20, 'center');
        } else {
            bitmap.fontSize = 11;
            let y = 30;
            const maxDisplay = 6;
            const start = Math.max(0, this._selectedGameIndex - 2);
            const end = Math.min(games.length, start + maxDisplay);

            for (let i = start; i < end; i++) {
                const game = games[i];
                const prefix = (i === this._selectedGameIndex) ? '> ' : '  ';
                bitmap.drawText(prefix + game.name, 5, y, 230, 20, 'left');
                y += 22;
            }
        }

        bitmap.fontSize = 10;
        bitmap.drawText(getText('Play Game'), 0, 150, 250, 20, 'center');
    };

    // --- NEW Helper Function for Text Wrapping ---

    Scene_AnokiPhone.prototype.drawWrappedText = function(bitmap, text, x, y, maxWidth, lineHeight) {
        const words = text.split(' ');
        let line = '';
        let currentY = y;
        
        for (let i = 0; i < words.length; i++) {
            const word = words[i];
            const testLine = line + word + ' ';
            const testWidth = bitmap.measureTextWidth(testLine);
            
            if (testWidth > maxWidth && line.length > 0) {
                bitmap.drawText(line, x, currentY, maxWidth, lineHeight, 'left');
                line = word + ' ';
                currentY += lineHeight;
            } else {
                line = testLine;
            }
        }
        bitmap.drawText(line, x, currentY, maxWidth, lineHeight, 'left');
    };
    
    // --- End of NEW Helper ---

    // ============================================================================
    // MODIFIED: createButtons
    // ============================================================================
    Scene_AnokiPhone.prototype.createButtons = function() {
        const startX = Graphics.width / 2 - 130;
        const buttonWidth = 70;
        const buttonHeight = 45;
        const spacing = 15;
        
        // --- NEW LAYOUT ---
        // Function buttons (below screen)
        const funcY = 280; // Screen ends at 270. This gives 10px padding.
        
        // CALL button (left)
        const callButton = new Sprite_AnokiButton(
            startX, funcY, 
            buttonWidth, buttonHeight - 5, 
            'CALL', '#16a34a'
        );
        callButton.setClickHandler(() => this.onCallButton());
        this._buttons.push(callButton);
        this.addChild(callButton);
        
        // MENU button (center) - Replaces BACK button's slot
        const menuButton = new Sprite_AnokiButton(
            startX + buttonWidth + spacing, 
            funcY, 
            buttonWidth, buttonHeight - 5, 
            'MENU', '#3b82f6'
        );
        menuButton.setClickHandler(() => this.onMenuButton());
        this._buttons.push(menuButton);
        this.addChild(menuButton);
        
        // END button (right)
        const endButton = new Sprite_AnokiButton(
            startX + (buttonWidth + spacing) * 2, funcY, 
            buttonWidth, buttonHeight - 5, 
            'END', '#dc2626'
        );
        endButton.setClickHandler(() => this.onEndButton());
        this._buttons.push(endButton);
        this.addChild(endButton);
        
        // --- Number pad (below function buttons) ---
        const startY = funcY + (buttonHeight - 5) + spacing; // 280 + 40 + 15 = 335
        
        // Number pad layout
        const buttonLayout = [
            [{label: '1\n', value: '1'}, {label: '2\nABC', value: '2'}, {label: '3\nDEF', value: '3'}],
            [{label: '4\nGHI', value: '4'}, {label: '5\nJKL', value: '5'}, {label: '6\nMNO', value: '6'}],
            [{label: '7\nPQRS', value: '7'}, {label: '8\nTUV', value: '8'}, {label: '9\nWXYZ', value: '9'}],
            [{label: '*', value: '*'}, {label: '0\n+', value: '0'}, {label: '#', value: '#'}]
        ];
        
        for (let row = 0; row < buttonLayout.length; row++) {
            for (let col = 0; col < buttonLayout[row].length; col++) {
                const btn = buttonLayout[row][col];
                const x = startX + col * (buttonWidth + spacing);
                const y = startY + row * (buttonHeight + spacing);
                
                const button = new Sprite_AnokiButton(x, y, buttonWidth, buttonHeight, btn.label, '#4a5568');
                button.setClickHandler(() => this.onNumberButton(btn.value));
                this._buttons.push(button);
                this.addChild(button);
            }
        }
    };
    
    Scene_AnokiPhone.prototype.onNumberButton = function(value) {
        this.playButtonSound();
        
        if (this._screenMode === 'dial' || this._screenMode === 'addContact') {
            if (value === '*') {
                // Delete last digit
                this._dialedNumber = this._dialedNumber.slice(0, -1);
            } else if (value === '#') {
                // Cancel or go back (Now handled by END button)
            } else {
                // Add digit (max 15 digits)
                if (this._dialedNumber.length < 15) {
                    this._dialedNumber += value;
                }
            }
            this.refreshScreen();
        } else if (this._screenMode === 'menu') {
            // UPDATED Quick menu navigation
            if (value === '1') {
                this._screenMode = 'contacts';
                this._selectedContactIndex = 0;
            } else if (value === '2') {
                this._screenMode = 'messages';
                this._selectedMessageIndex = 0;
            } else if (value === '3') {
                this._screenMode = 'callHistory';
            } else if (value === '4') {
                this._screenMode = 'dial';
                this._dialedNumber = '';
            } else if (value === '5') {
                this._screenMode = 'settings';
            } else if (value === '6') {
                this._screenMode = 'games';
                this._selectedGameIndex = 0;
            } else if (value === '#') {
                // (Now handled by END button)
            }
            this.refreshScreen();
        } else if (this._screenMode === 'contacts') {
            const contacts = Object.values($gameSystem.getContacts());
            if (contacts.length === 0) return;
            if (value === '2') { // Down
                this._selectedContactIndex = (this._selectedContactIndex + 1) % contacts.length;
            } else if (value === '8') { // Up
                this._selectedContactIndex = (this._selectedContactIndex - 1 + contacts.length) % contacts.length;
            } else if (value === '*') { // Delete contact
                const contact = contacts[this._selectedContactIndex];
                $gameSystem.removeContact(contact.name);
                this._selectedContactIndex = Math.max(0, this._selectedContactIndex - 1);
            } else if (value === '#') {
                // (Now handled by END button)
            }
            this.refreshScreen();
        } else if (this._screenMode === 'calling') {
            if (value === '#') {
                this.endCall();
            }
        } else if (this._screenMode === 'callHistory') {
            if (value === '#') {
                // (Now handled by END button)
            }
            this.refreshScreen();
        } else if (this._screenMode === 'messages') { // NEW
            const messages = $gameSystem.getMessages();
            if (messages.length === 0) {
                if (value === '#') { /* (Now handled by END button) */ }
                this.refreshScreen();
                return;
            }
            if (value === '2') { // Down
                this._selectedMessageIndex = (this._selectedMessageIndex + 1) % messages.length;
            } else if (value === '8') { // Up
                this._selectedMessageIndex = (this._selectedMessageIndex - 1 + messages.length) % messages.length;
            } else if (value === '*') { // Delete message
                $gameSystem.deleteMessage(this._selectedMessageIndex);
                this._selectedMessageIndex = Math.max(0, this._selectedMessageIndex - 1);
            } else if (value === '#') {
                // (Now handled by END button)
            }
            this.refreshScreen();
        } else if (this._screenMode === 'messageView') { // NEW
            if (value === '#') {
                // (Now handled by END button)
            }
            this.refreshScreen();
        } else if (this._screenMode === 'settings') { // NEW
            const ringtones = $gameSystem.getAvailableRingtones();
            let currentIndex = $gameSystem.getSelectedRingtoneIndex();
            if (value === '2') { // Next
                currentIndex++;
            } else if (value === '8') { // Previous
                currentIndex--;
            }
            $gameSystem.setSelectedRingtoneIndex(currentIndex);
            this.playRingtonePreview($gameSystem.getCurrentRingtone()); // Play preview
            
            if (value === '#') {
                // (Now handled by END button)
            }
            this.refreshScreen();
        } else if (this._screenMode === 'games') { // NEW
            const games = $gameSystem.getPhoneGames();
            if (games.length === 0) {
                if (value === '#') { /* (Now handled by END button) */ }
                this.refreshScreen();
                return;
            }
            if (value === '2') { // Down
                this._selectedGameIndex = (this._selectedGameIndex + 1) % games.length;
            } else if (value === '8') { // Up
                this._selectedGameIndex = (this._selectedGameIndex - 1 + games.length) % games.length;
            } else if (value === '#') {
                // (Now handled by END button)
            }
            this.refreshScreen();
        }
    };
    
    Scene_AnokiPhone.prototype.onCallButton = function() {
        this.playButtonSound();
        
        if (this._screenMode === 'dial' && this._dialedNumber) {
            this.initiateCall(this._dialedNumber, 'Unknown');
        } else if (this._screenMode === 'contacts') {
            const contacts = Object.values($gameSystem.getContacts());
            if (contacts.length > 0) {
                const contact = contacts[this._selectedContactIndex];
                this.initiateCall(contact.number, contact.name);
            }
        } else if (this._screenMode === 'home') {
            this._screenMode = 'dial';
            this._dialedNumber = '';
            this.refreshScreen();
        } else if (this._screenMode === 'messages') { // NEW
            this.openMessage();
        } else if (this._screenMode === 'games') { // NEW
            this.launchGame();
        }
    };
    
    Scene_AnokiPhone.prototype.onMenuButton = function() {
        this.playButtonSound();
        
        if (this._screenMode === 'home') {
            this._screenMode = 'menu';
            this.refreshScreen();
        } else if (this._screenMode === 'dial') {
            // Quick save to contacts
            if (this._dialedNumber) {
                this._screenMode = 'addContact';
                this.refreshScreen();
            }
        } else if (this._screenMode === 'addContact' && this._dialedNumber) {
            // Save contact
            const name = 'Contact_' + this._dialedNumber.substring(0, 4);
            $gameSystem.registerContact(name);
            
            // Create contact if not in database
            if (!$gameSystem.getContacts()[name]) {
                $gameSystem._phoneContacts[name] = {
                    name: name,
                    number: this._dialedNumber,
                    commonEventId: 0
                };
            }
            
            this._dialedNumber = '';
            this._screenMode = 'contacts';
            this.refreshScreen();
        } else if (this._screenMode === 'contacts') {
            const contacts = Object.values($gameSystem.getContacts());
            if (contacts.length > 0) {
                const contact = contacts[this._selectedContactIndex];
                this.initiateCall(contact.number, contact.name);
            }
        } else if (this._screenMode === 'messages') { // NEW
            this.openMessage();
        } else if (this._screenMode === 'games') { // NEW
            this.launchGame();
        }
    };
    
    // ============================================================================
    // REMOVED: onBackButton
    // ============================================================================
    // (Function definition removed)

    // ============================================================================
    // MODIFIED: onEndButton (now includes Back functionality)
    // ============================================================================
    Scene_AnokiPhone.prototype.onEndButton = function() {
        this.playButtonSound();
        
        // 1. Handle in-call
        if (this._screenMode === 'calling') {
            this.endCall();
            return; // Don't do 'back' logic
        }
        
        // 2. Handle 'Back' logic (from onBackButton)
        if (this._screenMode === 'menu') {
            this._screenMode = 'home';
            this.refreshScreen();
        } else if (this._screenMode === 'dial' || this._screenMode === 'contacts' || 
                   this._screenMode === 'addContact' || this._screenMode === 'callHistory' ||
                   this._screenMode === 'messages' || this._screenMode === 'settings' ||
                   this._screenMode === 'games') {
            this._screenMode = 'menu';
            this._dialedNumber = '';
            this.refreshScreen();
        } else if (this._screenMode === 'messageView') {
            this._screenMode = 'messages';
            this.refreshScreen();
        } else if (this._screenMode === 'home') {
            // 3. Handle 'Exit' logic (from original onEndButton)
            this.popScene();
        }
    };
    
    // --- NEW Scene Logic Functions ---
    
    Scene_AnokiPhone.prototype.openMessage = function() {
        const messages = $gameSystem.getMessages();
        if (messages.length > 0) {
            this._screenMode = 'messageView';
            this.refreshScreen();
        }
    };

    Scene_AnokiPhone.prototype.launchGame = function() {
        const games = $gameSystem.getPhoneGames();
        if (games.length > 0) {
            const game = games[this._selectedGameIndex];
            if (game) {
                // Check if this is an inline game by trying to create it
                // Inline games will have their createGamePlay hooked by external plugins
                this._screenMode = 'game';
                this._currentGameName = game.name;
                this.createGamePlay(game.name);
                this.refreshScreen();
            }
        }
    };

    // Game play methods for inline game support
    Scene_AnokiPhone.prototype.createGamePlay = function(gameName) {
        // Can be overridden by external game plugins
        // Default does nothing (plugins will hook this)
    };

    Scene_AnokiPhone.prototype.updatePhoneScreen = function() {
        // Can be overridden by external game plugins for game updates
        // Called during scene update
    };

    Scene_AnokiPhone.prototype.drawGameScreen = function(bitmap) {
        // Can be overridden by external game plugins for rendering
        // Plugins will hook this to draw their games
    };

    Scene_AnokiPhone.prototype.handleInput = function() {
        // Can be overridden by external game plugins for input handling
        // Called during scene update for games that need custom input
    };

    // --- Call Logic (Unchanged) ---

    Scene_AnokiPhone.prototype.initiateCall = function(number, name) {
        const credits = $gameSystem.getPhoneCredits();
        
        if (credits < callCostPerSecond) {
            this.playErrorSound();
            return;
        }
        
        this._screenMode = 'calling';
        this._dialedNumber = number;
        this._currentCallName = name;
        this._inCall = false;
        this._callDuration = 0;
        
        // Play ring tone
        this.playRingtone();
        
        // Simulate connection after 2 seconds
        setTimeout(() => {
            if (this._screenMode === 'calling') {
                this._inCall = true;
                this.startCallTimer();
                this.playConnectSound();
            }
        }, 2000);
        
        this.refreshScreen();
    };
    
    Scene_AnokiPhone.prototype.startCallTimer = function() {
        this._callTimer = setInterval(() => {
            if (this._inCall) {
                this._callDuration++;
                
                // Consume credits every second
                if (Math.floor(this._callDuration) % 1 === 0) {
                    if (!$gameSystem.consumeCredits(callCostPerSecond)) {
                        this.endCall();
                        this.playErrorSound();
                        return;
                    }
                }
                
                this.refreshScreen();
            }
        }, 1000);
    };
    
    Scene_AnokiPhone.prototype.endCall = function() {
        if (this._callTimer) {
            clearInterval(this._callTimer);
            this._callTimer = null;
        }
        
        // Add to call history
        if (this._callDuration > 0) {
            $gameSystem.addCallToHistory(
                this._dialedNumber,
                this._currentCallName,
                this._callDuration
            );
        }
        
        this._inCall = false;
        this._screenMode = 'home';
        this._dialedNumber = '';
        this._currentCallName = '';
        this._callDuration = 0;
        
        this.playHangupSound();
        this.refreshScreen();
    };
    
    // --- Scene Update (Unchanged) ---

    Scene_AnokiPhone.prototype.update = function() {
        Scene_MenuBase.prototype.update.call(this);
        this.updateAnimations();
        this.updateButtons();
        this.updatePhoneScreen();
        this.handleInput();

        // Only refresh screen for cursor blink if in a relevant mode
        if (this._screenMode === 'dial' || this._screenMode === 'addContact') {
            const oldBlink = this._cursorBlink;
            this._cursorBlink = (this._cursorBlink + 1) % 60;
            if (Math.floor(oldBlink / 30) !== Math.floor(this._cursorBlink / 30)) {
                this.refreshScreen();
            }
        } else {
            this._cursorBlink = 0;
        }
    };
    
    Scene_AnokiPhone.prototype.updateButtons = function() {
        for (const button of this._buttons) {
            if (button.isPressed && button.isPressed()) {
                button.onButtonDown();
            } else {
                button.onButtonUp();
            }
        }
    };
    
    Scene_AnokiPhone.prototype.updateAnimations = function() {
        this._screenAnimation++;
        
        // Subtle screen effect
        if (this._screenAnimation % 120 === 0) {
            this._contentSprite.opacity = 250;
        } else {
            this._contentSprite.opacity = 255;
        }
    };
    
    // --- Sound Effects (Updated) ---

    Scene_AnokiPhone.prototype.playButtonSound = function() {
        AudioManager.playSe({
            name: 'Cursor1',
            volume: 60,
            pitch: 120,
            pan: 0
        });
    };
    
    Scene_AnokiPhone.prototype.playErrorSound = function() {
        AudioManager.playSe({
            name: 'Buzzer1',
            volume: 70,
            pitch: 100,
            pan: 0
        });
    };
    
    Scene_AnokiPhone.prototype.playRingtone = function() {
        const ringtone = $gameSystem.getCurrentRingtone();
        if (ringtone) {
            AudioManager.playSe({
                name: ringtone.se,
                volume: ringtone.volume,
                pitch: ringtone.pitch,
                pan: 0
            });
        }
    };

    Scene_AnokiPhone.prototype.playRingtonePreview = function(ringtone) {
        // Stop any currently playing SE to avoid overlap
        AudioManager.stopSe();
        if (ringtone) {
            AudioManager.playSe({
                name: ringtone.se,
                volume: ringtone.volume,
                pitch: ringtone.pitch,
                pan: 0
            });
        }
    };
    
    Scene_AnokiPhone.prototype.playConnectSound = function() {
        AudioManager.playSe({
            name: 'Decision2',
            volume: 70,
            pitch: 120,
            pan: 0
        });
    };
    
    Scene_AnokiPhone.prototype.playHangupSound = function() {
        AudioManager.playSe({
            name: 'Cancel2',
            volume: 70,
            pitch: 90,
            pan: 0
        });
    };
    
    Scene_AnokiPhone.prototype.playPowerOnSound = function() {
        AudioManager.playSe({
            name: 'Computer',
            volume: 70,
            pitch: 150,
            pan: 0
        });
    };
    
    Scene_AnokiPhone.prototype.terminate = function() {
        Scene_Base.prototype.terminate.call(this);
        
        // Clean up
        if (this._callTimer) {
            clearInterval(this._callTimer);
        }
        
        // Stop any SEs (like ringtone previews)
        AudioManager.stopSe();

        AudioManager.playSe({
            name: 'Cancel1',
            volume: 70,
            pitch: 80,
            pan: 0
        });
    };

    //=============================================================================
    // Sprite_AnokiButton - Interactive Button Sprite (Unchanged)
    //=============================================================================
    
    function Sprite_AnokiButton() {
        this.initialize(...arguments);
    }
    
    Sprite_AnokiButton.prototype = Object.create(Sprite_Clickable.prototype);
    Sprite_AnokiButton.prototype.constructor = Sprite_AnokiButton;
    
    Sprite_AnokiButton.prototype.initialize = function(x, y, width, height, label, color) {
        Sprite_Clickable.prototype.initialize.call(this);        
        this.move(x, y);
        this._buttonWidth = width;
        this._buttonHeight = height;
        this._label = label;
        this._color = color || '#4a5568';
        this._pressed = false;
        
        this.createButtonBitmap();
    };
    
    Sprite_AnokiButton.prototype.createButtonBitmap = function() {
        this.bitmap = new Bitmap(this._buttonWidth, this._buttonHeight);
        this.redraw();
    };
    
    Sprite_AnokiButton.prototype.redraw = function() {
        const bitmap = this.bitmap;
        const context = bitmap.context;
        
        bitmap.clear();
        
        // Draw button with 3D effect
        const gradient = context.createLinearGradient(0, 0, 0, this._buttonHeight);
        gradient.addColorStop(0, this.lightenColor(this._color, 20));
        gradient.addColorStop(0.5, this._color);
        gradient.addColorStop(1, this.darkenColor(this._color, 20));
        
        context.fillStyle = gradient;
        context.roundRect(0, 0, this._buttonWidth, this._buttonHeight, 5);
        context.fill();
        
        // Draw border
        context.strokeStyle = this.darkenColor(this._color, 40);
        context.lineWidth = 2;
        context.roundRect(0, 0, this._buttonWidth, this._buttonHeight, 5);
        context.stroke();
        
        // Draw label
        bitmap.fontFace = 'Arial, sans-serif';
        bitmap.fontSize = 14;
        bitmap.textColor = '#ffffff';
        bitmap.outlineColor = 'rgba(0, 0, 0, 0.5)';
        bitmap.outlineWidth = 3;
        
        const lines = this._label.split('\n');
        if (lines.length === 1) {
            bitmap.drawText(this._label, 0, this._buttonHeight/2 - 7, this._buttonWidth, 20, 'center');
        } else {
            // Draw main key
            bitmap.fontSize = 16;
            bitmap.drawText(lines[0], 0, 4, this._buttonWidth, 20, 'center');
            // Draw letters
            bitmap.fontSize = 9;
            bitmap.drawText(lines[1], 0, 22, this._buttonWidth, 20, 'center');
        }
    };
    
    Sprite_AnokiButton.prototype.lightenColor = function(color, percent) {
        const num = parseInt(color.replace('#', ''), 16);
        const amt = Math.round(2.55 * percent);
        const R = (num >> 16) + amt;
        const G = (num >> 8 & 0x00FF) + amt;
        const B = (num & 0x0000FF) + amt;
        return '#' + (0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 +
            (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 +
            (B < 255 ? B < 1 ? 0 : B : 255))
            .toString(16).slice(1);
    };
    
    Sprite_AnokiButton.prototype.darkenColor = function(color, percent) {
        const num = parseInt(color.replace('#', ''), 16);
        const amt = Math.round(2.55 * percent);
        const R = (num >> 16) - amt;
        const G = (num >> 8 & 0x00FF) - amt;
        const B = (num & 0x0000FF) - amt;
        return '#' + (0x1000000 + (R > 0 ? R : 0) * 0x10000 +
            (G > 0 ? G : 0) * 0x100 +
            (B > 0 ? B : 0))
            .toString(16).slice(1);
    };
    
    Sprite_AnokiButton.prototype.setClickHandler = function(handler) {
        this._clickHandler = handler;
    };
    
    Sprite_AnokiButton.prototype.onClick = function() {
        if (this._clickHandler) {
            this._clickHandler();
        }
    };
    
    Sprite_AnokiButton.prototype.updateFrame = function() {
        // Button press animation
        if (this._pressed) {
            this.scale.x = 0.95;
            this.scale.y = 0.95;
        } else {
            this.scale.x = 1.0;
            this.scale.y = 1.0;
        }
    };
    
    Sprite_AnokiButton.prototype.onButtonDown = function() {
        this._pressed = true;
        this.updateFrame();
    };
    
    Sprite_AnokiButton.prototype.onButtonUp = function() {
        this._pressed = false;
        this.updateFrame();
    };

    //=============================================================================
    // Window_MenuCommand - Add Phone to Menu (Unchanged)
    //=============================================================================
    
    const Window_MenuCommand_addOriginalCommands = Window_MenuCommand.prototype.addOriginalCommands;
    Window_MenuCommand.prototype.addOriginalCommands = function() {
        Window_MenuCommand_addOriginalCommands.call(this);
        
        // Check if party has any of the required items
        const hasRequiredItem = requiredItemIds.some(itemId => {
            const item = $dataItems[itemId];
            return item && $gameParty.hasItem(item);
        });
        
        // Always show the command; grey out if item not in possession
        this.addCommand(menuText, 'anokiPhone', hasRequiredItem, 187);
    };

    //=============================================================================
    // Scene_Menu - Handle Phone Command (Unchanged)
    //=============================================================================
    
    const _Scene_Menu_createCommandWindow = Scene_Menu.prototype.createCommandWindow;
    Scene_Menu.prototype.createCommandWindow = function() {
        _Scene_Menu_createCommandWindow.call(this);
        this._commandWindow.setHandler('anokiPhone', this.commandAnokiPhone.bind(this));
    };
    
    Scene_Menu.prototype.commandAnokiPhone = function() {
        SceneManager.push(Scene_AnokiPhone);
    };

    //=============================================================================
    // Plugin Commands (Updated)
    //=============================================================================
    
    PluginManager.registerCommand(pluginName, "openPhone", args => {
        SceneManager.push(Scene_AnokiPhone);
    });
    
    PluginManager.registerCommand(pluginName, "addCredits", args => {
        const amount = Number(args.amount) || 10;
        $gameSystem.addPhoneCredits(amount);
        $gameMessage.add(`Added €${amount} to phone credits`);
    });
    
    PluginManager.registerCommand(pluginName, "registerContact", args => {
        const contactName = args.contactName;
        if ($gameSystem.registerContact(contactName)) {
            $gameMessage.add(`${contactName} added to contacts`);
        } else {
            $gameMessage.add(`Contact ${contactName} not found in database`);
        }
    });
    
    PluginManager.registerCommand(pluginName, "removeContact", args => {
        const contactName = args.contactName;
        if ($gameSystem.removeContact(contactName)) {
            $gameMessage.add(`${contactName} removed from contacts`);
        } else {
            $gameMessage.add(`Contact ${contactName} not found`);
        }
    });

    // --- NEW Plugin Commands ---

    PluginManager.registerCommand(pluginName, "receiveMessage", args => {
        const sender = args.sender;
        const content = args.content;
        $gameSystem.addMessage(sender, content, 'received');
        $gameMessage.add(`New message from ${sender}!`);
        // Maybe play a sound effect
        AudioManager.playSe({ name: "Message", volume: 90, pitch: 100, pan: 0 });
    });

    PluginManager.registerCommand(pluginName, "sendMessage", args => {
        const recipient = args.recipient;
        const content = args.content;
        if ($gameSystem.consumeCredits(messageCost)) {
            $gameSystem.addMessage(recipient, content, 'sent');
            $gameMessage.add(`Message sent to ${recipient}.`);
        } else {
            $gameMessage.add(`Not enough credits to send message.`);
            $gameSystem.addPhoneCredits(messageCost); // Refund
        }
    });

    //=============================================================================
    // Canvas Extensions for Rounded Rectangles (Unchanged)
    //=============================================================================
    
    if (!CanvasRenderingContext2D.prototype.roundRect) {
        CanvasRenderingContext2D.prototype.roundRect = function(x, y, width, height, radius) {
            if (width < 2 * radius) radius = width / 2;
            if (height < 2 * radius) radius = height / 2;
            this.beginPath();
            this.moveTo(x + radius, y);
            this.arcTo(x + width, y, x + width, y + height, radius);
            this.arcTo(x + width, y + height, x, y + height, radius);
            this.arcTo(x, y + height, x, y, radius);
            this.arcTo(x, y, x + width, y, radius);
            this.closePath();
        };
    }

    // Global function for external game plugins to register with Hexphone
    window.registerHexphoneGame = function(gameName, gameData) {
        console.log('window.registerHexphoneGame called for:', gameName, 'gameSystem:', $gameSystem ? 'exists' : 'null');
        if ($gameSystem) {
            $gameSystem.registerHexphoneGame(gameName, gameData);
            console.log('Game registered successfully via $gameSystem');
        } else {
            console.log('$gameSystem is null, deferring registration to next available opportunity');
            // Queue the registration to happen when $gameSystem is available
            if (!window._pendingGameRegistrations) {
                window._pendingGameRegistrations = [];
            }
            window._pendingGameRegistrations.push({
                name: gameName,
                data: gameData
            });
            console.log('Queued registrations:', window._pendingGameRegistrations.length);
        }
    };

})();
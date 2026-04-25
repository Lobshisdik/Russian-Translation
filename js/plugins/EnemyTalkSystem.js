//=============================================================================
// EnemyTalkSystem.js
//=============================================================================

/*:
 * @target MZ
 * @plugindesc Adds a talk system to interact with enemies during battle via plugin commands.
 * @author Omni-Lex
 * @url https://yourwebsite.com
 *
 * @help EnemyTalkSystem.js
 *
 * This plugin adds plugin commands to interact with enemies during battle
 * through various dialog options.
 *
 * Features:
 * - Disposition system (1-100) for each enemy
 * - Chat option to build rapport
 * - Surrender option to make enemies flee
 * - Insult option to debuff enemies
 * - Join Party option 
 * - Throw Stone option (works on all enemies)
 * - Pet option (works on all enemies)
 * - Archetype-based messages and disposition modifiers
 * - Italian language support
 * - Success percentage display for each option
 *
 * Enemy Notes Setup:
 * - <Talk> - Required! Enemy must have this tag to understand you
 * - <Archetype: Goblin> - Optional archetype for custom messages
 *
 * Supported Archetypes:
 * Goblin, Humanoid, TwoHeadedHumanoid, Fairy, Robot, Demon, Elven,
 * Gnome, Ghost, ArmoredKnight, Dragon
 *
 * Plugin Commands:
 * - Open Talk Menu: Opens the dialog choices window
 *
 * @command openTalkMenu
 * @text Open Talk Menu
 * @desc Opens the enemy talk dialog choices in battle.
 */

(() => {
    const pluginName = "EnemyTalkSystem";
    
    // Get message data from global scope
    const { archetypeMessagesEN, archetypeMessagesIT, defaultMessagesEN, defaultMessagesIT} = window.TalkSystemData;

    // System messages (stored as data)
    const systemMessagesEN = {
        noUnderstand: "The enemy doesn't understand you.",
        cantTalkNow: "The enemy can't talk right now.",
        silenced: "Enemy is silenced!\n He can't talk now.",
        enraged: "Enemy is enraged!\n He doesn't want to talk to you.",
        confused: "Enemy is confused!\n He doesn't know what to say.",
        sleeping: "Enemy is sleeping!",
        frozen: "Enemy is frozen!",
        friendlier: "The enemy seems more friendly.",
        surrender: "The enemy agrees to retreat!",
        refuseSurrender: "The enemy refuses to surrender!",
        enragedAfterInsult: "The enemy is enraged!",
        notFriendlyEnough: "The enemy isn't friendly enough to join you.",
        toBeImplemented: "(Join party feature - to be implemented)",
        partyFull: "Your party is full!",
        joined: "joined the party!",
        stoneThrown: "You threw a stone at the enemy!",
        petSuccess: "The enemy seems to enjoy being petted!",
        petFail: "The enemy doesn't want to be petted.",
        petRefuse: "This creature doesn't respond to petting."
    };

    const systemMessagesIT = {
        noUnderstand: "Il nemico non ti capisce.",
        cantTalkNow: "Il nemico non può parlare ora.",
        silenced: "Il nemico è silenziato!\n Non può parlare ora.",
        enraged: "Il nemico è infuriato!\n Non vuole parlarti.",
        confused: "Il nemico è confuso!\nNon sa cosa dire.",
        sleeping: "Il nemico sta dormendo!",
        frozen: "Il nemico è congelato!",
        friendlier: "Il nemico sembra più amichevole.",
        surrender: "Il nemico accetta di ritirarsi!",
        refuseSurrender: "Il nemico rifiuta di arrendersi!",
        enragedAfterInsult: "Il nemico è infuriato!",
        notFriendlyEnough: "Il nemico non è abbastanza amichevole per unirsi.",
        toBeImplemented: "(Funzione unisciti al gruppo - da implementare)",
        partyFull: "Il gruppo è pieno!",
        joined: "si è unito al gruppo!",
        stoneThrown: "Hai lanciato un sasso al nemico!",
        petSuccess: "Al nemico sembra piacere essere accarezzato!",
        petFail: "Il nemico non vuole essere accarezzato.",
        petRefuse: "Questa creatura non risponde alle carezze."
    };

    // Window choices (stored as data)
    const choicesEN = ["Chat", "Join Party", "Ask to Surrender", "Insult", "Throw Stone", "Pet", "Cancel"];
    const choicesIT = ["Chiacchiera", "Unisciti", "Chiedi Resa", "Insulta", "Lancia Sasso", "Accarezza", "Annulla"];
    
    // Disposition modifiers by archetype
    const archetypeDispositionModifiers = {
        Goblin: -10,
        Humanoid: 0,
        TwoHeadedHumanoid: 5,
        Fairy: 15,
        Robot: -5,
        Demon: -20,
        Elven: 10,
        Gnome: 10,
        Ghost: -15,
        ArmoredKnight: 5,
        Dragon: -25
    };

    // Random names by archetype
    const archetypeNames = {
        Goblin: ["Gribble", "Snark", "Razzle", "Grot", "Nibbles", "Snaggletooth", "Runt", "Skitter", "Boggle", "Grub"],
        Humanoid: ["Marcus", "Elena", "Roderick", "Aria", "Gareth", "Lyssa", "Brom", "Selene", "Darius", "Mira"],
        TwoHeadedHumanoid: ["Grug & Brug", "Hank & Tank", "Zip & Zap", "Yin & Yang", "Biff & Buff", "Lark & Dark"],
        Fairy: ["Sparkle", "Dewdrop", "Moonbeam", "Shimmer", "Petal", "Glimmer", "Whisper", "Twinkle", "Blossom", "Flutter"],
        Robot: ["Unit-X7", "Servo-9", "Mech-Alpha", "Core-Beta", "Bot-Prime", "Auto-Sigma", "Droid-Zeta", "Synth-Omega"],
        Demon: ["Baalgor", "Infernus", "Malphas", "Azgoroth", "Vexia", "Zargath", "Morrigan", "Beleth", "Asmodeus", "Lilith"],
        Elven: ["Aelindor", "Silvariel", "Faelyn", "Thandor", "Liraelle", "Caladorn", "Elarion", "Sylvaris", "Galadhwen"],
        Gnome: ["Fizzlebang", "Tinkertop", "Gearshift", "Sparkplug", "Cogsworth", "Boltworth", "Springlock", "Whizbang"],
        Ghost: ["Whisper", "Phantom", "Shade", "Specter", "Wraith", "Echo", "Hollow", "Mist", "Veil", "Haunt"],
        ArmoredKnight: ["Sir Roland", "Dame Cassandra", "Sir Aldric", "Lady Evaine", "Sir Godfrey", "Dame Brigitte", "Sir Percival"],
        Dragon: ["Ignathor", "Frostfang", "Emberwing", "Stormclaw", "Cinderheart", "Nightscale", "Sunfire", "Shadowmaw"]
    };

    // Archetype to class mappings (class IDs)
    const archetypeClasses = {
        Goblin: [2, 1, 10,13,14,16,30,35],
        Humanoid: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60],
        TwoHeadedHumanoid: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60],
        Fairy: [2, 3,19,20,25,27,28,34,35],
        Robot: [66],
        Demon: [5,19,23,31,32,34,37,38],
        Elven: [24,34,27,20],
        Gnome: [1, 21],
        Ghost: [63],
        ArmoredKnight: [4,22,33,34,37],
        Dragon: [63]
    };

    //-----------------------------------------------------------------------------
    // Helper Functions
    //-----------------------------------------------------------------------------

    function isItalian() {
        return ConfigManager.language === 'it';
    }

    function getSystemMessages() {
        return isItalian() ? systemMessagesIT : systemMessagesEN;
    }

    function getArchetypeMessages() {
        return isItalian() ? archetypeMessagesIT : archetypeMessagesEN;
    }

    function getDefaultMessages() {
        return isItalian() ? defaultMessagesIT : defaultMessagesEN;
    }

    function getChoices() {
        return isItalian() ? choicesIT : choicesEN;
    }

    //-----------------------------------------------------------------------------
    // Plugin Commands
    //-----------------------------------------------------------------------------

    PluginManager.registerCommand(pluginName, "openTalkMenu", function(args) {
        if ($gameParty.inBattle()) {
            // Save a reference to the interpreter that is running this command
            SceneManager._scene._talkInterpreter = this; 
            SceneManager._scene.openTalkMenu();
            this.setWaitMode('talk'); 
        }
    });

    //-----------------------------------------------------------------------------
    // Game_Enemy
    //-----------------------------------------------------------------------------

    Game_Enemy.prototype.getArchetype = function() {
        const note = this.enemy().note;
        const match = note.match(/<Archetype:\s*(\w+)>/i);
        return match ? match[1] : null;
    };

    Game_Enemy.prototype.canTalk = function() {
        const note = this.enemy().note;
        if (!note.includes('<Talk>')) return false;
        
        // Check if enemy has any states that prevent talking
        const preventTalkStates = [6, 7, 8, 10, 11];
        for (const stateId of preventTalkStates) {
            if (this.isStateAffected(stateId)) {
                return false;
            }
        }
        
        return true;
    };

    // NEW: Get specific message for state preventing talk
    Game_Enemy.prototype.getCantTalkMessage = function() {
        const systemMessages = getSystemMessages();
        
        // Check states in priority order and return appropriate message
        if (this.isStateAffected(6)) return systemMessages.silenced;
        if (this.isStateAffected(7)) return systemMessages.enraged;
        if (this.isStateAffected(8)) return systemMessages.confused;
        if (this.isStateAffected(10)) return systemMessages.sleeping;
        if (this.isStateAffected(11)) return systemMessages.frozen;
        
        // Default message if no specific state found
        return systemMessages.cantTalkNow;
    };

    const _Game_Enemy_setup = Game_Enemy.prototype.setup;
    Game_Enemy.prototype.setup = function(enemyId, x, y) {
        _Game_Enemy_setup.call(this, enemyId, x, y);
        
        // More varied initial disposition calculation
        // 40% chance for low disposition (10-40)
        // 40% chance for medium disposition (41-70)
        // 20% chance for high disposition (71-100)
        const roll = Math.random();
        if (roll < 0.4) {
            this._disposition = Math.floor(Math.random() * 31) + 10; // 10-40
        } else if (roll < 0.8) {
            this._disposition = Math.floor(Math.random() * 30) + 41; // 41-70
        } else {
            this._disposition = Math.floor(Math.random() * 30) + 71; // 71-100
        }
        
        const archetype = this.getArchetype();
        if (archetype && archetypeDispositionModifiers[archetype] !== undefined) {
            this._disposition += archetypeDispositionModifiers[archetype];
            this._disposition = this._disposition.clamp(1, 100);
        }
    };

    Game_Enemy.prototype.disposition = function() {
        return this._disposition || 50;
    };

    Game_Enemy.prototype.changeDisposition = function(amount) {
        this._disposition = (this._disposition || 50) + amount;
        this._disposition = this._disposition.clamp(1, 100);
    };

    // Decrease disposition when taking damage
    const _Game_Enemy_performDamage = Game_Enemy.prototype.performDamage;
    Game_Enemy.prototype.performDamage = function() {
        _Game_Enemy_performDamage.call(this);
        // Reduce disposition by 5-15 points when hit, scaled by damage severity
        const hpPercent = this.hp / this.mhp;
        const dispositionLoss = Math.floor(5 + (1 - hpPercent) * 10);
        this.changeDisposition(-dispositionLoss);
    };

    //-----------------------------------------------------------------------------
    // Scene_Battle
    //-----------------------------------------------------------------------------

    Scene_Battle.prototype.openTalkMenu = function() {
        if (!this._talkChoiceWindow) {
            this.createTalkChoiceWindow();
        }
        
        // Create disposition window
        if (!this._dispositionWindow) {
            this.createDispositionWindow();
        }
        
        // Deactivate and hide command windows to prevent input
        this._actorCommandWindow.deactivate();
        this._actorCommandWindow.hide();
        this._partyCommandWindow.deactivate();
        this._partyCommandWindow.hide();
        
        // Open and activate talk window
        this._talkChoiceWindow.refresh();
        this._talkChoiceWindow.open();
        this._talkChoiceWindow.activate();
        this._talkChoiceWindow.select(0);
        
        // Open disposition window
        this._dispositionWindow.refresh();
        this._dispositionWindow.open();
    };
    
    Scene_Battle.prototype.createDispositionWindow = function() {
        const rect = this.dispositionWindowRect();
        this._dispositionWindow = new Window_Disposition(rect);
        this.addWindow(this._dispositionWindow);
    };
    
    Scene_Battle.prototype.dispositionWindowRect = function() {
        const ww = 260;
        const wh = this.calcWindowHeight(1, true);
        const wx = Graphics.boxWidth - ww - 80;
        const wy = 60;
        return new Rectangle(wx, wy, ww, wh);
    };

    Scene_Battle.prototype.createTalkChoiceWindow = function() {
        const rect = this.talkChoiceWindowRect();
        this._talkChoiceWindow = new Window_TalkChoice(rect);
        this._talkChoiceWindow.setHandler('chat', this.onTalkChat.bind(this));
        this._talkChoiceWindow.setHandler('surrender', this.onTalkSurrender.bind(this));
        this._talkChoiceWindow.setHandler('insult', this.onTalkInsult.bind(this));
        this._talkChoiceWindow.setHandler('joinParty', this.onTalkJoinParty.bind(this));
        this._talkChoiceWindow.setHandler('throwStone', this.onThrowStone.bind(this));
        this._talkChoiceWindow.setHandler('pet', this.onPet.bind(this));
        this._talkChoiceWindow.setHandler('cancel', this.onTalkCancel.bind(this));
        this.addWindow(this._talkChoiceWindow);
    };

    Scene_Battle.prototype.talkChoiceWindowRect = function() {
        const ww = 400;
        const wh = this.calcWindowHeight(7, true);
        const wx = (Graphics.boxWidth - ww) / 2;
        const wy = (Graphics.boxHeight - wh) / 2;
        return new Rectangle(wx, wy, ww, wh);
    };

    Scene_Battle.prototype.calculateTalkSuccessChance = function() {
        const actor = $gameParty.battleMembers()[0];
        const enemy = $gameTroop.aliveMembers()[0];
        
        if (!actor || !enemy) return 0;

        const actorLuck = actor.luk;
        const enemyLuck = enemy.luk;
        const disposition = enemy.disposition();

        // Scale luck difference to reduce impact (divide by 5 instead of 2)
        const luckModifier = (actorLuck - enemyLuck) / 5;
        const baseChance = disposition + luckModifier;
        const successChance = Math.max(10, Math.min(95, baseChance));

        return Math.floor(successChance);
    };

    Scene_Battle.prototype.calculateTalkSuccess = function() {
        const successChance = this.calculateTalkSuccessChance();
        return Math.random() * 100 < successChance;
    };

    Scene_Battle.prototype.calculateJoinSuccessChance = function() {
        const enemy = $gameTroop.aliveMembers()[0];
        if (!enemy) return 0;
        
        // Small percentage to recruit even under the disposition threshold
        const disposition = enemy.disposition();
        if (disposition < 80) {
            // 5% base chance if disposition is below 80
            return Math.max(5, Math.floor(disposition / 16));
        }
        return this.calculateTalkSuccessChance();
    };

    Scene_Battle.prototype.calculatePetSuccessChance = function() {
        const enemy = $gameTroop.aliveMembers()[0];
        if (!enemy) return 0;
        
        const hasTalkTag = enemy.enemy().note.includes('<Talk>');
        
        if (hasTalkTag) {
            // For talking enemies, need high disposition
            const disposition = enemy.disposition();
            if (disposition < 70) return 0;
            return this.calculateTalkSuccessChance();
        } else {
            // For non-talking enemies (animals), standard success calculation
            return this.calculateTalkSuccessChance();
        }
    };

    Scene_Battle.prototype.onTalkChat = function() {
        const enemy = $gameTroop.aliveMembers()[0];
        const systemMessages = getSystemMessages();
    
        if (!enemy) {
            this.closeTalkMenu();
            return;
        }
    
        if (!enemy.canTalk()) {
            window.skipLocalization = true;
            // Check if enemy has <Talk> tag but is affected by state
            const note = enemy.enemy().note;
            if (note.includes('<Talk>')) {
                $gameMessage.add(enemy.getCantTalkMessage());
            } else {
                $gameMessage.add(systemMessages.noUnderstand);
            }
            window.skipLocalization = false;
            this.closeTalkMenu();
            return;
        }
    
        const success = this.calculateTalkSuccess();
        const archetype = enemy.getArchetype();
        const archetypeMessages = getArchetypeMessages();
        const defaultMessages = getDefaultMessages();
        let messages;
    
        if (success) {
            if (archetype && archetypeMessages[archetype]) {
                messages = archetypeMessages[archetype].success;
            } else {
                messages = defaultMessages.success;
            }
            
            const message = messages[Math.floor(Math.random() * messages.length)];
            window.skipLocalization = true;
            $gameMessage.add(message);
            window.skipLocalization = false;
            enemy.changeDisposition(20);
            window.skipLocalization = true;
            $gameMessage.add(systemMessages.friendlier);
            window.skipLocalization = false;
            
            // Apply state 9 or 24 with small chance if disposition is high
            if (enemy.disposition() >= 70 && Math.random() < 0.15) {
                const stateId = Math.random() < 0.5 ? 9 : 24;
                enemy.addState(stateId);
            }
        } else {
            if (archetype && archetypeMessages[archetype]) {
                messages = archetypeMessages[archetype].fail;
            } else {
                messages = defaultMessages.fail;
            }
            
            const message = messages[Math.floor(Math.random() * messages.length)];
            window.skipLocalization = true;
            $gameMessage.add(message);
            window.skipLocalization = false;
        }
    
        this.closeTalkMenu();
    };
    
    Scene_Battle.prototype.onTalkSurrender = function() {
        const enemy = $gameTroop.aliveMembers()[0];
        const systemMessages = getSystemMessages();
    
        if (!enemy) {
            this.closeTalkMenu();
            return;
        }
    
        if (!enemy.canTalk()) {
            window.skipLocalization = true;
            // Check if enemy has <Talk> tag but is affected by state
            const note = enemy.enemy().note;
            if (note.includes('<Talk>')) {
                $gameMessage.add(enemy.getCantTalkMessage());
            } else {
                $gameMessage.add(systemMessages.noUnderstand);
            }
            window.skipLocalization = false;
            this.closeTalkMenu();
            return;
        }
    
        const success = this.calculateTalkSuccess();
    
        if (success) {
            window.skipLocalization = true;
            $gameMessage.add(systemMessages.surrender);
            window.skipLocalization = false;
            this.closeTalkMenu();
            BattleManager.processEscape();
        } else {
            window.skipLocalization = true;
            $gameMessage.add(systemMessages.refuseSurrender);
            window.skipLocalization = false;
            this.closeTalkMenu();
        }
    };
    
    Scene_Battle.prototype.onTalkInsult = function() {
        const enemy = $gameTroop.aliveMembers()[0];
        const systemMessages = getSystemMessages();
    
        if (!enemy) {
            this.closeTalkMenu();
            return;
        }
    
        if (!enemy.canTalk()) {
            window.skipLocalization = true;
            // Check if enemy has <Talk> tag but is affected by state
            const note = enemy.enemy().note;
            if (note.includes('<Talk>')) {
                $gameMessage.add(enemy.getCantTalkMessage());
            } else {
                $gameMessage.add(systemMessages.noUnderstand);
            }
            window.skipLocalization = false;
            this.closeTalkMenu();
            return;
        }
    
        const archetype = enemy.getArchetype();
        const archetypeMessages = getArchetypeMessages();
        const defaultMessages = getDefaultMessages();
        let messages;
    
        if (archetype && archetypeMessages[archetype]) {
            messages = archetypeMessages[archetype].insult;
        } else {
            messages = defaultMessages.insult;
        }
    
        const message = messages[Math.floor(Math.random() * messages.length)];
        window.skipLocalization = true;
        $gameMessage.add(message);
        window.skipLocalization = false;
        
        enemy.changeDisposition(-30);
    
        if (enemy.disposition() < 10) {
            const stateId = Math.random() < 0.5 ? 7 : 20;
            enemy.addState(stateId);
            window.skipLocalization = true;
            $gameMessage.add(systemMessages.enragedAfterInsult);
            window.skipLocalization = false;
        }
    
        this.closeTalkMenu();
    };

    Scene_Battle.prototype.onThrowStone = function() {
        const enemy = $gameTroop.aliveMembers()[0];
        const systemMessages = getSystemMessages();
    
        if (!enemy) {
            this.closeTalkMenu();
            return;
        }
    
        window.skipLocalization = true;
        $gameMessage.add(systemMessages.stoneThrown);
        window.skipLocalization = false;
        
        enemy.changeDisposition(-30);
    
        if (enemy.disposition() < 10) {
            const stateId = Math.random() < 0.5 ? 7 : 20;
            enemy.addState(stateId);
            window.skipLocalization = true;
            $gameMessage.add(systemMessages.enragedAfterInsult);
            window.skipLocalization = false;
        }
    
        this.closeTalkMenu();
    };

    Scene_Battle.prototype.onPet = function() {
        const enemy = $gameTroop.aliveMembers()[0];
        const systemMessages = getSystemMessages();
    
        if (!enemy) {
            this.closeTalkMenu();
            return;
        }
    
        const hasTalkTag = enemy.enemy().note.includes('<Talk>');
        
        if (hasTalkTag && enemy.disposition() < 70) {
            window.skipLocalization = true;
            $gameMessage.add(systemMessages.petRefuse);
            window.skipLocalization = false;
            this.closeTalkMenu();
            return;
        }
    
        const success = this.calculateTalkSuccess();
    
        if (success) {
            window.skipLocalization = true;
            $gameMessage.add(systemMessages.petSuccess);
            window.skipLocalization = false;
            enemy.changeDisposition(15);
            window.skipLocalization = true;
            $gameMessage.add(systemMessages.friendlier);
            window.skipLocalization = false;
        } else {
            window.skipLocalization = true;
            $gameMessage.add(systemMessages.petFail);
            window.skipLocalization = false;
        }
    
        this.closeTalkMenu();
    };

    Scene_Battle.prototype.setActorSpriteByArchetype = function(actor, archetype) {
        let characterName, characterIndex;
        
        switch(archetype) {
            case 'Goblin':
                // Random between Dungeon_Monster1 (1-5) or Dungeon_Monster2 (0) or Evil01Color (5)
                const goblinChoice = Math.floor(Math.random() * 7);
                if (goblinChoice < 5) {
                    characterName = 'Dungeon_Monsters1';
                    characterIndex = goblinChoice;
                } else if (goblinChoice === 5) {
                    characterName = 'Dungeon_Monsters2';
                    characterIndex = 0;
                } else {
                    characterName = 'Evil01Color';
                    characterIndex = 5;
                }
                break;
                
            case 'ArmoredKnight':
                characterName = 'Evil01Color';
                characterIndex = 0;
                break;
                
            case 'Ghost':
                characterName = 'Evil01Color';
                characterIndex = 2;
                break;
                
            case 'Dragon':
                characterName = 'Vehicle';
                characterIndex = 2;
                break;
                
            case 'Humanoid':
                // Random sprite from various human sprite sheets
                const humanSheets = [
                    'NPCs01Color', 'NPCs02Color', 'NPCs03Color',
                    'Actor1', 'Actor2', 'Actor3',
                    'Actor1RMVX', 'Actor2RMVX', 'Actor3RMVX',
                    'Heroes01Color', 'Heroes02Color'
                ];
                characterName = humanSheets[Math.floor(Math.random() * humanSheets.length)];
                characterIndex = Math.floor(Math.random() * 8);
                break;
                
            default:
                // All other archetypes use Evil01Color 4th sprite (index 3)
                characterName = 'Evil01Color';
                characterIndex = 3;
                break;
        }
        
        actor.setCharacterImage(characterName, characterIndex);
    };

    Scene_Battle.prototype.onTalkJoinParty = function() {
        const enemy = $gameTroop.aliveMembers()[0];
        const systemMessages = getSystemMessages();
    
        if (!enemy) {
            this.closeTalkMenu();
            return;
        }
    
        const partySize = $gameParty.size();
        if (partySize >= 3) {
            window.skipLocalization = true;
            $gameMessage.add(systemMessages.partyFull);
            window.skipLocalization = false;
            this.closeTalkMenu();
            return;
        }
    
        const success = this.calculateTalkSuccess();
        const archetype = enemy.getArchetype();
        const archetypeMessages = getArchetypeMessages();
        const defaultMessages = getDefaultMessages();
        let messages;
        
        // Small chance to succeed even with low disposition
        const disposition = enemy.disposition();
        const canJoin = (disposition >= 80 && success) || (disposition < 80 && Math.random() * 100 < 5);
    
        if (canJoin) {
            if (archetype && archetypeMessages[archetype]) {
                messages = archetypeMessages[archetype].joinSuccess;
            } else {
                messages = defaultMessages.joinSuccess;
            }
            
            const message = messages[Math.floor(Math.random() * messages.length)];
            window.skipLocalization = true;
            $gameMessage.add(message);
            window.skipLocalization = false;
            
            const actorIdToAdd = partySize === 1 ? 2 : 3;
            const newActor = $gameActors.actor(actorIdToAdd);
            
            // Set name
            if (archetype && archetypeNames[archetype]) {
                const names = archetypeNames[archetype];
                const randomName = names[Math.floor(Math.random() * names.length)];
                newActor.setName(randomName);
            }
            
            // Set class
            if (archetype && archetypeClasses[archetype]) {
                const classes = archetypeClasses[archetype];
                const randomClassId = classes[Math.floor(Math.random() * classes.length)];
                newActor.changeClass(randomClassId, false);
            }
            
            // Set sprite based on archetype
            this.setActorSpriteByArchetype(newActor, archetype);
            
            // Set level to median of current party
            const levels = $gameParty.members().map(m => m.level);
            levels.sort((a, b) => a - b);
            const medianLevel = levels.length % 2 === 0 
                ? Math.floor((levels[levels.length / 2 - 1] + levels[levels.length / 2]) / 2)
                : levels[Math.floor(levels.length / 2)];
            newActor.changeLevel(medianLevel, false);
            
            // Copy skills from enemy
            this.copyEnemySkillsToActor(enemy, newActor);
            
            // Add to party
            $gameParty.addActor(actorIdToAdd);
            
            // Play Victory2 ME
            AudioManager.playMe({name: "Victory2", volume: 90, pitch: 100, pan: 0});
            
            window.skipLocalization = true;
            $gameMessage.add(newActor.name() + " " + systemMessages.joined);
            window.skipLocalization = false;
            
            enemy.die();
            
        } else {
            if (archetype && archetypeMessages[archetype]) {
                messages = archetypeMessages[archetype].joinFail;
            } else {
                messages = defaultMessages.joinFail;
            }
            
            const message = messages[Math.floor(Math.random() * messages.length)];
            window.skipLocalization = true;
            $gameMessage.add(message);
            window.skipLocalization = false;
        }
    
        this.closeTalkMenu();
    };
    
    Scene_Battle.prototype.onTalkCancel = function() {
        this.closeTalkMenu();
    };
    
    Scene_Battle.prototype.closeTalkMenu = function() {
        // Close and deactivate talk window first
        this._talkChoiceWindow.close();
        this._talkChoiceWindow.deactivate();
        
        // Close disposition window
        if (this._dispositionWindow) {
            this._dispositionWindow.close();
        }
        
        // Clear the interpreter wait mode
        if (this._talkInterpreter && this._talkInterpreter._waitMode === 'talk') {
            this._talkInterpreter.setWaitMode('');
            this._talkInterpreter = null;
        }
        
        // Re-show and reactivate actor command window
        this._actorCommandWindow.show();
        this._actorCommandWindow.activate();
    };
    
   

    Scene_Battle.prototype.copyEnemySkillsToActor = function(enemy, actor) {
        const enemyActions = enemy.enemy().actions;
        
        const currentSkills = actor.skills().slice();
        for (const skill of currentSkills) {
            if (skill.id !== actor.attackSkillId() && skill.id !== actor.guardSkillId()) {
                actor.forgetSkill(skill.id);
            }
        }
        
        const addedSkills = new Set();
        for (const action of enemyActions) {
            if (action.skillId > 0 && !addedSkills.has(action.skillId)) {
                actor.learnSkill(action.skillId);
                addedSkills.add(action.skillId);
            }
        }
    };
    
    // Override to prevent other windows from being active when talk window is open
    const _Scene_Battle_isAnyInputWindowActive = Scene_Battle.prototype.isAnyInputWindowActive;
    Scene_Battle.prototype.isAnyInputWindowActive = function() {
        if (this._talkChoiceWindow && this._talkChoiceWindow.active) {
            return true;
        }
        return _Scene_Battle_isAnyInputWindowActive.call(this);
    };

    // Override update to prevent input processing on hidden windows
    const _Scene_Battle_update = Scene_Battle.prototype.update;
    Scene_Battle.prototype.update = function() {
        // If talk window is active, prevent other windows from processing
        if (this._talkChoiceWindow && this._talkChoiceWindow.active) {
            Scene_Base.prototype.update.call(this);
            this.updateTalkWindowOnly();
            return;
        }
        _Scene_Battle_update.call(this);
    };

    Scene_Battle.prototype.updateTalkWindowOnly = function() {
        // Only update the talk window and essential battle elements
        if (this._talkChoiceWindow) {
            this._talkChoiceWindow.update();
        }
        if (this._logWindow) {
            this._logWindow.update();
        }
        if (this._spriteset) {
            this._spriteset.update();
        }
        if (this._statusWindow) {
            this._statusWindow.update();
        }
    };

     //-----------------------------------------------------------------------------
    // Window_Disposition
    //-----------------------------------------------------------------------------
    
    function Window_Disposition() {
        this.initialize(...arguments);
    }
    
    Window_Disposition.prototype = Object.create(Window_Base.prototype);
    Window_Disposition.prototype.constructor = Window_Disposition;
    
    Window_Disposition.prototype.initialize = function(rect) {
        Window_Base.prototype.initialize.call(this, rect);
        this.openness = 0;
        this.refresh();
    };
    
    Window_Disposition.prototype.refresh = function() {
        this.contents.clear();
        const enemy = $gameTroop.aliveMembers()[0];
        if (enemy) {
            const disposition = enemy.disposition();
            const text = isItalian() ? `Opinione:\n ${disposition}` : `Opinion:\n ${disposition}`;
            this.drawText(text, 0, 0, this.contents.width, 'center');
        }
    };

    //-----------------------------------------------------------------------------
    // Window_TalkChoice
    //-----------------------------------------------------------------------------

    function Window_TalkChoice() {
        this.initialize(...arguments);
    }

    Window_TalkChoice.prototype = Object.create(Window_Command.prototype);
    Window_TalkChoice.prototype.constructor = Window_TalkChoice;

    Window_TalkChoice.prototype.initialize = function(rect) {
        Window_Command.prototype.initialize.call(this, rect);
        this.openness = 0;
        this._lastProcessedFrame = 0;
    };

    // Override processCursorMove to prevent double input processing
    Window_TalkChoice.prototype.processCursorMove = function() {
        // Prevent processing the same input multiple times in the same frame
        const currentFrame = Graphics.frameCount;
        if (this._lastProcessedFrame === currentFrame) {
            return;
        }
        
        if (this.isCursorMovable()) {
            const lastIndex = this.index();
            if (Input.isRepeated("down")) {
                this.cursorDown(Input.isTriggered("down"));
                this._lastProcessedFrame = currentFrame;
            }
            if (Input.isRepeated("up")) {
                this.cursorUp(Input.isTriggered("up"));
                this._lastProcessedFrame = currentFrame;
            }
            if (Input.isRepeated("right")) {
                this.cursorRight(Input.isTriggered("right"));
                this._lastProcessedFrame = currentFrame;
            }
            if (Input.isRepeated("left")) {
                this.cursorLeft(Input.isTriggered("left"));
                this._lastProcessedFrame = currentFrame;
            }
            if (!this.isHandled("pagedown") && Input.isTriggered("pagedown")) {
                this.cursorPagedown();
                this._lastProcessedFrame = currentFrame;
            }
            if (!this.isHandled("pageup") && Input.isTriggered("pageup")) {
                this.cursorPageup();
                this._lastProcessedFrame = currentFrame;
            }
            if (this.index() !== lastIndex) {
                this.playCursorSound();
            }
        }
    };

    Window_TalkChoice.prototype.makeCommandList = function() {
        const choices = getChoices();
        const scene = SceneManager._scene;
        const enemy = $gameTroop.aliveMembers()[0];
        
        if (!enemy) {
            // If no enemy, show options without percentages
            this.addCommand(choices[0], 'chat');
            this.addCommand(choices[1], 'joinParty');
            this.addCommand(choices[2], 'surrender');
            this.addCommand(choices[3], 'insult');
            this.addCommand(choices[4], 'throwStone');
            this.addCommand(choices[5], 'pet');
            this.addCommand(choices[6], 'cancel');
            return;
        }
        
        const canTalk = enemy.canTalk();
        
        // Calculate success chances
        const chatChance = canTalk ? scene.calculateTalkSuccessChance() : 0;
        const surrenderChance = canTalk ? scene.calculateTalkSuccessChance() : 0;
        const joinChance = scene.calculateJoinSuccessChance();
        const petChance = scene.calculatePetSuccessChance();
        
        // Add commands with percentages
        // Chat - only available for talking enemies
        if (canTalk) {
            this.addCommand(`${choices[0]} (${chatChance}%)`, 'chat');
        } else {
            this.addCommand(`${choices[0]} (0%)`, 'chat');
        }
        
        // Join Party - works for all enemies now
        this.addCommand(`${choices[1]} (${joinChance}%)`, 'joinParty');
        
        // Ask to Surrender - only available for talking enemies
        if (canTalk) {
            this.addCommand(`${choices[2]} (${surrenderChance}%)`, 'surrender');
        } else {
            this.addCommand(`${choices[2]} (0%)`, 'surrender');
        }
        
        // Insult - only available for talking enemies
        if (canTalk) {
            this.addCommand(`${choices[3]} (100%)`, 'insult');
        } else {
            this.addCommand(`${choices[3]} (0%)`, 'insult');
        }
        
        // Throw Stone - always works (100%)
        this.addCommand(`${choices[4]} (100%)`, 'throwStone');
        
        // Pet - works for all enemies
        this.addCommand(`${choices[5]} (${petChance}%)`, 'pet');
        
        // Cancel - no percentage
        this.addCommand(choices[6], 'cancel');
    };

})();